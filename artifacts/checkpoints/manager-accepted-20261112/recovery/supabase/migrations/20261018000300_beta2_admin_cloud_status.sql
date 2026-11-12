-- B2.6: add cohort visibility to the existing service-role admin RPC.
-- Review/apply AFTER 20261018000100. No switches, account rows or player ACLs change.
-- CREATE OR REPLACE retains the existing function signature and ACLs.
begin;

create or replace function gamify_private.beta2_admin_cloud(p_action text, p_user_id uuid default null, p_settings jsonb default '{}') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare a gamify_private.beta2_cloud_accounts%rowtype; amount bigint; relations jsonb;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then raise exception 'Cloud administration denied' using errcode = '42501'; end if;
  if p_action is null or p_action not in ('inspect','configure','account','purge','acknowledge_cleanup') or p_settings is null then
    raise exception 'Invalid cloud administration request' using errcode = '22023'; end if;
  if p_action = 'account' then
    if p_user_id is null or not gamify_private.beta2_keys(p_settings,array['enabled']) or jsonb_typeof(p_settings->'enabled') <> 'boolean' then
      raise exception 'Invalid cloud account configuration' using errcode = '22023'; end if;
    perform 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      where m.user_id = p_user_id and m.revoked_at is null and m.deletion_requested_at is null and u.deleted_at is null
        and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
        and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
        and (u.banned_until is null or u.banned_until <= clock_timestamp()) for update of m;
    if not found or exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(p_user_id::text)) then
      raise exception 'Cloud account admission denied' using errcode = '42501'; end if;
    select * into a from gamify_private.beta2_cloud_accounts where user_id = p_user_id for update;
    if not found then
      perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
      if exists (select 1 from gamify_private.beta2_cloud_quota where singleton and
        (accounted_bytes + 8192 + dead_bytes_estimate + 50000000 > 400000000
          or pg_database_size(current_database()) + dead_bytes_estimate + 16384 + 1048576 > 400000000)) then
        raise exception 'Cloud project capacity reached' using errcode = '54000'; end if;
      insert into gamify_private.beta2_cloud_accounts(user_id,enabled) values(p_user_id,(p_settings->>'enabled')::boolean);
      update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes + 8192 where singleton;
    else update gamify_private.beta2_cloud_accounts set enabled = (p_settings->>'enabled')::boolean where user_id = p_user_id; end if;
    return jsonb_build_object('userId',p_user_id,'enabled',(p_settings->>'enabled')::boolean,'quota',gamify_private.beta2_budget(p_user_id));
  end if;
  if p_user_id is not null then raise exception 'Unexpected cloud account argument' using errcode = '22023'; end if;
  if p_action = 'configure' then
    if not gamify_private.beta2_keys(p_settings,array['writesEnabled','enrollmentsEnabled'])
      or jsonb_typeof(p_settings->'writesEnabled') <> 'boolean' or jsonb_typeof(p_settings->'enrollmentsEnabled') <> 'boolean' then
      raise exception 'Invalid cloud project configuration' using errcode = '22023'; end if;
    update gamify_private.beta2_cloud_quota set writes_enabled = (p_settings->>'writesEnabled')::boolean,enrollments_enabled = (p_settings->>'enrollmentsEnabled')::boolean where singleton;
  elsif p_action = 'acknowledge_cleanup' then
    if p_settings is distinct from '{"vacuumVerified":true}'::jsonb then raise exception 'Owner vacuum verification required' using errcode = '22023'; end if;
    -- EXPLICIT operational attestation after VACUUM outside this transaction;
    -- neither DELETE nor a statistics estimate proves reclaimed physical space.
    update gamify_private.beta2_cloud_quota set dead_bytes_estimate = 0,last_cleanup_verified_at = clock_timestamp() where singleton;
  else
    if p_settings <> '{}'::jsonb then raise exception 'Unexpected cloud settings' using errcode = '22023'; end if;
    if p_action = 'purge' then perform gamify_private.beta2_purge_cloud_data(); end if;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('schema',n.nspname,'relation',c.relname,'bytes',pg_total_relation_size(c.oid),
    'deadTupleEstimate',coalesce(s.n_dead_tup,0)) order by n.nspname,c.relname),'[]') into relations
    from pg_class c join pg_namespace n on n.oid = c.relnamespace left join pg_stat_all_tables s on s.relid = c.oid
    where c.relkind = 'r' and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\';
  return jsonb_build_object('databaseBytes',pg_database_size(current_database()),'ownerWarning',
    pg_database_size(current_database()) >= 300000000 or (select accounted_bytes + dead_bytes_estimate >= 300000000 from gamify_private.beta2_cloud_quota where singleton),
    'workingCeilingBytes',400000000,'quota',(select to_jsonb(q) from gamify_private.beta2_cloud_quota q where singleton),
    'accountSettings',coalesce((select jsonb_agg(jsonb_build_object('userId',user_id,'enabled',enabled) order by user_id)
      from gamify_private.beta2_cloud_accounts),'[]'::jsonb),
    'accounts',(select count(*) from gamify_private.beta2_cloud_accounts),'campaigns',(select count(*) from public.beta2_campaigns),'relations',relations);
end;
$$;

revoke all on function gamify_private.beta2_admin_cloud(text,uuid,jsonb) from public, anon, authenticated;
grant execute on function gamify_private.beta2_admin_cloud(text,uuid,jsonb) to service_role;

commit;
