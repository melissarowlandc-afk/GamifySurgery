# Owner requests batch — 2026-10-08

Owner message to the Claude manager thread, 2026-10-08. Decisions recorded here
are owner direction; implementation is delegated to Codex Sol workers with the
lanes below. Manager reviews each diff and checks the result in a QA origin.

## Decisions and requests
1. Seated layering. Patients seated facing south on endoscopy beds draw their
   legs behind the bed; anyone seated south on a bed draws entirely on top of
   it. Adults in east/west-facing armchairs draw fully in front of the chair;
   they should sit on the chair, behind its front armrest. Audit every east- and
   west-facing chair and bench in the game.
2. Chart placement. When the chart is smaller than the desk, pin it to the top
   middle of the desk; when it is larger, keep the current pinning.
3. Stats/ethics questions: owner says they look much better (accepted).
   Pending from the GS-028 brief: render `exhibit`, `teachingPoint` and
   per-choice `rationale` in the chart.
4. Pediatric Waiting Room mockup: approved overall, with revisions: fix the
   west-facing armchair layering; only children under 10 use kid stools (older
   children use the room's ordinary chairs); add more adult chairs and more
   kid stools; make the toy chest and book bin larger, toy chest facing east and
   book bin facing west. Future pediatric rooms keep the parent in the same room
   as the child at all times, with a designed parent spot.
5. Guidance tips proposal: owner approved (already implemented as M3).
6. Tutorial redesign: owner said yes to all five decisions in
   `docs/design/tutorial-revamp-proposal.md` section 6.
7. Level 3 goals: the secondary objective "Complete the first administrative
   quality review" crowds out the main goals. Show it within (or attached to)
   the Advance button area instead, keeping the main goals readable.
8. Bug: two GLP-1 NPs cannot train ("an operational, reachable training room
   is required") while everyone else can, even after adding doors.
9. Companions and waiting:
   - Patients stand in one Waiting Room instead of using another Waiting Room
     with free seats.
   - Companions only for endoscopy, surgery and pediatric patients; remove
     them for everyone else.
   - Procedure companions: during pre-op they sit in the peri-op room near the
     patient; during the procedure they may leave for an amenity (bathroom,
     coffee, vending, garden, gift shop, whatever exists); when the procedure is
     done they return to peri-op and wait until the patient leaves PACU.
   - Peri-op gets armchairs in its corners facing into the room: two per
     corner, eight total, each hidden when a door occupies its spot; a
     companion without a free chair stands in peri-op until one opens.
   - Pediatric patients: the parent stays in the same room as the child at all
     times (rooms will be designed with a parent spot).

## Workers and lanes
| Worker | Scope | Lane (files) |
| --- | --- | --- |
| layering | 1 | facility rendering/layering: `apps/player/src/facility/**` presentation and draw order, furniture overlay data; no domain |
| chart-goals | 2, 3 (chart rendering), 7 | `ChartPanel.tsx`, `ui/chartSheet.css`, chart view models/types, `GoalsPanel.tsx` and its styles |
| tutorial | 6 | tutorial/opening/help files and session tutorial state per the proposal's milestones |
| training | 8 | `packages/game-domain` training eligibility/reachability and tests |
| companions | 9 | `packages/game-domain` companion, waiting allocation and peri-op seating logic, balance room layouts; rendering needs reported to manager (no FacilityScene edits until the layering worker finishes) |
| pediatric | 4 | `tools/room-design/level-4/pediatric-waiting/**` (resume of the existing mockup worker) |

Shared files (`AppShell.tsx`, `global.css`, `reducer.ts`) take minimal exact
edits only; each worker re-reads before editing and never reverts others.

## Progress
- 2026-10-08: plan recorded; workers launched.
- 2026-10-08: launched: layering 01a11b8d-77b4-7412, chart-goals 01a11b8d-77b3-7f53, tutorial 01a11b8d-77a1-7a43, training 01a11b8d-77b3-7f50, companions 01a11b8d-77b4-7a81, pediatric resume 01a1191c-6ec1-7063.
- 2026-10-08: owner request: radiologists earn per in-house read and do paid outside reads when idle; Sol worker launched (rad-income).

## Radiologist read income

Historical split implementation. The additive owner decision below supersedes
its pricing for newly accepted reads; accepted legacy contracts stay frozen.

### Step 1: baseline traced before implementation (2026-10-08)

Current diagnostic plans create an interpretation phase after imaging acquisition.
An assigned radiologist walks to a fixed Reading Room station, then the service
engine completes the read. New Reading work freezes base 5 minutes multiplied
by the radiologist category training factor and the accepted room's upgrade
factor, with a 1-minute minimum. Exact fractional completions and continuous
same-station handoffs are already supported. Each room has four stable stations.
Training, other duties, walking and inaccessible rooms prevent execution.

Diagnostic processing is currently marked `billing: none`, has `quoteFee: 0`,
and is excluded from the credit hook. Acquisition receives the entire imaging
fee through one service-operation receipt. Thus there is no distinct diagnostic
read income today. The separate manual `income.image_read` queue is $40 for
30 minutes, with category training but no new Reading upgrade timing; it is a
legacy contract and will remain compatible. There is no automatic outside work.

| Existing economy item | Current value |
| --- | --- |
| Ultrasound / X-ray / CT / MRI fee | $120 / $90 / $180 / $240 |
| Diagnostic local interpretation baseline | 5 game minutes |
| Legacy manual image-read fee / duration | $40 / 30 game minutes |
| Radiologist hiring / default salary | $300 / $26 per game hour |
| Radiologist adjustable hourly salary | $20-$42, $2 steps |
| Reading Room construction / hourly upkeep | $1,800 / $24 |
| Reading Room Level 2-5 purchases | $450 / $675 / $990 / $1,350 |
| Reading upgrade reductions at Levels 2-5 | 10% / 20% / 30% / 40% |
| Radiologist training reductions at Levels 2-5 | 10% / 20% / 30% / 40% |
| Radiologist training prices at Levels 2-5 | $75 / $150 / $225 / $300 |

Implementation decision: reserve $5 of a newly accepted imaging bundle for each
local diagnostic interpretation; acquisition receives the remaining fee and the
read pays the reserved portion at completion. This changes payment timing, not
the bundle's total. Older already-accepted bundles retain their old payment
contract and do not acquire retroactive read income. Outside-read defaults are
$5 per 5 game minutes: 12 reads/hour x $5 = $60/hour; one untrained reader in a
base room nets $60 - $26 - $24 = $10/hour while fully busy. Four fully busy
readers net $240 - $104 - $24 = $112/hour. These are tunable gameplay economy
values, not clinical billing or turnaround claims. No sources or clinical prose
will be changed. The canonical launcher/origin remains unchanged.

### Implementation and validation

Implemented locally by the assigned Sol rad-income worker. Manager acceptance
and browser QA remain. No agents, installs, art, commit, push or publication.
No clinical content or clinical source records changed. Shared files were
re-read before exact edits; this worker made no `reducer.ts` edits.

| New tunable | Default | Behavior |
| --- | --- | --- |
| `RADIOLOGIST_READ_INCOME.inHouseFee` | $5 | Each newly accepted local interpretation |
| `outsideFee` | $5 | Each completed anonymous outside study |
| `outsideDurationMinutes` | 5 game minutes | Before Reading/training factors |
| `finishOutsideBeforeInHouseMaximumMinutes` | 1 game minute | Maximum short outside read to finish first |

For locally acquired imaging, the accepted source freezes its read portion.
The physical engine keeps the complete quote and room revenue bonus, but its
receipt withholds $5. The linked read pays that $5 once at actual completion.
Examples: base ultrasound = $115 acquisition + $5 read = $120; Level 5
ultrasound = $143.80 acquisition + $5 read = $148.80. No second imaging fee.
A study acquired outside this center has no imaging payment to this center;
its local interpretation earns the standalone $5 read fee instead. Offsite
interpretation itself earns nothing for this center.

Outside reads begin automatically only at an assigned, reachable, operational
Reading station, with no ready in-house study queued for that reader. They
have no patient actor or alert event and do not depend on the appointments
switch. Each job freezes fee, baseline, category training reduction, room
level and exact duration. The same Reading formula applies: base minutes x
training factor x room factor, minimum 1 minute. At Level 2 training and room,
5 x 0.9 x 0.9 = 4.05 minutes; maximum upgrades give 1.8 minutes. Same-station
outside work continues at exact fractional endpoints without rounding every
read to a new whole-minute start.

Priority rule: a currently eligible outside read with at most 1 minute left
finishes first, then the waiting in-house read starts on the next observing
tick; a longer outside read is discarded immediately without payment. A read
already due at the claiming tick pays once before handoff. Queued in-house
work always claims capacity before another outside study starts. Training
departure, walking, breaks, other duties, retail/discussion trips, unassignment,
room loss and incompatible station changes discard unfinished outside work
without payment. Legacy whole-room reservations also block outside stations;
other radiologists' independent diagnostic stations do not block an idle desk.
Outside work cannot starve a queued training departure.

Both kinds use ordinary service-income receipts, cash cents, employee money
anchors, Money totals and the existing end-of-day earned-money calculation.
There is no feed row per read. Services displays separate in-house/outside
counts and income for Today and This facility level, plus current outside work.
Character inspection names outside work or the patient whose study is being
read. Current read eligibility is checked before showing outside activity.

Counters survive receipt retirement and reset by completion day/current
facility level. Saves retain current outside progress and frozen read fees;
load does not pay anything. Old saves have zero outside history and no outside
job, then start fresh on their next running dispatch. Old accepted diagnostic
bundles keep their existing full acquisition payment and do not gain another
fee: future actual read completions count with $0 separately attributable read
income. Legacy manual $40/30-minute jobs retain their own original contract
and are counted when they actually complete. Finished historical jobs are not
recounted. Marker/fee disagreements are rejected on load.

Economy arithmetic is steady-state, before other clinic expenses, breaks,
walking and initial station arrival: one base reader earns 60/5 x $5 = $60/h,
minus $26 salary and the entire $24 Reading Room upkeep = $10/h. Four base
readers earn 4 x $60 - 4 x $26 - $24 = $112/h. Room upgrade upkeep remains
zero; all previously approved prices are unchanged.

Files changed in this lane:

- Balance: `packages/balance-config/src/service-income-catalog.ts`, new
  `src/radiologist-read-income.test.ts`. The obsolete manual catalog row is
  hidden in Services but its executable/saved contract is preserved.
- Domain: new `packages/game-domain/src/radiologist-read-income.ts`;
  `src/room-upgrade-reading.ts`, `src/diagnostic-timing.ts`,
  `src/service-operations.ts`, `src/types.ts`, `src/persistence.ts`, `src/index.ts`.
  The read fee is frozen on diagnostic sources and copied to their physical
  and interpretation markers; the acquisition credit hook withholds it.
- Domain tests: new `tests/radiologist-read-income.test.ts`;
  `tests/room-upgrade-reading.test.ts`, `tests/diagnostic-orders.test.ts`,
  `tests/diagnostic-service-operations.test.ts`, and two exact final financial
  assertions in `tests/employee-training-benefits.test.ts`. Timing/training
  witnesses were preserved; obsolete zero-payment assertions were updated.
- Player: `apps/player/src/ui/ServiceIncomePanel.tsx`, `src/ui/types.ts`,
  `src/session/viewModels.ts`, `src/session/characterActivityPresentation.ts`,
  new `src/session/radiologistReadIncomeViewModels.test.tsx`.
- Documentation: this section and a linked current-thread handoff. Scratch
  test config/transcripts are under `.local-dev/radiologist-read-income/`.

### Read-income validation receipt

Read-income checks pass. Aggregate results are snapshots of the concurrently
edited shared tree; manager reconciliation remains. Exact commands and output:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/radiologist-read-income.test.ts tests/room-upgrade-reading.test.ts tests/diagnostic-orders.test.ts --pool=threads --maxWorkers=1
Test Files  3 passed (3)
     Tests  140 passed (140)
Start at  10:05:47
Duration  31.05s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/radiologist-read-income.test.ts tests/diagnostic-service-operations.test.ts tests/employee-training-benefits.test.ts --pool=threads --maxWorkers=1
Test Files  3 passed (3)
     Tests  79 passed (79)
Start at  09:40:05
Duration  10.05s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
Test Files  8 passed (8)
     Tests  69 passed (69)
Start at  10:00:34
Duration  1.59s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/player -- src/session/radiologistReadIncomeViewModels.test.tsx src/ui/ServiceIncomePanel.test.tsx src/session/characterActivityPresentation.test.ts --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native
Test Files  3 passed (3)
     Tests  13 passed (13)
Start at  10:05:48
Duration  3.36s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --reporter=verbose
Test Files  8 failed | 98 passed (106)
     Tests  24 failed | 3328 passed (3352)
Start at  09:44:50
Duration  367.45s
Exit code: 1

npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native
Test Files  1 failed | 130 passed (131)
     Tests  1 failed | 1030 passed (1031)
Start at  09:44:50
Duration  55.23s
Exit code: 1

npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/diagnostic-service-operations.test.ts tests/employee-training-benefits.test.ts tests/employee-training.test.ts tests/level-two-endoscopy.test.ts tests/room-upgrade-revenue.test.ts tests/service-operations.test.ts tests/service-procedure-operations.test.ts tests/surgery-center-batch.test.ts --pool=threads --maxWorkers=1
Test Files  3 failed | 5 passed (8)
     Tests  4 failed | 190 passed (194)
Start at  10:05:47
Duration  46.39s
Exit code: 1

npm.cmd run typecheck
At 10:00: all seven workspace typechecks passed, exit code 0.
Latest handoff run: exit code 1, only these new concurrent player-test errors:
src/session/periopNurseAttentionPresentation.test.tsx(63,36): error TS2339: Property 'employees' does not exist on type 'FacilityViewModel'.
src/session/periopNurseAttentionPresentation.test.tsx(63,52): error TS7006: Parameter 'employee' implicitly has an 'any' type.
All other workspace typechecks passed in that run.
```

The initial full domain run was 3348/3351, with only three obsolete no-read-fee
assertions in `diagnostic-service-operations` and `employee-training-benefits`.
All three were reconciled above; the companion worker's earlier failure
attribution below is historical and is superseded by this lane's final receipt.
No failed timing, training or companion behavior was hidden by these changes.

Full-domain failure attribution: all 24 concern peri-op preparation, coverage,
procedure/recovery advancement or the new nurse-attention forecast. That run
caught the concurrent `roomLocalToGlobal is not a function` import error.
The rad-income worker did not edit or revert that implementation. Counts by
file were: `diagnostic-service-operations` 1, `employee-training-benefits` 6,
`employee-training` 1, `level-two-endoscopy` 2, `room-upgrade-revenue` 2,
`service-operations` 10, `service-procedure-operations` 1, and
`surgery-center-batch` 1. All read-income tests passed in that full run.

After concurrent fixes, the eight affected suites were rerun (190/194 above).
The four remaining failures are specifically:

- `diagnostic-service-operations.test.ts:361`: procedure/recovery witness
  expects phase 1 after its advance but sees phase 0.
- `employee-training.test.ts:270`: endoscopy without available peri-op
  coverage expects `waiting_for_resources` but sees `walking_to_service`.
- `room-upgrade-revenue.test.ts:182` (both `started` variants): the reserved
  earning-room transfer expects phase 1 but sees phase 0.

These tests passed in the earlier full run after the read-income hooks were
implemented. They need the peri-op worker/manager's review against the new
attention contract; their behavior assertions were not weakened here.
`employee-training-benefits` now passes all 30 tests. The new peri-op
presentation test named in the latest typecheck is outside this worker's lane.
An intervening 10:02 rerun caught a missing parenthesis in the concurrent
`diagnostic-timing.ts` peri-op forecast edit; its author corrected it before
the 10:05 read-income checks above. No correction by this worker was needed.

The one full-player failure is the previously recorded pending-label
expectation at `src/session/surgeryCenterServicePreviews.test.ts:85`, which
expects `Off-site thyroid fine-needle aspiration` but receives the existing
multi-phase pending-care description. That scenario has no radiologist or
interpretation phase. It was left for its owning lane; the new read views,
Services panel and character activity checks pass.

Transcripts: `reading-current.log`, `balance-final.log`,
`player-focused-current.log`, `domain-full.log`, `player-full.log`,
`periop-after-parse-fix.log`, and `typecheck-handoff.log` under
`.local-dev/radiologist-read-income/`. Earlier failures/receipts are also
retained there. This worker claims no aggregate green result on the moving
shared tree. The manager should rerun the full suites/typecheck after the
active peri-op lane is reconciled.

The ordinary player command with `--pool=threads --maxWorkers=1` cannot load
its Vite config in this sandbox (`spawn EPERM` at Vite's `net use` optimization).
`--configLoader runner` instead encounters `ReferenceError: require is not
defined` in picomatch. The scratch native-loader config imports the same
React and private-module guard plugins and leaves production config unchanged.
The manager should rerun the ordinary config in its own environment.

Open forecast limit: a known, currently near-finished outside read is included
in the Reading calendar and matches actual immediate dispatch. Unaccepted
future anonymous outside studies are not booked into long-range initial
diagnostic forecasts. When a study becomes ready later, its refreshed ETA may
add at most one observing minute to finish a short outside read. This is the
chosen priority rule's bounded delay; accepted in-house work durations and
existing exact in-house backlog handoffs remain unchanged.

### Manager QA campaign

Use `START_GAME.cmd` and **http://127.0.0.1:4173** in the intended persistent
profile. No launcher, port, origin, profile or owner saves were changed here.
No browser QA was claimed by this worker.

1. At Level 3, build an operational Reading Room and assign a radiologist.
   With no ready center study, inspect the outside-reading activity, Services
   current work and a $5 receipt after 5 running game minutes. Check Today and
   This facility level counts, the ordinary money animation/total and no
   per-read feed rows. Turning scheduled appointments off leaves outside
   reads running; pausing freezes them.
2. Order locally acquired ultrasound/CT/X-ray. Confirm acquisition pays its
   quote minus $5, local interpretation pays the held $5 exactly once, and the
   two sum to the existing imaging quote (including a scanner upgrade bonus).
   Separately check outside acquisition followed by a local read: only the
   interpretation fee is center income.
3. Enqueue an in-house read with a long outside read remaining (interrupt,
   unpaid), then with at most 1 minute remaining (finish first, pay once,
   center read next). Check the immediate live wait estimate and verify
   backlog priorities across all four stations.
4. Train or send the radiologist on break during unfinished outside work.
   No outside completion/payment while away; station return starts fresh.
   Repeat with room sale/unassignment and with a paid queued training request.
5. Apply training and Reading upgrades and inspect 4.05-minute work at both
   Level 2, or 1.8 at both Level 5. A purchase during a read must not alter its
   frozen current duration/fee; new outside work uses the new factors.
6. Save/load mid-read and after payout in the same origin/profile: preserve
   remaining work and once-only income. Load an older campaign: no outside
   history or retroactive money. Day rollover resets Today and preserves This
   facility level; level-key reset is domain-tested (live prototype caps at 3).
   Confirm the end-of-day money card includes outside income.

This is a local checkpoint pending manager acceptance. The manager should
remind the owner to say **"push to GitHub"** for an audited backup; this worker
did not commit or push.

## Radiologist read income: additive

Owner decision (2026-10-08): "Have radiologist scans pay $5 more."
The assigned Sol worker changed newly accepted local reads to an additional
$5 at completion; the acquisition fee and any scanner bonus stay unchanged.
Outside work, its $5/5-minute base contract, and priority rules stay unchanged.

Save decision: accepted split contracts keep their frozen settlement. A legacy
$115 ultrasound receipt is preserved, and its held $5 pays once when the linked
read completes ($120 total). No refunds, added load-time income or retrospective
re-pricing. New acceptance freezes an explicit additive marker ($120 + $5 =
$125). Split and additive contracts are tested at four save checkpoints:
before acquisition, after acquisition, during reading and after settlement.
Already completed reads keep their receipt; replay/load cannot pay again.
The standard end-of-day receipt total includes the extra $5 for new work,
including scanner bonuses ($148.80 acquisition + $5 read = $153.80 at Level 5).
Services describes the additional fee and shows the unchanged acquisition
payment; legacy active work still displays its actual withheld payment.

Changed files: balance `service-income-catalog.ts` and
`radiologist-read-income.test.ts`; domain `types.ts`, `diagnostic-timing.ts`,
`service-operations.ts`, `persistence.ts` and
`tests/radiologist-read-income.test.ts`; player `ServiceIncomePanel.tsx`,
`session/viewModels.ts` and `session/radiologistReadIncomeViewModels.test.tsx`;
this section and `CURRENT_THREAD_HANDOFF.md`. The new acceptance marker is
`sources[].readIncomeBilling: "additive"`; only old split physical work carries
a withheld `readIncomeFee`. Outside-read code and timing were preserved.

Default execution was attempted first: domain and balance fork workers failed
with `spawn EPERM` (no tests); the normal player Vite config also failed to load
with `Error: spawn EPERM`. Successful test execution used `--pool=threads
--maxWorkers=1`. Player additionally used the existing scratch native-loader
config with the same React/private-module guard plugins; production config was
unchanged. Exact commands and output summaries:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/radiologist-read-income.test.ts tests/diagnostic-timing-persistence.test.ts --pool=threads --maxWorkers=1
 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  10:55:57
   Duration  5.90s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/balance-config -- src/radiologist-read-income.test.ts --pool=threads --maxWorkers=1
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:55:57
   Duration  234ms
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/player -- src/session/radiologistReadIncomeViewModels.test.tsx src/ui/ServiceIncomePanel.test.tsx src/session/characterActivityPresentation.test.ts --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native
 Test Files  3 passed (3)
      Tests  15 passed (15)
   Start at  10:59:16
   Duration  2.40s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
 Test Files  1 failed | 107 passed (108)
      Tests  3 failed | 3381 passed (3384)
   Start at  11:00:30
   Duration  395.75s
Exit code: 1

npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
 Test Files  8 passed (8)
      Tests  70 passed (70)
   Start at  11:00:30
   Duration  1.24s
Exit code: 0

npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native
 Test Files  1 failed | 132 passed (133)
      Tests  1 failed | 1045 passed (1046)
   Start at  11:00:30
   Duration  48.03s
Exit code: 1

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit code: 0
```

Full-domain failures are the three concurrent
`tests/periop-nurse-owner-feedback.test.ts` checks: work sharing with 2 nurses,
work sharing with 3 nurses, and distinct idle staff seats. Their assertions
concern nurse distribution/location in endoscopy flows, not imaging payments.
The sole player failure is the existing
`src/session/surgeryCenterServicePreviews.test.ts:85` pending-label assertion
(expects "Off-site thyroid fine-needle aspiration", receives the multi-phase
pending-care description). Neither lane was reverted or its assertions changed.
An earlier typecheck caught `HIRE_EMPLOYEE` in the concurrent nurse fixture;
that author corrected it and the final all-workspace typecheck above passes.

Complete UTF-8/no-BOM transcripts (including failed default attempts) are in
`.local-dev/radiologist-read-income-additive/`; final typecheck is
`typecheck-final.log`. All changed code/docs are UTF-8 without BOM. Manager
acceptance and browser QA remain: use `START_GAME.cmd` ->
**http://127.0.0.1:4173** in the existing persistent profile, check new $120+$5
and legacy $115+$5 receipts, reload before/after payment, and compare Services
counts and the end-of-day total. Owner origin, launcher and saves were not
changed. Local only, no commit/push: manager should remind the owner to say
**"push to GitHub"** after acceptance.

## chart-goals Sol worker handoff - 2026-10-08

Worker: chart-goals, thread `01a11b8d-77b3-7f53`, items 2, 3 (chart rendering),
and 7. Implementation is complete locally; manager diff/browser acceptance and
aggregate-suite reconciliation remain. No Git, installs, dependency edits,
clinical-content edits, browser execution, owner-save changes, agents, or
external messages. The manager retains `CURRENT_THREAD_HANDOFF.md` and the
reviewed GitHub-checkpoint reminder.

### What the quality-review objective means

`secondary.level_three_first_qi_review` is an optional Level 3+ objective.
`session/viewModels.ts` marks it complete when
`getLevelThreeSupportStatus(state).completedQiReviewCount > 0` (display capped
at 1/1). It is separate from the primary progression requirements and does not
change `canLevelUp` or `prototypeComplete`.

In plain terms: finish one automatic administrative review of an ambulatory
operation. `packages/game-domain/src/level-three-support.ts` queues a review
for each unreviewed `income.ambulatory_operation` or
`income.ambulatory_operation_extended` receipt. An idle hired **Surgeon** with
no care demand performs it in their reachable, operational **Surgeon Office**.
The founder completing an operation does not alone complete this optional
review. It is not an Administrative Assistant task. This worker's early
commentary named the wrong role; the source investigation corrected that.
No review scheduling or progression rules were changed.

### Files changed

All source/test files are in `apps/player`:

- `src/ui/ChartPanel.tsx`: natural-content placement, content/size observers,
  three exhibit renderers, teaching-point-first feedback, selected-answer
  rationale, and native per-choice rationale reveals after Show all choices.
- `src/ui/chartSheet.css`: scoped exhibit/table/key/value/abstract and rationale
  styling using the existing read/pixel font tokens.
- `src/ui/types.ts`: optional structured chart/discussion/choice fields; the
  exhibit uses the existing `CaseExhibit` type without a competing schema.
- `src/session/viewModels.ts`: frozen node exhibits reach chart/discussion
  views; teaching points and choice rationales reach feedback only after an
  answer exists. Existing pending-label/timing/progression logic is unchanged.
- `src/ui/EmployeeDiscussionPanel.tsx`: two exact adapter additions carrying
  the exhibit and answered teaching point onto the shared chart sheet.
- `src/ui/GoalsPanel.tsx`: one main goal list plus a compact optional quality
  review chip in the Advance/completion area; full label on hover/focus.
- `src/ui/goalsPanel.css` (new): compact footer/chip and focus/hover tooltip.
- `src/ui/GoalsPanel.test.tsx`: compact secondary objective, keyboard tooltip
  association, non-gating Advance, completion, and earlier-level behavior.
- `src/ui/chartPlacement.test.ts` (new): short/tall/equal-height pinning,
  narrow-desk horizontal behavior, edge clamping, and content growth/collapse.
- `src/ui/chartStructuredFeedback.test.tsx` (new): all exhibit shapes, story
  placement, visited-node labels, correct/wrong/legacy/past feedback, discussion
  adapter, and all-choice rationale reveals.
- `src/session/chartStructuredFields.test.tsx` (new): actual frozen GS-028
  patient cases through admission/submission/projection, plus all three frozen
  discussion exhibit kinds and legacy-field omissions; no pre-answer leakage.
- This handoff append.

`AppShell.tsx`, `global.css`, `reducer.ts`, clinical source files and other
workers' lanes were not edited. Existing `ChartPanel.test.tsx` is unchanged.
A no-Git baseline comparison of the seven changed existing files was reviewed;
receipt: `%TEMP%/gs-chart-goals-20261008/chart-goals-scoped-review.diff`.
The four new files were reviewed directly and exercised by the focused tests.

### Presentation decisions

- Desktop natural height includes header, full scroll content, and sheet
  borders. Strictly shorter than the desk uses its top center, clamped to the
  play-area edges. Equal/taller content retains the previous width, left-edge
  preference, bottom pin, and maximum-height calculations. No fixed height or
  pause behavior was added. Content resizing, native details expansion,
  front/back replacement and window/desk changes recalculate placement.
- Exhibits are labelled **Teaching dataset** in the story column. Table
  captions and row/column headers are semantic; the table region can scroll
  horizontally and take keyboard focus on narrow screens. Key/value fields
  use a definition list; abstract fields use their authored title/body.
  Visited nodes' exhibits remain available with their decision headings when
  the encounter has multiple visible steps; locked/unseen nodes are withheld.
- Feedback shows `teachingPoint` first, then the selected choice's rationale.
  Wrong picks use **Why not your pick**; correct picks use **Why this answer**.
  `feedbackBody`/saved `explanation` remains the fallback when the teaching
  point is absent. Show all choices exposes a closed **Why this choice**
  details control beneath each choice that has a rationale. Unselected
  rationale prose stays at full opacity for readability.
- The optional review chip reads **Optional: Quality review 0/1** (or 1/1 with
  a completion mark). Its full original objective text is in a described,
  hover/focus tooltip. It consumes one compact line rather than a second goal
  section/list. Level 3 currently has no implemented Advance to Level 4
  action, so this same footer holds the chip before main completion and the
  existing prototype-completion notice afterward. No new disabled Advance
  control or progression requirement was introduced.

### Exact validation

Default player-config startup failed before any test ran:

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/ui/chartPlacement.test.ts src/ui/chartStructuredFeedback.test.tsx src/ui/ChartPanel.test.tsx src/ui/EmployeeDiscussionPanel.test.tsx src/ui/GoalsPanel.test.tsx src/session/chartStructuredFields.test.tsx src/session/chartFeedbackPresentation.test.tsx src/session/employeeDiscussionView.test.tsx src/session/level3GoalsViewModels.test.ts src/session/level3ControlsViewModels.test.ts --pool=threads --maxWorkers=1 --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-focused-20261008.json"
failed to load config from apps/player/vite.config.ts
[plugin externalize-deps] Error: spawn EPERM
at optimizeSafeRealPathSync ... exec("net use", ...)
Exit 1 (startup only)
```

A temporary native-loaded config avoids Vite's optional Windows drive-mapping
subprocess by setting `resolve.preserveSymlinks: true`. It keeps both player
plugins (React and the private-module guard), changes no repository config or
dependency, and grants no new permissions. File:
`C:/Users/rowla/AppData/Local/Temp/gs-chart-goals-tests-20261008.mjs`:

```js
import react from "file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/@vitejs/plugin-react/dist/index.js";
import { forbidPrivateModules } from "file:///C:/Users/rowla/Projects/GamifySurgery/scripts/vite/forbid-private-modules.ts";
export default {
  plugins: [react(), forbidPrivateModules()],
  resolve: { preserveSymlinks: true },
};
```

Successful focused run, then the FULL suite of the only edited package:

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/ui/chartPlacement.test.ts src/ui/chartStructuredFeedback.test.tsx src/ui/ChartPanel.test.tsx src/ui/EmployeeDiscussionPanel.test.tsx src/ui/GoalsPanel.test.tsx src/session/chartStructuredFields.test.tsx src/session/chartFeedbackPresentation.test.tsx src/session/employeeDiscussionView.test.tsx src/session/level3GoalsViewModels.test.ts src/session/level3ControlsViewModels.test.ts --pool=threads --maxWorkers=1 --config "$env:TEMP/gs-chart-goals-tests-20261008.mjs" --configLoader native --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-focused-20261008.json"
 Test Files  10 passed (10)
      Tests  57 passed (57)
   Start at  08:58:48
   Duration  8.76s (transform 1.92s, setup 0ms, import 4.86s, tests 2.90s, environment 1ms)
Exit 0

npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config "$env:TEMP/gs-chart-goals-tests-20261008.mjs" --configLoader native --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-player-full-20261008.json"
 Test Files  5 failed | 119 passed (124)
      Tests  11 failed | 951 passed (962)
   Start at  08:59:35
   Duration  41.30s (transform 2.71s, setup 0ms, import 22.07s, tests 9.06s, environment 7ms)
Exit 1

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit 0 (final run; all eight workspace typeconfigs passed)
```

Earlier typecheck runs caught `procedure-companions.ts(109,55): TS18048:
state.patientAmenityTrips is possibly undefined` while that concurrent lane was
in progress. The companion worker subsequently added optional chaining; the
final full typecheck above passed. This worker did not alter that module.

Full-player failures at the snapshot above (all owned tests passed):

- Layering lane, `src/facility/approvedRoomPresentation.test.ts:405`: care
  facing assertion, expected false to be true (one failure).
- Layering lane, `src/facility/approvedSideChairLayers.test.ts:18,52,74,90`:
  mask/seat catalog comparison; an unsplit-seat assertion; mask foreground
  size expected 80522 < 39011.333333333336; recovery-mask count expected eight,
  received six (four failures). The worker was changing chair/bed layering.
- Tutorial lane, `src/session/tutorialViewModels.test.ts:124,150`:
  expected "File the completed chart", received the new "Read the feedback
  and rewards ... Resolve Completed Chart files the visit" wording (two).
- Tutorial lane, `src/ui/visualComponents.test.tsx:227,257,285`: old Got It,
  Close tutorial, and Complete tutorial control expectations (three).
- Existing pending-label mismatch,
  `src/session/surgeryCenterServicePreviews.test.ts:85`: expects the pending
  label to include "Off-site thyroid fine-needle aspiration"; the existing
  dynamic label describes pending care/return and phase timing instead (one).
  This mismatch was also recorded in earlier handoffs. The scoped view-model
  diff only adds structured fields; no pending-label code was changed.

JSON receipts are in `%TEMP%` under the exact names above. The temporary
native config emits a Node MODULE_TYPELESS_PACKAGE_JSON warning for the
existing TypeScript guard file; no assertion is affected. Manager should rerun
with the normal player config in its environment after the concurrent lanes
land. No out-of-lane assertion was changed or weakened.

### Manager browser checks and fresh QA setup

No browser was run in the worker sandbox. Use a NEW disposable campaign in the
manager's QA origin/profile, record `location.origin`, and enable development
tools with `/?prototype-tools=1`. A separate QA host/port/profile has separate
storage; it does not inherit the owner's campaign. The owner opening pathway
is unchanged: `START_GAME.cmd` -> **http://127.0.0.1:4173** in the usual
persistent profile. Do not replace/clear that owner's saves for these checks.

For normal play setup, open Prototype tools, turn off **Tutorial guidance**,
and use **Add $100** repeatedly for the desired rooms/staff. Use
**Fast-forward 10 min** for arrival, service and automatic administrative work;
keep charts closed while waiting for an arrival. Advance through the main
level goals to reach Level 2 discussions and Level 3 goals. Existing staff
hosts such as a GLP-1 NP can host methods discussions once their setup is
operational. Discussion rows share the existing Waiting/Active/Resolved list.

For deterministic visual states, reuse `startClinic`/`getActiveState` from
`tests/e2e/helpers.ts` and the fresh-campaign `installState` pattern in
`tests/e2e/level-three-goals.spec.ts`. The exact admission/room and saved
employee-discussion recipes are in the new
`src/session/chartStructuredFields.test.tsx`. Select current release cases
with ID prefix `case.gs028se.` and first-node `exhibit.kind` equal to table,
keyValue or abstract; ordinary patients have no `participant`, and discussions
have `participant.kind === "employee_discussion"`. This avoids waiting for a
random arrival to supply each exhibit shape. Legacy QA is a copy of such a
frozen encounter omitting its optional exhibit/teachingPoint/rationale fields,
as covered by the new integration tests; do this only in the disposable QA
campaign. The Level 3 goal spec's fixture sets Level 3 without weeks of play.

Check at 1366x768 and 1024x768 laptop widths, then 390x844 phone width:

1. **Placement/time:** open a short chart; increase desktop viewport height
   if needed until its natural content is shorter than the desk. Its top
   should align with the desk top and its center with the desk center, subject
   to play-area edge clamping. Reduce available height or reveal feedback/
   all-choice rationales until content is taller than the desk: it should
   retain the previous bottom pin and grow upward over the map. Close the
   reveals/flip front-back/switch patients and resize: no stale pin, stretching,
   jumping between pins, or ResizeObserver loop errors. The sheet remains
   content-sized on desktop, with one vertical scroll. With tutorials off and
   facility time running, opening or revealing the chart must leave time
   running. Existing phone full-sheet behavior is retained.
2. **Exhibits:** reach each of table/keyValue/abstract in the patient and team
   scenarios above. Confirm Teaching dataset appears in the story column;
   captions, table row/column labels, values and abstract prose remain readable.
   At phone width the story stacks above decisions and the table scrolls
   locally if needed, without page overflow or clipped labels. Prose uses the
   read font; labels/controls use the pixel font. If multiple visited nodes
   have datasets, their decision headings distinguish them.
3. **Feedback:** answer one item incorrectly: question/answered rows remain,
   teaching point comes first, then Why not your pick and its rationale.
   Show all choices reveals every choice; each Why this choice opens/closes
   its own rationale. Hide other choices restores the compact rows. Repeat
   with a correct answer (Why this answer), reopened past chart, team
   discussion Continue/File discussion, and legacy QA (saved explanation and
   no empty rationale controls). No answer-key/rationale text appears before
   submission. Existing number keys, Enter, Escape and focus remain usable.
4. **Goals:** in the fresh Level 3 fixture, confirm all four main goals are
   readable, the operation setup disclosure still works, and the optional
   quality-review chip occupies only one line in the bottom control area.
   Hover and keyboard-focus the chip: the full original objective and
   progress appear in an unclipped tooltip; also check phone touch focus.
   For the real completion path, build/connect a Surgeon Office, hire its
   Surgeon, complete an ambulatory operation, then Fast-forward 10 min while
   the Surgeon is idle until the queued review completes. The chip changes
   0/1 -> 1/1 with its mark, without changing main goals/advancement gating.
   Main completion with the review still at 0/1 must remain valid; the current
   Level 4 preview notice is still shown instead of an implemented Level 4
   Advance action. At Level 1/2, existing Advance controls remain usable.

### Open work for manager acceptance

No product/schema question remains in this lane. Browser layout, touch/focus
and actual observer behavior still need the manager checks above. Reconcile
other lanes' full-suite failures and the pre-existing pending-label mismatch,
rerun the normal-config aggregate checks, inspect the actual shared-tree diff,
and update the central handoff/checkpoint only after acceptance. Work remains
local only.

Existing browser-test follow-up: `tests/e2e/patient-chart-density.spec.ts`
currently requires `box.left >= desk.left` whenever there is enough room on
the right, without checking content height. That is still the tall-chart
contract; a short chart now follows the owner's centered placement instead.
The manager should make that assertion conditional on natural height and add
the new top-center assertion when reviewing its browser test. That e2e file
was not edited in this worker lane. Its existing play-area/footer bounds and
content-size checks remain applicable.

## Worker handoff - training (Item 8, Sol, 2026-10-08)

### Scope and files

Completed the training lane. Changed:

- `packages/game-domain/src/employee-training.ts`
- `packages/game-domain/tests/employee-training-reachability.test.ts` (new)
- This appended handoff in `docs/execplans/owner-requests-20261008.md`

No player, shared reducer, balance, clinical-content, dependency, or save-schema
edits. The existing employee-training view model and StaffPanel already display
the domain's blockedReason, so the specific refusal copy needs no player patch.
No Git, installs, browser execution, deployment, publication, or owner browser
storage access. All work is local; the manager retains acceptance and the scoped
GitHub-backup reminder after accepting this integrated checkpoint.

### Diagnosis, reproduction, and decisions

The original quote checked a route from the employee's **current location** to
a training stool, using care-aware routing with only their **home room** allowed.
It did not substitute their assignment or home station as the starting point.
GLP-1 NPs have physical, distinct staff/primary workstation anchors in their
assigned telehealth suite; remote consultations do not make the employee remote.
Their current consultation only defers departure to the payout tick after
payment; it is not the reason for the eligibility refusal.

A realistic layout reproduces the owner's exact refusal before the fix:
Front Desk -> hallway -> Phlebotomy Room -> GLP-1 Telehealth Suite, with a
Training Room on the public hallway. Both NPs are assigned to their actual,
distinct suite workstations. Facility access is valid, both relevant rooms
are operational, the control employee can train, and the ordinary tile graph
finds a physical route. Care-aware training routing nevertheless removes the
intervening Phlebotomy Room, cutting off the suite. More doors into the same
intervening care room cannot correct that policy mismatch.

The first examination-room probe was rejected by the real fixture mask before
reaching the eligibility assertion; it was not used as bug evidence. The final
Phlebotomy Room reproduction has a verified real tile route and failed at the
training quote with exactly:
`canTrain: false, blockedReason: "An operational, reachable Training Room is required."`
The red run was captured before any implementation edit.

Training now prefers its existing public/care-aware route. If none exists,
this explicit staff assignment can traverse other built rooms through actual
doors using the same physical tile graph and fixture masks. This is a
training-only fallback: the shared care-room policy is unchanged. Quotes,
outbound movement, forecasts, and return travel use the same helper; no
NP-specific exemption, teleport, or home-location substitution was added.

Quotes and queued departure selection also require a real return route to the
assigned home station. A connected current corridor cannot conceal a disconnected
home suite, and losing the home connection after payment keeps the employee
queued rather than sending them on a trip they cannot complete.

Refusals now distinguish: no Training Room, no accessible Training Room,
accessible rooms out of service, the named employee's inaccessible current
area, no home assignment, and an inaccessible return to the named home-room
type. Unpaid refusals retain cash. Existing cash/role/max-level/duplicate guards
retain their priority.

The 15 new regressions cover both NP positions, both legal suite orientations,
payment and consultation-boundary departure, two seats, continuous physical
paths, save/reload, one level increase and return to each original workstation,
public-route preference, a current blocked fixture tile, disconnected current
areas, an isolated hallway that cannot use grass re-entry, missing/disconnected
homes, lost access after payment, and the distinct refusal messages.

### Exact validation

Only game-domain was modified among executable packages. Logs, captured intake
source, baseline-relative review diff, and source hashes are under the ignored
`.local-dev/owner-requests-20261008-training/` directory.

Pre-fix reproduction (exit 1; `reproduction-before.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/employee-training-reachability.test.ts --pool=threads --maxWorkers=1
Test Files  1 failed (1)
     Tests  1 failed (1)
  Start at  08:51:31
  Duration  2.15s (transform 1.53s, setup 0ms, import 2.04s, tests 14ms, environment 0ms)
```

Post-fix original reproduction (exit 0; `reproduction-after.log`):

```text
Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  08:53:50
  Duration  2.00s (transform 1.42s, setup 0ms, import 1.90s, tests 14ms, environment 0ms)
```

Final focused suite (exit 0; `focused-final.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/employee-training-reachability.test.ts tests/employee-training.test.ts tests/employee-training-benefits.test.ts tests/employee-training-np-queue.test.ts tests/employee-training-persistence.test.ts tests/room-upgrade-support.test.ts tests/owner-passable-door-slots.test.ts --pool=threads --maxWorkers=1
Test Files  7 passed (7)
     Tests  168 passed (168)
  Start at  08:56:25
  Duration  12.75s (transform 1.58s, setup 0ms, import 4.74s, tests 7.31s, environment 0ms)
```

Full package suite (exit 1; `domain-full.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  1 failed | 102 passed (103)
     Tests  3 failed | 3288 passed (3291)
  Start at  08:57:35
  Duration  391.95s (transform 3.01s, setup 0ms, import 43.53s, tests 338.88s, environment 6ms)
```

All three full-suite failures belong to the concurrently edited Item 9
`tests/companions.test.ts` / procedure-companion lane:

- Line 135: waitingReservation.roomInstanceId was undefined instead of "periop.qa".
- Line 165: amenityDecisionPhaseIndex was undefined instead of null.
- Line 197: procedureCompanion was undefined instead of the expected waiting_in_periop object.

These fixtures contain no employees or training requests and call retail
advancement, not the modified training quote/travel functions. No companion
files were edited here; the manager/companions worker owns these failures.

The initial workspace typecheck (exit 1; `typecheck.log`) caught the concurrent
`src/procedure-companions.ts(109,55): error TS18048: 'state.patientAmenityTrips' is possibly 'undefined'.`
That file was subsequently updated by its own lane. Both the next typecheck and
the final **post-full-suite** `npm.cmd run typecheck` passed (exit 0,
`typecheck-final.log` and `typecheck-after-full.log`). All seven workspace
packages completed their typecheck scripts without errors in the final run.

Reviewed the actual baseline-relative source diff. Both owned file hashes
remained unchanged from full-suite start through post-suite typecheck:

- employee-training.ts: `79A2A04843EDF275ED054926CFBDC7F6D6EF36D267A79178C5B1262B1B759777`
- employee-training-reachability.test.ts: `5C15A6F944F46124F34FDDF94C19EC9B3C1ADB432C3F4920FA69845C8F4D4E33`

### Manager browser QA: fresh campaign and exact checks

This worker cannot run a browser. Use a fresh campaign named **Training Item 8
QA** on the manager's separate QA origin/profile, and record `location.origin`.
For example, the manager's existing `http://127.0.0.1:5183` has separate saves.
The owner's opening pathway is unchanged: `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent browser profile. Do not replace
or reset the owner's campaign.

Reach Level 2 through Goals: Level 0 needs 10 Clinical XP, the Examination Room,
and satisfaction above 90; Level 1 needs 150 Clinical XP, Ultrasound and Minor
Procedure Rooms, an imaging technician, and satisfaction above 90. Keep these
prerequisite rooms in the north/east area so the layout below remains clear.
Use **Prototype tools -> Add $100** as needed for the displayed build, hire,
and training prices. Alternatively the manager may seed a newly created,
synthetic Level-2 QA campaign using its established browser-test fixture route;
the new domain test provides the exact state recipe.

Pause and build this tested layout (coordinates are top-left grid tiles):

| Object | Placement / connections |
| --- | --- |
| Existing Front Desk | Keep its original (33,28) placement and exterior entrance; add west door offset 0. |
| Public hallway | Six individual hallway tiles at x=32, y=25 through 30. |
| Training Room | (29,24), orientation 0; east door offset 1. |
| Phlebotomy Room | (29,29), orientation 0; east door offset 1 to the hallway. |
| GLP-1 Telehealth Suite | (26,29), orientation 0; east door offset 1 into Phlebotomy. No other suite exit for the first check. |

Hire **two GLP-1 NPs** into this suite; hiring should place them at the two
distinct posts. Let one facility minute run to start their first automated
consultations, then pause before requesting training. An optional receptionist
supplies the control employee.

1. Open Staff -> each NP -> Train. Each Level-1 quote must show an enabled
   **Train $150** confirmation, despite the intervening Phlebotomy Room.
   Confirm both: cash falls by $150 per request once, both show Queued / working,
   and each finishes their ongoing consultation before leaving.
2. Use **Fast-forward 10 min** during consultation waiting (at most one
   current 60-minute interval), then observe actual walking with the running
   clock. Both NPs must leave through the suite's real east door and the
   Phlebotomy Room's east door; no wall crossing, teleport, or indefinite
   refusal. They occupy distinct Training Room stools. Fast-forward through
   the baseline 60-minute seated work, then watch both return to their own
   distinct suite posts. Each becomes Level 2 once; NP income resumes when
   their next consultation completes. Room upgrades may shorten the session.
3. Repeat in another fresh QA campaign with the suite at **(27,29),
   orientation 270** and its world-east door at offset 1. Both distinct posts,
   both routes, and both returns must work in this orientation.
4. Reload once while queued and once while walking/seated. Each paid request,
   remaining seated work, seat identity and home assignment must persist;
   neither payment nor the level increase repeats.
5. After both return and their paid flows clear, pause and remove **every
   suite exit**. Ensure cash covers the displayed next training price so the
   cash guard does not mask access. Each Train popover must name the actual NP
   and say they cannot reach a Training Room from the GLP-1 Telehealth Suite;
   its confirmation is disabled, while the control employee remains eligible.
   Restore the suite east door: the NP quote should immediately recover.
6. Remove the Training Room east door: the refusal must say no Training Room
   has usable access to the clinic. Restore it to recover. In a fresh QA
   campaign with no Training Room, it must instead say to build one.
   Verify these messages wrap visibly in the confirmation without clipping.
7. Add public hallway tiles at **(26..31,28)** plus a suite north door offset 0
   in the orientation-0 layout. On the next paid training trip, both NPs must
   prefer this public route instead of traversing Phlebotomy.

Unit tests additionally verify out-of-service Training Rooms, blocked fixture
origins, a disconnected current room despite a reachable home, a disconnected
home despite a reachable current corridor, and loss of a home connection after
payment. These synthetic guards do not require inspection of an owner save.

### Open questions / acceptance

No implementation blocker remains in this lane. The exact owner's campaign
was not inspected; the manager should confirm whether its suite route crosses
another care room, then run the QA matrix and review the training-only transit
fallback. If the reported failure persists in the updated build, the needed
owner-provided debug subset is: room IDs/definitions/coordinates/orientations,
doors with room ID/side/offset/exterior, facility tick, each affected NP's
ID/role/homeRoomInstanceId/location/path/pathIndex/facilityTask/training, and
GLP-1 automation slots. No clinical encounter contents are needed.

The manager retains the three concurrent companion failures, default-config
test/browser acceptance, and the owner report. Preserve all other lanes.
- 2026-10-08: owner request: exterior frontage (grass, trees/flowers, sidewalk, planters, entrance) redesign proposal; Sol design worker launched (exterior).
- 2026-10-08: owner request: remember map zoom/pan per campaign across reloads; Sol worker launched (camera).


## Severance radiologists first

Sol worker, 2026-10-08. Completed the owner's bounded hiring-order request.
Changed only `packages/game-domain/src/characterStillCatalog.ts` (ordered
`PREFERRED_STAFF_STILL_IDS_BY_ROLE` data), `packages/game-domain/src/appearance.ts`
(staff selection), and two new regression files:
`packages/game-domain/tests/radiologist-hiring-order.test.ts` and
`apps/player/src/session/radiologistHiringOrder.test.tsx`.

New radiologists take the first free `level3-roster-v2.001` through `.004`
(Mark, Helly, Irving, Dylan). Current and departing employees reserve their
looks. A compatible saved look is retained before checking preferences; once
all four are occupied, the original seeded fallback is unchanged. Other roles,
art, saves, capacity, and clinical content are unchanged. Firing currently
removes an employee immediately and frees their look; room-sale departing
actors retain theirs until departure completes. The fifth-hire regression uses
a synthetic departing actor to preserve the existing four-reader capacity.

Hiring audit: Management > Employees renders StaffPanel; its role and open-slot
buttons dispatch the same HIRE_STAFF command. Needs-you and tip hire actions
also dispatch HIRE_STAFF through clinicAlertCommand. These surfaces have no
pre-hire candidate portraits (open slots are placeholders), so no UI source
change was needed. Tests compare selection predictions with actual hires across
all three entry points and verify Management/StaffPanel renders the assigned
avatar. Existing saved radiologists retain all 16 eligible looks.

Validation (all Vitest runs used `--pool=threads --maxWorkers=1`):
- Focused domain: **6 files / 72 tests PASS**, including 10 new regressions.
- Focused player: **4 files / 26 tests PASS**, including 3 new regressions.
- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`:
  **101 files / 3307 tests passed; 4 failures across 3 files** (451.63s).
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1`:
  **126 files / 977 tests passed; 1 failure** (54.50s).
- Post-suite `npm.cmd run typecheck`: **all seven workspaces PASS** (exit 0).

Attribution: domain failures at guidance-tip-predicates.test.ts:56 and
approved-room-geometry-migration.test.ts:110 reproduced using intake appearance
and catalog snapshots through a read-only Vite loader. The later current-tree
rerun of these plus waiting-destination-routing.test.ts passed **73/74**: geometry
and both routing failures had resolved during concurrent work; only the tip
predicate remained. Player surgeryCenterServicePreviews.test.ts:85 reproduced
identically with both intake snapshots (**12 passed / 1 failed**). These failures
belong to the shared tree, not this selection delta. No unrelated files were
reverted or fixed. The four owned source/test hashes stayed unchanged through
validation; baseline-relative source comparison permits only the preference
and staff-selection additions.

Player commands used the existing command-local
`.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload via
`NODE_OPTIONS=--import=<file URL>` for Vite's optional Windows `net use` probe.
No dependency or config changes. Exact commands/output, source.diff, control
configs, intake snapshots and hash/scope evidence are in ignored
`artifacts/logs/severance-radiologists-20261008/`.

Manager next: inspect the tiny source delta and new tests, retain the two
remaining unrelated failures, and check four sequential hires plus one rehire
in a synthetic Level-3 Reading Room. This worker used no browser or owner save.
Owner pathway remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the
usual persistent profile; manager QA origins/profiles have separate saves.
Local only: no Git commands, installs, art changes, push, deployment or
publication. After acceptance, the manager owns the scoped backup checkpoint
and the reminder to say **"push to GitHub"**.


## Layering worker handoff - item 1 (2026-10-08)

Status: implementation complete locally; presentation lane released for manager
review and the item 9 rendering handoff. Sol worker performed this bounded
milestone directly. No agents spawned, Git commands, dependency installs,
browser launches, publication, deployment, clinical edits or save changes.

### Files changed

- `apps/player/src/facility/approvedSideChairLayers.ts`: crop-local foreground
  polygons and partition data; 18 chair/bench crops plus six non-south recovery
  bed bands. South bed bands N3/N4 removed. Separate arms/posts share one
  complementary foreground image, so overlapping regions never double alpha.
- `apps/player/src/facility/approvedRoomPresentation.ts`: attach the same
  furniture bindings to Level 3 and fallback supports; honor explicitly
  authored painter layers for Reading Room and the rotated north NP chair.
  Front Desk public chair now uses its existing north-facing art direction.
- `apps/player/src/facility/FacilityScene.ts`: feed additional polygons into
  the existing pixel partition; carry the furniture mask binding through
  actor/support presentation, including renamed idle staff supports. Add the
  missing Front Desk room-instance attachment so its occupied layers reconcile.
- `apps/player/src/facility/roomTouchups.ts`: the south-facing massage recliner's
  existing front sprite now sorts with its base, below the whole sitter.
- `apps/player/src/facility/approvedSideChairLayers.test.ts`: updated crop,
  seat, pixel-partition and remaining non-south bed-band contracts.
- New `apps/player/src/facility/furnitureSeatLayering.test.ts`: ten Node tests,
  including real FacilityScene reconciliation with display-object doubles,
  bitmap/fallback occupants, multiple bench occupants, unrelated rooms,
  vacated furniture, Front Desk, renamed idle staff, and before/after evidence.
- New `apps/player/src/facility/furnitureSeatLayering.before.fixture.json`:
  56 original actor seat/floor contacts and 64 seating-related furniture
  crops/positions across 24 views, plus the 15 original mask/seat bindings.
  Mask metadata comes from the byte-exact pre-edit source snapshot; tests
  preserve the original contacts, source crops, destinations and sizes.
- This append-only plan handoff and a short append-only current-thread receipt.

### Decisions and audit findings

- Reused the existing seat-contact and furniture-split system; no art sources,
  pixels, seat coordinates, room/furniture positions, navigation, movement,
  domain state or saved encounters changed.
- South-facing recovery bed sitters N3/N4 now draw wholly above the bed,
  including legs. North/east/west beds retain the prior hanging-leg bands;
  those bands remain clear of their separate monitors.
- Verified south-facing examination/minor-procedure/ultrasound surfaces and CT
  couch already sort beneath their actors. The regression test covers all six
  south bed/table contacts at three scales and three world origins.
- Endoscopy and Ambulatory OR active procedure patients are the approved
  occupied-covered table variant, with the separate actor hidden. Endoscopy's
  seated pre/post-procedure patients use the Peri-op/Recovery beds; the N3/N4
  fix applies there. This existing occupancy policy was preserved.
- Every current rendered east/west chair or bench support was audited:
  13 supports, comprising nine armrest/bench bindings and four armless stools
  or wooden Break Room side chairs. The latter remain unsplit. Laboratory and
  maintenance benches are work surfaces with standing actors, not seats.
- Extended the existing waiting/phlebotomy/telehealth side-arm masks to include
  the near arm's support posts. Added missing Reading Room east/west arm masks.
  Added arm/back regions for Waiting Room north/south seats, the south waiting
  bench, both Front Desk chairs, south phlebotomy chair, rotated telehealth
  chairs, Surgeon Office chair and south Reading Room chair. Existing Break
  Room north chair-back layers and Reading Room southeast chair-back layer
  already provide the correct occlusion and were retained.
- South-facing massage recliner: both its base and front sprite are below
  every actor pixel. Ordinary armchairs/collection chairs retain their near
  arms in front; no central cushion or footrest region was added to their masks.
- Furniture ownership is carried by mask identity as well as the existing
  semantic support ID. Reusing a clinician seat as a staff-idle seat therefore
  retains the same mask even when its support ID changes.
- Before/after evidence: the captured N3 bed binding previously overwrote a leg
  sample at source pixel (120.5, 510.5); it is now absent. Reading northeast had
  no foreground binding; its arm/post samples now show chair pixels while the
  central body/cushion sample remains an actor. RGBA values are preserved in
  the complementary layers. These are Node evidence, not browser acceptance.

### Exact validation

Only the player package was touched. Full player suites used the unmodified
player Vite configuration and the requested threads/single-worker flags.
The initial ordinary invocation failed before tests with Vite's optional
Windows `exec("net use")` throwing `spawn EPERM`. Final runs used the already
documented command-local preload from the Alerts & Events plan:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/furnitureSeatLayering.test.ts src/facility/approvedSideChairLayers.test.ts src/facility/approvedRoomPresentation.test.ts src/facility/approvedRoomRenderer.test.ts src/facility/staffIdleSupports.test.ts src/facility/roomTouchups.test.ts src/facility/characterPauseArrival.test.ts --pool=threads --maxWorkers=1
```

Final focused output, exit 0 (`focused-final.log`):

```text
Test Files  7 passed (7)
     Tests  80 passed (80)
  Start at  09:13:15
  Duration  3.99s (transform 1.80s, setup 0ms, import 2.91s, tests 519ms, environment 0ms)
```

Full touched-package command (same command-local preload):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Final full output, exit 1 (`player-full-final.log`):

```text
Test Files  1 failed | 127 passed (128)
     Tests  1 failed | 978 passed (979)
  Start at  09:13:37
  Duration  55.84s (transform 3.35s, setup 0ms, import 29.15s, tests 14.01s, environment 8ms)
```

Sole failure, outside this lane:
`src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer". Expected pending label to contain
`Off-site thyroid fine-needle aspiration`; received the current dynamic
`The result is pending. Patient care and return are still in progress...`
label with stage timings. This failure was already recorded in the Alerts &
Events/current handoff before this work. All facility tests passed.

```powershell
npm.cmd run typecheck
```

Final root typecheck, exit 1 (`typecheck-final.log`): the player and five other
workspaces pass; game-domain alone reports:

```text
tests/tutorial-guidance-integration.test.ts(3,29): error TS2307: Cannot find module './guidance-tip-fixtures' or its corresponding type declarations.
```

That tutorial test is concurrently authored outside this lane; the referenced
fixture was absent when checked. An earlier shared-tree typecheck temporarily
reported reducer.ts TS2366; that error cleared on subsequent runs. No facility
type errors. The manager should rerun root typecheck after the tutorial handoff.

Exact logs and the pre-edit source copies are available locally:
`.local-dev/owner-layering-20261008/{focused-final,player-full-final,typecheck-final}.log`
and `%TEMP%/gamifysurgery-layering-20261008/`. No test-side file writes remain
in the final tests. The manager should also rerun ordinary/default-pool tests
in its browser-capable environment.

### Manager visual QA - fresh campaign

Browser checks were not run in this sandbox. Use a new disposable QA campaign
with Tutorial guidance off in Prototype tools, preserving the owner's campaign.
Owner opening pathway is unchanged: `START_GAME.cmd` ->
`http://127.0.0.1:4173` in the usual persistent profile. A separate QA origin
or browser profile has separate storage; it does not inherit that owner save
or the GitHub Pages save. Record the actual QA origin/profile with captures.

Use **Add $100** repeatedly to fund rooms/hiring and **Fast-forward 10 min**
to advance arrivals and services. Advance through the current Goals/Advance
requirements to Levels 1, 2 and 3; no level-unlock behavior was changed here.
Put every room on a reachable hallway with a legal door. After actors finish
walking, allow the 180 ms seat-settle to finish, then pause and zoom in.
Fast-forward can skip a desired pre-op pose, so use normal play speed when an
actor is approaching the target seat.

| State to reach | How to reach it in the fresh QA campaign | Exact visual check |
| --- | --- | --- |
| Front Desk staff/public chairs | At Level 0, seat the free founder in the public chair; hire a receptionist for the staff chair. | Public sitter faces north behind the blue chair back; receptionist sits behind the green chair's arms. Heads/shoulders remain visible. Empty chairs return to the original whole sprite. |
| Waiting Room 0, 4x3 | Unlock Level 1, build an unrotated Waiting Room; click each free chair/bench seat with the founder. Repeat with incoming adult patients/companions. | East and west adults sit on the cushion behind the horizontal near arm and its posts. Both south bench sitters remain on the cushion between the arms. |
| Waiting Room 270, 3x4 | Build a second Waiting Room using Rotate for the portrait layout; use both bench slots and the north/south armchairs. | Both east bench occupants are behind its near arm; the upper occupant stays above the bench's rear layer. North sitter is behind the chair back, south sitter behind the side arms. No full cushion crosses a torso. |
| South Endoscopy pre/post-op beds N3/N4 | At Level 2 build reachable Endoscopy and Peri-op/Recovery rooms and enable/serve endoscopy visitors. Keep north door segments N3/N4 free so both beds exist. Observe patients allocated to those beds during pre-op/recovery; fill other beds through additional procedure arrivals if needed. | Head, torso and both legs are entirely above the bed. Separate monitors may retain their own depth. Check during arrival settle, paused redraw and departure. |
| Other Peri-op bed facings | Continue procedure arrivals until S3/S4, WC/WD and EC/ED are occupied. | Their previous north/east/west hanging-leg treatment remains; no band overlaps a monitor. Opening a bed-owned door removes its bed/overlay, and closing it restores it. |
| Examination/minor-procedure/ultrasound/CT beds | Rotate Examination to 270 for its south patient seat; use ordinary care/test flows in Minor Procedure, Ultrasound and CT after their level unlocks. | The whole south sitter, including feet, remains above the table/couch. Unrotated Examination's west-facing support remains unchanged. |
| Phlebotomy 0 and 270 | At Level 2 build both 3x2 and rotated 2x3 stations and run an incoming collection service in each. | East patient's near arm/posts cover only the matching side of the body; south patient's arms are beside/in front of the body, while the central cushion/footrest stays behind. Armless clinician stool has no foreground mask. |
| Telehealth 0 and 270 | Build each suite orientation at Level 2; hire/assign two GLP-1 NPs and wait for each to reach its workstation. | East/west arms cover the seated body at the near side; rotated north NP stays behind the chair back, south NP behind the arms. Neither actor is hidden by the entire chair. |
| Break Room table seats and massage recliner | At Level 3 build Staff Break Room; click each free founder seat, including both side chairs and the massage seat. | Wooden east/west chairs are armless; table edges retain their prior depth. North chair backs remain in front. South massage sitter, including both legs, draws entirely above the recliner and its footrest/front sprite. |
| Surgeon Office normal and idle seat | At Level 3 hire/assign a surgeon to the office; observe the office seat and the idle desk seat after the route finishes. | Both support identities put the surgeon on the same cushion behind the chair arms, with no shift in seat contact. |
| Reading Room four seats | At Level 3 build the Reading Room and assign radiologists to occupy all four workstation slots. | Northeast west-facing and southwest east-facing sitters are behind the near arm/posts. Northwest south arms cover the sides only. Southeast retains its chair-back layer. Approved desk/island edges still cover the appropriate body portions; no arm rectangle paints desk/background over a head. |

Repeat the side-chair checks with average and larger adult identities, and the
Waiting Room with a smaller identity. Compare at default zoom and close zoom.
Check occupied/empty transitions, Pause/resume, room redraw/rotation, and a
walker passing beside an occupied chair: there should be no doubled outlines,
missing arm edges, mask left on an empty chair, room-to-room ownership leak,
or sudden seat/contact shift.

### Remaining integration notes / questions

- Visual mask acceptance remains with the manager; this sandbox cannot verify
  actual browser texture loading, character-width intersections or lighting.
- The pediatric Waiting Room mockup is the pediatric worker's separate lane.
  It does not use these runtime approved-room draw records.
- The concurrent companions worker has now defined eight
  `companion.NW.north/.west, NE.north/.east, SW.west/.south, SE.east/.south`
  armchairs in balance data. They are not yet furniture draws/supports in this
  runtime presentation. When item 9 gets its rendering handoff, bind those new
  furniture instances to this same crop/polygon system; this audit covers the
  currently rendered seats, not unseen future instances.
- No design approval is requested by this worker. Manager acceptance includes
  inspecting the actual scoped diff, resolving the shared tutorial typecheck
  failure, and the visual matrix above. The milestone remains local only;
  the manager owns the GitHub checkpoint reminder and any authorized backup.
- 2026-10-08: Severance radiologists first ACCEPTED by manager: diff is the ordered PREFERRED_STAFF_STILL_IDS_BY_ROLE list plus a 4-line preference check after the saved-look branch in selectStaffStillId; focused 72+26 PASS; full-suite failures attributed to concurrent work (recheck after the batch lands, incl. guidance-tip-predicates.test.ts:56).


## Remember map camera

Sol camera worker, 2026-10-08. Implementation complete in the assigned
canvas/session lane; manager diff review and browser acceptance remain.

### Files and behavior

- `apps/player/src/session/facilityCameraPreference.ts` (new): versioned,
  origin-local presentation preferences keyed by campaign ID;
  `gamify-surgery.prototype.facility-camera.v1:<encoded campaign ID>` stores
  only `{schemaVersion: 1, camera: {zoom, panX, panY}}`. Writes debounce for
  250 ms and flush synchronously on pagehide, beforeunload, hidden visibility,
  unmount, Save and pause, and campaign switching. A small in-memory cache
  preserves switching even when browser preference storage is unavailable.
- `apps/player/src/session/usePrototypeSession.ts`: initializes from the
  campaign preference or the existing default, routes both scene gestures and
  existing header zoom buttons through the preference writer, restores the
  selected campaign, and discards pending camera writes before campaign reset.
  Exact camera hunks only; concurrent tutorial replay/pause edits preserved.
- `apps/player/src/facility/FacilityCanvas.tsx`: uses Phaser's existing
  POST_STEP event to reconcile the requested camera after the scene is active
  and the host has positive dimensions. Rechecks on camera/campaign changes,
  resizing, and relevant facility/founder geometry changes. Sends a clamped
  camera back through the existing callback and cleans up the event listener.
- `apps/player/src/facility/facilityCameraBounds.ts` (new): finite-data guard
  and bounds derived from current scene geometry, current viewport, current
  grid size, founder focus, wall envelope and exterior bands. Retains legal
  fractional pan and clamps zoom to the existing 0.1--2.5 range.
- `apps/player/src/facility/defaultCamera.ts`: documentation only; the default
  function's behavior is unchanged (isolated Level 0 desk: 1.1, others: 1;
  zero pan). Missing, malformed, unsupported-version or nonfinite camera data
  uses that same default without rewriting the malformed stored entry.
- `apps/player/src/session/facilityCameraPreference.test.ts` (new): round
  trip per campaign, latest-value debounce, switching before debounce,
  missing/invalid fallback, immutable snapshots, independent origin stores,
  blocked/quota storage, pagehide/beforeunload/hidden/unmount flushing, and
  pending-write discard on reset. Asserts camera writes leave whole-profile
  storage and serialized game/FSRS bytes unchanged.
- `apps/player/src/facility/facilityCameraBounds.test.ts` (new): legal camera
  preservation, limits, resized/grown/small facilities and missing-founder
  focus. Compares the helper against the actual current
  `FacilityScene.calculateLayout` using a DOM-free Phaser Scene mock.

`FacilityScene.ts` was never edited by this worker. No deterministic domain,
FSRS, save-schema, clinical content, tutorial guidance, art, launcher, or
origin changes. `prototypeStorage.ts` and `localCampaignRepository.ts` were
read to verify conventions; neither needed edits. The camera is intentionally
an independent small UI-preference entry (like the existing workspace split),
so moving it cannot serialize/rewrite whole campaigns or merge another
campaign's preference metadata. No migration is necessary; archive/resume
retains the preference through the stable campaign ID. Other origins/profiles
use separate localStorage; no synchronization is attempted.

### Validation and exact output

Commands ran from the repository root; no installs or Git commands.

The unmodified focused test invocation first failed before tests loaded with
Vite's Windows `optimizeSafeRealPathSync -> exec("net use") -> spawn EPERM`.
As in prior worker handoffs, subsequent Vitest commands used an ignored,
command-local NODE_OPTIONS preload, not a configuration/dependency change:
`artifacts/logs/remember-map-camera-20261008/vite-net-use-preload.cjs`.
It preserves normal exec calls and only turns synchronous EPERM on that
optional probe into Vite's already-supported asynchronous error callback.
The prior NODE_OPTIONS value was restored after each invocation. The manager
should rerun tests without this preload in its ordinary environment.

Focused final command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 src/session/facilityCameraPreference.test.ts src/facility/facilityCameraBounds.test.ts src/facility/defaultCamera.test.ts src/session/prototypeStorage.test.ts src/session/localCampaignRepository.test.ts
```

Exact final summary (exit 0):

```text
 Test Files  5 passed (5)
      Tests  93 passed (93)
   Start at  09:23:39
   Duration  4.29s (transform 1.69s, setup 0ms, import 3.23s, tests 597ms, environment 0ms)
```

Full required player command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Exact final summary (exit 1):

```text
 Test Files  1 failed | 130 passed (131)
      Tests  1 failed | 1024 passed (1025)
   Start at  09:24:14
   Duration  56.13s (transform 3.06s, setup 0ms, import 29.64s, tests 13.90s, environment 9ms)
```

The sole failure is the previously recorded unrelated pending-label
expectation at `apps/player/src/session/surgeryCenterServicePreviews.test.ts:85:52`:

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

This same assertion/failure is attributed in the prior Alerts & Events and
layering handoffs. The camera lane did not edit this test, chart viewModels,
clinical/service timing, or its domain fixtures. All new camera tests pass.

Required root command `npm.cmd run typecheck` was run twice; final exit 1.
Player and the other five non-domain workspaces have no errors. Sole final
compiler error in the concurrent radiologist-income lane:

```text
tests/radiologist-read-income.test.ts(274,5): error TS2322: Type '4' is not assignable to type '0 | 1 | 2 | 3'.
```

The actual current line assigns `f.state.facilityLevel = 4`; the domain level
union stops at 3. This worker did not alter that file. Dedicated player command
`npm.cmd run typecheck --workspace @gamify-surgery/player` exited 0 with:

```text
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Full captured output, initial baselines, camera-only delta and final source
hashes are in ignored `artifacts/logs/remember-map-camera-20261008/`:
`focused-tests.log`, `full-player-tests.log`, `typecheck-final.log`,
`player-typecheck.log`, `camera-only.diff`, `final-source-hashes.json`.
`scoped-baseline.diff` also shows concurrent tutorial changes since intake;
those changes are excluded from `camera-only.diff` and were preserved.
No tests/default configuration or unrelated failures were changed to force
passing results.

### Manager browser verification

Use a synthetic campaign in the manager's established separate QA origin,
for example `http://127.0.0.1:5183`, in one persistent browser profile. Record
`location.origin`. QA 5183 has its own saves and camera entries; it does not
restore the owner's 4173 storage. The owner opening pathway is unchanged:
`START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the usual persistent profile.
The worker did not open a browser or access the owner's browser storage.

1. With no camera key, open an isolated Level 0 desk and an expanded/later
   clinic: their existing defaults should look unchanged. Pan and zoom using
   both the wheel/gesture and header buttons. Reload/resume after 250 ms;
   the same view should return without a jump to the default.
2. Pan/zoom again and refresh immediately (before 250 ms), then repeat with
   Save and pause and closing/reopening the tab. The latest view must survive.
   Switching the page to hidden must flush too, with no unload confirmation.
3. Give campaign A and campaign B visibly different views. Switch A -> B -> A,
   including immediately after a change, and reload each; each must retain
   its own camera. New campaigns must begin with the existing default.
4. Save near a pan limit, change window dimensions/map split, reload, and
   return to the campaign. Repeat after expanding the synthetic facility or
   moving the founder desk. The view must stay within current bounds, and
   zoom/drag controls must remain responsive at both limits.
5. On the synthetic campaign only, replace its camera entry with malformed
   JSON or `{schemaVersion:1,camera:{zoom:1,panX:null,panY:0}}`: reload must
   use today's default and remain playable. Then try a valid finite camera
   with zoom 99 and large pan: after scene readiness it must clamp to zoom
   2.5 and the current site edges. Repeat with zoom 0.001 (clamps to 0.1).
6. Test the same campaign ID at another QA origin/profile only if desired:
   it must not inherit the first origin's camera. Keep the owner's saves
   and profile intact.

### Open risks / next action

No camera implementation blocker remains. The bounds helper mirrors scene
layout math to keep out of the active rendering lane; its regression tests
compare the two directly and will detect future drift. Manager acceptance
still requires the browser matrix, actual scoped-diff review, ordinary test
rerun, and tracking/fixing the two unrelated validation failures above.
This lane is released for review. Local-only checkpoint; the manager owns the
GitHub backup reminder (owner says **"push to GitHub"**) and any authorized
backup. No push, publication, deployment, cross-origin sync or install occurred.
## Companions worker handoff — item 9 (2026-10-08)

Sol worker, assigned companion/waiting/domain seating lane. Domain/configuration
implementation is complete; the final full-domain rerun is running as this
section is appended. Its final result is appended below before worker handback.
The manager retains rendering integration, browser acceptance, the central
handoff and any GitHub checkpoint. No agents were spawned. No Git commands,
installs, deployment, clinical content, artwork or FacilityScene edits were made.

### Files changed

- `packages/game-domain/src/reducer.ts`: exact waiting-selection/reseating edits.
- `packages/game-domain/src/retail-operations.ts`: eligibility, creation and flow dispatch.
- `packages/game-domain/src/procedure-companions.ts` (new): phase flow, waiting reservations, seeded amenity trips and save normalizer.
- `packages/game-domain/src/types.ts`: optional `ProcedureCompanionState` on external actors.
- `packages/game-domain/src/persistence.ts`: preserve the optional new flow on reload.
- `packages/game-domain/src/spatial.ts`: visible companion-seat lookup and corner-door clearance.
- `packages/game-domain/src/retired-service-history.ts`: keep a saved departed companion's duplicate guard while its service visit remains active.
- `packages/game-domain/tests/companions.test.ts` (new).
- `packages/game-domain/tests/waiting-destination-routing.test.ts`.
- `packages/balance-config/src/approved-room-layouts.ts`: eight companion-only Periop chairs, solids, endpoint contacts and door ownership.
- `packages/balance-config/src/schema.ts`: optional companion-seat metadata with unique/separate-contact validation.
- `packages/balance-config/src/approved-room-layouts.test.ts`.
- This appended section of `docs/execplans/owner-requests-20261008.md`.

Only waiting-related hunks of shared `reducer.ts` belong to this worker. The
concurrent guidance import/commands/acknowledgement changes are preserved and
belong to the tutorial worker. Existing retail tests were not changed. A local
baseline comparison is in `.local-dev/owner-requests-companions/owned-review.diff`;
it includes concurrent shared-file hunks and is **not** a staging manifest.

### Implementation and decisions

1. Waiting allocation already scanned all Waiting Rooms. Fixed two gaps: it
   could reserve an unreachable indoor chair from a nonempty sidewalk-only
   route, and reseating excluded every result/service waiter. Selection now
   requires an operational room and a path ending at the actual spot. Stationary
   onsite external-processing patients and resource queues without a room/bed
   claim can reseat into another room, including resolved terminal-procedure
   queues. Active clinical work, frozen patient/offsite travel and other movement
   retain ownership. No frozen test duration/meaning is changed.
2. Only `income.endoscopy`, `income.advanced_endoscopy`,
   `income.ambulatory_operation`, `income.ambulatory_operation_extended` and
   `income.pediatric_consult` create new companions. Minor procedures and
   biopsies no longer create them. Existing markerless saved companions keep
   their prior follow/public-wait/retail/departure flow and are not deleted or
   teleported. Service and encounter identity guards prevent replacements;
   history retirement retains guards for active service visits.
3. New periop-bed-flow procedure companions enter from the street and reserve a
   free chair in the **patient's** Periop room, preferring proximity to the bed.
   If no chair is free they reserve a distinct standing spot in that room and
   retry chairs each tick. Before a bed/room is assigned they may wait publicly.
   They may enter only the linked Periop care room, not procedure suites or other
   patients' care rooms.
4. At most one seeded amenity decision per procedure phase, after arrival in
   Periop. It reuses the existing editorial `idleActionChancePercent` and idle
   dwell range. Only existing operational/reachable bathroom, coffee, vending,
   garden or gift-shop instances participate; no rooms or art are created.
   Return routing must also exist. Chairs are released during an excursion.
   They return after dwell or when the procedure phase ends, wait through PACU,
   then start leaving when the patient physically clears the Periop room. A
   patient can finish first without removing its trailing companion. Stationary
   dwell/blocked time is not accumulated as instant travel on return.
5. `COMPANION_VISIT_POLICIES["income.pediatric_consult"]` records
   `kind: "pediatric", parentMustStayWithPatient: true`, with a comment that the
   future parent spot stays in the child's room at all times. Pediatric rooms
   are not implemented; no pediatric room-following behavior is claimed. That
   policy does not use the procedure amenity state machine.
6. Existing patient waiting anchors, eight bed IDs/endpoints, workload capacity,
   staff post, clinical timing and save version remain unchanged. Adding solid
   corner seats initially exposed a migration regression: paired coarse-grid
   chairs isolated corner doorways. The domain now preserves the sub-tile
   diagonal door approach while keeping chair contacts out of ordinary transit.
   All 24 Periop wall slots and existing geometry migration tests pass.

### Rendering handoff (required; no renderer changes in this lane)

`PERIOP_COMPANION_SEATS` / `definition.navigation.companionSeats` provide stable
IDs, local integer anchors and facings. Use `getRoomCompanionSeats(room,
definition, doors, rooms, getDefinition)` for visible world-space seats; it also
recognizes a matching physical opening owned by a neighboring room. Use these
same fixtures/door rules for the furniture draw and seated actor attachment.

| Seat ID | Local anchor | Facing inward | Hidden at door slot |
| --- | --- | --- | --- |
| `companion.NW.north` | (1, 0) | south | north 1 |
| `companion.NW.west` | (0, 1) | east | west 1 |
| `companion.NE.north` | (4, 0) | south | north 4 |
| `companion.NE.east` | (5, 1) | west | east 1 |
| `companion.SW.west` | (0, 4) | east | west 4 |
| `companion.SW.south` | (1, 5) | north | south 1 |
| `companion.SE.east` | (5, 4) | west | east 4 |
| `companion.SE.south` | (4, 5) | north | south 4 |

The fixture's continuous floor footprint is anchor + (0.15, 0.15), size
(0.7, 0.7); its conservative solid/endpoint grid mask owns the anchor tile.
Keep the corner-to-interior diagonal aisle clear at corner doors.

Approved armchair art exists for **all four facings**:

- east/west: `art/rooms/gs015-v1/waiting/south.webp`, approved frames
  `chairEast` / `chairWest`; crop metadata in
  `tools/room-design/waiting-layout/atlas.json`.
- north/south: `art/rooms/gs015-v1/waiting/west.webp`, approved frames
  `chairN` / `chairS`; crop metadata in
  `tools/room-design/waiting-layout/west-atlas.json`.

No missing facing and no art creation. Reuse approved extraction/support scale
and the layering worker's existing front-armrest crop/polygon mechanism.

The renderer needs:

1. Eight chair furniture draws in each Periop room, with the visibility rules
   above and a seated support/contact for each stable seat ID.
2. A small bridge from `state.retailExternalActors[].procedureCompanion` through
   `session/viewModels.ts`'s `retailExternalActors` mapping and
   `facility/types.ts`'s `FacilityRetailExternalActorView`. Current mapping
   drops that optional state. Pass waiting room/seat ID, reservation kind/spot
   and phase, or derive an equivalent verified seat support there.
3. Seated pose/facing only for an actor stationary at a visible reserved chair
   while `phase === "waiting_in_periop"`. A chair reservation en route does
   not mean the walker is already seated. Standing reservations, amenity travel
   and departures use floor poses. North/south poses use the matching approved
   sit stills; east/west sitters use the armrest overlay from the layering lane.
4. Draw companions in Periop with their own chair support, never with a patient
   bed support. Clear the chair attachment on departure, excursion, door change
   or room change. Keep current patient/bed/staff draw order responsibilities
   with the layering worker.

### Validation completed so far (exact output summaries)

Each ordered milestone was focused-tested before proceeding. Final focused
coverage includes all those milestones plus migration, doorway and history
regressions. The following commands use the mandated thread pool and one worker.
Full transcripts are in `.local-dev/owner-requests-companions/`.

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/waiting-destination-routing.test.ts tests/companions.test.ts tests/founder-seats-and-reseating.test.ts tests/retail-operations.test.ts tests/approved-room-geometry-migration.test.ts tests/owner-passable-door-slots.test.ts tests/retired-service-history.test.ts --pool=threads --maxWorkers=1
Test Files  7 passed (7)
     Tests  102 passed (102)
Start at  09:22:39
Duration  8.47s (transform 1.88s, setup 0ms, import 4.85s, tests 2.98s, environment 0ms)

npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
Test Files  7 passed (7)
     Tests  67 passed (67)
Start at  09:19:09
Duration  1.24s (transform 107ms, setup 0ms, import 545ms, tests 42ms, environment 0ms)

npm.cmd run typecheck
tests/radiologist-read-income.test.ts(274,5): error TS2322: Type '4' is not assignable to type '0 | 1 | 2 | 3'.
```

The typecheck failure is in the concurrently added radiology-income test,
outside this lane. The earlier tutorial `guidance-tip-fixtures` import failure
has disappeared. Own-source/type errors encountered during implementation
were fixed, with focused tests repeated. The initial full-domain snapshot
included our now-fixed corner-door migration and unreachable-street-seat
regressions; it is superseded by the final full-domain result below.

### Manager browser QA: exact states and routes

This sandbox cannot run a browser. Owner pathway stays
`START_GAME.cmd` -> `http://127.0.0.1:4173` in the same persistent profile.
Use the manager's **separate QA origin** with `/?prototype-tools=1` and **New
Campaign** (or `startClinic` from `tests/e2e/helpers.ts`). Record `location.origin`.
QA storage does not carry the owner's 4173 saves. Disable guidance for this QA
campaign if it obscures the map. `Prototype tools` -> **Add $100** funds rooms/
staff; **Fast-forward 10 min** advances the real flow. Pause at phase boundaries
for screenshots. Do not fast-forward through the whole procedure and miss the
return/PACU distinction.

For deterministic capacity/phase captures, seed only that fresh QA campaign's
serialized state in `gamify-surgery.prototype.profile.v1`, preserving its
campaign ID. Reuse the exact fixtures/actor records in
`tests/companions.test.ts` (`procedureFixture`, `addOperation`, `settleCompanion`)
and `tests/waiting-destination-routing.test.ts`, rather than changing production
content or the owner's campaign. Keep captures paused; for a normal live full
procedure, build/connect Endoscopy + Periop at Level 2, hire both nurses and an
endoscopist, and allow scheduled appointments. The staffed fixture geometry is
also in `tests/level-two-endoscopy.test.ts: stateWithEndoscopy`.

| State to reach | How to reach it in fresh QA | What to inspect visually |
| --- | --- | --- |
| Waiting Room A full, B has free chairs | Use the two-room routing fixture: A at (29,28), B at (24,28), hallway x=28/y=28..30; clear west/east offset-2 openings connect them. Fill A's three available chairs at (30,28), (31,28), (29,29); leave B free. Add an arriving waiter and a stationary external-result or procedure-resource waiter at (30,30). Resume/Fast-forward briefly. | Both choose B's available chairs before standing; walks actually end at chairs; reservations/sitters do not duplicate. Frozen result due time is unchanged. |
| Pre-op companion | Use the procedure fixture: Periop (38,26), west offset 2; N3 patient endpoint (40,28), `periopBedFlowVersion: 1`, phase index 0. Or wait for a fresh scheduled endoscopy's pre-op phase. | Companion enters by the sidewalk/doors and sits at a free inward-facing chair near the patient. It never sits on a bed or on top of the patient; all four chair facings have proper seat/armrest layering. |
| Door hides a chair | In Build Mode put a door at each table slot above, including a doorway owned by the neighboring room; then remove/rebuild it. Also try corner door offsets 0/5 on each wall. | Only the doorway chair is hidden/unavailable; the actor leaves that support by walking to another chair/standing spot. Corner door approaches remain passable. No invisible occupied chair, furniture flicker or stale armrest overlay. |
| All visible chairs reserved; overflow stands | Reuse the nine-companion seating fixture for a paused capacity capture. For a normal eight-bed setup, open doors at chair spots (e.g. north 1 and north 4) to reduce chairs while keeping bed slots, then fill procedural visits. | Claims are distinct; excess companions stand inside Periop, away from beds, staff post and doors. Free a chair by letting one companion depart: the standing companion walks over and sits. |
| Procedure amenity trip and return | Add reachable coffee at (38,24), open Periop north offset 0. In the deterministic fixture set procedure phase index 1 and force the QA-only idle chance to 100; restore/default production chance is unchanged. In normal play observe several procedural visits (chance is seeded and may decline a trip). Remove/disconnect the amenity in a separate capture. | No trip during pre-op/PACU. During procedure, actor walks to an actual amenity and returns after dwell or procedure end. No invented room, instant jump after dwell, procedure-suite entry or duplicate bathroom user. Missing/broken/unreachable amenities are skipped. Reload during the trip: same actor, phase, route and decision. |
| PACU, then physical discharge | In the fixture set phase index 2 with patient at (40,28), then status `discharging` while the patient stays there. Finally move the patient outside the room; or observe the same real appointment after recovery. | Companion returns to Periop and stays until the patient physically leaves PACU, then walks out with/trailing the patient. Finishing the primary first does not delete a visible trailing companion. Reload while waiting/departing. |
| Excluded visit / saved companion | New minor-procedure/biopsy/lab/imaging visits; compare with the saved markerless companion fixture in the eligibility tests. | No new companions on excluded visits. A saved old companion continues and walks out normally; no duplicate/recreated companion. Pediatric parent-room visuals are deferred until pediatric rooms exist. |

### Open questions and acceptance

No new product/design approval is requested. Required remaining work is the
renderer bridge/furniture/support listed above, actual browser/texture/layering
acceptance and manager reconciliation of concurrent full-suite/typecheck
failures. The domain room rule deliberately reserves the patient's own Periop
room; it never invents an amenity or borrows another patient's care room.
Pediatric room/parent-spot behavior is a documented future seam only.

This valuable state is local only. After accepting the integrated batch, the
manager should update `docs/handoffs/CURRENT_THREAD_HANDOFF.md` and carry the
owner checkpoint reminder to say **"push to GitHub"**. This worker has no commit,
push, release or deployment authorization.


- 2026-10-08: Remember map camera ACCEPTED by manager after browser test on QA origin 5183: zoom 110% -> 140% plus drag-pan, reload, Resume: 140% and identical framing (before/after crops match except pause overlay and tutorial coach). FacilityScene.ts untouched.
- 2026-10-08: owner request: peri-op nurse attention queue (15 min pre-op + 15 min post-op per patient, queued across nurses, nurse stands at patient, extends phase only when backed up, idle nurses take breaks). Brief written; launches after the companions worker finishes (same peri-op flow).

### Companions final validation completion — 2026-10-08

This completes the validation entry above. The final full-domain run used the
finished companion/waiting/seating implementation; no lane source was changed
after it began. All companion, waiting, geometry, door and history suites passed.
Other workers continued changing the shared worktree during this run.

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  2 failed | 104 passed (106)
     Tests  3 failed | 3348 passed (3351)
Start at  09:22:49
Duration  438.83s (transform 2.57s, setup 0ms, import 46.88s, tests 381.82s, environment 7ms)
Exit code: 1
```

The three failures are in untouched tests for the concurrent radiologist-income
lane, with no companion creation or periop-room work in those fixtures:

```text
FAIL tests/diagnostic-service-operations.test.ts
  runs four reading desks concurrently and serializes a fifth study on its frozen desk
  AssertionError: expected 145 to be 120 // Object.is equality
  tests/diagnostic-service-operations.test.ts:212:32

FAIL tests/diagnostic-service-operations.test.ts
  a legacy whole-room read blocks every new desk without a processing timeout
  AssertionError: expected [ 40, 5 ] to deeply equal [ 40 ]
  tests/diagnostic-service-operations.test.ts:240:87

FAIL tests/employee-training-benefits.test.ts
  retains paused room.reading processing through nominal due and reload, then waits for the actual return/completion witness
  AssertionError: expected [ { …(12) } ] to have a length of +0 but got 1
  tests/employee-training-benefits.test.ts:537:43
```

Source inspection attributes these to the new read payment: the service engine
calls `creditRadiologistRead` for interpretation with `readIncomeFee`, while
these tests still assert no income/receipts after completed interpretation.
The first receives five $5 read payments; the second receives a new $5 payment
alongside its legacy $40 payment. The training test's failure is its final
post-completion zero-receipt assertion. The radiology worker/manager must
reconcile the new payment contract and these expectations; this worker did not
change that lane or weaken its tests.

A recheck after the concurrent radiology/persistence edits confirmed the same
three failures and passing companion/waiting tests:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/diagnostic-service-operations.test.ts tests/employee-training-benefits.test.ts tests/companions.test.ts tests/waiting-destination-routing.test.ts --pool=threads --maxWorkers=1
Test Files  2 failed | 2 passed (4)
     Tests  3 failed | 80 passed (83)
Start at  09:34:42
Duration  12.20s (transform 1.67s, setup 0ms, import 3.30s, tests 8.56s, environment 0ms)
Exit code: 1
```

The latest root typecheck **passes**, superseding the earlier concurrently
invalid radiology test value recorded above:

```text
npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit code: 0
```

Final transcripts: `.local-dev/owner-requests-companions/domain-final-complete.log`,
`post-suite-concurrent-check.log` and `typecheck-complete.log`, alongside the
focused 102/102 and full balance-config 67/67 logs cited above. The actual
baseline diff and new files were reviewed; concurrent shared-file edits remain
preserved. No worker-owned validation failure remains. The lane is handed back
for manager diff acceptance, the specified rendering integration and browser
matrix, and aggregate radiology validation reconciliation. All work remains local.

- 2026-10-08: GitHub backup pushed and verified: 76f0fdb8 on origin/beta (archive artifacts/checkpoints/manager-accepted-20261008/).


## Tutorial worker handoff - Item 6 (2026-10-08)

Worker: tutorial, GPT-6.1 Sol, session `01a11b8d-77a1-7a43`. Implemented the
owner-approved proposal M1-M5 in order, with milestone checks below. Worker
implementation and focused validation are complete; manager diff acceptance,
browser execution and owner pacing/tone acceptance remain. No agents, Git,
dependency installation, browser, launcher, deployment, publication or clinical
content edits were performed.

### Behavior and compatibility decisions

- Four state-derived milestones: First visit, Timed visit, First room, Open for
  business. Real admission, chart opening, answer, native feedback action,
  physical care/return, filing, paid construction, functional access and manual
  Advance determine the coach. There is no saved numeric step cursor, forced
  chart flip, Got It, Next, chore card or terminal Complete tutorial control.
  Failed actions retain the appropriate beat; early Build points back to its
  native Done / Save instead of a hidden chart action.
- `tutorialGuidanceByCampaign[id]` is additive version 2 metadata, with
  `guided|off|complete` and compatibility exposure IDs. Local profile schema 2,
  IndexedDB metadata schema 1 and game-state schema 9 remain unchanged. Skip and
  Show guidance here affect only the active clinic; the historical default is
  retained separately. Advanced campaigns normalize to complete without
  fabricating a missing protected visit or showing a late completion overlay.
- Legacy acknowledgement fields remain readable. Their Management/litter/water
  receipts map to exposure, never usage. Retired tutorial pauses cannot be
  acquired again. Reconciliation persists the honored running/paused state
  before deleting its owner, defers under Build/Management/Help, and conservatively
  preserves an explicit ambiguous legacy owner as a pause. Interrupted release
  is idempotent. Deliberate pause remains paused.
- The coach has one optional Skip guidance button and a 340px preferred width.
  Existing target highlighting, avoidance, responsive docking and positioning
  remain. The single optional Management pointer during actual off-site waiting
  retires after six visible seconds or actual Management use; it never pauses
  or requires acknowledgement.
- Help contains six short reference topics, restores its previous pause/focus
  on Escape/close and marks itself modal only while open, so chart keyboard
  controls are blocked only then. Replay saves and pauses the current clinic,
  reads the current profile ref, and opens a separately named ordinary clinic;
  the previous clinic stays resumable, with its history intact.
- New Campaign goes directly to the combined names/avatar/guidance form.
  Guidance defaults On. The form displays the configured real starting cash
  ($120) and the approved line, "Grandpa left you options. You chose overhead."
  Duplicate validation, one-time initialization, resume/archive/restore and the
  no-campaign rich-and-happy branch remain.
- Coach and tips share `alertHumor.guidanceTips.topicActivity`, with exposure
  and successful native usage recorded independently. Thirteen mechanical
  topic IDs map to the existing forty catalog IDs; no new tip catalog/cadence
  was added. Delivery and active feed rows yield to overlapping coach topics;
  chart decisions/feedback, Help, Build and Management defer ordinary delivery.
  Actual urgent Needs-you items remain independent. Cadence, cooldowns, receipt
  history, staffing coverage suppression and current price/eligibility remain
  in the existing tips engine. Filing both Level-0 visits automatically unlocks
  the compatible Alerts acknowledgement; level >=1 is the historical missing-
  second-visit path. Existing humor deadlines/history are preserved.
- Guide completion is automatic after the native Advance action and publishes
  one quiet introduction to Waiting/Existing, Needs you and Around the clinic.
  Guide off/completion does not disable later tips or humor. No gameplay web
  fetch, AI call or sound was added.
- Protected clinical visits, frozen cases, randomized choices, settlement and
  learning identities, honest wrong/mixed/correct scores and all clinical review
  statuses remain unchanged. Copy authored here describes UI/mechanics only.
  Natural unit and browser scenarios do not grant free money or install an
  advanced state to bypass graduation.

### Files changed

Player session runtime:
`apps/player/src/session/tutorialViewModels.ts`, `tutorialGuidance.ts` (new),
`tutorialTipsIntegration.ts` (new), `dailyRoutineTutorialPause.ts`,
`prototypeStorage.ts`, `localCampaignRepository.ts`, `usePrototypeSession.ts`,
`alertViewModels.ts`, `alertsEventsViewModel.ts`.

Player UI/runtime integration:
`apps/player/src/ui/TutorialCoach.tsx`, `HelpDialog.tsx`, `HelpDialog.css` (new),
`OpeningSequence.tsx`, `OpeningSequence.css`, `types.ts`,
`apps/player/src/App.tsx`, `AppShell.tsx`, `styles/global.css`.

Player tests:
`apps/player/src/session/tutorialViewModels.test.ts`, `tutorialGuidance.test.ts`
(new), `tutorialTipsIntegration.test.ts` (new), `dailyRoutineTutorialPause.test.ts`,
`prototypeStorage.test.ts`, `localCampaignRepository.test.ts`,
`apps/player/src/ui/HelpDialog.test.tsx` (new), `OpeningSequence.test.tsx` (new),
`visualComponents.test.tsx`.

Domain integration:
`packages/game-domain/src/guidance-topics.ts` (new), `guidance-tips.ts`,
`guidance-tip-suppression.ts`, `guidance-tip-types.ts`,
`guidance-tip-persistence.ts`, `types.ts`, `index.ts`, `reducer.ts`;
`packages/game-domain/tests/tutorial-guidance-integration.test.ts` (new) and
`guidance-tip-predicates.test.ts` (fresh-Level-0 predicate fixture).

Browser contract:
`tests/e2e/helpers.ts`, `tutorial-helpers.ts` (new),
`tutorial-completion.spec.ts`, `tutorial-graduation.spec.ts`,
`tutorial-daily-routines.spec.ts`, `tutorial-positioning.spec.ts`,
`hud-sidebar-tutorial.spec.ts`, `fresh-campaign-examination-room.spec.ts`,
`prototype.spec.ts`. Six existing specs also received only the necessary
retired-coach selector/native-filing adjustments:
`front-desk-visual.spec.ts`, `visual-ui.spec.ts`, `question-review-flags.spec.ts`,
`ui-density.spec.ts`, `workspace-splitter.spec.ts`, `playthrough-batch.spec.ts`.

Documentation: appended this handoff and a worker note to
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Actual baseline-relative diffs were
inspected without Git; `.local-dev/tutorial-validation/*.review.diff` and
`reviewed-scope.json` are ignored inspection artifacts. Shared files also contain
concurrent work: camera lifecycle in the session hook, chart structured fields
in UI types, companion/radiology/periop types and reducer additions, and domain
exports. Those changes were preserved and are not claimed as tutorial work.

### Milestone and final validation

All package test commands used `--pool=threads --maxWorkers=1`. Player commands
used the already-existing ignored command-local preload for Vite's optional
Windows `net use` EPERM:
`$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'`.
It changes only validation subprocess behavior; no production config/dependency
was modified. Exact transcripts are in `.local-dev/tutorial-validation/`.

| Check | Exact result | Transcript |
| --- | --- | --- |
| M1 focused tutorial/pause/storage/repository/feedback | 6 files, 72 tests passed; exit 0 | `m1-focused-final.log` |
| M1 root typecheck | all 7 workspace scripts passed; exit 0 | `m1-typecheck-final.log` |
| M2 focused coach/Help/positioning/pause | 5 files, 44 tests passed; exit 0 | `m2-focused-final.log` |
| M2 root typecheck | all 7 workspace scripts passed; exit 0 | `m2-typecheck.log` |
| M3 focused opening/storage/preferences/repository | 4 files, 53 tests passed; exit 0 | `m3-focused.log` |
| M3 root typecheck | all 7 workspace scripts passed; exit 0 | `m3-typecheck.log` |
| M4 domain integration/tips/predicates/humor/cadence/conditions | 6 files, 119 tests passed; exit 0 | `m4-domain-final.log` |
| M4 player tutorial/tips/feed/storage/Help | 8 files, 153 tests passed; exit 0 | `m4-player-first.log` |
| M4 root typecheck | all 7 workspace scripts passed; exit 0 | `m4-typecheck-final.log` |
| M5 focused native graduation/recovery/UI | 7 files, 51 tests passed; exit 0 | `m5-focused-first.log` |
| Final focused player, including ambiguous pause migration | 14 files, 196 tests passed; exit 0; start 09:44:52, duration 13.92s | `final-focused-player-complete.log` |
| Final focused domain | 6 files, 119 tests passed; exit 0; start 09:40:18, duration 7.94s | `final-focused-domain.log` |
| FULL game-domain | 103 files passed / 3 failed (106); 3,346 tests passed / 6 failed (3,352); exit 1; start 09:30:54, duration 436.23s | `full-domain.log` |
| FULL player after final pause fix | 130 files passed / 1 failed (131); 1,030 tests passed / 1 failed (1,031); exit 1; start 09:46:14, duration 52.25s | `full-player-complete.log` |
| Root typecheck after first full suites | all 7 workspace scripts passed; exit 0 | `post-full-typecheck.log` |
| Root typecheck after final pause fix | exit 1 during concurrent periop implementation: non-exported roomLocalToGlobal and boolean-or-state return; subsequently fixed by its lane | `final-typecheck-complete.log` |
| Latest post-complete root typecheck | all 7 workspace scripts passed; exit 0 | `post-complete-typecheck.log` |
| Six new/rewritten tutorial e2e sources and imported helpers, strict/noUncheckedIndexedAccess/noEmit | exit 0, no diagnostics | `m5-e2e-types-final.log` |
| Playwright discovery of all affected specs | 152 tests in 13 files, exit 0; no browser/server started | `final-e2e-list.log` |
| Boundary verification | exit 1: `Could not inspect tracked paths: spawnSync git EPERM` | `final-boundaries.log` |

Final focused commands:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/tutorialViewModels.test.ts src/session/tutorialGuidance.test.ts src/session/tutorialTipsIntegration.test.ts src/session/dailyRoutineTutorialPause.test.ts src/session/prototypeStorage.test.ts src/session/localCampaignRepository.test.ts src/session/chartFeedbackPresentation.test.tsx src/session/alertViewModels.test.ts src/session/alertsEventsViewModel.test.ts src/session/guidanceTipsView.test.ts src/ui/HelpDialog.test.tsx src/ui/OpeningSequence.test.tsx src/ui/visualComponents.test.tsx src/ui/tutorialPositioning.test.ts --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/tutorial-guidance-integration.test.ts tests/guidance-tips.test.ts tests/guidance-tip-predicates.test.ts tests/alert-humor.test.ts tests/alert-cadence.test.ts tests/facility-alert-conditions.test.ts --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
npm.cmd run test:boundaries
```

### Failure attribution and remaining acceptance

The full player failure at `src/session/surgeryCenterServicePreviews.test.ts:85`
expects the old pending label to contain "Off-site thyroid fine-needle
aspiration". The current generic pending-care/return label does not contain it.
This pre-existing failure was already recorded by the Alerts and other batch
workers; the tutorial lane changes neither that view-model label nor the test.

The six full domain failures belong to concurrent radiologist-read income work:

- `tests/diagnostic-service-operations.test.ts:212`: cash 145 versus old expected
  120 after five paid reads; `:240`: receipt amounts `[40, 5]` versus old `[40]`.
- `tests/employee-training-benefits.test.ts:537`: one reading-income receipt
  versus the former zero-receipt expectation. That assertion was edited by its
  owning lane during this full run; source frames and loaded assertions reflect
  different concurrent snapshots.
- `tests/radiologist-read-income.test.ts:122`: legacy read count 0 versus 1;
  `:167`: three outside reads versus none under a whole-room reservation;
  `:289`: persistence rejects a saved Reading phase/operation disagreement.

No listed failing file or reading/payment/persistence function was changed by
this worker. The final guidance-focused domain run passes after this full run.
The manager should reconcile the radiology lane and rerun the stable integrated
full suite. The transient `final-typecheck-complete.log` failure came from
concurrently added `src/periop-nurse-attention.ts:7` importing a non-exported
spatial helper, and `src/service-operations.ts:1462` returning
`boolean | PeriopNurseAttentionState`. Those functions were not edited here.
After their lane corrected them, the latest root check passed all seven
workspace scripts (`post-complete-typecheck.log`, exit 0).

The boundary script could not invoke Git in this sandbox. No Git command was
issued by the worker. The manager must rerun `npm.cmd run test:boundaries` in its
normal environment. Browser execution/build acceptance was not attempted here;
Playwright discovery is not a browser pass. No new product decision is pending.
The owner's actual first-shift pacing, tone, accessibility and ten-minute target
must still be observed, not inferred from unit tests.

### Exact manager browser/visual QA

Owner opening stays **START_GAME.cmd -> `http://127.0.0.1:4173` in the usual
persistent browser profile**. This worker did not access owner browser storage.
Use the manager's already verified isolated QA server (the batch records
`http://127.0.0.1:5183`); confirm that it is still manager-owned and serves the
current worktree before running checks. QA origin/profile campaigns and saves
do not follow to 4173 or the remote Pages origin. Include `location.origin` in
any persistence report; use fresh synthetic QA campaigns only.

```powershell
$tutorialQaUrl = 'http://127.0.0.1:5183' # Only after manager ownership/current-code verification.
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = $tutorialQaUrl
node node_modules/@playwright/test/cli.js test tests/e2e/tutorial-graduation.spec.ts tests/e2e/tutorial-completion.spec.ts tests/e2e/tutorial-daily-routines.spec.ts tests/e2e/hud-sidebar-tutorial.spec.ts tests/e2e/fresh-campaign-examination-room.spec.ts tests/e2e/prototype.spec.ts --project=desktop-chrome --workers=1
node node_modules/@playwright/test/cli.js test tests/e2e/tutorial-positioning.spec.ts --workers=1
node node_modules/@playwright/test/cli.js test tests/e2e/tutorial-daily-routines.spec.ts --grep 'Help restores' --workers=1
node node_modules/@playwright/test/cli.js test tests/e2e/front-desk-visual.spec.ts tests/e2e/visual-ui.spec.ts tests/e2e/question-review-flags.spec.ts tests/e2e/ui-density.spec.ts tests/e2e/workspace-splitter.spec.ts tests/e2e/playthrough-batch.spec.ts --project=desktop-chrome --workers=1
```

| Fresh QA state and how to reach it | Inspect visually / expected behavior |
| --- | --- |
| New Campaign; fill both names, choose Prev/Next founder, toggle guidance, Open the Clinic. Also try a normalized duplicate name and the rich-and-happy branch. | One compact form, exact approved overhead joke, actual $120, guidance On by default, disabled invalid/duplicate submission, one initialized clinic, correct avatar after reload. Happy creates no clinic. |
| Ordinary fresh guided clinic; allow first check-in, open Waiting, close unfinished with Escape, reopen in Existing. Repeat at 1440x1000, 1280x720, 1024x768 and 390x844. | Four milestone labels, compact coach and visible focus; no mandatory acknowledgement buttons. Clock runs, native 1-9/Enter/Escape controls work, chart/choices/actions are not covered, docking/scrolling stay readable. No obsolete arrival lecture after opening. |
| Answer the first visit, read feedback, file with Resolve Completed Chart or Dismiss and close chart. Reload before filing in another QA clinic. | Honest feedback and money/XP purpose; one useful native filing action, no forced flip or additional tour. Saved answer, frozen variant/order, review and settlement remain singular. |
| Admit/open the second visit, intentionally choose a wrong testing answer, then Enact Corrected Plan and close normally. Use 4x or Prototype Fast-forward 10 min for the real wait. Reload before enactment and during pending work in separate runs. | Wrong answer remains wrong, saved feedback is recoverable, plan does not start before native enactment, live wait estimate and return marker are accurate. Pending chart stays in Existing; travel/care/return/check-in are not bypassed. Short optional Management pointer retires without click/pause; no litter/water card stack. |
| During that wait, enter Management then Done; enter early Build then Done / Save; open Help and Escape from both a running and a manually paused clinic. Reload the manually paused pending visit. | Native mode pause ownership and prior manual pause are honored; tips do not pause. Help has six topics, topic focus, Escape/focus restoration and no behind-modal answer submissions. Coach resumes the actual need and never targets a hidden chart during Build. |
| Finish both visits with all-wrong, mixed and all-correct answers in three fresh clinics. Obtain any needed cash via the normal Complete consult control, then buy Examination Room. Place at (34,26), beside the Front Desk; attempt overlap first. Try Done / Save without a door, then Doors on the shared south wall at offset 1. Reload after paid room placement before adding the door. | No free room, duplicate purchase or answer regrading. Failed overlap retains placement guidance and cash. Missing access keeps Build open with the normal issue dialog. Existing paid room survives reload and guide targets repair. A functional shared-wall door is required; Done / Save restores the prior pause state. **Do not use Add $100 or seeded advancement in these natural proofs.** |
| After validated build, use native Advance to Level 1 and reload. | No completion acknowledgement/overlay; guide record complete, one quiet tips handoff, ordinary goals/queue visible. Both protected visits, all three answer scores, frozen variants, learning history and two settlements remain unchanged; other clinic preferences survive. |
| Fresh guidance-off clinic, then Help -> Show guidance here. Later Skip guidance -> Help -> Replay first shift in a new clinic; give the replay a unique ordinary name. | Show-here derives the actual current need. Skip is local. Replay begins a normal $120 clinic with guidance On and leaves the original saved/paused/resumable, never archived or reset. |
| In disposable fresh QA campaigns only, apply the advanced-legacy fixture from `tutorial-completion.spec.ts` at levels 1/2/3 with no historical second record, plus the frozen multistep/pause fixtures in the unit tests. | No fabricated protected visit or late coach. Old pending work survives, pause reconciliation is idempotent, existing humor deadline/history is preserved. Actual later tips/humor still become eligible. This is compatibility QA, separate from natural graduation. |
| In a normally graduated fresh QA clinic with guidance off/complete, use `?prototype-tools=1`, Add $100 as needed for **later operational QA only**, and Fast-forward 10 min in increments. Finish/clear genuine Needs-you work; let the existing quiet/eligibility/cadence gates elapse. Reach actual unattended litter/low water and then hire the effective receptionist/EVS coverage or apply the ordinary remedy. | At most one relevant ordinary tip per existing spacing, no urgent-slot teaching or arrival/result receipt spam, safe live actions/prices, no pause on tip/history/read controls. Matching active coach topic owns its guidance row; genuine urgent cards still surface. Covered/handled chores stop requesting manual teaching. Reload retains tip exposures/cadence/history; no deferred burst. |

This worker leaves the final handback in the shared worktree and has not
committed, pushed or verified its inclusion in a GitHub backup. The manager
should verify whether an existing checkpoint includes these final changes,
and carry the **"push to GitHub"** reminder for any still-unbacked accepted
state. This worker has no commit, push, merge, release or deployment authorization.
- 2026-10-08: all six batch workers finished. Launched periop-chairs rendering worker (companion seats need drawing). periop-nurse auto-started after companions.
- 2026-10-08: manager QA (fresh campaign, origin 5183): combined opening form with real cash and approved line; tutorial coach present with Skip guidance; short chart pins to desk top-centre (sheet top = desk top). Found mojibake tutorial arrow (UTF-8 U+279C saved as "âžœ") in TutorialCoach.tsx from the tutorial worker; manager made the two-character integration fix; no other mojibake in changed/new source.

## Peri-op companion chair rendering

Sol worker, 2026-10-08. Bounded rendering milestone implemented locally and
validated with native Node/Vitest scene doubles. Browser texture/pose acceptance
remains with the Claude manager. No agents, Git mutations, dependency installs,
domain changes, art changes, launcher changes, deployment or publication.

### Files and implementation

- New `apps/player/src/facility/periopCompanionPresentation.ts`: adapts the
  facility room/door projection to `getRoomCompanionSeats(room, definition,
  doors, rooms, getRoomDefinition)`. Only its visible seats produce chair draw,
  support and foreground-mask descriptors. Neighbor-owned physical openings
  therefore hide exactly the same chair as the domain, and removing the door
  restores it. Seats retain the eight stable domain IDs and inward facings.
- Reuses the exact Waiting Room east/west `south.webp` and north/south
  `west.webp` crops, render sizes, cushion contacts and ground-contact offsets.
  Translates their approved floor footprints into the domain's anchor +
  (0.15, 0.15), size (0.7, 0.7) envelope without resizing the art or actors.
  North/south templates include the layering lane's approved south cushion
  inset. Floor chairs stay visible beside low/backed north walls.
- `apps/player/src/facility/FacilityScene.ts`: adds these draws to the existing
  approved/touch-up furniture renderer; attaches an actor only when stationary
  at its visible chair, with a matching room/seat/location reservation and
  `phase === "waiting_in_periop"`. Uses the existing seat-contact alignment,
  support painter depth, complementary rear/front textures, and foreground
  reconciliation. Walking and standing companions keep their floor poses.
  Clears attachments/snapshots after door, phase, room or live-location changes,
  including paused/Build redraws. Other furniture draw records are unchanged.
- `apps/player/src/facility/approvedSideChairLayers.ts`: one mask-ID type
  extension. The new masks reuse the existing approved arm/post/back polygons
  and pixel partition; no new mask geometry. Each seat has a distinct mask ID,
  so two chairs with the same facing never share occupancy/depth, and existing
  room-instance ownership continues to isolate different Periop rooms.
- `apps/player/src/facility/types.ts`: companion support role and optional
  phase/periop-room/waiting-reservation projection.
- `apps/player/src/session/viewModels.ts`: the required rendering-handoff
  bridge is one exact optional `procedureCompanion` passthrough in the
  `retailExternalActors` mapping. This is the sole source hunk outside facility.
  The concurrently authored nurse mapping/status edits were reread and retained.
- New `apps/player/src/facility/periopCompanionPresentation.test.ts`: ten tests
  covering the actual domain-to-view bridge, all eight crops/supports, every one
  of the 24 wall door slots, all eight neighbor-owned reciprocal openings,
  removal/restoration and foreground cleanup, bitmap/fallback attachment in all
  facings, unique occupied foregrounds, floor-only states, paused invalidation,
  and missing-location cleanup. Real domain paths from all 24 door approaches to
  beds, staff post and visible chair endpoints remain clear of the rendered
  floor envelopes, including the corner-to-interior diagonals at a 0.16-tile
  walking radius.

Baseline-relative review is in
`.local-dev/periop-companion-rendering-20261008/baseline-review.diff`.
It includes a concurrent nurse status hunk in `viewModels.ts`; it is a review
receipt, not a staging manifest. Source snapshots and exact validation logs are
in the same local directory. The manager owns the central current-thread handoff
and acceptance/checkpoint reminder.

### Exact validation

Commands ran from the repository root. Tests used the existing command-local
preload for Vite's optional Windows `net use` probe in this sandbox; no test
configuration, dependencies or preload source were changed:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/periopCompanionPresentation.test.ts src/facility/furnitureSeatLayering.test.ts src/facility/approvedSideChairLayers.test.ts src/facility/approvedRoomPresentation.test.ts src/facility/characterPauseArrival.test.ts src/session/economyViewModels.test.ts src/session/periopNurseAttentionPresentation.test.tsx --pool=threads --maxWorkers=1
```

Final focused output, exit 0, `focused-final.log`:

```text
 Test Files  7 passed (7)
      Tests  76 passed (76)
   Start at  10:12:34
   Duration  9.03s (transform 2.41s, setup 0ms, import 5.29s, tests 3.08s, environment 0ms)
```

Final full player command (same command-local preload):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Exact full output summary, exit 1, `player-full-final.log`:

```text
 Test Files  1 failed | 132 passed (133)
      Tests  1 failed | 1043 passed (1044)
   Start at  10:13:20
   Duration  58.98s (transform 3.73s, setup 0ms, import 31.11s, tests 16.15s, environment 8ms)
```

Only failure, outside this lane and already documented in earlier handoffs:
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, "ignores the retired
concealment flag and preserves the scheduled external service after an answer".

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

All facility and nurse presentation tests passed in that full run.

```powershell
npm.cmd run typecheck
```

Final root output, exit 0, `typecheck-final.log`:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

The initial typecheck saw the concurrent nurse test using
`view.facility.employees` (TS2339 and TS7006 at line 63). Its owner changed that
to `view.facility.staff`; subsequent/final root typecheck passed. This worker
did not edit that test or nurse/domain files.

### Exact manager browser checks

Browser checks were not executed by this worker. The worker sandbox cannot
launch Playwright; actual WebP loading, lighting and adult-width/arm intersections
need manager browser acceptance. Use a fresh disposable **Peri-op chairs QA**
campaign on the manager's existing QA origin/profile, for example
`http://127.0.0.1:5183`, and record `location.origin`. Pause using the native
Pause button and turn tutorial guidance off before the visual fixture below.
The owner opening pathway stays `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent profile. QA 5183/profile storage
is separate; it does not inherit or replace the owner or GitHub Pages save.

For a deterministic runtime texture/layer capture, paste this into the QA
browser console on the **Vite development server**. It temporarily supplies a
render-only view, never writes a campaign or alters domain state, and is removed
by reloading. Keep the real QA campaign paused while using it. It gives a
6x6 Periop at (38,26), doors at both corner offsets on every wall, and all eight
companions already stationary at their actual domain chair endpoints:

```javascript
var chairQAHost = document.querySelector('[data-testid="facility-canvas"]');
var chairQAScene = chairQAHost.__facilityGame.scene.getScene('facility-scene');
var chairQAOriginal = chairQAScene.bridge.viewModel;
var chairQAModule = await import('/src/facility/periopCompanionPresentation.ts');
var chairQARoom = {
  instanceId: 'periop.chair-render-qa', definitionId: 'room.periop_recovery',
  displayName: 'Peri-op chairs QA', tileX: 38, tileY: 26,
  width: 6, height: 6, orientation: 0, isFounderRoom: false
};
var chairQACorners = ['north', 'east', 'south', 'west'].flatMap(side =>
  [0, 5].map(offset => ({ instanceId: `qa.corner.${side}.${offset}`,
    roomInstanceId: chairQARoom.instanceId, side, offset, exterior: false })));
var chairQAChairs = chairQAModule.resolvePeriopCompanionChairs(chairQARoom);
var chairQAAppearance = chairQAOriginal.patients?.[0]?.appearance ?? chairQAOriginal.founder.appearance;
var chairQAView = {
  ...chairQAOriginal, paused: true, buildMode: false,
  rooms: [chairQARoom], doors: chairQACorners,
  patients: [], serviceVisitors: [], staff: [], ambientPedestrians: [],
  retailExternalActors: chairQAChairs.map(chair => ({
    instanceId: `qa.${chair.support.id}`, actorKind: 'companion',
    displayName: 'QA companion', appearance: chairQAAppearance,
    location: { ...chair.anchor }, path: [{ ...chair.anchor }], pathIndex: 0, moving: false,
    procedureCompanion: { phase: 'waiting_in_periop', periopRoomInstanceId: chairQARoom.instanceId,
      waitingReservation: { roomInstanceId: chairQARoom.instanceId,
        location: { ...chair.anchor }, kind: 'chair', seatId: chair.support.id } }
  }))
};
var chairQAPaint = () => {
  chairQAScene.bridge.viewModel = chairQAView;
  chairQAScene.refreshLayout(true);
  chairQAScene.drawCharacters();
  return chairQAScene.debugApprovedSideChairLayerSnapshot()
    .filter(entry => entry.drawId.startsWith('companion.'));
};
chairQAPaint();
chairQAScene.applyCamera({ ...chairQAScene.cameraView, zoom: 1.6, panX: 0, panY: 0 });
chairQAScene.refreshLayout(true);
var chairQACenterX = chairQAScene.layout.originX + 41 * chairQAScene.layout.tileSize;
var chairQACenterY = chairQAScene.layout.originY + 29 * chairQAScene.layout.tileSize;
chairQAScene.applyCamera({ ...chairQAScene.cameraView,
  panX: chairQAScene.scale.width / 2 - chairQACenterX,
  panY: chairQAScene.scale.height / 2 - chairQACenterY });
chairQAPaint();
```

After the requested stills load, the returned array must contain eight chairs
with eight visible occupied foregrounds. Corner offsets 0/5 hide no chair. This
fixture is a visual capture, not proof of a persisted live procedure or exterior
connectivity; the bridge/route tests above cover their software contracts.

| Check | Exact action | Expected result |
| --- | --- | --- |
| Four facings/contact/layers | Capture the all-eight fixture at normal and 160% zoom. Repeat with average and larger adult patient appearances from a real QA visitor. | North wall chairs face south; west wall east; east wall west; south wall north. Actors sit on the cushion at the approved scale; side arms/posts and the north back cover only the matching parts. Beds, monitors and station retain their prior positions. |
| Each occupied chair becomes a door | For each item 9 seat table slot, append `{instanceId:'qa.slot',roomInstanceId:chairQARoom.instanceId,side,offset,exterior:false}` to `chairQAView.doors`, then call `chairQAPaint()`. Remove that record and paint again before the next slot. | Exactly that chair/foreground disappears. Its companion loses the seated attachment and uses a floor pose; other occupied chairs retain their own layers. Removal restores the same chair/support/contact. |
| Neighbor-owned opening | Set `chairQAView.rooms = [chairQARoom,{...chairQARoom,instanceId:'qa.neighbour',tileY:20}]`; append a door owned by `qa.neighbour`, side `south`, offset 1; paint. Then remove that door and paint. Repeat with offset 4 and reciprocal east/west/south neighbors if desired. | The north-offset-1 chair alone disappears (or the corresponding matching slot); no hidden occupied overlay. It reappears after door removal, including on a low/backed north wall. |
| Empty/restored chair | Set `chairQAView.retailExternalActors = []`; paint. Recreate the eight actors from the snippet and paint. | Empty chairs return to the whole sprite; no doubled outlines or lingering foreground. Occupied chairs return to complementary layers at the same contact. |
| Phase/walking/standing | Change one fixture actor's phase to `walking_to_amenity`, `returning_to_periop` or `leaving_with_patient`; alternatively set `moving:true`, or reservation `kind:'standing',seatId:null`; paint. Restore and paint. | Only that actor loses its chair support. Standing poses and walking facing are unchanged; it never attaches to a patient bed. |
| Real pre-op arrival/door reseating | Reload to discard the visual fixture. Reach Level 2 in a fresh QA campaign; build connected Endoscopy + 6x6 Periop, hire both nurse roles and an endoscopist, and allow an actual scheduled endoscopy. Connect corner-offset-0/5 doors to real hallways. Observe at normal speed during pre-op, then pause after arrival/180 ms settle. For deterministic domain seeding use `procedureFixture`/`settleCompanion` in `packages/game-domain/tests/companions.test.ts`: Periop (38,26), N3 patient endpoint (40,28), phase 0, `periopBedFlowVersion:1`. | Companion walks to a visible chair in the patient's Periop, then sits facing inward. Building a door in its slot causes domain reseating by walking; all corner approaches and bed/nurse routes stay clear. During a real procedure amenity excursion and PACU/discharge, support is cleared/reacquired only when appropriate. |

Manager acceptance still needs those actual browser captures and reconciliation
of the one existing pending-label test failure. This milestone is local only;
the manager should include it in the next audited checkpoint and remind the
owner to say **"push to GitHub"**. No backup, merge, release or publication is
claimed by this worker.
- 2026-10-08: periop-chairs: manager browser check in the injected Level 2 clinic (origin 5183) shows corner armchairs drawn in the peri-op room; harness layout overlaps Front Desk/recovery, so south-wall facing (should show chair backs, facing north into the room) needs owner confirmation in a real campaign. Same run showed a dire Needs-you card ("Lucia Ash may walk out", Open chart) with its map pin. Radiologist income: owner decision pending on in-house $5 split vs additive.


## Peri-op nurse attention queue

2026-10-08. Sol worker, bounded gameplay/domain and minimal presentation lane.
Implemented the owner's 15-minute pre-op and 15-minute post-op attention request.
Both values are named constants in balance-config and documented as owner game
tuning, not clinical durations. No clinical content or provenance was changed.

### Behavior and decisions

- New accepted endoscopy/ambulatory surgery work has two independent, saved
  attention tasks. A task becomes ready on the patient's physical bed arrival
  and phase start. One clinic-wide FIFO orders pre/post tasks by ready tick,
  operation creation tick, then stable operation ID. Idle available nurses are
  assigned in stable employee-ID order; nurses from any operational Periop home
  can help patients in another reachable Periop. The existing two-nurses-per-home
  hiring capacity is preserved (three nurses need at least two home rooms).
- Patients can occupy their reserved bed while a nurse is busy or training.
  Each assigned nurse takes a real authorized path to a free standing tile
  adjacent to that patient's bed. On the coarse grid a diagonal bedside aisle
  is adjacent. Bed/furniture contacts, companion-chair contacts, door thresholds
  and other employees'/companions' current/destination claims are excluded.
  Walking never consumes attention; the full accepted work runs after arrival.
  Progress requires both nurse and patient at their assigned endpoints. A
  per-tick progress witness prevents the two service passes double-counting.
- Attention overlaps the existing required patient phase. A free untrained
  nurse completes attention in 15 minutes within the baseline 30-minute prep or
  60-minute recovery. A delayed phase ends at the later of its original deadline
  and the attention completion; it cannot enter the procedure or discharge
  before its check is complete. Patient bathroom pauses still pause preparation.
- The existing category-average periop training percentage is frozen when work
  is accepted and applied once to the independent 15-minute baselines. Diagnostic
  plans carry that frozen percentage through delayed dispatch. Existing trained
  preparation duration remains separate; recovery remains 60 minutes. Current
  Recovery upgrades affect experience/satisfaction, not preparation speed, so
  no invented room timing multiplier was added. Later hires, training or room
  upgrades do not rewrite accepted tasks.
- Completion frees the nurse immediately, including while that patient remains
  in the bed for the rest of prep/recovery. Existing staff seats, morale breaks,
  coffee/retail and paid training can run between tasks; active trips, duties and
  training absences make the nurse unavailable. A ready care queue suppresses a
  new optional break. Existing eligible paid-training departure claims are
  honored between tasks. **Existing-engine gap:** there is no employee bathroom
  trip routine; bathroom idling currently belongs to the Founder/patients/
  companions. The queue frees nurses but does not add a separate bathroom system.
- Staff activity names the patient (`Pre-op check · Maya Reed` / `Post-op check
  · Maya Reed`, with a walking label en route). A genuinely delayed unstarted or
  interrupted check shows `Waiting for peri-op nurse` in patient activity,
  chart status and Services. Services -> In progress now shows the number of
  ready unassigned checks. No nurse queue alert/tip/card was added; the existing
  genuine admission/dire-wait rule retains ownership of Needs you.
- Minimal rendering is data-driven: the view model supplies the real standing
  position and facing direction. FacilityScene, seated support/layering and the
  companion seating design were preserved. The concurrent chair-rendering
  worker's `ProcedureCompanionState` projection and facility/types additions
  are visible in baseline-relative diffs but are not this worker's changes.

### Saves and compatibility

The optional `periop-nurse-attention.v1` marker preserves ready ordering,
accepted duration, partial remaining work, original phase deadline, nurse/spot
reservation and completion/progress witnesses. Strict parsing rejects malformed
marked work. Reload does not reset the task or add a second 15-minute timer. A
missing/dismissed/training nurse releases its partial task to its original FIFO
position; the remainder is preserved and a replacement can finish it.

**Legacy choice:** unmarked saved operations and unmarked accepted diagnostic
plans stay on their original legacy flow. Their pre/post phases are exempt from
the new attention gate; existing shared `cover_periop` support is retained for
those visits. No new task is inserted retroactively and no phase is silently
double-extended. New work starts the queue. The game-state save schema stays 9.

### Files changed in this lane

New:
`packages/balance-config/src/periop-nurse-attention.ts`,
`packages/game-domain/src/periop-nurse-attention.ts`,
`packages/game-domain/tests/periop-nurse-attention.test.ts`,
`apps/player/src/session/periopNurseAttentionPresentation.test.tsx`.

Domain/config integration (small exact hunks):
`packages/balance-config/src/index.ts`;
`packages/game-domain/src/service-operations.ts`, `diagnostic-timing.ts`,
`types.ts`, `persistence.ts`, `staff.ts`, `reducer.ts`,
`level-three-support.ts`, `index.ts`.

Presentation:
`apps/player/src/session/viewModels.ts`, `characterActivityPresentation.ts`;
`apps/player/src/ui/types.ts`, `ServiceIncomePanel.tsx`.

Existing tests adapted to the separate bedside witness/legacy opt-in:
`packages/game-domain/tests/service-operations.test.ts`,
`level-two-endoscopy.test.ts`, `employee-training-benefits.test.ts`,
`employee-training.test.ts`, `diagnostic-service-operations.test.ts`,
`room-upgrade-revenue.test.ts`. Payment/training fixtures that jump the clock
explicitly witness nurse arrival after the patient starts prep/recovery; they
do not disable the gate or mark unfinished work complete.

### Validation and failure attribution

Ignored evidence lives under `.local-dev/periop-nurse-attention/`. Baseline
snapshots and `*.review.diff` were inspected without Git. They include concurrent
shared-file edits; the file list above is this lane's ownership, not a staging
manifest. No Git, installs, art, browser launch, owner save access, push or
deployment was performed.

Commands and exact final summary output (all suites use one thread worker):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/periop-nurse-attention.test.ts --pool=threads --maxWorkers=1
Test Files  1 passed (1)
     Tests  21 passed (21)
  Start at  10:21:01
  Duration  2.08s
Exit 0; queue-final.log

npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/room-upgrade-revenue.test.ts tests/diagnostic-service-operations.test.ts tests/employee-training.test.ts tests/companions.test.ts --pool=threads --maxWorkers=1
Test Files  4 passed (4)
     Tests  96 passed (96)
  Start at  10:17:48
  Duration  6.65s
Exit 0; final-integration.log

npm.cmd run test --workspace @gamify-surgery/player -- src/session/periopNurseAttentionPresentation.test.tsx --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
Test Files  1 passed (1)
     Tests  3 passed (3)
  Start at  10:08:29
  Duration  1.80s
Exit 0; player-focused.log

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  107 passed (107)
     Tests  3373 passed (3373)
  Start at  10:21:25
  Duration  356.03s (transform 2.59s, setup 0ms, import 37.98s, tests 309.95s, environment 5ms)
Exit 0; full-game-domain-final.log

npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
Test Files  8 passed (8)
     Tests  69 passed (69)
  Start at  10:13:12
  Duration  1.33s (transform 110ms, setup 0ms, import 588ms, tests 50ms, environment 0ms)
Exit 0; full-balance-config.log

npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
Test Files  1 failed | 132 passed (133)
     Tests  1 failed | 1043 passed (1044)
  Start at  10:13:12
  Duration  59.27s (transform 3.28s, setup 0ms, import 30.84s, tests 16.72s, environment 8ms)
Exit 1; full-player.log

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
```

Final root typecheck ran all seven workspace scripts successfully (clinical
context workbench client/server, player, balance-config, clinical-authoring,
clinical-content, clinical-research and game-domain), exit 0;
`final-typecheck.log`. The new queue suite covers FIFO/division across 1/2/3
nurses, combined pre/post ordering, all usable authored beds, 15 minutes inside
required time, backlog extension, procedure/discharge gating, actual walking and
adjacency, per-tick idempotence, staff seats/break/coffee/training unavailability,
modifier freezing, active/backlogged save roundtrip, partial-task requeue,
legacy pre/post saves and invalid marked duration. Presentation tests cover
named pre/post activity, standing position, chart delay/queue text and no new
Needs-you card.

The initial full domain run had four old-fixture failures: two revenue room
transfer cases jumped to prep completion before the newly dispatched nurse
physically arrived; diagnostic procedure/recovery witnessing had the same
arrival assumption; the training test expected bed admission to wait for a
training nurse. Corrected tests retain their fee/witness/training assertions and
now model the separate check. Their focused rerun passes. Earlier transient
typecheck errors in this lane were corrected; the final root check passes.

Player's ordinary config bundler cannot start in this Windows sandbox:
Vite `externalize-deps` attempts a Windows realpath subprocess and gets
`spawn EPERM`. Native loading of the original config then cannot resolve its
extensionless local plugin import. The ignored `player-vitest.config.mjs` uses
the same React and `forbidPrivateModules` plugins, with explicit `.ts` extension
and native config loading. The full player suite ran with that test-only config;
production Vite config and dependencies were unchanged. The manager must rerun
the ordinary player command/default config and browser checks in its environment.

The sole full-player failure is the previously documented
`src/session/surgeryCenterServicePreviews.test.ts:85`: expects `Off-site thyroid
fine-needle aspiration` in `pendingLabel`, while current diagnostic presentation
returns the generic pending-care/return text. This lane changes chart status for
the exact nurse wait only, not the off-site pending-label builder or that test.

### Manager QA campaign and quick pre-op arrival

Owner opening remains **START_GAME.cmd -> exact `http://127.0.0.1:4173` in the
usual persistent browser profile**. No pathway/storage change was made. For
browser QA use only the manager's verified isolated QA origin/profile (the batch
has used 5183); its saves are separate from 4173 and remote Pages. Include
`location.origin` in any persistence report. Never seed over an owner campaign.

For a quick visual check, use a disposable Level-2/3 QA clinic with connected
6x6 Periop + Endoscopy, one periop nurse, one endoscopy nurse and an Endoscopist.
The hired Endoscopist avoids the Founder being occupied by an open chart. Put
Periop close to Front Desk, connect real doors/hallways, turn Scheduled
appointments on in Services, unpause and use 4x/prototype fast-forward until a
Routine endoscopy visitor enters pre-op. The current cadence is 120 game
minutes; a just-enabled eligible line schedules its first visit for that cadence.
Do not answer unrelated clinical questions to obtain this scheduled visitor.
Keep the periop nurse untrained/free for the simple 15-within-30 proof.

For immediate manager-only seeding on the isolated QA clinic, reuse the
synthetic domain fixture from `tests/periop-nurse-attention.test.ts` or
`companions.test.ts`: Front Desk's existing location, Periop `(38,26)`, N3 bed
endpoint `(40,28)`. Call `startServiceOperation(state, "income.endoscopy",
"visitor", context)` with operational staffing, then advance normal reducer
ticks to preserve the street-to-bed walking. Alternatively, enable appointments
and set `state.nextServiceAppointmentTicks["income.endoscopy"] =
state.facilityTick` in that disposable fixture before the next reducer tick. This
creates the marker through the actual factory. The focused synthetic tests
skip travel only for deterministic unit fixtures; browser QA should observe it.
Prefer a corner-offset-0 door for all eight beds; a middle side door owns/removes
its conflicting bed contacts. The queue does not change those masks.

| QA case | Expected result |
| --- | --- |
| Free nurse; one newly arrived endoscopy patient | Nurse walks to a furniture/door-free adjacent bedside spot, remains standing, label names this patient; 15 minutes begin after nurse arrival, finish within 30-minute baseline prep, then nurse is free. Patient remains until required prep ends. |
| Two/three ready patients, one nurse; repeat with two nurses; three nurses across two Periop homes | FIFO assignments and work division; no two nurses claim the same spot or patient. A later check that cannot fit extends prep until completion. Procedure never starts early. Queue count falls when tasks are assigned. |
| Procedure completion and recovery | Post-op check is newly queued on bed return; free check overlaps 60-minute baseline recovery. With a backlog, recovery/discharge and bed release wait for the check, then normal physical clearance continues. |
| Idle interval and paid training | Staff can sit at a free authored staff seat, buy coffee or take an eligible morale break. Queue suppresses a new optional break. Existing training leaves only between duties and makes its nurse unavailable; another operational periop nurse can cover. |
| Training and Recovery upgrades | Task work uses the frozen category skill once; patient prep and post-op stay separate. Recovery room comfort upgrades do not shorten the check/required recovery. |
| Save midway through walking, attention or backlog; dismiss/reassign its nurse | Load preserves remaining work/order/deadline; interrupted partial attention requeues and finishes without repetition. Load a legacy unmarked prep and recovery: no new 15-minute delay. |
| Companion and standing-nurse view | Companion uses the recent linked periop seating/amenity flow. Nurse remains standing at actual position; no seated-layering/support regression, furniture overlap or doorway standing. Check a naturally placed room, not an overlapping rendering harness. |
| Modest delay versus dire admission wait | Delayed chart/activity and Services queue are visible; no nurse alert spam. Genuine existing dire admission needs still appear under the existing rule. |

Manager owns visual acceptance/default-config rerun, central handoff integration
and the audited GitHub checkpoint. This milestone is local only; remind the
owner to say **"push to GitHub"** for any accepted state not already backed up.

- 2026-10-08: manager full pass after all workers finished: balance-config 69/69, clinical-content 585/585, player 1043/1044 (known surgeryCenterServicePreviews), typecheck PASS, game-domain 3369/3373 with 4 failures (diagnostic-orders x3, patient-supply x1) that pass 17/17 in isolation (third occurrence) -> intermittent; flaky-test worker launched. All batch items accepted pending owner confirmations (layering in real campaign, peri-op south chairs, rad income split decision, pediatric revision 2, exterior option).
- 2026-10-08: owner: pediatric waiting approved (next: Pediatric Exam); radiologist in-house reads pay +$5 on top; endoscopy/chair layering, training and peri-op chairs confirmed working by owner; peri-op nurses not distributing (one always busy, other "ready", standing around) -> fix; compact Goals/Alerts with collapsed empty Needs-you; exterior A/C/finish concept renders requested. Round-3 workers launched (ped-exam, rad, nurse, ui, exterior).
- 2026-10-08: owner bug: with 2 radiologists, one works and the other wanders/sits but never reads or earns. Queued as rad2 (resume of the rad-income worker) to start after the additive-$5 change finishes.


## Peri-op nurse queue: owner feedback fix

2026-10-08. Sol worker follow-up to the owner's real-campaign feedback:
one nurse appears always working while another says Ready; nurses stand around.
Active bounded lane: periop nurse dispatch/movement/idle handling, minimal
activity labels and regressions. Shared radiologist-income and UI-spacing work
is preserved. No Git, installs, art or external messages are authorized.

Completed and ready for manager review. Owner opening remains START_GAME.cmd ->
exact http://127.0.0.1:4173 in the normal persistent profile. The manager QA
steps below use a separate disposable origin; those saves do not follow the
owner's campaign. Files written by this lane are UTF-8 without BOM.

### Cause and reproduction

The dispatch loop already considers every eligible nurse and can divide a
simultaneous pre-op burst across two/three nurses. It is not bound to a nurse's
home room: a third nurse assigned to another operational Periop can cover beds
in the first room. However, every dispatch sorts by employee ID. Staggered
procedure returns repeatedly prefer the same first nurse. In the four-visitor
reproduction, recovery assignments were 3/1 with two nurses and 3/1/0 with three.
After the fix they are 2/2 and a balanced 2/1/1. The compiled mixed Level-3
endo/OR run also uses all three, with recovery counts 1/2/1.

Released nurses keep their bedside location and previously wait for a random
generic idle roll (35% at scheduled idle intervals). Even a successful roll can
choose standing rather than a chair. The generic activity label then says Ready
in Periop whether they are standing or sitting. A quiet-period regression failed
because neither released nurse was heading to an authored staff seat. Task
labels already name the patient correctly; their live updates were not stuck.

Tests were added before production edits: two/three normally hired nurses,
four closely accepted visitors, normal street/room walking and reducer ticks
through pre-op, procedure, recovery and departure, plus a quiet period. An
isolated copy of the original dispatch/idle modules was also tested against the
final legal-layout fixture: the same three regressions fail (3 failed, 5 skipped,
4.81s). This comparison does not replace or revert shared production files.
Logs: `.local-dev/periop-owner-feedback/reproduction-before.log` and
`reproduction-original-final.log`.

The fixture uses shipped room dimensions/furniture, validates non-overlapping
footprints and every actual door placement, verifies operational access, and
hires through HIRE_STAFF. It deliberately bypasses only appointment admission
throttling to inject four already accepted visitors close together; the care,
staff, movement and phase gates run normally. Level 2 uses endoscopy; Level 3
also tests mixed endoscopy/ambulatory OR and cross-home coverage.

Legacy distinction: unmarked old visits retain their original room-wide
`cover_periop` reservation. That can look like one continuously working nurse
while old visits remain, including their procedure interval with a retained bed.
The regression proves orphan coverage clears and this reservation releases once
old visits finish. Those visits receive no new 15-minute timer; this preserves
the previous compatibility choice. An unavailable/unassigned extra hire cannot
serve new work; the player now names that missing operational assignment.
The owner's actual browser save was not read, so manager QA must distinguish
legacy coverage from new `periop_attention` checks before attributing a specific
live-campaign nurse to either case.

### Fix and owned files

- `packages/game-domain/src/periop-nurse-attention.ts`: FIFO patient order is
  unchanged. Eligible nurses rotate by oldest successful attention assignment,
  with stable employee ID ties. The calendar forecast uses the same preference.
- `packages/game-domain/src/types.ts`, `persistence.ts`: optional saved
  `lastPeriopAttentionAssignedAtFacilityTick`; valid past/current ticks survive
  reload. Missing/invalid values default to no prior assignment, so old saves
  remain loadable. Accepted attention progress and remaining work are preserved.
- `packages/game-domain/src/staff.ts`: an idle periop nurse promptly walks to
  a reachable free authored staff stool, respecting other staff's current and
  destination claims. A new check can preempt this seat route. Existing retail,
  training and break controllers keep ownership of their travel/tasks.
- `apps/player/src/session/characterActivityPresentation.ts`: Sitting between
  patient checks / Walking to a staff seat / Between patient checks replace the
  generic Ready label. Missing room assignment says Needs an operational Peri-op
  room. Pre-op/Post-op check labels still name the patient.
- New `packages/game-domain/tests/periop-nurse-flow-fixture.ts`,
  `periop-nurse-owner-feedback.test.ts`, and
  `apps/player/src/session/periopNurseOwnerFeedback.test.ts`: real-flow sharing,
  valid bedside walking/standing, all eight checks lasting 15 minutes after
  arrival, mixed surgery, quiet seating, save rotation, legacy/orphan cleanup,
  paid training absence, actual coffee travel and Level-3 breaks. Compiled player
  assertions cover named moving/standing nurses and distinct approved seated
  supports in Level-2/3 states with the legal doors.

Available idle behaviours are staff-stool sitting, existing automatic eligible
retail/coffee trips, requested paid training, and existing Level-3 morale breaks
when a reachable Break Room/free seat and cooldown allow. Training makes the
nurse unavailable through its travel/session/return. There is no employee
bathroom routine in the existing engine. No bathroom system was invented.
The owner-tuned 15-minute constants and existing training/upgrades contract,
phase extension/gates, companion flow, furniture masks, seated-layering rules
and alert policy remain intact. Radiologist additive-income edits in shared
types/persistence/service/diagnostic/view-model files and UI spacing edits were
preserved; only the nurse hunks listed above belong to this worker.

### Validation (exact commands/output)

Logs are under `.local-dev/periop-owner-feedback/`.

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/periop-nurse-owner-feedback.test.ts tests/periop-nurse-attention.test.ts
Test Files  2 passed (2)
     Tests  29 passed (29)
  Duration  11.12s
exit 0; focused-domain-final.log

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  108 passed (108)
     Tests  3389 passed (3389)
  Duration  353.78s
exit 0; full-domain-final.log

npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
Test Files  8 passed (8)
     Tests  70 passed (70)
  Duration  1.82s
exit 0; full-balance.log

npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1 src/session/periopNurseOwnerFeedback.test.ts src/session/periopNurseAttentionPresentation.test.tsx
Test Files  2 passed (2)
     Tests  6 passed (6)
  Duration  5.91s
exit 0; focused-player-initial.log

npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
Test Files  1 failed | 133 passed (134)
     Tests  1 failed | 1056 passed (1057)
  Duration  65.70s
exit 1; full-player.log

npm.cmd run typecheck
All seven workspace tsc checks passed; exit 0; typecheck-final.log
```

Player failure is the same prior failure in
`src/session/surgeryCenterServicePreviews.test.ts:85`: expected Off-site thyroid
fine-needle aspiration in the pending label, received the general patient-care
pending text. It predates this follow-up and appears in the previous nurse and
UI handoffs. No unrelated chart/clinical change was made. The earlier temporary
HIRE_EMPLOYEE fixture error reported by the flaky-test worker is fixed to the
actual HIRE_STAFF API; final typecheck passes.

The ignored native player config uses the same React/private-module plugins.
It avoids the default bundled-config loader's sandbox-denied Windows subprocess;
production Vite configuration was not edited. Default Chromium is not installed
and installed Chrome launch returns spawn EPERM (`browser-probe.log`). No
installation was attempted. Compiled domain/player/approved-pose checks passed;
manager owns the real browser visual check and default-config rerun.

### Precise manager browser QA

1. Run the focused player command with `$env:PERIOP_OWNER_QA_EXPORT = '1'` to
   regenerate disposable paused saves/traces if needed; remove that environment
   variable afterward. Current files are
   `.local-dev/periop-owner-feedback/qa-level-2-save.json`,
   `qa-level-3-save.json`, and corresponding `qa-level-*-trace.json`.
   Level 2 is paused at tick 78 with both nurses assigned to named pre-op checks
   and two more visitors approaching beds. The first prep ends at tick 106;
   unpausing at 4x reaches the first procedure in roughly ten real seconds.
2. Launch the current player on an unused disposable QA origin, for example
   `npm.cmd run dev --workspace @gamify-surgery/player -- --host 127.0.0.1 --port 4183 --strictPort`.
   Open exact `http://127.0.0.1:4183`. This origin has separate storage from the
   owner's `http://127.0.0.1:4173` and the manager's other QA origin 5183.
   Use the normal owner/development access flow if the preview gate appears.
   Run the console seed below only on this disposable origin. It installs a
   single named QA campaign, disables tutorial interruptions, and reloads.

```javascript
{
if (location.origin !== "http://127.0.0.1:4183") throw new Error("Use disposable nurse QA origin 4183");
const level = 2; // Repeat with 3 for three nurses and mixed endoscopy/OR.
const response = await fetch(`/@fs/C:/Users/rowla/Projects/GamifySurgery/.local-dev/periop-owner-feedback/qa-level-${level}-save.json`);
if (!response.ok) throw new Error(`QA fixture fetch failed: ${response.status}`);
let serializedState = await response.text();
const state = JSON.parse(serializedState);
const campaignId = state.campaignId;
localStorage.setItem("gamify-surgery.prototype.profile.v1", JSON.stringify({
  schemaVersion: 2, activeCampaignId: campaignId, nextCampaignNumber: 1,
  tutorialsEnabled: false, tutorialIntroDismissedCampaignIds: [campaignId],
  tutorialDailyRoutineTipAcknowledgments: {}, tutorialDailyRoutinePauseByCampaign: {},
  campaigns: [{ campaignId, name: `Nurse queue QA L${level}`, status: "resumable",
    createdAtRealMs: 0, updatedAtRealMs: 0, serializedState }],
}));
location.reload();
}
```

3. Resume Nurse queue QA L2, inspect Periop `(38,26)` (approved 6x6, west door
   offset 0). Check each nurse's map info label. Unpause at 1x to watch short
   bedside walks and 15-minute standing checks; use 4x for the full flow. In
   Services watch the peri-op queue while four visitors settle. Both nurses
   work; finished checks release before required prep/recovery ends. Procedures
   and discharge remain gated. Staggered recoveries alternate between nurses.
   After all four depart, both walk to different staff stools and labels say
   Sitting between patient checks. Check visual bedside clearance and the
   companion/chair layers at the actual doors.
4. Repeat with level 3. The third nurse's home is Periop `(38,19)`, west offset
   0; all three can help patients in the first home. The real OR is `(33,18)`,
   4x4 with west/east doors offset 1; Endoscopy `(33,23)` is 4x3 with west/east
   offset 1. No room overlaps. Verify all three work, leave, and sit.
5. For a backlog, dismiss one nurse through Staff in the disposable L2 campaign
   or build a 3x3 Training Room `(29,19)`, east door offset 1 into the existing
   corridor, then request paid training. It leaves between checks. A lone nurse
   handles remaining checks in ready-time order, later prep extends, and the
   delayed chart/activity says Waiting for peri-op nurse. Save/reload during a
   walk or queued wait; completed minutes and nurse rotation survive.
6. For amenities, add a Coffee Kiosk `(30,24)` (2x2, east offset 1), and at L3
   a Staff Break Room `(24,23)` (4x4, north offset 2; connect hallway y22,
   x26..32). The focused domain test runs actual coffee trips, low-morale breaks
   and paid training with these legal rooms. Burst exports intentionally disable
   random retail opportunities and keep morale 100 to isolate dispatch. For
   automatic browser amenities, adjust only the disposable exported state before
   seeding: set periop nurse morale to 50 and each
   `state.retailNextOpportunityTicks['employee:' + employee.id]` to
   `state.facilityTick + 80`, then set serializedState to JSON.stringify(state).
   Observe coffee/break labels and return to a free stool during the quiet period.
7. In the real owner campaign, inspect the second/third nurse's assigned room
   and its operational access. Periop homes accommodate two nurses; three need
   another operational home. Compare new named Pre-op/Post-op checks with old
   Covering peri-op patients. If old coverage persists, inspect its unmarked
   active visits rather than assuming a new check reservation is stuck. The
   disposable fixtures verify new work without rewriting the owner's save.

No owner browser/save was read or modified. No Git/install/art/push/deployment
was performed. Manager retains visual acceptance and central integration; this
validated state is local only until an audited checkpoint. Manager owns the
owner reminder to say **"push to GitHub"** for the accepted worktree.

## Intermittent domain test failures

Sol worker, 2026-10-08. Cause: CPU contention under the default 15 file workers
(16 logical processors), not an observed state/cache/clock/RNG leak. The two
synchronous image-read tests finish their assertions but exceed Vitest's 5s
wall-clock deadline; the inventory test exhausts 68 seeded campaigns and exceeds
its existing 10s deadline. All 511 intake domain/balance/clinical source and test
hashes stayed unchanged through the controlled comparison. Fixed file seed
20261008 reproduces three timeouts at 15 workers and passes 3373/3373 at four.

Fix: added only `packages/game-domain/vitest.config.ts`, capping `maxWorkers`
at four. File isolation, all assertions, test timeouts and game behavior remain
unchanged. This applies to normal npm and direct Vitest commands and preserves
CLI overrides. It trades some suite speed for bounded CPU demand.

| Test | 15 workers, seed 20261008 | 4 workers, same file seed |
| --- | --- | --- |
| Image reads, 1 position | timeout, 7441ms | pass, 3167ms |
| Image reads, 2 positions | timeout, 7220ms | pass, 3020ms |
| Clinical inventory/boundary | timeout, 15146ms | pass, 6556ms |
| Endoscopy recovery/chart | pass, 4390ms | pass, 1684ms |

The reported Endoscopy failure was not reproduced as a failure here; its
assertions passed in every run. The archived guidance failure was the
`tip.progression.next-step` suppression assertion (`expected true to be false`),
not a timeout. All 50 current predicates pass, including shuffled targeted test
order (67/67 across the three requested files, 25.55s). Broad individual-test
shuffle also exposes three separate batch coverage collectors that depend on
running last; the full comparison shuffles files while preserving test order.
No assertion or unrelated coverage collector was changed.

Exact commands and summary output (full transcripts/JSON and hash evidence:
`.local-dev/intermittent-domain-tests/`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=15 --sequence.shuffle.files --sequence.shuffle.tests=false --sequence.seed=20261008 --reporter=default --reporter=json --outputFile=../../.local-dev/intermittent-domain-tests/fifteen-workers-files-seed-20261008.json
Test Files  2 failed | 105 passed (107)
     Tests  3 failed | 3370 passed (3373)
  Duration  105.33s (transform 36.32s, setup 0ms, import 188.06s, tests 759.36s, environment 11ms)
Exit 1; two 5000ms timeouts and one 10000ms timeout.

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=4 --sequence.shuffle.files --sequence.shuffle.tests=false --sequence.seed=20261008 --reporter=default --reporter=json --outputFile=../../.local-dev/intermittent-domain-tests/four-workers-seed-20261008.json
Test Files  107 passed (107)
     Tests  3373 passed (3373)
  Duration  142.54s (transform 6.52s, setup 0ms, import 53.10s, tests 419.14s, environment 7ms)
Exit 0; stable pre-edit control.

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --reporter=default --reporter=json --outputFile=../../.local-dev/intermittent-domain-tests/final-default-config.json
Test Files  107 passed (107)
     Tests  3373 passed (3373)
  Duration  138.97s (transform 6.29s, setup 0ms, import 54.78s, tests 489.32s, environment 8ms)
Exit 0; automatic config discovery, no worker-count override.

npm.cmd run typecheck --workspace @gamify-surgery/game-domain
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit 0 at 10:49:04; typecheck.log.
```

Concurrent round-three radiology edits landed at 10:49:39-41, during the final
normal-command run (10:47:45-10:50:04). They were preserved. The stable A/B
comparison precedes these edits; the last full run is not acceptance of the
newer shared tree. A later typecheck returned exit 1 for the new concurrent
nurse fixture, outside this lane:

```text
tests/periop-nurse-flow-fixture.ts(56,36): error TS2820: Type '"HIRE_EMPLOYEE"' is not assignable to type '"ACKNOWLEDGE_ALERTS_TUTORIAL" | "ACKNOWLEDGE_DECISION_FEEDBACK" | "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK" | "ACKNOWLEDGE_TERMINAL_FEEDBACK" | "ADMIT_PATIENT" | "ADVANCE_TICK" | ... 35 more ... | "UPGRADE_ROOM"'. Did you mean '"FIRE_EMPLOYEE"'?
```

All runs used `--pool=threads` because the sandbox can reject forks with spawn
EPERM; the production/default pool was not changed. Manager next: inspect the
8-line config delta, let the concurrent lanes finish, then rerun the ordinary
default-forks domain command and typecheck on the stable aggregate. Only this
config and appended coordination handoffs belong to this worker. No Git,
installs, clinical content, browser, save or playtest-pathway changes. Local-only;
manager retains acceptance and the scoped "push to GitHub" checkpoint reminder.
- 2026-10-08: intermittent domain failures: cause CPU-load timeouts (reproduced with seed 20261008); fix new packages/game-domain/vitest.config.ts maxWorkers: 4 (no assertion/timeout/behaviour change). ACCEPTED; manager default-run confirmation after round-3 workers finish.
- 2026-10-08: OWNER DECISION exterior: Option B plus manager recommendations (warm-gray stone beds with white/pink blooms, flush warm-stone entry inset, no canopy/sign, grouped flowers). Build worker queued after the concept worker finishes (plan docs/execplans/exterior-frontage-b-20261008.md).


## Compact Goals and Alerts

Sol worker, 2026-10-08. Implemented the owner's compact-spacing request across
all Goals levels and both Alerts board modes. Goal tracks now fit their content
instead of stretching to fill the panel. The Level 3 optional chip stays beside
the Advance area. Empty Needs you is one slim `Needs you / All quiet.` line;
active cards expand inside the board over 160ms, with no transition under
reduced motion. All existing font sizes, line heights and `--font-read` /
`--font-pixel` tokens are preserved. The day divider retains full dark/light
contrast and its existing protections against dimming and overlays.

Files: `apps/player/src/ui/goalsPanel.css`, `NeedsYouTray.tsx`,
`NeedsYouTray.test.tsx`, `apps/player/src/styles/global.css` (exact edits only in
the Alerts block), and `clinicPresentation.test.ts`. AppShell, domain, character,
clinical and other workers' files were not edited. Eight added checks cover
quiet/active/resolved and Build tray states, spacing, fonts, narrow wrapping,
reduced motion and the day divider. Intake snapshots, UTF-8 logs and source
hashes are in `.local-dev/compact-goals-alerts/`; all five source/test hashes
stayed unchanged through final validation. Edited files are UTF-8 without BOM.

| Spacing | Before | After |
| --- | --- | --- |
| Goals minimum height / list growth | 180px desktop, 220px base; list flex-grow 1 with stretched grid tracks | Content height, no minimum floor; flex-grow 0 and max-content tracks |
| Goal row gap | .22rem desktop / .35rem base | 3px |
| Goal list padding (block / inline) | .35rem / .45rem desktop; .55rem / .65rem base | 4px / 6px |
| Goals bottom padding; Advance gap / bottom margin | .65rem; 6px / .65rem | 0; 4px / 6px |
| Optional chip block padding / inner gap | 4px / 6px | 2px / 4px |
| Clinic zone label padding | 8px top, 4px bottom, 10px sides | 4px block, 8px sides; quiet header 2px block |
| Quiet zone content / divider | Separate 14px paragraph plus padded cards container / 2px border | Inline 14px status, zero-height empty expansion / 1px border |
| Needs card-stack gap / block padding | 6px / 4px top, 8px bottom | 4px / 2px top, 6px bottom |
| Ticker row block padding / row gap | .18rem desktop or .25rem base / .35rem | 2px / 2px |
| Feed action copy/link gap | .12rem | 1px |
| Feed paragraph block margins | .2rem desktop or .3rem base top / 0 bottom | 2px / 0 |
| End-of-day divider padding | 10px | 6px block / 10px inline |

Validation used the normal player Vite config with the previously documented,
command-local `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`
for Vite's optional Windows `net use` probe. No dependency or runtime config
changed. Exact commands and summary output:

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/ui/GoalsPanel.test.tsx src/session/level3GoalsViewModels.test.ts src/ui/NeedsYouTray.test.tsx src/ui/EventMessageBoard.test.tsx src/session/clinicFeedPresentation.test.ts src/styles/clinicPresentation.test.ts src/session/guidanceTipsView.test.tsx src/ui/ManagementPanel.test.tsx src/facility/ClinicMapPins.test.tsx --pool=threads --maxWorkers=1
Test Files  9 passed (9)
     Tests  64 passed (64)
  Duration  4.86s (transform 1.66s, setup 0ms, import 3.87s, tests 178ms, environment 1ms)
Exit 0; player-focused-default.log.

npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
Test Files  1 failed | 132 passed (133)
     Tests  1 failed | 1053 passed (1054)
  Duration  62.22s (transform 3.22s, setup 0ms, import 32.96s, tests 16.40s, environment 9ms)
Exit 1; player-full.log.

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
Exit 0; all seven workspace scripts PASS; elapsed 4.373916s; typecheck.log.
```

The only FULL player failure is the already recorded
`src/session/surgeryCenterServicePreviews.test.ts:85:52`: expected pending-label
text `Off-site thyroid fine-needle aspiration`, received `The result is pending.
Patient care and return are still in progress...`. The same assertion and
received label appear in `.local-dev/alerts-events-validation/m3-fix-player-full.log`
and `.local-dev/periop-nurse-attention/full-player.log`, predating this lane.
No chart/clinical fix was attempted. The in-progress nurse fixture error from
the earlier worker handoff is absent from this final typecheck.

Manager browser QA (worker sandbox cannot launch a browser):

- At desktop 1280x800 and short desktop 1280x720, check every Goals level,
  especially Level 3: close-packed main labels/progress, optional chip beside
  Advance, readable unchanged text, focus tooltip and scrolling of expanded
  procedure setup. Advance must remain reachable.
- At 360px width, check goal/chip wrapping, speaker and full time labels,
  readable feed bodies and priced actions, no horizontal clipping, and the
  existing 44px feed action minimum height.
- In a synthetic campaign, compare quiet -> one dire card -> resolved, both
  normal and Build Mode. Quiet is one slim line with the feed immediately below;
  cards expand within the panel while map and HUD positions remain fixed.
  Repeat with reduced motion enabled; expansion must be immediate.
- Fast-forward a day rollover and add humor/Tip/action rows: compact row spacing,
  full-contrast dark day divider, intact NEW marker and no overlap of text/actions.

No browser/save or opening pathway changed. Owner remains `START_GAME.cmd` ->
exact `http://127.0.0.1:4173` in the usual persistent profile. Manager's separate
QA origin `http://127.0.0.1:5183` has separate storage. Lane ready for manager
review; no open product decision. Work is local only; manager retains acceptance
and the scoped **"push to GitHub"** checkpoint reminder. No Git, installs,
push or deployment performed.
- 2026-10-08: Compact Goals and Alerts ACCEPTED after browser check (empty Needs-you collapses to one line "All quiet."; tighter rows). Exterior concepts A/C/finish variants delivered (concept-03..07). Exterior build hit "model at capacity" after 14 min; auto-resume with backoff running.

## Second radiologist idle: fix

2026-10-08, Sol worker, diagnosis before source edits. Reproduction uses the
approved 4x4 four-cubicle Reading Room, actual `HIRE_STAFF`/dismissal commands,
west door offset 1, the connected corridor and founder-desk door, and normal
`ADVANCE_TICK` simulation. New appointments, discussions and unrelated arrivals
are held until after the observation period to isolate reading work. This is
the shared Level 3/4 approved room design; the playable prototype still caps
facility progression at Level 3.

Evidence before fixing (`.local-dev/second-radiologist-idle/reproduction-before-v3.log`):
`Test Files 1 failed (1); Tests 2 failed | 2 passed (4); exit 1`, 11:27:56.
Two fresh hires at northwest/northeast earn outside income normally. With
three real hires followed by dismissal of the northeast reader, the remaining
two retain northwest/southeast assignments. Northwest completes 8 outside
reads/$40 over 70 ticks; southeast completes 0/$0. Southeast reaches its own
seat at tick 29, is routed to northwest at 30, returns at 37, and is routed away
again at 38. Its assigned seat is reachable: displacement recovery mistakes
the endpoint-only chair tile for standing outside the building and returns it
to the room's generic northwest staff anchor, cancelling each outside read.

A separate queued-study reproduction quotes two ready studies before starting
either. Both quote the northeast reader; the first runs, the second remains
`waiting_for_resources` while northwest is available. The quote's predicted
reader was being treated as an actual reservation. Fix direction: recognize an
assigned Reading seat as a valid employee location, and keep new read quotes
unassigned until the existing execution allocator selects an available station.
Preserve already committed saved readers, durations, receipts and additive $5
settlement.

An additional ordinary-campaign reproduction leaves a real team discussion
unopened. The northwest reader stays seated but completes 0 reads instead of
8 because outside-work availability treats the waiting card as active duty.
`pending-discussion-before.log`: `Test Files 1 failed (1); Tests 1 failed | 23
skipped (24); exit 1`, 11:57:29. This explains a separate "Ready" label with
no income even for the fresh northwest/northeast pair.

Implemented with four narrow source changes:

- `packages/game-domain/src/staff.ts`: an employee at their assigned Reading
  seat counts as inside the building even when that chair is an endpoint-only
  navigation tile. Idle readers stay at their own posts; other duties retain
  their travel priority.
- `packages/game-domain/src/diagnostic-timing.ts`: new local interpretation
  quotes retain the accepted room/upgrade/training timing but leave `resource`
  null. The existing real-work dispatcher assigns an available reader and
  station when the study is ready. Forecast employee paths still predict the
  reader. Already saved explicit reservations and active reads keep their
  reader, remaining work and settlement contract.
- `packages/game-domain/src/level-three-support.ts`: after a real break, a
  radiologist returns directly to their own station instead of the generic
  northwest desk. The existing 30-minute break and 240-minute cooldown remain.
- `packages/game-domain/src/radiologist-read-income.ts`: an unopened team
  discussion and a completed summary permit outside reading. Active discussion
  travel/action/feedback still stops outside work, including before a facility
  task is attached. Discussion scheduling and learning results retain their
  existing workflow.

Regression files:

- `packages/game-domain/tests/reading-radiologist-gameplay.test.ts`: 24 cases,
  using the production pinwheel masks, actual hires and normal reducer ticks.
  Tests two fresh readers, retained northwest/southeast readers, two ready
  studies at both seat combinations, all four seats with all 16 door positions,
  recovery of an old saved wandering path without income on load, real breaks,
  continuous per-reader receipts and Reading upgrade level 4 time modifiers.
  Also tests a real automatically queued team discussion, all active discussion
  stages stopping outside work, and a completed summary allowing it to resume.
  In the reproduced 70-tick northwest/southeast campaign, both now complete
  8 outside reads/$40 each (16 reads/$80 total), versus 8/$40 and 0/$0 before.
- `packages/game-domain/tests/diagnostic-timing.test.ts`,
  `employee-training-benefits.test.ts`, and
  `gs028-20261007-variety2-batch.test.ts`: quote assertions now inspect the
  predicted employee path, separately from actual reservations. Saved explicit
  reader choices and the full training/actual-CT execution checks remain.
- `packages/game-domain/tests/service-operations.test.ts`: the legacy manual
  $40 read is still paid exactly once and retains its receipt through reload.
  Subsequent idle time also earns automatic outside fees; the ledger assertion
  now checks both sources and their exact sum instead of assuming only one row.
- `apps/player/src/session/radiologistReadIncomeViewModels.test.tsx`: two
  actual two-hire/retained-seat campaign cases show both independent outside
  activity labels, live $5 work rows, seated station supports and matching
  today/current-level income counts.
  These campaign cases leave ordinary automatic team discussions enabled.
- `apps/player/src/session/readingRoomRadiologists.test.ts`: all four fractional
  rendered seat contacts match `DIAGNOSTIC_READING_WORKSTATIONS`. Paths end at
  each station's integer staff anchor; presentation maps that station ID to
  its approved fractional seat contact/facing. Divider and backing geometry
  and the 16 allowed door segments were not changed.

Outside jobs still require an assigned, operational station, arrival at that
seat and availability for work. Movement, training, breaks and actual other
duties stop outside jobs. Center reads preempt long outside work; an outside
read with at most one minute left finishes before the same reader changes
work. The existing modifier, money-presentation, end-of-day, no-feed-spam and
additive/split-save tests all run in the focused Reading cohort. No new fees,
receipt types, alerts, clinical content or save migration were introduced.

Browser steps for manager acceptance:

1. Use a synthetic QA campaign with the approved 4x4 Reading Room and a real
   door/corridor connection. Hire two radiologists and wait for their arrival.
   With no center studies queued, both should sit at their own desks, say
   "Reading an outside study", show two live outside-read rows, and add $5
   per completed read to Services & income. Check both staff money popups and
   that the feed does not acquire a row per read.
   Leave a team discussion unopened: outside earnings must continue. Opening
   an active discussion should stop that reader's outside job; resolving it
   should permit work to resume even with the finished summary still visible.
2. In that synthetic campaign, hire a third reader and dismiss the northeast
   reader to retain northwest/southeast. The southeast reader must remain in
   his own chair, resume outside work after breaks and never bounce back to
   northwest. Check the owner's existing campaign's actual station assignment
   before attributing their symptom: no owner save was supplied, and a fresh
   northwest/northeast pair already worked when the queue was empty.
3. Have two acquired center studies become ready together (two staffed
   acquisition rooms work for a real UI check). Confirm both readers handle
   different named patients at different desks, each pays one additional $5,
   then each resumes outside work. A single scanner's widely spaced studies
   need not keep two radiologists busy on center work simultaneously.
4. Check north/east/south/west door positions, especially a door behind a
   reader's cubicle, with four hires. Each integer route must reach that
   station's displayed seat; no reader should cross a divider or use another
   reader's chair. Confirm the seat facings and layering in the browser.
5. Reload while the second reader is walking, reading or on break. Loading
   must not add money; after returning to his station he must earn continuously.
   Check Services today/this-level counts and the end-of-day money total.
   Existing split work retains its saved $115+$5 settlement; a newly accepted
   base ultrasound pays $120+$5. No repricing or retroactive payments occur.

Owner opening pathway remains `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent browser profile. Browser QA is
pending manager review; no launcher, browser origin or owner save was changed.
All source/docs/transcripts are saved as UTF-8 without BOM. Work is local only;
no Git, installs, commits, push, deployment or art changes. Manager retains
acceptance and the scoped **"push to GitHub"** backup reminder.

Final validation (2026-10-08). All runs use `--pool=threads --maxWorkers=1`
because the worker sandbox blocks Vitest's default child-process pool with
`spawn EPERM`, as documented in `AGENTS.md`. Player uses the existing scratch
native-loader config after ordinary Vite config bundling hit a blocked
`net use` spawn. It retains the production React and private-module boundary
plugins, without changing the production config or test selection. Its
`MODULE_TYPELESS_PACKAGE_JSON` warning is unchanged and non-failing.

Focused domain, including all 24 production-layout reproduction cases,
training, modifiers, additive/legacy settlement, persistence and existing
Reading Room contracts:

```text
npm.cmd run test -w @gamify-surgery/game-domain -- tests/reading-radiologist-gameplay.test.ts tests/reading-stations.test.ts tests/room-upgrade-reading.test.ts tests/radiologist-read-income.test.ts tests/diagnostic-timing.test.ts tests/diagnostic-timing-persistence.test.ts tests/level-three-support.test.ts tests/employee-training-benefits.test.ts tests/service-operations.test.ts --pool=threads --maxWorkers=1

 Test Files  9 passed (9)
      Tests  277 passed (277)
   Start at  12:11:46
   Duration  35.43s (transform 1.65s, setup 0ms, import 5.51s, tests 29.07s, environment 1ms)
exit 0
```

Transcript: `.local-dev/second-radiologist-idle/focused-domain-integrated.log`.
The two actual-CT/away-reading training cases were also checked separately:
`Tests 2 passed | 366 skipped (368); exit 0`, then included in the full suite.

Focused player, including two actual-hire campaigns with automatic unopened
team discussions enabled, both labels/receipt counters, seat contacts and
Services & income rendering:

```text
npm.cmd run test -w @gamify-surgery/player -- src/session/radiologistReadIncomeViewModels.test.tsx src/session/readingRoomRadiologists.test.ts src/session/characterActivityPresentation.test.ts src/ui/ServiceIncomePanel.test.tsx --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native

 Test Files  4 passed (4)
      Tests  19 passed (19)
   Start at  12:14:28
   Duration  5.62s (transform 2.46s, setup 0ms, import 4.54s, tests 583ms, environment 0ms)
exit 0
```

Transcript: `.local-dev/second-radiologist-idle/focused-player-integrated.log`.

Full game-domain:

```text
npm.cmd run test -w @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

 FAIL  tests/periop-nurse-real-visit.test.ts > Peri-op nurses through the real chart UI command pipeline > holds real pre-op and recovery beyond their timers when both nurses are away training, including reload
TypeError: .toMatch() expects to receive a string, but got object

 Test Files  1 failed | 109 passed (110)
      Tests  1 failed | 3417 passed (3418)
   Start at  12:14:28
   Duration  565.54s (transform 3.73s, setup 0ms, import 53.28s, tests 500.81s, environment 8ms)
exit 1
```

Transcript: `.local-dev/second-radiologist-idle/full-domain-final.log`.
The only failure sampled the concurrent peri-op worker's old string-matcher
assertion while that worker was editing its test. Its fixture has no Reading
Room or radiologist. This worker did not edit that lane. After the peri-op
worker changed the assertion, a read-only rerun of the current file passed:

```text
npm.cmd run test -w @gamify-surgery/game-domain -- tests/periop-nurse-real-visit.test.ts --pool=threads --maxWorkers=1

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  12:30:23
   Duration  14.73s (transform 1.23s, setup 0ms, import 1.61s, tests 13.05s, environment 0ms)
exit 0
```

Transcript: `.local-dev/second-radiologist-idle/concurrent-nurse-final.log`.
The full result above remains the recorded full run; the subsequent 5-test
pass does not claim a new full-suite pass. Concurrent nurse changes in
`staff.ts` were preserved; the final 277 Reading checks, 19 player checks and
root typecheck include the latest shared movement source. Manager should run
the aggregate checks after all writing lanes are frozen.

Full player:

```text
npm.cmd run test -w @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../.local-dev/radiologist-read-income/vitest-player.config.mjs --configLoader native

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
at src/session/surgeryCenterServicePreviews.test.ts:85:52

 Test Files  1 failed | 136 passed (137)
      Tests  1 failed | 1091 passed (1092)
   Start at  12:01:54
   Duration  76.79s (transform 3.76s, setup 0ms, import 35.61s, tests 27.75s, environment 9ms)
exit 1
```

Transcript: `.local-dev/second-radiologist-idle/full-player-final.log`.
This is the same previously recorded pending-label assertion: the external
thyroid service has no radiologist interpretation phase, and its route-name
assertion passes. Left unchanged for the chart lane/manager to reconcile.

Root typecheck:

```text
npm.cmd run typecheck

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present

> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json

> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
exit 0
```

Transcript: `.local-dev/second-radiologist-idle/typecheck-final.log`.
All seven workspace checks passed. No balance production values changed in
this bug fix; the additive milestone's full balance suite remains 70/70 PASS.
- 2026-10-08: Pediatric Exam mockup: manager browser validation PASS, capture PASS; visual review good; decision: 12 one-tile door sections (game model) instead of 16; fix sent. Peri-op nurse owner-feedback fix received (dispatch bias to first employee ID; idle release waited for random actions): accepted pending owner check.
- 2026-10-08: OWNER: Pediatric Exam approved conditional on backless rolling stools (clinician drawn on top); same rule applied in game. Launched game-stool and wound-ostomy mockup workers; ped-exam stool revision queued after the 12-door fix.
- 2026-10-08: OWNER: peri-op nurses still stand there after the fix. Manager evidence: in the injected L2 clinic the nurse had no task and was frozen mid-path (pathIndex 3/4) for ~650 minutes; fixture had no endoscopy traffic. Sent nurse2 brief (end-to-end endoscopy pipeline test + frozen-path fix).

## Backless rolling stools

Sol worker, 2026-10-08. Owner-approved bounded game rendering change complete
locally; ready for manager diff review and browser acceptance. No agents, Git,
installs, commits, push, deployment, browser/save changes or clinical edits.

### Files and behavior

- New `apps/player/src/facility/backlessRollingStools.ts`: explicit inventory of
  seven approved rolling-stool crops and the already-backless legacy bitmap;
  versioned `backless-v1` runtime alpha derivations for the two backed stools.
  Crop identity, rather than room identity, makes reused art follow the rule.
- `apps/player/src/facility/FacilityScene.ts`: exact edits only in the stool
  import, cached derivative helper, approved furniture draw, and reused
  touch-up sprite draw. Both ordinary and tinted copies use the derivative.
  Stools bypass foreground-chair splitting; the whole clinician draws above.
- `apps/player/src/facility/approvedRoomPresentation.ts`: align a stool sitter's
  rendering-only `fixtureGround` with the stool's actual painter baseline,
  including exam, minor-procedure, ultrasound, training, phlebotomy and
  fallback support binding. This fixes small bitmap-bottom extensions without
  changing seat/ground contacts, positions, facing, dimensions or movement.
- New `apps/player/src/facility/backlessRollingStools.test.ts`: 21 tests cover
  all ten approved stool draws, both endoscopy orientations, renamed idle
  supports, bitmap/procedural occupants, three render scales, empty redraws,
  legacy bitmap/procedural stools, derivation preservation/caching and tinting.
- Append-only receipts here and in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

The approved source art is never overwritten. Minor Procedure's green stool
and Ultrasound's blue stool have backs/posts; Endoscopy reuses the former.
Their derivatives retain the full original crop dimensions. Alpha removes the
backrest/post; same-row neighboring cushion pixels restore the narrow covered
seat strip, and an exposed same-crop column sample restores the short covered
column strip. The remaining cushion sides and the lower column/base/casters
remain byte-exact. This is deterministic source-derived rendering, not new
artwork. Runtime textures are cached once per source/version and shared by
room instances and the Endoscopy touch-up.

Runtime derivation provenance (existing approved production atlases):

| Derivative | Approved source | Crop [x,y,width,height] | Source SHA-256 |
| --- | --- | --- | --- |
| `backless-v1:minor-procedure` | `gs015:minor-procedure:furniture`, `apps/player/public/art/rooms/gs015-v1/minor-procedure/furniture.webp` | `[8,2448,266,427]` | `0532e455112d364b21b1ae6d1fd482593c76357d1a3e73d966c9bd18291c9722` |
| `backless-v1:ultrasound` | `gs015:ultrasound:furniture`, `apps/player/public/art/rooms/gs015-v1/ultrasound/furniture.webp` | `[8,1582,351,516]` | `4598071860b8332bf24fe3ab1d0bde95a60de24cb82d6096576093a19ad07c78` |

Audit: Examination 0/270, Minor Procedure 0, Ultrasound 0, Phlebotomy 0/270,
both Peri-op/Recovery nurse stools and both Training stools are all bound;
Endoscopy 0/270 uses the same derived minor-procedure source. Legacy bitmap
and procedural Examination fallbacks are already backless. CT, X-ray and
Ambulatory OR have no rolling-stool draw in the current approved presentation.
Pharmacy's step stool is a different, already-backless object. Ordinary chairs
retain their existing arm/back layering. `approvedSideChairLayers.ts`, approved
proof data, frozen before-layering fixture, `roomTouchups.ts` and
`staffIdleSupports.ts` remain unchanged from intake. All eight stool-source
atlas files retain their intake SHA-256; all edited source/tests are UTF-8
without BOM. All four lane source/test hashes stayed unchanged during the final
full-player/typecheck and focused runs. Concurrent exterior/radiology/nurse
work was preserved; the intake-to-current full FacilityScene diff also contains
exterior work that is not this worker's change.

### Exact validation output

The normal player Vite configuration is unchanged. The ordinary invocation
first hit the documented optional Windows `net use` realpath `spawn EPERM`.
Using the existing command-local preload let config load; the default forks
pool then failed to start all nine requested test-file workers (`spawn EPERM`):

```text
Test Files  no tests
     Tests  no tests
    Errors  9 errors
  Start at  11:55:34
  Duration  10ms (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)
Exit 1; focused-default.log. This is not a test assertion failure.
```

Final runs used `--pool=threads --maxWorkers=1`, with the existing command-local
preload only for Vite's optional Windows probe:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/backlessRollingStools.test.ts src/facility/furnitureSeatLayering.test.ts src/facility/approvedSideChairLayers.test.ts src/facility/approvedRoomPresentation.test.ts src/facility/approvedRoomRenderer.test.ts src/facility/staffIdleSupports.test.ts src/facility/roomTouchups.test.ts src/facility/periopCompanionPresentation.test.ts src/facility/characterPauseArrival.test.ts --pool=threads --maxWorkers=1
```

```text
Test Files  9 passed (9)
     Tests  111 passed (111)
  Start at  12:01:15
  Duration  8.94s (transform 1.70s, setup 0ms, import 4.18s, tests 4.04s, environment 0ms)
Exit 0; focused-threads-final.log.
```

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

```text
Test Files  1 failed | 136 passed (137)
     Tests  1 failed | 1091 passed (1092)
  Start at  11:59:26
  Duration  57.86s (transform 3.19s, setup 0ms, import 28.25s, tests 18.72s, environment 7ms)
Exit 1; player-full.log.
```

Only failure: the previously documented
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, "ignores the retired
concealment flag and preserves the scheduled external service after an
answer". Expected pending-label substring `Off-site thyroid fine-needle
aspiration`; received `The result is pending. Patient care and return are still
in progress...` with stage timings. All facility tests, including all 21 new
stool tests, pass. No unrelated chart/clinical correction was attempted.

```text
npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present

> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json

> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit 0; typecheck-final.log (4.035409s).
```

The first typecheck caught a concurrent exterior test's `bloomAccents` property
error, which that lane corrected before the final PASS. An initial stool test
harness lacked the unrelated Recovery procedural graphics double; that test
harness was corrected, and the final focused/full runs above cover Recovery.

Actual TypeScript derivation was also executed against decoded approved crop
RGBA, then composited onto a neutral background and visually inspected:

```text
minor-procedure: 266x427; backrest alpha total=0; lower column/base/casters byte-exact=true
ultrasound: 351x516; backrest alpha total=0; lower column/base/casters byte-exact=true
```

Evidence in `.local-dev/backless-rolling-stools/`: UTF-8 test logs, intake
copies/hash manifests, reviewed source diffs (including a stool-only
FacilityScene hunk extract), original crop inventory/contact sheet, actual
TypeScript-derived crop pixels and `actual-runtime-derived-comparison.png`.
These pixel previews and Node scene doubles are not a browser pass.

### Rooms for manager browser acceptance

Use the existing manager-owned disposable QA origin/profile (e.g. exact
`http://127.0.0.1:5183`) and a synthetic campaign. Confirm the actual origin
before seeding; it has separate saves from the owner's canonical
`START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the usual persistent profile.
This worker opened no browser and changed no launcher/origin/save pathway.

| Room/state | Check |
| --- | --- |
| Examination, 0 and 270 | Empty and founder/clinician-occupied green stool; original seat/contact stays fixed, whole sitter above the stool, seat edge/column/base visible below. |
| Minor Procedure, 0 | Green stool has no back or vertical back post, including when empty. During seated care/arrival settle/redraw the whole clinician stays above; repaired cushion has no central transparent hole. |
| Ultrasound, 0 | Same checks for blue stool during care and idle sitting; compare inactive light and active-scan dimming so no tinted copy restores the back. |
| Endoscopy, 0 and 270 | Endoscopist idle stool at existing touch-up coordinates is backless and below the whole sitter. Rotation, pause/resume and empty redraw retain it. |
| Phlebotomy, 0 and 270 | Both red clinician stools stay backless/below seated or idle staff; the patient's collection chair still has its existing front-arm treatment. |
| Peri-op/Recovery, 0 | Both nurse station stools when occupied/empty; seat, pedestal and casters remain visible, no stool foreground over either nurse. Separate station monitors retain their existing order. |
| Training, 0 | Both north-facing trainees sit wholly above their already-backless green stools; no post/back introduced and no seat shift. |
| Legacy fallback visual harness | If manager exercises the legacy bitmap/procedural Examination paths, both remain backless with their existing geometry. These are covered by Node tests and are normally superseded by approved room art. |

Inspect at default/close zoom with average and larger clinician identities.
Allow the existing 180ms arrival settle, then pause; also check leave/reseat,
room redraw/rotation and a passing walker. Retain ordinary Waiting/Telehealth/
Reading/Surgeon Office/Peri-op companion armrest layers as a visual cross-check.
Manager retains actual-browser acceptance and an ordinary-forks rerun in its
own environment. No open product decision. State is local only; manager owns
integration and the scoped **"push to GitHub"** checkpoint reminder.
- 2026-10-08: Pediatric Exam APPROVED (approval-2026-10-08.md) after backless-stool revision; manager browser validation PASS. Wound/Ostomy mockup ready (browser PASS); game backless stools done (tests PASS), owner to confirm in game.


## Peri-op nurse queue: second fix

Sol worker handback for the 2026-10-08 second owner-feedback brief. The two
production changes are confined to peri-op idle movement and its activity label.
New tests drive real admissions and chart orders through the ordinary reducer;
the queue, clinical content, balance constants, other staff and rendering lanes
are preserved. No Git, installs, art, browser, owner-save or external operation.

### Cause and diagnosis

- `pathIndex` is zero-based: index 3 on a four-point path is **finished**, with
  zero remaining nodes. `(36,26)` in the manager's `(34,24)` Periop room is the
  authored `recovery:stool-1` idle contact. There is no movement gate requiring
  a `facilityTask`: unfinished employee paths normally advance before the
  task/idle branches.
- The previous fix introduced a real idle gate: `settleIdlePeriopNurse` returned
  `true` on every tick at a free staff seat. That bypassed the existing
  `nextIdleActionAtFacilityTick` schedule forever. Before this runtime edit,
  the new legal-clinic quiet-period regression observed **one position per
  nurse for 240 minutes**. Finished seat paths were retained, explaining the
  misleading unchanged path index in the manager's samples.
- A second regression found that an unfinished saved idle path could still
  walk through an obsolete solid bed footprint. The normal movement branch
  followed saved nodes without checking current furniture/door edges. This
  was a route-safety gap, rather than evidence that the manager's completed
  path was unfinished.
- The manager's exact `.local-dev/claude-motion-jumps/harness.ts`
  `levelTwoClinic()` was also run, using the actual `DEV_FAST_FORWARD` command
  for **65 x 10 minutes**. Its approved 6x6 Periop footprint overlaps the Front
  Desk, Phlebotomy and hallway instances 26–31. The nurse has **no operational
  assignment in all 65 samples**, and there are **zero service operations**.
  This fixture cannot validate the care queue. With the idle fix, sampled
  positions are `(36,26)`, `(37,26)`, `(35,26)` and `(35,25)`, and completed
  routes clear to `path: [] / pathIndex: 0`. Its truthful label is
  `Needs an operational Peri-op room`.
- A normally admitted real `case.colorectal.routine-screen` patient does reach
  `diagnostic-physical-work.v1` through the chart's diagnostic-order path,
  with the attention opt-in marker, real Periop bed and preparation/recovery
  station IDs. No phase/kind/room/legacy flag bypass was found in this path.
  Four actual chart orders exercised both nurses concurrently, without
  `cover_periop`. The owner's campaign was not supplied or opened; the broken
  QA layout should not be used to infer its room/staff configuration.

### Fix and files

- `packages/game-domain/src/staff.ts`: a seated peri-op nurse holds only until
  the existing idle-action deadline, then participates in the existing seeded
  idle behavior. Settling after a short walk/check still gives the configured
  minimum sitting interval. Finished idle paths clear; obsolete in-room idle
  edges are abandoned before movement, allowing a fresh legal route. Edge
  validation uses the facility graph, preserving the approved **diagonal
  corner-door bridges**. Task, training, retail and exterior hiring travel keep
  their own controllers. The concurrent radiologist station fix is preserved.
- `apps/player/src/session/characterActivityPresentation.ts`: an idle walk
  inside Periop says `Taking a short walk`; return travel and walking to a
  staff seat retain their specific labels. Existing named check labels remain.
- `packages/game-domain/tests/periop-nurse-real-visit-fixture.ts` (new): approved
  nonoverlapping Level-2 room layout, valid real doors, normal hires and public
  reducer commands for arrival/check-in/chart/order/feedback/time/discharge.
  No patient step, service phase, bedside task or timer is hand-constructed.
- `packages/game-domain/tests/periop-nurse-real-visit.test.ts` (new): full visit,
  four close arrivals, both nurses, two exact 15-minute checks per visit,
  physical walking/adjacency, procedure/discharge gates, paid training delays,
  save reload, 240-minute quiet period and obsolete saved idle path.
- `apps/player/src/session/periopNurseRealVisit.test.ts` (new): compiles that
  real visit through `createPrototypePlayerView`, checks the approved 6x6 room,
  standing/seated supports, Services queue count and named labels, and observes
  both nurses physically walking on automatic coffee-kiosk trips. One chooses
  a drink and the other coffee through the existing retail product selection.
- Existing `periop-nurse-owner-feedback.test.ts` and player
  `periopNurseOwnerFeedback.test.ts`: quiet-period checks now witness nurses
  returning to seats over time, allowing the requested subsequent idle walks
  instead of requiring permanent sitting at one arbitrary tick.
- This section and a short append to `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

Idle behavior available today is staff-seat sitting and short in-room walks,
automatic optional coffee/drink shopping, requested paid training and Level-3
Break Room breaks. **Employee bathroom trips are not implemented** by the
existing amenity engine (it covers patients/visitors/companions and the founder);
this bounded fix does not introduce a new employee amenity system. No new
timing/clinical claims, save schema, admission alerts or drawing/layering changes.
The existing owner-tuned 15-minute constants, modifiers and legacy-save policy
remain: unmarked old visits finish under their accepted timers without adding
new checks; newly accepted visits opt in. Existing focused/full tests cover
modifiers, legacy room-coverage release and save round trips.

### End-to-end evidence

The normal single visit begins with admission at tick 50 and physical check-in
at 69. The chart orders colonoscopy; the patient walks to the real WC bed:

| Event | Facility tick | Evidence |
| --- | --- | --- |
| Pre-op phase / nurse dispatched | 76 | Patient at `(39,28)`; nurse walking from a staff seat |
| Pre-op nurse attention | 77–92 | Nurse at valid bedside `(39,27)`, exactly 15 minutes |
| Existing preparation finishes | 106 | Check completed inside the existing 30-minute phase |
| Procedure | 111–156 | Pre-op completion witnessed before entering Endoscopy |
| Recovery / second nurse dispatched | 161 | Actual return to the reserved Periop bed |
| Post-op nurse attention | 163–178 | Other nurse walks to bedside; exactly 15 minutes |
| Recovery ends / discharge | 221 / 223 | Post-op completion witnessed before departure |
| Chart completes / quiet period | 229 onward | Both sit/walk; automatic kiosk trips complete |

The four-patient run completes all eight checks and all visits by tick **438**.
Both nurse IDs work concurrently. Ethan's pre-op required end is 165; his
backed-up check runs 160–175, adding **10 minutes** before procedure departure.
Sending both nurses to paid training after the real order and again before
recovery produces pre-op check **153–168** against required end **106**, and
post-op **294–309** against required end **283**. Both phase gates
hold, training nurses are unavailable, and reload preserves the queued work
without restarting/duplicating its timer. This delayed visit resolves at 317.

Both nurses' activity labels were printed over the actual visit and quiet
period. Representative pairs (complete UTF-8 trace is in the evidence folder):

| Tick | Ari | Dakota |
| --- | --- | --- |
| 51 | Sitting between patient checks | Sitting between patient checks |
| 64 | Taking a short walk | Sitting between patient checks |
| 76 | Walking to pre-op check · Maya Reed | Sitting between patient checks |
| 77 | Pre-op check · Maya Reed | Sitting between patient checks |
| 161 | Sitting between patient checks | Walking to post-op check · Maya Reed |
| 163 | Sitting between patient checks | Post-op check · Maya Reed |
| 244 | Buying a drink | Going to get coffee |
| 252 | Walking to a staff seat | Getting coffee |
| 254 | Walking to a staff seat | Walking back from the coffee kiosk |

Trace coordinates and movement flags use the **player projection**; retail
travel has its own actor controller and can differ from the raw employee path.

### Exact validation output

Before runtime fix (quiet/stale-route regression):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/periop-nurse-real-visit.test.ts
```

```text
 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Duration  4.27s (transform 1.35s, setup 0ms, import 1.79s, tests 2.39s, environment 0ms)
```

Focused domain:

```powershell
$env:PERIOP_SECOND_QA_EXPORT = "1"
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/periop-nurse-real-visit.test.ts tests/periop-nurse-owner-feedback.test.ts tests/periop-nurse-attention.test.ts
```

```text
 Test Files  3 passed (3)
      Tests  34 passed (34)
   Duration  40.01s (transform 2.14s, setup 0ms, import 3.85s, tests 35.83s, environment 0ms)
```

Focused player:

```powershell
$env:PERIOP_SECOND_QA_EXPORT = "1"
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1 src/session/periopNurseRealVisit.test.ts src/session/periopNurseOwnerFeedback.test.ts src/session/characterActivityPresentation.test.ts src/session/periopNurseAttentionPresentation.test.tsx
```

```text
 Test Files  4 passed (4)
      Tests  12 passed (12)
   Duration  11.28s (transform 1.68s, setup 0ms, import 3.36s, tests 7.59s, environment 0ms)
```

Exact manager fixture / 650 minutes:

```powershell
npm.cmd exec -- vitest run --config .local-dev/periop-second-fix/manager-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
```

```text
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  33.66s (transform 1.53s, setup 0ms, import 2.03s, tests 31.52s, environment 0ms)
```

FULL domain:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

```text
 Test Files  110 passed (110)
      Tests  3418 passed (3418)
   Duration  559.32s (transform 3.07s, setup 0ms, import 48.80s, tests 499.88s, environment 7ms)
```

FULL balance-config:

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
```

```text
 Test Files  8 passed (8)
      Tests  70 passed (70)
   Duration  1.51s (transform 132ms, setup 0ms, import 660ms, tests 51ms, environment 0ms)
```

FULL player:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
```

```text
 Test Files  1 failed | 137 passed (138)
      Tests  1 failed | 1093 passed (1094)
   Duration  59.92s (transform 2.87s, setup 0ms, import 27.93s, tests 21.26s, environment 7ms)
```

Root typecheck (exit 0; all seven workspace scripts):

```powershell
npm.cmd run typecheck
```

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Full player attribution: the only failure is the already recorded
`src/session/surgeryCenterServicePreviews.test.ts:85:52`,
`ignores the retired concealment flag and preserves the scheduled external
service after an answer`. It expects `Off-site thyroid fine-needle aspiration`
in the pending label; the current generic care/return timing label lacks that
substring. This same failure predates this turn and is documented by the nurse
and stool workers. Its source/view-model files were not edited here.
All new nurse checks pass. Player Vite config is loaded natively using the
existing scratch config (React + private-module guard) because unelevated
config bundling invokes a blocked Windows realpath subprocess. The normal
config/default-forks browser rerun remains manager-owned.

### Evidence and precise browser steps for manager

Evidence is UTF-8 without BOM under `.local-dev/periop-second-fix/`:
`before-tests.log`, `focused-domain.log`, `focused-player.log`,
`full-domain.log`, `full-player.log`, `full-balance.log`, `typecheck.log`,
`manager-harness.log`, `runtime-review.diff`, `real-visit-transitions.json`,
`four-real-visits.json`, `delayed-real-visit.json`, `real-visit-activity.json`,
`real-visit-activity.txt`, `manager-harness-samples.json` and
`qa-real-visit-save.json`. `owned-files.json` records this turn's scoped files.

1. Keep owner opening `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the
   usual persistent profile. Use the manager's **disposable 5183 QA session**
   for injection, recording `location.origin`; 5183 has separate saves from
   owner 4173. No origin, launcher, profile or owner save was changed here.
2. Fastest pre-op check: use the manager's existing live React session injector
   with `deserializeGameState` of `qa-real-visit-save.json`. This is paused at
   **tick 76**, with Maya already in the approved room and Ari already
   dispatched, so there is no question/arrival wait. Resume facility time,
   hover/select Ari and advance one minute: `Walking to pre-op check · Maya
   Reed` changes to `Pre-op check · Maya Reed` at `(39,27)`, beside the WC bed
   `(39,28)`. Watch at 1× for actual footsteps/standing, then Fast-forward to
   92: the task releases and she walks back to a free stool. At 106 the patient
   leaves preparation; by 111 the actual Endoscopy procedure begins. Check
   standing pose/facing and the stool worker's recent seated layering visually.
3. Continue the same visit: procedure ends at 156, recovery starts at 161,
   Dakota's named post-op check runs 163–178, and recovery/departure finishes
   221/223. Close/complete the chart when its next decision becomes available.
   During quiet time both should sit and take occasional short walks. To watch
   automatic kiosk trips in a disposable seed, inject `createPeriopQuietQa()`
   from the helper below and resume. It completes the same ordinary visit and
   re-enables just the nurses' optional shopping schedule; the engine chooses
   coffee/drinks itself. The pre-op seed suppresses shopping to isolate checks.
4. Full browser arrival/order check: dynamically import
   `/.local-dev/periop-second-fix/browser-qa.ts` in the live Vite QA session and
   inject `createPeriopArrivalQa(4)` with the same existing React injector.
   All four real patients begin on the sidewalk, with a normally hired
   receptionist and two normally hired peri-op nurses. Resume time, wait for
   physical check-in, open each patient's portrait/chart, select the correct
   **Colonoscopy** choice and click **Enact Plan**. Check Services queue count
   and both nurses' named walking/checking labels as patients reach their beds.
   Finish each chart's remaining correct decision after its result returns.
   No editing case steps or calling a service factory is needed.
5. For delayed gates, in that disposable campaign use the staffed Training room
   and both nurses' **Train** controls after ordering but before enacting the
   plan; repeat near the end of the procedure. Confirm the patient stays at
   their bed, the delayed chart says `Waiting for peri-op nurse`, the nurses
   have training labels instead of checking patients, and the phase ends only
   after a returned nurse finishes its 15-minute task. Save/reload during the
   delay. Level-3 low-morale nurses with a reachable operational Break Room should
   use the existing break flow between jobs (covered by focused domain tests).
6. For the owner's actual campaign diagnosis, call the helper's read-only
   `readPeriopNurseQa(state)` on the manager's current session-state snapshot.
   Inspect **each** home ID, operational assignment, active training/retail,
   task/check and ready queue. `nodesLeft: 0` distinguishes a completed 3/4
   path. Confirm new visits have attention markers and are actually in pre-op
   or recovery. Replace `levelTwoClinic()` with the legal seed for nursing QA;
   its overlapping room geometry and missing operational assignment were
   measured, and its absent service traffic cannot prove a broken queue.

Worker validation is complete; manager retains real-browser and owner-campaign
acceptance. This is a local checkpoint only; manager retains the scoped
**"push to GitHub"** backup reminder. Shared radiologist, stool and exterior
work was preserved. No open product/clinical decision is required for this fix.


Additional QA-helper smoke check (quiet seed resolves through ordinary commands, two operational nurses, read-only diagnosis):

```powershell
npm.cmd exec -- vitest run --config .local-dev/periop-second-fix/manager-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1 -t "legal quiet seed"
```

```text
 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Duration  2.88s (transform 1.21s, setup 0ms, import 1.60s, tests 1.20s, environment 0ms)
```
- 2026-10-08: exterior Option B built (worker); manager browser review: trees/lawn/paving/curb good; beds underplanted -> refinement sent. Retry loop false alarm (classified transient capacity lines as failure) stopped.
- 2026-10-08: exterior Option B ACCEPTED by manager after refinement: fuller v3 beds with white/pink blooms; beacon-free inset check PASS at 110/70/140%; fresh-campaign captures at 140/110/90/70/50/30% with no page errors (docs/design/exterior-frontage/qa-20261008/).
- 2026-10-08: OWNER: Wound/Ostomy approved after removing the recliner leg rest; next room may be Level 5; endoscopy/surgery must prefer specialists over founder (founder overflow only) and endoscopy nurse stands opposite the endoscopist; rolling stools and radiologists confirmed working; heavy lag reported; landscaping still repetitive -> one site-wide random layout; one peri-op nurse still static. Round-4 workers launched: wound-fix, grass, staffing, perf, level5.

## Procedural specialist priority and opposite-side nurse staffing (Sol handback)

- Goal: specialists perform Endoscopy/OR whenever an operationally assigned,
  reachable qualified employee can take the procedure; founder is overflow.
- Scope: exact provider selection in selectors.ts, service-operations.ts and
  diagnostic-timing.ts; new shared procedural-staffing helper and focused tests;
  approved Endoscopy/OR standing spots and exact player support bindings.
  Concurrent training, companions, radiology, rendering and performance edits
  must be preserved. No Git, agents, installs, browser, clinical or payment edits.
- Decision: named PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES = 5 game minutes.
  Idle specialists can be dispatched even outside their home room. A known
  non-training release within five minutes postpones founder fallback; unknown
  release/longer work, training, missing or unreachable assignments do not.
  Provider priority also applies to the diagnostic calendar before acceptance.
- Milestones: trace, scoped implementation/regressions, FULL touched-package
  suites/typecheck and browser handoff complete. Manager acceptance is pending.
- Acceptance: two endoscopy suites/two endoscopists and surgery equivalent,
  training-only founder overflow, exact short-wait boundary, valid opposite-side
  nurse/provider floor spots/facing, legacy serialization compatibility.
- Baseline snapshots/hashes (filesystem only): .local-dev/procedural-staffing/.
  Manager remains sole acceptance and architecture owner.

### Staffing implementation and ownership receipt (2026-10-08)

Implemented specialist-first selection in both accepted diagnostic plans and
physical service dispatch. Previously, an idle specialist walking outside their
home was excluded, and the diagnostic calendar could prefer the founder's
shorter travel/finish time. A previously preferred founder is now reconsidered
when the service is dispatched; executing reservations remain frozen.

Availability: the matching endoscopist/surgeon has an operational home assignment,
is not away for training, has a legal route to the procedure's provider-side
standing spot, and has no active task/reservation. Idle walking and optional
shopping can be interrupted. If no idle specialist exists, a reachable
specialist's known non-training release at or before
`facilityTick + PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES` keeps the operation
queued. The named threshold is **5 game minutes, inclusive**, editorial dispatch
tuning only. Unknown release, longer work, training, missing hires/assignments,
inaccessible assignments or no provider-side route permit founder overflow.
The diagnostic calendar compares specialist dispatch availability against the
earliest founder dispatch plus the same five minutes; shared room/nurse queue
and walking/procedure speed do not override specialist priority. Existing fees,
procedure durations and clinical content were not edited.

Endoscopy and OR use separate approved provider/nurse floor spots. Each side
has a main and foot alternative; actual inside door cells and solid furniture
are excluded before path selection. Endoscopy's provider stands east of the bed
facing west, its nurse west facing east; OR retains its approved surgeon-left,
nurse-right presentation. All rotations preserve the pair and facing. Visual
support IDs match each arrived domain endpoint, including founder coverage.
Custom/test layout overrides retain their own authored anchors. No persistent
fields, migration, artwork, dimensions or door rules changed.

Owned source/tests (17 paths, exact hunks only in shared files):

- `packages/balance-config/src/procedural-staffing.ts` (new named wait constant)
- `packages/balance-config/src/approved-room-layouts.ts` (typed standing-spot contract only)
- `packages/balance-config/src/index.ts` (constant export)
- `packages/balance-config/src/procedural-staffing.test.ts` (new geometry checks)
- `packages/game-domain/src/procedural-staffing.ts` (new availability/door-free spot/support helpers)
- `packages/game-domain/src/selectors.ts` (provider preference, reachability, short wait)
- `packages/game-domain/src/service-operations.ts` (priority and separate bedside paths)
- `packages/game-domain/src/diagnostic-timing.ts` (calendar priority and unknown-duty reservation only)
- `packages/game-domain/src/index.ts` (helper exports)
- `packages/game-domain/tests/procedural-staffing-fixture.ts` (new legal two-room fixture)
- `packages/game-domain/tests/procedural-staffing.test.ts` (18 behavioral regressions)
- `apps/player/src/facility/types.ts` (two Endoscopy support roles)
- `apps/player/src/facility/approvedRoomPresentation.ts` (paired supports and facing)
- `apps/player/src/session/viewModels.ts` (arrived provider/nurse/founder support binding)
- `apps/player/src/session/proceduralStaffingPresentation.test.ts` (four regressions)
- `apps/player/src/facility/approvedRoomPresentation.test.ts` (one OR role-array expectation)
- `apps/player/src/facility/approvedRoomRenderer.test.ts` (one OR support-depth expectation)

Shared hunks preserved and excluded from this lane: the performance worker's
`projectReadingCalendar` empty-request early return/shallow-copy change in
`diagnostic-timing.ts`, and shared currency `Intl.NumberFormat` in `viewModels.ts`.
All other concurrent work was preserved. Filesystem before-images and hashes
were used; no Git command was run. `.local-dev/procedural-staffing/review.diff`
contains the before/current comparison, including the explicitly unowned
performance hunks; `source-audit.json` confirms all 17 files are UTF-8 without
BOM. The two tiny existing OR expectations reflect four supports instead of
two; painter implementation is unchanged.

Coverage: simultaneous and repeated two-room/two-specialist Endoscopy/OR with no
founder; normally paid training with exactly one employee and one founder;
walking specialists; unreachable candidates skipped; unhired/unassigned/
out-of-service/training/unreachable fallback; five-versus-six-minute route and
calendar boundaries; actual service dispatch waits/releases in both specialties;
opposite-side door-free endpoints; executing founder preserved after reload;
legacy visitor save without modern phase/training/nurse/upgrade metadata. The
fixture validates every door and room footprint, then uses ordinary reducer
movement. Additional accepted visitor bursts isolate staffing from cadence caps.

### Staffing validation: exact commands and final output

Default domain pool was tried first:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-two-endoscopy.test.ts tests/service-operations.test.ts tests/diagnostic-timing.test.ts
```

Unelevated default forks failed with `spawn EPERM`: no tests ran, three startup
errors. Threads fallback was used for all full suites. Normal player config was
also tried with threads:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 src/session/proceduralStaffingPresentation.test.ts src/session/level3ControlsViewModels.test.ts src/facility/approvedRoomPresentation.test.ts
```

Loading `vite.config.ts` through externalize-deps failed with `spawn EPERM` in
the Windows realpath/config-bundling subprocess. Player uses the existing native
scratch config preserving production React/private-module plugins. No dependency
or checked-in config changed. Manager retains normal-config/default-pool rerun.

Focused domain (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/procedural-staffing.test.ts tests/level-two-endoscopy.test.ts tests/service-operations.test.ts tests/service-procedure-operations.test.ts tests/diagnostic-timing.test.ts tests/diagnostic-service-operations.test.ts
```

```text
 Test Files  6 passed (6)
      Tests  158 passed (158)
   Duration  27.11s (transform 1.77s, setup 0ms, import 3.85s, tests 22.78s, environment 0ms)
```

Focused player (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1 src/session/proceduralStaffingPresentation.test.ts src/session/level3ControlsViewModels.test.ts src/facility/approvedRoomPresentation.test.ts
```

```text
 Test Files  3 passed (3)
      Tests  40 passed (40)
   Duration  5.82s (transform 1.99s, setup 0ms, import 3.43s, tests 2.11s, environment 0ms)
```

Supplemental focused player after updating the OR doorway-alternative renderer
expectation (exit 0; then the full player suite was rerun):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1 src/session/proceduralStaffingPresentation.test.ts src/facility/approvedRoomPresentation.test.ts src/facility/approvedRoomRenderer.test.ts
```

```text
 Test Files  3 passed (3)
      Tests  44 passed (44)
   Duration  4.40s (transform 1.37s, setup 0ms, import 2.45s, tests 1.73s, environment 0ms)
```

FULL domain (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

```text
 Test Files  112 passed (112)
      Tests  3439 passed (3439)
   Duration  278.03s (transform 2.38s, setup 0ms, import 36.70s, tests 233.41s, environment 5ms)
```

FULL balance-config final (exit 0):

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
```

```text
 Test Files  9 passed (9)
      Tests  72 passed (72)
   Duration  1.11s (transform 95ms, setup 0ms, import 456ms, tests 39ms, environment 0ms)
```

FULL player final (exit 1; one previously documented failure):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
```

```text
 Test Files  1 failed | 139 passed (140)
      Tests  1 failed | 1111 passed (1112)
   Duration  59.03s (transform 2.97s, setup 0ms, import 29.20s, tests 19.06s, environment 7ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85:52`,
`ignores the retired concealment flag and preserves the scheduled external
service after an answer`. Expected pending label contains
`Off-site thyroid fine-needle aspiration`; received:

```text
The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking).
```

This same failure is recorded in the peri-op nurse/stool handoffs. Its test and
pending-label implementation were not changed in this lane. No unrelated fix
was attempted. All staffing/presentation/renderer tests pass. Full suite counts
include concurrent workers' valid tests.

Root typecheck (exit 0, all seven workspaces):

```powershell
npm.cmd run typecheck
```

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present

> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json

> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Browser-seed/save evidence (exit 0; no browser launched):

```powershell
npm.cmd exec -- vitest run --config .local-dev/procedural-staffing/qa-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
```

```text
 Test Files  1 passed (1)
      Tests  5 passed (5)
   Duration  5.38s (transform 1.15s, setup 0ms, import 1.54s, tests 3.76s, environment 0ms)
```

UTF-8 evidence under `.local-dev/procedural-staffing/`: `baseline.json`,
`review.diff`, `source-audit.json`, `focused-domain.log`, `focused-player.log`,
`full-domain.log`, `full-balance.log`, `full-player-final.log`, `typecheck.log`,
`qa-evidence.log`. Earlier failing/startup logs are retained for attribution;
`full-player.log` predates the corrected OR support expectation. Source audit:
`python .local-dev/procedural-staffing/review.py` -> 17 files, `utf8NoBom: true`.
No secrets, source text, private clinical inputs or new clinical material added.

### Staffing: precise browser acceptance for the manager

1. Owner opening remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in
   the usual persistent profile. Use the manager's disposable
   `http://127.0.0.1:5183` for injections and record `location.origin`; 5183 has
   separate storage. Worker did not launch a browser, alter origins, touch owner
   storage, or change launcher/profile.
2. Fast endoscopy check: use the existing live React session injector with
   `deserializeGameState` of
   `.local-dev/procedural-staffing/qa-endoscopy-save.json` (paused tick 168).
   Hayden Salem/Quinn Bennett are simultaneously in operational Endoscopy
   rooms `(33,23)`/`(44,23)`. Both providers are employees; Services/reservation
   data should show zero founders. Main endoscopist `(35,24)` faces west; nurse
   `(33,25)` faces east using `nurse:foot` because `(33,24)` is the inside west
   door. Second endoscopist `(46,24)` and nurse `(44,25)` are opposite. Check
   visual contacts clear furniture/door, face the patient, and remain stable.
3. Rotation: inject `qa-endoscopy-rotated-save.json` (paused tick 169). Second
   room is 270 degrees: endoscopist `(45,24)` faces south, nurse `(45,26)` north.
   Check facing/support attachment opposite the rotated bed. All four staff
   paths have zero nodes remaining; these are arrived standing samples.
4. Surgery: inject `qa-surgery-save.json` (paused tick 170). ORs `(33,18)` and
   `(44,17)` have employee surgeons only. Main surgeon `(33,20)` faces east,
   nurse `(36,20)` west; second surgeon `(44,19)` east, nurse `(47,19)` west.
   Check Services names, contacts and distinct positions; procedure releases
   are ticks 284/290 in this seed.
5. Training: inject `qa-endoscopy-training-save.json` or
   `qa-surgery-training-save.json` (paused tick 170). Original specialist is
   away on actual paid training/return. Other employee performs Hayden's first
   procedure; founder only Quinn's second. Founder uses provider side opposite
   nurse. Save/reload executing procedures: reservations/timers remain attached.
   After training fully returns, admit another pair and confirm priority resumes.
6. Walking/transitions: in disposable QA dynamically import
   `/.local-dev/procedural-staffing/browser-qa.ts` and inject
   `createProcedureArrivalQa(surgery, orientation, training)` through the existing
   React injector (defaults false, 0, false). Seeds normally hire/train staff and
   start two accepted factory service visitors on arrival, isolating staffing
   cadence caps. Resume at 1x; watch check-in, pre-op, separate bedside routes,
   procedure and return. Repeat Endoscopy, OR, rotation and training. Separately
   order/enact normal onsite procedure choices in the manager's campaign for
   chart UI acceptance; factory visitor QA does not replace that interaction.
7. Short wait: make a second procedure ready while the only reachable specialist
   has at most five minutes of known duty/active procedure remaining. Verify
   waiting rather than pulling idle founder, then specialist dispatch on release.
   Repeat six or more minutes to allow founder when a separate room/nurse is free.
   Exact inclusive boundary has route/calendar/engine tests; do not infer it from
   an indefinite task. Common room/nurse occupancy independently delays either.
8. Actual campaign: call read-only `readProcedureStaffingQa(state)` on its current
   state snapshot. It reports assignments, roles, training, `readyAt`, location/
   endpoint/nodesLeft, tasks, providers, phases, ends and completed provenance.
   JSON renders infinite/unknown `readyAt` as `null`. Check all hired specialists
   rather than assuming QA geometry equals owner geometry. Helper
   `createProcedureActiveQa(...)` reproduces the paused seeds; five variants were
   validated through ordinary movement and serialization.

Worker scope complete; manager retains browser/owner-campaign acceptance and
normal-config rerun. Lane released. Local-only checkpoint; no Git, install,
push, deployment, agent or external message. Manager retains the scoped
**"push to GitHub"** backup reminder after acceptance. No product, architecture
or clinical-content decision is pending for this lane.
- 2026-10-08: owner save read (read-only, owner-approved, via Claude in Chrome on an image URL of origin 127.0.0.1:4173; only nurse/room fields extracted in-page): Blake stuck on legacy cover_periop task (started tick 9340, workMinutesRemaining ~MAX_SAFE_INTEGER) blocking the queue and her paid queued training; Riley on periop_attention. Sent nurse3 brief.

## Campaign performance investigation and safe hotspot fixes - Sol worker handoff (2026-10-08)

Bounded worker scope is complete. Manager retains integration, normal-config
rerun, browser profiling and owner acceptance. This investigation used synthetic
states only; it did not read owner browser storage or diagnose the owner's
specific save. Owner opening remains `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent profile. QA 5183 has separate
storage. No origin, profile, launcher, save schema or migration change.

### Conclusion for the owner

Keep the existing campaign while testing these fixes. Repeated whole-campaign
copies in diagnostic ETA projection were a real history-dependent hotspot,
even in a quiet headless simulation without Vite or rendering. A new campaign
temporarily reduces history and actors, but these fixes benefit existing saves;
starting over is not required simply because the game has changed. A similarly
busy new clinic can regain the same layout/actor costs. Retaining archived
campaigns also retains their profile serialization cost, so restarting can add
to autosave size rather than eliminate it. Actual save health remains untested.

Concurrent edits to runtime dependencies on the live Vite server can trigger
React refresh/HMR or a full reload, interrupt motion, repeat startup/asset work
and invalidate caches. Concurrent tests/workers also compete for local CPU.
That contributes intermittent development disruption; no measured percentage
or reload duration is available in this sandbox. Documentation/test edits are
not automatically runtime reloads. The controlled runtime hotspot reproduced
without a server, so development activity cannot explain all measured lag.

### Owned implementation and preservation

Five exact runtime seams, preserving concurrent staffing/landscape/owner edits:

- `packages/game-domain/src/diagnostic-timing.ts`: skip Reading replay when its
  accepted/prospective request set is empty. For real reads, copy only employee
  and service-operation records plus the top-level predicted state; share
  read-only layout/encounter/history branches. Clock, travel, training and
  service-status projection mutations remain private.
- `packages/game-domain/src/guidance-tips.ts`: reuse the existing money locale/
  precision formatter; reuse installed-role, built-room, operational-room and
  progression eligibility within one predicate evaluation. Results are
  recomputed on the next call, including in-place fixture/state changes. Tip
  evaluation cadence and outputs are preserved.
- `apps/player/src/session/viewModels.ts`, `managementViewModels.ts` and
  `employeeTrainingViewModels.ts`: reuse identical `Intl.NumberFormat` instances
  for currency/training labels instead of constructing them for every value.
- New tests: `packages/game-domain/tests/diagnostic-projection-isolation.test.ts`,
  `guidance-evaluation-isolation.test.ts`, and
  `apps/player/src/session/numberFormattingCompatibility.test.ts`.
- Worker plan: `docs/execplans/performance-20261008.md`; handoff appended here
  and to `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

No clinical content, rules, probabilities, timing, scheduler priority, FSRS
history, frozen encounters, receipts, retirement limits or persisted fields
changed. Existing staffing work in the same diagnostic file is preserved.
`review.diff` compares frozen current source with only the five performance
seams reversed, avoiding unrelated changes in the original before-images.
`source-audit.json` confirms exactly five bundled runtime source differences,
the runtime sources still matching the measured final bundle, and eight owned
runtime/test files in UTF-8 without BOM.

### Reproducible inputs and principal timings

Evidence is under ignored `.local-dev/performance-20261008/`. `harness.ts` and
`build.mjs` use the installed Rolldown tool; no dependency was installed. Frozen
`reference.mjs`/`final.mjs` differ only in our five source seams. This avoids
concurrent edits contaminating the before/after comparison.

Legal L2: 31 rooms, four normally hired staff, zero access issues, 6,000 ordinary
gameplay minutes with autoplay admissions/answers and environmental arrivals.
At 100 hours: 14 retained encounters, 86 retired, 139 reviews, 305 events,
30 condition occurrences and 11 actor inputs. Legal busy L3: 80 rooms, 13 hired
staff including four readers, four ordinary encounters, eight accepted mixed
procedure visitors and eight companions: 34 actor inputs, zero access issues.
Large cash/disabled expenses allow the L2 long run to continue; these are
software performance fixtures, not an economic balance playtest.

`controlled-results.json`: same fixed inputs, eight warmups then 40 samples
per operation; times below are median milliseconds, with tick p95 in brackets.
Command is a non-idempotent `SET_SIMULATION_SPEED`, including reducer copying
and receipt work. Build includes the complete Build-mode view projection.

| Synthetic input | Save bytes | Tick before -> after [p95] | View before -> after | Build before -> after | Command before -> after |
| --- | ---: | --- | --- | --- | --- |
| Fresh L0 | 113,898 | 0.398 -> 0.378 [0.560 -> 0.814] | 1.010 -> 0.236 | 1.093 -> 0.290 | 0.293 -> 0.295 |
| Empty legal L2 | 130,833 | 3.183 -> 3.020 [3.904 -> 3.633] | 3.279 -> 2.193 | 4.538 -> 3.619 | 0.370 -> 0.366 |
| L2, 100 hours | 740,288 | 29.191 -> 11.724 [31.153 -> 13.363] | 11.857 -> 4.786 | 13.070 -> 6.443 | 2.780 -> 2.772 |
| L2, 500 events + 500 conditions | 918,729 | 32.104 -> 11.523 [39.157 -> 13.014] | 12.424 -> 4.128 | 14.147 -> 5.782 | 3.172 -> 3.154 |
| L2, 1,000 conditions, legacy stress | 1,111,730 | 37.734 -> 13.088 [39.131 -> 13.831] | 14.007 -> 4.215 | 16.044 -> 5.843 | 3.867 -> 3.864 |
| L2, 10,000 conditions, legacy stress | 4,612,731 | 116.246 -> 25.559 [124.341 -> 26.911] | 42.799 -> 8.536 | 45.370 -> 10.924 | 16.106 -> 16.239 |

The 100-hour fixed case improves tick by 59.8% and view by 59.6%. Ordinary
commands still copy the campaign and do not receive the projection shortcut.
The 1k/10k conditions exceed the current 500-occurrence cap: explicit legacy/
torture inputs, not expected normal campaign growth. Events are capped at 500
in all history stresses. An older broad `levelTwoClinic` stress has overlapping/
nonoperational rooms; it remains in scratch results but is excluded from
legal-gameplay conclusions.

The original separate 6,000-tick run corroborates sustained improvement:
final 3,600-minute segment tick median/p95 10.52/20.30 -> 5.23/8.76 ms.
Its autoplay iteration (selection plus one or sometimes two commands) median/
p95 is 2.90/8.78 -> 2.93/5.59 ms. These older full-run bundles predate the final
small guidance reuse change and concurrent staffing completion; the controlled
table is the principal apples-to-apples result. Commands are not uniformly
faster. Timings on this workstation are observations, not browser FPS promises.

Busy L3 fixed snapshot (`extras-results.json`, eight samples): tick 13.65 ->
13.21 ms, normal view 15.07 -> 13.62 ms, Build 21.73 -> 20.77 ms, feed 0.197 ->
0.177 ms. With no diagnostic orders in this snapshot, Reading optimization is
not the main cost. Direct cloned-input scheduler medians (clone outside timer,
40 samples): guidance 4.924 -> 4.720 ms, staff movement 0.624 ms, service plus
peri-op attention 0.517 ms, idle outside-read screening 0.059 ms. Separate four
live outside-read jobs measure 0.070 ms median / 0.109 p95.

### CPU profiles and remaining domain work

`node --cpu-prof --cpu-prof-interval=500`: matched 1,800 ticks plus 900 normal
view builds, identical end metadata (tick 1850, 479,446 bytes, zero access issues).
Sampled totals 29,502.637 -> 13,419.358 ms. Top self-time milliseconds:

| Function | Before self ms (% of run) | After self ms (% of run) |
| --- | ---: | ---: |
| `projectReadingCalendar` | 9,039.806 (30.64%) | 3.025 (0.02%) |
| diagnostic JSON `copy` (`copy$1` in bundle) | 5,466.028 (18.53%) | 668.360 (4.98%) |
| reducer `clonePlain` | 2,143.899 (7.27%) | 2,145.782 (15.99%) |
| `reduceAdvanceTick` | 1,826.644 (6.19%) | 1,789.746 (13.34%) |
| `tileAdjacencyForFacility` | 893.149 (3.03%) | 832.694 (6.21%) |
| view `currency` | 727.030 (2.46%) | 15.980 (0.12%) |
| guidance `money` | 270.146 (0.92%) | 17.474 (0.13%) |

Reference next self-time functions: physical door keys 512.126 ms (1.74%),
frozen forecast 476.634 (1.62%), BFS 467.367 (1.58%) and point-key parsing
395.171 (1.34%). Full top-45 lists, source maps and raw profiles are retained as
`reference-controlled-*` / `final-controlled-*` artifacts. Percent increases
after the fix can reflect the smaller denominator rather than a regression.

Additional `busy-final.cpuprofile`: 120 L3 minutes plus 60 view builds; four live
outside reads and 34-35 actor inputs emerge through ordinary scheduling.
Sampled total 3,683.205 ms. Main self costs: graph construction 560.763 ms
(15.22%), door keys 438.930 (11.92%), point parsing 252.883 (6.87%), BFS 168.951
(4.59%), reducer clone 163.221 (4.43%), path entry point 161.380 (4.38%).
Inclusive path work totals 2,300.662 ms (62.46%); guidance 1,482.825 ms (40.26%),
companions 348.850 (9.47%), peri-op nurse attention 59.587 (1.62%), outside reads
15.261 (0.41%) and waiting selection 2.347 (0.06%). Inclusive categories overlap;
do not add them or call them self-time. Guidance average from this sampled
transition trace is about 12.4 ms/tick, above the fixed snapshot's 4.7 ms.

Repeated pathfinding is the next strongest target: each path call rebuilds
tile/door adjacency and runs BFS; guidance capacity checks and companion
routes both use it. Existing access validation caches still construct layout
keys, and fresh command contexts can reduce reuse. Broader graph caching needs
layout/door/rotation/upgrade/context and protected-room invalidation review.
Waiting reseating does a cheap no-candidate/no-free-chair check, then can
recompute routes for each remaining waiter as seats are assigned. It was small
in sampled workloads, but a large standing crowd after construction is an
unmeasured worst case. Companion travel can recompute routes each minute.
Nurse/outside schedulers were small here; this does not establish an upper bound.

History work is already bounded in several places: events/conditions 500,
recent retired encounters 10 with summaries, income receipts 50, finished
service operations 10 and retired appearance history 512. Learning reviews,
review intents, settlements and other ledgers can still grow; cloning and save
serialization copy them. Preserve learning/idempotency semantics before any
future compaction. No history pruning or cadence throttling was added here.

### Player, scene and save findings

`ActivePrototypeGame` memoizes the full view by state/UI/camera dependencies.
Each reducer tick produces a new state, so it rebuilds at the configured 1 Hz
at 1x / 4 Hz at 4x, plus player commands. Main mounts React StrictMode; dev
render/evaluation can repeat. Actual committed-render frequency is unmeasured.
Feed folds bounded events/conditions, sorts and keeps 80 rows, calls Needs You
again, and evaluates current guidance candidates when tip history exists.
At 100 hours, full feed median is about 0.48 ms versus full view 4.79 ms.

Phaser `FacilityScene.update` calls the signature guard, character drawing,
pin projection and earnings presentation each frame. Full world redraw is
guarded by dimensions/signature: headless 60-minute traces changed it only
twice for each L2/L3 input. Clock and actor motion alone do not redraw all
landscape. Signature median is approximately 0.005-0.014 ms. This is not a
measurement of Phaser painting, canvas/GPU cost or texture decode.

Current site 72x32: 479 landscape candidates (154 trees, 113 shrubs, 65 flowers,
147 grasses). Applying actual scene construction/wall/entrance/sidewalk culling
in `landscape-audit.mjs` yields L2 441-442 / L3 388-389 visible placements at
tile sizes 27/39/48; pure cull/sort medians about 0.20-0.23 / 0.39-0.40 ms.
These are placements, not measured display-list objects or draw calls. Assets,
fallback graphics and sorting still need a browser trace. Character work tracks
live appearances (up to 35 inputs in L3), not 318 simultaneously drawn identities;
the larger catalog can still affect startup/decode/memory. Pin positions are
computed per frame and callbacks are gated by changed rounded positions.
Moving pins can update FacilityCanvas/ClinicMapPins at animation cadence.
Both synthetic traces had zero active pins, so their real overhead is pending.

`controlled-results.json` save/load medians, unchanged implementations:
fresh 113,898 bytes 0.083/0.795 ms; empty L2 130,833 bytes 0.118/0.711 ms;
100 hours 740,288 bytes 1.293/3.362 ms; 10k legacy stress 4,612,731 bytes
9.017/10.056 ms. Leading L2 branches: encounters 218,772 bytes, learning history
200,691, events 124,796, review intents 44,636, settlements 32,390.

Real profile save/load functions measured with synthetic in-memory localStorage:

| Campaigns including archives | Profile bytes | Save median / p95 ms | Load median / p95 ms |
| --- | ---: | ---: | ---: |
| 1 | 813,325 | 2.580 / 5.254 | 3.902 / 6.585 |
| 3 | 2,439,385 | 8.160 / 10.673 | 11.480 / 12.784 |
| 10 | 8,130,596 | 26.907 / 38.913 | 39.061 / 55.848 |

This excludes browser `setItem` blocking and quota; the 10-campaign stress may
not fit real browser storage. Autosave already coalesces facility clock writes
every 15 minutes (15 seconds at 1x / 3.75 at 4x), using idle callback with a
2-second deadline or timeout fallback. Meaningful commands remain write-through
and pagehide flushes. Every profile save serializes archived campaigns too.

### Validation: commands, exact output and attribution

Default domain forks and ordinary player config were attempted first:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/diagnostic-projection-isolation.test.ts tests/diagnostic-timing.test.ts tests/room-upgrade-reading.test.ts tests/guidance-tips.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- src/session/numberFormattingCompatibility.test.ts src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/buildViewModels.test.ts
```

Both exit 1 at sandbox startup: domain fork/termination `spawn EPERM`, player
Vite bundled config `net use` spawn EPERM. Logs `domain-default.log` and
`player-default.log`. Fallback uses threads, with the production React and
private-module plugins preserved by the scratch native player config.

Final focused domain, exit 0 (`domain-focused-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/diagnostic-projection-isolation.test.ts tests/guidance-evaluation-isolation.test.ts tests/diagnostic-timing.test.ts tests/room-upgrade-reading.test.ts tests/guidance-tips.test.ts --pool=threads
```

```text
 Test Files  5 passed (5)
      Tests  145 passed (145)
   Duration  5.19s (transform 4.46s, setup 0ms, import 6.65s, tests 5.27s, environment 0ms)
```

Final focused player, exit 0 (`player-focused-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/numberFormattingCompatibility.test.ts src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/buildViewModels.test.ts src/session/alertsEventsViewModel.test.ts src/session/diagnosticTimingViewModels.test.ts src/session/newestServiceIncomeReceipts.test.ts --pool=threads --maxWorkers=1 --config ../../.local-dev/performance-20261008/vitest-player.config.mjs --configLoader native
```

```text
 Test Files  7 passed (7)
      Tests  106 passed (106)
   Duration  4.73s (transform 1.32s, setup 0ms, import 3.66s, tests 596ms, environment 0ms)
```

Final FULL domain, exit 0 (`domain-full-verified.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
```

```text
 Test Files  113 passed (113)
      Tests  3441 passed (3441)
   Duration  76.31s (transform 5.32s, setup 0ms, import 45.62s, tests 249.81s, environment 6ms)
```

Final FULL player, exit 1 (`player-full-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../.local-dev/performance-20261008/vitest-player.config.mjs --configLoader native
```

```text
 Test Files  1 failed | 139 passed (140)
      Tests  1 failed | 1111 passed (1112)
   Duration  53.04s (transform 2.65s, setup 0ms, import 26.44s, tests 17.11s, environment 6ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85`,
`ignores the retired concealment flag and preserves the scheduled external
service after an answer`. Expected pending label substring
`Off-site thyroid fine-needle aspiration`; received existing generic care/return
pending text. Previously recorded in manager/staffing/nurse handoffs. Confirmed
with all five owned runtime changes disabled in an in-memory Vite reference:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/surgeryCenterServicePreviews.test.ts --pool=threads --maxWorkers=1 --config ../../.local-dev/performance-20261008/vitest-player-reference.config.mjs --configLoader native
```

```text
 Test Files  1 failed (1)
      Tests  1 failed | 12 passed (13)
   Duration  2.29s (transform 1.25s, setup 0ms, import 1.67s, tests 547ms, environment 0ms)
```

Same assertion/message, exit 1 (`player-pending-reference.log`), without swapping
live files. No unrelated assertion/implementation was weakened or fixed here.
Earlier full runs caught concurrent staffing/landscaping changes; those failures
are absent from final full results. A final typecheck caught our new test using
the fixture wrapper as a phase; corrected to destructure `{ phase }`, then
reran focused/full domain and root typecheck. Earlier logs remain historical.

Root `npm.cmd run typecheck`, exit 0 (`typecheck-verified-final.log`), exact
workspace output:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Frozen differential, exit 0 (`node .local-dev/performance-20261008/compare.mjs`):

```text
{"forecasts":40,"ticks":1215,"commands":86,"views":66,"candidateChecks":60,"stateHash":"f4d958fae10dc233a8ff6f9f06e6afc4d11e4cf5b8cf68baeeccd38902c43bc1","status":"PASS"}
```

Deep equality covers ordinary ticks, 86 autoplay iterations (some contain two
commands), normal/Build views, live guidance candidates and legacy stress.
Forecast comparison covers five
available service plans across training/no-training and four clock positions;
the sixth requested MRI service is unsupported in that timing fixture and its
planning result still compares equal. Frozen input graphs prove projection
does not mutate saves/plans. Regression tests cover queue times, mutable-state
eligibility changes and locale/rounding/negative-zero/fractional labels.

Reproduction (run timings/profiles serially with other work idle):

```powershell
node .local-dev/performance-20261008/build.mjs reference reference
node .local-dev/performance-20261008/build.mjs final
node .local-dev/performance-20261008/compare.mjs
node .local-dev/performance-20261008/controlled.mjs
node .local-dev/performance-20261008/extras.mjs
node --cpu-prof --cpu-prof-interval=500 --cpu-prof-dir=.local-dev/performance-20261008 --cpu-prof-name=reference-controlled.cpuprofile .local-dev/performance-20261008/reference.mjs reference profile
node --cpu-prof --cpu-prof-interval=500 --cpu-prof-dir=.local-dev/performance-20261008 --cpu-prof-name=final-controlled.cpuprofile .local-dev/performance-20261008/final.mjs final profile
node --cpu-prof --cpu-prof-interval=500 --cpu-prof-dir=.local-dev/performance-20261008 --cpu-prof-name=busy-final.cpuprofile .local-dev/performance-20261008/busy-profile.mjs
node .local-dev/performance-20261008/frame-inputs.mjs
node .local-dev/performance-20261008/landscape-audit.mjs
python .local-dev/performance-20261008/review.py
```

Long-run reproduction is
`node .local-dev/performance-20261008/<reference-or-final.mjs> <new-label> measure`
from the repository root; it writes label-specific results/synthetic save.
Original baseline/after/final long-run artifacts are retained. Browser probe
tried bundled Chromium (missing executable), installed Chrome and Edge (both
`spawn EPERM`); no browser session or owner storage was opened. No browser/FPS,
real localStorage quota, HMR duration or React commit measurement is claimed.

### Precise browser acceptance/profile steps for the manager

1. Use disposable persistent QA profile at exact `http://127.0.0.1:5183` and
   record `location.origin`; it is separate from owner 4173 storage. Feed
   `baseline-synthetic-save.json` (100-hour L2), `busy-synthetic-save.json`
   (34-actor L3) and `busy-progressed-synthetic-save.json` (later L3/read work)
   through the existing live React session injector after successful
   deserialization. These Node bundles are not browser modules. Record browser,
   viewport, DPR, camera zoom, fixture tick, active actors and runtime code state.
2. Reserve a quiet window with workers/tests/file edits idle. Record 60 seconds
   each at 1x and 4x; also paused and Build mode. Use normal 100%, 70% and site
   overview zooms. Chrome Performance: inspect long tasks/animation frames and
   p95/max durations, separating `reduceAdvanceTick`/forecast, graph/BFS,
   `advanceGuidanceTips`, full view/Build, save and Phaser work. Sampling profiles
   and trace overhead should not be treated as an uninstrumented FPS guarantee.
3. React Profiler: measure commits/durations for `ActivePrototypeGame`, AppShell,
   FacilityCanvas and ClinicMapPins. Compare tick cadence against dev StrictMode
   render/evaluation repeats. Create a blocked diagnostic through normal QA UI
   so there are real room/patient pins; compare stationary and walking pins.
   Current supplied trace had zero pins, so measure that missing workload rather
   than inferring the whole App renders every animation frame.
4. Phaser scene key is `facility-scene`. Trace `FacilityScene.update`,
   `refreshLayout`, `drawCharacters`, `drawClinicGroundDetails`, sorting and
   renderer/canvas work. At a `drawClinicGroundDetails` breakpoint inspect
   `visible.length`; compare L2 441-442 / L3 388-389 placement expectations for
   matching tile size and geometry. Count actual visible display-list objects,
   textures and active actor containers, distinguishing bitmap/fallback paths.
   Observe cache/asset load completions after reload. Confirm clock/actor-only
   frames reuse the world; occupancy, construction, camera and dirty/litter
   changes may redraw it. Check late L3 companions at seats/amenities and nurse
   attention transitions as well as steady actors.
5. Place/undo a Waiting Room while several QA patients are standing; inspect
   `reseatStandingWaitingPatients`, waiting selection and path counts. Include
   a Reading Room with four live outside jobs, queued training and active reads.
   Preserve deterministic chair/staff priority, travel contacts and ETA values
   through save/reload. This crowd/transition case is broader than the fixed
   snapshot and checks the remaining repeated-routing risk.
6. Trace autosave boundaries (facilityTick divisible by 15): 15 seconds at 1x,
   3.75 at 4x, idle callback/2-second deadline; trace an ordinary meaningful
   command and pagehide flush. Compare synthetic one/multiple archived profile
   sizes, real JSON serialization + `localStorage.setItem` wall time and quota
   handling in disposable QA only. Avoid exposing/exporting owner storage.
7. Record a separate QA interval during known runtime worker edits. Correlate
   Vite HMR/React refresh/full-document reload notifications with Network and
   Performance timestamps, asset decode/startup and gameplay pauses. Compare
   the same fixture in the quiet interval to quantify development contribution.
   Do not change or revert another worker's file for this experiment. Then have
   the owner try existing campaign via unchanged `START_GAME.cmd`/4173 in a quiet
   window; a restart is not the first recommended remedy.

Lane released. No Git command, dependency install, agent, external message,
push or deployment. This valuable checkpoint remains local only; manager owns
the scoped **"push to GitHub"** backup reminder after review/acceptance. No
clinical approval or large product/architecture decision is requested here.
- 2026-10-08: Wound/Ostomy APPROVED after leg-rest removal (approval-2026-10-08.md); all five Level 4 mockups approved. Level 5 order found: Founders Office, Executive Office, Gift Shop, Indoor Garden, Staff Gym; Founders Office mockup browser PASS, owner questions pending. Landscape v2 (one frozen site layout) in game, browser 140..30% no errors. Staffing specialist-first + nurse opposite side done (tests). Perf: tick 29.2->11.7 ms, view 11.9->4.8 ms in 100-hour synthetic.
- 2026-10-08: OWNER: second phlebotomist idle. Owner save read again (read-only): Reese idle in own station room#24; Emery (home room#57) working inside room#24; second station unused; similar idles in other roles. Dispatch-fairness audit worker launched.

## Staff dispatch fairness across roles

2026-10-08, bounded Sol worker for the Claude manager. Implementation and worker
validation complete; ready for manager diff review. Manager retains browser
acceptance and the previously recorded player-suite failure.

Goal: distribute concurrent collection and imaging work across reachable rooms,
prefer each room's home staff, and audit the same failure across all per-room
roles. Preserve specialist-first dispatch and its named short-wait threshold,
existing saved work, pay, durations, clinical content and the active peri-op lane.

Owned lane: shared ordinary service dispatch, diagnostic dispatch preferences,
legacy route staff selection, retail outlet selection, non-peri-op idle dispatch
and regression tests. Re-read each shared file before a narrow patch. No agents,
installs, commits, pushes, publications, owner-save edits or external messages.
Read-only Git status/diff was inadvertently used during initial inspection;
subsequent review uses file snapshots in `.local-dev/staff-dispatch-20261008`.

Milestones: reproduce multi-room/home-staff failures; repair dispatch and audit
roles; verify real chart/order concurrency with shipped geometry; run focused
tests, full domain/player suites and root typecheck; record exact evidence and
browser acceptance. Manager owns integration and final browser acceptance.

Initial findings: ordinary service dispatch independently picks rooms and staff
by ID, then abandons the attempt when that pair cannot route. Pharmacy checks
only the first room for each outlet contract. Diagnostic quotes use queue/travel
but not home preference for several roles. GLP-1 already has per-employee slots;
EVS already loops over all idle workers and reserves distinct targets. MRI has
a future income contract but no current buildable room or imaging staff slot.
### Causes and fixes by role

| Role | Finding | Result |
| --- | --- | --- |
| Phlebotomists | Ordinary operations picked the first room and independently the first employee. A bad first path stopped dispatch. Legacy anonymous reservations were interpreted as indexes into ranked room/staff lists, skipping home staff. Diagnostic quotes allowed only exact-home collection, preventing legitimate spare coverage. | Unbound work tries reachable room/team combinations, preferring ready home teams and then patient distance. Staff are ranked by home, reachable travel and deterministic ID. Anonymous reservations retain their capacity quantity without selecting an arbitrary first room/employee. New quotes allow spare collection coverage, prefer equally available home staff, and protect accepted home work. |
| Ultrasound / X-ray / CT technicians | Shared dispatch and legacy route selection ignored home preferences. Idle-seat reconciliation could rewrite a valid home while that room was temporarily occupied by another technician. | Shared home/route preference and alternative-room retry; durable homes remain distinct during cross-cover. All three current modalities have two-room regressions. |
| MRI technicians | `income.mri` is a future catalog contract; this release has no buildable `room.mri` definition or MRI staff slot. | Shared service dispatch also supports a supplied future room/context. No MRI room, unlock, pay, timing or system was introduced. Shipped MRI concurrency cannot be claimed. |
| Endoscopists | Provider ID ranking could send the other suite's specialist first. | Home provider first, then reachable travel. Existing specialist-before-founder and inclusive `PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES` policy retained. Shipped two-suite tests deliberately reverse staff IDs. |
| Endoscopy nurses | Independent ID selection ignored room assignment and a failed first route could stall a usable suite. | Reachable home nurse first and alternative team/room retry; approved nurse/provider standing spots remain authoritative. |
| GLP-1 NPs | No first-worker bug: installed suite assignments already create independent employee payout slots. `facilityTask: null` at the fixed telehealth post is normal. | No runtime change. Four NPs in two suites retain four slots and all four earn a consultation payout in the regression. |
| EVS | Both workers already claimed distinct targets, but roster ID order could send a distant worker to the oldest target first. | Preserve litter/dirty-room priority and choose the nearest reachable free worker for each target; both workers work concurrently. Existing cleaning duration, restoration and cooldown rules retained. |
| Laboratory technicians | Diagnostic processing already binds each technician to their home Lab and checks every available choice. Manual work-queue jobs used the biased ordinary service dispatcher. | Shared fix covers manual Lab work; two staffed Labs run concurrently with their own technicians. Diagnostic processing's exact-home contract retained. |
| Pharmacists | Retail checked only the first pharmacy for an outlet contract; if its pharmacist was already serving, another staffed pharmacy was never tried. | Check all reachable outlets, ranking queue length and travel, with each pharmacy's home pharmacist. Two authorized prescription customers reserve different pharmacies and different pharmacists. |
| OR nurses / surgeons | Ordinary staff/provider ID ranking could ignore the OR nurse's home and choose a less suitable surgeon route. Surgeons have office homes, so an OR is not their home post. | Home OR nurse first; surgeons rank by reachable travel when office homes do not match the OR. Both ORs use specialists concurrently; the short-wait/founder-overflow contract is unchanged. |
| Receptionists | Refill chose the first receptionist before checking their route; an unreachable first member of a legacy excess roster blocked a reachable colleague. Current hiring supports one receptionist per protected Front Desk. | Check routes before selection, choose the nearest reachable available receptionist, and retain patient check-in priority and refill timing. |
| Radiologists | Prior worker fixed pinwheel-post displacement, early quote binding and unopened-discussion blocking. Current processing/outside-read controllers already iterate per reader and per station. | Preserve those fixes. Additional two-Reading-Room concurrency regression plus the complete prior reader gameplay suite pass. |
| Idle actions | Ordinary non-fixed roles already evaluate every employee's idle schedule independently. Reception, Reading and GLP-1 have intentional fixed posts. | No `staff.ts` edit. Eleven paired non-fixed role/room cases take available idle actions in their own rooms. Peri-op idle/legacy-release code remains the other worker's lane. |

`Number.MAX_SAFE_INTEGER` in a `perform_service` task is the ordinary reservation
sentinel; the operation's finite phase start/end ticks own progress. It is not by
itself evidence of stuck work. Three open operations that include Lab processing
also do not prove three simultaneous collection phases. An extra phlebotomist
can correctly show Ready when there is only one collection job. The regressions
create actual concurrent collection demand and prove both stations are used.

Existing valid frozen in-flight choices remain frozen. Fair preferences apply
to new unbound work and replacement selection; this patch does not silently
reroute a saved underway patient. Fees, salaries, base phase durations, training
and room-modifier formulas, clinical content and provenance are unchanged.
Different appropriate routes can naturally have different walking time.

### Owned files and review evidence

Runtime: `packages/game-domain/src/staff-dispatch.ts` (new small preference/claim
helper), `service-operations.ts`, `diagnostic-timing.ts`, `selectors.ts`,
`room-capacity.ts`, `retail-operations.ts`, and only receptionist refill plus
EVS assignment in `reducer.ts`. Tests: new `staff-dispatch-fairness.test.ts`
(38 cases) and the room-sale fixture in `room-capacity-sales.test.ts`.

The room-sale test had hardcoded the first room and second employee as the
remaining busy resources. Nearest-room dispatch exposed that assumption. Its
fixture now derives the other room and that room's home employee; all original
remaining-duration, wait, recovery and single-payment assertions remain.

File snapshots, actual unified diffs, UTF-8 checks and SHA-256 capture:
`.local-dev/staff-dispatch-20261008/{*.before,*.diff,review.json,review.py}`.
`staff.ts` matches its capture byte-for-byte. Source/clinical/pay/timing catalog
files, rendering, launchers and storage were not edited. The active peri-op
worker's runtime imports, release logic and attention lifecycle are preserved;
shared dispatch explicitly retains peri-op's existing staff ordering and skips
the new preference filter for shared peri-op beds. No agents were spawned.

### Real command concurrency and disposable QA saves

The chart regressions use shipped geometry, legal connected doors, normal
`HIRE_STAFF`, `ADMIT_PATIENT`, `OPEN_CHART`, `SUBMIT_ANSWER`,
`ACKNOWLEDGE_DECISION_FEEDBACK` when needed, `CLOSE_CHART` and ordinary minute
ticks. Patient placement at the Examination care anchor isolates arrival from
the chart/order task. Each scenario submits three real existing chart orders,
observes two simultaneous `in_service` operations at distinct rooms with home
staff, and verifies all three acquisition/collection jobs finish using both
employees. No fabricated perform-service tasks are used in these scenarios.

Optional artifact capture in the new test is disabled for ordinary test runs.
Reproduce from the root:

```powershell
$env:DISPATCH_QA_ARTIFACTS = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/staff-dispatch-fairness.test.ts --pool=threads
Remove-Item Env:DISPATCH_QA_ARTIFACTS
```

Generated paused synthetic saves (normal serialization/deserialization verified)
and JSON summaries in `.local-dev/staff-dispatch-20261008`:

| Save | Observed tick | First employee / home phase | Second employee / home phase |
| --- | --- | --- | --- |
| `phlebotomy-concurrent.json` | 75 | `worker.z.first-home`, `dispatch.station.0`, ticks 73-88 | `worker.a.second-home`, `dispatch.station.1`, ticks 75-90 |
| `ultrasound-concurrent.json` | 75 | `worker.z.first-home`, `dispatch.station.0`, ticks 72-117 | `worker.a.second-home`, `dispatch.station.1`, ticks 75-120 |

Both snapshots have two `perform_service` reservations with the normal sentinel
and two finite active phase windows. Collection staff are at (30,9)/(30,19);
ultrasound staff are at (29,10)/(29,20). These are generated QA states, not the
owner's campaign or profile, and remain an unapproved development prototype.

### Browser checks and manager acceptance

Native browser probe: `node .local-dev/staff-dispatch-20261008/browser-probe.mjs`.
Bundled Chromium is missing; installed Chrome and Edge each fail launch with
`spawn EPERM`. Exact output is `browser-probe.log`. No browser, owner profile,
localStorage or owner save was opened. No visual browser PASS is claimed.

1. Use the manager's existing disposable QA origin at exact
   `http://127.0.0.1:5183`, record `location.origin`, and inject each synthetic
   save through the existing normal-deserialization React QA route. This has
   separate storage from the owner's 4173 campaign. Do not inject it into the
   owner's profile/campaign.
2. Each snapshot starts paused at tick 75. Inspect both staff and both patients:
   each employee must be in their own station, performing collection/acquisition
   for a different patient. Confirm room/service pins and labels match the two
   finite operation windows above; the reservation sentinel must not display as
   a player wait estimate.
3. Unpause at 1x and observe both services progressing and the third queued order
   using the first suitable free room. Use small tick advances when observing
   short walks. After work finishes, observe phlebotomists' ordinary stool/floor
   idle actions and imaging staff returning to their retained home room. Reload
   while both are busy and confirm the frozen tasks/fees do not duplicate.
4. In two endoscopy suites / two ORs, verify each home nurse stands opposite the
   provider at approved spots, specialists perform both concurrent procedures,
   and short-wait/founder overflow still follows the existing policy. Observe
   four GLP-1 NP consultation slots, two EVS cleanup claims, and two authorized
   prescription customers at different pharmacies when that demand exists.
5. Owner pathway remains unchanged: `START_GAME.cmd` -> exact
   `http://127.0.0.1:4173` in the usual persistent browser profile. In the real
   Level-3 campaign, let underway saved jobs finish, then observe new concurrent
   collection orders. A spare Ready employee during single-job demand is normal.
   The remote Pages origin also retains separate saves. No launcher, origin,
   profile, release, deployment or publication changed.

### Final validation and remaining acceptance

The first focused pre-fix reproduction had 7 failures / 2 passes. Two additional
anonymous-capacity regressions later failed against the intermediate dispatch
implementation (2 failed / 36 passed), demonstrating the room/staff index bias;
both pass after retaining those legacy reservations as quantities. Exact logs:
`domain-regression-before.log` and `domain-anonymous-before.log` in the scratch
directory above.

Default test execution was attempted. Domain's ordinary fork pool fails with
`spawn EPERM`; the player's bundled Vite configuration fails on Windows
`net use` with `spawn EPERM`. Final tests therefore use `--pool=threads`.
Player also uses one worker and the scratch native-loader configuration, which
retains both the production React and `forbidPrivateModules` plugins. Normal
repository test/build configuration is unchanged. Default-attempt evidence:
`domain-default.log`, `player-default.log`. Native-loader module-type warning
is recorded in player logs and did not prevent execution.

Focused domain command (exit 0), `domain-focused-verified.log`:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/staff-dispatch-fairness.test.ts tests/procedural-staffing.test.ts tests/diagnostic-timing.test.ts tests/diagnostic-orders.test.ts tests/diagnostic-service-operations.test.ts tests/service-operations.test.ts tests/ultrasound-first-imaging.test.ts tests/room-capacity-sales.test.ts tests/retail-operations.test.ts tests/facility-automation.test.ts tests/receptionist-water-refill.test.ts tests/reading-radiologist-gameplay.test.ts --pool=threads
```

```text
 Test Files  12 passed (12)
      Tests  256 passed (256)
   Start at  16:14:47
   Duration  18.82s (transform 4.63s, setup 0ms, import 10.39s, tests 50.99s, environment 1ms)
```

Focused player command (exit 0), `player-focused-final.log`:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/patientMovementViewModels.test.ts src/session/economyViewModels.test.ts src/ui/StaffPanel.test.tsx --pool=threads --maxWorkers=1 --config ../../.local-dev/staff-dispatch-20261008/vitest-player.config.mjs --configLoader native
```

```text
 Test Files  3 passed (3)
      Tests  23 passed (23)
   Start at  16:01:28
   Duration  3.45s (transform 1.72s, setup 0ms, import 3.12s, tests 84ms, environment 0ms)
```

FULL domain command (exit 0), `domain-full-complete.log`:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
```

```text
 Test Files  115 passed (115)
      Tests  3494 passed (3494)
   Start at  16:16:23
   Duration  112.92s (transform 7.75s, setup 0ms, import 59.74s, tests 379.75s, environment 8ms)
```

FULL player command (exit 1), `player-full-complete.log`:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../.local-dev/staff-dispatch-20261008/vitest-player.config.mjs --configLoader native
```

```text
 Test Files  1 failed | 140 passed (141)
      Tests  1 failed | 1112 passed (1113)
   Start at  16:16:23
   Duration  89.43s (transform 4.28s, setup 0ms, import 40.92s, tests 34.07s, environment 10ms)
```

The sole failure is the previously recorded
`apps/player/src/session/surgeryCenterServicePreviews.test.ts:85` case
`ignores the retired concealment flag and preserves the scheduled external
service after an answer`. Its label expects
`"Off-site thyroid fine-needle aspiration"`; actual output is:

```text
The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking).
```

Earlier manager/worker handoffs already record this same assertion failure,
including reference-tree verification in the performance lane. This worker did
not change or weaken that unrelated assertion. All dispatch/player focused
checks pass; the full player suite is not claimed green.

Root typecheck command (exit 0), `typecheck-complete.log`:

```powershell
npm.cmd run typecheck
```

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Next action belongs to the manager: inspect the owned diff and evidence, run the
browser acceptance above in its permitted environment, and reconcile the one
known player-label failure. Worker runtime validation is complete. Owned source,
tests, documents and scratch evidence are UTF-8 without BOM. This checkpoint is
LOCAL ONLY; no commit, push, merge, publication or deployment was performed.
After acceptance, the manager should remind the owner to say **"push to GitHub"**
for a scoped audited backup. This worker does not create that backup.


## Peri-op nurse queue: legacy coverage release (owner save)

2026-10-08 Sol worker handoff. This lane repairs the legacy employee duty using
only the manager-provided campaign facts; no browser storage or owner save was
read. The reported campaign was Level 3 at facility tick 12900. Blake had an
old cover_periop task from tick 9340 with 9007199254737433 minutes remaining,
location (26,29), a completed six-node route, morale 32, and a paid $125 Level-2
training request queued since tick 10705.

Cause and regression evidence:

- Load reconciliation used any active peri-op bed reservation to justify a
  room-wide coverage task, including new attention-queue visits. Runtime still
  created infinite coverage for marker-less legacy visits and held it for the
  entire visit, including waits in other phases. Any facilityTask blocks nurse
  queue eligibility and paid training departure.
- The supplied targetless task already lost its facilityTask on the prior
  deserialize path, but its old route survived. The exact-shape regression
  catches and repairs that route too. Separate tests reproduce room-bound
  retention and runtime recreation; this avoids assuming an omitted targetId
  exists in the manager's extracted facts.
- Before implementation, the three initial regressions all failed:
  Test Files 1 failed (1); Tests 3 failed (3); Duration 2.37s.
  Full details: .local-dev/periop-legacy-release/before-focused.log.

Fix and save choice:

- One releaseLegacyPeriopCoverage helper runs after load normalization, before
  movement/support/dispatch on ordinary reducer ticks, and at the standalone
  service-operation entry point. It clears the old duty and resets the route
  to the employee's actual position. It handles decremented MAX_SAFE_INTEGER,
  nonfinite values serialized as null, and orphan peri-op room coverage aliases
  using perform_service. Live operation-owned work and periop_attention remain
  owned by their existing engines.
- Retire coverage creation entirely. This makes the existing legacy save
  policy explicit: pre/post phases without periopNurseAttention count as already
  attended and keep their frozen required timers. They require an installed
  operational peri-op nurse and ordinary physical bed/room access, but no old
  visit now depends on an infinite desk-coverage employee reservation. No second
  15-minute check or extra wait is added to those old visits. New visits still
  use the existing finite pre/post attention queue, arrival gates and modifiers.
- Blake's training object, requested time, target level and paidAmount are
  preserved. Ordinary training starts it at an available operational place;
  release never invokes TRAIN_EMPLOYEE or changes cash. If a place is unavailable,
  Blake can check patients and leaves between completed checks once a place opens.
- Search of employee task definitions and production call sites found only
  cover_periop among cover_* tasks. Coverage of that kind is released regardless
  of employee role. Other roles' legitimate perform_service/perform_imaging
  sentinels still belong to their active operations.

Files owned/touched by this lane:

- packages/game-domain/src/legacy-periop-coverage.ts (new shared cleanup).
- packages/game-domain/src/persistence.ts (load cleanup and malformed old coverage).
- packages/game-domain/src/reducer.ts (cleanup before staff scheduling).
- packages/game-domain/src/service-operations.ts (remove old coverage planning and
  gates; keep legacy timers/physical access). This file is co-edited by the
  separate staff-dispatch worker; its home-preference/routing hunks are theirs
  and are preserved.
- packages/game-domain/tests/periop-nurse-owner-save-fixture.ts and
  periop-nurse-owner-save.test.ts (new; 15 regression cases).
- packages/game-domain/tests/periop-nurse-attention.test.ts and
  periop-nurse-owner-feedback.test.ts (legacy assertions now expect attended
  visits without recreating infinite coverage).
- apps/player/src/session/periopNurseOwnerSave.test.ts (new compiled view/labels).
- This appended handoff and docs/handoffs/CURRENT_THREAD_HANDOFF.md.

End-to-end evidence:

The fixture loads through serializeGameState/deserializeGameState, then uses
ordinary ADVANCE_TICK and factory-created endoscopy visitors. It has exactly one
approved 6x6 peri-op room at (23,26), orientation 0, and two approved 3x4 endoscopy
rooms at (27,21) and (30,21), orientation 270. Door positions were not supplied;
this fixture validates legal authored placements (peri-op west offset 0,
endoscopy south offset 1, training east offset 1), non-overlap and operational
access. Four visitors physically walk through pre-op, procedure, recovery and
exit. Tests witness Blake walking to beds, standing at a legal adjacent point,
performing both check kinds, release, paid training and quiet-period seating.
The existing ordinary-chart-command endoscopy tests also pass in focused checks.

Compiled label trace (full trace in owner-save-activity.json/.txt):

- 12902: Walking to training.
- 12912: In training.
- 12972: Returning from training.
- 12982: Sitting between patient checks.
- 13015: Walking to pre-op check · Quinn Bennett.
- 13016: Pre-op check · Quinn Bennett (15 minutes, ending at 13031).
- 13158: Walking to post-op check · Quinn Bennett.
- 13159: Post-op check · Quinn Bennett (15 minutes, ending at 13174).
- Quiet intervals also show Walking to a staff seat / Taking a short walk.
- Covering Peri-op/Recovery never returns after load.

Validation (all Vitest runs use --pool=threads --maxWorkers=1):

Commands and final output:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/periop-nurse-owner-save.test.ts tests/periop-nurse-attention.test.ts tests/periop-nurse-owner-feedback.test.ts tests/periop-nurse-real-visit.test.ts tests/employee-training.test.ts tests/service-operations.test.ts
Test Files  6 passed (6)
Tests       104 passed (104)
Duration    41.36s
Exit        0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  115 passed (115)
Tests       3472 passed (3472)
Duration    295.16s
Exit        0

npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
Test Files  1 failed | 140 passed (141)
Tests       1 failed | 1112 passed (1113)
Duration    79.65s
Exit        1

npm.cmd run typecheck
All seven workspace tsc checks completed without diagnostics.
Exit        0
```

Player failure: src/session/surgeryCenterServicePreviews.test.ts:85:52 expects
"Off-site thyroid fine-needle aspiration" in the pending label; the current label
uses care/return timing. This is the previously recorded unrelated failure.
The pre-fix read-only snapshot loader independently reproduces it. The native
player config is the existing unelevated-sandbox fallback for Vite config-bundle
spawn EPERM; it keeps the React and private-module guard plugins.

Concurrency attribution: the first full domain run recorded seven failures in
the separately authored staff-dispatch-fairness.test.ts, and the early root
check found its CLOSE_CHART command missing encounterId. A read-only Vitest load
overlay using the pre-fix source snapshots reproduced all seven dispatch failures
and the one player failure (2 failed files; 8 failed / 14 passed; 4.13s), without
rewriting live files. The dispatch worker subsequently fixed its lane; the final
full domain rerun and root typecheck above are green. Its routing/home-preference
edits remain in the shared service-operations.ts and are not this lane's edits.
The new compiled nurse scenario initially exceeded Vitest's 5s default while full
suites ran together; it now has the same 30s allowance as the existing long visit
scenarios and passes in the final full player run.

Raw complete logs (UTF-8 without BOM):
.local-dev/periop-legacy-release/focused-domain-integrated.log,
full-domain-integrated.log, full-player-final.log, typecheck-last.log,
baseline-attribution.log. The new owner-save regression alone passes all 15 tests
(6.99s). Generated QA artifacts: owner-save-qa.json (paused old-task save),
owner-save-activity.json and owner-save-activity.txt (both nurse label changes).

Manager browser acceptance:

1. Keep the owner's existing pathway: START_GAME.cmd -> exact
   http://127.0.0.1:4173 in the usual persistent profile. Confirm location.origin;
   5183 has separate storage. No launcher/origin/profile change was made.
2. Reload the existing campaign and click Blake. Covering Peri-op/Recovery should
   disappear on load; an already-running session also repairs at the next tick.
   Do not buy training again. Her already-paid $125 request should show Queued,
   Walking to training, In training, then Returning from training as operational
   training capacity permits. Confirm no new $125 deduction.
3. At 1x, watch new endoscopy patients entering the peri-op beds. A nurse should
   walk to each patient, show Pre-op check / Post-op check plus that patient's
   name, stand in an adjacent aisle for the check, then leave for another patient
   or a staff seat. The paid-training absence is expected; after return both
   nurses should take checks. Use small tick advances; a 10-minute jump may skip
   a one-minute walk on screen. Services should show the waiting queue length.
4. For rapid disposable QA, use the manager's existing React injection route at
   the separate QA origin 5183 with
   .local-dev/periop-legacy-release/owner-save-qa.json. This is a generated Level-3
   state with the old task/paid request, not the owner's campaign/profile. Load
   through normal deserialize, unpause, and verify Blake's duty is cleared. The
   fixture's admit(4) creates an accepted burst without the appointment cadence;
   ordinary reducer movement/service gates still run. Alternatively select the
   colorectal routine-screen case in the existing chart QA harness, answer the
   correct testing question, and click Enact Plan to order endoscopy quickly.
5. Verify the real campaign's actual doors remain connected, Riley's existing
   finite check completes normally, Blake joins new checks when available, both
   return to free staff seats in a quiet interval, and reload retains their paid
   training/progress. Manager retains final browser acceptance.

UTF-8 without BOM. No Git, install, browser-storage read, art/rendering edit,
agent, external message, commit, push or deployment. The local checkpoint is not
backed up by this worker; manager owns integration and the scoped "push to GitHub"
reminder after acceptance.
- 2026-10-08: OWNER: Blake works now. Riley stuck on a pre-op patient; Maxwell Sawyer standing (legacy op waiting since tick 11237); companion Lane Barlow (legacy, no procedureCompanion) standing. Save read again (read-only). Sent nurse4 brief.


### Peri-op flow: stuck legacy patients and companions (owner save)

2026-10-08 - Sol worker handoff to the Claude Code GamifySurgery manager.
Implemented from the supplied tick-13392 facts only; no owner browser/storage/save
was read. The shared staff-dispatch edits in service-operations.ts were preserved.

Cause and repair:

- Riley's task was valid by nurse/standing-point checks even when her patient was
  elsewhere. Its lastProgressAt timestamp was a heartbeat, not proof of performed
  work. The service loop extended the phase every tick without giving an
  in-service patient a route back to the bed. Load and tick reconciliation now
  plans that journey, and attention eligibility requires the patient at the real
  bed endpoint. An absent patient releases the nurse and requeues the same task,
  retaining its FIFO ready time, remaining work and accepted required-until time.
  Riley's saved 14 minutes are performed after arrival; they are never forgiven
  or replaced with another 15-minute bill/timer.
- waiting_for_next_phase denotes a completed current phase: the old transition
  clears phaseStartedAt. Maxwell's saved completed preparation could not advance
  because the FIFO bed-position gate required (27,28) while he stood at (37,23),
  and that waiting status never moved him back. The watchdog repairs the route
  and preserves tick 11237 as his priority. Markerless visits retain the already
  attended legacy policy, including their accepted 29/41/60-minute phases. Phase
  identity/rooms, rather than an exact unmodified 30/60 duration, identify this
  legacy flow on load. Missing old flow flags can be adopted on load or tick.
- Lane's missing procedureCompanion marker deliberately bypassed the new flow.
  Linked old procedure companions are now adopted after restoration and on ticks,
  without teleporting or resetting seated companions. They use the existing
  peri-op chairs/standing fallback and procedure amenities. Terminal companions
  finish their own exit if a filed chart retains a stationary patient position.

The general watchdog repairs missing phase clocks, incomplete-check transitions,
missing recovery beds, stale/wrong-endpoint routes and a completed recovery with
no next phase. Bed endpoints are reconciled to authored care stations instead of
silently dropping their whole visit during load; missing/disconnected capacity
retains the accepted operation for retry. A newly reserved recovery bed is copied
back from the phase candidate. Optional actors release dangling retail locks (or
reconnect to their real active trip); orphaned shoppers and companions exit via
real paths. Unreachable exits/seats expose movementWaitReason in the clicked
actor label. Real resource queues with MAX_SAFE_INTEGER deadlines remain valid:
using the existing 60-minute service wait threshold, a stalled queue reports a
capacity/route reason in Services and the patient activity. No new alert/card
emitter or balance/clinical duration was introduced. The previous cover_periop
cleanup, training/payment behavior, nurse fairness and seated-layering rules are
retained. Owned service sentinel tasks belonging to active work remain valid.

Files in this lane:

- packages/game-domain/src/service-operations.ts: route reconciliation/watchdog,
  phase retry/movement, recovery reservation propagation and final transition.
- packages/game-domain/src/periop-nurse-attention.ts: physical-bed eligibility and
  release/requeue on load/tick without losing progress.
- packages/game-domain/src/persistence.ts: legacy phase/bed normalization and final
  operation/actor reconciliation.
- packages/game-domain/src/procedure-companions.ts, retail-operations.ts, types.ts:
  adoption, orphan locks/actors, real exit walks and visible blocked-route reasons.
- packages/game-domain/tests/periop-stuck-owner-save-fixture.ts and
  periop-stuck-owner-save.test.ts: 14 normal-deserialize/reducer regressions.
- packages/game-domain/tests/level-two-endoscopy.test.ts: an interrupted visit now
  keeps its accepted operation/quote and resumes, with one receipt. Its former
  cancellation/new-operation expectations were updated to the requested retry.
- packages/game-domain/tests/retail-operations.test.ts: allow a legacy displaced
  companion to walk the complete off-map exit (100 ticks rather than 30); the old
  empty-path behavior could make it vanish instantly.
- apps/player/src/session/characterActivityPresentation.ts and
  periopStuckOwnerSave.test.ts: repaired-bed walk/blocked-route labels and two
  compiled Level-3 presentation regressions. No facility rendering/art edits.

Reproduction and end-to-end evidence:

The fixture seeds a colonoscopy encounter through the ordinary chart commands,
then rebuilds the reported old operation/task/actor fields with the normal legacy
procedure factory. Omitted legacy result-link metadata is valid, so that the
accepted onsite visit owns care rather than an unrelated expired result clock.
It uses one approved 6x6 Peri-op room at (23,26), orientation 0, real west-offset-0
entrance, and two approved endoscopy suites with legal doors and no overlaps.
The latest report does not specify the two suite positions: the second synthetic
suite is at (34,21), orientation 0, with west/east-offset-1 doors, so that (37,23)
is actually inside endoscopy; the first is at (27,21), orientation 270. This is a
disposable generated clinic, not a reconstruction of unspecified owner rooms.

All 14 new domain regressions fail against the pre-edit runtime using a read-only
Vitest snapshot loader, with live files untouched. The original three owner-shape
regressions were also recorded failing before the first implementation edit.
With the final code, Riley's patient walks back, receives the remaining 14 minutes
(tick 13408 bedside label to completion 13422), and later receives a full 15-minute
post-op check (13527-13542). Maxwell enters procedure at 13413, returns to recovery
at 13462 and clears the bed/operation at 13526; Lane sits near him, follows the
leaving visit, and walks off the map at 13557. The compiled player view verifies
positions/movement, named pre/post checks, companion chair reservations, queue
counts and nurses sitting between checks. Mid-walk save round trips, live-tick
repair, disconnected-door recovery, missing flags/timers/beds, incomplete checks,
orphan retail actors and a final-phase sentinel wait are covered.

Exact final validation output:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/periop-nurse-attention.test.ts tests/periop-nurse-owner-feedback.test.ts tests/periop-nurse-real-visit.test.ts tests/periop-nurse-owner-save.test.ts tests/periop-stuck-owner-save.test.ts tests/companions.test.ts tests/employee-training-benefits.test.ts tests/retail-operations.test.ts tests/level-two-endoscopy.test.ts
Test Files  9 passed (9)
Tests       147 passed (147)
Duration    62.85s
Exit        0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  116 passed (116)
Tests       3508 passed (3508)
Duration    344.41s
Exit        0

npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/periop-nurse-attention/player-vitest.config.mjs --configLoader native --pool=threads --maxWorkers=1
Test Files  1 failed | 141 passed (142)
Tests       1 failed | 1114 passed (1115)
Duration    88.02s
Exit        1

npm.cmd run typecheck
All seven workspace tsc checks completed without diagnostics.
Exit        0
```

The only final player failure is the previously recorded
src/session/surgeryCenterServicePreviews.test.ts:85:52 assertion expecting
"Off-site thyroid fine-needle aspiration" in the pending label. The pre-edit
snapshot run independently reproduces that failure: 2 failed files, 15 failed /
12 passed, 6.92s (14 new regressions plus that one existing assertion). It is
outside this lane. The existing native player config retains the React/private
module guard plugins and avoids config-bundle spawn EPERM in the worker sandbox.
The final exported compiled scenario passes both tests (1 file, 2 passed, 5.57s).
An early full domain run found one reconciliation-order issue, now fixed without
editing the training test, and the two intentionally changed old expectations
listed above. The final full domain and typecheck reruns are green.

Logs and generated artifacts, UTF-8 without BOM:
.local-dev/periop-stuck-flow/{before-test.log,baseline-final-fixture.log,
focused-domain-final.log,full-domain-final.log,full-player-final.log,
typecheck-last.log,player-qa-final.log,qa-stuck-save.json,
qa-stuck-activity.json,qa-stuck-activity.txt,validated-source-hashes.json}.
No scoped implementation/test file changed after the final suite start.

Manager browser acceptance:

1. Keep the owner's normal pathway: START_GAME.cmd -> exact
   http://127.0.0.1:4173 in the usual persistent profile. Reload the campaign;
   location.origin must be that exact origin. No save reset or launcher change is
   needed. The manager's 5183 QA origin has separate storage.
2. At 1x, click Riley and watch her current patient/bed. The absent-patient check
   should release, the patient should visibly walk to the reserved real bed, and
   a nurse should resume the remaining check next to it. During repair the
   patient's label says Walking to a peri-op bed; a delayed ready patient reports
   Waiting for peri-op nurse. A nurse's label names the actual patient. Use small
   tick advances: Fast-forward 10 min can skip short walks on screen.
3. Find Maxwell and Lane. Maxwell should resume procedure/recovery and then clear
   the peri-op bed; filing his chart must not strand that operation. Lane should
   be adopted, claim a reachable peri-op chair or standing fallback, and leave
   with/after the visit. Check both real endoscopy doors and the peri-op door are
   connected; a genuinely blocked route/capacity now has a visible reason.
4. For disposable acceptance on 5183, inject qa-stuck-save.json via the manager's
   existing React-session QA route, restoring through normal deserialize. It is
   paused at tick 13392. Unpause, watch service-operation.353 / service-operation.260 /
   companion.59 and compare qa-stuck-activity.txt. Maya Reed is only the
   synthetic name used for Riley's otherwise unnamed patient in this fixture.
   Do not replace the owner's persistent 4173 campaign with this QA state.
5. Reload midway through a return walk/check and verify progress is retained.
   After a quiet interval nurses should walk to free staff seats/idle actions;
   paid training continues under the previous fix. For quick new-traffic QA use
   the existing chart harness's colorectal routine-screen case, answer the
   testing question correctly and Enact Plan; new accepted visits get both checks.
   Verify the care/attention gates and Services queue, not just movement labels.

Manager retains actual-browser acceptance and integration. UTF-8 without BOM;
no Git, installation, art/rendering/layering edit, browser-storage read, agent,
external message, commit, push or deployment. This validated checkpoint remains
local; the manager owns the scoped "push to GitHub" reminder after acceptance.
- 2026-10-08: owner confirmed the stuck-flow and dispatch fixes work in game. Owner request: room cost/revenue audit so baseline function offsets upkeep; economy audit worker launched (proposal only).
- 2026-10-08: OWNER: "Push to GitHub" (second checkpoint) and next focus: get Level 4 ready to launch. Checkpoint-2 archive worker launched.
