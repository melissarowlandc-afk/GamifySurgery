# Fast account entry and queue-aware codec watchdog (2026-11-02)

## Goal and approved scope

The owner's live desktop took 49.4 s to complete account entry for a roughly 4.8 MB cache. The codec was healthy after the released 60 s timeout hotfix. Find and remove redundant entry/open inspection, make Resume available without optional heavy work, record per-stage timings, and start task deadlines when the worker actually starts work. Preserve automatic newest-progress selection, recovery bytes, admission/fencing and the owner-approved layout.

Owned lane: `apps/player/src/session/cloud/**`, App entry/open orchestration, CloudCampaignEntry/CampaignChoices behaviour and diagnostics/tests. No domain routing, account save format, server/SQL, clinical/question or character-art changes. Shared tree; preserve concurrent edits. Keep `CLOUD_WORKER_TASK_TIMEOUT_MS = 60_000` and App's campaign-open diagnostic error hotfix. No Git, installs, network, browsers or subagents.

## Repository state and evidence

This worker resumes the same thread for the explicitly requested follow-up. Root instructions and current handoff were reread. Pre-edit scoped files/hashes are in `.local-dev/entry-performance-20261102/before/` and `before.json`, without Git. Prior compact welcome changes and current unrelated work remain intact.

Live observation supplied by the manager: entry complete 49,401 ms; confirmed-copy inspection approximately 3.2 s; unpackCache approximately 40 ms; worker healthy with zero restarts/errors. These are real-browser measurements, not reproduced timing claims. This milestone will separate deterministic task-count/timing evidence from local fixture measurements and manager browser acceptance.

## Milestones and validation

1. Trace list/levels/enrollment/reopen/retained/journal work and create a deterministic reproduction of redundant verification and queued-task deadlines.
2. Memoize verified copy inspections by immutable bytes within the runtime, use cheap row metadata, and remove optional work from Resume's gate. Keep heavy correctness verification inside bounded open with the existing loading screen.
3. Add worker start/progress protocol and a generous active-task watchdog, with bounded worker silence/startup handling. Record queue/active ages and entry stage durations in technical diagnostics.
4. Measure a realistic large fixture, document before/after counts and timings, and validate focused tests, full player with the documented sandbox preload and `--pool=threads`, all seven workspace typechecks, and e2e/QA typecheck. Manager runs Playwright and real-browser entry timing.

## Progress

- Initial inspection confirms CloudCampaignEntry's level effect directly decodes/verifies a full copy on the main thread; the enrollment gate also inspects local sources before declaring completion. Further tracing and baseline tests are next.

## Findings and implementation

The reported 49,401 ms is **not a trustworthy completed-stage duration**. In the pre-fix `CloudCampaignEntry.tsx:47-51,92`, diagnostics kept computing `Date.now() - started` even after setting `stage = complete`; the clock never stopped. It could report 49 s for work that had finished much earlier. This is proven from code and covered by a 49,401 ms post-completion advance in the integration test. The supplied capture does not contain enough stage timing to assign the owner's exact 49 s to one operation. Do not claim an exact 49 s reproduction or a browser speed result.

There are nevertheless reproducible, expensive gates and repeated work:

- Pre-fix `CloudCampaignEntry.tsx:131-135` read the full cache (including journal recovery) and directly called `loadCloudEvidenceCheckpoint` on the UI thread solely for the level label. It did that even before using the tiny existing enrollment marker. `:214` also disabled listed Resume during the entire enrollment scan. The original per-revision `levelRequests` map and once-per-mount `started` ref prevent a simple React rerender loop; they do not share proof with any open/reopen caller or survive remounts.
- Pre-fix `App.tsx:491` awaited an empty hash on the shared codec queue along with shell preparation. A harmless queued warm-up could therefore keep Resume locked. The two new held-scan UI tests fail on the pre-fix implementation; both layouts' row remains disabled. Old warm-up-gate tests have been changed to prove Resume and automatic reopening work **while** optional warm-up is still held/failed; their writer-fencing, one-operation, pending-upload and late-reply assertions remain.
- Pre-fix `reopenSelection.ts:16-22` hydrated all cache entries merely to select one campaign ID. Every `cache.ts:36-39` journal hydration could restore/validate/re-encode the full history again; accountEntries is called twice during automatic resolution and cache.read again during coordinator open. A missing last-active marker therefore made selection itself expensive before opening began.
- Pre-fix `codecTasks.ts:47-51,71` independently decoded/verifed every `verify` and `inspectCopy`. Automatic resolution performs checks while loading the head, discovering account/current/recovery/older copies, opening the coordinator, reconciling a candidate and loading the head again. The old discovery map shared inspection only inside one discovery call; there was no session-wide proof cache. The large integration observes six inspectCopy messages, seven verify messages and one candidate message, but now only **one full inspection** of those unchanged bytes. These are current task counts, not a claim that every old discovery message ran separately (its local map already coalesced some).
- Pre-fix `codecWorker.ts:70-74,94` started a timer for every posted/ready task, charging time spent behind other work against that task. This was the false-restart mechanism behind the earlier 5 s incident. The released **60 s constant remains**; only when its budget begins has changed.

Pre-fix line references above refer to the exact snapshots under `.local-dev/entry-performance-20261102/before/`. Current/pre-fix locations are also in `line-evidence.json`.

The implemented path is now:

1. Account access/list still check admission, notice/deletion and write access. Timed stages record actual RPC waits. Entry does not start a duplicate mount refresh while that initial check is already running.
2. Shell preparation remains bounded. Codec warm-up runs separately with its own bounded observation; it is not an entry permission gate. Listed Resume is independent of optional enrollment/level work. New creation and enrollment mutations retain their migration/slot gates.
3. Rows read only small revision-specific `preview:` or legacy `enrolled:` metadata. Missing level is omitted rather than showing a permanent "Checking level" label. A verified actual open writes a tiny optional preview; its failure cannot block play. The required layout/art, notices, row action names and privacy controls are unchanged.
4. A completed enrollment journal reads only `created:` records for unfinished deliberate imports. It does not scan every retained copy or revalidate old profiles. Existing minted usage staging is still promoted separately; no historical counts are minted. First-time enrollment and failed/new creation retry keep the original immutable import path.
5. Automatic reopen inventories account-scoped **IDs** with IDB getAllKeys. Full retained/newest-progress verification happens only in actual open, under the existing loading screen and deadlines. Every unique candidate is still considered; no bytes or branch are removed by this optimization.
6. The worker caches small verified summaries by a SHA-256 over the actual packed byte/length/encoding tuples plus expected campaign/baseline identity, independent of JSONB key ordering. It never trusts claimed hashes alone. Revision equality/validity is checked on every call. inspectCopy, verify and candidate validation share the proof; altered bytes or identity cannot hit the cached success. Failed work remains retryable. No decoded history or task payload remains in this session-local summary map.
7. Cache journal preparation is shared only for the same verified raw-cache checksum and complete committed journal head. Any new owner, high-water, compaction, acknowledgement or raw cache change invalidates it. At most two campaigns' prepared results are retained. Tests prove coalescing and invalidation after a committed action. Storage and worker failures retain their original classifications.
8. Worker dispatch is serial with a start acknowledgement at dequeue and a 5 s heartbeat. The 60 s active cap does not extend for heartbeats, and no queued task spends it. Startup and a ready worker that never starts its next task are separately bounded. Restart retries each identical pure/idempotent payload once; no RPC or new operation ID is introduced. Tests cover two legitimate 59 s tasks (118 s total), an actively hung task, missing start, worker failure and clone-boundary sequencing.

## Diagnostics and compatibility

`entryWork` records bounded stage/count/elapsed totals and current stage ages for access, list, shell/worker preparation, enrollment, metadata, reopen marker/selection, cache/journal recovery, head/load, discovery, hydration and last-active write. Completed durations stop changing. Codec in-flight rows distinguish queued from actually running work. Only static technical stage names/counts/times are reported; no clinic bytes, names, answers, tokens or stack frames are added.

The persisted diagnostics schema now accepts the existing `gameSession.preparing` field and the manager hotfix's colon-qualified `campaign-open:...` technical error source. Previously those could invalidate the tiny previous-session report on read. Tests cover a report round trip with both fields. Existing consent, feedback row transport and size budgets are retained. App's manager-added campaign-open diagnostic line is unchanged.

No server, SQL, account revision format, game-domain or clinical/question/art edits. Old profiles, caches, journal seeds, retained copies and account revisions follow the same verified loaders. New preview metadata is optional and cannot select/order a campaign or authorize play. The automatic newest-progress rule, immutable evidence, branch preservation, admission/deleted/revoked handling, fencing and paused-state behavior remain in the existing safety paths and tests.

## Measurements so far

The fixture is the retained `integration-lower-repeat` Level 5 checkpoint plus 1,200 actual reducer speed actions (4,981 evidence records). Lossless stored-block gzip deliberately exercises the 5 MB message/cache boundary; compression level is not an account-format change. No content was padded or invented. The production compressor is unchanged. The fixture source remains untouched.

The first final-size run measured a **5,227,176-byte copy / 5,414,317-byte cache**. Six uncached inspections took approximately **5.38 s** in this offline Node harness. The first memoized inspection took **908 ms**, subsequent identical checks **20–31 ms**. At the owner's supplied 3.2 s per inspection, removing five repeats would remove about 16 s of CPU/queue work; this is a work-count illustration, not proof of the live 49 s.

The actual entry/coordinator/game-session integration uses a queued MessageChannel with structured cloning in both directions and asynchronous IndexedDB. After fixture/storage setup it measured **15.6 ms** to enable Resume, with **zero codec, cache.read or accountEntries calls** before Resume, then about **3,007 ms** to fully verified/playable. All inspected copies were the same bytes and the shared worker performed **one** full inspection; restarts = 0. The saved paused state remains paused. Final measurements and validation/source affinity are recorded below when complete. Real Chrome/iPhone timings remain manager acceptance work.

## Next action

Manager reruns the existing cloud browser suites and measures entry/open time on the owner's desktop and target iPhones. No browser was run in this sandbox. No e2e locator changes were needed: existing specs do not wait for a level label, and safety assertions remain intact. The fixture-only `syncFixtureSupport` import boundary is preserved.

## Final measurements and validation

Final measurements are in `.local-dev/entry-performance-20261102/{measurements-final,entry-measurements}.json`. These are offline measurements with real codec/domain work, native structured cloning and asynchronous IDB; they are not Chrome/iPhone timing claims. Full-copy inspection is shared across inspector/verifier/candidate tasks; constructing the playable session still requires one hydration, under the loading screen.

| Measurement | Before / uncached control | After |
| --- | --- | --- |
| Actual copy / cache size | Same fixture | **5,227,188 / 5,414,317 bytes**, 4,981 records |
| Six identical full inspection requests | **6 full inspections, 5,321.0 ms total** | **1 full inspection, 1,055.3 ms total** |
| Cached repeat latency | Each uncached inspection 863.7–923.9 ms | **18.8–29.1 ms** after a 936.1 ms cold inspection |
| Entry before Resume | Reproduced disabled row while optional scan is held (both layouts) | **19.7 ms**, **zero** codec/cache.read/accountEntries calls |
| Actual open to verified/playable | Exact old live breakdown unavailable | **3,734.4 ms**, one full inspection, **0 worker restarts** |
| Two legitimate queued worker tasks | Old posted-time budget charges other tasks' work | **59 s + 59 s** simulated execution, **0 restarts**; active hang still bounded |

The final standalone benchmark passes **1/1, 1 file, 26.39 s**, native exit 0 (`benchmark-handoff.log`). The recorded 49.4 s observation remains explicitly un-attributed because the old elapsed counter continued after completion; new per-stage timing is designed to settle any remaining real-browser cost rather than guess.

| Validation | Exact result |
| --- | --- |
| Focused changed cloud/entry/diagnostic/App seams, including the actual development module worker | **323 PASS / 0 FAIL, 21 files, 107.06 s**, native exit 0 (`focused-handoff.log`) |
| Full player, documented sandbox preload, `--pool=threads --maxWorkers=1`, original timeouts | **3,290 PASS / 0 FAIL, 324 files, 561.88 s**, native exit 0 (`player.log`, `player.json`) |
| Current all-seven-workspace typecheck after concurrent changes | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-handoff.log`) |
| Current cloud e2e/QA typecheck | **PASS**, native exit 0 (`e2e-typecheck-handoff.log`) |
| E2e runtime import boundary | **PASS, 12 relative modules**, no coordinator/codec-worker import (`e2e-import-handoff.log`) |
| Offline production bundle check, `/GamifySurgery/` base, no public-directory copy | **PASS, 872 modules, 1.36 s**, native exit 0 (`build-handoff.log`) |

The original deterministic reproduction was **3 failed / 50 passed**: both layouts' held-scan Resume and the missing worker start protocol fail before the fix (`reproduction.log`). Intermediate broad validation passed **626/627, 38 files** while exposing the new diagnostics parser/test boundary. The final schema accepts the hotfix's colon-qualified technical source; its test now also respects the existing 30-character truncation. The final focused and complete player runs pass every assertion. No original timeout or safety assertion was raised/removed. The new computational large-fixture test has its own explicit 60 s budget. The first optional build attempt omitted the documented sandbox preload and hit the known `net use`/realpath EPERM; with the preload it passes. This is a sandbox invocation issue, not a product failure.

All **32 owned source/test inputs** match `owned-final-inputs.json` at closure. The full-run monitor covers 4,929 inputs. Three non-owned clinical files changed during validation: `packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts`, `question-quality-adversarial-r3-evidence-20261102.ts`, and `question-quality-adversarial-r3.test.ts` in the same directory. They were preserved; current typechecks were rerun afterward and pass. The 3,290-test result belongs to the recorded loaded shared-tree run, not an isolated frozen release worktree. `full-input-drift.json`, `validation.json` and `owned.diff` record exact provenance. The JSON reporter originally wrote under `apps/player/.local-dev/entry-performance-20261102/`; its exact report is also copied to the root artifact directory for the handoff.

Owned existing modules: App/router and its lifecycle test; CloudCampaignEntry/CampaignChoices and their tests; diagnostics; cloud account timing, automatic resolution, cache, worker/tasks/test ports, copy selection, entry storage, enrollment, reopen selection, retained-copy discovery and their relevant tests. New cloud modules: `campaignPreview.ts`, `entryTimings.ts`, `verifiedCopyCache.ts`, their tests, `codecWorkerQueue.test.ts`, `entryPreparation.test.ts`, `entryLarge.test.tsx` and test-only `entryPerformanceTestSupport.ts`. Exact inventory is in `validation.json`. No CSS/art/clinical/question/domain/save-format/server changes. Both manager hotfixes remain unchanged in substance and are checked in the handoff audit.

Normal launch/storage origins and browser profiles are unchanged. No Git, installs, network, agents, deployment or live-data access. Work remains local and unbacked-up under the brief; manager owns browser acceptance and any separately authorized backup/release.
