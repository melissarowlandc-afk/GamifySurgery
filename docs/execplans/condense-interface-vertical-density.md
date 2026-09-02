# Condense interface vertical density

## Goal

Reclaim as much usable vertical space as practical for the facility map and
Clinical Desk by compacting the title strip, top HUD, facility heading,
side-panel tabs/menus, desk chrome, Build Mode tools, and bottom bar. Preserve
readability, scrolling, keyboard access, and the completed draggable workspace
splitter.

During Build Mode, remove the build-status box from the map and replace the
Facility Time HUD cell with `BUILD MODE` and `Facility time is stopped while
you remodel.` Move the demonstration-content disclaimer from its standalone
top row into the center of the bottom bar.

## Requirements

- Remove the standalone disclaimer row above the resource HUD. Render the same
  notice exactly once in the bottom bar, centered on desktop and readable
  without colliding with status/actions on mobile.
- Keep the compact game title, but minimize its dedicated height.
- Reduce top HUD outer padding, cell height, icon size, label/value spacing, and
  decorative dead space. Retain legible values and usable time controls.
- When `buildMode` is true, the time HUD cell must show `BUILD MODE` and
  `Facility time is stopped while you remodel.` in place of its normal label
  and day/time value.
- Do not render `.facility-pause-indicator` in Build Mode. Preserve the normal
  `GAME PAUSED / Patients and facility time are waiting for you.` overlay when
  the player pauses outside Build Mode.
- Reduce the facility title-bar height and vertical padding while preserving
  level, facility name, and zoom controls.
- Reduce unused normal-desk top/bottom padding and align Enter Build Mode with
  the more compact desk edge. Preserve the 18px splitter and its map/desk
  allocation behavior.
- Compact sidebar panel headings, patient tabs, goal/staff/event rows, Build
  Mode menu/tool spacing, and other non-clinical tabs/menus where actual dead
  space exists.
- Keep clinical chart prose, answer choices, explanations, critical dialog
  content, and primary clinical action buttons at their current readable size
  unless a concrete overflow bug requires a separately reviewed exception.
- Keep desktop controls large enough to operate and preserve the phone layout's
  full functionality, wrapping where the dense desktop one-row design cannot
  fit.
- Update canonical interface documentation for the new density and status
  placement.

## Constraints and non-goals

- No changes to gameplay, simulation, clinical content, balance, saves,
  progression, map art, room geometry, camera behavior, or facility rendering.
- Do not modify the splitter ratio/persistence/helper semantics.
- Do not modify the concurrent top-down wall implementation, tests, plans, or
  proofs, and do not touch the three diagnostic screenshots.
- Do not remove important status text or depend on hover-only disclosure.
- Do not globally shrink all typography. Density changes must target chrome,
  labels, tabs, and menu spacing rather than clinical reading content.
- Do not stage, commit, push, deploy, reset, clean, delete, or inspect private
  assets.

## Relevant repository state

- `beta` and `origin/beta` are at
  `eb57bb0018e449b5ab699cb74abd09180714ba67`; deployed `main` remains at
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- Two completed local checkpoints are already present and must be preserved:
  the desktop map/desk splitter and the top-down east/west wall caps.
- Three untracked diagnostic screenshots remain excluded.
- `AppShell.tsx` currently renders a dedicated title row, the ResourceBar, the
  facility and desk, and a footer with status/actions. It also contains the
  completed local splitter integration.
- `ResourceBar.tsx` alone renders `contentNoticeLabel` as
  `.global-content-notice`; `AppShell` already has access to the same view value
  and can relocate it without changing session/domain schema.
- The current final desktop cascade uses approximately 64px resource cells,
  a 42px facility heading, 3.35rem normal-desk top padding, and a 50px footer.
- The completed splitter uses a fixed 18px row with 220px map and 190px desk
  minimums; density changes must create more total room around it, not alter it.

## Decisions already made

- Preserve `ResourceBarView.contentNoticeLabel`; move its rendering from
  ResourceBar to AppShell's footer so the notice has one source and one DOM
  instance.
- Add `buildMode` to the ResourceBar presentation API rather than changing
  resource/session view models.
- The Build Mode map overlay is removed with `paused && !buildMode`; ordinary
  pause overlay behavior remains unchanged.
- Desktop footer uses left status, centered disclaimer, and right actions in a
  single compact row. Mobile may wrap the disclaimer within the footer.
- First optimize the structural top/bottom/status geometry, then perform the
  broader panel/menu density pass and visual tuning.

## Milestones and file ownership

1. **Structural status and primary vertical bars — Terra.** Own only
   `apps/player/src/AppShell.tsx`, `apps/player/src/ui/ResourceBar.tsx`,
   `apps/player/src/styles/global.css`,
   `apps/player/src/ui/visualComponents.test.tsx`,
   `tests/e2e/build-mode-usability.spec.ts`, a new focused density E2E only if
   needed, `CANONICAL_DESIGN.md`, `docs/features/visual-art-direction.md`, one
   or two accepted `ui-density-*` proof PNGs, and this plan. Move the notice,
   move Build Mode status into Facility Time, retain ordinary pause overlay,
   and compact title/HUD/facility heading/footer/normal desk. Validate desktop
   and phone behavior. Do not touch any other file.
2. **Menus, tabs, side panels, and integration — Terra.** Using the same owned
   CSS/tests/docs plus only specifically justified existing UI component/test
   files discovered during Milestone 1, compact non-clinical panel headings,
   patient tabs, operational rows, and Build Mode tools. Preserve chart/answer
   typography and scrolling. Refresh normal/build/phone proofs and run focused
   integration validation.
3. **Acceptance and handoff — Sol review, then Terra docs-only closure if
   needed.** Sol reviews actual diffs and native proofs, reruns focused unit,
   player typecheck/build, relevant E2E, and `git diff --check`. Update the
   shared handoff without overwriting the existing splitter/wall records.

## Acceptance criteria

- The disclaimer has no standalone top row and appears exactly once in the
  centered lower bar on desktop.
- Top title + HUD consume materially fewer vertical pixels than the current
  baseline, with resource values and time controls still fully legible.
- The bottom bar consumes materially fewer vertical pixels and retains status,
  disclaimer, Help, Campaigns, and Restart access without overlap.
- Build Mode shows its label/message only in the Facility Time HUD cell and has
  no build-status overlay on the map.
- Ordinary manual pause still shows the map pause overlay and normal Facility
  Time label/value.
- The facility heading, normal desk chrome, panel headings, tabs, rows, and
  Build Mode menus are visibly denser without clipped text or lost controls.
- The splitter remains 18px, draggable, persistent, and aligned with the desk;
  density changes increase space available around its two workspaces.
- Desktop normal, Build Mode, manual pause, open-chart, and compact-window
  states remain usable. Phone normal/build/chart states remain usable and show
  the disclaimer without horizontal overflow.
- Clinical reading typography and answer-choice presentation are unchanged.
- No gameplay, save, clinical, map-rendering, wall-cap, or diagnostic changes
  occur.

## Validation

- ResourceBar focused unit/markup tests for normal vs Build Mode HUD text and
  absence of the old top disclaimer.
- Focused desktop/mobile density E2E assertions for geometry, disclaimer
  location/uniqueness, Build Mode HUD/no-overlay, normal pause overlay, footer
  non-overlap, and splitter preservation.
- Existing Build Mode usability test updated for the new status location.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- Native-resolution Sol inspection of normal desktop, Build Mode desktop, and
  a phone proof if mobile styling changes materially.
- `git diff --check`
- Exact task/concurrent-path reconciliation.

## Progress

- [x] Read repository instructions, current handoff, and dirty tree.
- [x] Complete read-only vertical-density and status/disclaimer audits.
- [x] Implement and validate structural status/top/bottom density milestone.
- [x] Implement and validate broader tabs/menus/side-panel density milestone.
- [x] Complete Sol acceptance, handoff, and checkpoint reminder.

## Discoveries

- Removing the standalone notice and reducing the 64px HUD cells are the
  largest safe top-of-screen gains.
- The footer's current 50px minimum and the normal desk's 3.35rem top padding
  are the largest bottom/desk chrome gains.
- Build Mode state is already available in AppShell and can be passed directly
  to ResourceBar; no session model or save change is required.
- The time HUD must support denser two-line build copy without increasing the
  overall HUD height.
- Existing full-screen phone chart and clinical answer typography should remain
  outside the global density selectors.
- Milestone 1 measures a 54px desktop resource cell, 36px facility heading,
  42.19px footer, and retained 18px splitter row at 1440px wide. The normal
  and Build Mode proofs are `artifacts/screenshots/ui-density-normal-desktop.png`
  and `artifacts/screenshots/ui-density-build-desktop.png`.
- Focused ResourceBar markup tests passed 8/8; player typecheck and production
  build passed (the existing chunk-size advisory remains); focused desktop and
  phone density E2E passed 2/2 with 2 expected project skips; and
  `git diff --check` passed.
- Milestone 2 applies desktop-only density to non-clinical panel headings,
  patient tabs and resolved strip, goals, staff, alerts, promotions, and Build
  Mode instructions/tool/catalog chrome. It intentionally does not select
  chart prose, questions, answer choices, explanations, dialogs, or care
  actions. At 1024px the footer becomes a compact two-row grid to avoid the
  centered notice colliding with status/actions; it is still shorter than the
  old separate disclaimer row plus old footer. The compact footer measured
  62.41px, still smaller than the prior approximately 50px footer plus the
  separate notice row.
- `ui-density.spec.ts` covers desktop normal/manual-pause/Build Mode, compact
  desktop operations and construction tools, and phone normal/Build/chart
  overflow behavior. Accepted proofs also include
  `artifacts/screenshots/ui-density-compact-desktop.png` and
  `artifacts/screenshots/ui-density-phone-build.png`; the phone Build HUD uses
  a full-width wrapped time cell so its stopped-time message remains readable.
- Compact-width acceptance confirms the full exact Build Mode message fits its
  54px HUD chip (27.38px message box) and every toolbar button fits within the
  517.28px toolbar/panel without scroll clipping; the four-button compact grid
  measures 66.83px high and keeps the Hallway label readable by wrapping it.

## Exact next action

Owner local playtest/review: verify the condensed interface at desktop, compact
desktop, and phone widths and name any concrete density correction. This is a
substantial validated checkpoint; say **"push to GitHub"** for a scoped backup
or deployment after review. It remains local-only and is not staged,
committed, pushed, or deployed.
