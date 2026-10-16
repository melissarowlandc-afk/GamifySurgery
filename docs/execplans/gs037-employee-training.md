# GS-037 — Employee Training Room

Status: complete, validated and backed up to GitHub. On October 7 the owner accepted all proposed
levels, percentages, prices and operating details, explicitly confirmed that
queued employees keep working, and requested concise Management explanations.
Claude owns the training button and Management revamp; preserve those files.

## Goal

Finalize individual employee training: player approval, payment, a two-place
Training Room queue, one-hour sessions and permanent role-specific percentage
benefits. Preserve current campaigns, employee identities and frozen work.

## Owner direction — October 7, 2026

- The player approves training for each employee individually in Management.
- The player pays when requesting training; requests enter a queue.
- The Training Room supports two employees training simultaneously.
- Each session takes one hour of in-game time.
- During training an employee cannot perform normal duties. Staffing shortages
  may delay the clinic, including pre-op/PACU transitions and onsite collection.
- Patients needing an unavailable phlebotomist wait for that staff member;
  temporary training is not a direction to automatically outsource their draws.
- Benefits should be percentage improvements and prices increase with level.
- Claude is designing the Management button. This task does not implement or
  redesign that button. No external messages have been authorized.
- The owner approved the price/benefit table and authorized implementation.
- Show very brief role-specific explanations in Management, such as
  "Decreases time 10%" or "Increases consult $5". Supply current/next-level
  labels and training actions for Claude's button without implementing it.

## Repository state and ownership

Read AGENTS.md, current handoff, original Level 2 implementation notes, GS-015
room design, GS-035 handoff, Claude coordination and GS-038 planning. Branch is
beta, with extensive concurrent dirty source/art/docs. Preserve all unrelated
edits; no reset, stash, broad staging, commit, push or deployment here.

Pre-implementation behavior: employees are hired at trainingLevel 1; saved levels 1-5
normalize successfully, but no active sessions/level-up mechanism exists.
A reachable operational Training Room grants +1 routine workload capacity.
Its approved 3x3 artwork has a two-person practice bench and two stools.

GS-034 owns diagnostic timing and frozen order/service rules. Its current
diagnostic-timing.v1 table contains approved fixed game durations and disables
old room-speed scaling. This authorized milestone applies employee modifiers to
staff-controlled work through frozen order/service contracts without editing
that base timing table.
GS-038 owns room upgrades and interactions between room/employee benefits.
GS-035/036 own patient guidance/goals; GS-028 clinical content; GS-029 alerts;
GS-033/Claude character/motion work. Claude also owns the button appearance as
directed by the owner in this discussion.

## Approved levels, percentages and prices

Keep Level 1 as the current hired baseline (no training purchase). Each paid
one-hour session advances exactly one level, through Levels 2, 3, 4 and 5.

For most roles, cumulative benefit versus the Level 1 baseline is 0%, 10%,
20%, 30%, 40%. Pharmacy procurement uses 0%, 5%, 10%, 15%, 20% instead.
Only the current level's percentage applies; do not add all past tiers.
Time reduction is literal: 40% less task time means 60% of baseline time.
Training sessions themselves stay 60 game minutes at every level.

| Employee | Approved affected metric | L2 price | L3 price | L4 price | L5 price |
| --- | --- | ---: | ---: | ---: | ---: |
| Receptionist | Waiting-related satisfaction loss reduced | $75 | $150 | $225 | $300 |
| Imaging Technician | Staff-controlled imaging acquisition time reduced | $75 | $150 | $225 | $300 |
| Peri-op Nurse | Pre-op preparation work time reduced | $125 | $250 | $375 | $500 |
| Endoscopy Nurse | Endoscopy team work time reduced | $125 | $250 | $375 | $500 |
| Endoscopist | Endoscopy team work time reduced | $225 | $450 | $675 | $900 |
| Phlebotomist | Onsite blood collection work time reduced | $100 | $200 | $300 | $400 |
| EVS Worker | Cleanliness restored per room-cleaning job increased | $75 | $150 | $225 | $300 |
| GLP-1 NP | Payment per completed automated consultation increased | $150 | $300 | $450 | $600 |
| Laboratory Technician | Staff-controlled onsite lab processing time reduced | $125 | $250 | $375 | $500 |
| Surgeon | OR team work time and operational QI review time reduced | $350 | $700 | $1050 | $1400 |
| OR Nurse | OR team work time reduced | $175 | $350 | $525 | $700 |
| Pharmacist | Pharmacy supply purchasing cost reduced (5/10/15/20%) | $150 | $300 | $450 | $600 |
| Repair Person | Equipment repair work time reduced | $100 | $200 | $300 | $400 |
| Radiologist | Staff-controlled onsite interpretation work time reduced | $75 | $150 | $225 | $300 |

Base training price: 25% of the current role's hiring cost, rounded up to the
next $25 with a $75 minimum. Subsequent prices are 2x, 3x and 4x that base.
These are fixed role prices, not affected by individual salary changes. Each
cell is the payment for that one transition, not the cumulative amount spent.
Full progression costs 10x the base plus four hours of lost work and continuing
wages. Owner acceptance approves these initial game values; observed economic
balance remains a later playtest question.

For the NP proposal, keep the existing untrained $50 fee and 60-minute cadence;
training adds 10/20/30/40% to each completed consultation's payment, reaching
$70 at Level 5. The owner approved this training-specific payment change.

## Approved operating details

- Employees continue working while waiting in the paid queue. Once selected
  for a free place, they finish their current duty before leaving; do not
  abandon an active procedure or necessary bedside coverage.
- Reserve a training place for its assigned employee while they walk there.
  The hour starts on arrival at that place. Travel to/from training also makes
  that employee unavailable until they have returned to their work position.
- A training assignment cannot be seized by a clinical task during its hour.
  Spare qualified staff can cover; otherwise affected work waits as directed.
- At completion, increment the employee's level once and route them back to
  their normal post. Benefits follow that identity and persist in saves.
- Queued requests, payment, reserved places and remaining session time persist;
  reload must not repay, duplicate a level increase or bypass clinic shortages.
- Retain the existing passive +1 workload benefit separately pending a later
  explicit decision. It is not earned again by each employee training.
- Staff-controlled work receives time reductions. Patient recovery intervals,
  externally processed tests, travel and equipment-specific minimums keep their
  independent agreed rules. Already frozen work keeps its accepted durations.
- October 7 clarification: use the average achieved benefit across all hired
  employees in the same role/category. One employee at 40% and another at 0%
  gives a 20% category benefit. Queued/away staff still count their achieved
  level; availability and category skill are separate. Departing staff do not
  count. For shared procedural work, average the provider and nurse category
  benefits; two 40% categories give a 40% reduction. Founder coverage uses 0%.
- Receptionist communication benefits require an available receptionist and
  apply only to waiting-related loss, not other dissatisfaction causes.
- Room/employee stacking, timer precision and floors must be reviewed against
  GS-034/038 before implementation. No accidental learning XP, FSRS updates,
  clinical accuracy changes, new questions or clinical content are implied.

## Implementation decisions and ownership

- Process eligible queued employees in paid request order; skip busy employees
  without preventing a later eligible request using a free training place.
- Keep two reserved places during outbound walking/training; release on completion
  of the session so a following employee can begin their trip while the previous
  employee returns. Returning staff remain unavailable until home arrival.
- No cancellation/recall UI is introduced. Preserve and pause a started session
  if its room becomes inaccessible; resume its remaining work when usable.
  Dismissal cancels that employee's request; queued/unstarted payment is refunded
  once. Room sale must not silently erase a paid session. Exact safeguards are
  finalized after inspecting existing sale/access commands.
- Individual cards show that employee's personal achieved/next benefit; the
  Management role header and runtime show/use the category average as clarified
  by the owner. No rounding of averaged skill is applied before calculating work.
- Time bonuses apply to new accepted work only, with frozen effective phase
  duration retained in saves. Room speed scaling remains disabled under GS-034's
  contract. No new room-upgrade multipliers are invented here.
- Reviewed freeze interpretation: new service work captures baseline phases and
  category skill at acceptance. Its first successful phase reservation selects
  the employee-provider or founder alternative once. Later replacements inherit
  that already-bound job's remaining time, including founder replacement.
  Diagnostic plans carry already-effective phases and factories never reduce
  them again. Legacy unmarked work keeps its prior contract. Positive effective
  work rounds up to whole game minutes; zero-duration markers remain zero.
- If a training session is paused by access loss, installed onsite work can
  still be accepted and waits locally. Construct its frozen local contract with
  nominal structural clocks while ignoring only that unknown training hold;
  all live forecasts/execution honor the hold. Player duration is unknown/blocked
  until staff availability is finite. Internal nominal clocks cannot trigger a
  result or payment without physical/processing witnesses. This avoids an
  unrequested outside fallback and retains the existing strict saved-plan shape.
- NP consultation payments use prospective interval quotes alongside GS-038:
  each new hourly interval freezes the unrounded NP category benefit and actual
  suite revenue quote when it starts. Later staff/room changes affect the next
  interval. An older slot without a quote keeps its baseline payment for that
  already accepted interval; no retroactive bonus or duplicate fee is created.
- While both stools are full, a queued NP continues consultations. A missed
  departure opportunity moves its eligibility to the next active consultation
  payout, so a stool becoming free mid-hour never abandons the current consult.
  Root reproduced the issue, fixed the post-assignment boundary and passed the
  real 3/63/123-minute payout, stool-release and reload regression.
- Sole domain worker owns a bounded training milestone and its new tests.
  Root owns durable planning, player data/controller integration outside Claude's
  button/layout, isolated browser acceptance and actual diff review.
- Sol employee_training_core completed and handed back the runtime milestone
  and its exclusively owned benefit tests. Root resolved the prospective NP
  quote contract above, inspected the actual integration hunks and independently
  reran the final regression suite. Temporary write ownership is released.
- Do not touch ManagementPanel.tsx, StaffPanel.tsx, App.tsx, AppShell.tsx or CSS
  for button/layout work. Re-read shared files before narrow integration edits.

## Milestones and acceptance

- [x] M1: inspect current behavior and preserve prior room/progression decisions.
- [x] M2: record owner session direction and prepare a concrete price/benefit
  proposal. Owner subsequently accepted all numerical choices.
- [x] M3: agree final rules and acceptance criteria with the owner; record a
  bounded integration contract without taking over Claude's button.
- [x] M4: implement only after authorization, with explicit file ownership and
  current adjacent handoff inspection; preserve campaign/save compatibility.
  - [x] M4A: Sol employee_training_core implemented the paid working queue,
    two reserved stools, 60 seated minutes, unavailable travel/return,
    idempotent level gain, paused/recoverable access loss, dismissal refund,
    and additive strict saved state. Parent inspected actual snapshot-relative
    hunks and independently passed 51 catalog/core/save/player tests plus
    domain/balance typechecks. Worker separately passed 33 core/catalog/save
    tests. The final integrated run also passes all existing scoped
    staffing/support/service/save and Level 2 endoscopy checks.
  - [x] M4 player data: short descriptions for all 14 roles, current/next/
    incremental benefit, cost/status/eligibility, trainEmployee session action,
    and unchanged approved stool supports. Claude consumes these as-is.
  - [x] M4B: same Sol worker implemented category-average runtime benefits and
    training-aware diagnostic calendars. Astra training_effects_review completed
    bounded read-only reviews of freezing, paused local work, spare coverage and
    held-bed continuity. Sol corrected both reported forecast issues; root
    reviewed the code and regressions and independently passed the final suite.
- [x] M5: targeted domain/persistence checks and isolated browser scenarios for
  queue capacity, payment/level idempotence, unavailable-duty delays, employee
  return and percentage consequences. Inspect actual diffs before completion.

## Final validation — October 7, 2026

- Sol's final domain/catalog run and root's independent rerun both passed
  295 tests across 19 files, including 30 benefit/calendar tests, paid queue,
  persistence, NP consultation continuity, diagnostic/service operations,
  retail, support and Level 2 endoscopy regressions. Vitest used one worker,
  no file parallelism and excluded `.local-dev/**` and `artifacts/**`.
- Root's player run passed 57 tests across eight files covering all 14 brief
  labels, fractional NP averages, role/card data, stool poses, Management and
  blocked diagnostic/chart presentation. Domain, balance and player TypeScript
  checks passed against the final source.
- Two isolated desktop Chrome scenarios passed: actual two-stool seated poses,
  third paid request queued/working, reload retaining payment/progress, all
  three returning at Level 2 with no duplicate charges or page errors; and
  Claude's existing Management buttons showing short gains/costs and accepting
  individual requests. Evidence is in ignored
  `.local-dev/gs037-employee-training/browser/`.
- Final Vite production build passed into the new isolated
  `.local-dev/gs037-employee-training/production-build-20261007-final/` directory.
  Existing large-bundle warning remains. Package/launcher boundary checks pass.

Astra verified that nominal structural dates for paused local orders cannot
earn fees or deliver results; physical/processing witnesses and result/care
milestones remain authoritative. Root removed nominal blocked queue/walk/ETA
presentation and the diagnostic legacy due-date fallback. Sol's reviewed fixes
prefer available spares, retain a held recovery bed when replacing a nurse,
preserve accepted work duration and align forecast with execution. Started
work, founder alternatives, save normalization and prospective NP payment
quotes have regression coverage. No unresolved training implementation failure
was found in the scoped validation. Historical full-suite notes in the shared
coordination document are not a claim that the whole repository was retested.

Concurrent GS-038 revenue, Claude Management/name/motion and other rooms/art
remain intact. Browser QA used `http://127.0.0.1:4173` in isolated test profiles,
without touching owner storage. Owner opening pathway remains
`START_GAME.cmd` -> `http://127.0.0.1:4173` in the same persistent profile.

## Authorized GitHub backup — October 7, 2026

The owner said **"Push to GitHub"** after the implementation handback. The
current `beta` tree contains extensive concurrent GS-034/038/039 and Claude
edits. Back up GS-037 as a recovery archive with full copies of wholly owned
training files and verified training-only patches for shared files. Preserve
the live tree, shared index, unrelated source/art and private/ignored inputs.
The existing Management backup contains the unrounded mean integration.

Sol employee_training_core owns the bounded domain patch extraction under
ignored `.local-dev/gs037-employee-training/backup-domain-review/`; root owns
player patches, new files, source/privacy/secret audit, archival packaging,
scoped commit/push, remote verification and durable handoff. No live gameplay
changes are needed. Patches requiring the concurrent GS-034/038 compatible
baseline must name that dependency; do not invent an alternate implementation.

- [x] M6: audit and verify all included files/patches, commit the scoped recovery
  archive, push the current branch normally, and verify the remote commit.

Verified backup: checkpoint `bb70744a778ade8bf7af2f1da9fbb728a91e594e` on `origin/beta`,
confirmed with `git ls-remote`. Archive: `artifacts/checkpoints/employee-training-20261007/`.
Root inspected Sol's actual domain patches, independently checked recovery
hashes and audited every included path for source ownership, credentials,
private data, clinical content and generated assets. The checkpoint uses an
isolated Git index and preserves unrelated live source and staged work.
No merge, release, deployment or Pages publication occurred. Owner playtest
remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the same profile.
Implementation and authorized backup are complete. Exact Management exports,
prices and short copy remain in `docs/handoffs/GS-037_EMPLOYEE_TRAINING.md`.
