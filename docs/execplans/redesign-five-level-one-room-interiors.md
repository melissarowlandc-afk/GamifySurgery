# Redesign Five Level 1 Room Interiors

## Goal

Replace the active interior compositions for Waiting, Bathroom, X-ray,
Imaging Control, and Minor Procedure with sparse, reference-led arrangements
that visually belong beside the approved Front Desk and Examination rooms.
Keep the accepted canonical wall shell unchanged and use existing high-detail
repository sprites at believable scale relative to live people.

This is a graphics-only change. Logical room footprints, allowed orientations,
door legality, collision, routing, saves, progression, balance, clinical
content, staffing, and simulation behavior must not change.

## Visual authorities

- Current approved Front Desk v5 and Examination v3 presentation in the live
  renderer.
- Owner-provided overall-vibe references in the ignored local owner-review
  workspace for the combined Waiting, Bathroom, X-ray, and Imaging Control
  vocabulary, spacing, person-to-furniture scale, and cutaway construction.
- Owner-provided room-composition references in that workspace for Waiting and
  X-ray composition and door-clear intent.
- Current canonical wall contract and native Front Desk/Examination captures.

## Requirements

### Shared presentation contract

- Preserve the accepted canonical wall helper and shell integration. These
  five rooms must continue to have the exact same per-tile north-wall height,
  side-return thickness, border/bevel/corner language, and shallow south lip
  as Front Desk and Examination. Only the existing room wall tint/floor style
  may differ.
- Replace, rather than incrementally add to, the five legacy fixture switch
  compositions. Retain stable fixture IDs and source assets for reuse; do not
  destructively delete shared art definitions.
- Put floor furniture on the floor with a believable contact/depth anchor.
  Put mirrors, light boxes, signs, boards, and similar decoration on the real
  north wall. A conflicting live north door suppresses the entire affected
  wall piece instead of leaving a partial floating fragment.
- Leave a clear central circulation path and at least one furniture-clear
  legal door candidate on north, east, south, and west walls.
- Suppress the five rooms' legacy upgrade furniture and generic wall-clock
  clutter. Upgrade state and floor-finish behavior remain intact.
- Prefer registered high-detail bitmap fixtures. Procedural fallback art may
  be used only for a small subordinate prop when no matching authored sprite
  exists and it passes native visual review.
- Live characters, doors, dirt/trash, selection, room labels, click targets,
  and gameplay state remain independent render layers.

### Waiting Room (`room.waiting`, logical 4x3, orientations 0 and 90)

- Use an explicit north-up arrangement for each supported orientation; do not
  rotate perspective furniture art mechanically.
- Compose a calm seating group: one north-wall couch, two separated visitor
  chairs, one centered coffee table, and at most one small magazine rack or
  plant/side-table accent.
- Use no floor rug sprite and no waste-bin/upgrade clutter unless native review
  proves one small bin is necessary and unobtrusive.
- Use one or two restrained north-wall pieces, such as a notice board and
  framed print, with exact north-door suppression.

### Bathroom (`room.bathroom`, logical 2x2, fixed north-up)

- Use only the essential authored fixtures: hand sink at the north-west,
  mirror physically mounted above it, toilet on the east/south side, and one
  small waste bin if space permits.
- Remove the legacy bath mat, plant, and decorative upgrade clutter. The tile
  floor itself supplies sufficient visual texture.
- Keep the compact room legible and leave all four door candidates clear.

### X-ray (`room.xray`, logical 3x3, fixed north-up)

- Make the patient table the central anchor, oriented north-south. Place the
  X-ray tube and upright bucky as distinct equipment around it without
  covering the patient circulation path.
- Add the authored lead apron and one supply cabinet, plus at most one small
  waste bin if it does not crowd a door zone.
- Use one restrained north-wall radiation/light-box element. Remove the floor
  rug and the current three-piece wall-art row.
- Keep the fixed north/east/south/west door zones readable, including a
  patient-facing route and the separate Imaging Control connection.

### Imaging Control (`room.imaging_control`, logical 2x2, fixed north-up)

- Use one authored imaging console, one operator chair, and one server rack.
  Remove the second chair, printer, waste bin, plant, and legacy upgrade art.
- Mount one X-ray/light-box display on the north wall above/near the console,
  suppressed only by its conflicting north door.
- Preserve enough open floor for the operator and all four door candidates.

### Minor Procedure (`room.minor_procedure`, logical 3x3, fixed north-up)

- Build a readable procedure composition around the authored procedure table,
  procedure light, and instrument tray.
- Add an authored sink cabinet and supply cabinet plus the authored biohazard
  bin only where they remain subordinate and door-clear. Use no rug, IV stand,
  generic waste bin, monitor, or upgrade cart.
- Use at most one restrained north-wall shelf/sign. Keep a clear approach to
  the table and all four legal door candidates.

## Door-clear presentation zones

These normalized edge intervals are renderer tests only; domain legality stays
authoritative.

| Room | North | East | South | West |
| --- | --- | --- | --- | --- |
| Waiting | 0.04-0.20 | 0.40-0.56 | 0.04-0.22 | 0.12-0.30 |
| Bathroom | 0.54-0.74 | 0.14-0.34 | 0.14-0.34 | 0.54-0.74 |
| X-ray | 0.74-0.90 | 0.42-0.58 | 0.42-0.58 | 0.76-0.92 |
| Imaging Control | 0.02-0.18 | 0.40-0.58 | 0.04-0.22 | 0.74-0.92 |
| Minor Procedure | 0.04-0.20 | 0.66-0.82 | 0.80-0.96 | 0.06-0.22 |

## Existing authored art

No new raster is initially required. Reuse the registered crops in:

- `apps/player/public/art/rooms/level-1-v1/waiting-fixtures-v1.png`
- `apps/player/public/art/rooms/level-1-v1/bathroom-fixtures-v1.png`
- `apps/player/public/art/rooms/level-1-v1/xray-imaging-fixtures-v1.png`
- `apps/player/public/art/rooms/level-1-v1/minor-procedure-fixtures-v1.png`

Minor Procedure may reuse the existing high-detail `sinkCabinet` and
`supplyCabinet` semantic fixtures rather than introducing a lower-detail
procedural sink. Do not change a global fixture crop merely to alter one room.

## Cortan capability state checked for this task

On 2026-09-01, the authorized private Cortan host was reachable read-only on
HTTPS 443. ComfyUI 0.34.0 reported 994
nodes and an RTX 4070 Ti SUPER with 16 GiB VRAM. The populated model folders
remain:

- checkpoints: SDXL base and PixelartSpritesheet;
- LoRAs: PixelArtRedmond, pixel-art-xl, and Qwen Image Edit Lightning;
- ControlNet: SD1.5 Canny plus SDXL Canny and OpenPose;
- CLIP vision: ViT-H; IP-Adapter: SDXL ViT-H;
- Qwen Image Edit 2511 diffusion model, Qwen 2.5 VL encoder, and Qwen image VAE.

Known limitations remain: `upscale_models` is empty and `sams`,
`grounding-dino`, `insightface`, and `onnx` model endpoints return 404. The
current redraw uses exact existing sprites, so no asset upload or generation is
authorized or needed. If native review exposes a genuine raster deficiency,
stop and report it before a bounded Cortan attempt; never fall back silently to
local image generation.

## Constraints and non-goals

- No changes to gameplay/domain packages, room sizes, rotations, costs,
  placement rules, doors, collision, routing, saves, progression, staffing,
  timing, balance, or clinical content.
- Do not change Front Desk, Examination, canonical shell geometry, hallway
  behavior, characters, or global actor scaling.
- Do not flatten walls, doors, fixtures, or live people into a room screenshot.
- Preserve all existing uncommitted canonical-room work and unrelated dirty
  files. Do not reset, clean, checkout, broadly stage, commit, push, deploy, or
  publish without explicit owner direction.
- Do not install or alter anything on Cortan.

## Implementation design

Add a renderer-only declarative `fiveRoomPresentation.ts` module and tests.
Metadata selects a sparse fixture/wall-fixture package by room ID and
orientation, supplies normalized display bounds/contact information, and
records exact north-door conflict offsets. `FacilityScene` should render these
packages through the existing authored-fixture and canonical north-wall paths,
then bypass only the five old switch branches, legacy upgrade props, and generic
clock. Domain data remains untouched.

## Milestones and ownership

Use one `terra_worker` writer at a time. Workers share the dirty tree and must
preserve unrelated work.

1. Create the declarative presentation module and unit tests; rebuild Waiting
   in both orientations and Bathroom. Own only the new module/test and narrow
   five-room integration seams in `FacilityScene.ts`; add focused 100% captures.
2. Add X-ray, Imaging Control, and Minor Procedure packages to the same module;
   prove human-relative proportions, exact north-door art suppression, and all
   four door-clear sides. Own the same module/test, narrow scene integration,
   and dedicated five-room E2E/captures.
3. Sol reviews actual diffs and native images, runs integrated validation, and
   updates this plan and the shared handoff. Any nontrivial correction returns
   to Terra.

## Acceptance criteria

- All five rooms visibly use the already-accepted canonical wall height and
  structure with no regression to Front Desk, Examination, or hallways.
- Each interior is a new sparse composition, not the prior switch-case layout.
- Furniture reads at believable scale beside live people; no room feels empty
  or crowded, and its central working/walking area remains legible.
- Waiting works north-up in both supported room orientations without rotating
  perspective furniture sprites.
- Bathroom, X-ray, Imaging Control, and Minor Procedure remain fixed north-up.
- Every requested wall decoration is physically on the north wall and
  disappears wholly for its exact conflicting live north-door slot.
- Every room retains one furniture-clear legal candidate per wall.
- No gameplay/system/clinical behavior or unrelated work changes.

## Validation

- Focused Vitest for the new presentation module, `roomVisualLayout`,
  `canonicalRoomShell`, and bitmap fixture manifest.
- Player workspace typecheck and production build.
- Desktop 100% visual E2E covering all five rooms, both Waiting orientations,
  representative live people, exact north-door decor conflicts, and door-zone
  proofs.
- Sol native-resolution inspection of every cited capture.
- `git diff --check` and scoped-diff review.

## Progress

- [x] Re-read repository instructions and the current handoff.
- [x] Audit the dirty graphics checkpoint and active agents.
- [x] Inspect the relevant owner room/vibe references at native resolution.
- [x] Inventory existing room sprites, footprints, orientations, and door zones.
- [x] Refresh Cortan's read-only node/model inventory and record limitations.
- [x] Implement and validate Waiting plus Bathroom.
- [x] Implement and validate X-ray, Imaging Control, and Minor Procedure.
- [x] Complete integrated review and handoff.

## Discoveries

- All five rooms already inherit the accepted canonical shell; the requested
  redesign can remain entirely inside their presentation metadata and renderer
  branch.
- Their four source atlases already contain the high-detail furniture needed
  to match the references. No raster generation is justified initially.
- Waiting is the only requested room with a supported 90-degree orientation;
  it needs a second north-up composition rather than rotated perspective art.
- Legacy tier-two/tier-three props and generic clocks are a major source of
  current clutter and should be suppressed only for these five complete
  reference-led packages.
- Milestone 1 adds a shared renderer-only suppression predicate for all five
  planned rooms, while its actual new fixture packages are limited to Waiting
  and Bathroom. This prevents upgrade/clock clutter from returning as the
  remaining three packages are replaced in Milestone 2.
- Native production captures use persisted north doors in the exact authored
  wall-art cells: Waiting offset 1 suppresses its notice board and Bathroom
  offset 0 suppresses its mirror without changing domain door behavior.
- Waiting and Bathroom now retain their exact approved edge intervals as
  declarative renderer metadata with AABB-versus-shallow-edge-strip tests;
  the Waiting magazine rack was moved above the east door lane.
- All five rooms now use the same fixture/wall-fixture renderer path. X-ray
  keeps the table central with wall-mounted apron/marker, Imaging Control has
  exactly one console/chair/rack/display, and Minor Procedure keeps its
  articulated lamp grounded behind the table with a separate north-wall sign.
- Production normal, Build Mode, and exact-north-conflict captures cover all
  five packages; the conflict state uses offset 1 for the new X-ray, Imaging,
  and Minor Procedure north-wall fixtures.
- Sol rejected the first Minor Procedure proof because the authored standing
  procedure lamp had been treated as wall art. The accepted correction grounds
  that lamp behind the table and gives exact door suppression to a separate
  restrained north-wall medical sign.

## Completion evidence

- Sol reviewed the actual presentation metadata, shared `FacilityScene`
  renderer path, unit/E2E tests, and all normal/conflict/Build captures at
  native resolution.
- Focused player Vitest passed **4 files / 32 tests**.
- Player typecheck passed. Player production build passed with only the
  existing large-chunk advisory.
- Desktop Playwright passed **2/2** scenarios, covering both Waiting
  orientations and the normal, Build Mode, and exact-conflict states for all
  five rooms.
- `git diff --check` passed. No gameplay/domain, canonical-shell, clinical,
  save, balance, or progression file was changed for this redraw.
- No raster generation was needed. Cortan was checked read-only; there was no
  upload, workflow execution, installation, or mutation, and local image
  generation was not used.

## Exact next action

Owner visual review/playtest of the five redesigned rooms in the current dirty
working tree. Continue only for a concrete graphical correction or the next
room redesign. Keep gameplay/system work in its separate thread. If this
graphics checkpoint should be published, the owner should explicitly say
"push to GitHub"; completion did not authorize a commit, push, or deployment.
