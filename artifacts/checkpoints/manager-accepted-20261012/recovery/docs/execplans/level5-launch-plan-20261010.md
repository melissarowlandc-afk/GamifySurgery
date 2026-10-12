# Level 5 launch plan - Optimized ASC / Prestige

Date: 2026-10-10  
Status: M0 reconciled to the binding 2026-10-11 follow-up; runtime implementation pending. Claude Code GamifySurgery manager owns acceptance.  
Worker: GPT-6.1 Sol, bounded research/documentation lane. No implementation authorized by this document.

## Implementation readiness (2026-10-11)

- [x] Binding M0 reconciled: 2,000 XP / satisfaction >90 / morale >=85 unlock inspections; the first completed inspection finishes the game.
- [x] Four Executive jobs, $45/hour pay, two approved Executive looks and ten accepted inspector looks specified.
- [x] All five room approval receipts cited: Founder 3x3, Executive 3x2, Gift 3x3, Garden 4x4 and Gym 4x4; runtime lanes, validation and desktop/mobile parity defined.
- [x] Gym corner condition met and manager browser acceptance recorded in its October 11 approval receipt; corrected art is ready for runtime promotion.
- [ ] Runtime M1-M10 implemented and manager-accepted; ordinary cap stays 4 until M10. Runtime M1 is ready to begin.

## Goal and launch boundary

Launch the five Level 5 rooms and the Executive as a coherent optimization stage
over the existing outpatient/ASC game. Preserve the owner's approved Founder's
Office, the accepted room upgrade ladders, existing campaigns, and the separate
desktop and mobile presentations of one domain/session.

The roadmap explicitly gives Level 5 no new clinical setting. Its scope is
efficiency, morale, satisfaction, revenue, prestige and inspection
(`docs/features/facility-levels-and-clinical-release-points.md:182`). The canonical
design already specifies an elective inspection week, a score and recognition
tier, continued play and later reattempts (`CANONICAL_DESIGN.md:544`). The owner
made Level 5 the final ASC stage: its three goals unlock inspection; the first
completed inspection finishes the game. The finish page offers continued play
or a new campaign. Hospital content remains deferred, without an invented Level 6
(`CANONICAL_DESIGN.md:540`).

This is an owner/development prototype launch. Room approval, unit-test success,
inspection results and manager acceptance do not approve clinical content or
authorize a public clinical release. Existing draft content retains its review
status. Nothing in this plan authorizes Git, installation, publication or work
outside a subsequent manager brief.

## Constraints, repository state and source precedence

- This revision worker owns only this plan. The initial two-line pointer already
  exists in `docs/execplans/owner-requests-20261008.md`; it is not edited again.
  The manager owns durable integration handoffs. No code, assets, owner saves,
  global handoff, other plans, Git or installs belong in this revision.
- The working tree is shared with Claude Code, the owner and ongoing mobile/
  desktop work. Subsequent briefs must inspect its current state and reserve
  shared files before editing. Normally use one write-capable worker at a time;
  never give two workers `reducer.ts`, `persistence.ts`, `types.ts`,
  `prototype-balance.ts`, `viewModels.ts` or a shared art registry concurrently.
  These are standing manager/worker requirements (`AGENTS.md:169`,
  `AGENTS.md:224`). Workers do not spawn workers.
- Source precedence is: explicit owner decisions and current approval artifacts;
  current runtime and manager-accepted handoffs; then earlier plans and roadmap
  proposals. A future catalog row, approved illustration or successful proof is
  not an implemented gameplay feature.
- The current accepted Level 4 launch is recorded at
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md:37`. The leading mobile handoff records
  MB1-MB8 acceptance and one shared session at
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md:18`. Later concurrent changes must be
  checked again when implementation begins; historical test counts are not a
  new validation run.
- Some older room notes still say Founder's Office approval or morale is pending.
  They are superseded by `tools/room-design/level-5/founders-office/approval-2026-10-09.md:3`
  and `docs/execplans/level5-room-design-20261008.md:222`. Do not reopen that owner
  decision or return to the discarded 4x4 footprint.
- Educational tier, acuity, clinical setting/capability, facility level, room
  upgrade and employee training stay separate. Clinical relationships never use
  the editorial weights below. No demographic disease-selection weights,
  runtime web retrieval, runtime AI, new clinical facts or source ingestion are
  needed (`AGENTS.md:12`, `AGENTS.md:21`, `AGENTS.md:59`).
- **All proposed costs, income, durations, cadence, points, thresholds, scoring
  weights and recognition tiers below are editorial game values, not medical,
  economic or regulatory facts.** Approved existing values are identified as
  such. M0 direction is binding. This revision records ordinary implementation
  defaults and their arithmetic. The October 11 follow-up binds all four Executive
  jobs and supersedes older supplier/inspection options. None is clinical approval.

## 1. Inventory: intended Level 5 versus the current implementation

The inventory is a source snapshot reconciled on 2026-10-11. Citations are repository
`file:line` anchors, not placeholder medical citations.

| Area | Intended or approved | Implemented today | Launch gap / source anchors |
| --- | --- | --- | --- |
| Facility level | Level 5 Optimized ASC / Prestige, five rooms and Executive; no new setting | `maximumPlayableLevel` is 4; stage definitions end at Level 4 | Extend mechanical level/schema/view unions, add stage 5, then expose it only after acceptance. `packages/balance-config/src/prototype-balance.ts:29`, `packages/balance-config/src/prototype-balance.ts:966`, `packages/balance-config/src/schema.ts:9`, `packages/balance-config/src/schema.ts:578`; intent at `docs/features/facility-levels-and-clinical-release-points.md:182`. |
| Founder's Office | Owner-approved 3x3, five appearance tiers; owning it raises every employee's morale | Approved native art/proof exists separately; no buildable `room.founder_office` definition in the current room catalog | Integrate exact approved v2 art, ownership morale and existing ladder. `tools/room-design/level-5/founders-office/approval-2026-10-09.md:5`, `tools/room-design/level-5/founders-office/approval-2026-10-09.md:59`; current room catalog starts at `packages/balance-config/src/prototype-balance.ts:43` and ends at `packages/balance-config/src/prototype-balance.ts:703`. |
| Executive Office | Owner-approved 3x2, ten doors and fixed appearance across five upgrade tiers; accepted ladder shortens administration | Approved compact proof retains N2/S2 chairs and sitters; no runtime room, daily round or Executive slot | Integrate approved layout, one home and four-job daily contract. `tools/room-design/level-5/executive-office/approval-2026-10-11.md:3`, `tools/room-design/level-5/executive-office/approval-2026-10-11.md:5`, `packages/balance-config/src/room-upgrades.ts:96`, `packages/game-domain/src/types.ts:1276`, `packages/game-domain/src/room-capacity.ts:6`. |
| Gift Shop | Owner-approved 3x3 revenue room, fixed appearance; accepted +6% gross per upgrade | Future gift income metadata exists: $15/$6 stock and $25/$12 stock, 2-minute dispensing, minimum level 5. No usable shop definition/capability | Approved mockup integration, retail outlet, affordable customers, measured demand and receipts. `tools/room-design/level-5/gift-shop/approval-2026-10-11.md:3`, `tools/room-design/level-5/gift-shop/approval-2026-10-11.md:5`. Metadata is not current earnings. `packages/balance-config/src/service-income-catalog.ts:105`, `packages/balance-config/src/room-upgrades.ts:97`, `packages/game-domain/src/retail-operations.ts:428`. |
| Indoor Garden | Owner-approved 4x4, fixed appearance; accepted +2 visitor satisfaction per purchase | No room, garden-use witness or garden satisfaction application | Approved continuous south planting and actual-use comfort rule; no health/clinical benefit. `tools/room-design/level-5/indoor-garden/approval-2026-10-11.md:3`, `tools/room-design/level-5/indoor-garden/approval-2026-10-11.md:5`. `docs/features/facility-levels-and-clinical-release-points.md:189`, `packages/balance-config/src/room-upgrades.ts:98`. |
| Staff Gym | Owner-approved corrected 4x4; accepted +2 morale after use per purchase | Approved proof/receipt now records corner condition met and manager browser PASS; no runtime room or gym task | Integrate corrected art, actual breaks, reservations and care priority. `tools/room-design/level-5/staff-gym/approval-2026-10-11.md:3`, `tools/room-design/level-5/staff-gym/approval-2026-10-11.md:5`. `packages/balance-config/src/room-upgrades.ts:99`, `packages/game-domain/src/level-three-support.ts:398`, `packages/balance-config/src/prototype-balance.ts:1132`. |
| Five room ladders | GS038 has accepted four purchases, Levels 1-5, for all five rooms | All five rows have `status: future`; runtime amount/multipliers are neutral and current-only lookup excludes them | Preserve accepted amounts/prices. Activate each row only with its implemented base function. `docs/execplans/gs038-all-room-upgrades.md:459`, `packages/balance-config/src/room-upgrades.ts:95`, `packages/balance-config/src/room-upgrades.ts:106`, `packages/balance-config/src/room-upgrades.ts:124`. |
| Executive staff | One hireable Executive at Level 5; all four mild jobs scale with training; $45/h editorial default; approved looks 003/004 | No role definition or management-strength metric; two approved future identities are registered with no eligible staff roles | Hire/home/payroll/training/daily-task lifecycle and truthful effects on both shells. Reuse approved identities 003/004, not new clinical automation. `packages/balance-config/src/prototype-balance.ts:705`, `packages/balance-config/src/prototype-balance.ts:963`, `packages/balance-config/src/employee-training.ts:4`, `packages/balance-config/src/employee-training.ts:42`, `packages/game-domain/src/characterStillCatalog.ts:209`, `tools/character-mapping/future-roster20-v5/owner-approval.json:3`, `tools/character-mapping/future-roster20-v5/roster.json:120`, `tools/character-mapping/future-roster20-v5/roster.json:170`. |
| Morale and salary | Existing 0-100 staff morale, pay choices and support effects can support Level 5 | Stored employee morale, salary steps, praise, coffee, breaks and unpaid-payroll decay exist. Salary normalization computes base morale from pay; it is not an ownership-bonus selector | Centralize effective morale and prevent repeated/erased ownership bonuses. `packages/game-domain/src/types.ts:1307`, `packages/game-domain/src/staff.ts:752`, `packages/game-domain/src/reducer.ts:6306`, `packages/game-domain/src/reducer.ts:7057`, `packages/game-domain/src/reducer.ts:7153`, `packages/game-domain/src/reducer.ts:10090`. |
| Satisfaction | Existing displayed satisfaction receives truthful actual-use garden and hired Executive effects; inspection has its own full-window sample | Average of recent scored encounters, less current facility-condition penalties; provisional 100 before history | Preserve its denominator and clamps; do not award a perfect inspection for an empty clinic. `packages/game-domain/src/selectors.ts:1381`, `packages/game-domain/src/selectors.ts:1422`, `packages/balance-config/src/prototype-balance.ts:1053`. |
| Quality review (QI) | Existing optional review can remain a supporting achievement | Paid ambulatory-operation receipts enqueue surgeon-led reviews; work requires a real available surgeon and operational Surgeon's Office. It is shown as an optional goal | It is not an inspection, licensing decision or clinician approval. Executive must not perform it. `packages/game-domain/src/level-three-support.ts:317`, `packages/game-domain/src/level-three-support.ts:377`, `apps/player/src/session/viewModels.ts:2526`. |
| Inspection / prestige | Owner: three Level 5 goals unlock inspection; first completed inspection finishes the game; repeat inspections retain best as prestige | No formal inspection run, score, recognition tier or prestige state found in current balance/domain execution; current support UI exposes QI counts and breaks | New gated inspection state/report/finish page plus ten accepted moving presentation actors. `docs/execplans/character-gapfill-v6-20261007.md:1334`. Prestige is the best valid result. `CANONICAL_DESIGN.md:544`, `packages/game-domain/src/types.ts:1336`, `packages/game-domain/src/level-three-support.ts:41`, `apps/player/src/mobile/manage/MobileServices.tsx:104`. |
| Level 4 completion | Existing five live goals unlock manual Advance: 750 current-level XP, displayed satisfaction >90, assigned operational APP, pediatric-with-parent witness, wound/ostomy witness | Five goals and durable historical Level 4 acknowledgment exist. Next level is null; ordinary leveling up resets current-level XP | Preserve witnesses/history; use ordinary live eligibility, not an acknowledgment bypass; add an idempotent manual transition. `packages/balance-config/src/prototype-balance.ts:1017`, `packages/game-domain/src/selectors.ts:1607`, `packages/game-domain/src/selectors.ts:1632`, `packages/game-domain/src/selectors.ts:1650`, `packages/game-domain/src/reducer.ts:10231`, `packages/game-domain/src/reducer.ts:10244`. |
| Desktop/mobile ending | Shared three-goal eligibility and first-inspection finish page with Keep playing / Start new campaign | Both hard-code "Level 4 complete - Level 5 coming later". Shared progression view maps terminal state to `prototypeComplete` | Implement shared unlock/finish records and both finish pages; no game-finished notice at the three-goal milestone. `apps/player/src/ui/GoalsPanel.tsx:103`, `apps/player/src/mobile/MobileGoals.tsx:56`, `apps/player/src/session/viewModels.ts:2511`, `packages/balance-config/src/prototype-alerts.ts:824`. |
| Mobile room exposure | All new rooms need build cards, thumbnails, map art, inspection/upgrades and Manage features | Mobile catalog reads shared room definitions; thumbnail and map loading use approved room records plus an explicit asset inventory/cache | Register every new asset in both the presentation registry and phone asset selection; avoid a blank thumbnail reporting ready. `apps/player/src/mobile/build/MobileBuildCatalog.tsx:40`, `apps/player/src/mobile/build/RoomThumbnail.tsx:16`, `apps/player/src/mobile/performance/roomAssets.ts:11`, `apps/player/src/mobile/performance/roomAssets.ts:25`, `apps/player/src/mobile/performance/roomAssets.ts:70`. |
| Clinical release | Level 5 adds no setting; existing outpatient/ASC eligibility and frozen encounters continue | Level 4 pediatric content is prototype-only and needs clinician review; concept/history and release boundaries already matter | No Level 5 clinical authoring batch is required. Do not alter clinical meaning or make supplemental new concepts mandatory. `docs/handoffs/CURRENT_THREAD_HANDOFF.md:49`, `CANONICAL_DESIGN.md:603`, `CANONICAL_DESIGN.md:610`, `AGENTS.md:64`. |

## 2. Progression, inspection unlock and finishing the game

### Entering Level 5

The binding October 11 follow-up controls this section. The October 10 record
is retained as history; its earlier inspection timing is superseded.

1. Use the same eligibility and manual Advance command as earlier levels. A
   Level 4 campaign must meet its existing five goals: 750 current-level Clinical
   XP, displayed satisfaction >90, installed compatible operational APP, earned
   pediatric-with-parent completion and earned wound/ostomy completion. Do not
   add MRI, Pediatric Waiting Room, mastery or another clinical requirement
   (`packages/balance-config/src/prototype-balance.ts:1017`,
   `docs/execplans/level4-launch-plan-20261008.md:961`).
2. Preserve earned visit witnesses and the old terminal acknowledgment on load.
   The acknowledgment remains historical evidence, not a bypass of the live
   XP/satisfaction/staff eligibility check. Selling/reassigning affects live
   requirements in the same way as earlier levels. Do not fabricate witnesses.
3. Both Goals screens offer **Advance to Level 5** through the same domain command.
   Recheck eligibility, reset only current-level XP once, and retain cash,
   rooms/upgrades, staff/contracts/training, FSRS, clinical revisions and receipt
   history. Repeat taps, shell changes and reload cannot repeat the transition.
4. **Entering Level 5 does not unlock inspections.** Both shells show the three
   goals below and a locked Inspection entry with their progress. Domain booking
   rejects attempts until the durable Level 5 goals-met record is earned.
5. Keep the ordinary shipped cap at 4 through M9; opt-in disposable QA may exercise
   stage 5. M10 exposes it after runtime acceptance. Retire the old "Level 5 coming
   later" copy without replaying old success events or deleting their IDs.

### Level 5 goals: inspection eligibility, not game completion

| Goal | Binding value | Existing input / behavior |
| --- | --- | --- |
| Current-level Clinical XP | **2,000 XP** | `state.clinicalXp`, after the Level 4-to-5 reset. Use existing first-answer rewards; no XP multiplier from rooms, Executive or inspection. |
| Patient satisfaction | **Displayed satisfaction strictly >90** | Existing `getDisplayedClinicSatisfaction`, including real scored history and current condition penalties. |
| Average staff morale | **Effective mean >=85**, across a nonempty employed workforce | Arithmetic mean of the common effective-morale selector for all hired employees, including busy/training staff; founder excluded. Empty workforce is unmet, not 100. |

Meeting all three simultaneously earns a once-only durable **inspection-unlocked**
record. No Level 5 room, Executive, maximum training, mastery or inspection pass
is required for that unlock. Once earned, eligibility survives later morale/
satisfaction changes and save/load; no repeated reward, XP reset or re-lock.
Both shells show an earned Inspection unlocked badge/date; live satisfaction
and morale remain visible as current conditions for the next report.

Goals copy at that point: **"Level 5 goals complete. Inspections are now available."**
Offer **Book inspection** in both shells. Do not announce "you finished the game"
yet. Keep the clinic open, preserve current-level XP and leave next level null.

### XP arithmetic against the current content

Current ordinary first answers award **10 XP correct / 2 XP incorrect**; tutorial
20 XP is not a Level 5 assumption
(`packages/balance-config/src/prototype-balance.ts:1237`,
`packages/game-domain/src/reducer.ts:2656`,
`packages/game-domain/src/reducer.ts:4258`). Settlement's XP subtotal summarizes
those answers, not a second award (`packages/game-domain/src/reducer.ts:2757`).

The current assembled release has 1,110 routine cases at earliest stages 0-4:
**811 one-node, 293 two-node and 6 three-node cases**, or 1,415 decision nodes
(`packages/clinical-content/src/synthetic-content.ts:1236`,
`packages/clinical-content/src/synthetic-content.ts:1305`). Its catalog mean is
`1,415 / 1,110 = 1.2748 nodes/case`. This is a catalog statistic, not a disease
frequency, FSRS selection weight or guarantee of completed visits. Existing
capabilities, waits, frozen releases and clinician-review status still apply.

For game-answer accuracy a, XP/first submission is `10a + 2(1-a) = 2 + 8a`;
80% gives **8.4 XP/answer**. The current routine generator is 60 +/-15 game
minutes; the earlier option B audit used 0.8 completed one-question visits/hour
as an explicit scenario, not an owner-save measurement
(`packages/balance-config/src/prototype-balance.ts:1146`,
`docs/design/room-economy-audit-20261008.md:26`).

| Scenario, not a measured playthrough | Completed visits/hour | Answers/completed visit | Answer accuracy | XP/hour | 2,000 XP / rate | Ten-hour operating days |
| --- | --- | --- | --- | --- | --- | --- |
| Slow, single-question play | 0.50 | 1 | 80% | 4.20 | 476.19 hours | 47.62 |
| Normal single-question reference | 0.80 | 1 | 80% | 6.72 | 297.62 hours | 29.76 |
| Catalog-length reference, same completion rate | 0.80 | 1.2748 | 80% | 8.5665 | 233.47 hours | 23.35 |
| Two-question case mix | 0.80 | 2 | 80% | 13.44 | 148.81 hours | 14.88 |
| Efficient two-question play | 1.00 | 2 | 90% | 18.40 | 108.70 hours | 10.87 |

At 80%, 2,000 XP is about `2,000 / 8.4 = 238.10` first submissions; perfect
accuracy needs 200. The target is `2,000 / 750 = 2.6667` times Level 4's goal.
Existing employee discussions also add 10/2 XP
(`packages/game-domain/src/reducer.ts:3460`) and can shorten these patient-only
estimates; autonomous APP visits, room ownership and Executive duties add none.

The first score-bearing inspection then needs its preparation and full window.
For the catalog-length reference, assuming the satisfaction/morale goals are
already met and the patient sample is adequate, baseline first game finish is
`233.47 + 1 preparation hour + 50 inspection hours = 284.47 game hours`
(28.45 ten-hour days). Executive preparation can save up to six game minutes.
These are editorial pacing scenarios, not measured real-world study time.

M6/M8 must report actual XP/hour, completed/question counts and time to eligibility/
first completed inspection from current-content runs, without XP overrides.
The four-warmup/48-measured-hour economy reference is a minimum financial sample,
not a full-game pacing run. Extend separate pacing runs until the actual goals
and first valid inspection finish; a 50-hour inspection alone exceeds 48 hours.
Keep the binding 2,000 target; report pacing problems to the manager rather than
quietly changing the owner's 2,000-XP goal.

### First completed inspection: the finish page

The first **completed, score-bearing inspection** finishes the game at any score;
there is no pass mark or perfect-score requirement. The unchanged minimum sample
is 20 qualifying scored completions within the 3,000-active-minute window.
Insufficient sample produces **Incomplete**, not a completed inspection.
Cancelled/incomplete runs do not finish the game. A valid low score does.

Atomically persist the inspection report, latest/best prestige, first completed
run ID, game-finished tick and one completion notice. The three-goal acknowledgment
is a separate earlier milestone. Repeated settlement, reload, shell changes and
later inspections cannot finish the same campaign again, reset XP or award money.

Open a dedicated **"You finished the game"** page on desktop and mobile:

1. A clear **Congratulations. You finished the game.** heading and one short dry
   line from the candidates below. Use the chosen opening once: candidate 1's
   first two sentences supply that heading, with its paperwork sentence below.
   Do not repeat a stock congratulation plus the same candidate introduction.
   Keep the joke about administration, not patients.
2. The actual first inspection **report card**: score/recognition, all ten category
   scores, weights/points, fractions/formulas, missing items and improvement hints.
   Use the shared full report view, not an unrelated trophy/summary.
3. **Keep playing**: close the finish page, retain the same clinic/campaign, restore
   the normal shared play view and allow repeat inspections to chase a better score.
   Keep the highest report as prestige; lower retries do not erase it.
4. **Start new campaign**: enter the campaign-start flow with explicit confirmation
   before changing saves, fresh campaign identity/progress/learning history and
   the existing founder/new-campaign choices. Keep this distinct from same-seed
   Restart Campaign (`CANONICAL_DESIGN.md:108`, `CANONICAL_DESIGN.md:362`,
   `CANONICAL_DESIGN.md:736`). Preserve the finished campaign under existing
   recovery rules; no shell-only hard reload or silent in-place reset.

Both shells use one shared finish/report view model and campaign command path.
Desktop uses a full-page report with visible actions; mobile uses a vertically
scrolling page, stacked category rows and reachable 44px action targets. Use
the common pause policy while the page is open. Persist page acknowledgment:
reload before acknowledgment reopens it; after Keep playing it stays dismissed
and a **View finish report** entry remains. Later inspections open ordinary report
cards, not another victory page. Cancelling New campaign returns to the intact
finish page. Browser QA covers keyboard/touch, both orientations, repeated taps,
reload and shell switching on the page.

### Draft finish-page lines for later owner selection

These are original candidate game-copy lines, not accepted final wording.
Use candidate 1 as development-preview copy until the owner selects later.

1. "Congratulations. You finished the game. The paperwork has renewed itself."
2. "You finished the game. The clinic would like to know when you are coming back."
3. "Congratulations. Your reward is a report card and the opportunity to improve it."
4. "The inspectors have left. Their recommendations have moved in."
5. "You reached the finish line. Accounts payable has requested an extension."
6. "Congratulations. Even the spreadsheet looks mildly impressed."
7. "You may now chase a perfect score. The invoices will chase you."
8. "You finished the game. Management would like to remind you that the clinic is still open."

The existing game already uses dry administrative/office humor
(`packages/balance-config/src/prototype-alerts.ts:1147`); keep the congratulation
and button labels clear regardless of the chosen line.

### Final ASC and repeatable end-game

Level 5 is the final ASC stage; no Level 6 or forced campaign reset. Its three
goals unlock inspection; its first completed inspection finishes the game.
**Keep playing** continues the same clinic indefinitely, with repeat inspections
and **best inspection score as prestige**. Hospital content remains deferred;
inspection is a game report, not real accreditation or clinical competence.

## 3. Room integration contracts

### Shared contract for all five rooms

Room existence, art approval and gameplay behavior must pass separate checks.
The Level 4 model's shared contract is at
`docs/execplans/level4-launch-plan-20261008.md:138` and its runtime wiring list at
`docs/execplans/level4-launch-plan-20261008.md:188`.

- Stable IDs: `room.founder_office`, `room.executive_office`, `room.gift_shop`,
  `room.indoor_garden`, `room.staff_gym`. Use unlock 5 and the binding maximum one of
  each per facility; no duplicate ownership stacking or
  per-copy customer stream. Each has Levels 1-5, independent of facility level.
- Mockup design is complete: Founder 3x3/five appearances; Executive 3x2/ten
  doors, Gift 3x3, Garden 4x4 and Gym 4x4, each with one fixed look across all
  upgrades except Founder. Approval receipts are listed in the room contracts.
  Gym's corrected corner layout now has its owner approval receipt and manager
  browser PASS; promote that accepted revision, not the archived overlapping
  candidate. Runtime M1 does not wait for new mockups.
  Preserve approved numerical ladders (`docs/execplans/gs038-all-room-upgrades.md:465`).
- Use the ordinary component-built room shell, walls and one-tile door rules.
  Test every perimeter door, corner and backed/unbacked wall condition. Define
  obstacle footprints, standing contacts, cushion contacts, reservations,
  approach/exit paths and draw layers before painting, not after runtime fails.
- Adult characters stay separate from furnishings, with approved identities,
  poses, contacts and uniform scale. Do not bake staff/visitors into room PNGs.
  Use each approved room's door/contact masks. Necessary Executive chairs/sitters
  remain for N2/S2; preserve the approved passing routes/depth layers. Optional
  decor hides only where the room's accepted mask allows. Preserve synchronized logical
  indices; repeated synchronization nodes must not be removed as duplicates.
- Wire buildability, footprint/cap, purchase/sale/refund, inspect, all four
  upgrade purchases, cleaning/access, employment homes where applicable,
  reservations, expense quote/finance receipts, map camera, public asset paths,
  manifest/registries, desktop Build/Manage/Goals and mobile equivalents.
- Only actual use earns a use effect. Freeze the relevant room tier, employee
  training and duration/fee at accepted work/retail phase start; a later upgrade
  or reload must not change accepted work retroactively. Founder's Office is the
  explicit owner-approved ownership effect, not an actual-use exception invented
  for the other rooms. An unused copy never improves another room's work.
- Blocked doors, sale, firing and interruption release reservations safely and
  cannot award twice. Dirty/blocked support rooms keep ordinary support upkeep;
  do not silently extend revenue-room outage relief to all rooms. Current relief
  distinguishes technical outages from busyness/training/breaks and keeps support
  upkeep (`packages/game-domain/src/room-upkeep-outages.ts:6`,
  `packages/game-domain/src/room-upkeep-outages.ts:43`).
- Room functions and their numeric editorial effects belong in replaceable
  balance/operational data. No new clinical edge, diagnostic eligibility, acuity,
  disease prevalence or evidence weight is justified by a prestige room. An
  inspection category's numeric weight never becomes a disease-selection or
  clinical-relationship weight.

### Founder's Office - approved appearance and ownership mechanic

**Simple rule:** Owning the Founder's Office raises every employee's morale.

- **Footprint/status:** Approved 3x3; five approved appearances, Startup,
  Established, Refined, Executive and Grand. Promote approved v2 assets and
  approval hashes, not old prepared variants. Approval covers appearance and
  the ownership rule, not a playable Level 5
  (`tools/room-design/level-5/founders-office/approval-2026-10-09.md:5`,
  `tools/room-design/level-5/founders-office/approval-2026-10-09.md:7`,
  `tools/room-design/level-5/founders-office/approval-2026-10-09.md:59`).
- **Proposed magnitude:** Base +2 effective morale; accepted ladder adds +2 per
  purchased tier, for +2/+4/+6/+8/+10 at room Levels 1-5. The base +2 is a new
  editorial proposal; the +2-per-purchase ladder is already accepted.
- **Users:** The founder can sit at the desk; an employee can use the visitor
  seat for a future nonclinical conversation. All employed staff receive the
  ownership effect, including an Executive and people hired after purchase.
  No paid employee home slot, required founder occupancy or conversation is
  needed to obtain that effect. Decorative visits earn no additional morale.
- **Geometry:** Preserve the approved desk, shelf, rug, accent, chair contacts
  and foreground occluders. Founder sits north of the desk facing south; visitor
  sits south facing north. The layout uses separate chair floor/cushion anchors
  and approved 12-door compatibility, not arbitrary rotation/resizing of the
  mockup (`tools/room-design/level-5/founders-office/ART_BRIEF.md:22`,
  `tools/room-design/level-5/founders-office/WORKER_HANDOFF.md:44`).
- **Lifecycle:** Derive the ownership bonus once from the owned room/tier.
  Purchasing, upgrading, salary changes and load must not permanently add it
  again. Selling removes that modifier while preserving ordinary earned morale.
  Blocking a door does not remove the ownership bonus; owner wording says
  owning, not operational occupancy. Access still matters for actual visits and
  inspection room coverage; there is no room completion goal. Use 0-100 bounds.
- **Acceptance:** Every appearance tier matches the approved layout and PNGs;
  bonus includes all staff exactly once before/after reload and a new hire;
  salary adjustment and sale do not corrupt stored morale; no new clinical task.

### Executive Office - approved 3x2 appearance and daily management

**Simple rule:** One Executive completes a daily management round that mildly
supports staff morale, visitor satisfaction, inspection preparation and supplier
negotiation.

- **Footprint/status:** Owner-approved **3x2**, six floor tiles, ten one-tile doors
  and one fixed appearance at all five upgrade levels. The compact revision and
  retained-chair path correction are approved
  (`tools/room-design/level-5/executive-office/approval-2026-10-11.md:3`,
  `tools/room-design/level-5/executive-office/approval-2026-10-11.md:5`).
- **Geometry:** Dual-monitor desk, one Executive chair and visitor chair,
  nonverbal KPI/window, plant, compact credenza and rug; no separate meeting bay.
  Executive sits north facing south; visitor south facing north. Preserve the
  accepted ten sections N1-N3/S1-S3/WA-WB/EA-EB. **N2/S2 do not remove chairs,
  sitters or foregrounds.** Reproduce the approved routes past retained chairs,
  usable work contacts and correct depth sorting. The old v3 chair-hiding rule
  is superseded by the approval receipt; do not enlarge the room.
- **Users:** One assigned hired Executive at the desk; an idle employee may
  visit the guest contact cosmetically without another award. The mockup's
  founder is only a stand-in. Runtime uses the two approved Executive designs.
- **Function/effect:** A once-daily seated management round takes 30 base active
  minutes. The accepted 5%-per-office-purchase ladder gives 30/28.5/27/25.5/24
  raw minutes, with minute-clock accepted quotes 30/29/27/26/24. Employee training
  scales all four mild outputs in section 4. No automatic clinical work, XP,
  QI authority or inspection-score bonus.
- **Lifecycle:** Save day/task/employee/office IDs, frozen room/employee tiers,
  duration/remaining work and once-applied effects. Interrupt, expire, train,
  fire, sell and reload safely; release actual work reservations. New terms
  require a completed daily round and valid home; accepted quotes retain theirs.
  Default wages remain $45/hour.
- **Acceptance:** Promote the approved compact layout; one home slot, ten usable
  doors and retained N2/S2 chairs/actors match the receipt on both maps.
  Hire -> assign -> walk -> work -> one daily award -> return is rendered with
  truthful current/next-tier and office-duration labels. No room/hire gate is
  added to the three inspection-unlock goals.

### Gift Shop - approved 3x3 appearance and retail income

**Simple rule:** Completed gift purchases earn money after stock cost.

- **Footprint/status:** Owner-approved 3x3, self-service room-first checkout,
  stocked wall displays and two-person queue/exit. One fixed look across upgrades
  (`tools/room-design/level-5/gift-shop/approval-2026-10-11.md:3`,
  `tools/room-design/level-5/gift-shop/approval-2026-10-11.md:5`).
  No shopkeeper role, Executive requirement or new clinical staff slot.
- **Function/effect:** Activate the existing $15 normal gift/$6 stock and $25
  premium/$12 stock metadata with 2-minute dispensing. Accepted shop upgrades
  add 6% of base gross per purchase, never 6% of profit or a stock discount.
  Bind the quote to the shop actually used and settle one receipt only after
  arrival and dispensing (`packages/balance-config/src/service-income-catalog.ts:105`,
  `packages/game-domain/src/retail-operations.ts:325`,
  `packages/game-domain/src/retail-operations.ts:428`).
- **Users:** Adult retail visitors and currently eligible idle adults/staff.
  Founder shopping remains stock consumption, not external revenue. Working
  staff and linked pediatric child/parent pairs are not diverted into a solo
  purchase (`packages/game-domain/src/retail-operations.ts:201`).
- **Demand proposal:** A separate gift-only adult visitor opportunity every 120
  minutes per facility, with one normal-gift request and no acceptance coin flip.
  Target 0.5 fulfilled normal sales/hour at normal working access; physical travel,
  stock cash, queue limits and cancellation can lower it. This stream is new,
  editorial implementation detail under resolved M0; the existing shared retail
  opportunity is not proof of this demand. Keep its RNG/state separate from clinical selection and
  do not duplicate it per shop, upgrade or reload.
- **Budgets:** Preserve existing recurring staff/founder $20 and ordinary visitor
  $30 limits (`packages/game-domain/src/retail-operations.ts:227`). A proposed
  gift-only visitor allowance of $40 covers the highest upgraded premium quote
  ($31), if premium shopping is offered. The baseline calculation uses normal
  gifts only; never assume premium staff purchases or ignore affordability at
  the higher tier. Test affordability against the frozen upgraded gross, not
  only the base catalog fee used by today's eligibility helper. Ordinary visitors
  with a $30 allowance must not buy a $31 premium gift. No new gift allowance
  changes diagnosis selection.
- **Acceptance:** Earned receipts, net cash/stock and cancellations reconcile;
  no route/stock cash means no sale; founder purchases have zero gross; a blocked
  queue/sale/reload releases customers safely; enabled/disabled gift demand does
  not silently change scored case eligibility or the clinical encounter pool.

### Indoor Garden - approved 4x4 appearance and visitor comfort

**Simple rule:** An actual garden visit adds satisfaction to that visitor's visit.

- **Footprint/status:** Owner-approved 4x4, central fountain/loop path and two
  permanent visitor seats. Preserve continuous S1-S4 planting; only a selected
  door clears its owned optional planter segment. Seats and aisle remain
  (`tools/room-design/level-5/indoor-garden/approval-2026-10-11.md:3`,
  `tools/room-design/level-5/indoor-garden/approval-2026-10-11.md:5`). No employee home slot or clinical workload slot.
- **Function/effect:** A completed garden rest gives +2 visit satisfaction once
  per encounter/service visit. The accepted ladder adds +2 per purchase, for
  +2/+4/+6/+8/+10. Cap satisfaction through the existing rules. Record the used
  room and accepted tier; ownership or a route passing its door earns nothing.
- **Users:** Waiting adult patients/service visitors; staff and founder may use
  it cosmetically without receiving an extra morale bonus. Accepted care takes
  priority. For the first launch, linked pediatric families keep their existing
  paired waiting flow; no solo child or separated parent enters the garden.
  A paired garden extension would be a separately briefed/validated scope.
- **Timing:** Reuse a bounded rest task, proposed 5 active minutes after reaching
  the seat, with immediate safe preemption by accepted care. This is game timing,
  not a clinical waiting-time recommendation. Never delay necessary care to farm
  satisfaction or increase the once-per-visit award.
- **Accounting:** Apply the witness to the actual visit's satisfaction calculation.
  Scored encounter history alone feeds the current HUD denominator; an unscored
  service visitor cannot be inserted as a fictitious scored clinical completion
  merely to improve displayed satisfaction.
- **Acceptance:** Seated use, interruption, tier freeze and once-only application
  work across reload; available seats cannot be double-reserved; garden upgrades
  do not change medical relationships, waiting-room admission capacity or FSRS.

### Staff Gym - approved corrected 4x4 appearance

**Simple rule:** A completed gym break raises that employee's morale.

- **Footprint/status:** Owner-approved 4x4, one fixed look and two permanent
  staff contacts: seated bench and standing mat. The corner condition is now met:
  side shelves start south of rear equipment and stop at the front trays,
  retaining distinct footprints. The actual approval receipt records manager
  browser PASS (`tools/room-design/level-5/staff-gym/approval-2026-10-11.md:3`,
  `tools/room-design/level-5/staff-gym/approval-2026-10-11.md:5`). Preserve the
  corrected room-first layout, unchanged staff contacts and permanent aisle
  (`tools/room-design/level-5/staff-gym/WORKER_HANDOFF.md:54`,
  `tools/room-design/level-5/staff-gym/WORKER_HANDOFF.md:56`). The older worker
  pending-browser flag is superseded by the receipt. No home/hiring slot or
  new animated workout rig.
- **Function/effect:** Base +5 morale after a completed 30-minute break. Accepted
  upgrades add +2 after use per purchase, for +5/+7/+9/+11/+13. Use the existing
  240-minute employee break cooldown and a shared break eligibility/reservation
  system, not a separate gym cooldown that permits alternating rooms for free
  rewards (`packages/balance-config/src/prototype-balance.ts:1132`).
- **Users:** All eligible idle hired staff, including Executive. Founder may
  visit cosmetically; there is no employee morale score for the founder. Care
  demand, accepted work and payroll rules take priority. Salary still accrues.
- **Lifecycle:** Choose an available gym or ordinary break seat under one break
  policy. Freeze the used gym tier at accepted work start. Award only on completed
  use; interrupted/departing/sold-room tasks release their reservations and
  cannot double-apply morale or the last-break timestamp after reload.
- **Acceptance:** A real staff path/use/return exists in both shells; a gym does
  not silently enlarge the existing break-room seat set or create a clinical
  recovery, fitness or health effect. Empty/unreachable gyms give no passive gain.

### Accepted Level 5 ladders: preserve these values

These are already accepted editorial upgrade values, currently dormant
(`docs/execplans/gs038-all-room-upgrades.md:459`,
`packages/balance-config/src/room-upgrades.ts:95`). Base magnitudes are recorded editorial defaults; the owner's room/Executive
function direction and Founder's Office ownership rule are binding.

| Room | One purchase | Costs to Levels 2 / 3 / 4 / 5 | Four-purchase total | Maximum ladder contribution |
| --- | --- | --- | --- | --- |
| Founder's Office | +2 employee morale points | $300 / $500 / $750 / $1,000 | $2,550 | +8 points, plus proposed +2 base; five approved appearances |
| Executive Office | Administration takes 5% less base time | $500 / $750 / $1,100 / $1,500 | $3,850 | 20% reduction in the named active phase; no more daily awards |
| Gift Shop | +6% gift gross | $200 / $300 / $450 / $600 | $1,550 | +24% base gross; stock unchanged |
| Indoor Garden | +2 visitor satisfaction points | $200 / $300 / $450 / $600 | $1,550 | +8 after actual use, plus proposed +2 base |
| Staff Gym | +2 employee morale after use | $250 / $375 / $550 / $750 | $1,925 | +8 after actual use, plus proposed +5 base |

Purchases add percentages of the base, not compound the same room's percentage
four times. Where existing roles use both speed factors, multiply each once;
Executive training instead scales outputs, while its office alone shortens work.
Do not make future rows current merely to display purchase buttons before their effects
exist (`packages/balance-config/src/room-upgrades.ts:135`).

## 4. Executive role: four mild jobs, all scaled by training

The October 11 owner follow-up binds all four jobs: **staff morale, visitor
satisfaction, inspection preparation and supplier negotiation**. Use one small
daily management round and one Executive maximum. None grants clinical authority,
automatic answers, scored visits, XP/FSRS, surgeon QI or inspection-score points.

Supplier negotiation is part of the role, not an unresolved owner option.
Its 1-2% stock/upkeep contract below stays mild. Wages/capital/fees are excluded;
one Executive cannot replace normal clinical staffing or become the main profit
source. A missing/unqualified daily round has no new supplier terms, which is
the resilience control in the economy worksheet, not a different owner choice.

### Per-tier effects: recorded editorial defaults

Use additive training strength `m(T) = 1 + 0.25(T-1)`, T=1..5. Multiply each
base effect once; do not compound 25% five times. A trained Executive improves
four modest outputs, not all clinic productivity or clinical service revenue.

| Employee training tier | Strength | Once-daily staff morale | Patient/visitor satisfaction per eligible completed visit | Inspection preparation time reduction | Stock/upkeep reduction |
| --- | --- | --- | --- | --- | --- |
| 1 | 1.00x | +1.00 point | +1.00 point | 5.00% | 1.00% |
| 2 | 1.25x | +1.25 points | +1.25 points | 6.25% | 1.25% |
| 3 | 1.50x | +1.50 points | +1.50 points | 7.50% | 1.50% |
| 4 | 1.75x | +1.75 points | +1.75 points | 8.75% | 1.75% |
| 5 | 2.00x | +2.00 points | +2.00 points | 10.00% | 2.00% |

Keep decimal point awards rather than rounding a tier 2 benefit back to tier 1.
Clamp effective morale and satisfaction to 0-100. These are editorial game
values. At tier 5, +2 morale/day, +2 satisfaction/visit, six minutes less
paperwork and 2% of eligible costs cannot replace normal staffing, correct
answers, timely care, clean rooms or sound finances.

Executive Office upgrades keep their accepted **5% less administration time per
purchase**, maximum 20%. They shorten the round's active seated work
`30 x (1 - 0.05(R-1))` to 30/28.5/27/25.5/24 raw minutes for room tiers 1..5.
The current minute clock quotes the ceiling once: 30/29/27/26/24 active minutes.
Freeze that accepted duration and show both the raw ladder and actual quoted
minutes on desktop/mobile. Do not invent a separate sub-minute clock.
Office purchases do not increase daily awards, duplicate training strength or create extra
staff slots. Employee training increases the four outputs above; it no longer
has the first draft's proposed separate 5%-per-tier duration reduction.

### Daily task, accepted quotes and interruption

1. One `daily_management_round` per operating day of 600 facility minutes, for
   the single Executive assigned to the accessible operational Executive Office.
   Start on its first available work opportunity after that day's opening/hire.
   Walk to the real desk, reserve its contact, and do the accepted seated work.
   Founder cannot substitute for a hired Executive.
2. Freeze day number, task/employee/office IDs, employee tier, room tier, duration
   and all effect amounts at actual task acceptance. Training or office upgrades
   while it runs apply to the next round, not retrospectively.
3. At completion, award staff morale once to currently employed staff and record
   the applied marker. Enable that day's comfort, preparation and
   supplier terms until the next day boundary. New hires after the award do not
   receive yesterday's award; they do receive the Founder's Office ownership
   modifier immediately and the next completed round's award.
4. Breaks, training and blocked access may pause/requeue the unfinished round
   without duplicating progress/awards. Sale/firing releases the desk. An unfinished
   round expires at the end of its scheduled day; a fresh next-day round cannot
   replay it. A repeated command, tick, load or shell remount never creates a
   second round/award or renews an expired day.
5. New quotes require both a completed round for today and a valid installed
   Executive in its operational office. Busyness or training is not firing.
   Losing the home/employee/access ends eligibility for new quotes. Already
   accepted visit, stock and inspection preparation quotes stay frozen; already
   awarded morale stays earned.
6. Care work has priority over optional visitor movements, and ordinary staff
   breaks share their existing cooldown. Executive wages continue during walking,
   idle, training, breaks, inspection and interruption. No new income receipt is
   minted for performing management.

**Comfort:** At real care/service-visit acceptance, freeze the active comfort
amount on that visit. Apply it once at completed settlement, even if the quote
crosses the day boundary; no retroactive adjustment to old completed visits.
Scored encounters use their existing satisfaction history. Unscored onsite
service visitors need an explicit new comfort/use receipt or field; they do not
become fictitious scored patients in the HUD or inspection satisfaction sample.
A companion or passerby is not another paid/scored clinical visit. The desktop
and phone show the actual frozen effect, not the latest training amount applied
to past encounters.

**Inspection preparation:** All Level 5 players may book an inspection without
an Executive. Baseline administrative lead time is 60 active facility minutes,
with ordinary clinic play continuing. A completed active round shortens that
accepted lead time to `60 x (1 - 0.05m(T))`: 57/56.25/55.5/54.75/54 minutes.
These are raw durations; minute-clock acceptance quotes 57/57/56/55/54 minutes
using one ceiling, saved once with the end tick. Show that rounding explicitly;
training's percentage grows every tier even where two minute quotes coincide.
This reduces paperwork waiting only, never the five-day scored inspection window
or clinical waits and never adds score. The office's speed ladder already applies
to the actual management round; do not apply it again to this external lead time.
Cancelling preparation gives no prestige or result. Booking freezes the quoted
terms across reload or later firing/training.

**Supplier negotiation:** After a qualified completed round, reduce new stock quotes
and minute-accrued room upkeep by the table's 1-2%. Apply independently after
existing pharmacist stock reductions and technical-outage upkeep relief:
`base eligible cost x existing modifiers x (1 - supplierRate)`, rounded once to
cents at the appropriate quote/posting boundary. Never reduce salaries,
construction, hiring, training, upgrade purchases, advertising, published patient
fees or diagnostic duration; never permanently rewrite catalog prices. Preserve
old accepted stock quotes. Record actual saved cost as an expense reduction,
not new gross revenue or a second rebate payment. Future rounds replace the
single active rate; no per-job, per-room or duplicate-Executive stacking.
Use the existing operating-accrual precision for discounted upkeep; do not round
each room's fractional minute charge to whole cents and erase a 1% saving.
Round at the real quote/expense posting boundary and expose actual posted savings
(`packages/game-domain/src/types.ts:1655`).

### Staff contract and training UI

- Stable role `staff.executive`, unlock 5, one office home slot and maximum one
  active Executive per facility. Hire $600, **default wage $45/game hour**,
  bounds $35-$65 in $2 steps around the $45 default, existing 5 morale points
  per pay step, base morale 75. $45 is the highest nonclinical support default;
  it also exceeds the $40 endoscopist, while the clinical surgeon remains $50
  (`packages/balance-config/src/prototype-balance.ts:705`). This is game pay,
  not a real-world salary recommendation.
- Reuse exactly the approved **`future-roster20-v5.003`** Executive (burgundy
  blazer, mustard-gold blouse, charcoal trousers) and **`future-roster20-v5.004`**
  Executive (navy suit, white shirt, short burnt-umber tie), with their approved
  eight poses/contacts each. Appearance IDs/outfits are not new clinical data
  (`tools/character-mapping/future-roster20-v5/roster.json:120`,
  `tools/character-mapping/future-roster20-v5/roster.json:170`,
  `tools/character-mapping/future-roster20-v5/owner-approval.json:3`).
  Enable their Executive-role eligibility during implementation. The roster's
  old planned flag does not override the owner's approval. Keep the current
  hire, payroll, home, training, break/idle and dismissal lifecycle.
- Training prices remain the proposed $100/$200/$300/$400 (total $1,000),
  current 60-minute training sessions and global capacity two. Add a specific
  management-strength metric/table without changing other roles' accepted
  training math. Today's catalog has no Executive row
  (`packages/balance-config/src/employee-training.ts:1`,
  `packages/balance-config/src/employee-training.ts:42`).
- Desktop Employees/room inspect shows tier, $45/h or selected salary, home,
  current daily task/progress, last completion/expiry, active versus next-tier
  effects and training cost. Four small effect rows state **morale per day**,
  **comfort per visit**, **inspection lead time**, and
  **supplier percentage/actual saved cost**. Office inspect separately explains
  the accepted administration-duration ladder.
- Mobile `apps/player/src/mobile/**` uses the same view model and commands:
  Employees detail has vertically stacked effect cards and the next-tier
  comparison; Executive Office Build/inspect has the same duration/home/cost;
  Services/Inspection shows the active preparation quote; Money shows reduced
  stock/upkeep separately from unchanged payroll. Use readable text, 44px targets,
  local scrolling and safe single-submit controls. No wide desktop-only table,
  hidden supplier effect, unlabeled "efficiency" bonus or second mobile calculation.

## 5. Morale, satisfaction and detailed inspection report card

### Morale and salary

Keep stored employee morale and existing gain/drain/salary behavior compatible.
One effective-morale selector adds the owned Founder's Office modifier once and
clamps to 0-100. Use it for staff display, workforce average, break eligibility,
satisfaction conditions, quitting checks and inspection; distinguish it from
salary normalization (`packages/game-domain/src/staff.ts:752`).

Ownership is not written into stored morale every tick/load. Coffee, praise, gym
and the completed daily Executive award alter ordinary stored morale once;
salary changes retain their current rule and the office modifier remains separate.
Sale removes only the ownership modifier. Existing insolvency drains and quits
still operate (`packages/game-domain/src/reducer.ts:6270`,
`packages/game-domain/src/reducer.ts:10110`). The existing quitting threshold is
<=10 (`packages/balance-config/src/prototype-balance.ts:1181`); the proposed maximum
+10 office modifier still permits quitting at zero stored morale. Test that
boundary and sustained nonpayment. Do not silently increase the passive bonus
beyond it.

### Satisfaction

Keep existing scored encounter history, the ten-sample HUD window, condition
penalties and 0-100 bounds. Garden use and the Executive's accepted comfort
quote contribute once to the actual completed visit. Neither changes old
history at purchase, training, daily renewal or load. The inspection uses its
own full-window sample rather than pretending the HUD's last ten encounters
represent all patients that week
(`packages/game-domain/src/selectors.ts:1381`,
`packages/game-domain/src/selectors.ts:1422`,
`packages/balance-config/src/prototype-balance.ts:1076`).

Unscored service-visitor comfort remains unscored; it requires new visit-experience
instrumentation and does not add fake clinical completions, correct answers,
XP or HUD history. No room or Executive output changes clinical relationships.

### Window, booking and sample

- **Available only after all three Level 5 goals are met** and the durable
  inspection-unlocked record is earned. Domain and both shells reject booking
  before that point. There is no added room/Executive prerequisite. Booking starts
  a free 60-minute administrative preparation clock;
  the completed Executive round may shorten its accepted quote to 57..54 minutes.
  Clinic work continues. Preparation is not a scored part of the inspection.
- States: **locked / ready / preparing / running / completed / incomplete /
  cancelled**. Locked changes to ready only on the earned three-goal acknowledgment. One
  preparation/run at a time. Its quoted end tick and terms survive save/load.
  Cancel gives no completed result, prestige or progression benefit.
- On the prepared start, freeze rule version, run ID, start tick and catalog/
  staff-position denominator definitions from the campaign's balance release.
  The window is **five ten-hour operating days = 3,000 active facility minutes**,
  excluding pause and offline time. Executive work never shortens this window.
- A valid report needs **at least 20 distinct scored-patient completions**, each
  with at least one first submitted clinical answer inside the run and completed
  inside the run. Autonomous APP/service visitors, companions, tutorial helpers
  and employee discussions do not satisfy that patient count. All accepted game
  answers during the window still count in the accuracy category below.
- At the conservative economy's 0.5 scored completions/hour, 50 hours supplies
  about 25, above the 20 minimum. Slow/long-case runs may be **Incomplete**;
  do not fabricate arrivals or silently extend a completed run until it passes.
  Let the player retry. Show provisional results and the sample throughout.
  Only a full-window report meeting that sample is **completed**; its first
  occurrence finishes the game at any score. Incomplete/cancelled runs do not.
- Observe once per active minute, after ordinary domain settlement, with a
  persisted last-observed tick. Count transaction/answer events once by stable
  IDs at their domain acceptance/settlement hook. Pausing, remounting, repeated
  commands and reload must not repeat a minute, answer, posting or benefit.

### Inspection agents: accepted v6f presentation, not scoring inputs

Use the **ten manager-accepted looks `inspector-v6f.001` through `.010`**
(ten identities, 80 approved standing/seated poses). The manager's v6f visual
acceptance authorizes their inspection presentation
(`docs/execplans/character-gapfill-v6-20261007.md:1334`); the earlier worker
handoff's pending flag is superseded, not a request for new character design.
Promote the exact approved stills and authored contacts from that isolated batch.

- Ordinary presentation default: ten onsite agents, one per accepted identity,
  during the active inspection window. Use their directional standing/clipboard
  stills as actors move; no new generated looks, walking rig or hireable role.
- Spread targets across distinct reachable built rooms where possible, using
  existing safe aisle/door approaches and retained-furniture masks. If fewer
  rooms are reachable, distribute holding positions safely in available aisles;
  the score already accounts for missing rooms. Do not invent invisible rooms.
- After a short observation stop, choose the next reachable room. Record an
  editorial five-active-minute target cadence, staggered by agent index; routes
  use actual travel, not teleports through walls. Exact visual cadence is ordinary
  tuning and never changes the fixed inspection clock or category arithmetic.
- Keep actor IDs/routes/target/elapsed presentation in a dedicated inspection
  presentation lane keyed by run ID. Resume/reconstruct once on load or shell
  switch. Use a separate visual seed/round-robin order, never clinical/retail RNG.
- These actors are **presentation-only**: no patient/employee arrays, staff
  positions, wages, morale, customer budgets, encounter pool, care reservations,
  wait counts, litter, cleanliness/equipment wear, answer events or income.
  They do not clean rooms, fill staffing
  gaps, grade a visible room manually or add inspection points.
- Rendering/route failures degrade to a truthful stationary observer and are
  reported as QA defects; they cannot stall scoring or manufacture a result.
  Agents depart/clear on completed, incomplete or cancelled runs without keeping
  a scoring window open. Incomplete/cancelled runs still have no game finish.
- Desktop and mobile show the same team spread/movement, clipboards, scale,
  pose contacts and depth sorting. Map selection labels "Inspection agent" and
  current observed room; it does not open staff hire/pay or patient charts.
  Register assets in both loading/cache paths. Manager QA covers all ten looks,
  1x/4x motion, small phones, door changes, blocked rooms, load/shell switches
  and clinical/retail selection with the visual team on/off.

### Denominators and the meaning of "all"

A perfect report is an optimization goal, not an inspection-unlock or game-finish
prerequisite. The first completed report finishes the game regardless of score.

**Rooms built** means one accessible operational instance of each buildable room
**type** unlocked by Level 5, not the maximum number of copies allowed. Include
the already-owned Front Desk and one Hallway type; retired Imaging Control and
future hospital types are excluded. The current catalog has 28 buildable types
including Hallway; five Level 5 additions produce **33 types**. The 31 types with
real purchase ladders form the upgrade denominator; Front Desk/Hallway have no
ladder (`packages/balance-config/src/prototype-balance.ts:43`,
`packages/balance-config/src/room-upgrades.ts:65`). These counts are a planning
snapshot; derive IDs/counts from the frozen release, not a hard-coded UI total.

**Staff positions** means every physical home slot in one instance of each
required room type, plus slots in extra built instances. Use the existing
role/room capacity rules; absent rooms still contribute their canonical missing
slots. One room of each current type needs 27 slots; the Executive adds one,
for **28 canonical slots** across 16 role types at launch. For example, all four
Reading seats, two recovery nurse slots, two surgeon-office slots, two telehealth
slots, four distinct imaging-room assignments and the four distinct APP home
types must be filled for perfect staffing
(`packages/game-domain/src/room-capacity.ts:6`). The founder is not a hired
employee slot substitute for this aspirational report.

Use a deterministic one-to-one employee/compatible-home-slot assignment. One
employee cannot fill four rooms' slots. Valid installed assignment counts while
busy, on a break or training; a missing/unreachable/incompatible home does not.
Preserve assignment IDs in sampled evidence. Extra built copies add their real
slots; selling cannot remove the baseline one-of-each denominator.

**Room upgrades** includes every owned upgradeable instance, not only the
best-looking copy. Missing types count zero. **Employee training** includes
all canonical/extra home positions and all other hired employees: a missing
position or untrained extra employee cannot disappear from the denominator.
Do not get a perfect score by selling the weakest room/employee at the last tick,
excluding empty positions, averaging only present roles or changing the catalog
mid-run. Time-averaged structural categories require preparation before the week
for a true 100; improvements during it still improve the result.

### Category formulas, current data and improvement hints

All scores are 0-100; weights total **100%**. Let:

- `avg_t` be the mean over the 3,000 observed active minutes.
- `clip(x) = min(1, max(0, x))`.
- `B` be the frozen buildable type set (33 at the planned launch), and `U` its
  upgradeable subset (31).
- `P(t)` be baseline physical staff positions plus those in extra built rooms,
  each matched to at most one valid installed employee.
- Empty/missing structural members contribute zero. Do not omit them and
  renormalize the weights. A valid activity sample is required before a score
  can become prestige.
- `expensePostings` counts positive charged upkeep/payroll postings during the
  run; `paidPostings` counts only those fully paid. A partial payment is not a
  fully paid bill. Stock costs are paid on their accepted transaction and are
  included once in operating net, not again as hourly operating expenses.

| Category | Weight | Exact editorial formula for its 0-100 score | Current data source and new instrumentation | How to improve |
| --- | --- | --- | --- | --- |
| Cleanliness | 10% | `100 x cleanRoomMinutes / observedRoomMinutes`, clean when room cleanliness >= the existing clean-room threshold 80. Sample all placed rooms with cleanliness; raw mean/minimum also shown. | `rooms[].cleanliness` (legacy fallback 100 only where current rules use it), existing cleaning/EVS and threshold; accumulate room-minutes during the run. `packages/game-domain/src/types.ts:1215`, `packages/game-domain/src/reducer.ts:2872`, `packages/balance-config/src/prototype-balance.ts:1064`. | Hire/assign EVS, preserve cleaning access, clear litter and use existing cleaning/bathroom upgrades. "80" is game cleanliness, not a sanitation standard. |
| Rooms built / usable | 10% | `100 x avg_t(sum_b I(at least one accessible operational instance of b) / size(B))`. Front Desk/Hallway count by type once. | Frozen room definitions/unlocks/buildability, `rooms`, `doors`, existing operational/access selectors; new per-type minute counts. `packages/balance-config/src/prototype-balance.ts:43`, `packages/game-domain/src/selectors.ts:330`, `packages/game-domain/src/selectors.ts:352`. | Build missing room types and connect usable doors; a room with a blocked route is listed with its reason. Extra duplicates cannot replace missing types. |
| Room upgrades | 10% | Per type b in U: zero if absent; otherwise mean over all its placed instances of `clip((level-1)/(maximumLevel-1))`. Score `100 x avg_t(mean over U)`. | `rooms[].upgradeLevel`, current accepted catalog/maxima; new type/tier minute accumulators. `packages/game-domain/src/types.ts:1222`, `packages/balance-config/src/room-upgrades.ts:65`. | Buy the four accepted upgrades for every owned upgradeable room. One tier-5 copy does not hide a tier-1 copy. |
| Staffing coverage | 10% | `100 x avg_t(number of distinctly filled valid positions / size(P(t)))`. Missing baseline rooms retain missing positions; newly built extra rooms add slots. | `employees[].staffRoleDefinitionId/homeRoomInstanceId`, `rooms/doors`, capacity/role compatibility. Derive/freeze baseline slot table and sample matching; no new clinical staffing ratio. `packages/game-domain/src/types.ts:1307`, `packages/game-domain/src/room-capacity.ts:6`. | Fill every displayed physical position and give each employee a compatible reachable home. Founder fallback or a duplicate role elsewhere is not another hired slot. |
| Employee training | 10% | For each position, matched employee contributes `clip((trainingLevel-1)/4)`, missing =0. Unmatched hired employees add their own terms/denominator. Score `100 x avg_t(mean of those terms)`. | `employees[].trainingLevel/training`, same position matching; only earned current tier counts, not queued target tier. New run sums. `packages/game-domain/src/types.ts:1307`, `packages/game-domain/src/employee-training.ts:42`. | Hire missing staff and complete all four training purchases for every employee before a perfect-score attempt. In-progress training is not already tier 5. |
| Staff morale | 10% | `avg_t(mean effective morale of all employed staff)`; zero for a minute with no staff. | Stored morale plus the common ownership/effect selector, salary and actual support awards; new employee-count/mean observations. `packages/game-domain/src/staff.ts:752`, `packages/game-domain/src/types.ts:1307`. | Pay wages, keep ownership/support effects honest, complete breaks/management rounds and use praise/coffee. For 100, every sampled staff mean must be 100; firing does not rewrite earlier samples. |
| Patient satisfaction | 10% | Mean final satisfaction of scored encounters that end completed or walk out during the run, with actual current visit effects. Do not use only the HUD's last ten. | `encounters[].finalPatientSatisfaction/resolvedAtFacilityTick/resolutionReason`; accumulate on settlement/walkout before retirement. `packages/game-domain/src/types.ts:1095`, `packages/game-domain/src/selectors.ts:1381`. | Correct game answers, prompt attention, clean/access-ready facilities, appropriate existing amenities and the mild actual Executive/garden comfort effects. Walkouts remain in the sample. |
| Wait / flow | 5% | `100 x [0.5 x (1 - overdueQueueMinutes/queueMinutes) + 0.5 x completed/(completed+walkouts)]`. A legitimate zero queue-minute denominator gives the first term 1 only with the required real-patient sample. | New per-minute sums from `idleWaitingSinceTick` and `checkInWaitingSinceTick`; overdue uses existing 20-minute idle / 60-minute unstaffed-check-in grace. Resolved counts use encounter timestamps/reasons. `packages/game-domain/src/types.ts:1071`, `packages/game-domain/src/types.ts:1092`, `packages/balance-config/src/prototype-balance.ts:1055`, `packages/balance-config/src/prototype-balance.ts:1079`. | Staff check-in, keep paths/seats/care capacity working and answer ready questions. Exclude prescribed test/procedure processing, necessary travel and external-result clocks from avoidable queue time. No new clinical time target. |
| Finances | 5% | `100 x [0.5 x paidPostings/expensePostings + 0.5 x clip(operatingNet/(0.05 x operatingGross))]`. The profit component reaches 100 at >=5% operating margin. Zero positive gross/postings is ineligible for that component, not 100. | Existing settlements, service receipts and `totalOperatingExpenses`; new structured charged/paid posting observations, not parsed event prose. Gross includes actual settlement/service receipts; net subtracts stock and charged operating costs, including $45 Executive pay. Exclude construction/hiring/training/upgrades, sale proceeds/grants and opening reserves. `packages/game-domain/src/types.ts:662`, `packages/game-domain/src/types.ts:677`, `packages/game-domain/src/types.ts:1715`, `packages/game-domain/src/reducer.ts:6270`. | Keep all bills paid, expand real profitable services within demand, avoid idle excess payroll, maintain stock cash and inspect actual contribution/costs. Supplier savings reduce actual eligible expenses after a qualified round. |
| Game clinical-answer accuracy | 20% | `100 x correctFirstSubmissions / (allFirstSubmissions + presentedButUnansweredAtEnd)`. Count clinic and employee-learning questions presented/answered in the active window, including answers in cases later unfinished or walked out. | `AnswerRecord.correct/answeredAtFacilityTick`, employee discussion answer records and learning reviews; new domain-side presented-node IDs/once-only answer counters before retirement. `packages/game-domain/src/types.ts:418`, `packages/game-domain/src/reducer.ts:3437`, `packages/game-domain/src/reducer.ts:4231`. | Use existing review/explanations and answer every presented game question correctly. Corrected-forward paths, later answers, repeat commands or retiring the case cannot erase the first wrong answer. This compares to stored game keys, not an assessment of real clinical competence. |

**Flow classification:** Each eligible onsite scored patient contributes at most
one queue-minute per tick. The domain's actual waiting/check-in state determines
eligibility; an open chart, test processing or a travel animation alone is not a
queue. Count overdue once if either relevant timer exceeds its existing grace.
Report both raw queue minutes and walkout counts. Do not infer total lifetime
wait by subtracting arrival from settlement: that includes clinical processing
the player cannot shorten.

**Accuracy capture:** Record unique presented question/encounter or discussion
node IDs at domain presentation/open/advance events, not a browser render callback.
At run start, seed the set with already presented/actionable unanswered nodes;
they remain inspection questions while the window is active. Track their actual
first answers or unanswered end state without replaying presentation/FSRS events.
Closing a chart does not unpresent a question; shell switching/reload does not
add a duplicate. An accepted first response is correct or wrong by the existing
frozen key. Keep wrong answers in the denominator even when their patient later
leaves or the full encounter is retired. At the end, a question presented within
the run with no accepted answer contributes an unanswered term. A case's
unpresented future nodes do not count as answered questions. Existing FSRS histories
are not rewritten by the inspector. Autonomous APP work provides no synthetic
answer stream.

**Finances capture:** Sum actual settlement net cash and service-receipt net cash,
then subtract full charged operating expenses. Gross and stock remain separately
visible. Use the actual paid/shortfall cents at each posting hook. Capital spending
may lower cash/liquidity and is shown separately, but cannot be counted as operating
income or a question penalty. Existing receipt retirement summaries do not hold
all report-card data; instrument the running inspection once at the domain event,
rather than reconstructing a week from possibly retired objects.

### Total score, perfect score and prestige arithmetic

For category scores C_i and the table weights w_i:
`rawTotal = sum(w_i x C_i) / 100`. Keep raw fractions for calculation and floor
the final display to two decimals; do not round 99.995 up to a perfect 100.

Example category scores, in table order:
`90, 80, 75, 85, 70, 90, 95, 80, 90, 90`.
Weighted points:
`9 + 8 + 7.5 + 8.5 + 7 + 9 + 9.5 + 4 + 4.5 + 18 = 85.00`.
The report shows each fraction, category score, weight and points so the player
can reproduce that sum.

Award an exact **100** only if the valid full-window result has every category
at 100 and the structural checks confirm all 33 type requirements usable, every
owned ladder room maxed, every required physical position filled, every hired
employee max-trained, and every presented/answered game question correct with
none unanswered. A missing type/position or one wrong answer prevents 100 even
if a rounded category label looks full. No Executive or decoration directly
adds score. One of each type suffices; buying every allowed duplicate is not the
meaning of "all rooms."

Recognition remains an editorial reporting label: <80 **Improving**,
80..<95 **Prestige**, 95..<100 **Distinguished**, exact 100 **Perfect**.
There is no inspection **score threshold**. A first completed inspection is
required to finish the game. Keep immutable latest
and best valid reports; the highest unrounded weighted total is the campaign's
prestige, displayed with the same two-decimal floor. Incomplete/cancelled
runs have no recognition/score that can overwrite a valid best. Equal best totals
retain the earlier best report; later lower results never erase it. Reattempt
without a reset, hidden fee or forced cooldown whenever no run/preparation is active.

### Report-card UI on desktop and mobile

- Desktop Goals shows inspection locked until the 2,000 XP / >90 satisfaction /
  >=85 average morale goals are earned; afterward it exposes booking. A Manage/Quality/Inspection view opens booking,
  preparation, active progress, latest/best history and report card. During the
  run show elapsed/3,000 minutes and qualifying patients/20, provisional category
  values and explicit missing-sample status.
- Desktop report rows show category, raw numerator/denominator or mean, formula,
  weight, earned weighted points, maximum points, status and the actionable
  improvement hint. Expand structural rows to list every missing room, tier or
  physical staff/training slot, plus access problems. Expand accuracy to existing
  incorrect/unanswered question review links without altering frozen content.
- Mobile uses the **same locked/earned-ready states, inspection view model and
  commands**, with a dedicated
  stacked Inspection screen in More/Manage and a Goals entry. Show total/latest/
  best at the top, compact category bars and weighted points, then expandable
  arithmetic/hints/missing-item lists. No horizontal ten-column table. Keep booking,
  cancel and retry visible with confirmation only for discarding a running run.
  Do not pause/reset scoring differently on the phone; shared Manage pause policy
  applies equally.
- Both expose the first-inspection finish page described in section 2, including
  congratulations, the complete report card, Keep playing and Start new campaign.
  Repeat reports retain the best prestige without reopening the victory page.
- Both display supplier savings as lowered costs, not earned points/cash.
  The Executive detail explains preparation time saved; report rules/weights/
  denominators never depend on which shell opened it. Show clinical review status
  where existing question review requires it. A prestige badge is a game result,
  not real accreditation, licensing or approval of the prototype's clinical keys.

Persist the earned inspection-unlocked and first-completed/game-finished records,
finish-page acknowledgment and bounded minute/event accumulators, rule/catalog version, sample counts,
raw category totals, required-type/slot IDs, presented/answered IDs needed for
the active run, and immutable result snapshots. Preserve these through
retirement, daily task renewal, pause/load and shell changes. Do not replay the
whole campaign or fetch web/AI content to generate a report.

Existing surgeon-led QI remains surgeon-led and optional. Its actual receipt/
completion can appear as another achievement; it is neither inspection
preparation by the Executive nor clinician approval of teaching.

## 6. Economy under accepted option B

### Funding the $45/hour Executive honestly

Option B remains binding (`docs/design/room-economy-audit-20261008.md:348`).
The Executive is optional and highest-paid nonclinical support; it is not a
completion requirement. Do not cut its salary back to $10, increase medical fees,
pretend morale is revenue or rely on the small supplier effect to pay $45.

The old narrow Level 4 result is
`$204.125 gross - $2.625 stock - $170 operating = +$31.50/hour`
(`tools/economy-audit/level-four-results-20261009.json:89`). Its fixture suppresses
routine scored arrivals and the measurement loop only ticks; founder answers/
teaching income were **not** included
(`tests/fixtures/level-four-rooms.ts:33`,
`tools/economy-audit/level-four-simulation.ts:58`). Read-only fixture inspection
gave $146 payroll + $24 room upkeep = $170. This partial roster cannot by itself
support all optional prestige rooms and a $45 Executive: supplier savings must
not conceal that limitation.

Use a funded normal reference that adds an existing operational Reading Room
and one default untrained radiologist. Outside reading is an existing Level 3
income stream, not an Executive output: $5/read, baseline 5 active minutes/read
(`packages/balance-config/src/service-income-catalog.ts:18`). The earlier audit
budgeted nine reads/hour, allowing 15 minutes of other work
(`docs/design/room-economy-audit-20261008.md:35`).
Conservatively that is `9 x $5 - $18 salary - $6 upkeep = +$21/hour`.
Adding it to the narrow fixture, before supplier terms:
`$31.50 + $21 + $4.50 gift contribution - $5 new upkeep - $45 Executive = +$7/hour`.
The Reading Room is a funding option, not a new progression gate.

A **read-only in-memory current-runtime reference** was executed on 2026-10-10:
same existing early-Level-4 factory, one additional Reading Room/radiologist,
seed `level-five-plan-reader-reference-20261010`, four warmup and 48 measured
hours. No balance overrides, code edits, new systems, owner storage, scored
arrivals or founder answers; XP stayed zero. It settled 533 outside reads,
$2,665 gross, and retained eight employees. Actual total means:

| Current funded reference, no Level 5 runtime | Dollars/game hour |
| --- | --- |
| Gross from settled existing service/retail/read receipts | 262.833333 |
| Stock/consumption cost | 2.729167 |
| Existing room upkeep | 30.000000 |
| Existing payroll | 164.000000 |
| Total charged operating cost | 194.000000 |
| Net cash change | **66.104167** |

`262.833333... - 2.729166... - 30 - 164 = 66.104166...`.
Tables round to six decimals; calculations use the underlying unrounded totals.
This is one current Level 4 reference, **not a measured Level 5 launch or a
paired causal claim against a different seed's $31.50 result**. M8 must verify
the actual new cluster on paired seeds and publish a dated Level 5 artifact.
The current reference is a reproducible planning datum, not a promise about an
owner campaign or every partial clinic.

### Proposed construction, wages and base functions

All new numerical values remain **editorial game values**. Preserve approved
room ladders. No added upkeep per prestige upgrade, automatic salary raise or
unlock cash grant.

| Item | Build / hire | Upkeep or wage/hour | Base economic role |
| --- | --- | --- | --- |
| Founder's Office, 3x3 | $1,200 | $1 | Ownership morale; funded support, no fee |
| Executive Office, 3x2 | $2,000 | $1 | Actual daily management round/preparation/comfort; funded support, no fee |
| Executive, maximum one | $600 hire | **$45** | Four mild jobs including suppliers; wages continue while idle/training |
| Gift Shop, 3x3 | $800 | $1 | Normal gift $15/$6 stock; premium $25/$12; real fulfilled purchases |
| Indoor Garden, 4x4 | $800 | $1 | Actual-use satisfaction support, no fee |
| Staff Gym, 4x4 | $1,000 | $1 | Completed-break morale support, no fee |

Rooms total **$5,800**, plus $600 hire = **$6,400**, excluding ordinary access/
hallway construction. All five plus Executive add **$50/hour before savings**:
$5 room upkeep + $45 payroll. A normal shop at 0.5 fulfilled $15 gifts/hour adds
$7.50 gross and $3 stock, or $4.50 contribution before its upkeep.
The four support rooms plus Executive cost $49/hour; account for that once,
not as five invented benefit-to-cash payments
(`docs/design/room-economy-audit-20261008.md:47`).

### Normal-demand arithmetic with mild supplier terms

Use the measured funded current reference above, plus one normal gift every
120 minutes per facility. This is the unchanged proposed dedicated shop stream;
actual travel, queue, stock cash and quote affordability still limit fulfillment.

Without supplier negotiation:
`66.104167 + 7.50 - 3 - 5 - 45 = +$20.604167/hour`.

Equivalent total worksheet:
`$270.333333 gross - $5.729167 stock - $35 upkeep - $209 payroll = +$20.604167/hour`.

For a tier-1 Executive, supplier terms are 1%. Budget conservatively that **90%
of eligible quoted/accrued cost** receives terms after the daily round, allowing
walking, work, missed quotes and day renewal. This is an editorial assumption,
not a tested uptime claim. Effective budget reduction is `0.90 x 1% = 0.9%`.
Eligible cost excludes all payroll:
`$35 upkeep + $5.729167 stock = $40.729167/hour`.

Savings:
`0.009 x 40.729167 = $0.366563/hour`.

Net:
`270.333333 - (5.729167 x 0.991) - (35 x 0.991) - 209`
`= 270.333333 - 5.677604 - 34.685 - 209 = **+$20.970729/hour**`.

At tier 5, proposed 2% terms under the same 90% assumption save
`0.018 x 40.729167 = $0.733125/hour`, for **+$21.337292/hour**.
Training doubles a small cost reduction, not the $209 wage bill or clinic income.
With no qualified-round supplier terms, the funded normal reference remains
+$20.60/hour; qualified suppliers add about $0.37-$0.73, so one Executive never becomes
the main source of profit.

Real quote/posting rounding, supplier eligibility and changed visit behavior
will differ from this mean worksheet. M8 must report actual gross/stock/upkeep/
payroll/saved cost and full ledger/cash reconciliation. Do not deduct savings
and then add a second "supplier income" line.

### Active-learning alternative and the unfunded case

The current settlement formula for an ordinary one-question visit is
`$20 + $15 x answers + $65 x correct answers`
(`packages/balance-config/src/prototype-balance.ts:1243`,
`packages/game-domain/src/reducer.ts:2748`). At 80% correct, one completed
one-question visit averages `20 + 15 + 65 x 0.8 = $87`. A conservative
0.5 completions/hour adds **$43.50/hour**, without counting extra diagnostic
income or multi-question payouts. This is a game-play scenario, not a measured
founder loop or an exact clinical probability.

On the narrow $31.50 fixture, that active-learning input plus full prestige
cluster gives `31.50 + 43.50 + 4.50 - 5 - 45 = +$29.50/hour`,
before supplier terms. Eligible upkeep/stock there are
`$29 + $5.625 = $34.625`; 90%-qualified tier-1 terms add $0.311625/hour,
giving **+$29.811625/hour**.

With **no reader, no scored completions and the same narrow autonomous roster**,
the full cluster is `31.50 + 4.50 - 5 - 45 = -$14/hour`, approximately
-$13.688375 with that small supplier saving. Do not call it profitable.
Without other changes, teaching break-even is about
`13.688375 / 87 = 0.15734` completed one-question visits/hour, one per 6.36
game hours. Better use an already-funded clinic/Reading income before hiring;
do not force encounters or enlarge emergency payments to cover this optional role.

The earlier full option B Level 3 model also had +$491.73/hour normal and
+$101.49/hour slow, but it is a broader analytical roster, not the measured
fixture above (`docs/design/room-economy-audit-20261008.md:248`). Do not add its
income to either reference or claim every owner campaign has that margin.

### Effect of the reconciled XP/inspection sequence

The XP target changes goal-phase duration, not per-answer rewards, hourly fees,
salary or room upkeep. At each unchanged XP rate, the new duration is
`2,000 / 3,000 = two-thirds` of the superseded planning estimate. No bonus,
income removal or operating-cost jump occurs when inspection unlocks or the game
finishes; ordinary play and receipts continue after **Keep playing**.

For the 80%-correct one-question scenario, 2,000 XP is `2,000 / 8.4 = 238.0952`
first answers. If those visits all settle, expected teaching receipts are
`238.0952 x $87 = $20,714.29`; these are earned visit payments, not an unlock
grant. At 0.8 completions/hour that goal phase takes 297.62 game hours.
Baseline preparation + the first inspection add 51 active hours: the same rate
supplies about `0.8 x 50 = 40` inspection-window completions, above the 20
minimum. Continued answers earn their ordinary XP/cash; neither is reset on finish.

The funded full-cluster hourly worksheet therefore stays **+$20.970729 at
tier-1 supplier terms / +$21.337292 at tier 5**, using the stated conservative
90% cost-qualification assumption. A missed-round/no-qualified-terms control
stays **+$20.604167/hour**. Actual stock quotes/accrual/behavior must be measured
in M8. These and all pacing/cost numbers are **editorial game values**.

### Gift Shop unit economics

Accepted gift fees/stock and +6%-of-base-gross ladder stay unchanged. Below,
supplier terms are deliberately omitted so its base business stands on its own.

| Shop tier | Normal gift gross | Stock/sale | Contribution/sale | At 0.5 sales/hour, net after $1 upkeep |
| --- | --- | --- | --- | --- |
| 1 | $15.00 | $6.00 | $9.00 | $3.50 |
| 2 | $15.90 | $6.00 | $9.90 | $3.95 |
| 3 | $16.80 | $6.00 | $10.80 | $4.40 |
| 4 | $17.70 | $6.00 | $11.70 | $4.85 |
| 5 | $18.60 | $6.00 | $12.60 | $5.30 |

Base break-even: `$1 / ($15-$6) = 0.1111 sales/hour`, about one sale/nine
game hours. Half normal gift demand gives `0.25 x $9 - $1 = +$1.25/hour`;
zero demand loses $1/hour before applicable technical-outage relief.
Base build payback is `800/3.5 = 228.57 hours`; first upgrade `200/0.45 =
444.44 hours`; all four `1550/1.8 = 861.11 hours`. These are optional prestige
investments, not fast-income guarantees. Preserve the accepted ladder.

The existing shared retail generator alone does not prove 0.5 fulfilled gift
sales/hour (`packages/game-domain/src/retail-operations.ts:488`).
M6 must implement/measure the proposed independent per-facility stream and final
quote budgets, or recompute these figures from its approved actual demand.
Neither copies, upgrades nor reload may multiply customer opportunities.

### Avoiding a cliff and acceptance requirements

- All rooms/Executive are optional for Level 5 completion. Unlock does not
  autoplace, auto-hire, charge upkeep, schedule training or start inspection.
  A partial underfunded clinic can finish learning goals before buying support.
- Put funded actual service contribution, $45 wage, projected total cash flow and
  the small cost reduction on desktop and mobile hire/finance screens. A room
  quote alone must not suggest the Executive pays for itself through suppliers.
- Under the funded reader reference, halving gift demand only changes net by
  $2.25/hour before savings; do not equate that with halving all service demand.
  Measure slow overall demand, reader interruption and the first-income cash
  trough separately. The earlier B audit itself had a losing slow endoscopy
  outage (`docs/design/room-economy-audit-20261008.md:165`).
- Keep the proposed $500 remaining-cash reserve advisory, not a grant or new
  spending gate. Preserve wages/contracts and option B rebase version; new
  Executive does not rebase existing staff again. No larger emergency-consult
  subsidy or hidden increase in diagnostic/clinical fees.
- Supplier terms modify new stock quotes once and current room
  accrual once, after existing reductions. Freeze accepted quotes; expense
  posting/cents remain authoritative. Support upkeep/payroll stays due during
  inactivity. Gift technical-outage relief keeps existing 60-minute/20% policy;
  empty demand, stock shortage, busyness and a paused task are not technical
  nonoperation.
- M8 must exercise every implemented function and publish paired real runs:
  funded passive-reader reference and active scored-play reference, with/without
  $45 Executive and with qualified/missed-round supplier terms, actual normal/slow demand, cold start,
  training/breaks and outages. Full default optional cluster must be positive
  at normal funded demand even when a management round has not qualified supplier terms; the base shop must have
  nonnegative measured normal net. No default balance or XP overrides to force
  success. Report the unfunded negative scenario honestly.

## 7. Clinical content: no new batch required

Recommend **no required Level 5 clinical authoring work**. Level 5 adds no setting,
so current eligible outpatient/ASC encounters, prior clinical release gates and
the existing frozen encounter/history model can supply normal play. Raising a
mechanical facility level must not automatically widen acuity, clinical meaning,
difficulty or diagnosis weights.

An end-game inspection uses existing operational cleanliness, room/tier/staff/
training/morale/satisfaction/wait/finance inputs and already stored first-answer
correctness, with new bounded observation counters. Existing receipt-backed QI
may appear as an optional achievement. Neither requires a new diagnosis, question variant,
management claim or clinician-approved explanation. Prestige must not be called
clinical competence or real safety certification.

Do not make "mastery" a mandatory shorthand for XP, answer count or inspection.
The canonical mastery definition has distinct cross-date/variant/FSRS criteria
(`CANONICAL_DESIGN.md:374`). A later mastery view needs its own honest existing
history evaluation and campaign-pinned denominator. No catalog exhaustion,
all-concept mastery or new question batch is required. Supplemental new concepts
cannot become new inspection, progression or victory requirements
(`CANONICAL_DESIGN.md:610`).

If the owner later requests optional end-game questions or inspection teaching,
create a separate content milestone with atomic independently authored evidence
claims, adequate permitted sources, stable IDs/versions and
`needs_clinician_review`. Do not publish or promote it by passing tests. No
placeholder bibliography, paywalled snippet, proprietary corpus or new exact
clinical value belongs in this launch plan (`AGENTS.md:5`, `AGENTS.md:45`,
`AGENTS.md:51`).

## 8. Level 4 lessons to carry into implementation

| Evidence from Level 4 | Required Level 5 response |
| --- | --- |
| Native approved art/proof and later runtime integration were separate milestones; approval alone did not create playable rooms (`docs/execplans/level4-launch-plan-20261008.md:1261`). | Preserve all approved room designs; verify the Gym corner correction, then integrate the exact approved contacts/art; test real runtime paths/contacts, all shells and every tier afterward. |
| Manager browser QA found a renderer freeze after tests: paired path indices no longer matched samples after duplicate sync nodes were removed (`docs/execplans/level4-launch-plan-20261008.md:2636`). | Preserve logical route/sample indices, guard empty/malformed segments and continuously render actual task/retail routes at 1x/4x, then reload mid-route. Unit tests cannot substitute for browser QA. |
| Initial Services intentions exceeded the actual wound procedure/supply scope (`docs/execplans/level4-launch-plan-20261008.md:2713`). | Explain only implemented Executive/shop/support functions. Do not advertise inspection, training or clinical services while their handlers are absent. |
| Editorial answer-choice guards caught uniquely long keys and required real wording corrections (`docs/execplans/level4-launch-plan-20261008.md:3073`, `docs/execplans/level4-launch-plan-20261008.md:3458`). | Run unchanged clinical regression guards; no new clinical content is needed. If separate content is later authorized, fix wording rather than weakening guards or changing stable concepts. |
| Earned encounter witnesses/terminal acknowledgments needed durable state; roster availability meant installed compatible homes, not an idle-only moment (`docs/execplans/level4-launch-plan-20261008.md:3750`). | Preserve Level 4 evidence and add separate Level 5/inspection records; distinguish valid staffing coverage from task busyness/training. No replayed reward or earned-goal disappearance after receipt retirement. |
| Manager QA found completion text repeated across four surfaces, plus narrow-width overlay problems (`docs/execplans/level4-launch-plan-20261008.md:4145`). | One Goals completion and one Alerts milestone. Inspect scrolling/normal flow on desktop and every phone width after each UI milestone. |
| M9's schema-9 save was a synthetic legacy fixture, not a real historical owner save (`docs/execplans/level4-launch-plan-20261008.md:4348`). | Label synthetic fixtures honestly; preserve owner storage. Add representative older-schema and pre-Level-5 saves, migrations and real mid-task snapshots. Manager may review an authorized real copy separately. |
| DEFECT-M9-1: load reset valid overdue idle deadlines; DEFECT-M9-2: APP activity changed scored case identity through the active encounter pool, despite equal arrival times/counts (`docs/execplans/level4-launch-plan-20261008.md:4401`, `docs/execplans/level4-launch-plan-20261008.md:4429`). | Keep existing defects identified; no silent broad fix in this lane. New tasks must retain valid overdue/accepted clocks. Compare eligible/frozen case identity, not merely arrival counts, when adding gift/garden demand. Report unresolved differences precisely. |
| The original planned Level 4 e2e file was not actually authored; final handback acknowledged that gap (`docs/execplans/level4-launch-plan-20261008.md:5170`). | Create the proposed Level 5 e2e/QA fixtures in an owned milestone before citing their commands as passed. A path in this plan is not test evidence. |
| Root checks invoke Git boundaries and browser/default Vitest pools exceed worker sandbox permissions (`package.json:16`, `package.json:19`, `AGENTS.md:214`). | Workers use direct workspace tests with threads and no-Git build/type checks; manager runs boundary, aggregate and browser checks. Preserve the manager's existing boundary-buffer correction. |
| Mobile MB1-MB8 exposed framing, modal, double-submit, touch and responsive issues during manager QA (`docs/execplans/mobile-version-20261009.md:23`). | One shared session/domain command path; mobile and desktop parity on every new feature, including safe repeated taps, paused Manage behavior, asset loading and inspection controls. |

## 9. Bounded runtime milestones, dependencies and ownership

**M0 is resolved** by the binding October 11 follow-up. Mockup design is complete;
this table starts with runtime M1. Preserve the five approved room designs and
two Executive looks; inspector-v6f art is manager-accepted. Gym's corner condition
is now met and accepted in its actual receipt. Promote the corrected version
without reopening the owner's accepted design.

Every brief states explicit files/ownership, this plan, requirements/non-goals,
clinical rules, acceptance criteria and exact validation commands. Reserve shared
catalog/schema/reducer/persistence/selector/session/art/mobile files exclusively:
one write-capable worker per shared file and normally one writer at a time.
Workers preserve concurrent owner/Claude work and do not spawn, commit, push,
publish or install. The manager inspects actual diffs/command evidence and runs
**browser QA after every milestone and sequential submilestone**, on desktop and
mobile. A summary or blocked browser attempt is not acceptance. Runtime work
below is planned; approved mockups and stills do not establish runtime behavior.

| Milestone | Bounded lane / ownership for its brief | Dependencies | Acceptance and validation |
| --- | --- | --- | --- |
| M1. Runtime state/schema foundation and isolated QA | One domain/schema worker owns balance schema, domain types/persistence, versioned daily-management/inspection-unlocked/game-finished defaults, fixtures and one owned QA entry/helper | M0 reconciled; approved design contracts | Old Level 0-4 saves round-trip; no invented witnesses/expenses. Separate goals-met/unlock, first completed report and finish-page acknowledgment. States include locked, ready, preparing, running, completed, incomplete, cancelled. QA fixtures cover pre-goal Level 5, eligible partial clinic/no Executive, management round, actor presentation, reports and finish page. Ordinary cap stays 4. V1/V2/V5; manager both-shell load/reload/default QA. |
| M2. Approved room art and base catalog | One worker owns promoted room art/manifests/presentations, definitions/caps/prices, home/access capacity, map hooks and mobile asset/thumbnail registry | M1; all five accepted room receipts | Founder 3x3/five exact looks; Executive 3x2/ten doors with chairs/sitters retained for N2/S2; Gift 3x3; Garden/Gym 4x4, fixed appearances. One of each prestige type. Required furniture/contacts match individual approval masks. Build/inspect/sell and truthful upgrade state in both shells; no room-building unlock goal. V1/V2/V4/V5/V6/V9; manager placement/doors/backing/routes/occlusion/mobile assets. |
| M3. Ownership morale and garden/gym use | One worker owns support logic and serial staff/selector/reducer/persistence/upgrade/shared-view/both-shell edits | M2 | Founder modifier once/reversible on sale, compatible payroll/salary/coffee/praise. Actual garden comfort and gym break/cooldown/care priority, frozen tiers/reservations. Only implemented ladders become current. V1/V2/V4/V5; manager both-shell use/interruption/reload/sale/clamps/nonpayment. |
| M4. Executive four duties, training and $45 pay | One worker owns role/home/capacity/training/identity catalog, daily-management module, accepted stock/upkeep/comfort/preparation terms, serial domain/session/desktop/mobile employee/finance hooks | M2, M3 | One Executive; approved future-roster20-v5.003/.004 looks; $45/h default/$35-$65 steps. Real daily work and all four mild outputs scale through tiers 1-5. Office ladder shortens administration only. Supplier 1-2% once after existing reductions, excluding wages/capital/fees; no optional approval branch. Hire/assign/train/interrupt/expire/fire/sell/load work and all four effects are visible on both shells. V1/V2/V4/V5/V6; manager daily rollover, current/accepted/next-tier terms and ledger QA. |
| M5. Gift retail and per-facility demand | One worker owns gift capability/demand/retail, ladder activation, affordability/stock/frozen supplier quote integration and receipt/finance/shared-view/both Services shells | M2, M4 | Real 120-minute gift opportunity, final quote budgets, path/queue/stock cash and one receipt. No multiplication by tier/reload; Executive not required to shop. Base shop profitable at measured normal demand even without qualified supplier terms. Compare exact scored case identity/arrival effects honestly. V1/V2/V4/V5/V6; manager normal/premium/founder/block/sale/quote QA. |
| M6. Three-goal inspection unlock and progression | One worker owns stage 5 goal data, ordinary Level 4 transition, durable goals-met/unlock record, selectors/alerts/shared view and both Goals screens | M1, M3-M5 | Exactly 2,000 current-level XP, satisfaction >90, nonempty average effective morale >=85; simultaneous fulfillment unlocks inspection once. No room/Executive/inspection gate to that unlock. Before it, domain booking rejects and both screens show Locked; after it eligibility persists. No victory page at goal completion, no XP double award/reset and no Level 6. V1/V2/V4/V5/V6; manager all boundaries/old saves/messages/desktop-phone parity. |
| M7a. Inspection evidence/scoring and first game finish | One worker owns inspection module/state/booking commands, observed minute/event hooks, bounded accumulators/result snapshots, game-finished record and serial domain/persistence/selectors/view data | M4-M6 | Three-goal booking gate; frozen 60-minute preparation quote; full 3,000-minute run and >=20 qualifying completions. Ten formulas/100% weights, correct type/slot/first-answer denominators, retirement-safe ledger evidence, best prestige. First valid completed report at any score finishes game once; Incomplete/cancel does not. V1/V2/V4/V5 plus focused report/clock/save tests; manager gated/ready/preparing/running/completed/incomplete/retry QA. |
| M7b. Accepted inspector stills and moving presentation | One worker owns inspector-v6f promotion/catalog/assets, dedicated nonclinical actor routes/presentation state, both map renderers and mobile asset cache; shared files serially reserved | M2, M7a; v6f manager acceptance recorded | All ten accepted looks/80 poses registered for inspection presentation only. Team spreads across reachable rooms and moves during the window, with safe paths/depth sorting and resume/cleanup. No wages/staff slots/patient pool/queues/reservations/answers/income/score. V2/V4/V5/V6 and scoped existing/new read-only still/contact validators; manager all-look movement at 1x/4x, small phones, door changes and visual-team-on/off selection comparisons. |
| M7c. Report-card and finished-game pages in both shells | One player/UI worker owns shared report/finish models and commands, desktop/mobile Inspection and finish pages, current/best displays, campaign-start wiring and focused UI tests | M7a, M7b | Locked-before-goals/Book-after-goals parity, full ten-category arithmetic/hints/sample status. First completed report opens Congratulations + report card + Keep playing + Start new campaign. Keep playing preserves campaign/best; New campaign uses explicit existing confirmation/new-seed/fresh-history contract. Durable page dismissal; repeats open normal reports. Candidate copy preview, keyboard/touch/44px/scrolling/pause/reload/shell-switch safety. V4/V5/V6; manager complete desktop/mobile action-flow QA. |
| M8. Actual XP, option B economy and long runs | One validation/balance worker owns new dated deterministic reducer audit/report and bounded exclusive fixes agreed by manager | M3-M7c | At least three paired economic seeds and extended actual goal/first-inspection pacing runs; no 48-hour reference presented as a full-game run. Funded reader/passive and active-learning normal references with $45 Executive; qualified versus missed-round supplier terms, slow/unfunded/outage/startup cases. Positive normal full optional cluster and Gift base contribution even with no qualified terms. Reconcile actual ledger/report/window/retirement, no balance or XP overrides. V1-V6/V10; manager evidence review and both-shell Money/Goals/Inspection QA. |
| M9. Integration and regression fixes | One worker owns actual Level 5 e2e fixtures and agreed bounded fixes; larger shared-file corrections return to exclusive briefs. Manager owns aggregate/default/browser acceptance | M8 | All scenarios below: pre-goal booking rejection, 1,999/2,000 boundaries, first valid low-score finish, incomplete/cancel, Keep playing/New campaign, repeat best, ten actors, all four duties, approved door/footprint contracts, old saves/retirement and measured economy/XP. Existing Level 4 defects/thyroid baseline stay identified; new failures cannot hide behind them. V1-V10; reviewed diff, aggregate reruns and full browser matrix. |
| M10. Ordinary launch switch and handoff | One tiny scoped worker opens cap 5/final labels after acceptance; manager owns durable handoff/checkpoint reminder | M9 accepted; accepted room/still contracts preserved | Canonical pathways unchanged. Manual Advance through original Level 4 goals once; Level 5's three goals then unlock inspection; first completed inspection finishes game and both actions work. No auto-spend/hire/inspection or clinical review promotion. V1/V2/V4/V5/V6 plus manager V7/V8 and both-shell ordinary-path smoke. No publication in this lane. |

M7a/M7b/M7c are sequential bounded milestones, not parallel shared-file writers.
Other large rows may also be split by the manager into named serial lanes;
each ends in actual validation and manager browser QA. A renderer failure,
incomplete mobile feature or unproven denominator returns to its worker.

## 10. Validation catalog

Commands below are a future implementation catalog, not claims of work executed
for this documentation task. Run affected focused tests first, then the required
workspace checks. Do not install dependencies. Worker PowerShell uses `npm.cmd`
and threads because the unelevated sandbox cannot run the default child-process
pool or spawn Playwright (`AGENTS.md:214`). Record actual counts/failures from the
current tree instead of copying Level 4/MB8 historical totals.

| ID | Owner / purpose | Exact command or evidence contract |
| --- | --- | --- |
| V1 | Worker, balance/catalog/schema/ladder consistency | `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` |
| V2 | Worker, state/reducer/save/operational behavior | `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` |
| V3 | Worker, clinical regression only | `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` |
| V4 | Worker, shared view, desktop and mobile tests | `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` plus focused new phone/desktop tests through the same runner. Track the pre-existing thyroid question failure precisely; any different failure needs investigation. |
| V5 | Worker, no-Git type/launcher checks | `npm.cmd run typecheck` and `node scripts/verify-launcher-contract.mjs`. Do not invoke the Git-backed root boundary wrapper in a no-Git worker lane. |
| V6 | Worker, direct production build | `npm.cmd run build --workspace @gamify-surgery/player`. Validate relative/public asset availability and separate mobile loading. This command does not itself publish. |
| V7 | Manager, boundaries/aggregate/default-config acceptance | `npm.cmd run test:boundaries`, `npm.cmd test`, `npm.cmd run build` in manager's authorized environment. Root wrappers include Git-backed boundary checks (`package.json:16`, `package.json:19`). Preserve current buffer fixes; do not label a worker's omitted boundary/browser check as passed. |
| V8 | Manager, automated + manual browser | Once M9 creates it: `npm.cmd run test:e2e -- tests/e2e/level-five.spec.ts --reporter=line`; existing regression subset: `npm.cmd run test:e2e -- tests/e2e/level-three-goals.spec.ts tests/e2e/reading-room-radiologists.spec.ts tests/e2e/room-upgrades.spec.ts tests/e2e/room-capacity-sales.spec.ts tests/e2e/retail-income.spec.ts tests/e2e/employee-training.spec.ts tests/e2e/approved-room-interactions.spec.ts tests/e2e/facility-diagnostic-timing.spec.ts --reporter=line`. Use disposable Playwright storage; manual browser QA after each milestone is also mandatory. |
| V9 | Room proof/asset acceptance | M2 briefs specify existing or newly authored read-only hash/contact/path/door validators and their exact commands after those tools exist. Acceptance requires actual output, all room doors/tiers/backing states and native browser proof; no invented validator name is a pass. Never rerun a proof-writing script over approved Founder artifacts during a hash check. |
| V10 | Economy, realistic XP and long-run evidence | M8 authors an owned deterministic reducer audit and records its exact invocation before running it. Economic references use at least four warmup/48 measured hours; separate actual pacing runs continue through 2,000 XP, the other goals and a full completed inspection. A new dated Level 5 JSON records paired seeds, warmup/measured hours, roster/training/room tiers, actual demand/completion/first-answer counts, XP/hour, gross/stock/upkeep/payroll/supplier savings/net, receipts and minimum cash. Test funded normal cluster with $45 Executive but no qualified-round supplier terms, then qualified/missed-round supplier terms, active-play and slow/unfunded cases. Reconcile report-window/event totals and retirement without double counting. Do not overwrite `tools/economy-audit/level-four-results-20261009.json` or call analytical fee-times-capacity measured dispatch. |

Current Founder proof commands are listed at
`tools/room-design/level-5/founders-office/README.md:42`; several write evidence,
including the control/helper checks, and are not read-only approval checks.
The assigned art worker must distinguish new-room proof generation from a
read-only SHA256/layout comparison of the approved Founder assets. A manager
browser recheck is not permission to overwrite that approval evidence.

### Browser pathways and dimensions

- Owner desktop/local pathway stays `START_GAME.cmd` ->
  **`http://127.0.0.1:4173`** in the usual persistent profile. The PC phone preview
  **`http://127.0.0.1:4173/?layout=phone`** shares that origin/storage; changing
  layout is not campaign synchronization.
- Existing private phone launch uses `START_PRIVATE_GAME.cmd` ->
  **`https://melissadesktop.taile197db.ts.net/`**, a separate origin/save. Canonical
  remote `https://melissarowlandc-afk.github.io/GamifySurgery/` is also separate.
  This plan does not deploy or transfer campaigns among them
  (`docs/handoffs/CURRENT_THREAD_HANDOFF.md:21`, `AGENTS.md:106`).
- M2 should create a dedicated Level 5 QA entry/launcher, with strict proposed
  loopback origin **`http://127.0.0.1:5185`**, subject to a free-port check. This is
  a proposed tool/pathway, not an existing launcher. Do not reuse/alter the Level 4
  fixture on 5184 or fall back silently. Tell the manager its exact URL and
  `location.origin`; saves here are disposable and separate from the owner game.
- Desktop widths: 1600, 820 and 390 for Goals/modal/finance flow and completion
  notices. Phone matrix: 360x740, 390x844, 412x915, 844x390 landscape and 768x1024,
  following accepted mobile QA (`docs/execplans/mobile-version-20261009.md:23`).
  Check all five room thumbnails/map assets, readable costs/effects, >=44px touch
  targets, scrolling, close/back, Manage pause, and safe repeated placement/advance/
  start-inspection taps. Switching shells does not create a second campaign or
  restart a running task/inspection. Record both shells in each handback.

### End-to-end acceptance scenarios

1. Fresh Level 0 and older Level 0-4 saves retain existing rules, frozen clinical
   releases, FSRS, contracts and quotes. Pre-Level-5 saves gain no fabricated
   management terms, inspection eligibility/result, expenses or completion.
   Retired Level 4 witnesses persist; Advance checks its original five live goals.
2. Advance once and reset current-level XP once. Both shells show **2,000 XP /
   satisfaction >90 / average effective morale >=85**. Exercise 1,999/2,000,
   90/>90, just-below/at-85 and empty workforce. Meet goals with **no Level 5
   rooms or Executive**: inspection unlocks, but the game is not finished.
   Earned unlock persists across later condition declines, retirement and reload.
3. Before goals are earned, both booking UI and domain command reject inspection;
   entering Level 5 alone cannot book. Afterward book without Executive at 60
   minutes or with qualified tier terms at raw 57/56.25/55.5/54.75/54, quoted once
   as 57/57/56/55/54. Pause/load/cancel/retry cannot shorten the 3,000-minute
   inspection window. An insufficient sample is Incomplete, not completed.
4. Build/inspect/upgrade/sell all five at approved footprints: Founder 3x3/five
   looks, Executive 3x2/ten doors, Gift 3x3, Garden/Gym 4x4. Executive N2/S2
   retain chairs, sitters and foregrounds with approved passing routes/depth.
   Garden south planter sections clear only for their own doors. Gym's accepted
   corrected corners and actual receipt match promoted art. Test all doors/backing states, occupied
   contacts, both map/thumb caches, blocked/sold rooms, motion 1x/4x and reload;
   no empty-path renderer freeze, hidden necessary station or stale reservation.
5. Founder morale applies once across hire/pay/upgrades/load/sale. Coffee, praise,
   gym and daily management remain ordinary earned awards. Effective/stored
   morale, salary/quit/break/satisfaction averages agree; sustained nonpayment
   and <=10 quitting boundary work. Actual garden/gym use is once-only, shares
   break cooldown and yields to care; existing pediatric pairs stay together.
6. Hire/train the $45 Executive using each approved .003/.004 identity. **All four**
   outputs scale through employee tiers 1-5; room tiers shorten only the round.
   Midway training/upgrades, day expiry/rollover, post-award hires, fire/sale/
   blocked access and repeat commands retain frozen terms and one daily award.
   Every output/current/next-tier quote appears on desktop and mobile.
7. Supplier 1-2% applies once to eligible new stock/accrued upkeep after existing
   modifiers, with actual posting precision. Wages/capital/fees/ads are unchanged.
   Missing/expired round qualification prevents new terms; old accepted quotes
   retain theirs. Saved cents are expense reductions, never gross plus rebates.
   Exercise pharmacy/gift quotes, outage relief and repeated ticks/load.
8. Gift normal/premium price budgets, founder zero-gross consumption, stock cash,
   two-person queue, preemption, sale/block/cancel and one receipt reconcile.
   Demand is per facility, not tier/reload. Compare clinical timestamps/counts
   and exact eligible/frozen case identities with retail/support on/off;
   disclose known active-pool defects rather than proving independence by counts.
9. Report weights are **10/10/10/10/10/10/10/5/5/20**, totaling 100. Frozen
   buildable/upgradeable type and physical-slot requirements include missing
   types/homes/positions. Extra lower-tier rooms/untrained staff remain sampled;
   one employee cannot fill several slots. Normal busyness/training is not firing.
10. Observe a full valid window with >=20 qualifying scored completions. Count
    presented/first answers, employee discussions, wrong/corrected-forward/
    unfinished/walkout/unanswered questions and retired evidence exactly once.
    Full-window satisfaction, actual queue versus processing, cleanliness
    room-minutes and charged/paid expense postings reconcile. Reserves/sales/
    last-tick purchases/rounding cannot fake perfect structural/finance results.
11. Perfect requires every room type usable, all owned upgrades maxed, all physical
    staff positions distinctly filled, every employee max-trained and every
    presented answer correct, plus other categories full. One missing item,
    wrong answer or unanswered question prevents 100. Verify the 85-point example,
    two-decimal floor, recognition boundaries, raw-score best/equal/lower repeats.
    **No pass score is required to finish the game.**
12. First completed valid inspection at a low score opens the finish page once:
    clear congratulations, actual ten-category report, **Keep playing** and
    **Start new campaign**. Incomplete/cancel does not. Keep playing retains
    clinic/XP/history/best; repeating inspections improves only latest/best and
    never replays victory/rewards. Reload before dismissal reopens the page;
    after dismissal it stays closed, with View finish report available.
13. Start new campaign requires explicit shared confirmation and creates fresh
    campaign progress/learning history under existing new-campaign rules.
    Cancellation leaves the completed campaign/page intact. No silent hard reload,
    seed-preserving Restart substitution, double new campaign or premature save
    deletion. Both actions work by keyboard/touch on desktop and phone, portrait/
    landscape, with local scrolling, 44px targets and common pause policy.
14. All ten inspector-v6f actors spread/move between reachable rooms on both maps,
    maintain clipboard/contact/depth fidelity, resume safely and leave on end/
    cancel. Turning presentation on/off does not change clinical pool/RNG,
    queues, staff counts, income, answer evidence, report arithmetic or clock.
15. M8 reports three paired-seed real current-content XP/economy runs, minimum
    four warmup/48 measured hours, funded passive-reader and active-play
    references with/without $45 Executive and qualified/missed-round suppliers.
    Include slow/half-gift/overall demand, startup trough, reader interruption,
    technical outage and break/training. No income/XP/balance overrides. Record
    separate extended goal/first-inspection pacing runs through actual game finish,
    actual completion/answer/receipt counts,
    gross/stock/upkeep/payroll/savings/cash and retirement-safe report totals.
    Normal funded full optional cluster and shop pass without qualified terms;
    the partial unfunded negative case stays disclosed.

The following October 10 record is preserved verbatim as history. The binding
October 11 follow-up immediately below supersedes its conflicting directions.

## M0 owner decisions (2026-10-10, binding; recorded by the manager)

Owner answers to section 11, verbatim intent:

1. **Final level:** yes, Level 5 is the last ASC level. The clinic stays open after completion; no Level 6.
2. **Unlock:** same way as earlier levels (finish the Level 4 goals, manual Advance; current-level XP resets once).
3. **Finish Level 5:** do NOT require all rooms built. Goals are a high current-level Clinical XP goal plus satisfaction and staff-morale goals. Reaching Level 5 / completing it opens the inspection end-game (inspection is not a completion gate).
4. **Rooms:** one of each. Executive Office is **3x2** (owner: it cannot be bigger than the 3x3 Founder's Office); mockup revision in progress. Founder's Office ownership raises every employee's morale (2026-10-08 decision stands).
5. **Executive:** owner asked for something better than morale alone: the Executive does all three jobs **mildly** (staff morale, visitor/patient satisfaction, inspection preparation), and **training increases those amounts**. Manager may propose one additional business-side effect that fits the same rule.
6. **Executive pay:** must be clearly more than $10/h (highest-paid support role); worker proposes an option-B-consistent salary with arithmetic.
7. **Inspection report card:** inspections produce a detailed report card with many categories the player can work on: e.g. cleanliness, room upgrades, trained employees, staffing coverage, satisfaction, morale, finances, wait/flow, and clinical answer accuracy. A **perfect score** requires essentially: all rooms bought, all upgrades maxed, all employees hired and max-trained, and every question answered correctly. Repeatable; best score kept as prestige; show the arithmetic per category.
8. **Clinical content:** accepted as recommended (no new required batch or setting for Level 5).

## M0 owner follow-up (2026-10-11, binding)

Recorded from the owner's final reconciliation instruction on 2026-10-11.
This section supersedes conflicting October 10 timing/completion directions;
the earlier manager record remains verbatim as historical evidence.

1. Level 5 goals are **2,000 current-level Clinical XP**, satisfaction **above 90**
   and average staff morale **at least 85**. Meeting them unlocks inspections;
   inspections are unavailable before that acknowledgment.
2. The **first completed inspection finishes the game**, with congratulations,
   its report card, **Keep playing** for repeat/best-score inspections and
   **Start new campaign**. Both desktop and mobile expose that finish page.
3. One Executive does **four mild jobs**, all scaling with training: staff morale,
   visitor satisfaction, inspection preparation and supplier negotiation at
   **1-2% off stock/upkeep**. Pay is about **$45/hour**. Reuse the two approved
   future-roster20-v5 Executive designs.
4. Inspection agents use the **ten manager-accepted inspector-v6f identities** as
   presentation-only actors who spread out and move between rooms during the run.
5. All room mockups are owner-approved: Founder 3x3, Executive **3x2**, Gift 3x3,
   Garden 4x4 and Gym 4x4. Gym approval is conditional on its corner-overlap
   correction in progress; verify that fix before promoting Gym assets.
6. Mockup design is complete. The implementation table starts with **runtime M1**;
   ownership, actual validation and manager browser QA on both shells still apply.

## 11. M0 resolved; implementation defaults and later copy selection

The October 11 binding follow-up controls the operational plan. The October 10
answers are preserved verbatim as history where that follow-up supersedes them.
No gameplay M0 decision is outstanding.

1. Goals: **2,000 current-level XP / satisfaction >90 / nonempty average effective
   morale >=85**. Simultaneous fulfillment unlocks inspection permanently; before
   that point both shells and domain booking remain locked. Rooms/Executive
   are optional ways to improve the clinic, not goal requirements.
2. Finish: the **first completed score-bearing inspection**, regardless of score,
   finishes the game. Keep the ordinary five-day/3,000-minute window and 20-patient
   minimum. Incomplete/cancel is not completed. No score/pass/perfect threshold.
3. Executive: all **four** jobs with section 4's mild five-tier strength table;
   $45/hour default, $35-$65 bounds/$2 steps, $600 hire; 30-minute daily round
   shortened by the accepted office ladder. Training $100/$200/$300/$400,
   current 60-minute/global-two training contract.
4. Supplier: required role function, 1-2% eligible stock/upkeep by training tier,
   after existing modifiers and only after the actual daily round. No salary/
   capital/fee discount, stacking, second rebate or fabricated income.
5. Room/art: Founder 3x3/five appearances, Executive 3x2, Gift 3x3, Garden/Gym 4x4;
   one of each prestige type. All five receipts now record approved designs,
   including Gym's corrected corners and manager browser acceptance. Reuse approved Executive .003/.004 and
   all ten accepted inspector-v6f identities. Inspector actors add no scored data.
6. End-game UI: congratulations + report card + **Keep playing** + **Start new
   campaign**, using one shared state/command path on both shells. Repeat
   inspections retain best prestige. Candidate finish lines are drafted in
   section 2; owner wording selection may happen later. Candidate 1 is preview
   copy, not an implementation blocker or a new gameplay decision.

All costs, durations, percentages, cadences and category weights are **editorial
game values**. Ordinary details above preserve the binding owner's direction.

## 12. Progress, decisions, discoveries and next action

The dated October 10 entries below are a **historical audit trail**, superseded by
the October 11 binding follow-up/reconciliation. Their old values and pending
statuses are not current implementation instructions.

### Initial planning pass (2026-10-10; before binding M0 revision)

- Read the specified facility roadmap, the complete Level 4 launch plan including
  its M1-M9 contracts/handbacks and manager-QA corrections, Founder's Office
  design/approval evidence, future GS038 ladders and the current ladder catalog,
  option B audit/owner decisions, measured Level 4 report, applicable AGENTS,
  current handoff and mobile architecture/accepted QA notes.
- Traced current level/schema/terminal, room/staff/training catalog, pay/morale,
  retail, satisfaction, surgeon QI, persistence types and desktop/mobile feature
  exposure. Distinguished implemented systems, accepted future data/art and new
  proposals. No browser, owner storage, clinical external corpus or AI/runtime
  clinical generation was needed.
- Wrote only this plan and appended the requested two-line owner-request pointer.
  This worker ran no Git, installs, gameplay tests, builds, asset generators or
  implementation. Planning verification is a document/reference/arithmetic check;
  it is not any milestone's runtime acceptance or clinical approval.

### Open risks / manager follow-through

- Runtime M1 is ready for a bounded brief. Room mockup design is complete and
  supplier negotiation is binding. All five actual approval receipts are cited.
  The Gym receipt arrived during reconciliation: its corner condition is met
  and manager browser validation is PASS. Its older worker pending-browser flag
  describes the handback before manager acceptance, not a current design blocker.
- Promote approved/corrected art and authored contacts; runtime access, rendering,
  reservations and both-shell behavior still need milestone QA. A room approval
  is not evidence that its runtime implementation exists. Preserve the separate
  Gym worker's concurrent source/proof/handoff changes.
- $45 pay/output table, 2,000 XP, inspection formulas and first-report finish are
  recorded for implementation. The reader reference is measured current Level 4
  code; adding Level 5 costs/effects remains analytical until real M8 dispatch.
  The narrow unfunded passive roster loses money; show that and the funded
  alternatives without grants, fee increases or fake morale income.
- Mobile/shared session/art files are changing. Reserve both shell lanes,
  preserve unrelated changes and inspect actual diffs. Desktop success is not
  mobile acceptance; New campaign and finish-page dismissal need the same
  durable, safe command/state semantics in both shells.
- Inspector looks are manager-accepted; actor runtime is not implemented. Keep
  their presentation out of clinical/retail RNG, staff coverage and evidence.
  Existing Level 4 defects remain identified; new failures block acceptance.
- Accuracy compares frozen prototype game keys, not real accreditation. No
  new clinical batch, source corpus, gameplay AI or clinical approval is
  authorized. Manager owns accepted checkpoints/handoff/backup. This revision
  does not run Git, publish, install or modify code.

**Next action:** Manager dispatches runtime M1 with exclusive file ownership and
this reconciled plan. All mockup approvals, including the Gym correction, are
recorded; no new room design decision is needed. Finish-page wording can be
chosen from the drafts later. Ordinary cap stays 4 until M10 acceptance.

### 2026-10-10 - Historical M0 alignment revision (superseded where stated)

- Preserved the manager's verbatim binding M0 section unchanged. Replaced the
  stale pending/choose-one/five-goal/inspection-pass directions throughout the
  operational plan with the owner's three-goal completion and immediate
  repeatable inspection availability.
- Recorded ordinary editorial defaults: 3,000 XP / >90 satisfaction / >=85
  nonempty mean morale; Executive 3x2, one of each room; $45/hour pay; daily
  all-three-job management round and training outputs. Kept approved Founder
  ownership/art and GS038 ladders. Fourth supplier job is a precise mild proposal,
  not a silently attributed owner decision.
- Read current reward/settlement/answer/flow/room/staff/training/expense data.
  A read-only native Node in-memory load counted 1,110 cases/1,415 nodes; the
  XP worksheet uses explicit player-rate scenarios rather than invented clinical
  probabilities or an alleged measured playthrough.
- Ran one read-only current Level 4 reader-funded reference in memory, using
  actual placement/hire/tick commands and unchanged balance: seed
  `level-five-plan-reader-reference-20261010`, warmup 4h, measured 48h, 533
  outside reads/$2,665, total gross $262.833333/h, stock $2.729167/h,
  upkeep $30/h, payroll $164/h, net $66.104167/h. Routine scored arrivals stayed
  disabled and XP stayed 0. No fixture/output/artifact/source file was written.
  This informs the +$20.60/h no-supplier / +$20.97/h tier-1-supplier Level 5
  worksheet; it is not Level 5 implementation or runtime acceptance.
- Specified ten report categories with formulas/source fields/weights/hints,
  3,000-minute window/20 scored-patient sample, presented/first-answer evidence,
  all-type/slot/max-tier perfect guards, arithmetic, best prestige and complete
  desktop/mobile presentation. Kept Level 4 rendering, retirement, fairness,
  duplicate-notice, ledger and manager-browser QA lessons.
- Reordered dependencies so three new mockups and pending Executive compact
  approval come first; split inspection evidence/UI into sequential M7a/M7b.
  Manager browser QA follows each milestone/submilestone; no shared-file writers
  run together.
- Edited only this plan; preserved the existing pointer, manager handoff,
  room-design files, code and approval evidence. Verification PASS: UTF-8 without
  BOM/LF/final newline; 163 distinct repository file:line anchors resolve; XP,
  catalog counts, category weights/85-point example/perfect-floor, salary/cost/
  savings and price arithmetic reconcile; all eight protected source/document
  hashes remain unchanged. Binding M0 text is preserved byte-for-byte through
  every edit. Runtime tests, builds and browser acceptance remain future work.
  No Git, installs, code edits, dependency changes, owner-save access or publication.

### 2026-10-11 - Final plan reconciliation (Sol documentation worker)

- Applied the owner's binding October 11 instructions throughout the operational
  plan: 2,000 XP/>90 satisfaction/>=85 morale unlock inspections; only the first
  completed valid report finishes the game. No premature booking or victory.
  The October 10 manager record remains verbatim and is superseded where stated.
  No October 11 section was visible at intake; recorded this user's follow-up
  explicitly in the new binding section rather than inventing manager wording.
- Rescaled all five XP scenarios and goal/first-report pacing; retained the
  current 10/2 answer rewards, realistic catalog-length statistics, full
  3,000-minute inspection window and 20-patient minimum. Rechecked hourly
  economy/supplier arithmetic; no price, wage or reward changed solely with XP.
- Made all four Executive jobs binding, cited approved .003/.004 looks, retained
  $45/hour and mild tier outputs, and removed conditional supplier branches.
- Added accepted inspector-v6f.001-.010 moving presentation with safe room
  distribution, separate state/RNG and no staffing/patient/score/economy effects.
- Cited the four available room approval receipts and replaced stale Executive
  seat-hiding with approved retained N2/S2 chairs/actors. All five mockups are
  owner-approved. During final review the separate Gym worker finished the
  correction and its actual receipt arrived; it records the corner condition
  met and manager browser PASS. Cited that receipt and retained the concurrent
  room-plan/handoff/asset work without editing it. Runtime table now starts M1 and separates
  inspection data, actors and both-shell report/finish pages into M7a/M7b/M7c.
- Specified the finish page, durable once-only completion/dismissal and shared
  Keep playing/New campaign behavior; drafted eight dry finish lines for later
  owner selection. Existing campaigns, FSRS and clinical review rules remain.
- Rechecked current content through a read-only native Node metadata load:
  1,110 cases / 1,415 nodes, histogram 811 one-node / 293 two-node / 6 three-node,
  unchanged. No files or clinical prose output, sources mutated or installs.
- Verification PASS: all 173 distinct repository file:line anchors resolve;
  XP rates/2,000-target durations, first-report pacing, category weights/example,
  salary/stock/upkeep/supplier/price arithmetic reconcile; UTF-8 without BOM,
  LF/final newline and binding/history/active-plan consistency verified.
  Runtime tests, builds and browser acceptance remain future milestones.
  Only this plan is edited; no Git, installs, code/assets/approval receipt
  changes or owner-save access.


## Level 5 M1: state foundation

2026-10-11 - GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
M1 implementation and worker validation are complete. **Manager actual-diff
review, default-pool reruns and desktop/mobile browser acceptance remain
pending.** This handoff records M1 only; M2-M10 remain future work. The binding
October 11 M0 follow-up controls the contracts.

### Implemented seams and runtime boundary

- Balance schema accepts mechanical facility level/cap/successor 5, room/staff
  unlock 5, six stage definitions and optional Level-5-only
  `minimumAverageStaffMorale`. The shipped balance is byte-unchanged: cap **4**,
  Level 4 successor null, no Level 5 room/Executive definition and all five
  future ladders still dormant. Clinical stage/schema/content remains unchanged.
- Optional `GameState.levelFive` uses `level-five-state.v1`.
  `createLevelFiveState()` supplies independent explicit lazy defaults; ordinary
  `createInitialGameState` and legacy loads never call it or insert the field.
  Domain types/export and one narrow persistence reader hook expose the seam.
- `management` stores a versioned daily round, frozen employee/office tiers,
  raw/quoted duration and remaining work, desk contact, completion/once-applied
  markers, last completed day and accepted four-effect terms/expiry. Supplier
  savings use stock cents and upkeep one-sixtieth-of-a-cent units. These are
  zero-default observation counters, never expense postings or income.
- `progress.inspectionUnlocked` freezes simultaneous 2,000 XP / satisfaction
  >90 / nonempty mean morale >=85 evidence separately from `gameFinished`. The
  latter retains the first completed report/run ID, finish tick and completion
  notice ID. `finishPageAcknowledgedAtFacilityTick` is a separate dismissal.
  Legacy Level 4 witnesses/acknowledgments cannot create these records.
- `inspection` includes **locked / ready / preparing / running / completed /
  incomplete / cancelled**, accepted preparation quotes, a versioned 3,000-minute
  run with frozen room/upgrade/physical-staff denominators, run-local minute,
  patient, answer and finance counters/IDs, and separate last/latest-valid/
  best-valid report snapshots. Ten report categories preserve 10/10/10/10/10/
  10/10/5/5/20 weights. A completed snapshot requires the full window and >=20
  qualifying patients; an incomplete/cancelled snapshot has no prestige.
- `inspectionPresentation` keeps the ten approved inspector IDs, separate seed
  and logical route indices in a dedicated lane. It adds no employees, patients,
  retail customers, reservations, wages, clinical RNG or scoring input. Repeated
  synchronization knots remain intact on load.
- The reader rejects malformed/unknown versions, inconsistent phases, invalid
  clocks/counters, duplicate evidence, contradictory same-run snapshots and
  premature unlock/finish/dismissal instead of silently dropping or repairing
  the new state. It preserves expired/overdue accepted clocks and frozen terms.

**No gameplay handlers, rewards, timers, bookings, observations, scoring, room
functions, hiring, promotions, actor rendering, report UI or finish page are
activated by M1.** The existing reducer/selector/session/desktop/mobile source
paths are unchanged. The stage-5 QA definition is schema-only; its morale goal,
inspection controls and finish presentation await M6/M7. The real-tick tests
compare the entire state with/without every fixture's extension, and the player
tests compare the entire common projection with/without it.

Read all specified plans/instructions. This Level 4 plan has its M1 row and
later M5/M8 compatibility references but no standalone M1 handoff section; the
current `level-four-schema.test.ts` and `level-four-persistence.test.ts` provide
the implemented model. Preserved their optional-field/strict-reader approach.

### Save compatibility and preservation

Save schema stays **9**. Levels 0-4 load through their existing migration paths.
The new tests exercise 25 synthetic Level 0-4/schema 5-9 combinations, compare
all learning/finance/frozen encounter/actor/history fields, and verify that
`levelFive` remains absent from both the object and serialized JSON. The frozen
`level-four-legacy-pre-m3.json` is explicitly a synthetic older-save shape, not
an owner save. Existing older-schema coverage also runs in the full suite.

Level 4 saves load identically in the ordinary cap-4 and QA cap-5 contexts.
Level 5 saves load only in an explicitly cap-5 context; ordinary cap-4 loading
still rejects them. Tests retain existing diagnostic quotes, receipt/still
identities, durable Level 4 data, fractional preparation/management terms,
retired question/answer evidence, first/best reports after lower/equal retries,
and dismissal across repeated reloads. Earned unlock survives later current
condition declines/history removal. No witness/expense is reconstructed.

Existing **DEFECT-M9-1** (ordinary overdue idle deadlines normalized on load) and
**DEFECT-M9-2** (APP activity can change scored case identity) are preserved.
M1 does not fix them or claim whole-root reload equality for those old clocks.
The new accepted Level 5 clocks themselves are compared exactly. Existing
thyroid test/expectation is untouched. No clinical statement, source, concept,
review status, frozen clinical release, art/approval receipt or demographic
selection rule changed. Tests do not constitute clinical approval.

Before-images and hashes of 1,043 intake source/config/document paths were
captured without Git. Shared files were reread and the actual six-file runtime/
QA diff inspected. All owned source/test/QA files are UTF-8 without BOM, LF.
The plan receives only this append, retaining its original bytes. The manager's
CURRENT_THREAD_HANDOFF and other plans are unchanged. Final inventory/diff/
hashes are in `.local-dev/level5-m1/`; no unrelated intake source changed.

### Files changed

Existing narrow seams:

- `packages/balance-config/src/schema.ts`
- `packages/game-domain/src/{types.ts,persistence.ts,index.ts}`
- `tools/qa/{level-four-rooms-bootstrap.ts,level-four-rooms.mjs}`

New files:

- `packages/game-domain/src/{level-five-types.ts,level-five-state.ts}`
- `packages/balance-config/src/level-five-schema.test.ts`
- `packages/game-domain/tests/level-five-state-persistence.test.ts`
- `apps/player/src/session/levelFiveStateQa.test.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/level-five-state-bootstrap.ts`

Documentation: this appended **Level 5 M1: state foundation** section only.
Ignored scratch contains reproducible before-images, exact command receipts/
logs, QA typecheck config, source hashes and scoped diff. No Git, installs,
agents, external messages, browser/owner-storage access, publication or
ordinary launcher/server changes occurred.

### Isolated QA pathway and synthetic fixtures

The M1 brief explicitly supersedes section 10's **proposed** 5185 tool pathway:
reuse **`node tools/qa/level-four-rooms.mjs`** on strict loopback
**`http://127.0.0.1:5184`**, entry **`/level4-rooms-qa.html?level5=`**. No new
launcher or port is introduced. This disposable origin/profile has separate
saves from local owner 4173, private phone HTTPS and remote Pages. Use a
**dedicated disposable Level 5 browser profile/context**, and retain `?level5=`
on every reload. `layout=phone|desktop` changes only the presentation in that
same profile/campaign. Each scenario has its own campaign ID; reopening it
resumes the existing save without reseeding, resetting pause/cash or overriding
other campaigns. The usual prototype access gate remains intact.

The cap-4 Level 4 QA branch now refuses a profile containing Level 5 saves
**before** loading/writing it, preventing its existing invalid-campaign filter
from dropping cap-5 fixtures. Use a fresh separate profile for Level 4 queries.
Keep Level 5 profiles on the dedicated `?level5=` entry; the ordinary `/` entry
retains its cap-4 loader.

| `level5=` | Initial synthetic metadata |
| --- | --- |
| empty value or `pre-goal` | Level 5, 1,999 XP, locked, no unlock/finish |
| `eligible` | Partial clinic, one real receptionist at morale 85, displayed satisfaction >90, 2,000 XP; earned unlock/ready, no Executive or Level 5 rooms, no finish |
| `management` | Frozen tier-2 four-effect daily round, 20/30 work minutes remaining |
| `management-completed` | Completed/once-applied marker and same day's accepted terms/expiry; no supplier savings fabricated |
| `preparing` | No-Executive accepted 60-minute quote, tick 120 / end 160 |
| `running` | Tick 170, 10 observed minutes, frozen current-catalog denominators, run end 3,160 |
| `actors` | Same running record plus all ten inspector-v6f IDs and separate presentation seed/routes |
| `report` | Synthetic 85-point completed report, immutable first/latest/best and already-dismissed finish page |
| `finish` | Synthetic 12-point completed report, first game-finished record, page unacknowledged |
| `finish-acknowledged` | Same low-score finish with durable dismissal tick |
| `incomplete` | Full-window/19-patient report; no completed score, prestige or game finish |
| `cancelled` | Cancelled status; no run, result or game finish |

All fixtures start paused with routine arrivals/appointments disabled. Existing
rooms/doors/receptionist/pay are prepared through real commands. Level/XP/clock
and Level 5 work/report/presentation records are **explicit synthetic fixture
metadata**; management home/employee IDs are future schema examples, not paid
hires or placed rooms. The report's 20-patient count is a synthetic report
contract, not 20 completed gameplay encounters or pacing/economy evidence.
Current frozen denominators cover the current catalog; M2/M7 must create fresh
fixtures for the integrated five-room catalog. M1's actors/reports/finish-page
records are inspected in storage, not rendered as those future features.

`--check` now transforms the entry/helper/fixture and exits cleanly. A repeated
exit-13 shutdown was traced to middleware-only dependency discovery/background
warmup. Only this no-listener check disables dependency discovery (empty
include/noDiscovery), pretransform warmup and WebSocket transport. The normal
5184 server, production Vite config/plugins, and every workspace test config
remain unchanged. PASS output is printed after successful cleanup.

### Validation: exact commands and output

All Vitest runs used the **checked-in default workspace configs**,
**`--pool=threads`**, the existing configured worker limits and the requested
preload. No exclusions, alternate test configs, timeout changes, default-fork
pool, dependency installs or existing test expectation edits:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR = '1'
```

Commands were invoked inline from PowerShell; a first scratch `.ps1` runner
was blocked by execution policy before npm ran. No execution policy changed.
An initial typecheck caught `structuredClone` unavailable in the new balance
test's ES-only lib; the new test now uses the existing typed JSON-clone pattern.
Those intermediate failures and QA shutdown retries are retained separately.
Final complete logs preserve native PowerShell `RemoteException` separator
records where emitted; they are capture artifacts, not additional assertions.

| Required check | Final result |
| --- | --- |
| FULL balance | Exit 0; 16 files / 132 passed |
| FULL game-domain | Exit 0; 139 passed files + 1 skipped; 3,905 passed + 2 existing defect skips |
| FULL clinical-content | Exit 0; 87 files / 628 passed |
| FULL player | Exit 1; 206 passed files + 1 failed; 1,802 passed + **only the known thyroid failure** |
| Root typecheck | Exit 0; all seven workspaces |
| QA entry/helper/fixture typecheck | Exit 0; no output |
| QA transform/check cleanup | Exit 0; both PASS lines below, repeated clean exit |
| QA script syntax / launcher contract | Exit 0 / exit 0 |

Focused validation: balance **2 files / 8 tests**, domain **2 files / 115
tests** (89 new M1 cases plus existing Level 4 cases), player **1 file / 20
tests** before the added profile-protection case. The final FULL player run
covers all **21** current M1 player cases. Full runs contain no path filters.

**full-balance - exit 0**

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
```

```text

> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  16 passed (16)
      Tests  132 passed (132)
   Start at  19:35:27
   Duration  965ms (transform 2.98s, setup 0ms, import 7.27s, tests 262ms, environment 13ms)

```

**full-domain - exit 0**

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
```

```text

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  139 passed | 1 skipped (140)
      Tests  3905 passed | 2 skipped (3907)
   Start at  19:35:27
   Duration  158.93s (transform 17.87s, setup 0ms, import 74.81s, tests 548.02s, environment 8ms)

```

**full-clinical - exit 0**

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  19:35:27
   Duration  8.88s (transform 24.25s, setup 0ms, import 95.61s, tests 7.83s, environment 9ms)

```

**full-player - exit 1**

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 1263ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 143ms
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
System.Management.Automation.RemoteException
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
System.Management.Automation.RemoteException
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
System.Management.Automation.RemoteException
 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
System.Management.Automation.RemoteException

 Test Files  1 failed | 206 passed (207)
      Tests  1 failed | 1802 passed (1803)
   Start at  19:35:27
   Duration  55.42s (transform 22.67s, setup 0ms, import 105.17s, tests 94.13s, environment 15ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**typecheck-accepted - exit 0**

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

**qa-typecheck - exit 0**

```powershell
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m1/qa-tsconfig.json
```

```text

```

**qa-transform-final-accepted - exit 0**

```powershell
node tools/qa/level-four-rooms.mjs --check
```

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
```

**qa-script-final - exit 0**

```powershell
node --check tools/qa/level-four-rooms.mjs
```

```text

```

**launcher-contract - exit 0**

```powershell
node scripts/verify-launcher-contract.mjs
```

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

The sole player failure remains
`src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer": `pendingLabel` lacks **Off-site thyroid fine-needle
aspiration**. No new suite failure is accepted. The two existing domain defect
reproducers remain skipped. No browser/physical-phone PASS is claimed.

Exact receipts/logs and reviewed sources:
[validation](../../.local-dev/level5-m1/validation.json),
[scoped diff](../../.local-dev/level5-m1/scoped.diff),
[source hashes](../../.local-dev/level5-m1/validated-source-hashes.json),
[preservation](../../.local-dev/level5-m1/preservation.json),
[balance](../../.local-dev/level5-m1/full-balance.log),
[domain](../../.local-dev/level5-m1/full-domain.log),
[clinical](../../.local-dev/level5-m1/full-clinical.log),
[player](../../.local-dev/level5-m1/full-player.log),
[typecheck](../../.local-dev/level5-m1/typecheck-accepted.log),
[QA](../../.local-dev/level5-m1/qa-transform-final-accepted.log).
Root Git-backed boundaries/aggregate/build wrappers and browser/default-pool
checks remain manager validation; this no-Git M1 worker did not invoke them.
No production build or future Level 5 e2e PASS is claimed.

### Manager QA and next action

1. Inspect the actual scoped diff and exact validation/source hashes. Rerun
   default-pool checks in the manager environment as required, retaining the
   known thyroid failure/two existing defect reproducers. Review the narrow
   existing-file seams and the new contracts before accepting M1.
2. Start/reuse `node tools/qa/level-four-rooms.mjs` in the manager environment.
   Use a **fresh dedicated disposable Level 5 context/profile**, then open
   **http://127.0.0.1:5184/level4-rooms-qa.html?level5=pre-goal&layout=desktop**.
   Confirm `location.origin === 'http://127.0.0.1:5184'`. Complete the ordinary
   prototype access/opening flow; resume **Level 5 M1 synthetic pre-goal**.
   Verify paused Level 5, 1,999 XP, the unchanged ordinary clinic presentation
   and no new room/Executive/inspection/finish UI.
3. At desktop 1600x1000, open each scenario URL from the table, keeping the
   same origin/profile. Its unique campaign should appear once. Inspect the
   exact synthetic foundation read-only after autosave with:

   ```javascript
   const m1Profile = JSON.parse(localStorage.getItem('gamify-surgery.prototype.profile.v1'));
   const m1Campaign = m1Profile.campaigns.find(c => c.campaignId === m1Profile.activeCampaignId);
   const m1State = JSON.parse(m1Campaign.serializedState);
   ({ origin: location.origin, campaignId: m1State.campaignId, level: m1State.facilityLevel,
      levelFive: m1State.levelFive });
   ```

   Check locked vs ready, incomplete/cancel no finish, first low-score report
   vs page dismissal, all ten actor IDs, fractional terms and frozen end ticks.
   These are storage/contract checks; no real round/report/actor motion exists
   in M1. Later M3-M7 own those handlers and screens.
4. Reload the same full URL twice. Check one campaign, preserved cash/pause,
   original IDs/terms/clock/acknowledgment and no new financial/learning/completion
   events. Switch to **`&layout=phone`** at 390x844, then 360x740 and landscape
   844x390. The same campaign/metadata must persist; existing mobile map,
   Patients/Manage/Build/Goals and pause restoration retain their prior behavior.
   Switch back to desktop; no reseed or duplicate fixture. Observe page errors.
5. In the Level 5 profile, temporarily open the same entry without `level5`: the
   deliberate profile-protection error must occur before storage mutation;
   return to the full Level 5 URL and verify the save remains. Use a **different
   fresh disposable context** for existing Level 4 queries such as
   `?state=l3ready` / `?apps=appointments&layout=phone`; their bootstrap behavior
   and original campaign selection remain intact. Never clear owner storage.
6. Smoke an ordinary fresh/old Level 0-4 campaign in disposable storage at
   **http://127.0.0.1:5184/** (separate context, no Level 5 profile): cap 4,
   original five Level 4 goals, no Advance to Level 5 and no optional extension
   fabricated. The worker did not inspect an actual owner historical save; an
   authorized copy remains separate manager QA.
7. After both-shell load/reload/default QA, accept M1, update the manager-owned
   CURRENT_THREAD_HANDOFF and reserve the next M2 lane. Preserve these versioned
   optional contracts; new behavior should initialize them lazily at its real
   acceptance/earned-event boundary and freeze quotes without rewriting old
   records. Create fresh integrated QA fixtures when catalog/functions arrive.

Owner pathways remain unchanged: **START_GAME.cmd -> exact
http://127.0.0.1:4173** in the usual persistent profile; private phone
**START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**; remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**. Different origins/profiles
have separate saves. The M1 QA query/profile is disposable and is not a campaign
transfer or synchronization path. **LOCAL ONLY checkpoint:** no GitHub backup
was created. Manager owns acceptance and the owner reminder to say
**"push to GitHub"** for a scoped audited backup after acceptance.

- 2026-10-12 manager: M1 ACCEPTED. Chrome QA on http://127.0.0.1:5184/level4-rooms-qa.html?level5={pre-goal,eligible,finish} desktop and &layout=phone: Level 5 HUD (1,999/2,000 and 2,000/2,000 XP), canvas renders, reload resumes the same state, no page errors. Worker suites: balance 132, domain 3905+2 skips, content 628, player 1802 + known thyroid failure, typecheck PASS. M2 dispatched.

## Level 5 M2: rooms in the game

2026-10-11 - GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
M2 implementation and worker validation are complete. **Manager actual-diff
review, default-pool reruns and desktop/phone browser acceptance remain pending.**
This handoff covers presence, placement, art and physical capacity. M3-M5 own
room functions and ladder activation; the ordinary cap remains **4** until M10.
The binding October 11 M0 follow-up and M1's accepted 5184 QA pathway control.

### Catalog, capacity and compatibility

| Room | Footprint | Build cost | Upkeep / hour | Maximum instances | Accepted future purchase costs |
| --- | --- | --- | --- | --- | --- |
| Founder's Office | 3x3 | $1,200 | $1 | 1 | $300 / $500 / $750 / $1,000 |
| Executive Office | 3x2 | $2,000 | $1 | 1 | $500 / $750 / $1,100 / $1,500 |
| Gift Shop | 3x3 | $800 | $1 | 1 | $200 / $300 / $450 / $600 |
| Indoor Garden | 4x4 | $800 | $1 | 1 | $200 / $300 / $450 / $600 |
| Staff Gym | 4x4 | $1,000 | $1 | 1 | $250 / $375 / $550 / $750 |

- All five are unlock-level 5, orientation 0, and require the existing Front
  Desk. The complete cluster costs $5,800 with $5/hour base upkeep. Build
  satisfaction, workload contributions, capability IDs and upgrade upkeep are
  neutral. The original stage definitions, Level 4 successor, save schema and
  ordinary maximumPlayableLevel are preserved.
- Physical Executive home capacity is one desk, with a separate approved visitor
  chair. No Executive role, hire, training, daily round, supplier terms, visitor
  stream, Founder morale modifier, garden rest or gym break is activated.
  Necessary furniture, seats, standing approaches and foreground masks are
  registered for later binding. No new patient/employee/inspector actor is baked
  into the room artwork or inserted into the placed-room scenario.
- All five effect ladders in `room-upgrades.ts` remain byte-unchanged and
  `future`. Shared desktop/phone room information shows the declared five tiers,
  current appearance and unavailable effects/purchases. The domain rejects a
  directly dispatched future UPGRADE_ROOM, as well as withholding UI buttons;
  M2 does not falsely sell an upgrade that has no function.
- The five cards, extra desktop texture requests and future-upgrade copy are
  withheld outside Level 5. Original desktop eager asset registration is
  unchanged; phone asset selection uses the existing cache. New setup guidance
  observations are withheld at Levels 0-4. Tests compare complete old/new domain
  load/tick results, complete shared views and both catalog renderings at every
  Level 0-4, rather than checking only that the room names are absent.
- Synthetic and representative old saves round-trip without added Level 5
  fields, earned witnesses, purchases or clinical changes. Existing frozen
  inspection denominators and edited M1 campaigns are resumed untouched. Fresh
  integrated inspection fixtures include the new catalog (33 buildable types,
  31 declared upgradeable types); Executive hiring/position-denominator binding
  remains M4. No owner historical save or owner browser storage was accessed.

### Approved-byte and presentation evidence

| Room | Active approved sprites | Receipt hash entries verified | Runtime PNG count / bytes | Looks | Fine occupied routes | Door segments |
| --- | --- | --- | --- | --- | --- | --- |
| Founder | processed/v2 | 49 | 43 / 12,004,144 | 5 | 2,340 | 12 |
| Executive | processed/v4 | 33 | 10 / 1,985,736 | 1 | 510 | 10 |
| Gift | processed/v3 | 30 | 9 / 3,017,425 | 1 | 1,587 | 12 |
| Garden | processed/v2 | 38 | 18 / 8,269,180 | 1 | 1,296 | 16 |
| Gym | processed/v1, corrected geometry v2 | 24 | 21 / 5,930,397 | 1 | 1,296 | 16 |

**174 receipt hashes; 101 native PNGs; 31,206,882 byte-exact runtime bytes;
7,029 fine routes.** The receipt checks cover historical variants and frozen
proof evidence too; only the active accepted sprites are promoted. The receipts
are Founder `approval-2026-10-09.md` and the other four
`approval-2026-10-11.md`, under their respective `tools/room-design/level-5/`
folders. Each PNG matches its receipt/source SHA-256 in both
`apps/player/public/art/rooms/level5-v1/` and the production build's copied assets.

The new reproducible promotion command copies bytes and derives runtime data
from the frozen proof exports. Its `--check` mode is read-only. It also verifies
painted proof-manifest lineage for layout, design exports, geometry, data and
HTML. No approved proof script was rerun, source art changed, image processed,
PNG re-encoded, or new art generated. Founder keeps all five approved looks;
the other four reuse precisely one fixed appearance at every tier.

Runtime draw records retain the native source rectangles, uniform sizing,
measured alpha anchors, floor contacts, painter depths, exact floor/procedural
draws and native foreground layers. Door/backing masks are per individual
approved record. Necessary stations/supports/foreground masks survive every
door/backing selection; Executive N2/S2 retain both chairs and their sitter
supports. Closed front rows are continuous and only the selected door segment
cuts a row. Fixed-appearance rooms receive no new finish decoration.

Every perimeter door has real domain access to permanent contact anchors.
Fine circulation is validated at the approved 0.18-tile actor radius against
retained physical solids and measured alpha bases, with occupied destinations
as defined by each accepted proof. Logical path and world-knot arrays retain
the same indices, outside-door entries and synchronization nodes. **M3-M5 must
bind these fine knots and the separate static seating transition; coarse tile
centers are only access anchors and must not replace sub-tile circulation.**
The compact Executive N2/S2 threshold exceptions preserve chairs; they do not
delete a required record to make a path. Contacts/paths are data in M2, not a
claim that new support/retail actors are already moving in gameplay.

Actual FacilityScene tests exercise all Founder looks and all fixed rooms on
desktop and phone bridges at 24/64/120-pixel tile widths, support attachments,
bitmap/procedural actor occlusion, doors/backing, one-time desktop pack loading
and whole-room loading/failure fallback. Actual React thumbnail effects load
and composite complete packs, preserve Founder rug/desk ordering and leave a
truthful placeholder on failure. Manager visual acceptance is still required.

### Files changed and shared-work preservation

27 existing paths receive narrow registration/gating/test edits; 130 new paths are added:

Existing files:

- `apps/player/src/art/bitmapAssetManifest.ts`
- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/approvedRoomPresentation.test.ts`
- `apps/player/src/facility/approvedRoomPresentation.ts`
- `apps/player/src/facility/approvedRoomRenderer.test.ts`
- `apps/player/src/facility/furnitureSeatLayering.test.ts`
- `apps/player/src/facility/roomUpgradeAppearance.test.ts`
- `apps/player/src/facility/roomVisualLayout.ts`
- `apps/player/src/facility/types.ts`
- `apps/player/src/mobile/build/MobileBuildCatalog.tsx`
- `apps/player/src/mobile/build/MobileBuildRoom.tsx`
- `apps/player/src/mobile/build/RoomThumbnail.tsx`
- `apps/player/src/mobile/performance/roomAssets.ts`
- `apps/player/src/session/buildModePresentation.ts`
- `apps/player/src/session/viewModels.ts`
- `packages/balance-config/src/approved-room-layouts.test.ts`
- `packages/balance-config/src/approved-room-layouts.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/level-five-schema.test.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/room-upgrades.test.ts`
- `packages/game-domain/src/guidance-tips.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/room-capacity.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/level-five-state-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`

New implementation/test/tool files:

- `apps/player/src/art/approvedLevel5BitmapAssets.ts`
- `apps/player/src/facility/approvedLevel5RoomData.ts`
- `apps/player/src/facility/approvedLevel5Rooms.test.ts`
- `apps/player/src/facility/level5ApprovedScene.test.ts`
- `apps/player/src/mobile/build/level5RoomThumbnails.test.tsx`
- `apps/player/src/session/levelFiveRoomsViewModels.test.tsx`
- `packages/balance-config/src/approved-level5-room-layouts.ts`
- `packages/balance-config/src/level-five-rooms.test.ts`
- `packages/balance-config/src/level-five-rooms.ts`
- `packages/game-domain/tests/level-five-rooms.test.ts`
- `packages/game-domain/tests/level5-approved-navigation.test.ts`
- `tests/fixtures/level-five-rooms.ts`
- `tools/room-design/level-5/runtime-promotion/README.md`
- `tools/room-design/level-5/runtime-promotion/promote.mjs`

New generated data/assets (full individual inventory linked below):

- `apps/player/src/art/level5/{founders-office,executive-office,gift-shop,indoor-garden,staff-gym}.json` (5 descriptor files).
- `apps/player/src/facility/level5/{founders-office,executive-office,gift-shop,indoor-garden,staff-gym}.json` (5 native presentation/contact/route files).
- `packages/balance-config/src/level5/{founders-office,executive-office,gift-shop,indoor-garden,staff-gym}.json` (5 domain access/contact contracts).
- `apps/player/public/art/rooms/level5-v1/<room>/` (101 approved PNGs).
- This append-only Level 5 plan handoff. Scratch validation/log/before-image artifacts are under `.local-dev/level5-m2/`; no generated distribution or scratch output is proposed as source.


The exact inventory and SHA-256 for every changed/new path are in
[preservation.json](../../.local-dev/level5-m2/preservation.json); narrow existing
file edits are in [scoped.diff](../../.local-dev/level5-m2/scoped.diff).
The intake audit checks 4,986 paths without invoking Git; all unowned paths,
including prior Level 4/M1 work, clinical content, approved room sources,
launcher/private-protocol files, mobile styles and the manager's boundary fix
remain byte-unchanged. The plan is append-only, including the manager's M1
acceptance note. Owned source/data/docs are UTF-8 without BOM and LF.
CURRENT_THREAD_HANDOFF remains in the manager's lane. No Git, dependency
installation, agent spawning, external messages, publication or deployment.

### Validation: exact commands and output

All four full suites used their **checked-in default workspace configs**, the
authorized **`--pool=threads`** and the existing EPERM preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node tools/room-design/level-5/runtime-promotion/promote.mjs all --check
node .local-dev/level5-m2/asset-proof.mjs
node tools/qa/level-four-rooms.mjs --check
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m2/qa-tsconfig.json
node --check tools/qa/level-four-rooms.mjs
node scripts/verify-launcher-contract.mjs
```

No exclusions, alternate Vitest configs, timeout increases or worker-limit
changes were used. Existing tests received only additive catalog/native-layer
registration updates; the known thyroid and clinical guard expectations remain
untouched. A final overlapping suite run timed out the existing three-nurse
peri-op test; the full player rerun below ran after domain completion with the
same settings. Its only failure is the known thyroid pending-label assertion.
The overlapping attempt is retained in
[full-player-overlapping-timeout.log](../../.local-dev/level5-m2/full-player-overlapping-timeout.log).

Balance full suite, exit 0:

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  17 passed (17)
      Tests  138 passed (138)
   Start at  20:37:01
   Duration  1.22s (transform 5.83s, setup 0ms, import 12.36s, tests 288ms, environment 6ms)
```

Domain full suite, exit 0:

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  141 passed | 1 skipped (142)
      Tests  3929 passed | 2 skipped (3931)
   Start at  20:37:01
   Duration  168.69s (transform 16.86s, setup 0ms, import 74.60s, tests 586.69s, environment 8ms)
```

Clinical full suite, exit 0:

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  20:37:01
   Duration  7.80s (transform 26.76s, setup 0ms, import 86.09s, tests 7.49s, environment 9ms)
```

Player full suite, exit 1:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 558ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 57ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 210 passed (211)
      Tests  1 failed | 1839 passed (1840)
   Start at  20:40:12
   Duration  41.28s (transform 8.57s, setup 0ms, import 80.93s, tests 66.26s, environment 12ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

Root typecheck, exit 0 (all seven workspaces):

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

Production player build, exit 0 (exact result lines):

```text
vite v8.1.5 building client environment for production...
transforming...✓ 710 modules transformed.
dist/assets/MobileShell-Cli3yTCw.css                                   38.59 kB │ gzip:     6.67 kB
dist/assets/index-LZbQwf0F.css                                        163.50 kB │ gzip:    30.40 kB
dist/assets/MobileShell-CF-foLc2.js                                   114.30 kB │ gzip:    30.27 kB
dist/assets/index-CULlNtxi.js                                      12,414.50 kB │ gzip: 2,015.17 kB
✓ built in 4.88s
```

The build retains its plugin-timing and >500-kB chunk warnings. The main JS bundle is 12,414.50 kB / gzip 2,015.17 kB; the full warning output is preserved. Desktop CSS is byte-identical at 163,503 bytes, SHA-256 `a2ce6882f18a40306a9ed0fcce81c518dd0e0099920ca891defc3dc51c381f82`. Mobile JS/CSS remain separate lazy assets; built HTML does not eagerly preload them.

Read-only receipt/native-data check, exit 0:

```text
CHECK PASS founders-office: 49 approval hashes; 43 exact PNGs (12004144 bytes); 5 looks; 2340 occupied routes; 12 doors
CHECK PASS executive-office: 33 approval hashes; 10 exact PNGs (1985736 bytes); 1 looks; 510 occupied routes; 10 doors
CHECK PASS gift-shop: 30 approval hashes; 9 exact PNGs (3017425 bytes); 1 looks; 1587 occupied routes; 12 doors
CHECK PASS indoor-garden: 38 approval hashes; 18 exact PNGs (8269180 bytes); 1 looks; 1296 occupied routes; 16 doors
CHECK PASS staff-gym: 24 approval hashes; 21 exact PNGs (5930397 bytes); 1 looks; 1296 occupied routes; 16 doors
```

Source/public/dist and shell build check, exit 0:

```text
ASSET PASS: 174 approval hashes; 101 source/public/dist PNGs byte-exact (31206882 bytes); desktop CSS unchanged (163503 bytes); separate lazy mobile JS/CSS.
```

QA transform, exit 0:

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
```

Launcher contract, exit 0:

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

Full raw output, including warnings, is retained in
[validation-output.md](../../.local-dev/level5-m2/validation-output.md),
[full-balance](../../.local-dev/level5-m2/full-balance-accepted.log),
[full-domain](../../.local-dev/level5-m2/full-domain-accepted.log),
[full-clinical](../../.local-dev/level5-m2/full-clinical-accepted.log),
[full-player](../../.local-dev/level5-m2/full-player-accepted.log),
[typecheck](../../.local-dev/level5-m2/typecheck-accepted.log),
[build](../../.local-dev/level5-m2/build-accepted.log),
[QA transform](../../.local-dev/level5-m2/qa-transform.log),
[approved bytes](../../.local-dev/level5-m2/approved-byte-evidence.json), and
[validated source hashes](../../.local-dev/level5-m2/validated-source-hashes.json).
Focused tests additionally cover the 22 room/domain route tests, actual scene
and thumbnail drawing, old-shell equality and the unchanged build-mode helper
defaults. Supplementary QA TypeScript and launcher syntax checks exit 0 with
empty output. No browser, default-fork, Git-boundary, root aggregate or Level 5
e2e PASS is claimed; those remain manager checks in their environment.

### Manager desktop and phone QA

Use/reuse **`node tools/qa/level-four-rooms.mjs`**. Per the accepted M1 handoff,
the disposable Level 5 query intentionally shares this launcher/entry at strict
**`http://127.0.0.1:5184`**; the older proposed 5185 launcher remains superseded.
Use a **dedicated disposable Level 5 browser profile/context**, retain the query
on reload, complete the normal prototype access gate and open the new M2
campaign. Nothing reseeds an existing edited campaign.

| Review | Desktop URL | Phone-shell URL |
| --- | --- | --- |
| All five placed, Founder look 1 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&layout=phone |
| Founder look 2 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=2&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=2&layout=phone |
| Founder look 3 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=3&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=3&layout=phone |
| Founder look 4 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=4&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=4&layout=phone |
| Founder look 5 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=5&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&founderTier=5&layout=phone |
| Level 5 buildable empty prestige catalog | http://127.0.0.1:5184/level4-rooms-qa.html?level5=pre-goal&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=pre-goal&layout=phone |

Each appearance uses a separate `campaign.qa.level-five-rooms-m2.tierN` campaign.
Founder tier is synthetic appearance metadata, with no upgrade charge/receipt
or effects; do not use higher-tier preview resale as an economic audit. The
placed scenario performs real construction/door commands, remains paused at
1,999 XP and leaves inspection locked. Its new hallway reaches the existing
clinic via x35/y21-25 and runs x22-49/y21. No unlock goal was invented for rooms.

| Room instance | Top-left | Dimensions | Placed south door |
| --- | --- | --- | --- |
| room.qa.level5.founder | (23,18) | 3x3 | S2, offset 1 |
| room.qa.level5.executive | (29,19) | 3x2 | S2, offset 1 |
| room.qa.level5.gift | (34,18) | 3x3 | S2, offset 1 |
| room.qa.level5.garden | (39,17) | 4x4 | S3, offset 2 |
| room.qa.level5.gym | (45,17) | 4x4 | S2, offset 1 |

1. Inspect the scoped diff, approved-byte inventory and validation output before
   acceptance. Rerun required default-config/aggregate/boundary checks in the
   manager environment. Preserve the known thyroid failure and two existing
   domain defect skips as identified baseline limitations.
2. Open the placed desktop URL at 1600x1000 and confirm
   `location.origin === 'http://127.0.0.1:5184'`. Check all five native rooms at
   ordinary, minimum and maximum map zoom against the accepted proofs. Open
   each room: exact prices/$1 upkeep, correct footprint/one-of-one cap, Access
   ready, five declared tiers, truthful dormant effect text, sell/move controls
   and no upgrade purchase. There is no Executive hire or new activity/revenue.
3. Test each room's actual Build/inspect/sell/move/undo path. A second instance
   must reject. For simple manual placement, sell a room in the look-1 fixture,
   place it back at its table coordinates and add its south door; the prepared
   hallway remains. Verify one real construction charge, native appearance,
   cap recovery, access, sale/refund and safe repeated actions. The pre-goal URL
   also offers all five build cards without requiring new goal completion.
4. Exercise every perimeter door (12/10/12/16/16), paired doors and north-wall
   backing, adding reachable hallway where needed. Necessary furniture/contacts
   survive; fronts/wall rows are continuous without the selected door. Inspect
   Executive N2/S2 and its retained chairs specifically. Compare seating ground,
   chair-front/desk occlusion and standing approaches against the proof and
   scene-test evidence. M3-M5 will bind real new work/retail routes; do not mark
   unimplemented task movement as accepted in M2.
5. Open each separate Founder appearance URL; confirm only that office changes
   look and the other four remain byte/native-layout consistent. On phone use
   390x844, 360x740, 412x915, 844x390 and 768x1024. All five catalog/owned-room
   thumbnails and map rooms must load, Founder thumbnails must follow tier,
   loading/error must stay a whole-room placeholder, and Build navigation,
   tap targets, scrolling, close/back and Manage pause must remain usable.
6. Change cash/pause or sell/rebuild in a disposable campaign; reload its exact
   full URL twice and switch `layout=desktop` / `layout=phone`. Verify the same
   edited campaign and one set of receipts, with no reseed, duplicate fixture,
   reward, goal unlock or extension fabrication. Keep `level5` in the URL.
   Removing it in a Level 5 profile must stop before storage mutation, as in M1.
7. Use a separate disposable profile for ordinary Levels 0-4 and existing Level
   4 QA URLs. Confirm original desktop/mobile Build and room actions, cap 4 and
   no Advance to Level 5/new prestige cards. An authorized historical owner-copy
   smoke remains separate; never clear or migrate owner storage for this QA.
8. After desktop/phone browser review, the manager accepts M2, updates the
   manager-owned CURRENT_THREAD_HANDOFF and assigns the next serial M3 lane.
   Preserve approved native data and route/sample indices; activate only the
   effects/ladders whose handlers are actually implemented in later milestones.

These phone URLs select the phone shell on the PC QA origin/touch emulation;
they are not a newly exposed physical-phone service. Owner pathways remain
**START_GAME.cmd -> exact http://127.0.0.1:4173**, private phone
**START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/** and remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**, in their intended profiles.
Different origins/profiles have separate saves; 5184 fixtures do not transfer
or synchronize owner campaigns. **LOCAL ONLY checkpoint:** no GitHub backup
was created. After acceptance the manager owns the owner reminder to say
**"push to GitHub"** for a scoped audited backup.
- 2026-10-12 manager: M2 ACCEPTED. Chrome QA ?level5=rooms (desktop + &layout=phone): the five rooms present in the view model at the expected footprints (Founder 3x3, Executive 3x2, Gift 3x3, Garden 4x4, Gym 4x4); panned desktop capture shows approved Executive Office, Gift Shop, Indoor Garden and Staff Gym art with doors and continuous wall rows, no 4xx responses, no page errors. Worker: 101 PNGs byte-exact to approval receipts; balance 138, domain 3929+2 skips, content 628, player 1839 + known thyroid failure; typecheck/build PASS. M3 dispatched.
- 2026-10-12 owner: finish-page headline chosen: line 3, "Congratulations. Your reward is a report card and the opportunity to improve it." Owner direction: keep working until Level 5 is open in the owner's game on desktop (http://127.0.0.1:4173) and mobile (private Tailscale origin), then push to GitHub (backup only; no Pages publication implied).


## Level 5 M3: room effects

2026-10-11 - GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
M3 implementation and automated validation are complete. **Manager actual-diff
review, default-pool reruns and desktop/phone browser acceptance remain pending.**
This is the ownership/garden/gym lane only. Ordinary cap remains **4** until M10.
No Executive duties, gift demand/sales, goals, inspection, finish page or clinical
content/review status was activated or changed.

### Effects and ownership arithmetic

All points and timings are editorial game values from this plan and the accepted
room-upgrades catalog. Room tier R has R-1 purchased upgrades.

| Room | Arithmetic | Tier 1 / 2 / 3 / 4 / 5 | Purchase costs to tiers 2 / 3 / 4 / 5 |
| --- | --- | --- | --- |
| Founder's Office | 2 + 2(R-1) effective employee morale | +2 / +4 / +6 / +8 / +10 | $300 / $500 / $750 / $1,000 |
| Indoor Garden | 2 + 2(R-1) satisfaction after a completed 5-minute rest | +2 / +4 / +6 / +8 / +10 | $200 / $300 / $450 / $600 |
| Staff Gym | 5 + 2(R-1) stored morale after a completed 30-minute break | +5 / +7 / +9 / +11 / +13 | $250 / $375 / $550 / $750 |

Only these three implemented ladders are now `current`. Executive Office and
Gift Shop remain `future`; direct upgrade commands still reject them. All five
rooms keep the approved one-instance cap, footprints, native art and $1/hour
upkeep. Upgrades add no upkeep, staff positions, waiting admission capacity,
clinical capability, XP or FSRS changes.

- `getEmployeeEffectiveMorale(state, employee)` is the shared current-morale
  selector: stored/earned morale plus one owned-office modifier, clamped to
  0-100 at Level 5. `getAverageEffectiveStaffMorale(state)` returns its mean
  across the employed workforce, or null when empty. Display, breaks, facility
  satisfaction conditions, warning eligibility and quitting use that selector.
  Ownership includes hires after construction, requires no seated founder or
  employee conversation, survives blocked access and never rewrites stored
  morale at purchase/tick/load. Sale removes only the modifier. The existing
  `getEffectiveEmployeeMorale(employee, context)` retains its **salary
  normalization** behavior; it must not be used as the current-morale selector
  by M4/M6/M7. Praise, coffee, gym awards and nonpayment remain ordinary stored
  gains/drains. Maximum-office/zero-stored morale is 10, so the existing <=10
  quitting threshold still works under sustained nonpayment.
- Garden rests reuse the patient amenity movement owner, return/preemption APIs
  and opportunity clocks. Only eligible waiting adults enter; accepted care
  and chart opening interrupt the rest. Pediatric children/parents retain their
  paired flow. Two distinct permanent contacts reserve separately. Dispatch
  freezes room ID, seat, tier, five-minute duration and points; only five active
  minutes at the actual contact earn `garden-visit-benefit.v1`, once per real
  encounter/service operation. The actual scored satisfaction changes once
  within its existing bounds; unscored visitors retain an explicit comfort-use
  witness and never enter the scored HUD denominator or acquire learning/money.
- Gym breaks reuse **one** `take_break` policy and the existing 240-minute
  `lastBreakAtFacilityTick` cooldown. A reachable free gym contact is preferred;
  otherwise the original seven Break Room seats remain the alternative. No
  extra Break Room seats or alternating-room cooldown is created. Accepted
  care/employee work takes priority; salary accrues during travel and use. A
  frozen gym quote extends `room-upgrade-break.v1` with its actual room kind.
  Only completed work changes stored morale and last-break time, once.
- Native circulation binds 64 exact M2 single-door support routes: both Garden
  and Gym contacts at all 16 perimeter doors. Their original logical and world
  knots, repeated synchronization entries and static seating/standing transition
  remain intact. Return, care redirection and sale use real exits. An interrupted
  seated garden visitor with no exit releases the contact, retains a persisted
  blocked-return path/cursor, earns nothing and holds position until an exit
  reopens or the room is sold. Gym cancellation similarly holds safely and
  resumes its native exit after access returns. Room movement protects garden
  reservations before arrival. New quote/witness/clock/duplicate-contact readers
  are strict; no use award is fabricated or replayed on reload.

### Both shells, QA state and compatibility

The common projection binds approved Garden seated supports, Gym bench seated
and mat standing supports, real route paths, truthful activity/countdown labels,
room inspector information and the current/base/next-tier upgrade benefits.
Desktop and phone Manage > Services > Upkeep & quality share the same support
room facts, current effects, policies, upgrade increments and use counts. Both
Build room sheets use the original upgrade command/price/guards and show the
whole accepted ladder. Phone map inspection also shows the active effect and
upgrade increment. No new CSS or shell-specific game arithmetic was added.

`?level5=support` selects **campaign.qa.level-five-support-m3**, initially
paused at 1,999 XP with inspection locked. Rooms/doors, APP hire and two adult
admissions use real commands. Initial waiting locations, arrival completion
and starting satisfaction are explicitly synthetic QA setup; actual garden
reservations/routes and gym dispatch freeze through the production domain.
No completed rest/break, award, question answer or inspection unlock is seeded.
The receptionist's gym trip yields to waiting patients on Play; the APP's
standing gym contact remains observable. The existing room-only QA scenario
provides an undisturbed receptionist bench break. Existing edited campaigns
are resumed without reseeding or changing their cash/pause. Retain `level5`
on reload; phone/desktop layouts share the same disposable origin/profile.

Save schema remains 9. New garden fields and gym markers are optional and
absent from pre-M3 visits/tasks. Old ordinary support terms, salary contracts,
frozen encounters/receipts, learning history, Level 4 witnesses, legacy overdue
normalization defects and thyroid expectation are preserved. Complete Level
0-4 projection/catalog tests and all older save suites pass. Source guards also
withhold these three purchases below Level 5, even in a custom catalog context.

### Files changed and preservation

40 source/data/test/QA files (32 existing exact edits, eight new), plus this
append-only handoff:

- `apps/player/src/facility/roomUpgradeAppearance.test.ts`
- `apps/player/src/mobile/MobileInspectorSheet.tsx`
- `apps/player/src/mobile/manage/MobileServices.tsx`
- `apps/player/src/session/alertViewModels.ts`
- `apps/player/src/session/buildModePresentation.test.ts`
- `apps/player/src/session/buildModePresentation.ts`
- `apps/player/src/session/characterActivityPresentation.ts`
- `apps/player/src/session/levelFiveRoomsViewModels.test.tsx`
- `apps/player/src/session/levelFiveSupportPresentation.ts`
- `apps/player/src/session/levelFiveSupportViewModels.test.tsx`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/LevelFiveSupportFacts.tsx`
- `apps/player/src/ui/ServiceIncomePanel.tsx`
- `apps/player/src/ui/types.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/level-five-rooms.test.ts`
- `packages/balance-config/src/level-five-support-routes.json`
- `packages/balance-config/src/level-five-support.ts`
- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/balance-config/src/room-upgrades.test.ts`
- `packages/balance-config/src/room-upgrades.ts`
- `packages/game-domain/src/departure-risk-alerts.ts`
- `packages/game-domain/src/facility-experience.ts`
- `packages/game-domain/src/guidance-tips.ts`
- `packages/game-domain/src/index.ts`
- `packages/game-domain/src/level-five-support.ts`
- `packages/game-domain/src/level-three-support.ts`
- `packages/game-domain/src/patient-amenities.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/room-upgrade-support.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/staff.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/level-five-rooms.test.ts`
- `packages/game-domain/tests/level-five-support.test.ts`
- `tests/fixtures/level-five-state.ts`
- `tests/fixtures/level-five-support.ts`
- `tools/qa/level-five-state-bootstrap.ts`
- `docs/execplans/level5-launch-plan-20261010.md` - this append only.

Before-images and SHA-256 receipts were captured without Git. **3,544 protected
intake paths are byte-unchanged**, including clinical content, approved room
proofs/PNG assets, prototype balance/cap, dependency lockfile, launchers, mobile
styles, M1 foundation and the manager-owned CURRENT_THREAD_HANDOFF. Every owned
source/data/test/QA file is UTF-8 without BOM, LF. The plan preserves its complete
prior bytes, including the manager's concurrent October 12 owner-copy/direction
append, and receives only new LF text. Source/route lineage, final hashes and
actual scoped diff are in `.local-dev/level5-m3/`. No agents, Git, installs,
external messages, browser/owner-storage actions, listener, publish or deploy.

### Validation: exact commands and output

Used the **checked-in default configurations**, **`--pool=threads`**, no
exclusions or alternative config, and this preload on every command:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR = '1'
```

Commands ran through `cmd.exe /d /c` solely to capture stdout/stderr into the
linked logs. Blocks below preserve exact output with ANSI controls removed;
complete raw logs and command/exit receipts remain linked. The required FULL
suites contain every test; the two existing domain defect skips remain unchanged.
Earlier work-in-progress failures (an import duplication, legacy break count,
old inactive-Founder expectations and an ES library mismatch) were corrected;
they are retained in scratch logs and are not remaining exceptions.

**balance** - `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  17 passed (17)
      Tests  138 passed (138)
   Start at  21:11:48
   Duration  1.02s (transform 3.93s, setup 0ms, import 8.80s, tests 308ms, environment 2ms)
```

[Complete balance log](../../.local-dev/level5-m3/full-balance.log).

**domain** - `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  142 passed | 1 skipped (143)
      Tests  3977 passed | 2 skipped (3979)
   Start at  21:28:28
   Duration  159.96s (transform 10.26s, setup 0ms, import 64.77s, tests 562.32s, environment 8ms)
```

[Complete domain log](../../.local-dev/level5-m3/full-domain-final.log).

**clinical-content** - `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  21:11:48
   Duration  8.71s (transform 28.15s, setup 0ms, import 93.29s, tests 7.70s, environment 10ms)
```

[Complete clinical-content log](../../.local-dev/level5-m3/full-clinical.log).

**player** - `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`; exit **1**.

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 1220ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 105ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 211 passed (212)
      Tests  1 failed | 1854 passed (1855)
   Start at  21:28:28
   Duration  57.53s (transform 14.27s, setup 0ms, import 109.40s, tests 97.32s, environment 15ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

[Complete player log](../../.local-dev/level5-m3/full-player-final.log).

**typecheck** - `npm.cmd run typecheck`; exit **0**.

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

[Complete typecheck log](../../.local-dev/level5-m3/final-typecheck.log).

**build** - `npm.cmd run build --workspace @gamify-surgery/player`; exit **0**.

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 715 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-Cli3yTCw.css                                   38.59 kB │ gzip:     6.67 kB
dist/assets/index-LZbQwf0F.css                                        163.50 kB │ gzip:    30.40 kB
dist/assets/MobileEntryPresentation-CLs5oM9T.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-FeDCYlc2.js                                   114.45 kB │ gzip:    30.39 kB
dist/assets/index-DAim_RQc.js                                      12,461.27 kB │ gzip: 2,022.89 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (86%)
  - vite:prepare-out-dir (7%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.88s
```

[Complete build log](../../.local-dev/level5-m3/final-build.log).

**QA transform** - `node tools/qa/level-four-rooms.mjs --check`; exit **0**.

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
```

[Complete QA transform log](../../.local-dev/level5-m3/qa-check-final.log).

**final presentation** - `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/levelFiveSupportViewModels.test.tsx src/session/levelFiveRoomsViewModels.test.tsx`; exit **0**.

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/session/levelFiveSupportViewModels.test.tsx src/session/levelFiveRoomsViewModels.test.tsx


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  21:31:28
   Duration  3.74s (transform 4.13s, setup 0ms, import 5.66s, tests 1.37s, environment 0ms)
```

[Complete final presentation log](../../.local-dev/level5-m3/presentation-final.log).

Only the previously known thyroid failure remains:
`src/session/surgeryCenterServicePreviews.test.ts:85:52` expects
"Off-site thyroid fine-needle aspiration" in the dynamic pending label. Its
source and expectation are unchanged. Full balance **138**, domain **3,977 +
2 existing skips**, clinical content **628**, player **1,854 + 1 known failure**,
all seven root typechecks and direct production build pass as described above.
The final display separator and support-QA tab title are cosmetic follow-ups;
the shared presentation check passes 16/16, with no gameplay change.

[Validation receipts](../../.local-dev/level5-m3/validation.json),
[preservation and final source hashes](../../.local-dev/level5-m3/preservation.json),
[actual scoped diff](../../.local-dev/level5-m3/scoped.diff), and
[focused interruption tests](../../.local-dev/level5-m3/support-interruptions.log).
The existing production chunk-size warning remains; both shells are still lazy
and the desktop/mobile CSS files retain their earlier hashes/names. No browser
or physical-phone PASS is claimed.

### Manager desktop and phone QA

1. Inspect the scoped diff/receipts and rerun manager default-pool/aggregate
   checks. Start/reuse **`node tools/qa/level-four-rooms.mjs`**. Use a dedicated
   disposable Level 5 browser context, retain the exact query and complete the
   normal prototype access gate. Confirm
   `location.origin === 'http://127.0.0.1:5184'`.
2. Open **http://127.0.0.1:5184/level4-rooms-qa.html?level5=support&layout=desktop**
   at 1600x1000. The five rooms are at their M2 sites (Garden x39/y17, Gym
   x45/y17). Pan north if necessary. While paused, inspect both adults and
   employees: Garden routes name the Indoor Garden; gym tasks name their
   actual contact/use. Staff effective morale is stored +2, before any use.
   Play at 1x/4x: the adults reach the two retained seats, rest five active
   minutes, receive +2 once and walk back. The receptionist's optional gym
   trip yields to patient demand; the APP reaches the standing mat, completes
   30 active minutes, receives +5 once and returns. No XP, service fee,
   inspection unlock or management round is created by these uses.
3. Repeat the same campaign at
   **http://127.0.0.1:5184/level4-rooms-qa.html?level5=support&layout=phone**
   at 390x844, 360x740, 412x915, 844x390 and 768x1024. Check identical actor
   routes, ground/cushion contacts, layering, labels, effect arithmetic,
   >=44px targets, local scrolling/back, Manage pause/restoration and page
   errors. These are phone-shell URLs on the PC QA origin, not a newly
   exposed physical-phone service.
4. In both shells open Manage > Services > Upkeep & quality, Employees, room
   inspector and Build room actions. Verify +2/4/6/8/10 Founder/Garden and
   +5/7/9/11/13 Gym, the exact four prices and current/next amounts. Upgrade
   during a route/rest/break: the accepted old quote stays frozen; later
   use gets the new tier. Executive/Gift purchases and mechanics stay unavailable.
5. For an undisturbed **seated bench** break and reversible ownership checks,
   use the existing separate room-only campaign:
   **http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&layout=desktop**
   or **http://127.0.0.1:5184/level4-rooms-qa.html?level5=rooms&layout=phone**.
   With no waiting patients, the receptionist can use the bench after arriving.
   Office salary/praise/coffee/load/sale checks must preserve stored morale and
   remove only ownership. Founder appearance preview URLs with `founderTier=`
   remain synthetic tier metadata; use real tier-1 upgrade purchases for cash
   reconciliation instead of treating higher-tier preview resale as earned value.
6. Reload while walking, seated, returning and after each award; switch shells
   in the same profile. Compare saved task/quote/cursor/dwell/last-break/witness
   fields and one receipt/award. Open a scored chart during a rest: it turns
   around immediately for care and earns no incomplete-rest bonus. Exercise
   waiting unscored APP visitors and confirm their witness does not change
   scored HUD samples, Clinical XP, reviews or learning settlements. Pediatric
   child/parent waiting and clinical care remain paired.
7. Close the used door during arrival, seated use and return, then reload.
   No completed-use bonus or timestamp may appear for interrupted work. Fully
   blocked actors hold safely with their contact released; reopening an exit
   resumes native travel. Try another entrance, every door/corner/backing
   selection and sale during use, including sale after a blocked return.
   No walk-through of a closed wall, duplicate contact, stranded reservation
   or renderer freeze is acceptable. Garden movement must reject before an
   outbound reservation clears. Sale/refund remains the original transaction.
8. After a completed gym break, offer the ordinary Break Room and remove gym
   access: no second reward before the same 240-minute cooldown. Confirm the
   original seven seats and normal wages; exercise training, care preemption,
   firing, clamped morale/satisfaction and sustained nonpayment. Max office +
   zero stored morale must still quit at effective 10.
9. Use separate ordinary Level 0-4 contexts for desktop/phone smoke. Cap 4,
   original campaigns and all existing behavior remain; no prestige cards or
   Level 5 transition appear there. Do not remove `level5` from a Level 5 QA
   profile or clear/transfer owner storage to replay a fixture. After actual
   browser acceptance, the manager updates its handoff and assigns M4.

Owner pathways stay **START_GAME.cmd -> exact http://127.0.0.1:4173**, private
phone **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**
and remote **https://melissarowlandc-afk.github.io/GamifySurgery/**. Different
origins/profiles have separate saves; these disposable 5184 fixtures do not
transfer/synchronize campaigns. **LOCAL ONLY checkpoint:** no GitHub backup
was created. The manager retains acceptance and the owner reminder to say
**"push to GitHub"** for the scoped audited backup; this worker's No-Git brief
remains binding.
- 2026-10-12 manager: M3 ACCEPTED. Chrome QA ?level5=support (desktop): view-model polling shows both waiting adults (Morgan Vale, Jordan Ellis) route through the Garden door and become seated at the two retained chairs (40.1/40.9, 19.275), correctly layered in front of chair backs; APP observed on the Gym standing mat then returning; no page errors. Worker suites: balance 138, domain 3977+2 skips, content 628, player 1854 + known thyroid failure; typecheck/build PASS. M4 dispatched.

## Level 5 M4: Executive

Worker: GPT-6.1 Sol (`max`), one bounded M4 lane. **Implemented and worker-validated; manager acceptance pending.** Re-read AGENTS, this plan including binding M0/follow-ups and M1-M3 acceptance, the Level 4 plan and the mobile plan before implementation. No agents, Git, installs, commits, push, publication, deployment or external messages. The manager owns `CURRENT_THREAD_HANDOFF.md` and its browser/aggregate acceptance.

### Implementation and lifecycle

- `staff.executive` unlocks only at Level 5, costs $600, defaults to **$45/game hour**, allows $35-$65 in $2 steps, and uses the existing salary/morale/payroll system. One facility-wide Executive and one real Executive Office home/desk; no clinical workload or capability. Only approved `future-roster20-v5.003` and `.004` enter this role's hire pool. Approved pose/art/hash files are unchanged.
- The Executive walks the exact approved native door route, including retained N2/S2 furniture, sits at `executiveChair`, and performs one daily management round per 600-minute operating day. Walking is excluded from work. The accepted day/employee/office/tier/duration/effects/contact/progress are persisted. A completed approach releases traversed doors while retaining its desk contact; `routeMotion.ts` is byte-identical to the before-image.
- The scheduler runs before optional breaks, uses ordinary staff movement and existing training/break policies, and resumes unfinished same-day work after training or restored access. Blocked access releases the contact and pauses progress. Firing or office sale cancels unfinished work and removes eligibility for new terms. An unfinished prior-day round expires; cancellation/firing/re-hire cannot manufacture another same-day award. Completion records its once-applied marker and awards stored morale only to then-employed staff, with existing 0-100 clamps. Earned morale and already accepted visit/stock quotes remain earned/frozen when the Executive is later lost.
- All four outputs use the employee tier frozen at round acceptance. New comfort, preparation and supplier quotes require a completed round for today plus the same installed operational Executive/home. Training or busyness retains installed coverage. Loss of employee/home clears active terms; loss of access makes them ineligible. Expiry occurs at the next day boundary.
- Scored care freezes comfort when its real destination is accepted and applies it only at completed settlement. An onsite service visitor freezes it at successful room/provider reservation **before the care walk**, then receives one explicit applied witness at completed service. A frozen zero quote prevents later backdating. Unscored visitors add no scored HUD sample, Clinical XP, FSRS/review/learning settlement or clinical authority. The final regression test fires the Executive during a real accepted visitor's walk, reloads, and verifies its old quote applies once.
- Supplier stock quotes freeze after existing pharmacist reductions; fulfilled receipts already use the discounted stock amount. Actual saved stock cents are counted once behind the existing transaction guard. Upkeep uses the existing minute-accrual/posting boundary, after technical-outage relief, with a lazy undiscounted accrual shadow and fractional reduction carry. Its savings counter is the difference between real undiscounted and charged posting cents. Savings reduce expenses; they are never gross income, a second cash rebate, a wage discount or a catalog price rewrite.
- `getExecutivePreparationQuote` exposes persisted qualified terms for M7: baseline 60 minutes, one accepted ceiling, and frozen round/employee/tier/reduction metadata. M4 adds no inspection booking, scoring, actor, finish, progression or Gift Shop behavior. The live cap remains **4**. Schema 9 and missing optional fields remain compatible with existing saves; no new Executive fields are inserted into Level 0-4 accepted training snapshots.
- Desktop and mobile use one shared four-effect model and facts component. The existing Employees root keeps compact role tiles and one-tap role/employee details. Executive hiring shows $600/$45, four duties and actual recent funded contribution/current-versus-projected cash flow. Employee details show activity, current/today/next-tier effects and the existing training action. Round/preparation details are in a local disclosure. Both Money cost views show the supplier upkeep reduction, unchanged payroll and actual posted stock/upkeep savings; frozen visit comfort appears in both chart/service views. Services > Upkeep & quality exposes the same terms without an inspection action.

### Files changed

All source edits use **UTF-8 without BOM, LF**. Nine new files and fifty existing source/test/QA files, plus this appended handoff. The [complete file list and line counts](../../.local-dev/level5-m4/changed-files.json) and [actual diff against captured before-images](../../.local-dev/level5-m4/scoped.diff) include every path below.

- Balance/catalog: `packages/balance-config/src/level-five-executive.ts` **new**, `level-five-executive.test.ts` **new**, `employee-training.ts`, `employee-training.test.ts`, `prototype-balance.ts`, `room-upgrades.ts`, `room-upgrades.test.ts`, `level-five-rooms.test.ts`, `level-five-schema.test.ts`, `level-four-rooms.test.ts`, `level-five-support-routes.json`, `index.ts`.
- Domain implementation: `packages/game-domain/src/executive-management.ts` **new**, `level-five-types.ts`, `level-five-state.ts`, `level-five-support.ts`, `staff.ts`, `room-capacity.ts`, `employee-training.ts`, `employee-training-effects.ts`, `level-three-support.ts`, `selectors.ts`, `reducer.ts`, `retail-operations.ts`, `service-operations.ts`, `persistence.ts`, `types.ts`, `index.ts`, `characterStillCatalog.ts`.
- Domain tests: `packages/game-domain/tests/level-five-executive.test.ts` **new**, `level-five-rooms.test.ts`, `level-five-state-persistence.test.ts`; `packages/game-domain/src/characterStillCatalog.test.ts`. Historical assertions change only where M4 activates the previously dormant Executive; the two existing defect skips and the known thyroid expectation are unchanged.
- Shared player/view: `apps/player/src/session/executiveViewModels.ts` **new**, `levelFiveExecutiveViewModels.test.tsx` **new**, `viewModels.ts`, `managementViewModels.ts`, `employeeTrainingViewModels.ts`, `characterActivityPresentation.ts`, `buildModePresentation.ts`, `levelFiveRoomsViewModels.test.tsx`, `levelFiveStateQa.test.ts`; `apps/player/src/art/characterStillRegistry.ts`, `characterStillRegistry.test.ts`.
- Desktop/shared UI: `apps/player/src/ui/ExecutiveManagementFacts.tsx` **new**, `executiveManagement.css` **new**, `types.ts`, `StaffPanel.tsx`, `ServiceIncomePanel.tsx`, `MoneyPanel.tsx`, `ChartPanel.tsx`.
- Phone UI: `apps/player/src/mobile/manage/MobileEmployees.tsx`, `MobileMoney.tsx`, `MobileServices.tsx`; `apps/player/src/mobile/MobileChart.tsx`.
- Disposable QA: `tests/fixtures/level-five-executive.ts` **new**, `tests/fixtures/level-five-state.ts`, `tools/qa/level-five-state-bootstrap.ts`, `tools/qa/level-four-rooms.mjs`.
- Documentation: **append only** to `docs/execplans/level5-launch-plan-20261010.md`. The prior plan bytes, AGENTS, the manager handoff, Level 4/mobile plans, package/lock/Vite config, generated art registries, clinical sources and `routeMotion.ts` remain unchanged. Before-images/hashes cover 1,354 files; [preservation receipt and final hashes](../../.local-dev/level5-m4/preservation.json) make the shared-tree review explicit. Scratch logs/before-images/receipts live only in `.local-dev/level5-m4/`.

### Arithmetic

These are the binding editorial game values, not clinical claims. Strength is additive, `1 + 0.25(T-1)`, applied once to each base output. Training strengthens outputs only; it does not shorten the management round or clinical work.

| Employee tier | Strength | Morale once/day | Comfort per accepted completed visit | Preparation reduction | Preparation raw -> accepted minutes | Stock/upkeep reduction |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1.00x | +1.00 | +1.00 | 5.00% | 57 -> 57 | 1.00% |
| 2 | 1.25x | +1.25 | +1.25 | 6.25% | 56.25 -> 57 | 1.25% |
| 3 | 1.50x | +1.50 | +1.50 | 7.50% | 55.5 -> 56 | 1.50% |
| 4 | 1.75x | +1.75 | +1.75 | 8.75% | 54.75 -> 55 | 1.75% |
| 5 | 2.00x | +2.00 | +2.00 | 10.00% | 54 -> 54 | 2.00% |

Office-only duration is `30 * (1 - 0.05(R-1))`: raw **30/28.5/27/25.5/24**, quoted once with `ceil` as **30/29/27/26/24** active seated minutes. Its four upgrades remain **$450/$750/$1,150/$1,500 = $3,850**. Employee training uses the existing 60-minute sessions and two-seat Training Room, **$100/$200/$300/$400 = $1,000**. Wages accrue normally during walking, seated work, idle, training, breaks and interruption.

Stock arithmetic is `existing eligible stock cost * (1 - supplierPercent/100)`, rounded once at quote acceptance. The actual tier-2 Founder coffee regression freezes `$1 * 0.9875 = $0.9875 -> $0.99`, survives firing/reload, posts **$0 gross / $0.99 stock / -$0.99 cash** once and records **1 cent** saved once. Tier 1-5 upkeep tests compare actual charged operating postings against a no-terms control and reconcile the difference exactly to the posted savings counter, with identical wages. Technical relief and pharmacist reductions precede supplier terms.

Option-B pay is preserved without another rebase. The approved full optional cluster's capital worksheet remains **$5,800 rooms + $600 hire = $6,400**, excluding access, and **$5 upkeep + $45 wage = $50/hour** before suppliers. The plan's funded-reader worksheet is `66.104167 + 7.50 - 3 - 5 - 45 = +$20.604167/hour` without supplier terms. Its stated 90% cost-qualification assumption gives `.009 * (35 + 5.729167) = $0.366563/hour` at tier 1, net **$20.970729/hour**; tier 5 gives `.018 * 40.729167 = $0.733125/hour`, net **$21.337292/hour**. The narrow unfunded worksheet remains `31.50 + 4.50 - 5 - 45 = -$14/hour` before suppliers. These are **the plan's analytical M5/M8 worksheet, not an M4 measured full-cluster profit claim**. M4 does not implement future gift demand or manufacture income to fund its $45 wage; both hire/Money views use actual settled contribution and current obligations.

### Validation: exact commands and output

Used checked-in default workspace configurations with the authorized **`--pool=threads`**, existing worker limits and this existing preload. No test exclusions, alternative configs, timeout edits or dependency installation. Complete captured logs are UTF-8/LF; result blocks below remove ANSI controls only. PowerShell's native-stderr capture wrapper, where present, is retained in the linked full logs.

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node scripts/verify-launcher-contract.mjs
node tools/qa/level-four-rooms.mjs --check
```

**Full balance** - `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  18 passed (18)
      Tests  141 passed (141)
   Start at  22:30:15
   Duration  842ms (transform 1.96s, setup 0ms, import 5.09s, tests 230ms, environment 2ms)
```

[Complete log](../../.local-dev/level5-m4/full-balance.log).

**Full game-domain** - `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  143 passed | 1 skipped (144)
      Tests  4020 passed | 2 skipped (4022)
   Start at  22:44:44
   Duration  144.42s (transform 6.38s, setup 0ms, import 59.54s, tests 505.70s, environment 8ms)
```

[Complete log](../../.local-dev/level5-m4/full-domain.log).

**Full clinical-content** - `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads`; exit **0**.

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  22:30:15
   Duration  5.57s (transform 15.61s, setup 0ms, import 56.62s, tests 6.74s, environment 9ms)
```

[Complete log](../../.local-dev/level5-m4/full-clinical.log).

**Full player** - `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`; exit **1**.

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 561ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 62ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 212 passed (213)
      Tests  1 failed | 1867 passed (1868)
   Start at  22:49:47
   Duration  42.93s (transform 8.61s, setup 0ms, import 80.87s, tests 73.93s, environment 11ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

[Complete log](../../.local-dev/level5-m4/full-player.log).

**Final focused Executive lifecycle/quotes** - `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/level-five-executive.test.ts`; exit **0**.

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads tests/level-five-executive.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  22:44:11
   Duration  15.56s (transform 1.27s, setup 0ms, import 1.69s, tests 13.79s, environment 0ms)
```

[Complete log](../../.local-dev/level5-m4/quote-before-walk.log).

**Root typecheck** - `npm.cmd run typecheck`; exit **0**.

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

[Complete log](../../.local-dev/level5-m4/final-typecheck.log).

**Direct player production build** - `npm.cmd run build --workspace @gamify-surgery/player`; exit **0**.

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 720 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.42 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-Cli3yTCw.css                                   38.59 kB │ gzip:     6.67 kB
dist/assets/index-DMxcgkh-.css                                        164.05 kB │ gzip:    30.50 kB
dist/assets/MobileEntryPresentation-BYU3n_K_.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-D9b6dSPj.js                                   114.93 kB │ gzip:    30.44 kB
dist/assets/index-Dxr7ah5j.js                                      12,484.47 kB │ gzip: 2,029.60 kB

npm.cmd : [PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
At line:4 char:1
+ npm.cmd run build --workspace @gamify-surgery/player *> .local-dev/le ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([PLUGIN_TI...is a breakdown::String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
  - forbid-private-clinical-modules (84%)
  - vite:prepare-out-dir (7%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: 
https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.28s
```

[Complete log](../../.local-dev/level5-m4/final-build.log).

**Read-only launcher contract** - `node scripts/verify-launcher-contract.mjs`; exit **0**.

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

[Complete log](../../.local-dev/level5-m4/final-launcher.log).

**Disposable QA transform** - `node tools/qa/level-four-rooms.mjs --check`; exit **0**.

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
```

[Complete log](../../.local-dev/level5-m4/final-qa-check.log).

The two domain skips remain the existing Level 4 DEFECT-M9 quarantine (idle deadline normalization on load; APP presence influencing scored case identity). The only player failure remains unchanged at `src/session/surgeryCenterServicePreviews.test.ts:85:52`, expecting "Off-site thyroid fine-needle aspiration" in the dynamic pending label. No new failure is accepted. The ordinary production chunk-size warning remains. No manager boundary/default-pool/browser or physical-phone PASS is claimed; the manager retains V7/V8 and manual acceptance.

[Command/exit receipts](../../.local-dev/level5-m4/validation.json), [preservation/final source hashes](../../.local-dev/level5-m4/preservation.json), [scoped diff](../../.local-dev/level5-m4/scoped.diff), and [final focused Executive quote/lifecycle output](../../.local-dev/level5-m4/quote-before-walk.log).

### Manager QA: desktop and phone

The existing strict 5184 QA server is extended, not replaced. Worker HTTP read verified **200**, the dedicated QA bootstrap and `location.origin` **`http://127.0.0.1:5184`** on the phone Executive URL. No listener was started/stopped or browser storage touched by this worker. Start/reuse **`node tools/qa/level-four-rooms.mjs`**; use a dedicated disposable Level 5 profile, keep `?level5=` on every reload and complete the normal prototype access gate. Existing campaigns resume rather than reseed.

| Scenario | Desktop URL | Phone URL | What to inspect |
| --- | --- | --- | --- |
| Real daily round; burgundy Executive .003 | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive&layout=phone | Morgan Blake, office desk, four duties, training and actual savings |
| Navy Executive .004, separate campaign | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-look2&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-look2&layout=phone | Jordan Lane's approved look/poses and identical role/arithmetic |
| Hire from the ordinary tile | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-hire&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-hire&layout=phone | $600 hire, $45/hr default, automatic home, maximum one, honest funding projection |
| Existing APP service visitors | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-visits&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=executive-visits&layout=phone | Real accepted comfort quotes, one completion witness/receipt, no XP or fake scored sample |

1. Inspect the scoped diff and exact validation receipts, then rerun manager acceptance checks. Each M4 fixture starts paused with 1,999 XP, real room/hire commands, an accessible Training Room and **no seeded daily award or savings**. The Office is the existing M2 3x2 at x29/y19; pan north if needed. Its approved appearance/door masks are unchanged. The fixture is a partial synthetic QA clinic, not the funded M8 economy reference.
2. At desktop 1600x1000, press Play at 1x/4x. Watch the Executive arrive, follow the native route to the real chair, sit at the desk and perform the accepted 30-minute tier-1 round. Employee activity and management detail must agree with map work. Completion gives current staff +1 once and today's three continuing terms. Optional ordinary Gym breaks may follow; the Executive returns to its desk. Never count walking as work or a seated cosmetic visit as another award.
3. Employees: open the Executive role/hire tile and then employee detail. Verify $600/$45, $35-$65/$2 pay actions, maximum one, four mild jobs, real current/projection funding and current/today/next-tier labels. Train using the existing action/confirmation through $100/$200/$300/$400. Training occupies the existing 60-minute/two-seat system; today's frozen terms stay at their accepted tier and the next daily round uses the new employee tier. Upgrade Office through its four real prices; current/next raw-and-ceiled durations change, while an accepted round keeps its old quote. Training must not add a second duration reduction.
4. Money > Costs and Services > Upkeep & quality: verify the supplier upkeep row is a small **expense reduction**, salaries remain $45 plus other actual wages, stock receipts already show lower costs, and posted stock/upkeep counters reconcile with cash/operating postings. No supplier income or second rebate. Before completion/unqualified terms, savings are inactive. Preparation shows baseline/qualified raw -> ceiling without Book inspection. The lack of a funded income stream may honestly show a deficit.
5. On `executive-visits`, watch ordinary APP visitors. Their accepted comfort appears before their care walk and is applied once at completed service. Fire the Executive during a quoted walk: the old quote survives and a later new visit gets zero; no fake scored chart/HUD completion or XP appears. Reload before/after acceptance and completion; compare quote identity/tier/points/applied tick and one service receipt. Scored care likewise shows its actual accepted effect at completed settlement, not later training applied retroactively.
6. Pause/reload while arriving, walking, seated, training, paused and after completion; switch desktop/phone in the same profile. No duplicate round, morale, savings, purchase receipt or reset progress. Let tick 600 roll to the next operating day: old terms expire, unfinished work earns nothing, and exactly one fresh round is scheduled. Fire/re-hire on the same day cannot replay its award. New hires after a completed award retain normal hire/Founder ownership morale and wait for a later round's stored award.
7. Test interrupted access without bypassing the existing occupied-door removal guard: selling the upstream Hallway at x35/y25 (`room.level5.rooms.link.25`) makes the Office unreachable and pauses/relinquishes the work contact. Reload, restore a Hallway at x35/y25 and observe only remaining work resume. Removing an occupied office door should still reject. Fire the Executive or sell its Office with the existing named-employee confirmation: no future qualified quotes, no stale desk task/contact, earned colleague morale retained and old visit/stock quotes frozen. Inspect all ten doors, N2/S2 retained chairs, exits after breaks/training, payroll shortfall and clamped morale/satisfaction in manager browser QA.
8. Repeat every player-facing step in the phone shell at **360x740, 390x844, 412x915, 844x390 and 768x1024**. Check compact root tiles, one-tap details, >=44px actions/disclosure, local scrolling without a long root list, Back/close, Manage pause/restoration, native actor contacts/depth, fit and page errors. The worker's common-model/DOM tests pass; actual small-phone rendering remains manager acceptance.
9. Smoke ordinary Level 0-4 desktop/mobile saves through their usual entry. Live cap remains 4 and their hire/catalog/training/finance/chart behavior remains unchanged. Do not remove `level5` from a disposable Level 5 profile, reset owner storage or transfer a campaign to replay a fixture.

Owner pathways remain **START_GAME.cmd -> exact http://127.0.0.1:4173**, private phone **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/** and remote **https://melissarowlandc-afk.github.io/GamifySurgery/**. Different origins/profiles have separate saves; the 5184 fixtures do not transfer or synchronize campaigns. **LOCAL ONLY checkpoint:** this worker made no GitHub backup. The manager retains acceptance and the scoped backup under the owner's binding finish-M10-then-push direction; this No-Git worker does not push or publish.
- 2026-10-12 manager: M4 ACCEPTED. Chrome QA ?level5=executive (desktop): Executive Morgan Blake walks from the entrance through the hallways to the Executive Office desk chair (29.35, 18.95) and stays for the round; desktop Management shows $45/hr, 1.00x management strength over morale/comfort/preparation/suppliers, gym break +5; phone Manage > Executive tile shows hire cap 1/1, $600/$45, four mild effects and the approved portrait, no horizontal scroll, no page errors. Polish queued for M9: the Executive role description is verbose on phone. Worker suites: balance 141, domain 4020+2 skips, content 628, player 1867 + known thyroid failure; typecheck/build PASS. M5 dispatched.


## Level 5 M5: Gift Shop sales

Date: 2026-10-12. Worker: GPT-6.1 Sol; bounded M5 implementation and validation.
Status: implemented; worker checks complete with only the allowed thyroid failure.
Manager desktop/phone browser acceptance remains pending. No Git, installs,
sub-agents, publication, owner-storage changes or later-milestone behavior.

### Implementation, reservations and compatibility

- Activated the existing 3x3 Gift Shop capability and its four accepted purchases
  ($200/$300/$450/$600). Its native art, footprint, one-instance cap and two queue
  places are unchanged. Normal/premium stock and dispensing metadata remain the
  original $15/$6 and $25/$12, with two minutes at the actual pay contact.
- Added one lazily initialized, versioned facility demand clock and sequence.
  A separate gift-only adult stream requests one normal gift every 120 active game
  minutes without a coin flip. It does not require appointments or an Executive.
  Its seed, identities, actor allowance and three-customer capacity are separate
  from ordinary retail and clinical selection. A blocked/stock/queue opportunity
  may fail; upgrades, room copies and reload never replay or multiply it.
- Retained existing eligible idle adult/staff shopping and care priority. Linked
  pediatric pairs and busy staff do not divert. Final frozen gross must fit the
  $20 recurring staff/founder, $30 ordinary-visitor or $40 gift-only allowance,
  including previous spending. Founder use consumes stock with $0 gross.
- Quotes bind to the shop actually used. The accepted room multiplier and M4
  supplier stock quote survive upgrade, firing and reload. Arrival alone earns
  nothing; dispensing posts one cent-exact receipt and one stock saving. Stock
  cash is checked at acceptance and again before dispensing. There is no second
  rebate, supplier income, new payroll rule or price/cadence rebase.
- Pay, queue1 and queue2 are exclusive reservations. Added only the 36 exact
  single-door pay/queue logical-and-walking routes from accepted M2 data to the
  shared operational table. Native synchronization knots/indices are retained.
  Queue promotion and exit join approved paths. Block/sale/load release checkout
  reservations; a blocked exit holds its real cursor and retries when connected.
  Selling captures an exit before removal. Required work clears checkout and
  blocked-return markers and takes over movement. A gift shopper can return to
  its original protected room without opening other care rooms.
- Gift technical-outage upkeep uses the existing 60-minute/20% policy; idleness,
  busyness and lack of stock cash do not become technical outages. New marked save
  fields are optional and strictly parsed. Valid overdue clocks survive reload.
  Schema 9, ordinary cap 4, Level 4's successor, frozen encounters, FSRS and old
  unmarked retail semantics remain unchanged. No inspection/unlock/finish logic
  was added. Existing Level 4 DEFECT-M9-1/M9-2 remain identified, not broadly fixed.

Both shells use the same price/stock/net facts, actual operation quotes, adult
shopper age/sex and walking/queue/self-service countdown labels. Services has
active Gift/Premium gift tiles; desktop Money has a Gift Shop disclosure and
phone Money a one-tap Gift Shop tile. Phone facts stay in the selected detail
sheet, with Back and existing compact roots. The Gift Shop receipt subtotal is
explicitly the retained receipt window; older payments remain in clinic totals.
No lifetime gift subtotal is fabricated from retired rows.

The first full runs exposed stale gift-future/QA-Executive assertions and an M4
stock test that relied on optional gifts being unavailable. Those tests now
state the active catalog/fixture and isolate the explicitly requested coffee
transaction. The real regression was a cancelled staff trip retaining a blocked
return marker. A two-line service-operations hook releases only marked Gift Shop
checkout state; focused and full Executive/clinical regressions pass. Additional
gift tests cover private-home return and required-work takeover after a block.

### Files changed and preservation

The scoped source/test/QA changes are listed below; this plan is append-only.
The worker inspected its filesystem before-images and actual scoped diff without
Git. The final preservation receipt verifies UTF-8 without BOM, LF, no removals,
and the unchanged files outside the listed edits.

- `apps/player/src/facility/levelFiveGiftRouteMotion.test.ts`
- `apps/player/src/mobile/manage/MobileMoney.tsx`
- `apps/player/src/mobile/manage/MobileServices.tsx`
- `apps/player/src/session/buildModePresentation.ts`
- `apps/player/src/session/characterActivityPresentation.ts`
- `apps/player/src/session/giftShopViewModels.ts`
- `apps/player/src/session/levelFiveGiftRetailViewModels.test.tsx`
- `apps/player/src/session/levelFiveRoomsViewModels.test.tsx`
- `apps/player/src/session/levelFiveStateQa.test.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/giftShop.css`
- `apps/player/src/ui/GiftShopFacts.tsx`
- `apps/player/src/ui/MoneyPanel.tsx`
- `apps/player/src/ui/ServiceIncomePanel.tsx`
- `apps/player/src/ui/types.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/level-five-gift-retail.test.ts`
- `packages/balance-config/src/level-five-gift-retail.ts`
- `packages/balance-config/src/level-five-rooms.test.ts`
- `packages/balance-config/src/level-five-rooms.ts`
- `packages/balance-config/src/level-five-support-routes.json`
- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/balance-config/src/room-upgrades.test.ts`
- `packages/balance-config/src/room-upgrades.ts`
- `packages/game-domain/src/appearance.ts`
- `packages/game-domain/src/displaced-routing.ts`
- `packages/game-domain/src/gift-retail.ts`
- `packages/game-domain/src/index.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/retail-operations.ts`
- `packages/game-domain/src/room-upkeep-outages.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/level-five-executive.test.ts`
- `packages/game-domain/tests/level-five-gift-demand-integration.test.ts`
- `packages/game-domain/tests/level-five-gift-retail.test.ts`
- `packages/game-domain/tests/level-five-rooms.test.ts`
- `packages/game-domain/tests/room-upgrade-revenue.test.ts`
- `tests/fixtures/level-five-gift-retail.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/level-five-state-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`
- `docs/execplans/level5-launch-plan-20261010.md` (this handoff only)

Protected originals include routeMotion.ts, approved room presentations/assets,
prototype-balance.ts, clinical source/data, package/lock/config files, AGENTS.md,
the Level 4/mobile plans and CURRENT_THREAD_HANDOFF.md. The manager retains the
global handoff. The read-only promotion check separately confirms 101 byte-exact
approved PNGs, including all nine Gift Shop PNGs and all 12 native doors.

### Arithmetic and measured demand

Room upgrades add 6% of base gross per tier, without compounding or reducing
stock. Without supplier terms:

| Shop tier | Normal gross | Normal stock / contribution | Premium gross | Premium stock / contribution | Normal net/hour after $1 upkeep at 0.5 sales/hour |
| --- | --- | --- | --- | --- | --- |
| 1 | $15.00 | $6.00 / $9.00 | $25.00 | $12.00 / $13.00 | $3.50 |
| 2 | $15.90 | $6.00 / $9.90 | $26.50 | $12.00 / $14.50 | $3.95 |
| 3 | $16.80 | $6.00 / $10.80 | $28.00 | $12.00 / $16.00 | $4.40 |
| 4 | $17.70 | $6.00 / $11.70 | $29.50 | $12.00 / $17.50 | $4.85 |
| 5 | $18.60 | $6.00 / $12.60 | $31.00 | $12.00 / $19.00 | $5.30 |

Tier-5 premium $31 exceeds the ordinary $30 budget; it fits a gift-only $40
visitor. Staff/founder $20 cannot afford premium even at tier 1, and prior
spending can also reject an upgraded normal gift. Founder normal consumption
posts $0 gross, $6 stock and -$6 net before supplier terms.

At actual qualified tier-1 Executive terms, normal stock becomes $5.94 (six cents
saved); premium $11.88 (12 cents). At tier 5, stock is $5.88/$11.76 (12/24 cents).
The actual-round/firing/reload test settles one accepted base premium receipt
with $25 gross, $11.76 stock and $13.24 net, and records exactly 24 saved cents
once. Subsequent unqualified purchases use full stock. Wages/capital/fees do not
receive supplier reductions.

The owned reducer integration test uses the default prices, wages, upgrades and
120-minute cadence, four warmup hours and 48 measured hours, seed
`m5.gift-normal-measured`. It suppresses clinical/ordinary/optional shopping to
isolate the dedicated stream, uses tier 1 and no Executive/qualified terms, and
sets the QA first-opportunity clock to the ordinary 120-minute interval rather
than the watch fixture's one-minute shortcut. It actually advances the reducer,
reconciles cash and retained/retired totals, and measures:

| Measured item | 48 hours |
| --- | --- |
| Dedicated opportunities / fulfilled normal gifts | 24 / 24 |
| Gross | $360.00 |
| Stock | $144.00 |
| Contribution after stock | $216.00 |
| Gift Shop upkeep | $48.00 |
| Direct Gift Shop net | **+$168.00, +$3.50/hour** |
| All charged operating costs of the partial QA clinic | $1,152.00 |
| All-clinic cash delta | **-$936.00, -$19.50/hour** |
| Supplier stock savings / XP change | $0.00 / 0 |

The shop is profitable at measured normal demand without an Executive. The
synthetic partial clinic has other unfunded overhead and loses money overall;
this is not the M8 funded full-cluster/reader/active-play audit. M8 still owns
the paired multi-seed full-economy and full-game pacing acceptance.

Two 24-hour paired reducer runs, seed `m5.gift-clinical-independence`, compare
gift-only demand on/off, first with optional shopping disabled and then enabled.
Each pair reloads at minute 351. Both preserve all **22 scored arrival IDs,
arrival ticks and exact frozen case objects**, the **1,052-case eligible pool**,
XP and learning histories; gift opportunity counts are 12 versus zero. No APP
stream is enabled in those controlled comparisons, so they do not claim to fix
the existing APP case-pool defect. Reports:
[normal demand](../../.local-dev/level5-m5/normal-demand.json),
[optional off](../../.local-dev/level5-m5/clinical-independence-false.json),
[optional on](../../.local-dev/level5-m5/clinical-independence-true.json).

### Validation: exact commands and output

All workspace suites used their unchanged checked-in configs, **--pool=threads**
and the existing EPERM preload below. There was no alternate config or dependency
installation. PowerShell used npm.cmd and NO_COLOR=1. The final domain run also
set LEVEL5_M5_REPORT=1 to write the scratch evidence above.

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
```

| Check | Exact command | Actual exit | Complete log |
| --- | --- | --- | --- |
| Balance | `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` | 0 | [full-balance-final.log](../../.local-dev/level5-m5/full-balance-final.log) |
| Domain | `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` | 0 | [full-domain-final.log](../../.local-dev/level5-m5/full-domain-final.log) |
| Clinical content | `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` | 0 | [full-clinical.log](../../.local-dev/level5-m5/full-clinical.log) |
| Player | `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` | 1 | [full-player-final.log](../../.local-dev/level5-m5/full-player-final.log) |
| Root typecheck | `npm.cmd run typecheck` | 0 | [typecheck-final.log](../../.local-dev/level5-m5/typecheck-final.log) |
| Player build | `npm.cmd run build --workspace @gamify-surgery/player` | 0 | [build-final.log](../../.local-dev/level5-m5/build-final.log) |
| Launcher | `node scripts/verify-launcher-contract.mjs` | 0 | [launcher-check.log](../../.local-dev/level5-m5/launcher-check.log) |
| QA typecheck | `node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m2/qa-tsconfig.json` | 0 | [qa-typecheck.log](../../.local-dev/level5-m5/qa-typecheck.log) |
| QA transform | `node tools/qa/level-four-rooms.mjs --check` | 0 | [qa-check.log](../../.local-dev/level5-m5/qa-check.log) |
| QA syntax | `node --check tools/qa/level-four-rooms.mjs` | 0 | [qa-syntax-check.log](../../.local-dev/level5-m5/qa-syntax-check.log) |
| Approved room assets | `node tools/room-design/level-5/runtime-promotion/promote.mjs all --check` | 0 | [approved-assets-check.log](../../.local-dev/level5-m5/approved-assets-check.log) |

Exact final suite summaries:

**Balance**

```text
 Test Files  19 passed (19)
      Tests  144 passed (144)
   Start at  23:45:06
   Duration  758ms (transform 1.72s, setup 0ms, import 6.12s, tests 197ms, environment 1ms)
```

**Domain**

```text
 Test Files  145 passed | 1 skipped (146)
      Tests  4076 passed | 2 skipped (4078)
   Start at  23:55:50
   Duration  164.27s (transform 6.39s, setup 0ms, import 61.15s, tests 583.66s, environment 8ms)
```

**Clinical content**

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  23:44:38
   Duration  5.59s (transform 15.96s, setup 0ms, import 57.70s, tests 6.54s, environment 8ms)
```

**Player**

```text
 Test Files  1 failed | 214 passed (215)
      Tests  1 failed | 1889 passed (1890)
   Start at  00:02:15
   Duration  44.97s (transform 8.84s, setup 0ms, import 82.42s, tests 80.01s, environment 11ms)
```

The sole player failure is the unchanged permitted baseline:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

```

Root typecheck output (exit 0):

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

Player build output excerpt (exit 0; full log linked above):

```text
vite v8.1.5 building client environment for production...
transforming...✓ 725 modules transformed.
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-Cli3yTCw.css                                   38.59 kB │ gzip:     6.67 kB
dist/assets/index-771aDHlU.css                                        164.34 kB │ gzip:    30.55 kB
dist/assets/MobileEntryPresentation-Cb0VpoH_.js                         0.32 kB │ gzip:     0.22 kB
dist/assets/MobileShell-Fy8vrU2i.js                                   115.30 kB │ gzip:    30.59 kB
dist/assets/index-HTLT_4D3.js                                      12,529.81 kB │ gzip: 2,036.67 kB
(!) Some chunks are larger than 500 kB after minification. Consider:
✓ built in 3.50s
```

The build retains the large-chunk warning and reports plugin timings; no build error. MobileShell and MobileEntryPresentation remain separate chunks.

QA and approved-byte output (all exits 0):

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
CHECK PASS founders-office: 49 approval hashes; 43 exact PNGs (12004144 bytes); 5 looks; 2340 occupied routes; 12 doors
CHECK PASS executive-office: 33 approval hashes; 10 exact PNGs (1985736 bytes); 1 looks; 510 occupied routes; 10 doors
CHECK PASS gift-shop: 30 approval hashes; 9 exact PNGs (3017425 bytes); 1 looks; 1587 occupied routes; 12 doors
CHECK PASS indoor-garden: 38 approval hashes; 18 exact PNGs (8269180 bytes); 1 looks; 1296 occupied routes; 16 doors
CHECK PASS staff-gym: 24 approval hashes; 21 exact PNGs (5930397 bytes); 1 looks; 1296 occupied routes; 16 doors
Verified launcher health contract gamify-surgery-player protocol 1.
```


The two skipped domain cases remain the existing DEFECT-M9 quarantine. All 46
new focused Gift Shop cases and the three demand comparisons pass within the
full domain suite; the focused Gift Shop/room/UI/scene run also passed 24 tests
([output](../../.local-dev/level5-m5/player-focused-second.log)). Actual
FacilityScene sampling covers accepted approach, queue/counter and exit paths at
1x/4x, finite interpolation, retained synchronization, and a mid-checkout reload;
it does not substitute for manager browser rendering. No manager V7/V8,
default-pool, physical-phone or browser PASS is claimed.

[Command receipts](../../.local-dev/level5-m5/validation.json),
[preservation/final hashes](../../.local-dev/level5-m5/preservation.json),
[scoped diff](../../.local-dev/level5-m5/scoped.diff),
and [read-only HTTP receipt](../../.local-dev/level5-m5/qa-http.json).

### Manager QA: desktop and phone

The existing strict **http://127.0.0.1:5184** QA server is extended. A read-only
request returned HTTP 200, the dedicated bootstrap and that exact location.origin.
No listener was started/stopped and no browser storage was read or written by
the worker. Start/reuse `node tools/qa/level-four-rooms.mjs` in the manager lane,
use a disposable Level 5 profile, retain `?level5=` on reload, and complete the
normal prototype access gate. Existing scenario campaigns resume without reseeding.

| Scenario | Desktop URL | Phone URL | Watch |
| --- | --- | --- | --- |
| Normal demand, no Executive | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift&layout=phone | Adult gift-only arrival, actual pay contact, two-minute dispensing and one receipt |
| Actual counter plus two queue reservations | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-queue&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-queue&layout=phone | Three accepted unpaid normal requests, native queue promotion, cancellation and reload |
| Real supplier qualification | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-suppliers&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-suppliers&layout=phone | Executive daily round first, reduced accepted stock and actual savings once |

1. Inspect the scoped diff/validation and rerun manager acceptance. All three
   fixtures start paused with 1,999 XP, real placed rooms, locked inspections,
   and no paid gift receipts or earned supplier terms. Gift Shop is the M2 room
   at x34/y18; pan north if needed. The `gift` fixture moves only its first
   opportunity to one minute for watching; later cadence is 120. `gift-queue`
   has three explicit synthetic adult identities/locations and real accepted
   quotes/routes/reservations, not three seeded sales. `gift-suppliers` uses
   the real M4 hire/office/Training Room and the normal 120-minute first interval.
2. On desktop at 1600x1000, Play at 1x and 4x. Watch the dedicated adult walk in
   from the sidewalk to the actual counter; no clinical arrival/chart/XP appears
   for it. Inspect Gift shopper age/sex and walking/queue/self-service labels.
   At the pay contact the remaining time starts at two; no receipt/cash increase
   precedes dispensing. The normal receipt is $15 gross/$6 stock/$9 net without
   terms. Watch native ground contact, scale, depth, synchronization and safe exit.
3. Services > Gift/Premium gift and Money > Gift Shop show the same current
   normal/premium gross, stock, contribution, two-minute checkout, queue limits,
   demand and budgets. Upgrade through $200/$300/$450/$600: current fee pairs
   become $15.90/$26.50, $16.80/$28, $17.70/$29.50 and $18.60/$31. Stock remains
   $6/$12 without supplier terms. Upgrade while a quote is accepted: that shopper
   retains its earlier price; later requests use the new tier.
4. For premium/founder acceptance, use eligible actors and the existing real
   START_RETAIL_PURCHASE handler in the disposable QA lane (or await ordinary
   optional shopping), never seed paid receipts or bypass ledgers. A $40
   gift-only adult can buy tier-5 premium at $31; a $30 ordinary visitor and $20
   employee/founder cannot. A fresh ordinary adult can buy a base $25 premium
   and dispense one $25/$12/$13 receipt. An eligible idle founder's normal gift
   posts $0/$6/-$6, not external income. Working staff and pediatric pairs stay
   with required care; idle staff return to their original home. Focused domain
   tests cover these real commands at every tier and through reload.
5. On `gift-queue`, inspect pay/queue1/queue2 as distinct retained contacts;
   a fourth simultaneous request must not reserve another place. Pause/reload
   on approach, in line, during dispensing and on exit, then switch shells in
   the same profile. No extra opportunity/receipt, reset work or lost quote.
   Physical travel or a ten-minute queue timeout may cancel a request; do not
   expect blocked or abandoned customers to pay.
6. Test blocked access without bypassing the occupied-door removal guard:
   sell the upstream Hallway at x35/y25 (`room.level5.rooms.link.25`). Checkout
   contacts release, no unpaid sale occurs, and an isolated native actor waits
   at its actual cursor for a connected exit. Reload, restore that Hallway and
   watch a safe exit. Selling Gift Shop cancels unpaid work and preserves only
   its ordinary refund; reload cannot dispense it. Already settled receipts
   remain earned. Required clinical work takes over staff movement and releases
   the shop contact; no stale blocked-return marker survives.
7. On `gift-suppliers`, allow the actual daily round to finish. New normal stock
   is $5.94 at tier 1; Money records six saved cents per fulfilled normal gift
   once, rather than supplier income. Train using the existing actions for the
   later 2% tier-5 terms; premium stock then is $11.76. Fire/upgrade after a
   quote is accepted: it keeps its old stock/room quote through reload; later
   unqualified quotes use full stock. Compare actual receipts, savings and cash.
   The $45 Executive wage and other expenses remain due; this partial clinic
   may correctly show a deficit.
8. Repeat all player-facing checks in the phone shell at **360x740, 390x844,
   412x915, 844x390 and 768x1024**, plus desktop 820/390 flow. Manage > Services
   keeps compact tiles; tap Gift/Premium for details. Manage > Money has one
   Gift Shop tile; tap for the same facts, Back to restore the compact root.
   Check >=44px controls/disclosure, local scrolling without a long root list,
   pause/restoration, horizontal overflow, actor labels/contacts and page errors.
9. Smoke ordinary Level 0-4 desktop/phone saves in their original pathways.
   Cap stays 4 until M10; the worker does not open normal Level 5 progression,
   inspection booking or the finish page. Do not remove `level5` from a
   disposable Level 5 profile or clear/transfer owner saves to replay QA.

Owner pathways remain **START_GAME.cmd -> exact http://127.0.0.1:4173**, PC
phone preview at that same origin with `?layout=phone`, private phone
**START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**, and
remote **https://melissarowlandc-afk.github.io/GamifySurgery/**. Other origins and
profiles have separate saves; 5184 does not transfer or synchronize campaigns.

**LOCAL ONLY checkpoint:** no GitHub backup was made by this No-Git worker.
The manager retains review/acceptance, CURRENT_THREAD_HANDOFF.md and the owner's
binding finish-M10-then-push direction (backup only; no Pages publication).
Next action: manager browser QA and acceptance of M5, then dispatch M6 separately.


### M5 queue fix (2026-10-12)

Sol worker follow-up to the manager's Chrome defect at `?level5=gift-queue`,
desktop 1600x1000. Implementation and worker validation complete; manager browser
recheck pending. This note supersedes the initial M5 queue acceptance evidence.

**Root cause.** The three approved contact endpoints were already distinct:
pay `(0.9, 1.6)`, queue1 `(2.05, 1.475)`, queue2 `(2.05, 0.55)` locally.
Contact reservations were distinct too. The two S2 queue routes share their
approach prefix. All three QA customers start together at the same hallway
point, and the old retail loop advanced each independently by two path nodes
per game minute. Thus the two queue customers occupied identical intermediate
points for many ticks even though their final reservations differed. It was not
a shared actor object, staff/visitor reservation, or projection key. The old
queue handler also sent the rear customer directly toward pay; it never moved
queue2 into queue1, and the original rear customer could abandon without a sale.

The new regression failed the original code at both 1x and 4x, before any runtime
fix. Exact reproduction excerpt (exit 1; [complete log](../../.local-dev/level5-m5-queue-fix/engine-collision-before.log)):

```text
AssertionError: minute 0: character:retail-retail_visitor:gift-qa.0 and character:retail-retail_visitor:gift-qa.1 
share the shop view-model point: expected 0 to be greater than 0.000001
```


**Fix.** Gift Shop movement now grants exclusive use of the shared native aisle,
including approach, promotion, exit and the engine's lookahead. A blocked shopper
keeps its actual cursor and updates its wait clock so it cannot later jump ahead
by accumulating missed movement. The optional, strictly parsed `aisleWaiting`
marker freezes that shopper's shared presentation path at its actual cursor;
held contact projection uses the spot where the actor stands. Both shells use
this shared model. No visual offsets, contact changes or routeMotion edits hide
the collision. New arrivals cannot take queue1 ahead of the existing rear
customer. Each actor retains one contact reservation and advances
**queue2 -> queue1 -> pay**, after each preceding physical vacancy. Dispensing
still takes two minutes at pay and posts one frozen-price/stock receipt.
Cancellation, sale and required-work takeover clear the new wait marker. A
one-node request from someone already at the counter cannot leave a stale wait
marker in a queued/completed save.

**Regression evidence.** The unchanged `gift-queue` fixture drives the actual
gameReducer, shared view model and FacilityScene route-motion/hop/native-support
projection at 1x and 4x for 180 game minutes, with 24 frame samples per minute
and a mid-checkout save/reload. Only the Phaser Scene constructor base is stubbed
for Node; reducer, routeMotion, hop sampling and native projection are real.
No staggered identities/starts, invented movements or seeded paid receipts were
used to make it pass. The test checks all founder/staff/patient/service-visitor/
retail actors inside the shop for unique view-model points and unique sampled
ground positions, including rounded rendered pixels. It also checks one contact
per active actor, one owner per contact, the rear contact sequence, exactly one
actual receipt for each original shopper and all three safe departures. This is
engine regression evidence, not a claimed Chrome/canvas browser acceptance.

Only these six source/test files changed in the follow-up:

- `packages/game-domain/src/gift-retail.ts`
- `packages/game-domain/src/retail-operations.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/level-five-gift-retail.test.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/facility/levelFiveGiftRouteMotion.test.ts`

This plan is append-only. The approved contact/route tables and PNGs,
FacilityScene.ts, routeMotion.ts, live cap 4, balance/catalog values, clinical
content, other plans and the manager's global handoff remain unchanged. No Git,
installs, dependencies, new clinical statements or later milestones. The final
filesystem receipt records seven changed paths including this note, no removals,
UTF-8 without BOM/LF and 1,170 unchanged original audited paths.

**Validation.** Unchanged checked-in configs, `--pool=threads` and the required
existing preload; PowerShell also set NO_COLOR=1:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
```

| Check | Exact command | Actual exit | Complete output |
| --- | --- | --- | --- |
| Focused domain | `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/level-five-gift-retail.test.ts tests/level-five-executive.test.ts tests/retail-operations.test.ts` | 0 | [domain-focused.log](../../.local-dev/level5-m5-queue-fix/domain-focused.log) |
| Focused player / engine | `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/facility/levelFiveGiftRouteMotion.test.ts src/session/levelFiveGiftRetailViewModels.test.tsx` | 0 | [player-focused-final.log](../../.local-dev/level5-m5-queue-fix/player-focused-final.log) |
| FULL game-domain | `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` | 0 | [full-domain.log](../../.local-dev/level5-m5-queue-fix/full-domain.log) |
| FULL player | `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` | 1 | [full-player.log](../../.local-dev/level5-m5-queue-fix/full-player.log) |
| Root typecheck | `npm.cmd run typecheck` | 0 | [typecheck-final.log](../../.local-dev/level5-m5-queue-fix/typecheck-final.log) |
| Player build | `npm.cmd run build --workspace @gamify-surgery/player` | 0 | [build.log](../../.local-dev/level5-m5-queue-fix/build.log) |
| QA transform | `node tools/qa/level-four-rooms.mjs --check` | 0 | [qa-check.log](../../.local-dev/level5-m5-queue-fix/qa-check.log) |

Exact final summaries:

**Focused domain**

```text
 Test Files  3 passed (3)
      Tests  100 passed (100)
   Start at  00:46:19
   Duration  25.46s (transform 4.20s, setup 0ms, import 5.87s, tests 30.02s, environment 0ms)
```

**Focused player / engine**

```text
 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  00:58:51
   Duration  10.28s (transform 3.96s, setup 0ms, import 5.38s, tests 7.93s, environment 0ms)
```

**FULL game-domain**

```text
 Test Files  145 passed | 1 skipped (146)
      Tests  4077 passed | 2 skipped (4079)
   Start at  00:48:15
   Duration  164.56s (transform 6.34s, setup 0ms, import 60.90s, tests 584.63s, environment 8ms)
```

**FULL player**

```text
 Test Files  1 failed | 214 passed (215)
      Tests  1 failed | 1891 passed (1892)
   Start at  00:53:56
   Duration  48.09s (transform 9.17s, setup 0ms, import 89.41s, tests 84.14s, environment 13ms)
```

The FULL player exit is 1 solely for the permitted unchanged thyroid failure:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

```

Root typecheck: exit 0. Exact output:

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

Player build: exit 0. Exact output excerpt; complete log above:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 725 modules transformed.
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-Cli3yTCw.css                                   38.59 kB │ gzip:     6.67 kB
dist/assets/index-771aDHlU.css                                        164.34 kB │ gzip:    30.55 kB
dist/assets/MobileEntryPresentation-CDRMX6W_.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-DYY2ymfR.js                                   115.30 kB │ gzip:    30.59 kB
dist/assets/index-D6DQ9q8z.js                                      12,531.69 kB │ gzip: 2,037.07 kB
(!) Some chunks are larger than 500 kB after minification. Consider:
✓ built in 3.65s
```

The existing large-chunk/plugin-timing warnings remain; MobileShell remains a separate chunk. The two domain skips remain the existing DEFECT-M9 quarantine. No new failure is accepted.


[Validation receipts](../../.local-dev/level5-m5-queue-fix/validation.json),
[scoped diff](../../.local-dev/level5-m5-queue-fix/scoped.diff),
[final preservation/hashes](../../.local-dev/level5-m5-queue-fix/preservation.json).

**Manager recheck.** Reuse the existing server and exact disposable origin
`http://127.0.0.1:5184`; no listener/storage was changed by the worker. To replay
the initial three-customer queue, use a fresh disposable QA browser profile;
existing campaigns resume their existing progress rather than reseed. Owner
4173/private-phone/remote pathways and their separate saves remain unchanged.

- Desktop 1600x1000:
  http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-queue&layout=desktop
- Phone:
  http://127.0.0.1:5184/level4-rooms-qa.html?level5=gift-queue&layout=phone

Play at 1x and 4x. The three people should take turns through the shared aisle,
stand at distinct retained contacts, and move forward through queue1 before
checkout. No repeated paired locations like the reported `(35.1,19.9)` sequence
should persist inside the shop. Watch all three original shoppers complete one
normal receipt each and depart. Pause/reload while waiting for the aisle, at
queue2/queue1 and during checkout; no contact duplication, lost position or
second payment. Repeat in phone layout and confirm shared labels/positions and
compact Services/Money tiles. Manager Chrome recheck is still required before
accepting M5; no browser PASS is claimed by this worker.

The follow-up is local only. The manager retains the authorized finish-M10-then-
push checkpoint direction and owns CURRENT_THREAD_HANDOFF.md. No backup push or
publication occurred in this worker lane.
- 2026-10-12 manager: M5 ACCEPTED after queue fix. Chrome QA ?level5=gift-queue (desktop): first run found two shoppers co-located (Natalie Nolan / Cameron Rhodes @35.1,19.9) -> worker fixed lockstep shared-approach movement (exclusive aisle, unique reservations, queue2->queue1->pay); rerun shows distinct positions throughout, sale settles (+$7, one receipt), no page errors. Worker: domain 4077+2 skips, player 1891 + known thyroid failure, typecheck/build PASS; measured shop net +$3.50/h without Executive. M6 dispatched.


## Level 5 M6: goals and inspection unlock

2026-10-12 Sol worker handoff. **Implementation and worker validation complete;
manager diff review and browser/phone acceptance pending.** Read AGENTS.md and
all three requested plans in full, including every prior Level 5 handoff and
manager acceptance through the M5 queue fix. This is M6 only. The manager owns
the global CURRENT_THREAD_HANDOFF.md; it was preserved in this lane.

### Behavior and compatibility

- The normal LEVEL_UP path now accepts Level 4 -> 5 when the context supplies
  cap 5 and the Level 4 successor. All five existing Level 4 requirements are
  rechecked; an old acknowledgement does not bypass a missing current gate.
  The QA clone installs the separately exported stage-5 definition and successor.
  **The shipped release, its stage array, Level 4 terminal behavior and cap 4
  are unchanged.** M10 owns opening the live cap.
- At Level 5, the three live goals are exactly 2,000 current-level Clinical XP,
  displayed satisfaction strictly above 90, and a nonempty average effective
  staff morale of at least 85. There is no room, Executive, optional QI or
  inspection gate to this unlock.
- On the first applied command or individual simulated minute where all three
  coexist, record the existing M1 `levelFive.progress.inspectionUnlocked`
  snapshot (version, earned tick, XP, displayed satisfaction, mean morale and
  employee count), mark inspection status `ready`, and emit one persisted
  informational unlock event. Later loss of satisfaction, morale or employees,
  reload, replay and event retirement do not erase/re-earn it. An older Level 5
  state without the optional extension can acquire it lazily on actual play;
  loading an old Level 4 save adds nothing.
- Goals and current progress appear in desktop Goals and the phone Goals
  chip/sheet. The phone chip changes to **Inspections unlocked** after earning,
  remains earned if live metrics decline, and opens Goals in one tap. The sheet
  uses compact scoped cards and a collapsed optional QI detail; the disabled
  inspection hook has a 44px target. Below Level 5, existing renderings and
  mobile optional objectives are retained.
- The unlock appears as one **Alerts milestone row**, plus a short stable
  **tip** row explaining the next step with **Show Goals**. It creates no
  Needs-you item or headline/footer duplicate and does not alter ordinary tip
  cadence. The old historical Level 4 completion event receives appropriate
  Advance wording only in cap-5 QA presentation; the durable event is unchanged.
- Before earning, both shells show **Inspections locked** and a disabled
  **Book inspection · Locked** hook. After earning, they show the earned date
  and disabled **Book inspection · coming in M7** hook. The domain helper
  exposes the unmet-goals/coming-in-M7 blocked reason. No booking command,
  preparation, scoring, inspector presentation, report, finish page or Level 6
  is implemented. Goal completion neither awards money/XP nor resets XP nor
  finishes the game.
- M1 dormancy tests now isolate the newly activated progression seam: they
  still compare every unrelated state/projection field and round-trip every
  fixture. The new M6 scenarios are owned by real progression tests, rather
  than falsely asserting that the newly activated unlock is dormant. Existing
  persistence schemas, frozen encounters, saves, clinical content, routeMotion,
  balance prices/wages, assets, launcher and ordinary storage paths are intact.

### Arithmetic and boundary evidence

- Normal Advance resets current-level XP once, through the existing reducer.
  Existing first-answer rewards stay correct = 10 XP / incorrect = 2 XP. A
  correct answer at 1,990 produces 2,000 and the unlock when the other goals
  coexist; an incorrect answer produces 1,992. A second submission produces no
  extra award. At the endpoints, 200 correct or 1,000 incorrect first answers
  total 2,000 XP; this is arithmetic, not a promised arrival/playtime rate.
- 1,999 XP is unmet; 2,000 is met. Displayed satisfaction 90 is unmet; 91 is
  met. The selector uses the actual displayed clinic metric, including current
  display penalties, rather than raw historical satisfaction.
- Average = `sum(clamp(stored morale + owned Founder Office bonus, 0, 100)) /
  employed staff count`, using M3's common effective-morale selector. The
  ownership modifier applies once, independent of room copies/tier. All employed
  staff count, including busy/training staff; the Founder and departing former
  staff do not. No employees yields null and an unmet goal. 84.999 is unmet;
  exactly 85 is met. Display is floored to two decimals so 84.999 is not shown
  as a misleading completed 85.
- Tests cover simultaneous versus separate fulfillment, each Level 4 gate,
  schema-5/schema-9 old-save load and normal QA Advance, ordinary cap 4, real
  first-answer XP, individual minutes inside fast-forward, one event/record,
  reload/replay/decline/empty roster, both real renderers, real shared session
  one-tap/double-tap behavior, Alert -> Goals navigation and no finish/reward.

### Actual current-content XP pacing (M6 evidence; M8 remains)

This deterministic run starts from the explicitly synthetic mature prior-save
shape, buys ordinary EVS coverage, sets funded salary steps, and uses normal
Level 4 -> 5 Advance to **zero XP**. There is **no Level 5 XP override**. It
uses the full current eligible clinical pool, seed `level-four-almost-m8`, unchanged
60-minute routine cadence/variation, fees, pay, FSRS and room effects, one
chart action per game minute, perfect answer keys and actual travel/care/waits,
retirement, settlement and walkouts. Scheduled APP appointments are disabled
in this partial-clinic fixture; no employee discussions are answered and no
Level 5 room or Executive is bought. This is a scripted partial-clinic
benchmark, not human study time or M8's full funded-cluster economics.

Exact reconciled result:

```json
{
  "scenario": "Perfect-key scripted play of the full current clinical pool; ordinary Level 4 -> 5 command; no Level 5 rooms/Executive.",
  "setup": "Synthetic acknowledged Level 4 prior-save shape; paid EVS coverage and salary steps. Level 5 starts at ordinary reset XP=0. First routine arrival at the default 60-minute interval; unchanged demand, fees, pay, room effects and FSRS. One interaction per game minute; no employee discussions answered.",
  "seed": "level-four-almost-m8",
  "gameHours": 212.05,
  "activeMinutes": 12723,
  "clinicalXp": 2280,
  "xpPerGameHour": 10.752181089365715,
  "firstAnswers": 228,
  "correctFirstAnswers": 228,
  "completedPatients": 156,
  "walkouts": 51,
  "scoredArrivals": 211,
  "displayedSatisfaction": 91,
  "averageEffectiveStaffMorale": 85,
  "employedStaffCount": 3,
  "minimumCashCents": 2506975,
  "xpGoalReachedAtFacilityTick": 11138,
  "xpGoalGameHours": 185.63333333333333,
  "inspectionUnlocked": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 12723,
    "clinicalXp": 2280,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 85,
    "employedStaffCount": 3
  },
  "gameFinished": null,
  "unmetGoals": [],
  "wallSeconds": 65.94381240000001
}
```

The XP goal first occurs at 11,138 game minutes / 60 = 185.63333333333333 game
hours. All three coexist at 12,723 / 60 = **212.05 game hours**: 228 correct
first answers x 10 = 2,280 XP, 156 completed patients, 51 walkouts and 211 scored
arrivals. Measured overall XP/hour is **10.752181089365715**. Satisfaction
recovery from walkouts delays unlock beyond 2,000 XP; the durable snapshot
contains satisfaction 91, mean 85 and three employees. Minimum cash remains
$25,069.75 in this disclosed partial setup. No completed inspection or game
finish is simulated. At the existing 1,000ms/game-minute 1x clock, the unpaused
game-clock durations alone correspond to 185.6333 and 212.05 real minutes;
answer-reading, pauses and human decisions are not measured. The CPU harness
runs faster than the real game clock.

[Harness](../../.local-dev/level5-m6/pacing.mjs),
[complete run output](../../.local-dev/level5-m6/pacing.log),
[metrics](../../.local-dev/level5-m6/pacing.json).
`node .local-dev/level5-m6/verify-pacing.mjs` exits 0 and reconciles the complete
log with the JSON and XP/count/tick arithmetic. This flags satisfaction/arrival
pacing for the manager and M8; the binding 2,000 target is unchanged. M8 still
owns its paired economic seeds and extension through the first valid completed
inspection once M7 exists.

### Files changed (29 source/test/QA/plan paths)

- `apps/player/src/mobile/levelFiveGoals.test.tsx`
- `apps/player/src/mobile/MobileGoals.tsx`
- `apps/player/src/mobile/mobileScreens.css`
- `apps/player/src/session/alertsEventsViewModel.ts`
- `apps/player/src/session/levelFiveProgressionView.ts`
- `apps/player/src/session/levelFiveProgressionViews.test.tsx`
- `apps/player/src/session/levelFiveStateQa.test.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/ClinicHeadline.tsx`
- `apps/player/src/ui/goalsPanel.css`
- `apps/player/src/ui/GoalsPanel.tsx`
- `apps/player/src/ui/types.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/level-five-progression.test.ts`
- `packages/balance-config/src/level-five-progression.ts`
- `packages/balance-config/src/prototype-alerts.ts`
- `packages/game-domain/src/guidance-progression.ts`
- `packages/game-domain/src/guidance-tips.ts`
- `packages/game-domain/src/index.ts`
- `packages/game-domain/src/level-five-progression.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/tests/level-five-progression.test.ts`
- `packages/game-domain/tests/level-five-state-persistence.test.ts`
- `tests/fixtures/level-five-progression.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/level-five-state-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`
- `docs/execplans/level5-launch-plan-20261010.md`

Scratch receipts, before-byte copies, hashes, filesystem diff and pacing logs
are under `.local-dev/level5-m6/`. No Git command was run. The baseline is
1,350 existing source/config/doc paths; all unowned sampled paths are byte
preserved. The completed audit has 29 changed paths (8 new), 1,329 unchanged,
no removed paths, strict UTF-8/no BOM/LF, and routeMotion unchanged. All previous
plan content is preserved byte-for-byte and this handoff is appended.

### Exact validation commands and output

Used **unchanged checked-in default configurations with `--pool=threads`**
and the required preload, because this worker's unelevated sandbox cannot spawn
the default fork/browser pool. No alternate config, test exclusion, install,
timeout adjustment or accepted new failure. Environment for the commands:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node tools/qa/level-four-rooms.mjs --check
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m2/qa-tsconfig.json
node scripts/verify-launcher-contract.mjs
```

Each command ran directly through PowerShell with npm.cmd; its native exit
code and complete output were captured before writing the receipt. Receipt
`recordedAt` is the capture time, not a fictitious command start/end time.
Initial scratch subprocess attempts hit EPERM before npm ran; direct commands
above are the executed validations. Initial focused fixture/projection/type
errors were corrected and final full suites cover the final source tree.

Balance-config: exit 0. Exact summary:

```text
 Test Files  20 passed (20)
      Tests  147 passed (147)
   Start at  01:32:30
   Duration  1.28s (transform 4.11s, setup 0ms, import 10.29s, tests 284ms, environment 2ms)
```

Game-domain: exit 0; the two existing DEFECT-M9 skipped tests remain. Exact summary:

```text
 Test Files  146 passed | 1 skipped (147)
      Tests  4106 passed | 2 skipped (4108)
   Start at  01:33:27
   Duration  164.34s (transform 7.68s, setup 0ms, import 62.93s, tests 581.70s, environment 8ms)
```

Clinical-content: exit 0. Exact summary:

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  01:32:30
   Duration  6.53s (transform 20.13s, setup 0ms, import 69.06s, tests 7.13s, environment 8ms)
```

Player: exit 1, **only the explicitly allowed pre-existing thyroid failure**.
Exact summary and failure output:

```text
 Test Files  1 failed | 216 passed (217)
      Tests  1 failed | 1914 passed (1915)
   Start at  01:38:12
   Duration  46.91s (transform 9.13s, setup 0ms, import 85.01s, tests 84.91s, environment 12ms)

FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

Root typecheck: exit 0. Exact complete output:

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

Player build: exit 0. Exact output (terminal escape controls removed):

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...
transforming...✓ 728 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-D6OMV9M8.css                                   39.47 kB │ gzip:     6.78 kB
dist/assets/index-CG7YWoTU.css                                        164.68 kB │ gzip:    30.60 kB
dist/assets/MobileEntryPresentation-CncZeova.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-gj4tT9bU.js                                   116.38 kB │ gzip:    30.79 kB
dist/assets/index-Lxk7FZ_m.js                                      12,536.81 kB │ gzip: 2,038.23 kB

✓ built in 2.83s
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

The existing >500kB build warning remains; the mobile shell remains a separate
lazy chunk. QA transforms: exit 0. Exact complete output:

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
Level 5 M6 goals transform PASS: QA-only Level 4 Advance; three live goals; durable unlock without booking/scoring.
```

The existing QA TypeScript project command exits 0 with empty output.
Launcher contract: exit 0, exact output `Verified launcher health contract gamify-surgery-player protocol 1.`.
Read-only local HTTP check of the phone goals URL returned 200 with the expected
dedicated QA bootstrap at `location.origin = http://127.0.0.1:5184`. No server
listener, browser session or stored campaign was changed by that check.

Complete outputs: [balance](../../.local-dev/level5-m6/full-balance.log),
[domain](../../.local-dev/level5-m6/full-domain.log),
[clinical-content](../../.local-dev/level5-m6/full-clinical.log),
[player](../../.local-dev/level5-m6/full-player.log),
[typecheck](../../.local-dev/level5-m6/typecheck.log),
[build](../../.local-dev/level5-m6/build.log),
[QA transforms](../../.local-dev/level5-m6/qa-check.log),
[HTTP receipt](../../.local-dev/level5-m6/qa-http.json),
[exit receipts](../../.local-dev/level5-m6/validation.json),
[scoped actual diff](../../.local-dev/level5-m6/scoped.diff),
[preservation/hashes](../../.local-dev/level5-m6/preservation.json).

### Manager QA: desktop and phone

Reuse the existing strict-loopback **5184** QA server. Use a disposable QA
browser profile; preserve the `level5` query while switching layouts/reloading.
Existing QA campaigns **resume**; use a fresh disposable profile to replay an
initial scenario, rather than clearing the owner's profile/storage. The same
scenario/campaign switches between desktop and phone without reset. New
scenarios are explicitly QA-only metadata plus real admission/unlock commands;
the `goals` starting 1,990 XP is a boundary fixture, not pacing evidence.

| Scenario | Desktop URL | Phone URL | What to look for |
| --- | --- | --- | --- |
| `l4-ready` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=l4-ready&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=l4-ready&layout=phone) | Paused old Level 4 shape with all five original goals and historical acknowledgement. Advance to Level 5 in desktop Goals and phone chip/sheet. One tap/rapid double tap causes one applied Advance, resets XP once to 0/2,000, preserves cash/witnesses/history and shows Locked. Reload; no second Advance or Level 6. |
| `goals` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals&layout=phone) | Starts 1,990 XP, >90 satisfaction and 85 morale with one real admitted existing scored adult chart. Play/check in, open chart and answer correctly: +10 XP, 2,000/2,000, durable unlock. Alerts has one milestone and short tip; Show Goals opens the disabled M7 hook. No Needs-you/headline duplicate, reward or finish. |
| `goals-ready` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-ready&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-ready&layout=phone) | Starts 2,000 XP, >90 satisfaction and 85 morale, not pre-earned. Inspect three complete rows with Locked while paused, then Play (an actual applied command) to earn one unlock. Pause/reload and compare the earned date. |
| `goals-morale` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-morale&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-morale&layout=phone) | Starts 2,000 XP, >90 satisfaction and mean 84. Morale row is incomplete and inspection stays Locked. Raise salary/use normal praise until mean reaches at least 85; it then unlocks once. |
| `goals-satisfaction` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-satisfaction&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-satisfaction&layout=phone) | Starts 2,000 XP and mean 85, but displayed satisfaction is exactly 90. Satisfaction row is incomplete; Locked. The goal is above 90, not at least 90. |
| `goals-empty` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-empty&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-empty&layout=phone) | Starts 2,000 XP and >90 satisfaction but no employees. Clear no-employees morale guidance, incomplete third row and Locked; the Founder does not count. |
| `goals-unlocked` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-unlocked&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-unlocked&layout=phone) | Unlock earned through a real SET_PAUSED command, with no Level 5 rooms/Executive. Earned date, ready state and coming-in-M7 hook in both shells; one Alerts milestone plus tip; no finished-game page. |
| `goals-declined` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-declined&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=goals-declined&layout=phone) | Earned record at 85/>90 survives a real salary decline to 75 and QA displayed satisfaction 90. Current rows show the decline, but the phone chip and both inspection sections remain unlocked after reload. Booking still disabled for M7. |

Also retain the existing `?level5=pre-goal` fixture for the 1,999 XP boundary.
Check desktop at 1600x1000 and the narrow 820/390 fallbacks. Check phone at
360x740, 390x844, 412x915, 844x390 landscape and 768x1024: compact three cards,
collapsed optional QI, wrapping chip/status, 44px hook, no horizontal overflow
or unnecessary long scroll. Exercise Back, Alerts -> Show Goals, pause, reload,
repeated taps and layout switch. Inspect earned state after live decline and
validate one milestone/tip across reload. **Browser/physical-phone geometry and
manager default-pool reruns remain manager acceptance; no browser PASS is
claimed by the worker.**

This opt-in origin `http://127.0.0.1:5184` has separate storage from the ordinary
owner `START_GAME.cmd -> http://127.0.0.1:4173` pathway, the existing private
phone pathway and the canonical remote
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Those paths and their
saves remain unchanged, capped at 4. No campaign follows origins/profiles
automatically. No owner save was read, copied, cleared or migrated.

No clinical prose/source/approval status changed and no new clinical teaching
content was authored. No Git, agents, installs, commits, push, deployment,
publication or external message. This milestone is **local only**, with no
GitHub backup created by the worker; the manager retains the binding
finish-M10-then-push direction and checkpoint responsibility. Next action:
manager review the scoped diff and receipts, run the both-shell QA above,
accept M6, then dispatch M7; do not treat this handback as manager acceptance.
- 2026-10-12 manager: M6 ACCEPTED. Chrome QA: ?level5=l4-ready desktop shows the five completed Level 4 goals and Advance to Level 5; double-click advances once to Level 5 0/2000 with three goals (XP, satisfaction >90, morale >=85) and Locked, persists on reload; ?level5=goals-ready phone: Play earns the unlock, chip reads 'Inspections unlocked', Goals sheet shows three checked goals with earned date and the M7 hook, Alerts shows one milestone + tip; no horizontal scroll; no page errors. M7a dispatched.

## Level 5 M7a: inspections and scoring

2026-10-12 Sol worker handoff. **M7a implementation and worker validation complete;
manager review and desktop/phone browser acceptance pending.** This append is
authorized by the M7a brief. The preceding M0 decisions, October 11/12 follow-ups,
M1-M6 handoffs and manager acceptance notes remain intact.

### Files changed and implemented behavior

38 source/test/QA/plan paths (37 implementation/test/QA paths plus this append):

```text
apps/player/src/App.tsx
apps/player/src/AppShell.tsx
apps/player/src/mobile/levelFiveGoals.test.tsx
apps/player/src/mobile/MobileGoals.tsx
apps/player/src/mobile/MobileShell.tsx
apps/player/src/session/inspectionViewModels.test.tsx
apps/player/src/session/inspectionViewModels.ts
apps/player/src/session/levelFiveProgressionView.ts
apps/player/src/session/levelFiveProgressionViews.test.tsx
apps/player/src/session/levelFiveStateQa.test.ts
apps/player/src/session/usePrototypeSession.ts
apps/player/src/session/viewModels.ts
apps/player/src/ui/GoalsPanel.tsx
apps/player/src/ui/inspectionControls.css
apps/player/src/ui/InspectionControls.tsx
apps/player/src/ui/types.ts
packages/balance-config/src/facility-inspection.test.ts
packages/balance-config/src/facility-inspection.ts
packages/balance-config/src/index.ts
packages/game-domain/src/facility-inspection.ts
packages/game-domain/src/index.ts
packages/game-domain/src/level-five-progression.ts
packages/game-domain/src/level-five-state.ts
packages/game-domain/src/level-five-types.ts
packages/game-domain/src/radiologist-read-income.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/retail-operations.ts
packages/game-domain/src/service-operations.ts
packages/game-domain/src/types.ts
packages/game-domain/tests/facility-inspection-integration.test.ts
packages/game-domain/tests/facility-inspection.test.ts
packages/game-domain/tests/level-five-progression.test.ts
packages/game-domain/tests/level-five-state-persistence.test.ts
tests/fixtures/level-five-inspection.ts
tests/fixtures/level-five-state.ts
tools/qa/level-five-state-bootstrap.ts
tools/qa/level-four-rooms.mjs
docs/execplans/level5-launch-plan-20261010.md (this append only)
```

- `facility-inspection.ts` owns free booking, the frozen M4 preparation quote,
  the fixed observation window, event/minute evidence, pure report arithmetic,
  cancellation, immediate retries, latest/best prestige and first completion.
  Booking requires the earned M6 unlock, not the current morale/satisfaction
  values after that unlock. One preparation/run can be active at a time.
- The reducer observes accepted clinical and employee-discussion first answers,
  domain opening/advance presentation, settlements, walkouts, actual income/stock
  receipts and full charged/paid operating postings. Service, retail and reading
  modules hook their existing receipts. Each ID is counted once. End-of-minute
  sampling runs after ordinary domain work and before history retirement. No
  event text is parsed and no retired encounter/receipt is needed to reconstruct
  the report. Preparing minutes are unscored; pause/offline time does not advance
  the window. The last-observed tick and all evidence survive reload.
- All placed rooms contribute cleanliness room-minutes. Frozen catalog IDs and
  canonical positions preserve missing rooms/slots; extra copies add real
  positions. Installed compatible employees are matched once and count while
  busy, on a break or training. Every owned ladder copy affects its type mean;
  queued training does not count as an earned tier. Grouped type/home/employee/
  tier minute evidence and access/upgrade deficits retain earlier shortcomings
  after sale, firing, reassigning or upgrading.
- All ended scored encounters, including walkouts, feed inspection satisfaction
  and flow. Only distinct completions with an accepted first clinical answer
  and completion both inside the run qualify for the required patient sample.
  APP/service visitors, companions, tutorial helpers and employee discussions
  cannot fill that sample. Clinic and employee-discussion first answers still
  feed accuracy, including unfinished/retired subjects, wrong first answers and
  presented unanswered nodes. Already actionable unanswered questions are seeded
  at run start; unpresented future nodes are excluded.
- Completed reports are separate frozen last/latest/best snapshots. Higher raw
  scores replace best; ties retain the earlier best; lower results, Incomplete
  and cancellation retain it. A first valid report at **any score** atomically
  saves `progress.gameFinished` (first run ID, completion tick, notice ID and
  first report) once. The first notice ID is
  `event.level-five.game-finished`. `finishPageAcknowledgedAtFacilityTick` remains
  the M1/M7c dismissal contract. Inspection creates no reward, XP reset or FSRS
  event; ordinary accepted answers retain 10/2 XP and normal learning behavior.
- Both desktop Goals and phone Goals have the same shared view/commands: one-tap
  Book, frozen preparation terms, running minutes/sample, provisional categories,
  cancel/retry, latest/best and a plain ten-row report. Report and arithmetic/
  hint/missing-item disclosures start closed; buttons/summaries have 44px minimum
  targets and text wraps. Only discarding a running run requires confirmation;
  repeat taps dispatch once. Existing Manage pause policy and the shared session
  clock remain intact. M7b owns moving inspector actors; M7c owns polished
  report/finish pages and Keep playing/New campaign. Neither is implemented here.
- Schema 9 and omitted legacy Level 5 defaults remain unchanged. New sequence,
  frozen thresholds and structural evidence fields are optional on older M1
  snapshots, preserved without load-time repair and strictly validated when
  present. Existing foundation seam tests now account for the active M7a observer
  and enabled booking; new M7a tests exercise the real command path.

### Arithmetic and observed evidence

These are the plan's editorial game formulas, not clinical/regulatory values.
Rules `inspection-rules.v1` use **5 x 10 x 60 = 3,000 active minutes** and at least
**20 qualifying scored completions**. Run start freezes the release IDs and
denominators: **B = 33 buildable types** (Front Desk/Hallway included, retired/
future types excluded), **U = 31 upgradeable types**, **28 canonical physical
positions across 16 role types**, plus positions in extra built instances.

Baseline preparation is **60 raw -> 60 active minutes**. Qualified Executive
training tiers 1-5 use `m(T)=1+0.25(T-1)` and
`60 x (1 - 0.05 x m(T))`: **57 / 56.25 / 55.5 / 54.75 / 54 raw** ->
**57 / 57 / 56 / 55 / 54 quoted active minutes**, one ceiling at booking.
The saved quote survives firing, training and reload. The Executive Office's
round-duration ladder is not applied a second time to preparation; the scored
window always remains 3,000 minutes. Real qualified round/booking tests cover
all five employee tiers with an office at tier 5.

Let `avg_t` mean all observed active minutes, `clip(x)=min(1,max(0,x))`,
`P(t)` mean canonical plus extra positions, and `E(t)` unmatched hired employees.
Every missing structural member contributes zero; weights are never renormalized.

| Category | Weight | Implemented 0-100 formula |
| --- | --- | --- |
| Cleanliness | 10% | `100 x cleanRoomMinutes / observedRoomMinutes`; clean is >= the frozen existing threshold 80; all placed rooms, existing legacy fallback 100. Raw mean/minimum retained. |
| Rooms built / usable | 10% | `100 x avg_t(usable distinct types / size(B))`; duplicates cannot replace missing types. |
| Room upgrades | 10% | `100 x avg_t(mean over U of mean over every placed copy of clip((level-1)/(maximum-1))))`; absent type = 0. |
| Staffing coverage | 10% | `100 x avg_t(distinct valid installed filled positions / size(P(t)))`; founder excluded. |
| Employee training | 10% | `100 x avg_t((sum matched position (tier-1)/4 + sum E(t) (tier-1)/4) / (size(P(t))+size(E(t))))`; empty positions = 0. |
| Staff morale | 10% | `avg_t(common effective employee morale mean)`; empty workforce minute = 0. |
| Patient satisfaction | 10% | `sum final satisfaction / count` over every scored completion/walkout in the window, independent of the HUD's last-ten sample. |
| Wait / flow | 5% | `100 x [0.5 x (1-overdueQueueMinutes/queueMinutes) + 0.5 x completed/(completed+walkouts)]`; legitimate zero queue denominator gives 1 only with the required patient sample. Each actual onsite queue contributes at most once per minute, overdue strictly after idle 20 / check-in 60. Open charts, prescribed processing, external-result clocks and necessary travel are excluded. |
| Finances | 5% | `100 x [0.5 x fullyPaidPositivePostings/positivePostings + 0.5 x clip((gross-stock-fullChargedOperatingCosts)/(0.05 x gross))]`; zero positive gross/postings yields zero for that component. Actual receipts/settlement cash, stock once, full charged costs including unpaid amounts; partial bill is not fully paid. Capital/grants/sales/reserves excluded. |
| Game answer accuracy | 20% | `100 x correctFirst / (allFirst + presentedUnansweredAtEnd)` for clinic and employee discussions; first wrong answers remain. |

Weights sum to **100%**. Each report stores formula, raw values, score, weighted
points, improvement hint and structural/answer shortcomings. The plan's example
scores `90,80,75,85,70,90,95,80,90,90` reproduce
`9+8+7.5+8.5+7+9+9.5+4+4.5+18 = 85.00` exactly. Display uses
`floor(rawTotal x 100)/100`, so **99.995 -> 99.99**, never 100. Recognition uses
unrounded totals: <80 Improving, 80..<95 Prestige, 95..<100 Distinguished,
exactly 100 Perfect. The perfect guard additionally checks full room/slot/tier
evidence and no wrong/unanswered questions. An empty structural evidence list
cannot manufacture a perfect result. Cancellation/Incomplete has no total or
recognition eligible to replace prestige.

The `inspection-final` QA preparation and **2,999 reducer-observed minutes**
reconciled cash after each minute against gross minus stock minus actual paid
postings, and full charged costs against `totalOperatingExpenses`. Its boundary
XP and one scripted existing-case admission per 120 minutes are explicit QA
setup, **not zero-XP pacing or measured normal demand**. All preparation, answers,
waits, completions, receipts and postings are earned through ordinary commands;
no completed encounter or inspection evidence was fabricated. First completed
subjects retired before the report and their evidence remained.

On the last real minute: **3,000 minutes, 25 qualifying completions, 25 correct
first answers, no unanswered questions, XP 2,000 + 25 x 10 = 2,250**. Actual gross
**250,000 cents**, stock **0**, full charged/paid operating costs **95,000 cents**,
**200/200 bills fully paid**, operating net **155,000 cents**. Cash reconciles
**2,836,917 + 250,000 - 0 - 95,000 = 2,991,917 cents**. The final observation
creates no extra cash/XP/FSRS reward. Its report is:

| Category | Raw category score | Raw weighted points |
| --- | ---: | ---: |
| cleanliness | 96.82777777777778 | 9.682777777777778 |
| rooms_built | 15.151515151514264 | 1.5151515151514263 |
| room_upgrades | 0 | 0 |
| staffing_coverage | 3.571428571428777 | 0.3571428571428777 |
| employee_training | 0 | 0 |
| staff_morale | 85 | 8.5 |
| patient_satisfaction | 100 | 10 |
| wait_flow | 100 | 5 |
| finances | 100 | 5 |
| clinical_answer_accuracy | 100 | 20 |

**Raw total 60.05507215007208 -> displayed 60.05/100 (Improving)**.
This low score completes the game once, and stays frozen through reload/retry.
The separate zero-answer window runs the same full 3,000 minutes and ends
**Incomplete, sample 0, total/recognition null, no game finish or best**.
The partial-payment/stock unit evidence is also explicit: $15 gross - $5.88
actual stock - $20 full charges = **-$10.88 operating net**; only one of two
positive bills fully paid gives a **25/100 finance score (1.25 weighted points)**,
even with $17 cash paid.

Machine-readable receipts and complete output are local worker artifacts:
[validation manifest](../../.local-dev/level5-m7a/validation.json),
[actual window/report evidence](../../.local-dev/level5-m7a/window-evidence.json),
[five QA state receipts](../../.local-dev/level5-m7a/qa-state-evidence.json),
[HTTP receipts](../../.local-dev/level5-m7a/qa-http.json),
[build asset receipts](../../.local-dev/level5-m7a/build-assets.json),
[scoped before/after diff](../../.local-dev/level5-m7a/scoped.diff) and
[preservation audit](../../.local-dev/level5-m7a/preservation.json).

### Validation commands and exact final output

Used unchanged repository configs with **`--pool=threads` and the authorized
EPERM preload**, not the default fork pool. Environment for the workspace
suites/typecheck/build/QA transform/typecheck and Node QA smoke:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
```

No command-line test exclusions/deadline overrides or config changes. New full
window integration cases have their own 60-second source deadlines; existing
deadlines/assertions remain unchanged. The two existing DEFECT-M9 reproducers
remain skipped. The player suite's sole failure is the previously known thyroid
pending-label assertion; it was not modified or hidden. No Git-backed root
aggregate/boundary wrapper or browser/default-pool PASS is claimed.

Exact final full-suite summaries (complete output linked per command):

`npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` — exit **0**; [full output](../../.local-dev/level5-m7a/balance-full.log).

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  02:42:39
   Duration  1.14s (transform 3.41s, setup 0ms, import 9.52s, tests 238ms, environment 2ms)
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` — exit **0**; [full output](../../.local-dev/level5-m7a/domain-full.log).

```text
 Test Files  148 passed | 1 skipped (149)
      Tests  4152 passed | 2 skipped (4154)
   Start at  02:46:00
   Duration  170.58s (transform 6.57s, setup 0ms, import 62.05s, tests 607.56s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` — exit **0**; [full output](../../.local-dev/level5-m7a/content-full.log).

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  02:42:39
   Duration  5.60s (transform 16.30s, setup 0ms, import 58.61s, tests 6.35s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` — exit **1**; [full output](../../.local-dev/level5-m7a/player-full.log).

```text
 Test Files  1 failed | 217 passed (218)
      Tests  1 failed | 1929 passed (1930)
   Start at  02:49:52
   Duration  47.71s (transform 9.37s, setup 0ms, import 86.45s, tests 86.33s, environment 11ms)
```

The sole allowed player failure, exact assertion/location:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });
```

`npm.cmd run typecheck` — exit **0**; [full output](../../.local-dev/level5-m7a/typecheck-final.log). Only terminal ANSI controls are omitted below.

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

`npm.cmd run build --workspace @gamify-surgery/player` — exit **0**; [full output](../../.local-dev/level5-m7a/build-final.log). Only terminal ANSI controls are omitted below.

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 733 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.42 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-D6OMV9M8.css                                   39.47 kB │ gzip:     6.78 kB
dist/assets/index-D4-DU0yv.css                                        165.31 kB │ gzip:    30.71 kB
dist/assets/MobileEntryPresentation-TI-NdQNS.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-7hlDk-B8.js                                   116.57 kB │ gzip:    30.85 kB
dist/assets/index-Dujv_F-1.js                                      12,567.85 kB │ gzip: 2,045.37 kB

npm.cmd : [PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
At line:2 char:157
+ ... _COLOR='1'; npm.cmd run build --workspace @gamify-surgery/player *> . ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([PLUGIN_TI...is a breakdown::String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
  - forbid-private-clinical-modules (87%)
  - vite:prepare-out-dir (5%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: 
https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.51s
```

The build retained its existing plugin-timing/large-chunk warnings and the
default Vite base. Public entry asset URLs remain same-origin `/assets/...`;
the separate mobile chunk and both shells' booking/cancel hooks were verified.
No publication or launcher/pathway change occurred.

Additional checks, all exit **0** (complete local logs in the validation manifest):

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/facility-inspection.test.ts` — [full output](../../.local-dev/level5-m7a/scoring-boundaries.log).

```text
 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  02:45:41
   Duration  2.35s (transform 1.34s, setup 0ms, import 1.82s, tests 457ms, environment 0ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/inspectionViewModels.test.tsx src/session/levelFiveProgressionViews.test.tsx src/session/levelFiveStateQa.test.ts src/mobile/levelFiveGoals.test.tsx` — [full output](../../.local-dev/level5-m7a/focused-player-final.log).

```text
 Test Files  4 passed (4)
      Tests  64 passed (64)
   Start at  02:41:15
   Duration  4.20s (transform 8.42s, setup 0ms, import 11.73s, tests 2.32s, environment 0ms)
```

`node tools/qa/level-four-rooms.mjs --check` — [full output](../../.local-dev/level5-m7a/qa-transform.log).

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
Level 5 M6 goals transform PASS: QA-only Level 4 Advance; three live goals; durable unlock without booking/scoring.
Level 5 M7a inspection transform PASS: booking/window/event evidence, final-minute scored and incomplete QA; no listener or browser storage.
```

`node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m2/qa-tsconfig.json` — [full output](../../.local-dev/level5-m7a/qa-typecheck.log).

```text
(no output; exit 0)
```

`node scripts/verify-launcher-contract.mjs` — [full output](../../.local-dev/level5-m7a/launcher.log).

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

`node --import ./.local-dev/level5-m6/source-loader.mjs .local-dev/level5-m7a/qa-smoke.mjs` — [full output](../../.local-dev/level5-m7a/qa-smoke.log).

```text
PASS inspection-ready: ready; preparation 60 -> 60; observed -; sample -; final -; saved profile resumed unchanged.
PASS inspection-executive: ready; preparation 57 -> 57; observed -; sample -; final -; saved profile resumed unchanged.
PASS inspection-running: running; preparation 60 -> 60; observed 0; sample 0; final -; saved profile resumed unchanged.
PASS inspection-final: running; preparation 60 -> 60; observed 2999; sample 25; final completed; saved profile resumed unchanged.
PASS inspection-incomplete: running; preparation 60 -> 60; observed 2999; sample 0; final incomplete; saved profile resumed unchanged.
PASS five M7a QA scenarios: desktop/phone URL guards, distinct disposable campaigns, strict save round-trip, unchanged resume and real last-minute outcomes; no browser storage or listener changes.
```

`node .local-dev/level5-m7a/qa-http.mjs` — [full output](../../.local-dev/level5-m7a/qa-http.log).

```text
PASS existing 5184 QA listener: ten desktop/phone scenario URLs and the M7a fixture module return HTTP 200; location.origin=http://127.0.0.1:5184; read-only HTTP, no browser geometry/storage or listener changes.
```

`node .local-dev/level5-m7a/build-assets.mjs` — [full output](../../.local-dev/level5-m7a/build-assets.log).

```text
PASS production build assets: same-origin index entry assets exist; separate MobileShell chunk exists; booking/cancel command hooks appear in desktop and mobile chunks; default Vite base unchanged.
```

The Node smoke reuses the read-only M6 TypeScript source loader; its
`stripTypeScriptTypes` ExperimentalWarning is retained in the full smoke log.
It verifies all five factories, desktop/phone origin/query guards, distinct
campaign IDs, strict save round-trips, unchanged existing-profile resume and
real final-minute outcomes. This is command/state/HTTP evidence, **not browser
geometry, touch/keyboard or visual acceptance**.

### Manager QA: desktop and phone

Reuse the existing **5184** QA listener. If it is later stopped, its unchanged
start command is `node tools/qa/level-four-rooms.mjs`. Use the normal access gate
and a **dedicated disposable Level 5 browser profile**. `location.origin` must
be **`http://127.0.0.1:5184`**. Do not remove `?level5=` on reload or open an
ordinary cap-4 QA entry on a profile containing Level 5 saves. Each scenario has
a distinct M7a campaign; the same scenario with another layout resumes that same
campaign, and a reload never reseeds it. A previously finished/cancelled scenario
therefore resumes its current state. Use another disposable QA profile for a
fresh boundary, preserving existing owner/QA campaigns.

| Scenario | Desktop URL | Phone URL | Initial state / what to observe |
| --- | --- | --- | --- |
| `inspection-ready` | [desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-ready&layout=desktop) | [phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-ready&layout=phone) | Paused, earned unlock, partial clinic/no Executive. Open Goals: Book enabled, free 60 raw -> 60-minute quote. Book once/double-tap: one preparation; Play/close the existing pause overlay to advance it. Reload preserves end tick. Cancel preparation/retry has no report/prestige/reward. |
| `inspection-executive` | [desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-executive&layout=desktop) | [phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-executive&layout=phone) | Paused, real completed tier-1 daily round, qualified installed Executive. Goals shows 57 raw -> 57 active-minute quote. Book and reload; fire/change the Executive through ordinary employee controls after booking: that accepted quote stays 57. A future unqualified booking returns to 60. |
| `inspection-running` | [desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-running&layout=desktop) | [phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-running&layout=phone) | Paused immediately after real preparation, running 0/3000 with 0/20. Goals exposes progress and provisional categories. Play/close Goals advances one shared clock; pause/reload freezes it. Running Cancel asks once; Keep inspection preserves it, Confirm cancel gives no prestige/finish; Book another inspection remains available. |
| `inspection-final` | [desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-final&layout=desktop) | [phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-final&layout=phone) | Paused at 2999/3000, with 25 real scored completions/answers. Play outside paused Goals for one facility minute, then reopen Goals: completed report 60.05/100 Improving, latest/best 60.05 and first game completion recorded. Expand ten rows/arithmetic/hints/shortcomings. Reload and switch layout: same first report/notice, no extra XP/cash reward. Retry then cancel preserves best. No polished Congratulations page yet (M7c). |
| `inspection-incomplete` | [desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-incomplete&layout=desktop) | [phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-incomplete&layout=phone) | Paused at 2999/3000 with 0/20. Play one facility minute: Incomplete, full observed window, no prestige total/recognition/best or game finish. Plain category listing explains missing samples/slots. Book another inspection is enabled immediately. |

Also retain [pre-goal desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=pre-goal&layout=desktop)
and [pre-goal phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=pre-goal&layout=phone):
Book remains Locked before the earned three-goal record. In the two final-minute
scenarios the earlier window was generated during isolated QA setup; continuing
play does not run an inspection answer bot or fabricate future activity. These
fixtures do not establish M8 default-demand/zero-XP economic pacing.

Manager browser checks: desktop **1600x1000**; phone **360x740, 390x844, 412x915,
844x390 and 768x1024**. Inspect 44px targets, wrapping/no horizontal overflow,
closed compact report disclosures, local scrolling after expansion, keyboard/
touch single-submit behavior, running cancel confirmation across progress updates,
the existing Goals/Manage pause policy, 1x/4x progress, reload and shell switching.
The report must show all ten weights/formulas/hints and preserve its frozen values.
Inspector actors are intentionally absent from the new M7a states (M7b next).
The first-completion record is ready for M7c; its polished page/actions remain
pending. Actual browser/default-config/aggregate acceptance remains the manager's
lane; no owner browser/storage was operated by this worker.

The read-only HTTP check reused the manager's existing listener: all ten new
desktop/phone URLs and the fixture module returned 200. No listener was started,
stopped or replaced. The CLI state checks did not read/write browser storage.

### Preservation and handoff boundary

Before this append: **37 changed/new paths, 1,085 unchanged baseline paths, zero
removed paths**. Including this append: **38 changed/new paths, 1,084 unchanged,
zero removed**. All changed source/test/
QA/plan files are UTF-8 without BOM and LF. `routeMotion.ts`, the shipped cap **4**,
ordinary Level 0-4 behavior, existing runtime configs/deadlines, clinical source/
approval status, assets, canonical owner launchers and manager global handoff were
preserved. Existing route-index/APP-pool DEFECT-M9 reproducers and the known thyroid
failure remain identified; no unrelated fix was folded into this lane.

Owner desktop remains `START_GAME.cmd -> http://127.0.0.1:4173`; private phone
remains `https://melissadesktop.taile197db.ts.net/`; canonical remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`. These origins/profiles have
separate saves from the disposable **5184** QA origin. No owner save was read,
copied, cleared or migrated and no campaign synchronization is implied.

No Git, agents, installs, commits, push, deployment, publication, external message
or new clinical authoring. This validated checkpoint is **local only**; the manager
owns the global handoff/checkpoint and the binding finish-M10-then-push direction.
Next action: manager inspect the scoped diff/receipts, perform both-shell QA,
accept M7a, then dispatch the exclusive M7b lane. Ordinary cap 5 remains M10.
- 2026-10-12 manager: M7a ACCEPTED (worker resumed once after a transient Codex capacity interruption). Chrome QA: ?level5=inspection-final desktop -> one Play minute completes the report: 'Inspection completed', Latest 60.05/100, Best prestige 60.05/100, 'First game completion recorded', Book another inspection, Alerts milestone 'You finished the game'; ?level5=inspection-ready phone -> Book (double tap) starts exactly one 60-minute preparation with Cancel; no page errors. Stale 'when booking opens in M7' tip queued to M7c. Worker suites: balance 149, domain 4152+2 skips, content 628, player 1929 + known thyroid failure; typecheck/build PASS. M7b and M7c dispatched in parallel (disjoint lanes).

## Level 5 M7b: inspector actors

2026-10-12 Sol worker handoff. **Implementation, QA fixtures and worker validation
complete; manager actual-diff review and desktop/phone browser acceptance remain
pending.** This is M7b only. M7c report/finish pages, ordinary launch M10 and the
manager-owned CURRENT_THREAD_HANDOFF.md were preserved. The ordinary cap remains
**4**. No Git, installs, agents, external messages, release or publication.

### Implementation and compatibility

- Promoted the ten manager-accepted `inspector-v6f.001`-.010 identities, all
  **80 byte-exact 160x320 RGBA PNGs** and **40 authored seated contacts**, following
  the v6e registry/provenance/immutable-intake pattern. The separate runtime
  approval binds the actual October 11 manager acceptance line and exact pose/
  contact hashes. Original pending art-review labels, sources, galleries, proofs,
  correction history and tools stay frozen; no image generation, editing,
  mirroring, alpha cleanup or re-encoding occurred.
- Added a distinct domain `inspector` category and `inspection-agent` presentation
  role, with empty staff eligibility. Inspector IDs never enter adult/child,
  staff, founder or companion selection. Existing patient and employee looks,
  appearances and selection/persistence code are unchanged.
- The existing M1 `inspectionPresentation` lane owns the run ID, visual seed,
  ten stable actor IDs, paths/cursors, movement tick, target and observation
  deadline. The reducer adds only two narrow synchronization calls. Actors arrive
  through the real public entrance, spread across different reachable built rooms
  first, hold safe aisle positions and circulate after five active observation
  minutes. Starts are staggered by cast index. With fewer rooms, distinct aisle
  holds and within-room circulation remain possible; no invisible room is added.
- A cached **presentation-only** path graph reads existing approved physical
  footprints, retained furniture, actual doors and room rotation. It excludes
  seat/care/staff contacts from observation stops and respects optional door-owned
  furniture. Gift N2's approved narrow aisle at floor y=.55 uses .05-tile sampling;
  other circulation uses .1. This does not change gameplay navigation or any
  accepted authored route. Live door/layout changes revalidate routes. An
  unreachable observer holds truthfully and retries without stalling inspection.
- The shared FacilityScene draws a separate inspector layer in both shells,
  using the existing cardinal-standing hop motion, exact clipboards, standard
  identity scale/floor anchor and ordinary character depth. `routeMotion.ts` is
  byte-unchanged. Mobile inspector PNGs use the shared decoded-source cache;
  desktop keeps its existing lazy character loader. Only forty live standing
  cardinals are prefetched; registered seated poses never occupy furniture.
  Failed art becomes a stationary visual observer and exposes a QA issue on its
  graphics object, without a gameplay mutation.
- Desktop selection identifies an **Inspection agent** and its observed room.
  Phone tap opens the existing small bottom sheet with **Inspector · reviewing
  <room>** and Close. It has no chart, Praise, hire, salary, training or room action.
  Live selection refreshes and a departed/cancelled inspector cannot select a
  different patient/staff actor. Opening/closing the sheet dispatches no game or
  clock action; no long phone root list or new scrolling screen was added.
- No employee/patient/service/retail actor, seat/door/care reservation, queue,
  payroll, morale, litter, wear, money, answer, scoring input or clock is created
  by an inspector. The visual stream is `inspection_presentation.v1`; no clinical,
  arrival, identity or retail RNG is called. A 150-active-minute paired real-reducer
  on/off run, including reload, compares **every other state field exactly**:
  frozen scored cases, arrivals, reservations, FSRS, finances, tips and inspection
  accumulators remain identical.
- Existing M7a finish/cancel handlers clear the lane on completed, incomplete or
  cancelled outcomes. Repeat runs receive a new run-keyed team; old reports and
  first completion remain unchanged. Save schema stays **9** and the existing
  M1 actor reader remains unchanged. Missing old-save fields remain absent; loads
  do not fabricate a team, goal, award, report or expense. Levels 0-4 retain their
  original behavior. Clinical content, approval status and known DEFECT-M9 issues
  are unchanged.

The initial full domain run caught the old M1 dormancy expectation for the newly
active actor lane. It now isolates that lane, as M7a already isolates scoring.
The two new M7b factories earn goals then simulate real clinic wear/travel, so
they use dedicated real motion and whole-state visual-on/off checks rather than
the M1 test that deletes all earned progress. Deleting that progress after
satisfaction declines legitimately changes a progression-tip observation; it
was not a presentation side effect. Existing legacy/persistence checks still
run. No runner exclusion, alternate config or existing deadline was changed.

### Files changed

Existing exact seams/tests (20), plus this append:

- `apps/player/src/art/{characterStillRegistry.generated.json,characterStillRegistry.ts,characterStillRegistry.test.ts}`
- `apps/player/src/facility/{FacilityScene.ts,types.ts,characterInspect.ts}`
- `apps/player/src/mobile/MobileInspectorSheet.tsx`
- `apps/player/src/mobile/map/selection.ts`
- `apps/player/src/session/{viewModels.ts,characterActivityPresentation.ts,levelFiveStateQa.test.ts}`
- `packages/game-domain/src/{characterStillCatalog.ts,characterStillCatalog.test.ts,index.ts,reducer.ts}`
- `packages/game-domain/tests/level-five-state-persistence.test.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/{level-five-state-bootstrap.ts,level-four-rooms.mjs}`
- `tools/character-mapping/gs026-runtime-stills/provenance-manifest.json`
- `docs/execplans/level5-launch-plan-20261010.md` - this append only.

New source/test/QA/tool files:

- `packages/game-domain/src/inspection-presentation.ts`
- `packages/game-domain/tests/inspection-presentation.test.ts`
- `apps/player/src/session/inspectionActorViewModels.ts`
- `apps/player/src/art/inspectorStills.test.ts`
- `apps/player/src/facility/inspectionActors.test.ts`
- `apps/player/src/mobile/map/inspectionActors.test.tsx`
- `apps/player/src/mobile/performance/inspectorAssets.ts`
- `tests/fixtures/level-five-inspectors.ts`
- `tools/character-mapping/inspector-v6f/{promote-runtime.mjs,validate-runtime-integration.mjs,INTEGRATION.md}`

New assets/receipts:

- `apps/player/public/art/characters/inspector-v6f/inspector-v6f.001/` through
  `.010/`: eight approved cardinal standing/seated PNGs per identity, **80 files**.
- `artifacts/character-statics/inspector-v6f/{runtime-approval.json,runtime-integration.json}`.
- Four immutable intake copies under that artifact's
  `runtime-integration-baseline/`: original generated registry, registry source,
  domain catalog and provenance manifest.

Including this append: **21 changed existing paths + 97 new paths = 118 paths**,
no removals. The 4,984-path intake audit leaves **4,963 original paths unchanged**,
including all **988 original inspector source/tool/proof files**, original PNGs,
clinical sources, all M7c report/finish UI, configs/lockfiles, routeMotion, ordinary
cap, launchers, other plans and the manager handoff. Changed/new text is strict
UTF-8 without BOM/LF. The complete prior plan bytes are preserved before this
append. [Inventory/preservation](../../.local-dev/level5-m7b/preservation.json),
[actual scoped diff](../../.local-dev/level5-m7b/scoped.diff),
[validated hashes](../../.local-dev/level5-m7b/validated-source-hashes.json).

### Arithmetic and fidelity evidence

- Registry: **326 + 10 = 336 identities**; **2,608 + 80 = 2,688 cardinal poses**;
  **30 unchanged extra clipboard assets**, hence **2,638 + 80 = 2,718 assets**.
  **1,304 + 40 = 1,344 seated directional contacts**. Inspector clipboard pixels
  are already in every accepted pose; no extra clipboard overlay was generated.
- New PNG bytes: **2,867,232**. All 80 source/public/dist SHA-256 values agree.
  All 326 prior registry rows, 2,638 prior PNGs/provenance rows and prior input
  records are preserved. Patient pool stays **179**, staff pool **99**, and
  inspector additions to either pool are **0**.
- Cast: **10 actors**, one per accepted look. Five-active-minute observation
  dwell, index offsets **0..9 minutes** for entry, then actual physical travel at
  the existing canonical rate. Presentation timing is editorial; the inspection
  remains **3,000 active minutes / 20 qualifying patients**, unchanged.
- Route QA covers all **12 + 10 + 12 + 16 + 16 = 66** Level 5 perimeter segments,
  including Executive N2/S2 with retained chairs and Gift N2's narrow aisle.
  The integrated fixture reaches every one of its **nine** non-hallway rooms;
  each inspector observes and visits more than one room. A Front-Desk-only fixture
  keeps ten distinct aisle holds and safe circulation.
- Actual FacilityScene route/hop tests sample **75 minutes x 12 frames x 10
  actors = 9,000 samples at each of 1x and 4x**, **18,000 total**, through reload.
  Both scene bridges check scale/depth, live forty-cardinal prefetch, normal
  cleanup and stationary art-failure fallback. Only Phaser's constructor base
  and drawing outputs are stubbed in Node; no browser/canvas geometry PASS is
  claimed. The phone test opens/closes the real React inspector sheet for every
  look and proves no chart/staff/clock dispatch or state mutation.
- Inspector costs, income, scores, reservations and clinical/arrival RNG delta:
  **0**. The paired on/off comparison preserves complete non-presentation state,
  rather than relying on matching arrival counts alone.

### Validation configuration and exact output

Used the **unchanged checked-in configurations with `--pool=threads`**, not
the default fork pool, with this requested preload and `NO_COLOR=1`:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

No installs, alternate config, runner exclusions, worker-limit overrides or
changes to existing deadlines. New long motion/door cases declare their own
30-second bounds. Exact final full-suite summaries:

`npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads`
— exit **0**:

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  03:55:21
   Duration  763ms (transform 1.67s, setup 0ms, import 6.18s, tests 207ms, environment 2ms)
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`
— exit **0**:

```text
 Test Files  149 passed | 1 skipped (150)
      Tests  4163 passed | 2 skipped (4165)
   Start at  04:09:47
   Duration  177.31s (transform 6.52s, setup 0ms, import 63.50s, tests 632.89s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads`
— exit **0**:

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  04:00:01
   Duration  5.14s (transform 14.42s, setup 0ms, import 54.24s, tests 6.34s, environment 9ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`
— exit **1**, only the permitted unchanged thyroid assertion:

```text
 Test Files  1 failed | 220 passed (221)
      Tests  1 failed | 1940 passed (1941)
   Start at  04:14:57
   Duration  50.55s (transform 9.30s, setup 0ms, import 88.40s, tests 95.76s, environment 11ms)
```

Exact failure: `src/session/surgeryCenterServicePreviews.test.ts:85:52`,
**ignores the retired concealment flag and preserves the scheduled external
service after an answer**. Expected `pendingLabel` to contain
**Off-site thyroid fine-needle aspiration**; received the existing generic
pending care/travel/procedure/pathology/return label. Source and expectation
were preserved. The two domain skips remain the existing DEFECT-M9 reproducers.
No other final failure is accepted.

`npm.cmd run typecheck` — exit **0**, all seven workspaces.
`npm.cmd run build --workspace @gamify-surgery/player` — exit **0**:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 736 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-D6OMV9M8.css                                   39.47 kB │ gzip:     6.78 kB
dist/assets/index-D4-DU0yv.css                                        165.31 kB │ gzip:    30.71 kB
dist/assets/MobileEntryPresentation-CaiJibMA.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell--myZ6BVv.js                                   116.68 kB │ gzip:    30.86 kB
dist/assets/index-C4auGA9A.js                                      12,604.78 kB │ gzip: 2,055.08 kB
✓ built in 4.24s
```

The existing plugin-timing/large-chunk warnings remain. MobileShell and mobile
entry remain separate lazy chunks; no CSS, ordinary launcher or publication
setting was changed. Complete font/warning/typecheck output is retained below.

Additional executed checks, all exit **0**:

- `node tools/character-mapping/inspector-v6f/promote-runtime.mjs --check`:
  PASS read-only, ten identities/eighty poses/forty contacts, exact byte counts.
- `node tools/character-mapping/inspector-v6f/validate-runtime-integration.mjs --dist`:
  PASS all eighty source/public/dist PNGs, old registry/provenance/PNG prefix,
  empty inspector patient/staff eligibility and authored contacts.
- `node tools/character-mapping/inspector-v6f/promote-runtime.mjs`:
  PASS **idempotent-no-write** after integration.
- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/inspection-presentation.test.ts`:
  **1 file / 9 tests PASS**, including all 66 doors, small clinic, paused reload,
  cleanup and whole-state on/off independence.
- Focused actual Scene/phone/still checks: **3 files / 9 tests PASS**; the wider
  seven-file integration check passed **74 tests** before the final fallback
  assertions, which are also covered by the final full player suite.
- `node tools/qa/level-four-rooms.mjs --check`: production Vite transforms PASS,
  including the new M7b fixture; no listener or browser storage action.
- `node scripts/verify-launcher-contract.mjs`:
  `Verified launcher health contract gamify-surgery-player protocol 1.`
- `node --import ./.local-dev/level5-m6/source-loader.mjs .local-dev/level5-m7b/qa-smoke.mjs`:
  both factories, strict desktop/phone origin/query guards, ten actors, all nine
  rooms, save round-trip, unchanged profile resume and cancellation PASS.
- `node .local-dev/level5-m7b/qa-http.mjs`: four desktop/phone URLs and all eighty
  exact PNG responses return **HTTP 200** on the manager's existing 5184 listener.

The historical direct v6f `validate-roster.mjs --require-complete --check-only`
stops on its pre-M2 hash for `approvedRoomPresentation.ts`: expected
`86cfa665d36576e5f52ee5592c1a44d153331001ac01b82b961523390dc785ff`, current
`ea08793d45fa2c62a25bed986797a0cab6a127f584bd316b31abf505e84332e4`. That art-only
whole-runtime baseline predates accepted room integration. It was not rewritten
or relaxed. The scoped read-only validators above bind the accepted v6f bytes,
contacts, current role separation and old runtime prefix instead.

[Exact complete output](../../.local-dev/level5-m7b/validation-output.md),
[command/exit receipts](../../.local-dev/level5-m7b/validation.json),
[balance](../../.local-dev/level5-m7b/balance-full.log),
[domain](../../.local-dev/level5-m7b/domain-full-final.log),
[clinical](../../.local-dev/level5-m7b/content-full.log),
[player](../../.local-dev/level5-m7b/player-full-final.log),
[typecheck](../../.local-dev/level5-m7b/typecheck-final.log),
[build](../../.local-dev/level5-m7b/build-final.log),
[assets](../../.local-dev/level5-m7b/asset-audit-final.log),
[QA state evidence](../../.local-dev/level5-m7b/qa-state-evidence.json),
[HTTP evidence](../../.local-dev/level5-m7b/qa-http.json).
Readable evidence removes only ANSI controls; complete logs retain all output
with capture encoding normalized to UTF-8/LF. Initial work-in-progress failures
remain in scratch. No manager default-pool, Git-boundary, browser/canvas or
physical-phone PASS is claimed.

### Manager QA: desktop and phone

Reuse **`node tools/qa/level-four-rooms.mjs`** on the existing strict-loopback
listener. Use a **dedicated disposable Level 5 profile/context**, complete the
normal access gate and retain `?level5=` on every reload. Confirm
**`location.origin === 'http://127.0.0.1:5184'`**. Existing scenarios/campaigns
resume without reseeding; use a fresh disposable context to replay an initial
arrival, rather than clearing an owner/QA campaign.

| Scenario | Desktop | Phone | Initial view |
| --- | --- | --- | --- |
| `inspectors` | http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors&layout=phone | Paused after 60 real preparation and 80 real inspection/travel minutes; ten inspectors distributed/circulating through the nine-room partial clinic. |
| `inspectors-arriving` | http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors-arriving&layout=desktop | http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors-arriving&layout=phone | Paused at the real running boundary, 0/3000; ten distinct outside entry positions and staggered arrival. |

These campaigns are `campaign.qa.level-five-inspectors-m7b.<scenario>`. Boundary
XP **2,000** is explicit synthetic setup; rooms/doors, booking, preparation,
observed minutes and actor travel are real commands. No score-bearing sample,
completed report, clinical answer, paid inspector, award or finish is seeded.

1. Inspect the actual diff, prefix/hash checks and final output. Rerun manager
   aggregate/default-pool/browser checks in the authorized manager environment.
   Preserve the known thyroid failure and two existing domain defect skips.
2. Desktop **1600x1000**: open `inspectors`, pan north to the five Level 5 rooms,
   then Play at **1x and 4x**. Watch all ten accepted looks, clipboard-bearing
   standing cardinals, correct scale/floor/depth, room distribution, short stops
   and onward trips. They remain standing in clear aisles, use real openings,
   and do not replace sitters or walk through furniture. Open `inspectors-arriving`
   in a fresh context to watch the public entrance. Click an inspector: only
   Inspection agent/current room info, no Praise, chart or employment action.
3. Phone **390x844**, then **360x740, 412x915, 844x390 and 768x1024**: use the same
   scenario/campaign with `&layout=phone`. Pan/pinch/Recenter as usual; confirm
   identical team/motion and clipboards. One tap opens the small bottom sheet
   **Inspector · reviewing <room>** with Close; no long list/scroll, no chart or
   staff action, no automatic pause. Measure >=44px Close, no horizontal overflow,
   readable text and safe areas; check ordinary patient taps still open charts.
4. Pause mid-walk/stop, reload twice, switch layouts and resume. Compare the same
   ten IDs, run ID, cursor/targets and observation deadlines; no duplicate team,
   clock, reseed, cash/XP or evidence. Check 1x/4x animation and page errors/4xx.
5. Change a door/layout through ordinary guarded Build actions. Necessary
   furniture remains and actors replan around actual open doors. Inspect Executive
   N2/S2 and Gift N2. Block the upstream hallway at x35/y25, then restore it:
   inspectors never prevent the command, occupy a care reservation, hold scoring
   open or cross a closed wall. Isolated agents use safe local holds/circulation;
   genuine no-route/art failures are stationary QA defects. Test room sale/move
   during presentation and inspect the normal staff/patient care flow.
6. In Goals, cancel a running inspection through the shared existing confirmation.
   The team disappears in both maps, selected info expires, no prestige/game finish
   is earned and a new booking gets one fresh team. Preparation/pre-goal, completed,
   incomplete/cancelled and ordinary Level 0-4 states show no inspectors.
   For final-minute cleanup, use fresh contexts at the existing
   `?level5=inspection-final&layout=desktop|phone` and
   `?level5=inspection-incomplete&layout=desktop|phone` fixtures: one active minute
   clears the team and retains M7a's actual completed/Incomplete semantics.
   M7c owns whichever report/finish pages are present at manager review.
7. Review the paired on/off evidence and counters: employees/wages, waiting counts,
   reservations, selected cases, receipts, first answers, inspection arithmetic and
   clock remain domain-owned. Smoke ordinary Level 0-4 desktop/phone pathways and
   unchanged cap **4**; no M10 launch behavior belongs in this handback.

Owner pathways remain **START_GAME.cmd -> exact http://127.0.0.1:4173**, phone
preview on that same origin with `?layout=phone`, private phone
**START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/** and remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**. Different origins/profiles
retain separate saves; 5184 is disposable QA, not campaign synchronization or a
new physical-phone service. No owner storage or listener was operated.

**LOCAL ONLY checkpoint:** no GitHub backup was created by this No-Git worker.
The manager retains actual acceptance, CURRENT_THREAD_HANDOFF.md and the owner's
binding finish-M10-then-push direction (backup only, no Pages publication). Next
action: manager desktop/phone review and acceptance of M7b; continue the assigned
M7c/M8 lanes separately. No later milestone is implemented or accepted here.


### M7b fixes (2026-10-12; manager Chrome QA follow-up)

The manager's first desktop review at 1600x1000 accepted the ten moving looks,
distribution, stops and page-error-free presentation, and returned the furniture
overlap and foot-mark defects shown in
[frame](../../.local-dev/level5-m7b/manager-qa-frame.png) and
[zoom](../../.local-dev/level5-m7b/manager-qa-zoom.png). These fixes retain the
accepted inspector PNGs and existing cardinal hop renderer.

**Files changed in this follow-up:**

- `packages/game-domain/src/inspection-presentation.ts`: use both the physical
  fixture footprint and any declared navigation mask, plus the rooms' existing
  `APPROVED_LEVEL5_SUPPORT_NAVIGATION` fine contacts. Check entire cardinal edges
  against solids and protected contacts, including doorway bridges. Observation
  points have extra furniture clearance. Enter the Front Desk at its fine
  threshold, then walk around its public contact. Revalidate old stop endpoints;
  a pre-fix cosmetic actor stranded on a protected contact is relocated to the
  nearest clear floor node in its own room before choosing a safe route. Only
  the presentation lane changes; no seat, contact or route is reserved.
- `packages/game-domain/tests/inspection-presentation.test.ts`: full-window
  fixture/contact/continuous-path regression, midpoint reload, pre-fix hold/save
  preservation, clean-QA/ordinary-litter checks. Small-clinic circulation now
  checks that **every** actor changes position over the run, rather than requiring
  one particular walking phase at minute 40. All 66 door checks remain intact.
- `apps/player/src/facility/inspectionActors.test.ts`: existing 1x/4x Scene
  samples now check the actual promoted renderer footprints for all five
  prestige rooms, and the existing contracts for the other clinic rooms.
- `tests/fixtures/level-five-inspectors.ts`: explicitly defer this unstaffed
  presentation fixture's next litter event until after the inspection window.
- `docs/execplans/level5-launch-plan-20261010.md`: this appended note.

**Arithmetic and coverage:** walking clearance remains **0.18 tile**; observation
clearance is **0.30 tile**, adding **0.12 tile** at holds. Required contacts are
excluded from walking edges by 0.18 tile and from stops by the existing 0.55 tile.
Room stop inset remains 0.60 tile (hallways 0.40), so no stop occupies a doorway.
The Gift Shop's narrow 0.47-tile left aisle can carry a 0.18-radius walker but
cannot host a 0.30-radius hold; the Gym's west bench aisle likewise no longer
supplies a hold on the 0.10-tile graph. Existing 0.05-tile Gift walking knots,
0.10-tile other-room knots and five-active-minute observation cadence remain.

The full regression executes **3,000 real active inspection minutes × 10 actors
= 30,000 location checks**, continuously samples every new cardinal route at
<=0.025-tile intervals (**more than 100,000** samples), checks every observing
hold, reloads at minute 1,501, visits all **nine** built rooms and reaches the
real Incomplete boundary with the team cleared. No location/edge lies in a
fixture footprint or necessary contact. Scene checks execute **75 minutes ×
12 frames × 10 actors × 2 speeds = 18,000 rendered-position checks**, including
reload, with no rendered foot point inside the room renderer's fixtures.
All **66** prestige-room door segments still offer reachable safe stops.

**Foot-mark diagnosis:** the black-and-white pieces are the normal procedural
`litter` sprite from `fixtureArt.ts`, drawn by `FacilityScene.drawEnvironment`.
The original unstaffed `inspectors` fixture at tick 240 contains litter at
Executive **(31,19)**, Garden **(40,19)** and Gift Shop **(34,18)**, matching the
marks beside the inspectors. They are not detached inspector pixels, a
clipboard layer, shadow or inspection indicator. No inspector art, shadow or
litter renderer was modified. The clean presentation fixture now has zero
litter at that same tick, with its next event at **3161**, one minute after the
real inspection endpoint **3160** (`100 + 60 + 3000`). This is explicit synthetic
QA scheduling; normal gameplay litter still spawns and remains collectible.
The new regression forces the ordinary litter event and observes a real item.
[Reproduction and clean-state evidence](../../.local-dev/level5-m7b/fixes/litter-diagnosis.json).

**Validation configuration:** unchanged checked-in configs with
`--pool=threads`, `NO_COLOR=1`, and
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`.
No test exclusions, existing timeout changes, Git commands or installs.
The full suites were rerun after the final source edits; default-pool/browser
acceptance remains with the manager.

| Command | Exit | Exact final result |
| --- | --- | --- |
| `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/inspection-presentation.test.ts` | 0 | 1 file / 12 tests pass |
| `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/facility/inspectionActors.test.ts src/art/inspectorStills.test.ts src/mobile/map/inspectionActors.test.tsx` | 0 | 3 files / 9 tests pass |
| `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` | 0 | 21 files / 149 tests pass |
| `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` | 0 | 149 passed files + 1 existing skipped file; 4166 passed tests + 2 existing skips |
| `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` | 0 | 87 files / 628 tests pass |
| `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` | 1 | 220 passed files + 1 known failed file; 1940 passed tests + only the known thyroid failure |
| `npm.cmd run typecheck` | 0 | All seven workspaces pass |
| `npm.cmd run build --workspace @gamify-surgery/player` | 0 | 736 modules; built in 2.79s; existing large-chunk warning only |

Exact final test summary lines (complete raw output is linked below):

Balance:

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Duration  1.16s (transform 3.14s, setup 0ms, import 9.39s, tests 246ms, environment 3ms)
```

Domain:

```text
 Test Files  149 passed | 1 skipped (150)
      Tests  4166 passed | 2 skipped (4168)
   Duration  176.85s (transform 6.48s, setup 0ms, import 62.80s, tests 631.69s, environment 8ms)
```

Clinical content:

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Duration  5.53s (transform 15.87s, setup 0ms, import 56.72s, tests 6.40s, environment 9ms)
```

Player:

```text
 Test Files  1 failed | 220 passed (221)
      Tests  1 failed | 1940 passed (1941)
   Duration  50.55s (transform 9.66s, setup 0ms, import 89.73s, tests 94.09s, environment 12ms)
```

Only allowed player failure:
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, **ignores the retired
concealment flag and preserves the scheduled external service after an answer**.
Expected **Off-site thyroid fine-needle aspiration**; received the existing
generic pending-care/travel/procedure/pathology/return label. Its source and
expectation remain unchanged. No other final failure is accepted.

Additional checks, all exit **0**: production QA Vite transforms; strict 5184
desktop/phone factories with clean floors, save round-trip and unchanged profile
resume; four HTTP-200 desktop/phone URLs and 80 exact PNG responses; read-only
v6f promotion preflight and source/public/**dist** integration audit. The audit
still reports **10 identities / 80 exact PNGs / 40 authored contacts /
2,867,232 bytes**, original 326 registry rows and 2,638 PNG/provenance records
preserved, patient pool **179**, staff pool **99**, inspectors in either pool
**0**. The first QA transform invocation omitted the preload and hit the known
Windows `net use` spawn-EPERM; the explicit-preload rerun passed. Its initial log
is retained separately. No PNG, registry, contact or room-art data changed here.

[Complete exact output](../../.local-dev/level5-m7b/fixes/validation-output.md),
[commands/exits/hashes](../../.local-dev/level5-m7b/fixes/validation.json),
[scoped diff](../../.local-dev/level5-m7b/fixes/scoped.diff),
[preservation evidence](../../.local-dev/level5-m7b/fixes/preservation.json),
[QA state](../../.local-dev/level5-m7b/fixes/qa-state-evidence.json),
[HTTP evidence](../../.local-dev/level5-m7b/fixes/qa-http.json).
Logs are normalized to UTF-8/LF; the readable output removes only ANSI controls.

**Manager QA rerun:** use a **fresh disposable Level 5 profile/context** for the
clean-floor presentation setup. Existing QA campaigns are intentionally resumed
without reseeding; their real accumulated litter is retained and can be cleaned
normally. Do not clear an owner campaign. Confirm
`location.origin === 'http://127.0.0.1:5184'` and keep `?level5=` on reload.

- Desktop **1600x1000**:
  http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors&layout=desktop
- Phone **390x844**, then the existing phone size matrix:
  http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspectors&layout=phone
- Arrival replay in a fresh context: the same URLs with
  `level5=inspectors-arriving`.

Play at 1x and 4x. Watch all ten accepted clipboard-bearing cardinals circulate
and hold on clear floor, especially Gift's left/back shelves, Gym's west towel
shelves/front equipment, Garden's fountain/planters, and real door approaches.
The fresh fixture has no floor-litter foot marks. Phone taps still show the
small **Inspector · reviewing <room>** sheet. Pause/reload preserves identities;
resume revalidates any pre-fix hold. Check care/retail sitters and contacts remain
available, and cancel/end removes the team. Check console errors and compare
desktop/phone positions. **No post-fix browser/canvas PASS is claimed by this
worker; manager visual reacceptance is the next action.**

Follow-up changes are limited to the four files listed plus this append.
`routeMotion.ts`, `FacilityScene.ts`, all mobile files and report UI are unchanged
from the fix baseline. Save readers/schema, clinical and arrival RNG, scoring,
clock, ordinary Level 0–4 behavior and live cap **4** remain unchanged. M7c's
lane is preserved. Owner opening pathways and separate-origin saves remain as
recorded above. **Local-only checkpoint; no GitHub backup or publication was
created.** The manager retains handoff/acceptance and the binding finish-M10-then-
push direction.

## Level 5 M7c: report card and finish page

2026-10-12 — GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
**M7c implementation, isolated QA state and worker validation complete; manager
actual-diff review and desktop/phone browser acceptance remain pending.** This
handoff covers M7c only. The October 11/12 bindings, owner-selected line 3 and
the manager's M1–M7a acceptance/M7b actor lane are preserved. No later milestone,
clinical authoring, live-cap switch, Git, installation, agent or publication.

### Implementation and compatibility

- Shared `InspectionReportCard` replaces M7a's plain report. It shows the overall
  score/recognition, best prestige/latest, full-window and qualifying-patient
  status, and all ten category bars with earned/max weighted points. Desktop
  category disclosures show the frozen formula, every raw numerator/denominator
  or mean, full-precision weighted arithmetic, status, **How to improve**, and
  expandable missing room/tier/physical-position/answer evidence. Total arithmetic
  shows the raw sum and floored display; no shell recalculates domain scores.
- Phone uses the same card in **ten compact tiles**: two columns in portrait,
  five in wide landscape. One tap replaces the grid with only that category's
  arithmetic/hint/missing items; Back returns to the grid and restores focus.
  Browser Back from a Goals/Inspection category closes that detail first.
  More → Inspection and Goals → View inspection reach the dedicated phone
  screen. Booking, frozen preparation, running/sample/provisional status,
  cancellation confirmation and retry still use M7a's existing shared commands.
- First completed valid inspection opens the native modal finish page in both
  shells. Its headline is exactly **"Congratulations. Your reward is a report
  card and the opportunity to improve it."** Two additional dry lines reuse
  accepted candidate prose. The page shows the **immutable first** report,
  alongside current latest/best prestige, **Keep playing**, and **Start new
  campaign**. Incomplete/cancelled runs do not open it. Later reports retain
  their normal report view without another automatic victory page.
- Session-owned page state survives shell changes. Opening pauses through the
  existing SET_PAUSED command; ordinary ticks, speed changes and prototype
  fast-forward are blocked while it is open. Keep playing uses the new guarded
  ACKNOWLEDGE_FINISH_PAGE command to set the existing nullable acknowledgment
  once, closes the page, and restores the prior running/paused state. A reopened
  page adds no second acknowledgment. Goals in desktop/phone and phone More
  expose **View finish report** after dismissal.
- Reload before acknowledgment reopens the first report; reload afterward does
  not. Reload retains the saved paused state, as with existing management
  pauses: if reloaded paused, Keep playing leaves the clinic paused and Play
  resumes it. An in-session shell switch retains the original pause-restoration
  flag. Native modal focus containment, heading focus, Escape and category focus
  restoration are implemented. Footer actions stay reachable while only the
  report body scrolls, with 44px controls and phone safe-area insets.
- Start new campaign opens an explicit shared confirmation. **Return to report**
  (or Escape) returns to the intact first report without a game command. Confirm
  calls the existing App `onCreateCampaign` → fresh founder/clinic flow, with
  no seed argument. It retains the finished campaign in Campaigns and creates
  a distinct identity/seed with fresh progress/FSRS histories when the normal
  opening flow completes. It never calls same-seed Restart or archives/deletes
  the completed clinic. The old page remains unacknowledged until Keep playing,
  so abandoning the fresh opening flow and resuming it returns to that page.
- Removed all current M7 future-booking placeholders, including the Goals/Alerts
  tip and historical M1 **synthetic QA** formula/hint strings. Historical plan
  progress/acceptance records remain verbatim. Phone Executive role text is
  concise; its existing complete home, salary bounds and actual funding facts
  remain in a closed **Home, pay & funding** disclosure. Desktop role copy is
  unchanged.
- Save schema stays **9**; no persistence reader or migration changed. The new
  command changes only the existing dismissal field and its operation receipt.
  Clinic, cash, XP, frozen encounters, staff, FSRS and first/latest/best reports
  are preserved. Ordinary Level 0–4 behavior and the live cap **4** remain.
  M7b actor/art/route code and `routeMotion.ts` are byte-unchanged. No clinical
  source, concept, claim or review status was edited or approved.

### Files changed and reviewed scope

**30 source/test/QA/plan paths** (20 existing exact edits + 10 new files):

- `apps/player/src/App.tsx`
- `apps/player/src/AppShell.tsx`
- `apps/player/src/mobile/MobileGoals.tsx`
- `apps/player/src/mobile/MobileInspection.tsx`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/inspectionReportCard.test.tsx`
- `apps/player/src/mobile/manage/MobileEmployees.tsx`
- `apps/player/src/mobile/navigation.ts`
- `apps/player/src/session/finishedGameFlow.test.tsx`
- `apps/player/src/session/inspectionViewModels.test.tsx`
- `apps/player/src/session/inspectionViewModels.ts`
- `apps/player/src/session/levelFiveReportQa.test.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `apps/player/src/ui/FinishedGamePage.tsx`
- `apps/player/src/ui/GoalsPanel.tsx`
- `apps/player/src/ui/InspectionControls.tsx`
- `apps/player/src/ui/InspectionReportCard.tsx`
- `apps/player/src/ui/finishedGamePage.css`
- `apps/player/src/ui/inspectionControls.css`
- `apps/player/src/ui/inspectionReportCard.css`
- `apps/player/src/ui/types.ts`
- `docs/execplans/level5-launch-plan-20261010.md`
- `packages/balance-config/src/level-five-progression.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/level-five-finish-page.test.ts`
- `tests/fixtures/level-five-report-card.ts`
- `tests/fixtures/level-five-state.ts`
- `tools/qa/level-five-state-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`

Before-images and hashes were captured without Git. The final audit preserves
**1,111 baseline paths**, has no removal/unowned change, and retains the entire
prior plan as a byte prefix. All changed source/test/QA/plan text is UTF-8 without
BOM and LF. The manager-owned CURRENT_THREAD_HANDOFF.md, other plans, package/
lock/Vite configuration, shipped balance and clinical/actor sources are intact.
Only the existing M7a report test was updated to check the requested ten bars,
contributions and hints; its gate/command/clock tests and the thyroid assertion
remain intact. Actual diff, before-images and final hashes are linked below.

### Arithmetic

M7a's domain scoring is unchanged. Weights are **10/10/10/10/10/10/10/5/5/20**,
total **100%**. Each contribution is `raw category score × weight / 100`; raw
fractions are retained, and the final display is `floor(raw total × 100)/100`.
The plan example remains `9 + 8 + 7.5 + 8.5 + 7 + 9 + 9.5 + 4 + 4.5 + 18 = 85`.
The UI formatting test retains **99.995 → 99.99 Distinguished**, never Perfect.
Best prestige remains the highest raw valid completed report; an equal/lower,
incomplete or cancelled attempt preserves the earlier best. The finish page
always reads the first completed snapshot, even when latest/best later differ.

Both new M7c QA factories reuse M7a's scripted final-window admissions, then
execute the last real minute: **3,000 observed active minutes, 25 qualifying
completions, 25 first correct answers, 2,250 XP**. Boundary XP/scripted admissions
are synthetic setup, not M8 normal-demand/zero-XP pacing; minutes, answers,
settlements, bills and the completed report are reducer-earned. Actual categories:

| Category | Weight | Raw category score | Raw weighted points |
| --- | ---: | ---: | ---: |
| cleanliness | 10% | 96.82777777777778 | 9.682777777777778 |
| rooms_built | 10% | 15.151515151514264 | 1.5151515151514263 |
| room_upgrades | 10% | 0 | 0 |
| staffing_coverage | 10% | 3.571428571428777 | 0.3571428571428777 |
| employee_training | 10% | 0 | 0 |
| staff_morale | 10% | 85 | 8.5 |
| patient_satisfaction | 10% | 100 | 10 |
| wait_flow | 5% | 100 | 5 |
| finances | 5% | 100 | 5 |
| clinical_answer_accuracy | 20% | 100 | 20 |

The actual weighted sum is **60.05507215007208 → 60.05/100 Improving**. It
completes the game despite missing rooms/upgrades/staff/training; there is no
pass mark. Both native smoke and UI tests verify the immutable first/latest/
best snapshots, zero remaining inspectors, save round-trip and existing-campaign
resume. No extra finish cash, XP or FSRS reward is added.

### Validation configuration and exact output

Used the **unchanged checked-in workspace configs with `--pool=threads`**,
not the default fork pool, and the requested preload. No alternate config,
test exclusion, install, global timeout/worker-limit override or known-failure
expectation change. PowerShell uses `npm.cmd` with:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR = '1'
```

Captured logs are normalized to UTF-8/LF. Exact blocks below remove ANSI terminal
controls only; PowerShell's native-stderr wrapper records remain in the complete
logs. Final full player was rerun after the last copy/landscape polish; final
typecheck/build also follow those edits. Initial work-in-progress copy/layout
assertions and mock-only type errors were corrected and are retained separately.

**Full balance** — `npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads`; exit **0**. [Complete capture](../../.local-dev/level5-m7c/balance-full.log).

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  09:57:26
   Duration  1.25s (transform 2.59s, setup 0ms, import 8.95s, tests 322ms, environment 2ms)
```

**Full game-domain** — `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`; exit **0**. [Complete capture](../../.local-dev/level5-m7c/domain-full.log).

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  150 passed | 1 skipped (151)
      Tests  4172 passed | 2 skipped (4174)
   Start at  09:58:04
   Duration  178.08s (transform 7.81s, setup 0ms, import 68.60s, tests 630.03s, environment 9ms)
```

**Full clinical-content** — `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads`; exit **0**. [Complete capture](../../.local-dev/level5-m7c/content-full.log).

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  09:57:26
   Duration  6.43s (transform 20.46s, setup 0ms, import 67.89s, tests 6.77s, environment 8ms)
```

**Full player** — `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`; exit **1**. [Complete capture](../../.local-dev/level5-m7c/player-full-final.log).

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 538ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 55ms
npm.cmd : 
At line:2 char:161
+ ... OLOR = '1'; npm.cmd run test --workspace @gamify-surgery/player -- -- ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 223 passed (224)
      Tests  1 failed | 1965 passed (1966)
   Start at  10:09:48
   Duration  59.68s (transform 8.93s, setup 0ms, import 89.05s, tests 131.50s, environment 12ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck** — `npm.cmd run typecheck`; exit **0**. [Complete capture](../../.local-dev/level5-m7c/typecheck-final.log).

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

**Player build** — `npm.cmd run build --workspace @gamify-surgery/player`; exit **0**. [Complete capture](../../.local-dev/level5-m7c/build-final.log).

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 741 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-D6OMV9M8.css                                   39.47 kB │ gzip:     6.78 kB
dist/assets/index-BrCW4Oob.css                                        171.63 kB │ gzip:    32.03 kB
dist/assets/MobileEntryPresentation-Bx5mJJWs.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-e5sD32Hz.js                                   118.83 kB │ gzip:    31.36 kB
dist/assets/index-SYS0g0W4.js                                      12,616.85 kB │ gzip: 2,058.12 kB

npm.cmd : [PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
At line:2 char:161
+ ... OLOR = '1'; npm.cmd run build --workspace @gamify-surgery/player *> . ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([PLUGIN_TI...is a breakdown::String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
  - forbid-private-clinical-modules (86%)
  - vite:prepare-out-dir (7%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: 
https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.44s
```


Only the permitted unchanged player failure remains:
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, **ignores the retired
concealment flag and preserves the scheduled external service after an answer**.
Expected pendingLabel to contain **Off-site thyroid fine-needle aspiration**;
received the existing generic pending-care/travel/procedure/pathology/return
label. The two domain skips remain the existing DEFECT-M9 reproducers. No other
failure is accepted. Existing production plugin-timing/large-chunk warnings
remain; MobileShell/entry assets stay separate lazy chunks.

Additional executed checks:

- Focused player: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/finishedGameFlow.test.tsx src/mobile/inspectionReportCard.test.tsx src/session/levelFiveReportQa.test.ts src/session/inspectionViewModels.test.tsx src/mobile/levelFiveGoals.test.tsx src/session/levelFiveProgressionViews.test.tsx` — exit **0**, **6 files / 55 tests pass**. Real shells/session, real next-minute completion, acknowledgment/reload/reopen/shell-switch/pause, double-tap Keep/Confirm, fresh history/seed, cancellation/Escape, browser Back/focus, ten tile details and frozen arithmetic.
- Focused domain: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads tests/level-five-finish-page.test.ts` — exit **0**, **1 file / 6 tests pass**. Pre-finish rejection, once-only timestamp, save reload and whole protected campaign/report fields.
- `node tools/qa/level-four-rooms.mjs --check` — exit **0**; all existing transform checks plus **Level 5 M7c report/finish transform PASS: reducer-earned first report and durable dismissal; no listener or browser storage.**
- `node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m7c/qa-tsconfig.json` — exit **0**, empty output.
- `node --import ./.local-dev/level5-m6/source-loader.mjs .local-dev/level5-m7c/qa-smoke.mjs` — exit **0**, both earned factories/strict desktop-phone entry/3,000-minute and 25-patient sample/exact sums/first-latest-best/dismissal/cleared inspectors/save/resume **PASS**. The source loader's existing ExperimentalWarning is retained.
- `node .local-dev/level5-m7c/qa-http.mjs` — exit **0**, four desktop/phone scenario URLs and four M7c modules return **HTTP 200** on the manager's existing 5184 listener. No listener or browser storage changed.
- `node scripts/verify-launcher-contract.mjs` — exit **0**, **Verified launcher health contract gamify-surgery-player protocol 1.**
- `node tools/character-mapping/inspector-v6f/validate-runtime-integration.mjs --dist` — exit **0**, read-only **PASS**: 10 identities, 80 exact PNGs, 40 contacts, 2,867,232 bytes; original 326 registry and 2,638 PNG/provenance rows preserved; patient pool 179, staff pool 99, inspectors in either pool 0.
- `python .local-dev/level5-m7c/audit.py` — **PASS** preservation, actual diff, strict encoding, original plan prefix, live balance/routeMotion/clinical/actor/current-handoff protection.

Fresh Playwright Chrome launch was attempted directly before any page/context
opened. It fails with **`browserType.launch: spawn EPERM`** in this worker
sandbox. No browser/canvas geometry, physical iPhone or manager V7/V8/default-pool
PASS is claimed. The manager retains actual visual/action acceptance.

Evidence: [command receipts](../../.local-dev/level5-m7c/validation.json),
[actual diff](../../.local-dev/level5-m7c/scoped.diff),
[preservation](../../.local-dev/level5-m7c/preservation.json),
[final source hashes](../../.local-dev/level5-m7c/validated-source-hashes.json),
[earned report data](../../.local-dev/level5-m7c/qa-state-evidence.json),
[HTTP data](../../.local-dev/level5-m7c/qa-http.json),
[focused player](../../.local-dev/level5-m7c/focused-final.log),
[focused domain](../../.local-dev/level5-m7c/domain-focused.log),
[QA transforms](../../.local-dev/level5-m7c/qa-transform.log),
[native QA smoke](../../.local-dev/level5-m7c/qa-smoke.log),
[browser attempt](../../.local-dev/level5-m7c/browser-probe.json).

### Manager QA: desktop and phone

Reuse **`node tools/qa/level-four-rooms.mjs`** on strict loopback **5184**. Use a
dedicated disposable Level 5 browser profile/context, complete the normal access
gate/opening flow, and confirm **`location.origin === 'http://127.0.0.1:5184'`**.
Keep `?level5=` on reload; existing scenarios resume and never reseed. Each new
scenario has a separate `campaign.qa.level-five-report-m7c.<scenario>` campaign.
Desktop/phone layout queries in the same profile share that campaign.

| Scenario | Desktop URL | Phone URL | Initial state |
| --- | --- | --- | --- |
| `inspection-finish` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-finish&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-finish&layout=phone) | Paused, reducer-earned 60.05 first report, unacknowledged; finish page opens on campaign resume. |
| `inspection-report-card` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-report-card&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-report-card&layout=phone) | Same earned report, acknowledgment recorded; normal clinic/report, no automatic finish page. |
| Existing final-minute boundary | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-final&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=inspection-final&layout=phone) | Fresh context starts at 2999/3000; Play one minute automatically opens the first finish page. |

1. Inspect the actual diff and exact output; rerun manager default-pool/aggregate
   acceptance as appropriate. At **1600×1000**, resume inspection-finish. Check
   the exact owner headline, two dry lines, **60.05 Improving**, **Best prestige
   60.05**, 3000/3000 and 25/20 sample, all ten bars/weighted points, and both
   action labels. Expand categories, raw fractions/means, missing structures and
   accuracy evidence/hints. Total raw sum must be 60.05507215007208, floored
   to 60.05. Native Tab/Shift-Tab must remain in the modal; check page errors.
2. Phone **390×844**, then **360×740, 412×915, 844×390 landscape and 768×1024**:
   compact ten tiles, no wide table or long plain root list, one-tap category
   detail/Back, focus return, local arithmetic/missing-item scrolling, safe
   insets and footer actions reachable without chasing the bottom of a long
   report. Measure ≥44px targets, no horizontal overflow and readable bars/
   points. Wide landscape uses five columns. Check actual browser geometry;
   the worker CSS/DOM assertions are not a viewport measurement.
3. Reload before Keep playing and switch `layout=desktop`/`phone` on this same
   origin/profile: the same first report reopens, no duplicate notice, score,
   XP, cash or team. Keep playing/double tap closes once, retains all clinic/
   FSRS/latest/best state and restores the in-session prior pause. After reload
   it stays dismissed. A saved paused clinic remains paused until Play. Goals
   (both shells) and phone More → View finish report reopen it read-only; closing
   that reopened page must not emit a second acknowledgment or reward.
4. Open inspection-report-card: no automatic Congratulations. Desktop Goals
   completed-report disclosure and phone Goals/More → Inspection expose the
   polished card. On phone, tap a category, then browser Back: first return to
   tiles, then leave Inspection/return to Goals. Verify current/latest versus
   best and the first finish report remain distinct after normal retries.
5. From the finish page, Start new campaign → Return to report/Escape must keep
   that exact page/campaign and pause intact. Confirm new campaign/double tap
   enters the existing founder/name flow once, with a fresh seed/history when
   Start clinic completes. Check a different campaign ID, Level 0/0 XP/empty
   FSRS and the finished clinic still resumable in Campaigns. It must never
   take the Archive and restart path. **QA query reload selects its named fixture
   again**; the new campaign stays saved and can be reopened via Campaigns. Keep
   this cap-5 QA query/profile; do not remove `level5` or use the ordinary cap-4
   entry on a profile containing Level 5 saves.
6. Existing `?level5=pre-goal&layout=desktop|phone`: Book remains Locked.
   `inspection-ready` and `inspection-executive`: same free/frozen 60 or
   qualified 57..54-minute quote and one booking on repeated taps. Running cancel
   still confirms only discarding the run; Keep inspection preserves it.
   Incomplete/cancelled runs never earn prestige/finish or overwrite best.
   Repeat after Keep playing uses the normal report and preserves the first
   finish page/earlier best; no second automatic victory.
7. Phone `?level5=executive&layout=phone`: Manage → Executive role has the short
   four-duty/$45 description, existing hire count/price, and closed Home, pay &
   funding detail with full real net projection/salary/home facts. Employee
   detail/training/funding actions and desktop copy remain intact. Check old
   ordinary Level 0–4 paths in separate disposable contexts and unchanged cap 4.

Owner paths remain **START_GAME.cmd → exact http://127.0.0.1:4173**, same-origin
PC phone preview `?layout=phone`, private phone **START_PRIVATE_GAME.cmd →
https://melissadesktop.taile197db.ts.net/**, and canonical remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**. Each other origin/profile
has separate saves; 5184 fixtures do not transfer/synchronize owner campaigns or
expose a new physical-phone service. No owner save or listener was operated.

**LOCAL ONLY checkpoint:** no GitHub backup, deployment or publication was
created by this No-Git worker. The manager retains CURRENT_THREAD_HANDOFF.md,
actual acceptance, and the binding owner finish-M10-then-push backup direction.
Next action: manager desktop/phone action-flow review and accept M7c; continue
M8/M9/M10 through separate briefs. This handback does not open the ordinary cap.
- 2026-10-12 manager: M7b ACCEPTED after fixes (inspector stops/paths exclude furniture and contacts; 'stray mark' was fixture floor litter, fresh QA states start clean); Chrome QA ?level5=inspectors shows ten clipboard inspectors spreading through rooms and moving, no page errors. M7c ACCEPTED (worker resumed after an immediate Codex capacity failure): ?level5=inspection-finish desktop + phone show 'YOU FINISHED THE GAME', owner headline line 3 plus two dry lines, 10-tile report card with bars/points/weights, best/latest 60.05, Keep playing + Start new campaign; Keep playing dismisses durably across reload; no horizontal scroll; no page errors. M8 dispatched.


## Level 5 M8: economy and long runs

Date: 2026-10-12. Worker: GPT-6.1 Sol, bounded M8 lane. **Implementation and
worker validation complete; manager evidence review and desktop/phone visual
acceptance pending.** No later milestone, Git, installation, external message,
publication or ordinary cap change. The manager retains CURRENT_THREAD_HANDOFF.md.

### Files changed

- Production: `packages/game-domain/src/level-five-state.ts` and
  `packages/game-domain/src/retail-operations.ts` — two evidenced compatibility/
  liveness fixes below; no balance edits.
- New audit: `tools/economy-audit/level-five-simulation.ts`,
  `level-five-run.mjs`, `source-loader.mjs`, dated
  `level-five-results-20261012.json` and
  `level-five-audit-provenance-20261012.json`; extend the existing README.
- New funded fixture: `tests/fixtures/level-five-economy.ts`,
  `level-five-economy-qa.ts` and the actual generated
  `level-five-economy-checkpoint-20261012.json`; register only the two new
  scenarios/campaign IDs in `tests/fixtures/level-five-state.ts`.
- QA entry: minimal additions in `tools/qa/level-five-state-bootstrap.ts` and
  `tools/qa/level-four-rooms.mjs`.
- New domain tests: `level-five-economy.test.ts`,
  `level-five-economy-checkpoint.test.ts`,
  `level-five-gift-fine-return.test.ts`, and
  `level-five-receipt-evidence-persistence.test.ts` under
  `packages/game-domain/tests/`.
- Player: new `apps/player/src/session/levelFiveEconomyQa.test.tsx` verifies
  actual Money/Goals/report projections in desktop and phone. Exclude only the
  new active M8 fixtures from the synthetic dormancy matrices in
  `apps/player/src/session/levelFiveStateQa.test.ts` and
  `packages/game-domain/tests/level-five-state-persistence.test.ts`; preserve
  all their prior scenarios. Actual M8 persistence/one-minute completion has
  dedicated coverage.
- This append-only handoff. No production mobile layout change was necessary:
  the existing compact five Money tiles and ten inspection tiles render the new
  real state, with one-tap details/Back and the same domain/session.

### Actual method and invocation

Reuse the paid early-Level-4 reducer factory, then construct all five Level 5
rooms, Reading/Training, real doors/access and a default Executive. The funded
opening is synthetic ($30,000 before construction/hiring, **$7,375 remaining**),
Level 5/zero XP; all operational rooms/training start at tier 1. Ordinary
arrivals, case selection, movement, support, fees, stock, wages, receipt writing,
FSRS, XP, expense posting, inspection and retirement use production code.
No fee, balance, wage, XP, room-tier or training-tier override funds the result.

The nine-person roster is MRI technician $18; three APPs $30 each; receptionist
$10; EVS $12; repair $16; radiologist $18; Executive **$45**.
`18 + 3*30 + 10 + 12 + 16 + 18 + 45 = $209/hour`.
Room upkeep is **$36/hour**, so unqualified cost is **$245/hour**. This is $1
above the plan's $35/$244 worksheet because the audit deliberately pays for a
normal Training Room. The four support rooms plus Executive remain $49/hour
before terms; they earn no invented benefit-to-cash payment.

Three paired seeds `.01/.02/.03` each run 12 economic cases, **4 warmup + 48
measured hours**. Separate zero-XP pacing runs use ordinary scored arrivals and
one chart action per active minute, 4/5 correct (plus a 9/10 comparison). The
driver waits for accepted consultation travel and only switches a chart once
ordered care can continue unattended. No staff-discussion answers or emergency
income shorten these patient-only XP runs. Each actual first inspection then
continues **600 minutes after real finish-page acknowledgment**.

Exact source runner commands used, with the existing Node 24.19.0:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.01 --economy-only --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.01 --pacing-only --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.02 --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.03 --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.02 --pacing-only --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.03 --pacing-only --write --resume
# After the isolated training scheduler correction, assemble full parts:
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.01 --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.02 --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --seed=level-five-m8.03 --write --resume
node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --merge --write
```

The initial training-at-zero request was rejected correctly while the employee
was still outside. A later paid request stayed queued behind an unread staff
discussion. Those failed/queued trials are **not** accepted training evidence.
The isolated training sensitivity now withholds the staff-discussion clock and
requests when the real quote permits departure after normal arrival. All normal
and pacing references retain ordinary staff discussions. On all three seeds,
the $75 request occurs at minute 1, actual seated work is 60 minutes, total away
time is 66 minutes, tier 2 is genuinely earned, and the reader returns.
The measured period uses that earned tier. This sensitivity is not a clean
causal estimate of training alone because the discussion input is also withheld.

Completed non-training results retain their **actual prior source key**, never
a rewritten key. The dated provenance record contains their exact input hashes,
original audit scripts, and pinned before/after hashes for the two audit-script
corrections. Actual byte comparisons prove the reducer-audit class, pacing
function, and economic loop outside the training scheduler stayed unchanged.
All gameplay, balance, clinical and fixture inputs match exactly. Earlier
production revisions and every prior training result are rejected. Three
training runs and three outages executed after this correction; complete parts
were then verified and merged. **10 checks of the actual provenance guard pass**,
including changed game/balance/clinical inputs and unknown inputs. A fresh
`--write` without `--resume` recomputes the whole final audit.

Partial caches remain ignored in `.local-dev/level5-m8/audit-parts/`; only the
complete verified merge wrote the dated results and the actual paused
2999/3000-minute QA save. The Level 4/October 8 results remain byte-identical.

### Arithmetic and actual results

All dollars below are per active game hour; ten game hours are an operating day.
Financial fields cover the measured 48 hours. Effect witnesses/minimum cash
cover all 52 hours. Calculations use cents/unrounded values; table display rounds.

| Economic scenario | Seed .01 net/h | Seed .02 net/h | Seed .03 net/h |
| --- | ---: | ---: | ---: |
| passive-qualified | 13.671875 | 20.883333 | 18.798125 |
| passive-no-executive | 58.270833 | 65.479167 | 63.479167 |
| passive-no-round | 15.208333 | 19.437500 | 18.562500 |
| active-qualified | 118.586250 | 145.503125 | 131.335833 |
| active-no-executive | 164.770833 | 190.458333 | 175.937500 |
| active-no-round | 120.270833 | 145.354167 | 131.145833 |
| missed-first-round | 13.349375 | 21.226458 | 18.618750 |
| half-gift | 12.993333 | 19.034583 | 18.118333 |
| slow-demand | -83.653125 | -80.040208 | -78.049792 |
| unfunded | -10.799375 | -11.301667 | -10.594792 |
| reader-training | 15.547708 | 23.985417 | 21.796042 |
| gift-outage | 15.360625 | 16.112917 | 16.213542 |

| Funded passive baseline | Gross/h | Stock/h | Posted upkeep + payroll/h | Net/h | Gift net/h after its upkeep | Supplier saved/h |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| level-five-m8.01 passive-no-round | 267.895833 | 7.687500 | 245.000000 | 15.208333 | 7.041667 | 0.000000 |
| level-five-m8.01 passive-qualified | 265.750000 | 7.418750 | 244.659375 | 13.671875 | 6.718628 | 0.401042 |
| level-five-m8.02 passive-no-round | 272.458333 | 8.020833 | 245.000000 | 19.437500 | 7.229167 | 0.000000 |
| level-five-m8.02 passive-qualified | 273.520833 | 7.978125 | 244.659375 | 20.883333 | 6.971128 | 0.404167 |
| level-five-m8.03 passive-no-round | 271.375000 | 7.812500 | 245.000000 | 18.562500 | 7.416667 | 0.000000 |
| level-five-m8.03 passive-qualified | 271.125000 | 7.667500 | 244.659375 | 18.798125 | 7.283628 | 0.402292 |

| Actual extended run | XP/h to first finish | First answers / correct | Completed / ended other | 2,000 XP hours | All-goals hours | First finish hours | Inspection sample | Raw score |
| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |
| level-five-m8.01 80% | 9.858545 | 388 / 311 | 320 / 0 | 181.516667 | 280.083333 | 331.083333 | 39 | 62.412775232430 |
| level-five-m8.01 90% | 11.676623 | 318 / 287 | 249 / 0 | 168.166667 | 200.100000 | 251.100000 | 52 | 64.634403364977 |
| level-five-m8.02 80% | 10.558878 | 304 / 244 | 233 / 0 | 187.750000 | 191.500000 | 242.450000 | 49 | 62.845548084875 |
| level-five-m8.03 80% | 10.569288 | 375 / 300 | 297 / 0 | 177.683333 | 247.083333 | 298.033333 | 50 | 62.249015673981 |

| Inspection category, seed .01 at 80% | Score | Weight | Weighted points |
| --- | ---: | ---: | ---: |
| cleanliness | 79.025670498084 | 10% | 7.902567049808 |
| rooms_built | 60.606060606057 | 10% | 6.060606060606 |
| room_upgrades | 0.000000000000 | 10% | 0.000000000000 |
| staffing_coverage | 31.034482758619 | 10% | 3.103448275862 |
| employee_training | 0.000000000000 | 10% | 0.000000000000 |
| staff_morale | 100.000000000000 | 10% | 10.000000000000 |
| patient_satisfaction | 94.487179487179 | 10% | 9.448717948718 |
| wait_flow | 100.000000000000 | 5% | 5.000000000000 |
| finances | 100.000000000000 | 5% | 5.000000000000 |
| clinical_answer_accuracy | 79.487179487179 | 20% | 15.897435897436 |

Examples of exact financial arithmetic:

- Seed .01, no round: `267.895833333333 - 7.6875 - 36 - 209 = +15.208333333333`.
- Seed .02, qualified: `273.520833333333 - 7.978125 - 244.659375 = +20.883333333333`.
- Seed .01, active/qualified: `370.395833333333 - 7.150208333333 - 244.659375 = +118.58625`.
- Seed .01, slow: `167.520833333333 - 6.514583333333 - 244.659375 = -83.653125`.
- Seed .01, no reader: `217.770833333333 - 7.853958333333 - 220.71625 = -10.799375`.

The full funded cluster is positive at normal demand **without qualified terms**
on every seed. Half-gift withholds every second exogenous gift-only opportunity;
ordinary shopping continues. Slow overall demand also turns scheduled
appointments off during alternating half-days, leaving ordinary reading active.
The slow and no-reader cases lose money and are disclosed above. No grant,
larger clinical fee or wage cut repairs them. Real gift technical outage retains
the existing first-hour/full-upkeep then 20% policy; measured Gift contribution
is **-$0.198108/hour**, with no sale, while the rest of the funded clinic remains
positive. All original staff remain employed in every 52-hour case.

**Gift baseline:** the dedicated stream fulfills **24/24 opportunities** per
48 hours, `0.5*(15-6)-1 = +$3.50/hour` without any supplier terms. Actual total
Gift net is $7.041667/$7.229167/$7.416667 per hour in the no-round cases because
ordinary optional purchases also occur. The actual gross/stock receipts include
free founder/employee consumption where applicable; no guessed margin multiplies
capacity. Premium $25/$12, base $15/$6 and all upgrade prices remain untouched.

**Support baseline:** every prestige room costs $1/hour unqualified. In the
qualified passive references, each accrues **$0.990538194444/hour** after terms;
posted whole-clinic cents remain authoritative. Founder's Office derives +2
effective morale once at opening, reversible and clamped. Garden completed uses
are 1/0/0, Gym completed breaks 13/13/14, and daily rounds six each over all 52
hours. An unused Garden still costs upkeep and earns no automatic bonus.

An additional paired normal **ten-hour** reducer probe on seed .01 records all
nine actual ownership modifiers +2, five Gym awards of +5 (25 accepted points
before any clamp), one completed Garden rest +2, and the qualified daily round
at minute 63 with +1 staff morale/1% suppliers. At minute 240 its real preparation
quote is `60*(1-0.05) = 57`; the blocked-round quote stays 60. Fifteen qualified
comfort applications carry +1 each; the blocked counterpart has 15 **zero-point**
quotes and zero positive applications. The audit field `executiveComfortUses`
counts all applied frozen quotes, including zero-point ones, and must not be
called a count of earned bonuses. Probe: `node --disable-warning=ExperimentalWarning
.local-dev/level5-m8/support-points.mjs`; evidence is
[support-point-evidence.json](../../.local-dev/level5-m8/support-point-evidence.json).

**Executive arithmetic:** $45 wage against only
$0.401041667/$0.404166667/$0.402291667 actual hourly supplier savings; it does not
pay for itself through suppliers. Seed .02 saves `$3.05 stock + $16.35 upkeep =
$19.40 / 48 = $0.404166667/hour`, already included once in costs. Its qualified
minute share is 94.618056%, with tier-1 1% terms. Do not treat paired gross/net
differences as supplier causality: missed work, travel, optional purchases and
existing case-selection behavior can also differ.

**XP/goal pacing:** active 48-hour rates are **11.375 / 12.041667 / 11.833333 XP/h**
(65/69/68 first answers). Full-run rates and observed 2,000-XP times appear above;
they are actual production first submissions, not fee-times-capacity estimates.
The 80% runs reach 2,000 at **177.68-187.75 hours**, and the 90% run at **168.17**.
These sit within the plan's editorial scenarios; no XP rebalance is justified.
Satisfaction, not morale, delays some all-goal unlocks: actual unlock evidence is
91 displayed satisfaction, 100 mean effective morale and nine staff on each seed.
The first finish takes **24.245-33.108 operating days**, then one more continued
day. Accepted preparation is 60/60/57/57 minutes in table order; a booking before
that day's completed round truthfully freezes the 60-minute quote.

Ten-hour trajectory samples span satisfaction **82-98** across these runs;
morale starts at **77**, exceeds 85 by the ten-hour sample, and plateaus at the
existing 100 cap. Every command also checks bounds. No exponential/counter
income is observed: cash changes reconcile to actual unique receipts less paid
costs. Pacing startup minima are $6,997.20/$6,997.20/$6,829.55/$6,896.25 and
maximum observed cash $45,370.20/$40,457.48/$38,147.26/$45,023.66 in table order.
Paid startup training reaches lower minima $6,581.94/$6,606.96/$6,557.04;
warmup outside-read counts are 12/12/5. These are funded synthetic reserve
results, not a promise that a $500 partial-clinic reserve is always sufficient.

**Long-run reconciliation:** 188,464 commands across
3034.666667 active game hours (all cases, first finishes and continued play)
check exact lifetime/measured cash, actual receipt keys, 10/2 first-answer XP,
expense posting, supplier savings, live-plus-retired totals, frozen fields and
reloads. No stale actor alarm occurs in any of the 36 economic or four pacing
runs. The alarm is one operating day without movement/progress, not a new game
timeout. Scored patients, staff/founder, retail/service actors, amenity trips,
families and inspectors are included. First-finish windows are independently
reconciled; receipt keys remain immutable/once-only after retirement and load.
The four pacing runs retire 4,816/3,623/3,636/4,489 receipts and
311/247/235/295 encounters by the end of continued play. Cash/XP/history and
the first report survive reload/acknowledgment; no finish reward or XP reset.

The seed .01 inspection above is **3000/3000**, **39/20** qualifying scored
completions, **31/39** correct first answers and no presented-but-unanswered
entries. Its independent operating window is
`$17,024.00 gross - $414.73 stock - $12,232.93 paid/charged expenses = +$4,376.34`;
all **200/200** expense postings are fully paid. Raw score
**62.412775232429915** equals the ten weighted contributions above, display
**62.41 Improving**. No upgrades/training or missing room/staff structures were
invented to inflate the score. All four score-bearing reports finish the game
without a pass mark; latest/best/first-report fields and post-finish wages persist.

**Balance decision:** no balance fix. The option-B funded/no-round and Gift
checks pass, losses are plausible and explicit, the Executive savings remain
mild and XP is within the plan's range. Owner **2,000, >90, >=85, $45 and every
upgrade price** remain exact. No changes to disease selection/clinical content,
release/review status, FSRS concept IDs, `routeMotion.ts`, Level 0-4 behavior or
ordinary **cap 4**. Existing DEFECT-M9-1/M9-2 remain for M9; these sampled reloads
record zero legacy idle-clock changes and do not prove that defect globally
resolved. Counts/paired seeds do not establish exact scored-case identity
independence from autonomous APP selection.

### Two evidenced production fixes

1. The real diagnostic receipt at minute 1444 composed a **147-character** ID
   from encounter/node/transaction/sequence components. Inspection save reading
   incorrectly applied the 120-character entity-ID rule and rejected a valid
   long run. Only `observedReceiptIds` now accepts the existing nonempty-string
   transaction-ID contract; duplicate, empty/nonstring evidence and all shorter
   entity-ID constraints remain enforced. IDs are neither truncated nor replaced.
   Actual writer/once-only hook/round-trip and rejection regressions pass.
2. A founder Gift trip returning to the real Pediatric couch **(36,25.3)** stayed
   blocked: exact integer-tile matching did not identify its original room, and
   the integer facility graph could not end at the fractional contact. The
   marked Gift branch now identifies the original footprint and joins the exact
   Gift exit with the reverse of the already approved native care exit. It keeps
   every native knot and the accepted target, without teleporting or changing
   routeMotion. The regression fails before the fix and now completes with one
   $0/$6 founder receipt, exact return and no second payment. The real formerly
   failing long runs now have no actor alarm. Older unmarked retail behavior is
   unchanged.

These are stability/compatibility corrections, not new M9/M10 systems. Evidence:
[original receipt](../../.local-dev/level5-m8/overlong-receipt.json),
[stuck trip](../../.local-dev/level5-m8/stall-evidence.json),
[before regression](../../.local-dev/level5-m8/fine-return-before.log),
[focused fixes](../../.local-dev/level5-m8/focused-fixes.log).

### Exact validation output

All suites used their default configs with **`--pool=threads`** and the
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`
preload. No timeout, test selector, skip, dependency or live balance change was
added to make aggregate validation pass. The player was rerun alone after a
5000ms peri-op timeout while full suites/builds overlapped; the serial full rerun
removes that timeout. Only the allowed unchanged thyroid failure remains.

`npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` — exit **0**.

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  13:17:23
   Duration  1.46s (transform 5.47s, setup 0ms, import 12.21s, tests 304ms, environment 2ms)
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` — exit **0**.

```text
 Test Files  154 passed | 1 skipped (155)
      Tests  4182 passed | 2 skipped (4184)
   Start at  14:00:15
   Duration  218.63s (transform 7.97s, setup 0ms, import 67.70s, tests 792.93s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` — exit **0**.

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  13:17:23
   Duration  8.88s (transform 32.82s, setup 0ms, import 101.05s, tests 7.41s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` — exit **1**.

```text
 Test Files  1 failed | 224 passed (225)
      Tests  1 failed | 1970 passed (1971)
   Start at  14:04:55
   Duration  60.72s (transform 9.24s, setup 0ms, import 90.66s, tests 133.72s, environment 12ms)
```

The player failure is exactly
`src/session/surgeryCenterServicePreviews.test.ts:85:52`: expected pendingLabel
to contain **Off-site thyroid fine-needle aspiration**, received the existing
generic pending-care/travel/procedure/pathology/return label. Domain's two skips
are the unchanged DEFECT-M9 reproducers. No other failure is accepted.

`npm.cmd run typecheck` — exit **0**.

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

`npm.cmd run build --workspace @gamify-surgery/player` — exit **0**.

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 741 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-D6OMV9M8.css                                   39.47 kB │ gzip:     6.78 kB
dist/assets/index-BrCW4Oob.css                                        171.63 kB │ gzip:    32.03 kB
dist/assets/MobileEntryPresentation-D-qCTOav.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-DI7Q-7dH.js                                   118.83 kB │ gzip:    31.36 kB
dist/assets/index-BlM6ZkqK.js                                      12,617.24 kB │ gzip: 2,058.25 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (87%)
  - vite:prepare-out-dir (6%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 6.26s
```

`node tools/qa/level-four-rooms.mjs --check` — exit **0**.

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
Level 5 M6 goals transform PASS: QA-only Level 4 Advance; three live goals; durable unlock without booking/scoring.
Level 5 M7a inspection transform PASS: booking/window/event evidence, final-minute scored and incomplete QA; no listener or browser storage.
Level 5 M7b inspector transform PASS: actual booking/preparation/travel, all ten accepted looks; no listener or browser storage.
Level 5 M7c report/finish transform PASS: reducer-earned first report and durable dismissal; no listener or browser storage.
Level 5 M8 economy transform PASS: funded zero-XP clinic and actual last-minute audit checkpoint; no listener or browser storage.
```

`node scripts/verify-launcher-contract.mjs` — exit **0**.

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

`node --disable-warning=ExperimentalWarning tools/economy-audit/level-five-run.mjs --merge --write` — exit **0**.

```text
{
  "economyRuns": 36,
  "pacingRuns": 4,
  "resultsWritten": true,
  "pacing": [
    {
      "seed": "level-five-m8.01",
      "accuracy": 80,
      "xpPerHour": 9.858545179964763,
      "xpGoalHours": 181.51666666666668,
      "unlockHours": 280.0833333333333,
      "finishHours": 331.0833333333333,
      "inspectionScore": 62.412775232429915,
      "qualifyingPatients": 39
    },
    {
      "seed": "level-five-m8.01",
      "accuracy": 90,
      "xpPerHour": 11.67662285941856,
      "xpGoalHours": 168.16666666666666,
      "unlockHours": 200.1,
      "finishHours": 251.1,
      "inspectionScore": 64.63440336497672,
      "qualifyingPatients": 52
    },
    {
      "seed": "level-five-m8.02",
      "accuracy": 80,
      "xpPerHour": 10.558878119199836,
      "xpGoalHours": 187.75,
      "unlockHours": 191.5,
      "finishHours": 242.45,
      "inspectionScore": 62.84554808487542,
      "qualifyingPatients": 49
    },
    {
      "seed": "level-five-m8.03",
      "accuracy": 80,
      "xpPerHour": 10.569287551727994,
      "xpGoalHours": 177.68333333333334,
      "unlockHours": 247.08333333333334,
      "finishHours": 298.03333333333336,
      "inspectionScore": 62.24901567398069,
      "qualifyingPatients": 50
    }
  ]
}
```

Production build retains existing plugin-timing/large-chunk warnings and
separate MobileShell/entry chunks. Additional executed checks: focused fixes
**4 files/85 tests pass**; prior audit/persistence focus **3 files/122 tests
pass**; owned QA/audit TypeScript noEmit passes; native QA entry/module/checkpoint
HTTP **8/8 status 200**; actual provenance guard **10 checks pass**; independent
summary arithmetic/coverage passes. Full-domain includes both actual checkpoint
tests; full-player includes all new M8 desktop/phone tests.

Evidence: [dated results](../../tools/economy-audit/level-five-results-20261012.json),
[source provenance](../../tools/economy-audit/level-five-audit-provenance-20261012.json),
[command receipts](../../.local-dev/level5-m8/validation.json),
[scoped diff](../../.local-dev/level5-m8/scoped.diff),
[preservation](../../.local-dev/level5-m8/preservation.json),
[full domain](../../.local-dev/level5-m8/full-domain.log),
[full player](../../.local-dev/level5-m8/full-player.log),
[initial concurrent player run](../../.local-dev/level5-m8/full-player-concurrent.log),
[HTTP evidence](../../.local-dev/level5-m8/qa-http.json),
[guard checks](../../.local-dev/level5-m8/cache-guard.json),
[training arrival probe](../../.local-dev/level5-m8/training-start-evidence.json).

No actual browser/canvas/physical-phone visual PASS is claimed by this worker.
The manager retains V7/V8, default-pool/browser acceptance and the actual diff
review. Source/encoding checks preserve the full intake plan prefix and unrelated
working tree, AGENTS, clinical/balance sources, routeMotion, package/lock,
Level 4/mobile plans and manager handoff. All owned text is UTF-8/no BOM/LF.

### Manager QA: desktop and phone

Reuse the existing strict **5184** QA server (`node tools/qa/level-four-rooms.mjs`).
Use a dedicated disposable Level 5 profile, complete the usual access gate,
and verify **`location.origin === 'http://127.0.0.1:5184'`**. Keep `level5` on
reload. The two scenarios have separate
`campaign.qa.level-five-economy-m8.<scenario>` campaigns; desktop/phone layout
queries in the same profile resume the same campaign and never reseed it.

| Preview | Desktop | Phone layout | Opening evidence |
| --- | --- | --- | --- |
| Funded opening | [Desktop economy](http://127.0.0.1:5184/level4-rooms-qa.html?level5=economy&layout=desktop) | [Phone economy](http://127.0.0.1:5184/level4-rooms-qa.html?level5=economy&layout=phone) | Paused, zero XP, nine staff/all five rooms, normal arrivals; no synthetic goal unlock. |
| Real long-run final minute | [Desktop inspection](http://127.0.0.1:5184/level4-rooms-qa.html?level5=economy-inspection&layout=desktop) | [Phone inspection](http://127.0.0.1:5184/level4-rooms-qa.html?level5=economy-inspection&layout=phone) | Actual seed .01/80% serialized run at 2999/3000, earned goals/XP, retired ledger and ten inspectors. Play one minute earns the actual 62.41 report/finish page. |

1. Desktop 1600x1000: opening Goals shows 0/2,000 and Locked inspection; Staff
   lists the real Executive at $45. Money quotes $209 payroll/$36 upkeep before
   a qualified round. Press Play: after real daily work, 1% terms modify eligible
   quotes/upkeep, not wages or fees. Inspect actual saved-cost labels and their
   time scope, never a second supplier-income line. Normal patient charts use
   ordinary questions/answer actions; there is **no browser answer bot**.
2. Pan north/east to all five rooms: Founder (23,18), Executive (29,19), Gift
   (34,18), Garden (39,17), Gym (45,17), Reading (54,27), Training (54,23).
   Access joins main circulation at x34. Watch daily work, normal Gift visitors,
   Gym breaks and any actual Garden users. Gift income changes only after real
   checkout; stock cash is charged once. Optional founder shopping from Pediatric
   care must return to the exact native couch contact, with no stuck exit or
   repeat charge. No soft-benefit cash payout.
3. Phone 390x844, then 360x740, 412x915, 844x390 and 768x1024: Goals uses the
   same three real metrics. More/Manage -> Money has **five compact tiles**;
   Costs per game hour opens payroll/upkeep/actual supplier detail in one tap;
   Gift Shop sales opens real net and receipt-window details, Back returns to
   tiles. Check no horizontal overflow, readable labels and >=44px targets.
   The root must not become a long plain list. Staff detail still shows $45.
4. In economy-inspection inspect the actual run counters and Money/receipt
   labels, then Play one minute. The automatic finish page must display
   **62.41 Improving**, **39/20**, **3000/3000**, all ten contributions above,
   latest/best/first report and the accepted owner headline. Desktop exposes
   arithmetic; phone shows ten compact tiles, one-tap category details/hints,
   Back/focus return and reachable Keep playing/Start new campaign actions.
5. Reload before acknowledgment and switch desktop/phone queries: same actual
   save/report/cash/XP, no new campaign or second finish. Keep playing, reload,
   then Play: ordinary paid operations, wages, XP/FSRS and latest/best continue.
   Inspect a report through Goals/phone More -> Inspection; no second reward.
   Inspect page errors and native routes/actor disappearance at report completion.
6. In a separate disposable ordinary profile, verify old Level 0-4 load/shell
   behavior and live cap 4. Do not remove the QA query from a profile containing
   a Level 5 campaign. Read exact output/scoped diff and rerun manager default
   aggregate/browser checks as appropriate; a handback alone is not acceptance.

5184 is a PC browser phone-layout preview, not a newly exposed physical-phone
service. Owner pathways stay START_GAME.cmd -> exact **http://127.0.0.1:4173**,
START_PRIVATE_GAME.cmd -> **https://melissadesktop.taile197db.ts.net/**, and remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**. Other origins/profiles
have separate saves; these fixtures neither move nor synchronize owner campaigns.
No owner storage, launcher or existing listener was changed.

**LOCAL ONLY checkpoint:** no GitHub backup/deployment/publication was created
by this No-Git worker. The manager owns acceptance, CURRENT_THREAD_HANDOFF.md and
the binding owner finish-M10-then-push backup direction. Next action is manager
evidence/desktop/phone acceptance of M8; M9/M10 require their separate briefs.
- 2026-10-12 manager: M8 ACCEPTED. Evidence: 36 economy runs + 4 full pacing runs; 2,000 XP at 80% accuracy in 177.68-187.75 game hours; funded clinic without qualified supplier terms +$15.21-$19.44/h; no balance values changed; fixed long receipt-ID save rejection and a stuck Gift return; 6,929 tests pass (known thyroid failure + 2 existing skips). Chrome QA ?level5=economy-inspection: Day 34 clinic +$61.39/h, Play completes the inspection at 62.41/100 with 39/20 qualifying completions and the report card; no page errors. M9 dispatched.


## Level 5 M9: integration

2026-10-12 — GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
**Implementation and permitted worker validation complete; manager diff,
default-config/root checks and headless/browser acceptance remain pending.**
The ordinary cap is **4**. M10 was not implemented. No Git, installs, agents,
owner-save access, publication, deployment or external messages.

### Implementation and acceptance evidence

- One connected reducer journey starts with the existing explicitly synthetic
  funded Level 4 opening. Every later scored answer, visit witness, room, door,
  hire, goal, quote, inspection minute, receipt and report is engine-earned.
  It earns the original five Level 4 goals at tick **3965**, with **754 XP**;
  its actual paused save loads at both caps. The normal manual LEVEL_UP command
  advances once at QA cap 5, resets current-level XP to zero once and preserves
  prior FSRS, cash, rooms, employees, clinical releases, encounters and witnesses.
  Live cap 4 still rejects that transition. No goal XP or witness is seeded.
- The script then buys the five approved prestige rooms, the real $45 Executive,
  Reading/radiologist, Training Room and ordinary access. The three Level 5
  goals unlock at **2162 XP / 91 displayed satisfaction / 100 mean effective
  morale / 9 employees**, tick **16281**. Entering Level 5 and building/hiring
  alone do not unlock booking. The existing boundary suites still cover
  1999/2000, 90/>90, below/at 85, empty workforce and no-room/no-Executive unlock.
- Three real full **3000-active-minute** inspections complete at low scores:
  **62.49 (52 qualifying patients), 66.65 (50), 45.48 (48)**. The first finishes
  the game at any valid score. Higher then lower retries update latest while
  retaining the highest raw best and immutable first report. Keep playing runs
  another **600 active minutes** before the next booking, with normal wages,
  answers and receipts. Notice retirement is allowed; no retry emits another
  finish notice or clears the durable first record/dismissal.
- Four raw continuous-play checkpoints — preparing, running, final minute and
  finish page — retain their actual clocks on load and match continued play
  for **120 subsequent real reducer minutes each**. Tests compare complete
  canonical states at every minute; canonicalization accounts only for existing
  absent/null reader shapes. They explicitly compare raw staff/encounter idle
  deadlines first. The control comes from the raw saved journey, not a QA
  factory that already normalized it. Both actual shells/session execute the
  final minute, open the first page, switch shells, dismiss durably, reload,
  book again and confirm/cancel the original fresh-campaign flow. New campaign
  has fresh identity/seed/history and preserves the finished campaign.
- **25 Level 0-4/schema 5-9 synthetic baselines** were generated with the actual
  captured pre-M9 runtime. Current load hashes and whole states after 120 real
  minutes match those before-images. These are explicitly synthetic test saves,
  not historical owner saves. Ordinary cap, old mechanical behavior, frozen
  clinical data and review status remain unchanged.
- Both shells expose the five rooms, Executive, Goals/booking/inspection,
  report card and finish actions. Actual phone inspector sheets cover all ten
  accepted looks without patient/staff actions. Existing full-suite tests retain
  all four Executive duties, every tier, room/door/furniture contracts, inspector
  motion/independence, incomplete/cancel, answer denominators and retirement.
  The new headless spec covers **104 cases** in the checked-in four-project
  config (explicit desktop/phone layouts), including main saved states, Build,
  Manage, final minute, finish/reload/new-campaign and inspector map taps.
  **It was listed/compiled, but did not run: requirement (6) is blocked by the
  worker's spawn-EPERM sandbox, not a page-error PASS.**

### Bounded fixes and remaining defects

1. **Level 5 load continuity:** the old reader rewrote valid overdue employee and
   encounter idle deadlines (e.g. the real reader's **3982** became **16292**)
   and reset an open chart's waiting/decay/attention state. At Level 5 only,
   valid nonnegative saved deadlines and chart state are preserved. Missing or
   invalid idle values retain the original fallback. The five precise reader
   locations are byte-checked against intake; Level 0-4 retain their prior
   reader rules and all 25 before-image behavior comparisons pass.
2. **Phone Build:** at Level 5, New/My Rooms show the five prestige rooms as
   compact two-column tiles (five columns on wide screens), with earlier rooms
   in a closed native disclosure. Original IDs, prices, blocked reasons,
   thumbnails, placement/open callbacks and paid placement confirmation remain.
   Thumbnail scaling retains its intrinsic aspect ratio. Levels 0-4 keep the
   original card presentation; desktop Build is unchanged.
3. **Stale copy:** removed **“Level 4 complete - Level 5 coming later”** from
   desktop Goals, phone Goals, the alert definition and new reducer completion
   events. Both shells now say **“Level 4 goals complete. Keep playing; the
   clinic is still open.”** Historical saved events retain their exact bytes/IDs;
   feed presentation refreshes their copy without replaying the milestone.
   No live-cap change accompanies this text correction.

Remaining stale/placeholder copy visible in an ordinary non-QA campaign:
**none found** by the runtime-source scan and projected historical-event check.
No “coming in M7”, “M7a”, “coming later”, “coming soon” or “not yet implemented”
player copy remains. “M7a” survives only in a type comment. Deliberately retained
QA wording is developer-only: **“Character visual QA gallery” / “Character
Visual QA”**, lateral-gait/GLP-1 fixture error diagnostics, QA campaign titles,
bootstrap console provenance and explicitly synthetic M1 reports. These are
reachable through their opt-in developer/QA pathways, not ordinary player views.
`placeholder` thumbnail/avatar data attributes are loading/fallback metadata,
not visible promised features. Historical plan/test/save strings remain evidence.

**DEFECT-M9-1 remains at Levels 0-4** by the required old-behavior boundary;
its two old clock-normalization sites were corrected only for Level 5.
**DEFECT-M9-2 remains:** APP activity can alter the active-concept pool and scored
case identity. No clinical-selection, RNG, fairness or pathfinding architecture
change was made. The known thyroid pending-label failure remains untouched.
Larger corrections require the manager's exclusive follow-up briefs.

The first continuous accelerated probe slowed after the carried-forward Level 4
learning history consumed accessible unseen concepts while reviewed FSRS cards
were not yet due. This was a fixture scheduling issue, not evidence of a stuck
actor or a reason to override XP/FSRS. The accepted integration uses **one
ten-hour operating-day study session per calendar day**, with actual pause/resume
commands and ordinary timestamp inputs. Intervening time adds no active minute,
payroll or inspection observation. FSRS rules/due dates, clinical pool, cadence,
fees, balance and game clocks are unchanged. It is a multi-session integration
fixture, **not a replacement for M8's accepted continuous pacing/economy audit**.

### Files changed

- `apps/player/src/mobile/MobileGoals.tsx`
- `apps/player/src/mobile/MobileScreens.test.tsx`
- `apps/player/src/session/alertsEventsViewModel.ts`
- `apps/player/src/session/levelFiveIntegration.test.tsx`
- `apps/player/src/session/levelFiveProgressionViews.test.tsx`
- `apps/player/src/session/levelFiveStateQa.test.ts`
- `apps/player/src/session/levelFourProgressionViews.test.tsx`
- `apps/player/src/ui/GoalsPanel.test.tsx`
- `apps/player/src/ui/GoalsPanel.tsx`
- `apps/player/src/mobile/build/levelFiveCompactBuild.test.tsx`
- `apps/player/src/mobile/build/mobileBuild.css`
- `apps/player/src/mobile/build/MobileBuildCatalog.tsx`
- `packages/balance-config/src/prototype-alerts.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/tests/level-five-integration.test.ts`
- `packages/game-domain/tests/level-five-state-persistence.test.ts`
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`
- `tests/fixtures/level-five-integration-qa.ts`
- `tests/fixtures/level-five-integration.ts`
- `tests/fixtures/level-five-legacy-behavior-20261012.json`
- `tests/fixtures/level-five-state.ts`
- `tests/e2e/level-five.spec.ts`
- `tools/qa/level-five-integration-lower.mjs`
- `tools/qa/level-five-integration-results-20261012.json`
- `tools/qa/level-five-integration-run.mjs`
- `tools/qa/level-five-state-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`
- `docs/execplans/level5-launch-plan-20261010.md`

Before-images/diff/hashes are in `.local-dev/level5-m9/`. Before this append:
**28 changed/new paths (17 existing + 11 new), 1238 unchanged intake paths,
zero removals**. This append makes 29 paths. AGENTS, clinical sources, asset
sources/approved data, routeMotion, package/lock/configs, other plans, launchers
and CURRENT_THREAD_HANDOFF.md remain preserved. All owned text is UTF-8 without
BOM and LF. Generated watchable saves contain existing frozen prototype content;
no new clinical prose/claim/release or clinical approval was authored.

### Arithmetic and provenance

All amounts, timings and scores are editorial game values. The journey runs
**27,944 checked commands / 26,053 active minutes = 434.216666667 game hours**.
Cash reconciles on every command and over the entire run:

`$17,855.00 opening + $157,283.00 actual gross - $2,922.02 actual stock`
`- $101,248.56 paid operating costs - $10,480.00 paid construction/hiring`
`= $60,487.42 closing`.

There are **555 first answers** total (**89 at Level 4, 466 at Level 5**).
Level 4: `72 correct × 10 + 17 wrong × 2 = 754 XP`; normal Advance resets that
current-level subtotal once. Level 5 ends at **3596 XP** from real 10/2 first
submissions; inspection/rooms/Executive add no XP. From the actual Level 4 advance,
2,000 XP takes **192.133333333 hours**, all three goals **205.266666667**, and
the first finish **256.233333333**. Booked preparation is **57 active minutes**;
the scored window stays 3000. These times use the disclosed study-session calendar.

The run observes **38 completed daily rounds**, **1031 positive frozen comfort
applications**, and **$20.98 stock + $125.19 posted upkeep = $146.17 actual
supplier savings** (upkeep **751140/60 = 12519 cents**). Savings reduce costs;
they are not a second income/rebate. $45 Executive wages and all accepted prices
remain exact. **5692 receipts / 423 encounters** are retired while first/latest/
best reports and learning histories remain. M8's 36 economic/four pacing runs
remain the manager-accepted balance evidence; none was relabelled as an M9 rerun.

First report: full 3000 minutes, **52/20** qualifying completions, all **200/200**
positive bills fully paid. Operating window:
`$20,269.00 gross - $364.25 stock - $12,232.93 charges = +$7,671.82`.

| Category | Raw score | Weight | Weighted points |
| --- | ---: | ---: | ---: |
| cleanliness | 78.441379310345 | 10% | 7.844137931034 |
| rooms_built | 60.606060606057 | 10% | 6.060606060606 |
| room_upgrades | 0.000000000000 | 10% | 0.000000000000 |
| staffing_coverage | 31.034482758619 | 10% | 3.103448275862 |
| employee_training | 0.000000000000 | 10% | 0.000000000000 |
| staff_morale | 100.000000000000 | 10% | 10.000000000000 |
| patient_satisfaction | 95.000000000000 | 10% | 9.500000000000 |
| wait_flow | 99.715909090909 | 5% | 4.985795454545 |
| finances | 100.000000000000 | 5% | 5.000000000000 |
| clinical_answer_accuracy | 80.000000000000 | 20% | 16.000000000000 |

Weights total **100%**. Raw sum **62.49398772204757** floors to **62.49 Improving**.
Higher retry **66.65755625217645 → 66.65**, lower retry
**45.489710466735836 → 45.48**. Latest is the lower result, best is the higher,
and first remains 62.49. No pass score or perfect structures were invented.

The dated result manifest pins actual run source hashes. It **retains the actual
pre-fix persistence hash**, plus an explicit exact-current-hash load-only
compatibility receipt. The continuous generator never assigns reader output
back to its state; checkpoint load output is checked and discarded. The five
reader edits therefore do not relabel continuous run inputs or results. Raw
reload/future-minute and old-cap before-image tests validate the current reader.
Every other gameplay/clinical/balance/driver input remains pinned; unknown
changes fail the guard. The lower-checkpoint artifact tool separately pins its
source and verifies the actual final state against all three reports and cash.

Rebuild from current source, without cached results:

```powershell
node --disable-warning=ExperimentalWarning tools/qa/level-five-integration-run.mjs --write
node --disable-warning=ExperimentalWarning tools/qa/level-five-integration-lower.mjs
```

### Exact final validation output

All four full Vitest suites used **unchanged checked-in default configurations**,
**`--pool=threads`**, `NO_COLOR=1`, and
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`.
No global timeout/worker/config override, existing test exclusion or install.
The new full-window regression has its own 300-second bound; the game window
is still asserted as exactly 3000 minutes. Full player ran alone after domain.

`npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` — exit **0**.

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  16:20:43
   Duration  1.23s (transform 3.58s, setup 0ms, import 10.27s, tests 246ms, environment 2ms)
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` — exit **0**.

```text
 Test Files  155 passed | 1 skipped (156)
      Tests  4218 passed | 2 skipped (4220)
   Start at  16:12:45
   Duration  284.67s (transform 10.34s, setup 0ms, import 81.31s, tests 956.72s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` — exit **0**.

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  16:20:43
   Duration  6.48s (transform 20.64s, setup 0ms, import 69.24s, tests 6.86s, environment 8ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` — exit **1**.

```text
 Test Files  1 failed | 226 passed (227)
      Tests  1 failed | 1994 passed (1995)
   Start at  16:18:08
   Duration  67.02s (transform 11.99s, setup 0ms, import 107.90s, tests 141.24s, environment 14ms)
```

The sole player failure is exactly
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, **ignores the retired
concealment flag and preserves the scheduled external service after an answer**.
Expected pendingLabel to include **Off-site thyroid fine-needle aspiration**;
received the existing generic pending care/travel/procedure/pathology/return
label. Source/expectation are unchanged. The two existing domain skips are the
original DEFECT-M9 reproducers; no new source skip was added.

`npm.cmd run typecheck` — exit **0**, all seven workspaces:

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

`npm.cmd run build --workspace @gamify-surgery/player` — exit **0**:

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 741 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-DtvCKspx.css                                   40.48 kB │ gzip:     6.91 kB
dist/assets/index-BrCW4Oob.css                                        171.63 kB │ gzip:    32.03 kB
dist/assets/MobileEntryPresentation-DnQBH5Fz.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-BvdC-5jB.js                                   120.93 kB │ gzip:    31.65 kB
dist/assets/index-DvjKPDo7.js                                      12,617.55 kB │ gzip: 2,058.30 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (90%)
  - vite:prepare-out-dir (5%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.34s
```

Build retains the existing plugin-timing/large-chunk warnings. MobileShell/entry
remain separate lazy chunks; desktop CSS remains `index-BrCW4Oob.css` (171.63 kB),
with no desktop stylesheet edit. No publication occurred.

`node tools/qa/level-four-rooms.mjs --check` — exit **0**:

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
Level 5 M6 goals transform PASS: QA-only Level 4 Advance; three live goals; durable unlock without booking/scoring.
Level 5 M7a inspection transform PASS: booking/window/event evidence, final-minute scored and incomplete QA; no listener or browser storage.
Level 5 M7b inspector transform PASS: actual booking/preparation/travel, all ten accepted looks; no listener or browser storage.
Level 5 M7c report/finish transform PASS: reducer-earned first report and durable dismissal; no listener or browser storage.
Level 5 M8 economy transform PASS: funded zero-XP clinic and actual last-minute audit checkpoint; no listener or browser storage.
Level 5 M9 integration transform PASS: reducer-earned journey checkpoints; no listener or browser storage.
```

Additional executed validation:

- New/related player focus: **3 files / 31 tests PASS** before the added ninth
  resume case; final full player includes that additional case.
- Raw reload + legacy focus: **29 passed / 7 runner-filtered** (the other M9
  tests), with all 36 active integration cases covered by full domain.
- Room receipt check: `node tools/room-design/level-5/runtime-promotion/promote.mjs all --check`:
  PASS **174 hashes / 101 byte-exact PNGs / 7029 routes / 66 doors**, read-only.
- `node tools/character-mapping/inspector-v6f/validate-runtime-integration.mjs --dist`:
  PASS **10 identities / 80 exact PNGs / 40 contacts / 2867232 bytes**; original
  registry/PNG prefix and patient/staff separation preserved.
- `node scripts/verify-launcher-contract.mjs`: exit 0,
  **Verified launcher health contract gamify-surgery-player protocol 1.**
- Existing QA listener: **21/21 HTTP 200** (nine desktop/phone states plus three
  modules), no server/storage mutation. Node/DOM validation is not visual QA.
- `node node_modules/@playwright/test/cli.js test tests/e2e/level-five.spec.ts --list`:
  exit 0, **104 tests in 1 file**.
- Actual desktop-project headless attempt:
  `node node_modules/@playwright/test/cli.js test tests/e2e/level-five.spec.ts --project=desktop-chrome --reporter=line`:
  exit 1, **Running 26 tests using 1 worker**, then **spawn EPERM** in
  `WorkerHost.startRunner` before any page/context. Direct installed headless
  Chrome also failed **browserType.launch: spawn EPERM**. No browser/page-error
  or physical-phone PASS is claimed. Manager must run V8 in its authorized environment.

Evidence: [actual journey/results](../../tools/qa/level-five-integration-results-20261012.json),
[command logs](../../.local-dev/level5-m9/),
[scoped diff](../../.local-dev/level5-m9/scoped.diff),
[preservation](../../.local-dev/level5-m9/preservation.json),
[HTTP evidence](../../.local-dev/level5-m9/qa-http.json),
[headless blocker](../../.local-dev/level5-m9/headless-spec-attempt.log).
The root Git-backed boundary/aggregate wrappers and default-fork/browser checks
remain manager validation; no worker PASS is substituted for them.

### Manager QA: desktop and phone

Reuse the existing strict **5184** server (`node tools/qa/level-four-rooms.mjs`).
Use a **fresh disposable profile/context per checkpoint**, complete the usual
access gate and confirm **`location.origin === 'http://127.0.0.1:5184'`**.
These long-run saves are sizeable; keep one selected fixture per profile.
Desktop/phone of the *same* checkpoint in the same profile resume the same
campaign without reseeding. Keep `level5` on every reload; do not open the
ordinary cap-4 entry on a profile containing Level 5 saves.

| Checkpoint | Desktop | Phone | Look for |
| --- | --- | --- | --- |
| `integration-l4` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-l4&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-l4&layout=phone) | Real 754-XP mature Level 4 save; five goals met. Advance/double-tap once; Level 5 starts at 0, locked, prior history intact. |
| `integration-build` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-build&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-build&layout=phone) | Paused at 0 XP, all five real rooms/nine staff. Close the carried-forward chart normally before Build. Five phone tiles; earlier rooms closed; Manage has $45 Executive. |
| `integration-preparing` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-preparing&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-preparing&layout=phone) | Earned 2162/91/100 unlock; one frozen 57-minute preparation. Reload/end tick stable; cancel preparation without result. |
| `integration-running` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-running&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-running&layout=phone) | 80/3000 minutes, ten real inspectors spread through rooms; live provisional card. Tap inspectors; no staff/chart actions. Cancel requires confirmation. |
| `integration-final` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-final&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-final&layout=phone) | 2999/3000. Play one minute automatically opens first 62.49 finish, 52/20 sample; ten categories/arithmetic; actors clear. |
| `integration-finish` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-finish&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-finish&layout=phone) | First report already earned/unacknowledged. Reload reopens; Keep playing/double-tap dismisses once; Start new campaign confirms/cancels via original flow. |
| `integration-repeat-final` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-repeat-final&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-repeat-final&layout=phone) | After Keep playing and continued operations, higher retry at 2999/3000. Play completes 66.65/50; latest/best update; no automatic victory page. |
| `integration-repeat` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-repeat&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-repeat&layout=phone) | Higher retry completed; first 62.49 remains available read-only, latest/best 66.65; booking another remains enabled. |
| `integration-lower-repeat` | [Desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-lower-repeat&layout=desktop) | [Phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=integration-lower-repeat&layout=phone) | Actual lower third report 45.48/48, best 66.65, immutable first 62.49. Live satisfaction may be below goal; earned unlock stays available. No victory replay. |


Desktop **1600x1000**, then 820/390 fallbacks. Phone **360x740, 390x844,
412x915, 844x390, 768x1024**: inspect the compact Build New/My Rooms tiles,
one-tap placement/open, closed Earlier rooms, native thumbnails, correct prices/
limits, Executive role/employee details with four effects, Goals/Inspection,
ten report tiles, category detail/Back/focus, report/finish scrolling and >=44px
controls. Confirm no horizontal overflow, missing art or page errors. The
thumbnail uses 75% of the original 76x54 intrinsic ratio; no source art changed.

On final/finish: reload before acknowledgment; switch shells; Keep playing;
reload afterward. First report/page/dismissal, cash, XP and FSRS must persist.
Reopen View finish report, cancel New campaign, then explicitly confirm it in
another disposable context: fresh founder/clinic flow, distinct seed/history,
finished clinic still resumable. Repeat-final and lower-repeat show normal
reports/best/latest without another automatic victory. Test booking/cancel in
both shells, ten map taps/movement at 1x/4x and end cleanup. Use existing
pre-goal/goals-boundary/incomplete states for rejection/incomplete visual checks.

Run the actual new headless spec and the catalog's existing regression subset:

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER='1'
$env:GAMIFY_E2E_BASE_URL='http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/level-five.spec.ts --reporter=line
```

The plan's `npm.cmd run test:e2e -- tests/e2e/level-five.spec.ts --reporter=line`
also uses this spec's explicit QA URL; the 5184 QA listener must already exist.
V7 root/default checks and V8 browser/manual acceptance are still required.
No source hash, worker handback, HTTP response or DOM harness substitutes for them.

Owner paths remain **START_GAME.cmd → exact http://127.0.0.1:4173**, same-origin
PC phone preview `?layout=phone`, private phone **START_PRIVATE_GAME.cmd →
https://melissadesktop.taile197db.ts.net/** and canonical remote
**https://melissarowlandc-afk.github.io/GamifySurgery/**. Different origins/profiles
have separate saves. 5184 is a PC phone-layout QA preview, not a newly exposed
physical-phone service or a campaign transfer/synchronization path. No listener,
launcher or owner storage was changed.

**LOCAL ONLY checkpoint:** no GitHub backup was created by this No-Git worker.
The manager owns CURRENT_THREAD_HANDOFF.md, actual M9 acceptance and the binding
owner **finish-M10-then-push** backup direction. Next action: inspect the actual
diff/evidence, run manager default/headless/desktop/phone QA and accept M9; then
dispatch the separate tiny M10 ordinary cap switch. This handoff does not open it.

### M9 browser-spec fixes (2026-10-12)

Follow-up Sol worker review of the manager's actual browser run: **77 passed /
27 failed**, seven distinct cases (the phone map case failed in three projects,
the other six in all four). Evidence is the seven error-context/page-snapshot
files and `SUMMARY.txt` in `.local-dev/level5-m9/manager-e2e/`. The manager's
`&facility-gait-proof` addition is preserved exactly; the handle remains opt-in.

All seven supplied failures are **TEST bugs**, based on the snapshots and the
current implementation. No runtime defect is established by these failures,
and no game code, fixture, clinical content, save reader or balance was changed.

| Failing case | Evidence / cause | Exact test correction |
| --- | --- | --- |
| Build / Executive / goals, desktop | The snapshot is on New Rooms with **Rooms Built at Maximum (8)** closed. Founder’s Office is already built and its disabled card is deliberately inside that disclosure. Scrolling cannot open a closed `details`. | Click the real `.build-maximum-rooms > summary`, assert `open`, then retain the count/scroll/visibility checks for all five cards. |
| Build / Executive / goals, phone | The snapshot still shows the **Patient chart** sheet, including the **Close Patient chart** action. Generic phone sheets use their Close/Back actions; desktop Escape does not close this sheet. | A shared test helper clicks the actual phone Close button (desktop still uses guarded Escape), waits for the sheet to leave and the write-through saved `openChartEncounterId` to become null. It retains normal feedback acknowledgment rather than clearing storage or changing the fixture. |
| Higher retry, desktop | The failure polled persisted state for five seconds, but the snapshot already says **Inspection completed / Latest 66.65 / Best 66.65**. `getActiveState` reads localStorage, not the live session. The saved tick 22995 precedes completion at 22996; ordinary clock autosaves occur every 15 ticks. | Wait for the visible Inspection status to say **Inspection completed**, then click the ordinary **Pause facility time** action and assert its pressed state. Pause persists the current state synchronously. Only then check saved completion, the higher latest/best report, immutable first completion and absence of an automatic finish page. No autosave or inspection timing change. |
| Higher retry, phone | The snapshot's Play control has the explicit accessible name **Resume facility time**, with visible text **▶ Play**. Exact `Play` matches neither. | Use exact **Resume facility time**, then open the actual Goals sheet and follow the same visible-completion / Pause / persisted-report assertions as desktop. |
| Final minute / finish / confirmation, phone | Same nonexistent exact `Play` locator; the snapshot also contains a carried-forward completed Patient chart sheet. | Close that chart through the same guarded helper, then use exact **Resume facility time**. Retain all ten category tiles, arithmetic detail/Back, finish reload, confirmation cancel, durable Keep playing, reopen and confirmed normal campaign-opening coverage. |
| Ten inspectors / real map, desktop | The click opened **Charlie · Advanced Practice Provider (APP)**, not an inspector. The old test refreshed the room layout and immediately read character bounds without waiting for the character redraw. It also assumed inspector 0's sprite point could not overlap a different actor. | Verify all ten distinct inspector keys have visible approved `inspector-v6f` bitmaps. After each real camera change, wait two animation frames and redraw characters before reading current bounds. Choose an unobscured point inside an inspector's rendered hit envelope using the actual desktop picker and DOM coverage, then perform the actual browser mouse click. Assert the exact selected inspector key and visible inspection text. |
| Ten inspectors / real map, phone | Same wrong target: the snapshot contains Charlie's APP sheet and **Praise Employee**, not **Inspector**. Phone picking also uses nearest-touch envelopes, which differ from desktop depth ordering. | Use the actual phone picker to check candidate points inside a rendered character envelope, with the same settled camera/bounds and DOM coverage. The picker probes only describe targets; they do not invoke the selection callback or open a sheet. The real mouse click must open the **Inspector** dialog, show that inspector's current activity, and expose exactly one button, **Close Inspector**. |

Additional test correction discovered during source review: staffed desktop
Executive roles start expanded. The former unconditional toggle would close
the details after the Build failure was fixed. The spec now expands only when
`aria-expanded` is not already true; the actual Executive / $45 assertion stays.
The Build case now also explicitly opens phone Goals after leaving Manage and
checks **Inspection locked** and disabled **Book inspection · Locked** in both
shells. All **104 cases**, their page-error checks and the original report/save/
campaign/prestige coverage remain. Inspector selection still occurs through the
real DOM pointer path; no actor location, depth, visibility, inspection record,
game command or direct selection callback is forced by the map helper. As before,
this browser case taps one visible inspector and checks ten actors; all ten
individual information sheets are independently covered by the session/phone
tests. The new bitmap and selected-key checks strengthen that browser coverage.

Owned changes in this follow-up are exactly:

- `tests/e2e/level-five.spec.ts`
- This append to `docs/execplans/level5-launch-plan-20261010.md`

Before-images, scoped diff, source hashes and logs are in
`.local-dev/level5-m9/browser-spec-fixes/`. Captured **1266** intake paths without
Git. All game source, routeMotion, live cap **4**, existing M9 fixtures/manifests,
the manager's query flag, other plans, configurations, owner storage and the
original plan prefix are preserved. Owned text is UTF-8 without BOM / LF.
No Git, dependency install, browser launch or external message was attempted.

Validation actually executed after these spec changes:

`node node_modules/@playwright/test/cli.js test tests/e2e/level-five.spec.ts --list`
with `GAMIFY_E2E_EXTERNAL_SERVER=1` and
`GAMIFY_E2E_BASE_URL=http://127.0.0.1:5184` — **exit 0**:

```text
Total: 104 tests in 1 file
```

`npm.cmd run typecheck` — **exit 0**, all seven checked-in workspace checks.
This command retains the ordinary workspace scope; Playwright's list command
separately transforms/loads the browser spec.

`npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/mobile/map/inspectionActors.test.tsx src/mobile/map/sceneInput.test.ts src/ui/BuildPanel.test.tsx src/session/prototypeAutosave.test.ts --pool=threads`
— **exit 0**, unchanged default configuration, `NO_COLOR=1`, and the approved
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload:

```text
 Test Files  5 passed (5)
      Tests  54 passed (54)
   Start at  17:02:27
   Duration  10.34s (transform 10.89s, setup 0ms, import 16.60s, tests 6.50s, environment 0ms)
```

No game code was touched, so the requested conditional full player/domain reruns
were not triggered; the full M9 suite evidence above remains unchanged. **No
new browser PASS is claimed.** The supplied snapshots establish these test
mistakes, while their fixes still require the manager's real browser acceptance.

Manager rerun, with the existing QA server on **127.0.0.1:5184** running:

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER='1'
$env:GAMIFY_E2E_BASE_URL='http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/level-five.spec.ts
```

Expect the unchanged **104-test / four-project** matrix. Inspect remaining
failures as new evidence; do not accept this handback as a browser pass. Manual
QA uses the nine desktop/phone links above (optionally append
`&facility-gait-proof` when inspecting the handle). The 5184 QA origin retains
separate disposable saves; canonical 4173/private-phone/Pages pathways and saves
are unchanged. M10 and the manager's finish-M10-then-push direction stay separate.
- 2026-10-12 manager: M9 ACCEPTED. Worker real-reducer integration: L4 save -> Level 5 -> five rooms + $45 Executive -> goals -> three full inspections (62.49, 66.65, 45.48; best 66.65) with reload parity; bounded fixes for Level 5 idle-deadline load continuity, phone Build prestige tiles and stale 'Level 5 coming later' copy. Manager ran tests/e2e/level-five.spec.ts in real Chrome: initial 0/104 (missing &facility-gait-proof in openQa; manager fixed), then 77/104 (7 test bugs fixed by worker), final **104 passed (4.4 min)** across desktop-chrome, laptop-chrome, compact-desktop-chrome and phone-chrome. M10 dispatched.

## Level 5 M10: launch

2026-10-12 — GPT-6.1 Sol worker for the Claude Code **GamifySurgery manager**.
**M10 implementation and worker validation complete; manager actual-diff review,
V7/V8/default-pool checks and desktop/phone ordinary-entry browser acceptance
remain pending.** M9's recorded 104/104 Chrome acceptance is preserved above;
it is not claimed as a new M10 browser pass.

### Launch switch and preservation

- The ordinary shipped balance now has cap **5**, Level 4 successor **5**,
  stages **0–5** and the existing accepted `LEVEL_FIVE_STAGE_DEFINITION` as its
  final stage with no successor. This installs the accepted stage; it does not
  introduce new goals, systems, payouts, clinical content or a Level 6.
- The only production edits are that balance switch and the **Final level**
  label in desktop `GoalsPanel` and phone `MobileGoals`. M1–M9's rooms, four
  Executive duties, inspection unlock/booking/scoring, ten inspector actors,
  report card and finish actions already consume this same ordinary release.
  M9 domain and App integration tests now exercise the shipped context directly,
  without installing a QA balance replacement.
- Replaced only cap/stage/successor-dependent assertions. Tests for historical
  cap-4 rejection and terminal completion now explicitly construct that older
  context, retaining their witness, milestone, sale, reward, learning, reload
  and repeat assertions. The old Level 0–4 whole-state load/120-minute before-
  image matrix is unchanged and runs under ordinary cap 5.
- M9's pinned audit still verifies its original prelaunch balance hash by
  reconstructing only the exact M10 switch in memory. All other input hash
  checks and original audit/checkpoint/result artifacts remain unchanged;
  historical M9 results have not been relabeled as a new M10 economic run.
- QA's existing balance clone no longer appends a duplicate stage. The Level 4
  QA profile guard still rejects Level 5 when explicitly using cap 4, and lets
  the newly compatible ordinary cap-5 loader resume those campaigns.
- No state schema, reducer, persistence implementation, clinical content,
  release review status, approved art, route-motion implementation, launcher,
  listener, origin or publication changed. `CURRENT_THREAD_HANDOFF.md` remains
  manager-owned under the M10 row.

### Files changed



```text
apps/player/src/facility/level4ApprovedRoomTestHelpers.ts
apps/player/src/mobile/MobileGoals.tsx
apps/player/src/session/levelFiveEconomyQa.test.tsx
apps/player/src/session/levelFiveExecutiveViewModels.test.tsx
apps/player/src/session/levelFiveGiftRetailViewModels.test.tsx
apps/player/src/session/levelFiveIntegration.test.tsx
apps/player/src/session/levelFiveLaunch.test.tsx
apps/player/src/session/levelFiveProgressionViews.test.tsx
apps/player/src/session/levelFiveReportQa.test.ts
apps/player/src/session/levelFiveStateQa.test.ts
apps/player/src/session/levelFourIntegration.test.ts
apps/player/src/session/levelFourProgressionViews.test.tsx
apps/player/src/ui/GoalsPanel.tsx
docs/execplans/level5-launch-plan-20261010.md
packages/balance-config/src/app-role.test.ts
packages/balance-config/src/approved-room-layouts.test.ts
packages/balance-config/src/facility-inspection.test.ts
packages/balance-config/src/level-five-executive.test.ts
packages/balance-config/src/level-five-gift-retail.test.ts
packages/balance-config/src/level-five-progression.test.ts
packages/balance-config/src/level-five-rooms.test.ts
packages/balance-config/src/level-five-schema.test.ts
packages/balance-config/src/level-four-rooms.test.ts
packages/balance-config/src/level-four-schema.test.ts
packages/balance-config/src/mri-services.test.ts
packages/balance-config/src/prototype-balance.test.ts
packages/balance-config/src/prototype-balance.ts
packages/balance-config/src/wound-ostomy-services.test.ts
packages/game-domain/tests/game-domain.test.ts
packages/game-domain/tests/level-five-gift-retail.test.ts
packages/game-domain/tests/level-five-integration.test.ts
packages/game-domain/tests/level-five-launch.test.ts
packages/game-domain/tests/level-five-progression.test.ts
packages/game-domain/tests/level-five-rooms.test.ts
packages/game-domain/tests/level-five-state-persistence.test.ts
packages/game-domain/tests/level-five-support.test.ts
packages/game-domain/tests/level-four-integration.test.ts
packages/game-domain/tests/level-four-persistence.test.ts
packages/game-domain/tests/level-four-progression.test.ts
packages/game-domain/tests/level-three-goals.test.ts
packages/game-domain/tests/level-two-progression.test.ts
packages/game-domain/tests/pediatric-clinic-admission.test.ts
tests/fixtures/level-five-launch.ts
tests/fixtures/level-five-state.ts
tools/qa/level-five-launch-bootstrap.ts
tools/qa/level-five-state-bootstrap.ts
tools/qa/level-four-rooms-bootstrap.ts
tools/qa/level-four-rooms.mjs
```

New validation logs, before-images, exact filesystem diff, HTTP receipts and
preservation receipt are local scratch under `.local-dev/level5-m10/`; they are
not release artifacts. No Git, dependency install, worker spawning, external
messages or owner browser-storage access occurred.

### Arithmetic and owner-visible behavior

- Level 4 still requires **750 current-level XP**, displayed satisfaction
  **>90**, an installed compatible operational APP (busy/training still count),
  an earned pediatric-with-parent completion and an earned wound/ostomy
  completion. The historical acknowledgement cannot bypass a presently unmet
  current requirement; earned completion witnesses do not need to be repeated.
- The owner must click/tap **Advance to Level 5**. It performs the existing
  one-time Level 4→5 transition and current-level XP reset to **0**. Cash,
  rooms/doors, employees, encounters, frozen content, FSRS histories, settlements,
  income receipts and Level 4 witnesses are retained. Opening/reloading the
  game does not advance, spend, build, hire or book an inspection.
- Both shells then show **Final level** and exactly **2,000 XP / satisfaction
  >90 / nonempty average effective staff morale >=85**. Five rooms appear in
  Build; the Executive appears in Manage. Those purchases are optional for
  earning the simultaneous three-goal inspection unlock. There is no Advance
  to Level 6 and no runtime “coming later” copy.
- Accepted optional capital remains **$5,800** for the five rooms plus **$600**
  Executive hire = **$6,400**, excluding unchanged hallway/upgrade costs. Base
  room upkeep **$5/hour** plus base Executive salary **$45/hour** =
  **$50/hour**. M10 changes none of these prices, tiers, duties or effects.
- Inspection remains locked before the durable three-goal unlock. After it,
  booking retains its frozen preparation quote and a full **3,000 active
  minutes = 50 facility hours**, with at least **20** qualifying scored
  completions. The first completed report at any score finishes the game;
  incomplete/cancelled runs do not. The M10 final checkpoint completes with
  **52** scored patients and raw total **62.49398772204757**, displayed
  **62.49**, using the same ten categories/100% weights. No finish XP/cash
  reward is added. Keep playing dismisses the finish page durably and preserves
  best/first report; New campaign uses the accepted explicit confirmation,
  separate fresh seed/history and preservation of the prior campaign.

**What the owner sees after the local change is accepted:** launch with
`START_GAME.cmd` and reload **http://127.0.0.1:4173** in the usual persistent
desktop browser profile. A Level 4 save with all five current gates met now
shows **Advance to Level 5** in Goals; the phone shell also offers its compact
**Advance · Level 5** chip. A Level 4 save with a missing goal stays at Level 4,
shows its original five requirements and remaining progress, and has no Advance
action until every current gate is met. Nothing is restarted or automatically
purchased. After the manual advance the existing clinic opens final Level 5
and the accepted rooms/Executive/goals/inspection/report/finish flows work in
the ordinary shell.

The private phone opening remains `START_PRIVATE_GAME.cmd` ->
**https://melissadesktop.taile197db.ts.net/**. Its phone shell has the same ready
versus unmet behavior for **that origin's own Level 4 save**. PC
**http://127.0.0.1:4173/?layout=phone** shares the local desktop save; the private
HTTPS phone origin, disposable 5184 origin, other profiles and GitHub Pages
each have separate storage. There is no transfer/synchronization or pathway
change. This worker did not deploy Pages or operate the private phone/browser.

### Exact worker validation

Used the **checked-in default workspace configurations**, with only
`--pool=threads`, `NO_COLOR=1` and the approved
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`
preload. No temporary Vitest configuration, suite exclusions, timeout changes
or worker-count changes were used. Full heavy suites ran separately after the
first cap-dependent failures were corrected.

`npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads` — **exit 0**. Full output: [balance.log](../../.local-dev/level5-m10/balance.log).

```text
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  17:32:19
   Duration  1.33s (transform 3.46s, setup 0ms, import 10.50s, tests 259ms, environment 2ms)
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads` — **exit 0**. Full output: [domain.log](../../.local-dev/level5-m10/domain.log).

```text
 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  17:40:09
   Duration  279.12s (transform 10.73s, setup 0ms, import 84.57s, tests 951.06s, environment 9ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads` — **exit 0**. Full output: [clinical.log](../../.local-dev/level5-m10/clinical.log).

```text
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  17:32:19
   Duration  6.79s (transform 22.02s, setup 0ms, import 73.00s, tests 7.25s, environment 18ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` — **exit 1, solely the known thyroid baseline**. Full output: [player.log](../../.local-dev/level5-m10/player.log).

```text
 Test Files  1 failed | 227 passed (228)
      Tests  1 failed | 2010 passed (2011)
   Start at  17:44:56
   Duration  67.94s (transform 12.74s, setup 0ms, import 111.69s, tests 140.66s, environment 12ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85:52`, test `ignores the retired concealment flag and preserves the scheduled external service after an answer`. Expected pending label to contain `Off-site thyroid fine-needle aspiration`; received the existing generic pending-care/travel/procedure/pathology/return label. The full exact expected/received strings and stack remain in the log.

`npm.cmd run typecheck` — **exit 0**, all seven workspace checks. Full exact output: [typecheck.log](../../.local-dev/level5-m10/typecheck.log).

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

`npm.cmd run build --workspace @gamify-surgery/player` — **exit 0**. Full output: [build.log](../../.local-dev/level5-m10/build.log).

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...
transforming...✓ 741 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff       14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff       14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2      17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2      17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                        2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-DtvCKspx.css                                   40.48 kB │ gzip:     6.91 kB
dist/assets/index-BrCW4Oob.css                                        171.63 kB │ gzip:    32.03 kB
dist/assets/MobileEntryPresentation-BIM3eKvv.js                         0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-D7a4t6Qn.js                                   120.96 kB │ gzip:    31.66 kB
dist/assets/index-CDliFJZY.js                                      12,617.60 kB │ gzip: 2,058.14 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (91%)
  - vite:prepare-out-dir (5%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.18s
```

The existing plugin-timing and >500 kB chunk warnings remain advisory; no bundling change belongs in this launch switch. The direct build retains origin-relative `/assets/` URLs, suitable for the unchanged local/private root pathways, plus separate lazy mobile chunks. No Pages build/publication was performed.

`node scripts/verify-launcher-contract.mjs` — **exit 0**.

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

`node tools/qa/level-four-rooms.mjs --check` — **exit 0**, all existing M1–M9 transforms plus M10. Full output: [qa-transform.log](../../.local-dev/level5-m10/qa-transform.log).

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
Level 5 QA transform PASS: opt-in helper and synthetic state fixtures; no listener or browser storage.
Level 5 M2 rooms transform PASS: real placement/doors; isolated Founder appearance previews; no listener or browser storage.
Level 5 M4 Executive transform PASS: real hire/training-room fixture; both approved looks; no seeded awards or savings.
Level 5 M5 Gift Shop transform PASS: real quotes/queue; separate per-facility demand; no seeded paid receipts.
Level 5 M6 goals transform PASS: QA-only Level 4 Advance; three live goals; durable unlock without booking/scoring.
Level 5 M7a inspection transform PASS: booking/window/event evidence, final-minute scored and incomplete QA; no listener or browser storage.
Level 5 M7b inspector transform PASS: actual booking/preparation/travel, all ten accepted looks; no listener or browser storage.
Level 5 M7c report/finish transform PASS: reducer-earned first report and durable dismissal; no listener or browser storage.
Level 5 M8 economy transform PASS: funded zero-XP clinic and actual last-minute audit checkpoint; no listener or browser storage.
Level 5 M9 integration transform PASS: reducer-earned journey checkpoints; no listener or browser storage.
Level 5 M10 launch transform PASS: ordinary shipped context, ready/unmet Level 4 and Level 5 checkpoints; no listener or browser storage.
```

`node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level5-m2/qa-tsconfig.json` — **exit 0**, no diagnostics. The existing QA entry imports cover the new launch bootstrap/fixture; this does not alter the checked-in full-suite configuration.

`node .local-dev/level5-m10/build-assets-check.mjs` — **exit 0**, read-only built-asset checks; [receipt](../../.local-dev/level5-m10/build-assets-check.json).

```text
Build assets PASS: 2 origin-relative HTML assets; two referenced mobile JS chunks; ordinary cap 5 without launch QA; 101 accepted Level 5 room asset hashes and 80 inspector public assets match.
```

`node .local-dev/level5-m10/http-check.mjs` — **exit 0**, read-only HTTP checks against the existing 5184 and 4173 servers; [receipt](../../.local-dev/level5-m10/http-check.json).

```text
HTTP PASS: 19 read-only responses; 12 QA URLs, two launch modules, live cap-5 module and four ordinary entries. No browser/storage/geometry check.
```

The first full domain run exposed only the obsolete ordinary-cap Level 5
reload rejection; the first player run additionally exposed the obsolete
Level 4 terminal-completion wait. Both now retain their historical cap-4
assertions explicitly and the final full reruns are reported above. Initial
logs remain `domain-first.log` and `player-first.log`. The known thyroid test
is unchanged and was not excluded. The two pre-existing domain skips are
retained. No new browser pass or Git-backed boundary/aggregate pass is claimed.

Preservation audit: **44 existing paths changed (including this append-only plan), four new paths, zero removed, 1,452 intake paths byte-unchanged**. All touched source/test/document files are UTF-8 without BOM and LF only. The intake plan remains an exact prefix; `routeMotion.ts` and the manager's `CURRENT_THREAD_HANDOFF.md` are byte-unchanged. Exact scoped filesystem diff: [.local-dev/level5-m10/scoped.diff](../../.local-dev/level5-m10/scoped.diff); final receipt: [preservation.json](../../.local-dev/level5-m10/preservation.json).

### Manager QA: desktop, phone and then ordinary entry

Keep the existing **http://127.0.0.1:5184** server
(`node tools/qa/level-four-rooms.mjs`). Use a **disposable profile**, never the
owner's 4173/private-phone storage. `location.origin` must be exactly
`http://127.0.0.1:5184`. New `launch-*` entries seed only campaign state from
accepted M9 reducer-earned checkpoints and use the **ordinary shipped context
and ordinary storage loader**; `launch-unmet` alone sets synthetic 749 XP.
Reload resumes the same campaign and does not reseed its changes. Use a fresh
disposable profile when an untouched initial checkpoint is needed.

| QA state | Desktop | Phone |
| --- | --- | --- |
| launch-ready | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-ready&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-ready&layout=phone&facility-gait-proof) |
| launch-unmet | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-unmet&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-unmet&layout=phone&facility-gait-proof) |
| launch-build | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-build&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-build&layout=phone&facility-gait-proof) |
| launch-running | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-running&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-running&layout=phone&facility-gait-proof) |
| launch-final | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-final&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-final&layout=phone&facility-gait-proof) |
| launch-finish | [Open desktop](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-finish&layout=desktop&facility-gait-proof) | [Open phone](http://127.0.0.1:5184/level4-rooms-qa.html?level5=launch-finish&layout=phone&facility-gait-proof) |

For **each** seeded state, also navigate within the same profile to the normal
root **http://127.0.0.1:5184/?layout=desktop&facility-gait-proof** or
**http://127.0.0.1:5184/?layout=phone&facility-gait-proof** and reload. This root
contains the ordinary `src/main.tsx` entry, no QA bootstrap and no QA balance
override. The selected saved campaign must load and every feature must behave
the same. Switching layout on this origin must retain the same campaign,
inspection window and durable finish acknowledgement.

1. **launch-ready:** real mature Level 4, **754 XP**, all five requirements met.
   Goals/phone chip offer Advance. Click/tap once: Level 5/0 XP, old clinic and
   witnesses preserved, no optional room/Executive auto-purchase, three goals
   and Locked inspection. Repeated taps/reloads cannot advance/reset twice.
2. **launch-unmet:** same earned witnesses, synthetic **749/750 XP**, only XP
   short. Goals show **4/5**, no Advance in either shell, and ordinary reload
   remains Level 4 without fabricated Level 5 state.
3. **launch-build:** reducer-earned Level 5, **0/2000 XP**, five built rooms and
   the funded **$45/hour** Executive. Build exposes all five accepted room
   tiles/art; Manage exposes the Executive/four jobs. Goals say Final level
   and inspection is Locked. Phone retains compact tiles and one-tap navigation.
4. **launch-running:** actual **80/3000** inspection minutes with ten inspector
   actors. Verify movement, inspection status/provisional report, pause/resume,
   shell switch and reload continuity on the ordinary root.
5. **launch-final:** actual **2999/3000** first inspection. Play one real active
   minute: completed **62.49**, **52** scored completions, ten report categories,
   inspectors cleaned up and first-finish page. No fabricated result/answer bot.
6. **launch-finish:** actual unacknowledged first **62.49** report. Verify owner
   headline **“Congratulations. Your reward is a report card and the opportunity
   to improve it.”**, ten report tiles/detail/back, Keep playing durability,
   normal repeat reports/best retention and confirmed Start new campaign
   preserving the old campaign while creating fresh seed/history.

Recheck the accepted desktop/mobile matrix (including small portrait phones
and landscape), final-label wrapping, 44px controls, compact tiles/no horizontal
overflow, touch/back/close, no long-scroll main flow and unchanged non-Level-5
behavior. Existing `?level5=` M1–M9 QA scenarios remain available and covered
by their existing tests. Manager V7/V8, actual diff review and manual ordinary-
root smoke are still required for acceptance; HTTP/static/App unit evidence
does not establish browser geometry or physical-phone reachability.

**LOCAL ONLY checkpoint:** this worker made no GitHub backup or publication.
The manager owns final acceptance, `CURRENT_THREAD_HANDOFF.md`, V7/V8 and the
owner's already binding **finish-M10-then-push** backup direction. Next action:
review the scoped diff/logs, perform desktop/phone ordinary-root QA, accept
M10, then carry the authorized GitHub checkpoint through the manager's audit
and push; no release/Pages publication is authorized by this handback.
- 2026-10-12 manager: M10 ACCEPTED — LEVEL 5 LAUNCHED (ordinary cap 5, final level). Manager default-config: boundaries PASS (16144 paths), balance 149/149, domain 4226 + 2 skips, content 628/628, player 2010 + known thyroid failure, root build PASS, tests/e2e/level-five.spec.ts 104/104. Chrome: ?level5=launch-ready desktop Advance -> Level 5 0/2000; phone 'Advance · Level 5' chip -> Level 5. Owner origins (fresh disposable contexts, owner storage untouched): http://127.0.0.1:4173 desktop + phone layout and https://melissadesktop.taile197db.ts.net/ phone load and start campaigns with 0 errors/0 4xx-5xx. Found and fixed: the owner's 4173 Vite server (running since 2026-10-08) served stale optimized deps (504 on react-dom_client) so fresh loads were blank; manager restarted it detached with the launcher's exact args (log .local-dev/owner-4173-restart.log); START_GAME.cmd will detect it as the existing server.
