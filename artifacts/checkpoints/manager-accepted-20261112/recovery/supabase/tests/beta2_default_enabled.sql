-- Run the ENTIRE file as postgres after 20261027000100. Synthetic identities only.
-- Rollback-only; no COMMIT. On any error run ROLLBACK immediately.
-- Offline-authored; the manager executes. Exactly one final PASS row.
begin;
set local plpgsql.check_asserts = on;
set local search_path = pg_catalog, public;

create temp table beta2_default_test(test_key text primary key, test_value jsonb not null);
-- SQL treats these bytes as opaque, just as in beta2_cloud_saves.sql.
create function pg_temp.b2_default_pack(p_text text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(convert_to(p_text,'UTF8'),'base64'),E'\n',''),
    'compressedBytes',octet_length(p_text),'compressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'),
    'uncompressedBytes',octet_length(p_text),'uncompressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'));
$$;
insert into beta2_default_test values ('request',jsonb_build_object(
  'protocolVersion',3,'cloudFormatVersion',2,'evidenceContractVersion',1,
  'campaign',jsonb_build_object('campaignId','campaign.default.synthetic','name','Synthetic default','status','resumable'),
  'action','import','operationId','import.default.synthetic','issuedAt',clock_timestamp(),
  'expectedRevision','0','writerGeneration','0','writerToken',repeat('a',64),'campaignId','campaign.default.synthetic',
  'snapshot',pg_temp.b2_default_pack('opaque default snapshot'),
  'evidence',jsonb_build_object('header',pg_temp.b2_default_pack('opaque default header'),'fromRecord',0,'toRecord',1,
    'pages',jsonb_build_array(jsonb_build_object('firstRecord',0,'recordCount',1,'content',pg_temp.b2_default_pack('opaque default page')))),
  'usageReceipts','[]'::jsonb));
do $$ begin execute format('grant usage on schema %I to authenticated',
  (select nspname from pg_namespace where oid=pg_my_temp_schema())); end $$;
grant select on pg_temp.beta2_default_test to authenticated;

do $catalog$ begin
  assert (select a.attnotnull and pg_get_expr(d.adbin,d.adrelid) = 'false'
    from pg_attribute a join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where a.attrelid='gamify_private.beta2_cloud_quota'::regclass and a.attname='default_account_enabled'),
    'The new switch is NOT NULL and defaults to false';
  assert not has_function_privilege('anon','public.beta2_cloud_access(integer)','execute'), 'No anonymous cloud access';
  assert not has_function_privilege('authenticated','gamify_private.beta2_require_cloud(integer,boolean,boolean)','execute'), 'No guard bypass';
  assert not has_function_privilege('authenticated','public.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'No player configuration';
  assert not has_function_privilege('authenticated','gamify_private.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'No private admin bypass';
  assert has_function_privilege('service_role','public.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Owner tool retains its grant';
  assert not has_table_privilege('authenticated','gamify_private.beta2_cloud_quota','select,update'), 'No raw switch access';
  assert not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='gamify_private' and p.proname in ('beta2_cloud_access','beta2_require_cloud','beta2_admin_cloud')
      and (not p.prosecdef or not coalesce('search_path=""' = any(p.proconfig),false))), 'Definer and empty search paths survive';
end $catalog$;

insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
  ('b227def0-0000-4000-8000-000000000001','default-main@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000002','default-optout@example.invalid',null,now(),'authenticated','authenticated',false,'{"gamify_setup_admitted":true}'),
  ('b227def0-0000-4000-8000-000000000003','default-rowless@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000004','default-revoked@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000005','default-deleting@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000006','default-soft-deleted@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000007','default-hard-deleted@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000008','default-ledger@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000009','default-uninvited@example.invalid',null,now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000010','default-unconfirmed@example.invalid',now(),null,'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000011','default-banned@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b227def0-0000-4000-8000-000000000012','default-anonymous@example.invalid',now(),now(),'authenticated','authenticated',true,'{}'),
  ('b227def0-0000-4000-8000-000000000013','default-no-membership@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id) select id from auth.users where id in (
  'b227def0-0000-4000-8000-000000000001','b227def0-0000-4000-8000-000000000002','b227def0-0000-4000-8000-000000000003',
  'b227def0-0000-4000-8000-000000000004','b227def0-0000-4000-8000-000000000005','b227def0-0000-4000-8000-000000000006',
  'b227def0-0000-4000-8000-000000000007','b227def0-0000-4000-8000-000000000008','b227def0-0000-4000-8000-000000000009',
  'b227def0-0000-4000-8000-000000000010','b227def0-0000-4000-8000-000000000011','b227def0-0000-4000-8000-000000000012');
update gamify_private.player_memberships set revoked_at=clock_timestamp() where user_id='b227def0-0000-4000-8000-000000000004';
update gamify_private.player_memberships set deletion_requested_at=clock_timestamp() where user_id='b227def0-0000-4000-8000-000000000005';
update auth.users set deleted_at=clock_timestamp() where id='b227def0-0000-4000-8000-000000000006';
delete from auth.users where id='b227def0-0000-4000-8000-000000000007';
update auth.users set raw_user_meta_data='{"gamify_setup_admitted":true}' where id='b227def0-0000-4000-8000-000000000009';
update auth.users set banned_until=clock_timestamp()+interval '1 day' where id='b227def0-0000-4000-8000-000000000011';
insert into gamify_private.beta2_cloud_deletions(subject_sha256) values(gamify_private.beta2_hash('b227def0-0000-4000-8000-000000000008'));
update gamify_private.beta2_cloud_quota set accounted_bytes=accounted_bytes+1024 where singleton;

do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ declare v_result jsonb; v_bad jsonb; begin
  v_result := public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":false}');
  assert v_result->'quota'->>'default_account_enabled'='false', 'Configure reports default off';
  perform public.beta2_admin_cloud('account','b227def0-0000-4000-8000-000000000002','{"enabled":false}');
  for v_bad in select value from jsonb_array_elements('[
    {"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":null},
    {"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":"true"},
    {"defaultAccountEnabled":true},
    {"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":true,"extra":true},
    {"writesEnabled":null,"enrollmentsEnabled":true,"defaultAccountEnabled":true}
  ]'::jsonb) loop
    begin perform public.beta2_admin_cloud('configure',null,v_bad); raise exception 'Invalid configuration accepted';
    exception when invalid_parameter_value then null; end;
  end loop;
  v_result := public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
  assert v_result->'quota'->>'default_account_enabled'='false', 'Legacy configure preserves default off';
end $$;
reset role;
insert into beta2_default_test select 'before_account',to_jsonb(accounted_bytes) from gamify_private.beta2_cloud_quota where singleton;

-- Real execution roles remain separate from JWT claims.
set local role authenticated;
do $$ begin
  begin perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":true}');
    raise exception 'Player changed the default with a spoofed service claim'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
  begin perform gamify_private.beta2_admin_cloud('inspect'); raise exception 'Admin JWT guard missing'; exception when insufficient_privilege then null; end;
end $$;

-- Default off: the existing Beta 1 behavior and no implicit account/notice.
do $$ begin perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  assert public.beta2_cloud_access(3)->>'enabled'='false', 'No row remains disabled with default off';
  begin perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1'); raise exception 'Default off created an account'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_cloud_access(2); raise exception 'Old protocol accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.beta2_cloud_accounts where user_id='b227def0-0000-4000-8000-000000000001'), 'Default off creates no account';
end $$;

do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ declare v_result jsonb; begin
  perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":true}');
  v_result := public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
  assert v_result->'quota'->>'default_account_enabled'='true', 'Legacy configure preserves default on';
  v_result := public.beta2_admin_cloud('inspect');
  assert v_result->'quota'->>'default_account_enabled'='true', 'Inspect reports the default';
  assert v_result->'quota'->>'writes_enabled'='true' and v_result->'quota'->>'enrollments_enabled'='true', 'Other switches survive';
  assert v_result->'accountSettings' @> '[{"userId":"b227def0-0000-4000-8000-000000000002","enabled":false}]'::jsonb, 'Inspect retains explicit opt-out';
end $$;
reset role;

-- Reading access inherits the default without manufacturing consent or quota.
do $$ begin perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_access jsonb; begin
  v_access := public.beta2_cloud_access(3);
  assert v_access->>'enabled'='true', 'New admitted account inherits default on';
  assert v_access->>'noticeAccepted'='false' and v_access->>'enrolled'='false', 'No implicit consent or enrollment';
  assert v_access->'quota'='null'::jsonb, 'Access does not create an account';
  begin perform public.beta2_cloud_list(3); raise exception 'Notice guard bypassed'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_accept_cloud_notice(3,'wrong'); raise exception 'Wrong notice accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.beta2_cloud_accounts where user_id='b227def0-0000-4000-8000-000000000001'), 'Failed guarded calls roll back provisioning';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton)=
    (select (test_value#>>'{}')::bigint from pg_temp.beta2_default_test where test_key='before_account'), 'Failed guarded calls reserve no bytes';
end $$;
set local role authenticated;
do $$ begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  assert public.beta2_cloud_access(3)->>'noticeAccepted'='true', 'Separate notice acceptance succeeds';
  assert not gamify_private.can_record_usage(), 'Cloud notice does not accept usage consent';
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns')=0, 'The first-use account supports guarded reads';
end $$;
reset role;
do $$ begin
  assert (select enabled and accepted_notice_at is not null and enrolled_at is null from gamify_private.beta2_cloud_accounts
    where user_id='b227def0-0000-4000-8000-000000000001'), 'First notice creates one enabled, not-yet-enrolled row';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton)=
    (select (test_value#>>'{}')::bigint+8192 from pg_temp.beta2_default_test where test_key='before_account'), 'Reserve the account allowance exactly once';
end $$;
set local role authenticated;
do $$ declare v_request jsonb; begin
  v_request := (select test_value from pg_temp.beta2_default_test where test_key='request');
  assert public.beta2_cloud_write(v_request::text,encode(sha256(convert_to(v_request::text,'UTF8')),'hex'))->>'revision'='1', 'Default-enabled account passes the real write guard';
end $$;
reset role;

-- An explicit false remains disabled while the global default is on.
do $$ begin perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_request jsonb; begin
  assert public.beta2_cloud_access(3)->>'enabled'='false', 'Explicit disable wins over default on';
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  v_request := (select test_value from pg_temp.beta2_default_test where test_key='request');
  begin perform public.beta2_cloud_write(v_request::text,encode(sha256(convert_to(v_request::text,'UTF8')),'hex'));
    raise exception 'Explicit disabled account wrote'; exception when object_not_in_prerequisite_state then null; end;
end $$;
reset role;

-- Switching the default off leaves existing enabled rows alone.
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ begin perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":false,"enrollmentsEnabled":true,"defaultAccountEnabled":false}'); end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  assert public.beta2_cloud_access(3)->>'enabled'='true', 'Existing enabled row survives default off';
  begin perform public.beta2_cloud_lease(3,'campaign.default.synthetic','renew','1','1',repeat('a',64));
    raise exception 'Global writes guard bypassed'; exception when object_not_in_prerequisite_state then null; end;
  perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000003","role":"authenticated"}',true);
  assert public.beta2_cloud_access(3)->>'enabled'='false', 'A rowless account follows default off';
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ begin perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true,"defaultAccountEnabled":true}'); end $$;
reset role;

-- Revocation, membership deletion, both Auth deletion modes, the cloud deletion
-- ledger, untrusted signup metadata, confirmation, bans and anonymity still deny.
set local role authenticated;
do $$ declare v_subject uuid; v_request jsonb; begin
  v_request := (select test_value from pg_temp.beta2_default_test where test_key='request');
  foreach v_subject in array array[
    'b227def0-0000-4000-8000-000000000004','b227def0-0000-4000-8000-000000000005',
    'b227def0-0000-4000-8000-000000000006','b227def0-0000-4000-8000-000000000007',
    'b227def0-0000-4000-8000-000000000008','b227def0-0000-4000-8000-000000000009',
    'b227def0-0000-4000-8000-000000000010','b227def0-0000-4000-8000-000000000011',
    'b227def0-0000-4000-8000-000000000012','b227def0-0000-4000-8000-000000000013',
    'b227def0-0000-4000-8000-000000000014']::uuid[] loop
    perform set_config('request.jwt.claims',jsonb_build_object('sub',v_subject,'role','authenticated')::text,true);
    begin perform public.beta2_cloud_access(3); raise exception 'Ineligible access enabled: %',v_subject; exception when insufficient_privilege then null; end;
    begin perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1'); raise exception 'Ineligible account provisioned: %',v_subject; exception when insufficient_privilege then null; end;
    begin perform public.beta2_cloud_write(v_request::text,encode(sha256(convert_to(v_request::text,'UTF8')),'hex'));
      raise exception 'Ineligible account wrote: %',v_subject; exception when insufficient_privilege then null; end;
  end loop;
  perform set_config('request.jwt.claims','{"sub":"b227def0-0000-4000-8000-000000000001","role":"authenticated"}',true);
  perform public.beta2_delete_my_data('all-account-data.v1','beta2.cloud.v1');
  begin perform public.beta2_cloud_access(3); raise exception 'Deleted account enabled again'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1'); raise exception 'Deleted account recreated'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.beta2_cloud_accounts where user_id in (
    'b227def0-0000-4000-8000-000000000001','b227def0-0000-4000-8000-000000000003','b227def0-0000-4000-8000-000000000004',
    'b227def0-0000-4000-8000-000000000005','b227def0-0000-4000-8000-000000000006','b227def0-0000-4000-8000-000000000007',
    'b227def0-0000-4000-8000-000000000008','b227def0-0000-4000-8000-000000000009','b227def0-0000-4000-8000-000000000010',
    'b227def0-0000-4000-8000-000000000011','b227def0-0000-4000-8000-000000000012','b227def0-0000-4000-8000-000000000013',
    'b227def0-0000-4000-8000-000000000014')), 'No deleted, rowless or ineligible account was recreated';
  assert (select not enabled from gamify_private.beta2_cloud_accounts where user_id='b227def0-0000-4000-8000-000000000002'), 'The explicit opt-out remains false';
  assert not exists(select 1 from public.beta2_campaigns where owner_id='b227def0-0000-4000-8000-000000000001'), 'Full deletion removed the campaign';
  assert exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b227def0-0000-4000-8000-000000000001')), 'Full deletion retains its suppression marker';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton)=
    (select (test_value#>>'{}')::bigint+1024 from pg_temp.beta2_default_test where test_key='before_account'), 'Only the deleted primary account ledger adds to the initial allowance';
end $$;

select 'PASS: cloud default off/on, explicit opt-out, first-use notice/write/quota, legacy configure, admission/revocation/deletion and ACL guards; rollback follows' as result;
rollback;
