# Service queue waiting: release port and isolated evidence (2026-11-02)

## Goal and constraints

Port the manager-accepted service-queue routing lane from the live receipts into
GS-release, with release clinical content and character presentation preserved.
Visitors and encounters check in first, wait for unavailable physical services
in reserved waiting places, and then walk to the available service. Pediatric
families prefer pediatric waiting. Existing saves relocate desk queues next tick.
No persisted schema change. No Git, installs, network, agents, or evidence rebind.

## Ownership and repository state

This is a bounded worker milestone in the manager-supplied release worktree.
Read-only accepted receipts: ../GamifySurgery/.local-dev/service-queue-waiting-20261102/.
Only receipt-owned hunks in reducer.ts, service-operations.ts, pediatric-family.ts,
three existing domain tests, and FacilityScene.ts may be ported. Add the accepted
waiting-destinations module, queue fixture/tests, and visitor presentation helper/tests.
Do not copy whole shared files. Preserve all other work, clinical content,
test-choice-orders, saves/cloud, entry UI, character code, and art.

The initial release hashes match the receipts' before hashes for every shared
domain file/test. FacilityScene differs from the live baseline; apply only its
two scene-owned.diff hunks. All 379 retained M9 input hashes match the release
before editing. Retained replay: 26,710 commands / 5,818,501 closing cents.
Local records: .local-dev/service-queue-waiting-release-20261102/.

## Decisions and acceptance criteria

- Use the accepted shared seat/reservation policy for all physical service queues.
- Keep exam wait policy and held clinical/perioperative resources intact.
- Reserve Waiting Room chairs, then safe room standing; overflow to other public
  chairs/standing, then reachable sidewalk away from check-in. No front-desk wait.
- Apply precisely the accepted patch; compare all source hashes against baseline.
- Run focused and full domain/player tests in threads, all seven typechecks,
  and boundary checks. Classify every failure and preserve evidence binding gates.
- Use unchanged Level 5 generators in CHECK mode. Instrument the genuine journey
  without changing commands/reducer results to count completions, walkouts, and
  waiting assignments. Compare an in-memory release-before source overlay with
  release-after sources, keeping every other source fixed. Record checkpoint,
  cash, timing and report differences and exact changed bound inputs.
- No evidence/results files may change. Stop for manager review at the gate.

## Milestones and progress

- [x] Read release instructions, manager brief, accepted ownership receipts and
  retained release provenance; verified no pre-existing M9 binding differences.
- [x] Save scoped before sources and 2,162 monitored hashes, port exact hunks,
  inspect diff. All eleven non-scene sources match accepted normalized content;
  preserve release LF instead of the receipt reducer's CRLF. Scene has two hunks.
- [x] Focused tests, complete domain/player suites, seven typechecks, boundaries.
  Classifications below; retained evidence and prohibited Git checks stay gated.
- [x] Paired release-before/after Level 5 CHECK journeys and isolated attribution.
- [x] Verify protected files/evidence unchanged; update current handoff with exact
  results, risks, and manager's rebind gate.

## Discoveries and validation

The root boundary script invokes git ls-files internally. The explicit no-Git
instruction applies: a process-local preload will prevent that invocation before
spawn. Report its tracked-path check as blocked, and run the independent launcher
contract check separately if the script's && short-circuits.

Exact commands, receipts, failures and measured results will be appended here.

Focused domain: 6 files / 138 tests PASS (10.47 s); focused player: 4 files /
26 tests PASS (8.24 s). All seven workspace typechecks PASS. CI=true, threads;
player maxWorkers=2 and process-local Vite net-use accommodation. Full suites
use CI=true, threads, maxWorkers=2 and JSON reports in the scratch directory.

Root test:boundaries ran with a preload blocking Git before spawn. Dependency
and source marker checks reported no failures; the tracked-path portion failed
only because git ls-files is prohibited. The independent launcher contract PASS.
No Git process was invoked. The official CHECK generator is run unchanged under
an observer that writes only separate local measurement files. Its progress
file and artifact writes remain intercepted by the official check-only guard.

Before/after journeys use the same physical release sources and context. Before
overlays only the saved pre-port reducer, service-operations and pediatric-family
source bytes when Node loads them, without reverting files. Observers only read
states and count transitions; genuine commands and cash reconciliation remain
the unmodified integration fixture's responsibility. Baseline checkpoint hashes
must match retained evidence before accepting attribution.

Full player PASS: 324 files / 3,304 tests, native exit 0, 447.18 s. No failures.
No test assertions or timeout configuration were changed by the port.

Full domain: 166 files, 4,370 PASS / 1 FAIL / 1 optional full-replay skip
(4,372 total), 916.29 s, native exit 1. The sole failure is the M9 source binding
at tests/level-five-integration.test.ts:47, expected pre-port pediatric-family.ts
66e551d9... versus actual 73701aa5.... This is the intentional evidence review
gate for this domain change; all functional assertions pass. Full player and
typecheck have zero failures. Boundary tracked-file enumeration is the separate
no-Git constraint described above; launcher verification passes.

Exact validation commands (PowerShell, from GS-release; NODE_OPTIONS points to
the scratch validation-preload.cjs; CI=true for Vitest):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/service-queue-waiting.test.ts tests/service-operations.test.ts tests/diagnostic-service-operations.test.ts tests/waiting-destination-routing.test.ts tests/pediatric-appointments.test.ts tests/employee-training-benefits.test.ts --reporter=default --reporter=json --outputFile=.local-service-queue-focused.json
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/facility/serviceVisitorWaitingPresentation.test.ts src/facility/approvedPediatricWaitingRoom.test.ts src/session/levelFiveGiftRetailViewModels.test.tsx src/session/periopNurseAttentionPresentation.test.tsx --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GS-release/.local-dev/service-queue-waiting-release-20261102/focused-player.json
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GS-release/.local-dev/service-queue-waiting-release-20261102/full-domain.json
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GS-release/.local-dev/service-queue-waiting-release-20261102/full-player.json
npm.cmd run typecheck
npm.cmd run test:boundaries
node scripts/verify-launcher-contract.mjs
node .local-dev/service-queue-waiting-release-20261102/level5-attribution.mjs --before
node .local-dev/service-queue-waiting-release-20261102/level5-attribution.mjs --after
```

The focused domain JSON was moved from the workspace root to scratch after the
run; no report remains among package source files. The attribution wrapper calls
the unchanged tools/perf/level-five-generators-check.mjs --integration-only and
leaves official assertion failures intact. No --write option is used.

Initial attribution checkpoint: both journeys reach integration-l4 at tick 3,965,
754 XP, 63 completed scored encounters, zero walkouts. Baseline is byte-identical
to retained evidence. Routing adds 12 visitor waiting-chair assignments and
changes cash from 2,656,300 to 2,657,500 cents (+1,200). Integration-build likewise
remains tick 3,965 / 0 XP with cash +1,200. These are interim, not final replay
results. Full numeric/field differences are in separate *-summary.json receipts.

Controlled same-journey 2,000-tick prefixes (both exit 0; actual cash reconciled)
locate the first observed route divergence: at tick 220, service-operation.4
(ostomy visitor) leaves check-in (35,31) for waiting chair (24,27), path length 20.
The baseline stays at check-in. Its kiosk drink posts at tick 245 versus 248 after;
service starts at 266 versus 275 and completes at 296 versus 305. The final care
approach is 17 points before, 22 after. Prefix closes at identical 2,131 commands,
cash 2,167,150 versus 2,167,950 (+800 cents). This directly demonstrates physical
movement, optional retail and service timing causality without a clinical change.
Receipts: prefix-comparison.json and before/after-prefix-cause.json. Experimental
Node type-stripping stderr warnings are informational; native exits are zero.

The raw observer's integer navigation lookup cannot recognize fractional approved
pediatric chair approaches. The comparison audits their exact points against
APPROVED_LEVEL4_SUPPORT_NAVIGATION and reports them as pediatric_waiting_chair,
preserving raw receipts. Initial desk check-in endpoints are not failed-dispatch
waiting assignments. No measurement classification affects simulation state.

Interim inspection timing: baseline booking checkpoint tick 15,094 / 2,014 XP /
3,926,777 cents, byte-identical. Routing booking checkpoint tick 17,149 / 2,298 XP /
4,273,477 cents (+2,055 ticks, +346,700 cents), 285 versus 251 completed scored
encounters, zero walkouts in both. Its frozen unlock was earned at tick 17,148
(+2,054), with satisfaction 91 / staff morale 100 / nine employees, as before.
The integration driver's pump-then-tick loop advances once after that mid-pump
unlock before booking, explaining the extra tick in later checkpoints. This
distinction must be preserved in the final report.

Release-before full official integration CHECK PASS (native exit 0, 2,619.18 s):
26,710 commands, 5,818,501 cents; all nine snapshots match retained bytes,
including the official lower companion's intercepted writes. Reports match all
three retained scores; 414 scored completions, zero walkouts, 979 completed service
operations, zero cancellations. No evidence rewrites. All seven actual workspace
links resolve to GS-release (workspace-targets.json), not the live tree.

## Port source evidence

The before service operation arrival branch (saved before source lines 2696-2704)
reduced a checked-in visitor's route to its current desk point. Failed reservation
only called a waiting planner for encounters (lines 2871-2875), excluding visitors.
Legacy pending-result dispatch simply continued on unavailable routes (before
reducer.ts:8202). These are domain decisions; the player projected those locations.

Release service-operations.ts:1255 now handles both kinds of physical actor;
:2840 advances queued visitor waiting travel; :2885 assigns a wait on failed
reservation. reducer.ts:1092 selects service policy, :7963 repairs legacy queues,
and :8009/:8079 invoke it on failed dispatch. waiting-destinations.ts:56 shares
occupancy; :100 assigns destinations; :259 prioritizes waiting-room standing;
:287 reserves sidewalk overflow away from check-in. pediatric-family.ts:273 keeps
the existing preference with the optional service policy. Player helper starts
at serviceVisitorWaitingPresentation.ts:4; FacilityScene.ts:7353 consumes it.

New domain suite has 39 cases: fifteen service-room families for both actor kinds,
cross-kind reservations, standing/hallway/sidewalk overflow, newly available chairs,
legacy visitors/encounters/pending orders, check-in-first arrivals, and pediatric
family preference. Three player regressions assert actual domain coordinates and
seated support without marking moving/standing/clinical actors as seated.

## Final release gate and next action

Port and validation complete. Detailed final handoff: current handoff's
2026-11-02 service-queue section and scratch release-handoff.md. Final routing
CHECK: 28,804 commands / 6,010,006 cents (+2,094 / +191,505), 449 scored completions,
zero walkouts, all nine checkpoint bytes changed. Before CHECK: exactly 26,710 /
5,818,501 and all nine retained bytes match. Cash delta is +1,062,700 gross
-33,247 stock -837,948 operating. No evidence/result rewrite or rebind.

Waiting-seat assignment events: visitors 278 -> 323 (general 0 -> 23; pediatric
278 -> 300); encounters 508 -> 518 (general 503 -> 507; pediatric 5 -> 11).
Service completions 979 -> 1,055; cancellations zero. Full comparison, checkpoint
hashes and numeric changes: replay-comparison.json. Bound input list/hashes:
bound-input-diff.json. Full validation/classification: validation.json.

Manager reviews the scoped diff and the measured progression/economy change,
decides acceptance, and owns any rebind and normal Git-capable boundary check.
Worker stops at the evidence gate. No remaining implementation or validation
process is running. Canonical evidence and all unrelated monitored files remain
unchanged; final-scope-audit.json records the final check.
