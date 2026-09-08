-- Notifications are raised by the database, not by application code.
--
-- The events that matter — your shift was filled, someone applied, a month of
-- logs is waiting for you — all happen inside functions that already run in one
-- transaction (accept_application, approve_month, the handoff completion
-- trigger). Raising the notification there means it cannot get out of step with
-- the thing it describes: there is no path where a booking exists and its
-- notification was lost because a Server Action returned early.
--
-- title_key is a message key, not a sentence. Notifications are rendered in the
-- reader's language at read time, so a pharmacist who switches to English does
-- not find a backlog of Arabic notices.

create or replace function public.notify(
  user_id uuid,
  type text,
  title_key text,
  payload jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into public.notifications (user_id, type, title_key, payload)
  values (notify.user_id, notify.type, notify.title_key, notify.payload);
$$;

-- A new application. Only once the applicant is verified — an application held
-- back during Syndicate review must not announce itself to the pharmacy through
-- a notification when RLS is hiding the row itself.
create or replace function public.notify_on_application()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target public.listings;
begin
  select * into target from public.listings where id = new.listing_id;

  if public.profile_is_verified(new.applicant_id) then
    perform public.notify(
      target.pharmacy_id, 'application', 'notifications.newApplicant',
      jsonb_build_object('listing_id', target.id)
    );
  end if;

  return new;
end;
$$;

create trigger applications_notify
  after insert on public.applications
  for each row execute function public.notify_on_application();

-- An application whose applicant has just been verified is, from the pharmacy's
-- point of view, a new application: it becomes visible at that moment.
create or replace function public.notify_on_verification()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  waiting record;
begin
  if new.verification_status = 'verified'
     and old.verification_status is distinct from 'verified' then
    for waiting in
      select distinct l.pharmacy_id, l.id as listing_id
      from public.applications a
      join public.listings l on l.id = a.listing_id
      where a.applicant_id = new.id and a.status = 'applied'
    loop
      perform public.notify(
        waiting.pharmacy_id, 'application', 'notifications.newApplicant',
        jsonb_build_object('listing_id', waiting.listing_id)
      );
    end loop;
  end if;

  return new;
end;
$$;

create trigger profiles_notify_verification
  after update on public.profiles
  for each row execute function public.notify_on_verification();

create or replace function public.notify_on_booking()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.notify(
    new.pharmacist_id, 'booking', 'notifications.shiftConfirmed',
    jsonb_build_object('booking_id', new.id)
  );
  return new;
end;
$$;

create trigger bookings_notify
  after insert on public.bookings
  for each row execute function public.notify_on_booking();

-- A cancellation is the one notification that has to arrive: it means somebody
-- now has an uncovered shift, or a pharmacist has lost work they had planned for.
create or replace function public.notify_on_cancellation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    perform public.notify(
      case when new.cancelled_by = new.pharmacist_id then new.pharmacy_id else new.pharmacist_id end,
      'booking', 'notifications.shiftCancelled',
      jsonb_build_object('booking_id', new.id)
    );
  end if;
  return new;
end;
$$;

create trigger bookings_notify_cancellation
  after update on public.bookings
  for each row execute function public.notify_on_cancellation();

-- A submitted week that completes a month tells the pharmacy there is something
-- to approve. Notifying on every week would train them to ignore it.
create or replace function public.notify_on_log_week()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  placement public.placements;
  month_no int;
begin
  if new.status = 'submitted' and old.status is distinct from 'submitted' then
    select * into placement from public.placements where id = new.placement_id;
    month_no := ceil(new.week_no / 4.0);

    if public.month_status(new.placement_id, month_no) = 'ready' then
      perform public.notify(
        placement.pharmacy_id, 'logbook', 'notifications.monthReady',
        jsonb_build_object('placement_id', placement.id, 'month_no', month_no)
      );
    end if;
  end if;

  if new.status = 'approved' and old.status is distinct from 'approved' then
    select * into placement from public.placements where id = new.placement_id;
    if new.week_no % 4 = 0 then
      perform public.notify(
        placement.student_id, 'logbook', 'notifications.monthApproved',
        jsonb_build_object('placement_id', placement.id, 'month_no', ceil(new.week_no / 4.0))
      );
    end if;
  end if;

  return new;
end;
$$;

create trigger log_weeks_notify
  after update on public.log_weeks
  for each row execute function public.notify_on_log_week();

create or replace function public.notify_on_placement()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.notify(
    new.student_id, 'placement', 'notifications.placementConfirmed',
    jsonb_build_object('placement_id', new.id)
  );
  return new;
end;
$$;

create trigger placements_notify
  after insert on public.placements
  for each row execute function public.notify_on_placement();

-- The subject of an incident report is told, because the right of reply is
-- meaningless if they do not know a report exists.
create or replace function public.notify_on_incident()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.notify(
    new.subject_id, 'incident', 'notifications.incidentFiled',
    jsonb_build_object('incident_id', new.id)
  );
  return new;
end;
$$;

create trigger incidents_notify
  after insert on public.incidents
  for each row execute function public.notify_on_incident();
