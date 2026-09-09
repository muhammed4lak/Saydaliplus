-- Development seed.
--
-- Applied automatically by `supabase db reset`. Gives you an app you can sign
-- into and click through, rather than an empty database where nothing is
-- reachable until you have created four accounts by hand.
--
-- Every account's password is `password123`. This file is for local development
-- only; it is never applied to a deployed project.

-- Passwords are written the way GoTrue expects, so these accounts can actually
-- sign in rather than only existing in `profiles`.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'ahmed@example.com',
   crypt('password123', gen_salt('bf')), now(), now() - interval '400 days', now(),
   '{"provider":"email","providers":["email"]}', '{}'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'noor@example.com',
   crypt('password123', gen_salt('bf')), now(), now() - interval '3 days', now(),
   '{"provider":"email","providers":["email"]}', '{}'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'rahma@example.com',
   crypt('password123', gen_salt('bf')), now(), now() - interval '200 days', now(),
   '{"provider":"email","providers":["email"]}', '{}'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'zainab@uobaghdad.edu.iq',
   crypt('password123', gen_salt('bf')), now(), now() - interval '30 days', now(),
   '{"provider":"email","providers":["email"]}', '{}'),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'admin@saydali.example',
   crypt('password123', gen_salt('bf')), now(), now() - interval '400 days', now(),
   '{"provider":"email","providers":["email"]}', '{}')
on conflict (id) do nothing;

insert into public.profiles
  (id, role, full_name_en, full_name_ar, phone, district, verification_status, verified_at, created_at)
values
  -- Established pharmacist, well past the free trial, with a real record.
  ('11111111-1111-1111-1111-111111111111', 'pharmacist', 'Ahmed Al-Kubaisi', 'أحمد الكبيسي',
   '07701234567', 'Karrada', 'verified', now() - interval '395 days', now() - interval '400 days'),
  -- Signed up three days ago and still waiting on the Syndicate: this is the
  -- account that shows the pending banner and the queued-application rule.
  ('22222222-2222-2222-2222-222222222222', 'pharmacist', 'Noor Al-Sultani', 'نور السلطاني',
   '07709876543', 'Jadriya', 'pending', null, now() - interval '3 days'),
  ('33333333-3333-3333-3333-333333333333', 'pharmacy', 'Layla Hassan', 'ليلى حسن',
   '07705554444', 'Karrada', 'verified', now() - interval '195 days', now() - interval '200 days'),
  ('44444444-4444-4444-4444-444444444444', 'student', 'Zainab Al-Tamimi', 'زينب التميمي',
   '07701112222', 'Karrada', 'verified', now() - interval '30 days', now() - interval '30 days'),
  ('99999999-9999-9999-9999-999999999999', 'pharmacist', 'Platform Reviewer', 'مراجع المنصة',
   '07700000000', 'Karrada', 'verified', now() - interval '395 days', now() - interval '400 days')
on conflict (id) do nothing;

insert into public.platform_admins (profile_id)
values ('99999999-9999-9999-9999-999999999999')
on conflict do nothing;

insert into public.pharmacist_details
  (profile_id, syndicate_reg_no, graduation_year, scope_tags, districts, payout_destination)
values
  ('11111111-1111-1111-1111-111111111111', 'IQ-PH-004982', 2016,
   array['controlled', 'night_shifts'], array['Karrada', 'Jadriya', 'Zayouna'], '07701234567'),
  ('22222222-2222-2222-2222-222222222222', 'IQ-PH-007731', 2021,
   array['otc'], array['Jadriya'], null),
  ('99999999-9999-9999-9999-999999999999', 'IQ-PH-000001', 2010, '{}', '{}', null)
on conflict do nothing;

insert into public.pharmacy_details
  (profile_id, pharmacy_name_en, pharmacy_name_ar, licence_no, address)
values
  ('33333333-3333-3333-3333-333333333333', 'Al-Rahma Pharmacy', 'صيدلية الرحمة',
   'IQ-PHM-000117', 'Karrada Dakhil, near Al-Firdaws roundabout')
on conflict do nothing;

insert into public.student_details (profile_id, university, university_email, email_verified_at)
values
  ('44444444-4444-4444-4444-444444444444', 'University of Baghdad',
   'zainab@uobaghdad.edu.iq', now() - interval '30 days')
on conflict do nothing;

-- Listings covering the cases worth seeing: hourly, flat, one that crosses
-- midnight, one that hits the 2,500 IQD commission floor, and an internship.
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount,
   includes_controlled, notes)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
   'shift', 'Karrada',
   date_trunc('day', now()) + interval '2 days 8 hours',
   date_trunc('day', now()) + interval '2 days 16 hours',
   'hourly', 5000, false,
   'Straightforward counter coverage — no narcotics log involved.'),

  ('aaaaaaaa-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
   'shift', 'Karrada',
   date_trunc('day', now()) + interval '4 days 16 hours',
   date_trunc('day', now()) + interval '4 days 23 hours',
   'flat', 45000, true,
   'Evening shift — includes a short narcotics-log briefing at handover.'),

  -- 22:00–06:00. Stored as a real interval, so it prices as eight hours.
  ('aaaaaaaa-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
   'shift', 'Zayouna',
   date_trunc('day', now()) + interval '6 days 22 hours',
   date_trunc('day', now()) + interval '7 days 6 hours',
   'hourly', 6000, true,
   'Overnight cover while I travel. Safe code handed over in person.'),

  -- 4,000 x 5h = 20,000, whose 10% is under the floor.
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
   'shift', 'Karrada',
   date_trunc('day', now()) + interval '8 days 8 hours',
   date_trunc('day', now()) + interval '8 days 13 hours',
   'hourly', 4000, false,
   'Quiet Saturday morning. Regular customers, mostly refills.'),

  ('aaaaaaaa-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333',
   'internship', 'Karrada',
   date_trunc('day', now()) + interval '20 days',
   date_trunc('day', now()) + interval '104 days',
   null, null, false,
   'Twelve-week summer training. Mostly OTC counter and inventory, with dispensing shadowing.')
on conflict (id) do nothing;

-- A completed shift for Ahmed, so the derived statistics, the CV's verified
-- half and the earnings screen all have something real behind them.
insert into public.listings
  (id, pharmacy_id, type, district, starts_at, ends_at, rate_type, rate_amount, includes_controlled)
values
  ('aaaaaaaa-0000-0000-0000-0000000000ff', '33333333-3333-3333-3333-333333333333',
   'shift', 'Karrada', now() - interval '9 days', now() - interval '9 days' + interval '8 hours',
   'hourly', 5000, false)
on conflict (id) do nothing;

update public.listings set status = 'filled'
  where id = 'aaaaaaaa-0000-0000-0000-0000000000ff';

insert into public.bookings
  (id, listing_id, pharmacist_id, pharmacy_id, status,
   gross_amount, pharmacy_fee, pharmacist_fee, net_payout, completed_at)
values
  ('cccccccc-0000-0000-0000-0000000000ff', 'aaaaaaaa-0000-0000-0000-0000000000ff',
   '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333',
   'completed', 40000, 2800, 1200, 38800, now() - interval '9 days')
on conflict (id) do nothing;

insert into public.handoffs
  (booking_id, items, confirmed_by_pharmacist_at, confirmed_by_pharmacy_at)
values
  ('cccccccc-0000-0000-0000-0000000000ff', '{
     "controlled_register_counted": true,
     "till_float_agreed": true,
     "fridge_log_checked": true,
     "keys_alarm_safe_handed_over": true,
     "owner_emergency_contact_confirmed": true
   }'::jsonb, now() - interval '9 days', now() - interval '9 days')
on conflict (booking_id) do nothing;

insert into public.ratings (booking_id, rater_id, ratee_id, stars, comment)
values
  ('cccccccc-0000-0000-0000-0000000000ff', '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111', 5,
   'Arrived early and left the register in order.')
on conflict do nothing;

-- Noor's application, made while still pending. The pharmacy cannot see it —
-- that is the queued-application rule, and it is worth being able to watch it
-- appear the moment you verify her in the review queue.
insert into public.applications (id, listing_id, applicant_id)
values ('bbbbbbbb-0000-0000-0000-000000000001',
        'aaaaaaaa-0000-0000-0000-000000000001',
        '22222222-2222-2222-2222-222222222222')
on conflict do nothing;

insert into public.cv (pharmacist_id, lang, summary, skills, languages, experience)
values
  ('11111111-1111-1111-1111-111111111111', 'en',
   'Community pharmacist with eight years on the counter in Baghdad.',
   array['Dispensing', 'Patient counselling', 'Narcotics register'],
   '[{"language":"Arabic","proficiency":"native"},{"language":"English","proficiency":"professional"}]'::jsonb,
   '[{"role":"Pharmacist","organisation":"Al-Salam Pharmacy","from":"2018","to":"2024",
      "details":"Counter, dispensing and stock control in a busy Karrada pharmacy."}]'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'ar',
   'صيدلي مجتمعي بخبرة ثماني سنوات على الكاونتر في بغداد.',
   array['صرف الأدوية', 'إرشاد المرضى', 'سجل المواد المخدرة'],
   '[{"language":"العربية","proficiency":"native"},{"language":"الإنجليزية","proficiency":"professional"}]'::jsonb,
   '[{"role":"صيدلي","organisation":"صيدلية السلام","from":"2018","to":"2024",
      "details":"العمل على الكاونتر وصرف الأدوية وإدارة المخزون في صيدلية مزدحمة بالكرادة."}]'::jsonb)
on conflict (pharmacist_id, lang) do nothing;
