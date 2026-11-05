# Question ship manifest integration contract

Calendar 2026-11-05; requested batch stamp 20261104. This is software/content integration guidance, not clinical approval or a release authorization.

## Single authority and exact versions

[question-ship-manifest.ts](../../packages/clinical-content/src/question-ship-manifest.ts) is the sole acceptance list. It explicitly pins 1,423 legacy case/node/question/concept tuples from the 1,110-case pre-flag bank, then overrides or adds exactly 40 manager-directed entries: nine N1 review-two PASS, twelve N2 review-two PASS, nine flags and ten batch-2a rewrites. No N1 or N2 round-three draft was accepted by this worker. A source view, author self-check, clinician-review status or presence in a catalog does not add acceptance.

The legacy carry-forward implements the user's instruction to keep prior live versions for unaccepted rewrites. It is not retrospective independent or clinical approval of the whole bank. The two manager decision records explicitly include some REVISE rewrites; those are included because the manager directed shipping them, not because the worker relabelled them PASS.

## Runtime and historical data

- `QUESTION_CATALOG_RELEASE` retains current N1/N2 drafts and historical releases remain exported. The default `SYNTHETIC_CLINICAL_RELEASE` is the manifest projection: 1,131 cases and 1,444 nodes. Current catalog: 1,189 cases. All registered concepts remain available for saved histories; a registered card is not an admission opportunity.
- The projector reads exact retained source views. It substitutes only accepted nodes, retains unaccepted legacy nodes and takes case presentation fields only from the manifest's explicitly chosen header view. B2A02's accepted later node therefore coexists with B2A03's original live first node. [Composed preview](question-ship-preview-20261104.json) exposes all 39 affected cases for review.
- Admission eligibility and the shared patient/employee selector reject unknown or unaccepted tuples. Availability excludes them before reporting supply. A small guard in `createEncounter` also protects the direct tutorial paths. It adds one import and four guard/comment lines; no tick, navigation or cache algorithm changed.
- Existing frozen encounters, answer orders, source records, old timing/order identities and FSRS histories are retained. Tests restore and complete a pre-gate frozen unaccepted question without admitting that version again. No save migration, reset or cloud edit was made.
- That proof covers serialized frozen encounters, not all historical cloud command-log replay. The player run has seven failing cloud tests. Manager/save-worker integration must verify that a previously committed admission is reconstructed from its original frozen version/context, rather than re-admitted as a new request against the current manifest. Do not bypass fresh acceptance to repair replay.
- Unknown case IDs are denied. Do not add a production test/preview bypass to make old fixtures pass.

## Rewrite writer representation and required future action

The seeded nineteen rewrite definitions already exist with exact version IDs. This lane changed none of their definitions. Flags use retained `flags-round3` source cases, including earlier exact PASS versions retained by that stage; batch 2a uses `batch2a-round3`. No rewrite file needs a content change for this seed.

The concurrent rewrite writer registered `batch2b-round2` as a retained source view and uses `withAcceptedQuestionBankBatch2bRound2Concepts` so accepted new meanings can be registered without promoting the whole draft set. That integration is preserved. No B2B entry is seeded without a manager decision.

For a future manager-accepted rewrite:

1. Keep the old question/case/timing/order definitions for frozen encounters. Create a separate question version and a separate concept identity if the meaning changes.
2. Add or replace the one exact acceptance row for its case/node in the manifest: acceptance ID, case ID, node ID, question variant ID, concept ID, retained source-view name and actual manager decision path. Do not add two rows for the same case/node.
3. If its accepted presentation changes, set that case's `headerSources` entry to the exact accepted projection. If only the node changes, preserve the previously accepted header. A new case must have an explicit header source. Do not import an unaccepted neighboring presentation through a newer whole-case view.
4. Ensure the source view is registered in the existing projector call and its concept definition is in the release's concept registry. The current batch-2b helper already performs the accepted-concept part. Keep testing previews and exact execution dispositions bound to the new question version; retain all old rows.
5. Review any mixed accepted/fallback multi-node case as composed, then run manifest, admission/selection, timing, type and frozen-release checks. A missing view, missing exact version, duplicate node acceptance or changed concept fails closed.

For future acceptance of an N2 round-three item, the retained current `catalog` view can supply the exact new case. Add the actual manager decision and explicit case header source; resolve its targeted source/clinical holds rather than infer acceptance from the same-author rubric. The seed script is one-time and intentionally refuses to overwrite the manifest.

## Test integration still needed outside this lane

The full suites contain historical/native fixtures that explicitly admit arbitrary or superseded question versions. That is incompatible with the new acceptance contract. The frozen N1 files remain byte-exact while independent review runs. Manager/rewrite integration must scope content-preservation assertions to the retained stage and build historical frozen-save witnesses without fresh admission of unaccepted content. Pure FSRS unit tests can isolate acceptance as a separate dependency; runtime integration tests must use actual accepted tuples.

`tools/question-quality/lint.test.mjs` currently fails its rewritten-owner-context test on F02 because it reads the live fallback, whose old remote-nerve distractors are intentionally preserved by the manager decision. Its rewrite-quality assertion should inspect the exact retained flag candidate stage (`QUESTION_NEW_N1_PRE_RELEASE`) or exact revision projections; a separate live inventory may accurately retain the old cue. Do not suppress the rule or rewrite the unaccepted item here.

Shared timing tests now distinguish live admission from the larger timing archive. Every live node still needs one exact timing tuple; every retained exact order still needs a real catalog/historical choice and valid route. The historical pre-ship golden counts remain intact. No budget, timeout or assertion was waived.

## Exact accepted entries

| Acceptance | Question variant | Concept | Source view |
| --- | --- | --- | --- |
| F01 | `question.dcis.margin-bcs-wbrt.v3.r3` | `concept.dcis.final-cavity-shave-plan.v1` | flags-round3 |
| F09 | `question.pneumoperitoneum.context-dependent-venous-return.v4.r4` | `concept.laparoscopy.pressure-cardiopulmonary.v1` | flags-round3 |
| F12 | `question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3` | `concept.gallstones.cholestatic-next-study.v1` | flags-round3 |
| F03 | `question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4` | `concept.varicose-veins.reflux-after-compression-study.v2` | flags-round3 |
| F05 | `question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4` | `concept.head-neck.cyst-fluid-sample-assessment.v1` | flags-round3 |
| F10 | `question.dcis.sentinel-node-setting.v3.r4` | `concept.dcis.sentinel-node-mastectomy.v1` | flags-round3 |
| F11 | `question.statistics-ethics.perioperative-dnr.v4.r4` | `concept.perioperative-dnr.recovery-endpoint.v1` | flags-round3 |
| F15 | `question.pneumoperitoneum.context-dependent-venous-return.v2.r4` | `concept.laparoscopy.position-gas-integration.v2` | flags-round3 |
| F17 | `question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4` | `concept.palpable-mass.separate-benign-target.v1` | flags-round3 |
| B2A01 | `question.achalasia.manometric-recognition.v1.r5` | `concept.achalasia.manometric-recognition` | batch2a-round3 |
| B2A02 | `question.achalasia.manometric-recognition.v2.r6` | `concept.achalasia.secondary-junction-lesion-assessment.v1` | batch2a-round3 |
| B2A04 | `question.achalasia.high-resolution-manometry.v3.r11` | `concept.esophageal-physiology.integrated-pressure-report.v2` | batch2a-round3 |
| B2A05 | `question.inguinal-hernia.symptomatic-elective-repair.v4.r11` | `concept.inguinal-hernia.recurrence-after-anterior-repair.v1` | batch2a-round3 |
| B2A06 | `question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9` | `concept.groin-ultrasound.proximal-neck-localization.v2` | batch2a-round3 |
| B2A07 | `question.inguinal-hernia.symptomatic-elective-repair.v2.r11` | `concept.inguinal-hernia.symptomatic-elective-repair.v3` | batch2a-round3 |
| B2A08 | `question.inguinal-hernia.symptomatic-elective-repair.v3.r10` | `concept.groin-hernia.femoral-defect-repair-priority.v1` | batch2a-round3 |
| B2A09 | `question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10` | `concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5` | batch2a-round3 |
| B2A10 | `question.quality-improvement.pdsa-act-and-iterate.v3.r11` | `concept.quality-improvement.source-by-method-next-pilot.v1` | batch2a-round3 |
| B2A11 | `question.adrenal-incidentaloma.one-mg-dst.v4.r4` | `concept.adrenal-incidentaloma.acth-directed-source-imaging.v2` | batch2a-round3 |
| review.n1.controlled-enterotomy-mesh.v2 | `question.n1.controlled-enterotomy-mesh.v2` | `concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection` | n1-round2 |
| review.n1.celiac-iga-deficiency.v2 | `question.n1.celiac-iga-deficiency.v2` | `concept.n1.celiac-iga-deficient-serology` | n1-round2 |
| review.n1.hcc-portal-hypertension.v2 | `question.n1.hcc-portal-hypertension.v2` | `concept.n1.hcc-portal-hypertension-referral` | n1-round2 |
| review.n1.incidental-t1b.v2 | `question.n1.incidental-t1b.v2` | `concept.n1.gallbladder-muscle-invasion-referral` | n1-round2 |
| review.n1.breast-mass-morphology.v2 | `question.n1.breast-mass-morphology.v2` | `concept.breast-imaging.suspicious-mass-morphology` | n1-round2 |
| review.n1.phyllodes-benign-margin.v1 | `question.n1.phyllodes-benign-margin.v1` | `concept.phyllodes.benign-positive-margin-management` | n1-round2 |
| review.n1.phyllodes-spread.v2 | `question.n1.phyllodes-spread.v2` | `concept.n1r2.phyllodes-distant-target-evaluation` | n1-round2 |
| review.n1.aldosterone-overt-phenotype.v1 | `question.n1.aldosterone-overt-phenotype.v1` | `concept.n1.aldosterone-overt-phenotype-confirmation` | n1-round2 |
| review.n1.mixing-study-followup.v2 | `question.n1.mixing-study-followup.v2` | `concept.n1.time-dependent-inhibitor-factor-assessment` | n1-round2 |
| review.n2.sglt2-postoperative-restart.v2 | `question.n2.sglt2-postoperative-restart.v2` | `concept.n2r2.sglt2-repeat-procedure-reconciliation` | n2-round2 |
| review.n2.factor-assays-without-mixing-gate.v2 | `question.n2.factor-assays-without-mixing-gate.v2` | `concept.n2r2.new-bleeding-factor-workup-priority` | n2-round2 |
| review.n2.bile-leak-duct-continuity-boundary.v2 | `question.n2.bile-leak-duct-continuity-boundary.v2` | `concept.n2r2.bile-leak-nonrepresented-duct-mapping` | n2-round2 |
| review.n2.gastric-wall-mass-specimen-provenance.v2 | `question.n2.gastric-wall-mass-specimen-provenance.v2` | `concept.n2.gastric-wall-mass-specimen-provenance` | n2-round2 |
| review.n2.ercp-versus-gallbladder-source.v2 | `question.n2.ercp-versus-gallbladder-source.v2` | `concept.n2.ercp-versus-gallbladder-source` | n2-round2 |
| review.n2.hpylori-antibody-after-valid-cure-test.v2 | `question.n2.hpylori-antibody-after-valid-cure-test.v2` | `concept.n2r2.h-pylori-cure-test-medication-calendar` | n2-round2 |
| review.n2.malignant-polyp-local-versus-regional-risk.v2 | `question.n2.malignant-polyp-local-versus-regional-risk.v2` | `concept.n2.malignant-polyp-local-versus-regional-risk` | n2-round2 |
| review.n2.ventral-hernia-priority-change.v2 | `question.n2.ventral-hernia-priority-change.v2` | `concept.n2r2.emergency-hernia-closure-and-bowel-reassessment` | n2-round2 |
| review.n2.negative-predictive-value-denominator.v2 | `question.n2.negative-predictive-value-denominator.v2` | `concept.n2r2.negative-result-population-and-protocol` | n2-round2 |
| review.n2.positive-likelihood-ratio.v2 | `question.n2.positive-likelihood-ratio.v2` | `concept.n2r2.positive-test-odds-and-investigation` | n2-round2 |
| review.n2.equivalence-margin-versus-null-test.v2 | `question.n2.equivalence-margin-versus-null-test.v2` | `concept.n2r2.equivalence-and-safety-implementation` | n2-round2 |
| review.n2.case-mix-standardized-risk.v1 | `question.n2.case-mix-standardized-risk.v1` | `concept.n2.case-mix-standardized-risk` | n2-round2 |

## Level 5 and release ownership

Changed recorded Level 5 inputs: clinical-content `index.ts`, `synthetic-content.ts`, `answer-choice-timing.ts`; game-domain `test-choice-orders.ts`, `clinical-case-eligibility.ts`, `clinical-selection.ts`, `routine-patient-availability.ts`, `reducer.ts`. The availability reference test-support file is also changed and is not in the older evidence input map. Eleven new runtime modules and one original PNG are transitive/display dependencies. Exact paths/hashes are in the scoped audit. No Level 5 evidence, pin, checkpoint, budget or expected result was edited or rebound. Manager freezes the integrated tree, resolves fixtures/clinical holds and runs the actual release-tree binding.

No direct Git command or Git mutation, installs, network, agents, external messages, player session/cloud implementation or Supabase edits, deployment or opening-pathway change. The optional repository boundary script attempted a read-only Git spawn internally and was blocked with EPERM; it was not retried. This worker created no remote backup.
