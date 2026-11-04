-- Snapshot-only account saves. REVIEW/APPLY BEFORE the snapshot client.
-- No live changes were made by the worker. Existing format-2 accounts remain
-- readable/writable until a fenced format-3 conversion succeeds atomically.
begin;

-- Keep the old RPCs running while waiting for a quiet apply instant: NOWAIT
-- aborts instead of queueing a table lock behind an active save/load. Always
-- lock campaigns BEFORE snapshots, the live RPC relation order. Retry the
-- WHOLE transaction after rollback if busy; never resume a partial script.
set local lock_timeout = '2s';
set local statement_timeout = '15s';
set local idle_in_transaction_session_timeout = '15s';
lock table public.beta2_campaigns in access exclusive mode nowait;
lock table public.beta2_campaign_snapshots in access exclusive mode nowait;
alter table public.beta2_campaigns drop constraint beta2_campaigns_evidence_bytes_check;
alter table public.beta2_campaigns add constraint beta2_campaigns_evidence_bytes_check check (evidence_bytes between 0 and 1000000);
alter table public.beta2_campaign_snapshots
  add column cloud_format_version integer not null default 2 check (cloud_format_version in (2,3)),
  add column snapshot_lineage jsonb;
alter table public.beta2_campaign_snapshots add constraint beta2_snapshot_lineage_format
  check ((cloud_format_version = 2 and snapshot_lineage is null) or
    (cloud_format_version = 3 and snapshot_lineage is not null and jsonb_typeof(snapshot_lineage) = 'object'));

create function gamify_private.beta2_snapshot_lineage(p_value jsonb) returns boolean
language plpgsql immutable security invoker set search_path = '' as $$
begin
  if not gamify_private.beta2_keys(p_value,array['branchId','sequence','parents'])
    or jsonb_typeof(p_value->'branchId') is distinct from 'string'
    or octet_length(p_value->>'branchId') not between 1 and 160
    or jsonb_typeof(p_value->'sequence') is distinct from 'number'
    or jsonb_typeof(p_value->'parents') is distinct from 'array' then return false; end if;
  if gamify_private.beta2_uint(p_value->>'sequence',9007199254740991) < 0 or jsonb_array_length(p_value->'parents') > 4
    or exists(select 1 from jsonb_array_elements(p_value->'parents') p where jsonb_typeof(p) <> 'string' or (p #>> '{}') !~ '^[0-9a-f]{64}$') then return false; end if;
  return true;
exception when data_exception then return false;
end;
$$;

create function gamify_private.beta2_snapshot_write(p_request_text text, p_request_sha256 text) returns jsonb
language plpgsql security definer set search_path = '' as $$
#variable_conflict error
declare
  req jsonb; id uuid; cid text; operation_key text; kind text; base bigint; gen bigint; token text; issued timestamptz;
  c public.beta2_campaigns%rowtype; w gamify_private.beta2_campaign_writers%rowtype;
  previous gamify_private.beta2_campaign_operations%rowtype; operation_row gamify_private.beta2_campaign_operations%rowtype;
  old_head public.beta2_campaign_snapshots%rowtype;
  v_blob jsonb; meta jsonb; snapshot_data bytea; prior_data bytea;
  snapshot_cost bigint; pruned_cost bigint := 0; replaced_cost bigint := 0; prior_cost bigint := 0; evidence_cost bigint := 0; op_cost bigint;
  accepted_revision bigint; t timestamptz; receipt jsonb;
begin
  if p_request_text is null or octet_length(p_request_text) > 6000000
    or p_request_sha256 is null or p_request_sha256 !~ '^[0-9a-f]{64}$'
    or gamify_private.beta2_hash(p_request_text) <> p_request_sha256
    or octet_length(jsonb_build_object('p_request_text',p_request_text,'p_request_sha256',p_request_sha256)::text) > 6000000 then
    raise exception 'Invalid cloud request bytes/hash' using errcode = '22023'; end if;
  req := p_request_text::jsonb;
  if not gamify_private.beta2_keys(req,array['protocolVersion','cloudFormatVersion','campaign',
      'action','operationId','issuedAt','expectedRevision','writerGeneration','writerToken','campaignId','snapshot','lineage','legacyBaseSnapshot','legacyBaseLineage','usageReceipts'])
    or req->'protocolVersion' is distinct from '4'::jsonb
    or req->'cloudFormatVersion' is distinct from '3'::jsonb
    or coalesce(req->>'action','') not in ('import','save')
    or jsonb_typeof(req->'operationId') is distinct from 'string' or octet_length(req->>'operationId') not between 1 and 256
    or req->>'operationId' ~ '[[:cntrl:]]'
    or jsonb_typeof(req->'campaignId') is distinct from 'string' or octet_length(req->>'campaignId') not between 1 and 256
    or req->>'campaignId' ~ '[[:cntrl:]]'
    or jsonb_typeof(req->'expectedRevision') is distinct from 'string' or jsonb_typeof(req->'writerGeneration') is distinct from 'string'
    or jsonb_typeof(req->'writerToken') is distinct from 'string' or req->>'writerToken' !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(req->'issuedAt') is distinct from 'string'
    or req->>'issuedAt' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{1,6})?(Z|[+-][0-9]{2}:[0-9]{2})$'
    or jsonb_typeof(req->'usageReceipts') is distinct from 'array' then
    raise exception 'Invalid cloud write envelope/version' using errcode = '22023'; end if;
  if jsonb_array_length(req->'usageReceipts') > 100 then raise exception 'Cloud receipt count limit' using errcode = '22023'; end if;
  cid := req->>'campaignId'; operation_key := req->>'operationId'; kind := req->>'action'; meta := req->'campaign';
  -- Summary fields are explicit declarations; the client checks the opaque
  -- snapshot's campaign identity/content on load. No tutorial/game fields here.
  if not gamify_private.beta2_keys(meta,array['campaignId','name','status'])
    or jsonb_typeof(meta->'campaignId') is distinct from 'string' or meta->>'campaignId' is distinct from cid
    or jsonb_typeof(meta->'name') is distinct from 'string'
    or octet_length(meta->>'name') not between 1 and 160 or meta->>'name' <> btrim(meta->>'name')
    or meta->>'name' ~ '[[:cntrl:]]' or coalesce(meta->>'status','') not in ('resumable','archived') then
    raise exception 'Invalid cloud campaign summary' using errcode = '22023'; end if;
  id := gamify_private.beta2_require_cloud(3); perform gamify_private.beta2_rate(id,'mutation');
  base := gamify_private.beta2_uint(req->>'expectedRevision'); gen := gamify_private.beta2_uint(req->>'writerGeneration');
  token := gamify_private.beta2_hash(req->>'writerToken');
  select * into previous from gamify_private.beta2_campaign_operations where owner_id = id and operation_id = operation_key;
  if found then
    if previous.request_sha256 is distinct from p_request_sha256 or previous.campaign_id is distinct from cid then
      raise exception 'Cloud operation identity conflict' using errcode = '22023'; end if;
    -- A lost acknowledgement returns its original receipt even after takeover;
    -- it never restores an old lease or re-applies evidence/usage.
    return previous.receipt;
  end if;
  issued := (req->>'issuedAt')::timestamptz;
  if not isfinite(issued) or issued <= clock_timestamp() - interval '7 days' or issued > clock_timestamp() + interval '1 minute' then
    raise exception 'Expired or future cloud operation' using errcode = '22023'; end if;
  select * into c from public.beta2_campaigns where owner_id = id and campaign_id = cid for update;
  if kind = 'import' then
    if found or base <> 0 or gen <> 0 then raise exception 'Cloud import identity conflict' using errcode = '22023'; end if;
    if not (select enrollments_enabled from gamify_private.beta2_cloud_quota where singleton) then
      raise exception 'Cloud enrollment unavailable' using errcode = '55000'; end if;
    if (select count(*) from public.beta2_campaigns where owner_id = id) >= 2 then raise exception 'Cloud campaign limit reached' using errcode = '54000'; end if;
    if jsonb_array_length(req->'usageReceipts') <> 0 then raise exception 'Imported history cannot mint usage' using errcode = '22023'; end if;
    accepted_revision := 1;
  else
    if not found then raise exception 'Cloud campaign unavailable' using errcode = '42501'; end if;
    if base <> c.current_revision then raise exception 'Cloud revision conflict' using errcode = '40001'; end if;
    select * into w from gamify_private.beta2_campaign_writers where owner_id = id and campaign_id = cid for update;
    if not found or gen <> c.writer_generation or gen <> w.generation or w.token_sha256 is distinct from token
      or w.expires_at is null or w.expires_at <= clock_timestamp() then
      raise exception 'Cloud lease expired or fenced' using errcode = '55000'; end if;
    if base = 9223372036854775807 then raise exception 'Cloud revision exhausted' using errcode = '54000'; end if;
    accepted_revision := base + 1;
  end if;
  if not gamify_private.beta2_snapshot_lineage(req->'lineage') then raise exception 'Invalid snapshot lineage' using errcode = '22023'; end if;
  snapshot_data := gamify_private.beta2_blob(req->'snapshot',3000000,3000000);
  snapshot_cost := gamify_private.beta2_storage_cost(octet_length(snapshot_data));
  if kind = 'save' then
    select * into old_head from public.beta2_campaign_snapshots where owner_id = id and campaign_id = cid and revision = base;
    if not found then raise exception 'Stored cloud head unavailable' using errcode = '22023'; end if;
    select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(s.content))),0) into pruned_cost
      from public.beta2_campaign_snapshots s where owner_id = id and campaign_id = cid and revision <> base;
    if old_head.cloud_format_version = 2 then
      -- Client-verified full prior state, protected BEFORE releasing its legacy
      -- history. The server validates compressed bytes/hash; as before, only
      -- the client can verify opaque gzip contents and declared game fidelity.
      if not gamify_private.beta2_snapshot_lineage(req->'legacyBaseLineage') then raise exception 'Missing verified prior snapshot' using errcode = '22023'; end if;
      prior_data := gamify_private.beta2_blob(req->'legacyBaseSnapshot',3000000,3000000);
      prior_cost := gamify_private.beta2_storage_cost(octet_length(prior_data));
      replaced_cost := gamify_private.beta2_storage_cost(octet_length(old_head.content));
      evidence_cost := c.evidence_bytes;
    elsif req->'legacyBaseSnapshot' is distinct from 'null'::jsonb or req->'legacyBaseLineage' is distinct from 'null'::jsonb then
      raise exception 'Unexpected legacy conversion' using errcode = '22023';
    end if;
  elsif req->'legacyBaseSnapshot' is distinct from 'null'::jsonb or req->'legacyBaseLineage' is distinct from 'null'::jsonb then
    raise exception 'Import cannot replace a prior snapshot' using errcode = '22023';
  end if;
  perform gamify_private.beta2_rate(id,'checkpoint'); perform gamify_private.beta2_rate(id,'campaign',cid);
  t := clock_timestamp();
  receipt := jsonb_build_object('operationId',operation_key,'requestSha256',p_request_sha256,'revision',accepted_revision::text,
    'writerGeneration',case when kind = 'import' then '1' else gen::text end,
    'snapshotSha256',req->'snapshot'->>'uncompressedSha256','snapshotBytes',req->'snapshot'->'uncompressedBytes',
    'storedSnapshotBytes',octet_length(snapshot_data),'evidenceHighWater',0,'acceptedAt',t);
  operation_row := row(id,cid,operation_key,kind,p_request_sha256,base,accepted_revision,receipt,t)::gamify_private.beta2_campaign_operations;
  op_cost := gamify_private.beta2_operation_cost(operation_row);
  -- Logical reservation subtracts retired rows, but the same rows become dead
  -- bytes below. Test the FINAL accounted+dead total while require_cloud still
  -- holds the quota lock, before any replacement/pruning/usage can commit.
  -- Final delta = new snapshot + converted prior + operation + import overhead;
  -- pruned/replaced/evidence costs cancel between logical and dead ledgers.
  if exists(select 1 from gamify_private.beta2_cloud_quota q where q.singleton and
    q.accounted_bytes + q.dead_bytes_estimate + snapshot_cost + prior_cost + op_cost +
      case when kind = 'import' then 4096 else 0 end + 50000000 > 400000000) then
    raise exception 'Cloud project capacity reached' using errcode = '54000'; end if;
  perform gamify_private.beta2_reserve(id,snapshot_cost + prior_cost - replaced_cost - pruned_cost,-evidence_cost,
    op_cost + case when kind = 'import' then 4096 else 0 end,snapshot_cost + prior_cost + op_cost + 4096);
  if kind = 'import' then
    insert into public.beta2_campaigns(owner_id,campaign_id,name,normalized_name,status,current_revision,current_sha256,evidence_high_water,
      evidence_bytes,header_sha256,import_operation_id,import_request_sha256,created_at,updated_at)
      values(id,cid,meta->>'name',lower(meta->>'name'),meta->>'status',1,req->'snapshot'->>'uncompressedSha256',0,
        0,repeat('0',64),operation_key,p_request_sha256,t,t);
    insert into gamify_private.beta2_campaign_writers values(id,cid,1,token,clock_timestamp() + interval '60 seconds');
    update gamify_private.beta2_cloud_accounts set enrolled_at = coalesce(enrolled_at,t) where user_id = id;
  end if;
  if jsonb_array_length(req->'usageReceipts') > 0 then
    if exists(select 1 from jsonb_array_elements(req->'usageReceipts') r where r->>'kind' is distinct from 'question') then
      raise exception 'Invalid cloud question receipt' using errcode = '22023'; end if;
    perform gamify_private.ingest_player_usage(req->'usageReceipts','first-scored-patient-and-employee.v1');
  end if;
  if kind = 'save' and w.expires_at <= clock_timestamp() then raise exception 'Cloud lease expired during acceptance' using errcode = '55000'; end if;
  if prior_data is not null then
    v_blob := req->'legacyBaseSnapshot';
    update public.beta2_campaign_snapshots set content = prior_data,uncompressed_bytes = (v_blob->>'uncompressedBytes')::integer,
      uncompressed_sha256 = v_blob->>'uncompressedSha256',compressed_sha256 = v_blob->>'compressedSha256',
      cloud_format_version = 3,snapshot_lineage = req->'legacyBaseLineage',evidence_high_water = 0
      where owner_id = id and campaign_id = cid and revision = base;
    delete from public.beta2_evidence_pages where owner_id = id and campaign_id = cid;
    delete from public.beta2_evidence_headers where owner_id = id and campaign_id = cid;
  end if;
  v_blob := req->'snapshot';
  insert into public.beta2_campaign_snapshots(owner_id,campaign_id,revision,content,uncompressed_bytes,uncompressed_sha256,compressed_sha256,evidence_high_water,accepted_at,cloud_format_version,snapshot_lineage)
    values(id,cid,accepted_revision,snapshot_data,(v_blob->>'uncompressedBytes')::integer,
      v_blob->>'uncompressedSha256',v_blob->>'compressedSha256',0,t,3,req->'lineage');
  if kind = 'save' then
    update public.beta2_campaigns set name = meta->>'name',normalized_name = lower(meta->>'name'),status = meta->>'status',
      prior_revision = current_revision,current_revision = accepted_revision,current_sha256 = v_blob->>'uncompressedSha256',
      evidence_high_water = 0,evidence_bytes = 0,header_sha256 = repeat('0',64),updated_at = t where owner_id = id and campaign_id = cid;
    delete from public.beta2_campaign_snapshots where owner_id = id and campaign_id = cid and revision not in (accepted_revision,base);
    update gamify_private.beta2_cloud_quota set dead_bytes_estimate = dead_bytes_estimate + pruned_cost + replaced_cost + evidence_cost where singleton;
  end if;
  insert into gamify_private.beta2_campaign_operations select (operation_row).*;
  return receipt;
exception when invalid_parameter_value then raise;
  when data_exception then raise exception 'Invalid cloud snapshot data' using errcode = '22023';
  when unique_violation then raise exception 'Cloud campaign name or identity conflict' using errcode = '22023';
end;
$$;

-- Old clients remain supported for legacy campaigns, but cannot append history
-- to a converted snapshot. Recreate public wrappers after renaming: SQL
-- wrappers may retain the original function OID across a rename.
alter function gamify_private.beta2_cloud_write(text,text) rename to beta2_legacy_cloud_write;
create function gamify_private.beta2_cloud_write(p_request_text text, p_request_sha256 text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(3); cid text;
begin
  if p_request_text is null or octet_length(p_request_text) > 6000000 then raise exception 'Invalid cloud request' using errcode = '22023'; end if;
  cid := p_request_text::jsonb->>'campaignId';
  if exists(select 1 from gamify_private.beta2_campaign_operations where owner_id = id and operation_id = p_request_text::jsonb->>'operationId') then
    return gamify_private.beta2_legacy_cloud_write(p_request_text,p_request_sha256); end if;
  if exists(select 1 from public.beta2_campaign_snapshots s join public.beta2_campaigns c using(owner_id,campaign_id)
    where c.owner_id = id and c.campaign_id = cid and s.revision = c.current_revision and s.cloud_format_version = 3) then
    raise exception 'Cloud client update required for snapshot saves' using errcode = '22023'; end if;
  return gamify_private.beta2_legacy_cloud_write(p_request_text,p_request_sha256);
end;
$$;
create or replace function public.beta2_cloud_write(p_request_text text, p_request_sha256 text) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_write(p_request_text,p_request_sha256); $$;

alter function gamify_private.beta2_cloud_load(integer,text,text) rename to beta2_legacy_cloud_load;
create function gamify_private.beta2_cloud_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol,false);
begin
  if exists(select 1 from public.beta2_campaign_snapshots s join public.beta2_campaigns c using(owner_id,campaign_id)
    where c.owner_id = id and c.campaign_id = p_campaign_id and s.cloud_format_version = 3
      and s.revision = case when p_revision is null then c.current_revision else gamify_private.beta2_uint(p_revision) end) then
    raise exception 'Cloud client update required for snapshot saves' using errcode = '22023'; end if;
  return gamify_private.beta2_legacy_cloud_load(p_protocol,p_campaign_id,p_revision);
end;
$$;
create or replace function public.beta2_cloud_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_load(p_protocol,p_campaign_id,p_revision); $$;

create function gamify_private.beta2_snapshot_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid; requested_revision bigint; s public.beta2_campaign_snapshots%rowtype;
  c public.beta2_campaigns%rowtype;
begin
  -- Reject malformed/oversized inputs before acquiring membership/account locks.
  if p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256 then
    raise exception 'Invalid cloud campaign ID' using errcode = '22023'; end if;
  if p_revision is not null then
    if octet_length(p_revision) not between 1 and 19 or p_revision !~ '^[1-9][0-9]{0,18}$' then
      raise exception 'Invalid cloud revision' using errcode = '22023'; end if;
    requested_revision := gamify_private.beta2_uint(p_revision);
  end if;
  id := gamify_private.beta2_require_cloud(p_protocol,false);
  select * into c from public.beta2_campaigns where owner_id = id and campaign_id = p_campaign_id;
  if not found then raise exception 'Cloud campaign unavailable' using errcode = '42501'; end if;
  select * into s from public.beta2_campaign_snapshots where owner_id = id and campaign_id = p_campaign_id
    and revision = coalesce(requested_revision,c.current_revision);
  if not found then raise exception 'Cloud revision unavailable' using errcode = '22023'; end if;
  if s.cloud_format_version = 2 then return gamify_private.beta2_cloud_load(p_protocol,p_campaign_id,p_revision); end if;
  perform gamify_private.beta2_rate(id,'load');
  return jsonb_build_object('cloudFormatVersion',3,'lineage',s.snapshot_lineage,'revision',s.revision::text,
    'writerGeneration',c.writer_generation::text,'acceptedAt',s.accepted_at,
    'snapshot',gamify_private.beta2_packed(s.content,s.uncompressed_bytes,s.uncompressed_sha256,s.compressed_sha256),
    'quota',gamify_private.beta2_budget(id),'serverTime',clock_timestamp());
end;
$$;
create function public.beta2_snapshot_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_snapshot_load(p_protocol,p_campaign_id,p_revision); $$;
create function public.beta2_snapshot_write(p_request_text text, p_request_sha256 text) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_snapshot_write(p_request_text,p_request_sha256); $$;

create or replace function gamify_private.beta2_cloud_access(p_protocol integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.require_usage_player(false); a gamify_private.beta2_cloud_accounts%rowtype; q gamify_private.beta2_cloud_quota%rowtype;
begin
  if exists (select 1 from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(id::text)) then
    raise exception 'Cloud account access denied' using errcode = '42501'; end if;
  select * into q from gamify_private.beta2_cloud_quota where singleton;
  if p_protocol is distinct from 3 then raise exception 'Cloud client update required' using errcode = '22023'; end if;
  select * into a from gamify_private.beta2_cloud_accounts where user_id = id for update;
  if found then perform gamify_private.beta2_rate(id, 'metadata'); end if;
  return jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'snapshotSaves',true,'enabled',coalesce(a.enabled,q.default_account_enabled,false),
    'writesEnabled',q.writes_enabled,'enrollmentsEnabled',q.enrollments_enabled,'noticeVersion',q.notice_version,
    'noticeAccepted',coalesce(a.accepted_notice_version = q.notice_version and a.accepted_notice_at is not null,false),
    'enrolled',a.enrolled_at is not null,'quota',gamify_private.beta2_budget(id));
end;
$$;


-- Existing owner export uses dynamic complete rows, so new format metadata is included.
create or replace function gamify_private.beta2_backup_restore(p_bundle_text text, p_sha256 text, p_apply boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare b jsonb; id uuid; cid text; c public.beta2_campaigns%rowtype;
  s public.beta2_campaign_snapshots%rowtype; h public.beta2_evidence_headers%rowtype; p public.beta2_evidence_pages%rowtype;
  m gamify_private.player_memberships%rowtype; a gamify_private.beta2_cloud_accounts%rowtype;
  q gamify_private.beta2_cloud_quota%rowtype; op gamify_private.beta2_campaign_operations%rowtype;
  item jsonb; native boolean; n integer; cursor_record integer := 0; page_count integer := 0; snapshot_count integer := 0;
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

  native := coalesce((select (v->>'cloud_format_version')::integer = 3 from jsonb_array_elements(b->'snapshots') v where v->>'revision' = c.current_revision::text),false);
  if not native then
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
  else
    if b->'header' is distinct from 'null'::jsonb or jsonb_array_length(b->'pages') <> 0 or c.evidence_high_water <> 0 or c.evidence_bytes <> 0 then
      raise exception 'Snapshot backup contains unexpected history' using errcode = '22023'; end if;
    evidence_cost := 0;
  end if;
  n := case when c.prior_revision is null then 1 else 2 end;
  if jsonb_array_length(b->'snapshots') <> n or c.prior_revision is not null and
    (c.prior_revision < 1 or c.prior_revision >= c.current_revision) then
    raise exception 'Restore current/prior pair mismatch' using errcode = '22023'; end if;
  for item in select value from jsonb_array_elements(b->'snapshots') loop
    s := jsonb_populate_record(null::public.beta2_campaign_snapshots,item);
    s.cloud_format_version := coalesce(s.cloud_format_version,2);
    if s.owner_id is distinct from id or s.campaign_id is distinct from cid or s.revision is null
      or (s.revision <> c.current_revision and (c.prior_revision is null or s.revision <> c.prior_revision))
      or (select count(*) from jsonb_array_elements(b->'snapshots') v where v->>'revision' = s.revision::text) <> 1
      or s.accepted_at is null or s.evidence_high_water is null or s.evidence_high_water not between 0 and c.evidence_high_water
      or (s.revision = c.current_revision and (s.uncompressed_sha256 is distinct from c.current_sha256 or s.evidence_high_water <> c.evidence_high_water)) then
      raise exception 'Restore snapshot scope/head mismatch' using errcode = '22023'; end if;
    perform gamify_private.beta2_blob(gamify_private.beta2_packed(s.content,s.uncompressed_bytes,s.uncompressed_sha256,s.compressed_sha256),3000000,3000000);
    if not native and (s.cloud_format_version <> 2 or s.snapshot_lineage is not null) then
      raise exception 'Mixed snapshot backup formats' using errcode = '22023'; end if;
    if native and (s.cloud_format_version <> 3 or not gamify_private.beta2_snapshot_lineage(s.snapshot_lineage) or s.evidence_high_water <> 0) then
      raise exception 'Invalid snapshot backup metadata' using errcode = '22023'; end if;
    if not native then
    select coalesce(sum((v->>'record_count')::bigint),0),coalesce(sum((v->>'uncompressed_bytes')::bigint),0) into prefix_records,prefix_bytes
      from jsonb_array_elements(b->'pages') v where (v->>'first_record')::bigint + (v->>'record_count')::bigint <= s.evidence_high_water
        and (v->>'accepted_revision')::bigint <= s.revision;
    if prefix_records <> s.evidence_high_water or prefix_bytes + h.uncompressed_bytes + s.uncompressed_bytes > 6000000 then
      raise exception 'Restore load processing bound exceeded' using errcode = '54000'; end if;
    end if;
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
    if not native then insert into public.beta2_evidence_headers select (h).*; end if;
    for item in select value from jsonb_array_elements(b->'pages') loop
      p := jsonb_populate_record(null::public.beta2_evidence_pages,item); insert into public.beta2_evidence_pages select (p).*;
    end loop;
    for item in select value from jsonb_array_elements(b->'snapshots') loop
      s := jsonb_populate_record(null::public.beta2_campaign_snapshots,item);
      s.cloud_format_version := coalesce(s.cloud_format_version,2);
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


revoke all on function gamify_private.beta2_snapshot_lineage(jsonb), gamify_private.beta2_legacy_cloud_write(text,text), gamify_private.beta2_legacy_cloud_load(integer,text,text), gamify_private.beta2_cloud_load(integer,text,text),
  gamify_private.beta2_snapshot_write(text,text), public.beta2_snapshot_write(text,text),
  gamify_private.beta2_snapshot_load(integer,text,text), public.beta2_snapshot_load(integer,text,text),
  gamify_private.beta2_cloud_write(text,text) from public,anon,authenticated,service_role;
grant execute on function gamify_private.beta2_snapshot_write(text,text), public.beta2_snapshot_write(text,text),
  gamify_private.beta2_snapshot_load(integer,text,text), public.beta2_snapshot_load(integer,text,text),
  gamify_private.beta2_cloud_write(text,text), gamify_private.beta2_cloud_load(integer,text,text) to authenticated;
notify pgrst, 'reload schema';
commit;
