-- OWNER/MANAGER REVIEW before applying after the two 20261013 migrations.
-- Local owner-PC service_role tool only. No email sending or public admission.
-- Existing migrations and RLS remain unchanged; gamify_private stays unexposed.
-- CLI unavailable under this no-installs/no-network worker brief; file authored
-- directly using the repository's ordered migration naming convention.
begin;

create function gamify_private.beta1_admin_members(
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
  if not found or v_user.email is null or v_user.invited_at is null
    or coalesce(v_user.is_anonymous, false) then
    raise exception 'Provider-invited account required' using errcode = '42501';
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

-- Exposed wrapper is INVOKER; privileged code stays in the private schema.
create function public.beta1_admin_members(
  p_action text, p_user_id uuid default null, p_owner boolean default false
) returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.beta1_admin_members(p_action, p_user_id, p_owner); $$;

revoke all on function public.beta1_admin_members(text, uuid, boolean),
  gamify_private.beta1_admin_members(text, uuid, boolean) from public, anon, authenticated;
grant usage on schema gamify_private to service_role;
grant execute on function public.beta1_admin_members(text, uuid, boolean),
  gamify_private.beta1_admin_members(text, uuid, boolean) to service_role;
-- No table grants, new tables/policies, user_metadata auth or player self-admit.

notify pgrst, 'reload schema';
commit;
