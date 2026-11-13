# Phone memory and background work - 2026-11-12

## Goal, scope and repository state

Reduce phone memory, allocation and background/storage work using public late-L4/L5 and the large opening fixture. The suggested targets were 30% lower steady heap and 50% fewer storage writes; report actual results without weakening durability, ordering, operation IDs, fencing, recovery, FSRS or frozen encounters. No owner/tester save or browser storage was read. No Git command, network, browser, agent, install, commit, push or deployment was used.

Own player runtime/performance and perf-only domain helpers. Clinical-content, balance/progression, other research packets and artifacts/checkpoints are read-only. Source epoch: `.local-dev/phone-memory-20261112/entry.json` (1,768 captured public source paths). Preserve all concurrent work. The three protected timing sources (`App.tsx`, `automaticResolution.ts`, `openingUploadLarge.test.ts`) remain byte-identical to entry. Supabase skill was consulted for local save-boundary guidance; no backend, auth API or schema change, remote documentation or query was made.

## Results and target assessment

Paused L5 aggregate retained JS heap falls **114.37 MB -> 52.14 MB (54.4% lower)** after the reduced-memory phone's 30-second idle barrier. Hidden, durable/settled falls **113.32 -> 52.79 MB**. Active L5 retained heap remains about 112.5 MB: **the 30% active steady-heap target is not met**. The complete catalogue and exact main-thread recovery mirror remain resident.

Engine allocation falls about 18% at 1x and 26% at 4x. Legacy 9k opening codec allocation falls 1,485.3 ->1,127.9MB (24.1%); these are cumulative allocations, not resident RAM. Sampled peaks vary with V8 collection: no reliable peak-heap reduction or iPhone jetsam fix is claimed. Healthy narrow-phone diagnostic writes fall 12 ->1/minute. Journal mutation requests fall547 ->304 in the first-minute L5 trace; including 7 cache commits, 554 ->311 (43.9% fewer API mutations). **Persisted payload bytes and transaction count are essentially unchanged; 50% fewer physical storage writes is not proven.**

This is a measured reduction in idle retention, repeated geometry work, allocation and hidden wakeups. It is not proof that all high-level phone RAM/thermal targets are achieved. Manager browser/device acceptance remains necessary.

## Method and limitations

Production-mode Vite/Rolldown SSR bundles, Node 24.19.0, native engine and codec workers. Both before/after use the same frozen 1340-case / 1535-node public catalogue and balance/domain epoch. The final `cache` bundle substitutes only the owned `facility-access-cache.ts` helper; other package sources remain frozen. Worker command/view publication, journal hashing, native preparation and the actual coordinator/session run. Persistent fake IndexedDB journal storage and the fake cloud server live in separate service realms, excluded from client heap totals. The cache adapter is `MemoryCloudCache`, with commit/payload instrumentation; native browser cache packing/IDB overhead is not fully represented. Its RAM backing makes these totals conservative versus native IDB residency, but is not a substitute for browser acceptance.

Public `integration-l4` / `integration-build` checkpoints are shifted to Day20, unpaused and run 240 ticks at 250 ms (four game hours at 4x). L5 current-state JSON 1,084,094 B / V8 serialization 1,044,025 B; L4 JSON 1,073,452 B. The generated large fixture uses `largeEntryFixture(3200,false)`:8,962 immutable records, genuine reducer-produced history,23,930B compressed operational snapshot. No padded/private clinic. Initial compressed seed references are released after seeding the external fake backend in the large controlled runs.

Heap below is post-explicit-GC `heapUsed`, decimal MB, per realm. Five-millisecond and command-boundary samples supply observed peaks; synchronous bursts/collections can escape sampling. Worker queues, samplers and profiler arrays are QA-only. RSS includes all Node service realms and is **not** phone RAM. GPU/decoded-image figures are nominal source-pixel accounting, excluded from JS heaps. React DOM, WebKit native/decoder/GPU residency and actual flash writes cannot be measured here. The manager must collect them on a physical iPhone/production browser. Do not sum serialization byte sizes into JS heaps or count a renderer texture twice without measuring GPU backing.

## Measured retained JS heap

Each cell is main / engine / codec MB. Zero denotes a terminated realm, not a GC estimate.

| Workload/boundary | Before | After |
|---|---:|---:|
| Late L4, active after codec idle | 51.90 / 58.23 / 0.00 | 51.88 / 58.14 / 0.00 |
| L5 Day20, active after codec idle | 51.74 / 60.76 / 0.00 | 51.72 / 60.80 / 0.00 |
| L5 first checkpoint | 56.13 / 55.42 / 50.97 | 56.15 / 55.37 / 50.96 |
| L5 paused 31 s | 52.64 / 61.74 / 0.00 | 52.14 / 0.00 / 0.00 |
| L5 hidden, durable/settled | 52.55 / 60.76 / 0.00 | 52.79 / 0.00 / 0.00 |
| 9k opening, playable | 68.21 / 56.27 / 0.00 | 68.19 / 56.26 / 0.00 |
| 9k after240 commands/codec idle | 54.03 / 63.76 / 0.00 | 54.05 / 64.22 / 0.00 |

Pausing does not create a save RPC or alter domain pause: the existing pause/player command has already happened. Hidden release follows the existing lifecycle checkpoint. The next admitted command restarts the engine from the exact recovery prefix before applying. Normal-memory and no-journal sessions retain their existing worker lifecycle.

## Subsystem inventory and largest costs

These rows overlap where stated: catalogue and state costs are already inside realm heaps.

| Contributor | Measured size/bound | Attribution and action |
|---|---:|---|
| L5 scene art/actors/derivatives |124.91MB nominal RGBA,246 textures | Independent source ledger; GPU/decoder overhead unmeasured. No new raster cache, display layer or texture in this patch. L4:79.75MB/129 textures. |
| Codec during9k open | about191-232MB sampled before; about216-217MB in later after opening samples | Transient validation/import/canonical JSON. First isolated pair232.48 ->215.95MB; repeat ranges overlap, so no peak-win claim. Opening cumulative allocation24.1% lower. |
| Main large-opening transient | about146MB sampled in controlled minute runs | Main recovery/publication plus RAM cache adapter; main current-state mirror retained for failure safety. |
| Engine startup/play transient | roughly135-167MB sampled across fixtures | State normalization/cloning/query/view work. Geometry-cache correction removes repeated validation; other normalization remains. |
| Complete runtime clinical catalogue |24.24MB isolated module+data heap delta per realm |1340 cases,1535 nodes,1039 concepts;38,652 objects,14,720 arrays,161,372 properties;8.79MB V8 serialized data. Resident in main+engine, temporarily codec. This is about48.5MB of duplicated catalogue/module heap across active realms. No clinical data edits. |
| Non-catalogue module/runtime and V8 overhead | remainder of roughly43.3MB main module baseline | Domain/balance/query/React/codec code; cannot attribute every native MB with Node heap sampling. Catalogue probe includes its own module/code overhead. |
| Published state, exact recovery prefix and queries/views | main roughly8-10MB above module baseline; engine roughly17-19MB | Includes structural sharing and state-dependent caches; not an additional serialized-state-size sum. Large fixture contains more evidence at open; after conversion/ack it is compacted as before. |
| Journal/recovery persisted representations |2.59MB current+prior seeds +135KB prepared candidate in L5 trace | Native IDB logical bytes, not client heap. Preserve both seeds and immutable operation for recovery. Live row tail bounded 512; queued rows 128. |
| UTF-8 processing scratch | one owned encoding per compression, previously three encoder calls | Size counting allocates no byte buffer; hash and compression share one checked encoding. Decode/hash verification remains. |
| Auxiliary/presentation caches | byte/count bounds below | Most are small/bounded already. Remove unchanged writes and hidden polls; do not discard clinical history or unsent receipts. |

Additional audited bounds:

- Navigation:16 geometry layouts; within each,32 graphs,256 blocked sets,4096 routes. Geometry/navigation definitions and query endpoints form keys; these are count bounds, not guaranteed byte budgets. Historical-layout accumulation is a remaining candidate for a separately measured phone byte cap.
- Settled-state/training/guidance caches are query-scope/WeakMap based; views and chart projections are weakly tied to live states. `OperationalSessionView` keeps one argument-matched supplied view per live state. No growing snapshot-history array was added.
- Codec verification caches:64 small byte proofs,2 hydrated projections; decoded immutable-text cache12MB in the codec realm, zero UI-thread text cache. Native phone codec already exits after5s idle and refuses pending work; unchanged.
- Character texture policy: reduced 8 MiB/32 unpinned textures (live/queued pins may exceed); normal 24 MiB/96. Bitmap weak cache has zero additional strong image bytes in the replay; old-Safari fallback is2MiB reduced/8MiB normal,256 entries, four concurrent decodes.142 generated room derivatives retain the existing <=2048px source-side limits; no new >4096 texture.
- UI presentation IDs retain128 recent plus live IDs; phone undo retains30 paired entries. Diagnostics persist<=3072 chars,16 events,16 lifecycle entries,20 errors. Entry timing stages cap 12. Active-operation maps delete entries in finally; listener/observer cleanups remain.
- Usage outbox64KiB,7days; pending hosted flags max 50 and byte/storage guards,7day pending age. Acknowledged flag history is bounded/aged separately. No unsent report/receipt is evicted by these changes.

## Allocation and repeated CPU work

V8 statistical allocation sampler includes collected objects; values are approximate cumulative allocated MB per real second, not heap growth. Same public L5 trace; active engine realm is stable. Main sampler/service-message overhead is small but included. Codec startup/checkpoint allocation is separate.

| Speed | Before main / engine MB/s | After main / engine MB/s | Engine reduction |
|---|---:|---:|---:|
| 1x | 1.63 / 46.08 | 1.66 / 37.68 | 18.2% |
| 4x | 4.80 / 151.20 | 4.93 / 112.50 | 25.6% |

The readable production-source profile located repeated `getCachedFacilityAccessValidation -> validateFacilityAccess -> getRoomBlockedTileKeys/physicalDoorKey.sort`, not a new render loop. Worker command guidance flags create fresh context wrappers; the former `WeakMap<DomainContext,...>` missed each tick. Keying by the shared facility definition reuses the validation while still checking actual rooms, doors, navigation metadata, dimensions and protected-room IDs. Mutable builder inputs still invalidate; returned arrays stay private. No reducer, service operation, progression or balance change.

Remaining large allocator stacks include `cloneTickState`, `normalizeEvidence`, repeated blocked-tile/threshold queries and operational state/view patch traversal. The pass does not claim their removal. A scratch build-helper assembly-root lifetime experiment produced no measurable catalogue heap saving and was excluded; scripts/vite files remain unchanged.

## Storage footprint and cadence

Instrumented first-minute L5 trace includes opening, an explicit checkpoint after tick4 and the normal day-end checkpoint at tick240. It is not a claim of recurring per-minute cloud uploads. Counts are native fake-IDB object-store requests and logical serialized argument bytes; physical flash writes/page compression are unmeasured.

| Operation | Before | After |
|---|---:|---:|
| Journal rows put |240 |240 |
| Head puts |55 |55 |
| Row-delete requests |245 |2 inclusive ranges |
| Snapshot puts / prepared puts |3 /2 |3 /2 |
| All journal mutation requests |547 |304 |
| Journal transactions, including reads/audit |79 |79 |
| Journal put payload |10,337,485B |10,337,473B |
| Cache commits / logical payload |7 /1,408,597B |7 /1,408,577B |
| All counted mutations |554 |311 |
| Healthy phone diagnostic heartbeat |12/min, up to72KiB UTF-16/min |1/min, up to6KiB/min |
| Repeated identical auxiliary write,60 calls |60 writes/scans |0 writes/scans after existing durable value |

Tiny candidate-byte differences are opaque writer/operation metadata. State bytes and row payloads match under equal checkpoint boundaries. Range deletion uses the existing atomic transaction and exact campaign/version bounds; no DB version, format, commit interval or acknowledgement changes. Fallback without IDBKeyRange retains individual deletion. The9,000-row test preserves the suffix/neighbor campaign and proves transaction abort restores rows.

Existing local commit deadlines stay250ms for player actions /1000ms for ticks. Native prepared candidates already have a 60 s cooldown; no full snapshot encode was occurring on every command. Snapshot tail remains512, recovery/compaction 5 min, cloud 5 min/leave/Save&Close/day-end policy unchanged. `prepareRecoveryCopy` is an explicit campaign-switch/support boundary, not a periodic save loop. Usage emits30s intervals and uploads under the existing5min heartbeat/budgets. Flags retry/status refresh already have request budgets and skip unchanged dispositions. The new unchanged-value auxiliary guard rereads storage each call, so external-tab changes/eviction still cause a write; there is no stale in-memory durable assumption.

## Timers, observers, paused/hidden/menu behavior

Source audit: `.local-dev/phone-memory-20261112/timer-listener-inventory.json`. Counts below are binding-level fake-clock measurements plus audited maximum call sites, not a browser-wide timer enumeration. Cloud/local journal polling are alternatives.

| Work | Visible playing | Visible paused | Hidden / bfcache |
|---|---|---|---|
| Core optional/foreground polls (usage, cloud-or-local, render watchdog, diagnostics, flags, competition) | up to6 intervals | same lightweight cadences | before up to6; after0 |
| Optional tutorial position poll |600ms while shown |600ms while shown | removed while hidden; mutation callback does not schedule rAF |
| Facility simulation primary interval |1/2/4Hz subject to existing admission |0 |0 |
| Existing facility recovery watchdog |1s |1s |1s retained intentionally |
| Phone Phaser frame policy |30fps active |1fps settled idle, short input burst |0 frames when hidden/covered |
| Operational worker |1 active realm | before1; after0 following safe 30 s idle |0 after existing leave checkpoint/durability settles |
| Codec worker |0 when idle;1 for work | exits5s after last task | release only after accepted tasks settle |
| Save/network retry and task deadlines | only while work/recovery needs them | same safety requirement | essential accepted work not cancelled |

The existing one-second clock watchdog resumes the cancelled foreground intervals if Safari updates visibility without sending an event. This adds no extra hidden poll. Fake-clock tests prove one essential watchdog remains, foreground poll resumes once, no catch-up tick, all timers/listeners clean up. Six core polls imply194/min visible callbacks before vs183/min after; hidden optional callbacks fall to0, with the existing60/min watchdog retained. Menus do not silently pause simulation: covered map frames stop as before, and an actually paused session can release its worker. Domain pause, lease checks, explicit pagehide flushes, consent accounting and save safety take precedence over stopping necessary retries.

## Implementation, safety and correctness

1. Park only reduced-memory, journal-backed engines after an ordered durable prefix. Await worker idle, require zero pending/queued requests, keep the exact recovery checkpoint/head, dispose the native realm. Next command initializes from that prefix before application. Failed durability refuses release. Detach cancels the idle timer. No operation ID is invented or replayed by parking.
2. Delete covered journal prefixes with one inclusive IDB range in the same existing transaction. Keep current/prior seeds, prepared candidate, immutable operation and live suffix.
3. Stop nonessential hidden polls; resume through lifecycle events and the existing iOS watchdog. Keep mandatory retries/flushes. Healthy narrow-viewport diagnostics use60s; errors/exit persistence remains immediate.
4. Skip already-durable identical auxiliary values and all quota-inventory work for those values. Tests cover another tab changing/removing the value.
5. Count UTF-8 without allocating, reuse one checked encode for hash/compression, reuse parser constants and skip decimal scratch only when the token already equals JSON.stringify(parsed). Alternate spellings, unsafe numbers, duplicate keys, Unicode, limits and decompression checks retain their rules. All UTF-16 code units and malformed surrogate boundaries compare to native TextEncoder.
6. Facility access cache keys the actual facility definition rather than transient guidance-flag contexts; actual geometry/definition/bounds/protection checks remain. Tests compare fresh validation after in-place mutations and across 20 flag wrappers.

Strict raw-state SHA matches L4/L5 minute pairs and all1x/4x pairs. L5 hash `372b73356be8614379f73a4ece7aa04efc7105569f0e0fd5da4aa12ea913fff7` at 4x;1x `9ddb3382bc78cf9f4d84f0f2e24124cd4a6c1cd528c413246a9843ef566b7fb9`. The9k controlled trace matches `97db8e57187566a2bfe97cefd5145d10ce139904c9d8ee9dc8c98854ba8f14f5`.

An ungated QA auto-resume immediately after day-end initially produced different property order, solely in `radiologistReadIncome`, with equal values. The old path itself changes order with checkpoint/compaction timing. The controlled large trace waits for the existing day-end checkpoint to settle before scripted Resume; no gameplay command is dropped or altered, no production path/test was weakened. This pre-existing enumeration-order sensitivity is recorded as a remaining risk; all synchronous every-command comparisons remain exact.

## Level5 pins and bound inputs - no rebind

The historical artifact remains byte-identical: `tools/qa/level-five-integration-results-20261012.json`, SHA256 `dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5`, stored tuple **26,362 /6,056,335 cents /410 completions /0 walkouts**. No fixture, pin, clinical data, balance or progression file was rewritten.

Fresh captured-1340-case-epoch journey CHECK is **not green against those historical pins**: **31,511 /6,524,517 /492 /0**, different inspection reports/checkpoints. Crucially **all 31,582 compared command states are byte-exact against the captured pre-edit reference**, including the old cache helper. Thus this lane changes no gameplay result for the same inputs. The captured 1340-case inputs already differ from the historical bound epoch; do not call these new results a rebind or silently accept them as canonical. Manager must resolve existing binding debt separately.

`pin-audit.json` lists 409 bindings, 43 current mismatches:42 outside this lane and one owned helper. Owned source change: `packages/game-domain/src/facility-access-cache.ts`, entry `e10fa45bb74d16882972daffef87836c0abffe5e5eb68fbccd9f367d2aeebc61` -> `40f186ccb7db3122da83550b882f7e4f161592ae697fdaa4474b4c750aa5a0cd`. The exact every-command reference comparison supplies behavior evidence, not permission to rebind. See `journey/result.json`, input/reference ledgers and the unchanged pin artifact.

## Validation - final exact output

PowerShell, npm.cmd, CI=true, --pool=threads. `offline-local.cjs` blocks Vite's optional Windows net-use probe; no gameplay/test assertion is replaced.

Focused player/performance/differential (`focused-final.log`):

```text
Test Files  12 passed (12)
     Tests  58 passed (58)
  Duration  71.45s
```

Focused domain cache + tick differential (`domain-differential-focused.log`):

```text
Test Files  2 passed (2)
     Tests  4 passed (4)
  Duration  23.33s
```

Full player, final cache source (`player-full-cache-final.log`):

```text
Test Files  443 passed (443)
     Tests  5315 passed (5315)
  Duration  790.54s
```

Full domain (`domain-full-final.log`, exit1):

```text
Test Files  2 failed | 217 passed (219)
     Tests  27 failed | 5882 passed | 1 skipped (5910)
  Duration  460.31s
```

All27 failures predate this patch:1 approved-clinical-admission boundary,1 historical input-binding assertion,25 legacy load/hash scenarios in `level-five-integration.test.ts`. Initial full domain before runtime changes:2failed/216passed files;27failed/5880passed/1skipped tests,382.69s. Read-only captured-entry rerun of the two failing files: **2failed;27failed/16passed (43),116.77s** (`domain-entry-control.log`). No progression/content expectations were edited. Historical player baseline failures do not reproduce in this source epoch; this lane did not change those expectations. An intermediate full player started during editing loaded an old storage helper for a new test; fresh focused and both complete final player runs pass. Initial test-only type errors were fixed and the final build's typechecks pass.

Root `npm.cmd run build` (`build-validated.log`, exit0) runs all **seven workspace typechecks**, then player production build:

```text
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
[seven workspace typechecks passed]
transforming... 681 modules transformed.
built in 13.13s
```

The seven workspaces are clinical-context-workbench (client+server), player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain; each exits0. Standalone `npm.cmd run typecheck` also passed seven workspaces; final root build repeats them after the helper/test changes. Standalone `npm.cmd run test:boundaries` passed the same checks. **No-Git limitation:** `boundary-inventory-adapter.cjs` supplies the existing Nov10 captured path inventory for the verifier's Git-only tracked-prefix query; dependency/source/launcher checks scan current files. This is not fresh tracked-file enumeration. Manager should rerun the stock check in its environment. Existing ineffective dynamic-import and chunk/plugin warnings remain; no browser was run.

Production ten-hour worker/view budget (`runtime-budget.log`),600 ticks each L4/L5:

```text
PASS: public Level4/5 production worker/view heap, allocation and transport budgets
```

L4 final main/worker98.29/74.02MB, largest reply553,816B; L5 96.00/80.82MB,541,171B. This separate harness includes Vite/build controls and fixture retention; use it as a regression ceiling, not the isolated phone realm baseline. CI allowance1.5; original heap/allocation/transport/tail ceilings unchanged.

Art replay (`art-l4.log`, `art-l5.log`) passes existing readiness/texture/zero-pan-rebuild budgets. L4 first room 1.050 s, settled 2.567 s,79.75MB; L5 1.128s/4.933s,124.91MB. Timing is deterministic I/O replay, not measured browser decode latency.

Journey CHECK (`journey.log`) finishes31,582 exact comparisons, then **exit1** on the old26,362-command pin assertion. Result/pin status is described above; no mismatch receipt was generated and no evidence artifact was rewritten.

## Files and port discipline

27 source/test paths:17 edited,10 new. SHA256s and normalized scoped patch: `.local-dev/phone-memory-20261112/source-manifest.json` and `runtime-normalized.patch`. Port only these hunks/new files plus this ExecPlan and the new current-handoff block. Preserve concurrent clinical/question-topic/flag and checkpoint changes; do not import them from this working tree.

- `apps/player/src/competition/useCompetition.tsx` (edited)
- `apps/player/src/diagnostics/problemDiagnostics.ts` (edited)
- `apps/player/src/facility/FacilityCanvas.tsx` (edited)
- `apps/player/src/mobile/performance/backgroundClock.test.ts` (new)
- `apps/player/src/mobile/performance/idleWorkerRelease.ts` (new)
- `apps/player/src/mobile/performance/phoneBackgroundBudget.test.ts` (new)
- `apps/player/src/mobile/performance/visibleInterval.test.ts` (new)
- `apps/player/src/mobile/performance/visibleInterval.ts` (new)
- `apps/player/src/playtime/browserUsage.ts` (edited)
- `apps/player/src/session/QuestionFlagProvider.tsx` (edited)
- `apps/player/src/session/cloud/codecAllocation.test.ts` (new)
- `apps/player/src/session/cloud/codecCompression.ts` (edited)
- `apps/player/src/session/cloud/codecJson.ts` (edited)
- `apps/player/src/session/cloud/gameSession.ts` (edited)
- `apps/player/src/session/cloud/operationalEngineClient.ts` (edited)
- `apps/player/src/session/cloud/operationalIdle.test.ts` (new)
- `apps/player/src/session/cloud/operationalSessionEngine.ts` (edited)
- `apps/player/src/session/facilityClock.ts` (edited)
- `apps/player/src/session/journalRangeDelete.test.ts` (new)
- `apps/player/src/session/journalRangeDelete.ts` (new)
- `apps/player/src/session/localJournal.ts` (edited)
- `apps/player/src/session/storagePressure.test.ts` (edited)
- `apps/player/src/session/storagePressure.ts` (edited)
- `apps/player/src/session/usePrototypeSession.ts` (edited)
- `apps/player/src/ui/TutorialCoach.tsx` (edited)
- `packages/game-domain/src/facility-access-cache.ts` (edited)
- `packages/game-domain/src/facilityAccessCacheContext.test.ts` (new)

## Progress, remaining risks and next action

Completed inventory, safe runtime/cache/storage fixes, controlled production measurements, focused/full validation and handoff. No active product edits remain in this bounded worker milestone. A parked worker reports the existing synchronous engine mode; the bounded `worker-idle-released` diagnostic distinguishes intentional release. The controller still uses its asynchronous operational boundary. Local work only, no commit/push/deploy/backup claim.

Manager acceptance still needs:

- Physical iPhone production L4/L5 open, first save,1x/4x sustained play, paused>30s, hidden/pagehide, resume and memory-pressure/context-loss. Record aggregate WebKit main/worker/native/GPU peaks and heat/FPS over a long session. Do not infer actual jetsam recovery from Node results.
- Browser set: `cloud-saves.spec.ts`, `cloud-recovery.spec.ts`, `map-pan-zoom-performance.spec.ts`, `map-pan-zoom-phone-memory.spec.ts`, `ui-density.spec.ts`, `patient-chart-density.spec.ts`, `character-resolution-zoom.spec.ts`, `build-mode-usability.spec.ts`, `splitter-map-shade.spec.ts` (phone-chrome and desktop-chrome). Include worker failure/restart, denied/quota/slow IDB, fencing, offline reload, quick scored answer -> background, Save&Close/day-end -> reload; confirm exact durable prefix, no duplicate/missing command and operation-ID replay.
- Phone map/density/art/picking checks: retained camera, no pan rebuild, art readiness, normal zoom, Build ghost/labels/popups and splitter shade. Check return from Safari suspension with/without lifecycle events; cold worker restart may briefly delay command completion while UI stays responsive.
- Fresh stock boundaries inventory. Resolve27 existing domain failures/historical pin binding debt without this worker rebinding anything.
- Further work is needed to remove duplicate active catalogue/state, reduce remaining normalization/geometry allocations and impose measured byte budgets on historical navigation caches. This patch does not meet30% active retained-heap or50% physical-write targets. No save-safety concession was made to manufacture those numbers.

## Round 2 - active catalogue ownership and journal payload

Manager accepted Round 1 as a partial win and authorized one catalogue owner, bounded slices/indexes in other realms and a compressed local journal representation. **Measured targets met in the matched active L5 runtime trace: heap112.62 ->77.69MB (-31.0%); journal put payload10.337 ->2.202MB (-78.7%); all counted IDB/cache put payload11.746 ->3.611MB (-69.3%).** These are production Node realm/payload measurements, not physical iPhone RAM or SQLite writes. Browser/physical-phone acceptance remains with the manager.

Completed milestones: attribute case reads and journal bytes; implement bounded catalogue ownership and lossless local storage; run matched public fixtures, long production/differential checks, full player/domain, seven typechecks and boundaries; inspect scoped changes and prepare handoff. No real saves/browser storage, Git, network, installs, agents or deploy. Round2 adds no domain, balance, clinical-content, progression, checkpoint or pin edits. Preserve every other lane's work.

### Evidence and method

Captured1819 source paths at entry: `.local-dev/phone-memory-20261112/round2/entry.json` and `entry/`. Compile the captured and final runtime sources against the **same captured1340-case clinical/domain/balance epoch**. This avoids folding concurrent content/timing changes into the memory comparison. Public late-L4/L5 fixtures are the same Day20 variants used in Round1; run240 ticks at4x, spaced250ms (one real minute), with the same purchase checkpoint at4 and day-end boundary. Keep engine alive and collect post-GC after codec's existing5s idle shutdown; this is active runtime, not Round1's parked-worker result. A separate public8962-record opening exercises four ticks with explicit resume/day-end settlement barriers; it is not a minute-long play trace.

Each client realm is a native Node worker/bundle. Fake backend and fake IndexedDB service are separate and excluded, as browser backend/IDB storage are not player JS objects. The latter also owns IDB decode scratch in this harness, so it is not a complete browser recovery-peak estimate. Runtime totals exclude Vite/compiler, test reference realm, DOM/React/Phaser/GPU/native image memory. The standalone regression runner was separated from Vite's retained build graph; its former190MB false failures counted compiler/plugin data that the production page never imports. Existing allocation/transport/tail limits were retained and runtime heap limits tightened.

Final receipts: `matched-{l4,l5,large}-r2-before-memory.json` and **`closure-{l4,l5,large}-memory.json`**. `round2/final-summary.json` collects them. Earlier `pooled-*` repeats showed L5 77.76MB (-30.96%); the final source repeat is77.69MB (-31.02%). Both pass the target. Do not use intermediate/stale or failed bundles. MB here means decimal bytes/1,000,000.

### Active heap and opening/checkpoint measurements

| Public trace, after codec idle | Before main /engine MB | After main /engine MB | Combined before ->after MB | Change |
|---|---:|---:|---:|---:|
| L5 Day20,240ticks at4x |51.70 /60.92 |34.10 /43.58 |112.62 ->77.69 |-31.0% |
| L4 Day20,240ticks at4x |51.87 /58.31 |34.26 /41.07 |110.18 ->75.33 |-31.6% |
|8962-record public opening,4ticks |52.52 /58.66 |34.93 /41.16 |111.18 ->76.09 |-31.6% |

| L5 stage, retained post-GC MB | Before main /engine /codec | After main /engine /codec |
|---|---:|---:|
| Modules loaded |43.34 /-- /-- |25.73 /-- /-- |
| Verified cloud open |43.84 /-- /46.83 |26.22 /-- /31.72 |
| Playable open |48.53 /51.68 /-- |30.91 /33.30 /-- |
| First checkpoint |56.05 /55.53 /51.16 |38.43 /38.19 /36.06 |
| Active minute, codec idle |51.70 /60.92 /-- |34.10 /43.58 /-- |

Observed L5 per-realm JS heap peaks: main118.04 ->61.12MB, engine135.03 ->118.66MB, codec155.74 ->154.41MB. Peaks are sampled5ms/callback observations, **not additive simultaneous peaks**; forced-GC timing affects them. The prior after repeat's codec peak was131.18MB, so no strong codec-peak improvement is claimed. Public9k codec peak216.37 ->220.33MB (another repeat222.70MB): **deep opening scratch remains a risk, not a peak-memory win**. Steady state is lower in every matched trace. Native WebKit jetsam/heat and total process RAM are unproven.

L5 main+engine external accounting after codec idle42.25 ->about13.06MB; do not add `arrayBuffers` again (it overlaps external). The engine's immutable native Blob is3,422,229B for the frozen1340-case bank. Node external/Blob accounting does not predict WebKit physical residency. Renderer/texture policies are unchanged in Round2; the existing L5 nominal art budget remains124.91MB.

### Catalogue: one owner, compact consumers

The old full clinical graph was built/parsed in main, engine and temporary codec realms (Round1 retained-catalogue attribution about24MB each). Production now emits a content-addressed immutable index and native compressed binary bank from the **same validated public authoring/manifest pipeline**. No clinical value, identity, concept, manifest gate, profile, selection rule or text is changed.

- Main/UI and normal codec work keep a compact selection/concept/timing index. UI text comes from the exact cases already frozen in encounters/view replies; opening a chart does not load the complete live bank into main.
- Engine fetches the bank once before initialization and owns its Blob. Per-case gzip graph slices are read locally from that Blob during play, verified for SHA256/decoded byte limits and parsed only as needed. No gameplay clinical-source/network retrieval is introduced. Compressed compatibility chunks in that same bank preserve full-graph aliases for legacy/fallback readers.
- At most16 decoded templates remain between requests. A request pins all templates it needs until publication, then trims to16; a40-template synthetic request verifies forward progress without eviction thrash. Frozen encounters/FSRS data remain independent, unchanged state data.
- Deferred fields are fail-closed accessors in authored key order (including undefined). If a command/evidence/diff/projection needs a missing case, it retries the same **unpublished** processor prefix and operation ID after loading that slice. No version/head/state is committed before all stages succeed. Long replay proves entire reply/state equality.
- Pool identical adult eligibility service-request metadata **within one case**; authored choice IDs/labels/answers/rationales remain deferred owner-specific fields. Pediatric IDs/labels stay available for current eligibility. Any attempt to freeze/export incomplete metadata trips exact case hydration. All public cases hydrate byte-exactly.
- Synchronous local bypass, legacy import and worker-failure fallback explicitly load the full compatibility graph. Successful bundled-engine recovery releases main's full graph/bank and restores the compact index. A transient asset error is classified as worker unavailable/retry rather than save corruption; boot asset failure shows a user-triggered Reload action without writing a save or automatically reloading.

The index's parsed-graph scratch is inside a completed async function, avoiding top-level-await module-slot retention. Build target is ES2022 with ES-module workers; Safari/Pages cold-load and fallback acceptance is still required. No shared-memory/cross-origin-isolation requirement is added.

### Storage attribution and reduction

Instrument actual `IDBObjectStore.put` arguments as UTF-8 JSON-equivalent bytes. This counts payload submitted to IndexedDB, not physical B-tree pages, compression or filesystem write amplification. Cache counts include the same7 writes as before. Delete requests/transactions are not reduced in Round2; Round1 range deletion remains.

| L5 first minute contribution | Before B | After B |
|---|---:|---:|
|240 row puts |6,225,381 |1,071,140 |
|3 checkpoint seed puts |3,833,030 |851,972 |
|2 prepared-candidate puts |261,877 |261,865 |
|Head puts |16,889 |17,202 |
|**All journal put payload** |**10,337,177** |**2,202,179** |
|Existing cache put payload (7 writes) |1,408,609 |1,408,565 |
|**All counted put payload** |**11,745,786** |**3,610,744** |

Rows originally contain incremental evidence/state patches, not a full clinical catalogue per row. Their delta field is6,111,969B of the6,225,381B row payload. Root patch groups include serviceOperations2,799,756B, retailOperations878,448B, events558,515B, external actors368,787B and encounters314,250B. Seeds contribute another3.83MB. Repeated operational structures/field names dominate; retaining current deltas and compressing their exact JSON is safer than inventing a new domain delta format.

| Trace | Journal put B before ->after | All counted put B before ->after |
|---|---:|---:|
|L5 minute |10,337,177 ->2,202,179 (-78.7%) |11,745,786 ->3,610,744 (-69.3%) |
|L4 minute |8,117,626 ->1,891,168 (-76.7%) |9,487,316 ->3,260,858 (-65.6%) |
|Public9k opening,4ticks |10,490,244 ->8,599,852 (-18.0%) |31,862,707 ->29,972,303 (-5.9%) |

The oversized9k compatibility seed safely retains the old plain path beyond compression limits, and its21.37MB cache traffic is unchanged. The50% target is met for normal active L4/L5 minute traces, **not this oversized opening**. L5 retained snapshots put footprint falls2,590,410 ->577,817B. Timing changes produce49 vs50 append calls/54 vs55 head puts; first-dirty deadlines/policies are identical. No save-cadence or physical-write claim is made.

### Save safety and recovery

Local rows/seed bodies use tagged `gzip-json-v1` only when smaller; unsupported/failed compression writes the original plain value. Plain predecessors and mixed generations remain readable. Logical JSON order/checksums, DB version2, manifest schema1, cloud format3, keys, current/prior seeds and immutable operations retain their meaning. Cloud candidate/upload/fencing code is untouched. **Older app builds cannot read this new local dialect**; a dialect-aware reader is needed before rollback. Manager must include rollback/recovery compatibility in release review; cloud format is unchanged. The current reader fails closed on unsupported/corrupt tags without deleting their bytes.

Engine hashing prepares storage-ready rows; codec preparation packs seeds before storage. Main does not reserialize/compress full game state per tick. Weak-key row preparation is released with the bounded pending queue. Journal append still completes the strict row+head transaction before localDurable/ack; generation/high-water guards and operation-ID replay are unchanged. Queue128, bounded tail512, player250ms/tick1000ms commit deadlines, native preparation60s and5-minute/leave/Save&Close/day-end checkpoints remain.

Read raw IDB rows atomically, close the readonly transaction, then decode. Lost-ack retry compares the exact decoded logical rows and opens a second readonly transaction to recheck owner/high-water **and captured stored bytes** before acknowledging. A new test fences the writer while decode is blocked; the old retry rejects and the replacement seed stays exact. Corruption/unknown tag/hash/oversized body, mixed plain rows, transaction abort, slow storage and generation races are tested. Pre-hint native reclamation verifies the decoded seed outside deletion, then rechecks its owner/prefix/digest in the transaction.

Final resource guard: a64-row recovery previously started64 decoders at once (`recovery-concurrency-before.log`, regression red); recovery now decodes sequentially **after** the read transaction. `read` and `changes` peak at one decoder, preserve exact row order and release all scratch after errors. No durability/ack order depends on decompression concurrency.

### Byte-exact correctness, pins and bindings

Final matched raw-state SHA256s before/after:

- L5: `372b73356be8614379f73a4ece7aa04efc7105569f0e0fd5da4aa12ea913fff7`.
- L4: `896262360c4eb4937c86f3dbc2877e1d18cc4dfdb4906ba5ed437d4c7cf033f6`.
- Public9k: `51a5058df90db44dfec5d763186431f76aadc491b249394918f9d240db96ea98`.

Production L4/L5 ten-hour lazy-vs-full controls each compare604 ordered replies exactly (state/snapshot/evidence/view patches, excluding timings only). Final pooled catalogue Level5 full journey **31,582 entire replies/materialized states match the captured pre-Round2 worker byte-for-byte**, including11 fixture forks/reseeds and512-command compaction. Maximum templates16, mismatches0; `round2/journey-v2/paired-replay.json` (1431.52s). Separate raw-domain captured-source CHECK also completes31,582 exact command comparisons, then exits1 on historical pins. The final recovery-only change bounds read/changes decompression scratch; it does not change the command implementation and is covered by the subsequent full-player closure.

**Do not call the direct raw-reducer/operational-engine comparison green.** Both the captured pre-Round2 and new engine first differ from the independent raw trace at command1065 in `alertHumor.guidanceTips.eligibleSince` key order;29,252 downstream raw trace hashes consequently differ. Pre/post worker replies and states remain exact at every command. Public diagnostic snapshots prove the first boundary difference; no domain code/test was changed to hide it. This is pre-existing checkpoint/evidence enumeration-order debt, separate from catalogue equivalence.

Historical artifact remains SHA256 `dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5`, tuple **26,362 /6,056,335 cents /410 completions /0 walkouts**. The captured1340-case epoch already produces **31,511 /6,524,517 /492 /0**, as Round1; reports/checkpoints do not bind to the older artifact. **No rebind.** Round2's28 owned paths intersect the409 bound inputs zero times. `round2/pin-audit.json` lists43 existing canonical mismatches; foreign files changed since entry are clinical-content `answer-choice-timing.ts`, `index.ts`, `synthetic-content.ts`, and domain `test-choice-orders.ts`. Preserve them; do not port them as this lane's work. R1's facility-access helper is unchanged during Round2.

### Validation - final closure

PowerShell, npm.cmd, CI=true, --pool=threads. No browser or real storage used. `offline-local.cjs` only blocks Vite's optional Windows network-drive probe.

Focused catalogue/journal/engine/safety, final decoder bound (`round2/focused-closure.log`, exit0):

```text
 Test Files  8 passed (8)
      Tests  61 passed (61)
   Duration  14.75s
```

Legacy import/codec focused check (`round2/legacy-focused-final.log`, exit0):8files/133tests,65.61s. Includes exact old/new catalogue hydration and transient bank-failure handling; final full suite covers these again.

Full player (`round2/player-closure.log`, exit0), `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads`:

```text
 Test Files  447 passed (447)
      Tests  5409 passed (5409)
   Duration  756.48s
```

Root `npm.cmd run build` (`round2/build-closure.log`, exit0), including `test:boundaries`, `typecheck` and player build:

```text
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
[seven workspace typechecks passed]
transforming... 684 modules transformed.
built in 7.94s
```

Seven workspaces: clinical-context-workbench (both client/server), player, balance-config, clinical-authoring, clinical-content, clinical-research, game-domain. Existing ineffective-dynamic-import, chunk-size and plugin-time warnings remain. **No-Git limitation:** `boundary-inventory-adapter.cjs` supplies the Nov10 captured path inventory only for the verifier's Git-only ls-files query; dependency/source/launcher scans inspect current files. This is not fresh tracked-file enumeration; manager must rerun stock boundaries. No gameplay/test assertion is replaced by the adapter.

Full domain (`round2/domain-full.log`, exit1):

```text
 Test Files  2 failed | 217 passed (219)
      Tests  27 failed | 5964 passed | 1 skipped (5992)
   Duration  536.22s
```

All27 named failures exactly match the captured-entry control:1 approved-clinical-admission assertion,1 historical input-binding assertion and25 legacy load/hash cases. Control:2failed files,27failed/16passed tests,116.77s (`domain-entry-control.log`). Round2 introduces no raw-domain dependency change. No expectation/pin was relaxed. Earlier full player447files/5408tests also passed785.11s; final closure includes the additional decoder resource test. Initial own reply-shape/test-type failures were fixed, not counted as baseline failures.

Production ten-hour runtime budget (`round2/runtime-budget-complete.log`, exit0):

```text
PASS: public Level4/5 production worker/view heap, allocation and transport budgets
```

600 advanced ticks per level. Final main/engine L4 46.95/57.06MB; L5 44.76/63.96MB. Non-CI caps60MiB/70MiB, existing CI allowance1.5; all observed values also fit non-CI caps. Per-command sampled allocation L4 main0.782MB/engine21.25MB; L5 0.813/24.29MB. Largest replies552,877/541,171B; same transport768k/tail24MiB/allocation ceilings. Bank3,577,982B for the current shared-tree build, below4.5MB ceiling; templates8/9, indexed=true. This separate regression fixture/run is not the paced Day20 trace. The captured bank used for matched comparisons is3,422,229B. Remaining per-tick allocation is material; do not infer thermal stability.

Art replay still passes existing readiness/texture/zero-pan-rebuild limits: L4 first-room1.050s, settled2.567s,79.75MB; L5 1.128s/4.933s,124.91MB (`round2/art-l4.log`, `art-l5.log`). Deterministic I/O replay, not measured browser latency. No scene/rendering changes in Round2. Matched final L5 main+view mean0.934ms/p95 1.980ms; L4 0.985/1.913ms on this harness (renderer excluded).

### Scoped files, handoff and remaining acceptance

**28 source/test/QA paths:21 edited,7 new**, plus this plan and the new current-handoff block. `.local-dev/phone-memory-20261112/round2/source-manifest.json` lists every SHA256/disposition; `runtime-normalized.patch` contains only owned normalized hunks/new files. The1819 captured-entry preimages were preserved. The two pre-existing `scripts/qa` preimages were reconstructed from the exact edits (marked in the manifest), not independently captured; inspect their hunks rather than asserting a captured raw-file SHA.

- New: `apps/player/src/mobile/performance/runtimeCatalogue.ts`, `runtimeCaseBank.ts`, `runtimeCaseSlices.test.ts`; `apps/player/src/session/journalEncoding.ts`, `journalEncoding.test.ts`; `scripts/qa/runtime-asset-fetch.mjs`, `phone-runtime-budget-run.mjs`.
- Edited: player `vite.config.ts`, `src/main.tsx`, `runtimeClinicalData.test.ts`, `session/localJournal.ts`; cloud `codec.ts`, `codecEvidence.ts`, `codecTasks.ts`, `importCampaigns.ts`, `journalCodec.ts`, `gameSession.ts`, `operationalEngine.worker.ts`, `operationalEngineClient.ts`, `operationalEngineProtocol.ts`, `operationalEngineProcessor.ts`, `operationalEngineDispatch.ts`, its test and `operationalSessionEngine.ts`; build helpers `scripts/vite/runtime-clinical-data.ts`, `runtime-clinical-graph.ts`; QA `phone-runtime-budget.mjs`, `phone-art-loading.mjs`.

`App.tsx`, `automaticResolution.ts` and `openingUploadLarge.test.ts` remain raw-SHA identical to Round2 entry. No domain/content/balance/renderer modifications in this round. Port only this lane's hunks/new files and Round2 docs; preserve concurrent lane edits. Local work only; no commit/push/deploy/backup claim.

Manager acceptance checks:

1. Physical iPhone/home-screen production L4/L5: main+engine+codec/native/GPU aggregate peaks, first checkpoint,1x/4x play, long session heat/FPS and visible/hidden/paused restart. Native/DOM/GPU/decoded-image memory is unmeasured and unchanged here;9k recovery scratch remains large.
2. Cold/cache-warm Pages base path, ES-module/TLA startup, offline reload, missing/corrupt index/bank, slow asset fetch vs worker startup budget, worker crash -> synchronous fallback -> automatic recovery. Confirm bank download completes before play, no incomplete template freezes, memory is released after recovery. Compression requires APIs already used by cloud saves; unsupported encode safely stays plain.
3. Browser cloud-saves/cloud-recovery plus map-pan-zoom-performance, map-pan-zoom-phone-memory, ui-density, patient-chart-density, character-resolution-zoom, build-mode-usability and splitter-map-shade, phone-chrome and desktop-chrome. Include quick scored answer -> background, Save&Close/day-end -> reload, denied/quota/slow IDB, fencing and duplicate operation replay. Confirm exact durable prefix/FSRS/frozen encounters. Older-build rollback of the new local dialect needs explicit release review.
4. Stock boundary inventory and resolution of pre-existing27 domain failures/historical binding debt/raw-v-operational key order, without rebinding this lane. Keep current main state mirror for safe fallback; no claim of a single full campaign state yet. Allocation/churn, deep legacy opening peaks and unchanged GPU texture memory remain future work.

Round2 bounded implementation and Node validation are complete. Next action is manager browser/physical-phone acceptance and scoped port review; no further product edits are planned here.

## Round 3: rollout gate

Manager accepted Round2 and requires the standard reader-first rollout. Ship a single explicit `LOCAL_STORAGE_COMPRESSION_WRITES` build constant defaulting to false; keep the plain/compressed/mixed reader always active, and enforce plain writes even for prepacked worker/cache values. The later release may enable the constant after its rollback floor includes this reader. Preserve catalogue ownership, noncompression payload trimming, timers, save deadlines, durability, fences, frozen encounters and FSRS. Same lane, public fixtures only, no Git/network/real saves/agents/install/deploy.

Milestones: implement gate and both-mode storage/dispatch tests; measure the same first-minute L5 trace with writes off versus on; focused/full player+domain threads, seven workspace types, boundaries/build and perf/differential checks; record exact output and scoped handoff. Entry capture: `.local-dev/phone-memory-20261112/round3/entry.json` (30 Round2 source/doc paths, zero source drift). Current status: implementation, matched measurements and validation complete; exact results follow.

### Round 3 result and rollout contract

Implemented the manager's two-step rollout with **one checked-in build constant**, `LOCAL_STORAGE_COMPRESSION_WRITES = false` in `apps/player/src/session/localStorageBuildPolicy.ts`. There is no runtime/storage/UI toggle. All realms import the same module. The default-value test deliberately protects the reader-first release.

1. **Next release: false.** Ship the always-on dialect-aware reader; new local journal rows and seed bodies are plain. Both old plain and existing compressed/mixed generations are readable. Reading does not migrate/delete/rewrite existing bytes. The gate is enforced in `bind`, `append` and `compact` as well as the encoder, so worker-prepared/weak-cached compressed values cannot bypass it.
2. **Later release: true.** Change that one constant only after the rollback floor includes the dialect-aware release. The Round2 compression policy then applies (smaller payloads only; plain fallback if unsupported/failing). Rollback to this reader release or a later compatible reader can recover tagged data. Readerless builds still cannot read pre-existing compressed local records; the flag is not a retroactive converter.

Cloud snapshot format3 and its pre-existing compression, local DB version2/schema1, checksums, strict durability-before-ack, fencing, operation ordering/idempotency, current/prior seeds, frozen encounters and FSRS remain unchanged. Queue/tail limits, commit deadlines and5-minute/leave/Save&Close/day-end policy are unchanged. Off-mode engine journal hashing returns hashes without an extra full plain-row reply; the delta-version shortcut and incremental main state/view replies remain active. Off-mode main append reuses prepared hashes rather than adding compression or serialization work to the ordinary commit path.

All other Round1/2 changes remain: native engine-owned case bank and compact consumers, bounded16-template cache, native codec idle exit, background/paused policies, range deletion, unchanged auxiliary-write elision and payload trimming. No domain, balance, content, renderer, schema or checkpoint input changed in Round3.

### Matched first-minute payload, writes off versus on

Same frozen public1340-case L5 Day20 fixture, production bundles,240ticks at4x, same purchase/day-end checkpoints, same Node/headless method as Round2. On-mode is an in-memory transform of the **one constant** for the private measurement build; the checked-in source stayed false. Source: `round3/build-harness.mjs`; receipts `round3-off-l5-memory.json`, `round3-on-l5-memory.json`, `round3/measurements.json` under `.local-dev/phone-memory-20261112/`.

| L5 first minute | Writes off (next release) | Writes on (later release) |
|---|---:|---:|
|240 journal row puts |6,225,381B |1,071,128B |
|3 checkpoint seed puts |3,833,022B |851,972B |
|54 head puts |16,889B |16,889B |
|2 prepared-candidate puts |261,869B |261,873B |
|**Journal put payload** |**10,337,161B** |**2,201,862B** |
|7 existing cache puts |1,408,577B |1,408,597B |
|**All counted put payload** |**11,745,738B** |**3,610,459B** |
|Journal transactions (reads/audit included) |78 |78 |
|Active main+engine post-GC, codec idle |77.33MB |77.68MB |

**The79% journal-byte reduction depends on compression.** Writes off is essentially the original10,337,177B journal/11,745,786B cache-included baseline; the16/48B differences are opaque metadata, not a material payload reduction. Enabling compression saves8,135,299B of journal payload (-78.7%) and69.3% of cache-included payload. Row/seed counts and transaction count match exactly in the fresh on/off pair; no cadence reduction manufactures the result. The first release keeps the lower memory/background/transaction-request costs, but does not claim the50% byte target until compression is enabled.

Catalogue memory gains remain: next-release off trace77.33MB versus112.62MB before Round2 (-31.3%). These are isolated Node runtime heaps and UTF-8-equivalent IDB put arguments, excluding renderer/DOM/GPU/build controls/backend/IDB service. Physical iPhone memory/heat and SQLite page writes remain manager browser/device acceptance items. No real owner/tester save or browser storage was accessed.

Both settings finish with exact raw-state SHA256 `372b73356be8614379f73a4ece7aa04efc7105569f0e0fd5da4aa12ea913fff7`, matching Round1/2 controls. Historical Level5 artifact remains SHA256 `dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5` (26,362 /6,056,335 /410 /0); no rebind. None of the7 Round3 source paths is a bound input. Pre-existing historical binding/raw-v-operational key-order debt remains as described in Round2.

### Tests, exact validation and scope

Both-mode tests cover native IDB plain/compressed/mixed rows and seeds; cross-mode lost-ack retry; plain/compressed `bind`/`append`/`compact` writes; supplied compressed packed values and weak-key worker preparation while off; encoder no-op without compression work; unknown-tag/oversized failure; and nonblocking worker hashing with/without prepared-row replies. Existing corrupt-gzip, abort, writer-fence race and bounded decoder scratch tests remain. The default constant is tested separately without a mock.

PowerShell, npm.cmd, CI=true, --pool=threads. Final sources were frozen before full validation.

Focused storage/gate/dispatch/watchdog (`round3/focused.log`, exit0):

```text
 Test Files  5 passed (5)
      Tests  53 passed (53)
   Duration  11.65s
```

Full player (`round3/player-full.log`, exit0), `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads`:

```text
 Test Files  448 passed (448)
      Tests  5420 passed (5420)
   Duration  800.58s
```

Full domain (`round3/domain-full.log`, exit1), `npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads`:

```text
 Test Files  2 failed | 217 passed (219)
      Tests  27 failed | 5964 passed | 1 skipped (5992)
   Duration  466.29s
```

Exact same27 named failures as Round2, checked programmatically in `round3/domain-baseline-comparison.json`:1 approved-clinical-admission,1 old input-binding assertion and25 legacy load/hash scenarios. No new failure and no changed expectation. This full run includes the existing tick/state differential tests. Canonical pins/fixtures were not rewritten.

Root `npm.cmd run build` (`round3/build.log`, exit0) includes boundaries, seven workspace typechecks, then player build:

```text
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
[seven workspace typechecks passed]
transforming... 685 modules transformed.
built in 9.67s
```

Workspaces: clinical-context-workbench (client+server), player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. Standalone player typecheck also passed. Existing build warnings remain. Same no-Git limitation as Round1/2: `boundary-inventory-adapter.cjs` supplies the captured Nov10 tracked inventory; source/dependency/launcher checks scan current files. Manager must rerun the stock tracked enumeration. `offline-local.cjs` blocks only Vite's optional Windows network-drive probe; no gameplay/test assertion is substituted.

Default-off production long-session budget (`round3/runtime-budget.log`, exit0):

```text
PASS: public Level4/5 production worker/view heap, allocation and transport budgets
```

600 advanced ticks each level; final L4 main/engine47.01/57.17MB, L5 46.41/63.87MB. Sampled per-command allocation L4 0.782/21.28MB, L5 0.807/24.37MB; largest replies552,877/541,171B. Same60/70MiB heap,768k transport,24MiB tail and allocation ceilings, CI allowance1.5; observed heaps also fit non-CI limits. Catalogue remains indexed with8/9 templates and3,577,982B bank. Both600-tick final-state hashes equal Round2 receipts exactly. The paced minute off/on states also match exactly as above. No new gameplay path was introduced; no new31k journey claim replaces Round2's recorded comparison.

Seven source/test paths (5 edited/2 new):

- New: `apps/player/src/session/localStorageBuildPolicy.ts`, `localStorageBuildPolicy.test.ts`.
- Edited: `apps/player/src/session/journalEncoding.ts`, `journalEncoding.test.ts`, `localJournal.ts`; `apps/player/src/session/cloud/operationalEngineDispatch.ts`, its test.

Scoped raw SHA/disposition manifest and normalized patch: `.local-dev/phone-memory-20261112/round3/source-manifest.json`, `runtime-normalized.patch`. Entry capture contains the30 prior source/doc paths; all other Round2 sources remain byte-identical. The plan is appended and the current-handoff block is prefixed; preserve other lanes and prior entries. No Git, network, installs, agents, browser, real storage, commit, push or deploy used.

Manager browser checks remain the Round2 cloud recovery/save/fencing and phone map/density set. Add a reader-first rollout check: open a compressed/mixed fixture with writes off, perform a tick/player action/checkpoint and reload, assert the same durable prefix and plain newly written rows/seeds; later enable writes, reload in this off/reader build and verify recovery. Future flag enablement is a separate release decision. This bounded worker milestone leaves the constant false and the byte-reduction target deferred until step2.

## Round 4: installed campaign reload blocker

Manager reports port36 `room-upgrades.spec.ts:395/:435` exceeding the unchanged5s reload poll on every viewport; release35 passed. Main-tree work only. No Git/install/network/browser/agents/deploy or real saves/storage. Implemented, measured and validated locally; manager browser acceptance is outstanding.

### Attribution: development and production are different paths

The default `playwright.config.ts` web server is **Vite development**, where `runtimeClinicalData` is build-only. Consequently the production full-bank await is not itself the cause of that default-dev failure. The entry regression present in both modes was Round2 changing the static `App` import into a dynamic import. That defers discovery/fetch/evaluation of the App graph until the entry's own dependencies finish, and lets navigation/load complete while the later graph is still loading. Release35 used a static App graph. Restored that static entry; the5s helper and every room-upgrade assertion remain untouched. The exact browser1.8s `isVisible` stall was not reproduced or profiled here; no browser is available. Manager must confirm the diagnosis on its dev trace.

There was also a separate real production regression: `main.tsx` awaited `ensureRuntimeCatalogue()` for every local bypass before mounting React, even though native saved clinics and the chooser can use the compact index and frozen encounters. Initial production controls measured116-123ms extra full-bank wall time before React; the5.3MB compatibility JSON parse alone was about20ms. Profile hydration26-39ms and journal processing followed serially. This unconditional barrier is removed.

The ordinary IndexedDB recovery path already passes an address to the native codec worker, where seed/row decoding occurs after its read transaction. Port36 writes are plain because `LOCAL_STORAGE_COMPRESSION_WRITES=false`. Sequential compressed-row decoding was not the measured main-thread cause for these installed plain fixtures; it remains bounded and unchanged.

### Implementation and safety

1. **Static navigation entry.** Main imports App statically again. A tiny independent classic `public/startup-recovery.js` runs before the module graph, catches script/module/index-asset failures while the root is empty and offers manual Reload. It never writes/clears storage or reloads automatically. It ignores optional image/style failures and removes both listeners/its temporary observer at first root content or loading portal. This preserves the old dynamic-import catch's recovery behavior without retaining its waterfall. The asset is wired with `%BASE_URL%`; Pages verification confirms its emitted path.
2. **Read-only chooser first.** `AuthenticatedPrototype` loads/validates the existing native profile with the compact index, paints its actual chooser, then warms the synchronous local command catalogue alongside journal recovery. Resume/restore/new/submit remain disabled until **both** complete; the account controls are inert while pending so older-copy/clear actions cannot race recovery. The journal's latest names/status/state replace the preview before actions enable. Automatic direct-to-game routes still show the loader until both gates finish. No local reducer/session/canvas starts early.
3. **Legacy failure is not corruption.** Missing-template signals are rethrown by both profile-parser catch boundaries, rather than skipping the clinic or making an empty profile. A pending legacy launch waits for full catalogue data and retries the unchanged source. Tests verify original profile/legacy bytes remain unchanged. Real invalid-record behavior is unchanged.
4. **Bound only visible heavy work.** Whole-bank compatibility graph assembly yields browser tasks after about4ms/checks in128-row batches, keeping all temporary objects unpublished. It preserves property order, references/cycles/undefined/sparse entries/own `__proto__` semantics; the final existing-case installation remains atomic. Per-case command slices and the compact startup index retain the original synchronous decoder. An experiment also yielding index construction increased active heap to79.37MB, so it was reverted; the final repeat is77.37MB. Every temporary message channel closes both ports; unsupported/throwing channel construction falls back to a finite timeout. No interval, background loop or new state cache/worker/copy is introduced.

Native cloud catalogue ownership/cache16 and codec idle policies remain intact. R3's build constant stays **false**. No save format, deadline, durability-before-ack, local/cloud fencing, operation ordering, frozen encounter, FSRS, progression, content, renderer, phone frame/thermal/DPR, pan/zoom or map-shade policy changed.

### Matched reload measurement

Receipts under `.local-dev/phone-memory-20261112/round4/`. Pre-edit capture:901 files (900 initial source/doc files plus index.html captured before its edit). `reload-summary-final.json` contains medians of3 fresh processes per phase/level. Use the **final-native** receipts, not earlier inline/partial experiments.

The production Node harness imports the real App/profile/recovery/view modules and uses a native codec worker. Same public installed L4/L5 frozen states and the captured1340-case domain/clinical/balance epoch in every phase. The historical column is the captured pre-Round2 release35-equivalent local path, not a claimed Git/binary comparison against GS-release. Phaser/portals are SSR stubs, native IDB is represented by the same logical MemoryJournalStorage, and localStorage is an in-memory map. Fixture installation is excluded. Playable readiness includes the Resume profile serialization, ordered local journal bind/ack, view projection and facility-host SSR. Actual DOM paint/fonts/art/WebGL/physical storage/browser IPC are excluded. Measurements overlap correctly with the native codec; the earlier inline-codec control falsely serializes its CPU on main and is retained separately for audit.

| Public installed campaign, median ms | Captured pre-Round2 reference | Port36 pre-edit | Final |
|---|---:|---:|---:|
| L4 chooser visible |916.30 |821.91 |**398.76** |
| L4 actions ready (both gates) |916.30 |821.92 |**692.96** |
| L4 playable controller/SSR, durable bind included |1101.09 |996.61 |**869.41** |
| L5 chooser visible |939.09 |834.83 |**406.33** |
| L5 actions ready (both gates) |939.10 |834.84 |**710.67** |
| L5 playable controller/SSR, durable bind included |1155.85 |1038.74 |**910.35** |

Thus final chooser visibility is about51% sooner and playable controller/SSR about12-13% sooner than the pre-edit production path; both beat the captured reference. This production harness did **not** reproduce the reported absolute dev-browser regression (its reference also had a slower duplicated codec catalogue); it supplies a controlled CPU/ordering comparison, not a substitute for the manager's browser run. Static entry's browser navigation/fetch correction is assessed structurally and needs that rerun.

Representative final stage wall times (L4/L5 ms, concurrent stages must not be added): module graph352/337; native profile28/33; early chooser11/10; post-commit catalogue warm168/161 alongside journal recovery305/305; Resume profile save5/7; durable bind94/97; view31/43; playable SSR23/21. Full-bank compatibility decoding is no longer a serial pre-React stage. In representative pre-edit runs its single task gap was53ms; after chunking, overlapping chooser/warm work has about29-31ms gaps, chiefly the unchanged native JSON parse. Overall largest Node task gaps remain roughly250-256ms in common module evaluation (reference444-448ms), and view/durability work still produces30-78ms startup tasks. **This does not claim a zero-long-task startup.** The common code/model costs are explicitly bounded only by these measurements, not hidden by the5s test.

### Memory, data and byte equality

- Matched public Day20 L5 phone-layout cloud trace: main+engine **77,369,168B** after normal codec idle versus R3 off77,334,440B, effectively unchanged; original112,622,648B ->**31.3% lower**. Engine remains active. Node realm totals exclude DOM/GPU/images/build controls/backend/IDB service. No real save or storage was accessed.
- Writes-off journal payload stays10,337,161B in that minute; the state SHA256 remains `372b73356be8614379f73a4ece7aa04efc7105569f0e0fd5da4aa12ea913fff7`. No compression was secretly enabled.
- Compiled local SSR main post-GC is94.34/95.23MB for L4/L5 versus93.02/93.90MB pre-edit, a bounded roughly1.3MB local compatibility-decoder/runtime cost; still below captured reference101.86/102.74MB. This is not physical iPhone memory. No additional full-state/catalogue copy, growing cache, texture or renderer resource was added. Native/GPU peaks still need device acceptance.
- All18 final paired reload runs finish with byte-identical game-state hashes for the same level across reference/pre-edit/final. `legacy-differential.json` adds11 public legacy/current states: index deserialization+serialization exactly equals full-bank deserialization, without silently partial output. Synthetic missing-template tests cover the explicit wait/retry path.
- All runtime values in the current clinical projection compare exactly with the synchronous decoder, including graph edge cases. Index and bank asset bytes are identical before/after for the frozen epoch: index SHA `91c0d253ee0ed0549b5d207543603de8fe9e93cb074366699834b23f03edef12`; bank SHA `4e194089eb8b6eb1ede2c15b2ddda109fadd92754c1c8d71ccb33e652017cd10`.
- Canonical Level5 artifact remains `dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5` (26,362 /6,056,335 /410 /0). No rebind or bound-input edit; the14 owned paths intersect canonical bindings zero times. Existing historical binding debt from Rounds1/2 is unchanged. Concurrent domain/content changes were preserved, and the comparative harness freezes them out of its inputs.

### Exact validation

PowerShell, npm.cmd, CI=true, --pool=threads; no browser. Final focused native chooser/legacy/data/yield/startup safety (`focused-complete.log`, exit0):

```text
 Test Files  8 passed (8)
      Tests  41 passed (41)
   Duration  12.34s
```

Full player, final sources (`player-closure.log`, exit0), `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads`:

```text
 Test Files  454 passed (454)
      Tests  5491 passed (5491)
   Duration  780.18s
```

Root `npm.cmd run build` (`build-closure.log`, exit0), including boundaries and all7 workspace typechecks:

```text
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
[seven workspace typechecks passed]
transforming... 689 modules transformed.
built in 8.90s
```

Workspaces: clinical-context-workbench (client+server), player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. Standalone player typecheck also passes. Same no-Git caveat: the boundary adapter supplies the captured Nov10 tracked inventory only for ls-files; current source/dependency/launcher checks still run. Manager must rerun stock tracked enumeration. Existing dynamic-import/chunk/plugin warnings remain. No test timeout or browser expectation was relaxed. An earlier in-progress run was interrupted when adding the final entry recovery guard; only the completed closure is claimed.

Separate production Pages build to a private outDir (`pages-build.log`, exit0,9.02s), stock verifier with only its output directory changed:

```text
Verified 16 Pages asset reference(s) and 3620 public build file(s) under /GamifySurgery/.
Verified early classic guard before static main, Pages base and emitted asset.
```

Production L4/L5 ten-hour/600-tick budgets (`runtime-budget.log`, exit0):

```text
PASS: public Level4/5 production worker/view heap, allocation and transport budgets
```

L4 final main/engine47.22/57.16MB; L5 46.67/64.20MB; templates8/9, indexed=true, bank3,576,177B in the current shared-tree content epoch. Largest replies552,877/541,171B. Original60/70MiB heap, allocation/transport/tail limits and CI allowance1.5 retain their assertions. The current-content long budget is distinct from the fixed1340-case matched opening/memory control. Full domain was not rerun in this UI/runtime-only round; no domain file was edited.

### Scoped handoff and remaining browser acceptance

**14 source/test/entry paths (9 edited/5 new)** plus this plan and the new current-handoff block. Exact raw SHA/dispositions and normalized owned patch: `round4/source-manifest.json`, `runtime-normalized.patch`. No unexpected captured-source drift. Preserve other workers' changes; port these hunks only. **Include index.html and the new public startup script together**.

- Edited: `apps/player/src/main.tsx`, `App.tsx`, `session/prototypeStorage.ts`, `ui/OpeningSequence.tsx`, `mobile/performance/runtimeCatalogue.ts`, `mobile/performance/runtimeClinicalData.test.ts`; `scripts/vite/runtime-clinical-graph.ts`, `runtime-clinical-data.ts`; `apps/player/index.html`.
- New: `apps/player/src/App.localCatalogueOpening.test.tsx`, `mobile/performance/runtimeYield.test.ts`, `session/prototypeStorageCatalogue.test.ts`, `ui/startupRecovery.test.ts`; `apps/player/public/startup-recovery.js`.

Manager rerun: unchanged `room-upgrades.spec.ts` tests at395/435 serially on desktop/laptop/phone using the same default Vite server; repeat against production preview/Pages base, record reload-to-visible and action-ready separately. Verify case names/state/upgrade/Undo/patient work persist. Also run cloud-saves/cloud-recovery (flag false/mixed readers), initial campaign creation/restoration, pending bank+slow journal, unavailable bank -> retry, missing App/index asset -> manual Reload without storage changes, quick reload/pagehide during opening, and existing phone density/map smoke checks. The classic guard must precede the deferred module graph and detach after first root/loader paint. Physical iPhone memory/heat/canvas/art acceptance remains external. The browser5s blocker is **ready for rerun**, not claimed passed here.

Local bounded implementation and Node validation complete. No Git, commit/push/backup, deploy, install, network, agent, browser or real-save access. No canonical opening origin/pathway changed; local4173 and hosted Pages keep their separate existing storage.
