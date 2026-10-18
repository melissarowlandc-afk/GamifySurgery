-- Manager: run the ENTIRE file as postgres after install-cloud-status-rpc.sql.
-- Rollback-only; no identities are seeded and no account enablement changes.
begin;
set local plpgsql.check_asserts = on;

create temp table b26_status_expected as
select q.writes_enabled, q.enrollments_enabled,
  coalesce((select jsonb_agg(jsonb_build_object('userId',user_id,'enabled',enabled) order by user_id)
    from gamify_private.beta2_cloud_accounts),'[]'::jsonb) as account_settings
from gamify_private.beta2_cloud_quota q where singleton;
do $$ begin execute format('grant usage on schema %I to service_role',
  (select nspname from pg_namespace where oid=pg_my_temp_schema())); end $$;
grant select on pg_temp.b26_status_expected to service_role;

do $$ begin
  assert not has_function_privilege('anon','public.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Anon cannot inspect cloud cohort';
  assert not has_function_privilege('authenticated','public.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Players cannot inspect cloud cohort';
  assert not has_function_privilege('authenticated','gamify_private.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Players cannot bypass wrapper';
  assert has_function_privilege('service_role','public.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Owner tool retains service-only wrapper';
  assert not has_table_privilege('service_role','gamify_private.beta2_cloud_accounts','select'), 'No raw table read grant added';
  perform set_config('request.jwt.claims','{"role":"service_role"}',true);
end $$;
set local role service_role;
do $$ declare result jsonb; expected record; begin
  select * into strict expected from pg_temp.b26_status_expected;
  result := public.beta2_admin_cloud('inspect');
  assert jsonb_typeof(result->'accountSettings') = 'array', 'Status always includes an account-settings array';
  assert result->'accountSettings' = expected.account_settings, 'Every configured UUID and enabled boolean matches stored settings';
  assert (result->'quota'->>'writes_enabled')::boolean = expected.writes_enabled, 'Status preserves writes switch';
  assert (result->'quota'->>'enrollments_enabled')::boolean = expected.enrollments_enabled, 'Status preserves enrollment switch';
  -- The old configure contract remains unchanged. Reapply the SAME pair only,
  -- inside this rollback; do not temporarily enable real accounts or writes.
  result := public.beta2_admin_cloud('configure',null,jsonb_build_object(
    'writesEnabled',expected.writes_enabled,'enrollmentsEnabled',expected.enrollments_enabled));
  assert result->'accountSettings' = expected.account_settings, 'Configure does not alter cohort';
  assert (result->'quota'->>'writes_enabled')::boolean = expected.writes_enabled, 'Configure retains requested writes';
  assert (result->'quota'->>'enrollments_enabled')::boolean = expected.enrollments_enabled, 'Configure retains requested enrollments';
end $$;
reset role;

-- Even a privileged SQL caller must supply the service-role JWT claim.
do $$ begin
  perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
  begin
    perform gamify_private.beta2_admin_cloud('inspect');
    raise exception 'Missing service-role JWT guard';
  exception when insufficient_privilege then null; end;
end $$;

select 'PASS: B2.6 service-only cloud cohort status, exact account settings, unchanged switches and JWT guard; rollback follows' as result;
rollback;
