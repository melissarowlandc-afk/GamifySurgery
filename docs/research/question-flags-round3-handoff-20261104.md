# Flag rewrites: final author-round handoff, 2026-11-04

**Fourteen additive r4 drafts; nothing shipped.** Read the [fourteen-item packet](question-flags-round3-review-20261104.json) and [source/claim ledger](sources-question-flags-round3-20261104.json). Key shown first for review only; runtime answers remain randomized. All new versions, eight new constructs and thirteen application claims remain `needs_clinician_review`. Melissa Rowland is clinical sign-off. Independent review 3 and manager acceptance remain required.

F01/F12 PASS versions are exact. The eleven batch-2a versions and two exhibit PNGs are exact. F14 remains core general-surgery content on its existing source hold, unchanged and outside this packet. Neck-node evaluation remains in scope by the explicit owner/manager KEEP decision; no SCORE or exam-bank evidence is claimed.

Preservation: 1096 untouched old cases / 1409 untouched old nodes, all 1810 old timing rows and all 371 old order tuples exact. Eighteen new study previews are explicitly nonexecuted; no new gate, route, save format or selector change. The catalog at entry was 414; this round adds eight (422), and the concurrent N1/N2 appends make 501 at this check.

## Per-item response and fallback

All 140 second-review cue/fairness/suggestion notes have indexed responses in `reviewResponse.noteResponses`. The table summarizes the edits; the packet contains the exact before/after fields, reasons for each choice, source limits and lint spans.

| Item | Specific repair | Known live fallback | Pending round-two draft retained |
|---|---|---|---|
| F02 | Removed the irrelevant shoulder-pain preamble and anatomy-purpose lead-in. Replaced overlapping with/without-contrast studies with three procedures whose ranking depends on the actual duct and drainage findings. | question.postlaparoscopy.benign-referred-shoulder-pain.v2 | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3 |
| F03 | Removed the completed compression study and unsupported pelvic-CT foil. All four choices now request duplex mapping in a balanced purpose-by-scope set; the key is neither the only broad study nor the only reflux study. | question.varicose-veins.intervention-referral-after-axial-reflux.v4 | question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3 |
| F04 | Retained the safety-critical ECG and potassium response. Replaced observation and routine repeat calcium with active potassium treatments and added the pH context needed to rank bicarbonate. The named clinic patient brings a hospital record; the complete task asks about that hospital decision rather than implying acute hospital treatment in the clinic. No transfer-availability permission. | question.hyperkalaemia.severe-community-result-transfer.v1 | question.hyperkalaemia.severe-community-result-transfer.v1.r3 |
| F05 | Specified the mural target and needle technique, replacing an underspecified repeat assessment. All options are named diagnostic requests at the same stage; core biopsy is not used as an incorrect foil. | question.gs028f.head-neck.initial-fna-not-open-biopsy.v4 | question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3 |
| F06 | Removed the stain-to-mechanism matching sentence. Used a complete balanced time-by-target option set, replacing component-majority convergence and the reversed donor-serum foil. The task explicitly selects a completed record for review; its choices retain the no_test classification. | question.immunology.preformed-antibody-hyperacute-rejection.v1 | question.immunology.preformed-antibody-hyperacute-rejection.v1.r3 |
| F07 | Replaced treat-the-new-fluid matching and the broad conference task with a changed urgency decision. All choices are specific hospital sequences; the cautious optimization choices are credible near misses rather than the key. | question.cirrhosis-perioperative-risk.multifactor-assessment.v3 | question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r3 |
| F08 | Removed the uncertainty-to-imaging cue and unrankable heel-versus-calf imaging order. Supplied actual calf/heel/venous observations and asks a bounded treatment decision; the groin-imaging foil is gone. | question.lymphangitis.heel-inguinal.v1 | question.lymphangitis.heel-inguinal.v1.r3 |
| F09 | Kept necessary position/ventilation controls and specified measured total PEEP and passive inspiratory holds, so the plateau interpretation does not depend on an assumed acquisition condition. Replaced impossible position-change foils with contractility alternatives, separated peak and plateau observations, and removed the calculated difference row and equal-rise summary. | question.pneumoperitoneum.context-dependent-venous-return.v4 | question.pneumoperitoneum.context-dependent-venous-return.v4.r3 |
| F10 | Removed the named switch-to-mastectomy scaffold. Replaced it with an operative/specimen distinction and a bilateral decision, with laterality/omission choices at the same stage and balanced node observations. | question.dcis.sentinel-node-setting.v3 | question.dcis.sentinel-node-setting.v3.r3 |
| F11 | Removed authoritative attribution of ongoing hypotension and the narrower stop-when-pressor-stops key. The key now acts after the complete stipulated reassessment; baseline oxygen makes a competing physiological endpoint consequential. | question.statistics-ethics.perioperative-dnr.v4 | question.statistics-ethics.perioperative-dnr.v4.r3 |
| F13 | Removed confirmed/suspected/unlikely label options and the cautious-middle shortcut. All choices specify a concrete assessment request and an explicit sequence; none claims a diagnosis or a mandatory operative delay. | question.preoperative-osa.validated-risk-screening.v4 | question.preoperative-osa.validated-risk-screening.v4.r3 |
| F15 | Corrected the invalid premise with actual reference-interval relationships, and removed acidemia assertions from the appropriate two options. Removed unnecessary early insufflation chronology; preserved pressure/ventilation controls. The paired conclusions are frequency-balanced. | question.pneumoperitoneum.context-dependent-venous-return.v2 | question.pneumoperitoneum.context-dependent-venous-return.v2.r3 |
| F16 | Removed the task that preselected repeat sampling and the culture/flow-cytometry foils. All alternatives are thyroid-node workup plans; completed discordant results now affect whether definitive neck surgery can be selected. | question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4 | question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3 |
| F17 | Removed the different-clock-position and classic firm-irregular shortcuts. The competing ultrasound-guided repeat is now attractive because the clip is visible; the key depends on interpreting specimen depth and current absence of a correlate for the actual lump. | question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4 | question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3 |

Fallback identities come from the recorded live-build flag check, not fresh remote verification. Neither the round-two nor final draft is claimed shipped. If review 3 rejects a draft, retain its currently released version; the manager must reconcile any intervening release before applying the known fallback. No content is retired or deleted.

All fourteen known fallbacks were matched to `QUESTION_FLAGS_PRE_REVISION_RELEASE` in `packages/clinical-content/src/synthetic-content.ts`. Each packet entry records the source export, exact case/node and retained-case SHA-256. Reconstruct a fresh-case fallback from that retained source; never rewrite an existing saved encounter or reset its FSRS history.

## Clinical meaning and source limits

| Item | Versioning decision |
|---|---|
| F02 | The scored decision changes from selecting localization imaging to treating a demonstrated minor leak. Retain the imaging construct and all earlier anatomy versions. |
| F03 | The scored distinction is completeness of a recurrent reflux map rather than reflux versus a completed DVT compression protocol. |
| F04 | The scored objective remains immediate potassium-shifting treatment after calcium; replacing weak alternatives does not create a new mechanism or removal objective. |
| F05 | The scored objective remains representative needle assessment after an inadequate cyst-fluid sample; the replacement specifies the corrective target rather than a new disease pathway. |
| F06 | This task scores investigation design and temporal evidence, rather than naming the preformed-antibody mechanism from explicit immunoglobulin/complement stains. |
| F07 | The scored action changes from deferring a nonurgent repair for ascites control to urgent assessment of a new obstructive presentation. Preserve the elective-risk concept and histories. |
| F08 | The scored choice changes from imaging a source to treating an imaged focal collection. Retain the source-imaging and syndrome-recognition constructs. |
| F09 | The scored objective remains interpretation of the pressure-linked cardiac-filling and respiratory-mechanical response. The new alternatives repair the same construct rather than adding an operative-adjustment rule. |
| F10 | The same conventional DCIS operation-dependent staging rule is applied to two different specimens. Bilaterality and skin retention change case details, not the underlying scored meaning. |
| F11 | The scored meaning remains application of a patient-agreed recovery endpoint. Distinguishing baseline oxygen from unresolved anaesthetic support repairs the same endpoint task without changing DNR semantics. |
| F13 | The scored task changes from choosing a certainty label to an assessment/communication sequence; retain the documentation construct and original screening-method history. |
| F15 | The prior gas objective wrongly asserted acidemia from relative changes. This version instead scores recognition that a fall toward the reference interval is not demonstrated acidemia; retain the original histories and record the corrected construct explicitly. |
| F16 | The previous objective selects a familiar washout adjunct. The replacement scores interpretation of completed discordant results and their effect on a neck-operation decision. |
| F17 | The scored objective remains representative assessment after benign/nonrepresentative sampling of a different target. The site discrepancy is now depth at one skin site rather than a trivial different clock position. |

The ledger contains 60 current/prior/basis claims and 30 existing source records. No article text, source excerpt, private email, proprietary corpus, new network retrieval or changed access date is stored. New application claims explicitly identify their basis and offline alignment limits.

**F04 release hold:** the new comparative insulin-glucose / beta-agonist / bicarbonate ranking requires direct UKKA section alignment. The existing locally recorded claims directly support the severe-potassium and calcium/insulin mechanisms; they do not independently verify every new comparison. Retain the live fallback if the manager cannot complete permitted verification. Other applications also require clinical/source-alignment review; test passage is not approval.

F15 no longer asserts acidemia from relative gas directions. Initial high-pH/low-CO2 and later within-interval observations establish the limited conclusion without invented numbers. The physiology items are described as integrated interpretations, not falsely counted as two sequential management decisions. No basic acceptance or independent PASS is self-granted.

## Linter

Same question-cue-lint.2026-11-04.v8: 1497 variants before / 1497 after; 6197 / 6197 finite contexts. Whole-bank findings 2039 to 2044; selected fourteen 7 to 12. New-owner-rule findings among the fourteen: 0 to 0.

Concurrent N1/N2 cases are included on both sides of this comparison, so the difference isolates these fourteen replacements. Author dispositions do not suppress warnings or grant clinical clearance. The five additional advisory findings are retained; balanced component combinations can trigger convergence and near-duplicate heuristics. This is not a lint-clearance claim. Full exact phrases/fields remain in the packet and `question-flags-round3-whole-bank-20261104.json`; other candidates are not rewritten. No correctness statistics, timing analytics, thresholds or per-player data are collected or expected.

## Validation

Commands: `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1 --reporter=dot`; `npm.cmd run clinical:lint:test`; `node --disable-warning=ExperimentalWarning tools/question-quality/review-question-flags-round3-20261104.mjs` (same-v8 whole-bank inventory, exact before/after spans and packet); `npm.cmd run typecheck` (seven workspaces). Full domain: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --reporter=verbose`. Full player: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --reporter=dot`, with the existing `adversarial-r5-player-preload-20261102.cjs` required through temporary NODE_OPTIONS and the original environment restored afterwards. Focused logs include their exact filename arguments. No timeout/configuration change.

| Check | Files | Tests / result | Duration | Log |
|---|---|---|---|---|
| clinical | 102 passed (102) | 835 passed (835) | 112.37s (transform 7.05s, setup 0ms, import 91.32s, tests 10.52s, environment 7ms) | tools/question-quality/question-flags-round3-clinical-handoff-20261104.log |
| clinicalFocused | 7 passed (7) | 50 passed (50) | 16.79s (transform 2.94s, setup 0ms, import 13.60s, tests 2.19s, environment 1ms) | tools/question-quality/question-flags-round3-clinical-focused-final-20261104.log |
| domain | 13 failed \| 163 passed (176) | 47 failed \| 4470 passed \| 1 skipped (4518) | 3312.02s (transform 13.70s, setup 0ms, import 294.97s, tests 2996.23s, environment 13ms) | tools/question-quality/question-flags-round3-domain-complete-20261104.log |
| domainFocused | 4 passed (4) | 21 passed (21) | 78.48s (transform 105.23s, setup 0ms, import 147.99s, tests 461ms, environment 0ms) | tools/question-quality/question-flags-round3-domain-focused-final-20261104.log |
| domainOwnedHandoff | 2 passed (2) | 6 passed (6) | 3.47s (transform 1.41s, setup 0ms, import 3.30s, tests 15ms, environment 0ms) | tools/question-quality/question-flags-round3-domain-owned-handoff-20261104.log |
| domainCohortRepair | 4 passed (4) | 708 passed (708) | 73.89s (transform 4.85s, setup 0ms, import 12.42s, tests 60.81s, environment 3ms) | tools/question-quality/question-flags-round3-cohort-repaired-final-20261104.log |
| domainDiagnosticRepair | 1 passed (1) | 1 passed (1) | 22.81s (transform 4.11s, setup 0ms, import 6.00s, tests 16.63s, environment 0ms) | tools/question-quality/question-flags-round3-supply-repaired-20261104.log |
| domainRemainingFixtures | 3 failed \| 1 passed (4) | 3 failed \| 560 passed (563) | 18.29s (transform 2.79s, setup 0ms, import 7.58s, tests 10.32s, environment 0ms) | tools/question-quality/question-flags-round3-remaining-fixtures-repaired-20261104.log |
| player | 2 failed \| 341 passed (343) | 2 failed \| 3415 passed (3417) | 2061.44s (transform 33.49s, setup 0ms, import 954.34s, tests 1041.07s, environment 48ms) | tools/question-quality/question-flags-round3-player-complete-20261104.log |
| playerFocused | 3 passed (3) | 59 passed (59) | 33.51s (transform 4.65s, setup 0ms, import 9.15s, tests 24.08s, environment 0ms) | tools/question-quality/question-flags-round3-player-focused-final-20261104.log |
| playerTimeoutCheck | 2 passed (2) | 6 passed (6) | 44.14s (transform 10.53s, setup 0ms, import 18.01s, tests 25.73s, environment 0ms) | tools/question-quality/question-flags-round3-player-timeout-check-20261104.log |
| typecheck | 7 workspace typechecks | see log |  | tools/question-quality/question-flags-round3-typecheck-after-n2-20261104.log |
| typecheckN2Window | 7 workspace typechecks | 2 type errors |  | tools/question-quality/question-flags-round3-typecheck-handoff-20261104.log |
| lint | node:test | 33 passed / 0 failed |  | tools/question-quality/question-flags-round3-lint-tests-handoff-20261104.log |

The full shared-tree logs and scoped reruns are retained separately. Interrupted preliminary full launches are not counted as validation. Source/window hashes identify concurrent changes; a passing earlier window is not evidence that every later shared-tree input passed.

Full domain result: **4,470 passed / 47 failed / one skipped**, 176 files. The 47 comprise 26 expected Level 5 input/legacy-initial-hash mismatches, seven timeouts, eleven stale content/inventory expectations, and three functional routing/restroom assertions outside this lane. The 26 hash-only failures are the recorded-input guard plus the 25 seeded Level 0–4 initial-state comparisons in `level-five-integration.test.ts`; exact labels/seeds remain in the full log. No Level 5 test/evidence was changed. The five Level 5 save/reload/continuation timeouts, Executive training timeout, garden-return timeout, pediatric relocation assertion and two restroom-path assertions are left for their owners. Do not call them hash-only failures or attribute them to these rewrites without a controlled diagnosis.

Exact hash-only test identities in `packages/game-domain/tests/level-five-integration.test.ts`: `M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash`; and `M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level {0,1,2,3,4}/schema {5,6,7,8,9}` (all 25 combinations). Those comparisons fail at the initial state hash; no claim is made that later behavior has been revalidated. The five other failures in that file are timeouts at integration-preparing, integration-running, integration-final, integration-finish and the lower-retry continuation.

The eleven stale expectations were addressed with retained exact labels and counterfactual proofs. The cohort/order rerun passes 708/708 and the sustained-supply diagnostic passes 1/1. A subsequent 563-test rerun passes 560 and fails three literal inventory assertions because N2 was appended during this window: October 3 and statistics/ethics expect 1,048 cases but now see 1,087; patient-supply expects 462 definitions but sees 501. Both original patient-supply snapshots reproduce under the entry bank; the same-N1 control isolates this round’s seeded-case change. Do not chase the moving N2 catalog or describe these three current count failures as solved.

Full player result: **3,415 passed / two timeouts**, 343 files. Both timed-out tests pass their unchanged limits in isolation (six tests, two files). Final affected presentation/flag/image checks pass 59/59. No player source or test was edited. The full runs preceded the final record-scope/acquisition prose refinements; the latest clinical and focused checks cover those strings. These windows do not establish an all-green current shared tree.

The earlier seven-workspace typecheck passes. The N2 construction window has six passing workspaces and two TS2353 errors for termsUrl in the concurrent question-new-n2-evidence-20261104.ts (lines 6431 and 6461 in that window). The other author subsequently changed that file; it remains untouched here. The final rerun checks 7 workspaces and reports 0 type errors; see its separate log. Final clinical-content is 835/835, 102 files.

### domain failures

- tests/gs028-20261002-batch.test.ts > GS-028 October 2 batch admission > admits all twenty objectives, seventy-eight cases, and their exact timed orders
- tests/gs028-20261003-batch.test.ts > GS-028 October 3 batch admission > admits all twenty objectives, seventy-eight cases, and their exact timed orders
- tests/gs028-20261007-batch.test.ts > GS-028 October 7 real gameplay admission > binds two executable gates, one planned correct study and eight non-executed distractors
- tests/gs028-20261007-batch.test.ts > GS-028 October 7 real gameplay admission > measures the real ordinary pools before and after admission
- tests/gs028-20261007-batch.test.ts > GS-028 October 7 real gameplay admission > covers all eighty actual nodes and every current authored choice
- tests/gs028-20261007-variety2-batch.test.ts > GS-028 second October 7 actual gameplay > measures the actual early ordinary pool delta of seventy-eight cases and twenty-one active concepts
- tests/gs028-statistics-ethics-batch.test.ts > GS-028 statistics and ethics runtime admission > admits the 28 original objectives and 120 nodes in 108 cases, reusing eight existing clinical concepts
- tests/level-five-executive.test.ts > M4 daily Executive lifecycle > trains through all four paid tiers, without repricing the accepted daily terms
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after save/reload at integration-preparing
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after save/reload at integration-running
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after save/reload at integration-final
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after save/reload at integration-finish
- tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > continues normal operations, completes a genuinely lower retry and retains the higher best and first finish
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 9
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 5
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 6
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 7
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 8
- tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 9
- tests/level-five-latent-bugs.test.ts > Level 5 garden and diagnostic movement ownership > finishes the garden return before starting offsite movement after live
- tests/patient-supply.test.ts > routine patient supply > records the current clinical inventory and exact unseen-patient boundary by stage
- tests/patient-supply.test.ts > routine patient supply > admits and completes patients in prepared day-six through day-eight states
- tests/pediatric-appointments.test.ts > M5c pediatric APP appointments > evacuates a sold exam together and preserves remaining work and the frozen fee in a second home
- tests/restroom-recovery.test.ts > restroom exit recovery > preserves a visitor's captured exit path after its room is removed
- tests/restroom-recovery.test.ts > restroom exit recovery > preserves a encounter's captured exit path after its room is removed
- tests/test-choice-order-inventory.test.ts > active-release test-choice order inventory > preserves the active release timing inventory counts
- tests/diagnostics/patient-supply.test.ts > GS-017 sustained patient supply diagnostic > runs normal ticks, arrivals, gates, and completions through day eight

### domainRemainingFixtures failures

- tests/gs028-20261003-batch.test.ts > GS-028 October 3 batch admission > admits all twenty objectives, seventy-eight cases, and their exact timed orders
- tests/gs028-statistics-ethics-batch.test.ts > GS-028 statistics and ethics runtime admission > admits the 28 original objectives and 120 nodes in 108 cases, reusing eight existing clinical concepts
- tests/patient-supply.test.ts > routine patient supply > records the current clinical inventory and exact unseen-patient boundary by stage

### player failures

- src/session/levelFourIntegration.test.ts > Level 4 M9 real-engine player integration > projects all specialty services from real care supports, retaining Money/HUD equality and reload identities
- src/session/periopNurseOwnerFeedback.test.ts > Owner peri-op feedback in an approved Level-2/3 clinic > shows all 3 nurses walking/checking/resting in the compiled Level-3 view

### typecheckN2Window failures

- src/question-new-n2-evidence-20261104.ts(6431,5): error TS2353: Object literal may only specify known properties, and '"termsUrl"' does not exist in type 'ClinicalSource'.
- src/question-new-n2-evidence-20261104.ts(6461,5): error TS2353: Object literal may only specify known properties, and '"termsUrl"' does not exist in type 'ClinicalSource'.

## Fixture and integration changes

- The historical batch-2a clinical test now reads its retained pre-round-three bank/timing view. All its original content, counts, assertion bodies and deadlines remain; it no longer incorrectly treats every later additive batch as a change to batch 2a.
- Its domain binding test counts the fourteen tuples owned by that historical batch. The new suite separately proves all 371 entry tuples exact, eighteen new previews, exact label/timing matching, rejection of label drift and old frozen lookup. No execution policy changes.
- The timing-count formula includes fourteen retained replacement rows. The active order inventory retains the round-entry cases for frozen r3 identities; all exact label, route, timing, orphan and no-extra-order checks remain.
- Shared inventory totals: entry 1,475 studies / 143 terminal testing keys; this round 1,474 / 142; current concurrent N1 1,511 / 155 (+37 / +13). The explicit full-bank expectations include both additive batches. Admission expectations append the eight named versioned constructs and the separate N1 declared catalog in actual release order. No assertion or timeout is weakened to hide a behavioral change.
- Two GS-028 cohort fixtures retain all 222 assertion call sites, commands and deadlines. Exact entry/current controls reproduce the original counts, then show one additional active F06 objective with no case-count change. F02 now has ten current study bindings (two executable gates, one planned ERCP, seven distractors); F06 adds one offered answer, making 318 covered choices. The second cohort keeps its exact 78-case / 21-concept delta.
- The day-eight diagnostic changes one inline snapshot. A disposable control with the entry bank and identical current domain/N1 code reproduces the old snapshot exactly; the new versioned objectives change the deterministic unseen-concept mix. Arrivals remain 96 and walkouts zero; completions at the cutoff change 95 to 94, with the last arrival 24 ticks later. All twelve assertion call sites and the existing deadline remain. The actual focused Vitest rerun, not the diagnostic capture, determines passage.
- Four further fixture files change only documented literal lengths, two patient-supply snapshots and comments: October 2, October 3, statistics/ethics and routine patient-supply. All 264 assertion call sites, commands and deadlines remain. October 2 has 33 current study records, still two executable gates, two terminal services and fourteen external-only previews. N1 adds forty single-node cases; this round adds no cases. The seeded day-six case now contains two nodes instead of one and still completes; days seven/eight are unchanged. The control distinguishes the N1 contribution from these eight retained constructs; N2 arrived afterwards and leaves the three explicit current integration-count failures above.
- No player source or player test was edited. Focused flag-freeze, chart and image tests exercise the affected presentation/old-variant behavior. Do not touch cloud/save, Supabase, N1 authored files, Level 4/5 tests/evidence or other UI/art/routing lanes.

## Exact Level 5 bound inputs changed by this round

Four modified and three added collected inputs (the shared assembly/registry also contain preserved independent N1/N2 appends):

- `packages/clinical-content/src/answer-choice-timing.ts` — modified.
- `packages/clinical-content/src/index.ts` — modified.
- `packages/clinical-content/src/synthetic-content.ts` — modified.
- `packages/clinical-content/src/question-flags-round3-20261104.ts` — added.
- `packages/clinical-content/src/question-flags-round3-20261104-data.ts` — added.
- `packages/clinical-content/src/question-flags-round3-evidence-20261104.ts` — added.
- `packages/game-domain/src/test-choice-orders.ts` — modified.

No Level 5 evidence, legacy evidence, hash or rebind file was edited. The manager owns rebind and behavioral-evidence refresh in the release worktree. Concurrent source changes are listed separately in the verification/window artifacts; they are not attributed to this batch.

The retire/merge proposal ledger also records F02 overlap with the existing minor-leak ERCP learning objective. Review possible canonical-card consolidation after acceptance; no migration or retirement is applied, and the F05/F14 KEEP decisions stand.

## Exact files and next action

The machine-readable `tools/question-quality/question-flags-round3-owned-files-20261104.json` records every scoped file, kind, byte count and SHA-256, plus validation and unrelated shared-tree changes. Files in shared assembly paths retain the other worker’s appended code. The scoped handoff supplements the manager-owned CURRENT_THREAD_HANDOFF rather than overwriting it.

- `docs/execplans/question-bank-program-20261104.md` (modified_existing).
- `docs/research/question-bank-program-queue-20261104.json` (modified_existing).
- `docs/research/question-bank-retire-merge-proposals-20261104.md` (modified_existing).
- `docs/research/question-flags-review-20261104.json` (modified_existing).
- `docs/research/question-flags-round3-cue-audit-20261104.md` (added_this_round).
- `docs/research/question-flags-round3-handoff-20261104.md` (added_this_round).
- `docs/research/question-flags-round3-review-20261104.json` (added_this_round).
- `docs/research/sources-question-flags-round3-20261104.json` (added_this_round).
- `packages/clinical-content/src/answer-choice-timing.test.ts` (modified_existing).
- `packages/clinical-content/src/answer-choice-timing.ts` (modified_existing).
- `packages/clinical-content/src/index.ts` (modified_existing).
- `packages/clinical-content/src/question-bank-batch2a-20261104.test.ts` (modified_existing).
- `packages/clinical-content/src/question-flags-round3-20261104-data.ts` (added_this_round).
- `packages/clinical-content/src/question-flags-round3-20261104.test.ts` (added_this_round).
- `packages/clinical-content/src/question-flags-round3-20261104.ts` (added_this_round).
- `packages/clinical-content/src/question-flags-round3-evidence-20261104.ts` (added_this_round).
- `packages/clinical-content/src/synthetic-content.ts` (modified_existing).
- `packages/game-domain/src/test-choice-orders.ts` (modified_existing).
- `packages/game-domain/tests/approved-clinical-admission.test.ts` (modified_existing).
- `packages/game-domain/tests/diagnostics/patient-supply.test.ts` (modified_existing).
- `packages/game-domain/tests/gs028-20261002-batch.test.ts` (modified_existing).
- `packages/game-domain/tests/gs028-20261003-batch.test.ts` (modified_existing).
- `packages/game-domain/tests/gs028-20261007-batch.test.ts` (modified_existing).
- `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts` (modified_existing).
- `packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts` (modified_existing).
- `packages/game-domain/tests/patient-supply.test.ts` (modified_existing).
- `packages/game-domain/tests/question-bank-batch2a-bindings.test.ts` (modified_existing).
- `packages/game-domain/tests/question-flags-round3-bindings.test.ts` (added_this_round).
- `packages/game-domain/tests/test-choice-order-inventory.test.ts` (modified_existing).
- `tools/question-quality/author-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/capture-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/control-question-flags-round3-cohort-20261104.mjs` (added_this_round).
- `tools/question-quality/control-question-flags-round3-remaining-fixtures-20261104.mjs` (added_this_round).
- `tools/question-quality/control-question-flags-round3-supply-20261104.mjs` (added_this_round).
- `tools/question-quality/evidence-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-before-20261104.json` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-cohort-before-20261104.json` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-cohort-first-before-20261104.json` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-queue-before-20261104.json` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-remaining-fixtures-before-20261104.json` (added_this_round).
- `tools/question-quality/fixtures/question-flags-round3-supply-before-20261104.json` (added_this_round).
- `tools/question-quality/handoff-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/lock-question-flags-round3-validation-20261104.mjs` (added_this_round).
- `tools/question-quality/orders-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-complete-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-final-drafts-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-focused-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-focused-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-initial-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-clinical-locked-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-control-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-control-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-first-control-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-first-control-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-fixture-review-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-repaired-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-cohort-repaired-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-complete-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-complete-process-20261104.txt` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-focused-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-focused-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-domain-owned-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-generation-check-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-lint-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-lint-tests-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-lint-tests-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-lint-tests-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-orders-check-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-packet-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-packet-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-complete-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-focused-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-focused-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-player-timeout-check-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-queue-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-queue-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-remaining-fixtures-control-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-remaining-fixtures-control-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-remaining-fixtures-repaired-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-remaining-fixtures-review-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-specs-20261104.mjs` (added_this_round).
- `tools/question-quality/question-flags-round3-supply-control-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-supply-control-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-supply-fixture-review-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-supply-repaired-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-after-n2-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-final-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-initial-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-typecheck-locked-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-complete-lock-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-complete-window-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-final-lock-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-handoff-lock-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-handoff-window-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-locked-lock-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-status-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-validation-window-check-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-verification-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-verification-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-verification-handoff-20261104.log` (added_this_round).
- `tools/question-quality/question-flags-round3-whole-bank-20261104.json` (added_this_round).
- `tools/question-quality/question-flags-round3-window-handoff-20261104.log` (added_this_round).
- `tools/question-quality/queue-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/repair-question-flags-round3-cohort-20261104.mjs` (added_this_round).
- `tools/question-quality/repair-question-flags-round3-remaining-fixtures-20261104.mjs` (added_this_round).
- `tools/question-quality/repair-question-flags-round3-supply-20261104.mjs` (added_this_round).
- `tools/question-quality/report.mjs` (modified_existing).
- `tools/question-quality/responses-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/review-question-flags-round3-20261104.mjs` (added_this_round).
- `tools/question-quality/verify-question-flags-round3-20261104.mjs` (added_this_round).

STOP: manager runs final independent review, resolves the F04 direct-source hold, retains live versions for rejected replacements, accepts integration and schedules release/rebind. Batch 2a remains independently frozen. No next linter batch is authored. This valuable checkpoint remains local only; no Git backup, release, installation or network action was performed. GitHub backup coordination belongs to the manager.
