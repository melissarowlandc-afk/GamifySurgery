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

## Manager release (2026-11-02)

Released with the real-room catalog thumbnails and the room-lighting fix as
`da3352f4` (content-diff release; question-quality work excluded). Accepted:
release-tree CI suites (player 3,193; game-domain 4,332 + 1 skip), typecheck,
build, boundaries, thumbnail --verify (157), cloud e2e 116/116 against the
release tree; held-opening screenshots on phone/desktop. Pages run
41485107416 succeeded; live bundle index-CvyrsdHT.js; thumbnails served.
Placeholder art (app icon) until the owner-chosen Spring Morning art
(Lantern Evening founder) is wired in the follow-up.


## Chosen welcome art follow-up (2026-11-02)

The owner selected Spring Morning with the Lantern Evening founder (01b), replacing the app-icon placeholder from live da3352f4. The scope is presentation only: shared loading, auth/setup, and account campaign entry, plus losslessly optimized public PNGs. Auth, cloud, save formats, domain, clinical content and question tooling stay outside this lane. The tree is shared with the clinical/question and room-art workers. No Git, installs, network or browser execution.

Requirements: choose portrait at viewport aspect ratio <= 1 and landscape above 1; preserve the entire composition with `contain` and pixelated scaling; place loading copy over the calm lower band; reuse the OpeningSequence wordmark; preload only the matching art early; provide a solid matching background before decode. Keep the 400 ms no-flash threshold, healthy loading without buttons, bounded failures with one existing recovery action and the problem-report path, focus management, safe areas and reduced motion. Auth forms, campaign controls and notices remain usable and retain their text and semantics.

Implementation plan: (1) lossless asset optimization and manifest with alt text, dimensions, palette and hashes; (2) shared art/wordmark presentation with a responsive no-crop loading composition and readable entrance panels; (3) asset, viewport-selection, preload, contrast and structure regression tests; (4) focused/full player tests with sandbox preload and threads, seven-workspace typecheck, optional e2e/QA typecheck, then handoff for manager screenshots. Baselines and lossless receipts are in `.local-dev/welcome-ui-20261102/`; no unrelated edits will be reverted.

Progress: current UI, artwork, asset conventions and applicable instructions inspected. Both selected PNGs were recompressed with the already-installed Pillow; pixel-for-pixel equality and unchanged native dimensions verified. Portrait: 1,646,899 -> 1,401,239 bytes; landscape: 1,722,478 -> 1,495,775 bytes. PNG remains the single shipped format; no extra phone derivative is necessary.

Implementation complete: `WelcomeArtwork` shares one public manifest and native picture sources selected by aspect ratio (square uses portrait). The matching PNG is preloaded in both production and disposable-QA HTML before module startup; base-safe URLs were verified in an offline production build using `/GamifySurgery/`. Before decode, the loader and an empty app root use the artwork's solid background colour. Full-screen loading reserves a flexible art row and overlays only the quiet lower band with the existing OpeningSequence wordmark, readable status and progress. `contain` preserves the complete composition; portrait extends by 30% of the art row and landscape by 20%, keeping the people and doorway above the copy even when errors or large text need more room. The ordinary entrance screens use a desktop art/sidebar layout and a compact narrow-screen art header with an opaque form/campaign panel. Sign-in, personal setup, campaign controls, consent notices and the one Account & privacy section remain present.

No auth/cloud logic, save formats, deadlines, gate decisions, loading delay, recovery actions, clinical/question content or e2e accessible names changed. Artwork/structure tests cover PNG headers, hashes and dimensions; portrait/landscape/square selection; media-specific preloads; base paths; eager fetching; wordmark/status/progress structure; contrast and uncropped styling. Existing loading tests continue to cover the 400 ms threshold, healthy zero-button screens, bounded failure actions, focus/inert cleanup, native-dialog coverage, reduced motion and both shell mappings. Measured palette contrast: ink/panel **13.80:1**, ink/background **11.09:1**, progress fill/track **3.85:1**.

Validation in progress: focused UI/auth/entry/loading checks passed (194/194 in 6 files, 7.56 s); seven-workspace typecheck, cloud e2e/QA typecheck, and 12-module e2e worker-import boundary audit pass. Offline production build (public-directory copying disabled, output confined to `.local-dev/welcome-ui-20261102/build-check`) passes: 852 modules, 1.44 s. It retains only the existing large-chunk/static-dynamic-import warnings. The initial optional build attempt without the documented preload hit the sandbox's `net use` spawn EPERM; the same build with that preload passes. Full-player results and final focused coverage will be recorded below.

### Chosen-art validation and handoff

| Check | Exact final result |
| --- | --- |
| Focused artwork/loading/auth/setup/entry/save UI | **206 PASS / 0 FAIL, 7 files, 8.06 s**, native exit 0 (`focused-final.log`) |
| Full player, documented sandbox preload, `--pool=threads --maxWorkers=2` | **3,214 PASS / 1 FAIL, 312 files (311 pass / 1 fail), 402.18 s**, native exit 1 (`player.json`, `player.log`) |
| Outside-lane assertion isolated | **19 PASS / 1 FAIL, 1 file, 2.51 s**, native exit 1 (`outside-lane-isolation.log`) |
| All seven workspace typechecks | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-final.log`) |
| Cloud e2e/QA typecheck | **PASS**, native exit 0 (`e2e-typecheck.log`) |
| E2e import boundary | **PASS, 12 relative runtime modules**, no coordinator/codec-worker imports (`e2e-import-audit.json`) |
| Offline production build, `/GamifySurgery/` base | **PASS, 852 modules, 1.44 s**, native exit 0 (`build-final.log`) |

The sole player failure is the already-recorded clinical fixture assertion at `apps/player/src/session/variety3ChartsViewModels.test.ts:20`, `case.variety3.sedation-discharge-ride`. It reproduces in isolation. That test and `session/viewModels.ts` retain their pre-task hashes; no welcome UI is involved. The clinical/question lane is being edited concurrently and has not been changed or reverted by this worker. This is not an all-green integrated-tree claim.

Owned existing source/test paths: `ui/LoadingScreen.{tsx,css,test.tsx}`, `ui/loadingArtwork.ts`, `ui/OpeningSequence.{tsx,css}`, `auth/AuthGate.{tsx,test.tsx}`, `auth/SetupAccountForm.tsx`, `ui/CloudCampaignEntry.{tsx,test.tsx}`, `apps/player/index.html` and `apps/player/cloud-saves-qa.html`. New source paths: `ui/WelcomeArtwork.{tsx,css,test.tsx}` and `ui/OpeningWordmark.{tsx,css}`. Public assets: `apps/player/public/art/welcome/{manifest.json,README.md,spring-morning-portrait.png,spring-morning-landscape.png}`. All `ui/` and `auth/` paths are under `apps/player/src/`. Planning/handoff changes are limited to this plan and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. No e2e locator edits were required. All 22 owned source/test/HTML/asset inputs and their hashes are recorded in `.local-dev/welcome-ui-20261102/validated-inputs.json`; `owned.diff` and `validation.json` provide the scoped review and exact results.

Manager next action: rerun the existing 116 cloud browser cases and inspect loading (healthy and failed), sign-in/setup and Your campaigns at phone portrait, short phone landscape, tablet/square and desktop sizes. Check uncropped people/doors, calm-band copy, one matching image request, solid predecode background, touch/keyboard scrolling and focus, 200% text zoom, reduced motion and native chart-dialog coverage. Physical geometry is deliberately left to manager browser QA. No opening pathway, browser profile or storage origin changed. Work remains local and unbacked-up under the explicit No Git brief; manager owns acceptance and any separately authorized backup/release.


## Compact welcome entry and restored taglines (owner feedback, 2026-11-02)

Owner review of the unreleased art integration requested the existing rotating funny subtitle directly under the wordmark, stable throughout each load, plus an edge-to-edge entrance header and compact campaign choices. Normal 0/1/2-campaign states must fit without document scrolling at 390x844, 375x667, 1440x1000 and 1280x720. Keep the required visible one-line clinical disclaimer, actual notices/errors, new-account notice acceptance, every account/recovery/replacement action and one Account & privacy disclosure. Remove routine slot counts, redundant explanations and long saved timestamps from the visible normal state. Apply the same compact art header to sign-in/setup.

Lane remains UI/loading/auth/entry presentation, public art metadata, related tests and cloud e2e/QA presentation. Do not edit auth/cloud/save/domain or clinical/question logic. Preserve the shared tree; no Git, installs, network, browsers or agents. Baseline snapshots and validation will be in `.local-dev/welcome-compact-20261102/`.

Plan: restore taglines using existing select/read/write helpers with one selection per visible screen; turn campaign rows into accessible Resume buttons with level and relative saved time; group Start and the existing privacy disclosure in a footer. Use the full-width wide composition for compact headers, cropping only the calm bottom band; tall narrow phones with sufficient height use the portrait composition. No people or doorway cropping. Use a bounded, natural-height layout rather than hiding page overflow. Add structure tests for the requested viewport/count matrix and real geometry assertions in the browser specs for the manager. The disposable QA tools must not add document height to this check. Validate focused/full player with sandbox preload and threads, seven workspace typechecks, cloud e2e/QA typecheck and import boundary; manager runs browser geometry/screenshots.

### Compact-entry implementation

`OpeningBrand` reuses the existing select/read/write intro-tagline helpers and shared OpeningSequence wordmark. It selects once on mount and writes after the brand mounts; loading does not mount it during the 400 ms no-flash period. Stage/status/failure/Retry changes keep that line. Subsequent screens use the existing no-immediate-repeat rotation. Loading, sign-in/setup and account entry all display it directly below the wordmark; OpeningSequence keeps its existing rotation.

Campaign entry now has only a compact brand/Your campaigns/disclaimer header, `CampaignChoices` whole-row Resume buttons, and a Start/privacy footer in normal 0/1/2-campaign states. Each 60 px row has the full accessible `Resume <name>` action, level, short relative saved time and conditional archived/other-writer metadata; its precise saved date stays in the time element/title. Relative times are display-only and never order or resolve copies. There is no routine slot-count heading, empty-list essay, redundant saved-date line or separate Resume button. All notice, capacity, enrollment, replacement, recovery, deletion and read-only actions/guards are retained. The existing privacy details open as a bounded, scrollable panel from a 44 px footer summary; Sign out remains there and the duplicate AuthGate fallback is hidden only while this entry is mounted.

The entrance header fills its stage edge to edge and clips only the calm bottom band, using manifest crop heights 1260/1672 (portrait) and 780/941 (landscape). The people/doorway stay above those boundaries; PNG pixels, hashes and native dimensions did not change. Tall narrow campaign-entry viewports (width <=600, height >=840, aspect <=0.47) use portrait; smaller phones/desktop use landscape. Sign-in/setup always use the shallow landscape header. Complementary native picture sources handle viewport changes without needing a React rerender. Desktop stage width is capped by both viewport height and 64 rem. The normal page has natural content height and no page overflow clipping; only art and long single-line row labels are clipped. Safe-area padding remains around controls and the disclaimer is at least 10 px, visible on one line. Specific selectors protect this from late phone-entry CSS.

The disposable QA toolbar is now a collapsed fixed disclosure so it cannot create false page overflow. New cloud-browser cases cover 0/1/2 campaigns across all four requested viewports, polling fonts/art readiness, document vertical/horizontal overflow, every control's viewport bounds and >=44 px height, full-width art and lower-band-only cropping. No fixed sleeps or browser-only codec imports were introduced. Existing e2e assertions were adapted only for removed visible wording; archive/slot counts are still checked against actual rows and the fake server, and all writer/deletion/immutable-operation/recovery safeguards remain. Expected suite: the accepted 116 cases plus 12 project cases for these three new tests = 128 (manager confirms).

Test-only DOM mechanics were lifted verbatim from `mobile/screenTestUtils.tsx` to `ui/testDomHarness.tsx`, re-exporting the old API. Game fixtures stay in their original helper. Reconstruction matches the exact pre-task byte hash. This lets isolated brand/art/row tests run without importing clinical context; only these presentation unit tests stub the feedback button. Real feedback/loading/cloud integration assertions remain intact. The new row component owns no save logic and imports its transport summary type only.

### Validation progress and shared-tree findings

The first focused attempt was temporarily blocked by the other lane's missing `service.upper_endoscopy` reference. After it settled, focused tests ran; two static auth-copy assertions were adapted to exclude only the now-rotating subtitle while retaining exact equality of all sign-in copy. A subsequent full run exposed four more obsolete old-heading waits and one SSR subtitle equality assertion in App/mobile entry tests. Those now assert actual enabled Resume/Start/list state or normalize only the approved rotating subtitle; all storage, RPC, clock, ownership and no-replay assertions remain.

The first completed two-worker full run: **3,254 PASS / 16 FAIL, 317 files (312 pass / 5 fail), 567.23 s**, native exit 1 (`player-complete.json`). Five failures were the stale presentation assertions just fixed; eleven were existing 5 s timeouts in unchanged `automaticResolution.test.ts` and `periopNurseOwnerFeedback.test.ts`. Both files pass unmodified in single-worker isolation: **33/33, 2 files, 55.24 s**, native exit 0 (`timeout-isolation.log`). No timeout or safety assertion was increased/removed. A preliminary full run was canceled before the final header refinement and is diagnostic only. The final full run therefore uses the same documented preload and `--pool=threads`, **maxWorkers=1**, with original default timeouts.

Final focused checks include the App/mobile entry seams: **288/288 PASS, 14 files, 33.82 s**, native exit 0 (`focused-final.log`). The temporary concurrent missing-chiefComplaint type errors subsequently cleared; final all-seven-workspace and e2e/QA typechecks passed. Exact final full-run counts, source stability and closure artifacts will follow below. No clinical/question/domain/save/auth/cloud behavior was changed; auth and entry file edits are presentation only.

### Compact-entry final sandbox handoff

| Check | Exact final result |
| --- | --- |
| Focused UI/loading/auth/entry/App/mobile seams | **288 PASS / 0 FAIL, 14 files, 33.82 s**, native exit 0 (`focused-final.log`) |
| Full player, documented sandbox preload, `--pool=threads --maxWorkers=1`, unchanged default timeouts | **3,270 PASS / 0 FAIL, 317 files, 784.41 s**, native exit 0 (`player-single.json`, `player-single.log`) |
| Original timeout files, isolated without edits | **33 PASS / 0 FAIL, 2 files, 55.24 s**, native exit 0 (`timeout-isolation.log`) |
| Handoff typecheck across all seven workspaces | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-handoff.log`) |
| Handoff cloud e2e/QA typecheck | **PASS**, native exit 0 (`e2e-typecheck-handoff.log`) |
| E2e runtime import boundary | **PASS, 12 relative modules**, no coordinator/codec-worker import (`e2e-import-final-source.log`) |
| Offline production build, `/GamifySurgery/` base | **PASS, 864 modules, 1.46 s**, native exit 0 (`build-final-source.log`); public copying disabled |

The first completed two-worker run remains recorded above, including the five now-corrected presentation assertions and eleven 5 s timeouts. The final single-worker run passes every assertion with the same original timeouts; no safety check was weakened or removed. The previously reported Variety-3 fixture assertion also passes in this final snapshot after changes in its own lane. The final source/type/build checks and strict test results supersede earlier diagnostic logs.

All **32 scoped source/test/HTML/manifest inputs** match the final validation hashes. Four non-owned inputs changed during the full run: `apps/player/src/art/characterBitmapArt.ts`, `apps/player/src/art/characterProportionsQa.ts`, `apps/player/src/facility/FacilityScene.ts`, and `packages/game-domain/tests/gs028-20261007-level3-batch.test.ts`. They were preserved. Handoff typechecks were rerun after those changes and pass. The full test result belongs to the recorded run; manager owns final integration of concurrent work. No clinical/question/domain/save files were edited by this worker. `validation.json`, `validated-inputs-final.json`, `full-run-inputs.json` and `owned.diff` in `.local-dev/welcome-compact-20261102/` contain the exact results, file inventory and scoped audit.

Existing changed paths: CloudCampaignEntry and its tests; WelcomeArtwork/LoadingScreen presentation; loadingArtwork selection; AuthGate/SetupAccountForm presentation and auth tests; the old App/mobile entry presentation assertions; the shared test-harness re-export; disposable QA controls; cloud-saves e2e spec; welcome asset manifest/README. New UI paths: `OpeningBrand.{tsx,css,test.tsx}`, `CampaignChoices.{tsx,test.tsx}`, `campaignSavedTime.{ts,test.ts}`, `CloudCampaignEntry.css`, and `testDomHarness.tsx`. All UI paths are under `apps/player/src/ui/`. Exact inventory is in `validation.json`; planning changes are this plan and the current thread handoff. Existing PNGs, transport/coordinator/game-session logic, immutable operations, fixtures reaching codec workers and clinical/question content are untouched.

Next: manager runs the expected **128 cloud browser cases** and screenshots the requested normal 0/1/2-campaign viewport matrix, sign-in/setup, loading subtitle/progress, new-account notices and expanded privacy/error states. Geometry is intentionally checked in the real-browser spec, not claimed from the minimal unit DOM. Confirm no document scroll, all touch targets in view, edge-to-edge header, people/doors intact, native resize switching, required disclaimer, keyboard navigation and safe areas. Normal launch paths, browser profile and storage origins are unchanged. Work remains local/unbacked-up under the No Git brief; manager owns acceptance and any separately authorized backup/release.

Closure check: all 32 scoped inputs still match their validated hashes. Further concurrent edits appeared after the full run, in `App.tsx`, `art/characterBitmapArt.test.ts`, `session/cloud/codecWorker.ts` and `session/cloud/watchdogs.test.ts` (all under `apps/player/src/`), in addition to the four previously listed inputs. These were preserved. All seven workspace typechecks and the cloud e2e/QA typecheck pass again against the closure tree (`typecheck-close.log`, `e2e-typecheck-close.log`, both native exit 0). The 3,270-test result is for the recorded full-run snapshot, not a claim to have retested these later concurrent edits. The layout spec's fresh-context setup remains consistent with `selectCampaignToReopen`: a new context without retained local families or a last-active marker does not auto-select an unrelated account campaign. No extra e2e setup change was needed.
