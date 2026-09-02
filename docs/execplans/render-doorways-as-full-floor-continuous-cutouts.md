# Render doorways as full floor-continuous cutouts

## Goal

Make every persisted doorway read as a complete cutout of its exact wall tile.
Across the walkable opening, the room floor must meet the adjacent room,
hallway, or exterior walking surface directly, with no threshold, sill, door
leaf, header, frame strip, or wall material painted over the path.

## Requirements

- One persisted door removes the complete one-tile wall segment identified by
  its side and offset, on north, south, east, and west walls.
- North openings remove the wall from the floor contact line through the full
  visible rear-wall face. South openings remove the complete low front-wall
  segment. East/west openings omit the complete top-down cap segment.
- Existing floor patterns remain authored by their own room or hallway. At the
  doorway they meet directly at the shared tile edge; do not repaint a generic
  threshold or extend one room's material over the other.
- Consecutive doors into the same destination remain one uninterrupted wide
  cutout. Consecutive doors into different destinations remain understandable
  from the real destination boundary/floor transition, without painting a
  synthetic strip across either walkable slot.
- The protected Front Desk exterior entrance follows the same cutout grammar:
  its room floor meets the sidewalk directly. Keep the accepted planters and
  sidewalk walk lane.
- Build Mode candidate/highlight overlays may remain visible as interaction
  affordances. Once a door is persisted, its underlying architecture must be
  the full cutout described above.

## Constraints and non-goals

- Graphics/presentation only. Do not change door legality, placement/removal,
  room or hallway footprints, collision, route finding, actor movement, saves,
  costs, progression, timing, clinical content, or gameplay behavior.
- Do not unify different rooms into one literal flooring material. “Continuous”
  means the two existing floor planes touch without wall/threshold material;
  their palette or pattern may change at the boundary.
- Preserve the accepted canonical tall/shallow north-wall behavior, thin
  top-down side caps, Front Desk 5-by-4 floor and fixture layout, Examination
  geometry, five-room interiors, landscaping, and destination-aware door data.
- Preserve all unrelated dirty management-mode, workspace-divider, density,
  clinical, and other concurrent work. Preserve the three protected diagnostic
  screenshots. Do not reset, clean, broadly stage, or rewrite shared files.
- Reuse existing renderer/floor art. Do not modify source rasters and do not use
  Cortan or local image generation.
- Do not commit, push, merge, deploy, or release.

## Relevant repository state

- Branch `beta` tracks `origin/beta`; the deployed graphics baseline remains
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The shared graphics worktree is intentionally dirty with completed local room
  shell, Front Desk, side-cap, shallow-wall, and room-interior checkpoints.
- `getCanonicalRoomWallRuns` currently subtracts only 68% of a door tile,
  leaving wall shoulders inside the requested segment.
- Rooms and hallways already paint their own floors before wall components.
  Canonical shells then draw only wall strips because room-specific callers use
  `includeFloor=false`; therefore a full wall subtraction naturally exposes the
  two existing floor planes at their shared edge.
- `FacilityScene.drawExplicitDoor` runs after rooms and repaints persisted
  openings with floor-colored bridges, paper threshold lines, headers, sills,
  and endpoint jambs. That late overlay is the primary reason current doors do
  not look like empty cutouts.
- The Front Desk exterior entrance has a separate late threshold/shadow/jamb
  paint path in `drawExterior`; it is not handled by `drawExplicitDoor`.
- Hallway internal adjacency already omits hallway perimeter walls. A room-side
  full-tile aperture is sufficient for direct room-to-hall floor continuity.

## Decisions already made

- Change the shared canonical aperture from 0.68 tile to exactly 1 tile rather
  than widening only a Front Desk special case.
- Stop drawing permanent explicit door material over persisted internal
  openings. Canonical shell subtraction owns the architecture.
- Remove the Front Desk exterior threshold/shadow/jamb overlay while preserving
  the entrance gap, sidewalk, and planters.
- Keep Build Mode interaction geometry and candidate highlighting separate from
  persisted architecture.
- Preserve the pure destination-resolution helper unless its narrow renderer
  integration becomes unnecessary; do not let it reintroduce a threshold or
  frame across a walking path.

## Milestone and ownership

This is one coupled renderer milestone for a `terra_worker` because the shared
wall geometry, late scene overlays, exterior entrance, exact unit expectations,
and multi-orientation browser proof must change together.

Terra owns the smallest necessary edits in:

- `apps/player/src/facility/canonicalRoomShell.ts` and focused tests;
- narrow canonical aperture expectation updates in Front Desk and Examination
  architecture tests when required;
- the persisted-door and exterior-entrance presentation seams in
  `apps/player/src/facility/FacilityScene.ts`;
- `doorPresentation.ts` / its test only if required to preserve or retire its
  narrow visual integration cleanly;
- one dedicated desktop E2E and task-specific native capture(s) proving full
  north/south/east/west, room-to-room, room-to-hallway, wide, distinct-
  destination, and protected-exterior openings;
- intentionally refreshed existing cap/wall regression captures only where the
  shared geometry changes their accepted output; and this plan's implementation
  evidence.

Sol owns product interpretation, plan/dirty-tree protection, actual diff
review, native-resolution visual acceptance, correction requests, independent
validation, handoff closure, and final acceptance.

## Acceptance criteria

- A one-tile persisted doorway has exactly a one-tile empty wall interval.
- No permanent line, rectangle, threshold, header, sill, door leaf, or frame
  crosses any opening's walkable floor surface.
- North/south and east/west room-to-room openings visibly join the two floor
  surfaces at their exact boundary.
- Room-to-hallway openings visibly join the room floor directly to the hallway
  floor pattern with no wall/cap/threshold between them.
- Two consecutive same-destination doors form one clean two-tile opening.
  Consecutive distinct-destination doors do not gain wall material inside
  either slot and remain legible from the true destination boundary.
- The protected Front Desk entrance is a full one-tile south-wall cutout with
  room floor meeting sidewalk; planters and sidewalk navigation lane remain
  visually intact.
- Closed wall segments remain continuous, and no accepted north-wall height,
  side-cap, room fixture, character occlusion, or Build Mode interaction
  behavior regresses.
- No gameplay/domain or raster source file changes occur.

## Validation

- Focused Vitest for canonical room shell, Front Desk/Examination architecture,
  side caps, backed north walls, and any retained destination helper behavior.
- Player workspace typecheck and production build.
- Dedicated 100% desktop Chrome full-cutout proof with deterministic persisted
  doors covering every orientation and adjacency class.
- Existing Front Desk door-run, top-down side-cap, backed-north-wall, complete
  canonical room matrix, and canonical hallway visual regressions as affected.
- Sol native-resolution inspection of every accepted/refreshed proof.
- `git diff --check` and scoped status/diff audit against the concurrent tree.

## Progress

- [x] Read repository instructions, current handoff, and dirty shared worktree.
- [x] Complete a read-only audit of shell subtraction, late door overlays,
  exterior entrance art, floor ordering, hallway edges, and Build Mode layers.
- [x] Record the full-tile cutout and direct-floor-seam contract.
- [x] Delegate and implement the bounded renderer/proof milestone.
- [x] Complete Sol diff/native-proof review, independent validation, and
  handoff.

## Discoveries

- The floors are already continuous geometrically. Current discontinuity is
  presentation material drawn after the floors, not a missing floor or domain
  adjacency defect.
- Raw full-tile adjacent apertures merge automatically. Actual neighboring
  room geometry and floor transitions should express distinct destinations;
  an artificial threshold is neither necessary nor permitted.
- Hallway exposed-edge helpers draw only true exterior perimeter runs, so they
  should not need a new interior-door special case.
- The placement ghost's decorative door preview is not persisted architecture
  and may remain as an interaction affordance unless native proof shows it
  obscures the persisted result.
- The shared canonical subtraction now removes exactly one tile per persisted
  offset; adjacent offsets naturally become a single uninterrupted aperture,
  without consulting destination identity or painting a seam back in.
- `FacilityScene` no longer runs a post-room persisted-door painting pass, and
  the Front Desk exterior path no longer paints its threshold/shadow/jamb.
- Correction: target shells now receive a renderer-only reciprocal aperture
  for each non-exterior door that lands in them. This removes the destination
  room's opposite wall/cap without altering saved door records or legality.
- The deterministic browser proof covers Front Desk north same-destination and
  distinct-destination adjacency, east/west room joins, its protected south
  exterior door, plus a Minor Procedure-to-hallway north join.

## Terra implementation evidence

- Exact geometry tests cover complete N/S/E/W tile removal, first/last slots,
  backed north short-wall runs, adjacent offsets, and closed-wall continuity.
- Focused player Vitest passed: 4 files, 30 tests.
- Player typecheck and production build passed (296 modules; only the existing
  bundle-size advisory).
- Desktop Chrome cutout proof passed and wrote
  `artifacts/screenshots/door-cutout-floor-continuity-100-desktop.png`.
- The affected desktop graphics matrix completed after the implementation:
  backed-north walls, canonical enclosed-room matrix, canonical hallway edges,
  Front Desk door runs, side caps, and the dedicated cutout proof. Refreshed
  captures were inspected at native resolution by Terra.
- `git diff --check` passed. No domain/gameplay, source-raster, commit, push,
  deploy, Cortan, or image-generation change was made.
- Reciprocal-opening correction validation: focused Vitest passed (4 files,
  33 tests), typecheck and production build passed (298 modules; existing
  bundle-size advisory only), and the affected six-spec desktop matrix passed
  (`test-results/.last-run.json`: `passed`). The refreshed dedicated proof was
  inspected at native resolution.

## Sol acceptance evidence

- Reviewed the actual renderer and test diff. The canonical aperture is exactly
  one tile, the late persisted-door and exterior-trim paint paths are gone, and
  `getDoorPresentationOpenings` mirrors each non-exterior door onto the
  destination room's opposite shell without changing the saved door record.
- Rejected the first visual pass because destination room walls still crossed
  room-to-room openings. Terra completed the bounded reciprocal-shell
  correction; the refreshed proof now removes both wall faces/caps.
- Inspected the dedicated proof and all refreshed Front Desk, side-cap,
  backed-wall, canonical-room, and hallway captures at native resolution. The
  room-to-room, room-to-hallway, vertical, horizontal, wide, distinct-
  destination, and protected-exterior seams are clean. Floor patterns touch
  directly, and no threshold/frame material crosses a walkable slot.
- Independently reran focused Vitest: **4 files / 33 tests passed**.
- Independently reran the player typecheck: passed.
- Independently reran the production build: **298 modules** transformed; only
  the existing large-chunk advisory remains.
- Independently reran the six-spec desktop Chrome graphics matrix: **6/6
  passed** in 2.0 minutes.
- Final `git diff --check` passed after completion documentation. No gameplay,
  domain, raster-source, Cortan, image-generation, commit, push, or deployment
  change occurred.

## Exact next action

The owner should review/playtest persisted doorways in Build Mode and ordinary
play. Continue here only for a concrete graphics correction; door legality,
routing, and all other systems remain in their separate threads. Say **"push
to GitHub"** when this local checkpoint should be backed up or released; no
commit, push, or deployment is authorized.
