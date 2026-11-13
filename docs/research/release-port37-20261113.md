# Release port37 / rebind37 - final approved capture correction (2026-11-13)

Port37 validation is green. The manager-approved patch captures the two final-minute QA checkpoints after the real pump() and before the final tick. The integration guard and every assertion are unchanged. No gameplay, save-schema, clinical or player source changed in this follow-up. Main remained read-only; LOCAL_STORAGE_COMPRESSION_WRITES stays false and the manager clinical Vitest config is byte-exact.

Fresh native journey/lower: **35,342commands /6,966,492closing cents /551completions /0walkouts**, exactly unchanged. Every native summary number, all3reports and the entire final native save are byte-identical. Eight checkpoints, including integration-final, remain byte-identical. Only integration-repeat-final changes18paths: the actual OPEN_CHART at tick30033, its care/route/optional-shopping preemption, bounded receipt update and inspection question58. No report was hand-edited. Both final checkpoints now reproduce the complete native report through one ordinary resumed tick.

First finish **26,377**, +0.2470355731% from26,312, passes the manager's +/-10% band. The independently rerun unchanged pacing CLI also passes its26,281reference (+0.3652829040%). Cash remains1,635,500+19,910,900-491,339-12,842,569-1,246,000=6,966,492. Scores remain62.66208410363534 /66.65484360849828 /45.540643592859844, patients52/50/49. Best/latest/first, positive cash, >20,000commands and all original driver assertions pass.

Only one of629bound inputs changed: the approved QA driver. All476clinical hashes and the full frozen clinical JSON remain unchanged (`4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f`). Default1436cases/1644nodes/1142meanings/811rows; all34new accepted nodes remain needs_clinician_review. All earlier owner approvals and the initial accepted ENG/intraop port are preserved.

| File | Before SHA-256 | After SHA-256 |
|---|---|---|
| `tests/fixtures/level-five-integration.ts` | `38343c35a731349487b28045bc8a9e1fc46004564febdfbf95a5fb9157ead15a` | `0903b828a072f8d2614a9fedd69a44fe5881eb61447646b754815c80e4e44faf` |
| `tools/qa/level-five-integration-results-20261012.json` | `2c5e14414ab76d6f4de66744da4c930c0bfc27d78cca4c4512a5f1e4803d5f1c` | `90e4cb56d75bf20785138c8d99d7172bcb83348048ef1632ca506eea98c9c55c` |
| `tests/fixtures/level-five-integration-checkpoints-20261012.json` | `7b9ae187b2cebe7aebf0eeb472eec2bcc66d91337946fce4b7c3bf7d1ec0a374` | `04587f7d88309ffad208cb39854bd67b7b4aa6a441a0ba4650e514f0333001a3` |

Input history32->33 retains every earlier entry and appends the previous629hashes. Only the established liveCap metadata correction and this append alter the native results metadata. The legacy comparison artifact and all runtime sources remain unchanged.

Both stats1 and stats1-acceptance live results pins record the exact authorized delta with reason `manager-approved port37 final-minute capture correction`; their dependent checksum closure changes16pin fixtures and16verifying tests. Every original capture, earlier authorization and required absence remains strict. All9historical “before” captures containing the old driver reference were audited, left byte-exact, and confirmed to be historical fields or excluded by their consuming test predicates. No stale historical hash was refreshed to hide drift.

## Exact final validation

CI=true, threads: **866files /13,824passed /0failed /1existing skip** across all seven freshly rerun workspace suites. Focused level-five-integration.test.ts: **36passed /0failed /0skipped**. Seven typechecks, boundaries/launcher and player build exit0. No assertion or timeout/budget was weakened.

| Workspace | Files | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| player | 452 | 5541 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-content | 145 | 1768 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |
| game-domain | 220 | 6140 | 0 | 1 |

The player suite is affected through its QA data: levelFiveIntegration.test.tsx, codec.fixtures.test.ts and codecEvidence.test.ts consume the changed checkpoint, with the codec tests iterating all9saves. The full452file/5541test player suite was therefore rerun and passes; it is not being claimed unaffected. Production player code and build behavior remain unchanged.

```text
Focused Level5 integration
 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  03:10:09
   Duration  122.43s (transform 9.31s, setup 0ms, import 13.91s, tests 108.41s, environment 0ms)

clinical-context-workbench
 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  03:12:29
   Duration  1.58s (transform 629ms, setup 0ms, import 1.46s, tests 639ms, environment 1ms)

player
 Test Files  452 passed (452)
      Tests  5541 passed (5541)
   Start at  03:10:09
   Duration  839.73s (transform 44.35s, setup 0ms, import 1045.05s, tests 2255.86s, environment 39ms)

balance-config
 Test Files  26 passed (26)
      Tests  168 passed (168)
   Start at  03:12:31
   Duration  3.92s (transform 1.02s, setup 0ms, import 4.16s, tests 258ms, environment 2ms)

clinical-authoring
 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  03:12:35
   Duration  852ms (transform 180ms, setup 0ms, import 501ms, tests 408ms, environment 1ms)

clinical-content
 Test Files  145 passed (145)
      Tests  1768 passed (1768)
   Start at  03:10:09
   Duration  231.00s (transform 13.58s, setup 0ms, import 361.84s, tests 83.42s, environment 12ms)

clinical-research
 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  03:12:36
   Duration  2.98s (transform 253ms, setup 0ms, import 709ms, tests 1.42s, environment 1ms)

game-domain
 Test Files  220 passed (220)
      Tests  6140 passed | 1 skipped (6141)
   Start at  03:15:53
   Duration  1027.15s (transform 19.08s, setup 0ms, import 585.16s, tests 1444.88s, environment 15ms)
```

Boundaries: `Verified runtime dependency boundaries and 7982 tracked path(s).` / `Verified launcher health contract gamify-surgery-player protocol 1.` The inventory is checksum-verified read-only data; no Git process or index write. Build: ✓ 686 modules transformed.; ✓ built in 12.44s. Existing chunk/dynamic-import/plugin timing diagnostics are nonfatal. Exact command/log/JSON hashes are in `release-port37-validation-20261113.json` and `.local-dev/release-port37-20261113/capture-correction/validation-summary.json`.

The initial raw port37 run had13,822passed/2failed/1skip: one stale concept-list assertion was already corrected, and the QA capture gap is now resolved by this approved patch. That history is preserved under initialPort37Validation in the validationJSON and in the private before snapshots. Current full domain passes6140/0/1, covering both resolutions.

## Files changed in this follow-up

40public paths: one QA driver, two native evidence artifacts,16pin fixtures,16verifying tests and five handoff/plan documents. Every final file hash is recorded independently in `.local-dev/release-verify/port37-20261113.json`; complete port37 now has159changed public paths. No clinical content, runtime code, player test expectations, e2e spec or timeout was edited in this follow-up.

- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/execplans/release-port37-20261113.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- `docs/research/release-port37-20261113.md`
- `docs/research/release-port37-validation-20261113.json`
- `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch11-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch9-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-stats1-20261108.test.ts`
- `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts`
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`
- `tests/fixtures/level-five-integration.ts`
- `tools/qa/level-five-integration-results-20261012.json`
- `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json`

## Remaining risk and state

No failing assertion or known capture blocker remains. One pre-existing domain test stays skipped; browser checks were not needed/performed for this QA-only correction. The build retains its existing nonfatal warnings. Work is uncommitted; no commit, push, install, network, agent or deployment occurred. No owner save or opening origin was accessed or changed.

## Complete port37 path inventory

- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/types.ts`
- `apps/player/src/questionProgramBatch10SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch11SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch3SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch4SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch9SaveCompatibility.test.ts`
- `apps/player/src/session/cloud/openingUploadLarge.test.ts`
- `apps/player/src/session/engI01ProcedurePresentation.test.ts`
- `apps/player/src/session/levelFiveLaunch.test.tsx`
- `apps/player/src/session/pediatricFamilyPresentation.ts`
- `apps/player/src/session/procedureContextPresentation.ts`
- `apps/player/src/session/topicRuntimeBindings.test.ts`
- `apps/player/src/session/viewModels.ts`
- `docs/execplans/eng-i01-live-procedure-questions-20261112.md`
- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/execplans/question-intraop-acceptance-batch10-20261113.md`
- `docs/execplans/question-intraop-acceptance-batch11-20261113.md`
- `docs/execplans/question-intraop-acceptance-batch9-20261112.md`
- `docs/execplans/release-port37-20261113.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- `docs/research/question-intraop-acceptance-batch10-20261113.md`
- `docs/research/question-intraop-acceptance-batch10-dispositions-20261113.json`
- `docs/research/question-intraop-acceptance-batch10-files-20261113.json`
- `docs/research/question-intraop-acceptance-batch10-packet-20261113.json`
- `docs/research/question-intraop-acceptance-batch10-source-freeze-20261113.json`
- `docs/research/question-intraop-acceptance-batch10-validation-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-20261113.md`
- `docs/research/question-intraop-acceptance-batch11-census-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-dispositions-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-files-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-packet-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-source-freeze-20261113.json`
- `docs/research/question-intraop-acceptance-batch11-validation-20261113.json`
- `docs/research/question-intraop-acceptance-batch9-20261112.md`
- `docs/research/question-intraop-acceptance-batch9-dispositions-20261112.json`
- `docs/research/question-intraop-acceptance-batch9-files-20261112.json`
- `docs/research/question-intraop-acceptance-batch9-packet-20261112.json`
- `docs/research/question-intraop-acceptance-batch9-source-freeze-20261112.json`
- `docs/research/question-intraop-acceptance-batch9-validation-20261112.json`
- `docs/research/release-port37-20261113.md`
- `docs/research/release-port37-validation-20261113.json`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/patient-library-wording-repair.test.ts`
- `packages/clinical-content/src/playable-patient-narrative.test.ts`
- `packages/clinical-content/src/question-flags3-20261107.test.ts`
- `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-intraop-release-membership-20261113.test.ts`
- `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch10-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch10-accepted-20261113.ts`
- `packages/clinical-content/src/question-program-batch10-accepted-data-20261113.ts`
- `packages/clinical-content/src/question-program-batch11-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch11-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch11-accepted-20261113.ts`
- `packages/clinical-content/src/question-program-batch11-accepted-data-20261113.ts`
- `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch9-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch9-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch9-accepted-20261112.ts`
- `packages/clinical-content/src/question-program-batch9-accepted-data-20261112.ts`
- `packages/clinical-content/src/question-ship-manifest.test.ts`
- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/question-stats1-20261108.test.ts`
- `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-topic-release-membership-20261112.test.ts`
- `packages/clinical-content/src/schema.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/clinical-case-eligibility.ts`
- `packages/game-domain/src/founder-consults.ts`
- `packages/game-domain/src/legacy-procedure-contexts.ts`
- `packages/game-domain/src/pediatric-family.ts`
- `packages/game-domain/src/pediatric-procedure-flow.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/procedure-companions.ts`
- `packages/game-domain/src/procedure-context.ts`
- `packages/game-domain/src/procedure-room-capabilities.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/retired-service-history.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/approved-clinical-admission.test.ts`
- `packages/game-domain/tests/eng-i01-frozen-acceptance.fixture.ts`
- `packages/game-domain/tests/eng-i01-live-procedure.fixture.ts`
- `packages/game-domain/tests/eng-i01-live-procedure.test.ts`
- `packages/game-domain/tests/eng-i01b-procedure-equipment.test.ts`
- `packages/game-domain/tests/eng-i01c-procedure-families.test.ts`
- `packages/game-domain/tests/founder-consults.fixture.ts`
- `packages/game-domain/tests/level-five-launch.test.ts`
- `packages/game-domain/tests/level-four-persistence.test.ts`
- `packages/game-domain/tests/question-program-batch10-integration.test.ts`
- `packages/game-domain/tests/question-program-batch11-integration.test.ts`
- `packages/game-domain/tests/question-program-batch9-integration.test.ts`
- `packages/game-domain/tests/release37-pediatric-reload.test.ts`
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`
- `tests/fixtures/level-five-integration.ts`
- `tests/fixtures/level-five-legacy-behavior-20261012.json`
- `tools/qa/level-five-integration-results-20261012.json`
- `tools/question-quality/accept-intraop-batch10-20261113.mjs`
- `tools/question-quality/accept-intraop-batch11-20261113.mjs`
- `tools/question-quality/accept-intraop-batch9-20261112.mjs`
- `tools/question-quality/fixtures/question-flags3-release-source-pins-20261107.json`
- `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-after-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-before-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-schema-pin-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-migration-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-reconciliation-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-test-source-before-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch11-after-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch11-before-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch11-eng-i01c-pins-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch11-source-migration-20261113.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch9-after-20261112.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch9-before-20261112.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch9-source-dependencies-20261112.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch9-source-migration-20261112.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch9-test-source-before-20261112.json`
- `tools/question-quality/fixtures/question-intraop-batch10-reconciliation-archive-20261113.json`
- `tools/question-quality/fixtures/question-intraop-batch10-release-source-inventory-20261113.json`
- `tools/question-quality/fixtures/question-intraop-batch11-release-source-inventory-20261113.json`
- `tools/question-quality/fixtures/question-intraop-batch9-interim-test-delta-20261113.json`
- `tools/question-quality/fixtures/question-intraop-batch9-release-source-inventory-20261112.json`
- `tools/question-quality/fixtures/question-intraop-batches9-11-retained-authoring-tests-20261113.json`
- `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json`
- `tools/question-quality/question-intraop-acceptance-batch10-lint-20261113.json`
- `tools/question-quality/question-intraop-acceptance-batch11-lint-20261113.json`
- `tools/question-quality/question-intraop-acceptance-batch9-lint-20261112.json`
- `tools/question-quality/receipt-intraop-acceptance-batch10-20261113.mjs`
- `tools/question-quality/receipt-intraop-acceptance-batch11-20261113.mjs`
- `tools/question-quality/receipt-intraop-acceptance-batch9-20261112.mjs`
