# Correct the Front Desk four-row floor and tile-authored layout

## Goal

Make the Front Desk visibly and geometrically read as the same exact 5-by-4
tile footprint used by Build Mode. The north/back wall must rise outside the
floor at row A's north edge rather than replacing or compressing row A. Align
the authored furniture, wall art, chair facing, legal visual door slots, and
adjacent-door presentation to the owner's A-D / 1-5 tile contract.

## Requirements

- The floor occupies all 5 columns and all 4 rows inside the logical room
  rectangle. At the shared map scale, one Front Desk visual tile must be the
  same width and height as one Build Mode tile.
- A tall exposed north wall extends upward from the north edge of row A and
  consumes no floor or buildable space. A backed north segment retains the
  previously accepted shallow-wall rule without shrinking the floor.
- Use the owner's room-local notation: rows A-D run north to south and columns
  1-5 run west to east.
- Filing cabinet: A1, grounded against the north wall.
- Notice board and clock: mounted on the north wall above A2. They disappear
  only when that wall support is absent or a door removes their exact slot.
- Water cooler and waste bin: A5, grounded against the north wall.
- Reception desk: C2-C3. The seated founder/receptionist remains logically at
  the existing B3 staff anchor, but its display ground-contact sits at the
  exact junction of B2, B3, C2, and C3: normalized `{ x: 0.4, y: 0.5 }`.
  The vacant secretary chair uses that same junction so occupied and vacant
  states do not jump.
- Visitor/waiting chair: D5, using existing authored art that visibly faces
  left into the room.
- Visual Build Mode door-clear slots are north A2/A3/A4 (offsets 1/2/3), east
  rows B/C (offsets 1/2), west rows B/C/D (offsets 1/2/3), plus the protected
  south entrance at D3 (offset 2). The engine stores east/west doors by side
  and row offset only; the owner's `B4`/`C4` labels therefore preserve their
  B/C row meaning at the room's actual east boundary.
- Consecutive door slots on one source-room wall render as one continuous wide
  opening only when their outside cells enter the same adjacent room or hallway
  instance. If those outside cells enter different room/hallway instances, the
  adjacent doors retain a separating jamb and read as two distinct doors.

## Constraints and non-goals

- Graphics/presentation only. Do not change room definitions, logical
  footprint, blocked tiles, patient waiting anchors, routing, collision,
  placement validation, saves, costs, progression, balance, timing, clinical
  content, or encounter behavior.
- In particular, D5 chair use by waiting patients is not implemented here;
  that routing behavior belongs in the gameplay/systems thread.
- Preserve the adjacency-aware shallow north-wall behavior and thin top-down
  east/west cap work already present in the dirty tree.
- Preserve unrelated workspace-divider and UI-density work and the three
  protected diagnostic screenshots. Do not reset, clean, broadly stage, or
  rewrite concurrent files outside the named renderer seams.
- Reuse existing checked-in atlas artwork. The waiting-room atlas already
  contains the opposite-facing visitor chair, so do not use Cortan or local
  image generation and do not modify a source PNG.
- Do not commit, push, merge, deploy, or release.

## Relevant repository state

- Branch `beta` tracks `origin/beta`; the deployed graphics baseline remains
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The local graphics tree contains completed but uncommitted canonical cap and
  adjacency-aware north-wall work. `FacilityScene.ts`,
  `canonicalRoomShell.ts`, the bitmap manifest, their tests, accepted captures,
  the handoff, and related plans are already dirty.
- Concurrent React/CSS workspace-divider and density work is also dirty and is
  unrelated to this milestone.
- `getFrontDeskV5Projection` currently compresses the 5-by-4 logical rectangle
  into a 1.53:1 display floor, reducing the visible floor height from four
  tiles to about 3.27 tiles while keeping the south edge fixed. This is the
  direct cause of row A appearing to be occupied by the rear wall.
- The canonical shell already places a tall north wall above `floor.y`; once
  the Front Desk floor projection equals the logical rectangle, no wall-space
  reservation is needed.
- The canonical wall-run helper already accepts multiple openings, but
  adjacent apertures leave a wall remnant and `drawExplicitDoor` draws both
  interior jambs. The wide-opening rule needs a presentation-only grouping
  seam.

## Decisions already made

- Remove the shallow display-floor distortion. `floorBounds` must equal the
  full logical 5-by-4 pixel rectangle, with `scaleX` and `scaleY` both equal to
  the map tile size for a correctly sized room.
- Express fixture contacts and accepted proof assertions in explicit tile
  terms, even if normalized values remain the renderer's storage format.
- Correct the Front Desk-specific visitor-chair frame to use the already
  authored left-facing chair in the existing waiting-room atlas; leave other
  rooms' chair selection unchanged.
- Treat consecutive openings as one visual run only when source room, side,
  and resolved adjacent destination instance all match. Both doors may be
  owned by the Front Desk while leading to different northern spaces, so source
  room plus side alone is not sufficient grouping identity.

## Milestone and ownership

This is one coupled renderer milestone for a `terra_worker`; correcting the
projection changes architecture, fixture contacts, actor presentation, wall
decor, visual door eligibility, door-frame grouping, and production proof
together.

Terra owns the smallest necessary changes in:

- `apps/player/src/facility/frontDeskV5Architecture.ts` and focused tests;
- `apps/player/src/facility/frontDeskPresentation.ts` and focused tests;
- `apps/player/src/facility/roomVisualLayout.ts` and focused tests;
- `apps/player/src/art/bitmapAssetManifest.ts` and focused tests for the
  Front Desk-only left-facing chair crop;
- `apps/player/src/facility/canonicalRoomShell.ts` and focused tests only if
  needed to remove same-room consecutive wall remnants;
- a small pure door-presentation helper and tests if that keeps grouping out of
  `FacilityScene.ts`;
- the narrow `FacilityScene.ts` integration;
- one dedicated Build Mode E2E/capture proving the 5-by-4 tile floor, fixture
  positions, door slots, same-room wide opening, and different-room separation;
- intentionally refreshed Front Desk/canonical captures affected by the
  corrected floor height; and this plan's implementation progress.

Sol owns product interpretation, dirty-tree protection, review of the actual
diff, native-resolution capture inspection, correction requests, integrated
validation, and completion handoff.

## Acceptance criteria

- Build Mode visibly shows 20 square Front Desk floor tiles: five columns and
  four rows, all inside the room footprint.
- The exposed north wall begins at the north edge of row A and extends only
  outward/upward; it does not cover or replace row A.
- Backed shallow north segments also begin at the north floor edge without
  shrinking the 5-by-4 floor.
- Cabinet A1, wall decor above A2, cooler/bin A5, desk C2-C3, founder behind
  the desk, and left-facing chair D5 are visually unambiguous at 100% zoom.
- Build Mode offers exactly the requested Front Desk visual clear candidates
  on north/east/west while retaining the protected D3 south entrance.
- Two consecutive Front Desk doors into the same adjacent room/hallway have a
  single uninterrupted wide aperture. A neighboring proof with consecutive
  Front Desk doors entering different adjacent room/hallway instances retains
  a separating jamb and two distinct openings.
- Examination remains a correct 3-by-2 or 2-by-3 floor, and canonical room
  wall/cap/adjacency proofs show no regression.
- No gameplay/domain file changes and no raster source changes occur.

## Validation

- Focused Vitest for Front Desk projection/presentation, room visual door
  layout, bitmap manifest, canonical shell/door grouping, and existing
  adjacency/cap regressions.
- Player workspace typecheck and production build.
- Dedicated 100% desktop Build Mode Playwright proof.
- Existing Front Desk, top-down side-cap, adjacency-aware north-wall,
  examination, and canonical matrix/hallway visual regressions as proportionate
  to the changed output.
- Sol native-resolution review of every accepted/refreshed capture.
- `git diff --check` and scoped diff/status audit against concurrent work.

## Progress

- [x] Read repository instructions and inspect the dirty shared worktree.
- [x] Audit Front Desk projection, fixture metadata, Build Mode visual door
  filtering, canonical wall apertures, explicit door drawing, and domain door
  coordinates.
- [x] Record the tile-coordinate and graphics-only scope contract.
- [x] Delegate and implement the bounded renderer milestone.
- [x] Complete Sol diff/visual review, integrated validation, and handoff.
- [x] Apply the owner's follow-up correction moving the occupied and vacant
  desk seat to the B2/B3/C2/C3 junction, including Sol review and acceptance.

## Discoveries

- The room definition and navigation already use the correct 5-by-4 logical
  footprint. This is a presentation defect, not a footprint or Build Mode
  placement defect.
- East/west `DoorState.offset` is a zero-based row, so east B/C is exactly
  offsets 1/2 regardless of the column label used conversationally.
- The domain already permits distinct adjacent door slots and rejects only a
  duplicate physical segment. No domain change is required for the requested
  visual wide-opening behavior.
- The source waiting-room atlas visibly contains both chair perspectives. The
  current Front Desk override points to the wrong one despite its comment
  claiming that it faces left.
- The correct D5 left-facing crop is the opposite-facing authored source region
  `{ x: 865, y: 681, width: 232, height: 254 }`; the prior crop was its
  right-facing counterpart.
- Presentation-only door grouping must resolve the actual outside cell for
  each door. Consecutive offsets merge only if that cell belongs to the same
  destination room/hallway instance; a different destination retains its
  individual frame and jamb.

## Terra implementation evidence

- Restored `getFrontDeskV5Projection(...).floorBounds` to the complete logical
  five-by-four display rectangle, retaining short backed north runs through
  the canonical shell rather than reserving rear-wall floor space.
- Authored Front Desk contacts now express A1 cabinet, A5 cooler/bin, C2-C3
  counter, B3 staff/empty chair alignment, D5 left-facing visitor chair, and
  wall-art bounds wholly inside A2. Renderer-only visual door zones enumerate
  north 1/2/3, east 1/2, south 2, and west 1/2/3.
- Added `doorPresentation.ts`: pure destination-aware grouping handles north
  and east/west runs without changing domain door data. `FacilityScene` uses
  the resulting run only to draw shared aperture/frame pixels.
- Dedicated captures:
  - `artifacts/screenshots/front-desk-four-row-floor-build-candidates-100-desktop.png`
    (full floor and unoccupied visual door candidates, protected exterior D3 retained)
  - `artifacts/screenshots/front-desk-four-row-floor-door-runs-100-desktop.png`
    (north offsets 1/2 into Examination merge; offset 3 into Bathroom remains separate)
  - `artifacts/screenshots/front-desk-v4-shell-normal.png`
    (isolated/exposed north wall outside row A and A2 wall art)
- Focused Vitest: 9 files / 83 tests passed.
- Player typecheck passed. Player production build passed (297 modules; only
  the pre-existing large-chunk advisory).
- Dedicated desktop Chromium proof passed: 1 test in 23.5 seconds.
- `git diff --check` passed.

## Terra follow-up correction evidence

- Preserved the logical `anchors.staff` / grid B3 coordinates at `{ x: 2,
  y: 1 }` and did not alter seated predicates, staff routing, or any domain
  data. Changed only the display-only staff pose and vacant `secretaryChair`
  contact to the requested four-tile junction `{ x: 0.4, y: 0.5 }`.
- Exact unit assertions now prove the B3 logical anchor, occupied visual pose
  `{ x: 0.4, y: 0.5, scale: 0.82 }`, and vacant chair contact
  `{ x: 0.4, y: 0.5 }` are aligned. Public anchor, door, and floor assertions
  remain unchanged.
- Refreshed and inspected at native resolution:
  `artifacts/screenshots/front-desk-grounded-occupied.png` and
  `artifacts/screenshots/front-desk-grounded-vacant.png`.
- Validation: `npm.cmd run test --workspace @gamify-surgery/player --
  frontDeskPresentation.test.ts` — 1 file / 11 tests passed;
  `npm.cmd run typecheck --workspace @gamify-surgery/player` — passed;
  `npm.cmd run build --workspace @gamify-surgery/player` — passed (297
  modules, existing large-chunk advisory only); desktop Chrome
  `tests/e2e/front-desk-visual.spec.ts` refreshed the occupied/vacant proof.

## Sol acceptance evidence

- Reviewed the task-owned source and test diff, including the generalized
  destination-aware door grouping seam. No gameplay/domain package or raster
  source file changed for this milestone.
- Inspected the accepted Front Desk, backed-north-wall, canonical room,
  top-down side-cap, and hallway captures at native resolution. The floor reads
  as twenty square tiles; the north wall begins outside row A; all requested
  fixtures and the D5 left-facing chair are in their authored tile locations;
  and the protected south entrance remains present.
- Independently reran focused Vitest: **9 files / 83 tests passed**.
- Independently reran the player workspace typecheck: passed.
- Independently reran the player production build: **297 modules** transformed;
  only the existing large-chunk advisory remains.
- Independently ran the dedicated Front Desk proof together with the existing
  Front Desk, backed-wall, canonical-room matrix, canonical-hallway, and
  top-down side-cap desktop regressions: **6/6 passed** in about 2.3 minutes.
- Final `git diff --check` passed, and the rejected stale
  `front-desk-four-row-floor-build-100-desktop.png` proof is absent.
- Existing checked-in atlas art was sufficient. Neither Cortan nor local image
  generation was used, and no commit, push, or deployment was performed.

## Sol follow-up acceptance evidence

- Reviewed the actual presentation/test diff and confirmed that logical B3
  `{ x: 2, y: 1 }`, staff predicates, routing, and domain data are unchanged.
  Only the occupied staff display and vacant chair presentation now share the
  exact `{ x: 0.4, y: 0.5 }` floor contact.
- Inspected the independently regenerated occupied and vacant captures at
  native resolution. The founder/receptionist now reads as seated immediately
  behind the C2-C3 desk, with the desk naturally occluding the lower seated
  body; the vacant chair occupies the same seat without a visual jump.
- Independently reran focused Vitest: **1 file / 11 tests passed**.
- Independently reran the player typecheck: passed.
- Independently reran desktop Chrome `front-desk-visual.spec.ts`: **1/1
  passed** in 47.3 seconds. Terra's production build passed for **297 modules**
  with only the existing large-chunk advisory.
- Final `git diff --check` passed after completion documentation.

## Exact next action

The owner should review/playtest the corrected occupied and vacant desk seat.
Continue here only for a concrete graphical correction; staff behavior and
routing remain in the gameplay/systems threads. Say **"push to GitHub"** when
this local checkpoint should be backed up or released; no commit, push, or
deployment is authorized.

Later controlling doorway decision: the completed
`render-doorways-as-full-floor-continuous-cutouts.md` milestone supersedes this
plan's synthetic frame/jamb presentation. Destination identity still resolves
the true adjacent room, but persisted openings are now full-tile source and
reciprocal cutouts whose floor patterns meet directly.
