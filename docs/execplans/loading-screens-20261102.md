# Shared loading screens — 2026-11-02

## Goal and approved scope

Replace fragmented full-screen waits and the background-return checking box with one phone/desktop loading presentation. Keep save authority, durability, automatic selection, recovery bytes, authentication and clinical content unchanged. The temporary illustration is `public/app-icon/icon-512.png`; final artwork is a separate manager decision.

This is the Codex worker lane from the Claude manager. The working tree is shared; clinical-content and question-tooling edits belong to another worker. No Git, installs, network, browser execution, server, save-format or domain changes.

## Presentation decisions

- Healthy waits appear only after 400 ms, with an opaque viewport overlay, game title, one status line and a progress bar. Stage changes do not restart that delay. Known opening stages show coarse stage progress; work without known stages is indeterminate. Reduced motion disables animation.
- Existing game state stays mounted underneath a gated background-return check. A check with a valid lease and `canExecute=true` shows nothing.
- Normal checking has no actions. A rejected operation, an existing classified blocking failure, or a 30-second presentation deadline can offer one recovery action plus the existing consent-based problem-report route. This deadline never grants authority or releases a command gate.
- Non-loading recovery states (other writer, revoked/deleted access, storage/capacity/offline warnings, verified-prior export, completed Save & Close) keep their existing recovery routes. They must not be mistaken for a healthy check or hidden behind a loading screen.
- An observable `checking` bit may be added to the coordinator view solely to distinguish an active foreground/reconnect operation from its prior failure; no gate or transport logic changes.
- One artwork definition supplies the default path and alt text, with optional portrait and landscape paths. Keep it out of worker-reachable modules.

## Milestones and ownership

1. Inspect the current wait states and preserve a source baseline. **Done:** `.local-dev/loading-screens-20261102/baseline.json` and `before/`.
2. **Implemented:** shared screen, artwork slot, mapping and accessibility; authentication, account entry, opening, shell preparation and genuinely gated foreground checks. Existing recovery choices remain reachable.
3. **Implemented:** delayed/failed/healthy mapping, state preservation and accessibility tests; updated presentation assertions and added deterministic slow-opening browser coverage.
4. **Performed; integration acceptance pending:** final full-player validation and shared-tree checks below. One outside-lane assertion remains; manager runs Playwright and visual captures.

Owned paths: player UI/shell/App/auth presentation, related presentation tests/CSS, cloud coordinator and game-session view observation, local journal binding presentation state, e2e presentation locators, this plan and the handoff. No clinical/question files.

## Acceptance and validation

All full-screen waits use `LoadingScreen`; waits shorter than 400 ms do not flash it. Healthy loading exposes no button. Failed loading has at most one recovery button and the problem-report link when hosted feedback is available. Focus moves into a visible overlay and returns afterward; underlying controls are inaccessible while covered. Opening and background checks dismiss on success, with no game-state remount for the latter. Safety tests retain command fencing and all recovery assertions.

Commands: player Vitest with `NODE_OPTIONS` preload `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`, `--pool=threads --maxWorkers=2`; `npm.cmd run typecheck`; TypeScript e2e/QA project plus the existing e2e import-boundary check. Exact results and remaining manager checks will be recorded below.

## Progress / discoveries

- Existing `CloudSaveControls` shows a Retry button for `phase=checking`, including healthy checks. Foreground verification can instead retain `phase=paused` and its old `lease-expired` failure while the request runs, so phase alone cannot distinguish active work from a failed check.
- Existing App opening markup unmounts the prior live game. The new overlay must preserve that owner until its replacement is verified.
- Inline list/older-copy/competition fetches that do not block play are not full-screen waits and retain their inline presentation.

## Implemented mapping

| Wait | Owner / presentation | Progress |
| --- | --- | --- |
| Remembered sign-in and initial account admission | `AuthGate`, `CloudAccount` | Connecting, step 1/3 |
| Entry worker/layout warmup and automatic enrollment | `CloudCampaignEntry` | Checking, step 2/3 |
| Campaign copies, previous-owner durability, hydration and selection | `App.CloudCampaignRouter` | Checking 2/3, then opening 3/3 |
| Gated return from suspension / explicit reconnect | `CloudSaveControls`, coordinator and game-session `checking` observation | Checking 2/3; absent whenever commands are allowed |
| Device recovery and local journal binding/switch | `App.AuthenticatedPrototype`, `usePrototypeSession.localPreparation` | Checking 2/3, opening 3/3 |
| Lazy phone shell and new clinic creation | `PrototypeShell`, `OpeningSequence` | Opening 3/3 |
| Explicit local/account Save & Close | `SaveCloseDialog`, `MobileShell`, `CloudSaveControls` | Indeterminate; existing confirmed-close presentation afterward |

Step progress describes known opening stages, not estimated bytes or elapsed-time percentages. `LoadingScreen` supplies the opaque fixed viewport, safe-area padding, centered art/title/status, status live region, progressbar, reduced-motion CSS, inert underlying controls, focus restoration and keyboard containment. It portals into the focused native dialog when necessary to cover its top-layer backdrop; the consent/report dialog retains its independent keyboard events. Nested owners suppress their own loading/blocked notice while an outer opening screen covers them. Fixed positioning reserves no space in the game layout.

All art configuration lives in `apps/player/src/ui/loadingArtwork.ts`: `src` relative to `public/`, `alt`, and optional `portrait` / `landscape` relative paths. Vite `BASE_URL` preserves the Pages path. The temporary art is the existing icon; no artwork was generated or modified.

## Exact failure/action conditions

- Every healthy screen waits **400 ms**, retaining its deadline across status/stage changes. If work completes sooner, no loading DOM appears. There are no loading actions while healthy.
- A supplied, classified failure appears immediately. Otherwise **30,000 ms of continuous waiting** exposes a short timeout explanation and the existing hosted problem-report path. This presentation deadline changes no lease, durability or execution permission.
- Retry is shown only when the owner supplies a safe existing recovery callback: sign-in restoration before game mount (reload), device recovery read, entry warmup, account refresh/enrollment retry, or the existing cloud reconnect/save retry after it has settled. A busy Save & Close does not offer a second operation or an invented reload; work that may own uncommitted bytes offers the report path until the existing bounded operation returns.
- A failed/timed-out router open offers **Back to your clinics** if no live owner exists. With a retained owner, its single action is **Return to your clinic**, preserving that instance and exposing its original storage/export/retry controls. It never releases accepted bytes to navigate away. Online/focus retries of failed opens remain automatic; a healthy in-flight open is not restarted by those events.
- A settled failed Save & Close also offers **Return to your clinic**, preserving the former Not now route to More / Account & privacy / recovery export. Retry remains in the existing Save & Close or blocked-status controls after returning. Keeping only a Retry action on the opaque failure screen would have hidden those recovery paths; final tests explicitly cover returning, restoring access and retrying without save choices.
- Other-writer **Open here**, revoked/deleted notices, verified-prior recovery/export, capacity/offline/storage notices, completed Save & Close, campaign selection and destructive double confirmations are recovery/decision states, not healthy loading. Their existing safety paths remain. Initial account-refresh/enrollment failures now include the same consent-based report link; only one recovery panel is offered when failures overlap.
- Before an authenticated identity is known, feedback cannot authenticate; the report link appears only when the existing hosted feedback transport is available. No new feedback data or consent rules were introduced.

## Keeping a waiting game intact

The router now renders the same keyed live game through its checking route, instead of disposing it while verifying its replacement. Its existing pause gate still refuses commands. `cloudPresentationCovered` keeps this retained projection's periodic pulse/focus/resume/upload events quiet while the router owns the open; hidden/pagehide still drain its small accepted local work. This restores the event quiescence of the former unmounted view without disposing its durability owner or memory. The subscription remains live. Normal active-session lease renewal, five-minute dirty checkpoint cadence, saved pause state, evidence, fencing and account revision formats are unchanged.

Regression coverage drives both layouts through a held head check, asserts that the old instance/map stays mounted and fenced, fires timer/focus/resume/hide/pagehide events, and verifies no duplicate old-owner work. Success opens the verified session; failure returns to the retained owner and its working retry path. Existing QA integration also holds foreground transport for 20 seconds: valid lease stays playable/invisible; expired lease stays fenced with an opaque, button-free loading screen and then resumes automatically.

Additional player file required by that mapping: `session/cloud/gameSession.ts:118,281,296,307`. Its reconnect can await local durability **before** the coordinator starts a check. `syncView.checking` now includes this outer foreground/reconnect work; fenced starts/finishes notify the UI. No command permission, await, deadline, checkpoint or transport behavior was added or changed. Cheap valid-lease focus returns do not add these notifications. The existing stalled-journal integration test now checks the full, button-free cover at 400 ms while the same accepted bytes remain mounted, then verifies the original storage failure and safe Retry at its existing deadline.

## Validation history and shared-tree observations

- Consolidated focused pass before final retry review: **311/311, 12 files, 46.68 s**, native exit 0. Final-source rerun and full-player results are recorded below when complete.
- E2e relative-import guard: **PASS, 12 runtime modules**, no coordinator/codec-worker dependency introduced. Added two layout cases (eight project cases) for a held real browser opening: one loading region/bar, no healthy Retry/dialog, automatic dismissal. Existing safety assertions remain.
- Earlier full run found stale cloud-open/save-close presentation assertions; these now assert the opaque cover, return-to-retained-owner path and the same safety invariants. Its unrelated `variety3ChartsViewModels` failure was not edited.
- Workspace/e2e typechecks initially passed. A subsequent shared-tree check reported `FacilityScene.ts:3436` (`{x,y}[]` versus `Vector2[]`) in another worker's room-art lane; that file was left untouched. Latest stable results will supersede this observation.
- The room-art type error was subsequently fixed in its lane. A later check found `packages/game-domain/tests/early-levels-20260913-batch.test.ts:14:243` (`number` versus `0 | 1 | 2 | undefined`); that was also fixed in its lane. Closure checks pass all seven workspaces and e2e/QA. Neither file was edited here.

Validation artifacts and the exact owned-source baseline/diff/hashes live under `.local-dev/loading-screens-20261102/`. No Git, installs, network, browser, server, save-format, domain, clinical or question-tooling changes were performed by this worker. Concurrent room-art and clinical edits were preserved.

## Final sandbox handoff — 2026-11-02

| Check | Exact result |
| --- | --- |
| Final focused player/session/UI | **372 PASS / 0 FAIL, 14 files, 52.21 s**, native exit 0 (`focused-complete.log`) |
| Final full player, documented preload, threads, maxWorkers=2 | **3,192 PASS / 1 FAIL, 311 files (310 pass / 1 fail), 411.69 s**, native exit 1 (`player-complete.json`, `player-complete.log`) |
| Outside-lane failure isolated separately | **19 PASS / 1 FAIL, 1 file, 3.96 s**, native exit 1 (`outside-lane-isolation.log`) |
| Closure root typecheck, all seven workspaces | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-closure.log`) |
| Closure e2e/QA TypeScript project | **PASS**, native exit 0 (`e2e-typecheck-closure.log`) |
| E2e import boundary | **PASS, 12 relative runtime modules**, no coordinator/codec-worker import (`e2e-import-audit-handoff.log`) |

The sole full-player failure is `apps/player/src/session/variety3ChartsViewModels.test.ts:20`, case ID `case.variety3.sedation-discharge-ride`. It reproduces by itself, using only the pure chart fixture/view-model path. Both that test and `session/viewModels.ts` match their pre-task byte hashes; no loading code runs in that assertion. This outside-lane assertion was left untouched. The previously reported game-domain type error was fixed in its lane before the all-seven-workspace closure pass. This is **not an all-green integrated-tree claim**.

All **30 owned source/test inputs** match the final pre-validation hashes. Among 1,435 monitored final-run inputs, only the non-owned game-domain type-error test changed between snapshot and handoff (the fix noted above). Earlier runs observed concurrent room-art and clinical changes as well; none was edited or reverted here. `validation.json`, `owned.json`, `owned.diff`, `validated-inputs.json`, and `validation-worktree-inputs-final.json` contain the scoped audit and exact machine-readable results. Earlier `*-handoff` / `*-release` logs are diagnostic; `*-complete` and `*-closure` are the final validation artifacts.

Manager browser run: **116 expected cases** across the four projects (the existing 108 plus eight project cases for the new two-layout slow-opening test). Use a fresh QA server and run `tests/e2e/cloud-saves.spec.ts` plus `tests/e2e/cloud-recovery.spec.ts`. Capture phone/desktop, portrait/landscape, normal/reduced motion, a held expired-lease return, failure/report consent, and the active chart/native-dialog cover. Check that a valid-lease foreground return never paints a loader and that a successful check removes it automatically. Review the final artwork separately through `loadingArtwork.ts`.

## Next action

Manager resolves the outside-lane chart assertion, reruns integration and the 116 browser cases, captures/reviews the loading screens, then accepts this milestone. Opening pathways and browser storage origins are unchanged. Changes remain local and unbacked-up under the explicit No Git brief; the manager owns any separately authorized checkpoint/release.
