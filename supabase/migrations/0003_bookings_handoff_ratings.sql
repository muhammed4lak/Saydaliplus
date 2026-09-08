-- Bookings, the handoff record, ratings, and the derived statistics.

create type public.booking_status as enum ('upcoming', 'completed', 'no_show', 'cancelled');

-- How much notice a cancellation gave. A pharmacist who withdraws with two days'
-- notice has done nothing wrong and must not be scored as if they had — penalising
-- that pushes people to accept shifts they cannot work, which is worse for the
-- pharmacy than an early withdrawal. Thresholds live in src/lib/reliability.ts.
create type public.cancellation_outcome as enum ('free', 'late', 'no_show');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.listings (id) on delete cascade,
  pharmacist_id uuid not null references public.profiles (id) on delete cascade,
  pharmacy_id uuid not null references public.profiles (id) on delete cascade,
  status public.booking_status not null default 'upcoming',

  -- Terms are snapshotted at acceptance. If the commission changes next quarter,
  -- a booking agreed today still settles on today's numbers.
  gross_amount numeric(12, 2) not null,
  pharmacy_fee numeric(12, 2) not null,
  pharmacist_fee numeric(12, 2) not null,
  net_payout numeric(12, 2) not null,

  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles (id),
  cancellation_outcome public.cancellation_outcome,
  completed_at timestamptz,
  created_at timestamptz not null default now(),

  constraint bookings_completed_at_set check (
    (status = 'completed') = (completed_at is not null)
  )
);

create index bookings_pharmacist_idx on public.bookings (pharmacist_id, status);
create index bookings_pharmacy_idx on public.bookings (pharmacy_id, status);

-- ---------------------------------------------------------------------------
-- The handoff record.
--
-- Five items, ticked jointly at the start of a shift and confirmed by both
-- parties. This is not a checklist widget: it is what completes the booking, what
-- increments the pharmacist's verified statistics, and the evidence gate that any
-- later incident report has to clear. Treat it as the evidentiary backbone it is.
-- ---------------------------------------------------------------------------

create table public.handoffs (
  booking_id uuid primary key references public.bookings (id) on delete cascade,
  items jsonb not null default '{
    "controlled_register_counted": false,
    "till_float_agreed": false,
    "fridge_log_checked": false,
    "keys_alarm_safe_handed_over": false,
    "owner_emergency_contact_confirmed": false
  }'::jsonb,
  started_at timestamptz not null default now(),
  confirmed_by_pharmacist_at timestamptz,
  confirmed_by_pharmacy_at timestamptz
);

create or replace function public.handoff_items_all_ticked(items jsonb)
returns boolean
language sql
immutable
as $$
  select not exists (
    select 1 from jsonb_each(items) as entry(key, value)
    where value <> 'true'::jsonb
  );
$$;

-- Neither party may confirm until all five items are ticked. The prototype
-- disabled the button; a disabled button is a suggestion, so it is a constraint
-- here as well.
create or replace function public.guard_handoff_confirmation()
returns trigger
language plpgsql
as $$
begin
  if (new.confirmed_by_pharmacist_at is not null or new.confirmed_by_pharmacy_at is not null)
     and not public.handoff_items_all_ticked(new.items) then
    raise exception 'All five handoff items must be agreed before either party confirms';
  end if;

  -- A confirmation, once given, is part of the record and cannot be retracted.
  if tg_op = 'UPDATE' then
    if old.confirmed_by_pharmacist_at is not null
       and new.confirmed_by_pharmacist_at is distinct from old.confirmed_by_pharmacist_at then
      raise exception 'A handoff confirmation cannot be withdrawn';
    end if;
    if old.confirmed_by_pharmacy_at is not null
       and new.confirmed_by_pharmacy_at is distinct from old.confirmed_by_pharmacy_at then
      raise exception 'A handoff confirmation cannot be withdrawn';
    end if;
  end if;

  return new;
end;
$$;

create trigger handoffs_guard_confirmation
  before insert or update on public.handoffs
  for each row execute function public.guard_handoff_confirmation();

-- Both confirmations complete the booking. This is the only path to 'completed',
-- which is what makes the derived statistics mean something.
create or replace function public.complete_booking_on_dual_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.confirmed_by_pharmacist_at is not null and new.confirmed_by_pharmacy_at is not null then
    update public.bookings
    set status = 'completed', completed_at = now()
    where id = new.booking_id and status = 'upcoming';
  end if;
  return new;
end;
$$;

create trigger handoffs_complete_booking
  after insert or update on public.handoffs
  for each row execute function public.complete_booking_on_dual_confirmation();

-- ---------------------------------------------------------------------------
-- Ratings.
-- ---------------------------------------------------------------------------

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  rater_id uuid not null references public.profiles (id) on delete cascade,
  ratee_id uuid not null references public.profiles (id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  -- One rating per person per booking, in each direction.
  unique (booking_id, rater_id)
);

create index ratings_ratee_idx on public.ratings (ratee_id);

-- You may only rate the other party to a booking you were part of, and only once
-- it is finished.
create or replace function public.guard_rating_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  b public.bookings;
begin
  select * into b from public.bookings where id = new.booking_id;
  if b is null then
    raise exception 'No such booking';
  end if;
  if b.status <> 'completed' then
    raise exception 'A booking can only be rated once it is completed';
  end if;

  if not (
    (new.rater_id = b.pharmacist_id and new.ratee_id = b.pharmacy_id)
    or (new.rater_id = b.pharmacy_id and new.ratee_id = b.pharmacist_id)
  ) then
    raise exception 'Only the two parties to a booking may rate each other';
  end if;

  return new;
end;
$$;

create trigger ratings_guard_insert
  before insert on public.ratings
  for each row execute function public.guard_rating_insert();

-- ---------------------------------------------------------------------------
-- Accepting an applicant.
--
-- One transaction: create the booking on the platform's own fee terms, close the
-- listing, and turn down everyone else. Fees are computed here rather than sent
-- by the client, because the client is the party that benefits from getting them
-- wrong.
-- ---------------------------------------------------------------------------

create or replace function public.accept_application(application_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  app public.applications;
  target public.listings;
  applicant public.profiles;
  pharmacy public.profiles;
  fees public.fee_breakdown;
  new_booking public.bookings;
begin
  select * into app from public.applications where id = application_id;
  if app is null then
    raise exception 'No such application';
  end if;

  select * into target from public.listings where id = app.listing_id;
  if target.pharmacy_id <> auth.uid() then
    raise exception 'Only the pharmacy that posted this listing may accept an applicant';
  end if;
  if target.status <> 'open' then
    raise exception 'This listing is no longer open';
  end if;
  if app.status <> 'applied' then
    raise exception 'This application is no longer pending';
  end if;

  select * into applicant from public.profiles where id = app.applicant_id;
  -- The queued-application rule, restated at the point of action: an applicant
  -- held back during verification must not become acceptable by any other route.
  if applicant.verification_status <> 'verified' then
    raise exception 'This applicant is still being verified';
  end if;

  select * into pharmacy from public.profiles where id = target.pharmacy_id;

  update public.listings set status = 'filled' where id = target.id;
  update public.applications set status = 'accepted' where id = app.id;
  update public.applications set status = 'rejected'
    where listing_id = target.id and id <> app.id and status = 'applied';

  -- Internships create a placement, not a booking; that path lives in 0004.
  if target.type = 'internship' then
    return null;
  end if;

  fees := public.calculate_fees(
    target.total_amount,
    public.is_in_trial(pharmacy.created_at),
    public.is_in_trial(applicant.created_at)
  );

  insert into public.bookings (
    listing_id, pharmacist_id, pharmacy_id,
    gross_amount, pharmacy_fee, pharmacist_fee, net_payout
  )
  values (
    target.id, applicant.id, pharmacy.id,
    fees.gross_amount, fees.pharmacy_fee, fees.pharmacist_fee, fees.pharmacist_net
  )
  returning * into new_booking;

  insert into public.handoffs (booking_id) values (new_booking.id);

  return new_booking;
end;
$$;

-- ---------------------------------------------------------------------------
-- Derived statistics.
--
-- Never columns. A CV's credibility rests entirely on these being computed from
-- the booking and rating record rather than typed in, and a view cannot be
-- written to. Reliability follows the definition in src/lib/reliability.ts:
-- completed over accepted, with adequately-notified cancellations removed from
-- both sides, and null rather than 100% for an account with no history.
--
-- This view runs with the *owner's* rights (security_invoker off) on purpose. A
-- pharmacy deciding whether to hand its keys to a stranger has to be able to read
-- that stranger's record, and RLS on `bookings` correctly hides the bookings
-- themselves. What crosses that boundary is only the aggregate — counts, an
-- average, a percentage. No booking, no counterparty, no money, no rating text.
-- ---------------------------------------------------------------------------

create view public.pharmacist_stats
with (security_invoker = false)
as
select
  p.id as pharmacist_id,
  count(b.id) filter (where b.status = 'completed') as shifts_completed,
  coalesce(sum(public.listing_hours(l.starts_at, l.ends_at))
    filter (where b.status = 'completed'), 0) as hours_worked,
  count(distinct b.pharmacy_id) filter (where b.status = 'completed') as pharmacies_worked_with,
  (select round(avg(r.stars), 2) from public.ratings r where r.ratee_id = p.id) as average_rating,
  (select count(*) from public.ratings r where r.ratee_id = p.id) as ratings_received,
  -- Denominator: everything the pharmacist accepted and then either worked,
  -- failed to turn up for, or dropped too late to be covered. Free cancellations
  -- are excluded from both sides, exactly as in the TypeScript.
  case
    when count(b.id) filter (
      where b.status = 'completed'
        or b.cancellation_outcome in ('late', 'no_show')
    ) = 0 then null
    else round(
      100.0 * count(b.id) filter (where b.status = 'completed')
      / count(b.id) filter (
          where b.status = 'completed'
            or b.cancellation_outcome in ('late', 'no_show')
        )
    )
  end as reliability_percent,
  p.created_at as member_since
from public.profiles p
left join public.bookings b on b.pharmacist_id = p.id
left join public.listings l on l.id = b.listing_id
where p.role = 'pharmacist'
group by p.id;

-- ---------------------------------------------------------------------------
-- Cancelling a booking.
--
-- Classifies the withdrawal by notice given, so reliability reflects what
-- actually happened to the pharmacy rather than a raw count of cancellations.
-- ---------------------------------------------------------------------------

create or replace function public.cancel_booking(booking_id uuid, reason text default null)
returns public.bookings
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  b public.bookings;
  shift_start timestamptz;
  hours_of_notice numeric;
  outcome public.cancellation_outcome;
  updated public.bookings;
begin
  select * into b from public.bookings where id = cancel_booking.booking_id;
  if b is null then
    raise exception 'No such booking';
  end if;
  if b.pharmacist_id <> auth.uid() and b.pharmacy_id <> auth.uid() then
    raise exception 'Only a party to this booking may cancel it';
  end if;
  if b.status <> 'upcoming' then
    raise exception 'Only an upcoming booking can be cancelled';
  end if;

  select l.starts_at into shift_start from public.listings l where l.id = b.listing_id;
  hours_of_notice := extract(epoch from (shift_start - now())) / 3600;

  outcome := case
    when hours_of_notice >= 48 then 'free'
    when hours_of_notice >= 2 then 'late'
    else 'no_show'
  end::public.cancellation_outcome;

  -- Only the pharmacist's withdrawal reflects on the pharmacist. A pharmacy that
  -- cancels has not made the pharmacist unreliable, so the outcome is recorded
  -- but left off their ratio.
  update public.bookings
  set status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = auth.uid(),
      cancellation_outcome = case when b.pharmacist_id = auth.uid() then outcome else 'free' end
  where id = b.id
  returning * into updated;

  -- The shift still needs covering.
  update public.listings set status = 'open' where id = b.listing_id;

  return updated;
end;
$$;

-- ---------------------------------------------------------------------------
-- The applicant card.
--
-- What a pharmacy is allowed to see about someone applying to its shift, and
-- nothing more. `profiles` itself stays locked to its owner (it carries a phone
-- number and a home district); this is the narrow projection that crosses the
-- boundary, filtered to the requesting pharmacy's own listings.
--
-- The Syndicate number is masked to its last two characters. It is shown at all
-- because it is the one real accountability anchor in Iraqi pharmacy — an owner
-- seeing it knows the person is a real registrant — and masked because a full
-- registry number in the hands of every pharmacy that ever received an
-- application is a gift to anyone impersonating a pharmacist.
-- ---------------------------------------------------------------------------

create or replace function public.mask_registration(reg_no text)
returns text
language sql
immutable
as $$
  select case
    when reg_no is null or length(reg_no) < 2 then '••••'
    else '••••' || right(reg_no, 2)
  end;
$$;

create view public.applicant_cards
with (security_invoker = false)
as
select
  a.id as application_id,
  a.listing_id,
  a.status as application_status,
  a.created_at as applied_at,
  l.pharmacy_id,
  p.id as applicant_id,
  p.role as applicant_role,
  p.full_name_en,
  p.full_name_ar,
  p.district,
  public.mask_registration(pd.syndicate_reg_no) as syndicate_reg_masked,
  pd.graduation_year,
  pd.scope_tags,
  sd.university,
  s.shifts_completed,
  s.average_rating,
  s.reliability_percent,
  s.member_since
from public.applications a
join public.listings l on l.id = a.listing_id
join public.profiles p on p.id = a.applicant_id
left join public.pharmacist_details pd on pd.profile_id = p.id
left join public.student_details sd on sd.profile_id = p.id
left join public.pharmacist_stats s on s.pharmacist_id = p.id
where l.pharmacy_id = auth.uid()
  -- The queued-application rule again. An application made while the Syndicate
  -- review is still running is the applicant's own business until it clears.
  and p.verification_status = 'verified';

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.bookings enable row level security;
alter table public.handoffs enable row level security;
alter table public.ratings enable row level security;

create policy bookings_select_by_party on public.bookings
  for select using (
    pharmacist_id = auth.uid() or pharmacy_id = auth.uid() or public.is_platform_admin()
  );

-- Bookings are created only by accept_application(); there is no direct insert.
create policy bookings_update_by_party on public.bookings
  for update using (
    pharmacist_id = auth.uid() or pharmacy_id = auth.uid() or public.is_platform_admin()
  );

create policy handoffs_by_booking_party on public.handoffs
  for all using (
    exists (
      select 1 from public.bookings b
      where b.id = handoffs.booking_id
        and (b.pharmacist_id = auth.uid() or b.pharmacy_id = auth.uid())
    )
    or public.is_platform_admin()
  )
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = handoffs.booking_id
        and (b.pharmacist_id = auth.uid() or b.pharmacy_id = auth.uid())
    )
    or public.is_platform_admin()
  );

-- You can read what you wrote and what was written about you — and nothing about
-- anyone else. Aggregates reach a pharmacy through pharmacist_stats, not here.
create policy ratings_select_by_party on public.ratings
  for select using (
    rater_id = auth.uid() or ratee_id = auth.uid() or public.is_platform_admin()
  );

create policy ratings_insert_own on public.ratings
  for insert with check (rater_id = auth.uid());
