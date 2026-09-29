# Periop preparation and procedure queue

## Owner goal
Question-ordered colonoscopy currently goes directly to the endoscopy suite.
All endoscopy/operating-room surgery patients should first occupy periop for at
least 30 in-game minutes, then remain there until their procedure room and
eligible provider are ready. Thirty minutes starts on physical arrival, not
order creation or walking. This exact duration is an owner-specified simulation
rule, not a medical claim. Owner confirmed operating-room surgery only in the
scope clarification; endoscopy is included and minor office procedures excluded.

## Constraints and repository state
Shared dirty beta workspace; preserve GS025 route/seating fixes, GS026 animation
previews, GS028 content and GS029 release records. Read AGENTS/current handoff.
No clinical-content edits, art regeneration, pricing changes, new dependencies,
commit/push/deploy or owner save/profile access. Local owner pathway remains
START_GAME.cmd -> http://127.0.0.1:4173. Private synthetic browser proof only.
Preserve in-progress operations/saves; adding a phase must not reinterpret an
already-running procedure's phaseIndex. No founder/proceduralist reservation
during the prep interval. Preserve postprocedure recovery and existing fees.

## Milestones and ownership
1. Sol service_queue: read-only phase engine/reservation/queue/save design.
2. Terra flow_investigation: read-only question/visitor route inventory,
   bypasses, existing fixtures and presentation needs.
3. Root: product semantics, scope, architecture approval and planning.
4. After design approval, one bounded Sol implementation milestone with exact
   pre-edit snapshots/hashes, explicit source ownership and regression tests.
5. Independent browser proof and parent source/test/image review; handoff.
Workers share files, preserve unrelated work, do not spawn or edit planning,
install, commit, push or deploy. Delegate remaining milestones before edits.

## Acceptance and validation
Question-driven and service-visitor pathways both route to periop first. No
transfer before 30 on-site minutes. Ready patients wait there when the provider
or suite is occupied; earlier periop time survives pause/save/reload. Founder
can attend other patients during preparation. Resources release/reassign without
double booking or deadlocks; respect existing periop capacity/assigned anchors.
Procedure starts only after actors arrive; recovery and payment remain correct.
Use focused fail-before/pass-after regressions, affected types/test suites and
private actual-game proof. Review UI status so waiting/preparing is intelligible.

## Progress / next action
Investigations delegated. Catalog currently combines preparation/procedure in
Endoscopy (75 minutes), then Recovery; OR starts directly with operation.
Design approved below; Sol is implementing M1 and its regressions. Parent
review of the working diff identified completed prep-nurse release and legacy
same-line visitor serialization as required phase-flow corrections; Sol owns
those fixes. Terra is independently reviewing reservation/arrival/save edges.
Question integration and UI writes remain gated on M1 review. The optional
minor-procedure clarification has not been answered; default scope remains
endoscopy and operating-room surgery.

## Inventory and timing decision
Terra found two live endoscopy pipelines: frozen PendingResult/patientTravel
(generic, colonoscopy, duodenal/esophageal biopsies) and catalog operations
(terminal bidirectional, staged EUS/ERCP, visitors). Both must implement prep.
Existing frozen timing explicitly separates30 preparation +45 procedure +45
recovery; catalog75 preparation_and_procedure combines the first two. Therefore
split that75 into30 periop +45 procedure, preserving total work and subsequent
recovery/external timing. This supersedes the provisional add30-to75 assumption.
Future OR catalog120/180 procedure timing remains intact with prep added.
No playable question-driven OR routes/OR room/staff currently exist; do not
invent clinical mappings or introduce an operating-room feature to satisfy this.
Generic support should honor the rule when those catalog operations are used.
UI currently has no periop actor/support occupancy and no useful phase label;
review minimal accurate preparing/waiting presentation as part of the design.

## Approved architecture and sequential milestones
Freeze prep-inclusive phase lists only on NEW affected operations, opted in by
phaseFlowVersion1. Keep legacy raw catalog75 and existing saves' phase indices.
Endoscopy freezes30 periop prep/45 endoscopy/45 recovery; future OR prep30 plus
existing procedure/recovery. Prep has a hard30 minimum even with room upgrades.
Phase-scoped reservations: no future suite/provider lock during prep. New
waiting_for_next_phase retains current patient station, releases completed
phase staff, and retries next resources transactionally before transfer. Start
phase work only after patient/team arrivals. Keep procedure room occupied while
awaiting recovery so no double booking occurs.

Use exactly the existing two periop semantic anchors: waiting(1,2) for prep and
primary(3,2) for recovery. Persist station ownership; new prep/recovery may
coexist, legacy whole-room reservations conflict with both. This lets an active
procedure move to recovery while the next patient waits in prep, avoiding a
cycle. Do not infer eight-bed runtime capacity from decorative source art.

M1 authorized to Sol: operation phase engine/helper, state types/persistence,
new-operation freezing and focused tests. Snapshot before files/hashes under
.local-dev/gs025-periop-preparation/before. M2 after review: integrate ordinary
question PendingResult through a new opt-in operation result link, retaining
existing external delay/Front Desk result flow/one fee; legacy stays unchanged.
Ensure terminal/staged question callers use the same freeze helper. M3: minimal
UI phase/occupancy correction and independent browser proof. Terra prepares
UI changes read-only while M1 runs. Workers may not expand into later writes
before milestone review. Root owns architecture and final acceptance.

## M1 acceptance and next ownership
Parent reviewed the actual before/current source and regression diffs; prep
nurse release and new-flow visitor serialization were corrected. Terra's
independent review found malformed V1 phase-contract normalization; Sol added
a narrow rejection guard. Parent service-operations22/22 and domain tsc PASS.
Verified tests cover arrival/29/30, mid-prep and ready-wait reload, upgrade5
hard minimum, two visitors/prep/recovery progression, new/future OR phase
contracts, live legacy75-minute saved phase and malformed marker rejection.
M1 accepted. Sol now owns M2 domain question integration; Terra owns disjoint
player view-model phase labels/frozen-phase Endoscopy occupancy and focused
tests. Two writers explicitly separated by package. Browser Sol waits for the
stable new PendingResult link contract before writing the private proof.

## Integrated implementation / validation in progress
M2 freezes a PendingResult.localServiceOperation link (feedback_pending,
waiting_for_service, external_processing); ACK creates result_gate operation.
Local completion starts the frozen external remainder and physical Front Desk
return. Parent reviewed source and corrected return-path retry, pending label,
and unavailable-ETA projection. Sol focused71 and domain types passed before
the final ETA test addition. New saved/legacy records remain separate.
Terra player changes use frozen phases for Endoscopy coverage and exact periop
labels; linked onsite work no longer says returns-in-zero/offsite. Parent also
found missing encounter-operation route projection; Terra added full path/index
with explicit patient movement precedence and completed-route suppression.
Focused player17 and types pass; parent broad player528/84 passed. Parent build,
player types, boundary and launcher checks pass. Domain broad initial run had
1006/1012 passing: stale surgery-center timing expectations, a new fixture
cancellation check under investigation, and three concurrently changing content
suite failures. Sol owns relevant test repairs; Terra is isolating the three
content failures without editing them. No all-green domain claim yet.
Browser Sol owns only new periop-preparation.spec.ts and private4197 evidence.
Parent rejected overlapping provisional fixture rooms and required valid
footprints, door-connected corridors and authoritative renderer route checks.
Final actual-question/provider-contention/reload browser proof remains pending.

## Final acceptance — complete locally September 29, 2026
Owner confirmed endoscopy plus operating-room surgery only; minor office
procedures excluded. Sol M1/M2 implemented operation/resource/save flow and
question links; Terra M3 implemented phase labels and authoritative encounter
operation route projection; Sol browser_flow_proof implemented actual-game proof.
Parent reviewed actual scoped before/current diffs, assertions and final centered
Periop/Endoscopy/Recovery images. No blanket acceptance of unrelated dirty work.

Parent final validation: core domain633/51 PASS (excludes two GS028 batch files
and the sustained patient-supply diagnostic); affected four domain suites75
PASS; player529/84 PASS; both package tsc, isolated production build, boundary
and launcher PASS. Browser final2 PASS1/1: actual colonoscopy UI answer/ACK,
real visitor/provider contention, valid nonoverlapping connected geometry, live
Phaser path matching, physical prep arrival at tick79/end109, reload at+12,
still preparing+29, same Periop station waiting at+30 while Founder/endoscopist
and suites busy, subsequent procedure/recovery, completion228 and one450 fee.
Outside-result delay and physical Front Desk delivery gates verified in domain.

Full domain suite is NOT claimed green: initial1006/1012 exposed stale relevant
expectations (fixed), concurrently edited GS028 assertions/snapshot (other work),
and a cancellation test that incorrectly used cleanliness as unavailability
(fixed by removal/restoration of exact room). Second broad run had a GS028
varicose-case5-second timeout and was stopped after >5 CPU-intensive minutes.
Independent read-only review found capped retry loops, not an identified
periop deadlock. Patient-supply isolated later passed; concurrent inventory/test
repairs and types subsequently passed. No unrelated test/snapshot edits by this
task. Final bounded633 and affected75 establish current runtime coverage without
misrepresenting the unfinished full content-batch run.

Evidence: .local-dev/gs025-periop-preparation/final/ and test-output-final2;
final-source-hashes.sha256, before/m2-before/m3-before-path snapshots, final
build-proof-final. Private4197 PID49104 stopped; parent confirmed process gone.
Owner4173/profile/saves untouched. New orders use prep flow; old in-flight
operations and markerless pending results retain their frozen behavior. OR
phase-construction rule tested, but playable OR room/staff/question content does
not exist in this build. Periop uses existing two semantic anchors, not eight
decorative-bed capacity. No additional patient-bed art/seating overhaul claimed.

Next: owner Save & Close, START_GAME.cmd, http://127.0.0.1:4173 usual profile,
then place a new order. Local only; no commit/push/deploy/publication. Say
"push to GitHub" for an audited backup. Remaining GS025 backlog is separate.
