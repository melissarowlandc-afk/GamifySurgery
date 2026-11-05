# Break Room and gym: owner-corrected policy - 2026-11-05

Ready for manager review. This handoff supersedes the earlier below-80/+12
candidate. New breaks retain **+5 morale**, last **15 minutes**, use **480
minutes below 90 effective morale / 960 at 90-99**, and do not start at 100.
Care interrupts both walking and seated breaks, releases the seat and grants
no partial credit. The passive base is reduced to **+1 per operating day**,
plus **+1 per upgrade** from the best operational Break Room/gym, without
stacking. Existing +2 completed-break upgrade points remain.

Visits remain visible: main samples average **0.489-1.000 starts and
0.378-0.905 completed breaks per employee per operating day**. Total absence
falls **62.05-79.98%** against the original policy. Average effective morale is
**7.39-11.22 points above matched no-room controls**. Cash is mixed, not a
universal profit improvement. This qualification is material to acceptance;
tables below include upkeep and unchanged/changed completion counts.

Worktree: `C:/Users/rowla/Projects/GamifySurgery`. No Git, installs, network,
agents, deployment, clinical/question edits, evidence rewrites/rebinds or
GS-release writes. Unrelated/shared work preserved. Plan:
`docs/execplans/break-room-benefit-20261105.md`.

New receipts: `.local-dev/break-room-benefit-correction-20261105/`.
Original-policy sources and the superseded candidate receipts remain in
`.local-dev/break-room-benefit-20261105/`; the old handoff is archived as
`superseded-handoff.md` in the new receipt folder. `correction.diff` compares
the owner's correction with that candidate; `owned.diff` compares the complete
lane with its original entry bytes, without Git.

## Diagnosis, choices and compatibility

Originally, any idle worker below 100 effective morale could take a 30-minute
break for +5 every 240 minutes after completion. Interruption for care already
existed, but did not stamp the cooldown. Short idle gaps could therefore send
workers repeatedly back and forth. The three-day baseline recorded 72 starts /
52 interruptions at Level 3, 58/30 at Level 4, and 56/32 at Level 5. Walking
was a substantial fraction of absence; looking only at the seated duration
understated the cost.

`packages/game-domain/src/level-three-support.ts:417` keeps the existing idle,
training, room access, route and unique seat gates. It now selects a shared
cooldown from effective morale: below 90 uses 480, 90-99 uses 960, and 100
skips new breaks. `lastBreakAtFacilityTick === null` still permits an eligible
first visit immediately. Morale is re-evaluated at each eligibility check;
Founder Office bonuses count. The happy threshold stays 80 and is not changed
into the break-frequency threshold.

At `:276`, care preempts before consuming a seated work minute, regardless of
whether the worker is still walking. Abandonment stamps the shared cooldown,
clears the seat/task and routes back; no partial morale is awarded. Room and
gym cannot alternate to evade cooldown. Existing service-role, Periop,
discussion and retail demand checks remain. `:140` also uses existing
concrete/anonymous pending-result resource reservations, computed once per
support tick. A checked-in patient waiting for the clinician no longer falsely
keeps the receptionist busy; unresolved arrival/return check-in still does.

`level-three-support.ts:466` chooses the best accessible operational staff
room. `reducer.ts:6943` pays its daily benefit only inside an accepted
ADVANCE_TICK at a 600-minute operating-day boundary; busy staff benefit without
leaving care. No room/gym stacking, no payment at tick zero, no new saved
witness, no replay/reopen duplication. A room built mid-day first pays at the
next boundary. Coffee retains its independent existing benefit.

All numeric welfare settings are **editorial simulation weights**, in
`packages/balance-config/src/staff-breaks.ts` and the validated prototype
balance config, not clinical/fitness claims.

| Setting | Original | Corrected |
|---|---:|---:|
| Seated duration | 30 minutes | 15 minutes |
| Cooldown below 90 | 240 after completion | 480 after completion or care interruption |
| Cooldown at 90-99 | 240 after completion | 960 after completion or care interruption |
| At 100 effective morale | no new break | unchanged |
| Base completed-break gain | +5 | +5 |
| Completed-break gain per room upgrade | +2 | unchanged +2 |
| Daily benefit to all staff | none | +1, best operational room |
| Daily benefit per upgrade | none | +1, best operational room |

Thus daily room benefit is +1/+2/+3/+4/+5 at tiers 1-5, and completed-break
benefit is +5/+7/+9/+11/+13. The base daily bonus is half that of ordinary
coffee. Reducing it from the superseded +2 helps preserve visits while giving
busy/interrupted workers an ongoing benefit. +5 respects the owner's choice
and naturally needs multiple completed visits from base morale 75. No work
speed, clinical relationship, fee, wage, service duration or arrival weight is
changed. Morale supplies existing happy-staff patient-satisfaction and
progression/inspection benefits; it is not currently a work-speed multiplier.

**Saves:** no format/schema-version change. Existing 30-minute tasks can finish
or yield to care. Frozen quotes keep their accepted upgrade/gain, including
an already-started +12 preview task if any was saved between candidates; all
new tasks quote +5. Unquoted legacy tasks retain +5. Gym duration validation
accepts at most the legacy 30-minute bound, not arbitrary longer tasks.
Duplicate contacts, malformed gain totals and replayable completion tasks
still reject. The tests cover load/finish, load/abandon and deterministic
reload during travel, cooldown and daily awards.

## Measurement method

`tests/fixtures/break-room-benefit.ts` runs actual reducer ticks, hiring walks,
room access, service reservations, chart actions, receipts, wages, stock and
upkeep. It uses the existing integration driver's fixed 80% answer policy and
one chart action/minute. These are funded synthetic fixtures, not the owner's
private backup; no personal data was read/copied/printed.

- Level 3: Endoscopy, ambulatory OR, Surgeon, OR nurse, two Periop nurses,
  Coffee/Training; six employees. Real hiring walk sets the matched start tick
  to 50; staff start at their usual base morale 75.
- Level 4: early Level 4 clinic with MRI, APP/pediatric/wound work and Coffee;
  seven employees.
- Level 5: larger economy/support clinic with reading, Executive, Founder
  Office and Garden; nine employees. Main room-present arm includes Break Room
  and gym; separate Break Room-only and gym-only arms are also measured.
- Each game day is 600 active minutes from balance clock config. Main seed A
  runs three days and independent seed B five days. Before = original
  30/+5/240/below-100 policy; corrected = this policy. No-room removes only
  staff rooms and their doors, with identical starting cash and other setup.
  Capital purchase/resale costs are excluded; normal upkeep is included.
- Inputs are frozen per pair. Only 12 domain/balance runtime inputs differ.
  The measurement fixture is identical in each pair. Clinical/test-choice
  bytes are the original task's read-only GS-release snapshot, not whatever
  the concurrent question worker happens to write later. Every no-room
  control is numerically identical across policies. All staff counts remain
  fixed. `measurement-comparison.json` proves the isolation.
- Staff-minutes include seated, outbound and return/care-redirection travel.
  A return ends at home/care or unrelated work. Visits show both starts and
  completed breaks, since counting retry trips as full rests would mislead.
- Care waits use a read-only one-tick counterfactual: release breaks at home,
  or let returning workers reach assigned care. Count only actual dispatch,
  care-work or check-in progress enabled by that intervention. These include
  break-origin travel, not solely marginal distance beyond normal work travel.
  No shadow state enters the real simulation. Counts are task-minutes and
  distinct tasks, rather than all queues when a worker happens to be on break.
- Gross is service/retail receipts plus scored settlements. Net subtracts stock
  and paid operating costs. Morale is staff-minute-weighted effective morale.
  Full raw JSON, daily totals, source manifests and native exits are retained.

Table notation: visits = starts / completed **per employee per game day**;
minutes = seated / all break-related **staff-minutes per game day**, summed
across the workforce; waits = total task-minutes / distinct tasks over the
whole window; gross/net are dollars over the whole window; completions =
scored / service care (not interchangeable counts).

### break-benefit-a: 3 days

| Level | Arm | Visits/employee/day | Minutes/day | Care waits | Gross / net ($) | Completions | Avg morale |
|---|---|---:|---:|---:|---:|---:|---:|
| 3 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 26,427.00 / 19,850.67 | 27 / 27 | 77.17 |
| 3 | Original room | 4.000 / 1.111 | 326.67 / 734.33 | 5 / 2 | 27,507.00 / 20,900.67 | 28 / 29 | 86.26 |
| 3 | Corrected room | 0.944 / 0.722 | 65.00 / 147.00 | 0 / 0 | 26,587.00 / 19,980.67 | 27 / 27 | 86.39 |
| 4 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 9,016.00 / 3,861.00 | 29 / 57 | 79.00 |
| 4 | Original room | 2.762 / 1.286 | 409.33 / 698.33 | 0 / 0 | 8,995.00 / 3,810.00 | 29 / 57 | 91.53 |
| 4 | Corrected room | 1.000 / 0.905 | 101.67 / 207.00 | 0 / 0 | 9,007.00 / 3,826.00 | 29 / 57 | 88.37 |
| 5 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 10,627.00 / 3,117.19 | 27 / 63 | 82.93 |
| 5 | Original room | 2.074 / 0.889 | 413.67 / 828.33 | 3 / 1 | 10,497.00 / 2,930.08 | 27 / 63 | 91.13 |
| 5 | Corrected room | 0.778 / 0.667 | 95.67 / 243.00 | 4 / 1 | 10,654.00 / 3,081.96 | 27 / 63 | 90.32 |

### break-benefit-b-5d: 5 days

| Level | Arm | Visits/employee/day | Minutes/day | Care waits | Gross / net ($) | Completions | Avg morale |
|---|---|---:|---:|---:|---:|---:|---:|
| 3 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 37,726.00 / 27,042.15 | 48 / 38 | 79.17 |
| 3 | Original room | 2.267 / 0.700 | 191.40 / 435.80 | 10 / 5 | 37,575.00 / 26,841.91 | 49 / 38 | 90.72 |
| 3 | Corrected room | 0.733 / 0.567 | 52.40 / 134.20 | 3 / 2 | 38,623.00 / 27,885.07 | 50 / 39 | 90.18 |
| 4 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 15,306.00 / 6,707.00 | 46 / 100 | 81.00 |
| 4 | Original room | 1.429 / 0.857 | 235.20 / 385.80 | 0 / 0 | 14,905.00 / 6,274.00 | 47 / 100 | 95.38 |
| 4 | Corrected room | 0.743 / 0.571 | 66.80 / 145.20 | 0 / 0 | 14,910.00 / 6,275.00 | 47 / 100 | 92.22 |
| 5 | No room (both policies) | 0.000 / 0.000 | 0.00 / 0.00 | 0 / 0 | 18,210.00 / 5,650.44 | 49 / 114 | 85.94 |
| 5 | Original room | 1.022 / 0.533 | 193.60 / 391.00 | 17 / 4 | 18,157.00 / 5,522.32 | 49 / 114 | 94.12 |
| 5 | Corrected room | 0.489 / 0.378 | 53.00 / 148.40 | 4 / 1 | 18,282.00 / 5,620.53 | 49 / 114 | 93.35 |

### Standalone Level 5 rooms, seed A / three days

The no-room reference is the same Level 5 row above, not a different clinic.

| Level | Arm | Visits/employee/day | Minutes/day | Care waits | Gross / net ($) | Completions | Avg morale |
|---|---|---:|---:|---:|---:|---:|---:|
| 5 | Original break only | 1.889 / 1.000 | 380.67 / 620.00 | 0 / 0 | 10,658.00 / 3,128.66 | 27 / 63 | 91.49 |
| 5 | Corrected break only | 0.778 / 0.704 | 101.33 / 205.33 | 0 / 0 | 10,650.00 / 3,109.66 | 27 / 63 | 90.38 |
| 5 | Original gym only | 2.630 / 0.778 | 396.33 / 1020.67 | 32 / 8 | 10,717.00 / 3,151.89 | 27 / 62 | 89.52 |
| 5 | Corrected gym only | 0.778 / 0.593 | 87.67 / 272.00 | 0 / 0 | 10,475.00 / 2,945.54 | 27 / 63 | 89.22 |

### Interpretation and remaining cost

The corrected policy cuts absence by 62.05-79.98% in the main samples while
preserving repeated visits. The original's high start counts include many
aborted retries. Compared with no room, corrected average morale improves
7.39-11.22 points; compared with the superseded +12 candidate it is deliberately
lower and visits are more frequent. This follows the owner's correction.

Care waits are small, but not claimed to be universally zero. In the main
corrected Level 5 sample, all four task-minutes are one APP already assigned
`perform_service`, walking to `service-operation.24` at ticks 568-571. In seed B
Level 3, the three minutes are an OR nurse already on `perform_service`, walking
to two operations (ticks 637-638 and 1178). No needed worker stays seated to
finish the break. Private read-only trace runs reproduce every aggregate metric
exactly; `*-care-trace-results.json` preserves these observations. Gym-only
waits fall from 32 task-minutes/eight tasks to zero.

Fixed-window net cash versus no room is:

| Level | Three-day seed A, $/day | Five-day seed B, $/day |
|---|---:|---:|
| 3 | +43.33 | +168.58 |
| 4 | -11.67 | -86.40 |
| 5 | -11.74 | -5.98 |

Level 3 seed B also gains two scored and one service completion versus no room.
Other main corrected arms retain service completion counts; Level 4 seed B
adds one scored completion. Nevertheless, case/fee mix, retail timing and
upkeep can move cash independently of completion counts. For example, Level 4
seed B's gross difference versus no room is -39,600 cents: MRI receipts -24,000,
scored/other settlements -14,000, and net retail mix -1,600. This is not a
39,600-cent wage cost for breaks. Level 5 seed B gains 7,200 gross cents but
room/gym upkeep and other operating cost still leave net 2,991 cents lower
over five days. Standalone corrected gym completes one more service than its
original-policy arm, but has lower cash in that sample.

The room has a measured morale benefit with much less absence; a guaranteed
financial payback is not demonstrated and should not be advertised. A separate
new cash/work-speed mechanic was not added to force that conclusion. Manager
acceptance should explicitly consider the small ongoing cost versus welfare
and progression value. The fixture excludes construction cost, so it cannot
establish capital payback either.

## Five reported failures: all from the earlier candidate, resolved

The pre-correction rerun of the three affected files already passes 126/126;
the corrected full run also passes them (APP 12, Level 5 support 43,
room-upgrade support 71). These are not unexplained baseline failures:

1. APP appointment `takes real morale-restoring breaks without free wages or
   lost visitors`: it expected a quick morale reward after care interrupted
   the break. Interruption now starts the cooldown. Its regression asserts no
   partial credit, a recorded interruption, paid wages and a completed visitor.
2. Level 5 support `shares two distinct contacts...`: the below-80 candidate
   stopped one default QA employee from taking the assumed break. The contact
   fixture deliberately puts both employees below the threshold before
   asserting independent contacts.
3. Level 5 support `rejects duplicate gym contacts...`: the same setup issue
   attempted to read `seatId` from a null task. The explicit two-contact setup
   now tests the intended duplicate/malformed/replay rejection.
4. Room-upgrade support `clamps completed break and daily coffee gains at 100`:
   the below-80 candidate would not start a new task at 99. Accept the break
   first, then raise morale before completion to isolate the clamp behavior.
5. Room-upgrade support `keeps legacy repair and break tasks at their saved
   terms after upgrades`: the initial +12 fallback wrongly paid an unquoted
   legacy break 12 rather than 5. Runtime fallback now explicitly retains +5.

The new 90-99 eligibility also restores natural two-contact QA presentation;
the player expectation is again two visits rather than the superseded
candidate's one. No duplicate-contact or reward-integrity assertion was removed.

## Validation and exact output

PowerShell `npm.cmd`; `CI=1`; Vitest threads with maxWorkers=2. Native exit codes
are written separately because an outer PowerShell process can exit zero even
when npm fails. Full logs and JSON are in the new receipt directory.

Commands (all from repo root):

```powershell
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/app-appointments.test.ts tests/level-five-support.test.ts tests/room-upgrade-support.test.ts
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/staff-break-policy.test.ts tests/level-three-support.test.ts tests/level-five-support.test.ts tests/room-upgrade-support.test.ts tests/app-appointments.test.ts
npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/break-room-benefit-correction-20261105/full-balance.json
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/break-room-benefit-correction-20261105/full-domain.json
npm.cmd run typecheck
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs'
npm.cmd test --workspace @gamify-surgery/player -- src/session/staffBreakPolicyPresentation.test.ts src/session/buildModePresentation.test.ts src/session/levelFiveSupportViewModels.test.tsx src/session/level3ControlsViewModels.test.ts src/ui/StaffPanel.test.tsx --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/break-room-benefit-correction-20261105/focused-player-final.json
```

Player preload is the existing sandbox adapter for synchronous network-device
enumeration EPERM; it blocks Git before spawning and changes no domain input.
No actual network connection or Git command was used.

```text
Reported-three-files, before correction (native 0)
 Test Files  3 passed (3)
      Tests  126 passed (126)
   Duration  13.92s

Corrected focused domain (native 0)
 Test Files  5 passed (5)
      Tests  160 passed (160)
   Duration  24.67s

Full balance-config (native 0)
 Test Files  24 passed (24)
      Tests  164 passed (164)
   Duration  3.06s

Corrected focused player (native 0)
 Test Files  5 passed (5)
      Tests  48 passed (48)
   Duration  11.05s

Full domain (native 1)
 Test Files  2 failed | 202 passed (204)
      Tests  27 failed | 5144 passed | 1 skipped (5172)
   Duration  561.31s

Repo-root typecheck (native 0)
 clinical-context-workbench: tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
 player: tsc --noEmit -p tsconfig.json
 balance-config: tsc --noEmit -p tsconfig.json
 clinical-authoring: tsc --noEmit -p tsconfig.json
 clinical-content: tsc --noEmit -p tsconfig.json
 clinical-research: tsc --noEmit -p tsconfig.json
 game-domain: tsc --noEmit -p tsconfig.json
```

All seven typechecks also pass in a final repeat after concurrent player
performance/scene edits; see `typecheck-final.log` and native exit 0. Those
seven unrelated changed files are preserved and listed in `final-audit.json`.

Full domain matches the known **27** failure baseline exactly:

- One `level-five-integration.test.ts:47` bound-source check stops at the first
  changed input (`balance-config/src/guidance-tips.ts`). This lane intentionally
  changes behavior/bound inputs; no rebind is permitted.
- Twenty-five `level-five-integration.test.ts:183` legacy loaded SHA checks
  (five fixture levels x schemas 5-9) depend on the live question/content state.
  With exact retained clinical inputs, both original and corrected sources
  match all 25 loads and all 25 next-120-minute continuations. Receipts:
  `before-legacy-control.json`, `legacy-control.json`. This separates existing
  content-dependent hashes from break-save compatibility.
- One `approved-clinical-admission.test.ts:166` static allowlist expects 585
  concepts but the shared current content has 605. No allowlist, question or
  question-save-compat assertion was edited.

Level 4 integration passes all five tests inside the full run. All 26 staff
break policy tests and all APP/support/upgrade regressions pass. The first
corrected player run had two stale expectations (daily base +2 and one default
QA gym visit); both were fixed, then the full 48-test focused selection passed.
That first invocation also used a wrong `.tsx` extension for the Level 3
presentation test; final invocation includes its correct `.ts` path.

## Level 5 CHECK: stop at the evidence gate

Both private CHECK invocations complete with native exit 0:

```powershell
node --disable-warning=ExperimentalWarning .local-dev/break-room-benefit-correction-20261105/level5-check.mjs
node --disable-warning=ExperimentalWarning .local-dev/break-room-benefit-correction-20261105/level5-check.mjs --before
python .local-dev/break-room-benefit-correction-20261105/compare-level5.py
```

The actual unchanged integration journey is invoked; a write guard rejects
canonical writes. Only private receipts/checkpoints are emitted. Both policies
use exact retained clinical/test-choice bytes from the verified prior routine-OR
archive: **291/291 retained bound hashes match**. The current GS-release snapshot
used for fixed-window measurements has five newer clinical hashes, so it is not
misrepresented as the retained Level 5 content. `level5-comparison.json` proves
that only this lane's **12 loaded runtime inputs** differ between the CHECKs.
The original-policy control exactly reproduces retained commands, closing cash,
completions, walkouts and all three report scores.

| Metric | Original / retained | Corrected | Delta |
|---|---:|---:|---:|
| Commands | 26,362 | 28,312 | +1,950 |
| Closing cents | 6,056,335 | 6,256,310 | +199,975 |
| Scored completions | 410 | 441 | +31 |
| Walkouts | 0 | 0 | +0 |
| Finish tick | 24,481 | 26,380 | +1,899 |
| 2000-XP goal tick | 14,217 | 15,025 | +808 |

The run lasts **1,899 more facility minutes**, and reaches its XP goal **808
minutes later**. Routing/travel, interruption cooldowns and the revised morale
trajectory change when care completes and concepts leave the live pool. That
changes later selected encounters, learning/XP timing and inspection state
under the existing deterministic selector and driver. No RNG, selector,
clinical/question, answer policy or evidence input was changed. The daily
morale benefit can also affect the existing morale component of inspection.
A longer run has more arrivals, care and costs; closing cash alone is not a
same-window productivity comparison. The fixed-window results above are the
appropriate revenue comparison.

Exact reconciled ledger (cents):

| Ledger | Original | Corrected | Delta |
|---|---:|---:|---:|
| opening | 1,785,500 | 1,785,500 | +0 |
| gross | 15,111,900 | 16,088,200 | +976,300 |
| stock | 271,860 | 295,178 | +23,318 |
| paid | 9,521,205 | 10,274,212 | +753,007 |
| capital | 1,048,000 | 1,048,000 | +0 |

Per-checkpoint values, original -> corrected (walkouts remain zero throughout):

| Checkpoint | Tick | Closing cents | XP | Scored completions |
|---|---:|---:|---:|---:|
| integration-l4 | 3,704 -> 3,846 | 2,635,200 -> 2,669,900 | 754 -> 754 | 58 -> 60 |
| integration-build | 3,704 -> 3,846 | 1,587,200 -> 1,621,900 | 0 -> 0 | 58 -> 60 |
| integration-preparing | 14,710 -> 16,609 | 4,148,331 -> 4,336,321 | 2,088 -> 2,298 | 244 -> 278 |
| integration-running | 14,847 -> 16,746 | 4,196,706 -> 4,379,084 | 2,110 -> 2,310 | 247 -> 280 |
| integration-final | 17,766 -> 19,665 | 4,838,179 -> 5,008,938 | 2,644 -> 2,792 | 298 -> 328 |
| integration-finish | 17,767 -> 19,666 | 4,838,179 -> 5,008,938 | 2,644 -> 2,792 | 298 -> 328 |
| integration-repeat-final | 21,423 -> 23,322 | 5,656,213 -> 5,884,787 | 3,410 -> 3,548 | 357 -> 389 |
| integration-repeat | 21,424 -> 23,323 | 5,656,213 -> 5,884,787 | 3,410 -> 3,548 | 357 -> 389 |
| integration-lower-repeat | 24,481 -> 26,380 | 6,056,335 -> 6,256,310 | 3,552 -> 3,678 | 410 -> 441 |

All nine corrected checkpoints differ from retained evidence. Control snapshots
1-6 are byte-equivalent after JSON serialization; the last three controls have
pre-existing retail/receipt/sequence and Level Five snapshot differences, with
identical retained numerical summaries and report scores. These differences
are present with the original break policy and are not attributed to this
lane. `preexisting-checkpoint-differences.json` lists every path; raw private
snapshots are retained. No evidence was edited to hide either class of change.

Reports (original -> corrected):

- Report 1: score 62.4813653779166 -> 62.06520336416755; qualifying scored patients 54 -> 49; outcome completed.
- Report 2: score 66.64761689485275 -> 66.4792515762831; qualifying scored patients 48 -> 49; outcome completed.
- Report 3: score 45.299819146370375 -> 45.41913479623775; qualifying scored patients 52 -> 50; outcome completed.

### Exact Level 5 bound-input change list

These **11 existing bound inputs** changed; retained, original-control and
corrected SHA-256 values are in `level5-comparison.json`:

- `packages/balance-config/src/guidance-tips.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/level-five-support.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/room-upgrades.ts`
- `packages/balance-config/src/schema.ts`
- `packages/game-domain/src/guidance-tips.ts`
- `packages/game-domain/src/level-three-support.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/room-upgrade-support.ts`

New loaded runtime dependency, absent from the existing binding:

- `packages/balance-config/src/staff-breaks.ts`

The player presentation and test/measurement files are not Level 5 bound inputs.
No clinical content, `test-choice-orders.ts`, driver/fixture logic, pinned route
JSON or canonical evidence/results file was changed by this lane. The seven
protected evidence/results/route files remain at their original task-entry
hashes; final audit records the proof. Manager owns any release-worktree rebind.

## Files and hunk summary

The correction modifies 15 files relative to the earlier +12 candidate.
The complete lane has 22 source/test/fixture files with semantic differences
from original entry. `level-three-support.test.ts` is restored to its original
+5 expectation and has no remaining semantic diff.

Balance runtime:

- `packages/balance-config/src/staff-breaks.ts` (new): shared editorial weights,
  old task bounds and accepted preview quote compatibility.
- `packages/balance-config/src/prototype-balance.ts`: policy bindings, two-tier
  cooldown and daily bonus fields; no other balance weights changed.
- `packages/balance-config/src/schema.ts`: validates the new balance fields.
- `packages/balance-config/src/level-five-support.ts`: gym uses shared +5.
- `packages/balance-config/src/room-upgrades.ts`: descriptions include existing
  +2 per completed break and new +1 best-room daily benefit per purchase.
- `packages/balance-config/src/guidance-tips.ts`: short visits, high-morale
  frequency and care priority text.
- `packages/balance-config/src/index.ts`: exports shared policy.

Domain runtime:

- `packages/game-domain/src/level-three-support.ts`: two-tier effective-morale
  eligibility, throttled care interruption, pending clinical reservation checks,
  check-in guard, frozen legacy reward and best-room daily selector.
- `packages/game-domain/src/reducer.ts`: daily award at accepted tick boundary.
- `packages/game-domain/src/persistence.ts`: accepts saved 30-minute gym tasks.
- `packages/game-domain/src/room-upgrade-support.ts`: preserves accepted +5/+12
  gym quotes with strict gain totals.
- `packages/game-domain/src/guidance-tips.ts`: accurate future upgrade rewards.

Presentation and tests:

- `apps/player/src/session/buildModePresentation.ts`: shared room/upgrade copy
  shows 90/960/100, +5, daily +1 and care interruption; no scene/art changes.
- `packages/game-domain/tests/staff-break-policy.test.ts` (new, 26 tests):
  threshold edges 79/80/89/90/99/100, effective/office morale, cooldown tiers and
  threshold crossing, no partial credit, care paths, saved terms, daily
  boundaries/best-room access and deterministic reload.
- `packages/game-domain/tests/level-five-support.test.ts`: explicit contact
  fixtures and new duration/cooldown, +5 and interruption expectations.
- `packages/game-domain/tests/room-upgrade-support.test.ts`: short duration,
  frozen upgrades, clamp and accepted legacy +5 behavior.
- `packages/game-domain/tests/app-appointments.test.ts`: care preempts break
  without partial credit, free wages or losing the visitor.
- `packages/balance-config/src/staff-breaks.test.ts` (new): shared weights,
  schema constraints and upgrade descriptions.
- `apps/player/src/session/staffBreakPolicyPresentation.test.ts` (new): both
  rooms' two-tier policy, rewards and upgrade descriptions.
- `apps/player/src/session/buildModePresentation.test.ts` and
  `apps/player/src/session/levelFiveSupportViewModels.test.tsx`: actual totals,
  natural two-contact default, shared desktop/phone presentation.
- `tests/fixtures/break-room-benefit.ts` (new): actual reducer measurement,
  isolated comparisons and read-only ready-care counterfactual.

Durable documents: this handoff, the active ExecPlan, and an append to
`docs/handoffs/CURRENT_THREAD_HANDOFF.md` (prior/concurrent text preserved).

## Open risks and manager decisions

- Financial return varies; higher morale and reduced absence are demonstrated,
  but automatic cash profit in every clinic is not. The owner-directed +5 and
  continued visits are prioritized; no unapproved work-speed/fee mechanic was
  introduced to manufacture ROI.
- Solvent staff morale does not otherwise decay. Coffee, office and daily
  bonuses eventually reach 100, at which point visits stop as explicitly
  requested. Busy roles may visit less often than the workforce average. The
  three-/five-day measurements do not prove indefinite visit frequency.
- Room placement still determines walking cost. Care preemption cannot remove
  physical travel time; the measured few remaining travel waits are reported.
- Saved +12 preview quotes finish at their already-accepted terms; newly
  scheduled work uses +5. Strict save-validation tests remain in place.
- Known 27 domain failures and changed Level 5 checkpoint/report evidence need
  manager handling; do not rebind in this shared live tree. Pre-existing
  control snapshot metadata differences are listed separately.
- No new backup was created. Work remains local. Manager owns acceptance,
  release integration, evidence rebind and any later authorized GitHub backup
  (owner instruction: "push to GitHub"). No player opening pathway changed.

