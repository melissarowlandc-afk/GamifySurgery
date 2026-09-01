# Canonical Room Shell and Examination Grid

## Goal

Make the Front Desk v5 room shell the structural authority for every playable
room while preserving room-specific wall colors/textures and independent
floors, fixtures, doors, actors, and interaction layers. Reduce the Front Desk
south/front wall to half its current displayed height, use that same shallow
front-wall structure for other rooms, and rebuild both Examination Room
orientations around the owner's exact visual-cell layout.

This is a graphics-only change. Logical room footprints, placement rules,
door legality, collision, routing, saves, progression, balance, clinical
content, and simulation behavior must not change.

## Visual authorities

- Current owner-approved Front Desk v5 component shell and furniture style.
- Three owner-provided overall-vibe images in the ignored local room-reference workspace.

The references consistently use one wall construction grammar across rooms:
a full north wall, matching side returns and corner posts, a shallow south
cutaway wall, common borders/bevels, and room-specific face/floor materials.
Furniture is scaled to the people and wall decoration is attached to wall
faces rather than floating over the floor.

## Requirements

### Canonical wall structure

- Introduce one renderer-only canonical shell geometry contract derived from
  the current Front Desk v5 component construction.
- Every enclosed room uses the same north-wall height, side-wall width/return,
  corner/border/bevel language, south-wall height, door apertures, and
  foreground-depth behavior at the same map zoom.
- Room-specific wall color/texture is a skin over the common geometry. Floors
  and fixture packages remain independent.
- Reduce the current Front Desk v5 south/front component display height by
  exactly 50 percent from its current bounds, then make that resulting height
  the canonical front-wall height used by Examination and other enclosed
  rooms.
- Walls are complete by default. Only a live explicit door belonging to that
  room and wall slot removes an aperture. Room adjacency alone must never
  create an opening.
- The south/front wall renders above in-room floor contacts and characters but
  below actors/objects whose floor contact is outside and south of the room.
- Door art, actors, fixtures, dirt/trash, selection, labels, and click targets
  remain independent layers.
- Hallways remain circulation spaces. They may use the canonical border
  grammar on their actual exposed edges, but must not be enclosed as ordinary
  four-wall rooms or have their routing behavior altered.

### Wall decoration

- Wall-mounted art uses a wall-local placement path and clips to the remaining
  canonical north-wall face after live-door subtraction.
- No wall decoration may be positioned by the floor-fixture path.
- A door overlapping a decoration's wall interval suppresses that decoration;
  it must not float beside, above, or through the opening.

### Examination Room contents and proportions

- Remove `wallChart` (the human poster), `gloveDispenser`,
  `examinationPhysicianScale`, and `examinationPrivacyCurtain` from both active
  Examination presentations. Retain historical art definitions only for
  rollback/other rooms; do not destructively delete shared assets.
- Treat the owner's grid as presentation metadata over the unchanged logical
  footprint:
  - orientation 0 keeps a logical 3-by-2 room but uses a visual 4-column by
    2-row grid;
  - orientation 90 keeps a logical 2-by-3 room but uses a visual 2-column by
    4-row grid.
- Orientation 0 placements:
  - sink cabinet fills visual A1;
  - rolling stool fills B2;
  - examination bed fills B3 and B4, oriented horizontally with its foot
    facing left toward the stool;
  - diagnostic/stethoscope unit is mounted on the north wall above A4 and is
    suppressed when a live north door overlaps that wall interval.
- Orientation 90 placements:
  - sink cabinet fills A2;
  - rolling stool fills B1;
  - examination bed fills C1 and D1, oriented vertically with its foot facing
    north/up toward the stool;
  - diagnostic/stethoscope unit is mounted on the north wall above A1 and is
    suppressed when a live north door overlaps that wall interval.
- The requested sink, stool, bed, and diagnostic unit are the dominant room
  composition. Any retained small sink utility must be wall-mounted and
  subordinate; no accessory may occupy or obscure the specified visual cells.
- Size fixtures from the visual cells so the sink, stool, and bed read at the
  same human-relative scale as the Overall Vibe references. Do not globally
  resize character identities.
- Preserve at least one furniture-clear legal door location on north, east,
  south, and west walls in both orientations.

### Remaining rooms

- Migrate every enclosed Level 0-2 room to the canonical structure while
  preserving its wall skin, floor, fixtures, and gameplay state.
- Audit fixture-to-person proportions and wall decor at native resolution.
  Correct presentation-only outliers; do not change semantic fixture data.
- Capture a representative matrix covering every enclosed room type and the
  hallway edge treatment before final acceptance.

## Constraints and non-goals

- No gameplay, domain, room-cost, placement-size, door-rule, collision,
  routing, save-schema, progression, timing, balance, or clinical-content
  changes.
- No redesign of characters or global animation systems.
- Do not flatten live doors, characters, dirt/trash, or selection into shell
  images.
- Do not overwrite or revert the existing uncommitted graphics checkpoint or
  unrelated clinical work.
- Do not reset, clean, checkout, broadly stage, commit, push, deploy, publish,
  or promote `main` without explicit owner direction.
- Do not install or alter Cortan nodes/models without explicit permission.
- Do not use Codex/local generative image tools for existing-art alteration.
  Deterministic renderer transforms such as scaling, clipping, or rotation are
  allowed because they preserve the exact existing source art.

## Cortan capability state checked for this task

On 2026-08-31, Cortan was reachable at
`https://cortan.taile197db.ts.net` over HTTPS 443. ComfyUI 0.34.0 reported 994
nodes and an RTX 4070 Ti SUPER with 16 GiB VRAM. Relevant available resources
include:

- `qwen_image_edit_2511_int8_convrot.safetensors`,
  `qwen_2.5_vl_7b_fp8_scaled.safetensors`, `qwen_image_vae.safetensors`, and
  `Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors`;
- SDXL Canny/OpenPose ControlNets;
- `ip-adapter-plus_sdxl_vit-h.safetensors` plus the CLIP-ViT-H vision encoder;
- PixelArtRedmond and pixel-art-xl LoRAs;
- IP-Adapter, inpaint, masking, SAM3-node, layer, crop, and Qwen image-edit
  node families.

Known limitations to report rather than silently bypass:

- the `upscale_models` folder is empty;
- model endpoints for `sams`, `grounding-dino`, `insightface`, and `onnx`
  returned 404 even though some related node classes exist;
- API-backed commercial nodes may require credentials and must not be assumed
  usable merely because their node classes are installed.

No generation is required for the first canonical-shell implementation because
the exact Front Desk component art already exists. If native review later
identifies a real existing-raster alteration, inventory Cortan again and prefer
the local Qwen Image Edit/IP-Adapter/ControlNet stack. Upload only the specific
owner-authorized reference needed for that bounded attempt and retain workflow
provenance.

## Relevant repository state

- Front Desk v5 is an uncommitted component renderer in
  `frontDeskV5Architecture.ts`, using the Front Desk v3 architecture atlas and
  a display-only wide/shallow projection.
- Its current front component bounds are `0.27 * displayed floor height` and
  must become half that height before being generalized.
- Examination v3 has a separate procedural shell in
  `examinationV3Architecture.ts` and content metadata in
  `examinationRoomPresentation.ts`.
- Other enclosed rooms use the older generic `drawRoomShell()` path in
  `FacilityScene.ts`; hallways have a separate open-corridor branch.
- Current generic shells omit walls on shared room boundaries. That behavior
  conflicts with the new closed-unless-door contract for enclosed rooms.
- The dirty worktree contains the completed Front Desk/Examination graphics
  checkpoint plus unrelated clinical implementation. Every milestone must
  extend the graphics baseline and preserve all other changes.

## Decisions already made

- The canonical shell is one renderer geometry helper, not copied per-room
  constants.
- Structural geometry is common; wall/floor material remains room-specific.
- The 4-by-2 and 2-by-4 Examination grids are visual authoring grids only.
- Adjacency is not a door. Enclosed walls remain visible until a real door is
  placed.
- The high-detail existing Examination fixture atlas remains the source of the
  sink, stool, table, and diagnostic sprites. The bed may be deterministically
  rotated/oriented by the renderer; no new raster generation is needed.
- Hallways receive a deliberate circulation-specific adaptation after enclosed
  rooms, rather than being accidentally boxed in by the common helper.

## Milestones

1. Create and test the canonical shell geometry/component helper. Migrate Front
   Desk and Examination architecture to it, halve the Front Desk front wall,
   preserve live-door apertures, and prove matching wall construction at the
   same zoom.
2. Rebuild both Examination fixture presentations to the owner's visual grids,
   remove the named clutter, orient/scale the bed correctly, implement exact
   diagnostic-door suppression, and refresh occupied/door/build proofs.
3. Migrate all remaining enclosed Level 0-2 room render paths to the canonical
   shell with room-specific skins. Preserve doors, floors, fixtures, and
   wall-decor clipping.
4. Adapt hallway exposed-edge rendering to the same border vocabulary without
   enclosing circulation; run the all-room proportion/decor visual sweep.
5. Perform integrated validation, inspect native-resolution captures, update
   this plan and the shared handoff, and report the owner-review checkpoint.

## Sequential ownership

Use one `terra_worker` writer at a time. Workers share the dirty tree and must
preserve unrelated work.

- Milestone 1 owns new `canonicalRoomShell.ts` and test, the existing Front
  Desk/Examination architecture helpers and tests, and narrowly scoped
  `FacilityScene.ts` architecture integration.
- Milestone 2 owns `examinationRoomPresentation.ts` and test, Examination-only
  fixture orientation/manifest seams if required, minimal `FacilityScene.ts`
  placement/decor integration, `roomVisualLayout.test.ts`, Examination E2E,
  and new Examination screenshots.
- Milestone 3 owns the generic enclosed-room shell branch, canonical shell
  skins/tests, an all-room visual matrix E2E, and new review screenshots.
- Milestone 4 owns only hallway exposed-edge presentation and the final
  proportion/decor corrections revealed by native review.
- Sol owns planning, reviewing actual diffs and images, cross-milestone
  integration, final acceptance, and the final plan/handoff edits.

## Acceptance criteria

- At one map zoom, Front Desk, Examination, and every enclosed Level 0-2 room
  have visibly identical wall heights, border widths, corner treatment, and
  south-wall structure; only wall skin/floor content varies.
- Front Desk front wall is visibly half its preceding height and still
  occludes in-room contacts correctly.
- No enclosed wall has a hole without a live door, including at adjacent room
  boundaries. Every live door cuts only its exact slot.
- Wall decoration is visibly on/clipped to the north wall and disappears when
  its own wall interval is replaced by a door.
- Both Examination orientations match the requested visual-cell placements,
  contain none of the four named clutter items, and use person-appropriate
  sink/stool/bed proportions.
- The diagnostic unit is hidden specifically by the conflicting north door:
  logical north offset 2 for the 3-wide orientation and north offset 0 for the
  2-wide orientation.
- Both Examination orientations retain a legal furniture-clear candidate on
  every wall.
- Hallways remain visually open and logically unchanged.
- No gameplay/system/clinical behavior or unrelated dirty work changes.

## Validation

- Focused Vitest for canonical shell geometry, Front Desk architecture,
  Examination architecture/presentation, room layout, wall-decoration clips,
  and room cutaway behavior.
- Player workspace typecheck and production build.
- Desktop Front Desk and Examination visual E2E, including no-door, exact-door,
  conflicting-north-door/decor suppression, rotated layout, build candidates,
  occupied foreground, and adjacency.
- Desktop all-room matrix and hallway captures after later milestones.
- Sol inspection of all cited references and refreshed screenshots at native
  resolution.
- `git diff --check`.

## Progress

- [x] Read repository instructions, current handoff, and dirty-tree state.
- [x] Inspect the three Overall Vibe references at original resolution.
- [x] Refresh Cortan's current node/model inventory and record limitations.
- [x] Complete the read-only renderer/layout audit.
- [x] Implement and validate the canonical Front Desk/Examination shell.
  Focused real-layout unit tests, typecheck, production build, and diff checks
  pass; isolated desktop Front Desk and both Examination-orientation captures
  were refreshed and inspected.
- [x] Implement the Examination visual-grid contents and focused renderer validation.
- [ ] Complete the isolated desktop Chrome proof run and native-resolution review for the Examination visual-grid contents.
- [ ] Migrate and validate remaining enclosed rooms.
- [ ] Adapt and validate hallway edges plus all-room proportions/decor.
- [ ] Complete integrated review and handoff.

## Discoveries

- The existing Front Desk and Examination implementations already share the
  correct live-door data source but duplicate wall-run and foreground logic.
- The current generic room shell uses adjacency-driven exposed boundaries;
  this must be replaced for enclosed rooms because the new rule is
  closed-unless-door.
- The user's visual Examination grids map cleanly onto normalized display
  coordinates without changing logical footprints.
- Horizontal diagnostic A4 conflicts with logical north door offset 2;
  vertical diagnostic A1 conflicts with logical north door offset 0.
- Existing high-detail fixture art is sufficient. The work should remain
  deterministic unless later native review exposes a true missing raster.
- The canonical component shell now preserves the Front Desk v3 atlas grammar
  for both rooms while allowing Examination to keep its independent floor.
  It derives all structural thickness from display width per logical tile, so
  the Front Desk projection and 3x2/2x3 Examination layouts have equal north,
  side, and south-wall dimensions at the same map zoom. The common south lip
  remains exactly 13.5% of the approved Front Desk projected-floor height.
- Side-return extensions are now separate from floor-slot runs. This keeps
  their intended top/bottom shoulders while an explicit first/last side door
  still cuts only the matching actual floor slot.
- Examination now uses display-only 4-by-2 and 2-by-4 composition metadata
  without changing its 3-by-2/2-by-3 logical footprints. The four explicitly
  rejected clutter fixtures are absent from both active packages. The retained
  diagnostic and paper-towel sprites are rendered through an Examination-only
  north-wall path and keyed to exact logical north door offsets, rather than
  the generic floor-fixture or adjacency-aware rear-wall paths.

## Exact next action

Complete the in-flight isolated desktop Chrome Examination capture run,
inspect the refreshed native-resolution files, then have Sol review the
Milestone 2 diff before delegating Milestone 3.
