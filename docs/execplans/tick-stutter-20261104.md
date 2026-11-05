# Account snapshot-session tick stutter (2026-11-04)

Status: prior clone milestone accepted; real-save follow-up is an implementation
candidate with performance acceptance still open. See
[owner-save navigation continuation](owner-save-navigation-perf-20261104.md).
The new realistic tick test still misses 16 ms; chart projection meets 50 ms.
Shared-tree failures and pre-existing canonical retail-identifier drift remain
documented below. Real-browser/live-device acceptance remains with the manager.
Final matched released-catalog owner-save means: evidence tick 157.118 ->46.633 ms,
chart 467.558 ->12.902 ms. Account-scale public fixture tick+overview remains
43-49 ms. Corrected full player is 3,453/3,453 PASS; final full domain is
4,676 PASS /27 binding-or-clinical-inventory failures /1 skip. Seven workspace
and e2e/QA typechecks pass. See the continuation for source epochs and exact
failure classification; no canonical evidence was rebound.

## Manager-authorized continuation: domain implementation

The manager explicitly removed the earlier domain-hotspot stop condition and
authorized this worker to fix unconditional tick JSON cloning, repeated
normalization and guidance scans in `packages/game-domain`. The domain worker
continues to own restroom/receptionist/routine-OR behavior in reducer.ts and
service-operations.ts. Keep reducer edits small and localized, reread immediately
before each patch, preserve concurrent hunks, put new logic in a new helper, and
do not edit service-operations.ts. The original cloud/journal lane remains.
View derivation may be optimized only as required by measured evidence; preserve
the UI worker's source and behavior. No Git, installs, network or agents.

New acceptance: byte-exact old-vs-new reducer results for every command in long
Level 3/4/5 differential runs and the Level 5 integration journey; retain learning,
evidence, undo, immutable saved states and save policy. Target under 16 ms tick
plus view derivation on the large browser-equivalent harness, with measured
warm/cold numbers. Classify the earlier five player failures with evidence.
Run focused tests, full domain and player with threads, seven typechecks, and
released-clinical-content Level 5 CHECK. Expected released numbers remain
26,362 commands / 6,056,335 cents / 410 completions / 0 walkouts. Report changed
bound-input hashes; never rewrite/rebind canonical evidence.

Implementation entry snapshots/hashes:
`.local-dev/tick-stutter-20261104/implementation/before/` and
`implementation/before-manifest.json`. Prior diagnostic receipts below remain
historical evidence rather than being overwritten with an alleged speedup.

Next milestones:

1. Implement and unit-test targeted tick cloning with structural sharing of
   immutable learning/review/frozen clinical and historical financial/event
   values. The initial generic Proxy draft was measured and discarded because
   traps cost more than they saved. Mutable active simulation data stays private;
   null placeholders preserve exact JSON property order. Only the tick clone
   boundary changes; explicit commands retain their previous full clone.
2. Remove proven redundant guidance/normalization work without changing output;
   profile tick plus view. Optimize derivation only if it remains necessary.
3. Run long fixture/journey differential and released-overlay CHECK, then full
   suites/typechecks; audit shared hunks, bindings and five previous failures;
   update handoff with final measurements and remaining acceptance limits.

The previous stop report and validation history below document the completed
diagnostic phase; the current task is active implementation under this expanded
authorization.

Continuation progress (active, acceptance not yet complete):

- Targeted clone, lazy guidance availability, streaming equivalent availability,
  immutable learning date-label cache, evidence adoption at open/rebase, geometry
  graph cache and per-scheduling-pass approach-query memoization are implemented.
  The reducer changes remain imports, tick clone and the localized discussion
  eligibility callback; service-operations.ts is untouched by this worker.
- Long fixture differential plus clone/query/graph/availability units passed
  12 tests in 5 files, 62.97 s, with exact bytes and unchanged input checks.
  The final immutable learning-projection identity fast path then passed the
  old evidence-wrapper oracle/fuzz suite: 17 passed / 1 optional full-replay
  skipped, 2 files, 104.52 s. No learning validation is skipped for changed data.
- Final accepted profile: 161,385-byte native snapshot, 182-tail, first real
  tick+view 14.115 ms, steady mean 6.298 ms and maximum 9.895 ms. Uninstrumented
  1x/2x/4x means are 5.403/4.362/4.970 ms; maxima 7.493/6.154/6.510 ms.
  All measured gameplay frames meet 16 ms, including the first real tick.
  These are Node/V8 browser-equivalent measurements, not real-device acceptance.
  Accepted-performance receipt: 2 files / 5 tests PASS, 8.19 s, no CI allowance.
- Cold first-use work is now paid at native account opening using one discarded
  private preview checkpoint, before the clock starts. Paused input uses a
  private unpause then tick; no session accepts either preview command. Paused
  and unpaused correctness tests preserve exact live checkpoint/state bytes and
  the next 12 command results; invalid preview leaves the real boundary intact.
  Native session opening measured 94.407 ms; initial view 15.468 ms. This
  replaces the prior 47.840 ms first gameplay frame with opening preparation.
- Full Level 5 every-command reference replay freezes input sources and immutable
  branches, uses released clinical content and rejects writes to canonical
  evidence. The completed run includes the geometry/query reference controls.
- Runtime implementation and requested command differential are complete.
  All 26,433 command comparisons (26,362 journey plus 71 setup/snapshot commands)
  are byte-exact. Required released totals: 6,056,335 cents /410 completions /
  zero walkouts. All three reports match retained reports exactly.
- The stricter canonical CHECK exits 1: six of eight generated checkpoints
  match retained bytes; integration-repeat-final and integration-repeat differ
  from BOTH reducer paths. No command-level difference occurred. A separate
  single-path replay reproduced the totals and identified only retail sequence/
  ID/transaction-key and dependent inspection observed-receipt-ID value drift.
  The sequence is 1052 versus retained 1053. There are 185 differing value paths
  at repeat-final (including 130 observed receipt IDs), and 55 at repeat. No
  learning, cash, financial amounts or report values differ. The retail source
  already differs from its retained hash and was not edited here. Evidence:
  canonical-drift/complete-diff-summary.json and the two private actual states.
  No rebind; the strict CHECK remains recorded as exit 1.
- Final full suites finished. Player: 344 files pass /5 fail, 3,426 tests pass /
  10 fail, 684.01 s. The storage worker was editing these same five files/
  dependencies during the run; subsequent focused rerun is 5 files /70 tests
  PASS (17.77 s). Domain: 172 files pass /7 fail, 4,489 tests pass /33 fail /
  1 optional skip, 622.24 s. Clinical workers updated four prior catalog
  assertions during this run; remaining failures are catalog/snapshot/binding
  drift. First full player was 346 files /3,422 tests all PASS (986.93 s).

### Per-stage attribution (ms, warm tail 170-181)

The historical baseline used a 149,887-byte snapshot / 422 histories. Concurrent
catalog additions make the final fixture 161,385 bytes / 462 histories. The
retained base state is the actual Level 3 ready-for-Level-4 fixture (tick 1200,
23 rooms, two employees, two frozen encounters); it is not the owner's tick 6760.
Both profiles use the real native account command/evidence/journal path. The
production codec worker's CPU is measured separately, not charged to the main
thread. Inclusive rows overlap and must not be summed.

| Stage | Historical baseline | Final profile |
| --- | ---: | ---: |
| reducer inclusive | 6.356 | 2.525 |
| tick-owned clone (final direct probe) | — | 0.282 |
| guidance advance (inclusive in reducer) | — | 0.689 |
| routine availability scan (inclusive in guidance/alerts) | — | 0.135 |
| graph cache/key/private copy (inclusive in reducer) | — | 0.177 |
| reducer excluding evidence retirement observer | 5.360 | 2.284 |
| normalization (two calls/tick, inclusive elsewhere) | 1.779 | 0.390 |
| retirement observer (inclusive in reducer) | 0.996 | 0.241 |
| evidence wrapper outside reducer | 1.246 | 0.538 |
| journal delta | 0.060 | 0.060 |
| journal accept | 0.006 | 0.004 |
| remaining session/dirty notification work | 0.092 | 0.072 |
| total execute | 7.759 | 3.200 |
| complete view derivation | 5.223 | 3.098 |
| combined profile mean | 12.982 | 6.298 |

Historical
learning labels no longer reformat dates or recount every review each tick;
current catalog labels and active simulation presentation remain live. The
final worker warm is 149.130 ms off-thread; compatibility completion is a
one-time open operation (no-op check 0.190 ms), not a per-tick migration. Async
small-row commits measured 0.980–2.818 ms. Source receipts: accepted measurement/
uninstrumented files and implementation/accepted-performance.log; final-cpu
profile is the pre-preview attribution receipt. No synthetic commands are added
to the measured gameplay stream; the production opening preview is discarded.

### Classification of the original five full-player failures

| Failures | Ownership and evidence |
| --- | --- |
| one new tick diagnostic oracle | Ours; it compared raw reducer bytes with evidence-normalized property ordering. Corrected to an independently loaded evidence checkpoint plus identical command stream, while retaining strict raw-state equality. Exact control passed 2/2; current focused player passed 22/22. |
| two native worker startup tests | Not ours; startup failed on missing clinical reward tier reward.standard in case.n1.direct-inguinal-anatomy.v1. Native source/test hashes were unchanged. After concurrent content correction, isolated control passed 2/2 (27.27 s); current focused native tests pass. |
| Level 4 integration and Level 3 nurse timeouts | Not ours; unchanged test hashes and a separate control importing neither new profiling file reproduced them (Level 4 35.701 s >30 s, Level 3 nurse 9.563 s >5 s; Level 2 also timed out). No existing timeout/assertion was changed. |

Original run remains recorded as five failures; corrected tests are separate
receipts, not a rewrite of that result. Controls and protected hashes are under
.local-dev/tick-stutter-20261104/ and implementation/protected-hashes.json.

### Validation receipts

- Focused domain: 5 files / 12 tests PASS, 62.97 s, exit 0.
- Focused player: 6 files / 22 tests PASS, 68.17 s, exit 0, including 512-tail
  compaction with byte-exact live state, exact restored values and no upload.
- Final stricter performance/preview/tail/view checks: 4 files /8 tests PASS,
  14.28 s, exit 0 without CI allowance. Each sampled first/steady/1x/2x/4x frame
  must be below 16 ms (CI budgets use the existing hostedTime x10 pattern).
- Seven workspace typechecks and e2e/QA typecheck PASS, including final source
  reruns after the preview and learning fast path (typecheck-at-final.log and
  e2e-typecheck-final.log).
- A further close-time seven-workspace run caught two concurrent N2 content
  TS2353 errors: question-new-n2-evidence-20261104.ts:6289 and :6320 use termsUrl,
  which is not a ClinicalSource property. Player/domain and the other workspace
  checks pass. The prior seven-workspace run passed; latest close run is not
  green. This file is outside this worker's lane and was not edited here.
- The N2 file changed again; the final close rerun has the same two TS2353
  errors at lines 6431 and 6461. Six workspaces, including player/domain, pass;
  the clinical-content workspace fails. Receipt: typecheck-close-latest.log.
- Full domain and full player use threads, maxWorkers=2, CI=1 (the existing
  hostedTime allowance); final counts are above. Full domain reported the
  retained input-binding failure plus 25 old loaded-state hash failures. The
  latter occur before any reducer command; new concepts change loaded defaults.
  Preserve these failures and report hashes; do not rebind evidence.
- Remaining first full-domain failures are current clinical inventory/pool/
  authored-choice counts and two seeded patient-supply snapshots. The sustained
  diagnostic reproduces its snapshot failure with the old clone, literal old
  availability reader and uncached graph/query behavior (legacy-domain-control).
- Concurrent cloud/journal changes belong to storage-journal-recovery-20261104:
  native preparation cadence and storage retry/error classification. That plan
  explicitly excludes this worker's domain/view work and preserves the 512-tail
  bound. Its hunks are preserved; do not attribute them to this performance fix.
- Optional boundary script failed at an internal Git spawn (EPERM). No Git
  operation completed. This worker should have inspected that script first;
  do not rerun it under the no-Git instruction. No installs or network used.
- Full released-overlay differential restarted with an independent full-input
  memo of the original pure graph factory inside each reference command. No
  cross-command reference cache; every distinct input still uses the original
  factory and each path gets private maps. This avoids redundant reference CPU
  while preserving cache invalidation comparisons. The stricter repeated-factory
  partial receipt (4,642 commands byte-exact) is retained in journey-final/;
  final run receipts are journey-complete/. Canonical evidence writes rejected.

## Historical diagnostic phase (before expanded authorization)

## Goal and requirements

Attribute and remove the once-per-second main-thread stutter reported on live
build `3e449d05`, Level 3 near Level 4, facility tick 6760, approximately 130 KB
native snapshot and 170-command local journal tail. Reported command duration
139 ms; one `ADVANCE_TICK` per second at 1x. Preserve exact game/learning state,
save semantics and five-minute/leave/Save & Close/day-end checkpoint policy.
Target under 16 ms synchronous main-thread tick work on the large fixture;
exercise 1x/2x/4x and deterministic structural/timing regression budgets.

## Constraints and ownership

This is one bounded Codex worker milestone assigned by the Claude manager.
Owned runtime/test lane: `apps/player/src/session/cloud/**` and
`apps/player/src/session/localJournal*.ts`; this plan and an additive current
handoff entry. Shared UI, domain reducer/service operations, character and
clinical/question changes must be preserved. No agents, Git commands, installs,
network, browser, deployment or external messages. If a domain hotspot is the
cause, report measured evidence and stop instead of editing domain files.
No clinical-content additions or changes. Manager owns browser/live acceptance.

## Repository state

Read root `AGENTS.md`, current handoff and prior snapshot/concept hotfix plan.
No nested `AGENTS.md` was found under apps/packages/docs. The current session
already contains the native parent-hash/reopen fixes and additive learning
compatibility hotfix. Git inspection is forbidden by the brief; preserve the
entry worktree using exact owned-file copies and source hashes instead.
Baseline: `.local-dev/tick-stutter-20261104/before/` and
`before-manifest.json`. `rg` is absent; use native filesystem/search fallbacks.

## Milestones and acceptance

1. Profile a realistic Level 3/4 state scaled from an existing fixture to about
   130 KB, with a 170-command tail. Separately measure reducer, evidence wrapper,
   journal delta/accept/commit/warm, dirty preparation/observers, learning adapter
   and view derivation. Record exact state/fixture parameters and stage ms.
2. Within the assigned lane, implement O(change) per-tick session/journal work,
   bounded tail and compaction after acknowledged checkpoints; place unavoidable
   heavy work in the codec worker or checkpoint/open boundaries. Preserve
   fencing, crash recovery, usage receipts, lineage and checkpoint policy.
3. Add exact-state equivalence, recovery/ack/compaction/race and performance
   regressions. Focused and full player tests with `--pool=threads`, all seven
   workspace typechecks, and e2e/QA typecheck. Record native exits and limitations.
4. Inspect actual scoped diff and protected hashes; update this plan and prepend
   current handoff with findings, changes, measurements, validations, remaining
   decisions and manager next action. No commit/push by this worker.

## Progress, discoveries and decisions

- Initial inspection: `completeSnapshotLearning` executes once during selected
  native-session creation, not on ticks. The command path still calls
  `applyGameEvidenceCommand`; `gameEvidenceDelta` and journal preparation need
  independent measurement. Native `journalWarm` currently reads/restores and
  prepares the complete tail on every commit in the codec worker.
- Profiling completed; **implementation stopped at the brief's domain-hotspot
  gate**. No production/runtime file has been edited. The dominant path is the
  unchanged domain tick reducer; see the measured boundary below. Removing its
  mandatory full-state clone, mutable simulation work or evidence retirement
  callback requires the domain lane. Bypassing it here would change the command
  and evidence/undo contract rather than safely optimize session bookkeeping.
- Added only `cloud/tickPerformanceTestSupport.ts` and
  `cloud/tickPerformance.test.ts`: reproducible large-state stage attribution,
  opt-in CPU/JSON receipts, and 36 exact-state comparisons against the raw domain
  reducer across 1x/2x/4x after an exact 170-command tail. These are diagnostic and
  equivalence probes, **not acceptance of the requested <16 ms/no-long-task
  target**. No budget was weakened to call the unimplemented fix complete.
- Focused tests: **6 files / 57 tests pass**, exit 0, 29.52 s. Serial confirmation:
  **1 file / 2 tests pass**, exit 0, 7.54 s.
- An added byte comparison against the *raw reducer* exposed the current
  evidence hydration's different object-key ordering (strict structural equality
  passed). This was a diagnostic oracle error, not a state mutation or save
  regression. The final control independently loads the exact native baseline,
  runs all 170 settings rows and subsequent commands through the existing
  `applyGameEvidenceCommand`, and compares session ticks byte-for-byte with that
  current path; it separately retains strict value equality with `gameReducer`.
  Final exact-control run: **2/2 pass**, exit 0, 11.73 s
  (`exact-control-final.log`). The full suite saw the earlier oracle
  and retains that failure in its unaltered log; the corrected
  owned test was rerun separately, without hiding the original result.
- Initial workspace typechecks, after fixing two new test type errors, found the
  concurrent, unowned duplicate export
  `QuestionFlagRound2EvidenceClaim` at `packages/clinical-content/src/index.ts:56`,
  surfaced by player/clinical-content/domain. E2E/QA typecheck found that same
  export. A later owned-file typecheck also saw the concurrent UI test's
  null/undefined argument mismatch at `ui/actionFeedbackIntegration.test.tsx:42`.
  Earlier unrelated UI warning-union errors disappeared on the second run,
  without edits from this worker. **Final all-seven workspace typechecks and
  e2e/QA typecheck PASS**, native exit 0 (`typecheck-seven-at-handoff.log` and
  `typecheck-e2e-qa-at-handoff.log`), after the shared lanes corrected their own
  issues. No UI/question source was edited by this worker.

## Full player result and follow-up validation

- Full player, threads/maxWorkers=2: **337 files passed / 4 failed (341 total);
  3,402 tests passed / 5 failed (3,407 total)**, **752.81 s**, native exit **1**.
  Exact unmodified output: `full-player.log`, `full-player.exit.txt`.
- One failure was this worker's transient byte oracle comparing raw reducer
  ordering with evidence hydration. Corrected current-path oracle is now
  **2/2 passing** as recorded above. Full-run counts are not rewritten or
  represented as green; only diagnostic tests changed afterward, no runtime.
- Two unowned failures are explicit timeouts: `levelFourIntegration.test.ts:20`
  (30,000 ms; observed 40,084 ms) and `periopNurseOwnerFeedback.test.ts:16`
  Level 3 (5,000 ms; observed 7,472 ms). Both are outside this lane. Their isolated
  control is recorded separately without changing a timeout or assertion:
  **3 passed / 3 failed**, two files, **85.89 s**, exit **1**
  (`unowned-timeout-control.log`). Level 4 again exceeds 30 s (35,701 ms);
  Level 2 and Level 3 nurse checks exceed 5 s (6,533 / 9,563 ms). This control
  imports neither new profiling file. No failure is waived or timeout raised.
- Two unowned failures were `codecWorkerNative.test.ts`. The negative control
  recorded `Clinical case case.n1.direct-inguinal-anatomy.v1 references missing
  reward tier reward.standard.` twice instead of reaching its intended
  `window is not defined` exception. The positive worker died at startup with
  `worker_unavailable`. After concurrent clinical-source correction, its isolated
  rerun is **2/2 PASS**, **27.27 s**, exit **0** (`native-worker-control.log`).
  Native test/worker/runtime files remained byte-identical to entry.
- Final code typechecks pass. The runtime stutter fix and browser long-task
  acceptance remain **unimplemented/unaccepted**, independent of validation.

Validation receipts are all under `.local-dev/tick-stutter-20261104/`; native
exit files accompany the focused, full, exact-control, native-worker control,
unowned-timeout control, seven-workspace and e2e/QA runs. The initial serial
measurements predate only test-oracle strengthening, not a runtime change.

Final ownership: only the two new cloud test/support files, this plan and an
additive `docs/handoffs/CURRENT_THREAD_HANDOFF.md` entry. Exact entry snapshots,
final scoped diff/hash audit and a concise receipt handoff are in the same
local evidence directory. The handoff preserves the shared document's prior
bytes. Runtime/domain/protected-save source hashes are checked against entry;
all unrelated live edits remain. Manager owns domain follow-up, acceptance,
backup and release. This is local diagnostic work, not a deployed stutter fix.

## Measured attribution and stop evidence

Serial receipts: `.local-dev/tick-stutter-20261104/serial-confirmation-*`,
`serial-confirmation.cpuprofile`, and `serial-summary.json`. All values below are
local Node/Vitest measurements, not a browser or a claim of reproducing the
owner's exact 139 ms. Native codec CPU is isolated from execute() measurements;
it is separately run through the real task handler. No network/browser used.

Fixture is the real retained `level-four-legacy-pre-m3.json`, Level 3 ready for
Level 4: 23 rooms, 2 employees, 2 frozen encounters, 130,872 compact source JSON
bytes (194,747-byte fixture file).
Normal current-catalog migration/additive histories yield **149,426 state bytes /
149,887 native snapshot bytes**, 422 histories in the serial run. This is
slightly larger than the reported 130,350-byte account snapshot. It retains the
actual fixture's facility tick **1200**, not the owner's private tick 6760; only
snapshot lineage starts at 6760. The exact owner's state was unavailable and is
not reconstructed by changing its clock. The stage run advances 182 real ticks;
the independent control builds exactly 170 settings-command rows before ticks.
Concurrent catalog changes explain the earlier 147,585-byte/414-history run;
the serial receipt freezes one loaded module graph for each test process.

Mean at tails 170–181 (12 ticks):

| Stage | ms/tick | Interpretation |
| --- | ---: | --- |
| Entire synchronous session execute | 7.759 | maximum 10.014 in this warm window |
| Domain reducer including evidence retirement hook | 6.356 | 82% of execute |
| Domain reducer excluding that hook | 5.360 | still 69% of execute |
| Evidence retirement hook | 0.996 | nested inside reducer, do not add twice |
| Evidence wrapper outside reducer | 1.246 | normalize/project/transition/hydrate |
| Normalization, both calls | 1.779 | overlaps retirement/wrapper rows |
| Journal delta | 0.060 | adjacent trusted runtime projections |
| Journal accept | 0.006 | bounded queue/timer only |
| Remaining session/dirty state/observer work | 0.092 | derived by subtraction |
| Sync view getter | 0.002 | separately sampled |
| Full player view derivation | 5.223 | separately sampled, maximum 6.878 |

The first profiled tick is **89.670 ms** (domain 74.251 ms, evidence wrapper
86.900 ms inclusive, view derivation another 19.569 ms). Warm <16 ms averages do
not establish the requested bound. Uninstrumented controls at an initial
170-command tail compare every resulting state exactly against direct
`gameReducer` (36 comparisons):

| Speed | Direct reducer mean / max ms | Session mean / max ms | View mean ms |
| --- | ---: | ---: | ---: |
| 1x | 7.599 / 43.436 | 9.717 / 35.653 | 2.761 |
| 2x | 4.298 / 5.162 | 7.424 / 11.005 | 2.675 |
| 4x | 4.586 / 5.274 | 7.602 / 8.872 | 2.586 |

CPU samples over 182 ticks attribute **254.705 ms** to private `clonePlain`
(~1.40 ms/tick), **333.703 ms** inclusive to `advanceGuidanceTips`
(~1.83 ms/tick), including **278.074 ms** in guidance candidate evaluation.
These are sampled attributions, not exact instrumentation spans. Full profile
retained for the domain worker to inspect.

Concrete source boundary:

- `packages/game-domain/src/reducer.ts:249–251`: `clonePlain` is
  `JSON.parse(JSON.stringify(value))`.
- `reducer.ts:8305`: `reduceAdvanceTick` unconditionally calls `clonePlain(state)`.
  Thus O(change) ticks are impossible through the current reducer, regardless
  of journal tail compaction.
- `reducer.ts:8921` invokes `captureBeforeGameRetirement(next)`; the observer in
  `game-evidence.ts` normalizes/projects the complete clone before retirement.
  A second normalization occurs after the reducer. Structural-sharing helpers
  must inspect the cloned tree because unchanged identity was already lost.
- Guidance/routine-patient availability, eligibility scans and spatial graph
  building are also prominent in the profile. No source in that lane was edited.
- `gameSession.ts:167` reports only `applyGameEvidenceCommand` in
  `lastCommandMs`; the owner's 139 ms does **not** include queueLocal(), dirty
  flags, metadata, coordinator notification or UI view derivation. Its measured
  boundary is already inside the domain/evidence path.

Separate costs: seven inline memory-journal commits (batches up to 32 rows)
take **1.193–2.682 ms elapsed**, latest journal read **5.726 ms**, native worker
warming of the complete 182-command tail **135.270 ms elapsed**. Production
warming is in the codec worker; these are not execute() main-thread spans.
`journalWarm.ts:55–61` does restore/reimport/encode the whole native tail on each
warm request, so there is a real worker-side scaling concern for the follow-up.
The once-per-open learning compatibility scan takes **0.188 ms** when called on
an already compatible state and is **not called on ticks**.

Acknowledged-tail rebasing already exists at `gameSession.ts:97`; the existing
acknowledgement/kill/reload, rebasing-race and five-minute/offline compaction
tests pass in the focused suite. A 170-command tail alone does not prove a
missing acknowledgement compaction: at 1x it can accumulate within the existing
five-minute interval, and more commands fit at 2x/4x. Bounding worker preparation
and removing main-thread rebase/checkpoint construction remain unimplemented.

## Required next action for the manager

Hand the domain worker the CPU profile and exact source boundary above. Retain
the existing mutation/evidence/learning/undo contracts while replacing the full
tick clone and avoiding duplicate full-tree normalization/projection. After that
bounded domain milestone, resume this session lane for worker warm incremental
updates and bounded/acknowledged tail compaction if still needed, rerun the
large-fixture <16 ms regressions and real browser long-task observations. No save
format, learning semantics, save cadence or origin/profile pathway was changed.

Reproduce the serial measurements from the repository root (existing preload,
no dependency installation):

```powershell
$env:NODE_OPTIONS=(($env:NODE_OPTIONS+' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
$env:TICK_CPU_PROFILE='1'
$env:TICK_MEASUREMENT='serial-confirmation'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 src/session/cloud/tickPerformance.test.ts
```

Without those two opt-in profiling variables, the tests do not write measurement
artifacts. Existing source/canonical/profile bytes are never edited by them.

## Validation commands

Use the existing sandbox preload when Vite probes blocked `net use`:

```powershell
$env:NODE_OPTIONS=(($env:NODE_OPTIONS+' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/loading-screens-20261102/tsconfig.e2e.json
```

Focused commands, output files, measurements and exact exits will be recorded
below as they run. Browser/default-process-pool verification belongs to manager.
