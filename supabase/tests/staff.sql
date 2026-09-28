-- Owner-first accounts: pharmacies, teams, roles and what each person may do
-- (migration 0015). Real policies, real users, one transaction rolled back.
--
--   psql -d saydali_test -v ON_ERROR_STOP=1 -f supabase/tests/staff.sql

\set ON_ERROR_STOP on
\timing off
\set QUIET on

begin;

-- ---------------------------------------------------------------------------
-- Fixtures: pharmacists only — owners, staff, and one still waiting.
-- ---------------------------------------------------------------------------

insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000001', 'rahma@example.com'),   -- owner of Al-Rahma; also works at Al-Hayat
  ('a0000000-0000-0000-0000-000000000002', 'layla@example.com'),   -- owner of Al-Shifa and Al-Hayat
  ('a0000000-0000-0000-0000-000000000003', 'hassan@example.com'),  -- verified pharmacist
  ('a0000000-0000-0000-0000-000000000004', 'noor@example.com'),    -- pharmacist, verification pending
  ('a0000000-0000-0000-0000-000000000005', 'zainab@uobaghdad.edu.iq'), -- student
  ('a0000000-0000-0000-0000-000000000006', 'maryam@example.com'),  -- verified pharmacist
  ('a0000000-0000-0000-0000-000000000007', 'admin@saydali.example');

insert into public.profiles (id, role, full_name_en, verification_status, verified_at) values
  ('a0000000-0000-0000-0000-000000000001', 'pharmacist', 'Rahma Al-Jubouri', 'verified', now()),
  ('a0000000-0000-0000-0000-000000000002', 'pharmacist', 'Layla Abdulkarim', 'verified', now()),
  ('a0000000-0000-0000-0000-000000000003', 'pharmacist', 'Hassan Al-Dulaimi', 'verified', now()),
  ('a0000000-0000-0000-0000-000000000004', 'pharmacist', 'Noor Al-Sultani', 'pending', null),
  ('a0000000-0000-0000-0000-000000000005', 'student', 'Zainab Al-Tamimi', 'verified', now()),
  ('a0000000-0000-0000-0000-000000000006', 'pharmacist', 'Maryam Kadhim', 'verified', now()),
  ('a0000000-0000-0000-0000-000000000007', 'pharmacist', 'Platform Admin', 'verified', now());

insert into public.platform_admins (profile_id) values ('a0000000-0000-0000-0000-000000000007');

insert into public.pharmacist_details (profile_id, syndicate_reg_no, graduation_year) values
  ('a0000000-0000-0000-0000-000000000001', 'IQ-PH-100001', 2010),
  ('a0000000-0000-0000-0000-000000000002', 'IQ-PH-100002', 2008),
  ('a0000000-0000-0000-0000-000000000003', 'IQ-PH-100003', 2018),
  ('a0000000-0000-0000-0000-000000000004', 'IQ-PH-100004', 2024),
  ('a0000000-0000-0000-0000-000000000006', 'IQ-PH-100006', 2015),
  ('a0000000-0000-0000-0000-000000000007', 'IQ-PH-000001', 2005);

\echo ''
\echo '== accounts: one kind for a pharmacist; no pharmacy accounts =='

insert into auth.users (id, email) values ('a0000000-0000-0000-0000-000000000009', 'newpharmacy@example.com');
select public.test_login('a0000000-0000-0000-0000-000000000009');
select public.assert_rejected(
  $$insert into public.profiles (id, role, full_name_en) values ('a0000000-0000-0000-0000-000000000009', 'pharmacy', 'New Pharmacy')$$,
  'signing up as a pharmacy is refused: a pharmacy is a place a pharmacist owns');
select public.test_logout();
select public.test_login('a0000000-0000-0000-0000-000000000003');
select public.assert_rejected(
  $$update public.profiles set role = 'pharmacy' where id = 'a0000000-0000-0000-0000-000000000003'$$,
  'and no account becomes one');
select public.test_logout();
select public.assert(public.has_syndicate_badge('a0000000-0000-0000-0000-000000000003'), 'a verified pharmacist has the Syndicate badge');
select public.assert(not public.has_syndicate_badge('a0000000-0000-0000-0000-000000000004'), 'a pharmacist still pending has not');
select public.assert(not public.has_syndicate_badge('a0000000-0000-0000-0000-000000000005'), 'nor has a student');

\echo ''
\echo '== owning: a verified pharmacist adds a pharmacy, and becomes an owner =='

select public.test_login('a0000000-0000-0000-0000-000000000001');
insert into public.pharmacies (id, owner_id, name_en, name_ar, licence_no, district)
  values ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
          'Al-Rahma Pharmacy', 'صيدلية الرحمة', 'IQ-PHM-000117', 'Karrada');
select public.assert((select count(*) from public.pharmacies) = 1, 'Rahma adds Al-Rahma and sees it');
select public.assert(public.owns_pharmacy('b0000000-0000-0000-0000-000000000001'), 'she owns it');
select public.assert(
  (select verification_status from public.pharmacies where id = 'b0000000-0000-0000-0000-000000000001') = 'pending',
  'it starts pending review');
select public.assert_rejected(
  $$update public.pharmacies set verification_status = 'verified' where id = 'b0000000-0000-0000-0000-000000000001'$$,
  'an owner cannot verify their own pharmacy');
select public.assert_rejected(
  $$insert into public.pharmacies (owner_id, name_ar, licence_no, verification_status)
    values ('a0000000-0000-0000-0000-000000000001', 'صيدلية ثانية', 'IQ-PHM-000999', 'verified')$$,
  'nor add one already verified');
select public.assert_rejected(
  $$insert into public.pharmacies (owner_id, name_ar, licence_no) values ('a0000000-0000-0000-0000-000000000003', 'صيدلية حسن', 'IQ-PHM-000998')$$,
  'nor add a pharmacy in someone else''s name');
select public.assert_rejected(
  $$insert into public.pharmacies (owner_id, name_en, name_ar, licence_no) values ('a0000000-0000-0000-0000-000000000001', 'Latin Only', 'Latin Only', 'IQ-PHM-000997')$$,
  'a pharmacy needs its name in Arabic script');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000004');
select public.assert_rejected(
  $$insert into public.pharmacies (owner_id, name_ar, licence_no) values ('a0000000-0000-0000-0000-000000000004', 'صيدلية نور', 'IQ-PHM-000996')$$,
  'a pharmacist still waiting for verification cannot own a pharmacy');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000005');
select public.assert_rejected(
  $$insert into public.pharmacies (owner_id, name_ar, licence_no) values ('a0000000-0000-0000-0000-000000000005', 'صيدلية زينب', 'IQ-PHM-000995')$$,
  'nor can a student');
select public.test_logout();

-- Layla owns two; Rahma's is verified by review.
insert into public.pharmacies (id, owner_id, name_en, name_ar, licence_no, verification_status, verified_at) values
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Al-Shifa Pharmacy', 'صيدلية الشفاء', 'IQ-PHM-000633', 'verified', now()),
  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Al-Hayat Pharmacy', 'صيدلية الحياة', 'IQ-PHM-000641', 'verified', now());

select public.test_login('a0000000-0000-0000-0000-000000000007');
update public.pharmacies set verification_status = 'verified' where id = 'b0000000-0000-0000-0000-000000000001';
select public.assert(
  (select verified_at is not null from public.pharmacies where id = 'b0000000-0000-0000-0000-000000000001'),
  'review verifies it, and the date is stamped');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000002');
select public.assert((select count(*) from public.pharmacies) = 2, 'an owner of two sees both, and not anyone else''s');
select public.test_logout();

\echo ''
\echo '== roles: four ready-made, and an owner''s own =='

select public.assert(
  (select count(*) from public.staff_roles where owner_id is null) = 4, 'four ready-made roles');
select public.assert(
  (select grants from public.staff_roles where preset = 'cashier') = array['sell'], 'the Cashier sells, and nothing else');
select public.assert(
  (select 'patients' = any (grants) from public.staff_roles where preset = 'pharmacist'),
  'the Pharmacist role includes patient history');

select public.test_login('a0000000-0000-0000-0000-000000000002');
update public.staff_roles set grants = array['sell','prices'] where preset = 'cashier';
select public.assert(
  (select grants from public.staff_roles where preset = 'cashier') = array['sell'], 'a ready-made role cannot be edited');
insert into public.staff_roles (id, owner_id, name, grants)
  values ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Branch lead', array['sell', 'stock']);
select public.assert((select count(*) from public.staff_roles) = 5, 'Layla saves her own role, and sees it with the four');
select public.assert_rejected(
  $$insert into public.staff_roles (owner_id, name, grants) values ('a0000000-0000-0000-0000-000000000002', 'Too much', array['sell', 'exchange'])$$,
  'a role cannot grant what cannot be granted yet (the near-expiry exchange)');
select public.assert_rejected(
  $$insert into public.staff_roles (owner_id, name, grants) values ('a0000000-0000-0000-0000-000000000002', 'Nothing', '{}')$$,
  'a role needs at least one permission');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000001');
select public.assert(
  (select count(*) from public.staff_roles) = 4, 'Rahma does not see Layla''s own role');
select public.test_logout();

\echo ''
\echo '== a team: invited, then accepted — by a verified pharmacist only =='

select public.test_login('a0000000-0000-0000-0000-000000000001');
insert into public.pharmacy_staff (id, pharmacy_id, invited_contact, name, role_id, invite_code, invited_by)
  select 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'hassan@example.com', 'Hassan Al-Dulaimi',
         id, '482913', 'a0000000-0000-0000-0000-000000000001' from public.staff_roles where preset = 'cashier';
insert into public.pharmacy_staff (id, pharmacy_id, invited_contact, name, role_id, invite_code, invited_by)
  select 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'noor@example.com', 'Noor Al-Sultani',
         id, '555101', 'a0000000-0000-0000-0000-000000000001' from public.staff_roles where preset = 'cashier';
select public.assert((select count(*) from public.pharmacy_staff) = 2, 'the owner invites two');
select public.assert_rejected(
  $$update public.pharmacy_staff set state = 'active', pharmacist_id = 'a0000000-0000-0000-0000-000000000003', started_on = current_date
     where id = 'd0000000-0000-0000-0000-000000000001'$$,
  'the owner cannot make someone active: they join by accepting');
select public.assert_rejected(
  $$insert into public.pharmacy_staff (pharmacy_id, invited_contact, name, role_id, invite_code, invited_by)
    select 'b0000000-0000-0000-0000-000000000007', 'x@example.com', 'X', id, '111111', 'a0000000-0000-0000-0000-000000000001'
      from public.staff_roles where preset = 'cashier'$$,
  'nor invite anyone to a pharmacy she does not own');
select public.assert_rejected(
  $$insert into public.pharmacy_staff (pharmacy_id, invited_contact, name, role_id, invite_code, invited_by)
    values ('b0000000-0000-0000-0000-000000000001', 'x@example.com', 'X', 'c0000000-0000-0000-0000-000000000001', '222222', 'a0000000-0000-0000-0000-000000000001')$$,
  'nor give someone another owner''s role');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000004');
select public.assert((select count(*) from public.pharmacy_staff) = 1, 'Noor sees the invitation sent to her address');
select public.assert_rejected($$select public.accept_invitation('555101')$$,
  'but cannot accept it while her Syndicate verification is pending');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000006');
select public.assert((select count(*) from public.pharmacy_staff) = 0, 'Maryam sees nobody else''s invitation');
select public.assert_rejected($$select public.accept_invitation('482913')$$,
  'and cannot accept Hassan''s with his code: an emailed invitation is for that address');
select public.test_logout();

select public.test_login('a0000000-0000-0000-0000-000000000003');
select public.assert_rejected($$select public.accept_invitation('000000')$$, 'a wrong code is refused');
select public.assert((public.accept_invitation('482913')).state = 'active', 'Hassan accepts, and is active from today');
select public.assert(public.works_at('b0000000-0000-0000-0000-000000000001'), 'he works at Al-Rahma');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000001', 'sell'), 'as a Cashier he may sell');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000001', 'voids'), 'and nothing else');
select public.assert((select count(*) from public.pharmacies) = 1, 'he can read the pharmacy he works at');
update public.pharmacy_staff set extra_grants = array['prices'] where id = 'd0000000-0000-0000-0000-000000000001';
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000001', 'prices'), 'he cannot grant himself anything');
select public.test_logout();

\echo ''
\echo '== a role plus extras; a role edited for everyone who holds it =='

select public.test_login('a0000000-0000-0000-0000-000000000001');
update public.pharmacy_staff
   set role_id = (select id from public.staff_roles where preset = 'pharmacist'), extra_grants = array['prices']
 where id = 'd0000000-0000-0000-0000-000000000001';
select public.test_logout();
select public.test_login('a0000000-0000-0000-0000-000000000003');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000001', 'voids'), 'Pharmacist + Prices: voids from the role');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000001', 'prices'), 'and prices as an extra');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000001', 'stock'), 'but not stock');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000007', 'sell'), 'and nothing at a pharmacy he does not work at');
select public.test_logout();

-- Layla's own role, held by Maryam at Al-Shifa; Layla then widens it.
insert into public.pharmacy_staff (id, pharmacy_id, pharmacist_id, invited_contact, name, role_id, state, started_on, invited_by)
  values ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000006',
          'maryam@example.com', 'Maryam Kadhim', 'c0000000-0000-0000-0000-000000000001', 'active', current_date - 30, 'a0000000-0000-0000-0000-000000000002');
select public.test_login('a0000000-0000-0000-0000-000000000006');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000007', 'writeoffs'), 'Branch lead: no write-offs yet');
select public.assert((select name from public.staff_roles where owner_id is not null) = 'Branch lead', 'she can read the role she holds');
select public.test_logout();
select public.test_login('a0000000-0000-0000-0000-000000000002');
update public.staff_roles set grants = array['sell', 'stock', 'writeoffs'] where id = 'c0000000-0000-0000-0000-000000000001';
select public.assert_rejected($$delete from public.staff_roles where id = 'c0000000-0000-0000-0000-000000000001'$$,
  'a role someone holds cannot be deleted');
select public.test_logout();
select public.test_login('a0000000-0000-0000-0000-000000000006');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000007', 'writeoffs'), 'editing the role reaches everyone who holds it');
select public.test_logout();

\echo ''
\echo '== an owner who also works on someone else''s team =='

select public.test_login('a0000000-0000-0000-0000-000000000002');
insert into public.pharmacy_staff (id, pharmacy_id, invited_contact, name, role_id, invite_code, invited_by)
  select 'd0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000008', 'rahma@example.com', 'Rahma Al-Jubouri',
         id, '730215', 'a0000000-0000-0000-0000-000000000002' from public.staff_roles where preset = 'pharmacist';
select public.test_logout();
-- Maryam is on Al-Hayat's team too, so there is someone else to see.
insert into public.pharmacy_staff (id, pharmacy_id, pharmacist_id, invited_contact, name, role_id, state, started_on, invited_by)
  select 'd0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006',
         'maryam@example.com', 'Maryam Kadhim', id, 'active', current_date - 90, 'a0000000-0000-0000-0000-000000000002'
    from public.staff_roles where preset = 'pharmacist';
select public.test_login('a0000000-0000-0000-0000-000000000001');
select public.assert((public.accept_invitation('730215')).state = 'active', 'Rahma, an owner, accepts a place at Layla''s Al-Hayat');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000008', 'voids'), 'there she has what the Pharmacist role gives');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000008', 'stock'), 'and not what it does not — she is staff there, not owner');
select public.assert(public.has_permission('b0000000-0000-0000-0000-000000000001', 'stock'), 'at her own pharmacy she may do everything');
select public.assert(not public.owns_pharmacy('b0000000-0000-0000-0000-000000000008'), 'she does not own Al-Hayat');
select public.assert((select count(*) from public.pharmacy_staff where pharmacy_id = 'b0000000-0000-0000-0000-000000000008') = 1,
  'and at Al-Hayat she sees only her own place, not the rest of the team');
select public.test_logout();

\echo ''
\echo '== ending employment; a badge that lapses =='

select public.test_login('a0000000-0000-0000-0000-000000000001');
update public.pharmacy_staff set state = 'ended', ended_on = current_date where id = 'd0000000-0000-0000-0000-000000000001';
select public.assert_rejected(
  $$update public.pharmacy_staff set state = 'invited', ended_on = null, invite_code = '123456' where id = 'd0000000-0000-0000-0000-000000000001'$$,
  'ended employment stays ended');
select public.test_logout();
select public.test_login('a0000000-0000-0000-0000-000000000003');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000001', 'sell'), 'ended: Hassan can do nothing there any more');
select public.assert((select count(*) from public.pharmacy_staff) = 1, 'but the record stays, and he can read it');
select public.test_logout();

update public.profiles set verification_status = 'rejected' where id = 'a0000000-0000-0000-0000-000000000006';
select public.test_login('a0000000-0000-0000-0000-000000000006');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000007', 'sell'),
  'no badge, no app: a pharmacist whose verification is withdrawn loses what their role gave');
select public.test_logout();
update public.profiles set verification_status = 'rejected' where id = 'a0000000-0000-0000-0000-000000000002';
select public.test_login('a0000000-0000-0000-0000-000000000002');
select public.assert(not public.has_permission('b0000000-0000-0000-0000-000000000007', 'sell'), 'owner or not');
select public.test_logout();

\echo ''
\echo '== the old pharmacy accounts: carried over, unclaimed =='

select public.assert(
  (select count(*) from public.pharmacies where legacy_account_id is not null and owner_id is null) = 0,
  'a database with no old pharmacy accounts carries none over');
select public.assert_rejected(
  $$insert into public.pharmacies (name_ar, licence_no) values ('صيدلية بلا مالك', 'IQ-PHM-000990')$$,
  'a pharmacy is owned by a pharmacist, or is an old account''s waiting to be claimed — never nobody''s');

rollback;

\echo ''
\echo 'All staff and ownership tests passed.'
