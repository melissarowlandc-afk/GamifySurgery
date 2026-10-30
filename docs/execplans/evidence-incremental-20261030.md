# Incremental game evidence - Milestone A (2026-10-30)

**Status:** worker implementation and in-lane verification complete; manager review/canonical evidence rebind pending. No Git backup or publication.

## Goal and requirements

Remove campaign-history work from each account command/facility tick while preserving gameplay, scoring, clinical content, IDs, save schemas, evidence ordering, finance/learning chains, hashes and saved bytes. Owner-approved 2026-10-30. Milestone B (worker/storage/encoding/save policy) remains separate. Five-minute fallback, leaving/Save & Close behavior and current UI are unchanged.

Profile first; benchmark Level 1 and existing Level 5 fixtures at 100/1,000/10,000 prior transitions; preserve the original as a differential oracle; prove the 26,710-command run and closing 5,818,501 cents; run domain/player/codecs, original generators without rewrites and seven typechecks; provide exact bound inputs for manager rebind.

## Constraints, ownership and repository state

Bounded Codex worker assignment. No agents, Git commands, installs, network, commits, deploy/publication or external messages. Node worker threads below are test execution, not agents. Preserve concurrent/paused question-pilot work. No clinical/question files, existing test bindings, player files, reducer/capture code or dependency/configuration changed.

Initial file hashes/copies were captured without Git. Of 1,359 monitored initial files, only the two assigned existing evidence source files changed. All unrelated files remain byte-identical, including the paused worker's inputs. Three runtime files total: two modified plus one new index/normalization helper. Exact 16 owned files are listed below; ignored diagnostics are confined to `.local-dev/evidence-incremental-20261030/`.

## Milestones and acceptance

- [x] A1: inspect audit/callers/fixtures; preserve original; run pre-edit baseline.
- [x] A2: incremental indexes/log/state/projections, exact running-tip checks and branch-safe undo; focused validation.
- [x] A3: full old/new replay, seeded fuzz, code/codec suites, generators, seven typechecks and controlled after benchmark.
- [x] A4: inspect scoped diff, audit ownership/hashes and append manager handoff.

**Canonical artifact caveat:** old/new application equality on the initial shared-tree inputs passes. Existing published Level 5 artifacts already drift from those inputs: four unrelated M9 source bindings and 56 M8 fingerprints were mismatched at task start. The ordinary unchanged M9 generator also fails historical checkpoint bytes. These artifacts/bindings were deliberately left untouched for the manager and paused question worker. This is not a green canonical artifact rebind.

## Implementation and decisions

Trusted immutable checkpoints retain a private hydrated state, projected state/learning tip, persistent content/operation/record/receipt/reversion indexes and an immutable append log. New commands extend these without importing, copying or reconciling the archive prefix. Fixed-depth compressed hash tries copy only their changed paths; exact string comparisons handle hash collisions. Operation retries and independent checkpoint branches preserve the former behavior.

Evidence projection and resolution reuse unchanged structures. Plain-JSON normalization removes the evidence layer's whole-state stringify/parse round trips; tree equality uses reference/primitive shortcuts. Projection rebasing preserves the import source's patch/key-order semantics. Private hydrated data never aliases the mutable public reducer result. New transitions enforce finance range/delta, immutable pins, concept membership, review-prefix/card coupling, unique operations and the previous chain tip. Full import/export/codec verification still validates the complete chain and reference budgets.

Record and patch arrays are materialized as ordinary frozen arrays at checkpoint boundaries using enumerable getters. Native structured cloning works; there are no proxies, new serialized properties or schema changes. Build Undo walks the changed command suffix; unusual imported orphan chains keep compatible fallback behavior, including first-match retries before malformed orphans.

**Remaining boundary costs:** full checkpoint materialization/native cloning and full codec preparation still grow with history. The current player requests them after command batches; removing those repeated crossings belongs to B. The unchanged reducer still clones/simulates operational state, and normalization inspects its output to recover sharing. This proves removal of archived-history dependence from warm evidence application, not O(change) for all simulation/encoding/rendering or a native iPhone freeze fix. No player call-site adaptation was required.

## Final validation results

| Check | Exact result |
| --- | --- |
| Full old/new Level 5 proof | 26,710/26,710 commands; 11 continuous intervals; complete result deep equality every step; exact state/snapshot/appended bytes and full checkpoint byte checks; closing 5,818,501 cents; native exit 0 |
| Proof source stability | All 505 monitored source/input hashes unchanged throughout the final proof |
| Seeded differential fuzz | 880 commands: four early-game seeds x160 plus three existing Level 5 checkpoints x80; equality/byte assertions every step |
| Focused evidence/undo/differential | 41 passed, 1 optional full-replay skip, 3 files; full replay executed separately above |
| Full game-domain | 4,327 passed / 1 source-binding failure / 1 optional skip = 4,329 tests, 164 files; CI=1/threads/maxWorkers=2; no timeout remains |
| Full player | 3,098/3,098, 299 files, zero pending; required preload, threads/maxWorkers=2; explicitly captured npm native exit 0 |
| Module-worker boundary regression | 16/16 passed; primitive comparisons perform no main-thread JSON serialization |
| Codec compatibility/equivalence | 8/8 gzip/deflate cases: Level 1, two frozen Level 5 saves, legacy Level 4; exact encoded bytes/manifest/transport hashes; old encodings decode |
| Seven workspace typechecks | All 7 pass, native exit 0 |
| Original M9 generator | 26,710 commands, closing 5,818,501 cents; original gameplay assertions pass; historical checkpoint comparison fails at integration-l4 (pre-existing drift); no rewrite |
| Original lower generator | Pass; two intercepted writes byte-equal to existing artifacts; 0 evidence files rewritten |
| Original M8 generators | All 3 supported seed selections finish, native exit 0: 36 economy +4 pacing, 0 evidence files rewritten; all original assertions/source-stability checks pass |

The existing M9 binding test fails first on clinical-content `answer-choice-timing.ts`, which is byte-unchanged from task start. The proof's optional `--historical=report` records all eight current-vs-published checkpoint hashes instead of conflating prior pilot drift with the mandatory old/new comparison. All eight published checkpoint bytes differ; all four published M8 pacing summaries also differ. Their generator paths use the unchanged reducer and unchanged initial data, so these are pre-existing artifact/input differences, not A behavior changes. Do not silently replace or promote draft content.

The frozen oracle is the original evidence and JSON implementation (only header/import paths differ), pinned by tests to source hashes `82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0` and `c123e617124936a4b846369dc68592c810503b0779ae33a3ef5c4bd82a8a1650`. Its shared reducer is byte-unchanged: `ef966d7a3dc5f8fdbf2e27110a764fb0804c4041766a1024cf55dd3a591f5e9d`.

Full command-stream SHA-256: `788674b303f33ae58ad94faa75fca4171ae12fdc9026654aa3982c1183a11813`. Final old/new checkpoint SHA-256: `614cec135673bb51b10e3fbf72894eb8be5b7d0cda47e190657722de6ccd5c3e`. Full capture/proof duration: 9209.466 s. Exact interval start/end hashes and historical comparisons are in `full-proof-final/full-replay.json`.

## Benchmark method

The pre-edit original run is retained as `before.json`. Authoritative matched final reports are `before-controlled.json` / `after-controlled.json`, using the same final harness and identical source/input hashes; the before implementation is the pinned original oracle. Node v24.19.0, Windows x64, AMD Ryzen 7 9700X. Three warmups, three batches of 12 operations; reported wall time is the median batch mean.

The primary experiment holds an existing integration-running Level 5 operational fixture, and a small synthetic Level 1 campaign, fixed while adding a valid finance/learning-neutral journal prefix of 100/1,000/10,000 transitions. This isolates archive history from growing facility state; it is not a claim that the neutral padding was earned by the driver. Each measured command/tick executes the real boundary/reducer. Cold adoption, native clone/materialization, explicit full verification and reducer-only time are separately reported. V8 allocation sampling (1,024-byte interval, including collected objects) runs separately from wall timing; these are allocated-byte estimates, not retained/peak memory or exact allocation counts. Desktop timings are not native iOS acceptance.

Only the verified task generator was briefly suspended for matched benchmark conditions and automatically resumed in finally (native status 0). Subsequent validation jobs used per-process masks on separately enumerated physical cores; original masks/exact owned commands are recorded in `validation-affinity.json`. No unrelated process or machine power setting changed. These validation processes have exited; process-only settings disappear with them.

## Before/after benchmark tables

Each cell is **before -> after**; wall time is milliseconds per operation.

| Prior transitions | Level 1 command | Level 1 tick | Level 5 command | Level 5 tick |
| ---: | ---: | ---: | ---: | ---: |
| 100 | 8.178 -> 1.120 | 10.342 -> 2.331 | 72.834 -> 8.855 | 190.013 -> 112.646 |
| 1,000 | 12.732 -> 1.008 | 15.780 -> 2.157 | 78.276 -> 9.397 | 194.839 -> 113.448 |
| 10,000 | 54.592 -> 0.965 | 56.848 -> 2.215 | 128.123 -> 9.512 | 244.703 -> 110.671 |

V8 sampled allocations, **MiB allocated/op**, before -> after:

| Prior transitions | Level 1 command | Level 1 tick | Level 5 command | Level 5 tick |
| ---: | ---: | ---: | ---: | ---: |
| 100 | 21.47 -> 1.57 | 26.57 -> 4.23 | 194.98 -> 13.09 | 616.30 -> 393.65 |
| 1,000 | 30.88 -> 1.55 | 35.89 -> 4.21 | 204.42 -> 13.16 | 626.38 -> 393.66 |
| 10,000 | 123.68 -> 1.53 | 129.17 -> 4.15 | 302.67 -> 13.19 | 723.99 -> 393.87 |

OLS slope, **ms/op per additional 1,000 prior transitions**:

| Workload | Before | After |
| --- | ---: | ---: |
| Level 1 command | +4.6732 | -0.0113 |
| Level 1 tick | +4.6430 | -0.0044 |
| Level 5 command | +5.5660 | +0.0446 |
| Level 5 tick | +5.5308 | -0.2437 |

Warm command cost is essentially flat within measured variation. At history 10,000, Level 5 commands improve **13.5x**, ticks **2.2x**. The unchanged heavy tick reducer still costs about **101 ms**; its speed command about **5.7 ms**.

Full native checkpoint cloning/materialization remains history-dependent (after, ms):

| Prior transitions | Level 1 command / tick | Level 5 command / tick |
| ---: | ---: | ---: |
| 100 | 1.115 / 0.961 | 10.736 / 10.875 |
| 1,000 | 2.357 / 2.405 | 13.174 / 12.404 |
| 10,000 | 16.774 / 16.420 | 26.066 / 25.664 |

## Bound inputs for manager rebind

No Level 5 evidence or binding file was edited. Exact expected current hashes:

| Runtime input | Original/status | Expected current SHA-256 |
| --- | --- | --- |
| `packages/game-domain/src/game-evidence.ts` | `82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0` | `9c133bb6a0f82c336be0e60e37c89d162a0b7af4b115e5808e6acca242b6f0c5` |
| `packages/game-domain/src/game-evidence-json.ts` | `c123e617124936a4b846369dc68592c810503b0779ae33a3ef5c4bd82a8a1650` | `a315c9ea917975dc9f324e95645568fb1647db556154c0184fa06ba208d54b04` |
| `packages/game-domain/src/game-evidence-index.ts` | New dependency; add to binding | `0db6ed99a24e93d88fcb14234e276ad658fe0cc565fdb41b9b0e5594ec205bba` |

M9 already binds the first two; add the new index module. M8 predates all three and needs them included if its manifest is rebound. `bound-inputs.json` separates these from four pre-existing M9 mismatches and 56 pre-existing M8 fingerprint mismatches. The four M9 paths are clinical-content `answer-choice-timing.ts`, `index.ts`, `synthetic-content.ts`, and game-domain `test-choice-orders.ts`; none changed during A. The manager must coordinate the paused pilot's intended inputs before rebinding canonical artifacts.

## Exact owned files

- `packages/game-domain/src/game-evidence.ts`
- `packages/game-domain/src/game-evidence-json.ts`
- `packages/game-domain/src/game-evidence-index.ts`
- `packages/game-domain/tests/game-evidence-incremental.test.ts`
- `packages/game-domain/tests/fixtures/game-evidence-legacy.ts`
- `packages/game-domain/tests/fixtures/game-evidence-json-legacy.ts`
- `packages/game-domain/tests/fixtures/evidence-perf.ts`
- `packages/game-domain/tests/fixtures/evidence-differential.ts`
- `tools/perf/evidence-incremental.mjs`
- `tools/perf/evidence-differential.mjs`
- `tools/perf/evidence-full-replay.mjs`
- `tools/perf/evidence-replay-worker.mjs`
- `tools/perf/evidence-codec-check.mjs`
- `tools/perf/level-five-generators-check.mjs`
- `docs/execplans/evidence-incremental-20261030.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`

Ignored evidence/diagnostics: `.local-dev/evidence-incremental-20261030/` only. No other original file changed.

## Reproduction and evidence

Run from the repository root; no installs, network or Git:

```powershell
node --expose-gc --disable-warning=ExperimentalWarning tools/perf/evidence-incremental.mjs --implementation=legacy --output=.local-dev/evidence-incremental-20261030/before-recheck.json
node --expose-gc --disable-warning=ExperimentalWarning tools/perf/evidence-incremental.mjs --implementation=current --output=.local-dev/evidence-incremental-20261030/after-recheck.json
node --disable-warning=ExperimentalWarning tools/perf/evidence-full-replay.mjs --workers=3 --chunk=2500 --historical=report --directory=.local-dev/evidence-incremental-20261030/full-proof-recheck
node --disable-warning=ExperimentalWarning tools/perf/evidence-codec-check.mjs --output=.local-dev/evidence-incremental-20261030/codecs-recheck.json
$env:CI = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node --disable-warning=ExperimentalWarning tools/perf/level-five-generators-check.mjs --integration-only
node --disable-warning=ExperimentalWarning tools/perf/level-five-generators-check.mjs --lower-only
node --disable-warning=ExperimentalWarning tools/perf/level-five-generators-check.mjs --economy-only --seed=level-five-m8.01
node --disable-warning=ExperimentalWarning tools/perf/level-five-generators-check.mjs --economy-only --seed=level-five-m8.02
node --disable-warning=ExperimentalWarning tools/perf/level-five-generators-check.mjs --economy-only --seed=level-five-m8.03
```

Acceptance files: `before-controlled.json`, `after-controlled.json`, `full-proof-final/full-replay.json`, `domain-final.json/log`, `player-native-final.json/log`, `player-native-exit.json`, `typechecks-final.log`, `codecs-final.json`, `economy-seed-{01,02,03}-final.json/log`, `economy-generators-final.json`, `lower-generator-final.json`, `bound-inputs.json`, `runtime-review.diff`, `final-audit.json` and `validation.json`.

Early exploratory logs are diagnostic, not acceptance results. They found the import-orphan compatibility corner case and four primitive stringify calls at native clone materialization; both were fixed and covered. Earlier timeout-only failures disappeared with the repository CI timeout budgets. The first all-pass player PowerShell wrapper returned 1 on existing React stderr; the explicitly captured npm exit is 0 and all 3,098 assertions pass.

## Manager next action

Review the actual scoped diff and final evidence. Resolve the pre-existing paused-pilot artifact drift, then rebind approved inputs using the exact hashes above. Native supported-iPhone acceptance and B remain manager work; no scheme/host/port/profile/launcher change, no save reset or storage clearing is required. Local-only valuable checkpoint: after manager acceptance, remind the owner to say **push to GitHub** for an audited backup. No Git action was authorized or performed here.
