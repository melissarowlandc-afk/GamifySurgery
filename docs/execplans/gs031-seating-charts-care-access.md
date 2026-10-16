# GS-031: seating, immediate charts, and active-care room access

Status: implementation complete and accepted locally on October 3, 2026. Final
game-domain 1685/1685 and player 558/558 tests pass after the phase-target fix;
browser seating 10/10 and care 5/5 pass. Browser cleanup and the current handoff
are complete. No commit, push, release, or deployment is authorized.

## Goal and authority

Owner approved implementation on October 3, 2026: complete arbitrary-chair seating
and Front Desk hover guidance; open actionable Waiting/Existing charts immediately
while the founder walks concurrently; make staffed endoscopy/intraoperative question
visits consultations; restrict patient rooms to active assigned care and promptly
route completed patients out. Previous floor-reachability and legal-door-discovery
items are explicitly removed because the owner says they are no longer issues.

## Requirements and decisions

- Clicking an eligible empty/unreserved ordinary chair walks and seats the founder
  facing its authored direction. Protect staff/patient reservations and solid fixtures.
  A deliberate sit holds until a newer command or necessary patient work supersedes it;
  pre-secretary automatic desk return must not immediately undo it.
- Add "Sit here to check in patients" to the existing Front Desk/desk-chair interaction
  before secretary hire. Preserve completed click/automatic-return behavior.
- Actionable patient and employee chart clicks open the complete available question
  immediately, independent of travel, and concurrently initiate the appropriate route.
  Preserve question prerequisites and pending results; never disclose future questions.
- Assigned endoscopist/surgeon retains performance responsibility. Founder questions
  are consults when that clinician is available. Answering releases the consult and
  permits prior activity to resume without waiting for arrival or duplicate rewards.
- Exam/procedure/endoscopy/OR rooms admit only the active assigned patient and relevant
  providers, one patient at a time, including physical clearance before replacement.
  No unrelated waiting, wandering, or transit shortcuts through these rooms. Finished
  patients promptly follow the appropriate exit/recovery route. Preserve the existing
  multi-bed prep/recovery model and required clinical workflow.
- Existing save compatibility, interrupted routes, staff/room loss, and reload behavior
  matter. No clinical text, exact clinical timings, income, or progression redesign.

## Repository state and constraints

AGENTS.md and current handoff reread; heavily dirty shared tree inspected October 3.
Many relevant files already contain accepted changes from other tasks. Preserve them
and capture task-relative source baselines before implementation. No broad replacement,
reset, staging, commit, push, deployment, dependency installation, or owner-save edits.
Approved art and GS015 future Level 3 proof work are outside this scope. Existing
canonical local playtest remains START_GAME.cmd -> http://127.0.0.1:4173 in the usual
profile. Private Tailscale/4174 remains separate storage. Isolated browser validation
must use a disposable context and another free port; never attach to owner saves.

## Milestones and ownership

1. Sol `gs031_care_flow_diagnosis`: read-only architecture/defect investigation for
   chart gating, consultations, exclusive room routing, and endoscopy clearance.
   Parent chooses architecture and reviews source evidence.
2. One named worker: bounded chair and Front Desk implementation, domain/player
   projection, meaningful focused tests. Exact ownership assigned before edits.
3. One named worker: immediate chart/consult lifecycle implementation and regressions.
4. One named worker: active-care access/clearance implementation and regressions.
   Milestones 3/4 may be combined only where source investigation shows inseparable
   state-machine invariants. No worker may spawn agents or change durable planning.
5. Worker isolated browser proofs; parent actual-diff review, integrated relevant
   tests/types/build/boundary checks, screenshot review, and handoff.

## Acceptance and validation

Prove ordinary chair selection, authored facing after arrival, reservations, cancellation,
patient priority, manual-sit/auto-return boundary and reload. Confirm exact Front Desk
hint and existing desk/chair click behavior. Prove immediate employee, ordinary patient,
endoscopy, and supported intraop question display before founder arrival, answering
before arrival, consult release/resumption, assigned clinician continuity, single rewards,
and reload. Prove unrelated actors cannot enter/cut through protected rooms, next patient
waits for prior physical clearance, and finished endoscopy patients leave rather than
loiter. Preserve genuine treatment/recovery progress and historical saves.

Use scoped Vitest tests in @gamify-surgery/game-domain and @gamify-surgery/player;
broaden to affected domain/player suites after integration. Run workspace typechecks,
test:boundaries (includes launcher contract), isolated Vite build, and browser proofs
using GAMIFY_E2E_EXTERNAL_SERVER=1 and a verified disposable base URL/port.

## Progress, discoveries, and next action

- Opening read-only Terra review on September 30 established no generic seating command,
  existing desk/chair hit coverage, and absent requested hover text. Parent reviewed
  source. No changes made before owner approval.
- October 3: owner approved expanded scope. Sol diagnosis delegated; parent planning.
- Next: capture source baselines, delegate seating milestone, then incorporate Sol's
  care-flow findings and implement sequentially with one write-capable worker at a time.

### October 3 architecture review

Terra `facility_interaction_review` owns M2 and captured task-relative before copies
in `.local-dev/gs031/before-seating/`. Sol completed read-only M1. Parent reviewed
employee lifecycle gates, chart-open rejection branches and facility route entry.

Confirmed causes: employee questions are explicitly hidden by `active_traveling`;
patient chart opening rejects its cloned open state if physical attendance cannot
start; overflow waiting searches every room's waiting anchors, including clinical
rooms. Exam release also needs physical exit protection analogous to existing service
transition holds. Assigned department staff remain allowed, unrelated actors do not.

Architecture accepted: question visibility and best-effort physical attendance are
separate. Preserve genuine question/result/check-in prerequisites. Retry attendance
when temporarily unavailable without withholding a ready question. Answer submission
releases consult travel even before arrival. Preserve staffed procedure provider
reservations. Store only a sanitized optional benign prior founder command for resume,
recomputing the route on restoration. Old saves default safely. No stale path restore.

M3/M4 assigned next to Sol sequentially once Terra's source freezes; no simultaneous
shared-file writers. Existing active runtime supports Endoscopy. Ambulatory OR exists
in future service catalog/proof design but is not an active buildable room (levels0-2);
make compatible generic handling without claiming a live OR proof or adding Level3.

Validation environment discovery: Node exists in bundled runtime; npm not on PATH.
Vitest/TypeScript directories currently under `node_modules/.ignored/`; use direct
existing tool entries if viable. Do not install or alter dependencies speculatively.

### M2 source reviewed; M3 underway

Terra implemented explicit Waiting Room chair clicks and Front Desk hover. Current
runtime has no mapped founder-office seat; clinical/staff chairs remain excluded.
Parent reviewed task-relative diffs and caught/fixed through worker a drag-handler
dispatch mistake, missing AppShell callback, and incomplete visible occupancy checks.
Parent independently passed founder movement16 and player interaction/presentation27.
Terra both types passed; parent independently passed domain types. Parent restored
three missing ignored dependency junctions (vitest, typescript, @types/node) to existing
local packages; no downloads, package/lockfile edits or versions changed.

Sol now owns M3 runtime sources plus focused tests, with baseline in
`.local-dev/gs031/before-charts/`. Parent requested filtering stale completed retail/
service history from chair occupancy while retaining real outgoing actors.
Terra M5a owns ONLY new seating e2e and isolated local browser artifacts; no runtime
edits. This explicit limited parallelism has disjoint files: Sol domain/player,
Terra browser proof. Any browser defect must return to parent for runtime ownership.
Outstanding M2 evidence: painted-chair click alignment and full patient takeover/resume
are covered by the browser milestone and Sol M3, respectively.

Browser discovery: painted Front Desk chair center misses the older hit envelope.
Parent inspected actual hover screenshot and expanded Terra's disjoint ownership to
ONLY FacilityScene.ts and frontDeskSeatInteraction.test.ts for real rendered-fixture
hit alignment (plus own e2e files). Sol explicitly excludes those two files. Use current
approved draw/support geometry, no artwork changes. Scanning to find a passing point
does not satisfy click acceptance. Waiting-chair visible targets require the same check.
Parent additionally restored the absent @playwright/test junction to its existing
ignored local package to run browser tests; no install/download occurred.

Terra seating browser4/4 passed for desktop+compact chair-center hover, bench click,
nonempty route, seated facing and drag. Parent inspected seated screenshot. Initial
route failure was overlapping disposable fixture; corrected without relaxing doors.
Vite port0 defaults to5173 here; use node:net to choose a free explicit numeric port.
Occupied/side-chair/rotation/desk-center acceptance remained unfinished. Sol
`gs031_browser_acceptance` now owns Scene/frontDeskSeatInteraction and GS031 e2e/local
browser artifacts to finish those checks; Terra is no longer a writer. Domain Sol
explicitly excludes Scene. This remains disjoint runtime ownership.

M3 review found retry could reattach after answering/new manual commands and retained
employee discussions could block row switches. Domain Sol is fixing these with an
optional persisted pending-consult intent tied to its unanswered node, cancelled on
answer/close/new accepted command, while preserving frozen discussion progress.
Resume must verify the saved chair still exists and is eligible before routing back.

M3 parent independently passed42 focused domain tests (employee discussions, core
game-domain, founder movement, Endoscopy) and player types after reviewing actual
changes. Sol may proceed M4 after final precise Endoscopy endpoint assertion/types,
capturing `.local-dev/gs031/before-access/` first. M4 covers all active diagnostic and
treatment patient rooms, not just the owner's examples; Periop retains bed-specific
capacity and assigned department staff remain permitted. Structural build connectivity
and door legality are unchanged. Existing/in-flight inappropriate routes need safe
egress/replanning; no teleport, source changes, or save reset.

Broader parent regression run after M3: domain1319pass/10fail, player552pass/6fail.
Four domain assertions expect superseded travel-gated opening/continued attendance
after answer; six long domain lifecycle tests timed out under full concurrent load.
All six player failures are raw serialized-content/migration equality in
localCampaignRepository, likely new optional consult nulls materialized on load.
Sol owns correction preserving canonical/legacy absent fields; do not weaken repository
integrity tests or indiscriminately raise timeouts. Re-run focused failures then broader
integrated suites with bounded concurrency after M4. Full acceptance remains pending.

Sol browser M5a complete: Scene now unions actual approved desk/chair image bounds
and maps visible Waiting fixtures through authored supports to domain anchors.
Focused Scene11, player types and browser10/10 pass across desktop+compact, both
rotations/allfour seats, desk/chair centers, occupied employee protection and drag.
Parent reviewed actual mapping diff and desktop rotated-seated/desk-hover images.
Evidence `.local-dev/gs031/browser-seating/`, owned port59538 release confirmed by
server-closed.json. Sol browser now prepares care-flow proof; final clearance follows
M4 source freeze. No owner origin/profile/save touched.

M3 save correction verified: parent independently passed localCampaignRepository27;
Sol passed employee-discussions7 including byte-identical active consult plus suspended
explicit-chair save roundtrip. Missing legacy optional keys stay absent and existing
active_traveling lifecycle is preserved on load. Two before-charts files
(employee-discussions.ts, level-two-endoscopy.test.ts) were reconstructed by reversing
only Sol's known M3 edits while preserving prior dirty changes; all other baseline
copies were captured before editing. Do not describe those two as original byte captures.

M4 is still in integration, not accepted: restrictive routing exposed legitimate
care-workflow authorizations requiring repair. Parent requested explicit old-route
egress, same-room loiter prevention, and frozen-travel physical-clearance regressions.
M5b care browser proofs are developing; final browser replay follows source freeze.

M5b employee browser proof now passes early open/answer, explicit-chair resumption,
next-tick no reattachment, and reload without duplicate answer. Real Waiting-row
topology exposed an M4 integration failure to route into a free exam room; domain
and browser Sol workers are coordinating its correction. Real staffed Endoscopy
also clears its completed-operation provider reservation before the result question;
proof must establish actual named provider execution and consult-only founder role,
not inject a fake lingering busy reservation. These remain unaccepted until resolved.
Terra performed a second read-only M3 review; parent rejected and Terra retracted a
false-positive employee row-switch finding after confirming both domain and session
close guards. Parent boundaries2508 and launcher protocol1 pass.

Stronger M5a seat-egress proof supersedes the earlier10/10 acceptance: after actual
visible arrival at the first painted bench, the Front Desk command is rejected for
no route. Latest replay6pass/4fail in both orientations and viewports, port58586
released. Domain Sol isolated disconnected authored endpoint/support components;
repair must preserve wall/furniture collision and enable actual seat exit, then rerun
all seating checks. M4 source and full integrated acceptance remain unfinished.

M5b latest care browser5/5 passes: Waiting/Existing switch; employee early answer,
resume and reload; real staffed Endoscopy consult/early answer/reload; unanswered
consult reaches the suite after advancing; two real Endoscopy encounters enforce
outgoing physical clearance before next acquisition and repair an old founder
loiter route. Port62229 released. Parent inspected screenshots but requested better
camera framing because relevant suite areas are clipped/behind the pause overlay.
Production completion now stores non-busy room/provider provenance; parent reviewed
actual diff and requested exact serialized roundtrip plus frozen-location occupancy
coverage. Sol continues final private staff/service paths and focused regressions.

Terra read-only M4 diagnosis ran the two procedure/timing files once:58pass/11fail,
log `.local-dev/gs031/validation/terra-m4-diagnosis.log`. Likely mixture of historical
chained-care fixtures, physical-arrival timing defects and changed assignment lifetime;
these classifications require concrete correction/verification, not blanket assertion
updates. All requested acceptance remains open until integrated tests pass.

Parent integrated diagnostic results: player558/558 across89files passes with
maxWorkers2; six unaffected workspace typechecks (balance, content, authoring,
research, workbench client/server) pass. Full domain at current partial M4 snapshot
passes1321/fails12 across64files in81seconds; no timeouts. Log
`.local-dev/gs031/validation/domain-integrated.log`. Four failing files: procedure4,
timing3, ultrasound-first-imaging4, room-capacity-sales1. Sol owns fixes; Terra
read-only diagnoses the new imaging/room-sale cases. Not a final source-freeze run.
Rotated seating egress failure was an invalid disposable fixture gap after room
width rotation, not permission to loosen structural routing. Browser worker repairs
fixture connectivity and preserves strict all-seat exit checks.

Latest owned browser acceptance green again with stronger coverage: seating10/10
(both viewports, both orientations, all four seats including exit to Front Desk),
care5/5; owned player unit11 and player types pass. Ports55115/50453 released.
Parent inspected visible bench/side-chair egress and reframed Endoscopy consult /
clearance screenshots; actor support/aisle and suite locations are readable.
Pause overlay is hidden in evidence captures only for inspection. Final browser
replay still required after domain source freeze. No live OR claim: buildable
runtime remains levels0-2 with Endoscopy; OR remains future-compatible handling.

Final M4 disjoint ownership split, explicitly confirmed by domain Sol: Terra now
owns only staff.ts and new staff-care-room-access.test.ts, with exact baseline
before-staff/. Sol retains reducer/service/patient/persistence and other tests;
browser Sol is standing by with owned files frozen. Terra implements staff home/
idle/private-room routes and safe legacy egress; service-specific hooks remain
Sol's responsibility. This limited parallelism is by file with no shared writers.
Earlier Terra imaging diagnoses were provisional: Sol verified actual missing
exam door/public hall in those fixtures and fixed topology without weakening
care anchors or timing. Phlebotomy/CT focused checks are now green per Sol.

Staff escalation: Terra twice handed back partial implementation without required
tests; source/typecheck work preserved, not accepted. Named Sol gs031_staff_access
now owns ONLY staff.ts and new staff-care-room-access.test.ts, preserving the
before-staff baseline. He completes safe legacy/stationary egress, assigned-work
authorization and tests. Main domain Sol retains all other files. Terra is no
longer a writer. Parent will review actual diff and meaningful validation.

Sol staff implementation passes82 focused staff/reception/imaging/service tests;
parent reviewed actual diff and new tests. Review found active-task fallback-home
routes can lose intended target and path exhaustion must not count as treatment
arrival. Agreed division: staff Sol reconstructs/retries direct-pending destinations
after safe egress; main Sol handles phase-aware service retry and verifies actual
resource target locations. Add temporary route-loss/restoration regression, preserving
clinical phase duration and rewards. Existing saved service/frozen-patient routes
also require protected-room reconciliation before movement, not just new routing.

Staff Sol completed owned milestone:83/83 focused tests and domain types pass;
parent reviewed final retry implementation. Main Sol reported provisional freeze
with146 focused integration,32 amenities/retail,30 M3 and27 save tests plus both
types green. Parent withdrew that freeze on review: frozen patientTravel repair
rebuilt paths from old origin without rebasing elapsed position/timing, and collapsed
unavailable routes to the origin. Must preserve current position/work and delivered
history, with mid-outbound/return/unavailable-route tests. Staff Sol is now read-only
reviewer of this repair; main Sol is sole source writer. Parent also flagged cached
visitor departure paths bypassing privacy and exam occupancy remaining assigned until
building departure instead of room clearance. Correct and prove same-actor release.
Browser final replay was interrupted after8 seating tests; no new acceptance claim,
no current Node-owned listeners remained. Prior completed15 browser proofs remain
historical evidence only until final frozen replay completes.

Final repair review remains blocking: staff Sol confirmed live-movement-only tests
were insufficient for clock-projected frozen travel. Root accepted bounded design:
reconcile undelivered frozen active leg from pre-advance projected position, retain
elapsed indexing with a hold prefix, shift only future clocks for detours, preserve
completed work/history, retain retry destination for unavailable paths, and require
actual safe return before due delivery. Main Sol implements; staff Sol independently
reviews actual branches/tests. Cached service departure with no legal continuation
must hold/retry instead of using its unsafe old route. Final browser replay stays held.

Parent second diagnostic full domain:1675pass/10fail across66files,89seconds,
maxWorkers2; domain-final-diagnostic.log. Frozen regression now5/5 per independent
staff Sol. It caught persistence replacing saved travel speed without rebasing
clocks; root approved preserving validated saved onsite/offsite itinerary speed.
Live movement/presentation now aligns to frozen projection only for its actual
active leg. Seven diagnostic failures share obsolete frozen-return interference
with newer onsiteReturn; guards preserve live return authority. Two tests expect
old unsafe speed overwrite and must assert saved speed/clocks/position instead.
One service visitor fixture lacks public exit connection; repair fixture topology,
never relax protected-room access or fake offscreen completion. Main Sol owns
remaining correction, reviewer read-only. Browser remains held; no final acceptance.

Runtime source freeze accepted after parent actual-diff review and independent
Sol staff review:139/139 across care access and five formerly failing suites.
Main Sol confirms only validation/reporting remains. Frozen itinerary regressions
cover real pending travel, saved speed/current position, consecutive tick alignment,
mid-service detours, restored physical return before delivery, protected legacy
return retarget, and unchanged delivered history. Tests preserve actual treatment
work and use legal public fixture paths. Patient-alert baseline captured pre-edit;
SHA B2AC1407863C0B17D3CC3DD297249634E2947D07AB9ED90ADC4518DC8E0E3BB5.
Parent final full domain/player now sequential; final browser follows to avoid
contention. Existing reconstructed M3 baseline caveat remains unchanged.

Parent frozen validation passed: domain1685/1685 (66files,76seconds), player558/558
(89files), all8 workspace typechecks, boundaries2508, launcherprotocol1, isolated
production build .local-dev/gs031/build-final. Scoped33path diff-check passed;
three whitespace findings in unrelated alertViewModels/global.css were preserved.
Final seating10/10 passed (port62861closed). Care4/5: first fixture lacked public
corner32,22; owner-specific access correctly rejected an Endoscopy shortcut.
Browser added that fixture-only corner, preserving strict clearance assertions.
It then exposed a real phase1→2 teleport: pre/postsave both at tick85 alreadyPeriop
40,25, path=[40,25], holdingEndoscopy. No save relocation. Source freeze reopened
only for main Sol bounded phase transition correction/regression; staff Sol reviews
read-only, browser owns only proof. Prior full validation must be refreshed after
runtime correction. No completion/backup/publication claim yet.

## Final acceptance — October 3, 2026

Completed all requested milestones; items 3/4 from the earlier discussion remain
out of scope. Root reviewed the exact final two-line phase-target correction:
retained Periop bed is an actor target only during a Periop phase. Real phase1
Endoscopy location, multi-point recovery path, physical clearance before next
admission, unchanged recovery duration and payment all have regression coverage.
Independent staff Sol accepted; main Sol implementation frozen.

Final parent reruns after correction: domain1685/1685 across66files (94s),
player558/558 across89files (14s); logs validation/domain-accepted.log and
player-accepted.log. All8 workspace types passed; affected domain/player types
repeated after final correction. Boundaries2508 and launcherprotocol1 passed.
Production build .local-dev/gs031/build-accepted passed (existing bundle-size
warning only). Main exact completed-Endoscopy roundtrip7/7 and repository27/27
passed; earlier balance41/41 remains valid (no balance changes).

Final browser seating10/10, port62861 released; care5/5, port62065 released.
Browser worker confirmed no owned listeners remain. Parent inspected actual images
and clearance state: patient held Endoscopy at tick88, physically outside bytick90,
next admitted only after clearance. The browser fixture now has legal corner32,22;
strict assertions remain. The final harmless proof-only edits improve wait budget
and camera framing; no runtime changes followed the accepted two-line correction.

Parent scoped33path diff-check passed. Preexisting whitespace in unrelated
alertViewModels/global.css was left alone. All baselines retain recorded provenance,
including two reconstructed M3 copies. Handoff prepended with complete status,
validation, owner opening pathway, limitations and local-only checkpoint notice.
No git commit/push/deploy, owner save mutation, clinical rewrite, or new task.
Next action belongs to owner playtesting or an explicit "push to GitHub" request.
