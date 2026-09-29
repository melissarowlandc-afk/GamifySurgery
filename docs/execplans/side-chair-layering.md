# East/west chair layering

## Goal and owner requirement
The owner rejects the prior GLP1 side-chair layering. For every chair capable of
east/west facing, draw the seated character above the north armrest, seat, back
and legs, but behind the southern armrest. Preserve facing and anatomical seat
contacts. This replaces earlier visual acceptance of whole-chair foreground.

## Constraints and repository state
Shared dirty beta workspace contains concurrent GS028 and clinic playtest work.
Read current handoff and preserve unrelated changes. No source art regeneration,
economy/clinical/navigation changes, save edits, commits, push or deployment.
Use existing pixels with explicit runtime rear/foreground layers. Do not use a
generic rectangle that includes unrelated chair pieces or body-obscuring strips.
Owner path remains START_GAME.cmd -> http://127.0.0.1:4173 usual profile.
Tests use private4197 and fresh synthetic profiles; leave owner saves alone.

## Milestones and ownership
1. Terra flow_investigation: read-only complete inventory of east/west chairs,
   source atlases, support IDs and orientations; report armless seats separately.
2. Sol service_queue: bounded renderer/mask design then implementation after
   parent review. Own approvedRoomPresentation/Renderer, narrow FacilityScene
   integration and focused tests/new chair-layer module if useful. Capture exact
   before files/hashes under .local-dev/gs025-side-chair-layering before edits.
3. Sol browser_flow_proof: independent E2E proof of each inventoried chair type,
   east/west, vacancy/occupancy/walking behavior and camera/zoom compatibility.
4. Root: architecture/mask/image review, integration checks, acceptance and docs.
Workers must not spawn, alter durable planning, install, commit/push or replace
other agents' edits. Normally only one production writer.

## Acceptance and validation
Explicit inventory coverage. Rear chair < seated actor < southern armrest;
north/south behavior preserved. Walking actors retain spatial depth, no global
raised characters. Masks align to source pixels across zoom and panning; empty
chair reconstruction unchanged. Use asset-specific polygons/crops only after
image inspection. Parent views actual final-source closeups, not just numeric
depth checks. Focused unit tests, player types/build and private browser checks.
Do not infer subjective visual acceptance from earlier incorrectly accepted
whole-chair overlap. No image-generation skill required for runtime compositing.

## Progress / next action
Terra completed the read-only inventory; root inspected all four source atlases.
Six source-crop masks cover Waiting0 leftChair E/rightChair W, Waiting270 bench
E (both seats share one fixture), Phlebotomy270 patient chair E, and Telehealth0
chair1 E/chair2 W. Source-rect keys must distinguish mirrored crops. Armless
stools, beds, fixed N/S Front Desk chairs and coffee (no seat) are excluded.
Legacy generic visitor-chair rendering is unreachable for current approved rooms.
Root approved Sol's design: exact support/room/draw ownership, six guarded
source-pixel polygons, cached complementary rear/southern-arm textures only
while occupied. Vacant/moving fixtures retain the exact original full frame.
Match E/W actor painter depth to its actual owner bitmap baseline while keeping
seat contact unchanged. Foreground sits .5 above the deepest bound occupant;
shared bench binds both seats. Preserve ordinary walking depth and N/S support.
Sol now owns implementation and focused checks; browser Sol owns corresponding
independent fixture proof. E2E baseline captured; production baseline must
precede implementation. Earlier whole-chair foreground acceptance is superseded
by the owner's explicit ordering above.

Root reviewed the actual presentation/Scene diffs and native Phaser canvas
pixel APIs. Source snapshots/hashes are in before/source. Concurrent ultrasound
wall-print backing changes in presentation are unrelated and preserved.
Root rejected initial masks containing cushion strips; Sol tightened contours
and root visually approved all six isolated armrest cutouts. Browser interim
smoke found missing layer registration despite valid actor bindings; renderer
worker is resolving it before final-source acceptance. No completion claimed.

Registration fix: Waiting draw IDs require their exact `draws.` prefix. Focused
45 tests passed; root independently ran player517/84, player TypeScript and
isolated Vite build successfully. Existing large-chunk warning persists.
Five final browser scenarios pass with exact before/after actor identities,
occupied100/160, vacancy/movement and six-crop coverage. Root reviewed all five
occupied160 images. Final same-scene bench occupancy transitions and duplicate
room isolation checks were then added without rebuilding the scene. Root
reviewed their implementation and 0/2/0-final actor/layer evidence: vacancy
restores full art and the occupied second room remains split. Root also reviewed
GLP before/after and phlebotomy after 3x closeups; all six masks visually accepted.
Source freeze hashes still match. Boundary/launcher checks PASS. Implementation
and review are complete. Final browser6/6 PASS (matrix plus live lifecycle),
legacy GLP2/2 PASS. Private Vite PID47552 stopped and port4197 verified closed.
No qualifying implementation was left undelegated. No owner visual acceptance,
commit, push or deployment is claimed. Next: owner playtest/feedback and optional
explicit GitHub backup request.
