# GS-025 character layering and pathing

## Goal and authorization

September 24, 2026: owner selected five work items while GS-026 integrates new
stills: service waiting, radiology staffing, post-service Front Desk returns,
disappearing departure investigation, and unreachable trash investigation.
Implement the first three with focused regressions; establish current causes and
safe next actions for the last two, correcting bounded flow defects if justified.
No blanket renderer, room geometry, or art rewrite is authorized.

## Requirements and constraints

- Wait using the established waiting hierarchy while an onsite service's required
  room/equipment/staff is busy; begin travel only with available resources.
- Radiology-room procedures use the appropriate imaging tech and patient, leaving
  the founder free. This is simulation staffing behavior, not clinical guidance.
- If another encounter decision remains after onsite work, return the patient to
  Front Desk, reveal the existing chart's decision alert on arrival, then wait
  according to the established hierarchy. Preserve external-result delays.
- Investigate people disappearing when leaving Ultrasound/procedure rooms and
  trash unreachable in the northwest normal-orientation Waiting Room. Distinguish
  exposed floor from solid furniture; never fake passage through solids.
- Preserve approved rooms, Recovery migration, saved/frozen encounters, clinical
  IDs/prose, service durations/prices, staff reservations and existing routines.
- Deferred: visual layering, seated facing/contact/proportions, general chair
  click-to-sit and Front Desk hover/click-target changes until stills integration.
- No installs, push, merge, deployment, source-art edits or owner-save operations.
  Owner pathway remains START_GAME.cmd -> http://127.0.0.1:4173 in usual profile.

## Repository state and concurrent ownership

Read AGENTS, current handoff, project board, GS-015 handoff, approved-room runtime
plan and GS-025 brief. Shared beta at c26c96a has extensive pre-existing dirty and
untracked files. GS-015 accepted integrated checkpoint is 41923ff on
codex/gs015-approved-rooms; do not replace shared state with older beta contents.
Latest CT work permits onsite CT and up to three shared imaging techs; existing
busy-resource fallback currently remains offsite. GS-023 procedure routing already
has onsite workflows and departure corrections. Preserve these changes.
GS-026 domain/catalog milestone is complete per its plan; renderer/UI milestone
is active. No native task messaging tool is available. GS-025 initially confines
investigation to domain flow; renderer/session writes require explicit ownership
review before assignment. Capture task-relative baselines before any edits.

## Milestones and ownership

1. Terra flow_investigation: read-only current flow, resource, departure and trash
   diagnosis; return source seams, reproducible evidence and bounded milestones.
2. Sequential implementation worker: service queues and radiology staffing with
   meaningful regressions. Exact files assigned after milestone 1.
3. Sequential implementation worker: Front Desk return and chart alert lifecycle,
   preserving pending external results and existing chart identities.
4. Investigate departures and unreachable trash, implement safe bounded fixes
   when justified, or record exact renderer/geometry follow-up for after GS-026.
5. Parent actual-diff review, independent affected tests/types, isolated visual
   validation where applicable, scoped/current handoff and owner acceptance.

Workers share files, preserve unrelated changes, do not spawn, edit durable
planning, install, commit, push, deploy or send external messages. Parent owns
product decisions, plan, review and integration. Normally one implementation writer.

## Acceptance and validation

Use synthetic cases/current approved layouts, recording room/rotation/role/pose,
expected and observed behavior and test origin. Verify busy room and busy tech
separately, resource reservations, interruption/reload, founder availability,
patient attendance, post-service return and alert ordering without duplicate
charts/results. Inspect exit lifecycle and current Waiting Room northwest floor.
Run package-defined affected domain/player tests and typechecks through installed
direct CLIs if npm is unavailable. Add focused regressions for changed behavior.
Do not replace owner output/server/profile; isolated builds/browser storage only.
Numeric routes cannot alone prove visual layering or rendered departures.

## Progress, discoveries and next action

- Intake complete; five-item batch authorized. Terra flow_investigation spawned.
- Parent read latest GS-026/CT plans: renderer/UI currently owned by GS-026;
  shared imaging caps/onsite CT already implemented and validated locally.
- Next: inspect investigation evidence, decide minimal state transitions and
  assign exact domain files with baseline snapshots before implementation.

### Milestone 2 assignment

Terra traced selector busy-resource fallback and immediate timing freezing.
Existing chooseWaitingDestination supplies the established hierarchy. Parent
baseline passed 42/42 service/ultrasound/waiting tests using direct Vitest from
packages/game-domain (no local Vitest config exists). Baselines captured at
.local-dev/gs025-baseline/packages/{game-domain,balance-config} before edits.

Sol service_queue owns packages/game-domain/src/{selectors,reducer,types,
persistence,patient-travel,staff}.ts as needed, new queue helper if warranted,
direct domain regression tests, and narrowly necessary existing radiology
service/operation staffing declarations in packages/balance-config/src/.
service-operations.ts is also in scope for terminal procedure queue integration.
No player, character-catalog/appearance, room geometry, clinical source or art
writes. Terra continues departure/trash investigation read-only in parallel.

Decisions: only new orders opt into resource queues. Temporarily busy but
installed/reachable onsite resources queue ahead of offsite fallback; missing or
inaccessible capability retains fallback. Preserve legacy frozen routes/timing.
Queued orders reserve no unavailable resources and cannot deliver results while
waiting. Retry deterministically, freeze concrete paths/assignments/timing only
at service dispatch, honor actual patient/tech arrival, and keep original work
duration. Do not rewrite completed or already-active orders. Radiology procedures
must use imaging staff rather than founder/provider; audit all current radiology
routes and operations and change only relevant runtime staffing requirements.
No broad clinical service inference from names. Validate cancellation/reload,
concurrent queue fairness and no double booking.

Parent full pre-change domain baseline: 568/568, 48 files, maxWorkers=2; log
.local-dev/gs025-baseline/domain-tests.log. Terra source review found departures
already traverse an exit path; exact visual disappearance remains unproven.
Trash spawning lacks per-target founder reachability checks; Terra is executing
a synthetic Waiting Room probe before claiming the owner's exact defect.

Terra executed normal Waiting Room probe: local (0,0) admitted as litter floor,
path length zero; eight other candidate tiles reachable. North-west pocket is
bounded by bench/chair. Parent inspected probe and source. Targeted departure
tests pass 44/44; visual report remains unproven. Trash follow-up will prevent
unreachable spawns and safely relocate existing trapped litter to reachable floor
without deleting its identity or changing approved furniture/geometry.

Narrow separate-file writer exception: Terra flow_investigation may prepare only
tests/e2e/gs025-patient-flow.spec.ts and .local-dev/gs025-browser evidence/config.
Sol retains exclusive production/domain-test writes. Browser run waits until
runtime freeze; private origin 4197/fresh test profile, never owner4173 or GS0264199.
Existing approved-procedure-routing.spec.ts may later need expectation updates
for founder-free Ultrasound; assign after current worker finishes.

### Post-service return design constraints

Report-in at Front Desk is a physical arrival, not a second staffed check-in;
waiting on a founder/secretary would create an unrequested service bottleneck.
Both report-in and result availability gate further decisions. Onsite collection
may finish before external pathology/send-out processing; preserve that delay.
Return to Desk after onsite work then use ordinary waiting movement. Frozen
travel selectors must stop overriding ordinary actor position after report-in;
result delivery must not teleport a waiting patient back to the old return end.
Opt new orders into this behavior, retaining existing frozen journeys/saves.
If blocked, preserve pending state and retry safely instead of teleporting or
showing actionable chart while still in the service room. No duplicate chart,
check-in fee, result, or clinical history. Existing offsite report-in is preserved.

Parent actual-diff review returned atomic failed-dispatch handling, no offsite/
income processing while queued, terminal waiting reservation/movement guards and
legacy timeout preservation to Sol. Initial worker focused55 and domain types
pass; expanded regressions are pending. Parent projection review found direct
step ETA and pendingPatientIsAway would mislabel queues. GS026 production UI is
accepted per its plan, with browser-only work remaining; Sol may make narrowly
queue-aware chart expressions in apps/player/src/session/viewModels.ts and a
direct session regression, capturing current GS026-integrated baseline first.
No renderer/art ownership is transferred.

Milestone 2 reviewed: parent inspected final queue/reducer/persistence/staffing/
projection/test diffs and independently passed 46 affected tests. Sol full domain
571/48, balance28, player projection6 and all three affected typechecks PASS.
Parent accepted core milestone; final integrated full tests remain after M3/M4.
Known scope: phlebotomy reserves role capacity, without adding a new generic
employee animation/travel model. Imaging uses concrete technician assignment.
Terra departure browser run authorized on isolated4197, separate cache/output/
fresh profile; current production is frozen for this run. Next Sol M3 design
may proceed read-only, implementation after browser run ends. Follow-up review
requests terminal waiting-seat release on dispatch and exact queue reload metadata.

Parent independently passed queue UI6 and domain typecheck. Baseline capture
omission: surgeryCenterServicePreviews.test.ts was not captured before Sol's
small queue-projection block (viewModels.ts was captured). Parent reviewed the
identified block and current full test; no retrospective baseline is fabricated.
M3 read-only design: add opt-in new onsite result report-in state and ordinary
returning_from_onsite_service movement; gate delivery by result time and desk
arrival. Apply to immediate and queued new onsite orders, including bedside
service completion where a decision remains. For phased services, return at
onsite resource work completion, preserving later external result processing.
Target the Front Desk primary/check-in anchor, not an arbitrary doorway.

### Milestone 3 implementation assignment

First departure browser attempt did not create either terminal service operation
(undefined status before in_service); this is not departure evidence. Terra
diagnoses fixture/receipt state test-only, no further acceptance runs until final
freeze. Resume production work rather than block all milestones on that fixture.
Sol service_queue owns M3 in the same domain source/test files, optional
patient-travel.ts, and narrow queue/return chart projection/test expressions.
Implement new onsite report-in for all new onsite pending services, queue or
immediate, not merely new orders that happened to wait. Normalize new movement
and return metadata on reload, preserve old markerless journeys/results, and
verify no early chart action, duplicate results, stale position or seat leaks.
Parent remains reviewer; no renderer, clinical or room geometry changes.

Browser investigation escalated to Sol browser_flow_proof, with exclusive E2E/
private-artifact ownership transferred from Terra. Terra's "US not mapped"
diagnosis was incorrect: finalProcedureIncomeLineId explicitly includes the exact
lactational aspiration case/node/choice and current domain regression passes.
Parent read that mapping/test; do not treat missing serviceRequest as missing
terminal procedure mapping. Sol will inspect actual browser receipts/frozen
question and replay, avoiding repeated blind timed polls. Production remains
owned solely by service_queue; final visual acceptance after its freeze.

Sol browser_flow_proof identified terminal US operation rejection with an imaging
tech outside its home room. Parent inspected installedAndOperational/tryReserve:
they use static isEmployeeOperational, while pending clinical routes explicitly
support mobile imaging staff. This is a real selected-scope staffing gap, not an
invalid fixture; production Sol will narrowly support operational assigned
imaging staff with real destination path checks and a busy/away-tech regression.
Other staff rules remain unchanged. Minor departure poll may be missing a short
movement window; tighter state/frame capture remains required before conclusion.

Parent reviewed M3 actual delta against .local-dev/gs025-m2-accepted: new onsite
return marker, physical desk movement, result/arrival gate, stale-travel selector
release, exact queued duration reload, mobile-tech admission and waiting-seat
release. Worker focused137 and domain types pass; full suite in progress.
Departure harness correction: persisted state updates every15 ticks and missed
short exit walks. Sol now observes live Phaser state each animation frame and
pauses through the visible game control; no disappearance conclusion yet.

Terra's additional direct reducer probe confirms existing NW Waiting Room litter
COLLECT_LITTER is rejected as unreachable and leaves founder/item unchanged.
M4 will filter new spawn candidates by real founder reachability and relocate
existing trapped items deterministically to nearest safe same-room floor, then
other reachable room only if necessary. Preserve identity/count/spawn time and
active cleanup targets; retain item if no safe location. No geometry changes.
Production ownership transfers to Terra only after Sol releases M3; Sol browser
worker remains confined to E2E/private artifacts and awaits final runtime freeze.

M3 Sol handback accepted: full domain575/48 and focused137, final focused44,
domain types PASS. Parent inspected final retail preemption in dispatch trial
(committed only on success), next-care stale-position regression, markerless
legacy preservation, blocked-return/reload and both arrival/result timing orders.
Parent independently passed player490/81, balance28/2, player types and
boundaries/launcher. M4 production ownership now transferred to Terra
flow_investigation (reducer plus focused facility tests), with pre-edit snapshot
required at .local-dev/gs025-m3-accepted. No other production writer remains.

M4 accepted after parent actual reducer diff and regression review. Terra added
four litter cases covering80 spawn seeds, direct legacy click through actual
cleanup completion, next-tick repair, fallback/reload, active-target preservation
and no-safe-destination rejection. Worker focused25/2 and domain types PASS.
Production frozen for Sol browser proof. Parent independently passed final domain
579/49, domain types and isolated production build at .local-dev/gs025-build
(usual large-chunk warning only). Player490/81 and balance28/2 already passed;
no player/balance implementation changed subsequently. Browser proof pending.

Final browser harness corrections: first start used repository cwd and returned
404; rerun uses apps/player cwd. Parent then found a synchronous synthetic replay
loop attempting ADVANCE_TICK on paused state, which never progressed. Sol must
clone/unpause the synthetic state and fail fast on no progress before rerunning.
Neither harness failure is evidence of a gameplay path defect. Compatibility
screenshots are redirected to private evidence rather than overwriting GS-023.

### Departure finding and bounded correction

Final3 browser evidence separates harness and runtime: postservice assertion used
raw location rather than frozen-travel selector; US60-minute work exceeded a
45-second1x test wait. Both are test corrections. Minor departure live trace
shows loaded patient sprite and interior path, then path ending at(35,32), its
only exterior point. service-operations.pathToExit ends immediately outside the
door; completion removes the actor on reaching it. Unlike generic resolved
patients, terminal procedure patients never traverse the offscreen sidewalk.
Earlier broad "full exit path" investigation did not cover this distinction.

Root assigns Sol service_queue M5: connect terminal encounter completion and
cancellation to existing reducer pathFromLocationToOffscreen policy, avoiding
duplicated route logic. Preserve in-flight saves and external visitors. Empty
exit paths must retain patients and retry, not erase them at the service room.
Own only reducer/service-operations and focused domain tests; capture current
M4 source before edits. Browser worker corrects test helpers and retains strong
exterior assertions; final departure acceptance waits for new production freeze.

M5 Sol complete; parent reviewed actual delta against .local-dev/gs025-m4-accepted.
Reducer supplies common offscreen route with start-point continuity guard. Active
encounter operation status leaving retains the actor while blocked and retries;
resources are released, timestamps preserved, visitors/remotes retain old behavior.
Tests cover minor/banding/US exterior intermediates and reload, plus actual removed
Minor Procedure door after completed work. Worker affected78, focused26 and domain
types PASS. Final source frozen for browser departures/compatibility and parent
full domain/type/build checks. Parent reviewed four postservice PNGs and accepted
the live postservice test1/1: US tech/patient, desk, waiting and chart action-ready.

## Final acceptance — first five-item batch

All authorized implementation milestones complete. Parent final full domain580/49,
player490/81, affected balance28/2, affected types, boundaries/launcher and isolated
build PASS (large-chunk warning only). Final M5 player types/build were repeated
after the departure correction. Browser7 PASS: postservice1, departures2,
compatibility4. Parent inspected actual code deltas and screenshots of desk/wait/
alert ordering and clearly visible minor/US patients on the exterior sidewalk.
No owner-save proof is claimed. The tests use synthetic fixtures, with documented
bounded reducer time advancement for postservice setup and live UI/frame checks.

Accepted logs: .local-dev/gs025-browser/logs/playwright-4197-postservice2.log,
playwright-4197-departures-final.log, playwright-4197-compatibility-final.log.
PNG evidence in departures/ and compatibility/ under .local-dev/gs025-browser.
Scoped handoff and GS-025 brief/board updated. Remaining owner notes stay deferred.
No implementation milestone was performed without a named worker; parent owned
planning, actual-diff/image review, independent validation and integration.
No commit, push, merge or publication. Ask owner to say "push to GitHub" for
separately audited checkpoint backup; preserve unrelated dirty shared work.
Browser worker stopped private PID37692 and verified4197 free. Owner4173 was
not listening at closeout and untouched. Current handoff records unchanged
START_GAME.cmd/origin/profile pathway. No native task-archive tool is available;
this bounded batch is complete and remaining notes await owner selection.
