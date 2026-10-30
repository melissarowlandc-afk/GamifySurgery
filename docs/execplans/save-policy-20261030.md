# Incremental local durability and save policy ? 2026-10-30

## Goal, approved direction and scope

Milestone B follows released incremental evidence milestone A (`ce9ebb14`). The owner-approved policy in [save-strategy-20261029.md](../research/save-strategy-20261029.md) is implemented in the player: prompt incremental device commits; operational snapshots about every five dirty foreground minutes; dirty account fallback every five minutes; best-effort prepared uploads on leaving; dirty day-end uploads; explicit Save & Close. Automatic lifecycle/boundary/fallback uploads share a 60-second cooldown. Healthy saving stays quiet. No in-play Save button or persistent status indicator was added. Supported-device acceptance is current iOS and one major version back.

This is the manager-assigned worker lane. No agents, Git, installs, network, browser execution, server/SQL changes, clinical-content or question-tooling edits. The shared tree includes unrelated unreleased pilot work. Baseline copies and hashes are in `.local-dev/save-policy-20261030/before/` and `baseline-sha256.json`. Unrelated `flagFreeze.test.tsx` timeout edits are preserved and excluded from worker ownership. No opening pathway/origin/profile/launcher changed.

The only game-domain runtime edit is the reported pure recorded-result helper API in `packages/game-domain/src/game-evidence.ts`: extract a descendant delta, restore recorded results, obtain/update a private projected snapshot and build an operational snapshot. No reducer, content, grading, immutable evidence version or account revision format changes. Manager must rebind the changed runtime input in the release worktree; this worker does not edit canonical Level 5 bindings or the pilot.

## Progress

- [x] B1: preserve source baseline; inspect the old full-copy paths; build Level 1/Level 5 measurement harness.
- [x] B2: transactional append journal, captured barriers, atomic compaction, local-profile recovery and migration compatibility.
- [x] B3: incremental worker-prepared account candidates, day-end/cooldown/lifecycle scheduling, lease separation and safety coverage.
- [x] B4: final current-source full validation, measurement tables, scoped audit and manager handoff; known binding failure and manager browser/iPhone acceptance explicitly outstanding.
- [x] B5: repair the manager's 108/108 browser entry rejection; validate the real development worker boundary and bounded entry/retry paths, then return for browser acceptance (manager rerun outstanding).

## Browser rejection: development worker startup and bounded entry (2026-10-30)

Manager rejected the first B handoff: all 108 cloud browser cases failed. The reported imported row and verified Level 0 did **not** establish that worker warm-up had completed. `CloudCampaignEntry` publishes summaries/levels while its parent's `preparing` prop is still true; that prop alone disables Resume and shows “Getting your campaigns ready…”. Enrollment and presentation/worker preparation are separate operations.

The startup failure is now reproduced without a browser or network: use Vite's actual **development/HMR transforms**, rewrite module URLs to temporary local files, then load that unbundled graph in a separate Node worker with no `window`. B's `codecTasks.ts:10` imports `journalCodec.ts`/`journalWarm.ts`, whose `localJournal.ts:7` imports `problemDiagnostics.ts`. Its previous first import was `../appVersion`, a JSX component module. The development transform pulled `/@react-refresh` into the codec worker; that runtime executed `window.__registerBeforePerformReactRefresh = ...` (generated line 599) and threw **`ReferenceError: window is not defined` before codec.worker.ts announced ready**. `codecWorker.ts` prevents the default worker error and reports a classified processing failure, explaining the absence of a browser console error. `App.tsx:483` catches warm-up failure, but its entry prop is `preparingEntry || preparationError`: a failed preparation therefore keeps Resume disabled and the child spinner visible until Retry, even after enrollment completes. An additional cold-start missing-response case previously had a 65-second parent bound, exceeding the browser helper's 20-second wait. Production has no React Refresh transform and bundles away unused JSX; an inline test executor never evaluated that development graph, explaining why the earlier tests passed. This is a development QA entry regression; this evidence does not establish an additional production/iOS freeze cause.

The fix moves unchanged version/build constants to plain `buildVersion.ts`; `appVersion.tsx` re-exports them for existing consumers, while diagnostics imports only the plain module. This extra player-file scope is required to remove the worker's JSX/HMR dependency. The same unbundled native-worker probe now replies ready/hash. The committed negative-control test reinstates only that old dependency using a test transform and verifies two immediate `window is not defined` worker failures; the positive test loads the corrected graph and completes hash, journalBind, local journalPrepare, journalWarm and compaction through actual structured cloning and the worker's independently created async IDB connection. No HTTP/WebSocket listener or browser is started; the worker bootstrap forbids fetch and stubs HMR's transport without network.

Additional boundary coverage/fixes:

- The worker reply is clone-checked in dev/tests, including the inline executor. Native result-post failures return `worker_data_clone`; unknown task kinds return `worker_payload`. Production uses the native postMessage clone with a classified failure fallback, without adding a second full-result clone. The controllable worker fake now clones replies too.
- Real coordinator/game-session phone and desktop QA integration tests use native MessageChannel queues/cloning in both directions and async IndexedDB, including notice acceptance → enrollment → Resume → playable. No e2e fixture imports were changed to reach coordinator/codecWorker.
- A journal transaction previously rejected only its `done` promise on timeout, while the caller could still be awaiting `work(tx)` forever if an IDB request callback was missing. It now races the entire work/completion against interruption, aborts safely and rejects after 10 seconds even if a transaction already completed. The regression test drops a request callback and verifies that the retained snapshot remains intact.
- A temporarily unreadable local journal now marks inspection retryable and prevents enrollment of its potentially older legacy fallback. It does not mark migration complete; originals remain available for retry.
- Entry attempts record only technical stage/elapsed/failure/flags in the existing problem-report diagnostics. The disposable QA status additionally exposes `entryPreparation` and `codecHealth`, so a future stalled preparation can be distinguished from import or refresh work without inferring it from a campaign row.

| Entry/open wait | Deadline / outcome |
| --- | --- |
| Presentation + initial worker warm-up | 30 s total; visible preparation error with Retry / Reload |
| Local-profile journal recovery before mount | 30 s total; visible device-save error with Retry |
| Enrollment inspection, choice, frozen import and list refresh | 30 s total per UI attempt; visible error with “Try saving my campaigns again”; late UI continuations fenced |
| Serialized enrollment library job / queue | 30 s; settled map entry is released so a stalled prior promise cannot lock retries |
| Refresh after an enrollment error | Detached, bounded 5 s observation; cannot hold busy/Retry locked; provider retains its existing bounded error handling |
| Explicit entry action, including switching from a prior durable session | 65 s outer bound covering the existing 30 s prior drain + 35 s open; existing action can be retried after error |
| Native journal open / transaction | 10 s each; transaction deadline now covers missing request callbacks as well as completion |
| Verified automatic selection / session hydration | Existing 30 s automatic-resolution and 35 s App open bounds, cancellation fencing and visible recovery retained |

Timeouts do not cancel a server operation that may already have committed. Retries reconcile/read back the **same frozen operation** and IDs; tests hold the final post-import enrollment write, time out, retry, release its late completion and verify **one import, one server operation, unchanged original bytes** on both layouts. No campaign, journal, pending cloud operation, recovery copy, evidence ID or format is discarded or renumbered. This correction leaves B's cadence/commit/compaction policy and production hot-path work unchanged; prior benchmark tables remain the earlier isolated B measurements, not new Safari acceptance claims.

Correction validation: focused **185/185 (12 files, 57.82 s)**; final full player **3,150/3,150 (305 files, 392.45 s, native exit 0)** with the documented preload, `--pool=threads --maxWorkers=2`; **seven workspace typechecks PASS; e2e/QA typecheck PASS; 12-module e2e runtime import guard PASS**. The first full run passed 3,148/3,150: two old preparation tests advanced the test worker's previous 15-second bound. They now assert that entry remains fenced just before the new 30-second bound, shows its error exactly at the bound, ignores a late response, permits Retry and has acquired no new writer. Both layouts pass focused and full validation. All **1,011 monitored player/domain/e2e inputs** stayed unchanged during the final full run. Artifacts: `.local-dev/save-policy-20261030/enrollment-boundary/` (source baseline, scoped manifest/diff, native probes, `focused-current.log`, `player.{json,log}`, native exit files, typecheck logs and validation manifest). No game-domain/clinical/question source changed in this correction; the previously reported B domain validation/binding limitation below remains unchanged and domain tests were not repeated for this player-only correction. Manager must rerun the 108 browser cases against a fresh QA server and supported-iPhone acceptance before accepting/releasing B.

## Evidence and architecture

### Previous history-dependent work

At the milestone baseline `CloudGameSession.scheduleFlush` posted the whole raw checkpoint after separately flushed commands, then staged/packed/read back the complete compressed cache. Four codec posts were normal for one command. In local-only mode `usePrototypeSession` still serialized the complete profile to synchronous localStorage after meaningful actions and periodically on facility ticks. Milestone A deliberately left these persistence boundaries unchanged.

A restored five-minute network timer alone did not remove that work. B separates three facts: accepted in memory, committed on this device, and confirmed by an account receipt. Only a completed journal transaction advances device durability. Account confirmation still requires the original validated receipt and immutable operation reconciliation.

### Authoritative local journal

`session/localJournal.ts` adds the independent IndexedDB database `gamify-surgery.local-journal.v1` (database version 2; journal manifest schema 1). Its authoritative stores are `heads`, `snapshots`, and `rows`; `prepared` and `chunks` are derived account encodings. Existing localStorage profiles, cloud cache DB, entry/retained-copy DB and account revisions remain readable and are retained.

A head contains owner identity, committed high-water, current snapshot boundary and prior snapshot boundary. Each row contains only recorded projection patches (including changed array entries and bounded append/shrink operations), every appended immutable evidence row, small campaign/profile metadata and opaque pending usage receipts. Rows and snapshots are hashed. Meaningful actions start a drain after 250 ms; ticks use a fixed first-dirty 1,000 ms deadline. A later tick cannot postpone that deadline; a meaningful action expedites it. The queue is bounded at 128 rows, with one active transaction. A drain/barrier captures its version and does not wait forever for future ticks. Storage/open transactions have 10-second deadlines, and explicit outer waits are bounded. Strict durability is requested where supported, with the compatible transaction-option fallback.

The high-water changes atomically with its batch and is acknowledged only after transaction completion. Quota retries reclaim auxiliary data first and retry the identical immutable batch once. No campaign, journal, unsent cloud operation or retained branch is evicted. A failed commit leaves rows in memory and visibly fences further unprotected progress; a failed derived worker preparation does not revoke an otherwise valid lease or committed local progress. The existing real authority/fencing gates remain.

Recovery validates the snapshot hash, row hashes, exact sequence/IDs and the complete domain evidence contract, then applies recorded results. It never re-executes commands, regrades answers or uses current clinical content to recreate the past. An abrupt kill without events recovers exactly the completed high-water and may lose only the still-uncommitted batch. One/two-second dirty age is a normal foreground target, not a promise during storage failure, suspension or OS termination before commit.

Compaction runs in the codec worker at about five dirty foreground minutes, or a useful day/session boundary. The replacement snapshot and manifest commit atomically. One complete prior snapshot and its required suffix remain; only an older redundant operational generation is reclaimed. No immutable evidence record is removed from the checkpoint. Old/new documents use owner plus high-water compare-and-swap; late binds cannot overwrite newer recorded progress. Main-thread commands never await worker or storage.

### Local profiles, selection, enrollment and privacy

`localProfileJournal.ts` overlays journals on legacy profiles before the local game mounts. Ordinary local commands/metadata no longer serialize the full profile to localStorage when IndexedDB is available. The fallback remains for environments without IndexedDB. Campaign creation/deletion boundaries keep the existing legacy roster; journal recovery never resurrects a removed campaign. Campaign preferences merge per campaign; global preferences, pending opaque usage and last selection use the latest committed profile sequence, never wall time or enumeration order. Evidence checkpoints survive same-document campaign switching and build undo.

Save & Close now awaits the captured local commit before showing ?safe to close?; the existing desktop/phone dialog and App callbacks accept that promise. No in-memory state is described as saved. Campaign switching drains the old writer before binding the next. Account privacy exports include current in-memory evidence and authoritative committed local journals; clearing account device data fences/awaits the local writer first and keeps other accounts/guest data separate.

The existing enrollment/import path reads the latest verified journal rather than an older localStorage state and carries its original evidence bytes and transition IDs faithfully. It does not create a new baseline over already recorded history. Original legacy source bytes remain available.

### Prepared account candidate without main-thread history copies

`cloud/journalWarm.ts` keeps a worker-private mirror of at most two campaigns. After a completed foreground batch, the main thread posts only `{database,key,owner}`; the response is a tiny high-water. A single coalesced task reads the committed suffix directly from IndexedDB, verifies row hashes and applies recorded operational patches to its private projection. Its pure projection update keeps raw records immutable. It canonicalizes/compresses only new immutable records, reuses verified accepted encodings, and writes the new compressed suffix plus prepared cursor atomically. It does not reread the compressed prefix or open a new connection per batch. If the worker is killed, the mirror is rebuilt from the authoritative snapshot/journal; derived writes are idempotent, owner-fenced and retry the same payload. No RPC runs in the worker.

The existing v2 account envelope/manifest still requires hashing the exact archive. B retains canonical immutable record strings in the worker and hashes their rope plus new suffix; this remaining history-sized hash/UTF-8 allocation is worker work, not a claim of constant total checkpoint CPU. Operational snapshot serialization/compression is also worker-side. No new account wire format, server RPC or SQL is required, and no transferable account format was introduced. Avoiding the recurring full-state message is more effective here than transferring another full raw copy. A full base is adopted/verified once on open/worker restart; open/recovery and five-minute compaction remain separate bulk paths. Native compaction replies omit the full confirmed prefix and raw checkpoint.

`CloudGameSession.durable()` now means the small local transaction. `prepareRecoveryCopy()` explicitly materializes/stages an account recovery candidate without RPC. At an upload boundary the latest prepared candidate is read/staged/verified using the existing cache protocol. The immutable in-flight operation, exact request hash, lost-ack lookup, accepted evidence prefix, usage deduplication and writer generation checks remain. ACK updates an owner-scoped record cursor; later warm jobs append only the unacknowledged suffix. Cache readback skips journal hydration; open/accountEntries overlays the committed journal once and avoids reintroducing an already represented pending operation.

### Trigger and permission policy

| Trigger | Device work | Account work |
| --- | --- | --- |
| Meaningful action | Accept immediately; 250 ms small batch | Prepare incrementally in background; no upload |
| Facility ticks | Keep every evidence row; fixed ~1 s batch | Same small-pointer worker preparation; no upload |
| Explicit pause/menu boundary | Captured small drain | No new ordinary RPC |
| Five foreground dirty minutes | Worker operational compaction | Latest dirty candidate, ordinary fallback upload |
| Dirty day-end | Captured drain/useful snapshot | Automatic upload, subject to 60 s cooldown |
| Hidden/pagehide/freeze | Drain already accumulated small work | Use latest durable prepared candidate; no first full encode/compaction starts here |
| Save & Close | Stop ticks, captured drain/preparation | Confirm latest accepted progress; release lease only after safe completion |
| Lease pulse | Clock/authority scalars | Independent 15 s tiny renewal RPC; no campaign codec/IDB pass |
| Routine focus | Existing cheap coalesced lease/head handling | No accountEntries/retained-copy scan or full automatic selection |
| Open/reopen/changed authority | Verify snapshot+journal/copies | Existing automatic newest-copy selection, fenced takeover/reconciliation |

Automatic ordinary/day-end/lifecycle uploads share a 60-second cooldown after a successful automatic upload; failures are not reported as successful cooldown saves. Manual Save & Close/purchase/recovery intent can bypass automatic cooldown. Unchanged campaigns never upload. If hide races the first preparation, its raw journal still commits and reopen can upload it; leaving delivery is best effort and does not wait for first full-history encoding. Starting a later warm task from an exit drain is suppressed; already in-flight preparation may finish.

No offline lease extension, silent overwrite, evidence renumbering, normal choice dialog or persistent healthy-saving status was added. Revoked/deleted, capacity, corrupt prior recovery/export, true branch preservation, same-device reclamation, no-replay and old-writer fencing remain in the existing protocol/tests.

## Source review map

| Responsibility | Source evidence |
| --- | --- |
| Commit timer, high-water, queue, native transaction/upgrade | `session/localJournal.ts` (`LocalJournalDrain`, `IndexedDbJournalStorage`) |
| Pure local array deltas and verified recorded-result recovery | `packages/game-domain/src/game-evidence.ts` (`GameEvidenceDelta`, `journalPatches`, `restoreGameEvidenceJournal`) |
| Native worker journal bind/prepare/compaction | `session/cloud/journalCodec.ts` |
| Incremental derived candidate, owner recheck, immutable compressed suffix | `session/cloud/journalWarm.ts` |
| Immediate commands, raw durability, exit drain, day end, captured close | `session/cloud/gameSession.ts` |
| Cooldown, immutable operation/ACK cursor, independent renewal | `session/cloud/coordinator.ts` |
| Legacy overlay/deduplication and account clear | `session/cloud/cache.ts` |
| Local profile/selection/usage ordering and switching | `session/localProfileJournal.ts`, `session/usePrototypeSession.ts` |
| Exact evidence-preserving enrollment and protected sources | `session/cloud/importCampaigns.ts`, `session/cloud/retainedCopies.ts` |
| Await real commit in existing UI, stale-render-safe replay handoff | `App.tsx`, `AppShell.tsx`, `mobile/MobileShell.tsx`, `ui/SaveCloseDialog.tsx` |
| Device export/clear includes committed journals and memory recovery | `session/cloud/CloudAccount.tsx` |

Player paths above are relative to `apps/player/src/`. The game-domain helper file is the only changed bound runtime source; no fixture or binding was rewritten.

## Tests and discoveries

New suites cover journal commit/recovery/compaction; fixed batching and bounded queue; pre/post-commit uncertainty; native transaction abort; quota retry; snapshot corruption; schema-v1 upgrade; writer CAS/late-bind rewind; local-only campaign switching/preferences/enrollment; kill without lifecycle events across independent runtimes and asynchronous native clone/IDB boundaries; day-end/cooldown/five-minute fallback; no upload when unchanged; leaving a ready candidate vs leaving before the first encode; slow/dead/throwing worker with commands still accepted; and byte-for-byte prepared-envelope/evidence equality against the complete v2 encoder for Level 1/Level 5 with both memory and asynchronous IndexedDB stores.

Review found and fixed: imported checkpoints must be frozen once to reuse A's trusted immutable ancestry; full JSON key insertion order is not an ancestry test (canonical comparison is required); writer generation must accompany raw journal recovery; already acknowledged/reconciled candidates must not be reintroduced as ?following?; metadata-only archive jobs must not rotate/rebind an older journal over a protected newer branch; a coalesced older preparation must still include Save & Close's captured pause; per-campaign metadata must not replace another campaign's preferences during traversal; current local selection must follow committed sequence order. Tests retain exact states, all evidence IDs and no-replay assertions. An asynchronous replay-opening callback now uses the ref-backed committed profile rather than the stale render it captured before awaiting a save. A worker task rechecks its requested owner after asynchronous reads; owner rotation cannot let it adopt a replacement document's mirror.

The actual phone/desktop QA integration now waits for preparation readiness before measuring focus-only work. Its leaving test checks exactly one ready-candidate upload across hidden/pagehide/freeze. The e2e hidden-offline case waits for actual local durability rather than assuming that leaving must begin an RPC and report a network error. All retained-copy, fencing, capacity, deletion, archive, corrupt-head/export and immutable-operation assertions remain. E2e runtime fixtures remain outside coordinator/codec-worker import graphs.

The size audit additionally caught whole-array replacement inherited from account snapshot patching: initial Level 5 tick journals contained about 176?188 KB of operational patches for only 746?1,188 bytes of immutable records. The local-only patch dialect now records changed array entries/append/shrink rather than the entire service/actor collections. Four controlled tick patches dropped to 18.9?53.5 KB (27.3 KB first tick); all immutable record counts/bytes were unchanged. Historical atomic-array rows remain readable. Account snapshots still use the existing atomic-array format, with byte-for-byte v2 equality tests. Raw local size is bounded by current operational changes, not claimed to be zero or constant across facility complexity.

## Measurement method and results

Final isolated benchmark: **1/1 PASS, 59.36 s, native exit 0**, Node v24.19.0 on Windows. Harness/artifacts: `.local-dev/save-policy-20261030/benchmark.test.ts`, `benchmark.config.mts`, `measurements.json`; baseline source copies use the same released-A domain implementation. Native V8 structured clones and asynchronous fake-indexeddb transaction completion are included; codec/server CPU is separated from main callback slices. These are Windows/Node measurements, not Safari, native worker startup, real disk or phone network latency. Manager must repeat native-worker/real-IDB and supported-iPhone tail-latency/kill checks.

The Level 5 profile is the existing quota fixture shape (running integration checkpoint plus its frozen encounter), about 1.405 MB UTF-8 / 2.81 MB UTF-16, 1,960 immutable records. Report whole command/tick CPU separately from persistence; A's unchanged large-facility tick simulation remains substantial and is outside this save-policy fix.

### Before/after measured main-thread CPU

These are sums of initial synchronous work, client callback slices and response materialization for the session boundary, not a maximum contiguous browser task or input-to-frame measurement. Worker/server execution is excluded. React/Phaser rendering, native disk/network and Safari startup/GC are not measured. Each command/tick row has 8 samples, metadata commit 5, checkpoint/compaction 1. Small-sample medians/maxima do not establish supported-iPhone p95/p99 budgets.

| Main-thread work (ms, median) | Level 1 before | Level 1 after | Level 5 before | Level 5 after |
| --- | ---: | ---: | ---: | ---: |
| Speed-change command + local persistence | 3.35 | 1.57 | 49.17 | 11.22 |
| Facility tick + local persistence | 4.40 | 2.11 | 161.22 | 106.32 |
| Metadata-only local commit | 1.92 | 0.22 | 32.85 | 0.25 |
| Prepare/stage dirty cloud checkpoint | 2.54 | 1.53 | 39.35 | 16.03 |
| Upload/verify/ACK already prepared checkpoint | 1.37 | 1.28 | 26.47 | 25.54 |

| Persistence portion after subtracting synchronous command CPU (ms, median / sampled max) | Before | After |
| --- | ---: | ---: |
| level1 command | 1.88 / 2.34 | 0.28 / 0.39 |
| level1 tick | 2.11 / 2.53 | 0.26 / 0.40 |
| level5 command | 34.49 / 37.88 | 0.33 / 0.54 |
| level5 tick | 34.40 / 37.13 | 0.90 / 3.90 |

The large facility's unchanged reducer/evidence application still costs about **105 ms per tick**. B does not claim to solve that active-world simulation cost or prove the live iPhone freeze's cause. After B the metadata-only local commit maximum was **0.26 ms / 0.37 ms** (Level 1/5). Five-minute worker compaction used **0.50 / 0.22 ms main CPU**, **7.37 / 102.68 ms elapsed** (Level 1/5); normal native compaction messages/replies carry no raw full checkpoint or confirmed prefix. Prepared upload/ACK still pays the existing full-prefix verification/cache/wire cost at the infrequent boundary, so do not claim all saving is constant-cost or eliminate that measured 25.55 ms Level 5 client CPU.

### Commit age, message sizes and recovery exposure

The scheduled samples below let the actual batch timer fire; they do not force an immediate barrier. Age starts after synchronous command application and ends at completed local commit, independently of the worker mirror/cloud. Three samples per row. Explicit barrier timings above are separate.

| Scheduled dirty age, ms (median / max) | Before | After |
| --- | ---: | ---: |
| level1 command | 57.85 / 62.38 | 263.85 / 265.70 |
| level1 tick | 61.88 / 64.85 | 1011.82 / 1012.50 |
| level5 command | 1282.54 / 1284.62 | 255.06 / 257.21 |
| level5 tick | 1262.27 / 1302.29 | 1007.99 / 1013.98 |

The maximum observed normal scheduled age was **1,013.98 ms** (tick); maximum meaningful-action age was **265.70 ms**. These meet the proposed one/two-second targets in this harness, not a finite guarantee under suspension, slow/failing storage or OS kill. Abrupt-kill tests recover exactly the committed high-water and omit the last deliberately uncommitted batch; no lifecycle event, replay, evidence loss from a committed batch or campaign reset is used.

| Repeated separately committed command/tick | Before | After |
| --- | ---: | ---: |
| Worker posts per batch | 4 (full encode + validate + cache pack/readback) | 1 small journal address |
| Level 1 total posted bytes / command (median) | 216,838 | 184 |
| Level 5 total posted bytes / command (median) | 5,181,108 | 230 |
| Level 5 total posted bytes / tick (median) | 5,481,050 | 230 |
| Level 5 raw new journal bytes / command (median) | no incremental journal | 1,537 |
| Level 5 raw new journal bytes / tick (median) | no incremental journal | 29,682 |

At one separately committed batch per second the model is **240 worker posts/minute before**, about **62/minute after** including 9 account-boundary posts plus one operational compaction every five minutes. Actual old coalescing, tick speed, user input and worker retries change that rate; this is structural interval arithmetic, not a measured hour of Safari gameplay. The new ordinary posts contain only a key/owner, not the raw campaign. Reused compressed immutable prefixes and canonical worker strings avoid old-prefix recompression; the v2 manifest's history-sized hash remains in the worker.

### Account upload opportunities per active hour

| Workload, excluding initial enrollment/manual/recovery | Before | After |
| --- | ---: | ---: |
| Unchanged campaign | 0 | 0 |
| Continuously dirty five-minute fallback, no other boundary | 12 | 12 |
| Continuous 1x, full 10-minute facility days from day start | about 12 | about 12 (midday fallback + aligned day end) |
| Continuous 4x, 2.5-minute facility days | about 12 | about 24 (day-end freshness) |

The fallback/unchanged hour is asserted against the fake server (12 then zero more); speed/day-end frequency is derived from the existing 1,000 ms facility minute and 600-minute day. Lifecycle/manual/recovery exceptions are additional. Automatic lifecycle/day/fallback success is capped by the shared ~60-second cooldown; manual Save & Close remains explicit priority. Initial/partial-day alignment can shift the count by a boundary. Lease renewal stays 240 tiny RPC opportunities/hour and is not a checkpoint upload.

## Validation, migration and rollout

### Final validation (2026-10-30)

| Check | Exact result |
| --- | --- |
| Focused player journal/policy/native QA/watchdog suites | **83/83 PASS, 7 files**, 39.79 s; final native stale-render handoff assertion additionally **1/1 PASS**; all are included in final full player |
| Full player, documented preload, threads/maxWorkers=2 | **3,138/3,138 PASS, 304 files**, 389.30 s, JSON `success:true`, native exit **0** |
| Full game-domain, CI=1, same preload/threads/maxWorkers=2 | **4,331 PASS / 1 known source-binding failure / 1 optional full-replay skip = 4,333, 165 files**, 853.93 s, native exit **1** |
| Final pure helper/evidence coverage | New journal helpers **4/4 PASS** inside full game-domain; seeded existing evidence/oracle/undo suites pass |
| Workspace TypeScript | **7/7 workspaces PASS**, native exit 0 |
| Cloud e2e + QA harness TypeScript | PASS, native exit 0 |
| E2e runtime import boundary | **12 modules PASS**, no coordinator/codec-worker-reaching fixture imports |
| Isolated final benchmark | **1/1 PASS**, 59.36 s, native exit 0 |
| Optional root repository-boundary script | BLOCKED: internal `spawnSync git EPERM`; no Git operation completed; not retried or bypassed |
| Browser/native iOS | Not run in sandbox; manager runs 108 cloud browser cases and supported-iPhone canaries |

The domain failure is the unchanged pre-existing M9 binding guard at `packages/game-domain/tests/level-five-integration.test.ts:47`: `packages/clinical-content/src/answer-choice-timing.ts` expected `ad821c697ca2c8f6553ea03affd0cb868db65b56418c29e1c000307e771358eb`, actual `d29ef3e3710fc29bc20de5e77089561fa5fbf0889d95acdaa2d316bf1443a625`. This worker did not edit it or rebind the shared pilot. The skipped 26,710-command optional full replay was verified by A; B adds pure helper code without altering the existing evidence/reducer bodies. The final full suite passes the existing seeded oracle/immutability/undo checks. Manager owns intended-input selection and canonical rebind.

Changed bound runtime SHA-256: `packages/game-domain/src/game-evidence.ts` = `13debcdfe16a9505d60a0a42f42997406cf97e250ca61a783106e2bd4f06dc58`. New helper test SHA-256 = `6c183103ff4b974004ea9bd8beadfe4f765c2ace78e238aaaec667ee879c05a9`. No clinical source, reducer or save-schema file was edited.

Reports/artifacts are local and ignored: `.local-dev/save-policy-20261030/{player-accepted,domain-accepted}.{json,log}`, explicit `*-exit.txt`, focused log, seven-workspace/e2e/QA logs, benchmark source/config/results, `manifest.json`, `review.diff`, `validation.json`, and `accepted-source-hashes.json`. Intermediate reports (including the earlier bulk-array journal measurements) are diagnostic only. The final report files above identify acceptance evidence.

Exact commands:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
$env:CI = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/save-policy-20261030/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
node node_modules/vitest/vitest.mjs run --config .local-dev/save-policy-20261030/benchmark.config.mts --pool=threads
```

Migration is additive and transactional. A verified source is written as a new journal snapshot and read back before normal commands begin. A partial/blocked/quota-failed migration retains the old profile/cache and cannot claim durability. Existing new journal schema-v1 records upgrade by adding only derived stores. Account revisions/wire schema, local profile schema, immutable evidence schema and server remain unchanged. No SQL migration or rollback-only SQL test is needed.

**Rollback rule:** an old released script does not read the new journal. Do not clear storage or blindly roll back JS and resume its older legacy profile. Before any rollback, use this build to reopen/recover and confirm the newest account upload or export the verified current recovery bytes; then perform a manager-reviewed compatible rollback. New-format journals/retained copies remain protected. This worker did not deploy or alter any tester's device.

Manager acceptance: inspect scoped sources, rebind the reported pure runtime helper input in the release worktree, rerun browser tests, then current/one-prior-iOS standalone canaries (Level 1/5; 1x/4x; hide/show/lock; worker loss; quota; abrupt kill; network return; two writers). Stop rollout for unexplained lost progress, duplicate learning/usage, silent gates or persistent save-induced stalls. Existing report/watchdog diagnostics remain available. Local owner pathway remains START_GAME.cmd ? http://127.0.0.1:4173; remote playtest remains https://melissarowlandc-afk.github.io/GamifySurgery/ with separate local stores. No storage clearing, reinstall or campaign reset is required.

Work remains local-only. Manager owns acceptance/release and the separately audited GitHub checkpoint reminder; no backup was created by this worker.
