-- Policy tests.
--
-- "RLS is not optional" — so these run the real policies against a real database
-- as real users, rather than asserting that the SQL looks right. Everything
-- happens inside one transaction that is rolled back at the end.
--
--   psql -d saydali_test -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql
--
-- Any failed assertion aborts the run.

\set ON_ERROR_STOP on
\timing off
\set QUIET on

begin;

create or replace function public.assert(condition boolean, description text)
returns void
language plpgsql
as $$
begin
  if condition is not true then
    raise exception 'FAILED: %', description;
  end if;
  raise notice '  ok  %', description;
end;
$$;

-- Assert that a statement is rejected, whatever the specific message.
create or replace function public.assert_rejected(statement text, description text)
returns void
language plpgsql
as $$
begin
  begin
    execute statement;
  exception when others then
    raise notice '  ok  % (%s)', description, substr(sqlerrm, 1, 60);
    return;
  end;
  raise exception 'FAILED: % — the statement was allowed', description;
end;
$$;

-- ---------------------------------------------------------------------------
-- Fixtures
-- ---------------------------------------------------------------------------

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'ahmed@example.com'),      -- verified pharmacist
  ('22222222-2222-2222-2222-222222222222', 'noor@example.com'),       -- pending pharmacist
  ('33333333-3333-3333-3333-333333333333', 'rahma@example.com'),      -- verified pharmacy
  ('44444444-4444-4444-4444-444444444444', 'furat@example.com'),      -- rival verified pharmacy
  ('55555555-5555-5555-5555-555555555555', 'amal@example.com'),       -- unverified pharmacy
  ('66666666-6666-6666-6666-666666666666', 'zainab@uobaghdad.edu.iq'),-- student
  ('77777777-7777-7777-7777-777777777777', 'admin@saydali.example');  -- platform admin

insert into public.profiles (id, role, full_name_en, verification_status, verified_at, district) values
  ('11111111-1111-1111-1111-111111111111', 'pharmacist', 'Ahmed Al-Kubaisi', 'verified', now(), 'Karrada'),
  ('22222222-2222-2222-2222-222222222222', 'pharmacist', 'Noor Al-Sultani', 'pending', null, 'Jadriya'),
  ('33333333-3333-3333-3333-333333333333', 'pharmacy', 'Al-Rahma Pharmacy', 'verified', now(), 'Karrada'),
  ('44444444-4444-4444-4444-444444444444', 'pharmacy', 'Al-Furat Pharmacy', 'verified', now(), 'Jadriya'),
  ('55555555-5555-5555-5555-555555555555', 'pharmacy', 'Al-Amal Pharmacy', 'pending', null, 'Zayouna'),
  ('66666666-6666-6666-6666-666666666666', 'student', 'Zainab Al-Tamimi', 'verified', now(), 'Karrada'),
  ('77777777-7777-7777-7777-777777777777', 'pharmacist', 'Platform Admin', 'verified', now(), 'Karrada');

insert into public.platform_admins (profile_id) values ('77777777-7777-7777-7777-777777777777');

insert into public.pharmacist_details (profile_id, syndicate_reg_no, graduation_year) values
  ('11111111-1111-1111-1111-111111111111', 'IQ-PH-004982', 2016),
  ('22222222-2222-2222-2222-222222222222', 'IQ-PH-007731', 2021);

insert into public.pharmacy_details (profile_id, pharmacy_name_en, licence_no) values
  ('33333333-3333-3333-3333-333333333333', 'Al-Rahma Pharmacy', 'IQ-PHM-000117'),
  ('44444444-4444-4444-4444-444444444444', 'Al-Furat Pharmacy', 'IQ-PHM-000232'),
  ('55555555-5555-5555-5555-555555555555', 'Al-Amal Pharmacy', 'IQ-PHM-000345');

insert into public.student_details (profile_id, university, university_email) values
  ('66666666-6666-6666-6666-666666666666', 'University of Baghdad', 'zainab@uobaghdad.edu.iq');

\echo ''
\echo '== profiles: a profile row is private to its owner =='

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert(
  (select count(*) from public.profiles) = 1,
  'a pharmacist sees only their own profile row'
);
select public.assert(
  not exists (select 1 from public.pharmacist_details
              where profile_id = '22222222-2222-2222-2222-222222222222'),
  'a pharmacist cannot read another pharmacist''s Syndicate details'
);

\echo ''
\echo '== verification cannot be self-granted =='

select public.test_login('22222222-2222-2222-2222-222222222222');
select public.assert_rejected(
  $$update public.profiles set verification_status = 'verified'
    where id = '22222222-2222-2222-2222-222222222222'$$,
  'a pending pharmacist cannot verify themselves'
);
select public.assert_rejected(
  $$update public.profiles set role = 'pharmacy'
    where id = '22222222-2222-2222-2222-222222222222'$$,
  'a pharmacist cannot change their own role'
);
select public.assert(
  (select verification_status from public.profiles
   where id = '22222222-2222-2222-2222-222222222222') = 'pending',
  'the pending status survived both attempts'
);

-- What they *can* change.
update public.profiles set district = 'Karrada'
  where id = '22222222-2222-2222-2222-222222222222';
select public.assert(
  (select district from public.profiles
   where id = '22222222-2222-2222-2222-222222222222') = 'Karrada',
  'a pharmacist can still edit their own district'
);

\echo ''
\echo '== posting a shift requires a verified pharmacy =='

select public.test_login('55555555-5555-5555-5555-555555555555');
select public.assert_rejected(
  $$insert into public.listings
      (pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
    values ('55555555-5555-5555-5555-555555555555', 'shift', 'Zayouna',
            now() + interval '3 days', now() + interval '3 days 8 hours', 'hourly', 5000)$$,
  'an unverified pharmacy cannot post a shift'
);

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert_rejected(
  $$insert into public.listings
      (pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
    values ('11111111-1111-1111-1111-111111111111', 'shift', 'Karrada',
            now() + interval '3 days', now() + interval '3 days 8 hours', 'hourly', 5000)$$,
  'a pharmacist cannot post a shift at all'
);

select public.test_logout();

-- Two shifts from Al-Rahma and one from its rival.
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount, includes_controlled)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() + interval '3 days', now() + interval '3 days 8 hours', 'hourly', 5000, false),
  ('aaaaaaaa-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() + interval '10 days', now() + interval '10 days 6 hours', 'flat', 30000, false),
  ('aaaaaaaa-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'shift',
   'Jadriya', now() + interval '5 days', now() + interval '5 days 7 hours', 'flat', 45000, true);

-- An overnight shift, to prove the stored interval handles the wrap.
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
values
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', date_trunc('day', now()) + interval '3 days 22 hours',
   date_trunc('day', now()) + interval '4 days 6 hours', 'hourly', 5000);

insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'internship',
   'Karrada', now() + interval '20 days', now() + interval '104 days');

\echo ''
\echo '== pricing is computed on the server =='

select public.assert(
  (select total_amount from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 40000,
  'hourly 5,000 x 8h stores a 40,000 total'
);
select public.assert(
  (select total_amount from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000004') = 40000,
  'an overnight 22:00-06:00 shift is priced as 8 hours, not minus 16'
);
select public.assert(
  (select total_amount from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000002') = 30000,
  'a flat listing keeps the total the pharmacy named'
);
select public.assert(
  (select total_amount from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000005') is null,
  'an internship carries no rate'
);

-- A pharmacy trying to understate what it will be charged.
select public.test_login('33333333-3333-3333-3333-333333333333');
update public.listings set total_amount = 1
  where id = 'aaaaaaaa-0000-0000-0000-000000000001';
select public.assert(
  (select total_amount from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 40000,
  'a pharmacy cannot overwrite the computed total to dodge the fee'
);

\echo ''
\echo '== listings: browse open, but never a rival''s private state =='

select public.test_logout();
update public.listings set status = 'cancelled'
  where id = 'aaaaaaaa-0000-0000-0000-000000000003';

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  not exists (select 1 from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000003'),
  'a pharmacy cannot read a rival pharmacy''s cancelled listing'
);
select public.assert(
  (select count(*) from public.listings where pharmacy_id = '33333333-3333-3333-3333-333333333333') = 4,
  'a pharmacy sees all of its own listings'
);

select public.test_logout();
update public.listings set status = 'open'
  where id = 'aaaaaaaa-0000-0000-0000-000000000003';

\echo ''
\echo '== browsing is open while verification is pending =='

select public.test_login('22222222-2222-2222-2222-222222222222');
select public.assert(
  (select count(*) from public.listings where type = 'shift' and status = 'open') = 4,
  'a pending pharmacist can browse every open shift'
);

\echo ''
\echo '== applications are queued during verification, not blocked =='

insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-000000000001',
        'aaaaaaaa-0000-0000-0000-000000000001',
        '22222222-2222-2222-2222-222222222222');
select public.assert(
  (select count(*) from public.applications) = 1,
  'a pending pharmacist can apply, and sees their own application'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  (select count(*) from public.applications
   where listing_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0,
  'the pharmacy cannot yet see an application from an unverified pharmacist'
);
select public.assert(
  (select count(*) from public.applicant_cards) = 0,
  'and it does not appear on the applicant card list either'
);
select public.assert_rejected(
  $$select public.accept_application('bbbbbbbb-0000-0000-0000-000000000001')$$,
  'nor can the pharmacy accept it by guessing the id'
);

-- The Syndicate review clears.
select public.test_logout();
update public.profiles set verification_status = 'verified'
  where id = '22222222-2222-2222-2222-222222222222';

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  (select count(*) from public.applications
   where listing_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1,
  'the queued application surfaces the moment verification clears'
);
select public.assert(
  (select syndicate_reg_masked from public.applicant_cards
   where applicant_id = '22222222-2222-2222-2222-222222222222') = '••••31',
  'the applicant card masks the Syndicate number to its last two characters'
);

\echo ''
\echo '== one applicant cannot see another =='

select public.test_logout();
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-000000000002',
        'aaaaaaaa-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111');

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert(
  (select count(*) from public.applications) = 1,
  'a pharmacist sees only their own application to a contested shift'
);
select public.assert(
  (select count(*) from public.applicant_cards) = 0,
  'and cannot read the applicant cards at all'
);

\echo ''
\echo '== accepting an applicant =='

select public.test_login('44444444-4444-4444-4444-444444444444');
select public.assert_rejected(
  $$select public.accept_application('bbbbbbbb-0000-0000-0000-000000000002')$$,
  'a rival pharmacy cannot accept an applicant to someone else''s listing'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-000000000002');

select public.assert(
  (select status from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 'filled',
  'accepting closes the listing'
);
select public.assert(
  (select status from public.applications where id = 'bbbbbbbb-0000-0000-0000-000000000001') = 'rejected',
  'and turns down the other applicants'
);
select public.assert(
  (select count(*) from public.bookings) = 1,
  'a booking exists'
);

\echo ''
\echo '== booking terms are snapshotted on the platform''s own numbers =='

-- Both accounts were created moments ago, so both are inside their free trial.
select public.assert(
  (select gross_amount from public.bookings) = 40000
  and (select pharmacy_fee from public.bookings) = 0
  and (select pharmacist_fee from public.bookings) = 0
  and (select net_payout from public.bookings) = 40000,
  'inside both trials, neither side is charged'
);

select public.test_logout();
-- Age both accounts past their trial and re-run the calculation directly.
select public.assert(
  (public.calculate_fees(40000, false, false)).pharmacy_charge = 42800
  and (public.calculate_fees(40000, false, false)).pharmacist_net = 38800
  and (public.calculate_fees(40000, false, false)).platform_gross = 4000,
  'the SQL fee engine reproduces the worked example'
);
select public.assert(
  (public.calculate_fees(20000, false, false)).platform_gross = 2500,
  'the SQL fee engine applies the 2,500 IQD floor'
);
select public.assert(
  (public.calculate_fees(40000, true, false)).pharmacist_fee = 1200
  and (public.calculate_fees(40000, true, false)).pharmacy_fee = 0,
  'a pharmacy in trial does not waive the pharmacist''s share'
);

-- Parity with src/config/fees.ts. These are the same rounding-sensitive amounts
-- that tests/unit/fees.test.ts runs, asserted to the same values. The two
-- implementations exist because a trigger cannot call TypeScript; keeping the
-- cases identical in both places is what stops them drifting apart unnoticed.
select public.assert(
  bool_and(
    (public.calculate_fees(amount, false, false)).pharmacy_fee
    + (public.calculate_fees(amount, false, false)).pharmacist_fee
    = (public.calculate_fees(amount, false, false)).platform_gross
  ),
  'the SQL engine reconciles on the same amounts the TypeScript test uses'
)
from unnest(array[33333, 41111, 27777, 55555, 12345]::numeric[]) as amount;

select public.assert(
  (public.calculate_fees(60000, false, false)).pharmacy_fee = 4200
  and (public.calculate_fees(60000, false, false)).pharmacist_fee = 1800,
  'the SQL engine splits 70/30 identically to the TypeScript'
);
select public.assert(
  (public.calculate_fees(40000, false, false)).processor_fee = 776
  and (public.calculate_fees(40000, false, false)).platform_net = 3224,
  'the processor cut comes out of our commission, not the payout'
);
select public.assert(
  (public.calculate_fees(0, false, false)).platform_gross = 0
  and not (public.calculate_fees(0, false, false)).floor_applied,
  'a zero-value listing does not attract the floor'
);

\echo ''
\echo '== a third party can see none of it =='

select public.test_login('44444444-4444-4444-4444-444444444444');
select public.assert(
  (select count(*) from public.bookings) = 0,
  'a rival pharmacy cannot read the booking'
);
select public.test_login('66666666-6666-6666-6666-666666666666');
select public.assert(
  (select count(*) from public.bookings) = 0,
  'a student cannot read the booking'
);

\echo ''
\echo '== the handoff gate =='

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert(
  (select count(*) from public.handoffs) = 1,
  'the pharmacist can see the handoff record for their booking'
);

select public.assert_rejected(
  $$update public.handoffs set confirmed_by_pharmacist_at = now()
    where booking_id = (select id from public.bookings)$$,
  'neither party can confirm before all five items are agreed'
);

update public.handoffs set items = '{
  "controlled_register_counted": true,
  "till_float_agreed": true,
  "fridge_log_checked": true,
  "keys_alarm_safe_handed_over": true,
  "owner_emergency_contact_confirmed": true
}'::jsonb
where booking_id = (select id from public.bookings);

update public.handoffs set confirmed_by_pharmacist_at = now()
where booking_id = (select id from public.bookings);

select public.assert(
  (select status from public.bookings) = 'upcoming',
  'one confirmation is not enough to complete the booking'
);

select public.assert_rejected(
  $$update public.handoffs set confirmed_by_pharmacist_at = null
    where booking_id = (select id from public.bookings)$$,
  'a confirmation cannot be withdrawn once given'
);

\echo ''
\echo '== dual confirmation completes the booking =='

select public.test_login('33333333-3333-3333-3333-333333333333');
update public.handoffs set confirmed_by_pharmacy_at = now()
where booking_id = (select id from public.bookings);

select public.assert(
  (select status from public.bookings) = 'completed'
  and (select completed_at from public.bookings) is not null,
  'both confirmations complete the booking'
);

\echo ''
\echo '== ratings =='

select public.test_login('44444444-4444-4444-4444-444444444444');
select public.assert_rejected(
  format($$insert into public.ratings (booking_id, rater_id, ratee_id, stars)
           values (%L, '44444444-4444-4444-4444-444444444444',
                   '11111111-1111-1111-1111-111111111111', 1)$$,
         (select id from public.bookings)),
  'an outsider cannot rate a booking they had no part in'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
insert into public.ratings (booking_id, rater_id, ratee_id, stars, comment)
select id, '33333333-3333-3333-3333-333333333333',
       '11111111-1111-1111-1111-111111111111', 5, 'Arrived early, left the register in order.'
from public.bookings;

select public.test_login('44444444-4444-4444-4444-444444444444');
select public.assert(
  (select count(*) from public.ratings) = 0,
  'a rival pharmacy cannot read the rating text or who gave it'
);

\echo ''
\echo '== derived statistics are computed, not stored =='

select public.assert(
  (select shifts_completed from public.pharmacist_stats
   where pharmacist_id = '11111111-1111-1111-1111-111111111111') = 1,
  'the completed shift counts towards the pharmacist''s record'
);
select public.assert(
  (select average_rating from public.pharmacist_stats
   where pharmacist_id = '11111111-1111-1111-1111-111111111111') = 5.00,
  'the average rating is derived from the ratings table'
);
select public.assert(
  (select reliability_percent from public.pharmacist_stats
   where pharmacist_id = '11111111-1111-1111-1111-111111111111') = 100,
  'reliability is 100% after one completed booking'
);
select public.assert(
  (select reliability_percent from public.pharmacist_stats
   where pharmacist_id = '22222222-2222-2222-2222-222222222222') is null,
  'a pharmacist with no history reads as no record, not as a perfect score'
);
select public.assert_rejected(
  $$update public.pharmacist_stats set shifts_completed = 99
    where pharmacist_id = '11111111-1111-1111-1111-111111111111'$$,
  'the statistics cannot be written to'
);

\echo ''
\echo '== cancellation windows =='

select public.test_logout();
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-000000000003',
        'aaaaaaaa-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111111');

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-000000000003');

-- That listing starts in ten days, so the pharmacist has ample notice.
select public.test_login('11111111-1111-1111-1111-111111111111');
select public.cancel_booking(
  (select id from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-000000000002')
);

select public.assert(
  (select cancellation_outcome from public.bookings
   where listing_id = 'aaaaaaaa-0000-0000-0000-000000000002') = 'free',
  'cancelling ten days out is a free cancellation'
);
select public.assert(
  (select reliability_percent from public.pharmacist_stats
   where pharmacist_id = '11111111-1111-1111-1111-111111111111') = 100,
  'and it leaves reliability untouched'
);
select public.assert(
  (select status from public.listings where id = 'aaaaaaaa-0000-0000-0000-000000000002') = 'open',
  'the cancelled shift goes back on the board'
);

\echo ''
\echo '== a late cancellation does count against the pharmacist =='

select public.test_logout();
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
values
  ('aaaaaaaa-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() + interval '5 hours', now() + interval '13 hours', 'hourly', 5000);
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-000000000004',
        'aaaaaaaa-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-111111111111');

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-000000000004');

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.cancel_booking(
  (select id from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-000000000006')
);

select public.assert(
  (select cancellation_outcome from public.bookings
   where listing_id = 'aaaaaaaa-0000-0000-0000-000000000006') = 'late',
  'cancelling five hours out is a late cancellation'
);
select public.assert(
  (select reliability_percent from public.pharmacist_stats
   where pharmacist_id = '11111111-1111-1111-1111-111111111111') = 50,
  'one completed and one late-cancelled booking reads as 50%'
);

\echo ''
\echo '== the platform admin can work the verification queue =='

select public.test_login('77777777-7777-7777-7777-777777777777');
select public.assert(
  (select count(*) from public.profiles where verification_status = 'pending') = 1,
  'an admin can see the pending queue'
);
update public.profiles set verification_status = 'verified'
  where id = '55555555-5555-5555-5555-555555555555';
select public.assert(
  (select verified_at from public.profiles
   where id = '55555555-5555-5555-5555-555555555555') is not null,
  'approving a pharmacy stamps verified_at automatically'
);

select public.test_logout();

\echo ''
\echo 'All RLS policy tests passed.'

rollback;
