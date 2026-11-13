# Topic program acceptance batch 8 - 2026-11-12

**Accepted all ten requested exact PASS versions; skipped none.** All remain needs_clinician_review with lastClinicianReview null. Melissa Rowland's direction on 2026-11-12 is bound to each exact question version/hash, not represented as named approval of its successor wording. No source-authoring file was edited.

## Accepted versions and owner direction

| Owner reference | Exact accepted question | Final review | Direction applied |
| --- | --- | --- | --- |
| B2B32 | question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4 | docs/research/question-owner-decisions-review2-20261112.json | Plain anion-gap calculation and qualitative albumin effect; no correction arithmetic. |
| B2B34 | question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4 | docs/research/question-owner-decisions-review2-20261112.json | Plain-gap trend and qualitative albumin interpretation; retire the additional correction-dependent topic predecessor. |
| G02 | question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2 | docs/research/question-owner-decisions-review-20261112.json | MH preparation moves into the answer choices rather than being supplied before the task. |
| G02-NEW | question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1 | docs/research/question-owner-decisions-review-20261112.json | New medication-readiness item explicitly requested by Melissa: dantrolene. |
| TOPIC-060 | question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2 | docs/research/question-owner-decisions-review-20261112.json | Spells out total mesorectal excision and explains LAR/APR as TME operations. |
| TOPIC-034 | question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3 | docs/research/question-owner-decisions-review-20261112.json | Smooth postoperative surveillance wording; ileocolonoscopy key retained. |
| TOPIC-069 | question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2 | docs/research/question-owner-decisions-review-20261112.json | Explicit paraesophageal hernia and reflux-control decision; exact reviewed one-node replacement. |
| G04-R | question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2 | docs/research/question-owner-decisions-review-20261112.json | Consequential pregnancy localization/disposition despite falling hCG; easy serum-hCG predecessor withheld. |
| F13 | question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4 | docs/research/question-owner-decisions-review2-20261112.json | Explicit suspected awake hypoventilation context; ABG key with sleep-test competitors. Easy screening item remains. |
| G07 | question.ptld.tissue-diagnosis-coordination.v4.r4 | docs/research/question-owner-decisions-review2-20261112.json | Excisional lymph-node sampling with fresh/fixed specimen allocation; stable harder-draft concept version as declared. |

The [packet](question-topic-acceptance-batch8-packet-20261112.json) contains before/after fields, key-first review-only options, explanations, claim mappings, original author rubric, final review, native admission and raw lint. Runtime options remain randomized. The [source freeze](question-topic-acceptance-batch8-source-freeze-20261112.json) preserves exact reviewed question/node/case serializations and all source/review hashes. Current clinical fields already use the runtime patient-name placeholders; zero naming/pronoun corrections were needed.

## Fresh projection and preserved history

Ten exact authority rows replace five superseded authority rows, giving a net addition of five. Legacy bindings and every unrelated row remain exact. The prior rows and complete pre-batch8 manifest remain archived. The reflux successor is the reviewed complete one-node case; its prior two-node encounter, including the earlier symptomatic-hernia decision, is retained for saves rather than merged into a new unreviewed context.

Two existing four-to-one topic consolidations now target the accepted MH and rectal successors. Their eight original legacy cases remain withheld from fresh play; the case lists and manager decisions are unchanged. This avoids invalidating the consolidation when its earlier target authority row is superseded.

| Consolidation | Previous target | Accepted target |
| --- | --- | --- |
| topic-program.batch4.case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1 | question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1 | question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2 |
| topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1 | question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1 | question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2 |

| Additional retired case | Exact old question(s) | Condition |
| --- | --- | --- |
| case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1 | question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | Owner 2026-11-12: no neonatal clinical framing |
| case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1 | question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | Owner 2026-11-12: no neonatal clinical framing |
| case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2 | question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2 | Accepted successor question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4 |

G04-R replaces the easy serum-hCG question through its exact same-case/node override; the easy question is absent from fresh supply. The additional corrected-gap topic case retires only when its complete accepted successor exists. F13's harder draft predecessors were not fresh at intake; its new awake-ventilation case is added, while the distinct easy validated-screening question remains.

Nineteen exact prior cases are retained: nine current predecessor cases (including the gap duplicate and paired reflux case), two neonatal cases, and eight already-consolidated legacy cases. Real format-3 save and committed-journal witnesses reopen and complete all 19 under the new default, using their original question and concept IDs, randomized frozen choice order and existing FSRS histories. No save schema, selector, routing or learning-history mutation was added.

The reviewed packet explicitly declares concept-version/meaning changes for the gap items, G04-R and G07, and introduces the new dantrolene concept. Its exact harder-draft IDs are used. All 1,105 prior runtime concept records and their order remain exact, including historical meanings no longer used in fresh supply. Four missing IDs are added: dantrolene readiness, pregnancy localization, awake-ventilation assessment and PTLD specimen handling. The existing corrected-gap ID is retained, with the owner-directed authored concept version preserved in the frozen source export. No new concept ID was invented here.

## Runtime waits and cue checks

**Twelve new exact testing-choice bindings are installed; remaining bindings: zero.** All use existing profiles and source-proposed future_planned dispositions; no fixed duration is added to authored prose or new balance profile created.

| Node | Choice ID | Testing choice | Existing wait profile |
| --- | --- | --- | --- |
| node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2 | choice.owner-decisions.20261112.crohn-surveillance.scope | Obtain ileocolonoscopy to reassess postoperative disease activity | timing.test.lower_endoscopy |
| node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2 | choice.owner-decisions.20261112.crohn-surveillance.markers | Continue maintenance therapy with biomarker-based monitoring at follow-up | timing.test.basic_labs |
| node.gs028f.gynecology.c1-late-period.1 | choice.owner-decisions.20261112.pregnancy-location.localize | Transvaginal ultrasound with gynecologic assessment | timing.test.ultrasound |
| node.gs028f.gynecology.c1-late-period.1 | choice.owner-decisions.20261112.pregnancy-location.appendix | Appendiceal magnetic resonance imaging with general-surgical assessment | timing.test.mri_routine |
| node.gs028f.gynecology.c1-late-period.1 | choice.owner-decisions.20261112.pregnancy-location.aspirate | Diagnostic uterine aspiration with histopathologic assessment | timing.test.biopsy |
| node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3 | choice.owner-decisions.20261112.awake-gas.gas | Arterial blood gas analysis | timing.test.basic_labs |
| node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3 | choice.owner-decisions.20261112.awake-gas.polysomnography | Attended laboratory polysomnography | timing.test.overnight_protocol |
| node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3 | choice.owner-decisions.20261112.awake-gas.oximetry | Overnight pulse oximetry | timing.test.overnight_protocol |
| node.gs028b.ptld.b-pathology-returned.1 | choice.owner-decisions.20261112.ptld-biopsy.excision-split | Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue | timing.test.biopsy |
| node.gs028b.ptld.b-pathology-returned.1 | choice.owner-decisions.20261112.ptld-biopsy.core-split | Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue | timing.test.biopsy |
| node.gs028b.ptld.b-pathology-returned.1 | choice.owner-decisions.20261112.ptld-biopsy.excision-fixed | Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies | timing.test.biopsy |
| node.gs028b.ptld.b-pathology-returned.1 | choice.owner-decisions.20261112.ptld-biopsy.core-fixed | Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies | timing.test.biopsy |

Withdrawing a fresh authority row must not withdraw its frozen waits. Five historical timing tuples are restored at their original offsets, and nine original order records are retained with exact deduplication/conflict checks. Every previous timing tuple remains byte-for-byte equal in the original prefix; ten new classifications append. Domain integration is metadata only in test-choice-orders.ts, with no domain acceptance gate.

Raw target lint: **0 findings / 10 variants / 20 profile contexts**, no suppressions and no uniquely longest-key character residuals. Whole-bank raw findings: 1847 -> 1824. All ten candidates pass native existing-clinic admission and have complete source question metadata. Source reports and the full-library naming guard remain in validation.

## Counts and hashes

| Measure | Before | After |
| --- | --- | --- |
| Default cases | 1408 | 1407 |
| Scored nodes | 1612 | 1610 |
| Registered meanings | 1105 | 1109 |
| Scored meanings | 907 | 909 |
| Manifest authority rows | 772 | 777 |
| Timing archive rows | 2922 | 2932 |

Manifest: question-ship.2026-11-12.v17. SHA256: 9e163b7ebe29bce3468ee34feada226e97329d700512e6342da210134f986f60. Default SHA256: 4474bd1722eef6dc7b99d64dd21d4ddf5a907ec8a1dfe3ac4c20047f51d559d8. Catalog SHA256 (unchanged): 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40. Timing SHA256: e4fecca521fb727c50e72f4926620a0afcb6afe660766c6b59ccb60ad2b3acd9.

## Validation and remaining failures

| Check | Exact result |
| --- | --- |
| Full clinical-content | 3148 passed / 10 failed / 0 skipped (3158); 214 files; exit 1 |
| Full game-domain | 5986 passed / 27 failed / 1 skipped (6014); 220 files; exit 1 |
| Focused player | 175 passed / 0 failed / 0 skipped (175); 5 files; exit 0 |
| Focused domain question-gate/order inventory | 874 passed / 0 failed; three files |
| Focused clinical/naming (from full run) | 63 passed / 0 failed; seven files |
| Seven typechecks | 7/7 passed; exit 0 |
| Cue linter tests | 33 passed / 0 failed; exit 0 |

Vitest uses npm.cmd with --pool=threads --maxWorkers=2; player uses the existing preload. The [validation receipt](question-topic-acceptance-batch8-validation-20261112.json) includes native exits, commands, log hashes, all messages and the earlier failing runs. Raw logs are under .local-dev/question-topic-acceptance-batch8-20261112. No timeout, source capture or assertion budget was relaxed.

Every remaining clinical and domain failure title occurs in the recorded batch7 baseline. Clinical retains ten source/review-pin failures. Domain retains 26 Level 5 input/evidence/behavioral guards and the existing concept-census assertion. The initial balance/progression and concurrent intraop failures are absent from the final runs; those lanes were not edited here.

| Clinical failure classification | File | Test |
| --- | --- | --- |
| recorded_batch7_baseline | question-flags3-20261107.test.ts | flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact |
| recorded_batch7_baseline | question-harden1-n3r4-acceptance-20261110.test.ts | exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures |
| recorded_batch7_baseline | question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes |
| recorded_batch7_baseline | question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage |
| recorded_batch7_baseline | question-stats1-20261108.test.ts | stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration |
| recorded_batch7_baseline | question-stats1-acceptance-20261108.test.ts | stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions |
| recorded_batch7_baseline | question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts | two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items |
| recorded_batch7_baseline | question-topic-esophagus-motility-achalasia-20261111.test.ts | esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case |
| recorded_batch7_baseline | question-topic-pediatric-gi-abdominal-wall-20261111.test.ts | pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review |
| recorded_batch7_baseline | question-topic-surgical-infection-antibiotics-20261111.test.ts | surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue |

| Domain failure classification | File | Test |
| --- | --- | --- |
| recorded_batch7_baseline | approved-clinical-admission.test.ts | approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8 |
| recorded_batch7_baseline | level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9 |

Typecheck diagnostics:

No diagnostics.

Stale integration assertions were updated for the current source view/counts and exact archived timing tuples. Earlier acceptance and length-exception guards pass through a strict batch8 inverse that first verifies the complete current release/manifest/timing or exact source postimage, then restores its original captured epoch. Unrelated mutations still fail. The new batch8 tests independently verify the current authority, all source bytes, zero new cues, fresh retirements and unchanged unrelated cases/concepts. No question-topic-*, question-intraop-* or question-owner-decisions-* source/test was edited.

## Files, Level 5 and handoff

The [file receipt](question-topic-acceptance-batch8-files-20261112.json) lists every changed/new file and digest, strict before/after source migrations, and preserved out-of-lane observations. The shared thread handoff is append-only. Source claims and bibliography are reused exactly; no new clinical fact, citation or online verification was introduced.

| Changed recorded Level 5 input | Before SHA256 | After SHA256 |
| --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | 1c825724e83c5724b8fd35ee03c14740be3cdb87068bb45e246ef3936513defa | 1a87490f6ba82ed0bd0a1673e10e0fe5f6be48cfc584f31d3a22551cb14fcc38 |
| packages/clinical-content/src/index.ts | 65d649bad4aa9fa9940e6510670c1b02a3aaf36a27cc2f22f4f462b2e19ce733 | a6f8bec343b46ad08b0c810c0b9b6b32f5fcc849adb50debc1deb4d4cb0b0461 |
| packages/clinical-content/src/answer-choice-timing.ts | ba34c6078923b5d7dc34f283fd00775f261c7561dcbf7fe65a0f1e35497e860f | 721dd09e871137e975c15edb39270e02406a5b058b9aca41b20f637e4c28bac9 |
| packages/game-domain/src/test-choice-orders.ts | 7f06f75a9b26f6d5b196c1f69635458b3cd0467528f6dfa65636fc77922a2d77 | e08fd207f81a6d07a5ac4e02f3f770653a6c6755d3d92d8756c6f118ee2bde03 |

The authority and new accepted-data/view modules are additional transitive inputs for the manager's rebind. No Level 5 evidence/pin/behavioral artifact was changed. No balance/progression, cloud/Supabase or GS-release edit.

Manager next: integrate this exact local checkpoint and coordinate any remaining baseline or concurrent-lane validation failures. New versions still require named clinical version approval; direction is not that approval. No next authoring batch was started. No Git, installs, network, agents, external messages, deployment or rebind. This work is local only; the manager owns the "push to GitHub" backup gate. Launch/origin unchanged.
