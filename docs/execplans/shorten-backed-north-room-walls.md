# Shorten Backed North Room Walls

## Goal

Make the cutaway building read like one real shared structure from the current
top-down perspective. Every east/west wall remains the exact thin top-down cap
used by the Front Desk. A room's north/back wall remains tall only where that
edge faces the exterior; each segment with a constructed room or hallway
immediately north becomes a shallow wall matching the room's south/front wall.

The shallow replacement must stay visible as a wall, but it must not project
northward over or conceal the room/hallway behind it. Logical room footprints,
not wall artwork, continue to define buildable, usable, walkable, and occupied
world space.

This is a graphics-only renderer milestone. It must not change placement,
collision, routing, doors, saves, progression, balance, timing, staffing,
simulation, or clinical content.

## Visual authority and interpretation

- The owner's instruction in this thread is the visual authority.
- "North/backed" means a one-tile segment of a room's north boundary whose
  immediately adjacent northern world tile belongs to any constructed room or
  hallway. Integer room overlap and the already-rotated runtime footprint are
  authoritative.
- A backed north segment is not an opening. It receives the same shallow
  structural wall height, border language, and source art as a south/front
  wall. Only a persisted live door may remove its exact aperture.
- A north segment with no constructed northern neighbor remains the accepted
  tall Front Desk-derived wall.
- Hallways remain open circulation floors at shared/internal boundaries. This
  milestone changes room back walls; it does not add low barriers through
  connected hallway cells.

## Relevant repository state

- Branch `beta` and `origin/beta` are at
  `eb57bb0018e449b5ab699cb74abd09180714ba67`, a docs-only Pages deployment
  record above the deployed graphics code checkpoint.
- The preceding local graphics milestone is intentionally uncommitted:
  `flatten-vertical-room-walls-top-down.md` adds measured `westCap`/`eastCap`
  frames, a 0.15-tile displayed side width, canonical shell tests, focused
  E2E proofs, and refreshed room/hallway captures. This milestone builds on and
  must preserve that work.
- A separate validated desktop workspace-divider checkpoint is also dirty in
  `CANONICAL_DESIGN.md`, `AppShell.tsx`, `global.css`, `ui/*`, its plan/E2E,
  `docs/features/visual-art-direction.md`, and its screenshot. It is unrelated
  and must remain untouched.
- Three pre-existing untracked room diagnostics remain protected and untouched:
  `examination-room-v3-horizontal-north-door-diagnostic.png`,
  `examination-room-v3-vertical-north-door-diagnostic.png`, and
  `five-room-waiting-bathroom-100-vertical-north-door.png`.
- `roomCutaway.ts` already classifies horizontal exposure one logical tile at a
  time for both room and hallway neighbors. It currently treats covered runs
  as absent in legacy/procedural paths.
- Front Desk v5, Examination v3, every canonical enclosed Level 0-2 room, and
  exposed hallway edges already delegate their structural pieces to the shared
  canonical component grammar.

## Requirements

### Adjacency-aware north-wall composition

- Derive backed/covered north runs from existing facility presentation rooms;
  do not query or mutate gameplay occupancy state beyond the read-only view.
- Feed the backed runs into the shared canonical shell in logical tile units or
  another deterministic footprint-relative form. Keep adjacency separate from
  the persisted door-opening list.
- Intersect tall exterior and shallow backed runs with the existing exact
  north-door subtraction. A door gap must remain clear regardless of whether
  its wall segment is tall or shallow.
- Support fully exposed, fully backed, and partially backed north edges. A
  partial edge must transition at exact tile boundaries without holes,
  double-width seams, stretched pieces, or tall remnants.
- Return only tall, door-subtracted intervals as `northWallFaceRuns` so north
  wall decoration cannot float over shallow segments or the northern room.

### Shallow north-wall presentation

- Reuse the exact south/front wall frame family and `frontHeight`; do not
  invent a third wall height or procedural substitute.
- Place each shallow north component entirely on the subject room side of the
  north boundary. It must not extend into the northern neighbor's footprint.
- Render shallow north components at base architecture depth, not as southern
  foreground occluders. Northern floors, furniture, characters, and wall art
  must remain visually unobstructed.
- Preserve room-specific wall tinting and the accepted border/bevel language.
- The short wall remains present without a door. Adjacency changes wall height,
  never wall existence.

### Shared coverage

- Apply the backed-wall rule to Front Desk v5, both Examination orientations,
  and every canonical enclosed Level 0-2 room.
- Preserve the exact `westCap`/`eastCap` frames and 0.15-tile geometry for all
  rooms and genuinely exposed hallway sides. No legacy upright or angled side
  return may reappear through a fallback renderer.
- Keep hallway internal edges open and retain current exposed north/front edge
  behavior.
- Keep tall exterior north walls and their dimensions/art unchanged.
- Keep south/front walls, front occluder duplication/depth, floors, interiors,
  furniture, people, planters, and room labels unchanged.

### Footprint invariance

- Wall sprites and their display rectangles are presentation only. No wall
  extension may enter placement masks, collision, navigation, build previews,
  save data, or room footprint calculations.
- Do not change room definitions, allowed orientations, domain spatial tests,
  door legality, or hallway connectivity.

## Constraints and non-goals

- No gameplay, systems, balance, clinical, progression, staffing, timing,
  routing, persistence, or content changes.
- Do not redesign room interiors or move fixtures.
- Do not change tall north-wall height, shallow south/front-wall height, or
  east/west cap thickness.
- Do not edit or regenerate raster PNGs. Existing canonical atlas pieces are
  sufficient; therefore do not use Cortan or local image generation.
- Do not stage, commit, push, deploy, publish, reset, clean, checkout, delete,
  or revert files without explicit owner authorization.
- Preserve all unrelated dirty work and diagnostics.

## Implementation design

1. Add or reuse a pure room-cutaway helper that returns covered/backed north
   runs as the exact complement of exposed runs across the rotated footprint.
2. Extend the canonical shell with an optional backed-north-run input. Split
   the door-subtracted north edge into tall `northWall` components and shallow
   front-frame components positioned inside the room floor.
3. Thread the same backed-run profile through Front Desk v5, Examination v3,
   ordinary canonical rooms, and canonical wall-decoration layout. Keep the
   current hallway perimeter component path.
4. Add deterministic tests for full/partial room and hallway backing, exact
   tall-to-short transitions, live north-door gaps in both modes, unchanged
   exterior and south/east/west geometry, decor clipping, and footprint-only
   semantics.
5. Add a focused 100% desktop production-state proof showing Front Desk,
   Examination, an ordinary room, partial backing, room-backed and
   hallway-backed segments, and an exact north door. Refresh existing cap,
   enclosed-room-matrix, and hallway proofs only if their accepted view is
   intentionally affected.

## Milestones and ownership

This is one coupled renderer milestone. Use one `terra_worker` because
adjacency/run intersection, shared wrapper integration, depth ordering, and
native visual acceptance require judgment.

1. Terra owns `roomCutaway.ts` and focused tests if a covered-run helper is
   needed; `canonicalRoomShell.ts` and tests; the smallest necessary
   `frontDeskV5Architecture.ts`, `examinationV3Architecture.ts`, and focused
   tests; the narrow `FacilityScene.ts` presentation integration; one dedicated
   E2E/capture; intentionally refreshed existing graphics captures; and this
   plan's implementation progress.
2. Sol reviews the actual diff and production screenshots, checks that no
   hidden tall component or foreground occluder remains on backed runs, returns
   any nontrivial correction to Terra, runs integrated validation, and updates
   this plan plus the shared handoff.

## Acceptance criteria

- All room and exposed-hallway east/west edges retain the exact thin Front Desk
  cap grammar.
- A fully exterior north edge is pixel/geometrically unchanged and tall.
- A fully backed room north edge is entirely shallow, uses the front-wall art
  and height, stays inside the subject room, and leaves the northern floor and
  contents readable.
- A partially backed north edge changes height at exact tile boundaries with
  clean closed joins.
- A northern room and a northern hallway produce the same backed-wall rule.
- A persisted north door removes only its exact aperture from either a tall or
  shallow run; adjacency without a door leaves a short wall present.
- North-wall decor appears only on surviving tall exterior wall face.
- Front Desk, both Examination orientations, and every enclosed Level 0-2 room
  use the shared behavior; hallway circulation remains open.
- Logical footprints, building placement, routing, saves, and gameplay remain
  unchanged.

## Validation

- Focused Vitest for room cutaway, canonical shell, Front Desk v5,
  Examination v3, room layout/cutaway, and bitmap manifest regression.
- Player workspace typecheck and production build.
- Dedicated desktop Playwright at 100% for full/partial north backing and live
  north-door gaps.
- Existing top-down side-cap, enclosed Level 0-2 matrix, and hallway edge E2E
  regression runs.
- Sol native-resolution inspection of all accepted/refreshed captures.
- `git diff --check` and scoped diff/status review against concurrent work.

## Progress

- [x] Re-read repository instructions and the current graphics/UI handoff.
- [x] Inspect the dirty tree and confirm no active write worker.
- [x] Audit current canonical, Front Desk, Examination, room-cutaway, and
  hallway rendering paths.
- [x] Define the adjacency, depth, door, hallway, and footprint contract.
- [x] Delegate and implement the bounded shared renderer milestone.
- [x] Complete Sol visual/diff review, integrated validation, and handoff.

## Discoveries

- The production Level 1 visual fixture already contains useful full and
  partial northern backing: Examination and Bathroom sit north of the Front
  Desk, while X-ray and Imaging Control sit north of Waiting. It can supply a
  real high-detail acceptance view without inventing gameplay shortcuts.
- Canonical north walls currently ignore adjacency and stay tall; fixture wall
  art uses a separate exposure seam. Passing one backed-run profile into both
  architecture and decoration avoids divergent visual truth.
- Existing side-cap work already gives Front Desk, Examination, ordinary rooms,
  and exposed hallways one east/west vocabulary. This task should retain and
  prove that path, not create new side art.
- `getBackedHorizontalBoundaryRuns` is the exact footprint-relative complement
  of the existing exposed-run profile. It includes both room and hallway
  neighbors but changes only a room's north-wall presentation.
- The shared shell subtracts persisted doors before splitting tall and short
  north components. Short components use `frontWest`/`frontEast` at the floor
  north edge, at base depth only; their bounds never extend north of the
  subject floor.
- All generic canonical wall decor now consumes only tall surviving runs. The
  Examination-specific wall fixture seam suppresses its wall decoration only
  when that fixture's own authored wall slot is backed.
- Correction review tightened independent Front Desk art: each notice-board
  and clock sprite now requires full containment in one tall,
  door-subtracted canonical face run. Unsupported sprites are whole-art
  suppressed instead of clipping or floating over a backed wall.
- Examination wall art now checks its own authored `northWallOffsets` against
  backed tiles. An unrelated backed north tile no longer suppresses a
  supported diagnostic; an exact backed or door-conflict tile does.
- The dedicated proof now adds a real one-cell hallway at `(39,27)` directly
  north of Minor Procedure, creating a partial hallway-backed short segment
  while retaining exterior tall segments.

## Terra implementation evidence

- Focused Vitest: `npm.cmd run test --workspace @gamify-surgery/player -- roomCutaway.test.ts canonicalRoomShell.test.ts frontDeskV5Architecture.test.ts examinationV3Architecture.test.ts roomVisualLayout.test.ts bitmapAssetManifest.test.ts` — 6 files, 60 tests passed.
- Player typecheck: `npm.cmd run typecheck --workspace @gamify-surgery/player` — passed.
- Player build: `npm.cmd run build --workspace @gamify-surgery/player` — passed (existing Vite chunk-size advisory only).
- Dedicated proof: `npx.cmd playwright test tests/e2e/backed-north-room-walls.spec.ts --project=desktop-chrome` — 1 passed; capture at `artifacts/screenshots/backed-north-room-walls-100-desktop.png`.
- Regression captures refreshed by successful desktop run for
  `top-down-side-wall-caps`, `canonical-enclosed-room-matrix`, and
  `canonical-hallway-edges`; native inspection confirmed thin side caps remain
  and hallway shared/internal circulation remains open.
- `git diff --check` — passed.

- Correction focused Vitest: `npm.cmd run test --workspace @gamify-surgery/player -- canonicalRoomShell.test.ts examinationRoomPresentation.test.ts frontDeskV5Architecture.test.ts examinationV3Architecture.test.ts roomCutaway.test.ts roomVisualLayout.test.ts bitmapAssetManifest.test.ts` — 7 files, 69 tests passed.
- Correction typecheck and production build passed (the existing Vite
  chunk-size advisory remains informational). Dedicated backed-wall Playwright
  passed and its capture was refreshed with the real hallway case; native
  inspection confirmed the added hallway and thin-cap grammar.

## Sol acceptance evidence

- Sol reviewed the actual source diff and all six accepted captures at native
  resolution. The dedicated proof shows fully room-backed, partially
  hallway-backed, exterior, and exact north-door cases without a floating
  decoration or foreground occluder.
- Focused Vitest passed 7 files / 69 tests:
  `roomCutaway.test.ts`, `canonicalRoomShell.test.ts`,
  `frontDeskV5Architecture.test.ts`, `examinationV3Architecture.test.ts`,
  `examinationRoomPresentation.test.ts`, `roomVisualLayout.test.ts`, and
  `bitmapAssetManifest.test.ts`.
- Player workspace typecheck passed.
- Player production build passed for 295 modules; only the existing Vite
  large-chunk advisory was reported.
- The dedicated desktop Playwright proof passed 1/1 and produced
  `artifacts/screenshots/backed-north-room-walls-100-desktop.png`.
- The top-down side-cap, complete Level 0-2 enclosed-room matrix, and hallway
  edge desktop regression suite passed 3/3 and refreshed its accepted captures.
- `git diff --check` passed, and the scoped status review preserved the
  concurrent UI/density work and three pre-existing diagnostic screenshots.
- No gameplay, routing, placement, save, clinical-content, or logical-footprint
  behavior changed. No raster source was modified, and neither Cortan nor local
  image generation was needed for this code-native geometry correction.

Terra worker `short_north_walls` implemented the coupled renderer, tests, and
production proof milestone, then completed Sol's bounded correction for exact
decor support and a genuine hallway-backed proof case. No Spark worker ran
because adjacency/run intersection, depth ordering, and visual acceptance
required renderer judgment. Sol authored the plan, reviewed the actual diff
and native captures, returned the correction, reran all acceptance validation,
and recorded the completion handoff without making substantive implementation
edits.

## Exact next action

The owner should review/playtest the adjacency-aware wall treatment and name a
concrete graphical correction if needed. Keep gameplay and systems requests in
their separate threads. Say **"push to GitHub"** when this local checkpoint
should be backed up or released; no commit, push, or deployment is authorized
or performed here.
