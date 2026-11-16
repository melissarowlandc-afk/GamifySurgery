# Level 5 phone play performance - 2026-11-16

## Goal and ownership

Reduce real high-level operational command cost (target Node median below 50 ms), prevent slow-worker restart storms and tick backlogs, reduce reduced-mode renderer memory/commands, and classify cloud capacity honestly while preserving playable durable local progress. Desktop appearance, saves, checksums, fencing, compression writes, FSRS, frozen encounters, clinical content and progression stay unchanged.

Main shared tree only. Player session/worker/performance/facility code and tests are owned. A concurrent domain worker owns state retention and load migrations: do not edit those files. Any proposed domain change must be reported with file/line unless it is an isolated pure hot-path optimization outside that worker's ownership. Re-read before every shared-file patch. No Git, agents, external network/live DB, installs, deploys or browser storage. Read the applicable AGENTS.md and current handoff.

Approved private report/export are read only as data. Private reconstructed state, measurements, hashes, profiles and controls stay under `.local-dev/phone-play-perf-20261116/`. No private fields, identifiers or save-derived fixture enter public files. Captured 2,237 source/config/tool paths before implementation; controlled before/after bundles bind the same captured domain/content/balance epoch despite concurrent changes.

## Milestones and acceptance

1. Profile real state using minified production bundles and node:inspector: 1x/4x pulses and typical player commands, command/projection/diff/freeze stages and top self time. Explain the difference from the smaller public fixture.
2. Optimize measured hotspots with exact state/checkpoint/view differential controls and a public large-clinic budget. Preserve command ordering and durable-before-ack. Diagnose the exact timeout and recovery path; prevent queued clock pulses and repeated expensive recovery while work progresses.
3. Inventory reduced-mode textures, canvas sources, static graphics and image decode deadlines. Bound the expensive resources, preserve zero-rebuild camera motion and desktop visuals, test reduced-mode budgets and image settling.
4. Capacity failures remain honest capacity status; local durable play/recovery continues without marking a valid clinic corrupt. Keep ceiling/format/DB/RPC unchanged. Add correctness tests.
5. Run focused tests, full player CI threads, seven typechecks, boundaries, production build, canonical Level 5 comparison without rebind and the actual pacing CLI (never concurrent with Vite reload work). Append final measurements, exact validation, owned paths, risks and handoff.

## Initial intake (historical)

- Intake and source capture complete. Earlier accepted opening/worker-delivery improvements remain present.
- Preliminary inspection: the app's operational session passes a 5,000 ms execution budget to the engine client; any receipt arms it, including async journal hashing. Facility clock already skips command work when the ordered session has pending work. Confirm which request timed out in the private report before changing policy.
- Renderer has four concurrent source loads, a 12 s deadline starting while queued and a separate 1.5 s decode deadline. Measure why large-clinic jobs hit these limits rather than extending them blindly.
- Next: reconstruct current approved snapshot in the private harness, profile matched production command paths, and establish before tables before implementation.

## Intermediate measurements (historical)

Minified production baseline on the approved current state, 30 commands: 1x pulse median169.42ms (domain125.70, diff4.28, view37.85); 4x pulse172.65ms; player pause toggles64.20ms. Top sampled self-time includes diagnostic JSON copies/calendar prediction, nested physical-door scans, normalization and tick clone. Current intermediate pulse134ms: target50ms is **not yet met**. Controlled bundles freeze the captured domain/content epoch; source maps verify the intended overlays. Intermediate compile-control mistakes and timing runs concurrent with tests are excluded from final comparisons.

Pure hot-path exception: edited only `packages/game-domain/src/spatial.ts` and `diagnostic-timing.ts`, plus new `diagnosticCalendarIndex.ts`. These are geometry/query/forecast optimizations; no retention, migration, reducer, service-operations, progression or balance edits. Geometry indexes use the existing bounded cache/actual geometry definitions, first-match door ownership and direct fallback for alternate readers. Forecasts fork mutable collections while sharing read-only records; predicted operations shallow-copy their status-owned objects. A forecast-local prefix index avoids repeated calendar key arrays, and settled trial scopes never survive predicted-state changes. Byte/state/control tests and full journey remain required before acceptance.

Production renderer replay on approved state reproduces218.09MB nominal textures (public PNG dimensions, native Phaser Graphics, simulated image I/O; no browser/GPU/DOM claim). Intermediate reduced path is56.25MB, max952px, zero RenderTextures, zero drawWorld calls during scripted pan. Native room floor/wall streams are split by room for conservative Canvas viewport culling; total retained numeric commands remain about480k, so report visible replay counts separately. Desktop path is unchanged. Offscreen actors advance routes but release presentation sources; reduced character sources cap192px and finalized masks cap384px. New offline `--reduced` public-art derivatives (266 PNGs,23.63MB total nominal pixels) avoid retaining full-size Level3/4/5 sheets. Existing normal derivatives remain unchanged. Reduced canvas source counts and repeated-gesture stability still need final guards. Existing bitmap loader can reject drawable images on its optional decode deadline; native complete/positive-dimension images now settle directly after load.

Capacity work: classify codec capacity distinctly from corruption. A derived checkpoint capacity failure with an existing durable journal keeps ordinary authority/lease/storage fences and local play, exposes a capacity notice and retains the existing preparation retry backoff. Non-journal capacity and actual storage/integrity failures still fence. No ceiling/format/DB/cadence change. Tests still required, including renewal, local rows, crash/reload and Save & Close honesty.

## Acceptance status and controlled measurements

**Partial improvement: the real-state pulse target below 50 ms is not met.** Final matched Node production runs measure 177.56 -> 130.69 ms at 1x including view derivation, and 131.61 -> 96.12 ms for evidence/reducer computation. No physical iPhone frame rate, heat, process memory or freeze-free play is claimed.

All private inputs, reconstructed states, CPU profiles, intermediate failures and controls stay in `.local-dev/phone-play-perf-20261116/`. No private fields, identifiers, cases or save-derived fixture enter tracked files. Minified SSR controls bind the same captured domain/balance/content epoch; after overlays only the owned pure domain modules. Source capture contains 2,245 paths. All 1,260 shared package/fixture/QA inputs match the preceding save-headroom baseline, establishing that failure comparison without Git. Intermediate compiler-control mistakes, concurrent timing runs and a wrongly typed private chart flag argument are excluded. Correctly typed chart scenarios succeed in both paths.

Three separate processes per scenario/path, 30 commands each; entries below are medians of run medians. Inspector sampling interval: 500 microseconds. Complete wall time includes case-slice readiness, evidence/reducer, state/evidence diff, view and view diff; it excludes IPC, rendering and the harness's byte-count serialization. Individual stage medians need not sum to the total median. Pulses use ordinary commands at 1x/4x; player scenarios pause/resume and open/close an existing checked-in historical chart. The real-state control has 175 rooms and 77 service operations; the smaller public runtime fixture does not exercise this forecast pressure.

| Node ms/command | Before 1x | After 1x | Before 4x | After 4x |
|---|---:|---:|---:|---:|
|Complete command + view|177.557|130.690|179.585|132.270|
|Evidence/reducer compute|131.612|96.118|132.641|93.231|
|State/evidence diff|4.535|4.872|4.545|4.729|
|View derivation|37.892|29.694|37.987|29.563|
|View diff|2.064|1.772|2.245|1.878|
|Complete p95|261.083|156.303|263.803|153.514|

| Other command / transport | Before | After |
|---|---:|---:|
|Pause/resume complete median ms|64.376|61.732|
|Historical chart open/close complete median ms|67.827|65.170|
|Median 1x reply JSON-equivalent bytes|1,080,761|334,639|
|Median 1x view patch bytes|464,174|22,751|

Pulse wall time improves 26.4%; reply bytes fall 69.0%, view patch bytes 95.1%. A planning 4x phone multiplier gives about 523 ms for the complete after pulse, **not 200 ms**. The reported phone compute divided by this control's compute is closer to 9x. That is not a controlled hardware calibration, but shows why 4x is not a guarantee; texture/thermal relief may alter the multiplier. Physical-device acceptance remains external.

### Attribution and remaining cost

Representative inspector self-time per pulse, not inclusive call times:

| Hot function | Before ms/pulse | After / explanation |
|---|---:|---|
|Diagnostic JSON copy|16.23|3.43; fork mutable calendar collections, share read-only records|
|Evidence normalization|12.03|7.13 plus immutable-proof checks; wire the existing sharing normalizer|
|Outer door-slot scan|10.15|Bounded geometry-owned fixture/physical-door indexes|
|Inner full door scan|8.06|Same index, original fallback for alternate readers|
|Tick state clone|5.96|Direct operational clone instead of JSON scratch allocation|
|Station-prefix filtering|5.62|Forecast-local prefix index, invalidated on key changes|
|Candidate reachability|5.49|5.29; still material|
|Phase scheduling|5.26|4.74; still material|
|Reading prediction|4.84|4.47; still material|
|Transport patch traversal|5.35|4.37, with far smaller published values|

Residual work includes repeated event/phase scheduling, path ranking, evidence normalization and overview derivation. Instrumented calendar experiments count about 50 ms inclusive scheduling per pulse. Predicted staff/duty state legitimately mutates between forecasts; one state-identity cache retained across those mutations would give incorrect ETAs. No such cache was introduced. Further work needs explicit forecast invalidation or additional pure allocation reductions, coordinated with the domain lane before changing mutation/retention boundaries. The remaining direct clone still owns mutable operational branches, so this is not a claim that all tick allocation is proportional to change.

### Pure domain hot-path exception

Owned domain changes: `spatial.ts`, `diagnostic-timing.ts`, `game-evidence.ts` (normalizer import), `tickStateClone.ts` (direct-clone delegation), and new `diagnosticCalendarIndex.ts`/test. These are pure geometry/query/clone/evidence execution optimizations outside the other worker's retention/migration ownership. **No reducer.ts, service-operations.ts, retention, migration, balance, progression or clinical-content edits.** Existing `incrementalTickClone.ts` and `incrementalEvidenceValues.ts` remain unchanged dependencies; the port must check/include their exact versions if absent in release.

Geometry keys actual placement/doors/navigation definitions, preserves first-match ownership for duplicate QA IDs, and retains original scans for alternate readers. Calendars fork mutable arrays/sets/maps and share only read-only records. Reading predictions copy mutable employee/status fields; settled query scopes end before prediction mutations. Service-calendar caching no longer varies by an unused encounter argument. Existing exact normalizer/clone/reference tests remain intact.

### Transport, timeouts and backpressure

The app previously passed **5,000 ms to every engine request**, including journal hash/encode. A receipt armed that timer; expiry destroyed the entire engine, followed by full published-checkpoint hydration and uncertain-command fallback. The report did not identify the expired request kind, so it cannot establish retrospectively whether the two incidents were commands, projections or hashes. New health records kind/command/age and diagnoses subsequent timeouts.

Play now uses a **30 s inactivity budget**, refreshed at genuine simulation/diff/projection/publication or journal-row phases, never duplicate receipts. Startup retains 10 s; codec active/dequeue/heartbeat and HTTP/cloud/lease deadlines are unchanged. Journal rows hash/encode sequentially instead of starting a burst of compression streams. An expired/failed derived hash rejects only that task and uses the existing journal fallback, preserving the state engine. Late results cannot acknowledge/write the old row. A valid late completion after expired tasks drain restores future worker hashing without rehydration. Disabled hashing goes straight to fallback without diagnosing every subsequent row.

Actual worker failures retain the existing ordered prefix, operation IDs and same-command fallback. Repeated hydrate-then-crash cycles back off 5/10/20/40/60 s; readiness alone does not reset backoff, a completed stateful command does. Clock intents skip before admission while ordered work **or durable journal work** is pending; no catch-up queue is created. Player commands are retained and keep durable-before-ack ordering. Tests cover progressing work, duplicate receipts, late/hash failures, repeated crash backoff, held journal writes, player admission and exact replay.

### Reduced-mode rendering and loading

Matched production/native-Phaser Graphics replay: 390x700 CSS, DPR1, same approved state. Actual public PNG/WebP dimensions/encoded sizes, fixed 80 ms request latency, 20 MB/s per-request throughput, 100 MP/s raster and 33.333 ms frames. This is a scheduling/retained-resource control, **not browser/GPU/OS heap measurement**. Baseline nominal textures reproduce the report's approximate scale.

| Resource | Before | After |
|---|---:|---:|
|Nominal texture RGBA bytes|218,092,784|56,247,164|
|Texture count|402|356|
|Canvas sources|67|126|
|Largest retained texture side|1903 px|952 px|
|Display objects|1303|1340|
|Retained Graphics command numbers|480,435|480,435|
|Visible Graphics numbers replayed|478,851|196,987|
|RenderTextures / permanent readback bytes|0 / 0|0 / 0|
|World rebuilds during 48 pan steps|0|0|
|First painted room, simulated ms|1239|1105|
|All art settled, simulated ms|7233|6067|

Nominal textures fall **74.2%** and visible command replay **58.9%**. Object count rises 37 and canvas count 59: explicit tradeoffs, not claims of fewer objects. Small canvases replace larger decoded sources. Total retained Graphics numbers remain unchanged. The settled replay cache reports zero strong retained bytes; decoder caches/GPU copies are not counted.

Reduced mode selects 266 deterministic quarter-resolution public-art derivatives: 23,630,172 nominal bytes for the entire set, max952 px. Original 142 normal variants and source art remain unchanged and verified. Active still sources cap192 px; finalized chair/stool/landscape masks cap384 px, preserving logical crops/display sizes/floor anchors. Masks release native scratch backing pixels immediately after copying. Offscreen actors advance routes but release presentation objects; paused actors reappear across camera guard-band tiles. Native room streams permit conservative offscreen Canvas culling, including gradient styles, without raster caches. Build Mode's grid stays in the architecture layer while art loads. Desktop source/render paths stay unchanged.

The report's 40 image timeouts are not reproduced by deterministic I/O. A demonstrated false-missing-art path was the optional `Image.decode()` wait rejecting a complete, drawable loaded image. Those images now settle on load; a forced hung-decode test passes with no timeout. Dead requests/decoders keep their deadlines, cleanup and fair scheduling. This does not prove that every reported timeout had that cause.

### Capacity and safety

Codec capacity maps to capacity, never corruption. For an authoritative durable local journal, checkpoint preparation **and upload-path** capacity preserve local play and display: “This clinic has reached the cloud save size limit. Progress is saving on this device.” No lease, admission, writer, revision, storage or integrity fence is bypassed. Existing preparation retry backoff remains; successful fresh preparation clears the notice, healthy renewal alone does not.

Tests cover commands after capacity, exact local replay, failed Save & Close without false confirmation, recovery on retry, upload capacity, expiry, writer fencing and non-journal fail-closed behavior. The 3 MB ceiling, cloud/DB/RPC formats, compression writes=true, cadence, FSRS, frozen encounters and checksums stay unchanged. This is **not a headroom fix**: rows replay without cloud encoding, but automatic selection of an already oversized journal on a later cold open can still need the separate headroom work. No copy is discarded or silently replaced by older cloud state.

## Correctness and validation

All 12 matched 30-command scenarios have byte-identical final evidence checkpoints. Actual native Level5 CHECK runs also match all **41 sampled earned/progress/final serialized states** byte for byte. Both: **35,342 commands / 6,966,492 cents / 551 completions / 0 walkouts**, final tick33,091. Historical canonical JSON stays26,362 /6,056,335 /410 /0: existing context drift unchanged. Canonical writes were blocked; no rebind/pin rewrite. Owned source hash deltas are in the scoped port manifest.

PowerShell/npm.cmd, CI=true, threads/maxWorkers4. Complete output/exit receipts remain private. The established offline adapter suppresses only Vite's optional `net use` discovery. Boundaries parse the current checksum-verified 22,539-entry index read-only, with no Git process; current dependency/source/private-prefix/launcher checks remain unchanged.

Completed before the final acceptance rerun:

- Focused player: **16 files /67 passed,65.89 s**.
- Initial full player: **470 files /5,625 passed,971.82 s**. Final rerun includes the later-added backoff guard and final review changes.
- Final review focus: **5 files /15 passed,16.90 s**. The preceding facility/transport run passed80 files/642 tests; only the new grid test's headless initial-depth assumption failed. It now checks the actual layer after redraw. No existing assertion was loosened.
- Full domain: **2 failed /225 passed files;27 failed /6,126 passed /1 skipped,598.93 s**. Same27 baseline assertions:26 existing Level5 binding/legacy-load comparisons and1 admission count. The binding already differed before this lane; owned pure source hashes add intentional unbound deltas. Legacy failures occur at pre-command hydration under the same prior input epoch. No new behavior failure.
- Seven workspace typechecks and initial root build: **PASS**; production build9.19 s. Final root build follows the last guard changes.
- Boundaries/launcher: **PASS**,22,539 current paths, no Git process.
- Original142/reduced266 asset source/dimension/pixel checks: **PASS**.
- Actual pacing CLI, run alone after Vite work: **PASS**, first finish26,377 vs26,281 (+0.3653%),442 completions,0 walkouts,5,913,995 cents.

Final receipts follow below. Physical iPhone acceptance and the unmet 50 ms real-state target remain open.

## Owned file inventory

37 runtime/test/generator/manifest paths, plus266 new public PNG derivatives. All other shared-tree changes stay outside this port. Exact per-file before/after SHA256 and byte counts: `.local-dev/phone-play-perf-20261116/runtime-port-manifest.json`. Two unchanged runtime dependencies are identified separately for release-port verification.

- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/graphicsViewportCulling.test.ts`
- `apps/player/src/facility/graphicsViewportCulling.ts`
- `apps/player/src/facility/reducedClinicRendering.test.ts`
- `apps/player/src/mobile/performance/bitmapDecodeQueue.test.ts`
- `apps/player/src/mobile/performance/bitmapDecodeQueue.ts`
- `apps/player/src/mobile/performance/phoneArt.test.ts`
- `apps/player/src/mobile/performance/phoneArt.ts`
- `apps/player/src/mobile/performance/phoneReducedArt.generated.json`
- `apps/player/src/mobile/performance/phoneRenderWindow.ts`
- `apps/player/src/mobile/performance/reducedTextureSource.test.ts`
- `apps/player/src/mobile/performance/reducedTextureSource.ts`
- `apps/player/src/session/cloud/checkpointCapacity.test.ts`
- `apps/player/src/session/cloud/clockJournalBackpressure.test.ts`
- `apps/player/src/session/cloud/codecJson.ts`
- `apps/player/src/session/cloud/coordinator.ts`
- `apps/player/src/session/cloud/gameSession.ts`
- `apps/player/src/session/cloud/largeClinicEnginePerformance.test.ts`
- `apps/player/src/session/cloud/operationalEngine.worker.ts`
- `apps/player/src/session/cloud/operationalEngineClient.ts`
- `apps/player/src/session/cloud/operationalEngineDispatch.ts`
- `apps/player/src/session/cloud/operationalEngineLiveness.test.ts`
- `apps/player/src/session/cloud/operationalEngineProcessor.ts`
- `apps/player/src/session/cloud/operationalEngineProtocol.ts`
- `apps/player/src/session/cloud/operationalSessionEngine.ts`
- `apps/player/src/session/cloud/operationalSessionPerformance.test.tsx`
- `apps/player/src/session/cloud/operationalSessionRecoveryBackoff.test.ts`
- `apps/player/src/session/cloud/operationalStatePatch.test.ts`
- `apps/player/src/session/cloud/operationalStatePatch.ts`
- `apps/player/src/ui/CloudSaveControls.tsx`
- `packages/game-domain/src/diagnostic-timing.ts`
- `packages/game-domain/src/diagnosticCalendarIndex.test.ts`
- `packages/game-domain/src/diagnosticCalendarIndex.ts`
- `packages/game-domain/src/game-evidence.ts`
- `packages/game-domain/src/spatial.ts`
- `packages/game-domain/src/tickStateClone.ts`
- `scripts/art/generate-phone-art.py`

New images: `apps/player/public/art/phone-reduced/*.png` (266 exact paths/hashes in the manifest). No normal derivative/source image changed.

Unchanged required modules: `packages/game-domain/src/incrementalEvidenceValues.ts`, `packages/game-domain/src/incrementalTickClone.ts`.

Documentation: this ExecPlan and an appended section in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. No port/commit/push/deploy/backup action was performed.

## Final validated handoff

All runtime edits are frozen. A further matched production control compares **133 successive commands** on the approved state: every published state, every complete projected view and the final evidence checkpoint match the captured old path byte for byte. This includes 120 pulses, speed changes and chart actions. These are correctness controls, excluded from timing measurements. The 41 native public journey states also remain exact. The two large canonical public JSON fixtures are verified against the preceding read-only intake; all canonical QA outputs and the compression-write policy are unchanged.

Authoritative final player run, after all runtime changes and with the added backoff test:

```text
CI=true npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=4
 Test Files  471 passed (471)
      Tests  5626 passed (5626)
   Duration  828.59s (transform 35.30s, setup 0ms, import 1001.85s, tests 2257.44s, environment 39ms)
exit 0
```

Full domain, unchanged known baseline failures:

```text
# cwd packages/game-domain; CI=true
npm.cmd test -- --pool=threads --maxWorkers=4
 Test Files  2 failed | 225 passed (227)
      Tests  27 failed | 6126 passed | 1 skipped (6154)
   Duration  598.93s (transform 30.09s, setup 0ms, import 741.28s, tests 1618.89s, environment 30ms)
exit 1
```

Those failures are `tests/approved-clinical-admission.test.ts` (1) and `tests/level-five-integration.test.ts` (26). The prior verified intake has exactly the same failing assertions. No behavior/differential failure was added. Four existing pure source files and one new helper change the bound source inputs; their full before/after SHA256 are in `bound-input-deltas.json`. No source guard, canonical pin or expected earned result was rewritten.

Other exact receipts:

```text
Focused player: Test Files 16 passed (16); Tests 67 passed (67); Duration 65.89s; exit 0
Final review:  Test Files 5 passed (5); Tests 15 passed (15); Duration 16.90s; exit 0
Domain focus: Test Files 9 passed (9); Tests 98 passed (98); Duration 41.25s; exit 0
npm.cmd run typecheck: all seven workspaces PASS, exit 0
npm.cmd run test:boundaries: exit 0
Using checksum-verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
npm.cmd run build: exit 0 (includes boundaries and all seven typechecks)
698 modules transformed.
built in 8.48s
node tools/qa/content-pacing-check.mjs: exit 0
firstFinishTick 26377; closingCashCents 5913995; completions 442; walkouts 0
referenceTick 26281; driftPercent 0.3652829039990868
```

The integrated account performance test still asserts an actual admitted tick and its original main16ms/view50ms budgets (existing hostedTime policy). It drains setup journal work before sampling; held-journal skipping/player admission is covered separately. A skipped intent cannot count as a fast tick. All existing tick/state/evidence differential assertions remain intact. Original and reduced asset verification also exit0. Build chunk-size/plugin timing advisories are non-failing.

`validation-receipt.json`, `measurement-summary.json`, `runtime-port-manifest.json`, `bound-input-deltas.json` and complete logs retain the exact evidence. The scoped port is 37 changed/new code/test/manifest/generator paths +266 PNGs +2 documentation paths; two unchanged runtime dependencies are separately identified. No unrelated captured source drift exists. No Git, agent, network/live DB, install, browser/storage, deploy or backup action; no opening origin changed.

Remaining work/risks:

- The real-state target is still **130.69ms, not below50ms**. Primary next locations: `diagnostic-timing.ts:345` phase scheduling and `:564` reading event prediction; `viewModels.ts:1486` overview derivation and `:2379` receipt projection; `incrementalTickClone.ts:14` remaining operational branch allocation. Any further cross-phase cache needs explicit mutation invalidation and the same differential discipline. Retention/migration files remain with the domain worker.
- Physical iPhone steady/peak JS+decoder+GPU memory, frame time, long-session heat, actual decode deadlines and crash/reload behavior remain manager checks. Nominal textures and simulated loading do not measure WebKit process memory. Total retained Graphics numbers are unchanged; visible replay is reduced.
- Cloud headroom is not solved here. Oversized durable rows remain recoverable without cloud encoding, but later automatic cold-open selection can still require the separate headroom fix; no old cloud copy replaces them silently.
- Renderer quality/seat anchors/crops at maximum phone zoom need production browser acceptance. Desktop source art is unchanged; reduced sources deliberately trade phone source resolution for memory.
- The old report does not identify the exact timed-out request. New per-request diagnostics will do so; indefinite OS suspension/one phase blocking beyond the inactivity limit is not made observable by progress messages.

Manager checks: production phone/desktop `map-pan-zoom-performance`, `character-resolution-zoom`, `map-click-info`, `build-mode-usability`, `splitter-map-shade`, `ui-density`; cloud-saves/cloud-recovery, capacity notice with durable local progress, Save & Close failure/retry, worker/hash crash recovery, visibility/pagehide and writer fencing. On the physical high-level PWA, record main/engine/codec heaps, nominal textures, decode failures, pulse compute/wall and skipped clocks over sustained1x/4x play. This milestone is a measured partial improvement ready for review, not full performance acceptance.


## Release 40 follow-up: reduced texture geometry (2026-11-16)

### Goal, ownership and constraints

Fix the manager's reduced-mode front-desk chair size/occlusion regression while retaining the memory reductions. Normal and reduced sources must have the same authored world rectangle, anchor, position and painter depth within 0.5 world units. Main shared tree only; this follow-up changes facility/mobile-performance rendering and its tests. No domain, save/session, diagnostic-wait UI, clinical, balance, progression or image asset changes. Concurrent question and cloud/UI work is preserved and excluded from the fix port. No Git, agents, network/live DB, real saves, browser/storage, installs or deploys.

### Cause and fixes

Phaser's native Image.setTexture()/setFrame() changes the frame's native dimensions while retaining its scale. The chair's full atlas crop is already reduced, but its separately derived rear/arm texture has a different physical pixel count. Reconciliation changed the texture without restoring the authored display size, then copied the enlarged size into the foreground arm. Repeated occupied/empty swaps could change it again. The corrected switch retains displayWidth/displayHeight and origin before changing the frame, then restores them; foreground geometry copies the same rectangle. Existing position and depth rules are retained.

Compacted derived textures also lost their logical source-coordinate dimensions. Compaction now retains that small metadata on the replacement texture, using the existing weak source map, before releasing the old owned scratch canvas. This fixes source-relative crop math without retaining any additional image or native-sized canvas. The backless stool crop uses the derivative's local [0,0] source origin, rather than the original atlas offset.

Two other draw methods used native-pixel setScale after backing images shrank: cleaned landscaping and independent frontage props. They now set the authored display dimensions explicitly. TileSprite bounds were already explicit, but their material repeat pitch and phase also need compensation for physical source-frame dimensions. Environment, architecture and frontage tiles now apply that compensation on the mobile path, including rounded atlas cuts and subpixel curb buffers. Desktop material scales and source art are unchanged.

### Complete call-site audit

| Source path | Geometry handling / regression coverage |
| --- | --- |
| Mobile generated atlases and fallback resizing (FacilityScene.ensureMobileAtlases) | Existing installPhoneArtSource maps logical frame cuts. Regular room/fixture/decor/architecture images already use explicit world display dimensions. Native scene fixtures are compared with the actual generated reduced sources; tiled materials now compensate period/phase. |
| Character stills (ensureCharacterStills, reducedTextureSource) | Existing drawPixelPerson sets display size from world presentation metrics and origin from the native registration, including floor/seat alignment. All three directions and idle/seated states are compared using native Image and Container classes. No character geometry change required. |
| Cleaned landscaping (registerLandscapingAtlasFrames) | Compaction retains logical coordinates; explicit source installation stays idempotent. Every landscaping frame now fits its authored dimensions and origin independently of physical pixels. |
| Backless rolling stools (ensureBacklessRollingStoolTexture) | Both derived source kinds retain metadata; normal/reduced scene draw rectangles match. Crop widths/heights retain the same visible world bounds. Native scratch canvases still release immediately. |
| Approved chair rear/foreground masks (ensureApprovedSideChairTextures) | All 24 mask definitions/orientations, at three tile sizes and native/half/quarter atlas sources, survive six repeated occupancy transitions at the same world rectangle, origin and base/actor-relative foreground depth. |
| Independent frontage images and three tile draw methods | All frontage sources, every environment frame and each surgery architecture component compare normal/reduced bounds. Material pitch and phase compare to 8 decimal places, including a 0.4-world-unit curb band. |

Other source-relative tint derivatives already set explicit world dimensions and clip by the physical frame fraction; their source pixels and painter rules are unchanged. No new RenderTexture, atlas, decoded bitmap, culling container or raster cache is introduced. Character/static caps remain 192/384px. Existing full-bank reduced-art budget remains below 24,000,000 nominal RGBA bytes.

### Regression evidence

The new textureWorldGeometry.test.ts uses installed native Phaser Texture, Frame, Image, TileSprite and Container classes, without browser/device probing or a renderer. In particular, displayWidth comes from real frame dimensions and scale; a mock that simply stores displayWidth would miss this bug. Canvas pixel operations are stubbed, so this is geometry/resource-policy proof, not browser visual acceptance.

Captured pre-edit versions of the three runtime modules were substituted read-only by a private Vite transform. The final seven tests then produce **5 failures / 2 passes**, exit 1 (expected negative control): chair width drift 28.169697 world units in the first failing case; stool visible crop 32.955063 instead of 29.61; landscaping width drift 66.903427; frontage width drift 48.5; environment material pitch 42.7 instead of 172.2. The regular-fixture and character tests already pass before the fix, documenting the safe call sites. No live source was swapped to run the control.

With the fix, the same seven tests pass. A private instrumentation-only run records **2,665 rectangle comparisons, 216 chair/source/size combinations, maximum rectangle error 2.842170943040401e-14 world units** (well below 0.5). Source pixels remain compacted: the front-desk mask still has 266x384 backing pixels rather than 331x478. It no longer dictates display size. A second private instrumentation-only run adds the browser's 52px tile size: **3,529 rectangle comparisons / 288 chair combinations**, same maximum error. The reported front-desk staff chair displays **45x65** with both the normal **331x478** and compacted **266x384** backing at x31/y83, origin0/0 and depth123000. Six occupied/empty transitions preserve the same geometry; the foreground keeps its existing actor-relative painter depth. This directly exercises the native texture switch at the browser's authored size. Logs, control config, geometry proof and exact intake hashes remain in `.local-dev/phone-play-perf-20261116/chair-fix/`; public fixtures/art metadata only.

### Files and validation progress

Runtime: apps/player/src/facility/FacilityScene.ts; apps/player/src/mobile/performance/phoneArt.ts; apps/player/src/mobile/performance/reducedTextureSource.ts. New regression: apps/player/src/facility/textureWorldGeometry.test.ts. Documentation: this append and an appended CURRENT_THREAD_HANDOFF entry only. Exact before/after SHA256 and the fix-only unified patch will be supplied under chair-fix/; they exclude the earlier accepted milestone and unrelated shared-tree edits.

Final runtime/test inputs are frozen. Validation so far (CI=true, npm.cmd, threads, maxWorkers=4):

```text
Focused facility/mobile: Test Files 101 passed (101); Tests 743 passed (743)
Duration 65.66s (transform 26.78s, setup 0ms, import 197.96s, tests 41.92s, environment 10ms)
exit 0
Native geometry proof: Test Files 1 passed (1); Tests 7 passed (7); Duration 11.89s; exit 0
Seven workspace typechecks: PASS, exit 0
```

Final receipts follow below. Original pacing/rebind/canonical fixture bytes are not rewritten. Physical production browser acceptance is still required: the manager should check the reported front-desk staff chair behind the receptionist/counter, occupancy transitions, all chair orientations, clipped stools, landscaping and continuous floor/curb materials at phone zoom extremes, then the existing desktop/phone character-resolution, map, Build Mode and splitter specs. This worker cannot run browsers.


### Final validation and port handoff

All four rendering/test paths still match the frozen validation inputs. No implementation/assertion changed after the focused run. Full player result (CI=true):

```text
# cwd apps/player
npm.cmd test -- --pool=threads --maxWorkers=4
 Test Files  473 passed (473)
      Tests  5660 passed (5660)
   Start at  12:26:45
   Duration  845.53s (transform 41.64s, setup 0ms, import 1033.35s, tests 2239.64s, environment 41ms)
exit 0

npm.cmd run typecheck
all seven workspaces PASS, exit 0

npm.cmd run test:boundaries
Using checksum-verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
exit 0

npm.cmd run build --workspace @gamify-surgery/player
701 modules transformed; built in 11.06s; exit 0

npm.cmd run build
boundaries + all seven typechecks PASS
701 modules transformed; built in 13.54s; exit 0

node tools/qa/content-pacing-check.mjs
firstFinishTick 26377; closingCashCents 5913995; completions 442; walkouts 0
referenceTick 26281; driftPercent 0.3652829039990868
caseCount 1436; registeredMeanings 1142
exit 0; 207112ms; run alone after all owned Vitest/build processes finished
```

The seven typecheck workspaces are clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. The standalone first typecheck passed. An initial root-build attempt later caught a concurrent new cloud test referring to a nonexistent PrototypePlayerView.learning property (operationalViewReuse.test.ts:15, two TS2339 errors). That test was absent from this task's intake and was independently corrected to development before the final successful root build. This worker neither edited nor excluded it; the failed attempt remains in build.log. Experimental TypeScript, existing chunk-size, ineffective dynamic import and plugin timing advisories are non-failing.

The working tree moved in unrelated cloud/view, domain reducer, UI test and beta-invite paths during validation. Their changes are preserved, excluded from this patch, and recorded in the private intake-drift receipt. Counts above describe the shared tree at each run; they are not a promise of the release worktree's collection count. Manager integration should rerun the combined lanes after they settle. The owned rendering inputs are frozen and unchanged throughout validation. Public original/reduced image hashes and resource budgets passed in the focused/full tests. Original two large canonical QA JSON files and furniture before-fixture/anchor/mask data remain unchanged; no pins or expectations were rebound.

Port package: `.local-dev/phone-play-perf-20261116/chair-fix/chair-fix.patch` and `chair-fix-manifest.json`, with exact before/after SHA256 for four code/test paths plus this ExecPlan and the handoff append. It contains only the current geometry follow-up, relative to the captured pre-edit versions, and does not recopy the earlier performance milestone. Final file copies, immutable captured baselines, negative-control/proof configs, patch-reconstruction check and full validation logs/receipt remain alongside it. Apply only these hunks when a target differs from its recorded baseline; preserve every release-tree difference. No Git/agents/network/real-save/browser/storage/install/deploy/backup action or opening-origin change occurred.

Remaining acceptance: manager production browser check of the actual front-desk chair/counter/floor mat, repeated occupancy, all approved chair orientations, stools/tint clips, landscaping, material seams and characters at settled zoom extremes. Existing character-resolution-zoom, map-click-info, build-mode-usability, splitter-map-shade, map-pan-zoom-performance and ui-density specs remain the browser check set. The native geometry harness does not render pixels or measure WebKit/GPU memory. This presentation correction leaves the earlier milestone's remaining CPU/physical-device risks unchanged.
