# Patient chart redesign: recovery archive (2026-10-07)

The owner reviewed the clickable mockup
(https://claude.ai/artifact/EkXc5tE8Tdh2HnoAn7E3io), agreed to implement all
seven changes, and added two rules: the chart should "only be as big and cover
as much of the screen as is needed to fit the patient presentation and
choices", and opening a chart must not pause the game (the play feel must not
depend on monitor size). The owner left the waiting-on-test format to Claude.
Claude Code did the work. Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
(patient chart presentation redesign entry).

## What it changes

1. **Floating, content-sized chart.** `ChartPanel` renders through a `<body>`
   portal as `.chart-sheet`. A placement hook reads the desk and play-area
   rectangles: the chart is centered on the desk when the desk is at least
   1040 px wide, otherwise it starts at the desk's left edge (the patient list
   stays visible) and extends right, then left. Its height is the content
   height, anchored to the desk bottom and growing over the map only when
   needed, capped below the HUD. Phones (≤760 px) keep a full-viewport sheet.
   No auto-pause.
2. **One-line header:** portrait, name, age and sex, chief complaint,
   satisfaction, status and close. Vitals move above the story.
3. **No bottom action bar.** Continue/Enact sits in the feedback card,
   Return to clinic in the waiting card, and rewards, Flip and Resolve in one
   completion row.
4. **One scroll region.** Patient story (with the current update) on the left,
   pinned; decisions on the right. Earlier decisions collapse into rows.
5. **Feedback in place.** After answering, the list shrinks to the chosen
   answer (plus the correct one when it differs) with the explanation below.
   `revealedCorrect` is set on choices only after an answer exists.
6. **Readable prose font:** Atkinson Hyperlegible
   (`@fontsource/atkinson-hyperlegible` 5.2.8, OFL-1.1, bundled; no runtime web
   fetch). Courier stays for labels.
7. **Cleanups:** 2×2 answers when wide, 1–9 / Enter / Esc keys, flag icon, wait
   chip with the breakdown as a tooltip and screen-reader text, progress pips.
8. **Waiting-on-test stages.** `diagnosticPendingPresentation` additionally
   returns `summary` and structured `phases`; the view model exposes
   `pendingSummary`/`pendingPhases` and `resultSummary`/`resultPhases`. The
   existing one-sentence `body`/`pendingLabel` text is unchanged.

Tutorial selectors now target `.chart-sheet, .chart-panel`,
`[data-tutorial-anchor='current-answer-choices']` and
`.chart-sheet .cs-primary-action`; the three answer-choice coach steps also
avoid the chart. E2E selectors were remapped to the new `cs-*` classes, and
`patient-chart-density.spec.ts` was rewritten for the new layout.

No domain, balance, save or clinical-content changes. The legacy chart rules in
`styles/global.css` stay because `EmployeeDiscussionPanel` still uses them.

## Contents

- `files/`: complete copies of files that are wholly Claude's at this
  checkpoint (`ui/ChartPanel.tsx`, `ui/chartSheet.css`,
  `tests/e2e/patient-chart-density.spec.ts`). `ChartPanel.tsx` keeps the two
  small uncommitted Codex tweaks it had before the rewrite ("Patient is in
  clinic" wording and `primaryActionClosesChart`).
- `recovery/patches/`: unified diffs of only Claude's edits in 36 shared files.
  Baselines were rebuilt by reversing exactly this session's edits on the live
  files, newest first, from the session log. The e2e selector swap was
  reversed with the inverse map and checked by re-applying the forward map;
  12 tracked specs came back identical to HEAD. Dependency baselines are the
  exact pre-install copies saved before `npm install`.
  `recovery/patch-verification.json` records that `git apply` of each patch to
  its baseline rebuilds the live file byte for byte, with SHA-256 hashes.
- `evidence/`: Playwright screenshots of the synthetic "Chart Density" fixture
  clinic at four viewports (no owner data).
- `validation/results.json`: typecheck, unit and e2e record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

Copy `files/` over the repository root. Then apply each patch from the
repository root:

```
git -c core.autocrlf=false apply artifacts/checkpoints/patient-chart-redesign-20261007/recovery/patches/<file>.patch
```

Then run `npm install` for the font dependency. Patches need surrounding code
compatible with the shared tree at this checkpoint (for example the uncommitted
GS-034 `diagnosticTimingPresentation.ts` and Codex's `viewModels.ts` work). If a
hunk no longer applies, re-apply it by hand from the patch text.
`ChartPanel.tsx` depends on the `types.ts` patch and the font package.

Not included: other sessions' concurrent uncommitted work in the same files,
and the owner's save.
