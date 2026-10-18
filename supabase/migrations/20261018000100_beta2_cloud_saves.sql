-- B2.2 revision 1, PostgreSQL 15/17 + Supabase. REVIEW BEFORE APPLICATION.
-- Additive, OFF by default. No extension installation or auto-grants.
-- Existing objects replaced: gamify_private.request_usage_data_deletion(),
-- gamify_private.purge_beta1_retained_data(). Public wrappers/Cron survive.
-- Protocol 3, cloud format 2 / evidence contract 1: compressed payloads are
-- OPAQUE bytea. The client verifies decoded content, Undo and prior fallback.
-- pgcrypto is already installed; every digest uses extensions.digest explicitly.
begin;

create table gamify_private.beta2_cloud_quota (
  singleton boolean primary key default true check (singleton),
  writes_enabled boolean not null default false,
  enrollments_enabled boolean not null default false,
  minimum_protocol integer not null default 3 check (minimum_protocol = 3),
  maximum_protocol integer not null default 3 check (maximum_protocol = 3),
  notice_version text not null default 'beta2.cloud.v1' check (notice_version = 'beta2.cloud.v1'),
  accounted_bytes bigint not null default 0 check (accounted_bytes >= 0),
  dead_bytes_estimate bigint not null default 0 check (dead_bytes_estimate >= 0),
  last_cleanup_verified_at timestamptz
);
insert into gamify_private.beta2_cloud_quota(singleton) values (true);

create table gamify_private.beta2_cloud_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  accepted_notice_version text,
  accepted_notice_at timestamptz,
  enrolled_at timestamptz,
  snapshot_bytes bigint not null default 0 check (snapshot_bytes >= 0),
  evidence_bytes bigint not null default 0 check (evidence_bytes between 0 and 2000000),
  auxiliary_bytes bigint not null default 8192 check (auxiliary_bytes >= 8192),
  check (snapshot_bytes + auxiliary_bytes <= 8000000),
  check ((accepted_notice_version is null) = (accepted_notice_at is null)),
  check (accepted_notice_version is null or accepted_notice_version = 'beta2.cloud.v1')
);
create table gamify_private.beta2_cloud_notices (
  user_id uuid primary key references gamify_private.beta2_cloud_accounts(user_id) on delete cascade,
  version text not null check (version = 'beta2.cloud.v1'),
  accepted_at timestamptz not null default clock_timestamp()
);
-- No Auth FK: restore-suppression ledger outlives the owner's 14-day backups.
create table gamify_private.beta2_cloud_deletions (
  subject_sha256 text primary key check (subject_sha256 ~ '^[0-9a-f]{64}$'),
  deleted_at timestamptz not null default clock_timestamp(),
  purge_after timestamptz not null default clock_timestamp() + interval '30 days'
);
create table public.beta2_campaigns (
  owner_id uuid not null references gamify_private.beta2_cloud_accounts(user_id) on delete cascade,
  campaign_id text not null check (octet_length(campaign_id) between 1 and 256),
  name text not null check (octet_length(name) between 1 and 160 and name = btrim(name) and name !~ '[[:cntrl:]]'),
  normalized_name text not null check (normalized_name = lower(name)),
  status text not null check (status in ('resumable','archived')),
  current_revision bigint not null check (current_revision > 0),
  prior_revision bigint check (prior_revision > 0 and prior_revision < current_revision),
  writer_generation bigint not null default 1 check (writer_generation > 0),
  current_sha256 text not null check (current_sha256 ~ '^[0-9a-f]{64}$'),
  evidence_high_water integer not null check (evidence_high_water between 0 and 50000),
  evidence_bytes bigint not null check (evidence_bytes between 1 and 1000000),
  header_sha256 text not null check (header_sha256 ~ '^[0-9a-f]{64}$'),
  import_operation_id text not null check (octet_length(import_operation_id) between 1 and 256),
  import_request_sha256 text not null check (import_request_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (owner_id,campaign_id),
  unique (owner_id,normalized_name),
  unique (owner_id,import_operation_id)
);
create table public.beta2_campaign_snapshots (
  owner_id uuid not null,
  campaign_id text not null,
  revision bigint not null check (revision > 0),
  content bytea not null check (octet_length(content) between 1 and 3000000),
  uncompressed_bytes integer not null check (uncompressed_bytes between 1 and 3000000),
  -- Uncompressed hash/length are declarations verified by the CLIENT on load.
  uncompressed_sha256 text not null check (uncompressed_sha256 ~ '^[0-9a-f]{64}$'),
  compressed_sha256 text not null check (compressed_sha256 ~ '^[0-9a-f]{64}$'),
  evidence_high_water integer not null check (evidence_high_water between 0 and 50000),
  accepted_at timestamptz not null default clock_timestamp(),
  primary key (owner_id,campaign_id,revision),
  foreign key (owner_id,campaign_id) references public.beta2_campaigns on delete cascade
);
create table public.beta2_evidence_headers (
  owner_id uuid not null,
  campaign_id text not null,
  content bytea not null check (octet_length(content) between 1 and 1000000),
  uncompressed_bytes integer not null check (uncompressed_bytes between 1 and 6000000),
  uncompressed_sha256 text not null check (uncompressed_sha256 ~ '^[0-9a-f]{64}$'),
  compressed_sha256 text not null check (compressed_sha256 ~ '^[0-9a-f]{64}$'),
  primary key (owner_id,campaign_id),
  foreign key (owner_id,campaign_id) references public.beta2_campaigns on delete cascade
);
create table public.beta2_evidence_pages (
  owner_id uuid not null,
  campaign_id text not null,
  first_record integer not null check (first_record between 0 and 49999),
  record_count integer not null check (record_count between 1 and 50000 and first_record + record_count <= 50000),
  accepted_revision bigint not null check (accepted_revision > 0),
  content bytea not null check (octet_length(content) between 1 and 1000000),
  uncompressed_bytes integer not null check (uncompressed_bytes between 1 and 6000000),
  uncompressed_sha256 text not null check (uncompressed_sha256 ~ '^[0-9a-f]{64}$'),
  compressed_sha256 text not null check (compressed_sha256 ~ '^[0-9a-f]{64}$'),
  primary key (owner_id,campaign_id,first_record),
  foreign key (owner_id,campaign_id) references public.beta2_campaigns on delete cascade
);
create table gamify_private.beta2_campaign_writers (
  owner_id uuid not null,
  campaign_id text not null,
  generation bigint not null check (generation > 0),
  token_sha256 text check (token_sha256 ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz,
  primary key (owner_id,campaign_id),
  foreign key (owner_id,campaign_id) references public.beta2_campaigns on delete cascade,
  check ((token_sha256 is null) = (expires_at is null))
);
create table gamify_private.beta2_campaign_operations (
  owner_id uuid not null,
  campaign_id text not null,
  operation_id text not null check (octet_length(operation_id) between 1 and 256),
  kind text not null check (kind in ('import','save')),
  request_sha256 text not null check (request_sha256 ~ '^[0-9a-f]{64}$'),
  expected_revision bigint not null check (expected_revision >= 0),
  accepted_revision bigint not null check (accepted_revision > expected_revision),
  receipt jsonb not null check (octet_length(receipt::text) <= 2048),
  accepted_at timestamptz not null default clock_timestamp(),
  primary key (owner_id,operation_id),
  foreign key (owner_id,campaign_id) references public.beta2_campaigns on delete cascade
);
create index beta2_operations_retention on gamify_private.beta2_campaign_operations(owner_id,accepted_at) where kind = 'save';
create index beta2_operations_campaign on gamify_private.beta2_campaign_operations(owner_id,campaign_id);
create table gamify_private.beta2_cloud_rates (
  owner_id uuid not null references gamify_private.beta2_cloud_accounts(user_id) on delete cascade,
  bucket text not null check (bucket in ('mutation','load','metadata','checkpoint','campaign')),
  campaign_id text not null default '' check (octet_length(campaign_id) <= 256),
  window_start timestamptz not null,
  calls integer not null check (calls > 0),
  primary key (owner_id,bucket,campaign_id),
  check ((bucket = 'campaign') = (campaign_id <> ''))
);

-- Every new table has RLS before any role receives access. Private tables have
-- no player policies/grants. service_role uses constrained RPCs, not raw saves.
do $ddl$
declare r record;
begin
  for r in select n.nspname, c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r' and n.nspname in ('public', 'gamify_private')
      and (c.relname like 'beta2\_%' escape '\')
  loop
    execute format('alter table %I.%I enable row level security', r.nspname, r.relname);
    execute format('revoke all on table %I.%I from public, anon, authenticated, service_role', r.nspname, r.relname);
  end loop;
end $ddl$;


create function gamify_private.beta2_hash(p_text text) returns text
language sql immutable strict security invoker set search_path = '' as $$
  select encode(extensions.digest(convert_to(p_text, 'UTF8'), 'sha256'), 'hex');
$$;

create function gamify_private.beta2_keys(p_value jsonb, p_keys text[]) returns boolean
language sql immutable security invoker set search_path = '' as $$
  select coalesce(jsonb_typeof(p_value) = 'object' and p_value ?& p_keys
    and (select count(*) from jsonb_object_keys(case when jsonb_typeof(p_value) = 'object' then p_value else '{}'::jsonb end)) = cardinality(p_keys), false);
$$;

create function gamify_private.beta2_uint(p_text text, p_max bigint default 9223372036854775807) returns bigint
language plpgsql immutable security invoker set search_path = '' as $$
begin
  if p_text is null or p_text !~ '^(0|[1-9][0-9]{0,18})$' then
    raise exception 'Invalid cloud integer' using errcode = '22023';
  end if;
  if p_text::numeric > p_max then
    raise exception 'Invalid cloud integer' using errcode = '22023';
  end if;
  return p_text::bigint;
end;
$$;

-- Validate only a fixed-size envelope and the compressed-byte digest/length.
create function gamify_private.beta2_blob(p_content jsonb, p_compressed_limit integer, p_declared_limit integer) returns bytea
language plpgsql immutable security invoker set search_path = '' as $$
declare payload bytea; compressed_size bigint; declared_size bigint; encoded text;
begin
  if not gamify_private.beta2_keys(p_content,array['encoding','dataBase64','compressedBytes','compressedSha256','uncompressedBytes','uncompressedSha256'])
    or p_content->>'encoding' is distinct from 'gzip' or jsonb_typeof(p_content->'dataBase64') is distinct from 'string'
    or jsonb_typeof(p_content->'compressedBytes') is distinct from 'number' or jsonb_typeof(p_content->'uncompressedBytes') is distinct from 'number'
    or jsonb_typeof(p_content->'compressedSha256') is distinct from 'string' or jsonb_typeof(p_content->'uncompressedSha256') is distinct from 'string'
    or p_content->>'compressedSha256' !~ '^[0-9a-f]{64}$' or p_content->>'uncompressedSha256' !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid opaque cloud payload envelope' using errcode = '22023'; end if;
  compressed_size := gamify_private.beta2_uint(p_content->>'compressedBytes',6000000);
  declared_size := gamify_private.beta2_uint(p_content->>'uncompressedBytes',6000000);
  if compressed_size < 1 or compressed_size > p_compressed_limit or declared_size < 1 or declared_size > p_declared_limit then
    raise exception 'Cloud payload size limit reached' using errcode = '54000'; end if;
  encoded := p_content->>'dataBase64';
  if octet_length(encoded) > ((compressed_size + 2) / 3) * 4 or length(encoded) % 4 <> 0 or encoded !~ '^[A-Za-z0-9+/]*={0,2}$' then
    raise exception 'Invalid cloud base64 envelope' using errcode = '22023'; end if;
  payload := decode(encoded,'base64');
  if octet_length(payload) <> compressed_size or encode(extensions.digest(payload,'sha256'),'hex') <> p_content->>'compressedSha256' then
    raise exception 'Cloud compressed length/hash mismatch' using errcode = '22023'; end if;
  return payload;
end;
$$;
create function gamify_private.beta2_packed(p_content bytea, p_bytes integer, p_sha256 text, p_compressed_sha256 text) returns jsonb
language sql immutable strict security invoker set search_path = '' as $$
  select jsonb_build_object('encoding','gzip','dataBase64',replace(encode(p_content,'base64'),E'\n',''),
    'compressedBytes',octet_length(p_content),'compressedSha256',p_compressed_sha256,
    'uncompressedBytes',p_bytes,'uncompressedSha256',p_sha256);
$$;

create function gamify_private.beta2_can_read_cloud() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      join gamify_private.beta2_cloud_accounts a on a.user_id = m.user_id
    where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
      and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
      and u.email_confirmed_at is not null and u.deleted_at is null and not coalesce(u.is_anonymous, false)
      and (u.banned_until is null or u.banned_until <= statement_timestamp())
      and a.accepted_notice_version = 'beta2.cloud.v1' and a.accepted_notice_at is not null
      and not exists (select 1 from gamify_private.beta2_cloud_deletions d where d.subject_sha256 = gamify_private.beta2_hash(m.user_id::text))
  );
$$;

create policy beta2_campaign_read on public.beta2_campaigns for select to authenticated
  using (owner_id = (select auth.uid()) and (select gamify_private.beta2_can_read_cloud()));
create policy beta2_snapshot_read on public.beta2_campaign_snapshots for select to authenticated
  using (owner_id = (select auth.uid()) and (select gamify_private.beta2_can_read_cloud()) and exists (
    select 1 from public.beta2_campaigns c where c.owner_id = beta2_campaign_snapshots.owner_id and c.campaign_id = beta2_campaign_snapshots.campaign_id));
create policy beta2_header_read on public.beta2_evidence_headers for select to authenticated
  using (owner_id = (select auth.uid()) and (select gamify_private.beta2_can_read_cloud()) and exists (
    select 1 from public.beta2_campaigns c where c.owner_id = beta2_evidence_headers.owner_id and c.campaign_id = beta2_evidence_headers.campaign_id));
create policy beta2_page_read on public.beta2_evidence_pages for select to authenticated
  using (owner_id = (select auth.uid()) and (select gamify_private.beta2_can_read_cloud()) and exists (
    select 1 from public.beta2_campaigns c where c.owner_id = beta2_evidence_pages.owner_id and c.campaign_id = beta2_evidence_pages.campaign_id));
-- No direct table SELECT grants: full downloads must use the bounded load RPC.
-- RLS remains defense in depth if a table grant is ever added by administration.

-- Lock order: membership -> account -> global quota -> campaign -> writer.
-- Wall clocks are read after blocking locks, never transaction start time.
create function gamify_private.beta2_require_cloud(p_protocol integer, p_write boolean default true, p_notice boolean default true) returns uuid
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.require_usage_player(false); a gamify_private.beta2_cloud_accounts%rowtype; q gamify_private.beta2_cloud_quota%rowtype;
begin
  select * into a from gamify_private.beta2_cloud_accounts where user_id = id for update;
  if not found or exists (select 1 from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(id::text)) then
    raise exception 'Cloud account access denied' using errcode = '42501'; end if;
  -- Recheck admission after the shared membership lock, including Auth bans.
  if not coalesce((gamify_private.get_usage_access()->>'admitted')::boolean, false) then raise exception 'Player access denied' using errcode = '42501'; end if;
  if p_write then select * into q from gamify_private.beta2_cloud_quota where singleton for update;
  else select * into q from gamify_private.beta2_cloud_quota where singleton; end if;
  if p_protocol is null or p_protocol < q.minimum_protocol or p_protocol > q.maximum_protocol then
    raise exception 'Cloud client update required' using errcode = '22023'; end if;
  if p_write and (not a.enabled or not q.writes_enabled) then raise exception 'Cloud writing unavailable' using errcode = '55000'; end if;
  if p_notice and (a.accepted_notice_version is distinct from q.notice_version or a.accepted_notice_at is null) then
    raise exception 'Cloud notice acceptance required' using errcode = '42501'; end if;
  if p_write and (q.accounted_bytes + q.dead_bytes_estimate + 50000000 > 400000000
    or pg_database_size(current_database()) + q.dead_bytes_estimate + 1048576 > 400000000) then
    raise exception 'Cloud project capacity reached' using errcode = '54000'; end if;
  return id;
end;
$$;

create function gamify_private.beta2_rate(p_id uuid, p_bucket text, p_campaign text default '') returns void
language plpgsql security definer set search_path = '' as $$
declare t timestamptz := clock_timestamp(); limit_calls integer; calls integer; start_at timestamptz;
begin
  limit_calls := case p_bucket when 'mutation' then 30 when 'load' then 6 when 'metadata' then 120 when 'checkpoint' then 12 when 'campaign' then 6 end;
  if limit_calls is null then raise exception 'Invalid cloud rate bucket' using errcode = '22023'; end if;
  insert into gamify_private.beta2_cloud_rates(owner_id, bucket, campaign_id, window_start, calls) values (p_id, p_bucket, p_campaign, t, 1)
    on conflict (owner_id, bucket, campaign_id) do update set
      calls = case when beta2_cloud_rates.window_start <= t - interval '60 seconds' then 1 else beta2_cloud_rates.calls + 1 end,
      window_start = case when beta2_cloud_rates.window_start <= t - interval '60 seconds' then t else beta2_cloud_rates.window_start end
    returning beta2_cloud_rates.calls, window_start into calls, start_at;
  if calls > limit_calls then raise exception 'Cloud request rate limit' using errcode = 'P0001',
    detail = jsonb_build_object('retryAfterSeconds', greatest(1, ceil(extract(epoch from start_at + interval '60 seconds' - t)))::integer)::text; end if;
end;
$$;

create function gamify_private.beta2_budget(p_id uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('snapshotBytes', snapshot_bytes, 'evidenceBytes', evidence_bytes, 'auxiliaryBytes', auxiliary_bytes,
    'snapshotLimitBytes', 8000000, 'evidenceLimitBytes', 2000000, 'campaignLimit', 2,
    'warning', snapshot_bytes + auxiliary_bytes >= 6400000 or evidence_bytes >= 1600000
      or exists (select 1 from public.beta2_campaigns c where c.owner_id = p_id and c.evidence_bytes >= 800000))
  from gamify_private.beta2_cloud_accounts where user_id = p_id;
$$;

create function gamify_private.beta2_reserve(p_id uuid, p_snapshot_delta bigint, p_evidence_delta bigint, p_auxiliary_delta bigint, p_transient bigint) returns void
language plpgsql security definer set search_path = '' as $$
declare a gamify_private.beta2_cloud_accounts%rowtype; q gamify_private.beta2_cloud_quota%rowtype; delta bigint;
begin
  select * into a from gamify_private.beta2_cloud_accounts where user_id = p_id;
  select * into q from gamify_private.beta2_cloud_quota where singleton;
  delta := p_snapshot_delta + p_evidence_delta + p_auxiliary_delta;
  if a.snapshot_bytes + p_snapshot_delta < 0 or a.evidence_bytes + p_evidence_delta not between 0 and 2000000
    or a.auxiliary_bytes + p_auxiliary_delta < 8192
    or a.snapshot_bytes + p_snapshot_delta + a.auxiliary_bytes + p_auxiliary_delta > 8000000 then
    raise exception 'Cloud account capacity reached' using errcode = '54000'; end if;
  -- Reserve third-copy/new evidence/index/cleanup headroom BEFORE inserts and
  -- BEFORE pruning. Deleted tuple estimates are not credited as free space.
  if p_transient < 0 or q.accounted_bytes + delta + q.dead_bytes_estimate + 50000000 > 400000000
    or pg_database_size(current_database()) + p_transient * 2 + q.dead_bytes_estimate + 1048576 > 400000000 then
    raise exception 'Cloud project capacity reached' using errcode = '54000'; end if;
  update gamify_private.beta2_cloud_accounts set snapshot_bytes = snapshot_bytes + p_snapshot_delta,
    evidence_bytes = evidence_bytes + p_evidence_delta, auxiliary_bytes = auxiliary_bytes + p_auxiliary_delta where user_id = p_id;
  update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes + delta where singleton;
end;
$$;

create function gamify_private.beta2_cloud_access(p_protocol integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.require_usage_player(false); a gamify_private.beta2_cloud_accounts%rowtype; q gamify_private.beta2_cloud_quota%rowtype;
begin
  select * into q from gamify_private.beta2_cloud_quota where singleton;
  if p_protocol is distinct from 3 then raise exception 'Cloud client update required' using errcode = '22023'; end if;
  select * into a from gamify_private.beta2_cloud_accounts where user_id = id for update;
  if found then perform gamify_private.beta2_rate(id, 'metadata'); end if;
  return jsonb_build_object('protocolVersion',3,'cloudFormatVersion',2,'enabled',coalesce(a.enabled,false),
    'writesEnabled',q.writes_enabled,'enrollmentsEnabled',q.enrollments_enabled,'noticeVersion',q.notice_version,
    'noticeAccepted',coalesce(a.accepted_notice_version = q.notice_version and a.accepted_notice_at is not null,false),
    'enrolled',a.enrolled_at is not null,'quota',gamify_private.beta2_budget(id));
end;
$$;

create function gamify_private.beta2_accept_cloud_notice(p_protocol integer, p_version text) returns void
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol, false, false);
begin
  if p_version is distinct from 'beta2.cloud.v1' then raise exception 'Unsupported cloud notice' using errcode = '22023'; end if;
  perform gamify_private.beta2_rate(id, 'mutation');
  update gamify_private.beta2_cloud_accounts set accepted_notice_version = p_version, accepted_notice_at = coalesce(accepted_notice_at, clock_timestamp()) where user_id = id;
  insert into gamify_private.beta2_cloud_notices(user_id, version) values (id, p_version) on conflict (user_id) do nothing;
end;
$$;

create function gamify_private.beta2_cloud_lease(p_protocol integer, p_campaign_id text, p_action text,
  p_expected_revision text, p_writer_generation text, p_writer_token text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol); c public.beta2_campaigns%rowtype;
  w gamify_private.beta2_campaign_writers%rowtype; rev bigint; gen bigint; token text; t timestamptz;
begin
  perform gamify_private.beta2_rate(id, 'mutation');
  rev := gamify_private.beta2_uint(p_expected_revision); gen := gamify_private.beta2_uint(p_writer_generation);
  if p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256
    or p_action is null or p_action not in ('acquire','takeover','renew','release') or p_writer_token is null or p_writer_token !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid cloud lease request' using errcode = '22023'; end if;
  token := gamify_private.beta2_hash(p_writer_token);
  select * into c from public.beta2_campaigns where owner_id = id and campaign_id = p_campaign_id for update;
  if not found then raise exception 'Cloud campaign unavailable' using errcode = '42501'; end if;
  select * into w from gamify_private.beta2_campaign_writers where owner_id = id and campaign_id = p_campaign_id for update;
  if not found then raise exception 'Cloud writer unavailable' using errcode = '55000'; end if;
  t := clock_timestamp();
  if rev <> c.current_revision then raise exception 'Cloud revision conflict' using errcode = '40001'; end if;
  -- Identical acquire/takeover retry never steals another token or extends time.
  if p_action in ('acquire','takeover') and w.generation = c.writer_generation and w.token_sha256 = token and w.expires_at > t
    and (gen = w.generation or (gen < 9223372036854775807 and gen + 1 = w.generation)) then
    return jsonb_build_object('revision',c.current_revision::text,'writerGeneration',w.generation::text,'expiresAt',w.expires_at,'serverTime',t);
  end if;
  if gen <> w.generation or gen <> c.writer_generation then raise exception 'Cloud writer fenced' using errcode = '55000'; end if;
  if p_action in ('renew','release') then
    if w.token_sha256 is distinct from token or w.expires_at is null or w.expires_at <= t then
      raise exception 'Cloud lease expired or fenced' using errcode = '55000'; end if;
    if p_action = 'release' then
      update gamify_private.beta2_campaign_writers set token_sha256 = null, expires_at = null where owner_id = id and campaign_id = p_campaign_id;
      return jsonb_build_object('revision',rev::text,'writerGeneration',gen::text,'released',true,'serverTime',t);
    end if;
  else
    if p_action = 'acquire' and w.expires_at > t then raise exception 'Cloud campaign open elsewhere' using errcode = '55000'; end if;
    if gen = 9223372036854775807 then raise exception 'Cloud generation exhausted' using errcode = '54000'; end if;
    gen := gen + 1;
    update public.beta2_campaigns set writer_generation = gen where owner_id = id and campaign_id = p_campaign_id;
  end if;
  update gamify_private.beta2_campaign_writers set generation = gen, token_sha256 = token, expires_at = t + interval '60 seconds'
    where owner_id = id and campaign_id = p_campaign_id;
  return jsonb_build_object('revision',rev::text,'writerGeneration',gen::text,'expiresAt',t + interval '60 seconds','serverTime',t);
end;
$$;

create function gamify_private.beta2_storage_cost(p_bytes bigint) returns bigint
language sql immutable strict security invoker set search_path = '' as $$
  -- Binary payload + 12.5% tuple/TOAST/index allowance + bounded identity row.
  -- Physical/project checks are additional; this is not a storage measurement.
  select p_bytes + (p_bytes + 7) / 8 + 2048;
$$;

create function gamify_private.beta2_operation_cost(p_row gamify_private.beta2_campaign_operations) returns bigint
language sql immutable strict security invoker set search_path = '' as $$
  -- Deterministic across insertion/TOAST and later retention reads. Include
  -- duplicated identity/index bytes, fixed fields and the bounded receipt.
  select 2::bigint * (octet_length((p_row).operation_id) + octet_length((p_row).campaign_id))
    + octet_length((p_row).receipt::text) + 1024;
$$;

-- Hash the exact immutable UTF-8 request. Native JSON/base64/digest processing
-- only; bounded loops visit <=512 NEW page envelopes and never payload bytes.
create function gamify_private.beta2_cloud_write(p_request_text text, p_request_sha256 text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  req jsonb; id uuid; cid text; operation_key text; kind text; base bigint; gen bigint; token text; issued timestamptz;
  c public.beta2_campaigns%rowtype; w gamify_private.beta2_campaign_writers%rowtype;
  previous gamify_private.beta2_campaign_operations%rowtype; operation_row gamify_private.beta2_campaign_operations%rowtype;
  evidence jsonb; page jsonb; content jsonb; meta jsonb;
  snapshot_data bytea; header_data bytea; page_data bytea;
  from_record integer; to_record integer; cursor_record integer; count_records integer; stored_pages bigint;
  declared_total bigint; new_declared bigint := 0; old_declared bigint := 0; old_records bigint := 0;
  new_evidence_cost bigint := 0; snapshot_cost bigint; pruned_cost bigint := 0; op_cost bigint;
  accepted_revision bigint; t timestamptz; receipt jsonb;
begin
  if p_request_text is null or octet_length(p_request_text) > 6000000
    or p_request_sha256 is null or p_request_sha256 !~ '^[0-9a-f]{64}$'
    or gamify_private.beta2_hash(p_request_text) <> p_request_sha256
    or octet_length(jsonb_build_object('p_request_text',p_request_text,'p_request_sha256',p_request_sha256)::text) > 6000000 then
    raise exception 'Invalid cloud request bytes/hash' using errcode = '22023'; end if;
  req := p_request_text::jsonb;
  if not gamify_private.beta2_keys(req,array['protocolVersion','cloudFormatVersion','evidenceContractVersion','campaign',
      'action','operationId','issuedAt','expectedRevision','writerGeneration','writerToken','campaignId','snapshot','evidence','usageReceipts'])
    or req->'protocolVersion' is distinct from '3'::jsonb
    or req->'cloudFormatVersion' is distinct from '2'::jsonb or req->'evidenceContractVersion' is distinct from '1'::jsonb
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
  evidence := req->'evidence';
  if not gamify_private.beta2_keys(evidence,case when kind = 'import' then array['header','fromRecord','toRecord','pages'] else array['headerSha256','fromRecord','toRecord','pages'] end)
    or jsonb_typeof(evidence->'fromRecord') is distinct from 'number' or jsonb_typeof(evidence->'toRecord') is distinct from 'number'
    or jsonb_typeof(evidence->'pages') is distinct from 'array' then
    raise exception 'Invalid cloud evidence envelope' using errcode = '22023'; end if;
  if jsonb_array_length(evidence->'pages') > 512 then raise exception 'Cloud page count limit' using errcode = '54000'; end if;
  from_record := gamify_private.beta2_uint(evidence->>'fromRecord',50000)::integer;
  to_record := gamify_private.beta2_uint(evidence->>'toRecord',50000)::integer;
  if from_record <> (case when kind = 'import' then 0 else c.evidence_high_water end) or to_record < from_record then
    raise exception 'Cloud evidence prefix conflict' using errcode = '22023'; end if;
  snapshot_data := gamify_private.beta2_blob(req->'snapshot',3000000,3000000);
  declared_total := (req->'snapshot'->>'uncompressedBytes')::bigint;
  snapshot_cost := gamify_private.beta2_storage_cost(octet_length(snapshot_data));
  if kind = 'import' then
    header_data := gamify_private.beta2_blob(evidence->'header',1000000,6000000);
    new_evidence_cost := gamify_private.beta2_storage_cost(octet_length(header_data));
    new_declared := (evidence->'header'->>'uncompressedBytes')::bigint;
    declared_total := declared_total + new_declared;
    stored_pages := 0;
  else
    if jsonb_typeof(evidence->'headerSha256') is distinct from 'string' or evidence->>'headerSha256' is distinct from c.header_sha256 then
      raise exception 'Immutable cloud header conflict' using errcode = '22023'; end if;
    -- Inspect bounded metadata only. Previously sealed bytea is never read or
    -- decoded in the write path; its accepted prefix remains immutable.
    select coalesce(sum(p.uncompressed_bytes),0),coalesce(sum(p.record_count),0),count(*)
      into old_declared,old_records,stored_pages from public.beta2_evidence_pages p where owner_id = id and campaign_id = cid;
    if old_records <> from_record then raise exception 'Stored cloud evidence prefix mismatch' using errcode = '22023'; end if;
    declared_total := declared_total + old_declared + (select h.uncompressed_bytes from public.beta2_evidence_headers h where owner_id = id and campaign_id = cid);
  end if;
  cursor_record := from_record;
  for page in select value from jsonb_array_elements(evidence->'pages') loop
    if not gamify_private.beta2_keys(page,array['firstRecord','recordCount','content'])
      or jsonb_typeof(page->'firstRecord') is distinct from 'number' or jsonb_typeof(page->'recordCount') is distinct from 'number' then
      raise exception 'Invalid cloud page envelope' using errcode = '22023'; end if;
    count_records := gamify_private.beta2_uint(page->>'recordCount',50000)::integer;
    if gamify_private.beta2_uint(page->>'firstRecord',49999) <> cursor_record or count_records < 1 or cursor_record + count_records > 50000 then
      raise exception 'Cloud page gap/rewrite denied' using errcode = '22023'; end if;
    content := page->'content'; page_data := gamify_private.beta2_blob(content,1000000,6000000);
    declared_total := declared_total + (content->>'uncompressedBytes')::bigint;
    new_declared := new_declared + (content->>'uncompressedBytes')::bigint;
    new_evidence_cost := new_evidence_cost + gamify_private.beta2_storage_cost(octet_length(page_data));
    cursor_record := cursor_record + count_records;
  end loop;
  if cursor_record <> to_record then raise exception 'Cloud evidence suffix mismatch' using errcode = '22023'; end if;
  if declared_total is null or declared_total > 6000000 or (kind = 'save' and new_declared > 1000000)
    or new_evidence_cost + (case when kind = 'save' then c.evidence_bytes else 0 end) > 1000000
    or stored_pages + jsonb_array_length(evidence->'pages') > 512 then
    raise exception 'Cloud evidence capacity reached' using errcode = '54000'; end if;
  if kind = 'save' then
    select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(s.content))),0) into pruned_cost
      from public.beta2_campaign_snapshots s where owner_id = id and campaign_id = cid and revision <> c.current_revision;
  end if;
  perform gamify_private.beta2_rate(id,'checkpoint'); perform gamify_private.beta2_rate(id,'campaign',cid);
  t := clock_timestamp();
  receipt := jsonb_build_object('operationId',operation_key,'requestSha256',p_request_sha256,'revision',accepted_revision::text,
    'writerGeneration',case when kind = 'import' then '1' else gen::text end,
    'snapshotSha256',req->'snapshot'->>'uncompressedSha256','snapshotBytes',req->'snapshot'->'uncompressedBytes',
    'storedSnapshotBytes',octet_length(snapshot_data),'evidenceHighWater',to_record,'acceptedAt',t);
  operation_row := row(id,cid,operation_key,kind,p_request_sha256,base,accepted_revision,receipt,t)::gamify_private.beta2_campaign_operations;
  op_cost := gamify_private.beta2_operation_cost(operation_row);
  perform gamify_private.beta2_reserve(id,snapshot_cost - pruned_cost,new_evidence_cost,
    op_cost + case when kind = 'import' then 4096 else 0 end,snapshot_cost + new_evidence_cost + op_cost + 4096);
  if kind = 'import' then
    insert into public.beta2_campaigns(owner_id,campaign_id,name,normalized_name,status,current_revision,current_sha256,evidence_high_water,
      evidence_bytes,header_sha256,import_operation_id,import_request_sha256,created_at,updated_at)
      values(id,cid,meta->>'name',lower(meta->>'name'),meta->>'status',1,req->'snapshot'->>'uncompressedSha256',to_record,
        new_evidence_cost,evidence->'header'->>'uncompressedSha256',operation_key,p_request_sha256,t,t);
    content := evidence->'header';
    insert into public.beta2_evidence_headers(owner_id,campaign_id,content,uncompressed_bytes,uncompressed_sha256,compressed_sha256)
      values(id,cid,header_data,(content->>'uncompressedBytes')::integer,content->>'uncompressedSha256',content->>'compressedSha256');
    insert into gamify_private.beta2_campaign_writers values(id,cid,1,token,clock_timestamp() + interval '60 seconds');
    update gamify_private.beta2_cloud_accounts set enrolled_at = coalesce(enrolled_at,t) where user_id = id;
  end if;
  -- These envelopes were validated above. Decode once more natively for storage;
  -- this bounded second pass avoids copying growing bytea arrays in PL/pgSQL.
  for page in select value from jsonb_array_elements(evidence->'pages') loop
    content := page->'content';
    insert into public.beta2_evidence_pages(owner_id,campaign_id,first_record,record_count,accepted_revision,content,uncompressed_bytes,uncompressed_sha256,compressed_sha256)
      values(id,cid,(page->>'firstRecord')::integer,(page->>'recordCount')::integer,accepted_revision,
        decode(content->>'dataBase64','base64'),(content->>'uncompressedBytes')::integer,content->>'uncompressedSha256',content->>'compressedSha256');
  end loop;
  -- Only already-issued question receipts use the existing Beta 1 dedup path.
  -- No counts are inferred from, or replayed out of, opaque imported history.
  if jsonb_array_length(req->'usageReceipts') > 0 then
    if exists(select 1 from jsonb_array_elements(req->'usageReceipts') r where r->>'kind' is distinct from 'question') then
      raise exception 'Invalid cloud question receipt' using errcode = '22023'; end if;
    perform gamify_private.ingest_player_usage(req->'usageReceipts','first-scored-patient-and-employee.v1');
  end if;
  if kind = 'save' and w.expires_at <= clock_timestamp() then raise exception 'Cloud lease expired during acceptance' using errcode = '55000'; end if;
  content := req->'snapshot';
  insert into public.beta2_campaign_snapshots(owner_id,campaign_id,revision,content,uncompressed_bytes,uncompressed_sha256,compressed_sha256,evidence_high_water,accepted_at)
    values(id,cid,accepted_revision,snapshot_data,(content->>'uncompressedBytes')::integer,
      content->>'uncompressedSha256',content->>'compressedSha256',to_record,t);
  if kind = 'save' then
    update public.beta2_campaigns set name = meta->>'name',normalized_name = lower(meta->>'name'),status = meta->>'status',
      prior_revision = current_revision,current_revision = accepted_revision,current_sha256 = content->>'uncompressedSha256',
      evidence_high_water = to_record,evidence_bytes = evidence_bytes + new_evidence_cost,updated_at = t where owner_id = id and campaign_id = cid;
    delete from public.beta2_campaign_snapshots where owner_id = id and campaign_id = cid and revision not in (accepted_revision,base);
    update gamify_private.beta2_cloud_quota set dead_bytes_estimate = dead_bytes_estimate + pruned_cost where singleton;
  end if;
  insert into gamify_private.beta2_campaign_operations select (operation_row).*;
  return receipt;
exception when invalid_parameter_value then raise;
  -- Preserve deliberate protocol/operation-expiry errors for the adapter while
  -- sanitizing cast/JSON failures that could otherwise echo request contents.
  when data_exception then raise exception 'Invalid cloud write data' using errcode = '22023';
  when unique_violation then raise exception 'Cloud campaign name or identity conflict' using errcode = '22023';
end;
$$;

create function gamify_private.beta2_cloud_list(p_protocol integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol, false); campaigns jsonb;
begin
  perform gamify_private.beta2_rate(id, 'metadata');
  select coalesce(jsonb_agg(jsonb_build_object('campaignId',c.campaign_id,'name',c.name,'status',c.status,
    'revision',c.current_revision::text,'priorRevision',c.prior_revision::text,'writerGeneration',c.writer_generation::text,
    'snapshotSha256',c.current_sha256,'headerSha256',c.header_sha256,'evidenceHighWater',c.evidence_high_water,
    'createdAt',c.created_at,'updatedAt',c.updated_at,'leaseExpiresAt',w.expires_at,'writerActive',coalesce(w.expires_at > clock_timestamp(),false))
    order by c.created_at,c.campaign_id),'[]') into campaigns
    from public.beta2_campaigns c left join gamify_private.beta2_campaign_writers w using(owner_id,campaign_id) where c.owner_id = id;
  return jsonb_build_object('campaigns',campaigns,'quota',gamify_private.beta2_budget(id),'serverTime',clock_timestamp());
end;
$$;

create function gamify_private.beta2_cloud_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol, false); c public.beta2_campaigns%rowtype;
  s public.beta2_campaign_snapshots%rowtype; h public.beta2_evidence_headers%rowtype; pages jsonb; record_count bigint; decoded bigint;
begin
  perform gamify_private.beta2_rate(id, 'load');
  if p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256 then
    raise exception 'Invalid cloud campaign ID' using errcode = '22023'; end if;
  select * into c from public.beta2_campaigns where owner_id = id and campaign_id = p_campaign_id;
  if not found then raise exception 'Cloud campaign unavailable' using errcode = '42501'; end if;
  select * into s from public.beta2_campaign_snapshots where owner_id = id and campaign_id = p_campaign_id
    and revision = case when p_revision is null then c.current_revision else gamify_private.beta2_uint(p_revision) end;
  if not found then raise exception 'Cloud revision unavailable' using errcode = '22023'; end if;
  select * into h from public.beta2_evidence_headers where owner_id = id and campaign_id = p_campaign_id;
  if not found then raise exception 'Stored cloud header unavailable' using errcode = '22023'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('firstRecord',p.first_record,'recordCount',p.record_count,
    'content',gamify_private.beta2_packed(p.content,p.uncompressed_bytes,p.uncompressed_sha256,p.compressed_sha256)) order by p.first_record),'[]'),
    coalesce(sum(p.record_count),0),coalesce(sum(p.uncompressed_bytes),0) into pages,record_count,decoded
    from public.beta2_evidence_pages p where owner_id = id and campaign_id = p_campaign_id
      and p.first_record + p.record_count <= s.evidence_high_water and p.accepted_revision <= s.revision;
  if record_count <> s.evidence_high_water or decoded + h.uncompressed_bytes + s.uncompressed_bytes > 6000000 then
    raise exception 'Stored cloud prefix invalid' using errcode = '22023'; end if;
  return jsonb_build_object('revision',s.revision::text,'writerGeneration',c.writer_generation::text,'acceptedAt',s.accepted_at,
    'snapshot',gamify_private.beta2_packed(s.content,s.uncompressed_bytes,s.uncompressed_sha256,s.compressed_sha256),
    'evidence',jsonb_build_object('header',gamify_private.beta2_packed(h.content,h.uncompressed_bytes,h.uncompressed_sha256,h.compressed_sha256),'pages',pages),
    'quota',gamify_private.beta2_budget(id),'serverTime',clock_timestamp());
end;
$$;

create function gamify_private.beta2_cloud_operation(p_protocol integer, p_operation_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare id uuid := gamify_private.beta2_require_cloud(p_protocol, false); receipt jsonb;
begin
  perform gamify_private.beta2_rate(id, 'metadata');
  if p_operation_id is null or octet_length(p_operation_id) not between 1 and 256 then raise exception 'Invalid cloud operation ID' using errcode = '22023'; end if;
  select o.receipt into receipt from gamify_private.beta2_campaign_operations o where owner_id = id and operation_id = p_operation_id;
  return case when found then jsonb_build_object('status','accepted','receipt',receipt) else jsonb_build_object('status','unknown') end;
end;
$$;

create function gamify_private.beta2_guard_account_delete() returns trigger
language plpgsql security definer set search_path = '' as $$
declare amount bigint := old.snapshot_bytes + old.evidence_bytes + old.auxiliary_bytes; added integer;
begin
  perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
  insert into gamify_private.beta2_cloud_deletions(subject_sha256) values(gamify_private.beta2_hash(old.user_id::text)) on conflict do nothing;
  get diagnostics added = row_count;
  update gamify_private.beta2_cloud_deletions set purge_after = greatest(purge_after,clock_timestamp() + interval '30 days') where subject_sha256 = gamify_private.beta2_hash(old.user_id::text);
  update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes - amount + added * 1024, dead_bytes_estimate = dead_bytes_estimate + amount where singleton;
  return old;
end;
$$;

create trigger beta2_account_delete before delete on gamify_private.beta2_cloud_accounts
  for each row execute function gamify_private.beta2_guard_account_delete();

create function gamify_private.beta2_delete_my_data(p_scope text, p_notice_version text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid(); added integer;
begin
  if p_scope is distinct from 'all-account-data.v1' or p_notice_version is distinct from 'beta2.cloud.v1' then
    raise exception 'Full account data confirmation required' using errcode = '22023'; end if;
  perform 1 from auth.users u where u.id = v_id and u.email_confirmed_at is not null and u.deleted_at is null and not coalesce(u.is_anonymous,false);
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.beta2_cloud_accounts where user_id = v_id for update;
  perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at,clock_timestamp()),accepted_notice_version = null,accepted_notice_at = null where user_id = v_id;
  -- Fence before cascading. The protected membership tombstone remains.
  update gamify_private.beta2_campaign_writers set generation = case when generation < 9223372036854775807 then generation + 1 else generation end,
    token_sha256 = null, expires_at = null where owner_id = v_id;
  insert into gamify_private.beta2_cloud_deletions(subject_sha256) values(gamify_private.beta2_hash(v_id::text)) on conflict do nothing;
  get diagnostics added = row_count;
  update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes + added * 1024 where singleton;
  delete from gamify_private.beta2_cloud_accounts where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from public.tester_feedback where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
  delete from gamify_private.usage_owners where user_id = v_id;
  -- Membership is blocked before setup finalization can regain its lock.
  -- Avoid the inverse setup-email -> membership lock order: invitation cleanup
  -- remains the owner's seven-day task; finalization cannot undo the tombstone.
end;
$$;

create or replace function gamify_private.request_usage_data_deletion()
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid();
begin
  if v_id is null or not exists (select 1 from auth.users where id = v_id and email_confirmed_at is not null and deleted_at is null
    and not coalesce(is_anonymous, false)) then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.beta2_cloud_accounts where user_id = v_id for update;
  if exists (select 1 from gamify_private.beta2_cloud_accounts where user_id = v_id and enrolled_at is not null)
    or exists (select 1 from public.beta2_campaigns where owner_id = v_id) then
    raise exception 'Cloud data deletion requires updated confirmation' using errcode = '55000'; end if;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at, now()),
    accepted_notice_version = null, accepted_notice_at = null where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from public.tester_feedback where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
  delete from gamify_private.beta2_cloud_accounts where user_id = v_id;
end;
$$;

create function gamify_private.beta2_purge_cloud_data() returns void
language plpgsql security definer set search_path = '' as $$
declare target record; amount bigint; removed bigint; cutoff timestamptz := clock_timestamp() - interval '8 days';
begin
  for target in select m.user_id from gamify_private.player_memberships m
    where exists (select 1 from gamify_private.beta2_cloud_accounts a where a.user_id = m.user_id)
    order by m.user_id for update of m skip locked
  loop
    perform 1 from gamify_private.beta2_cloud_accounts where user_id = target.user_id for update skip locked;
    if not found then continue; end if;
    perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
    select coalesce(sum(gamify_private.beta2_operation_cost(o)),0) into amount
      from gamify_private.beta2_campaign_operations o where owner_id = target.user_id and kind = 'save' and accepted_at <= cutoff;
    delete from gamify_private.beta2_campaign_operations where owner_id = target.user_id and kind = 'save' and accepted_at <= cutoff;
    update gamify_private.beta2_cloud_accounts set auxiliary_bytes = auxiliary_bytes - amount where user_id = target.user_id;
    delete from gamify_private.beta2_cloud_rates where owner_id = target.user_id and window_start <= cutoff;
    get diagnostics removed = row_count;
    update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes - amount,
      dead_bytes_estimate = dead_bytes_estimate + amount + removed * 1024 where singleton;
    -- Remove dead tokens, never reset the generation or delete campaign history.
    update gamify_private.beta2_campaign_writers set token_sha256 = null,expires_at = null where owner_id = target.user_id and expires_at <= clock_timestamp();
  end loop;
  perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
  delete from gamify_private.beta2_cloud_deletions where purge_after <= clock_timestamp();
  get diagnostics removed = row_count;
  update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes - removed * 1024,dead_bytes_estimate = dead_bytes_estimate + removed * 1024 where singleton;
end;
$$;

create or replace function gamify_private.purge_beta1_retained_data()
returns void language plpgsql security invoker set search_path = '' as $$
begin
  delete from gamify_private.usage_receipts where occurred_at <= now() - interval '8 days';
  delete from public.player_usage_days where usage_date < (now() at time zone 'UTC')::date - 89;
  delete from public.question_flags where received_at <= now() - interval '90 days';
  delete from public.tester_feedback where created_at <= now() - interval '90 days';
  delete from gamify_private.usage_ingest_limits where window_start < now() - interval '8 days';
  delete from gamify_private.setup_codes where greatest(used_at, cancelled_at) <= now() - interval '90 days';
  perform gamify_private.beta2_purge_cloud_data();
end;
$$;

create function gamify_private.beta2_admin_cloud(p_action text, p_user_id uuid default null, p_settings jsonb default '{}') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare a gamify_private.beta2_cloud_accounts%rowtype; amount bigint; relations jsonb;
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then raise exception 'Cloud administration denied' using errcode = '42501'; end if;
  if p_action is null or p_action not in ('inspect','configure','account','purge','acknowledge_cleanup') or p_settings is null then
    raise exception 'Invalid cloud administration request' using errcode = '22023'; end if;
  if p_action = 'account' then
    if p_user_id is null or not gamify_private.beta2_keys(p_settings,array['enabled']) or jsonb_typeof(p_settings->'enabled') <> 'boolean' then
      raise exception 'Invalid cloud account configuration' using errcode = '22023'; end if;
    perform 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      where m.user_id = p_user_id and m.revoked_at is null and m.deletion_requested_at is null and u.deleted_at is null
        and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
        and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
        and (u.banned_until is null or u.banned_until <= clock_timestamp()) for update of m;
    if not found or exists(select 1 from gamify_private.beta2_cloud_deletions where subject_sha256 = gamify_private.beta2_hash(p_user_id::text)) then
      raise exception 'Cloud account admission denied' using errcode = '42501'; end if;
    select * into a from gamify_private.beta2_cloud_accounts where user_id = p_user_id for update;
    if not found then
      perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
      if exists (select 1 from gamify_private.beta2_cloud_quota where singleton and
        (accounted_bytes + 8192 + dead_bytes_estimate + 50000000 > 400000000
          or pg_database_size(current_database()) + dead_bytes_estimate + 16384 + 1048576 > 400000000)) then
        raise exception 'Cloud project capacity reached' using errcode = '54000'; end if;
      insert into gamify_private.beta2_cloud_accounts(user_id,enabled) values(p_user_id,(p_settings->>'enabled')::boolean);
      update gamify_private.beta2_cloud_quota set accounted_bytes = accounted_bytes + 8192 where singleton;
    else update gamify_private.beta2_cloud_accounts set enabled = (p_settings->>'enabled')::boolean where user_id = p_user_id; end if;
    return jsonb_build_object('userId',p_user_id,'enabled',(p_settings->>'enabled')::boolean,'quota',gamify_private.beta2_budget(p_user_id));
  end if;
  if p_user_id is not null then raise exception 'Unexpected cloud account argument' using errcode = '22023'; end if;
  if p_action = 'configure' then
    if not gamify_private.beta2_keys(p_settings,array['writesEnabled','enrollmentsEnabled'])
      or jsonb_typeof(p_settings->'writesEnabled') <> 'boolean' or jsonb_typeof(p_settings->'enrollmentsEnabled') <> 'boolean' then
      raise exception 'Invalid cloud project configuration' using errcode = '22023'; end if;
    update gamify_private.beta2_cloud_quota set writes_enabled = (p_settings->>'writesEnabled')::boolean,enrollments_enabled = (p_settings->>'enrollmentsEnabled')::boolean where singleton;
  elsif p_action = 'acknowledge_cleanup' then
    if p_settings is distinct from '{"vacuumVerified":true}'::jsonb then raise exception 'Owner vacuum verification required' using errcode = '22023'; end if;
    -- EXPLICIT operational attestation after VACUUM outside this transaction;
    -- neither DELETE nor a statistics estimate proves reclaimed physical space.
    update gamify_private.beta2_cloud_quota set dead_bytes_estimate = 0,last_cleanup_verified_at = clock_timestamp() where singleton;
  else
    if p_settings <> '{}'::jsonb then raise exception 'Unexpected cloud settings' using errcode = '22023'; end if;
    if p_action = 'purge' then perform gamify_private.beta2_purge_cloud_data(); end if;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('schema',n.nspname,'relation',c.relname,'bytes',pg_total_relation_size(c.oid),
    'deadTupleEstimate',coalesce(s.n_dead_tup,0)) order by n.nspname,c.relname),'[]') into relations
    from pg_class c join pg_namespace n on n.oid = c.relnamespace left join pg_stat_all_tables s on s.relid = c.oid
    where c.relkind = 'r' and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\';
  return jsonb_build_object('databaseBytes',pg_database_size(current_database()),'ownerWarning',
    pg_database_size(current_database()) >= 300000000 or (select accounted_bytes + dead_bytes_estimate >= 300000000 from gamify_private.beta2_cloud_quota where singleton),
    'workingCeilingBytes',400000000,'quota',(select to_jsonb(q) from gamify_private.beta2_cloud_quota q where singleton),
    'accounts',(select count(*) from gamify_private.beta2_cloud_accounts),'campaigns',(select count(*) from public.beta2_campaigns),'relations',relations);
end;
$$;

create function public.beta2_cloud_access(p_protocol integer) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_access(p_protocol); $$;
create function public.beta2_accept_cloud_notice(p_protocol integer, p_version text) returns void
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_accept_cloud_notice(p_protocol,p_version); $$;
create function public.beta2_cloud_list(p_protocol integer) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_list(p_protocol); $$;
create function public.beta2_cloud_load(p_protocol integer, p_campaign_id text, p_revision text default null) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_load(p_protocol,p_campaign_id,p_revision); $$;
create function public.beta2_cloud_lease(p_protocol integer, p_campaign_id text, p_action text, p_expected_revision text, p_writer_generation text, p_writer_token text) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_lease(p_protocol,p_campaign_id,p_action,p_expected_revision,p_writer_generation,p_writer_token); $$;
create function public.beta2_cloud_write(p_request_text text, p_request_sha256 text) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_write(p_request_text,p_request_sha256); $$;
create function public.beta2_cloud_operation(p_protocol integer, p_operation_id text) returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_cloud_operation(p_protocol,p_operation_id); $$;
create function public.beta2_delete_my_data(p_scope text, p_notice_version text) returns void
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_delete_my_data(p_scope,p_notice_version); $$;
create function public.beta2_admin_cloud(p_action text, p_user_id uuid default null, p_settings jsonb default '{}') returns jsonb
language sql security invoker set search_path = '' as $$ select gamify_private.beta2_admin_cloud(p_action,p_user_id,p_settings); $$;

-- Revoke ONLY new Beta 2 functions. Do not reset Beta 1 helper/tool ACLs.
do $acl$
declare r record;
begin
  for r in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public','gamify_private') and p.proname like 'beta2\_%' escape '\'
  loop execute format('revoke all on function %s from public, anon, authenticated, service_role',r.signature); end loop;
end $acl$;
grant usage on schema public, gamify_private to authenticated, service_role;
grant execute on function
  public.beta2_cloud_access(integer), gamify_private.beta2_cloud_access(integer),
  public.beta2_accept_cloud_notice(integer,text), gamify_private.beta2_accept_cloud_notice(integer,text),
  public.beta2_cloud_list(integer), gamify_private.beta2_cloud_list(integer),
  public.beta2_cloud_load(integer,text,text), gamify_private.beta2_cloud_load(integer,text,text),
  public.beta2_cloud_lease(integer,text,text,text,text,text), gamify_private.beta2_cloud_lease(integer,text,text,text,text,text),
  public.beta2_cloud_write(text,text), gamify_private.beta2_cloud_write(text,text),
  public.beta2_cloud_operation(integer,text), gamify_private.beta2_cloud_operation(integer,text),
  public.beta2_delete_my_data(text,text), gamify_private.beta2_delete_my_data(text,text),
  gamify_private.beta2_can_read_cloud() to authenticated;
grant execute on function public.beta2_admin_cloud(text,uuid,jsonb), gamify_private.beta2_admin_cloud(text,uuid,jsonb) to service_role;
-- Existing deletion helper grants survive CREATE OR REPLACE. Cron (postgres)
-- calls the existing invoker retention target, which can execute its new helper.

notify pgrst, 'reload schema';
commit;
