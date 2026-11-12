-- Manager-only LIVE SQL Editor test, entirely rollback-only and synthetic.
-- Run AFTER install-backup-rpcs.sql. Never replace ROLLBACK or fixture UUIDs.
-- This prepares database assertions; mocked Node tests are NOT a SQL PASS.
begin;
set local plpgsql.check_asserts = on;
set local search_path = pg_catalog, public;

do $guard$ begin
  assert not exists(select 1 from auth.users where id in ('b2500000-0000-4000-8000-000000000001','b2500000-0000-4000-8000-000000000002')), 'Synthetic UUID collision; stop';
  assert not exists(select 1 from auth.users where email in ('b25-restore-a@example.invalid','b25-restore-b@example.invalid')), 'Synthetic email collision; stop';
  assert has_function_privilege('service_role','public.beta2_backup_export(uuid)','execute'), 'Service-only export grant';
  assert has_function_privilege('service_role','public.beta2_backup_restore(text,text,boolean)','execute'), 'Service-only restore grant';
  assert not has_function_privilege('authenticated','public.beta2_backup_export(uuid)','execute'), 'No player export grant';
  assert not has_function_privilege('anon','public.beta2_backup_restore(text,text,boolean)','execute'), 'No anon restore grant';
  assert not has_function_privilege('service_role','gamify_private.beta2_backup_row(regclass,jsonb)','execute'), 'No generic row helper grant';
end $guard$;

insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
 ('b2500000-0000-4000-8000-000000000001','b25-restore-a@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('b2500000-0000-4000-8000-000000000002','b25-restore-b@example.invalid',now(),now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id) values ('b2500000-0000-4000-8000-000000000001'),('b2500000-0000-4000-8000-000000000002');
insert into gamify_private.beta2_cloud_accounts(user_id,accepted_notice_version,accepted_notice_at) values
 ('b2500000-0000-4000-8000-000000000001','beta2.cloud.v1',now()),('b2500000-0000-4000-8000-000000000002','beta2.cloud.v1',now());
-- Closes gates only INSIDE THIS ROLLBACK transaction. Other sessions never see it.
update gamify_private.beta2_cloud_quota set writes_enabled = false,enrollments_enabled = false,accounted_bytes = accounted_bytes + 16384 where singleton;
select set_config('request.jwt.claims','{"role":"service_role"}',true);

do $recovery$
declare id uuid := 'b2500000-0000-4000-8000-000000000001'; cid text := 'campaign.b25.synthetic';
  raw bytea := convert_to('B2.5 opaque synthetic bytes; not playable gzip','UTF8'); sha text;
  blob jsonb; c jsonb; s jsonb; prior jsonb; h jsonb; p jsonb; b jsonb; result jsonb; exported jsonb;
  text_body text; reserved_before bigint; other_before jsonb;
begin
  sha := encode(extensions.digest(raw,'sha256'),'hex');
  blob := jsonb_build_object('owner_id',id::text,'campaign_id',cid,'content',raw,'uncompressed_bytes',octet_length(raw),
    'uncompressed_sha256',sha,'compressed_sha256',sha);
  c := jsonb_build_object('owner_id',id::text,'campaign_id',cid,'name','B2.5 synthetic recovery','normalized_name','b2.5 synthetic recovery',
    'status','resumable','current_revision','9007199254740993','prior_revision','9007199254740992','writer_generation','9007199254740994',
    'current_sha256',sha,'evidence_high_water',1,'evidence_bytes','1','header_sha256',sha,'import_operation_id','b25.old.import',
    'import_request_sha256',sha,'created_at',now(),'updated_at',now());
  s := blob || jsonb_build_object('revision','9007199254740993','evidence_high_water',1,'accepted_at',now());
  prior := blob || jsonb_build_object('revision','9007199254740992','evidence_high_water',0,'accepted_at',now());
  h := blob;
  p := blob || jsonb_build_object('first_record',0,'record_count',1,'accepted_revision','9007199254740993');
  b := jsonb_build_object('format','beta2.private-backup.v1','ownerId',id::text,'campaign',c,'snapshots',jsonb_build_array(s,prior),'header',h,'pages',jsonb_build_array(p));
  text_body := b::text;
  select accounted_bytes into reserved_before from gamify_private.beta2_cloud_quota where singleton;
  select to_jsonb(a) into other_before from gamify_private.beta2_cloud_accounts a where user_id = 'b2500000-0000-4000-8000-000000000002';
  result := public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body));
  assert result->>'status' = 'dry-run', 'Default is dry run';
  assert not exists(select 1 from public.beta2_campaigns where owner_id = id), 'Dry run inserted nothing';
  assert (select accounted_bytes from gamify_private.beta2_cloud_quota where singleton) = reserved_before, 'Dry run reserved nothing';
  begin
    perform public.beta2_backup_restore(text_body,repeat('0',64),true); assert false,'Wrong digest accepted';
  exception when invalid_parameter_value then null; end;
  insert into gamify_private.beta2_cloud_deletions(subject_sha256) values (gamify_private.beta2_hash(id::text));
  begin
    perform public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true); assert false,'Deleted account restored';
  exception when insufficient_privilege then null; end;
  delete from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(id::text);
  update gamify_private.player_memberships set revoked_at = now() where user_id = id;
  begin
    perform public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true); assert false,'Revoked account restored';
  exception when insufficient_privilege then null; end;
  update gamify_private.player_memberships set revoked_at = null where user_id = id;
  update gamify_private.beta2_cloud_quota set writes_enabled = true where singleton;
  begin
    perform public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true); assert false,'Open write gate accepted';
  exception when object_not_in_prerequisite_state then null; end;
  update gamify_private.beta2_cloud_quota set writes_enabled = false where singleton;
  update gamify_private.beta2_cloud_accounts set snapshot_bytes = 7991808 where user_id = id;
  begin
    perform public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true); assert false,'Account capacity bypass';
  exception when program_limit_exceeded then null; end;
  update gamify_private.beta2_cloud_accounts set snapshot_bytes = 0 where user_id = id;
  -- Cross-account rows and incomplete sealed history must both fail atomically.
  b := jsonb_set(b,'{header,owner_id}',to_jsonb('b2500000-0000-4000-8000-000000000002'::text));
  begin
    perform public.beta2_backup_restore(b::text,gamify_private.beta2_hash(b::text),true); assert false,'Cross-account header accepted';
  exception when invalid_parameter_value then null; end;
  b := jsonb_set(b,'{header}',h); b := jsonb_set(b,'{pages}','[]');
  begin
    perform public.beta2_backup_restore(b::text,gamify_private.beta2_hash(b::text),true); assert false,'Missing evidence accepted';
  exception when program_limit_exceeded then null; end;
  b := jsonb_set(b,'{pages}',jsonb_build_array(p)); text_body := b::text;
  result := public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true);
  assert result->>'status' = 'restored', 'Apply acknowledged';
  assert (select current_revision from public.beta2_campaigns where owner_id = id and campaign_id = cid) = 9007199254740994, 'New higher revision';
  assert (select writer_generation from public.beta2_campaigns where owner_id = id and campaign_id = cid) = 9007199254740995, 'New fence';
  assert (select token_sha256 is null and expires_at is null from gamify_private.beta2_campaign_writers where owner_id = id and campaign_id = cid), 'No restored writer token';
  assert (select count(*) from public.beta2_campaign_snapshots where owner_id = id) = 2, 'Current and prior preserved';
  assert (select content from public.beta2_evidence_pages where owner_id = id) = raw, 'Opaque page is byte identical';
  assert not exists(select 1 from public.player_usage_days where user_id = id), 'No historical usage minted';
  assert (select to_jsonb(a) from gamify_private.beta2_cloud_accounts a where user_id = 'b2500000-0000-4000-8000-000000000002') = other_before, 'Other account unchanged';
  begin
    perform public.beta2_backup_restore(text_body,gamify_private.beta2_hash(text_body),true); assert false,'Existing campaign overwritten';
  exception when serialization_failure then null; end;
  exported := public.beta2_backup_export(id);
  assert (select count(*) from jsonb_object_keys(exported->'tables')) = 16, 'All scoped Beta 1/2 tables exported';
  assert exported->'tables'->'public.beta2_campaigns'->0->>'current_revision' = '9007199254740994', 'Bigint preserved exactly';
  assert jsonb_typeof(exported->'tables'->'public.beta2_campaigns'->0->'current_revision') = 'string', 'Bigint is not a JSON number';
  assert exported->'tables'->'public.beta2_evidence_pages'->0->>'content' = ('\x' || encode(raw,'hex')), 'Opaque hex export';
end $recovery$;

set local role authenticated;
select set_config('request.jwt.claims','{"role":"authenticated","sub":"b2500000-0000-4000-8000-000000000001"}',true);
do $deny$ begin
  begin perform public.beta2_backup_export(null); assert false,'Player exported private rows'; exception when insufficient_privilege then null; end;
  begin perform public.beta2_backup_restore('{}',repeat('0',64),true); assert false,'Player restored private rows'; exception when insufficient_privilege then null; end;
end $deny$;
reset role;
select 'PASS: B2.5 backup/restore dry-run, opaque bytes, bigint, scope, deletion, admission, gates, capacity, fencing and ACL; rollback follows' as result;
rollback;
