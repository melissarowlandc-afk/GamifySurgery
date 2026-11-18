# Phone per-command engine cost, round 2

## Goal and acceptance

Reduce the compacted approved Level 5 clinic's production Node 1x engine pulse
median below 50 ms, including projection/diff/freezing; measure 4x and typical
chart/answer/assign/build/pan requests. Profile CPU and allocation with
node:inspector before choosing changes. If reaching the target requires a large
architecture change, stop with measured options rather than redesigning it.

Gameplay, exact cards/FSRS, frozen encounters, saves and clinical content stay
unchanged. Native CHECK must retain 35,342 commands / 6,966,492 cents / 551
completions / 0 walkouts and command SHA256
`43b445231a9fb51c6847e425043d434c15ef4985931e949869320dc05362b2a3`.
Compare all per-tick gameplay hashes on controlled continuations and exact
state/checkpoint/view outputs on command sequences. Add a public synthetic
large-clinic regression budget, without private data.

## Ownership and constraints

Main shared tree only. Own the operational-engine/worker command path,
gameSession/transport when needed, and pure domain hot paths (tick, selectors,
view derivation, clone/diff/evidence). Preserve unrelated edits. Concurrent lanes:
do not edit `apps/player/src/facility/**`, `apps/player/src/mobile/performance/**`,
`packages/clinical-content/**`, `scripts/beta-invites/**` or session `diagnostic*`.
Read-only profile/build inputs may include their captured versions.

No Git, agents, network/live DB, installs, deploys, browser storage, save format,
FSRS parameter, clinical content, progression or evidence-rebind changes. Approved
revision-19 source is read-only; reconstruct/compact it through existing codecs
on a session-owned copy. Private states/profiles/timings remain under
`.local-dev/engine-perf2-20261116/`; public tests use synthetic inputs only.

## Milestones

1. Capture the current source epoch and preimages, preserve the completed
   round-1 and corrected compaction lanes, then build matched minified production
   bundles. Measure compacted owner baseline and top CPU/allocation costs.
2. Optimize the dominant measured work with bounded structural sharing,
   explicit ownership/dirty inputs or pure indexes. Reject stale caches and
   preserve command ordering, journal/durability and source-proof checks.
3. Compare complete raw state, views and evidence on real command sequences;
   compare per-tick gameplay on owner/public continuations and the native CHECK.
   Re-measure in isolated processes; record medians/p95 and retained allocation.
4. Run focused/public budget tests; full CI=true domain/player thread suites
   (domain baseline exactly 27 failures), seven typechecks, boundaries and build.
   Run the actual pacing CLI ALONE LAST, reference 26,281 +/-10%, no rebind.
5. Record exact output, scoped hunks/paths/hashes, risks and manager handoff.
   Update CURRENT_THREAD_HANDOFF and write the private port manifest.

## Intake / current progress

Read root AGENTS, current handoff, round-1 performance plan and the corrected
save-headroom plan. The original round-1 production harness is being adapted;
both control and candidate use one captured source/content/balance epoch.
After builds use only explicitly owned overlays, so concurrent renderer and
question edits do not contaminate timing or byte comparisons.

Current status: bounded optimization implemented; target is still unmet. Exact
paired continuations, native CHECK and full domain/player validation are complete.
Do not interpret the camera improvement as acceptance of phone pulse performance.


## Implemented scope and architecture stop

The final implementation has two optimizations. `cloneCommandState` forks mutable
operational branches and appendable answer/review arrays, while sharing only
values admitted by the existing deep immutable-JSON proof. Ordinary mutable,
shallow-frozen and exotic callers retain their original JSON-copy semantics.
Frozen case payloads, historical answers, receipts and FSRS cards are read-only;
answer commands already replace their separately cloned concept history. All 42
whole-state command-copy sites use this boundary. Tick copying remains the
round-1 implementation.

An engine-owned `OperationalViewReuse` reuses a projection only for the identical
immutable state and identical ordered non-camera arguments. It snapshots the
small argument tuple to protect against subsequent caller mutations, rejects
shallow-frozen/non-JSON state as a reuse candidate, and always resamples patient
availability guidance with the request's wall-clock input. Every changed state,
selection, flag, summary/build argument or mode causes full derivation. The
existing version, evidence, journal, durability and worker protocol stay intact.
The existing domain immutable-JSON proof is exported; its validation is unchanged.

A borrowed-route/cache-filter experiment was removed: a matched run improved
177.84 to only 175.18 ms with no convincing pulse gain. There are no changes from
this milestone in spatial, care-room-access or diagnostic-timing. Their round-1
and other existing edits are preserved.

The 50 ms target is **not met**. Further scheduler/view dependency work is a
separate architecture decision. This milestone stops before such a redesign.
No renderer, mobile performance, diagnostic transport, cloud format, FSRS,
content, progression, economics or canonical evidence files are edited.

## Production measurement method

The source epoch contains 2,212 captured public inputs. Control and candidate use
that same content, balance and app epoch; only explicitly owned runtime paths are
overlaid. These are minified production SSR bundles with emitted runtime clinical
assets, not Vitest transforms. Filesystem-only asset adapters forbid network
fetches. The approved revision-19 input goes through real source validation,
`loadCloudSnapshot`, compatible hydration and learning completion on an owned
copy. It is 1,832,435 decoded bytes with 175 rooms. Private input/output, all
profiles, frozen inputs, command preparation and hashes stay under
`.local-dev/engine-perf2-20261116/`.

A real actionable chart is prepared after 18 ordinary reducer ticks. Opening it
and submitting its answer are measured separately. Assign means the existing
`MOVE_FOUNDER` command (staff assignment is automatic); build is an accepted
hallway placement through the real command. Pan/zoom is a real engine `project`
request. Commands and projections must succeed; rejected or duplicate-ID paths
cannot count as samples.

Final timing uses paired alternating control/candidate requests with 12 samples
per scenario; cold catalogue/engine setup and verification/hash serialization are
outside the measured command. Clock scenarios evolve after ten warm ticks;
standalone commands start from the same prepared input for each pair. All
complete raw-state, view, journal-delta and checkpoint bytes are compared.
Independent earlier runs and the 20-sample precursor are retained as exploratory
receipts, rather than selecting their fastest frames. Node 24.19.0. Measurements
are local Node latency, not physical iPhone/WebKit timings.

A clock pulse is one `ADVANCE_TICK` at every speed. 4x requests it at four times
the frequency (250 ms rather than 1,000 ms); it does not run four ticks inside one
command. The 4x scenario runs later with warmer JIT code, which explains its
lower per-command timing. It must not be interpreted as a faster simulation
algorithm at higher speed.

| Request | Before median ms | After median ms |
| --- | ---: | ---: |
| 1x pulse, state + view + diff/freeze | 159.907 | 153.934 |
| 4x pulse, same work at higher frequency | 125.158 | 122.425 |
| Open actionable chart | 131.733 | 131.586 |
| Answer that chart | 138.609 | 124.287 |
| Assign founder destination | 120.417 | 113.376 |
| Accepted build placement | 258.604 | 251.454 |
| Pan/zoom, unchanged state | 53.675 | 0.125 |

The first unchanged-state camera reuse pays for the deep immutable-state proof:
25.620 ms in this paired run, then approximately 0.1 ms. There is no weakened
source proof. The tick algorithm is unchanged: the few-ms paired pulse difference is noise /
warmup, not a demonstrated pulse optimization. The large clock cost remains; a
prior round-1 raw-state median
130.69 ms is a different state/measurement epoch, and cannot be treated as an
apples-to-apples control for these numbers.

Inspector CPU sampling uses 500 microseconds and is separate from wall-time
acceptance. Allocation sampling uses 32 KiB, including objects collected by
minor/major GC: it estimates cumulative allocation, not retained heap. The
profiled region excludes initialization and hash/JSON verification. Inspector
start/stop frames are excluded when interpreting engine self time. Profiles
cover 1x/4x and every player-command scenario. Sampling adds overhead, so these
profiled times are not substituted for unprofiled medians.

Final 1x sampled allocation is approximately 132.63 million bytes per command
(126.48 MiB), versus 132.03 million before. Diagnostic forecasting and nested
routes/calendars allocate approximately 67.76 million bytes per pulse. This
change does not reduce pulse allocation materially. The new camera path removes
repeated clinic-wide derivation; command copies avoid serializing unchanged
frozen history. Exact per-scenario allocation and CPU tables are in the private
profile summary, with validation receipts to follow below.

### Measured next options (not implemented)

1. Give the diagnostic reservation/reading/travel forecast an explicit dependency
   version per mutable simulation phase. The present read-only scopes end when
   predicted staff/tasks or reservations mutate. A state-identity cache spanning
   those phases would be incorrect. Preserve queue ordering, training, peri-op
   attention, travel and frozen-order forecasts with a full reference oracle.
2. Derive views from explicit dirty roots so an ordinary tick does not repeat
   unaffected financial/learning/build/diagnostic projections. This requires a
   dependency map and exact per-tick view differential, rather than inferring
   safety from a command name.
3. Broader incremental reducer/evidence ownership can remove residual branch
   cloning and normalization, but the measured clone cost is small relative to
   forecasts; it is not by itself a credible path from ~154 to under 50 ms.

At a sensitivity factor of 4x slower than Node, the measured 4x-speed pulse would
be ~490 ms against a 250 ms scheduling interval. This is an estimate only, not a
device benchmark. Manager selection of the next architecture milestone and
physical iPhone acceptance remain open.


### CPU self time and allocation detail

Representative final 1x self time (five-command inspector sample, excluding the
inspector `post` frame): deterministic facility route construction/copying
(`spatial.ts:1222`) 6.09 ms/command; evidence normalization
(`incrementalEvidenceValues.ts:39`) 5.88; reachable-resource ranking
(`diagnostic-timing.ts:377`) 5.51; employee candidate paths (line 391) 5.38;
immutable JSON proof 4.79; reading-calendar projection (line 564) 4.01; phase
scheduling (line 345) 4.00; diagnostic path helper (line 328) 3.98; state/view
patch comparison 3.94; current-capability computation 3.88. Nested forecast work
accounts for ~77.44 ms/command in this sample; other view work ~18.03, evidence
normalization/proof ~11.09, diffs ~6.13, state cloning ~2.24 and GC ~2.99.
These are profile localization estimates, not additive independent speedups or
substitutes for the matched unprofiled timing table.

| Request | Before sampled MiB allocated/request | After sampled MiB allocated/request |
| --- | ---: | ---: |
| 1x pulse | 125.91 | 126.48 |
| 4x pulse | 120.12 | 117.80 |
| First open after worker initialization | 116.29 | 116.25 |
| First answer after worker initialization | 124.22 | 116.83 |
| First founder assignment | 107.31 | 107.50 |
| First build | 131.29 | 131.70 |
| Camera request, including first proof | 17.93 | 2.38 |

The largest allocation sites are Map/iterator `next`, rotated footprint objects
(`spatial.ts:363`), normalized JSON objects/descriptors, candidate array
`flatMap`/`filter`/`sort`, reservation keys, held-resource scans and BFS structures.
The immutable-proof first-use cost is included; these are short sampling runs,
so small before/after differences are sampling noise. Allocation is cumulative
including collected temporary objects, not retained heap growth.

A supplemental paired continuation warms two ordinary commands before each
player action. Under concurrently running CI validation it measured open
189.30 -> 179.40 ms, answer 190.45 -> 168.02, founder assignment 155.53 -> 125.89,
and build 421.44 -> 353.78. Every raw-state, view, delta and checkpoint hash still
matches. These noisier loaded measurements show the structural-sharing benefit
after proof warmup; they are not used to claim the pulse target or combined with
fast frames from another run. The final hidden-argument guard was re-bundled and
camera-tested in a 30-pair supplemental run: 99.35 -> 0.203 ms median (p95 after
1.221 ms; first proof is a separate outlier). Only the unchanged-state camera
comparison path changed after the main timing/profile run; pulse/new-state
command paths short-circuit before it.

## Validation progress

`CI=true npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads`:
229 files, **6,140 passed / 27 failed / 1 skipped**, 694.14 s. Exactly the known
baseline: one approved-clinical-admission static count and 26 Level 5 failures
(one source binding plus 25 retained pre-M9 schema/continuation expectations).
There is no new runtime domain failure. No pin, checkpoint or baseline assertion
was edited. New frozen/mutable command differential tests pass for public L4,
public L5 and synthetic active diagnostic encounters, plus JSON/exotic input
semantics and input immutability.

Approved owner continuation: both arms complete 1,200 real reducer ticks / 1,303
commands (including explicit resume). Every per-tick full raw-state, gameplay and
FSRS-card hash matches, as does the command hash. Both peak at 1,846,359 bytes.
The source input stays read-only. Native paired every-tick CHECK, full player,
typechecks and boundaries/build are complete; exact final results follow below.

Initial private check orchestration had incorrect relative source-loader paths;
those attempts stopped before running the domain and are not acceptance evidence.
They are preserved in private logs. Paths were corrected and both owner arms
rerun successfully. A PowerShell status-array bookkeeping error affects the
first queue's status JSON, not its child commands or test logs; final acceptance
will use the actual complete logs plus independent paired-check receipts.


## Final handoff and validation

Owned implementation/test paths (the port patch contains only this lane):

- `packages/game-domain/src/commandStateClone.ts`: proof-gated operational
  ownership, appendable answer/review arrays and concept dictionary.
- `packages/game-domain/src/reducer.ts`: one import and 42 whole-state command
  clone substitutions; generic payload/history copies keep their original JSON
  implementation.
- `packages/game-domain/src/index.ts`: export the existing immutable-JSON proof.
- `apps/player/src/session/cloud/operationalViewReuse.ts`: one bounded cached
  projection with exact state/argument invalidation and fresh temporal guidance.
- `apps/player/src/session/cloud/operationalEngineProcessor.ts`: import, owned
  projection helper and projection call; version/journal/commit rules unchanged.
- `packages/game-domain/tests/command-state-clone.test.ts`: four tests of frozen
  versus mutable public L4/L5 and synthetic command flows, real answers, source
  immutability, and original generic JSON semantics.
- `apps/player/src/session/cloud/operationalViewReuse.test.ts`: three tests for
  full-view equality, deterministic wall-clock advancement, every non-camera
  argument/new state, mutable/shallow-frozen state and hidden argument fallback.
- `apps/player/src/session/cloud/compactedClinicEnginePerformance.test.ts`: a
  public compacted 180-room / 50-employee fixture; full-view equality, camera
  payload ceiling, 50 ms pulse / 8 ms camera median budgets using the existing
  CI timing policy. No private records, copied owner values or byte padding.
- This ExecPlan and an append to `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

No edits from the rejected spatial/care/diagnostic experiment remain. No
GameSession/transport protocol, renderer, balance, progression, FSRS, clinical
content or question edit belongs to this lane. The source-drift receipt records
unrelated edits without including them in the port.

### Exact acceptance output

```text
CI=true npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads
Test Files  2 failed | 227 passed (229)
Tests       27 failed | 6140 passed | 1 skipped (6168)
Duration    694.14s
exit 1: exactly the 27 known baseline failures, zero new domain failures

CI=true npm.cmd test --workspace @gamify-surgery/player -- --pool=threads
Test Files  475 passed (475)
Tests       5664 passed (5664)
Duration    1255.70s
exit 0

CI=true npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --silent=false
  src/session/cloud/operationalViewReuse.test.ts
  src/session/cloud/compactedClinicEnginePerformance.test.ts
  src/session/cloud/operationalEngineProcessor.test.ts
Test Files  3 passed (3)
Tests       5 passed (5)
Duration    14.40s
exit 0, rerun alone after the paired native continuation

npm.cmd run typecheck
All seven workspaces PASS, exit 0 (latest shared context: 47.0699071s)
clinical-context-workbench, player, balance-config, clinical-authoring,
clinical-content, clinical-research, game-domain

npm.cmd run test:boundaries
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
exit 0 (latest context: 3.2982123s)

npm.cmd run build
Boundaries and all seven typechecks PASS.
701 modules transformed; built in 43.39s; exit 0.
Whole root command: 92.8688845s, latest shared context.
```

Experimental TypeScript, existing chunk-size, ineffective dynamic import and
plugin timing advisories are non-failing. The full suite was not rebound or
weakened. Earlier standalone typecheck/build passes and all exploratory runs
remain in the private evidence directory.

The paired native CHECK uses the matched captured content/balance/driver epoch:
**35,342 commands / 6,966,492 closing cents / 551 completions / 0 walkouts** in
both arms. Command-stream SHA256:
`43b445231a9fb51c6847e425043d434c15ef4985931e949869320dc05362b2a3`.
Every one of **33,091 full per-tick raw-state hashes** and all 41 progress
samples match. Final tick 33,091; final raw-state SHA256:
`b1cdb0ae6691b3acd9276e1a9866e7e0a5d6a572f5763b37321c6e17b9e094e8`.
This includes patient flow, movement, staffing, encounters and every FSRS card,
not just cash/completion totals. The owner frozen-state continuation independently
matches all 1,200 raw-state/gameplay/card hashes over 1,303 commands.

Two existing bound source inputs change: `packages/game-domain/src/index.ts`
and `packages/game-domain/src/reducer.ts`. The new transitive source is
`packages/game-domain/src/commandStateClone.ts`. The app helper and tests are not
native-driver inputs. Canonical Level 5 evidence/results files retain their
intake hashes; no rebind was run.

### Shared-tree clinical context changed during validation

The controlled performance and native comparison use **1,436 cases / 1,142
meanings**. Its initial pacing result is 26,377 first finish / 5,913,995 cents /
442 completions / 0 walkouts, +0.365282904% from reference 26,281.

Later, the other lane changed clinical registries/manifest/synthetic-content,
acceptance helpers/tests, and `packages/game-domain/src/test-choice-orders.ts`.
Those files are preserved and excluded from this patch. The actual latest
shared-tree context has **1,436 cases / 1,143 meanings**, clinical SHA256
`1a3c30e645736a1792c5d6e961d9a706e8f332d72b01b3987a5b94b0b4779525`.
Its pacing result is 26,281 / 5,571,244 cents / 440 completions / 0 walkouts,
**0% drift, PASS**. The content/context difference is not a perf-lane gameplay
change. Full-suite collection counts describe their collection epoch; latest
seven typechecks, boundaries and production build were repeated after this drift.
The native fixed-epoch comparison proves this lane in isolation; manager
integration must attribute any later-content native changes separately.

A final read-only sanity check also verifies that camera reuse activates after
ten actual ticks in the owner clone, not just in its paused load state. The first
request took 18.68 ms, then 6.30?7.58 ms with room-view identity retained for all
five requests. Availability guidance is still resampled in the running clinic;
this is not the ~0.2 ms paused-state case and has no paired control timing.

Final actual CLI, run ALONE LAST after the suites, current-context
typechecks/build and the live-camera sanity check (no subsequent Vitest, build
or simulation run):

```text
node tools/qa/content-pacing-check.mjs
{
  "firstFinishTick": 26281,
  "closingCashCents": 5571244,
  "completions": 440,
  "walkouts": 0,
  "referenceTick": 26281,
  "driftPercent": 0,
  "clinicalSha256": "1a3c30e645736a1792c5d6e961d9a706e8f332d72b01b3987a5b94b0b4779525",
  "caseCount": 1436,
  "registeredMeanings": 1143
}
exit 0; 339.0750544s
```

No balance/pacing guard reference or band was changed. The earlier queue's
pacing overlapped the independent native comparison and is not the final gate;
separate isolated runs and the authoritative final run are retained.


### Port and open risks

Port files, exact preimage/postimage SHA256 values, before/after copies and the
independently reconstructed unified patch are under
`.local-dev/engine-perf2-20261116/port/`; the manifest is also copied to
`.local-dev/engine-perf2-20261116/complete-port-manifest.json`. Apply only its hunks
on top of corrected compaction (P1/P2 included) and the round-1 pure hot paths.
Do not copy shared files wholesale or copy private owner inputs/profiles into a
release package. The complete evidence directory contains private data; the
`port/` package contains only the explicit public paths and metadata.

The blocking risk is still pulse latency: ~154 ms Node at 1x and ~122 ms per
4x-speed pulse. The small pulse timing difference is not a claimed causal gain.
Actual iPhone latency, thermal/GC behavior and smoothness remain unaccepted.
The first immutable-source proof also has a measurable cold cost. Reuse assumes
the worker's fixed bundled clinical/balance context; future hot-swappable context
or additional wall-clock-derived view fields must invalidate/resample it. The
full-view differential with a deterministic advancing clock guards the current
contract. CI-tolerant synthetic budgets do not replace the absolute owner-state
production measurement.

Recommended next bounded architecture milestone: explicit diagnostic-forecast
invalidation per mutation phase, followed by view dirty-root derivation, with
this every-tick oracle retained. No large redesign was started. Manager chooses
that milestone and handles release evidence binding; the 50 ms acceptance target
remains open. No Git, agents, network/live DB, install, deploy or browser-storage
action was used.


Milestone notes: profiling and controlled source capture complete; bounded
command/view changes complete; exact owner/native/state/view comparison and all
requested checks complete (27 domain baseline failures remain). The 50 ms pulse
acceptance is unmet and deliberately left at the architecture gate. Final next
action belongs to manager review and selection of the forecast/view dependency
milestone; no further code action is pending in this bounded lane.
