-- Let a cancelled shift be covered by someone else.
--
-- bookings.listing_id was unconditionally UNIQUE, which is right for the case it
-- was written for — one listing must not have two live bookings — but it also
-- made a cancelled shift permanently unfillable. cancel_booking() puts the
-- listing back to 'open', a second pharmacist applies, the pharmacy accepts, and
-- accept_application() hits the unique constraint. The shift is on the board and
-- cannot be taken.
--
-- That is the ordinary path, not an edge case: a pharmacist withdrawing with
-- notice is exactly the behaviour the free-cancellation window is designed to
-- encourage, and the pharmacy still needs the day covered.
--
-- A partial unique index keeps the real rule — at most one booking per listing
-- that has not been cancelled — while letting the cancelled ones accumulate as
-- the historical record that reliability is calculated from.

alter table public.bookings drop constraint bookings_listing_id_key;

create unique index bookings_one_live_per_listing
  on public.bookings (listing_id)
  where status <> 'cancelled';
