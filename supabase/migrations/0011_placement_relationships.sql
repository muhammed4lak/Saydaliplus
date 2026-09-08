-- Two fixes for the placement screens.
--
-- 1. A placement's host must be an actual pharmacy. placements.pharmacy_id only
--    referenced profiles(id), so at the schema level a student's id was an
--    equally valid value and only RLS stood in the way. The same foreign key
--    listings got in 0007, for the same two reasons: it makes the wrong value
--    impossible, and it gives PostgREST the relationship it needs to embed the
--    pharmacy's name.
--
-- 2. The host pharmacy needs its trainee's name, and cannot have it. `profiles`
--    is private to its owner — correctly, it carries a phone number and a home
--    district — so embedding it from placements returns nothing for the
--    pharmacy. That is RLS working, not a bug to switch off.
--
--    So the name crosses through a narrow projection, the same pattern as
--    applicant_cards: owner rights, an explicit party filter, and only the
--    fields a supervising pharmacy actually needs to write a logbook approval.

alter table public.placements
  add constraint placements_pharmacy_id_fkey_details
  foreign key (pharmacy_id) references public.pharmacy_details (profile_id)
  on delete cascade;

create view public.placement_people
with (security_invoker = false)
as
select
  p.id as placement_id,
  p.student_id,
  p.pharmacy_id,
  student.full_name_en as student_name_en,
  student.full_name_ar as student_name_ar,
  sd.university
from public.placements p
join public.profiles student on student.id = p.student_id
left join public.student_details sd on sd.profile_id = p.student_id
where p.pharmacy_id = auth.uid()
   or p.student_id = auth.uid()
   or public.is_platform_admin();
