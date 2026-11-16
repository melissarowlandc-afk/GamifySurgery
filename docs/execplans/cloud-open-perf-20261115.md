# Cloud opening performance - 2026-11-15

## Goal, scope and repository state

Reduce the high-level cloud route's checking-to-first-view latency without changing save meaning, verification, durability, fencing, conflict/divergence selection, operation ordering/idempotency, frozen encounters or FSRS. Target under 8 s in the stated normal phone estimate and under 30 s in the stated stress estimate. Actual phone/browser acceptance remains external.

Main tree only, shared working tree. No Git, agents, network/live DB, browser storage, installs, deployment, cloud format/DB/RPC or save-cadence changes. The approved account export was read only as data. Private reconstructed inputs, states, views, hashes, CPU profiles and source controls remain under `.local-dev/cloud-open-perf-20261115/`; no private fixture or identifying value belongs in this document or tests. Runtime/test ownership is player opening/session/cloud; no domain, clinical, balance, renderer or progression edits. Compression writes remain enabled as approved for release 38.

Before editing, captured SHA256 and sources for 1,915 relevant files, including the current handoff and canonical Level 5 artifact. For the initial CPU pass, source review found only the eight intended captured runtime files changed; seven independently written runtime/test files are new, plus this plan and the appended handoff. Preserve all other shared work.

## Findings and why size matters

The selected current campaign is Level 5. Its format-3 envelope is 2,818,997 B (245,259 B compressed). Aggregate shape: 175 rooms, 49 staff, 58 frozen discussions, 15 encounters, 606 learning histories, 1,442 service receipts and 500 events. Largest serialized roots are receipts (~536 KB), learning histories (~484 KB), frozen discussions (~425 KB), service operations (~310 KB) and encounters (~241 KB). These counts explain why whole-state copies, strict JSON passes and independent view traversals grow with play.

1. The engine already computed the opening view, but the session discarded it. The first main-thread render independently traversed the large facility/operations/learning state: 591-690 ms here. Its restored camera, review flags and casual-mode arguments were also absent from the worker's initial request.
2. Additive snapshot learning compatibility rebuilt a full evidence checkpoint synchronously on main: 115-119 ms. This is an existing load contract, not replay or new learning data.
3. A durable adaptation marker triggered optional journal warming while engine initialization was unpublished. In reduced-memory mode this could restart a second codec realm immediately after its deliberate release. Cold opening started two codec realms plus the engine; it now starts one codec realm followed by the engine. Mandatory durability/checkpoint work is unchanged.
4. Unchanged native journal recovery encoded/canonicalized/gzipped the whole recovered clinic, then compared it and threw the encoded snapshot away. Comparing validated states first avoids that encode while retaining the original candidate bytes/lineage.
5. Automatic selection downloaded an already-fetched immutable head again in coordinator opening and the later fresh-head check. The fresh authority/head checks are necessary; repeating the payload download for the same revision is not.

Current native format-3 opening does not call `deserializeGameState` or replay persistence migrations. Its actual boundary is strict snapshot parse/checksum/canonical validation, number repair and domain evidence import. Codec proof caching already limits cold decoding to two distinct current cloud heads in this account. Catalogue preparation is about 6 ms in the engine, not the dominant measured cost. No verification pass was removed on the basis of a claimed digest.

## Offline measurement method

Production Vite/Rolldown Node 24 bundles, minified for final timings. Both phases use the same captured domain/clinical/balance epoch and fixed wall clock. Native engine and codec workers run the real task dispatchers; fake IndexedDB runs the real cache, entry and journal implementations. The real Supabase transport uses an offline RPC adapter backed by the real fake server: access/list/load/lease shape checks and packed-byte verification run, with zero network/auth SDK/live DB calls. Reconstructed both campaign heads, three snapshot rows, 19 operation receipts and two writer rows from the approved export. Only two current heads are loaded in these healthy cases; prior-revision recovery remains covered by tests.

Three fresh-process runs per phase/scenario, alternating before/after for the first matched set; after the authority-race guard was added, repeated all three after runs. All nine paired final states and first views match byte for byte. Full inspector profiles use 500 microsecond sampling, with source-mapped function/line attribution. Rebuilding only the private source maps preserved every previously measured JavaScript byte; phase timings and profiles remain the original minified production runs. All private outputs remain local.

Scenarios:

- **Cold**: empty local cache/journal; approved cloud inputs.
- **Compressed seed**: reconstructed clean cache and compressed native journal seed from those inputs, with setup excluded from opening.
- **170-command tail**: controlled compressed journal with 170 synthetic speed commands and real durable rows, generated only in the private harness. It is not a claim about the owner's actual device journal.

The export contains no iPhone IndexedDB/localStorage. The separate Node storage service preserves browser-like service lifetime across codec termination; its journal facade adds parsed-value IPC overhead, and it is not physical WebKit/SQLite latency. The harness covers campaign selection, coordinator checks, snapshot decode/validation, journal recovery/rebind, compatible learning checkpoint, catalogue, engine and first view. It excludes auth, download latency, React commit/DOM, Phaser/art and browser first paint. `profileForCloudCampaign` merely wraps the already-loaded state; the cloud hook uses that state directly. Main module import happens before this route and is reported separately. Origin-local camera/flag storage starts empty and casual mode is fixed false in both timing controls; saved camera/flags and true/null modes are covered by unit tests, not inferred as device preferences.

## Phase timings on the approved input

Milliseconds; medians of three runs. Phase medians are independent and need not sum exactly to the median total.

| Phase | Cold before | Cold after | Compressed seed before | Compressed seed after | Tail 170 before | Tail 170 after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Main module import, outside checking route |185.54|185.05|181.47|183.04|186.63|184.40|
| Automatic selection/coordinator/recovery |612.31|570.82|873.07|726.93|1,400.36|1,422.46|
| Session hydrate/durable bind/engine preparation |921.35|873.13|1,045.53|998.74|1,140.48|1,154.85|
| First main-thread view read |591.46|1.02|689.78|0.80|582.67|1.07|
| **Checking-to-first-view total** |**2,118.00**|**1,444.59**|**2,616.27**|**1,726.80**|**3,123.52**|**2,578.39**|
| Observed total range |2,106.65-2,127.21|1,443.51-1,446.30|2,602.30-2,624.95|1,716.46-1,733.18|3,090.07-3,123.91|2,552.87-2,581.10|

Cold improves 31.8%; compressed-seed opening 34.0%; changed-tail stress 17.5%. The changed tail still requires the full existing encode/recovery work; its selection/bind phases did not improve. No timings or operation-count assertions were relaxed.

Representative after-run codec waits (not additive to the table): cold proof inspection 533 ms across five requests, hydrate 151 ms, durable journal bind 224 ms; compressed seed journal preparation 439 ms, hydrate 142 ms, bind 359 ms; dirty-tail preparation 769 ms, hydrate 69 ms, bind 468 ms. Hydrate now includes compatible checkpoint construction in the worker. The same cold checkpoint builder has zero main-thread calls after the change. Detailed function and task receipts remain private.

| Operation | Before | After |
| --- | ---: | ---: |
| Cold snapshot payload downloads |4|2|
| Compressed-seed payload downloads |3|2|
| Cold access/list/lease RPC calls |3 / 6 / 1|3 / 6 / 1|
| Cold main full view derivations |1|0|
| Cold main compatible checkpoint builds |1|0|
| Cold codec realms started during opening |2|1|
| Unchanged native journal snapshot encode |1 per preparation|0|

## CPU attribution and detailed cold phases

Representative matched cold run 1, milliseconds. Inspector self time is sampling-based, not inclusive duration; anonymous callbacks are identified by the mapped source line and enclosing operation. These rows are not additive to the phase table.

| Realm / self-time function or callback | Before | After |
| --- | ---: | ---: |
| Main `roomFixtureHiddenByDoor` door-search callback, spatial.ts:165 |357.9|0 sampled; duplicate view absent|
| Main nested `rooms.find` callback, spatial.ts:166 |33.1|0 sampled|
| Main `compressedHash` |29.9|11.3|
| Main `jsonCopy` |28.1|0 sampled|
| Main door-duplication callback, doors.ts:243 |23.6|0 sampled|
| Main `physicalDoorKey` |22.8|0 sampled|
| Main `evidenceJsonText` |16.5|0 sampled|
| Initial codec `jsonCopy` |43.7|77.1|
| Initial codec `logicalJsonText` |38.1|33.4|
| Initial codec strict parser `value` |26.6|30.0|
| Initial codec `structuredClone` |26.2|24.4|
| Initial codec `validText` |23.2|24.9|
| Initial codec `evidenceJsonText` |21.8|31.6|
| Engine door-search callback |33.9|31.8|
| Engine `jsonCopy` |19.6|19.5|
| Engine `physicalDoorKey` |19.4|16.7|
| IDB service `decodeJournalValue` |17.2|8.9|

The large cold main view repeats nested door/room scans (`doors.some` plus `rooms.find` for fixture visibility). That explains growth faster than a simple room count. Reusing the already-prepared worker view eliminates this duplicate traversal; domain query code is unchanged. The initial codec's copy time rises because compatible checkpoint construction moved there. The separate optional restarted codec realm disappears: before it also spent self time in `logicalJsonText` (65.1 ms), `jsonCopy` (49.0 ms), strict parser `string` (34.8 ms) and journal preparation (32.4 ms) while opening competed for CPU.

Sampled main non-idle/non-GC time is 827.5 -> 111.2 ms. This includes ~24 ms inspector `post` overhead and native `(program)` samples; it is not browser render time. Main sampled GC is 18.7 -> 0 ms in this pair. Remaining after-main costs include native `postMessage` (16.0 ms), `freezeJournalCheckpoint` (4.1 ms) and `freezeOperationalValue` (3.1 ms). No claim that all opening long tasks have disappeared.

| Cold worker phase, inclusive | Before | After |
| --- | ---: | ---: |
| Two distinct cloud snapshot decodes/validation (`loadCloudSnapshot`) |300.12|295.13|
| Strict snapshot JSON parsing, included above |69.08|71.53|
| Current-state repair/contract validation, included above |162.24|163.40|
| Initial engine catalogue preparation |5.48|5.31|
| Engine evidence preparation |40.91|38.58|
| Initial worker view derivation |196.30|180.56|
| Engine initialize, including preparation/view |302.69|283.00|
| Main compatible checkpoint construction |115.43|0 calls|

Native snapshot migration/deserialization call count is zero in both phases. Fresh proof inspection still runs against actual bytes. In the compressed-seed run, journal preparation is 561.84 -> 438.93 ms; the changed-tail scenario retains the original encode path.

## Phone estimate and limits

Use **4x** the isolated Node checking-to-view wall time as a normal CPU planning multiplier, plus an explicit **1 s** allowance for network/physical storage; use **8x** the maximum observed sample plus **5 s** for the stress envelope. These are assumptions, not a calibrated iPhone measurement. Prior public `phone-runtime-budget` controls measured L4/L5 native-worker command wall times around 31/39 ms; 4x gives 124/156 ms against the 250 ms pulse interval at 4x play. This cross-check is consistent with the planning allowance but does not establish an opening/device ratio. Prior browser reports and those Node fixtures are not matched enough to derive one.

| Scenario | Normal estimate before | Normal estimate after | Stress estimate after |
| --- | ---: | ---: | ---: |
| Cold |9.47 s|6.78 s|16.57 s|
| Compressed seed |11.47 s|7.91 s|18.87 s|
| Tail 170 |13.49 s|11.31 s|25.65 s|

The normal cold/clean-local cases meet the estimated 8 s target. The synthetic dirty-tail normal estimate does not; it meets the stated 30 s stress envelope. These are conditional estimates, not a guarantee under arbitrary network, memory pressure, worker-startup delays or auth. Node did not reproduce the owner's actual 30 s stall. Manager physical-phone and production browser measurements remain necessary.

## Implementation and safety

- `App.tsx` and new `cloud/openingProjection.ts` pass the exact initial open chart, summary/placement defaults, restored camera, local review flags and nullable casual mode to the engine. The worker's existing view is published into the existing state/argument-matched cache. Different inputs still derive the ordinary view; synchronous/failed-worker fallback keeps its old path.
- `operationalSessionEngine.ts` accepts initial projection arguments and exposes the just-created worker view. It does not change command execution/replay, state authority, admission, retry, durability or worker protocol semantics.
- `codecTasks.ts`, `verifiedCopyCache.ts`, `gameSession.ts` prepare additive learning defaults on a session-owned hydrated copy in the codec. The raw proof cache, source hash, account bytes, existing histories/reviews and frozen cases stay unchanged. A reply-only marker keeps the existing durable dirty/adaptation bookkeeping. Read-only/prior recovery never requests adaptation. If authority changes during hydration, reopen the raw cached copy before exposing the read-only presentation. Older/custom executors retain the main fallback adapter.
- `gameSession.ts` prevents only optional `journalWarm` during unpublished initialization. Journal bind/commit, mandatory checkpoint preparation, ordinary post-open backup, leave/pagehide/visibility, Save & Close and day-end barriers are unchanged.
- `journalCodec.ts` validates metadata, identity, mapped fields, capacity and lineage, imports/repairs the journal as before, then compares before encoding. Both compared native states passed evidence boundaries. Non-plain/generic values keep the original JSON canonical fallback. Changed state still uses the original encoder; usage, older-prefix, lineage and legacy-base rules stay exact.
- `automaticResolution.ts` and minimal `coordinator.ts` hunks reuse fetched bytes only for the matching campaign/revision and behind the same fresh head/full proof checks as cached copies. Prior-recovery hints and forced-remote checks fetch again. Writer acquisition, fencing, admission, immutable operations and conflict/divergence handling are unchanged.

No cloud format, DB version/schema, RPC, deadline, snapshot capacity, cadence, operation ID, FSRS, clinical content or progression change. `LOCAL_STORAGE_COMPRESSION_WRITES = true` is unchanged. Canonical Level 5 artifact is unchanged, with zero owned bound-input overlap; no rebind or domain source edit.

## Public regression fixture and tests

New `openingPerformanceTestSupport.ts` independently combines the existing public diagnostic workload and public integration history, then generates 180 rooms, 50 staff, 64 frozen discussions and 1,500 receipts. It is 2-3 MB, valid through ordinary public persistence/evidence contracts. No private record, ID, text, value distribution or copied save is a test input.

New tests: `openingPerformance.test.ts`, `openingProjection.test.ts`, `openingCopyReuse.test.ts`, `journalOpeningComparison.test.ts`, `playableHydration.test.ts`.

Deterministic guards pin zero initial main view calls (with a supplementary `hostedTime(16)` budget), zero startup warming while engine response is held after a committed journal row, zero unchanged snapshot encodes, actual-byte proof reuse, immutable-head download count and fresh authority/head checks. Byte-exact differential coverage retains the former encode-before-compare algorithm for unchanged/changed/metadata/reordered/older/older-with-usage journal candidates. Invalid lineage/campaign/identity/checksum and corrupt hinted bytes fail closed. Hydration tests compare exact checkpoints/state to the old adapter and preserve raw proof reads, supplied data, no-op/default modes and authority-loss behavior. Existing cloud recovery, concept compatibility, number repair, native proof, fencing, conflict, operational ordering and compressed/plain/mixed tests remain in validation.

## Validation (final)

PowerShell, `npm.cmd`, `CI=true`, native Vitest threads. The existing `offline-local.cjs` disables only Vite's optional Windows `net use` probe in this sandbox; it does not transform application code, tests, assertions or budgets.

Full player:

```text
npm.cmd test -- --pool=threads --maxWorkers=4
 Test Files  462 passed (462)
      Tests  5580 passed (5580)
   Duration  806.98s (transform 33.63s, setup 0ms, import 992.12s, tests 2181.91s, environment 38ms)
```

Focused 20 files (opening performance/copy/projection/journal/hydration; snapshot concept compatibility; automatic resolution/coordinator/native proof/entry preparation/unsafe number/prior recovery/upload races/conflicts; operational session/snapshot saves/journal warm/local journal/encoding/build policy):

```text
npm.cmd test -- --pool=threads --maxWorkers=4 <the 20 paths in focused-final.log>
 Test Files  20 passed (20)
      Tests  226 passed (226)
   Duration  62.33s (transform 28.28s, setup 0ms, import 82.26s, tests 158.53s, environment 1ms)
```

Seven workspace typechecks, root `npm.cmd run typecheck`, exit 0: clinical-context-workbench (client + server), player, balance-config, clinical-authoring, clinical-content, clinical-research, game-domain. No TS errors.

Root `npm.cmd run test:boundaries`, exit 0:

```text
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

No Git was invoked. The existing `boundary-inventory-adapter.cjs` supplies the captured Nov10 tracked inventory only for `ls-files`; current runtime source/dependency and launcher checks run unmodified. Manager must rerun stock tracked-prefix enumeration. Owned new paths are source/tests/docs, with no private prefix.

Additional production player build, exit 0:

```text
npm.cmd run build --workspace @gamify-surgery/player
691 modules transformed.
built in 10.44s
```

Build reports the >500 kB chunk-size advisory; it is not an error. Additional related clinical acceptance pin checks (batches 8-11), exit 0:

```text
npm.cmd test -- --pool=threads --maxWorkers=2 <the four acceptance test paths>
 Test Files  4 passed (4)
      Tests  30 passed (30)
   Duration  11.89s (transform 8.10s, setup 0ms, import 19.74s, tests 3.44s, environment 0ms)
```

No acceptance fixture/reconciliation record or clinical/domain source was changed. Canonical Level 5 artifact remains byte-identical (26,362 commands / 6,056,335 cents / 410 completions / 0 walkouts); zero owned bound-input overlap and no rebind. Domain source is untouched, so the brief's conditional domain rerun is not required.

Deterministic pre-edit control: run the new public `openingPerformance.test.ts` through the captured eight pre-edit runtime sources, without Git. **All three guards fail for the intended reasons** (13.72 s): one unexpected main view derivation; one `journalWarm` during held initialization; two unexpected snapshot encodes. This expected-failing control is separate from final validation, which is entirely green. No assertion or timeout was weakened.

All nine approved-input state/first-view pairs are byte-exact. Source receipts, normalized owned patch, private profiles and full logs are in `.local-dev/cloud-open-perf-20261115/`. Privacy audit reports no approved-input identifiers/names in owned public output; private data/hashes remain untracked/local.

## Open risks and next action

1. Physical iPhone/network/WebKit/IDB behavior and React/renderer first paint are not measured here. Manager should run production cloud-saves/cloud-recovery, installed-campaign reload/Resume (including room-upgrades 395/435), cold/clean/dirty-tail high-level phone opening, slow network, corrupt-prior recovery, pagehide during opening and worker-start failure. Confirm the unchanged 30 s warning no longer appears on the owner's device.
2. Current compatible game JSON is near the existing 3,000,000 B decoded-state ceiling (2,996,310 B for this input). Current cold/clean/tail-170 runs succeed. No cap/server/format change was made; future gameplay growth can still hit this independent limit and needs manager review if observed.
3. A changed dirty journal still incurs full recovery/encode/bind. The stress estimate is conditional; no physical storage throughput or unknown retained device-copy count is inferred from the export.
4. CPU profiler sampling, native-worker service IPC and explicit fixture setup differ from a browser. Profile overhead is present symmetrically; main module parse is reported outside route time.

Completed implementation, paired profiling, regression control, final validation and scoped source review. Manager production-browser/physical-phone acceptance is next. No canonical URL, storage origin, launcher or owner opening pathway changed. All work remains local; no Git/backup/release/deploy action was performed.


## Follow-up: module-worker delivery (2026-11-15)

### New evidence and diagnosis

The later private phone report shows an available/ready codec with two requests still queued after about 42 s, no dequeue/start reply, no snapshot head/load timing, and a warm-up hitting its 30 s outer deadline. The last response was the module's ready signal, approximately 0.6 s after the first post. This is much stronger evidence for a startup/delivery gap than for the earlier measured CPU work. It is consistent with pre-handler module-worker message loss; it does not prove a particular WebKit implementation defect without device reproduction. The earlier CPU improvements remain in place. No diagnostic identifier, account/campaign field or private fixture is copied here.

Both clients used to post immediately. Codec restart repeated that race, then the queue watchdog waited up to 60 s. The engine had no ready signal at all. Reduced-mode codec idle release/recreation increased exposure to that startup pattern.

### Delivery protocol and invariants

| Stage | Behavior / deadline |
| --- | --- |
| Module not ready | Buffer requests, post none. Preserve codec release startup 10 s (development 60 s) and the engine's existing initialization budget. |
| Ready / no receipt | Send in FIFO order. Do not let a later original message overtake an unreceived earlier one. Re-post the captured message at 1.5 and 3.5 s; after 6.5 s of available-worker delivery time, enter the existing failure/restart path. |
| Worker receives message | Synchronously post `{id, received:true}` before queueing/catalogue work. Duplicate IDs get another receipt but no repeated body/execution/result. |
| Another task occupies worker | Pause missing-receipt time while that task can legitimately block its next `onmessage`. Its existing active execution cap remains authoritative. Independent engine journal hashing does not block player work. |
| Codec dequeues | Start the unchanged 60 s active-task cap at `started`; 5 s heartbeats do not extend it. A received queued task never spends another task's processing budget. |
| Start reply also lost | Retain the existing 60 s quiet-head watchdog. A heartbeat recovers the remaining head budget rather than extending it; advancing to a new head resets that budget so earlier work is excluded. |
| Result / error | Existing validation, state/version/evidence publication, promise completion and durability rules run. Receipt controls alone do none of these things. |
| Idle / dispose / failure | Clear delivery timers and buffered messages. Preserve pending-task idle-release refusal, reduced codec 5 s release, engine park/recovery, and codec's one same-payload restart retry. |

`received` is **transport-only**, never a durable application acknowledgement. It does not resolve a codec/command promise, publish state, advance engine version/evidence, acknowledge a journal, grant a writer, or call an RPC. Existing pending maps retain the task until its result; leave/checkpoint/Save & Close barriers therefore still wait for real work.

`workerDelivery.ts` holds only unreceived outgoing messages and coalesced received-ID numeric ranges, without a full result/payload history. The increasing production stream occupies one range, including after a worker restarts at a nonzero ID. Skipped/out-of-order IDs are still handled exactly by the receiver; duplicate delivery cannot initialize or execute twice. Receipt gating guarantees original task order under loss. No per-tick full-state clone/JSON was added: engine commands/projections already own their captured inputs, and private bundled app initialization retains its existing frozen shared-seed path. Codec payloads and independent journal inputs are captured so caller edits cannot alter a re-post or restart retry; those temporary payloads are released when the task settles.

Diagnostics add `reposts`, `repostEpisodes`, `receiptTimeouts`, `unacked`, `buffered`, and `deliveryPaused`. Engine transport also exposes ready/alive/pending/response-age health and unregisters on shutdown. Emit one `worker-delivery` event per re-post episode (`codec-repost` or `engine-repost`), without IDs or payloads. Existing error/restart diagnostics remain.

### Implementation / ownership

Runtime changes: `cloud/codecWorker.ts`, dispatcher/reply type only in `cloud/codecTasks.ts`, `cloud/operationalEngineClient.ts`, `cloud/operationalEngineProtocol.ts`, `cloud/operationalEngine.worker.ts`, and new `cloud/workerDelivery.ts`. Codec's existing entry already posts ready after evaluation and calls its dispatcher synchronously, so it needs no source edit. Engine now does the same before catalogue initialization. Data/task reply types remain separate from controls.

Updated fake/MessageChannel/native supports: `codecWorkerTestSupport.ts`, `codecWorkerMessageTestSupport.ts`, `operationalSessionTestSupport.ts`, `operationalEngineNativeTestSupport.ts`, `operationalEngine.nativeWorker.testSupport.mjs`. Precreated test adapters retain/defer their ready signal until the client attaches; opening assertions are unchanged. Existing client/queue/memory tests now model actual ready, receipt and started phases. New `codecWorkerDelivery.test.ts`, `operationalEngineDelivery.test.ts`, and `workerDeliveryLossTestSupport.ts` inject drops and duplicates. The public `scripts/qa/phone-runtime-budget.mjs` native adapter also emits ready/receipts for current clients, retaining its original path for captured older clients; no budget, command, fixture or result assertion changed.

Follow-up scope is 20 runtime/test/support paths (16 edited, 4 new), plus this plan and the handoff. `gameSession.test.tsx` now announces worker readiness before expecting its checkpoint post; the existing tick/durability assertions are unchanged. The complete manifest is the union with the accepted opening pass, not a replacement for it. No domain/content/balance/renderer/progression edits. Accepted codec task bodies are byte-identical to the pre-follow-up capture; only transport imports/types/dispatch change there. Cloud format, DB/RPC, deadlines, cadence, durability/fencing/conflict rules, operation IDs, FSRS, frozen encounters, compression=true and Level 5 pins remain unchanged.

### Deterministic acceptance

Public fake ports discard every pre-ready post, discard the first one/two post-ready messages, and duplicate delivery. Both clients pass. The report-like codec sequence queues hash at 0 ms and cache read at 225 ms, then receives ready at 600 ms: **zero early posts**, both bodies run once and complete after ready without restart. These are fake-clock transport measurements, not measured iPhone or decoder timings.

| Fault | Codec | Engine |
| --- | --- | --- |
| Pre-ready messages would be lost | Posts zero before 600 ms ready; hash/cache execute once | Initialization posts zero before ready; subsequent commands preserve order |
| First post-ready message lost | Recovered at 1.5 s, no restart | Initialization and command recovered at 1.5 s, no restart |
| First two posts lost | Recovered at 3.5 s, no restart | Initialization and command recovered at 3.5 s, no restart |
| Duplicate / lost receipt | One body execution; late duplicate receipts harmless | One initialization/command; exact state/operation IDs; late receipts harmless |
| All posts lost | Existing restart path at 6.5 s, replacement also waits for ready; same payload; at most one restart retry | Existing session recovery boundary receives `engine-receipt` at 6.5 s, without publishing a private result |
| Busy legitimate task | Receipt retries pause; unchanged active cap and queue ordering | A busy command does not get restarted for a pending independent hash post |

Additional guards cover caller mutation after first send, exact journal-row capture, two failed delivery attempts settling once with no timers, pre-existing startup deadlines, active processing caps/heartbeats, lost start replies (including behind a 59 s task and on an already-ready worker), receipt-before-dispatch, and unseen out-of-order/gapped IDs. Existing native module-worker, long L4/L5 differential, cloud opening/recovery, frozen-learning and memory tests remain in focused/full validation.

### Public production retention/allocation check

Same public L4/L5 checkpoints, 600 ticks / ten game hours each, same domain/clinical/balance epoch, minified production bundles and native workers. Matched before control replaces only the client with its accepted pre-follow-up source and uses its original worker adapter; current uses ready/receipt handling. No owner/tester save or browser storage. Both runs pass unchanged regression ceilings and finish with identical state bytes and maximum applied-reply bytes. Whole-tree source-capture experimentation was not used for the final matched comparison.

| Metric | L4 before | L4 after | L5 before | L5 after |
| --- | ---: | ---: | ---: | ---: |
| Retained main heap at 600, MB |47.368|47.786|45.177|45.266|
| Retained engine heap at 600, MB |57.972|57.982|64.813|64.865|
| Mean worker-command wall ms |27.878|27.883|35.090|35.038|
| Main sampled allocation B/tick |787,674|788,900|815,897|802,604|
| Engine sampled allocation B/tick |24,434,387|24,472,138|27,976,727|28,061,625|
| Maximum applied-reply B |553,596|553,596|540,952|540,952|

Post-explicit-GC heaps and 32 KiB allocation sampling, not physical iPhone/GPU memory. Small differences are within run/sampler variation; there is no measured steady-state transport regression. Gameplay state growth/compaction is common to both controls; this is not a claim that absolute clinic state never grows. Receipts add small control packets, without duplicating the applied state reply. Private app initialization keeps its owned-seed optimization; generic unowned inputs must still be captured safely.

### Final validation and remaining acceptance

Final focused run: **32 files / 294 passed, 121.19 s** (CI=true, --pool=threads --maxWorkers=4). Includes actual native/Vite worker entry tests, engine differential/performance, opening performance/large opening, coordinator/automatic selection, prior recovery, races, game-session durability and learning compatibility. The separate final transport/liveness run is **5 files / 66 passed, 22.90 s**. Final full player: **464 files / 5,603 passed, zero failed, 786.62 s**. All seven workspace typechecks PASS. Boundaries/launcher PASS using the documented captured Nov10 inventory (19,196 paths; no Git); stock tracked enumeration remains manager work. Actual production player build PASS, **692 modules, 11.53 s**, with the chunk-size advisory. Public production budgets PASS in both controls. All final checks exited 0; exact log hashes/results are recorded in `worker-delivery/validation-receipt.json`.

The first full attempt finished with one failure (1 failed / 5,600 passed): the existing game-session fake expected its encode task before any ready message. Its fix explicitly announces ready and asserts zero premature posts; the original ticks, command availability, checkpoint and durability assertions remain. This corrected file passes in both final focused runs. Additional liveness review retained the quiet-head cap when start replies are lost, with two focused regressions. The final full rerun uses the frozen source recorded in `worker-delivery/validation-source-freeze.json`; the first attempt remains separately logged as `player-full-first.log`.

Final source audit: all 14 accepted paths outside the shared codec dispatcher and documentation match their accepted hashes; no captured source outside the cumulative owned scope changed. Compression writes remain true. The complete port manifest covers **36 paths (24 edited, 12 new)**: 34 runtime/test/QA paths plus this plan and the appended handoff. Earliest captured baseline and raw SHA256 are recorded per path; normalized patches contain the cumulative owned changes.

Validation commands and final output:

```text
# apps/player, CI=true
npm.cmd test -- --pool=threads --maxWorkers=4 src/session/cloud/codecWorker src/session/cloud/operationalEngine src/session/cloud/operationalSession src/session/cloud/opening src/session/cloud/nativeOpeningProof.test.ts src/session/cloud/journalOpeningComparison.test.ts src/session/cloud/playableHydration.test.ts src/session/cloud/coordinator.test.ts src/session/cloud/automaticResolution.test.ts src/session/cloud/snapshotConceptCompatibility.test.ts src/session/cloud/snapshotSaves.test.ts src/session/cloud/priorRecovery.test.ts src/session/cloud/uploadRaces.test.ts src/session/cloud/gameSession.test.tsx
 Test Files  32 passed (32)
      Tests  294 passed (294)
   Duration  121.19s (transform 25.35s, setup 0ms, import 102.26s, tests 373.35s, environment 3ms)

# apps/player, CI=true
npm.cmd test -- --pool=threads --maxWorkers=4
 Test Files  464 passed (464)
      Tests  5603 passed (5603)
   Duration  786.62s (transform 33.65s, setup 0ms, import 974.43s, tests 2118.60s, environment 37ms)

# repo root
npm.cmd run typecheck
# PASS: clinical-context-workbench (client/server), player, balance-config,
# clinical-authoring, clinical-content, clinical-research, game-domain
npm.cmd run test:boundaries
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.

# apps/player
npm.cmd run build
transforming...692 modules transformed.
built in 11.53s
```

Test/build commands use the existing local offline adapter only to suppress Vite's optional Windows `net use` interface probe. The boundary adapter supplies the captured file inventory instead of invoking Git; current dependency and launcher checks are unchanged. The native tests' loopback fixture servers access no external network, database or browser storage. Node emits the existing experimental TypeScript-stripping warning; the build emits the chunk-size advisory. Neither is a failure. Full logs are under `.local-dev/cloud-open-perf-20261115/worker-delivery/`.

Manager: run the production iPhone/PWA cloud-open path on repeated cold and idle-recreated workers, plus cloud opening/recovery and worker crash/visibility cases. Verify `unacked` clears, re-post diagnostics appear under injected loss, no extra application acknowledgement/upload/operation is created, and the unchanged 30 s warning no longer appears. Browser/physical WebKit acceptance is not claimed here. An unavailable/crashing worker still uses existing bounded recovery; no transport can guarantee delivery while the page/worker is suspended indefinitely.

The earlier CPU tables remain historical matched measurements for the accepted pass. The new phone evidence identifies a separate, more compelling startup failure. All private inputs, hashes and profiles remain under `.local-dev/`; the final cumulative port manifest and scoped patch are refreshed there. No Git/network/live DB, install, agent, browser-storage or deploy action was performed.

Follow-up implementation, source audit, deterministic delivery acceptance, public production differential/budget runs and requested local validation are complete. Appended the complete worker handoff without changing its existing prefix. Manager port/review and production physical-WebKit acceptance are next; no new milestone started.
