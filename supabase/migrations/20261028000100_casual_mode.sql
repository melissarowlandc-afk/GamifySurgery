-- Owner-assigned casual presentation; account state, never a save/game rule.
-- Apply after 20261027000100. Existing function signatures/ACLs are preserved.
begin;

alter table gamify_private.player_memberships
  add column casual boolean not null default false;
-- The private membership table retains its RLS and absence of player writes.

create function gamify_private.beta1_admin_set_casual(p_user_id uuid, p_casual boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_member gamify_private.player_memberships%rowtype;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Owner administration denied' using errcode = '42501';
  end if;
  if p_user_id is null or p_casual is null then
    raise exception 'Invalid casual mode request' using errcode = '22023';
  end if;
  -- Same membership lock as submit, revoke and deletion. Awaiting-confirmation
  -- invitees may be assigned a mode, but cannot play until confirmed normally.
  select m.* into v_member from gamify_private.player_memberships m
    join auth.users u on u.id = m.user_id
    where m.user_id = p_user_id and u.email is not null and u.deleted_at is null
      and not coalesce(u.is_anonymous, false)
      and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
      and (u.banned_until is null or u.banned_until <= clock_timestamp())
    for update of m;
  if not found or v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    raise exception 'Active game membership required' using errcode = '42501';
  end if;
  update gamify_private.player_memberships m set casual = p_casual where m.user_id = p_user_id;
  if p_casual then
    -- Remove prior ranking entries, including hidden self. The membership lock
    -- prevents an in-flight submission restoring one after this transaction.
    delete from gamify_private.competition_clinics c where c.player_id = p_user_id;
    delete from gamify_private.competition_submit_limits l where l.player_id = p_user_id;
  end if;
  return jsonb_build_object('user_id', p_user_id, 'casual', p_casual);
end;
$$;

create function public.beta1_admin_set_casual(p_user_id uuid, p_casual boolean)
returns jsonb language sql security invoker set search_path = '' as $$
  select gamify_private.beta1_admin_set_casual(p_user_id, p_casual);
$$;

-- Read-only account mode is independent of voluntary usage notice acceptance.
-- Invalid/revoked/deleting/deleted accounts never obtain casual access.
create or replace function gamify_private.get_usage_access()
returns jsonb language sql stable security definer set search_path = '' as $$
  with admitted_member as (
    select m.casual from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
        and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
        and u.email_confirmed_at is not null and u.deleted_at is null
        and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())
  )
  select jsonb_build_object(
    'admitted', exists (select 1 from admitted_member),
    'casual', coalesce((select a.casual from admitted_member a), false),
    'notice_accepted', gamify_private.can_record_usage(),
    'deletion_requested', exists (select 1 from gamify_private.player_memberships m
      where m.user_id = auth.uid() and m.deletion_requested_at is not null)
  );
$$;

-- Preserve setup-code cancellation, admission, owner grants and tombstones.
create or replace function gamify_private.beta1_admin_members(
  p_action text, p_user_id uuid default null, p_owner boolean default false
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user auth.users%rowtype;
  v_member gamify_private.player_memberships%rowtype;
  v_members jsonb;
begin
  -- An admin secret has no player auth.uid(). Require the server-verified
  -- service_role claim AND service_role-only EXECUTE grants below. Player JWTs,
  -- anonymous callers and user-editable metadata cannot authorize this body.
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Owner administration denied' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('list', 'admit', 'revoke') or p_owner is null
    or (p_action = 'list' and (p_user_id is not null or p_owner))
    or (p_action <> 'list' and p_user_id is null)
    or (p_action = 'revoke' and p_owner) then
    raise exception 'Invalid owner administration request' using errcode = '22023';
  end if;

  if p_action = 'list' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'user_id', u.id, 'email', u.email, 'invited_at', u.invited_at,
      'confirmed_at', u.email_confirmed_at, 'banned_until', u.banned_until,
      'revoked_at', m.revoked_at, 'deletion_requested_at', m.deletion_requested_at,
      'casual', m.casual,
      'is_owner', exists (select 1 from gamify_private.usage_owners o where o.user_id = u.id)
    ) order by u.email), '[]'::jsonb) into v_members
    from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
    where u.deleted_at is null;
    return v_members;
  end if;

  select * into v_user from auth.users where id = p_user_id and deleted_at is null;
  if not found or v_user.email is null or (v_user.invited_at is null and not coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb, false))
    or coalesce(v_user.is_anonymous, false) then
    raise exception 'Invited account required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('beta1.setup:' || lower(v_user.email), 0));
  if p_action = 'revoke' then
    update gamify_private.setup_codes set cancelled_at = coalesce(cancelled_at, now())
      where email = lower(v_user.email) and cancelled_at is null;
  end if;

  if p_action = 'admit' then
    if v_user.banned_until is not null and v_user.banned_until > now() then
      raise exception 'Disabled account cannot be admitted' using errcode = '42501';
    end if;
    -- Idempotent invitation retries never clear notice/revocation/deletion.
    insert into gamify_private.player_memberships(user_id) values (p_user_id)
      on conflict (user_id) do nothing;
  end if;
  -- Same lock used by usage/flag/deletion writers: revocation serializes with
  -- any in-flight upload. A missing membership cannot be created by revoke.
  select * into v_member from gamify_private.player_memberships
    where user_id = p_user_id for update;
  if not found then
    raise exception 'Game membership required' using errcode = '42501';
  end if;

  if p_action = 'revoke' then
    -- Logical removal preserves the marker that prevents later readmission.
    update gamify_private.player_memberships
      set revoked_at = coalesce(revoked_at, now()),
        accepted_notice_version = null, accepted_notice_at = null
      where user_id = p_user_id;
    delete from gamify_private.usage_owners where user_id = p_user_id;
    return jsonb_build_object('user_id', p_user_id, 'revoked', true);
  end if;

  if v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    raise exception 'Revoked/deletion-requested membership cannot be readmitted' using errcode = '42501';
  end if;
  if p_owner then
    insert into gamify_private.usage_owners(user_id) values (p_user_id)
      on conflict (user_id) do nothing;
  end if;
  return jsonb_build_object('user_id', p_user_id, 'admitted', true,
    'is_owner', exists (select 1 from gamify_private.usage_owners where user_id = p_user_id));
end;
$$;


-- Owner totals cover the same retained 90 UTC days as existing usage reads.
-- Casual usage stays included. Revoked accounts retain reports; deletion does
-- not reveal retained totals, even before the ordinary deletion purge finishes.
create function gamify_private.beta1_admin_usage_report()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_report jsonb;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Owner administration denied' using errcode = '42501';
  end if;
  select coalesce(jsonb_agg(to_jsonb(r) order by r.email), '[]'::jsonb) into v_report
  from (
    select m.user_id, u.email, m.casual,
      coalesce(sum(d.playtime_seconds), 0) as playtime_seconds,
      coalesce(sum(d.question_count), 0) as question_count
    from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
    left join public.player_usage_days d on d.user_id = m.user_id
      and d.usage_date between (now() at time zone 'UTC')::date - 89 and (now() at time zone 'UTC')::date
    where u.deleted_at is null and m.deletion_requested_at is null and not coalesce(u.is_anonymous, false)
    group by m.user_id, u.email, m.casual
  ) r;
  return v_report;
end;
$$;
create function public.beta1_admin_usage_report()
returns jsonb language sql security invoker set search_path = '' as $$
  select gamify_private.beta1_admin_usage_report();
$$;

revoke all on function public.beta1_admin_set_casual(uuid,boolean),
  gamify_private.beta1_admin_set_casual(uuid,boolean),
  public.beta1_admin_usage_report(), gamify_private.beta1_admin_usage_report()
  from public, anon, authenticated;
grant usage on schema gamify_private to service_role;
grant execute on function public.beta1_admin_set_casual(uuid,boolean),
  gamify_private.beta1_admin_set_casual(uuid,boolean),
  public.beta1_admin_usage_report(), gamify_private.beta1_admin_usage_report() to service_role;

-- Casual accounts can still read the board; their submissions are ignored,
-- cannot affect ranks,
-- or obtain a hidden self row. All prior validation, limits and privacy remain.
create or replace function gamify_private.submit_clinic_competition(
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
  if (select m.casual from gamify_private.player_memberships m where m.user_id = v_player_id) then
    -- Acknowledge without storing/rate charging. Old clients must retain board
    -- viewing after an owner changes mode during an already-open session.
    return jsonb_build_object('campaign_id', p_campaign_id, 'completed_day', p_completed_day, 'ignored', true);
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

create or replace function gamify_private.get_clinic_competition()
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
      and m.revoked_at is null and m.deletion_requested_at is null and not m.casual
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


-- Invitation-time assignment: the protected setup record carries the mode
-- until membership and trusted Auth admission are finalized in one transaction.
alter table gamify_private.setup_codes add column casual boolean not null default false;
alter table gamify_private.setup_codes add constraint setup_codes_casual_invite_only
  check (not casual or purpose = 'invite');

-- Six required arguments avoid ambiguity with the existing five-argument RPC
-- (whose defaults and grants remain compatible with prior tools/SQL callers).
create function gamify_private.beta1_setup_admin(
  p_action text, p_email text, p_code_hash text,
  p_purpose text, p_owner boolean, p_casual boolean
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower(btrim(p_email));
  v_user auth.users%rowtype;
  v_member gamify_private.player_memberships%rowtype;
  v_id uuid;
  v_rows jsonb;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Setup administration denied' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('issue', 'cancel', 'list') or p_owner is null or p_casual is null
    or (p_casual and (p_action <> 'issue' or p_purpose is distinct from 'invite'))
    or (p_action = 'list' and (p_email is not null or p_code_hash is not null or p_purpose is not null or p_owner))
    or (p_action <> 'list' and (v_email is null or char_length(v_email) not between 3 and 254
      or v_email ~ '[[:space:][:cntrl:]]' or v_email not like '%@%.%'))
    or (p_action = 'cancel' and (p_code_hash is not null or p_purpose is not null or p_owner))
    or (p_action = 'issue' and (p_code_hash is null or p_code_hash !~ '^[0-9a-f]{64}$'
      or p_purpose is null or p_purpose not in ('invite', 'reset') or (p_owner and p_purpose <> 'invite'))) then
    raise exception 'Invalid setup administration request' using errcode = '22023';
  end if;
  if p_action = 'list' then
    -- Never return hashes to the owner tool or a roster of unrelated Auth users.
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'email', email, 'purpose', purpose, 'created_at', created_at,
      'used_at', used_at, 'cancelled_at', cancelled_at, 'failed_attempts', failed_attempts, 'casual', casual
    ) order by email, created_at desc), '[]'::jsonb) into v_rows from gamify_private.setup_codes;
    return v_rows;
  end if;
  perform pg_advisory_xact_lock(hashtextextended('beta1.setup:' || v_email, 0));
  if p_action = 'cancel' then
    -- Also cancel an in-flight consumed code; finalization must then fail.
    update gamify_private.setup_codes set cancelled_at = coalesce(cancelled_at, now())
      where email = v_email and cancelled_at is null;
    return jsonb_build_object('cancelled', true);
  end if;
  select * into v_user from auth.users where lower(email) = v_email and deleted_at is null;
  if found then
    if coalesce(v_user.is_anonymous, false) or (v_user.banned_until is not null and v_user.banned_until > now()) then
      raise exception 'Ineligible setup account' using errcode = '42501';
    end if;
    select * into v_member from gamify_private.player_memberships where user_id = v_user.id for update;
    if found and (v_member.revoked_at is not null or v_member.deletion_requested_at is not null) then
      raise exception 'Ineligible setup membership' using errcode = '42501';
    end if;
    if (p_purpose = 'reset' and v_member.user_id is null)
      or (p_purpose = 'invite' and v_user.email_confirmed_at is not null
        and not (v_member.user_id is null and coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_pending":true}'::jsonb, false))) then
      raise exception 'Use invite for pending accounts or reset for active members' using errcode = '42501';
    end if;
  elsif p_purpose = 'reset' then
    raise exception 'Active setup membership required' using errcode = '42501';
  end if;
  update gamify_private.setup_codes set cancelled_at = coalesce(cancelled_at, now())
    where email = v_email and cancelled_at is null;
  insert into gamify_private.setup_codes(email, code_hash, purpose, user_id, owner_requested, casual)
    values (v_email, p_code_hash, p_purpose, v_user.id, p_owner, p_casual) returning id into v_id;
  return jsonb_build_object('id', v_id, 'issued', true, 'purpose', p_purpose, 'casual', p_casual);
end;
$$;

create function public.beta1_setup_admin(
  p_action text, p_email text, p_code_hash text,
  p_purpose text, p_owner boolean, p_casual boolean
) returns jsonb language sql security invoker set search_path = '' as $$
  select gamify_private.beta1_setup_admin(p_action, p_email, p_code_hash, p_purpose, p_owner, p_casual);
$$;
create or replace function gamify_private.beta1_setup_admin(
  p_action text, p_email text default null, p_code_hash text default null,
  p_purpose text default null, p_owner boolean default false
) returns jsonb language sql security definer set search_path = '' as $$
  select gamify_private.beta1_setup_admin(p_action, p_email, p_code_hash, p_purpose, p_owner, false);
$$;

revoke all on function public.beta1_setup_admin(text,text,text,text,boolean,boolean),
  gamify_private.beta1_setup_admin(text,text,text,text,boolean,boolean) from public, anon, authenticated;
grant execute on function public.beta1_setup_admin(text,text,text,text,boolean,boolean),
  gamify_private.beta1_setup_admin(text,text,text,text,boolean,boolean) to service_role;

create or replace function gamify_private.beta1_finish_setup_code(p_id uuid, p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_code gamify_private.setup_codes%rowtype;
  v_user auth.users%rowtype;
  v_member gamify_private.player_memberships%rowtype;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Setup claim denied' using errcode = '42501';
  end if;
  select * into v_code from gamify_private.setup_codes where id = p_id;
  if not found then return jsonb_build_object('ok', false); end if;
  perform pg_advisory_xact_lock(hashtextextended('beta1.setup:' || v_code.email, 0));
  select * into v_code from gamify_private.setup_codes where id = p_id for update;
  if not found or v_code.used_at is null or v_code.cancelled_at is not null
    or (v_code.user_id is not null and v_code.user_id <> p_user_id) then
    return jsonb_build_object('ok', false);
  end if;
  select * into v_user from auth.users where id = p_user_id and lower(email) = v_code.email
    and deleted_at is null and email_confirmed_at is not null;
  if not found or coalesce(v_user.is_anonymous, false)
    or (v_code.purpose = 'invite' and v_code.user_id is null
      and not coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_pending":true}'::jsonb, false))
    or (v_user.banned_until is not null and v_user.banned_until > now()) then
    return jsonb_build_object('ok', false);
  end if;
  if v_code.purpose = 'invite' then
    insert into gamify_private.player_memberships(user_id, casual) values (p_user_id, v_code.casual) on conflict (user_id) do nothing;
  end if;
  select * into v_member from gamify_private.player_memberships where user_id = p_user_id for update;
  if not found or v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    return jsonb_build_object('ok', false);
  end if;
  -- A first invite can promote an existing pending membership. Normal invites
  -- and password resets preserve existing owner assignments. A finish retry
  -- after successful admission must never override a later owner mode change.
  if v_code.purpose = 'invite' and v_code.casual
    and not coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb, false) then
    update gamify_private.player_memberships m set casual = true where m.user_id = p_user_id;
    delete from gamify_private.competition_clinics c where c.player_id = p_user_id;
    delete from gamify_private.competition_submit_limits l where l.player_id = p_user_id;
  end if;
  -- This server-owned marker replaces provider invited_at for new setup users.
  -- Neither user_metadata nor possession of a normal player JWT can set it.
  update auth.users set raw_app_meta_data = (coalesce(raw_app_meta_data, '{}'::jsonb) - 'gamify_setup_pending')
    || '{"gamify_setup_admitted":true}'::jsonb where id = p_user_id;
  update gamify_private.setup_codes set user_id = p_user_id where id = p_id;
  if v_code.owner_requested then
    insert into gamify_private.usage_owners(user_id) values (p_user_id) on conflict (user_id) do nothing;
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

notify pgrst, 'reload schema';
commit;
