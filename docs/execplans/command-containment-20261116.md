# Command-failure containment - 2026-11-16

## Goal and acceptance

An unexpected command programming exception must not mislabel a healthy durable clinic as corrupt. Before any journal/publication mutation, refuse only that intent and retain the exact verified prefix. After journal/publication, reconcile the durable accepted prefix exactly once before continuing. Real evidence/checksum/continuity, authority, revision and storage failures retain existing fences. Repeated deterministic failures have bounded retries/backoff; the next healthy command can use a worker again. Problem reports carry only command type, stage, error class and an allowlisted source location. Harden the optional hire name type without attributing it to the tester's unproven exception.

## Ownership, repository state and constraints

Main shared tree only. Own gameSession.ts, coordinator.ts, operationalSessionEngine.ts, operationalEngineProcessor.ts, their focused helpers/tests, and one localized reducer hire-validation guard/test. Domain forecasts/scheduling/selectors/spatial remain with the domain worker; entry/loading/UI is with its worker; GS-release is with the port worker and is not written. Preserve all other edits. No Git, agents, network/live DB, installs, deployments, browser/storage or real saves. Clinical/balance/progression content and canonical inputs/expected results are not rebound. Read AGENTS.md and the preceding private diagnosis; the tester's actual throwing source remains unidentified.

Intake sources and hashes are captured in .local-dev/command-containment-20261116/intake-manifest.json and before/. This is an incremental milestone on the existing live working tree, not a rewrite of previously accepted work.

## Decisions and design under implementation

- Separate pure execution, journal admission, view/state publication and follow-up stages. Maintain a cheap immutable checkpoint token; no full-state per-command clone/validation is added.
- Add a narrow programming-exception envelope. Typed integrity/storage/protocol errors remain distinct. Use the existing private worker failure code for bounded allowlisted metadata so cloud formats and operation IDs do not change.
- A processor-declared command bug is a failed intent, not a worker transport crash: do not repeat it synchronously. Retain the old prefix and permit a fresh worker for the next healthy intent. Transport failures retain the original same-operation one-fallback rule.
- Journal-accepted prefixes cannot be rolled back. Drain and verify the journal under the ordered command barrier before restoring the engine/view. Recovery temporarily gates new admission without changing or extending lease authority. A failed recovery remains an honest paused/processing state with bounded retries, not corrupt for a pure programming error.
- Repeated identical command faults are bounded by a small session gate/backoff, independent of healthy player commands. Clock fingerprints ignore operation IDs and wall timestamps. Diagnostics never include payloads, exception text or arbitrary stack data.

## Milestones

1. Inspect current execution, local journal and worker contracts; capture before state. [complete]
2. Implement staged containment, bounded worker recovery, privacy-safe diagnostics and localized hire guard. [complete]
3. Synthetic tests for execution/diff/projection/capture failures; journal/publication reconciliation; storage/integrity/fencing; repeated-failure backoff and worker recovery; both synchronous and worker paths. [complete]
4. Validate focused player/domain, full player (CI=true, threads), seven typechecks, boundaries, build, native Level 5 CHECK equality and pacing alone last. Record every exact output and existing baseline failure.
5. Inspect scope, preserve concurrent changes, package exact-hash fix manifest and normalized patch; append handoff.

## Validation commands

npm.cmd test -- --pool=threads --maxWorkers=4 (apps/player, CI=true), appropriate focused filters; domain hire/staff/evidence focus with threads; npm.cmd run typecheck (seven workspaces); npm.cmd run test:boundaries; npm.cmd run build; native Level 5 CHECK without canonical writes/rebind; node tools/qa/content-pacing-check.mjs alone after all owned Vite/test/build work. Existing offline mapped-drive probe adapter and checksum-verified read-only boundary inventory may be used to avoid forbidden Git/optional network probes; no assertion/budget/timeout weakening.

## Progress / discoveries

- Current broad async catch spans queueLocalDelta, projectedView.publish, state assignment and follow-up. Synchronous execute publishes before queueLocal. LocalJournalDrain.highWater changes on row admission, committed changes only after verified append; this distinguishes an unknown exception before versus after admission, including a throw after enqueue.
- Operational engine client deliberately terminates on a failure reply. The session wrapper therefore needs explicit restoration/restart behavior; preserving only a generic exception class is insufficient.
- Current known 27 domain baseline failures are source-binding/legacy assertions from earlier lanes. Capture/compare current inputs and do not change pins or expected results.

## Next action

Implementation and requested validation are finished; full-suite failures remain explicitly reported below. Manager reviews/ports the 13 scoped paths and reruns the listed timing-sensitive files/full suite in a quiet environment, then browser acceptance. Original tester root cause remains unproven.


## Implementation / validation in progress

- Built-in programming faults have a closed metadata envelope (including capture-only DataCloneError); typed evidence, checksum, cache/storage, catalogue and authority errors retain the existing policy. Production bundle positions are reduced to approved bundle aliases and line/column, never URLs, function names, exception text, command payloads or operation IDs.
- Processor command execution prepares transport/projection before committing its private head. A declared programming failure is not replayed synchronously. The wrapper restores its immutable published checkpoint token and the next healthy intent can create a worker immediately; transport crashes retain the existing original-operation one-fallback rule.
- Session stages capture, execution/diff/projection, journal admission, publication and follow-up separately. Pre-admission bugs leave state/metadata/question staging/journal untouched. An admitted row is drained and checksum/continuity-verified inside the ordered command barrier; queued player actions cannot overtake it. Recovery does not call the barrier recursively. Writer/auth/revision/storage fences are not released by the local repair gate.
- Snapshot fallback also verifies its newly staged durable copy. Canonical JSON reorders keys; when that checked state equals the original immutable prefix, retain the original exact state/checkpoint and operation IDs. A different verified prefix remains authoritative. This comparison and full preparation happen only on the exception path.
- Failure backoff stores one bounded intent fingerprint; clock IDs/timestamps do not defeat it. There are no new timers. Persistent recovery bugs get one immediate retry, then 5?60 s pulse-driven backoff with an honest paused/processing admission gate. The existing day-end follow-up is consumed before starting it, so reconciliation does not repeat it.
- Added one optional displayName type guard for HIRE_STAFF, with synthetic invalid/valid-name tests. This is defensive validation, not an attribution of the tester's unknown throwing command.
- Initial focused receipts: 32/32 containment tests passed before adding extra undo/reload/clone coverage; domain staff/evidence/name focus 5 files / 40 tests passed. Current focused cloud run and seven-workspace typechecks are pending; interim failing tests in private logs are test-setup corrections (undo target and normal reload authority/paused presentation), not accepted validation.
- The shared reducer includes the concurrent diagnostic worker's separate wrapper/import edits. Port packaging must include only the optional-name guard hunk, never those forecast changes. The Level 5 control captures one public-input epoch and toggles only that guard in memory; it denies canonical writes and preserves all native CHECK assertions.


## Focused safety review

The completed 15-file focused pass is 250/250 tests (88.74 s), including ordinary cloud recovery, Save & Close, upload races, revision conflict loops, delivery, command ordering and the new stage-injection cases. Further lifecycle coverage holds an actual journal append during synchronous/worker repair and detaches before releasing it: the old owner must stay alive through the verified durable acknowledgement. No retry prompt is shown for an already admitted action; refused player actions use the existing calm warning presentation.

The first seven-workspace typecheck invocation hit concurrent diagnostic-timing.ts errors (string | undefined passed to string at then-current lines 725/745/804/855, later 728/748/807/858). No owned source error appeared. The file is outside this lane and was not edited. Rerun after the domain worker settles; keep the initial output as a receipt, not a passing claim.


## Final design review and partial receipts

| Failure boundary | Result |
| --- | --- |
| Capture, execute, diff, projection, or journal admission before a row is accepted | Refuse the intent; preserve the original immutable prefix, metadata and receipts; no partial journal row. |
| A row is accepted, or state has been published | Hold the ordered barrier, drain the original journal owner, verify checksum/continuity and restore that durable prefix. A command promise resolves only after this reconciliation. |
| No-journal fallback after publication | Stage the ordinary local snapshot candidate and hydrate/verify it before acknowledging recovery. Retain the original exact immutable prefix if the verified state agrees. |
| Persistent deterministic intent failure | One bounded fingerprint, exponential 1?60 s backoff, no new timers, independent healthy actions. |
| Persistent programming error in reconciliation | One immediate retry, then existing-pulse 5?60 s backoff; paused/processing, never a fabricated corruption classification. |
| Genuine integrity, writer/revision/auth, clock/expiry or storage failure | Keep its existing fence and label. Releasing the local repair gate cannot grant authority. |

Production-build inspection confirms the synchronous reducer is in codecEvidence and the engine copy is in operationalEngine.worker. Both have closed bundle aliases in the error-source allowlist; hashes, URLs, free text and function names are discarded. The codecEvidence alias is a diagnostics-only follow-up to the first full-run freeze and has a focused regression test. Runtime command/journal/coordinator/engine sources otherwise remained frozen during validation.

Receipts so far:

- Final lifecycle focus before the diagnostic alias/test correction: 4 files / 67 passed (70.05 s); prior broader safety focus 15 files / 250 passed (88.74 s). The final focus will be rerun on the delivered sources.
- Seven standalone workspace typechecks PASS (typecheck-complete.log). Earlier failed invocations and the test-only clock/expiry type correction remain in private logs; final tests use actual clock rollback/lease expiry, not nonexistent transport failure codes.
- Boundaries PASS: 22,539 checksum-verified tracked paths and launcher protocol 1. The existing read-only index adapter supplies the stock inventory without invoking Git; its receipt is private to this milestone.
- First full build PASS: 712 modules / 30.67 s (build.log; final diagnostics alias will be rebuilt).
- Final domain staff/evidence/hire focus PASS: 5 files / 40 tests, 30.41 s. The narrow Level 5 binding assertion is the known employee-training.ts mismatch: expected 9daacd4783b15e7fa5ee85c1348a313e6454bae4710e003d5494f3b890d899d5, actual 2d2886b1b2f3615a2513b98f892c33939448959cee30789af30534582123923b; 1 failed / 35 skipped, 22.55 s. That actual file hash is byte-identical to intake and this lane did not edit it. The previously known 27 full-domain failures are not represented as a new full-domain run here.
- Native Level 5 CHECK assertions pass in both frozen public-input arms. Only the optional-name guard body varies in memory. Both produce 35,216 commands / 6,928,382 cents / 549 completions / 0 walkouts, tick 32,995. All eight checkpoint hashes, the final raw-state SHA256 b45fc3490a1e2bc63c1d847cb24f260c0cfc12494d69c1e13c994ecadbc4d52e and the non-input summary hash match exactly. The captured epoch includes concurrent domain/content work, so these totals are not a rebind of the historical 26,362 / 6,056,335 / 410 / 0 fixture. The historical result and checkpoint JSON hashes remain identical to intake, as does LOCAL_STORAGE_COMPRESSION_WRITES policy (still enabled). Private paired receipts/input hashes: level5/comparison.json and input-hashes.json.

The bound reducer input gains only the authorized optional-name guard from this lane; its whole live-tree hash also contains the concurrent worker's forecast hunks. The port payload reconstructs the guard on the captured preimage and explicitly excludes those hunks. No pins or acceptance expectations are weakened or rebound.


Final delivered-source focus: 4 files / 68 passed, 73.02 s, CI=true, --pool=threads --maxWorkers=2 (focused-delivered.log). Final root build (build-final.log) passes boundaries, all seven workspace typechecks, and player production build: 716 modules / 20.41 s. The shared domain worker added modules between builds; those are not included in this lane's port. The complete player run is still pending. Pacing has not started and will run alone after the full suite/baseline comparison.


Full-run correction: player-full.log finished with 482/483 files and 5,879/5,880 tests passing; the sole failure was the newly added synchronous-bundle diagnostic test using an earlier cached helper (expected bundlecodec:5:120, received fallback session). The helper/test changed during that run, so it is a superseded mixed-source invocation, not final validation or a baseline failure. The delivered code is now hash-frozen (delivered-code-freeze.json), the focused 68 tests/build pass on it, and player-full-delivered.log is running from a clean process. Do not change the frozen source/tests while it runs. Pacing remains pending and will be last.


## Files owned by this port

| Path | Change |
| --- | --- |
| apps/player/src/session/cloud/gameSession.ts | Stage command/undo publication; reconcile accepted durable prefixes; bounded failure/repair gates and diagnostics; keep a repairing journal owner alive on detach. |
| apps/player/src/session/cloud/coordinator.ts | Ephemeral repair admission gate without new authority; preserve true fences; classify programming failures as processing rather than corrupt. |
| apps/player/src/session/cloud/operationalSessionEngine.ts | Immutable recovery tokens; isolate declared worker programming failures; retain transport fallback/backoff and restart workers for healthy intents. |
| apps/player/src/session/cloud/operationalEngineProcessor.ts | Prepare fallible command transport/projection before private commit; emit closed programming-failure codes. |
| apps/player/src/session/cloud/commandFailure.ts | Closed source/class/stage/command vocabulary, private wire encoding/decoding and one-entry intent backoff. New file. |
| apps/player/src/session/cloud/operationalSessionTestSupport.ts | Optional no-journal fixture mode only; existing defaults unchanged. |
| apps/player/src/session/cloud/commandFailure.test.ts | Privacy/allowlist, production bundle, DataCloneError, typed-error exclusion and backoff tests. New file. |
| apps/player/src/session/cloud/commandContainment.test.ts | Pre/post-admission faults, held durability, queued order, retry limits, fences, reload, snapshots, undo, detach and notice semantics. New file. |
| apps/player/src/session/cloud/processorCommandFailure.test.ts | Atomic worker stages, real evidence errors, exactly-once refusal, worker restart and repeat suppression. New file. |
| packages/game-domain/src/reducer.ts | Exactly one optional hire-name type guard; all concurrent forecast hunks excluded. |
| packages/game-domain/tests/hire-name-validation.test.ts | Invalid optional types refuse normally; valid/absent names retain deterministic behavior. New file. |
| docs/execplans/command-containment-20261116.md | This plan, rationale, receipts, ownership and risks. New file. |
| docs/handoffs/CURRENT_THREAD_HANDOFF.md | Append this milestone after final validation; preserve every other section. |

## Open risks / manager acceptance

The tester's original TypeError root cause remains unproven; the hire-name guard is not claimed as that cause. This change contains unexpected failures and makes the next report actionable. A persistent programming fault in recovery deliberately leaves the clinic paused/processing with bounded retries; it cannot acknowledge unverified state or override storage/authority/integrity fences. Recovery can perform a full verification on the exceptional path; healthy ticks gain no full-state/tail scan. Minified reports use closed bundle aliases plus line/column and need the matching release bundle to map to source. Manager browser smoke checks should cover a refused intent, a post-admission repair followed by another action, Save & Close/reload, and a conflicting writer during repair. No browser or real-save acceptance is claimed by this worker.


## Full-suite result and unchanged-file comparison

The full invocation completed with the following exact summary (player-full-delivered.log, exit 1). It is **not a green full-suite claim**:

```text
 Test Files  4 failed | 479 passed (483)
      Tests  5 failed | 5877 passed | 2 skipped (5884)
   Duration  2810.58s (transform 303.12s, setup 0ms, import 4312.95s, tests 6722.06s, environment 70ms)
```

Five assertions failed: QA notice/enrollment opening at cloudSavesQa.integration.test.tsx:78 (5 s ready wait), phone standalone focus/boundary case, desktop Save & Close at :299 (phase still ready), operationalSession.test.ts:138 (first commit count still 0), savePolicy.test.ts:130 (day-end first commit count still 0). In addition, characterPhlebotomyQa.test.ts:37 hit its unchanged 10 s beforeAll limit; its two cases were skipped. All four affected test files are byte-identical to intake. No assertion, timeout or cadence was changed.

A paired read-only module control freezes 2,013 public source/test/fixture modules, keeps the current shared UI/domain/clinical inputs, and varies only this lane's five pre-existing cloud modules and optional hire guard. The three affected command/QA files ran sequentially with one worker. In-process message channels and fake stores remain isolated; no private save/browser input is used. Exact summaries:

Containment on (paired-on.log, exit 1):

```text
 Test Files  2 failed | 1 passed (3)
      Tests  3 failed | 62 passed (65)
   Duration  329.43s (transform 63.75s, setup 0ms, import 108.58s, tests 219.87s, environment 0ms)
```

Containment off (paired-off.log, exit 1):

```text
 Test Files  1 failed | 2 passed (3)
      Tests  4 failed | 61 passed (65)
     Errors  1 error
   Duration  260.45s (transform 43.35s, setup 0ms, import 70.90s, tests 188.54s, environment 0ms)
```

The opening readiness deadline reproduces in both arms; Save & Close deadline misses occur in both arms (different layout instances). The off arm additionally misses prior-export/reconnect deadlines and has a late React update after test window teardown (AccountMenu.tsx:158, window undefined). The on-arm upload-count deadline is intermittent: it passed in the off arm, earlier focuses and the final ordinary rerun. These results show baseline/load sensitivity; they do not establish a precise root cause for every deadline. No corruption/continuity outcome was reported by these failures.

After the full suite ended, all four affected files passed unchanged with ordinary config, CI=true, --pool=threads --maxWorkers=1 (failure-rerun.log, exit 0):

```text
 Test Files  4 passed (4)
      Tests  67 passed (67)
   Duration  100.75s (transform 10.85s, setup 0ms, import 18.08s, tests 82.18s, environment 0ms)
```

Manager acceptance should include an otherwise quiet full/targeted rerun on the port. The full-suite deadline/hook failures remain an explicit risk, rather than being dismissed or hidden by the passing 67-case rerun.

## Final byte audit

The early source-freeze list no longer matched commandFailure.ts and commandFailure.test.ts: both changed during the long shared-tree run (file timestamps 17:52). Their current normalized text is exactly the frozen paired-input text captured before that comparison. Preserve these files; do not revert shared changes. The other eight owned source/test hashes still match the earlier freeze. Exact current raw copies and hashes are captured in validated-source/ and final-source-freeze.json. A fresh focus/build is running against those exact bytes before the final pacing rerun. The earlier successful pacing result is retained in pacing-final.log but is not the last invocation after this byte audit.


## Final current-byte validation and completion

Fresh verification on the preserved current diagnostic files is complete. Exact raw copies/hashes are in validated-source/ and final-source-freeze.json; the final byte audit passes 10/10 source/test files, with the reducer guard checked separately. No source/test edits followed these checks. The full invocation above remains red and is not replaced by a green claim.

Focused current bytes (focused-final-bytes.log, exit 0):

```text
 Test Files  4 passed (4)
      Tests  69 passed (69)
   Duration  64.49s (transform 34.93s, setup 0ms, import 58.14s, tests 57.09s, environment 0ms)
```

Final root `npm.cmd run build` (build-final-bytes.log, exit 0) runs the stock boundaries check, all seven workspace typechecks, and player production build. Exact relevant output:

```text
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
transforming...✓ 716 modules transformed.
✓ built in 18.27s
```

The seven workspaces are clinical-context-workbench (client and server), player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. All pass; standalone typecheck-complete.log also passes. Existing build dynamic-import/chunk/plugin-timing warnings remain non-fatal.

Pacing ran **alone and last**, after every own test/build/QA process exited (`node tools/qa/content-pacing-check.mjs`, pacing-last.log, exit 0):

```json
{
  "firstFinishTick": 26281,
  "closingCashCents": 5958386,
  "completions": 440,
  "walkouts": 0,
  "referenceTick": 26281,
  "driftPercent": 0,
  "clinicalSha256": "ca9e18dbb5d60df4faec84e36198f68a7a6316109ae375c00f874efa0577fcee",
  "caseCount": 1436,
  "registeredMeanings": 1144
}
```

No assertions, timing limits, source pins, save format/cadence, DB/RPC, operation IDs, FSRS or clinical data are changed by this lane beyond the authorized invalid-name refusal. Canonical Level 5 result/checkpoint JSON and compression-write policy are byte-identical to intake. The original tester's throwing site remains unknown; do not attribute it to the hire guard.

Port package: .local-dev/command-containment-20261116/complete-port-manifest.json and port/command-containment.patch, with exact before/after SHA256 and raw payloads. Thirteen paths: eleven source/test files plus this plan and the append-only current handoff. Reducer payload contains only the single hire guard; concurrent forecast imports/wrapper changes stay out. Never replace the shared reducer or handoff wholesale. Final exact outputs/log hashes are in validation-receipt.json.

Acceptance risks: five full-run deadline failures plus the hook timeout; all 67 affected tests pass unchanged on the ordinary single-worker rerun. Opening/close deadline misses also reproduce with containment off, but this does not prove every individual failure unrelated. Manager should rerun cloudSavesQa.integration.test.tsx, operationalSession.test.ts, savePolicy.test.ts, characterPhlebotomyQa.test.ts and the full suite with the port frozen and machine otherwise quiet; browser cloud saves/recovery, Save & Close/reload and writer fencing remain manager acceptance. Persistent recovery programming bugs intentionally pause/processing with bounded retries instead of acknowledging unverified progress. No full-suite-green or real-tester/browser acceptance claim is made.

All five implementation/test/package milestones are complete with these validation caveats. This is local working-tree work for manager review/port; no commit/push/deploy occurred.
