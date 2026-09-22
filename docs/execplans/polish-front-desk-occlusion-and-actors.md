# Polish Front Desk Actors, Occlusion, and Shared Walls

## Goal

Correct the current Front Desk presentation so the founder retains canonical
character scale and complete visible anatomy, the authored counter/computer is
not cropped, every interior object and shadow respects structural wall
occlusion, and backed north/south shared wall segments are visibly taller while
remaining short cutaway walls.

## Requirements

- A stationary seated founder or receptionist at the Front Desk staff anchor
  uses the same authored map scale as the standing character.
- Seated founder heads and standing front/side founder feet remain present in
  the source frame and are not accidentally clipped by renderer composition.
- The Front Desk source frame includes the full computer top and east edge.
- Interior fixtures, characters, and their shadows cannot paint over a solid
  wall segment; real doorway gaps remain completely open.
- Wall-mounted decoration remains on its wall rather than being hidden behind
  a foreground wall pass.
- Backed north wall segments between north/south-adjacent constructed spaces
  become materially taller and more prominent, but remain much shorter than
  exposed rear walls and south foreground walls.
- Changes remain presentation-only and apply consistently in normal and Build
  modes.

## Constraints and non-goals

- This is a graphics-only thread. Do not change routes, collision, room tile
  footprints, door legality, buildability, simulation, saves, staffing logic,
  or clinical/gameplay content.
- The working tree contains extensive concurrent user/agent changes. Preserve
  every unrelated hunk and never overwrite existing general proof images.
- Do not use Codex native image generation for existing art. Cortan is the
  required route if raster generation becomes necessary; this task currently
  needs no generation because the complete pixels already exist in source.
- Do not globally change Phaser filtering, environment rendering, or unrelated
  room furniture.
- Do not commit, push, deploy, or release without explicit owner direction.

## Relevant repository state

- Founder map atlases are already 128 by 192 per cell with floor anchor 181.
  A complete-cell audit found all thirty front, side, and seated identities
  retain head and foot pixels inside transparent gutters; this is not an asset
  regeneration problem.
- `FRONT_DESK_PRESENTATION.v5ActorDisplay.staff.scale` is `0.82`, which changes
  a reference 70-by-105 actor into roughly 58 by 87 only while stationary at
  the desk.
- The full Front Desk alpha component in
  `front-desk-components-v2.png` occupies x=480..991 and y=82..387. The live
  source rect x=476, y=108, width=492, height=281 cuts 26 pixels from the top
  and 24 pixels from the east edge.
- A four-pixel transparent safety rect around that measured component is
  `{ x: 476, y: 78, width: 520, height: 314 }`.
- Canonical shell base pieces render at `FACILITY_DEPTH_WORLD + 4`, while
  fixtures/characters/shadows use the sortable 100,000+ band. Only south wall
  pieces currently receive a foreground occluder duplicate, so other solid
  structural edge pieces cannot cover accidental spill.
- `SHORT_NORTH_HEIGHT_PER_TILE` is currently `0.10`, only about five to six
  pixels at common map scale.

## Decisions already made

- Set only the protected Front Desk staff display scale to `1`; retain its
  existing x/y contact and do not change logical location. The public-side
  stationary-patient scale is outside this founder-specific correction unless
  live proof demonstrates the same defect.
- Replace the Front Desk frame crop with the measured four-pixel-safety rect;
  do not edit or regenerate the PNG.
- Raise the shared backed-north height to `0.18` tile. It remains well below
  the canonical south foreground wall height and stays inside the southern
  room footprint.
- Add an explicit doorway-aware wall-occlusion presentation layer instead of
  lowering furniture depths, which would break correct actor/fixture baseline
  ordering. South exterior behavior and wall-mounted decor must remain valid.
- Add new task-specific proof names; never overwrite the existing broad Front
  Desk, doorway, or shared-wall captures.

## Milestones

1. Correct the deterministic Front Desk asset/presentation contracts: full
   counter crop, seated staff scale 1, exact unit tests, and diff validation.
2. Implement the shared shell wall-occlusion layer and 0.18-tile backed-north
   height, with pure geometry/depth tests and minimal `FacilityScene` hunks.
3. Add a focused live browser proof covering seated founder, standing front and
   side founder, complete counter/computer, object/shadow occlusion, doorway
   gaps, and prominent backed shared walls in normal and Build modes.
4. Run scoped unit tests, typecheck, build, relevant existing E2E regressions,
   new E2E proof, native screenshot inspection, and final diff/handoff review.

## File or module ownership

- Milestone 1 Spark:
  - `apps/player/src/art/bitmapAssetManifest.ts` (Front Desk crop hunk only)
  - `apps/player/src/art/bitmapAssetManifest.test.ts` (matching assertion only)
  - `apps/player/src/facility/frontDeskPresentation.ts` (staff scale only)
  - `apps/player/src/facility/frontDeskPresentation.test.ts` (scale assertions)
- Milestone 2 Terra:
  - `apps/player/src/facility/canonicalRoomShell.ts`
  - `apps/player/src/facility/canonicalRoomShell.test.ts`
  - `apps/player/src/facility/frontDeskV5Architecture.ts`
  - `apps/player/src/facility/frontDeskV5Architecture.test.ts`
  - character/wall-occlusion-only hunks in `apps/player/src/facility/FacilityScene.ts`
  - narrow depth/geometry tests if required
- Milestone 3 Terra:
  - one new focused E2E spec under `tests/e2e/`
  - new `artifacts/screenshots/front-desk-occlusion-*` proof files
  - this ExecPlan's evidence and progress
- Sol owns integration review and the final handoff update.

## Acceptance criteria

- The Front Desk frame source rect encloses its entire measured alpha component
  with a four-pixel safety gutter and remains inside its atlas.
- Stationary staff presentation reports scale 1; live seated and standing
  authored character dimensions match at the same zoom.
- Live proof shows the seated founder's complete head and standing front/side
  feet, with no source-edge alpha contact.
- The computer top and east counter edge are visibly complete.
- No fixture, character, procedural shadow, or authored contact shadow renders
  over a solid wall/cap; wall art is still visible and doors remain unpainted.
- Backed north segments are 0.18 tile high, visually more prominent, continuous
  across shared boundaries, and absent at doors.
- Focused unit, typecheck, build, E2E, and diff validations pass.

## Validation

- focused Vitest for bitmap manifest, Front Desk presentation, canonical shell,
  Front Desk v5 architecture, and any render-depth seam
- `npm.cmd run typecheck`
- `npm.cmd run build`
- existing doorway/shared-wall/front-desk Playwright regressions
- new focused desktop-Chrome visual proof in normal and Build modes
- native inspection of every new screenshot
- `git diff --check` on owned text files

## Progress

- [x] Read applicable repository instructions and prior graphics handoff.
- [x] Audit founder cells, display scaling, Front Desk alpha bounds, wall depths,
  and backed shared-wall geometry.
- [x] Implement Milestone 1: corrected the connected counter/computer crop to
  the measured four-pixel-safety rect and restored stationary Front Desk staff
  to canonical scale 1 while retaining its x/y contact and public scale 0.82.
  Sol reviewed the exact owned diff and independently reran focused Vitest
  (2 files, 23 tests) plus scoped diff validation; all passed.
- [x] Implement Milestone 2: raised backed-north segments to exactly 0.18
  tile and added duplicate, door-subtracted structural occluders for every
  solid non-floor north/west/east/backed-short edge, while retaining the
  south foreground occluder. Canonical wall decor is promoted one stable depth
  above the structural copy. Focused shell/Front Desk Vitest (2 files,
  27 tests), workspace typecheck, and scoped diff validation passed. Sol
  reviewed the actual diff and independently reran all three validations;
  browser proof remains required before visual acceptance.
- [x] Complete Milestone 3 live proof: added a controlled desktop-Chrome
  Playwright spec for seated/standing founder atlas cells and scale, the full
  counter crop, foreground wall depth, the persisted doorway aperture, generic
  wall-decor depth, and Build-mode rendering. Captured and native-inspected
  `front-desk-founder-{seated,standing-front,standing-side}-100-desktop.png`
  plus `front-desk-occlusion-{normal,build}-100-desktop.png`; no harmful
  over-occlusion was observed. Sol rejected the initial standing captures
  because the desk hid the feet, moved the proof poses from occupied C3 to
  open C4, reran the focused spec, and native-inspected the corrected images.
- [x] Complete final validation and record the shared graphics handoff. Sol
  independently passed 50 focused Vitest tests, the new desktop-Chrome proof,
  five existing visual regressions, workspace typecheck, production build,
  and scoped diff validation.

## Discoveries

- The founder pose PNGs are complete; apparent anatomical clipping is a live
  composition/occlusion issue and should not be treated with destructive crop
  or alpha changes.
- The counter defect is deterministic source-rectangle truncation, so ComfyUI
  would add risk without supplying any missing pixel data.
- Preserving baseline depth sorting requires walls to gain a foreground
  structural layer rather than moving every fixture into a low global band.

## Exact next action

The milestone is complete. Preserve this graphics-only checkpoint, let the
owner inspect it through the existing local pathway, and do not push, deploy,
or begin a different graphics milestone without an explicit request.
