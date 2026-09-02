# Edge-Anchored Rails And Overlay Map Zoom

## Goal

Give the map and desk the greatest practical horizontal and vertical area: keep
the patient rail flush with the left viewport edge and the operations rail flush
with the right viewport edge on every multi-column screen, let the center
workspace fill the entire gap between them, and replace the facility's
full-width title row with a compact zoom overlay in the map's top-right corner.

## Requirements

- On layouts that show three columns, the left rail begins at the viewport's
  left edge and the right rail ends at its right edge, including ultrawide
  screens wider than 1920 CSS pixels.
- The center column grows continuously between the two side rails, separated
  only by the intentional inter-column gaps/borders. Do not retain a centered
  maximum-width wrapper or decorative outer horizontal gutters.
- Preserve the current bounded/clamped rail widths so additional width benefits
  the facility map and clinical desk rather than stretching the information
  rails without limit.
- Remove the visible facility title and the full-width black facility heading.
- Keep the minus button, current zoom percentage, and plus button together in a
  small black box overlaid at the top-right of the map. The overlay consumes no
  layout height and stays wholly inside the map at every supported viewport.
- Preserve the zoom buttons' accessible names and disabled limits. Give the
  control group an accessible label and expose the current percentage without
  restoring the removed visible title.
- Preserve Phaser's container-driven resize behavior: expanding the center must
  resize the canvas backing bitmap to its host rather than CSS-stretching or
  squashing the rendered map.
- Preserve the draggable map/desk splitter, Build Mode, Management Mode, open
  charts, pause indicator, map interactions, tutorial anchors, and phone layout.

## Constraints and non-goals

- This task changes shell geometry and map controls only. It does not redesign
  either information rail, change their contents, alter facility art/camera
  rules, or modify clinical content.
- Phone may retain its existing single-column/stacked behavior; edge assertions
  apply whenever both side rails and the center are simultaneously visible.
- Keep controls comfortably clickable and keyboard-focusable. Do not shrink the
  zoom buttons merely to make the box decorative.
- Do not stage, commit, push, deploy, reset, clean, or delete anything. Preserve
  all unrelated Management, splitter, density, chart, graphics, clinical,
  screenshot, documentation, and handoff changes in the shared dirty worktree.

## Relevant repository state

- `AppShell.tsx` renders the patient rail, center workspace, and operations rail
  as direct children of `.game-grid-workspaces`. The facility heading currently
  supplies both the visible facility title and the zoom controls.
- The effective desktop grid is in the late `global.css` responsive cascade.
  It currently has `max-width: 1920px`, automatic horizontal margins, and
  horizontal padding; those combine into outer gutters and increasingly large
  unused margins above 1920px.
- Rail tracks are already clamped while the center uses `minmax(..., 1fr)`, so
  removing the wrapper cap/gutters lets the center consume added width without
  stretching the rails beyond their existing bounds.
- `.facility-host` is already positioned, clipped, and flexible. FacilityCanvas
  observes the host and resizes its backing bitmap, so an absolute overlay can
  consume no row height and lateral growth remains proportionally rendered.
- Existing pause/menu/tutorial overlays have their own stacking levels. The new
  zoom group must stay clickable without blocking map input beyond its small
  rectangle.
- `ui-density.spec.ts`, `golden-slice-visual.spec.ts`, and `visual-ui.spec.ts`
  explicitly reference the old heading and require intent-preserving updates.
  `workspace-splitter.spec.ts` already exercises canvas host/backing dimensions.
- The working tree contains extensive approved and in-progress changes owned by
  other milestones, including overlapping edits in `AppShell.tsx`,
  `global.css`, E2E specs, design documentation, and the handoff.

## Decisions already made

- Apply edge anchoring only in the final desktop/tablet media-query cascade:
  remove the grid's maximum width, automatic horizontal centering, and
  horizontal padding while retaining intentional gaps and vertical spacing.
- Keep the existing clamped left/right tracks and flexible center track.
- Remove the heading markup rather than visually hiding it. Give the facility
  section an explicit accessible map label so no dangling `aria-labelledby`
  remains.
- Place a new, uniquely named zoom-control group inside `.facility-host` as an
  absolute top-right overlay. Preserve existing button handlers and names.
- Replace old heading-height assertions with direct no-reserved-row geometry:
  the host fills the facility frame within border rounding, and the zoom box is
  contained within the host.
- Prove viewport-edge and center-fill behavior numerically, not from screenshots
  alone, at ultrawide, normal desktop, laptop, compact desktop, and phone sizes.

## Milestones and file ownership

1. **Responsive shell and facility zoom overlay — Terra.** Own only the relevant
   layout/control portions of `apps/player/src/AppShell.tsx`,
   `apps/player/src/styles/global.css`, directly affected player component tests,
   the old-heading assertions in `tests/e2e/ui-density.spec.ts`,
   `tests/e2e/golden-slice-visual.spec.ts`, and
   `tests/e2e/visual-ui.spec.ts`, plus this plan's progress/discoveries. Remove
   the facility title row, add the accessible non-layout zoom overlay, anchor
   the rails, update stale assertions, and run focused tests, player typecheck,
   player build, and `git diff --check`. Do not edit screenshots, other E2E
   suites, design docs, or the handoff.
2. **Responsive geometry proof and documentation — Terra after Sol review.** Own
   a focused E2E spec (new or narrowly extended), unique
   `edge-anchored-layout-*` proof screenshots, the matching section of
   `CANONICAL_DESIGN.md`, this plan, and an appended checkpoint in
   `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Prove edge anchoring, center fill,
   overlay containment/operation, no header row, canvas backing resize,
   splitter continuity, and no horizontal overflow at the agreed viewports.
   Preserve all unrelated documentation and artifacts.
3. **Final acceptance — Sol.** Review actual diffs, focused/full validation, and
   native proof images; delegate any nontrivial correction; close the bounded
   checkpoint without staging, committing, pushing, or deploying.

## Acceptance criteria

- At 1920x1080, 1440x1000, 1280x720, and 1024x768, the patient rail's left edge
  is at viewport x=0 and the operations rail's right edge is at the viewport
  width within one CSS pixel.
- At each multi-column viewport, the center begins immediately after the left
  track plus the intentional grid gap and ends immediately before the right
  track plus that gap. Increasing viewport width increases center workspace
  width rather than creating outer margins.
- No `.facility-heading` or visible facility title remains. The map host fills
  the facility frame within border/rounding tolerance, reclaiming the old row.
- The compact black zoom group is wholly inside the map's top-right corner,
  displays minus / percentage / plus, has a group label, preserves button
  accessible names and limits, and changes zoom without triggering a map click.
- The rendered canvas element and backing bitmap follow the expanded host
  dimensions within one pixel; no CSS-only stretching or squashing occurs.
- Splitter dragging still reallocates map/desk height, and Build Mode,
  Management Mode, an open chart, pause UI, and map interactions remain usable.
- Pixel 7/mobile retains a deliberate, usable layout with no horizontal page
  overflow and an unobstructed zoom group.
- Focused tests, player typecheck, player build, responsive E2E, and
  `git diff --check` pass. Proof screenshots are unique to this milestone.

## Validation

- Focused component tests selected from the changed player modules.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- Focused Playwright specs for UI density, visual UI, golden-slice geometry,
  workspace splitter, and the new/extended responsive shell proof.
- Browser geometry at 1920x1080, 1440x1000, 1280x720, 1024x768, and Pixel 7.
- `git diff --check`
- Sol inspection of the task-owned diff and every new native screenshot.

### Milestone 2 results

- `node scripts/run-e2e.mjs tests/e2e/edge-anchored-layout.spec.ts --project=desktop-chrome --project=phone-chrome` passed: 2 active tests passed and 2 intentional project-mismatch tests skipped. It captured and Terra inspected all five named proof images.
- UI density passed separately on desktop (1 active), compact desktop (1 active), and phone (2 active). The updated Build Mode visual assertion passed 1/1 and `workspace-splitter.spec.ts` passed 1/1.
- The updated golden-slice desktop and explicit-phone assertions passed before the command runner detached its unrelated remaining gallery/mode captures; the exact detached validation-only process group was stopped rather than allowing uncontrolled worktree writes.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`, `npm.cmd run build --workspace @gamify-surgery/player` (298 modules; existing chunk advisory only), and `git diff --check` passed after the proof/documents.

## Progress

- [x] Read root instructions, current handoff state, and dirty worktree.
- [x] Audit the effective grid cascade, facility header, canvas resize path,
  splitter dependency, accessibility, and affected tests.
- [x] Implement the responsive shell and overlay zoom milestone.
- [x] Add responsive geometry proof and update durable documentation.
- [x] Review Milestone 1 diff and validation.
- [x] Review integrated tests, screenshots, and final diff.

## Discoveries

- The current 1920px cap is itself observable on larger monitors; removing only
  padding would not satisfy the user's request on ultrawide screens.
- The final desktop heading is approximately 36px tall. Moving its controls into
  the already-positioned map host recovers that entire row without changing the
  map/desk split tracks.
- FacilityCanvas already uses a ResizeObserver and backing-bitmap resize, so no
  camera or Phaser scaling rewrite is required.
- The pause indicator and interaction menu use lower overlay layers than the
  proposed zoom group; collision/containment still needs browser proof.
- The task-owned CSS has several historical facility-heading declarations in
  earlier cascades. Removing the markup makes them inert; the new final overlay
  rules intentionally win without reformatting unrelated density work.
- The pre-existing `.facility-host > div` canvas-sizing rule matched the new
  overlay and initially made it fill the map. A more-specific, narrow reset on
  `.facility-host > .facility-zoom-overlay` restores its compact intrinsic box.
- The facility scene may normalize the initial mobile camera from 100% to 110%
  after layout. Browser proof therefore verifies relative minus/plus changes
  rather than assuming a fixed initial percentage.

## Exact next action

The owner should playtest the edge-anchored desktop/laptop composition and the
titleless map controls. Say **"push to GitHub"** when this completed checkpoint
should be backed up. Nothing is staged, committed, pushed, deployed, or
released.
