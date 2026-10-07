# GS-037 Employee Training integration

Status: implementation complete and validated locally on October 7, 2026.
Owner approved all prices, percentages and queue behavior on October 7, 2026.
Claude owns the Management layout and training button. This task supplies data,
actions and runtime behavior without editing that button or its layout.

## Management contract

`usePrototypeSession()` exposes `trainEmployee(employeeId: string): void`.
It sends the idempotent domain command `TRAIN_EMPLOYEE` through the existing
session command path. Wire that callback into the Management employee row.

Each `StaffMemberView` row in `view.staffRoles[].employees[]` has `training`:

- `level`, `nextLevel`, `cost`, `costLabel`, `canTrain`, `blockedReason`
- `status`: `idle`, `queued`, `walking`, `training`, `returning`, `max_level`
- `statusLabel`, `minutesRemaining`, `sessionDurationMinutes`
- `currentBenefitLabel`: cumulative benefit versus Level 1
- `nextBenefitLabel`: cumulative benefit after the proposed session
- `incrementBenefitLabel`: improvement from just the next session

Use `canTrain` to enable the action and `blockedReason` for its explanation.
Show the current benefit alongside the employee's level. In the purchase
action or confirmation, use `incrementBenefitLabel` plus `costLabel` and the
one-hour duration. A Level 3 NP's current bonus is `$10 per consult`; the next
session adds another `$5`, reaching `$15` total at Level 4.

## Concise benefit copy

These examples are the Level 2 cumulative benefit and each next session's
increment. Levels 3/4/5 use 20/30/40% totals; pharmacy uses 10/15/20% totals.
Level 1 says `Base performance`.

| Role | Brief explanation | L2 / L3 / L4 / L5 price |
| --- | --- | --- |
| Receptionist | Reduces wait penalties 10% | $75 / $150 / $225 / $300 |
| Imaging Technician | Reduces scan time 10% | $75 / $150 / $225 / $300 |
| Peri-op Nurse | Reduces prep time 10% | $125 / $250 / $375 / $500 |
| Endoscopy Nurse | Reduces procedure time 10% | $125 / $250 / $375 / $500 |
| Endoscopist | Reduces procedure time 10% | $225 / $450 / $675 / $900 |
| Phlebotomist | Reduces draw time 10% | $100 / $200 / $300 / $400 |
| EVS Worker | Improves cleaning 10% | $75 / $150 / $225 / $300 |
| GLP-1 NP | Adds $5 per consult | $150 / $300 / $450 / $600 |
| Laboratory Technician | Reduces lab work time 10% | $125 / $250 / $375 / $500 |
| Surgeon | Reduces OR/QI time 10% | $350 / $700 / $1050 / $1400 |
| OR Nurse | Reduces OR time 10% | $175 / $350 / $525 / $700 |
| Pharmacist | Cuts supply costs 5% | $150 / $300 / $450 / $600 |
| Repair Person | Reduces repair time 10% | $100 / $200 / $300 / $400 |
| Radiologist | Reduces reading time 10% | $75 / $150 / $225 / $300 |

Labels are generated in `apps/player/src/session/employeeTrainingViewModels.ts`
from the same percentages as domain benefits. They are available without a
new UI button. NP dollar labels derive from the active balance consult fee.
Pass an unrounded category percentage to `employeeTrainingBenefitLabel`.
It formats percentage text to one decimal and dollar text to cents; rounding
the percentage first can change the displayed NP payment by a few cents.

Runtime role averages are exported as
`getEmployeeRoleTrainingPercent(state, staffRoleDefinitionId): number` from
`@gamify-surgery/game-domain`. The result is unrounded. Sol has handed back the
benefit tests; temporary exclusive worker ownership is released.

## Runtime rules

Level 1 is the hiring baseline. Pay once to queue a single level increase.
Queued employees keep working; an eligible employee finishes the current duty
before leaving. Each Training Room has two distinct stools, reserved during
outbound travel. The 60-minute clock starts on arrival. Staff are unavailable
while walking to training, training and returning to their own post. The stool
is freed when the hour completes. Wages continue and state persists in saves.

The owner clarified that runtime benefits use the average achieved percentage
of all hired employees in that category. A 40% employee plus a 0% employee means
20% for the role. Queued/away staff still count their achieved level; their
unavailability is separate. Departing employees do not count. Individual cards
describe personal progression; role headers describe the category average.
Team procedures average the relevant provider and nurse category percentages;
founder coverage contributes baseline 0% for the provider part.

Time reductions affect staff work, using those category/team averages.
Recovery, travel and outside processing retain independent durations. Frozen
prior work keeps its original duration. NP training changes the completed
consultation fee, while the hourly cadence stays fixed. Employee training
does not grant clinical XP or change learning/FSRS records. The Training Room's
existing passive workload bonus stays separate.

Each new NP consultation interval freezes its category benefit and actual suite
quote at the start, alongside GS-038 room revenue. Changes affect the next
interval; an old unquoted interval retains its baseline fee. A queued NP that
misses a free stool at a payout completes the next consultation before leaving.

## Validation and handback

Sol `employee_training_core` implemented lifecycle/save and runtime benefits;
Astra `training_effects_review` reviewed frozen work and diagnostic scheduling.
Root inspected the actual diffs, corrected player presentation and NP queue
continuity, and independently validated the final integration.

- Domain/catalog: 295/295 tests across 19 files, including 30 benefit/calendar
  regressions. Root's independent rerun matched Sol's result.
- Player: 57/57 tests across eight files, including all 14 role descriptions,
  fractional category averages, Management data and seated supports.
- Domain, balance and player TypeScript checks passed. Package/launcher
  boundaries and an isolated production build passed.
- Desktop Chrome: 2/2 scenarios passed using Claude's actual Management action,
  two seated employees plus a working queue, reload, payment and level-up
  idempotence, and return to work. Evidence is under ignored
  `.local-dev/gs037-employee-training/browser/`.

Available spares cover training absences; otherwise installed onsite work waits
locally. Paused training yields an unknown live ETA. Nominal internal dates
cannot deliver a result or earn a fee. Replacing a peri-op nurse retains the
patient's accepted bed and work duration through recovery.

No live owner campaign or launch pathway was changed. QA used isolated profiles
on the canonical origin. Continue opening `START_GAME.cmd` at
`http://127.0.0.1:4173` in the existing browser profile. This checkpoint is
LOCAL ONLY; say **"push to GitHub"** to authorize its backup. No commit, push,
release or publication occurred in this task.
