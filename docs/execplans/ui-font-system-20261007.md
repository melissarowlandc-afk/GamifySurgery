# Shared game UI font system — 2026-10-07

## Goal and authorization

Claude Code's GamifySurgery manager assigned this bounded milestone to a Sol
worker. Owner request: “I like the fonts used in the questions so those fonts can
be translated to everything else in the game.” Apply the approved chart's
Atkinson readable-text stack throughout the game, retaining Courier for compact
labels, badges and aligned numeric readouts. The approved patient chart must
render identically.

## Ownership and constraints

- Owned source lane: `apps/player/src/styles/tokens.css`; font declarations only
  in `apps/player/src/styles/global.css` and `apps/player/src/ui/OpeningSequence.css`;
  shared-font variable references only in `apps/player/src/ui/chartSheet.css`;
  the two Atkinson import lines in `apps/player/src/ui/ChartPanel.tsx` and their
  destination, `apps/player/src/main.tsx`; Courier canvas font strings only in
  `apps/player/src/facility/FacilityScene.ts`.
- This file is the worker's scoped plan and handoff. The manager owns the current
  thread handoff and acceptance after visual review.
- Preserve concurrent Claude/owner edits. No colour, size, spacing, layout,
  source/clinical content, save, launcher, dependency, publishing or deployment
  changes. A demonstrably needed line-height change would require a listed
  justification; none is currently planned.
- No subagents, installs, commits or pushes. An initial read-only `git status`
  was mistakenly run before this brief's no-Git restriction was applied; no
  further Git commands are used. Review uses filesystem snapshots and exact
  scoped changes.
- Clinical content/provenance rules remain in force; this milestone authors no
  clinical content and does not change any approval status.

## Repository state and decisions

The shared worktree has extensive pre-existing edits, including global CSS,
opening sequence, ChartPanel and FacilityScene. File snapshots were captured
before edits in temporary scratch storage. No nested AGENTS.md was found under
apps or docs. The entry point is `apps/player/src/main.tsx`. Atkinson 400/700 is
already installed and currently imported by ChartPanel.

The body switches to `--font-read`; compact labels and numeric readouts receive
explicit font-only overrides. Keep the chart's inherited fonts intact, including
the readable “Back of chart” eyebrow on its back. Canvas room/activity prose uses
the same literal readable stack; numeric earnings and the small NO ACCESS badge
use the literal shared pixel stack because canvas cannot resolve CSS variables.

## Milestones and acceptance

1. Inspect existing font declarations, component semantics and baseline checks.
2. Make minimal shared-token/import/font changes without altering presentation
   geometry or the chart's computed font system.
3. Inspect the actual scoped deltas, rerun the requested checks and append the
   complete worker handoff here. Browser visual review belongs to the manager.

Acceptance: Atkinson is loaded by the app entry; readable UI inherits its exact
chart stack; retained pixel selectors have a label/badge/numeric reason; moving
numbers use `font-variant-numeric: tabular-nums`; chart CSS differs only in its
shared-font reference; changed source contains no non-font modifications.

## Validation and discoveries

Requested commands, run from the repository root:

```text
npm.cmd run typecheck
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

- Baseline typecheck: all seven workspace scripts (eight compiler invocations) pass.
- Before any font edit, the exact player test command fails during Vite config
  loading with `[plugin externalize-deps] Error: spawn EPERM`. Vite's optional
  `exec("net use")` drive lookup synchronously throws in this sandbox.
- A supplemental `--configLoader runner` attempt fails before tests with
  `ReferenceError: require is not defined` in picomatch. Configuration remains
  unchanged.
- A temporary Node preloader catches only synchronous EPERM from `net use` and
  passes the failure to Vite's existing callback, which already ignores it.
  It does not launch any blocked process, change dependencies/configuration or
  change test logic. With this shim and the exact requested test arguments,
  baseline result is `Test Files 1 failed | 110 passed (111)` and
  `Tests 1 failed | 843 passed (844)`; duration 33.92s.
- The baseline failing test is
  `src/session/surgeryCenterServicePreviews.test.ts:85`: “ignores the retired
  concealment flag and preserves the scheduled external service after an
  answer.” Expected pendingLabel to contain “Off-site thyroid fine-needle
  aspiration”; it instead describes generic care/return progress and timing.
  This establishes that the failure predates this worker's font edits.

## Progress and next action

- [x] Inspect instructions, handoff, owned files, selectors and canvas semantics.
- [x] Establish baseline typecheck and player-test results.
- [x] Implement the shared font system.
- [x] Inspect scoped changes and run final validation.
- [x] Append worker handoff for manager review.

Next action: manager visual review and acceptance. Owner opening pathway remains `START_GAME.cmd` →
`http://127.0.0.1:4173` in the usual persistent browser profile; no pathway or
storage changes are involved. This worker will not launch a browser.


## Sol worker handoff — implementation complete, manager review pending

This worker completed the assigned font milestone directly and spawned no
agents. Only the seven owned source files below and this document changed.
No line-height tweaks were made. No colours, geometry, sizes, spacing,
clinical content or approval status, save format, launcher or dependency files
were changed. No dependency installs, browser launches, commits or pushes ran.
The initial read-only status command is the sole no-Git brief deviation; no Git
mutation or further Git command occurred.

### Files changed

| File | Change |
| --- | --- |
| `apps/player/src/styles/tokens.css` | Added `--font-read` with the exact approved chart stack; existing `--font-pixel` is unchanged. |
| `apps/player/src/styles/global.css` | Body and form controls use the readable token. Appended font-only label/numeric rules and readable exceptions for stopped-time prose and service-price explanations. |
| `apps/player/src/ui/OpeningSequence.css` | Explicit readable opening-screen font; pixel wordmark and founder counter; readable sign-out button. |
| `apps/player/src/ui/chartSheet.css` | Changed only `--cs-read` to `var(--font-read)`; `--cs-mono` already uses the shared `--font-pixel`. |
| `apps/player/src/main.tsx` | Added the existing locally bundled Atkinson latin-400/latin-700 CSS imports. |
| `apps/player/src/ui/ChartPanel.tsx` | Removed only those two font imports; component code is byte-identical. |
| `apps/player/src/facility/FacilityScene.ts` | Changed only four font-family strings: shared activity/prose style and room names use Atkinson; earnings and the NO ACCESS badge use the exact pixel stack. |
| `docs/execplans/ui-font-system-20261007.md` | Created this scoped plan and appended the worker handoff. |

### Pixel-font selectors and reasons

The following selectors retain `--font-pixel` because they are small uppercase
labels, section kickers, table headings or brief alert headings. The chart's
back-of-chart eyebrow is explicitly excluded from the shared eyebrow rule,
preserving its original Atkinson font.

```css
.resource-chip > span,
.resource-chip-content > span,
.resource-chip-heading > span,
.eyebrow:where(:not(.chart-sheet *)),
.panel-heading span,
.patient-folder h2,
.tutorial-tab-callout,
.chart-section h3,
.build-section h2,
.campaign-card-heading span,
.character-qa-heading span,
.character-qa-heading strong,
.character-qa-representations figcaption,
.chart-timeline-guide,
.chart-step-heading,
.chart-vitals dt,
.message-board-item-heading strong,
.staff-summary-stat > span,
.staff-stat-label,
.service-fact > span,
.money-tile > span,
.build-cash-banner > span,
.room-upgrade-dialog h3,
.management-mode-title,
.money-period,
.money-ledger th,
.build-mode-title,
.build-mode-money > span,
.build-tool-toolbar-label,
.game-display-title,
.question-review-dialog-heading > span,
.question-review-item > header span,
.question-review-item > header strong,
.question-review-item li strong,
.build-group-heading,
.build-group-toggle > span:first-child,
.room-upgrade-benefit-key
```

These selectors retain `--font-pixel` because they represent compact status
pills/badges, stamped status, keyboard/display hints, or attention markers:

```css
.chart-completed-decision > summary strong,
.resolved-cabinet-button > span:last-child,
.chart-title-status,
.chart-state-badge,
.chart-confidence-badge,
.chart-back-stamp,
.message-board-new-token,
.message-board-priority-icon,
.staff-role-note::before,
.staff-training-status,
.management-paused-chip,
.service-kind,
.service-status-tag,
.build-problem-chip,
.build-ready-badge,
.build-owned-status,
.room-max-tag
```

These selectors use `--font-pixel` plus
`font-variant-numeric: tabular-nums` for changing amounts, clock times, XP,
counts, percentages, levels, durations, zoom or upgrade/earnings values.
Some compact status badges also contain counts or durations, so they appear
in both inventories. The existing staff-role metadata remains readable, with
only its numeric bold values using the pixel font.

```css
.resource-chip strong,
.resource-money-value small,
.resource-xp-row > small,
.speed-button,
.patient-folder h2 > span,
.answer-choice-eta,
.staff-summary-stat strong,
.staff-role-count,
.staff-role-meta b,
.staff-morale-value,
.staff-salary-value,
.staff-training-pips small,
.staff-training-status,
.management-section-meta,
.service-row-price,
.service-level-tag,
.money-tile strong,
.money-cost-legend b,
.money-runway b,
.money-earnings-value,
.money-ledger .is-number,
.money-ledger tbody td:first-child,
.build-cash-banner > strong,
.build-mode-money > strong,
.upgrade-level-change,
.selected-room-level,
.chart-vitals dd,
.facility-heading-actions strong,
.facility-zoom-overlay output,
.build-group-stats,
.build-owned-summary > span,
.room-action-menu-level > span,
.room-upgrade-benefit-delta b,
.room-action-menu-spent,
.build-ready-badge
```

Opening-sequence exceptions are `.opening-wordmark` (small uppercase branding
label) and `.founder-preset-label small` (founder index/count; also tabular).
The opening prose, name/auth inputs, choices and sign-out button use Atkinson.

Canvas exceptions are the earnings popup's numeric `fontFamily` and the small
uppercase `! NO ACCESS` badge's `fontFamily`. Their literal stack now exactly
matches `--font-pixel`; monospaced canvas digits align inherently. The shared
canvas text style also supplies some brief uppercase interaction hints; its
readable font is used because the same style supplies prose/activity and
inspection bubbles and this lane permits changing font strings only.

The approved chart's existing `--cs-mono` selectors remain unchanged. Its
`--cs-read` token resolves to precisely the original family stack. The globally
styled back-of-chart stamp retains the same mono stack; the chart's explicit
button fonts continue to override the global form-control font.

Readable exceptions to the broad numeric HUD/price selectors are:

```css
.facility-time-chip.is-build-mode .resource-chip-content > strong,
.facility-time-chip.is-management-mode .resource-chip-content > strong,
.service-row-price small
```

They contain full stopped-time explanations or an “after stock” explanation,
so they use `--font-read` instead of inheriting a numeric font. All other body
text, panel lists, tooltips, help/tutorial text, dialogs, alert prose, management
and build prose, and ordinary button/input text inherit or explicitly use
`--font-read`.

### Source-scope review

Compared each live owned source with its captured pre-edit snapshot. PostCSS
comparison after removing only font declarations is identical for every CSS
file; non-font declarations, rules, comments and order are preserved. Chart CSS
reconstructs its entire original file exactly by restoring the one literal
`--cs-read` value. TSX differences consist solely of the two moved imports;
FacilityScene differs solely in four font-family strings. All seven source
files preserve their original LF line endings. Exact readable/pixel stacks were
also checked. The changes are frozen for manager review.

Temporary source snapshots, the exact applied edit ledger and scope audit are
at `C:/Users/rowla/AppData/Local/Temp/gamifysurgery-ui-font-system-ke9h1s`; these are scratch evidence, not durable
repository changes. The source audit reported:

```text
apps/player/src/styles/tokens.css: font declarations only; sizes/line heights/layout/colours unchanged
apps/player/src/styles/global.css: font declarations only; sizes/line heights/layout/colours unchanged
apps/player/src/ui/OpeningSequence.css: font declarations only; sizes/line heights/layout/colours unchanged
apps/player/src/ui/chartSheet.css: font declarations only; sizes/line heights/layout/colours unchanged
apps/player/src/main.tsx: font import lines only; all other bytes unchanged
apps/player/src/ui/ChartPanel.tsx: font import lines only; all other bytes unchanged
apps/player/src/facility/FacilityScene.ts: exactly four font strings; all other bytes unchanged
Shared stacks exact; no line-height tweaks; original LF line endings preserved.
```

### Exact validation output

Final `npm.cmd run typecheck`: exit 0, all seven workspace scripts
(eight TypeScript compiler invocations) pass.

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Final exact player-test command without a preloader: exit 1 before tests due
to the same pre-edit sandbox limitation. Output:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads --maxWorkers=1

failed to load config from C:\Users\rowla\Projects\GamifySurgery\apps\player\vite.config.ts

⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯
Error: Build failed with 1 error:

[plugin externalize-deps]
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:458:11)
    at spawn (node:child_process:813:9)
    at Object.execFile (node:child_process:349:17)
    at exec (node:child_process:236:25)
    at optimizeSafeRealPathSync (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:2483:2)
    at windowsSafeRealPathSync (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:2469:3)
    at getRealPath (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:32509:36)
    at tryResolveRealFileOrType (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:32503:9)
    at tryCleanFsResolve (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:32252:21)
    at tryFsResolve (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:32245:14)
    at aggregateBindingErrorsIntoJsError (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/rolldown/dist/shared/error-BHRSI0R7.mjs:48:18)
    at unwrapBindingResult (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/rolldown/dist/shared/error-BHRSI0R7.mjs:18:128)
    at #build (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/rolldown/dist/shared/rolldown-build-CtPvmZgJ.mjs:3276:34)
    at async bundleConfigFile (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:36132:17)
    at async bundleAndLoadConfigFile (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:36040:18)
    at async loadConfigFromFile (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:36001:42)
    at async resolveConfig (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:35617:22)
    at async _createServer (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vite/dist/node/chunks/node.js:25777:65)
    at async createViteServer (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vitest/dist/chunks/cli-api.BK8pd4xc.js:8835:17)
    at async createVitest (file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/vitest/dist/chunks/cli-api.BK8pd4xc.js:14221:18) {
  errors: [Getter/Setter]
}



npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

To run the full suite inside this sandbox, a temporary Node preloader handles
only Vite's optional Windows network-drive discovery failure. Its complete
contents are below; nothing in node_modules or repository config was edited.
It tries the original call, catches synchronous `EPERM` only for `net use`,
then reports that error to Vite's existing callback, which already ignores it.
All other child-process requests behave exactly as before.

```js
const childProcess = require('node:child_process');
const { EventEmitter } = require('node:events');
const originalExec = childProcess.exec;
childProcess.exec = function (command, options, callback) {
  try {
    return originalExec.call(this, command, options, callback);
  } catch (error) {
    if (command !== 'net use' || error.code !== 'EPERM' || typeof callback !== 'function') throw error;
    setImmediate(() => callback(error, '', ''));
    return new EventEmitter();
  }
};
require('node:module').syncBuiltinESMExports();
```

Final invocation (PowerShell; original NODE_OPTIONS is restored afterward and
npm's exit code is preserved):

```powershell
$previousFontNodeOptions = $env:NODE_OPTIONS
$fontValidationExit = 1
try {
  $env:NODE_OPTIONS = ($previousFontNodeOptions + ' --require=C:\Users\rowla\AppData\Local\Temp\gamifysurgery-ui-font-system-ke9h1s\vite-net-use-eperm.cjs').Trim()
  npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
  $fontValidationExit = $LASTEXITCODE
} finally {
  $env:NODE_OPTIONS = $previousFontNodeOptions
}
exit $fontValidationExit
```

Final suite: exit 1; 110 files / 843 tests pass, one file / one test fails.
Exact complete captured output:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 740ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 64ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 110 passed (111)
      Tests  1 failed | 843 passed (844)
   Start at  21:50:47
   Duration  37.94s (transform 3.70s, setup 0ms, import 21.18s, tests 8.44s, environment 6ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

The same preloader and test arguments were run before any source font edit.
Exact captured baseline output establishes the failure predates this milestone:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 382ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 38ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 110 passed (111)
      Tests  1 failed | 843 passed (844)
   Start at  21:41:38
   Duration  33.92s (transform 2.53s, setup 0ms, import 19.15s, tests 6.25s, environment 6ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

The baseline and final failures have the same assertion, expected service name,
received pendingLabel and line 85 location. They concern service-preview wording,
outside this lane. The failing test and gameplay/view-model code were untouched.

### Remaining review and next action

- [x] Shared token, entry imports and readable UI defaults implemented.
- [x] Pixel label/status/numeric exceptions and tabular declarations implemented.
- [x] Actual source deltas inspected against captured snapshots.
- [x] Requested typecheck and player-suite checks completed and recorded.
- [x] Handoff complete; source ownership released to the manager.
- [ ] Manager performs the visual/browser check, including opening sequence,
  regular play, money/clock changes, management/build panels, employee discussion,
  help/tutorial/dialogs, and chart front/back at desktop/phone widths.

The manager should check canvas text after a cold reload too: this worker's
font-string-only lane does not add canvas font-loading synchronization. CSS
font families are verified statically; actual rendered wrapping/metrics and
chart visual equivalence require the manager's browser check. No new visual
approval is claimed here.

This milestone is local only. Manager acceptance and the owner reminder to say
**“push to GitHub”** for an audited backup remain with the Claude manager. The
manager should append the accepted outcome to
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`; that shared coordination file was
outside this worker's lane. Owner pathway remains `START_GAME.cmd` →
`http://127.0.0.1:4173` in the usual persistent profile; storage was untouched.

### Manager review — 2026-10-07
ACCEPTED. Diff reviewed (tokens.css `--font-read`, main.tsx imports, body default, retained pixel selectors). Visual check on QA origin http://127.0.0.1:5183 (synthetic campaign): body/buttons/tutorial/goals render Atkinson; HUD labels, kickers and numbers stay Courier; Atkinson loaded; no clipped text. Player typecheck clean; 843/844 with the known surgeryCenterServicePreviews failure.
