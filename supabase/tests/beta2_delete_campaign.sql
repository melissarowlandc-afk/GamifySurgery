-- Run the ENTIRE file as postgres after the new migration. Synthetic only.
-- Rollback-only: no real identities, no COMMIT. On any error run ROLLBACK.
-- Offline-authored; manager executes. Exactly one PASS row, at the end.
begin;
set local plpgsql.check_asserts = on;
set local search_path = pg_catalog, public;

create temp table beta2_delete_test(key text primary key, value jsonb not null);
create function pg_temp.b2_delete_pack(p_text text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(convert_to(p_text,'UTF8'),'base64'),E'\n',''),
    'compressedBytes',octet_length(p_text),'compressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'),
    'uncompressedBytes',octet_length(p_text),'uncompressedSha256',encode(extensions.digest(convert_to(p_text,'UTF8'),'sha256'),'hex'));
$$;
-- Deliberately opaque bytes, matching the existing SQL contract test style.
create function pg_temp.b2_delete_fixture(p_id text, p_name text) returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'evidenceContractVersion',1,
    'campaign',jsonb_build_object('campaignId',p_id,'name',p_name,'status','resumable'),
    'action','import','operationId','import.'||p_id,'issuedAt',clock_timestamp(),'expectedRevision','0','writerGeneration','0',
    'writerToken',repeat('a',64),'campaignId',p_id,'snapshot',pg_temp.b2_delete_pack('opaque snapshot '||p_id),
    'evidence',jsonb_build_object('header',pg_temp.b2_delete_pack('opaque header '||p_id),'fromRecord',0,'toRecord',1,
      'pages',jsonb_build_array(jsonb_build_object('firstRecord',0,'recordCount',1,'content',pg_temp.b2_delete_pack('opaque page '||p_id)))),
    'usageReceipts','[]'::jsonb);
$$;
do $$ begin execute format('grant usage on schema %I to authenticated',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end $$;
grant select on pg_temp.beta2_delete_test to authenticated;
insert into beta2_delete_test values
  ('first', pg_temp.b2_delete_fixture('campaign.delete.synthetic.first','Delete synthetic first')),
  ('keep', pg_temp.b2_delete_fixture('campaign.delete.synthetic.keep','Keep synthetic second')),
  ('new', pg_temp.b2_delete_fixture('campaign.delete.synthetic.new','New synthetic replacement')),
  ('other', pg_temp.b2_delete_fixture('campaign.delete.synthetic.first','Other account same ID'));

do $catalog$
declare schema_name text; signature text; p record;
begin
  foreach schema_name in array array['public','gamify_private'] loop
    signature := schema_name || '.beta2_cloud_delete_campaign(integer,text,text)';
    assert has_function_privilege('authenticated',signature,'execute'), 'Explicit authenticated grant';
    assert not has_function_privilege('anon',signature,'execute'), 'No anonymous delete route';
    assert not has_function_privilege('service_role',signature,'execute'), 'No service impersonation route';
    select prosecdef,proconfig into p from pg_proc where oid=signature::regprocedure;
    assert p.prosecdef = (schema_name = 'gamify_private'), 'Public invoker / private definer';
    assert 'search_path=""' = any(p.proconfig), 'Empty fixed search path';
  end loop;
  assert not has_table_privilege('authenticated','public.beta2_campaigns','delete'), 'No direct table deletion grant';
end $catalog$;

insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
  ('b2260000-0000-4000-8000-000000000001','beta2-delete-a@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
  ('b2260000-0000-4000-8000-000000000002','beta2-delete-b@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id) values
  ('b2260000-0000-4000-8000-000000000001'),('b2260000-0000-4000-8000-000000000002');
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ begin
  perform public.beta2_admin_cloud('configure',null,'{"writesEnabled":true,"enrollmentsEnabled":true}');
  perform public.beta2_admin_cloud('account','b2260000-0000-4000-8000-000000000001','{"enabled":true}');
  perform public.beta2_admin_cloud('account','b2260000-0000-4000-8000-000000000002','{"enabled":true}');
  begin perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','1'); raise exception 'Service role delete allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
do $$ begin
  begin perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','1'); raise exception 'Anon delete allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2260000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}',true); end $$;
set local role authenticated;
do $$ declare req jsonb; saved jsonb; begin
  begin perform public.beta2_cloud_delete_campaign(3,'missing','1'); raise exception 'Notice bypass'; exception when insufficient_privilege then null; end;
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  begin perform public.beta2_cloud_delete_campaign(2,'missing','1'); raise exception 'Protocol bypass'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_delete_campaign(3,E'bad\nid','1'); raise exception 'Control ID allowed'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_delete_campaign(3,'missing','0'); raise exception 'Zero revision allowed'; exception when invalid_parameter_value then null; end;
  begin perform public.beta2_cloud_delete_campaign(3,'missing','01'); raise exception 'Noncanonical revision allowed'; exception when invalid_parameter_value then null; end;
  req := (select value from pg_temp.beta2_delete_test where key='first');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  saved := req || jsonb_build_object('action','save','operationId','save.delete.synthetic.first','expectedRevision','1','writerGeneration','1',
    'issuedAt',clock_timestamp(),'evidence',jsonb_build_object('headerSha256',req->'evidence'->'header'->>'uncompressedSha256','fromRecord',1,'toRecord',1,'pages','[]'::jsonb));
  assert public.beta2_cloud_write(saved::text,encode(sha256(convert_to(saved::text,'UTF8')),'hex'))->>'revision'='2', 'Current and prior snapshots exist';
  req := (select value from pg_temp.beta2_delete_test where key='keep');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns')=2, 'Both slots occupied';
  req := (select value from pg_temp.beta2_delete_test where key='new');
  begin perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex')); raise exception 'Third slot allowed'; exception when program_limit_exceeded then null; end;
  begin perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','2'); raise exception 'Live lease deleted'; exception when object_not_in_prerequisite_state then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"b2260000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare req jsonb; begin
  perform public.beta2_accept_cloud_notice(3,'beta2.cloud.v1');
  -- Missing own IDs are idempotent and cannot reveal or delete another owner.
  assert public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.keep','1')->>'deleted'='true', 'Unknown own ID is harmless';
  req := (select value from pg_temp.beta2_delete_test where key='other');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
end $$;
reset role;
do $$ begin
  assert exists(select 1 from public.beta2_campaigns where owner_id='b2260000-0000-4000-8000-000000000001' and campaign_id='campaign.delete.synthetic.keep'), 'B cannot delete A';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id='b2260000-0000-4000-8000-000000000001' and campaign_id='campaign.delete.synthetic.first')=2, 'Live-lease refusal preserves current/prior';
end $$;

-- Guard failures must not alter campaigns, even for idempotent absent IDs.
do $$ begin perform set_config('request.jwt.claims','{"sub":"b2260000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
update gamify_private.beta2_cloud_quota set writes_enabled=false where singleton;
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_delete_campaign(3,'missing','1'); raise exception 'Writes-off bypass'; exception when object_not_in_prerequisite_state then null; end;
end $$;
reset role;
update gamify_private.beta2_cloud_quota set writes_enabled=true where singleton;
update gamify_private.beta2_cloud_accounts set enabled=false where user_id='b2260000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_delete_campaign(3,'missing','1'); raise exception 'Disabled account bypass'; exception when object_not_in_prerequisite_state then null; end;
end $$;
reset role;
update gamify_private.beta2_cloud_accounts set enabled=true where user_id='b2260000-0000-4000-8000-000000000001';
update gamify_private.player_memberships set revoked_at=clock_timestamp() where user_id='b2260000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_delete_campaign(3,'missing','1'); raise exception 'Revoked membership bypass'; exception when insufficient_privilege then null; end;
end $$;
reset role;
update gamify_private.player_memberships set revoked_at=null where user_id='b2260000-0000-4000-8000-000000000001';

-- The wall clock is checked after locking. Simulate expiration without waiting.
update gamify_private.beta2_campaign_writers set expires_at=clock_timestamp()-interval '1 second'
  where owner_id='b2260000-0000-4000-8000-000000000001' and campaign_id='campaign.delete.synthetic.first';
insert into beta2_delete_test select 'before',jsonb_build_object('account',to_jsonb(a),'quota',to_jsonb(q),
  'snapshotCost',(select sum(gamify_private.beta2_storage_cost(octet_length(s.content))) from public.beta2_campaign_snapshots s where s.owner_id=a.user_id and s.campaign_id='campaign.delete.synthetic.first'),
  'evidenceCost',(select evidence_bytes from public.beta2_campaigns c where c.owner_id=a.user_id and c.campaign_id='campaign.delete.synthetic.first'),
  'auxiliaryCost',4096+(select sum(gamify_private.beta2_operation_cost(o)) from gamify_private.beta2_campaign_operations o where o.owner_id=a.user_id and o.campaign_id='campaign.delete.synthetic.first'))
  from gamify_private.beta2_cloud_accounts a cross join gamify_private.beta2_cloud_quota q where a.user_id='b2260000-0000-4000-8000-000000000001' and q.singleton;
set local role authenticated;
do $$ begin
  begin perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','1'); raise exception 'Stale revision deleted'; exception when serialization_failure then null; end;
  assert public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','2')=jsonb_build_object('campaignId','campaign.delete.synthetic.first','deleted',true), 'Owner deletes expired-lease campaign';
end $$;
reset role;

do $deleted$
declare r record; absent boolean; before jsonb; amount bigint;
begin
  for r in select * from (values ('public','beta2_campaigns'),('public','beta2_campaign_snapshots'),('public','beta2_evidence_headers'),('public','beta2_evidence_pages'),
    ('gamify_private','beta2_campaign_writers'),('gamify_private','beta2_campaign_operations'),('gamify_private','beta2_cloud_rates')) as t(schema_name,table_name)
  loop
    execute format('select not exists(select 1 from %I.%I where owner_id=$1 and campaign_id=$2)',r.schema_name,r.table_name)
      into absent using 'b2260000-0000-4000-8000-000000000001'::uuid,'campaign.delete.synthetic.first';
    assert absent, 'Every target campaign/child/rate row removed';
  end loop;
  before := (select value from pg_temp.beta2_delete_test where key='before');
  amount := (before->>'snapshotCost')::bigint+(before->>'evidenceCost')::bigint+(before->>'auxiliaryCost')::bigint;
  assert (select snapshot_bytes from gamify_private.beta2_cloud_accounts where user_id='b2260000-0000-4000-8000-000000000001')=(before->'account'->>'snapshot_bytes')::bigint-(before->>'snapshotCost')::bigint, 'Current and prior snapshot quota released';
  assert (select evidence_bytes from gamify_private.beta2_cloud_accounts where user_id='b2260000-0000-4000-8000-000000000001')=(before->'account'->>'evidence_bytes')::bigint-(before->>'evidenceCost')::bigint, 'All evidence quota released';
  assert (select auxiliary_bytes from gamify_private.beta2_cloud_accounts where user_id='b2260000-0000-4000-8000-000000000001')=(before->'account'->>'auxiliary_bytes')::bigint-(before->>'auxiliaryCost')::bigint, 'Import and save operations plus campaign allowance released';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton)=(before->'quota'->>'accounted_bytes')::bigint-amount, 'Global logical quota released';
  assert (select dead_bytes_estimate from gamify_private.beta2_cloud_quota where singleton)>=(before->'quota'->>'dead_bytes_estimate')::bigint+amount, 'No false physical free-space credit';
  assert exists(select 1 from public.beta2_campaigns where owner_id='b2260000-0000-4000-8000-000000000002' and campaign_id='campaign.delete.synthetic.first'), 'Other owner same ID survives';
  assert exists(select 1 from gamify_private.beta2_cloud_notices where user_id='b2260000-0000-4000-8000-000000000001'), 'Notice and account survive';
end $deleted$;
insert into beta2_delete_test select 'after',jsonb_build_object('account',to_jsonb(a),'quota',to_jsonb(q))
  from gamify_private.beta2_cloud_accounts a cross join gamify_private.beta2_cloud_quota q where a.user_id='b2260000-0000-4000-8000-000000000001' and q.singleton;
set local role authenticated;
do $$ begin
  perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','2');
  perform public.beta2_cloud_delete_campaign(3,'campaign.delete.synthetic.first','2');
end $$;
reset role;
do $$ begin
  assert (select jsonb_build_object('account',to_jsonb(a),'quota',to_jsonb(q)) from gamify_private.beta2_cloud_accounts a cross join gamify_private.beta2_cloud_quota q where a.user_id='b2260000-0000-4000-8000-000000000001' and q.singleton)=(select value from pg_temp.beta2_delete_test where key='after'), 'Retries do not debit quota twice';
end $$;
set local role authenticated;
do $$ declare req jsonb; begin
  req := (select value from pg_temp.beta2_delete_test where key='new');
  perform public.beta2_cloud_write(req::text,encode(sha256(convert_to(req::text,'UTF8')),'hex'));
  assert jsonb_array_length(public.beta2_cloud_list(3)->'campaigns')=2, 'Freed slot accepts a new campaign';
  assert public.beta2_cloud_load(3,'campaign.delete.synthetic.keep')->'snapshot'=(select value->'snapshot' from pg_temp.beta2_delete_test where key='keep'), 'Other own campaign is unchanged';
end $$;
reset role;
do $$ begin
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton)=
    (select coalesce(sum(snapshot_bytes+evidence_bytes+auxiliary_bytes),0) from gamify_private.beta2_cloud_accounts)
      +(select count(*)*1024 from gamify_private.beta2_cloud_deletions), 'Final accounting reconciles';
end $$;

select 'PASS: Beta 2 campaign-delete ownership/guards/live-lease/revision/cascades/quota/idempotence/replacement checks; rollback follows' as result;
rollback;
