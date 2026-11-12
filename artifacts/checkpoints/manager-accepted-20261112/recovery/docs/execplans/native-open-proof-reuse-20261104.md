# Native opening proof reuse — 2026-11-04

## Goal and ownership

Reduce native campaign opening CPU time by canonicalizing verified lineage keys and reusing already-verified current snapshots for candidate validation and playable session hydration. Preserve every checksum, parser, domain-fidelity, identity, revision, lineage, recovery, fencing and newest-copy selection contract. Own player session/cloud code and tests only. No domain, view, clinical, question, character, server, SQL or save-format changes.

The tree is shared. The previous storage/journal-recovery milestone is accepted pending manager browser validation; keep it intact. Perf worker 01a1a842 owns domain/navigation and possibly view derivation. No Git, installs, network, browser or live database work.

## Evidence and measurement

Read `.local-dev/owner-profile-20261104/REPORT.md`, especially lines 167–195. Its rank-3 finding demonstrates a proof miss when equivalent lineage keys are reordered (372.18 ms versus 0.66 ms). Native candidate validation and session creation still directly hydrate the same bytes. The report's clean memory-only opening controls total about 2.2–2.4 seconds; the 12-second browser observation is not fully explained by those CPU measurements.

The approved private backup stays read-only in its original directory. Measurements use its production Supabase row adapter, current codec and in-memory server/stores. Never copy private bytes, log names/IDs or persist decoded data. Only aggregate sizes, task/call counts, timings and source hashes go into `.local-dev/native-open-proof-reuse-20261104/`. Preserve the original profiling artifacts.

## Milestones and acceptance

1. Capture scoped source baseline and privacy-safe cold/warm opening counters/timings. Trace every native open hydration and the complete proof key/constraints.
2. Canonicalize complete validated lineage, key actual packed bytes, share native candidate proofs, and hydrate a session from a bounded private verified snapshot cache through the real worker clone boundary. Keep mutable session state isolated and all external constraints checked per request. No optional work may introduce an opening wait.
3. Deterministic tests for reordered valid lineage, invalid/unknown metadata, wrong expected scope/revision/baseline, actual byte/length/hash changes, candidate metadata mismatch, bounded cache eviction, independent session mutations and worker transfer. Count full hydrations through opening and compare entire recovered state/learning/frozen content.
4. Re-measure with the approved backup and realistic public fixtures. Focused tests, full player with documented sandbox preload and `--pool=threads`, seven workspace typechecks, e2e/QA typecheck; exact counts. Manager runs browser checks and measures actual desktop opening.

## Progress

- Read repository instructions and active storage handoff; no agents or unrelated files touched.
- Captured seven source baselines and SHA-256 values. New measurement artifacts are separate from the read-only profiling report.
- Reproduced the lineage miss before implementation: the new test expected one load but observed two (`baseline-regression.log`, exit 1).
- Implemented validated lineage normalization, bounded private hydration reuse and a typed `hydrate` worker task. Native candidate validation still checks campaign metadata, supplied lineage, empty evidence, scope, capacity and usage constraints per request. Revisions are validated on every proof request, independently of byte reuse. Native journal comparison shares the worker's proof cache; legacy archive validation remains unchanged.
- Two current hydrated snapshots remain cached; native entries additionally retain their already-validated ephemeral checkpoint/source for opening. No decoded legacy archive is cached. Small summary proofs are LRU-bounded to 64. Eviction costs revalidation, never lost durable state. Every returned projection/session snapshot is independent; account/session authorization stays in the unchanged coordinator/transport gates.

## Comparable measurements

Three fresh-process, interleaved before/after controls use the identical current domain and supporting sources. The before controls substitute only the four captured cloud source baselines **in memory** using the source loader; no production file is reverted. Applied baseline source hashes and current source hashes accompany each JSON. Both modes use the same asynchronous inline codec clone boundary, real automatic selection/coordinator/game session, in-memory journal/cache/entry stores and fake transport. No network, disk IDB or browser rendering latency is represented. Earlier initial controls are retained separately; concurrent type/test load affected those timings, so they are not the comparison below.

The approved backup's exact current snapshot is **1,732,738 decoded bytes** (aggregate only). It is not a synthetic enlarged copy. Normal additive missing-concept defaults remain at the playable session boundary; all supplied learning histories and every other state field compare exactly. The private input and original profiler artifacts were not written or copied.

| Mean across three fresh processes | Before | After |
| --- | ---: | ---: |
| Full snapshot hydrations through playable session | 4 | 1 |
| Automatic copy selection/open | 997.37 ms | 383.60 ms |
| Session creation including journal binding and existing preview preparation | 572.44 ms | 238.31 ms |
| Total selection + session | 1,569.82 ms | 621.91 ms |
| Full hydration CPU span (summed) | 1,207.39 ms | 321.32 ms |
| Redundant verification after reordered lineage | 319.16 ms | 0.58 ms |
| Candidate validation | 293.84 ms | 0.74 ms |

All six controls are playable and exact-state/learning comparisons pass. The removed three full hydrations are deterministic; the ~60% offline CPU/wall reduction is not a promise of the same browser gain. First verification remains full/strict; session creation still includes domain engine/navigation initialization and the concurrent perf worker's discarded preview, untouched by this lane. The report's 12-second browser opening includes missing network/IDB/worker queue/render inputs; manager must remeasure it.

Public compatibility regression also migrates the existing stored-block-gzip **5,095,713-byte Level 5** fixture and opens its exact native snapshot through queued MessageChannel transfers: **969.72 ms**, 1,761,785 decoded snapshot bytes / 145,363 compressed. One native hydration, no upload/replay, exact whole state, no worker restart. Aggregate source/snapshot sizes and timing are in `level5.json`; fixture generation (26.14 s with the test) is outside the opening measurement.

## Validation

- Proof/recovery focused: **5 files / 34 tests passed**, 21.42 s (before adding the large public-fixture regression).
- Final proof and native-worker boundary coverage: **3 files / 14 tests passed**, 35.16 s. Includes actual separate worker-realm transforms, all changed packed metadata/bytes, every lineage field/unknown field, expected owner/revision/baseline mismatches, projection/session mutation isolation, eviction revalidation, committed-tail recovery and the Level 5 MessageChannel opening.
- **Seven workspace typechecks pass** (`typecheck-seven.log`, exit 0). Initial typecheck encountered a readonly test mutation, corrected in this lane, and transient `tickStateDraft.ts` errors in the concurrent perf lane; that lane resolved its own file. Never edited domain.
- **E2e/QA typecheck passes** (`e2e-qa-types.log`, exit 0). Existing e2e assertions and locators unchanged.
- Full player with sandbox preload and `--pool=threads`: **349 files passed / 1 failed (350)**; **3,450 tests passed / 1 failed (3,451)**, **328.11 s** (`player-full.log`). The sole failure is the independently reproduced concurrent navigation callback issue below; all cloud/session tests pass. All seven scoped source hashes remained unchanged throughout.
- Current-tree type recheck (after other workers changed clinical/domain sources) is blocked by **eight distinct `TS2322` category errors** in `packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts`, lines **16,39,61,83,105,127,149,172**: `clinical_application` / `quality_improvement` are outside the permitted evidence-category union. This affects both seven-workspace and e2e/QA final rechecks (`typecheck-final.log`, `e2e-qa-final.log`). Seven-workspace recheck additionally reports **`TS4104` at `tests/fixtures/diagnostic-workload.ts:97`** (readonly operation phases assigned to a mutable fixture type). Earlier both checks passed; no cloud typing error. Clinical/domain fixture files preserved for their owning lanes.
- Final current-import proof/compatibility/storage recovery recheck: **5 files / 44 tests passed**, **38.07 s** (`final-focused.log`). Implementation and scoped validation complete. Manager must integrate the above external-lane fixes, rerun global checks/browser suites and measure actual desktop opening. No origin/pathway change, deployment or remote action.

## Concurrent-lane validation finding

The full run reports the character/periop route-footprint assertion. Its isolated control also fails (1 file / 9 passed, 1 failed; `concurrent-character-control.log`): `TypeError` in `getRoomDefinition`, `selectors.ts:207`, via new `facilityNavigation.ts:26`, `spatial.ts:1198`, `periopCompanionPresentation.test.ts:307`. `facilityNavigationKey` uses `ids.map(getDefinition)`, passing the array index as the selector's optional second `DomainContext` argument. The test supplies `getRoomDefinition` directly. None of this failure path invokes this lane's cloud changes. Preserved for manager/perf-lane integration; no domain or character file edited here.

Privacy check: **13 aggregate measurement JSON files**, **zero private-value matches**, **zero decoded save files written** (`privacy-audit.json`). Backup reads and in-memory validation only; no original profiling artifact changed.
