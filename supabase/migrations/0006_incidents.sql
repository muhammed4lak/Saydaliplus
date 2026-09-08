-- Incident reporting, tiers 1 and 2. Tier 3 is behind a feature flag and is not
-- reachable — see below.
--
-- This is the most dangerous feature in the product and it is built last on
-- purpose. The Syndicate registration number is the only real accountability
-- anchor available in Iraq, and making it consequential is exactly what lets an
-- owner hand their keys to a stranger. But the channel is asymmetric: the owner
-- holds the accusation and the pharmacist's career is what is at stake. Left
-- unguarded it becomes leverage in a payment dispute, and if pharmacists come to
-- fear career-ending reports from strangers they will not join at all — which
-- kills the supply side the whole marketplace depends on.
--
-- Hence: an evidence gate, tiers that escalate slowly, a right of reply before
-- anything leaves the platform, and symmetry — pharmacists report pharmacies on
-- the same rails.

create type public.incident_tier as enum ('tier_1', 'tier_2', 'tier_3');
create type public.incident_status as enum (
  'submitted', 'awaiting_reply', 'under_review', 'upheld', 'dismissed', 'withdrawn'
);
create type public.incident_category as enum (
  -- Against a pharmacist.
  'no_show',
  'controlled_substance_discrepancy',
  'till_discrepancy',
  'conduct',
  -- Against a pharmacy. Symmetry is not decoration: non-payment is the single
  -- most likely complaint from the labour side, and a channel that cannot carry
  -- it is a channel pharmacists will not trust.
  'non_payment',
  'unsafe_conditions',
  'pressure_to_dispense_improperly',
  'other'
);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete restrict,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid not null references public.profiles (id) on delete cascade,
  category public.incident_category not null,
  description text not null check (length(trim(description)) >= 50),
  evidence jsonb not null default '[]'::jsonb,
  tier public.incident_tier not null default 'tier_1',
  status public.incident_status not null default 'submitted',

  -- The right of reply. Nothing escalates past tier 1 until the subject has been
  -- told and given the chance to answer.
  subject_notified_at timestamptz,
  subject_reply text,
  subject_replied_at timestamptz,

  resolved_by uuid references public.profiles (id),
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),

  constraint incidents_not_against_self check (reporter_id <> subject_id)
);

create index incidents_subject_idx on public.incidents (subject_id, created_at desc);
create index incidents_queue_idx on public.incidents (status, tier, created_at);

-- Tier 3 — escalation to the Syndicate — is defined so the tiers read honestly,
-- but is unreachable until we have confirmed the Syndicate will actually accept
-- reports through this channel. Reporting a stranger to their regulator on the
-- strength of an in-app form, through a route we have not confirmed exists, is
-- not a thing to ship on an assumption.
create table public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  note text
);

insert into public.feature_flags (key, enabled, note) values
  ('incident_tier_3_syndicate_escalation', false,
   'Blocked pending written confirmation that the Syndicate of Iraqi Pharmacists will accept reports through this channel, and legal review of what we are entitled to send them.');

create or replace function public.feature_enabled(flag_key text)
returns boolean
language sql
stable
as $$
  select coalesce((select enabled from public.feature_flags where key = flag_key), false);
$$;

-- ---------------------------------------------------------------------------
-- The evidence gate.
--
-- A report can only be filed against a booking with a completed two-party
-- handoff. That is what makes the handoff checklist the evidentiary backbone
-- rather than a formality: without a joint record of the register count, the
-- till float and the keys, an accusation about any of them is one person's word.
-- It also means a report cannot be invented about a shift that never happened.
-- ---------------------------------------------------------------------------

create or replace function public.guard_incident_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  b public.bookings;
  h public.handoffs;
begin
  select * into b from public.bookings where id = new.booking_id;
  if b is null then
    raise exception 'No such booking';
  end if;

  if new.reporter_id <> auth.uid() then
    raise exception 'A report is filed in your own name';
  end if;

  if not (
    (new.reporter_id = b.pharmacist_id and new.subject_id = b.pharmacy_id)
    or (new.reporter_id = b.pharmacy_id and new.subject_id = b.pharmacist_id)
  ) then
    raise exception 'Only the two parties to a booking may report each other';
  end if;

  select * into h from public.handoffs where booking_id = b.id;
  if h is null
     or h.confirmed_by_pharmacist_at is null
     or h.confirmed_by_pharmacy_at is null then
    raise exception
      'A report can only be filed against a shift with a completed two-party handoff record';
  end if;

  -- Every report starts at tier 1. Escalation is a decision made by a human
  -- reviewer looking at both statements, never something the reporter selects.
  new.tier := 'tier_1';
  new.status := 'submitted';
  return new;
end;
$$;

create trigger incidents_guard_insert
  before insert on public.incidents
  for each row execute function public.guard_incident_insert();

-- ---------------------------------------------------------------------------
-- Escalation.
--
--   Tier 1 — internal flag. Both parties give a statement. Affects the
--            reliability record only; nothing leaves the platform.
--   Tier 2 — suspension. Corroborated or repeated. The account is frozen
--            pending resolution.
--   Tier 3 — Syndicate escalation. Feature-flagged off.
-- ---------------------------------------------------------------------------

create or replace function public.escalate_incident(
  incident_id uuid,
  to_tier public.incident_tier,
  note text default null
)
returns public.incidents
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_incident public.incidents;
  updated public.incidents;
begin
  if not public.is_platform_admin() then
    raise exception 'Only a reviewer may change an incident''s tier';
  end if;

  select * into current_incident from public.incidents where id = incident_id;
  if current_incident is null then
    raise exception 'No such incident';
  end if;

  -- The right of reply, enforced rather than described.
  if to_tier <> 'tier_1' and current_incident.subject_replied_at is null then
    if current_incident.subject_notified_at is null then
      raise exception 'The subject has not been notified of this report';
    end if;
    if now() < current_incident.subject_notified_at + interval '7 days' then
      raise exception 'The subject has 7 days to reply before this can be escalated';
    end if;
  end if;

  if to_tier = 'tier_3' and not public.feature_enabled('incident_tier_3_syndicate_escalation') then
    raise exception
      'Syndicate escalation is not enabled: we have not confirmed the Syndicate accepts reports through this channel';
  end if;

  update public.incidents
  set tier = to_tier,
      status = 'under_review',
      resolution_note = coalesce(note, resolution_note)
  where id = incident_id
  returning * into updated;

  -- Tier 2 freezes the account pending resolution.
  if to_tier = 'tier_2' then
    update public.profiles
    set verification_status = 'pending'
    where id = current_incident.subject_id;
  end if;

  return updated;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.incidents enable row level security;
alter table public.feature_flags enable row level security;

-- The subject can read a report made about them — they cannot answer one they
-- are not allowed to see, and a secret accusation is exactly the asymmetry this
-- design exists to avoid. Nobody else on the platform can read it at all: an
-- unresolved report is not a signal we broadcast.
create policy incidents_select_by_party on public.incidents
  for select using (
    reporter_id = auth.uid() or subject_id = auth.uid() or public.is_platform_admin()
  );

create policy incidents_insert_own on public.incidents
  for insert with check (reporter_id = auth.uid());

create policy incidents_update_by_party on public.incidents
  for update using (
    reporter_id = auth.uid() or subject_id = auth.uid() or public.is_platform_admin()
  );

create policy feature_flags_readable on public.feature_flags
  for select using (true);
