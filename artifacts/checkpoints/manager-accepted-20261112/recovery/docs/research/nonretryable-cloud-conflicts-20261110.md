# Nonretryable cloud conflicts and usage delivery — 2026-11-10

The confirmed defect is the use of **SQLSTATE 40001 for a deterministic stale
revision/name collision**. Retrying the same transaction cannot change its
expected revision or restore target. These application conflicts now use
**PT409 / HTTP 409** in a new, **unapplied** migration. Real PostgreSQL-generated
serialization failures and deadlocks retain their normal semantics.

## Evidence and certainty

Only source, synthetic tests and the manager's supplied observations were used.
No live DB, account, tester save, owner backup, network, Git, installation,
deployment or agent access. Installed JS versions: postgrest-js 1.21.4,
supabase-js 2.57.4, auth-js 2.71.1. There is no PostgREST/Hasql server source or
PostgreSQL executable/parser in this workspace. The Supabase skills were read;
the explicit offline/no-live-SQL scope overrides their fetch/apply workflow.

**High confidence in the retry mechanism, qualified attribution:** from prior
knowledge, PostgREST's Hasql transaction runner retries transaction rollback
errors (40001 serialization failure / 40P01 deadlock). A deterministic RAISE
with such a code is therefore unsafe. I could not inspect the pinned 14.18
server/dependency source or execute PostgREST here, so I do **not** claim to have
proved its exact one-second delay, retry cap, disconnect cancellation, or which
deployed component retries. PostgreSQL itself does not replay an RPC simply
because an application RAISE uses 40001; a transaction runner must do that.
There is no evidence here that Supavisor independently replays application SQL.

The supplied two pooled backends with fresh transaction starts, 17+ hours of
one-per-second errors, and far fewer completed gateway requests strongly support
server-side transaction replay over an ordinary browser loop. One HTTP request
can contain many attempted DB transactions under that mechanism; aborted or
unfinished requests also need not appear as completed gateway responses. This
explains the discrepancy **conditionally**, not as a measured gateway sampling
rule. The installed PostgrestBuilder.ts:114–121 makes one fetch for an RPC; it
has no SQLSTATE/serialization retry loop. Auth retries are separate Auth calls.

Manager verification still needed: inspect the deployed PostgREST 14.18 / Hasql
transaction implementation or correlate one request/backend through repeated
40001s. Useful primary-source locations for that offline/provider review are
PostgREST's `Query` transaction runner and Hasql.Transaction.Sessions transaction
retry policy. No external page was fetched or represented as inspected here.

Browser backoff cannot stop an already-running server retry loop. Also,
`beta2_rate` increments occur inside the failing transaction and roll back on the
exception (`20261018000100_beta2_cloud_saves.sql:263–275`); they cannot terminate
such replay. This remains true with the 4ca33203 browser fix.

## Complete retryable application-raise inventory

Seven historical raises, six current implementations; all are deterministic
40001. No explicit 40P01, other class-40 raise, serialization_failure or
deadlock_detected raise in the migrations. No genuine database error is caught
or rewritten by this change.

| Original source | Current function patched | Conflict |
| --- | --- | --- |
| 20261018000100:353 | gamify_private.beta2_cloud_lease(integer,text,text,text,text,text) | Stale revision, including legacy 60 s leases |
| 20261018000100:464; renamed by 20261103000100:201 | gamify_private.beta2_legacy_cloud_write(text,text) | Stale format-2 append |
| 20261018000200:112, superseded by 20261103000100:333 | gamify_private.beta2_backup_restore(text,text,boolean) | Existing campaign/name must not be overwritten |
| 20261026000100:39 | gamify_private.beta2_cloud_delete_campaign(integer,text,text) | Stale deletion revision |
| 20261103000100:106 | gamify_private.beta2_snapshot_write(text,text) | Stale native snapshot revision |
| 20261104000100:43 | gamify_private.beta2_cloud_lease_v2(integer,text,text,text,text,text) | Stale efficient lease, if this optional migration exists |

## Migration, permissions and compatibility

`supabase/migrations/20261110000100_nonretryable_cloud_conflicts.sql` recreates
each allowlisted **installed** definition via pg_get_functiondef, replacing
exactly one `errcode = '40001'` with `errcode = 'PT409'`. It asserts the expected
contract, unchanged function OID/owner/ACL/search_path/security attributes and
otherwise identical prosrc. Already-patched functions are skipped. Only the
optional v2 lease may be absent. Missing other prerequisites or unexpected bodies
fail the whole transaction. This preserves current installed fixes rather than
copying potentially stale function bodies from older migration files.

There are no table/data/ACL/grant changes, new RPCs, lease-duration changes,
protocol/save-format changes, weakened CAS/receipt/fencing checks or evidence
changes. Catalog locks are bounded by 2 s, statements/idle transaction by 10 s;
no campaign/snapshot/quota table is locked or rewritten by apply. Notify reloads
the PostgREST schema cache after commit. A currently executing old function can
finish that attempt; manager must verify subsequent transactions use PT409.

The client maps **both 40001 and PT409** to CloudSyncError("revision") before
message-based classification. Existing fresh-head recovery, local play policy,
mutation jitter/backoff, abort deadlines and immutable operation handling are
unchanged. PT409 never triggers the optional-RPC missing-endpoint fallback.

### Disposable acceptance — manager execution required

No local psql/postgres/docker/supabase or SQL parser is installed; **SQL execution
has not been claimed**. New static Vitest contracts do not replace this drill.
Use already installed PostgreSQL 15+ / pgcrypto and the existing minimal Auth
stub on a **fresh disposable cluster/database**, not the live project:

```powershell
createdb --host=127.0.0.1 --username=postgres gamify_snapshot_test_conflicts
psql --host=127.0.0.1 --username=postgres --dbname=gamify_snapshot_test_conflicts -X -v ON_ERROR_STOP=1 -f supabase/tests/nonretryable_cloud_conflicts_offline.sql
if ($LASTEXITCODE -ne 0) { throw 'Nonretryable SQL acceptance failed' }
```

Repeat on another fresh disposable DB with `-v NONRETRYABLE_SKIP_EFFICIENT=1`
to prove compatibility when the unapplied optional request-budget SQL is absent.
The driver runs the old suites **before** changing their 40001 contract, then
tests apply twice, exact OID/ACL/body preservation, rollback, reapply, valid old
and native writes followed by stale rejections, both leases, delete, protected
backup collision, unchanged failed-transaction data/rates and idempotent usage.
The final PASS is inside the success transaction, followed by ROLLBACK;
ON_ERROR_STOP makes an assertion/SQL failure fatal. Synthetic fixtures roll back;
schema apply/rollback/reapply is intentional in the disposable DB only.

**These tests/stub/driver are not safe on live.** They create synthetic Auth
rows, touch global quota locks and generate WAL/bloat even after rollback. Name
and stub-marker guards reject normal databases. Only the migration and explicit
owner-reviewed rollback file are suitable for the SQL editor.

### Live apply / rollback checklist — owner/manager only

1. Review the migration and disposable test output, capture the six installed
   definitions/ACLs (five if v2 absent), and retain the normal verified backups.
   Confirm snapshot-only migration is already installed. Do not install the
   optional request-budget migration as part of this fix.
2. Deploy/reload the dual-code client first. It works with the old server; old
   clients receiving PT409 would classify it as network rather than revision.
3. In a fresh SQL-editor tab run the **whole new migration**, including BEGIN/
   COMMIT. On a timeout/error close/rollback that transaction and retry the whole
   file; do not resume from a later statement. No migration was applied here.
4. Confirm all present target functions contain PT409 instead of the application
   40001 literal; compare OIDs, owner, ACLs/configuration with the capture. Public
   wrappers/grants must be identical. Confirm fresh stale RPCs return HTTP 409.
5. Check transaction duration/error frequency and actual SQLSTATE, not just the
   unchanged "Cloud revision conflict" message. A finite rejected request can
   still log that message. Check play-time receipt delivery separately. Continued
   one-per-second replay after fresh PT409 transactions warrants provider/source
   investigation; do not broaden grants or remove revision checks.
6. Rollback, only if required after review: run the **whole**
   `supabase/tests/nonretryable_cloud_conflicts_rollback.sql` in a fresh SQL tab.
   It changes only PT409 back to 40001, preserves the compatible client and all
   saved data, and **can reintroduce the incident**. Retain the previous capture
   to compare definitions and ACLs. Do not run the rollback-only test on live.

## Play-time / question totals

The owner tool's `report` calls `compileUsageReport` in beta-casual.mjs:18–30,
then `beta1_admin_usage_report`. That SQL sums player_usage_days over the retained
90 UTC days (`20261028000100_casual_mode.sql:156–174`); it is not a cached value
or derived from campaign facility ticks/evidence. No tool was run against live.

Collection and delivery:

- UsageProvider owns one account-scoped PlaytimeTracker and browser binding.
  browserUsage.ts's 1 s timer samples **locally**; it is not an RPC. A Web Lock
  prevents same-origin tab double counting. Only visible, unpaused, admitted,
  consented, recently used play is counted; idle/suspend gaps, closed clinics,
  unknown counting ownership and gated commands are excluded.
- PlaytimeTracker seals <=30 s time receipts into UsageOutbox; active uploads
  batch at 5 min plus boundaries. `ingest_player_usage` has a **separate**
  usage_ingest_limits counter (20/min), not beta2_rate's `mutation` bucket
  (`20261013000100_beta1_usage_and_flags.sql:208–287`). It does acquire the same
  membership row (`require_usage_player:83–102`); pool/CPU/lock contention can
  delay usage even without sharing the rate counter. Live contention was not
  measured in this task.
- Hosted first-scored question receipts are also staged with the durable cloud
  candidate (gameSession.ts) and ingested atomically inside the snapshot write
  (`20261103000100:164–167`; legacy writer :555–558). A revision failure rolls
  that transaction back, so those counts await a successful reconciled save.
  Local scored receipts use the independent outbox. Time receipts never depend
  on replaying evidence or successful snapshot conversion.

**Reproduced client delivery defect:** supabaseUsage.ts previously awaited Auth,
RPC/fetch and response JSON without a deadline. PlaytimeTracker.flush holds its
inFlight promise until delivery settles. A stalled request therefore prevents
all future attempts for that document, even as the persisted queue grows. The
new shared 30 s request deadline covers all those awaits, aborts actual RPC/
keepalive fetch, rejects late Auth before it can send anything, and rejects late
responses instead of acknowledging them. Existing exponential jittered upload
backoff (15 s–15 min), 5 min heartbeat, account/consent/deletion/visibility gates
and receipt UUID/payloads remain unchanged. No tight retry loop was added.

Synthetic recovery covers both a play-time and question receipt: a hung upload
becomes unavailable at 30 s, no retry within the backoff, same persisted bytes
on reload, then successful exact-ID acknowledgement clears both. Lost ACKs are
safe because the server deduplicates (user_id, receipt_id); rollback SQL tests
assert a repeated time receipt contributes exactly once.

Before/after evidence: the five delivery regressions were also run against a
copy of the **captured pre-change transport**, outside product source. All five
failed (198 ms Vitest run; hung ingest stayed unsettled, Auth had no deadline,
and no request was abortable). The same five tests pass with the current
transport. That reproduction never changed the shared product files.

**Limits / attribution:** no code evidence identifies a Nov-8 release that
disconnected the usage collector, or proves every account's live totals stopped
for the same reason. The confirmed unbounded await plus unhealthy service and
shared locks/pool are credible delivery failures; pauses caused by a genuinely
fenced clinic also intentionally stop play-time collection. I did not rewrite
the worker tick/session publication path or infer play-time from facility ticks.
Remaining retained receipts upload on the next permitted retry/open with the
same IDs. Existing bounds are 7 days / ~64 KiB, so already-expired/evicted usage
or activity never recorded while fenced cannot be reconstructed. Campaign and
FSRS progress is unaffected. Do not promise retrospective zero loss of all
usage estimates or change those privacy/storage limits silently.

## Files / validation / handoff

Runtime changes: session/cloud/supabaseTransport.ts (dual error mapping only),
playtime/supabaseUsage.ts (bounded delivery only). Tests: existing
supabaseTransport.test.ts; new nonretryableConflicts.test.ts,
nonretryableConflictSql.test.ts, usageDeliveryRecovery.test.ts. SQL: new migration
and nonretryable_cloud_conflicts{,_offline,_rollback}.sql under supabase/tests.
Planning: ExecPlan, this report, additive CURRENT_THREAD_HANDOFF section.

Artifacts and original scoped hashes:
`.local-dev/nonretryable-cloud-conflicts-20261110/`. Unrelated source guard count:
1,625. Source/clinical/facility/domain changes are outside this task.

- Focused CI=true player/preload/threads: **13 files, 139 tests passed**, 12.43 s.
- Root seven-workspace typecheck: **PASS** (after fixing test-only strict index
  types found by the first run).
- Player build/preload: **PASS**, 668 modules, 11.15 s; existing plugin warnings
  only. Command: `npm.cmd run build --workspace @gamify-surgery/player`.
- Full `CI=true npm.cmd test -- --pool=threads` in apps/player with the documented
  sandbox preload: **404 files / 4,041 tests passed; 4 files / 4 tests failed**
  (408 files / 4,045 tests total), **442.61 s**, exit 1. All new tests pass.
  Same four previously documented baseline failures: breadButterPresentation
  (3 choices versus old 4), chartStructuredFields (HTML escaping),
  levelFiveRoomsViewModels (gym-note regex), separateCampaign (legacy JSON string
  bound). No baseline content/domain/fixture assertions changed.
- Mocked owner backup/report tests: **47 passed, 0 failed**, 2,363.9461 ms;
  `node --test --test-isolation=none scripts/beta-backup/beta-backup.test.mjs scripts/beta-invites/beta-casual.test.mjs`.
- All **1,625 unowned guarded source hashes unchanged** after validation.
- SQL executable acceptance: **not run**, tooling unavailable; static SQL tests
  passed above and again after the midnight-safe usage-fixture review (**1 file /
  3 tests PASS, 125 ms**). Manager owns disposable execution, live review/apply and browser
  cloud-saves/cloud-recovery acceptance. No owner-tool code changed.

Raw outputs: focused-final.log, full-player.log, typecheck-final.log, build.log,
owner-tools.log, legacy-usage-reproduction.log. The earlier interrupted
before-focused.log is a partial initial test run (including an assertion later
corrected to allow client-budget throttling); it is **not** acceptance evidence.
New test-source strict indexing errors from the first typecheck were fixed; the
final root run passes all seven workspaces.

Outstanding manager gates: executable SQL tests (both v2 present/absent), pinned
server retry-source confirmation, scoped diff/ACL review, browser/cloud suite,
then deploy/apply/observe. The proposed SQL is still unapplied. This work is an
uncommitted local checkpoint; the manager owns integration and GitHub backup.
