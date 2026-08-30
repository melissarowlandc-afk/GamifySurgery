# Refine Front Desk Object Grounding and Seating

## Goal

Keep the approved Front Desk v4 architectural shell unchanged while correcting the independent furniture and actor composition shown in `Photos for Codex/Stray clock and no chair.PNG`.

## Requirements

- Preserve `apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png` and its live mapping exactly.
- Preserve the accepted v2 fixture artwork; change only its Front Desk sizing, floor-contact anchors, depth, and visibility.
- Treat logical floor footprint and visual sprite envelope as separate concepts. A fixture's footprint controls navigation/collision; its contact/base anchor places it on the floor; artwork may extend vertically toward/over the rear wall without moving its footprint.
- Keep the filing cabinet logically in A1 and water cooler/bin logically in A5.
- Increase the filing cabinet and water cooler visual size and ground their bases against the rear of the A row. Their complete sprite bounds must remain visible; no top, side, or bottom edge may be clipped.
- Keep the counter logically in C3 with C2/C4 traversable.
- Show one empty chair directly behind the counter whenever neither founder nor receptionist is seated there.
- When the founder or receptionist is seated, hide the separate empty-chair fixture because the authored seated sprite includes its chair.
- Move the seated presentation toward the counter enough that the worker looks tucked behind the desk and the desk naturally masks the lower body. Do not change the logical B3 anchor, routes, or task timing.
- Render exactly one wall clock in the Front Desk. Exclude the Front Desk from the generic every-room clock pass; retain the v4-mounted clock.
- Keep all fixture/character artwork independent and correctly depth-sorted.
- Update the visual source-of-truth with the footprint/contact/envelope distinction.

## Constraints and non-goals

- Do not redraw or replace assets.
- Do not alter the room shell, floor, walls, camera, landscaping, UI, gameplay, balance, collision, saves, clinical content, or other rooms.
- Do not delete prior assets or unrelated work.
- Do not commit, push, deploy, publish, install dependencies, or spawn subagents.

## Relevant repository state

- `apps/player/src/facility/frontDeskPresentation.ts` owns the Front Desk fixture ratios, anchors, and empty-chair helper.
- `apps/player/src/facility/FacilityScene.ts` currently treats fixture ratios as visual centers, adds a generic wall clock after every non-bathroom/non-control-room fixture switch, and draws the independent interactive water cooler through a separate path.
- The seated founder/receptionist bitmap already contains its own chair.
- `tests/e2e/front-desk-visual.spec.ts` currently proves only the occupied composition.
- The worktree is heavily dirty and unrelated changes must be preserved.

## Decisions already made

- The v4 shell is visually approved and immutable for this pass.
- The extra small clock comes from the generic room-clock pass, not the v4-mounted wall clock.
- Floor contact/base placement must replace center-based reasoning for these tall Front Desk objects.
- Empty and occupied desk states both require visual proof.

## Milestones

1. Add a Front Desk-specific grounded fixture placement contract separating contact anchors from sprite envelopes.
2. Enlarge and rear-ground the cabinet and water cooler without clipping.
3. Correct chair visibility and seated worker/counter overlap.
4. Remove the generic duplicate Front Desk clock.
5. Add focused tests and actual-app occupied/vacant screenshots.
6. Run focused regressions, typecheck, build, Playwright, and diff checks for Sol review.

## File or module ownership

- Terra owns `apps/player/src/facility/frontDeskPresentation.ts`, its tests, Front Desk-only seams in `FacilityScene.ts`, the interactive water-cooler Front Desk presentation seam, focused E2E proof, `docs/features/visual-art-direction.md`, and this plan's progress sections.
- Sol owns requirements interpretation, actual diff/screenshot review, and final acceptance.

## Acceptance criteria

- Cabinet, cooler, bin, chair, counter, board, and sole wall clock have complete visible edges.
- Cabinet and cooler are visibly larger and grounded against the rear wall while their logical A1/A5 occupancy is unchanged.
- A vacant B3 visibly contains one chair.
- An occupied B3 visibly contains one integrated seated chair and no duplicate chair.
- Seated founder/receptionist looks close to and partly concealed by the counter.
- Exactly one wall clock appears.
- The approved shell and every unrelated system remain unchanged.

## Validation

- Focused Front Desk presentation, manifest, water-cooler, camera, world-signature, facility-management, receptionist, and spatial tests.
- Occupied and vacant actual-app desktop captures.
- `npm.cmd run typecheck`.
- `npm.cmd run build`.
- Focused desktop Playwright.
- `git diff --check`.

## Progress

- [x] Inspected the owner screenshot and traced the duplicate clock, chair visibility, fixture grounding, water-cooler, and seated-pose seams.
- [x] Implement grounded fixture placement and composition corrections.
- [x] Capture occupied and vacant proofs.
- [x] Complete independent Sol validation and owner handoff.

## Discoveries

- The generic post-switch clock placement still applies to `room.front_desk`, producing the extra small clock beneath the v4-mounted clock.
- Front Desk fixture placement currently derives contact position from a center ratio and rendered height, which couples floor location to sprite aspect ratio and encourages clipping or undersizing.
- The grounded Front Desk contract now keeps A1/A5 logical occupancy while
  using separate contact anchors (`cabinet 0.12/0.30`, `cooler 0.89/0.30`) and
  larger visual envelopes. The generic room-clock pass explicitly excludes
  `room.front_desk`, leaving only the measured v4 clock.
- Occupied and vacant captures use genuine persisted founder locations. The
  separate work-chair art is hidden only when an authored seated founder or
  receptionist occupies B3; the vacant B3 capture visibly retains exactly one
  chair.
- The final composition refinement narrows the desk envelope to `0.52 × 0.35`
  centered on C3, moves the chair contact to `0.50`, and rear-grounds the
  cabinet/cooler at `y=0.26`. The cooler uses `x=0.84` while the bin uses
  `x=0.96`, giving the two distinct full-sprite positions within logical A5.

## Exact next action

Sol must inspect the refreshed occupied and vacant proofs after the compact
desk/bin-cooler composition correction before owner handoff.
