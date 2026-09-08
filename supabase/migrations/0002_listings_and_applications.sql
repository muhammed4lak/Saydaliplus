-- Listings, applications, and the server-side fee calculation.

create type public.listing_type as enum ('shift', 'internship');
create type public.listing_status as enum ('open', 'filled', 'cancelled');
create type public.rate_type as enum ('hourly', 'flat');
create type public.application_status as enum ('applied', 'accepted', 'rejected', 'withdrawn');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.profiles (id) on delete cascade,
  type public.listing_type not null,
  status public.listing_status not null default 'open',
  district text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  rate_type public.rate_type,
  rate_amount numeric(12, 2),
  total_amount numeric(12, 2),
  includes_controlled boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),

  constraint listings_ends_after_start check (ends_at > starts_at),

  -- Internships have no rate; shifts must have one. Enforced here rather than in
  -- the form, because the fee engine downstream assumes it.
  constraint listings_pricing_matches_type check (
    case type
      when 'internship' then rate_type is null and rate_amount is null and total_amount is null
      when 'shift' then rate_type is not null and rate_amount > 0 and total_amount > 0
    end
  )
);

create index listings_browse_idx on public.listings (type, status, district, starts_at);
create index listings_pharmacy_idx on public.listings (pharmacy_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Pricing is derived on the server.
--
-- The client sends a rate; it does not get to send the total, because the total
-- is what every fee is computed from. Hourly totals come from the shift window,
-- which is also where the crossing-midnight case is handled: ends_at is a real
-- timestamp, so 22:00-06:00 is stored as an eight-hour interval and needs no
-- special casing here.
-- ---------------------------------------------------------------------------

create or replace function public.listing_hours(starts_at timestamptz, ends_at timestamptz)
returns numeric
language sql
immutable
as $$
  select round((extract(epoch from (ends_at - starts_at)) / 3600)::numeric, 2);
$$;

create or replace function public.set_listing_total()
returns trigger
language plpgsql
as $$
begin
  if new.type = 'internship' then
    new.rate_type := null;
    new.rate_amount := null;
    new.total_amount := null;
  elsif new.rate_type = 'hourly' then
    new.total_amount := round(new.rate_amount * public.listing_hours(new.starts_at, new.ends_at), 2);
  else
    -- Flat: the pharmacy named the total, and the implied hourly rate is shown
    -- back to them in the UI rather than stored.
    new.total_amount := new.rate_amount;
  end if;
  return new;
end;
$$;

create trigger listings_set_total
  before insert or update on public.listings
  for each row execute function public.set_listing_total();

-- ---------------------------------------------------------------------------
-- The fee engine, mirrored in SQL.
--
-- This duplicates src/config/fees.ts. That is a deliberate trade: money columns
-- on a booking are written by a trigger so a client cannot post its own fees,
-- and a trigger cannot call TypeScript. tests/unit/fee-parity.test.ts runs the
-- same cases through both implementations so the duplication cannot drift
-- silently — if you change one, that test fails until you change the other.
-- ---------------------------------------------------------------------------

create table public.fee_config (
  id boolean primary key default true check (id),
  total_commission_rate numeric not null default 0.10,
  pharmacy_share numeric not null default 0.70,
  minimum_commission_iqd numeric not null default 2500,
  trial_days int not null default 30,
  processor_fee_rate numeric not null default 0.02
);

insert into public.fee_config (id) values (true);

create type public.fee_breakdown as (
  gross_amount numeric,
  pharmacy_fee numeric,
  pharmacist_fee numeric,
  pharmacy_charge numeric,
  pharmacist_net numeric,
  platform_gross numeric,
  processor_fee numeric,
  platform_net numeric,
  floor_applied boolean
);

create or replace function public.calculate_fees(
  gross_amount numeric,
  pharmacy_in_trial boolean,
  pharmacist_in_trial boolean
)
returns public.fee_breakdown
language plpgsql
stable
as $$
declare
  cfg public.fee_config;
  percentage_commission numeric;
  chargeable numeric;
  full_pharmacy_fee numeric;
  full_pharmacist_fee numeric;
  result public.fee_breakdown;
begin
  if gross_amount is null or gross_amount < 0 then
    raise exception 'Invalid gross amount: %', gross_amount;
  end if;

  select * into cfg from public.fee_config where id;

  percentage_commission := gross_amount * cfg.total_commission_rate;
  result.floor_applied := gross_amount > 0 and percentage_commission < cfg.minimum_commission_iqd;

  chargeable := case
    when gross_amount = 0 then 0
    else greatest(percentage_commission, cfg.minimum_commission_iqd)
  end;

  full_pharmacy_fee := round(chargeable * cfg.pharmacy_share);
  -- Derived by subtraction so both sides always reconcile to the commission.
  full_pharmacist_fee := round(chargeable) - full_pharmacy_fee;

  result.gross_amount := gross_amount;
  result.pharmacy_fee := case when pharmacy_in_trial then 0 else full_pharmacy_fee end;
  result.pharmacist_fee := case when pharmacist_in_trial then 0 else full_pharmacist_fee end;
  result.pharmacy_charge := gross_amount + result.pharmacy_fee;
  result.pharmacist_net := gross_amount - result.pharmacist_fee;
  result.platform_gross := result.pharmacy_fee + result.pharmacist_fee;
  result.processor_fee := round(result.pharmacist_net * cfg.processor_fee_rate);
  result.platform_net := result.platform_gross - result.processor_fee;
  result.floor_applied := result.floor_applied
    and not (pharmacy_in_trial and pharmacist_in_trial);

  return result;
end;
$$;

create or replace function public.is_in_trial(signup_date timestamptz)
returns boolean
language sql
stable
as $$
  select now() < signup_date + ((select trial_days from public.fee_config where id) || ' days')::interval;
$$;

-- ---------------------------------------------------------------------------
-- Applications.
-- ---------------------------------------------------------------------------

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status not null default 'applied',
  created_at timestamptz not null default now(),
  unique (listing_id, applicant_id)
);

create index applications_listing_idx on public.applications (listing_id, status);
create index applications_applicant_idx on public.applications (applicant_id, created_at desc);

-- An application may only be made to an open listing, by an account whose role
-- suits the listing type, and never to your own listing.
create or replace function public.guard_application_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target public.listings;
  applicant_role public.user_role;
  applicant_status public.verification_status;
begin
  select * into target from public.listings where id = new.listing_id;
  if target is null then
    raise exception 'No such listing';
  end if;
  if target.status <> 'open' then
    raise exception 'This listing is no longer open';
  end if;
  if target.pharmacy_id = new.applicant_id then
    raise exception 'A pharmacy cannot apply to its own listing';
  end if;

  select role, verification_status into applicant_role, applicant_status
  from public.profiles where id = new.applicant_id;

  if applicant_status = 'rejected' then
    raise exception 'This account was not verified';
  end if;

  if target.type = 'shift' and applicant_role <> 'pharmacist' then
    raise exception 'Only pharmacists may apply to paid shifts';
  end if;
  if target.type = 'internship' and applicant_role <> 'student' then
    raise exception 'Only students may apply to internships';
  end if;

  return new;
end;
$$;

create trigger applications_guard_insert
  before insert on public.applications
  for each row execute function public.guard_application_insert();

-- ---------------------------------------------------------------------------
-- Row Level Security.
--
-- The listings and applications policies each need to ask about the other table:
-- a pharmacist may read the listing they applied to, and a pharmacy may read the
-- applications to listings it owns. Written as plain subqueries those two
-- policies invoke each other and Postgres rejects the pair with "infinite
-- recursion detected in policy". These SECURITY DEFINER helpers answer the
-- cross-table question with RLS bypassed, which breaks the cycle. Each one is
-- scoped to auth.uid() internally, so it cannot be used to ask about anyone else.
-- ---------------------------------------------------------------------------

create or replace function public.caller_owns_listing(listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.listings l
    where l.id = listing_id and l.pharmacy_id = auth.uid()
  );
$$;

create or replace function public.caller_applied_to(listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.applications a
    where a.listing_id = caller_applied_to.listing_id and a.applicant_id = auth.uid()
  );
$$;

create or replace function public.profile_is_verified(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = profile_id and p.verification_status = 'verified'
  );
$$;

alter table public.listings enable row level security;
alter table public.applications enable row level security;
alter table public.fee_config enable row level security;

-- Browsing is open to any signed-in account, verified or not: a pharmacist
-- waiting a week on the Syndicate can see what they are waiting for. What they
-- cannot do is act, which the INSERT policies below enforce.
create policy listings_select_open on public.listings
  for select using (
    status = 'open'
    or pharmacy_id = auth.uid()
    or public.is_platform_admin()
    or public.caller_applied_to(id)
  );

create policy listings_insert_by_verified_pharmacy on public.listings
  for insert with check (
    pharmacy_id = auth.uid()
    and public.current_role_of_caller() = 'pharmacy'
    and public.is_verified()
  );

create policy listings_update_own on public.listings
  for update using (pharmacy_id = auth.uid() or public.is_platform_admin())
  with check (pharmacy_id = auth.uid() or public.is_platform_admin());

-- Applying while verification is pending is allowed, and the application is held
-- back from the pharmacy until it clears. A week of read-only access is a real
-- churn risk on the side of the market we most need; showing an owner an
-- unvetted name is the risk we are not willing to take. So the queue is this
-- SELECT predicate: the applicant always sees their own application, and the
-- pharmacy sees it only once the applicant is verified.
create policy applications_select_own on public.applications
  for select using (
    applicant_id = auth.uid()
    or public.is_platform_admin()
    or (public.caller_owns_listing(listing_id) and public.profile_is_verified(applicant_id))
  );

create policy applications_insert_own on public.applications
  for insert with check (applicant_id = auth.uid());

-- The applicant may withdraw; the pharmacy may accept or reject, but only an
-- application it is allowed to see in the first place.
create policy applications_update_by_party on public.applications
  for update using (
    applicant_id = auth.uid()
    or (public.caller_owns_listing(listing_id) and public.profile_is_verified(applicant_id))
    or public.is_platform_admin()
  );

create policy fee_config_readable on public.fee_config
  for select using (true);
