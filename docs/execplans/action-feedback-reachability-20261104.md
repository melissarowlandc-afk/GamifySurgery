# Noticeable action feedback and room access warnings (2026-11-04)

## Goal and ownership

Owner's Surgeon's Office was accessible only through the ambulatory OR. Hiring failed correctly but the small bottom-bar reason was missed. Show rejections prominently at the control/panel on both layouts; give placement/door warnings based on real pathing; explain which room a hire needs and how to fix its access. Keep problem-report suggestions for genuine technical errors. No gameplay, save, cloud, clinical or character-art changes; no Git, installs, network or browser execution. Shared domain/reducer/service, character/phlebotomy, and clinical/question lanes are protected.

## Findings and decisions

- `usePrototypeSession.ts:799,847` publishes ordinary domain rejections through the same undifferentiated notice as technical failures. `feedback/TesterFeedback.tsx:148` offers a problem report for either. The desktop announcement (`AppShell.tsx:1160`) and phone announcement (`MobileShell.tsx:524`) are screen-reader-only; the available notice does not follow the player's clicked control.
- The staff view permits hiring when capacity/room/cash requirements are met but does not preview `getEmployeeArrival`. The domain rejects an unavailable path at `packages/game-domain/src/reducer.ts:9892` with a generic required-room message. StaffPanel shows some disabled reasons only when a role is expanded.
- Real staff arrival uses `getEmployeeArrival` / `findCareAwareFacilityPath` (`staff.ts:689`, `:763`). `care-room-access.ts` defines protected care rooms and blocks pass-through unless that room is an authorized destination. Reuse those public helpers for presentation, without editing any domain file or rebinding Level 5 inputs.
- Native snapshot/catalog hotfix and all prior lanes remain intact. Baseline copies/hashes: `.local-dev/action-feedback-reachability-20261104/before*`.

## Implementation milestones

1. Add ephemeral typed command feedback (rejection/warning/error) while retaining the existing string API. Repeated equal rejections must announce again. Add one shared anchored, accessible feedback layer to phone and desktop shells; capture pointer/keyboard action location, remain visible above sheets, clamp within viewport, support dismissal, and offer the existing report flow only for technical errors. Do not change command execution/storage/authority.
2. Add a pure player-side access presenter using domain path functions. Distinguish a genuine restricted-room corridor from merely being adjacent to a care room; recognize safe alternate doors/routes. Explain missing required rooms/hire access, add build warnings as geometry changes and in placement/selected-room controls. Keep all placement/hire rules unchanged.
3. Tests: repeated/local/hosted action rejection, phone + desktop active panels, no report suggestion for expected rejections; missing office, office through OR, another protected room, safe hallway alternative, no mutation of preview state. Test component structure and live regions; manager checks physical positioning.
4. Focused/full player with documented sandbox preload + `--pool=threads`, seven workspace typechecks (and e2e/QA types if presentation contract requires); exact counts. Update shared handoff with concrete browser verification steps and scoped audit.

## Progress and next action

Implementation and validation complete; manager browser acceptance is pending. No domain or session/cloud file was edited. The necessary `usePrototypeSession` edits carry the existing rejection receipt to presentation, classify 23 expected UI prerequisites, and publish topology warnings after accepted room/door commands. Domain receipts and execution/save/authority policy are unchanged.

- `diagnostics/problemDiagnostics.ts`: ephemeral `{id, kind, message}` feedback snapshot, preserving the old string API. Repeated identical refusals get a new ID; nothing is persisted/submitted. Technical messages retain the default error category.
- `ui/ActionFeedbackLayer.tsx` / `.css`: one layer per active shell, portal above sheets, actual control/pointer anchor, viewport/safe-area clamping, resize/scroll observation, assertive atomic live region, Dismiss/Escape and no timed expiry. A pointer-down/click pair is one gesture, so Phaser's trailing click cannot erase a new build warning. Genuine errors alone offer the existing consent-based report flow. The manual More/report entry remains available. No game/cloud/report API, network, clock or storage work is added by the layer.
- Shell mounts are two lines each in `AppShell.tsx` and `MobileShell.tsx`. `feedback/TesterFeedback.tsx` retains the bottom notice but no longer suggests reporting expected rejections/warnings.
- `ui/roomAccessFeedback.ts`: read-only actual care-aware/unrestricted path comparison, using the same Front Desk entrance and domain navigation anchors. Only a proven protected-room corridor is named. Doorless new rooms test real permitted doors; any safe alternative suppresses the restriction claim. Unknown/disconnected rooms retain existing physical-access guidance. Hire presentation improves only the known generic missing-room/path receipts; cash/unlock/capacity/stale-action reasons remain exact.
- Placement warnings: phone ghost/confirmation inline; accepted room/door actions at the clicked control/map point on both layouts; persistent selected-room controls on both layouts. Warnings never reject an accepted placement. No facility scan runs for ticks, ordinary commands or each painted hallway cell. Only room/door confirmation and the paused selected-room preview run these checks.
- Staff reasons: disabled Hire preconditions remain next to the button even with desktop roles collapsed, with `aria-describedby`; phone role details use the same prominent style. Missing Surgeon's Office text names both room and role. Desktop's accessible name retains the existing `Hire $…` prefix (used by browser tests) and adds the role; integration assertions cover this contract.
- `viewModels.ts` has only four added/two replaced presentation lines (import, two generic missing-room strings, selected-room warning). No character/facility presenter or clinical/question file is edited.

Final focused validation: **9 files / 105 passed**, 41.18 s, documented preload + threads/two workers, exit 0 (`focused-final-current.log`). **26 new cases** across four new suites: real local/hosted hires and both shells; actual reducer rejection/cash/employee invariants; warning before/after placement and persistent room controls; missing office and real OR/Endoscopy obstructions; legal public alternative; no input mutation; repeated messages, keyboard, genuine-error report CTA, canvas event coalescing, four viewport bounds, and quiet automatic ticks at local/hosted command gates. Existing build validity/reason/cost parity tests pass unchanged. An earlier complete run passed 105/105 in 67.04 s; the final run also covers the retained `Hire $…` locator contract.

Shared-tree validation observations: initial domain imports were blocked by in-progress clinical edits and a temporary missing `tickStateDraft.ts` import. Those were repaired by the concurrent lanes, without edits here. The first complete full run was **342 files passed / 1 failed; 3,416 tests passed / 1 failed**, 1,370.53 s, preload + threads/two workers, `CI=1`. Its sole failure received the old `Hire Surgeon $1,400` label against the newly added price-prefix assertion: StaffPanel had already been compiled before the worker's final label edit during that run. Fresh focused 105/105 and fresh CI integration **6/6** (11.65 s) use the current `Hire $1,400 (Surgeon)` label and pass. The final full run kept this lane's source frozen and **passes all 345 files / 3,421 tests**, 411.82 s, with the same existing CI allowance and four workers (the repository's configured default). An earlier non-CI full run was stopped when obsolete after the quiet-tick/long-press fixes. No assertions/thresholds were relaxed and no out-of-lane source was patched.

## Validation and handoff

Manager owns Playwright/browser, visual confirmation and integration/release. Existing origin/profile paths are unchanged. Sandbox results:

| Check | Result | Evidence |
| --- | --- | --- |
| Focused player | **9 files / 105 tests passed**, 41.18 s, exit 0 | `focused-final-current.log` / `.exit` |
| Fresh CI integration control | **1 file / 6 tests passed**, 11.65 s, exit 0 | `integration-ci-current.log` / `.exit` |
| Full player, preload + threads + CI=1 + four workers | **345 files / 3,421 tests passed**, 411.82 s, exit 0 | `full-player-stable.log` / `.exit` |
| Seven workspace typechecks | **7/7 passed**, exit 0 | `typecheck-final-current.log` / `.exit` |
| Extra e2e/QA typecheck | **passed**, exit 0 | `typecheck-e2e-current.log` / `.exit` |

All evidence files live under `.local-dev/action-feedback-reachability-20261104/`. No browser was launched. No domain helper or rule was changed, so no Level 5 input/rebind is required. Shared-tree source updates account for the two additional files/four tests between the two complete full runs.

Exact commands (PowerShell; no source timeout or assertion changes):

```powershell
$env:NODE_OPTIONS=(($env:NODE_OPTIONS+' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/ui/ActionFeedbackLayer.test.tsx src/ui/actionFeedbackIntegration.test.tsx src/ui/roomAccessFeedback.test.ts src/ui/actionFeedbackClock.test.tsx src/ui/StaffPanel.test.tsx src/feedback/TesterFeedback.test.tsx src/mobile/build/buildSession.test.ts src/ui/BuildPanel.test.tsx src/mobile/build/MobileBuild.test.tsx
$env:CI='1' # Existing repository allowance for the shared slow sandbox.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=4
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/loading-screens-20261102/tsconfig.e2e.json
```

Scoped audit: `.local-dev/action-feedback-reachability-20261104/scoped-files.json`, `runtime-and-tests.diff`, `validation-source-sha256.json` and `protected-source-audit.json`. The original `staff.ts`, `care-room-access.ts`, `service-operations.ts`, `BuildPanel.tsx` and facility contract hashes match. `spatial.ts` and `reducer.ts` changed concurrently in the domain lane; this worker made no edit there. This milestone changes no Level 5 bound input.

Concurrent shared-file integration: a separate learning-development presenter extraction modified `viewModels.ts` at 16:26:55, before the final fresh full run started at 16:36:03. It preserves all four feedback hunks. The final full run therefore validates that integration. The final `scoped.diff` compares this file against `before-viewModels-with-concurrent-learning.ts`, retaining the concurrent extraction in its baseline and showing only this lane's four added/two replaced lines. `external-viewModels-learning.diff` records the unrelated extraction separately; the initial source hashes remain preserved. Do not package that extraction as part of this UI milestone. The final 105/105 focused repeat at 16:48 also passes against the subsequent concurrent spatial/reducer updates; all seven current workspace typechecks pass afterward.

### Manager browser verification

Use a **disposable** Level 3 campaign with at least $10,000 and OR/office construction unlocked, using the existing QA fixture setup. For local owner testing the canonical launcher remains `START_GAME.cmd` at `http://127.0.0.1:4173`; use a disposable persistent profile/campaign. The manager's disposable QA server remains a separate origin/storage, e.g. `http://127.0.0.1:5184`. Do not edit the owner's campaign to construct this test. Run desktop at 1440x1000 and 1280x720, phone presentation at 390x844 and 375x667 (query `?layout=phone` switches presentation without changing origin).

1. **Reproduce the office/OR geometry.** With the standard Front Desk at (33,28), place a 4x4 Ambulatory OR at (38,28), then a 2x2 Surgeon's Office at (42,28). Add the Front Desk east-wall row-A door (offset 0), and give the office only its west-wall row-A door (offset 0). These correspond to the tested geometry translated from the unit fixture; use a clean portion of the site with no other route. The office placement/door action should show a cream, dark-bordered access warning at the map click/confirm control, name Ambulatory OR and Surgeon's Office, and offer Dismiss, without a report suggestion. On phone, drag the office ghost first: its warning is already next to Place; placement stays permitted. Select the office on each layout and check the persistent warning; phone must not claim "Access ready".
2. **Hire and repeat.** Exit Build Mode. Desktop: Enter Management Mode -> Employees -> Hire on Surgeon (keep its role collapsed for one attempt). Phone: Manage -> Employees -> Surgeon -> Hire. Immediately see the prominent message near that exact control, above the active panel: "The Surgeon can't reach the Surgeon's Office" plus the OR restriction and hallway/waiting-area fix. No hire charge/employee appears. No problem-report CTA appears inside this message. Dismiss and repeat; repeat with Tab/Enter: it must announce again and stay until dismissed/the next action. Underlying session remains playable.
3. **Fix the route.** In Build Mode add a public hallway along y=27, x=37..43, a Front Desk north-wall offset-4 door, and an office north-wall offset-1 door. This supplies a public alternative around the OR. The warning should clear, selecting the office should no longer show the care-room restriction, and hiring the Surgeon should succeed under the unchanged domain rules. Repeat adjacent to another protected room (e.g. Endoscopy); do not warn merely because an OR is nearby when the public route exists.
4. **Other actions/error distinction.** On a disposable low-cash/stale-state setup, trigger an allowed-to-click but reducer-rejected build/upgrade/chart action; verify the actual reason appears at that control and no report suggestion is added. A missing office's disabled Hire reason must be visible without expanding desktop role details, and in the phone role panel. Trigger a controlled genuine save/worker error through existing QA fault injection: its visible message should still offer Send a problem report and the existing consent dialog. Do not submit a report unless intentionally testing the authorized fake transport. Check long text stays within all four viewports; scroll/resize, keyboard focus and reduced-motion preferences should remain usable.

Manager should confirm exact toast placement visually; the sandbox runs pure layout-bound calculations/component structure, not a browser engine. No browser was launched here.
