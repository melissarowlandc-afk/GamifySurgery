-- Clinic Competition: client-reported gross revenue, not an anti-cheat system.
-- Independent of Beta 2 enrollment and of voluntary usage-recording consent.
begin;

create table gamify_private.competition_clinics (
  player_id uuid not null references auth.users(id) on delete cascade,
  campaign_id text not null check (octet_length(campaign_id) between 1 and 256 and campaign_id !~ '[[:cntrl:]]'),
  clinic_name text not null check (char_length(clinic_name) between 1 and 60
    and clinic_name = btrim(clinic_name) and clinic_name !~ '[[:cntrl:]]'),
  facility_level integer not null check (facility_level between 0 and 5),
  average_daily_revenue_cents bigint not null check (average_daily_revenue_cents between 0 and 100000000000),
  days_counted integer not null check (days_counted between 1 and 3),
  completed_day integer not null check (completed_day between 1 and 10000000 and days_counted <= completed_day),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (player_id, campaign_id)
);
create index competition_clinics_retention_idx on gamify_private.competition_clinics(updated_at);
create table gamify_private.competition_settings (
  player_id uuid primary key references auth.users(id) on delete cascade,
  hidden boolean not null default false,
  updated_at timestamptz not null default clock_timestamp()
);
create table gamify_private.competition_submit_limits (
  player_id uuid primary key references auth.users(id) on delete cascade,
  window_date date not null,
  calls integer not null check (calls between 1 and 120)
);
-- All access goes through validated RPCs; no direct table grants or policies.
alter table gamify_private.competition_clinics enable row level security;
alter table gamify_private.competition_settings enable row level security;
alter table gamify_private.competition_submit_limits enable row level security;
revoke all on gamify_private.competition_clinics, gamify_private.competition_settings,
  gamify_private.competition_submit_limits from public, anon, authenticated, service_role;

create function gamify_private.submit_clinic_competition(
  p_campaign_id text, p_clinic_name text, p_facility_level integer,
  p_average_daily_revenue_cents bigint, p_days_counted integer, p_completed_day integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_player_id uuid := gamify_private.require_usage_player(false);
  v_name text := btrim(p_clinic_name, U&'\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
  v_existing gamify_private.competition_clinics%rowtype;
  v_today date := (clock_timestamp() at time zone 'UTC')::date;
  v_calls integer;
begin
  -- The shared membership lock serializes submit, hide, deletion and revocation.
  if p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256 or p_campaign_id ~ '[[:cntrl:]]'
    or p_clinic_name is null or p_clinic_name ~ '[[:cntrl:]]'
    or v_name is null or char_length(v_name) not between 1 and 60
    or p_facility_level is null or p_facility_level not between 0 and 5
    or p_average_daily_revenue_cents is null or p_average_daily_revenue_cents not between 0 and 100000000000
    or p_days_counted is null or p_days_counted not between 1 and 3
    or p_completed_day is null or p_completed_day not between 1 and 10000000 or p_days_counted > p_completed_day then
    raise exception 'Invalid clinic competition submission' using errcode = '22023';
  end if;
  select c.* into v_existing from gamify_private.competition_clinics c
    where c.player_id = v_player_id and c.campaign_id = p_campaign_id;
  -- Old offline retries cannot overwrite a newer day. Identical lost-ack retries
  -- are free, including at quota, and do not extend retention indefinitely.
  if found and (v_existing.completed_day > p_completed_day or
    (v_existing.completed_day = p_completed_day and v_existing.clinic_name = v_name
      and v_existing.facility_level = p_facility_level
      and v_existing.average_daily_revenue_cents = p_average_daily_revenue_cents and v_existing.days_counted = p_days_counted)) then
    return jsonb_build_object('campaign_id', p_campaign_id, 'completed_day', p_completed_day);
  end if;
  select l.calls into v_calls from gamify_private.competition_submit_limits l
    where l.player_id = v_player_id and l.window_date = v_today;
  if coalesce(v_calls, 0) >= 120 then
    raise exception 'Clinic competition rate limit reached' using errcode = 'P0001';
  end if;
  insert into gamify_private.competition_submit_limits(player_id, window_date, calls)
    values(v_player_id, v_today, 1) on conflict (player_id) do update
      set window_date = excluded.window_date, calls = coalesce(v_calls, 0) + 1;
  insert into gamify_private.competition_clinics(player_id, campaign_id, clinic_name, facility_level,
    average_daily_revenue_cents, days_counted, completed_day)
    values(v_player_id, p_campaign_id, v_name, p_facility_level, p_average_daily_revenue_cents, p_days_counted, p_completed_day)
    on conflict (player_id, campaign_id) do update set clinic_name = excluded.clinic_name,
      facility_level = excluded.facility_level, average_daily_revenue_cents = excluded.average_daily_revenue_cents,
      days_counted = excluded.days_counted, completed_day = excluded.completed_day, updated_at = clock_timestamp();
  return jsonb_build_object('campaign_id', p_campaign_id, 'completed_day', p_completed_day);
end;
$$;

create function gamify_private.get_clinic_competition()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_player_id uuid := gamify_private.require_usage_player(false); v_rows jsonb; v_hidden boolean;
begin
  select coalesce((select s.hidden from gamify_private.competition_settings s where s.player_id = v_player_id), false) into v_hidden;
  with candidates as (
    select c.*, coalesce(s.hidden, false) as hidden,
      row_number() over (partition by c.player_id order by c.average_daily_revenue_cents desc,
        c.facility_level desc, c.campaign_id collate "C") as clinic_position
    from gamify_private.competition_clinics c
    join gamify_private.player_memberships m on m.user_id = c.player_id
    join auth.users u on u.id = c.player_id
    left join gamify_private.competition_settings s on s.player_id = c.player_id
    where c.updated_at > clock_timestamp() - interval '90 days'
      and m.revoked_at is null and m.deletion_requested_at is null
      and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
      and u.email_confirmed_at is not null and u.deleted_at is null and not coalesce(u.is_anonymous, false)
      and (u.banned_until is null or u.banned_until <= clock_timestamp())
  ), best as (
    select * from candidates where clinic_position = 1
  ), ranked as (
    select row_number() over (order by b.average_daily_revenue_cents desc, b.facility_level desc, b.player_id) as rank,
      b.clinic_name, b.facility_level, b.average_daily_revenue_cents, b.days_counted, b.player_id = v_player_id as is_self
    from best b where not b.hidden
    union all
    -- Hidden self is unranked: it neither affects nor reveals public rankings.
    select null::bigint, b.clinic_name, b.facility_level, b.average_daily_revenue_cents, b.days_counted, true
    from best b where b.hidden and b.player_id = v_player_id
  )
  select coalesce(jsonb_agg(to_jsonb(r) order by r.rank nulls last), '[]'::jsonb) into v_rows from ranked r;
  return jsonb_build_object('hidden', v_hidden, 'rows', v_rows);
end;
$$;

create function gamify_private.set_clinic_competition_hidden(p_hidden boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_player_id uuid := gamify_private.require_usage_player(false);
begin
  if p_hidden is null then raise exception 'Invalid competition visibility' using errcode = '22023'; end if;
  insert into gamify_private.competition_settings(player_id, hidden) values(v_player_id, p_hidden)
    on conflict (player_id) do update set hidden = excluded.hidden, updated_at = clock_timestamp();
end;
$$;

create function public.submit_clinic_competition(p_campaign_id text, p_clinic_name text, p_facility_level integer,
  p_average_daily_revenue_cents bigint, p_days_counted integer, p_completed_day integer)
returns jsonb language sql security invoker set search_path = '' as $$
  select gamify_private.submit_clinic_competition(p_campaign_id, p_clinic_name, p_facility_level,
    p_average_daily_revenue_cents, p_days_counted, p_completed_day);
$$;
create function public.get_clinic_competition() returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.get_clinic_competition(); $$;
create function public.set_clinic_competition_hidden(p_hidden boolean) returns void
language sql security invoker set search_path = '' as $$ select gamify_private.set_clinic_competition_hidden(p_hidden); $$;

revoke all on function
  public.submit_clinic_competition(text,text,integer,bigint,integer,integer),
  gamify_private.submit_clinic_competition(text,text,integer,bigint,integer,integer),
  public.get_clinic_competition(), gamify_private.get_clinic_competition(),
  public.set_clinic_competition_hidden(boolean), gamify_private.set_clinic_competition_hidden(boolean)
  from public, anon, authenticated, service_role;
grant execute on function
  public.submit_clinic_competition(text,text,integer,bigint,integer,integer),
  gamify_private.submit_clinic_competition(text,text,integer,bigint,integer,integer),
  public.get_clinic_competition(), gamify_private.get_clinic_competition(),
  public.set_clinic_competition_hidden(boolean), gamify_private.set_clinic_competition_hidden(boolean)
  to authenticated;

-- Existing deletion and Cron targets are extended below by CREATE OR REPLACE.

create or replace function gamify_private.beta2_delete_my_data(p_scope text, p_notice_version text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid(); added integer;
begin
  if p_scope is distinct from 'all-account-data.v1' or p_notice_version is distinct from 'beta2.cloud.v1' then
    raise exception 'Full account data confirmation required' using errcode = '22023'; end if;
  perform 1 from auth.users u where u.id = v_id and u.email_confirmed_at is not null and u.deleted_at is null and not coalesce(u.is_anonymous,false);
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.beta2_cloud_accounts where user_id = v_id for update;
  perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at,clock_timestamp()),accepted_notice_version = null,accepted_notice_at = null where user_id = v_id;
  -- Fence before cascading. The protected membership tombstone remains.
  update gamify_private.beta2_campaign_writers set generation = case when generation < 9223372036854775807 then generation + 1 else generation end,
    token_sha256 = null, expires_at = null where owner_id = v_id;
  insert into gamify_private.beta2_cloud_deletions(subject_sha256) values(gamify_private.beta2_hash(v_id::text)) on conflict do nothing;
  get diagnostics added = row_count;
  update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes + added * 1024 where singleton;
  delete from gamify_private.beta2_cloud_accounts where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from public.tester_feedback where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
  delete from gamify_private.usage_owners where user_id = v_id;
  -- Membership is blocked before setup finalization can regain its lock.
  -- Avoid the inverse setup-email -> membership lock order: invitation cleanup
  -- remains the owner's seven-day task; finalization cannot undo the tombstone.
  delete from gamify_private.competition_clinics where player_id = v_id;
  delete from gamify_private.competition_settings where player_id = v_id;
  delete from gamify_private.competition_submit_limits where player_id = v_id;
end;
$$;

create or replace function gamify_private.request_usage_data_deletion()
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid();
begin
  if v_id is null or not exists (select 1 from auth.users where id = v_id and email_confirmed_at is not null and deleted_at is null
    and not coalesce(is_anonymous, false)) then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.beta2_cloud_accounts where user_id = v_id for update;
  if exists (select 1 from gamify_private.beta2_cloud_accounts where user_id = v_id and enrolled_at is not null)
    or exists (select 1 from public.beta2_campaigns where owner_id = v_id) then
    raise exception 'Cloud data deletion requires updated confirmation' using errcode = '55000'; end if;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at, now()),
    accepted_notice_version = null, accepted_notice_at = null where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from public.tester_feedback where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
  delete from gamify_private.beta2_cloud_accounts where user_id = v_id;
  delete from gamify_private.competition_clinics where player_id = v_id;
  delete from gamify_private.competition_settings where player_id = v_id;
  delete from gamify_private.competition_submit_limits where player_id = v_id;
end;
$$;

create or replace function gamify_private.purge_beta1_retained_data()
returns void language plpgsql security invoker set search_path = '' as $$
begin
  delete from gamify_private.usage_receipts where occurred_at <= now() - interval '8 days';
  delete from public.player_usage_days where usage_date < (now() at time zone 'UTC')::date - 89;
  delete from public.question_flags where received_at <= now() - interval '90 days';
  delete from public.tester_feedback where created_at <= now() - interval '90 days';
  delete from gamify_private.usage_ingest_limits where window_start < now() - interval '8 days';
  delete from gamify_private.setup_codes where greatest(used_at, cancelled_at) <= now() - interval '90 days';
  perform gamify_private.beta2_purge_cloud_data();
  delete from gamify_private.competition_clinics where updated_at <= now() - interval '90 days';
  delete from gamify_private.competition_submit_limits where window_date < (now() at time zone 'UTC')::date - 7;
  -- Keep the minimal hidden preference until account deletion; hiding never expires.
end;
$$;

notify pgrst, 'reload schema';
commit;
