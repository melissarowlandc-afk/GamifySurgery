-- B2.2 revision 1: run the ENTIRE file as postgres in the GAME SQL editor.
-- Binding owner decision: live-project, rollback-only SYNTHETIC test.
-- Offline-authored; NOT executed. Never substitute real identities or COMMIT.
-- On any error run ROLLBACK immediately. Exactly one PASS row, at the end.
begin;
set local plpgsql.check_asserts = on;
set local search_path = pg_catalog, public;

create temp table beta2_test_data(key text primary key, value jsonb not null);

-- Deliberately NOT gzip: SQL must accept opaque bytes without interpretation.
-- These fixtures test transport/integrity, not playable content or the codec.
create function pg_temp.b2_pack(p_text text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(convert_to(p_text,'UTF8'),'base64'),E'\n',''),
    'compressedBytes',octet_length(p_text),'compressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'),
    'uncompressedBytes',octet_length(p_text),'uncompressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'));
$$;
create function pg_temp.b2_pack_bytes(p_data bytea) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(p_data,'base64'),E'\n',''),
    'compressedBytes',octet_length(p_data),'compressedSha256',encode(extensions.digest(p_data,'sha256'),'hex'),
    'uncompressedBytes',octet_length(p_data),'uncompressedSha256',encode(extensions.digest(p_data,'sha256'),'hex'));
$$;
create function pg_temp.b2_fixture(p_id text, p_name text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('request',jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'evidenceContractVersion',1,
    'campaign',jsonb_build_object('campaignId',p_id,'name',p_name,'status','resumable'),
    'action','import','operationId','import.'||p_id,'issuedAt',clock_timestamp(),'expectedRevision','0','writerGeneration','0',
    'writerToken',repeat('a',64),'campaignId',p_id,'snapshot',pg_temp.b2_pack('opaque snapshot '||p_id),
    'evidence',jsonb_build_object('header',pg_temp.b2_pack('opaque immutable header '||p_id),'fromRecord',0,'toRecord',1,
      'pages',jsonb_build_array(jsonb_build_object('firstRecord',0,'recordCount',1,'content',pg_temp.b2_pack('opaque sealed page '||p_id)))),
    'usageReceipts','[]'::jsonb));
$$;
create function pg_temp.b2_save(p_fixture jsonb, p_operation text, p_revision text, p_generation text, p_token text) returns jsonb
language sql security definer set search_path = '' as $$
  select (p_fixture->'request') || jsonb_build_object('action','save','operationId',p_operation,'expectedRevision',p_revision,
    'writerGeneration',p_generation,'writerToken',p_token,'issuedAt',clock_timestamp(),
    'evidence',jsonb_build_object('headerSha256',p_fixture->'request'->'evidence'->'header'->>'uncompressedSha256','fromRecord',1,'toRecord',1,'pages','[]'::jsonb));
$$;
do $$ begin execute format('grant usage on schema %I to authenticated',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end $$;
grant select on pg_temp.beta2_test_data to authenticated;
insert into beta2_test_data values
  ('a',pg_temp.b2_fixture('campaign.synthetic.a','Synthetic A')),
  ('a2',pg_temp.b2_fixture('campaign.synthetic.a2','Synthetic archive')),
  ('b',pg_temp.b2_fixture('campaign.synthetic.b','Synthetic B')),
  ('c',pg_temp.b2_fixture('campaign.synthetic.c','Synthetic cascade'));

do $catalog$
declare r record; role_name text; signature text; schema_name text;
begin
  assert (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r' and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\') = 11, 'All eleven Beta 2 tables exist';
  for r in select n.nspname,c.relname,c.oid,c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r' and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\'
  loop
    assert r.relrowsecurity, 'Every new table has RLS';
    foreach role_name in array array['anon','authenticated','service_role'] loop
      assert not has_table_privilege(role_name,r.oid,'select,insert,update,delete'), 'No raw table access, even service tools';
    end loop;
  end loop;
  for r in select n.nspname,p.proname,p.oid,p.prosecdef,p.proconfig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public','gamify_private') and p.proname like 'beta2\_%' escape '\'
  loop
    assert not has_function_privilege('anon',r.oid,'execute'), 'No anonymous execution';
    assert 'search_path=""' = any(r.proconfig), 'Every function fixes empty search_path';
    if r.nspname = 'public' then assert not r.prosecdef, 'Public wrappers are invokers'; end if;
  end loop;
  foreach schema_name in array array['public','gamify_private'] loop
    foreach signature in array array['beta2_cloud_access(integer)','beta2_accept_cloud_notice(integer,text)','beta2_cloud_list(integer)',
      'beta2_cloud_load(integer,text,text)','beta2_cloud_lease(integer,text,text,text,text,text)','beta2_cloud_write(text,text)',
      'beta2_cloud_operation(integer,text)','beta2_delete_my_data(text,text)'] loop
      assert has_function_privilege('authenticated',schema_name || '.' || signature,'execute'), 'Explicit player grants';
      assert not has_function_privilege('service_role',schema_name || '.' || signature,'execute'), 'No service impersonation route';
      assert (select prosecdef from pg_proc where oid = (schema_name || '.' || signature)::regprocedure) = (schema_name = 'gamify_private'), 'Private RPCs are definers';
    end loop;
    assert has_function_privilege('service_role',schema_name || '.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'Explicit owner tool grants';
    assert not has_function_privilege('authenticated',schema_name || '.beta2_admin_cloud(text,uuid,jsonb)','execute'), 'No self-enable';
  end loop;
  assert not has_function_privilege('authenticated','gamify_private.beta2_require_cloud(integer,boolean,boolean)','execute'), 'No guard bypass';
  assert not has_function_privilege('authenticated','gamify_private.beta2_blob(jsonb,integer,integer)','execute'), 'No unguarded byte helper';
  assert not exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='gamify_private'
    and p.proname in ('beta2_gunzip','beta2_bits','beta2_huffman','beta2_symbol','beta2_crc32','beta2_unpack','beta2_canonical','beta2_json_nodes',
      'beta2_patches','beta2_resolve','beta2_projected','beta2_finance','beta2_learning','beta2_game_fields','beta2_validate_checkpoint','beta2_utf16_key','beta2_validate_metadata','beta2_kind_at','beta2_reference_index','beta2_base36')), 'No server content interpreters';
  assert not has_function_privilege('authenticated','gamify_private.beta2_reserve(uuid,bigint,bigint,bigint,bigint)','execute'), 'No quota bypass';
  assert not has_function_privilege('authenticated','gamify_private.beta2_purge_cloud_data()','execute'), 'No player purge';
end $catalog$;


insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
  ('b2000000-0000-4000-8000-000000000001','beta2-a@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b2000000-0000-4000-8000-000000000002','beta2-b@example.invalid',null,now(),'authenticated','authenticated',false,'{"gamify_setup_admitted":true}'),
  ('b2000000-0000-4000-8000-000000000003','beta2-legacy@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b2000000-0000-4000-8000-000000000004','beta2-impostor@example.invalid',null,now(),'authenticated','authenticated',false,'{}'),
  ('b2000000-0000-4000-8000-000000000005','beta2-cascade@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id) select id from auth.users where id in (
  'b2000000-0000-4000-8000-000000000001','b2000000-0000-4000-8000-000000000002','b2000000-0000-4000-8000-000000000003',
  'b2000000-0000-4000-8000-000000000004','b2000000-0000-4000-8000-000000000005');
update auth.users set raw_user_meta_data = '{"gamify_setup_admitted":true}' where id = 'b2000000-0000-4000-8000-000000000004';

-- Actual roles + JWT claims, not only ACL introspection.
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role anon;
do $$ begin
  begin perform public.beta2_cloud_access(3); raise exception 'Anon cloud access allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_admin_cloud('inspect'); raise exception 'Anon admin allowed'; exception when insufficient_privilege then null; end;
  begin perform 1 from public.beta2_campaign_snapshots; raise exception 'Anon raw read allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
do $$ begin
  begin perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}'); raise exception 'Spoofed service claim allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"role":"authenticated"}',true); end $$;
set local role service_role;
do $$ begin
  begin perform public.beta2_admin_cloud('inspect'); raise exception 'Non-service claim allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ begin
  perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
  perform public.beta2_admin_cloud('account','b2000000-0000-4000-8000-000000000001','{"enabled":true}');
  perform public.beta2_admin_cloud('account','b2000000-0000-4000-8000-000000000002','{"enabled":true}');
  perform public.beta2_admin_cloud('account','b2000000-0000-4000-8000-000000000005','{"enabled":true}');
  begin perform public.beta2_admin_cloud('account','b2000000-0000-4000-8000-000000000004','{"enabled":true}'); raise exception 'User metadata admitted'; exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}',true); end $$;
set local role authenticated;
do $$ declare req jsonb; bad jsonb; begin
  assert public.beta2_cloud_access(3)->>'noticeAccepted' = 'false', 'No implicit cloud consent';
  begin perform public.beta2_cloud_list(3); raise exception 'Cloud consent bypass'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_accept_cloud_notice(3,'wrong'); raise exception 'Wrong cloud notice allowed'; exception when invalid_parameter_value then null; end;
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  assert not gamify_private.can_record_usage(), 'Cloud notice does not accept usage';
  begin perform public.beta2_cloud_access(2); raise exception 'Retired row protocol accepted'; exception when invalid_parameter_value then null; end;
  req := (select value->'request' from pg_temp.beta2_test_data where key = 'a');
  bad := jsonb_set(req,'{evidence,header,compressedSha256}',to_jsonb(repeat('0',64)));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Import header digest mismatch allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,header,uncompressedBytes}','6000000');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Aggregate declared 6 MB ceiling bypass'; exception when program_limit_exceeded then null; end;
  bad := req || jsonb_build_object('usageReceipts',jsonb_build_array(jsonb_build_object('kind','question')));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Import minted historical counts'; exception when invalid_parameter_value then null; end;
  assert public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'))->>'revision' = '1', 'Atomic import';
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns') = 1, 'Own summary';
  assert public.beta2_cloud_load(3,'campaign.synthetic.a')->'snapshot' = req->'snapshot', 'Opaque bytes and both declared hashes round-trip unchanged';
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2000000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare req jsonb; begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  req := (select value->'request' from pg_temp.beta2_test_data where key = 'b');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns') = 1, 'B has only B';
  begin perform public.beta2_cloud_load(3,'campaign.synthetic.a'); raise exception 'B loaded A'; exception when insufficient_privilege then null; end;
  assert public.beta2_cloud_operation(3,'import.campaign.synthetic.a')->>'status' = 'unknown', 'B cannot probe A receipt';
end $$;
reset role;

-- Grant only inside this uncommitted test to exercise real RLS as well as the
-- production grant denial. Other sessions never see these temporary grants.
grant select on public.beta2_campaigns,public.beta2_campaign_snapshots,public.beta2_evidence_headers,public.beta2_evidence_pages to authenticated;
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal2"}',true); end $$;
insert into gamify_private.usage_owners values('b2000000-0000-4000-8000-000000000001');
set local role authenticated;
do $$ begin
  assert (select count(*) from public.beta2_campaigns) = 1, 'A and count-report owner see only A';
  assert (select count(*) from public.beta2_campaign_snapshots) = 1, 'Snapshot RLS';
  assert (select count(*) from public.beta2_evidence_headers) = 1, 'Header RLS';
  assert (select count(*) from public.beta2_evidence_pages) = 1, 'Page RLS';
  assert not exists(select 1 from public.beta2_evidence_pages where campaign_id = 'campaign.synthetic.b'), 'Guessed child isolation';
  begin delete from public.beta2_campaigns; raise exception 'Direct deletion allowed'; exception when insufficient_privilege then null; end;
  begin update public.beta2_campaigns set current_revision = 999; raise exception 'Direct revision write allowed'; exception when insufficient_privilege then null; end;
  begin perform gamify_private.beta2_require_cloud(3); raise exception 'Private guard callable'; exception when insufficient_privilege then null; end;
end $$;
reset role;
revoke select on public.beta2_campaigns,public.beta2_campaign_snapshots,public.beta2_evidence_headers,public.beta2_evidence_pages from authenticated;

set local role authenticated;
do $fencing$
declare req jsonb; receipt jsonb; lease jsonb; started timestamptz := clock_timestamp(); fixture jsonb;
begin
  fixture := (select value from pg_temp.beta2_test_data where key = 'a');
  lease := public.beta2_cloud_lease(3,'campaign.synthetic.a','takeover','1','1',repeat('b',64));
  assert lease->>'writerGeneration' = '2', 'Takeover advances generation without a save';
  assert (lease->>'expiresAt')::timestamptz >= started + interval '60 seconds'
    and (lease->>'expiresAt')::timestamptz <= clock_timestamp() + interval '60 seconds', 'Server wall-clock 60s lease';
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','1','1',repeat('a',64)); raise exception 'Old renewal allowed'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','release','1','1',repeat('a',64)); raise exception 'Old release allowed'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','takeover','1','1',repeat('c',64)); raise exception 'Stale takeover allowed'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','acquire','1','2',repeat('c',64)); raise exception 'Implicit takeover allowed'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','1','2',repeat('a',64)); raise exception 'Wrong token at current generation allowed'; exception when object_not_in_prerequisite_state then null; end;
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','takeover','0','2',repeat('c',64)); raise exception 'Stale lease base revision allowed'; exception when serialization_failure then null; end;
  req := fixture->'request';
  receipt := public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  assert receipt->>'revision' = '1' and receipt->>'writerGeneration' = '1', 'Original receipt after takeover, no lease resurrection';
  req := req || '{"issuedAt":"2026-01-01T00:00:00Z"}';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Changed ID reuse allowed'; exception when invalid_parameter_value then null; end;
  req := pg_temp.b2_save(fixture,'save.2','1','2',repeat('b',64));
  assert public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'))->>'revision' = '2', 'Revision chosen by server';
  req := req || '{"operationId":"stale.revision"}';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Stale base allowed'; exception when serialization_failure then null; end;
  req := pg_temp.b2_save(fixture,'stale.generation','2','1',repeat('a',64));
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Stale generation allowed'; exception when object_not_in_prerequisite_state then null; end;
end $fencing$;
reset role;
do $$ begin
  assert (select current_revision = 2 and prior_revision = 1 and writer_generation = 2 from public.beta2_campaigns where owner_id = 'b2000000-0000-4000-8000-000000000001' and campaign_id = 'campaign.synthetic.a'), 'Pointers/revision/generation';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id = 'b2000000-0000-4000-8000-000000000001') = 2, 'Current plus client-verifiable prior';
end $$;
update gamify_private.beta2_campaign_writers set expires_at = clock_timestamp() - interval '1 second' where owner_id = 'b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; lease jsonb; begin
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','2','2',repeat('b',64)); raise exception 'Expired renewal allowed'; exception when object_not_in_prerequisite_state then null; end;
  req := pg_temp.b2_save((select value from pg_temp.beta2_test_data where key='a'),'expired.save','2','2',repeat('b',64));
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Expired save allowed'; exception when object_not_in_prerequisite_state then null; end;
  lease := public.beta2_cloud_lease(3,'campaign.synthetic.a','acquire','2','2',repeat('c',64));
  assert lease->>'writerGeneration' = '3', 'Expired reacquisition increments fencing';
  assert public.beta2_cloud_lease(3,'campaign.synthetic.a','acquire','2','2',repeat('c',64))->>'expiresAt' = lease->>'expiresAt', 'Lost acquire response does not extend the lease';
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','release','2','2',repeat('b',64)); raise exception 'Delayed release allowed'; exception when object_not_in_prerequisite_state then null; end;
  req := pg_temp.b2_save((select value from pg_temp.beta2_test_data where key='a'),'save.3','2','3',repeat('c',64));
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  assert public.beta2_cloud_load(3,'campaign.synthetic.a','2')->>'revision' = '2', 'Prior accepted revision remains loadable';
  begin perform public.beta2_cloud_load(3,'campaign.synthetic.a','1'); raise exception 'Third retained copy exists'; exception when invalid_parameter_value then null; end;
  perform public.accept_usage_notice('beta1.usage.v1');
end $$;
reset role;


-- One new sealed page + a representative 2 MB request + optional ALREADY-issued
-- usage receipt. Failed late Beta 1 ingest must undo page inserts/reservations.
do $$ declare fixture jsonb; req jsonb; begin
  fixture := (select value from beta2_test_data where key='a');
  req := pg_temp.b2_save(fixture,'save.4','3','3',repeat('c',64));
  -- Native set-based fixture generation occurs BEFORE the timed RPC. 93,750
  -- independent MD5 blocks produce 1.5 MB of hard-to-compress opaque bytes;
  -- this also exercises TOAST/WAL rather than a repeated-character shortcut.
  req := req || jsonb_build_object('snapshot',(select pg_temp.b2_pack_bytes(string_agg(decode(md5(i::text),'hex'),''::bytea order by i)) from generate_series(1,93750) g(i)),
    'evidence',jsonb_build_object('headerSha256',fixture->'request'->'evidence'->'header'->>'uncompressedSha256',
      'fromRecord',1,'toRecord',2,'pages',jsonb_build_array(jsonb_build_object('firstRecord',1,'recordCount',1,'content',pg_temp.b2_pack('new opaque sealed page')))),
    'usageReceipts',jsonb_build_array(jsonb_build_object('receipt_id','b2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','kind','question','occurred_at',now())));
  insert into beta2_test_data values('advance',jsonb_build_object('request',req));
  insert into beta2_test_data values('before.atomic',(select to_jsonb(a) from gamify_private.beta2_cloud_accounts a where user_id='b2000000-0000-4000-8000-000000000001'));
end $$;
set local role authenticated;
do $atomic$
declare req jsonb; bad jsonb;
begin
  req := (select value->'request' from pg_temp.beta2_test_data where key='advance');
  bad := jsonb_set(req,'{usageReceipts,0,receipt_id}','"invalid-uuid"');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Invalid usage did not roll back'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,fromRecord}','0');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Accepted prefix rewrite allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,headerSha256}',to_jsonb(repeat('0',64)));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Header mutation allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{snapshot,compressedSha256}',to_jsonb(repeat('0',64)));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Compressed hash mismatch allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{snapshot,compressedBytes}','1500001');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Declared/actual compressed length mismatch allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,pages,0,content,compressedSha256}',to_jsonb(repeat('0',64)));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Evidence digest mismatch allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{snapshot,encoding}','"deflate"');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Unsupported encoding envelope allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{snapshot,dataBase64}','"!!!!"');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Invalid base64 envelope allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{snapshot,uncompressedBytes}','3000001');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Declared snapshot ceiling bypass'; exception when program_limit_exceeded then null; end;
  bad := jsonb_set(req,'{evidence,pages,0,content,uncompressedBytes}','1000001');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'New declared evidence ceiling bypass'; exception when program_limit_exceeded then null; end;
  bad := jsonb_set(req,'{snapshot,compressedBytes}','3000001');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Compressed snapshot ceiling bypass'; exception when program_limit_exceeded then null; end;
  bad := jsonb_set(req,'{evidence,pages,0,recordCount}','50001');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Record count bound bypass'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,pages,0,firstRecord}','2');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Evidence page gap allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidence,pages}',(select jsonb_agg(req->'evidence'->'pages'->0) from generate_series(1,513)));
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Page count bound bypass'; exception when program_limit_exceeded then null; end;
  bad := jsonb_set(req,'{snapshot}',(req->'snapshot')-'compressedSha256');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Missing compressed digest allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{cloudFormatVersion}','1');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Unsupported format version allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{evidenceContractVersion}','2');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Unsupported evidence contract allowed'; exception when invalid_parameter_value then null; end;
  bad := jsonb_set(req,'{campaign,campaignId}','"another-campaign"');
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Campaign envelope mismatch allowed'; exception when invalid_parameter_value then null; end;
  bad := req || '{"unexpected":true}';
  begin perform public.beta2_cloud_write(bad::text,encode(sha256(convert_to(bad::text,'UTF8')),'hex')); raise exception 'Unknown envelope key allowed'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_write(req::text,repeat('0',64)); raise exception 'Exact request hash bypass'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_write(repeat('x',6000001),repeat('0',64)); raise exception 'Body ceiling bypass'; exception when invalid_parameter_value then null; end;
end $atomic$;
reset role;
do $$ begin
  assert (select to_jsonb(a) from gamify_private.beta2_cloud_accounts a where user_id='b2000000-0000-4000-8000-000000000001')
    = (select value from beta2_test_data where key='before.atomic'), 'Failed writes roll back all quota reservations';
  assert (select current_revision from public.beta2_campaigns where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a') = 3, 'No failed snapshot pointer';
  assert (select count(*) from public.beta2_evidence_pages where owner_id='b2000000-0000-4000-8000-000000000001') = 1, 'No partial page insertion';
  assert not exists(select 1 from gamify_private.beta2_campaign_operations where owner_id='b2000000-0000-4000-8000-000000000001' and operation_id='save.4'), 'No failed operation receipt';
  assert not exists(select 1 from public.player_usage_days where user_id='b2000000-0000-4000-8000-000000000001'), 'No partial count';
end $$;
set local role authenticated;
do $$ declare req jsonb; result jsonb; request_text text; request_hash text; started timestamptz; elapsed interval; begin
  req := (select value->'request' from pg_temp.beta2_test_data where key='advance');
  request_text := req::text; request_hash := encode(sha256(convert_to(request_text,'UTF8')),'hex');
  assert octet_length(request_text) between 1900000 and 2100000, 'Representative 2 MB request envelope';
  started := clock_timestamp(); result := public.beta2_cloud_write(request_text,request_hash); elapsed := clock_timestamp()-started;
  assert elapsed < interval '1 second', '2 MB cloud write must complete below one second without contention';
  raise notice 'B2.2 2 MB cloud write elapsed_ms=%',round(extract(epoch from elapsed)*1000,2);
  assert result->>'revision' = '4' and result->>'evidenceHighWater' = '2', 'Evidence/count/snapshot accepted together';
  assert public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')) = result, 'Lost write response returns original receipt';
  perform public.ingest_player_usage(req->'usageReceipts','first-scored-patient-and-employee.v1');
  assert public.beta2_cloud_load(3,'campaign.synthetic.a','3')->'evidence'->'pages'->0->>'recordCount' = '1', 'Prior snapshot uses original sealed prefix';
  assert jsonb_array_length(public.beta2_cloud_load(3,'campaign.synthetic.a','3')->'evidence'->'pages') = 1, 'Prior load excludes later evidence';
end $$;
reset role;
do $$ begin
  assert (select sum(question_count) from public.player_usage_days where user_id='b2000000-0000-4000-8000-000000000001') = 1, 'Cloud and local outbox share one dedup path';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id='b2000000-0000-4000-8000-000000000001') = 2, 'Third copy pruned atomically';
end $$;

delete from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; duplicate jsonb; begin
  duplicate := pg_temp.b2_fixture('campaign.synthetic.collision','synthetic a')->'request';
  begin perform public.beta2_cloud_write(duplicate::text,encode(sha256(convert_to(duplicate::text,'UTF8')),'hex')); raise exception 'Normalized name collision allowed'; exception when invalid_parameter_value then null; end;
  req := (select value->'request' from pg_temp.beta2_test_data where key='a2');
  -- Archives count toward the SAME two slots.
  req := jsonb_set(req,'{campaign,status}','"archived"');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  req := pg_temp.b2_fixture('campaign.synthetic.third','Third synthetic')->'request';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Third cloud campaign allowed'; exception when program_limit_exceeded then null; end;
  begin perform public.request_usage_data_deletion(); raise exception 'Legacy wording deleted cloud'; exception when object_not_in_prerequisite_state then null; end;
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns') = 2, 'Legacy deletion leaves campaigns intact';
end $$;
reset role;
do $$ declare req jsonb; begin
  req := (select value->'request' from beta2_test_data where key='advance');
  req := req || jsonb_build_object('operationId','capacity.test','expectedRevision','4','usageReceipts','[]'::jsonb,
    'evidence',jsonb_build_object('headerSha256',req->'evidence'->>'headerSha256','fromRecord',2,'toRecord',2,'pages','[]'::jsonb));
  insert into beta2_test_data values('current',req);
  insert into beta2_test_data values('growth',req || jsonb_build_object('evidence',jsonb_build_object(
    'headerSha256',req->'evidence'->>'headerSha256','fromRecord',2,'toRecord',3,'pages',jsonb_build_array(jsonb_build_object(
      'firstRecord',2,'recordCount',1,'content',pg_temp.b2_pack('more opaque evidence'))))));
  insert into beta2_test_data values('quota.original',(select to_jsonb(a) from gamify_private.beta2_cloud_accounts a where user_id='b2000000-0000-4000-8000-000000000001'));
  insert into beta2_test_data values('campaign.original',(select to_jsonb(c) from public.beta2_campaigns c where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a'));
end $$;
update gamify_private.beta2_cloud_accounts set auxiliary_bytes=8000000-snapshot_bytes where user_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; begin
  req := (select value from pg_temp.beta2_test_data where key='current');
  assert (public.beta2_cloud_list(3)->'quota'->>'warning')::boolean, 'Early quota warning';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception '8 MB snapshot/metadata allowance bypass'; exception when program_limit_exceeded then null; end;
end $$;
reset role;
update gamify_private.beta2_cloud_accounts set auxiliary_bytes=(select (value->>'auxiliary_bytes')::bigint from beta2_test_data where key='quota.original'),evidence_bytes=1999999
  where user_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; begin
  req := (select value from pg_temp.beta2_test_data where key='growth');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception '2 MB evidence allowance bypass'; exception when program_limit_exceeded then null; end;
end $$;
reset role;
update gamify_private.beta2_cloud_accounts set evidence_bytes=(select (value->>'evidence_bytes')::bigint from beta2_test_data where key='quota.original') where user_id='b2000000-0000-4000-8000-000000000001';
update public.beta2_campaigns set evidence_bytes=999999 where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a';
set local role authenticated;
do $$ declare req jsonb; begin
  req := (select value from pg_temp.beta2_test_data where key='growth');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception '1 MB per-campaign evidence bypass'; exception when program_limit_exceeded then null; end;
end $$;
reset role;
update public.beta2_campaigns set evidence_bytes=(select (value->>'evidence_bytes')::bigint from beta2_test_data where key='campaign.original') where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a';

-- Global physical/dead-row reserve and rollout gates. No capacity is fabricated
-- for the live DB: if its REAL size is already near 400 MB, setup above fails.
insert into beta2_test_data values('dead.original',to_jsonb((select dead_bytes_estimate from gamify_private.beta2_cloud_quota where singleton)));
update gamify_private.beta2_cloud_quota set dead_bytes_estimate=400000000 where singleton;
set local role authenticated;
do $$ declare req jsonb; begin
  req := (select value from pg_temp.beta2_test_data where key='current');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Global reserve bypass'; exception when program_limit_exceeded then null; end;
end $$;
reset role;
update gamify_private.beta2_cloud_quota set dead_bytes_estimate=(select (value #>> '{}')::bigint from beta2_test_data where key='dead.original'),writes_enabled=false where singleton;
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','4','3',repeat('c',64)); raise exception 'Disabled writes allowed'; exception when object_not_in_prerequisite_state then null; end;
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns') = 2, 'Rollback gate preserves reads';
end $$;
reset role;
update gamify_private.beta2_cloud_quota set writes_enabled=true where singleton;

-- Identical retries consume request budget without consuming another revision.
delete from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; i integer; begin
  req := (select value->'request' from pg_temp.beta2_test_data where key='a');
  for i in 1..30 loop perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); end loop;
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Mutation throttle bypass';
    exception when sqlstate 'P0001' then assert sqlerrm = 'Cloud request rate limit', 'Expected mutation throttle'; end;
end $$;
reset role;
delete from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; i integer; begin
  perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','4','3',repeat('c',64));
  perform public.beta2_cloud_lease(3,'campaign.synthetic.a2','renew','1','1',repeat('a',64));
  for i in 1..6 loop
    req := (select value from pg_temp.beta2_test_data where key='current') || jsonb_build_object('operationId','rate.a.'||i,'expectedRevision',(3+i)::text);
    perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  end loop;
  req := req || '{"operationId":"rate.campaign.denied","expectedRevision":"10"}';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Campaign checkpoint throttle bypass';
    exception when sqlstate 'P0001' then assert sqlerrm = 'Cloud request rate limit', 'Expected campaign throttle'; end;
  for i in 1..6 loop
    req := pg_temp.b2_save((select value from pg_temp.beta2_test_data where key='a2'),'rate.a2.'||i,i::text,'1',repeat('a',64));
    perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  end loop;
  req := req || '{"operationId":"rate.account.denied","expectedRevision":"7"}';
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Account checkpoint throttle bypass';
    exception when sqlstate 'P0001' then assert sqlerrm = 'Cloud request rate limit', 'Expected account throttle'; end;
end $$;
reset role;
do $$ begin
  assert (select calls from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001' and bucket='checkpoint') = 12, 'Twelve account checkpoints allowed';
end $$;
delete from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare i integer; begin
  for i in 1..6 loop perform public.beta2_cloud_load(3,'campaign.synthetic.a'); end loop;
  begin perform public.beta2_cloud_load(3,'campaign.synthetic.a'); raise exception 'Full load throttle bypass';
    exception when sqlstate 'P0001' then assert sqlerrm = 'Cloud request rate limit', 'Expected load throttle'; end;
  for i in 1..120 loop perform public.beta2_cloud_list(3); end loop;
  begin perform public.beta2_cloud_list(3); raise exception 'Metadata throttle bypass';
    exception when sqlstate 'P0001' then assert sqlerrm = 'Cloud request rate limit', 'Expected metadata throttle'; end;
end $$;
reset role;

-- Terminal operation/rate retention never applies the Beta 1 ninety-day policy
-- to functional campaigns, prior snapshots, learning or sealed evidence.
update gamify_private.beta2_campaign_operations set accepted_at=clock_timestamp()-interval '9 days'
  where owner_id='b2000000-0000-4000-8000-000000000001' and operation_id in ('save.2','import.campaign.synthetic.a');
update gamify_private.beta2_cloud_rates set window_start=clock_timestamp()-interval '9 days' where owner_id='b2000000-0000-4000-8000-000000000001';
update gamify_private.beta2_campaign_writers set expires_at=clock_timestamp()-interval '1 second' where owner_id='b2000000-0000-4000-8000-000000000001';
do $$ begin perform gamify_private.purge_beta1_retained_data(); end $$;
do $$ begin
  assert not exists(select 1 from gamify_private.beta2_campaign_operations where owner_id='b2000000-0000-4000-8000-000000000001' and operation_id='save.2'), 'Terminal ordinary receipt purged';
  assert exists(select 1 from gamify_private.beta2_campaign_operations where owner_id='b2000000-0000-4000-8000-000000000001' and operation_id='import.campaign.synthetic.a'), 'Import identity retained for campaign life';
  assert not exists(select 1 from gamify_private.beta2_cloud_rates where owner_id='b2000000-0000-4000-8000-000000000001'), 'Old rate rows purged';
  assert (select count(*) from public.beta2_campaigns where owner_id='b2000000-0000-4000-8000-000000000001') = 2, 'Archives never expire';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id='b2000000-0000-4000-8000-000000000001') = 4, 'Two revisions per campaign survive purge';
  assert (select generation=3 and token_sha256 is null from gamify_private.beta2_campaign_writers where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a'), 'Dead token removed, generation retained';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton) =
    (select coalesce(sum(snapshot_bytes+evidence_bytes+auxiliary_bytes),0) from gamify_private.beta2_cloud_accounts)
      + (select count(*)*1024 from gamify_private.beta2_cloud_deletions), 'Reservation accounting reconciles';
end $$;
-- Move only synthetic revision metadata above JS's exact-integer boundary,
-- then prove an ACTUAL RPC increment/load/receipt remains a decimal string.
update public.beta2_campaign_snapshots set revision=9007199254740992+(revision-9)
  where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a';
update public.beta2_campaigns set current_revision=9007199254740993,prior_revision=9007199254740992
  where owner_id='b2000000-0000-4000-8000-000000000001' and campaign_id='campaign.synthetic.a';
set local role authenticated;
do $$ declare req jsonb; begin
  perform public.beta2_cloud_lease(3,'campaign.synthetic.a','acquire','9007199254740993','3',repeat('d',64));
  req := (select value from pg_temp.beta2_test_data where key='current') || jsonb_build_object('operationId','bigint.save','expectedRevision','9007199254740993','writerGeneration','4','writerToken',repeat('d',64));
  assert public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'))->'revision' = '"9007199254740994"'::jsonb, 'Exact bigint RPC revision increment';
  assert public.beta2_cloud_load(3,'campaign.synthetic.a')->>'revision'='9007199254740994', 'Exact bigint load';
  assert (public.beta2_cloud_lease(3,'campaign.synthetic.a','release','9007199254740994','4',repeat('d',64))->>'released')::boolean, 'Save and release succeeds';
  begin perform public.beta2_cloud_lease(3,'campaign.synthetic.a','renew','9007199254740994','4',repeat('d',64)); raise exception 'Released writer renewed'; exception when object_not_in_prerequisite_state then null; end;
  assert public.beta2_cloud_operation(3,'save.2')->>'status' = 'unknown', 'Expired outcome explicitly unknown';
  req := (select value from pg_temp.beta2_test_data where key='current') || jsonb_build_object('operationId','save.2','issuedAt',clock_timestamp()-interval '9 days');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Expired unknown operation replayed';
    exception when invalid_parameter_value then assert sqlerrm='Expired or future cloud operation', 'Adapter operation-expiry error preserved'; end;
  begin perform public.beta2_delete_my_data('usage-only','beta2.cloud.v1'); raise exception 'Missing full confirmation accepted'; exception when invalid_parameter_value then null; end;
  perform public.submit_tester_feedback('b2ffffff-ffff-4fff-8fff-ffffffffffff','Synthetic deletion check','synthetic','synthetic',0,'desktop');
  insert into public.question_flags(flag_id,question_id,question_variant_id,question_variant_version,concept_id,concept_version,
    clinical_release_id,content_version,app_version,displayed_choice_order,flagged_at)
    values('b2eeeeee-eeee-4eee-8eee-eeeeeeeeeeee','synthetic','synthetic','1','synthetic','1','synthetic','1','synthetic',array['a','b'],now());
end $$;
reset role;

-- Cloud revocation/ban/Auth removal are checked against current tables, even
-- when the old JWT still looks valid. Revoked users retain the deletion route.
update auth.users set banned_until=clock_timestamp()+interval '1 day' where id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_list(3); raise exception 'Banned read allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
update auth.users set banned_until=null where id='b2000000-0000-4000-8000-000000000001';
update gamify_private.player_memberships set revoked_at=clock_timestamp() where user_id='b2000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare req jsonb; begin
  begin perform public.beta2_cloud_list(3); raise exception 'Revoked read allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1'); raise exception 'Revoked consent restored'; exception when insufficient_privilege then null; end;
  perform public.beta2_delete_my_data('all-account-data.v1','beta2.cloud.v1');
  perform public.beta2_delete_my_data('all-account-data.v1','beta2.cloud.v1');
  begin perform public.beta2_cloud_access(3); raise exception 'Deleted access allowed'; exception when insufficient_privilege then null; end;
  req := (select value->'request' from pg_temp.beta2_test_data where key='a');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Deleted import retry recreated data'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ declare r record; absent boolean; begin
  for r in select n.nspname,c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind='r'
    and n.nspname in ('public','gamify_private') and c.relname in ('beta2_campaigns','beta2_campaign_snapshots','beta2_evidence_headers','beta2_evidence_pages','beta2_campaign_writers','beta2_campaign_operations','beta2_cloud_rates')
  loop
    execute format('select not exists(select 1 from %I.%I where owner_id=$1)',r.nspname,r.relname) into absent using 'b2000000-0000-4000-8000-000000000001'::uuid;
    assert absent, 'No cloud child rows after deletion';
  end loop;
end $$;
-- Explicit scalar checks also cover account/consent and the existing Beta 1 lane.
do $$ begin
  assert not exists(select 1 from gamify_private.beta2_cloud_accounts where user_id='b2000000-0000-4000-8000-000000000001'), 'Account quota removed';
  assert not exists(select 1 from gamify_private.beta2_cloud_notices where user_id='b2000000-0000-4000-8000-000000000001'), 'Cloud consent removed';
  assert not exists(select 1 from public.player_usage_days where user_id='b2000000-0000-4000-8000-000000000001'), 'Usage removed';
  assert not exists(select 1 from gamify_private.usage_receipts where user_id='b2000000-0000-4000-8000-000000000001'), 'Count receipts removed';
  assert not exists(select 1 from public.question_flags where user_id='b2000000-0000-4000-8000-000000000001'), 'Flags removed by new full-data endpoint';
  assert not exists(select 1 from public.tester_feedback where user_id='b2000000-0000-4000-8000-000000000001'), 'Feedback removed by new full-data endpoint';
  assert (select deletion_requested_at is not null from gamify_private.player_memberships where user_id='b2000000-0000-4000-8000-000000000001'), 'Protected deletion blocker remains';
  assert exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b2000000-0000-4000-8000-000000000001') and purge_after>clock_timestamp()+interval '14 days'), 'Deletion ledger outlives backup window';
  assert exists(select 1 from public.beta2_campaigns where owner_id='b2000000-0000-4000-8000-000000000002'), 'B survives A deletion';
end $$;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2000000-0000-4000-8000-000000000003","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin perform public.request_usage_data_deletion(); assert public.get_usage_access()->>'deletion_requested'='true', 'Non-enrolled Beta 1 deletion retains original behavior'; end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2000000-0000-4000-8000-000000000005","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare req jsonb; begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1'); req := (select value->'request' from pg_temp.beta2_test_data where key='c');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
end $$;
reset role;
delete from auth.users where id in ('b2000000-0000-4000-8000-000000000001','b2000000-0000-4000-8000-000000000005');
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_list(3); raise exception 'Removed Auth JWT accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from public.beta2_campaigns where owner_id='b2000000-0000-4000-8000-000000000005'), 'Auth cascade removes campaigns';
  assert not exists(select 1 from public.beta2_evidence_pages where owner_id='b2000000-0000-4000-8000-000000000005'), 'Auth cascade removes evidence';
  assert exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b2000000-0000-4000-8000-000000000005')), 'Auth cascade leaves restore suppression ledger';
  assert exists(select 1 from public.beta2_campaigns where owner_id='b2000000-0000-4000-8000-000000000002'), 'B survives other Auth cascades';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton) =
    (select coalesce(sum(snapshot_bytes+evidence_bytes+auxiliary_bytes),0) from gamify_private.beta2_cloud_accounts)
      + (select count(*)*1024 from gamify_private.beta2_cloud_deletions), 'Final accounting reconciles';
end $$;


-- Age only A's synthetic deletion marker. The real purge is transactional and
-- may also visit expired live metadata; no change survives this final rollback.
update gamify_private.beta2_cloud_deletions set purge_after=clock_timestamp()-interval '1 second'
  where subject_sha256=gamify_private.beta2_hash('b2000000-0000-4000-8000-000000000001');
do $$ begin
  perform gamify_private.beta2_purge_cloud_data();
  assert not exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b2000000-0000-4000-8000-000000000001')), 'Terminal deletion marker expires';
  assert exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256=gamify_private.beta2_hash('b2000000-0000-4000-8000-000000000005')), 'Unexpired cascade marker retained';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton) =
    (select coalesce(sum(snapshot_bytes+evidence_bytes+auxiliary_bytes),0) from gamify_private.beta2_cloud_accounts)
      + (select count(*)*1024 from gamify_private.beta2_cloud_deletions), 'Post-retention accounting reconciles';
end $$;

select 'PASS: Beta 2 synthetic isolation/fencing/leases/opaque-integrity/atomicity/quotas/limits/retention/deletion/grants/search_path checks; rollback follows' as result;
rollback;
