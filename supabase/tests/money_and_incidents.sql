-- Payouts, CV isolation, and the incident-reporting guards.

\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'ahmed@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'noor@example.com'),
  ('33333333-3333-3333-3333-333333333333', 'rahma@example.com'),
  ('77777777-7777-7777-7777-777777777777', 'admin@saydali.example');

insert into public.profiles (id, role, full_name_en, verification_status, verified_at, district) values
  ('11111111-1111-1111-1111-111111111111', 'pharmacist', 'Ahmed Al-Kubaisi', 'verified', now(), 'Karrada'),
  ('22222222-2222-2222-2222-222222222222', 'pharmacist', 'Noor Al-Sultani', 'verified', now(), 'Jadriya'),
  ('33333333-3333-3333-3333-333333333333', 'pharmacy', 'Al-Rahma Pharmacy', 'verified', now(), 'Karrada'),
  ('77777777-7777-7777-7777-777777777777', 'pharmacist', 'Platform Admin', 'verified', now(), 'Karrada');

insert into public.platform_admins (profile_id) values ('77777777-7777-7777-7777-777777777777');

insert into public.pharmacist_details (profile_id, syndicate_reg_no, graduation_year) values
  ('11111111-1111-1111-1111-111111111111', 'IQ-PH-004982', 2016),
  ('22222222-2222-2222-2222-222222222222', 'IQ-PH-007731', 2021);

insert into public.pharmacy_details (profile_id, pharmacy_name_en, licence_no) values
  ('33333333-3333-3333-3333-333333333333', 'Al-Rahma Pharmacy', 'IQ-PHM-000117');

\echo ''
\echo '== the CV is per-language and private to its author =='

select public.test_login('11111111-1111-1111-1111-111111111111');
insert into public.cv (pharmacist_id, lang, summary, skills) values
  ('11111111-1111-1111-1111-111111111111', 'en',
   'Community pharmacist with eight years on the counter in Baghdad.',
   array['Dispensing', 'Patient counselling', 'Narcotics register']),
  ('11111111-1111-1111-1111-111111111111', 'ar',
   'صيدلي مجتمعي بخبرة ثماني سنوات في بغداد.',
   array['الصرف', 'إرشاد المرضى']);

select public.assert(
  (select count(*) from public.cv) = 2,
  'the CV exists twice — once per language — as separate content'
);

select public.test_login('22222222-2222-2222-2222-222222222222');
select public.assert(
  (select count(*) from public.cv) = 0,
  'a pharmacist cannot read another pharmacist''s CV'
);
select public.assert_rejected(
  $$insert into public.cv (pharmacist_id, lang, summary)
    values ('11111111-1111-1111-1111-111111111111', 'en', 'Rewritten by someone else.')$$,
  'nor write to it'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  (select count(*) from public.cv) = 0,
  'a pharmacy cannot read a pharmacist''s CV either — public CV pages are not v1'
);

\echo ''
\echo '== payouts =='

select public.test_logout();
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
values
  ('aaaaaaaa-0000-0000-0000-0000000000c1', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() - interval '3 days', now() - interval '3 days' + interval '8 hours', 'hourly', 5000),
  ('aaaaaaaa-0000-0000-0000-0000000000c2', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() - interval '2 days', now() - interval '2 days' + interval '6 hours', 'hourly', 5000);

insert into public.applications (id, listing_id, applicant_id) values
  ('bbbbbbbb-0000-0000-0000-0000000000c1', 'aaaaaaaa-0000-0000-0000-0000000000c1',
   '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0000-0000-0000-0000000000c2', 'aaaaaaaa-0000-0000-0000-0000000000c2',
   '11111111-1111-1111-1111-111111111111');

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-0000000000c1');
select public.accept_application('bbbbbbbb-0000-0000-0000-0000000000c2');

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert_rejected(
  $$select public.request_payout('zaincash')$$,
  'a payout is refused with no wallet number on file'
);

select public.test_logout();
update public.pharmacist_details set payout_destination = '07701234567'
  where profile_id = '11111111-1111-1111-1111-111111111111';

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert_rejected(
  $$select public.request_payout('zaincash')$$,
  'and still refused before any shift is completed'
);

-- Work both shifts through to completion.
select public.test_logout();
update public.handoffs set items = '{
  "controlled_register_counted": true, "till_float_agreed": true,
  "fridge_log_checked": true, "keys_alarm_safe_handed_over": true,
  "owner_emergency_contact_confirmed": true }'::jsonb,
  confirmed_by_pharmacist_at = now(), confirmed_by_pharmacy_at = now();

select public.assert(
  (select count(*) from public.bookings where status = 'completed') = 2,
  'both bookings completed'
);

select public.test_login('11111111-1111-1111-1111-111111111111');
select public.assert(
  (select count(*) from public.payable_bookings) = 2,
  'both completed bookings are payable'
);

select public.request_payout('zaincash');

select public.assert(
  (select amount from public.payouts) = 70000,
  'the payout totals both completed shifts (40,000 + 30,000, both in trial)'
);
select public.assert(
  (select count(*) from public.payout_items) = 2,
  'and claims both bookings'
);
select public.assert(
  (select count(*) from public.payable_bookings) = 0,
  'nothing is left payable'
);
select public.assert_rejected(
  $$select public.request_payout('zaincash')$$,
  'a second request finds nothing — a shift cannot be paid twice'
);

select public.test_login('22222222-2222-2222-2222-222222222222');
select public.assert(
  (select count(*) from public.payouts) = 0,
  'a pharmacist cannot see another pharmacist''s payouts'
);
select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  (select count(*) from public.payouts) = 0,
  'nor can the pharmacy that paid for the shift'
);

\echo ''
\echo '== no balances are held anywhere =='

select public.assert(
  not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and column_name in ('balance', 'wallet_balance')
  ),
  'the schema holds no balance column — we are a merchant, not a wallet'
);

\echo ''
\echo '== incidents: the evidence gate =='

select public.test_logout();
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
values
  ('aaaaaaaa-0000-0000-0000-0000000000c3', '33333333-3333-3333-3333-333333333333', 'shift',
   'Karrada', now() + interval '4 days', now() + interval '4 days 8 hours', 'hourly', 5000);
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-0000000000c3', 'aaaaaaaa-0000-0000-0000-0000000000c3',
        '22222222-2222-2222-2222-222222222222');

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-0000000000c3');

-- This booking has no completed handoff yet.
select public.assert_rejected(
  format($$insert into public.incidents (booking_id, reporter_id, subject_id, category, description)
           values (%L, '33333333-3333-3333-3333-333333333333',
                   '22222222-2222-2222-2222-222222222222', 'conduct',
                   'A complaint about a shift where no joint handoff record was ever completed.')$$,
         (select id from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c3')),
  'no report can be filed without a completed two-party handoff'
);

-- Against a shift that did have one.
\set booking '(select id from public.bookings where listing_id = ''aaaaaaaa-0000-0000-0000-0000000000c1'')'

select public.assert_rejected(
  format($$insert into public.incidents (booking_id, reporter_id, subject_id, category, description)
           values (%L, '33333333-3333-3333-3333-333333333333',
                   '11111111-1111-1111-1111-111111111111', 'conduct', 'Too short.')$$,
         (select id from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c1')),
  'a report needs a real description, not a one-liner'
);

insert into public.incidents (booking_id, reporter_id, subject_id, category, description)
select id, '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
       'till_discrepancy',
       'The till float was 15,000 IQD short at the end of the shift against the figure we both counted and signed for at handover.'
from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c1';

select public.assert(
  (select tier from public.incidents) = 'tier_1'
  and (select status from public.incidents) = 'submitted',
  'every report starts at tier 1 — nothing leaves the platform'
);

\echo ''
\echo '== the reporter cannot choose the tier =='

select public.test_logout();
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount)
values ('aaaaaaaa-0000-0000-0000-0000000000c4', '33333333-3333-3333-3333-333333333333', 'shift',
        'Karrada', now() - interval '9 days', now() - interval '9 days' + interval '8 hours', 'hourly', 5000);
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-0000000000c4', 'aaaaaaaa-0000-0000-0000-0000000000c4',
        '22222222-2222-2222-2222-222222222222');
select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-0000000000c4');
select public.test_logout();
update public.handoffs set items = '{
  "controlled_register_counted": true, "till_float_agreed": true,
  "fridge_log_checked": true, "keys_alarm_safe_handed_over": true,
  "owner_emergency_contact_confirmed": true }'::jsonb,
  confirmed_by_pharmacist_at = now(), confirmed_by_pharmacy_at = now()
where booking_id = (select id from public.bookings
                    where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c4');

select public.test_login('33333333-3333-3333-3333-333333333333');
insert into public.incidents (booking_id, reporter_id, subject_id, category, description, tier)
select id, '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
       'controlled_substance_discrepancy',
       'The narcotics register did not reconcile at the end of the shift, against the count we both signed at handover.',
       'tier_3'
from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c4';

select public.assert(
  (select tier from public.incidents
   where subject_id = '22222222-2222-2222-2222-222222222222') = 'tier_1',
  'a reporter asking for tier 3 still files at tier 1'
);

\echo ''
\echo '== symmetry: a pharmacist can report a pharmacy =='

select public.test_login('11111111-1111-1111-1111-111111111111');
insert into public.incidents (booking_id, reporter_id, subject_id, category, description)
select id, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333',
       'non_payment',
       'The shift was completed and confirmed by both of us three weeks ago and the payout has still not been released.'
from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c2';

select public.assert(
  (select count(*) from public.incidents
   where subject_id = '33333333-3333-3333-3333-333333333333') = 1,
  'non-payment is reportable against a pharmacy on the same rails'
);

select public.assert_rejected(
  format($$insert into public.incidents (booking_id, reporter_id, subject_id, category, description)
           values (%L, '11111111-1111-1111-1111-111111111111',
                   '22222222-2222-2222-2222-222222222222', 'conduct',
                   'A report about a pharmacist I have never worked a shift alongside.')$$,
         (select id from public.bookings where listing_id = 'aaaaaaaa-0000-0000-0000-0000000000c1')),
  'a report can only name the other party to the booking'
);

\echo ''
\echo '== the subject can read what is alleged, outsiders cannot =='

select public.assert(
  (select count(*) from public.incidents
   where subject_id = '11111111-1111-1111-1111-111111111111') = 1,
  'the subject of a report can read it — they cannot answer what they cannot see'
);

select public.test_login('22222222-2222-2222-2222-222222222222');
select public.assert(
  (select count(*) from public.incidents
   where subject_id = '11111111-1111-1111-1111-111111111111') = 0,
  'an uninvolved pharmacist cannot read a report about a colleague'
);

\echo ''
\echo '== escalation requires a reviewer, a reply window, and for tier 3 a flag =='

\set incident '(select id from public.incidents where category = ''till_discrepancy'')'

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert_rejected(
  format($$select public.escalate_incident(%L, 'tier_2')$$,
         (select id from public.incidents where category = 'till_discrepancy')),
  'the reporter cannot escalate their own report'
);

select public.test_login('77777777-7777-7777-7777-777777777777');
select public.assert_rejected(
  format($$select public.escalate_incident(%L, 'tier_2')$$,
         (select id from public.incidents where category = 'till_discrepancy')),
  'a reviewer cannot escalate before the subject has been notified'
);

select public.test_logout();
update public.incidents set subject_notified_at = now()
  where category = 'till_discrepancy';

select public.test_login('77777777-7777-7777-7777-777777777777');
select public.assert_rejected(
  format($$select public.escalate_incident(%L, 'tier_2')$$,
         (select id from public.incidents where category = 'till_discrepancy')),
  'nor during the 7-day window the subject has to reply'
);

select public.test_logout();
update public.incidents set subject_reply = 'The float was counted with a customer waiting; I dispute the figure.',
                            subject_replied_at = now()
  where category = 'till_discrepancy';

select public.test_login('77777777-7777-7777-7777-777777777777');
select public.escalate_incident(
  (select id from public.incidents where category = 'till_discrepancy'), 'tier_2');

select public.assert(
  (select tier from public.incidents where category = 'till_discrepancy') = 'tier_2',
  'with a reply on file, a reviewer can escalate to tier 2'
);
select public.assert(
  (select verification_status from public.profiles
   where id = '11111111-1111-1111-1111-111111111111') = 'pending',
  'tier 2 freezes the subject''s account pending resolution'
);

select public.test_logout();
update public.incidents set subject_notified_at = now() - interval '30 days',
                            subject_reply = 'I answered this at the time.',
                            subject_replied_at = now() - interval '20 days'
  where category = 'controlled_substance_discrepancy';

select public.test_login('77777777-7777-7777-7777-777777777777');
select public.assert_rejected(
  format($$select public.escalate_incident(%L, 'tier_3')$$,
         (select id from public.incidents where category = 'controlled_substance_discrepancy')),
  'tier 3 is refused: we have not confirmed the Syndicate accepts reports this way'
);
select public.assert(
  public.feature_enabled('incident_tier_3_syndicate_escalation') = false,
  'and the flag that gates it is off'
);

select public.test_logout();

\echo ''
\echo 'All payout, CV and incident tests passed.'

rollback;
