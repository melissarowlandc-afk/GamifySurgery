# Unify All Room Wall Heights

## Goal

Make every constructed room and hallway use the accepted Front Desk v4 wall
height at the same facility tile scale. Preserve room-specific wall/floor
materials, footprints, furniture, doors, routing, and gameplay.

## Requirements

- Treat the measured Front Desk v4 north-wall envelope as the sole wall-height
  source of truth for every current room definition and hallway.
- Wall height must depend only on facility tile scale, never room depth,
  orientation, footprint, room type, or upgrade tier.
- Apply the same height to exposed north-wall rendering, north-wall doors,
  wall-mounted decor projection/clipping, Build Mode wall targeting, placement
  previews where applicable, and camera/world bounds.
- Preserve boundary-aware behavior: a wall appears only on exposed world-north
  runs, and partial coverage removes only the covered run without stretching
  the remaining wall.
- Preserve the accepted Front Desk appearance and the corrected Examination /
  Front Desk adjacency behavior.
- Preserve every room's existing wall-face color/texture, floor material,
  dimensions, furniture, fixtures, upgrade visuals, and explicit doors.
- Include hallways whenever they are the northmost constructed space.
- Cover all currently implemented Level 0, Level 1, and Level 2 room types.

## Constraints and non-goals

- No gameplay, balance, progression, clinical-content, save-schema, routing,
  pathfinding, or room-footprint changes.
- Do not redesign furniture, characters, landscaping, HUD, or room palettes.
- Do not flatten interactive objects into room backgrounds.
- Preserve unrelated work in the heavily modified shared working tree.

## Relevant repository state

- `SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles` is derived from the
  accepted Front Desk v4 source (`242px / (622px / 4 tiles)`).
- Front Desk and horizontally adjacent Examination rooms can already use the
  source-derived surgery-center component renderer.
- Generic rooms and hallways currently call `getRearWallFaceHeight`, which
  varies with room pixel height and caps the face at roughly 0.48 tile, so
  their total walls are materially shorter.
- North-door height, wall decor, and wall hit targets depend on the generic
  wall-height helper and must be updated with the rendered wall.

## Decisions already made

- The current Front Desk wall height is authoritative.
- Height is shared; room materials and contents remain room-specific.
- A northern neighbor suppresses the covered wall rather than changing floor
  dimensions or compressing the remaining wall art.

## Milestones

1. Add a single tested Front Desk-derived wall-height projection for all room
   types at a given tile scale.
2. Route generic rooms and hallways, north doors, wall decor, hit targets, and
   camera bounds through that projection without changing materials/content.
3. Remove or bypass any isolated authored-shell path whose visible wall height
   conflicts with the shared contract while retaining its independent floor
   and fixtures.
4. Add actual-app Level 1 and Level 2 visual proofs containing every currently
   available room type, plus adjacency and Build Mode coverage.
5. Run focused regressions, typecheck, build, browser proofs, and diff hygiene;
   Sol reviews the actual screenshots and diff.

## File or module ownership

The assigned Terra worker owns only:

- shared wall geometry and cutaway helpers/tests under
  `apps/player/src/facility/`;
- the minimal `FacilityScene` rendering/camera/door-target integration;
- focused bitmap/presentation tests if an authored-shell seam changes;
- focused Level 1/Level 2 actual-app proof under `tests/e2e/` and generated
  screenshots under `artifacts/screenshots/`;
- `docs/features/visual-art-direction.md` and this ExecPlan.

## Acceptance criteria

- A pure regression test enumerates every current room definition plus hallway
  and proves one identical Front Desk-derived north-wall envelope at equal
  tile scale.
- No generic room height calculation depends on footprint depth.
- Exposed north doors, wall decor, and wall hit targets align to the same
  rendered height.
- Level 1 and Level 2 actual-app screenshots visibly show equal wall tops for
  rooms aligned on the same floor row.
- Full and partial adjacency still suppress only covered wall runs.
- Front Desk and Examination visual regressions remain intact.
- Focused tests, player typecheck/build, Playwright proofs, and `git diff
  --check` pass.

## Validation

- Focused Vitest for surgery-center geometry, cutaway projection, room visual
  layout, door interaction geometry, camera bounds, and bitmap presentation.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- Focused desktop Playwright for Level 1, Level 2, adjacency, and Build Mode.
- Sol inspection of actual screenshots and changed source.
- `git diff --check`

## Progress

- [x] Audited the current special-shell and generic room/hallway wall paths.
- [x] Confirmed the generic footprint-dependent height is the inconsistency.
- [x] Implemented the shared wall-height contract and runtime integrations.
- [x] Captured Level 1 Examination/Front Desk adjacency plus Build Mode door
  highlights, and Level 2 facility/build proof from real Phaser scenes.
- [x] Ran focused Vitest, player typecheck/build, focused desktop Playwright,
  and diff hygiene; Sol reviewed the renderer diff and regenerated Level 1,
  Level 2, phone, Examination adjacency, and Build Mode screenshots.

## Discoveries

- The generic `getRearWallFaceHeight(roomPixelHeight, tileSize)` deliberately
  capped older walls below one-half tile, while the accepted Front Desk v4
  envelope is about 1.56 tiles. Updating only the drawn rectangle would leave
  doors, wall art, hit targets, and camera framing inconsistent.
- The shared envelope is represented as a wall face plus its measured
  Front-Desk outer-border cap. Generic north projections now use those two
  values together, while north-door targets use the same face height and
  camera bounds reserve the full envelope.
- The isolated authored Examination atlas had a shorter native north shell.
  Examination therefore uses the boundary-aware shared construction in both
  orientations, retaining its independent clinical floor material and fixtures
  while matching Front Desk v4 height.

## Exact next action

Milestone complete. Await owner visual review; no further implementation is
planned in this bounded wall-height pass.
