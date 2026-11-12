-- Review/apply AFTER 20261014000200 in the separate game project.
-- No provider OTPs, plaintext setup codes, passwords or expiry timestamps.
begin;

create table gamify_private.setup_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(btrim(email)) and char_length(email) between 3 and 254
    and email !~ '[[:space:][:cntrl:]]' and email like '%@%.%'),
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  purpose text not null check (purpose in ('invite', 'reset')),
  created_at timestamptz not null default clock_timestamp(),
  used_at timestamptz,
  cancelled_at timestamptz,
  failed_attempts integer not null default 0 check (failed_attempts between 0 and 10),
  user_id uuid references auth.users(id) on delete cascade,
  owner_requested boolean not null default false,
  check (not owner_requested or purpose = 'invite')
);
create unique index setup_codes_one_active_email on gamify_private.setup_codes(email)
  where used_at is null and cancelled_at is null;
create index setup_codes_email_created on gamify_private.setup_codes(email, created_at desc);
create index setup_codes_user on gamify_private.setup_codes(user_id);
alter table gamify_private.setup_codes enable row level security;
revoke all on gamify_private.setup_codes from public, anon, authenticated, service_role;
grant select, insert, update, delete on gamify_private.setup_codes to service_role;

-- All issuance/claim/finalization/revocation takes the same per-email lock.
-- The membership lock remains the authority for usage/feedback/deletion.
create function gamify_private.beta1_setup_admin(
  p_action text, p_email text default null, p_code_hash text default null,
  p_purpose text default null, p_owner boolean default false
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
  if p_action is null or p_action not in ('issue', 'cancel', 'list') or p_owner is null
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
      'used_at', used_at, 'cancelled_at', cancelled_at, 'failed_attempts', failed_attempts
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
  insert into gamify_private.setup_codes(email, code_hash, purpose, user_id, owner_requested)
    values (v_email, p_code_hash, p_purpose, v_user.id, p_owner) returning id into v_id;
  return jsonb_build_object('id', v_id, 'issued', true, 'purpose', p_purpose);
end;
$$;

create function gamify_private.beta1_lookup_setup_code(p_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_code gamify_private.setup_codes%rowtype;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Setup claim denied' using errcode = '42501';
  end if;
  select * into v_code from gamify_private.setup_codes where email = p_email
    order by created_at desc, id desc limit 1;
  if not found then return null; end if;
  return jsonb_build_object('id', v_code.id, 'code_hash', v_code.code_hash);
end;
$$;

create function gamify_private.beta1_claim_setup_code(p_email text, p_id uuid, p_matches boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_code gamify_private.setup_codes%rowtype;
  v_user auth.users%rowtype;
  v_member gamify_private.player_memberships%rowtype;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Setup claim denied' using errcode = '42501';
  end if;
  if p_email is null or char_length(p_email) > 254 then return jsonb_build_object('status', 'invalid'); end if;
  perform pg_advisory_xact_lock(hashtextextended('beta1.setup:' || p_email, 0));
  if p_matches is distinct from true then
    -- Count against the current email, even if the compared row was replaced.
    -- Do not RAISE: failure counts/cancellation must COMMIT on a bad attempt.
    update gamify_private.setup_codes set failed_attempts = failed_attempts + 1,
      cancelled_at = case when failed_attempts >= 9 then now() else cancelled_at end
      where email = p_email and used_at is null and cancelled_at is null and failed_attempts < 10;
    return jsonb_build_object('status', 'invalid');
  end if;
  select * into v_code from gamify_private.setup_codes where id = p_id and email = p_email for update;
  if not found or v_code.cancelled_at is not null or v_code.failed_attempts >= 10 then
    return jsonb_build_object('status', 'invalid');
  end if;
  if v_code.used_at is not null then return jsonb_build_object('status', 'used'); end if;
  if v_code.user_id is null and v_code.purpose = 'invite' then
    -- A prior Auth call may have succeeded after this code was issued but
    -- before its finalization failed. Recover only trusted pending identities.
    select * into v_user from auth.users where lower(email) = p_email and deleted_at is null;
    if found then
      if not coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_pending":true}'::jsonb, false) then
        return jsonb_build_object('status', 'invalid');
      end if;
      v_code.user_id := v_user.id;
      update gamify_private.setup_codes set user_id = v_user.id where id = v_code.id;
    end if;
  end if;
  if v_code.user_id is not null then
    select * into v_user from auth.users where id = v_code.user_id and lower(email) = p_email and deleted_at is null;
    if not found or coalesce(v_user.is_anonymous, false)
      or (v_user.banned_until is not null and v_user.banned_until > now()) then
      return jsonb_build_object('status', 'invalid');
    end if;
    select * into v_member from gamify_private.player_memberships where user_id = v_user.id for update;
    if (v_member.user_id is not null and (v_member.revoked_at is not null or v_member.deletion_requested_at is not null))
      or (v_code.purpose = 'reset' and v_member.user_id is null)
      or (v_code.purpose = 'invite' and v_user.email_confirmed_at is not null
        and not (v_member.user_id is null and coalesce(v_user.raw_app_meta_data @> '{"gamify_setup_pending":true}'::jsonb, false))) then
      return jsonb_build_object('status', 'invalid');
    end if;
  elsif v_code.purpose = 'reset' then
    return jsonb_build_object('status', 'invalid');
  end if;
  -- Consume before the separate Auth HTTP operation. Exactly one request wins.
  -- Auth failure stays consumed: manager must issue a new link (fail closed).
  update gamify_private.setup_codes set used_at = now() where id = v_code.id;
  return jsonb_build_object('status', 'claimed', 'id', v_code.id,
    'purpose', v_code.purpose, 'user_id', v_code.user_id);
end;
$$;

create function gamify_private.beta1_finish_setup_code(p_id uuid, p_user_id uuid)
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
    insert into gamify_private.player_memberships(user_id) values (p_user_id) on conflict (user_id) do nothing;
  end if;
  select * into v_member from gamify_private.player_memberships where user_id = p_user_id for update;
  if not found or v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    return jsonb_build_object('ok', false);
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

create function public.beta1_setup_admin(
  p_action text, p_email text default null, p_code_hash text default null,
  p_purpose text default null, p_owner boolean default false
) returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.beta1_setup_admin(p_action, p_email, p_code_hash, p_purpose, p_owner); $$;
create function public.beta1_lookup_setup_code(p_email text)
returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.beta1_lookup_setup_code(p_email); $$;
create function public.beta1_claim_setup_code(p_email text, p_id uuid, p_matches boolean)
returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.beta1_claim_setup_code(p_email, p_id, p_matches); $$;
create function public.beta1_finish_setup_code(p_id uuid, p_user_id uuid)
returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.beta1_finish_setup_code(p_id, p_user_id); $$;

revoke all on function public.beta1_setup_admin(text,text,text,text,boolean),
  gamify_private.beta1_setup_admin(text,text,text,text,boolean),
  public.beta1_lookup_setup_code(text), gamify_private.beta1_lookup_setup_code(text),
  public.beta1_claim_setup_code(text,uuid,boolean), gamify_private.beta1_claim_setup_code(text,uuid,boolean),
  public.beta1_finish_setup_code(uuid,uuid), gamify_private.beta1_finish_setup_code(uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.beta1_setup_admin(text,text,text,text,boolean),
  gamify_private.beta1_setup_admin(text,text,text,text,boolean),
  public.beta1_lookup_setup_code(text), gamify_private.beta1_lookup_setup_code(text),
  public.beta1_claim_setup_code(text,uuid,boolean), gamify_private.beta1_claim_setup_code(text,uuid,boolean),
  public.beta1_finish_setup_code(uuid,uuid), gamify_private.beta1_finish_setup_code(uuid,uuid) to service_role;

-- Existing guard bodies below keep the membership/notice/deletion/ban checks.
-- Only the trusted invitation-source predicate changes; old invites still work.

create or replace function gamify_private.can_record_usage()
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
    where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
      and m.accepted_notice_version = 'beta1.usage.v1' and m.accepted_notice_at is not null
      and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb) and u.email_confirmed_at is not null and u.deleted_at is null
      and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())
  );
$$;

create or replace function gamify_private.require_usage_player(p_notice boolean default true)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := auth.uid();
  v_member gamify_private.player_memberships%rowtype;
begin
  if v_id is null or not exists (select 1 from auth.users u where u.id = v_id
    and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb) and u.email_confirmed_at is not null and u.deleted_at is null
    and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())) then
    raise exception 'Player access denied' using errcode = '42501';
  end if;
  select * into v_member from gamify_private.player_memberships where user_id = v_id for update;
  if not found or v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    raise exception 'Player access denied' using errcode = '42501';
  end if;
  if p_notice and (v_member.accepted_notice_version is distinct from 'beta1.usage.v1' or v_member.accepted_notice_at is null) then
    raise exception 'Usage notice acceptance required' using errcode = '42501';
  end if;
  return v_id;
end;
$$;

create or replace function gamify_private.get_usage_access()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'admitted', exists (select 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
        and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb) and u.email_confirmed_at is not null and u.deleted_at is null
        and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())),
    'notice_accepted', gamify_private.can_record_usage(),
    'deletion_requested', exists (select 1 from gamify_private.player_memberships m where m.user_id = auth.uid() and m.deletion_requested_at is not null)
  );
$$;

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

create or replace function gamify_private.purge_beta1_retained_data()
returns void language plpgsql security invoker set search_path = '' as $$
begin
  delete from gamify_private.usage_receipts where occurred_at <= now() - interval '8 days';
  delete from public.player_usage_days where usage_date < (now() at time zone 'UTC')::date - 89;
  delete from public.question_flags where received_at <= now() - interval '90 days';
  delete from public.tester_feedback where created_at <= now() - interval '90 days';
  delete from gamify_private.usage_ingest_limits where window_start < now() - interval '8 days';
  -- Pending codes NEVER expire. Only already terminal records follow retention.
  delete from gamify_private.setup_codes where greatest(used_at, cancelled_at) <= now() - interval '90 days';
end;
$$;

notify pgrst, 'reload schema';
commit;
