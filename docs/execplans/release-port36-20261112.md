# Release port 36 / Level 5 rebind 36 (2026-11-12)

## Goal and constraints

Port only accepted topic batches 7-8, phone memory rounds 1-3, and late-game pacing round 2 into GS-release (manager HEAD 3bc237a1). Main is read-only; exclude ENG-I01 and all intraop drafts. No Git, network, installs, agents, commits or deploy. Preserve exact owner-version approvals and frozen saves/history. Local compression writes must remain false.

## Ownership and procedure

Immutable intake, manifests, beforeimages, frozen candidates and content diff: `.local-dev/release-port36-20261112/`. Dispositions: `.local-dev/release-verify/port36-20261112.json`. Port shared files by accepted hunks, preserving release adapters and strict source pins. Recover recorded pacing types/reducer postimages rather than concurrent Main versions.

Run actual native journey/lower into staging, with old-content, content-only and balance-only controls. Preserve driver/guard assertions and inputHistory; established liveCap correction only. Publish only after zero walkouts, reconciled cash and pacing reference 26,281 +/-10% pass. Baseline: 31,511 commands, 6,524,517 cents, 492 completions, zero walkouts.

## Validation

Seven CI=true workspace suites with threads, all typechecks, boundaries, player build. Existing L4/L5 earned/partial goals above/below 330; frozen encounters, FSRS; plain/compressed journal readability. Retain exact logs/receipts and append GS028 and CURRENT_THREAD_HANDOFF.

## Progress

- [x] Entry: 7,994 public files, all 609 bound inputs reproduce rebind35; 460 clinical inputs; 30 history entries.
- [x] Captured 171 milestone candidates and 444 scoped differences; recovered two pacing postimages to exclude ENG-I01.
- [x] Exported pre-port clinical projection.
- [x] Captured pre-port legacy runtime: all25 schema loads/120-minute continuations exact.
- [x] Ported recorded milestone files/hunks; strict source-pin authorization and precise absence inventories retained.
- [x] Acceptance/owner-version counts and hashes exact;135 admission/save checks,37 memory checks,37 pacing-save checks pass.
- [x] Actual journey/lower/three controls verified and published locally:35,236 commands /6,829,124 cents /550completed /0walkouts; first finish26,312. History30->31; guard unchanged.
- [x] Complete seven final suites, types, boundaries, build, dispositions and handoff.

Completed. Final native counts and exact validation are in the GS028 rebind36 handoff. Source/clinical/pin provenance is sealed by private receipts. No required work remains.

## Changed public paths (209)

- `apps/player/src/competition/useCompetition.tsx`
- `apps/player/src/diagnostics/problemDiagnostics.ts`
- `apps/player/src/facility/FacilityCanvas.tsx`
- `apps/player/src/main.tsx`
- `apps/player/src/mobile/performance/backgroundClock.test.ts`
- `apps/player/src/mobile/performance/idleWorkerRelease.ts`
- `apps/player/src/mobile/performance/phoneBackgroundBudget.test.ts`
- `apps/player/src/mobile/performance/runtimeCaseBank.ts`
- `apps/player/src/mobile/performance/runtimeCaseSlices.test.ts`
- `apps/player/src/mobile/performance/runtimeCatalogue.ts`
- `apps/player/src/mobile/performance/runtimeClinicalData.test.ts`
- `apps/player/src/mobile/performance/visibleInterval.test.ts`
- `apps/player/src/mobile/performance/visibleInterval.ts`
- `apps/player/src/playtime/browserUsage.ts`
- `apps/player/src/questionProgramBatch3SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch4SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch5SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch6SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch7SaveCompatibility.test.ts`
- `apps/player/src/questionProgramBatch7StatisticsAdmission.test.ts`
- `apps/player/src/questionProgramBatch8SaveCompatibility.test.ts`
- `apps/player/src/session/QuestionFlagProvider.tsx`
- `apps/player/src/session/cloud/codec.ts`
- `apps/player/src/session/cloud/codecAllocation.test.ts`
- `apps/player/src/session/cloud/codecCompression.ts`
- `apps/player/src/session/cloud/codecEvidence.ts`
- `apps/player/src/session/cloud/codecJson.ts`
- `apps/player/src/session/cloud/codecTasks.ts`
- `apps/player/src/session/cloud/gameSession.ts`
- `apps/player/src/session/cloud/importCampaigns.ts`
- `apps/player/src/session/cloud/journalCodec.ts`
- `apps/player/src/session/cloud/openingUploadLarge.test.ts`
- `apps/player/src/session/cloud/operationalEngine.worker.ts`
- `apps/player/src/session/cloud/operationalEngineClient.ts`
- `apps/player/src/session/cloud/operationalEngineDispatch.test.ts`
- `apps/player/src/session/cloud/operationalEngineDispatch.ts`
- `apps/player/src/session/cloud/operationalEngineProcessor.ts`
- `apps/player/src/session/cloud/operationalEngineProtocol.ts`
- `apps/player/src/session/cloud/operationalIdle.test.ts`
- `apps/player/src/session/cloud/operationalSessionEngine.ts`
- `apps/player/src/session/facilityClock.ts`
- `apps/player/src/session/goalDisplayLabels.test.tsx`
- `apps/player/src/session/goalDisplayLabels.ts`
- `apps/player/src/session/journalEncoding.test.ts`
- `apps/player/src/session/journalEncoding.ts`
- `apps/player/src/session/journalRangeDelete.test.ts`
- `apps/player/src/session/journalRangeDelete.ts`
- `apps/player/src/session/lateProgressionViews.test.ts`
- `apps/player/src/session/levelFiveLaunch.test.tsx`
- `apps/player/src/session/levelFiveProgressionViews.test.tsx`
- `apps/player/src/session/levelFourProgressionViews.test.tsx`
- `apps/player/src/session/levelFourRoomsViewModels.test.ts`
- `apps/player/src/session/localJournal.ts`
- `apps/player/src/session/localStorageBuildPolicy.test.ts`
- `apps/player/src/session/localStorageBuildPolicy.ts`
- `apps/player/src/session/storagePressure.test.ts`
- `apps/player/src/session/storagePressure.ts`
- `apps/player/src/session/topicRuntimeBindings.test.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `apps/player/src/ui/TutorialCoach.tsx`
- `apps/player/vite.config.ts`
- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/execplans/late-game-pacing-round2-20261112.md`
- `docs/execplans/phone-memory-20261112.md`
- `docs/execplans/question-topic-acceptance-batch7-20261112.md`
- `docs/execplans/question-topic-acceptance-batch8-20261112.md`
- `docs/execplans/release-port36-20261112.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- `docs/research/late-game-pacing-round2-20261112.md`
- `docs/research/owner-decision-answers-20261112.md`
- `docs/research/question-flag-d97aa716-20261112.json`
- `docs/research/question-topic-acceptance-batch7-20261112.md`
- `docs/research/question-topic-acceptance-batch7-clinical-confirmations-20261112.json`
- `docs/research/question-topic-acceptance-batch7-dispositions-20261112.json`
- `docs/research/question-topic-acceptance-batch7-files-20261112.json`
- `docs/research/question-topic-acceptance-batch7-packet-20261112.json`
- `docs/research/question-topic-acceptance-batch7-source-freeze-20261112.json`
- `docs/research/question-topic-acceptance-batch7-validation-20261112.json`
- `docs/research/question-topic-acceptance-batch8-20261112.md`
- `docs/research/question-topic-acceptance-batch8-dispositions-20261112.json`
- `docs/research/question-topic-acceptance-batch8-files-20261112.json`
- `docs/research/question-topic-acceptance-batch8-packet-20261112.json`
- `docs/research/question-topic-acceptance-batch8-source-freeze-20261112.json`
- `docs/research/question-topic-acceptance-batch8-validation-20261112.json`
- `docs/research/sources-question-flag-d97aa716-20261112.json`
- `packages/balance-config/src/late-game-balance.test.ts`
- `packages/balance-config/src/level-five-gift-retail.test.ts`
- `packages/balance-config/src/level-five-progression.test.ts`
- `packages/balance-config/src/level-five-progression.ts`
- `packages/balance-config/src/level-five-rooms.test.ts`
- `packages/balance-config/src/level-five-rooms.ts`
- `packages/balance-config/src/level-four-rooms.test.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/patient-library-wording-repair.test.ts`
- `packages/clinical-content/src/pilot-content.test.ts`
- `packages/clinical-content/src/playable-patient-narrative.test.ts`
- `packages/clinical-content/src/question-flags3-20261107.test.ts`
- `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-harden1-n3r4-acceptance-test-support.ts`
- `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch4-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch5-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch6-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch7-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch7-accepted-20261112.ts`
- `packages/clinical-content/src/question-program-batch7-accepted-data-20261112.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch8-accepted-20261112.ts`
- `packages/clinical-content/src/question-program-batch8-accepted-data-20261112.ts`
- `packages/clinical-content/src/question-ship-manifest-validation.ts`
- `packages/clinical-content/src/question-ship-manifest.test.ts`
- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/question-ship-projection.ts`
- `packages/clinical-content/src/question-ship-retirements.test.ts`
- `packages/clinical-content/src/question-ship-retirements.ts`
- `packages/clinical-content/src/question-stats1-20261108.test.ts`
- `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-topic-release-membership-20261112.test.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/facility-access-cache.ts`
- `packages/game-domain/src/facilityAccessCacheContext.test.ts`
- `packages/game-domain/src/guidance-progression.ts`
- `packages/game-domain/src/late-progression.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/src/types.ts`
- `packages/game-domain/tests/approved-clinical-admission.test.ts`
- `packages/game-domain/tests/content-robust-pacing.test.ts`
- `packages/game-domain/tests/game-domain.test.ts`
- `packages/game-domain/tests/late-game-pacing-round2.test.ts`
- `packages/game-domain/tests/late-progression.test.ts`
- `packages/game-domain/tests/level-five-launch.test.ts`
- `packages/game-domain/tests/level-five-progression.test.ts`
- `packages/game-domain/tests/level-five-rooms.test.ts`
- `packages/game-domain/tests/question-ship-gate.test.ts`
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`
- `packages/game-domain/tests/topic-runtime-bindings.test.ts`
- `scripts/qa/phone-art-loading.mjs`
- `scripts/qa/phone-runtime-budget-run.mjs`
- `scripts/qa/phone-runtime-budget.mjs`
- `scripts/qa/runtime-asset-fetch.mjs`
- `scripts/vite/runtime-clinical-data.ts`
- `scripts/vite/runtime-clinical-graph.ts`
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`
- `tests/fixtures/level-five-launch.ts`
- `tests/fixtures/level-five-legacy-behavior-20261012.json`
- `tools/qa/content-pacing-check.mjs`
- `tools/qa/content-pacing-check.test.mjs`
- `tools/qa/level-five-integration-results-20261012.json`
- `tools/question-quality/build-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/build-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/capture-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/capture-topic-acceptance-batch7-additional-20261112.mjs`
- `tools/question-quality/capture-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/fixtures/question-flags3-release-source-pins-20261107.json`
- `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-additional-before-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-after-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-d97-metadata-correction-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-epoch-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-literal-name-corrections-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-additional-before-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-after-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-before-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-consolidation-before-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-retained-metadata-20261112.json`
- `tools/question-quality/fixtures/question-topic-acceptance-batch8-source-migration-20261112.json`
- `tools/question-quality/fixtures/question-topic-batch7-retained-authoring-tests-20261112.json`
- `tools/question-quality/fixtures/question-topic-batch8-release-source-inventory-20261112.json`
- `tools/question-quality/handoff-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/handoff-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/integrate-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/integrate-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/question-topic-acceptance-batch7-lint-20261112.json`
- `tools/question-quality/question-topic-acceptance-batch8-lint-20261112.json`
- `tools/question-quality/receipt-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/receipt-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/record-topic-acceptance-batch7-migration-20261112.mjs`
- `tools/question-quality/record-topic-acceptance-batch8-20261112.mjs`
- `tools/question-quality/review-question-flag-d97aa716-round2-20261112.mjs`
- `tools/question-quality/review-topic-acceptance-batch7-20261112.mjs`
- `tools/question-quality/review-topic-acceptance-batch8-20261112.mjs`

## Excluded Main differences

Main versions of these paths were not ported; release bytes/absence were retained. This includes concurrent ENG-I01 and every intraop draft. The disposition JSON records per-path reasons and hashes.

- `apps/player/character-phlebotomy.html`
- `apps/player/character-proportions.html`
- `apps/player/character-rooms.html`
- `apps/player/src/art/characterBitmapArt.test.ts`
- `apps/player/src/art/characterBitmapArt.ts`
- `apps/player/src/art/characterPhlebotomyQa.before.json`
- `apps/player/src/art/characterPhlebotomyQa.frames.json`
- `apps/player/src/art/characterPhlebotomyQa.test.ts`
- `apps/player/src/art/characterPhlebotomyQa.ts`
- `apps/player/src/art/characterPhlebotomyQaModel.ts`
- `apps/player/src/art/characterProportions.generated.json`
- `apps/player/src/art/characterProportions.test.ts`
- `apps/player/src/art/characterProportions.ts`
- `apps/player/src/art/characterProportionsQa.ts`
- `apps/player/src/art/characterRoomProportions.generated.json`
- `apps/player/src/art/characterRoomProportions.test.ts`
- `apps/player/src/art/characterRoomProportions.ts`
- `apps/player/src/art/characterRoomQaModel.ts`
- `apps/player/src/art/characterRoomsQa.ts`
- `apps/player/src/diagnostics/problemDiagnostics.test.ts`
- `apps/player/src/facility/FacilityScene.ts`
- `apps/player/src/facility/approvedRoomPresentation.test.ts`
- `apps/player/src/facility/backlessRollingStools.test.ts`
- `apps/player/src/facility/characterPresentation.test.ts`
- `apps/player/src/facility/characterPresentation.ts`
- `apps/player/src/facility/characterRoomScaleIntegration.test.ts`
- `apps/player/src/facility/furnitureSeatLayering.test.ts`
- `apps/player/src/facility/phlebotomyPresentation.test.ts`
- `apps/player/src/facility/staffIdleSupports.test.ts`
- `apps/player/src/facility/types.ts`
- `apps/player/src/feedback/TesterFeedback.tsx`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/performance/phoneArt.generated.json`
- `apps/player/src/mobile/performance/staticCanvasTexture.ts`
- `apps/player/src/questionFlagD97aa716Round2SaveCompatibility.test.ts`
- `apps/player/src/questionFlagD97aa716SaveCompatibility.test.ts`
- `apps/player/src/session/cloud/cache.ts`
- `apps/player/src/session/cloud/codecEvidence.test.ts`
- `apps/player/src/session/cloud/codecWorker.test.ts`
- `apps/player/src/session/cloud/codecWorker.ts`
- `apps/player/src/session/cloud/codecWorkerNative.test.ts`
- `apps/player/src/session/cloud/coordinator.ts`
- `apps/player/src/session/cloud/diagnosticWorkloadPerformance.test.ts`
- `apps/player/src/session/cloud/entryStorage.ts`
- `apps/player/src/session/cloud/gameSession.test.tsx`
- `apps/player/src/session/cloud/nonretryableConflictSql.test.ts`
- `apps/player/src/session/cloud/operationalArrayAllocation.test.ts`
- `apps/player/src/session/cloud/releaseCodecHeadroom.test.ts`
- `apps/player/src/session/cloud/snapshotCodec.ts`
- `apps/player/src/session/cloud/tickPerformanceTestSupport.ts`
- `apps/player/src/session/cloud/watchdogs.test.ts`
- `apps/player/src/session/diagnosticProjectionDifferential.test.ts`
- `apps/player/src/session/engI01ProcedurePresentation.test.ts`
- `apps/player/src/session/flagFreeze.test.tsx`
- `apps/player/src/session/localJournal.test.ts`
- `apps/player/src/session/pediatricFamilyPresentation.ts`
- `apps/player/src/session/procedureContextPresentation.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/ChartPanel.tsx`
- `apps/player/src/ui/roomAccessFeedback.test.ts`
- `apps/player/src/ui/roomAccessTestSupport.ts`
- `packages/balance-config/src/app-role.test.ts`
- `packages/balance-config/src/diagnostic-timing.test.ts`
- `packages/balance-config/src/employee-training.test.ts`
- `packages/balance-config/src/employee-training.ts`
- `packages/balance-config/src/guidance-tips.ts`
- `packages/balance-config/src/level-five-executive.ts`
- `packages/balance-config/src/room-upgrades.test.ts`
- `packages/balance-config/src/room-upgrades.ts`
- `packages/clinical-content/src/question-authorized-test-timing-source-20261112.test.ts`
- `packages/clinical-content/src/question-authorized-test-timing-source-20261112.ts`
- `packages/clinical-content/src/question-flag-d97aa716-20261112-data.ts`
- `packages/clinical-content/src/question-flag-d97aa716-20261112.test.ts`
- `packages/clinical-content/src/question-flag-d97aa716-20261112.ts`
- `packages/clinical-content/src/question-flag-d97aa716-round2-20261112-data.ts`
- `packages/clinical-content/src/question-flag-d97aa716-round2-20261112.test.ts`
- `packages/clinical-content/src/question-flag-d97aa716-round2-20261112.ts`
- `packages/clinical-content/src/question-harden1-round2-20261110-data.ts`
- `packages/clinical-content/src/question-harden1-round2-20261110.test.ts`
- `packages/clinical-content/src/question-harden1-round2-20261110.ts`
- `packages/clinical-content/src/question-intraop-anesthetic-intraoperative-crises-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-anesthetic-intraoperative-crises-20261112.ts`
- `packages/clinical-content/src/question-intraop-anorectal-eua-and-fistula-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-anorectal-eua-and-fistula-20261112.ts`
- `packages/clinical-content/src/question-intraop-biliary-safety-and-duct-decisions-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-biliary-safety-and-duct-decisions-20261112.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-obstruction-dilation-and-peg-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-obstruction-dilation-and-peg-20261112.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-perforation-and-injury-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-perforation-and-injury-20261112.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-upper-gi-hemostasis-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-endoscopic-upper-gi-hemostasis-20261112.ts`
- `packages/clinical-content/src/question-intraop-enterotomy-and-contaminated-reconstruction-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-enterotomy-and-contaminated-reconstruction-20261112.ts`
- `packages/clinical-content/src/question-intraop-groin-hernia-anatomy-and-injury-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-groin-hernia-anatomy-and-injury-20261112.ts`
- `packages/clinical-content/src/question-intraop-laparoscopic-access-and-insufflation-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-laparoscopic-access-and-insufflation-20261112.ts`
- `packages/clinical-content/src/question-intraop-operative-hemorrhage-and-splenic-injury-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-operative-hemorrhage-and-splenic-injury-20261112.ts`
- `packages/clinical-content/src/question-intraop-polypectomy-technique-and-bleeding-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-polypectomy-technique-and-bleeding-20261112.ts`
- `packages/clinical-content/src/question-intraop-suspicious-polyps-retrieval-and-tattoo-20261112.test.ts`
- `packages/clinical-content/src/question-intraop-suspicious-polyps-retrieval-and-tattoo-20261112.ts`
- `packages/clinical-content/src/question-n4-acceptance-test-support.ts`
- `packages/clinical-content/src/question-new-n3-round4-20261110.test.ts`
- `packages/clinical-content/src/question-new-n4-20261110.test.ts`
- `packages/clinical-content/src/question-new-n4-round2-20261110.test.ts`
- `packages/clinical-content/src/question-new-n4-round2-20261110.ts`
- `packages/clinical-content/src/question-owner-decisions-20261112.test.ts`
- `packages/clinical-content/src/question-owner-decisions-20261112.ts`
- `packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch2-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch3-acceptance-test-support.ts`
- `packages/clinical-content/src/question-program-batch6-accepted-20261112.ts`
- `packages/clinical-content/src/question-topic-adrenal-men-endocrine-20261111.test.ts`
- `packages/clinical-content/src/question-topic-adrenal-men-endocrine-20261111.ts`
- `packages/clinical-content/src/question-topic-adult-urology-gynecology-20261111.test.ts`
- `packages/clinical-content/src/question-topic-adult-urology-gynecology-20261111.ts`
- `packages/clinical-content/src/question-topic-anal-cancer-20261111.test.ts`
- `packages/clinical-content/src/question-topic-anal-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-anesthesia-analgesia-pharmacology-20261111.test.ts`
- `packages/clinical-content/src/question-topic-anesthesia-analgesia-pharmacology-20261111.ts`
- `packages/clinical-content/src/question-topic-anorectal-benign-pelvic-floor-20261111.test.ts`
- `packages/clinical-content/src/question-topic-anorectal-benign-pelvic-floor-20261111.ts`
- `packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.test.ts`
- `packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts`
- `packages/clinical-content/src/question-topic-bariatric-metabolic-20261111.test.ts`
- `packages/clinical-content/src/question-topic-bariatric-metabolic-20261111.ts`
- `packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.test.ts`
- `packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.ts`
- `packages/clinical-content/src/question-topic-bowel-ibd-malabsorption-short-bowel-20261111.test.ts`
- `packages/clinical-content/src/question-topic-bowel-ibd-malabsorption-short-bowel-20261111.ts`
- `packages/clinical-content/src/question-topic-breast-benign-high-risk-20261111.test.ts`
- `packages/clinical-content/src/question-topic-breast-benign-high-risk-20261111.ts`
- `packages/clinical-content/src/question-topic-breast-cancer-20261111.test.ts`
- `packages/clinical-content/src/question-topic-breast-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-burns-inhalation-20261111.test.ts`
- `packages/clinical-content/src/question-topic-burns-inhalation-20261111.ts`
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts`
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts`
- `packages/clinical-content/src/question-topic-colorectal-polyps-cancer-20261111.test.ts`
- `packages/clinical-content/src/question-topic-colorectal-polyps-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.test.ts`
- `packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.ts`
- `packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts`
- `packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts`
- `packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.test.ts`
- `packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.ts`
- `packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts`
- `packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.ts`
- `packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts`
- `packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.ts`
- `packages/clinical-content/src/question-topic-esophagus-structural-inflammatory-emergencies-20261111.test.ts`
- `packages/clinical-content/src/question-topic-esophagus-structural-inflammatory-emergencies-20261111.ts`
- `packages/clinical-content/src/question-topic-ethics-professionalism-20261111.test.ts`
- `packages/clinical-content/src/question-topic-ethics-professionalism-20261111.ts`
- `packages/clinical-content/src/question-topic-fluids-electrolytes-acid-base-20261111.test.ts`
- `packages/clinical-content/src/question-topic-fluids-electrolytes-acid-base-20261111.ts`
- `packages/clinical-content/src/question-topic-gallbladder-duct-stones-20261111.test.ts`
- `packages/clinical-content/src/question-topic-gallbladder-duct-stones-20261111.ts`
- `packages/clinical-content/src/question-topic-head-neck-salivary-20261111.test.ts`
- `packages/clinical-content/src/question-topic-head-neck-salivary-20261111.ts`
- `packages/clinical-content/src/question-topic-hematology-transfusion-coagulation-20261111.test.ts`
- `packages/clinical-content/src/question-topic-hematology-transfusion-coagulation-20261111.ts`
- `packages/clinical-content/src/question-topic-hernia-groin-20261111.test.ts`
- `packages/clinical-content/src/question-topic-hernia-groin-20261111.ts`
- `packages/clinical-content/src/question-topic-hernia-ventral-abdominal-wall-20261111.test.ts`
- `packages/clinical-content/src/question-topic-hernia-ventral-abdominal-wall-20261111.ts`
- `packages/clinical-content/src/question-topic-liver-benign-portal-infection-20261111.test.ts`
- `packages/clinical-content/src/question-topic-liver-benign-portal-infection-20261111.ts`
- `packages/clinical-content/src/question-topic-liver-malignancy-20261111.test.ts`
- `packages/clinical-content/src/question-topic-liver-malignancy-20261111.ts`
- `packages/clinical-content/src/question-topic-melanoma-cutaneous-cancer-20261111.test.ts`
- `packages/clinical-content/src/question-topic-melanoma-cutaneous-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-neuro-orthopedic-essentials-20261111.test.ts`
- `packages/clinical-content/src/question-topic-neuro-orthopedic-essentials-20261111.ts`
- `packages/clinical-content/src/question-topic-nutrition-support-metabolism-20261111.test.ts`
- `packages/clinical-content/src/question-topic-nutrition-support-metabolism-20261111.ts`
- `packages/clinical-content/src/question-topic-oncology-genetics-principles-20261111.test.ts`
- `packages/clinical-content/src/question-topic-oncology-genetics-principles-20261111.ts`
- `packages/clinical-content/src/question-topic-ostomy-enterocutaneous-fistula-20261111.test.ts`
- `packages/clinical-content/src/question-topic-ostomy-enterocutaneous-fistula-20261111.ts`
- `packages/clinical-content/src/question-topic-pancreas-acute-pancreatitis-20261111.test.ts`
- `packages/clinical-content/src/question-topic-pancreas-acute-pancreatitis-20261111.ts`
- `packages/clinical-content/src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.test.ts`
- `packages/clinical-content/src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts`
- `packages/clinical-content/src/question-topic-parathyroid-calcium-20261111.test.ts`
- `packages/clinical-content/src/question-topic-parathyroid-calcium-20261111.ts`
- `packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts`
- `packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.ts`
- `packages/clinical-content/src/question-topic-pediatric-neck-thoracic-gu-20261111.test.ts`
- `packages/clinical-content/src/question-topic-pediatric-neck-thoracic-gu-20261111.ts`
- `packages/clinical-content/src/question-topic-perioperative-risk-recovery-20261111.test.ts`
- `packages/clinical-content/src/question-topic-perioperative-risk-recovery-20261111.ts`
- `packages/clinical-content/src/question-topic-quality-safety-systems-20261111.test.ts`
- `packages/clinical-content/src/question-topic-quality-safety-systems-20261111.ts`
- `packages/clinical-content/src/question-topic-skin-soft-tissue-benign-infection-20261111.test.ts`
- `packages/clinical-content/src/question-topic-skin-soft-tissue-benign-infection-20261111.ts`
- `packages/clinical-content/src/question-topic-small-bowel-obstruction-ileus-20261111.test.ts`
- `packages/clinical-content/src/question-topic-small-bowel-obstruction-ileus-20261111.ts`
- `packages/clinical-content/src/question-topic-soft-tissue-sarcoma-desmoid-20261111.test.ts`
- `packages/clinical-content/src/question-topic-soft-tissue-sarcoma-desmoid-20261111.ts`
- `packages/clinical-content/src/question-topic-spleen-asplenia-20261111.test.ts`
- `packages/clinical-content/src/question-topic-spleen-asplenia-20261111.ts`
- `packages/clinical-content/src/question-topic-statistics-20261111.test.ts`
- `packages/clinical-content/src/question-topic-statistics-20261111.ts`
- `packages/clinical-content/src/question-topic-stomach-neoplasia-20261111.test.ts`
- `packages/clinical-content/src/question-topic-stomach-neoplasia-20261111.ts`
- `packages/clinical-content/src/question-topic-stomach-ulcer-bleeding-motility-20261111.test.ts`
- `packages/clinical-content/src/question-topic-stomach-ulcer-bleeding-motility-20261111.ts`
- `packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts`
- `packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.ts`
- `packages/clinical-content/src/question-topic-thoracic-lung-pleura-mediastinum-20261111.test.ts`
- `packages/clinical-content/src/question-topic-thoracic-lung-pleura-mediastinum-20261111.ts`
- `packages/clinical-content/src/question-topic-thyroid-nodules-cancer-20261111.test.ts`
- `packages/clinical-content/src/question-topic-thyroid-nodules-cancer-20261111.ts`
- `packages/clinical-content/src/question-topic-transplant-immunosuppression-20261111.test.ts`
- `packages/clinical-content/src/question-topic-transplant-immunosuppression-20261111.ts`
- `packages/clinical-content/src/question-topic-trauma-head-spine-extremities-20261111.test.ts`
- `packages/clinical-content/src/question-topic-trauma-head-spine-extremities-20261111.ts`
- `packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.test.ts`
- `packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts`
- `packages/clinical-content/src/question-topic-trauma-thoracic-20261111.test.ts`
- `packages/clinical-content/src/question-topic-trauma-thoracic-20261111.ts`
- `packages/clinical-content/src/question-topic-vascular-aorta-20261111.test.ts`
- `packages/clinical-content/src/question-topic-vascular-aorta-20261111.ts`
- `packages/clinical-content/src/question-topic-vascular-carotid-20261111.test.ts`
- `packages/clinical-content/src/question-topic-vascular-carotid-20261111.ts`
- `packages/clinical-content/src/question-topic-vascular-limb-mesenteric-arterial-20261111.test.ts`
- `packages/clinical-content/src/question-topic-vascular-limb-mesenteric-arterial-20261111.ts`
- `packages/clinical-content/src/question-topic-vascular-venous-lymphatic-access-20261111.test.ts`
- `packages/clinical-content/src/question-topic-vascular-venous-lymphatic-access-20261111.ts`
- `packages/clinical-content/src/question-topic-wound-healing-immunology-20261111.test.ts`
- `packages/clinical-content/src/question-topic-wound-healing-immunology-20261111.ts`
- `packages/clinical-content/src/schema.ts`
- `packages/game-domain/src/clinical-case-eligibility.ts`
- `packages/game-domain/src/facilityNavigation.ts`
- `packages/game-domain/src/facilityNavigationReference.testSupport.ts`
- `packages/game-domain/src/founder-consults.ts`
- `packages/game-domain/src/incrementalEvidenceOwnership.test.ts`
- `packages/game-domain/src/incrementalEvidenceOwnership.ts`
- `packages/game-domain/src/incrementalEvidenceProjection.test.ts`
- `packages/game-domain/src/incrementalEvidenceProjection.ts`
- `packages/game-domain/src/incrementalEvidenceReferences.test.ts`
- `packages/game-domain/src/incrementalEvidenceReferences.ts`
- `packages/game-domain/src/incrementalEvidenceRetirement.test.ts`
- `packages/game-domain/src/incrementalEvidenceRetirement.ts`
- `packages/game-domain/src/incrementalEvidenceValues.test.ts`
- `packages/game-domain/src/incrementalEvidenceValues.ts`
- `packages/game-domain/src/incrementalTickClone.test.ts`
- `packages/game-domain/src/incrementalTickClone.ts`
- `packages/game-domain/src/legacy-procedure-contexts.ts`
- `packages/game-domain/src/pediatric-family.ts`
- `packages/game-domain/src/pediatric-procedure-flow.ts`
- `packages/game-domain/src/persistence.ts`
- `packages/game-domain/src/procedure-companions.ts`
- `packages/game-domain/src/procedure-context.ts`
- `packages/game-domain/src/readonlyProjectionMemo.ts`
- `packages/game-domain/src/retired-service-history.ts`
- `packages/game-domain/src/routineAvailabilityReference.testSupport.ts`
- `packages/game-domain/src/service-operations.ts`
- `packages/game-domain/src/settledStateQueries.test.ts`
- `packages/game-domain/src/settledStateQueries.ts`
- `packages/game-domain/src/waiting-destinations.ts`
- `packages/game-domain/tests/eng-i01-live-procedure.fixture.ts`
- `packages/game-domain/tests/eng-i01-live-procedure.test.ts`
- `packages/game-domain/tests/founder-consults.fixture.ts`
- `packages/game-domain/tests/founder-qa-attendance.fixture.ts`
- `packages/game-domain/tests/level-five-executive.test.ts`
- `packages/game-domain/tests/level-four-persistence.test.ts`
- `packages/game-domain/tests/readonlyProjectionMemo.test.ts`
- `packages/game-domain/tests/routine-endoscopy-ready.fixture.ts`
- `packages/game-domain/tests/routine-endoscopy-ready.test.ts`
- `packages/game-domain/tests/waiting-chart-attendance.fixture.ts`
- `packages/game-domain/tests/waiting-chart-attendance.test.ts`
- `tests/e2e/character-resolution-zoom.spec.ts`
- `tests/e2e/cloud-recovery.spec.ts`
- `tests/e2e/helpers.ts`
- `tests/e2e/room-upgrades.spec.ts`
- `tests/e2e/splitter-map-shade.spec.ts`
- `tests/e2e/ui-density.spec.ts`
- `tests/fixtures/diagnostic-workload.ts`
- `tests/fixtures/founder-consult-rebound-l4-20261110.json`
- `tests/fixtures/late-game-costs-before-20261111.json`
- `tests/fixtures/late-progression-pre-policy-checkpoints-20261111.json`
- `tools/qa/tick-state-differential.mjs`

## Bound input changes

| Input | Previous SHA-256 | Rebound SHA-256 |
|---|---|---|
| `packages/balance-config/src/level-five-progression.ts` | `8bd7fd778839087a6a60fd65512d02db0a19c0c9c8d5b05575248b3d28cc4f9a` | `fa3bbe593f079b07d4dfecb21ca26880b784f9e845c65b82e73edb9414632f62` |
| `packages/balance-config/src/level-five-rooms.ts` | `cc8580b8927eda5886c99675c11f5900fc57eb16d63a207482b9040345c6e90b` | `217ec1b575eda222582d832c39f29be429003613256637a8e5b31dcf71513229` |
| `packages/balance-config/src/prototype-balance.ts` | `f3d41efae64f032cc6a79f9ff8c0a570dc3f4188218b04ff3e9612df80f9c7b1` | `476da4e60e39a17c058dcc1222ff5e9f99c274c9117ce00590387a1104cbcc40` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `c1149f878874858589737930b2c458173cdf2bb98a41a4b51fe18f486260c027` | `721dd09e871137e975c15edb39270e02406a5b058b9aca41b20f637e4c28bac9` |
| `packages/clinical-content/src/index.ts` | `485749eb369c0f499b0e34a9ae616f803e22ce4e81d500dc056abf2f0dea8ba1` | `a6f8bec343b46ad08b0c810c0b9b6b32f5fcc849adb50debc1deb4d4cb0b0461` |
| `packages/clinical-content/src/question-harden1-n3r4-acceptance-test-support.ts` | `b11276425ea732828209d2461c5134671c7d2f6fc2f19cdf31189888369fb284` | `da14487e87d8559f7ba44cdbc768c5679512d0be915e3b6c8f3312d0c5e43837` |
| `packages/clinical-content/src/question-program-batch4-acceptance-test-support.ts` | `bc1b4ba757b0110e8154905dfc2137ae8309a31973e89c5aa6644f4c66b2f15e` | `89bf7b25592ece7dff22a7810e6a4eef23da4189bf85aa43c971924ee669a22b` |
| `packages/clinical-content/src/question-program-batch5-acceptance-test-support.ts` | `656c21f99547f2519e69c9843a0a089c02b49d7c0cf81d70e3c3bc2d9be9b7d2` | `753260c76f17c6a4a241f3d01d662bcc5d77034c8a89da5e772ec433265ffa5f` |
| `packages/clinical-content/src/question-program-batch6-acceptance-test-support.ts` | `c5b17f23e4be2bf2ab991036dd9f6167b230a06c75b3a3a8a6dcf6f941e761af` | `70a3856269a45bb72210c9a130b5535e10a539d0c09abacc9c24a8f21a126e67` |
| `packages/clinical-content/src/question-program-batch7-acceptance-test-support.ts` | `new input` | `72ce746b5a5974e63a283f97521bee1a86e81d0dadbc0e694ca52806d1038f38` |
| `packages/clinical-content/src/question-program-batch7-accepted-20261112.ts` | `new input` | `38a24d41be10e42b5d296587fe0da036b8ce92a5661767bec663701fbae8a7c2` |
| `packages/clinical-content/src/question-program-batch7-accepted-data-20261112.ts` | `new input` | `a0bcf0fec28968c2d8dbfacd684deee669f90f5c3872b0f7d4c43ed367ec0bba` |
| `packages/clinical-content/src/question-program-batch8-acceptance-test-support.ts` | `new input` | `56ba3f6694449272600f5490935f1b9e8950f30dd01bb5236ec93b5cfcac09ec` |
| `packages/clinical-content/src/question-program-batch8-accepted-20261112.ts` | `new input` | `a5d8211c4e395f709b5884b91a99e6f1c8fb318d8324231f06b1018c6c89dddf` |
| `packages/clinical-content/src/question-program-batch8-accepted-data-20261112.ts` | `new input` | `a5bc4d6055f905d83f517b7ee2cb3e36aee3debc43aec8ea7b110bd23bb62528` |
| `packages/clinical-content/src/question-ship-manifest-validation.ts` | `b5b4a869e64ae70eca8a024bd36b0886f13f667e005a0adcfc7bce3c72c73a11` | `e8d58737759d1566cda3d0bb8c8ce6b6b61e3f686dd433d55d434e92d0c3c676` |
| `packages/clinical-content/src/question-ship-manifest.ts` | `49c8f1e34b93d9815e5e9ec5cbda1c46e41ac0c46c74440c24a903d35e6f0883` | `e78592f1001862207e80e06466da137731b74a852147922f9c519bcaad6e6a22` |
| `packages/clinical-content/src/question-ship-projection.ts` | `29351156d08b1d94feb70d1d513357a8eb26c029e1f8f94c31c8a5ca6bb79689` | `12beaa074bed94d101e047edc6786fb340b582bed2c8f9563e1c1b1eb5aec9bc` |
| `packages/clinical-content/src/question-ship-retirements.ts` | `new input` | `0724b2aa34092b8dda801419a670c6b86d3b81c16c109e501a9ae297ff40f93b` |
| `packages/clinical-content/src/synthetic-content.ts` | `73ebbee54704c8cc86d0bba3851844ff7674c6033a8e493f39c41bce52227a83` | `1a87490f6ba82ed0bd0a1673e10e0fe5f6be48cfc584f31d3a22551cb14fcc38` |
| `packages/game-domain/src/facility-access-cache.ts` | `e10fa45bb74d16882972daffef87836c0abffe5e5eb68fbccd9f367d2aeebc61` | `40f186ccb7db3122da83550b882f7e4f161592ae697fdaa4474b4c750aa5a0cd` |
| `packages/game-domain/src/guidance-progression.ts` | `d54c7c2c74f7174a8be9cc939d013cb214aa1a288ad3ab38b928bd036d0039a1` | `0f4eaebda456349cdf2ffee8143d0a6d0b2099094ea3dee74dfad974ae748546` |
| `packages/game-domain/src/late-progression.ts` | `176b55ea42c824435dd03137a774188b1e2710ba85c29929b020d33b923e67de` | `387deaa11f5c927a1fb264289a32b9d8bf99b4a30ddcc3ebcb176e4cc634c416` |
| `packages/game-domain/src/reducer.ts` | `8bf096d9eef46caf79d919835a1f1ca65007871a674734c1828643b94dfdd63a` | `efaafe0995aae79f7e39abc760df528ef0c5bc198dfa404abd0c2c3e79fede37` |
| `packages/game-domain/src/selectors.ts` | `fc01be3ce35fa0007bb48e7c88e5283f2546a7b93ff627dcc7e58e244e2c5e88` | `f7046cdd69fed2501ba1a05f1a77c94a382ad6950e00835e24de3843bf75e84c` |
| `packages/game-domain/src/test-choice-orders.ts` | `793450bed94248300965c719be76fd068d35b3f59ba899450568ddbe73f502fe` | `e08fd207f81a6d07a5ac4e02f3f770653a6c6755d3d92d8756c6f118ee2bde03` |
| `packages/game-domain/src/types.ts` | `3382d8f3fcf425ee116f1c3b56beda360eaea6e501ca629eedfe7ae8485afbaf` | `3d83415944e7c6c466bdeb7a9ccf74151cc64becebce8673de0d0aa2c4bd1c4e` |

## Follow-up: phone memory Round 4

Manager browser validation found reload-to-chooser exceeded 5 s. Port only the 14 recorded Round4 source/test/entry paths and its documentation section. Preserve the manager clinical Vitest config and compression writes false. Main remains read-only; exclude ENG-I01 and intraop drafts. Intake/beforeimages/recorded patches are in `.local-dev/release-port36-20261112/round4/`.

- [x] Freeze intake and verify all fourteen recorded hashes and normalized preimages.
- [x] Port recorded hunks; zero bound-input intersections and unchanged rebind36 artifacts.
- [x] No source-pin delta required; all original guards remain exact.
- [x] Focus41 and all seven suites pass (851files/13594tests/one existing skip); seven types, boundaries, build pass.
- [x] Dispositions and final follow-up handoffs completed; browser acceptance remains with manager.

The browser 5 s regression requires the manager browser rerun; this worker validates the port and Node checks.

### Round4 recorded paths and validation

| Round4 source/test/entry path | Release before SHA-256 | Release after SHA-256 |
|---|---|---|
| `apps/player/src/main.tsx` | `5a44d5c72cf7d10046920449b41db96867c1541d472eabb3baf4becc6c4bff05` | `b7afc0cb6143b017c8becc51c4e9ccba9f06533990800d65ecf0189a1e6738a0` |
| `apps/player/src/App.tsx` | `c91141465a69ddd807be112126f39e91bdd8fa2c36488cfd119f790e9da672b6` | `d4ace4f1e426fa35e2e163a000b1fa8e66750ca5e8f8de15f999d45ff27bb339` |
| `apps/player/src/session/prototypeStorage.ts` | `b507eba29e7156f8dd6a692169e46410a6805b5d0bba9b745c4b74ee590ce6a4` | `47059b80a2be3658029e3fd90ad7d0b70e302279dc652827543dc135fa25e49b` |
| `apps/player/src/ui/OpeningSequence.tsx` | `2cda3f55f46e3f6a056ae0667e44150fe898fa206c92fff971f14b0b1531b9ad` | `c6411a8b4c10f856a994c0d6c1aaa4d3468ef328a806e4b2634f6d638203876c` |
| `apps/player/src/mobile/performance/runtimeCatalogue.ts` | `4130621e35e1aa36c067ac3dd60150e2e668c34014141e4e97c15a6abe9fe8e9` | `b6b718acf6bc0aaafa6dd92a964a7cce62cc64d697c0f4eb014487f6270dc864` |
| `apps/player/src/mobile/performance/runtimeClinicalData.test.ts` | `62e32c69298de78e3e5ca899e818115ae392f058765d18a409e05c69877e882a` | `10141b640489e56893a836abafacf690202aef81adf5d64dd84f67f75dd2db72` |
| `scripts/vite/runtime-clinical-data.ts` | `9d134cedb3c10bbb0d3c7b9c232ee267274f44b881e351fe1fd88de4e8891090` | `edacd3f1d12d3e003704e8fb551727424a2a942952da565b79522109875755b7` |
| `scripts/vite/runtime-clinical-graph.ts` | `343dcbe6f7d365a9257b1100723141e1ac2e75b6def145eee24a58fdfee48024` | `078fd992101aea1a88e88f4cf12b50ff1ac47d9853b423520bdb991dba1ed2e7` |
| `apps/player/src/App.localCatalogueOpening.test.tsx` | `new` | `0d365bf914191f9df59257e8cf9394151e06e97c08f8a1e09ed74f651fdbc027` |
| `apps/player/src/mobile/performance/runtimeYield.test.ts` | `new` | `555c7fb3d75db0415d98b45f74e16604f0de7c5e36bcf5be2cc2d701c92b723c` |
| `apps/player/src/session/prototypeStorageCatalogue.test.ts` | `new` | `b83271e1782f430bae9e603a3c1787aa14280d27186ddd3e71a9e02ca7914831` |
| `apps/player/index.html` | `2eb970728bbca193cd9ed42d386d3ba830b40029a232019d096541745a6a3eb5` | `ad65cad761f5af715ea21dba914ebdf752dc86b912ccadee1edca0ee631116f5` |
| `apps/player/public/startup-recovery.js` | `new` | `b92e01c2f876dc9ee06c49d96558016f0989b57355f7468e40cbb2c532a1c5ca` |
| `apps/player/src/ui/startupRecovery.test.ts` | `new` | `f66b33ee8b62ca54cdb205d3e2ae840b267d32973a9b159a54cf2cb7bab91bb1` |

| Workspace | Files | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| player | 448 | 5475 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-content | 141 | 1744 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |
| game-domain | 213 | 6000 | 0 | 1 |

Rebind36 bytes and all616 bindings are unchanged. See GS028 follow-up for artifact hashes and exact native summaries. Manager clinical config and three preexisting screenshots are preserved.
