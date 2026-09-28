-- One kind of account for a pharmacist: owner-first (decided 28 Sep 2026).
--
-- Until now a pharmacy was an account of its own (profiles.role = 'pharmacy'),
-- so the person who owned it and the pharmacist who worked a shift there were
-- different kinds of user. That is not how a pharmacy works. The owner IS a
-- pharmacist: a pharmacist who owns one or more pharmacies. A member of the
-- team is a pharmacist too: one linked to a pharmacy they do not own. Neither
-- is a type — owning is a link (pharmacies.owner_id) and working somewhere is
-- a link (pharmacy_staff). The same person can be both: an owner who also
-- works shifts at someone else's pharmacy is staff there, and has there only
-- what that pharmacy's owner granted.
--
-- No Syndicate badge, no app: only a Syndicate-verified pharmacist can own a
-- pharmacy or work on a team. There are no pharmacy assistants.
--
-- The marketplace-era tables (listings, bookings, placements …) still name a
-- pharmacy by its old account. The marketplace is switched off; they move to
-- `pharmacies` when it returns. Each old pharmacy account's pharmacy is carried
-- into `pharmacies` here, unclaimed until its owner signs in as a pharmacist.

-- ---------------------------------------------------------------------------
-- No new pharmacy accounts.
-- ---------------------------------------------------------------------------

-- Nobody signed in can create one or become one. The platform itself (the
-- service role, fixtures) can still hold the old ones the marketplace-era
-- records point at.
create or replace function public.refuse_pharmacy_accounts()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and new.role = 'pharmacy' and (tg_op = 'INSERT' or old.role is distinct from 'pharmacy') then
    raise exception 'A pharmacy is a place a pharmacist owns, not an account: sign up as a pharmacist and add the pharmacy';
  end if;
  return new;
end;
$$;

create trigger profiles_no_pharmacy_accounts
  before insert or update of role on public.profiles
  for each row execute function public.refuse_pharmacy_accounts();

-- ---------------------------------------------------------------------------
-- The Syndicate badge.
-- ---------------------------------------------------------------------------

-- A pharmacist the Syndicate roster check has verified. SECURITY DEFINER so a
-- policy can ask about someone else's badge without reading their profile.
create or replace function public.has_syndicate_badge(person uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.profiles p
      join public.pharmacist_details d on d.profile_id = p.id
     where p.id = person
       and p.role = 'pharmacist'
       and p.verification_status = 'verified'
  );
$$;

-- The caller's sign-in address: an invitation sent by email is theirs to see.
create or replace function public.caller_email()
returns text
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select lower(email) from auth.users where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Pharmacies — places, owned by a pharmacist.
-- ---------------------------------------------------------------------------

create table public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete restrict,
  name_en text,
  name_ar text not null,
  licence_no text not null,
  district text,
  address text,
  licence_document_url text,
  -- A pharmacy is verified on its licence, separately from its owner's badge.
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  rejection_reason text,
  -- The pharmacist who signs for what is dispensed there.
  responsible_pharmacist_id uuid references public.profiles (id),
  -- The old pharmacy account this pharmacy was, if it was one.
  legacy_account_id uuid unique references public.pharmacy_details (profile_id) on delete set null,
  created_at timestamptz not null default now(),

  -- Owned by a pharmacist — or, carried over from an old pharmacy account,
  -- waiting for its owner to claim it.
  constraint pharmacies_owned check (owner_id is not null or legacy_account_id is not null),
  constraint pharmacies_verified_at_set check ((verification_status = 'verified') = (verified_at is not null))
);

create unique index pharmacies_licence_no_key on public.pharmacies (lower(licence_no));
create index pharmacies_owner on public.pharmacies (owner_id);

create trigger pharmacies_stamp_verification
  before update on public.pharmacies
  for each row execute function public.stamp_verification();

-- The old pharmacy accounts' pharmacies, unclaimed. Before the Arabic-name rule
-- is added, because a backfilled Latin name must carry over, as in 0013.
insert into public.pharmacies
  (name_en, name_ar, licence_no, district, address, licence_document_url,
   verification_status, verified_at, legacy_account_id, created_at)
select d.pharmacy_name_en, d.pharmacy_name_ar, d.licence_no, p.district, d.address, d.licence_document_url,
       p.verification_status, p.verified_at, d.profile_id, p.created_at
  from public.pharmacy_details d
  join public.profiles p on p.id = d.profile_id;

-- Mirrors pharmacy_name_ar_is_arabic (0013) and containsArabic() in
-- src/lib/arabic-script.ts. NOT VALID for the rows carried over above.
alter table public.pharmacies
  add constraint pharmacies_name_ar_is_arabic
  check (name_ar ~ E'[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-ﻼ]')
  not valid;

-- Who may own one, and who may verify one.
create or replace function public.guard_pharmacy()
returns trigger
language plpgsql
as $$
begin
  if new.owner_id is not null
     and (tg_op = 'INSERT' or new.owner_id is distinct from old.owner_id)
     and not public.has_syndicate_badge(new.owner_id) then
    raise exception 'Only a Syndicate-verified pharmacist can own a pharmacy';
  end if;

  -- A pharmacy is verified by review, never by its owner.
  if auth.uid() is not null and not public.is_platform_admin() then
    if tg_op = 'INSERT' then
      if new.verification_status <> 'pending' then
        raise exception 'A new pharmacy starts pending review';
      end if;
    elsif new.verification_status is distinct from old.verification_status
       or new.verified_at is distinct from old.verified_at
       or new.owner_id is distinct from old.owner_id
       or new.legacy_account_id is distinct from old.legacy_account_id then
      raise exception 'Verification and ownership are set by review, not by the owner';
    end if;
  end if;
  return new;
end;
$$;

create trigger pharmacies_guard
  before insert or update on public.pharmacies
  for each row execute function public.guard_pharmacy();

-- ---------------------------------------------------------------------------
-- What someone on a team may do.
-- ---------------------------------------------------------------------------

-- The permissions that can be granted today. The near-expiry exchange joins
-- the list when it exists (v0.0018). Mirrors src/lib/permissions.ts.
create or replace function public.staff_permissions()
returns text[]
language sql
immutable
as $$
  select array['sell', 'voids', 'discounts', 'prices', 'stock', 'writeoffs',
               'cashVariance', 'receipt', 'market', 'ownItems', 'patients'];
$$;

-- A role: a named set of permissions. The ready-made ones belong to nobody
-- and cannot be changed; an owner's own belong to that owner, at all of their
-- pharmacies, and editing one changes it for everyone who holds it.
create table public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete cascade,
  preset text unique,
  name text,
  grants text[] not null,
  created_at timestamptz not null default now(),
  constraint staff_roles_kind check ((owner_id is null) = (preset is not null)),
  constraint staff_roles_named check (preset is not null or length(trim(coalesce(name, ''))) > 0),
  constraint staff_roles_grants check (cardinality(grants) > 0 and grants <@ public.staff_permissions())
);

insert into public.staff_roles (preset, grants) values
  ('cashier',     array['sell']),
  ('pharmacist',  array['sell', 'voids', 'discounts', 'ownItems', 'patients']),
  ('stockKeeper', array['sell', 'stock', 'writeoffs']),
  ('manager',     public.staff_permissions());

create type public.staff_state as enum ('invited', 'active', 'ended');

-- A place on a pharmacy's team: invited, then active, then — the record kept —
-- ended. Someone new holds the Cashier role: selling, and nothing else.
create table public.pharmacy_staff (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies (id) on delete cascade,
  -- Null until an invitation sent to a phone number is accepted.
  pharmacist_id uuid references public.profiles (id) on delete cascade,
  invited_contact text not null,
  name text not null,
  role_id uuid not null references public.staff_roles (id) on delete restrict,
  extra_grants text[] not null default '{}',
  state public.staff_state not null default 'invited',
  invite_code text,
  invited_by uuid references public.profiles (id),
  invited_at timestamptz not null default now(),
  started_on date,
  ended_on date,
  constraint pharmacy_staff_extra_grants check (extra_grants <@ public.staff_permissions()),
  constraint pharmacy_staff_active check (state <> 'active' or (pharmacist_id is not null and started_on is not null)),
  constraint pharmacy_staff_ended check ((state = 'ended') = (ended_on is not null)),
  constraint pharmacy_staff_code check (state <> 'invited' or invite_code ~ '^[0-9]{6}$')
);

create unique index pharmacy_staff_one_place on public.pharmacy_staff (pharmacy_id, pharmacist_id)
  where state <> 'ended' and pharmacist_id is not null;
create index pharmacy_staff_person on public.pharmacy_staff (pharmacist_id) where state = 'active';

-- Owning and working somewhere, as the caller.
create or replace function public.owns_pharmacy(pharmacy uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_syndicate_badge(auth.uid())
     and exists (select 1 from public.pharmacies where id = pharmacy and owner_id = auth.uid());
$$;

create or replace function public.works_at(pharmacy uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_syndicate_badge(auth.uid())
     and exists (select 1 from public.pharmacy_staff
                  where pharmacy_id = pharmacy and pharmacist_id = auth.uid() and state = 'active');
$$;

-- May the caller do this at this pharmacy? The owner may do everything at a
-- pharmacy they own; anyone else, what their role gives and their extras. No
-- badge — lapsed, or never — means nothing, owner or not.
create or replace function public.has_permission(pharmacy uuid, perm text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_syndicate_badge(auth.uid()) and (
    exists (select 1 from public.pharmacies where id = pharmacy and owner_id = auth.uid())
    or exists (
      select 1
        from public.pharmacy_staff s
        join public.staff_roles r on r.id = s.role_id
       where s.pharmacy_id = pharmacy
         and s.pharmacist_id = auth.uid()
         and s.state = 'active'
         and perm = any (r.grants || s.extra_grants)
    )
  );
$$;

-- What may change on a place, and by whom. RLS lets the owner update; this
-- decides what. Nobody makes anyone active except by accepting.
-- SECURITY DEFINER: it must see the role's owner even when the caller's own
-- policies hide that role — that is exactly the case it refuses.
create or replace function public.guard_pharmacy_staff()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  role_owner uuid;
  place_owner uuid;
begin
  select owner_id into role_owner from public.staff_roles where id = new.role_id;
  select owner_id into place_owner from public.pharmacies where id = new.pharmacy_id;
  if role_owner is not null and role_owner is distinct from place_owner then
    raise exception 'A role is either ready-made or the pharmacy owner''s own';
  end if;

  if tg_op = 'INSERT' then
    if new.state <> 'invited' and auth.uid() is not null then
      raise exception 'Someone joins a team by accepting an invitation';
    end if;
    return new;
  end if;

  if new.pharmacy_id is distinct from old.pharmacy_id
     or (old.pharmacist_id is not null and new.pharmacist_id is distinct from old.pharmacist_id) then
    raise exception 'A place on a team stays with its pharmacy and its person';
  end if;
  if old.state = 'ended' and new.state <> 'ended' then
    raise exception 'Ended employment stays ended; invite them again';
  end if;
  if new.state = 'active' and old.state <> 'active' then
    if coalesce(current_setting('saydali.accepting', true), '') <> 'on' then
      raise exception 'Someone joins a team by accepting an invitation';
    end if;
    if not public.has_syndicate_badge(new.pharmacist_id) then
      raise exception 'Only a Syndicate-verified pharmacist can join a team';
    end if;
  end if;
  return new;
end;
$$;

create trigger pharmacy_staff_guard
  before insert or update on public.pharmacy_staff
  for each row execute function public.guard_pharmacy_staff();

-- Accepting an invitation, from the link or by typing the code. Only a
-- Syndicate-verified pharmacist; an invitation sent to an email address only
-- by the account with that address. Employment starts today.
create or replace function public.accept_invitation(code text)
returns public.pharmacy_staff
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  place public.pharmacy_staff;
begin
  if not public.has_syndicate_badge(auth.uid()) then
    raise exception 'Your Syndicate verification has to be complete before you can join a pharmacy''s team';
  end if;

  select * into place from public.pharmacy_staff
   where state = 'invited' and invite_code = code
   for update;
  if not found then
    raise exception 'That code is not right';
  end if;
  if place.invited_contact like '%@%' and lower(place.invited_contact) <> public.caller_email() then
    raise exception 'That code is not right';
  end if;
  if exists (select 1 from public.pharmacies where id = place.pharmacy_id and owner_id = auth.uid()) then
    raise exception 'An owner is not staff at their own pharmacy';
  end if;

  perform set_config('saydali.accepting', 'on', true);
  update public.pharmacy_staff
     set pharmacist_id = auth.uid(), state = 'active', started_on = current_date, invite_code = null
   where id = place.id
  returning * into place;
  perform set_config('saydali.accepting', 'off', true);
  return place;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.pharmacies enable row level security;
alter table public.staff_roles enable row level security;
alter table public.pharmacy_staff enable row level security;

-- A pharmacy: its owner, its team, and review.
create policy pharmacies_select on public.pharmacies
  for select using (owner_id = auth.uid() or public.works_at(id) or public.is_platform_admin());

-- Adding one is how a pharmacist becomes an owner — a verified one only.
create policy pharmacies_insert on public.pharmacies
  for insert with check (owner_id = auth.uid() and public.has_syndicate_badge(auth.uid()));

create policy pharmacies_update on public.pharmacies
  for update using (owner_id = auth.uid() or public.is_platform_admin());

-- Roles: the ready-made ones for everyone; an owner's own for that owner, and
-- for the people who hold one.
create policy staff_roles_select on public.staff_roles
  for select using (
    owner_id is null
    or owner_id = auth.uid()
    or exists (select 1 from public.pharmacy_staff s
                where s.role_id = staff_roles.id and s.pharmacist_id = auth.uid() and s.state = 'active')
  );

create policy staff_roles_write on public.staff_roles
  for all using (owner_id = auth.uid() and public.has_syndicate_badge(auth.uid()))
  with check (owner_id = auth.uid() and public.has_syndicate_badge(auth.uid()));

-- A team: the owner reads and changes it; a person reads their own places,
-- and the invitations sent to their address.
create policy pharmacy_staff_select on public.pharmacy_staff
  for select using (
    public.owns_pharmacy(pharmacy_id)
    or pharmacist_id = auth.uid()
    or (state = 'invited' and lower(invited_contact) = public.caller_email())
  );

create policy pharmacy_staff_insert on public.pharmacy_staff
  for insert with check (public.owns_pharmacy(pharmacy_id) and invited_by = auth.uid());

create policy pharmacy_staff_update on public.pharmacy_staff
  for update using (public.owns_pharmacy(pharmacy_id));

comment on table public.pharmacies is
  'A pharmacy is a place a Syndicate-verified pharmacist owns. Owning is a link, not an account type.';
comment on table public.pharmacy_staff is
  'Someone on a pharmacy''s team: a Syndicate-verified pharmacist with a role and any extra grants. Invited, active, ended — the record is kept.';
