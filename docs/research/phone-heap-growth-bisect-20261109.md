# Phone heap growth release bisect — 2026-11-09

Status: implementation, complete Day 20 matrix and headless validation complete. Browser/iPhone acceptance remains required.
The owner's sign-in/loading loop is **not established as jetsam**, and this work
does not establish that memory caused the sign-out.

## Result and scope

The largest reproduced retained-heap increase is the statistics release
`de270ecd`: approximately 0.8 MB per production runtime realm, or 1.2 MB when
retaining the entire clinical export namespace. The full historical increase is
about 1 MB/production realm and 1.45 MB/full-export realm. Neither reproduces the
manager's approximately 60–80 MB Chrome development-page difference. It would be
incorrect to attribute that entire browser difference to those content changes.

There is nevertheless substantial avoidable catalogue assembly work at startup.
The new production build evaluates the unchanged public clinical pipeline in a
short-lived **build** worker, including validation, manifest gating and retained
version checks. The shipped page, operational worker and codec worker receive
only their consumed runtime data and the original schemas. No authored clinical
file, manifest, acceptance, frozen encounter, concept identity or learning card
is changed. No domain, cloud coordinator/transport, save format, command ordering
or checkpoint policy edit. No rebind. Existing pan/zoom and phone texture fixes
are retained.

The restart guard now has a separate, bounded IndexedDB mirror and earlier
conservative defaults. It does not delete, rewrite or read a campaign/auth record,
reload the page, display a dialog, or request persistent-storage permission.

Evidence is in `.local-dev/phone-heap-growth-bisect-20261109/`. `entry.json`
captures 1,811 source/config/document paths, including 1,006 package paths.
Historical `trees/<commit>/` and `<commit>-source.json` were read with authorized
read-only Git object commands. The shared tree, Git history and GS-release were
not replaced. No private save, network, installs, agents, browsers, commits,
pushes, deployment or backup action.

## Measurement method

Installed Vite builds production-mode, minified Node bundles of the actual cloud
coordinator/session, native operational engine, view projection and codec. Engine
and codec run in separate `worker_threads`; the fake server is a fourth realm,
excluded from client heap totals. The public fixture is prepared in a separate
process. The main thread does not retain its uncompressed generation input.
The codec uses fake-indexeddb with the actual journal adapter; message transfer,
verification, hydration, journal binding/durability and the first explicit
purchase checkpoint execute through the real boundaries.

Each release/fixture gets a fresh process. The workload admits 240 real commands
at 250 ms intervals, representing the first minute at 4×. It reads the actual
worker-projected player view cache. Main/worker samples run every 5 ms; forced-GC
measurements are taken at stage boundaries. Reported **MB are decimal**
(`heapUsed / 1,000,000`), not MiB. Sampled peaks are estimates, not hard maxima;
synchronous allocations can fall between samples. Module-import raw heap is
also recorded before the first forced GC. Startup before that observation can
have a higher transient peak.

The final synthetic fixtures use `getFacilityClock(...).operatingMinutesPerDay`
(600) to shift absolute tick fields to **11,760, Day 20 minute 360**. The minute
ends at tick 12,000/Day 21, exercising the existing day-end save as well. This is
an age-shifted public state, not 20 days of replay or the owner's save.
L4 is `integration-l4` (42 rooms); L5 is `integration-build` (87 rooms), both from
`tests/fixtures/level-five-integration-checkpoints-20261012.json`, with 14 saved
encounters. Current prepared JSON sizes are 933,625/944,306 bytes; V8 serialized
sizes 892,790/902,326 bytes. Current additive concept completion runs normally.

Before the settled sample, the harness waits for warming, flushing, compaction,
coordinator preparation/upload/local queue work, then 500 ms of quiet. It does
not pause, change clock policy, force another checkpoint or skip commands.
Native harness teardown awaits session detach before terminating realms.

Limits: no React DOM, Phaser rasterization, decoded images, GPU/compositor memory,
browser module loader or physical WebKit process is mounted. Fake-IDB durable
rows live in codec JS heap; real browser storage has different ownership.
Process RSS includes the fake server and native/V8 reservations and is not an
iPhone estimate. Thus this is an isolation of runtime/data cost, not a browser
heap bisect or proof that the owner's loop is fixed.

### Per-release Day 20 measurements

**L4.** Each cell is main / codec / engine heap MB. Peak columns are independent realm maxima, not a simultaneous total.

| Source | Playable open | First checkpoint | Settled after minute + day end | Sampled peak (including raw main import) |
| --- | ---: | ---: | ---: | ---: |
| 46e19b2f | 51.26 / 57.44 / 55.58 | 56.18 / 66.02 / 58.68 | 56.91 / 120.76 / 62.48 | 177.95 / 204.35 / 170.12 |
| d0320cb1 | 51.39 / 57.57 / 55.72 | 56.30 / 66.17 / 58.82 | 56.64 / 120.89 / 62.61 | 179.32 / 204.47 / 192.13 |
| de270ecd | 52.20 / 58.38 / 56.51 | 55.59 / 66.96 / 59.62 | 57.77 / 121.68 / 63.39 | 141.66 / 205.89 / 198.89 |
| 4323143a | 52.16 / 58.35 / 56.51 | 57.08 / 66.94 / 59.62 | 58.26 / 121.67 / 63.34 | 161.53 / 204.36 / 201.19 |
| 9439b199 | 52.19 / 58.42 / 56.53 | 57.11 / 67.03 / 59.65 | 58.31 / 121.74 / 63.37 | 179.40 / 205.88 / 201.62 |
| entry | 52.20 / 58.42 / 56.52 | 57.11 / 67.05 / 59.63 | 58.30 / 120.17 / 63.41 | 142.18 / 205.82 / 201.53 |
| after | 45.02 / 51.28 / 49.25 | 49.92 / 59.96 / 52.49 | 51.24 / 115.09 / 56.65 | 107.13 / 171.21 / 131.50 |

**L5.** Each cell is main / codec / engine heap MB. Peak columns are independent realm maxima, not a simultaneous total.

| Source | Playable open | First checkpoint | Settled after minute + day end | Sampled peak (including raw main import) |
| --- | ---: | ---: | ---: | ---: |
| 46e19b2f | 51.39 / 57.57 / 56.20 | 56.31 / 66.52 / 59.75 | 56.64 / 132.14 / 66.20 | 162.10 / 207.98 / 192.32 |
| d0320cb1 | 51.51 / 57.73 / 56.34 | 56.43 / 66.66 / 59.89 | 56.68 / 132.28 / 66.32 | 136.03 / 206.25 / 192.68 |
| de270ecd | 52.33 / 58.51 / 57.14 | 57.25 / 67.46 / 60.69 | 57.59 / 133.07 / 67.12 | 161.44 / 210.74 / 173.93 |
| 4323143a | 52.29 / 58.52 / 57.15 | 57.21 / 67.45 / 60.69 | 57.88 / 133.07 / 67.09 | 140.70 / 210.33 / 173.49 |
| 9439b199 | 52.33 / 58.56 / 57.16 | 57.24 / 67.53 / 60.70 | 57.89 / 133.13 / 67.06 | 167.37 / 210.82 / 173.38 |
| entry | 52.32 / 58.57 / 57.16 | 57.24 / 67.54 / 60.70 | 57.90 / 133.15 / 67.09 | 190.51 / 215.42 / 173.22 |
| after | 45.15 / 51.42 / 49.89 | 50.06 / 60.49 / 53.61 | 51.35 / 126.50 / 60.43 | 107.21 / 193.23 / 134.80 |

Every fixed realm's open, first-checkpoint and settled measurement is below its
November 7 control. Summed post-GC client heap after the minute is approximately
241.88→222.98 MB L4 and 258.14→238.28 MB L5 against captured entry. Sampled maxima
also fall, but raw main import observations vary substantially between otherwise
similar releases (for example current L4/L5 142.18/190.51 MB). Collection timing
and transient startup work can therefore move an uncollected reading greatly.
That is an inference from this Node experiment, **not** an attribution of the
historical Chrome gap. Browser main heap ≤492–515 MB is not established here.


### Catalogue attribution and actual production bundles

The standalone full-export probe intentionally retains the clinical namespace,
including historical authoring views. It approximates the retention obligations
of unbundled development ESM; it does not pretend to be a complete Vite page.

| Source | Full-export post-GC heap MB | Exported release views | Final live release JSON bytes |
| --- | ---: | ---: | ---: |
| 46e19b2f |124.654 |36 |7,973,364 |
| d0320cb1 |124.838 |39 |7,958,357 |
| de270ecd |126.053 |42 |7,800,042 |
| 4323143a |126.056 |42 |7,800,042 |
| 9439b199 |126.104 |45 |7,798,214 |
| projected runtime values |29.336 |1 |7,798,214 |

The live release has 1,141 cases; concepts go from 605 to 606 with flags3.
Statistics shortens the live payload; its extra retained source/revision/evidence
views account for most of the small reproduced increase. The sum of serialized
release exports is approximately 222 MB, but **is not heap size**: historical
views share references/strings. The full-export heap table measures actual
retention instead of adding those serialized sizes.

The 4323143a source changes add desktop shade/camera bookkeeping and denser
markup/CSS, not an additional phone world container or room atlas. This Node
workload has no DOM/CSS, so its near-zero delta cannot rule out a browser-only
layout/DOM cause. The 9439b199 repair path returns the original state when its
derived diagnostic numbers are valid; normal fixture opening does not retain a
new full-state repair clone. Unsafe legacy repair remains unchanged and covered
by existing player tests. It is not justified to remove that correctness repair.

Matched complete player **production builds**, with the entry source loaded via
a read-only plugin for the before build:

| JavaScript payload | Captured entry bytes | Fixed bytes | Reduction |
| --- | ---: | ---: | ---: |
| main index |23,608,172 |16,223,357 |7,384,815 |
| codec worker |14,557,460 |7,154,272 |7,403,188 |
| operational worker |15,018,977 |7,634,955 |7,384,022 |

These are uncompressed bytes, not heap. `baseline-player-bundle.json` and
`fixed-player-bundle.json` include exact payload sizes/hashes. The emitted main
and both workers contain the projected data; this is not a harness-only switch.

## Runtime projection and correctness

`scripts/vite/runtime-clinical-data.ts` discovers named value imports in player
and domain runtime sources. Schemas stay in the original schema module. A
self-contained build bundle evaluates the original public catalogue; an
ephemeral worker encodes only consumed data, then terminates. Private-module
boundary checks also run inside this build. The worker validates data before
posting, so non-data exports cannot be silently lost by structured cloning.

`runtime-clinical-graph.ts` preserves object sharing, property insertion order,
undefined properties, sparse arrays, null prototypes, safe own `__proto__` data
and signed zero. Functions/accessors/non-finite/exotic data fail closed. The
browser decoder uses ordinary existing JavaScript APIs, no build-time worker,
eval, network or model call. Its temporary string/row tables become unreachable
after initialization. It adds no per-tick work or session-length cache.

The plugin is deliberately **production-build only**, including worker builds.
Vitest and the development server still evaluate the original pipeline. There
is no generated clinical file to drift or rebind, and no new development
automatic-reload handler. A development-server heap measurement is therefore
not an acceptance measurement for this optimization.

Focused tests strictly compare every consumed runtime export, including all old
timing bindings, against the original source values and JSON bytes. They exercise
the emitted initializer as well as alias/cycle/key-order/undefined/sparse/signed-
zero cases. Actual native-worker final-state hashes are compared with the
captured current path for both fixtures. Final results are recorded below.

- L4: all 240 commands advance; captured/current and fixed final state SHA256 both `a926c49c54008ee694d0f5c2f7d782f5175fb808c443d05bb02b9a6e24c2d815`.
- L5: all 240 commands advance; captured/current and fixed final state SHA256 both `a864c6d0ae187e0c0494b42e8db10c9f7ea39349e085cdd6acc01d91d5afc45c`.

Native JSON state equality is exact at the end of each matched run, not a
comparison of only money/completion counters. The projected clinical values
also pass strict full-data equality, including historical timing rows.

### Level 5 bindings

This lane changed **no** domain, balance or clinical package input. It did not
edit or rebind `tools/qa/level-five-integration-results-20261012.json` or the
checkpoint fixture. The main tree's existing pinned tuple remains
**26,362 commands / 6,056,335 cents / 410 completions / 0 walkouts**.
Historical release commit messages describe separate release rebinds to
26,531/6,019,042/412/0; those are not imported back into this tree.

The full list of 409 bound inputs remains in that existing artifact's `inputs`.
Its current file SHA256 is
`dead50020355be0bc328ff4557cd40199763097a8aa01baa3f8944d22492a8d5`.
`level5-bound-input-audit.json` lists 102 pre-existing bound/current mismatches
with both hashes. The captured-entry package audit proves none was introduced
here. No fresh full Level 5 journey/rebind is claimed; consumed-data equality
and the matched cloud command runs test this change without rewriting an
unrelated bound artifact.

## Automatic restart safeguard

Primary storage is the existing auxiliary localStorage key. Independent mirror:
IndexedDB database `gamify-surgery.phone-health.v1`, store `health`, one `restart`
row of at most 1,024 characters. Only phase/timestamps, at most two recent
incident times and reduced-mode expiry are accepted; unknown fields are stripped.
It never opens a save/auth database. Reads/writes have bounded timeouts; a delayed
older document cannot replace a newer timestamp. Writes coalesce to one in-flight
plus one latest pending string, not a growing queue. No per-tick write.

- One unclean **opening** now reduces memory on the next opening. Two unclean
  **playing** sessions within ten minutes retain the existing trigger. Reduced
  defaults remain sticky for 24 hours.
- Missing local marker plus pending IDB lookup selects conservative defaults
  immediately; a recovered active durable marker records
  `phone-memory-marker-recovered` and keeps reduced mode.
- A fresh standalone/home-screen phone with no valid local marker starts reduced
  immediately, even if **both stores were evicted**. Diagnostic:
  `phone-memory-fresh-standalone`. IDB denial cannot bypass standalone detection.
- Existing reduced defaults: DPR 1, 8 MiB/32 character-texture soft budget and no
  keep-all-live-family preference; normal remains DPR 2, 24 MiB/96. Existing idle
  codec release policy consumes the profile unchanged. No autosave interval edit.
- Hidden/pagehide clears active incidents; visible/pageshow rearms. A late read
  or worker completion cannot reactivate a hidden page. Cleanup closes auxiliary
  connections/removes listeners; storage failure emits a bounded diagnostic.

IndexedDB is independent of localStorage, **not immune to origin-wide eviction**.
The conservative fresh-standalone default covers the absence of both markers;
it does not claim to infer a crash from a missing record. A legitimate new home-
screen install will also start at lower resolution for 24 hours. This is an
intentional automatic default, not a clinical/save behavior change. A background
termination after a clean visibility event may leave no crash evidence.

## Validation

The full suite and memory matrix cover the catalogue/runtime changes. Final
review then hardened only the auxiliary IDB transaction callback after timeout:
ignore late success and catch an inactive-transaction write. Its new regression
test, all focused tests, seven types and root build passed afterward. The full
suite was not repeated after that narrow auxiliary follow-up; it is not executed
in the Node memory runs (no window/phone-health DB). PowerShell, installed
dependencies only, `CI=true` for player Vitest:

```text
apps/player: npm.cmd test -- --pool=threads
Test Files  4 failed | 400 passed (404)
Tests       4 failed | 4015 passed (4019)
Start at    01:16:58
Duration    426.37s (transform 25.85s, setup 0ms, import 693.47s,
                    tests 964.11s, environment 32ms)
exit 1

focused after timeout follow-up: 3 files passed, 18 tests passed
Duration 4.15s (transform 2.03s, setup 0ms, import 3.37s,
                tests 853ms, environment 0ms)
exit 0

captured-entry baseline control: 4 files failed; 4 tests failed, 23 passed (27)
Duration 10.98s
exit 1

repo root: npm.cmd run typecheck
seven workspace typecheck commands passed
exit 0

repo root: npm.cmd run build, native attempt
Application boundary verification failed:
Could not inspect tracked paths: spawnSync git EPERM
exit 1

repo root: npm.cmd run build, exact-inventory child-launch adapter
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
seven workspace typecheck commands passed
668 modules transformed
built in 6.67s
exit 0
```

The sandbox forbids Node spawning Git, although the shell can perform authorized
read-only Git reads. The adapter serves the fresh byte-exact result of
`git ls-files -z` only to the unmodified boundary verifier's identical command.
It does not omit a check, fake a clean tree, or change a source/test. Captured
inventory/hash and adapter source are in the evidence directory. Manager should
rerun ordinary root build outside that sandbox. Full exact logs and exit receipts
are retained; existing dynamic-import/chunk-size and plugin-time warnings remain.

| Baseline failure | Evidence/classification |
| --- | --- |
| `breadButterPresentation.test.ts:78` | expects four choices, receives three; reproduced on entry |
| `chartStructuredFields.test.tsx:129` | HTML escaping expectation; reproduced on entry |
| `levelFiveRoomsViewModels.test.tsx:57` | gym note regex; reproduced on entry |
| `cloud/separateCampaign.test.ts:54` | legacy JSON string exceeds codec limit; reproduced on entry |

No new player failure. Root build, types and focused tests were run on the final source;
the source-scope receipt distinguishes unrelated pre-existing dirty files.

## Files and manager acceptance

Changed: `apps/player/vite.config.ts`,
`apps/player/src/mobile/performance/phoneMemoryPolicy.ts` and its test.
New: `phoneHealthStorage.ts` and test, `runtimeClinicalData.test.ts` in that
performance directory; `scripts/vite/runtime-clinical-data.ts` and
`runtime-clinical-graph.ts`. Documentation: this report, matching ExecPlan and an
additive current-thread handoff. `final-source-manifest.json`/`final.patch` give
the precise integration scope and SHA256s. Do not copy the historical scratch
trees or unrelated question/domain/UI edits into a release.

Manager browser checks (not run here):

1. Build the existing production QA preview and run
   `playwright.map-phone-memory.config.ts` (four normal/reduced L4/L5 cases).
   Compare GC-normalized and uncollected main heap separately, worker heaps,
   opening/checkpoint peaks, decoder/texture memory and fixture provenance.
2. Run `cloud-saves.spec.ts`, `cloud-recovery.spec.ts`, the production pan/zoom
   performance set and character/picking/build/shade checks. Verify cold codec
   restart, worker fallback, Save & Close, day-end and reload recovery.
3. Physical iPhone standalone: fresh auxiliary stores, localStorage-only loss
   while keeping health IDB, both auxiliary stores absent, denied IDB, unclean
   opening, clean hide/show and ordinary sign-in/cloud opening. Check diagnostics
   and DPR 1 before art allocation. Do not clear real saves for this test.
4. On an actual loading loop record `location.origin`, document `timeOrigin`,
   diagnostic boot identity and auth/cloud phase. A stable document needs
   auth/coordinator investigation; a new document is consistent with termination
   or navigation but does not itself prove jetsam. Use the same fixture, mode,
   collection policy and idle interval for historical browser comparisons.

Owner pathways are unchanged: `START_GAME.cmd`, exact `http://127.0.0.1:4173`
in the persistent profile, and the canonical GitHub Pages origin. QA production
preview `127.0.0.1:5186` has separate disposable storage. Nothing was deployed.
Remaining risks: unexplained browser-only heap delta/loop, complete WebKit/GPU
peak, the pre-existing oversized art/aggregate texture budget documented in
`map-pan-zoom-phone-memory-20261109.md`, and catalogue/schema copies still needed
in separate realms. Production projection does not reduce development ESM heap.

## Retained exploratory evidence

Original unprefixed matrix/`idle-*` controls use the inherited Day 47 fixture;
their within-pair comparisons remain useful but are not the final Day 20 table.
First `settled-*` scaffolding did not wait for compaction/rebase and raced teardown;
those two harness processes were stopped and those rows excluded. Initial smoke
also exposed duplicate Windows slash module IDs in the scratch resolver; it was
fixed before the matrix. No such resolver edit was made to the product. Original
failed scaffolding logs were retained. Final acceptance rows are `day20-*` only.
