# Projection-only ship gate handoff — 2026-11-05

The default clinical release is the only shipping boundary. Domain code consumes its supplied release without acceptance checks. N1 now uses the manager's twelve review-three acceptances; twenty-eight N1 drafts remain in explicit catalogs. N2 retains twelve review-two PASS versions; no N2 round-three acceptance or N3 work was added. Editorial acceptance is not clinical sign-off by Melissa Rowland.

## Behavior and preservation

- Removed the gate import/check from clinical-case-eligibility.ts, clinical-selection.ts, routine-patient-availability.ts and reducer.ts, including createEncounter (which lives in reducer.ts). Restored the availability reference helper too. All five files match the pre-gate intake SHA-256 values; reducer additionally matches the immediate pre-guard full-file capture. Concurrent performance code is preserved.
- question-ship-projection.ts receives an explicit legacy fallback independent of the source-view lookup. Missing views/headers, duplicate nodes, unknown versions and changed/unregistered accepted concepts produce warnings and retain the legacy case. An unverifiable new addition is omitted. No manifest-consistency exception is thrown on this path.
- Strict consistency diagnostics run from question-ship-manifest.test.ts through the test-only question-ship-manifest-validation.ts. That validator is not exported through the runtime barrel or called by the projection. No domain/player production source imports the manifest, projection gate or draft catalog.
- Existing unaccepted rewrite nodes remain legacy nodes, including B2A03 beside accepted B2A02. The batch2b-round2 source-view and accepted-concept helper integration is preserved unchanged. No rewrite definition, N1/N2 question definition, independent review packet or clinical approval was edited.
- Default: 1,134 cases, 1,447 nodes, 425 active concepts. Catalog: 1,189 cases, 1,502 nodes, 493 active concepts. Both retain 585 registered concept definitions for histories. Exactly twenty-eight N1 and twenty-seven N2 cases are parked outside the default release. The manifest has 43 directed acceptances plus 1,423 explicit legacy tuples.

Decision: [question-new-manager-decision-20261105.md](question-new-manager-decision-20261105.md). Plan: [question-ship-gate-narrowing-20261105.md](../execplans/question-ship-gate-narrowing-20261105.md).

## Save compatibility tests

New player test file: apps/player/src/questionShipSaveCompatibility.test.ts, outside the protected session lane. Six tests pass:

- reopens format-three waiting excluded content without reset and scores its frozen concept
- reopens format-three in-progress excluded content without reset and scores its frozen concept
- reopens format-three waiting replaced content without reset and scores its frozen concept
- reopens format-three in-progress replaced content without reset and scores its frozen concept
- replays a committed pre-gate admission of excluded content from the local journal without reselecting it
- replays a committed pre-gate admission of replaced content from the local journal without reselecting it

The fixtures actually admit under QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE; they do not replace frozen definitions by hand. Excluded incidental-T1b and replaced SGLT2 encounters reopen through the real format-three snapshot codec/account session. They complete ordinary care with resolutionReason=completed, score the old frozen question/concept, preserve supplied cards/reviews and append exactly one FSRS review. A duplicate answer does not score twice. Completed snapshots survive another reopen with the same campaign identity. Journal tests durably commit ADMIT_PATIENT before reopening and verify that its receipt/frozen definition survive; they do not attempt a fresh admission against today's projection. No GameEvidenceError, reset, clinical-content migration or player-session implementation change is used.

Native test: question-ship-gate.test.ts > admits under a pre-gate release then reopens and scores its replaced frozen definition exactly once. The native suite also checks all 55 parked cases against default supply, proves explicit catalogs remain usable, and exercises every accepted new item and rewrite, FSRS scheduling, protected tutorials, availability/reference parity and randomized choices.

## Files and fixture scope

Production edits this milestone:

- packages/clinical-content/src/question-ship-manifest.ts
- packages/clinical-content/src/question-ship-projection.ts
- packages/clinical-content/src/synthetic-content.ts (projection call and retained N1 round-three source view only)
- packages/game-domain/src/{clinical-case-eligibility,clinical-selection,routine-patient-availability,reducer}.ts (remove only prior gate hunks)
- packages/game-domain/src/routineAvailabilityReference.testSupport.ts (restore matching reference behavior)

New/updated verification and fixtures:

- packages/clinical-content/src/question-ship-manifest{,-validation}.ts and question-ship-manifest.test.ts
- packages/clinical-content/src/question-new-n1-round3-20261104.test.ts (retained release/timing stage)
- packages/clinical-content/src/question-bank-batch2a-round3-20261104.test.ts (retained complete author stage)
- packages/game-domain/tests/question-ship-gate.test.ts
- packages/game-domain/tests/question-new-n1-round3-admission.test.ts and question-new-n2-round2-admission.test.ts
- packages/game-domain/tests/question-bank-batch2a-round2-bindings.test.ts and service-procedure-operations.test.ts
- packages/game-domain/tests/{gs028-20261002-batch,gs028-20261003-batch,gs028-20261007-batch,gs028-20261007-variety2-batch,gs028-statistics-ethics-batch,surgery-center-batch,patient-supply,approved-clinical-admission,clinical-content-withdrawal}.test.ts
- packages/game-domain/tests/diagnostics/patient-supply.test.ts
- tests/fixtures/clinical-author-stage.ts
- apps/player/src/questionShipSaveCompatibility.test.ts

Historical cohort fixtures use a complete retained stage and bind their reducer/initial-state/restore helpers to that supplied release. Existing goldens, assertions, seed counts, budgets and timeouts remain intact. The early-supply snapshot excludes the twenty-one N2 round-two late-level IDs already individually asserted above it, matching the existing treatment of separately checked late-level N1/N2 versions. The default concept inventory explicitly includes the twenty-two retained N2 round-three definitions; its retired-case exclusion list is checked against the full explicit catalog while the other withdrawal checks still use the default release. F02's lint assertion already uses the retained QUESTION_FLAGS_ROUND1_RELEASE candidate; lint.test.mjs was unchanged in this milestone.

## Level 5 inputs

Only these four previously bound inputs still differ from the pre-gate integration baseline:

- packages/clinical-content/src/index.ts
- packages/clinical-content/src/synthetic-content.ts
- packages/clinical-content/src/answer-choice-timing.ts
- packages/game-domain/src/test-choice-orders.ts

The timing/order additions retain exact archived question/choice bindings for catalog reviews and frozen encounters. No timing/order edit was made during narrowing. The four production domain files and reference helper now match pre-gate hashes. Manifest/projection and earlier N2 round-three modules/assets remain dependencies for the manager's real release-tree binding. No Level 5 evidence, pin, checkpoint, budget or expected result was edited or rebound. Exact comparisons: .local-dev/question-ship-gate-narrowing-20261105/{domain-restoration,level-five-inputs}.json.

## Validation and remaining integration

Final domain run: 4,980 pass / twenty-six fail / one skip (199 files: 198 pass / one fail). All twenty-six failures are in packages/game-domain/tests/level-five-integration.test.ts; the same file has twenty-six failures in both the earlier N2 round-two and gate round-three receipts. No Level 5 evidence or pins were changed. The first final run overlapped other suites and hit the unchanged 10,000 ms supply-inventory timeout; the focused control passed, and the full rerun without overlapping validation jobs passed that check with the original budget. All runs use --pool=threads --maxWorkers=2. Player uses the existing native-loader workaround: an exact Vite configuration copy with only the private-module import's .ts extension added; test settings/plugins/budgets/timeouts are unchanged.

Clinical full: 1,126 pass / two fail (112 files: 110 pass / two fail). Both failures are cross-lane test-file digest captures invalidated by the authorized fixture changes, not pre-existing failures:

| Failing file | Guard and exact follow-up |
| --- | --- |
| packages/clinical-content/src/question-bank-batch2b-20261104.test.ts | Its original batch2b capture pins packages/game-domain/tests/question-bank-batch2a-round2-bindings.test.ts. Reconcile that test-only digest. |
| packages/clinical-content/src/question-bank-batch2b-round2-20261104.test.ts | Its round-two capture pins both the above domain fixture and packages/clinical-content/src/question-bank-batch2a-round3-20261104.test.ts. Reconcile those two test-only digests. |

The prior digests matched intake. Clinical/source/packet/image bytes remain preserved. The rewrite lane's capture files and test assertions were not edited. Exact old/new hashes and three JSON keys: .local-dev/question-ship-gate-narrowing-20261105/rewrite-test-digest-followup.json. These two integration failures mean this handoff cannot claim the zero-introduced-failure target is fully met; the manager/rewrite writer must reconcile its frozen test-source metadata.

Player full: 3,538 pass / three fail (373 files: 370 pass / three fail). All three failing files already fail in the recorded earlier runs:

| File under apps/player/src/session/cloud | Current result | Prior evidence without narrowing |
| --- | --- | --- |
| diagnosticWorkloadPerformance.test.ts | 1x tick + overview 68.548 ms exceeds unchanged 16 ms budget | N2 round two: 95.8228 ms; pre-gate N1 round three: 62.6299 ms; gate round three: 81.3731 ms. |
| operationalSession.test.ts | Fencing-during-computation test exceeds unchanged 5,000 ms timeout | Same named test times out in pre-gate N1 round three and gate round three. |
| separateCampaign.test.ts | Retired-encounter fixture: JSON string exceeds codec limit | Same named test and CloudCodecError/codecJson.ts stack in gate round three. This did not fail in the earlier N2 round-two run. |

The session/cloud files are outside this lane and unchanged from intake. The new six format-three save/journal tests pass independently of that historical evidence-envelope size failure.

Local receipts, exact commands, log hashes, per-file failures and previous-run comparison: .local-dev/question-ship-gate-narrowing-20261105/validation.json. Earlier receipts are read-only under question-new-n2-round2-20261104, question-new-n1-round3-20261104 and question-new-n2-round3-ship-gate-20261104.

Source-preservation receipt checks 406 protected files, all unchanged. The legacy binding block and every non-N1 acceptance are byte/record exact. The synthetic assembly reproduces intake after removing only the explicit fallback argument and the new N1 source-view entry. Closed tools/question-new-n2-round3 regeneration scripts encode the superseded gate/seed contract and were neither rerun nor edited; this milestone uses the new tests and receipts.

At 07:32:47 UTC a concurrent lane appended a FLAGS2 retained-candidate export to clinical-content/src/index.ts. This worker preserved that append and did not edit index.ts during narrowing. It changes no manifest/projection assembly. The four-input list above is unchanged. Full-suite counts reflect their recorded run windows; a fresh seven-workspace typecheck and twelve manifest/projection tests also pass with that append present. Receipt: .local-dev/question-ship-gate-narrowing-20261105/concurrent-index-window.json. Latest typecheck log: typecheck-close.log (seven workspaces, exit 0); latest manifest control: clinical-manifest-close.log (12/12, exit 0).

No Git, install, network, agents, external messages, Supabase, release/deploy, browser/profile/origin change or clinical approval. Work is local and unbacked by this lane. N3 remains on hold pending manager acceptance.


## Exact final validation output

### Clinical full

```text
Test Files  2 failed | 110 passed (112)
Tests  2 failed | 1126 passed (1128)
Duration  95.44s (transform 5.80s, setup 0ms, import 158.42s, tests 18.97s, environment 8ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/clinical-full-final.log; exit 1.

### Domain full, no overlapping validation jobs

```text
Test Files  1 failed | 198 passed (199)
Tests  26 failed | 4980 passed | 1 skipped (5007)
Duration  470.32s (transform 9.71s, setup 0ms, import 338.31s, tests 581.35s, environment 13ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/domain-full-serialized.log; exit 1.

### Player full

```text
Test Files  3 failed | 370 passed (373)
Tests  3 failed | 3538 passed (3541)
Duration  808.33s (transform 17.61s, setup 0ms, import 607.23s, tests 968.72s, environment 27ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/player-full.log; exit 1.

### Clinical manifest/fixture focused

```text
Test Files  3 passed (3)
Tests  64 passed (64)
Duration  6.78s (transform 3.58s, setup 0ms, import 9.07s, tests 4.18s, environment 0ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/clinical-fixtures-focused.log; exit 0.

### Native projection/catalog focused

```text
Test Files  1 passed (1)
Tests  128 passed (128)
Duration  9.17s (transform 2.66s, setup 0ms, import 4.20s, tests 4.89s, environment 0ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/domain-focused.log; exit 0.

### Actual snapshot/journal save tests, including completed-resolution assertion

```text
Test Files  1 passed (1)
Tests  6 passed (6)
Duration  9.12s (transform 3.69s, setup 0ms, import 5.77s, tests 3.25s, environment 0ms)
```

Log: .local-dev/question-ship-gate-narrowing-20261105/player-save-final-focused.log; exit 0.

Seven workspace typechecks exit 0: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. Lint tests: 33 tests, 33 pass, zero fail/skipped; exit 0. Exact logs: .local-dev/question-ship-gate-narrowing-20261105/{typecheck-close,lint-tests}.log.

Commands:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --configLoader native --config ../../.local-dev/question-ship-gate-narrowing-20261105/player-native.config.ts
npm.cmd run typecheck
npm.cmd run clinical:lint:test
```

The exact prior/current file comparison is in .local-dev/question-ship-gate-narrowing-20261105/failure-attribution.json. There are no observed narrowing-introduced runtime failures. The two cross-lane test-source digest conflicts remain new integration failures; the zero-introduced-test-failure target is not claimed. Reconcile the three test-only capture entries, then rerun full clinical-content. N3 remains on hold.
