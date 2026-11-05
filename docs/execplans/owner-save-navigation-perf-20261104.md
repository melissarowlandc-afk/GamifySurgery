# Owner-save navigation and chart performance — 2026-11-04

## Goal and constraints

Continue the accepted tick-clone milestone with real-save acceptance. Implement
report items 1, 2, 5, 7 in that order: immutable navigation graphs and exact route
reuse; projection-local diagnostic previews/calendars; settled-state validation
and training reachability; stable head-index BFS. Target synthetic tick <16 ms,
chart <50 ms. Preserve exact JSON state, learning, evidence, undo, clinical
content, save policy, routing tie breaks and build/door invalidation.

This worker owns new domain cache helpers and localized spatial, diagnostic,
training, reducer and player view hunks. Other workers own concurrent reducer /
service-operations gameplay, cloud storage, UI and clinical content. Re-read
shared files before patches; preserve all unrelated work. No Git, installs,
network, subagents or release actions. Private backup is read-only, never copied
or printed; only aggregate timings/counts/digests may leave the in-memory probe.

## Baseline and repository state

Read AGENTS.md, current handoff, prior tick ExecPlan and private profiling report.
No production edits preceded this fresh measurement. Reused the report's verified
backup adapter directly; no decoded save was persisted. Node 24/V8, source hashes
in `.local-dev/owner-perf-20261104/before.json`; code-only baseline separately in
`before-source/`. Baseline means: reducer 167.726 ms; evidence 206.607 ms;
overview 116.347 ms; chart 643.950 ms. Evolving 50-tick evidence/chart means
170.650/446.495 ms. Input digest unchanged. Earlier report controls 130.43 /
164.87 /473.60 ms are separate experiments under different machine load.

## Milestones and acceptance

- [x] FIRST measure current code on approved owner backup; retain safe receipts.
- [x] Immutable graph / deterministic route cache, exact geometry and definition
  keys, independent paths, bounded retention, no graph copy per query.
- [x] Compute diagnostic previews once per projection; share only read-only
  calendar/forecast baselines, discard cache at each mutation boundary.
- [x] Share settled layout/training checks without caching mutable eligibility.
- [x] Head-index BFS, exact old cardinal/lexicographic neighbor order.
- [x] Synthetic L3 workload: 25 staff, 41 doors, two outstanding diagnostic
  plans and queued peri-op/OR/endoscopy; no private data. Timing budgets with
  hostedTime CI allowance, byte-exact differential/immutability guards.
- [x] Owner remeasurement, source/digest and privacy audit.
- [x] Focused/full domain/player tests (threads), seven typechecks and e2e/QA (results and failures below).
- [x] Released-clinical L5 replay: unchanged 26,362 /6,056,335 /410 /0,
  byte-exact differential and bound input hash changes; no rebind.
- [x] Finish corrected full-suite reruns and additive shared handoff; all 741,924 prior handoff bytes preserved.
- [ ] Strict tick <16 ms, no long tasks and real-browser acceptance. **Not met.**

## Decisions / discoveries

The prior fixture omitted the owner's outstanding diagnostics/staff mix. Existing
navigation hits clone every graph and rebuild a full signature per query. The
chart repeats each choice preview. Existing warm-up does not cover that work.
The report also identifies a full-state clone in attendance retry; address its
copy ownership if needed to meet the complete tick budget, preserving exact bytes.

## Next action

Manager review of the candidate and remaining synchronous evidence/view work.
Keep the 16 ms target open. A further change to worker command execution or a
larger state-ownership refactor needs its own coordinated milestone; this worker
has not changed the native session command protocol or the storage worker's lane.
Do not describe the stutter as eliminated or claim there are no long tasks.

## Implementation and interim evidence

Navigation layouts retain private immutable endpoint graphs, cached room/tile
indices, care masks and up to 4,096 route results per layout (16 layouts, 32
endpoint graphs each). Paths published by the public route API are independent.
Geometry signatures include actual room/door/navigation definitions. Signatures
and stable definition readers are reused only inside explicit operations that
cannot change geometry. Builder calls still inspect actual inputs; later commands
and alternate contexts invalidate correctly. BFS uses a head index and cached
cardinal-first/lexicographic non-cardinal neighbors, including displaced-origin
overlays. No full graph is copied by the production path.

Settled query scopes name the exact root: mutable predicted reading/training
states are excluded. Choices are computed once per chart and shared by the header
and decision rows. Calendars share private cloned service prefixes and per-order
baselines; repeated forecasts are copied on return. Resource, procedure spot,
home-queue, capability and training queries share only within an unchanged root.
Candidate interval sorting is hoisted outside availability retries. The previous
quadratic home-staff dominance filter has an indexed exact equivalent with a
30-seed/200-candidate differential. Internal diagnostic paths are read-only during
candidate ranking; only winning forecasts publish independent arrays.

Attendance retries use the existing targeted tick clone instead of a full-state
clone. The original trial still executes even when its resulting state is
discarded: its operation receipt is observable through the evidence observer.
An attempted short circuit was removed after the busy-founder control showed
equal state but unequal archive bytes. Final state and whole archive match entry,
including that receipt. A durable evidence regression covers this boundary.
Experimental general drafts were substantially slower and removed completely.
The accepted tickStateClone.ts and game-evidence.ts bytes are unchanged from entry.
service-operations.ts and clinical content remain untouched by this worker.

The synthetic fixture uses shipped geometry/content, 96 rooms, 41 validated doors,
25 freshly generated employees in the observed aggregate role mix, nine active
services and two outstanding plans. Twelve real setup ticks establish an operating
clinic, including OR/endoscopy/imaging/collection queues. Authentic public
`integration-lower-repeat` QA learning/review/audit histories, resolved encounters
and nonpediatric completed service history bring it to **1,451,018 raw bytes /
114,974 gzip bytes**, near the reported ~130 KB account snapshot scale. Technical
facility timestamps are rebased; frozen cases and review histories are preserved.
Setup deserialization validates the combined fixture before the timed command
path. No private state, padding or new clinical prose is used.

Final released-overlay focused domain: **12 files /186 passed**, 15.67s, including
the literal entry routing oracle, overlapping legacy-room origin and evidence
receipt checks. The final enlarged public fixture plus eager chart differential
also passes **2 files /2 tests**, 31.45s, on current default content with hosted
CI timing allowance. Strict local synthetic budget still fails: tick+overview
means **48.729/45.690/43.126 ms** at 1x/2x/4x, maxima **57.622/51.467/52.329 ms**;
chart max **20.603 ms**. The strict run is 1 correctness pass /1 budget failure,
36.35s; no assertion was loosened. The CI multiplier remains the established 10x
hostedTime pattern and is not a claim of meeting the device budget.
These are an acceptance failure, not a claim of <16 ms or no long tasks.

The first complete released-clinical replay passed 26,433 byte comparisons and
retained 26,362 /6,056,335 /410 /0 plus all three report values. Six canonical
checkpoints match; the same two pre-existing retail-ID checkpoints do not, so the
strict CHECK exits 1. No canonical evidence was rebound. The second complete
differential also passed 26,433 comparisons; later localized correctness repairs
have dedicated regressions and an independent final-source replay below.

Seven workspace typechecks and e2e/QA typecheck passed. Full tests caught an owned
callback bug (`ids.map(getDefinition)` passed the array index as optional context).
Fixed to a one-argument callback and added a regression; corrected player peri-op
10/10 and domain peri-op 14/14 pass. Full-run results must identify any tests that
loaded the earlier transform rather than count them as unowned failures.

## Final owner-save measurement and limits

These are sequential Node 24/V8 probes with expensive validation processes
stopped, not Chrome frame/render measurements. The final matched A/B uses the
same approved owner save, **released clinical content and exact test-order map**
on both sides. Captured entry owned modules are isolated from candidate domain
and player imports; current unowned modules are shared. This avoids the catalog
and opening-source differences between the original live-catalog timing epochs.

| Operation | Matched entry mean ms | Candidate mean ms | Candidate P95 ms | Candidate max ms |
| --- | ---: | ---: | ---: | ---: |
| Raw reducer tick | 130.103 | 23.530 | 26.200 | 27.217 |
| Evidence command tick | 157.118 | 46.633 | 52.303 | 53.176 |
| Overview view | 82.970 | 10.001 | 12.698 | 12.698 |
| Chart view | 467.558 | 12.902 | 14.618 | 14.618 |

`released-owner-ab.json` records **four complete byte comparisons**, all equal:
raw next state, evidence next state, whole checkpoint/archive and whole chart.
The input digest is unchanged; all 396 saved histories remain available under
the released catalog. Raw/evidence/overview/chart sample counts are 30/25/15/10.
This meets the chart goal and fails the full tick goal.

For chronology, the required FIRST fresh live-catalog entry means were
167.726 raw /206.607 evidence /116.347 overview /643.950 chart ms. A later quiet
live-catalog candidate epoch measured 15.294 /41.025 /10.641 /14.610 ms; its
50-command evolving evidence/chart means were 44.394 /15.951 ms, maxima
93.341 /20.214 ms. Those epochs loaded different concurrent catalog/opening
sources, so they are preserved as historical measurements in before.json and
after.json rather than advertised as one fixed-input correctness control.

The backup content digest was unchanged before/after the final probes; in-memory
input was unchanged. No decoded private state or backup copy was written. Privacy
audit checks top-level receipts/logs (UTF-8 and PowerShell UTF-16), with 20 private
strings of at least eight characters: zero matches. Probe output contains only
aggregate timings, technical metadata and digests.

Concurrent clinical/catalog and cloud-opening edits changed loaded source hashes
between the original entry and candidate runs. The raw tick digest is identical; whole adapted
state/evidence/view/chain digests differ across those epochs. They must not be
presented as a fixed-catalog differential. A same-catalog control at the completed
cache epoch using captured entry code instead passed **160 complete JSON byte comparisons**:
50 raw commands +50 evidence states +50 whole checkpoint archives, and ten full
chart/overview views. The private backup remains private. Source hashes and the
catalog changes are retained in before.json /after.json; differential.json is
aggregate-only. The later final matched A/B above and busy-founder archive control
cover the final correctness repairs. No learning/history deletion or save-policy
change was made here.

## Final per-stage attribution

Instrumented **inclusive** timings overlap. They are a separate experiment;
wrappers/JIT/machine variance mean these are not to be subtracted from the clean
means above to claim small gains. Each cell is ms per probe, then calls per probe.

| Stage | Tick ms /calls | Chart ms /calls |
| --- | ---: | ---: |
| Targeted clone | 5.174 /2 | — |
| Attendance retry (inside reducer/clone) | 2.637 /1 | — |
| Geometry-key lookups | 0.248 /1038 | 0.146 /628 |
| Resource candidate computation | 0.303 /12 | 0.095 /3 |
| Service calendar prefix builds | 2.668 /4 | 0.890 /1 |
| Calendar queries | 3.936 /4 | 2.819 /10 |
| Forecast queries | 4.372 /4 | 2.892 /6 |
| Choice planning | — | 2.481 /4 |
| Evidence normalization | 7.225 /2 | — |
| Training quote computation | 0.054 /16 | 0.431 /25 |
| Guidance | 1.919 /1 | — |
| Reducer including retirement observer | 21.077 /1 | — |
| Whole evidence boundary | 34.277 /1 | — |
| Whole chart projection | — | 13.926 /1 |

The chart now plans four choices rather than eight and builds one service-calendar
prefix. Geometry signatures cost ~0.25 ms over 1,038 tick lookups, with no graph
copies. The remaining evidence boundary, two active-data clones/normalizations
and full overview derivation prevent the 16 ms target. First/worst sampled frames
still cross 50 ms; no browser no-long-task claim is supported.

Overall O(change) acceptance remains open as well: the previous targeted clone
still copies operational branches and evidence still normalizes/projects changed
trees. This milestone removes graph copying, duplicate preview planning and
repeated settled-query work; it does not prove all remaining tick work scales
only with changed fields. The remaining synchronous evidence path needs measured
ownership/incremental-update work, or coordinated worker execution that preserves
command ordering and durability. No such protocol change is included.

## Final correctness and validation receipts

- Corrected final full domain, current default content (`--pool=threads
  --maxWorkers=2`, CI=1): **186 files, 184 passed /2 failed; 4,676 tests passed /
  27 failed /1 skipped**, 526.09s. All owned functional regressions pass. Failures
  are 26 retained Level 5 source/load binding checks (including authorized input
  hash changes; no rebind) and one unowned exact clinical-choice inventory tuple
  missing from the active catalog, before route validation runs. Earlier entry
  controls reproduce the same 26 binding failures. A later entry/current-unowned
  inventory control is 7 pass /1 count failure (1,565 vs 1,541); the clinical/test
  sources changed between the full-run and control epochs, so do not call that
  later count assertion the same exact failed tuple. Both are documented without
  modifying content/tests in that lane. The old GS028 assertion now passes.
- Corrected final full player, current default content (`--pool=threads
  --maxWorkers=2`, CI=1): **352 files /3,453 tests passed**, 715.42s, exit 0.
  This is the complete rerun after the owned callback repair.
- Released-clinical full differential: **26,433 command comparisons**, 21m29.90s;
  totals **26,362 /6,056,335 cents /410 /0**, all three reports identical. The
  strict canonical CHECK exits 1 for the same two retail-ID checkpoint drifts;
  six checkpoints match. No rebind. Reference module inputs are isolated and
  frozen; reference-interpretation.json corrects the original receipt's default
  transform description when --reference-root is supplied.
- Final-source independent replay: **288.15s, exit 0** for all four totals/reports;
  same six exact/two retail-ID checkpoints. Its frozen owned input hashes match
  the actual final source manifest. Relative to the complete differential epoch,
  nine modules only restore entry line endings; three localized repairs are the
  callback context, evidence-observed attendance retry and overlapping-room origin.
  Dedicated final focused tests and entry state/archive controls cover these.
  The public workload fixture was also enlarged; source-epoch-proof.json records
  all 13 changed source inputs and the distinction. Do not imply the 26,433-command
  differential was rerun after those last repairs. Canonical results hash
  dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5 and
  checkpoint hash 10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346
  remain unchanged.
- Corrected focused domain: **12 files /186 passed**, 15.67s with released overlay. Includes route
  oracles, context/geometry mutation, private paths, scoped state invalidation,
  reading/training isolation and indexed priority differentials.
- Player focused: **5 files /8 passed**, 43.29s with hostedTime CI allowance;
  corrected affected companion suite **10/10**, 9.67s. Full chart byte equality
  versus eager uncached previews is covered across 15 evolving states.
- Earlier full domain (`--pool=threads --maxWorkers=2`, CI=1): **184 files**, 4,557 passed /
  **59 failed** /1 skipped, 507.01s. **26 were owned callback errors** from the
  earlier transform, now covered by the corrected 184-pass focused run. The other
  33 were existing data/binding/snapshot groups; concurrent content fixes changed
  five files while validation ran. Current and entry-code controls of all seven
  groups both give **1,057 passed /27 failed**, with identical failure names.
  A stricter overlay control (entry owned modules + current unowned modules)
  independently reproduces the same 27. Remaining groups: GS028 October 3
  inventory/timed-order admission (1), retained Level 5 bindings/load hashes (26).
  Source binding drift includes authorized code changes; report hashes, do not
  rebind. Full run's other six data/snapshot failures pass in current controls.
- Earlier full player (`--pool=threads --maxWorkers=2`, CI=1): **352 files**, 3,452 passed /
  **1 failed**, 705.58s. The sole failure was this worker's callback bug; corrected
  isolated suite passes 10/10. Corrected final full rerun is recorded separately.
- Seven workspace typechecks and e2e/QA typecheck: **exit 0**, including latest
  close checks after all implementation/type repairs.
- An intermediate current-tree runtime smoke failed in the concurrent, unowned
  `packages/clinical-content/src/question-new-n1-round2-20261104.ts:202`
  (`applyQuestionNewN1Round2Revisions`, called by synthetic-content.ts). Types
  still passed. This appeared after the measured/differential epochs and also
  blocked an optional catalog-count probe; it was left untouched. **The final
  smoke now passes** after concurrent clinical work. Corrected full-domain and
  full-player reruns completed against that current tree, without the released
  content override. Final-current seven-workspace and e2e/QA types also exit 0.
  Privacy audit was
  completed independently of clinical initialization using the validated backup
  selector and gzip/checksum verification, with no decoded persistence.

## Bound inputs / file ownership

All 64-character expected/current hashes are in
`.local-dev/owner-perf-20261104/bound-input-changes.json`; raw frozen final inputs
are in current-check/inputs.json. Released-clinical overlay changed 15 retained
bound paths: care-room-access, diagnostic-timing, employee-training,
facility-access-cache, game-evidence, guidance-tips, index, patient-amenities,
procedure-companions, reducer, retail-operations, routine-patient-availability,
selectors, spatial, waiting-destinations (all under packages/game-domain/src).
New collected production source inputs: diagnosticCandidatePriority,
facilityNavigation, facilityPathCache, question-new-n1-round2-test-orders,
question-new-n1-test-orders, question-new-n2-test-orders, restroom-recovery,
settledStateQueries, tickQueryCache, tickStateClone. The frozen source receipt also
collects the test-only facilityNavigationReference and routineAvailabilityReference
helpers; collection is not an executed-module trace.
The three newly introduced production helpers in this milestone are
facilityNavigation, settledStateQueries and diagnosticCandidatePriority. Other
new/changed inputs include prior accepted work and concurrent workers; none was
rebound. Clinical overlay remains the local released content and test-order map.

Owned source manifest/scoped normalized diff and protected hashes are in the
same artifact directory. service-operations.ts, accepted game-evidence.ts and
tickStateClone.ts are byte-identical to this milestone's entry. No UI component,
clinical content or cloud product file was edited here. The old five-player-failure
classification remains in the accepted tick-stutter ExecPlan. All prior handoff
bytes are preserved by the additive current-thread handoff update. No Git,
installs, network, publication or deployment occurred; candidate remains local.
