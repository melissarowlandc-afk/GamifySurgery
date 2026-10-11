# Mobile version — ExecPlan (2026-10-09)

Design: [docs/design/mobile-version-design-20261009.md](../design/mobile-version-design-20261009.md). Discovery: [docs/design/mobile-discovery-20261009.md](../design/mobile-discovery-20261009.md). Manager: Claude Code "GamifySurgery manager"; workers: Codex Sol max.

Hard rule for every milestone: desktop shell, desktop input, desktop asset loading and all game rules stay unchanged. Mobile-only behavior sits behind the shell selection / mobile flag. Existing desktop test expectations must not be edited to make a milestone pass; only the known thyroid failure is allowed in the player suite.

## Milestones

| ID | Scope | Lane | Depends |
| --- | --- | --- | --- |
| MB1 | Shell selection (coarse pointer + width, `?layout=`, per-device override), shared shell contract (exported props/action type from what App passes AppShell, no behavior change), lazy-loaded `MobileShell` chunk, top bar with clock controls, bottom tab bar, tab/sheet navigation framework, More menu, scoped mobile CSS, Clinic tab hosting the existing FacilityCanvas full-bleed with phone zoom buttons. Placeholder screens allowed for later tabs but each must already reach the existing desktop panel content in a sheet so nothing is unreachable. | `apps/player/src/mobile/**`, `App.tsx` (shell switch only), new shared contract file | — |
| MB2 | Map touch input behind a mobile flag: pan, tap-select, pinch, double-tap, nearest-target picking, inspector sheet data callbacks, phone camera preference key. | `FacilityScene.ts`/`FacilityCanvas.tsx` input seams (flagged), `apps/player/src/mobile/**` inspector | MB1 |
| MB3 | Patients tab + chart sheet (answer by choice ID, guarded close/file, wait estimates visible, clock over chart), Alerts tab (Needs you + feed + end-of-day), Goals sheet with Advance, emergency cash and advertising chips. | `apps/player/src/mobile/**` | MB1 (parallel with MB2) |
| MB4 | Manage tab: Employees/Services/Money phone screens with all actions. | `apps/player/src/mobile/**` | MB3 |
| MB5 | Build on phone: catalog sheet, ghost + confirm placement/move, doors, hallway paint+commit, room sheet (upgrade/sell/move/doors), undo, exit access check. | flagged scene build-input seams + `apps/player/src/mobile/**` | MB2 |
| MB6 | Tutorial anchor resolver for phone, alert navigation remap, Help/Campaigns/opening sequence on phone. | `apps/player/src/mobile/**`, narrow tutorial resolver seam | MB3–MB5 |
| MB7 | Mobile-only performance policy: skip drawing when map hidden, DPR cap, level-scoped atlas loading, fast-forward confirm; measurements. | flagged scene/asset seams | MB2, MB5 |
| MB8 | Integrated phone QA (Playwright touch emulation matrix in design doc), desktop non-regression proof, owner phone pathway notes. Manager browser checks. | tests/fixtures only | all |

## Progress

- 2026-10-09: discovery accepted; design written by manager; MB1 dispatched.
- 2026-10-09: MB1 ACCEPTED by manager. Playwright Chrome, touch emulation 390x844 DPR3: mobile shell renders, all five tabs and More reachable, no horizontal scroll, no sub-44px targets on Clinic, no page errors; desktop 1600x1000 has no .mobile-shell and requests no mobile chunk. Findings carried forward: tutorial coach docks over the tab bar and blocks tab taps (-> MB3); default phone framing shows mostly lawn with the clinic at bottom-left (-> MB2). MB2 and MB3 dispatched in parallel.
- 2026-10-09: MB2 + MB3 ACCEPTED by manager (with phone-only 40% pan padding and additive PatientTabView age/sex/complaint fields). Playwright touch 390x844: starter clinic centered at first entry and Recenter; CDP two-finger pinch zooms (231%->250% max); tutorial coach docks above the tab bar (566-783 vs tab bar 789) and tabs stay tappable, with 'Go to Patients' hint; patient card shows name, age/sex, complaint, attention mark; chart opens full screen, four full-width choices, Pause visible over chart, correct answer +20 XP and Resolve Completed Chart; no page errors. Polish queued for MB6/MB8: coach consumes ~25% of chart height (auto-collapse on chart), duplicate 'Satisfaction' line on patient card, bare '100%' in chart header. MB4 and MB5 dispatched in parallel.
- 2026-10-10: MB4 ACCEPTED by manager. Playwright touch 390x844 on the Level 4 APP fixture (&layout=phone): Manage pauses the clinic like desktop (Play shown, Done present); Employees/Services/Money segments render readable cards; APP hire disabled with 'Maximum 2 hired for the rooms you have built' plus capacity/look explanation; Services show setup with Build/Hire actions; Money shows net/hr, costs and advertising stepper; no horizontal scroll; no sub-44px targets; no page errors.
- 2026-10-10: MB5 ACCEPTED by manager. Playwright touch 390x844 with CDP touch events: catalog bottom sheet (Hallway/Doors tools, New/My Rooms, room cards with price/upkeep/count/unlock); choosing Examination Room shows a centered ghost (center y 334 vs canvas center 375, within one tile) tinted red with 'The room overlaps an existing room.'; one-finger ghost drag moved it 3x3 tiles with no purchase; green 'Ready to place'; double-tap on ✓ Place placed exactly one room and charged $160 once (rooms 1->2, $1,120->$960); door mode opened automatically; Done blocked with 'Examination Room needs a reachable door.' sheet; no page errors. Polish queued to MB6: auto-zoom/auto-pan so the ghost stays in view, hide the desktop on-canvas build hint text in mobile, expand Prototype tools inside its sheet. MB6 and MB7 dispatched in parallel.
- 2026-10-10: MB6 (+ approved App.tsx entry seam) and MB7 ACCEPTED; MB8 integrated QA by manager. Default-config: boundaries PASS, balance 129/129, domain 3764 + 2 skips, content 608/608, player 1681 + known thyroid failure, root build PASS. Desktop CSS index-C5tFl1dZ.css byte-identical to the pre-mobile baseline; MobileShell (100.8 kB JS / 33.1 kB CSS) and MobileEntryPresentation are separate lazy chunks; desktop 1600x1000 renders no .mobile-shell. Note: desktop dev server also requests 11 small flag-gated helper modules under src/mobile/{map,build,performance} imported by the shared scene/session (logic only, inactive when the mobile flag is off). Playwright touch matrix 390x844, 412x915, 360x740, 844x390 (left tab rail), 768x1024: entry + new campaign + all five tabs reachable, no horizontal scroll, no sub-44px buttons, no page errors; fresh Level 0 phone loads ~47-50 images / ~8.1-8.2 MB (desktop eager set 199 / 24.6 MB). Known tuning item for owner feedback: tutorial coach default height (~25% portrait, ~50% landscape; collapsible). Recommended mobile version ready for owner review.


## MB1: shell foundation

2026-10-09 — Codex Sol worker implementation and CLI validation complete.
Manager acceptance and Playwright touch/browser QA remain with the sole Claude
Code "GamifySurgery manager". No later mobile milestone is claimed complete.

### Implementation and files changed

Shell choice is presentation only. `App` retains exactly one
`usePrototypeSession` and one `createPrototypePlayerView`; the new
`PrototypeShell` selects the unchanged `AppShell` or lazy `MobileShell`.
Precedence is a valid `?layout=phone|desktop`, then a valid per-device preference,
then `(pointer: coarse)` with `innerWidth <= 1100`. Fine pointer defaults to
desktop at every width. Resize, orientation, pointer-media changes, preference
changes and browser history reconcile the presentation without remounting App's
session. The preference key is `gamify-surgery.presentation-layout.v1`, separate
from campaign and camera storage. The explicit More switch removes the QA query
override while preserving other query parameters, fragment and history state;
when storage is blocked, a query override preserves the selection in that tab.

The shared contract is a type-only `ComponentProps<typeof AppShell>` export.
It requires no change to AppShell or its props/behavior. Mobile CSS is imported
only by `mobile/MobileShell.tsx` and every selector is under `.mobile-shell`.

Mobile includes the persistent resource/clock bar, cash explanation from the
existing projected breakdown, shared Pause/Play and 1x/2x/4x actions/locks,
Clinic/Patients/Alerts/Manage/Build navigation and live badges, sheet stack with
browser Back and guarded closure, Goals progress chip, dire-only existing
patient/payroll/save Needs-you banner, quick advertising/emergency cash chips,
and existing full-bleed FacilityCanvas with large zoom buttons. The map remains
mounted beneath sheets. No FacilityScene input, asset policy or game rules were
changed.

Patients/chart, discussions, Alerts, Manage, Build, selected-room actions and
Goals reuse the existing panels and session callbacks. Mobile-local portal
adapters host the existing chart/build/campaign/room/restart renderers inside
the scoped container; desktop portal behavior is unchanged. Answer submission
passes the existing frozen choice ID/order; chart opening never invokes pause.
Build/Management entry and exit use the same session actions, including staged
mode transitions, prior pause restoration, undo, sale tokens and blocked exit.
The More menu reaches Help, Campaigns, Restart Campaign, Advertising, gated
Prototype tools, optional question review, layout switch and Save & Close with
the original retry/clear recovery flow. Help/restart/review temporary pauses are
cleaned up if the mobile shell unmounts. Browser Back closes nested dialogs
before the host sheet and does not bypass guarded session closure.

Safe-area CSS covers all four insets. Instead of editing index.html, MobileShell
temporarily adds `viewport-fit=cover` to the existing viewport meta while
mounted and restores the exact prior value on unmount. Thus initial desktop
rendering and the viewport after returning to desktop remain unchanged.
Scoped containers reflow inherited desktop panels and set minimum 44px controls;
map zoom buttons are 48px. Actual geometry awaits manager browser QA.

Owned application/source/test files (15; 14 new):

- `apps/player/src/App.tsx`
- `apps/player/src/PrototypeShell.tsx`
- `apps/player/src/shellContract.ts`
- `apps/player/src/shellPresentation.ts`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/MobileTopBar.tsx`
- `apps/player/src/mobile/MobileSheet.tsx`
- `apps/player/src/mobile/desktopPanelAdapters.tsx`
- `apps/player/src/mobile/navigation.ts`
- `apps/player/src/mobile/mobileShell.css`
- `apps/player/src/mobile/shellSelection.test.ts`
- `apps/player/src/mobile/shellContinuity.test.tsx`
- `apps/player/src/mobile/navigation.test.ts`
- `apps/player/src/mobile/MobileShell.test.tsx`
- `apps/player/src/mobile/testDom.ts`

Shared documentation changed by append only:
`docs/execplans/mobile-version-20261009.md` and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Owned code/tests and appended text use
UTF-8 without BOM and LF. Existing shared-document bytes are preserved.
Regenerable `apps/player/dist/` and ignored `.local-dev/mobile-mb1/` validation
evidence are not source changes for a checkpoint.

### Exact desktop preservation evidence

Before-images and SHA-256 baseline were captured before editing, without Git.
The baseline covers 764 existing paths: all 317 then-existing player src files,
75 game-domain src files, 30 balance-config src files, 337 clinical-content src
files, player index.html/config, AGENTS.md and both shared documents. The 761
protected existing paths remain byte-identical; only App and the two appended
documents differ. Existing desktop test expectations and Vite configuration
are unchanged.

App's complete logical diff is exactly these two substitutions (original lines
2 and 62); all supplied props, the session hook, memoized player projection,
opening/auth flow and tutorial clock multiplier are unchanged:

```diff
-import { AppShell } from "./AppShell";
+import { PrototypeShell } from "./PrototypeShell";
@@
-    <AppShell
+    <PrototypeShell
```

App's original CRLF was normalized to LF to follow the worker brief. There are
no other logical edits. `apps/player/index.html` has **zero byte changes**.
`AppShell.tsx`, `styles/global.css`, FacilityCanvas/FacilityScene, bitmap asset
manifest, session sources, clinical content and domain/balance sources retain
their baseline hashes. There is no desktop input or asset-loading modification.

The freshly built desktop stylesheet is byte-identical to a fresh pre-edit
build: `index-C5tFl1dZ.css`, 163,125 bytes, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
The HTML loads only the main entry and desktop CSS, with no mobile preload.
The main entry contains a dynamic MobileShell import but no mobile top/tab UI
markup; MobileShell JS and CSS are separate lazy assets. Desktop first render
in the App continuity test uses AppShell with **zero mobile module imports**.
The same test switches coarse pointer/width/orientation, observing one session
mount, one interval start and no cleanup until root unmount; ticks continue.
The shared selector adds 1,813 raw bytes to the main entry (8,210,617 before;
8,212,430 after); mobile UI/CSS are not downloaded on the desktop path.

Reproducible local evidence:
`.local-dev/mobile-mb1/baseline.json`, `before/`, `build-before.json`,
`desktop-preservation.json`, `app-diff.txt`, and `verify-mb1.mjs`.
The final verifier emits:

```text
PASS: 761 protected existing paths unchanged; App has exactly two logical substitutions; shared docs append-only.
PASS: desktop CSS byte-identical (163125 bytes, SHA-256 b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff).
PASS: mobile JS MobileShell-Dv0VeVol.js (25528 bytes) and CSS MobileShell-BjIn26iY.css (10441 bytes) are separate; no mobile HTML preload/UI in desktop chunk.
PASS: all 15 owned application/source/test files use UTF-8 without BOM and LF.
```

### Validation commands and exact output

Used the existing default workspace configurations and the **threads pool**,
with the existing EPERM preload, from repository root in PowerShell:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb1/verify-mb1.mjs
```

No test exclusions, alternate configs, timeout changes, expectation edits or
dependency installs. The focused tests use existing Vitest/React and a local
minimal DOM for actual React reconciliation, not a browser geometry emulator.
They cover shell precedence/storage failure, desktop lazy exclusion, session
continuity, six presentation widths (360, 390, 412, 768, 844, 1100), badges,
sheet/browser Back, blocked actions/mode exits, portal containment, chart
choice IDs/order, clock locks, staged setup navigation, Help and restart.

Focused player (`focused.log`), exit 0:

```text
 Test Files  4 passed (4)
      Tests  44 passed (44)
   Start at  22:20:09
   Duration  2.35s (transform 1.70s, setup 0ms, import 2.27s, tests 209ms, environment 0ms)
```

FULL player (`player.log`), exit 1, **only the known thyroid assertion**:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
Expected: "Off-site thyroid fine-needle aspiration"
 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52

 Test Files  1 failed | 164 passed (165)
      Tests  1 failed | 1288 passed (1289)
   Start at  22:23:00
   Duration  31.50s (transform 9.74s, setup 0ms, import 51.40s, tests 60.65s, environment 9ms)
```

The test and relevant runtime files are byte-identical to the pre-edit baseline.
Full failure text and npm exit reporting are preserved in `player.log`. No
thyroid expectation was changed or hidden.

FULL game-domain (`domain.log`), exit 0; the two existing skipped DEFECT-M9
reproducers remain skipped, with no domain changes:

```text
 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  22:06:34
   Duration  137.82s (transform 6.09s, setup 0ms, import 56.08s, tests 483.18s, environment 8ms)
```

Root typecheck (`typecheck.log`), exit 0, all seven workspaces:

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

Production player build (`build.log`), exit 0, separate mobile JS **and CSS**:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 637 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/MobileShell-BjIn26iY.css                                  10.44 kB │ gzip:     2.51 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-Dv0VeVol.js                                   25.52 kB │ gzip:     7.63 kB
dist/assets/index-CcPPc__Z.js                                      8,212.43 kB │ gzip: 1,813.44 kB
✓ built in 3.55s
```

The existing >500 kB main-chunk warning remains; mobile performance/atlas policy
belongs to MB7. Full captured output, including font assets and warnings, is in
the five named `.local-dev/mobile-mb1/*.log` files. PowerShell stderr conversion
adds `System.Management.Automation.RemoteException` separator records in some
logs; these are logging artifacts, not additional failing tests.

### Manager QA / next action

Inspect the actual owned diff and rerun/read the validation before accepting
MB1. Use the manager's disposable **QA origin**, currently 5184 in the latest
handoff, and a QA browser profile. Worker did not start or switch a server.
Use Playwright **touch emulation** for phone checks:

- `http://127.0.0.1:5184/?layout=phone&prototype-tools=1`
- `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&question-review=1`
- `http://127.0.0.1:5184/?layout=desktop` for the explicit desktop override.
- `http://127.0.0.1:5184/` for automatic selection after removing only the QA
  presentation key; do not clear owner campaign storage.

Confirm `location.origin`. QA at 5184, owner local 4173, remote GitHub Pages,
private HTTPS phone origin and different browser profiles have separate saves.

1. At 390x844, 412x915, 360x740, 844x390 landscape, 768x1024 and the 1100-width
   boundary, check every tab/sheet, top resources/clock, full-bleed map, zoom
   buttons, Goals and dire banner. Assert no horizontal scrolling/clipped
   actions and >=44px target rectangles across existing panel contents. Check
   safe areas on the physical phone; CLI tests do not prove these measurements.
2. Open Patients, a chart and a discussion. Verify no automatic pause, frozen
   answer order/IDs and testing wait estimates, answer/feedback, summary,
   guarded Back/close/file, and visible working pause/speed over the chart.
   Close stacked sheets via UI and browser Back; ensure only the top closes.
3. Enter/exit Manage and Build from both running and already-paused clinics.
   Check exact prior pause restoration and 1x/2x/4x control locks. Try an access-
   blocked Build exit and ensure the presentation cannot bypass it. Navigate a
   Goals/setup/alert action across Build/Manage and verify single mode entry.
4. Reach Employees/Services/Money; exercise hire, training, salary, fire,
   appointments and laboratory queue via existing panels. Check cash summary
   equals its existing explanation and Money values. Exercise Needs-you and
   feed actions, a rejected action/reason, Goals Advance, emergency cash and
   advertising. Existing tutorial coach is reachable; native phone anchors
   and full tutorial acceptance are MB6/MB8.
5. Reach Build catalog/owned rooms, room menu upgrade/move/sell (including sale
   confirmation), Doors, undo, cancellation/rotation and blocked-exit details.
   Catalog may be dismissed to see the map; current scene input is intentionally
   unchanged. Pinch/pan/tap picking and phone-confirmed building are MB2/MB5,
   not MB1 acceptance claims.
6. Reach More: Help topics and pause/unlock/restore, Campaigns create/switch,
   Restart dialog cancel/confirm (on disposable data), optional review queue,
   Advertising, Prototype tools, Phone/Desktop preference and Save & Close.
   Verify failed-save retry and staged clear confirmation without owner saves.
   Confirm nested-dialog Back cancels first and mode tabs/clock respect modal
   locks. Check layout unmount during Help/modal restores its temporary pause.
7. Fine-pointer desktop at 1600x1000 and narrow widths defaults to AppShell;
   inspect network: no MobileShell JS/CSS request before choosing phone. Verify
   desktop screenshot/input/assets unchanged. Check query-over-preference
   priority and pointer/resize/orientation switches while ticks advance: same
   campaign/state, no timer/session reset or duplicate interval. Confirm viewport
   meta restoration and no mobile selector affects AppShell after returning.
8. Record page errors and any geometry/navigation findings for this worker lane.
   Manager reruns the default pool/config checks in its own environment where
   permitted. Accept MB1, then dispatch the next bounded milestone separately.

No worker browser/physical-phone checks were run. MB2 gestures, phone camera
namespace, MB3/MB4 native panels, MB5 touch build controls, MB6 opening/tutorial
resolver and MB7 hidden-map/render/asset performance remain explicitly deferred.
The existing camera persistence is still shared until MB2; MB1 does not migrate
or change saves. No clinical statements/content/provenance were authored.

Owner opening pathways are unchanged: `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent profile; the approved existing
phone route remains `START_PRIVATE_GAME.cmd` ->
`https://melissadesktop.taile197db.ts.net/` (separate phone campaign storage).
The worker did not access owner storage, change launchers, run Git, install
dependencies, spawn agents, send messages, commit/push/deploy/publish or alter
unrelated work. **LOCAL ONLY**: manager owns acceptance and the scoped GitHub
checkpoint backup/reminder under the repository's "push to GitHub" rule.


## MB2: map touch input

2026-10-09 — Codex Sol worker implementation and CLI validation handoff.
The sole Claude Code "GamifySurgery manager" retains actual-diff review,
Playwright touch QA and milestone acceptance. **Exact starter-clinic vertical
centering is an unresolved constraint decision**, described below; it is not
claimed complete. No later mobile milestone is claimed complete.

### Implementation and camera constraint

Only the lazy MobileShell uses MobileFacilityMap, which passes the explicit
`mobileInput=true` FacilityCanvas/scene bridge flag. The flag-off scene binds
the original pointermove/down/up, wheel and gameout handlers verbatim. Original
pointer/click methods, 6px desktop drag threshold, camera layout, rendering,
routeMotion, Phaser configuration and asset preload behavior remain intact.

Phone camera state lives in MobileFacilityMap, outside the session's desktop
camera state. It uses `gamify-surgery.prototype.phone-facility-camera.v1:<encoded
campaign ID>`, independent of the unchanged
`gamify-surgery.prototype.facility-camera.v1:<encoded campaign ID>`. Storage
validation, schema, 250ms debounce and lifecycle flushing reuse the existing
camera preference implementation through a phone-key storage adapter. Phone
gestures, +/- and Recenter never invoke `onFacilityCameraChange` and never write
the desktop key. Switching campaign remounts only this map/camera presentation,
not App's session, timer or campaign. Blocked storage is tolerated.

First entry without a phone preference, and Recenter, calculate the bounding
box of all placed room/hallway footprints, include the north cutaway envelope
and 0.6-tile margin, and choose the largest legal fitting zoom (0.1–2.5). The
host is the visible MB3 workspace, so top/tab bars and the docked tutorial coach
are excluded from its measurements. Layout and focal zoom use the existing
camera transform, defaultCamera and facilityCameraBounds; saved cameras clamp
after resizing. Recenter recomputes current built geometry rather than lawn.

**Constraint requiring manager direction:** existing vertical bounds clamp
the rendered world bottom to at least the viewport bottom. The real starter
Front Desk is at y=28 through y=32 on a 32-row plot. In a tall portrait viewport,
a width-fitting, legal zoom cannot also put that south-edge room's bounding-box
center at the viewport center; doing so needs blank margin below the plot.
Likewise, rooms at a horizontal site edge can be constrained by the existing
horizontal bounds. This implementation aims at the built center and applies the
required existing clamps, so it centers where legal and otherwise gives the
closest legal framing. It greatly enlarges the real starter clinic, but does
not promise strict vertical centering at 390x844. The worker asked whether a
mobile-only viewport margin is permitted; no answer was received at handoff.
The brief explicitly requires the existing clamps, so they were preserved.
Manager next: resolve this constraint before accepting the strict centering
requirement; resume this worker if phone-only pan padding is authorized.

Normal phone input recognizes an 8 CSS-px movement threshold, taps <=250ms,
300ms/22px double-tap window, one-finger pan, and two-finger pinch with midpoint
translation. A single selection waits for the double-tap window so the first
tap cannot dispatch founder movement or open a sheet before a double-tap.
Pinch and double-tap preserve the focal world point subject to camera clamps.
Only mobile binds `addPointer(1)`, providing a second touch pointer. Native
touch/gesture prevention plus scoped touch-action/overscroll styles suppress
browser map zoom/scroll; cancel/outside events discard pending gestures.
Phaser's mutable prototype x/y getters are copied explicitly; meaningful
getter-based regressions failed before that correction and now pass.

In phone Build mode, a single touch is buffered until release, then replayed
through the existing placement, door, hallway and blank-space pan code. A
second finger discards that pending edit and owns pan/pinch; neither finger's
release edits the map. Placement preview still uses the existing code. Mouse
Build behavior in forced phone layout stays on the existing handlers. This
small mobile-only deferral is necessary to prevent the first finger placing
something before the second finger arrives. MB5 still owns the Build redesign.

Normal taps use nearest-within-22-CSS-px picking for rendered character
envelopes (including procedural fallback during bitmap loading), authorized
chair contacts, existing door segments and room footprints. Detailed targets
take precedence over the broad underlying room floor. Empty hallway/sidewalk
floor invokes the existing `onMoveFounder` command path and reports its result;
room inspection offers Walk here using the same guarded callback. Lawn remains
inert. Litter, water cooler and Front Desk seating remain reachable.

MobileShell receives structured character/role/canonical activity/patient/
desktop-equivalent praise availability, room/access/upgrade, chair, door, floor
and environmental selections. MobileInspectorSheet renders a live bottom
sheet, refreshing retained targets from the current projection. It exposes
Praise, patient chart, founder walk/seat/return-to-desk, environmental commands
and Room actions through existing session callbacks. Praise availability
matches desktop's active employee/action availability; the unchanged session
retains all execution guards. Room actions use the existing Build entry and
room menu, including its upgrade/move/doors/sale guards. Inspector participates
in the existing Back/Close navigation stack and resets on campaign/Build changes.
No phone hover tooltip path is invoked in normal mode.

### Files changed and shared lane

Owned source/test changes (19 files; 15 new):

- `apps/player/src/facility/FacilityCanvas.tsx`
- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/mobile/MobileShell.tsx` (small shared wiring)
- `apps/player/src/mobile/navigation.ts` (one inspector sheet ID)
- `apps/player/src/mobile/MobileInspectorSheet.tsx` (new)
- `apps/player/src/mobile/map/MobileFacilityMap.tsx` (new)
- `apps/player/src/mobile/map/MobileFacilityMap.test.tsx` (new)
- `apps/player/src/mobile/map/camera.ts` (new)
- `apps/player/src/mobile/map/camera.test.ts` (new)
- `apps/player/src/mobile/map/cameraPreference.ts` (new)
- `apps/player/src/mobile/map/cameraPreference.test.ts` (new)
- `apps/player/src/mobile/map/gestures.ts` (new)
- `apps/player/src/mobile/map/gestures.test.ts` (new)
- `apps/player/src/mobile/map/picking.ts` (new)
- `apps/player/src/mobile/map/picking.test.ts` (new)
- `apps/player/src/mobile/map/selection.ts` (new)
- `apps/player/src/mobile/map/sceneInput.test.ts` (new)
- `apps/player/src/mobile/map/inspector.test.tsx` (new)
- `apps/player/src/mobile/map/mobileMap.css` (new)

Both handoffs are append-only: this plan and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. New/appended text and the 19 owned
source/test files use UTF-8 without BOM and LF. Existing shared-document bytes
are preserved. Regenerable `apps/player/dist/` and ignored
`.local-dev/mobile-mb2/` evidence are not checkpoint source changes.

MB3 was concurrently writing phone Patients/Chart/Alerts/Goals/coach screens
and its mobile tests. MobileShell was re-read immediately before editing; its
already-landed MB3 imports, screens, workspace and coach changes were retained.
The immediate pre-wiring image is
`.local-dev/mobile-mb2/before-shell-wiring.tsx`. This worker did not edit
MobileShell.test.tsx or any other pre-existing test expectation. Subsequent MB3
test additions are reflected in the final integrated player test count. Shared
Shell changes should be reviewed with the MB3 lane as well as this handoff.

### Flag-off desktop evidence

The initial filesystem snapshot captured 778 current source/document paths
without Git. The verifier removes only the new mobile imports/bridge fields,
private mobile methods and flagged update block, and substitutes the original
input registration block for the new binding call. That reconstructs the
**entire** pre-edit FacilityScene exactly after LF normalization. Removing only
the optional flag/selection prop wiring likewise reconstructs the **entire**
pre-edit FacilityCanvas. The original registration block also remains an exact
substring of the current source. Thus all original input, layout/camera,
rendering, routing and asset-loading implementation is preserved, beyond the
flag-off callback regression tests.

763 protected existing paths are byte-unchanged, including routeMotion.ts,
App/AppShell/global CSS, all existing desktop tests, camera preference and
session sources, and domain/balance/clinical content. Shared mobile files and
append-only handoffs are tracked separately. Built desktop CSS is byte-identical
to MB1: 163,125 bytes, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
Phone JS/CSS remain lazy, separate MobileShell assets; the desktop entry gains
the small flagged input/helper code, without changing desktop asset requests.
No runtime desktop browser comparison is claimed by this worker.

Evidence, exact logs and actual scoped diff:
`.local-dev/mobile-mb2/baseline.json`, `before/`, `before-shell-wiring.tsx`,
`desktop-preservation.json`, `owned-files.json`, `build-preservation.json`,
`scoped.diff`, `focused.log`, `getter-regressions-before.log`, `full-player.log`,
`full-domain.log`, `typecheck.log`, and `build.log`. Reproduce preservation with
`node .local-dev/mobile-mb2/verify-desktop.mjs` and
`node .local-dev/mobile-mb2/capture-diff.mjs`. The diff's shared Shell image
starts immediately before MB2 wiring; it may include later concurrent MB3 edits.

### Exact validation commands and output

Used the existing **default project configurations**, **threads pool**, and
the specified existing EPERM preload, from repository root in PowerShell.
No installs, alternate configs, exclusions, timeout changes or existing
desktop expectation edits:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile/map src/facility/facilityCameraBounds.test.ts src/session/facilityCameraPreference.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb2/verify-desktop.mjs
node .local-dev/mobile-mb2/capture-diff.mjs
```

Focused output (exit 0):

```text
 Test Files  9 passed (9)
      Tests  91 passed (91)
   Start at  23:05:25
   Duration  2.60s (transform 5.48s, setup 0ms, import 8.61s, tests 114ms, environment 0ms)
```

Full player output (exit 1, known unchanged thyroid assertion only):

```text
 Test Files  1 failed | 175 passed (176)
      Tests  1 failed | 1405 passed (1406)
   Start at  23:07:24
   Duration  32.77s (transform 7.28s, setup 0ms, import 53.43s, tests 62.39s, environment 10ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer". Expected pending label to contain
"Off-site thyroid fine-needle aspiration"; received the existing generic
"The result is pending. Patient care and return are still in progress..."
label. Original test and implementation source hashes are unchanged.

Full game-domain output (exit 0; existing DEFECT-M9 skips):

```text
 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  22:53:47
   Duration  149.47s (transform 6.23s, setup 0ms, import 59.42s, tests 525.96s, environment 8ms)
```

Root typecheck output (exit 0; all seven workspaces):

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

Player build output (exit 0):

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 652 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileShell-nAwJgZwR.css                                  21.19 kB │ gzip:     4.18 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-B4LXp62K.js                                   55.85 kB │ gzip:    15.25 kB
dist/assets/index-C7eLUpdK.js                                      8,224.23 kB │ gzip: 1,816.64 kB

✓ built in 2.93s
```

The existing >500kB main-chunk warning remains; mobile performance/asset policy
is MB7. The combined MobileShell asset sizes include concurrent MB3 screens.

Preservation output (exit 0):

```text
PASS: removing only mobile seams reconstructs the entire original FacilityScene (LF); original registrations, pointer/click/wheel, layout, rendering and asset-loading code are exact.
PASS: removing only optional flag/selection bridge props reconstructs the entire original FacilityCanvas (LF); Phaser config and lifecycle are exact.
PASS: 763 protected existing paths are byte-unchanged, including routeMotion.ts, existing desktop tests, session/domain/balance/content, AppShell/global CSS and camera preferences.
Concurrent/shared changed baseline paths: apps/player/src/mobile/MobileShell.test.tsx, apps/player/src/mobile/MobileShell.tsx, apps/player/src/mobile/navigation.ts
```

### Manager QA steps (not run by this worker)

1. Use an already verified disposable QA server/origin, such as
   `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof=1`.
   Use Playwright Chrome with `viewport: { width: 390, height: 844 }`,
   `isMobile: true`, `hasTouch: true`, `deviceScaleFactor: 3`. Confirm
   `location.origin` is exactly `http://127.0.0.1:5184`; create fresh QA campaigns.
   Repeat 412x915, 360x740, 844x390 and 768x1024. Do not use owner storage.
2. Check first-entry framing with the tutorial both visible and disabled. The
   built clinic should fill the view at a legible zoom, centered where bounds
   permit; document the south-edge centering constraint above before acceptance.
   Pan/zoom, reload, then Recenter. Build rooms/hallways, pan away and Recenter
   again; the complete current built bounding box, not unbuilt lawn, drives fit.
   Rotate and check restored clamp behavior/visible map size.
3. Exercise short taps, <8px jitter, long holds, >8px drag starting on a person,
   and two nearby taps within 300ms. A single inspector appears after the
   double-tap window; drag/long hold/pinch must not select or move the founder.
   Double-tap should change zoom by +0.1 around the tap without an inspector or
   founder command. Check characters/chairs/room edges/doors just outside their
   exact envelope, including low zoom and neighboring people. Check live
   activity, patient chart, Praise, occupied/unavailable seats, return to Front
   Desk, room actions, permitted floor walk and inert lawn. Commands must retain
   their ordinary session guards; opening inspector/chart must not pause.
4. Playwright `touchscreen.tap` supplies only one touch; synthesize a real pinch
   with Chrome DevTools Protocol `Input.dispatchTouchEvent`, keeping both IDs
   present in every touchMove. Choose an uncovered canvas region; verify
   `document.elementFromPoint` is the canvas at the start contacts. Example:

   ```javascript
   const cdp = await page.context().newCDPSession(page);
   const box = await page.locator('[data-testid="facility-canvas"] canvas').boundingBox();
   const cx = box.x + box.width / 2;
   const cy = box.y + box.height * 0.55;
   const contact = (id, x, y) => ({ id, x, y, radiusX: 10, radiusY: 10, force: 1 });
   await cdp.send('Input.dispatchTouchEvent', {
     type: 'touchStart',
     touchPoints: [contact(1, cx - 50, cy), contact(2, cx + 50, cy)],
   });
   for (let step = 1; step <= 8; step++) {
     const halfDistance = 50 - step * 3; // pinch in; avoids the initial maximum zoom
     const panX = step * 2;
     const panY = step * 2;
     await cdp.send('Input.dispatchTouchEvent', {
       type: 'touchMove',
       touchPoints: [contact(1, cx + panX - halfDistance, cy + panY),
                     contact(2, cx + panX + halfDistance, cy + panY)],
     });
     await page.waitForTimeout(25);
   }
   await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
   await page.waitForTimeout(350); // camera debounce / no stray tap
   await cdp.detach();
   ```

   Repeat with increasing halfDistance for pinch out, and a constant distance
   with both contacts translated for two-finger pan. Compare world coordinates
   under the initial/final midpoint, allowing pixel snapping and legal clamps.
   Check `visualViewport.scale`, `scrollX` and `scrollY` remain unchanged. In
   dev gait-proof mode, the canvas host's existing `__facilityGame` gives the
   real scene/layout/bridge camera for read-only QA; mobile has mouse plus two
   touch pointers, desktop mouse plus one. No new gameplay/debug API was added.
5. In Build, choose a new room, a door tool and hallway tool in turn. Send the
   first touchStart with ID 1, wait ~50ms, then touchStart with IDs 1 and 2.
   Move both, release one, move/release the survivor. Camera may change; cash,
   rooms, doors, hallway cells, selected room and undo count must not change.
   Check touchcancel/outside release also discards pending edits. A single touch
   release still follows existing Build behavior; MB5 supplies future confirm
   controls. Test founder movement forbidden during Build.
6. Check per-campaign phone keys after the 250ms debounce and on reload/switch/
   immediate tab close. Seed/change a desktop camera using `?layout=desktop`,
   return to phone, then return to desktop: the desktop JSON entry must remain
   byte-identical during all phone gestures, controls and Recenter. Compare a
   second QA campaign independently. Save/Close and browser Back close inspector
   through the existing sheet stack without resetting session/time.
7. At fine-pointer desktop 1600x1000 with `?layout=desktop`, confirm no mobile
   shell/chunk, original wheel/pan/click/hover/Praise/founder movement and Build
   behavior, original camera restoration, and unchanged rendering. Record page
   errors, horizontal overflow and >=44px inspector/control geometry. Manager
   reruns default-pool/browser checks in its own environment. Physical Safari/
   Android touch, browser chrome and safe areas remain manager/owner checks.

No browser, server, owner storage or physical phone was accessed by this worker.
No clinical statements, evidence claims or content were authored. No source/
license review status, stable concept ID, frozen encounter/save, game rules or
campaign serialization changed. No Git, installs, agents, external messages,
commit/push/merge/release/deploy/publish or launcher changes.

Opening pathways are unchanged: owner desktop `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent profile; existing phone
`START_PRIVATE_GAME.cmd` -> `https://melissadesktop.taile197db.ts.net/`.
The disposable QA 5184 origin/profile, private phone HTTPS, remote Pages and
local desktop have separate campaign storage. **LOCAL ONLY**: manager retains
acceptance, the pending camera-bounds decision and any scoped GitHub checkpoint
reminder/backup. Preserve MB3's concurrent changes during integration.


### MB2 centering padding

2026-10-09 — manager authorized phone-only viewport padding. This resolves the
previous MB2 strict-centering constraint: first entry and Recenter center the
actual built bounds (rooms/hallways plus the north-wall envelope) exactly when
padding allows, within 0.5 CSS px of scene pixel snapping. The real south-edge
starter Front Desk passes portrait and landscape framing checks. Largest legal
fit zoom and the existing 0.6-tile margin remain; characters stay legible.

Only `mobileInput === true` extends each existing origin bound by 40% of the
visible map viewport on its axis. Framing, pinch/drag/double-tap, zoom controls,
saved phone restore, resize reconciliation and the scene all use those bounds.
The existing `#7e8476` scene/canvas background fills exposed space with lawn
color; no new art or rendering code. Desktop takes its original clamp branch.
Phone and desktop campaign keys remain separate. No MobileShell/navigation
edits in this follow-up; concurrent MB3 patient metadata and its one-line
MobileShell change were preserved (read-only diffs in the evidence directory).

Eight source/test files changed for this follow-up (one new test):

- `apps/player/src/facility/FacilityCanvas.tsx`
- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/facilityCameraBounds.ts`
- `apps/player/src/mobile/map/camera.test.ts`
- `apps/player/src/mobile/map/camera.ts`
- `apps/player/src/mobile/map/cameraPadding.test.ts`
- `apps/player/src/mobile/map/MobileFacilityMap.test.tsx`
- `apps/player/src/mobile/map/MobileFacilityMap.tsx`

New tests cover exact captured desktop bounds with omitted/false flags; true-only
40% padding at low/fractional/max zoom; fractional out-of-desktop phone pan;
actual scene agreement; centered real starter at five map sizes; pan/pinch
midpoint stability; and padded saved phone restoration without desktop writes.
The new padding tests first failed against the unpadded code (11 failures), then
passed. Existing desktop test expectations were not edited. Desktop evidence:

```text
PASS: removing only mobile seams reconstructs the entire original FacilityScene (LF); original input, rendering, asset loading and flag-off camera math are exact.
PASS: removing only mobile props and the true-only clamp branch reconstructs the entire original FacilityCanvas (LF); default clamp call, Phaser config and lifecycle are exact.
PASS: removing only the mobile helper, optional flag and true-only bounds branch reconstructs the entire original facilityCameraBounds (LF).
PASS: 760 protected existing paths are byte-unchanged, including routeMotion.ts and every existing desktop test.
Concurrent MB3 patient-metadata changes excluded from MB2 ownership: apps/player/src/session/viewModels.ts, apps/player/src/ui/types.ts.
PASS: 21 MB2 source/test files use UTF-8 without BOM and LF; 8 files changed for centering padding.
PASS: navigation.ts is byte-unchanged from the immediate pre-padding snapshot.
Concurrent shared mobile edits preserved without MB2 padding edits: apps/player/src/mobile/MobileShell.tsx.
PASS: desktop CSS byte-identical to MB1 (163125 bytes; b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff); phone JS/CSS remain separate.
```

Reran default project configs with threads and the existing EPERM preload; no
config, worker cap, exclusions or dependency changes. Exact commands:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile/map src/facility/facilityCameraBounds.test.ts src/session/facilityCameraPreference.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb2/padding/verify-desktop.mjs
node .local-dev/mobile-mb2/padding/capture.mjs
```

Focused exit 0; full player exit 1 solely for the known unchanged thyroid-label
assertion at `src/session/surgeryCenterServicePreviews.test.ts:85:52` (expected
`Off-site thyroid fine-needle aspiration`; received the generic pending label):

```text
 Test Files  10 passed (10)
      Tests  114 passed (114)
   Start at  23:22:35
   Duration  3.50s (transform 7.12s, setup 0ms, import 12.26s, tests 178ms, environment 1ms)

 Test Files  1 failed | 177 passed (178)
      Tests  1 failed | 1449 passed (1450)
   Start at  23:22:56
   Duration  35.97s (transform 12.63s, setup 0ms, import 59.66s, tests 69.32s, environment 10ms)
```

Root typecheck exit 0, all seven workspaces; exact output:

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

Player build exit 0; exact key output (full font/warning output in build.log):

```text
vite v8.1.5 building client environment for production...
transforming...✓ 652 modules transformed.
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/MobileShell-nAwJgZwR.css                                  21.19 kB │ gzip:     4.18 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-Co9zlIO6.js                                   55.70 kB │ gzip:    15.21 kB
dist/assets/index-BwohZgO8.js                                      8,224.94 kB │ gzip: 1,816.87 kB
✓ built in 4.38s
```

Existing main-chunk-size warning remains (MB7); this run also reported plugin
timings, with no build error. The full game-domain suite from the original MB2
handoff remains 137 passed / 1 skipped files, 3764 passed / 2 skipped tests;
game-domain code is byte-unchanged, and the padding follow-up did not rerun it.

Full logs, pre-padding images/hashes, captured original desktop outputs, exact
eight-file diff, concurrent read-only comparisons and preservation reports:
`.local-dev/mobile-mb2/padding/`. Prior MB2 logs were preserved.

Manager QA: use a disposable Playwright Chromium context with `isMobile: true`,
`hasTouch: true`, DPR 3, at 390x844 and the earlier matrix. Start a new campaign
and use Recenter on an older phone camera; compare built-bounds center to the
actual canvas rectangle between bars, and inspect padded edges for lawn color.
Drag past the former bottom clamp, refresh to check the separate phone camera,
then recenter. Synthesize pinch with the prior MB2 CDP recipe: send
`Input.dispatchTouchEvent` touchStart with two stable IDs; touchMove with both
IDs each frame, vary their distance and translate their midpoint; touchEnd with
an empty touchPoints array. Exercise pinch in/out and constant-distance pan in
Normal and Build, no edits from two fingers, and no browser zoom/scroll. Switch
to desktop and check original bounds/restoration. No worker browser QA claimed.
Opening pathways and storage origins are unchanged; local-only changes, with
manager acceptance and checkpoint backup still pending.

## MB3: patients, chart, alerts, goals

2026-10-09 — Sol worker. The authorized mobile UI implementation and CLI
validation are complete. **MB3 acceptance is pending a patient-list data seam
and manager browser QA.** Do not mark every acceptance requirement complete.
The sole Claude Code "GamifySurgery manager" retains scope decisions, actual
diff review, browser QA, integration and acceptance.

### Remaining data requirement / next action

`PatientTabView` currently contains name, folder, arrival-class subtitle, status,
satisfaction, wait, avatar and order key. It does **not** contain age, sex or
chief complaint. Facility patient rows and `onDescribeCharacter` do not supply
those facts either. The current chart projection supplies them only for the
open chart, and omits them for walked-out charts. Unopened patient cards thus
cannot meet the requested demographic/complaint requirement within the hard
`apps/player/src/mobile/**` lane alone. No facts were inferred from names,
artwork or browser storage.

An asynchronous scope question was raised and has not received an answer:
allow this worker the narrow projection extension in `ui/types.ts` and
`session/viewModels.ts`, or have the manager supply the fields. Those files
remain byte-unchanged. Recommended follow-up: add optional `ageLabel`,
`sexLabel`, `chiefComplaint` to `PatientTabView`, then populate them in
`toPatientTab` from each encounter's **frozen** `prototypeDemographics` and
chief complaint, using the same `normalizeFrozenClinicalText` call as
`createChartView`. Keep desktop rendering/expectations and all game rules
unchanged. Preserve missing values in legacy frozen records; do not invent
demographics or clinical prose. Rerun the relevant projection/native-screen
tests and full player suite after supplying the seam.

`MobilePatientTabView` already accepts those optional fields without a new
session or shared-shell contract. Cards use supplied fields, and use matching
open-chart fields where available. The list renders no fabricated substitutes.
The ordinary chart renders existing approved/projected header facts.

### Implementation / files changed

Phone-native Patients has large Waiting / Existing Patients / Resolved cards,
projected status and ETA, satisfaction/wait, attention markers, unchanged
availability guidance, newest-first resolved ordering, and employee discussion
cards. Cards call the existing patient/discussion open callbacks. A refused
open keeps the list visible; the session projection owns chart-sheet opening.

The native chart renders the named identity, presentation before the complete
question, vitals, authored updates/exhibits, frozen answer order and choice-ID
submission. All projected testing estimates **and their breakdowns** are
ordinary visible text, including disabled distractors and answered choices.
No number-key/hover hints appear. Feedback, selected/correct-answer tags and
choice rationales, current/past decisions, pending phases, outcome, rewards,
summary and source/claim/review metadata remain reachable. External clinical
links use `target="_blank" rel="noopener noreferrer"`; no content retrieval or
AI call occurs. Unfinished enactment feedback remains open/readable even when
the projection marks its step non-current. References remain gated by the
existing summary availability, so the UI does not reveal unseen diagnoses.

Continue/enact/resolve/file/return actions sit in a separate bottom flex row
inside the chart sheet. Their precedence and callbacks match desktop:
feedback acknowledgment first, guarded close when requested by the projection,
file next, pending close otherwise. Header Close/browser Back invoke the same
guarded close and wait for the session projection to remove the sheet. Tab
navigation also waits for guarded chart closure before entering another screen
or mode. Clock/Pause/Speed remain outside the chart and usable; opening a chart
does not pause. Discussions reuse `employeeDiscussionChartView` and the native
chart, retaining their answer/acknowledge/file/close callbacks.

Alerts displays the existing actionable Needs-you projection (save, patient,
payroll and real care-resource blocks) above the chronological, deduplicated
recent clinic feed. Commentary/tips are not promoted into Needs you. Needs-you
and action-bearing feed buttons pass the complete action to the existing
`onClinicAlertAction` / `runClinicAlertAction` path. Rejected actions keep the
screen and show the failure. Successful open-chart/discussion, place-room,
restore-access, show-goals and training intents route to phone sheets/tabs;
legacy navigation-only targets also route to phone surfaces. End-of-day rows
use a dark ink background and full-contrast white text/review copy.

Goals shows current requirement progress, visible setup checklists with Build /
Hire actions through the existing staged Build/Manage navigation, inline
optional-objective tooltip wording, the existing Advance callback when enabled,
and the unchanged Level complete state. Emergency cash and Advertising chips
open native sheets with the same eligibility/cooldown/coverage and level-step
controls. No financial or progression rule is recomputed.

The native tutorial coach occupies a bounded normal-flow row **inside** the
main workspace, after the map/sheet region and before the sibling tab bar. It
cannot cover either persistent bar. Its body scrolls, and expand/collapse does
not send a tutorial action. It keeps the projected step/body/note/flavor and
original action IDs and six-second readable-topic exposure. Collapse/hidden
guidance cancels exposure until it becomes readable again. Screen fallbacks
highlight the relevant tab and offer Go to Patients/Alerts/Manage/Build/Clinic
when the target is on another screen. Detailed control geometry/anchor
remapping remains MB6. The coach stays available on patient/chart/Goals screens
and is suppressed for Help and modal/reference flows.

Owned mobile source/tests (14):

- `apps/player/src/mobile/MobileShell.tsx` — small exact integration patches;
  re-read immediately before each patch; MB2 map/inspector integration preserved.
- `apps/player/src/mobile/MobileShell.test.tsx` — only mobile host expectations
  updated for native card/chart classes and already-visible setup checklists.
- `apps/player/src/mobile/MobilePatients.tsx` (new)
- `apps/player/src/mobile/MobileChart.tsx` (new)
- `apps/player/src/mobile/MobileAlerts.tsx` (new)
- `apps/player/src/mobile/MobileGoals.tsx` (new)
- `apps/player/src/mobile/MobileQuickControls.tsx` (new)
- `apps/player/src/mobile/MobileTutorialCoach.tsx` (new)
- `apps/player/src/mobile/mobileScreens.css` (new; every selector `.mobile-shell` scoped)
- `apps/player/src/mobile/screenTestUtils.tsx` (new; minimal React DOM test harness)
- `apps/player/src/mobile/MobileChart.test.tsx` (new)
- `apps/player/src/mobile/MobileScreens.test.tsx` (new)
- `apps/player/src/mobile/MobileTutorialCoach.test.tsx` (new)
- `apps/player/src/mobile/MobileScreenFlows.test.tsx` (new)

Shared docs appended only: this ExecPlan and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. No existing desktop component,
desktop test expectation, session, domain, balance or clinical-content file was
edited by MB3. MB2 owns its map/inspector/camera files, `navigation.ts` inspector
ID, and the flagged FacilityCanvas/FacilityScene seams. Those concurrent edits
were preserved; they are not MB3 changes. `MobileSheet.tsx`, `mobileShell.css`
and desktop adapters remain unchanged by MB3. Build output is regenerable.

### Desktop-untouched evidence

Before-images and a SHA-256 baseline of 780 existing source/config/document
paths were captured without Git. Final comparison proves **764 protected
pre-existing source/config paths are byte-unchanged**, including App,
PrototypeShell/shared contract, AppShell, global CSS, all existing non-mobile
player tests, desktop Patients/Chart/Goals/Alerts/Tutorial renderers,
`ui/types.ts`, all session sources (`viewModels`, close guards, clock and alert
actions), all domain/balance/clinical-content sources, index.html and Vite
configuration. The two changed facility paths belong to concurrent MB2 and are
explicitly excluded from MB3's protection claim. Shared docs preserve their
original byte prefixes. All 14 owned mobile files use UTF-8 without BOM and LF.

The freshly built **desktop stylesheet remains byte-identical** to the MB1
pre-mobile build: `index-C5tFl1dZ.css`, 163,125 bytes, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
Mobile JS/CSS remain separate lazy assets; no mobile HTML preload or native
phone UI is included in the main entry. Existing shell-continuity tests still
prove no mobile import on initial desktop render and one session/clock through
presentation switches. Byte-identical App/selector/desktop code means MB3
introduces no desktop behavior or game-rule change. Manager retains actual
desktop browser/network comparison, particularly for MB2's flagged seams.

Reproducible evidence: `.local-dev/mobile-mb3/baseline.json`, `before/`,
`preservation.json`, `evidence.mjs`, owned-source copies and logical diffs,
plus the named validation logs. Run `node .local-dev/mobile-mb3/evidence.mjs verify`.

```text
PASS: 764 protected pre-existing source/config paths unchanged; 2 concurrent MB2 facility paths excluded; docs append-only=true.
PASS: 14 MB3 mobile files UTF-8 without BOM and LF; hashes in preservation.json.
PASS: desktop CSS byte-identical (163125 bytes, SHA-256 b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff).
PASS: separate lazy mobile JS MobileShell-B4LXp62K.js and CSS MobileShell-nAwJgZwR.css; no mobile HTML preload or phone UI in main.
```

### Validation commands / exact output

Used the **existing default project configuration**, **threads pool**, default
four-worker cap and the existing preload; no exclusions, alternate config,
changed desktop expectations or installs. Commands from repo root, PowerShell:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/mobile/MobileShell.test.tsx src/mobile/MobileChart.test.tsx src/mobile/MobileScreens.test.tsx src/mobile/MobileTutorialCoach.test.tsx src/mobile/MobileScreenFlows.test.tsx src/mobile/navigation.test.ts src/mobile/shellContinuity.test.tsx src/mobile/shellSelection.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb3/evidence.mjs verify
```

Focused (`focused.log`), exit 0:

```text
 Test Files  8 passed (8)
      Tests  113 passed (113)
   Start at  23:01:34
   Duration  2.54s (transform 5.52s, setup 0ms, import 8.45s, tests 646ms, environment 0ms)
```

FULL player (`player.log`), exit 1, **only the unchanged known thyroid assertion**:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
Expected: "Off-site thyroid fine-needle aspiration"
 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52

 Test Files  1 failed | 175 passed (176)
      Tests  1 failed | 1405 passed (1406)
   Start at  23:12:38
   Duration  32.44s (transform 8.43s, setup 0ms, import 54.18s, tests 60.97s, environment 10ms)
```

Root typecheck (`typecheck.log`), exit 0, all seven workspaces:

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

Player production build (`build.log`), exit 0:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 652 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/MobileShell-nAwJgZwR.css                                  21.19 kB │ gzip:     4.18 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-B4LXp62K.js                                   55.85 kB │ gzip:    15.25 kB
dist/assets/index-C7eLUpdK.js                                      8,224.23 kB │ gzip: 1,816.64 kB
✓ built in 3.16s
```

The combined mobile assets include concurrent MB2. The full suite, root
typecheck and player build were rerun after MB2's later gesture/FacilityScene
changes; MB3's 14 owned files had no further edits after focused validation.
Existing main-chunk-size warning remains; performance is MB7. Full font/warning/failure output is in
the logs. PowerShell adds RemoteException formatting around native stderr;
final commands explicitly returned `$LASTEXITCODE` so warning formatting is
not confused with a failed build. Earlier focused/full runs caught MB2's
in-progress picking fixture at zoom 0.1; MB2 corrected it independently and it
passes in the final full run. No other worker's test or production code was
edited to resolve that failure. Historical intermediate logs remain available.

### Manager QA / acceptance steps

Use the manager's disposable QA origin/profile and touch emulation, currently
`http://127.0.0.1:5184/?layout=phone&prototype-tools=1` (add `&question-review=1`
for flags). **Confirm `location.origin`.** Worker did not start a server or
open a browser; minimal-DOM tests do not prove physical geometry or touch hit
testing. Test 390x844, 412x915, 360x740, 844x390 and 768x1024.

1. Supply/review the patient-row metadata seam above before accepting all
   patient-card requirements. Check new, existing, filed and walked-out patient
   identities/age/sex/complaint against frozen records. Confirm availability
   guidance, live statuses/ETAs, satisfaction/attention, resolved order and team
   discussions. Do not infer missing legacy facts.
2. With a fresh guided QA campaign, check expanded **and collapsed** coach
   rectangles: top bar bottom <= workspace/coach top, coach bottom < tab-bar
   top, and all five actual tab taps still work. Test while Patients, a chart,
   Alerts, Goals and Build are visible. Verify hidden-screen hints point at
   the relevant tab, original native tutorial actions still progress, and
   Pause/effective tutorial speed/timing remain unchanged. Check short
   landscape reading/scrolling and safe-area insets; full anchors remain MB6.
3. Open a chart from a card or alert while running. Facility time must keep
   advancing, and actual Pause/Resume and 1x/2x/4x taps must work over it.
   Inspect story then complete question, all full-width >=48px choice targets,
   **every testing distractor's visible estimate/breakdown**, frozen displayed
   order and exact choice-ID submission. Verify no keyboard/hover-only hint.
4. Answer correct/incorrect cases; check readable teaching/rationales and the
   pinned Enact Plan/Enact Corrected Plan/Continue path, pending care/return
   phases, rewards, summary/source/claim metadata and safe external links. Header
   close, browser Back, File/Resolve and a tab switch must use guards, acknowledge
   exactly once and never hide a rejected close. Check completed/legacy/read-only
   charts, walked-out charts and discussion Continue/final file callbacks.
5. Needs-you only contains actual actionable problems. Test a live save/payroll/
   patient/resource need and a rejected/stale action. Exercise all navigation
   intents: chart/discussion, Build/place-room, restore-access room sheet,
   Manage/training request, Goals; confirm no hidden desktop selector navigation
   or duplicate command. Check feed newest-first ordering and day-summary dark
   background/white text through new-row arrival and history scrolling.
6. Goals chip: verify requirement progress, both procedure setup checklists,
   Build/Hire mode-entry/exit pause restoration, inline optional wording,
   Advance eligibility and Level complete. Test emergency cooldown/eligibility/
   NP coverage and Advertising +/-/disabled limits through native sheets.
7. Check no horizontal page/sheet overflow, scroll access to long story,
   feedback, exhibits, sources and goals, and no pinned action underneath the
   coach/bars. All controls >=44px; choices >=48px. Watch page errors and
   verify MB2 map/inspector still works with the new workspace wrapper.
8. Fine-pointer desktop 1600x1000 and `?layout=desktop`: compare desktop
   screenshots, input and network with the accepted baseline; no mobile chunk
   before choosing phone. Read actual diffs/hashes and rerun default-pool/browser
   checks in the manager environment before accepting this milestone.

No new clinical statements, source records, diagnosis variants or approval
statuses were authored. No launcher/origin/profile/storage path changed. Owner
local remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the usual
persistent profile. Existing phone route remains `START_PRIVATE_GAME.cmd` ->
`https://melissadesktop.taile197db.ts.net/`; phone HTTPS, local 4173, QA 5184,
remote Pages and other profiles have separate saves. No owner storage access,
Git, installs, agents, external messages, commit/push/deploy/publish. **LOCAL
ONLY**: manager owns acceptance and the scoped "push to GitHub" backup reminder.


### MB3 patient-card fields

2026-10-09 — completed after the manager explicitly authorized the two additive
projection seams. **The patient-card data blocker above is resolved.** Manager
browser/touch QA and acceptance remain. No additional scope decision is needed.

`PatientTabView` now has optional `ageLabel`, `sexLabel`, `chiefComplaint`.
`toPatientTab` projects each encounter's frozen demographics and complaint for
new, existing/pending, ready-to-file, filed and walked-out patients. Missing
legacy facts stay undefined, including partially missing demographics and
complaints that the existing wording-repair map could otherwise supply.
Present complaints use the established formatter. Phone cards consume these
row fields directly, with no dependency on the open chart or inferred facts.
No frozen record, save, clinical content, game rule or desktop renderer changed.

Follow-up files: `ui/types.ts`, `session/viewModels.ts`,
`mobile/MobilePatients.tsx`, `mobile/MobileShell.tsx` (one removed chart prop),
`mobile/MobileScreens.test.tsx`, new `mobile/patientCardFields.test.tsx`.
All paths are under `apps/player/src/`. Existing desktop tests are unchanged.
The new test compares the **entire desktop PatientLists markup byte-for-byte**
with/without the additive fields, covering all six projected patient states,
selected/tutorial rows and compact resolved rows. It also checks frozen versus
live content, absent legacy facts, phone rendering/ID callbacks and no campaign
mutation. All 26 existing desktop UI test files are byte-unchanged and green.

Filesystem audit: 761 protected pre-existing source/config paths byte-unchanged;
the two authorized projection additions are the entire shared-file diff.
Concurrent MB2 FacilityCanvas/Scene/camera-bounds padding edits are preserved
and excluded from MB3 attribution. Desktop CSS remains byte-identical:
163125 bytes, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.

Default config, `--pool=threads`, default four-worker cap and the specified
preload were used, with no exclusions, installs or changed desktop expectations:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/mobile/MobileShell.test.tsx src/mobile/MobileChart.test.tsx src/mobile/MobileScreens.test.tsx src/mobile/MobileTutorialCoach.test.tsx src/mobile/MobileScreenFlows.test.tsx src/mobile/patientCardFields.test.tsx src/mobile/navigation.test.ts src/mobile/shellContinuity.test.tsx src/mobile/shellSelection.test.ts src/ui src/session/patientAvailabilityViewModel.test.ts src/session/clinicalText.test.ts src/session/pediatricChartsViewModels.test.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
```

Exact final summary output (focused exit 0; full player exit 1, only the known
unchanged thyroid assertion at `surgeryCenterServicePreviews.test.ts:85:52`):

```text
 Test Files  38 passed (38)
      Tests  312 passed (312)
   Start at  23:21:17
   Duration  5.13s (transform 5.52s, setup 0ms, import 15.07s, tests 1.70s, environment 2ms)

 Test Files  1 failed | 177 passed (178)
      Tests  1 failed | 1449 passed (1450)
   Start at  23:22:30
   Duration  38.13s (transform 9.05s, setup 0ms, import 68.09s, tests 65.31s, environment 12ms)
```

Typecheck exit 0, all seven workspaces; exact command output begins:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
```

Player build exit 0; exact relevant output:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 652 modules transformed.
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/MobileShell-nAwJgZwR.css                                  21.19 kB │ gzip:     4.18 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-Co9zlIO6.js                                   55.70 kB │ gzip:    15.21 kB
dist/assets/index-BwohZgO8.js                                      8,224.94 kB │ gzip: 1,816.87 kB
✓ built in 3.22s
```

Full exact output, before-images, logical diffs and source hashes:
`.local-dev/mobile-mb3/patient-card-fields/` (`focused.log`, `player.log`,
`typecheck.log`, `build.log`, `preservation.json`). Current-state verifier is
`python .local-dev/mobile-mb3/patient-card-fields/verify.py`; the earlier
mobile-only evidence reflects the pre-authorization milestone. Existing build
size/timing warnings remain. No Git, dependencies, browser/server or origin/
storage changes. Local only; manager owns QA/acceptance and checkpoint backup.
QA step 1 above now checks the supplied frozen card fields against saved new,
existing, filed, walked-out and legacy patients; the other MB3 QA steps remain.


## MB4: manage

2026-10-10 — Sol worker. Phone-native Employees / Services / Money are
implemented and CLI validation is complete. The sole Claude Code
"GamifySurgery manager" retains actual-diff review, browser/touch geometry QA
and acceptance. No later milestone is claimed complete.

### Implementation and files changed

The squeezed desktop ManagementPanel is replaced only on the lazy phone path.
Manage has a sticky three-way segmented control, a Clinic paused label and
Done. The shell's existing mode entry, close/Back, tab transition and setup
staging paths are retained; they invoke the same session entry/exit actions.
The real-session tests exercise both originally running and originally paused
clinics against desktop Done, then phone Done, header Close, Clinic tab and
browser Back. They verify exactly two SET_PAUSED receipts for running clinics,
zero for already-paused clinics, unchanged clock/speed, and no manual pause
substitution by the mobile screen. Opening/closing Manage preserves the
desktop pause-restoration contract.

Employees shows every role's count/capacity, hire price, guarded Hire button,
and ordinary visible capacity/art/money/setup blocked reasons. Named employee
cards use the same PixelAvatar look, expand individually or all together, and
show activity, the actual assigned home room, morale, salary with 44px steps,
training level/status/benefit, priced Train quote/confirmation and departure
note, Praise and the existing Fire confirmation/queued-training refund note.
Training-room/role guidance stays visible. Highlighted role/employee and alert
training requests open the matching card/quote without making a purchase.
Services Hire shortcuts always return to Employees, including repeated requests
for the same role. Current desktop has **no home-reassignment control or
session callback**: StaffPanel/ManagementPanel/AppShell/usePrototypeSession
were inspected. Thus home assignment is displayed from existing facility staff
IDs and owned-room labels, and no new reassignment command was invented.

Services shows every catalog line (earning, paused, setup needed and future)
with fee, stock/contribution where supplied, cadence, requirements and existing
Build/Hire setup actions. Global appointments On/Off and the contextual Turn on
send the same booleans as desktop. The lab queue status, guarded queue action
and visible disabled reason are retained. All active/queued work shows visitor,
state, fee and provider/team. Radiologist read totals and upkeep/quality/break
information remain reachable.

Money uses the unchanged management finance projection: actual six-hour income
window (or its projected early/since-opening label), true net per hour, income
by source, salaries/upkeep/advertising/stock/relief rows, cash/runway, opening
earned/cost/profit totals and recorded income by service line. Recent payments
become cards retaining all six desktop ledger columns, including time, visitor,
billed, stock and net. The existing cash explanation and native advertising
level controls use their original projections/callbacks. No economy numbers,
training prices/durations, staffing eligibility or service rules are computed
anew. The overview payroll/morale summaries match desktop presentation math.

Eleven owned mobile source/test files (ten new), all UTF-8 without BOM and LF:

- `apps/player/src/mobile/MobileShell.tsx` — only the Manage import and renderer.
- `apps/player/src/mobile/manage/MobileManage.tsx`
- `apps/player/src/mobile/manage/MobileEmployees.tsx`
- `apps/player/src/mobile/manage/MobileServices.tsx`
- `apps/player/src/mobile/manage/MobileMoney.tsx`
- `apps/player/src/mobile/manage/mobileManage.css`
- `apps/player/src/mobile/manage/testFixtures.ts`
- `apps/player/src/mobile/manage/MobileManage.test.tsx`
- `apps/player/src/mobile/manage/manageSessionFlows.test.tsx`
- `apps/player/src/mobile/manage/providerProjection.test.tsx`
- `apps/player/src/mobile/manage/qaManageFixture.test.tsx`

Two narrowly authorized additive projection files:

- `apps/player/src/ui/types.ts` — optional `ServiceIncomeOperationView.providerLabel`.
- `apps/player/src/session/viewModels.ts` — that label from current existing
  provider/reserved-team/serving-staff IDs, including outside readers. Missing
  legacy facts remain explicitly unavailable; visitors are never mistaken for
  providers. No reservation, provider choice, save or campaign mutation.

Shared docs append-only: this ExecPlan and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Generated player dist output and
ignored `.local-dev/mobile-mb4/` evidence are regenerable, not new runtime
sources. All Manage CSS selectors begin under `.mobile-shell`; cards and facts
use wrapping/minmax columns, every control is at least 44px, segments 48px,
salary steps 44px. There are no wide tables in the native screens.

### Desktop-untouched evidence and concurrency

An 811-path filesystem baseline/before-image set was captured without Git.
The preservation audit finds **762 protected existing paths byte-unchanged**,
including AppShell, desktop components/styles, all **161 existing non-mobile
player test files**, and every domain/balance/clinical-content source. No
desktop test expectation, desktop renderer, input or asset loader was edited
by MB4. Removing only the optional provider-label helper/properties reconstructs
the **entire original** `viewModels.ts` and `ui/types.ts` after LF normalization.
New regressions compare complete desktop Services, Money and Management markup
byte-for-byte with/without the label (appointments on and off), and check the
campaign input is unchanged by projection/rendering.

Desktop CSS remains byte-identical to MB1's pre-mobile build:
`index-C5tFl1dZ.css`, 163,125 bytes, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
Phone code/CSS remain separate lazy MobileShell assets; the existing shell
selection/session-continuity regressions still pass in the full suite.

MB5 concurrently changed its Build modules plus App.tsx, shellContract.ts,
usePrototypeSession.ts, FacilityCanvas/FacilityScene and the mobile scene-input
test. Those paths are excluded from MB4's unchanged-source claim and preserved;
they are **not MB4 edits**. The MobileShell imports/case were re-read and copied
immediately before the small exact Manage patch. MB5 subsequently retained that
patch while integrating Build. No MB5 file or existing mobile test expectation
was changed by MB4. The standalone `mb4-shell.diff` isolates exactly the import
and Manage case from the immediate pre-wiring image; `shared.diff` also records
concurrent changes for manager review. Interim typechecks caught MB5's
in-progress catalog and storage-test typing errors; MB5 corrected them without
MB4 edits, and the final root check passes.

Evidence and current-state reproduction:
`.local-dev/mobile-mb4/` (`baseline.json`, `before/`,
`before-shell-wiring.tsx`, `mb4-shell.diff`, `shared.diff`,
`preservation.json`, and the logs below).
Run `python .local-dev/mobile-mb4/audit.py verify`. Its exact output:

```text
PASS: removing only the optional provider label additions reconstructs the entire original viewModels.ts and ui/types.ts (LF).
PASS: 762 protected paths byte-unchanged; 161 existing non-mobile player tests unchanged; docs append-only.
PASS: 11 owned mobile files UTF-8 without BOM and LF.
```

### Validation commands and exact output

Used the **default project configurations**, **threads pool**, default four
worker cap and the specified preload. No exclusions, alternative config,
dependency installs, timeout increases or modified desktop expectations.
Commands from repo root in PowerShell:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/mobile/manage src/mobile/MobileShell.test.tsx src/mobile/MobileScreenFlows.test.tsx src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/level3ControlsViewModels.test.ts src/ui/ManagementPanel.test.tsx src/ui/StaffPanel.test.tsx src/ui/ServiceIncomePanel.test.tsx src/ui/MoneyPanel.test.tsx --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node tools/qa/level-four-rooms.mjs --check
python .local-dev/mobile-mb4/audit.py verify
```

The 36 new cases cover exact IDs/arguments for every Manage callback through
the full shell, Fire/Train confirmation versus cancellation, queued/max/active
training, hire and lab blocked reasons, salary/advertising bounds, real-session
pause parity, staged setup navigation, repeated Hire guidance, provider/legacy
projection, desktop markup identity, and all three screens at 360, 390, 412,
768, 844 and 1100 CSS-px presentation widths. The minimum-DOM width cases and
fluid/scoped-CSS checks are **not physical geometry measurements**.

Focused final (`focused-final.log`), exit 0:

```text
 Test Files  13 passed (13)
      Tests  140 passed (140)
   Start at  23:58:57
   Duration  4.70s (transform 8.11s, setup 0ms, import 14.99s, tests 1.72s, environment 1ms)
```

FULL player final (`player-final.log`), exit 1 **only for the unchanged known
thyroid pending-label assertion**, `surgeryCenterServicePreviews.test.ts:85:52`:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
Expected: "Off-site thyroid fine-needle aspiration"
 Test Files  1 failed | 184 passed (185)
      Tests  1 failed | 1513 passed (1514)
   Start at  00:01:01
   Duration  33.04s (transform 8.34s, setup 0ms, import 56.44s, tests 60.65s, environment 10ms)
```

Counts include MB5 tests that had landed before this run. No failure was hidden
or its expectation changed. The exact complete failure/command output remains
in the log. Earlier focused/full/build/typecheck runs are retained separately.

Root typecheck final (`typecheck-complete.log`), exit 0, all seven workspaces;
exact output:

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

Player build final (`build-final.log`), exit 0; exact main output:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 666 modules transformed.
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileShell-9cpU7J6O.css                                  29.63 kB │ gzip:     5.39 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-IxEXgTbv.js                                   91.26 kB │ gzip:    23.67 kB
dist/assets/index-DuciVRSu.js                                      8,232.27 kB │ gzip: 1,819.31 kB
✓ built in 2.96s
```

The existing >500kB main-chunk warning remains; mobile assets include concurrent
MB5. Full warnings/font output are captured in the log. PowerShell's native
stderr formatting adds RemoteException records; commands returned the actual
`$LASTEXITCODE`, and those formatting records do not imply another failure.

Existing Level 4 QA bootstrap transform (`qa-entry.log`), exit 0, without a
listener or browser storage; exact output:

```text
11:58:58 PM [vite] (client) [optimizer] scanning dependencies...
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

### Manager QA steps and next action

Actual Chrome **and** Edge launch attempts were blocked by `spawn EPERM` in
this worker sandbox; details: `browser-check.json`. No browser/physical-phone
geometry or screenshot PASS is claimed. The manager runs its browser/default
pool checks in its own environment before accepting MB4.

1. Start/reuse `node tools/qa/level-four-rooms.mjs` in the manager environment.
   Open **http://127.0.0.1:5184/level4-rooms-qa.html?apps=mri&layout=phone**
   in a disposable QA profile/context; confirm `location.origin` is exactly
   `http://127.0.0.1:5184`. The bootstrap preserves `layout=phone`, and its native
   Manage projection/rendering is covered by `qaManageFixture.test.tsx`.
   This fixture has real imaging-technician/radiologist hires, MRI/Reading/
   Training rooms, services and ample cash. Hire an additional Radiologist via
   Employees to obtain the tested several-staff state. Use Play outside Manage
   to generate active MRI/read work and receipts, then re-enter Manage.
   Optional further fixtures: `?apps=appointments&layout=phone`,
   `?apps=wound&layout=phone`, and `?state=l4almost&layout=phone`.
2. At 390x844, 360x740, 412x915, 844x390 landscape, 768x1024 and widths through
   1100, check all three sections, expanded employee cards and confirmations.
   Measure document/sheet scrollWidth <= clientWidth; measure every visible
   button >=44x44px; watch page errors. Verify readable rows, long names/reasons,
   safe areas and the sticky segments while scrolling to the last payment.
3. Employees: compare role count/capacity/price and home-room/look/activity to
   desktop. Exercise hire and capacity/no-money/art limits, salary +/- and its
   bounds, Praise, training quote/cost/departure/blocked confirmation, active/
   queued/max levels, Fire Cancel/Confirm and queued refund. Open an alert
   training request; it must expand/show the quote without buying. Try service
   Hire guidance twice for the same role; both must return to Employees.
4. Services: inspect every catalog line/status/fee/cadence and future/setup
   lines. Toggle global On/Off and contextual On; disabled prerequisites retain
   their ordinary reasons. Check actual active work's visitor, state and named
   provider/team, lab queue counts/Queue controls/full/unavailable reason,
   read totals, repair/quality/break details. Build setup must exit Manage,
   await session props, enter Build once and arm the same room definition.
5. Money: compare the projected six-hour actual net/income/costs to the desktop
   Money tab and HUD. Check salaries, upkeep, stock, advertising and relief;
   opening totals, recorded line totals, all six payment facts and cash
   explanation. Advertising +/- must send one adjacent level and respect
   projected bounds; no new economy rules. At an early clinic the existing
   early-window wording remains accurate.
6. From running and already-paused clinics, enter and leave Manage via Done,
   sheet header, another tab and browser Back; verify exact prior pause restore,
   same clock/speed and locked Pause/Speed during Manage. Check staged
   Manage/Build/chart navigation and MB5's guarded Build exit in integration.
   Tutorial/alert detailed anchoring remains the approved MB6 lane.
7. At desktop 1600x1000 with `?layout=desktop`, compare original Management,
   mouse input, screenshot and network; no phone chunk is requested. Inspect
   actual isolated MB4 diffs plus MB5 shared changes, rerun/read validation, then
   accept the milestone. Physical Safari/Android checks remain manager/owner QA.

No clinical content, source records, review statuses, frozen encounters, save
format, domain/balance rule, art, launcher or origin was changed by MB4. No Git,
installs, agents, external messages, server listener, owner storage, commit,
push, merge, deployment, release or publication. Owner local remains
`START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the usual persistent
profile. Phone remains `START_PRIVATE_GAME.cmd` ->
`https://melissadesktop.taile197db.ts.net/`. QA 5184, owner local 4173, private
phone HTTPS, remote Pages and other profiles have separate saves.
**LOCAL ONLY**: after review/acceptance, the manager owns the checkpoint reminder
to say **"push to GitHub"** and the scoped backup; this worker created no backup.


## MB5: build on phone

2026-10-10 — Sol worker implementation and required CLI validation complete.
Manager review, Playwright touch/geometry QA and acceptance remain. MB4's
concurrent native Manage import/case and optional provider/team projections
are preserved. No Git, installs, agents, external messages or browser/server
were used by this worker.

### Result and rules

Phone Build now has native New Rooms / My Rooms catalog cards with existing
approved art composites, footprint, construction price, upkeep, built/limit,
unlock level and existing unavailable reasons. My Rooms also shows current
tier, benefit, access and a route to the room sheet. The map's persistent
controls are Room catalog, Undo with count/label and Done. The measured controls
height reserves actual map space, so a new ghost is centered in the visible map.
The original phone camera preferences, 40% padding and bounds are unchanged.

Selecting a catalog room creates a snapped green/red footprint ghost; its
invalid reason comes from an isolated dry run of the existing PLACE_ROOM
command. Move initializes at the selected room's current spot and previews the
existing MOVE_ROOM command, excluding its own footprint. A one-finger ghost
drag preserves the finger's grab offset; two fingers pan/pinch and discard the
tentative drag. Every pointer path emits preview/selection intents only.
Nothing is placed on down/up. The enabled ✓ Place/Move button makes exactly
one existing session placeRoom call, guarded against a second activation
before rerender. New-room rotation offers only getApprovedPlacementOrientations;
Move has no Rotate because the existing MOVE_ROOM command changes position
only. Successful new-room placement arms the existing unified Doors tool.

Doors highlight each physical one-tile section once, including reciprocal
walls. Green/red/gold marks legal, illegal and selected sections. Picking uses
the existing rendered hit region and nearest-within-22-CSS-pixel behavior.
A tap only selects; the bottom ✓ button invokes the unchanged session
placeDoor/removeDoor command. Illegal sections retain the exact validator or
REMOVE_DOOR reason, including furniture and the immutable public entrance.

Hallway strokes use the original rasterizeGridLine and desktop's existing-hall
skip and stop-at-first-block behavior. Off-site pointer samples are ignored,
including leave/re-enter gestures, exactly as desktop gridPointAtPointer does.
The preview shows accepted green cells, a blocked red cell, total cost and the
reason the stroke stops. Confirmation builds the valid prefix; it does not
jump past an obstacle or an unaffordable cell. Cancel clears the entire preview
and keeps the hallway paint tool ready. No preview creates receipts, purchases,
undo snapshots or saves.

There is no existing multi-cell hallway domain command. The explicit phone
commitHallway action therefore calls the original placeRoom command sequentially
for the accepted cells, with a private, synchronous batching ref that defers
only intermediate persistence and history additions. The original before-state
is retained once, all per-cell rules/receipts/costs still execute, and the final
state is saved once. Undo restores the whole stroke. A failed final save keeps
the original save-failure notice and undo capability. The desktop path never
sets the ref: four desktop cells still produce four saves and four undo entries.

Tapping a built room opens its native status/Upgrade/Move/Doors/Sell sheet.
Upgrade tiers, prices and benefits come from existing room definitions and
buildModePresentation. Selling freezes the original salePreview confirmation
token and names, uses the existing confirmation/refund command, and preserves
stale-token rejection and undo. Done and tab switches invoke the existing exit
access check; a rejected Done opens the phone access sheet and remains paused
in Build. Successful exit restores the exact pre-Build pause state. Closing the
catalog closes that sheet; persistent Done owns the guarded exit.

### Files and preservation evidence

New files, all in `apps/player/src/mobile/build/`:

- `types.ts`, `buildSession.ts`, `doorSections.ts`, `mapInput.ts`,
  `useMobileBuild.ts` — preview types, real-rule dry runs, one-tile sections,
  command-free input and phone confirmation controller.
- `MobileBuildCatalog.tsx`, `MobileBuildRoom.tsx`, `MobileBuildControls.tsx`,
  `RoomThumbnail.tsx`, `mobileBuild.css` — native phone surfaces and existing art.
- `buildSession.test.ts`, `mapInput.test.ts`, `sceneBuild.test.ts`,
  `MobileBuild.test.tsx` — 43 new tests with reducer/scene/session parity.

Existing files changed by MB5:

- `apps/player/src/facility/FacilityScene.ts` — changes inside the already gated
  phone input lane, plus flagged preview drawing and the optional bridge type.
- `apps/player/src/facility/FacilityCanvas.tsx` — optional mobile Build bridge;
  mobileInput false discards it.
- `apps/player/src/session/usePrototypeSession.ts` — read-only preview actions
  and explicit phone hallway batching around the original commands.
- `apps/player/src/App.tsx`, `apps/player/src/shellContract.ts` — one optional
  phone-actions prop; AppShell's contract/rendering is unchanged.
- `apps/player/src/mobile/MobileShell.tsx` — exact Build wiring replacements;
  re-read immediately before each edit. MB4's Manage wiring is intact.
- `apps/player/src/mobile/map/sceneInput.test.ts` — only the two interim MB2
  buffered single-touch Build replay tests were replaced with preview-only
  behavior, plus their fixture/type support. Flag-off desktop expectations
  remain exactly unchanged.

This ExecPlan section and the current thread handoff were appended, preserving
the concurrent MB4 handoffs. `.local-dev/mobile-mb5/` contains the initial
807-file SHA-256 inventory and before-images, isolated shared-shell before-image,
logical existing-file diffs, commands/logs and `preservation.json`.

`python .local-dev/mobile-mb5/audit.py` proves:

- 758 protected pre-existing files are byte-unchanged, including all domain,
  balance and clinical source, all 161 existing non-mobile player test files,
  AppShell, desktop styling, buildModePresentation and routeMotion.ts.
- Removing only MB5's optional phone bridge/imports/fields and already-mobile
  input block reconstructs the **entire** pre-MB5 FacilityScene and
  FacilityCanvas exactly. Desktop input, placement, painting, door picking,
  rendering, asset loading and camera logic remain exact.
- Removing only the explicit phone actions/batching seams reconstructs the
  **entire** pre-MB5 usePrototypeSession and App exactly. Placement/move/sale/
  token/upgrade/door/undo/access guards were not edited.
- The original flag-off scene test expectations are exact. Phone camera.ts,
  MobileFacilityMap.tsx, defaultCamera and facilityCameraBounds are unchanged.
- The two other shared-file changes, `ui/types.ts` and `session/viewModels.ts`,
  are MB4's optional service provider/team projection work, not MB5 edits.
- Every MB5 source/test file is UTF-8 without BOM and LF. Built desktop CSS is
  unchanged: `index-C5tFl1dZ.css`, 163125 bytes, SHA-256
  `b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.

Ghost tests compare 520 positions across five room types against the actual
PLACE_ROOM reducer, plus unlock/cash/capacity/dependency/orientation and move
guards. Hallway parity executes the original flag-off FacilityScene's actual
paintHallwayToPointer against clear, existing, occupied, cash-limited, diagonal
and off-site/re-entry strokes, comparing accepted cells and cost. Door previews
are compared to real PLACE_DOOR/REMOVE_DOOR receipts. Real usePrototypeSession
and MobileShell tests prove command counts, no preview mutation/save, supported
Rotate, Move, doors, valid-prefix strokes, Cancel, one save/history entry,
desktop per-cell history/saves, failed storage, upgrade, frozen/stale sale tokens,
refund, Undo, blocked exit and running/already-paused exit restoration. Scene
tests cover view-center/current-room initialization, repeat catalog choices,
tinting, two-touch cancellation, nearest door picking and flag-off exclusion.

### Validation commands and exact output

Default checked-in configs and four-worker cap were used. Test pool was
`--pool=threads`, with the specified existing preload; no exclusions,
dependency/config changes or desktop expectation edits. PowerShell's native
stderr formatting appears in full logs; every command returned its actual
`$LASTEXITCODE`.

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/facility/hallwayPainting.test.ts src/facility/doorInteractionGeometry.test.ts src/session/buildModePresentation.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
python .local-dev/mobile-mb5/audit.py
```

Focused (`focused.log`), exit 0:

```text
 Test Files  28 passed (28)
      Tests  310 passed (310)
   Start at  00:14:49
   Duration  5.40s (transform 7.03s, setup 0ms, import 16.31s, tests 2.85s, environment 1ms)
```

FULL player (`player-full.log`), exit 1, **only the known, unedited thyroid
pending-label assertion** at `surgeryCenterServicePreviews.test.ts:85:52`:

```text
 Test Files  1 failed | 185 passed (186)
      Tests  1 failed | 1528 passed (1529)
   Start at  00:15:11
   Duration  35.02s (transform 10.45s, setup 0ms, import 60.32s, tests 64.38s, environment 10ms)
```

FULL game-domain (`domain-full.log`), exit 0, original skips retained:

```text
 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  00:06:19
   Duration  142.41s (transform 6.14s, setup 0ms, import 56.54s, tests 501.26s, environment 7ms)
```

Root typecheck (`typecheck-root.log`), exit 0, all seven workspaces:

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

Player production build (`build.log`), exit 0; exact summary excerpt:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 666 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/MobileShell-9cpU7J6O.css                                  29.63 kB │ gzip:     5.39 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-6BUQBtG-.js                                   91.90 kB │ gzip:    23.82 kB
dist/assets/index-CQoc7dbc.js                                      8,232.64 kB │ gzip: 1,819.40 kB
✓ built in 3.61s
```

Mobile bundle includes MB4. Existing main-chunk-size and plugin-timing warnings
remain; MB7 owns performance. Full exact stdout/stderr and intermediate logs
are retained under `.local-dev/mobile-mb5/`. Domain ran before final phone-only
sheet polish; its entire source remained byte-unchanged. Focused/full player,
root typecheck and player build were rerun after that polish.

### Manager Playwright touch QA

Use the manager's disposable QA origin/profile with `isMobile: true`,
`hasTouch: true`, deviceScaleFactor as appropriate. Suggested existing QA URL:
`http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof`.
Confirm `location.origin`; create a QA campaign, never clear/use owner storage.
The last query flag enables the existing read-only Phaser proof handle; no new
debug endpoint was added. Worker did not launch a browser. Minimal-DOM tests
and graphics spies do not prove physical geometry or native browser touch.
Manager must rerun default-pool tests/browser checks before acceptance.

1. At 390x844, 412x915, 360x740, 844x390 and 768x1024, open Build and scroll
   New Rooms/My Rooms. Compare card art, price/upkeep/count/unlock/reasons with
   desktop. Test locked, insufficient-money and instance-limit cards. The
   catalog must be a bottom sheet with visible persistent Undo/Done, >=44px
   targets, no horizontal overflow and no actions beneath bars/coach. Close
   the catalog; Build stays paused until Done. Repeat a catalog choice while
   another ghost is active; a fresh centered ghost must appear.
2. Choose Waiting Room. Wait for the ghost and measured map/control resize.
   Its footprint center must lie at the visible canvas center (within half a
   tile for snapping); no down/up may purchase it. To **drag the ghost**, begin
   a single touch **inside its colored footprint**, move that same touch ID
   by several grid tiles over multiple frames, then end it. Grabbing elsewhere
   pans instead. Avoid mouse drag as a substitute for the touch check. This
   readback and CDP helper uses the existing proof handle and real touch events:

   ```js
   const cdp = await page.context().newCDPSession(page);
   const readGhost = () => page.locator('[data-testid="facility-canvas"]').evaluate(host => {
     const scene = host.__facilityGame.scene.getScene('facility-scene');
     const ghost = scene.bridge.mobileBuild.ghost;
     const placement = scene.bridge.viewModel.placement;
     const rect = scene.game.canvas.getBoundingClientRect();
     const sx = rect.width / scene.scale.width;
     const sy = rect.height / scene.scale.height;
     return {
       x: rect.left + (scene.layout.originX + (ghost.x + placement.width / 2) * scene.layout.tileSize) * sx,
       y: rect.top + (scene.layout.originY + (ghost.y + placement.height / 2) * scene.layout.tileSize) * sy,
       tileX: scene.layout.tileSize * sx, tileY: scene.layout.tileSize * sy,
       rooms: scene.bridge.viewModel.rooms.length
     };
   });
   const from = await readGhost();
   const touch = (x, y, id = 1) => ({ id, x, y, radiusX: 8, radiusY: 8, force: 1 });
   await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touch(from.x, from.y)] });
   for (let step = 1; step <= 8; step++) {
     await cdp.send('Input.dispatchTouchEvent', {
       type: 'touchMove', touchPoints: [touch(from.x + 2 * from.tileX * step / 8, from.y - 2 * from.tileY * step / 8)]
     });
     await page.waitForTimeout(25);
   }
   await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
   // Inspect valid/invalid reason and confirm unchanged room count/cash before ✓.
   // Choose a valid destination, then tap [data-phone-build-confirm="placement"].
   ```

   Repeat against overlapping/out-of-site positions: red ghost, exact reason,
   disabled Place. Check supported Rotate changes orientation/footprint only,
   fixed-orientation rooms have no Rotate, and Cancel spends nothing. Confirm
   a valid spot once, then attempt a rapid second tap; one room/charge/undo entry.
3. Start a tentative ghost or hallway drag, add a second touch, then send
   touchMove with **both stable IDs** while changing distance **and midpoint**.
   Verify zoom plus pan, restored pre-drag ghost/stroke, no command/purchase and
   no Build action from the remaining finger after one touch lifts. Test native
   touchcancel, pointerupoutside, bounds/recenter and saved phone camera. Phone
   zoom/recenter controls must remain reachable above the Build buttons.
4. With no placement/door tool active, tap a built room and check the room
   sheet's status, all upgrade tiers/prices/benefits, protected Move/Sell
   omissions and affordability. Upgrade and Undo. Move a room: the initial
   ghost must be at its **current** tile; drag/confirm once, no cost, no Rotate;
   verify occupancy/overlap/protected guards and Undo. Select My Rooms too.
5. Open Doors, including automatic Doors after placing a new room. Tap a legal
   section at low zoom near a neighboring section: the nearest one highlights,
   and no door changes until ✓ Add/Remove. Check reciprocal-wall deduplication,
   exact one-tile opening, furniture/exterior/occupied illegal reasons, failed
   removal of the public entrance, Cancel and Undo. A touch outside the radius
   must not choose a distant wall. Restore actual access before exiting.
6. Hallway: drag clear, diagonal and long strokes through existing hallway,
   then through a room or with only enough cash for a prefix. Preview cost/cells
   must match desktop painting cell by cell. Leave/re-enter the site, repaint
   the same tile and cancel; no mutation/save during dragging. ✓ builds only
   green new cells, charges the exact total, adds one undo entry and writes
   the campaign profile once. One Undo restores the whole pre-stroke state.
   A following drag is a new stroke. Confirm desktop still saves/snapshots each
   cell. Use a synthetic quota failure to check the original save notice.
7. Sell: Cancel leaves room/staff/cash unchanged; Confirm passes the frozen
   token, names the existing dismissal consequences, applies the existing
   refund and is undoable. Change relevant staff after opening confirmation
   in a QA fixture; stale token must be rejected. Browser Back should cancel
   the nested confirmation before closing the underlying room sheet.
8. Place an isolated room and tap persistent Done or another tab. The access
   sheet must show the existing blocked-exit message/issues and keep Build
   paused. Continue Renovating, fix the access or Undo, then Done must restore
   the prior running/already-paused state. Check integration with MB4 Manage,
   staged setup navigation, Help and browser Back without lost guards.
9. At 1600x1000 fine-pointer desktop and `?layout=desktop`, compare desktop
   Build screenshots, mouse/wheel/drag/paint/door input and network with the
   accepted baseline. No MobileShell chunk should load. Read the actual diff
   and preservation report, watch console/page errors, then accept MB5. Safari/
   Android and the owner's physical phone remain final manager/owner QA.

No clinical statements/content/source records/review statuses, frozen encounters,
save schema, balance/domain rules, art assets, launcher, origin or browser profile
were changed. Owner local remains `START_GAME.cmd` → exact
`http://127.0.0.1:4173` in the usual persistent profile. Existing phone route
remains `START_PRIVATE_GAME.cmd` → `https://melissadesktop.taile197db.ts.net/`.
QA 5184, owner local 4173, private phone HTTPS, remote GitHub Pages and other
profiles have separate saves. No commit/push/merge/deploy/publish or backup was
created. **LOCAL ONLY**: manager owns acceptance and the scoped checkpoint
reminder to say **"push to GitHub"** after reviewing this milestone.


## MB6: tutorial, alerts, help, polish

2026-10-10 — Sol worker implementation/CLI validation handoff. The manager
retains actual-diff review, browser/touch QA and acceptance. **MB6 is not fully
complete: the prepared phone opening/AuthGate presentation still needs an
entry loading seam outside the assigned lane.** This scope question received
no answer before handoff. All other implementation described below is active.

### Pending entry seam / next action

`App.tsx` renders `AuthGate` and `OpeningSequence` before `MobileShell` mounts.
Neither can receive styles from that later lazy phone chunk on a fresh visit.
The brief and milestone table limit MB6 to `apps/player/src/mobile/**` plus
the tutorial resolver seam (and the expressly flagged Build scene polish).
`App.tsx`, `PrototypeShell.tsx`, `shellPresentation.ts`, AuthGate and desktop
opening markup/handlers therefore remain byte-unchanged.

Prepared, **not wired or bundled**: `MobileEntryPresentation.tsx`,
`mobileEntry.css`, `mobileEntry.test.tsx`. The null-rendering component sets
and restores a body presentation flag; all selectors require that flag.
Styles cover fluid 360–430px opening/local/hosted entry, 44px targets, 16px
inputs, founder/new-campaign forms, landscape and an unobstructed sign-out
slot. Standalone tests exercise the existing local-entry and founder handlers;
they do not prove integration into App or physical browser geometry.

Recommended manager decision: authorize/resume this worker for the narrow
presentation connection, or apply/review the proposed connection separately.
`.local-dev/mobile-mb6/entry-integration.proposed.patch` is a **not applied,
not validated** patch: App uses the existing layout selector and lazy-loads
the null presentation component as a stable sibling of the existing AuthGate,
so layout changes retain the existing child/session. It includes a small
own-module `getAttribute?.` guard for the existing minimal-DOM continuity
fixture. Keep desktop entry DOM, handlers and expectations unchanged; run
the unchanged shell-continuity test plus entry/focused/full tests, root
typecheck and player build after wiring. Desktop must request no entry CSS
or mobile chunk; switching layout must retain one session/clock.

### Active implementation

- The exhaustive phone target resolver covers every declared tutorial target
  and all 52 first-visit/timed-visit, daily-routine and setup step IDs,
  including legacy saved beats. It selects phone-only data markers, a visible
  phone tab hint, or a map location. It never reads the shared desktop target
  selector. Named patient cards are preferred; hidden/closed-details/zero-size
  nodes are rejected. Missing controls fall back to the phone tab. Go to
  Patients/Alerts/Manage/Build/Clinic uses the existing guarded tab flow.
- Phone markers cover chart choices and pinned actions, Patients cards,
  Goals/Advance, Build catalog/My Rooms/Doors/ghost confirmation, Manage hire
  buttons and clock controls. Build opens the relevant catalog segment for
  the tutorial. Entrance/water/litter targets reuse the scene's existing room
  outline, locator/highlight fields and phone camera; they mutate no game data.
- Chart and team-discussion entry collapses the coach immediately to a
  48px one-line pill. It occupies its own layout row above the tab bar, with
  a 44px disclosure control. Explicit expansion is retained across chart
  steps; reentering the chart collapses it. The existing six-second readable
  topic exposure remains six seconds and only runs while expanded. Shared
  tutorial progression, step/action IDs, pause and clock rules are untouched.
- All 12 navigation target types and all 17 alert-action kinds have explicit
  phone routes. Navigation opens native tabs/sheets/cards or focuses the map;
  no alert navigation calls desktop selectors or `scrollIntoView`. Commands
  still run through `onClinicAlertAction`/`runClinicAlertAction` once; failed
  commands keep their existing reason and do not navigate. Manage highlights
  scroll only their local phone sheet.
- Help uses phone instructions and full sheets. Campaigns and Restart retain
  the existing shared callbacks, guards and confirmations in locally adapted
  dialogs, with scoped full-screen/scrolling/fluid styling and 44px controls.
  The Prototype tools sheet is expanded, with only its sheet header. MB7
  concurrently replaced the runtime tools renderer with its confirmed
  performance-tools implementation; that import and behavior are preserved,
  and the integrated one-header/visible-tools test passes against it.
- Patient cards show satisfaction once; the chart header says Satisfaction
  before its percentage. The portrait top bar has smaller padding, gaps and
  XP ring while retaining 44px controls. At 844x390 landscape it becomes one
  row and the five tabs move to a 76px left rail; sheets remain independently
  scrollable. Geometry and native safe-area/keyboard behavior require QA.
- Under `mobileInput === true` only, a fresh/rotated/resized placement or
  move ghost is framed with about two tiles of margin on each side, zooming
  out as necessary. A held drag near any viewport edge pans continuously;
  the current camera/world grab offset and bounded virtual grab point keep
  the whole footprint visible. A second touch/cancel restores the prior
  tentative ghost and suppresses edge pan. This code emits preview intents,
  never placement/purchase commands. The desktop on-canvas Build footer is
  hidden only in mobile mode, after the untouched desktop footer chain.

### Files changed and shared-tree ownership

MB6 source/tests (31 paths):

- `apps/player/src/mobile/tutorialTargets.ts`
- `apps/player/src/mobile/tutorialTargets.test.tsx`
- `apps/player/src/mobile/usePhoneTutorialAnchor.ts`
- `apps/player/src/mobile/phoneScroll.ts`
- `apps/player/src/mobile/phoneMapFocus.ts`
- `apps/player/src/mobile/alertNavigation.ts`
- `apps/player/src/mobile/alertNavigation.test.ts`
- `apps/player/src/mobile/MobileShell.tsx` — exact integration edits;
  concurrent MB7 performance/history/preview/tools seams preserved.
- `apps/player/src/mobile/MobileTutorialCoach.tsx`
- `apps/player/src/mobile/MobileTopBar.tsx`
- `apps/player/src/mobile/MobilePatients.tsx`
- `apps/player/src/mobile/MobileChart.tsx`
- `apps/player/src/mobile/MobileAlerts.tsx`
- `apps/player/src/mobile/MobileGoals.tsx`
- `apps/player/src/mobile/MobileQuickControls.tsx`
- `apps/player/src/mobile/MobilePrototypeTools.tsx` — disclosed shared-panel
  adapter/type contract; current runtime renderer is MB7's performance module.
- `apps/player/src/mobile/MobileHelpTopic.tsx`
- `apps/player/src/mobile/mobilePolish.css`
- `apps/player/src/mobile/phonePolish.test.tsx`
- `apps/player/src/mobile/build/MobileBuildCatalog.tsx`
- `apps/player/src/mobile/build/MobileBuildControls.tsx`
- `apps/player/src/mobile/build/mapInput.ts`
- `apps/player/src/mobile/build/ghostCamera.ts`
- `apps/player/src/mobile/build/ghostCamera.test.ts`
- `apps/player/src/mobile/manage/MobileEmployees.tsx`
- `apps/player/src/mobile/manage/MobileManage.tsx`
- `apps/player/src/mobile/map/MobileFacilityMap.tsx` — optional focus hook only.
- `apps/player/src/facility/FacilityScene.ts` — mobile-flagged ghost framing,
  edge pan and footer hiding only; concurrent MB7 asset/render seams preserved.
- `apps/player/src/mobile/MobileEntryPresentation.tsx` — prepared/unwired.
- `apps/player/src/mobile/mobileEntry.css` — prepared/unwired.
- `apps/player/src/mobile/mobileEntry.test.tsx` — standalone entry verification.

Documentation: this section and an append-only CURRENT_THREAD_HANDOFF note.
Evidence under `.local-dev/mobile-mb6/` is ignored scratch, not game content.
No Git was used. A pre-edit filesystem snapshot preserves 831 existing paths.
`scoped-with-concurrent-shared.diff` and `after/` capture the current 31 paths;
the shared Scene/Shell diff **also contains MB7 work**, explicitly not attributed
to MB6. `FacilityCanvas.tsx`, session `usePrototypeSession.ts`, mobile Build
types/RoomThumbnail and `mobile/performance/**` changes belong to concurrent
MB7 work and were not reverted or rewritten by MB6.

### Desktop/rules preservation evidence

`node .local-dev/mobile-mb6/evidence.mjs` passes: 761 protected pre-existing
source/config paths unchanged, all 161 existing non-mobile player test files
byte-unchanged, owned source UTF-8 without BOM/LF, documentation prefixes
preserved. App, selector, shared tutorial view-model/timing/pause/progression,
desktop UI/CSS, domain/balance/clinical sources, game rules and save schema
are unchanged. MB6 scene operations are explicitly mobile-flagged; actual
scene tests cover flag-off edge-pan and original footer behavior. Existing
desktop tests, including shell continuity and chart/tutorial tests, passed
apart from the known unedited thyroid assertion below.

Built desktop CSS remains exactly the accepted 163,125-byte
`index-C5tFl1dZ.css`, SHA-256
`b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
The preservation report excludes named shared MB7 Scene/Canvas/session seams
from blanket byte claims; manager must review both workers' actual changes.
No entire-shared-scene reconstruction claim is made for concurrent MB7 work.

### Validation — exact commands/output

Used the unchanged default Vitest/Vite configs and default test-worker cap,
with `--pool=threads` and the existing permitted net-use EPERM preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/session/tutorialViewModels.test.ts src/session/tutorialTiming.test.ts src/session/dailyRoutineTutorialPause.test.ts src/session/clinicAlertActions.test.ts src/ui/TutorialCoach.test.tsx src/ui/OpeningSequence.test.tsx src/facility/hallwayPainting.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb6/evidence.mjs
python .local-dev/mobile-mb6/capture-diff.py
```

Focused (`focused-final.log`), exit 0:

```text
 Test Files  39 passed (39)
      Tests  479 passed (479)
   Start at  00:51:47
   Duration  7.36s (transform 6.61s, setup 0ms, import 20.50s, tests 5.28s, environment 2ms)
```

FULL player (`player-final.log`), exit 1; **only the known, byte-unchanged
thyroid pending-label failure** at `surgeryCenterServicePreviews.test.ts:85:52`:

```text
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
 Test Files  1 failed | 194 passed (195)
      Tests  1 failed | 1678 passed (1679)
   Start at  00:52:19
   Duration  35.11s (transform 9.21s, setup 0ms, import 62.01s, tests 62.62s, environment 11ms)
```

Root typecheck (`typecheck-final.log`), exit 0, all seven workspaces:

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

Player build (`build-second.log`), exit 0; exact output summary:

```text
vite v8.1.5 building client environment for production...
transforming...✓ 678 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileShell-CHHcQQtG.css                                  33.12 kB │ gzip:     5.94 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileShell-6a-fR0Gi.js                                  100.54 kB │ gzip:    26.50 kB
dist/assets/index-Diq3w1l9.js                                      8,240.38 kB │ gzip: 1,821.50 kB
✓ built in 2.47s
```

The existing >500kB main-chunk warning remains; MB7 owns performance. An
initial build without the preload failed on Windows net-use `spawn EPERM`;
the prescribed preload fixed the environment retry, without a code/config
change. No test exclusions/timeouts/desktop expectation edits. Earlier full
run (before the three standalone entry tests) had 1675 passing tests plus only
thyroid. Final full run includes the latest concurrent MB7 tests. Full exact
stdout/stderr, intermediates, baseline and audit are retained in ignored scratch.
No domain test rerun: all domain sources remained byte-unchanged; user requested
the FULL player suite. CLI/minimal-DOM/graphics-spy checks do not prove browser
touch, layout geometry, native dialogs, Safari safe areas or keyboard behavior.

### Manager QA steps

Use the manager's disposable QA origin/profile, for example
`http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof`.
Confirm `location.origin`; use fresh QA campaigns, never owner storage.
Playwright touch contexts: 360x740, 390x844, 412x915, 430x932, 844x390 and
768x1024, `isMobile: true`, `hasTouch: true`, DPR 3 where appropriate.
Worker did not launch a browser/server; manager reruns default-pool checks
and browser QA in its own environment before acceptance.

1. Inspect actual MB6 and MB7 shared-file diffs before accepting. Check that
   desktop code/expectations and the protected source/CSS audit match. At
   1600x1000 fine-pointer and `?layout=desktop`, compare original desktop
   entry/chart/Build/tutorial/screenshots/input/network. No MobileShell chunk
   should load. After entry wiring, no MobileEntryPresentation chunk/CSS should
   load either; repeated layout changes must retain one session/clock.
2. Walk the full first-visit, timed second visit, daily-routine and setup
   tutorials. Use legacy saved-step fixtures for beats no longer emitted by a
   fresh campaign. Every step must mark a visible `[data-phone-anchor]` or
   `[data-mobile-tab]`; no hidden desktop node. Check Go to each other tab,
   guarded chart/file exits and blocked Build exits without automatic actions.
   Verify named patient priority, choice/pinned-action anchors, New Rooms/My
   Rooms, ghost ✓, Doors, Hire and Goals/Advance. Entrance/water/litter should
   recenter and use the scene's existing visible highlights/locator.
3. Open/reopen charts across first/second-decision, feedback, summary and file
   steps. The coach must collapse immediately to a one-line pill, consume only
   its own ~48px row, and leave all choices and the pinned action reachable.
   Expand/collapse explicitly; switch screens and return. Confirm the original
   running clock, pause/restart rules, actions and six-second readable exposure.
4. Trigger navigation-only alerts for patient, room, employee, staff role,
   Build, Goals, advertising, emergency cash, money, save, water and litter.
   Verify the exact native screen/highlight/map focus. Exercise all command
   actions through the existing guarded runner: one application only; refused
   actions keep the reason and do not open a different screen. Repeated map
   links should refocus even after manually panning.
5. More > Help: visit every topic, scroll, All topics, Show guidance here,
   replay first shift and browser Back. Existing running/already-paused state
   must be restored correctly; Build/Manage locks stay intact. Help instructions
   should refer to phone taps and explicit Build confirmations.
6. More > Campaigns/Restart: full-screen local dialogs, long names/lists and
   fresh/archive/restore/switch flows at 360–430px; no horizontal overflow or
   sub-44px controls. Restart Cancel restores the prior pause state, Confirm
   invokes the existing archive/new-campaign callback once; Back cancels the
   nested confirmation before closing the underlying sheet. More > Prototype
   tools must show exactly one header and already-expanded tools; preserve
   MB7's long-fast-forward confirmation.
7. Verify satisfaction appears once per Patients card, Waiting metadata remains,
   and chart percentages say Satisfaction. Measure the slimmer two-row portrait
   top bar, 44px Pause/Speed/More/Money targets, badge overflow and long cash/time
   values. At 844x390 the top bar is one row and tabs are a left rail; scroll
   every sheet and chart without hiding choices/pinned actions under controls.
8. In Build, select a fresh placement and move an existing room. After measured
   canvas/control resize, the whole ghost plus about two tiles per side should
   fit; move starts at its actual tile. Use MB5's CDP ghost-coordinate helper
   and real stable-ID touch events: drag three tiles toward the top and hold
   inside each edge zone. The camera must pan continuously while the full ghost
   remains visible. No purchase/room/cash change before explicit ✓. Check all
   four edges/corners, portrait/landscape/Rotate, pinch with two touches, native
   touchcancel and viewport bounds. A second finger cancels only the tentative
   drag and suppresses Build actions/edge pan. Desktop Build footer text must
   be absent on phone and remain unchanged on desktop.
9. **After resolving/applying the entry seam**, test fresh AuthGate/local entry,
   hosted login/reset/register where configured, opening/main/campaign list,
   founder previous/next/name/clinic/guidance and new-campaign/restart entry at
   every size. Open the physical/native keyboard: fields/actions must stay
   scrollable with 16px inputs and 44px targets; safe areas and hosted sign-out
   must not cover gameplay. Explicit local bypass and existing auth callbacks,
   founder seed/guidance and duplicate-submit guards remain unchanged. Current
   standalone entry tests do not make this integrated requirement complete.

No clinical content/provenance/review statuses, patient generator, frozen saves,
rules, balance, art assets, launcher/origin/profile changes were made by MB6.
Owner local remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the
usual persistent profile. Existing phone route remains `START_PRIVATE_GAME.cmd`
→ `https://melissadesktop.taile197db.ts.net/`; canonical remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Those origins and QA
5184/other profiles have separate saves. No owner storage, agents, Git,
installs, external messages, commit/push/merge/deploy/publish or backup.
**LOCAL ONLY**: manager owns acceptance, the pending entry seam and scoped
checkpoint reminder to say **"push to GitHub"** after reviewing this work.


### MB6 entry seam

2026-10-10 — Manager explicitly authorized the proposed App entry seam.
**The earlier pending-entry statements in this MB6 section are resolved.**
Implementation and requested CLI validation are complete; manager retains
browser/touch geometry QA and acceptance.

Changed only `apps/player/src/App.tsx` (existing selector; conditional lazy
null entry component as a stable sibling of AuthGate),
`mobile/MobileEntryPresentation.tsx` (the proposed minimal-DOM attribute guard)
and new `mobile/mobileEntryIntegration.test.tsx`. Prepared phone entry CSS is
now active and bundled separately. AuthGate, OpeningSequence/its CSS,
PrototypeShell, selector, session, all 161 existing non-mobile test files and
the unchanged shell-continuity test remain byte-identical to the fresh
follow-up snapshot; no MB7 shared files were changed. Removing only the
approved App seam reconstructs the **entire** prior App exactly, including
every desktop entry/campaign handler. Owned source remains UTF-8/no BOM/LF.

Proof: the real-App integration observes **zero entry-loader and mobile-shell
loader calls on desktop**, identical AuthGate DOM, unchanged founder DOM/typed
values across layout switches, existing explicit local-entry/new-campaign
callbacks and duplicate-submit guard, and one session/clock. The unchanged
shell-continuity test also passes. Built HTML eagerly references neither phone
asset; the compiled entry JS/CSS preload is inside React's lazy factory,
used only by the compiled `phone` branch. Entry CSS has its own chunk;
desktop CSS is still exactly 163,125 bytes with the previously recorded hash.
`entry/preservation.json` records the factory, compiled conditional and hashes.

Exact commands used the unchanged default configs and specified preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile/mobileEntry.test.tsx src/mobile/mobileEntryIntegration.test.tsx src/mobile/shellContinuity.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/session/tutorialViewModels.test.ts src/session/tutorialTiming.test.ts src/session/dailyRoutineTutorialPause.test.ts src/session/clinicAlertActions.test.ts src/ui/TutorialCoach.test.tsx src/ui/OpeningSequence.test.tsx src/facility/hallwayPainting.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node .local-dev/mobile-mb6/entry/audit.mjs
```

Entry/unchanged continuity (`entry/entry-tests-second.log`), exit 0:

```text
 Test Files  3 passed (3)
      Tests  5 passed (5)
   Start at  01:04:09
   Duration  2.82s (transform 3.76s, setup 0ms, import 5.24s, tests 107ms, environment 0ms)
```

Focused (`entry/focused.log`), exit 0:

```text
 Test Files  41 passed (41)
      Tests  482 passed (482)
   Start at  01:04:28
   Duration  12.53s (transform 13.17s, setup 0ms, import 35.77s, tests 9.18s, environment 3ms)
```

FULL player (`entry/player-full.log`), exit 1, **only the known unedited
thyroid pending-label failure**, `surgeryCenterServicePreviews.test.ts:85:52`:

```text
 Test Files  1 failed | 196 passed (197)
      Tests  1 failed | 1681 passed (1682)
   Start at  01:05:20
   Duration  34.51s (transform 7.87s, setup 0ms, import 60.15s, tests 61.72s, environment 12ms)
```

Root typecheck (`entry/typecheck.log`), exit 0, all seven workspaces. Exact
root command output starts:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
```

Player build (`entry/build.log`), exit 0; exact summary (unchanged existing
chunk-size/plugin-timing warnings retained):

```text
vite v8.1.5 building client environment for production...
transforming...✓ 681 modules transformed.
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-CHHcQQtG.css                                  33.12 kB │ gzip:     5.94 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileEntryPresentation-3-Mb_rSc.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-BMe7Hhqp.js                                  100.75 kB │ gzip:    26.53 kB
dist/assets/index-BhNM4oLm.js                                      8,241.89 kB │ gzip: 1,822.08 kB
✓ built in 4.38s
```

Full exact stdout/stderr, fresh 857-path baseline, owned diff/source,
preservation report and initial test fixture correction are retained under
`.local-dev/mobile-mb6/entry/`. The first new integration-test run awaited the
actual lazy module incorrectly; fixing only that new test's promise wait made
the final run pass. No existing expectation/config/timeouts were changed.

Direct native Chrome proof attempt (`node
.local-dev/mobile-mb6/entry/browser-proof.mjs`) was blocked at launch:
`browserType.launch: spawn EPERM`; no browser, QA server or owner storage was
opened. Loader/production-artifact evidence above proves the desktop loading
path; no live browser network trace is claimed. Manager can run that same
read-only proof script in its environment: it serves the built app temporarily
on a disposable random loopback port, creates fresh contexts, blocks external
requests, checks zero desktop phone-asset requests and phone entry CSS, then
closes both browser and server. That temporary QA origin has separate saves
and is not an owner opening pathway. Repeat the existing MB6 QA step 9 for
360–430px/844x390 entry, native keyboard, safe areas and hosted sign-out.

No clinical content/rules/save schema/launcher/origin changes, Git, installs,
agents or external messages. This entry follow-up is **LOCAL ONLY**; manager
retains QA/acceptance and the scoped **"push to GitHub"** checkpoint reminder.


## MB7: mobile performance

Sol worker handoff, 2026-10-10. **MB7 implementation and CLI validation/measurements are complete; manager browser/phone acceptance remains pending.** The final full player run has only the known, unedited thyroid pending-label failure.

### Scope and files

- `apps/player/src/mobile/performance/presentationPolicy.ts`: presentation-only
  cover/visibility gate, one-shot reveal resync and capped canvas sizing.
- `apps/player/src/mobile/performance/canvasResolution.ts`: mobile main-context
  DPR multiplier; logical ScaleManager/camera/layout/pointer units remain CSS
  pixels. Existing offscreen art/text canvases retain their prior resolution.
- `apps/player/src/mobile/performance/roomAssets.ts`: exact original desktop
  asset list/order, level/built/preview selectors, actual room/decor dependencies
  and one shared mobile decoded-image request cache.
- `apps/player/src/mobile/performance/buildHistory.ts`: paired state/label
  history trimming to the last 30 whole entries, enabled only by MobileShell.
- `apps/player/src/mobile/performance/MobilePrototypeTools.tsx`: disclosed phone
  tools with confirmation before Fast Forward, Add Money and full FSRS-card-list
  rendering; existing Restart confirmation retained. The concurrent MB6 tools
  file remains untouched; its props are imported as a type only.
- Tests: `presentationPolicy.test.ts`, `canvasResolution.test.ts`,
  `roomAssets.test.ts`, `lazyArt.test.tsx`, `mobilePerformanceFlows.test.tsx`,
  all inside `mobile/performance/` (33 focused MB7 tests).
- Shared exact additions: `facility/FacilityCanvas.tsx`, `facility/FacilityScene.ts`,
  `session/usePrototypeSession.ts`, `mobile/MobileShell.tsx`,
  `mobile/build/types.ts`, `MobileBuildCatalog.tsx`, `RoomThumbnail.tsx`.
  Scene/Shell diffs also contain preserved MB6 work. MB6's flagged ghost
  fit/edge-pan/footer changes and all other concurrent phone edits were kept.
  The subsequently connected `App.tsx` phone entry seam and its integration
  test belong to manager/MB6, not MB7.
- This appended handoff and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.
  Measurements, original-file capture, diffs, full logs, software DPR figure,
  synthetic browser profiles and traffic helper are in `.local-dev/mobile-mb7/`.
  These local QA artifacts are not a release/committed corpus.

### Behavior and desktop preservation

Full-screen sheets, covered non-Clinic tabs and `document.visibilityState ===
"hidden"` suppress phone character drawing, pin/screen-anchor projection,
earnings popups, world refresh and map camera reconciliation. The phone camera
is invisible while covered, so Phaser also skips rendering its objects. Its
game loop still has a small global canvas clear; this is not a promise of zero
whole-page work. Bottom sheets, the Build catalog/controls and the exposed map
keep rendering. Cover state never enters the session's timer, pause, speed,
reducer, projection or persistence logic. Existing document-background clock
policy is unchanged; MB7 adds no pause, speed reduction or clock suppression.

The first revealed frame restores camera visibility, discards presentation-only
route/facing/gait/seat/popup history, forces the current layout and reprojects
pins/anchors. It drops the accumulated presentation delta. Route sampling uses
the unchanged `routeMotion.ts` starting sample, exactly as a reload. No stale
route tail or accumulated credits replay. This is a reload-style resync, not a
promise to animate every intermediate position that passed while hidden.

Phone startup loads environment, landscape and frontage, then approved
room/decor dependencies for built rooms and room definitions buildable at the
current facility level. Borrowed common shell and corridor-decor crops count
as dependencies; unused older atlas generations do not. Newly placed rooms,
visible catalog thumbnails (IntersectionObserver) and level-up request only
missing dependencies. Map and catalog share an Image/source cache. An entire
room uses the existing procedural fixture placeholder until its required
sources are ready; a failed source stays procedural. A thumbnail paints a
floor/shell placeholder first and retains it on failure. No missing Phaser
texture is requested. Loaded sources remain cached for the page lifetime;
restarting a campaign does not evict previously decoded sources. Measurements
below describe cold page/context startup, before opening the Build catalog.
Character textures remain on their existing lazy-loading path.

The preservation audit (`desktop-audit.json`, `preservation.json`,
`mb7-owned-and-shared.diff`, `scene-preserved-mb6.diff`) records:

- **813 protected source/config paths unchanged**, including domain,
  balance, clinical content, persistence, routeMotion, asset manifests and
  desktop UI. All **161 existing non-mobile player test files are byte-identical**.
- Removing MB7's explicit additions reconstructs the **whole original session
  and Canvas files**. Original scene create, eager loader, world and character
  bodies reconstruct exactly. The update body reconstructs after removing the
  separately preserved, mobile-flagged MB6 ghost-pan call. The remaining Scene
  diff consists solely of MB6's phone input/ghost/footer work.
- Desktop still requests the exact original 199 assets in the original order,
  uses its original canvas size, runs all 60 drawing/pin/popup calls in the
  flag-off gate test and retains all 35 undo snapshots in the history test.
- Built desktop CSS remains **163,125 bytes**, SHA-256
  `b964593b89741ad63318396efa029db6d590b49ddfcc9e5ad414f44433415cff`.
  Owned source files are UTF-8 without BOM and LF. Docs were append-only.

### Before/after measurements

Exact file bytes and PNG/WebP header dimensions were read from the current
asset set; every dimension matched its descriptor. The real mobile selector
and Image-cache API were instrumented with fake local onload: source assignments
were exactly 37/151 with no duplicate assignments. These are **selected initial
URLs and file-body bytes**, not a captured browser network trace. Estimated
decoded RGBA is width × height × 4; browser/native memory, character images,
derivative surfaces, text, caches and React are excluded. Browser bytes/RAM
must be checked by the manager below. Decimal MB and binary MiB are distinct.

| Campaign | Path | Initial unique image URLs | Compressed file bytes | Estimated RGBA bytes | Estimated MiB |
| --- | --- | ---: | ---: | ---: | ---: |
| Fresh Level 0 | Desktop / mobile before | 199 | 24,570,993 | 368,024,520 | 350.98 |
| Fresh Level 0 | Mobile after | 37 | 7,739,507 | 87,962,860 | 83.89 |
| Early Level 4 fixture | Desktop / mobile before | 199 | 24,570,993 | 368,024,520 | 350.98 |
| Early Level 4 fixture | Mobile after | 151 | 16,165,389 | 274,601,128 | 261.88 |

Level 0 removes 162 startup URLs, 16,831,486 compressed bytes (68.50%) and
267.09 nominal decoded MiB (76.10%). Level 4 removes 48 URLs, 8,405,604 bytes
(34.21%) and 89.10 MiB (25.39%). No public art was removed from the distribution.

| Presentation/history measurement | Before | Mobile after |
| --- | --- | --- |
| Covered, real Scene.update harness, 60 frames | 60 character + 60 pin + 60 popup calls | 0 / 0 / 0; identical reducer state and 4 ticks |
| 600 requested policy frames, uncovered / covered | 600 / 600 drawing requests | 600 / 0 |
| Actual session interval through Clinic → Patients → Clinic | Normal interval | Tick +1 / +2 while covered / +3 after reveal; no pause/speed call |
| Build undo, 35 whole commands | 35 retained | Last 30 whole states/labels; all 30 newest undos exactly restore their snapshots |
| Hallway stroke | MB5 already groups all cells into one undo/save | Still one entry; last-30 cap applies after grouping |

MB5 coalescing bounded entries per stroke, not the total history. Hence the
phone-only cap. For scale only, 30 copies of the initially serialized Level 0
fixture are 3,499,440 bytes (3.34 MiB), and Level 4 4,563,540 bytes (4.35 MiB).
These are serialized-state equivalents, **not measured heap bounds**; actual
states grow and JS object overhead differs. Undo content/receipts/FSRS/save
schema stay intact; older whole entries become eligible for GC.

**DPR choice: `min(devicePixelRatio, 2)` on mobile.** At 390 × 600 logical CSS
pixels, DPR 1 has 234,000 backing pixels / 936,000 RGBA bytes; DPR 2 has 936,000
pixels / 3,744,000 bytes: 4× fill area, +2.68 MiB. Layout/camera/culling/baseSize
and Phaser input remain 390 × 600; the main context's set/reset transforms alone
scale into the backing bitmap. Fractional DPR and rotation are tested. Desktop
never installs the multiplier. Installed Phaser 4 Canvas has no resolution
config option; changing logical gameSize would break pointer/scene geometry.

The software sharpness comparison uses four real approved sprite crops at
tile size 62 CSS pixels, Pillow 12.3 Lanczos reduction and nearest compositor
upscale to a DPR-3 reference. The inspected `dpr-comparison.png` shows improved
small furniture/text detail. Numerical results:

| Crop | PSNR dB, DPR 1 / 2 | Software resize mean ms, 1 / 2 | p95 ms, 1 / 2 |
| --- | ---: | ---: | ---: |
| front_desk | 16.26 / 19.35 | 0.480 / 0.513 | 0.492 / 0.523 |
| waiting | 17.75 / 21.06 | 0.617 / 0.668 | 0.634 / 0.677 |
| examination | 18.00 / 21.30 | 0.539 / 0.560 | 0.593 / 0.568 |
| mri | 22.43 / 25.23 | 1.138 / 1.347 | 1.192 / 1.369 |

DPR 2 improves this surrogate by 2.79–3.32 dB and lowers RGB RMSE by roughly
27–32%; the additional bitmap budget is small compared with the scoped-image
savings. This supports the chosen sharpness cap, but **Pillow timings are not
browser Canvas/GPU or phone frame timings**. Actual frame cost/sharpness at DPR
1/2/3 needs manager/physical-phone QA; no 60 fps, battery or RAM claim is made.

The unchanged reducer/projection were also sampled with Node, 120 warm-up and
240 measured ticks, projection every tick, serialize every 15 ticks (16
samples), seed `mb7.level4`. Both finish at tick 360. These costs still occur
under a covered map, by design; they are not claimed render-skip savings.

| Scenario | Reducer mean / p95 / max ms | View mean / p95 / max ms | Serialize mean / p95 / max ms | End serialized bytes |
| --- | ---: | ---: | ---: | ---: |
| Fresh Level 0 | 0.593 / 0.792 / 1.162 | 0.404 / 0.541 / 6.327 | 0.136 / 0.225 / 0.225 | 129,925 |
| Early Level 4 fixture | 6.699 / 9.342 / 18.736 | 5.775 / 7.235 / 8.972 | 0.332 / 0.408 / 0.408 | 243,542 |

Reproduce without installs:

```powershell
node --disable-warning=ExperimentalWarning --import=./.local-dev/mobile-mb7/source-loader.mjs .local-dev/mobile-mb7/measure-assets.mjs
python .local-dev/mobile-mb7/measure-dpr.py
node .local-dev/mobile-mb7/measure-bundle.mjs
python .local-dev/mobile-mb7/audit.py
```

### Bundle analysis and proposed follow-up

No visualizer was installed. `measure-bundle.mjs` invokes the existing Vite
config/plugins with `write:false, sourcemap:true`, inspects chunk.modules
renderedLength and sourcesContent UTF-8 sizes, and writes
`bundle-measurement.json`. Rendered module lengths are intermediate analyzer
contributions, **not additive shares of the final minified chunk**. The ordinary
production build below is the authoritative emitted/gzip result; the analysis
build also contains sourcemap references and uses local zlib for its gzip.

| Main-chunk group | Modules | Intermediate renderedLength sum | Sourcemap source UTF-8 bytes |
| --- | ---: | ---: | ---: |
| Player app/art metadata | 164 | 3,187,060 | 1,686,676 |
| React/React DOM | 8 | 476,232 | 563,992 |
| Other dependencies | 75 | 393,094 | 702,021 |
| Game domain | 69 | 1,488,058 | 1,835,006 |
| Balance config | 13 | 327,479 | 308,399 |
| Clinical content | 243 | 4,079,487 | 4,374,529 |
| Phaser | 1 | 2,700,561 | 8,800,542 |

Largest individual module contributions include Phaser (2,700,561), the
generated character-still registry (1,212,667), clinical wording-repair data
(664,717), React DOM (453,153), the reducer (333,354), FacilityScene (258,879)
and exterior landscape JSON (251,775). Source-map totals omit some generated
JSON sources and cannot be interpreted as download bytes.

**Proposal only:** investigate separating the phone startup graph from the
desktop shell/facility imports, then loading Phaser/map code when the phone
clinic is ready. A vendor/manual chunk alone still fetches the statically
imported bytes at startup. Investigate a separately bundled local clinical
context initialized before the session/clock mounts, with stable concept IDs,
frozen encounters and identical reducer context. No web/AI retrieval during
play. Both ideas cross shared synchronous imports and need a reviewed follow-up
to demonstrate unchanged desktop opening/clock/assets; neither was clearly
desktop-neutral enough to implement in MB7. No Phaser/clinical chunk split or
Vite config change was made. The main chunk is still large; MB7 primarily
reduces mobile art requests and invisible presentation work.

### Validation: exact commands and output

Default repository configs with `--pool=threads`; no exclusions, raised
timeouts, dependency/config changes or desktop expectation edits. All Node
validation used the required preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/facility/characterPauseArrival.test.ts src/facility/earningsPopupFrameCost.test.ts src/facility/approvedRoomRenderer.test.ts src/facility/facilityCameraBounds.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
```

Focused (`focused-final.log`), exit 0:

```text
 Test Files  39 passed (39)
      Tests  483 passed (483)
   Start at  00:54:55
   Duration  7.13s (transform 6.70s, setup 0ms, import 21.06s, tests 3.87s, environment 2ms)
```

Current MB7 performance tests plus the concurrent entry integration
(`focused-entry-recheck.log`), exit 0:

```text
 Test Files  6 passed (6)
      Tests  34 passed (34)
   Start at  01:09:29
   Duration  3.01s (transform 6.56s, setup 0ms, import 9.54s, tests 858ms, environment 0ms)
```

The intermediate shared run captured an entry-test body-marker failure while
that concurrent test was changing (`player-entry-concurrent.log`). The current
test passed the focused recheck and the final full run below; MB7 made no edit
to it or App.

First FULL player before the concurrent entry seam/test (`player-full.log`),
exit 1, only the known unedited thyroid assertion:

```text
 Test Files  1 failed | 195 passed (196)
      Tests  1 failed | 1680 passed (1681)
   Start at  00:58:04
   Duration  46.84s (transform 10.59s, setup 0ms, import 79.20s, tests 86.67s, environment 15ms)
```

Refreshed FULL player on the shared tree (`player-final.log`), exit 1:

```text
 Test Files  1 failed | 196 passed (197)
      Tests  1 failed | 1681 passed (1682)
   Start at  01:09:44
   Duration  34.41s (transform 7.83s, setup 0ms, import 60.40s, tests 61.41s, environment 10ms)
```

Only the known thyroid failure remains; no new failure.
Known thyroid failure: `session/surgeryCenterServicePreviews.test.ts:85:52`,
pendingLabel expected to contain `Off-site thyroid fine-needle aspiration`.
Its file and clinical projection expectations remain untouched.

FULL game-domain (`domain-full.log`), exit 0, original skips retained:

```text
 Test Files  137 passed | 1 skipped (138)
      Tests  3764 passed | 2 skipped (3766)
   Start at  00:58:04
   Duration  154.04s (transform 7.96s, setup 0ms, import 60.01s, tests 543.98s, environment 8ms)
```

Root typecheck (`typecheck-final.log`), exit 0, all seven workspaces:

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

Player build (`build-final.log`), exit 0; complete chunk-size excerpt:

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 681 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-CHHcQQtG.css                                  33.12 kB │ gzip:     5.94 kB
dist/assets/index-C5tFl1dZ.css                                       163.12 kB │ gzip:    30.30 kB
dist/assets/MobileEntryPresentation-3-Mb_rSc.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-BMe7Hhqp.js                                  100.75 kB │ gzip:    26.53 kB
dist/assets/index-BhNM4oLm.js                                      8,241.89 kB │ gzip: 1,822.08 kB
```

Existing >500 kB main-chunk and plugin-timing warnings remain. Full stdout/
stderr and previous runs are retained under `.local-dev/mobile-mb7/`. Domain
was run after MB7 code and stayed byte-identical through the concurrent App
entry change. Typecheck/build/player were refreshed for that entry seam.

### Manager browser, Playwright traffic and physical-phone QA

Worker first tried native Playwright: bundled headless executable absent;
installed Chrome and Edge both reject launch with **spawn EPERM**. No install,
permission bypass, browser storage access or browser/server listener occurred.
`browser-check.txt` retains the errors. Manager must rerun default-pool tests
and actual browser/device checks. In particular, settle the concurrent entry
test if still failing:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- src/mobile/mobileEntryIntegration.test.tsx
npm.cmd run test --workspace @gamify-surgery/player
```

1. Use the manager's **disposable** QA origin/profile, for example
   `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof`.
   Confirm `location.origin`. This has separate saves from owner local 4173,
   private phone HTTPS and GitHub Pages. Do not clear/read/import owner storage.
   Use fresh contexts with `serviceWorkers:"block"`, `isMobile:true`,
   `hasTouch:true`; desktop comparison 1600 × 1000 and `?layout=desktop`.
   The proof flag is the existing development-only handle, not a new endpoint.
2. Generate the exact cold-start fixtures with the **unchanged serializer**:

   ```powershell
   node --disable-warning=ExperimentalWarning --import=./.local-dev/mobile-mb7/source-loader.mjs .local-dev/mobile-mb7/create-browser-fixtures.mjs
   ```

   `browser-profile-fixtures.json` contains fresh Level 0 and the same early
   Level 4 fixture used in the measurements. In a NEW context, seed its local
   profile with addInitScript, then complete the ordinary local prototype
   sign-in flow. These synthetic profiles do not supply authentication. Avoid
   fixture scripts in a persistent owner profile. Before navigating/creating
   the clinic, attach the supplied traffic helper; example manager script:

   ```js
   import fs from 'node:fs';
   import { chromium } from '@playwright/test';
   import { attachFacilityTraffic } from './.local-dev/mobile-mb7/browser-traffic.mjs';
   const fixtures = JSON.parse(fs.readFileSync('.local-dev/mobile-mb7/browser-profile-fixtures.json', 'utf8'));
   const browser = await chromium.launch({ channel:'chrome', headless:true });
   // Repeat each level with phone=true/false in a NEW context every time.
   const phone = true, fixture = fixtures[0];
   const context = await browser.newContext({ viewport:phone ? {width:390,height:844} : {width:1600,height:1000},
     isMobile:phone, hasTouch:phone, deviceScaleFactor:phone ? 3 : 1, serviceWorkers:'block' });
   await context.addInitScript(storage => {
     for (const [key, value] of Object.entries(storage)) {
       if (!localStorage.getItem(key)) localStorage.setItem(key, value);
     }
   }, fixture.storage);
   const page = await context.newPage();
   const reportTraffic = await attachFacilityTraffic(page); // CDP cache disabled BEFORE goto
   await page.goto(`http://127.0.0.1:5184/?layout=${phone ? 'phone' : 'desktop'}&prototype-tools=1&facility-gait-proof`);
   // Complete the usual local prototype sign-in/opening flow; keep Build closed.
   // Await a live map + all expected environment/room loads; inspect console/page errors.
   const traffic = await reportTraffic();
   fs.writeFileSync(`.local-dev/mobile-mb7/traffic-${fixture.level}-${phone ? 'phone' : 'desktop'}.json`, JSON.stringify(traffic,null,2));
   await context.close(); await browser.close();
   ```

   The helper is syntax-checked, not browser-executed here. It filters the 199
   facility asset paths (characters/fonts/scripts reported separately), counts
   completed/unique requests, sums response BODY bytes and CDP encoded transfer
   bytes separately, and computes nominal decoded bytes for requested images.
   Expect 37 / 151 mobile and 199 / 199 desktop in cold contexts before Build.
   BODY bytes should match the table; transfer bytes include protocol/headers
   and must not be equated with file lengths. Require no failures/pending/404s.
   Record total app startup requests, JS transfer and navigation-to-map timing
   separately. Warm-cache or previously opened catalogs do not test startup.
3. For lazy art, throttle network; place/show a newly requested higher-level
   room, scroll locked catalog cards actually into view, and advance facility
   level. Check only missing deps request once; room/thumbnail stays whole and
   procedural until ready. Block one room source with page.route: placeholder,
   no broken/missing texture and usable controls. Offscreen catalog cards should
   not request their art; shared map/thumbnail should reuse the same source.
4. Wrap read-only proof scene methods to count actual 600-frame drawing calls:

   ```js
   await page.locator('[data-testid="facility-canvas"]').evaluate(host => {
     const scene = host.__facilityGame.scene.getScene('facility-scene');
     const counts = {drawCharacters:0, reportAlertPinPositions:0, drawEarningsPopups:0};
     for (const name of Object.keys(counts)) {
       const original = scene[name].bind(scene);
       scene[name] = (...args) => { counts[name]++; return original(...args); };
     }
     host.__mb7Counts = counts; // disposable proof context only
   });
   ```

   Uncovered Clinic and a partial bottom sheet should draw. Patients/Alerts/
   full Goal/chart/tools sheets should add zero calls while facilityTick and
   time keep advancing at their existing cadence, except existing user-owned
   pause/Build/reference behavior. Check camera.visible false and React pins
   absent. Reveal once: current actor path samples, no replay or repeated
   credits, restored pins, no stale drift or huge-delta jump. Repeat with the
   page genuinely hidden and shown; existing background clock behavior must
   match desktop. Check a reveal while paused/in Build too.
5. DPR/sharpness/frame cost: identical cold fixture/camera/viewport contexts at
   deviceScaleFactor 1, 2 and 3, 390 × 844 / 412 × 915 / 360 × 740 /
   844 × 390 / 768 × 1024. At DPR 3 the **backing is 2× CSS map size**, while
   `scene.scale.width/height` and displayed CSS rect remain logical. Record
   screenshots/crops plus renderer CPU and rAF frame-interval distributions;
   separate reducer/view/React cost. Check rotation/resizes, tap/ghost/place/
   doors/drag/pan/pinch mapping at DPR 1/1.5/2/3, and resumed visibility. At
   desktop DPR 2/3 the backing remains its original CSS-sized path. Physical
   Android/iPhone phone heat/frame stability and visual preference are the
   final DPR check; software PSNR is only supporting evidence.
6. Do >30 phone Build operations, grouped strokes, then Undo newest 30 exactly;
   older history unavailable, no partial stroke undo. Switch to desktop and
   check subsequent desktop history remains uncapped. Check save failure
   recovery unchanged. In prototype tools, Cancel Fast Forward/Money performs
   no command; Confirm executes once even rapidly tapped, with no automatic
   pause/speed change. FSRS list appears only after its confirm. Restart keeps
   its existing confirmation and consequences.
7. Desktop cold trace and screenshots at 1600 × 1000: no MobileShell or
   MobileEntryPresentation request; identical 199 image set/order and CSS,
   mouse/pointer/build/clock/save behavior. Read the actual diff and audit;
   rerun default-pool suites and browser console checks before accepting.

No clinical statements, sources, review statuses, rules, save schema, frozen
encounters, art assets, launchers, origins or profiles were changed by MB7.
Owner local remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual
persistent profile; phone remains `START_PRIVATE_GAME.cmd` →
`https://melissadesktop.taile197db.ts.net/`; canonical remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Each origin/profile has
separate saves. No Git, installs, agents, external messages, commit/push/merge/
deploy/publish or GitHub backup was performed. **LOCAL ONLY**: manager retains
acceptance and the scoped checkpoint reminder to say **"push to GitHub"** once
the integrated browser/phone checks pass.


## MB9: owner feedback round 1

2026-10-10 — Codex Sol worker implementation and CLI validation complete.
The sole Claude Code "GamifySurgery manager" retains diff review, integrated
browser/device QA and acceptance. This handoff supersedes earlier mobile
instructions about double-tap zoom, map zoom buttons, the Emergency cash action
sheet, and confirming free Add Money/read-only FSRS inspection. Earlier
milestone entries are preserved as historical evidence.

### Result and rule preservation

The Clinic chip is **GLP-1 consult**, with a left-to-right background fill from
the existing `EmergencyGlp1View.cooldownProgressPercent`. The shared projection
already calculates elapsed facility time divided by the configured cooldown,
clamped to 0–100%. Mobile does not introduce a cooldown or wall-clock animation.
Paused facility time holds the fill; changing 1×/2×/4× changes only how the
existing clock reaches the next facility tick. An unused/ready consult is full
and shows the existing payment label. One tap calls
`onRunEmergencyGlp1Consultation`; the same session action produces the ordinary
money, income and operation receipts. A local submission latch prevents rapid
duplicate activation before the new session projection arrives. Cooling taps
are ignored, and the existing remaining-time reason is visible on the chip.

Existing Build Mode prohibition and operational staffed-suite coverage appear
as blocked reasons, with no command. Phone coverage remains visible even when
the shared visibility projection hides the desktop emergency panel; the
same `enabled`/capacity/session guards still prohibit the manual action. More
and applicable Alerts links retain a read-only GLP-1 information sheet with
payment, cadence, status, flavor and existing next automated payout information.

Map touch-up now resolves the first tap immediately. Double-tap recognition,
the 300 ms pending-tap timer, its scene-update drain and its zoom action are
removed. Pan/pinch thresholds, mutable Phaser-pointer coordinate copying,
gesture cancellation and Build's separate input/confirmation path remain.
Single-tap floor movement calls the existing `onMoveFounder` command once;
room-floor taps also use that original destination path while opening the room
inspector. Free chairs and Front Desk seat targets invoke the existing guarded
seat actions once. Rejected floor/seat actions show a short reason rather than
an action sheet; their 1.8 s dismissal timer is presentation only. Character,
room and door taps open their inspectors immediately. No floor/seat legality,
required-work interruption rule, or command reducer is changed.

The map has no −/+ zoom buttons or zoom percentage. Pinch and drag remain;
the standalone ⌖ Recenter button stays in the lower-right map corner and is
44 × 44 CSS px minimum. It retains the existing phone camera preference and
room framing. Build's measured map area keeps it above the Build controls.

MB9 changes only mobile source/tests and three existing mobile-flag-gated scene
edits. Emergency eligibility, payment/cooldown, founder movement legality,
construction rules, facility clock, save schemas and clinical content are
untouched. Existing desktop test expectations were not edited.

### Files changed by MB9

Owned application/source/test paths (27; two new tests):

| Area | Files |
| --- | --- |
| Existing mobile scene seams only | `apps/player/src/facility/FacilityScene.ts` |
| Phone shell and navigation | `apps/player/src/mobile/MobileShell.tsx`, `apps/player/src/mobile/navigation.ts` |
| Quick controls, Goals and inspectors | `apps/player/src/mobile/MobileQuickControls.tsx`, `apps/player/src/mobile/MobileGoals.tsx`, `apps/player/src/mobile/MobileInspectorSheet.tsx` |
| Phone guidance/help | `apps/player/src/mobile/MobileTutorialCoach.tsx`, `apps/player/src/mobile/tutorialTargets.ts`, `apps/player/src/mobile/MobileHelpTopic.tsx` |
| Map | `apps/player/src/mobile/map/MobileFacilityMap.tsx`, `apps/player/src/mobile/map/gestures.ts`, `apps/player/src/mobile/map/selection.ts` |
| Phone tools and CSS | `apps/player/src/mobile/performance/MobilePrototypeTools.tsx`, `apps/player/src/mobile/mobileShell.css`, `apps/player/src/mobile/mobileScreens.css`, `apps/player/src/mobile/build/mobileBuild.css` |
| New integration/legality tests | `apps/player/src/mobile/mobileOwnerFeedback.test.tsx`, `apps/player/src/mobile/map/founderSingleTap.test.ts` |
| Updated phone tests | `apps/player/src/mobile/MobileScreenFlows.test.tsx`, `apps/player/src/mobile/MobileScreens.test.tsx`, `apps/player/src/mobile/MobileShell.test.tsx`, `apps/player/src/mobile/MobileTutorialCoach.test.tsx`, `apps/player/src/mobile/map/MobileFacilityMap.test.tsx`, `apps/player/src/mobile/map/gestures.test.ts`, `apps/player/src/mobile/map/inspector.test.tsx`, `apps/player/src/mobile/map/sceneInput.test.ts`, `apps/player/src/mobile/performance/mobilePerformanceFlows.test.tsx` |

Documentation is append-only: this ExecPlan and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Owned source/tests and appended text
use UTF-8 without BOM and LF; existing shared-document bytes remain intact.
Regenerable `apps/player/dist/` and ignored `.local-dev/mobile-mb9/` evidence
are not source changes for a checkpoint.

### Interaction audit

Every changed interaction and retained confirmation/navigation sequence is
listed below. "Kept" means a second step has a separate purpose, chooses among
actions, shows required information, or protects an existing consequence; it
does not add a new game rule.

| Interaction | MB9 result | Reason / retained protection |
| --- | --- | --- |
| GLP-1 map chip → sheet → Complete consult | **Changed:** ready chip completes directly; duplicate tap pays once. | One free action needs no intermediate sheet. Existing session/cooldown/coverage/Build guards remain. |
| Cooling/blocked GLP-1 chip | **Changed:** fill and existing reason stay on the chip; taps are inert. Staffed coverage displays its reason rather than disappearing. | No early consult or accidental payment; facility-time remaining status supplies the lighter hint. |
| GLP-1 information in More/Alerts | **Changed:** read-only information sheet, renamed GLP-1 consult. | Retains payment, cadence, status, flavor and next payout information from the old sheet. No redundant Complete button. |
| Walkable floor tap → delayed selection/Walk here | **Changed:** immediate movement on touch-up through the original move callback. | No confirm for a free move; reducer legality/required-work guards unchanged. Lawn/disconnected/busy destinations get a brief reason. |
| Room-floor tap → inspector → Walk here | **Changed:** original legal floor move happens on the same tap as opening the inspector; Walk here removed. | Preserves desktop floor destination legality while retaining requested one-tap room inspection. |
| Free chair / Front Desk seat → inspector → Sit | **Changed:** direct original seat action on map tap; no seat inspector. | Free movement intent is explicit; occupied/blocked targets display a brief reason without changing state. |
| Character / room / door tap | **Kept:** immediate inspector. Character actions and Room actions remain separate explicit choices. | Inspection itself is requested and displays live activity, status, cleanliness, level or upgrade information. Opening a chart, praising, returning to Front Desk, or entering Build is a different intent. |
| Dedicated map Praise callback → one-button Praise sheet | **Changed:** invokes existing Praise action directly; obsolete sheet/state/route removed. | The Praise intent is already selected. Employee inspector/Manage Praise buttons already act directly and remain so. |
| Litter / water target → one-button action inspector | **Changed:** direct original collect/refill action. | Free environmental action has no irreversible/costly confirmation to retain. Session still owns availability and work legality. |
| Completed Goals chip → Goals → Advance | **Changed:** chip says Advance with next level and advances directly, with duplicate-activation latch. | Existing `canLevelUp`/session action owns eligibility; no new progression requirement or cost. |
| Incomplete Goals chip / More → Goals / full Goals sheet | **Kept:** incomplete chip opens requirements; **added** Goals in More even when the chip becomes Advance. | A player needs requirements, setup actions and optional goals; full information is still reachable. Sheet Advance was already direct. |
| Collapsed tutorial → Expand → Go to tab | **Changed:** collapsed heading exposes Go to tab directly. | Expansion is only for reading extra coaching, not required navigation. |
| Tutorial Go to Clinic hint → tap Goals chip | **Changed:** Goals/level-up hints say Go to Goals and open Goals after normal guarded tab/mode/chart transitions finish. | Removes redundant navigation; refused chart/discussion closure or blocked Build exit still prevents leaving. Manual tab navigation cancels the pending Goals request. |
| Prototype Add Money → Confirm | **Changed:** Add Money acts immediately. | Free development credit; no destructive/costly action. |
| Prototype Inspect FSRS → Confirm → list | **Changed:** one tap opens/closes the read-only card list. | Disclosure is the only needed step; no session action or heavy simulation. |
| Map −/+ buttons, zoom percentage and double-tap zoom | **Removed:** no UI or gesture dependency remains in current phone code/tests/help. | Pinch supplies zoom and drag supplies pan; neither requires a pending tap. |
| Map ⌖ Recenter | **Kept:** one tap, standalone minimum 44 px corner control. | No gesture equivalent; original room framing and phone-only camera persistence remain. |
| Room construction / room movement | **Kept:** choose room/action, position ghost, then ✓ Place/Move; Cancel and rotation remain. | Prevents accidental purchase and chooses the destination. Free room movement still needs a chosen final position. |
| Hallway paint | **Kept:** preview whole stroke, then priced ✓ Build hallway. | Money is spent and the chosen footprint must be deliberate; grouped Undo unchanged. |
| Door changes | **Kept:** choose door tool, select wall section, then ✓ Add/Remove door. | Selection chooses among sections; even $0 edits alter access and must retain existing Build safeguards. |
| Sell room | **Kept:** consequence/refund preview → Confirm Sale/Cancel with existing token and latch. | Irreversible room removal can fire staff and interrupt service; stale sale protection unchanged. |
| Fire employee | **Kept:** employee choice → Fire → Confirm Fire/Cancel. | Employee removal and any training refund are consequential. |
| Train employee | **Kept:** employee choice → quote/benefit/duration → priced Train/Cancel. | Spending and staff absence remain deliberate; existing eligibility/queue/quote unchanged. |
| Employee detail disclosure / Employees–Services–Money segments | **Kept:** choose the person or section before its relevant controls. | These contain several distinct controls and information, not a single free-action confirmation. Hire, salary and Praise buttons already act directly under their existing guards. |
| Room upgrade tiers / quoted Upgrade | **Kept:** inspect room/tier information, then existing priced Upgrade action. | Existing desktop behavior and price/eligibility remain; no new or removed confirmation. |
| Build catalog / New vs My Rooms / room selection | **Kept:** choose among rooms and tools, then purposeful Build staging. | Choice of item and location is necessary; no extra confirm added. |
| Build exit blocked → Finish room access sheet | **Kept:** original access reason/issues with Continue Renovating. | This explains an existing refusal, not confirmation of a free exit. Done succeeds directly when original rules allow it. |
| Restart / campaign switch / new campaign founder selection | **Kept:** original shared dialog/form decisions and guarded actions. | Preserve campaign-state consequences, pause cleanup and owner-requested deliberate transitions; founder choice is substantive. |
| Fast Forward | **Kept:** request → Confirm/Cancel and duplicate latch. | Irreversibly advances facility time in a heavy batch; preserves the existing clock and phone protection. |
| Save & Close / Retry save & pause | **Kept:** saving runs immediately; result/recovery sheet follows. Clearing local failed saves still requires confirmation. | Outcome/recovery is useful information; clearing campaigns is destructive. |
| Patient/team rows → chart/discussion; answer/feedback/enact/file/guarded close | **Kept:** original frozen-choice submissions and required acknowledgments/actions/closure guards. | Each is a different protocol step with learning/care/state consequences; navigation does not bypass desktop guards. |
| Alert/Needs-you action → target UI | **Kept:** existing command executes once or target opens directly; only target-specific required choices remain. | Target discovery, chart/room choices and stale-command failures are substantive, not redundant confirmations. |
| Advertising chip → controls | **Kept:** sheet with current level, hourly cost, cadence and −/+ choices; each adjustment direct. | Multiple choices with recurring cost need their information; a chip cannot stand for an unspecified increase/decrease. These are not map zoom buttons. |
| Cash explanation / Help topic selection / More destinations | **Kept:** information and menu navigation. | Multiple destinations or explanatory content; no single free command hidden behind a confirm. Help's original reference pause/restore is retained. |
| Appointment toggles, lab queue, setup Build/Hire actions, clock Pause/speed, layout override, tutorial controls | **Kept:** already direct actions. | No redundant confirmation to remove; all original session guards and staged mode transitions remain. |

### Tests and desktop/shared-tree evidence

New real-session tests exercise one consult payout and ordinary receipts, two
activations before React flush, ignored cooling tap, facility-tick progress
through pauses and speed 1×/2×/4×, readiness and the next legitimate payout,
Build refusal, and **real operational staffed coverage** with no manual command.
They also cover direct free seating, Goals/duplicate activation/More access,
collapsed Goals guidance with a refused chart-close guard, immediate inspector
opening, free environment/Praise actions and brief rejected reasons.

The founder parity test runs the original desktop `handlePointerUp` and the
phone touch-up/scene callback against the same real reducer, compares complete
state, destination and receipt for every starter-room tile and sidewalk, and
checks disconnected floor, required work and inert lawn. Existing mobile
gesture tests cover immediate first-tap emission, successive taps without
zoom, pan/pinch/cancel suppression and Phaser getter coordinates. Recenter
tests cover the phone camera key, current-room framing, absent zoom buttons/
percentage and minimum geometry. Existing Build/Manage/restart/chart mobile
tests continue to protect deliberate confirmations. Flag-off scene input tests
continue to assert the original mouse/pointer/wheel path.

Before-images/SHA-256 baseline were captured from 862 supplied working-tree
paths without Git. The final audit reports **761 protected existing paths and
all 161 existing non-mobile player tests byte-unchanged**. It removes only the
three MB9 phone edits plus the separately inspected concurrent highlight seams
and reconstructs the complete initial `FacilityScene` body (normalized LF).
MB9's isolated scene diff is
`.local-dev/mobile-mb9/mb9-scene.diff`; all owned source/test differences are
in `scoped.diff`, and ownership/encoding/document-prefix evidence in
`preservation.json` / `preservation.log`.

Concurrent manager patient-chart highlighting was observed and preserved in
`apps/player/src/AppShell.tsx`, `facility/FacilityCanvas.tsx`,
`facility/characterInspect.ts`, `facility/types.ts`, `session/viewModels.ts`,
`styles/global.css` and `ui/PatientLists.tsx`, plus the `FacilityScene` import,
optional highlight callback and desktop-only character-click callback. New
concurrent tests `AppShell.chartHighlight.test.tsx` and
`facility/characterInspect.test.ts` are also present and were not edited.
These paths are relative to `apps/player/src/`. Their inspected evidence is
`shared-current.diff`; they are **not MB9 changes**. Consequently, the current
whole shared desktop stylesheet/build must not be described as byte-identical
to the pre-MB9 baseline: concurrent highlight styling changed it. The narrow
MB9 desktop-preservation claim is separate from that manager-owned feature.

### Exact validation commands and output

All commands used the checked-in configuration, normal worker cap and the
allowed **threads pool plus EPERM preload**, with no exclusions, alternate
config, installs or desktop expectation changes. Every npm invocation used:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

Final commands, run from the repository root:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/session/economyViewModels.test.ts src/facility/founderActivityPresentation.test.ts src/facility/facilityCameraBounds.test.ts src/ui/EmergencyGlp1Panel.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
python .local-dev/mobile-mb9/audit.py verify
```

Final focused: **41 files / 479 tests PASS, exit 0**. Full player: **200 files /
1,715 tests PASS, one file / one known thyroid test FAIL, exit 1**. Root
typecheck: **all seven workspaces PASS, exit 0**. Player build: **PASS, exit 0**;
existing large main-chunk and plugin-timing warnings remain. MobileShell is
101.55 kB JS / 26.94 kB gzip and 33.63 kB CSS / 6.03 kB gzip. No scope-expanding
chunk split was attempted.

The only full-suite failure remains
`src/session/surgeryCenterServicePreviews.test.ts:85:52`, "ignores the retired
concealment flag and preserves the scheduled external service after an answer":
the pending label omits `Off-site thyroid fine-needle aspiration`. Its unchanged
expectation was not weakened. Final full-suite counts include the concurrent
manager tests.

Full raw captured output is preserved in
[focused-final.log](../../.local-dev/mobile-mb9/focused-final.log),
[player-full.log](../../.local-dev/mobile-mb9/player-full.log),
[typecheck-final.log](../../.local-dev/mobile-mb9/typecheck-final.log),
[build-final.log](../../.local-dev/mobile-mb9/build-final.log) and
[preservation.log](../../.local-dev/mobile-mb9/preservation.log). The output
blocks below remove ANSI control sequences only. PowerShell's native-stderr
`RemoteException` framing is a capture artifact; command exit codes above are
the actual `$LASTEXITCODE` values. Earlier focused failures were corrected
phone test-harness assumptions (zero-distance pan-up emissions, fake timer/
text-node behavior and presumed starter-floor rejection); the tutorial Goals
guard regression was fixed and validated. Those intermediate logs are retained
in the same ignored evidence folder and are not final acceptance results.

**Focused player checks (exit 0)**

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/mobile src/session/economyViewModels.test.ts src/facility/founderActivityPresentation.test.ts src/facility/facilityCameraBounds.test.ts src/ui/EmergencyGlp1Panel.test.tsx


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  41 passed (41)
      Tests  479 passed (479)
   Start at  10:55:11
   Duration  11.27s (transform 10.92s, setup 0ms, import 33.26s, tests 7.05s, environment 3ms)
```

**Full player suite (exit 1, known thyroid only)**

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 929ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 91ms
npm.cmd : 
At line:3 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 200 passed (201)
      Tests  1 failed | 1715 passed (1716)
   Start at  10:55:11
   Duration  39.06s (transform 11.64s, setup 0ms, import 68.40s, tests 71.41s, environment 12ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck (exit 0)**

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

**Player build (exit 0)**

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 681 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-DfjBFw_a.css                                  33.63 kB │ gzip:     6.03 kB
dist/assets/index-LZbQwf0F.css                                       163.50 kB │ gzip:    30.40 kB
dist/assets/MobileEntryPresentation-D26Wxx1a.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-l6UiEwCk.js                                  101.55 kB │ gzip:    26.94 kB
dist/assets/index-Cru-d4i3.js                                      8,242.45 kB │ gzip: 1,822.30 kB

npm.cmd : [PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
At line:3 char:1
+ npm.cmd run build --workspace @gamify-surgery/player > .local-dev/mob ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([PLUGIN_TI...is a breakdown::String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
  - forbid-private-clinical-modules (79%)
  - vite:prepare-out-dir (11%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: 
https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.81s
```

**Preservation audit (exit 0)**

```text
PASS: 761 protected existing paths and all 161 existing non-mobile player tests byte-unchanged; documents append-only.
PASS: removing only the three MB9 phone edits and separately inspected concurrent patient-highlight seams reconstructs the entire baseline FacilityScene (LF).
Preserved concurrent non-MB9 paths: apps/player/src/AppShell.tsx, apps/player/src/facility/FacilityCanvas.tsx, apps/player/src/facility/characterInspect.ts, apps/player/src/facility/types.ts, apps/player/src/session/viewModels.ts, apps/player/src/styles/global.css, apps/player/src/ui/PatientLists.tsx
PASS: 27 changed/new source and test files use UTF-8 without BOM and LF.
Changed/new source paths: apps/player/src/facility/FacilityScene.ts, apps/player/src/mobile/MobileGoals.tsx, apps/player/src/mobile/MobileHelpTopic.tsx, apps/player/src/mobile/MobileInspectorSheet.tsx, apps/player/src/mobile/MobileQuickControls.tsx, apps/player/src/mobile/MobileScreenFlows.test.tsx, apps/player/src/mobile/MobileScreens.test.tsx, apps/player/src/mobile/MobileShell.test.tsx, apps/player/src/mobile/MobileShell.tsx, apps/player/src/mobile/MobileTutorialCoach.test.tsx, apps/player/src/mobile/MobileTutorialCoach.tsx, apps/player/src/mobile/build/mobileBuild.css, apps/player/src/mobile/map/MobileFacilityMap.test.tsx, apps/player/src/mobile/map/MobileFacilityMap.tsx, apps/player/src/mobile/map/founderSingleTap.test.ts, apps/player/src/mobile/map/gestures.test.ts, apps/player/src/mobile/map/gestures.ts, apps/player/src/mobile/map/inspector.test.tsx, apps/player/src/mobile/map/sceneInput.test.ts, apps/player/src/mobile/map/selection.ts, apps/player/src/mobile/mobileOwnerFeedback.test.tsx, apps/player/src/mobile/mobileScreens.css, apps/player/src/mobile/mobileShell.css, apps/player/src/mobile/navigation.ts, apps/player/src/mobile/performance/MobilePrototypeTools.tsx, apps/player/src/mobile/performance/mobilePerformanceFlows.test.tsx, apps/player/src/mobile/tutorialTargets.ts
```

### Manager QA and acceptance steps

1. Review actual MB9 diffs and the separate concurrent patient-highlight lane.
   Rerun the default-pool player suite in the manager environment (only the
   known thyroid failure), typecheck and build. Do not edit desktop expectations.
   Worker CLI coverage is complete; no browser/physical-device pass is claimed.
2. Use a **fresh disposable context/profile** at
   `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof` for
   synthetic browser QA; confirm `location.origin === 'http://127.0.0.1:5184'`.
   Repeat the accepted touch matrix: 390 × 844 / 412 × 915 / 360 × 740 /
   844 × 390 / 768 × 1024, including DPR 3 and iPhone Safari. This temporary QA
   origin/profile has separate saves; never seed an owner persistent profile.
3. GLP-1: ready chip says GLP-1 consult · +$50 and is fully colored. Single tap
   pays once with the usual money/receipt; rapid twice pays once and opens no
   sheet. At 0/partial progress, repeated taps do nothing. Pause holds progress;
   resume and 1×/2×/4× track facility minutes rather than wall time. Check next
   ready consult, Build blocked reason, operational staffed-suite reason and
   removal of coverage restoring original eligibility. More/Alerts info must
   retain flavor/cadence/payment/status and any projected next payout.
4. Tap floor/free seat/Front Desk once; movement/seating should start with no
   second action or delay. Check lawn, disconnected/occupied/blocked floor or
   seat and founder doing required work: brief reason, no illegal move. Check
   a room-floor tap both inspects and sends the same legal destination as
   desktop; character and door inspect once. Praise/litter/water intent should
   invoke the original action without a one-button sheet. Drag/pinch/cancel
   must never accidentally issue these tap actions.
5. Consecutive map taps must not zoom or wait 300 ms. Pinch and one-finger pan
   must work; inspect iOS `visualViewport.scale` so browser zoom is not confused
   with map zoom. No map −/+ or percentage may remain. ⌖ Recenter must be
   unobtrusive, at least 44 px and reachable in portrait/landscape and Build,
   frame current rooms, and save only the existing phone camera preference.
6. Ready Goals chip should Advance directly once; incomplete Goals and More
   Goals must expose requirements. Collapsed coach Go to tab is directly
   tappable; a Goals hint opens Goals after a permitted transition. Refused
   chart close/Build exit must stay guarded. Add Money and FSRS disclosure are
   immediate; Fast Forward still confirms. Check construction ghost + Place,
   hallway/doors, sale, firing, priced training, restart, campaign forms and
   destructive save clearing retain their previews/confirmations and Cancel.
7. Check touch target geometry, fill visibility/contrast, chip wrapping versus
   dire banner, safe areas, all sheets/clock controls, page errors and overflow
   across the matrix. Compare desktop at 1600 × 1000: no MobileShell/entry
   chunk, original mouse/wheel/build/clock/consult rules, and no MB9 UI changes.
   Account for the independently changed patient highlighting when comparing
   desktop screenshots/CSS. Repeat the actual owner iPhone round through the
   normal private phone pathway after browser acceptance.

No clinical statements or sources, review statuses, rules, art, save schema,
launchers, origins or browser profiles were changed. No owner storage was
accessed, server/browser launched, or Git/install/agent/external-message/
commit/push/merge/deploy/publish operation performed. Owner local remains
`START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile;
phone remains `START_PRIVATE_GAME.cmd` →
`https://melissadesktop.taile197db.ts.net/`; canonical remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Those origins/profiles have
separate saves. **LOCAL ONLY**: no GitHub backup exists for MB9 from this worker.
Manager owns final acceptance and the scoped checkpoint reminder to say
**"push to GitHub"** after accepting the integrated result.


## MB9b: doors, play/pause, patient tap

**Worker handoff — GPT-6.1 Sol, 2026-10-10. Implementation and CLI validation complete; manager acceptance and browser/iPhone QA pending.**

### Scope and shared working-tree preservation

This follows the owner's second real-iPhone feedback message of 2026-10-10.
The authorized lane is `apps/player/src/mobile/**` plus this appended handoff
and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. No scene seam needed an edit in
MB9b. All existing desktop paths, scene code, domain commands/reducers,
clinical content, balance/configuration, save format, emergency-consult rules,
founder legality, construction/access rules and facility clock are unchanged
from the supplied MB9b working tree. The baseline already includes MB9 and the
manager's concurrent patient-highlight work; both are preserved.

No Git commands, agents, installs, external messages, browser launches,
deployment/publication, owner-storage writes or launcher/origin changes were
performed. Test campaigns use isolated in-memory storage. Existing draft
pediatric QA content is reused as a fixture; no clinical teaching content or
approval status was changed.

### Files changed

All source and tests below are under `apps/player/src/mobile/`:

| File | MB9b change |
| --- | --- |
| `build/useMobileBuild.ts` | Fresh shared preview on a door intent, immediate existing add/remove callbacks, projected removal receipt toast, three-second notice expiry, shared Undo and explicit Doors exit. |
| `build/MobileBuildControls.tsx` | Removes Add/Remove confirmation and Doors Cancel row; shows one-tap Doors guidance. Persistent catalog, Undo and Done remain. |
| `MobileShell.tsx` | Door removal toast with Undo; catalog/tab/tool exits Doors; patient/linked pediatric parent taps use the existing open-chart callback and projected chart sheet. |
| `MobileTopBar.tsx` | Separate Pause and Play buttons with current `aria-pressed` state, same toggle command, duplicate/active-tap guard, existing locks and visible lock reason. Speed action is unchanged. |
| `mobileShell.css` | Dark active/light inactive playback controls, fixed 68px widths and 44px minimum heights, flexible clock column and door toast/44px Undo. |
| `mobilePolish.css` | Existing landscape top bar places the lock reason across its columns. |
| `tutorialTargets.ts` | Doors tutorial points to active wall-tap guidance instead of removed confirmation. |
| `MobileHelpTopic.tsx` | Phone instructions describe one-tap doors, patient/parent charts and separate Pause/Play. |
| `build/MobileBuild.test.tsx` | Real-session immediate door commands, costs/receipts/saves/history, both Undo paths, notice expiry, rejected/distant/stale taps, auto-entry and exits; paid placement/access confirmation coverage retained. |
| `mobileOwnerFollowup.test.tsx` (new) | Real clock idempotence/speeds, both button states and all locks, bounded phone CSS; real pediatric child/parent chart opens; pre-check-in/filed/staff/visitor inspector fallbacks and refused-open projection. |
| `MobileShell.test.tsx` | Mounts hooked top bar through React and checks both locked buttons without changing desktop expectations. |
| `tutorialTargets.test.tsx` | Replaces removed Doors confirmation expectation with active Doors guidance. |

Documentation: append-only additions to this ExecPlan and
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Local evidence/scripts are in
`.local-dev/mobile-mb9b/`; player `dist/` is regenerated by the requested build.

### Interaction audit table

These rows supersede the corresponding MB9 rows; all other MB9 audit rows and
kept confirmations remain in force. The owner's explicit door request
supersedes the historical mobile design's door confirmation.

| Interaction | Before MB9b | Phone now | Changed/kept and reason |
| --- | --- | --- | --- |
| Doors: legal wall / existing door | Enter Doors, select section, then ✓ Add/Remove. | In active Doors, one nearby legal-wall tap adds via `placeDoor`; one existing-door tap removes via `removeDoor`. Fresh `previewDoor` preserves shared legality. A successful removal shows **Door removed · Undo** for three seconds; toast Undo and persistent Undo use the same build history. Illegal sections show the shared reason briefly. Null/unknown picks make no command/save/history entry. | **Changed:** no final Add/Remove step for free undoable door edits. The unchanged scene still chooses the nearest section only within its radius; far taps do nothing. |
| Doors entry and exit | New room auto-arms Doors; door confirmation/Cancel row. | New paid room placement still auto-arms Doors. Done exits Doors while using the existing guarded Build exit; Room catalog, Build tab/catalog selection, or another placement/tool exits Doors. | **Changed exit presentation:** Done/catalog/tool choices replace the redundant Doors Cancel control. The access guard can still refuse leaving Build. |
| Top-bar facility playback | One Pause/Play toggle. | Adjacent **⏸ Pause** and **▶ Play**; current state is dark/filled with light text, inactive is light with dark text. Selecting the already active state does nothing; stale rapid activation invokes the existing toggle once. Both remain disabled in Build, Management and reference locks, with the same visible/title reason. Speed remains 1× → 2× → 4× → 1×. | **Changed:** state is visible and directly chosen in one tap. No clock, speed or pause-rule change. Each playback target is 68px wide and at least 44px high; portrait clock column can shrink/wrap at 360px. Real geometry remains manager QA. |
| Character tap | Character inspector, then Open patient chart. | Openable patient: one tap calls the existing `onOpenPatient` path and its live projection opens the chart sheet. Pediatric parent: the existing stored family/encounter link targets the child's chart. The shared patient list excludes pre-check-in children; filed/resolved rows stay inspection-only. Staff, visitors, unlinked companions and founder retain one-tap inspection. | **Changed:** removes the inspector's extra chart action for openable patients. Refused chart actions never fabricate a chart sheet; existing close/feedback/session guards remain authoritative. |
| New room / hallway purchases | Preview/ghost or stroke, then ✓ Place / Build hallway. | Same preview and paid confirmation. New-room wall taps only become available after approved placement. | **Kept:** prevents accidental construction spending. |
| Move room / upgrade / room sale | Move ghost + ✓; priced upgrade action; Sell preview + Confirm Sale token. | Same. | **Kept:** location choice, shown cost and destructive sale review/token remain meaningful. |
| Firing, restart, campaign switching and other existing desktop confirmations | Deliberate confirmation/guard. | Same. | **Kept:** irreversible/costly or campaign-changing actions retain prior protection. |
| Chart answers/enact/file/close/Back and reference dialogs | Existing choice/detail/action/close guards; reference locks. | Same. | **Kept:** choices and clinical feedback are meaningful actions; no guard bypass or automatic clock change on patient tap. |

The only new timers are three-second **presentation** notices. They do not
advance facility time or alter door legality. An add/remove revalidates through
the shared live-state preview and calls the original session callback; it does
not mutate rooms/doors in the phone component. Removal success is checked in
the next shared projection because the existing callback returns `void`.

### Validation commands and exact output

Used the **checked-in default configuration with `--pool=threads`**, plus the
specified preload. No test exclusions, config changes, thyroid expectation
changes or desktop expectation changes. All validation commands used:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

Final results: focused **41 files / 493 tests passed**; FULL player **201 files /
1,737 tests passed**, with **only the known thyroid pending-label failure**
(202 files / 1,738 tests total); root typecheck all seven workspaces and player
build passed. Full suite exit 1 is precisely that existing failure at
`src/session/surgeryCenterServicePreviews.test.ts:85:52`; expected external
service name versus generic pending-care label. It is untouched.

Exact captured output follows (ANSI control sequences removed for Markdown;
raw logs retained as UTF-8/LF). PowerShell's `NativeCommandError` decorations
for Vitest stderr and build warnings are included. Build exit is 0; existing
plugin-timing/chunk-size warnings are retained.

**Focused phone + desktop chart-locator coverage (exit 0)**

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/AppShell.chartHighlight.test.tsx src/facility/characterInspect.test.ts
```

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/mobile src/AppShell.chartHighlight.test.tsx src/facility/characterInspect.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  41 passed (41)
      Tests  493 passed (493)
   Start at  11:20:41
   Duration  7.76s (transform 7.08s, setup 0ms, import 22.78s, tests 4.91s, environment 2ms)
```

**FULL player suite (exit 1)**

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 738ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 78ms
npm.cmd : 
At line:3 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'

Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."

 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
     83|     const pending = state.encounters[encounterId]!.pendingResult!;
     84|     expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needl…
     85|     expect(chart(state, encounterId).pendingLabel).toContain("Off-site…
       |                                                    ^
     86|     expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).t…
     87|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 201 passed (202)
      Tests  1 failed | 1737 passed (1738)
   Start at  11:21:05
   Duration  36.65s (transform 10.31s, setup 0ms, import 65.91s, tests 64.78s, environment 11ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

**Root typecheck (exit 0)**

```powershell
npm.cmd run typecheck
```

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

**Player build (exit 0)**

```powershell
npm.cmd run build --workspace @gamify-surgery/player
```

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 681 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.33 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell--SJJm06a.css                                  34.30 kB │ gzip:     6.11 kB
dist/assets/index-LZbQwf0F.css                                       163.50 kB │ gzip:    30.40 kB
dist/assets/MobileEntryPresentation-Cq0pE8nx.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-D_2tE3x1.js                                  103.26 kB │ gzip:    27.48 kB
dist/assets/index-CemJVsUp.js                                      8,242.46 kB │ gzip: 1,822.34 kB

npm.cmd : [PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
At line:3 char:1
+ npm.cmd run build --workspace @gamify-surgery/player *> .local-dev/mo ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([PLUGIN_TI...is a breakdown::String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
  - forbid-private-clinical-modules (86%)
  - vite:prepare-out-dir (8%)
See https://rolldown.rs/reference/InputOptions.checks#plugintimings for more details.

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: 
https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.46s
```

**Preservation audit (exit 0)**

```powershell
python .local-dev/mobile-mb9b/audit.py verify
```

```text
PASS: all 771 protected existing paths, including FacilityScene and all 163 existing non-mobile player tests, are byte-unchanged.
PASS: 12 changed/new phone source/test files are UTF-8 without BOM and LF; shared documents append-only.
Owned paths: apps/player/src/mobile/MobileHelpTopic.tsx, apps/player/src/mobile/MobileShell.test.tsx, apps/player/src/mobile/MobileShell.tsx, apps/player/src/mobile/MobileTopBar.tsx, apps/player/src/mobile/build/MobileBuild.test.tsx, apps/player/src/mobile/build/MobileBuildControls.tsx, apps/player/src/mobile/build/useMobileBuild.ts, apps/player/src/mobile/mobileOwnerFollowup.test.tsx, apps/player/src/mobile/mobilePolish.css, apps/player/src/mobile/mobileShell.css, apps/player/src/mobile/tutorialTargets.test.tsx, apps/player/src/mobile/tutorialTargets.ts
```

Evidence: [focused log](../../.local-dev/mobile-mb9b/focused.log),
[FULL player log](../../.local-dev/mobile-mb9b/player-full.log),
[typecheck](../../.local-dev/mobile-mb9b/typecheck.log),
[build](../../.local-dev/mobile-mb9b/build.log),
[preservation report](../../.local-dev/mobile-mb9b/preservation.json),
[actual scoped diff](../../.local-dev/mobile-mb9b/scoped.diff) and
[validated source hashes](../../.local-dev/mobile-mb9b/validated-source.json).
The 866-path supplied-tree snapshot and copied originals are in
`baseline.json` / `before/`. All 771 protected existing paths, the entire
`FacilityScene.ts`, and all 163 existing non-mobile player tests are
byte-unchanged. All 12 owned phone source/test files are UTF-8 without BOM and
LF; prior shared document bytes are preserved as append-only prefixes.

Iteration evidence: [initial bounded run](../../.local-dev/mobile-mb9b/initial-focused.log)
had 7 failed / 111 passed due to six test assertions looking for the actor
name inside the inspector body (the name is in its sheet heading), plus a
new test fixture missing the selected room for the shared wall-owner picker.
The corrected bounded run was **4 files / 118 tests passed**
([exact output](../../.local-dev/mobile-mb9b/repaired-focused.log)). The first
expanded run had **1 failed / 492 passed** because its new toast-expiry
assertion also matched the unchanged screen-reader session announcement;
it now checks the toast element itself
([exact output](../../.local-dev/mobile-mb9b/focused-attempt-1.log)). These were
phone test-fixture/assertion corrections; no desktop expectation or game rule
was changed. The final focused/full runs above cover the final source state.

### Manager QA steps and remaining acceptance

1. Inspect the actual MB9b scoped diff, retain MB9 and concurrent manager
   patient-highlight work, and rerun default-pool player tests in the manager
   environment, typecheck and build. Only the known thyroid failure is allowed.
   Worker CLI validation is complete; no real browser/iPhone pass is claimed.
2. Use a fresh disposable browser context/profile at
   `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof` for
   synthetic fixtures; confirm `location.origin === 'http://127.0.0.1:5184'`.
   Check 360 × 740, 390 × 844, 412 × 915, 844 × 390 and 768 × 1024, DPR 3 and
   actual iPhone Safari. This QA origin/profile has separate saves; never seed
   an owner's persistent campaign for destructive/synthetic tests.
3. Doors: place a room using its paid ghost + Place, then tap a green wall once
   without reopening the tool. Exactly one door should appear through the
   normal command receipt/history, with no additional payment. Tap an existing
   removable door once: immediate removal, **Door removed · Undo**; test toast
   Undo and persistent Undo after the three-second toast disappears. Repeat
   illegal public entrance, blocked edge and distant floor taps: actual reason
   or no target, no command/cash/save/history change. Pan, pinch and pointer
   cancellation must not place/remove anything. Confirm no Add/Remove button
   remains, and tutorial/help point to wall taps.
4. Exit Doors with Room catalog, the Build tab, another catalog room/hallway or
   Move tool, and Done. Done must turn the tool off even when the original room
   access guard keeps Build open and explains how to fix it; confirm legal
   Done still restores the pre-Build clock state. No catalog/tool path may
   silently leave active wall-edit input underneath.
5. Playback: both Pause and Play are visible, adjacent and at least 44 × 44px;
   the selected state is visibly darker/high contrast. At **360px**, assert the
   top bar's scroll width does not exceed its client width, labels remain
   legible and More/Speed are reachable; repeat landscape/safe areas. Tap the
   active control repeatedly: no state flip. Tap the other: one clock change;
   stale rapid activation must not toggle back. Test facility progress at
   1×/2×/4×, pause hold, and both disabled with the visible Build, Management
   or reference lock reason. Speed remains unchanged.
6. Map character taps: a checked-in waiting patient and an existing active
   patient open the real chart in one tap; a linked pediatric parent opens
   the child's chart. No inspector/extra Open button precedes it, and no
   automatic pause/speed change occurs. Check a child approaching or waiting
   for reception, a filed patient, staff, service/retail visitors and ordinary
   unlinked companions: one inspector, no chart. Test original feedback/close
   guards when switching charts, denied opens, browser Back and chart Close.
   Drag/pinch starting on a character must never issue a chart open.
7. Recheck MB9 consult cooldown fill/one payment, immediate founder floor/seat
   legality, no double-tap delay/zoom, pinch/drag and the 44px recenter control.
   Paid construction, selling, firing, restart/campaign switching and other
   deliberate confirmations must still work as recorded in the MB9 audit.

Owner pathways are unchanged: local `START_GAME.cmd` → exact
`http://127.0.0.1:4173`; private iPhone `START_PRIVATE_GAME.cmd` →
`https://melissadesktop.taile197db.ts.net/`; canonical remote
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Distinct origins/profiles
retain separate saves. No game server, browser or owner storage was touched by
this worker. **Local-only checkpoint:** manager owns acceptance and the
owner's **"push to GitHub"** backup reminder; no backup/publish operation is
claimed.


## MB9c: door tap fix

2026-10-10 — Sol worker follow-up to the manager's 360×740, DPR2 Chrome
shared-wall repro. **Root cause: stale phone pointer scaling after a canvas
resize.** Phaser Scale.NONE `refresh()` calculates `canvasBounds` and
`displayScale` before emitting RESIZE; the phone DPR listener then changes
the CSS height. Switching from the ghost controls to the shorter Doors bar
expands the map but leaves the old touch scale. The wall highlight uses the
new layout while the tap is mapped below it, outside the picking radius;
no door command reaches the session. The regression's real 370→461 resize
reproduces the count staying at one. This is independent of door legality.

The phone resolution helper now refreshes bounds and derives displayScale
from **logical baseSize / actual CSS bounds** after updating the CSS box.
It does not call refresh() inside RESIZE (which would recurse), alter the
DPR cap, or change camera, session, build, clock or desktop behavior.

Files changed:

- `apps/player/src/mobile/performance/canvasResolution.ts` — synchronize
  phone touch bounds after the DPR helper's CSS resize.
- `apps/player/src/facility/FacilityScene.ts` — pass ScaleManager to that
  helper inside the existing `mobileInput === true` create seam (one line).
- `apps/player/src/mobile/build/MobileBuild.test.tsx` — non-rendering scene
  integration using actual FacilityScene input/picking/wall geometry, native
  Phaser ScaleManager/InputManager/Pointer/InputPlugin and the real shared
  session. Fresh campaign, Front Desk (33,28,5×4), Examination Room (34,26),
  $160 paid placement, three green south sections, DPR2 720×922 backing,
  80ms CSS tap (180.5,528.5): doors 1→2 with exactly one applied PLACE_DOOR
  receipt, no door charge and access guard cleared. Tapping the same existing
  door removes it, shows `Door removed · Undo`, and toast Undo restores the
  exact prior state. Existing persistent Undo/radius/illegal/stale-tap tests
  remain in the focused suite. The regression failed before the fix and
  passes after it; graphics/boot are not rendered in this harness.

| Interaction audit update | Result / retained reason |
| --- | --- |
| Doors after paid room placement | One wall tap adds/removes through original commands; the canvas resize now preserves target coordinates. |
| Room construction; sale; firing; restart/campaign switching | Existing deliberate confirmations retained; purchases/irreversible actions stay guarded. |
| Door removal Undo | Brief toast Undo and persistent build Undo retained; no extra confirmation. |

Validation used the **checked-in default configs**, `--pool=threads` and:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile/build/MobileBuild.test.tsx src/mobile/build/sceneBuild.test.ts src/mobile/performance/canvasResolution.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/AppShell.chartHighlight.test.tsx src/facility/characterInspect.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
```

Exact focused output (exit 0):

```text
 Test Files  41 passed (41)
      Tests  494 passed (494)
   Start at  11:51:54
   Duration  8.83s (transform 9.11s, setup 0ms, import 25.78s, tests 6.05s, environment 2ms)
```

Exact FULL output summary (exit 1, **only known thyroid failure**, unchanged
`src/session/surgeryCenterServicePreviews.test.ts:85:52`):

```text
 Test Files  1 failed | 201 passed (202)
      Tests  1 failed | 1738 passed (1739)
   Start at  11:52:11
   Duration  35.84s (transform 8.76s, setup 0ms, import 64.01s, tests 63.25s, environment 12ms)
```

Root typecheck: exit 0, all seven workspace checks. Player build: exit 0,
681 modules transformed; `✓ built in 2.93s`; main chunk 8,242.64 kB (gzip
1,822.40 kB), existing large-chunk warning. Raw complete exact output:
[before regression](../../.local-dev/mobile-mb9c/resize-before.log),
[three-file regression pass](../../.local-dev/mobile-mb9c/resize-after.log),
[focused](../../.local-dev/mobile-mb9c/focused.log),
[FULL](../../.local-dev/mobile-mb9c/full-player.log),
[typecheck](../../.local-dev/mobile-mb9c/typecheck.log),
[build](../../.local-dev/mobile-mb9c/build.log).
Preservation evidence and source hashes:
[scoped diff](../../.local-dev/mobile-mb9c/scoped.diff),
[audit](../../.local-dev/mobile-mb9c/preservation.json),
[validation](../../.local-dev/mobile-mb9c/validation.json).
All **770 protected paths and 163 existing non-mobile player tests** are
byte-unchanged from the supplied MB9b/manager tree; only the one flagged
Scene call changes. Three source/test files are UTF-8 without BOM, LF;
shared documents are append-only. No Git, installs, agents, external messages,
rule/clinical/save changes or owner storage operations.

Manager QA:

1. Rerun the original `.local-dev/mobile-mb9/manager-door-repro.cjs` against
   fresh disposable storage at exact
   `http://127.0.0.1:5184/?layout=phone&prototype-tools=1&facility-gait-proof`
   (360×740, DPR2, isMobile + hasTouch). This QA origin/profile has separate
   saves from owner local/private/remote playtesting. Place exam (34,26)
   above Front Desk; one 80ms tap (180.5,528.5) must add the shared-wall door,
   doors 1→2, no extra money charged, NO ACCESS cleared; Done must succeed.
2. Before Done, tap the added door once: doors 2→1 and `Door removed · Undo`.
   Tap toast Undo: doors 1→2. Repeat removal, wait for the toast to expire,
   use persistent Undo: doors 1→2. Illegal/far taps must preserve the map
   and original reasons/radius. Repeat after ghost/Doors/catalog height
   changes, rotation, pinch/drag and recenter at DPR1/2/3.
3. Recheck the MB9b playback/chart and MB9 consult/movement controls, and
   desktop mouse Build/doors. Worker Chrome launch returned `spawn EPERM`;
   actual browser/iPhone replay remains manager acceptance. The scene test
   reproduces the exact shared-wall picking path and real resize order;
   it is not a claimed browser render.

Owner origins and launchers stay unchanged. Local-only checkpoint; manager
owns acceptance and the owner's **"push to GitHub"** backup reminder.

## Manager acceptance: owner feedback round 1 (2026-10-10)

MB9/MB9b/MB9c ACCEPTED after Chrome touch QA (Playwright isMobile+hasTouch, CDP touch): GLP-1 consult progress chip present; map -/+ and % removed, recenter kept; separate Pause/Play with darker active state (Build lock shown); one-tap door: exam room placed above Front Desk, single tap on the green shared-wall section -> 'Door placed for $0', doors 1->2, Done exits Build (MB9c fixed stale Phaser touch scaling after the Doors bar resized the canvas); tapping the pediatric patient on the map opens Noah Bennett's chart sheet directly; no page errors. Desktop click-patient-highlights-chart (owner request) also accepted: clicking checked-in Noah on the desktop map gives the Waiting row a 2 s gold highlight, desk unchanged.


## MB10: owner feedback round 2

2026-10-10 — Sol worker for the Claude Code "GamifySurgery manager".
The phone layout and requested CLI validation are ready for manager review.
**Home reassignment remains an unresolved scope requirement:** there is no
existing shell/session callback or player command for it. Manager browser and
physical iPhone acceptance are still required; MB10 is not declared accepted.

### Phone layout and retained actions

- The GLP-1 consult chip is completely absent when the existing projection's
  `automationCapacity > 0`, including an older projection with `visible: true`.
  Before coverage, it occupies the map's top-left grid cell. Goals occupies
  the top-right cell, which stays on the right when the consult disappears.
  The original cooldown, one-tap payment/duplicate guard, Build guard and ready
  Goals Advance callback are retained. GLP-1 information is available through
  More and the bottom of Alerts even with staffed coverage.
- Advertising has no map chip. Manage → Money → Advertising opens its original
  level controls; the existing More/alert route also remains reachable.
- Manage retains Employees / Services / Money and the original mode pause/Done
  behavior. A single four-column strip shows staff, payroll, average morale
  and Training Room usage. Root screens contain three-column tile grids at
  phone widths, with `minmax(0, 1fr)` and 44px minimum controls.
- Employees uses short role labels, a role glyph or existing representative
  portrait, staffed/capacity badge and status dot/label. Status uses the supplied
  hire guard, the existing configured unhappy-staff boundary, current training,
  active payroll/employee warnings and projected roster departures. Zero-capacity
  empty roles and supplied locked roles share one collapsed **Locked / not built
  yet** row. The live projection already omits later-level roles; the grouped
  sheet retains the explanation that more roles unlock as the clinic develops,
  rather than inventing names or counts for missing projection rows.
- A role opens its hire price/disabled reason, capacity guidance and employee
  portrait grid. Each employee opens activity, actual home, morale, salary
  steps, current/quoted training, Praise and the original Fire confirmation
  including the queued-training refund. Training prices, duration/departure
  wording and all command arguments/guards are preserved. Browser Back/Escape
  first cancels a confirmation, then leaves employee/role details, and only at
  the Manage root invokes the original management exit. Detail Back buttons
  and focus restoration are presentation-only; covered overview controls are
  inert while a detail is open.
- Services has compact global appointments On/Off and Lab queue/Queue controls
  at the top. Each service tile shows its name, fee and Running / Needs setup /
  Off status. Its sheet retains cadence, stock/contribution, setup requirements,
  Build/Hire actions, the global appointment toggle for scheduled lines, queue
  and assigned provider/team. In-progress work, read totals and upkeep/quality/
  breaks have their own tiles. Large service catalogs can still need grid
  scrolling; the expanded cards are confined to detail sheets.
- Money has four tiles: Net / hr, Income / hr, Costs / hr and Advertising.
  Their sheets retain the actual income-window label/explanation, every income
  and cost row, since-opening totals, recorded service totals, cash/runway,
  cash explanation and all recent-payment facts. Legacy finance fallbacks and
  advertising bounds remain. No economy values are calculated anew.
- Patients keeps Waiting and Existing expanded. Resolved starts as a single
  count row, including filed team discussions, and expands/collapses on tap.
  Frozen metadata, newest-first ordering and original patient/discussion IDs
  remain behind the expanded row.

### Scope exception: home reassignment

MB4 recorded this same absence. This worker rechecked `AppShell.tsx`, the
shared shell contract, `usePrototypeSession.ts`, Management/Staff panels and
the domain command types. They supply no manual home-reassignment action.
`homeRoomInstanceId` is existing domain state assigned automatically by the
staff/home selection logic. The employee sheet therefore displays its real
home and explains automatic assignment; it does not offer a fake action or
substitute firing/hiring for reassignment. **Manager next:** resolve/brief a
separate bounded command + callback milestone if manual home reassignment is
required. Such a change is outside MB10's hard presentation-only rule. No
owner decision or clinical approval is inferred from passing software tests.

### Files changed and desktop preservation

- `apps/player/src/mobile/MobileGoals.tsx`
- `apps/player/src/mobile/MobilePatients.tsx`
- `apps/player/src/mobile/MobileQuickControls.tsx`
- `apps/player/src/mobile/MobileScreenFlows.test.tsx`
- `apps/player/src/mobile/MobileScreens.test.tsx`
- `apps/player/src/mobile/MobileShell.test.tsx`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/manage/MobileEmployees.tsx`
- `apps/player/src/mobile/manage/MobileManage.test.tsx`
- `apps/player/src/mobile/manage/MobileManage.tsx`
- `apps/player/src/mobile/manage/MobileManageSheet.tsx`
- `apps/player/src/mobile/manage/MobileManageTile.tsx`
- `apps/player/src/mobile/manage/MobileMoney.tsx`
- `apps/player/src/mobile/manage/MobileServices.tsx`
- `apps/player/src/mobile/manage/glp1QaFixture.test.tsx`
- `apps/player/src/mobile/manage/glp1QaFixture.ts`
- `apps/player/src/mobile/manage/manageSessionFlows.test.tsx`
- `apps/player/src/mobile/manage/mobileManage.css`
- `apps/player/src/mobile/manage/providerProjection.test.tsx`
- `apps/player/src/mobile/manage/qaManageFixture.test.tsx`
- `apps/player/src/mobile/manage/testFixtures.ts`
- `apps/player/src/mobile/mobileOwnerFeedback.test.tsx`
- `apps/player/src/mobile/mobileOwnerRound2.test.tsx`
- `apps/player/src/mobile/mobileScreens.css`
- `apps/player/src/mobile/mobileShell.css`
- `apps/player/src/mobile/patientCardFields.test.tsx`
- `apps/player/src/mobile/performance/mobilePerformanceFlows.test.tsx`
- `apps/player/src/mobile/testDom.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/types.ts`
- `tools/qa/level-four-rooms-bootstrap.ts`

The only shared projection addition is optional
`ServiceIncomeOperationView.incomeLineId`, populated from the two existing
service/retail records. It allows precise per-service queue/provider grouping,
including work whose displayed name differs from its catalog line. Outside
reads without that identity remain in In progress / Read totals; legacy
projections use their existing display label. Desktop ignores this field.

The sole non-mobile QA edit adds `?glp1=np-hired` to the guarded existing
5184 bootstrap, with a distinct `.glp1-np-hired` campaign suffix. Its mobile
fixture uses real placement, door, hire and clock commands, stops once the NP
has operational coverage, and restores the original pause state. The original
APP fixture is immutable in the regression. This factory is not imported by
the production entry. No owner storage was opened or seeded by the worker.

The mobile test DOM now implements Text.nodeValue, so updated badges/status
labels are actually reconciled by React instead of yielding stale test text.
Owned phone tests were updated to navigate the new detail sheets; none of the
existing non-mobile test expectations changed.

The filesystem audit captured the supplied tree before edits without Git.
**780 protected paths and all 163 existing non-mobile player tests are
byte-unchanged.** Removing only the optional identity additions reconstructs
both entire projection files after LF normalization. Desktop Services, Money
and Management markup is also compared byte-for-byte with/without the optional
provider/identity fields. App, AppShell, FacilityCanvas/Scene, session commands,
domain, balance, clinical content, save/persistence, desktop styles/input/art
loading and all launchers remain unchanged. All 31 changed/new source/test/QA
files are UTF-8 without BOM and LF. This plan and CURRENT_THREAD_HANDOFF are
append-only; existing shared-document bytes are preserved.

Built desktop `index-LZbQwf0F.css` is byte-identical to the supplied dist:
163,503 bytes, SHA-256
`a2ce6882f18a40306a9ed0fcce81c518dd0e0099920ca891defc3dc51c381f82`.
The HTML includes only the main entry/desktop stylesheet; phone JS/CSS remain
separate lazy assets. This compares the owner's current desktop highlight
baseline, not the earlier pre-highlight MB1 stylesheet.

### Validation commands and exact output

Used the **checked-in default configurations**, `--pool=threads` for tests and
the specified net-use EPERM preload. No installs, excluded tests, alternative
configurations or desktop expectation edits. Commands from repository root:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/ui/ManagementPanel.test.tsx src/ui/StaffPanel.test.tsx src/ui/ServiceIncomePanel.test.tsx src/ui/MoneyPanel.test.tsx src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/level3ControlsViewModels.test.ts src/AppShell.chartHighlight.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
node tools/qa/level-four-rooms.mjs --check
python .local-dev/mobile-mb10/audit.py verify
```

Focused (exit 0):

```text
 Test Files  49 passed (49)
      Tests  554 passed (554)
   Start at  13:29:15
   Duration  9.74s (transform 9.03s, setup 0ms, import 28.29s, tests 6.20s, environment 3ms)
```

FULL player (exit 1, **only the known thyroid failure**, unchanged
`src/session/surgeryCenterServicePreviews.test.ts:85:52`):

```text
FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
AssertionError: expected 'The result is pending. Patient care a…' to contain 'Off-site thyroid fine-needle aspirati…'
Expected: "Off-site thyroid fine-needle aspiration"
 Test Files  1 failed | 203 passed (204)
      Tests  1 failed | 1750 passed (1751)
   Start at  13:30:36
   Duration  37.17s (transform 7.74s, setup 0ms, import 65.48s, tests 65.81s, environment 12ms)
```

Root typecheck (exit 0; all seven workspaces), exact output:

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

Player build (exit 0), exact text output (terminal erase controls omitted):

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 683 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.34 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-B9Hl8Sdx.css                                  38.12 kB │ gzip:     6.61 kB
dist/assets/index-LZbQwf0F.css                                       163.50 kB │ gzip:    30.40 kB
dist/assets/MobileEntryPresentation-DCIMMOy6.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-_tBZZP-9.js                                  112.90 kB │ gzip:    29.82 kB
dist/assets/index-jjeMk6D3.js                                      8,242.70 kB │ gzip: 1,822.40 kB

✓ built in 2.45s
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

QA entry transform (exit 0; middleware-only, no listener or browser storage):

```text
1:27:15 PM [vite] (client) Re-optimizing dependencies because vite config has changed
1:27:16 PM [vite] (client) [optimizer] scanning dependencies...
QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.
```

The existing main-chunk size warning remains. Initial broad checks found two
old phone navigation assertions needing tile/sheet traversal and two typing
mistakes in new synthetic test fixtures; these were corrected before the final
focused/FULL/typecheck/build runs. No failure was hidden or desktop expectation
relaxed. The new 12 cases plus retained MB4 parity cover coverage disappearance,
corner hooks, advertising location/arguments, root badges/counts/statuses,
grouped locked roles, each original Manage action, confirmation and local Back,
service identity grouping and default Resolved collapse. DOM/scoped-CSS checks
are not physical target or page geometry measurements.

Complete exact raw logs and reproducible evidence:
[focused](../../.local-dev/mobile-mb10/focused.log),
[FULL](../../.local-dev/mobile-mb10/full-player.log),
[typecheck](../../.local-dev/mobile-mb10/typecheck.log),
[build](../../.local-dev/mobile-mb10/build.log),
[QA entry](../../.local-dev/mobile-mb10/qa-entry.log),
[scoped diff](../../.local-dev/mobile-mb10/scoped.diff),
[source preservation](../../.local-dev/mobile-mb10/preservation.json),
[desktop CSS](../../.local-dev/mobile-mb10/build-preservation.json),
[commands/exit codes](../../.local-dev/mobile-mb10/validation.json).
Baseline/before-images and verification scripts are in `.local-dev/mobile-mb10/`.
No actual browser render or real-iPhone PASS is claimed.

### Manager QA steps and next action

1. Inspect the actual scoped diff and evidence; rerun the default-config player
   checks in the manager environment as required. Resolve the home-reassignment
   scope exception. Worker validation is complete, not manager acceptance.
2. Start/reuse `node tools/qa/level-four-rooms.mjs`. Use a fresh disposable
   browser context/profile at the exact staffed fixture:
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments&layout=phone**.
   Confirm `location.origin === 'http://127.0.0.1:5184'`. This QA origin/profile
   has separate saves from owner local, private iPhone and remote playtests.
   Check 390×844 first, then 360×740, 412×915, 844×390 and 768×1024, DPR 3 and
   real iPhone Safari. Measure document/sheet scrollWidth <= clientWidth,
   >=44×44px interactive targets, readable count/fee/status labels and safe
   areas; watch page errors. Employees/Money should stay compact; inspect the
   mature Services grid's necessary scroll and every detail sheet.
3. Clinic: GLP-1 consult at top-left, Goals at top-right, no Advertising chip.
   Recheck original cooldown fill, one consult/one payment, rapid activation
   and Build guard. Open More → GLP-1 consult info and Alerts; details remain.
4. For working NP coverage, open the distinct fixture campaign:
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments&glp1=np-hired&layout=phone**.
   The real NP is operational and the projection has capacity 1. The consult
   chip and its coverage reason must both be absent. Goals stays at top-right;
   More and Alerts still show GLP-1 information. Check the GLP-1 NP role's 1/2
   badge and real home. Use a fresh context to replay a fixture, instead of
   overwriting or clearing the owner's campaigns.
5. Manage → Employees: strip count/payroll/morale/training match desktop; APP
   role shows 2/2 with its existing maximum-hire reason in the role sheet.
   Empty roles share one grouped row. Open a role, then each portrait: name,
   activity, home, salary bounds, training quote/Cancel/Confirm, active/queued/
   max state, Praise, Fire Cancel/Confirm and queued refund. Check training or
   employee alerts and repeated service Hire guidance still open the correct
   details without automatically buying anything. Verify status markers after
   actual hiring, training, morale/payroll changes and departure. Home remains
   automatic pending the separate manager decision described above.
6. Services: global On/Off sends the original booleans; Lab Queue keeps the
   original guard/reason. Open Running / Needs setup / Off tiles and compare
   fee, cadence, stock, provider, queue and requirement to desktop. Exercise
   Build and Hire setup, repeated Hire guidance, scheduled-line toggle and the
   contextual Turn on. Open In progress, Read totals and Upkeep/quality; no
   provider may be inferred from a visitor name. Build must still wait for
   Manage exit props, enter once and arm the same room definition.
7. Money: open all four tiles and compare the actual income window, every
   income/cost source, opening totals, stock, cash/runway, service totals and
   all six recent-payment facts. Advertising +/- sends one adjacent level
   and preserves bounds; it does not appear on the map. Check an early clinic's
   labels too. Back returns to the grid without dispatching a game command.
8. Patients: use a disposable campaign with Waiting, Existing and filed charts
   (the same QA entry's `?apps=pedcharts&layout=phone` can supply scored chart
   play). File a chart, then enter Patients: Waiting/Existing stay expanded;
   Resolved is one count row. Tap to expand, check newest-first/frozen metadata
   and read-only filed discussions, then collapse; disclosure alone opens no
   chart. Patient taps retain the exact encounter ID and chart guards.
9. From running and already-paused clinics, check mode restoration through
   Done, tab switches, Close and browser Back. Within Manage, Back first cancels
   Train/Fire, leaves employee, leaves role, then exits through the original
   session path; no accidental payment/fire or pause/speed change. Recheck the
   phone tutorial hire step with the new role → Hire flow. Recheck MB9b/MB9c
   playback, direct patient map taps, one-tap doors and paid construction.
10. At desktop 1600×1000 with `?layout=desktop`, compare original Management,
    mouse input and network: no MobileShell JS/CSS download. No desktop source
    or expectation was edited for MB10. Manager/owner physical QA remains the
    acceptance step after this handoff.

Owner opening pathways remain unchanged: local `START_GAME.cmd` → exact
`http://127.0.0.1:4173`; private iPhone `START_PRIVATE_GAME.cmd` →
`https://melissadesktop.taile197db.ts.net/`; canonical remote
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Different origins/profiles
keep separate saves. No Git, installs, agents, external messages, clinical
content/review changes, save changes, server listener or owner storage actions.
**LOCAL ONLY checkpoint:** no GitHub backup was created. Manager owns actual
acceptance and the owner's **"push to GitHub"** reminder/scoped backup.


## MB10b: services grouping

2026-10-10 — Sol worker for the Claude Code "GamifySurgery manager".
Manager reported MB10 Chrome touch QA at 390×844 passing chip corners,
staffed NP chip disappearance, Employees/Locked/portrait sheets, Money with
Advertising, and collapsed Resolved. **Manager accepted automatic homes:**
there is no reassignment command. This supersedes MB10's home scope exception.
MB10b implements the requested Services follow-up; manager browser acceptance
of this follow-up remains pending.

### Layout and retained actions

Only Running or Off/paused services occupy individual tiles. All projected
`needs` services share **Needs setup · N services**, with a count badge and
attention marker. Later-level `future` services join that group instead of
appearing as Off; each detail retains its original Facility Level explanation.
The group opens compact 44px-minimum button rows. Each row opens the existing
service detail with full fees, cadence, provider, queue, setup requirements,
Build/Hire actions and appointment controls. Detail Back/Escape/browser Back
returns to the setup list, then Services, before the original Manage exit.
Global Scheduled appointments and Lab queue controls stay at the top.

Service tile and setup-row fee hints use the first projected dollar amount,
dropping only `.00`: routine endoscopy's `$600.00 per scheduled visitor ·
$450.00 question-ordered` becomes **$600**. Substantive cents remain, and an
APP training range uses its first amount. Full text stays unchanged in the
detail. Scoped `white-space: nowrap`/ellipsis keeps hints on one line; no
economy value, provider, price, cadence, callback argument or guard is rebuilt.
No changes to the accepted Employees, Money, map or Patients behavior.

### Files changed and preservation

- `apps/player/src/mobile/manage/MobileManage.test.tsx`
- `apps/player/src/mobile/manage/MobileServices.tsx`
- `apps/player/src/mobile/manage/MobileServicesGrouping.test.tsx`
- `apps/player/src/mobile/manage/manageSessionFlows.test.tsx`
- `apps/player/src/mobile/manage/mobileManage.css`
- `apps/player/src/mobile/manage/qaManageFixture.test.tsx`
- `apps/player/src/mobile/mobileOwnerRound2.test.tsx`
- `docs/execplans/mobile-version-20261009.md` — this appended handoff.
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` — appended follow-up handoff.

Before-images, hashes and an actual scoped diff were captured without Git.
All **783 protected paths**, including the projection files, and **163 existing
non-mobile player tests** are byte-unchanged from the supplied MB10 checkpoint.
All seven changed/new mobile source/test files are UTF-8 without BOM and LF;
shared documents retain their original bytes and receive only this append.
The built desktop stylesheet remains `index-LZbQwf0F.css`, **163503 bytes**,
SHA-256 **a2ce6882f18a40306a9ed0fcce81c518dd0e0099920ca891defc3dc51c381f82**.
Desktop source, expectations, inputs, game rules, save format and QA bootstrap
were not edited. Main and mobile chunks remain separate; only their generated
references/names change. Existing build size warning is unchanged in kind.

### Validation: exact commands and output

Used the checked-in default configs with **`--pool=threads`**, no test
exclusions/alternative config, and the requested preload on every command:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

`NO_COLOR=1` was also set for readable captured logs. Ten new cases cover the
real Level 4 APP fixture's grouped count, all setup detail routes, future
unlock/stock details, empty-group omission, four fee examples, setup-row full
fee parity, browser Back and scoped single-line/44px rules. MB4 parity tests
retain exact callback/argument assertions, staged Build, repeated Hire guidance,
disabled Lab queue, global/contextual appointments and all other Manage actions.
DOM/CSS checks do not claim physical viewport measurements.

Focused — `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/ui/ManagementPanel.test.tsx src/ui/StaffPanel.test.tsx src/ui/ServiceIncomePanel.test.tsx src/ui/MoneyPanel.test.tsx src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/level3ControlsViewModels.test.ts src/AppShell.chartHighlight.test.tsx`; exit **0**:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/mobile src/ui/ManagementPanel.test.tsx src/ui/StaffPanel.test.tsx src/ui/ServiceIncomePanel.test.tsx src/ui/MoneyPanel.test.tsx src/session/managementViewModels.test.ts src/session/employeeTrainingViewModels.test.ts src/session/level3ControlsViewModels.test.ts src/AppShell.chartHighlight.test.tsx


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  50 passed (50)
      Tests  564 passed (564)
   Start at  13:51:55
   Duration  9.14s (transform 7.42s, setup 0ms, import 26.20s, tests 5.78s, environment 3ms)
```

FULL player — `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`; exit **1**:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/surgeryCenterServicePreviews.test.ts (13 tests | 1 failed) 542ms
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 54ms

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


 Test Files  1 failed | 204 passed (205)
      Tests  1 failed | 1760 passed (1761)
   Start at  13:52:14
   Duration  35.48s (transform 7.59s, setup 0ms, import 63.16s, tests 62.38s, environment 11ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads
```

Root typecheck — `npm.cmd run typecheck`; exit **0**:

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

Player build — `npm.cmd run build --workspace @gamify-surgery/player`; exit **0**:

```text
> @gamify-surgery/player@0.0.1 build
> vite build

vite v8.1.5 building client environment for production...

transforming...✓ 683 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.54 kB │ gzip:     0.34 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff      14.02 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff      14.29 kB
dist/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2     17.20 kB
dist/assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2     17.52 kB
dist/assets/MobileEntryPresentation-D648DPo7.css                       2.74 kB │ gzip:     0.79 kB
dist/assets/MobileShell-Cli3yTCw.css                                  38.59 kB │ gzip:     6.67 kB
dist/assets/index-LZbQwf0F.css                                       163.50 kB │ gzip:    30.40 kB
dist/assets/MobileEntryPresentation-mdOMfj9w.js                        0.32 kB │ gzip:     0.21 kB
dist/assets/MobileShell-BemqZzkF.js                                  113.82 kB │ gzip:    30.09 kB
dist/assets/index-CQWIm8-x.js                                      8,242.70 kB │ gzip: 1,822.40 kB

✓ built in 2.49s
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

The FULL player suite's only failure remains the known thyroid assertion
at `src/session/surgeryCenterServicePreviews.test.ts:85:52`:
`pendingLabel` lacks “Off-site thyroid fine-needle aspiration.” No test or
expectation was changed for it. Final result: **50 focused files / 564 tests
PASS; FULL 204 files / 1760 tests PASS plus 1 known failure (205 files / 1761
total); root typecheck all seven workspaces PASS; player build PASS**.

Exact complete logs (ANSI controls removed only for the readable blocks above),
commands/exit codes, source hashes and diff:
[focused](../../.local-dev/mobile-mb10b/focused.log),
[FULL player](../../.local-dev/mobile-mb10b/full-player.log),
[typecheck](../../.local-dev/mobile-mb10b/typecheck.log),
[build](../../.local-dev/mobile-mb10b/build.log),
[validation](../../.local-dev/mobile-mb10b/validation.json),
[scoped diff](../../.local-dev/mobile-mb10b/scoped.diff),
[preservation](../../.local-dev/mobile-mb10b/preservation.json),
[desktop CSS](../../.local-dev/mobile-mb10b/build-preservation.json),
[validated sources](../../.local-dev/mobile-mb10b/validated-source-hashes.json).
Reproducible scripts and baseline images remain in `.local-dev/mobile-mb10b/`.

### Manager QA and next action

1. Inspect the scoped diff and exact validation output. Start/reuse
   `node tools/qa/level-four-rooms.mjs`. Open a fresh disposable browser context
   at **http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments&layout=phone**.
   Confirm `location.origin === 'http://127.0.0.1:5184'`. This QA origin/profile
   has separate saves from owner local, private iPhone and remote playtests.
2. At 390×844 touch, open Manage → Services. Only Running/Off services have
   individual tiles; there is exactly one **Needs setup · N services** tile
   whose badge matches the projected missing-setup/later-level count. Check
   the compact root's height, remaining utility tiles, global On/Off and Lab
   queue. Repeat at 360×740; measure no horizontal overflow, >=44px targets,
   one-line fee hints and page errors.
3. Open the grouped tile. Every setup service appears once as a compact row.
   Open Routine endoscopy: the row/tile hint is **$600**, while the detail
   retains **$600.00 per scheduled visitor · $450.00 question-ordered** and
   original room/staff actions, cadence, provider/queue and appointments.
   Open another setup line; Build must still exit Manage before arming its
   original room, and Hire must guide to the same role without auto-hiring.
   Repeated Hire guidance and disabled Lab queue remain guarded.
4. Back/Escape/browser Back from a setup detail returns to the setup list;
   next Back returns to Services; only the next browser Back exits Manage,
   restoring the original running/paused state. Verify ordinary Running/Off
   details still return directly to Services and preserve full fee text.
5. Smoke the already accepted map, Employees, Money and Resolved flows, and
   desktop `?layout=desktop`. NP QA still uses the separate campaign at
   **http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments&glp1=np-hired&layout=phone**.
   No worker browser/physical-phone PASS is claimed for MB10b.

Owner opening pathways stay unchanged: local `START_GAME.cmd` → exact
`http://127.0.0.1:4173`; private iPhone `START_PRIVATE_GAME.cmd` →
`https://melissadesktop.taile197db.ts.net/`; canonical remote
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Every distinct
origin/profile retains separate saves. No Git, installs, agents, external
messages, clinical/rule/save changes, server listener or owner-storage action.
**LOCAL ONLY checkpoint:** manager owns acceptance and the owner's
**"push to GitHub"** reminder/scoped backup; none was created by this worker.

## Manager acceptance: owner feedback round 2 (2026-10-10)

MB10 + MB10b ACCEPTED after Chrome touch QA (390x844): GLP-1 chip top-left, Goals top-right, Advertising removed from map and available as a Money tile sheet; GLP-1 chip absent in the ?glp1=np-hired fixture; Employees grid (role tiles with counts/status, single 'Locked / not built yet' tile, role sheet with portrait grid) fits one screen; Services shows only running services plus one 'Needs setup · 31 services' tile and In progress / Read totals / Upkeep tiles with one-line fees, no scroll; Money tiles; Resolved patients collapsed by default; no page errors. Homes remain automatic (no reassignment command exists). Owner-requested 'mobile-first' feedback mode recorded.

## App icon (2026-10-10)

Owner chose R3-04 'Late Light' (artifacts/app-icon-options-20261010/round3/icons/R3-04-late-light.png; rounds 1-3 kept as concept art). Manager generated apps/player/public/app-icon/{apple-touch-icon.png 180, favicon-32.png, icon-192.png, icon-512.png} and added to apps/player/index.html: rel=icon (32px PNG), rel=apple-touch-icon (180px), apple-mobile-web-app-title 'Stitchin' Time'. No web manifest / standalone display mode (iOS standalone web apps get separate storage; not changed). Verified: icons served 200 on 127.0.0.1:4173 and the private Tailscale origin; MobileShell/shellContinuity tests pass; build:pages PASS with base-prefixed /GamifySurgery/app-icon/ hrefs. Owner must remove and re-add the Home Screen shortcut for iOS to pick up the icon.
