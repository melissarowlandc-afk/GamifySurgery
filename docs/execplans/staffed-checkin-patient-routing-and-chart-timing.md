# Staffed Check-In, Patient Routing, and Chart Timing

## Goal

Make each clinic visit read as one coherent, persisted journey: a patient enters
the clinic, waits at the Front Desk until an eligible seated worker checks them
in, chooses the best available waiting place, travels with the founder to a
shared Examination Room when the chart opens, and follows the correct care or
departure route when the chart closes. An unstaffed patient who waits more than
one facility hour must generate an actionable alert and lose satisfaction.

## Requirements

- Initial clinic arrival ends at the public side of the Front Desk. Check-in
  completes only while the patient is there and either the founder or an
  operational receptionist is stationary at the staff-side desk anchor.
- The chart enters the Waiting list immediately when check-in completes. The
  presentation and currently available question can be opened immediately;
  no separate notification delay gates chart availability.
- Immediately after check-in, the patient reserves and travels to the first
  reachable unoccupied destination in this exact preference order:
  1. a chair in the Waiting Room;
  2. the visitor chair in the Front Desk room;
  3. a chair in any other constructed surgery-center room;
  4. an open standing place in the Waiting Room;
  5. a reachable public standing/wandering place elsewhere in the surgery
     center.
- Opening an eligible chart atomically reserves one available Examination Room,
  routes the patient to its bed, and routes the founder to its stool. The
  question remains usable while both actors are walking.
- Closing an unfinished chart releases the Examination Room and sends the
  patient back through the waiting preference selector. Closing a completed
  chart keeps the existing departure behavior. A testing decision keeps the
  existing persisted on-site/off-site service journey and must not be replaced
  by a generic chart-close shortcut.
- After examination attendance ends, the founder returns to the Front Desk when
  no operational receptionist exists. With a receptionist, the founder may
  select deterministic low-priority activities such as public wandering,
  sitting, or visiting the bathroom.
- A player-issued founder destination or facility task supersedes an automatic
  escort, return, or idle plan. Existing protections against interrupting an
  already-running player-directed work task or reserved clinical service remain.
- A receptionist normally occupies or returns to the Front Desk staff anchor.
  Water-cooler refill is the intended routine exception, after which the
  receptionist returns to the desk.
- On the first simulation tick strictly more than 60 facility minutes after an
  arrived patient begins waiting for Front Desk staffing, emit one durable,
  actionable alert and apply one configurable `no_receptionist` satisfaction
  loss. The alert must not offer to open an unavailable chart.

## Constraints and non-goals

- Extend the existing encounter, movement, room-reservation, service-routing,
  satisfaction, and alert systems. Do not create a parallel Phaser-owned or
  presentation-only simulation.
- Keep clinical lifecycle state separate from the operational check-in gate.
  Preserve stable clinical case/concept identity and do not edit clinical copy.
- Keep returning-from-testing patients on their existing result journey; they
  already have a chart and do not repeat initial check-in.
- Preserve frozen service routes and the timing contract of pending results.
- Preserve old campaigns with an explicit save migration. Legacy encounters
  that were already past arrival remain checked in and chart-eligible.
- Preserve every unrelated dirty graphics, proof, clinical-content, and handoff
  change in the shared worktree. In particular, avoid broad rewrites of
  `FacilityScene.ts` and do not undo the Front Desk or wall-layering work.
- No commits, pushes, main-branch promotion, or deployment are part of this
  task. At the finished checkpoint, remind the owner to say `push to GitHub`.
- Canonical local browser testing uses `START_GAME.cmd` and exactly
  `http://127.0.0.1:4173`; another origin has a separate browser save.

## Relevant repository state

- `EncounterState` already persists clinical lifecycle, patient position,
  patient movement, Examination Room reservation, waiting pressure, chart
  attention, and pending-result routes.
- `createEncounter()` currently routes an arrival to the Front Desk and
  `completePatientMovement("arriving_for_check_in")` currently checks the
  patient in without testing physical staffing.
- `getPatientLists()` hides only patients still using the arrival movement.
  It must key chart availability to the explicit check-in status instead.
- `chooseWaitingDestination()` currently supports Waiting Room seats, a narrow
  Front Desk fallback, and then the sidewalk. It does not implement the full
  ordered indoor hierarchy.
- `OPEN_CHART` already reserves an available Examination Room and routes the
  patient, but it does not escort the founder or use semantically named
  bed/stool anchors.
- The current chart-close reducer sends resolved patients away but leaves
  unfinished active patients in the exam room.
- Receptionist idle movement currently wanders within the home room; founder
  movement has no automatic post-exam activity.
- Patient-attention feed rows currently have a five-minute grace period after
  check-in. That remains a separate reminder policy; it does not delay the
  chart appearing in Waiting.
- `GameState.schemaVersion` is 6. New persisted check-in and automatic activity
  fields require version 7 normalization/migration.
- The shared tree contains a separate active wall-corner/layering graphics
  milestone. Its paths and hunks must be preserved and reviewed for overlap
  before any presentation edit.

## Decisions already made

- Add an orthogonal persisted `checkInStatus` (`approaching`,
  `awaiting_staff`, or `checked_in`), `checkInWaitingSinceTick`, and a one-shot
  overdue marker to each encounter. Do not overload the clinical lifecycle.
- A valid Front Desk attendant is stationary at the rotated staff anchor and
  is not performing an incompatible activity. Either the founder or an
  operational receptionist qualifies.
- Arrival completion transitions to `awaiting_staff` at the Front Desk public
  anchor. The reducer checks for staffed waiting encounters every facility
  tick so either actor arriving at the staff anchor can complete check-in.
- Use the existing `no_receptionist` dissatisfaction attribution for the
  one-hour loss, but give the overdue penalty and threshold their own balance
  fields. Do not reuse the one-time facility-experience check-in assessment as
  the timer.
- The overdue alert is patient-specific but targets the Front Desk room (or an
  equivalent non-chart action) so the UI never labels an unavailable chart as
  openable.
- Use rotated semantic care anchors in room navigation metadata:
  Examination patient bed and clinician stool. Keep generic primary/staff
  anchors for existing employee and compatibility behavior.
- Reuse each room's authored waiting anchors as its chair inventory. Add or
  derive deterministic public standing candidates separately; exclude fixture
  blocks, door thresholds, actor positions, and already reserved destinations.
- Reserve route endpoints when selecting waiting and exam destinations so two
  patients completing transitions on the same tick cannot claim one place.
- Add persisted automatic founder activities for exam attendance, Front Desk
  return, and idle travel. Mark them as automatic so player movement can replace
  them without weakening protections for explicit player work and service
  reservations.
- Model bed/stool occupancy in view data. Use the existing founder seated art
  for the stool and the authored patient exam-table atlas where available;
  presentation fallback must remain safe for legacy/generated appearances.
- If no preferred indoor destination is reachable, retain a deterministic safe
  entrance fallback rather than strand the encounter, while treating that as
  an exceptional map state rather than the ordinary waiting tier.

## Milestones

1. Persisted staffed check-in gate, immediate Waiting-list eligibility,
   one-hour overdue alert/satisfaction loss, receptionist desk-hold behavior,
   version-7 migration, and focused tests.
2. Exact ordered waiting selector, semantic chair/standing and exam bed/stool
   anchors, collision-safe reservations, patient/founder coordinated exam
   routing, pose projection, and focused tests.
3. Chart-close return/disposition behavior, founder automatic return/idle
   choices, explicit player override rules, and focused tests.
4. Cross-package integration validation, fresh-campaign bootstrap correction,
   desktop browser journey proof, native visual inspection, scoped diff review,
   and handoff update.

## File or module ownership

- Milestone 1 Terra owns narrow changes in:
  - `packages/game-domain/src/types.ts`
  - `packages/game-domain/src/reducer.ts`
  - `packages/game-domain/src/selectors.ts`
  - `packages/game-domain/src/persistence.ts`
  - `packages/game-domain/src/staff.ts`
  - `packages/balance-config/src/schema.ts`
  - `packages/balance-config/src/prototype-balance.ts`
  - `packages/balance-config/src/prototype-alerts.ts`
  - directly corresponding game-domain and alert view-model tests, plus a
    narrow alert target/copy projection only if required
- Milestone 2 Terra owns spatial/navigation metadata and helpers, waiting/care
  reducer paths, session view-model pose semantics, narrow compatible
  `FacilityScene.ts` pose integration after the graphics milestone is stable,
  and focused unit/E2E coverage.
- Milestone 3 Terra owns founder automatic activity/reducer behavior,
  chart-close transitions, receptionist/founder interaction refinements, and
  focused behavior tests.
- Sol owns the plan, milestone sequencing, overlap coordination, actual diff
  and test review, browser/image acceptance, tiny integration corrections, and
  the continuous handoff.

## Acceptance criteria

- With nobody seated behind the Front Desk, an arriving patient stops at the
  public desk anchor, has no chart in Waiting, and does not check in merely
  because time advances.
- The founder or an operational receptionist reaching the desk anchor causes
  the waiting patient to check in on simulation time, immediately exposes the
  chart in Waiting, applies check-in experience once, and starts movement to
  the best available waiting destination.
- Waiting destinations exhaust each tier in the stated order and never assign
  one endpoint to two patients.
- At exactly 60 elapsed waiting minutes there is no overdue event; on the first
  tick after 60 there is exactly one alert and exactly one configured
  satisfaction loss. Later ticks/reloads do not duplicate either.
- Receptionists return to and hold the desk except for water refill; the founder
  can satisfy check-in while no receptionist is hired.
- Opening a chart reserves one Examination Room, routes patient/founder to its
  bed/stool, renders both stationary actors with the intended seated poses, and
  leaves questions immediately answerable during travel.
- Closing an unfinished chart returns the patient to an eligible waiting place
  and releases the room; completed and pending-result journeys remain correct.
- Before a receptionist exists, the founder returns to the Front Desk after the
  encounter. With a receptionist, the founder chooses a legal deterministic
  low-priority destination. A player command replaces any such automatic plan.
- A version-6 campaign restores as version 7 without losing encounters,
  positions, chart progress, FSRS history, or frozen service routes.
- Typecheck, build, focused unit suites, and a browser journey regression pass.

## Validation

- Focused Vitest suites for:
  - `timing-encounters.test.ts`
  - `patient-alert-delay.test.ts`
  - `facility-experience.test.ts`
  - `founder-map-movement.test.ts`
  - `receptionist-water-refill.test.ts`
  - persistence/migration and selector/view-model coverage
  - spatial/anchor and character-presentation coverage added by Milestone 2
- `npm.cmd run typecheck`
- `npm.cmd run build`
- a focused desktop-Chrome E2E journey using the canonical local origin
- native inspection of any new screenshots
- `git diff --check` and path-scoped diff review against the dirty baseline

## Progress

- [x] Read the applicable repository instructions and current continuous
  handoff.
- [x] Audit the existing patient lifecycle, check-in timing, waiting selector,
  pathfinder, Examination reservations, chart close behavior, founder/staff
  movement, satisfaction, alerts, save normalization, and presentation poses.
- [x] Record the intended state transitions, migration behavior, and milestone
  boundaries in this ExecPlan.
- [x] Implement and accept Milestone 1. Terra added the persisted staffed
  check-in gate, immediate post-check-in Waiting eligibility, the configurable
  tick-61 alert/satisfaction consequence, receptionist return-to-post behavior,
  and version-7 migration. Sol's diff review caught and returned reload,
  direct-command, alert-resolution, and tick-ordering gaps; the corrected pass
  now has 10 focused files / 88 tests passing, workspace typecheck passing, and
  full diff validation passing under Sol's independent rerun.
- [x] Implement and accept Milestone 2. Terra added the exact indoor waiting
  preference hierarchy with persisted collision-safe reservations, semantic
  Examination bed/stool anchors, immediate coordinated patient/founder routing
  on chart open, seated/exam-table pose projection, and save normalization.
  Sol returned the first passes for missing acceptance coverage, corrected
  invalid test fixtures during review, and independently verified 5 game-domain
  files / 41 tests, 3 player files / 32 tests, 1 balance file / 6 tests,
  workspace typecheck, and `git diff --check`.
- [x] Implement and accept Milestone 3. Founder post-exam autonomy and explicit
  override behavior (Milestone 3a) passed Terra's corrected pass and Sol's
  independent 24-test rerun. Chart-close/testing disposition (Milestone 3b)
  now releases and reacquires Examination Rooms correctly, preserves frozen
  testing routes, handles unfinished and terminal chart states, and protects
  manual founder commands. Sol returned the first M3b pass for reopen and stale
  movement-reservation gaps, then independently accepted the correction with
  3 game-domain files / 35 tests, 1 player file / 4 tests, workspace typecheck,
  and `git diff --check` passing.
- [x] Complete integration validation and update the handoff.
  Automated integration fixture reconciliation and the fresh-campaign starter
  Examination correction are accepted. The actual pre-fix Chromium walkthrough
  reproduced the no-exam deadlock; the corrected new-campaign state now has a
  connected starter room/door, retains normal upkeep, and leaves old v6/v7
  saves room-for-room unchanged. Sol independently accepted the final exact-
  origin desktop proof (2 Playwright scenarios), natively inspected the chart-
  route screenshot, passed the seven-workspace production build/typecheck,
  passed all 150 unit-test files / 998 tests, and passed `git diff --check`.

## Discoveries

- The existing simulation already provides deterministic persisted paths and
  Examination Room reservations; the missing work is operational gating,
  semantic endpoints, and coordinated actors rather than a new pathfinder.
- Current chart availability is already immediate after automatic check-in.
  The existing five-minute policy controls only the Alerts & Events reminder.
- Front Desk and Examination art have presentation locations that do not map
  cleanly to the current generic navigation anchors. Semantic anchors are
  necessary to make gameplay and seated sprites agree.
- The authored patient bitmap manifest contains an exam-table pose asset, but
  `CharacterPose` currently exposes only a generic seated pose; Milestone 2
  must connect that existing asset without disturbing the concurrent graphics
  work.
- Facility-condition alert targets already support staff-role actions, while
  ordinary patient events default to `Open chart`. The unstaffed check-in alert
  therefore needs an explicit non-chart target/projection.
- The visible Front Desk visitor chair is the southeast `visitorChair` fixture,
  while the current gameplay/presentation metadata still declares two waiting
  anchors. Milestone 2 must align one semantic visitor-seat anchor to the actual
  fixture instead of preserving the obsolete two-place fallback.
- The existing `patients-exam-table` atlas is a side-facing seated-on-surface
  presentation rather than a lying-down pose. It can satisfy the requested
  patient-on-bed state without generating new art, provided the renderer uses
  the semantic Examination bed anchor and correct registration.
- The concurrent wall-corner milestone has completed its implementation and
  live proof pass; its dirty `FacilityScene.ts` hunks remain owner work and must
  be preserved during the narrow Milestone-2 pose integration.
- A real Waiting Room is four by three. In the connected acceptance layout,
  three authored chairs are usable after door thresholds, followed by five
  legal standing tiles before public hallway wandering. Tests must exhaust all
  five standing endpoints rather than skipping directly to the public tier.
- Opening a chart while the patient is walking to a waiting place now redirects
  from the patient's current persisted tile immediately. Completing the stale
  waiting route first contradicted the requested chart-open behavior.
- Automatic founder idling may use unoccupied endpoints in Waiting and other
  public rooms, but never configured staff anchors or endpoints reserved by a
  patient/employee. Only reserved Examination Rooms are excluded wholesale.
- Chart close and testing acknowledgement share room/founder-release concerns,
  but a pending-testing route is already a frozen service journey and must be
  preserved exactly rather than sent through generic waiting disposition.
- Reopening an unfinished or unacknowledged-terminal chart is a new examination
  attendance event whenever the prior close released its room. The patient is
  redirected from the current tile and the founder is assigned to the same
  room; an onsite result that already owns an exam only needs its founder escort
  restored.
- A pending-testing patient may finish an already-frozen approach path, but its
  movement destination must stop advertising an Examination Room reservation
  as soon as acknowledgement releases that room.
- The actual fresh-campaign Chromium walkthrough exposed a bootstrap conflict:
  the first chart becomes visible after staffed check-in but cannot open because
  a new clinic contains only the Front Desk. Test-only Examination Rooms had
  hidden this product bug. A new campaign must therefore include one connected
  starter Examination Room. The later construction tutorial will teach adding
  a second Examination Room for capacity; existing saves are not silently
  rewritten with new rooms.
- While a patient is walking from a waiting destination to care, the persisted
  `assignedRoomInstanceId` can still describe the place being left. The active
  Examination reservation is represented by
  `patientMovement.destinationRoomInstanceId` until arrival. The browser proof
  therefore asserts the destination room and semantic bed/stool path endpoints
  instead of treating the prior-room assignment as current care occupancy.

## Exact next action

The bounded task is complete. Preserve the accepted source, tests, plan, and
proof image; continue owner playtesting through `START_GAME.cmd` at exactly
`http://127.0.0.1:4173`. No commit, push, deployment, or Pages release is part
of this task. At this substantial validated checkpoint, ask the owner to say
`push to GitHub` when they want the local work backed up.
