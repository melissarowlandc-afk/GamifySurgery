# Clinic playtest: punch biopsy, visitor continuity and shared walls

## Goal and constraints

Owner reports (2026-09-28): correct full-thickness punch biopsy did not visit
Minor Procedure; scheduled diagnostic visitors appear/disappear instead of
walking their full sidewalk-to-service-to-sidewalk path; north/south neighboring
rooms show double walls. Hide the northern room's south wall where the southern
room's short north wall backs it. Preserve exposed wall segments and doors.

Shared beta intake: 429 dirty entries. Read root AGENTS/current handoff and prior
economy/diagnostic completion. Preserve all existing work, saves, clinical prose,
keys, concept IDs and approved fees/times. No generic biopsy matching, rebuilding
completed features, dependency installs, commit/push/deploy or owner server edits.
Owner pathway remains START_GAME.cmd -> http://127.0.0.1:4173 usual profile.

## Milestones and ownership

1. Sol test_order_architecture: reproduce exact punch-biopsy mapping/lifecycle
   failure, bounded fix in diagnostic/domain modules and focused regression tests.
2. Next worker (sequential): scheduled diagnostic visitors persist visibly from
   either sidewalk direction through waiting, actual test and full departure.
3. Next worker (sequential): suppress only backed duplicate south-wall segments;
   retain southern room's short north wall and exposed edges/door continuity.
4. Astra: review actual task-relative diffs and validation, isolated browser
   proof, update current handoff. Parent owns durable planning.

## Acceptance and validation

Exact reported biopsy performs local work with fee once and preserves external
pathology/result gates. Visitors have stable identity/location through queues,
travel, work and complete departure, including reload; no teleport to service
or disappearance at the entrance. Both sidewalk sides exercised. Shared walls
tested with full/partial adjacency and representative door/rotation layouts,
with before/after visual review. Focused domain/player tests and types, broader
checks when integrated. Private browser origin only; clean up owned test server.

## Progress / next action

Sol assigned biopsy milestone. Parent investigates visitor/wall architecture
and existing plans while worker owns diagnostic edits. No new runtime edits yet.

Parent visitor findings: service-operations.createOperation places visitors at
entrance.outside with no arrival path; tryReserve rebuilds from entrance instead
of current location; pathToExit stops at entrance.outside and then clears the
actor. Retail start also resets service visitors from entrance. Ordinary
encounters already use deterministic left/right endpoints beyond map bounds in
reducer. Reuse those semantics without importing reducer into service modules.
Arrival needs a persisted lifecycle before resource reservation, optional
shopping must wait until arrival, and timeout/cancellation must visibly leave
from actual position. Existing legacy operations need safe continuity, not a
reset to their newly selected offscreen origin. Preserve room work duration and
fee; travel extends visit time, not work time. Consider companion visibility
where scheduled diagnostic visitors have a linked actor.

Terra shared_wall_diagnosis is read-only alongside the biopsy writer. Existing
roomCutaway ownership already suppresses backed south edges; diagnose where the
current approved-room path bypasses that policy rather than redesigning walls.

Terra diagnosis confirmed: approved drawApprovedRoomCaps and
drawApprovedSouthForeground both paint every south segment; canonical shell
already handles ownership. Authorized disjoint writer exception: Terra owns only
the narrow approved renderer correction, helper/tests and new dedicated wall
browser spec; Sol owns domain diagnostic files. Terra captures before/after on
private4198, preserving unrelated FacilityScene edits; parent reviews images.

Biopsy milestone accepted: all four exact choices were already mapped correctly;
beginPendingResultTravel only started offsite movement. Sol added the missing
onsite departure branch, preserving the waiting reservation. Serialized frozen
Paget encounter regression covers actual Minor Procedure arrival, founder,
15-minute sampling, one $150 receipt, external pathology and duplicate ACK/reload.
Worker domain99/5 files and types PASS; parent inspected baseline-relative diff
and independently passed targeted regression. Only reducer/test changed. Sol now
owns sequential visitor continuity implementation; Terra remains disjoint in
renderer/browser files. No clinical content/mapping/fee changes for biopsy.

Wall correction accepted by parent actual baseline-relative diff and same-layout
before/after image review: FacilityScene now skips backed south offsets in both
approved drawing passes. Exposed offset0 stays, full/partial and270-degree room
pairs remove duplicate lip while lower short north walls remain. Worker focused
37/player types/browser1 PASS. First capture had camera on empty landscape and
was rejected; corrected captures show the actual rooms. Before capture uses
only a reversible removal of this patch, retained in ignored evidence. No raster
or geometry changes. Terra now owns a separate test-only biopsy/visitor browser
spec on private4198 alongside Sol's domain visitor implementation; no runtime
edits authorized to the browser worker.

Punch browser PASS1/1 (28.3s), parent image-reviewed patient and founder in Minor
Procedure. Exact choice, 15-minute sampling, reload mid-work, one$150 receipt and
external pathology pending asserted. Browser initially incorrectly sought a
serviceOperations entry; parent corrected the harness to the actual pendingResult
patientTravel/timingPhases model. No additional runtime change was needed.

Visitor implementation now compiles: arriving status and frozen sidewalk endpoint,
arrival-before-queue timeout, actual-location retail/service handoffs, movement
clock resets, full departure and legacy continuation. Parent reviewed core diff
and requested preserved nonvisitor fallback plus per-tick both-side continuity
and departure reload assertions. Focused validation/browser remain underway.

Visitor source accepted after parent reviewed baseline-relative service/retail/
types/persistence diffs and strengthened per-tick continuity tests. Worker73/73
focused PASS. Parent full domain622/51 files and player511/82 PASS, domain/player
types PASS, boundaries and launcher PASS. During checks, concurrent GLP seating
work introduced optional fixture access in approvedRoomPresentation.ts; parent
made one tiny integration guard (`!fixture`) to express the existing early-return
condition to TypeScript, preserving the concurrent feature. No clinical/fee
changes. Final private browser left/right visitor proof and cleanup pending.

Final build PASS (existing large-bundle advisory only). Terra repeatedly handed
back visitor browser work with the runner still active; parent also found its
named sidewalk captures sampled actors too early, offscreen/on the room leg.
Escalated final browser milestone to fresh Sol visitor_browser_acceptance,
exclusive ownership of the new biopsy/visitor spec and ignored evidence.
Transferred owned Vite4198 PID11236 and Playwright45596; no owner4173 touched.
Require actual on-screen sidewalk snapshots, both sides, mid-departure reload
and final cleanup before closeout. Core source remains accepted/stable.

## Complete locally — 2026-09-28

Sol final visitor browser run PASS2/2 in2.3m. Both naturally scheduled US visitors
are visible on their respective sidewalk arrival and departure, visible in US
for45 game minutes, survive arrival/departure reload at identical actor/location/
path index, earn exactly one$120 receipt, and disappear only at the offscreen
endpoint. Parent reviewed the final spec and all six updated screenshots in
`.local-dev/clinic-playtest-visitors/`. Earlier incomplete captures are superseded.
An intermediate harness required a transient queue state after it had already
advanced; removing that brittle poll retained all substantive assertions. No
runtime correction was needed. Punch browser PASS1 and wall browser PASS1 remain
accepted, giving four accepted scenarios for this milestone.

Private Vite11236 stopped; parent independently confirmed no4198 listener and no
remaining owned Vite/old Playwright45596. Owner save/profile/server untouched.
All requested fixes complete. Source/review evidence: biopsy baseline diff,
visitor continuity baseline diff, wall baseline and same-layout before/after.
Parent independent validation: domain622, player511, wall37, affected types,
build, dependency boundaries and launcher all PASS. Final whitespace check PASS.
The only parent implementation edit was the tiny optional-fixture guard above;
Sol owned diagnostic/visitor changes, Terra walls and initial browser proof,
fresh Sol final visitor browser acceptance. All prior dirty work preserved.

Next action: owner playtest via START_GAME.cmd -> http://127.0.0.1:4173 in usual
persistent profile. No commit/push/deploy. This valuable local checkpoint needs
explicit "push to GitHub" for an audited remote backup.
