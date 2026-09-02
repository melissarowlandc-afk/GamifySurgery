# Add draggable map/desk divider

## Goal

Add a compact horizontal resize handle between the facility map and Clinical
Desk on desktop. The player can drag it vertically to give either surface more
room. The facility viewport must reveal more or less world without stretching,
squashing, or re-zooming the rendered map, and the Enter Build Mode button must
remain attached to the moving top edge of the desk.

## Requirements

- Insert a visually small divider and centered drag indicator between the map
  and desk on desktop widths.
- Use the owner-provided `Drag Indicator Icon.png` only as read-only visual
  direction. It is a watermarked stock example and must not be copied,
  committed, transformed, or shipped. Draw an original code-native indicator
  with small up/down cues and horizontal grip marks.
- Support mouse, pen, and touch pointer dragging with pointer capture so the
  interaction remains stable when the pointer leaves the handle.
- Support keyboard resizing with an accessible focusable horizontal separator,
  Arrow Up/Down adjustments, and meaningful ARIA value text.
- Clamp the split so both the facility and desk remain usable. The exact bounds
  may be expressed through a tested pure helper and current container size,
  with approximately 220 px reserved for the map and 190 px for the desk when
  the desktop viewport has sufficient height.
- Keep the existing 44/56 map/desk split as the default.
- Persist the chosen ratio as a guarded, versioned browser-local UI preference.
  It is not campaign data and must not change the domain save schema. Invalid or
  unavailable storage falls back safely to the default.
- Keep phone-width layout behavior unchanged; the desktop splitter is hidden
  at widths of 760 px and below.
- The Enter Build Mode control already lives inside the desk. Preserve that
  ownership so it naturally follows the desk boundary rather than receiving
  separate positioning state.
- Update canonical interface documentation to distinguish automatic chart
  behavior from the new explicit player-controlled split.

## Constraints and non-goals

- Do not modify gameplay, simulation, clinical content, progression, balance,
  routing, room geometry, camera zoom, or campaign saves.
- Do not modify `FacilityScene` graphics or the three excluded local diagnostic
  screenshots.
- Do not inspect any ignored/private reference other than the exact owner-named
  divider example already reviewed by Sol. Do not upload local references or
  use image generation.
- Do not add a large divider bar or materially reduce available workspace.
- Do not add phone dragging in this milestone.
- Do not stage, commit, push, deploy, clean, reset, or delete work.

## Relevant repository state

- Branch `beta` and `origin/beta` start this task at the beta-only release
  record `eb57bb0018e449b5ab699cb74abd09180714ba67`; deployed `main` remains at
  application checkpoint `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The only pre-existing visible dirty paths are three excluded untracked
  diagnostic screenshots. They must remain untouched and outside this task.
- `AppShell.tsx` renders `.facility-frame` and `.desk-workspace` as siblings in
  `.clinic-workspace`; no divider element exists.
- Desktop CSS currently fixes `.clinic-workspace` to two rows at 44/56. Mobile
  uses a flex column with a clamped map height and a 190 px desk minimum.
- `BuildPanel` renders Enter Build Mode inside `.desk-workspace`, whose absolute
  top positioning already follows the desk surface.
- `FacilityCanvas` observes its host with `ResizeObserver`, calls
  `game.scale.resize`, and uses Phaser Scale.NONE. Container-height changes
  should resize the viewport rather than scale world art; this still requires
  actual-app validation.

## Decisions already made

- The feature is desktop-only for this milestone.
- The divider consumes only a narrow middle grid row; its centered handle may
  use a slightly larger overlapping hit target without thickening the visual
  bar.
- Split state is a ratio, not an absolute pixel height, so it adapts to later
  window resizing. Pixel minimums are applied when translating pointer
  position into that ratio.
- The preference is device-local UI state under a new versioned key and is
  independent of named campaigns.
- Opening/closing a chart and entering/exiting Build Mode must not silently
  change the chosen split.

## Milestones and file ownership

1. **Implementation and focused tests — Terra.** Own only
   `apps/player/src/AppShell.tsx`, `apps/player/src/styles/global.css`, a new
   UI-only splitter/helper module and focused test under `apps/player/src/ui/`,
   `tests/e2e/workspace-splitter.spec.ts`, one accepted proof under
   `artifacts/screenshots/`, `CANONICAL_DESIGN.md`,
   `docs/features/visual-art-direction.md`, and this plan. Implement the
   accessible/persisted desktop split, unit coverage, actual-app drag/keyboard/
   Build-button assertions, and one controlled desktop proof. Do not touch any
   other file.
2. **Integration review — Sol.** Review the actual diff and native-resolution
   proof, independently rerun focused tests, player typecheck/build, the focused
   desktop E2E, and `git diff --check`; make only a tiny integration correction
   directly if needed, otherwise return substantive issues to Terra.
3. **Handoff — Terra documentation-only if substantial closure writing is
   needed, otherwise Sol tiny integration.** Update the shared handoff with
   exact behavior, validation, remaining local exclusions, and next action.

## Acceptance criteria

- A small, discoverable horizontal splitter appears only between map and desk
  on desktop.
- Dragging upward decreases map height and increases desk height; dragging
  downward does the reverse, within tested bounds.
- Arrow Up/Down provides the same semantic adjustment and exposes current
  value information to assistive technology.
- The facility canvas backing dimensions follow its resized host while world
  graphics retain their existing zoom/proportions.
- The Clinical Desk uses the complementary space without content forcing the
  map back to its default size.
- Enter Build Mode moves by the same vertical delta as the desk top and remains
  clickable before and after resizing.
- The chosen split survives a page reload on the same browser profile, while a
  bad or unavailable stored value falls back safely.
- Mobile rendering and interaction remain unchanged.
- No campaign save/schema, gameplay, clinical, map-rendering, or diagnostic
  asset changes occur.

## Validation

- Focused splitter/helper unit tests, including clamping and storage fallback.
- Relevant existing player UI tests if changed dependencies require them.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- `npm.cmd run test:e2e -- tests/e2e/workspace-splitter.spec.ts --project=desktop-chrome`
- Native-resolution Sol inspection of the accepted desktop proof.
- `git diff --check`
- Exact dirty-tree reconciliation preserving the three excluded diagnostics.

## Progress

- [x] Read repository instructions, current handoff, and dirty tree.
- [x] Inspect only the owner-named divider reference and reject it as a runtime
  asset while retaining its general interaction motif.
- [x] Complete read-only layout, Phaser resize, persistence, and test audit.
- [x] Implement the desktop splitter, preference, documentation, and tests.
- [x] Complete focused implementation validation and produce the native desktop proof.
- [x] Sol completed acceptance review, rejected the first oversized overlapping
  proof, and accepted Terra's focused correction.
- [x] Update the shared handoff and close the bounded task.

## Discoveries

- No Phaser or scene change should be necessary: `FacilityCanvas` already
  observes host size and resizes the Scale.NONE game instance.
- The Build Mode button already has the correct ownership for the requested
  movement; it should not receive duplicate drag state.
- The current desktop `44fr / 56fr` grid and mobile flex branch provide a clean
  breakpoint boundary for this feature.
- Presentation preferences must remain outside campaign serialization to avoid
  an unrelated save migration.
- The production FacilityCanvas backing bitmap follows its resized host within
  the expected one-pixel browser-layout rounding tolerance; no FacilityCanvas
  change was needed.
- The focused desktop proof is
  `artifacts/screenshots/workspace-splitter-desktop-map-reduced.png`.
- Sol acceptance review corrected the divider to an 18 px contained row with
  a 38 px by 16 px CSS-drawn control, a non-button separator semantic, direct
  `fr` custom-property tracks, center-aware pointer math, and bounded stored
  shares. The replacement proof keeps Enter Build Mode visibly attached to the
  desk after a meaningful split.
- All acceptance criteria are satisfied: bidirectional pointer capture, Arrow
  Up/Down and separator ARIA values, 44/56 default, guarded preference,
  unchanged phone layout, desk-owned Build Mode control, and preserved
  chart/build allocation.
- Sol independently accepted the replacement proof and reran focused Vitest
  (1 file / 4 tests, 325ms), player typecheck, player production build (295
  modules; existing chunk advisory only), focused Playwright (1/1, 14.5
  seconds / 15.9 seconds total), and `git diff --check`.
- Concurrent wall/asset work and its untracked ExecPlan are unrelated and are
  deliberately outside this milestone, alongside the three pre-existing
  excluded diagnostic screenshots.

## Exact next action

Owner local playtest/review. Say **"push to GitHub"** when this completed
checkpoint should be backed up or deployed; that explicit direction is
required before any staging, commit, push, or release action.
