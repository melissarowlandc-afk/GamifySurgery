-- NEW optional owner-PC operational helpers. REVIEW, then run once in the LIVE
-- game project's SQL Editor as postgres, AFTER 20261018000100. This file does
-- not change that applied migration, expose gamify_private or grant raw tables.
-- No SQL in this delivery has been executed by the worker.
begin;

-- JSON numbers cannot round-trip bigint revisions through Node JSON.parse.
create or replace function gamify_private.beta2_backup_row(p_table regclass, p_row jsonb) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare k text;
begin
  for k in select attname from pg_catalog.pg_attribute where attrelid = p_table
    and attnum > 0 and not attisdropped and atttypid = 'pg_catalog.int8'::regtype
  loop
    if p_row->k <> 'null'::jsonb then p_row := jsonb_set(p_row,array[k],to_jsonb(p_row->>k)); end if;
  end loop;
  return p_row;
end;
$$;

create or replace function gamify_private.beta2_backup_export(p_owner_id uuid default null) returns jsonb
language plpgsql security definer set search_path = '' set bytea_output = 'hex' as $$
declare names text[]; name text; column_name text; rows jsonb; result jsonb := '{}'; ids jsonb;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Private backup denied' using errcode = '42501'; end if;
  if p_owner_id is null then
    names := array['gamify_private.beta2_cloud_quota','gamify_private.beta2_cloud_deletions','gamify_private.setup_codes'];
    select coalesce(jsonb_agg(id::text order by id),'[]') into ids from (
      select user_id id from gamify_private.player_memberships union select user_id from gamify_private.usage_owners
      union select user_id from public.player_usage_days union select user_id from gamify_private.usage_receipts
      union select user_id from gamify_private.usage_ingest_limits union select user_id from public.question_flags
      union select user_id from public.tester_feedback union select user_id from gamify_private.beta2_cloud_accounts
    ) a;
  else
    -- One account snapshot per RPC. All Beta 1/2 game writers serialize on this
    -- membership lock; no long-lived transaction or server backup copy remains.
    perform 1 from gamify_private.player_memberships where user_id = p_owner_id for share;
    perform 1 from gamify_private.beta2_cloud_accounts where user_id = p_owner_id for share;
    names := array['gamify_private.player_memberships','gamify_private.usage_owners','public.player_usage_days',
      'gamify_private.usage_receipts','gamify_private.usage_ingest_limits','public.question_flags','public.tester_feedback',
      'gamify_private.beta2_cloud_accounts','gamify_private.beta2_cloud_notices','public.beta2_campaigns',
      'public.beta2_campaign_snapshots','public.beta2_evidence_headers','public.beta2_evidence_pages',
      'gamify_private.beta2_campaign_writers','gamify_private.beta2_campaign_operations','gamify_private.beta2_cloud_rates'];
  end if;
  foreach name in array names loop
    column_name := case when name like 'public.beta2_%' or name in
      ('gamify_private.beta2_campaign_writers','gamify_private.beta2_campaign_operations','gamify_private.beta2_cloud_rates') then 'owner_id' else 'user_id' end;
    -- names and column_name are fixed allowlists above, never caller input.
    execute format('select coalesce(jsonb_agg(gamify_private.beta2_backup_row(%L::regclass,to_jsonb(t))),''[]''::jsonb) from %s t%s',
      name,name,case when p_owner_id is null then '' else format(' where %I = $1',column_name) end)
      into rows using p_owner_id;
    result := result || jsonb_build_object(name,rows);
  end loop;
  return jsonb_build_object('format','beta2.private-backup.v1','ownerId',p_owner_id::text,
    'exportedAt',clock_timestamp(),'tables',result) || case when p_owner_id is null then jsonb_build_object('accountIds',ids) else '{}'::jsonb end;
end;
$$;

-- Strictly scoped recovery of an ABSENT campaign for the SAME live admitted
-- account. Never upserts/overwrites a campaign, recreates Auth/membership,
-- restores roles/consent/setup links, replays usage, or replaces a deletion ledger.
-- The caller sends opaque raw rows selected from a checksummed private backup.
create or replace function gamify_private.beta2_backup_restore(p_bundle_text text, p_sha256 text, p_apply boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare b jsonb; id uuid; cid text; c public.beta2_campaigns%rowtype;
  s public.beta2_campaign_snapshots%rowtype; h public.beta2_evidence_headers%rowtype; p public.beta2_evidence_pages%rowtype;
  m gamify_private.player_memberships%rowtype; a gamify_private.beta2_cloud_accounts%rowtype;
  q gamify_private.beta2_cloud_quota%rowtype; op gamify_private.beta2_campaign_operations%rowtype;
  item jsonb; n integer; cursor_record integer := 0; page_count integer := 0; snapshot_count integer := 0;
  prefix_records bigint; prefix_bytes bigint; evidence_cost bigint; snapshot_cost bigint := 0; op_cost bigint;
  next_revision bigint; next_generation bigint; operation_id text; receipt jsonb; t timestamptz := clock_timestamp();
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Private restore denied' using errcode = '42501'; end if;
  if p_apply is null or p_bundle_text is null or octet_length(p_bundle_text) > 28000000
    or p_sha256 is null or p_sha256 !~ '^[0-9a-f]{64}$' or gamify_private.beta2_hash(p_bundle_text) <> p_sha256 then
    raise exception 'Invalid private restore digest' using errcode = '22023'; end if;
  b := p_bundle_text::jsonb;
  if not gamify_private.beta2_keys(b,array['format','ownerId','campaign','snapshots','header','pages'])
    or b->>'format' is distinct from 'beta2.private-backup.v1' or jsonb_typeof(b->'snapshots') is distinct from 'array'
    or jsonb_typeof(b->'pages') is distinct from 'array' or jsonb_array_length(b->'pages') > 512 then
    raise exception 'Invalid private restore shape' using errcode = '22023'; end if;
  id := (b->>'ownerId')::uuid;
  c := jsonb_populate_record(null::public.beta2_campaigns,b->'campaign'); cid := c.campaign_id;
  if id is null or c.owner_id is distinct from id or cid is null or octet_length(cid) not between 1 and 256
    or c.current_revision is null or c.current_revision not between 1 and 9223372036854775806
    or c.writer_generation is null or c.writer_generation not between 1 and 9223372036854775806
    or c.evidence_high_water is null or c.evidence_high_water not between 0 and 50000
    or c.name is null or c.name <> btrim(c.name) or c.name ~ '[[:cntrl:]]' or octet_length(c.name) not between 1 and 160
    or c.normalized_name is distinct from lower(c.name) or c.status is null or c.status not in ('resumable','archived')
    or c.created_at is null or c.updated_at is null then
    raise exception 'Invalid private restore identity' using errcode = '22023'; end if;
  -- Same lock order as live writes/deletion. No stale capability can cross this check.
  select * into m from gamify_private.player_memberships where user_id = id for update;
  if not found or m.revoked_at is not null or m.deletion_requested_at is not null or not exists (
    select 1 from auth.users u where u.id = m.user_id and u.email_confirmed_at is not null and u.deleted_at is null
      and not coalesce(u.is_anonymous,false) and (u.banned_until is null or u.banned_until <= clock_timestamp())
      and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)) then
    raise exception 'Live account is not admitted; restore blocked' using errcode = '42501'; end if;
  select * into a from gamify_private.beta2_cloud_accounts where user_id = id for update;
  if not found or a.accepted_notice_version is distinct from 'beta2.cloud.v1' or a.accepted_notice_at is null then
    raise exception 'Live cloud consent is required; restore cannot recreate it' using errcode = '42501'; end if;
  select * into q from gamify_private.beta2_cloud_quota where singleton for update;
  if not found then raise exception 'Live quota state unavailable; restore blocked' using errcode = '55000'; end if;
  if q.writes_enabled or q.enrollments_enabled then
    raise exception 'Close project write and enrollment gates before restore' using errcode = '55000'; end if;
  if exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(id::text)) then
    raise exception 'Live deletion ledger blocks restore' using errcode = '42501'; end if;
  if exists(select 1 from public.beta2_campaigns where owner_id = id and campaign_id = cid)
    or exists(select 1 from public.beta2_campaigns where owner_id = id and normalized_name = c.normalized_name) then
    raise exception 'Existing campaign or name is preserved; restore will not overwrite' using errcode = '40001'; end if;
  if (select count(*) from public.beta2_campaigns where owner_id = id) >= 2 then
    raise exception 'Two cloud campaign slots are already occupied' using errcode = '54000'; end if;

  h := jsonb_populate_record(null::public.beta2_evidence_headers,b->'header');
  if h.owner_id is distinct from id or h.campaign_id is distinct from cid or h.uncompressed_sha256 is distinct from c.header_sha256 then
    raise exception 'Restore header scope mismatch' using errcode = '22023'; end if;
  perform gamify_private.beta2_blob(gamify_private.beta2_packed(h.content,h.uncompressed_bytes,h.uncompressed_sha256,h.compressed_sha256),1000000,6000000);
  evidence_cost := gamify_private.beta2_storage_cost(octet_length(h.content));
  for item in select value from jsonb_array_elements(b->'pages') order by (value->>'first_record')::integer loop
    p := jsonb_populate_record(null::public.beta2_evidence_pages,item);
    if p.owner_id is distinct from id or p.campaign_id is distinct from cid or p.first_record is distinct from cursor_record
      or p.record_count is null or p.record_count < 1 or p.accepted_revision is null or p.accepted_revision not between 1 and c.current_revision then
      raise exception 'Restore sealed page scope/prefix mismatch' using errcode = '22023'; end if;
    perform gamify_private.beta2_blob(gamify_private.beta2_packed(p.content,p.uncompressed_bytes,p.uncompressed_sha256,p.compressed_sha256),1000000,6000000);
    cursor_record := cursor_record + p.record_count; page_count := page_count + 1;
    evidence_cost := evidence_cost + gamify_private.beta2_storage_cost(octet_length(p.content));
  end loop;
  if cursor_record <> c.evidence_high_water or evidence_cost > 1000000 then
    raise exception 'Restore evidence capacity/prefix mismatch' using errcode = '54000'; end if;
  n := case when c.prior_revision is null then 1 else 2 end;
  if jsonb_array_length(b->'snapshots') <> n or c.prior_revision is not null and
    (c.prior_revision < 1 or c.prior_revision >= c.current_revision) then
    raise exception 'Restore current/prior pair mismatch' using errcode = '22023'; end if;
  for item in select value from jsonb_array_elements(b->'snapshots') loop
    s := jsonb_populate_record(null::public.beta2_campaign_snapshots,item);
    if s.owner_id is distinct from id or s.campaign_id is distinct from cid or s.revision is null
      or (s.revision <> c.current_revision and (c.prior_revision is null or s.revision <> c.prior_revision))
      or (select count(*) from jsonb_array_elements(b->'snapshots') v where v->>'revision' = s.revision::text) <> 1
      or s.accepted_at is null or s.evidence_high_water is null or s.evidence_high_water not between 0 and c.evidence_high_water
      or (s.revision = c.current_revision and (s.uncompressed_sha256 is distinct from c.current_sha256 or s.evidence_high_water <> c.evidence_high_water)) then
      raise exception 'Restore snapshot scope/head mismatch' using errcode = '22023'; end if;
    perform gamify_private.beta2_blob(gamify_private.beta2_packed(s.content,s.uncompressed_bytes,s.uncompressed_sha256,s.compressed_sha256),3000000,3000000);
    select coalesce(sum((v->>'record_count')::bigint),0),coalesce(sum((v->>'uncompressed_bytes')::bigint),0) into prefix_records,prefix_bytes
      from jsonb_array_elements(b->'pages') v where (v->>'first_record')::bigint + (v->>'record_count')::bigint <= s.evidence_high_water
        and (v->>'accepted_revision')::bigint <= s.revision;
    if prefix_records <> s.evidence_high_water or prefix_bytes + h.uncompressed_bytes + s.uncompressed_bytes > 6000000 then
      raise exception 'Restore load processing bound exceeded' using errcode = '54000'; end if;
    snapshot_count := snapshot_count + 1;
    snapshot_cost := snapshot_cost + gamify_private.beta2_storage_cost(octet_length(s.content));
  end loop;
  next_revision := c.current_revision + 1; next_generation := c.writer_generation + 1;
  operation_id := 'restore.' || p_sha256;
  receipt := jsonb_build_object('operationId',operation_id,'requestSha256',p_sha256,'revision',next_revision::text,
    'writerGeneration',next_generation::text,'snapshotSha256',c.current_sha256,
    'snapshotBytes',(select (v->>'uncompressed_bytes')::integer from jsonb_array_elements(b->'snapshots') v where v->>'revision' = c.current_revision::text),
    'evidenceHighWater',c.evidence_high_water,'acceptedAt',t);
  op := row(id,cid,operation_id,'import',p_sha256,0,next_revision,receipt,t)::gamify_private.beta2_campaign_operations;
  op_cost := gamify_private.beta2_operation_cost(op);
  if a.snapshot_bytes + snapshot_cost + a.auxiliary_bytes + 4096 + op_cost > 8000000
    or a.evidence_bytes + evidence_cost > 2000000
    or q.accounted_bytes + snapshot_cost + evidence_cost + 4096 + op_cost + q.dead_bytes_estimate + 50000000 > 400000000
    or pg_database_size(current_database()) + 2 * (snapshot_cost + evidence_cost + 4096 + op_cost) + q.dead_bytes_estimate + 1048576 > 400000000 then
    raise exception 'Restore capacity reservation unavailable' using errcode = '54000'; end if;
  if p_apply then
    perform gamify_private.beta2_reserve(id,snapshot_cost,evidence_cost,4096 + op_cost,snapshot_cost + evidence_cost + 4096 + op_cost);
    -- New head is higher than the backup head. Prior content stays available at
    -- its original revision; no present live campaign/evidence is replaced.
    c.current_revision := next_revision; c.writer_generation := next_generation; c.evidence_bytes := evidence_cost;
    c.import_operation_id := operation_id; c.import_request_sha256 := p_sha256; c.updated_at := t;
    insert into public.beta2_campaigns select (c).*;
    insert into public.beta2_evidence_headers select (h).*;
    for item in select value from jsonb_array_elements(b->'pages') loop
      p := jsonb_populate_record(null::public.beta2_evidence_pages,item); insert into public.beta2_evidence_pages select (p).*;
    end loop;
    for item in select value from jsonb_array_elements(b->'snapshots') loop
      s := jsonb_populate_record(null::public.beta2_campaign_snapshots,item);
      if s.revision = next_revision - 1 then s.revision := next_revision; s.accepted_at := t; end if;
      insert into public.beta2_campaign_snapshots select (s).*;
    end loop;
    insert into gamify_private.beta2_campaign_writers values(id,cid,next_generation,null,null);
    insert into gamify_private.beta2_campaign_operations select (op).*;
    update gamify_private.beta2_cloud_accounts set enrolled_at = coalesce(enrolled_at,t) where user_id = id;
  end if;
  return jsonb_build_object('status',case when p_apply then 'restored' else 'dry-run' end,'ownerId',id::text,'campaignId',cid,
    'bundleSha256',p_sha256,'revision',next_revision::text,'writerGeneration',next_generation::text,
    'snapshotRows',snapshot_count,'evidencePages',page_count,'reservedBytes',(snapshot_cost + evidence_cost + 4096 + op_cost)::text);
exception when data_exception then raise exception 'Invalid private restore data' using errcode = '22023';
end;
$$;

create or replace function public.beta2_backup_export(p_owner_id uuid default null) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_backup_export(p_owner_id); $$;
create or replace function public.beta2_backup_restore(p_bundle_text text, p_sha256 text, p_apply boolean default false) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_backup_restore(p_bundle_text,p_sha256,p_apply); $$;

revoke all on function gamify_private.beta2_backup_row(regclass,jsonb) from public,anon,authenticated,service_role;
revoke all on function gamify_private.beta2_backup_export(uuid),public.beta2_backup_export(uuid),
  gamify_private.beta2_backup_restore(text,text,boolean),public.beta2_backup_restore(text,text,boolean) from public,anon,authenticated,service_role;
grant execute on function gamify_private.beta2_backup_export(uuid),public.beta2_backup_export(uuid),
  gamify_private.beta2_backup_restore(text,text,boolean),public.beta2_backup_restore(text,text,boolean) to service_role;
commit;
