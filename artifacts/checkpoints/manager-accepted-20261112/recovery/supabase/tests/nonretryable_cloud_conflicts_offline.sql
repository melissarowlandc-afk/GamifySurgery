-- Fresh DISPOSABLE local Postgres only. NEVER run this driver on live Supabase.
\set ON_ERROR_STOP on
\ir snapshot_only_offline.sql
\if :{?NONRETRYABLE_SKIP_EFFICIENT}
\else
\ir ../migrations/20261104000100_account_request_budget.sql
\ir account_request_budget.sql
\endif

-- Preserve the complete installed definitions/ACLs to prove exact replacement,
-- idempotence, and owner rollback, including unchanged public wrappers.
create temp table nonretryable_before as
select p.oid, p.proowner, p.proacl, p.proconfig, p.prosecdef, p.prosrc
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','gamify_private');
\ir ../migrations/20261110000100_nonretryable_cloud_conflicts.sql
create temp table nonretryable_once as
select p.oid, p.proowner, p.proacl, p.proconfig, p.prosecdef, p.prosrc
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','gamify_private');
\ir ../migrations/20261110000100_nonretryable_cloud_conflicts.sql
do $idempotence$ begin
  assert not exists(select 1 from nonretryable_once b full join
    (select p.oid,p.proowner,p.proacl,p.proconfig,p.prosecdef,p.prosrc from pg_proc p
      join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('public','gamify_private')) a using(oid)
    where to_jsonb(a) is distinct from to_jsonb(b)), 'Repeated apply changes nothing';
  assert (select count(*) from nonretryable_before b join pg_proc p on p.oid=b.oid
    where p.prosrc is distinct from b.prosrc) = case when to_regprocedure(
    'gamify_private.beta2_cloud_lease_v2(integer,text,text,text,text,text)') is null then 5 else 6 end;
  assert not exists(select 1 from nonretryable_before b left join pg_proc p on p.oid=b.oid
    where p.oid is null or p.proowner<>b.proowner or p.proacl is distinct from b.proacl
      or p.proconfig is distinct from b.proconfig or p.prosecdef<>b.prosecdef
      or p.prosrc<>replace(b.prosrc,'errcode = ''40001''','errcode = ''PT409''')),
    'Only error code changes; public wrappers, body, OID, owner, ACL and security settings exact';
end $idempotence$;
\ir nonretryable_cloud_conflicts_rollback.sql
do $restored$ begin
  assert not exists(select 1 from nonretryable_before b left join pg_proc p on p.oid=b.oid
    where p.oid is null or p.proowner<>b.proowner or p.proacl is distinct from b.proacl
      or p.proconfig is distinct from b.proconfig or p.prosecdef<>b.prosecdef or p.prosrc<>b.prosrc),
    'Rollback restores the exact previous functions and permissions';
end $restored$;
\ir ../migrations/20261110000100_nonretryable_cloud_conflicts.sql
\ir nonretryable_cloud_conflicts.sql
