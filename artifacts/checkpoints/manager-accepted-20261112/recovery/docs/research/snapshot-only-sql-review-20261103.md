# Snapshot-only cloud saves: adversarial SQL review, 2026-11-03

**Verdict: APPLY_AFTER_FIXES. Do not apply the reviewed file unchanged.**

The first legacy conversion has a PL/pgSQL variable/column ambiguity that should fail at execution under the default conflict setting. The transaction protects existing bytes from that failure, but the migration can install successfully and advertise a capability whose essential conversion path fails. There are also live-apply locking, project-capacity accounting, and acceptance-test weaknesses to fix before rollout.

This is a local, static review, not an executed Postgres acceptance result. No database, Git, installation, network, or application operation was performed. Only this report was written; the handoff and implementation files were left unchanged as requested. No worker was spawned. `psql`, `postgres`, and `supabase` were not found on PATH. PostgreSQL behavior below is reasoned from the SQL; live configuration, ACL drift, triggers, and installed migration state remain unverified.

References below use these exact repository-relative files and one-based line numbers:

| Alias | File |
| --- | --- |
| M | `supabase/migrations/20261103000100_snapshot_only_cloud_saves.sql` |
| T | `supabase/tests/snapshot_only_cloud_saves.sql` |
| B | `supabase/migrations/20261018000100_beta2_cloud_saves.sql` |
| BK | `supabase/migrations/20261018000200_beta2_backup_rpcs.sql` |
| AS | `supabase/migrations/20261018000300_beta2_admin_cloud_status.sql` |
| D | `supabase/migrations/20261027000100_beta2_default_enabled.sql` |
| C | `supabase/migrations/20261028000100_casual_mode.sql` |
| CP | `supabase/migrations/20261026000200_competition.sql` |
| DEL | `supabase/migrations/20261026000100_beta2_delete_campaign.sql` |
| AUTH | `supabase/migrations/20261014000300_beta1_setup_links.sql` |
| P | `docs/execplans/snapshot-only-saves-20261103.md` |
| TR | `apps/player/src/session/cloud/supabaseTransport.ts` |
| SC | `apps/player/src/session/cloud/snapshotCodec.ts` |
| CT | `apps/player/src/session/cloud/codecTasks.ts` |
| CW | `apps/player/src/session/cloud/codecWire.ts` |
| CC | `apps/player/src/session/cloud/codecCompression.ts` |
| CE | `apps/player/src/session/cloud/codecEvidence.ts` |

## Required fixes and findings

### R1 — High: legacy conversion cannot resolve `content` unambiguously

**Location: M:37, M:151–156.** `content` is declared as a JSONB local variable. The UPDATE targets `beta2_campaign_snapshots`, which also has a `content` column (BYTEA, B:72). Its RHS uses `(content->>'uncompressedBytes')`, `content->>'uncompressedSha256'`, and `content->>'compressedSha256'` without qualifying the variable.

Under normal `plpgsql.variable_conflict = error`, preparing this UPDATE raises an ambiguous-column error (`42702`). With `use_column`, the JSON operator instead targets BYTEA and fails. Depending on a nondefault `use_variable` setting is not a safe migration contract. The preceding assignment `content := req->'legacyBaseSnapshot'` does not disambiguate SQL expressions.

This is reached on **every first conversion of an existing format-2 campaign**, including the capacity-blocked owner campaign. New native imports do not exercise it. PL/pgSQL SQL statements can be prepared when their execution branch is reached, so successful CREATE FUNCTION / migration application does not establish successful conversion. The exception handlers at M:173–175 do not handle `42702`; the client maps an unrecognized SQL code to a network error (TR:38–58).

No partial conversion should commit: the failing RPC rolls back its quota reservation and any usage work, and the old head/evidence remain intact. The effect is a rollout-breaking save failure, not demonstrated destructive partial execution.

**Exact fix:** use a uniquely named JSON variable such as `v_prior_blob`, or use `req->'legacyBaseSnapshot'` directly in all three RHS expressions. Qualify table-column references where appropriate. Do not fix this by changing the server-wide conflict setting. Execute the conversion branch under `plpgsql.variable_conflict = error`, with both a legacy current/prior pair and the near-capacity fixture, before applying live.

### R2 — Medium: DDL takes the campaign/snapshot table locks in reverse order

**Location: M:6–13 versus B:454, B:521–522, B:562–569; also B:605–607 and DEL:31–52.** The migration alters snapshots first, retaining an ACCESS EXCLUSIVE table lock until M:410, then requests the campaigns table lock. Existing writers/readers access campaigns before snapshots.

An admissible interleaving is: a live write holds a campaigns relation lock; the migration acquires the snapshots exclusive lock; the write then waits to access snapshots; the migration waits to alter campaigns. That is a table-lock cycle even though runtime row-lock order is otherwise consistent. PostgreSQL should abort a deadlock victim rather than corrupt data, but either deployment or a player's RPC fails. There is no `lock_timeout` or `statement_timeout` in the migration. A stalled lock acquisition can also queue other live activity.

**Exact fix:** arrange a short, controlled apply window that drains active save/load transactions, acquire the required table locks in the established campaigns-before-snapshots order before changing either table, and set explicit local lock/statement timeouts appropriate to that window. Rehearse application against the previous client in a separate database. A deadlock/timeout must roll back the whole migration; do not resume at a later statement. Reordering alone is not proof against every externally installed trigger or query, so verify the actual live dependencies during manager preflight.

### R3 — Medium: the project accounting guard omits the dead bytes added by this write

**Location: M:110–120, M:135–136, M:169; inherited reservation helper B:294–306.** The logical snapshot delta subtracts replaced/pruned snapshots and the evidence delta subtracts the legacy evidence. `beta2_reserve` tests the resulting accounted bytes plus the **old** dead-byte estimate. Only afterward does M:169 add those retired bytes to the estimate.

Let `N = snapshot_cost + prior_cost + op_cost` for a conversion and `R = replaced_cost + pruned_cost + evidence_cost`. Reservation tests `accounted + dead + N - R + 50,000,000`; the final state is `accounted + dead + N + 50,000,000`. Thus a conversion near the project ceiling can pass because of the retired bytes, then finish beyond the ceiling and block subsequent saves/lease operations. For example, a pre-write effective ledger of 349,900,000 bytes, 202,000 newly charged bytes, and 1,000,000 retired bytes passes the first expression but ends at 350,102,000, above the 350,000,000 effective-ledger allowance. The independent physical database-size check can still pass if actual allocated size is lower.

This is an inherited weakness of the reserve/prune pattern, newly exercised for all retired evidence as well as the replaced head. It is **not** double subtraction of evidence, negative-account billing, or an authorization bypass. The final ledger arithmetic correctly retains the retired-byte estimate; the admission check is too early/incomplete.

**Exact fix:** before mutation, check the intended final accounted-plus-dead total including `pruned_cost + replaced_cost + evidence_cost`, or extend the reservation contract to accept and validate the pending dead-byte increment atomically. Retain the existing physical/transient guard and nonnegative constraints. Add boundary tests where the current ledger passes but the proposed final effective ledger exceeds the ceiling; assert rejection leaves all ledgers, heads, evidence and operations unchanged.

### R4 — High validation gap: old-client rejection is tested with an invalid old-client request

**Location: T:63–75.** `bad` still contains the corrupted protocol-4 snapshot request from line 63. Line 74 changes only versions and operation ID. It retains `lineage` / `legacyBaseSnapshot` / `legacyBaseLineage`, omits the legacy `evidenceContractVersion` and `evidence`, and retains the bad compressed digest. The test catches any `invalid_parameter_value` (`22023`). The original unguarded legacy implementation would reject that request at B:415–429 even if the conversion guard were absent.

Consequently, this test can pass while the advertised old-client guard is broken. Separately, T:135 accepts any `22023` for an old-client load: without the explicit format guard, the original loader can raise the same code for the deleted header (B:610–611). That does not prove the intended update-required response either.

**Exact fix:** construct an otherwise valid protocol-3 save, use the current revision/generation/token so stale CAS cannot explain rejection, and assert both `22023` and the exact update-required message. Test current and prior legacy loads with the same message assertion. Verify snapshots, evidence, operation rows, writer generation/token/expiry and all quota ledgers are unchanged. Also prove a successful protocol-3 append on an unconverted campaign after migration. Keep the original lost-ack receipt test as a separate allowed path. If feasible, mutate/disable just the guard in an isolated test database to demonstrate the assertion catches the missing guard.

### R5 — Medium: unconditional PASS can follow a failed SQL test; rollback is not zero-impact live execution

**Location: T:4–7, T:29–37, T:121–128, T:152–153.** The final SELECT prints PASS after ROLLBACK without depending on test completion. In a runner that continues after errors, a failure (including R1) aborts the transaction, subsequent test statements fail/are skipped, ROLLBACK clears the error state, and the final SELECT can still print PASS. The file does not declare a fail-fast runner contract.

Also, the initial admin configure call updates the global quota row (D:104), and its row lock remains held until rollback. All live save/lease operations require that same row (D:33). The test may block every player's cloud mutations for its entire duration, including time spent paused in a SQL editor. These blocked calls can hit transport deadlines (TR:77) or lease expiry. The test's temporary changes to write/enrollment gates are uncommitted and should not become visible to normal other transactions, but their locks are real.

**Exact fix:** require an error-stopping runner that reports nonzero failure and closes/rolls back the connection on error (for psql, `-X -v ON_ERROR_STOP=1 -f ...` in a dedicated connection), and put a success assertion/marker inside the tested transaction before rollback rather than an unconditional post-rollback success claim. Run first in an isolated database. For any separately authorized live rehearsal, specify bounded lock/statement/idle-in-transaction timeouts and a controlled window; never execute selected fragments or commit the fixture. Do not market it as having no persistent physical side effects.

### R6 — Low security hardening: native load drops the campaign-ID input bound

**Location: M:215–226 versus B:603–604.** `beta2_snapshot_load` queries using arbitrary `p_campaign_id` text without the old loader's null / 1–256-byte check. With a nonexistent oversized identifier, it raises `42501` before calling the rate helper. This does not disclose another owner's campaign and returned snapshots remain size-bounded, but it removes a deliberate bound on an authenticated RPC input and permits oversized comparisons while holding the account lock. Actual gateway request-size limits were not available to inspect.

**Exact fix:** restore the legacy ID validation before querying, preferably before taking account locks, and explicitly bound/validate an optional revision. Add null, empty, oversized and malformed-argument tests. Do not rely on rolled-back rate increments to limit rejected-request CPU costs. Treat this as hardening, not evidence of an unlimited stored-payload or cross-account exploit.

## Campaign integrity, concurrency, and old-client compatibility

The requested claim that an old client keeps working unchanged **until it reloads** needs qualification. **It keeps working while its campaign remains legacy.** Migration application itself does not convert campaigns: M:6–11 labels existing snapshots format 2, M:182–213 delegates legacy read/write bodies, and M:248 preserves protocol 3 / cloud format 2 with one extra capability. The local pre-change transport at `.local-dev/snapshot-only-saves-20261103/before/apps/player/src/session/cloud/supabaseTransport.ts:79–84` ignores extra capability keys, and its lines 106–108 still call the legacy loader. This local pre-change copy was inspected; the deployed bundle itself was not verified.

Once another new-client session converts the same campaign, an already-open old client cannot continue syncing that campaign. New legacy writes/loads intentionally receive update-required errors (M:191–208). The pre-change transport maps that message to `protocol` at its line 51. Returning an old accepted operation receipt remains allowed (M:189–190, B:443–449); it does not reapply the operation. An old client on a different, unconverted campaign continues normally. The old build must retain/export its local unsynced work when fenced; this review does not certify the entire deployed UI recovery flow. Do not promise seamless mixed-version operation after conversion.

**No normal RPC race permitting an old append or stale overwrite was found in the reviewed code.** The legacy wrapper obtains `beta2_require_cloud(3)` before its format check (M:185), not just after it. The effective helper uses `auth.uid()` through AUTH:253–271, locks membership, then account and quota (D:13, D:28–33). Conversion obtains those locks before checking the campaign and writer (M:72, M:86–100). A competing old writer/lease/deletion therefore serializes with conversion. An old write that completes first advances revision, making the conversion's stale revision fail; conversion first causes the subsequent wrapper to reject. Explicit CAS, writer generation, token and expiry checks prevent a stale request from replacing a newer head. M:150 checks expiry again before the destructive portion. The lease RPC uses the same account/quota/campaign/writer order (B:339–374). Test this with multiple connections; the single SQL test cannot demonstrate the interleavings.

Normal read/load wrappers also hold the account lock through lookup and response (M:203, M:217; D:28), so their campaign/head queries cannot mix a pre-conversion campaign with a post-conversion snapshot through these RPCs. The renamed legacy internals are revoked from authenticated callers (M:402–408), so schema exposure alone does not provide a direct bypass. The wrappers are recreated intentionally after renaming to avoid an old function binding (M:179–213).

**Conversion trust boundary:** SQL verifies the supplied blobs' compressed bytes/hash and declared bounds, not that the prior blob equals the prior game state (M:112–118; B:180–200). It also does not independently verify the decoded lineage or FSRS data. An authorized current writer can supply a correctly hashed but unplayable or semantically unrelated prior blob, after which M:153–158 replaces the old head and removes the evidence required to reconstruct it. That is an explicit opaque-storage/client-trust limitation, not cross-user authorization. Existing clients could also submit bad heads, but conversion increases the consequence because the old evidence disappears. The SQL fixture deliberately demonstrates that arbitrary non-gzip text passes the opaque validator (T:8–17, T:61).

The inspected official client provides meaningful protection: CT:108–120 derives the prior from a verified confirmed projection, CE:154–181 validates the legacy envelope/manifest and hydrates it, SC:43–52 serializes the complete current state, and CC:49–60 verifies emitted compressed bytes. Native loading checks exact round-trip state, schema, campaign and lineage (SC:20–30, SC:58–73); decompression is bounded and hash checked (CC:26–45, CC:64–85). The source tests at `apps/player/src/session/cloud/snapshotCodec.test.ts:9–44` explicitly cover retired FSRS keys, absent newer keys, frozen encounters, and older schema hydration. They were read, not rerun. No intentional learning-history truncation or registry-driven normalization of current native snapshots was found in these paths.

Keep verified external exports of legacy current/prior before first production conversion. Do not describe SQL's checksum acceptance alone as proof of learning-data fidelity. An integration test must decode the actual SQL-returned native current/prior with the production codec and compare complete hydrated state, including FSRS, against the legacy input.

The retention transition is intentional: on conversion from revision N, the old current N is rewritten as a complete native prior, N+1 becomes current, and the older N-1 is pruned (M:153–168). It does **not** retain three generations or the old N-1 forever. On later saves the same two-generation policy applies. If conversion fails, atomic rollback preserves the original pair/evidence. Recovery from an already-corrupt legacy current is a separate path: `coordinator.ts:576–577` skips automatic snapshot upgrade while prior recovery is active, so do not claim this migration automatically repairs that state at capacity.

## Security and quota assessment

| Area | Static conclusion and evidence |
| --- | --- |
| SECURITY DEFINER search paths | All new/replaced definer functions in M use `set search_path = ''` (M:31,184,202,216,239,258). Public wrappers are invoker functions with the same fixed path (M:197–198,212–236). No unsafe dynamic SQL exists in M. |
| Player ownership | IDs derive from authenticated membership checks, not a request owner field; campaign, snapshot, writer and operation lookups are scoped by `owner_id = id` (M:72–100,108–111,153–171,220–223). No path to read or write another user's campaign was found. |
| Grants / RLS | M:402–408 revokes defaults and grants authenticated execution only for the intended RPCs and their invoker-wrapper callees. Existing public read/write wrapper ACLs survive CREATE OR REPLACE. No new table grants or policies are introduced. Existing tables have RLS and no direct player table grants (B:140–152,224–236). Live ACL drift still needs a catalog check. |
| Owner restore | Service-role claim required at M:267–268; service-only execution derives from BK:198–202 and survives replacement. M:288–307 requires a live admitted consenting account, closed gates, no deletion tombstone, empty campaign/name and a free slot. It cannot overwrite an existing campaign. M:339–349 enforces owner/head/format scope; rows are restored in one transaction. |
| Dynamic SQL dependencies | Backup export uses a fixed table/column allowlist and binds owner UUID via `USING` (BK:40–52). No caller-controlled SQL identifier/string concatenation was found. T:27 quotes its temporary schema identifier with `%I`. |
| Payload limits | Write text/wrapped body <=6 MB (M:41–45), each snapshot/prior <=3 MB compressed and declared decoded (M:105,117), <=100 usage receipts (M:62), <=4 lineage parents and <=160 branch bytes (M:18–24). Restore input <=28 MB and <=512 pages (M:269–275), with 1–2 snapshots required (M:332–335). R6 covers the native load argument regression. |
| Failed request resource costs | Writes hash/parse before admission and rate checking (M:41–72). Bodies are bounded, but rejected transactions roll back SQL rate increments, so this is not an ingress-level abuse limiter. This pattern is inherited from B:409–440. No decoded gzip bomb executes inside SQL; the client bounds decompression. |
| Exact retry | Same owner/operation ID must match campaign and exact request hash before returning its original receipt (M:75–82). It does not renew a lease, add usage, prune, or reserve again. Changed bytes are rejected. Imported IDs persist; save receipts are retained eight days (B:719–721), longer than the seven-day new-operation window (M:83–85). |
| Retry availability limitation | Admission/write/project gates and mutation rate run before the receipt lookup (M:72–81). A committed retry can fail while gates close or capacity is exhausted; this is inherited behavior, not double application. The separate operation-status RPC uses the read gate (B:626–633; TR:211–216) for reconciliation. |
| Logical accounting | With consistent preexisting ledgers, conversion adds the new/prior snapshots, subtracts replaced/pruned snapshots, subtracts the campaign's evidence once, and adds one operation (M:110–136). Campaign evidence becomes zero and physical dead estimates increase (M:167–169). Identical retries return before those updates. Negative account counters are guarded by B:295–298 and table checks B:29–32; project accounted bytes also have a nonnegative check (B:17). R3 identifies the final-capacity check gap. |
| Existing drift / maintenance | Conversion trusts `c.evidence_bytes` as the amount to release (M:120), consistent with the existing writer/delete contracts. It does not repair preexisting drift. Audit sums before rollout. Pruning does not free physical allocation immediately; the retained maintenance/cleanup acknowledgement remains operationally necessary (D:108–112; P:98). Full snapshots increase churn. |

The competition and casual migrations were checked for relevant interactions: competition deletion preserves membership/account/quota ordering (CP:162–173); casual changes lock membership first and do not alter cloud save schemas or ownership (C:21–37, C:49–64, C:194–218). The snapshot migration does not replace these endpoints. No new runtime lock-order inversion with these RPCs was identified. This is distinct from the DDL inversion in R2.

## What applying the migration changes

| Change | Compatibility / failure implications |
| --- | --- |
| Snapshot columns and CHECKs | M:6–11 adds format default 2 plus nullable lineage and validates their relationship. Existing rows remain legacy. M:12–13 relaxes campaign evidence from 1–1,000,000 to 0–1,000,000. No campaign payload is converted during DDL. |
| Renamed private functions | M:182 and M:200 rename the existing legacy write/load functions, retaining their implementations under new private names; direct execution is revoked. New guarded functions take the old names. |
| Replaced existing functions | Public `beta2_cloud_write(text,text)` and `beta2_cloud_load(integer,text,text)` wrappers are replaced (M:197–213); private `beta2_cloud_access(integer)` and `beta2_backup_restore(text,text,boolean)` are replaced (M:238–399). Signatures, default load revision and restore apply argument remain compatible. Access adds `snapshotSaves:true`; restore accepts native backups. |
| Added functions | Native write/load public and private RPCs plus private lineage validation (M:15–177,215–236). Native writes use body protocol 4; shared access/lease/load RPC arguments deliberately remain protocol 3 (M:49,72,217,245; CW:21–27; TR:110,153–154). |
| Transaction / cache | Explicit BEGIN/COMMIT encloses all changes (M:4,410), including ACLs and schema-cache NOTIFY (M:409). A statement failure before COMMIT should roll everything back when the entire file is run in one transaction/session. No intermediate published ACL/function state is intended. Runtime branch errors such as R1 can remain undiscovered by DDL success. |
| Reapplication / rollback | This is a once-only migration: duplicate columns/functions or already-renamed functions make a repeated apply fail. It is not a rerunnable repair script. If the first attempt rolls back, retry the complete corrected file. After successful native conversion, rolling back only the client is incompatible and restoring legacy wrappers cannot recreate deleted evidence (P:72–76). Keep the native reader and forward-fix. Do not rerun the old restore-helper installer over M. |

## Rollback-only test: actual coverage and live safety

| Requested path | What T actually establishes if executed successfully |
| --- | --- |
| Legacy at-capacity conversion | T:46–59 imports real logical evidence rows costing 999,998 bytes and checks that a further legacy append hits capacity. The fixture is two bytes below the 1,000,000 cap and legitimately cannot append. T:60–67 then attempts conversion. This is a useful test and should expose R1. |
| Current/prior preservation | T:65 checks the original head after a bad **new** digest; T:72 compares prior blob equality; T:93 checks two retained rows after another native save. It starts from a legacy import with no prior. It does not test converting an existing legacy two-snapshot pair, missing/bad prior conversion blob, or failure after destructive statements. Its opaque blobs cannot prove FSRS fidelity. |
| Idempotence / fencing | T:68 and T:79 compare identical receipts before/after takeover. T:77–78 rejects an old generation; T:83 rejects stale revision. Good sequential coverage, but no changed-hash/same-operation conflict, concurrent retry, expiry-during-acceptance, or two-connection conversion/takeover race. |
| Old-client rejection | T:73 validly checks retrieval of the old import receipt. T:74–75 and T:135 are insufficient for the intended guard behavior; see R4. A successful unconverted legacy save after migration is absent (the one attempted legacy save is deliberately over capacity). |
| Quota release | T:71 asserts account evidence zero; T:91–92 checks deleted rows; T:94–95 recomputes snapshot totals. It does not assert exact project accounted/dead deltas, auxiliary operation totals, unchanged ledgers on retry, nonnegative values after native deletion/restore, or R3's boundary. |
| Other-user denial | T:138–143 tests a second admitted user's native load denial. It does not test cross-owner save/convert, explicit prior read, same campaign ID under two owners, raw table ACL/RLS, or both public/private RPC entry points. T:96–97 checks only two function privileges. |
| Restore / revocation | T:104–134 exercises synthetic native export, delete, dry-run/apply restore and native current/prior reads. T:145–149 tests revoked native read. No legacy-backup restore after the new columns, restore overwrite denial, malformed native prior, or revoked native write is covered here. |

**Is it fully rolled back?** For the shown SQL in one dedicated connection reaching T:152 (or disconnecting/rolling back after error), fixture users/memberships/accounts/campaigns, functions in the temp schema, quota/configuration changes, grants and revocation updates are transactional and do not remain as committed application data. Fixed UUID collisions cause an INSERT failure rather than an overwrite (T:29–32). There is no COMMIT, external call, VACUUM, or sequence operation in the test itself. Inspected repository triggers do not show an external side effect for this fixture path; live-installed Auth hooks/triggers were not inspectable.

**Is it safe to run casually against the live project with no persistent side effects? No.** R5's quota lock can block live saves; rollback does not undo generated WAL, allocation/bloat or logs/statistics, nor certify unknown live triggers. Physical allocation can matter to these RPCs' `pg_database_size` guard even though fixture ledger increments roll back. An interrupted editor can leave the transaction open. A live rehearsal needs its own authorization, controlled timing, fail-fast execution and connection cleanup. Prefer an isolated database, and do not infer success from T:153 alone.

Before changing this verdict, the manager should have a successful **executed** corrected SQL suite under default PL/pgSQL conflict behavior, the added R1–R6 regressions, and multiple-connection rollout/race evidence. Include a production-codec round trip of legacy current/prior through the SQL RPCs and representative complete learning histories. Confirm live prerequisites, ACLs, logical ledger sums, physical capacity and verified backups separately. None of those live checks is claimed by this report.

## Reviewed content fingerprints

SHA-256 values read during this review; line references apply to these files, not later manager edits:

| File | SHA-256 |
| --- | --- |
| M | `ee97984b1a58fa7c1d93db7995f7c06b77c339d02e28f454bc8a6f27972d408f` |
| T | `54115cba41559792ef85ec463e7225a205dd546293c4b163192016c28cfe5a68` |
| TR | `41292cf376f670d22454b1a0dedb1d848b4ab497fa0278265b45e18a2f7aca01` |
| SC | `d9d78a73122e782def352c80cc1741dd2b39a4d0a1c1165775b45a06e6251425` |
| CT | `08666325df5d753cbc72546798af8c965aa1a338f3e9937252a1f851eed16139` |
| CW | `7637daaef1bb49758603a82bb56ca131f75b6eb006807f7d94e2d26d18406baa` |

Validation performed for this review: line-by-line local SQL/client inspection, tracing referenced auth/delete/codec helpers, inspection of the local pre-change transport, and SHA-256 fingerprinting. SQL and application tests were not executed. No claim of production deployment or backup creation is made.
