-- A minimal stand-in for the parts of Supabase the migrations depend on, so the
-- schema and its policies can be exercised against a plain Postgres instance in
-- CI without booting the full stack.
--
-- It provides only what we actually use: the auth schema, auth.users, auth.uid()
-- reading a session GUC, and the anon/authenticated/service_role roles. Loading
-- this before the migrations is what makes tests/rls.sql a real test of the
-- policies rather than a description of them.

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique
);

-- Supabase sets request.jwt.claims from the verified JWT. Tests set it directly
-- to impersonate a user; `set local role authenticated` then makes RLS apply.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;
grant select on auth.users to authenticated, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant execute on functions to authenticated, anon;

-- Become a given user for the statements that follow, with RLS in force.
create or replace function public.test_login(user_id uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', user_id::text, true);
  execute 'set local role authenticated';
end;
$$;

-- Drop back to the owner role for fixture setup.
create or replace function public.test_logout()
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', '', true);
  execute 'reset role';
end;
$$;
