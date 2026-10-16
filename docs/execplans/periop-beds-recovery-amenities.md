# Periop beds, recovery and patient amenities

## Status — complete locally September29,2026
All three implementation milestones accepted after parent diff/test/image review.
Final affected domain99/99, parent focused player27/27 (worker broader56/56),
combined private browser10/10 PASS; isolated build, boundary/launcher checks PASS.
Player/balance types PASS. Latest domain-wide types blocked only by concurrent
character-still-persistence.test.ts Set<string|undefined> mismatch; untouched here.
Browser final/full-run.log and final/screenshots under .local-dev/gs025-periop-beds
are current evidence. Correct sidewalk image shows an actual exterior actor;
earlier named crops did not. Owned4197 cleanup is recorded in final handoff.
No owner save/profile access, push/deployment or owner visual approval claimed.
New operation marker preserves legacy in-flight timing/behavior. OR remains
future catalog scope. Broader occupied-room-sale lifecycle is a separate task.
Sol service_queue implemented domain milestones; Terra flow_investigation exact
supports/projection and companion correction; Sol browser_flow_proof built and
ran private proofs. Root reviewed actual diffs/evidence and made only a tiny
test null/undefined narrowing correction. No qualifying milestone undelegated.
Next action: owner local playtest, or explicit "push to GitHub" backup request.

## Goal and owner requirements
Follow-up to periop-preparation-queue.md. Assign every waiting Periop patient
an individual actual bed, filling beds deterministically one at a time. Seat
patients at the bed foot facing the central nursing station with correct
layering. Keep at least30 on-site preparation minutes, then queue in Periop
until a suite and eligible provider are ready. Never stack patients inside
Endoscopy: one occupant/reservation per suite, including transfer boundaries.
Return to an individual Periop bed after Endoscopy for60 on-site game minutes.
These durations are owner simulation requirements, not clinical claims.

Owner clarified: patients with pending results or another decision go to the
Waiting Room after recovery; completed visits/service visitors go home.
Preserve existing Front Desk report-in/result flow where needed. Departing
patients may optionally use coffee/gift shop/bathroom; waiting diagnostic and
appointment patients should use the bathroom as needed. Use existing optional
needs/amenity rules and actual reachable rooms; don't invent clinical content.
Prior scope endoscopy/OR surgery only excludes minor office procedures.

## Repository and constraints
Shared dirty beta with concurrent GS026/GS028 and other tasks. Read AGENTS and
current handoff; preserve prior seating, route, phase-flow and content changes.
No commit/push/deploy, dependency installation, source art regeneration or owner
save/profile access. Owner pathway START_GAME.cmd -> http://127.0.0.1:4173,
usual profile. Private synthetic browser proof only on separately owned port.
Existing operations/saves need explicit compatibility handling; don't silently
reinterpret phase indices or duplicate fees/results. Future OR catalog rule
only; no playable OR room/staff/clinical feature expansion.

## Milestones and ownership
1. Sol service_queue: read-only per-bed queue/resource/save/recovery design.
2. Terra flow_investigation: read-only exact authored eight-bed geometry,
   reachable navigation targets, seated facing/contact/layering design.
3. Sol browser_flow_proof: read-only bathroom/retail/discharge reuse inventory.
4. Root approves shared contracts/product behavior before bounded production
   milestones, normally one domain writer at a time and explicitly disjoint
   player geometry work only when contract stable. Workers cannot spawn or edit
   durable plans/docs. Snapshot owned files before edits.
5. Meaningful core regression tests, types/build and private multi-patient
   visual proof. Parent reviews actual diffs, assertions, images and cleanup.

## Acceptance criteria
Distinct stable bed assignments across prep/ready/recovery and save/reload;
proper foot seating facing station on all eight beds. No suite stacking,
double booking, queue starvation or prep/recovery circular waits. Recovery60
starts after physical bed arrival and counts actual time at bed. Preparation
minimum30 preserved. Legitimate bathroom trips retain queue/bed ownership and
return on real paths without active treatment interruption or timer shortcuts.
No invented movement edges. Finite optional departure stops then full sidewalk
exit; no duplicate service fees, discarded later decisions or chart recreation.

## Progress and next action
Read-only investigations delegated to named workers. Owner confirmed unresolved
patients wait onsite for results. Root awaits bed/amenity contracts before edits.

## Approved architecture and staged implementation
New operations opt into periopBedFlowVersion1, keeping phaseFlowVersion1 legacy
records intact. Persist exact room/bed ID/endpoint reservation through prep,
procedure and recovery; release only after physical departure from Periop.
Eight authored IDs in order N3,N4,S3,S4,WC,WD,EC,ED, excluding beds removed by
actual door slot. Logical targets respectively(2,2),(3,2),(2,4),(3,4),(1,2),
(1,3),(4,2),(4,3); validate paths/endpoint-only legality, don't round art poses.
Player gets exact supportId rather than nearest-support selection. New recovery
is60 minimum on-bed minutes; old saves retain existing frozen timings.
Retaining each bed through the procedure guarantees recovery capacity.

Room-level cover_periop nurse task holds one operational nurse at central staff
anchor for all occupied/reserved beds, including patients temporarily in suite.
Nurse cannot simultaneously take incompatible work; procedure nurse/provider
remain exclusive. Start prep/recovery after both patient and coverage arrive.
Keep outgoing suite occupied until patient crosses its room boundary. Process
ready/present patients in deterministic queue order; no suite waiting crowd.
Recovery completion may enter discharging while retaining bed; existing result
callbacks start Front Desk return, resolved/visitor callbacks exit. Release bed
after physical clearance, never on path creation. One fee/result throughout.

Bathroom is a generic persisted amenity trip, not a retail purchase. One actor
per Bathroom room including founder arbitration. Eligible true waiters keep
chair/bed reservation and return on real paths. Prep clocks pause while absent;
ready patients cannot claim suite/provider while away. Defer bathrooms during
procedure and60-minute recovery. Use existing idle opportunity cadence/roll and
founder bathroom dwell window, with no new medical-needs model/numeric rules.
After recovery unresolved patients retain Front Desk -> Waiting flow. Finished
visits roll existing optional idle probability once, choose at most one reachable
bathroom/coffee/gift stop that is actually unlocked/operational, then depart.
Persist itinerary/completion so reload cannot repeat stops or duplicate receipts.

M1 first production milestone: Sol owns bed inventory/navigation/domain engine,
coverage/resource/save/discharge contracts and focused regression tests. Amenity
implementation waits for that contract. Terra prepares exact player support
mapping read-only, then disjoint implementation after contract acceptance.
Root reviews M1 before next domain milestone; second Sol standby for later proof.

## Active ownership / contract
Sol M1 authorized balance navigation/schema; domain spatial/index/types/
persistence/service-operations/reducer/staff integration and focused tests.
Field contract: careStations and sharedStaffAnchor(3,3) endpoint-only; operation
periopBedFlowVersion1, periopBedReservation{version,roomInstanceId,bedId,endpoint},
nextPhaseReadyAtFacilityTick, transitionHeldRoomInstanceIds; discharging status;
cover_periop task targets room. Source snapshots .local-dev/gs025-periop-beds/before.
Terra disjoint player M1a supports/exact selection implemented32 focused tests
pass, parent actualdiff reviewed; parent caught missing visitor supportId pass
and assigned its correction with viewModels integration. No new art. Current
unrelated alert/domain edits can temporarily affect whole-package types.
Browser Sol now owns only new E2E spec/private fixtures. First run must be fast
domain-only valid-footprint/reachability/8bed preflight; no browser/server before
that passes. Actual UI colonoscopy plus controlled real domain operations for
capacity; centered bed/suite imagery. Amenities still wait for M1 acceptance.

## Review in progress and next milestone boundaries
Root reviewed held-bed room accounting and allocator viability checks; Sol
corrected both to include reserved recovery beds and skip unusable earlier
rooms. Pending review: saved reservation validation, resource loss while ready,
physical discharge callbacks, and focused eight-bed/one-nurse/FIFO regressions.
Root reviewed exact player supports; Terra corrected visitor forwarding and is
adding active-operation selection so an older completed test cannot hide a
later Periop assignment. Thirty-two geometry/render tests pass. Full preview
tests currently encounter concurrent alert-refactor runtime failures; do not
repair those unrelated sections or report the suite as passing.

After M1 acceptance, M2 owns generic patient bathroom trips and clinical
arbitration. Optional persisted top-level state should preserve old save/test
fixtures. Trips need a stored real return target, path cursor, bathroom room
reservation, dwell clock and deterministic opportunity cadence. Keep waiting
chair/bed reservation while away. Advance trips before clinical arbitration;
block patient idle movement, retail and clinical dispatch while an active trip
owns movement. If a result or appointment becomes actionable, route back on
real paths before starting care. Preserve actual patient location on reload.
The Founder bathroom planner must exclude rooms reserved by patient trips,
and patient selection must exclude the Founder's active bathroom target.

M3 adds optional departure stops for completed new-bed-flow Endoscopy visits.
Persist a one-time choice and completion state, reuse retail prices, staffing,
budget/cooldown and exactly-once receipts. Retail departure must continue from
the outlet to the building exit rather than return to the now-released bed.
No stop when an encounter still has a later question/result. M2/M3 are not yet
authorized for production edits; their implementation follows M1 review.

### Intermediate evidence (not final acceptance)
- Parent reran exact support/renderer tests:32/32 PASS; domain tsc PASS.
- Browser worker domain gate:1/1 PASS with valid footprint/door/access paths,
  eight reservations plus ninth in Waiting Room, hidden EC bed yields seven,
  and serialization preserving IDs/endpoints. Fixture door offsets corrected
  to Bathroom west1 and Waiting west2 after the gate rejected invalid slots.
- Private browser server4197 is worker-owned; metadata/logs under evidence root.
  Actual UI colonoscopy timing artifact records prep10->40, recovery101->161,
  N3 retained. Parent inspected first recovery image (north head clipped at160%;
  requested complete-room100% proof). Other browser assertions still in progress.
- Parent found staged-result callback incorrectly treating discharging as
  cancelled; Sol corrected it and is running regression coverage.
- Concurrent alert runtime block cleared. Parent now ran all10 session previews:
  nine PASS; a new Periop pose assertion fails at line306. Terra owns diagnosis
  and correction; do not claim presentation suite fully green yet.

### M1 integration discoveries
- Terra corrected the manual preview fixture to synchronize encounter location
  with operation location, as real movement does. All42 player checks now PASS.
- Browser timing extension PASS: physical Front Desk arrival then actual Waiting
  Room seat, active_pending_result/no departure/one fee. Suite boundary/FIFO
  proof PASS with three operations and real ready timestamps.
- Parent inspected eight-bed100/160 images: supports align/facing correct, but
  EC was overlapped by a real companion. Browser confirmed nine auto-created
  retail companion actors follow each primary patient onto clinical endpoints.
  Terra now owns disjoint retail-operations.ts companion-only correction/tests:
  new-bed-flow companions wait at stable unoccupied public standing targets,
  real routes, no clinical beds/suite, preserve shopping and full departure.
  Sol must not edit retail module until this handback. M2 still pending.
- Concurrent occupied-room-sales task now permits selling occupied rooms and
  edits service-operation interruption helpers. Parent found lost-bed ready
  state could hang forever. Sol owns a narrow bed-flow compatibility correction
  preserving unrelated sale behavior; Terra read-only checks interaction.

### M1 engine accepted; M2 bathroom milestone authorized
Root independently ran service/procedure70/70 and reviewed source plus meaningful
eight-bed/hidden-bed/reload/coverage-loss/suite/recovery tests. Worker reports
service/procedure/persistence73/73 and balance7/7 PASS. Exact player42/42 PASS.
Final types/companion integration still pending; not overall task acceptance.
After freezing M1, Sol is authorized M2 generic bathroom trips only: optional
top-level actor-trip fields (encounter/service_visitor), no new departure shops
yet. Own new amenity module/types/persistence/index/reducer/service/selector
hooks and focused tests. Announce stable contract first. Wait for Terra's retail
companion handback before any retail file edits. Terra will own subsequent
disjoint player projection after that contract; browser proof remains isolated.
M2 acceptance: real outbound/return, capacity1 with Founder, preserved chair/bed
and FIFO place, prep paused while away, no procedure/recovery interruptions,
clinical dispatch/result waits or triggers real return, no double movement,
reload exact cursor/dwell/return and safe legacy/invalid-record normalization.

### Companion correction accepted / M2 contracts
Terra companion correction plus parent-requested unreachable-first-public-room
and no-public-route legacy-fallback guards complete. Parent reviewed actual
diff and independently ran retail17/17 PASS. Clean capacity browser rerun1/1
PASS; parent inspected actual `.local-dev/gs025-periop-beds/final/screenshots/`
capacity-eight-beds-100.png. `browser/screenshots/` capacity artifacts are OLD
and still show companions at beds; do not cite them as final evidence. Browser
worker initially gave wrong paths and corrected them. Retail ownership released
to Sol for amenity guards.

M2 stable proposed state: optional patientAmenityTrips[],
patientAmenityNextOpportunityTicks, patientAmenityTripSequence. Trip actorKind
encounter|service_visitor, actorId, bathroomRoomInstanceId, walking_to_amenity|
using_amenity|returning status, saved returnTarget/path/index/lastMoved/dwell.
Terra now owns disjoint player projection/tests after exact type appears: trip
location/path takes priority, no stale chair/bed seating while absent, normal
exact support returns after trip. Browser waits for engine freeze before M2
test implementation; valid Bathroom(33,8), west1 target(33,9), hall(32,9).

### M2 intermediate validation / M3 architecture
Root reran support/renderer/session44/44 and amenity basic3/3 PASS. Terra reports
broader player55/55 plus player types PASS. Valid reload projection uses a real
domain-created trip; handcrafted Periop states remain pure presentation tests.
Browser domain M2 gate3/3 PASS: deterministic scheduled prep trip, Founder
already using bathroom, preserved bed/paused prep/reload/return; queued ninth
waiter real return; ready patient cannot claim suite while away then can after
return. Evidence m2/domain-preflight-expanded.log; final/states holds snapshots.
Reverse Founder selection and result/queue/chart integration tests remain under
Sol review. No M2 browser acceptance yet; actual UI-origin pending waiter
bathroom/chart-return extension is drafted.

M3 reviewed design (not production-authorized yet): optional persisted itinerary
on new bed-flow service operation, selected once on physical Periop clearance
only for finished visits/visitors; no unresolved question/result departure.
Existing chance/cadence and viable bathroom/retail targets; at most one stop.
Retail departure marker narrowly permits this completed-visit actor and keeps
normal staffing/budget/ledger/receipt rules. Root chose to end this retail trip
at its actual counter (or actual cancellation position), then let the existing
service departure planner handle the FULL sidewalk exit. Existing retail
pathToExit ends at entrance.outside and is insufficient for patient departure.
Suppress/synchronize service movement while away; no snapping back to Periop.
Bathroom returns to saved clearance/public location then uses full exit. Hold
actor visible until optional trip and normal exit handoff, release bed promptly
on physical clearance, persist no-choice/completion to prevent reload rerolls.

### M2 core accepted; M3 production authorized
Sol completed reverse Founder arbitration, result/chart/queue guards and
normalization. Parent reviewed final corrections preserving unchanged route
cursors and permitting real return after Bathroom deletion, then independently
ran amenity/service37/37. Earlier combined affected run96/96 in4 files passed.
Worker M2 final focused10 PASS; types PASS. Browser domain gate4/4 including a
real service visitor PASS. Final pending-waiter browser extension still needs
rerun: concurrent alert M4 briefly omitted TUTORIAL_ENCOUNTER_ID import, now
present; browser worker instructed fresh context/own-server restart if needed.
Do not patch unrelated alert work or claim final visual acceptance yet.

Sol M3 authorized per architecture above; snapshot M2 baseline first, domain/
retail/amenity/types/persistence/tests only. Terra owns disjoint M3 player
visibility/route projection and visitor retail ID correction with focused
tests. Browser prepares finite departure/reload/receipt/full-sidewalk proof.
Existing retail operational/staff/budget/ledger/food restriction rules remain;
no new stores/assets/prices. Announce exact itinerary/departure trip contract
before dependent player/test implementation. Overall task remains active.

### M2 final browser acceptance
Fresh-context browser final1/1 PASS plus domain4/4 PASS. Parent inspected actual
final/screenshots/timing-unresolved-bathroom-160.png and bathroom-return image:
patient appears in Bathroom, then returns seated in Waiting Room. Due-result
artifact records dueTick341, undelivered result and real returning path with
returnRequested=true. Concurrent alert import was corrected by its owning task;
no alert changes made here. M3 remains active and overall completion pending.

### M3 contract and review
Persist departureItinerary v1 on operation with pending|bathroom|retail|
completed|skipped status, choiceKind, selected/completed ticks, linkedTripId and
retailIncomeLineId. Bathroom trip links purpose=departure/service operation;
retail trip links departureServiceOperationId. RNG purposes are
service-departure:<operationId>:roll and :choice. Select once after physical
bed clearance; terminal choice resumes service-owned complete sidewalk exit.
Terra corrected visitor retail projection lookup from display actor ID to
operation ID. Parent reviewed exact baseline-relative diff and independently
ran4 player files27/27 PASS; Terra broader56/56/types PASS. Domain implementation
still in progress. Parent requested narrow eligibility/link validation, exact
last-retail-tick location synchronization, and valid removed-Bathroom returning
route persistence. Sol owns these plus focused regression tests before freeze.

### M3 first integrated departure run
Parent reviewed baseline-relative domain/retail/persistence diffs and reran
affected domain99/99 PASS. Player/balance types and isolated build PASS.
Browser departure preflight then caught a real same-tick double move: tick188
to189, patient31,9 ->33,11 (distance4/configured speed2). Service moved to
clearance, selected retail, then retail moved again later in the same tick.
Sol assigned narrow just-created departure-retail movement guard; browser keeps
strict per-tick speed/route assertions. Final acceptance pending this correction,
mid-trip cancellation real-reducer test and removed-Bathroom reload check.

### M3 source accepted; final visual regression active
Sol fixed same-tick retail movement and completed encounter service state at
successful independent exit handoff. Cancellation regression now uses actual
stock-procurement failure after movement, preserving room geometry, and proves
cardinal full exterior departure. Parent reviewed changes and final99/99 PASS.
Root made only a one-line test null/undefined narrowing integration correction.
Removed-Bathroom valid return survives reload. Malformed itinerary parsing and
exact actor/trip cross-links hardened. Isolated final build PASS; player/balance
types previously PASS. Latest domain types blocked by concurrent unrelated
character-still-persistence.test.ts (Set<string|undefined> vs ReadonlySet<string>),
not changed here. Final M3 preflight1/browser1 PASS. Parent inspected actual
counter and resolved-Bathroom images. First sidewalk crop missed actor; browser
worker correcting crop and running complete10-case spec before owned4197 cleanup.
Controlled resolved fixture now explicitly models completed encounter state;
capacity fixture's waiting_unopened state was inappropriate for departure proof.
