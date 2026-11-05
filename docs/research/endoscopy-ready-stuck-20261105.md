# Level 2 routine endoscopy: Ready-but-stuck diagnosis and fix

2026-11-05. Assigned domain worker; main GamifySurgery tree. Ready for manager
review. No Git, installs, network, agents, deploy, evidence rebind or GS-release
writes. No tester save was requested or accessed. The supplied screenshot was
the only tester artifact inspected; no personal data is reproduced here.

## Outcome

Reproduced five synthetic cases in which the original checklist said every
requirement was Ready but no endoscopy procedure started over five game days.
They reduce to four causes: staff/founder routing omitted the patient's retained
Recovery room; the selected preparation bed could be a dead end for the next
phase; generic room access could cross a protected treatment room that patient
navigation correctly refuses; and the checklist omitted the appointments-off
switch.

The fix repairs the two routing cases and makes the other two missing actions
visible. The final matrix has 41 cases, each run for 3,000 facility minutes with
both original and fixed sources. All 35 final Ready cases start a procedure in
75–230 minutes from the start of their run. The six negative controls correctly
show Missing. There are no final Ready cases that never start. Clinics missing
a public route still need the player to connect the hallway; intentionally
disabled appointments remain disabled until the player enables them.

Two identical synthetic prepared saves demonstrate automatic recovery. The
own-Recovery routing case dispatches on the first tick after reopening, starts
the procedure after 14 minutes and completes after 122. The dead-end-bed case
rebinds on the first tick, walks to a connected bed, starts the procedure after
40 minutes and completes after 148. Neither original-source replay starts in
3,000 further minutes. Save format and logical state at load are unchanged.

This identifies demonstrable release-source bugs, not the tester's particular
campaign cause. Without her save, the screenshot alone cannot distinguish
these causes. It supplies no evidence of an incognito/cloud-save defect.

## Root causes and source evidence

### 1. Staff/founder acquisition disagreed with authorized movement

Entry/release `packages/game-domain/src/service-operations.ts:983,1032` allowed
only the target procedure room when acquiring nurse/provider paths. In a valid
layout where Endoscopy is reached through the same Recovery room holding this
patient's bed, an outside founder or nurse had no acquisition path. Preparation
finished, but the procedure stayed in `waiting_for_next_phase` indefinitely.
An already-inside hired endoscopist/nurse could mask the bug.

Movement authorization already included the operation's retained bed room:
`packages/game-domain/src/staff.ts:127,166–170` and
`packages/game-domain/src/reducer.ts:8362–8378`. Acquisition now agrees with
that contract at `service-operations.ts:1005,1054`: allow the target room plus
this operation's own `periopBedReservation.roomInstanceId`. It does not grant
transit through an unrelated treatment room. The loaded-founder and loaded-
nurse regressions also assert the path never enters an unauthorized room.

The complete entry `service-operations.ts` is byte-identical to the read-only
GS-release copy: SHA-256
`a19479a73b3e1486a344956ad277ddd7480c06e4c2c66da0787fb2be757cf159`.
Thus these failure sites exist in release source; the deployed bundle was not
queried, respecting the no-network instruction.

### 2. A reachable pre-op bed could have no onward Endoscopy route

Entry `service-operations.ts:727–761` ranked Recovery rooms by ID and checked
the visitor-to-bed path, without checking bed-to-Endoscopy geometry. With two
Recovery rooms, the first public bed could be in room A while Endoscopy was
reachable only through room B. The visitor prepared in A and could never leave
for the procedure. Subsequent admissions eventually queued behind these beds.

`service-operations.ts:706–714,769–775` now checks onward installed geometry
for a periop-first ordinary/advanced endoscopy before accepting a new bed.
It ignores temporary room occupancy and staff busyness, so those conditions
continue to queue. Accepted `diagnosticPhysicalWork` choices retain their
separate frozen resource contract.

At `service-operations.ts:731–736`, a prepared existing visit with the bad bed
uses the existing invalid-bed repair only when a connected replacement is
actually available. `reconcileServiceOperationFlow` has an optional runtime
repair flag at `:1550,1587`; only the tick calls at `:2696,3005` opt in. The
persistence caller keeps the default false. Reopen preserves exact logical
state, and the next tick repairs it without repeating preparation, changing
the accepted fee, resetting queue priority or crediting work twice. If all
replacement beds are full, keep the old bed and wait; the occupied-bed test
then proves eventual completion and unique claims. New assignments also avoid
a bed contact still physically occupied by another active operation (`:771`).

### 3. Generic Ready allowed a route through unreserved treatment space

The generic access graph (`packages/game-domain/src/doors.ts:397–409`) can
connect room nodes via another care room. Patient navigation intentionally
blocks protected rooms outside the actor's reservation
(`packages/game-domain/src/care-room-access.ts:38–66`). A Recovery room reached
only through unreserved Endoscopy therefore looked operational in the old
checklist and installed-capacity scheduler, while preparation could not start.
This is different from cause 1, where the patient already owns the transit bed.

New `packages/game-domain/src/endoscopy-setup.ts:12–69` computes read-only
installed care access: public entrance to actual Recovery beds, beds to
procedure endpoints, staff-home to approved nurse/provider spots, and founder
coverage. It ignores live tasks/training/walks; those are temporary availability,
not missing setup. `apps/player/src/session/viewModels.ts:203–268` uses these
results in the existing Level 2 room/staff/provider requirements and describes
the continuous hallway/door action. Existing hired providers remain identified
as hired even if a separate patient-access requirement is missing. It never
suggests buying a duplicate already-built room or rehiring existing staff.

`packages/game-domain/src/guidance-tips.ts:421–433` adds the existing
`restore_access` remedy for this Level 2 Endoscopy chain. It resolves to
`tip.access.restore`. `apps/player/src/session/clinicAlertActions.ts:133–143`
permits that action when generic access succeeds but care access fails, while
still rejecting a stale fixed action. No new command/action/save type is added.
Restoring the missing hallway after reload resumes the procedure in under
300 minutes in the regression. We do not teleport through another treatment
room or automatically remodel the clinic.

### 4. Scheduled appointments were off, but all setup rows were Ready

`service-operations.ts:2571–2575` correctly deletes scheduling clocks while
`serviceAppointmentsEnabled` is false. The old five-row checklist never showed
that switch. The new conditional `endoscopy.setup.appointments` requirement at
`viewModels.ts:250–253` says to turn on **Scheduled appointments in Manage >
Services**. It respects the saved off setting. The regression reloads an off
clinic, proves no arrivals, enables it with the existing command and completes
the normal start path.

## Controls and ruled-out explanations

- The routine-OR capability-erasure bug is absent from current Endoscopy
  scheduling: `service-operations.ts:424–453` uses installed, operational room
  and staff-home counts, and `:526–542` excludes exactly the two shared
  Endoscopy/Recovery capabilities. The catalog at
  `packages/balance-config/src/service-income-catalog.ts:69–70` requires only
  those two shared capabilities for these lines. Walking, training and busy
  employees do not repeatedly erase the arrival clock. No capability, timing
  or balance source was changed in this lane.
- Routine endoscopy is scheduled at Level 2 without a clinical question or
  advertising gate. Existing catalog cadence is 120 minutes; advanced
  endoscopy is 600. An accessible staffed Endoscopy suite, Recovery coverage
  and founder or endoscopist are sufficient. No extra training level,
  credential purchase or new equipment requirement was found. Procedures
  retain their existing durations, income and progression receipt logic.
- Full/momentarily busy beds, procedure rooms and staff queue rather than
  canceling arrivals. The regression covers occupied replacement beds; the
  matrix records hiring walks, finite training, low salaries/morale and a
  legacy Break Room with queued-care preemption. There were no unexplained
  route-cancellation records in the final Ready cases.
- A future-dated old appointment clock is already clamped to current cadence
  (`service-operations.ts:2584–2592`); it worked before and after. Four loaded
  orphan-task controls also work before/after. Existing
  `packages/game-domain/src/persistence.ts:3981–3992` discards service tasks
  whose owner no longer exists, while preserving real pending owners. No
  additional load cleanup was needed or added.
- The real-command Level 1→2 transition works before and after with old-schema
  scheduling fields absent. All 25 retained legacy load hashes and their next
  120-minute continuations still match with retained clinical content.

## Reproduction method and complete timings

`packages/game-domain/tests/routine-endoscopy-ready.fixture.ts` builds through
normal room/door/hire commands, asserts rejection events, and uses real salary,
training, move, sell-room and appointments commands. The private `matrix.mjs`
freezes original versus fixed sources and runs the same fixture for each. All
41 cases run 3,000 ticks per source, including negative controls. The clock is
08:00–18:00 (`prototype-balance.ts:1048–1049`), 600 operating minutes/day
(`selectors.ts:1194–1205`), so each run spans five game days.

The fixtures are synthetic, funded and isolate routine demand from scored-case
arrivals/distractions. Normal service movement, staffing, phases, income and
expense posting run. Main near rooms are Endoscopy (33,23), Recovery (40,22);
far rooms are (12,8)/(54,4). Authored door slots rotate with all four room
orientations. The care-room-chain layouts are built, accessed and staffed
through public hallways first, then remove one unused hallway tile through a
real `SELL_ROOM` command. The two-Recovery trap adds the lexically earlier
`ready.aaa-recovery` at (12,26). This avoids bypassing placement/hire checks.

The older Level 1 seed supplies prior XP/satisfaction, builds/hire-unlocks the
normal Level 1 rooms through commands, round-trips schema 7 without scheduling
fields, then uses the real `LEVEL_UP` command before building Endoscopy. A
Break Room cannot normally be bought at Level 2: compatibility controls build
one legally at Level 3 and model an older Level 2 snapshot containing it. Orphan
tasks and two prepared-stuck saves likewise deliberately shape synthetic saved
state to reproduce old compatible inputs; they are not claimed to be unedited
tester saves. `snapshot-*` uses the existing pure local snapshot codec with
synthetic campaign metadata, no authentication or cloud request.

The following numbers are absolute facility ticks. “—” means no procedure or
completion during that case's five-day window. Run-start tick is listed so
elapsed time is unambiguous. “Ready” means every displayed setup row is met.

| Scenario | Run start | Ready before ? after | Procedure before ? after | Completion before ? after | Fixed procedure elapsed |
|---|---:|---|---|---|---:|
| `near-0-staff` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `far-0-staff` | 0 | Ready ? Ready | 227 ? 227 | 361 ? 361 | 227 |
| `near-0-founder` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `far-0-founder` | 0 | Ready ? Ready | 227 ? 227 | 361 ? 361 | 227 |
| `near-90-staff` | 0 | Ready ? Ready | 195 ? 195 | 310 ? 310 | 195 |
| `far-90-staff` | 0 | Ready ? Ready | 230 ? 230 | 364 ? 364 | 230 |
| `near-90-founder` | 0 | Ready ? Ready | 195 ? 195 | 310 ? 310 | 195 |
| `far-90-founder` | 0 | Ready ? Ready | 230 ? 230 | 364 ? 364 | 230 |
| `near-180-staff` | 0 | Ready ? Ready | 195 ? 195 | 311 ? 311 | 195 |
| `far-180-staff` | 0 | Ready ? Ready | 226 ? 226 | 358 ? 358 | 226 |
| `near-180-founder` | 0 | Ready ? Ready | 195 ? 195 | 311 ? 311 | 195 |
| `far-180-founder` | 0 | Ready ? Ready | 226 ? 226 | 358 ? 358 | 226 |
| `near-270-staff` | 0 | Ready ? Ready | 187 ? 187 | 299 ? 299 | 187 |
| `far-270-staff` | 0 | Ready ? Ready | 220 ? 220 | 350 ? 350 | 220 |
| `near-270-founder` | 0 | Ready ? Ready | 187 ? 187 | 299 ? 299 | 187 |
| `far-270-founder` | 0 | Ready ? Ready | 220 ? 220 | 350 ? 350 | 220 |
| `no-door-endoscopy` | 0 | Missing ? Missing | ? ? ? | ? ? ? | ? |
| `no-door-recovery` | 0 | Missing ? Missing | ? ? ? | ? ? ? | ? |
| `no-door-front` | 0 | Missing ? Missing | ? ? ? | ? ? ? | ? |
| `recovery-through-endoscopy-staff` | 30 | Ready ? Missing | ? ? ? | ? ? ? | ? |
| `recovery-through-endoscopy-founder` | 30 | Ready ? Missing | ? ? ? | ? ? ? | ? |
| `endoscopy-through-recovery-staff` | 30 | Ready ? Ready | 218 ? 218 | 326 ? 326 | 188 |
| `endoscopy-through-recovery-founder` | 30 | Ready ? Ready | ? ? 230 | ? ? 338 | 200 |
| `low-morale-staff` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `low-morale-founder` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `appointments-disabled` | 0 | Ready ? Missing | ? ? ? | ? ? ? | ? |
| `busy-training` | 0 | Ready ? Ready | 221 ? 221 | 334 ? 334 | 221 |
| `legacy-break-room` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `legacy-break-room-queued-care` | 0 | Ready ? Ready | 75 ? 75 | 188 ? 188 | 75 |
| `reload-default` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `reload-far-founder` | 0 | Ready ? Ready | 227 ? 227 | 361 ? 361 | 227 |
| `snapshot-default` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `snapshot-far-founder` | 0 | Ready ? Ready | 227 ? 227 | 361 ? 361 | 227 |
| `old-arrival-clock` | 0 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 190 |
| `legacy-transition-staff` | 40 | Ready ? Ready | 232 ? 232 | 345 ? 345 | 192 |
| `legacy-transition-founder` | 40 | Ready ? Ready | 232 ? 232 | 345 ? 345 | 192 |
| `multi-recovery-trap` | 30 | Ready ? Ready | ? ? 241 | ? ? 349 | 211 |
| `orphan-endoscopy_nurse` | 50 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 140 |
| `orphan-periop_nurse` | 50 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 140 |
| `orphan-endoscopist` | 50 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 140 |
| `orphan-founder` | 50 | Ready ? Ready | 190 ? 190 | 303 ? 303 | 140 |

The original sources have five Ready/non-starting cases; final sources have
none. All initially working controls retain their first procedure/completion
times. New valid shared-room routes and connected-bed selection are the only
first-start changes. Negative layouts/off settings remain intentionally unable
to start until the named missing action is taken.

The two already-prepared comparison inputs are identical across the two
runtime replays (full SHA-256 in the private receipts):

| Saved case | Load tick | Original, next 3,000 ticks | Fixed first repair/dispatch | Procedure | Completion |
|---|---:|---|---|---:|---:|
| Own-Recovery founder path | 215 | No dispatch/start/completion | Dispatch 216 (+1) | 229 (+14) | 337 (+122) |
| Prepared dead-end Recovery bed | 218 | No repair/dispatch/start/completion | Bed repair 219 (+1); dispatch 243 (+25) | 258 (+40) | 366 (+148) |

Snapshot regression tests assert exact logical state immediately after reopen
and progress only on advancing ticks. A 400-tick deterministic replay compares
the complete final state with and without six intervening reloads and asserts
that all 400 ticks really advanced.

## Files and scoped hunks

| Source/test file | Owned line additions/removals | Hunk summary |
|---|---:|---|
| `packages/game-domain/src/service-operations.ts` | +28/?6 | Own-bed staff/provider routes; compatible pre-op beds; next-tick prepared-bed repair and occupied-contact guard. |
| `packages/game-domain/src/index.ts` | +1/?0 | Export read-only setup diagnostics. |
| `packages/game-domain/src/endoscopy-setup.ts` | +69/?0 | New read-only care-path/installed staff-coverage helper. |
| `packages/game-domain/src/guidance-tips.ts` | +13/?1 | Level 2 care-path issue ? existing restore-access remedy. |
| `packages/game-domain/tests/routine-endoscopy-ready.fixture.ts` | +234/?0 | Synthetic command-driven layouts and prepared/reload fixtures. |
| `packages/game-domain/tests/routine-endoscopy-ready.test.ts` | +168/?0 | 13 domain regressions: rotations, queueing, repair, completion, income/goal, replay. |
| `apps/player/src/session/viewModels.ts` | +17/?7 | Truthful room/staff access and appointments switch; retain provider-hired detail. |
| `apps/player/src/session/clinicAlertActions.ts` | +6/?1 | Permit still-needed care-access remedy despite generic operational status. |
| `apps/player/src/session/endoscopyReadiness.test.tsx` | +53/?0 | 6 render/action/temporary-busy/local snapshot regressions. |
| `apps/player/src/session/buildViewModels.test.ts` | +11/?6 | Correct invalid care-access Ready assertions and preceding break-ladder text expectation. |

`buildViewModels.test.ts` also contained one stale Break Room upgrade-ladder
expectation from the preceding lane. The first focused player run exposed it;
its expected text now matches the already-existing +5/base, upgrade points and
small daily bonus display. This is a test-only correction, with no break-policy
runtime edit. The old synthetic busy-nurse test had neither a reachable care
room nor a valid care home; its two Ready assertions were corrected to Missing.
A new valid-room, busy-training regression preserves temporary-busyness Ready.
The shared test's original LF line endings were restored after validation;
that final byte adjustment has no semantic change.

Planning/handoff: `docs/execplans/endoscopy-ready-stuck-20261105.md`, this file,
and an appended entry in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Private
receipts/scripts are under `.local-dev/endoscopy-ready-stuck-20261105/`.
`owned.diff` compares only this lane to entry snapshots, including verified
reconstruction of the two shared player files not archived initially.

## Validation: exact commands and final output

All tests use PowerShell `npm.cmd`, `CI=1`, `--pool=threads --maxWorkers=2`.
The commands below use the same root-relative workspace form as the runs;
logs also capture npm's expanded Vitest invocation. JSON reports and native
exit-code files accompany every receipt. The final focused player command uses
the existing sandbox preload via `NODE_OPTIONS`:

```powershell
$env:CI = '1'
$env:NODE_OPTIONS = '--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs'
```

This local validation shim addresses sandbox OS device enumeration and blocks
Git before process spawning; it does not connect to any network service. Root
typecheck and domain/balance validation use the installed repository toolchain.

```powershell
npm.cmd test --workspace @gamify-surgery/game-domain -- tests/routine-endoscopy-ready.test.ts tests/service-operations.test.ts tests/level-two-endoscopy.test.ts tests/periop-nurse-attention.test.ts --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/endoscopy-ready-stuck-20261105/focused-domain-complete.json
```

```text
Test Files  4 passed (4)
     Tests  77 passed (77)
  Duration  16.98s
Native exit: 0
```

The new regression file is 13/13, including the final occupied-bed repair test
(`focused-domain-policy-final.json`, native exit 0). The full suite below also
contains all 13 final domain regressions.

```powershell
npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/endoscopy-ready-stuck-20261105/full-balance.json
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/endoscopy-ready-stuck-20261105/full-domain.json
```

```text
Balance:
Test Files  24 passed (24)
     Tests  164 passed (164)
  Duration  3.72s
Native exit: 0

Domain:
Test Files  2 failed | 203 passed (205)
     Tests  27 failed | 5157 passed | 1 skipped (5185)
  Duration  514.13s
Native exit: 1
```

Exactly the known 27 domain failures, no new failures:

| Count | Failure | Classification/evidence |
|---:|---|---|
| 1 | Level 5 source binding, `level-five-integration.test.ts:47` | Existing dirty-source gate first fails on prior Break Room `packages/balance-config/src/guidance-tips.ts`; this lane adds three changed bound inputs and one new dependency below. No binding/evidence changed. |
| 25 | Level 0–4 × schema 5–9 retained loaded-state SHA, `level-five-integration.test.ts:183` | Current clinical content differs from retained fixtures. With all 291 retained clinical/test-choice pins verified, 25/25 loads and 25/25 next-120-minute states match, including this fix. |
| 1 | Static approved admission list, `approved-clinical-admission.test.ts:166` | Existing 605 actual versus 585 pinned IDs; clinical lane, unchanged by this work. |

`failure-classification.json` lists every failing test name/stack. Level 4
integration itself passes 5/5 in 27.216s in the full domain run. The previous
full-domain pass count was 5,144; the increase to 5,157 is the 13 new tests.

```powershell
npm.cmd test --workspace @gamify-surgery/player -- src/session/endoscopyReadiness.test.tsx src/session/buildViewModels.test.ts src/session/level3GoalsViewModels.test.ts src/session/clinicAlertActions.test.ts src/session/alertsEventsViewModel.test.ts src/ui/ServiceIncomePanel.test.tsx --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/endoscopy-ready-stuck-20261105/focused-player-handoff.json
npm.cmd run typecheck
```

```text
Player:
Test Files  6 passed (6)
     Tests  84 passed (84)
  Duration  11.91s
Native exit: 0

Root typecheck: all seven workspaces pass, native exit 0.
clinical-context-workbench (client and server), player, balance-config,
clinical-authoring, clinical-content, clinical-research, game-domain.
```

`typecheck-handoff.log` is the final seven-workspace run, after the final
presentation copy correction. `focused-player-handoff.log` is also after that
correction. Matrix domain/balance inputs match final sources exactly; its one
later player change only preserves the displayed “Endoscopist hired” fact and
does not change readiness predicates or simulation. The final focused tests
assert that copy. Initial exploratory fixture/assertion failures were corrected
before these final runs, not hidden or classified as baseline failures.

Additional private command controls, native exit 0:

```powershell
node .local-dev/endoscopy-ready-stuck-20261105/matrix.mjs --before
node .local-dev/endoscopy-ready-stuck-20261105/matrix.mjs
node .local-dev/endoscopy-ready-stuck-20261105/level5-check.mjs
node .local-dev/endoscopy-ready-stuck-20261105/legacy-control.mjs
python .local-dev/endoscopy-ready-stuck-20261105/audit.py
```

The Node source loader emits its existing experimental TypeScript warning;
native commands return 0. Some exploratory receipt names remain for diagnostic
history; `before-matrix.json`, `after-matrix.json`, `*-complete.exit`, and this
handoff's explicitly named final test receipts are the final results.

## Level 5 CHECK and exact changed inputs

No numerical Level 5 change is attributable to this endoscopy lane. The actual
integration journey, all nine checkpoint state hashes, all three reports
and all ledger totals match the prior Break Room candidate CHECK exactly.

| Run | Commands | Closing cents | Completions | Walkouts | Final tick | XP goal tick |
|---|---:|---:|---:|---:|---:|---:|
| Retained canonical release | 26,362 | 6,056,335 | 410 | 0 | 24,481 | 14,217 |
| Entry/pre-endoscopy, retained clinical content | 28,312 | 6,256,310 | 441 | 0 | 26,380 | 15,025 |
| Fixed endoscopy, same retained content | 28,312 | 6,256,310 | 441 | 0 | 26,380 | 15,025 |
| This lane's difference | 0 | 0 | 0 | 0 | 0 | 0 |

The entry baseline is the existing actual CHECK receipt at
`.local-dev/break-room-benefit-correction-20261105/level5-check-result.json`,
not a claimed new before run. Audit proves that all 138 previously loaded
nonclinical source hashes match this milestone's entry hashes exactly, and
all 291 bound clinical/test-choice inputs in both checks match retained pins.
The fixed CHECK loads only the four lane-specific runtime differences listed
below. It runs the unchanged integration generator, rejects canonical writes,
and stores diagnostic output only under this milestone's private scratch.
Its native exit 0 means the CHECK run completed, not that the stale canonical
source-binding gate passed. `evidenceFilesWritten` is 0. The run took 293.459s.

The retained clinical bytes are the already-verified local archive at
`.local-dev/routine-or-cases-20261105/check-inputs`, as used in the prior
accepted lane. Current GS-release clinical files have newer hashes than these
retained pins; overlaying those unverified newer bytes would confound the
comparison. Neither the live clinical files nor GS-release was rewritten.

All differences from the retained release below already exist before this
endoscopy fix (Break Room policy/timing and previously documented snapshot
metadata). The longer journey is not a fixed-time profit comparison.

| Checkpoint | Endoscopy lane delta (all fields/hash) | Tick delta vs retained | Cents delta vs retained | XP delta vs retained | Completions delta vs retained |
|---|---|---:|---:|---:|---:|
| `integration-l4` | 0; identical pre-lane hash | +142 | +34,700 | +0 | +2 |
| `integration-build` | 0; identical pre-lane hash | +142 | +34,700 | +0 | +2 |
| `integration-preparing` | 0; identical pre-lane hash | +1,899 | +187,990 | +210 | +34 |
| `integration-running` | 0; identical pre-lane hash | +1,899 | +182,378 | +200 | +33 |
| `integration-final` | 0; identical pre-lane hash | +1,899 | +170,759 | +148 | +30 |
| `integration-finish` | 0; identical pre-lane hash | +1,899 | +170,759 | +148 | +30 |
| `integration-repeat-final` | 0; identical pre-lane hash | +1,899 | +228,574 | +138 | +32 |
| `integration-repeat` | 0; identical pre-lane hash | +1,899 | +228,574 | +138 | +32 |
| `integration-lower-repeat` | 0; identical pre-lane hash | +1,899 | +199,975 | +126 | +31 |

Three existing bound inputs changed relative to this milestone's entry; the
new helper is a loaded runtime dependency needing inclusion at manager rebind:

| Runtime path | Entry SHA-256 | Final SHA-256 |
|---|---|---|
| `packages/game-domain/src/endoscopy-setup.ts` (new dependency) | Not present | `360ad23656ea684c0742fa2545babad73f323685c81ab377fd4f22ea95b274f3` |
| `packages/game-domain/src/guidance-tips.ts` | `a4fb4c518be2dc8950f14232cb07f187719af352f069f0fadfd0bdde4ea0ae85` | `cedc98f3298947e51fed2acc6f078e9369fe9607bae1b7940d11093011e8d3a5` |
| `packages/game-domain/src/index.ts` | `90fc224a8c04da1efb3f02e81f00b3da6d741c972dd28f9fc88965d6bc0e2433` | `adb0aeb1d71a3216cc4b963e4e9bc5ccdee84af505844e79f10ddb64da9a563c` |
| `packages/game-domain/src/service-operations.ts` | `a19479a73b3e1486a344956ad277ddd7480c06e4c2c66da0787fb2be757cf159` | `92fc79feeb93a45f2af617f98c645576514a4183d8ace84096ce77ad176aa2af` |

Player/test/doc files are not Level 5 bound inputs. No balance-config file was
changed here. Earlier lane pins also differ in this dirty tree; the exact
isolated list above is not a claim that only these four paths differ from the
canonical release. `level5-comparison.json` contains full retained/entry/final
SHA-256 values, per-checkpoint scalar differences, equal before/after state
hashes and verification counts. Evidence/results remain untouched.

## Audit, limitations and manager handoff

Final `scope-audit.json` checks all 2,197 entry paths. Exactly six existing
source/test files differ, all listed above; four new source/test files comprise
the rest of the lane. Clinical content, `test-choice-orders.ts`, question/save
question tests, cloud/save infrastructure, loading/entry UI and prior unrelated
edits are preserved. Seven canonical evidence/results/route files have unchanged
hashes. No launch origin or owner opening pathway changed. Private receipts
contain synthetic states only; do not publish the supplied screenshot/private
scratch with a source checkpoint.

The local Supabase skill was read only because the existing snapshot codec is
in that lane; the no-network instruction overrode its external documentation
lookup. No Supabase service/client/schema/auth changes or requests occurred.

Open limits: the 41 layouts are a bounded regression matrix, not a proof about
every possible future authored room geometry. The access helper intentionally
reports installed setup, not an ETA or a promise that an indefinitely occupied
founder will stop owner-directed work. Physical missing routes and a deliberate
appointments-off state require the stated player action. Busy replacements
wait for a bed to free. Confirm the tester's repaired layout in normal play if
she later volunteers it through the manager; no data request is needed for
accepting these proven fixes. Browser interaction/cloud I/O were not exercised;
player rendering, action guards and pure local snapshot round trips were.

Stop for manager review and release-worktree integration/evidence handling. No
rebind or shipping action taken. This validated work remains local without a
new GitHub backup; the manager owns any later authorized **“push to GitHub”**
checkpoint workflow.
