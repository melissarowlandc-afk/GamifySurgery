# Service queues use waiting areas (2026-11-02)

**Status: implementation and bounded validation complete; STOPPED at the Level 5
manager-review gate.** Fresh CHECK run: **28,804 commands / 6,010,006 cents**,
versus retained **26,710 / 5,818,501**. Six later checkpoint scalar summaries
change. No retained evidence/results files were rewritten. Manager owns the
isolated release-worktree comparison and any rebind.

## Goal and requirements

Patients and service visitors check in first, then wait for occupied/unavailable
service rooms in reserved waiting seats. Prefer pediatric family seating where
applicable. Use waiting-room standing overflow, then safe public standing space
away from check-in. Walk from the actual waiting location when service frees.
Repair legacy desk queues on the next tick without a save-format change.

## Constraints and ownership

Bounded Codex worker milestone for the Claude Code manager. Own only
`packages/game-domain` queue/movement/seating code and tests, and facility
presentation tests/code if necessary. Preserve concurrent work. No agents,
installs, network, clinical/question, save/cloud, or loading/entry edits.
No Git commands or commits/pushes. An initial read-only status command was run
in error; no further Git use. Level 5 evidence/results must remain byte intact;
run generators in CHECK mode only and report drift for manager review.

## Repository state and discoveries

- Shared workspace has extensive pre-existing and concurrent changes. Baseline
  copies/hashes and scoped diffs will be kept in
  `.local-dev/service-queue-waiting-20261102/`.
- `service-operations.ts:2690-2703`: arrivals end at check-in, change to
  `waiting_for_resources`, and only pediatric families receive a waiting plan.
- `service-operations.ts:2805-2877`: ordinary visitors retry capacity while
  retaining that location. Encounter operations alone use the supplied waiting
  planner after failed reservation.
- `reducer.ts:1131-1303`: exam waiting allocator already reserves visible chairs,
  checks reachable public paths, and provides standing overflow; its legacy
  hierarchy includes front-desk seats/standing and the entrance fallback.
- `reducer.ts:8169-8275`: older queued pending results retry resources without
  assigning a waiting destination.
- `viewModels.ts:2295-2339` projects service visitor domain location/path directly;
  the reported desk placement originates in the domain.

## Decisions

- Share the existing seat-selection logic, retaining exam behavior while using
  a service policy that excludes check-in and prefers waiting-room standing.
- Reuse existing encounter waiting reservations and visitor path endpoints as
  reservations; no persistent field/version additions.
- Retain pediatric pair planning and extend its service overflow policy so the
  child and companion remain together.
- Do not change frozen clinical content, service durations or fees. Additional
  walking and resource availability may legitimately change replay outcomes.

## Milestones and acceptance

1. Trace and implement shared service waiting routing, legacy transition and
   ownership release; preserve desk check-in.
2. Cover all service-room families, busy-to-seat-to-service transitions,
   reservations/fallbacks/pediatric preference/save reload/presentation.
3. Run focused and full domain tests, full player with the existing sandbox
   preload and `--pool=threads`, and all seven workspace typechecks.
4. CHECK Level 5 integration/lower/economy generators, compare 26,710 commands,
   closing 5,818,501 cents and checkpoints, preserve all evidence. On drift,
   report exact causes and leave rebind to the manager.
5. Record results, scoped file evidence/diff and manager handoff.

## Validation commands

- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2`
- `node --require ./.local-dev/casual-followups-20261028/vite-net-use-preload.cjs ./node_modules/vitest/vitest.mjs run --root apps/player --pool=threads --maxWorkers=2`
- `npm.cmd run typecheck`
- `node tools/perf/level-five-generators-check.mjs --integration-only`
- `node tools/perf/level-five-generators-check.mjs --lower-only`
- `node tools/perf/level-five-generators-check.mjs --economy-only`

## Progress

- [x] Read applicable instructions and current handoff; trace all queue paths.
- [x] Implement routing and legacy recovery.
- [x] Focused regressions and requested suites (full-tree failures classified below).
- [x] CHECK-only Level 5 evidence and manager handoff; no rebind.

## Next action

Manager reviews the scoped patch and validation in the isolated release worktree,
resolves the concurrent-lane assertions, and decides whether to rebind Level 5.
No further implementation or simulation work is running in this worker.

## Implementation and review evidence

- Shared allocator: `packages/game-domain/src/waiting-destinations.ts:56,100`.
  Encounter reservations and active visitor endpoints now exclude one another.
  The exam hierarchy is retained; the service hierarchy uses waiting chairs,
  waiting-room standing, other safe chairs/public standing, then a sidewalk
  endpoint at least two tiles from the entrance if no indoor route exists.
  Doorway cells and configured staff posts are excluded from service overflow.
- `service-operations.ts:1255,2840`: every failed physical service dispatch
  assigns/reuses a waiting endpoint; visitors advance along it while retaining
  `waiting_for_resources`, and dispatch walks from their actual location.
  Encounter waiting walks retain reducer ownership; pediatric pairs retain
  their shared, aligned journeys. Remote processing and held care beds retain
  their existing movement/resource ownership.
- `reducer.ts:7963,8008`: legacy resource queues gain a waiting destination on
  failed dispatch; old front-desk reservations are replaced on the next tick.
- `pediatric-family.ts:273`: the service policy retains pediatric-first pair
  seating and excludes Front Desk fallback. Generic public overflow retains
  paired movement when no seated/standing family plan exists.
- Presentation previously projected domain location/path directly at
  `apps/player/src/session/viewModels.ts:2295-2339` (unchanged).
  `facility/serviceVisitorWaitingPresentation.ts:4` and the two small Scene
  integration hunks additionally attach stationary visitors to actual Waiting
  Room chairs; retained animation must arrive before sitting.
- No persistent interfaces, codecs, save/cloud files or format versions changed.
  Existing `waitingDestination` and operation `path/pathIndex/location` persist
  the assignments. Tests round-trip desk queues and seated queues.
- New domain coverage: visitor and encounter transitions for 15 room definitions,
  shared seat exclusion, standing/hallway/sidewalk fallback, newly freed chairs,
  normal check-in arrival, pediatric preference and legacy pending-result queues.
  Existing interrupted-acquisition fixture now supplies the reducer-owned wait
  arrival and verifies return walking plus the same 35 remaining work minutes.
- Scoped evidence: `.local-dev/service-queue-waiting-20261102/`. The observed
  Scene diff also contains another worker's character sampling/anchor changes;
  `scene-owned.diff` isolates this milestone's import and visitor support call,
  while `scene-concurrent-observed.diff` preserves the unrelated observation.

## Validation so far

- Focused queue + diagnostic operation checks: **57/57 PASS**, 2 files, 3.61 s.
- Earlier queue/service/exam-waiting/pediatric checks: **89/89 PASS**, 4 files,
  10.66 s (before adding the separate legacy pending-result test).
- Facility presentation: **3/3 PASS**, 1 file, 3.07 s.
- Seven workspace typechecks: **7 PASS / 0 FAIL**, native exit 0. An initial
  missing null assertion in the new facility test was corrected. Earlier
  concurrent clinical-content type errors were fixed outside this lane.
- Default-timeout full suites initially found two garden tests exceeding 5 s
  under concurrent simulation load; isolated `--testTimeout=30000` rerun:
  **6/6 PASS**, 25.39 s, exit 0, with no assertion changes.
- Level 5 lower CHECK: **PASS**, byte-identical checkpoint/results writes
  intercepted, **0 evidence files rewritten**.
- An 80-tick controlled continuation from the same saved `integration-l4`
  checkpoint under the before/after domain modules has identical selected
  movement, queue and cash frames. It is a bounded differential, not proof of
  the full 26,710-command journey.

Full results, replay numbers/checkpoints and final evidence hashes follow.

## Completed suite results (before final Level 5 CHECK)

| Check | Exact result |
| --- | --- |
| Full domain, threads/maxWorkers=2 | **4,355 PASS / 17 FAIL / 1 SKIP**, 166 files (159 pass/7 fail), **1,140.91 s**, exit 1 |
| Full player, documented preload, threads/maxWorkers=2 | **3,246 PASS / 18 FAIL**, 316 files (309 pass/7 fail), **636.23 s**, exit 1 |
| Player simulation timeout reruns + new presentation, 30 s timeout | **10/10 PASS**, 3 files, **24.44 s**, exit 0 |
| Garden ownership timeout rerun, 30 s timeout | **6/6 PASS**, 1 file, **25.39 s**, exit 0 |
| Level 4 arrival/case-identity timeout rerun, existing CI timeout multiplier | **1 PASS / 4 intentionally filtered skips**, 1 file, **108.78 s**, exit 0 |
| Training benefits after legal waiting-area fixture correction | **30/30 PASS**, 1 file, **12.26 s**, exit 0 |
| Closure all-seven-workspace typecheck | **7 PASS / 0 FAIL**, exit 0 (`typecheck-closure.log`) |

Domain full failures classify as follows: seven timeouts (two garden, one Level
4 fairness, three Level 5 reload continuations and one long lower retry); two
training fixtures corrected in this milestone; seven concurrent clinical/content
assertions (one external-EGD preview, five GS028 paired-routine-elective/count
assertions and one timing inventory count); and one expected stale Level 5
source binding. That binding currently fails first on the untouched clinical
`answer-choice-timing.ts` (recorded hash `ad821c...`, current `5c7066...`), so it
cannot be attributed solely to this movement change. The four long Level 5
timeouts remain for manager integration rerun with adequate budgets. No evidence
or clinical assertions were weakened or rebound.

The two training tests had placed a queued patient in the old Front Desk
fallback. Their helper now uses service waiting selection and restores the
synthetic Hallway's real public/no-staff-post semantics. Training clearance,
forecast/start equality, work duration and receipt assertions remain intact.
The old setup measured a two-minute collection-start difference (117 vs 115)
when the service policy moved the patient away from check-in.

Player full failures: 15 assertions in five concurrent welcome/campaign-entry
files and three simulation timeouts. The latter all pass in the focused rerun;
the former are outside this lane and remain untouched. New presentation checks
pass. The full player ran while other UI/test files were changing; monitored
hashes distinguish that shared-tree result from the stable owned inputs.

Controlled domain-module comparisons from the saved preparing, running and
finish checkpoints each execute 160 identical tick commands. All selected
operation, encounter movement/reservation and cash frames are identical between
the before/after modules (`checkpoint-differential-report.json`). This supplements
the 80-tick Level 4 comparison; it does not establish the fresh full journey's
numbers or content provenance.

## Final focused acceptance and Level 5 review gate

Final focused domain command (six files: queue regression, service operations,
exam-waiting routing, pediatric appointments, diagnostic operation execution and
training benefits), threads/maxWorkers=2/30 s test timeout: **138/138 PASS**,
**17.67 s**, exit 0 (`focused-closure.log`). This covers the final nullable
synthetic staff-post correction as well as all 39 new queue regressions.
Final seven-workspace typecheck after the later shared Scene edits: **7 PASS /
0 FAIL**, **6.80 s**, exit 0 (`typecheck-handoff.log`). Owned Scene import and
support-call hunks are intact; other Scene edits are preserved in the separate
concurrent diff, not claimed as this worker's implementation.

The Level 5 integration CHECK completed all three real inspections, then exited
1 at the retained command-count assertion (`level-five-generators-check.mjs:51`).
The actual generator stdout establishes both final totals even though the
wrapper stops before its cash/checkpoint assertions:

| Metric | Retained | Current shared-tree CHECK | Delta |
| --- | ---: | ---: | ---: |
| Commands | 26,710 | 28,804 | +2,094 |
| Closing cash, cents | 5,818,501 | 6,010,006 | +191,505 |
| XP goal tick | 15,025 | 15,382 | +357 |
| Inspection unlock event tick | 15,094 | 17,148 | +2,054 |
| Preparing checkpoint tick | 15,094 | 17,149 | +2,055 |
| First completed inspection tick | 18,151 | 20,206 | +2,055 |
| Higher retry checkpoint tick | 21,808 | 23,863 | +2,055 |

The `integration-l4` and `integration-build` **scalar summaries** remain at tick
3,965 and XP 754/0; no full-byte-equivalence claim is made for those snapshots.
The preparing/running/final/finish/repeat-final/repeat summaries all differ in
tick and XP. Fresh lower-repeat artifact comparison is not reached after the
command assertion. The independent lower-only CHECK of retained progress passed
byte-identically with zero writes.

Inspection scores also change: retained 62.56467630107139 / 66.81366326970975 /
45.2608970823534; current 62.4360414271396 / 67.07404667363238 /
45.73839869490067. The current unlock has XP 2,298, displayed satisfaction 91,
morale 100 and nine staff. The driver waits for the combined inspection goals
(`tests/fixtures/level-five-integration.ts:153-157`); its later unlock shifts the
booked inspections and adds 2,055 minutes (34 h 15 min) to the later checkpoint
timeline. Extra operating time and different physical service/optional-action
timing alter completions and ledger postings; fees and work durations were not
changed. The route change itself adds real waiting-area walks and rebases
dispatch on the actual seat/standing location. The interrupted/training tests
demonstrate that added movement can change start ticks while retaining remaining
work duration.

**Attribution limit:** this CHECK executes the shared tree, whose clinical timing
source, active timing inventory and GS028 content assertions already differ from
the retained binding. The exact source-bound assertion is recorded above. The
controlled short continuations show no movement/cash difference in the selected
windows. Assigning the whole fresh-run delta to this patch alone would exceed
that evidence; the manager must isolate it in the release worktree before a
rebind. No clinical/content or evidence files were changed to force agreement.

The economy generator was invoked in CHECK mode and completed four seed-01
scenarios (passive-qualified, passive-no-executive, passive-no-round and
active-qualified). It was interrupted through its exec session after inspection
checkpoint drift was confirmed, as required by the manager-review gate. It did
not complete the 36 economy/four pacing selection. The four completed outputs
also differ from the retained metrics; e.g. passive-qualified gross/hour
265.833333 vs 265.75, net/hour 13.713958 vs 13.671875; active-qualified gross/hour
370.208333 vs 370.395833, net/hour 118.420833 vs 118.58625. No evidence was written.

Final receipts: `.local-dev/service-queue-waiting-20261102/level5-report.json`,
`validation.json`, `owned-files.json`, `owned.diff`, `scene-owned.diff`,
`scene-concurrent-observed.diff`, and the exact logs/native exit files. All seven
retained Level 5 JSON hashes match `evidence-before.json`; no rebind, commit,
push, install, network use, browser launch, save-format or opening-path change.
The initial read-only Git status error is disclosed in Constraints. Manager
owns acceptance and any separately authorized backup/release.

Long-run provenance: **22 monitored input paths differ from the initial validation
snapshot**, including the new presentation test's corrected null assertion and
concurrent edits. Exact before/after hashes are in `monitored-input-drift.json`.
All non-shared owned implementation/test files match the final ownership
manifest; the two owned Scene hunks are unchanged. The fresh replay figures are
observations of the loaded shared-tree run, with release-worktree isolation
required for the final frozen-source benchmark and attribution.
