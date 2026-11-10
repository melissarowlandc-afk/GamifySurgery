# Phone performance pass — 2026-11-10

This pass removes **187.49 MB of nominal static bitmap backing at Level 5**
(309.11 → 121.62 MB including derivatives) and releases the codec realm after
five idle seconds (**46.04 MB retained JS heap plus 17.88 MB external in the
normal-profile control**). Level 4 static backing falls **163.54 → 76.86 MB**.
The existing camera transform, character sharpness, simulation and save policy
remain intact. Phone room/decor sources deliberately use smaller derivatives;
characters, labels, tiled materials, component architecture sheets and desktop art stay native.

This is a measured headless production pass, **not physical iPhone acceptance**.
The engine still allocates heavily. No claim of a cool phone, sustained measured
30 fps, a confirmed jetsam diagnosis, or complete WebKit process accounting is
made. The manager must run the browser/device checks below before acceptance.

## Measurement method

- Public `integration-l4` (42 rooms) and `integration-build` (87 rooms), from
  `tests/fixtures/level-five-integration-checkpoints-20261012.json`. No owner save,
  account data or private backup was read. Normalized Day 20 uses the actual
  **600-minute operating day**, tick 11,760, with absolute tick fields shifted
  together. Raw states are 934,233 / 944,914 bytes; each has 14 encounters.
- Fresh Vite production/minified **separate bundles per realm**, actual
  `CloudGameSession`, coordinator, operational client/processor/view patches,
  codec dispatcher and IndexedDB journal implementation, native Node workers.
  A separate fake-server realm and persistent fake-IndexedDB service realm are
  excluded from client totals. That service survives codec termination. Browser
  IDB's native cache/implementation memory remains an unmeasured device cost.
- Baseline source capture: `.local-dev/phone-performance-pass-20261110/entry.json`
  (1,872 paths). Domain/balance/clinical sources are frozen to that capture for
  paired measurements; other workers were changing domain code during this run.
  Actual validation uses the shared live tree. Before/after use the same seeds,
  operation IDs, clock inputs, checkpoint and fixture bytes.
  A concurrent founder-support edit in `viewModels.ts` was preserved. The
  isolated transport-allocation control additionally freezes **all** captured
  app/package inputs except the diff generator, to separate attribution from
  that live edit and the concurrent domain changes.
- One real minute at 1x (60 commands, 1,000 ms cadence) and 4x (240 commands,
  250 ms cadence), first forced checkpoint, the ordinary end-of-day checkpoint
  at the 4x boundary, durability/compaction barriers and 5.5 seconds of idle.
  Account upload/leave/day-end timers are **not** changed by this work.
- Heaps: forced-GC boundaries plus 5 ms samples, per realm; external/ArrayBuffer
  fields separately. Allocation: V8 sampling profiler, 16 KiB interval including
  collected objects. Profiling/IPC overhead is present in both controls.
  Codec profiles cannot fully count tasks after their last sample when a realm
  terminates; no fabricated complete codec MB/s figure is reported.
- Native Phaser Graphics with fake images/text/canvas ledgers: decoded RGBA is
  **width × height × 4 accounting**, not measured GPU residency. No browser,
  image decoder, React DOM, compositor or physical thermal measurement ran here.
  Node RSS includes harness/backend/storage and is not phone memory.

Complete data, stage peaks, external bytes, full state hashes and receipts:
`.local-dev/phone-performance-pass-20261110/summary.json` and its referenced
`*-memory.json` files. Earlier multi-entry and in-codec fake-IDB exploratory
files are retained but **not** the acceptance comparison: sharing a multi-entry
chunk can mask realm tree shaking, and in-worker fake IDB falsely inflates a
codec's JS heap and loses storage on termination.

## Budget: largest costs and coverage

All MB below are decimal (1,000,000 bytes). Subsets are marked; do not add them
twice. These are the ten measured contributors/bounds worth tracking, rather
than ten invented partitions of an unavailable WebKit process measurement.

| Contributor | Level 4 before → after | Level 5 before → after | Basis / overlap |
|---|---:|---:|---|
| Selected decoded room/decor/environment sources | 150.64 → 63.97 MB | 292.52 → 105.03 MB | Native RGBA ledger; 101 / 210 source images |
| Operational engine JS after minute/idle | 53.97 → 53.94 MB | 57.52 → 57.56 MB | Actual retained worker heap |
| Main JS after minute/idle | 49.93 → 49.47 MB | 49.71 → 49.22 MB | Actual retained main heap; excludes React/Phaser/browser |
| Codec JS after minute/idle | 45.71 → 0 MB | 46.04 → 0 MB | Worker terminated only when no accepted task is pending |
| Node-reported external sources/buffers, L5 clients together | — | 55.26 → 37.38 MB | Mostly external script/source storage in this harness; ArrayBuffers are a subset |
| Clinical/context data | 8.28 MB serialized domain context per realm | Same | Logical V8 serialization, **subset of realm heaps**, not an additional heap estimate; existing shared build projection retained |
| Static canvas derivatives | 12.90 → 12.90 MB | 16.59 → 16.59 MB | Included in total static RGBA above; owned permanent readback mirrors remain zero |
| Character texture LRU policy | 24 → 8 MiB / 96 → 32 retired poses | Same | Soft policy; displayed/loading poses stay pinned, so this is not a hard bound on a live working set |
| Retained scene / Graphics commands | ~5 MB / 95,988 numbers | ~7.3 MB / 156,771 numbers | Native Graphics + fake display objects; 682 / 793 objects. Includes maps, images and scene VM references; excludes decoder/DOM |
| Full-map backing canvas at 390×844 @3x | 780×1688 → 390×844; 5.27 → 1.32 MB | Same | Full CSS viewport bound; real host is usually smaller. Recovery mode was already DPR 1 before this pass |

Other required accounting: each raw state is ~0.94 MB JSON (~0.90 MB V8
serialization), so a serialized copy is not a 40–100 MB catalogue. The main
opening heap rises ~5.3 MB over imported modules, including its owned state and
recovery mirror. Dropping that mirror would change immediate synchronous
fallback/recovery; it was not traded for a small saving in this pass. Tick
transport remains patches, not full state/context posts. The permanent runtime
harness measured maximum replies of 594,335 / 574,514 bytes over 600 commands;
large collection transitions are real, and the budget excludes the initial view.

At L5 idle, the disjoint **headless JS heaps + Node external + nominal static
surfaces** sum is approximately **517.6 → 265.8 MB**. This is a software-component
comparison, **not a measured browser/iPhone footprint**. Character decodes, main
canvas/compositor buffers, native DOM/React, text raster caches, IDB native caches,
decoder scratch and possible GPU copies still need browser/device accounting.
GPU storage is not automatically another identical RGBA copy: this player
explicitly uses `Phaser.CANVAS`.

## Open, first checkpoint and steady heaps

Each cell is **main / engine / codec MB**, after GC. The after profile is the
new automatic large-phone default (DPR 1, smaller character LRU), without a prior
crash. Explicit restart-reduced opening selects the same profile intentionally.

| Fixture / phase (4x) | Playable open | First checkpoint | After minute + idle |
|---|---:|---:|---:|
| L4 before normal | 44.94 / 46.27 / 43.17 | 45.50 / 49.59 / 45.72 | 49.93 / 53.97 / 45.71 |
| L4 after automatic | 44.81 / 46.28 / 0 | 45.63 / 49.58 / 46.76 | 49.47 / 53.94 / 0 |
| L5 before normal | 44.93 / 46.91 / 43.25 | 45.53 / 50.65 / 45.95 | 49.71 / 57.52 / 46.04 |
| L5 after automatic | 44.99 / 46.94 / 0 | 45.62 / 50.71 / 46.99 | 49.22 / 57.56 / 0 |

Existing restart-reduced controls were also run (without the allocation sampler):
their opening codec was already released by the earlier code, but after the
first minute they still retained **47.30 MB L4 / 47.62 MB L5** in the restarted
codec. The new idle release removes that residency too. Their final state hashes
match the same pairs. Static source-art savings apply in both phone profiles;
large clinics now automatically choose the same reduced profile as recovery.

The codec exists during a checkpoint and releases after five idle seconds. It
can restart for the first-save/end-of-day body; this does not eliminate those
transient copies. Individual 4x observed peaks, **not simultaneous sums**:

| Fixture | Main before → after | Engine before → after | Codec before → after |
|---|---:|---:|---:|
| L4 | 92.57 → 94.94 MB | 139.13 → 136.65 MB | 147.41 → 150.65 MB |
| L5 | 92.56 → 94.52 MB | 133.06 → 134.57 MB | 147.29 → 158.56 MB |

Thus **cold JS peaks alone have not reliably fallen**. Recreating an idle codec
loses its derived verification cache and can raise a later transient peak. The
large peak reduction this pass targets is bitmap residency/decoder pressure,
plus fewer simultaneously resident realms during engine startup and idle.
The 1x L5 main run also has an unfiltered 115.84 MB peak; it is retained in the
data, not discarded as GC noise. Complete iPhone peak acceptance is still open.

## Allocation, CPU and retention

Sampled **play-period allocation MB/s**, excluding module initialization and
using playable-open → 60-second cumulative deltas. These include instrumentation
overhead; they are not live heap growth.

| Fixture / speed | Main before → after | Engine before → after |
|---|---:|---:|
| L4 1x | 1.72 → 1.62 | 33.27 → 32.31 |
| L4 4x | 5.39 → 5.39 | 112.44 → 107.84 |
| L5 1x | 1.70 → 1.64 | 44.61 → 43.38 |
| L5 4x | 5.24 → 5.20 | 157.63 → 152.93 |

The codec allocates zero while terminated; checkpoint tasks still allocate
substantially. The named diagnostic run attributes its biggest allocations to
canonical JSON `sort`/`join`, parsing, evidence resolution/validation and copies.
No complete codec average is claimed because import allocation and terminated
workers' final unsampled work are outside the profiler's coverage.

The isolated production worker/view control, with the same 600-command public
workload and only the diff generator changed, measured engine allocation
**22.31 → 21.10 MB/tick (L4)** and **26.04 → 24.80 MB/tick (L5)**, **5.4% / 4.8%
less**. Both 600-command final state hashes match exactly. Main allocation
remains ~0.91 / 0.95 MB/tick there. The main scope improvement removes ID maps/sets, temporary
ID arrays and empty diff-result arrays from settled-order comparisons. It
preserves the **exact prior patch representation**, checked against a frozen
reference generator over mixed long histories, duplicate IDs, missing IDs,
reorderings and nested changes.

Control receipts are `.local-dev/phone-runtime-budget-control-{before,after}/results.json`;
the script's optional `PHONE_BUDGET_CAPTURE`, `PHONE_BUDGET_REFERENCE_DIFF` and
`PHONE_BUDGET_LABEL` switches reproduce this without swapping working-tree files.
Normal regression runs use live sources and need no capture directory.

Remaining engine hotspots in the named 32-tick diagnostic include `normalize`,
`sort`, `Object.keys`, `cloneTickState`, `getOccupiedTiles`, evidence resolution
and journal patch generation. `operationalStatePatch` was also material. Domain
normalization/cloning/geometry are outside this lane and were **not edited**.
The much larger 100–150 MB/s engine churn is a concrete next milestone, not a
solved thermal problem. The diagnostic is unminified with production flags for
attribution only; acceptance heap/rate measurements use minified production.

Long-session checks:

- Permanent `node --expose-gc scripts/qa/phone-runtime-budget.mjs`: L4 and L5,
  **600/600 advancing ticks each**, ten game hours at 4x, real worker client,
  worker views, exact transport, normal 512-command compaction. Main retained
  samples stay below 92.1 MB; engine below 84.4 MB. This includes profiler and
  harness fixtures plus a conservative bounded 256-entry unhashed worker delta
  cache; a real journal normally releases those entries as hashes commit.
- Actual native-worker cloud session, L5, **1,200/1,200 ticks / twenty game hours**,
  actual persistent IDB service, first-save/day-end/rebase/compaction, no
  allocation profiler. Final main/engine are **49.28 / 64.32 MB**, codec idle 0.
  Main CPU instrumentation mean/p95: first 60 ticks **0.72 / 1.60 ms**;
  after eight hours **0.78 / 1.82 ms**; final hour **0.60 / 1.36 ms**.
  These exclude browser message decoding, React commits and rasterization.
- Eighty pan/zoom gestures with installed native Graphics and `--jitless`:
  **zero pan world rebuilds**, unchanged 682 / 793 objects and command counts;
  post-warm retained growth **4,168 / 3,944 bytes**, including measurement rows.
  No RenderTextures or permanent pixel readback mirrors. Native Graphics draw
  hashes are unchanged. This measures retention, not actual rendered FPS.
- Existing `PhoneFrameBudget` remains **30 active / 1 paused-idle / 0 hidden or
  covered**. This pass adds no timer/render loop. Actual achieved FPS, idle CPU,
  React/DOM retention, battery drain and heat remain manager device checks.

## Changes and correctness guards

1. **Offline phone art:** 142 deterministic premultiplied-alpha Lanczos PNG
   variants of existing room/decor art, at most half native resolution and
   **1,903 px maximum side**. The 7,611×749 recovery sheet now uses 1,903×188.
   No original decode or whole-atlas resize on phone startup. All selected
   phone sources and all newly allowed phone derivatives are ≤2,048 px/side.
   Source dimensions/hashes, output PNG hashes/dimensions and pixel hashes are
   recorded; no authored asset or clinical content is replaced. The maintenance
   tool uses the already installed Pillow 12.3.0, not a runtime dependency.
2. **Coordinate preservation:** authored crop IDs, placement rectangles,
   painter order, seat/floor contacts and masks remain native logical values.
   Only source cuts map to the smaller images; mask derivatives read their
   crop directly. Clip ratios preserve the same world clipping plane. Native
   Phaser frame tests and renderer integration tests cover this. Phone art can
   look softer at maximum zoom; physical visual review is required.
3. **Decode/load lifetime:** four global slots wait for `Image.decode()` when
   available (optional fallback for older Safari), including rejection handling.
   Build catalog thumbnail visibility no longer queues full room atlases.
   Actual placement still warms its sources. Stale asynchronous batches cannot
   install obsolete art. Settled layout changes reclaim unneeded atlas textures
   while preserving live references. Existing bounded weak/strong bitmap caches
   remain; the smaller actual source dimensions reduce their pixel working set.
4. **Automatic default:** phone Level 4+ or ≥40-room clinics select reduced mode
   without a dialog or prior crash. Diagnostic `phone-memory-large-clinic` is
   emitted once per guard. A clinic crossing the threshold updates canvas DPR
   and character budgets without remounting its map. Desktop is unaffected.
   The existing durable restart safeguard and clean-hide semantics are retained.
5. **Idle codec:** only native workers with zero pending tasks are released;
   new work cancels the five-second timer, then starts a worker lazily. Worker
   errors/retries keep their original payload and operation IDs. The codec
   contains no RPC authority. Durable IDB and prepared candidates survive release.
   No checkpoint timer, save format, journal limit, lease/fence, visibility,
   Save & Close, day-end or upload/conflict policy was changed.
6. **Transport allocation:** aligned-array and lazy empty-result fast paths;
   exact state/patch equality, no new retained memo table. The existing main
   recovery state and worker authority are retained for safe fallback.

All four paired fixture/speed runs have **byte-identical final GameState JSON
SHA-256** before/after; full hashes are in `summary.json`. No tick was dropped.
A per-export catalogue decoder experiment provided no meaningful heap reduction
because the required shared release root reaches that data. It was removed;
`runtime-clinical-graph.ts` and its original tests match the captured bytes.

## Regression budgets and files

- `phoneArt*.test.ts`: source/output provenance, PNG dimensions/hashes, actual
  native Phaser cuts/clip ratios, selected source budgets **65 MB L4 / 110 MB L5**,
  ≤2,048 sides. `lazyArt.test.tsx` checks actual phone URLs and catalog behavior.
- `roomAssets.test.ts`: four decodes, deferred decode promises/failures, bounded
  cache metadata and atlas reclamation. `codecPhoneIdle.test.ts`: pending-task
  safety, timer cancellation, idle release and lazy restart. Memory-policy and
  character-budget tests cover mid-session threshold transitions.
- `operationalArrayAllocation.test.ts`: zero full ID maps on a 5,000-row settled
  history, small changed-field transport and exact frozen-reference equivalence.
- `scripts/qa/phone-runtime-budget.mjs`: public production heap/allocation/wire
  regression. Main/engine retained ceilings **90 / 110 MiB**, sampled allocations
  **1.5 / 40 MB per command**, post-warm tail growth **24 MiB**, replies **<768 KB**
  after initial projection; CI allowance ×1.5 for sampled heap/allocation values.
  These are regression ceilings with headroom, not iPhone process budgets.
- `tests/e2e/map-pan-zoom-phone-memory.spec.ts`: automatic/restart reduced paths,
  production main heap **<384 MiB**, nominal RGBA **<100 / 155 MB**, ≤2,048 source
  side, DPR 1, one canvas, zero RT/readback and bounded gesture growth. Browser
  numbers have not been claimed or used to relax these assertions.

Changed runtime files: `FacilityCanvas.tsx`, `FacilityScene.ts`;
`mobile/performance/{phoneArt.ts,phoneArt.generated.json,phoneMemoryPolicy.ts,
characterTextureBudget.ts,roomAssets.ts,staticCanvasTexture.ts}`;
`session/cloud/{codecWorker.ts,gameSession.ts,operationalStatePatch.ts}`.
Tests are beside those modules. New maintenance tools:
`scripts/generate-phone-art-input.mjs`, `scripts/art/{phone-art-input.ts,
generate-phone-art.py}`. Generated assets: `apps/player/public/art/phone/*.png`
(142 files, 18,127,265 encoded bytes). All exact paths/hashes and shared-tree
exceptions are recorded in the evidence manifest/scope audit.

## Validation and shared-tree failures

Final required full player command (with the local offline Vite probe adapter):

```text
CI=true npm.cmd test --workspace @gamify-surgery/player -- --pool=threads
Test Files  5 failed | 409 passed (414)
Tests       6 failed | 4063 passed (4069)
Duration    439.22s
```

Four known baseline failures reproduce using the captured pre-pass sources:
`breadButterPresentation.test.ts`, `chartStructuredFields.test.tsx`,
`levelFiveRoomsViewModels.test.tsx`, `cloud/separateCampaign.test.ts` (choice
count, escaped HTML, gym note regex, existing legacy codec string ceiling).
Baseline controls: **4 failed / 121 passed tests, 7 files**, 25.04s.

The extra two failures are `tutorialViewModels.test.ts:197`, expected 37,750 vs
37,500 ms for both answer outcomes. **Captured reducer only + current player**
passes all **26/26** tutorial tests (7.32s). The test file and its clock/view
helpers were not edited by this lane. This isolates the change to the concurrent
domain reducer. No domain fix/assertion relaxation was made here.

Three renderer test failures from an intermediate desktop texture lookup were
ours and were fixed. Final full suite includes the fix; focused renderer and
transport run: **4 files / 79 tests passed**, 6.46s. Other focused receipts:
18 files / 120 tests; final decode/budget checks 3 files / 21 tests; extra
native-frame/transport/idle tests 3 files / 4 tests. The production runtime
harness passes both 600-tick fixtures. The art regeneration `--verify` passes all
142 pixel/source outputs. No timeout, codec limit or baseline assertion relaxed.

```text
npm.cmd run typecheck
All seven workspaces passed (exit 0).

npm.cmd run build
Native sandbox attempt: blocked at read-only Git inventory, spawnSync git EPERM.
With exact-inventory adapter:
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
All seven workspace typechecks passed.
673 modules transformed; built in 9.26s (exit 0).
```

Adapters are evidence-only: Vite's optional `net use` probe is disabled for the
local C: checkout; the boundary verifier receives a fresh byte-exact result of
read-only `git ls-files -z` because Node cannot spawn Git in this sandbox. No
verifier, assertion or app code is bypassed. No network/installation/history
mutation occurred. Scoped changed e2e spec/config typecheck passes. An extra
broad e2e typecheck found nine errors in unrelated periop/question-review/
service-detour/staffed-checkin/test-choice specs; their clean-release baseline is
unknown here and those files were preserved.

## Level 5 pins and integration handoff

Pinned results remain **26,362 commands / 6,056,335 cents / 410 completions /
0 walkouts**. The results file SHA-256 is unchanged:
`dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5`.
No rebind or journey regeneration was performed. Of 409 bound inputs, 32 current
digests differ from their old bindings: 25 still match the entry capture and
seven changed concurrently (balance index; domain index, persistence, reducer,
selectors, service-operations and types). **This lane changes zero bound inputs**.
Full digest lists/classification are in `summary.json`; source mismatches are
not a claim that the newly changed domain journey has been replayed/approved.

Manager browser/device set, production proof build and separate disposable QA
origin **http://127.0.0.1:5186**, never the owner's persistent save profile:

1. `map-pan-zoom-phone-memory` (phone automatic + restart-reduced, L4/L5), then
   `map-pan-zoom-performance`, `character-resolution-zoom`, `map-click-info`,
   `build-mode-usability`, `splitter-map-shade`, `floor-pattern-pan-stability`.
   Inspect rooms/furniture/masks at maximum zoom and label/popup placement.
2. `cloud-saves`, `cloud-recovery`, including fresh codec startup, pending save
   work near the idle deadline, Save & Close, visibility/pagehide, reload,
   offline/reconnect, day-end, fencing/conflicts and writer recovery. Observe
   `localDurable`/prepared candidates before and after codec release.
3. Physical mid-range iPhone standalone, same public L4/L5 saves: cold open,
   first minute/checkpoint, 1x/4x, Build catalog scroll/placement/cancel, sustained
   play and repeated hide/show. Record main/worker heaps, native decoded art,
   actual GPU/compositor/DOM/IDB memory, achieved active/idle FPS, temperatures
   and boot/timeOrigin/diagnostic IDs on any restart. Confirm no new document
   loop or auth loss; cause of the owner's previous loop is still unconfirmed.

Next substantial cost is the measured domain evidence/normalization/geometry
allocation and full checkpoint validation, plus browser-only raster/DOM costs.
Those need a separate bounded milestone with byte-exact reducer/evidence guards;
this report does not represent them as solved. Owner opening pathways are
unchanged (`START_GAME.cmd`, exact `http://127.0.0.1:4173`; canonical Pages has
separate storage). Work is local only. No commit, push, deploy, agents or installs.

## Round 2 — phone art readiness after port29 browser review

The manager's production Chrome phone L4/L5 runs timed out at30 seconds waiting
for `!scene.load.isLoading() && pendingCharacterStills.size === 0 &&
!crispZoomPending`. The manual dev observation was20+ seconds of fallback art.
This follow-up fixes a reproducible perpetual load/eviction loop and removes the
all-room loading barrier. No domain, clinical, cloud/session or save edits.

### Causes and fixes

1. Every character redraw prefetched **all four standing cardinals** for every
   live identity. Reduced mode retains32 character textures and deliberately
   evicts unused poses. The next redraw immediately requested those evicted
   poses again. On the paused public fixtures the old production-bundled scene
   made1,523/1,648 requests over31 simulated seconds and never became ready.
   Phones now request only each actual render plan's selected pose. Desktop
   cardinal prefetch stays unchanged; normal character scale, motion, floor
   contact, inspector failure behavior and pose selection stay unchanged.
2. `ensureMobileAtlases()` retained a `Promise.all` result and installed no room
   source until **every built-room atlas** finished. Visible art now installs
   independently. Visible room dependencies and environment sources start
   first, then background art. Live character requests have higher priority.
   A newly visible room promotes queued requests at gesture end, without a
   world rebuild or camera publication during pointer moves.
3. Room, character and inspector image work now shares the **same four slots**,
   including `Image.decode()`. The old phone had separate Phaser character and
   room queues, as well as immediate character redraws on each completion.
   Completions now coalesce into80ms presentation updates. Partial and offscreen
   room packs do not each trigger a world redraw; newly complete visible packs
   paint progressively, and the background completion paints once. Covered and
   hidden maps keep the existing no-drawing policy and resync when revealed.
4. The queue previously had no deadline. An image with neither load/error nor a
   settled decode could hold a slot forever. Queued/network requests now have a
   **12-second deadline from enqueue**, with a **1.5-second raster-decode
   deadline after onload**. Error/rejection/timeout/construction failure resolve
   to the existing procedural fallback, release handlers and the slot exactly
   once, and clear pending entries. One in eight starts serves the oldest job
   even under continuous higher-priority arrivals. The drain is non-recursive.
   Timeout counts appear in the small `phoneArtLoadingStatus()` diagnostic.

The142 offline phone PNGs, selected atlas sets,2048-pixel cap, decoded-source
weak references and2MiB reduced fallback LRU, character texture budget, automatic
reduced profile, codec idle policy and retained-camera behavior are preserved.
The room batch no longer holds a second array of all resolved image sources.

### Measured before/after and limits

Evidence: `.local-dev/phone-performance-pass-20261110/round2/` and
`.local-dev/phone-art-loading/{before,after}/`. The new repeatable command is
`node scripts/qa/phone-art-loading.mjs`, with `PHONE_ART_LEVEL=4` or `5`.
For the paired control, set `PHONE_ART_CAPTURE` to the round2 `entry` directory;
`PHONE_ART_PHASE=before` loads captured renderer/mobile sources, while `after`
uses their replacements. Packages and session/view projection stay frozen in
both. No working-tree sources are swapped and no private save is used.

This is **real minified production scene/cache code with deterministic I/O
replay**, not a browser or physical-iPhone measurement. Public PNG/WebP headers
and actual encoded byte sizes drive80ms request latency +20MB/s per-request
throughput and100MP/s raster replay; frames advance at33.333ms. Phone map viewport
is390x700 CSS pixels, zoom1.2, reduced DPR1. It isolates scheduling and lifetime
correctness. It excludes real HTTP contention, WebKit decoding, GPU/DOM costs,
React paint and the worker simulation. Manager browser timings are still needed.

| Measure | L4 before → after | L5 before → after |
| --- | --- | --- |
| First visible character paint | 1.167s →0.233s | 1.333s →0.233s |
| First complete visible room paint | ~2.267s →1.050s | ~4.600s →1.128s |
| All initially visible room dependencies installed | 2.267s →1.533s | 4.600s →2.367s |
| Original readiness predicate | >31s →0.533s | >31s →0.567s |
| All room/character work and final presentation settled | >31s →2.567s | >31s →4.933s |
| Requests by31s | 1,523 →115 | 1,648 →226 |
| New requests between15s and31s | 732 →0 | 740 →0 |
| Peak pending character sources | 62 →14 | 70 →16 |
| Retained texture entries after canonical final pose | 147 →129 | 262 →246 |
| Nominal retained texture RGBA after final pose | 83.434MB →79.747MB | 128.189MB →124.912MB |
| Full redraws during48-step pan | 0 →0 | 0 →0 |

The source first-arrival timestamps are0.138s for both new fixtures; first
character source arrival is0.220s. The table uses displayed actors/rooms rather
than treating any prefetched cardinal as visible art. Old room paint is sampled
at the following replay frame (at most33.333ms uncertainty). No decode timeouts,
failed character sources, missing room sources or pending work remain afterward.
Four active sources are the maximum throughout. Memory numbers above are nominal
decoded/canvas backing, **not process RAM, JS heap or GPU-driver measurements**.

Both fixture state hashes stay exact. After returning to the same camera, the
serialized settled display records are byte-identical for **all five** tested
maps on both fixtures: `fixtureGraphics`, `fixtureBitmapImages`,
`environmentSprites`, `landscapingBitmapImages`, `characterBitmapContainers`.
Graphics comparisons include current drawing commands; image records compare
current display properties rather than the history of redundant setter calls.
Full hashes and metrics are in `round2/comparison.json`. These checks supplement
the source/frame/clip and character/camera tests; they do not substitute for
pixel screenshots on an actual renderer.

### Chart-dialog failure

The density helper only waited for shell visibility and fonts. Shell/canvas
creation precedes completion of asynchronous campaign recovery, as already
documented and handled by `freshLocalCampaign.ts`. The density helper now waits
for the real **Loading clinic** region to disappear too. The phone density test
then selects a chart through the Patients tab and keeps its original5-second
dialog and control-size/overflow assertions; it no longer assumes recovery has
left a particular old sheet open. The public L4 checkpoint has no unopened
waiting encounters: its old open chart is a resolved summary and two other
encounters await results. The test can inspect a real Existing Patients chart.

This is an identified test precondition race, with possible additional UI
contention from the pose load loop. **The original missing-dialog event is not
proven to be a flaky browser or a reduced-mode chart bug**: its trace/context
was no longer present in GS-release's test-results when inspected; the two map
timeout contexts remained. No product chart/navigation behavior was changed.
Repeat the density test on phone in fresh contexts after this fix.

### Round-2 validation

- Focused renderer/mobile/inspector/shell run: **22 files /143 tests passed**,
 24.83s. Includes deadline/error/rejection/late-callback/fairness/construction
 failure tests, independent visible installs, L4/L5 exact-pose requests, source
 texture/frame budgets, retained camera, approved room rendering and MobileShell.
- Final full player (`CI=true npm.cmd test --workspace @gamify-surgery/player
 -- --pool=threads`): **413 files /4,073 tests passed;7 files /9 tests failed**,
 **494.78s**, exit1. All nine failures reproduce in the captured source control
 below; no owned failures remain. The first run was412 files /
 4,072 tests passed;8 files /10 tests failed,480.35s. One was the obsolete phone
 inspector prefetch expectation; it now asserts no unused phone prefetch while
 retaining desktop40-source and all10 inspectors' scale/depth/failure checks.
 The focused143-test run passes that update.
- Captured pre-edit control of the other seven failing files: **9 failed /
 96 passed,105 tests,12.05s**. It reproduces all four known baseline failures
 (`breadButterPresentation`, `chartStructuredFields`, `levelFiveRoomsViewModels`,
 `separateCampaign`) and five additional existing assertions: two tutorial wait
 values37,750 vs37,500ms and three examination upgrade descriptions that now
 include the routine APP speed benefit. None belongs to this phone change.
- Final scope audit found the other worker had updated `buildModePresentation`,
 `buildViewModels` and `tutorialViewModels` after the full run loaded them.
 Those three current files now pass **78/78 tests**,5.43s (`concurrent-tests.log`).
 Their fixes are preserved and excluded from this lane's patch; the historical
 full-run output above is unchanged. The four known baseline files remain the
 independently reproduced baseline, rather than new art failures.
- `npm.cmd run typecheck`: **all seven workspaces pass**, exit0. Scoped changed
 e2e and production replay TypeScript checks pass, exit0.
- Native `npm.cmd run build`: blocked solely by the sandbox's
 **`spawnSync git EPERM`** during tracked-path inventory. Re-running the same
 root command with the previously documented captured-inventory adapter passes
 boundaries, launcher, all seven typechecks and the player production build:
 **677 modules,10.68s**, exit0. This supplemental run uses the earlier captured
 tracked inventory; a fresh native inventory check remains for the manager.
 No boundary assertion/source scan was removed. Logs: `round2/{player-final,
 baseline-control,focused-pass,typecheck-root,typecheck-e2e,typecheck-qa,
 build-native,build-adapter}.log`.

Level5 pin artifact remains **26,362 commands /6,056,335 cents /410 completions /
0 walkouts**, raw SHA256
`dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5`.
No rebind or journey regeneration.36 of409 old input bindings differ:32 already
match this round's entry capture; four changed concurrently (`app-appointments`,
`reducer`, `selectors`, `service-operations` in game-domain). This lane changes
zero bound inputs. Full inventory is in `round2/pin-audit.json`; this is not a
claim that the concurrent domain changes have been accepted by a new journey.

### Files and remaining acceptance

Runtime: `FacilityScene.ts`, `mobile/performance/roomAssets.ts`, new
`bitmapDecodeQueue.ts` and `phoneArtPriority.ts`. Tests: their new queue/priority
tests, new `phoneCharacterRequests.test.ts`, `lazyArt.test.tsx`,
`facility/inspectionActors.test.ts`; e2e `map-pan-zoom-performance.spec.ts`,
`ui-density.spec.ts`, `ui-density-helpers.ts`. QA tooling:
`scripts/qa/phone-art-loading{.mjs,.entry.ts}`, `phone-art-test-textures.ts`.
Plan/report/current handoff are updated. Final scoped SHA inventory accompanies
the handoff; unrelated live-tree and release files are preserved.

Manager rerun:

1. `npm.cmd run test:e2e -- --config=playwright.map-performance.config.ts`
   (desktop and phone L4/L5). Phone proof now attaches `phone-opening-art.json`
   and requires **all room sources + final paint** as well as the original
   loader/character/zoom predicate. It asserts first room<2.5s, settled<8s, no
   missing/failed/timed-out images, with the existing hosted timing allowance;
   desktop production25ms frame budget is unchanged.
2. `ui-density` phone, repeated in fresh contexts with the existing functional
   QA entry; `phone-ui-space`, `character-resolution-zoom`, `map-click-info`,
   `build-mode-usability`, `splitter-map-shade`, `floor-pattern-pan-stability`,
   and `map-pan-zoom-phone-memory`. Verify actor direction changes and inspectors,
   progressive room art, gestures while art is arriving, and art after hide/show.
3. Physical iPhone cold/warm cache, normal cellular and failed/stalled image
   requests. A real failed or over-deadline image intentionally keeps the
   existing procedural fallback rather than a stuck queue; test those fallbacks
   and the counters. Confirm actual first-art/settled latency, native decoded/GPU
   memory and no heating/restart regression. The Node replay cannot prove these.

Production proof remains disposable **http://127.0.0.1:5186**, separate from
owner4173 and Pages storage. Owner opening pathways and account saves are
unchanged. No browsers, agents, network, commits, installs, push or deployment
were used for this follow-up.

