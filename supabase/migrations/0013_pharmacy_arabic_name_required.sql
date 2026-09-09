-- Make a pharmacy's Arabic name mandatory.
--
-- Arabic is the default language and the great majority of pharmacists browse
-- in it. A pharmacy that registered with a Latin name only appeared in Latin
-- script on every Arabic listing card, shift row and certificate — the one
-- piece of text on the card that says who you would be working for, in the one
-- script the reader may not read. That is a poor first impression from the side
-- of the market whose trust we most need.
--
-- Two rules, because the first alone does not achieve anything: the column is
-- NOT NULL, and its contents must actually contain Arabic script. Without the
-- second, a pharmacy pastes its Latin name into both boxes, satisfies the
-- constraint and changes nothing for the reader.

-- Existing rows: there is no way to invent an Arabic name, so carry the English
-- one across to satisfy NOT NULL rather than deleting accounts. Those rows are
-- exactly the ones the script rule would reject, which is why it is added NOT
-- VALID below — they must be corrected by their owners, not by us guessing a
-- transliteration and getting a pharmacy's own name wrong on its own listings.
update public.pharmacy_details
   set pharmacy_name_ar = pharmacy_name_en
 where pharmacy_name_ar is null;

-- A row with neither name would still be null; the pre-existing
-- pharmacy_has_a_name check means none can exist, but be explicit rather than
-- letting the ALTER fail obscurely on a database that somehow has one.
delete from public.pharmacy_details
 where pharmacy_name_ar is null;

alter table public.pharmacy_details
  alter column pharmacy_name_ar set not null;

-- Contains at least one Arabic character — not "is entirely Arabic". Real
-- pharmacy names mix scripts (a branch number, a Latin brand), and rejecting
-- those would be a worse failure than the one this fixes.
--
-- Written as E'' escapes rather than literal characters: several of these are
-- invisible or bidirectional and would make this file unreadable. Mirrors
-- containsArabic() in src/lib/arabic-script.ts. If you change one,
-- change the other.
--
-- NOT VALID: enforced on every insert and update from here on, but existing
-- rows are not scanned. Backfilled Latin names stay readable and their owners
-- are prompted to fix them; without this the migration would fail on any
-- database that has one. Run
--   alter table public.pharmacy_details validate constraint pharmacy_name_ar_is_arabic;
-- once the backfilled rows have been corrected.
alter table public.pharmacy_details
  add constraint pharmacy_name_ar_is_arabic
  check (pharmacy_name_ar ~ E'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFC]')
  not valid;

comment on column public.pharmacy_details.pharmacy_name_ar is
  'Required, and must contain Arabic script. Arabic is the default language; a Latin-only pharmacy name is unreadable to most of the pharmacists it is shown to.';
