# UI density audit and handoff — 2026-11-08

## Audit before implementation

All 28 manager screenshots in `.local-dev/ui-density-20261108/` were inspected:
10 at laptop 1366×768, nine at 1440×900, nine at phone 390×844. This includes
every clinic/chart, empty desk, new-room catalog, placement, Management entry,
Employees, Services, Money and Competition image; the duplicate clinic and
Management/Employees captures were also inspected. Phone images are 2× captures;
the estimates below are CSS pixels, not image pixels. Browser measurements after
implementation belong to the manager; none are claimed here.

| Screens | Observed problem | Planned change | Expected gain / acceptance target |
| --- | --- | --- | --- |
| Laptop clinic, both sizes | About 35 px blank band under the HUD; thick margins around three columns. | Remove empty header allocation; use compact laptop shell spacing and 13 px body text. | Recover about 30–35 px of workspace height; keep chart text and map behavior. |
| Laptop Build catalog, both sizes | Only 334/1126 px or 407/1093 px of the panel visible. Three toolbar rows; small center column beside mostly empty instructions. | Consolidate tools/tabs, tighten rows and use the side-column space during workspace modes; retain an unobstructed map for placing. | Roughly 60–100 px more usable list height and 20–40% more width; target at least 8 complete room choices at 1366×768. |
| Laptop Build placing, both sizes | Placement controls consume an extra row; important actions compete with the catalog. | Compact placement strip, existing direct selection/Undo, dense catalog with readable names/price/size; preserve Rotate/Cancel/Done. | About 30–50 px less fixed toolbar height; no new confirmation steps. |
| Laptop Employees, both sizes | Staff viewport 221/2586 px or 295/2586 px. Single employee card nearly fills it; role guidance and full-state explanations repeat. | Compact employee rows with identity, morale, pay and actions inline; optional guidance rather than repeated blocks; role-level Hire stays direct. | Employee row about 50–64 px instead of about 170 px; several employees visible together, materially shorter total scroll. |
| Laptop Services, both sizes | 217/2532 px visible at 1366; many serial full-width sections. | Tighter service rows and use the expanded workspace width for independent groups; preserve cadence/requirements and setup actions. | Target 5+ complete service rows at 1366×768, larger readable viewport. |
| Laptop Money, both sizes | Tall summary cards and repeated explanation above details. | Compact summary strip and explanation disclosure; compact ledger rows. | About 35–60 px recovered before the first income detail. |
| Laptop Competition, both sizes | Healthy empty state is already short; surrounding shell wastes area. | Reuse compact workspace/tab layout; leave data, membership and policy intact. | Shell gain only; no forced dense redesign of the board. |
| Phone clinic/chart | Stats and playback are large; local-save label consumes a separate row. Bottom navigation reserves excess space beyond safe area. | Two compact HUD rows, compact visible disclaimer/status, actual safe-area-only bottom padding. | About 35–50 px less header and 20–30 px less empty bottom band; no chart copy changes. |
| Phone Build catalog | Only four complete room cards visible; each has a large thumbnail, separate text rows and a full-width Details bar. Toolbar uses two rows plus repeated cash/paused text. | Compact room rows with small thumbnail/name and price·size·built; tools and New/My control share a strip. Details remain available through a compact row affordance. | Target 8–10 complete choices at 390×844; reduce total catalog height from 2264 px substantially. |
| Phone Build placing | Header, persistent build bar, hint and action row consume much of the map; room labels wrap heavily. | Header/control density, compact contextual hint; preserve primary Place/Rotate/Cancel targets and existing Undo. | About 50–80 px more usable map; room-renderer labels outside this lane. |
| Phone Employees | Redundant Close/Done rows, overview, two-row tabs and portrait tiles hide the roster behind another tap. | Compact management heading/overview, single-row accessible section tabs, dense role/employee presentation with direct existing safe actions. | About 60–100 px less fixed management chrome; more roles/rows without nested expansion. |
| Phone Services | Same management chrome plus very large '+' tiles. | Compact service rows; keep detailed cadence/requirements available on selection and direct setup actions. | About 60–100 px less chrome and 2× or better service density. |
| Phone Money | Large decorative tiles for four facts; otherwise empty. | Compact fact grid with readable values and existing detail actions. | About 50–80 px recovered; preserve finance explanation access. |
| Phone Competition | Tall shared chrome above a short unavailable-state message. | Shared compact header/tabs; preserve competition message and account behavior. | Shared chrome gain only. |

Constraints: phone body text ≥14 px, laptop body text ≥13 px; phone targets
≥40 px and primary actions ≥44 px. No gameplay, pricing, clinical text, save,
camera/renderer or auth behavior changes. Keep contrast/art, safe areas, keyboard
and screen-reader access, rejection reasons and confirmations for irreversible
actions. No new in-play Save/status UI. Chart changes only where a clear layout
gain exists. No Git, agents, installs, network or browsers. Shared tree; preserve
question, performance and earlier splitter/phone changes.

## Implementation, validation and handoff

Implemented locally; manager browser/visual acceptance is pending. No browser was
launched. The following after values are **CSS/structure estimates**, not measured
browser results. The new measurement spec records the actual numbers and fails
if the minimum visible-row targets are missed.

### Resulting layout

| Screen / menu | Before (manager measurement / screenshot) | Implemented / estimated after |
| --- | --- | --- |
| Desktop empty HUD band | Empty 30 px headline region plus surrounding spacing, about 35 px apparent gap. | Empty live region has zero height; a real six-second announcement overlays below the HUD without reallocating the map/desk. Compact grid padding recovers another few pixels. |
| 1366×768 Build | 334/1126 px viewport/content, four cards across, about five complete first-group cards visible. | Full workspace width by default in Build; roughly six 58–70 px cards across. Consolidated tools/tabs save about 60 px; about 420 px list viewport expected. Target ≥8 complete choices; likely 8–12 depending long labels/reasons. |
| 1440×900 Build | 407/1093 px, four cards across. | About 490 px list viewport expected, six cards across; same ≥8-row/item assertion. |
| Desktop Build placing | Extra status row and separate tool/tab rows. | One compact tool/tab strip; 28 px placement row keeps Rotate/Cancel, keyboard hints, access warning and all exit protections. Selection and existing Undo remain direct. |
| Desktop Employees | 221 px or 295 px staff viewport; tall cards, repeated guidance, 2586 px total content. | About 255/330 px viewport estimated; two independent role columns when ≥1120 px are available. Employees first, with identity/activity, morale, pay and actions in a 48 px minimum row. Target ≥3 complete employee rows (typically 4–6); all vacant/locked roles still follow. |
| Desktop Services | 217 px viewport / 2532 px content, serial full-width rows. | About 250 px viewport estimated; independent service rows form 2–3 columns at full workspace width. Target ≥5 complete service rows. Requirements, cadence, fees, lab queue and setup controls remain. |
| Desktop Money / Competition | Large repeated summary/chrome; Competition already concise. | Compact finance cards/explanations and shared 32 px tabs; Competition text/data unchanged. |
| Phone header | About 139 CSS px normal /155 CSS px in Build/Manage (2× screenshots). | Approximately 110/124 CSS px: two 44 px core rows, compact visible notice and optional lock line. Local-only label shares the XP caption. Cash still opens the full explanation; separate Pause/Play, speed and More remain. |
| Phone bottom band | A 32 px minimum session strip even while a sheet hides its links. | Zero reserved session-strip height. Existing Save & Close / Sign out links float on the lower-left map edge while visible; both remain in More/account controls. Bottom nav uses only its 48 px tabs, padding and actual safe-area inset. Recenter stays on the right. |
| Phone Build | 497 px sheet body /2264 px content, four complete room cards. | About 550 px body expected; duplicate cash/paused row removed (already in the HUD), one 44 px tools/tabs strip, 52 px minimum room rows. Target ≥8 complete choices at 390×844 and ≥4 at 375×667; roughly 8–10 at 390. Total content estimated 1500–1800 px, depending blocked reasons. |
| Phone Build details / My Rooms | Full-width Details bar on every new-room card; earlier direct Upgrade/Undo. | 40 px inline info target, with full description/upkeep available when expanded. Room row still directly selects placement. My Rooms keeps direct Upgrade and Undo; primary targets remain ≥44 px. Hallway price is visible in its compact tool button. |
| Phone Manage | Duplicate inner Done row, four-column overview, two rows of tabs; large role/service/money tiles. | Outer Close exits once; standalone Manage still has Done. Overview is compact and four section tabs share one row. About 80–100 px less management chrome. Role/money cells become two-column 60 px rows; service cells 52 px minimum, with fees/status visible. Existing detail/Back, salary, praise, hire, training and fire confirmation flows remain. |
| Phone chart / Patients / Alerts / More | Earlier compact layouts already present. | Retained. Shared HUD/navigation recovery gives charts more height; general phone body is 14 px. No clinical text, choice behavior, table behavior or question flag flow changed. |

Desktop density applies at width ≤1440 px **or** height ≤900 px, and only above
the desktop breakpoint (761 px). Ordinary clinic rails remain visible. In Build
or Management the workspace uses the side-column space by default; **Show clinic
panels** restores both original rails in one click and **Hide clinic panels**
returns to the wide menu. Rails stay mounted, retaining their state and every
action; all reappear on leaving either mode. Wider/taller desktops retain their
previous proportions. The chosen splitter share/camera is never written by this
feature; the completed map-shade change is retained.

Menu body text is 13 px on compact desktop and 14 px on phone. HUD metadata and
the small required notice use 12 px on phone; the ring's decorative label retains
its small existing style. Menu controls use 14 px phone text, ≥40 px secondary
targets and ≥44 px primary targets. Colors, art, domain values and exact clinical
strings are unchanged. Full-position capacity messages move into staffing info;
missing-room/pathing/other noncapacity hire reasons remain prominently visible.
Irreversible Fire and costly training confirmations remain.

### Root causes / key code

- `styles/global.css:9189` reserves 30 px for `.clinic-headline`, even when
  invisible. `styles/workspaceDensity.css:6` gives the empty region zero height
  and overlays a real announcement. No announcement content/timeout changed.
- `mobile/mobileShell.css:91` reserves `max(32px, safe-area)` for a session strip
  whose links are hidden on sheets. `mobile/mobileDensity.css:197` removes that
  allocation and anchors the existing links above the tab edge; the actual inset
  is applied once to navigation.
- `AppShell.tsx:755` provides the labeled, keyboard-accessible rail toggle and
  `workspaceDensity.css:20` scopes workspace expansion to paused Build/Manage.
- `ui/BuildPanel.tsx:510` groups toolbar/tabs so they share a strip. Cost/size/count
  are compact; descriptions/upkeep remain in each button's title and accessible
  description. No placement/Undo logic changed.
- `ui/StaffPanel.tsx:105` prioritizes staffed roles stably; `:175` provides a
  labeled staffing-info disclosure. Employee salary/morale/action markup stays
  bound to the original callbacks and view labels.
- `mobile/build/MobileBuildCatalog.tsx:48` keeps a direct placement action and
  separately labeled inline Details. `:88` consolidates four tool/tab actions.
- `mobile/manage/MobileManage.tsx:51` omits the redundant inner Done only when the
  enclosing sheet supplies the existing whole-menu Close callback. Shared-session
  integration tests still prove exact running/paused restoration for both initial
  states, browser Back, tabs, phone Close and desktop Done.

### Files changed

Runtime (nine files):

- `apps/player/src/styles/workspaceDensity.css` (new)
- `apps/player/src/main.tsx` (import only)
- `apps/player/src/AppShell.tsx`
- `apps/player/src/ui/BuildPanel.tsx`
- `apps/player/src/ui/StaffPanel.tsx`
- `apps/player/src/mobile/mobileDensity.css`
- `apps/player/src/mobile/MobileTopBar.tsx`
- `apps/player/src/mobile/build/MobileBuildCatalog.tsx`
- `apps/player/src/mobile/manage/MobileManage.tsx`

Tests:

- `apps/player/src/ui/workspaceDensity.test.tsx` (new): semantic structure, rail
  access, costs/counts, one-tap Close, guidance/error/action preservation and parsed
  CSS font/target/no-band/safe-area contracts. These are structure checks, not a
  claim that jsdom performs browser layout.
- `apps/player/src/mobile/manage/manageSessionFlows.test.tsx`: replace the removed
  duplicate phone Done case with the already-covered whole-sheet Close; retain
  exact pause commands, clock, speed and callback assertions.
- `apps/player/src/mobile/phoneSpace.test.tsx`: the CSS isolation guard now accepts
  the exact phone root as well as its descendants; global and similarly prefixed
  selectors are still rejected. Existing wrapping/target assertions remain.
- `tests/e2e/ui-density-helpers.ts` (new): public disposable fixture and complete
  row counts against all clipping ancestors, real font readiness, target checks.
- `tests/e2e/ui-density-measurements.spec.ts` (new): three requested viewports,
  row/height/font/target assertions, JSON and five menu screenshots per viewport.
- `tests/e2e/ui-density.spec.ts`: current native phone notice/XP/Build/chart
  selectors, desktop 44–48 px HUD target, existing containment checks retained.
- `tests/e2e/phone-ui-space.spec.ts`: new single-column room rows, inline Details
  locator and stronger visible-choice targets (8/4 instead of 4/2).
- `tests/e2e/management-mode.spec.ts`: current title locator; desktop desk/splitter
  assertions stay on desktop. A native-phone replacement proves playback gates,
  employee salary/Fire controls, unchanged Fire confirmation, containment and
  running/paused whole-menu exit.
- `tests/e2e/build-mode-usability.spec.ts`: Build title locator only, avoiding
  matching CSS-uppercase text as raw DOM text. Existing upgrade/refund/access
  assertions remain untouched.

Docs: this audit, `docs/execplans/ui-density-20261108.md`, and an additive
`docs/handoffs/CURRENT_THREAD_HANDOFF.md` entry. `styles/global.css`,
`room-upgrades.spec.ts`, the domain/clinical/session/camera/renderer sources and
all price/balance fixtures are unchanged. Scoped entry copies/diffs/hashes and
validation logs live in `.local-dev/ui-density-20261108/worker/`.

### Validation

PowerShell, `CI=true`, existing sandbox preload
`.local-dev/ios-reload-loop-20261107/validation-preload.cjs`, Vitest threads.

```text
Final focused player: 15 files /150 tests passed, 16.93 s, exit 0.
Earlier CSS isolation/new density guard: 2 files /15 tests passed, 6.49 s, exit 0.
Root npm.cmd run typecheck: all 7 workspaces passed, exit 0.
E2e typecheck (all affected specs plus unchanged room-upgrades): exit 0.
Final player build: 1040 modules, 6.35 s, exit 0; existing warnings.

npm.cmd test -- --pool=threads (full player)
Test Files  4 failed | 384 passed (388)
     Tests  4 failed | 3647 passed (3651)
  Start at  11:04:05
  Duration  398.14s (transform 22.46s, setup 0ms, import 654.21s,
                    tests 892.73s, environment 30ms)
Exit 1

Isolated operationalEngineDev.test.ts: 1 file /1 test passed, 8.08 s, exit 0.
```

The initial focused pass caught two obsolete phone Done clicks; those were
updated to the single Close presentation. A test predicate's optional boolean
was corrected before the passing typecheck. The first full run (431.08 s) had
384 files/3647 tests passing, 4 files/4 tests failing: the three entry baseline
failures plus the phone-root CSS guard above. The guard correction passes; a
fresh full run passes that guard. Its four failures are:

1. `session/breadButterPresentation.test.ts:78`: documented entry baseline,
   expected four choices versus three in the current content fixture.
2. `session/levelFiveRoomsViewModels.test.tsx:57`: documented entry baseline,
   benefit-note regex does not include the existing gym description.
3. `session/cloud/separateCampaign.test.ts:54`: documented entry baseline,
   retired-encounter fixture exceeds the existing codec JSON string bound.
4. `session/cloud/operationalEngineDev.test.ts:18`: the main test process's view
   had 606 concept IDs and the native worker had 605; the only expected-only ID
   was `concept.predictive-value.collection-population-denominator.v1`. The exact
   gameplay-state comparison at line 17 **passed**. Question source/test files
   were being edited during this shared-tree run, consistent with two catalogue
   snapshots. A fresh isolated run passed 1/1 in 8.08 s. No session, worker,
   projection or question source/assertion was changed to bypass it. The short
   ID-only comparison is in `worker/catalog-mismatch.json`.

The full suite is **not green**. The manager should rerun it with the question
lane settled; the isolated pass does not replace that full-run result. All 150
focused UI tests pass. No gameplay or safety assertion was loosened. Browser
geometry remains unverified in the sandbox.

### Manager acceptance / risks

Run against the existing disposable QA Vite server with the usual environment:

```powershell
npx playwright test tests/e2e/ui-density-measurements.spec.ts tests/e2e/ui-density.spec.ts tests/e2e/phone-ui-space.spec.ts tests/e2e/management-mode.spec.ts tests/e2e/build-mode-usability.spec.ts
npx playwright test tests/e2e/room-upgrades.spec.ts
```

The measurement spec runs 1366×768 and 1440×900 on desktop-chrome and 390×844
on phone-chrome; other project combinations skip those duplicate measurements.
The existing phone-space spec adds 375×667. Read the `visible-row-measurements`
attachment for actual viewport/content heights, complete/partial rows, row names,
heights and fonts. Assertions count complete rows only; partially hidden rows
do not meet the acceptance target. No fixed sleeps.

Check visible disclaimer, 40/44 px targets, very long room/employee names,
staffing-info focus/overflow, restoration of all clinic panels, placement with
Undo, Fire cancellation, small-phone keyboard, iPhone safe area and landscape
navigation. Verify bottom-left session actions do not cover any critical map
interaction; recenter remains on the lower right. Genuine error/status lines may
grow the header and are not clipped to meet density targets.

`room-upgrades.spec.ts` was reviewed/typechecked but not changed: its pricing,
frozen-work, refund and lineage contracts do not depend on the changed card
geometry. Its older local-profile seeding/native-phone-vs-desktop-selector
assumptions remain manager triage if they fail; they were not bypassed by forcing
phone tests into desktop layout or relaxing numerical assertions.

No owner opening pathway/origin/profile changed. Owner playtesting remains
`START_GAME.cmd` → `http://127.0.0.1:4173` in the intended persistent profile;
the disposable QA context has separate storage. Local work only; manager owns
browser acceptance, release and any later backup checkpoint.

## Round 2 — manager screenshot review (2026-11-08)

Manager measurements confirm the first pass: laptop Build visible/content height
improved from 334/1126 to 431/607 px in the supplied comparison, employee list
from 221/2586 to 329/758 px, and phone Build shows nine rooms instead of four.
Both empty bands are gone. Those are manager browser results, not jsdom estimates.

| Review item | Cause / round-2 change | Verification |
| --- | --- | --- |
| Laptop thumbnail overlaps name/price | The three-class legacy catalog rule at `styles/global.css:5924` retained a 30 px track while the new art was 36 px. Its nested small-font rules also beat the two-class density rules. `workspaceDensity.css` now overrides that actual selector with a 36 px thumbnail column, 6 px gap, explicit text column and 13 px text. | Unit guard includes the legacy cascade; browser assertions check art/text rectangles and name font with clinic panels both hidden and restored. |
| Phone Pause clips into Play | Fixed 58 px buttons could not contain the icon and bold label. Playback now occupies two tracks of a four-equal-track grid; Speed and More each get their own track. | At 360–430 px wide each button gets approximately 84–102 px, with 44 px minimum height. E2e checks actual text bounds, nonoverlap and targets. |
| Phone header/time/status | Facility time and day/time are one inline label. The unchanged exit-mode status shares that short band when it fits; otherwise the complete status wraps to its own line. A four-control row follows. Disclaimer is one visible 11 px line. All controls, XP, Local only, financial details and error/status regions remain. | New Build/Manage geometry checks at 360, 375, 390 and 430 px require header ≤170 CSS px, time ≤20 px and disclaimer ≤16 px, with no horizontal page overflow. |
| Splitter bottom pan | Requested pointer travel is not camera travel at the bottom clamp. The test overshoots slightly, polls `worldBottom === height`, reads the resulting origin and checks that it matches the derived bound. | Zoom/tile-size, stationary-feature, shade direction, picking and reload assertions remain. Manager's border-excluded host bounding-rect measurements are preserved verbatim. No camera source changes. |

The supplied phone PNG is 780×1688 for a 390×844 viewport. Its approximately
245 **image** pixels of header are approximately 122.5 **CSS** pixels. Do not
subtract 75 CSS pixels from that screenshot or claim such a gain. Round 2 uses
a readable time/status band and roomy controls; estimated healthy Build header
is approximately 125 CSS px (about 140 if the status wraps), below the requested
170 px cap. Actual round-2 geometry/row counts still require the manager run.
No fixed max-height clips errors or long accessibility text to meet this target.

### Catalogue mismatch investigation

No UI-induced order dependency reproduced. The original failure had main-process
606 versus native-worker 605 concept IDs (only the newly added
`concept.predictive-value.collection-population-denominator.v1` differed), while
the exact gameplay state matched. Question files were changing during that run.
The worker test builds a fresh Vite graph in its own `mkdtemp` directory and a
new native worker realm (`codecWorkerNativeTestSupport.ts`); Vitest's normal
per-file isolation remains enabled. The density test mocks only facility/art
presentation, not the clinical registry, and none of those runtime modules changed.

Three single-worker shuffled runs combining `operationalEngineDev.test.ts`,
`workspaceDensity.test.tsx` and `phoneSpace.test.tsx`, seeds 7/41/93, each passed
3 files/16 tests (17.34/17.08/15.91 s). Hashes of all 535 clinical source files
were unchanged throughout those runs. This supports a concurrent-catalog-edit
explanation for the earlier mismatch; it does not justify weakening the exact
worker/main comparison. No worker, session, registry or clinical file was edited.
The fresh full suite also passes the exact worker/main test. All 535 clinical
source-file hashes remained identical from before the ordered runs through the
end of the full suite. Its catalogue mismatch did not recur.

### Round-2 files and validation

Changed runtime: `apps/player/src/styles/workspaceDensity.css`,
`apps/player/src/mobile/mobileDensity.css`,
`apps/player/src/mobile/MobileTopBar.tsx`. Changed tests:
`apps/player/src/ui/workspaceDensity.test.tsx`,
`tests/e2e/ui-density-measurements.spec.ts`,
`tests/e2e/splitter-map-shade.spec.ts`. Docs: this handoff, the existing ExecPlan
and an additive `CURRENT_THREAD_HANDOFF.md` entry. Other shared work is retained.

Same CI/preload/threads environment as above. Round-2 logs, entry copies,
catalogue hashes and scoped review are in `.local-dev/ui-density-20261108/round2/`.

```text
Focused: 7 files /81 tests PASS, 10.88 s, exit 0.
Order seeds 7/41/93: each 3 files /16 tests PASS; 17.34/17.08/15.91 s, exit 0.
Root npm.cmd run typecheck: all 7 workspaces PASS, exit 0.
E2e typecheck (affected density specs + splitter-map-shade): PASS, exit 0.
Player build: 1046 modules transformed; built in 6.61 s, exit 0; existing warnings.
Full npm.cmd test -- --pool=threads:
Test Files  4 failed | 385 passed (389)
     Tests  4 failed | 3903 passed (3907)
  Start at  11:29:42
  Duration  423.08s (transform 21.45s, setup 0ms, import 668.64s,
                    tests 978.49s, environment 33ms)
Exit 1
Isolated chartStructuredFields: 1 file failed, 5 tests passed /1 failed,
6.44 s, exit 1 (same assertion as full suite).
```

Full failures: the previous `breadButterPresentation.test.ts:78` choice count,
`levelFiveRoomsViewModels.test.tsx:57` gym-note regex, and
`cloud/separateCampaign.test.ts:54` legacy codec string bound. The fourth is
`chartStructuredFields.test.tsx:129`: its legacy-discussion assertion searches
raw `node.explanation` within HTML. The current fixture contains `->`, which
React correctly escapes to `-&gt;`. It fails identically in isolation (5/6 pass),
so it is a deterministic fixture/HTML-assertion mismatch, not ordering from this
UI change. That session test and the clinical fixture are unchanged in this
lane; the manager/question lane can compare decoded text or escaped markup
while keeping the exact explanation assertion. No safety assertion was removed.
The full suite is **not green**; no new density-test failure remains.

Manager browser checks: run `ui-density-measurements.spec.ts` (new phone header
case plus desktop thumbnail bounds with panels hidden/restored), then
`splitter-map-shade.spec.ts` on all desktop projects. Inspect the
`phone-header-geometry` and `visible-row-measurements` attachments; capture the
new phone Build/Manage headers and laptop long room names. Also retain the
existing phone-space, management, room-upgrade and build-usability runs. No
browser or Playwright was run in the sandbox; visual acceptance remains pending.

## Round 3 — layout browser failures (2026-11-08)

Round-2 manager visuals are accepted: thumbnail overlap and phone control
clipping are fixed; phone Build header measured approximately 122 CSS px.
Round-3 input is `.local-dev/tmp/layout-e2e.log` (17 failed/4 passed/35 skipped)
plus all 17 `test-results/**/error-context.md` files. Their paths/hashes/errors
are indexed in `.local-dev/ui-density-20261108/round3/manager-context-index.json`.
No browser was launched here. The table uses the original log numbers and line
numbers so the manager can match each failure after source lines shift.

| Log # / original spec and project | Product vs stale test; evidence | Fix / retained intent |
| --- | --- | --- |
| 1 — build-mode-usability:10, desktop | Stale interaction. Snapshot has the injected old guidance as a generic history card, not an action button. Current feed deliberately strips actions from retained history. | Assert that exact history remains readable, then inspect the same Examination Room through Build → My Rooms. Keep its tier, benefit, upgrade price, tools, Undo/painting and complete invalid-exit dialog assertions. Hallway count now observes committed journal recovery. |
| 2, 7, 10 — management-mode:56, desktop/compact/laptop | CSS line-box overflow: `noVerticalClip=false`, with exact message, horizontal containment and outer containment all true. Legacy 1.02/1.12 leading and flex shrinking did not contain glyph metrics reliably. | Mode message uses nonshrinking 13 px/16 px integer line boxes; its chip can grow for wrapped text. Existing exact-copy/no-ellipsis/all containment, pause gates and resume-state assertions remain. |
| 3, 11 — management-mode:204, desktop/laptop | Stale navigation. Context shows the visible **Show clinic panels** button and the hidden mounted patient rail introduced by the accepted full-width workspace. | Use and assert the real reveal control before clicking a patient tab. Keep chart-priority, desk-edge, splitter, no-overflow and trigger-restoration checks; no forced clicks or hidden-element assertions. |
| 4 — room-upgrades:329, desktop | Stale persistence observation. Failure reads old raw localStorage (tier 1/$28,565), while the same snapshot shows tier 2, $28,455 and **Undo: Upgrade Waiting Room A (+$110 back)**. Purchase succeeded. | Read the actual durable snapshot plus committed journal through the existing browser recovery API; no live-state injection or new production hook. Every exact cash/tier/purchase/refund/reload/frozen-work check remains. |
| 5 — room-upgrades:369, desktop | Stale balance copy: expected $24 upkeep; snapshot and current definition show $6. | Verify the exact current definition's upkeep. Keep hardcoded construction cost, all four upgrade prices, total cash, old frozen work, station assignments, new-order duration and revenue-quote assertions. No balance or gameplay edit. |
| 6 — ui-density:9, desktop; 9 — ui-density:196, compact | Same mode-message line-box defect as 2/7/10. | Same CSS fix; the existing Build message/toolbar containment tests are unchanged. |
| 8 — splitter-map-shade:93, compact | Product presentation defect, not a pan error: zoom, tile size and both world origins are exactly unchanged; only screen y drifts 0.583 px. Global CSS stretched the integer canvas to the pane's fractional `height:100%`. | Desktop canvas uses its intrinsic CSS dimensions under the existing resolution-1 backing policy. Add exact displayed-size==backing-size checks. Keep the <0.5 px feature tolerance, exact world origins, actual bottom clamp, picking and reload checks; manager's border-excluded host rects remain verbatim. |
| 12 — management-mode:8, phone; 16, 17 — ui-density:174/:289, phone | Stale fixture entry. All three snapshots show **Clinic Campaigns** and **Resume Level 5 M9 integration (integration-l4)**, with no game shell yet. | Helper waits for either clinic or the exact Resume action, uses Resume when shown and then waits for the native shell/fonts. No auth/save gate bypass or forced desktop layout. |
| 13 — phone-ui-space:23, 390×844 | Product density gap: seven complete rows in the small unfunded Level-0 campaign. The accepted nine-row screenshot uses funded unlocked rooms; locked/unaffordable choices add a third reason line. | Reduce card vertical padding 4→2 px and row gap 2→0. Three-line choices save 8 px each; keep every reason, 14 px text, ≥52 px primary targets and the ≥8 complete-row assertion. Wait for real font readiness before measurement. |
| 14, 15 — room-upgrades:329/:369, phone | Stale desktop adapters: waiting for Enter Build/Management Mode, `.build-owned-row`, `.room-action-menu` and `.patient-tab` in the native phone shell. | Exercise native Build/Manage tabs, compact owned rows/quick upgrades, map room sheet, employee details and patient sheet/chart. Exact money, untouched second room, refund, campaign identity, reader stations, frozen work and upgraded new-order assertions remain. No phone skip or forced desktop substitution. |

### Scope and assertion details

Runtime changes are only `styles/workspaceDensity.css` (mode text and desktop
canvas sizing) and `mobile/mobileDensity.css` (room-row spacing). No renderer,
controller, domain, balance, session, auth, persistence, art or question source
changed. Intrinsic desktop canvas sizing depends on the existing resolution-1
policy; the browser test asserts that policy explicitly. Its host can retain a
subpixel remainder at the clipped edge, without stretching world content.

Tests changed: `ui/workspaceDensity.test.tsx`,
`tests/e2e/build-mode-usability.spec.ts`, `management-mode.spec.ts`,
`phone-ui-space.spec.ts`, `room-upgrades.spec.ts`, `splitter-map-shade.spec.ts`,
`ui-density-helpers.ts` and `helpers.ts`. `ui-density.spec.ts` is unchanged: its
failures are repaired by product CSS/common fixture navigation. Room-upgrade
coverage now also runs on compact and laptop projects instead of skipping them.

The new `readDurableLocalState` helper dynamically imports storage/journal APIs
**inside the browser evaluation**, then reads the same committed recovery as a
real reopen. Playwright's Node loader imports no coordinator/codec-worker module.
It does not flush, alter or inject game state. Raw localStorage stays the legacy
base by policy; using it as a live assertion was incorrect. Journal completion
and state assertions are polled, not replaced with fixed sleeps or looser money
comparisons. The shared Level-1 fixture's fixed 300 ms delay was replaced by
canvas readiness; Resume selection and font loading are also condition-polled.

Native phone summary rows show current tier/benefit and next price; full room
sheets show per-upgrade/current/next copy. Tests check those actual surfaces.
For every native purchase, exact recovered tier/cash and the untouched second
room are checked. Its visible summary is checked when the catalog is present
and again on returning from the single room sheet, rather than requiring two
menus to stay mounted. MAX still has no Upgrade action; the harmless **Upgrade
tiers and prices** disclosure is not confused with a purchase button.

No assertion about prices, refunds, pause restoration, retained patients,
immutable frozen work, staff posts, capacity, lineage, new-order timing/revenue,
invalid room access, canvas scale/picking or chart priority was dropped. No test
timeout increased. Existing project-specific layout tests keep their scopes;
native phone paths gained coverage rather than being skipped.

### Round-3 validation / manager rerun

Same CI/preload/threads environment. Logs/scoped entry copies/diff in
`.local-dev/ui-density-20261108/round3/`.

```text
Focused player: 15 files /151 tests PASS, 20.99 s, exit 0.
Root typecheck: all 7 workspaces PASS, exit 0.
E2e/QA typecheck: PASS, exit 0 (final rerun includes all reviewed helpers/specs).
Offline installed Playwright Babel CommonJS transform: PASS; both dynamic
imports remain inside browser evaluation; Node imports only Playwright/helpers.
Player build: 1046 modules transformed; built in 8.50 s, exit 0; existing warnings.
Full npm.cmd test -- --pool=threads:
Test Files  4 failed | 385 passed (389)
     Tests  4 failed | 3904 passed (3908)
  Start at  12:21:11
  Duration  465.59s (transform 26.32s, setup 0ms, import 716.45s,
                    tests 1098.08s, environment 33ms)
Exit 1
```

The four failures are unchanged from round 2: `breadButterPresentation.test.ts:78`
(three versus four choices), `chartStructuredFields.test.tsx:129` (raw explanation
searched inside escaped HTML), `levelFiveRoomsViewModels.test.tsx:57` (gym-note
regex), and `cloud/separateCampaign.test.ts:54` (legacy codec string bound).
No new density failure; the full suite remains **not green**. All 535 clinical
source files have identical hashes before/after the full run; no session/domain/
question source or failing assertion was changed to bypass those results.
The new unit check covers full mode copy/disabled controls and integer,
nonshrinking line-box rules. Existing CSS isolation, font, touch-target,
management exit/pause and component action tests all pass.

Manager reruns all six specs on the four projects, plus the measurement spec:

```powershell
npx playwright test tests/e2e/build-mode-usability.spec.ts tests/e2e/management-mode.spec.ts tests/e2e/phone-ui-space.spec.ts tests/e2e/room-upgrades.spec.ts tests/e2e/ui-density.spec.ts tests/e2e/splitter-map-shade.spec.ts tests/e2e/ui-density-measurements.spec.ts
```

Inspect unfunded Level-0 as well as funded Level-5 Build rows, long paused-mode
HUD text at 1024/1280/1440 widths, room-sheet upgrade/Undo/reopen on phone,
revealed patient rail while managing, and splitter feature/picking stability.
Browser success is pending manager evidence; typechecking is not a browser pass.
The owner's canonical origin/profile/opening pathway is unchanged.

## Round 4: four residual browser failures

Manager rerun: 21 pass / 4 fail. The four contexts in `layout-e2e2.log` show
stale fixture/flow assertions; no runtime, domain, camera or layout edits in
this round.

| Failure | Cause and evidence | Fix |
| --- | --- | --- |
| Desktop Build invalid-layout message | Stale rule: X-ray's `requiredRoomDefinitionIds` is empty (`prototype-balance.ts:179`); Imaging Control is inert, unbuildable legacy space (`:192`). Current access validation reports unreachable rooms (`doors.ts:509–528`). The snapshot shows Examination Room and the newly painted Hallway, with both repair hints. | Assert both actual violations, both repair hints and exactly two issue rows. Retain the modal layering, pause and Continue Renovating checks. |
| Desktop + laptop Management chart priority | Stale fixture: visual patients copied the fresh source's `checkInStatus` while being placed inside waiting/exam rooms (`helpers.ts:438`). The browser explicitly reports “The patient has not checked in at the Front Desk yet.”, matching `reducer.ts:3417`. Management already exits (`usePrototypeSession.ts:1207`); no hidden chart exists. | Set those already-inside fixture patients to checked in and select the exact exam patient ID. Keep all desk-edge, trigger, splitter and close assertions. A real-session/AppShell regression separately proves checked-in chart priority and visible rejection for unchecked-in patients. |
| Phone upgraded diagnostic order | Stale extra close step: the snapshot is already back on Patients with the accepted order pending. Feedback acknowledgment closes pending-service charts (`usePrototypeSession.ts:1243`); `MobileShell.tsx:216` dismisses the sheet when the chart becomes null. The Close control's name did not change. | Assert the automatic dismissal and Patients sheet, then reopen the same chart and retain exact accepted room tier, cash, timing, revenue and pending-order assertions. |

Changed this round: `tests/e2e/{helpers,build-mode-usability.spec,management-mode.spec,room-upgrades.spec}.ts`,
new `apps/player/src/ui/workspaceChartPriority.test.tsx`, this audit, the active
ExecPlan and an additive current-thread handoff. No timeout increase or force
click. All other bytes in the room-upgrade spec are unchanged from round 3.

Round-4 validation logs and scoped review: `.local-dev/ui-density-20261108/round4/`.
Focused player: **16 files / 153 tests PASS**, 16.65 s; seven workspace
typechecks and affected e2e/QA typecheck PASS. Player build: **1046 modules,
4.78 s**, exit 0 with the existing warnings. The initial build without the
documented preload hit Vite's sandbox `net use` spawn; the preloaded build
completed normally. Full player output follows.

Final full-player output (`CI=true`, documented preload, `--pool=threads`):

```text
Test Files  4 failed | 386 passed (390)
     Tests  4 failed | 3906 passed (3910)
  Start at  12:50:25
  Duration  440.48s (transform 24.38s, setup 0ms, import 745.40s,
                   tests 963.97s, environment 36ms)
Exit 1
```

Same four baselines listed in round 3: choice count, HTML escaping, gym-note
regex and legacy codec string limit. Full suite is not green; no new failure.
All five affected e2e/helper files also pass the installed Playwright CommonJS
transform check, retaining browser-only storage/journal imports inside browser
evaluation. No browser run was attempted in the sandbox.

Manager browser rerun: the same six specs/four projects above, concentrating on
the two invalid-layout issues, the admitted patient's Management chart priority,
and reopening the phone's automatically dismissed pending-order chart.
