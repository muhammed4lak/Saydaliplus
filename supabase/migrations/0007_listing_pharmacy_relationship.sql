-- Give listings a direct foreign key to pharmacy_details.
--
-- Two reasons, one structural and one practical.
--
-- Structurally, a listing must belong to an actual pharmacy. Until now
-- listings.pharmacy_id only referenced profiles(id), so at the schema level a
-- pharmacist's profile id was an equally valid value — the RLS policy was the
-- only thing stopping it. A foreign key to pharmacy_details, whose rows exist
-- only for pharmacy accounts, makes that impossible rather than merely
-- forbidden.
--
-- Practically, PostgREST derives its embedding from foreign keys, and without a
-- direct one `listings?select=*,pharmacy_details(*)` fails at runtime. The
-- pharmacy's name is on nearly every screen a pharmacist sees, so this is not an
-- exotic query.

alter table public.listings
  add constraint listings_pharmacy_id_fkey_details
  foreign key (pharmacy_id) references public.pharmacy_details (profile_id)
  on delete cascade;
