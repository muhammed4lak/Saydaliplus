-- Profiles, the three role detail tables, and the verification queue.
--
-- Verification is a human reading a photograph. Iraq has no digital pharmacist
-- registry and the Syndicate's processes are paper-based, so there is no API to
-- call: an admin looks at the uploaded card or licence and decides. The schema
-- reflects that reality rather than a check that does not exist.

-- Case-insensitive text, so a student cannot register the same university
-- address twice by changing its capitalisation.
create extension if not exists citext;

create type public.user_role as enum ('pharmacist', 'pharmacy', 'student');
create type public.verification_status as enum ('pending', 'verified', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name_en text,
  full_name_ar text,
  phone text,
  district text,
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),

  -- A name has to exist in at least one script.
  constraint profiles_has_a_name check (
    coalesce(full_name_en, full_name_ar) is not null
  ),
  constraint profiles_verified_at_set check (
    (verification_status = 'verified') = (verified_at is not null)
  )
);

create table public.pharmacist_details (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  syndicate_reg_no text not null,
  graduation_year int not null check (graduation_year between 1950 and extract(year from now())::int),
  card_document_url text,
  scope_tags text[] not null default '{}',
  districts text[] not null default '{}',
  available boolean not null default true
);

-- One licensed pharmacist may own only one pharmacy under Iraqi law, so the
-- registration number is unique across the platform and there is no notion of a
-- multi-branch account.
create unique index pharmacist_details_syndicate_reg_no_key
  on public.pharmacist_details (lower(syndicate_reg_no));

create table public.pharmacy_details (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  pharmacy_name_en text,
  pharmacy_name_ar text,
  licence_no text not null,
  address text,
  licence_document_url text,
  constraint pharmacy_has_a_name check (
    coalesce(pharmacy_name_en, pharmacy_name_ar) is not null
  )
);

create unique index pharmacy_details_licence_no_key
  on public.pharmacy_details (lower(licence_no));

create table public.student_details (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  university text not null,
  university_email citext not null unique,
  email_verified_at timestamptz
);

-- Who may work the verification queue. Deliberately a table rather than a claim
-- on the profile: platform staff are not marketplace participants.
create table public.platform_admins (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  granted_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers.
--
-- These are SECURITY DEFINER so that a policy on `profiles` can ask about the
-- caller's own profile without recursing into that same policy.
-- ---------------------------------------------------------------------------

create or replace function public.current_role_of_caller()
returns public.user_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_verified()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select verification_status = 'verified' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.platform_admins where profile_id = auth.uid());
$$;

-- Stamp verified_at whenever an admin flips the status, so the two can never
-- disagree and the check constraint above always holds.
create or replace function public.stamp_verification()
returns trigger
language plpgsql
as $$
begin
  if new.verification_status = 'verified' and old.verification_status is distinct from 'verified' then
    new.verified_at := now();
    new.rejection_reason := null;
  elsif new.verification_status <> 'verified' then
    new.verified_at := null;
  end if;
  return new;
end;
$$;

create trigger profiles_stamp_verification
  before update on public.profiles
  for each row execute function public.stamp_verification();

-- A user must never be able to verify themselves, nor change the role their
-- account was created under. RLS grants the UPDATE; this decides what may change.
create or replace function public.guard_profile_self_update()
returns trigger
language plpgsql
as $$
begin
  -- Reviewers act through the admin queue; the service role acts on behalf of
  -- the platform itself (migrations, the student email-confirmation callback).
  -- A signed-in marketplace account is neither.
  if auth.uid() is null or public.is_platform_admin() then
    return new;
  end if;

  if new.role is distinct from old.role
     or new.verification_status is distinct from old.verification_status
     or new.verified_at is distinct from old.verified_at then
    raise exception 'Role and verification status are set by review, not by the account holder';
  end if;

  return new;
end;
$$;

create trigger profiles_guard_self_update
  before update on public.profiles
  for each row execute function public.guard_profile_self_update();

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.pharmacist_details enable row level security;
alter table public.pharmacy_details enable row level security;
alter table public.student_details enable row level security;
alter table public.platform_admins enable row level security;

-- Your own profile, and nobody else's. What a pharmacy is allowed to see about
-- an applicant is a deliberately narrow projection (see 0003), not this row:
-- this row carries a phone number and a home district.
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_platform_admin());

create policy profiles_insert_own on public.profiles
  for insert with check (id = auth.uid());

create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() or public.is_platform_admin());

create policy pharmacist_details_own on public.pharmacist_details
  for all using (profile_id = auth.uid() or public.is_platform_admin())
  with check (profile_id = auth.uid() or public.is_platform_admin());

create policy pharmacy_details_own on public.pharmacy_details
  for all using (profile_id = auth.uid() or public.is_platform_admin())
  with check (profile_id = auth.uid() or public.is_platform_admin());

create policy student_details_own on public.student_details
  for all using (profile_id = auth.uid() or public.is_platform_admin())
  with check (profile_id = auth.uid() or public.is_platform_admin());

create policy platform_admins_readable_by_admins on public.platform_admins
  for select using (public.is_platform_admin());
