# Retained facility pan and zoom ? 2026-11-08

Implemented in the shared main worktree; ready for manager browser acceptance.
Pan/zoom no longer rebuild the world at every input. Full player validation has
four reproduced baseline failures; all-workspace types and player build pass.
Browser frame rates and pixels have not been measured in this sandbox.

## Cause and design

Previously, applyCamera invalidated the static signature and forced drawWorld
and positionText on every event. A 24-step Level 5 gesture rebuilt the world 24
times, destroying/recreating roughly 480 room-label/display objects and issuing
about 2.5 million drawing API calls just to prepare the display list.

The scene now keeps the last crisp draw layout (worldLayout) separately from
its desired screen layout (layout). Existing Phaser camera scroll/zoom maps the
retained coordinates into that screen projection. No containers, RenderTextures,
bitmap caches or extra canvases were introduced. The large mechanical portion
of the Scene change explicitly names drawing coordinates worldLayout.

Pan is only a camera translation, including at rest. Zoom immediately scales
the retained objects; 150 ms after the last input, and after held desktop/mobile
contacts end, one existing draw pass rebases at the new integer tile scale.
Returning to the original tile scale needs no crisp pass. Actual static changes
and late asset completions coalesce while a gesture is active. Static geometry
still rebuilds for relevant room/layout/decor/occupancy changes and resize.
Dynamic characters, effects, popups and overlays continue their existing updates.

The camera uses origin (0,0). Fractional gesture placement disables Canvas sprite
rounding temporarily; native-scale resting draws restore the existing pixel
rounding and asset filtering. Tile-space routes/anchors remain independent of
this transform. Pixel-only active seat glides rebase without restarting their
pose, elapsed time or route.

Screen layout retains its prior meaning: grid/room/walk/placement picking and
the desktop splitter's originX/originY contract are unchanged. Bitmap, chair and
door hits inverse-project the pointer; mobile target bounds forward-project so
finger tolerance stays in CSS pixels. DOM pins, room menus and clamped ghost
labels project into screen coordinates. Rapid React camera echoes cannot replace
a newer gesture. Existing camera preference callbacks, lifecycle flushing,
normalization/zoom limits and desktop shade metadata remain in use.

## Memory and phone policies

New render-target allocation: **0 bytes**. Gesture display-object creation and
destruction: **0** in both fixtures/layouts. There is one retained layout object
and bounded gesture flags; no growing per-input history/cache. Existing phone
DPR limits, reduced-memory mode, character texture caps, active 30 fps, paused
1 fps and hidden/covered-map sleep are unchanged (captured source hashes match).
The Canvas lifecycle and desktop sizing/splitter modules were not edited.

## Measurements

Windows Node v24.19.0, CI=true, one Vitest thread for each profile process.
Public level-five-integration-checkpoints-20261012.json: integration-l4 (42 rooms)
and integration-build (87 rooms). Input uses the real FacilityScene renderer,
actual view models and installed geometry. Initial preparation is outside the
timed region; each of 24 steps times applyCamera plus the following refreshLayout.
Before uses captured pre-edit Scene/signature sources through a read-only Vite
load substitution; after uses the current source. No live file was swapped.
Four matched profile runs pass; game-state JSON is byte-identical before/after
all gestures and view projections. Fixture SHA256:
10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346.

Graphics/text/image factories are headless counting adapters. These CPU timings
measure display preparation, without DOM layout, text rasterization, image decode,
Canvas paint or GPU. Missing textures exercise the procedural fallback. They
are evidence of eliminated preparation work, **not proof of desktop 60 fps or
physical-phone smoothness**. The browser spec measures real Phaser render frames.

### Renderer preparation only

| Fixture / layout / gesture | Before mean (ms) | After mean (ms) | Before p95 (ms) | After p95 (ms) |
| --- | ---: | ---: | ---: | ---: |
| L4 / desktop / pan | 13.936 | 0.050 | 19.721 | 0.090 |
| L4 / desktop / zoom | 11.211 | 0.026 | 12.687 | 0.035 |
| L4 / phone / pan | 13.372 | 0.025 | 16.205 | 0.038 |
| L4 / phone / zoom | 12.304 | 0.023 | 13.402 | 0.024 |
| L5 / desktop / pan | 19.436 | 0.036 | 22.815 | 0.049 |
| L5 / desktop / zoom | 18.599 | 0.038 | 20.700 | 0.050 |
| L5 / phone / pan | 19.371 | 0.031 | 21.079 | 0.059 |
| L5 / phone / zoom | 20.152 | 0.034 | 21.963 | 0.045 |

### Renderer preparation plus local view projection

This variant synchronously echoes each camera preference through the ordinary
createPrototypePlayerView call used by the local App, including its projection
cost. React reconciliation/paint is still outside this headless measurement.
Account worker projection is not simulated by this variant.

| Fixture / layout / gesture | Before mean (ms) | After mean (ms) | Before p95 (ms) | After p95 (ms) |
| --- | ---: | ---: | ---: | ---: |
| L4 / desktop / pan | 21.130 | 6.787 | 31.584 | 10.166 |
| L4 / desktop / zoom | 18.017 | 5.638 | 20.244 | 6.392 |
| L4 / phone / pan | 19.835 | 5.616 | 21.603 | 6.403 |
| L4 / phone / zoom | 18.929 | 5.305 | 20.259 | 5.621 |
| L5 / desktop / pan | 28.986 | 8.647 | 30.758 | 9.778 |
| L5 / desktop / zoom | 27.496 | 8.222 | 29.618 | 9.062 |
| L5 / phone / pan | 29.692 | 8.299 | 32.777 | 9.117 |
| L5 / phone / zoom | 29.079 | 7.630 | 31.967 | 9.265 |

### Display-object churn per 24-step gesture

| Fixture / layout / gesture | Before draws / created / destroyed | After draws / created / destroyed | After settled draws / ms |
| --- | ---: | ---: | ---: |
| L4 / desktop / pan | 24 / 312 / 312 | 0 / 0 / 0 | 0 / 0.02 |
| L4 / desktop / zoom | 24 / 312 / 312 | 0 / 0 / 0 | 1 / 22.32 |
| L4 / phone / pan | 24 / 312 / 312 | 0 / 0 / 0 | 0 / 0.02 |
| L4 / phone / zoom | 24 / 312 / 312 | 0 / 0 / 0 | 1 / 19.01 |
| L5 / desktop / pan | 24 / 480 / 480 | 0 / 0 / 0 | 0 / 0.03 |
| L5 / desktop / zoom | 24 / 481 / 480 | 0 / 0 / 0 | 1 / 26.63 |
| L5 / phone / pan | 24 / 480 / 480 | 0 / 0 / 0 | 0 / 0.03 |
| L5 / phone / zoom | 24 / 480 / 480 | 0 / 0 / 0 | 1 / 23.25 |

Before issued 2.19?2.60 million graphics API calls per gesture; after issued zero.
Zoom's single settled preparation pass is still 19?27 ms here. It is intentionally
outside the gesture; a physical-device settled frame remains an acceptance risk.
Raw samples/counters, harness/config and all logs are in
.local-dev/map-pan-zoom-20261108, particularly before-final[-view]-performance.json
and after-final[-view]-performance.json. Earlier exploratory runs are retained.

## Correctness and regression checks

Fifteen new tests exercise both public fixtures/layouts, 100-step pans and
20-step zooms: zero world redraw/display-object churn during a gesture; held
contacts prevent a timed mid-gesture rebase; exactly one settled zoom draw;
resting static command buffers, labels and geometry equal a fresh scene at the
final camera. Tests cover room/grid and character/chair/door picking, phone room
selection and CSS anchors, Build placement, seat glide continuity, static edits,
campaign replacement, preference restoration, zoom limits and rapid echoes.
The installed Phaser camera matrix and inverse match 300 deterministic random
planes (Float32 render matrix error under 0.01 px). A median input/preparation
budget of 4 ms locally / 12 ms hosted CI supplements deterministic churn guards.

No game-domain, balance, clinical-content, cloud/session or save-format source
was edited. No bound input or Level 5 pin was rebound. The benchmark verifies
byte-exact unchanged game state. This milestone does not claim a fresh domain
journey replay; its expected 26,362 / 6,056,335 / 410 / 0 binding is untouched.

## Files

- apps/player/src/facility/FacilityScene.ts ? retained draw basis/camera, input/UI
  projection, settled invalidation and seat rebasing.
- apps/player/src/facility/facilityWorldSignature.ts ? optional camera exclusion;
  default behavior for existing callers stays unchanged.
- apps/player/src/facility/retainedCamera.ts ? pure camera projection helper.
- apps/player/src/facility/retainedCamera.test.ts and retainedCameraTestSupport.ts
  ? real-scene fixture checks and headless display adapter.
- tests/e2e/map-pan-zoom-performance.spec.ts ? new Level 4/5 desktop/phone real
  drag/wheel frame measurements, churn guards, picking and reload preferences.
- tests/e2e/floor-pattern-pan-stability.spec.ts ? compare projected TileSprite
  placement, retaining the existing material-phase and pixel-patch assertions.
- tests/e2e/level-five.spec.ts and clinic-biopsy-visitors-correction.spec.ts ?
  project raw actor/viewport bounds into CSS coordinates; no assertions loosened.
- docs/execplans/map-pan-zoom-performance-20261108.md, this report and an additive
  CURRENT_THREAD_HANDOFF entry.

The splitter source/test and all captured other facility/mobile-policy sources
are byte-identical. It needs no origin-observation update because layout still
means screen projection. Scoped pre/post SHA256 and unified changes are recorded
in .local-dev/map-pan-zoom-20261108/final-source-manifest.json and final.patch.
Concurrent save/cloud and question work was preserved; it is outside this patch.

## Exact validation

PowerShell used npm.cmd, CI=true and --pool=threads. Offline NODE_OPTIONS preload
(.local-dev/ios-reload-loop-20261107/validation-preload.cjs) blocks optional Vite
net-use probing and any Git spawn; application/test behavior is unchanged.

Targeted correction/retained scene tests (focused-corrections.log), exit 0:

```text
Test Files  4 passed (4)
     Tests  30 passed (30)
  Duration  11.03s
```

Full apps/player: npm.cmd test -- --pool=threads (player-full.log), exit 1:

```text
Test Files  4 failed | 390 passed (394)
     Tests  4 failed | 3950 passed (3954)
  Duration  569.28s (transform 75.78s, setup 0ms, import 873.50s, tests 1349.95s, environment 40ms)
```

All four failures reproduce with the captured renderer, using a read-only Vite
substitution (player-baseline-controls.log): 4 failed files; 4 failed / 23 passed
tests (27), 19.95s, exit 1. The failures are outside this change:

| File | Evidence / failure |
| --- | --- |
| breadButterPresentation.test.ts:78 | Expects four choices; authored node has three, same before/after. |
| chartStructuredFields.test.tsx:129 | Compares raw `->` explanation against rendered HTML `-&gt;`, same before/after. |
| levelFiveRoomsViewModels.test.tsx:57 | Old regex rejects current staff-gym benefit copy, same before/after. |
| cloud/separateCampaign.test.ts:54 | Retired-encounter JSON string exceeds codec limit, same before/after. |

Root npm.cmd run typecheck (typecheck-final.log), exit 0, all seven workspaces:
clinical-context-workbench (client + server), player, balance-config,
clinical-authoring, clinical-content, clinical-research, game-domain. Every
workspace printed its tsc command with no diagnostics.

Player npm.cmd run build --workspace @gamify-surgery/player (player-build.log),
exit 0: `1053 modules transformed`, `built in 19.05s`. Existing chunk-size and
ineffective dynamic-import warnings remain; no bundler errors.

E2E: tsc --noEmit -p .local-dev/map-pan-zoom-20261108/tsconfig.e2e-scoped.json
(e2e-scoped-typecheck-final.log), exit 0: new map spec, unchanged splitter spec,
floor-pattern proof and Level 5 inspector proof. Whole-e2e config exits 1 with
**140 diagnostics identical by file, line/column, code and diagnostic header**
to a stash-free public-source copy using the captured pre-change renderer. The
entire diagnostic output is identical after normalizing the control path. No
Git was used. See e2e-control-typecheck.log, e2e-typecheck-final.log and
e2e-baseline-comparison.json. The existing biopsy spec retains its four existing
literal-type errors in that broader baseline; this change adds no errors.

Offline Playwright --list (e2e-discovery.log), exit 0: **4 tests in 1 file** for
the new spec across desktop-chrome and phone-chrome. Discovery starts no browser
or server. No browser tests were run here.

## Manager browser acceptance

Run on the ordinary dev test server in disposable Playwright contexts (configured
default origin http://127.0.0.1:4173). Owner pathway remains START_GAME.cmd and
that exact URL/profile; no origin, persistent profile or launch pathway changed.

```powershell
# Manager supplies the existing healthy test server at this exact origin.
$env:GAMIFY_E2E_EXTERNAL_SERVER='1'
$env:GAMIFY_E2E_BASE_URL='http://127.0.0.1:4173'
node node_modules/@playwright/test/cli.js test tests/e2e/map-pan-zoom-performance.spec.ts --project=desktop-chrome --project=phone-chrome
node node_modules/@playwright/test/cli.js test tests/e2e/splitter-map-shade.spec.ts tests/e2e/floor-pattern-pan-stability.spec.ts --project=desktop-chrome
```

The new spec attaches real postrender frame intervals, p95/max, long tasks,
object/world draw counters, viewport backing size, picking/projection error,
origin and a resting screenshot. It scripts 48 drag steps and 24 wheel steps,
asserts zero gesture rebuilds/allocations and one settled zoom rebuild, then
reloads through normal camera preference flushing. Local p95 guards are 25 ms
desktop / 50 ms phone (CI x2); desired steady rates remain 60 / existing 30 fps.
Physical-device inspection is needed to accept blur/seams and touch feel.

Also run normal/Build room picking and placement/door overlays, selected-room
menus and pins; character taps/chair anchors and walking; zoom endpoints and
repeated pan/zoom + reload; phone pinch/drag cancellation and reduced-memory
DPR/texture mode; hidden/covered idle behavior; and desktop splitter travel and
reload. Retain the updated Level 5 inspector proof on its existing disposable
cap-5 QA origin (5184); its opening pathway was not changed here.

Raw Phaser object bounds now live in retained world coordinates after a pan.
Any additional dev-only QA hook treating getBounds()/actorBaseY() as screen
pixels must use worldToScreen/toScreenRect before pointer/viewport comparisons.
Room/grid hooks reading layout keep their old screen meaning. No tolerances or
clinical/gameplay assertions were weakened to accommodate the coordinate change.

## Open risks

- Browser/GPU/DOM/physical-phone smoothness and pixel quality remain unmeasured.
  The headless savings and exact preparation guards are established; real frame
  timing acceptance belongs to the manager's browser run.
- The one settled crisp preparation can exceed 16 ms. If the real resting frame
  visibly hitches, reduce that pass separately without introducing a large phone
  render target. No continuous per-gesture world preparation remains.
- Shared-tree full validation is not green because of the four baseline player
  failures and broader baseline e2e type errors above. Nothing was rebound or
  changed outside this lane to make those disappear.

No commit, push, deploy, install, external network, backup or agent action was
performed. This validated milestone remains only in the shared working tree;
the manager owns review, browser acceptance and the eventual checkpoint.


## Round 2 ? manager browser feedback (2026-11-08)

The manager ran the five requested specs at the disposable dev-test origin
http://127.0.0.1:5185: **4 passed, 5 failed, 9 skipped** (18 cases). Phone Level 5
performance, desktop/laptop splitter shade and desktop Build usability passed.
This round reads those logs/traces offline; no browser ran in this sandbox.
Owner playtesting still uses START_GAME.cmd and http://127.0.0.1:4173 in the
intended persistent profile. The 5185 origin has separate browser storage.

### Findings and corrections

**Character sizing was a product bug.** A first paused frame has no frozen
presentation snapshot yet, so `Boolean(frozen)` incorrectly allowed a new
breathing phase. Pausing after a breath also retained fractional, independently
scaled axes. The trace's founder was 33.99938891265294 ? 68.00407391564707 pixels;
patient/staff dimensions were fractional too. The first paused draw now freezes
motion immediately, and paused floor/seat stills use the existing integer 1:2
metrics. Existing frozen mid-hop lift/shape and active walk/breath motion remain.
Both loaded and retained same-identity cold-texture branches use the same sizes.
There is no new texture/cache or repeated world draw.

The browser proof retains its strict `Number.isInteger` and exact width?2=height
assertions. It waits for real zoom/asset settlement, checks integer ground
positions, zero resting lift, and the actual per-still floor registration. Two
old assumptions were stale independently of this camera change: all sources do
not have floorY=287 (the measured founder/patient assets use 288), and character
textures already deliberately use nearest sampling (Phaser mode 1), as asserted
by characterPresentation.test.ts. The proof now verifies those source anchors
and nearest filtering; product anchors/filter policy were not changed.

At rest the native camera returns to zoom 1 with roundPixels enabled, and the
world/fixture draw buffers still match a fresh renderer at the same preference.
Room labels, access badges and upgrade stars are retained through gestures and
regenerated identically after settlement. This checks preparation/geometry;
physical pixel quality still requires the manager's screenshots/device review.

**The re-seat timeout preceded any click.** The trace shows a Level 0 starter
clinic, $118.50 and one starter patient, rather than the requested 63-room
Level 3 layout plus Break Room (64 total), with the standing/hallway QA IDs and
$5,000,000. Its raw-storage
replacement reused a campaign whose IndexedDB journal already existed; normal
recovery correctly preferred that durable journal. The scenario now opens under
a new identity, seeded before its first journal exists, with one-time import
and an explicit assertion that both QA patients are actually present before
time starts. No recovery/durability code was changed. The character fixture
also uses a fresh identity and prepares its paused cluster in the imported
state, so React camera echoes cannot replace a renderer-only mutation.

The map-click proof also had raw Phaser bounds that still assumed screen
coordinates. It now projects actor/seat bounds through `worldToScreen` and maps
logical canvas coordinates to its CSS rectangle. Camera settlement is observed
instead of assuming a fixed 300 ms delay. Actual input-handler tests verify
character selection, public-chair commands and hallway destinations during a
retained zoom and after settlement at 50%, 160% and 250%, with nonzero pan.
There was no product picking failure in these tests. A separate headless run of
the actual map-click scenario, reducer and view projection confirms the hallway
patient is seated after 4 tick commands and the standing patient after 10
(within the original 90-second browser allowance): 1 test passed, 12.61s. See
round2/re-seat.json and re-seat.log.

**Performance target selection was premature and sparse.** One failed trace
still has the full Loading clinic region over the already mounted canvas.
The opener now waits for that region to disappear. Target selection polls a
dense set of candidates and checks the entire 49-point scripted drag path
against `elementFromPoint`, plus immediate-action floor/desk exclusions. This
covers small phone map regions and partial HUD/rail coverage. Failures identify
the occluding elements; no dialog/onboarding/chart is hidden to force input.
The existing cosmetic paused-banner suppression is unchanged. The zero world
draw/object assertions, p95 budgets and hostedTime multiplier remain unchanged.

### Focused evidence and measurements

New retainedCameraRoundTwo.test.ts has nine cases: loaded still sizing with the
installed Phaser Size getters/setters, first-paused/mid-hop behavior, real
pointer dispatch at three zooms, inspect/activity/seat popup anchors, retained
Build labels/badges/stars, and actual ghost placement at two zooms (before and
after settlement). The loaded proof covers four real fixture identities and
10/50/70/100/160/250% zoom. Headless factories now model image size/origin,
container bounds and object-form data writes, rather than silently swallowing
those operations.

A read-only Vite substitution of the captured round-1 FacilityScene reproduces
both new character regressions: **2 failed / 7 passed (9), 12.46s**, exit 1.
The updated scene passes all nine. See round2/regression-control.log. Combined
with retained-camera, pause/arrival and character presentation coverage:
**4 files / 49 tests passed, 10.13s**, exit 0 (round2/focused-final.log).

The unchanged public Level 4/5 headless harness, including local view projection,
was repeated while the full suite ran. These CPU times include that contention;
they are not browser/GPU FPS measurements or a paired timing comparison:

| Fixture | Desktop mean pan / zoom step | Phone mean pan / zoom step | Gesture rebuilds / object create / destroy |
| --- | --- | --- | --- |
| Level 4, 42 rooms | 6.664 / 5.619 ms | 5.512 / 5.084 ms | 0 / 0 / 0 |
| Level 5, 87 rooms | 9.605 / 8.865 ms | 8.080 / 7.717 ms | 0 / 0 / 0 |

Each gesture has 24 steps. Quiet zoom still performs exactly one crisp draw
(20.668?26.342 ms); quiet pan performs none. State JSON remains byte-identical.
Public checkpoint SHA256 remains
`10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346`.
No domain/content input or Level 5 pin was changed; no rebind.
Raw rows: round2/after-performance.json and performance.log.

### Round-2 validation

All commands used installed tools from PowerShell with the existing validation
preload (blocks optional Vite network-drive/Git probes). CI=true applies to the
full suite/control/profiling runs; no assertion or timeout was edited.

Full player (`CI=true; npm.cmd test -- --pool=threads`, apps/player), exit 1:

```text
 Test Files  4 failed | 391 passed (395)
      Tests  4 failed | 3960 passed (3964)
   Start at  15:29:37
   Duration  473.83s (transform 23.97s, setup 0ms, import 736.76s, tests 1110.03s, environment 35ms)
```

All nine new round-2 tests pass in that full run. The only failures are the same
four listed in round 1: breadButterPresentation:78 (three vs four choices),
chartStructuredFields:129 (HTML escaping), levelFiveRoomsViewModels:57 (gym note
regex), cloud/separateCampaign:54 (legacy evidence JSON string limit). The
captured pre-camera renderer reproduces all four again in the current tree:
**4 failed files; 4 failed / 23 passed tests (27), 16.79s**, exit 1. These are
outside this lane; no baseline assertions were changed. Logs:
round2/player-full.log and baseline-failures.log.

Root `npm.cmd run typecheck`, exit 0, prints all seven workspace commands with
no diagnostics: clinical-context-workbench (tsconfig.client + tsconfig.server),
player, balance-config, clinical-authoring, clinical-content, clinical-research,
game-domain. See round2/typecheck-final.log.

Player `npm.cmd run build --workspace=@gamify-surgery/player`, exit 0:

```text
transforming...✓ 1053 modules transformed.
✓ built in 7.86s
```

Existing chunk-size, ineffective dynamic import and plugin timing warnings
remain. See round2/player-build.log.

E2E `node node_modules/typescript/bin/tsc --noEmit -p
.local-dev/map-pan-zoom-20261108/round2/tsconfig.e2e-scoped.json`, exit 0,
no output: all five manager browser specs plus floor-pattern and Level 5 proofs,
including their fixture helpers. Final whole-e2e typecheck exits 1 with the
same **140 errors**; the entire diagnostic output remains identical to the
round-1 captured-renderer control. See round2/e2e-scoped.log, e2e-full.log and
e2e-comparison.json. No new type errors; no baseline errors were hidden.

### Round-2 files and manager rerun

Runtime: apps/player/src/facility/FacilityScene.ts (only paused drawing/sizing).
Tests/support: retainedCameraRoundTwo.test.ts (new), retainedCameraTestSupport.ts;
tests/e2e/map-click-info.spec.ts, map-pan-zoom-performance.spec.ts,
character-resolution-zoom.spec.ts, helpers.ts (extracted unchanged visual-fixture builder),
fixtures/freshLocalCampaign.ts (new). Coordination: this report, the existing
ExecPlan and an additive CURRENT_THREAD_HANDOFF section. No Canvas, mobile
performance, splitter shade, density, cloud/session, domain, clinical or asset
edit in round 2. Baselines/scoped patch/SHA manifest are under
.local-dev/map-pan-zoom-20261108/round2/.

Manager rerun on the same disposable test origin:

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER='1'
$env:GAMIFY_E2E_BASE_URL='http://127.0.0.1:5185'
node node_modules/@playwright/test/cli.js test tests/e2e/map-pan-zoom-performance.spec.ts tests/e2e/splitter-map-shade.spec.ts tests/e2e/map-click-info.spec.ts tests/e2e/build-mode-usability.spec.ts tests/e2e/character-resolution-zoom.spec.ts --project=desktop-chrome --project=laptop-chrome --project=phone-chrome
```

Offline discovery succeeds: **18 tests in 5 files**, exit 0. Browser acceptance
is pending; no claim that the five browser failures have been rerun here.
Also retain the floor-pattern proof and physical phone pinch/pan/reduced-memory
checks from round 1. A single quiet zoom redraw can still exceed a frame budget;
there are no new render targets or changes to phone DPR/FPS/thermal policies.
All work remains local for manager review; no Git/network/agents/install/deploy.

## Round 3 — desktop frame budget (2026-11-08)

The manager's second Chrome run passed character resolution, map clicks, Build,
splitter shade and phone L4/L5 performance. Desktop drag p95 was **35.4 ms L4 /
40.4 ms L5**, above 25 ms. The log says two Playwright workers; the measured
application was Vite development at http://127.0.0.1:5185. No browser ran here.
Those are the browser **before** numbers; browser **after** remains for the
manager. This round provides matched CPU attribution and a production browser
runner, rather than treating headless timings as browser frame times.

### Causes and changes

1. Every pointer sample called `onCameraChange`, causing a root camera update,
   local view projection and React shell reconciliation even though Phaser
   retained the world. Forty-eight samples caused 48 projections/root renders.
   Input now changes the native camera immediately and publishes once at
   pointer release, or after 150 ms quiet for wheel/pinch. Held slow drags do
   not publish between samples. Cancellation, blur, hidden/pagehide,
   beforeunload, unmount and an outside-map action flush the latest preference.
   Campaign/explicit-camera fences and delayed React echoes are covered.
   Camera storage was already debounced 250 ms, with a small preference payload;
   the old cost was repeated React/projection and rescheduling, not full saves
   written on each move. Save policy/format and session/cloud code are untouched.
2. POST_STEP splitter-shade reconciliation previously read host geometry and
   camera state every frame. It now returns before DOM reads while a gesture
   has an unpublished camera. Ordinary resize/splitter settlement still runs,
   including the existing shade restore/coverage rules. `desktopMapShade.ts`
   and its browser spec remain byte-identical to the captured round-3 entry.
3. Frozen actors were repeatedly cleared/redrawn and their text/layout refreshed
   although paused/build state and retained drawing scale had not changed.
   They now refresh once per immutable model or settled scale. Active motion,
   inspect fade/seat feedback, asset callbacks and popups continue updating.
   Static invalidation signatures are cached per immutable published view model.
4. Alert-pin positions now update mounted buttons with CSS transforms. React
   updates only visible membership or ordinary model/text changes. No per-frame
   `left`/`top` layout writes, DOM geometry reads, new composited layers or
   position history are introduced. The writer retains only current positions
   and mounted buttons; null refs remove entries.
5. Retaining the world did not stop Canvas from replaying offscreen Graphics
   paths: the sampled L4/L5 frames dispatched 99,679 /105,268 Canvas commands.
   Conservative static-object bounds now skip whole offscreen Graphics objects
   in the native Canvas renderer. Bounds are calculated at static redraw, with
   stroke/miter/rounding allowance. Unknown commands, transforms, parent
   matrices or alternate render contexts use the original renderer. `clear()`
   invalidates bounds immediately. There is no RenderTexture, extra bitmap,
   display-list mutation, changed drawing order or phone memory-policy change.
6. Final input review found the phone Build drag adapter consuming screen
   touches with the retained *world* layout. It now receives the projected
   screen layout. Two actual-handler cases verify the ghost grab and drag at
   50%/160% with nonzero pan, both during the transform and after settlement.
   No mobile Build command/validation implementation changed.

### Matched per-step attribution

Public fixtures: `integration-l4` (42 rooms) and `integration-build` (87), from
the unchanged level-five integration checkpoints. Paused clinic, chart closed,
48 pointer samples followed by release. Baseline uses a read-only Vite source
substitution of the captured round-3 Scene. Both paths run the actual Scene
handlers/update, view projection, React client reconciler and complete desktop
shell against the repository's small test DOM. Native Phaser Graphics encoders,
camera/preRender and Canvas command renderer are measured separately against a
no-op Canvas context. Timings were run sequentially without the full suite.

This measures CPU preparation and command submission, **not** DOM layout,
decoded artwork/image rasterization, compositor/GPU cost or browser FPS. The
headless renderer uses fallback art. The minified Vite production harness uses
the actual UI/view/Scene modules and production React runtime; it does not model
the Vite HMR client. React commit below includes projection, so those columns
must not be added together.

Mean milliseconds per sample, before → after:

| Stage | Test/dev L4 | Test/dev L5 | Production L4 | Production L5 |
| --- | ---: | ---: | ---: | ---: |
| Pointer callback, including root publication | 11.790 → .014 | 12.971 → .005 | 4.231 → .010 | 5.526 → .003 |
| React commit, including projection | 11.756 → 0 | 12.951 → 0 | 4.209 → 0 | 5.511 → 0 |
| View projection within commit | 4.902 → 0 | 6.055 → 0 | 3.445 → 0 | 4.775 → 0 |
| `refreshLayout` | .054 → .002 | .051 → .002 | .041 → .002 | .087 → .001 |
| Paused character redraw | .758 → 0 | .444 → 0 | .574 → 0 | .333 → 0 |
| Pin + selected-rectangle publication | .004 → .001 | .003 → .001 | .002 → .001 | .003 → <.001 |
| Earnings/popups | .065 → .001 | .043 → .001 | .047 → .001 | .036 → <.001 |
| Whole pointer + scene update | 12.679 → .023 | 13.518 → .010 | 4.901 → .016 | 5.989 → .006 |
| Separate native Canvas dispatch | 4.971 → 2.385 | 6.301 → 4.224 | 4.243 → 2.148 | 5.491 → 3.677 |

Production CPU stage means sum to **9.144 → 2.164 ms L4 /11.479 → 3.683 ms L5**.
These are sums of separate timed stages, not measured browser frame p95. Whole
preparation p95 is 22.867 → .079 ms /26.120 → .016 ms in test/dev; production is
7.606 → .045 ms /7.923 → .009 ms. Production React reconciliation is materially
cheaper than the dev runtime (about 7.5 ms less here). This supports dev overhead
as a contributor, but cannot attribute the entire manager's 35–40 ms browser
gap to development mode; browser raster/layout/trace overhead remains to measure.

Both fixtures perform **zero full world redraws and zero object creation**
during the drag before and after. Root renders/projections/publications go from
48/48/48 to **0/0/0**, with exactly one publication at release. Canvas calls fall
from **99,679 → 20,567 L4 (79.37%) /105,268 → 30,110 L5 (71.40%)**. At the sampled
viewport, 427/450 and 430/455 static Graphics are outside; unsupported/empty
buffers conservatively remain uncullable. Object transforms/display-list
traversal still exist; path dispatch was the measured removable Canvas cost.

All four before/after pairs keep state JSON byte-exact and the entire retained
Graphics command/position/depth/visibility hash equal:

- L4: `e1cd98c3a7f12c0ec369f76cc3fef471bedecf4d96dfd35a71f089dc03ba2018`
- L5: `acf48147c6422cdf5675c8c4d1896942d171c0da2cee94dc6fd97ee68ed38e16`

Checkpoint SHA256 is still
`10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346`.
No domain, clinical content, Level 5 bound input, balance value, pin or rebind
was edited. This round does not claim a new Level 5 integration journey run.
Raw evidence: round3/{before,after}-{test,production}-frames.json,
frame-comparison.json, frameHarness.tsx, nativeCanvas.ts, profile.config.mts and
production.config.mts. Production bundles and captured sources stay in the
ignored task directory; no private save was used.

### Production browser runner and instrumentation

`scripts/qa/map-performance-preview.mjs` builds a separate production artifact
under the task directory, then serves http://127.0.0.1:5186. It sets a build-time
QA flag and blanks the account-service configuration for disposable local
fixtures. The runtime URL opt-in is also required. A normal production build
cannot expose the facility proof from the URL alone. It does not alter the
release output or owner storage. The owner still opens START_GAME.cmd at exact
http://127.0.0.1:4173 in the intended persistent profile; 5185/5186 have separate
storage and are automated test origins only.

Manager browser command (not executed here):

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.map-performance.config.ts
```

This runs the four L4/L5 desktop/phone cases serially, without trace DOM capture
competing for the timing budget, and asserts the proof reports production mode.
If that QA preview is already running, set `GAMIFY_MAP_PREVIEW_EXTERNAL=1`.
The **production desktop p95 ceiling remains 25 ms, including CI**. Phone keeps
the existing 50 ms/local hosted allowance and PhoneFrameBudget. Development
retains its default budget; only explicit `GAMIFY_MAP_DEV_ALLOWANCE=1` doubles
the dev desktop allowance (50 ms local). It cannot relax production. No blanket
dev exception or passed production browser result is claimed here.

The same spec now attaches a partial pan report before any budget assertion,
including per-stage mean/p95/max/calls for pointer/update/layout/actors/pins/
popups, native Canvas render submission, camera reconciliation, React canvas
renders/view-model changes, texture-add/load-start counts and frame/long-task
timings. Pan samples end before the single pointer-up publication and assert
zero view-model changes. Full reports retain picking/native-matrix accuracy,
zero gesture rebuild/object counts, one crisp settled redraw and reload camera
persistence. Run development timing with `--workers=1`; keep the five ordinary
functional specs and the floor-pattern proof in the manager's acceptance set.

### Round-3 validation and scope

Installed tools only, PowerShell, existing validation preload blocking optional
Vite network-drive/Git probes. `CI=true` for player tests, with `--pool=threads`.
No browser, network, Git, dependency install, agent, backup, commit, push or deploy
action. Logs below are in `.local-dev/map-pan-zoom-20261108/round3/`.

Full player (`CI=true; npm.cmd test -- --pool=threads`, apps/player), exit 1
(`player-full.log`):

```text
 Test Files  4 failed | 394 passed (398)
      Tests  4 failed | 3978 passed (3982)
   Start at  17:01:57
   Duration  421.59s (transform 23.75s, setup 0ms, import 675.77s, tests 963.89s, environment 34ms)
```

All 18 added round-3 cases pass. The failures are the same four baseline cases:
breadButterPresentation:78 (three choices vs four), chartStructuredFields:129
(HTML escaping), levelFiveRoomsViewModels:57 (gym-note regex), and
cloud/separateCampaign:54 (legacy evidence JSON string limit). A stash-free,
read-only substitution of captured Scene/Canvas/Pins reproduces all four in
the current shared tree (`baseline-four.log` /baseline-tests.config.mts), exit 1:

```text
 Test Files  4 failed (4)
      Tests  4 failed | 23 passed (27)
   Start at  17:00:27
   Duration  13.32s (transform 9.09s, setup 0ms, import 17.91s, tests 7.86s, environment 0ms)
```

No unrelated assertion/content/codec edit was made to clear those failures.

Focused: camera publication, pin writer, culling, Canvas lifecycle, pin UI,
retained camera, round-2 input/characters, pause/arrival, splitter shade and
camera preferences (`focused-final.log`), exit 0:

```text
 Test Files  10 passed (10)
      Tests  103 passed (103)
   Start at  17:04:48
   Duration  12.46s (transform 19.03s, setup 0ms, import 39.01s, tests 4.71s, environment 2ms)
```

New guards cover L4/L5 60-step held drags, immediate picking/no publication,
quiet-wheel crisp settlement, live inspect/new-model refresh, campaign/explicit
camera fences, delayed React echoes, phone Build drags, lifecycle capture
ordering before preference flush on both layouts, outside Save action,
listener cleanup, 1,000 pin frames without React membership updates, normal/QA
production proof gates and conservative Graphics bounds/fallbacks. The captured
round-3 Scene fails both new phone Build guards (2 failed /6 skipped, 7.95s),
at the ghost ownership assertion; current source passes. See
phone-build-control.log and gesture-control.config.mts.

Root `npm.cmd run typecheck`, exit 0 (`typecheck-final.log`), no diagnostics:

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

Normal player `npm.cmd run build` from apps/player with QA flag 0, exit 0
(`player-build.log`):

```text
transforming...✓ 1056 modules transformed.
✓ built in 4.77s
```

Separate QA production `node scripts/qa/map-performance-preview.mjs --build-only`,
exit 0, no server/browser (`qa-production-build.log`):

```text
transforming...✓ 1056 modules transformed.
✓ built in 4.80s
```

Existing large-chunk, ineffective dynamic import and plugin timing warnings
remain. The ordinary release output never receives the QA build flag.

E2E scoped typecheck exits 0, no output (`e2e-scoped.log`):
`node node_modules/typescript/bin/tsc --noEmit -p
.local-dev/map-pan-zoom-20261108/round3/tsconfig.e2e-scoped.json`.
It includes the seven relevant specs, their helpers and the new production
Playwright config. Whole-e2e typecheck exits 1 with **140 baseline errors**;
the entire normalized diagnostic output matches round 2, which matched the
captured pre-camera source control. See e2e-full.log /e2e-comparison.json; no
scoped diagnostic was hidden. Offline production-spec discovery exits 0:
**4 tests in 1 file** (`production-discovery.log`).

Round-3 ownership (16 paths; 8 changed /8 new):

- Changed runtime: apps/player/src/facility/{FacilityScene.ts,
  FacilityCanvas.tsx,ClinicMapPins.tsx}.
- New runtime: same directory's graphicsViewportCulling.ts,
  mapPinPositions.ts,facilityProofPolicy.ts.
- Tests: changed FacilityCanvas.lifecycle.test.tsx and
  tests/e2e/map-pan-zoom-performance.spec.ts; new cameraGesturePublication.test.ts,
  graphicsViewportCulling.test.ts,mapPinPositions.test.ts.
- QA: new scripts/qa/map-performance-preview.mjs and
  playwright.map-performance.config.ts.
- Coordination: this report, docs/execplans/map-pan-zoom-performance-20261108.md
  and additive docs/handoffs/CURRENT_THREAD_HANDOFF.md.

Review round3/final.patch, final-source-manifest.json and scope-audit.json
against captured entry SHA256s. Round-1/2 artifacts remain separate. No App,
controller/session/cloud, clinical/domain/balance, UI density, global CSS,
asset, texture budget, DPR/FPS/thermal policy or desktopMapShade edit. Normal
camera input uses the existing immediate native projection, so no extra rAF
queue/backlog is introduced; only publication is coalesced at gesture boundaries.

Open acceptance: production browser p95 must still pass 25 ms; these headless
CPU numbers cannot prove it. Inspect manager attachments for Canvas/raster,
React, texture upload/load or shade costs if it does not. Also retain physical
phone pinch/Build ghost, reduced-memory/covered/hidden behavior, viewport-edge
stroke/seam checks, labels/pins/popups, nearest integer resting characters,
splitter coverage/restoration and reload during an active gesture. The single
quiet crisp zoom redraw can still exceed 16 ms. No browser visual quality or
GPU throughput claim is made here. Work remains local for manager review and
browser acceptance; the manager owns the eventual checkpoint.
