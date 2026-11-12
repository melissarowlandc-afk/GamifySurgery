# Authorized test timing source pins - 2026-11-12

Appended the manager's three exact timeout/comment edits to the protected-source
migration chain. The batch6 source helper first verifies each complete current
postimage and the exact authorized substitutions, then restores its retained
preimage for the earlier original digest assertions. Seven regression tests
pass, covering all three files, extra edits and timing rollbacks.

All 23 original capture files, containing 52 digest references to these paths,
retain their exact recorded hashes. The three manager-edited files match their
intake postimages. The integration changes two lines in the existing batch6
test helper. Its new helper and ledger are limited to test-source verification.

| Manager input | Timing preimage SHA-256 | Authorized postimage SHA-256 |
| --- | --- | --- |
| apps/player/src/session/cloud/openingUploadLarge.test.ts | e1169711f0874b57db8eb3d3527af554ce5133dc95c23f8685b8a60534320568 | 731639dde746461929a9ad0b58af102d4fe1e2e4f558a1df0416630b2d2a48a1 |
| apps/player/src/session/cloud/automaticResolution.test.ts | 09726190a2b74f2c10864ea2b97bb1d3ac5d451365beddd5d66864b850ef482a | 65e47a749ca545ea166250bf3299d5ac5d2f9dac3f305717257c7d541c439790 |
| apps/player/src/App.cloudLifecycle.test.tsx | c848c2021141cc25d5d67af7b258a634493642e311695a79c2da2bfc6d78fbaf | 1e9c701b6dbdd5834809218f08760feffd2d5980ee1f7d077a7f9b09715c7b0c |

The retained older source differences remain visible. Inverting the new
automaticResolution timing edit returns its exact batch6 09726190... hash.
The original older 090773de... pin still differs, exactly as in batch6.
The openingUploadLarge timing preimage e1169711... differs from the older
9048f1b4... capture. The App.cloudLifecycle timing preimage c848c202... matches
the prior codec fixture repair receipt and differs from older a2502292...
captures. Only the new authorized timing deltas are removed by this migration.

| Run | Files | Pass | Fail | Collection failures | Skip | Native exit | Duration |
| --- | --- | --- | --- | --- | --- | --- | --- |
| clinical-focused | 5 | 231 | 3 | 0 | 0 | 1 | Duration  17.60s (transform 8.61s, setup 0ms, import 25.99s, tests 4.93s, environment 0ms) |
| clinical-full | 202 | 2949 | 10 | 0 | 0 | 1 | Duration  257.06s (transform 33.02s, setup 0ms, import 441.65s, tests 45.72s, environment 15ms) |
| player-focused | 4 | 89 | 0 | 0 | 0 | 0 | Duration  68.12s (transform 17.61s, setup 0ms, import 31.90s, tests 100.48s, environment 0ms) |
| player-full | 435 | 5205 | 70 | 1 | 0 | 1 | Duration  1594.43s (transform 31.48s, setup 0ms, import 944.93s, tests 2187.59s, environment 36ms) |

Clinical typecheck passes. Clinical failure comparison with batch6 gives
10 retained titles, 0 new titles and
0 resolved titles. The seven new checks account for the additional
passing clinical tests. Current focused player remains 89/89. The full player
run passes 89/89 tests covered by that exact batch6 baseline.
Batch6 has no full-player baseline. The earlier domain-worker partial player
run shares 18 current failure titles.
The remaining 52 full-player failure titles are outside that earlier comparison.

The full player residuals comprise 37 expectation mismatches
for room prices, goals, training or inspection outputs, 31 fixture tests
that encounter missing cases or encounters, and 2 content-rendering expectations.
The content expectations concern batch3 option feedback and a legacy statistics
explanation. At case.topic.surgical-infection-antibiotics.incisional-response.v1,
the batch3 test compares an authored {patientName} rationale with its runtime
patient-name rendering. The statistics assertion expects earlier explanation
wording. One pediatric chart module also fails collection while looking
up a case ID. These results extend the available focused baseline. Their full
titles, primary errors and comparison records are retained below and in JSON.

| Player file | Collection error |
| --- | --- |
| apps/player/src/session/pediatricChartsViewModels.test.ts | Cannot read properties of undefined (reading 'id') |

| Affected full-player file | Pass | Fail |
| --- | --- | --- |
| apps/player/src/App.cloudLifecycle.test.tsx | 18 | 0 |
| apps/player/src/questionFlags4SaveCompatibility.test.ts | 4 | 0 |
| apps/player/src/questionHarden1N3r4SaveCompatibility.test.ts | 7 | 0 |
| apps/player/src/questionN4SaveCompatibility.test.ts | 9 | 0 |
| apps/player/src/questionProgramBatch1SaveCompatibility.test.ts | 21 | 0 |
| apps/player/src/questionProgramBatch2SaveCompatibility.test.ts | 46 | 0 |
| apps/player/src/questionProgramBatch3SaveCompatibility.test.ts | 420 | 1 |
| apps/player/src/questionProgramBatch3StatisticsAdmission.test.ts | 24 | 0 |
| apps/player/src/questionProgramBatch4SaveCompatibility.test.ts | 589 | 0 |
| apps/player/src/questionProgramBatch4StaffAdmission.test.ts | 7 | 0 |
| apps/player/src/questionProgramBatch5SaveCompatibility.test.ts | 47 | 0 |
| apps/player/src/questionProgramBatch6SaveCompatibility.test.ts | 8 | 0 |
| apps/player/src/questionShipSaveCompatibility.test.ts | 33 | 0 |
| apps/player/src/questionStats1SaveCompatibility.test.ts | 256 | 0 |
| apps/player/src/session/cloud/automaticResolution.test.ts | 32 | 0 |
| apps/player/src/session/cloud/openingUploadLarge.test.ts | 1 | 0 |

| Suite | File | Remaining failing test |
| --- | --- | --- |
| clinical | packages/clinical-content/src/question-flags3-20261107.test.ts | flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact |
| clinical | packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts | exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures |
| clinical | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes |
| clinical | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage |
| clinical | packages/clinical-content/src/question-stats1-20261108.test.ts | stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration |
| clinical | packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts | stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions |
| clinical | packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts | two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items |
| clinical | packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts | esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case |
| clinical | packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts | pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review |
| clinical | packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts | surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue |
| player | apps/player/src/questionProgramBatch3SaveCompatibility.test.ts | topic batch3 default admission and all retired frozen identities admits 'case.topic.surgical-infection-antibio…' and completes its exact format3 save |
| player | apps/player/src/mobile/levelFiveGoals.test.tsx | M6 phone Goals chip and sheet through the shared session advances a ready old Level 4 save through chip once and shows locked Level 5 goals |
| player | apps/player/src/mobile/levelFiveGoals.test.tsx | M6 phone Goals chip and sheet through the shared session advances a ready old Level 4 save through sheet once and shows locked Level 5 goals |
| player | apps/player/src/mobile/levelFiveGoals.test.tsx | M6 phone Goals chip and sheet through the shared session advances a ready old Level 4 save through desktop once and shows locked Level 5 goals |
| player | apps/player/src/session/breadButterPresentation.test.ts | September 17 bread-and-butter chart presentation renders every admitted profile coherently and displays every node choice wait |
| player | apps/player/src/session/briefEarlyLevelsPresentation.test.ts | September 17 brief early-level chart presentation renders each runtime patient and every choice wait |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.examination |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.waiting |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.bathroom |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.minor_procedure |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.ultrasound |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.xray |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.ct |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.phlebotomy |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.evs_closet |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.endoscopy |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.periop_recovery |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.training |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.coffee_kiosk |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.glp1_telehealth_suite |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.ambulatory_or |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.laboratory |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.pharmacy |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.maintenance_workshop |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.staff_break |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.surgeon_office |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.vending |
| player | apps/player/src/session/buildViewModels.test.ts | approved room upgrade ladders in player views shows the complete playable ladder for room.reading |
| player | apps/player/src/session/chartFeedbackPresentation.test.tsx | chart decision feedback withholds the key before submission and keeps returned findings only in the next current update |
| player | apps/player/src/session/chartFeedbackPresentation.test.tsx | chart decision feedback acknowledges wrong-answer feedback before a deliberate close without skipping the pending route |
| player | apps/player/src/session/chartStructuredFields.test.tsx | frozen team discussion structured-field projection projects legacy discussions without exposing feedback before submission |
| player | apps/player/src/session/clinicalServiceLabels.test.ts | clinical service choice labels uses the same neutral timing label for live routes and configured fallback estimates |
| player | apps/player/src/session/clinicalServiceLabels.test.ts | clinical service choice labels does not label answered or pending history as unavailable |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation formats fractional pending time in the actual chart and step without mutating frozen work |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation uses each shared total in both answer lists, including distractors and walking |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation shows a reached visual result during return while retaining the next-decision care gate |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation keeps background pathology visible after visual delivery unlocks the next decision |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation does not reveal combined biopsy prose when only the visual milestone is reached |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation shows no finite total countdown when a frozen local pathology phase loses capacity |
| player | apps/player/src/session/diagnosticTimingViewModels.test.ts | diagnostic chart and facility presentation shows a terminal endoscopy order after an earlier laboratory result has been delivered |
| player | apps/player/src/session/earlyLevelsPresentation.test.ts | September 13 early-level chart presentation resolves one named age-and-sex presentation and complete timing display for every new node |
| player | apps/player/src/session/employeeTrainingViewModels.test.ts | employee training presentation does not use a historical diagnostic order's nominal due date when another order is selected |
| player | apps/player/src/session/goalDisplayLabels.test.tsx | player-only goal display labels reviews every Level 4 goal, preserves full requirements and leaves the serialized game unchanged |
| player | apps/player/src/session/goalDisplayLabels.test.tsx | player-only goal display labels reviews every Level 5 goal, preserves full requirements and leaves the serialized game unchanged |
| player | apps/player/src/session/goalDisplayLabels.test.tsx | player-only goal display labels keeps Level 5 progress compact while retaining the full current-level and workforce context |
| player | apps/player/src/session/levelFiveEconomyQa.test.tsx | M8 funded economy and actual inspection in both shells shows zero-XP locked Goals and the $45 funded Executive without a synthetic unlock in either shell |
| player | apps/player/src/session/levelFiveProgressionViews.test.tsx | M6 shared desktop and phone Goals projection shows the three truthful live requirements and Locked in both shells for pre-goal |
| player | apps/player/src/session/levelFiveProgressionViews.test.tsx | M6 shared desktop and phone Goals projection shows the three truthful live requirements and Locked in both shells for goals-morale |
| player | apps/player/src/session/levelFiveProgressionViews.test.tsx | M6 shared desktop and phone Goals projection shows the three truthful live requirements and Locked in both shells for goals-satisfaction |
| player | apps/player/src/session/levelFiveProgressionViews.test.tsx | M6 shared desktop and phone Goals projection shows the three truthful live requirements and Locked in both shells for goals-empty |
| player | apps/player/src/session/levelFiveReportQa.test.ts | M7c earned report and finish QA states on the existing 5184 server provides inspection-finish through real scoring and preserves it on resume in both layouts |
| player | apps/player/src/session/levelFiveReportQa.test.ts | M7c earned report and finish QA states on the existing 5184 server provides inspection-report-card through real scoring and preserves it on resume in both layouts |
| player | apps/player/src/session/levelFiveRoomsViewModels.test.tsx | M2 shared catalog, desktop and phone parity inspects all placed rooms with sale/refund, access, native tiers and implemented support purchases only |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews shows neutral complete test timing in both chart choice paths |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews ignores the retired concealment flag and preserves the scheduled external service after an answer |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews labels an onsite EGD route as onsite care while its result is pending |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews does not show a placeholder return ETA while a linked local procedure is active |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews distinguishes onsite and offsite pending-patient copy |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews presents a local test-only collection as onsite work and a Front Desk return |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews projects only the frozen endoscopy care interval as a covered-table occupancy |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews projects an active reserved endoscopy operation and only its visitor actor |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews uses frozen periop phases for the preparation labels and Endoscopy coverage |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews projects persisted bathroom travel ahead of care supports and restores the exact reserved bed after return |
| player | apps/player/src/session/surgeryCenterServicePreviews.test.ts | surgery-center test timing previews keeps discharging departure actors visible on their active amenity or retail route |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.external-clot-sudden-lump |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.external-clot-examination |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.barrett-patient-asks-ablation |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.sedation-unaccompanied-taxi |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.allergy-childhood-label |
| player | apps/player/src/session/variety3ChartsViewModels.test.ts | Variety-3 admitted chart presentation shows the exact named adult, complete task, shuffled choices and every test estimate for case.variety3.allergy-vague-reaction |

Collection failures and complete assertion messages are preserved in
[the validation receipt](protected-source-timing-20261112-validation.json).
Exact commands, native exit codes, the baseline comparison, every original
capture hash and the three protected-file postimages are included there.
Raw output is under .local-dev/protected-source-timing-20261112/.

The [scoped file receipt](protected-source-timing-20261112-files.json) records
the existing helper preimage/postimage, new files and append-only shared
handoff. The ExecPlan is docs/execplans/protected-source-timing-20261112.md.
Level5 runtime input changes total zero. Clinical definitions and the shipping
authority retain their batch6 values through the existing exact assertions.
This is a local main-tree checkpoint. The manager owns review, remaining source
pin reconciliation and the "push to GitHub" backup gate.
