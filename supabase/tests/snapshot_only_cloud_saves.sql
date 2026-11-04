-- psql-only, fail-fast SYNTHETIC acceptance in a DISPOSABLE database.
-- NOT SAFE ON LIVE: save/lease RPCs share quota locks; rollback still creates
-- WAL/bloat. Use snapshot_only_offline.sql (minimal Auth stub + migrations).
-- Dedicated connection: psql -X -v ON_ERROR_STOP=1 -f <this file>.
-- Never execute selected fragments, commit fixtures or substitute live users.
\set ON_ERROR_STOP on
begin;
set local lock_timeout = '1s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '10s';
set local plpgsql.variable_conflict = error;
set local plpgsql.check_asserts = on;
set local search_path = pg_catalog, public;
do $disposable$ begin
  if current_database() !~ '^gamify_snapshot_test(_[a-z0-9_]+)?$'
    or to_regclass('snapshot_test_support.disposable_marker') is null then
    raise exception 'Snapshot tests require the disposable offline database; never run on live'; end if;
  assert current_setting('plpgsql.variable_conflict') = 'error', 'R1: default conflict behavior required';
end $disposable$;
create temp table snapshot_test_rows(key text primary key, value jsonb not null);
create function pg_temp.snapshot_pack(p_text text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(convert_to(p_text,'UTF8'),'base64'),E'\n',''),
    'compressedBytes',octet_length(p_text),'compressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'),
    'uncompressedBytes',octet_length(p_text),'uncompressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'));
$$;
create function pg_temp.snapshot_hash(p_text text) returns text
language sql immutable security definer set search_path = '' as $$ select encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'); $$;
-- Hash every relevant byte/counter/authority row without invoking another RPC
-- (a load RPC would intentionally change its rate bucket). Disposable only.
create function pg_temp.snapshot_fingerprint(p_owner uuid) returns text
language sql security definer set search_path = '' as $$
  select pg_temp.snapshot_hash(jsonb_build_object(
    'account',(select to_jsonb(a) from gamify_private.beta2_cloud_accounts a where user_id=p_owner),
    'quota',(select to_jsonb(q) from gamify_private.beta2_cloud_quota q where singleton),
    'campaigns',(select jsonb_agg(to_jsonb(c) order by campaign_id) from public.beta2_campaigns c where owner_id=p_owner),
    'snapshots',(select jsonb_agg(to_jsonb(s) order by campaign_id,revision) from public.beta2_campaign_snapshots s where owner_id=p_owner),
    'headers',(select jsonb_agg(to_jsonb(h) order by campaign_id) from public.beta2_evidence_headers h where owner_id=p_owner),
    'pages',(select jsonb_agg(to_jsonb(p) order by campaign_id,first_record) from public.beta2_evidence_pages p where owner_id=p_owner),
    'writers',(select jsonb_agg(to_jsonb(w) order by campaign_id) from gamify_private.beta2_campaign_writers w where owner_id=p_owner),
    'operations',(select jsonb_agg(to_jsonb(o) order by operation_id) from gamify_private.beta2_campaign_operations o where owner_id=p_owner),
    'rates',(select jsonb_agg(to_jsonb(r) order by bucket,campaign_id) from gamify_private.beta2_cloud_rates r where owner_id=p_owner),
    'usage',(select jsonb_agg(to_jsonb(u) order by receipt_id) from gamify_private.usage_receipts u where user_id=p_owner)
  )::text);
$$;
-- Deliberately opaque SQL fixtures, not playable content. Client codec tests
-- separately prove exact state/FSRS/frozen-encounter migration.
create function pg_temp.snapshot_request(p_action text, p_id text, p_op text, p_revision text, p_generation text, p_token text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('protocolVersion',4,'cloudFormatVersion',3,
    'campaign',jsonb_build_object('campaignId',p_id,'name',p_id,'status','resumable'),
    'action',p_action,'operationId',p_op,'issuedAt',clock_timestamp(),'expectedRevision',p_revision,'writerGeneration',p_generation,
    'writerToken',p_token,'campaignId',p_id,'snapshot',pg_temp.snapshot_pack('current '||p_op),
    'lineage',jsonb_build_object('branchId','synthetic','sequence',1,'parents','[]'::jsonb),
    'legacyBaseSnapshot',null,'legacyBaseLineage',null,'usageReceipts','[]'::jsonb);
$$;
create function pg_temp.snapshot_project_boundary(p_request jsonb, p_owner uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare v_before text := pg_temp.snapshot_fingerprint(p_owner); v_message text;
begin
  -- Test-only privileged quota setup; RPC admission still uses the exact
  -- authenticated JWT/membership. Never grant player access to the real ledger.
  assert (select pg_database_size(current_database()) + dead_bytes_estimate + 16000000 + 1048576 < 400000000
    from gamify_private.beta2_cloud_quota where singleton), 'R3: fixture must leave physical/transient headroom';
  assert octet_length(p_request::text) < 16000
    and (select evidence_bytes=999998 from public.beta2_campaigns where owner_id=p_owner and campaign_id=p_request->>'campaignId'),
    'R3: small new blobs and large retired evidence make the old logical-only check pass';
  begin
    update gamify_private.beta2_cloud_quota set accounted_bytes = 349999999 - dead_bytes_estimate where singleton;
    perform public.beta2_snapshot_write(p_request::text,pg_temp.snapshot_hash(p_request::text));
    raise exception 'R3: final project allowance bypass';
  exception when program_limit_exceeded then
    get stacked diagnostics v_message = message_text;
    assert v_message = 'Cloud project capacity reached', 'R3: final effective-ledger rejection';
  end;
  assert pg_temp.snapshot_fingerprint(p_owner) = v_before, 'R3: rollback preserves every ledger/head/evidence/op/writer/rate byte';
end;
$$;
do $$ begin execute format('grant usage on schema %I to authenticated,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end $$;
grant select,insert,update on pg_temp.snapshot_test_rows to authenticated,service_role;
insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
  ('b2030000-0000-4000-8000-000000000001','snapshot-a@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b2030000-0000-4000-8000-000000000002','snapshot-b@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id) values('b2030000-0000-4000-8000-000000000001'),('b2030000-0000-4000-8000-000000000002');
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
select public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
select public.beta2_admin_cloud('account','b2030000-0000-4000-8000-000000000001','{"enabled":true}');
select public.beta2_admin_cloud('account','b2030000-0000-4000-8000-000000000002','{"enabled":true}');
reset role;
-- R6: malformed inputs fail before admission/account locks, even without a
-- subject. Without the argument guard these return 42501 instead of 22023.
do $$ begin perform set_config('request.jwt.claims','{"role":"authenticated"}',true); end $$;
set local role authenticated;
do $arguments$ declare v_id text; v_revision text; v_message text; begin
  for v_id in select value from (values (null::text),(''),(repeat('x',257)),(repeat(chr(233),129))) v(value) loop
    begin
      perform public.beta2_snapshot_load(3,v_id); raise exception 'R6: invalid ID accepted';
    exception when invalid_parameter_value then
      get stacked diagnostics v_message = message_text;
      assert v_message = 'Invalid cloud campaign ID', 'R6: specific bounded-ID rejection';
    end;
  end loop;
  for v_revision in select value from (values (''),('0'),('-1'),('01'),('1.2'),(' 1'),(repeat('9',20)),('9223372036854775808')) v(value) loop
    begin
      perform public.beta2_snapshot_load(3,'snapshot.synthetic.a',v_revision); raise exception 'R6: malformed revision accepted';
    exception when invalid_parameter_value then
      get stacked diagnostics v_message = message_text;
      assert v_message in ('Invalid cloud revision','Invalid cloud integer'), 'R6: bounded revision rejection';
    end;
  end loop;
end $arguments$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2030000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $convert$
declare legacy jsonb; legacy_save jsonb; req jsonb; bad jsonb; accepted jsonb; old jsonb; saved jsonb;
  v_message text; v_before text; v_owner uuid := 'b2030000-0000-4000-8000-000000000001';
begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  assert public.beta2_cloud_access(3)->>'snapshotSaves' = 'true', 'Capability activates only after migration';
  legacy := jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'evidenceContractVersion',1,
    'campaign',jsonb_build_object('campaignId','snapshot.synthetic.a','name','snapshot.synthetic.a','status','resumable'),
    'action','import','operationId','legacy.import','issuedAt',clock_timestamp(),'expectedRevision','0','writerGeneration','0',
    'writerToken',repeat('a',64),'campaignId','snapshot.synthetic.a','snapshot',pg_temp.snapshot_pack('old operational state'),
    'evidence',jsonb_build_object('header',pg_temp.snapshot_pack('h'),'fromRecord',0,'toRecord',1,'pages',jsonb_build_array(
      jsonb_build_object('firstRecord',0,'recordCount',1,'content',pg_temp.snapshot_pack(repeat('x',885244))))),'usageReceipts','[]'::jsonb);
  accepted := public.beta2_cloud_write(legacy::text,pg_temp.snapshot_hash(legacy::text));
  insert into pg_temp.snapshot_test_rows values('legacy',legacy);
  -- R1/R4: a VALID old-client append on an unconverted account still works.
  -- Its empty suffix leaves evidence at 999,998 bytes, but establishes an
  -- existing legacy current/prior pair (2/1) before the first conversion.
  legacy_save := legacy || jsonb_build_object('action','save','operationId','legacy.append','expectedRevision','1','writerGeneration','1',
    'snapshot',pg_temp.snapshot_pack('newer legacy operational state'),
    'evidence',jsonb_build_object('headerSha256',legacy->'evidence'->'header'->>'uncompressedSha256','fromRecord',1,'toRecord',1,'pages','[]'::jsonb));
  assert public.beta2_cloud_write(legacy_save::text,pg_temp.snapshot_hash(legacy_save::text))->>'revision' = '2', 'Valid legacy save after migration';
  assert public.beta2_cloud_load(3,'snapshot.synthetic.a','1')->'snapshot' = legacy->'snapshot', 'Legacy prior exists before conversion';
  old := public.beta2_cloud_load(3,'snapshot.synthetic.a');
  assert (old->'quota'->>'evidenceBytes')::bigint = 999998, 'Real evidence ledger is at capacity (two bytes spare)';
  bad := legacy || jsonb_build_object('action','save','operationId','capacity.legacy','expectedRevision','2','writerGeneration','1',
    'evidence',jsonb_build_object('headerSha256',legacy->'evidence'->'header'->>'uncompressedSha256','fromRecord',1,'toRecord',2,
      'pages',jsonb_build_array(jsonb_build_object('firstRecord',1,'recordCount',1,'content',pg_temp.snapshot_pack('next')))));
  begin perform public.beta2_cloud_write(bad::text,pg_temp.snapshot_hash(bad::text)); raise exception 'Legacy quota bypass'; exception when program_limit_exceeded then null; end;
  req := pg_temp.snapshot_request('save','snapshot.synthetic.a','convert','2','1',repeat('a',64)) || jsonb_build_object(
    'legacyBaseSnapshot',pg_temp.snapshot_pack('faithful complete prior state'),
    'legacyBaseLineage',jsonb_build_object('branchId','migration','sequence',0,'parents','[]'::jsonb));
  bad := jsonb_set(req,'{snapshot,compressedSha256}',to_jsonb(repeat('0',64)));
  begin perform public.beta2_snapshot_write(bad::text,pg_temp.snapshot_hash(bad::text)); raise exception 'Digest bypass'; exception when invalid_parameter_value then null; end;
  -- R3: old reserve arithmetic passes because it subtracts retired ~1 MB;
  -- the final accounted+dead total exceeds the ceiling by the new blob/op.
  perform pg_temp.snapshot_project_boundary(req,v_owner);
  accepted := public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text));
  assert accepted->>'revision' = '3' and accepted->>'evidenceHighWater' = '0', 'R1: legacy pair converts under default variable_conflict=error';
  assert public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text)) = accepted, 'Same immutable operation is idempotent';
  saved := public.beta2_snapshot_load(3,'snapshot.synthetic.a');
  assert saved->'snapshot' = req->'snapshot' and saved->>'cloudFormatVersion' = '3' and not saved ? 'evidence', 'Snapshot read has no pages';
  assert (saved->'quota'->>'evidenceBytes')::bigint = 0, 'Evidence no longer billed';
  assert public.beta2_snapshot_load(3,'snapshot.synthetic.a','2')->'snapshot' = req->'legacyBaseSnapshot', 'Faithful prior stored atomically';
  assert public.beta2_cloud_write(legacy::text,pg_temp.snapshot_hash(legacy::text))->>'revision' = '1', 'Original legacy receipt remains retrievable, no replay';
  -- R4: start from the SUCCESSFUL, valid protocol-3 envelope above. Correct
  -- current CAS/generation/token and valid digest rule out stale/shape errors.
  bad := legacy_save || jsonb_build_object('operationId','obsolete.client','expectedRevision','3',
    'evidence',jsonb_build_object('headerSha256',repeat('0',64),'fromRecord',0,'toRecord',0,'pages','[]'::jsonb));
  v_before := pg_temp.snapshot_fingerprint(v_owner);
  begin perform public.beta2_cloud_write(bad::text,pg_temp.snapshot_hash(bad::text)); raise exception 'R4: old client appended to native head';
  exception when invalid_parameter_value then
    get stacked diagnostics v_message = message_text;
    assert v_message = 'Cloud client update required for snapshot saves', 'R4: specific old-client write guard';
  end;
  begin perform public.beta2_cloud_load(3,'snapshot.synthetic.a'); raise exception 'R4: old client loaded native current';
  exception when invalid_parameter_value then
    get stacked diagnostics v_message = message_text;
    assert v_message = 'Cloud client update required for snapshot saves', 'R4: specific current load guard';
  end;
  begin perform public.beta2_cloud_load(3,'snapshot.synthetic.a','2'); raise exception 'R4: old client loaded native prior';
  exception when invalid_parameter_value then
    get stacked diagnostics v_message = message_text;
    assert v_message = 'Cloud client update required for snapshot saves', 'R4: specific prior load guard';
  end;
  assert pg_temp.snapshot_fingerprint(v_owner) = v_before, 'R4: rejected legacy calls preserve snapshots/evidence/ops/writer/all ledgers';
  perform public.beta2_cloud_lease(3,'snapshot.synthetic.a','takeover','3','1',repeat('b',64));
  bad := pg_temp.snapshot_request('save','snapshot.synthetic.a','old.writer','3','1',repeat('a',64));
  begin perform public.beta2_snapshot_write(bad::text,pg_temp.snapshot_hash(bad::text)); raise exception 'Old writer bypass'; exception when object_not_in_prerequisite_state then null; end;
  assert public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text)) = accepted, 'Lost ack after takeover neither replays nor renews';
  req := pg_temp.snapshot_request('save','snapshot.synthetic.a','native.next','3','2',repeat('b',64));
  accepted := public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text));
  assert accepted->>'revision' = '4', 'Native continuation';
  begin perform public.beta2_snapshot_write((req || '{"operationId":"stale"}')::text,pg_temp.snapshot_hash((req || '{"operationId":"stale"}')::text)); raise exception 'Stale CAS bypass'; exception when serialization_failure then null; end;
  req := pg_temp.snapshot_request('import','snapshot.synthetic.second','native.import','0','0',repeat('c',64));
  perform public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text));
  req := pg_temp.snapshot_request('import','snapshot.synthetic.third','over.slots','0','0',repeat('c',64));
  begin perform public.beta2_snapshot_write(req::text,pg_temp.snapshot_hash(req::text)); raise exception 'Slot bypass'; exception when program_limit_exceeded then null; end;
end $convert$;
reset role;
do $ledger$ begin
  assert not exists(select 1 from public.beta2_evidence_headers where owner_id='b2030000-0000-4000-8000-000000000001'), 'No headers retained';
  assert not exists(select 1 from public.beta2_evidence_pages where owner_id='b2030000-0000-4000-8000-000000000001'), 'No move pages retained';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id='b2030000-0000-4000-8000-000000000001' and campaign_id='snapshot.synthetic.a') = 2, 'Current plus prior, bounded';
  assert (select snapshot_bytes from gamify_private.beta2_cloud_accounts where user_id='b2030000-0000-4000-8000-000000000001') =
    (select sum(gamify_private.beta2_storage_cost(octet_length(content))) from public.beta2_campaign_snapshots where owner_id='b2030000-0000-4000-8000-000000000001'), 'Snapshot ledger exact';
  assert not has_function_privilege('anon','public.beta2_snapshot_write(text,text)','execute'), 'No anonymous writes';
  assert not has_function_privilege('authenticated','gamify_private.beta2_legacy_cloud_write(text,text)','execute'), 'No legacy guard bypass';
end $ledger$;

-- Owner-only native backup/restore uses the same constrained service RPCs.
-- Delete only this synthetic campaign through the player RPC, preserving quota.
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
insert into pg_temp.snapshot_test_rows values('export',public.beta2_backup_export('b2030000-0000-4000-8000-000000000001'));
reset role;
do $bundle$ declare exported jsonb; bundle jsonb; begin
  exported := (select value->'tables' from pg_temp.snapshot_test_rows where key='export');
  bundle := jsonb_build_object('format','beta2.private-backup.v1','ownerId','b2030000-0000-4000-8000-000000000001',
    'campaign',(select v from jsonb_array_elements(exported->'public.beta2_campaigns') v where v->>'campaign_id'='snapshot.synthetic.a'),
    'snapshots',(select jsonb_agg(v) from jsonb_array_elements(exported->'public.beta2_campaign_snapshots') v where v->>'campaign_id'='snapshot.synthetic.a'),
    'header',null,'pages','[]'::jsonb);
  insert into pg_temp.snapshot_test_rows values('bundle',bundle);
end $bundle$;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2030000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
select public.beta2_cloud_lease(3,'snapshot.synthetic.a','release','4','2',repeat('b',64));
select public.beta2_cloud_delete_campaign(3,'snapshot.synthetic.a','4');
reset role;
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
select public.beta2_admin_cloud('configure',null,'{"writesEnabled":false,"enrollmentsEnabled":false}');
do $restore$ declare bundle jsonb; result jsonb; begin
  bundle := (select value from pg_temp.snapshot_test_rows where key='bundle');
  assert public.beta2_backup_restore(bundle::text,pg_temp.snapshot_hash(bundle::text),false)->>'status'='dry-run', 'Native restore dry run';
  result := public.beta2_backup_restore(bundle::text,pg_temp.snapshot_hash(bundle::text),true);
  assert result->>'status'='restored' and result->>'evidencePages'='0' and result->>'revision'='5', 'Native current/prior restore without history';
end $restore$;
select public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2030000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_message text; begin
  assert public.beta2_snapshot_load(3,'snapshot.synthetic.a')->>'revision'='5', 'Restored native head remains readable';
  assert public.beta2_snapshot_load(3,'snapshot.synthetic.a','3')->>'cloudFormatVersion'='3', 'Restored native prior remains readable';
  begin perform public.beta2_cloud_load(3,'snapshot.synthetic.a'); raise exception 'Old client read native bytes';
  exception when invalid_parameter_value then
    get stacked diagnostics v_message = message_text;
    assert v_message = 'Cloud client update required for snapshot saves', 'Specific old-client guard after restore';
  end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2030000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  begin perform public.beta2_snapshot_load(3,'snapshot.synthetic.a'); raise exception 'Cross-account read'; exception when insufficient_privilege then null; end;
end $$;
reset role;
update gamify_private.player_memberships set revoked_at = clock_timestamp() where user_id='b2030000-0000-4000-8000-000000000001';
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2030000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  begin perform public.beta2_snapshot_load(3,'snapshot.synthetic.a'); raise exception 'Revoked read'; exception when insufficient_privilege then null; end;
end $$;
reset role;
-- R5: if ANY earlier assertion failed, this transaction is aborted and this
-- block cannot execute. No PASS exists after ROLLBACK, even in a bad runner.
\if :{?SNAPSHOT_INJECT_FAILURE}
do $injected$ begin raise exception 'R5: deliberate fail-fast runner check'; end $injected$;
\endif
do $success$ begin
  assert current_setting('plpgsql.variable_conflict') = 'error';
  raise notice 'PASS snapshot-only R1-R6 checks complete; rollback follows (disposable DB only)';
end $success$;
rollback;
