# Team discussions on the chart sheet: recovery archive (2026-10-07)

The owner asked for the statistics/ethics questions to look like the patient
charts and not to show the explanation on a separate page. Claude Code (the
"Ethics/stats questions overhaul" thread) did the presentation work and wrote
the content brief that the GamifySurgery manager has since dispatched to a
Codex worker. Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
("Team discussions on the chart sheet" entry).

## What it changes

1. **One chart sheet for discussions.** `EmployeeDiscussionPanel` is now an
   adapter (`employeeDiscussionChartView`) that renders a team discussion with
   `ChartPanel`. The header has the portrait, employee name, role as the
   subtitle, the case chief complaint as the topic, a status pill and close.
   The scenario is on the left; the question and 2×2 answer grid are on the
   right.
2. **Feedback in place.** After answering, the question stays. The answer rows
   show "Your answer ✕" / "Correct answer" and the feedback card appears below
   them. The body is the frozen explanation with no added prefix.
3. **No summary page.** On the final step, **File discussion** acknowledges
   and files in one click (`usePrototypeSession.acknowledgeEmployeeDiscussion`
   files when the discussion reaches `resolved_summary_available`). Earlier
   steps show **Continue**. A discussion reopened in the summary state files
   from the chart front.
4. **View model** (`employeeDiscussionView`): a `traveling` status (still
   answerable, matching the domain), `topicLabel`, `feedbackTitle`,
   `revealedCorrect` only after an answer, and `finalStep`. The duplicate
   `summary` is removed.
5. **ChartPanel hooks:** optional `subjectKind` / `subtitleLabel` on
   `ChartView` (accessible labels say "team discussion"), and
   `primaryActionLabel` may override the file-button label. Patient charts
   never set it in that state.
6. The dead `.employee-discussion-body` rules are removed from `global.css`.

No domain, content, FSRS, balance or save-format changes.

## Contents

- `files/`: complete copies of files that are wholly Claude's at this
  checkpoint: `ui/EmployeeDiscussionPanel.tsx`,
  `ui/EmployeeDiscussionPanel.test.tsx` (both untracked GS-028 files that this
  work rewrote in full), and `docs/handoffs/STATS_ETHICS_OVERHAUL_BRIEF.md`.
- `recovery/patches/`: unified diffs of only Claude's edits in 6 shared dirty
  files (`ChartPanel.tsx`, `types.ts`, `viewModels.ts`,
  `usePrototypeSession.ts`, `global.css`, `employeeDiscussionView.test.tsx`).
  Baselines were rebuilt by reversing exactly this thread's edits on the live
  files, newest first. `recovery/patch-verification.json` records that
  `git apply` of each patch to its baseline rebuilds the live file byte for
  byte, with SHA-256 hashes. `employeeDiscussionView.test.tsx` is an untracked
  GS-028 file, so its patch needs that file's GS-028 version as the base.
- `evidence/`: in-game captures from a synthetic QA campaign on
  `http://127.0.0.1:5185` (no owner data): the question and the inline
  feedback.
- `validation/results.json`: typecheck, unit test and browser record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

Copy `files/` over the repository root, then apply each patch from the
repository root:

```
git -c core.autocrlf=false apply artifacts/checkpoints/team-discussion-chart-20261007/recovery/patches/<file>.patch
```

The patches need the surrounding shared-tree code (GS-028 runtime, patient
chart redesign) to be present.

## Not included

The running GS-028 content worker's files, other threads' work, the manager's
AGENTS.md section and `.claude/` (including this thread's
`player-qa-claude-5185` QA entry in `.claude/launch.json`) stay local.
