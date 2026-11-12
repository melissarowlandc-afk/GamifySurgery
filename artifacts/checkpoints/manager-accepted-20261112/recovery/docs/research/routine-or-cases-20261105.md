# Routine ambulatory OR demand — 2026-11-05

Manager-assigned worker lane in the shared live worktree. The owner's approved
direction is routine operative demand without a clinical-question trigger. No
clinical/question files, save/cloud implementation, release-worktree files or
retained evidence are edited. No Git, installs, network, rebind or agents.

## Findings and implementation

Routine ambulatory OR demand already existed: `income.ambulatory_operation`
was a scheduled visitor line with a 600-minute base interval. The Endoscopy
pipeline was the correct implementation to reuse; a second arrival engine was
unnecessary.

The defect was an inconsistent capacity check. Installed staffed, reachable OR
capacity is computed by `getFunctionalScheduledAmbulatoryOperationCapacity`
(`packages/game-domain/src/service-operations.ts:457`). It counts operational
OR/Periop rooms, assigned OR/Periop nurses and Surgeon/Founder capacity,
independent of temporary movement or reservations. `scheduledLineCapacity`
then rechecked `capability.staff.or_nurse` using the position-sensitive
`getCurrentCapabilities` (`:544`). When the OR nurse walked away from her home
room, that redundant check returned zero capacity. `scheduleArrivals` deleted
the appointment (`:2551`); restored capacity started another long first timer.
Endoscopy already treats installed capacity separately from current work
availability (`:419`, `:526`).

The controlled reproduction has installed capacity 1 both at home and in a
hallway. At home the original scheduler creates the due OR visitor; in the
hallway the physical nurse capability is false, the clock disappears and no
visitor appears. See the private `demand-before.json` receipt.

Two production changes:

1. Add the already-proved OR-nurse capability to the OR branch's shared
   capability exclusions (`service-operations.ts:548`). This preserves demand
   during walking, breaks or other temporary work. Actual admission and phase
   reservation still require available rooms, staff and providers.
2. Set routine base OR demand to the existing routine-Endoscopy 120-minute
   interval in `packages/balance-config/src/service-income-catalog.ts:28,73`.
   The named constant explicitly describes an **editorial simulation demand
   weight**, not clinical incidence or a medical scheduling recommendation.
   Extended OR remains explicit-only. The existing capacity scaling and
   backlog admission limits remain in force; 120 minutes is an arrival
   interval, not a promise that an operation starts every 120 minutes.

The only other production hunk updates the existing future-timer clamp's
comment (`service-operations.ts:2564`), which now applies to the shorter OR
interval too. No new runtime system, schema field or goal rule.

## Existing Endoscopy/OR flow preserved

- `scheduleArrivals` (`service-operations.ts:2544`) selects an eligible due
  line and calls `createOperation` (`:2269`). Routine visitors are simulation
  actors; they do not create scored questions or consume learning histories.
- Operation creation uses the existing Periop preparation/operation/recovery
  definitions. Base OR keeps 30-minute preparation, 120-minute operation,
  60-minute recovery and the existing 1,300 fee. These are retained simulation
  settings, not newly authored clinical claims.
- `tryReserve` (`:864`), `beginPhase` (`:1977`),
  `tryReserveNextPhase` (`:2074`) and `moveToNextPhase` (`:2179`) retain physical
  movement, assigned Periop beds/nurses, OR occupancy, OR-nurse work and
  provider arbitration. A hired available Surgeon operates in the regression
  test. Existing Founder fallback is intentionally preserved, including its
  mutual exclusion with other Founder work.
- Before Periop admission, unavailable capacity uses the existing service
  queue and shared waiting-room seats. Once prepared, an actor waiting for a
  busy OR keeps the already-reserved Periop bed; that is the existing pipeline
  and prevents blocking reception. No duplicate OR, provider, nurse or bed
  reservations are allowed across routine and encounter-linked work.
- `credit` (`:1944`) credits the existing operation income line
  once after recovery; departure then completes the visitor's exit. Just as
  routine Endoscopy, this does not award clinical XP, update FSRS or add a
  scored encounter-satisfaction sample. Facility crowding/workload can still
  indirectly affect other actors.
- Saved future first appointments are clamped on the next tick to the current
  capacity-scaled interval without delaying a sooner appointment. In-progress
  operations retain their frozen phases and quote. Existing serialized timer,
  reservation, movement and operation fields are reused; no save migration.

## Level 3 goal and the separate question-path diagnosis

`getFacilityProgressionStatus` (`packages/game-domain/src/selectors.ts:1552`)
accepts completed base/extended OR operations, their receipts or retained
completion witnesses, regardless of whether the actor is a visitor or an
encounter. `isCompletedAmbulatoryOperation`
(`packages/game-domain/src/retired-service-history.ts:56`) requires a base or
extended OR income ID, non-cancelled state and a completion tick. The goal is
satisfied after recovery, before the visitor disappears off-map. Routine OR
therefore already qualifies. Other office/minor procedure income IDs do not
satisfy this goal merely because their display text describes a procedure.

The owner's expected question-triggered generic OR path has no content binding
in the inspected released implementation: both generic OR lines have
`eligibleRouteIds: []`, and released clinical runtime source has no literal
binding to the generic ambulatory OR income/room. The final correct-answer
resolver `finalProcedureIncomeLineId` (`packages/game-domain/src/reducer.ts:3850`)
enumerates specific office/minor procedures, returning no generic OR line; its
caller starts only the returned procedure (`:4235`). Encounter-linked OR is a
supported service API, and the new coexistence test exercises it, but waiting
for a surgical teaching question does not currently generate generic OR work.
This is not evidence that the owner chose a wrong answer or lacked question
supply, nor proof of a failed Periop admission. No clinical mapping was added.

## Owner-approved save control

The previously approved private backup was read in place through the existing
verification/transport/snapshot adapters, with no live/cloud mutation or raw
state copy. Both snapshots verified. Only simulation counters/roles/ticks were
retained in diagnostic output; no personal/account data or clinical answers.

The selected state is Level 3 at facility tick 9,014, with appointments enabled,
one functioning OR, accessible Surgeon's Office, Periop, a hired Surgeon, an
OR nurse and two Periop nurses. Installed OR capacity is 1. There is no active
or completed base OR operation/receipt. The first OR timer is 9,601. That saved
timer alone does not establish its historical reset events.

An in-memory continuation freezes released source and clinical content, then
compares that source with **only the two production OR files overlaid**:

| Event | Released | Patched |
|---|---:|---:|
| First routine arrival | none in 900 ticks | 9,135 |
| Preparation starts | none | 9,158 |
| OR work starts | none | 9,193 |
| Recovery starts | none | 9,320 |
| Receipt / Level 3 goal met | none | 9,380 |
| Off-map completion | none | 9,403 |
| Final simulated tick | 9,914 | 9,403 |
| Next OR timer | 10,371 | 9,504 |

Only normal resume/tick commands are used: no question answer, chart action,
manual service start, resource grant or save rewrite. The proof receipt verifies
exactly two source differences, identical released clinical content and
unchanged backup bytes. This demonstrates that the saved clinic can complete
the goal automatically with the fix; the synthetic probe isolates the
position-sensitive timer-reset mechanism.

## Files and regression coverage

Production:

- `packages/game-domain/src/service-operations.ts`: one capability exclusion
  plus the timer comment.
- `packages/balance-config/src/service-income-catalog.ts`: documented routine
  OR editorial interval constant and its catalog reference.

New tests/fixture:

- `packages/game-domain/tests/routine-or-demand.fixture.ts`: real room geometry,
  hires, reducer ticks and serialize/reload helper, reusing the existing Periop
  test clinic.
- `packages/game-domain/tests/routine-or-demand.test.ts`: 14 cases covering
  transient staff absence, preserved clocks, automatic arrival/physical care/
  Surgeon and OR nurse/income/goal, missing rooms and nurses, appointments and
  progression gates, legacy timer/reload, waiting seating, shared reservations,
  in-progress reload and deterministic arrival/completion replay.
- `packages/balance-config/src/routine-or-demand.test.ts`: retained fee/work and
  Endoscopy-equivalent editorial cadence; extended OR remains explicit-only.
- `apps/player/src/facility/routineOrPresentation.test.ts`: projects the patient
  through Periop, OR occupancy, recovery and departure. Existing presentation
  already handles routine OR; no player production code change.

The final original-two-source control is 8 pass / 6 fail versus 14/14 with the
patch. The six failures reproduce missing arrival, reset future clock, no
automatic operation, legacy long first clock, delayed coexistence and no
deterministic completion within the bound. An earlier draft seat predicate was
tightened before this final control; that draft assertion is not counted as a
product regression.

## Validation

All tests use PowerShell `npm.cmd`, `CI=1`, `--pool=threads` and
`--maxWorkers=2` (isolated performance controls use one worker). Native exits
below are the captured `$LASTEXITCODE`, not the wrapper shell's exit.

| Run | Files | Pass | Fail | Skip | Native exit |
|---|---:|---:|---:|---:|---:|
| Focused domain | 5 | 128 | 0 | 0 | 0 |
| Final routine-OR file | 1 | 14 | 0 | 0 | 0 |
| Focused balance | 2 | 17 | 0 | 0 | 0 |
| Focused player | 2 | 4 | 0 | 0 | 0 |
| Full domain | 200 | 5,011 | 27 | 1 | 1 |
| Full player | 375 | 3,549 | 3 | 0 | 1 |
| Full balance | 23 | 160 | 0 | 0 | 0 |
| Original OR source / new domain tests | 1 | 8 | 6 | 0 | 1 |
| Original OR source / admission test | 1 | 6 | 1 | 0 | 1 |
| Released-content Level 5 file | 1 | 35 | 1 | 0 | 1 |
| Original OR source / two player content files | 2 | 11 | 2 | 0 | 1 |
| Released content / same two player files | 2 | 13 | 0 | 0 | 0 |
| Isolated patched performance test | 1 | 1 | 0 | 0 | 0 |
| Isolated original-source performance test | 1 | 1 | 0 | 0 | 0 |

Full domain's Level 4 integration file passes **5/5**. Its live-content Level 5
file is **10 pass / 26 fail**. Full domain takes 545.344 seconds and full
player 1,243.84 seconds in the Vitest terminal summaries.

Seven workspace typechecks pass on both the first and final runs (native exit
0): clinical-context-workbench (client/server), player, balance-config,
clinical-authoring, clinical-content, clinical-research and game-domain.
No TypeScript errors. No browser automation was run; player coverage here is
the full threaded unit/integration suite and the new facility projection test.

Every broad-suite failure is classified:

1. **1 domain source-binding gate:** Level 5 first rejects the deliberately
   changed balance catalog hash. Expected review gate; no evidence rebind.
2. **25 domain legacy loaded-state hashes:** released clinical content has 396
   learning histories; live content has 597. Released overlay matches all
   25/25 hashes. A diagnostic clone of each live load with only the 201 added
   history keys removed also matches all 25/25. This lane changes neither load
   behavior nor those histories. These are distinct from the newer admission
   test's 585-concept allowlist.
3. **1 domain clinical-admission assertion:** live has 597 admitted concepts
   versus its explicit expected 585. It also fails under the original OR
   source control. Concurrent content/allowlist mismatch; left untouched.
4. **1 player bread-and-butter assertion:** an authored node now has three
   choices while this test asserts four. Reproduces with original OR source;
   the released clinical overlay passes.
5. **1 player separate-campaign codec assertion:** the retired-encounter
   evidence fixture exceeds the JSON string codec limit with live content.
   Reproduces with original OR source; released clinical overlay passes. This
   is a content-size/codec-boundary interaction outside this lane; no limit or
   cloud code was changed.
6. **1 player load-sensitive performance assertion:** full-suite 1x active main
   time is 188.3188001 ms versus the existing hosted-CI 160 ms budget. The
   isolated patched test passes at maxima **12.1070 / 9.2307 / 10.4863 ms** for
   1x/2x/4x; the isolated original-source test also passes at
   **10.3875 / 7.4960 / 10.1412 ms**. These single runs do not establish a small
   performance delta; they do show the full-suite failure is not reproduced in
   isolation. No budget, timeout or assertion was changed.

The full suites remain **non-green**; none of the failing assertions is hidden
or rewritten. The original-source regression-test failures are intentional
counterfactual evidence and are separate from that classification.

Commands (run from the live root; reporter arguments direct logs/JSON into the
private receipt directory):

```powershell
$env:CI = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/routine-or-demand.test.ts tests/service-operations.test.ts tests/procedural-staffing.test.ts tests/periop-nurse-attention.test.ts tests/service-queue-waiting.test.ts --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/routine-or-demand.test.ts src/service-income-catalog.test.ts --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/routineOrPresentation.test.ts src/facility/serviceVisitorWaitingPresentation.test.ts --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
```

Player runs also use the pre-existing private `validation-preload.cjs` from the
restroom/refill lane. It normalizes synchronous sandbox `net use` EPERM to the
ordinary callback error path and blocks Git before spawn; it does not change
game inputs. The first private player control config attempt used the native
loader, which could not resolve an existing extensionless Vite-config import.
That bootstrap log is retained; both controls then ran with the bundle loader.
It is not an application-test failure.

Exact reporter output, commands/configs, native exits and failure messages:
`.local-dev/routine-or-cases-20261105/{focused-*,domain-full.*,player-full.*,balance-full.*,before-counterfactual.*,admission-before.*,released-level5.*,player-content-*,player-performance-*,typecheck-*,validation.json,failure-classification.json}`.
`owned.diff` and `owned-files.json` capture the six code/test files. All six
hashes stayed unchanged throughout broad validation. Unrelated concurrent
clinical/test-choice and player-chart edits are recorded by hash and preserved.

## Level 5 CHECK and evidence gate

Two CHECK runs execute the unchanged actual `runLevelFiveIntegrationJourney`
driver with a read-only released clinical/test-choice overlay. All source
bytes are frozen before execution; the original-source run reads those same
archives and substitutes only the two entry OR files. Both native exits are 0.
Writes to canonical evidence are rejected; diagnostic output goes only to the
private receipt directory. No evidence generator or fixture was rebound.

The frozen maps and loaded source sets prove exactly two source differences.
All **291 retained bound clinical/test-choice inputs** match released hashes;
there are zero content mismatches. Nonmutating counters reconcile all service
receipt gross/stock plus scored settlements to the driver's own cash ledger.

| Metric | Retained release | Original OR source | Patched | OR delta |
|---|---:|---:|---:|---:|
| Commands | 26,362 | 26,362 | 26,362 | 0 |
| Closing cents | 6,056,335 | 6,056,335 | 6,056,335 | 0 |
| Scored completions | 410 | 410 | 410 | 0 |
| Walkouts | 0 | 0 | 0 | 0 |
| Final tick | 24,481 | 24,481 | 24,481 | 0 |
| 2,000-XP goal tick | 14,217 | 14,217 | 14,217 | 0 |

All nine checkpoint files are **byte-identical between the paired runs**.
Numerical checkpoint values below are also unchanged from retained evidence;
all OR deltas in tick/cents/XP/completions/walkouts are zero.

| Checkpoint | Tick | Cents | XP | Completions | Walkouts | Raw state vs retained |
|---|---:|---:|---:|---:|---:|---|
| integration-l4 | 3,704 | 2,635,200 | 754 | 58 | 0 | identical |
| integration-build | 3,704 | 1,587,200 | 0 | 58 | 0 | identical |
| integration-preparing | 14,710 | 4,148,331 | 2,088 | 244 | 0 | identical |
| integration-running | 14,847 | 4,196,706 | 2,110 | 247 | 0 | identical |
| integration-final | 17,766 | 4,838,179 | 2,644 | 298 | 0 | identical |
| integration-finish | 17,767 | 4,838,179 | 2,644 | 298 | 0 | identical |
| integration-repeat-final | 21,423 | 5,656,213 | 3,410 | 357 | 0 | same 4 retail-root differences in both controls |
| integration-repeat | 21,424 | 5,656,213 | 3,410 | 357 | 0 | same 3 retail-root differences in both controls |
| integration-lower-repeat | 24,481 | 6,056,335 | 3,552 | 410 | 0 | same 4 retail-root differences in both controls |

The common retained-state differences are `serviceIncomeReceipts`,
`retailOperationSequence`, `retailOperations`, plus
`levelFive.inspection.run.accumulators.observedReceiptIds` at repeat-final or
`retailExternalActors` at lower-repeat. They already exist in the original OR
source control and cannot be attributed to this lane. Do not describe all nine
states as equal to retained evidence.

All three reports match each other and retained evidence exactly: scores
**62.4813653779166 / 66.64761689485275 / 45.299819146370375**, with qualifying
scored-patient counts **54 / 48 / 52**. The reconciled ledger is unchanged:
opening 1,785,500 + gross 15,111,900 − stock 271,860 − paid 9,521,205 − capital
1,048,000 = closing **6,056,335 cents**.

**Coverage limit:** this journey has **zero ambulatory OR rooms and zero OR
nurses at every checkpoint**. Its installed OR capacity is therefore zero;
both runs have zero routine OR arrivals/starts/completions/receipts. All other
per-line demand/revenue counters are equal too. Consequently this approved
behavior change does **not** move the current Level 4/5 replay numbers. The
new staffed-OR tests and the released-content owner-save control supply the
positive routine-OR proof; the retained journey is not an OR throughput test.

Exactly these two previously bound inputs change in this lane:

| File | Entry/retained SHA-256 | Patched SHA-256 |
|---|---|---|
| packages/balance-config/src/service-income-catalog.ts | `0fd2e7a817f9b438b44a056446bcbd472c3e5c7bd2784b0672ed089fd114aa9b` | `6096a39f88f9243917b41ec6d084500f7265baa57bc9a59ffd9f18a2603d42e8` |
| packages/game-domain/src/service-operations.ts | `dd9cb06cf2fb06708594a9267db10e951a1ac9a6a7970fab6b49388a99bfa549` | `a19479a73b3e1486a344956ad277ddd7480c06e4c2c66da0787fb2be757cf159` |

For integration clarity, the frozen live tree also has **15 other bound-input
differences common to both runs**, owned by earlier/concurrent lanes:

```text
packages/game-domain/src/care-room-access.ts
packages/game-domain/src/diagnostic-timing.ts
packages/game-domain/src/employee-training.ts
packages/game-domain/src/facility-access-cache.ts
packages/game-domain/src/game-evidence.ts
packages/game-domain/src/guidance-tips.ts
packages/game-domain/src/index.ts
packages/game-domain/src/patient-amenities.ts
packages/game-domain/src/procedure-companions.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/retail-operations.ts
packages/game-domain/src/routine-patient-availability.ts
packages/game-domain/src/selectors.ts
packages/game-domain/src/spatial.ts
packages/game-domain/src/waiting-destinations.ts
```

The loaded runtime modules not yet in the retained input manifest are also
common to both controls: `diagnosticCandidatePriority.ts`,
`facilityNavigation.ts`, `restroom-recovery.ts`, `settledStateQueries.ts`,
`tickQueryCache.ts`, `tickStateClone.ts` (all under game-domain/src). None is
new or edited by this OR milestone. New OR tests/fixture are not new runtime
inputs. Hashes and loaded-source lists are retained in the CHECK input maps.

Private CHECK receipts: `level5-check.mjs`, `level5-check-inputs.json`,
`before-level5-check-inputs.json`, `level5-check-result.json`,
`before-level5-check-result.json`, `level5-comparison.json` and
`level5-checkpoint-pair-proof.json`, with logs/native exits. All seven protected
Level 5 route/evidence/results files retain their entry hashes. **Stop at the
source-binding gate for manager review. No rebind or evidence rewrite.**

## Risks and review boundary

The 120-minute interval increases simulated demand, contention and operating
revenue. It is a balance choice matching the existing Endoscopy placeholder,
with real capacity and backlog limits still enforced. Founder fallback remains
the pre-existing provider contract. The clinical question lane is independent
and no new generic-OR clinical trigger is promised by this change.

Manager review/rebind/integration remain separate. Work is local and has no new
GitHub backup; after manager acceptance, say **"push to GitHub"** through the
manager for the authorized backup workflow. This worker ran no Git and did not
publish, deploy or modify GS-release.
