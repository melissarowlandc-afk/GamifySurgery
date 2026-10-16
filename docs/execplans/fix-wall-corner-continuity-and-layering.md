# Fix Wall Corner Continuity and North-Wall Layering

## Goal

Match the annotated `Photos for Codex 2/Wall fix.PNG` by extending every owned
west/east side cap to the top of its adjacent tall north wall, preserving a
continuous short junction when that north corner is backed by another
constructed space, making all rendered side caps visibly match the Front Desk,
and correcting depth so room contents sit behind west/east/south walls but in
front of north-facing walls.

## Requirements

- An exposed west/east side wall whose northmost owned run reaches a tall north
  corner begins at the tall north wall's top and continues without a gap to the
  normal side run.
- A side wall next to a backed short north segment begins at the floor's north
  edge; it does not recreate a tall corner.
- A live north-corner door or a live side door in the northmost side tile never
  receives a wall extension or shoulder.
- Front Desk, both Examination orientations, every canonical enclosed room,
  and hallways use the same side-cap width, source-frame family, and ownership
  grammar.
- Fixtures, characters, procedural shadows, and authored contact shadows layer
  behind west/east/south walls and in front of tall or backed-short north walls.
- North-wall decor remains above its supporting north wall but below ordinary
  floor furniture/actors that physically overlap it.
- Normal and Build modes show the same wall geometry and complete door gaps.

## Constraints and non-goals

- Graphics-only. Do not change room footprints, tile ownership, buildability,
  door legality, routes, collision, saves, simulation, staffing, or clinical
  content.
- Preserve the heavily dirty shared working tree and every unrelated hunk.
- Do not regenerate wall art. The existing canonical cap sprites and geometry
  are sufficient; neither Cortan nor Codex-native image generation is needed.
- Keep `SIDE_WIDTH_PER_TILE = 0.15` unless live rendered evidence disproves the
  existing equal-width unit contract. Do not add an Examination-only width.
- Treat `Photos for Codex 2/Wall fix.PNG` as an owner reference input, not a
  repository deliverable to modify or commit.
- Do not commit, push, deploy, or release without explicit owner direction.

## Relevant repository state

- `getCanonicalRoomShellLayout` and `getCanonicalHallwayEdgeComponents` own all
  target west/east geometry. Their side components currently begin at
  `floor.y + run.start`, while tall north walls project upward by
  `geometry.northHeight`.
- Front Desk and both Examination orientations already calculate identical
  side width at one map scale and use `westCap` / `eastCap`.
- The previous milestone duplicates north, west, east, and backed-short north
  walls as `structural-occluder`; the clarified requirement excludes every
  north-facing segment.
- Front Desk, canonical rooms, and hallways foreground every non-base copy.
  Examination incorrectly foregrounds only `front-occluder`, leaving its side
  structural copies at base depth.
- North-wall decor was promoted above the prior north structural copy. Once
  that copy is removed, decor must return to a wall-level depth below floor
  contents.

## Decisions already made

- Extend the existing owned side component rather than adding a parallel
  corner object. This preserves keys, frame identity, wall ownership, and
  doorway subtraction.
- Extend only when the side run begins at zero and a tall north run reaches the
  same west/east corner. A backed-short corner, missing north wall, or
  northmost side-door gap therefore remains unextended.
- Derive structural occluders only from west/east base components; retain the
  existing south `front-occluder` and leave all north components base-only.
- Change Examination's depth branch to foreground every non-base copy, matching
  the other shell renderers.
- Render generic wall decor at `FACILITY_DEPTH_WORLD + 21`, authored Front Desk
  decor at `+21`, and Examination wall art at `+22`: above base north walls but
  below sortable furniture and characters.
- Prove apparent thickness with live Phaser display bounds for Front Desk and
  Examination, not only source-space or pure-geometry assertions.

## Milestones

1. Implement the shared side-cap continuation, corrected north/side occluder
   contract, Examination depth parity, wall-decor depth, and focused unit tests.
2. Add a dedicated desktop-Chrome proof for isolated tall corners, backed-short
   corners, north/side door gaps, equal Front Desk/Examination side thickness,
   corrected north-versus-side depth, and normal/Build screenshots.
3. Run focused unit tests, typecheck, build, relevant existing Playwright
   regressions, native screenshot inspection, scoped diff validation, and
   update the continuous graphics handoff.

## File or module ownership

- Milestone 1 Terra:
  - `apps/player/src/facility/canonicalRoomShell.ts`
  - `apps/player/src/facility/canonicalRoomShell.test.ts`
  - `apps/player/src/facility/frontDeskV5Architecture.test.ts`
  - `apps/player/src/facility/examinationV3Architecture.test.ts`
  - narrow depth-only hunks in `apps/player/src/facility/FacilityScene.ts`
  - corrected assertions in `tests/e2e/front-desk-occlusion-polish.spec.ts`
- Milestone 2 Terra:
  - one new focused E2E spec under `tests/e2e/`
  - new `artifacts/screenshots/wall-corner-continuity-*` proof files only
  - narrow corrections in the Milestone 1 modules if live pixels require them
- Sol owns planning, actual diff/test/image review, integration corrections,
  final validation, and the handoff update.

## Acceptance criteria

- For an exposed tall corner, side `bounds.y` equals
  `floor.y - geometry.northHeight`, and its height equals the original owned
  run plus `geometry.northHeight`.
- Backed-short corners and live north/side corner doors have no upward side
  extension.
- Front Desk, horizontal Examination, and vertical Examination live side images
  use equal display widths at one zoom and the canonical cap frames.
- No north or north-short component has a `structural-occluder` copy. Every
  solid owned west/east component does; south retains `front-occluder`.
- Live fixture/actor depth exceeds the north wall/decor depth, while west/east
  and south occluder depth exceeds overlapping room contents.
- Door apertures remain floor-to-floor with no dark shoulder in normal or
  Build mode.
- Final screenshots visibly match the red A/B intent in `Wall fix.PNG`.
- Focused tests, typecheck, build, relevant E2E regressions, and diff checks
  pass.

## Validation

- focused Vitest for canonical shell, Front Desk v5 architecture, Examination
  v3 architecture, and any directly affected presentation contracts
- new desktop-Chrome wall-fix Playwright proof
- existing `top-down-side-wall-caps`, `backed-north-room-walls`,
  `examination-room-visual`, `front-desk-occlusion-polish`, and door-continuity
  regressions
- `npm.cmd run typecheck`
- `npm.cmd run build`
- native inspection of every new screenshot
- scoped `git diff --check`

## Progress

- [x] Read repository instructions, the current graphics handoff, dirty tree,
  annotated owner reference, shared shell code, and renderer depth paths.
- [x] Complete a read-only cross-room/hallway geometry and depth audit.
- [x] Implement Milestone 1 correction pass: extended existing west/east cap runs into exposed
  tall north corners, restricted structural copies to side caps, corrected
  Examination foreground depth parity, and restored north-wall decor to the
  non-sortable wall band. Focused Vitest (3 files, 31 tests), workspace
  typecheck, and scoped diff validation passed; the final explicit corner,
  hallway, orientation, and layer correction pass now has 36 focused tests.
  Sol reviewed the actual diff and independently reran those tests, workspace
  typecheck, and scoped diff validation; all passed.
- [x] Complete Milestone 2 controlled desktop proof: `wall-corner-continuity.spec.ts`
  constructs the exposed Front Desk, both Examination orientations, a backed
  waiting room, and a first-slot north/west-door waiting room. It asserts their
  live Phaser side bounds, shared widths, doorway apertures, and north/decor /
  founder / side-south occluder depth ordering in both normal and actual Build
  mode. Desktop Chrome passed 1/1 (23.1s); native inspection of
  `wall-corner-continuity-normal-100-desktop.png` and
  `wall-corner-continuity-build-100-desktop.png` confirmed exposed continuous
  caps, backed short-wall continuity, clear corner door gaps, and matching
  Front Desk/Examination cap thickness. Sol subsequently accepted the browser
  contract and both regenerated images.
- [x] Complete final validation and record the graphics handoff. Sol reviewed
  the final E2E source, made the tiny test-only correction that pins the proof
  scene paused while hiding only its pause overlay, independently reran the
  focused proof, and natively accepted both regenerated images. Final evidence:
  36/36 focused Vitest tests, workspace typecheck, production build and
  boundary checks, and all 10 relevant desktop-Chrome scenarios ultimately
  passed. The one scenario that creates two fresh Examination capture pages
  exceeded the suite's existing 60-second ceiling in the combined run; its
  isolated 120-second diagnostic rerun passed 1/1 in about 1.1 minutes. Scoped
  diff validation passed.

## Discoveries

- The Examination room has no independent side-width constant or cap art; its
  apparent thinness is not caused by a separate geometry standard.
- Missing northward cap continuation made the short Examination side read
  thinner, and its renderer had failed to elevate side structural copies.
- The prior north-wall occluder and promoted wall-decor depth were coherent for
  the previous interpretation but conflict with the owner's clarified layering
  rule and must be revised together.

## Exact next action

No implementation remains in this bounded graphics milestone. The owner can
playtest through `START_GAME.cmd` at `http://127.0.0.1:4173`; a GitHub backup
still requires the explicit instruction **"push to GitHub"**.
