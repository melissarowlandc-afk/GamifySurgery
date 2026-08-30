# Unify Examination Room Architecture

## Goal

Rebuild the Examination Room so its walls, border thickness, baseboards,
cutaway height, trim, shadow construction, and room-boundary behavior use the
same architectural system as the accepted Front Desk. Preserve the approved
room-specific wall/floor materials and furniture while eliminating all visual
overlap when the Examination Room touches the Front Desk.

Owner references:

- `Photos for Codex/exec-25eb6189-3c71-411c-9b07-668566332848.png`
- `apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png`
- the actual-app Examination Room proofs under `artifacts/screenshots/`

## Requirements

- Establish one tested normalized surgery-center wall geometry derived from
  the accepted Front Desk v4 shell.
- Examination Room wall height, side thickness, border/trim bands,
  floorboard/baseboard height, foreground cutaway lip, corner treatment, and
  shadow offsets must match that shared geometry at the same facility tile
  scale in both orientations.
- The only room-specific architecture differences are wall-face color or
  texture, floor color or texture, room dimensions, and independent room
  furniture/objects.
- Re-author the 3-by-2 horizontal and 2-by-3 vertical Examination Room assets
  or renderer composition from the shared geometry. Do not stretch one
  furnished orientation into the other.
- Keep the logical floor exactly within its room footprint.
- Keep furniture and its floor contacts within the Examination Room. Tall art
  may rise above its floor contact, but no fixture may cross the south logical
  boundary into the Front Desk floor.
- When rooms touch north-to-south, the shared boundary must present a single
  coherent floor-to-floor transition. A southern room's rear dollhouse wall
  may not cover the northern room's floor, and a northern room's foreground
  wall/lip may not cover the southern room.
- Partial adjacency removes only the covered wall run. The remaining wall art
  stays at its original scale and position; it must never squeeze into the
  exposed remainder.
- Preserve independent explicit doors and at least one fixture-clear door
  candidate on north, east, south, and west walls for both orientations.
- Preserve current room dimensions, routing, collision, saves, gameplay,
  balance, upgrades, cleanliness, actors, and furniture identities.

## Constraints and non-goals

- Do not redesign the Front Desk furniture or accepted Front Desk material
  appearance.
- Do not redesign other room interiors in this milestone.
- Do not flatten furniture, doors, characters, trash, or click targets into a
  background image.
- Do not add rooms, fixtures, gameplay, progression, or clinical content.
- Preserve all unrelated changes in the dirty shared working tree.

## Relevant repository state

- Front Desk v4 measured floor: `x=212`, `y=339`, `832x622` for a 5-by-4
  logical floor.
- Its visible outer wall begins near `x=157`, producing a normalized side-wall
  thickness of about `0.33` logical tile.
- Its visible north cutaway begins near source `y=97`, producing about `1.56`
  logical tiles of north-wall envelope above the floor.
- Its foreground crop is `153` source pixels tall, about `0.98` logical tile.
- Examination v2 currently uses approximately `0.20`-tile side walls and a
  much shallower north/front treatment, so the two shells cannot align.
- Both authored shells currently render as complete bitmaps even where a
  neighboring room covers a boundary. This makes the Front Desk rear wall
  occupy the Examination Room floor when the latter is directly north.
- Generic cutaway helpers already calculate exposed horizontal/vertical runs
  and crop wall artwork without squeezing it.

## Decisions already made

- The Front Desk v4 architectural proportions are the source of truth for
  surgery-center walls.
- `floorboard` in the owner request is treated as the wall baseboard/skirting
  and its adjoining lower trim.
- Shared-wall correction must be boundary-aware, not hidden by moving the
  rooms apart in screenshots.
- The Examination Room keeps its distinct clinical floor/wall-face material
  and its already approved furniture contents.

## Milestones

1. Add a shared, tested normalized architecture contract based on Front Desk
   v4 measurements.
2. Rebuild both Examination Room orientations with that exact contract.
3. Make authored boundary layers adjacency-aware so north/south contact and
   partial coverage cannot overlap neighboring floor planes.
4. Verify fixtures stay in-bounds and all four door candidates remain usable.
5. Capture actual-app isolated/aligned and directly adjacent horizontal and
   vertical proofs; run focused regression validation.

## File or module ownership

The assigned Terra worker owns only:

- shared surgery-center architectural geometry/presentation helpers and tests
  under `apps/player/src/facility/`;
- Examination Room shell assets and deterministic builder;
- the minimal authored-shell renderer seam needed for Examination Room / Front
  Desk north-south adjacency without changing Front Desk furniture;
- Examination Room and adjacency-focused manifest/layout tests;
- focused actual-app visual proof under `tests/e2e/`;
- a concise update to `docs/features/visual-art-direction.md` recording the
  shared wall-geometry rule;
- this ExecPlan's progress and discoveries.

## Acceptance criteria

- A pixel/ratio test proves the Examination Room uses the same normalized
  side-wall, north-wall, baseboard/trim, front-lip, and shadow geometry as the
  Front Desk source contract in both orientations.
- Horizontal and vertical actual-app rooms have visibly identical wall
  construction to the Front Desk at equal facility scale.
- Directly adjacent Examination Room and Front Desk floors meet without either
  room's wall, floor, or furniture covering the other's floor plane.
- A partial north/south adjacency proof removes only the covered wall segment
  and does not resize the remaining wall treatment.
- Furniture stays independent, readable, and contained within the room.
- Both orientations retain at least one usable legal door position per wall.
- Focused tests, typecheck, build, actual-app browser proof, and diff hygiene
  pass with no unrelated gameplay changes.

## Validation

- Focused Vitest for shared geometry, Examination Room presentation, cutaway
  adjacency, room visual door zones, and bitmap manifest metadata.
- `npm run typecheck --workspace @gamify-surgery/player`
- `npm run build --workspace @gamify-surgery/player`
- Focused desktop Playwright actual-app proof for horizontal, vertical, full
  adjacency, partial adjacency, and Build Mode door behavior.
- Sol inspection of the actual screenshots and source assets.
- `git diff --check`

## Progress

- [x] Inspected the owner reference, Front Desk v4 measurements, Examination
  v2 assets, renderer, furniture placement, and cutaway helpers.
- [x] Identified mismatched normalized wall geometry and full-shell boundary
  overlap as the two root causes.
- [x] Implement shared geometry, source-derived component seam, and focused
  runtime proof harness, including the independent X/Y source-axis correction.
- [x] Sol reviewed the actual diff, regenerated screenshots, source component
  atlas, and validation evidence after the final axis correction.

## Discoveries

- The apparent Examination Room furniture intrusion in the current proof is
  primarily the Front Desk's complete north-wall bitmap extending upward into
  the northern room's logical floor plane.
- Static full-shell bitmaps cannot express partial shared-boundary suppression
  without layer decomposition, clipping, or an equivalent boundary-aware
  composition.
- Front Desk's 153px foreground crop is not wholly an in-floor lip: 20px lies
  inside the 622px floor and 133px lies below it. The shared contract now
  records both portions independently, treats side/north walls as outsets,
  and uses source-derived component sprites rather than flat replacement
  walls for boundary-aware runs.
- The source floor has non-square semantic tile axes (832/5px X and 622/4px
  Y). Component tile sprites now accept independent scales, avoiding repeated
  seams or height distortion in north/floor/front/side fragments.

## Exact next action

Milestone complete. Await owner visual review of the regenerated actual-app
horizontal, vertical, partial-adjacency, and Build Mode captures.
