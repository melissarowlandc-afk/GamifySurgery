# Flatten Vertical Room Walls to Top-Down Caps

## Goal

Replace every east/west room-wall presentation with a narrow top-down wall
cross-section. The player should see only the straight upper border/cap of a
vertical wall, never the current upright wall face or its angled north/south
returns. North and south wall appearance, height, component art, depth, and
door behavior must remain unchanged.

This is a graphics-only renderer change. Logical room footprints, allowed
orientations, door legality, collision, routing, saves, progression, balance,
staffing, timing, clinical content, and simulation behavior must not change.

## Scope and visual authority

- Apply the new east/west grammar everywhere the canonical shell is visible:
  Front Desk, both Examination orientations, every enclosed Level 0-2 room,
  and genuinely exposed hallway east/west edges.
- Preserve the deployed north wall and shallow south/front wall exactly.
- Preserve the approved room interiors, floors, furniture, characters,
  planters, wall decoration, labels, selection, and cleanliness layers.
- The owner's instruction is the visual authority: east/west walls read as a
  top-down border cross-section only, with no visible upright/angled face.

## Relevant repository state

- Branch `beta` is synchronized with the deployed graphics checkpoint
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The tracked tree is clean at task start. Three unrelated local screenshot
  diagnostics are untracked and must remain untouched:
  `examination-room-v3-horizontal-north-door-diagnostic.png`,
  `examination-room-v3-vertical-north-door-diagnostic.png`, and
  `five-room-waiting-bathroom-100-vertical-north-door.png`.
- `frontDeskV5Architecture.ts` and `examinationV3Architecture.ts` already
  delegate their component layouts to `getCanonicalRoomShellLayout`, so one
  canonical geometry change can reach Front Desk, Examination, and ordinary
  enclosed rooms.
- `getCanonicalHallwayEdgeComponents` separately reuses the same side geometry
  for actual exposed hallway edges.
- The current `westReturn` and `eastReturn` atlas frames contain the rejected
  upright face and angled ends. The existing Front Desk v3 floor-plate border
  contains straight top-down vertical edge material that can be reused as
  measured atlas crops; no new raster generation is justified.

## Requirements

### Side-cap construction

- Register narrow west/east top-cap frames by measuring straight vertical
  border strips from the existing
  `art/rooms/front-desk-v3/front-desk-architecture-v3.png` floor-plate edge.
  Do not modify the PNG and do not reuse pixels containing an angled return or
  upright wall face.
- Replace canonical east/west `westReturn`/`eastReturn` components with those
  top-cap frames.
- Make the displayed side width a thin cross-section comparable to the top
  border thickness, not the current roughly half-tile side wall.
- Align side caps to `floor.y .. floor.y + floor.height`. Remove the current
  north shoulder and south extension; the unchanged north and south components
  own those horizontal corner regions.
- Retain room skin tinting and the existing base architecture depth. Side caps
  are structural borders, not foreground occluders.

### Doors and joins

- A persisted east/west door removes only its exact wall-slot interval. The
  remaining cap segments stay straight, thin, and aligned to the floor edge.
- Door openings must not leave an upright return fragment, angled shoulder, or
  hidden full-height side sprite beneath the gap.
- Doorless north-east, north-west, south-east, and south-west corners must meet
  cleanly without visible holes or double-thick blocks.
- Room adjacency alone remains unable to create a wall opening.
- Hallways retain only genuinely exposed perimeter caps; connected/internal
  hallway edges remain open.

### Horizontal invariance

- North-wall frame IDs and component bounds must remain unchanged for identical
  input geometry/openings.
- South/front frame IDs, bounds, duplicate front-occluder components, and
  baseline depth behavior must remain unchanged.
- North-wall decoration clipping and exact north-door suppression remain
  unchanged.

## Constraints and non-goals

- No gameplay/domain, placement, pathing, door-rule, save, progression,
  balance, staffing, timing, or clinical-content changes.
- Do not change canonical room interiors or furniture placement.
- Do not change the north-wall height or south/front-wall height.
- Do not edit or regenerate existing raster PNGs.
- Do not use Cortan or local image generation. This task reuses a measured crop
  from existing repository art; if that crop cannot produce a clean cap, stop
  and report the deficiency before any raster request.
- Do not stage, commit, push, deploy, publish, reset, clean, checkout, or delete
  files without explicit owner authorization.

## Implementation design

1. Extend the Front Desk v3 architecture manifest with measured west/east
   top-cap frame descriptors sourced from the straight floor-plate edge.
2. Change only canonical side geometry/frame selection in
   `canonicalRoomShell.ts`: thin width, exact floor-length vertical runs, no
   shoulder extensions, and live-door-subtracted segments.
3. Keep `FacilityScene`'s shared component renderer unless native review proves
   a minimal side-specific integration seam is required. Front Desk,
   Examination, ordinary rooms, and hallways should inherit the change through
   their existing canonical component calls.
4. Add deterministic tests for cap frame use, thinness, exact floor alignment,
   side-door gaps, hallway exposure, common zoom geometry, and unchanged
   north/south components.
5. Add focused 100% desktop captures showing normal corners, east/west doors,
   Front Desk/Examination/five-room coverage, and an exposed hallway cap.

## Milestones and ownership

Use one `terra_worker` writer because crop measurement, shared geometry, corner
joins, and native visual acceptance require renderer judgment.

1. Terra owns the manifest frame additions/tests, canonical side-cap geometry
   and tests, only the smallest necessary `FacilityScene` seam, a dedicated E2E
   spec/captures, and this plan's implementation progress.
2. Sol reviews the actual diff and atlas measurements, inspects all native
   captures, returns any nontrivial correction to Terra, runs integrated
   validation, and updates this plan plus the shared handoff.

## Acceptance criteria

- Every visible east/west wall is a thin straight top-down cap with no upright
  face and no angled end.
- Front Desk, both Examination layouts, all enclosed Level 0-2 rooms, and
  exposed hallway sides share that same cap grammar.
- North and south walls are visually and geometrically unchanged.
- Exact east/west live-door gaps are clear and contain no residual side art.
- All four corner joins are closed and visually clean when no door is present.
- Interior fixtures and live people keep their accepted scale, placement, and
  depth behavior.
- No out-of-scope system or clinical behavior changes.

## Validation

- Focused Vitest for bitmap manifest, canonical room shell, Front Desk v5
  architecture, Examination v3 architecture, room cutaway, and room layout.
- Player workspace typecheck and production build.
- Focused desktop Playwright at 100% scale for normal rooms, explicit side-door
  gaps, and exposed hallway east/west caps.
- Sol native-resolution inspection of every accepted capture.
- `git diff --check` and scoped status/diff review.

## Progress

- [x] Re-read repository instructions and current handoff.
- [x] Confirm the deployed clean checkpoint and preserve three diagnostics.
- [x] Audit canonical, Front Desk, Examination, enclosed-room, and hallway
  component paths.
- [x] Inspect the current v3 architecture atlas and identify reusable straight
  top-down side-border material.
- [x] Implement and validate the shared top-down side-cap grammar.
- [x] Complete Sol review, integrated validation, and handoff.

## Discoveries

- Front Desk and Examination already consume the canonical shell component
  generator; separate architecture rewrites are unnecessary.
- The current side depth comes from both a large canonical `sideWidth` and the
  explicitly angled `westReturn`/`eastReturn` source frames. Both must change;
  shrinking the old frames alone would retain the wrong visual vocabulary.
- Existing v3 floor-plate side borders provide a repository-native source for
  the requested top-down cross-section.
- Measured cap crops are west `{ x: 80, y: 48, width: 31, height: 478 }`
  and east `{ x: 997, y: 48, width: 28, height: 478 }`. Both are isolated
  straight floor-plate borders, outside the separate angled-return art. The
  east crop was tightened from 31 to 28 pixels after an opacity audit showed
  the final three columns were partially transparent/outside artifacts.
- Concurrent UI/divider work currently touches `CANONICAL_DESIGN.md`,
  `AppShell.tsx`, `global.css`, `ui/index.ts`, `WorkspaceSplitter*`, and its
  own plan/captures. It is unrelated and has been preserved without edits.
- Native screenshots show the caps as narrow floor-aligned side strips. The
  full-map hallway capture makes the small exposed end caps necessarily less
  prominent than the room proofs, but confirms the shared runtime path.
- Refreshed 100% evidence includes the dedicated normal and east/west-door
  captures plus the complete Level 0-2 enclosed-room matrix:
  `top-down-side-caps-100-normal-desktop.png`,
  `top-down-side-caps-100-east-west-door-gaps-desktop.png`,
  `canonical-enclosed-room-100-left-desktop.png`, and
  `canonical-enclosed-room-100-right-desktop.png`. Native inspection found a
  clean east cap without the former outside specks/shadow depth; both matrix
  halves retain the shared thin side grammar across the complete inventory.

## Completion evidence

- Sol reviewed the manifest and canonical-shell diff, the dedicated E2E proof,
  and all five refreshed screenshots at native resolution. The side caps are
  straight and floor-aligned, all four doorless joins remain closed, explicit
  east/west doors remove only their wall-slot intervals, and north/south wall
  presentation remains unchanged.
- Focused player Vitest passed **6 files / 55 tests**.
- Player typecheck passed.
- Player production build passed for **295 modules** with only the existing
  large-chunk advisory.
- Desktop Playwright passed the dedicated top-down-cap proof **1/1**, the full
  enclosed Level 0-2 room matrix **1/1**, and the exposed hallway-edge proof
  **1/1**.
- `git diff --check` passed. Scoped review found no gameplay, system, clinical,
  furniture-layout, raster-PNG, or generated-art changes in this milestone.
- Terra worker `top_down_side_walls` implemented the bounded manifest,
  canonical-shell, tests, and capture milestone plus Sol's east-crop
  correction. No Spark worker ran because crop selection, corner joins, and
  visual acceptance required renderer judgment. Sol made no substantive
  implementation edit; it planned, reviewed the actual diff and images, ran
  integrated validation, and completed documentation.

## Exact next action

The owner reviews or remotely playtests the local room-wall presentation and
names a concrete graphics correction if one remains. This checkpoint is not
committed, pushed, or deployed; say **"push to GitHub"** when backup or release
is desired. Keep gameplay and systems requests in their separate threads.
