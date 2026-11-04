-- DISPOSABLE LOCAL POSTGRES ONLY. Not a Supabase Auth implementation.
-- Run via snapshot_only_offline.sql as a cluster superuser in a fresh database
-- named gamify_snapshot_test[_suffix]. No real users, secrets, HTTP or Cron.
\set ON_ERROR_STOP on
begin;
set local lock_timeout = '1s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '10s';
do $guard$ begin
  if current_database() !~ '^gamify_snapshot_test(_[a-z0-9_]+)?$'
    or to_regnamespace('auth') is not null or to_regnamespace('gamify_private') is not null
    or exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind in ('r','p')) then
    raise exception 'Auth stub requires a fresh disposable gamify_snapshot_test database; NEVER use on a live project'; end if;
end $guard$;
do $roles$ begin
  if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
end $roles$;
create schema auth;
create schema extensions;
-- pgcrypto must already be available in the local PostgreSQL distribution.
-- This installs no package and contacts no network service.
create extension pgcrypto with schema extensions;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text, aud text, role text, invited_at timestamptz,
  email_confirmed_at timestamptz, deleted_at timestamptz, banned_until timestamptz,
  is_anonymous boolean not null default false,
  raw_app_meta_data jsonb not null default '{}', raw_user_meta_data jsonb not null default '{}',
  created_at timestamptz default now(), updated_at timestamptz default now(),
  encrypted_password text
);
create function auth.jwt() returns jsonb language sql stable set search_path='' as $$
  select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb;
$$;
create function auth.uid() returns uuid language sql stable set search_path='' as $$
  select (auth.jwt()->>'sub')::uuid;
$$;
revoke all on schema auth from public;
revoke all on auth.users from public,anon,authenticated,service_role;
revoke all on function auth.jwt(),auth.uid() from public;
grant usage on schema auth,extensions to anon,authenticated,service_role;
grant execute on function auth.jwt(),auth.uid() to anon,authenticated,service_role;
create schema snapshot_test_support;
revoke all on schema snapshot_test_support from public,anon,authenticated,service_role;
create table snapshot_test_support.disposable_marker (singleton boolean primary key check(singleton));
insert into snapshot_test_support.disposable_marker values(true);
commit;
