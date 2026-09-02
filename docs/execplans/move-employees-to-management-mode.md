# Move Employees to Management Mode

## Goal

Move the complete Employees interface out of the persistent right rail and into
a desk-owned Management Mode so laptop layouts devote more width to the map and
clinical workspace. Management Mode must pause facility time like Build Mode,
while an open patient chart must own the entire desk and hide both mode-entry
buttons.

## Requirements

- Remove the Employees panel from the right side of normal play, Build Mode,
  and chart views. Preserve every existing role, employee, hire, salary, morale,
  and fire control inside the new desk screen.
- Add an `Enter Management Mode` button at the top-left of the empty Clinical
  Desk. Match the visual grammar, compact size, and two-line construction of the
  existing `Enter Build Mode` button, which remains at the top-right.
- Entering Management Mode pauses facility time and remembers whether the
  player had already paused manually. Exiting resumes time only when Management
  Mode caused the pause.
- Make Management Mode, Build Mode, and an open patient chart mutually
  exclusive. Neither mode-entry button may be rendered while a chart or either
  mode is open. Opening a chart while managing employees exits Management Mode
  cleanly before showing the chart.
- Replace the Facility Time HUD content with `MANAGEMENT MODE` and
  `Facility time is stopped while you manage staff.` while Management Mode is
  active. Keep pause/play and speed controls locked for the duration, matching
  Build Mode behavior, and suppress the ordinary `GAME PAUSED` map overlay.
- Give Management Mode a compact desk header and a clear `Done` action. The
  employee list must use the available desk height and scroll internally when
  necessary at desktop, laptop, and phone widths.
- Preserve employee/staff alert navigation: selecting such an alert must open
  Management Mode, then reveal and focus the referenced role or employee.
- Let the remaining Goals and Alerts panels use the freed right-rail space.
- Remove the small white decorative paper/square from the empty dotted
  `CLINICAL DESK` placeholder.
- Preserve the draggable map/desk splitter. Both desk buttons and the full
  Management screen must follow the resized desk without stretching or
  squishing the facility map.

## Constraints and non-goals

- Do not change employee simulation rules, hiring costs, salaries, morale,
  alerts, progression, clinical content, question content, facility rendering,
  save data, or persisted game-state schemas.
- `managementMode` is session UI state, parallel to `buildMode`; it is not
  serialized into a campaign save.
- Do not make the Management screen a phone-wide fixed overlay. It remains the
  desk content and must be bounded and scrollable there.
- Do not rely on z-index alone to cover the desk buttons. Omit the buttons from
  the rendered tree whenever a chart or mode is active.
- Preserve the Build tutorial anchor and existing Build Mode behavior.
- Do not stage, commit, push, deploy, reset, clean, delete, or inspect private
  assets. Preserve all unrelated graphics, splitter, and density work in the
  shared dirty worktree.

## Relevant repository state

- Local `beta` and `origin/beta` are at
  `eb57bb0018e449b5ab699cb74abd09180714ba67`; deployed `main` remains at
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The splitter and two density passes are complete locally but uncommitted.
  Their edits already coexist in `AppShell.tsx`, `ResourceBar.tsx`,
  `global.css`, `ui/index.ts`, visual tests, E2E tests, design docs, proofs, and
  the current handoff. This feature must build on those lines, not replace them.
- Concurrent graphics work owns the modified facility/art files, door and room
  presentation files/tests, wall and floor ExecPlans/E2E/proofs, and diagnostic
  screenshots. Those paths are outside this task.
- At task start, `StaffPanel` was rendered only in `AppShell`'s right
  `.operations-column` and already receives all required employee view models
  and callbacks.
- Build Mode is session-owned in `usePrototypeSession.ts` and records its prior
  pause state. The same layer is the reliable place to own Management Mode,
  close a chart on entry, restore time on exit, and make chart opening close
  Management Mode.
- Staff and employee alert actions currently query stable
  `data-staff-role-id` and `data-employee-id` targets. They must enter the mode
  before scheduling the existing focus/scroll behavior.
- The confusing white shape is the empty-desk decorative span and its dedicated
  CSS rule; it has no gameplay or accessibility role.

## Decisions already made

- Add a session-owned `managementMode` boolean and explicit
  `enterManagementMode` / `exitManagementMode` callbacks beside the existing
  Build Mode API. Do not add a reducer command or persisted field.
- Reuse `StaffPanel` as the employee content inside a small new
  `ManagementPanel` wrapper. The wrapper owns Management Mode chrome and the
  `Done` action; `StaffPanel` remains responsible for employee controls.
- Keep both inactive mode triggers desk-owned: Management on the left, Build on
  the right. Render them only in the empty normal desk state.
- Give charts highest desk priority, then active Management/Build content, then
  the empty desk state and its mode-entry controls.
- Keep the normal left rail and the remaining right-rail Goals/Alerts visible
  during Management Mode. Only facility time and the desk content change.
- Employee actions continue to apply immediately; `Done` has no save or
  validation gate.

## Milestones and file ownership

1. **Session behavior and desk UI integration — Terra.** Own only
   `apps/player/src/session/usePrototypeSession.ts`, `apps/player/src/App.tsx`,
   `apps/player/src/AppShell.tsx`, `apps/player/src/ui/BuildPanel.tsx`,
   `apps/player/src/ui/BuildPanel.test.tsx`,
   `apps/player/src/ui/ResourceBar.tsx`,
   `apps/player/src/ui/visualComponents.test.tsx`,
   `apps/player/src/ui/StaffPanel.tsx`,
   `apps/player/src/ui/StaffPanel.test.tsx`, new
   `apps/player/src/ui/ManagementPanel.tsx` and its focused test,
   `apps/player/src/ui/index.ts`, `apps/player/src/styles/global.css`, and this
   plan's progress/discoveries. Implement the mode, pause restoration, chart and
   Build mutual exclusion, alert reveal/focus, full-desk employee screen,
   right-rail redistribution, trigger suppression, and white-shape removal.
   Add focused component tests and run focused Vitest, player typecheck, and
   player build. Do not edit E2E, screenshots, design docs, or the handoff in
   this milestone.
2. **Responsive browser acceptance and documentation — Terra after Sol review.**
   Own only the task-relevant portions of `tests/e2e/visual-ui.spec.ts`,
   `tests/e2e/ui-density.spec.ts`, `tests/e2e/alert-humor.spec.ts`, a focused new
   `tests/e2e/management-mode.spec.ts` if useful,
   `tests/e2e/build-mode-usability.spec.ts`, unique `management-mode-*` proof
   PNGs under `artifacts/screenshots/`, `CANONICAL_DESIGN.md`, this plan, and
   `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Prove desktop/laptop/phone layout,
   pause restoration, mutual exclusion, chart ownership, alert navigation,
   splitter compatibility, and overflow/containment. Preserve every unrelated
   line and append rather than replace the shared handoff.
3. **Final acceptance — Sol.** Review the actual diffs and native-resolution
   proofs, reconcile task-owned versus concurrent paths, rerun proportionate
   integrated validation, return any nontrivial correction to Terra, and close
   the bounded checkpoint without staging, committing, pushing, or deploying.

## Acceptance criteria

- No `.staff-panel` exists beneath `.operations-column` in any state.
- In an empty normal desk, the Management trigger is top-left and the Build
  trigger is top-right, visually matched, fully contained, and keyboard
  reachable.
- Entering Management Mode while running pauses time; leaving resumes it.
  Entering while manually paused and leaving keeps it paused.
- The Facility Time HUD reports Management Mode and cannot resume or accelerate
  time until the mode is closed. The ordinary paused-map overlay is absent.
- Management Mode displays the complete employee UI in the desk, with all
  existing controls functional and the list scrollable without escaping the
  desk at 1440px desktop, representative laptop width, and phone width.
- Build Mode, Management Mode, and charts never coexist. An open chart occupies
  the full desk, and neither mode-entry button is present until the chart
  closes.
- Staff/employee alert actions enter Management Mode and focus the intended
  target.
- Goals and Alerts remain readable and usable in the right rail after Employees
  is removed.
- The empty Clinical Desk has no decorative white square. The dotted boundary,
  label, and explanatory text remain.
- The desktop splitter can move in both directions with Management Mode open;
  the employee screen follows the available desk space and the facility canvas
  remains undistorted.
- No horizontal page overflow, clipped mode chrome, inaccessible action, or
  overlapping desk trigger appears in the tested layouts.

## Validation

- Focused Vitest for `ManagementPanel`, `BuildPanel`, `StaffPanel`, and
  `ResourceBar` behavior/markup.
- Player workspace typecheck and production build.
- Focused Playwright at 1440px desktop, 1280x720 laptop, 1024x768 compact
  desktop, and phone widths,
  covering the two pause-restoration paths, Management HUD status/control lock,
  chart priority, alert focus, trigger geometry, right-rail absence, employee
  scrolling, and splitter compatibility.
- Native inspection of fresh `management-mode-*` proof images.
- `git diff --check` and exact task/concurrent-path reconciliation.

## Progress

- [x] Read the repository instructions, current handoff, dirty tree, and prior
  density/splitter plan.
- [x] Audit StaffPanel ownership, desk composition, Build/session pause logic,
  alert targeting, responsive CSS, and affected tests.
- [x] Implement and validate the session behavior and desk UI milestone.
- [x] Complete responsive browser acceptance and documentation.
- [x] Complete Sol final acceptance and handoff closure.

## Discoveries

- Employee data and actions already reach `AppShell`; the move requires no
  domain, balance, or view-model change.
- A purely AppShell-local mode could visually pause via the existing callback,
  but session ownership avoids stale pause restoration and centralizes chart
  and Build mutual exclusion beside the existing Build Mode implementation.
- Current employee/staff alert focus assumes StaffPanel is always mounted.
  Opening Management Mode before the scheduled query preserves the stable
  target contract.
- Current right-rail CSS reserves separate height for Goals, Employees, and
  Alerts. Removing the JSX alone would leave poor allocation, so the two
  remaining panels need explicit flex redistribution.
- The chart element already sizes to its available track, but native review
  found that chart state inherited the empty desk's decorative top padding.
  Chart-specific padding/decor removal plus conditional non-rendering of both
  inactive mode triggers makes full-desk ownership deterministic.
- Management pause restoration can reuse the existing persisted pause command
  without adding save data: the session keeps only the pre-mode pause flag in
  a ref, while `managementMode` itself remains local UI state.
- Milestone 1 validation passed: focused player Vitest (4 files, 19 tests),
  player typecheck, player production build, and `git diff --check`.
- Sol review added two lifecycle/accessibility safeguards: switching campaigns
  clears the non-persisted Management Mode without applying its pause
  restoration to the replacement state, and the inactive Management trigger
  now has the same explicit accessible name contract as Build Mode.
- Browser acceptance caught a phone-only overlap from the shared 10rem trigger
  minimum. The phone rule now uses matched half-desk widths with a visible gap;
  the Management splitter check follows the established bidirectional pointer
  contract rather than assuming a short drag always changes the share enough.
- Native proof review found that the compact Build-only Facility Time rules did
  not yet include Management Mode. The same full-row, wrapping, and emphasis
  selectors now apply to both modes; focused browser checks assert that the
  Management sentence is fully contained rather than merely present in the DOM.
- Final laptop chart review found that chart state hid the desk triggers but
  retained the empty desk's decorative top padding. Chart state now removes
  that chrome and sizes the chart to the complete desk; focused acceptance
  records all four chart-to-desk edge deltas with a four-pixel tolerance.
- The phone trigger correction yields a measured 4.81 CSS pixel gap with equal
  heights. Native proofs are two 1280x720 laptop captures, one 1024x768 compact
  desktop capture, and a Pixel 7 capture with a 412x839 logical viewport
  (1082x2202 output pixels); the laptop chart proof is a true 1280x720 capture.
- Focused Management acceptance covered the running/manual-pause restoration,
  HUD lock/copy containment, staff controls, chart priority, alert focus, and
  desktop splitter. Chart edge deltas are left/top/right/bottom 0/4/0/1px.
- Final validation passed: Management E2E selected 8 cases across the four
  projects (6 passed, 2 expected project skips); focused Build composition,
  compact density, and staff-role alert-focus E2E each passed once. The Build
  composition check needed a pre-existing stale count correction from 9 to 10
  Zoom Out clicks because the isolated Front Desk starts at 1.1 while the
  established UI minimum remains 0.1; it is not a Management behavior change.
- Sol final acceptance also passed focused player Vitest (4 files, 19 tests),
  player typecheck, and a 297-module production build with only the existing
  large-chunk advisory. The first build attempt encountered a transient Windows
  `ENOTEMPTY` race while Vite cleared generated `dist`; an unchanged retry
  passed, so no source or generated-directory cleanup was required.

## Exact next action

Owner playtest/review: verify Management Mode, chart priority, and the two empty
desk triggers on the intended laptop. Name any concrete correction, or say
**"push to GitHub"** to authorize a backup checkpoint. Nothing has been staged,
committed, pushed, deployed, or released.
