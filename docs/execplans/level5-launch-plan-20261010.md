# Level 5 launch plan - Optimized ASC / Prestige

Date: 2026-10-10  
Status: Planning handoff to the Claude Code GamifySurgery manager; M0 decisions pending.  
Worker: GPT-6.1 Sol, bounded research/documentation lane. No implementation authorized by this document.

## Goal and launch boundary

Launch the five Level 5 rooms and the Executive as a coherent optimization stage
over the existing outpatient/ASC game. Preserve the owner's approved Founder's
Office, the accepted room upgrade ladders, existing campaigns, and the separate
desktop and mobile presentations of one domain/session.

The roadmap explicitly gives Level 5 no new clinical setting. Its scope is
efficiency, morale, satisfaction, revenue, prestige and inspection
(`docs/features/facility-levels-and-clinical-release-points.md:182`). The canonical
design already specifies an elective inspection week, a score and recognition
tier, continued play and later reattempts (`CANONICAL_DESIGN.md:544`). Recommend
making this the final ASC progression stage, with endless clinic play after its
goals are earned. Hospital content remains deferred, without an invented Level 6
(`CANONICAL_DESIGN.md:540`).

This is an owner/development prototype launch. Room approval, unit-test success,
inspection results and manager acceptance do not approve clinical content or
authorize a public clinical release. Existing draft content retains its review
status. Nothing in this plan authorizes Git, installation, publication or work
outside a subsequent manager brief.

## Constraints, repository state and source precedence

- This planning worker owns only this file and the requested two-line pointer in
  `docs/execplans/owner-requests-20261008.md`. The manager owns durable integration
  handoffs. No code, assets, saves, global handoff or other plans are changed.
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
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md:20`. The leading mobile handoff records
  MB1-MB8 acceptance and one shared session at
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md:1`. Later concurrent changes must be
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
  such. New proposals remain nonbinding until M0.

## 1. Inventory: intended Level 5 versus the current implementation

The inventory is a source snapshot from 2026-10-10. Citations are repository
`file:line` anchors, not placeholder medical citations.

| Area | Intended or approved | Implemented today | Launch gap / source anchors |
| --- | --- | --- | --- |
| Facility level | Level 5 Optimized ASC / Prestige, five rooms and Executive; no new setting | `maximumPlayableLevel` is 4; stage definitions end at Level 4 | Extend mechanical level/schema/view unions, add stage 5, then expose it only after acceptance. `packages/balance-config/src/prototype-balance.ts:29`, `packages/balance-config/src/prototype-balance.ts:966`, `packages/balance-config/src/schema.ts:9`, `packages/balance-config/src/schema.ts:578`; intent at `docs/features/facility-levels-and-clinical-release-points.md:182`. |
| Founder's Office | Owner-approved 3x3, five appearance tiers; owning it raises every employee's morale | Approved native art/proof exists separately; no buildable `room.founder_office` definition in the current room catalog | Integrate exact approved v2 art, ownership morale and existing ladder. `tools/room-design/level-5/founders-office/approval-2026-10-09.md:5`, `tools/room-design/level-5/founders-office/approval-2026-10-09.md:59`; current room catalog starts at `packages/balance-config/src/prototype-balance.ts:43` and ends at `packages/balance-config/src/prototype-balance.ts:703`. |
| Executive Office | Roadmap room; accepted ladder shortens administrative work | No room, administrative task or Executive home slot | Mockup, room, explicit nonclinical work cycle and usable training/upgrade hooks. `docs/features/facility-levels-and-clinical-release-points.md:187`, `packages/balance-config/src/room-upgrades.ts:96`, `packages/game-domain/src/types.ts:1276`, `packages/game-domain/src/room-capacity.ts:6`. |
| Gift Shop | Roadmap revenue room; accepted +6% gross per upgrade | Future gift income metadata exists: $15/$6 stock and $25/$12 stock, 2-minute dispensing, minimum level 5. No usable shop definition/capability | Mockup, retail outlet, affordable customers, measured demand and receipts. Metadata is not current earnings. `packages/balance-config/src/service-income-catalog.ts:105`, `packages/balance-config/src/room-upgrades.ts:97`, `packages/game-domain/src/retail-operations.ts:428`. |
| Indoor Garden | Roadmap room; accepted +2 visitor satisfaction per purchase | No room, garden-use witness or garden satisfaction application | Mockup and one actual-use comfort rule; no health/clinical benefit. `docs/features/facility-levels-and-clinical-release-points.md:189`, `packages/balance-config/src/room-upgrades.ts:98`. |
| Staff Gym | Roadmap room; accepted +2 morale after use per purchase | Existing breaks restore morale; no gym room, station or gym-use task | Mockup; integrate with breaks, reservations and care priority. `packages/balance-config/src/room-upgrades.ts:99`, `packages/game-domain/src/level-three-support.ts:398`, `packages/balance-config/src/prototype-balance.ts:1132`. |
| Five room ladders | GS038 has accepted four purchases, Levels 1-5, for all five rooms | All five rows have `status: future`; runtime amount/multipliers are neutral and current-only lookup excludes them | Preserve accepted amounts/prices. Activate each row only with its implemented base function. `docs/execplans/gs038-all-room-upgrades.md:459`, `packages/balance-config/src/room-upgrades.ts:95`, `packages/balance-config/src/room-upgrades.ts:106`, `packages/balance-config/src/room-upgrades.ts:124`. |
| Executive staff | Hireable role at Level 5 | No role definition or training metric; two approved future identities are registered with no eligible staff roles | Hire/home/payroll/training/task/identity lifecycle. Reuse approved identities 003/004, not new clinical automation. `packages/balance-config/src/prototype-balance.ts:705`, `packages/balance-config/src/prototype-balance.ts:963`, `packages/balance-config/src/employee-training.ts:4`, `packages/balance-config/src/employee-training.ts:42`, `packages/game-domain/src/characterStillCatalog.ts:209`, `tools/character-mapping/future-roster20-v5/owner-approval.json:3`, `tools/character-mapping/future-roster20-v5/roster.json:120`, `tools/character-mapping/future-roster20-v5/roster.json:170`. |
| Morale and salary | Existing 0-100 staff morale, pay choices and support effects can support Level 5 | Stored employee morale, salary steps, praise, coffee, breaks and unpaid-payroll decay exist. Salary normalization computes base morale from pay; it is not an ownership-bonus selector | Centralize effective morale and prevent repeated/erased ownership bonuses. `packages/game-domain/src/types.ts:1307`, `packages/game-domain/src/staff.ts:752`, `packages/game-domain/src/reducer.ts:6299`, `packages/game-domain/src/reducer.ts:7050`, `packages/game-domain/src/reducer.ts:7146`, `packages/game-domain/src/reducer.ts:10083`. |
| Satisfaction | Existing displayed satisfaction should receive truthful garden/optional Executive effects | Average of recent scored encounters, less current facility-condition penalties; provisional 100 before history | Preserve its denominator and clamps; do not award a perfect inspection for an empty clinic. `packages/game-domain/src/selectors.ts:1381`, `packages/game-domain/src/selectors.ts:1422`, `packages/balance-config/src/prototype-balance.ts:1053`. |
| Quality review (QI) | Existing optional review can remain a supporting achievement | Paid ambulatory-operation receipts enqueue surgeon-led reviews; work requires a real available surgeon and operational Surgeon's Office. It is shown as an optional goal | It is not an inspection, licensing decision or clinician approval. Executive must not perform it. `packages/game-domain/src/level-three-support.ts:317`, `packages/game-domain/src/level-three-support.ts:377`, `apps/player/src/session/viewModels.ts:2526`. |
| Inspection / prestige | Canonical elective inspection week, score, recognition and retries | No formal inspection run, score, recognition tier or prestige state found in current balance/domain execution; current support UI exposes QI counts and breaks | New nonclinical inspection state machine and presentation, with prestige derived from results. `CANONICAL_DESIGN.md:544`, `packages/game-domain/src/types.ts:1336`, `packages/game-domain/src/level-three-support.ts:41`, `apps/player/src/mobile/manage/MobileServices.tsx:104`. |
| Level 4 completion | 750 current-level XP, displayed satisfaction >90, assigned operational APP, pediatric-with-parent witness, wound/ostomy witness | Five goals and durable Level 4 completion acknowledgment exist. Next level is null; leveling up resets current-level XP | Honor already-earned completion; add an idempotent manual transition. `packages/balance-config/src/prototype-balance.ts:1017`, `packages/game-domain/src/selectors.ts:1607`, `packages/game-domain/src/selectors.ts:1632`, `packages/game-domain/src/selectors.ts:1650`, `packages/game-domain/src/reducer.ts:10224`, `packages/game-domain/src/reducer.ts:10237`. |
| Desktop/mobile ending | Both must advance to and finish Level 5 through one session | Both hard-code "Level 4 complete - Level 5 coming later". Shared progression view maps terminal state to `prototypeComplete` | Update shared messages and both shells, not only the desktop Goals panel. `apps/player/src/ui/GoalsPanel.tsx:103`, `apps/player/src/mobile/MobileGoals.tsx:56`, `apps/player/src/session/viewModels.ts:2511`, `packages/balance-config/src/prototype-alerts.ts:824`. |
| Mobile room exposure | All new rooms need build cards, thumbnails, map art, inspection/upgrades and Manage features | Mobile catalog reads shared room definitions; thumbnail and map loading use approved room records plus an explicit asset inventory/cache | Register every new asset in both the presentation registry and phone asset selection; avoid a blank thumbnail reporting ready. `apps/player/src/mobile/build/MobileBuildCatalog.tsx:40`, `apps/player/src/mobile/build/RoomThumbnail.tsx:16`, `apps/player/src/mobile/performance/roomAssets.ts:11`, `apps/player/src/mobile/performance/roomAssets.ts:25`, `apps/player/src/mobile/performance/roomAssets.ts:70`. |
| Clinical release | Level 5 adds no setting; existing outpatient/ASC eligibility and frozen encounters continue | Level 4 pediatric content is prototype-only and needs clinician review; concept/history and release boundaries already matter | No Level 5 clinical authoring batch is required. Do not alter clinical meaning or make supplemental new concepts mandatory. `docs/handoffs/CURRENT_THREAD_HANDOFF.md:32`, `CANONICAL_DESIGN.md:603`, `CANONICAL_DESIGN.md:610`, `AGENTS.md:64`. |

## 2. Progression and terminal behavior

### Entering Level 5

Recommended contract, pending M0:

1. Keep the existing five Level 4 goals unchanged for campaigns that have not
   earned completion. Do not add MRI, Pediatric Waiting Room, new mastery or a
   new clinical visit requirement to that stage. The binding Level 4 M0 decision
   is at `docs/execplans/level4-launch-plan-20261008.md:961`.
2. Honor a valid saved Level 4 completion acknowledgment as an earned unlock,
   even if the owner later sells an optional room or reorganizes staffing.
   A campaign without that acknowledgment must meet the existing gates; loading
   it must not fabricate encounter witnesses. This grandfathering is a proposed
   Level 5 transition rule, not a claim that today's selector already does it.
3. Show one **Advance to Level 5** action in desktop and mobile Goals. It uses the
   existing domain command path, rechecks eligibility, resets current-level XP
   once, and preserves cash, employees, training, rooms/upgrades, FSRS, encounter
   versions, receipts and the earned Level 4 witness/acknowledgment records.
4. Before the final launch switch, keep the shipped cap at 4. Development fixtures
   may opt into Level 5 on a separate disposable origin. No fixture may alter the
   owner's campaign, imply migration at another origin or quietly unlock the
   stage in ordinary play.
5. Retire the current "coming later" success copy and alert eligibility when
   Level 5 is exposed. Keep old event IDs/acknowledgments compatible without
   replaying outdated notices on load. No cash/XP reward or new completion event
   should repeat after commands, reload, retirement of receipts or shell change.

### Finishing Level 5

Recommend these five visible goal groups, all editorial game requirements:

| Goal group | Proposed requirement | Persistence and honesty |
| --- | --- | --- |
| Learning progress | 1,000 current-level clinical XP | Uses existing XP rules after the Level 4-to-5 reset; not a new setting or claim of mastery. |
| Visitor experience | Displayed satisfaction strictly >90 | Uses the existing shared selector and real scored history; the inspection also requires an adequate real activity sample. |
| Staff morale | Average effective morale >=80 across a nonempty employed workforce | Include busy/training employees; no founder pseudo-employee, invented staff or zero-worker 100. Office bonus appears once. |
| Level 5 facilities | One of each new room placed with working access; one Executive assigned to its operational office | Founder ownership morale itself does not require access. Goal/inspection accessibility is a separate facility requirement. Keep room and employee counts separate. |
| Inspection | One completed elective inspection with score >=80 | Completion is durable and does not expire when conditions later worsen. The in-progress run and its evidence must survive reload. |

Proposed first completion text: **"Level 5 complete. Keep playing and improve
your inspection rating."** Show it in Goals, with one durable milestone in
Alerts. Provide the inspection result in its own view. Do not repeat the same
message in the HUD headline, footer and event list; Level 4 manager QA found
exactly that duplication (`docs/execplans/level4-launch-plan-20261008.md:4145`).

Completion does not reset the campaign, stop arrivals, delete staff, mint a
prestige currency or enroll the player in a hospital stage. Average morale,
satisfaction and live room readiness can continue to change after the earned
completion flag. The next-stage field remains null at Level 5.

### End-game options for the owner

| Option | Behavior | Recommendation / consequence |
| --- | --- | --- |
| A. Final ASC with inspection | Level 5 is the final ASC level. Earn its goals through a voluntary inspection week, then continue indefinitely and retry for a higher score/tier. Best score is the prestige score. | Recommended; follows the existing canonical end-game without a second points economy. |
| B. Milestone-only launch | Finish through XP, satisfaction, morale and installed rooms/staff; inspection is a later optional feature. | Smaller first launch, but explicitly defers the canonical challenge. Owner must accept that scope change; UI must not advertise an implemented inspection. |
| C. Inspection without a terminal goal | Level 5 remains an open-ended optimization stage with repeatable inspection scores, but no "Level 5 complete" acknowledgment. | Possible sandbox direction; changes the progression presentation and the finishing-goal proposal above. No hospital level is implied. |

No mandatory prestige reset/rebirth, competitive leaderboard, mastery denominator
expansion or new clinical difficulty is recommended for the first launch.

## 3. Room integration contracts

### Shared contract for all five rooms

Room existence, art approval and gameplay behavior must pass separate checks.
The Level 4 model's shared contract is at
`docs/execplans/level4-launch-plan-20261008.md:138` and its runtime wiring list at
`docs/execplans/level4-launch-plan-20261008.md:188`.

- Stable IDs: `room.founder_office`, `room.executive_office`, `room.gift_shop`,
  `room.indoor_garden`, `room.staff_gym`. Recommend unlock 5 and maximum one of
  each per facility for the initial launch; no duplicate ownership stacking or
  per-copy customer stream. Each has Levels 1-5, independent of facility level.
- The four unapproved rooms need native mockups, explicit layout/anchor JSON,
  a manager-reviewed proof and owner appearance approval before production art
  promotion. Only the Founder's Office needs five distinct appearance tiers.
  The other four retain fixed art/footprints through their accepted numerical
  ladders unless the owner explicitly requests more appearances
  (`docs/execplans/gs038-all-room-upgrades.md:465`).
- Use the ordinary component-built room shell, walls and one-tile door rules.
  Test every perimeter door, corner and backed/unbacked wall condition. Define
  obstacle footprints, standing contacts, cushion contacts, reservations,
  approach/exit paths and draw layers before painting, not after runtime fails.
- Adult characters stay separate from furnishings, with approved identities,
  poses, contacts and uniform scale. Do not bake staff/visitors into room PNGs.
  Decorative furniture cannot erase a valid door or require a pass-through
  collision exception. Preserve fine path samples and synchronized logical
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
  disease prevalence or evidence weight is justified by a prestige room.

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
  owning, not operational occupancy. Access still matters for the room goal and
  inspection coverage. Use the existing 0-100 bounds.
- **Acceptance:** Every appearance tier matches the approved layout and PNGs;
  bonus includes all staff exactly once before/after reload and a new hire;
  salary adjustment and sale do not corrupt stored morale; no new clinical task.

### Executive Office - proposed mockup and administrative work

**Simple rule, recommended Executive option A:** A working Executive Office
lets its Executive complete one daily staff-coordination task that raises staff
morale.

- **Proposed footprint/status:** 3x3, one Executive desk/work contact and one
  visitor chair; mockup and owner appearance approval needed. One Executive home
  slot; the room's tier never adds seats or staff slots.
- **Function/effect:** With an assigned Executive and working access, one
  30-minute nonclinical coordination task per 600-minute operating day gives
  +2 stored morale to currently employed staff on completion, once that day.
  The active-work phase alone receives the accepted 5%-per-purchase office speed
  ladder. It does not increase the daily award, shorten clinical work or speed
  surgeon QI. Options B/C below replace this output, not supplement it.
- **Users:** Executive works here; other idle employees may visit the spare
  chair without gaining a second reward or losing accepted care work. Founder
  may visit but is not a substitute hired Executive. Reception, APP, surgery,
  tests and existing staff breaks retain their roles and priorities.
- **Lifecycle:** Persist a task ID, accepted quote, remaining work and daily award
  marker. Training/sale/firing/unreachable access interrupts or requeues according
  to the selected policy, releases contacts, and never completes invisible work
  through a wall or pays the award twice. Newly hired staff obtain the next daily
  award; no retroactive replay of past daily tasks.
- **Acceptance:** Hire -> assign -> walk -> work -> one award -> return really
  occurs on both maps; office tier changes the labeled administration duration;
  an empty office produces no staffed effect; alternative Executive choices have
  their own truthful labels rather than a generic "efficiency" bonus.

### Gift Shop - proposed mockup and retail income

**Simple rule:** Completed gift purchases earn money after stock cost.

- **Proposed footprint/status:** 3x3, self-service display/checkout contact and
  a two-person queue/exit layout; mockup and owner appearance approval needed.
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
  editorial and conditional on M0; the existing shared retail opportunity is not
  proof of this demand. Keep its RNG/state separate from clinical selection and
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

### Indoor Garden - proposed mockup and visitor comfort

**Simple rule:** An actual garden visit adds satisfaction to that visitor's visit.

- **Proposed footprint/status:** 4x4, walkable planting aisle and two separate
  seated visitor contacts with clear approach/exit paths; mockup and owner
  appearance approval needed. No employee home slot or clinical workload slot.
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

### Staff Gym - proposed mockup and staff break morale

**Simple rule:** A completed gym break raises that employee's morale.

- **Proposed footprint/status:** 4x4, two workout/rest contacts with compatible
  approved standing/seated poses and unblocked circulation; mockup and owner
  appearance approval needed. No home/hiring slot; exercise props must fit actual
  adult contact geometry. A new animated workout rig is not required to ship.
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
`packages/balance-config/src/room-upgrades.ts:95`). Base functions/magnitudes
above remain proposed except the owner's Founder's Office ownership rule.

| Room | One purchase | Costs to Levels 2 / 3 / 4 / 5 | Four-purchase total | Maximum ladder contribution |
| --- | --- | --- | --- | --- |
| Founder's Office | +2 employee morale points | $300 / $500 / $750 / $1,000 | $2,550 | +8 points, plus proposed +2 base; five approved appearances |
| Executive Office | Administration takes 5% less base time | $500 / $750 / $1,100 / $1,500 | $3,850 | 20% reduction in the named active phase; no more daily awards |
| Gift Shop | +6% gift gross | $200 / $300 / $450 / $600 | $1,550 | +24% base gross; stock unchanged |
| Indoor Garden | +2 visitor satisfaction points | $200 / $300 / $450 / $600 | $1,550 | +8 after actual use, plus proposed +2 base |
| Staff Gym | +2 employee morale after use | $250 / $375 / $550 / $750 | $1,925 | +8 after actual use, plus proposed +5 base |

Purchases add percentages of the base, not compound the same room's percentage
four times. Independent employee and room speed factors multiply. Do not make
future rows current merely to display purchase buttons before their effects
exist (`packages/balance-config/src/room-upgrades.ts:135`).

## 4. Executive role: choose one simple job

All options are nonclinical, work from Executive Office, and retain the accepted
administration-speed ladder. Do not give the Executive scored visits, clinical
XP/FSRS, prescribing, surgeon review authority, new clinical eligibility or
automatic inspection points.

| Option | Single job | Proposed observable result | Assessment |
| --- | --- | --- | --- |
| A. Staff coordinator | Complete one daily staff-coordination task | After 30 active minutes, +2 morale to currently employed staff once per operating day | Recommended: fits morale/support direction and existing praise/coffee/break concepts; simple to explain and verify. Office/training upgrades reduce active time, not award cadence. |
| B. Visitor coordinator | Complete one daily visitor-comfort preparation task | After 30 active minutes, add +2 satisfaction to subsequently completed real visits for the rest of that day, once per visit | Alternative emphasis on visitor satisfaction. Start/expiry/visit witnesses must persist; combine with garden only within existing caps. It must not create unscored HUD history. |
| C. Inspection coordinator | Prepare a nonclinical inspection packet | One 30-minute readiness task enables the player to start an inspection; no score, clinical review or cash awarded | Alternative if owner wants the Executive to focus on end-game administration. Reattempts require another packet. Adds no mandatory QI or paid fake "inspection service." |

Recommended common staff contract, new editorial values pending M0:

- Stable role `staff.executive`, unlock 5, hire $600, default $10/game hour,
  salary bounds $6-$22 in $2 steps, existing 5 morale points per pay step,
  base morale 75. One employee per Executive Office; no overflow slots hidden
  by a room tier. Preserve contracts when reassigning or loading.
- Use the existing hire/assign/dismiss, staff appearance/name, payroll, training,
  idle/break, sale-warning and persistence mechanisms. Activate only approved
  future-roster identities 003/004 for this role; keep APP/radiologist selection
  unchanged. Their appearance approval exists; role eligibility is still empty
  (`tools/character-mapping/future-roster20-v5/owner-approval.json:15`).
- Proposed employee training: five tiers, 5% less administrative active time per
  purchase, $100/$200/$300/$400, using the existing 60-minute training session and
  two-person global training capacity. This is a new metric/proposal, not an
  already approved Executive row; current metrics/roles lack it
  (`packages/balance-config/src/employee-training.ts:1`,
  `packages/balance-config/src/employee-training.ts:4`).
- At maximum office and employee training, the proposed 30-minute task is
  `30 x 0.80 x 0.80 = 19.2` active game minutes. Walking is not erased; the daily
  output or inspection eligibility is not multiplied. Freeze accepted work.
- If owner chooses C, progression's assigned Executive/readiness requirement
  replaces A's daily morale output; if B, labels show visitor preparation.
  Do not implement all three as an unlabeled passive "efficiency" bundle.

## 5. Morale, satisfaction and inspection integration

### Morale and salary

Keep stored employee morale and existing gain/drain/salary behavior compatible.
Introduce one explicit effective-morale selector that adds the owned Founder's
Office modifier once and clamps to 0-100. Use it consistently for staff display,
workforce average, break eligibility, satisfaction conditions, quitting checks
and inspection, with a documented distinction from the salary-normalization
helper at `packages/game-domain/src/staff.ts:752`.

The ownership modifier must not be written back on every tick or load. Ordinary
coffee, praise, gym and Executive awards mutate ordinary stored morale once;
payroll shortfalls still drain it. Salary commands retain the existing pay-derived
morale rule while keeping the office modifier separate. Selling an office cannot
subtract past coffee/gym gains or expose an unclamped negative value. Ownership
must not immunize staff against sustained nonpayment. Verify every caller,
including current payroll decay at `packages/game-domain/src/reducer.ts:6263`
and salary assignment at `packages/game-domain/src/reducer.ts:10103`.

Today's insolvency threshold is <=10 (`packages/balance-config/src/prototype-balance.ts:1181`).
With the proposed maximum +10 ownership modifier, zero stored morale still meets
that threshold. Test that boundary explicitly. A larger owner-selected base bonus
would require an explicit nonpayment policy; do not silently make permanent
ownership prevent quitting.

### Satisfaction

Retain existing scored encounter history, rolling window, current-condition
penalties and bounds. Record one garden comfort witness on the actual visit;
apply its accepted amount once at that visit's settlement. Do not increase all
past historical values whenever an upgrade is bought. If Executive option B is
chosen, freeze/record its daily preparation eligibility per completed visit too.
Other room ownership does not invent a new satisfaction payment or patient
case. Show the contribution and resulting satisfaction clearly in both shells.

### Inspection and prestige: proposed first implementation

Use one explicit, nonclinical game challenge with **not started / running /
completed / cancelled** states. Recommend:

1. The owner elects to start it in Level 5. No automatic start at unlock, no hidden
   purchase fee, offline catch-up or surprise campaign end. Option C also requires
   the completed Executive preparation packet. Only one active run exists.
2. A week is five existing 600-minute operating days: 3,000 active facility
   minutes, excluding pause and real-world offline time. Require at least ten
   real scored clinical completions within that run before granting a rating.
   Insufficient activity is **Incomplete**, not a provisional perfect score.
3. Four components, equally weighted at 25%: mean displayed satisfaction;
   mean effective staff morale; percentage of observed minutes with the five
   Level 5 rooms and assigned Executive usable; and percentage of expense
   postings fully paid. Observe after ordinary simulation settlement, not from
   a single favorable final screenshot. No workforce or no expense observation
   cannot be treated as 100. Coverage does not require an optional MRI purchase.
4. Store bounded accumulators, actual completion/posting counts, rule version,
   run ID/start/end ticks and final immutable result. Use deterministic ordering
   and existing minute ticks; avoid replaying the entire campaign to reconstruct
   a score. A paused minute, repeated command, shell remount or reload contributes
   nothing extra. Selling/firing during a run changes future coverage/observations
   but not already observed evidence. Cancelling grants no pass or completion.
5. Round the final weighted score once for display: `<80` = Improving/retry,
   `80-94` = Prestige, `95-100` = Distinguished. A result >=80 meets the Level 5
   inspection goal. Keep both the latest result and best result; the best score
   is the prestige score. No additional currency or dollar reward is required.
6. Repeat whenever no inspection is active. Preserve previous reports and the
   once-earned Level 5 completion flag even after a poorer later result. Show
   the component arithmetic, progress, activity sample, recognition and retry
   action on desktop and mobile. Do not advertise real accreditation, medical
   safety certification or approval of clinical teaching.

Example only: component values `94, 86, 100, 100` yield
`(94 + 86 + 100 + 100) / 4 = 95`, the proposed Distinguished tier. These weights
and thresholds are editorial game values requiring M0, not inspection standards.

Existing surgeon-led QI stays intact and optional. Its receipt-backed completion
can appear beside the inspection as an existing achievement, but cannot silently
be counted as an Executive task or clinician approval. Do not make an unreviewed
clinical teaching point an inspection requirement.

## 6. Economy under accepted option B

### Baseline, accounting and limits of this worksheet

Option B is binding (`docs/design/room-economy-audit-20261008.md:348`). Support
rooms may have a negative direct-cost row funded once by protected clinic income;
they do not earn invented fees (`docs/design/room-economy-audit-20261008.md:47`).
For Level 5, use a small support budget from measured normal-demand clinic
surplus, plus a separately measured profitable Gift Shop. Never convert morale
or satisfaction points to dollars to claim that a room pays for itself.

The measured Level 4 reference uses four warmup hours and 48 measured hours
(`tools/economy-audit/level-four-results-20261009.json:1`):

`$204.125 gross/h - $2.625 stock/h - $170 operating/h = $31.50 net/h`.

That is one fixture's measured result, including its existing support costs, not
a forecast for every owner campaign. Direct channel nets include MRI +$34/h,
pediatrics +$20.333/h, wound +$11.75/h and ordinary APP +$8/h; adding those
again to $31.50 would double-count shared support funding. Use actual reducer
dispatch, settled receipts and elapsed measurement time for the new audit,
including walks, queues, training, break interruptions and first-sale delay.

### Proposed room/staff worksheet

All new values here are **editorial game proposals**, with no clinical claim.
Preserve already accepted upgrade prices/effects. Recommend no upkeep increase
for Level 5 upgrades, no automatic wage raises and no cash grant at unlocking.

| Item | Proposed build/hire | Upkeep or wage per game hour | Base function / direct cash | Funding at normal demand |
| --- | --- | --- | --- | --- |
| Founder's Office | $1,200 | $1 | Ownership morale; no fee | Allocate $1/h from measured clinic surplus, once |
| Executive Office | $2,000 | $1 | Enables chosen nonclinical administrative work; no fee | Allocate $1/h plus Executive pay, once |
| Executive | $600 hire | $10 default wage | Chosen staff/visitor/inspection support task; no fake billable encounter | Allocate $10/h from measured clinic surplus; salary still accrues when idle/training/on break |
| Gift Shop | $800 | $1 | Normal gift $15 gross - $6 stock; premium $25 - $12 | At 0.5 normal sales/h: $7.50 gross - $3 stock - $1 upkeep = **+$3.50/h** |
| Indoor Garden | $800 | $1 | Actual-use visitor satisfaction; no fee | Allocate $1/h from measured clinic surplus, once |
| Staff Gym | $1,000 | $1 | Completed-break morale; no fee | Allocate $1/h from measured clinic surplus, once |

Five rooms cost **$5,800**; adding one Executive hire gives **$6,400** before
ordinary hallway/access construction. Recurring addition is **$5 room upkeep +
$10 payroll = $15/h**. The four support rooms plus Executive use **$14/h** of
the existing $31.50/h measured surplus, leaving $17.50/h. A base Gift Shop adds
$3.50/h net, for a worksheet whole-clinic result of **$21.00/h**.

Equivalent arithmetic without the split:

`$31.50 + $7.50 gift gross - $3 gift stock - $5 new upkeep - $10 wage = $21.00/h`.

This is **budget coverage**, not evidence that +2 morale causally earns $14/h.
Option B's affordability goal must still pass a paired, real Level 5 simulation.
If the owner requires each support room to have its own independently measured
cash return, these non-revenue functions cannot honestly meet that interpretation;
the manager should resolve that requirement before implementation rather than
invent fees or claim a tested return. The audit's support-allocation method is
the recommended interpretation.

### Gift unit economics and upgrades

| Shop tier | Normal-gift gross | Stock/sale | Margin/sale | At 0.5 sales/h, net after $1 upkeep |
| --- | --- | --- | --- | --- |
| 1 | $15.00 | $6.00 | $9.00 | $3.50/h |
| 2 | $15.90 | $6.00 | $9.90 | $3.95/h |
| 3 | $16.80 | $6.00 | $10.80 | $4.40/h |
| 4 | $17.70 | $6.00 | $11.70 | $4.85/h |
| 5 | $18.60 | $6.00 | $12.60 | $5.30/h |

At tier 1 the shop's own operating break-even is
`$1 / ($15 - $6) = 0.1111 normal sales/h`, about one sale per nine game hours.
At half the proposed fulfilled gift demand (0.25/h), its net is
`0.25 x $9 - $1 = +$1.25/h`. At zero sales it loses $1/h before applicable
technical-outage relief. None of these calculations assumes premium purchases.

The $800 build payback at normal demand is `800 / 3.5 = 228.57 game hours`.
The first $200 upgrade adds `$0.45/h`, about 444.44 hours to repay that purchase;
all $1,550 upgrades add `$1.80/h`, about 861.11 hours. These are optional prestige
investments with modest revenue improvement, not quick-return guarantees. Do not
alter the owner-approved ladder to hide those long paybacks.

The existing shared retail generator has one opportunity per 120 minutes with
shared candidates/acceptance and capacity limits, not one independent customer
stream per outlet (`packages/game-domain/src/retail-operations.ts:37`,
`packages/game-domain/src/retail-operations.ts:488`). Merely adding a shop to it
cannot substantiate the proposed 0.5/h. M6 must implement and M8 must measure the
approved dedicated stream, or recalculate this worksheet for measured shared
demand before acceptance. Check upgraded premium affordability and real quote
rounding, not just catalog base fees.

### Avoiding a profit cliff

- Build optionally/in stages; unlocking alone adds no running costs. Never
  autoplace all five rooms or auto-hire an Executive. The player can save first.
  Show actual incremental upkeep/pay and first-income expectations in both
  shells. The five installed rooms are a finish goal, not a forced unlock bill.
- With the full proposed cluster, a 50% reduction in gift demand alone changes
  the reference net to `$31.50 + $1.25 - $14 = $18.75/h`. This does **not** show
  that halving all clinic demand is profitable. Full-clinic slow demand and
  outages need separate real scenarios; the earlier option B model itself had
  a losing slow endoscopy-outage case
  (`docs/design/room-economy-audit-20261008.md:165`).
- Keep recurring Level 5 costs bounded at the approved default; staff raises,
  construction and upgrade purchases are visible owner choices. No automatic
  inspection fee, extra upkeep per cosmetic tier or morale-to-cash conversion.
- Stage a working shop before expensive support purchases where useful. A
  proposed $500 remaining-cash planning reserve is advisory, not a newly granted
  subsidy or a silent spending block. Measure the actual cold-start stock/cash
  trough; positive hourly mean alone does not assure liquidity.
- Extend existing technical-outage relief to the revenue Gift Shop explicitly:
  after 60 continuous minutes of technical nonoperation, 20% upkeep if approved
  in the implementation brief. Do not classify zero demand, appointments off,
  ordinary queueing or stock-cash shortage as a technical outage. Executive
  payroll and support upkeep do not disappear when work is paused.
- Preserve option B salary-economy version and saved wage premiums. Do not rerun
  the old rebase or reset all contracts while adding Executive. Accepted frozen
  clinical/service/retail quotes remain frozen; no clinical fee/duration changes
  are needed to subsidize Level 5.
- M8 acceptance requires all five base functions actually exercised, the full
  default cluster cash-positive at normal demand, measured Gift Shop net >=0,
  and a published per-room/support-allocation breakdown. Slower demand/outage
  losses must be visible, with no abrupt new mandatory obligation. If measured
  normal margin is insufficient, tune new build/upkeep/wage/demand proposals
  through the manager within owner-approved direction before the launch switch.

## 7. Clinical content: no new batch required

Recommend **no required Level 5 clinical authoring work**. Level 5 adds no setting,
so current eligible outpatient/ASC encounters, prior clinical release gates and
the existing frozen encounter/history model can supply normal play. Raising a
mechanical facility level must not automatically widen acuity, clinical meaning,
difficulty or diagnosis weights.

An end-game inspection can use existing operational satisfaction, morale,
coverage and paid-expense evidence. Existing receipt-backed QI may appear as an
optional achievement. Neither requires a new diagnosis, question variant,
management claim or clinician-approved explanation. Prestige must not be called
clinical competence or real safety certification.

Do not make "mastery" a mandatory shorthand for XP, answer count or inspection.
The canonical mastery definition has distinct cross-date/variant/FSRS criteria
(`CANONICAL_DESIGN.md:374`). A later mastery view needs its own honest existing
history evaluation and campaign-pinned denominator. Supplemental new concepts
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
| Native approved art/proof and later runtime integration were separate milestones; approval alone did not create playable rooms (`docs/execplans/level4-launch-plan-20261008.md:1261`). | Preserve Founder's Office approval and do four new mockups before production; test real runtime paths/contacts, all shells and every tier afterward. |
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

## 9. Bounded milestones, dependencies and ownership

M0 is planning/owner decision capture, not implementation. The manager records
binding answers and reserves the current file lanes before each brief. Every
worker gets this plan path, exact ownership, requirements/non-goals, clinical
rules, acceptance criteria and commands. Workers preserve others' work, return
ambiguity instead of making architecture decisions, and end with changed files,
actual command output and open risks. The manager inspects the actual diff and
validation, then conducts **browser QA after every milestone**, including visual
proof QA for M1 and disposable runtime QA for M2 onward. A blocked browser check
means browser acceptance remains pending, not assumed.

Default implementation workers are Sol; a narrowly specified metadata/hash check
can use Luna. No worker in this plan dispatches another. Shared-file subjobs are
sequential even when listed inside one milestone. The plan itself is research;
none of M1-M10 has run.

| Milestone | Bounded lane / ownership to put in the manager brief | Dependencies | Acceptance and validation |
| --- | --- | --- | --- |
| M0. Owner decisions and contract freeze | Manager: this plan's binding decision/progress sections and owner-request/handoff coordination only | Planning handoff | Record answers to the eight choices below, selected Executive/ending option, final editorial worksheet and inspection rules; do not reopen approved Founder art/ownership or GS038 ladders. Identify concurrent mobile/desktop ownership. |
| M1. Four room mockups | One art/design worker sequentially owns new Executive Office, Gift Shop, Indoor Garden and Staff Gym proof folders under `tools/room-design/level-5/`; no runtime/Founder art changes | M0 | Explicit approved footprints, doors, contacts, obstacles, occlusion and adult preview routes; owner appearance approval for each; fixed appearance for these four. V9 proofs plus manager browser review of all routes/door states. Founder hash/layout check is read-only. |
| M2. Level 5 foundation and isolated QA fixture | One domain/schema worker: `packages/balance-config/src/schema.ts`, domain `types.ts`/`persistence.ts`, new Level 5 state/fixture/tests and an explicitly owned new QA helper/entry | M0 | Level/schema support, optional versioned Level 5 completion/inspection/task state with inert defaults; old Level 0-4 state round-trips; future rooms/effects remain inactive; ordinary cap stays 4. New fixture supports pre-unlock/ready/placed/mid-task/mid-inspection states on a disposable origin, no real-save copying. V1/V2/V5 plus manager browser load/reload in both shells. |
| M3. Approved room art and base catalog | One worker owns Level 5 assets/manifests/presentation records, room definitions/base prices/caps, capacity/access wiring, map integrations and mobile room-asset/thumbnail registration. Reserve shared catalog/registry files exclusively | M1, M2 | Five exact room definitions and Founder tiers can build/inspect/sell in opt-in QA only; each has doors, paths/contacts, expense quote and honest inactive/live effect labels. Promotion is hash-exact for Founder. V1/V2/V4/V5/V6/V9; manager desktop/mobile placement, all Founder tiers, wall/door/access and asset checks. No upgrade may be purchasable before its effect milestone. |
| M4. Morale/garden/gym base behavior and ladders | One worker: dedicated support module plus serial edits to `staff.ts`, selectors, reducer, persistence, room upgrades and related shared view/UI/mobile tests | M3 | Ownership morale once and sale reversal; salary/praise/coffee/unpaid compatibility; actual garden visit and gym break witnesses, frozen tiers, priority/reservations; only these implemented ladders become current. Every build/inspect/upgrade/effect path exists in desktop and mobile. V1/V2/V4/V5 plus manager browser use/interruption/reload/sale and capped morale/satisfaction cases. |
| M5. Executive lifecycle, office duty and training | One worker owns role/capacity/training catalog, future identity eligibility, administrative task module and required serial shared domain/session/desktop/mobile staff UI edits | M3, M4 | Chosen option only; hire/default pay/bounds/home/queue/path/task, once-only output, training prices and real speed metric, frozen office/training quote, firing/sale/reload. Executive Office ladder becomes current only with actual administration work. Existing APP/surgeon/QI roles unchanged. V1/V2/V4/V5/V6; manager browser hire/assign/train/break/task/quit/sale on both shells and actual approved adult poses. |
| M6. Gift retail operation and demand | One worker owns retail/demand module, capability/catalog and gift upgrade activation, receipts/finance/view/desktop/mobile Services edits; reducer/persistence edits serial | M3, M5 | Real independent facility-level gift-only stream if approved, ordinary/premium budget checks, actual outlet paths/queue/stock/cash/receipts, cap/cadence/reload idempotence and known clinical-pool comparison. No Executive/shopkeeper requirement. V1/V2/V4/V5/V6; manager browser normal/premium/Founder purchases, stock shortage, upgrade quote and blocked/sold outlet. |
| M7. Elective inspection and prestige | One worker owns new inspection domain module/state/tests plus required shared selectors/reducer/persistence and session/desktop/mobile inspection presentation | M4, M5, M6 | Start/pause/run/cancel/complete/retry states; correct observed four-component score/activity sample, versioned frozen results/latest/best/recognition; no surprise start, clinical accreditation, duplicated completion or paid fake inspection service. Desktop and phone expose every command/result. V1/V2/V4/V5/V6; manager browser start/reload/cancel/retry at each shell, boundary ticks and insufficient-activity state. If option B postpones inspection, manager rewrites scope/gates before this milestone. |
| M8. Progression, option B audit and explanatory UI | One worker owns stage 5 goals/transition, separate earned completion, selectors/alerts/shared view and both Goals implementations; new deterministic economy harness/results and user-facing cost/effect/inspection guidance | M4-M7 | QA-only full Level 4 -> 5 -> completion; earned Level 4 migration, no invented witness/reset/repeated reward; all five functions genuinely operate; measured normal full-cluster positive cash flow, shop positive net, slower/outage/cold-start results disclosed. V1-V6/V10; manager browser two-shell goal transitions, event surfaces, finances and published measurement arithmetic. Ordinary launch cap remains 4. |
| M9. Integration validation and regression fixes | One validation/fix worker owns proposed Level 5 e2e/regression files and agreed integration fixes; larger domain/UI corrections return in a bounded exclusive lane. Manager owns full/default/browser acceptance | M8 | Author/run actual Level 5 e2e suite and all scenarios below; meaningful older/save/retired history fixtures, quote/task/run freezes, long tick/render test, current clinical/progression/APP/QI regressions. No new failures hidden under the known thyroid baseline or the two documented Level 4 defects. V1-V10 as applicable; manager diff review, aggregate reruns, desktop/mobile browser matrix and final economy report acceptance. |
| M10. Launch switch and owner handoff | One narrowly scoped worker changes ordinary `maximumPlayableLevel` to 5 and final release-visible labels after manager acceptance; manager updates authoritative handoff/checkpoint reminder | M9 accepted and four new art approvals | Exact existing canonical launcher/pathways preserved; ordinary campaign sees earned Advance to Level 5 and both shells show the same correct new ending. No auto-spend or clinical review promotion. V1/V2/V4/V5/V6 and manager V7/V8 plus browser old Level 4 save, fresh Level 0 tutorial and final phone/desktop smoke. Record local-only state; manager requests explicit "push to GitHub" at the accepted checkpoint. No push/deploy/publication in this worker lane. |

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
| V9 | Room proof/asset acceptance | M1/M3 briefs specify existing or newly authored read-only hash/contact/path/door validators and their exact commands after those tools exist. Acceptance requires actual output, all room doors/tiers/backing states and native browser proof; no invented validator name is a pass. Never rerun a proof-writing script over approved Founder artifacts during a hash check. |
| V10 | Economy/long-run/persistence evidence | M8 authors an owned deterministic reducer audit and fixes its exact invocation in the handback before running it. New dated Level 5 JSON records seeds, warmup/measured hours, roster/training/room tiers, demand settings, gross/stock/upkeep/payroll/net, receipts and minimum cash. Do not overwrite `tools/economy-audit/level-four-results-20261009.json` or use analytical fee-times-capacity as measured dispatch. |

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
  (`docs/handoffs/CURRENT_THREAD_HANDOFF.md:4`, `AGENTS.md:106`).
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

1. Fresh Level 0 tutorial and older Level 0-3 fixtures behave unchanged; a
   pre-Level-5 Level 4 save loads without new expenses, fabricated goals or erased
   clinical history. An earned Level 4 completion with retired witnesses still
   unlocks once. An unearned save cannot skip its original five goals.
2. Advance Level 4 -> 5 manually; current-level XP resets once; no duplicate
   click/tap/reload reward. Both Goals surfaces show the same requirements and
   correct next/terminal label. Lower-level FSRS and exact frozen case revisions
   survive, including existing prototype clinical review status.
3. Build all five through ordinary placement/access, inspect/upgrades/sale.
   Exercise every approved Founder appearance and all room wall/door states.
   Block a door, sell a room or dismiss its occupant mid-task; no stuck actor,
   invisible work, stale seat reservation, empty-path renderer freeze or duplicate
   stock/reward. Render at 1x/4x and reload mid-route on desktop and phone.
4. Verify ownership morale before/after hire, salary change, upgrade, sale, payroll
   shortfall, coffee/praise/gym/Executive award and reload. Base stored values do
   not accumulate the derived office bonus. Verify clamps and consistent UI,
   workforce average, break, satisfaction and quitting behavior.
5. Exercise adult garden rest with correct once-per-visit satisfaction and care
   preemption. Pediatric families remain paired in existing paths and are not
   reassigned to solo garden/shop contacts. Gym and ordinary break share cooldown
   and cannot farm alternating gains. Frozen accepted quotes survive upgrades.
6. Hire/assign/train Executive, complete the chosen visible duty, interrupt it,
   pay/underpay, fire/reassign and sell its home. Confirm the actual administrative
   duration and once-only output; surgeon QI is still surgeon-led and APP income
   remains unchanged. No empty-office effect or extra office staff slot.
7. Gift normal/premium purchases, highest-tier affordability, founder consumption,
   cash below stock cost, two-person queue, care preemption and sale/cancellation
   all settle correctly. One receipt per fulfilled transaction; no dedicated
   stream multiplied by upgrades, room copies, reload or shell remount. Compare
   scored arrival timestamps/counts **and exact eligible/frozen case identities**
   with gift/support features on/off; explain known active-pool effects rather
   than declaring equality from timestamps alone.
8. Start inspection explicitly, pause, reload, cancel, finish, retry. Observe full
   3,000-minute boundary, real activity requirement, nonempty workforce, posting
   denominator and all four weighted components. Cancellation/incomplete run
   awards nothing; latest/best result and earned completion do not regress or
   repeat. UI does not claim clinical accreditation or mastery.
9. Complete Level 5, retire old receipts/encounters, reload and change shells.
   Earned result persists; clinic remains open; no nonexistent Level 6 or forced
   reset. One Goals message/Alerts milestone with no footer overlay at any QA
   width. A later poor inspection preserves the earned goal and best score.
10. Economy: paired identical Level 4 baseline versus full Level 5 default cluster,
    four warmup/48 measured hours minimum; at least three deterministic seeds;
    normal and half gift demand, slow overall clinic demand, startup cash trough,
    blocked revenue-room outage, office unstaffed and training/break interruptions.
    Compare all ledger sums/cash postings, room use witnesses, support allocation
    and real stock costs. Record losses honestly. Normal default cluster and shop
    pass the stated margin requirements before cap 5 opens; do not override the
    actual default balance to manufacture profitability.

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

## 11. M0 owner decisions needed

These are the few design choices needed before the manager dispatches runtime
work. The Founder's Office appearance/ownership rule and accepted five ladders
are already approved; the list does not request their approval again. Numerical
defaults below are editorial game proposals.

1. **End-game:** Make Level 5 the final ASC level, keep the clinic open, and allow repeatable elective inspection weeks. Recommended: use the best inspection score as prestige, with no campaign reset or invented Level 6.
2. **Unlock:** Preserve the five Level 4 goals and honor saved completion. Recommended: a manual Advance to Level 5, resetting only current-level XP once and adding no clinical gate.
3. **Finish goals:** Recommended: 1,000 current-level XP, satisfaction >90, average staff morale >=80, all five working Level 5 rooms with an assigned Executive, and a passed inspection. Earned completion stays earned.
4. **Rooms:** Recommended: mock up a 3x3 Executive Office, 3x3 Gift Shop, 4x4 Indoor Garden and 4x4 Staff Gym, with one of each. Use the proposed simple room rules; the approved 3x3 Founder's Office gets a proposed +2 base ownership morale bonus.
5. **Executive:** Choose staff coordinator, visitor coordinator or inspection coordinator. Recommended: staff coordinator, giving +2 staff morale after one daily administrative task; use the proposed office/training task contract.
6. **Economy:** Recommended: the option B worksheet: $5/hour total new room upkeep plus a $10/hour Executive, proposed build/hire prices, and a separate gift visitor every 120 minutes. Keep existing gift fees/stock and accepted ladders; fund support once from clinic surplus and verify actual margins before launch.
7. **Inspection:** Recommended: five operating days and at least ten real scored completions; equally score satisfaction, morale, room/staff availability and paid expenses. Pass at 80, highest recognition at 95; show the arithmetic and allow retries.
8. **Clinical content:** Recommended: no new required clinical batch or setting. Keep existing cases and review status; QI can remain optional, and any future mastery/content feature gets its own brief.

## 12. Progress, decisions, discoveries and next action

### Planning work completed (2026-10-10)

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

### Open risks / manager decisions

- M0 is not yet binding. The four new room appearances, selected Executive job,
  inspection rules and base economy values require owner decisions; approved
  Founder appearance/ownership and accepted ladders do not.
- Level 4's positive result is one measured fixture. Support-effect cash return
  and the new gift stream have not been measured; the worksheet must not be
  represented as a passed simulation or a promise about the owner's cash.
- Mobile is live and changing. Reserve its shared session/view/art lanes as well
  as `apps/player/src/mobile/**`; a working desktop control is not phone parity.
- Keep the two recorded Level 4 defects visible and separately owned. Any new
  gameplay regression caused by Level 5 is a launch blocker, even if a related
  historical reproducer is currently skipped.
- Neither this plan nor later gameplay QA approves clinical content, publishes
  Pages or creates a GitHub backup. The manager owns the eventual accepted
  checkpoint/handoff and explicit backup reminder.

**Next action:** Manager reviews this plan with the owner, records M0 answers and
approved numerical contracts, reserves current lanes, then dispatches M1 and M2
as bounded sequential briefs. Runtime cap remains 4 until M10 acceptance.
