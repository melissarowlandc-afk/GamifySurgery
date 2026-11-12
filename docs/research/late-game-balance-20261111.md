# Late-game balance pass - 2026-11-11

The cost-only pass is implemented. It makes the matched Level5 max-tier buying
control take **16.4% longer**, and Level4 take **23.7% longer**, while preserving
running margins, existing ownership and paid work. **The requested +10-20%
campaign-finish target is not met by these cost changes: the official journey
finishes at exactly the same tick.** The manager was asked whether to keep this
cost-only scope or also tune a late progression goal. No progression change or
approval is inferred; the reviewable cost pass is retained.

## Design and ownership

These are editorial simulation weights, not clinical relationships. Upgrades
to room/staff tiers2 and3 are unchanged. Tiers4 and5 add about20% and40%, with
room costs rounded to the nearest $5 and staff prices rounded to whole dollars.
The aggregated one-of-each four-purchase ladders increase21.3% for rooms and22% for staff,
so the headline final-tier premium is not applied to the entire ladder.
Level4 room construction and APP hiring rise15%; prestige rooms and Executive
hiring rise20%. Existing service fees, payouts/reward configuration, XP goals,
arrivals, service/training durations, capacity, wages, morale and room upgrade
benefits remain unchanged. There is no new fee or spending gate.

Upkeep was deliberately preserved: the brief asks that only future purchases
cost more, and a recurring liability would also affect existing owners. Extra
late hires supply a modest additional one-time money sink without worsening
recurring payroll. Owned room/staff tiers remain intact; saved paid training
uses its original paidAmount for display, completion and any pre-start refund.
The existing resale rule continues to value a future sale from the current
catalog at25%; no historical investment field or save-format change is added.

Owned runtime balance files (only pricing hunks):

- `packages/balance-config/src/prototype-balance.ts`: Level4 construction,
  APP hiring and the matching room upgrade vectors.
- `packages/balance-config/src/level-five-rooms.ts`: prestige construction and
  matching upgrade vectors.
- `packages/balance-config/src/room-upgrades.ts`: all current tier4/5 vectors.
- `packages/balance-config/src/employee-training.ts`: tier4/5 price weights.
- `packages/balance-config/src/level-five-executive.ts`: future hiring cost.

No domain runtime, clinical/question content, renderer/perf, cloud or save codec
was edited. Reward, service-income and progression data are unchanged. Topic workers' files
are preserved. Tests update exact accepted-price expectations with the same
capability, geometry, effect, payment and frozen-term assertions.

## Exact future purchase prices

Dollar prices below are editorial simulation weights. All omitted prices and all running costs are unchanged.

| Room upgrade | To4 before -> after | To5 before -> after |
| --- | ---: | ---: |
| `room.examination` | 210 -> 250 | 300 -> 420 |
| `room.bathroom` | 170 -> 205 | 250 -> 350 |
| `room.waiting` | 250 -> 300 | 360 -> 505 |
| `room.xray` | 400 -> 480 | 560 -> 785 |
| `room.minor_procedure` | 480 -> 575 | 680 -> 950 |
| `room.ultrasound` | 525 -> 630 | 715 -> 1,000 |
| `room.ct` | 880 -> 1,055 | 1,200 -> 1,680 |
| `room.phlebotomy` | 305 -> 365 | 415 -> 580 |
| `room.evs_closet` | 260 -> 310 | 360 -> 505 |
| `room.endoscopy` | 800 -> 960 | 1,090 -> 1,525 |
| `room.periop_recovery` | 495 -> 595 | 675 -> 945 |
| `room.training` | 360 -> 430 | 490 -> 685 |
| `room.coffee_kiosk` | 275 -> 330 | 375 -> 525 |
| `room.glp1_telehealth_suite` | 660 -> 790 | 900 -> 1,260 |
| `room.ambulatory_or` | 1,320 -> 1,585 | 1,800 -> 2,520 |
| `room.laboratory` | 990 -> 1,190 | 1,350 -> 1,890 |
| `room.pharmacy` | 660 -> 790 | 900 -> 1,260 |
| `room.maintenance_workshop` | 440 -> 530 | 600 -> 840 |
| `room.staff_break` | 495 -> 595 | 675 -> 945 |
| `room.surgeon_office` | 385 -> 460 | 525 -> 735 |
| `room.vending` | 250 -> 300 | 340 -> 475 |
| `room.reading` | 990 -> 1,190 | 1,350 -> 1,890 |
| `room.mri` | 1,300 -> 1,560 | 1,800 -> 2,520 |
| `room.pediatric_waiting` | 325 -> 390 | 450 -> 630 |
| `room.pediatric_examination` | 325 -> 390 | 450 -> 630 |
| `room.wound_ostomy` | 550 -> 660 | 750 -> 1,050 |
| `room.founder_office` | 750 -> 900 | 1,000 -> 1,400 |
| `room.executive_office` | 1,100 -> 1,320 | 1,500 -> 2,100 |
| `room.gift_shop` | 450 -> 540 | 600 -> 840 |
| `room.indoor_garden` | 450 -> 540 | 600 -> 840 |
| `room.staff_gym` | 550 -> 660 | 750 -> 1,050 |

All room upgrades to2 and3 retain their original prices. Higher-tier premiums also apply when a player chooses to buy those tiers in an early facility; no new tier lock was added.

| Staff training | To4 before -> after | To5 before -> after |
| --- | ---: | ---: |
| `staff.receptionist` | 225 -> 270 | 300 -> 420 |
| `staff.imaging_technician` | 225 -> 270 | 300 -> 420 |
| `staff.periop_nurse` | 375 -> 450 | 500 -> 700 |
| `staff.endoscopy_nurse` | 375 -> 450 | 500 -> 700 |
| `staff.endoscopist` | 675 -> 810 | 900 -> 1,260 |
| `staff.phlebotomist` | 300 -> 360 | 400 -> 560 |
| `staff.evs_worker` | 225 -> 270 | 300 -> 420 |
| `staff.glp1_np` | 450 -> 540 | 600 -> 840 |
| `staff.app` | 450 -> 540 | 600 -> 840 |
| `staff.executive` | 300 -> 360 | 400 -> 560 |
| `staff.laboratory_technician` | 375 -> 450 | 500 -> 700 |
| `staff.surgeon` | 1,050 -> 1,260 | 1,400 -> 1,960 |
| `staff.or_nurse` | 525 -> 630 | 700 -> 980 |
| `staff.pharmacist` | 450 -> 540 | 600 -> 840 |
| `staff.repair_person` | 300 -> 360 | 400 -> 560 |
| `staff.radiologist` | 225 -> 270 | 300 -> 420 |

Training to2/3 is unchanged, including current paid work.

| Room construction | Before | After | Change |
| --- | ---: | ---: | ---: |
| `room.mri` | 2,400 | 2,760 | +15% |
| `room.pediatric_waiting` | 600 | 690 | +15% |
| `room.pediatric_examination` | 600 | 690 | +15% |
| `room.wound_ostomy` | 1,000 | 1,150 | +15% |
| `room.founder_office` | 1,200 | 1,440 | +20% |
| `room.executive_office` | 2,000 | 2,400 | +20% |
| `room.gift_shop` | 800 | 960 | +20% |
| `room.indoor_garden` | 800 | 960 | +20% |
| `room.staff_gym` | 1,000 | 1,200 | +20% |

| Hiring | Before | After |
| --- | ---: | ---: |
| `staff.executive` | 600 | 720 |
| `staff.app` | 600 | 690 |

One of every current room ladder totals $60,960 -> $73,955 (+21.3%). One of every staff ladder totals $21,750 -> $26,535 (+22.0%). These are optional max-out baskets, not required progression spending.

## Measurements and interpretation

Inputs are frozen separately under
`.local-dev/late-game-balance-20261111/{before,candidate}/inputs/`.
Both clinical releases hash to
`b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`
(1151 cases /1462 nodes /610 concepts). This isolates prices from concurrent
unaccepted topic authoring. Runs use the existing real reducer/driver classes,
normal case selection, source consults, walking, payroll, stock and care. The
unmodified official generator is invoked without --write. Its private progress
writes are intercepted in memory; canonical writes are rejected.

### Time to progress

| Measurement | Before facility minutes | After | Change |
| --- | ---: | ---: | ---: |
| Level3 eligibility, independent operational control | 3,004 | 3,004 | 0% |
| Level4 eligibility/advance, official M9 | 3,969 | 3,969 | 0% |
| Level5 eligibility/unlock, elapsed after entering5 | 12,908 | 12,908 | 0% |
| Level5 first finish, elapsed after entering5 | 15,966 | 15,966 | 0% |
| M9 start at4 to first Level5 finish | 19,935 | 19,935 | 0% |
| M9 end including two later inspections/continued play | 26,649 | 26,649 | 0% |

One existing driver operating-day session is600 active minutes, with real FSRS
calendar time advancing between sessions. The first finish is332.25 facility
hours from the funded Level4 opening; the full three-inspection driver ends
at444.15 hours. The Level3 control is a separate zero-XP opening, not a prefix
of M9. M9 does not replay Levels0-2; no invented full0-to5 timing is claimed.
For early-save preservation, all15 Level0/1/2 x schema5-9 pairs have identical
loaded-state and next120-minute hashes before/after this isolated change.
Every early construction price and tier2/3 price is independently pinned.

The time limitation follows directly from
`tests/fixtures/level-five-integration.ts:38-45,118-139,141-180`: it begins with
a funded clinic, constructs its late cluster immediately, and never buys room
upgrades or training. Its purchases do not wait on affordability. As long as
prices remain affordable, they do not change its XP/satisfaction/morale goals
or care timing; making a required scripted purchase unaffordable would fail
the driver rather than extend play. Increasing costs enough to create unpaid
payroll would conflict with the no-cash-spiral requirement. An intentional
progression-goal change or a separately approved purchasing strategy would be
needed to target a longer official finish. Neither is silently introduced here.

### Actual late purchase opportunities

A matched purchasing control starts with $2,000 after setup, retains a two-hour
operating-cost reserve, buys the selected room to5, then trains its selected
employee to5. All purchases use real reducer commands and quoted current costs;
training travels, queues and completes normally. Timing therefore includes
cash availability and staff availability. These are deliberate max-out controls,
not new conditions for winning the campaign. They stop after both tiers are
achieved, so total visits/income cover different durations.

| Level / selected pair | Both maxed before | After | Change | Lowest cash before -> after |
| --- | ---: | ---: | ---: | ---: |
| 3 / OR + Surgeon | 999 min | 1,038 min | +3.9% | $350.15 -> $85.15 |
| 4 / MRI + APP | 2,214 min | 2,738 min | +23.7% | $186.52 -> $186.52 |
| 5 / Founder Office + Executive | 1,400 min | 1,630 min | +16.4% | $350.94 -> $274.20 |

| Level | Room to4 purchase before -> after | Room to5 | Staff to4 | Staff to5 |
| --- | ---: | ---: | ---: | ---: |
| 3 | 414 -> 414 | 635 -> 635 | 807 -> 873 | 905 -> 944 |
| 4 | 738 -> 810 | 1,372 -> 1,813 | 1,770 -> 2,249 | 2,083 -> 2,574 |
| 5 | 331 -> 331 | 685 -> 933 | 1,046 -> 1,374 | 1,299 -> 1,529 |

Times are facility minutes after the paired control opening. Full tier2/3/4/5
purchase records, quotes, cash and training completion times are in
`shopping-probes.json`. All six buying runs have zero walkouts, zero staff lost,
and positive minimum cash. Level3's $85.15 stress minimum is narrow; the two-hour
reserve is a measurement policy, not an automatic player-spending rule. Delaying
optional top-tier purchases retains more cash. No recurring charge was raised.

### Fixed-duration Level3/4/5 economies

Each matched control runs52 actual hours. Level3 uses the existing peri-op
flow fixture with real OR/endoscopy staff, restores normal expense postings
and scored demand, and adds normal waiting/check-in/pharmacy facilities.
Level4 uses the existing public economy clinic plus a normal Training Room;
Level5 uses the existing prestige economy opening. Normal extra rooms/hires
are constructed through commands. Synthetic opening funds/initial rosters are
explicit fixtures, not owner saves or a claim about every new campaign.

| Level | Net/hour before -> after | Completed before -> after | Walkouts | Minimum cash before -> after | Closing cash before -> after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 3 | $480.19 -> $480.19 | 50 -> 50 | 0 / 0 | $92,215.67 -> $92,215.67 | $118,044.64 -> $118,044.64 |
| 4 | $122.42 -> $122.42 | 50 -> 50 | 0 / 0 | $16,686.50 -> $15,726.50 | $23,361.00 -> $22,401.00 |
| 5 | $111.32 -> $111.32 | 48 -> 48 | 0 / 0 | $6,960.03 -> $4,720.03 | $13,163.62 -> $10,923.62 |

Running margins and completions agree exactly because salaries, upkeep and
benefits are unchanged; the opening/closing balances reflect higher capital.
All runs retain their workforce and stay solvent. A representative specialty setup (Pediatric Waiting + Exam, Wound Clinic
plus two APP hires) totals $3,400 -> $3,910 (+$510), before unchanged
circulation costs. That is about8.14 hours of this Level3 control's positive
net income versus7.08 hours before. All required Level3 setup remains unchanged,
and high-tier upgrades/training are optional progression spending.

#### Cash curves

The receipts contain600-minute cash/XP/completion samples for all fixed and
buying controls and for the official journey, plus minimum cash observed on
every M9 command. Selected matched samples follow.

| Operating minute | Level3 before -> after | Level4 before -> after | Level5 before -> after |
| --- | ---: | ---: | ---: |
| 600 | $95,857.92 -> $95,857.92 | $17,647.00 -> $16,687.00 | $7,944.88 -> $5,704.88 |
| 1,200 | $104,577.92 -> $104,577.92 | $19,395.00 -> $18,435.00 | $9,153.19 -> $6,913.19 |
| 1,800 | $111,138.92 -> $111,138.92 | $20,622.00 -> $19,662.00 | $10,693.53 -> $8,453.53 |
| 2,400 | $115,962.44 -> $115,962.44 | $21,734.00 -> $20,774.00 | $11,851.73 -> $9,611.73 |
| 3,000 | $117,508.44 -> $117,508.44 | $23,187.00 -> $22,227.00 | $13,005.01 -> $10,765.01 |

## Official Level5 CHECK and binding gate

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Commands reconciled | 28,601 | 28,601 | 0 |
| Closing cash cents | 6,227,467 | 6,003,467 | -224,000 |
| Completed encounters | 445 | 445 | 0 |
| Walkouts | 0 | 0 | 0 |
| First finish tick | 19,935 | 19,935 | 0 |
| Final driver tick | 26,649 | 26,649 | 0 |
| Minimum observed cash cents | 1,698,500 | 1,474,500 | -224,000 |

Both original and instrumented repeat CHECKs agree on commands, cash,
completions, walkouts, first/best/latest scores and checkpoint tick/XP/phases.
Scores remain62.441674349990286 /66.6965763107746 /45.38120376175499.
All eight printed checkpoint ticks agree (3969,3969,16878,17015,19934,19935,
23591,23592). The first actual inspection unlock remains16877.
The cash delta is exactly $960 extra for the initial Level4 setup plus $1,280
extra for the late cluster ($1,160 prestige builds +$120 Executive hire).
Gross income, stock and operating expenses are unchanged. M9 buys no tier4/5
upgrade or training; those prices affect the buying probes instead.

Exactly five Level5 bound production inputs change in this lane:

1. `packages/balance-config/src/prototype-balance.ts`
2. `packages/balance-config/src/room-upgrades.ts`
3. `packages/balance-config/src/employee-training.ts`
4. `packages/balance-config/src/level-five-rooms.ts`
5. `packages/balance-config/src/level-five-executive.ts`

No canonical evidence/results/checkpoint/launch file is rewritten. No rebind,
release worktree write, Git, agent, install, network or deployment occurred.
The manager owns release integration and rebind. Private receipts and scoped
hunks are under `.local-dev/late-game-balance-20261111/`.

## Tests, exact validation and handoff

New tests:

- `packages/balance-config/src/late-game-balance.test.ts` (3): independent old
  price fixture, full new curves, unchanged early construction/low tiers,
  benefits, wages, upkeep, reward/settlement and progression definitions.
- `packages/game-domain/tests/late-game-costs.test.ts` (5): exact quote/charge,
  one-cent-short rejection and retry idempotency; new tier5 tuition; owned5
  reload; legacy paid5 completion without top-up; legacy pre-start refund at
  its original payment rather than the new quote.
- `apps/player/src/session/employeeTrainingViewModels.test.ts` (1 added):
  future $420 price versus an already-paid $300 queued request in the UI.

`tests/fixtures/late-game-costs-before-20261111.json` is a public synthetic
pre-pass cost/benefit snapshot, not a campaign, personal data or rebound Level5
artifact. Existing exact price expectations were updated in balance training,
room upgrade, APP, diagnostic-reading, prestige-room/Executive/gift tests; two
Executive/room domain expectations; and Level4 room/training player labels.
All prior capability, geometry, effect, payment and frozen-term assertions stay.
The first full domain run exposed one old Executive arithmetic price assertion;
it was corrected to the four explicit new payments and the full suite repeated.
No guards, test timeouts, assertions or tests were removed or weakened.

PowerShell, `npm.cmd`, `CI=1`; Vitest `--pool=threads --maxWorkers=2`:

| Command/run | Exact final output | Duration / exit |
| --- | --- | --- |
| Full balance-config | 26 files passed;168 tests passed | 2.92s /0 |
| Full game-domain closing | 2 files failed,213 passed (215);27 failed,5285 passed,1 skipped (5313) | 550.99s /1 |
| Closing cost/Executive/room domain focus | 3 files passed;50 tests passed | 22.30s /0 |
| Earlier training-persistence/support focus | 3 files passed;85 tests passed | 8.08s /0 |
| Focused player (training, L4 rooms, L5 rooms, Executive) | 1 file failed,3 passed (4);1 failed,48 passed (49) | 15.04s /1 |
| Root `npm.cmd run typecheck` | All seven workspace scripts passed | exit0 |
| Before/candidate official CHECKs and independent repeats | Assertions and lifetime cash reconciliation pass; zero canonical writes | exit0 |
| Early-level/schema before/after proof | All15 loaded and120-minute state hash pairs equal | exit0 |

Workspace commands are `npm.cmd test --workspace @gamify-surgery/balance-config`
and `... --workspace @gamify-surgery/game-domain`, with the Vitest flags above.
The focused player command uses `--workspace @gamify-surgery/player` and
`src/session/{employeeTrainingViewModels.test.ts,levelFourRoomsViewModels.test.ts,
levelFiveRoomsViewModels.test.tsx,levelFiveExecutiveViewModels.test.tsx}` as
individual arguments. Player uses the existing Windows enumeration preload
`.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`, without
changing gameplay or assertions. Source, commands, raw logs, JSON reports,
price matrices and before/after curves are in the private receipt folder.

Remaining failures are the established baselines:

- Domain26: one Level5 input-binding guard and25 historical loaded/120-minute
  hashes in `level-five-integration.test.ts`. New prices change the five bound
  inputs above; evidence/rebind is deliberately left to the manager.
- Domain1: `approved-clinical-admission.test.ts` still expects587 registered
  concepts versus the already-accepted610. No clinical catalog or its guard
  was edited by this lane.
- Player1 in the focused set: `levelFiveRoomsViewModels.test.tsx:57` has the
  existing description regex that does not include the accepted staff-gym
  break-policy copy. Prices do not change that copy; the guard is preserved.

The plan is [late-game-balance ExecPlan](../execplans/late-game-balance-20261111.md).
Port the five balance source hunks, exact changed price expectations, new tests
and synthetic price fixture using `owned.diff` / `owned-files.json`. Preserve
all unrelated lanes. No player implementation or domain runtime port is needed.

Open decision: a cost-only change cannot produce the requested10-20% longer
finish in this funded fixed-purchase driver. It does extend max-tier buying,
and preserves positive measured operating margins. The review question about
an additional late-goal change remains separate; no such change is made here.
The narrow Level3 buying reserve and single paired seed per independent control
limit any guarantee about arbitrary player spending. These measurements show
no newly introduced cash shortfall, walkout, staff loss or required-care lock.
The manager should review the prices/timing limit, choose any separate pacing
milestone, and re-run/rebind in GS-release after porting. Work remains local;
no backup/release is implied by these validations.

### Exact existing test files updated

- Balance: `src/app-role.test.ts`, `src/diagnostic-timing.test.ts`,
  `src/employee-training.test.ts`, `src/level-five-executive.test.ts`,
  `src/level-five-gift-retail.test.ts`, `src/level-five-rooms.test.ts`,
  `src/level-four-rooms.test.ts`, `src/room-upgrades.test.ts` under
  `packages/balance-config/`.
- Domain: `packages/game-domain/tests/level-five-executive.test.ts` and
  `packages/game-domain/tests/level-five-rooms.test.ts`.
- Player: `apps/player/src/session/employeeTrainingViewModels.test.ts` and
  `apps/player/src/session/levelFourRoomsViewModels.test.ts`.

Together with the five production price files, three new test/data files and
three documents, this is23 owned paths. `owned-files.json` pins each code/test/
fixture's before and after hash; `owned.diff` contains only owned changes.
All23 wider protected Level5/launch JSON artifacts still match the prior lane's
retained intake, in addition to the five top-level artifacts captured for this
turn. No evidence write or rebind occurred.

## Accepted pacing follow-up (2026-11-11)

The manager accepted the cost pass above unchanged, then explicitly approved
later progression goals roughly10-15% higher. This supersedes the cost-only
open decision above. The implementation below changes future XP requirements;
it does not increase prices again or change level-up rewards, question rewards,
clinical relationships, wages, upkeep, care durations or arrival cadences.
All numbers are editorial simulation weights.

### Exact requirements and save behavior

| Current level / next milestone | Accepted-cost CHECK XP goal | New XP goal | Change |
| --- | ---: | ---: | ---: |
| Levels0/1/2 | 10 /150 /300 | 10 /150 /300 | unchanged |
| Level3 ->4 | 500 | 550 | +10.00% |
| Level4 ->5 | 750 | 850 | +13.33% |
| Level5 -> inspections / first finish | 2000 | 2300 | +15.00% |

Satisfaction remains above90%, Level5 workforce morale remains at least85;
all room/staff/witness conditions and the3000-minute inspection stay unchanged.
The room, hiring, training, benefit and settlement catalogs compare exactly
with the accepted-cost catalog. There is no additional purchase requirement.

Individual XP goals were previously recomputed from live XP, with no saved
completion bit. To avoid taking an already-earned goal away, Level3+ saves
acquire an optional `lateProgression` record (`late-progression.v1`). Missing
records preserve only a current-level historical goal already met (500/750/2000);
below that old boundary they start the new policy without credit. Advancing
retains the earned old goal's level, so that credit cannot satisfy the next
level's new requirement. A fresh Level2 ->3 advance starts without credit.
The reducer stamps pre-command XP before work, including fast-forward, so
crossing an old threshold after the update cannot accidentally earn old credit.
Identical operation retries retain their original state/reference.

The ordinary save reader normalizes the optional record. Current cloud snapshots
preserve source bytes on load; selectors and the first changed reducer command
handle missing legacy metadata without requiring a snapshot rewrite. The cloud
ownership map has one necessary new operational-field entry. Snapshot round trips
and evidence-journal deltas preserve the record. Schema9 and all existing
unlocks/reports/finish records remain valid; the strict inspection validator
intentionally retains its historical2000-XP minimum. Earned unlocks do not
relock after live conditions decline. Fresh earned goals keep their new target.
There is no new cash grant, answer replay, FSRS replay, reward or history rewrite.
New Levels0-2 states omit the optional field entirely.

### Matched before/after measurements

Primary comparison uses the accepted-cost CHECK clinical inputs:1151 cases,
1462 nodes,610 registered learning cards; release JSON SHA-256
`b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`.
The active question lane changed the live manifest during validation. The after
run therefore uses a read-only private source overlay of the same captured
clinical inputs, without modifying any live clinical file. Final own runtime
hashes exactly match the captured CHECK source. Context-only threshold trials
preceded production edits; the smaller550/850/2300 trial was selected and the
final production CHECK reproduces its numbers. A575/860/2300 trial took much
longer because satisfaction recovered later; no larger variant was installed.

Ticks below are game minutes. Level3 is the existing peri-op/OR public-fixture
control (real pharmacy/waiting/reception additions,80% scored-answer policy).
Level4/5 are the unchanged M9 funded Level4-opening journey and driver.

| Goal / interval | Before minutes (hours) | After minutes (hours) | Extra minutes | Change |
| --- | ---: | ---: | ---: | ---: |
| Level3 start -> eligible for4 | 3004 (50.07) | 3273 (54.55) | 269 | +8.95% |
| Level4 opening -> advance to5 | 3969 (66.15) | 4437 (73.95) | 468 | +11.79% |
| Level5 entry -> inspection unlock | 12908 (215.13) | 14492 (241.53) | 1584 | +12.27% |
| Level5 entry -> first finish | 15966 (266.10) | 17549 (292.48) | 1583 | +9.91% |
| M9 start -> first campaign finish | 19935 (332.25) | 21986 (366.43) | 2051 | **+10.29%** |
| Entire evidence script, including two retries | 26649 (444.15) | 28700 (478.33) | 2051 | +7.70% |

The10-20% target is met for first campaign finish. The unchanged6714-minute
post-finish retry/audit tail dilutes the percentage of the whole evidence script;
that tail is not additional required campaign progression. M9 does not simulate
a fresh Level0-through5 campaign. Its Level3 control is separate; early-level
play time is not estimated from those independent fixtures. All15 Level0-2 /
schema5-9 load-plus120-minute pairs are byte-identical with matched content.

| Scored first answers through each interval | Before | After | Extra |
| --- | ---: | ---: | ---: |
| Level3 eligibility control | 59 | 66 | 7 |
| Level4 advance in M9 | 89 | 101 | 12 |
| Level5 entry -> first finish in M9 | 340 | 375 | 35 |
| M9 total through first finish | 429 | 476 | 47 |

The separate Level3 control adds seven more answers. The nominal450 extra XP
across Levels3-5 is about54 answers at an80% 10/2-XP policy; the measured
controls add54, with discrete overshoots and the satisfaction gate. These are
real scored decision-node first answers, not patient counts or new questions.

XP alone was not the final gate even before this pass. Baseline Level5 reached
2004 XP at tick14959 with satisfaction90 (unmet), then unlocked at16877 with
2340 XP /91 satisfaction /100 morale. With the new goals,2308 XP at17073
still had89 satisfaction; unlock occurs at18929 with2624 XP /91 /100.
Extra Level4 operating time changes Level5 entry time and real patient/FSRS
flow. That changes the time at which the existing satisfaction requirement is
met. The tuning does not raise satisfaction, slow staff, reduce fees or insert
an artificial delay. Inspection-to-finish remains3058 ->3057 minutes.

### Level5 CHECK and economy

| Entire official CHECK | Accepted-cost baseline | Pacing, same clinical inputs |
| --- | ---: | ---: |
| Commands | 28601 | **30790** |
| Closing cash cents | 6003467 | **6460039** |
| Completed patients | 445 | **477** |
| Walkouts | 0 | **0** |
| Minimum cash cents | 1474500 | 1610350 |
| Cash at first finish, cents | 4858782 | 5381789 |
| First / best / latest report | 62.44167435 /66.69657631 /45.38120376 | 62.49599594 /66.66928539 /45.30478710 |

More cash/completions come from2051 extra operating minutes, with unchanged
per-hour economics. No finish reward was added. Every minute reconciles money;
first-low/better-retry/lower-retry best/latest/first-report assertions pass.
The final CHECK suppresses34 private progress writes in memory and rejects
canonical writes. No evidence/results/checkpoint/launch artifact is rewritten.

| Checkpoint | Before tick | After tick | Delta |
| --- | ---: | ---: | ---: |
| integration-l4 | 3969 | 4437 | 468 |
| integration-build | 3969 | 4437 | 468 |
| integration-preparing | 16878 | 18929 | 2051 |
| integration-running | 17015 | 19066 | 2051 |
| integration-final | 19934 | 21985 | 2051 |
| integration-finish | 19935 | 21986 | 2051 |
| integration-repeat-final | 23591 | 25642 | 2051 |
| integration-repeat | 23592 | 25643 | 2051 |

Matched52-hour Level3/4/5 economy probes retain exactly the accepted-cost
financial/throughput measurements: net$480.19 /$122.42 /$111.32 per hour;
50 /50 /48 completions; zero walkouts or staff losses. Minimum cash is
9221567 /1572650 /472003 cents. Prices/time-to-afford from the accepted cost
section do not change. At the new Level5 entry the M9 clinic still has1624250
cents after buying its entire cluster; it remains profitable while earning XP.
These are deterministic funded/low-reserve controls, not a guarantee against
arbitrary overspending. No new spending gate or required-room lock was added.

### Concurrent clinical change (separate attribution)

During validation the live release changed to1167 cases /1482 nodes /631
registered learning cards, SHA-256
`05d5c2c3701a11b251f9bc4530921e23ee73ba75febcb99840cb0cf7511ca0c1`.
The current-content pair is recorded separately below; it must not be attributed
entirely to this pacing lane or mixed with the accepted-cost baseline above.
| Same new clinical bundle | Old XP goals | New XP goals |
| --- | ---: | ---: |
| Level4 advance tick | 4038 | 4684 |
| Level5 unlock tick | 17473 | 23784 |
| First finish tick | 20530 | 26842 |
| Full audit final tick | 27244 | 33556 |
| Commands | 29242 | 36008 |
| Closing cash cents | 6222057 | 7351378 |
| Completions /walkouts | 455 /0 | 557 /0 |
| Minimum cash cents | 1459050 | 1582580 |
| Scored answers through first finish (L4 /L5) | 89 /352 | 101 /477 |

**This pair is +30.75% to first finish, outside the10-20% target.** XP is
already met substantially before the new satisfaction unlock (3464 XP /91
satisfaction). This is a measured release risk, not an additional intended
slowdown. The selected goals meet the manager's referenced610-card CHECK;
they must not be represented as a10-20% result for the newly changed631-card
bundle. The manager was asked which bundle defines the pacing acceptance
baseline. Pending steering, the implementation retains the original captured
CHECK target and reports this overshoot for review. No new clinical content,
route binding or satisfaction rule was changed to force a timing result.

### Files, tests and release gate

Pacing changes36 code/test/fixture paths, plus this report, the ExecPlan and
current-thread handoff. A scoped hunk patch and before/after hashes are in
`.local-dev/late-game-balance-20261111/pacing/{owned.diff,owned-files.json}`.
Apply these after the accepted-cost patch; do not copy shared files wholesale.

- Runtime: the two XP data files `prototype-balance.ts` and
  `level-five-progression.ts`; new domain `late-progression.ts`; domain
  `types.ts`, `reducer.ts`, `selectors.ts`, `persistence.ts`; a historical-floor
  comment in `level-five-state.ts`; and the single cloud ownership entry in
  `apps/player/src/session/cloud/codecOwnership.ts`. There are no renderer,
  cloud-sync, arrival, staffing, movement, procedure or clinical-content edits.
- QA: current-boundary metadata in the Level4/5 progression, state, inspection,
  inspector and launch TS fixtures; explicit historical500/750 cap4 context;
  historical ready-for5 fixture retains750; launch-unmet uses849 and no earned
  credit. The launch console describes current-goal-minus-one metadata.
- Tests:23 new domain regressions and two snapshot/player cases. Exact
  progression definitions and boundary/no-extra-XP expectations are updated in
  existing balance/domain/player tests. The public JSON checkpoints remain
  unchanged. No assertion, guard, test or timeout was removed/weakened.

Exactly seven existing Level5-bound input files change in this follow-up:
`packages/balance-config/src/{prototype-balance.ts,level-five-progression.ts}`;
`packages/game-domain/src/{reducer.ts,selectors.ts,persistence.ts,types.ts,level-five-state.ts}`.
The last is comment-only and deliberately keeps the old unlock validator.
`packages/game-domain/src/late-progression.ts` is one newly added bound input
(the generator collects every domain source). The cloud map, tests, QA-boundary
fixtures and bootstrap message are outside the retained M9 input list.
Accepted price inputs remain changed as documented above; no new price change
is introduced here. Concurrent clinical input changes belong to the question
lane. All23 protected Level5/launch JSON inputs/artifacts remain unchanged.

PowerShell /`npm.cmd`, `CI=1`, threaded Vitest with `--maxWorkers=2`:

| Final check | Exact output | Duration /exit |
| --- | --- | --- |
| Balance-config full | 26 files passed;168 tests passed | 3.09s /0 |
| Game-domain full closing | 3 failed,213 passed files (216);28 failed,5329 passed,1 skipped (5358) | 591.17s /1 |
| Pacing/progression/L4 integration/cost focus | 5 files passed;66 tests passed | 40.05s /0 |
| Closing compatibility/inspection/progression focus | 4 files passed;167 tests passed | 30.18s /0 |
| Closing updated fixture/no-extra-XP focus | 4 files passed;126 tests passed | 57.26s /0 |
| Player affected +snapshot focus | 1 failed,9 passed files (10);1 failed,105 passed (106) | 42.92s /1 |
| Root typecheck | All seven workspace scripts pass | exit0 |
| Final matched official CHECK | Reconciliation/first/best/latest/lower-retry assertions pass; canonical writes0 | exit0 |
| Matched early-save proof | All15 load and120-minute hash pairs identical | exit0 |

Commands: `npm.cmd test --workspace @gamify-surgery/balance-config --
--pool=threads --maxWorkers=2`; same for game-domain. Focused domain files:
`late-progression`, `level-four-progression`, `level-four-integration`,
`level-five-progression`, `late-game-costs`, `level-five-state-persistence`,
`facility-inspection-integration`, `level-five-executive`, `level-five-gift-retail`,
`level-five-support`, `level-five-gift-demand-integration` (`tests/*.test.ts`).
Player focus is `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads
--maxWorkers=2`, with `src/session/lateProgressionViews.test.ts`,
`levelFourProgressionViews.test.tsx`, `levelFiveProgressionViews.test.tsx`,
`levelFiveLaunch.test.tsx`, `employeeTrainingViewModels.test.ts`,
`levelFourRoomsViewModels.test.ts`, `levelFiveRoomsViewModels.test.tsx`,
`levelFiveExecutiveViewModels.test.tsx`, `levelFiveGiftRetailViewModels.test.tsx`,
and `cloud/snapshotCodec.test.ts` under that directory. It uses the same
Windows validation preload documented above. Typecheck is root
`npm.cmd run typecheck`. All raw output is retained in the private `pacing/`
folder; no default-pool browser/OS-enumeration workaround changes assertions.

The final typecheck runs all seven workspace scripts. Earlier concurrent
question-data type errors were left untouched and cleared before the closing
run. The known player failure is the unchanged gym/break-description regex at
`levelFiveRoomsViewModels.test.tsx:57`. The existing domain binding/hash failures
remain for the manager's rebind. The static admission-count guard still expects
587; the live catalog now contains631. A new concurrent diagnostic inventory
failure names the missing exact TEE tuple for
`case.critical-shock-resuscitation.reassess-shock-mechanism.v2` /
`question.critical-shock-resuscitation.echo-for-persistent-shock.v2` /
`choice.critical-shock-resuscitation.echo-for-persistent-shock.tee.v2`.
No clinical/question binding was edited by this lane.

Closing domain output returns to the established27 failures plus the one
concurrent TEE binding failure; no owned assertion remains failing. Early
in-progress runs exposed stale old-goal expectations and a fresh-goal display
edge case; these were corrected, focused tests repeated, then the entire domain
suite repeated to the closing output above. Final full player is not claimed;
the requested affected/snapshot focus retains exactly its one known failure.

The10.29% result is a matched single-seed control, not a universal multiplier;
case mix/FSRS and satisfaction can move individual campaign timing nonlinearly.
The rejected860-XP Level4 trial illustrates that sensitivity. Recheck with the
final accepted clinical bundle in the release tree before rebinding. Port the
cloud ownership entry together with the domain field; older clients that lack
that entry reject new snapshots as unmapped fields. Existing campaigns load
with this implementation, including source-preserving cloud snapshots.
No Git, commit, push, install, network, agents, deploy, release-tree write or
rebind occurred. This is a local handoff for manager review/release integration.

## Port32 interaction correction (2026-11-11)

The current combined654-meaning run now first finishes at **22690**, versus
rebind31's19935: **+13.82%**. Its full CHECK is **31570commands /6677125cents /
491completions /0walkouts**, final tick29404, minimum cash1452073cents.
The sole production change is Level4 XP **850 ->790**. Level3/5 stay550/2300;
accepted costs, rewards, satisfaction rules and care/selection code stay exact.
This replaces the earlier610-only calibration as the current release result.

**Counterfactual limitation:** the retuned790 goal with the obsolete610 pool
exceeds the unchanged driver's36000-minute Level5 goal bound, stopping at
40187 without an unlock. This is reported explicitly, not as a successful
historical-content control. The latest sampled state at39600 has6162XP,
100morale,96historical satisfaction and90displayed satisfaction: facility
pressure, rather than unavailable questions, is still the blocker. The fixed
80%-answer/no-new-facility-purchase driver does not remedy it. This is not proof
of an unachievable game state: restoring one displayed satisfaction point would
meet all goals there. Current saved campaigns use654 for new arrivals, retaining
old frozen encounters, rather than running indefinitely on the610 context.
The combined shipping-content control completes without a blocker or walkout.
Timing remains content-dependent; do not claim a universal10-20% multiplier.

### Reproduction and controls

Read-only manager evidence: GS-release's
`docs/execplans/gs028-stats-ethics-overhaul-20261007.md:12856`, port32/rebind32.
No release-tree file was written. Frozen public inputs/diagnostics are under
`.local-dev/late-game-pacing-interaction-20261111/`. The original seed, M9
constructor, ordinary funding/build/arrival/answer/FSRS rules, one action per
minute, and all official CHECK assertions are retained. Observers count state;
they do not change a clinical choice, care clock, room, staff member or command.

Current live and release654 are identical at runtime:
1174cases /1491nodes /654learning cards, clinical JSON SHA256
`751b750e5cd139229a933570244fc5c613f4d60f7fa626bf5e7eb4fc5fa4feab`.
The old610 control is the previous frozen1151/1462 release,
SHA256`b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`.
The current live semantic hash was checked again after final validation; it did
not change during this milestone. Raw topic-author work remains untouched.

Published original-price reference rows below are the manager's release arms;
our additional observational old-goal controls hold accepted higher prices
constant. That lowers prior610 and content-only closing cash by224000cents
(to6003467 and7508431 respectively), with exactly the same commands, patients,
unlock/finish/final ticks. This separates prices from the timing mechanism.

| Arm | XP3/4/5 | Commands | Closing cents | Completed | Walkouts | Unlock | First finish | Final |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Published rebind31,610 | 500/750/2000 | 28601 | 6227467 | 445 | 0 | 16877 | 19935 | 26649 |
| Balance-only before,610 | 550/850/2300 | 30790 | 6460039 | 477 | 0 | 18929 | 21986 | 28700 |
| Published content-only,654 (unchanged) | 500/750/2000 | 35201 | 7732431 | 546 | 0 | 23026 | 26083 | 32797 |
| Combined before,654 | 550/850/2300 | 45792 | 9514568 | 709 | 0 | 32877 | 35935 | 42649 |
| Retuned balance-only,610 | 550/790/2300 | bound exceeded | not recorded | not recorded | not recorded | not within bound | not within bound | stopped40187 |
| **Combined after,654** | **550/790/2300** | **31570** | **6677125** | **491** | **0** | **19632** | **22690** | **29404** |

Original combined first-finish delay16000minutes was much larger than the sum
of separate2051balance +6148content delays. The corrected combined delay is
2755minutes. Full audit time is now+10.34% over26649; its6714-minute
post-finish retry/audit tail is unchanged. The current combined first finish is
13245minutes earlier than port32, without changing fees or increasing throughput
artificially. Lower closing income than port32 reflects less operating time and
a different legitimate case mix, rather than a fee/productivity reduction.

### What actually slows the unlock

The premise of slower XP accrual is not supported by these runs. New content
increases scored answers and XP/hour. Fixed first180Level5 hours, using actual
first answer-ready offers and unique scored decision-node answers:

| Arm | Scored chart arrivals | Question offers /answers | Answers/hour | XP/hour | Mean completed chart minutes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Prior610 /old goals | 183 | 234 /234 | 1.3000 | 10.9556 | 64.64 |
| Balance-only before | 182 | 235 /235 | 1.3056 | 10.9667 | 73.73 |
| Content-only654 /old goals | 182 | 238 /238 | 1.3222 | 11.1333 | 74.87 |
| Combined before654 | 183 | 249 /249 | 1.3833 | 11.6556 | 89.16 |
| Combined after654 | 182 | 232 /232 | 1.2889 | 10.8444 | 74.98 |

Through the actual unlock, prior610 earns10.8770XP/hour; content-only654
11.1791; combined-before11.1361; combined-after10.9811. Thus the corrected
run finishes sooner despite slightly lower measured XP throughput than the
bad combined run. It changes which simultaneous-goal window is reached.
Offers here mean first physically answer-ready `getCurrentQuestion` events;
chart arrivals are counted separately. Per-case means use charts admitted and
completed within the interval; pending cases are censored. Duplicate offers and
answer retries are not additional questions.

Longer per-patient episodes do exist, but overlap other visits. Mean patient
state minutes over the same completed180-hour cohorts (categories overlap):

| Arm | Patient movement | Pending-result lifecycle | Unopened | Action-required | APP/specialty consult hold |
| --- | ---: | ---: | ---: | ---: | ---: |
| Prior610 | 23.40 | 49.74 | 9.20 | 6.71 | 1.93 |
| Balance-only before | 28.99 | 52.75 | 11.79 | 10.20 | 2.14 |
| Content-only654 | 29.56 | 53.80 | 11.67 | 10.39 | 2.27 |
| Combined before654 | 34.61 | 65.86 | 12.19 | 12.11 | 2.14 |
| Combined after654 | 30.52 | 52.51 | 13.03 | 10.43 | 1.75 |

These are patient/state observations, not exclusive room/staff utilization sums.
`assignedRoomInstanceId` is a last-room pointer (types.ts:1182), including waiting
rooms; the raw trace's provisional room-pointer counter is not evidence of an
exclusive exam-room block and is not used as such here.

The binding mechanism is the existing simultaneous satisfaction gate:

| Arm | First2000XP | First2300XP | Actual unlock XP /tick |
| --- | ---: | ---: | --- |
| Prior610 | 14959 | 16689 | 2340 /16877 |
| Balance-only before | 15386 | 17073 | 2624 /18929 |
| Content-only654 | 14600 | 16076 | 3568 /23026 |
| Combined before654 | 14754 | 16154 | **5290 /32877** |

In the bad combined run, XP is met at16154. The exact additional
wait is **16723minutes** to32877. Morale is100. Post-tick good-satisfaction
samples last show1888XP at14168-14176, below either2000 or2300. The later
unlock witness is authoritative even when a favorable state lasts only a
command between minute samples. Historical ended-patient satisfaction across
the whole pre-unlock cohort falls97.07 ->95.43; the live last-ten-patient mean
plus reversible facility pressure fluctuates across the strict91displayed goal.
For example, the manager's28200 sample is4482XP /100morale /87satisfaction.

Source evidence:

- `packages/game-domain/src/selectors.ts:1391` sorts completed/walked-out
  histories and uses the configured last10patients; `:1432` subtracts current
  facility-condition pressure. Config is `prototype-balance.ts:1084` and the
  following penalty table. The whole-cohort mean above is not that live window.
- `packages/game-domain/src/reducer.ts:10242` earns the Level5 unlock only when
  **every** live requirement is met together. The established regression in
  `tests/level-five-progression.test.ts` explicitly requires simultaneous goals;
  this milestone does not reverse that approved rule.
- `packages/game-domain/src/clinical-selection.ts:53` selects by eligible concept
  identities and due/unseen FSRS, then case variant. Adding meanings changes
  the pool and deterministic choices, rather than consuming a different shared
  RNG stream. The first differing selected patient is already
  `encounter.auto.4.0`, tick60: old
  `case.inflammatory-breast-cancer.persistent-erythema` versus new
  `case.recovered-diverticulitis.ct-resolved`.
- `tests/fixtures/level-five-integration.ts:101` applies the unchanged every-fifth
  wrong first-answer policy separately per facility level. Moving Level4
  advancement changes Level5's reset point, patients, waits, due concepts and
  which decisions are wrong. That changes the rolling satisfaction window and
  its overlap with XP. All reported arms keep this driver exactly unchanged.

### Audit of proposed throughput causes

No new chart-review wait/room defect was demonstrated. Comparing runtime node
identity/concept/gate/capability/order metadata finds48new/changed decision nodes
in38cases: **zero result gates**, zero correct executable-order bindings in
main;37nodes declare no capability and11require only examination. The accepted
nonexecuting timing dispositions are respected by
`diagnostic-order-requests.ts:63`. The observed topic-chart cohort has no pending
order and mean duration24.5minutes (two completed charts, four answers), not a
long invented investigation. Its small sample is not a frequency guarantee.

The largest actual waits are existing structured diagnostic stories: GIST
retained outside work (480game-minute phase, roughly530 including travel),
and celiac laboratory/endoscopy/biopsy sequences. They occur in the old610
control too. New selection/FSRS mix changes their frequency; deleting their
waits would change existing care semantics without evidence of an error.
Offers remain approximately one scored chart/hour and answers/hour rise;
no throughput/eligibility starvation explains the16723-minute post-XP delay.

Consult release also follows the existing intended lifecycle:
`clinic-consults.ts:121` releases an answered APP/specialty consult when its
chart implicitly closes for diagnostics;
`reducer.ts:3720` releases pending-testing care reservations. The observed
consult holds are around two patient-minutes/chart and do not persist across
whole outside-result intervals. Owner-required chart-open examination routing,
patient/founder seats and procedure completion holds are preserved. There is
no runtime/selector/clinical edit to bypass a room, staff member or result.

### Calibration, save compatibility and exact scope

Selected **550/790/2300**. Level4 is790 versus the pre-pass750 (+5.33%),
with Level3 +10% and Level5 +15% as previously approved. The latest manager
brief prioritizes combined first-finish timing over an independent nominal
10-15% increase to every goal. The production patch is one integer in
`packages/balance-config/src/prototype-balance.ts`; every other byte of that
production file matches intake. All other domain/balance runtime files match.
There is no clinical, question-binding, cloud, renderer, arrival, fee, care,
walkout, morale, satisfaction, reward, upgrade-price or save-format change.

Context-only trials were retained, not silently installed: Level4=775 finishes
26567;800=19109;810=19431;825=20343;835=20485;840=21063;850=35935,
all with Level5=2300. With840/2700, first finish22386 also fits, but increases
nominal Level5 XP35% over2000. The selected790/2300 keeps its15% end goal and
changes one production value. Raising825's end goal to2800 finishes41054;
835/2600 finishes26823. These outcomes document the sensitivity rather than
claiming that raising a nominal XP goal produces a smooth time multiplier.

The existing late-progression.v1 policy, legacy750XP credit, earned levels,
inspection unlocks/reports and old ownership/payment records remain unchanged.
Easing850 to790 cannot remove a satisfied Level4 requirement. Old campaigns
retain frozen cases and take new arrivals from the current654 pool. Existing
save/journal/snapshot and legacy-cap progression regressions pass. There is no
new persisted field or cloud ownership change in this correction.

Six code/test paths changed: production `prototype-balance.ts`; balance
`late-game-balance.test.ts`; domain `game-domain.test.ts`,
`late-progression.test.ts`, `level-five-launch.test.ts`; player
`levelFourProgressionViews.test.tsx`. The five test updates retain exact intent,
changing only current-goal expectations850/849 to790/789. No test, assertion,
guard or timeout is removed/weakened. The only additional Level5-bound input
is the already-bound `packages/balance-config/src/prototype-balance.ts`;
no new bound file is added. Scoped patch/hashes: private `owned.diff` and
`owned-files.json`; all23 protected Level5/launch JSONs remain unchanged.

### Final production CHECK and validation

The actual unmodified `tools/qa/level-five-integration-run.mjs` runs in CHECK
mode. A read-only observer captures metrics; its35private progress writes are
suppressed in memory and canonical writes are rejected. No context goal override
is used for the production CHECK. All income reconciliation, low first finish,
better retry, lower retry, immutable first report and best/latest assertions
pass. Reports are62.4750682937747 /66.9067363288048 /45.33668223820304,
with49 /50 /51 qualifying patients. No evidence/results file is rebound.

| Final validation | Exact output | Duration /exit |
| --- | --- | --- |
| Full balance-config, threads | 26 files /168 tests passed | 3.65s /0 |
| Full game-domain, threads | 3 failed /213 passed files (216);28 failed /5355 passed /1 skipped (5384) | 547.12s /1 |
| Focused progression/save/launch domain | 4 files /66 tests passed | 11.67s /0 |
| Affected player +snapshot focus, threads | 1 failed /9 passed files (10);1 failed /105 passed (106) | 27.28s /1 |
| Root seven workspace typechecks | 6 pass;clinical-content fails one pre-existing draft TS2322 | exit1 |
| Official production CHECK | All assertions pass;31570 /6677125 /491 /0 | exit0 |

Commands: root `npm.cmd test --workspace @gamify-surgery/balance-config --
--pool=threads --maxWorkers=2`, same for game-domain; focused domain files
`tests/{late-progression,level-four-progression,level-five-progression,level-five-launch}.test.ts`.
Player uses the same ten affected/snapshot test arguments and existing Windows
preload as the preceding pacing section, with identical threading flags.
Typecheck is root `npm.cmd run typecheck`. Raw commands/output and hashes are
in the private interaction receipts; the active plan is
`docs/execplans/late-game-balance-interaction-20261111.md`.

Failure classification: domain26are retained Level5 source/load/continuation
pins awaiting manager rebind; one static admission guard expects587 versus654;
one existing main-tree TEE v2 order-inventory binding is still missing (the
accepted release has its binding integration; main's test-choice-orders.ts
remains different and is not modified here). Player's only failure is the known
gym/break-description regex at `levelFiveRoomsViewModels.test.tsx:57`.
Typecheck fails only in the unchanged raw topic-author file
`packages/clinical-content/src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts:997`:
TS2322, optional `clinicalRationale` supplied where a string is required. That
file's bytes match intake. All other six workspace scripts and all owned tests
pass. These failures are not suppressed or relabeled as successful validation.

The current combined target is met, with positive cash and no walkout/flow lock.
The historical counterfactual bound failure above remains an important pacing
risk. A future accepted content pool, different player accuracy or different
facility upkeep can move the simultaneous satisfaction window again. Keep the
original/current/after arms separate and rerun the combined native CHECK against
the final shipping bundle before rebind. No change to the approved simultaneous
satisfaction rule is inferred. All work is local; no Git, agents, installs,
network, deploy or GS-release write occurred. Manager owns release integration,
the evidence rebind and any broader goal-policy decision.
