-- ROLLBACK-ONLY acceptance. NOT SAFE ON LIVE: synthetic Auth, global quota
-- locks, WAL/statistics. Use the offline driver/minimal Auth stub; never live.
\set ON_ERROR_STOP on
begin;
set local lock_timeout = '1s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '15s';
set local plpgsql.variable_conflict = error;
set local plpgsql.check_asserts = on;
do $guard$ begin
  if current_database() !~ '^gamify_snapshot_test(_[a-z0-9_]+)?$'
    or to_regclass('snapshot_test_support.disposable_marker') is null then
    raise exception 'Use the disposable offline Auth stub; NEVER run on live'; end if;
end $guard$;

create function pg_temp.conflict_hash(value text) returns text language sql immutable
  set search_path='' as $$ select encode(extensions.digest(convert_to(value,'UTF8'),'sha256'),'hex'); $$;
-- Opaque SQL blob fixtures. The production-codec roundtrip suite independently
-- checks gzip/state integrity; these functions validate the RPC contract itself.
create function pg_temp.conflict_pack(value text) returns jsonb language sql immutable
  set search_path='' as $$ select jsonb_build_object('encoding','gzip','dataBase64',encode(convert_to(value,'UTF8'),'base64'),
  'compressedBytes',octet_length(value),'compressedSha256',pg_temp.conflict_hash(value),
  'uncompressedBytes',octet_length(value),'uncompressedSha256',pg_temp.conflict_hash(value)); $$;
create temp table conflict_requests(kind text primary key, value jsonb);
grant all on conflict_requests to authenticated,service_role;
insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data)
  values('b2100000-0000-4000-8000-000000000001','conflict@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id,accepted_notice_version,accepted_notice_at)
  values('b2100000-0000-4000-8000-000000000001','beta1.usage.v1',now());
select set_config('request.jwt.claims','{"role":"service_role"}',true);
set local role service_role;
select public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
select public.beta2_admin_cloud('account','b2100000-0000-4000-8000-000000000001','{"enabled":true}');
reset role;
select set_config('request.jwt.claims','{"role":"authenticated","sub":"b2100000-0000-4000-8000-000000000001"}',true);
set local role authenticated;
do $setup$ declare legacy jsonb; native jsonb; begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  legacy := jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'evidenceContractVersion',1,
    'campaign',jsonb_build_object('campaignId','conflict.legacy','name','Legacy synthetic','status','resumable'),
    'action','import','operationId','conflict.legacy.import','issuedAt',clock_timestamp(),'expectedRevision','0','writerGeneration','0',
    'writerToken',repeat('a',64),'campaignId','conflict.legacy','snapshot',pg_temp.conflict_pack('legacy state'),
    'evidence',jsonb_build_object('header',pg_temp.conflict_pack('header'),'fromRecord',0,'toRecord',1,'pages',jsonb_build_array(
      jsonb_build_object('firstRecord',0,'recordCount',1,'content',pg_temp.conflict_pack('record')))),'usageReceipts','[]'::jsonb);
  assert public.beta2_cloud_write(legacy::text,pg_temp.conflict_hash(legacy::text))->>'revision'='1';
  legacy := legacy || jsonb_build_object('action','save','operationId','conflict.legacy.append','expectedRevision','1','writerGeneration','1',
    'snapshot',pg_temp.conflict_pack('new legacy state'),
    'evidence',jsonb_build_object('headerSha256',legacy->'evidence'->'header'->>'uncompressedSha256','fromRecord',1,'toRecord',1,'pages','[]'::jsonb));
  assert public.beta2_cloud_write(legacy::text,pg_temp.conflict_hash(legacy::text))->>'revision'='2', 'VALID legacy request succeeds first';
  insert into conflict_requests values('legacy',legacy || jsonb_build_object('operationId','conflict.legacy.stale'));
  native := jsonb_build_object('protocolVersion',4,'cloudFormatVersion',3,
    'campaign',jsonb_build_object('campaignId','conflict.native','name','Native synthetic','status','resumable'),
    'action','import','operationId','conflict.native.import','issuedAt',clock_timestamp(),'expectedRevision','0','writerGeneration','0',
    'writerToken',repeat('b',64),'campaignId','conflict.native','snapshot',pg_temp.conflict_pack('native state'),
    'lineage',jsonb_build_object('branchId','synthetic','sequence',1,'parents','[]'::jsonb),
    'legacyBaseSnapshot',null,'legacyBaseLineage',null,'usageReceipts','[]'::jsonb);
  assert public.beta2_snapshot_write(native::text,pg_temp.conflict_hash(native::text))->>'revision'='1';
  native := native || jsonb_build_object('action','save','operationId','conflict.native.append','expectedRevision','1','writerGeneration','1',
    'snapshot',pg_temp.conflict_pack('new native state'));
  assert public.beta2_snapshot_write(native::text,pg_temp.conflict_hash(native::text))->>'revision'='2', 'VALID native request succeeds first';
  insert into conflict_requests values('native',native || jsonb_build_object('operationId','conflict.native.stale'));
end $setup$;
reset role;
create temp table conflict_before as select
  (select jsonb_agg(to_jsonb(c) order by campaign_id) from public.beta2_campaigns c where owner_id='b2100000-0000-4000-8000-000000000001') campaigns,
  (select jsonb_agg(to_jsonb(r) order by bucket,campaign_id) from gamify_private.beta2_cloud_rates r where owner_id='b2100000-0000-4000-8000-000000000001') rates,
  (select jsonb_agg(to_jsonb(w) order by campaign_id) from gamify_private.beta2_campaign_writers w where owner_id='b2100000-0000-4000-8000-000000000001') writers,
  (select jsonb_agg(to_jsonb(o) order by operation_id) from gamify_private.beta2_campaign_operations o where owner_id='b2100000-0000-4000-8000-000000000001') operations;
set local role authenticated;
do $conflicts$ declare req jsonb; message text; n integer; begin
  for n in 1..15 loop
    begin perform public.beta2_cloud_lease(3,'conflict.native','renew','1','1',repeat('b',64));
      raise exception 'Stale legacy lease accepted';
    exception when sqlstate 'PT409' then get stacked diagnostics message=message_text; assert message='Cloud revision conflict'; end;
  end loop;
  if to_regprocedure('public.beta2_cloud_lease_v2(integer,text,text,text,text,text)') is not null then
    begin execute 'select public.beta2_cloud_lease_v2(3,$1,$2,$3,$4,$5)'
      using 'conflict.native','renew','1','1',repeat('b',64);
      raise exception 'Stale efficient lease accepted';
    exception when sqlstate 'PT409' then get stacked diagnostics message=message_text; assert message='Cloud revision conflict'; end;
  end if;
  begin perform public.beta2_cloud_delete_campaign(3,'conflict.native','1'); raise exception 'Stale deletion accepted';
  exception when sqlstate 'PT409' then get stacked diagnostics message=message_text; assert message='Cloud revision conflict'; end;
  select value into req from conflict_requests where kind='native';
  begin perform public.beta2_snapshot_write(req::text,pg_temp.conflict_hash(req::text)); raise exception 'Stale native save accepted';
  exception when sqlstate 'PT409' then get stacked diagnostics message=message_text; assert message='Cloud revision conflict'; end;
  select value into req from conflict_requests where kind='legacy';
  begin perform public.beta2_cloud_write(req::text,pg_temp.conflict_hash(req::text)); raise exception 'Stale legacy save accepted';
  exception when sqlstate 'PT409' then get stacked diagnostics message=message_text; assert message='Cloud revision conflict'; end;
end $conflicts$;
reset role;
do $unchanged$ begin
  assert (select campaigns from conflict_before) = (select jsonb_agg(to_jsonb(c) order by campaign_id) from public.beta2_campaigns c where owner_id='b2100000-0000-4000-8000-000000000001');
  assert (select rates from conflict_before) = (select jsonb_agg(to_jsonb(r) order by bucket,campaign_id) from gamify_private.beta2_cloud_rates r where owner_id='b2100000-0000-4000-8000-000000000001'), 'Failed transactions roll back their rate increments';
  assert (select writers from conflict_before) = (select jsonb_agg(to_jsonb(w) order by campaign_id) from gamify_private.beta2_campaign_writers w where owner_id='b2100000-0000-4000-8000-000000000001');
  assert (select operations from conflict_before) = (select jsonb_agg(to_jsonb(o) order by operation_id) from gamify_private.beta2_campaign_operations o where owner_id='b2100000-0000-4000-8000-000000000001');
end $unchanged$;
-- Usage has its own rate table and remains idempotent after conflicts.
set local role authenticated;
do $usage$ declare rows jsonb; ack jsonb; day_start timestamptz := date_trunc('day',clock_timestamp() at time zone 'UTC') at time zone 'UTC'; begin
  rows := jsonb_build_array(jsonb_build_object('kind','playtime','receipt_id','b2100000-0000-4000-8000-000000000002',
    'session_id','b2100000-0000-4000-8000-000000000003','started_at',day_start,
    'ended_at',day_start+interval '5 seconds','active_ms',1000));
  ack := public.ingest_player_usage(rows,'first-scored-patient-and-employee.v1');
  assert jsonb_array_length(ack->'acknowledged_receipt_ids')=1;
  assert public.ingest_player_usage(rows,'first-scored-patient-and-employee.v1')=ack;
end $usage$;
reset role;
do $usage_total$ begin
  assert (select sum(playtime_seconds)=1 from public.player_usage_days where user_id='b2100000-0000-4000-8000-000000000001');
end $usage_total$;
-- Build an actual backup contract from the synthetic account, then prove an
-- existing-campaign collision is a 409 rather than a retryable DB failure.
select set_config('request.jwt.claims','{"role":"service_role"}',true);
set local role service_role;
do $backup$ declare exported jsonb; tables jsonb; bundle jsonb; message text; begin
  exported := public.beta2_backup_export('b2100000-0000-4000-8000-000000000001'); tables := exported->'tables';
  bundle := jsonb_build_object('format','beta2.private-backup.v1','ownerId',exported->'ownerId',
    'campaign',(select v from jsonb_array_elements(tables->'public.beta2_campaigns') v where v->>'campaign_id'='conflict.native'),
    'snapshots',(select jsonb_agg(v) from jsonb_array_elements(tables->'public.beta2_campaign_snapshots') v where v->>'campaign_id'='conflict.native'),
    'header',null,'pages','[]'::jsonb);
  perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":false,"enrollmentsEnabled":false}');
  begin perform public.beta2_backup_restore(bundle::text,pg_temp.conflict_hash(bundle::text),false); raise exception 'Existing restore accepted';
  exception when sqlstate 'PT409' then get stacked diagnostics message=message_text;
    assert message='Existing campaign or name is preserved; restore will not overwrite'; end;
end $backup$;
reset role;
do $done$ begin
  raise notice 'PASS: all deterministic conflicts PT409, unchanged state/rates/ACLs, valid old/new writes, idempotent usage and protected restore; rollback follows';
end $done$;
rollback;
