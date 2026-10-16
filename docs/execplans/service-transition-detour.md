# Intermittent service-transition wall-crossing detour

## Goal
Resolve the owner's report: near ultrasound, minor procedures or blood work,
characters sometimes travel through walls toward the clinic's bottom-right,
then follow normal paths back. Reproduce the transition and fix its cause.

## Constraints and repository state
Shared dirty beta workspace; GS029 published September29, GS026 gait work and
GS028 content coexist. Preserve unrelated work, source art, clinical data,
seating contacts/layers and saves. No commit/push/deploy authorized. Owner's
current pathway confirmed: local START_GAME.cmd. Local canonical
origin is START_GAME.cmd -> http://127.0.0.1:4173. Use synthetic private browser
fixtures for proof; never access or mutate owner save/profile.

## Ownership and milestones
1. Sol service_queue investigates domain route transitions read-only.
2. Terra flow_investigation investigates actor view-model projection read-only.
3. Root reviews renderer interpolation and integrates evidence/reproduction.
4. After confirmed cause, delegate bounded implementation and regressions to
   Sol; capture exact before files/hashes before editing. Workers share files,
   preserve unrelated changes, do not spawn or alter durable planning.
5. Independent browser proof if warranted, parent diff/test/image review,
   appropriate checks and handoff closeout. No speculative broad route rewrite.

## Acceptance
Service transitions do not synthesize unvalidated through-wall travel, rewind
to old route origins, or abandon still-valid door/turn waypoints. Preserve
normal smooth handoffs, arrival gates, pause/reload/speed behavior and routes
for all actor kinds. Regression must fail on real prior behavior and validate
path correctness, not merely remove the visible symptom.

## Findings and next action
Root found renderer handoffRouteMotion in routeMotion.ts appends a synthetic
X-then-Y bridge to new path[0] if it cannot find that origin ahead on the old
render track. This bridge ignores walls and can replay a historical prefix.
Root reproduced with rendered/logical position both (4,2) and a replacement
route whose index8 is (4,2) but historical origin is (8,6). Handoff synthesizes
wall-blind travel east/south to (8,6), then replays the route back to (4,2).
Terra corroborated patient VM fallback from patientMovement to pendingFacilityRoute
while location is selected independently; movementPresentation retains terminal
paths even when moving=false. Domain worker is checking the real triggering
service transition before implementation.

## Approved implementation milestone
Sol corroborated consistent domain path/index/location updates; the renderer
alone invents the wall-blind bridge when projections skip early new-route ticks.
Own routeMotion.ts and tests: search meaningful shared waypoints through the
new authoritative index, retain valid remaining tail, skip historical prefix,
and reset to authoritative position when disconnected rather than invent paths.
Also approved narrow selectors.ts regression/fix for delivered markerless old
pending orders still projecting frozen travel. No navigation/persistence/VM
rewrite. Exact before snapshots and fail-before/pass-after evidence required.

Browser Sol owns new tests/e2e/service-transition-detour.spec.ts and private
artifacts. Action-generated US/minor/phleb transitions, renderer traces checked
against actual route edges, 4x plus US pause/reload control; require observed
handoff to prevent vacuous passes. Capture genuine baseline if possible; label
any frozen-module reproduction separately from actual-game before evidence.
Evidence root: .local-dev/gs025-service-detour/. Root retains acceptance.

## Implementation and review
Sol captured exact before sources/hashes, added regressions (old renderer3 fail,
old selectors2 fail while prior tests pass), then implemented the bounded fix.
Root caught a draft that skipped valid old-tail catch-up when successor logical
index was already advanced. Sol corrected matching with a validated prefix
fallback and added the catch-up test. Fractional overshoot uses only the current
known edge and reverses it; disconnected routes never synthesize bridge nodes.
Terra reviewed the corrected diff read-only and found no remaining blocker.
Root reviewed actual source/tests and independently compared saved old/new
renderer on the minimal detour: old18-node loop becomes current point + next
valid node. No source art, navigation graph or clinical content changed.

Validation: worker route17/procedure43 PASS. Parent full player521/84 and
domain813/52 PASS; both types, isolated build, boundary/launcher checks PASS.
Existing large-chunk build advisory remains. Production is frozen.
Browser pre-fix fixture failed before reaching the transition: there is NO
claimed actual-game before reproduction. First post-fix US trace covered only
outbound arrival and is a control, not handoff acceptance. Browser worker now
traces real service completion/return replacements and their legal route edges.

## Complete locally — September 29, 2026
Final browser4/4 PASS: real US/minor/phlebotomy completion-to-return handoffs at
4x and US pause/reload at1x. Every flow observes two actual projected routes,
positive logical progress and live render tracks; generated track edges and
interpolated samples stay on routes produced by the reducer. Root reviewed the
spec/assertions and all three transition images, independently verified the
42/47/50-frame traces have two routes each and zero extra rendered edges. The
minimal old/new renderer regression remains the demonstrated failure; these
browser traces are post-fix flow regression coverage, not a claimed reproduction
in the owner's save. Final hashes are in final-source-hashes.sha256.
Sol service_queue implemented, Terra flow_investigation investigated/reviewed,
Sol browser_flow_proof owned browser checks. No qualifying implementation left
undelegated; root performed architecture/review/validation/docs. No push/deploy.
Next: owner playtest at the unchanged canonical local origin; explicit
"push to GitHub" for an audited backup.
Owned private4197 PID27444 stopped; worker and parent confirmed no listener.
Owner4173/profile/saves remained untouched.
