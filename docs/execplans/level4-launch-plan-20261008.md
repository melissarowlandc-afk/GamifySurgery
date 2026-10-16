# Level 4 launch plan - October 8, 2026

Status: research and planning complete; manager review and owner decisions pending.
Owner intent: "I want to work on getting level 4 ready to launch."
Manager: Claude Code thread **GamifySurgery manager**. Planning worker: GPT-6.1
Sol. This file is the worker's entire write lane. No implementation, Git,
installs, web research, browser access, owner-save access, or other document
edits were performed. In particular, the shared current handoff is unchanged
under this brief's explicit single-file restriction.

## Goal and launch boundary

Make **Level 4 - Specialty Expansion** playable from an existing Level 3 campaign
through construction, staffing, specialty visits, diagnostic results, money,
upgrades, learning encounters, save/reload, and a visible completion milestone.
The recommended first launch is the existing owner/development **explicitly
unapproved prototype**, with Level 5 still a locked preview. This plan does not
authorize a public release, Pages publication, merge, deployment, or backup push.

There are **four new runtime rooms**, not five. The Radiology Reading Room and
Radiologist already unlock at Level 3. Their design lives under a historical
`level-4` folder, but current balance, geometry, art, staffing, reading queues,
income, and upgrades implement them at Level 3. Preserve `room.reading`,
`staff.radiologist`, existing placements, all four seats, and old work contracts;
extend their integration to MRI. Do not remove the owner's Reading Room or move
its unlock back to Level 4. [B1] [B2] [P1]

Successful end-to-end acceptance means:

- A qualifying old Level 3 campaign can advance to Level 4 without restarting or
  losing money, rooms, employees, encounters, receipts, or FSRS history.
- MRI, Pediatric Waiting, Pediatric Examination, and Wound/Ostomy are buildable
  and usable with the exact approved designs and functional doors/supports.
- APP hiring, assignment, salary, training, operational appointments and
  specialty coverage work; Imaging Technicians operate MRI and existing readers
  interpret it. The player continues to receive scored learning opportunities.
- Real pediatric patients use age-compatible art and a linked parent who stays
  with the child; real routine wound/ostomy and MRI work completes and settles.
- Timing previews, resource queues, accepted plans, result readiness, experience
  effects, upgrade quotes, income, finance totals and save/reload agree.
- The launch content manifest distinguishes existing clinician-approved records,
  owner-authorized prototype drafts, and the bounded new draft batch. Tests do
  not promote any content to clinical approval.
- Level 4 goals can all be met using the actual shipped content/services. The
  completion display makes clear that Level 5 is unavailable and continued play
  remains possible.

## Constraints, repository state, and source precedence

This is a shared, actively changing working tree. The current handoff describes
concurrent staffing/Reading/peri-op/performance work and a known player test
failure; those are manager-owned integration facts, not validation run by this
worker. No Git status or diff was inspected because this brief forbids Git.
Before each implementation milestone the manager and assigned worker must
reread applicable instructions, this plan, the current handoff and current files,
then establish their owned before-images/diff without overwriting concurrent
work. Normally only one write-capable worker owns shared runtime files at a time.
[H1]

Precedence for this plan is: latest explicit owner direction and dated approval
receipts; current runtime code; accepted active contracts; then historical
roadmap/design context. `ROADMAP.md` still describes Levels 0-2 plus a locked
Level 3 preview, and the facility-level design's opening status is similarly
stale. Its Level 4 roster is useful design intent, not proof that those rooms or
gates work. October 7 timing decisions and current code move Reading and
Radiologists to Level 3 and retire Imaging Control. The October 8 approval
receipts supersede old proof README statements saying design approval is pending.
Design approval does not establish runtime readiness or clinical approval.
[D1] [D2] [D3] [A1] [A2] [A3] [A4] [A5]

Keep educational tier, patient acuity, facility capability, facility progression,
room upgrade level and staff training separate. Preserve stable concept IDs for
wording/profile changes and create an appropriate new concept version for a
materially changed meaning. Clinical relationships are not simulation demand
weights. No race/ethnicity disease selection, runtime AI or web retrieval,
proprietary corpus ingestion, or invented clinical numbers is in scope. [I1]

The concurrent economy deliverable `docs/design/room-economy-audit-20261008.md`
was **not present at this worker's read time**. Its conclusions are a dependency,
not inferred evidence. All new base costs, salaries, demand cadences and timing
extensions below are labeled proposals pending reconciliation. The already
accepted GS-038 upgrade ladders are not reopened by that audit unless the owner
explicitly changes them. [D4] [B3]

## Inventory: intended Level 4 versus current implementation

| Area | Intended/accepted direction | Observed current implementation | Missing for launch |
| --- | --- | --- | --- |
| Facility scope | Specialty expansion: MRI, Reading, pediatric waiting/exam, wound/ostomy; APP and originally Radiologist. Call Room removed October 7. | Reading/Radiologist are now L3; maximum playable level is 3. No four new room definitions or `staff.app`. | Add four L4 definitions and APP; preserve Reading at L3; never restore Call Room. [D2] [D3] [B1] |
| MRI | Imaging Technician acquisition; separate staff/external interpretation; offsite fallback. | Inert `income.mri`: $240, scheduled every 240 game minutes, 60-minute acquisition, `room.mri`/technician references and no clinical route IDs. Multiple MRI-related services already have explicit external routes. | Operational room/capability/tech slot, patient routing, reviewed onsite-equivalence map, phased timing and actual reading/result/payment integration. [B4] [B5] [B6] |
| Pediatric waiting | Owner-approved 4x4, five ordinary seats plus four stools; stools only for children under 10; parents in same room. | Approved isolated art/proof, no room definition, runtime seats, waiting classification or family reservation. | Age-aware seats, child/parent admission and paired routes/reservations, comfort attribution, fallback and overflow behavior. [A3] [G2] |
| Pediatric examination | Owner-approved 3x3, child, clinician and parent positions. Semantic release `release.l4.pediatrics` requires L4 and operational room. | Inert explicit-only `income.pediatric_consult`: $80, 30 minutes, APP; no scheduled cadence, no room and no pediatric runtime batch. | Family-compatible exam routing, founder/manual versus APP coverage, scheduled baseline work, real content eligibility and completion witnesses. [D2] [A4] [B4] [C1] |
| Wound/ostomy | Owner-approved 3x3 clinic; peri-op nurses explicitly do not staff it; `release.l4.wound_ostomy` needs L4 and operational clinic. | Inert APP service rows: wound care $60/30 minutes/every 180, wound procedure $120/45 minutes/explicit-only, ostomy support $75/30 minutes/every 180. | Room, APP coverage, clinic visit routes/actions, reviewed action-to-service bindings, experience/revenue and supply dispensing integration. [D2] [A5] [B4] |
| Wound supplies | Authorized supplies may be sold through an appropriate outlet. | `income.wound_supply` already describes $20 gross/$10 stock, two-minute dispensing via L3 Pharmacy or a future wound-clinic outlet. | Add the clinic outlet to real operational coverage; preserve existing Pharmacy behavior and order authorization; prevent duplicate baskets/charges. [B4] |
| Reading | Existing L3 four-reader dependency. | `room.reading`: 4x4, $1,800 build/$24 hourly upkeep; radiologist $300 hire/$26 hourly salary. Approved art is shipped under `art/rooms/level3-v1/radiology-reading/`; four posts and independent queues. New local reads add $5 to imaging income, outside reads $5/base five minutes; accepted old split payments remain frozen. | MRI joins the current reading mechanism. Do not activate old hidden `income.image_read` $40/30-minute metadata as a second reading system or duplicate payout. [B1] [B2] [B4] [P1] |
| APP | L4 clinic-automation reward; operational automation creates no active-recall evidence. | Service catalog references `staff.app`; some existing minor-procedure routes prefer an APP and allow founder fallback. No hireable role, role slots, eligible APP still, training row, chart-automation policy or mastery evaluator was found. | Role and physical capacity; explicit service/provider map; visible activity/training; opt-in automation boundary described below. [D2] [D5] [B4] [B5] [B7] [R2] |
| Pediatric art/identity | Child appearance must fit the clinical story; parent stays with child. | Twelve `level3-roster-v2.021`-`.032` stills are `future-presentation` art with intended visual ages 5-17. `patientStillEligibleEntries` explicitly returns no choices below age 18. | A pediatric eligibility path, visual sex/profile metadata review, parent identity and movement persistence; never make these children adult ambient/routine replacements. [R1] [A3] [A4] |
| Upgrades | Four purchases, room levels 1-5; fixed approved layout. | Reading ladder is active. MRI, pediatric waiting/exam and wound/ostomy ladders exist with `status: future`; runtime helpers intentionally return neutral effects for them. | Activate only these four after their base integrations; attribute each effect to the room actually used; preserve frozen quotes. Five L5 future ladders remain inert. [D4] [B3] |
| L3 to L4 | Specialty expansion follows the ambulatory surgery center. | L3 goals: 500 **current-level** Clinical XP, displayed satisfaction above 90 with a real historical rating, first completed ambulatory operation, operational assigned Pharmacist. `nextFacilityLevel: null`. QI is secondary. | Retain these gates and connect their completion to L4 only when launch is integrated. Do not add an MRI, APP, new mastery or pediatric requirement before their own unlock. [B1] [R3] [P2] |
| L4 completion | Higher-level exact gates were originally deferred; L5 is optimization/prestige, not another clinical setting. | No stage 4, finish goals, completion witnesses or L5 runtime. Domain/types/save validators reject level 4; player says `Level 4 preview`. | Owner-approved L4 gate, persistent service evidence and a terminal prototype completion display; keep L5 locked. [D2] [B8] [R3] [R4] [P2] |
| Alerts, events and tips | Existing facility guidance should explain real systems and available remedies. No accepted L4-specific event catalog was located. | Reusable condition/event/guidance machinery exists; alert level types are 0-3 and ambient eligibility is explicit. Reading humor exists. Current tips cover L3 cap/current next-step behavior. | Widen level eligibility, add L4 setup/queue/family/upgrade/completion guidance, retain applicable older tips, deduplicate conditions, optional L4 ambient humor. No new clinical incident probabilities. [B9] [R5] [D6] |
| Clinical circulation | Pediatric and wound/ostomy semantic points; earlier concepts remain available when due. | Case `earliestFacilityStage` validation caps at 3, while concept stages allow up to 5. `releasePointId` exists as optional metadata; currently assembled cases use numeric/capability gates. Mixed release remains `synthetic_unapproved_prototype`. | L4 case validation and explicit semantic/operational gate enforcement across all admission paths, preserving legacy absent fields and old frozen cases. [C1] [C2] [R6] |

### Progression proposal, pending owner selection

**Unlock Level 4:** retain all current L3 primary requirements above and change
only its successor to 4. Current advancement resets current-level XP to zero;
retain that rule and existing completed operation/retired receipt evidence. An
old campaign that already meets the gates should see **Advance to Level 4** after
integration, not replay an operation or rehire its pharmacist. QI stays secondary
in/near the Advance area. [R3] [R11] [P2]

**Finish Level 4:** recommended draft gate is 750 current-level Clinical XP,
displayed satisfaction above 90, one operational assigned APP, operational
Pediatric Waiting, and durable witnesses for one completed onsite MRI with
interpretation, one pediatric visit with its parent, one routine wound-care
visit and one ostomy-support visit. This indirectly proves the other three
rooms and real service staffing. Scheduled operational visits may supply the
service witnesses; APP/scheduled work contributes **no Clinical XP**, FSRS,
mastery dates or fabricated scored responses. Scored cases supply XP through the
normal learning loop. These are proposed game goals, not clinical thresholds.

The MRI finish goal permits external interpretation; hiring a reader is a
useful existing L3 improvement, not a forced L4 unlock. No wound procedure,
sedation, inpatient case, L5 room, repeated mastery on three real dates, or new
content publication is required to finish this prototype. Use a single clear
`Level 4 complete - Level 5 coming later` state with continued play. If the owner
wants actual L5 advancement, scope its rooms/staff/inspection into a separate
plan; changing a cap to 5 does not implement that level.

Persist completion witnesses independently of live room existence and detailed
service history so compaction, archival, selling a room or a later catalog change
cannot erase earned milestones. Build/staff requirements are current operational
checks; completed-service achievements are historical checks. Store once-only
completion acknowledgement, and do not issue repeated rewards or level events
on reload. Existing L3 completed preview flags, if any, must not block advancement.

## Room integration contracts

Numbers in this section are either marked **existing/approved** or **candidate**.
Expense fields named `upkeepPerExpenseInterval`/`salaryPerExpenseInterval` are
presented in the existing game as hourly costs; preserve the current ledger
accrual/posting calculation rather than charging them once every minute or
misreading the legacy expense interval. Confirm the audit's unit interpretation
before accepting any new budget. [B1] [B4] [R11]

### Shared runtime/art contract

Promote the accepted native sprites, not stand-ins, HTML screenshots, historical
revisions or generated proof pages. Build a small reproducible asset/geometry
mapping with approval hashes and native anchor metadata. Proposed destination
is `apps/player/public/art/rooms/level4-v1/<room>/` with dedicated Level 4 proof
data/presentation helpers and manifest entries. Keep current render architecture;
avoid copying private lab controls or embedded data URLs into gameplay bundles.
Use existing approved chair, bench, sink, stool and curtain sources by reference.

Translate **active** `proof/design-rooms.js` records plus revision/presentation
contracts into production draw records, support roles and navigation. The frozen
`layout-baseline.json` and some `proof/data.json.navigation` entries deliberately
retain earlier coarse layouts; they are not the complete revised runtime
collision/seat model. Preserve native aspect ratio, ground/hip anchors, measured
base clearances, source scales, painter order, doorway ownership and backing
rules. Actors in proofs are examples; bind real runtime employees/patients and
parents instead of baking those named example characters into furniture. [G1]
[G2] [G3] [G4]

All four new proofs allow only orientation 0. Recommended initial runtime default
is the same locked orientation with a clear Build UI state. Enabling rotations
later requires tested transforms of every support, door exception, asymmetric
front armrest and layering rule; do not synthesize unreviewed mirrored furniture.
Every 4x4 room has 16 one-tile door segments; every 3x3 room has 12. All must
remain selectable with the approved explicit threshold exceptions. Optional
door-owned furnishings/overlays/occupants hide together; wall decoration follows
its owning north-backing segment. Floor shelves remain full height where the
approved proof requires it. [A1] [A2] [A3] [A4] [A5]

The pediatric proofs use fine footprint paths at 0.05-tile resolution with a
0.18-tile actor radius and separate walking approaches/static seat contacts.
Production routing uses grid approaches. Promotion must demonstrate real
walkable paths against the revised furniture and measured bases: neither
rounding seated contacts into obstructed integer tiles nor globally marking a
solid chair/table passable is acceptable. Prefer explicit standing approaches,
reserved support contacts and narrow owning-fixture seat transitions using the
current runtime pathing seams. If that cannot support the approved layouts,
return the specific geometry conflict to the manager before expanding the
pathfinding architecture. [G2] [G3] [G4] [B2]

For each new definition fill width/height, unlock level, buildability,
construction/upkeep, instance cap, upgrade catalog/costs, base workload,
dependencies, capabilities and approved navigation. Wire room inspector/build
catalog, staff slot/sale preview, access protection, cleaning/repair, activity
labels, finance, service catalog, texture preload, room shell, camera/zoom and
save load validation. No upgrade adds a new seat, provider or service capability.

### Radiology Reading Room - preserve existing Level 3 dependency

- **Definition:** existing `room.reading`, 4x4, L3, $1,800 build/$24 per hour,
  maximum four room instances; requires Front Desk. No patient workload capacity
  or build-time satisfaction bonus. Four real staffed positions per room, one
  active read per reader; existing radiologist definition/training retained.
  [B1] [B2] [B7]
- **Art/layout:** preserve green carpet, dim lighting, teal/ivory clockwise
  pinwheel, independently backed north segments and all 16 doors. Runtime art
  and source approval hash already exist. Preserve four distinct facing/seat
  contacts in `DIAGNOSTIC_READING_WORKSTATIONS`; do not re-promote the room under
  a new ID or gate any of its four seats behind upgrades. [A1] [B2] [P1]
- **Services/economy:** existing five-minute onsite interpretation base,
  external fallback and additive $5 local-read fee; idle outside work keeps
  $5/base five minutes with current priority/training/Reading modifiers. Saved
  split work still pays its frozen split, never another additive fee. MRI must
  use the current mechanism and never send the patient to the Reading Room.
  No new arbitrary morale or satisfaction effect. [D3] [B4]
- **Upgrades:** existing 10% less onsite reading time per purchase; costs
  $450/$675/$990/$1,350, cumulative 10/20/30/40%; $0 extra upgrade upkeep.
  Do not shorten acquisition or offsite reads through this ladder. [D4] [B3]
- **Tests:** L3 build/hire/save still works; every post retains its own actor and
  queue; two/four concurrent local reads; MRI/old imaging compete fairly;
  outside work yields without cancelling accepted work; additive versus old
  split receipts, upgrade/training freeze and preview/execution agreement.
  Reuse current Reading, dispatch and diagnostic timing tests. [H1]

### MRI Room

- **Definition proposal:** `room.mri`, 4x4, L4, $2,400 build/$24 hourly upkeep,
  cap two instances; one acquisition patient and one technician per room; base
  workload contribution 0, build satisfaction 0. Depend on Front Desk and
  reachable patient access. Use `capability.mri_machine`; add MRI to technician
  compatible homes, seat capacity, movement/assignment and training mappings.
  Hiring capacity must derive from physical compatible stations, not retain an
  accidental old three-technician cap. The onboard console is the approved
  operator station; do not revive retired Imaging Control adjacency. [B1] [R2]
- **Approved art:** nine assets in `mri/assets/prepared/`: gantry-side,
  table-empty, console, operator-chair, coil-cabinet, zone-sign, scan-light,
  open-shelves and comfort-cart. Retain original prompts/provenance; no occupied
  table with a baked patient, no old lockers or old operator orientation. [A2]
  [G1]
- **Registration:** active console ground `(1.12,2.14)`; tech/chair ground
  `(1.12,2.54)`, seated north with seat `(1.12,2.21)`. Empty table ground
  `(2.49,2.42)` enters the bore center. Patient west-facing hip contact is
  `(2.18,1.970390086...)`; patient painter depth places the real character in
  front of bed and gantry, legs off the west end. Use the actual active record,
  clipping and registration contract, not the preceding west-tech revision.
  Walking ends at its legal standing approach before seating. [G1]
- **Doors:** 16 segments; preserve east EB/EC gantry threshold exceptions.
  Coil cabinet owns N4/EA; sign N3; light N1; shelves S1/WD; cart S4/ED. Backing
  ownership is per approved active records, distinct from floor-object height.
  [G1]
- **Services:** scheduled baseline MRI plus exact eligible clinical MRI orders;
  candidate acquisition 60 game minutes from existing inert operation. Reader
  phase extension is a product decision, detailed below. Fee seed $240; one
  acquisition fee per delivered study and existing +$5 if an onsite reader
  completes it. Do not pay for accepting an order, forecast, reload or failed
  study; freeze upgrade/training prices and durations at the existing boundary.
- **Experience:** baseline benefit is actual onsite availability/turnaround and
  existing service-completion behavior; do not invent a new global satisfaction
  or morale multiplier. Reconcile existing experience conditions with MRI.
- **Upgrades:** activate accepted +6% MRI revenue per purchase, costs
  $600/$900/$1,300/$1,800; cumulative +6/12/18/24%; no approved speed or capacity
  increase. Candidate extra upgrade upkeep $0 until the audit settles it. [B3]
- **Tests:** all doors/backing and resource approaches; scan pose/foreground
  clipping; onsite/external interpretation, unavailable tech, busy/training
  queues, multiple MRI rooms, cross-cover with US/CT/X-ray, lawful route opt-in,
  distractor ETA parity, one-time income and save at every timing phase.

### Pediatric Waiting Room

- **Definition proposal:** `room.pediatric_waiting`, 4x4, L4, $600 build/$2 hourly
  upkeep, cap two; no required employee, revenue line, build satisfaction or
  staff morale bonus. Five ordinary seats and four under-10 stools are physical
  **actor** seats, not nine family slots or nine extra clinical workload slots.
  Ordinary seats can take children as well as parents; older children use them.
  Family capacity depends on age, pair reservations, visibility and reachability.
  Base workload contribution 0. [A3]
- **Approved art:** seven native sprites in `pediatric-waiting/assets/prepared/`:
  aquarium, kids-table, kid-stool, toy-chest, book-bin, animal-prints and
  wall-clock-kids. Reuse approved bench and three armchairs; promote both native
  front-armrest masks from `assets/derived/occluder-manifest.json`. [G2]
- **Registration:** use all nine supports in the active `design-rooms.js` and
  revision-2 contract, not its two-child preview occupancy count. West/east stool
  grounds `(1.49,2.66)`/`(2.51,2.66)` and north/south `(2,2.16)`/`(2,2.98)` retain
  measured child seat contacts and uniform source scale. Ordinary chairs include
  the older-child seat and spare parent seat. Each front wood mask follows its
  actual chair visibility and draws **chair, occupant, front armrest**. Preserve
  individual child height rather than scaling every child to adult height. [G2]
- **Doors:** 16 segments; fixed bench/armchair exceptions remain explicit.
  New east-facing chairs hide at WB and WC/WD, including their overlays and
  assigned supports. Larger toy chest faces east and hides WD/S1; book bin faces
  west and hides ED/S4; animal prints N3, clock N4, aquarium N1/WA. Production
  navigation must account for the added chairs and all four stools, absent from
  some frozen coarse fixture lists. [G2]
- **Operations/experience:** reserve a child and parent destination together;
  prefer another reachable pediatric waiting room when full; if no suitable
  seats remain, keep both at safe same-room standing places. A child/parent pair
  consumes one patient admission, with two rendered actors. Baseline seats and
  family waiting protect comfort/retention; no fabricated room entry fee. Do
  not require a pediatric wait room just to permit manual learning in an
  otherwise safe pediatric exam, unless the owner selects that gate.
- **Upgrades:** +2 satisfaction points for waiting families per purchase,
  $150/$225/$325/$450, maximum +8. Recommended attribution is once to the actual
  child's visit, not +2 to each actor, not stacking every waiting room or general
  Waiting bonus for the same wait. Candidate extra upkeep $0. [D4] [B3]
- **Tests:** age 9 versus 10 seat eligibility (owner's furniture rule, not a
  medical age rule), five ordinary/four kid supports, hidden-chair capacity,
  parent/adolescent pair occupancy, full rooms and alternate rooms, blocked
  doors, exact armrest ordering, same-room standing overflow, move/sell/reload,
  no duplicate experience and no adult-patient regression.

### Pediatric Examination Room

- **Definition proposal:** `room.pediatric_examination`, 3x3, L4, $600 build/$6
  hourly upkeep, cap four. One child care position, one provider stool and one
  same-room parent chair; no parallel second patient/provider. Base workload
  contribution 1 for a specialty patient, not another slot for the parent;
  build satisfaction 0. Require Front Desk/reachable care access; expose
  `capability.pediatric_examination`. Founder handles player-directed clinic
  encounters; assigned APP handles operational visits, subject to approved
  provider scope. A reachable room plus founder coverage can release manual
  pediatric content before an APP hire. [D2] [A4]
- **Approved art:** five `assets/processed/` sprites (peds-table, scale-counter,
  growth-chart, animal-print, toy-bin), reused parent chair, approved front mask
  and the derived `assets/derived/stool-backless.png` with its manifest. Use the
  condition-satisfied approval, not the earlier stool with a back. [A4] [G3]
- **Registration:** child east-facing seat `(0.66,1.25)`, ground `(0.66,1.6)` on
  the north-south table; clinician west-facing stool ground `(1.45,1.75)`;
  parent west-facing chair ground `(2.52,2.88)`, measured hip near
  `(2.653333333,2.509206349)`. Import the active source contacts/painter grounds;
  the whole clinician draws above the one complete backless-stool layer and the
  parent draws behind its front-armrest mask. Standing approaches are separate
  from chair/table contacts. [G3]
- **Doors:** 12 one-tile segments, three north backing segments, fixed table/
  chair pass-through exceptions; counter N3/EA, growth chart N2, print N1,
  toy bin S1/WC. Do not promote the superseded 16-door 3x3 proof. [A4] [G3]
- **Service:** existing $80/30-minute explicit appointment metadata becomes real
  clinical service delivery and a scheduled unscored baseline appointment stream
  (candidate every 90 game minutes). Parents follow into examination, results
  waits, allowed services and departure. See launch scope limits below.
- **Experience/upgrades:** ordinary visit experience is attributed to this room;
  +2 satisfaction points after visits per purchase, $150/$225/$325/$450, maximum
  +8, once per child visit. No satisfaction twice for manual chart and matching
  service completion; no new morale effect. Candidate extra upkeep $0. [B3]
- **Tests:** actual clinical admission to the pediatric room instead of generic
  Examination, real age/sex/art consistency, complete question task, parent
  following/reservation, founder versus APP occupancy, queues/training, exact
  backless/armrest layering, 12-door matrix, visit income/experience and save.

### Wound/Ostomy Clinic

- **Definition proposal:** `room.wound_ostomy`, 3x3, L4, $1,000 build/$8 hourly
  upkeep, cap two, one patient and one provider station, base specialty workload
  contribution 1, build satisfaction 0. Front Desk/reachable care dependency;
  `capability.wound_ostomy_clinic`. APP staffs routine clinic work; founder may
  cover explicitly authored player-directed visits. Peri-op Nurse is never a
  substitute. New clinical procedures require separate exact scope review.
  [D2] [A5]
- **Approved art:** five processed assets (wound-recliner, exam-lamp, ostomy-shelf,
  dressing-cart, hygiene-sign), plus reused sink, curtain, biohazard bin and
  native backless stool with `assets/reused/stool-contract.json`. The approved
  624x470 chair has **no leg rest**; retain transparent removed space/native frame,
  patient legs down and no clinical wound/body imagery. [A5] [G4]
- **Registration:** patient east-facing measured seat near
  `(0.628879310,1.488613506)`; clinician west-facing stool ground `(2.15,1.9)`.
  The active records/supports and `presentation-contract.json` distinguish
  furniture ground, patient registration and painter ground; copy their values
  as a coherent contract rather than normalizing these distinct fields to one
  coordinate. Clinician draws entirely above the stool. [G4]
- **Doors:** 12 segments and three north backings; retain WB treatment-chair
  threshold exception. Sink N1/WA; shelf N2/N3 and hygiene sign N3; cart S3/EC;
  curtain WC; bin S1/WC. Preserve full-height floor shelving on low north walls.
  [G4]
- **Services:** implement routine wound care and ostomy support using existing
  fee/work seeds; exact authored cases must opt into the matching service,
  not every case containing "wound" or "ostomy". Candidate wound cadence is
  120 minutes, ostomy 180, both 30-minute operational appointments. Keep the
  $120/45-minute wound-procedure entry inert until an exact reviewed eligible
  action exists. Add authorized wound supply outlet while preserving Pharmacy
  alternative, stock costs, idempotent dispensing and provider occupancy.
- **Experience/upgrades:** baseline benefit is delivered service/supplies and
  existing visit comfort; no new global morale bonus. +6% actual clinic service
  revenue per purchase, $250/$375/$550/$750, maximum +24%. Default does not apply
  this clinical fee ladder to unrelated Pharmacy/supply gross sales. Candidate
  extra upkeep $0. [D4] [B3] [B4]
- **Tests:** provider eligibility excludes peri-op nurses, service/action mapping
  excludes emergency transfer and procedure mismatches, wound/ostomy queues and
  cross-cover, supply authorization/payment/stock, chair/stool anchors and
  layering, all doors/backing, frozen revenue, once-only settlement and reload.

## New systems and runtime changes

### APP role and clinic automation

Add `staff.app`/`capability.staff.app` at L4 with candidate hiring $600, salary
$40/hour, adjustable $32-$64 in $2 steps, base morale 75 and existing morale/pay
rules. These borrow the GLP-1 NP scale as an economy proposal, not an approved
APP rate. Physical capacity is one APP home/provider post per eligible ordinary
Examination, Pediatric Examination or Wound/Ostomy room. Respect shared founder/
provider occupancy even if there is more than one employed APP; room upgrades
never create another post. Generic Examination capacity must not consume or
misclassify its founder seat while an APP is away. [B1] [R2]

| Provider/service | Recommended first-launch rule |
| --- | --- |
| Adult APP appointments in ordinary Examination | APP operates scheduled unscored appointments; player handles scored charts by default. |
| Pediatric appointments | APP operates scheduled unscored visits with age-compatible child and parent; founder may conduct approved player-directed visits. |
| Routine wound care and ostomy support | Assigned APP operates scheduled or exact authorized clinic visits; founder fallback only for deliberately defined manual care. |
| Existing minor-procedure routes preferring APP | Add APP as a reachable provider where the existing exact route already names it; keep founder fallback and scope. Do not make Minor Procedure an additional APP home until its post/capacity policy is selected. |
| Wound procedures, pediatric sedation/operations, specialist surgery | No new blanket scope inferred from role name or catalog row. Remain offsite/deferred unless separately reviewed and explicitly supported. |
| Imaging acquisition/read, Lab, Pharmacy, peri-op nursing, GLP-1 NP work | APP is not a substitute; existing role requirements remain. |

Implement home assignment, temporary cross-cover, fair dispatch, single-active-
task reservation, queues, wages, firing/sale capacity preview, morale/breaks,
training/queued departure and return, save load and named activity presentation.
Reuse current dispatch discipline: prefer a home's accepted work, permit reachable
cross-cover without stealing another accepted reservation, and distinguish
installed-but-training coverage from a missing service. [R2] [H1]

Training proposal: four tiers, existing 60-minute sessions/two training places,
prices $150/$300/$450/$600 and +10% APP appointment/clinic service revenue per
tier. Add a distinct metric/label; the existing `consult_payment` formatter is
GLP-1-specific and assumes a $50 consultation, so copying it would display the
wrong APP payment. Freeze the applicable APP benefit and room upgrade revenue
independently and combine according to the current multiplicative contract.
Training changes operational performance only, never clinical correctness,
permitted scope, teaching answer or mastery. Final metric/rates require owner
selection and economy reconciliation. [B7] [D4]

No eligible APP still is currently returned; tests explicitly expect this role
to be inactive. Add a role-compatible pool from existing approved provider art
with manager/owner visual metadata review, or identify the exact missing poses
before scheduling new art. Every hired APP needs distinct available identity,
standing/walking/seated poses and frozen persisted selection; never default to
an unrelated role or replace existing employee identities. [R1] [R10]

**Automation scope recommendation:** scheduled APP appointments and specialty
services deliver the L4 operational automation reward at launch. They are
service visits, not auto-answering unresolved learning charts; no FSRS review,
mastery variant/date, Clinical XP or learner completion is synthesized.
Mastery-based delegation of learning encounters is a separate optional
milestone, not silently enabled by adding `staff.app`. Canonical mastery requires
three correct responses on three real-world dates, two meaningful patient
variants and an FSRS interval of at least 21 days. No corresponding complete
runtime evaluator was found; a single correct answer or high training level
cannot stand in for it. [D5] [R2]

If the owner requires mastered-chart automation in the first launch, insert a
bounded learning-state milestone: audited campaign mastery/date/variant
evaluation, player opt-in, all nodes mastered, no overdue review stolen from the
player, no unopened new concept handled automatically, separate operational
records and cancellation/withdrawal behavior. Preserve existing reviews and
do not fabricate missing historical dates. That materially enlarges scope and
must be accepted before implementing it.

### Pediatric patients and parents

First-launch recommendation is authored **ages 5-17**, matching available art,
with one linked adult parent/guardian per child. This is a presentation scope,
not a medical eligibility claim; infants/toddlers need their own approved art
and authored cases before admission. Keep under-18 clinical age eligibility
separate from the owner-selected under-10 stool rule. Review the twelve child
stills' sex compatibility and age bounds rather than inferring them from
appearance or applying adult roster fallback. Freeze explicit age, sex, name,
child appearance, parent appearance and clinical profile with each admission.
No age/race/sex weights are invented for disease selection. [R1] [I1]

Implement a dedicated family relationship/reservation state with optional,
versioned fields that old saves can omit. Reuse companion actor/rendering
machinery, but not the procedural companion's independent amenity excursions.
The owner requires the parent in the same room as the child at all times:
check-in/waiting/examination/results/service trips/discharge. Parent does not go
alone for coffee, bathroom or supply shopping while the child remains behind.
No routine adult MRI, wound or other clinic visitor gains a companion merely
because pediatric family support was added. [D7] [R7]

Reserve child care/seat and parent seat or safe standing spot atomically; route
the pair together, coordinate doorway/room transitions and suppress independent
child trips. Waiting overflow sends the pair to another reachable room or
same-room standing places. They must remain together during stalled paths,
training waits, access loss, room moves/sales and save reload. A rendered actor
crossing a doorway must not leave its linked actor idling in the old room.
If a destination has no approved safe parent place, withhold that pediatric
onsite workflow and use its reviewed fallback. The parent consumes a physical
place, not a second patient/review/reward slot. [A3] [A4] [D7]

For this launch, default pediatric services to clinic evaluation/counseling and
reviewed referrals. Do not route children through adult MRI acquisition,
sedation, Endoscopy/OR, or wound-procedure workflows until same-room family
placement and appropriate clinical scope are approved. This preserves the
parent rule without inventing MRI-zone access or sedation supervision.
Any pediatric testing included in the authored batch must supply a reviewed
route/parent contract, including fallback; otherwise defer that case rather
than displaying a promise the runtime cannot fulfill.

### MRI acquisition, interpretation and service equivalence

Build on GS-034 `DiagnosticOrderPlan`/phase planning, current queue projection,
`getAnswerChoiceServicePreview`, service execution and chart ETA formatting.
The October 7 timing table explicitly names current US/duplex/X-ray/swallow/ABI/
CT/CTA interpretation; **it does not explicitly settle MRI acquisition or add
MRI to that table**. Recommended product default is the existing catalog's
60-minute MRI acquisition followed by the same 5-minute functional onsite read
or 30-minute external read. Owner acceptance must record that extension as
editorial game timing, not medical evidence. [D3] [B4] [B6]

Existing `service.breast_mri`, `service.mrcp`, `service.pelvic_mri`,
`service.liver_mri`, `service.extremity_mri` and repeat-MRI/MRCP rows have explicit
offsite contracts; generic `timing.test.mri` has a 180-minute timing profile but
no common onsite MRI route. MRI services are presently classified as specialist
work. Create an exact compatibility matrix recording which services/protocols
and clinical dispositions the ordinary scanner can fulfill. Start with reviewed
adult MRI/MRCP and extremity orders if their source scope supports equivalence;
breast, multiphasic liver, device-dependent, combined and repeat protocols must
not become onsite just because they contain "MRI". Preserve any explicit
external-only disposition unless the reviewed contract deliberately opts in via
the current onsite-equivalence seam. [B5] [B6] [R8]

Technician/room govern acquisition, a reader/Reading post governs onsite
interpretation, and result readiness waits for both. Walking, busy resources,
training and queues appear in the total estimate; unavailable installed staff
do not produce a made-up finite ETA. Forecasts do not allocate or mutate state.
Missing valid onsite acquisition falls back to the approved full offsite route;
missing a reader after onsite acquisition uses the selected external read
contract. Do not append interpretation twice to an inclusive external 180-
minute or other saved total. Old orders keep their exact plans even after MRI
construction, upgrades or a catalog revision. [D3] [R8]

Enable scheduled MRI visitors through the same resource and interpretation
engine, with visible acquisition/read/result/discharge activity. Add route IDs
to income mapping only for equivalent implemented work; retain the current
read fee contract and one-time payment witnesses. Tests must cover both the
clinical order and the scheduled baseline path, not just mocked capabilities.

### Wound/ostomy and pediatric clinic visits

Extend the existing service-operation machinery instead of adding a parallel
timer/revenue system. Scheduled nonlearning visits provide baseline service
income; clinical encounters bind the exact authorized service and corrected-
forward action once. Wound/ostomy case text or a room's existence does not itself
authorize a procedure or supply sale. Stable service/route IDs separate routine
care, ostomy support, a future wound procedure and an authorized supply basket.
Preserve emergency transfers and hospital-only dispositions. [B4] [D2]

Pediatric scheduled visits require demographics/child art and parent actors;
the current generic visitor appearance path is adult-oriented. Manual pediatric
charts need care routing to Pediatric Examination rather than automatically
using `room.examination`. Both visit classes need waiting/active/result states,
provider conflict handling, sensible operational follow-up, completion/departure,
experience attribution, service receipts and resumable save state. APP service
visits do not add pretend chart answers or mutate learning histories.

Shared outpatient resources need reachable-room selection and fair queues:
different rooms can run concurrently with different APPs, one APP can cover
only one place/task, and training/salary/room sales cannot leave orphan
reservations. New completion evidence survives retired history. Retain current
ordinary adult/endoscopy/peri-op companion and service behavior. [H1] [R7]

### Alerts, events, tips and player UI

Add concrete L4 guidance to existing cadence, suppression and target/action
contracts. Baseline launch tips should explain APP compatible homes/capacity,
family seats and age rules, MRI acquisition versus interpretation, external
fallback/unknown ETA, wound service versus procedure/supplies, actual upgrade
benefits and each completion goal's next real action. Tips must not recommend
future L5 rooms or inactive catalog actions. Keep applicable L0-3 guidance after
advancement. [B9] [R5] [D6]

Use condition alerts only for actual problems: blocked accepted MRI/clinic work,
unreachable assigned provider/destination, no safe family place, or existing
departure-risk criteria. A valid external route, normal queue, unbuilt optional
room, or next-level goal is not automatically an emergency. Record the current
target and remedy, resolve the occurrence when fixed, and use existing
deduplication/cooldown/global spacing. Family routing should prevent separation;
if recovery cannot restore it, present a concrete blocked-visit explanation,
not silently abandon the child. No new clinical hazard probabilities.

Emit one advancement event and one L4 completion milestone event. Optional
nonclinical L4 ambient humor may use installed-room/staff eligibility, but it is
not a launch blocker. Level-type expansion must include alert condition/ambient
types and level lists; merely adding 4 to GameState leaves alerts missing. Goals,
Build/Staff/Services, room inspector, wait estimates, activities, tooltip copy,
finance/day summary and narrow-screen layouts must agree with the domain. [B9]
[P2]

## Clinical content plan and safety gates

This worker researched **local artifacts only**. No new clinical claim has been
verified against outside sources, and no clinical teaching text is authored by
this plan. The topic suggestions below are a review queue, not approved answers,
clinical eligibility criteria or a sourced protocol.

### Existing reusable material and its limits

| Family/content | Local evidence and current scope | Launch use/limit |
| --- | --- | --- |
| MRI ordering | Existing extremity-mass MRI family (`concept.soft-tissue-mass.extremity-mri`) and pancreatic-cyst MRI/MRCP duct-assessment family; additional pelvic/liver/breast MRI external service contracts exist in balance. | Reuse unchanged currently admitted versions for adult learning and test approved operational equivalence. Do not rewrite their clinical answer to promote onsite capability. [C3] [C9] [B5] |
| MRI safety/science | October 7 variety radiology family includes `concept.imaging.ionizing-versus-nonionizing-modalities` and `concept.mri.device-specific-safety-verification`. It remains `needs_clinician_review` development-preview content. | Reuse only the existing prototype authorization and scope. Scanner construction/training does not create blanket device clearance or new safety teaching. [C4] [C2] |
| Wounds | `concept.superficial-incisional-ssi.open-drain`, `concept.fascial-dehiscence-evisceration.emergency-transfer`; wound-healing variety material also exists. | Preserve clinic/minor-procedure versus emergency-transfer distinctions. Emergency cases are not routine paid wound appointments. [C5] |
| Ostomy | Existing high-output ileostomy assessment/rehydration concepts and L3 peristomal-skin diagnosis/seal-care family. L3 batch uses generic clinic/minor-procedure release IDs, not an L4 clinic service. | Existing concepts remain available on their current schedule; add only reviewed new L4 presentation/service bindings, not a second FSRS card for the same meaning. [C6] [C7] |
| Pediatrics | No assembled L4 pediatric family was found; current adult still selection rejects children. A clinician-approved Meckel resection family is a **deferred Hospital OR** release, not a pediatric outpatient launch pool. | Author a bounded outpatient pediatric batch; never substitute adult ages or pull future hospital content into L4 to fill the gap. [R1] [C8] |
| Earlier clinician-approved/prototype material | The active release combines exact clinician-reviewed records with explicitly owner-delegated draft development batches and presentation revisions. Entire release remains `synthetic_unapproved_prototype`. | Preserve existing exact versions, permissions and distinction. "Approved for prototype use" is not a new clinical review status and does not mean safe for an approved public release. [C2] [I1] |

### Recommended bounded launch batch

Cap new authoring at **12 distinct Tested Concepts with two meaningful
presentation variants each** (24 variant targets), ordinarily one scored
decision per encounter. This is a planning cap, not a medical prevalence or
board-frequency claim. Review existing IDs before creating any: a useful
additional presentation of an existing concept counts toward the variant work,
not a duplicate concept/card.

- **Six pediatric outpatient concepts:** a clinician selects an outpatient
  hernia/abdominal-wall evaluation or referral family, a stable neck/superficial
  mass evaluation/referral family, and a postoperative clinic follow-up or
  escalation family, with two distinct teaching objectives per family. Exact
  topics, age profiles, safety boundaries and answers require clinician
  selection; no infant, hospital operation or sedation family is needed.
- **Four wound/ostomy concepts:** clinician selects routine follow-up, wound
  care planning versus referral, appliance/skin review and ostomy follow-up
  service boundaries. Prefer meaningful L4 presentations of existing compatible
  concepts; do not duplicate the peristomal/high-output/SSI cards or invent a
  wound-procedure indication to activate an unused fee.
- **Two MRI-ordering concepts/variants:** use gaps discovered in the existing
  adult ordering/safety map. Reuse existing MRI concepts where possible; only
  author a new concept if its learning objective is materially new. Operational
  ETA/room questions are management guidance, not new clinical claims.

The manager should approve an exact manifest of case/concept/version IDs,
release points, allowed routes, demographics, provider scope and prototype-use
authorization before adding this batch to the assembled owner preview. Every
new or changed AI-assisted record stays `needs_clinician_review`. Melissa/named
clinician approval must reference the exact version before clinical promotion.
If review cannot establish a suitable pediatric outpatient pool, report it as a
launch blocker instead of admitting unsourced children or claiming Level 4
clinical readiness. An implementation-only synthetic fixture is useful for QA
but not a replacement for the launch content pool.

### Required source/provenance work in the authoring milestone

- Use current government guidance, suitably licensed open-access literature and
  targeted professional-society guidance. Do not use textbook PDFs, UpToDate,
  AccessSurgery, commercial question banks/review products, proprietary SCORE
  modules or recalled ABSITE items. Verify access, license and AI/automated-use
  terms; PMC/public accessibility alone grants no reuse rights. No copied prose,
  algorithms, tables, figures, stems, explanations, stored article text or
  source excerpts. No inaccessible snippet evidence or placeholder citations.
- Each source has a stable ID, complete citation, journal/organization, authors,
  publication year, DOI/official URL, access date, source class, license/reuse
  status, intended evidence/cross-check use and supported claim IDs. Medical
  authority and reuse permission are separate fields.
- Every substantive statement, including chart summary and phenotype, maps to
  an independently written atomic claim with stable ID, supporting sources,
  category, certainty/limitation, last-checked date and review state. Prefer a
  current guideline plus independent management corroboration; record a
  single-source limitation and preserve conflicts for clinician decision.
- Do not invent exact clinical probabilities, age/demographic weights, vital
  thresholds, medication rules or timelines. New pediatric authoring helpers
  must not silently insert default **adult** vital signs; omit nonessential
  numbers or use exact reviewed child profiles with adequate sources. Prices,
  queue cadences and game minutes are separately labeled editorial settings.
- Keep concept/presentation/question/claim/source IDs and approvals connected;
  do not move existing clinically approved or earlier-release presentations to
  L4 just to populate new rooms. Due reviews need an eligible retained version.
- Shuffle runtime answers; maintain parallel answer grammar/category/specificity
  and length. Complaints usually 1-5 words; present the named child/adult with
  consistent age and sex; each separated question states the complete task.
  Show runtime wait estimates for every testing choice including distractors;
  do not hard-code facility durations into authored prose.
- Clinical external links use a safe new tab; all runtime content is packaged
  and deterministic. No AI generation, evidence retrieval or web calls during
  gameplay. Frozen saves/encounters retain exact content and operational plans.

These are AGENTS.md requirements, not optional release polish. Source research
and clinician review belong to a later specifically authorized content lane;
this planning brief forbids web. [I1]

## Economy: provisional worksheet awaiting concurrent audit

Owner principle: **"upkeep offset by the baseline function of the rooms"**.
Base rooms should be useful before purchasing upgrades; requiring upgraded
fees or unrelated GLP-1 income to subsidize a routinely used specialty room is
not the default. Money proposals here are software simulation settings only.

| Item | Initial candidate/retained seed | Baseline function and check |
| --- | --- | --- |
| Reading | Retain $1,800/$24 upkeep, reader $300/$26 salary, $5 outside read/base five minutes. | Existing quiet full-availability baseline is 12 reads x $5 = $60/hour against $50 room plus one salary; actual breaks/training/local-read replacement must be measured. Do not alter accepted fees in this plan. [B4] |
| MRI | Candidate $2,400/$24 upkeep; existing technician $300/$26; retained seed $240, 60-minute acquisition, one scheduled opportunity per 240 minutes. | Ideal accepted scheduled demand gives $60/hour against $50 dedicated room plus technician. Reading cost/income is an incremental separate contract. |
| Pediatric Waiting | Candidate $600/$2 upkeep; no direct revenue. | Baseline seats/family waiting support pediatric clinic throughput/retention. Charge its upkeep to the paired pediatric service budget, with attributed comfort/retention evidence; do not invent a waiting fee. |
| Pediatric Examination | Candidate $600/$6 upkeep; APP candidate $600/$40; fee seed $80, 30-minute visit, proposed 90-minute cadence. | Ideal $53.33/hour versus $48/hour for APP + examination + pediatric waiting; measure real paired routing/waits before accepting that small margin. |
| Wound/Ostomy | Candidate $1,000/$8 upkeep; APP $40/hour; retain wound $60/30 minutes, ostomy $75/30 minutes; propose wound every 120 and ostomy every 180. | Combined ideal $55/hour versus $48/hour room + APP. Visits must share the one provider/seat; do not promise a separate provider for each line. |
| General APP appointment | Existing ordinary Examination; $80/30-minute seed, proposed 90-minute demand. | Ideal $53.33/hour offsets one $40 APP plus actual Examination upkeep; avoid billing the same encounter again as pediatric/wound care. |
| Wound supplies | Retain catalog $20 gross/$10 stock, authorized two-minute dispense. | Optional real purchase margin, not required assumed demand or a second charge on every care visit. |
| New-room upgrades | Keep GS-038 accepted benefits/prices; candidate incremental upkeep $0. | No future per-tier upkeep was approved. Do not infer a charge from adjacent current rooms. |

These rates are **isolated theoretical upper bounds**, not an economy finding.
The existing service scheduler has global 30-minute arrival spacing and a limit
of two waiting external visitors; several clinics share provider/visitor
capacity. Their combined target cadences cannot all be assumed realized.
Advertising, staff breaks/training, interrupted work, walking, other scheduled
services, service refusals, supplies, multiple copies and salary adjustments
also matter. Audit baseline operation in a representative staffed L4 facility,
not just fee divided by duration or passive income with no visible work.
Recommended fix is per-operational-room demand/fair dispatch within measured
arrival capacity, preserving normal gameplay, rather than increasing all fees
to hide a scheduling bottleneck. That scheduling change is a manager decision
if it broadens the existing architecture. [R9] [H1]

The audit must resolve:

1. Hourly units/accrual and which present catalog fees/work times are already
   owner-approved versus placeholders; current Reading contracts are retained.
2. New build/upkeep/salary/training/instance-cap values, cash buffer at the L3 to
   L4 transition and time to first functioning service, without requiring restart.
3. Real baseline margins including linked waiting rooms, allocated shared staff,
   clinical versus scheduled work, parent routing, staffing downtime and supplies.
4. Demand scheduling and per-room fairness, especially pediatric explicit-only
   metadata and competing wound/ostomy lines. No exact demand probability is
   implied by a clinical diagnosis or art demographic.
5. Honest finance previews and any new consumption costs; clinical correctness
   rewards remain separate from baseline service revenue and APP automation.

Do not accept these candidates into the final release before the audit lands
and the manager reconciles it with owner decisions. Economy tuning must not
retroactively change saved quoted payments, phase timings or earned progress.

## Bounded implementation milestones for the manager

Default worker is **GPT-6.1 Sol at max**; Luna is suitable only for rote extraction
or already specified checks, not systems/content judgment. Only the Claude
manager dispatches workers. Workers do not spawn agents, change durable
planning, install, commit/push/deploy/publish or message other threads without
explicit brief authorization. Each brief names this plan, owned paths/hunks,
requirements/non-goals, exact checks, clinical rules and shared-tree notice.
The manager inspects the actual diff plus output before accepting the handback.

Dependencies: `M0 -> M1 -> M2 -> M3 -> M4 -> M5 -> M6 -> M8 -> M9`.
`M7` content authoring can proceed after M0/M1 in a disjoint batch lane, but its
assembly occurs only after M4/M6 and manager scope review. Submilestones below
are separate bounded dispatches, not one worker told to implement all Level 4.
Shared source ownership is released before the next overlapping milestone.

| ID and worker milestone | Owned lane | Dependencies and non-goals | Acceptance and exact validation |
| --- | --- | --- | --- |
| M0 - Manager resolves launch contract and economy handoff | Manager-owned coordination/this plan and decisions, no gameplay worker edit | Receive concurrent audit; select decisions below; inventory exact approval hashes and current handoff. No room redesign or automatic clinical approval. | Record prototype scope, provider map, proposed values accepted/changed, L3/L4 gate and MRI equivalence list. A future worker can implement without guessing. Planning checks only. |
| M1 - L4 types, schemas and compatibility foundation | `packages/balance-config/src/schema.ts`; `packages/clinical-content/src/schema.ts`; `packages/game-domain/src/types.ts`, narrow `persistence.ts` and corresponding schema/save tests; alert level types only where necessary | M0. Extend level 4 support and optional specialty/family/completion contracts. Keep shipped cap/advancement at 3 until final integration. No new content assembly, service behavior or broad persistence rewrite. | Accept old L0-3 saves unchanged, support L4 round trips in test contexts, reject malformed new state, preserve frozen diagnostic plans/receipts and actor identities. Run V1, V2/V3 focused schema/persistence checks and V5. |
| M2 - Approved art, support and navigation promotion | Four sequential subjobs: MRI; pediatric waiting; pediatric exam; wound. Each owns its new public asset directory and new per-room presentation/data/tests; narrow reviewed hunks in `bitmapAssetManifest.ts`, `approvedRoomPresentation.ts`, renderer/`FacilityScene.ts`, facility types and `approved-room-layouts.ts` | M1 and approved art hashes. One write-capable room worker at a time because shared renderer/nav files overlap. No generation, restyling, base economy, actors/state-machine or Reading changes. | Native source/approval mapping, exact dimensions/doors/backs/supports, no baked example actors, fine-to-grid pathing demonstrably viable. Valid empty/occupied live scene for each room. Run V1 approved-layout tests, V4 focused art/room checks, V5; manager performs V8 browser/zoom and source-hash review. |
| M3 - Four definitions and active upgrade ladders | `prototype-balance.ts`, `room-upgrades.ts` and their tests; domain upgrade experience/revenue/support consumers, room-capacity/spatial consumers and focused tests; narrow Build/inspector/upgrade view models | M2, economy values from M0. Add exactly four L4 rooms and accepted ladders in test contexts while live cap stays 3. No APP/service queue implementation or Level 5 activation. | Build/access/caps/sales work; Waiting family/Exam visit effects are once-only and don't stack across copies; MRI/wound revenue effects freeze to room used; no capacity/speed increase. Remaining five future ladders neutral. Run V1, V2 targeted room/upgrade/capacity, V4 corresponding UI, V5. |
| M4 - APP hiring, service appointments and training | Subjob M4a owns balance role/training rows, domain `room-capacity.ts`, `staff.ts`, appearance/eligible still metadata, training effects and tests; M4b owns ordinary APP service/provider/dispatch implementation, service catalog/operation seams, Staff/Services/activity view models and tests | M3; exact M0 provider/automation contract. Serial shared source edits; no child family runtime, MRI timing, clinical authoring or invented mastery. | APP hires only with physical compatible capacity, assigned room/provider conflicts are real, scheduled adult appointments run and pay, two APPs can work separately, cross-cover/training/sale/load safe, no XP/FSRS/mastery mutation. Training labels reflect actual service fee. Run V1 training/catalog, V2 staff/dispatch/service/training/persistence, V4 staff/activity/service previews, V5; manager V8. |
| M5 - Pediatric identity, paired movement and visits | M5a owns pediatric eligibility/demographics/still compatibility and tests; M5b owns new `pediatric-family` module and narrow reducer/travel/companion/reservation/persistence seams; M5c owns pediatric appointment/manual care routing, player child/parent supports/activity and tests | M4 and M2 pediatric geometry. Each is bounded/serial across shared files. No adult roster reselection, procedure-companion policy reversal, infant art, pediatric MRI/sedation or broad new pathfinder. | Real ages/sex/names and child art, age 9/10 seats, one patient/two actors, same-room parent invariant including overflow, door crossings, services, blocked paths, move/sell/reload; manual/scored and scheduled/unscored visits finish once. Run V2 family/appearance/visit/save, V3 schema profiles, V4 room/layering/chart/activity, V5; manager V8 pair-flow matrix. |
| M6 - MRI and wound/ostomy services | M6a MRI owns exact route/profile/income mapping in balance, domain diagnostic planning/order/result/operations/reading seams and related player ETA/activity/tests; M6b wound owns clinic service/action/supply bindings, provider dispatch, retail/exposure and tests | M4; pediatric support optional but unsupported child MRI must remain excluded. Sequential ownership of shared `service-operations.ts`/selectors. No generic MRI string mapping, new clinical prose or activation of unsupported wound procedure. | Scheduled and actual chart orders run through real rooms/staff; MRI result follows read and preserves external contracts; clinic visits/supplies settle once; protected care, queues/training, additive read fees and saves agree. Run V1 timing/catalog, V2 diagnostic/reading/clinic/retail/save/dispatch, V4 ETA/service/activity/finance, V5; manager V8. |
| M7 - Bounded clinical batch and release manifest | First authoring subjob owns only new `packages/clinical-content/src/development-batch/<dated-level4>/` and review/provenance artifact lane named by manager. Later integration subjob owns `index.ts`, `synthetic-content.ts`, new semantic eligibility helper and admission/availability tests | M0/M1 for research; M4/M6 exact rooms/services for assembly. Future web/source research needs explicit authorization under source rules. No proprietary inputs, old approved-family rewriting or promotion from tests. | At most planned 12 concepts/24 variants; exact topic/age/provider scope reviewed, full source/claim maps, all drafts `needs_clinician_review`, prototype authorization manifest, L4 operational release gating, no stranded old due reviews/duplicate concepts. Run V3 plus V2 admission/FSRS/provenance and V5. Clinician/owner gates are recorded separately from test PASS. |
| M8 - Progression, economy reconciliation and guidance | M8a balance cap/stages and domain selectors/reducer/retired-service witnesses/save tests; M8b progression/clinic finance/tips/alert conditions/catalogs and Goals/Advance/Build/Staff/Services player view/tests | M3-M7 accepted; audit final values and M0 gate selections. No Level 5 implementation or deployment. Integrate current concurrent staffing/Reading fixes, do not revert them. | Old L3 gates advance to L4; new service evidence survives archival/reload; goals impossible without services stay incomplete; terminal L4 completion/no L5 advance; no automated XP; L4 tips only real actions; actual baseline economy/arrival fairness validated. Run V1-V6, focused goal/guidance/history/finance tests; manager V7/V8. |
| M9 - Integrated launch QA and manager acceptance | Worker owns new L4 QA fixtures/tests only, supplied synthetic old-save fixture lane and logs named in brief; manager owns browser/ordinary-config runs, source diff review, clinical permission review, final coordination handoff | All accepted milestones. Disposable QA state only; no owner-save injection or source changes outside a separately assigned fix milestone. | Clean fresh campaign path plus existing mature L3 -> L4 -> completion, mixed services/queues/training/rooms/upgrades, phase saves, full facility zoom/narrow views, real parent invariant, no errors, audited baseline economy, correct prototype notice. Run V1-V8 aggregate and targeted L4 E2E. Known pre-existing failure is rechecked/documented, not called green. Owner acceptance and any later GitHub backup are manager actions. |

If mastered-chart automation is selected, insert **M4c** after M4a: narrow new
campaign mastery/delegation module, immutable date/variant evidence and separate
operational encounter records with tests; manager owns its product contract.
Do not bundle it into a role-definition patch.

### Exact validation command catalog

Commands below are **future implementation validation**, not tests run during
this planning turn. Focus each worker run on its actual changed files and
behavior; broaden only at integration or for failures. Replace a proposed new
test name only with the actual path agreed in that worker brief.

```powershell
# V1 - balance, current plus newly added L4 definitions/timing/training/ladder tests
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1

# V2 - domain behavior/save/queue/learning regressions
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

# V3 - content/schema/provenance/answer and presentation validation
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1

# V4 - player view models, art/layering, controls and finance
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1

# V5 - all workspace types and boundary/launcher contracts
npm.cmd run typecheck
npm.cmd run test:boundaries

# V6 - production compilation without publishing
npm.cmd run build

# V7 - manager ordinary configuration aggregate
npm.cmd test

# V8 - manager integrated browser checks, plus newly authored L4 spec
npm.cmd run test:e2e -- tests/e2e/level-three-goals.spec.ts tests/e2e/reading-room-radiologists.spec.ts tests/e2e/facility-diagnostic-timing.spec.ts tests/e2e/room-upgrades.spec.ts tests/e2e/level-four.spec.ts
```

For focused work use the same workspace command with actual test paths after
`--`, e.g. current domain `tests/level-three-goals.test.ts`,
`tests/room-capacity-sales.test.ts`, `tests/diagnostic-timing.test.ts`,
`tests/diagnostic-timing-persistence.test.ts`, `tests/room-upgrade-reading.test.ts`
and `tests/staff-dispatch-fairness.test.ts`. Do not change assertions solely to
meet new catalog counts; test actual L4 behavior and remaining future neutrality.

Workers in the unelevated environment may hit player Vite native-loader or
browser/default-pool `spawn EPERM`; follow the already reviewed manager fallback
configuration preserving production plugins, and report exact command/logs.
Do not install browsers/dependencies or silently remove plugins. Manager reruns
ordinary configurations and browser checks in its own environment. Existing
handoff records `surgeryCenterServicePreviews.test.ts:85` external-thyroid pending
label as an unrelated player failure; establish its current baseline again,
report failures honestly, and route any necessary fix separately. [H1]

Proof validators/reproduction scripts often write evidence or rebuild private
files. Later art workers may run them only if their brief explicitly owns those
outputs; planning does not run them. Approval hash/source audit is read-only.
Offline rendering/native validation does not replace live game actor/pathing QA.

### End-to-end acceptance scenarios

1. Load synthetic representative L3 state including existing Reading/radiologists
   and in-flight old offsite orders. Before integration it cannot enter L4;
   after integration current earned gates allow advancement, XP resets once,
   records remain stable. Nonqualifying campaigns retain truthful missing goals.
2. Build all four rooms with all legal doors/backings and approved anchors.
   Verify locked orientation, build costs/caps/undo, access, cleaning/repair,
   staffing assignment and sale previews. Compare empty and staffed states to
   source approval, including backless stools, parent armrests and upright chair.
3. Hire multiple APPs/techs/readers, run concurrent general/pediatric/wound/MRI
   service work, cross-cover and training. No actor works twice, no accepted job
   loses its home resource unfairly, salary/finance match, and absence/unknown ETA
   is visible. Clinical truth and answers remain unchanged.
4. Child ages 5, 9, 10 and adolescent: real child art and demographics, stools
   versus ordinary chairs, parent always linked, overflow/other waiting room,
   safe approach/door crossings/exam placement/standing fallback and departure.
   Block a door, move/sell a room, reload each stage; no separated/orphan family.
5. Submit a real adult MRI ordering chart, inspect all distractor estimates,
   accept onsite work, queue acquisition then local/external read and verify
   result/actionability at the quoted time. Repeat with two scanners/readers,
   training, old external-only protocol and saved pre-MRI order. Fee and +$5 read
   occur once at their proper delivery boundaries, no duplicate legacy split.
6. Complete exact routine wound and ostomy chart/service visits; dispense an
   authorized supply basket through clinic and Pharmacy alternatives, retain
   stock costs, reject unreviewed procedure/ineligible emergency bindings.
7. Buy each accepted upgrade tier and APP training, inspect incremental/current
   labels, actual fee/experience/phase effect, different room copies and save
   freeze. No capacity increase, global bonus stacking or L5 activation.
8. Receive and answer bounded L4 clinical variants; older due reviews remain
   eligible, future/draft-not-authorized cases excluded, FSRS updates once per
   scored node, scheduled/APP work never changes learning state. Presentation,
   age/sex and all testing choice estimates are complete.
9. Meet all L4 finish witnesses plus XP/satisfaction, acknowledge completion,
   reload/archive detailed histories and continue play. L5 remains locked and
   the completion event/rewards do not repeat. Check fresh campaign tutorial
   progression and earlier patient/companion flows for regression.
10. Simulate representative baseline L4 demand, costs and service dispatch with
    no upgrades, then mixed mature services and downtime; audit realized margin,
    queues and cash buffer. Browser checks include 1x/4x, long-run save/reload,
    normal/wide/minimum zoom, desktop/laptop/phone and no console/page/asset errors.

Owner play remains **`START_GAME.cmd` -> `http://127.0.0.1:4173`** in the usual
persistent profile. Manager browser QA must use disposable storage; the existing
QA origin `http://127.0.0.1:5183` is separate from owner saves, and automation may
choose another loopback port through the existing runner. Record actual
`location.origin` and profile/context for each run. Isolated proof origin 4191
is for design review, not the owner's campaign. Remote playtest
`https://melissarowlandc-afk.github.io/GamifySurgery/` also has separate saves.
No pathway change is proposed. [I1] [H1]

## Owner/clinician decisions - recommended defaults

Only the manager takes these to the owner; this planning worker does not seek
approval or dispatch implementation.

| Decision | Recommended default | Needed before |
| --- | --- | --- |
| Launch boundary and progression | Launch L4 in current explicitly unapproved prototype; retain L3 gates, proposed L4 750 XP/>90 satisfaction plus real specialty completion witnesses; show L4 complete and keep L5 locked. | M0/M8; numerical game goals require owner acceptance. |
| APP scope and automation/training | APP homes in ordinary/pediatric exam and wound clinic, one provider post each; scheduled unscored service automation at launch, manual scored charts stay with player; defer mastered-chart automation; candidate +10% appointment/clinic fee training. | M0/M4; clinician confirms exact manual/procedure scope, owner chooses automation/training direction. |
| Pediatric launch population/parent policy | Ages 5-17 matching current art, one parent/guardian, under-10 stools, pair always same room; outpatient exam/referral scope; defer infant art and pediatric MRI/sedation/procedure flows. The same-room rule and stool cutoff are already approved. | M0/M5/M7; clinician selects exact cases/profiles; review art sex/age metadata. |
| MRI operational equivalence/timing | Ordinary scanner, existing technician/Reading systems; seed 60 acquisition + 5 onsite/30 external read as editorial extension, reviewed adult MRI/MRCP/extremity routes first, preserve all old/external-only protocols; no retired Imaging Control requirement. | M0/M6; owner accepts timing extension, clinician/content reviewer confirms exact equivalent protocols. |
| Content batch/use permission | Reuse unchanged currently authorized material; bounded 12-concept/24-variant target, mostly pediatric plus room-specific wound/ostomy and MRI gaps; all new AI records `needs_clinician_review`, exact owner prototype manifest before assembly. | M7; clinician selects/approves exact versions before any clinical promotion. |
| Economy and capacities | Start with the explicitly provisional worksheet, zero extra future upgrade upkeep, physical staff seats, room caps MRI2/Pediatric Waiting2/Pediatric Exam4/Wound2; finalize against concurrent audit and realized baseline throughput. No direct waiting fee. | M0/M3/M4/M8; owner selects material changes identified by audit. |

Reading's L3 unlock, four seats, accepted current costs, approved room designs,
removed Call Room and accepted GS-038 future ladders need **preservation**, not
another design approval. Ordinary implementation within the selected launch
contract proceeds through bounded worker briefs. Public clinical release,
deployment/Pages and GitHub push remain separate authorization scopes.

## Progress, discoveries, and next action

- [x] Read repository instructions and current handoff; local-only research with
  no Git/web/install/browser/owner-save actions.
- [x] Confirm Reading is already L3 in balance, geometry, art, queues and upgrades.
- [x] Inventory four missing L4 room definitions, APP, child eligibility/family
  flows, inert service/ladders, clinical gates, progression cap and save/UI seams.
- [x] Record accepted art contracts and the fine-routing/coarse-runtime mismatch.
- [x] Identify reusable adult MRI/wound/ostomy draft families, absent L4 pediatric
  batch, deferred Hospital OR content and exact clinical-review restrictions.
- [x] Define provisional economy worksheet, worker lanes/dependencies, acceptance
  matrix and commands; economy audit absent at read time.
- [x] Write and read back this plan as UTF-8 without BOM; validate local citation
  targets and single intended output. No game correctness or browser PASS claimed.
- [ ] Manager reviews plan, reconciles current shared tree and economy audit,
  selects owner decisions, then briefs M1. Workers reread this plan/current files
  at every handoff; larger discovered changes return to manager coordination.

This planning artifact is local only. The manager owns final acceptance and the
current-thread handoff update. At a substantial validated implementation
checkpoint, remind the owner to say **"push to GitHub"** for a scoped audited
backup; neither this plan nor a worker handback implies a remote backup.

## Local evidence references

Line anchors refer to the local source snapshot researched October 8, 2026;
concurrent edits may move them. Follow stable IDs/function names as well as lines.

[I1]: ../../AGENTS.md
[H1]: ../handoffs/CURRENT_THREAD_HANDOFF.md
[D1]: ../../ROADMAP.md#L290
[D2]: ../features/facility-levels-and-clinical-release-points.md#L160
[D3]: ../features/diagnostic-timing-future-design.md#L11
[D4]: gs038-all-room-upgrades.md#L410
[D5]: ../../CANONICAL_DESIGN.md#L372
[D6]: ../design/guidance-tips-proposal.md#L46
[D7]: owner-requests-20261008.md#L32
[A1]: ../../tools/room-design/level-4/radiology-reading/approval-2026-10-07.md
[A2]: ../../tools/room-design/level-4/mri/approval-2026-10-07.md
[A3]: ../../tools/room-design/level-4/pediatric-waiting/approval-2026-10-08.md
[A4]: ../../tools/room-design/level-4/pediatric-exam/approval-2026-10-08.md
[A5]: ../../tools/room-design/level-4/wound-ostomy/approval-2026-10-08.md
[B1]: ../../packages/balance-config/src/prototype-balance.ts#L585
[B2]: ../../packages/balance-config/src/approved-room-layouts.ts#L351
[B3]: ../../packages/balance-config/src/room-upgrades.ts#L65
[B4]: ../../packages/balance-config/src/service-income-catalog.ts#L7
[B5]: ../../packages/balance-config/src/prototype-balance.ts#L1134
[B6]: ../../packages/balance-config/src/diagnostic-timing.ts#L9
[B7]: ../../packages/balance-config/src/employee-training.ts#L40
[B8]: ../../packages/balance-config/src/schema.ts#L501
[B9]: ../../packages/balance-config/src/prototype-alerts.ts#L29
[P1]: ../../apps/player/src/facility/approvedReadingRoomData.ts#L4
[P2]: ../../apps/player/src/session/viewModels.ts#L2411
[R1]: ../../packages/game-domain/src/characterStillCatalog.ts#L147
[R2]: ../../packages/game-domain/src/room-capacity.ts#L7
[R3]: ../../packages/game-domain/src/selectors.ts#L1466
[R4]: ../../packages/game-domain/src/persistence.ts#L2848
[R5]: ../../packages/game-domain/src/guidance-progression.ts#L31
[R6]: ../../packages/game-domain/src/routine-patient-availability.ts
[R7]: ../../packages/game-domain/src/procedure-companions.ts#L14
[R8]: ../../packages/game-domain/src/diagnostic-timing.ts#L54
[R9]: ../../packages/game-domain/src/service-operations.ts#L46
[R10]: ../../packages/game-domain/src/characterStillCatalog.test.ts#L287
[R11]: ../../packages/game-domain/src/reducer.ts#L6194
[G1]: ../../tools/room-design/level-4/mri/proof/registration-contract.json
[G2]: ../../tools/room-design/level-4/pediatric-waiting/proof/revision-contract.json
[G3]: ../../tools/room-design/level-4/pediatric-exam/proof/presentation-contract.json
[G4]: ../../tools/room-design/level-4/wound-ostomy/proof/presentation-contract.json
[C1]: ../../packages/clinical-content/src/schema.ts#L305
[C2]: ../../packages/clinical-content/src/synthetic-content.ts#L1096
[C3]: ../../packages/clinical-content/src/development-batch/2026-09-09/soft-tissue-mass.ts#L24
[C4]: ../../packages/clinical-content/src/development-batch/2026-10-07-variety/radiology.ts#L31
[C5]: ../../packages/clinical-content/src/development-batch/2026-09-17-bread-and-butter/postoperative-wounds.ts#L22
[C6]: ../../packages/clinical-content/src/development-batch/2026-09-17-bread-and-butter/high-output-ileostomy.ts#L21
[C7]: ../../packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts#L60
[C8]: ../../packages/clinical-content/src/approved-data/meckel-resection-extent.ts#L89
[C9]: ../../packages/clinical-content/src/development-batch/2026-09-11/pancreatic-cyst.ts#L83

## M0 owner decisions (2026-10-08, binding; recorded by the manager)
1. Finish Level 4: 750 current-level Clinical XP, displayed satisfaction above 90, at least one operational assigned APP, one completed pediatric visit (with parent), one completed wound/ostomy care visit. (No MRI or Pediatric Waiting completion requirement.)
2. APPs: autonomous revenue staff. The founder does not see a question for most APP work. Players can build multiple exam rooms and hire multiple APPs who generate clinic revenue through "appointments in clinic": additional walk-in/off-the-street appointment visitors, unscored, no Clinical XP/FSRS. APPs staff ordinary Examination Rooms, the Minor-Procedure Room, Pediatric Examination Rooms and the Wound/Ostomy Clinic.
3. Pediatric population and parent policy: accepted as recommended (ages 5-17 with current art, one parent always in the same room, under-10 stools, outpatient visits only).
4. MRI: accepted as recommended (ordinary scanner, existing technicians/readers, seed 60 min acquisition + 5 min onsite / 30 min external read, fee $240); timings are editorial game values pending review.
5. Content: a NEW pediatric question batch is required (authored in the owner's established question style), all records needs_clinician_review per AGENTS.md.
6. Economy/capacities: accepted as recommended, except MRI room limit equals the other imaging room types' limit. Prices follow the economy audit's option B.

## Pediatric question batch

Worker: pediatric content Sol; bounded authoring handoff, 2026-10-08.

Completed a standalone **10-objective / 20-variant** batch in
`packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/`.
It contains **9 new concept IDs**, **1 unchanged reused concept ID**, **20
one-decision cases**, **45 atomic evidence claims**, **12 eligible source
records**, **20 case-review envelopes**, **20 constrained child/parent
contexts**, **20 field-level claim mappings**, and **20 no-test timing entries**.
All authoring records remain `needs_clinician_review`, AI-assisted, with no
named clinician sign-off. No active release, global exports, global timing,
patient generator, existing encounter or save was edited by this worker.
Tests are technical/editorial/provenance checks, not clinical approval.

### Concepts

Every objective has two new variants. Chief complaints have 1-5 words, each
presentation begins with the named child and explicit age/sex, and one named
parent remains in the same room throughout. Every question states its task,
includes a teaching point and explains every choice. Review artifacts show the
key first with an explicit label; all runtime-shaped nodes shuffle answers.

| Concept ID | Objective | Identity |
| --- | --- | --- |
| `concept.pediatric-clinic.inguinal-hernia-referral` | Child-specific groin-hernia referral based on clinical findings | New |
| `concept.umbilical-epigastric-hernia.clinical-recognition` | Recognize a focal epigastric defect anatomically | Reused unchanged from the 2026-09-28 batch; preserve FSRS identity |
| `concept.pediatric-clinic.reactive-neck-node-observation` | Observation, reassurance and safety net for uncomplicated nodes | New |
| `concept.pediatric-clinic.concerning-neck-node-referral` | Early pediatric assessment of concerning nodes while cause remains uncertain | New |
| `concept.pediatric-clinic.acquired-testis-ascent-referral` | Assessment of a previously scrotal testis that no longer stays down | New |
| `concept.pediatric-clinic.true-retractile-testis-surveillance` | Documented surveillance of a strictly defined true retractile testis | New |
| `concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation` | Specialist evaluation of exertional symptoms before treatment selection | New |
| `concept.pediatric-clinic.pectus-carinatum-brace-assessment` | Individualized specialist brace-suitability discussion | New |
| `concept.pediatric-clinic.limited-pilonidal-conservative-care` | Conservative care and reassessment of limited non-abscess disease | New |
| `concept.pediatric-clinic.developmental-assent-discussion` | Child explanation, questions and assent during nonurgent family discussions | New |

Cases are ages 5-17 with exact age/sex taken from authored pediatric art metadata
in `tools/character-mapping/level3-roster-complete-v2/roster.json`; no visual,
race or ethnicity inference or disease-selection weights were used. Testicular
profiles remain male. Neck-node cases are younger than 16, within the source's
stated pathway. Educational tier (0/1), acuity (stable/urgent-stable), L4 facility
progression, clinic setting and pediatric-examination capability are separate.
There are no authored vitals, adult defaults, tests, wait durations, result
gates, sedation, pediatric MRI or procedure/recovery flows. Wrong options are
rejected proposed plans, not source-endorsed actions or enacted services.

### Sources and provenance

Complete bibliographic metadata, authors, publication/review date context,
DOI/official URL, access date (2026-10-08), actual license/reuse conditions,
authority assessment, intended evidence/cross-check role and supported claim
IDs are in `source-catalog.ts`. `evidence-claims.ts` contains independently
worded atomic claims, limitations, population, check date and review status.
`statementMappings` traces presentation, stem, explanation, teaching point and
each individual choice/rationale to claims; source/claim mappings are reciprocal.

- `source.pediatric-clinic.cornwall-surgery-2025`: NHS Cornwall pediatric
  referral pathway, Faux/Burns, version 1.2, partial update May 2025. The
  displayed May 2026 review date is not assumed completed.
- `source.pediatric-clinic.nhs-hernia-2026`: NHS hernia location/dynamic-bulge
  cross-check, reviewed May 2026; adult management is not transferred.
- `source.pediatric-clinic.nhs-umbilical-2025`: NHS navel-location cross-check
  and preserved repair-age disagreement, reviewed November 2025.
- `source.pediatric-clinic.gosh-midline-hernia-2016`: GOSH pediatric hernia
  anatomy, dated July 2016; stale treatment timing is withheld.
- `source.pediatric-clinic.cornwall-nodes-2025`: current NHS pediatric node
  pathway, reviewed October 2025, with its under-16 population limit.
- `source.pediatric-clinic.cua-puc-testis-2017`: Braga/Lorenzo/Romao society
  guideline, DOI `10.5489/cuaj.4585`; older guideline cross-checked with NHS
  sources, with broader retractile terminology disagreement preserved.
- `source.pediatric-clinic.cuh-testis-2025`: CUH pediatric testis information,
  document 1716, version 9, approved November 2025; institutional source
  approval does not approve this batch.
- `source.pediatric-clinic.scalise-demehri-pectus-2023`: pediatric pectus
  narrative review, DOI `10.21037/tp-22-361`, actual CC BY-NC-ND 4.0 recorded.
  Underlying facts only; no article adaptation is distributed.
- `source.pediatric-clinic.shtg-bracing-2022`: Scottish government
  health-technology bracing assessment, February 2022; predominantly
  observational, heterogeneous evidence.
- `source.pediatric-clinic.alder-hey-bracing-2026`: current pediatric
  orthotics information, reviewed July 2026.
- `source.pediatric-clinic.metzger-pilonidal-2021`: pediatric expert
  perspective, DOI `10.1016/j.amsu.2021.102233`, verified CC BY 4.0; all six
  authors, article and license attributed. Licensed Europe PMC XML was read
  in memory after primary browser access showed a CAPTCHA; no bypass or
  saved article.
- `source.pediatric-clinic.cps-decision-making-2018`: Coughlin/CPS
  bioethics statement, DOI `10.1093/pch/pxx127`, reaffirmed January 2024;
  ethical participation only, with jurisdictional legal/privacy limits.

Some narrow management objectives have one adequate eligible source; each
affected claim explicitly records that limitation. Medical authority and
license permissiveness are separate. Source prose, full articles, excerpts,
tables, figures, algorithms and source clinical vignettes were not stored or
copied. NHS OGL attribution and both Creative Commons license conditions are
retained. External clinical/license links in the samples and assembly metadata
use `target="_blank"` and `rel="noopener noreferrer"`; no gameplay fetch or
AI call is added.

ACS, EAU and RCH Melbourne were excluded after their AI/automated-access
restrictions were identified. An unresolved BMJ epigastric candidate was
excluded for access/AI-TDM-rights uncertainty. None supports an admitted claim;
no inaccessible/paywalled snippet or placeholder citation substitutes for a
read source. Rights/access exclusion notes are separate from clinical evidence.

### Withheld topics and decisions

- Fixed umbilical repair age and mandatory age-based referral: eligible NHS,
  Cornwall and dated GOSH positions differ. The planned timing/referral
  objective was dropped; disagreement is recorded, not averaged.
- Universal operation rules for high/persistently retractile testes: source
  terminology differs. Only strict true-retractile and clear acquired-ascent
  profiles are posed; disputed extensions remain withheld.
- Varicocele intervention thresholds: current EAU material was restricted;
  adequate current eligible independent verification was not completed.
- School-age hydrocele: local referral evidence found, independent
  age-appropriate corroboration not completed; infant rules are not borrowed.
- Exact pilonidal hair-removal method/interval or medication regimen: not
  generalized from the single pediatric expert perspective.
- Pectus operative thresholds or guaranteed exercise improvement: source
  uncertainty is preserved; evaluation/referral only.
- Adolescent privacy, refusal and legal consent: jurisdiction/context review
  and the owner prototype's always-present parent constraint require a
  separate milestone.
- Infant content and pediatric testing/MRI/sedation/procedures: outside the
  approved age/art and outpatient scope, with no admitted pediatric test routes.

### Files and assembly handoff

Owned files: `batch-helpers.ts`, `source-catalog.ts`, `evidence-claims.ts`,
`hernia.ts`, `neck-nodes.ts`, `testes.ts`, `chest-wall.ts`, `pilonidal.ts`,
`assent.ts`, `pediatric-clinic-batch.ts`, `render-samples.ts`,
`generate-samples.mjs`, `pediatric-admission.test.ts`,
`pediatric-content.test.ts`, and `README.md` in the new batch folder.

The one-per-objective key-first read-through is
[PEDIATRIC_BATCH_SAMPLES.md](../handoffs/PEDIATRIC_BATCH_SAMPLES.md), regenerated
from the actual exports and checked for exact agreement. All owned artifacts
use UTF-8 without BOM. Generated JS for the samples lives only under the
worker-owned ignored `.local-dev/pediatric-clinic-20261008/` scratch folder.

The shared runtime schema changed concurrently from L3-only to L4 and introduced
`pediatric-patient-profile.v1`. This worker preserved those foundation edits
and adopted that marker on the draft cases and constrained profiles:
`requiresParent: true`, `clinicalScope: "outpatient"`. The local validator
retains shared strict checks and adds the narrower batch population,
one-profile, no-vitals and no-test/service constraints. Transient broad-check
failures during concurrent foundation work were outside this lane; the final
full suite and workspace typecheck below both pass.

Next manager action: review exact concepts/profiles/claims and select an explicit
unapproved prototype manifest before assembly. Accept the L4 foundation and
family-placement runtime, preserve named child/art/parent identities, prevent
adult defaults or uncontrolled name/demographic recombination, and deduplicate
the reused canonical concept. Named clinician approval of exact content
versions remains necessary for clinical promotion. The manager owns integration,
the current-thread handoff and acceptance.

Local draft only: no Git, dependency install, commit, push, publication,
deployment, browser/profile or owner-save action was performed. On manager
acceptance of this valuable content checkpoint, remind the owner to say
**"push to GitHub"** for a scoped audited backup.

### Final validation evidence

The worker used Vitest's thread pool to respect the unelevated-sandbox contract.
No browser correctness or clinical approval is claimed. Final outputs follow
verbatim.

### Sample artifact generation

Command:

```powershell
node packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/generate-samples.mjs
```

Exit code: 0. Exact output:

```text
(node:38128) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Wrote docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md from current pediatric batch exports (UTF-8 without BOM).
```

### Pediatric admission/editorial tests

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-08-pediatric-clinic --pool=threads --maxWorkers=1
```

Exit code: 0. Exact output:

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run src/development-batch/2026-10-08-pediatric-clinic --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  2 passed (2)
      Tests  19 passed (19)
   Start at  20:59:01
   Duration  351ms (transform 75ms, setup 0ms, import 174ms, tests 37ms, environment 0ms)
```

### Full clinical-content suite

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
```

Exit code: 0. Exact output:

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  84 passed (84)
      Tests  608 passed (608)
   Start at  20:59:27
   Duration  23.58s (transform 2.01s, setup 0ms, import 15.32s, tests 2.47s, environment 4ms)
```

### Workspace typecheck

Command:

```powershell
npm.cmd run typecheck
```

Exit code: 0. Exact output:

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

### Scoped batch and test TypeScript check

Command:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit --strict --noUncheckedIndexedAccess --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck --esModuleInterop --resolveJsonModule --types node packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/render-samples.ts packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-admission.test.ts packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-content.test.ts
```

Exit code: 0. Exact output: empty (no stdout or stderr).




## Level 4 M2: approved art promotion

2026-10-08 - Sol worker for **GamifySurgery manager**. Implementation lane
complete, in the requested order **MRI -> Pediatric Waiting -> Pediatric
Examination -> Wound/Ostomy**, with focused validation after each. Manager
retains actual diff review, default-config reruns and live browser acceptance.

### Scope and promoted contracts

Promoted **30 PNGs / 2,740,204 bytes** into versioned runtime directories. Each
PNG is byte-identical to its approved source; receipt hashes, source dimensions,
derived/reused manifests and native anchor metadata are checked and retained in
the per-room provenance. No image generation, resizing, recompression or proof
screenshot is used. Reused approved bench/chair/sink/curtain/bin art stays by
reference. The exact native west/east armrest masks and each room's approved
complete backless stool are retained.

| Room / definition ID | Native PNGs | Active draw records | Identity-free supports | Fine routes | One-tile doors |
| --- | ---: | ---: | ---: | ---: | ---: |
| MRI / `room.mri` | 9 | 9 | 3 (two alternative patient poses) | 48 | 16 |
| Pediatric Waiting / `room.pediatric_waiting` | 9 | 17 | 9 physical actor seats | 141 | 16 |
| Pediatric Examination / `room.pediatric_examination` | 6 | 8 | 3 | 36 | 12 |
| Wound/Ostomy / `room.wound_ostomy` | 6 | 9 | 2 | 24 | 12 |

All four presentations are wired through the existing approved-room system and
locked to orientation 0. Exact approved floor primitives, native alpha-based
placement, source crops/render scales, hip/furniture/painter contacts, MRI glass
and bore clipping are preserved. Prepared assets resolve the actual proof
painter's measured anchor, rather than the nominal padded layout rectangle.
MRI retains the seated west-facing patient and revised north-facing operator.
The operator's native chair foreground and the side-chair front masks follow
the attached real actor's depth, including low-zoom rounding. The entire
clinician paints above the single complete backless stool.

Door-owned furniture, masks and sitters share section visibility; wall items
follow their own backing segments. Approved full-height floor shelves/cabinets
remain full height on low/backed north walls. The active solids and measured
native base clearances supersede stale coarse proof navigation. Every door is
tested through the existing domain graph. Explicit approved threshold exceptions
remain limited to their owning fixtures; unrelated MRI table/glass blockers are
retained.

`APPROVED_LEVEL4_SUPPORT_NAVIGATION` separates integer walking anchors, standing
approaches and static seating contacts. `approachRoutes` contains **249** checked
world-coordinate routes, using the approved 0.05-tile resolution and 0.18-tile
actor radius. Physical fixed-chair bases remain blockers even where conditional
integer passages represent the narrow route around them. M5/M6 must consume
these fine knots when binding movement; interpolating coarse grid centers
through those chairs would lose the approved clearance. No pathfinder or actor
state machine was added in M2.

Waiting has five ordinary seats and four child-only stools with
`maxAgeExclusive: 10`; ages 9/10, missing age and parent exclusion are tested.
Ordinary seats accept child or parent. `waitingAnchors` is deliberately empty:
these nine supports do not add nine admissions or family capacity. Examination
retains a dedicated same-room parent chair. Real identities/family reservation
are M5/M6 work; no named proof actor is baked into the runtime data.

**No room definitions, prices, services, staff, gameplay, content assembly or
buildability were added.** All four remain absent from the shipped Build catalog;
M3 owns their definitions. Reading, the live level-3 cap, clinical records,
frozen encounters/saves and launchers are unchanged by this lane. No clinical
statement or approval is introduced; existing clinical review rules continue.

### Files

New native public files under `apps/player/public/art/rooms/level4-v1/`:

- `mri/`: `coil-cabinet.png`, `comfort-cart.png`, `console.png`,
  `gantry-side.png`, `open-shelves.png`, `operator-chair.png`, `scan-light.png`,
  `table-empty.png`, `zone-sign.png`.
- `pediatric-waiting/`: `animal-prints.png`, `aquarium.png`,
  `armchair-east-front.png`, `armchair-west-front.png`, `book-bin.png`,
  `kid-stool.png`, `kids-table.png`, `toy-chest.png`, `wall-clock-kids.png`.
- `pediatric-exam/`: `animal-print.png`, `growth-chart.png`, `peds-table.png`,
  `scale-counter.png`, `stool-backless.png`, `toy-bin.png`.
- `wound-ostomy/`: `dressing-cart.png`, `exam-lamp.png`, `hygiene-sign.png`,
  `ostomy-shelf.png`, `rolling-stool-backless.png`, `wound-recliner.png`.

New code/data/tool files:

- `apps/player/src/art/level4/{mri,pediatric-waiting,pediatric-exam,wound-ostomy}.json`
  and `apps/player/src/art/approvedLevel4BitmapAssets.ts`.
- `apps/player/src/facility/level4/{mri,pediatric-waiting,pediatric-exam,wound-ostomy}.json`
  and `apps/player/src/facility/approvedLevel4RoomData.ts`.
- `packages/balance-config/src/approved-level4-room-layouts.ts`.
- `tools/room-design/level-4/runtime-promotion/{promote.mjs,routes.mjs,README.md}`.
- `apps/player/src/facility/{approvedMriRoom.test.ts,approvedPediatricWaitingRoom.test.ts,approvedPediatricExaminationRoom.test.ts,approvedWoundOstomyRoom.test.ts,level4ApprovedRoomTestHelpers.ts,level4ApprovedScene.test.ts}`.
- `packages/game-domain/tests/level4-approved-navigation.test.ts`.

Narrow shared runtime hunks:

- `apps/player/src/art/bitmapAssetManifest.ts`: import/spread the new descriptors.
- `apps/player/src/facility/approvedRoomPresentation.ts`: types, registry,
  identity-free draw/support/procedural resolvers and owning visibility.
- `apps/player/src/facility/approvedRoomRenderer.ts`: exact floor, explicit
  painter ground and measured MRI clip helper.
- `apps/player/src/facility/FacilityScene.ts`: reused touchup asset lookup,
  native foreground depth, MRI crop/glass, hidden support presentation.
- `apps/player/src/facility/types.ts`: eight presentation support roles.
- `apps/player/src/facility/roomTouchups.ts`: preserve a supplied approved
  full-height backing marker.
- `apps/player/src/facility/roomVisualLayout.ts`: include four future IDs in
  approved dynamic-door selection.
- `packages/balance-config/src/{approved-room-layouts.ts,index.ts}`: import/spread
  and export the separate physical navigation/support contracts.

Shared test compatibility hunks in `apps/player/src/art/bitmapAssetManifest.test.ts`,
`apps/player/src/facility/{approvedRoomPresentation.test.ts,backlessRollingStools.test.ts,furnitureSeatLayering.test.ts}`,
`packages/balance-config/src/approved-room-layouts.test.ts` and
`packages/game-domain/tests/spatial.test.ts` distinguish future presentation
metadata from shipped definitions. The historical crop/polygon baselines retain
every legacy room; native Level 4 masks/stools have their own byte/scene tests.
The domain's shipped-definition audit resumes for these rooms once M3 registers
them. M3 must then update the M2 catalog-exclusion assertions deliberately.

Both execution documents receive append-only handoffs. Scoped before-images,
the native test config, complete outputs and a SHA-256/file-ownership inventory
are in ignored `.local-dev/level4-m2/`. `owned-files.json` inventories 51 new files,
15 shared hunk files and two append-only documents; shared files may also contain
concurrent work and are not wholesale worker ownership. Shared files were reread
before edits; `fc.exe /N` review used the owned before-images, without Git.

### Sequential and final validation

After each room, the focused command selected its room test plus
`src/facility/approvedRoomPresentation.test.ts` and
`src/facility/approvedRoomRenderer.test.ts`, using the native player config and
`--pool=threads --maxWorkers=1`. Exact selected room files, in execution order:
`approvedMriRoom.test.ts`, `approvedPediatricWaitingRoom.test.ts`,
`approvedPediatricExaminationRoom.test.ts`, `approvedWoundOstomyRoom.test.ts`.

| Stage | Focused player output | Cumulative navigation output | Approved-layout output | Player typecheck |
| --- | --- | --- | --- | --- |
| MRI | `Test Files  3 passed (3)` / `Tests  45 passed (45)` | `Test Files  1 passed (1)` / `Tests  4 passed (4)` | `Test Files  1 passed (1)` / `Tests  9 passed (9)` | exit 0 |
| Pediatric Waiting | `Test Files  3 passed (3)` / `Tests  46 passed (46)` | `Test Files  1 passed (1)` / `Tests  8 passed (8)` | `Test Files  1 passed (1)` / `Tests  9 passed (9)` | exit 0 |
| Pediatric Examination | `Test Files  3 passed (3)` / `Tests  46 passed (46)` | `Test Files  1 passed (1)` / `Tests  12 passed (12)` | `Test Files  1 passed (1)` / `Tests  9 passed (9)` | exit 0 |
| Wound/Ostomy | `Test Files  3 passed (3)` / `Tests  46 passed (46)` | `Test Files  1 passed (1)` / `Tests  16 passed (16)` | `Test Files  1 passed (1)` / `Tests  9 passed (9)` | exit 0 |

MRI player output was captured in the worker tool transcript; subsequent stage
outputs are `<slug>-player.log`, `<slug>-domain.log`, `<slug>-balance.log` and
`<slug>-typecheck.log` in the scratch lane. Repeated commands:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level4-approved-navigation.test.ts --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/approved-room-layouts.test.ts --pool=threads --maxWorkers=1
npm.cmd run typecheck --workspace @gamify-surgery/player
```

An initial full player run identified legacy mock crop-reset failures and old
baseline assumptions; those M2 regressions were corrected and checked. An initial
full domain run found the old all-registered-navigation loop dereferencing an
absent future definition; the narrow metadata/shipped distinction now fixes it.
Final anchor/scene/navigation checks and both complete suite reruns use the
final code/data. The complete player suite still reports the five pre-existing
failures documented by the finance handoff; they are outside this art lane:

- `alertsEventsViewModel.test.ts:138`: expected `$2.00 is missing`; actual
  `$0.91 is missing. Avery could quit.`.
- `buildViewModels.test.ts:259`: expected `Hourly upkeep +$1.`; actual upgrade
  improvements contain only `+2 satisfaction points after examination`.
- `diagnosticTimingViewModels.test.ts:245`: expected Reading `$24 upkeep / hr`;
  actual `$6 upkeep / hr` (build price remains `$1,800`).
- `employeeTrainingViewModels.test.ts:154`: expected prescription `$25.00` fee /
  `$11.50` contribution; actual `$70.00` / `$56.50`, stock remains `$13.50`.
- `surgeryCenterServicePreviews.test.ts:85`: pending label lacks the expected
  `Off-site thyroid fine-needle aspiration` text; the saved route name remains
  correct. This is the known thyroid pending-label assertion.

The default full commands were attempted first:

```powershell
npm.cmd run test --workspace @gamify-surgery/player
npm.cmd run test --workspace @gamify-surgery/game-domain
```

Both exit 1 due to the unelevated sandbox's `spawn EPERM`: player Vite config
bundling fails in `externalize-deps` before collection, and domain default forks
cannot start/terminate normally. Complete errors are in
`full-player-default.log` / `full-domain-default.log`. Final domain uses its
ordinary config with threads. Final player uses the scratch native config,
preserving **React and forbidPrivateModules plugins** with no test exclusions;
only its loading path avoids sandbox-blocked config bundling. No production
Vite config or package/dependency setting was changed. Manager should rerun both
ordinary configs/pools in its environment and own the five existing failures.

### Exact final outputs

These are exact completed summary excerpts; complete output/error transcripts are retained in the named local logs. No tests were excluded.

Command:

```powershell
node tools/room-design/level-4/runtime-promotion/promote.mjs mri --check
node tools/room-design/level-4/runtime-promotion/promote.mjs pediatric-waiting --check
node tools/room-design/level-4/runtime-promotion/promote.mjs pediatric-exam --check
node tools/room-design/level-4/runtime-promotion/promote.mjs wound-ostomy --check
```

Exit code: 0. Each command exits 0. Read-only reproducibility output:

```text
CHECK PASS mri: 9 exact approved sprites; 9 draws; 3 actor-free supports; 48 fine routes
CHECK PASS pediatric-waiting: 9 exact approved sprites; 17 draws; 9 actor-free supports; 141 fine routes
CHECK PASS pediatric-exam: 6 exact approved sprites; 8 draws; 3 actor-free supports; 36 fine routes
CHECK PASS wound-ostomy: 6 exact approved sprites; 9 draws; 2 actor-free supports; 24 fine routes
```

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/approvedMriRoom.test.ts src/facility/approvedPediatricWaitingRoom.test.ts src/facility/approvedPediatricExaminationRoom.test.ts src/facility/approvedWoundOstomyRoom.test.ts src/facility/level4ApprovedScene.test.ts src/facility/approvedRoomPresentation.test.ts --config ../../.local-dev/level4-m2/player-vitest.config.mjs --configLoader=native --pool=threads --maxWorkers=1
```

Exit code: 0. Final native anchor/actual scene checks (`native-anchor-final.log`):

```text
 Test Files  6 passed (6)
      Tests  59 passed (59)
   Start at  21:43:56
   Duration  6.98s (transform 1.59s, setup 0ms, import 3.65s, tests 2.92s, environment 0ms)
```

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/spatial.test.ts tests/level4-approved-navigation.test.ts --pool=threads --maxWorkers=1
```

Exit code: 0. Final ordinary grid/fine navigation checks (`navigation-final-focused.log`):

```text
 Test Files  2 passed (2)
      Tests  32 passed (32)
   Start at  21:43:56
   Duration  1.71s (transform 820ms, setup 0ms, import 1.21s, tests 362ms, environment 0ms)
```

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

Exit code: 0. FULL domain (`full-domain-accepted.log`), ordinary config with threads:

```text
 Test Files  123 passed (123)
      Tests  3613 passed (3613)
   Start at  21:47:20
   Duration  277.60s (transform 2.60s, setup 0ms, import 38.62s, tests 230.76s, environment 6ms)
```

Command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/level4-m2/player-vitest.config.mjs --configLoader=native --pool=threads --maxWorkers=1
```

Exit code: 1. FULL player (`full-player-accepted.log`), native config with threads; five existing failures listed above:

```text
 Test Files  5 failed | 144 passed (149)
      Tests  5 failed | 1158 passed (1163)
   Start at  21:47:20
   Duration  68.84s (transform 3.26s, setup 0ms, import 30.69s, tests 27.87s, environment 7ms)
```

Command:

```powershell
npm.cmd run typecheck
```

Exit code: 0. All seven workspaces (`full-typecheck-accepted.log`). Complete stdout:

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

Command:

```powershell
node .local-dev/level4-m2/audit.mjs
```

Exit code: 0. Owned text/source-byte audit; exact output:

```text
AUDIT PASS: 30 exact native PNGs (2740204 bytes); 249 fine routes; 51 new files, 15 shared hunk files, 2 append-only documents; UTF-8 without BOM; no embedded proof images/example actor contracts.
```


### Manager preview after M3

Use a disposable QA campaign at **`http://127.0.0.1:5183`**, with an explicitly
QA-enabled Level 4 balance/profile after M3 has registered the definitions.
M1 intentionally rejects a level-4 save under the normal cap-3 release; do not
inject it into the owner's campaign. If starting the existing development
server in the manager environment:

```powershell
npm.cmd run dev --workspace @gamify-surgery/player -- --host 127.0.0.1 --port 5183 --strictPort
```

Record `location.origin` during QA. This disposable origin has separate storage
from the owner's **`START_GAME.cmd` -> `http://127.0.0.1:4173`** in the usual
persistent browser profile. No launcher, origin, profile or saved campaign was
changed/accessed here. The canonical owner and GitHub Pages pathways stay as
documented in AGENTS.md; no campaign automatically transfers to QA.

1. Place the four exact IDs from the table above at orientation 0: MRI/Waiting
   4x4, Examination/Wound 3x3. Inspect empty rooms at 24/64/120 pixels per tile and
   on a narrow viewport; check measured feet/wall anchors, native aspect ratios,
   floor marks/materials, low/backed north wall sections and complete shelves.
2. Exercise all 16/12 door sections and each of four/three north backings. Check
   owner-only hiding/restoration, accessible standing approaches, MRI EB/EC,
   Waiting bench/armchair exceptions, Examination table/parent exceptions and
   Wound WB. Keep physical bases while applying the exported fine routes.
3. For occupied scene QA, attach real QA actor views using existing
   `supportRole`, `supportId`, `supportRoomInstanceId` and that support's safe
   integer `anchor` from `APPROVED_LEVEL4_SUPPORT_NAVIGATION`. The scene resolves
   approved pose/facing/hip/painter contacts. M2 adds no fixed actor or actor
   workflow; manager QA binding is a test view-model fixture until M5/M6 supply
   gameplay actors. The scene harness already checks bitmap/fallback bindings,
   exact MRI crop, foreground masks, stool order and owning sitter visibility.

| Room | Support ID -> role | Occupied check |
| --- | --- | --- |
| MRI | `operator` -> `mri-operator`; `patient-seated` (or alternate `patient-standing`) -> `mri-patient` | One operator north; one seated patient west, legs off table, foreground above bed/gantry; table ends at approved bore clip. Do not show both alternative patient poses at once. |
| Pediatric Waiting | `bench:seat-1`, `bench:seat-2`, `armchair`, `olderChildChair`, `spareAdultChair`, `kidWest`, `kidEast`, `kidNorth`, `kidSouth` -> `pediatric-waiting-seat` | Child/parent ordinary seats; four stools only for children under 10. Compare ages 9/10, preserve actual child height and native east/west armrest order. WB/WC/WD hide owning chairs/masks/sitters together. |
| Pediatric Examination | `table:patient` -> `pediatric-examination-patient`; `stool:clinician` -> `pediatric-examination-clinician`; `parentChair` -> `pediatric-parent-seat` | Child east on table, whole clinician west above backless stool, same-room parent west behind exact native front mask. |
| Wound/Ostomy | `recliner:patient` -> `wound-ostomy-patient`; `stool:clinician` -> `wound-ostomy-clinician` | Patient east, legs down on no-leg-rest chair; whole clinician west above complete backless stool; full-height floor shelf, reused sink/curtain/bin. |

M3 owns catalog placement/costs/upgrades. M5/M6 own family eligibility and pair
reservation, pose-source height calibration, movement through fine approaches
and actual staff/patient workflow. M2 exposes the required contracts without
claiming those workflows or browser acceptance are complete. No new owner or
clinical decision is requested by this lane.

UTF-8 without BOM is verified for all owned text files. No Git, installs,
subagents, browser/owner-save access, external messages, commit, push, merge,
release, deployment, publication or runtime web/AI call occurred. This valuable
checkpoint is **LOCAL ONLY**. On manager acceptance, remind the owner to say
**"push to GitHub"** for an audited scoped backup. The manager retains the shared
current-thread handoff and final owner report; M2 appends the two requested
execution records only.



## Level 4 M3: room definitions and ladders

2026-10-08 - Sol worker for **GamifySurgery manager**. M3 implementation and
worker validation complete; manager retains diff inspection, ordinary fork-pool
reruns and live browser acceptance. The shipped playable cap remains **3** and
Level 3's successor remains null. Exactly four room definitions unlock at 4;
their accepted GS-038 ladders are current. The five Level 5 ladders remain
future/neutral. Reading and its four posts remain Level 3.

### Prices, capacities and arithmetic

New upkeep implements option B's low fixed-cost scale. Construction and four
purchase prices retain the plan/GS-038 values. All rates are **dollars per game
hour**, using the unchanged minute accrual and 15-minute posting. These are
editorial simulation settings, not clinical or real-world financial claims.

| Definition / room | Footprint | Build | Base upkeep/h | Added upkeep/purchase/h | Upkeep at room Levels 1/2/3/4/5 | Instance cap | L2/L3/L4/L5 purchase prices | Accepted effect |
| --- | --- | ---: | ---: | ---: | --- | ---: | --- | --- |
| `room.mri` / MRI Room | 4x4 | $2,400 | $8 | $1 | $8/$9/$10/$11/$12 | 1 | $600/$900/$1,300/$1,800 | +6% MRI service revenue per purchase; +24% maximum |
| `room.pediatric_waiting` / Pediatric Waiting Room | 4x4 | $600 | $1 | $0 | $1/$1/$1/$1/$1 | 2 | $150/$225/$325/$450 | +2 waiting-family satisfaction points per purchase; +8 maximum |
| `room.pediatric_examination` / Pediatric Examination Room | 3x3 | $600 | $2 | $0 | $2/$2/$2/$2/$2 | 4 | $150/$225/$325/$450 | +2 visit satisfaction points per purchase; +8 maximum |
| `room.wound_ostomy` / Wound/Ostomy Clinic | 3x3 | $1,000 | $2 | $1 | $2/$3/$4/$5/$6 | 2 | $250/$375/$550/$750 | +6% actual clinic service revenue per purchase; +24% maximum |

MRI's cap is **1**, equal to each currently registered Ultrasound, X-ray and CT
type, as M0 requires. All require the Front Desk; all have zero build-time
satisfaction, zero per-upgrade workload and zero per-upgrade speed. MRI and
Pediatric Waiting contribute zero base workload; Pediatric Examination and
Wound/Ostomy each contribute one patient slot. Parent seats do not add patient
admissions. M2 navigation and all 16/12 doors are reused exactly; placement UI
permits only orientation 0. Waiting retains five ordinary seats/four under-10
stools and empty generic `waitingAnchors`; no new family routing is supplied.

Baseline budget arithmetic, before purchases:

- **MRI:** catalog $240 every 240 minutes => $60/h. Dedicated option-B Imaging
  Technician $18/h plus room $8/h => **$34/h headroom**. One purchase adds
  $60 x 6% - $1 = **$2.60/h**. The separate Reading fee is not counted twice,
  and neither outside-read income nor unrelated NP income funds this calculation.
- **Pediatric Examination plus Waiting:** retained $80 visit and the plan's
  **candidate 90-minute demand** => $53.333.../h. Even budgeting the as-yet
  undefined APP at the original $40/h candidate, $53.333... - $40 - $2 - $1 =
  **$10.333.../h headroom**. Waiting costs $1/h, about 1.875% of that enabled
  gross, has no employee or invented entry fee, and neither comfort ladder
  adds rent. This does not set APP wages or activate pediatric demand.
- **Wound/Ostomy:** the unchanged catalog has $60 wound care every 180 minutes
  and $75 ostomy support every 180 minutes => $20 + $25 = **$45/h**. Against
  the same conservative $40/h APP budget plus $2/h upkeep, headroom is **$3/h**.
  A purchase adds $45 x 6% - $1 = **$1.70/h**. The plan's later candidate
  120-minute wound cadence would yield $55/h, but M3 does not apply that change.
  Supplies/procedures are not assumed as extra baseline receipts.

These are explicit isolated budgets, not measured full-facility throughput or
newly running services. Pediatric income is still explicit-only; APP is not
defined. Shared arrival spacing, staff absence, family movement and actual L4
service receipts require M4-M6 and the M8 economy reconciliation. This lane
changes no fees, cadences, salaries, staff roles, services, patient admissions,
progression behavior or clinical content. It adds one physical MRI technician
slot and the usual shared-imaging sale preview; the existing three-technician
hiring ceiling/compatible-role requirements remain for the later staff lane.

### Integration and files

Scored room-use consumers share the existing waiting/examination witness slots:
one observed waiting room freezes its bonus, one performed examination awards
once, and another copy/general Waiting/Examination cannot stack that same
category. Pediatric-room bonuses require the existing pediatric profile marker;
adult encounters do not receive them. No parent receives a separate award.
Future unscored visit completion binding belongs to M5/M6; M3 adds no visit flow.
MRI/clinic revenue uses the existing accepted quote and actual-room binding:
later upgrades/copies do not backdate payment, and absent legacy quotes stay
absent. No supply-outlet or unsupported procedure is activated. M6 must preserve
the clinic-service versus retail/supply distinction in its new bindings.

M2 presentation/asset files are unchanged. Definitions use
`getApprovedRoomNavigation` and the existing approved presentation registry;
Build categories, purposes, costs, caps, inspector/owned-room upgrades, door
access, expense totals, sale refunds and QA save/reload are covered. Wound/Ostomy
joins the protected care-room set so ambient paths cannot use it as a corridor.

Six narrowly edited runtime files:

- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/room-upgrades.ts`
- `packages/game-domain/src/room-upgrade-experience.ts`
- `packages/game-domain/src/room-capacity.ts`
- `packages/game-domain/src/care-room-access.ts`
- `apps/player/src/session/buildModePresentation.ts`

Eleven existing test/helper files updated deliberately for registration:

- `packages/balance-config/src/{room-upgrades,room-instance-caps,level-four-schema,approved-room-layouts}.test.ts`
- `packages/game-domain/tests/{level-four-persistence,room-upgrade-revenue,service-operations,facility-alert-conditions}.test.ts`
- `apps/player/src/facility/{level4ApprovedRoomTestHelpers.ts,roomUpgradeAppearance.test.ts}`
- `apps/player/src/session/alertViewModels.test.ts`

Six new source/test/tool files:

- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/game-domain/tests/level-four-rooms.test.ts`
- `apps/player/src/session/levelFourRoomsViewModels.test.ts`
- `tests/fixtures/level-four-rooms.ts`
- `tools/qa/level-four-rooms.mjs`
- `tools/qa/level-four-rooms-bootstrap.ts`

This plan receives this append; `owner-requests-20261008.md` receives a pointer.
The manager-owned current handoff is unchanged. Shared files were reread before
exact edits. Local `.local-dev/level4-m3/` contains before/after images of owned
files, the inspected actual `scoped.diff`, SHA-256 `owned-files.json`, complete
test/error logs and this handoff generator. All owned text is UTF-8 without BOM.
No Git status/diff, Git mutation, installs, agents, external messages, proprietary
inputs, owner saves, art generation or clinical authoring were used.

### Exact validation output

Default pool/config attempts, exit 1 before collecting tests:

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/level-four-rooms.test.ts
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-rooms.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFourRoomsViewModels.test.ts
```

Balance/domain: `Failed to start forks worker` / `Caused by: Error: spawn EPERM`,
`Test Files no tests`, `Tests no tests`, `Errors 1 error`; fork shutdown also
times out. Player: Vite config startup `spawn EPERM`. Full logs are
`balance-default.log`, `domain-default.log`, `player-default.log`.

All subsequent workspace tests use **the ordinary existing configurations**, the
thread pool and the brief's existing preload. React/private-module guard plugins
are retained; no native alternate config, exclusions or CLI worker-cap override.
The existing domain/player configs cap workers at four.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/level-four-rooms.test.ts src/room-upgrades.test.ts src/level-four-schema.test.ts src/room-instance-caps.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-rooms.test.ts tests/level-four-persistence.test.ts tests/room-upgrade-experience.test.ts tests/room-upgrade-revenue.test.ts tests/level4-approved-navigation.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFourRoomsViewModels.test.ts src/facility/approvedMriRoom.test.ts src/facility/approvedPediatricWaitingRoom.test.ts src/facility/approvedPediatricExaminationRoom.test.ts src/facility/approvedWoundOstomyRoom.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/alertViewModels.test.ts src/facility/roomUpgradeAppearance.test.ts src/session/levelFourRoomsViewModels.test.ts --pool=threads
```

Focused outputs (all exit 0; log order matches those commands):

```text
balance-focused.log:
 Test Files  4 passed (4)
      Tests  24 passed (24)
   Start at  22:15:53
   Duration  401ms (transform 421ms, setup 0ms, import 969ms, tests 66ms, environment 1ms)

domain-focused-final.log:
 Test Files  5 passed (5)
      Tests  128 passed (128)
   Start at  22:16:52
   Duration  4.14s (transform 4.56s, setup 0ms, import 6.86s, tests 5.02s, environment 0ms)

player-focused-final.log:
 Test Files  5 passed (5)
      Tests  26 passed (26)
   Start at  22:16:52
   Duration  3.58s (transform 5.41s, setup 0ms, import 8.26s, tests 4.05s, environment 0ms)

player-catalog-focused-final.log:
 Test Files  3 passed (3)
      Tests  126 passed (126)
   Start at  22:23:57
   Duration  2.04s (transform 3.83s, setup 0ms, import 5.32s, tests 354ms, environment 0ms)
```

Full commands:

```powershell
# Same NODE_OPTIONS preload as above; ordinary package configs.
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Final full balance (`balance-full-final.log`), exit 0:

```text
 Test Files  12 passed (12)
      Tests  123 passed (123)
   Start at  22:20:03
   Duration  435ms (transform 1.03s, setup 0ms, import 2.35s, tests 125ms, environment 1ms)
```

Final full domain (`domain-full-final.log`), exit 0:

```text
 Test Files  124 passed (124)
      Tests  3625 passed (3625)
   Start at  22:21:17
   Duration  89.66s (transform 7.21s, setup 0ms, import 51.66s, tests 296.22s, environment 7ms)
```

Final full player (`player-full-accepted.log`), exit 1:

```text
 Test Files  1 failed | 149 passed (150)
      Tests  1 failed | 1177 passed (1178)
   Start at  22:24:33
   Duration  21.48s (transform 8.01s, setup 0ms, import 40.82s, tests 32.53s, environment 8ms)
```

The sole remaining failure is the previously recorded and untouched
`src/session/surgeryCenterServicePreviews.test.ts:85:52`: pending label does not
contain `Off-site thyroid fine-needle aspiration`; the saved route name remains
correct. No full-player PASS is claimed. Initial M3 failures from the M2
absent-definition assertions, old comfort-room lists and MRI image mock lacking
`setCrop` were corrected in their test lanes. Early own-fixture import/sign and
missing QA-context errors were fixed. Logs retain those failures; no assertion
or test was excluded. Full domain covers the final pediatric guard as well.

Root `npm.cmd run typecheck`, exit 0 (`typecheck-final.log`), complete stdout:

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

Additional QA tool checks, exit 0:

```powershell
node --check tools/qa/level-four-rooms.mjs
node node_modules/typescript/lib/tsc.js --noEmit -p .local-dev/level4-m3/qa-tsconfig.json
node tools/qa/level-four-rooms.mjs --check
```

The first two have empty stdout. `qa-entry-check.log` includes:

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

A temporary run of the QA server also served the dedicated HTML and transformed
bootstrap through native HTTP, both status 200 (`qa-http-check.log`):

```text
QA HTTP PASS: dedicated HTML 200 with QA bootstrap; transformed bootstrap 200 with real placement fixture; no browser or storage access.
```

That verification listener was stopped; the existing manager server on 5183
was preserved. No browser or owner storage was accessed. Boundary/launcher
aggregate was not run because its script invokes Git, prohibited by this brief;
manager retains that check in its authorized environment.

### Exact manager preview and placement steps

The new entry is **QA only**, outside the ordinary player entry and Build UI.
It opts a cloned balance/context into 4 and supplies a schema-only terminal QA
stage; it does not change the shipped cap or enable L3 advancement. It creates
paused, funded, empty-room campaigns with arrivals/appointments disabled. No
APP/service/pediatric/content/progression implementation is previewed.

1. From the repository root, run `node tools/qa/level-four-rooms.mjs`. It retains
   the production Vite configuration/plugins and binds exactly **127.0.0.1:5184**
   with strict port handling. Port 5183 was already occupied during validation;
   5184 also isolates these L4 fixture saves from existing manager QA saves.
2. For immediate room preview open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html?rooms=placed** in the intended
   disposable QA browser/profile. Use the usual prototype access gate if asked;
   the tool does not bypass it. The campaign `Level 4 M3 placed preview` contains
   all four rooms, placed by real reducer placement/door commands, at the table
   coordinates below. It preserves that QA campaign across reloads.
3. To exercise the ordinary Build controls, open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html**. This selects the separate
   `Level 4 M3 room QA` campaign, initially with $30,000 before corridor/door
   spending, a prepared corridor and no specialty rooms. Enter Build Mode,
   select each room in its category, place at orientation 0, then use Edit doors
   to add its specified south door. Offsets below are zero-based (2 = S3;
   1 = S2). The corridor already connects these doors to the Front Desk.

| Room / Build category | Placement x,y | Footprint | South door offset | Fixture room ID in placed preview |
| --- | --- | --- | ---: | --- |
| MRI / Diagnostics | 23,22 | 4x4 | 2 | `room.qa.mri` |
| Pediatric Waiting / Patient areas | 29,22 | 4x4 | 2 | `room.qa.pediatric_waiting` |
| Pediatric Examination / Patient areas | 35,23 | 3x3 | 1 | `room.qa.pediatric_examination` |
| Wound/Ostomy / Services | 40,23 | 3x3 | 1 | `room.qa.wound_ostomy` |

4. Inspect the empty M2 designs at normal/minimum/maximum zoom and a narrow
   viewport. Compare all 16/12 selectable doors and backing ownership, complete
   shelves, MRI bore/table registration, child supports, front masks and
   backless stools to M2's approved contracts. Actual staff/patient/family
   binding remains M4-M6; M2's occupied-scene fixture is the appropriate separate
   actor proof. The registered rooms now also pass the all-current-renderer
   unchanged-appearance-at-Level-5 audit.
5. In My Rooms/the room menu, purchase all four tiers and compare the price/
   benefit/upkeep table above. Check a maximum-tier button, MRI's 1/1 construction
   limit, and Waiting/Examination/Wound caps 2/4/2 in the empty Build campaign.
   Exercise an immediate Undo on a placement/purchase, a room sale and refund,
   door/access status, exit Build, save and reload the **same QA URL**. Browser
   checks remain manager acceptance; unit/domain tests already exercise real
   charges, caps, idempotency, access, resale and L4 save round trips.
6. Record `location.origin` = **http://127.0.0.1:5184**. This temporary QA origin
   has separate storage from both manager QA **http://127.0.0.1:5183** and owner
   **START_GAME.cmd -> http://127.0.0.1:4173** in the usual persistent profile.
   Keep using the dedicated `level4-rooms-qa.html` entry, including reloads;
   the normal cap-3 entry rejects L4 saves. No campaign automatically transfers
   between these origins/profiles. No launcher or canonical owner/remote pathway
   changed. Stop the QA server after use.

Next action is manager review/acceptance of M3 and its browser preview, then the
next separately owned milestone. No new design/clinical approval is requested
here. The checkpoint is **LOCAL ONLY**: no commit, push, merge, release,
deployment or publication. After acceptance the manager owns the reminder to
say **"push to GitHub"** for a scoped audited backup.

## Level 4 M4: APPs and appointments in clinic

Worker handoff, 2026-10-08: GPT-6.1 Sol, max. **M4a then M4b implemented and
validated serially; ready for manager review and browser acceptance.** Ordinary
progression remains capped at Level 3 with its existing null successor. The
isolated Level 4 QA context is the opening pathway for this milestone. Manager
retains integration, acceptance, the shared CURRENT_THREAD_HANDOFF, and backup
coordination. No Git, installs, agents, art generation, browser/owner-storage
access, clinical content authoring, external messages or publication occurred.

### Implemented behavior and contracts

- Hireable `staff.app` unlocks at Level 4. Physical capacity is exactly one APP
  post per Examination, Minor-Procedure, Pediatric Examination or Wound/Ostomy
  Room, independent of upgrades. The theoretical current room-instance maximum
  is 31 posts (20 + 5 + 4 + 2); art availability is a separate limit below.
  Hiring tries every free reachable compatible home and persists a unique name,
  appearance and still selection. Salaries, morale, quitting, praise, breaks,
  payroll and training use the existing employee lifecycle.
- **Appointments in clinic** (`income.app_consult`) brings additional adult
  off-the-street visitors to each operational staffed ordinary-exam home.
  Separate persisted per-home arrival keys and bounded queues permit two APPs
  in two exam rooms to work concurrently; the global diagnostic visitor cap and
  spacing do not throttle or replace this demand. Normal scored admission and
  workload accounting remain independent.
- New visits carry `clinic-visit.v1`, adult age/sex consistent with their frozen
  patient still and generated name, and an optional home preference. They are
  service visitors, never learning encounters: no question, Clinical XP, FSRS
  review, mastery evidence, settlement or learning-chart mutation. Tests compare
  unchanged learning state and the same normal scored arrival cases with the
  appointment stream on/off. No new clinical teaching statements were authored.
- Dispatch uses existing single reservations, home preference, reachable spare
  cross-cover and queued-home-work priority. Exam rooms containing scored care
  are unavailable to APP visits. If the founder opens a scored chart while all
  exam rooms are busy, an APP visit yields its room, walks back to the public
  entrance and queues its remaining work. The founder receives the released
  room through normal attendance retry; the scored question stays unchanged.
- Busy APPs finish current care before leaving for paid training. Training/away
  staff are not reserved, waiting visits queue or use a spare, and return resumes
  dispatch. Removing a provider or room releases its single reservation and
  reroutes unfinished work; interrupted visitors walk back to the public area
  instead of holding an exam physically while their APP is away. A regression
  proves that the founder can attend a scored patient in that sole exam. Removing
  the final APP sends visitors home unpaid.
  Room-sale confirmation names the assigned APP dismissal and capacity falls by
  one, including upgraded rooms. Existing founder fallback remains for the four
  APP-preferring Minor-Procedure routes: anoscopy, excisional skin biopsy,
  cutaneous-lesion biopsy and nipple-areolar biopsy. Other staff roles retain
  their own work; APPs gain no imaging, lab, pharmacy, peri-op, GLP-1, reading,
  endoscopy or surgery capability.
- APP training has its own `app_appointment_revenue` metric and label. At actual
  care start, `app-appointment-revenue.v1` freezes the serving provider, achieved
  training level, percent and fee. A transfer/reload cannot average, compound or
  reprice that fee; receipts pay once after completion. Marked APP phase flow,
  demand attribution, reservations and remaining work survive save/load. Older
  frozen work may omit the APP training category and retains that omission.
- Staff cards and map activity name the APP's current visitor; Services displays
  named age/sex/provider, queue state, training fee range and unscored per-home
  demand. Adult patient/provider seated supports use the actual exam care anchors.
  Third hires show an explicit art-exhaustion reason and cannot charge money.
- M5/M6 clinic visits remain dormant in both scheduling and explicit start paths.
  APPs assigned to their future homes show **Waiting for pediatric services** or
  **Waiting for wound/ostomy services**. These labels do not imply those visit
  systems are implemented. M4 emits no pediatric family or wound/ostomy witness.

### Option-B price, salary and revenue arithmetic

All amounts are game economy/timing values. The inherited 120-minute demand and
30-minute work duration remain editorial service timings, not clinical claims.

| Item | Price or rate | Meaning |
| --- | ---: | --- |
| APP hire | $600 | One hire per free compatible physical post and unused approved look |
| APP starting salary | $30/hr | Rebased Option-B scale, with $22-$54 salary range, $2 steps and 5 morale points/step; base morale 75 |
| Ordinary Examination Room | $160 build; $2/hr upkeep | No per-upgrade upkeep increment; upgrades never add APP posts |
| Adult clinic appointment | $80 baseline fee | One additional arrival per 120 game minutes per staffed ordinary-exam home |
| Baseline revenue per ordinary APP home | $80 x 60/120 = $40/hr | Independent demand for each additional staffed exam home |
| Baseline contribution per ordinary APP home | $40 - $30 - $2 = **$8/hr** | 20% of gross; $8/$32 = 25% fixed-cost headroom before interruptions/shared overhead |
| Two ordinary APP homes | $80/hr gross - $60/hr salary - $4/hr upkeep = **$16/hr** | No global arrival cap or profit cliff |
| Minor-Procedure home | Existing $800 build; $4/hr upkeep | Existing ordered route revenue/founder fallback; no invented adult appointment stream in this home |
| Pediatric/Wound homes | M3 prices/upkeep unchanged | May house an APP; their autonomous service revenues await M5/M6 |

| Achieved APP level | Incremental training purchase | Revenue bonus | Fee for its appointment | Normal gross/hr | Gross - $30 salary - $2 exam upkeep |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | No purchase | 0% | $80 | $40 | $8/hr |
| 2 | $150 | +10% | $88 | $44 | $12/hr |
| 3 | $300 | +20% | $96 | $48 | $16/hr |
| 4 | $450 | +30% | $104 | $52 | $20/hr |
| 5 | $600 | +40% | $112 | $56 | $24/hr |

The four purchases total $1,500. APP appointment revenue increases by the actual
provider's achieved tier; it does not use the GLP-1 `consult_payment` formatter,
category-average pay or faster clinical work. Salary remains the employee's
selected hourly contract while travelling, on break or in training. A live
600-minute dispatch test pays 10 visits across two homes: **$800 - 2 x ($30 + $2)
x 10 hours = $160**. Shared clinic overhead, one-time capital, optional salary
raises, temporary interruptions and future specialty demand are separate from
this baseline margin. The emergency GLP-1 consult/payment was not enlarged or
otherwise changed after APP hiring.

### Approved APP art and exact remaining gap

Enabled only the two provider looks explicitly authored for APPs in
`future-roster20-v5`; neither belongs to another role's preferred list:

| Persisted still ID | Approved identity | Existing poses |
| --- | --- | --- |
| `future-roster20-v5.001` | Male, visual age 36; lean, deep brown skin, close-cropped twists/moustache, white coat over cobalt scrubs | `stand-north/south/east/west.png`; `sit-north/south/east/west.png` |
| `future-roster20-v5.002` | Female, visual age 47; olive skin, curls in a bun, silver glasses, white coat over plum scrubs | Same eight directional standing/seated poses |

Approval evidence: `tools/character-mapping/future-roster20-v5/owner-approval.json`
(approved October 7, 2026), its roster/review-acceptance references, and existing
`apps/player/public/art/characters/future-roster20-v5/001` and `/002` PNGs.
Original approval receipts, generated registry JSON, image hashes and authored
contacts were preserved. A small runtime eligibility overlay promotes only these
APP rows; executives remain unavailable. The player art tests verify exact
approved pose hashes and preserved standing/seated identity.

**Walking uses the owner's existing October 7 cardinal-still hop motion.** It
uses the same frozen directional standing pose as the APP walks; neither APP has
an authored separate gait-frame set. No gait asset or new image was generated,
and another role's walking look is never used. If a distinct authored gait cycle
is required later, both APPs lack north/south/east/west gait frames.

**Art stops at two simultaneous APP identities.** For a third APP, the exact
missing addition is one approved APP-compatible provider identity, with standing
and seated poses facing north/south/east/west (eight PNGs plus matching contacts,
using the existing walking-hop contract). Filling all 31 theoretical posts would
require 29 additional complete identities, 232 standing/seated directional PNGs.
Those additional looks/poses were not fabricated or borrowed. The hiring guard
also reserves stills for departing staff until their departure finishes.

### Files changed and scope review

Exact before-images for 403 candidate source/test/document paths are under
`.local-dev/level4-m4/before/`; no Git command was used. Only the listed lane was
changed. Scoped diffs were reviewed against those before-images; new modules,
tests and fixture were inspected directly. The two former M3/roster assertions
were updated to reflect a Level-4 role and the explicit approved-art limit;
physical capacity was not reduced to hide missing art. All owned text is UTF-8
without BOM and uses LF. Local validation logs live in `.local-dev/level4-m4/`.

- `apps/player/src/art/characterStillRegistry.test.ts`
- `apps/player/src/art/characterStillRegistry.ts`
- `apps/player/src/session/appAppointmentsViewModels.test.ts`
- `apps/player/src/session/appStaffPresentation.test.ts`
- `apps/player/src/session/characterActivityPresentation.ts`
- `apps/player/src/session/employeeTrainingViewModels.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/StaffPanel.tsx`
- `apps/player/src/ui/types.ts`
- `docs/execplans/level4-launch-plan-20261008.md`
- `docs/execplans/owner-requests-20261008.md`
- `packages/balance-config/src/app-role.test.ts`
- `packages/balance-config/src/employee-training.test.ts`
- `packages/balance-config/src/employee-training.ts`
- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/balance-config/src/level-four-schema.test.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/service-income-catalog.ts`
- `packages/game-domain/src/app-appointments.ts`
- `packages/game-domain/src/appearance.ts`
- `packages/game-domain/src/characterStillCatalog.test.ts`
- `packages/game-domain/src/characterStillCatalog.ts`
- `packages/game-domain/src/employee-training-effects.ts`
- `packages/game-domain/src/index.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/room-capacity.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/staff-dispatch.ts`
- `packages/game-domain/src/staff.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/app-appointments.test.ts`
- `packages/game-domain/tests/app-staff.test.ts`
- `packages/game-domain/tests/character-variety.test.ts`
- `packages/game-domain/tests/level-four-persistence.test.ts`
- `tests/fixtures/app-appointments.ts`
- `tools/qa/level-four-rooms-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`

### Validation commands and exact final output

Default configs were tried first and hit the sandbox's `spawn EPERM` (fork pool /
player config startup). Fallback kept each existing ordinary Vitest config and
used `--pool=threads` with the already present preload; no tests were excluded:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

**M4a completed before any M4b implementation.** Exact focused commands:

```text
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/app-role.test.ts src/employee-training.test.ts src/level-four-schema.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/app-staff.test.ts src/characterStillCatalog.test.ts tests/employee-training-persistence.test.ts tests/level-four-persistence.test.ts tests/room-capacity-sales.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/appStaffPresentation.test.ts src/art/characterStillRegistry.test.ts src/session/employeeTrainingViewModels.test.ts --pool=threads
npm.cmd run typecheck
```

Exact outputs (`m4a-balance-focused.log`, `m4a-domain-focused.log`,
`m4a-player-final.log`):

```text
M4a balance:
 Test Files  3 passed (3)
      Tests  11 passed (11)
   Start at  22:49:00
   Duration  492ms (transform 315ms, setup 0ms, import 650ms, tests 63ms, environment 0ms)
M4a domain:
 Test Files  5 passed (5)
      Tests  83 passed (83)
   Start at  22:49:00
   Duration  2.59s (transform 4.84s, setup 0ms, import 7.17s, tests 1.08s, environment 1ms)
M4a player:
 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  22:49:19
   Duration  2.28s (transform 4.28s, setup 0ms, import 6.19s, tests 212ms, environment 0ms)
M4a root typecheck: exit 0, seven workspaces; m4a-typecheck-final.log.
```

M4b focused domain, player and art-capacity commands:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/app-appointments.test.ts tests/app-staff.test.ts tests/service-operations.test.ts tests/service-procedure-operations.test.ts tests/employee-training-persistence.test.ts tests/level-four-persistence.test.ts tests/room-capacity-sales.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/appAppointmentsViewModels.test.ts src/session/appStaffPresentation.test.ts src/session/characterActivityPresentation.test.ts src/session/employeeTrainingViewModels.test.ts src/art/characterStillRegistry.test.ts src/ui/StaffPanel.test.tsx --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/character-variety.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/app-appointments.test.ts --pool=threads
```

```text
M4b focused domain (m4b-domain-focused-final.log):
 Test Files  7 passed (7)
      Tests  156 passed (156)
   Start at  23:11:01
   Duration  7.05s (transform 5.29s, setup 0ms, import 8.81s, tests 11.99s, environment 0ms)
M4b focused player (m4b-player-focused.log):
 Test Files  6 passed (6)
      Tests  54 passed (54)
   Start at  23:09:56
   Duration  3.35s (transform 6.92s, setup 0ms, import 10.90s, tests 496ms, environment 0ms)
Art-capacity compatibility (m4b-art-capacity-final.log):
 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  23:14:24
   Duration  1.62s (transform 1.14s, setup 0ms, import 1.51s, tests 34ms, environment 0ms)
Away-provider / sole-exam regression (m4b-away-regression.log):
 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:23:50
   Duration  2.67s (transform 1.16s, setup 0ms, import 1.53s, tests 1.06s, environment 0ms)
```

Full suites at the end, plus root typecheck:

```text
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

```text
Full balance (final-recheck-balance.log), exit 0:
 Test Files  13 passed (13)
      Tests  125 passed (125)
   Start at  23:27:28
   Duration  535ms (transform 1.32s, setup 0ms, import 3.31s, tests 167ms, environment 1ms)
Full domain (final-recheck-domain.log), exit 0:
 Test Files  126 passed (126)
      Tests  3642 passed (3642)
   Start at  23:27:28
   Duration  93.02s (transform 7.57s, setup 0ms, import 53.10s, tests 307.30s, environment 7ms)
Full player (final-recheck-player.log), exit 1:
 Test Files  1 failed | 151 passed (152)
      Tests  1 failed | 1181 passed (1182)
   Start at  23:27:28
   Duration  28.85s (transform 9.30s, setup 0ms, import 53.20s, tests 45.09s, environment 11ms)
Root typecheck (final-recheck-typecheck.log): exit 0; all seven workspaces.
```

The player failure is **only the expected pre-existing thyroid label failure**,
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, test "ignores the retired
concealment flag and preserves the scheduled external service after an answer":

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

`node tools/qa/level-four-rooms.mjs --check` also exits 0 using the specified
preload. Exact output (`m4b-qa-transform.log`):

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

### Exact manager QA steps

1. From the repository root, run `node tools/qa/level-four-rooms.mjs`. Use an
   intended disposable QA browser profile, then open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments**. If the existing
   M3 server still owns 5184, restart that QA server with this entry. This does not
   involve the owner launcher or manager QA 5183.
2. Select/verify **Level 4 M4 APP appointments**. This distinct campaign has two
   placed ordinary exam rooms (`room.app.0`, `.1`), two real hired APPs with
   frozen unique looks, a placed Training Room, cash after the seeded builds/hires,
   enabled service appointments and first per-home arrivals due on the next
   game minute. It starts paused. Its normal routine arrival timer is disabled
   to make autonomous observation/unchanged XP easy; the domain tests separately
   prove the additional scored-arrival stream is preserved.
3. Press **Play**, optionally increase speed. Watch both APPs walk in, additional
   adult visitors arrive from the sidewalk, enter separate exams and sit with
   their named providers concurrently. By approximately the first facility
   hour, the two $80 fees settle. Later pairs arrive every two facility hours
   per staffed home. No question/chart opens; Clinical XP remains unchanged.
   Click each APP/visitor for the named activity and adult age/sex.
4. In **Staff**, verify $30/hr salary, distinct APP revenue training labels and
   next training cost $150. In **Services**, verify **Appointments in clinic**,
   independent active visitors, provider names, unscored demand, fees and income
   receipts. **Management** continues to include actual APP wages and service
   income. Hire on an extra exam post should report that the two approved looks
   are in use rather than charging or substituting another provider.
5. Train one APP: the paid request queues until current care finishes, the APP
   walks to the training stool, then returns; observe continuing other-home work
   and queued/cross-covered visitors. Its subsequent served appointments pay $88
   after the first tier. Reload the **same exact QA URL** mid-service/training
   and after a payment; verify identities, progress and receipts do not restart
   or double-pay. The persisted QA campaign is resumed rather than overwritten.
6. Test a salary adjustment/praise and, after building a Break Room if desired,
   an APP break. Preview selling its home: one APP dismissal must be named.
   Cancel once, then confirm a sale/fire and observe unfinished appointments
   reroute. Firing the final APP stops new demand and sends queued visitors home
   without income. Building/upgrading more exams changes physical posts, with
   the separate approved-art limit still visible.
7. For future-home standby labels, use a **fresh disposable profile** and open
   **http://127.0.0.1:5184/level4-rooms-qa.html?rooms=placed**. This separate M3
   room campaign has the pediatric/wound homes already placed, no APPs and no
   ordinary exam homes. Hire two APPs there, press Play and inspect their
   **Waiting for pediatric services / Waiting for wound/ostomy services** states
   after arrival; no specialty visitor starts in M4. Scored-room yielding and all four existing
   Minor-Procedure APP preferences/founder fallback are covered by domain tests;
   ordinary QA scored care may also be exercised by the manager in a suitable
   campaign after integration.
8. Record `location.origin` = **http://127.0.0.1:5184**. This QA campaign/storage is
   separate from manager QA **http://127.0.0.1:5183**, owner **START_GAME.cmd ->
   http://127.0.0.1:4173** in the persistent profile, and the remote Pages origin.
   The ordinary cap-3 entry cannot open this L4 fixture. Always reload through
   the dedicated QA entry and query/profile; campaigns do not automatically
   transfer. No canonical owner pathway changed. Stop the QA server after use.

Next action: manager inspect the scoped diff, rerun normal-config/browser checks
in its environment, accept M4 and update the manager-owned current handoff, then
route the next milestone. This validated checkpoint is **LOCAL ONLY**. No Git
backup exists for this worker's changes; after acceptance, remind the owner to
say **"push to GitHub"** for the manager's scoped audited checkpoint backup.


## Level 4 M5: pediatric families and visits

Worker: Sol max, 2026-10-08 through 2026-10-09. M5a was validated before M5b,
and M5b before M5c. Implementation and required suites are complete; manager
diff review, default-pool rerun and browser acceptance remain. No agents, Git,
installs, external messages, publication, new art or clinical authoring occurred.
The concurrent APP art v6e lane and the separate pediatric content batch were
preserved. Ordinary gameplay remains capped at Level 3.

### Implementation and acceptance evidence

- **M5a:** pediatric admission requires an explicit Female/Male profile aged
  5-17, with compatible child art for the base and every approved instantiation
  profile. Names follow the frozen sex. Adult fallback and incomplete or
  out-of-range child profiles are excluded. Child demographics, name and still,
  and the distinct adult parent's name/still, are chosen once at admission.
  The existing twelve child stills were reviewed in standing and seated poses;
  authored roster briefs supply sex and visual ages, rather than visual sex or
  race inference. No appearance attribute selects disease or demand.
- **M5b:** `pediatric-family.ts` owns paired planning, reservations, travel,
  parent projection and reconciliation. It consumes the exact M2 approved
  **177** fine approach routes (36 exam, 141 waiting). Both physical places are
  checked before a single pair commit; aligned source/destination paths cross
  doorway thresholds on the same tick. Tests cover all **12 exam and 16 waiting
  door segments**, ages 9/10/17, occupied seats, reachable-room overflow and two
  safe same-room standing places. Under-10 stools are child-only; parents and
  older children take adult seats. A paused door edit that hides a reserved
  chair replaces both reservations. Occupied/reserved family rooms cannot be
  moved; sale captures a safe pair escape before removing the room/door.
  Missing access stalls both actors. Parents and children have no independent
  coffee, shopping or bathroom trips. Existing adult endoscopy, surgery and
  peri-op companion policies are unchanged.
- **M5c:** `income.pediatric_consult` runs through M4's shared APP dispatch,
  independent home demand, `clinic-visit.v1`, phase queue/transfer and actual
  provider's frozen `app-appointment-revenue.v1` machinery. The child visits
  Pediatric Waiting, then Pediatric Examination with the parent chair and APP
  stool, and departs with the parent. Real-engine tests cover two homes, training,
  lost access/restoration, mid-visit reload, sale/transfer and final-home
  cancellation without payment. The two-home ten-hour test produces **12
  completed $80 visits**; the next visits remain in transit/care at the cutoff.
  Unscored visits create no chart, patient/review slot, XP, FSRS, learning history,
  review intent or settlement. Staff now say **Ready for pediatric appointments**;
  wound/ostomy remains pending M6.
- Future scored pediatric encounters select **Pediatric Examination**, including
  founder stool routing and close/reopen/queued-care seams. Fixture-only checks
  exercise results waiting and final discharge with the same parent. There is
  no activated pediatric question content. Owner-scope guards exclude pediatric
  MRI/MRCP, sedation, endoscopy, OR/peri-op and wound/procedure routing.
- At actual completed care, with both actors at their exam reservations,
  `state.levelFourCompletion.pediatricVisitWithParent` records the operation ID,
  parent actor ID, income line and completion tick once. This existing M1
  versioned witness survives history/actor/room retirement and reload, for M8
  to read. No progression condition, reward, Level 5 successor or live cap was
  changed.

### Twelve child stills and age bounds

Source: `tools/character-mapping/level3-roster-complete-v2/roster.json`'s explicit
girl/boy briefs and intended visual ages. These are **editorial presentation
bounds**, not clinical demographic rules. All twelve existing PNG sets and the
generated registry remain unchanged; the runtime registry overlays eligibility.

| Still ID | Authored sex | Intended visual age | Compatible ages |
| --- | --- | --- | --- |
| `level3-roster-v2.021` | Female | 6 | 5-8 |
| `level3-roster-v2.022` | Male | 5 | 5-8 |
| `level3-roster-v2.023` | Female | 7 | 5-8 |
| `level3-roster-v2.024` | Male | 6 | 5-8 |
| `level3-roster-v2.025` | Female | 9 | 9-12 |
| `level3-roster-v2.026` | Male | 10 | 9-12 |
| `level3-roster-v2.027` | Female | 11 | 9-12 |
| `level3-roster-v2.028` | Male | 12 | 9-12 |
| `level3-roster-v2.029` | Female | 14 | 13-17 |
| `level3-roster-v2.030` | Male | 14 | 13-17 |
| `level3-roster-v2.031` | Female | 16 | 13-17 |
| `level3-roster-v2.032` | Male | 17 | 13-17 |

### Option-B price arithmetic

Existing pediatric fee **$80**, baseline consultation **30 game minutes**, now
APP-only provider phases and **90-minute demand per operational assigned
Pediatric Examination home**. All are editorial game balance, not clinical
timing/probability claims. The demand stream is additional to scored patients
and uses M4's bounded queue and home-first reachable cross-cover.

| Baseline calculation for one home | Per game hour |
| --- | ---: |
| Revenue: $80 x 60 / 90 | $53.33 |
| Default APP salary | $30.00 |
| Pediatric Examination upkeep | $2.00 |
| Full Pediatric Waiting upkeep share (conservative single-home allocation) | $1.00 |
| Remainder: $53.33 - $30 - $2 - $1 | **$20.33** |

This covers salary plus both room-upkeep shares at normal demand. With two
homes sharing one waiting room: $106.67 - $60 - $4 - $1 = **$41.67/hr**. Opening
travel, training, breaks, outages and scored-room priority can reduce realized
income. APP revenue tiers remain M4's 0/10/20/30/40%, giving $80/$88/$96/$104/$112
per completed visit. The actual provider's fee freezes at care start and is
preserved across sale, training changes and reload; no repeat credit occurs.

### Save compatibility

Save version stays **5**. Existing optional `pediatricFamilies`, pediatric
`clinic-visit.v1` links and `level-four-completion.v1` fields remain optional;
pre-M5 saves may omit them. M1 family records may omit the new optional
`movement` field. New travel uses **`pediatric-pair-travel.v1`** with aligned
child/parent paths, shared index/tick and required door IDs. Current save
validation checks same-room live actors, equal-length aligned remaining paths,
valid frozen pediatric age/sex/still and a same-room reservation, including
native fractional approach points. Invalid/split or incompatible pediatric
records are rejected, not silently repaired with adult art or rerolled identity.
Already-absent family/witness fields are not invented on legacy load, and
legacy APP visits without a fee marker retain their accepted fee. The M1 age-9
fixture was corrected from the younger `.021` still to compatible `.025`.
Durable completion does not require retaining the originating room/actors.

### Files changed (41 paths)

```text
apps/player/src/art/characterStillRegistry.test.ts
apps/player/src/art/characterStillRegistry.ts
apps/player/src/facility/FacilityScene.ts
apps/player/src/facility/types.ts
apps/player/src/session/appAppointmentsViewModels.test.ts
apps/player/src/session/characterActivityPresentation.ts
apps/player/src/session/pediatricAppointmentsViewModels.test.ts
apps/player/src/session/pediatricFamilyPresentation.test.ts
apps/player/src/session/pediatricFamilyPresentation.ts
apps/player/src/session/viewModels.ts
packages/balance-config/src/index.ts
packages/balance-config/src/pediatric-support-routes.json
packages/balance-config/src/service-income-catalog.ts
packages/game-domain/src/app-appointments.ts
packages/game-domain/src/appearance.ts
packages/game-domain/src/characterStillCatalog.test.ts
packages/game-domain/src/characterStillCatalog.ts
packages/game-domain/src/diagnostic-timing.ts
packages/game-domain/src/displaced-routing.ts
packages/game-domain/src/index.ts
packages/game-domain/src/patient-amenities.ts
packages/game-domain/src/patientDemographics.ts
packages/game-domain/src/pediatric-eligibility.ts
packages/game-domain/src/pediatric-family.ts
packages/game-domain/src/persistence.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/retail-operations.ts
packages/game-domain/src/selectors.ts
packages/game-domain/src/service-operations.ts
packages/game-domain/src/types.ts
packages/game-domain/tests/level-four-persistence.test.ts
packages/game-domain/tests/patient-appearance-rotation.test.ts
packages/game-domain/tests/pediatric-appointments.test.ts
packages/game-domain/tests/pediatric-family.test.ts
packages/game-domain/tests/pediatric-identity.test.ts
tests/fixtures/pediatric-appointments.ts
tests/fixtures/pediatric-families.ts
tools/qa/level-four-rooms-bootstrap.ts
tools/qa/level-four-rooms.mjs
docs/execplans/level4-launch-plan-20261008.md
docs/execplans/owner-requests-20261008.md
```

Shared-file edits are confined to M5 seams. All edited code/data/documents are
UTF-8 without BOM, LF. Hash-based before copies and the scoped unified diff
(no Git) are in `.local-dev/level4-m5/before/` and `scoped.diff`; the path manifest
is `changed-paths.json`. The QA `.mjs` change is one URL log line; its before
copy is reconstructed as described in `audit-notes.txt` because the initial
snapshot covered TS/TSX/JSON/documents. Local validation logs and the existing-art
contact sheet are scratch evidence, not generated gameplay assets.

### Validation: exact commands and output

All tests use the repository's **ordinary configs**, `--pool=threads`, and the
specified `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

No exclusion, replacement config, changed timeout or skipped test was used.
M5a's focused domain run passed **4 files / 34 tests** (23:41:34, 1.62s), player
registry **1 file / 10 tests** (23:41:44, 1.89s), then domain typecheck passed.
M5b's family/persistence/retail run passed **3 files / 57 tests** (23:57:40, 4.16s),
player family/approved pediatric rooms/peri-op presentation **4 files / 25 tests**
(23:52:00, 4.13s), then root seven-workspace typecheck passed before M5c.
The initial M5b command also named nonexistent `level2-endoscopy-flow.test.ts`;
that file was not counted. The actual `level-two-endoscopy-flow.test.ts` ran
successfully in subsequent focused and full validation.

Final focused and full commands:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/pediatric-appointments.test.ts tests/pediatric-family.test.ts tests/patient-appearance-rotation.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/pediatricAppointmentsViewModels.test.ts src/session/pediatricFamilyPresentation.test.ts src/session/appAppointmentsViewModels.test.ts src/facility/approvedPediatricWaitingRoom.test.ts src/facility/approvedPediatricExaminationRoom.test.ts src/facility/periopCompanionPresentation.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
node tools/qa/level-four-rooms.mjs --check
```

```text
Final focused domain (exit 0):
 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  00:22:14
   Duration  3.23s (transform 3.36s, setup 0ms, import 4.67s, tests 2.19s, environment 0ms)

Focused player (exit 0):
 Test Files  6 passed (6)
      Tests  28 passed (28)
   Start at  00:12:53
   Duration  4.26s (transform 6.53s, setup 0ms, import 9.88s, tests 4.13s, environment 0ms)

Full balance-config (exit 0):
 Test Files  13 passed (13)
      Tests  125 passed (125)
   Start at  00:23:23
   Duration  520ms (transform 1.49s, setup 0ms, import 3.45s, tests 156ms, environment 1ms)

Full game-domain (exit 0):
 Test Files  129 passed (129)
      Tests  3663 passed (3663)
   Start at  00:23:23
   Duration  94.49s (transform 7.45s, setup 0ms, import 53.47s, tests 313.01s, environment 7ms)

Full player (exit 1; expected existing thyroid failure only):
 Test Files  1 failed | 153 passed (154)
      Tests  1 failed | 1185 passed (1186)
   Start at  00:23:23
   Duration  30.49s (transform 9.33s, setup 0ms, import 60.43s, tests 43.22s, environment 13ms)

Root typecheck: exit 0, all seven workspaces.
QA entry transform: exit 0.
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

Known player failure: `src/session/surgeryCenterServicePreviews.test.ts:85`,
`surgery-center test timing previews > ignores the retired concealment flag and
preserves the scheduled external service after an answer`; `pendingLabel` lacks
`Off-site thyroid fine-needle aspiration`. No new player failures. The initial
full domain run exposed one obsolete test requiring all child selection to be
ineligible; its replacement checks compatible ages and excludes under-5s.
Typecheck also caught a redundant results-wait comparison after the new branch;
it was removed and all workspaces passed. Exact retained logs are
`.local-dev/level4-m5/{m5a-domain,m5a-player,m5b-domain,m5b-player,m5c-player,
final-focused-domain,final-balance,final-domain,final-player,final-typecheck,
final-qa}.log`. Browser/visual acceptance was not run by this worker.

### Exact manager QA steps

1. From the repository root run `node tools/qa/level-four-rooms.mjs`, or reuse
   the manager's existing 5184 QA server if it serves the current source. Open
   exactly **http://127.0.0.1:5184/level4-rooms-qa.html?apps=pediatrics** in a
   disposable persistent QA browser profile. Do not open the ordinary player
   entry for this fixture. No other server was stopped by the worker.
2. Verify campaign **Level 4 M5 pediatric families**, starting paused with one
   real hired APP (`app.peds.0`), Pediatric Examination (`room.peds.exam.0`),
   Pediatric Waiting (`room.peds.wait`), Front Desk and a Training Room. The
   first pediatric home demand is due on the next game minute. Routine scored
   arrivals are disabled only in this fixture. Press **Play**, optionally 4x.
3. Watch the named child and parent arrive from the sidewalk, cross Front Desk
   together, share Pediatric Waiting, then enter Pediatric Examination together.
   The child takes the table, parent takes `parentChair`, APP takes the clinician
   stool. Hover/click the child for frozen age/sex and the adult for **Parent of
   [child name]**. Observe additional pairs: under-10 children may use kid stools,
   older children and every parent use adult seats. Both actors leave together.
4. In **Services**, verify the pediatric appointment is available and states
   **90 min per staffed pediatric exam home / unscored**, shows **With parent**,
   provider name and actual income. The first completed baseline visit pays $80;
   later home demand repeats every 90 game minutes. No chart/question opens and
   Clinical XP stays 0. Confirm the APP's pediatric standby label is **Ready for
   pediatric appointments**; wound/ostomy remains pending.
5. Reload the **same full QA URL/profile** during arrival, waiting and care,
   and after payment. Verify child/parent identities, seats/progress and receipts
   persist without rerolls or duplicate income. In Staff, train the APP; current
   care finishes before training starts, queued families remain together and
   later appointments after tier one pay $88 with the provider's frozen fee.
6. Pause during waiting and build another reachable waiting room if testing
   overflow. Filled adult seats must send the pair to another reachable waiting
   room or two same-room standing places. A move of a reserved/occupied family
   room must reject. Remove access and observe both actors stall; restore access
   and observe resumption. Preview/cancel an exam sale once, then confirm in a
   disposable campaign: remaining work transfers if another home/provider is
   available; selling the final exam sends the pair home without an unfinished
   fee or completion witness. The engine fixtures cover the two-home transfer.
7. Record `location.origin` = **http://127.0.0.1:5184**. This M5 campaign is
   separate from the M4 campaign in the same QA storage, manager QA 5183,
   **START_GAME.cmd -> http://127.0.0.1:4173** in the owner's persistent profile,
   and remote Pages saves. Query changes select QA campaigns; origins/profiles
   have separate storage. Always reload through the dedicated entry. No
   canonical owner opening pathway changed. Stop only the QA server you started.

Next action: manager inspect the scoped diff and logs, rerun default-pool checks
and browser QA in its environment, accept M5, update manager-owned
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`, then resume the manager-owned launch plan. This
validated checkpoint is **LOCAL ONLY**; no Git backup was created. After
acceptance, remind the owner to say **"push to GitHub"** for the manager's scoped,
audited checkpoint backup.

### M5 render fix (2026-10-09)

Manager's Chrome freeze reproduced in the real pediatric QA fixture using the
scene's actual interpolation/hop methods: `sampleRouteMotion` read `start.x`
from an empty render path. The paired domain paths/indices were valid. Their
repeated synchronization points were removed by `appendPoint` during a render
handoff while logical indices retained them; advancement then compacted past
the shortened path. The handoff now preserves every successor node. Targets,
progress and compaction stay within the path. Empty/sparse/nonfinite routes or
bad indices/tracks park at the actor's current tile; an actor-level boundary
clears its bad route/hop state and continues rendering the other actors.

Follow-up files: `apps/player/src/facility/routeMotion.ts`, `routeMotion.test.ts`,
`pediatricRouteMotion.test.ts`, `FacilityScene.ts`, and this plan. No domain,
save-format, balance, clinical or art/catalog/appearance file was edited; the
concurrent APP v6e integration lane was preserved. UTF-8 without BOM, LF; no
Git, installs, agents, browser storage access or publication.

Regression checks: a padded parked-to-family handoff; nine malformed/empty
route cases; eight corrupt-track cases; an injected actor failure followed by
a healthy actor; and **180 QA fixture ticks / three game hours at 4x**, with a
mid-care save/reload and more than 8,000 actual scene route samples. The latter
asserts zero exceptions inside the actor boundary (so fallback cannot mask a
remaining bug), finite coordinates and a paid pediatric visit. Only Phaser
construction is stubbed; this is not a real Chrome visual pass.

Ordinary configs, threads and the same specified preload, with no exclusions:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/routeMotion.test.ts src/facility/pediatricRouteMotion.test.ts src/facility/characterPauseArrival.test.ts src/session/pediatricFamilyPresentation.test.ts src/session/pediatricAppointmentsViewModels.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
```

```text
Before fix: 2 failed files; 2 failed / 22 passed tests. QA fixture throws:
TypeError: Cannot read properties of undefined (reading 'x')
  sampleRouteMotion src/facility/routeMotion.ts:389:16
  FacilityScene.getCharacterRoutePresentation src/facility/FacilityScene.ts:6053:20

Focused player (exit 0):
 Test Files  5 passed (5)
      Tests  60 passed (60)
   Start at  00:46:26
   Duration  5.93s (transform 11.20s, setup 0ms, import 15.75s, tests 2.04s, environment 0ms)

FULL player (exit 1; known thyroid failure only):
 Test Files  1 failed | 154 passed (155)
      Tests  1 failed | 1207 passed (1208)
   Start at  00:47:56
   Duration  30.31s (transform 9.72s, setup 0ms, import 59.06s, tests 45.91s, environment 11ms)

FULL game-domain (exit 0):
 Test Files  129 passed (129)
      Tests  3665 passed (3665)
   Start at  00:47:56
   Duration  94.26s (transform 7.54s, setup 0ms, import 55.68s, tests 309.55s, environment 7ms)

npm.cmd run typecheck: exit 0; all seven workspaces.
```

The sole player failure remains `surgeryCenterServicePreviews.test.ts:85`, the
existing missing external-thyroid pending label. Counts reflect the current
shared worktree, including concurrent integration tests. Actual follow-up diff,
before copies and exact logs: `.local-dev/level4-m5/render-fix/` (`scoped.diff`,
`repro.log`, `focused-player.log`, `full-player.log`, `full-domain.log`,
`typecheck.log`). Manager rerun: reload the same exact
**http://127.0.0.1:5184/level4-rooms-qa.html?apps=pediatrics**, Resume, then 4x;
verify no page errors and changing canvas captures over eight 5-second intervals
while families move/sit and $80 fees pay. A storage reset is not required by this
render-only fix. QA origin remains 5184, separate from owner START_GAME.cmd /
http://127.0.0.1:4173; no opening pathway changed. Browser acceptance remains
manager-owned. This correction is **LOCAL ONLY**; after acceptance retain the
owner **"push to GitHub"** reminder.

## Level 4 M6: MRI and wound/ostomy services

Sol worker handoff, 2026-10-09. M6a MRI was implemented and passed focused
balance/domain/player checks and root typecheck before M6b implementation began.
M6b then passed its own focused checks. Implementation and automated validation
are complete; manager diff review and browser acceptance remain outstanding.
No Git, installs, agents, external messages, clinical authoring or art changes.

### Implemented contracts

- Exact MRI scanner services are `service.mri`, `service.mrcp` and
  `service.extremity_mri`, with exact onsite/outside route pairs and one
  `income.mri` acquisition mapping. A generic MRI label/profile does not select
  the scanner. Specialized breast, liver, pelvic, hepatobiliary-contrast,
  repeat/combined and retained outside protocols keep their existing paths.
  Explicit external-only dispositions must opt in to the exact equivalence;
  pediatric services remain unsupported. No sedation or new clinical prose.
- One MRI room supplies one existing imaging-technician post. The role's maximum
  is now four for US/X-ray/CT/MRI physical homes. The live Level 3 cap stays three;
  existing Level 3 imaging rooms still supply their original three posts.
- New scheduled MRI visitors carry adult age/sex, appearance and name in
  `clinic-visit.v1` and the existing `diagnostic-order.v1` plan. Their acquisition
  uses `diagnostic-physical-work.v1` through the normal room/technician queue.
  Reads use the existing diagnostic read dispatcher and Reading workstations.
  Base acquisition is 60 game minutes; interpretation is 5 onsite or 30 outside.
  The acquisition releases its technician; the scanner remains held until the
  patient clears it. Results/departure wait for actual read and return witnesses,
  never the forecast. Chart MRCP orders run through the same scanner and reader.
- Existing acquisition receipts settle $240 once, plus the existing additive
  $5 when a local radiologist completes a read. The inert `income.image_read`
  row is not used as a second read payment. Existing training, Reading and room
  upgrade snapshots apply at their established boundaries.
- Wound care and ostomy support are APP provider visits, each 30 game minutes,
  $60 and $75 respectively, each with a 180-minute demand stream per staffed
  Wound/Ostomy home. They reuse APP admission, home preference/cross-cover,
  provider occupancy, training queues, frozen `app-appointment-revenue.v1` and
  ordinary receipt settlement. No founder or peri-op nurse covers this clinic;
  no scored case, Clinical XP, FSRS evidence or chart is created.
- The first physically completed wound or ostomy visit records
  `levelFourCompletion.woundOstomyCareVisit`. It survives reload, room sale and
  removal of detailed service/receipt history. It preserves pediatric evidence
  and leaves completion acknowledgement and progression to M8.
- APP standby now says `Ready for wound/ostomy appointments`. Wound procedures
  stay blocked in scheduled, explicit visitor and encounter paths, with
  `Wound procedures are deferred` in Services.
- Existing `income.wound_supply` authorized-order metadata/outlets are retained.
  No existing visit-to-supply authorization binding was found. Automatic supply
  authorization/dispensing from these new visits is deferred; visits create no
  retail order or supply receipt. Services labels this existing basket
  `Authorized supply orders only`, including its existing Pharmacy/clinic outlets.
- Player adapters bind actual MRI visitors and chart patients to `patient-seated`
  during acquisition, the technician to `operator`, wound visitors to
  `recliner:patient` and APPs to `stool:clinician`. Activity names the visitor/read;
  MRI result ETA comes from the shared diagnostic forecast. Finance uses existing
  acquisition/read/care receipts. `routeMotion.ts` and `FacilityScene.ts` match
  their before images, including M5's render fix.

All durations, cadences and fees above are editorial game values pending review,
not clinical claims. No clinical statement, source record, concept or question
content changed or was promoted.

### Option-B arithmetic

| Baseline function | Scheduled gross/hour | Direct staff share + room upkeep/hour | Remainder/hour |
| --- | --- | --- | --- |
| MRI acquisition: $240 every 240 minutes | $240 x 60 / 240 = $60 | Full dedicated technician salary $18 + MRI upkeep $8 = $26 | $34 |
| Wound/Ostomy home: $60 and $75, each every 180 minutes | ($60 + $75) x 60 / 180 = $45 | One APP $30 + clinic upkeep $2 = $32 | $13 |

MRI's budget allocates a full technician salary to its home post. Acquisition
occupies 60/240 = 25% of its game-time capacity. The additive read fee belongs to
the existing Reading business and is excluded from the $34 acquisition margin.
Reading's existing idle outside work retains its own salary/upkeep coverage.
Wound/Ostomy's two streams use 60 minutes of care per three game hours before
travel. No seed fee or demand cadence adjustment was needed. Shared facility
overhead remains the M8 reconciliation, separate from these direct-cost budgets.

The real dispatcher test ran two wound homes for nine game hours: six wound and
six ostomy receipts, $810 gross - 2 x ($30 + $2) x 9 = $234 remaining. No global
visitor cap suppressed a home's stream. Existing room upgrades and APP training
compose once: $60 x 1.12 room x 1.20 APP = $80.64, preserved after sale and
cross-cover by a different, more trained APP.

### Save compatibility

Save schema remains version 9. New MRI visitor state adds an optional frozen
diagnostic plan, a `clinic-visit.v1` MRI kind and `waiting_for_results` status.
Marked plans are strictly parsed with their existing physical/read contracts.
Old unmarked visitors are not retroactively given MRI plans or additive reads;
existing frozen chart plans retain their accepted routes, durations and fees.
Specialized outside routes and the generic MRI profile are unchanged.

Wound/ostomy reuse the existing clinic kinds; their optional home preference,
phase-flow and APP revenue marker now validate alongside adult/pediatric visits.
Room revenue is validated against the APP marker's frozen pre-training base fee,
then APP revenue against the final quote. This retains both quotes without
reapplying training or room upgrades on reload/reroute. Omitted legacy markers
stay omitted on load. Arrival, active care, completed visits, MRI scanning and
local/external interpretation are exercised across serialization. Durable care
witnesses do not require retaining their room or detailed operation/receipt.

### Files changed (32 paths)

- `packages/balance-config/src/diagnostic-timing.ts`
- `packages/balance-config/src/index.ts`
- `packages/balance-config/src/mri-services.ts` (new)
- `packages/balance-config/src/mri-services.test.ts` (new)
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/prototype-balance.test.ts`
- `packages/balance-config/src/service-income-catalog.ts`
- `packages/balance-config/src/wound-ostomy-services.test.ts` (new)
- `packages/game-domain/src/app-appointments.ts`
- `packages/game-domain/src/diagnostic-orders.ts`
- `packages/game-domain/src/diagnostic-timing.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/staff-dispatch.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/app-appointments.test.ts`
- `packages/game-domain/tests/level-four-persistence.test.ts`
- `packages/game-domain/tests/mri-services.test.ts` (new)
- `packages/game-domain/tests/wound-ostomy-services.test.ts` (new)
- `apps/player/src/session/appAppointmentsViewModels.test.ts`
- `apps/player/src/session/characterActivityPresentation.ts`
- `apps/player/src/session/managementViewModels.ts`
- `apps/player/src/session/mriServicesViewModels.test.ts` (new)
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/session/woundOstomyServicesViewModels.test.ts` (new)
- `tests/fixtures/mri-appointments.ts` (new)
- `tests/fixtures/wound-ostomy-appointments.ts` (new)
- `tools/qa/level-four-rooms-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`
- `docs/execplans/level4-launch-plan-20261008.md`
- `docs/execplans/owner-requests-20261008.md`

Scoped before images, hash manifest, diff and unabridged logs are in
`.local-dev/level4-m6/` (`baseline.json`, `before/`, `changed-paths.json`,
`scoped.diff`). These were produced with filesystem access, without Git.
All scoped files are UTF-8 without BOM and LF. No art/source/clinical-content
path changed. Shared work present at intake was preserved.

### Validation commands and exact output

Ordinary repository Vitest configs, `--pool=threads`, and the requested preload;
no filters or exclusions in the FULL runs. No dependency changes or test-config
replacement. Commands were run from the repository in PowerShell:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'

# M6a, before starting M6b
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/mri-services.test.ts src/diagnostic-timing.test.ts src/service-income-catalog.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/mri-services.test.ts tests/diagnostic-orders.test.ts tests/diagnostic-service-operations.test.ts tests/diagnostic-timing-persistence.test.ts tests/reading-radiologist-gameplay.test.ts tests/service-operations.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/mriServicesViewModels.test.ts src/session/characterActivityPresentation.test.ts src/session/diagnosticTimingViewModels.test.ts --pool=threads
npm.cmd run typecheck

# M6b
npm.cmd run test --workspace @gamify-surgery/balance-config -- src/wound-ostomy-services.test.ts src/service-income-catalog.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/wound-ostomy-services.test.ts tests/app-appointments.test.ts tests/app-staff.test.ts tests/pediatric-appointments.test.ts tests/level-four-persistence.test.ts tests/employee-training-benefits.test.ts tests/employee-training-persistence.test.ts tests/retail-operations.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/woundOstomyServicesViewModels.test.ts src/session/appAppointmentsViewModels.test.ts src/session/pediatricAppointmentsViewModels.test.ts src/session/economyViewModels.test.ts src/session/mriServicesViewModels.test.ts --pool=threads

# Final presentation check, including chart MRI table binding
npm.cmd run test --workspace @gamify-surgery/player -- src/session/mriServicesViewModels.test.ts src/session/woundOstomyServicesViewModels.test.ts --pool=threads

# FULL suites and root typecheck
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck

# QA entry validation: no listener or browser storage
node tools/qa/level-four-rooms.mjs --check
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level4-m6/qa-tsconfig.json
```

```text
M6a focused balance (exit 0):
 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  01:18:28
   Duration  347ms (transform 224ms, setup 0ms, import 491ms, tests 28ms, environment 0ms)
M6a focused domain (exit 0):
 Test Files  6 passed (6)
      Tests  107 passed (107)
   Start at  01:18:28
   Duration  10.98s (transform 6.03s, setup 0ms, import 9.34s, tests 20.93s, environment 1ms)
M6a focused player (exit 0):
 Test Files  3 passed (3)
      Tests  17 passed (17)
   Start at  01:18:28
   Duration  3.68s (transform 5.30s, setup 0ms, import 7.29s, tests 1.84s, environment 0ms)
M6a root typecheck: exit 0; all seven workspaces.

M6b focused balance (exit 0):
 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  01:26:22
   Duration  365ms (transform 177ms, setup 0ms, import 299ms, tests 11ms, environment 0ms)
M6b focused domain (exit 0):
 Test Files  8 passed (8)
      Tests  120 passed (120)
   Start at  01:28:19
   Duration  8.14s (transform 6.88s, setup 0ms, import 11.35s, tests 14.96s, environment 0ms)
M6b focused player (exit 0):
 Test Files  5 passed (5)
      Tests  15 passed (15)
   Start at  01:28:19
   Duration  3.86s (transform 7.49s, setup 0ms, import 10.94s, tests 2.19s, environment 0ms)
Final MRI/wound presentation (exit 0):
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  01:33:36
   Duration  2.30s (transform 2.48s, setup 0ms, import 3.31s, tests 725ms, environment 0ms)

FULL balance-config (exit 0):
 Test Files  15 passed (15)
      Tests  129 passed (129)
   Start at  01:29:39
   Duration  513ms (transform 1.26s, setup 0ms, import 3.58s, tests 160ms, environment 1ms)
FULL game-domain (exit 0):
 Test Files  131 passed (131)
      Tests  3679 passed (3679)
   Start at  01:29:00
   Duration  94.65s (transform 8.20s, setup 0ms, import 56.55s, tests 309.78s, environment 8ms)
FULL player (exit 1; expected known thyroid failure only):
 Test Files  1 failed | 156 passed (157)
      Tests  1 failed | 1211 passed (1212)
   Start at  01:34:07
   Duration  23.55s (transform 7.88s, setup 0ms, import 46.25s, tests 34.66s, environment 8ms)
Root npm.cmd run typecheck: exit 0; all seven workspaces.
QA --check (exit 0):
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
QA bootstrap/fixture TypeScript check: exit 0; no output.
```

The sole player failure is the previously known
`src/session/surgeryCenterServicePreviews.test.ts:85:52`: the pending label omits
`Off-site thyroid fine-needle aspiration`. Full logs are `full-balance-final.log`,
`full-domain.log`, `full-player-final.log` and `full-typecheck-final.log` in the
scratch directory; serial focused logs are `m6a-*-final.log`,
`m6b-domain-final.log`, `m6b-player-final.log`, `m6b-balance-3.log`, and
`m6-presentations-final.log`. The old three-technician catalog assertion was
updated for the fourth Level 4 physical MRI post.

### Exact manager QA steps

1. From the repository, run `node tools/qa/level-four-rooms.mjs`. Use the same
   disposable QA browser profile used for M3-M5. Open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=mri**. The console should show
   `location.origin=http://127.0.0.1:5184`. Resume `Level 4 M6 MRI services`, press
   Play, then 4x. A new campaign starts paused with a placed MRI, Reading and
   Training room, technician, radiologist and the first MRI visitor due next tick.
2. Observe the named visitor enter the MRI and sit on its table with the
   technician at the console. Inspect Services: $240 MRI, 60-minute acquisition,
   5 onsite/30 external interpretation game estimates and a live result ETA.
   After acquisition, observe a $240 receipt, technician release, visitor return
   and a real read at the radiologist's Reading workstation. The local read
   settles one additive $5. Continue to departure; check the canvas keeps moving
   and the browser has no page errors. MRI demand continues every four game hours.
3. Pause/reload during acquisition and during local reading; Resume the same
   campaign. Confirm name/age/sex, elapsed work and quoted fees survive, with no
   duplicate $240/$5. To exercise fallback, fire the radiologist after a visit
   finishes, before the next visitor is accepted; the next visitor uses the same
   scanner plus 30-minute external interpretation and has no local-read receipt.
   Existing accepted local reads keep their frozen queue contract.
4. Open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=wound**. Resume
   `Level 4 M6 wound/ostomy visits`, Play, then 4x. Its separate paused campaign
   has a placed Wound/Ostomy Clinic, one APP and Training. Wound care is due next
   tick; ostomy support starts 90 minutes later. Each stream repeats at 180 minutes.
5. Observe the named adult in the recliner with the APP on the stool; Staff names
   the visit and uses `Ready for wound/ostomy appointments` when idle. Services
   shows $60/30-minute wound care and $75/30-minute ostomy support with per-home
   unscored demand. Each completed visit pays once; Clinical XP stays zero and no
   patient chart appears. Wound procedure remains deferred. Supply baskets say
   authorized orders only; routine visits produce no supply order or receipt.
6. Pause/reload during care and after a receipt. Check identity, provider, fee
   and progress persist without duplicate income. Queue APP training during
   care: finish that visit, train, preserve waiting demand and use the returning
   APP's training-adjusted fee for newly started care. The first completed care
   witness is already exercised through save/reload, sale and history removal by
   `wound-ostomy-services.test.ts`; M8 will present it in progression.
7. Revisit both URLs in the same profile: their named campaigns resume separately.
   Existing QA campaigns are not overwritten. The QA entry's level override is
   isolated from ordinary gameplay and does not enable Level 4 in the main game.

These QA campaigns use origin **5184**, with separate saves from the owner's
**START_GAME.cmd -> http://127.0.0.1:4173** and the canonical GitHub Pages origin.
Do not open them at localhost, a different port or a different profile and expect
the same campaign. The owner opening pathway and saves were not changed. No
browser storage was read/written by this worker. Manager owns browser acceptance
and CURRENT_THREAD_HANDOFF. This milestone is **LOCAL ONLY**; after acceptance,
remind the owner to say **"push to GitHub"** for the manager's audited checkpoint.


## Level 4 M7: pediatric batch assembly

Sol worker, 2026-10-09, integration subjob under the manager's accepted scope
review. Runtime assembly is implemented. **Manager acceptance remains pending:
V3 has one unresolved editorial-quality failure covering nine authored
variants.** No clinical text was rewritten to resolve it and the quality guard
was not relaxed. Browser acceptance and any follow-up content assignment remain
manager-owned.

### Assembled release and operational contracts

- All **20 exact variants / 10 objectives** are registered in the explicitly
  `synthetic_unapproved_prototype` release. Its inventory is **360 concepts /
  1,090 cases / 1,395 decision nodes**: nine new concepts, twenty new cases and
  twenty nodes. The unchanged reused
  `concept.umbilical-epigastric-hernia.clinical-recognition` occurs exactly once.
  Existing adult variants of that concept remain eligible for old due reviews
  before Level 4; histories and frozen charts are retained.
- The new `PEDIATRIC_CLINIC_PROTOTYPE_ADMISSION_MANIFEST` identifies the exact
  case/question/concept/profile/family-context IDs and records the manager's
  **2026-10-09 scope/editorial acceptance**, `clinicalApproval: false`, no named
  clinician approval, and no public-release authorization. All batch records
  remain `needs_clinician_review`. The original standalone authoring manifest
  remains unchanged, including its pre-assembly `assemblyAuthorized: false`
  receipt; the later assembly authorization is a separate record.
- A shared semantic eligibility helper gates explicit admission, automatic
  arrivals and availability at **Level 4 plus an operational, accessible
  Pediatric Examination Room**. A same-named capability supplied by an ordinary
  Examination Room cannot bypass the room requirement. Pediatric semantic
  stage gating remains at 4 if mechanical stage/capability fields drift.
- Admission freezes the batch's exact named child, constrained age/sex,
  instantiation profile and authored compatible child still, and the exact
  named mother/father with a compatible adult still. An admission name override
  cannot recombine that family. All twenty identities round-trip through saves.
  No new art, appearance-based disease weights, adult-default child vitals or
  source/claim/prose changes were introduced.
- Scored charts use M5's paired Pediatric Waiting / Pediatric Examination
  travel, reservations, child table, parent chair and founder stool. Actual
  lifecycle checks cover ages 9/10/17, under-10 child-only stools, check-in,
  waiting, care, feedback, paired departure, reload and actor/room retirement.
- Completed scored care with the parent physically at the exam reservation
  fills M5/M1's existing `levelFourCompletion.pediatricVisitWithParent` once,
  with `serviceOperationId: null` and the actual `encounterId`, parent ID,
  completion tick and existing income-line discriminator. There is no second
  witness or save-version change. Unanswered, waiting-room-only and split-parent
  completions cannot earn it. Existing unscored APP behavior is retained; scored
  visits use the existing question/XP/FSRS flow and create no APP service visit.
- Runtime answer order remains randomized at the existing freeze boundary.
  All twenty explicit timing declarations are registered. Every key and
  distractor was checked: these variants offer recognition, counseling or
  referral, with **no enacted testing choices or result gates**. No pediatric
  MRI, sedation, endoscopy, OR or wound-procedure route is admitted. Unsupported
  service requests, including distractors, fail the shared gate. Existing
  runtime wait-estimate machinery for testing choices remains unchanged; this
  batch has no testing choices requiring an ETA.
- Ordinary gameplay is still capped at **Level 3**. Progression, services,
  prices, approved clinical families, canonical concept versions and FSRS
  records are unchanged. M8 retains progression work.

### Deferred variants and review findings

**Runtime/testing deferrals: none.** All twenty variants have complete no-test
declarations and supported outpatient routing. The assembly manifest's
`deferredVariants` is empty. Scope acceptance is not clinical approval.

The unchanged global `pilot-content.test.ts:71` guard reports the following
nine keys as uniquely longest by character count. These are recorded content
defects for manager/clinician review, not runtime testing deferrals. Their
authored labels, rationales, concepts and review states are preserved; none was
added to the immutable approved exception list. All twenty remain draft
prototype content pending the manager's disposition of this failed gate.

| Exact question variant ID | Key characters | Longest distractor characters |
| --- | ---: | ---: |
| `question.pediatric-clinic.upper-midline-lump.v1` | 17 | 16 |
| `question.pediatric-clinic.epigastric-standing-bulge.v2` | 17 | 16 |
| `question.pediatric-clinic.supraclavicular-neck-lump.v1` | 46 | 42 |
| `question.pediatric-clinic.intermittent-retraction-followup.v2` | 55 | 53 |
| `question.pediatric-clinic.sunken-chest-exercise-limits.v1` | 51 | 46 |
| `question.pediatric-clinic.pectus-new-sports-fatigue.v2` | 60 | 54 |
| `question.pediatric-clinic.prominent-chest-brace-question.v1` | 47 | 41 |
| `question.pediatric-clinic.carinatum-nonsurgical-options.v2` | 55 | 48 |
| `question.pediatric-clinic.child-wants-plan-explained.v2` | 45 | 44 |

Machine-readable case/question IDs and counts:
`.local-dev/level4-m7/editorial-findings.json`. The manager should assign a
bounded authorized wording review/resolution and rerun V3 before accepting M7;
this integration brief excludes clinical rewriting. Named clinician approval
of an exact version remains a separate gate.

### Files changed

The necessary integration seams include reducer admission/freezing and the
existing M5 family/witness helper in addition to the release and new eligibility
helper. Historical tests now scope their inventory to their original bank;
their existing counts and protected SHA goldens are retained. The active-bank
inventory and adult-only display assumption now include the admitted children.
The new domain and player checks cover actual admission, movement, frozen
presentation, saves and the shared witness. No clinical authoring source file
was changed.

All **31** owned paths follow; `.local-dev/level4-m7/scoped.diff` contains the
actual captured before/after diff without using Git.

- `apps/player/src/session/pediatricChartsViewModels.test.ts` (new)
- `docs/execplans/level4-launch-plan-20261008.md`
- `docs/execplans/owner-requests-20261008.md`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-11/board-expansion-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-12/board-expansion-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-13/early-levels-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-17-bread-and-butter/bread-butter-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-level3/level3-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-admission.test.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/patient-library-wording-repair.test.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/clinical-case-eligibility.ts` (new)
- `packages/game-domain/src/index.ts`
- `packages/game-domain/src/patientDemographics.test.ts`
- `packages/game-domain/src/pediatric-family.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/routine-patient-availability.ts`
- `packages/game-domain/tests/approved-clinical-admission.test.ts`
- `packages/game-domain/tests/clinical-content-withdrawal.test.ts`
- `packages/game-domain/tests/gs028-20261003-batch.test.ts`
- `packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts`
- `packages/game-domain/tests/patient-supply.test.ts`
- `packages/game-domain/tests/pediatric-clinic-admission.test.ts` (new)
- `tests/fixtures/pediatric-charts.ts` (new)
- `tools/qa/level-four-rooms-bootstrap.ts`

Preservation audit: 897 clinical/domain/balance/player/test/QA source paths were
hashed at intake; 872 are byte-exact, the remaining changes are in the named
lane, and **zero unowned intake paths changed**. Every owned artifact is UTF-8
without BOM with LF line endings. Original approved content and all six batch
clinical-authoring modules, family contexts, sources and claims are untouched.
Evidence: `.local-dev/level4-m7/{before/,before-handoff/,changed-paths.json,
preservation.json,scoped.diff}`. Before-handoff copies preserve the manager's
latest coordination entries before this append.

### Validation commands and exact final output

Used the **ordinary existing package configs with `--pool=threads`** and the
brief's existing preload; no alternate configs, exclusions or timeout changes.
The initial full runs exposed obsolete inventory/display assumptions, which
were mechanically updated while retaining historical counts/goldens. Final
required results are below. All logs are retained under `.local-dev/level4-m7/`.

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-08-pediatric-clinic --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
node tools/qa/level-four-rooms.mjs --check
```

| Required check | Result |
| --- | --- |
| V3 full clinical content | Exit 1: 607 passed / 1 failed; nine pediatric uniquely-longest keys in the unchanged guard |
| Pediatric batch | Exit 0: 19/19, two files |
| FULL game-domain | Exit 0: 3,712/3,712, 132 files |
| FULL player | Exit 1: 1,232 passed / only the known thyroid failure, 158 files |
| Root typecheck | Exit 0, all seven workspaces |
| Dedicated QA entry transform | Exit 0; production Vite config/plugins, no listener or storage access |

The sole player failure is unchanged
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, the missing
"Off-site thyroid fine-needle aspiration" pending-label assertion. No new player
failure is accepted or hidden. The full player run preceded one test-only
optional-chain TypeScript correction; the final new player suite and root
typecheck then passed. No player runtime implementation changed afterward.

**V3 full clinical content, exit 1** (`final-clinical-v3.log`):

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content

 ❯ src/pilot-content.test.ts (17 tests | 1 failed) 62ms
     × does not make the keyed answer uniquely longest in the runtime release 11ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/pilot-content.test.ts > five-diagnosis pilot registry > does not make the keyed answer uniquely longest in the runtime release
AssertionError: expected [ …(21) ] to deeply equal [ …(12) ]

- Expected
+ Received

@@ -9,6 +9,15 @@
    "question.graves-rai-lactation-contraindication.v1",
    "question.graves-rai-pregnancy-contraindication.v1",
    "question.men2a.2d.v1",
    "question.men2a.3c.v1",
    "question.men2a.3d.v1",
+   "question.pediatric-clinic.carinatum-nonsurgical-options.v2",
+   "question.pediatric-clinic.child-wants-plan-explained.v2",
+   "question.pediatric-clinic.epigastric-standing-bulge.v2",
+   "question.pediatric-clinic.intermittent-retraction-followup.v2",
+   "question.pediatric-clinic.pectus-new-sports-fatigue.v2",
+   "question.pediatric-clinic.prominent-chest-brace-question.v1",
+   "question.pediatric-clinic.sunken-chest-exercise-limits.v1",
+   "question.pediatric-clinic.supraclavicular-neck-lump.v1",
+   "question.pediatric-clinic.upper-midline-lump.v1",
  ]

 ❯ src/pilot-content.test.ts:71:7
     69|     expect(
     70|       violations.map((violation) => violation.questionVariantId).sort(…
     71|     ).toEqual([...IMMUTABLE_APPROVED_LENGTH_EXCEPTIONS].sort());
       |       ^
     72|   });
     73|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 83 passed (84)
      Tests  1 failed | 607 passed (608)
   Start at  02:03:13
   Duration  6.49s (transform 18.86s, setup 0ms, import 69.94s, tests 6.80s, environment 8ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Pediatric batch, exit 0** (`batch-tests.log`):

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run src/development-batch/2026-10-08-pediatric-clinic --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  2 passed (2)
      Tests  19 passed (19)
   Start at  02:03:50
   Duration  1.18s (transform 815ms, setup 0ms, import 1.21s, tests 41ms, environment 0ms)
```

**FULL game-domain, exit 0** (`final-full-domain.log`):

```text

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  132 passed (132)
      Tests  3712 passed (3712)
   Start at  02:09:56
   Duration  95.94s (transform 7.08s, setup 0ms, import 55.26s, tests 317.07s, environment 7ms)
```

**FULL player, exit 1** (`full-player.log`):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 552ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 56ms

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


 Test Files  1 failed | 157 passed (158)
      Tests  1 failed | 1232 passed (1233)
   Start at  02:06:01
   Duration  23.95s (transform 6.69s, setup 0ms, import 45.32s, tests 37.10s, environment 9ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck, exit 0** (`final-typecheck.log`):

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

**QA entry transform, exit 0** (`qa-transform.log`):

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

Additional focused commands, using the same preload and configs:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/pediatric-clinic-admission.test.ts tests/pediatric-appointments.test.ts tests/routine-patient-availability.test.ts tests/approved-clinical-admission.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- src/patientDemographics.test.ts tests/clinical-content-withdrawal.test.ts tests/gs028-20261003-batch.test.ts tests/gs028-statistics-ethics-batch.test.ts tests/patient-supply.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- src/session/pediatricChartsViewModels.test.ts --pool=threads
```

Focused admission/availability/M5: **65/65**, four files (the new pediatric
domain suite contains 33 cases); inventory/display regressions: **404/404**,
five files; final pediatric player projection/routing: **21/21**, one file.
Exact outputs: `final-focused-domain.log`, `focused-inventory.log` and
`focused-player.log` in the same scratch folder. Unabridged required and focused
receipts are also in `validation-output.md` there.

An optional `npm.cmd run test:boundaries` attempt was stopped after its script
internally attempted a Git tracked-path read and the sandbox returned
`spawnSync git EPERM` (exit 1, `boundaries.log`). The worker should have inspected
that script against the brief's no-Git constraint before invoking it. No Git
operation completed; the script was not changed or rerun. This is an additional
blocked check, not a substitute for any required suite or a boundary PASS.

### Exact manager QA steps

1. Run `node tools/qa/level-four-rooms.mjs`, or reuse the manager's existing
   server on 5184. Open exactly
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=pedcharts** in a disposable
   persistent QA browser profile. The script's older printed URL list does not
   include this new query; use the exact link above. The bootstrap selects
   **Level 4 M7 scored pediatric charts**, campaign
   `campaign.qa.level-four-pediatric-charts-m7`. First opening seeds one actual
   admitted batch chart and both rooms; subsequent openings resume that save.
   A fresh disposable QA profile is the clean repeat pathway; query reloads do
   not reseed an existing campaign.
2. Confirm Level 4, Pediatric Waiting and Pediatric Examination, then press
   Play (4x is convenient). Watch **Noah Bennett, 5 years, Male**, child still
   `level3-roster-v2.022`, arrive/check in with his father **Daniel Bennett**.
   They should cross rooms together, with the child on a kid stool and the
   parent on an adult seat while waiting. This fixture has no APP appointments
   or service visitors; this is the real scored
   `case.pediatric-clinic.groin-bulge-after-play` variant.
3. Open Noah's waiting chart. Confirm exact name, age/sex, short complaint,
   authored named-parent presentation and complete question. The four answers
   appear in frozen randomized runtime order, with no diagnostic wait promise
   or invented adult vitals. Watch both actors go to Pediatric Examination:
   child at the examination table, father at `parentChair`, founder at the
   provider stool. Verify the canvas continues updating and no page error.
4. Wait until **both actors are physically seated in the exam room**, then
   select **Refer for pediatric surgical assessment**. Confirm normal scored
   feedback/Clinical XP and one review of the inguinal-referral concept, without
   an APP appointment/service receipt. Acknowledge the feedback and resolve/file
   the completed chart using its primary action; watch the child and parent
   depart together.
5. Reload the **same full URL and profile** during waiting, in care and after
   completion. Names, compatible stills, shuffled choices and progress must
   persist. Completion must not award a second review or service income.
   The domain tests verify save/actor/room retirement as well as ages 9/10/17.
   To inspect the durable witness read-only in this disposable profile after
   autosave, use the console expression below; compare it across reloads.

   ```javascript
   const m7Profile = JSON.parse(localStorage.getItem("gamify-surgery.prototype.profile.v1"));
   const m7Save = JSON.parse(m7Profile.campaigns.find(c => c.campaignId === "campaign.qa.level-four-pediatric-charts-m7").serializedState);
   m7Save.levelFourCompletion.pediatricVisitWithParent;
   // serviceOperationId: null; encounterId: "encounter.qa.pediatric-chart.m7";
   // parentActorId: "parent.encounter.encounter.qa.pediatric-chart.m7";
   // incomeLineId: "income.pediatric_consult"; fixed completedAtFacilityTick.
   ```

6. Check `location.origin` is **http://127.0.0.1:5184**. This uses the existing
   dedicated QA origin with a new separate M7 campaign, and has separate saves
   from **START_GAME.cmd -> exact http://127.0.0.1:4173**, QA 5183, the remote
   GitHub Pages origin and other browser profiles. Canonical owner playtesting
   is unchanged. Ordinary Level 3 campaigns cannot admit this batch; the
   operational-room/availability/due-review cases are covered by the domain
   suite. No owner save/profile was opened by this worker.

The worker validated the dedicated transform and real domain/player projection
paths; **no browser visual PASS is claimed**. Manager retains browser checks,
default-pool reruns in its environment, resolution of the nine content findings,
actual diff acceptance and CURRENT_THREAD_HANDOFF. No new agents, dependency
installs, web access, art, source ingestion, external messages, publication or
deployment occurred. **LOCAL ONLY:** no backup was created. After acceptance,
retain the owner reminder to say **"push to GitHub"** for the manager's scoped,
audited checkpoint.

### M7 option-length fix

Sol content worker, 2026-10-09. The bounded editorial follow-up is complete:
none of the nine specified variants now makes the key uniquely longest by
JavaScript `label.length`. The FULL clinical-content suite, including the
unchanged global guard, passes with zero failures. These results supersede
the nine option-length findings and V3 failure recorded in the earlier M7
assembly handoff above; that historical validation record is preserved.
Manager diff review and acceptance remain manager-owned.

Only answer-option labels changed: eleven label instances across exactly the
nine variants (nine source literals, because the two hernia variants share
their diagnostic choices). The inguinal/femoral labels name the same hernia
diagnoses; referral, observation, operative-booking, brace-suitability and
child-participation choices retain their clinical intent. Options retain
parallel grammar, comparable length/specificity and their semantic categories.
No explanatory distractor qualifiers were introduced. Three keys were
tightened; the remaining fixes rephrase distractors. No rationale or
explanation quotes a changed full label, so those fields remain unchanged.

The batch read-through test requires the sample artifact to equal its current
exports. Exactly five corresponding option lines in
`docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md` were synchronized; all other sample
text is unchanged. No tests or approved length exceptions were modified.

**Files changed in this follow-up:**

- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/neck-nodes.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/testes.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/chest-wall.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts`
- `docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md` (only the five option lines)
- `docs/execplans/level4-launch-plan-20261008.md` (this M7 append only)

**Preservation evidence:** `.local-dev/m7-option-length-fix/` contains the
before-images, complete before/after batch exports, `intake-hashes.json`,
`preservation.json`, `scoped.diff`, tables and validation logs. All 332 other
intake clinical-content/sample source paths are byte-exact. Comparing every
exported batch field yields only 22 projected label changes: the same eleven
choices in the question and runtime-case representations. All other variants,
IDs, keys, concept versions, evidence/claim/source mappings, profiles, timing
and service contracts, rationales, explanations, review metadata and manifests
are unchanged. Every authored record remains `needs_clinician_review`; no
clinical approval is inferred. The global guard and its exception list are
byte-exact. Modified artifacts are UTF-8 without BOM with LF line endings.

#### Before/after option tables

All tables use authored key-first order for review only; runtime choices remain randomized.

##### `question.pediatric-clinic.upper-midline-lump.v1`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Epigastric hernia | 17 | Epigastric hernia | 17 |
| B | Umbilical hernia | 16 | Umbilical hernia | 16 |
| C | Inguinal hernia | 15 | Inguinal canal hernia | 21 |
| D | Femoral hernia | 14 | Femoral canal hernia | 20 |

##### `question.pediatric-clinic.epigastric-standing-bulge.v2`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Epigastric hernia | 17 | Epigastric hernia | 17 |
| B | Umbilical hernia | 16 | Umbilical hernia | 16 |
| C | Inguinal hernia | 15 | Inguinal canal hernia | 21 |
| D | Femoral hernia | 14 | Femoral canal hernia | 20 |

##### `question.pediatric-clinic.supraclavicular-neck-lump.v1`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Arrange prompt pediatric specialist assessment | 46 | Arrange prompt pediatric specialist assessment | 46 |
| B | Continue routine reactive-node observation | 42 | Continue routine reactive neck-node observation | 47 |
| C | Arrange routine pediatric ENT follow-up | 39 | Arrange routine pediatric ENT follow-up | 39 |
| D | Discharge from further neck-node review | 39 | Discharge from further neck-node review | 39 |

##### `question.pediatric-clinic.intermittent-retraction-followup.v2`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Continue documented examinations of testicular position | 55 | Continue documented testicular-position examinations | 52 |
| B | Refer for routine orchidopexy planning | 38 | Refer for routine orchidopexy planning | 38 |
| C | Stop further examinations of testicular position | 48 | Stop further examinations of testicular position | 48 |
| D | Continue parent-led monitoring of testicular position | 53 | Continue parent-led monitoring of testicular position | 53 |

##### `question.pediatric-clinic.sunken-chest-exercise-limits.v1`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Refer for chest-wall and cardiopulmonary assessment | 51 | Refer for chest-wall and cardiopulmonary assessment | 51 |
| B | Refer for immediate corrective-surgery booking | 46 | Refer for immediate corrective-surgery booking | 46 |
| C | Refer for a cosmetic reassurance consultation | 45 | Refer for a reassurance consultation on chest appearance | 56 |
| D | Refer for a routine posture-training program | 44 | Refer for a routine posture-training program | 44 |

##### `question.pediatric-clinic.pectus-new-sports-fatigue.v2`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Arrange chest-wall and cardiopulmonary specialist assessment | 60 | Arrange chest-wall and cardiopulmonary specialist assessment | 60 |
| B | Arrange direct operative booking for chest correction | 53 | Arrange direct operative booking for chest correction | 53 |
| C | Arrange an appearance-focused reassurance consultation | 54 | Arrange a consultation for reassurance about chest appearance | 61 |
| D | Arrange a routine posture-training referral | 43 | Arrange a routine posture-training referral | 43 |

##### `question.pediatric-clinic.prominent-chest-brace-question.v1`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Discuss specialist brace-suitability assessment | 47 | Discuss specialist brace-suitability assessment | 47 |
| B | Discuss direct corrective-surgery booking | 41 | Discuss booking directly for corrective surgery | 47 |
| C | Discuss observation as the treatment plan | 41 | Discuss observation as the treatment plan | 41 |
| D | Discuss routine posture-training referral | 41 | Discuss routine posture-training referral | 41 |

##### `question.pediatric-clinic.carinatum-nonsurgical-options.v2`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Refer for specialist chest-brace suitability assessment | 55 | Refer for specialist brace-suitability review | 45 |
| B | Refer directly for corrective chest-wall surgery | 48 | Refer directly for corrective chest-wall surgery | 48 |
| C | Recommend observation as the treatment plan | 43 | Recommend observation as the treatment plan | 43 |
| D | Refer for a routine posture-training program | 44 | Refer for a routine posture-training program | 44 |

##### `question.pediatric-clinic.child-wants-plan-explained.v2`

| Option | Before label | Before characters | After label | After characters |
| --- | --- | ---: | --- | ---: |
| A (key) | Explain the plan to Ruby and invite questions | 45 | Explain to Ruby and invite her questions | 40 |
| B | Confirm the plan with her father and proceed | 44 | Confirm the plan with her father and proceed | 44 |
| C | Accept Ruby's eventual silence and proceed | 42 | Accept Ruby's eventual silence and proceed | 42 |
| D | Defer Ruby's involvement until she is older | 43 | Defer Ruby's involvement until she is older | 43 |

#### Validation commands and exact output

Used the **existing ordinary package configs with `--pool=threads`** and
the specified preload for every Vitest command. No alternate config,
exclusion, CLI worker cap or timeout change. `NO_COLOR=1` was used for logs.
PowerShell wrapped six empty player stderr lines as `RemoteException`; those
wrappers are restored to empty lines in the transcript below. The original
transport capture is retained as `full-player.powershell-capture.log`; no
test or npm diagnostic text was removed.

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:NO_COLOR='1'
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-08-pediatric-clinic --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

| Required check | Result |
| --- | --- |
| FULL clinical-content | Exit 0; 84 files, 608/608 passed; zero failures |
| Pediatric batch | Exit 0; two files, 19/19 passed |
| FULL player | Exit 1; 157 passed files / one known failed file, 1,232 passed tests / one known thyroid failure |
| Root typecheck | Exit 0; all seven workspaces passed |

**FULL clinical-content, exit 0** (`full-clinical.log`):

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  84 passed (84)
      Tests  608 passed (608)
   Start at  02:33:46
   Duration  5.13s (transform 13.60s, setup 0ms, import 52.72s, tests 6.33s, environment 9ms)

```

**Pediatric batch, exit 0** (`batch-tests.log`):

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run src/development-batch/2026-10-08-pediatric-clinic --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  2 passed (2)
      Tests  19 passed (19)
   Start at  02:34:00
   Duration  1.04s (transform 739ms, setup 0ms, import 1.07s, tests 37ms, environment 0ms)

```

**FULL player, exit 1** (`full-player.log`):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 538ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 61ms

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


 Test Files  1 failed | 157 passed (158)
      Tests  1 failed | 1232 passed (1233)
   Start at  02:34:10
   Duration  24.03s (transform 6.96s, setup 0ms, import 45.82s, tests 37.12s, environment 9ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck, exit 0** (`typecheck.log`):

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

The sole player failure is the already known
`src/session/surgeryCenterServicePreviews.test.ts:85:52` missing
"Off-site thyroid fine-needle aspiration" pending-label assertion. It is
unchanged and outside this content lane. No additional failure occurred.

Manager next: inspect the seven scoped paths and captured diff, update the
manager-owned `CURRENT_THREAD_HANDOFF.md`, and reconcile M7 acceptance with
this now-passing V3 gate. Named clinician approval remains a separate process.
No Git, installs, agents, web/source retrieval, external messages, browser or
owner-save access, commit, push, release, publication or deployment occurred.
Canonical owner playtesting remains `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent browser profile; no pathway
or save-origin change. **LOCAL ONLY:** no GitHub backup was created. Manager
retains the scoped "push to GitHub" checkpoint reminder after acceptance.

## Level 4 M8: progression, economy and guidance

Sol worker handoff, 2026-10-09. M8a was implemented and its progression/save checks accepted locally before M8b. **Ready for manager review; browser acceptance is manager-owned.** Binding owner decisions in the M8 brief supersede the historical draft progression proposal above. No new clinical content, art, dependency installation, Git operation, publication, deployment or agent dispatch occurred. Concurrent M1-M7 work, the M5 render fix, M7 option-length fix, additive Reading receipts, economy B, staff look expansion and the shared guidance-topic ledger are preserved.

### Implemented behavior and save compatibility

- The shipped cap is 4 and the Level 3 successor is 4. Level 3 keeps its existing 500 current-level Clinical XP, strict satisfaction above 90 with recorded satisfaction, operational pharmacist and historical completed ambulatory-operation requirements. QI remains optional. The existing advance reducer resets only current-level XP to zero; it preserves money, staff, rooms, frozen charts, FSRS history and the operation witness. Qualified schema-5/schema-9 Level 3 saves advance without replay or rehiring; saves missing each gate remain at Level 3.
- Level 4 has exactly five primary requirements: 750 current-level Clinical XP, **displayed** satisfaction above 90, one APP assigned to a compatible operational room, a completed pediatric visit with its parent, and a completed wound/ostomy care visit. MRI and Pediatric Waiting are not gates. An installed busy/training APP still counts as coverage; unassigned, incompatible or inaccessible homes do not. The room/staff requirement remains live.
- M5/M6's existing `level-four-completion.v1` witnesses remain the historical visit evidence. No schema version change or reconstruction from current sprites/receipts is needed. Witnesses survive real room sale, normal service-history retirement, removal of historical actors/receipts and reload. A mid-Level-4 visit reloads its frozen work and completes normally.
- Terminal completion stores `acknowledgedAtFacilityTick` once and emits one informational `event.facility-level-4-complete`, with no reward. Acknowledgement occurs on applied commands and during individual fast-forward ticks, so a reached milestone is not lost between ticks. Reloads and later room sale preserve the earned terminal state. There is no Level 5 advance; play continues. The Goals panel and footer say **"Level 4 complete - Level 5 coming later. Keep playing; the clinic is still open."**
- APP and scheduled work leave Clinical XP, learning histories and FSRS review intents unchanged. No emergency consultation payment or eligibility increase was introduced. The available manual emergency payment remains $50.
- Goals/Advance use the same domain selector, Build unlocks the four existing rooms at 4, Staff explains actual APP home/look capacity and current wound services, and MRI appears in the Level 4 technician capacity guidance. Services uses the existing real operation/receipt status. Money and the HUD use the same rolling receipts/current expense calculation; its arithmetic was already correct for the APP service lines and was preserved.

### Economy reconciliation: actual reducer execution

`tools/economy-audit/level-four-simulation.ts` places every room/door and hires each worker through the normal reducer, then advances real game ticks. No fee, cadence, wage, upkeep, navigation, training or staff behavior override is used. The representative early-L4 specialty cluster has one MRI/technician (external interpretation), Pediatric Exam/Waiting with one APP, Wound/Ostomy with one APP, one ordinary APP Exam and a separate Founder Exam; shared support is Front Desk/receptionist, ordinary Waiting, Bathroom, EVS closet/worker, Workshop/Repair Person, Staff Break Room, Coffee Kiosk and connected hallways. All rooms/staff are baseline tier/training and advertising is off. Normal cleaning, water, breaks, retail and upkeep/payroll continue.

The baseline margin run isolates autonomous services by disabling routine scored arrivals; it includes no scored-chart income or emergency cash. Ordinary catalog appointment demand is enabled without injected visitors or fees. It uses seed `level-four-economy-m8`, **4 warmup game hours + 48 measured game hours**. A separate paired **10-game-hour** reducer run with normal routine arrival scheduling enabled admits the same scored encounter IDs with all APP streams on/off; all three APP specialties receive payments, with unchanged XP/FSRS. Existing scored-care priority/yielding, pediatric admission and provider queue tests also pass in the full suite. These measured baseline margins do not claim that an APP home will keep this income while the Founder is using it for a scored chart.

| Baseline function | Measured visits / 48 h | Visits / game h | Gross / h | Stock / h | Room upkeep / h | Required salary / h | Direct net / h |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| MRI (external read) | 12 | 0.250 | $60.00 | $0.00 | $8.00 | $18.00 | +$34.00 |
| Pediatric Exam + Waiting + APP | 32 | 0.667 | $53.33 | $0.00 | $3.00 | $30.00 | +$20.33 |
| Wound/Ostomy + APP | 31 | 0.646 | $43.75 | $0.00 | $2.00 | $30.00 | +$11.75 |
| Ordinary Exam + APP | 24 | 0.500 | $40.00 | $0.00 | $2.00 | $30.00 | +$8.00 |

Pediatric Waiting earns no standalone fee; its $1/hour is included with the pediatric function. Wound and ostomy complete 15 and 16 visits respectively in this fixed window; one end-of-window visit lies outside the measured receipts. Their combined measured gross is $43.75/hour, compared with the isolated steady cadence budget of $45/hour. MRI pays its own $8 upkeep and $18 technician without assuming an additive onsite read fee. Each new function covers its direct baseline costs, so no further economy tuning was needed.

The four functions together net **+$74.08/hour before shared support**. The real full cluster posts $24/hour room upkeep and $146/hour salaries (total $170/hour), plus actual retail stock. Shared support costs $47/hour beyond the direct rows; ordinary retail adds $7.04 gross / $2.63 stock per hour. Overall gross is **$204.13/hour**, stock **$2.63/hour**, and observed cash delta **+$31.50/hour**, matching the domain's $170/hour operating quote. Construction/hiring and the fixture's initial cash grant are excluded from measured operating profit. The fixture is a focused early-L4 build, not the old L3 audit's larger fixed roster with four rooms added.

For comparison, the existing option-B/current L1-L3 numerical scenarios were rerun read-only and remain unchanged. The dated `results-20261008.json` was not overwritten. The extraction tool now loads the real Level 4 navigation/MRI dependencies and restricts its dated role comparison to Levels 1-3; it still verifies all eight numerical/source invariants and 18 current source fingerprints.

| Scenario | Method | Gross / h | Stock / h | Room upkeep / h | Salaries / h | Operating costs / h | Net / h |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| L1 option B | Existing fixed-roster model, 20 seeds | $149.08 | $0.00 | $17.00 | $28.00 | $45.00 | +$104.08 |
| L2 option B | Existing fixed-roster model, 20 seeds | $661.11 | $2.88 | $51.00 | $208.00 | $259.00 | +$399.23 |
| L3 option B | Existing fixed-roster model, 20 seeds | $965.61 | $14.88 | $79.00 | $380.00 | $459.00 | +$491.73 |
| Early L4 specialty cluster | Actual reducer, 48 measured hours | $204.13 | $2.63 | $24.00 | $146.00 | $170.00 | +$31.50 |

The L1-L3 model's existing slow-demand nets remain +$28.54 / +$110.24 / +$101.49 per hour. It retains its previously documented L3 slow-demand startup shortfalls; M8 does not turn this into a guarantee of solvency for every layout. Full real-simulation evidence is in `tools/economy-audit/level-four-results-20261009.json`. Reproduce the artifact deliberately (normal test runs do not overwrite it):

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:LEVEL_FOUR_ECONOMY_REPORT = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-economy.test.ts --pool=threads -t "covers each"
Remove-Item Env:LEVEL_FOUR_ECONOMY_REPORT
node tools/economy-audit/run.mjs
```

### Tip and alert copy / delivery

Five new catalog IDs have minimum Level 4. Existing cadence, grace, cooldown, family/root suppression and introductory/tutorial behavior are preserved. Every offered action repeats its live affordability/access/capacity predicate. APP hire/capacity suggestions and alert buttons respect all occupied approved looks, including departing staff. The limit is derived from the current approved pool (currently ten looks), rather than the old two-look M4 assumption. Optional spending keeps the existing buffer. There is no ordinary setup or progression card in **Needs you**; admitted-care hard blockers retain the existing dire-only handling.

Catalog A/B copy is exact below. `{fix}`, `{purpose}` and `{looks}` are runtime substitutions; action labels use actual quotes, not authored prices.

- **`tip.app.hire`**
  - A: The compatible room is ready; its provider is still theoretical. Hire an APP for unscored clinic appointments.
  - B: An examination couch is not a provider. Hire an APP to put a compatible room's appointment stream to work.
- **`tip.pediatric.setup`**
  - A: Children arrive with a parent, who also expects somewhere to exist. {fix}. {purpose}
  - B: The pediatric department currently has more ambition than furniture. {fix}. {purpose}
- **`tip.wound.setup`**
  - A: The wound clinic needs an APP; the dressings decline to cover the shift. {fix} to support wound and ostomy appointments.
  - B: Wound and ostomy visits need a working room and an APP. {fix}; the supplies cannot see patients on their own.
- **`tip.app.appointments`**
  - A: The APP can earn money while you answer charts. Enable Scheduled appointments; these visits earn cash, no Clinical XP or FSRS practice.
  - B: Payroll would appreciate an appointment book. Enable Scheduled appointments for APP income; Clinical XP and FSRS still come from scored charts.
- **`tip.app.capacity`**
  - A: APP posts are one per compatible room; upgrading the couch does not add a colleague. {fix}. Hiring also needs an unused approved APP look ({looks} total).
  - B: The APP roster has reached the rooms' limit. {fix} for another post. Each hire also needs an unused approved look ({looks} total); room upgrades add no posts.

`tip.pediatric.setup` first offers Pediatric Examination when absent, then Pediatric Waiting as an optional seating amenity. Its exact `{purpose}` strings are:

- "A Pediatric Examination Room supports scored pediatric charts and APP visits with a parent."
- "Pediatric Waiting gives the child and parent seats; it is an amenity, not a completion gate."

`tip.wound.setup` offers a real room build or a hire only when the automatic available APP home is that clinic. `tip.app.appointments` requires a staffed operational home in any enabled APP service, including a wound-only setup. `tip.app.capacity` offers an extra compatible room only at the physical room limit with an unused look available; it never promises that more furniture solves an exhausted look pool.

The established Goals tip also uses these exact L4 metric explanations:

- "Answer scored charts to earn {remaining} more Clinical XP. APP and scheduled visits earn money, not XP or FSRS practice."
- "Complete a scored pediatric chart or an APP pediatric visit with its parent. Pediatric Waiting adds seats but is not a completion gate."
- "Assign an APP to a working Wound/Ostomy Room, enable Scheduled appointments and finish a wound or ostomy visit. This visit earns money, not Clinical XP or FSRS practice."

New `alert.progress.level-four-complete`: success category, informational, Level 4 only, once per event, no attention marker, no click action and no ticker. Title: **"Level 4 complete - Level 5 coming later"**. Body: **"The goals are complete. The clinic remains open; the next level is still in the planning department."** The persisted event/Goals/footer message is **"Level 4 complete - Level 5 coming later. Keep playing; the clinic is still open."** No new persistent condition key or save migration is required; the existing `progression_eligible` condition now correctly handles Level 3 -> 4.

### Files changed (45 paths, including this handoff and its pointer)

- `packages/balance-config/src/app-role.test.ts`
- `packages/balance-config/src/approved-room-layouts.test.ts`
- `packages/balance-config/src/guidance-tips.ts`
- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/balance-config/src/level-four-schema.test.ts`
- `packages/balance-config/src/mri-services.test.ts`
- `packages/balance-config/src/prototype-alerts.ts`
- `packages/balance-config/src/prototype-balance.test.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/wound-ostomy-services.test.ts`
- `packages/game-domain/src/guidance-progression.ts`
- `packages/game-domain/src/guidance-tips.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/game-domain.test.ts`
- `packages/game-domain/tests/guidance-tip-predicates.test.ts`
- `packages/game-domain/tests/level-four-persistence.test.ts`
- `packages/game-domain/tests/level-four-rooms.test.ts`
- `packages/game-domain/tests/level-three-goals.test.ts`
- `packages/game-domain/tests/level-two-progression.test.ts`
- `packages/game-domain/tests/mri-services.test.ts`
- `packages/game-domain/tests/pediatric-clinic-admission.test.ts`
- `packages/game-domain/tests/service-operations.test.ts`
- `apps/player/src/AppShell.tsx`
- `apps/player/src/facility/level4ApprovedRoomTestHelpers.ts`
- `apps/player/src/session/alertsEventsViewModel.ts`
- `apps/player/src/session/clinicAlertActions.ts`
- `apps/player/src/session/level3ControlsViewModels.test.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/GoalsPanel.test.tsx`
- `apps/player/src/ui/GoalsPanel.tsx`
- `tests/fixtures/level-four-rooms.ts`
- `tools/qa/level-four-rooms-bootstrap.ts`
- `tools/qa/level-four-rooms.mjs`
- `tools/economy-audit/run.mjs`
- `packages/game-domain/tests/level-four-progression.test.ts`
- `packages/game-domain/tests/level-four-economy.test.ts`
- `packages/game-domain/tests/level-four-guidance.test.ts`
- `apps/player/src/session/levelFourProgressionViews.test.tsx`
- `tests/fixtures/level-four-progression.ts`
- `tools/economy-audit/level-four-simulation.ts`
- `tools/economy-audit/level-four-results-20261009.json`
- `docs/execplans/level4-launch-plan-20261008.md`
- `docs/execplans/owner-requests-20261008.md`

The numerous cap/ladder test edits replace dormant-Level-4 assertions with the launched contract while retaining art geometry, door/orientation, queue and save checks. `apps/player/src/facility/routeMotion.ts` is byte-identical to the intake snapshot. Edited files are UTF-8 without BOM with LF; AppShell's existing CRLF endings were normalized while preserving its text outside the completion sentence. The manager-owned `CURRENT_THREAD_HANDOFF.md`, clinical sources/releases, art assets, balance prices/cadences/wages and launcher pathway are unchanged. Before images, scoped diff and logs are under `.local-dev/level4-m8/`.

### Exact validation commands and output

Used checked-in ordinary configs with `--pool=threads` and the requested EPERM preload, through `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`. No test config was edited; no default child-process pool was used. Logs were captured with `NO_COLOR=1`. V1-V4 run the full suites. V5 root typecheck passes and the independent launcher contract passes. **The Git-based boundary portion of V5 and the root V6 wrapper were not invoked**, honoring the worker's explicit **No Git** constraint: root `build` calls `test:boundaries`, whose `verify-app-boundaries.mjs` executes Git. The actual V6 production player target was run directly and passes, including its private-clinical-module build guard. Manager should rerun the root boundary/ordinary-config aggregate during acceptance; this handoff does not claim those Git-dependent checks passed.

Earlier stale cap assertions were corrected; their first failing logs remain available. After the full domain pass, the same 16 focused progression/economy tests were strengthened with real room-sale and normal-retirement assertions and rerun successfully. No production behavior changed after the full passes other than AppShell line-ending normalization. Exact accepted output follows (ANSI terminal color/erase controls removed, text retained).

**V1 full balance - exit 0** (`full-balance.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
```

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  15 passed (15)
      Tests  129 passed (129)
   Start at  03:11:17
   Duration  416ms (transform 1.06s, setup 0ms, import 2.87s, tests 133ms, environment 1ms)
```

**V2 full domain - exit 0** (`full-domain-accepted.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  135 passed (135)
      Tests  3736 passed (3736)
   Start at  03:14:13
   Duration  114.32s (transform 6.55s, setup 0ms, import 55.83s, tests 389.47s, environment 7ms)
```

**V3 full clinical - exit 0** (`full-clinical.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads
```

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  84 passed (84)
      Tests  608 passed (608)
   Start at  03:11:39
   Duration  7.44s (transform 22.05s, setup 0ms, import 79.81s, tests 7.38s, environment 8ms)
```

**V4 full player: only known thyroid failure - exit 1** (`full-player-accepted.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 788ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 73ms

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


 Test Files  1 failed | 158 passed (159)
      Tests  1 failed | 1236 passed (1237)
   Start at  03:14:13
   Duration  32.06s (transform 7.69s, setup 0ms, import 58.85s, tests 51.95s, environment 11ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**V5 all-workspace typecheck - exit 0** (`final-typecheck.log`):

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

**V6 production player build; no publishing - exit 0** (`production-build.log`):

```powershell
npm.cmd run build --workspace @gamify-surgery/player
```

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 629 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.34 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/index-CCZuUA74.css                                       162.81 kB │ gzip:    30.23 kB
dist/assets/index-D53L078H.js                                      8,210.66 kB │ gzip: 1,812.72 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (86%)
  - vite:prepare-out-dir (9%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.40s
```

**Final sale / archival / save / economy checks - exit 0** (`durability-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-progression.test.ts tests/level-four-economy.test.ts --pool=threads
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-four-progression.test.ts tests/level-four-economy.test.ts --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  03:17:49
   Duration  34.11s (transform 2.98s, setup 0ms, import 4.05s, tests 32.50s, environment 0ms)
```

**QA entry typecheck - exit 0** (`qa-typecheck-accepted.log`):

```powershell
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/level4-m6/qa-tsconfig.json
```

```text

```

**QA entry transform - exit 0** (`qa-transform.log`):

```powershell
node tools/qa/level-four-rooms.mjs --check
```

```text
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

**Launcher contract - exit 0** (`launcher-contract.log`):

```powershell
node scripts/verify-launcher-contract.mjs
```

```text
Verified launcher health contract gamify-surgery-player protocol 1.
```

The sole player failure remains `src/session/surgeryCenterServicePreviews.test.ts:85:52`, its unchanged missing "Off-site thyroid fine-needle aspiration" pending-label assertion. It is outside M8 and was not weakened or fixed. Clinical content remains `needs_clinician_review`; passing V3 is not clinical approval. The production build reports its existing large-chunk warning. The read-only historical economy rerun exits 0 with "PASS: 8 numerical/source invariants; 20 seeds x 40 measured hours + 10 warmup hours per scenario." Its exact tables/output are in `.local-dev/level4-m8/historical-economy-final.log`.

### Exact manager browser QA

1. In the manager's normal environment, run `node tools/qa/level-four-rooms.mjs`. Use a dedicated persistent disposable QA browser profile. This server is the existing separate origin **http://127.0.0.1:5184**, not the owner's campaign origin. The worker ran typecheck/transform/SSR/domain checks only; browser clicks/screenshots remain manager work.
2. Open **http://127.0.0.1:5184/level4-rooms-qa.html?state=l3ready**. Confirm `location.origin === "http://127.0.0.1:5184"`. The seeded mature Level 3 campaign is paused, has 500 XP, recorded satisfaction above 90, an operational pharmacist, retained first-operation evidence and incomplete optional QI. Open Goals: all four primary items are complete and **Advance to Level 4** is available immediately. Do not replay an operation or hire anything.
3. Click **Advance to Level 4**. Confirm Level 4, **0/750 XP**, five primary goals, no advance-to-5 control; four L4 rooms in Build, APP in Staff, and real MRI/pediatric/wound service rows. QI remains secondary. Reload the exact URL: it resumes Level 4, preserves the same staff/rooms/history, and does not repeat advancement or money. The query selects the same saved synthetic campaign; it does not reseed it on reload.
4. Open **http://127.0.0.1:5184/level4-rooms-qa.html?state=l4almost** in the same QA profile. It selects a second paused synthetic Level 4 campaign: 750 XP, displayed satisfaction initially 98, operational wound APP, existing historical pediatric-with-parent witness, and exactly one unmet item (wound/ostomy visit). There is no MRI or Pediatric Waiting. Open Goals to verify this.
5. Press Play (4x is fine). Let the real wound appointment enter and finish; check Services for its single receipt and Goals for **"Level 4 complete - Level 5 coming later. Keep playing; the clinic is still open."** Pause after completion. XP stays **750**, FSRS is unchanged, no Level 5 button/reward appears, and the clinic can keep playing. The milestone is an ordinary feed row, never Needs you.
6. Reload that exact URL and confirm the complete state and one milestone occurrence persist. Sell the wound room through normal Build confirmation if checking durability: its APP staffing item becomes unmet, historical visit items stay complete, and the earned terminal state remains complete after another reload. No completion reward/event repeats. If a clean retry is needed, use a fresh disposable QA profile or remove only the M8 synthetic campaign at the QA origin; never clear owner storage.
7. Manager acceptance additionally checks actual browser rendering, narrow layouts, normal configured pool/root boundaries and no page errors. Review the scoped diff and clinical notice; update manager-owned `CURRENT_THREAD_HANDOFF.md` after acceptance.

### Exact owner live-campaign effect and next action

The canonical opening pathway stays **START_GAME.cmd -> http://127.0.0.1:4173** in the owner's usual persistent browser profile. After M8 lands and that app reloads, an existing Level 3 save **will immediately show Advance to Level 4 if it already satisfies the unchanged Level 3 gates** (500 current-level XP, displayed satisfaction above 90 with a recorded rating, operational assigned pharmacist, historical completed ambulatory operation). No new campaign, replayed operation, rehiring or QI review is required. A save missing a gate stays Level 3 with that same outstanding requirement. Clicking Advance resets current-level XP to 0 and preserves its campaign/history; it does not advance automatically. This worker did not access the owner's browser storage and therefore cannot assert which gates that particular live save currently meets.

QA at 5184, localhost, another profile and the remote GitHub Pages site all have separate browser saves; no campaign transfer, synchronization or owner-save injection was performed. No durable playtest-pathway change was made. **LOCAL ONLY:** no GitHub backup exists for M8. After review, manager retains the reminder for the owner to say **"push to GitHub"** before an audited checkpoint commit/push. That would not authorize release, merge, deployment or Pages publication.


### M8 presentation fixes (2026-10-09)

Manager follow-up implemented: terminal completion appears in the existing Goals box and the single Alerts Milestone row. The Level 4 completion ID is excluded from HUD headline candidates and the duplicate footer text is removed. Other advance headlines and urgent notices remain available. The footer's notice now participates in normal grid flow, status text wraps within its own track, and the footer grows with its content instead of enforcing 24/34 px heights. At 390 and 820 px the notice owns a second row; at 1600 px it owns a separate middle column.

Resolved `progression_eligible` occurrences are omitted from the feed at every level, including saved history. Real reducer advances from Levels 1, 2 and 3 retain exactly their advancement Milestone without the malformed Handled row. A real wound completion followed by three save/reload/tick cycles retains one completion event, one feed row and the original acknowledgement tick. No completion reducer, save format, rewards, goals or gate logic changed.

Files changed in this follow-up:

- `apps/player/src/AppShell.tsx`
- `apps/player/src/ui/ClinicHeadline.tsx`
- `apps/player/src/styles/global.css`
- `apps/player/src/session/alertsEventsViewModel.ts`
- `apps/player/src/session/alertsEventsViewModel.test.ts`
- `apps/player/src/session/levelFourProgressionViews.test.tsx`
- `apps/player/src/styles/clinicPresentation.test.ts`
- `apps/player/src/ui/ClinicHeadline.test.ts` (new)
- This plan appendix.

`routeMotion.ts`, the domain completion reducer, and the manager's `scripts/verify-app-boundaries.mjs` fix are byte-unchanged from this follow-up's intake. Changes use UTF-8 without BOM and LF. No Git, install, deployment, publication or owner-storage action was performed.

Validation used the configured Vitest suites with `--pool=threads`, `NO_COLOR=1`, and `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`. Exact final output follows (the full player suite retains only the known thyroid failure).

**Focused regressions - exit 0** (`.local-dev/level4-m8/presentation-focused-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/alertsEventsViewModel.test.ts src/session/levelFourProgressionViews.test.tsx src/ui/ClinicHeadline.test.ts src/ui/GoalsPanel.test.tsx src/styles/clinicPresentation.test.ts --pool=threads
```

```text

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/alertsEventsViewModel.test.ts src/session/levelFourProgressionViews.test.tsx src/ui/ClinicHeadline.test.ts src/ui/GoalsPanel.test.tsx src/styles/clinicPresentation.test.ts --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  5 passed (5)
      Tests  40 passed (40)
   Start at  03:55:47
   Duration  2.35s (transform 2.62s, setup 0ms, import 3.61s, tests 579ms, environment 0ms)
```

**FULL player suite - exit 1, known thyroid failure only** (`.local-dev/level4-m8/presentation-player-final.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 534ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 62ms

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


 Test Files  1 failed | 159 passed (160)
      Tests  1 failed | 1241 passed (1242)
   Start at  03:57:01
   Duration  25.15s (transform 6.85s, setup 0ms, import 48.35s, tests 38.40s, environment 9ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck - exit 0** (`.local-dev/level4-m8/presentation-typecheck-final.log`):

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

**Footer stylesheet audit - exit 0** (`.local-dev/level4-m8/presentation-footer-widths.log`):

```powershell
python .local-dev/level4-m8/presentation/footer-width-check.py
```

```text
STYLESHEET PASS 390px: auto height; status c1/r1; notice c1 / -1/r2 in normal flow; controls c2/r1; long status wraps.
STYLESHEET PASS 820px: auto height; status c1/r1; notice c1 / -1/r2 in normal flow; controls c2/r1; long status wraps.
STYLESHEET PASS 1600px: auto height; status c1/r1; notice c2/r1 in normal flow; controls c3/r1; long status wraps.
FOOTER PASS: completion removed; prototype notice retained. Stylesheet checks do not replace browser geometry QA.
```

Browser verification is still for manager acceptance: installed Chrome launch is blocked in this worker sandbox (`browserType.launch: spawn EPERM`). The connected browser also failed before initialization (`windows sandbox failed: helper_unknown_error: setup refresh had errors`). The 390/820/1600 checks above evaluate the actual stylesheet cascade; they are not rendered-browser screenshots or bounding-box checks.

Exact manager QA: run `node tools/qa/level-four-rooms.mjs` in the normal manager environment; use a fresh disposable QA profile at `http://127.0.0.1:5184/level4-rooms-qa.html?state=l4almost`. Resume facility time at 4x until the wound visit finishes, then pause. Check at **1600x1000**, **820x1000** and **390x1000**: Goals retains its "Level complete" header/box; Alerts contains exactly one completion Milestone; the HUD headline and footer contain no completion message; the full prototype notice is readable with no text overlap. Reload twice at the same URL and confirm the same single row. For the general footer stress check, temporarily replace `.footer-status > strong` text in DevTools with a long multi-sentence status and confirm it wraps inside its own track while the notice stays separate; reload to restore the real label. At `?state=l3ready`, click Advance and confirm the Level 4 advancement Milestone remains and no "Level current complete was resolved." row appears. Levels 1->2 and 2->3 are also covered by the real reducer regression tests above. Observe the feed immediately on completion/advance, as well as after reload.

Owner pathway remains **START_GAME.cmd -> http://127.0.0.1:4173** in the existing persistent profile. This presentation follow-up leaves the original M8 live-save/Advance behavior unchanged; 5184 QA storage remains separate. Manager-owned `CURRENT_THREAD_HANDOFF.md` remains for manager acceptance.


## Level 4 M9: integrated launch QA

**Sol worker handback, 2026-10-09. Manager acceptance pending.** M1-M8 were
manager-accepted at assignment; ordinary shipped play is capped at Level 4.
This milestone adds tests, synthetic fixtures and evidence only. No runtime,
balance, clinical content, art, QA bootstrap, launcher or production configuration
was edited. No Git, installs, agents, browser/owner-save access, external messages,
deployment or publication. The manager retains fixes, browser/default-pool
acceptance, boundaries, checkpointing and CURRENT_THREAD_HANDOFF.

### Owned files and approach

- `tests/fixtures/level-four-integration.ts`: combines accepted economy/room
  fixtures, then uses real room/door placement, hires and commands to add Reading,
  Training and a spare Pediatric Exam. Four APPs initially cover ordinary,
  pediatric, wound/ostomy and spare pediatric posts; an imaging technician and
  radiologist perform actual MRI acquisition/reading. No engine, reducer,
  persistence, scheduler, income or FSRS mocks. The test-only APP-off control
  defers the four per-home APP arrival clocks before each tick, including clocks
  recreated after maintenance; the global scheduling flag stays true and MRI
  still runs. No clinical selection, actor or payment output is mocked.
- `tests/fixtures/level-four-legacy-pre-m3.json`: frozen synthetic representative
  schema-9 Level 3 save, serialized from the accepted mature-L3 fixture with the
  optional pediatric-family and Level 4 completion extensions absent. It has no
  specialty rooms, operations or witnesses. This is an old-save **shape** fixture,
  not an archived owner save or a capture from an old executable. No automatic
  regeneration in tests. SHA-256: `9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3`.
- `packages/game-domain/tests/level-four-integration.test.ts`: five progression,
  legacy, 24-hour clinic, real-witness completion and arrival-cadence tests.
- `packages/game-domain/tests/level-four-integration-reload.test.ts`: twenty
  service/phase checks, local MRI reading and two real pediatric doorway checks;
  one skipped idle-timer defect reproducer.
- `packages/game-domain/tests/level-four-integration-defects.test.ts`: skipped
  scored-case fairness reproducer.
- `apps/player/src/session/levelFourIntegration.test.ts`: three real-engine
  checks for support bindings, Money/HUD equality, scored pediatric presentation
  and one durable terminal milestone after sale/reload.
- `.local-dev/level4-m9/`: exact logs/command receipts, before-file hashes,
  synthetic run summaries, reload checkpoints and failure traces. The appended
  plan handoff and owner-request pointer are the only coordination-document writes.

New test/fixture files are UTF-8 without BOM and LF. Existing unrelated files are
preserved. The no-Git byte-hash inventory initially covered 911 files; final
`preservation.json` lists the six new test/fixture paths and two authorized
document appends, with no missing file or runtime-source change. New clinical
claims/prose were not authored; reused prototype draft cases retain their current
review/provenance/authorization status. Tests are not clinical approval.

### Scenario-by-scenario acceptance evidence

| Requested scenario | Result | Evidence and limitation |
| --- | --- | --- |
| 1. Fresh Level 1 through 4; mature Level 3 advance once | **PASS, fixture-assisted** | One fresh campaign/founder takes real Level-0 graduation and Level 1/2/3/4 reducer advances with real placement/door/hire commands. Previously earned tutorial, XP and prior procedure gates are compressed with accepted progression records; this is not an unseeded tutorial-to-750-XP playthrough. All four advancement events occur once; XP resets, identity/rooms/staff/cash/encounters/receipts/history persist. Mature-L3 reload/advance preserves prior work with no replay/rehire. |
| 2. Mixed Level 4 clinic for 24 game hours | **PASS** | Tick 0 to 1440; all six required income lines pay; two actual scored charts finish including Noah/parent. Training queued/departure/training/return/returned, room upgrade, mid-care pediatric-room sale and queue depth 3 observed. Every tick checks cash, unchanged tick-driven learning, live resource/family links and active actor progress. No >60-minute stalled actor, live orphan or split-room pair. |
| 3. Reload each service/phase, including pediatric doorway | **DEFECT-M9-1 for exact full-state equality** | Twenty service/phase checks plus MRI reading and scored/APP doorway checks **pass care/receipt/learning continuity**, comparing each subsequent minute for 200/40/180 minutes respectively. Full-root equality fails because valid expired idle deadlines are rewritten; optional absent/null representations also differ. No assertion that full state is equal. APP services have no diagnostic-result phase: their results/payment checkpoint is actual completion/payment; MRI uses waiting_for_results and actual local reading. Waiting checkpoints are actual waiting_for_resources, not merely arrival. |
| 4. Real specialty witnesses, terminal, sale, repeated reload | **PASS** | Empty witnesses become real pediatric completion at tick 157 and wound completion at tick 238. XP is fixture-seeded to 750; both service witnesses are engine-earned. Terminal event/acknowledgment occurs once, no completion reward, no Level 5; sale then three reloads and another 60 real minutes preserve witnesses/event/learning. Player shows Goals plus one informational Milestone, without footer/headline completion duplication or malformed resolved row. |
| 5. Representative pre-M3 Level 3 old-save shape | **PASS, synthetic fixture** | Frozen schema-9 fixture loads under current persistence, meets original gates and advances once; cash/staff/rooms/charts/receipts/history remain, and no MRI/pediatric/wound rooms, families or completion witnesses are invented. Does not claim examination of the owner's actual historic save. |
| 6. All APP streams on/off for 24 hours | **Cadence PASS; case identity DEFECT-M9-2** | 24 scored IDs and exact arrival ticks are equal with identical seed/clinical context/tick timestamps. Only APP clocks are deferred in the off branch; MRI/global scheduling stays on in both. XP/FSRS are equal. Case IDs first differ at tick 900; 9 case selections differ during the day. Strict "same scored arrivals" is therefore not fully met. |

The mixed run uses ordinary balance/timing and a reduced pool of **two existing
authorized draft cases**, one adult and one pediatric, to answer through real
scored lifecycles without creating clinical content. Normal admission remains on;
actual FSRS suppresses repeated concepts after both are reviewed. The separate
24-hour arrival-fairness run uses the **full ordinary clinical release**, leaves
charts unanswered, and records every arrival before archives can hide it.
The first exploratory fairness run used the global service toggle, which also
paused MRI. Final review corrected that control to defer **APP clocks only**.
The strict case-identity failure reproduced unchanged in the corrected 24-hour
run and minimal 900-minute run. Final V2 and V7 were rerun after this refinement;
earlier logs are retained with `before-app-only-refinement` in their filenames.
The `mriReceipts` counts in the fairness JSON are currently retained receipts
(3 on/2 off), not lifetime totals;
they explicitly prove MRI work occurred in both branches. No APP receipt is
present in the off branch.

The stall monitor ignores legitimately parked idle actors. Active staff,
departing staff, service visitors, scored patients, parents, retail actors,
founder work and pedestrians must change path/status/care countdown; a queued
service can instead show progress of preceding work, training/provider or room
maintenance that shares its required resources. Unrelated services are not used
to excuse a blocked queue. Departed family tombstones without reservations are
allowed to outlive archived actors; active/live family links must exist.

**24-hour ledger, exact cents:** opening 1345000, service receipts
gross 564810, stock 7900,
scored settlements 20000, operating expenses
495918, training/upgrade costs
40000, sale refund 15000, closing 1400992.
The asserted equation on every tick is opening + service net + scored settlements
- operating expenses - command costs + sale refunds = current cash.
Receipt transaction keys are unique and a seen receipt cannot change/re-pay.
Observed receipts: ordinary APP 22, pediatric 5, wound 7, ostomy 7, MRI 5 and
in-house diagnostic reads 5; outside reading and retail also reconcile. The
reader's outside work uses its actual ledger, not fabricated income. All
automatic tick-driven XP/FSRS/review-intent changes: zero. The only 20 XP in the
mixed final state comes from the two explicitly answered scored charts.

Primary evidence: `mixed-clinic.json`, `mixed-clinic-state.json`,
`terminal.json`, twenty `reload-*.json` checkpoints,
`arrival-fairness.json`, and the focused/player/full validation logs below.

### Defect reports for manager-assigned fixes

**DEFECT-M9-1 — valid overdue idle timers are changed by reload.**

- Minimal skipped test: `level-four-integration-reload.test.ts`,
  "preserves a real APP's saved idle deadline during an in-care reload".
  Temporarily enabling that single test reproduces the failure; filter on
  `saved idle deadline` to avoid matching the matrix titles as well.
- Real checkpoint: tick 27, an APP appointment actually in care. Saved APP idle
  deadlines 20 and 23 reload as 37 and 37. The in-memory engine legitimately
  leaves a due idle action pending while the staff member is occupied.
- Cause: `packages/game-domain/src/persistence.ts:3582` accepts a staff idle
  deadline only when it is at/after the saved facility tick; an older valid value
  is replaced with tick + idleActionMinimumMinutes. Encounter normalization at
  `persistence.ts:2949` has the same rule. This changes the future opportunity
  for idle/amenity work after care ends. The first strict root matrix also found
  cosmetic shape differences: `resourceWaitReason` absent -> null at line 1289;
  parent `movementWaitReason: null` omitted around line 1391. They are explicitly
  normalized only in the separate passing care projection, not claimed equal.
- Suggested fix: preserve any valid nonnegative saved idle deadline, even when
  overdue; let the real reducer execute it when the actor is eligible. Retain
  fallback only for absent/invalid legacy values. Pick consistent optional/null
  representations at state creation/serialization/normalization, then rerun
  **strict whole-state** equality for all phases and future ticks.
- Evidence: `defect-1-trace.json`, `defectIdle.log` (minimal failure plus 21
  passing tagged care checks), and `focused-first.log` (original strict-root
  failures before the explicitly narrower care projection). Both care and money
  completion remain equal in the current active matrix; full-state equality is
  unaccepted.

**DEFECT-M9-2 — APP demand changes which scored case arrives after walkout timing diverges.**

- Minimal skipped test: `level-four-integration-defects.test.ts`,
  "APP on/off preserves the scored case selected at game minute 900". Identical
  real combined clinics, seed `level-four-m9-fairness`, timestamps and full
  clinical context; only APP per-home demand clocks are deferred in the off
  branch. Global/MRI demand remains on. Both run 900 ticks.
- At tick 900, `encounter.auto.4.15` is
  `case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-3` with
  APPs on, versus `case.gs028g.incisional-hernia.paired-behind-rectus` off.
  All 24 IDs/arrival times over the full day agree; case IDs do not.
- Cause: `packages/game-domain/src/clinical-selection.ts:60` excludes concepts
  from every encounter whose resolutionReason is null. Routine admission in
  `reducer.ts:6147` passes this state-dependent pool to the deterministic
  selector. At tick 899, the earlier asplenia encounter
  `encounter.auto.4.8` still has a live leaving_after_walkout path with APPs on,
  but is resolved/offscreen with APPs off. Its last satisfaction decay ticks are
  883 versus 863. That physical lifetime difference changes the concept pool
  (not the clinical RNG stream). Walkout is finalized only at physical exit in
  `reducer.ts:7397`; waiting/decay excludes movement in the loop around 8823.
  Current capability lists, eligible-case lists and active discussion concepts
  match at the divergence checkpoint. The trace establishes this selection
  cause; it does not claim which individual upstream amenity/movement event
  produced the initial 20-minute physical timing difference.
- Suggested fix/decision: if the required contract includes **case identity**,
  separate the semantic scored-admission/concept reservation schedule from
  service-dependent exit/amenity timing, preserving the rule against concurrent
  duplicate active concepts. Alternatively, manager must explicitly narrow the
  accepted fairness contract to arrival count/cadence; this worker has not done
  so. Do not simply remove active-concept exclusion or alter clinical meanings.
- Evidence: `defects.log` (real failure), `defect-2-trace.json` (ticks
  899/900, APP-only on/off), `appOnly.log` (strict 24-hour full-identity
  failure), and `arrival-fairness.json` (24-hour case/arrival tuples).

Both defects remain `it.skip` with stable DEFECT-M9 tags. No runtime fix was
made and no existing failing thyroid test was skipped/changed.

### Validation commands, configuration and exact output

All workspace tests use their checked-in configurations with
`--pool=threads --maxWorkers=1`. Every recorded command uses
`NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`.
The supplied preload converts only Vite's synchronous `net use` EPERM probe
into its normal asynchronous fallback; other process calls/plugins remain intact.
No replacement Vite/Vitest config, plugin removal, dependency/browser install or
default child-process pool was used. `NO_COLOR=1` was also set. The native
PowerShell runner is `.local-dev/level4-m9/run.ps1`; command receipts include
the literal npm command, preload and exit code. Streamed stderr blank records
may appear as `System.Management.Automation.RemoteException` in the raw
PowerShell logs; actual failures are the printed Vitest assertions/exit codes.

| Catalog | Worker execution | Result |
| --- | --- | --- |
| Focused domain | Both integration files; real engine/persistence | 28 passed, 1 defect skipped; exit 0 |
| Focused player | New LevelFourIntegration file | 3 passed; exit 0 |
| V1 | Full balance-config | 15 files, 129 passed; exit 0 |
| V2 | Full game-domain | 137 passed files, 1 skipped file; 3764 passed, 2 defect skips; exit 0 |
| V3 | Full clinical-content | 84 files, 608 passed; exit 0 |
| V4 | Full player | 160 passed files, 1 failed file; 1244 passed, only known thyroid failure; exit 1 |
| V5 | Root all-workspace typecheck | Seven workspaces; exit 0. Git-dependent test:boundaries deferred to manager. |
| V6 | Direct requested player production build | Ordinary Vite config/private-clinical guard; 629 transformed modules; exit 0. Existing chunk-size/plugin-timing warnings. Root build wrapper not invoked because it runs Git boundaries. |
| V7 | All-workspace test aggregate, bypassing only root Git boundaries | Workbench 43, player 1244, balance 129, authoring 81, content 608, research 83, domain 3764 passed; two defect skips; only thyroid failure; exit 1. Exact root npm.cmd test remains a manager check. |

The unrelated failure is `apps/player/src/session/surgeryCenterServicePreviews.test.ts:85:52`:
the pending label lacks "Off-site thyroid fine-needle aspiration". It is the same
failure identified by the prior handoffs. No other active suite failure occurred.
The 31 new active integration tests pass; two new requirements remain represented
by deliberately skipped failing reproducers, not a launch acceptance PASS.
The focused domain log is the pre-refinement 28-pass care/progression run; final
full V2 and V7 validate the corrected APP-only demand control and all other tests.

Root `npm.cmd test`, `npm.cmd run test:boundaries`, and root build were
**not** run: package.json proves they enter the Git-reading boundary verifier,
and the brief explicitly reserves that for the manager. Browser/V8/default-pool
checks were not run in this worker lane. No claim they passed.

Raw logs and receipts are in `.local-dev/level4-m9/`. The following transcripts
are exact logged output with terminal ANSI controls removed for Markdown;
the original logs retain the captured output.


**focused — exit 0** (`.local-dev/level4-m9/focused.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-integration.test.ts tests/level-four-integration-reload.test.ts --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-four-integration.test.ts tests/level-four-integration-reload.test.ts --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  2 passed (2)
      Tests  28 passed | 1 skipped (29)
   Start at  04:41:24
   Duration  112.27s (transform 1.55s, setup 0ms, import 2.34s, tests 109.78s, environment 0ms)
```

**playerFocused — exit 0** (`.local-dev/level4-m9/playerFocused.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFourIntegration.test.ts --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFourIntegration.test.ts --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  04:36:24
   Duration  19.70s (transform 1.43s, setup 0ms, import 1.86s, tests 17.76s, environment 0ms)
```

**V1 — exit 0** (`.local-dev/level4-m9/V1.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  15 passed (15)
      Tests  129 passed (129)
   Start at  04:41:52
   Duration  3.10s (transform 195ms, setup 0ms, import 1.33s, tests 112ms, environment 1ms)
```

**V2 — exit 0** (`.local-dev/level4-m9/V2.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  05:13:35
   Duration  479.97s (transform 2.99s, setup 0ms, import 46.97s, tests 422.98s, environment 7ms)
```

**V3 — exit 0** (`.local-dev/level4-m9/V3.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  84 passed (84)
      Tests  608 passed (608)
   Start at  04:41:52
   Duration  26.32s (transform 2.41s, setup 0ms, import 17.24s, tests 2.67s, environment 4ms)
```

**V4 — exit 1** (`.local-dev/level4-m9/V4.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 579ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 67ms
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

 Test Files  1 failed | 160 passed (161)
      Tests  1 failed | 1244 passed (1245)
   Start at  04:41:52
   Duration  101.90s (transform 3.79s, setup 0ms, import 38.46s, tests 52.26s, environment 8ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

**V5 — exit 0** (`.local-dev/level4-m9/V5.log`):

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

**V6 — exit 0** (`.local-dev/level4-m9/V6.log`):

```powershell
npm.cmd run build --workspace @gamify-surgery/player
```

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 629 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/index-OenHDQQQ.js                                      8,210.61 kB │ gzip: 1,812.70 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - forbid-private-clinical-modules (67%)
  - vite:prepare-out-dir (19%)
  - vite:css (7%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.
System.Management.Automation.RemoteException
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.02s
```

**V7 — exit 1** (`.local-dev/level4-m9/V7.log`):

```powershell
npm.cmd run test --workspaces --if-present -- --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/clinical-context-workbench@0.0.1 test
> vitest run --config vitest.config.ts --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/clinical-context-workbench


 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  05:13:35
   Duration  2.03s (transform 250ms, setup 0ms, import 778ms, tests 608ms, environment 0ms)


> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 465ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 49ms
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

 Test Files  1 failed | 160 passed (161)
      Tests  1 failed | 1244 passed (1245)
   Start at  05:13:38
   Duration  100.23s (transform 3.42s, setup 0ms, import 37.93s, tests 50.96s, environment 8ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
System.Management.Automation.RemoteException

> @gamify-surgery/balance-config@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/balance-config


 Test Files  15 passed (15)
      Tests  129 passed (129)
   Start at  05:15:18
   Duration  2.05s (transform 142ms, setup 0ms, import 910ms, tests 75ms, environment 1ms)


> @gamify-surgery/clinical-authoring@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-authoring


 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  05:15:20
   Duration  1.08s (transform 105ms, setup 0ms, import 316ms, tests 252ms, environment 0ms)


> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  84 passed (84)
      Tests  608 passed (608)
   Start at  05:15:22
   Duration  23.79s (transform 1.80s, setup 0ms, import 15.50s, tests 2.39s, environment 5ms)


> @gamify-surgery/clinical-research@0.0.1 test
> vitest run --config vitest.config.ts --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-research


 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  05:15:46
   Duration  1.82s (transform 168ms, setup 0ms, import 464ms, tests 791ms, environment 0ms)


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  05:15:48
   Duration  473.01s (transform 2.54s, setup 0ms, import 44.81s, tests 418.75s, environment 6ms)
```

**defectIdle — exit 1** (`.local-dev/level4-m9/defectIdle.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-integration-reload.test.ts --pool=threads --maxWorkers=1 -t DEFECT-M9-1
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-four-integration-reload.test.ts --pool=threads --maxWorkers=1 -t DEFECT-M9-1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-four-integration-reload.test.ts (24 tests | 1 failed | 2 skipped) 22836ms
     × DEFECT-M9-1: preserves a real APP's saved idle deadline during an in-care reload 63ms
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
System.Management.Automation.RemoteException
 FAIL  tests/level-four-integration-reload.test.ts > Level 4 M9 save/reload integration matrix > DEFECT-M9-1: preserves a real APP's saved idle deadline during an in-care reload
AssertionError: expected [ [ 'app.0', 37 ], [ 'app.1', 37 ] ] to deeply equal [ [ 'app.0', 20 ], [ 'app.1', 23 ] ]
System.Management.Automation.RemoteException
- Expected
+ Received
System.Management.Automation.RemoteException
  [
    [
      "app.0",
-     20,
+     37,
    ],
    [
      "app.1",
-     23,
+     37,
    ],
  ]
System.Management.Automation.RemoteException
 ❯ tests/level-four-integration-reload.test.ts:116:8
    114|         after: restored.employees.map(employee => [employee.id, employ…
    115|     expect(restored.employees.map(employee => [employee.id, employee.n…
    116|       .toEqual(state.employees.map(employee => [employee.id, employee.…
       |        ^
    117|   });
    118| });
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
System.Management.Automation.RemoteException

 Test Files  1 failed (1)
      Tests  1 failed | 21 passed | 2 skipped (24)
   Start at  04:39:05
   Duration  24.61s (transform 1.29s, setup 0ms, import 1.69s, tests 22.84s, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run tests/level-four-integration-reload.test.ts --pool=threads --maxWorkers=1 -t DEFECT-M9-1
```

**defects — exit 1** (`.local-dev/level4-m9/defects.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-integration-defects.test.ts --pool=threads --maxWorkers=1
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-four-integration-defects.test.ts --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-four-integration-defects.test.ts (1 test | 1 failed) 29887ms
     × DEFECT-M9-2: APP on/off preserves the scored case selected at game minute 900 29886ms
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
System.Management.Automation.RemoteException
 FAIL  tests/level-four-integration-defects.test.ts > Level 4 M9 isolated defect reproducers > DEFECT-M9-2: APP on/off preserves the scored case selected at game minute 900
AssertionError: expected 'case.gs028se.perioperative-dnr-error-…' to be 'case.gs028g.incisional-hernia.paired-…' // Object.is equality
System.Management.Automation.RemoteException
Expected: "case.gs028g.incisional-hernia.paired-behind-rectus"
Received: "case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-3"
System.Management.Automation.RemoteException
 ❯ tests/level-four-integration-defects.test.ts:38:46
     36|     if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new UR…
     37|       `${JSON.stringify({ before, after: { on: summarize(on), off: sum…
     38|     expect(on.encounters[id]!.frozenCase.id).toBe(off.encounters[id]!.…
       |                                              ^
     39|   }, 90_000);
     40| });
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
System.Management.Automation.RemoteException

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  05:09:55
   Duration  31.64s (transform 1.27s, setup 0ms, import 1.68s, tests 29.89s, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run tests/level-four-integration-defects.test.ts --pool=threads --maxWorkers=1
```

**appOnly — exit 1** (`.local-dev/level4-m9/appOnly.log`):

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-four-integration.test.ts --pool=threads --maxWorkers=1 -t 24 hours with APPs
```

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-four-integration.test.ts --pool=threads --maxWorkers=1 -t 24 hours with APPs


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-four-integration.test.ts (5 tests | 1 failed | 4 skipped) 48869ms
     × preserves scored arrival count/times for 24 hours with APPs on/off (case identity: DEFECT-M9-2) 48868ms
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
System.Management.Automation.RemoteException
 FAIL  tests/level-four-integration.test.ts > Level 4 M9 integrated launch > preserves scored arrival count/times for 24 hours with APPs on/off (case identity: DEFECT-M9-2)
AssertionError: expected [ …(24) ] to deeply equal [ …(24) ]
System.Management.Automation.RemoteException
- Expected
+ Received
System.Management.Automation.RemoteException
@@ -120,75 +120,75 @@
      ],
    ],
    [
      "encounter.auto.4.15",
      [
-       "case.gs028g.incisional-hernia.paired-behind-rectus",
+       "case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-3",
        "routine",
        900,
      ],
    ],
    [
      "encounter.auto.4.16",
      [
-       "case.nephrolithiasis.hematuria-colic",
+       "case.bread-butter.perianal-abscess.draining-pain",
        "routine",
        949,
      ],
    ],
    [
      "encounter.auto.4.17",
      [
-       "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
+       "case.gs028f.neck-mass.c2-proposed-open-plan",
        "routine",
        1013,
      ],
    ],
    [
      "encounter.auto.4.18",
      [
-       "case.gs028g.incidental-gallbladder.paired-deeper-sections",
+       "case.hs.accessory-spleen.incidental",
        "routine",
        1069,
      ],
    ],
    [
      "encounter.auto.4.19",
      [
-       "case.gs028d.geriatrics.b-cognitive-risk",
+       "case.gs028c.dcis.a-five-mm-request",
        "routine",
        1114,
      ],
    ],
    [
      "encounter.auto.4.20",
      [
-       "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
+       "case.pediatric-clinic.growing-firm-neck-node",
        "routine",
        1186,
      ],
    ],
    [
      "encounter.auto.4.21",
      [
-       "case.rectal-cancer.accountant-followup",
+       "case.post-thyroidectomy-voice.coach-volume",
        "routine",
        1255,
      ],
    ],
    [
      "encounter.auto.4.22",
      [
-       "case.gs028f.gynecology.c2-unlocated-new-pain",
+       "case.thyroid-nodule.family-clinic",
        "routine",
        1329,
      ],
    ],
    [
      "encounter.auto.4.23",
      [
-       "case.graves-rai-appropriate-candidate.v4",
+       "case.gs028e.coagulation.paired-elective-record-workup",
        "routine",
        1383,
      ],
    ],
  ]
System.Management.Automation.RemoteException
 ❯ tests/level-four-integration.test.ts:338:29
    336|     // DEFECT-M9-2 below covers the failing full case-identity compari…
    337|     // separate passing assertion proves cadence/count only, not case …
    338|     expect([...onArrivals]).toEqual([...offArrivals]);
       |                             ^
    339|     expect(m9Learning(on)).toEqual(m9Learning(off));
    340|     for (const line of ["income.app_consult", "income.pediatric_consul…
System.Management.Automation.RemoteException
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
System.Management.Automation.RemoteException

 Test Files  1 failed (1)
      Tests  1 failed | 4 skipped (5)
   Start at  05:09:55
   Duration  50.64s (transform 1.28s, setup 0ms, import 1.68s, tests 48.87s, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run tests/level-four-integration.test.ts --pool=threads --maxWorkers=1 -t ^^^"24^^^ hours^^^ with^^^ APPs^^^"
```

### Browser acceptance checklist for the manager

Run `node tools/qa/level-four-rooms.mjs` in the manager environment. Use a
**disposable persistent QA browser profile/context**, record `location.origin`
(must be **http://127.0.0.1:5184**) and reload the same query URL. Each existing
query selects a separate synthetic campaign and preserves it on reload; opening
an already-used query does not reset it. A fresh disposable profile supplies clean
fixtures. No new QA bootstrap/route was added in this lane.

| Exact QA URL/state | Manager action and visible acceptance |
| --- | --- |
| http://127.0.0.1:5184/ | In a fresh disposable context, start an ordinary fresh campaign. Check tutorial/founder/patient flow, Levels 1/2/3 advancement and that the normal cap is 4. The worker's prior-gate compression is not rendered gameplay acceptance. |
| http://127.0.0.1:5184/level4-rooms-qa.html?state=l3ready | Open Goals; existing gates met. Advance once to Level 4, XP 0/750, existing rooms/staff/cash/history retained; reload twice. One advancement Milestone, no malformed "Level current complete was resolved." row, no Level 5 control. |
| http://127.0.0.1:5184/level4-rooms-qa.html?rooms=placed | Inspect all four room anchors/backings and locked orientation; empty/staffed comparison; door approaches, cleaning/repair, build caps/costs and sale previews. Use the optional combined M9 setup below for integrated play. |
| http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments | Play; two ordinary APPs share real clinic demand. Watch FIFO queues and no double care; pause/reload waiting, care, completion/payment and departure. Train an APP during care, then inspect queued absence, actual departure, training and return; role/busy/ETA labels remain truthful. |
| http://127.0.0.1:5184/level4-rooms-qa.html?apps=pediatrics | Watch child/parent from street to waiting, doorway, exam and exit at 1x and 4x. Parent in an adult armrest chair/standing fallback, child on stool/table; pair always same room. Pause mid-doorway and reload; sale/blockage reroutes both, without orphan/chair overlap. |
| http://127.0.0.1:5184/level4-rooms-qa.html?apps=pedcharts | Open Noah Bennett (5, Male), named father Daniel; short complaint, complete question, randomized parallel options and any displayed testing estimates. Answer after both settle; follow scored family departure and XP/FSRS once. Reload waiting/in-care/doorway/departure. Clinical records remain needs_clinician_review. |
| http://127.0.0.1:5184/level4-rooms-qa.html?apps=mri | Watch visitor on table and technician at operator seat, acquisition, queued results, actual Reading work and exit. Pause/reload each phase. One MRI fee and one additive local +$5 read, accurate phase/queue estimates; no double-read/backpayment. |
| http://127.0.0.1:5184/level4-rooms-qa.html?apps=wound | Watch routine wound/ostomy visits with real APP on backless clinician stool, patient in upright armrest chair; training/return, upgrade between visits, mid-visit sale/reroute, one frozen quote/receipt per visit; no automatic XP/FSRS. |
| http://127.0.0.1:5184/level4-rooms-qa.html?state=l4almost | This accepted M8 fixture already has a historical pediatric witness. Complete the real wound visit, then pause, sell a specialty room, reload twice. Goals retains complete state; Alerts has one informational Milestone; no headline/footer completion toast, reward repetition or Level 5. It is not browser proof of both real witnesses; use the combined M9 fixture for that. |

**Combined M9 browser state (optional fixture setup, manager only):** the new
fixture is pure browser-compatible TypeScript and can be imported through the
existing Vite QA server. At the **placed** URL in a disposable QA profile only,
pause first, then use this DevTools setup to replace only that selected synthetic
campaign. This is a suggested manager setup, **not worker-executed browser QA**.
It grants fixture cash/Level 4, uses the full ordinary clinical pool in the
browser, and does not import the worker's narrow two-case testing context.

```javascript
if (location.origin !== "http://127.0.0.1:5184" ||
    location.pathname !== "/level4-rooms-qa.html" ||
    location.search !== "?rooms=placed") throw new Error("Disposable placed QA URL required");
const { loadPrototypeProfile, savePrototypeProfileResult } = await import("/src/session/prototypeStorage.ts");
const { createLevelFourIntegrationState, m9Apply, M9_PEDIATRIC_CASE_ID, M9_NOW } =
  await import("/@fs/C:/Users/rowla/Projects/GamifySurgery/tests/fixtures/level-four-integration.ts");
const { profile } = loadPrototypeProfile();
const target = profile.campaigns.find(c => c.campaignId === "campaign.qa.level-four-rooms-m3.placed");
if (!target || target.campaignId !== profile.activeCampaignId) throw new Error("Placed QA campaign required");
let state = createLevelFourIntegrationState("level-four-m9-browser");
state.campaignId = target.campaignId;
state.paused = true;
state.nextRoutineArrivalTick = 1;
state = m9Apply(state, { type: "ADMIT_PATIENT", encounterId: "encounter.m9.browser.pediatric",
  caseId: M9_PEDIATRIC_CASE_ID, selectedAtRealMs: M9_NOW }, "m9.browser.admit");
target.state = state;
target.name = "Level 4 M9 combined disposable QA";
const saved = savePrototypeProfileResult(profile);
if (!saved.ok) throw new Error(saved.failure.message);
location.reload();
```

Play that same placed URL through 24 game hours, answering selected scored charts
including Noah; train the Wound APP while it has work, upgrade Wound after hour 4,
and sell the original Pediatric Exam while a visit is in care after hour 8. The
spare Pediatric Exam/APP remains for rerouting. Watch care supports, single-room
pairs, queues, training attendance/return, actual receipt delivery and Money/HUD
breakdowns; capture save/reload at each service phase and mid-doorway. To isolate
the terminal UI with both engine-earned witnesses, start a clean instance of this
combined fixture with synthetic XP 750; no witness is prefilled. Clinical XP/FSRS
must change only after an explicitly scored answer, not appointments/reading.

Run the relevant existing e2e checks (Level 3 goals, Reading/radiologists,
diagnostic timing and room upgrades) with ordinary manager configuration. There
is **no tests/e2e/level-four.spec.ts yet**; the proposed V8 catalog path is not
implemented by this test-lane brief. Perform/checklist the integrated Level 4
browser scenario rather than claiming that absent spec ran.

Check at 1x/4x and normal/wide/minimum zoom, at **1600x1000, 820x1000 and
390x1000**. No horizontal overflow, room-anchor clipping, child/parent split,
footer/status/prototype-notice overlap, completion duplication, page/console
exceptions, failed requests or missing art assets. Exact reducer reload equality
and identity-level fairness remain blocked by the reported defects regardless
of whether the animation appears continuous.

Native pre-browser module compilation was also checked with the supplied preload:
`node .local-dev/level4-m9/browser-fixture-transform.mjs` — exit 0. It uses the
ordinary Vite config/plugins in middleware mode without a listener. Exact output
recorded in `browser-fixture-transform.log`:

```text
PASS ordinary Vite config/plugin transform: tests/fixtures/level-four-integration.ts
PASS ordinary Vite config/plugin transform: tools/economy-audit/level-four-simulation.ts
PASS ordinary Vite config/plugin transform: apps/player/src/session/prototypeStorage.ts
No listener, browser, profile or source write; compile validation only.
```
This is compile evidence for the optional fixture imports, not rendered-browser
or profile-injection acceptance.

Owner pathway remains **START_GAME.cmd -> exact http://127.0.0.1:4173** in the
usual persistent profile. The 5184 QA profile/origin, other ports/hosts and remote
https://melissarowlandc-afk.github.io/GamifySurgery/ have separate saves. No durable
pathway change and no owner save access occurred. This state remains **LOCAL ONLY**;
after manager acceptance and fixes, remind the owner to say **"push to GitHub"**
for the manager's audited checkpoint backup. Worker did not commit or push.

**Next action:** manager inspects these six new files and exact evidence, assigns
DEFECT-M9-1/2 fixes or explicit scope decisions, reruns strict required scenarios
and default-pool/root boundaries, completes browser acceptance, and updates the
manager-owned CURRENT_THREAD_HANDOFF. M9 is a completed QA handback with two open
defects; it is not an accepted integrated launch checkpoint.
