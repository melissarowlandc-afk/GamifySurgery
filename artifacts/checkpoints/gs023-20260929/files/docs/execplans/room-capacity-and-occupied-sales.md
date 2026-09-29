# Room capacity, staffing, and occupied room sales

## Complete locally — 2026-09-29

All implementation milestones and acceptance checks are complete. Historical
in-progress notes below are superseded by this section. Owner playtest is next.

- Sol `room_capacity_domain` completed domain/balance implementation and natural
  question-flow regressions. Terra `room_staff_rules_inventory` completed player
  presentation, departure regression, save diagnosis and stale fixture corrections.
  Sol `visitor_browser_acceptance` completed isolated browser acceptance. Parent
  reviewed actual source/test diffs, corrected acceptance gaps through workers,
  reviewed screenshots and independently ran the integrated checks.
- Final full domain:1071/1071 tests,60files PASS (`--maxWorkers=2 --testTimeout=20000`).
  Final full player:547/547 tests,86files PASS. Full balance:41/41 PASS.
  Domain/player/balance TypeScript, isolated Vite production build, runtime dependency
  boundary and launcher checks PASS. Scoped diff whitespace check PASS.
- Final browser:4PASS/2intentional project skips,44.6s. Covers real hiring, finite
  count lines, complete desktop/compact named sale modal, cancel/confirm/Undo,
  rebuilding over dismissed staff, new-door crossing, reload, visible sidewalk
  travel and eventual off-map removal. Private4198 server stopped; owner4173 untouched.
- Domain proof covers remaining-time transfer after >60minutes of busy-room waiting,
  no duplicate/unearned receipts, persisted departures, direct distinct idle imaging
  seats, no replay of completed phases, terminal/continuation/staged/result-gate
  offsite fallback and actual return/result/follow-up after last-room sales.
- Save round-trip fixes preserve absent optional encounter fields and initialize
  amenity collections consistently. Existing periop beds, recovery, amenities,
  clinical content, frozen cases and unrelated dirty work are preserved.
- Retail and old staffing/endoscopy test fixtures now match approved room capacity
  and previously completed periop behavior. No economy or retail-demand changes.
- Evidence: `.local-dev/room-capacity-sales/` (source snapshots, source-freeze hashes,
  final test/build logs and browser screenshots/result).500dirty paths at closeout;
  no broad staging, commit, push or deployment by this task.

Next action: owner Save & Close, reopen `START_GAME.cmd`, use exactly
`http://127.0.0.1:4173` in the usual persistent browser profile. Verify room growth,
named sale warnings and interrupted testing in the existing clinic. OR cap5 remains
reserved for future playable OR support; this task adds no OR gameplay. This valuable
checkpoint is local; owner can say **"push to GitHub"** to request an audited backup.

## Resumed 2026-09-29

Owner says coordination is clear and to resume. Reread AGENTS, current handoff,
this plan and completed periop-beds/recovery/amenities follow-up.495 dirty paths;
fresh pre-resume sources saved under .local-dev/room-capacity-sales/resume-before/.
Preserve completed periop bed ownership, bathroom trips and departure itineraries.
Sol resumes M1 lifecycle fixes in domain; Terra may prepare browser acceptance in
separate tests only. Parent owns integration/review and final handoff.

Resume progress: Sol room_capacity_domain implementing preserved current-phase
remaining-time transfer, narrow grass/door-aware routes, departing actor save support,
shared idle imaging seats. First real collection operation plus controlled busy-room
reservation proves >60-minute queue,7 remaining minutes/reload and unique receipts;
final-room visitor cancellation earns no fee. Parent review requires additional
question-linked terminal/continuation/staged/result-gate cases: external-processing
must not proceed onsite when the local sample was never collected. Preserve followup.
Parent initial relevant89 tests:86pass/3fail (legacy overflow home preservation,
clinical acquisition/idle imaging interaction, custom futureMRI); Sol correcting.
Terra implemented M2 and portal correction after parent found screenshot clipping;
component9pass. Sol visitor_browser_acceptance took over browser proof after Terra
firstcapacitycasepass; livecanvas selection/modal/Undo/rebuild/reload now exercised,
full compact modal and standing rebuilt-room actor screenshots parent-reviewed.
Await final whole-exit/door-route assertions and unclipped reload-actor framing.
Terra added distinct room-sale-departure.test.ts (1pass) for real soldphleb employee
position/payroll/reload/offmap retention/removal. No owner saves touched.
Browser rebuilt-room case now proves exact new-door crossing, preserved path/location
on reload, full visible sidewalk sample and offmap state/nativeactor removal.
Parent continuation decision: last-room cancellation must visibly leave AND return
before advancing next question. Reuse existing configured service external-route
duration if available; otherwise use real roundtrip travel with no invented dwell.
Do not strand an actionable followup offscreen. Persist sale-specific external travel.

Acceptance checkpoint: parent full player suite547/547 PASS across86files; optional
encounter fields no longer appear merely from deserialize, and initial amenity state
now matches normalized saves. Parent reviewed Terra capacity/gallery test updates.
Browser proof finalized4PASS/2intentional project skips; private4198 server stopped.
Parent reviewed full modal, rebuilt-door crossing, reload/sidewalk and offmap evidence.
Boundary and launcher checks, player types and isolated Vite build PASS. Full domain
regressions running; Sol finishing natural terminal/continuation/staged/result fallback
and path-contiguity fixes. Terra diagnoses broader retail/EGD test failures read-only.
Not yet complete: await final domain acceptance and source freeze.

## Goal and authority

Owner approved implementation 2026-09-29 after clarifying two peri-op nurses per
room, shared imaging seats/random excess-staff layoffs, and transfer of interrupted
tests to another compatible room (waiting if busy). Replace fixed hiring caps with
built-room capacity; make room sales possible with staff, occupants and active work.

## Requirements and decisions

- Caps: examination20, bathroom10, waiting5, minor procedure5, phlebotomy3,
  EVS10, endoscopy5, peri-op3, training1, coffee10, GLP-1 suites5, US/X-ray/CT1
  each. Front Desk1/protected, hallways unlimited. OR5 when playable; do not add
  new OR gameplay or employee roles.
- Slots: GLP NP2/suite; peri-op nurse2/room; phlebotomist1/station; EVS1/closet;
  endoscopy nurse1 and endoscopist1/endoscopy room; receptionist1/Front Desk.
- Imaging tech capacity is total built imaging rooms. Techs share all modalities;
  idle techs occupy distinct available imaging seats, not permanent home ownership.
  Sale fires a random excess tech only if total staffing exceeds remaining capacity.
  Confirmation must name the exact employees who will be dismissed; no reroll on
  confirmation. Use existing deterministic game RNG conventions where possible.
- Other room-owned employees are dismissed with their room. Fired people remain
  visible, walk out, cease work/payroll, then disappear only off map.
- Displaced people retain positions during Build Mode. On resume route across
  grass to sidewalk or through current doors/halls if the space was rebuilt.
- Interrupted work queues/transfers to compatible remaining rooms; if none remain,
  patients leave for external testing, with no income for uncompleted clinic work.
  Preserve completed earnings, clinical results and exactly-once settlement.
- Build cards display a separate N/cap built line (unlimited explicit for hallways).
- Preserve existing saves and dirty work; do not silently destroy legacy rooms or
  dismiss excess staff on load. Block additions above caps. Sales apply new rules.
- Build undo must restore the pre-sale staff, occupants, reservations and work.
- No clinical content/economy price changes, no owner save edits, commit/push/deploy.

## Repository state

473 dirty paths at initial design inventory; multiple prior features complete
locally. Read AGENTS.md and current handoff. Snapshot of current domain, balance,
and player sources plus git status: .local-dev/room-capacity-sales/before/.
Active tutorial plan remains historical context; this is the bounded follow-up.

## Milestones and ownership

1. Sol: domain capacity, home/seat allocation, sale consequences, interrupted-work
   transfer/external fallback, visible departure and current-layout rerouting;
   meaningful domain tests. Own domain + balance sources/tests only.
2. Terra: Build/Hire presentation, named sale confirmation integrating domain preview,
   appropriate UI regressions. Own player sources/tests only. Domain contract locked
   by Astra; disjoint M2 starts while Sol finishes M1. Defer integrated type/build
   checks until M1 compile-ready. No shared file ownership.
3. Sol/Terra: isolated browser acceptance for caps/hire/sale/transfer/grass/rebuild,
   persistence and regression validation. Parent reviews actual diffs and evidence.
4. Astra: acceptance, plan/handoff update, owner instructions and backup reminder.

## Acceptance and validation

Domain regressions for room caps and staffing growth, peri-op/GLP two seats,
imaging shared seats/random only-excess dismissals, preview-confirm identity,
no-fee interrupted labs, compatible busy-room transfer, fired actor exits,
occupied-room sale/rebuild/undo, persistence and legacy saves. Relevant player tests,
TypeScript, production build, boundary/launcher checks; isolated browser profile and
port (never owner4173). Preserve chart-action recovery and endoscopy prep/recovery.

## Progress / discoveries / next action

- Planning complete. Inventory by Terra read-only: current sales reject occupants,
  assigned staff, traversing paths and reservations; firing removes actors instantly.
  Most roles currently home to the first matching room. This requires lifecycle
  changes, not just relaxing the sell guard.
- M1 delegated to Sol room_capacity_domain, currently implementing domain lifecycle.
- Terra room_staff_rules_inventory completed read-only M2 integration plan: existing
  BuildPanel modal pattern, SelectedRoomBuildView preview, dynamic staff counts in
  both view-model lists, separate departing actors projected into normal facility
  staff views. No additional selected-room roster feature is required.
- Review priorities: preview must commit the same employee IDs displayed, not reroll;
  transfer queues must not expire after60 minutes merely because the other room is
  busy; clinical continuation returns after external testing; previously completed
  revenue stays intact; rebuilding must recompute routes from actual positions.
- Domain API locked: getRoomStaffCapacity; getRoomSalePreview with exact dismissal
  IDs/names and confirmationToken; SELL_ROOM.saleConfirmationToken; optional persisted
  departingEmployees extending EmployeeState. Terra authorized M2 in player only.
- Next: review M1/M2 handbacks and run M3 integrated/browser acceptance.

## Concurrent domain ownership notice (2026-09-29)

The active periop-beds-recovery-amenities.md task introduced bed-flow changes in
service-operations/types/reducer/staff/persistence after this task's snapshot.
Those changes are preserved. At12:55 EDT our Sol was instructed to pause edits in
overlapping domain/balance files and continue only new helpers/tests pending
ownership coordination. Cross-task messaging tools are unavailable; user asked
asynchronously to let that task finish an atomic milestone and pause domain edits.
Terra continues surgically scoped player UI changes, preserving concurrent bed
supportId/view-model changes. Do not overwrite either task's partial work.

## Partial handback and reviewed validation

- Sol M1 partial: caps, dynamic hires, seat reconciliation, stable named/random
  excess-only imaging sale preview, draft departures/service interruption. Parent
  reviewed capacity helper, balance diff and tests. Domain7/7 independently PASS;
  balance1/1 worker PASS; domain TypeScript independently PASS at13:00 EDT after
  external temporary errors cleared. File ownership still not released.
- Terra M2 complete: separate built line, dynamic Hire counts/guidance, zero-room
  build hint, frozen named confirmation/roomID/token/resale value, no missing-preview
  bypass, departing staff projection without active roster/payroll/seating. Parent
  reviewed actual BuildPanel/session/viewModels diffs and independently passed20/20
  player tests in3files. Player types still reported concurrent alert errors;
  no complete build/browser acceptance claim. UI interaction requires browser proof.
- Pending M1 fixes: retry interrupted CURRENT phase (do not advance phaseIndex),
  retain remaining service time, exempt sale-transferred visitors from60-minute
  abandonment; normalize departingEmployees on reload; preserve all four test-order
  purposes during external fallback; replan displaced actors against rebuilt layout.
- Pending validation: actual busy-room transfers/completion once, unfinished lab
  no-fee departure, visible dismissed exits, reload, occupied sale/rebuild and Undo;
  broader service/persistence/staffing tests, player types, build and browser.
- NOT complete/ready for owner playtest. Both workers stopped overlapping edits.
  Next action after user coordinates domain writer pause: reread AGENTS/current
  handoff/this plan, inspect dirty changes and external periop plan, then resume Sol
  room_capacity_domain for lifecycle completion before integrated acceptance.
