# Rebuild the Examination Room

## Goal

Replace the current generic Examination Room presentation with a coherent,
repo-native cutaway room that matches the accepted Front Desk shell and the
owner reference at
`Photos for Codex/exec-25eb6189-3c71-411c-9b07-668566332848.png`.
The live room must have a deliberately composed horizontal 3-by-2 view and a
vertical 2-by-3 view rather than stretching or mechanically rotating one
furnished image.

## Requirements

- Rebuild the room's baseline walls, floor, side returns, low front edge,
  shadows, and thresholds in the same visual family as Front Desk v4.
- Map the authored floor exactly to the existing logical footprint. Wall
  height and exterior shadow may extend beyond it; floor area may not.
- Keep the world-north wall visually north in both supported orientations.
- Provide separately composed 0-degree (3-by-2) and 90-degree (2-by-3)
  presentations.
- Enlarge and ground the existing independent Examination Room fixtures so
  they read like the reference: exam table, sink cabinet, rolling stool,
  waste bin, diagnostic tools, glove dispenser, and optional anatomy chart.
- Keep at least one fixture-clear legal door position on north, east, south,
  and west walls for both orientations.
- Doors remain separate zero-cost build objects. The baseline room must not
  contain an automatic interior door.
- Wall-mounted art remains on the exposed world-north wall. The anatomy chart
  may be omitted where a valid north-wall door or insufficient exposed wall
  run leaves no safe location.
- Preserve existing room dimensions, placement orientation values, routes,
  collision/navigation data, upgrade logic, cleanliness, characters, saves,
  gameplay, and balance.

## Constraints and non-goals

- Do not flatten the furnished reference into a room background. Architecture,
  fixtures, characters, doors, trash, and click targets remain independent.
- Do not redesign the Front Desk or any other room.
- Do not add a curtain, scale, paper-towel dispenser, visitor chair, or new
  gameplay object.
- Do not change room costs, service times, progression, clinical content, or
  routing rules.
- Preserve all unrelated work in the dirty shared working tree.

## Relevant repository state

- Room definition: `room.examination`, base footprint 3-by-2, orientations 0
  and 90.
- Current architecture is the generic procedural floor and `drawRoomShell`
  path in `apps/player/src/facility/FacilityScene.ts`.
- Current fixture art is
  `apps/player/public/art/rooms/level-1-v1/examination-fixtures-v1.png`.
- Current fixture placement is the `room.examination` branch in
  `FacilityScene.drawRoomFixtures`.
- Door presentation metadata lives in
  `apps/player/src/facility/roomVisualLayout.ts`.
- Front Desk v4 provides the accepted coherent-shell mapping pattern.

## Decisions already made

- Reference image is the closest approved Examination Room design.
- The horizontal composition places the rear sink to the left, diagnostic
  wall items along the exposed north wall, a large central/right exam table,
  a left-center stool, and a southeast waste bin while leaving every wall with
  a door-clear span.
- The vertical composition keeps the sink rear-left, north-wall diagnostic
  items, a large central/lower exam table, upper-center stool, and southwest
  waste bin while leaving every wall with a door-clear span.
- Rotation changes the floor footprint and furniture composition; the
  cutaway/north wall itself never rotates away from screen north.

## Milestones

1. Add a tested orientation-specific Examination Room presentation contract
   and coherent architecture assets/atlas metadata.
2. Integrate the two shell mappings and enlarged independent fixtures into the
   live renderer without changing domain behavior.
3. Add focused unit and actual-application visual proofs for both orientations
   and build-mode door-clear highlighting.
4. Run focused tests, typecheck, build, browser proof, and diff hygiene checks.

## File or module ownership

The assigned Terra worker owns only the Examination Room visual slice:

- versioned Examination Room assets under `apps/player/public/art/rooms/`;
- Examination Room presentation/layout helpers and focused tests under
  `apps/player/src/facility/`;
- Examination Room atlas metadata in
  `apps/player/src/art/bitmapAssetManifest.ts` and its focused tests;
- the Examination Room branches/render seam in
  `apps/player/src/facility/FacilityScene.ts`;
- focused Examination Room browser proof under `tests/e2e/`;
- this ExecPlan's progress and discoveries.

## Acceptance criteria

- Horizontal and vertical live rooms visibly match the accepted Front Desk
  shell family and the supplied reference's density, scale, and perspective.
- Neither orientation uses the generic procedural room floor or generic shell
  when the authored architecture asset is available.
- Floors map to exactly 3-by-2 and 2-by-3 logical rectangles.
- Furniture is larger, fully visible, grounded, independently layered, and
  leaves traversable approaches.
- Each orientation has at least one render- and fixture-clear door candidate
  on every wall; build-mode highlights correspond to those candidates.
- Explicit doors, actors, selection, cleanliness, and upgrade visuals remain
  functional and correctly layered.
- No unrelated gameplay or art changes are introduced.

## Validation

- Focused Vitest for Examination Room presentation, room visual layout, atlas
  metadata, and any renderer helpers.
- `npm run typecheck`
- `npm run build`
- Focused Playwright capture at the standard desktop viewport showing the
  horizontal room, vertical room, and build-mode legal-door highlighting.
- Inspect the produced screenshots, not only test exit codes.
- `git diff --check`

## Progress

- [x] Inspected the supplied Examination Room reference.
- [x] Compared the accepted Front Desk v4 live shell and rendering contract.
- [x] Confirmed the current 3-by-2 / 2-by-3 domain footprint and existing
  four-wall door-zone metadata.
- [x] Implement orientation-specific architecture and presentation.
- [x] Integrate the live room and capture actual-app horizontal, vertical,
  and Build Mode/Place Door views.
- [x] Re-author the shell material using warm-neutral clinical tiles, trim,
  baseboards, plaster texture, bevels, and contact shadows.
- [x] Replace the same-page orientation proof with fresh-page hydrated-state
  assertions for 0-degree 3-by-2 and 90-degree 2-by-3 room instances.
- [x] Assert at least one fixture-clear candidate on north, east, south, and
  west walls in both approved footprints.
- [x] Refine the rear wall to a light textured-plaster face nested within the
  retained dark cutaway frame, with trim, bevel, and baseboard.
- [x] Split normal-composition and Build Mode browser proofs; both now pass
  after fresh hydration and post-remount page-level capture.
- [x] Sol reviewed the actual horizontal, vertical, and Build Mode screenshots
  plus the independent focused tests, typecheck, production build, browser
  proof, and diff hygiene evidence.

## Discoveries

- The current Examination Room still travels through the generic procedural
  floor/shell branch, unlike the accepted Front Desk v4.
- Current authored fixture artwork is reusable, but its live placement ratios
  make the room read as small and sparse.
- A single mechanically rotated furnished bitmap would rotate the dollhouse
  wall and wall fixtures incorrectly; the two layouts must be explicit.
- Examination v2 uses two transparent 960px shell assets. Their measured
  floor rectangles map respectively to 3-by-2 and 2-by-3 room rectangles;
  the rear wall, shallow side returns, shadow, and low foreground lip remain
  visual envelope only. Fixtures, doors, characters, trash, and targets are
  still independently rendered.
- The vertical composition intentionally omits the anatomy chart. It keeps
  the diagnostic panel and glove dispenser on its narrower world-north wall
  and protects a clear north-wall entry run rather than rotating wall art onto
  a side wall or floor.
- A page-hide/debounced saver can overwrite an orientation mutation after a
  same-page reload. The browser proof instead writes controlled profile state
  from a source page, hydrates it in a fresh sibling page, and asserts the
  persisted orientation plus derived footprint before capture.
- Build Mode remounts the facility frame, so a post-toggle screenshot must
  reacquire that element rather than use a stale locator.
- The controlled fixture derives the room position from the persisted Front
  Desk: it is centered across its five-tile width and immediately north at
  both 3-by-2 and 2-by-3 authored footprints.

## Exact next action

Owner visual review in the running prototype. No further Examination Room work
is required unless that walkthrough identifies a concrete visual adjustment.
