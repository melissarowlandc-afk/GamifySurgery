# Refine shared walls and remove doorway seams

## Goal

Make the surgery-center map read as one coherent cutaway building. Persisted
doorways must contain floor material only, with zero wall, baseboard, framed
floor edge, shadow, threshold, or Build Mode grid line across the connection.
Closed shared north boundaries use one very short baseboard-plus-wallpaper
wall, exposed north boundaries retain the accepted tall wall, and closed
east/west shared boundaries use one thick top-down cap centered exactly on the
global tile border.

This is a graphics-only renderer milestone. It must not change room or hallway
footprints, door records or legality, collision, routing, actor movement,
placement, saves, costs, timing, progression, staffing, clinical content, or
any other gameplay/system behavior.

## Requirements

### Floor-only persisted doorways

- At every persisted room-to-room and room-to-hallway doorway, the two existing
  floor materials touch directly at the exact global tile boundary.
- A doorway span contains no dark outline, rim, baseboard, wallpaper, wall cap,
  threshold, sill, jamb, shadow strip, or other non-floor pixel.
- The Front Desk must stop deriving its visible floor perimeter from the framed
  `floorPlate` edge. Preserve its accepted five-by-four tile surface and fixture
  coordinates using a borderless existing-art crop or equivalent renderer-native
  surface; do not edit the source PNG.
- Procedural and authored room floor surfaces extend to the complete logical
  room rectangle. Any perimeter treatment is wall decoration and belongs only
  to door-subtracted shell components.
- Build Mode may retain its useful construction grid, highlights, and candidate
  affordances, but its global boundary line must be clipped from the complete
  persisted doorway span. Normal play and Build Mode must show the same empty
  architectural aperture.
- Reuse `getRoomDoorOpenings`, which already returns direct and reciprocal
  apertures, as the renderer source of truth. Do not restore a late door-cover
  or floor-color erase pass that would obscure either room's actual material.

### Shared north-wall grammar

- For every north-edge tile of a room that has a constructed room or hallway
  immediately north, keep one short wall unless that exact tile is a persisted
  doorway.
- The short wall is materially a wall: a baseboard with only a tiny strip of
  the southern/source room's wallpaper above it. It must be substantially
  shorter than the current south/front lip and must not read as a floor rim.
- The short wall is anchored at the shared boundary and stays within the
  southern/source room's visual side. It never blocks the northern floor,
  furniture, people, or wall art and never becomes a foreground occluder.
- A backed north doorway removes the complete short-wall segment, including
  every baseboard and wallpaper pixel.
- A north segment with no constructed space immediately north retains the
  complete accepted tall north wall, dimensions, art, and decor rules.
- Tall north-wall decor remains supported only by surviving tall wall-face
  runs. Do not move or crop decor onto a short wall.
- A horizontal constructed-space boundary must not accumulate a second
  overlapping south/front wall from its northern neighbor. The visible closed
  boundary is one short wall; the reciprocal doorway is completely open.
- Preserve open hallway-to-hallway circulation. Room/hallway boundaries remain
  closed by a wall unless a persisted doorway opens them.

### Shared east/west partition grammar

- A closed side-by-side room/room or room/hallway boundary has exactly one
  top-down vertical partition cap, centered on the exact global tile border.
- Use the accepted Front Desk top-down cap language and total thickness. Do not
  draw one full-width cap inside each neighboring floor or otherwise produce a
  doubled/off-center partition.
- A persisted east/west doorway removes the full partition interval from both
  sides. No thin grid line or hidden cap may remain in the opening.
- Partial adjacency and partial door coverage change at exact logical tile
  boundaries. Multi-tile runs must not create doubled joins, gaps, or texture
  bleed.
- Exposed exterior east/west edges retain the accepted top-down cap treatment.
- Hallway-to-hallway internal edges remain open circulation with no partition.

## Constraints and non-goals

- Preserve the Front Desk five-by-four footprint and fixture/actor positions,
  Examination orientation layouts, all room furniture and characters,
  planters, sidewalk lane, floor identities, cleanliness, selection, labels,
  and the accepted exposed-wall appearance.
- Different rooms may retain different floor colors or patterns; direct
  continuity means no non-floor material lies between them.
- Do not alter door destination resolution, placement/removal interactions,
  navigation, collision, or save data.
- Do not redesign interiors or create new raster art. Existing repository art
  and renderer-native geometry are sufficient, so do not use Cortan or local
  image generation. A measured manifest crop from an existing atlas is allowed
  only when it does not modify the source raster.
- Preserve all unrelated dirty management-mode, workspace-divider, density,
  clinical, and other concurrent work. Preserve the three protected diagnostic
  screenshots. Do not reset, clean, broadly stage, revert, or rewrite shared
  work.
- Do not commit, push, merge, deploy, publish, or release.

## Relevant repository state

- Branch `beta` tracks `origin/beta`; the deployed graphics baseline remains
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The immediately preceding local graphics milestone made door apertures a full
  tile, removed explicit thresholds/frames, and added reciprocal destination
  openings. It is complete but intentionally uncommitted.
- `canonicalRoomShell.ts` currently uses the full south/front facade frame and
  approximately 0.44-tile `frontHeight` for backed north runs. That is far too
  tall for the newly specified baseboard-plus-tiny-wallpaper strip.
- Canonical west/east caps are currently placed entirely inside each room.
  Side-adjacent rooms therefore paint two near-boundary caps; a room/hallway
  boundary paints one off-center room cap.
- `frontDeskV5Architecture.ts` requests `includeFloor=true`, so its framed
  `floorPlate` survives independently of wall openings and leaves perimeter
  pixels across otherwise open door slots.
- Other room floors use an inset of `max(3, tileSize * 0.09)` for both
  procedural and authored surfaces. The leftover perimeter band is floor-owned
  and therefore not door-aware.
- In Build Mode, `drawBuildGridOverlay` draws every global tile boundary over
  the finished architecture. It can reintroduce a one-pixel line through a
  persisted aperture.
- `getBackedHorizontalBoundaryRuns` and exact door-subtracted canonical wall
  runs already provide correct logical north adjacency. `getRoomDoorOpenings`
  already provides direct plus reciprocal openings.

## Decisions already made

- Treat baseboards as wall decoration only. Floor renderers will provide
  borderless material to the complete logical rectangle; wall components own
  every visible perimeter treatment.
- Preserve actual material transitions at door seams rather than repainting a
  generic bridge or extending one room's flooring into another.
- Replace the backed-north reuse of the complete front facade with a genuinely
  shallow semantic wall presentation tinted from the source room.
- Represent a shared vertical partition once, centered on the global boundary,
  using deterministic ownership or two coordinated half-caps. Either approach
  must produce exactly one accepted-width partition and one full door gap.
- Keep hall-to-hall internal circulation open. A room-to-hall boundary follows
  the same closed-unless-door grammar as room-to-room.
- Clip only the persisted doorway spans from Build Mode boundary lines; retain
  the remaining construction grid and interaction overlays.

## Milestone and ownership

This is one coupled renderer/proof milestone for a `terra_worker`. It combines
atlas-aware floor presentation, shared-boundary ownership, reciprocal opening
clipping, depth ordering, pure geometry tests, and native visual acceptance;
it is not a mechanical Spark transformation.

Terra owns the smallest necessary edits in:

- `apps/player/src/facility/canonicalRoomShell.ts` and focused tests;
- `apps/player/src/facility/roomCutaway.ts` and focused tests for shared vertical
  adjacency/ownership if needed;
- `apps/player/src/facility/frontDeskV5Architecture.ts`, its focused tests, and
  a narrow existing-atlas manifest crop/test only if needed for a borderless
  Front Desk surface;
- narrow graphics-only integration in `apps/player/src/facility/FacilityScene.ts`;
- focused door/grid/shared-boundary pure helpers and tests if extraction keeps
  the scene integration deterministic;
- one dedicated 100% desktop browser proof, including normal and Build Mode,
  plus intentionally refreshed affected wall/door regression captures;
- implementation evidence and progress in this plan.

Sol owns product interpretation, dirty-tree protection, actual diff review,
native-resolution visual acceptance, any correction request, independent
validation, graphics art-direction/handoff closure, and final acceptance.

## Acceptance criteria

- Every persisted room/room and room/hall doorway shows one floor texture
  touching the other with zero non-floor pixels across the complete tile span,
  both in normal play and Build Mode.
- The Front Desk retains a coherent five-by-four tiled floor without a framed
  floor edge crossing any north/south/east/west opening.
- All other authored/procedural floors reach their logical edges; no inset rim
  masquerades as a baseboard.
- Every backed north tile has exactly one very short, room-tinted
  baseboard-plus-wallpaper wall unless its exact door slot is open.
- Every exposed north tile retains the accepted full tall wall.
- No tall-wall decor appears on backed or door-open north spans.
- Every closed room/room or room/hall vertical boundary has one accepted-width
  cap centered on the tile border; a door removes it completely.
- Hall/hall circulation remains open, and exposed east/west caps remain
  visually unchanged.
- Closed wall corners and partial runs remain continuous without doubles,
  holes, shadows, or texture bleed.
- No gameplay/domain, clinical, raster-source, furniture-layout, or save-data
  file changes occur.

## Validation

- Focused player Vitest for canonical shell, room cutaway/shared boundaries,
  Front Desk v5, Examination v3, door presentation, and any new floor/grid
  geometry helper.
- Player workspace typecheck and production build.
- Dedicated desktop Chrome proof at 100% showing horizontal and vertical
  room/room doors, room/hall doors, same-destination wide doors, distinct
  destinations, closed shared boundaries, backed short north walls, exposed
  tall north walls, and the same apertures with Build Mode grid visible.
- Existing Front Desk four-row/door-run, top-down side-cap, backed-north-wall,
  full canonical-room matrix, and canonical-hallway desktop regressions.
- Sol native-resolution inspection of every accepted/refreshed capture.
- `git diff --check` and scoped status/diff audit against the concurrent tree.

## Progress

- [x] Re-read repository instructions, current handoff, and dirty shared tree.
- [x] Confirm that no prior write worker is active.
- [x] Complete the read-only floor, shell, hallway, Build Mode, and draw-order
  audit.
- [x] Record the corrected floor/baseboard/shared-wall contract.
- [x] Delegate and implement the bounded renderer milestone.
- [x] Complete Sol diff/native-proof review, independent validation, and
  graphics handoff.

## Discoveries

- The prior reciprocal wall cutouts are structurally correct. The visible dark
  seam now comes from floor-owned perimeter pixels/rims rather than an explicit
  door overlay.
- The Front Desk framed `floorPlate` is the primary normal-play seam source.
  Other rooms' 3+ pixel inset floor surfaces create the equivalent rim.
- Build Mode independently repaints every tile boundary after room rendering,
  so it requires exact persisted-door clipping even after normal floors are
  corrected.
- Hallway flooring already fills its complete rectangle. Room/hallway seams are
  caused by the room-side surface and boundary components, not a hallway floor
  outline.
- The existing Front Desk `floorPlate` can be omitted entirely: the renderer's
  native five-by-four material preserves the logical floor while removing the
  raster's framed perimeter from every doorway.
- One east-edge owner is sufficient for closed shared vertical partitions;
  west edges retain only exposed caps, and hallway-to-hallway edges remain
  unowned/open. The cap is centered on the global border by half its width.
- Build-grid cuts can be generated directly from the reciprocal presentation
  openings without changing any persisted door record or interaction geometry.
- Correction review found that Front Desk's normal floor branch deliberately
  suppresses tiles whenever v4 art is available; the v5 call now explicitly
  requests its borderless native tile pattern. Shared horizontal edges also
  require ownership subtraction on the northern neighbor's south lip.

## Implementation evidence

- Replaced the floor-owned inset in procedural and authored room floors with
  complete logical rectangles. Front Desk v5 now draws the native five-by-four
  floor and omits the framed `floorPlate` atlas component.
- Added a shallow backed-north shell component (0.10 tile high) and retained
  the tall north face only for exposed runs.
- Added deterministic single-owner vertical cap runs, complete reciprocal
  door subtraction, and Build Mode grid-line cuts for every presentation
  aperture.
- Focused Vitest: 5 files, 47 tests passed. Player typecheck passed. Player
  production build passed (existing chunk-size warning only). `git diff
  --check` passed.
- Existing backed-north adjacency and reciprocal-opening helpers can remain the
  logical truth; the presentation and shared-edge ownership are what must
  change.
- Correction pass: Front Desk v5 now forces its five-by-four native tile grid
  without the raster frame. Canonical shells suppress south lips on backed
  segments; hallways render owned short-north strips and use the same centered
  vertical owner runs. Added room-room, room-hall, hall-hall, and door-gap
  pure ownership coverage (50 focused tests total).
- Expanded `door-cutout-floor-continuity.spec.ts` now asserts its controlled
  state contains the Front Desk/Exam/Waiting/Minor/hallway fixture and the
  three north-door runs, asserts Build Mode navigation is visible before its
  Build screenshot, and writes both normal and Build 100% desktop proofs:
  `door-cutout-floor-continuity-100-desktop.png` and
  `door-cutout-floor-continuity-build-100-desktop.png`.
- Final proof correction adds the visible east-side cluster: two vertically
  adjacent hallway instances west of an Examination room, with the upper
  east-slot persisted door and the lower slot closed. The same two hall cells
  share an unpartitioned boundary. Their exact IDs, coordinates, and door
  record are asserted before reload; both normal and Build captures were
  refreshed and inspected at native resolution.

## Sol acceptance evidence

- Sol reviewed the actual renderer, geometry-helper, unit-test, and browser-
  proof diff. The first visual pass was rejected because the Front Desk floor
  lost its visible five-by-four tile pattern, the northern neighbor still
  duplicated the shared horizontal lip, and the hallway-west-of-room case did
  not own a centered vertical partition. Terra corrected all three issues.
- Sol rejected the first corrected proof as incomplete because it did not show
  the hallway-west-of-room asymmetry or open hallway-to-hallway case. Terra
  added an asserted east-side proof cluster covering the open door, closed
  centered cap, and open hall/hall boundary in both normal and Build Mode.
- Sol inspected the final normal and Build captures at native resolution,
  including diagnostic nearest-neighbor crops, and inspected the refreshed
  Front Desk, backed-north, side-cap, hallway, and canonical-room regression
  captures. The accepted dedicated proofs are
  `door-cutout-floor-continuity-100-desktop.png` and
  `door-cutout-floor-continuity-build-100-desktop.png`.
- Independent focused Vitest passed 5 files / 50 tests. Player typecheck passed.
  The player production build passed for 298 modules with only the existing
  chunk advisory. The six-spec desktop Chrome matrix passed 6/6 in 2.0 minutes.
  `git diff --check` passed before documentation closure and is rerun after it.
- No gameplay/domain, clinical, save, routing, raster-source, furniture-layout,
  or interaction behavior changed. Cortan and local image generation were not
  used. Nothing was staged, committed, pushed, deployed, or released.

## Exact next action

The owner should review or playtest the local normal and Build Mode doorway
presentation and name any concrete graphics correction. Say `push to GitHub`
when this checkpoint should be backed up; no commit or push is authorized yet.
