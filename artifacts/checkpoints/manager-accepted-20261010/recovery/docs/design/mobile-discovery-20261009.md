# Mobile discovery — 2026-10-09

Report for the Claude Code **GamifySurgery manager**. This is discovery, not an implementation or an accepted mobile design.

Owner direction: create the most usable mobile experience, with permission to replace the existing mobile presentation, while keeping the game rules and desktop behavior intact.

## Scope and evidence

Only this report was written. No application, test, asset, configuration, launcher, planning or handoff file was edited. No dependencies were installed, no Git mutation was performed, no server was started, and no owner campaign or browser storage was opened. The shared worktree was already extensively dirty; the inspected HEAD was **ed638d2c**. Findings describe the working files, not merely that commit.

Evidence labels used below:

- **Source-confirmed:** implemented in the inspected code.
- **Historical evidence:** an existing plan/handoff records a passing check; it was not rerun here.
- **Measured:** read-only filesystem/header measurements or an in-memory Node source sampler run during this discovery.
- **Unverified:** requires a current browser or physical-phone check.

Search covered active player/workbench source, packages, scripts, tests, root documents, docs, tools and relevant artifact copies. Dependency/build/private-input directories were excluded from the active-source inventory. Generated review pages and checkpoint copies are distinguished from gameplay. No proprietary clinical inputs were read. Since rg is unavailable in this environment, equivalent recursive Node/PowerShell searches were used.

## Main findings

1. **There is no separate mobile game or mobile shell to recover.** Mobile work is a collection of responsive rules in the desktop shell, a full-screen chart, responsive dialogs/tutorials, and Chromium phone-size regressions. App always mounts AppShell; there is no width/device-based shell selection. See apps/player/src/App.tsx:62 and apps/player/src/AppShell.tsx:199.
2. **The session and view-model boundary is a strong starting point for a separate presentation.** Reuse one usePrototypeSession and its commands, and project the same PrototypePlayerView into another shell. Avoid another clock, reducer, save format or clinical flow. See apps/player/src/App.tsx:35, apps/player/src/session/viewModels.ts:135 and apps/player/src/session/usePrototypeSession.ts:536.
3. **The map interaction is the largest functional phone gap.** Phaser supplies single-touch pointer compatibility, but the game has no pinch recognizer or explicit multiple-touch setup. Placement/door edits happen on pointer-down, construction pan competes with room selection, and small world-space targets shrink with zoom. See apps/player/src/facility/FacilityScene.ts:7797, :7960 and :8187.
4. **Performance needs a real-device gate before phone usability can be accepted.** The existing local build contains an 8.21 MB JS chunk. The scene initially requests 199 environment/room/decor images totaling 24.57 MB compressed and approximately 351 MiB of nominal decoded RGBA pixels. Those figures exclude later lazy character textures and additional generated canvases. See the measurements and limitations in section 4.
5. **Phone access already has a private HTTPS route.** START_PRIVATE_GAME.cmd starts a distinct loopback backend on 4174 and Tailscale Serve at https://melissadesktop.taile197db.ts.net/. It leaves the canonical desktop launcher on 127.0.0.1:4173. All these origins/devices keep separate browser-local campaigns.

## 1. Existing mobile and responsive work

### 1.1 Runtime presentation

| Piece | What it does today | Status / replacement assessment |
| --- | --- | --- |
| Viewport | apps/player/index.html:5 sets width=device-width, initial-scale=1. No viewport-fit=cover or app-specific orientation policy. | Correct basic responsive prerequisite. Keep; safe areas/browser chrome still need physical-device checks. |
| Same application on every device | apps/player/src/App.tsx:62 passes the same state/actions to AppShell; apps/player/src/AppShell.tsx:199 calls itself desktop-first. No MobileShell, mobile entrypoint, device/UA routing or phone-only game mode was found. | Replace the phone composition freely within the approved rules boundary; preserve the desktop shell. |
| Phone shell, at <=760 CSS px | apps/player/src/styles/global.css:6725 allows document scrolling, sets a 320px body minimum, stacks HUD and center/left/right panels, makes the map 330–500px tall, and lays out Build/Management triggers side by side. Patient lists lose their inner height limits. | Source-confirmed. Historical narrow-layout evidence exists, but this is a long stacked desktop page, not a designed phone navigation system. Good candidate to replace wholesale for the mobile shell. |
| Chart sheet | apps/player/src/ui/ChartPanel.tsx:994 portals a chart to document.body. apps/player/src/ui/chartSheet.css:876 makes it a borderless full-viewport sheet, hides number/keyboard hints, enlarges close/flag/reference actions, and stacks answer content. At <=720px its story/decision regions become one column (apps/player/src/ui/chartSheet.css:855); answers also use a 580px container breakpoint (apps/player/src/ui/chartSheet.css:384). | Useful component/reading behavior to retain or adapt. Current physical-phone usability unverified. Do not carry desktop DOM anchoring into a new shell without adapting it. |
| Under-chart phone UI | apps/player/src/styles/global.css:6967 hides HUD, both rails and footer while .game-shell.has-open-chart is present. apps/player/src/AppShell.tsx:678 applies that class for a patient chart, not an employee discussion. | The clinic still runs, but phone Pause/Speed/Help are hidden until the chart closes. Treat as a navigation/control problem to redesign, not permission to change the clock rules. |
| Build/catalog adaptation | apps/player/src/styles/global.css:5041, :5961, :5975 and :6934 wrap toolbars and reduce catalogs to single-column phone layouts. apps/player/src/ui/RoomActionMenu.tsx:130 docks its room menu when the map container is narrower than 520px. | Some useful responsive work. It does not solve finger placement, selection-vs-pan or tiny door hit areas. Mobile presentation can be replaced. |
| Tutorial coach | apps/player/src/ui/TutorialCoach.tsx:111 reads visualViewport; :600 observes DOM changes; :606 listens to resize/scroll; :608 listens to visualViewport changes; :614 periodically refreshes target placement. apps/player/src/ui/tutorialPositioning.ts:78 docks when a target cannot support an anchored coach. | Reusable positioning logic, but selectors and scroll/navigation assumptions are desktop-shell dependent. Preserve tutorial progression; remap anchors to visible phone screens. |
| HUD / money | apps/player/src/styles/global.css:6735 stacks HUD chips; :6751 makes XP full-width. apps/player/src/ui/ResourceBar.tsx:127 uses native details/summary for the cash explanation; apps/player/src/ui/financePresentation.css:126 changes narrow tooltip placement. | Cash information has a real tap-accessible route. Can reuse data/details content; phone HUD layout can be scrapped. |
| Message actions | apps/player/src/styles/global.css:3601 gives compact message actions a 44px minimum at <=760px; responsive bylines/wrapping preserve full labels. | Useful accessible behavior. Other newer clinic-fix/map-pin targets are smaller; see section 3. |
| Dialogs and opening flow | apps/player/src/ui/HelpDialog.css:9 stacks topic buttons below 560px. apps/player/src/ui/OpeningSequence.css:352 stacks opening choices/forms at 42rem. apps/player/src/styles/global.css:7766 adapts the review dialog. | Keep content and semantics; validate keyboard/browser-toolbar behavior. Campaign/sale/invalid-layout dialogs use custom portals rather than native modal focus handling. |
| Desktop split preference | apps/player/src/ui/WorkspaceSplitter.tsx:29 handles pointer capture; :40 provides arrow keys. apps/player/src/styles/global.css:7684 enables it only at >=761px. apps/player/src/ui/workspaceSplitPreference.ts:1 stores the map/desk share. | Deliberately absent on phones. Do not recreate a cramped map/desk divider merely to reuse this desktop preference. |
| Zoom overlay | apps/player/src/AppShell.tsx:771 renders +/- controls over the map. apps/player/src/styles/global.css:8399 adjusts their phone position only. | Essential existing alternative to mouse wheel; targets remain 34x32px minimum (apps/player/src/styles/global.css:8368). Retain a zoom route, redesign target size/placement for phone. |
| Reduced motion | apps/player/src/styles/global.css:1743, :6976, :8945, :9133; apps/player/src/ui/chartSheet.css:910; apps/player/src/ui/OpeningSequence.css:373 disable selected movement/transitions. apps/player/src/ui/EventMessageBoard.tsx:289 also checks the preference before scroll animation. | Reuse rather than discard. This is presentation accessibility, not a different simulation speed. |
| PWA / install / offline | No active web manifest, rel=manifest, service-worker registration, Workbox setup or PWA plugin was found. apps/player/index.html:1 and apps/player/vite.config.ts:1 contain the active document/build setup. Artwork manifest.json files and launcher health JSON are unrelated. | Nothing implemented to scrap. Install/offline support would be a distinct decision, not a background mobile system. |

No active player safe-area-inset rules, pointer:coarse/hover capability queries, portrait/landscape media rules, mobile-specific rule values, native app package, or mobile-only UI component were found. Tablet widths simply follow the width cascade: a portrait tablet wider than 760px receives the compact desktop layout; a landscape phone can also cross that threshold.

The full media-query index is in Appendix A. Other responsive review tools and all matching documents are indexed in Appendices B–D.

### 1.2 Touch, pointer and gesture behavior

- apps/player/src/facility/FacilityCanvas.tsx:65 sets touchAction: none. A swipe beginning on the map belongs to the map, rather than ordinary page scrolling. Scrolling elsewhere is allowed by the phone document styles.
- apps/player/src/facility/FacilityScene.ts:834 registers Phaser pointermove/pointerdown/pointerup and wheel handlers, not separate phone gestures. Phaser's installed defaults enable touch on capable devices, capture touch events and allocate **one touch pointer** (node_modules/phaser/src/core/Config.js:266, :276, :281). The player supplies no input.activePointers/addPointer or pinch-distance handler.
- Normal-mode dragging uses a **6px movement threshold** and updates pan in screen pixels (apps/player/src/facility/FacilityScene.ts:7809). A non-drag release inspects a character, chooses a chair, or requests founder movement (apps/player/src/facility/FacilityScene.ts:7911).
- A selected new/moved room is evaluated and submitted immediately on pointer-down (apps/player/src/facility/FacilityScene.ts:7974). Hover/dragging first supplies the ghost preview on mouse; a finger does not receive that advance preview. There is no separate place-confirm step.
- Hallway mode paints each valid traversed cell during a drag (apps/player/src/facility/FacilityScene.ts:8108); room and door tools also consume pointer-down. Starting a build-mode drag over a room selects it and returns instead of starting pan (apps/player/src/facility/FacilityScene.ts:8026).
- Wheel changes zoom by 0.1; the +/- overlay sends the same camera changes (apps/player/src/facility/FacilityScene.ts:8187; apps/player/src/AppShell.tsx:771). No pinch, two-finger pan, long-press or double-tap gesture implementation was found.
- Map actions accept only primary-button pointer-down (apps/player/src/facility/FacilityScene.ts:7960). No gameplay right-click/contextmenu handler was found. Right-click is not a requirement to reproduce.
- Hover text gives door/room/action/activity/walk hints (apps/player/src/facility/FacilityScene.ts:7722). Chart ETA detail is also a title tooltip (apps/player/src/ui/ChartPanel.tsx:534), with a screen-reader-only copy (:538), not an ordinary visible tap expansion.
- DOM coach/arrow surfaces stop pointerdown, pointerup and click propagation so they do not edit the map beneath (apps/player/src/ui/TutorialCoach.tsx:29, :670, :722, :738). WorkspaceSplitter is the other explicit DOM pointer gesture.
- Character inspection has a five-second display, with a second click on a still-inspected employee opening Praise (apps/player/src/facility/FacilityScene.ts:6642; apps/player/src/facility/characterInspect.ts:4). Touch can use the same sequence in principle; it has no independently designed phone inspector.

**What works today:** responsive DOM controls, tap-capable native buttons/details, the resized canvas/pointer coordinate boundary, and generic single-pointer map interaction are present. **What is not established:** physical Android/iOS gesture correctness, reliable accidental-tap prevention, comfortable construction, safe-area/keyboard behavior, or sustained phone performance. Existing test records are narrower than those claims.

## 2. Architecture seams for another shell

### 2.1 UI composition and ownership

| Layer | Current composition | Seam / constraint |
| --- | --- | --- |
| Bootstrap | apps/player/src/main.tsx:14 mounts StrictMode/App, imports fonts, tokens and global CSS (:3). apps/player/src/App.tsx:353 wraps everything in AuthGate. | Keep the same auth/bootstrap; loading all global desktop CSS into a new shell would still expose it to the cascade. |
| Campaign/opening owner | apps/player/src/App.tsx:193 loads the profile; :222 selects/saves a campaign; :238 renders OpeningSequence; :334 keys ActivePrototypeGame by campaign ID. | Reuse campaign startup/selection. A layout change should not remount the session or create a new campaign. |
| Active session | apps/player/src/App.tsx:35 invokes usePrototypeSession once. The hook owns state, persistence, timer, modes and command actions. | Keep it above shell selection. Do not mount both shells with independent hooks/timers. |
| Projection | apps/player/src/App.tsx:36 memoizes createPrototypePlayerView from state, open chart, summary/build selection, camera and review flags. | Reuse the same projection/IDs/choice order/disabled reasons. Camera changes currently also recompute the full projection. |
| Desktop shell | apps/player/src/App.tsx:62 passes views plus named callbacks; apps/player/src/AppShell.tsx:81 defines a private props interface. apps/player/src/AppShell.tsx:705 composes left rail, facility/desk center, and right rail. | A shared exported contract/presentation adapter would let another shell consume the same data/actions. No current common mobile-shell interface exists. |
| Local presentation state | apps/player/src/AppShell.tsx:305 stores split/share, dialog visibility, temporary locator/highlights, praise menu, door-tool mode and selected-room screen anchor. | Extract only state a mobile screen needs; keep rule-bearing transitions in the session. Door-tool/placement coordination currently spans shell, panel, scene and session. |
| React facility bridge | apps/player/src/AppShell.tsx:818 gives FacilityCanvas its FacilityViewModel and narrow callbacks. apps/player/src/facility/FacilityCanvas.tsx:104 updates the bridge without replacing the Phaser game. | Mobile can reuse the scene with another input/presentation adapter. It should not receive authority to mutate GameState directly. |
| Clinical desk | apps/player/src/AppShell.tsx:928 alternates build/management controls, employee discussion, patient chart and empty desk. apps/player/src/ui/ChartPanel.tsx:81 anchors to .desk-workspace/.game-grid for desktop, and portals to body (:1134). | “Clinical Desk” is a shell region, not a standalone domain subsystem. Mobile navigation and chart placement need a host-aware adapter. |
| Alert navigation | apps/player/src/AppShell.tsx:524 resolves actions into chart opening, Build/Management entry, DOM queries, scrollIntoView and focus. | Command-bearing actions can be reused. DOM navigation/highlights must point to phone screens, not hidden desktop rows. |
| Tutorial | apps/player/src/session/usePrototypeSession.ts:1792 creates TutorialStepView; apps/player/src/AppShell.tsx:1046 renders TutorialCoach. | Reuse progression/action IDs. Supply equivalent visible anchors or a phone target resolver; avoid changing completion/time rules to fit geometry. |

A viable boundary is **one session → one shared player view/action contract → desktop shell or mobile shell**. This is an architectural opportunity for the manager to decide, not an implementation made here. Preserve desktop AppShell composition and its existing input behavior while introducing scoped mobile presentation. A second copy of the game reducer, scheduling, financial calculations or clinical content is unnecessary.

### 2.2 UI-agnostic session modules

The following .ts modules project data or decisions without React/DOM/browser-layout access. Some import types from ui/types, or shared facility/art definitions; that is packaging coupling, not a requirement for desktop markup.

| Modules / anchors | Reusable output |
| --- | --- |
| apps/player/src/session/viewModels.ts:135, :788, :899, :1437 | Complete PrototypePlayerView, patient/discussion charts, resource/progression/build/staff/service/facility views, frozen question choices, reward/ETA/provenance presentation. |
| apps/player/src/session/alertsEventsViewModel.ts:34, :123, :219; apps/player/src/session/alertViewModels.ts:1510 | Headline/money context, Needs you items and actionable feed rows. |
| apps/player/src/session/clinicAlertActions.ts:66, :174 | Action eligibility and mapping into the same domain commands; navigation-only cases remain shell responsibilities. |
| apps/player/src/session/managementViewModels.ts:41, :126, :188; apps/player/src/session/employeeTrainingViewModels.ts:47 | Role/training/setup and actual settled-income/cost finance views. No phone economy recomputation is needed. |
| apps/player/src/session/buildModePresentation.ts:70, :99, :141, :179 | Room groups/labels, lettered instances, upgrade benefits and undo labels. |
| apps/player/src/session/characterActivityPresentation.ts:294; apps/player/src/session/founderActivityPresentation.ts:40; apps/player/src/session/pediatricFamilyPresentation.ts:4 | Character/activity descriptions and family presentation from the existing state. |
| apps/player/src/session/patientAvailabilityViewModel.ts:21 | Empty/waiting-folder guidance. |
| apps/player/src/session/clinicalText.ts:35, :94, :160 | Existing frozen-stem splitting/normalization. Reuse without rewriting clinical meaning. |
| apps/player/src/session/diagnosticTimingPresentation.ts:35, :72, :140; apps/player/src/session/facilityDuration.ts:2 | Existing choice/result wait presentation and duration formatting. |
| apps/player/src/session/chartCloseBehavior.ts:16 | Guarded feedback acknowledgment before chart close. |
| apps/player/src/session/clinicFeedPresentation.ts:20, :44, :59; apps/player/src/session/tutorialTipsIntegration.ts:5 | Feed speakers, supersession/problem copy and tutorial filtering. |
| apps/player/src/session/tutorialViewModels.ts:302; apps/player/src/session/tutorialGuidance.ts:43; apps/player/src/session/tutorialTiming.ts:11, :22; apps/player/src/session/dailyRoutineTutorialPause.ts:16 | Tutorial step/action/guidance state and existing timing/pause decisions. |
| apps/player/src/session/clinicSaveNotices.ts:2 | Clear recovered save notices from the presentation feed. |
| apps/player/src/session/questionReviewFlags.ts:163, :208, :284, :304, :371 | Flag identity/records, status/parsing and export creation. Its load/save functions (:333, :348) are browser adapters. |

File names in this table are under **apps/player/src/session/**.

**Not pure, but shareable browser/session adapters:** usePrototypeSession.ts (React plus clock/commands), prototypeStorage.ts (localStorage), prototypeAutosave.ts (idle scheduling), facilityCameraPreference.ts (browser lifecycle/storage), questionReviewFlags.ts load/save, and LocalCampaignRepository (IndexedDB). Do not confuse their reusable APIs with a separate rules engine.

### 2.3 Phaser mount, camera and input

apps/player/src/facility/FacilityCanvas.tsx:121 creates one FacilityScene/Phaser.Game for the mounted host. It uses **Phaser.CANVAS**, audio disabled, pixel-art/round-pixel rendering and Scale.NONE (:137). A ResizeObserver coalesces host changes into requestAnimationFrame and calls game.scale.resize (:205), maintaining matching bitmap and pointer dimensions. POST_STEP reconciles camera bounds for viewport/model changes (:166). Cleanup destroys the game and its canvas (:242).

The “camera” is a plain {zoom, panX, panY} view preference, not Phaser's normal camera zoom/scroll authority. apps/player/src/facility/FacilityScene.ts:1306 calculates tile size/origin from the map/grid/exterior and viewport; zoom <=1 interpolates between full-site and working-area framing, and >1 magnifies the working area. The working window constants are 14 columns by 6 rows, with zoom 0.1–2.5 (apps/player/src/facility/FacilityScene.ts:390). Movement/zoom updates that model and redraws the world (:8201). Reuse facilityCameraBounds.ts and defaultCamera.ts when adapting viewport framing.

Camera preference is already separate from serialized GameState: apps/player/src/session/facilityCameraPreference.ts:4 has its own per-campaign storage key; :5 debounces writes by 250ms; apps/player/src/session/usePrototypeSession.ts:316 restores it and :321 changes it. A phone viewport may clamp an inherited camera differently. Decide whether phone framing should have a separate presentation preference without changing campaign state.

Hover-dependent behavior is confined to presentation hints and inspection affordances; click/tap actions ultimately dispatch callbacks. However, input intent is embedded in the scene's pointer handlers. A mobile shell alone cannot solve pinch, placement preview, selection-vs-pan, or tiny world hit targets without an explicit mobile scene-input lane.

### 2.4 Commands, clock and invariants

apps/player/src/session/usePrototypeSession.ts:536 executes commands with a unique session/sequence operationId through gameReducer and the same PROTOTYPE_DOMAIN_CONTEXT. It updates refs/React state, publishes receipts/events, and stages/persists the campaign. packages/game-domain/src/context.ts:52 binds the prototype balance and clinical release. Callbacks supplied to the shell wrap actions such as OPEN_CHART, SUBMIT_ANSWER, ACKNOWLEDGE/CLOSE, placement/door edits, room upgrade/sale/move, hiring/training/salary/fire, litter/water chores, founder movement/seating, Praise, emergency cash, advertising, service appointments, lab queue, pause/speed and LEVEL_UP.

Important paths:

- Answer submission uses the current frozen decision node and **choice ID**, not a desktop option index (apps/player/src/session/usePrototypeSession.ts:934). Preserve the displayed runtime randomization; a mobile button must send that same ID.
- Closing/filing a chart uses the existing guarded acknowledgment and close path (apps/player/src/session/usePrototypeSession.ts:877, :930). The visible primary button also enacts the current decision/terminal action. A mobile screen should not shortcut those transitions.
- Build commands retain undo snapshots (apps/player/src/session/usePrototypeSession.ts:629); ending Build checks facility access (:1235). Selling uses the current confirmation token (:1280). Mobile UI must not bypass these guards.
- runClinicAlertAction validates the current action before converting it to a command, and returns an actionable failure reason (apps/player/src/session/usePrototypeSession.ts:1678). Some actions just navigate.
- Build and Management remember prior pause state, pause on entry, and restore only an originally running clinic on exit (apps/player/src/session/usePrototypeSession.ts:785, :1190). Help/review dialogs apply their existing pause handling. Opening a patient chart **does not auto-pause**.
- apps/player/src/session/usePrototypeSession.ts:761 runs one interval while visible and unpaused, dispatching one ADVANCE_TICK. apps/player/src/session/tutorialTiming.ts:22 uses 1000 / (simulationSpeed × tutorial multiplier): ordinary 1x/2x/4x are 1000/500/250ms per facility minute; the existing guided second-visit wait has a 2x multiplier under its specific conditions (:11). Keep this behavior shared.
- reduceAdvanceTick clones state and advances facilityTick by one, with routing/services/upkeep and other rules in the domain (packages/game-domain/src/reducer.ts:8420). Phaser's real-time visual interpolation is separate; apps/player/src/App.tsx:75 supplies matching animation timing.
- **Learning time is separate from facility time.** Live answer reviews supply Date.now() (apps/player/src/session/usePrototypeSession.ts:952); FSRS cards/review logs serialize real epoch dates, including dueAtMs (packages/game-domain/src/fsrs-adapter.ts:50). Preserve those real timestamps and campaign learning histories when changing phone screens; facility speed/pause is not another learning scheduler.
- Visibility loss pauses the game; return requires Resume. pagehide synchronously flushes the latest staged profile (apps/player/src/session/usePrototypeSession.ts:714). There is no session wall-time catch-up/offline simulation. See docs/adr/0007-pause-when-hidden.md:24.

### 2.5 Persistence, campaigns and auth

The **live application still uses browser-local whole-profile localStorage**, not the new IndexedDB repository:

- apps/player/src/session/prototypeStorage.ts:12 defines the legacy save key and :13 the current profile key; schema is v2 (:14). loadPrototypeProfile (:536) parses/migrates compatible saved profiles, otherwise initializes a fresh local profile. Deserialization checks frozen GameState (:369).
- savePrototypeProfile (:601) serializes every campaign, including archived ones, JSON-stringifies the profile, and calls localStorage.setItem (:645). It reports failure, but does not read back a durable snapshot.
- Non-tick commands save immediately; ticks stage current state and save every 15 ticks through requestIdleCallback (2000ms timeout) or setTimeout fallback (apps/player/src/session/prototypeAutosave.ts:9, :36, :73). Pagehide flushes; Save & Close saves and pauses (apps/player/src/session/usePrototypeSession.ts:1643).
- apps/player/src/App.tsx:222 selects and saves a campaign before game entry. apps/player/src/App.tsx:334 remounts for a changed active campaign; apps/player/src/session/usePrototypeSession.ts:1732 also handles in-session switching, clears presentation/build history and restores the selected campaign/camera.
- New campaign, restart/archive and restore are implemented independently of layout (apps/player/src/session/prototypeStorage.ts:192, :237, :312, :336). Learning histories remain campaign-specific.
- LocalCampaignRepository exists with IndexedDB revision/snapshot/checksum/readback machinery (apps/player/src/session/localCampaignRepository.ts:566, :589, :643), and is exported (apps/player/src/session/index.ts:7), but no active App/usePrototypeSession call site consumes it. Its checksum uses crypto.subtle (apps/player/src/session/localCampaignRepository.ts:583). Do not promise the persistence migration as already complete.
- Camera, workspace split and question flags are separate local preferences/records (apps/player/src/session/facilityCameraPreference.ts:4; apps/player/src/ui/workspaceSplitPreference.ts:1; apps/player/src/session/questionReviewFlags.ts:79).
- AuthGate supports a configured Supabase session, sign-in/register/recovery/reset, or the explicit local prototype entry (apps/player/src/auth/AuthGate.tsx:32, :109, :317; apps/player/src/auth/prototypeAuth.ts:95). Supabase client persists its auth session (apps/player/src/auth/supabaseAuth.ts:22). **Authentication does not synchronize campaigns:** no live cloud-campaign load/save path was found.

Paths above without a leading directory are under apps/player/src/session/, except those explicitly prefixed ui/ or auth/.

## 3. Complete desktop surface and interaction inventory

All surfaces below belong in the mobile product inventory, even where navigation changes. “Wide” means the present arrangement/density expects space; it does not mean the underlying operation needs desktop hardware.

### 3.1 HUD, rails, activity and clinic actions

| Surface / source | Player-facing content and actions | Input/layout dependency |
| --- | --- | --- |
| Title / rotating clinic headline — apps/player/src/AppShell.tsx:679; apps/player/src/ui/ClinicHeadline.tsx:15 | Game title and contextual headline/live state. | Text/wrap/vertical space; no required hover/right-click/key. Title suppressed with a phone chart. |
| HUD — apps/player/src/ui/ResourceBar.tsx:98 | Facility level and XP/progress, money and net/hour explanation, patient satisfaction, facility clock, pause/mode status. | Dense horizontal desktop chips. Cash details work by native tap/click/focus; compact totals need readable phone disclosure. |
| Clock controls — apps/player/src/ui/ResourceBar.tsx:187, :211, :233 | Pause, Resume, 1x/2x/4x, Save & Close; disabled states reflect Build/Management/reference pause locks. | Native buttons; no global Space-to-pause shortcut. Phone hides these beneath a patient chart today. |
| Goals — apps/player/src/ui/GoalsPanel.tsx:44, :50, :63, :95 | Current requirements/progress, expandable procedural setup checklists with Build/Hire actions, optional secondary goals, Advance, prototype completion status. | Optional secondary-goal tooltip is hover/focus dependent (:82). Main actions are buttons; lists can become long. |
| Alerts & Events — apps/player/src/ui/EventMessageBoard.tsx:83, :311, :323, :384 | Needs you live problems/deadlines/fix buttons, clinic feed, contextual actions, scroll history, Jump to newest, highlighted target/failure messages. | Scroll/history anchoring assumes a panel; feed retains >=30 rows despite shell maxVisible=7 (:128). Narrow actions wrap, but fix targets may be small. No mandatory hover or keyboard. |
| Map alert pins — apps/player/src/facility/ClinicMapPins.tsx:3; apps/player/src/AppShell.tsx:826 | Up to three actionable pins, with text label/ARIA labels and click handling. | Screen-space overlay must stay aligned on resize/pan. CSS 28px targets (apps/player/src/styles/global.css:9120); finger accuracy issue. |
| Waiting / Existing Patients — apps/player/src/ui/PatientLists.tsx:16, :84 | Avatar/name/satisfaction/status tabs, urgent decision marker; opens and locates the specific patient. Employee discussions also appear in these folders (:32). | Single-line dense folder tabs on desktop; tap works. Phone lets entire list expand with document scroll; no list virtualization. |
| Resolved — apps/player/src/ui/PatientLists.tsx:45, :184, :202 | Toggle resolved drawer; newest resolved first; reopen filed patient charts; resolved employee rows shown disabled. | Disclosure button and potentially long history. Collapsed content is hidden, not a paged/virtualized dataset. |
| Emergency cash — apps/player/src/ui/EmergencyGlp1Panel.tsx:20 | Request the available emergency consultation/cash action, see cooldown/progress/disabled state. | Native button; compact left-rail presentation, no keyboard/hover requirement. Keep the same command and cooldown. |
| Advertising — apps/player/src/ui/AdvertisingPanel.tsx:31, :45 | Decrease/increase current advertising level; price/effect/availability and disabled reasons. | Small +/- buttons in a dense rail. No drag/hover requirement. |
| Prototype tools — apps/player/src/ui/DevelopmentPanel.tsx:30, :38, :45, :52, :75, :89 | Expand tools; Add Money; Fast Forward; Restart; tutorial guidance checkbox; campaign/FSRS/review counters; expandable FSRS-card list. | DEV plus query gating in apps/player/src/AppShell.tsx:348 (webdriver test default also enables); long inspector list. Not a phone-only mode. Synchronous fast-forward is a performance risk. |
| Footer — apps/player/src/AppShell.tsx:1055 | Paused/running status, workload/content notice, Help, optional review queue, Campaigns and Restart. | Dense horizontal desktop footer; phone wraps. Important actions currently disappear under patient chart. |
| Save error recovery — apps/player/src/AppShell.tsx:649; apps/player/src/ui/SaveCloseDialog.tsx:42 | Failure notice/Needs you retry; Save & Close result; Return to paused clinic; explicit staged Clear Local Campaigns recovery. | Native dialog with buttons, long warning text on small screen. Never suppress failure because phone navigation changes. |

File names here and in the following UI tables are under apps/player/src/ui/ unless another path is stated.

### 3.2 Clinical Desk and employee conversation flow

| Surface / source | Player-facing actions/content | Input/layout dependency |
| --- | --- | --- |
| Empty desk / pending availability — apps/player/src/AppShell.tsx:977 | Waiting/quiet/pending guidance, Build and Management entry when eligible. | Desktop workspace placement; phone minimum-height region adds scroll even before a chart. |
| Open chart header — apps/player/src/ui/ChartPanel.tsx:1002 | Specific patient portrait/name, age/sex, complaint, satisfaction/action state, Close. | Desktop header density; close action becomes 44px on phone. Full sheet portal overlays other screens. |
| Story / vitals / updates — apps/player/src/ui/ChartPanel.tsx:1062, :1066 | Presentation, vital strip, latest care/result update, question exhibits/tables. | Desktop two-column reading; phone stacks. Exhibit tables deliberately have a horizontally scrollable focusable region (:255). Preserve all information, not just the answer list. |
| Current decision — apps/player/src/ui/ChartPanel.tsx:502, :725 | Complete task, randomized choices, live wait labels including testing distractors, current question flag. | Numbered answer hotkeys are optional. Choices are native buttons; ETA breakdown is title/hover plus screen-reader text (:534), a missing ordinary tap disclosure. |
| Submitted-answer feedback — apps/player/src/ui/ChartPanel.tsx:593, :827 | Correct/corrected answer feedback, Why this choice, Compare all alternatives; Enact Plan/Enact Corrected Plan/Continue or other primary action. | Native details/disclosures; auto-scroll toward feedback (:855). Must retain command sequence and avoid answering from hidden controls. |
| Pending care — apps/player/src/ui/ChartPanel.tsx:311 | Care/result phase, estimates, patient location/status, return/close while care proceeds; reopen from Existing Patients. | Clock keeps running. Phone needs convenient pause/navigation with unchanged rules. |
| Completed/resolved chart — apps/player/src/ui/ChartPanel.tsx:353, :827 | Reward/XP/satisfaction/outcome summary, information/earlier decisions, Resolve Completed Chart or Close Resolved Chart. | Full summary must remain readable; primary action is guarded, not an arbitrary dismiss. |
| Reference content — apps/player/src/ui/ChartPanel.tsx:438, :476 | More Disease Information, earlier decisions, Sources & Clinical Review, version/review status, nested supported-claim disclosures. | Long scroll, optional details; source links open new tab safely (:464). Returning from another tab pauses by visibility rule. No network retrieval or AI call in gameplay. |
| Flag question — apps/player/src/ui/ChartPanel.tsx:743; apps/player/src/session/usePrototypeSession.ts:958 | Flag the current frozen question/provenance for owner review. | Icon button; 44px phone rule. Same version/ID must be retained. |
| Review queue — apps/player/src/ui/QuestionReviewQueueDialog.tsx:58, :190, :210 | Query-enabled list of flags, provenance details, mark reviewed/reopen, Export JSON, Return to clinic. | Native dialog pauses/restarts prior running state; download behavior on mobile is unverified. query question-review=1 is not DEV-only (apps/player/src/AppShell.tsx:359). |
| Employee conversation — apps/player/src/ui/EmployeeDiscussionPanel.tsx:16, :55 | Employee discussion mapped to the same ChartPanel choices/feedback/close pattern. | Uses the new chart sheet, not a separate surviving “paper-chart” component. Shell .has-open-chart condition excludes discussions; overlay visibility differences need a phone check. |
| Chart positioning — apps/player/src/ui/ChartPanel.tsx:111 | Desktop desk-anchored full-sheet placement; resize and MutationObserver update geometry. | Explicit document.querySelector and innerWidth<=760 coupling. Reuse needs a mobile host/navigation adapter, not only new CSS. |

### 3.3 Management mode

apps/player/src/ui/ManagementPanel.tsx:33 defines **Employees, Services, Money** tabs; :84 labels the clinic paused and offers Done. The selected tab is local presentation state. Opening Management closes conflicting chart/discussion state and applies the session's pause rules.

| Surface / source | Full interaction inventory | Input/layout dependency |
| --- | --- | --- |
| Employees overview — apps/player/src/ui/StaffPanel.tsx:106, :119, :147 | Payroll/morale/training summary; Expand all/Collapse all role groups; expandable role headers, vacancy/slot details and Hire actions. | Dense grids and collapsible cards; native buttons, no hover requirement. |
| Employee card — apps/player/src/ui/StaffPanel.tsx:292, :302, :332, :341 | Morale/activity/role, salary decrease/increase, Train quote (cost/duration/current-next level/team benefit), confirm/cancel; Fire preview with queue refund/discussion impact and confirm/cancel. | Salary buttons explicitly 24x24px (apps/player/src/styles/global.css:3918); mini/Train/Fire buttons also compact. Escape closes the popover (:84). There is no need to preserve a hover-only interaction. |
| Services toggles/setup — apps/player/src/ui/ServiceIncomePanel.tsx:89, :104, :124 | Income-line status/fee/contribution/arrival/setup; Build/Hire missing prerequisites; Scheduled appointments On/Off and contextual Turn On. | Collapsible sections/native actions; dense rows and scroll. Same validated setup action pathways must be used. |
| Lab/action queue — apps/player/src/ui/ServiceIncomePanel.tsx:64 | Queue Lab, disabled reason, service visitors/jobs and operational status. | Button; no separate phone command semantics. |
| Services information — apps/player/src/ui/ServiceIncomePanel.tsx:151, :169, :175, :198, :219, :270 | Current earning lines, needs-attention, higher-level preview, active queues/operations, quality/maintenance/break status; section disclosure state. | Long management panel; reading/navigation redesign needed. |
| Money overview — apps/player/src/ui/MoneyPanel.tsx:38, :56, :70, :90 | Actual past-hour income, current hourly costs/net, income sources, stock relief/runway, since-opening earned/profit/cost totals and explanatory copy. | Reuse management finance view; desktop multi-column tiles, no hover requirement. |
| Recent payments — apps/player/src/ui/MoneyPanel.tsx:113, :117 | Disclosure plus six-column time/service/from/billed/stock/net table. | Wide tabular layout with scroll wrapper; phone should have a readable equivalent, not silently omit columns. |
| Management navigation/highlight — apps/player/src/AppShell.tsx:544 | Alerts/tutorials open the relevant role/service and focus/scroll highlighted rows. | DOM selectors/hidden-tab assumptions require phone-aware navigation. |

### 3.4 Build, map and inspection

| Surface / source | Full interaction inventory | Input/layout dependency |
| --- | --- | --- |
| Map navigation — apps/player/src/facility/FacilityScene.ts:7797, :8187; apps/player/src/AppShell.tsx:771 | Pan by drag; zoom by wheel or +/-; viewport-bound camera preference. | Mouse drag equivalent for a single touch; no pinch. No zoom reset/fit button currently. touchAction:none prevents page scrolling from map. |
| Build entry/exit — apps/player/src/ui/BuildPanel.tsx:215, :235, :475, :500 | Enter Build Mode, available money, access-problem chip, Undo with action/refund label, Done / Save. Blocked exit opens access-issues dialog with Continue Renovating (:626). | Native controls, responsive toolbar; custom modal. Clinic remains paused until valid exit. |
| New Rooms — apps/player/src/ui/BuildPanel.tsx:269, :298, :313, :337 | Categorized room cards with purpose/footprint/cost/upkeep/count and disabled reason; next-level locked rooms; collapsed rooms built at maximum. Click card to arm/cancel placement. | Wide/multi-column desktop catalog; one column on phone. Disabled reason also appears as text, so title isn't the only disclosure. |
| My Rooms — apps/player/src/ui/BuildPanel.tsx:345, :398, :436, :586 | New/My tabs; stars totals; Only affordable upgrades checkbox; collapsible categories; select named room; one-click upgrade; current/next benefit/MAX/access state. | Dense list, small upgrade/filter/group controls; named-list selection is a useful alternative to tiny map targets. |
| New-room placement — apps/player/src/facility/FacilityScene.ts:7797, :7974; apps/player/src/ui/BuildPanel.tsx:555 | Ghost/validity preview, next pointer-down places room; Rotate and Cancel buttons, R/Esc hints. Hallway excluded from ordinary orientation UI. | Mouse hover preview; touch gets placement on initial down. No drag-to-confirm or explicit Confirm button. Rotation is limited to approved orientations. |
| Hallways — apps/player/src/ui/BuildPanel.tsx:524; apps/player/src/facility/FacilityScene.ts:8108 | Build Hallway tool, click or paint across connected cells, Finish/Cancel; per-cell validity/affordability guard. | Drag gesture competes with pan; each square invokes a command/save/undo snapshot. |
| Doors — apps/player/src/ui/BuildPanel.tsx:242, :514; apps/player/src/facility/FacilityScene.ts:7989 | Doors tool toggles; click eligible empty wall to add, click existing opening to remove; Cancel/Esc puts tool down. New room automatically arms Doors (apps/player/src/AppShell.tsx:508). | Narrow zoom-dependent wall/opening hit regions. apps/player/src/facility/doorInteractionGeometry.ts:45 uses min 6px opening and 5–12px boundary tolerance, not a screen-space 44px target. |
| Existing room selection — apps/player/src/facility/FacilityScene.ts:8026; apps/player/src/ui/RoomActionMenu.tsx:218 | Click built room while in Build to select/open map-anchored menu; narrow map docks menu. | Primary click/down, no right-click. Drag over room selects rather than pans. |
| Room upgrades — apps/player/src/ui/RoomActionMenu.tsx:303, :325, :346 | Level stars, exact benefit/upkeep/current-next values, cost/blocked reason, one-click upgrade, star/spend animation; Undo can reverse. | Native actions; menu closes with compact X/ESC. Animations honor reduced motion. |
| Move room — apps/player/src/ui/RoomActionMenu.tsx:383; apps/player/src/session/usePrototypeSession.ts:1314 | Move button arms existing-room placement; next valid placement submits move. | Not direct object dragging. Finger needs a clear preview/confirm/cancel design without changing validity rules. |
| Room sale — apps/player/src/ui/RoomActionMenu.tsx:396, :408 | Sell/resale, preview affected staff and interrupted care, Cancel/Confirm Sale using token. Permanent/non-sellable rooms omit action. | Custom modal/long consequence list; ordinary buttons, no required keyboard. |
| Room inspection outside Build — apps/player/src/facility/FacilityScene.ts:7722 | Hover room hint; normal map taps do not open the Build room menu. | Hover-dependent discoverability; a tappable phone inspection route would be presentation work. |
| Character / chair inspection — apps/player/src/facility/FacilityScene.ts:6622, :6642, :6697 | First character click shows name/activity; second employee click within the live info box opens Praise/Cancel (apps/player/src/AppShell.tsx:882). Seat click sits founder if allowed, or shows occupancy info. | Five-second floating label, 10px text, no viewport-edge clamp in inspector. Actor hit box is narrowed by 20% on each horizontal side (apps/player/src/facility/FacilityScene.ts:6631); zoom reduces it further. |
| Founder/environment actions — apps/player/src/facility/FacilityScene.ts:7911, :8033 | Click reachable destination to move; collect litter, refill cooler, sit at Front Desk/ordinary chair; current-state guards. | Some actions execute on down and prevent pan; hover says what will happen. Small artwork target/overlap issues. Chores also have applicable Needs you actions. |
| Workspace split — apps/player/src/ui/WorkspaceSplitter.tsx:29, :40 | Drag map/desk divider or keyboard arrows; remembers preferred proportion. | Desktop-only separator; phone does not expose it. Do not make it a mandatory phone control. |
| DEV character QA — apps/player/src/ui/CharacterQaGallery.tsx:20; apps/player/src/AppShell.tsx:353 | Query-enabled runtime character gallery/identity diagnostics, separate from ordinary gameplay. | Responsive gallery grid (apps/player/src/styles/global.css:2329); do not mistake art-proof phone tests for full mobile play. |

### 3.5 Tutorial, Help, campaigns and account screens

| Surface / source | Actions and lifecycle | Dependency |
| --- | --- | --- |
| Tutorial coach — apps/player/src/ui/TutorialCoach.tsx:744, :789 | Anchored/docked guidance, target beacon/arrows, context-specific action buttons, guidance disable; click-through prevention, announcements, exposure/progression tracking. | DOM anchors, periodic layout polling and scrollIntoView (:527), layered above phone sheet. Need visible-screen target mapping, not new tutorial completion rules. |
| Help — apps/player/src/ui/HelpDialog.tsx:12, :37, :59, :65, :68 | Six topics (patients/charts/time/build/goals/saves), topic/back buttons, Show guidance here, Replay first shift in a separate clinic, Return. Pauses and restores prior running state. | Native dialog focus/Escape; responsive buttons. Current copy describes mouse/keyboard; mobile controls will need matching explanatory copy. |
| Campaign manager — apps/player/src/ui/CampaignManager.tsx:23, :57, :90, :106, :113 | List resumable and archived campaigns, active marker, switch/resume, Cancel, create new campaign/open opening sequence. Archived restoration happens in OpeningSequence. | Custom portal aria-modal; no own pause handler or focus-trap/Escape effect. While simply open it does not pause a running clinic. Long list on phone. |
| Opening sequence — apps/player/src/ui/OpeningSequence.tsx:182, :245, :253, :271, :286, :290 | Resume current/saved campaign; archived disclosure/restore; new clinic name; founder name/preset previous-next/portrait; guidance checkbox; Begin. | Forms invoke phone keyboard; stacked responsive opening CSS, no pinch/drag requirement. |
| Restart — apps/player/src/ui/RestartDialog.tsx:23, :69, :76 | Pause while preview open; Cancel restores prior running state; confirm archives current clinic and starts fresh founder/seed flow. | Custom modal; consequences and button placement need phone verification. |
| Save & Close — apps/player/src/ui/SaveCloseDialog.tsx:42, :47, :95, :131 | Save/pause, success/failure notice, return paused, staged clear-local-campaigns recovery. | Native modal, keep-current-tab failure recovery must remain accessible. |
| Account gate — apps/player/src/auth/AuthGate.tsx:109, :225, :251, :266, :317 | Sign in, invited registration, recovery/reset password, sign out when authenticated; explicit browser-local prototype entry without hosted service. | Native forms and keyboard; allowed redirect origins/base path matter on additional QA hosts. No cross-device-save implementation. |

### 3.6 Keyboard and small-target checklist

All required operations above already have some button/click route; keyboard is not the only way to answer/build.

- **1–9:** current enabled answer choice; with four answers the rendered hint is “Press 1–4 to answer.” **Enter:** current primary chart action. **Esc:** guarded chart close. Modifiers/typing/modal/focused-native-control guards apply (apps/player/src/ui/ChartPanel.tsx:866). Phone CSS hides the hint/number keys, but handlers remain active.
- **R:** rotate eligible new-room placement. **Esc:** cancel placement or put down Doors (apps/player/src/ui/BuildPanel.tsx:175). Both also have visible buttons.
- **Esc:** close room menu/cancel its sale preview (apps/player/src/ui/RoomActionMenu.tsx:201); close training/fire popover (apps/player/src/ui/StaffPanel.tsx:84). Native Help/Save/Review dialogs handle cancel. Custom campaign/invalid-layout/Praise dialogs do not share a universal Escape handler.
- **ArrowUp/ArrowDown:** adjust the desktop splitter by 0.02 (apps/player/src/ui/WorkspaceSplitter.tsx:13, :40).
- No gameplay WASD/pan-arrow shortcut, Space pause, right-click action, mandatory long press or pinch shortcut was found.

Phone-sized chart choices/close/flag/reference and older feed actions have explicit 44px treatment. Important counterexamples in the shared styles: facility zoom **34x32px** (apps/player/src/styles/global.css:8368); salary step **24x24px** (:3918); staff mini controls min **24px** (:3661); Hire min **30px** (:3774); Train min **26px** (:3951); Fire min **24px** (:3977); Management tabs min **32px** (:5198); Management Done min **28px** (:5176); room-menu X min **30px** (:8806); newer clinic-fix buttons min **30px** (:9094); map pins **28x28px** (:9120). These are source minimums, not measured final bounds for every font/content state. Door/character/chair hit areas are world/artwork-derived and can be even smaller at low zoom.

## 4. Performance on phones

### 4.1 Canvas resolution and rendering

The canvas uses the host's floored **CSS-pixel width/height**, both at creation and resize (apps/player/src/facility/FacilityCanvas.tsx:137, :205). There is no player devicePixelRatio multiplier or quality cap. Installed Phaser ScaleManager assigns its canvas dimensions to baseSize on resize (node_modules/phaser/src/scale/ScaleManager.js:861). Thus a high-DPR phone does not automatically get a DPR-sized whole canvas; this saves fill/memory but can reduce sharpness. Some text textures explicitly use resolution:2 (apps/player/src/facility/FacilityScene.ts:727, :6830, :7632, :7672).

The app forces Canvas rather than WebGL. Although initial antialias is off, the scene sets texture filters LINEAR and canvas imageSmoothingQuality high (apps/player/src/facility/FacilityScene.ts:928). Pixel-art assets, DPR and smoothing need actual visual/performance checks; do not assume a pure low-resolution nearest-neighbor renderer.

FacilityScene.update runs character drawing, pin/screen-anchor reporting and earnings popups every frame (:1242). Pause/Build freeze motion deltas, but do not stop those per-frame calls. A chart overlay leaves the scene mounted. Static world redraw is signature/viewport guarded (:1269); apps/player/src/facility/facilityWorldSignature.ts:14 includes rooms/doors/layout/selection/camera and some changing status such as cleanliness. Camera motion forces redraw. No player frame-rate cap, Worker/OffscreenCanvas path, phone render budget or texture eviction policy was found.

### 4.2 Assets and existing build measurements

Measurements are from files present during discovery, not a fresh build. The dirty working sources may be newer than dist. Decimal MB below use 1,000,000 bytes; MiB uses 1,048,576 bytes.

| Measured object | Exact result | Meaning |
| --- | --- | --- |
| apps/player/public | 3,087 files; **205,813,881 bytes** | Entire public distribution, not initial download. Almost all is art. |
| public/art | 3,086 files; **205,813,809 bytes** | Includes retained/legacy atlases and many lazy character files. |
| All public PNGs | 2,956 files; **197,176,751 compressed bytes** | Nominal header-based RGBA sum 1,015,129,156 bytes; this is not a runtime allocation claim. |
| Initial environment/room/decor list | **199 unique images**, **24,570,993 bytes** | Exactly the arrays requested by apps/player/src/facility/FacilityScene.ts:891, without a facility-level filter. 83 PNGs + 116 WebPs. |
| That list's nominal decoded pixels | **368,024,520 RGBA bytes ≈ 350.98 MiB** | Width×height×4 from actual PNG/WebP headers. All dimensions matched descriptors. Browser memory accounting can differ; extra surfaces/cache/characters are excluded. |
| Existing dist/assets/index-OenHDQQQ.js | **8,210,617 bytes**; gzip **1,804,648 bytes** | Single local JS chunk; on-disk timestamp 2026-10-09T09:33:32.607Z. Its precise module contributions were not measured. |
| Existing dist/assets/index-C5tFl1dZ.css | **163,125 bytes**; gzip **30,296 bytes** | Shared CSS is also substantial. |
| Four built font files | **63,048 bytes** total | Includes alternate woff/woff2 formats; a browser need not fetch all formats. |

The initial list combines ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, all FRONTAGE_V2_ASSETS, ROOM_FIXTURE_ATLASES, APPROVED_GS015_ROOM_ATLASES and ROOM_TOUCHUP_DECOR_ASSETS. Definitions: apps/player/src/art/bitmapAssetManifest.ts:65, :81, :263, :298, :338, :460; apps/player/src/facility/roomTouchups.ts:129. It includes higher-level rooms and previous Front Desk generations even in a new Level 0 clinic. Large atlas examples include 1254x1254 and 1536x1024; some approved WebP furniture atlases exceed 3000px width.

Characters are **already lazy-loaded**, not one 206 MB startup request. apps/player/src/facility/FacilityScene.ts:952 intentionally avoids preloading the entire still collection; :957 queues missing actor art as needed and retains loaded textures. Inactive actor containers are destroyed (:6979), but this does not evict texture images. The “1054 stills” comment is historical; additional catalogs now exist.

Examples of on-disk art volume: gs026-stills-v1 **41,416,545 bytes / 1,054 files**; legacy patients-v1 **23,845,212 / 21**; characters/v1 **18,722,216 / 12**; founders-v4 **14,163,315 / 21**; level3-roster-v2 **8,512,453 / 256**; gs026-employee-expansion-v1 **7,015,659 / 200**. These sizes identify optimization candidates, not permission to delete accepted artwork or claim every file is loaded.

The >500 kB build-warning concern is substantiated by the existing 8.21 MB chunk. apps/player/src/main.tsx:5 statically imports App; apps/player/src/facility/FacilityCanvas.tsx:10 statically imports Phaser; the domain context statically brings clinical/balance data (packages/game-domain/src/context.ts:1). No lazy gameplay route/manual chunking configuration appears in apps/player/vite.config.ts:1. A fresh manager-side production build/analyzer is needed before assigning exact savings to Phaser versus clinical/art metadata. Gzip figures are local zlib measurements, not a verified Pages response encoding.

### 4.3 Tick and view-projection cost: read-only source sampler

A Node v24.19.0 sampler loaded TypeScript in memory using registerHooks/stripTypeScriptTypes and public workspace aliases. No transpiled file, test artifact, browser or save was created. It used the actual gameReducer/PROTOTYPE_DOMAIN_CONTEXT, a fixed seed mobile-discovery-20261009, 120 warm-up ticks and **240 measured ADVANCE_TICK calls** for each scenario. It projected createPrototypePlayerView after every measured tick, and measured serializeGameState every 15 ticks (16 samples). This measures desktop Node CPU cost only, excluding React commit, Phaser, layout, actual localStorage.setItem, browser throttling and phone CPU.

Scenarios: fresh createInitialGameState; and tools/economy-audit/level-four-simulation.ts:10 createEarlyLevelFourEconomyState, a synthetic early Level 4 operational fixture rather than a large mature clinical-history save. Both ended at tick 360.

| Scenario | End-state size | Reducer mean / p95 / max (ms) | Player-view mean / p95 / max (ms) | Serialize mean / p95 / max (ms) |
| --- | --- | --- | --- | --- |
| Fresh Level 0 | 1 room, 0 staff, 1 encounter, 0 service jobs, 360 learning cards; serialized state **129,934 bytes** | **0.610 / 0.862 / 1.454** | **0.398 / 0.545 / 6.255** | **0.166 / 0.544 / 0.544** |
| Early Level 4 fixture | 42 room records including hallway tiles, 7 staff, 0 clinical encounters, 8 service jobs, 360 cards; **240,848 bytes** | **6.445 / 8.405 / 18.050** | **5.550 / 6.925 / 8.583** | **0.313 / 0.380 / 0.380** |

This shows a meaningful scaling gap, not a phone pass/fail threshold. The fresh scenario is unusually quiet; the Level 4 fixture omits routine clinical histories. Test mature clinics on actual devices.

Source cost drivers:

- clonePlain is JSON.parse(JSON.stringify(state)) (packages/game-domain/src/reducer.ts:232); ADVANCE_TICK clones the whole state before paused validation (:8425).
- Full view projection currently runs for state and camera changes (apps/player/src/App.tsx:36). Domain planning/room/staff/facility projections are more expensive at higher levels.
- Immediate non-tick persistence serializes **all campaigns**; that work grows with archives, reviews and frozen encounters (apps/player/src/session/prototypeStorage.ts:601). Deferred tick saves improve animation scheduling but do not change serialization cost.
- DEV_FAST_FORWARD synchronously loops up to 500 reducer ticks (packages/game-domain/src/reducer.ts:11127). It can block a phone even though ordinary play ticks less often.
- Every painted hallway tile can invoke a full-state build command, immediate save and undo snapshot. This is separate from frame rendering.

### 4.4 Memory and thermal/battery risks

No browser heap/native/image-memory profile was taken. The 351 MiB decoded-pixel figure is an estimate of the **eager image set**, not actual observed RAM, a hard lower bound, or a crash prediction. Canvas backing pixels, 2x text surfaces, derivative landscaping/chair/tint/stool canvases, character textures and React/browser overhead add separate costs (apps/player/src/facility/FacilityScene.ts:1005, :1060; apps/player/src/facility/backlessRollingStools.ts:1).

buildHistoryRef stores whole prior GameState objects and has no cap while Build remains active (apps/player/src/session/usePrototypeSession.ts:310, :629). Hallway painting makes this particularly relevant. History is cleared on Build exit/campaign switch, not on every edit. Domain transient receipts/events have explicit bounds (packages/game-domain/src/reducer.ts:229), but those do not bound every learning/frozen-encounter history or the separate build undo stack.

The mounted scene continues per-frame work when a phone chart covers it; dormant screens need a **presentation-only rendering policy** that does not stop the shared game clock or change desktop behavior. Asset loading/retention and frame pacing appear higher-priority than multiplying canvas pixels by phone DPR.

## 5. Opening pathways, networking and storage constraints

### 5.1 Canonical desktop play

**START_GAME.cmd → http://127.0.0.1:4173 in the owner's intended persistent browser profile remains canonical.** START_GAME.cmd:12 invokes scripts/Start-Prototype.ps1; that script sets the exact URL (scripts/Start-Prototype.ps1:10) and starts Vite with --host 127.0.0.1 --port 4173 --strictPort (scripts/Start-Prototype.ps1:249). apps/player/vite.config.ts:13 likewise binds server.host to 127.0.0.1, with port 4173 (:14).

A phone's 127.0.0.1 refers to the phone, not the PC. The current canonical loopback server cannot be reached directly by a PC LAN address or Tailscale IP. No launcher/binding/profile/pathway was changed or executed in this task.

### 5.2 Existing Tailscale phone route

START_PRIVATE_GAME.cmd:4 runs scripts/Start-PrivateGame.ps1:

- Uses backend **127.0.0.1:4174**, configured host **melissadesktop.taile197db.ts.net**, public-facing private URL **https://melissadesktop.taile197db.ts.net/** (scripts/Start-PrivateGame.ps1:9).
- Starts a hidden, separately recorded Vite process with the private config and strict port (scripts/Start-PrivateGame.ps1:133, :140).
- Verifies the machine's Tailscale DNS identity (scripts/Start-PrivateGame.ps1:108), owned healthy backend (:94), and expected HTTPS Serve proxy (:75). It rejects an unrelated existing Serve configuration rather than replacing it.
- Requests **tailscale serve --bg http://127.0.0.1:4174** only when appropriate (scripts/Start-PrivateGame.ps1:170); verifies Funnel is not enabled for that route (:80).
- scripts/vite/private-tailscale.config.ts:13 keeps loopback binding, adds allowedHosts for that DNS name (:16), and uses **wss HMR on 443** (:17). Its filesystem allow/deny rules are explicit (:18).
- The script explicitly announces that this HTTPS origin has separate saves from the canonical local origin (scripts/Start-PrivateGame.ps1:181).

For a later authorized phone playtest, the phone needs Tailscale access to the owner's tailnet and ACL permission, and the private backend/Serve route must be running. This discovery did **not** inspect current Tailscale status, enable Serve, open a phone or prove reachability. This route is already implemented and is preferable to assuming the canonical launcher listens on Wi-Fi.

### 5.3 Optional same-Wi-Fi / direct Tailscale-IP QA route

A LAN route would require a separately launched Vite server bound to the relevant network interface (or 0.0.0.0), Windows firewall access and the actual PC address. Merely changing the URL on the phone is insufficient. The same applies to direct http://<PC-Tailscale-IP>:<port>.

An example **future, isolated QA command**, not run here, from the repo root:

~~~powershell
npm.cmd run dev --workspace @gamify-surgery/player -- --host 0.0.0.0 --port 5183 --strictPort
~~~

Then use http://<PC-LAN-IP>:5183/ on the phone, or an allowed Tailscale-IP route. Port 5183 is a separate QA proposal; it does not replace START_GAME.cmd or transfer desktop saves. Exposing a Vite dev server should retain appropriate host/filesystem restrictions; the existing private config deliberately includes those restrictions. For HTTPS/HMR, the existing Tailscale hostname route already supplies the repository's concrete solution.

Hosted-auth redirects are derived from location.origin plus BASE_URL (apps/player/src/auth/AuthGate.tsx:126, :148). Additional QA origins may need approved hosted-auth redirect configuration. No account/backend configuration was read or changed.

### 5.4 GitHub Pages

Canonical remote playtest: **https://melissarowlandc-afk.github.io/GamifySurgery/**.

package.json:16 builds with --base=/GamifySurgery/ and runs scripts/verify-pages-build.mjs. apps/player/src/art/bitmapAssetManifest.ts:996 and apps/player/src/art/bitmapAssetAdapters.ts:67 apply BASE_URL to public asset URLs. A mobile shell in the same browser app can reuse that pipeline; root-relative assets/new routes must not break the Pages subpath.

.github/workflows/deploy-pages.yml:4 triggers on **main push** and workflow_dispatch; :43 builds/verifies; :50 uploads apps/player/dist; :54 deploys. This discovery performed no push/publication and did not verify the currently deployed site's build/version. Future backup/deployment work belongs to the manager's authorized lane.

### 5.5 Save separation and persistence diagnostics

Live localStorage belongs to the exact **scheme + host + port**, browser profile and device. Therefore 127.0.0.1:4173, localhost:4173, LAN-IP:5183, the private HTTPS Tailscale host and GitHub Pages all have independent campaigns. A phone and PC also have independent storage even when visiting the same Pages URL with the same account. Supabase sign-in currently does not bridge them.

A path alone is not a new localStorage origin: /GamifySurgery/ is a deployment base, while the Pages origin is https://melissarowlandc-afk.github.io. Do not create a new mobile save namespace or promise automatic desktop-to-phone continuity without a separately accepted persistence design.

For later diagnosis, record **location.origin**, full URL/base path, profile/device, campaign ID and build version. Keep the owner on START_GAME.cmd and the canonical persistent profile for existing local campaigns. Any temporary phone pathway must be labeled as separate storage; an empty phone campaign list is not evidence the desktop save was lost.

## 6. Existing tests and what they establish

No build, Vitest or Playwright suite was run here: those commands can write outputs/caches beyond the one authorized report. The filesystem/header samplers and in-memory CPU sampler were read-only. All pass counts in older plans/handoffs are historical, not acceptance of today's dirty sources.

### 6.1 E2E projects and explicit narrow viewports

playwright.config.ts:31 configures desktop Chrome **1440x1000**, compact desktop **1024x768**, laptop **1280x720** and **phone-chrome / Pixel 7** (:54). The installed Pixel 7 descriptor is **412x839 viewport**, DPR **2.625**, isMobile=true and hasTouch=true (node_modules/playwright-core/lib/server/deviceDescriptorsSource.json). This is Chromium emulation, not iOS Safari or a real Android phone.

92 gameplay spec files are present. By default each participates in the configured projects, but many explicitly skip particular projects/scenarios. A “phone” project is not proof every feature has phone coverage. page.setViewportSize(390x844) in a desktop-Chrome project changes geometry without making that browser a touch/mobile device.

| Test / anchor under tests/e2e/ | Coverage visible in source |
| --- | --- |
| tests/e2e/edge-anchored-layout.spec.ts:196 | Phone titleless layout, zoom overlay containment, no horizontal overflow; desktop cases include overlay hit-target checks (:139). |
| tests/e2e/patient-chart-density.spec.ts:35, :119 | All project widths; readable sheet/answer bounds, >=44px answer targets, bounded header, sheet scrolling and desktop anchoring. |
| tests/e2e/management-mode.spec.ts:22, :172 | Main Management lifecycle/layout across projects; a separate scenario skips phone. |
| tests/e2e/visual-ui.spec.ts:117, :155 | Explicit 390x844 chart, Build and tutorial screenshots/geometry; source now targets .chart-sheet (:133). |
| tests/e2e/ui-density.spec.ts:319 | Explicit phone-width density/containment coverage alongside compact desktop cases. |
| tests/e2e/tutorial-positioning.spec.ts:157, :178 | Coach target containment/reflow across projects. It still uses Escape and keyboard answer 1 in the phone path; not a pure touch walkthrough. |
| tests/e2e/tutorial-owner-playtest.spec.ts:10 | Natural guided wait/clock and teaching flow; desktop-only gate. |
| tests/e2e/event-message-board-lifecycle.spec.ts:314 | 390px history/scroll/new-row behavior; message tests also cover scroll-anchor retention. |
| tests/e2e/alert-humor.spec.ts:488 | Narrow long-row/message wrapping. |
| tests/e2e/golden-slice-visual.spec.ts:67; tests/e2e/level-two.spec.ts:102 | Explicit 390x844 visual snapshots. |
| tests/e2e/level-three.spec.ts:623 | Phone project service queue / displayed controls. |
| tests/e2e/patient-v1-acceptance.spec.ts:113 | 390px and desktop character QA gallery; artwork proof, not full mobile flow. |
| tests/e2e/title-tagline.spec.ts:114; tests/e2e/patient-availability-guidance.spec.ts:133 | Explicit phone title/empty-folder presentation checks. |
| tests/e2e/room-capacity-sales.spec.ts:117 | Sale dialog containment; part of shared room workflow coverage. |
| tests/e2e/map-click-info.spec.ts:75 | Inspection/Praise/chair/zoom behavior, **desktop-only**; mouse-based input. |
| tests/e2e/workspace-splitter.spec.ts:10 | Desktop 1440px mouse/keyboard splitter behavior, deliberately not phone. |
| tests/e2e/prototype.spec.ts:30, :69, :130, :178, :218, :298, :349 | Auth/opening, campaigns, reload, multi-campaign/restart, cooldown/pause and save failures; the natural chart-flow scenario is desktop-only (:260). |

No active tests invoke touchscreen.tap/page.tap or a pinch sequence; map tests commonly use page.mouse and DOM locator.click. No iPhone/WebKit, iPad/tablet, physical-phone frame/memory, orientation-change or virtual-keyboard/browser-toolbar suite was found. The Pixel 7 descriptor's hasTouch flag does not cover those omissions.

### 6.2 Narrow-layout / input unit checks

| Source under apps/player/src/ | What is tested |
| --- | --- |
| apps/player/src/styles/clinicPresentation.test.ts:53, :91 | Footer tracks/CSS expectations, narrow byline wrapping, 44px compact message actions at the 760px media rule. Static CSS checks, not measured DOM. |
| apps/player/src/ui/tutorialPositioning.test.ts:30, :52 | Pure positioning/avoidance/docking, including 320x480 and compact viewport models. |
| apps/player/src/ui/TutorialCoach.input.test.tsx:44 | Synthetic pointerdown/up/click propagation absorption and CSS pointer-event expectations. |
| apps/player/src/ui/chartPlacement.test.ts:7, :31 | Pure desktop chart-placement calculations; not physical phone overlay/keyboard behavior. |
| apps/player/src/ui/workspaceSplitter.test.ts:17 | Pure share clamping/pointer calculation and preference behavior. |
| apps/player/src/facility/facilityCameraBounds.test.ts:57; apps/player/src/facility/defaultCamera.test.ts:6 | Viewport/grid-based camera clamping and initial framing. |
| apps/player/src/facility/frontDeskSeatInteraction.test.ts:39 | Mocked pointer/chair/front-desk action interactions. |
| apps/player/src/session/facilityCameraPreference.test.ts:60 | Rapid camera-change debouncing; no touch recognizer. |
| apps/player/src/facility/earningsPopupFrameCost.test.ts:17 | Receipt-list/popup reuse and lazy anchor calls; functional frame-cost checks, not FPS/time budgets. |

Existing handoff records include phone sheet/management checks (docs/handoffs/CURRENT_THREAD_HANDOFF.md:4374), natural phone scrolling/44px chart actions (:4512), and edge-rail/overlay-zoom phone checks (:4654). Older docs/clinical-pilot/HANDOFF.md:294 records 390x844 visual review. These support keeping useful responsive foundations, but they do not establish comfortable end-to-end phone gameplay.

## 6.3 Exhaustive E2E viewport/project/input index

Every current gameplay spec is listed below (92 files). The middle column indexes explicit viewport and project-selection/skip statements; read the referenced predicate to determine which scenario actually runs on phone. A file with no local predicate still receives the configured projects. The last column indexes explicit mouse/keyboard/touch calls, not native locator.click calls; absence does not imply a fully touch-driven test. This is source coverage inventory, not a run result.

| Spec:first layout/project line | All viewport/project/skip lines | Explicit mouse/keyboard/touch lines |
| --- | --- | --- |
| tests/e2e/alert-humor.spec.ts:305 | 305, 306, 309, 370, 371, 486, 487, 488, 490 | No explicit mouse/keyboard/touch calls |
| tests/e2e/answered-chart-action-recovery.spec.ts:217 | 217, 221, 252, 280, 281 | No explicit mouse/keyboard/touch calls |
| tests/e2e/approved-procedure-routing.spec.ts:246 | 246, 293, 359, 401 | No explicit mouse/keyboard/touch calls |
| tests/e2e/approved-room-interactions.spec.ts:75 | 75, 124, 160, 197 | No explicit mouse/keyboard/touch calls |
| tests/e2e/approved-room-runtime.spec.ts:22 | 22 | No explicit mouse/keyboard/touch calls |
| tests/e2e/autonomous-clinical-batch.spec.ts:269 | 269, 270, 271, 402, 403, 404 | No explicit mouse/keyboard/touch calls |
| tests/e2e/backed-north-room-walls.spec.ts:14 | 14, 15 | No explicit mouse/keyboard/touch calls |
| tests/e2e/board-concept-expansion-20260912.spec.ts:294 | 294, 295, 383, 384 | No explicit mouse/keyboard/touch calls |
| tests/e2e/board-concept-expansion.spec.ts:123 | 123, 155, 188 | No explicit mouse/keyboard/touch calls |
| tests/e2e/build-mode-usability.spec.ts:13 | 13, 14 | 187 |
| tests/e2e/canonical-enclosed-room-matrix.spec.ts:20 | 20, 21, 23 | 38, 39, 40, 41, 47, 48, 49, 50 |
| tests/e2e/canonical-hallway-edges.spec.ts:14 | 14, 15 | No explicit mouse/keyboard/touch calls |
| tests/e2e/character-resolution-zoom.spec.ts:113 | 113, 114 | No explicit mouse/keyboard/touch calls |
| tests/e2e/character-step-bounce.spec.ts:53 | 53, 66 | No explicit mouse/keyboard/touch calls |
| tests/e2e/character-still-loading-scale.spec.ts:53 | 53, 87 | No explicit mouse/keyboard/touch calls |
| tests/e2e/character-stills-glide.spec.ts:46 | 46, 60, 170 | No explicit mouse/keyboard/touch calls |
| tests/e2e/character-walk-pilot.spec.ts:12 | 12, 49, 78, 221 | No explicit mouse/keyboard/touch calls |
| tests/e2e/clinic-biopsy-visitors-correction.spec.ts:188 | 188 | No explicit mouse/keyboard/touch calls |
| tests/e2e/clinic-economy-names-expansion.spec.ts:1 | None; configured projects apply | No explicit mouse/keyboard/touch calls |
| tests/e2e/clinic-income-popups.spec.ts:143 | 143, 179 | No explicit mouse/keyboard/touch calls |
| tests/e2e/clinic-shared-wall-correction.spec.ts:12 | 12, 13 | No explicit mouse/keyboard/touch calls |
| tests/e2e/daily-clinic-routines.spec.ts:76 | 76, 141 | 90 |
| tests/e2e/door-cutout-floor-continuity.spec.ts:14 | 14, 15 | No explicit mouse/keyboard/touch calls |
| tests/e2e/edge-anchored-layout.spec.ts:124 | 124, 125, 142, 143, 148, 197 | 186, 187, 188, 189 |
| tests/e2e/employee-character-coverage.spec.ts:64 | 64, 74, 116 | No explicit mouse/keyboard/touch calls |
| tests/e2e/employee-training.spec.ts:87 | 87, 92, 157 | No explicit mouse/keyboard/touch calls |
| tests/e2e/endoscopy-goal-setup.spec.ts:121 | 121, 193, 218 | No explicit mouse/keyboard/touch calls |
| tests/e2e/event-message-board-lifecycle.spec.ts:314 | 314 | 178, 320 |
| tests/e2e/examination-room-visual.spec.ts:96 | 96, 162, 163, 191, 192, 212, 213, 225, 226, 249, 250 | 151, 152, 153, 154 |
| tests/e2e/exterior-frontage.spec.ts:171 | 171, 172, 173, 186, 239 | 197, 198, 199, 200 |
| tests/e2e/facility-diagnostic-timing.spec.ts:16 | 16, 119, 162, 217 | No explicit mouse/keyboard/touch calls |
| tests/e2e/five-room-waiting-bathroom-visual.spec.ts:54 | 54, 67, 68, 93, 94 | No explicit mouse/keyboard/touch calls |
| tests/e2e/floor-pattern-pan-stability.spec.ts:205 | 205, 206 | 195, 196, 197, 198 |
| tests/e2e/founder-activity-chart-endoscopy.spec.ts:31 | 31, 390, 424, 428, 550 | No explicit mouse/keyboard/touch calls |
| tests/e2e/founder-options.spec.ts:26 | 26, 27, 86, 87 | No explicit mouse/keyboard/touch calls |
| tests/e2e/fresh-campaign-examination-room.spec.ts:7 | 7 | No explicit mouse/keyboard/touch calls |
| tests/e2e/front-desk-founder-anatomy.spec.ts:187 | 187, 334, 335 | No explicit mouse/keyboard/touch calls |
| tests/e2e/front-desk-four-row-floor.spec.ts:14 | 14, 15, 56 | No explicit mouse/keyboard/touch calls |
| tests/e2e/front-desk-occlusion-polish.spec.ts:62 | 62, 63 | No explicit mouse/keyboard/touch calls |
| tests/e2e/front-desk-visual.spec.ts:22 | 22, 23, 24, 26, 116, 161, 173, 202, 251 | 180, 181, 182, 183, 197, 198, 199, 200 |
| tests/e2e/golden-slice-visual.spec.ts:33 | 33, 34, 35, 37, 65, 66, 67, 69, 104, 105, 127, 128, 129, 131, 151 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs025-patient-flow.spec.ts:530 | 530, 650 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs025-seating-layering.spec.ts:960 | 960 | 407, 431, 455, 734, 865, 1864 |
| tests/e2e/gs028-20261002.spec.ts:1 | None; configured projects apply | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-20261003.spec.ts:1 | None; configured projects apply | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-20261007-level3.spec.ts:48 | 48, 258, 262 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-20261007-variety2.spec.ts:48 | 48, 258, 262 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-20261007.spec.ts:39 | 39, 248, 285 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-pre-endoscopy.spec.ts:143 | 143 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-second-pre-endoscopy.spec.ts:177 | 177, 220 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs028-statistics-ethics.spec.ts:194 | 194 | No explicit mouse/keyboard/touch calls |
| tests/e2e/gs031-care-flow.spec.ts:370 | 370, 389, 428, 471, 499 | 126, 127, 128, 129 |
| tests/e2e/gs031-seating.spec.ts:217 | 217, 229, 296, 313, 318, 335, 339, 367, 371 | 214, 220, 265, 268, 298, 328, 329, 330, 331, 361 |
| tests/e2e/hallway-decor.spec.ts:19 | 19 | No explicit mouse/keyboard/touch calls |
| tests/e2e/hud-sidebar-tutorial.spec.ts:21 | 21, 22, 57, 68, 69 | No explicit mouse/keyboard/touch calls |
| tests/e2e/level-three-goals.spec.ts:54 | 54, 71, 103 | No explicit mouse/keyboard/touch calls |
| tests/e2e/level-three.spec.ts:334 | 334, 337, 382, 424, 427, 497, 500, 557, 620, 623 | No explicit mouse/keyboard/touch calls |
| tests/e2e/level-two.spec.ts:24 | 24, 101, 102 | No explicit mouse/keyboard/touch calls |
| tests/e2e/management-mode.spec.ts:25 | 25, 134, 141, 148, 172, 173, 176, 191, 238 | 196, 197, 198, 199, 206, 207, 208, 209 |
| tests/e2e/map-click-info.spec.ts:76 | 76 | 120, 129, 134, 137, 169, 193, 194, 203, 217 |
| tests/e2e/non-editable-cursor.spec.ts:43 | 43 | No explicit mouse/keyboard/touch calls |
| tests/e2e/patient-availability-guidance.spec.ts:98 | 98, 121, 133 | No explicit mouse/keyboard/touch calls |
| tests/e2e/patient-chart-density.spec.ts:30 | 30, 38, 39, 111 | No explicit mouse/keyboard/touch calls |
| tests/e2e/patient-v1-acceptance.spec.ts:51 | 51, 52, 114, 115, 125, 146, 147, 171, 172, 288 | No explicit mouse/keyboard/touch calls |
| tests/e2e/patient-wording-test-times.spec.ts:1 | None; configured projects apply | No explicit mouse/keyboard/touch calls |
| tests/e2e/periop-beds-recovery.spec.ts:1205 | 1205, 1254, 1316, 1377 | 1126 |
| tests/e2e/periop-preparation.spec.ts:261 | 261 | No explicit mouse/keyboard/touch calls |
| tests/e2e/playthrough-batch.spec.ts:369 | 369 | No explicit mouse/keyboard/touch calls |
| tests/e2e/prototype.spec.ts:260 | 260 | No explicit mouse/keyboard/touch calls |
| tests/e2e/question-review-flags.spec.ts:13 | 13, 14 | No explicit mouse/keyboard/touch calls |
| tests/e2e/reading-room-radiologists.spec.ts:21 | 21 | No explicit mouse/keyboard/touch calls |
| tests/e2e/retail-income.spec.ts:9 | 9, 102 | No explicit mouse/keyboard/touch calls |
| tests/e2e/room-capacity-sales.spec.ts:111 | 111, 117, 118, 121, 122, 158, 222 | No explicit mouse/keyboard/touch calls |
| tests/e2e/room-touchups.spec.ts:27 | 27 | No explicit mouse/keyboard/touch calls |
| tests/e2e/room-upgrades.spec.ts:51 | 51, 266, 366, 434 | No explicit mouse/keyboard/touch calls |
| tests/e2e/service-income.spec.ts:13 | 13 | No explicit mouse/keyboard/touch calls |
| tests/e2e/service-transition-detour.spec.ts:333 | 333, 340 | No explicit mouse/keyboard/touch calls |
| tests/e2e/staffed-checkin-pathing.spec.ts:115 | 115, 204, 289 | No explicit mouse/keyboard/touch calls |
| tests/e2e/surgery-center-concepts.spec.ts:421 | 421, 530 | No explicit mouse/keyboard/touch calls |
| tests/e2e/test-choice-orders.spec.ts:1 | None; configured projects apply | No explicit mouse/keyboard/touch calls |
| tests/e2e/title-tagline.spec.ts:18 | 18, 19, 23, 33, 95, 114 | No explicit mouse/keyboard/touch calls |
| tests/e2e/top-down-side-wall-caps.spec.ts:41 | 41, 54, 55 | No explicit mouse/keyboard/touch calls |
| tests/e2e/tutorial-completion.spec.ts:6 | 6, 40 | No explicit mouse/keyboard/touch calls |
| tests/e2e/tutorial-daily-routines.spec.ts:10 | 10 | 50, 79, 81, 84 |
| tests/e2e/tutorial-graduation.spec.ts:14 | 14 | No explicit mouse/keyboard/touch calls |
| tests/e2e/tutorial-owner-playtest.spec.ts:10 | 10, 59 | No explicit mouse/keyboard/touch calls |
| tests/e2e/tutorial-positioning.spec.ts:58 | 58, 67, 68, 157, 158, 175, 193 | 178, 183 |
| tests/e2e/ui-density.spec.ts:11 | 11, 176, 190, 191, 283 | No explicit mouse/keyboard/touch calls |
| tests/e2e/ultrasound-first-imaging.spec.ts:92 | 92, 167 | No explicit mouse/keyboard/touch calls |
| tests/e2e/visual-ui.spec.ts:35 | 35, 36, 37, 72, 73, 120, 121, 122, 125, 158, 159, 160, 162 | No explicit mouse/keyboard/touch calls |
| tests/e2e/wall-corner-continuity.spec.ts:8 | 8, 9 | No explicit mouse/keyboard/touch calls |
| tests/e2e/workspace-splitter.spec.ts:9 | 9, 10 | 32, 36, 37, 42, 55, 63, 67, 68, 73 |

## 6.4 Discovery validation receipt

Completed read-only checks:

- **908 explicit file:line references**, plus **266 same-line shorthand references**, checked for existing files and valid line bounds across **684 referenced files**; zero invalid references.
- **1,041 indexed documentation/collateral locations** checked against their current keyword/media/pointer patterns; zero stale matches.
- All **45 active global media blocks** appear in Appendix A; zero missing or extra blocks. All **92 E2E spec files** appear in section 6.3.
- Initial image list: **199 descriptors / 199 unique paths**, **24,570,993 compressed bytes**, **368,024,520 nominal RGBA bytes**, **zero declared-versus-header dimension mismatches**. PNG and WebP headers were both parsed.
- In-memory source sampler invoked with **node --input-type=module --disable-warning=ExperimentalWarning**: both 120-warm-up/240-measured-tick scenarios completed; rounded CPU outputs are in section 4.3. This is not browser/phone validation.
- Report is UTF-8 without BOM. Scoped read-only git status reports the requested report as a new untracked file. The only writes made by this worker were to this report.

Build/typecheck/Vitest/Playwright, phone reachability, physical gestures, rendering quality and browser memory remain **unrun/unverified** in this discovery. No existing passing record is presented as a fresh result.

## Appendix A. Every active player media/container breakpoint

Multiple layers in global.css target the same legacy class families. Earlier declarations often remain in the file after newer overrides. The table indexes all 45 media blocks; it should not be interpreted as independent phone systems. Removing a legacy block safely requires checking its actual selectors/consumers, including desktop.

| global.css line | Query | Purpose |
| --- | --- | --- |
| 1213 | max 1180 | Footer compact tracks. |
| 1598 | max 1100 | Earlier compact HUD/grid/build-list layout. |
| 1613 | max 760 | Original stacked phone resources/map/chart/lists/footer/dialog/coach. |
| 1743 | reduced motion | Global animation/transition reduction. |
| 1937 | min 761 | Desktop clinic workspace. |
| 2176 | min 761, max 1180 | Compact desktop grid. |
| 2182 | max 760 | Phone document/root scrolling, avatars/resources. |
| 2329 | max 760 | DEV character gallery layout. |
| 3052 | min 1181 | Earlier wide option/guide layout. |
| 3601 | max 760 | Compact message action 44px targets. |
| 4047 | max 1100 | Earlier resource/grid/chart density. |
| 4062 | max 760 | Resources/legacy chart actions/resolved drawer. |
| 4128 | min 761 | Desktop bounded rails/map/desk/build/footer. |
| 4588 | min 761, max 1180 | Compact rails/HUD/chart/emergency/advertising. |
| 4732 | min 761, max 900 | Small desktop rails/HUD/footer. |
| 5041 | max 700 | Build tools wrapping. |
| 5961 | max 900 | Build toolbar/catalog/inspector. |
| 5975 | max 700 | Build topbar/toolbar/single-column catalog. |
| 6609 | min 761 | Workspace/map/legacy chart/goals/events. |
| 6643 | min 1181 | Wide legacy chart. |
| 6657 | min 761, max 1180 | Compact workspace/HUD/legacy chart. |
| 6725 | max 760 | Current stacked/scrolling phone composition. |
| 6976 | reduced motion | Chart/tab/map/message/highlight transitions. |
| 7021 | max 760 | Title suppression during phone chart. |
| 7038 | min 761 | Map/desk tracks and legacy chart. |
| 7131 | min 761, max 1180 | Legacy compact chart columns. |
| 7144 | min 761 | Legacy paper-chart scroll/grid. |
| 7206 | min 761, max 1180 | Further legacy chart column adjustment. |
| 7216 | max 760 | Legacy chart steps. |
| 7370 | min 761, max 1180 | Legacy chart title/avatar density. |
| 7418 | min 761 | Patient rail/emergency/advertising density. |
| 7472 | max 760 | HUD outline and advertising phone treatment. |
| 7553 | max 760 | Question prompt / review-flag placement. |
| 7684 | min 761 | Desktop splitter/workspace. |
| 7766 | max 760 | Question-review dialog. |
| 7784 | min 761 | HUD/footer/map/desk trigger density. |
| 7915 | max 760 | Footer/time/build wrapping and XP row. |
| 7967 | min 761, max 1180 | Compact footer/build toolbar. |
| 8020 | min 761 | Further HUD/time/footer density. |
| 8102 | min 761, max 1180 | Compact footer. |
| 8117 | min 761 | Panel/emergency/patient/goals/messages/build density. |
| 8330 | min 761 | Rails flush to screen edges. |
| 8399 | max 760 | Zoom overlay position, not target enlargement. |
| 8945 | reduced motion | Room stars/spend popups. |
| 9133 | reduced motion | Needs you expansion. |

All table lines are in **apps/player/src/styles/global.css**.

Other active UI stylesheet breakpoints:

| File:line | Query / purpose |
| --- | --- |
| apps/player/src/ui/chartSheet.css:384 | Container min 580px: two-column answer layout. |
| apps/player/src/ui/chartSheet.css:855 | Max 720px: story/decisions stack, satisfaction header omitted. |
| apps/player/src/ui/chartSheet.css:876 | Max 760px: full-viewport chart, no keyboard hints, 44px close/flag/reference. |
| apps/player/src/ui/chartSheet.css:910 | Reduced-motion chart feedback/actions. |
| apps/player/src/ui/clinicalReview.css:134 | Max 760px: clinical summary/list layout. |
| apps/player/src/ui/financePresentation.css:126 | Max 760px: HUD cash-details placement. |
| apps/player/src/ui/HelpDialog.css:9 | Max 560px: one-column topic navigation. |
| apps/player/src/ui/OpeningSequence.css:352 | Max 42rem: stacked start/campaign/form choices. |
| apps/player/src/ui/OpeningSequence.css:373 | Reduced-motion opening. |

Paths in this second table are under **apps/player/src/**. Non-media constants also affect phone layout: apps/player/src/ui/ChartPanel.tsx:37 phone maximum 760px; apps/player/src/ui/RoomActionMenu.tsx:130 dock threshold 520px; apps/player/src/ui/tutorialPositioning.ts:44 viewport padding/gap/preferred/minimum coach sizes; apps/player/src/ui/workspaceSplitPreference.ts:3 map minimum 220px and desk minimum 190px.

## Appendix B. Documentation and historical work

### B.1 Direction versus completion

| Document / anchor | Relevant meaning |
| --- | --- |
| docs/adr/0003-browser-first-responsive-delivery.md:13, :17, :34, :49 | Accepted one browser client, full phone gameplay and shared model; dedicated phone design/testing required. Cross-device saves are intended, not delivered by the present local save path. |
| docs/adr/0004-react-phaser-typescript-client.md:13, :24, :71 | React for responsive/text UI; Phaser for facility; maintain domain/presentation boundary and phone testing. |
| docs/adr/0006-logical-tile-grid.md:44, :60 | Same logical construction rules/saves; phone construction controls still need deliberate interaction design. |
| docs/adr/0007-pause-when-hidden.md:16, :24, :60 | Phone lock/background behavior shares pause/no offline progression policy. |
| docs/adr/0011-versioned-hybrid-saves.md:13 | Cross-device versioned save goal; not proof that live cloud sync exists. |
| docs/adr/0023-multiple-choice-clinical-assessment.md:15 | Explicit assessment controls selected partly for mobile complexity. |
| docs/adr/0026-patient-chart-lifecycle.md:74 | Desktop keeps map visible; phone may prioritize readable chart; preserve lifecycle. |
| ARCHITECTURE.md:241, :494 | Intended phone pan/zoom, staged drawers/tabs, text/touch accessibility. Statements of target architecture are broader than the present shell. |
| CANONICAL_DESIGN.md:47, :56, :68, :89, :490, :585 | Current phone stacking/chart, natural scrolling, clock/lifecycle and full-functionality direction. |
| OPEN_DECISIONS.md:36 | Portrait/landscape phone layout remains open. |
| README.md:300; ROADMAP.md:238; PLAYTEST_PLAN.md:117; PROJECT_BRIEF.md:185 | Explicit remaining phone polish/walkthrough/deployment work. No hidden completed mobile redesign plan was found. |
| RISK_REGISTER.md:14 | Active risk: phone interface technically present but unpleasant. |
| DEPLOYMENT_PLAN.md:53, :133 | Trusted-device browser testing; native wrappers deferred. |
| DECISION_LOG.md:11, :68 | Browser acceptance and phone-focused visual adaptation, without replacing gameplay. |

### B.2 Implemented responsive milestones worth reusing

| Plan / handoff | Existing work and limitations |
| --- | --- |
| docs/execplans/compact-patient-chart-presentation.md:42, :232, :350 | Compact readable questions/actions and phone chart treatment; older legacy chart CSS remains. |
| docs/execplans/condense-interface-vertical-density.md:53, :172 | Compact desktop density while retaining phone wrapping/scrolling. |
| docs/execplans/add-draggable-map-desk-divider.md:31, :119 | Pointer/keyboard desktop splitter; explicitly retain phone stacked layout. |
| docs/execplans/further-condense-hud-footer.md:33, :148 | Compact HUD/footer, phone XP/control wrapping. |
| docs/execplans/move-employees-to-management-mode.md:49, :179 | Employees moved into Management; responsive containment, shared pause behavior. |
| docs/execplans/edge-anchor-rails-and-overlay-map-zoom.md:40, :134, :150 | Desktop rails flush to screen edges; zoom overlay; phone retains stacked flow. |
| docs/execplans/owner-requests-20261008.md:699, :711, :731, :1755, :5256, :5576 | Current sheet/ETA/optional-goal touch checks, responsive coach, patient folders and cash native-details work. Manager must review current acceptance state. |
| docs/design/tutorial-revamp-proposal.md:327, :368 | Native controls/keyboard, no target obstruction, Help and responsive coach requirements. |
| docs/execplans/alerts-usefulness-and-humor.md:304, :315, :329 | Historical phone wrapping/history validation for Alerts & Events. |
| docs/handoffs/CURRENT_THREAD_HANDOFF.md:4046, :4374, :4512, :4654, :6273, :6337 | Historical splitter/phone sheet/management/chart/rail checks, newer coach/finance acceptance notes. |
| docs/features/visual-art-direction.md:296, :338 | Phone has no divider; same systems in a stacked presentation. |
| CHANGELOG.md:654, :750, :862, :1216, :1224 | Coach fixed geometry, dialog stacking, canvas-resize correction; phone refinement historically deferred. |
| docs/clinical-pilot/HANDOFF.md:294; docs/handoffs/GS-034_DIAGNOSTIC_TIMING.md:103; docs/handoffs/GS-035_PATIENT_AVAILABILITY.md:105 | Focused phone chart/timing/availability checks. These are not full touch-game acceptance. |

### B.3 Replacement boundary

Reasonable **mobile-only** scrap candidates are the stacked three-rail page, desktop map/desk sizing and density overrides, fixed-sheet placement hooks tied to desktop DOM, desktop scroll-to-row alert navigation, hover-only ETA/action discoverability, and the mouse-shaped construction gesture mapping. Their shared views/actions/clinical content need not be scrapped.

Keep the domain reducer/context, command IDs, frozen encounters/choice IDs, campaign save/migration paths, timing/pause rules, building access/confirmation guards, approved asset identities, native disclosure content, reduced-motion behavior and useful narrow regressions. Do not delete legacy global chart selectors solely on their comments: EmployeeDiscussionPanel now consumes ChartPanel, but other selectors/tests still exist; removal needs a separate consumer audit and desktop regression lane.

Responsive art/workbench review pages can be retained as tooling. They are not a background mobile game and need no rewrite to enable a mobile shell.

### B.4 Exhaustive keyword-location index

The next table is a reproducible navigation index of all active documentation files containing whole-word mobile, phone, tablet, touch or responsive. It includes historical notes and false positives. “Mobile imaging technician,” clinic-phone humor, “touch-up,” general “do not touch,” and clinical descriptions are **not evidence of mobile-platform work**. This report does not reproduce clinical prose.



| Document:first matching line | All matching lines |
| --- | --- |
| ARCHITECTURE.md:16 | 16, 29, 123, 210, 241, 494, 496, 498, 499, 502, 750, 752, 760 |
| CANONICAL_DESIGN.md:47 | 47, 56, 68, 70, 89, 490, 585, 591 |
| CHANGELOG.md:654 | 654, 659, 669, 735, 738, 749, 750, 780, 782, 861, 862, 863, 935, 1135, 1143, 1146, 1216, 1224, 1230, 1256, 1277, 1425, 1434 |
| DECISION_LOG.md:11 | 11, 68 |
| DEPLOYMENT_PLAN.md:53 | 53, 133 |
| OPEN_DECISIONS.md:36 | 36 |
| PLAYTEST_PLAN.md:117 | 117, 137 |
| PROJECT_BRIEF.md:76 | 76, 127, 185 |
| README.md:54 | 54, 55, 266, 267, 270, 300, 301, 307 |
| RISK_REGISTER.md:14 | 14 |
| ROADMAP.md:47 | 47, 48, 106, 118, 157, 238, 281 |
| docs/adr/0003-browser-first-responsive-delivery.md:1 | 1, 13, 17, 18, 28, 34, 41, 49, 51 |
| docs/adr/0004-react-phaser-typescript-client.md:13 | 13, 15, 24, 71, 76 |
| docs/adr/0006-logical-tile-grid.md:15 | 15, 44, 60, 71, 77 |
| docs/adr/0007-pause-when-hidden.md:16 | 16, 24, 47, 60 |
| docs/adr/0011-versioned-hybrid-saves.md:13 | 13 |
| docs/adr/0017-browser-authoritative-facility-simulation.md:75 | 75 |
| docs/adr/0021-delegated-technical-authority-and-prototype-first-delivery.md:69 | 69 |
| docs/adr/0023-multiple-choice-clinical-assessment.md:15 | 15 |
| docs/adr/0026-patient-chart-lifecycle.md:74 | 74, 139 |
| docs/clinical-pilot/HANDOFF.md:294 | 294, 298, 300, 301, 302, 303 |
| docs/clinical-workbench/approvals/owner-delegated-variety-2-2026-10-07.md:230 | 230 |
| docs/clinical-workbench/approvals/owner-level3-2026-10-07.md:127 | 127, 130, 148 |
| docs/design/exterior-frontage-proposal.md:20 | 20, 169 |
| docs/design/guidance-tips-proposal.md:496 | 496 |
| docs/design/room-economy-audit-20261008.md:161 | 161 |
| docs/design/tutorial-revamp-proposal.md:327 | 327, 368 |
| docs/execplans/add-draggable-map-desk-divider.md:19 | 19, 31, 49, 61, 93, 119, 152, 168 |
| docs/execplans/alerts-events-revamp-20261007.md:391 | 391 |
| docs/execplans/alerts-usefulness-and-humor.md:304 | 304, 315, 329 |
| docs/execplans/approved-character-surface-fitting.md:91 | 91, 132 |
| docs/execplans/backup-current-beta-checkpoint-2026-09-01.md:166 | 166 |
| docs/execplans/build-cortan-graphics-workflows.md:59 | 59 |
| docs/execplans/character-layering-pathing.md:202 | 202, 210 |
| docs/execplans/character-movement.md:889 | 889, 905, 913, 954, 986, 1042, 1073, 1135, 1237, 1824, 1850, 1895 |
| docs/execplans/character-stills-runtime-integration.md:181 | 181 |
| docs/execplans/clinic-income-service-catalog.md:137 | 137 |
| docs/execplans/clinic-income-service-visitors.md:22 | 22, 86, 89 |
| docs/execplans/compact-patient-chart-presentation.md:42 | 42, 46, 97, 140, 187, 192, 227, 232, 241, 257, 261, 282, 295, 315, 327, 329, 338, 347, 350, 377, 379, 387 |
| docs/execplans/condense-interface-vertical-density.md:20 | 20, 41, 53, 89, 104, 109, 133, 143, 150, 172, 180, 192, 195, 205 |
| docs/execplans/ct-routing-and-imaging-staffing.md:26 | 26, 37 |
| docs/execplans/durable-browser-persistence.md:73 | 73 |
| docs/execplans/edge-anchor-rails-and-overlay-map-zoom.md:33 | 33, 40, 53, 75, 88, 92, 102, 132, 134, 143, 150, 151, 152, 160, 161, 182 |
| docs/execplans/exterior-frontage-b-20261008.md:288 | 288, 331 |
| docs/execplans/exterior-landscaping-sidewalk-pass.md:27 | 27 |
| docs/execplans/facility-diagnostic-timing.md:52 | 52, 101, 123 |
| docs/execplans/founder-motion-reset.md:279 | 279, 307 |
| docs/execplans/fourth-character-standard-fit.md:132 | 132, 251 |
| docs/execplans/front-desk-corrections-and-examination-redesign.md:172 | 172 |
| docs/execplans/further-condense-hud-footer.md:25 | 25, 33, 34, 61, 75, 82, 101, 111, 112, 148, 149, 153, 158 |
| docs/execplans/future-roster20-v5-20261007.md:7 | 7, 13, 31, 40 |
| docs/execplans/gray-braid-character-fit.md:31 | 31 |
| docs/execplans/gs037-employee-training.md:174 | 174 |
| docs/execplans/gs038-all-room-upgrades.md:83 | 83, 193, 319, 325, 342, 343, 356, 358, 405, 593, 646 |
| docs/execplans/gs039-mri-room-art.md:29 | 29, 31, 80 |
| docs/execplans/implement-approved-clinical-content-batch-2026-08-31.md:44 | 44 |
| docs/execplans/implement-board-concept-expansion-2026-09-11.md:99 | 99 |
| docs/execplans/implement-level-2-expanded-outpatient-endoscopy.md:92 | 92, 101, 130, 141, 193 |
| docs/execplans/implement-room-character-visual-upgrade.md:37 | 37, 70, 112, 141, 145 |
| docs/execplans/level-four-room-design.md:180 | 180 |
| docs/execplans/level-three-room-design.md:143 | 143, 167, 182, 248, 328, 367, 385, 420, 491, 551, 577, 687 |
| docs/execplans/level4-launch-plan-20261008.md:852 | 852 |
| docs/execplans/level4-pediatric-exam-mockup-20261008.md:57 | 57, 129 |
| docs/execplans/level4-wound-ostomy-mockup-20261008.md:45 | 45 |
| docs/execplans/move-employees-to-management-mode.md:32 | 32, 49, 118, 124, 145, 167, 179, 181, 210, 211, 222 |
| docs/execplans/next-character-hybrid-fit.md:83 | 83, 123 |
| docs/execplans/owner-requests-20261008.md:699 | 699, 711, 715, 731, 742, 1402, 1755, 1977, 3108, 3129, 3265, 3887, 5256, 5576 |
| docs/execplans/patient-demographics20-v4-20261007.md:16 | 16, 28 |
| docs/execplans/patient-women20-stills-20261007.md:37 | 37, 45 |
| docs/execplans/playthrough-usability-patient-flow.md:52 | 52 |
| docs/execplans/redesign-30-authored-founders.md:151 | 151, 152 |
| docs/execplans/refine-shared-walls-and-door-seams.md:23 | 23 |
| docs/execplans/render-doorways-as-full-floor-continuous-cutouts.md:37 | 37, 210 |
| docs/execplans/repair-patient-presentations-2026-09-13.md:21 | 21 |
| docs/execplans/replace-patient-roster-with-50-authored-adults.md:260 | 260, 284, 414, 418 |
| docs/execplans/replicate-photos-for-codex-art-direction.md:64 | 64, 91, 121, 123, 183 |
| docs/execplans/restore-walk-baseline.md:308 | 308 |
| docs/execplans/room-consistency-audit.md:93 | 93 |
| docs/execplans/room-design.md:619 | 619, 667, 712, 743, 789, 878, 965 |
| docs/execplans/standard-character-atlas.md:139 | 139 |
| docs/execplans/still-movement-comparison.md:19 | 19, 94 |
| docs/execplans/tutorial-daily-clinic-routines.md:50 | 50, 78 |
| docs/execplans/ui-font-system-20261007.md:526 | 526 |
| docs/execplans/ultrasound-first-imaging.md:32 | 32, 35, 36 |
| docs/execplans/unify-all-room-wall-heights.md:115 | 115 |
| docs/execplans/unify-examination-room-architecture.md:35 | 35 |
| docs/execplans/whole-body-static-review.md:39 | 39, 46 |
| docs/features/alert-notification-flavor-system.md:58 | 58, 390 |
| docs/features/character-movement-review.md:111 | 111, 188, 190 |
| docs/features/room-design-review.md:606 | 606 |
| docs/features/visual-art-direction.md:296 | 296, 321, 338, 340, 351, 354, 371 |
| docs/handoffs/ALERTS_EVENTS_DISCOVERY.md:90 | 90, 143 |
| docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md:57 | 57, 520, 581, 586, 610, 733, 1316, 1358, 1360, 1364, 1582, 1602, 1713 |
| docs/handoffs/CURRENT_THREAD_HANDOFF.md:166 | 166, 439, 471, 472, 490, 691, 723, 1255, 1284, 1307, 1518, 1520, 2517, 2617, 2653, 2681, 2707, 2781, 2783, 3001, 3334, 3797, 4046, 4052, 4181, 4195, 4214, 4243, 4252, 4270, 4271, 4275, 4374, 4389, 4390, 4397, 4422, 4443, 4512, 4514, 4529, 4534, 4538, 4543, 4555, 4567, 4654, 4660, 4666, 4672, 4674, 4676, 4679, 4697, 4699, 4701, 5390, 6273, 6337, 6369, 6433 |
| docs/handoffs/FUTURE_ROSTER20_V5.md:15 | 15 |
| docs/handoffs/GS-006_CONCEPT_REVIEW_HANDOFF.md:262 | 262 |
| docs/handoffs/GS-012_CHARACTER_MOVEMENT.md:603 | 603 |
| docs/handoffs/GS-015_ROOM_DESIGN.md:94 | 94, 710, 717, 728, 763, 776, 820, 837, 868, 936 |
| docs/handoffs/GS-020_ULTRASOUND_FIRST_IMAGING.md:7 | 7 |
| docs/handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md:87 | 87 |
| docs/handoffs/GS-025_CHARACTER_LAYERING_PATHING.md:211 | 211, 257 |
| docs/handoffs/GS-028_AUTONOMOUS_CONCEPT_PRODUCTION.md:15 | 15 |
| docs/handoffs/GS-034_DIAGNOSTIC_TIMING.md:103 | 103, 107, 109 |
| docs/handoffs/GS-035_PATIENT_AVAILABILITY.md:29 | 29, 105, 107 |
| docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md:105 | 105, 107, 127 |
| docs/playtests/2026-09-10-owner-playthrough.md:47 | 47, 385, 423, 430, 467 |
| docs/project-management/GS-025_CHARACTER_LAYERING_PATHING.md:203 | 203 |
| docs/project-management/GS-028_AUTONOMOUS_CONCEPT_PRODUCTION.md:15 | 15 |
| docs/project-management/PROJECT_BOARD.md:15 | 15, 70, 370, 554 |
| docs/project-management/PROJECT_INVENTORY_2026-09-07.md:68 | 68, 71 |
| tools/character-mapping/app-gapfill-v6e/HANDOFF.md:108 | 108 |
| tools/character-mapping/app-gapfill-v6e/README.md:48 | 48 |
| tools/character-mapping/gs026-movement-alternatives/README.md:5 | 5 |
| tools/character-mapping/patient-demographics20-v4/README.md:25 | 25 |
| tools/character-mapping/patient-gapfill-v6a/HANDOFF.md:125 | 125 |
| tools/character-mapping/patient-gapfill-v6a/README.md:169 | 169, 171 |
| tools/character-mapping/patient-gapfill-v6b/HANDOFF.md:161 | 161 |
| tools/character-mapping/patient-gapfill-v6b/README.md:94 | 94 |
| tools/character-mapping/staff-gapfill-v6d/HANDOFF.md:215 | 215 |
| tools/character-mapping/staff-gapfill-v6d/README.md:45 | 45 |
| tools/room-design/level-3/laboratory/README.md:23 | 23 |
| tools/room-design/level-3/maintenance-workshop/README.md:31 | 31 |
| tools/room-design/level-3/pharmacy/README.md:26 | 26 |
| tools/room-design/level-4/CODEX_ART_HANDOFF.md:33 | 33 |
| tools/room-design/level-4/mri/ART_BRIEF.md:4 | 4, 47 |
| tools/room-design/level-4/mri/README.md:12 | 12 |
| tools/room-design/level-4/mri/proof/history/v5-last-ten-asset-candidate/README.md:21 | 21 |
| tools/room-design/level-4/pediatric-exam/ART_BRIEF.md:4 | 4 |
| tools/room-design/level-4/pediatric-waiting/ART_BRIEF.md:4 | 4 |
| tools/room-design/level-4/pediatric-waiting/proof/README.md:9 | 9 |
| tools/room-design/level-4/pediatric-waiting/proof/WORKER_HANDOFF.md:35 | 35 |
| tools/room-design/level-4/pediatric-waiting/proof/revisions/revision-1-provenance.md:86 | 86 |
| tools/room-design/level-4/wound-ostomy/ART_BRIEF.md:4 | 4, 12 |
| tools/room-design/level-4/wound-ostomy/proof/revisions/20261008-before-leg-rest-removal/execplan.md:42 | 42 |
| tools/room-design/level-4/wound-ostomy/proof/revisions/20261008-before-leg-rest-removal/proof/WORKER_HANDOFF.md:83 | 83 |
| tools/room-design/level-5/founders-office/history/4x4-base-20261008/proof/README.md:22 | 22 |
| tools/room-design/level-5/founders-office/proof/README.md:22 | 22 |
| tools/room-design/touchup-2026-10/README.md:1 | 1, 18 |

## Appendix C. Responsive/pointer collateral outside gameplay

These are authoring interfaces, artwork reviews or UI/movement proposals, not mobile game implementations. The same purpose applies to every row in each category: viewport metadata, media/container rules or pointer handlers make that particular review page usable/resizable. Their checks do not establish phone gameplay. They can remain untouched or be omitted from a mobile runtime bundle; they are not imported as another shell. This index also includes historical templates/versions still present in tools.

| Source:first matching line | All viewport/media/pointer matching lines | Purpose |
| --- | --- | --- |
| apps/clinical-context-workbench/client/index.html:5 | 5 | Workbench editor |
| apps/clinical-context-workbench/client/src/styles.css:917 | 917, 931 | Workbench editor |
| tools/character-mapping/app-gapfill-v6e/build-comparison.mjs:29 | 29 | Art/review tooling |
| tools/character-mapping/app-gapfill-v6e/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/app-gapfill-v6e/build-roster.mjs:429 | 429, 489, 499 | Art/review tooling |
| tools/character-mapping/app-gapfill-v6e/build-style-review.mjs:46 | 46 | Art/review tooling |
| tools/character-mapping/batch-02-preview/build-batch-02-preview.mjs:79 | 79 | Art/review tooling |
| tools/character-mapping/blue-glasses-v1/build-inline-review.mjs:94 | 94 | Art/review tooling |
| tools/character-mapping/four-character-preview/build-four-character-preview.mjs:41 | 41 | Art/review tooling |
| tools/character-mapping/future-roster20-v5/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/future-roster20-v5/build-roster.mjs:415 | 415, 475, 483 | Art/review tooling |
| tools/character-mapping/gs019-beanie-walk/gait-v1-review-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs019-blue-directions/build-south-corrected-review.mjs:17 | 17 | Art/review tooling |
| tools/character-mapping/gs019-blue-directions/directional-review-template.html:15 | 15 | Art/review tooling |
| tools/character-mapping/gs019-blue-west/gait-v6-review-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs019-blue-west/gait-v7-review-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs019-blue-west/review-template.html:14 | 14 | Art/review tooling |
| tools/character-mapping/gs019-navy-walk/navy-review-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs019-navy-walk/navy-review-v2-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs019-navy-walk/navy-review-v3-template.html:12 | 12 | Art/review tooling |
| tools/character-mapping/gs026-gait-correction/build-combined-review.mjs:66 | 66 | Art/review tooling |
| tools/character-mapping/gs026-gait-correction/build-pilot.mjs:120 | 120 | Art/review tooling |
| tools/character-mapping/gs026-movement-alternatives/build-hop-preview.mjs:23 | 23 | Art/review tooling |
| tools/character-mapping/gs026-movement-alternatives/build.mjs:31 | 31 | Art/review tooling |
| tools/character-mapping/gs026-seated-correction/build-overlay.mjs:148 | 148 | Art/review tooling |
| tools/character-mapping/gs026-uniform-walk-batch/build.mjs:201 | 201 | Art/review tooling |
| tools/character-mapping/layered-pilot/actions/build-inline-review.mjs:76 | 76 | Art/review tooling |
| tools/character-mapping/layered-pilot/brown-beanie-v1/build-inline-review.mjs:49 | 49 | Art/review tooling |
| tools/character-mapping/layered-pilot/build-v6-inline-review.mjs:320 | 320 | Art/review tooling |
| tools/character-mapping/layered-pilot/build-v7-inline-review.mjs:2 | 2 | Art/review tooling |
| tools/character-mapping/layered-pilot/build-v8-inline-review.mjs:2 | 2 | Art/review tooling |
| tools/character-mapping/layered-pilot/directional/build-inline-review.mjs:83 | 83 | Art/review tooling |
| tools/character-mapping/layered-pilot/gray-braid/build-inline-review.mjs:56 | 56 | Art/review tooling |
| tools/character-mapping/layered-pilot/gray-overshirt/build-inline-review.mjs:56 | 56 | Art/review tooling |
| tools/character-mapping/layered-pilot/gray-overshirt-v2/build-inline-review.mjs:31 | 31 | Art/review tooling |
| tools/character-mapping/level3-and-radiologists-20-v1/build-review.mjs:205 | 205 | Art/review tooling |
| tools/character-mapping/navy-vest-v1/build-inline-review.mjs:94 | 94 | Art/review tooling |
| tools/character-mapping/patient-demographics20-v4/build-placement-qa.mjs:307 | 307 | Art/review tooling |
| tools/character-mapping/patient-demographics20-v4/build-roster.mjs:307 | 307, 366, 372 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6a/build-comparison.mjs:43 | 43, 50 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6a/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6a/build-roster.mjs:418 | 418, 478, 486 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6b/build-all-catalog-comparison.mjs:56 | 56 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6b/build-comparison.mjs:43 | 43, 50 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6b/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6b/build-roster.mjs:418 | 418, 478, 486 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6c/build-all-catalog-comparison.mjs:56 | 56 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6c/build-comparison.mjs:43 | 43, 50 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6c/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/patient-gapfill-v6c/build-roster.mjs:418 | 418, 478, 486 | Art/review tooling |
| tools/character-mapping/patient-women-20-v3/build-roster.mjs:404 | 404 | Art/review tooling |
| tools/character-mapping/retained-art-proof/build.mjs:118 | 118, 119 | Art/review tooling |
| tools/character-mapping/retained-donor-merge/build-two-character-eight-east.mjs:363 | 363 | Art/review tooling |
| tools/character-mapping/retained-donor-merge/build.mjs:63 | 63 | Art/review tooling |
| tools/character-mapping/staff-gapfill-v6d/build-comparison.mjs:29 | 29 | Art/review tooling |
| tools/character-mapping/staff-gapfill-v6d/build-placement-qa.mjs:308 | 308 | Art/review tooling |
| tools/character-mapping/staff-gapfill-v6d/build-roster.mjs:433 | 433, 493, 503 | Art/review tooling |
| tools/character-mapping/staff-gapfill-v6d/build-style-review.mjs:32 | 32 | Art/review tooling |
| tools/character-mapping/surface-fitting/build-raster-review.mjs:88 | 88 | Art/review tooling |
| tools/character-mapping/surface-fitting/build-review.mjs:78 | 78 | Art/review tooling |
| tools/character-mapping/walk-rollback/build-walk-rollback.mjs:30 | 30 | Art/review tooling |
| tools/character-mapping/whole-body-static-v1/build-review.mjs:18 | 18 | Art/review tooling |
| tools/room-design/bathroom-layout/evidence/bathroom-layout-host.html:5 | 5, 929, 994, 1327, 1389, 1401 | Art/review tooling |
| tools/room-design/character-fit-review/evidence/room-character-fit-host.html:5 | 5, 933, 998, 1346, 1546, 1608, 1620 | Art/review tooling |
| tools/room-design/character-fit-review/room-character-fit-review.html:18 | 18 | Art/review tooling |
| tools/room-design/coffee-kiosk-layout/coffee-kiosk-layout.html:3 | 3 | Art/review tooling |
| tools/room-design/coffee-kiosk-layout/evidence/coffee-host.html:5 | 5, 933, 998, 1331, 1549, 1611, 1623 | Art/review tooling |
| tools/room-design/coffee-kiosk-layout/template.html:3 | 3 | Art/review tooling |
| tools/room-design/combined-layout/evidence/combined-layout-host.html:5 | 5, 929, 994, 1241, 1303, 1315 | Art/review tooling |
| tools/room-design/ct-layout/ct-layout.html:1 | 1 | Art/review tooling |
| tools/room-design/ct-layout/ct-layout.template.html:1 | 1 | Art/review tooling |
| tools/room-design/ct-layout/evidence/ct-host-wrapper.html:5 | 5, 929, 994, 1038, 1258, 1320, 1332 | Art/review tooling |
| tools/room-design/endoscopy-layout/evidence/endoscopy-host.html:5 | 5, 933, 998, 1576, 1638, 1650 | Art/review tooling |
| tools/room-design/endoscopy-scale-comparison/endoscopy-scale-comparison.html:3 | 3 | Art/review tooling |
| tools/room-design/endoscopy-scale-comparison/evidence/2026-09-22-pre-dark-refresh/comparison-host.html:5 | 5, 929, 994, 1040, 1245, 1307, 1319 | Art/review tooling |
| tools/room-design/endoscopy-scale-comparison/evidence/2026-09-22-pre-dark-refresh/endoscopy-scale-comparison.html:3 | 3 | Art/review tooling |
| tools/room-design/endoscopy-scale-comparison/evidence/comparison-host.html:5 | 5, 929, 994, 1040, 1245, 1307, 1319 | Art/review tooling |
| tools/room-design/endoscopy-scale-comparison/template.html:3 | 3 | Art/review tooling |
| tools/room-design/evs-layout/evidence/evs-layout-host.html:5 | 5, 929, 994, 1275, 1337, 1349 | Art/review tooling |
| tools/room-design/examination-layout/evidence/examination-layout-host.html:5 | 5, 929, 994, 1303, 1365, 1377 | Art/review tooling |
| tools/room-design/front-desk-layout/evidence/front-desk-layout-host.html:5 | 5, 929, 994, 1044, 1342, 1404, 1416 | Art/review tooling |
| tools/room-design/front-desk-layout/evidence/front-desk-layout-rendered.html:5 | 5, 929, 994, 1044, 1336, 1398, 1410 | Art/review tooling |
| tools/room-design/front-desk-layout/evidence/parent-host.html:5 | 5, 929, 994, 1044, 1279, 1341, 1353 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-prepaint-v1.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v1.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v2.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v3.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v4.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v5.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v6.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v7.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v8.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout-v9.html:7 | 7 | Art/review tooling |
| tools/room-design/front-desk-layout/front-desk-layout.html:7 | 7 | Art/review tooling |
| tools/room-design/furniture-revision-2026-09-22/ct-candidate.html:1 | 1 | Art/review tooling |
| tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html:7 | 7 | Art/review tooling |
| tools/room-design/hallway-layout/evidence/hallway-layout-host.html:5 | 5, 929, 994, 1255, 1317, 1329 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/ambulatory-or-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/history/4x4-v2/ambulatory-or-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/history/4x4-v2/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/history/6x6-v1/ambulatory-or-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/history/6x6-v1/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/ambulatory-or/proof/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/history/northwall-v1/laboratory-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/history/northwall-v1/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/history/pre-front-desk-height-2026-10-03/laboratory-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/history/pre-front-desk-height-2026-10-03/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/laboratory-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/laboratory/proof/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/maintenance-workshop/proof/history/pre-concrete-floor-2026-10-03/maintenance-workshop-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/maintenance-workshop/proof/history/pre-concrete-floor-2026-10-03/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/maintenance-workshop/proof/maintenance-workshop-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/maintenance-workshop/proof/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/pharmacy/proof/history/pre-front-desk-height-2026-10-03/pharmacy-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/pharmacy/proof/history/pre-front-desk-height-2026-10-03/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/pharmacy/proof/pharmacy-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/pharmacy/proof/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/history/pre-seven-seat-2026-10-03/staff-break-room-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/history/pre-seven-seat-2026-10-03/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/history/pre-unique-table-2026-10-03/staff-break-room-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/history/pre-unique-table-2026-10-03/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/staff-break-room-proof.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/staff-break-room/proof/template.html:17 | 17 | Art/review tooling |
| tools/room-design/level-3/surgeons-office/proof/history/pre-compact-2026-10-03/surgeons-office-proof.html:3 | 3 | Art/review tooling |
| tools/room-design/level-3/surgeons-office/proof/history/pre-compact-2026-10-03/template.html:3 | 3 | Art/review tooling |
| tools/room-design/level-3/surgeons-office/proof/surgeons-office-proof.html:3 | 3 | Art/review tooling |
| tools/room-design/level-3/surgeons-office/proof/template.html:3 | 3 | Art/review tooling |
| tools/room-design/level-3/vending/proof/template.html:3 | 3 | Art/review tooling |
| tools/room-design/level-3/vending/proof/vending-proof.html:3 | 3 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v1-preliminary/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v2-canvas-bottom-registration/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v3-ground-registration-prior-sources/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v4-revised-sources-before-uniform-fit/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v5-last-ten-asset-candidate/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/history/v6-west-tech-seated-patient/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/mri/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/pediatric-exam/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/pediatric-waiting/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/radiology-reading/proof/radiology-reading-proof.html:49 | 49 | Art/review tooling |
| tools/room-design/level-4/radiology-reading/proof/template.html:49 | 49 | Art/review tooling |
| tools/room-design/level-4/wound-ostomy/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-4/wound-ostomy/proof/revisions/20261008-before-leg-rest-removal/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-5/founders-office/history/4x4-base-20261008/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/level-5/founders-office/proof/index.html:4 | 4, 7 | Art/review tooling |
| tools/room-design/minor-procedure-layout/evidence/minor-procedure-layout-host.html:5 | 5, 929, 994, 1277, 1339, 1351 | Art/review tooling |
| tools/room-design/phlebotomy-layout/evidence/phlebotomy-host.html:5 | 5, 929, 994, 1290, 1352, 1364 | Art/review tooling |
| tools/room-design/phlebotomy-layout/evidence/phlebotomy-layout-host.html:5 | 5, 929, 994, 1290, 1352, 1364 | Art/review tooling |
| tools/room-design/proportion-review/proportion-review.html:21 | 21 | Art/review tooling |
| tools/room-design/proportion-review/template.html:21 | 21 | Art/review tooling |
| tools/room-design/recovery-layout/evidence/recovery-host.html:5 | 5, 933, 998, 1331, 1565, 1627, 1639 | Art/review tooling |
| tools/room-design/recovery-layout/recovery-layout.html:3 | 3 | Art/review tooling |
| tools/room-design/recovery-layout/template.html:3 | 3 | Art/review tooling |
| tools/room-design/telehealth-layout/evidence/telehealth-host.html:5 | 5, 933, 998, 1331, 1548, 1610, 1622 | Art/review tooling |
| tools/room-design/telehealth-layout/telehealth-layout.html:3 | 3 | Art/review tooling |
| tools/room-design/telehealth-layout/template.html:3 | 3 | Art/review tooling |
| tools/room-design/touchup-2026-10/lab/touchup-lab.html:5 | 5, 15, 19 | Art/review tooling |
| tools/room-design/training-layout/evidence/training-host.html:5 | 5, 933, 998, 1331, 1552, 1614, 1626 | Art/review tooling |
| tools/room-design/training-layout/template.html:3 | 3 | Art/review tooling |
| tools/room-design/training-layout/training-layout.html:3 | 3 | Art/review tooling |
| tools/room-design/ultrasound-layout/evidence/ultrasound-layout-host.html:5 | 5, 929, 994, 1277, 1339, 1351 | Art/review tooling |
| tools/room-design/waiting-layout/evidence/waiting-layout-host.html:5 | 5, 929, 994, 1040, 1283, 1345, 1357 | Art/review tooling |
| tools/room-design/waiting-layout/waiting-layout-prepaint-v1.html:3 | 3 | Art/review tooling |
| tools/room-design/waiting-layout/waiting-layout.html:3 | 3 | Art/review tooling |
| tools/room-design/waiting-layout/waiting-layout.template.html:3 | 3 | Art/review tooling |
| tools/room-design/xray-layout/evidence/xray-layout-host.html:5 | 5, 929, 994, 1276, 1338, 1350 | Art/review tooling |
| docs/design/alerts-events-revamp.html:37 | 37, 52, 56, 128 | UI proposal mockup |
| docs/features/character-movement/patient-01-fitted-walk.html:27 | 27 | Movement preview |
| docs/features/character-movement/patient-01-north-south-walk.html:32 | 32 | Movement preview |
| docs/features/character-movement/side-walk-preview.html:23 | 23 | Movement preview |

## Appendix D. Artifact copies and validation records

Direct responsive review HTML artifacts are indexed below. Checkpoint recovery/runtime-backup/source-baseline copies duplicate earlier source/tools and are excluded from the active implementation count; examples are artifacts/checkpoints/patient-chart-redesign-20261007/files/apps/player/src/ui/chartSheet.css:768 and artifacts/checkpoints/manager-accepted-20261009/recovery/bases/checkpoint3/apps/player/src/styles/global.css:7183. No second executable mobile architecture was found there. Generated art browser-validation JSON contains viewport/screenshot result records, not game controls (for example artifacts/character-statics/patient-women-20-v3/validation/gallery-layout-results.json:14). Source-image prompt JSON, art manifests and incidental occurrences of the word mobile/touch are not PWA manifests or phone app code.

| Artifact:first matching line | Responsive/pointer matching lines |
| --- | --- |
| artifacts/character-movement/blue-glasses-v1/review/host-wrapper.html:5 | 5, 929, 994, 1038, 1221, 1283, 1295 |
| artifacts/character-movement/gs019-beanie-walk/west-candidate-v1/review/brown-beanie-walk-review.html:12 | 12 |
| artifacts/character-movement/gs019-blue-directions/review/.directional-review-validation.html:15 | 15 |
| artifacts/character-movement/gs019-blue-directions/review/blue-directional-walk-review.html:15 | 15 |
| artifacts/character-movement/gs019-blue-directions/south-corrected-v2/blue-south-corrected-v2-review.html:2 | 2 |
| artifacts/character-movement/gs019-blue-west/blue-west-motion-review.html:16 | 16 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v1/blue-west-whole-body-candidate-v1-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v2/blue-west-whole-body-candidate-v2-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v3/blue-west-whole-body-candidate-v3-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v4/blue-west-whole-body-candidate-v4-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5/blue-west-whole-body-candidate-v5-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v6/review/blue-walk-v6-review.html:12 | 12 |
| artifacts/character-movement/gs019-blue-west/whole-body-candidate-v7/review/blue-walk-v7-review.html:12 | 12 |
| artifacts/character-movement/gs019-blue-west/whole-body-v1/blue-west-whole-body-v1-review.html:16 | 16 |
| artifacts/character-movement/gs019-blue-west/whole-body-v3/blue-west-whole-body-v3-review.html:14 | 14 |
| artifacts/character-movement/gs019-blue-west/whole-body-v3-corrected/blue-west-whole-body-v3-corrected-review.html:14 | 14 |
| artifacts/character-movement/gs019-navy-walk/review/.navy-review-validation.html:12 | 12 |
| artifacts/character-movement/gs019-navy-walk/review/navy-walk-review.html:12 | 12 |
| artifacts/character-movement/gs019-navy-walk/review-v2/.navy-v2-review-validation.html:12 | 12 |
| artifacts/character-movement/gs019-navy-walk/review-v2/navy-walk-v2-review.html:12 | 12 |
| artifacts/character-movement/gs019-navy-walk/review-v3/.navy-v3-review-validation.html:12 | 12 |
| artifacts/character-movement/gs019-navy-walk/review-v3/navy-walk-v3-review.html:12 | 12 |
| artifacts/character-movement/gs026-gait-correction-pilot/east/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/north/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/patient.adult.032/east/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/patient.adult.032/north/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/patient.adult.032/south/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/patient.adult.032/west/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/retained.gray-braid/east/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/retained.gray-braid/north/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/retained.gray-braid/south/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/retained.gray-braid/west/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/south/review.html:1 | 1 |
| artifacts/character-movement/gs026-gait-correction-pilot/west/review.html:1 | 1 |
| artifacts/character-movement/gs026-movement-alternatives/hop-review.html:1 | 1 |
| artifacts/character-movement/gs026-movement-alternatives/review.html:1 | 1 |
| artifacts/character-movement/gs026-simple-walk-pilot/review.html:2 | 2, 4 |
| artifacts/character-movement/gs026-uniform-walk-batch-v1/review.html:1 | 1 |
| artifacts/character-movement/gs026-uniform-walk-batch-v2/review.html:1 | 1 |
| artifacts/character-movement/gs026-uniform-walk-batch-v3/review.html:1 | 1 |
| artifacts/character-movement/navy-vest-v1/review/host-wrapper.html:5 | 5, 929, 994, 1038, 1221, 1283, 1295 |
| artifacts/character-movement/retained-art-proof/rejected-v1/retained-art-proof.html:2 | 2, 3 |
| artifacts/character-movement/retained-art-proof/rejected-v2/retained-art-proof.html:2 | 2, 3 |
| artifacts/character-movement/retained-art-proof/retained-art-proof.html:2 | 2, 3 |
| artifacts/character-movement/retained-donor-merge/failed-v2/retained-donor-merge.html:1 | 1 |
| artifacts/character-movement/retained-donor-merge/two-character-eight-east-v1/two-character-eight-east.html:1 | 1 |
| artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2/two-character-eight-east.html:1 | 1 |
| artifacts/character-movement/still-comparison-v1/review.fragment.html:22 | 22 |
| artifacts/character-movement/still-comparison-v2/still-movement-comparison.html:22 | 22 |
| artifacts/character-movement/still-comparison-v3/game-speed-movement-comparison.html:18 | 18 |
| artifacts/character-movement/whole-body-static-v1/review/whole-body-static-review-host.html:5 | 5, 929, 994, 1038, 1221, 1283, 1295 |
| artifacts/character-statics/app-gapfill-v6e/comparison/001-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/002-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/003-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/004-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/005-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/006-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/007-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/008-all-same-role.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/all-catalog.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/index.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/comparison/roles.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/contact-review/index.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/review/index.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/review/manager/index.html:1 | 1 |
| artifacts/character-statics/app-gapfill-v6e/review/source-review.html:1 | 1 |
| artifacts/character-statics/future-roster20-v5/contact-review/index.html:1 | 1 |
| artifacts/character-statics/future-roster20-v5/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/future-roster20-v5/review/index.html:1 | 1 |
| artifacts/character-statics/future-roster20-v5/review/source-review.html:1 | 1 |
| artifacts/character-statics/gs026-seated-correction-v1/review.html:1 | 1 |
| artifacts/character-statics/level3-and-radiologists-20-v1/review/index.html:1 | 1 |
| artifacts/character-statics/patient-demographics20-v4/contact-review/index.html:1 | 1 |
| artifacts/character-statics/patient-demographics20-v4/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/patient-demographics20-v4/review/index.html:1 | 1 |
| artifacts/character-statics/patient-demographics20-v4/review/source-review.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/001-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/002-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/003-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/004-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/005-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/006-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/007-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/008-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/009-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/010-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/011-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/012-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/013-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/014-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/015-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/016-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/017-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/018-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/019-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/020-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/comparison/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/contact-review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6a/review/source-review.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/001-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/002-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/003-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/004-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/005-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/006-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/007-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/008-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/009-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/010-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/011-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/012-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/013-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/014-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/015-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/016-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/017-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/018-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/019-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/020-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/all-catalog.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/comparison/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/contact-review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6b/review/source-review.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/001-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/002-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/003-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/004-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/005-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/006-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/007-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/008-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/009-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/010-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/011-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/012-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/013-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/014-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/015-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/016-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/017-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/018-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/019-all-same-band.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/all-catalog.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/comparison/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/contact-review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/review/index.html:1 | 1 |
| artifacts/character-statics/patient-gapfill-v6c/review/source-review.html:1 | 1 |
| artifacts/character-statics/patient-women-20-v3/review/index.html:1 | 1 |
| artifacts/character-statics/pawn-concepts-v1/review.html:5 | 5 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/001-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/002-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/003-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/004-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/005-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/006-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/007-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/008-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/009-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/010-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/011-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/012-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/013-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/014-all-same-role.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/all-catalog.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/index.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/comparison/roles.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/contact-review/index.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/placement-qa/index.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/review/index.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/review/manager/index.html:1 | 1 |
| artifacts/character-statics/staff-gapfill-v6d/review/source-review.html:1 | 1 |

## Risks and open questions that matter most

1. **Construction intent:** choose phone pan/select/placement/door/hallway gestures with visible preview/cancel and adequate targets, while keeping all existing validity, cost, access and undo rules.
2. **Clock access while reading:** provide convenient Pause/Resume/Speed/navigation on the chart screen; opening a chart must retain the shared running-clock semantics.
3. **Startup and memory:** profile the 199 eager images, lazy texture retention, covered-map frame work and full-state build undo on representative low/mid-range Android and iPhone hardware. Set presentation budgets from measurements.
4. **Desktop isolation:** decide the shell-selection/manual-override boundary, tablet/landscape policy and CSS ownership. One shared session must survive rotation/resize without duplicate timers or lost UI/command state.
5. **Cross-device campaigns:** is phone play a separate local clinic initially, or does it require a separately planned import/sync milestone? Auth alone does not move saves; the IndexedDB work is not yet the live persistence path.
6. **Phone navigation and coaching:** select which panels are primary screens/drawers, preserve every desktop operation/reference, and remap tutorial/alert anchors so actions never point to hidden screens.
7. **Acceptance matrix:** define supported browsers, portrait/landscape, safe areas/browser chrome/virtual keyboard, real touch gestures, background/lock/resume and sustained performance. Existing Chromium geometry checks cover only part of this.
