# iPhone cloud-open memory and unclean restart mitigation — 2026-11-07

Status: runtime changes, matched memory runs and headless validation complete.
Physical iPhone/Safari acceptance belongs to the manager. The screenshot is
consistent with WebKit process termination, but this investigation does **not**
establish jetsam as the cause. No automatic page reload was added.

## Scope and evidence

Work was confined to player runtime, phone presentation, codec/session opening
and their tests. No domain, balance, clinical-content, save-format, checkpoint
schedule or progression changes; no rebind. No Git, agents, network, installs,
private-save access, browser execution, deployment or backup action. Other shared
tree edits were preserved. Source baselines, SHA256 receipts, offline harnesses
and raw logs are in `.local-dev/ios-reload-loop-20261107/`.

The entry capture contains 157 public files plus 705 domain/balance/clinical source
hashes. `owned-final-source.json` is the explicit integration scope, not a whole
working-tree inventory. `baseline.config.mts` loads captured source through a
Vite loader; it never temporarily replaces the shared working files.

## Measurement method and limits

`public-l4-fixture-inventory.json` enumerates retained public L4 states in
`tests/fixtures`. The largest is `integration-l4` from
`level-five-integration-checkpoints-20261012.json`:870,709 compact JSON bytes,
42 rooms,13 room definition types and 14 encounters. The main workload uses the
existing domain deserializer and current additive learning completion, unpauses
and selects 4 x. Absolute `*Tick` fields are
shifted to facilityTick 27,960 (Day 20), preserving relative durations and sentinel
values. It is a synthetic age shift, **not**20 days of replay or the owner's save.
The resulting state is 933,953 JSON bytes /892,694 V8-serialized bytes.

The input snapshot occupies 80,831 compressed bytes /107,776base64 characters and
934,378 uncompressed envelope bytes. Largest state fields by compact JSON bytes:
learning histories 239,852 (605 concepts), encounters 239,752, events 164,606 and
service operations 100,637. These are encoded sizes, not heap sizes.

Installed Vite produces production-mode Node 24 bundles of the actual cloud
coordinator, session, engine/view projection and codec dispatcher. The engine
and codec use separate native worker_threads. The fake transport backend runs
in a fourth realm, **excluded** from the three client heap totals. Fixture
generation runs in a separate process and is not included in open measurements.
The codec owns the fake-indexeddb adapter; journal operations cross the worker
boundary rather than using an inline memory journal. Native worker startup,
structured cloning, verification, hydration, binding, first purchase checkpoint,
durability and 240 admitted ticks at 250 ms (first 60 real seconds at 4 x) are exercised.
The ordinary checkpoint/preparation policy is preserved; only the explicit
first-checkpoint probe is requested by the harness.

Samples run every 5 ms, with forced-GC retained measurements at stage boundaries.
**Sampled peaks are estimates**, since synchronous allocations can fall between
samples and per-realm sample/GC ordering can affect combined totals. They are
not hard maxima. Retained heap and uncollected peak are different measurements.
The complete React tree, Phaser, decoded images and GPU are not mounted here.
Fake-IDB backing rows reside in the codec's JS heap, whereas browser IndexedDB
storage is external. This explains part of the codec heap growth over the minute;
it is not evidence of an unbounded product cache. Process RSS includes the fake
server, V8 code/native reservations and all harness realms; it is not an iPhone
estimate. Manager's earlier 478–534 MB dev-browser result is not comparable to this
production-bundled Node session measurement.

## Before and after

All heap values below are **decimal MB**, post-GC retained heap. Final frozen-code
matched runs: `final-before-memory.json` and `final-after-memory.json`.

| Stage | Main before → after | Codec before → after | Engine before → after | Client total before → after |
| --- | ---: | ---: | ---: | ---: |
| Verified cloud open |47.53 →47.58 |51.98 →52.02 |— |99.52 →99.60 |
| Playable session open |58.33 →51.68 |57.55 →57.56 |70.24 →55.95 |186.12 →165.19 |
| First checkpoint |61.86 →56.64 |66.19 →66.15 |69.84 →59.07 |197.88 →181.87 |
| Settled after first minute |55.11 →54.98 |100.97 →100.96 |74.67 →64.47 |230.75 →220.41 |

The entry worker context serialized 8,448,947 bytes despite both main and worker
already importing the same released catalogues. That extra context post is now
absent for the application-owned context. Main playable retained heap falls 6.65 MB;
engine playable retained heap falls 14.29 MB. Compiled static modules alone retain
about 47.2 MB main heap before any campaign is opened, repeated in worker realms.

The ordinary-mode **uncollected opening peak did not improve in this paired
sample**: aligned client heap 304.54 →341.82 MB; heap+external 415.40 →452.69 MB.
Whole-minute sampled client heap 343.73 →344.11 MB; main sampled peak 84.08 →98.02 MB.
Garbage-collection/phase overlap changes make the sum of per-stage savings an
invalid prediction of total peak. Individual verified codec peaks fall 232.22 →
201.52 MB; first-checkpoint codec 171.63 →142.92 MB and engine 141.42 →113.44 MB.
RSS 1,182.17 →1,263.66 MB also does not demonstrate a normal-mode peak reduction.
The initial pair likewise rose 315.84 →363.73 MB. Both pairs are retained; there is
no cherry-picked normal-mode peak win.

Reduced mode adds a real phase boundary: release the idle codec worker after
hydration/journal binding and before engine startup. In
`final-reduced-open-after-memory.json`, aligned sampled opening client heap is
252.10 MB (17.2% below the old 304.54 MB), heap+external 323.89 MB, and playable retained
client heap 107.62 MB (main 51.68 +engine 55.94; codec terminated). Its codec
verified-open peak is 201.88 MB; engine opening peak 192.95 MB. **This native run stops
at open.** Fake-IDB is not persistent across native worker termination, so a
first-minute run with that adapter would misrepresent browser durability. A
separate cache-discard test preserves IDB and verifies cold recovery. Browser
first-save/reload acceptance remains required.

The final harness streams worker samples as they occur so terminating the codec
does not discard the buffered hydrate/bind-phase samples. `summarize-memory.py`
includes samples through actual native termination completion, not just the
termination request. `final-measurements-summary.json` is the authoritative
aggregation; the earlier `measurements-summary.json` is an initial measurement.

Exploratory `initial-*` runs are excluded from acceptance numbers: fixture
generation and fake backend verification originally shared main, and one early
smoke run lacked the native journal. Allocation probes are attribution evidence,
not comparable wall-time/retained-memory benchmarks. Raw inputs and failed
scaffolding probes are retained for audit rather than silently overwritten.

### Older snapshot with missing learning concepts

A second opening probe uses the same shifted public L4 source **without** the
domain-deserializer/current-concept preparation:873,580 JSON /830,943 V8 bytes,
396 saved learning concepts. The existing playable boundary adds 209 missing
concepts, preserving all supplied cards/reviews. This exercises the first-open
learning/checkpoint allocation that a previously prepared fixture can miss.

| Open measurement | Before | After ordinary | After reduced |
| --- | ---: | ---: | ---: |
| Sampled client heap peak MB |405.08 |330.79 |263.89 |
| Sampled heap+external peak MB |521.91 |447.30 |338.78 |
| Retained playable client heap MB |188.09 |168.11 |108.47 |
| Main sampled heap peak MB |79.44 |72.96 |68.66 |

This older-save opening peak falls 18.3% ordinarily and 34.9% in reduced mode.
`unadapted-{before,after,reduced-open-after}-memory.json` all produce identical
raw-state SHA256:
`e6d7cc64d85a4bcb21ac74d13e6ae79dc19c190ccc8578ed364dd47086a1e502`.
These are opening-only probes; they do not substitute for reduced-mode
first-checkpoint/first-minute browser persistence measurements. One-time additive
learning checkpoint construction still runs on main; it was preserved for exact
compatibility, not removed or replaced with a fresh campaign.

Ordinary before/after runs each admit all 240 ticks and produce the identical raw
serialized state SHA256:
`5728a3ae5b9c83afd6e4736d5245e83c12a00af3478d7ce3e91c25220659f44f`.
Worker command elapsed median 22.69 →22.48 ms, p95 33.85 →33.78 ms. Those include
worker time/round trip and are **not main-thread timing**. Removing the discarded
opening warm-up makes the first real worker tick 53.00 →72.08 ms in these samples;
it remains off the main thread. No new strict 16 ms claim is made.

## Main contributors and changes

1. **Eager decoded room art.** Phone loading previously selected every unlocked
   room pack, including unbuilt endoscopy/recovery/etc. It now selects all
   dependencies/orientations for built rooms and explicit previews, plus common
   corridor/environment/frontage sources, in the same canonical asset order.
   Desktop's eager list stays unchanged. On the public L4 blueprint:
   **151 →101 sources;274,601,128 →150,644,388 nominal RGBA bytes**, a reduction of
   123,956,740 bytes (118.21 MiB). Source dimensions ×4 are a useful residency budget,
   not measured WebKit/GPU allocation. Room preview/build dependency tests still
   require every approved asset when that room is requested.
2. **Opening a chart also opened the map.** An initially covered phone map now
   defers Phaser construction until first reveal. After reveal it keeps the same
   game across covers, retaining the existing sleep/wake/input/cleanup behavior.
   A covered chart opening therefore avoids map decoding/canvas work entirely.
3. **Duplicate engine seed and catalogue.** Private app hydration can adopt its
   already-owned frozen state/recovery seed instead of structured-cloning both
   again on main. Generic callers still receive isolated copies. Only explicit
   application opt-in with actual released catalogue object identities uses the
   worker's bundled context; custom/released QA overlays still travel intact.
   Tiny guidance/session flags always travel. No learning/card registry changes.
4. **Opening-only transient allocation.** Main no longer warms evidence/path
   indexes that the engine worker owns. The worker still imports/validates its
   checkpoint and prepares required indexes, but no longer applies a discarded
   unpause/tick. Already parsed strict JSON can be compared structurally without
   two canonical string trees or another full stringify/strict-parse cycle.
   Canonical output, strict JSON/scope/hash/lineage/fidelity checks remain.
5. **Compression copies.** UTF8 buffers enter a ReadableStream directly rather
   than being cloned into another Uint8Array and then a Blob. Base64 decoding
   uses an indexed loop instead of allocating string-iterator intermediates.
   Native gzip/deflate bytes and lossless size/hash verification are unchanged.
6. **Worker overlap in reduced mode.** `releaseIdle()` refuses to run with any
   queued/active task, detaches old callbacks, terminates the idle codec realm and
   removes its timers. It changes no IDB/save data or completed operation. The
   next codec task lazily starts a fresh worker; IDs continue monotonically.
   Pending-task refusal, late replies, timer cleanup, no replay of completed work,
   exact command/learning Save & Close and cold-IDB reconstruction are tested.

Existing per-tick engine transport already sends structural state/evidence/view
patches, not whole states. Its bounded queues, operation IDs, journal-before-ack,
fallback/recovery, fencing and checkpoint policy are retained. No JSON or
full-state transport was added to ticks. Public wire snapshots remain compressed
base64 JSON; no transfer detaches a retry/journal-owned buffer. Removing internal
copies is safer here than changing that durable protocol.

An intermediate allocation probe identified remaining evidence-domain work:
~275.6 MB cumulative allocated while verifying open, including ~158.5 MB in domain
checkpoint/import construction. Those are cumulative allocations, not live heap,
and include a second 43.7 MB parse since removed by this lane. Domain evidence
construction, strict parsing, clinical catalogues and browser render-tree/GPU
residency remain material. No domain edits were made to hide those costs.

## Automatic safeguard

Only auxiliary origin-local key `gamify-surgery.phone-memory.v1` is accessed by
the guard (plus existing presentation-layout preference). A bounded record holds
version 1, opening/playing phase+timestamp, at most 2 restart timestamps and an
expiry. It contains no campaign/account/patient IDs or save bytes; typical size
is under 300 characters and records over 1024 characters are ignored.

Before phone cloud verify/hydrate/import/bind, opening is recorded once per
document. If a previous active record remains, it counts an unclean restart.
After **two such restarts within 10 minutes**, the third opening automatically uses
reduced defaults for 24 hours and persists diagnostic
`phone-memory-unclean-restarts`. Blocked storage chooses reduced defaults and
`phone-memory-storage-unavailable`. Neither case prompts, reloads, resets,
reimports or rewrites a campaign.

Hidden/pagehide clears the active marker; visible/pageshow rearms it. Late
background completions cannot mark a clean/suspended document active again.
Listeners are removed if the browser identity changes. The reduced expiry stays
through clean navigation to avoid repeatedly returning to the same crash loop.

| Phone presentation | Ordinary | Reduced |
| --- | ---: | ---: |
| Maximum backing DPR |2 |1 |
|390×844 CSS host at device DPR 3 |780×1688 |390×844 |
| Canvas RGBA backing bytes |5,266,560 |1,316,640 |
| Retired character cache soft budget |24 MiB /96 sources |8 MiB /32 sources |
| Pose-family protection |All live-family poses |Displayed/loading/fallback sources |

Reduced mode has 75% fewer canvas backing pixels. Current/inflight/fallback
sources are always pinned, even above the soft budget; cache eviction never
changes an actor's identity or simulation. Evicted unused poses can decode again,
so manager checks must cover animation churn/flicker. Existing phone 30 fps active,
1 Hz settled idle, covered/hidden sleep remain in effect. Autosave intervals were
**not** extended: five-minute/leave/Save & Close/day-end behavior is unchanged.

The marker detects an unclean document termination, not its cause. Manual reloads
or multiple phone tabs can conservatively trigger reduced defaults. It cannot
protect termination before any application JS executes, and platform cleanup may
remove auxiliary storage. These are safe false-positive/coverage limits; saves
are never removed in this path.

## Correctness and Level 5

Tests compare canonical snapshot bytes/state hashes with the previous codec
path;500 deterministic nested JSON pairs cover reordering and mutations. Native
compression output matches the old Blob-backed path. Existing long engine
differentials exercise 320 commands each on L3/L4/L5 with raw-state, delta, archive,
recovery mirror and learning equality. The matched L4 minute hash above also
compares pre-change runtime with current runtime.

All 705 captured domain/balance/clinical source hashes remain unchanged during this
milestone. Historical Level 5 result pins were not edited or rebound. The retained
accepted tuple remains **26,362 commands /6,056,335 cents /410 completions /0 walkouts**.
This milestone does **not** claim a fresh 26,362-command full journey replay.
`level5-input-audit.json` lists all 409 historically bound inputs with pinned,
entry/current hashes:31 paths already differ from old pins; none of the captured
inputs changed during this work.301 current package source paths are outside that
older input list. These pre-existing differences belong to prior/concurrent work;
do not rebind them as part of this port.

## Validation

All runs use `CI=true`, PowerShell
`npm.cmd` and `--pool=threads`. A read-only preload suppresses Vite's optional
Windows `net use` probe and blocks Git before process spawn. It changes no test
assertions, application logic or build-verifier source. PowerShell refused the
saved `.ps1` wrapper under machine execution policy; the same commands were run
inline without bypassing that policy.

Final frozen 29-source/test-path validation (raw `release-final-*.log`, numeric
`.exit` receipts and `validation-summary.json` in the evidence directory):

| Command / scope | Exact result |
| --- | --- |
| `apps/player: npm.cmd test -- --pool=threads` |Exit 1;3 failed /383 passed files (386);3 failed /3612 passed tests (3615);387.86 s |
| Root `npm.cmd run typecheck` |Exit 0;all 7 workspace scripts pass |
| Root `npm.cmd run build` |Exit 1 at existing application-boundary Git inventory, blocked **before spawn** |
| `npm.cmd run build --workspace @gamify-surgery/player` |Exit 0;1033 modules;built in 3.88 s |
| Focused phone/lazy-art/L5-assets/session |4 files /40 tests pass;11.76 s |
| Focused cold codec-cache recovery |1 file /1 test pass;5.35 s |
| Focused JSON/seed/snapshot compatibility |3 files /17 tests pass;6.65 s |
| Captured-entry control on 6 relevant files |3 failed /3 passed files;3 failed /53 passed tests (56);21.04 s |

```text
Test Files  3 failed | 383 passed (386)
     Tests  3 failed | 3612 passed (3615)
  Duration  387.86s
```

The full-suite failures are all reproduced by captured pre-change runtime/tests:

- `src/session/breadButterPresentation.test.ts:78`: current clinical profile has
  3 choices; old assertion expects 4.
- `src/session/levelFiveRoomsViewModels.test.tsx:57`: current gym/Break Room
  benefit note does not match the old sales/ownership-note regular expression.
- `src/session/cloud/separateCampaign.test.ts:54`: the large retired-encounter
  case exceeds the existing codec JSON-string limit (`codecJson.ts:63`).

The manager's earlier 4-failure baseline is not the current captured baseline;
this epoch reproduces 3. No off-lane assertion or product changes were made to
remove them. The first run also had 4 intentional-contract failures from this lane
(two blanket localStorage checks and two eager-art expectations); those were
fixed by asserting **only** the auxiliary marker key is permitted and every
built/explicit-preview asset is still complete. The original save-write and
approved receipt/hash protections remain.

Seven passing typechecks: clinical-context-workbench (client+server), player,
balance-config, clinical-authoring, clinical-content, clinical-research and
game-domain. Root build's exact blocker is:

```text
Application boundary verification failed:
- Could not inspect tracked paths: Git blocked before spawn: No Git required.
```

`package.json`, `scripts/verify-app-boundaries.mjs` and `apps/player/vite.config.ts`
are byte-identical to entry. No Git was run and the verifier was not bypassed.
The independent player bundle retains existing large-chunk and ineffective
dynamic-import warnings. Manager must run the root boundary/build chain in its
authorized environment before release.

## Files changed and integration scope

The exact 29 paths, raw baseline/final SHA256 and disposition are in
`integration-paths.json`; `owned.patch` contains only their normalized hunks.
There are 15 runtime/helper files and 14 test files,6 new and 23 existing:

- `apps/player/src/facility/`: `FacilityCanvas.tsx`, its lifecycle test and the
  narrow lazy-selection assertion in `approvedLevel5Rooms.test.ts`.
- `apps/player/src/mobile/performance/`: new `phoneMemoryPolicy.ts` and test;
  `presentationPolicy.ts`, `characterTextureBudget.ts`, `roomAssets.ts`, and
  `canvasResolution`, `characterTextureBudget`, `lazyArt`, `roomAssets` tests.
- `apps/player/src/session/cloud/`: `operationalEngineClient.ts`,
  `operationalEngineProcessor.ts`, `operationalEngineProtocol.ts`,
  `operationalSessionEngine.ts`, `gameSession.ts` and its two storage assertions;
  `codecWorker.ts`, `codecTasks.ts`, `codecCompression.ts`, `snapshotCodec.ts`,
  their tests; new `codecWorkerJsonEqual.ts` and test,
  `operationalEngineMemory.test.ts`, `codecWorkerMemoryRecovery.test.ts`.
- Coordination only: this report, `docs/execplans/ios-reload-loop-20261107.md`
  and an additive prefix in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

No coordinator/transport source, domain/content, UI component, manifest, gate,
receipt, bound fixture, launcher or opening origin was modified. Demand loading
is not room-image eviction: touring previews/building more room types can still
increase residency up to the finite approved catalogue. The complete built art
set and compiled catalogue in multiple realms remain significant phone risks.

The safeguard responds to new document starts. A loading loop inside a single
still-running document has a different cause; manager should confirm navigation/
document lifetime and inspect the recorded problem trace before concluding jetsam.

## Manager browser acceptance

Run the installed existing suites through `npm.cmd run test:e2e --`:

- `tests/e2e/cloud-saves.spec.ts tests/e2e/cloud-recovery.spec.ts --project=desktop-chrome`
  (including their own phone contexts), covering Save & Close, day-end, hidden/
  pagehide, reload/recovery, lost acknowledgements, writer fencing and conflict.
- `tests/e2e/phone-ui-space.spec.ts --project=phone-chrome` and
  `tests/e2e/event-message-board-lifecycle.spec.ts --project=phone-chrome`.
- Desktop art/input regression set: `character-still-loading-scale.spec.ts`,
  `character-resolution-zoom.spec.ts`, `character-stills-glide.spec.ts`,
  `clinic-income-popups.spec.ts`, `build-mode-usability.spec.ts`,
  `map-click-info.spec.ts`, with `--project=desktop-chrome`.

Additional physical-iPhone checks are required:

1. Open a realistic L4 Day 20 cloud save, first checkpoint and 60 seconds at 4 x;
   capture **combined main+both-worker** memory and WebKit process termination
   diagnostics. Compare normal/reduced modes. Repeat 20–30 minutes for heat/memory.
2. Simulate two unclean document restarts while visible using only the auxiliary
   marker. Confirm automatic third-opening `data-phone-memory-mode="reduced"`,
   diagnostic code and DPR 1, with no prompt. Compare original save bytes/learning
   and recovered command prefix. Hidden/pagehide/BFcache must clear/rearm safely.
3. In reduced mode verify idle codec termination, then an actual persistent-IDB
   journal commit, checkpoint, Save & Close and reload. Headless fake-IDB worker
   termination cannot substitute for this browser persistence check.
4. With a chart initially open, confirm Phaser is not constructed until first
   map reveal; close/reopen charts without duplicate canvases/listeners. Confirm
   first placement/preview of an unbuilt unlocked room loads every dependency,
   including all L5 tiers/orientations/decor. Test failed images/procedural fallbacks.
5. Measure actual backing size for a 390×844@3 host in both modes, pointer mapping,
   pan/zoom/Build and first-reveal layout. Confirm character retired-source bounds,
   pinned active poses, offscreen return and decode churn without flicker.

Owner pathways are unchanged: the reported remote origin is
`https://melissarowlandc-afk.github.io/GamifySurgery/`; local owner playtesting uses
`START_GAME.cmd` and `http://127.0.0.1:4173` in the intended persistent profile.
Those origins have separate browser storage. This work is local-only; manager
owns review/integration and release acceptance.
