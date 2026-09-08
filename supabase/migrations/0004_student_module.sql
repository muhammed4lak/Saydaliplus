-- Placements, the twelve-week logbook, and monthly approval.
--
-- The logbook's whole value is that it is contemporaneous. A record assembled the
-- night before the certificate is needed proves nothing, so the weeks unlock
-- forward one at a time and the database — not the form — is what enforces it.
-- The rules here mirror src/lib/logbook.ts.

create type public.placement_status as enum ('active', 'completed', 'withdrawn');
create type public.log_week_status as enum ('locked', 'draft', 'submitted', 'approved');

create table public.placements (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  pharmacy_id uuid not null references public.profiles (id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  status public.placement_status not null default 'active',
  created_at timestamptz not null default now(),
  constraint placements_ends_after_start check (ends_on > starts_on),
  -- A student does one summer training at a time.
  unique (student_id, listing_id)
);

create table public.log_weeks (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid not null references public.placements (id) on delete cascade,
  week_no int not null check (week_no between 1 and 12),
  week_start date not null,
  week_end date not null,
  -- Sunday..Thursday. Friday and Saturday are the Iraqi weekend, so a five-day
  -- array is the working week, not a truncated seven.
  days_present boolean[] not null default array[false, false, false, false, false],
  text_en text,
  text_ar text,
  status public.log_week_status not null default 'locked',
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),

  unique (placement_id, week_no),
  constraint log_weeks_five_working_days check (array_length(days_present, 1) = 5)
);

create index log_weeks_placement_idx on public.log_weeks (placement_id, week_no);

create table public.month_approvals (
  placement_id uuid not null references public.placements (id) on delete cascade,
  month_no int not null check (month_no between 1 and 3),
  approved_by uuid references public.profiles (id),
  approved_at timestamptz,
  returned_at timestamptz,
  returned_note text,
  primary key (placement_id, month_no)
);

-- ---------------------------------------------------------------------------
-- Logbook rules.
-- ---------------------------------------------------------------------------

/** A week needs real substance before it counts as written. */
create or replace function public.log_week_is_submittable(week public.log_weeks)
returns boolean
language sql
immutable
as $$
  select week.status = 'draft'
    and coalesce(array_position(week.days_present, true), 0) > 0
    and length(trim(coalesce(week.text_ar, week.text_en, ''))) >= 80;
$$;

-- Creating a placement lays out all twelve weeks with only the first open. The
-- rest exist so the student can see the shape of the programme, but they cannot
-- be written until their turn comes.
create or replace function public.seed_placement_weeks()
returns trigger
language plpgsql
as $$
declare
  week_index int;
begin
  for week_index in 1..12 loop
    insert into public.log_weeks (placement_id, week_no, week_start, week_end, status)
    values (
      new.id,
      week_index,
      new.starts_on + ((week_index - 1) * 7),
      new.starts_on + ((week_index - 1) * 7) + 4,   -- Sunday to Thursday
      (case when week_index = 1 then 'draft' else 'locked' end)::public.log_week_status
    );
  end loop;

  for week_index in 1..3 loop
    insert into public.month_approvals (placement_id, month_no)
    values (new.id, week_index);
  end loop;

  return new;
end;
$$;

create trigger placements_seed_weeks
  after insert on public.placements
  for each row execute function public.seed_placement_weeks();

-- The student submits a week; the next one unlocks. This is the only way a week
-- reaches 'submitted', so the log genuinely fills forward.
create or replace function public.submit_log_week(week_id uuid)
returns public.log_weeks
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  week public.log_weeks;
  placement public.placements;
  updated public.log_weeks;
begin
  select * into week from public.log_weeks where id = week_id;
  if week is null then
    raise exception 'No such week';
  end if;

  select * into placement from public.placements where id = week.placement_id;
  if placement.student_id <> auth.uid() then
    raise exception 'Only the student on this placement may submit their log';
  end if;

  if week.status <> 'draft' then
    raise exception 'Week % is not open for writing', week.week_no;
  end if;
  if coalesce(array_position(week.days_present, true), 0) = 0 then
    raise exception 'Record at least one day of attendance before submitting';
  end if;
  if length(trim(coalesce(week.text_ar, week.text_en, ''))) < 80 then
    raise exception 'Describe what you learned in at least 80 characters';
  end if;

  perform set_config('app.logbook_transition', 'on', true);

  update public.log_weeks
  set status = 'submitted', submitted_at = now(), updated_at = now()
  where id = week.id
  returning * into updated;

  -- Unlock the next week.
  update public.log_weeks
  set status = 'draft', updated_at = now()
  where placement_id = week.placement_id
    and week_no = week.week_no + 1
    and status = 'locked';

  perform set_config('app.logbook_transition', 'off', true);

  return updated;
end;
$$;

create or replace function public.month_status(placement_id uuid, month_no int)
returns text
language sql
stable
as $$
  select case
    when count(*) = 0 then 'upcoming'
    when count(*) filter (where status = 'approved') = count(*) then 'approved'
    when count(*) filter (where status in ('approved', 'submitted')) = count(*) then 'ready'
    when count(*) filter (where status <> 'locked') > 0 then 'active'
    else 'upcoming'
  end
  from public.log_weeks w
  where w.placement_id = month_status.placement_id
    and ceil(w.week_no / 4.0) = month_status.month_no;
$$;

-- A month can only be approved once all four of its weeks are in.
create or replace function public.approve_month(placement_id uuid, month_no int)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  placement public.placements;
begin
  select * into placement from public.placements where id = approve_month.placement_id;
  if placement is null then
    raise exception 'No such placement';
  end if;
  if placement.pharmacy_id <> auth.uid() then
    raise exception 'Only the host pharmacy may approve a month';
  end if;
  if public.month_status(approve_month.placement_id, approve_month.month_no) <> 'ready' then
    raise exception 'All four weeks of month % must be submitted first', approve_month.month_no;
  end if;

  perform set_config('app.logbook_transition', 'on', true);

  update public.log_weeks
  set status = 'approved', updated_at = now()
  where log_weeks.placement_id = approve_month.placement_id
    and ceil(week_no / 4.0) = approve_month.month_no;

  perform set_config('app.logbook_transition', 'off', true);

  update public.month_approvals
  set approved_by = auth.uid(), approved_at = now(), returned_at = null
  where month_approvals.placement_id = approve_month.placement_id
    and month_approvals.month_no = approve_month.month_no;
end;
$$;

-- Returning a month puts its weeks back to draft for rewriting.
create or replace function public.return_month(placement_id uuid, month_no int, note text default null)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  placement public.placements;
  current_status text;
begin
  select * into placement from public.placements where id = return_month.placement_id;
  if placement is null then
    raise exception 'No such placement';
  end if;
  if placement.pharmacy_id <> auth.uid() then
    raise exception 'Only the host pharmacy may return a month';
  end if;

  current_status := public.month_status(return_month.placement_id, return_month.month_no);
  if current_status not in ('ready', 'approved') then
    raise exception 'Month % has nothing to return', return_month.month_no;
  end if;

  perform set_config('app.logbook_transition', 'on', true);

  update public.log_weeks
  set status = 'draft', submitted_at = null, updated_at = now()
  where log_weeks.placement_id = return_month.placement_id
    and ceil(week_no / 4.0) = return_month.month_no;

  perform set_config('app.logbook_transition', 'off', true);

  update public.month_approvals
  set approved_by = null, approved_at = null, returned_at = now(), returned_note = note
  where month_approvals.placement_id = return_month.placement_id
    and month_approvals.month_no = return_month.month_no;
end;
$$;

-- The student writes the content; the status is moved only by the functions
-- above. Without this a student could set a week to 'approved' directly, and the
-- forward-fill rule would be decorative.
--
-- The functions announce themselves with a transaction-local flag rather than
-- being exempted by their privileges: they run SECURITY DEFINER so that they can
-- read the placement, which means the trigger cannot tell them apart from the
-- student's own UPDATE by role alone. The flag is set immediately before each
-- state change and cleared after, so it cannot be left standing for a later
-- statement, and a client cannot set it — `set_config(..., true)` is
-- transaction-scoped and PostgREST starts a fresh transaction per request.
create or replace function public.guard_log_week_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null
     or current_setting('app.logbook_transition', true) = 'on' then
    return new;
  end if;

  if new.status is distinct from old.status
     or new.submitted_at is distinct from old.submitted_at
     or new.week_no is distinct from old.week_no
     or new.placement_id is distinct from old.placement_id then
    raise exception 'A log week''s status changes by submission and approval, not by direct edit';
  end if;

  if old.status <> 'draft' then
    raise exception 'Week % is not open for writing', old.week_no;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger log_weeks_guard_update
  before update on public.log_weeks
  for each row execute function public.guard_log_week_update();

-- ---------------------------------------------------------------------------
-- The certificate.
--
-- Unlocks only when all three months are approved. Note what this is not: the
-- platform cannot issue the credential a university actually requires — that
-- remains the pharmacy's own letter or stamp. What we solve is the matching and
-- the record-keeping, and the wording in the UI says so.
-- ---------------------------------------------------------------------------

-- Owner rights with an explicit party filter, the same pattern as
-- applicant_cards: the certificate joins student_details, which RLS correctly
-- keeps private to the student, but the host pharmacy issuing the placement has
-- to be able to see the record it is attesting to. Both parties, nobody else.
create view public.placement_certificates
with (security_invoker = false)
as
select
  p.id as placement_id,
  p.student_id,
  p.pharmacy_id,
  p.starts_on,
  p.ends_on,
  sd.university,
  count(w.id) filter (where w.status = 'approved') as weeks_approved,
  coalesce(sum(
    (select count(*) from unnest(w.days_present) as day where day)
  ) filter (where w.status = 'approved'), 0) as days_attended,
  count(w.id) filter (where w.status = 'approved') * 5 as days_possible,
  (
    public.month_status(p.id, 1) = 'approved'
    and public.month_status(p.id, 2) = 'approved'
    and public.month_status(p.id, 3) = 'approved'
  ) as unlocked
from public.placements p
join public.student_details sd on sd.profile_id = p.student_id
left join public.log_weeks w on w.placement_id = p.id
where p.student_id = auth.uid() or p.pharmacy_id = auth.uid() or public.is_platform_admin()
group by p.id, sd.university;

-- ---------------------------------------------------------------------------
-- Accepting a student.
--
-- Redefines accept_application() now that placements exist: the shift path is
-- unchanged, and an internship creates a placement (and with it twelve weeks and
-- three month rows) instead of a booking. No money is involved either way —
-- internships carry no rate, so no fee is calculated.
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
  if applicant.verification_status <> 'verified' then
    raise exception 'This applicant is still being verified';
  end if;

  select * into pharmacy from public.profiles where id = target.pharmacy_id;

  update public.listings set status = 'filled' where id = target.id;
  update public.applications set status = 'accepted' where id = app.id;
  update public.applications set status = 'rejected'
    where listing_id = target.id and id <> app.id and status = 'applied';

  if target.type = 'internship' then
    insert into public.placements (listing_id, student_id, pharmacy_id, starts_on, ends_on)
    values (target.id, applicant.id, pharmacy.id,
            target.starts_at::date, target.ends_at::date);
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
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.placements enable row level security;
alter table public.log_weeks enable row level security;
alter table public.month_approvals enable row level security;

create policy placements_by_party on public.placements
  for select using (
    student_id = auth.uid() or pharmacy_id = auth.uid() or public.is_platform_admin()
  );

-- A host pharmacy reads its own trainee's log and nobody else's. A student's
-- weekly account of what they got wrong is not material for other pharmacies.
create or replace function public.caller_is_placement_party(placement_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.placements p
    where p.id = placement_id
      and (p.student_id = auth.uid() or p.pharmacy_id = auth.uid())
  );
$$;

create or replace function public.caller_is_placement_student(placement_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.placements p
    where p.id = placement_id and p.student_id = auth.uid()
  );
$$;

create policy log_weeks_select_by_party on public.log_weeks
  for select using (
    public.caller_is_placement_party(placement_id) or public.is_platform_admin()
  );

create policy log_weeks_update_by_student on public.log_weeks
  for update using (public.caller_is_placement_student(placement_id))
  with check (public.caller_is_placement_student(placement_id));

create policy month_approvals_by_party on public.month_approvals
  for select using (
    public.caller_is_placement_party(placement_id) or public.is_platform_admin()
  );
