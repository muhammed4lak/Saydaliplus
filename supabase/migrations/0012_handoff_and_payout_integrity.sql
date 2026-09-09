-- Two integrity fixes found reviewing the trust boundaries.
--
-- 1. The handoff guard already refuses to let a confirmed item be un-ticked —
--    which is the property that matters, because the handoff record is what a
--    later dispute is judged against and a party who could quietly untick
--    "controlled-substances register counted" after the fact would be editing
--    the evidence. But it says so with the wrong message: a pharmacy trying it
--    is told the items "must be agreed before either party confirms", which
--    describes a different situation entirely and reads like a bug.
--
--    Same rule, stated correctly, and split so each case says what it means.
--
-- 2. A payout needs somewhere to send money. Nothing required a pharmacist to
--    have a wallet number on file, so request_payout() would happily create a
--    payout row destined for an empty string. Against the mock provider that
--    "succeeds", which is the worst outcome: a pharmacist sees a settled payout
--    and no money arrives.

create or replace function public.guard_handoff_confirmation()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    -- A confirmation, once given, is part of the record.
    if old.confirmed_by_pharmacist_at is not null
       and new.confirmed_by_pharmacist_at is distinct from old.confirmed_by_pharmacist_at then
      raise exception 'A handoff confirmation cannot be withdrawn';
    end if;
    if old.confirmed_by_pharmacy_at is not null
       and new.confirmed_by_pharmacy_at is distinct from old.confirmed_by_pharmacy_at then
      raise exception 'A handoff confirmation cannot be withdrawn';
    end if;

    -- And neither can the thing that was confirmed. This is the evidence rule:
    -- once either party has signed off on the five items, the five items are
    -- fixed. Without it the record could be rewritten the moment it mattered.
    if (old.confirmed_by_pharmacist_at is not null or old.confirmed_by_pharmacy_at is not null)
       and new.items is distinct from old.items then
      raise exception
        'The handoff record cannot be changed once a party has confirmed it';
    end if;
  end if;

  -- Nobody confirms a checklist that is not finished.
  if (new.confirmed_by_pharmacist_at is not null or new.confirmed_by_pharmacy_at is not null)
     and not public.handoff_items_all_ticked(new.items) then
    raise exception 'All five handoff items must be agreed before either party confirms';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Somewhere to send the money.
-- ---------------------------------------------------------------------------

alter table public.pharmacist_details
  add column if not exists payout_destination text;

comment on column public.pharmacist_details.payout_destination is
  'The pharmacist''s wallet or card identifier with the payment provider. Not '
  'assumed to be the account phone number: a ZainCash wallet is often registered '
  'to a different number, and paying the wrong one is unrecoverable.';

create or replace function public.request_payout(method public.payout_method)
returns public.payouts
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  total numeric;
  destination text;
  new_payout public.payouts;
begin
  if not public.is_verified() then
    raise exception 'Your account is still being verified';
  end if;
  if public.current_role_of_caller() <> 'pharmacist' then
    raise exception 'Only pharmacists request payouts';
  end if;

  select payout_destination into destination
  from public.pharmacist_details where profile_id = auth.uid();

  if destination is null or length(trim(destination)) = 0 then
    raise exception 'Add the wallet number to be paid into before requesting a payout';
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
