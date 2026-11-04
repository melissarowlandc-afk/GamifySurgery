# Snapshot-only SQL acceptance and rollout

Status: authored offline; **no SQL was executed by the worker**. The independent
review is `docs/research/snapshot-only-sql-review-20261103.md`. Its executed-SQL
and concurrency acceptance remains a manager prerequisite, even when the
player/fake-RPC/codec tests pass.

## Disposable PostgreSQL acceptance

Use an already installed PostgreSQL **15+** with bundled `pgcrypto`, `createdb`
and `psql`, a local disposable cluster, and a cluster-superuser connection. No
Supabase service, network API, Docker image download or new package is needed.
The stub only supplies roles, an empty `auth.users`, `auth.uid()` and `auth.jwt()`;
it is not an Auth/security/gateway emulator. The real checked-in application
migrations supply all membership, admission, RLS, quota, lease and save logic.
Cron scheduling is deliberately omitted; it is not needed for these transactions.

From the repository root (manager execution, not commands run by the worker):

```powershell
createdb --host=127.0.0.1 --username=postgres gamify_snapshot_test_r1r6
psql --host=127.0.0.1 --username=postgres --dbname=gamify_snapshot_test_r1r6 -X -v ON_ERROR_STOP=1 -f supabase/tests/snapshot_only_offline.sql
if ($LASTEXITCODE -ne 0) { throw 'Snapshot SQL acceptance failed' }
```

The driver bootstraps an empty database, applies the previous production schema
then the proposed migration, and runs the rollback suite under
`plpgsql.variable_conflict=error`. Roles are cluster objects: reuse only this
disposable cluster, then dispose of the cluster through its normal local tools.
No cleanup/drop command is embedded in these scripts. The stub refuses an
existing Auth/application schema, public application tables, or a database not
named `gamify_snapshot_test[_suffix]`. The test also requires the stub's marker.

Successful acceptance requires **psql exit 0**, the final in-transaction
`PASS ... checks complete; rollback follows` notice, and the final `ROLLBACK`
command result. The schema remains in the disposable database; test users,
campaigns/configuration/temporary helpers roll back. This is not a claim of
zero physical side effects: WAL, allocated pages, logs and statistics can remain.

Prove fail-fast behavior on that prepared disposable database:

```powershell
psql --host=127.0.0.1 --username=postgres --dbname=gamify_snapshot_test_r1r6 -X -v ON_ERROR_STOP=1 -v SNAPSHOT_INJECT_FAILURE=1 -f supabase/tests/snapshot_only_cloud_saves.sql
if ($LASTEXITCODE -eq 0) { throw 'Injected failure incorrectly succeeded' }
```

This must report `R5: deliberate fail-fast runner check`, exit nonzero, emit
**no PASS**, and close the connection/roll back. In a fresh connection, synthetic
`auth.users` IDs beginning `b2030000-` must be absent. Never keep the failed
connection open in an editor or resume selected statements after an error.

### Regressions

| Finding | Executable regression / contract |
| --- | --- |
| R1 | Successful format-2 append creates legacy revisions 2/1 at 999,998 evidence bytes; first native conversion executes its UPDATE with conflict behavior `error`. The function also pins `#variable_conflict error`. |
| R2 | Explicit campaigns-before-snapshots `ACCESS EXCLUSIVE ... NOWAIT`, 2 s other-lock / 15 s statement / 15 s idle limits; two-connection drill below. Offline source contract prevents reintroducing the inverse order. |
| R3 | Set effective project ledger to 349,999,999 within a test-only subtransaction; old logical-only reserve would fit by subtracting retired evidence, but final accounted+dead must reject. Hash all campaign/snapshot/evidence/op/writer/account/quota/rate/usage bytes before and after the rejection. |
| R4 | First prove a valid protocol-3 append succeeds before conversion. Reuse that valid envelope with current revision/generation/token and valid digest after conversion; require SQLSTATE 22023 **and** `Cloud client update required for snapshot saves`. Require that exact message for native current/prior legacy loads; hash all bytes/counters before/after. Original committed legacy receipt remains an allowed separate path. |
| R5 | `ON_ERROR_STOP`, dedicated connection, guarded disposable DB, bounded transaction statements/idle, success block before rollback only; deliberate-failure switch above. |
| R6 | With authenticated role but no subject, reject null/empty/257-byte and multibyte-over-limit campaign IDs and malformed/overflow revisions with 22023 before account admission/locks. |

The suite still covers immutable-operation retry, writer/revision fencing,
capacity, slots, native owner backup/restore, account isolation and revocation.
`snapshotRpcRoundTrip.test.ts` supplements SQL's deliberately opaque fixtures:
the real Level 5 source has **549 FSRS reviews** and 11 frozen encounters. It
creates a legacy current/prior pair, generates the conversion with production
code, consumes the actual native RPC blobs in the fake server, loads native
current/prior through the real Supabase adapter, and compares every state field,
FSRS history and frozen encounter. It proves the client/RPC byte contract, **not
PostgreSQL execution**. SQL cannot verify gzip semantics or the prior state's
fidelity; verified external exports remain required.

### Two-connection apply and old-client drill (disposable only)

Prepare a separate database by using the same command with
`-v SNAPSHOT_BEFORE_MIGRATION=1`; the driver stops at the previous schema. In
that prepared database, run the automated regression:

```powershell
node supabase/tests/snapshot_only_lock_test.mjs gamify_snapshot_test_lock postgres
if ($LASTEXITCODE -ne 0) { throw 'Two-connection snapshot apply regression failed' }
```

`SNAPSHOT_PSQL` can name an already installed local psql binary if it is not on
PATH. The script permits only the disposable database prefix, hardcodes loopback,
checks the marker/previous schema, waits for the holder's real lock-ready marker,
requires 55P03 from the busy migration, proves the old reader still works and
no partial DDL remains, then applies while quiet and runs the SQL suite. Each
child has a 15-second bound; connections close on error. No fixed sleep, package,
secret output or provider API is used. It has not been executed by the worker.

The equivalent manual drill: in connection A, run these statements, leaving the transaction open briefly:

```sql
begin;
set local idle_in_transaction_session_timeout = '30s';
lock table public.beta2_campaigns in row exclusive mode;
```

While A holds the same campaign relation lock used by a live save, run the new
migration in a dedicated fail-fast connection B. It must immediately reject
with lock-not-available (55P03), **not queue and deadlock**. A must still be able
to `select count(*) from public.beta2_campaign_snapshots; rollback;`. After B's
failure/connection close, confirm in a fresh connection that the new columns and
`beta2_snapshot_write` functions are absent. Retry the **whole migration** with
A released; then run the suite. Do not continue at a later DDL statement.

Also rehearse real old protocol-3 save/load calls concurrently with apply and
with first conversion, using only synthetic accounts from the existing cloud
SQL tests. Accepted outcomes: old save commits first and stale conversion CAS
fails; or conversion commits first and the old writer gets the exact update
message. No stale head/evidence append, partial schema or account mutation may
commit. This real-RPC two-connection drill remains manager acceptance; the
single-connection suite/source assertions do not prove concurrency.

## Live rollout checklist — manager only

The rollback **test/stub/driver is NOT SAFE ON LIVE**. Its quota-row lock can
block every player's save/lease for the transaction lifetime; rollback cannot
undo WAL/bloat or unknown Auth hooks. The name/schema guards deliberately reject
a normal live project. Any separate live rehearsal requires its own scoped
authorization and controlled timing, not these test fixtures.

1. **Prerequisites:** successful disposable execution and failure/lock drills;
   supported PostgreSQL, existing `extensions.digest`, complete previous
   application migrations through default-enabled/casual, real admission and
   consent gates. Inspect actual triggers/dependencies and function definitions;
   the stub cannot certify provider ACL drift, Auth hooks or gateway limits.
2. **Verified backups:** export every converting legacy campaign's current and
   prior using the existing owner backup tool, retain the untouched encrypted/
   private bundle externally, and verify both with its production-codec
   verifier. Never log payloads/credentials in CI. A checksum-only SQL fixture
   is not proof of playable FSRS/frozen state. Follow the existing owner backup
   runbook rather than inventing a replacement export path.
3. **Ledgers/capacity:** run the read-only queries below before and after apply
   and after a reviewed synthetic conversion. Resolve any existing drift before
   conversion; this migration does not repair it. Confirm effective project
   headroom and actual database allocation plus transient reservation. Full
   snapshots increase pruning churn; retain the existing reviewed physical
   cleanup/maintenance process. Logical evidence release is not VACUUM credit.
4. **ACLs:** compare `pg_proc.proacl`, `prosecdef` and `proconfig` for public and
   private cloud RPCs against the migration. Public wrappers must be invokers;
   private definer search paths are empty. Only authenticated callers execute
   new player RPCs; anon/service-role have no new player-write grant. Renamed
   legacy internals and lineage helper have no direct player grant. The owner
   restore stays service-only. Existing cloud tables retain RLS and no direct
   player writes. Keep `gamify_private` unexposed in provider settings.
5. **Apply window:** brief low-traffic interval, no editor pauses/selected
   fragments. Apply the entire new migration with an error-stopping runner.
   Existing save/load transactions make `NOWAIT` abort immediately; they do not
   get killed or silently converted. On busy/timeout/deadlock, close/rollback B
   and retry the entire file once quiet. On success, table locks briefly block
   new accesses while metadata/function DDL completes. Constraints validate
   metadata, not gzip/game history; no campaign is converted during DDL. 15 s
   is a per-statement bound, not a promise of an overall transaction deadline.
6. **Before client release:** confirm schema-cache reload/capability and exact
   signatures/ACLs, legacy save/load still working for an unconverted campaign,
   then deploy the new client. New client + old server remains legacy and cannot
   relieve its old evidence cap. An already-open old client is compatible only
   while its campaign stays legacy; conversion on another device fences it with
   update-required. Preserve its local unsynced work/export. Do not promise that
   all old clients continue syncing until reload.
7. **After conversion:** current and prior both native, zero evidence rows/bytes,
   exact production-codec state/FSRS comparison against exports, unchanged
   receipt/usage semantics and correct current/prior revisions. The pre-convert
   current becomes native prior; the older pre-convert prior is pruned by the
   existing two-generation policy. Already-corrupt-current recovery is separate
   and is not automatically repaired at capacity by this conversion.
8. **Rollback:** failed DDL rolls back completely. After any successful native
   conversion, retain the new reader and forward-fix; an old client/server
   cannot reconstruct deleted evidence. Do not rerun the older backup-helper
   installer over the updated restore function. Browser/physical-iOS acceptance
   and observed SQL outcomes must be recorded by the manager before acceptance.

Read-only ledger summaries (owner-reviewed queries; no per-player IDs or payloads
are output). Run in a short **read-only transaction** with local lock/statement
timeouts, then rollback:

```sql
begin read only;
set local lock_timeout = '1s';
set local statement_timeout = '5s';
select current_setting('server_version'), current_setting('plpgsql.variable_conflict');
select q.accounted_bytes, q.dead_bytes_estimate,
  (select coalesce(sum(a.snapshot_bytes+a.evidence_bytes+a.auxiliary_bytes),0)
   from gamify_private.beta2_cloud_accounts a) as summed_account_ledgers,
  pg_database_size(current_database()) as allocated_database_bytes,
  q.accounted_bytes+q.dead_bytes_estimate+50000000 <= 400000000 as effective_room
from gamify_private.beta2_cloud_quota q;
select count(*) as mismatched_account_payload_ledgers
from gamify_private.beta2_cloud_accounts a where
 a.snapshot_bytes <> (select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(s.content))),0)
   from public.beta2_campaign_snapshots s where s.owner_id=a.user_id)
 or a.evidence_bytes <> (select coalesce(sum(c.evidence_bytes),0)
   from public.beta2_campaigns c where c.owner_id=a.user_id)
 or a.auxiliary_bytes <> 8192+4096*(select count(*) from public.beta2_campaigns c where c.owner_id=a.user_id)
   +(select coalesce(sum(gamify_private.beta2_operation_cost(o)),0)
     from gamify_private.beta2_campaign_operations o where o.owner_id=a.user_id);
select count(*) as mismatched_campaign_evidence_ledgers from public.beta2_campaigns c where
 c.evidence_bytes <> (select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(h.content))),0)
   from public.beta2_evidence_headers h where h.owner_id=c.owner_id and h.campaign_id=c.campaign_id)
 +(select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(p.content))),0)
   from public.beta2_evidence_pages p where p.owner_id=c.owner_id and p.campaign_id=c.campaign_id);
rollback;
```

Expected mismatch counts are zero and project accounted equals summed account
ledgers. A discrepancy blocks rollout; do not modify live counters to make the
queries pass. Inspect ACLs/RLS and verified backups separately as above.
