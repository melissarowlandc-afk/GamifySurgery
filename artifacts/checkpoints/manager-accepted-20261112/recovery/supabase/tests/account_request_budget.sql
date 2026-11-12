-- ROLLBACK ONLY. NOT SAFE ON LIVE: synthetic Auth/account/quota fixtures take
-- real locks and generate WAL even after rollback. Disposable offline DB only.
\set ON_ERROR_STOP on
begin;
set local lock_timeout = '1s';
set local statement_timeout = '10s';
set local plpgsql.variable_conflict = error;
set local plpgsql.check_asserts = on;
do $guard$ begin
  if current_database() !~ '^gamify_snapshot_test(_[a-z0-9_]+)?$'
    or to_regclass('snapshot_test_support.disposable_marker') is null then
    raise exception 'Use the disposable offline Auth stub; NEVER run on the live project'; end if;
end $guard$;

insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data)
 values ('b2040000-0000-4000-8000-000000000001','budget@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id,accepted_notice_version,accepted_notice_at)
 values ('b2040000-0000-4000-8000-000000000001','beta1.usage.v1',now());
insert into gamify_private.beta2_cloud_accounts(user_id,enabled,accepted_notice_version,accepted_notice_at)
 values ('b2040000-0000-4000-8000-000000000001',true,'beta2.cloud.v1',now());
update gamify_private.beta2_cloud_quota set writes_enabled=true;
insert into public.beta2_campaigns(owner_id,campaign_id,name,normalized_name,status,current_revision,writer_generation,
 current_sha256,evidence_high_water,evidence_bytes,header_sha256,import_operation_id,import_request_sha256)
 values ('b2040000-0000-4000-8000-000000000001','budget.synthetic','Budget synthetic','budget synthetic','resumable',1,1,
 repeat('a',64),0,0,repeat('b',64),'budget.import',repeat('c',64));
insert into gamify_private.beta2_campaign_writers(owner_id,campaign_id,generation,token_sha256,expires_at)
 values ('b2040000-0000-4000-8000-000000000001','budget.synthetic',1,null,null);
select set_config('request.jwt.claims','{"role":"authenticated","sub":"b2040000-0000-4000-8000-000000000001"}',true);
set local role authenticated;
do $checks$ declare grant1 jsonb; grant2 jsonb; retried jsonb; t timestamptz; begin
  assert has_function_privilege('authenticated','public.beta2_cloud_lease_v2(integer,text,text,text,text,text)','execute');
  assert not has_function_privilege('anon','public.beta2_cloud_lease_v2(integer,text,text,text,text,text)','execute');
  assert not has_function_privilege('service_role','public.beta2_cloud_lease_v2(integer,text,text,text,text,text)','execute');
  assert (public.beta2_cloud_access(3)->>'efficientLeases')::boolean;
  grant1 := public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','1',repeat('1',64));
  t := (grant1->>'serverTime')::timestamptz;
  assert (grant1->>'expiresAt')::timestamptz - t = interval '10 minutes';
  assert grant1->>'writerGeneration'='2';
  retried := public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','1',repeat('1',64));
  assert retried->>'expiresAt'=grant1->>'expiresAt' and retried->>'writerGeneration'=grant1->>'writerGeneration',
    'Identical acquire returns the same grant without extending expiry';
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','renew','2','2',repeat('1',64));
    raise exception 'Revision fence bypass'; exception when serialization_failure then null; end;
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','renew','1','2',repeat('f',64));
    raise exception 'Token fence bypass'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease_v2(3,repeat('x',257),'renew','1','2',repeat('1',64));
    raise exception 'Identity bound bypass'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_lease_v2(999,'budget.synthetic','renew','1','2',repeat('1',64));
    raise exception 'Protocol guard bypass'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_lease_v2(3,'other-owner-campaign','renew','1','2',repeat('1',64));
    raise exception 'Owner filter bypass'; exception when insufficient_privilege then null; end;
  grant2 := public.beta2_cloud_lease_v2(3,'budget.synthetic','takeover','1','2',repeat('2',64));
  assert grant2->>'writerGeneration'='3';
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','renew','1','2',repeat('1',64));
    raise exception 'Old writer renewal bypass'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','release','1','2',repeat('1',64));
    raise exception 'Old writer release bypass'; exception when object_not_in_prerequisite_state then null; end;
end $checks$;
reset role;
-- Leases allocate no blob bytes. Prove renewal/release still works at a full
-- project boundary while all actual write/accounting guards remain unchanged.
create temp table budget_quota_before as select * from gamify_private.beta2_cloud_quota;
update gamify_private.beta2_cloud_quota set accounted_bytes=400000000;
set local role authenticated;
do $full$ begin
  perform public.beta2_cloud_lease_v2(3,'budget.synthetic','renew','1','3',repeat('2',64));
  perform public.beta2_cloud_lease_v2(3,'budget.synthetic','release','1','3',repeat('2',64));
end $full$;
reset role;
do $unchanged$ begin
  assert (select accounted_bytes=400000000 from gamify_private.beta2_cloud_quota);
  assert (select current_revision=1 and current_sha256=repeat('a',64) and writer_generation=3 from public.beta2_campaigns where campaign_id='budget.synthetic');
  assert not exists(select 1 from gamify_private.beta2_campaign_operations where campaign_id='budget.synthetic');
end $unchanged$;
update gamify_private.beta2_cloud_quota set accounted_bytes=(select accounted_bytes from budget_quota_before);
set local role authenticated;
do $legacy$ declare grant1 jsonb; begin
  grant1 := public.beta2_cloud_lease(3,'budget.synthetic','acquire','1','3',repeat('3',64));
  assert (grant1->>'expiresAt')::timestamptz - (grant1->>'serverTime')::timestamptz = interval '60 seconds';
end $legacy$;
reset role;
update gamify_private.beta2_campaign_writers set expires_at=clock_timestamp()-interval '1 second' where campaign_id='budget.synthetic';
set local role authenticated;
do $expired$ begin
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','renew','1','4',repeat('3',64));
    raise exception 'Expired lease bypass'; exception when object_not_in_prerequisite_state then null; end;
end $expired$;
reset role;
update gamify_private.beta2_cloud_accounts set accepted_notice_at=null where user_id='b2040000-0000-4000-8000-000000000001';
set local role authenticated;
do $notice$ begin
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','4',repeat('4',64));
    raise exception 'Notice guard bypass'; exception when insufficient_privilege then null; end;
end $notice$;
reset role;
update gamify_private.beta2_cloud_accounts set accepted_notice_at=clock_timestamp() where user_id='b2040000-0000-4000-8000-000000000001';
update gamify_private.beta2_cloud_quota set writes_enabled=false;
set local role authenticated;
do $disabled$ begin
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','4',repeat('4',64));
    raise exception 'Write switch bypass'; exception when object_not_in_prerequisite_state then null; end;
end $disabled$;
reset role;
update gamify_private.beta2_cloud_quota set writes_enabled=true;
insert into gamify_private.beta2_cloud_deletions(subject_sha256)
 values(gamify_private.beta2_hash('b2040000-0000-4000-8000-000000000001'));
set local role authenticated;
do $deleted$ begin
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','4',repeat('4',64));
    raise exception 'Deletion tombstone bypass'; exception when insufficient_privilege then null; end;
end $deleted$;
reset role;
delete from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b2040000-0000-4000-8000-000000000001');
update gamify_private.player_memberships set revoked_at=clock_timestamp() where user_id='b2040000-0000-4000-8000-000000000001';
set local role authenticated;
do $revoked$ begin
  begin perform public.beta2_cloud_lease_v2(3,'budget.synthetic','acquire','1','4',repeat('4',64));
    raise exception 'Revoked admission bypass'; exception when insufficient_privilege then null; end;
  raise notice 'PASS: efficient and legacy lease durations, idempotence, capacity independence, immutable head, identity/revision/token/generation/expiry/ACL/admission fences';
end $revoked$;
rollback;
