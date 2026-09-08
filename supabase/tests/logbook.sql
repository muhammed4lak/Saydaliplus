-- Logbook state-machine tests, run against the real database.
--
-- The TypeScript equivalents in tests/unit/logbook.test.ts cover the same rules
-- for the client. These prove the server does not take the client's word for it.

\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email) values
  ('66666666-6666-6666-6666-666666666666', 'zainab@uobaghdad.edu.iq'),
  ('88888888-8888-8888-8888-888888888888', 'mustafa@uobasrah.edu.iq'),
  ('33333333-3333-3333-3333-333333333333', 'rahma@example.com'),
  ('44444444-4444-4444-4444-444444444444', 'furat@example.com');

insert into public.profiles (id, role, full_name_en, verification_status, verified_at, district) values
  ('66666666-6666-6666-6666-666666666666', 'student', 'Zainab Al-Tamimi', 'verified', now(), 'Karrada'),
  ('88888888-8888-8888-8888-888888888888', 'student', 'Mustafa Hussein', 'verified', now(), 'Basrah'),
  ('33333333-3333-3333-3333-333333333333', 'pharmacy', 'Al-Rahma Pharmacy', 'verified', now(), 'Karrada'),
  ('44444444-4444-4444-4444-444444444444', 'pharmacy', 'Al-Furat Pharmacy', 'verified', now(), 'Jadriya');

insert into public.student_details (profile_id, university, university_email) values
  ('66666666-6666-6666-6666-666666666666', 'University of Baghdad', 'zainab@uobaghdad.edu.iq'),
  ('88888888-8888-8888-8888-888888888888', 'University of Basrah', 'mustafa@uobasrah.edu.iq');

insert into public.pharmacy_details (profile_id, pharmacy_name_en, licence_no) values
  ('33333333-3333-3333-3333-333333333333', 'Al-Rahma Pharmacy', 'IQ-PHM-000117'),
  ('44444444-4444-4444-4444-444444444444', 'Al-Furat Pharmacy', 'IQ-PHM-000232');

insert into public.listings (id, pharmacy_id, type, district, starts_at, ends_at)
values ('aaaaaaaa-0000-0000-0000-00000000000a', '33333333-3333-3333-3333-333333333333',
        'internship', 'Karrada', date '2026-06-15', date '2026-09-07');

insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-00000000000a',
        'aaaaaaaa-0000-0000-0000-00000000000a',
        '66666666-6666-6666-6666-666666666666');

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.accept_application('bbbbbbbb-0000-0000-0000-00000000000a');
select public.test_logout();

\set placement '(select id from public.placements limit 1)'

\echo ''
\echo '== accepting a student creates the programme =='

select public.assert(
  (select count(*) from public.placements) = 1,
  'an accepted internship creates a placement, not a booking'
);
select public.assert(
  (select count(*) from public.bookings) = 0,
  'and no booking, because an internship carries no money'
);
select public.assert(
  (select count(*) from public.log_weeks) = 12,
  'twelve weeks are laid out'
);
select public.assert(
  (select count(*) from public.log_weeks where status = 'draft') = 1
  and (select count(*) from public.log_weeks where status = 'locked') = 11,
  'only week 1 is open; the rest are locked behind it'
);
select public.assert(
  (select week_end - week_start from public.log_weeks where week_no = 1) = 4,
  'a logbook week runs Sunday to Thursday — five working days'
);

\echo ''
\echo '== a week cannot be submitted without attendance or substance =='

select public.test_login('66666666-6666-6666-6666-666666666666');

\set week1 '(select id from public.log_weeks where placement_id = ' :placement ' and week_no = 1)'

update public.log_weeks
set text_en = 'Learned how the dispensary is organised, and spent most of the week observing at the OTC counter.'
where id = :week1 ;

select public.assert_rejected(
  format($$select public.submit_log_week(%L)$$, (select id from public.log_weeks where week_no = 1)),
  'a week with no days attended cannot be submitted'
);

update public.log_weeks
set days_present = array[true, true, true, true, true], text_en = 'Was there.'
where id = :week1 ;

select public.assert_rejected(
  format($$select public.submit_log_week(%L)$$, (select id from public.log_weeks where week_no = 1)),
  'a one-line entry is under the 80-character minimum'
);

\echo ''
\echo '== the log fills forward and cannot be back-filled =='

update public.log_weeks
set text_en = 'Learned how the dispensary is organised — stock arranged by therapeutic class, fridge lines kept separate. Spent most of the week at the OTC counter.'
where id = :week1 ;

select public.assert_rejected(
  format($$select public.submit_log_week(%L)$$,
         (select id from public.log_weeks where week_no = 6)),
  'week 6 cannot be submitted while it is still locked'
);

select public.assert_rejected(
  $$update public.log_weeks set text_en = 'Filling this in at the end of summer.'
    where week_no = 6$$,
  'nor can a locked week even be written to'
);

select public.submit_log_week((select id from public.log_weeks where week_no = 1));

select public.assert(
  (select status from public.log_weeks where week_no = 1) = 'submitted',
  'week 1 is submitted'
);
select public.assert(
  (select status from public.log_weeks where week_no = 2) = 'draft',
  'and submitting it unlocked week 2'
);
select public.assert(
  (select status from public.log_weeks where week_no = 3) = 'locked',
  'but not week 3'
);

select public.assert_rejected(
  $$update public.log_weeks set status = 'approved' where week_no = 1$$,
  'a student cannot approve their own week'
);
select public.assert_rejected(
  $$update public.log_weeks set text_en = 'Rewriting after the fact.' where week_no = 1$$,
  'nor rewrite a week once it has been submitted'
);

\echo ''
\echo '== month approval is gated on all four weeks =='

select public.assert(
  public.month_status(:placement , 1) = 'active',
  'month 1 is in progress with one week in'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert_rejected(
  format($$select public.approve_month(%L, 1)$$, (select id from public.placements limit 1)),
  'the pharmacy cannot approve month 1 before all four weeks are submitted'
);

-- Fill weeks 2 to 4 the way the student would have to.
select public.test_login('66666666-6666-6666-6666-666666666666');
do $$
declare
  target_week public.log_weeks;
  week_index int;
begin
  for week_index in 2..4 loop
    select * into target_week from public.log_weeks where week_no = week_index;
    update public.log_weeks
    set days_present = array[true, true, true, true, false],
        text_en = 'Practised handling simple OTC requests under supervision, and learned to ask who the medicine is actually for before recommending anything.'
    where id = target_week.id;
    perform public.submit_log_week(target_week.id);
  end loop;
end
$$;

select public.assert(
  public.month_status(:placement , 1) = 'ready',
  'with four weeks submitted, month 1 is awaiting approval'
);

\echo ''
\echo '== only the host pharmacy may approve =='

select public.test_login('44444444-4444-4444-4444-444444444444');
select public.assert(
  (select count(*) from public.log_weeks) = 0,
  'a pharmacy that is not the host cannot read the trainee''s log at all'
);
select public.assert_rejected(
  format($$select public.approve_month(%L, 1)$$, (select id from public.placements limit 1)),
  'nor approve a month on it'
);

select public.assert(
  (select count(*) from public.placement_people) = 0,
  'nor read the trainee''s name through placement_people'
);

select public.test_login('88888888-8888-8888-8888-888888888888');
select public.assert(
  (select count(*) from public.log_weeks) = 0,
  'another student cannot read this student''s log'
);
select public.assert(
  (select count(*) from public.placement_people) = 0,
  'nor the other student''s placement record'
);

select public.test_login('33333333-3333-3333-3333-333333333333');
select public.assert(
  (select count(*) from public.log_weeks) = 12,
  'the host pharmacy can read the whole logbook'
);
select public.assert(
  (select student_name_en from public.placement_people) = 'Zainab Al-Tamimi',
  'and its trainee''s name, which profiles itself would not give it'
);
select public.approve_month((select id from public.placements limit 1), 1);
select public.assert(
  public.month_status(:placement , 1) = 'approved',
  'the host pharmacy approves month 1'
);
select public.assert(
  (select count(*) from public.log_weeks where week_no <= 4 and status = 'approved') = 4,
  'all four weeks are approved together'
);

\echo ''
\echo '== returning a month reopens it for rewriting =='

select public.return_month((select id from public.placements limit 1), 1, 'Please add more detail on the narcotics register.');
select public.assert(
  (select count(*) from public.log_weeks where week_no <= 4 and status = 'draft') = 4,
  'returning a month sets its four weeks back to draft'
);
select public.assert(
  (select returned_note from public.month_approvals where month_no = 1)
    = 'Please add more detail on the narcotics register.',
  'and records why'
);
select public.assert(
  (select status from public.log_weeks where week_no = 5) = 'draft',
  'the weeks already unlocked beyond it stay unlocked'
);

\echo ''
\echo '== the certificate stays locked until all three months are approved =='

select public.assert(
  (select unlocked from public.placement_certificates) = false,
  'the certificate is locked with month 1 returned'
);

select public.test_logout();
-- Walk the whole programme through to approval.
do $$
declare
  v_placement uuid;
  v_week_id uuid;
  week_index int;
  month_index int;
begin
  select id into v_placement from public.placements limit 1;

  for week_index in 1..12 loop
    select id into v_week_id from public.log_weeks
      where placement_id = v_placement and week_no = week_index;
    update public.log_weeks
    set days_present = array[true, true, true, true, true],
        text_en = 'A full week on the counter, covering chronic-disease refills and learning how adherence is checked by asking when the last box ran out.',
        status = 'submitted',
        submitted_at = now()
    where id = v_week_id;
  end loop;

  for month_index in 1..3 loop
    update public.log_weeks set status = 'approved'
      where placement_id = v_placement and ceil(week_no / 4.0) = month_index;
    update public.month_approvals
      set approved_by = '33333333-3333-3333-3333-333333333333', approved_at = now()
      where placement_id = v_placement and month_no = month_index;
  end loop;
end
$$;

select public.test_login('66666666-6666-6666-6666-666666666666');
select public.assert(
  (select unlocked from public.placement_certificates) = true,
  'with all three months approved, the certificate unlocks'
);
select public.assert(
  (select weeks_approved from public.placement_certificates) = 12,
  'and records twelve approved weekly logs'
);
select public.assert(
  (select days_attended from public.placement_certificates) = 60
  and (select days_possible from public.placement_certificates) = 60,
  'attendance totals are computed from the weeks, not entered'
);

select public.test_logout();

\echo ''
\echo 'All logbook tests passed.'

rollback;
