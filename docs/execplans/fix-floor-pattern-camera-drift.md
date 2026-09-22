# Fix Floor Pattern Camera Drift

## Goal

Keep every visible floor material rigidly attached to its semantic world
surface while the facility camera pans. The sidewalk, Examination Room,
ordinary authored room floors, and hallway flooring must translate with their
own world rectangles without their pattern phase sliding underneath walls,
furniture, or stationary actors.

## Requirements

- Derive authored TileSprite phase from camera-invariant logical map
  coordinates, never from rendered screen coordinates alone.
- Cover the continuous sidewalk and all authored enclosed-room floor families:
  clinical, waiting, and imaging, including both Examination orientations.
- Preserve material continuity across adjacent floor rectangles and doorway
  apertures; do not merely reset every fragment to an unrelated local phase.
- Prove the procedural hallway plank/seam pattern remains room-relative while
  panning, even though it does not use the TileSprite path that causes the bug.
- Verify normal mode and Build mode with a real camera drag at the canonical
  local renderer.
- Produce task-specific before/after or normal/Build screenshots suitable for
  native inspection.

## Constraints and non-goals

- Graphics/presentation only. Do not change camera controls, room placement,
  footprints, buildability, collision, navigation, doors, saves, simulation,
  staffing, or any gameplay/domain rule.
- Preserve the heavily dirty shared worktree and every unrelated change.
- Reuse the existing floor and sidewalk artwork. This is coordinate/phase
  correction, not raster generation; do not use Cortan or native image
  generation.
- Avoid a viewport-pinned material and avoid restarting the texture at each
  clipped wall/room fragment when a stable logical phase can preserve
  continuity.
- Do not stage, commit, push, deploy, or release without explicit owner
  direction.

## Relevant Repository State

- `FacilityScene.calculateLayout` incorporates `cameraView.panX/panY` into
  `layout.originX/originY`, then redraws the world after camera changes.
- `drawEnvironmentTile` positions each TileSprite at rendered screen
  coordinates; its phase now subtracts the facility origin so a pan does not
  change the material under a semantic map location.
- The affected helper renders the sidewalk, authored clinical/waiting/imaging
  floors, Examination floors, and some repeated wall materials.
- Hallways use procedural Phaser Graphics whose rows and seams are calculated
  from the hallway rectangle. That path appears room-relative already but has
  no pan regression.
- Phaser's Canvas TileSprite samples its repeated pattern after scaling and
  translating by negative `tilePosition`; stable logical phase is therefore a
  presentation contract, not a camera setting.

## Decisions Already Made

- Fix the shared phase calculation with logical coordinates relative to the
  facility world origin. Do not special-case only Examination or only the
  sidewalk.
- Preserve coherent world phase across adjacent authored surfaces rather than
  setting every TileSprite phase blindly to zero.
- Treat hallway behavior as a required regression even if no production
  hallway change is needed.
- Use existing opt-in live Phaser access for TileSprite position/phase
  assertions; add no gameplay-facing debug API.

## Milestones

1. Implement a small pure world/logical tile-phase helper, cover it with unit
   tests, and use it in the shared authored environment TileSprite renderer.
2. Add a deterministic desktop-Chrome pan proof that checks sidewalk,
   Examination, other authored room-floor families, and a clear hallway patch
   before/after real drag in normal and Build mode; capture final screenshots.
3. Run focused unit/browser regressions, typecheck, build, native screenshot
   inspection, scoped diff checks, and append the continuous graphics handoff.

## File or Module Ownership

- Terra Milestone 1:
  - a narrowly named pure phase helper/test under
    `apps/player/src/facility/`;
  - the smallest required `FacilityScene.ts` phase call-site hunk;
  - this plan's discoveries/progress.
- Terra Milestone 2 after Sol review:
  - one focused spec under `tests/e2e/`;
  - task-specific screenshots under `artifacts/screenshots/`;
  - only a narrowly gated renderer proof seam if existing live Phaser access
    cannot provide the required state.
- Sol owns milestone acceptance, actual diff/test/image review, cross-renderer
  regression selection, tiny integration corrections, and the handoff update.

## Acceptance Criteria

- For a fixed semantic surface and zoom, TileSprite `tilePositionX/Y` remains
  identical before and after a camera pan while sprite `x/y` translates by the
  clamped world delta.
- Sidewalk and room pattern samples remain at the same room-local pixels after
  aligning the before/after captures by the room's translation.
- Examination clinical flooring passes in both orientations; waiting and
  imaging floor families use the same corrected contract.
- A hallway's plank rows and staggered seams translate with the hallway
  rectangle without changing their local phase.
- Normal and Build modes agree; door openings, wall/furniture layering, and
  floor continuity remain unchanged.
- Focused tests, relevant existing visual regressions, workspace typecheck,
  production build, native image review, and `git diff --check` pass.

## Validation

- focused phase-helper Vitest
- dedicated desktop-Chrome floor-pattern pan proof, one worker
- existing Examination, door/floor-continuity, hallway-edge, Front Desk pan,
  and character/fixture occlusion visual regressions as relevant
- workspace typecheck and production build
- native inspection of all new screenshots
- scoped `git diff --check`

## Progress

- [x] Re-read repository instructions, current handoff, and dirty worktree.
- [x] Complete read-only shared renderer and Phaser TileSprite audit.
- [x] Implement stable TileSprite and procedural material phase; Terra Milestone 1/1b unit evidence reviewed.
- [x] Implement whole-pixel presentation origins; Terra Milestone 1c unit evidence reviewed.
- [x] Add and review live normal/Build pan proof; Terra Milestone 2 evidence accepted by Sol.
- [x] Complete final validation and update the graphics handoff.

## Discoveries

- `drawEnvironmentTile` currently cancels world translation with a new
  screen-derived tile phase on every redraw; this directly explains the
  sidewalk and Examination pattern sliding reported by the owner.
- Hallway flooring is procedural and already uses hallway-rectangle-relative
  row/seam positions. It needs proof rather than the TileSprite correction.
- The shared helper also serves repeated wall materials. The implementation
  must preserve their logical continuity and must not introduce an unrelated
  wall-fragment restart.
- `getEnvironmentTileLogicalPhase` subtracts `layout.originX/originY` before
  applying Phaser's positive, scale-aware TileSprite sample phase. Canvas
  TileSprite samples source pixels as `local / scale + phase`; this keeps a
  semantic surface invariant across panning and makes the source sample at one
  fragment's right/bottom edge equal the adjacent fragment's left/top sample.
- The procedural-floor audit found two additional screen-relative phase bugs:
  sidewalk slab joints began at a global screen multiple, and default clinical
  speckle parity used absolute rendered `y`. Sidewalk joints now begin at the
  sidewalk's semantic left edge, and `getProceduralSurfaceRow(y, top, step)`
  keeps speckle rows room-relative. Every other `drawRoomFloor` branch starts
  its marks from `left`/`top`; hallway plank rows and seams already use the
  hallway rectangle's local coordinates, so no hallway production change was
  required.
- Live normal-mode diagnosis confirmed the sidewalk TileSprite's own canvas
  bytes are exactly invariant through a real pan, and hiding
  `architectureGraphics` does not affect the main-canvas mismatch. The host's
  fractional CSS box maps a 53px drag to a fractional negative sprite x;
  direct main-canvas readback must account for Canvas renderer rounding (best
  aligned sample shifted by -1px) before it can be used as a temporal texture
  equality assertion.
- `snapPresentationOrigin` now rounds only the final clamped layout origin,
  leaving camera intent, clamping, zoom, and persistence untouched. Because
  the existing bounds are integers, the snapped origin remains in-range while
  TileSprites and procedural Phaser Graphics receive the same whole-pixel
  presentation translation.
- The final one-worker desktop-Chrome proof uses real non-pattern-multiple
  drags in normal and Build modes. It verifies integer nonzero layout deltas,
  exact TileSprite translation/phase/scale invariance for sidewalk, horizontal
  and vertical Examination, waiting, and imaging floors, plus strict (at most
  one channel) equality for a widened sidewalk-joint canvas patch and a
  hallway patch containing plank/seam marks. The current 100% captures are
  1020 by 421 pixels and visibly retain the representative room families,
  hallway, sidewalk, and Build-only grid.

## Exact Next Action

The owner should hard-refresh the canonical local game through `START_GAME.cmd`
at exactly `http://127.0.0.1:4173`, then pan across the sidewalk, rooms, and
hallways in normal and Build mode. Act only on a concrete remaining graphics
defect; say **"push to GitHub"** when this validated local checkpoint should be
backed up.
