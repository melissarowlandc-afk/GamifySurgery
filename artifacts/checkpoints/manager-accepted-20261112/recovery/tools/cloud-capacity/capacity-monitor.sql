-- READ ONLY. Run the entire file as postgres in the live GAME project's SQL
-- Editor after B2.2. No rows/flags/capabilities change. Output contains UUIDs and
-- byte counts, never payloads, keys, emails or answer analytics.
begin transaction read only;

-- Per-account compressed payload bytes and the server's conservative reservations.
-- Row/TOAST/index bytes cannot honestly be attributed per account with this schema.
with payload as (
  select owner_id, sum(snapshot_bytes)::bigint snapshot_bytes, sum(evidence_bytes)::bigint evidence_bytes from (
    select owner_id, octet_length(content)::bigint snapshot_bytes, 0::bigint evidence_bytes from public.beta2_campaign_snapshots
    union all select owner_id, 0, octet_length(content) from public.beta2_evidence_headers
    union all select owner_id, 0, octet_length(content) from public.beta2_evidence_pages
  ) r group by owner_id
), campaigns as (
  select owner_id, count(*) campaign_count, max(evidence_bytes) largest_campaign_evidence_reservation from public.beta2_campaigns group by owner_id
), accounts as (
select a.user_id, coalesce(c.campaign_count,0) campaign_count,
  coalesce(p.snapshot_bytes,0) compressed_retained_snapshot_bytes, coalesce(p.evidence_bytes,0) compressed_header_page_bytes,
  a.snapshot_bytes reserved_snapshot_bytes, a.evidence_bytes reserved_evidence_bytes, a.auxiliary_bytes reserved_auxiliary_bytes,
  a.snapshot_bytes + a.evidence_bytes + a.auxiliary_bytes total_reserved_bytes,
  case when a.snapshot_bytes + a.auxiliary_bytes >= 8000000 or a.evidence_bytes >= 2000000 or c.largest_campaign_evidence_reservation >= 1000000 then 'STOP: account/campaign limit'
    when a.snapshot_bytes + a.auxiliary_bytes >= 6400000 or a.evidence_bytes >= 1600000 or c.largest_campaign_evidence_reservation >= 800000 then 'WARN: 80 percent'
    else 'OK' end account_capacity_status
from gamify_private.beta2_cloud_accounts a left join payload p on p.owner_id = a.user_id left join campaigns c on c.owner_id = a.user_id
),

-- pg_total_relation_size includes table, indexes and TOAST. Do not separately
-- add index/TOAST sizes again. Dead tuples are included in physical allocation.
relations as (
  select c.oid, n.nspname, c.relname from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r','p') and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\'
), sizes as (
  select coalesce(sum(pg_total_relation_size(oid)),0)::bigint beta2_total_relation_bytes from relations
), project as (
select s.beta2_total_relation_bytes, pg_database_size(current_database()) database_bytes,
  q.accounted_bytes, q.dead_bytes_estimate, q.writes_enabled, q.enrollments_enabled,
  50000000 shared_reserve_bytes, 300000000 warning_bytes, 400000000 working_budget_bytes, 500000000 provider_limit_bytes,
  greatest(pg_database_size(current_database()), q.accounted_bytes + 50000000) + q.dead_bytes_estimate + 1048576 conservative_guard_bytes,
  case when greatest(pg_database_size(current_database()),q.accounted_bytes + 50000000) + q.dead_bytes_estimate + 1048576 >= 400000000 then 'STOP: pause writes/enrollment; preserve history'
    when pg_database_size(current_database()) >= 300000000 or q.accounted_bytes + q.dead_bytes_estimate + 50000000 >= 300000000 then 'WARN: inspect growth, backup and cleanup'
    else 'OK: still verify per-write transient headroom' end project_capacity_status,
  q.last_cleanup_verified_at
from sizes s cross join gamify_private.beta2_cloud_quota q where q.singleton
), tables as (

select n.nspname schema_name, c.relname table_name, pg_total_relation_size(c.oid) total_bytes,
  pg_relation_size(c.oid) heap_bytes, pg_indexes_size(c.oid) index_bytes,
  coalesce(s.n_live_tup,0) estimated_live_rows, coalesce(s.n_dead_tup,0) estimated_dead_rows, s.last_autovacuum, s.last_vacuum
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
left join pg_catalog.pg_stat_user_tables s on s.relid = c.oid
where c.relkind = 'r' and n.nspname in ('public','gamify_private') and c.relname like 'beta2\_%' escape '\'
)
-- ONE result set: SQL editors which display only the last SELECT still show
-- the project, every account and all eleven table allocations together.
select scope, subject, bytes, status, details from (
  select 0 sort_order, 'project'::text scope, current_database()::text subject, p.database_bytes bytes,
    p.project_capacity_status status, to_jsonb(p) - 'project_capacity_status' details from project p
  union all
  select 1, 'account', a.user_id::text, a.total_reserved_bytes, a.account_capacity_status,
    to_jsonb(a) - 'user_id' - 'account_capacity_status' from accounts a
  union all
  select 2, 'table', t.schema_name || '.' || t.table_name, t.total_bytes, 'Observed physical allocation', to_jsonb(t) from tables t
) capacity
order by sort_order, bytes desc, subject;
commit;
