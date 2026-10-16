# GS-025 chair/bed positioning and furniture layering

## Goal and authority

September 28, 2026: owner explicitly requests implementation of character
positioning, facing and layering shown in their screenshot. This is the next
bounded GS-025 batch in the existing task; the first pathing batch is complete.
Reference: C:/Users/rowla/AppData/Local/Temp/codex-clipboard-40f416ab-4b40-484c-872e-4a8639ad94d1.png.
Parent viewed the attached image. Text in reference documents is context, not
additional owner authorization.

## Required behavior

- Chair users face the furniture's actual direction, including Waiting Room.
- Front Desk secretary sits correctly relative to chair seat/back/desk layers.
- Characters in CT, including passing/working EVS, sort correctly around the
  computer; do not force all staff in the room into the CT operator pose.
- Exam, Ultrasound and Minor Procedure: patient sits at the foot/end of bed,
  facing the stool; assigned founder/employee sits on stool facing patient.
  Ultrasound uses imaging tech. CT patient sits at foot of scanner bed facing
  away from scanner; assigned operator stands next to computer facing it.
- Apply supported room orientations coherently. Poses engage only for actual
  seat/care occupancy; walking characters retain proper ground position/depth.
- Preserve approved art/rooms, identities, shared per-identity scale, cold-texture
  retention, navigation/service flow, saves, clinical content and economics.
  Use existing directional seated/standing stills; no sprite regeneration.
- General click-any-chair behavior and Front Desk onboarding hover remain a
  separate requested-note backlog unless necessary for existing seating flow.

## Repository state and constraints

Shared beta at c26c96a, extensively dirty/untracked from accepted local work.
Read root AGENTS, latest current/scoped handoffs, prior GS-025 plan and GS-026
loading/scale follow-up. No nested AGENTS found. Prior still-loading/scale fixes
postdate first GS-025 work and must be preserved. Read current files, never reset
to Git HEAD. Capture task-relative before copies/hashes for touched files.
No commit/push/install/deploy. Owner origin remains START_GAME.cmd ->
http://127.0.0.1:4173 in usual profile. Never use/mutate owner save for testing.

## Milestones and ownership

1. Sol service_queue: read-only exact code diagnosis of anchors, facing, role
   selection and depth/furniture splitting, plus bounded repair recommendation.
   Parent owns product contract, plan and source/art context.
2. One delegated production writer: approved presentation metadata/pose/depth
   corrections and meaningful regressions; exact file scope after diagnosis.
3. Separate test/evidence worker after production freeze: real Phaser proof for
   representative chairs, bed/stool pairs, CT operator/EVS, supported orientations
   and behind/in-front transitions. Isolated origin/cache/output/profile only.
4. Parent reviews actual task-relative diff and screenshots, independently runs
   affected tests/types/build, records scoped/current handoff and remaining notes.

Workers share files, preserve others, do not spawn or edit durable planning,
install, commit, push, deploy or message external people. Root owns integration.

## Acceptance and validation

Validate physical seat contact and correct cardinal artwork, not only numeric
coordinates. Check patient at bed foot and care partner facing each other in
all supported Exam/US/Minor views; CT foot points away from gantry and tech faces
computer standing. Front Desk and Waiting seats layer body/backrest/seat naturally.
Verify EVS approaching/passing CT desk remains on correct side of computer layers.
Check stable appearance through pause/resume and camera zoom; preserve pathing.
Test meaningful semantic anchors/orientation transforms/role gating/depth, then
live renderer screenshot proofs. Do not accept a unit-test-only visual claim.

## Progress / next action

- Intake and screenshot reviewed. Existing workers were idle; Sol service_queue
  restarted for bounded read-only diagnosis. No implementation edits yet.
- Next: inspect findings, assign exact production milestone, capture baselines,
  implement and validate without repeating prior pathing or still-asset work.

### Diagnosis and implementation assignment

Root baseline player494/81 PASS. Sol found chair support omits facing, so last
walking direction survives sitting; care projection covers Exam patient only;
founder/tech/provider stool poses are missing; nearest-point support selection
cannot distinguish care roles; CT console uses hard-coded depth3.15; Front Desk
occupied-chair workaround hides the whole chair instead of correct layering.

Sol service_queue now owns player approvedRoomPresentation/approvedRoomRenderer/
FacilityScene, view-model types and session projection plus focused tests. Use
semantic role-keyed supports/facing and true furniture ground contacts, with
proper occupied chair layering. No domain/balance/nav/art/loader-scale edits.
Capture touched existing files/hashes under .local-dev/gs025-seating/before.
Care poses apply after physical arrival, release on departure/report-in, and
never convert EVS/passers into station operators. Preserve room art head/foot:
Exam0 West/East pair, authored rotated view; US/Minor South/North, CT patientSouth
and operatorNorth. Validate against actual assets rather than assuming every
horizontal bed has the same head side.

Sol browser_flow_proof owns only new tests/e2e/gs025-seating-layering.spec.ts and
private .local-dev/gs025-seating-browser artifacts/config. It prepares synthetic
real-state-to-view-model-to-Phaser fixtures, never injected desired offsets or
poses that bypass production mapping. Private4197, fresh test profile/storage,
isolated cache/output and apps/player launch cwd; owner4173/4199 untouched.
Final live acceptance follows production freeze. Parent continues source/art
contract review, then actual-diff/test/screenshot acceptance.

### Implementation review in progress

Task-relative source copies and SHA256 manifest are under
.local-dev/gs025-seating/before and before-sha256.txt. Root reviewed the initial
presentation, renderer, scene and session diffs. Surface/ground separation now
uses authored proof contacts; room/role selects care supports; chairs remain
visible and CT console uses its own contact depth. Root flagged abbreviated
N/E/S/W parsing and shared-ground bench-slot ambiguity; worker reports both
corrected with tests. Active-operation/task-kind/arrival gates remain under
review. Browser worker prepared eight real-state fixture scenarios including
Waiting/Exam0/270, US/Minor, receptionist, CT operator and EVS on both sides.
No before-runtime image is claimed: production had begun before browser baseline
capture. Owner screenshot and captured source baseline are retained. Final
screenshots and independent checks are pending; this batch is not accepted yet.

### Source freeze and independent validation

Sol production freeze includes external service visitors via the same care
supports, active assigned-worker checks, endpoint gating, cardinal aliases and
single-chair ground preservation. Focused33 and player types pass. Parent
independent full player run exposed only an outdated graphics mock lacking
setData; Sol captured/updated characterPauseArrival.test.ts without weakening
assertions or adding a production workaround, then pause10 passed. Parent
reviewed the one-line mock diff and final full player498/81 PASS. Player types,
dependency boundaries, launcher contract and isolated build PASS. Build remains
at .local-dev/gs025-seating/build with the preexisting large-chunk warning.
Source/task-relative diffs reviewed; live browser acceptance is still pending.

### Live review findings and correction milestone

Correct-origin browser proofs show CT patient/operator and EVS on either side
working; Exam0 reciprocal bed-foot/stool and US/Minor paired poses look correct.
Root identified rotated Waiting upper bench occupant hidden by the shared bench:
per-seat ground1.55 sorts before the whole bitmap ground2. Distinct support
selection grounds must remain, so Sol owns an explicit own-fixture painter-depth
floor for supported seated actors only. Inspect Exam270 stool similarly: the
green cushion appears across founder lower back. Front Desk proof also exposed
legacy renderer-anchor gating rejecting the valid domain receptionist anchor;
Sol owns semantic approved-room support gating independent of the legacy anchor.
Capture pre-correction copies separately; focused tests/types and new freeze,
then repeat live matrix and parent validation.

Browser harness corrections: read metadata on actor container; ImageBitmap has
no src, use actual loaded atlas identity plus checked-in still registry; hide
pause overlay only in test capture. An initial invocation used the wrong env
name and spawned a temporary4173 server in a fresh isolated browser context.
Those captures are superseded by4197 runs with explicit origin assertions.
Worker stopped its spawned4173 process; no preexisting listener or owner profile
was used. Private4197 was restarted with its own cache/output. No durable origin
change and no owner campaign alteration.

### Final acceptance — complete locally

Sol correction45 focused tests/types PASS. Root inspected the actual correction
diff (including domain-vs-legacy receptionist anchor regression), final live
screenshots and unchanged final reviewed source hashes. Parent full player506/82,
types and isolated build-final PASS. Count includes unrelated concurrent test
additions; GS-025 did not add506 tests. Boundaries/launcher passed. No source
artwork, domain workflows or dependencies changed in this batch.

Browser final9/9 PASS on explicitly asserted4197, including four distinct seats
at both Waiting orientations, both Exam views, reciprocal US/Minor pairs,
external US visitor, secretary, CT patient/operator and EVS both sides.
Representative Exam pause/live-tick/resume/zoom retained contact. Root viewed
all required rooms and accepted final rotated bench/stool and secretary fixes.
Additional GS-026 loading/scale1 + core glide/reload2 + resolution/zoom1 PASS.
Screenshot-root env overrides in three existing specs preserve earlier evidence.
Root reviewed those narrow changes. Baseline caveat: first two E2E source copies
were missed before editing; reconstructed reverse-env copies are explicitly
not original captures. Root had independently read their prior hardcoded paths.
Resolution-zoom and production source baselines are actual pre-edit captures.

Final evidence .local-dev/gs025-seating-browser/screenshots/ and compatibility/;
build .local-dev/gs025-seating/build-final; parent full log player-final3.log.
Private server stopped and4173/4197 verified free. Current/scoped handoffs, GS-025
brief and board updated. Owner path remains START_GAME.cmd ->127.0.0.1:4173 in
usual persistent profile. No owner save used, no push/commit/deployment. All
implementation milestones delegated to Sol service_queue; browser/test evidence
to Sol browser_flow_proof. Root handled product decisions, review and planning.
Next: owner playtest this batch; optional separately authorized GitHub backup.
General chair-click, Front Desk onboarding hover/click and broad exposed-floor
reachability remain separate notes, not silently marked completed.

### Owner follow-up: south-facing chair contact (September 28)

Owner reports south-facing Waiting Room and Front Desk occupants look hovering
in front of chairs rather than sitting on cushions. Reopen this narrow visual
acceptance; earlier facing/depth acceptance does not override owner feedback.
Sol service_queue owns diagnosis of anatomical still seat contact versus actual
furniture cushion target, followed by bounded implementation once root reviews
the proposed correction. Sol browser_flow_proof owns deterministic same-identity
before/after proof at100/160 for Waiting0 bench, Waiting270 south chair and
Front Desk secretary. Capture baseline before production edits. Private4197 and
fresh profile only, owner4173 untouched. Preserve GS-023 subsequent shared work,
other directions, bed contacts, scale/loading, navigation and source artwork.
Root owns review/acceptance and durable records. No push/deployment authorized.

Follow-up diagnosis: GS026 anatomical seat registration aligns exactly with the
requested world target; changing it globally would disturb accepted bed contacts.
South-facing chair targets were too close to floor/front edge. Sol changed only
approvedRoomPresentation.ts and its tests: opt-in .25-tile northward seat-surface
inset for south Waiting and Front Desk staff chair. Grounds, fixture-depth floor,
art, pose direction and scales unchanged. Exact pre-edit copies/hashes live in
.local-dev/gs025-south-seat/before-source. Root reviewed both diffs and independently
passed focused46/4 and player types. Browser before3/3 and initial after3/3 pass;
after Waiting identities differed because reload repaired incompatible fixture
demographics, so same-identity image comparison requires normalized fixture
repair. Initial images look promising; final visual acceptance remains pending.

Follow-up complete locally: parent reviewed final before/after bench and secretary
at100/160 and corrected south chair. Final browser3/3 PASS; parent focused46/4
and types PASS. Bench/secretary identities match before/after. Important evidence
limitation: despite worker's initial claim, the BEFORE rotated south-chair PNG
shows a different male patient; AFTER shows patient.adult.013. Root caught this
visually. That chair's final contact was reviewed independently, not claimed as
same-identity comparison. No additional production change was needed. Final
images in .local-dev/gs025-south-seat/after, baselines in before. Sol service_queue
implemented two scoped files; Sol browser_flow_proof handled tests/evidence;
root reviewed actual diffs and pictures. Owned4197 stopped and listener absent.
Owner4173/profile unchanged. Local only; no commit/push/deployment.

### Reopened south Waiting contact + phlebotomy pair

Owner's next screenshot still shows south Waiting seating in front of cushion;
prior .25-tile calibration is not owner-accepted. Investigate actual anatomical
contact and furniture overlap, not only algebraic seat-marker equality or
another blind offset. New request also includes patient on phlebotomy chair and
phlebotomist on stool during blood draw, both supported orientations.
Sol service_queue owns renderer/support diagnosis and subsequent implementation;
Terra flow_investigation owns independent read-only domain staffing/timing state
investigation. Sol browser_flow_proof owns deterministic normalized-identity
before/after and real-state phlebotomy proof. Root owns architecture, source/art
review and acceptance. Capture baselines before writes. Private4197 freshprofile,
owner4173/save untouched; .local-dev/gs025-waiting-phlebotomy evidence. Preserve
GS023 terminal/local test work, timing/economics, carebeds and other facings.
No art regeneration, broad navigation changes, commit/push/deploy authorized.

Owner confirms screenshot came from START_GAME.cmd. Current matched male.032
and female.007 normalized-state proof also shows the issue, so do not dismiss it
as stale/remote. Before1/1 PASS, images/normalized state saved in new evidence
root. Sol proposes bounded runtime foreground chair-arm/side crops from existing
art to restore occupied-seat overlap, preserving current seat/scale. Root
authorized experiment but explicitly rejects arbitrary lip strips over knees;
actual image acceptance required before claiming fix. First write milestone is
Waiting renderer/support/tests only. Browser replays exact normalized state.

Terra found two blood-draw paths: GS023 income.collection has reserved employee
IDs, perform_service task and real arrival, but generic patient/staff anchors
coincide; regular PendingResult labs reserve capacity without concrete phleb
assignment/task. Owner scope covers both. Next sequential Sol milestone must
add actual phleb routing/arrival/release for new regular orders plus care-anchor
targets and player support roles, preserving legacy frozen orders and work
durations. Terra supplies read-only lifecycle architecture. Do not fake a
stationary/render-only phlebotomist or silently limit this to GS023 collections.

Root approved Terra's next-milestone architecture: new optional phlebotomistId
plus phlebotomyArrivalGatedVersion marker on newly dispatched PendingResults;
concrete idle/reachable selection and exact-ID exclusion across clinical orders
and service operations; actual patient/clinician care-anchor routes; collection
starts after both arrive while authored phase durations stay fixed. Retain
perform_service task through resource phase, release before sendout/report-in,
and restore safely on reload. Legacy markerless orders retain frozen semantics;
missing/corrupt staff must not delete results or fabricate collection. Queued
orders only reserve on successful atomic dispatch. New income.collection service
operations use chair/stool care anchors. Sol owns domain selectors/reducer/types/
persistence/service-operations + regressions, and player support/types/projection
after Waiting source freeze. Required tests cover both orientations, arrival,
unchanged collection duration, busy queue, multi-staff exact-ID exclusion,
reload/missing staff and legacy timing. No clinical/economic/balance edits.

Parent PRE-phlebotomy domain baseline:592 passed /4 failed in50 files (596 tests).
Existing failures: level-two-endoscopy2, level-two-support-operations1 GLP1 NP
stations, randomness1 female name allowlist (Iris). Log domain-before.log in
current evidence root. These predate phleb edits amid concurrent shared work;
preserve unrelated edits and compare final failures rather than claiming a green
baseline or silently fixing unrelated behavior.

Waiting experiment rejected: outer11% foreground arm crops do not intersect
interior bench sitters; exact normalized-state BEFORE/AFTER was visually
identical. Sol removes only experimental additions, preserving concurrent phleb
edits. Read-only diagnostic wrappers compared extra north .15/.25/.35 at160 with
exact male.032/female.007. Parent viewed all: .25 best fits hips onto cushion;
.35 too high. Approved production calibration: SOUTH WAITING BENCH total .50
tile north from original proof (additional.25), leaving single Waiting chairs
and Front Desk at prior.25. No art/scale/ground/depth change. Diagnostic injected
views are not acceptance evidence; require fresh real-source replay at100/160.

Real-source Waiting replay1/1 PASS, final-source/waiting-south-bench100/160
screenshots independently viewed and accepted by parent: exact male.032 and
female.007 now contact cushion. No injected wrapper in acceptance capture.
Experimental foreground crops removed. Sol continues phlebotomy implementation;
Terra resumed read-only lifecycle review; browser worker prepares both real draw
pathways at0/270. Review found queued dispatch missing new marker; returned to
Sol with retail-preemption and semantic clinician-anchor followups. No owner
save/profile changes and no publication.

Parent review of actual scoped domain/player diffs confirms concrete phleb
assignment and semantic chair/stool support; unrelated staged diagnostic and
GLP1 changes remain with concurrent task. Terra read-only re-review accepts
queue/persistence marker corrections, resource-window release and collision
protection. Parent player511/82 PASS and isolated build PASS (existing chunk
warning). First broad domain while final regressions were being added:605 PASS,
5 FAIL: baseline endoscopy2, new rotated/cross-flow phleb fixture2, and existing
fixed-ETA lab expectation1. Sol owns correction of these3 phleb-related tests;
new draw work begins after actual arrival, so unchanged15 collection/60 external
phases replace old scheduledTick start only for new marker. Other service timing
and markerless saves remain frozen. Full validation is not yet final; browser
real blood-draw images and source freeze still pending.

Phlebotomy source frozen by Sol: focused domain56/player28 and both typechecks
PASS. Parent independently player511/82, current player types, isolated build,
boundaries and launcher PASS. Parent frozen broad domain611 PASS/5 FAIL in51
files: pre-existing endoscopy2 plus concurrently added contrast-swallow, urea-
breath and nipple-sampling mapping expectations3. All phleb-specific, queue,
rotated/legacy, cross-flow and timing regression tests now pass. Parent reviewed
timing-test scoped diff: keeps exact15+60 phase durations and frozen reload,
retains original nonphleb ETA expectations. Removed foreground experiment leaves
Renderer and FacilityScene unchanged in the diff against this follow-up's before snapshot.
Browser acceptance still pending; no final completion claimed yet.

### Follow-up complete locally — final acceptance

Final browser2/2 PASS for real PendingResult basic-labs0 and actual GS023
START_SERVICE_OPERATION income.collection visitor270, each midwalk -> seated
15-minute collection -> release. Root viewed final-run active images in both
orientations plus release evidence and accepts seat contact/facing. The rotated
proof initially failed due fixture geometry/eligibility and an assertion before
the normal next-tick resource reservation. Sol service_queue read-only diagnosed
the latter; browser worker corrected the harness. No production workaround.
Earlier authored terminal FHH attempt selected external processing and is not
claimed as passing proof. Exact Waiting .032/.007 real-source proof1/1 remains
accepted at100/160. Blood-draw snapshots are synthetic campaigns, not owner-save
replays; identity can vary between separate diagnostic runs, final images were
reviewed independently. Evidence stays in .local-dev/gs025-waiting-phlebotomy.

Concurrent diagnostic task finished during final acceptance. Root reran current
integrated domain618/51 and player511/82: all PASS. Player types and isolated
production build PASS; boundaries/launcher checks PASS. Previous5 failures are
resolved, not outstanding caveats. Final build retains existing chunk-size
warning. One tiny parent integration correction: added eight non-null assertions
to indexed frame accesses in newly edited characterWalkRegistry.test.ts after
its8-frame contract assertions, resolving concurrent test-only TS2532 errors.
No walking production behavior or other agent's frame expectations changed.
Full player511 and final typecheck validate that correction. All substantial
implementation and browser milestones were delegated to named Sol workers;
Terra performed architecture/lifecycle read-only investigation and review.

Browser worker stopped owned VitePID6644;4197 listener absent. Owner4173 and
usual profile/save untouched. Owner should Save & Close then START_GAME.cmd ->
http://127.0.0.1:4173 usual persistent profile to review new draws. No commit,
push, merge or deployment. Valuable checkpoint remains local: say "push to
GitHub" for audited backup. Current/scoped handoffs and project brief/board
updated. Next action is owner visual feedback; broader chair-click/onboarding
and exposed-floor reachability backlog is separate.

### GLP-1 workstation follow-up — active
Owner requests each GLP1 NP seated in their own chair facing their computer.
Bounded goal: map existing deterministic two-NP workstation assignment to proper
semantic seat support, contact/facing/depth for both approved orientations. Use
actual employee arrival; moving/tasking workers must not snap into seats. Keep
income, staffing capacity, clinical content and source artwork unchanged.
Terra flow_investigation owns production/player tests, narrowly domain station
helper reuse only if needed. Sol browser_flow_proof owns separate E2E proof.
Parent owns architecture/diff/image acceptance and docs. Capture scoped baseline
before writes in .local-dev/gs025-glp1-seating. Check actual two-worker rendering,
both orientations, distinct seats, facing computers, no walking snap; focused
player tests/types and private4197 browser proof. Preserve concurrent biopsy,
visitor and wall changes noted in current handoff; no commit/push/deploy or
owner4173/profile changes. Next: worker diagnosis and bounded implementation.

GLP1 design review: approved proof has left/right chairs facingE/W at0 andN/S
at270. Semantic station1/2 roles bind deterministic NP assignments to those two
supports. Seat/own-chair depth contacts come from captured chair draws; south
seat reuses existing.25 cushion inset subject to image acceptance. Reuse existing
getGlp1NursePractitionerStation via API-only export; domain idle movement clears
path at workstation, so support accepts empty idle path but rejects active path,
other facility tasks and active shopping. Parent reviewed exact presentation/VM
hunks and requested walking-at-origin guard (added). Worker disclosed missing
staff.ts pre-edit snapshot; only helper export is claimed, independently seen
private in parent's earlier read. Do not invent a reconstructed original.

GLP1 source freeze: Terra focused22/2 and player types PASS. Parent independently
reviewed scoped support/VM/types changes (FacilityScene unchanged), domain station
checks9 PASS, player types and isolated build PASS (existing chunk warning).
Full player current run510 PASS/2 FAIL: only concurrent GS026 walk-registry
expectations (fourth .032 identity and newer owner-approved direction statuses).
These are unrelated active art work; do not overwrite their expectations here.
Browser0/270 real two-hire proof still pending. No completion claimed yet.

Parent image review: normal0 two-NP contact/facing at100/160 accepted. Rotated270
south-facing NP rejected: blue chair back painted over torso; north-facing NP
correctly has chair back in foreground. Browser archived pre-correction evidence.
Root identified draw-depth mismatch: telehealth chair1/2 lack model fixture
names leftSeat/rightSeat, so renderer uses bitmap bottom fallback, while support
used captured groundContact a few pixels above. Terra owns bounded south-only
own-chair depth correction; keep north/side overlap and divider sorting intact.
Browser now asserts direction-specific own-chair ordering rather than a generic
all-chairs-behind rule. Final image review remains required.

Rotated depth correction passed parent-focused30/types and fixed chair-back
occlusion. Parent then found south sitter slightly high: same-state diagnostic
undoing generic.25 south inset improved hips/cushion/computer contact. Approved
telehealth-only removal of generic inset; captured proof seatContact is explicit
and sufficient. Keep south own-bitmap depth correction, all other room seat
calibrations unchanged. Diagnostic is not final-source acceptance. Browser must
rerun final0/270 real-source captures after Terra's tiny calibration update.

### GLP1 follow-up complete locally
Terra implemented and froze explicit telehealth seat contacts plus south own-chair
bitmap-baseline depth. Parent inspected actual changed support/projection/tests
and API-only staff helper export; no Scene edit or art/economy/path change.
Parent independently passed focused30/3, domain workstation9, player types,
final integrated player512/83 and final isolated Vite build. Existing chunk
warning remains. Earlier GS026 registry failures were fixed by concurrent work
and final player suite is green; no outstanding test failure claimed here.

Sol browser final real-source2/2 PASS25.0s: two actual HIRE_STAFF commands, real
arrival routes, distinct stations, moving no-seat guard,0/270 cardinal facing,
chair/desk ordering,100/160 captures. Parent viewed final160 images for BOTH
orientations after diagnostic wrapper removal and accepts anatomy/layers.
Exact snapshot identities stay stable within each scenario; different runs can
have different randomly assigned stills and two distinct employees can share a
still. No distinct-art identity claim. Pre-correction and diagnostic evidence
preserved separately; none substituted for final-source proof. Browser worker
stopped owned VitePID40812 and confirmed4197 listener absent. Owner profile/save
and4173 untouched. Scoped/current handoffs and brief/board updated.

All substantial implementation and browser milestones delegated (Terra/Sol),
root retained architecture/diff/image acceptance and planning. Staff.ts missing
pre-edit snapshot caveat above remains accurately recorded; its API-only change
was independently read before/after. No commit/push/deploy. Next: owner visual
playtest via Save & Close -> START_GAME.cmd ->http://127.0.0.1:4173 usual profile.
Say "push to GitHub" for audited backup; this checkpoint is local only.
