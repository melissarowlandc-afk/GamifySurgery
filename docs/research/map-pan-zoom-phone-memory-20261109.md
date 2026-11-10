# Phone memory after retained-camera pan/zoom — 2026-11-09

The controlled comparison **does not reproduce an 80 MB retained heap increase
from the renderer change**. It finds the same objects, drawing buffers and room
textures before and after pan/zoom. The fixes below remove **12,896,452 bytes on
Level 4 /16,590,132 bytes on Level 5** of redundant static-canvas readback buffers,
release completed image promises, bound the old-Safari image-cache fallback,
and restore a lost Canvas context without reloading a campaign. Pan still makes
zero world rebuilds. The owner's actual reload/sign-in cause remains unconfirmed;
this is not a claim that WebKit jetsam or the reported 80 MB has been explained.

Manager input: release89a52452 went live around 2026-11-08 23:55 UTC, then was
reverted to9439b199 after an iPhone home-screen Level4 account returned to sign-in
and repeated loading. Main-tree pan/zoom work was preserved. Manager's Chrome
phone/dev observation was585–590 MB main-thread JS heap vs492–515 MB earlier,
178 textures/~164 MB nominal RGBA. Those are manager browser observations;
no browser, private save, account service or owner backup was accessed here.

## Comparison and limits

Evidence directory: `.local-dev/map-pan-zoom-phone-memory-20261109/`.
Captured194 public source/test inputs with SHA256; additional root-build sources
were captured separately. Recorded727 shared domain/balance/clinical input hashes;
none changed during measurement/validation. No domain/content, save/cloud,
launcher, camera policy, splitter shade, UI density or approved art edit/rebind.

Three renderer variants use the same current domain/content and public fixtures:

- `pre`: captured pre-pan Scene from map-pan-zoom-20261108/entry.
- `current`: this milestone's entry Scene, before the memory fixes.
- `after`: final fixed Scene/helpers.

Public checkpoints are `integration-l4` (42 rooms) and `integration-build` (87).
Each phase/level runs in a **fresh Node process**, through a minified production
bundle, native installed Phaser Graphics command encoder and the real Scene
camera/update/draw methods. Phone375x812 logical viewport, paused, chart closed.
Forty gestures each contain12 pan samples and zoom samples, followed by a quiet
crisp redraw. All sampled endpoints have the same140% zoom and zero pan. Five
explicit GCs precede retained-heap samples. A separate80-gesture `--jitless`
run distinguishes object retention from V8 optimization/code warming.

The image/texture ledger executes actual source selection, frame registration
and derivative creation; pixel-readback arrays are real allocations. Native
Phaser Texture/CanvasTexture unit tests verify the replacement API and pixels.
The ledger does **not** decode PNGs, rasterize real text or allocate browser/GPU
backing stores. Its nominal RGBA bytes describe room/environment/derivative
sources; live character images and Phaser text textures add to that in a browser.
The headless React/controller/worker realms and whole browser process are not
modeled. These are renderer isolation measurements, not Chrome/WebKit heap
totals. Do not substitute them for the manager's585–590 MB observation.

Raw reproducible harness: `memory.ts`, `memory.config.mts`, `textureLedger.ts`,
`phaser-shim.ts`; final rows: `{pre,current,after}-l{4,5}-loaded-memory.json` and
`final-memory-comparison.json`. Older two-fixture/scratch runs are exploratory;
use the per-level fresh-process rows for comparisons. Fixtures/measurements
contain public test data only.

## Measured result

MiB below means1,048,576 bytes. JS heap and ArrayBuffer backing are separate
Node counters. Nominal decoded canvas/image backing is reported separately.
Opening-before-GC and gesture peaks are sampled observations, not guaranteed
allocator high-water limits.

| Fixture /phase | Opening JS heap, before GC | Opening JS heap, after GC | After40 gestures, after GC | Observed gesture JS peak | Retained ArrayBuffers |
| --- | ---: | ---: | ---: | ---: | ---: |
| L4 pre-pan |225.716 MiB |181.727 MiB |183.870 MiB |291.932 MiB |12.436 MiB |
| L4 retained camera, entry |230.904 |181.824 |183.474 |255.301 |12.436 |
| L4 fixed |245.229 |181.801 |183.450 |256.131 |.137 |
| L5 pre-pan |210.741 |184.214 |186.316 |331.636 |15.959 |
| L5 retained camera, entry |227.329 |184.368 |185.925 |261.420 |15.959 |
| L5 fixed |228.769 |184.350 |185.934 |258.898 |.137 |

At opening after GC, **JS heap + ArrayBuffer backing** is194.163?181.938 MiB
L4 and200.173?184.487 MiB L5, pre-pan?fixed. The fixed renderer is below the
matched pre-pan retained total. Raw opening JS heap is within .14 MiB after GC;
settled JS heap is slightly lower. These sums exclude separately estimated
image/canvas/GPU memory and are not browser process totals. Raw pre-GC opening
values vary; the fixed L4 sample is higher. A lower actual iPhone opening peak
has not been established. Reduced redraw/external allocation can alter GC cadence
(an inference), so an uncollected heap delta alone cannot establish a leak or
explain the manager's80 MB.

Before constructing a campaign/view/renderer, the fixed harness already retains
172.76 MiB in imported modules and parsed public fixture inputs. State plus view
adds4.07/4.64 MiB; the loaded renderer adds4.98/6.95 MiB (L4/L5). The test does
not isolate that large shared baseline into individual clinical/domain modules.
It would be misleading to assign all of it, or the manager's80 MB delta, to a
small camera/culling cache.

| Retained structure | L4, all three paths | L5, all three paths |
| --- | ---: | ---: |
| Live display objects, first/final sample |682 /682 |793 /793 |
| Native Graphics command numbers, first/final |95,988 /95,988 |156,771 /156,771 |
| Room/environment/derivative texture count |114 |229 |
| Nominal RGBA source bytes |163,540,840 |309,112,552 |
| Static derivative readback bytes, pre/current→fixed |12,896,452→0 |16,590,132→0 |
| Full world draws during480 pan samples, pre→current/fixed |480→0 |480→0 |

There is no new RenderTexture, baked static layer, duplicated world container
or retained per-gesture buffer. `renderedLayout` is a small coordinate record;
the camera transforms the existing objects. Culling has one weak entry and a
small bounds record per static Graphics, not a second command array. Current
versus pre-pan opening heap differs by only .10/.16 MiB in this isolation.
The facility projections serialize to40.5/60.9 KiB; their data references are
shared. New diagnostics report the number of distinct cached view-model sources
instead of exposing or copying them. Headless settled tests retain one source.

Normal JIT runs show modest code/metadata warming; raw heap is not asserted to
be byte-constant. The400-gesture exploration keeps every object/command count
flat; its larger later heap samples coincide with increased V8 code metadata.
The JIT-free fresh-process80-gesture guard requires post-warm retained heap growth
under64 KiB locally (128 KiB CI), plus exactly stable object/buffer counts and
zero static readback mirrors. Both levels pass. This excludes a reproducible
renderer resource leak in the tested gestures, not leaks elsewhere in the app.
Fresh-process post-warm20→80 growth is1,864 bytes L4 /232 bytes L5, including
the harness's own additional measurement rows; code metadata is constant in
those JIT-free runs. Raw files: after-jitless-l{4,5}-long-loaded-memory.json.

Fixed versus entry drawing command/position/depth/visibility hashes stay equal:

- L4: `ca84a7e822e7a4e43bd5dffea33c637e45923dcc6d51604a6696c0e674a808f8`
- L5: `0a2d9b1775decd736ce8cd23049cd8d99fe1cc19afa405ac1bd42bfdd93496b6`

The old pre-pan command hash is different because that renderer used its screen
coordinate frame. The memory fix leaves the accepted retained renderer's output
unchanged. The public checkpoint SHA256 remains
`10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346`.
No Level5 bound input or result pin was changed; no new full journey is claimed.

## Causes addressed

**Static CanvasTexture readback duplication.** Installed Phaser's
`textures/CanvasTexture.js` constructor/update retains ImageData plus typed views
of its complete canvas. These are pixel readback caches, separate from the
drawable canvas backing. Our landscaping cleanup, chair partitions, tinted
decor, derived stool and contact shadow need immutable rendered pixels and
temporary edits; they never use CanvasTexture's persistent pixel-query API.
These copies existed before pan/zoom. Phones now register the same native-size
canvas through ordinary `Texture`/`TextureSource`, use temporary context
getImageData/putImageData for the same edits, and refresh the same source.
The phone surface requests the same `willReadFrequently:true` context hint as
Phaser CanvasTexture; the optimization removes its mirror without requesting a
different backing policy. Desktop keeps its original CanvasTexture API. No crop, anchor, source ID,
filter, color, pixel dimension or drawing order changes.

The native Phaser test verifies Canvas recognition, exact pixel bytes and crop
frame fields, reuse of the registered source, and absence of a CPU mirror.
New derivative allocation guards reject sides above4096 or area above4,194,304
pixels before allocation. Null/refused contexts fall back procedurally; allocation
exceptions record `static-canvas-unavailable` instead of throwing out of boot.

**Completed image ownership.** MobileBitmapCache used to retain every resolved
Promise<HTMLImageElement> for the document lifetime. That retained images after
their actual map/preview owners disappeared. It now deduplicates pending requests
and keeps weak completed sources where WeakRef exists. Old Safari uses a bounded
strong LRU:8 MiB normal /2 MiB reduced, max256 completed metadata entries. Load
handlers are cleared, completed promises removed, errors bounded, and a reclaimed
weak source can reload. Mounted map source lookups reuse its active images even when a large atlas is
evicted from the fallback LRU, preventing a second decode. Lookups disconnect
on unmount and hold no source history. Live Phaser/preview owners continue owning their source;
cache eviction never destroys, resizes or changes an active texture. This improves
map disposal/catalogue churn; it does not evict textures still held by Phaser.
Built art and previously loaded catalogue art remain a significant finite cost.

## iOS audit and safeguards

- The7611x749 recovery furniture atlas **predates pan/zoom**. Both
  ios-reload-loop-20261107/room-assets-before.json and room-assets-after.json
  record those dimensions. It is22,802,556 nominal RGBA bytes and remains in the
  unchanged built-room dependency set. No replacement atlas or new large cache
  texture is introduced here.
- FacilityCanvas explicitly uses `Phaser.CANVAS` (type1), before and after the
  release. It does not create a WebGL context or upload those sheets through
  Phaser's GL pipeline. A4096 WebGL MAX_TEXTURE_SIZE is therefore not a direct
  test of this renderer. Do **not** switch to WebGL on those devices without
  splitting/cropping the oversized sources. Canvas2D decoder/backing memory and
  WebKit's internal compositor remain physical-device risks; this is not a claim
  that a large Canvas image is safe on every iPhone.
- Canvas2D `contextlost` now sleeps presentation and records
  `facility-canvas-context-lost`; `contextrestored` redraws the current projection
  and wakes presentation, with restored/failed diagnostics. It neither reloads
  the document nor reconstructs a session. Listeners/diagnostic sources are
  removed on unmount. The watchdog respects a lost context. The 2D event default
  restoration is left enabled; no WebGL probing or loss-extension call occurs.
- The new WeakRef use is feature-tested; tests disable it completely and verify
  the bounded Safari fallback. No FinalizationRegistry, OffscreenCanvas or
  nonstandard memory API is required for boot. Null/refused canvas allocation is
  tested. Existing pan/culling APIs are supported primitive Array/Map/WeakMap/
  numeric Canvas operations, with conservative fallback for unknown commands.
- `facilityMemory` diagnostics contain counts only: objects, command numbers,
  unique source RGBA estimate, readback bytes, texture side, RenderTextures,
  cached-model count and image-cache ownership. They are gathered by existing
  diagnostic snapshots/5-second heartbeat, never by pan or per-frame JSON scans.
  No names, charts, campaign state or source images enter this diagnostic.
- The auxiliary unclean-restart guard is unchanged: two visible unclean starts
  select reduced defaults without prompts or save writes. Normal/reduced main
  backing at375x812@2/3 is750x1624 /375x812:4,872,000 /1,218,000 RGBA bytes.
  Reduced mode also keeps the existing8 MiB vs24 MiB retired-character soft
  budget and2 MiB vs8 MiB strong-image fallback. Static source pixels stay native
  in both modes. The headless RGBA ledger does not allocate this main backing,
  so its raw JS heap should not be described as measuring the DPR saving.

## Regression coverage and validation

Installed tools, PowerShell npm.cmd, CI=true for full/focused/control tests,
`--pool=threads`. Existing validation preload blocks optional Vite drive/Git
probes before spawn. No Git, network, browser, agent, install, commit/push,
deploy or backup action. Scope manifests/patch are source-review evidence only.

Focused renderer/mobile suite, exit0 (`focused-renderer.log`):

```text
 Test Files  86 passed (86)
      Tests  682 passed (682)
   Start at  23:38:34
   Duration  42.78s (transform 17.84s, setup 0ms, import 130.19s, tests 30.48s, environment 6ms)
```

New tests cover native texture pixel/frame equality, unsafe/null allocations,
normal/reduced/no-WeakRef caches over1,000 sources, live-atlas reuse, context lifecycle/cleanup and
failure, diagnostic alias counting, and actual L4/L5 native Graphics across20
pan/settled-zoom gestures. Deterministic retained numeric-buffer budgets are
4.0/4.5 MB, objects below600 for the procedural path, and source-atlas budgets
151/293 MB. Game-state JSON stays exact. Integration coverage exercises the
mounted phone Canvas/watchdog restore and cleanup without a second game.
After the live-source lookup correction, the final two-file follow-up passes all
18 tests (6.23s; active-source-focused.log), including owner disconnection and
no duplicate decode of the7611x749 atlas. The full final run includes this guard.

Full player (`apps/player: npm.cmd test -- --pool=threads`), exit1
(player-full-final.log):

```text
 Test Files  4 failed | 398 passed (402)
      Tests  4 failed | 4003 passed (4007)
   Start at  00:12:32
   Duration  435.62s (transform 28.07s, setup 0ms, import 702.94s, tests 992.23s, environment 31ms)
```

All four failures reproduce with captured entry Scene/Canvas/roomAssets in the
same tree, using a read-only source substitution (baseline-four.log), exit1:

```text
 Test Files  4 failed (4)
      Tests  4 failed | 23 passed (27)
   Start at  23:46:48
   Duration  15.86s (transform 9.84s, setup 0ms, import 21.33s, tests 9.35s, environment 0ms)
```

They are unchanged baseline cases: breadButterPresentation:78 (3 vs4 choices),
chartStructuredFields:129 (HTML escaping), levelFiveRoomsViewModels:57 (gym-note
regex), cloud/separateCampaign:54 (legacy JSON-string limit). No off-lane
assertion or product change was made to remove them.

After the full run, a context-hint-only correction preserved Phaser's exact
`willReadFrequently:true` request. Its native Phaser follow-up passes1 file /2
tests in128ms (canvas-backing-focused.log), including exact context settings,
pixel bytes and frame coordinates. Seven typechecks and both builds below were
repeated after that correction. No other runtime logic changed after the full run.

Final root `npm.cmd run typecheck`: exit0, all seven workspace scripts, no diagnostics
(typecheck-final.log): clinical-context-workbench (client/server), player, balance-config,
clinical-authoring, clinical-content, clinical-research, game-domain.

Independent player `npm.cmd run build --workspace=@gamify-surgery/player`: exit0
(player-build-final.log), with existing chunk/dynamic-import/plugin timing warnings:

```text
transforming...✓ 1059 modules transformed.
✓ built in 4.78s
```

Separate QA production build-only also passes (1059 modules /4.52s,
qa-production-build-final.log); no preview server/browser was started here.

Root `npm.cmd run build`: exit1 at the unchanged boundary verifier before any Git
process is spawned (root-build.log). Package/verifier bytes match entry; no
verifier bypass or Git action:

```text
Error: Application boundary verification failed:
- Could not inspect tracked paths: Git blocked before spawn: No Git required.
```

Scoped e2e typecheck exits0, no output; whole-e2e retains140 baseline errors with
entire normalized output identical to round3 (e2e-comparison.json). Offline
new production-memory proof discovery exits0: **4 tests in1 file**. No browser
execution/result is claimed. The new CDP proof measures real full-page main-thread
heap after forced GC, all Phaser sources/backing and repeated camera gestures,
with a520 MiB production main-heap ceiling,8 MiB local/16 MiB CI heap-growth
ceilings, sampled opening/gesture peaks, zero owned readback mirrors,
stable object/command counts and explicit normal/reduced source/backing budgets.

## Files and manager acceptance

Owned paths and SHA256 baseline/final dispositions are in final-source-manifest.json;
final.patch contains only this milestone. Runtime: FacilityScene.ts,
FacilityCanvas.tsx, roomAssets.ts; new staticCanvasTexture.ts,
canvasContextRecovery.ts and facilityMemory.ts. Tests/support:
retainedCameraTestSupport.ts, FacilityCanvas.lifecycle.test.tsx,
roomAssets.test.ts; new nativePhaserMemoryTestSupport.ts, phonePanZoomMemory.test.ts,
staticCanvasTexture.test.ts, canvasContextRecovery.test.ts. New browser proof:
tests/e2e/map-pan-zoom-phone-memory.spec.ts and playwright.map-phone-memory.config.ts.
Coordination: this report, its ExecPlan and additive CURRENT_THREAD_HANDOFF.

Manager browser command:

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.map-phone-memory.config.ts
```

It inherits the existing opt-in QA production build/preview at127.0.0.1:5186,
runs L4/L5 normal/reduced phone contexts serially without traces, and attaches
`phone-map-memory.json` before budget assertions. Fixtures are fresh disposable
local campaigns; no account/owner save is used. Also rerun the production map
performance config (25 ms desktop budget unchanged), picking/character/Build/
splitter/floor proofs, and relevant cloud-save/recovery checks through the manager.

Remaining acceptance:

1. Repeat the manager's exact Chrome method in a fresh context, before/after
   forced GC, on the same production fixture. The existing `launch-unmet`
   builder actually selects integration-l4; record actual facility level/rooms.
   Compare all source/count/readback metrics, main and worker heaps, full renderer
   process memory, open/first checkpoint and repeated gestures. The ~80 MB dev
   delta is still **unattributed**. Do not present this report as proof of its cause.
2. Confirm the PWA actually runs the expected build/origin after deployment
   rollback, then capture document lifetime/timeOrigin and diagnostic `started`
   across loading cycles. A still-running document returning to loading needs
   cloud/auth/controller investigation; a new document supports process termination.
   Neither sign-in loss nor jetsam is established by a loading screenshot alone.
3. Verify physical Canvas restoration, pixel sharpness/crop/seat masks,
   pinch/picking/Build/shade, normal/reduced backing, Save&Close/reload and a longer
   session. Real WebKit decoder/GPU/process peaks remain unmeasured here.
4. Built/unbuilt-preview art residency and the large compiled content/context
   in multiple realms remain substantial pre-existing costs. The source ledger
   alone cannot prove a safe aggregate iOS memory threshold. No save/cloud worker
   or content changes were imported into this fix.

Owner pathways are unchanged: local START_GAME.cmd at exact
http://127.0.0.1:4173 in the intended persistent profile, and remote
https://melissarowlandc-afk.github.io/GamifySurgery/. The automated5186 QA origin
has separate storage. Work is local only; manager owns browser review, integration
and release/checkpoint decisions.
