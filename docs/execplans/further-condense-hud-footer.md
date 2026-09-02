# Further condense HUD and footer

## Goal

Reclaim another measured band of vertical space for the facility map and
Clinical Desk. Reduce the remaining vertical whitespace above and below HUD
content by approximately 30%, reduce the desktop lower bar by approximately
50%, and remove the redundant standalone current-XP value from the Learning XP
cell.

## Requirements

- Replace the Learning XP cell's current three-line content with two compact
  rows: `Learning XP` plus level, then the progress bar plus its fraction label.
  Do not visibly render `view.xpLabel` as a separate value between those rows.
- Preserve the full current XP information in the progress fraction and in the
  Learning XP cell's accessible name.
- Reduce actual desktop HUD height. The current accepted 1440px resource chips
  are 54px high with 0.28rem block padding and the HUD wrapper has 0.2rem block
  padding. Target roughly 46-48px chips and proportionally smaller wrapper
  padding, subject to native proof and containment.
- Preserve the smooth resource icons and existing label/value font sizes unless
  a narrowly scoped Build Mode containment adjustment is required.
- Preserve the exact Build Mode sentence in the Facility Time cell at wide,
  compact-desktop, and phone widths. It must not clip or increase all HUD cells
  beyond the accepted target.
- Reduce the wide-desktop footer from approximately 42.19px to approximately
  half that height, allowing a small tolerance for its top border and text line
  box. Reduce the 1024px two-row footer from 62.41px to approximately half while
  retaining its non-colliding status/actions row and centered notice row.
- Remove footer dead space by reducing desktop-only action hit-box height,
  padding, row gap, and minimum height together. Keep every label and action.
- Preserve phone touch-control sizing and wrapping. A phone footer may remain
  taller when required for usable touch targets.
- Preserve the single lower-bar disclaimer, ordinary pause overlay, Build Mode
  HUD status, clinical typography, and the 18px workspace splitter.

## Constraints and non-goals

- No changes to gameplay, simulation, clinical content, saves, progression,
  facility/map rendering, room graphics, camera behavior, or splitter logic.
- Do not remove the XP fraction, level, progress bar, resource icons, status,
  disclaimer, Help, Campaigns, Restart, or optional review controls.
- Do not globally shrink typography or clinical controls.
- Do not stage, commit, push, deploy, reset, clean, delete, or inspect private
  assets.
- Preserve all concurrent splitter and graphics work in the dirty worktree.

## Relevant repository state

- Local `beta` and `origin/beta` are at
  `eb57bb0018e449b5ab699cb74abd09180714ba67`; deployed `main` is at
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`.
- The completed first density pass is local only and documented in
  `condense-interface-vertical-density.md`.
- Its accepted baselines are 54px desktop resource chips, a 42.19px 1440px
  footer, and a 62.41px 1024px footer.
- At desktop widths, `.text-button` retains a global 36px minimum height even
  though footer controls display as small text links. Footer-specific overrides
  are therefore required for a real height reduction.
- Phone controls must retain their existing touch-oriented sizing.

## Decisions already made

- The visible `view.xpLabel` in `.resource-xp-row > strong` is redundant. Keep
  it in the cell `aria-label`, remove that visible node, and place the progress
  fraction beside the progress bar.
- Measure actual rendered bar heights and content containment in Playwright;
  do not claim percentage reductions from CSS declarations alone.
- Apply footer action compaction only at desktop widths. Compact desktop may
  retain its two-row structure with a much smaller row gap.

## Milestones and file ownership

1. **HUD/footer implementation and responsive proof — Terra.** Own only
   `apps/player/src/ui/ResourceBar.tsx`,
   `apps/player/src/styles/global.css`,
   `apps/player/src/ui/visualComponents.test.tsx`,
   `tests/e2e/ui-density.spec.ts`, unique follow-up proof PNGs under
   `artifacts/screenshots/`, and this plan. Implement the XP layout and measured
   height reductions; validate wide desktop, compact desktop, Build Mode, and
   phone containment.
2. **Acceptance and closure — Sol review, then Terra docs-only if needed.** Sol
   reviews actual diffs and native proofs, returns any clipping correction,
   reruns focused unit/typecheck/build/E2E/diff validation, and appends a
   self-contained handoff checkpoint without overwriting concurrent records.

## Acceptance criteria

- The Learning XP cell visibly contains no standalone `view.xpLabel`; its
  heading, level, progress bar, and progress fraction remain readable.
- At 1440px, resource chips are no taller than 48px and all resource text,
  icons, progress content, controls, and Build Mode copy stay contained.
- At 1024px, the full Build Mode sentence remains contained and readable.
- At 1440px, the footer is no taller than 24px. At 1024px, it is no taller than
  34px. These thresholds approximate 50% of the accepted 42.19px and 62.41px
  baselines while allowing borders and two distinct compact rows.
- Footer status, disclaimer, Help, Campaigns, Restart, and any enabled review
  action are present, contained, non-overlapping, keyboard reachable, and free
  of horizontal overflow.
- Phone resource/footer layouts remain fully readable and operable without
  horizontal overflow.
- The splitter remains 18px and the reclaimed pixels accrue to the central
  map/desk allocation.

## Validation

- Focused ResourceBar markup tests for the removed visible XP value and retained
  accessible/full progress information.
- Focused density E2E geometry and content-containment assertions at 1440px,
  1024px, and phone widths in normal and Build Mode states.
- Native inspection of fresh wide-desktop, compact-desktop, and phone proofs.
- `npm.cmd test --workspace @gamify-surgery/player -- --run src/ui/visualComponents.test.tsx src/ui/workspaceSplitter.test.ts`
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- Focused `ui-density.spec.ts` Playwright projects.
- `git diff --check` and exact task/concurrent-path reconciliation.

## Progress

- [x] Audit current markup, CSS cascade, tests, handoff, and dirty tree.
- [x] Implement and validate the second HUD/footer density pass.
- [x] Complete Sol acceptance and handoff closure.

## Discoveries

- The Learning XP cell currently renders `view.xpLabel` and the progress
  fraction on a separate flex row above the progress bar; combining the
  fraction and bar removes the only three-row HUD constraint.
- The current desktop footer height is driven mainly by inherited 36px
  `.text-button` hit boxes and minimum height rather than its visible text.
- The 1024px footer's two-row structure remains necessary to prevent the
  centered notice from colliding with status/actions, but its action height,
  row gap, and padding can all be substantially reduced.
- The visible XP value was removed while its complete value remains in the
  Learning XP accessible name; the progress fraction now sits beside the bar.
  At 1440px, actual chips reduced from 54px to 48px (6px reclaimed per chip),
  and the footer reduced from 42.19px to 24px (18.19px reclaimed). At 1024px,
  the two-row footer reduced from 62.41px to 34px (28.41px reclaimed).
- Desktop wrapper block padding reduced from 0.2rem to 0.12rem (40%), and chip
  block padding reduced from 0.28rem to 0.18rem (about 36%). Together, their
  vertical padding reduced from 15.36px to 9.60px per HUD row, reclaiming
  5.76px (37.5%) of top/bottom dead space before the 6px chip-height cut.
- Fresh accepted proofs are
  `ui-density-extra-compact-wide-desktop.png`,
  `ui-density-extra-compact-wide-build.png`,
  `ui-density-extra-compact-compact-desktop.png`, and
  `ui-density-extra-compact-phone-build.png`. The compact Build HUD stayed
  48px with its 27.38px message box contained; phone footer actions preserved
  their existing 36px minimum height and full XP fraction.
- Focused Vitest passed 2 files / 12 tests; player typecheck and production
  build (295 modules, existing chunk-size advisory only) passed; focused
  desktop/compact/phone density E2E passed 4 with 8 expected project skips;
  and `git diff --check` passed.

## Exact next action

Owner playtest/review: check wide, compact, and phone layouts and name any
concrete correction. Otherwise say **"push to GitHub"** for backup or
deployment at this substantial checkpoint. It remains local-only; no staging,
commit, push, or deployment has occurred or is authorized.
