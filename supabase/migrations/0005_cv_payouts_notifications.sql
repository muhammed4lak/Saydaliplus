-- The bilingual CV, payouts, and notifications.

create type public.cv_lang as enum ('en', 'ar');
create type public.payout_method as enum ('zaincash', 'qicard');
create type public.payout_status as enum ('requested', 'processing', 'settled', 'failed');

-- ---------------------------------------------------------------------------
-- CV.
--
-- One row per (pharmacist, language). The CV genuinely exists twice: a
-- pharmacist may browse the app in Arabic while writing an English CV for a
-- Gulf employer, so the CV's language is its own axis and not a view of the UI
-- locale. Only the authored half lives here — the verified half is read from
-- pharmacist_stats and can never be typed in, which is the entire reason an
-- employer should believe it.
-- ---------------------------------------------------------------------------

create table public.cv (
  pharmacist_id uuid not null references public.profiles (id) on delete cascade,
  lang public.cv_lang not null,
  summary text,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  skills text[] not null default '{}',
  languages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (pharmacist_id, lang)
);

-- ---------------------------------------------------------------------------
-- Payouts.
--
-- Money flows pharmacy -> platform merchant account -> pharmacist. It must not
-- go peer-to-peer: the pharmacist-side 3% is only collectable if we disburse,
-- and if it goes direct the model does not work.
--
-- Note what is deliberately absent: there is no balance column and no wallet
-- table anywhere in this schema. Holding customer balances in Iraq likely
-- requires operating under a licensed provider's arrangement, which we do not
-- have. A payout references the bookings it settles and is a record of a
-- transfer, not a stored balance.
-- ---------------------------------------------------------------------------

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  pharmacist_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  method public.payout_method not null,
  status public.payout_status not null default 'requested',
  provider_ref text,
  failure_reason text,
  requested_at timestamptz not null default now(),
  settled_at timestamptz,
  constraint payouts_settled_at_set check ((status = 'settled') = (settled_at is not null))
);

create index payouts_pharmacist_idx on public.payouts (pharmacist_id, requested_at desc);

-- Which bookings a given payout settled. A completed booking is payable exactly
-- once, which the unique constraint enforces rather than a nightly reconciliation.
create table public.payout_items (
  payout_id uuid not null references public.payouts (id) on delete cascade,
  booking_id uuid not null references public.bookings (id) on delete restrict,
  amount numeric(12, 2) not null,
  primary key (payout_id, booking_id),
  unique (booking_id)
);

-- What a pharmacist is owed: completed bookings not yet attached to a payout.
create view public.payable_bookings
with (security_invoker = true)
as
select
  b.id as booking_id,
  b.pharmacist_id,
  b.pharmacy_id,
  b.net_payout,
  b.completed_at
from public.bookings b
where b.status = 'completed'
  and not exists (select 1 from public.payout_items pi where pi.booking_id = b.id);

create or replace function public.request_payout(method public.payout_method)
returns public.payouts
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  total numeric;
  new_payout public.payouts;
begin
  if not public.is_verified() then
    raise exception 'Your account is still being verified';
  end if;
  if public.current_role_of_caller() <> 'pharmacist' then
    raise exception 'Only pharmacists request payouts';
  end if;

  select coalesce(sum(net_payout), 0) into total
  from public.bookings b
  where b.pharmacist_id = auth.uid()
    and b.status = 'completed'
    and not exists (select 1 from public.payout_items pi where pi.booking_id = b.id);

  if total <= 0 then
    raise exception 'There is nothing to pay out yet';
  end if;

  insert into public.payouts (pharmacist_id, amount, method)
  values (auth.uid(), total, method)
  returning * into new_payout;

  -- Claim the bookings in the same transaction, so two concurrent requests
  -- cannot both be paid for the same shift.
  insert into public.payout_items (payout_id, booking_id, amount)
  select new_payout.id, b.id, b.net_payout
  from public.bookings b
  where b.pharmacist_id = auth.uid()
    and b.status = 'completed'
    and not exists (select 1 from public.payout_items pi where pi.booking_id = b.id);

  return new_payout;
end;
$$;

-- ---------------------------------------------------------------------------
-- Notifications.
--
-- title_key is a message key, not a sentence: notifications are rendered in the
-- reader's language at read time, so a pharmacist who switches to English does
-- not find a backlog of Arabic notices.
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title_key text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security.
-- ---------------------------------------------------------------------------

alter table public.cv enable row level security;
alter table public.payouts enable row level security;
alter table public.payout_items enable row level security;
alter table public.notifications enable row level security;

-- Public CV pages are explicitly out of scope for v1, so a CV is readable only
-- by the pharmacist who wrote it. Sharing happens by exporting a PDF.
create policy cv_own on public.cv
  for all using (pharmacist_id = auth.uid())
  with check (pharmacist_id = auth.uid());

create policy payouts_own on public.payouts
  for select using (pharmacist_id = auth.uid() or public.is_platform_admin());

create policy payout_items_own on public.payout_items
  for select using (
    exists (
      select 1 from public.payouts p
      where p.id = payout_items.payout_id and p.pharmacist_id = auth.uid()
    )
    or public.is_platform_admin()
  );

create policy notifications_own on public.notifications
  for select using (user_id = auth.uid());

create policy notifications_mark_read on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());
