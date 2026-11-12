# Topic program acceptance batch 5 - 2026-11-11

Completed on 2026-11-12. Accepted **22 exact PASS nodes in 21 complete cases**
from the manager's 29 requested identities. Seven nodes are skipped. Every
accepted variant remains **needs_clinician_review**. Manifest
`question-ship.2026-11-11.v14` has **686 authority rows**. The default now contains
**1338 cases, 1533 nodes, 1035 registered meanings and 840 scored meanings**.

[The acceptance packet](question-topic-acceptance-batch5-packet-20261111.json)
contains exact identities, latest review records, source hashes, existing
claims/sources, clinical contexts, runtime probes and diagnostic-choice tuples.
Keys are shown first for review only. Runtime options shuffle.

## Accepted and skipped

| Topic | Requested nodes | Accepted nodes | Accepted cases |
| --- | --- | --- | --- |
| pediatric-neck-thoracic-gu | 6 | 0 | 0 |
| vascular-venous-lymphatic-access | 14 | 13 | 12 |
| esophagus-motility-achalasia (salvage) | 1 | 1 | 1 |
| bariatric-metabolic (salvage) | 3 | 3 | 3 |
| pediatric-gi-abdominal-wall (salvage) | 5 | 5 | 5 |

| Accepted node | Case | Variant | Concept |
| --- | --- | --- | --- |
| node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1 | case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2 | question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1 | concept.n2.vte-prophylaxis-to-treatment |
| node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2 | case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2 | question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2 | concept.postoperative-dvt.three-month-anticoagulation |
| node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1 | case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2 | question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1 | concept.postoperative-dvt.three-month-anticoagulation |
| node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2 | question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | concept.n1.lymphedema-new-tempo-venous-assessment |
| node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2 | question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1 |
| node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2 | case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2 | question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2 | concept.dialysis-access.maturation-physical-assessment |
| node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | concept.venous-leg-ulcer.arterial-assessment-before-compression |
| node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1 | case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1 | concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1 |
| node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1 | case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1 | concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1 |
| node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2 | question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1 |
| node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2 | question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1 |
| node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1 | case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1 | question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1 | concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1 |
| node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1 | case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2 | question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1 | concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1 |
| node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2 | question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1 |
| node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1 | question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | concept.pbh.spontaneous-evidence-before-treatment.v2 |
| node.topic.bariatric-metabolic.diet-response-drug-stage.v2 | case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1 | question.topic.bariatric-metabolic.diet-response-drug-stage.v2 | concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2 |
| node.topic.bariatric-metabolic.refractory-reflux-revision.v2 | case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1 | question.topic.bariatric-metabolic.refractory-reflux-revision.v2 | concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2 |
| node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2 | case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2 | question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2 | concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 |
| node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1 | question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 |
| node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1 | question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1 |
| node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1 | question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1 |
| node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1 | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 |

| Skipped node | Reason | Unlisted scored siblings in source contexts |
| --- | --- | --- |
| node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2 | This patient needs compatible, explicit pediatric demographics and child art. |  |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | This pediatric variant needs supported outpatient choices and its exact child/parent context. |  |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | This pediatric variant needs supported outpatient choices and its exact child/parent context. | node.pediatric-neck-thoracic-gu.20261111.neck-target |
| node.pediatric-neck-thoracic-gu.20261111.negative-exploration | Reviewed case includes scored nodes outside the manager PASS list. | node.pediatric-neck-thoracic-gu.20261111.scrotum-doppler |
| node.pediatric-neck-thoracic-gu.20261111.node-sample | This pediatric variant needs supported outpatient choices and its exact child/parent context. |  |
| node.pediatric-neck-thoracic-gu.20261111.pyogenic-drainage | This patient needs compatible, explicit pediatric demographics and child art. |  |
| node.vascular-venous-lymphatic-access.pe-imaging-contrast-reaction.20261111.v1 | Reviewed case includes scored nodes outside the manager PASS list. | node.vascular-venous-lymphatic-access.pe-rv-positive-care.20261111.v1 |

The pediatric neck CDH and pyogenic cases lack compatible explicit pediatric
identity metadata. The DSD, mediastinal biopsy and node-sample cases have
prospective test timing which the current pediatric runtime rejects. The
negative-exploration and PE-imaging cases include unlisted scored siblings.
Each skip is recorded against its exact requested identity.
Gastroschisis and the quality-safety checklist item received no acceptance row.

The first pediatric preflight omitted prospective timing registration. It
temporarily selected three additional cases which would fail after timing
installation. The timing-aware recheck withholds those exact three cases.
[The initial preflight archive](../../tools/question-quality/fixtures/question-topic-acceptance-batch5-initial-preflight-20261111.json)
retains that probe, its initial correction ledger and every original reviewed
serialization. The immutable intake still records the preceding v13 default.
Final admission probes run with the actual accepted timing registry installed.

## Frozen bytes and identity

[The reviewed source archive](question-topic-acceptance-batch5-source-freeze-20261111.json)
contains the original node/question serializations for all 22 accepted nodes.
Six object-key order normalizations are recorded separately. Whole source-file,
question, node, case and accepted-view hashes accompany the records.

Accepted runtime copies apply **65 exact name-only substitutions in 12 cases**.
[The correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch5-literal-name-corrections-20261111.json)
records each changed field, its original text, replacement and source hash.
Options feedback and explanations follow the same patient-name rule.
Question and concept identities stay exact. Fixed demographic profiles remain
bound to the reviewed cases. Five pediatric salvage cases have compatible
child art, an explicit pediatric profile and parent accompaniment in the
existing operational Pediatric Examination Room.

All 1019 previous registered meaning definitions and 664 prior authority rows
pass exact preservation checks. Sixteen authored meanings are newly registered.
One ordinary replacement and four explicit topic consolidations retire 13
prior cases containing 19 nodes. The shared venous-ulcer source is retired
once and both reviewed successor cases remain admitted.

| Retired case | Original scored nodes | Original SHA-256 |
| --- | --- | --- |
| case.postoperative-dvt.hernia-repair | node.postoperative-dvt.hernia-repair.1, node.postoperative-dvt.hernia-repair.2 | 834823a9c5a4a37652bbbd426d172054247337bba75b9237eddba6e4c2d57cd6 |
| case.postoperative-dvt.bowel-surgery | node.postoperative-dvt.bowel-surgery.1, node.postoperative-dvt.bowel-surgery.2 | 104103a91e6c476fcdaac5538f7818d3f35edc2961c654c1bc3cea7d74ebc44f |
| case.postoperative-dvt.postop-visit | node.postoperative-dvt.postop-visit.1, node.postoperative-dvt.postop-visit.2 | 169e7aa5ffb3d6d2a884db9e945cd615d076dd96144d8aa0169f399f42ab2770 |
| case.post-bariatric-hypoglycemia.postmeal-shaking | node.post-bariatric-hypoglycemia.postmeal-shaking.1 | f5a23f548444c65a9cd2649886993ed40ab0979fd6dbc08c29d1513703b14702 |
| case.post-bariatric-hypoglycemia.postmeal-confusion | node.post-bariatric-hypoglycemia.postmeal-confusion.1 | 35ad13e495e7a476838ca2662ecaba98f01cf546de2fe3f81f2207a080301b92 |
| case.post-bariatric-hypoglycemia.postmeal-weakness | node.post-bariatric-hypoglycemia.postmeal-weakness.1 | 309bf05f3f1783fc93efbc7b999d2d5020c0033fadd460712725fa0b59ba2d90 |
| case.post-bariatric-hypoglycemia.postmeal-dizziness | node.post-bariatric-hypoglycemia.postmeal-dizziness.1 | 2e3fd7e8dd70dd8ade90f3db61defb290e53f8d1fab1e49f18f4c69f344cad3a |
| case.venous-leg-ulcer.recurrent-ulcer | node.venous-leg-ulcer.recurrent-ulcer.1, node.venous-leg-ulcer.recurrent-ulcer.2 | 8a07cd606e38d3dd078064add9f19abfcb6daaf7ff50922d226a696365e256f9 |
| case.venous-leg-ulcer.varicose-changes | node.venous-leg-ulcer.varicose-changes.1, node.venous-leg-ulcer.varicose-changes.2 | af1813cb3b6d4c2c4bb2b78e9a3ce1daf295151101db44b0a0df4bc4ce128d3a |
| case.venous-leg-ulcer.healed-edge | node.venous-leg-ulcer.healed-edge.1, node.venous-leg-ulcer.healed-edge.2 | 0985f676c1907f1254ad6ebb0e93bcdca784954f2368a6d6eaa8912cd88e25a9 |
| case.gs028.varicose-veins.a-asymmetric-branches | node.gs028.varicose-veins.a-asymmetric-branches.1 | 98eb300c7491299c9b948d0b338df9b05be2e0c001d58c33441acae39e202e56 |
| case.pediatric-clinic.groin-bulge-after-play | node.pediatric-clinic.groin-bulge-after-play.1 | ac82b189e90e78cc85c6324253639b140e8c2b1b35671c8d6bdee62e39bef86e |
| case.pediatric-clinic.intermittent-groin-swelling | node.pediatric-clinic.intermittent-groin-swelling.1 | 5a9e01d7f4828b345126d2f2d71cc1662b6750a358d1a6349a33e1454f0eaacc |

All **47 new compatibility tests pass**. They cover fresh admission and
format-3 completion for all 21 new cases, plus snapshot and committed-journal
reopening/completion for all 13 retired cases. Original question versions,
answer choice meaning, FSRS identities and existing reviews are checked.
The historical pediatric fixture explicitly opens the exact retired M7 chart
under its retained source context. Its real room, child art and parent paths
stay exercised. The M7 admission suite uses its verified pre-batch5 content
epoch with the current reducer. Original assertions and timeout budgets remain.

## Runtime bindings

Sixteen adult cases admit through the existing clinic route and match APP
consult affinity. Five pediatric cases admit through the existing pediatric
clinic route with a real examination room. All 22 timing rows are installed.

The domain worker must install **24 exact diagnostic-choice bindings** exported
as `QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS` in
packages/game-domain/src/test-choice-orders.ts. They retain the explicit
not_executed/future_planned disposition. The five pediatric cases have no
enacted tests or procedures. Three held pediatric neck cases require a
separate manager decision about supported pediatric testing before acceptance.
The two cases missing pediatric identity metadata need a reviewed compatible
profile/art context before a later acceptance attempt.

| Case | Node | Variant | Choice | Label | Timing profile |
| --- | --- | --- | --- | --- | --- |
| case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2 | node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | choice.vascular-venous-lymphatic-access.lymphatic-acute-change.arm-venous-duplex.v2 | Left-arm deep-venous duplex ultrasound | timing.test.venous_duplex |
| case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2 | node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2 | Left-arm radionuclide lymphoscintigraphy | timing.test.nuclear_imaging |
| case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2 | node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2 | choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2 | Chest CT venography | timing.test.ct |
| case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2 | node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | choice.vascular-venous-lymphatic-access.varicose-proximal-territory.iliac-venography.v1 | Iliac and pelvic CT venography | timing.test.ct |
| case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2 | node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1 | Repeat femoral and popliteal compression duplex | timing.test.venous_duplex |
| case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2 | node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1 | choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1 | Lower-limb radionuclide lymphoscintigraphy | timing.test.nuclear_imaging |
| case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1 | node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.toe-waveforms.v1 | Left toe pressure and digital waveform testing | timing.test.vascular_physiology |
| case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1 | node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.exercise-ankle.v1 | Left exercise ankle-pressure testing | timing.test.vascular_physiology |
| case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1 | node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1 | choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.arterial-cta.v1 | Left-leg CT angiography | timing.test.ct |
| case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2 | node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.serial-proximal.v2 | Arrange serial proximal compression ultrasound | timing.test.venous_duplex |
| case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2 | node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2 | choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2 | Arrange iliocaval CT venography | timing.test.ct |
| case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2 | node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | choice.vascular-venous-lymphatic-access.access-hand-physiology.compression-perfusion.v2 | Digital pressures and waveforms during access-compression testing | timing.test.vascular_physiology |
| case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2 | node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2 | Repeat nerve-conduction testing across the wrist | timing.test.general_diagnostic |
| case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2 | node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2 | choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2 | Cervical-spine magnetic resonance imaging | timing.test.mri |
| case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2 | node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy | Upper endoscopy with esophageal and junction inspection | timing.test.upper_endoscopy |
| case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2 | node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.barium | Upright timed barium esophagography with tablet passage | timing.test.contrast_swallow |
| case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2 | node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3 | choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph | Ambulatory esophageal pH-impedance reflux monitoring | timing.test.ambulatory_reflux_monitoring |
| case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1 | node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast | Supervised fasting evaluation with venous biochemical sampling | timing.test.metabolic_workup |
| case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1 | node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.spontaneous | Venous biochemical sampling during a typical spontaneous spell | timing.test.basic_labs |
| case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1 | node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2 | choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt | Oral glucose tolerance testing with venous biochemical sampling | timing.test.metabolic_workup |
| case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1 | node.topic.bariatric-metabolic.refractory-reflux-revision.v2 | question.topic.bariatric-metabolic.refractory-reflux-revision.v2 | choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off | Ambulatory pH-only monitoring after PPI withdrawal | timing.test.ambulatory_reflux_monitoring |
| case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1 | node.topic.bariatric-metabolic.refractory-reflux-revision.v2 | question.topic.bariatric-metabolic.refractory-reflux-revision.v2 | choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off | Ambulatory impedance-pH monitoring after PPI withdrawal | timing.test.ambulatory_reflux_monitoring |
| case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1 | node.topic.bariatric-metabolic.refractory-reflux-revision.v2 | question.topic.bariatric-metabolic.refractory-reflux-revision.v2 | choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on | Ambulatory pH-only monitoring during PPI treatment | timing.test.ambulatory_reflux_monitoring |
| case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1 | node.topic.bariatric-metabolic.refractory-reflux-revision.v2 | question.topic.bariatric-metabolic.refractory-reflux-revision.v2 | choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-on | Ambulatory impedance-pH monitoring during PPI treatment | timing.test.ambulatory_reflux_monitoring |

## Later acceptance membership guards

The topic baseline contained 1166 passed and 33 failed tests in 60 files.
25 topic test files now recognize later exact manager
acceptances or their retained historical cases. The shared test helper verifies
authority against the captured prior manifest plus this batch's exact rows,
checks every fresh tuple, and binds each admitted case to its frozen SHA-256.
Retired source lookups require an explicit retirement relation and retained
definition. Existing clinical/source/approval assertions remain in place.

| Updated topic test | Intake SHA-256 | After SHA-256 |
| --- | --- | --- |
| packages/clinical-content/src/question-topic-anorectal-benign-pelvic-floor-20261111.test.ts | 051cc442f515f3f25a006f37d48fc5700f527f95998498f0545088fc629adfb1 | 7cd3d8e33a7e90bbc10e476fddad7019eb58156f140a25f600327cfab410bb7b |
| packages/clinical-content/src/question-topic-breast-cancer-20261111.test.ts | 454b3ae99cb37da06275631559cc697f1f6ce7967eef9517b1217966fc3c0bdf | 07cef40bdc836147dfc1ed59b3d6938058a4ac0405be71f0a4bf8f9cec062f56 |
| packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts | ca5b17cdd6b04c596e6c4801712ff8d36569e5025be8daf410a70683a9014bb1 | f9af25e9876cca62b5316584fd5ff9df190672b557fab82bf5c2ba86b7d9b431 |
| packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.test.ts | 01fcfa9525b1a98392f5fc910d4f709b1e6613889db51d793a0dd01ba2e9acba | 9152297e96bac688721facd721d16481f54c58714df430df4a4c579cbef95c9b |
| packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.test.ts | 2d0c64ba47483a9e8f83a7b2e0787d4fd4c717cd277ac831d3db4331b0ab3dec | e9c6d3bb459bbb6b3d60bd8c405d16c92f2969a815d88c01ed1fed8c124273c3 |
| packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts | c82744e657fa823d99fa31fab7e0d0203fdaa7e77eadaff8b907f3b2f243c9dd | d027f5c51d0db6f17504fe33c0e56d411ccaf5acf03cd3e921b813cd971c7592 |
| packages/clinical-content/src/question-topic-esophagus-structural-inflammatory-emergencies-20261111.test.ts | 79e527df3fbe66ce72c653b41c2a00499b2f0770c055182b773e295ec3c1a9db | 11afc946957f4cb0b76d7861410b506f3f172cbc0e0c26a4eac7dad322810765 |
| packages/clinical-content/src/question-topic-ethics-professionalism-20261111.test.ts | 4a3c00d8e84b34544676b14f8c83a6c877717de87ce04e27601ba6f24fb8e810 | 12f37fe405bdfece7d4c28c90ab6c521eee1319e50e6745ad975e36f53af704c |
| packages/clinical-content/src/question-topic-head-neck-salivary-20261111.test.ts | cd89a62d9ba3ffb57c0e7f663a4282a69c728964fc4be6d9bec7c3489815e04c | 8c22b78d393fa826bc16b3b242db1760311e16384570662886035bba75f6d496 |
| packages/clinical-content/src/question-topic-hematology-transfusion-coagulation-20261111.test.ts | 2b7a5ee8924f2c934eba98a3cdc5f58f449d1dee0749075288c9385917e312ad | 9fce69986b84c485fad3c150e3687598746b943d10415f9299cd88570416e06b |
| packages/clinical-content/src/question-topic-liver-benign-portal-infection-20261111.test.ts | 34f45e003ad19676e6c65366a5cbb6e88756859dec69ab33454b0687d0115cb8 | ff470bcec2a210b1e9ba9ebbb82527939ae8a4008ea8c70557f8f14938a6da6f |
| packages/clinical-content/src/question-topic-melanoma-cutaneous-cancer-20261111.test.ts | b35ec24ed7830c22eee84066544adae5214adc4912c3886d334a69913e3f9477 | d18ed76676661e338395bf481f4fa69af9139ae593bd1d56b2fa4b423a6b7e9b |
| packages/clinical-content/src/question-topic-neuro-orthopedic-essentials-20261111.test.ts | 7e1daa8ee574764211f84daf08a5d8428a3a54c3f35d65aaf433dcd54520194c | 01b01fa329b59566f0cb286658af198130a1e8604704d9e7d04541d0a52e6160 |
| packages/clinical-content/src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.test.ts | fd14e5e26249e016d8e0c856a3374d81bb40c0870ba1d99260c5ce91f4a70805 | e5303dba986037313cf933e917e90ae9c7d4ef31d2085bb1bd69ed13f24aa5dc |
| packages/clinical-content/src/question-topic-parathyroid-calcium-20261111.test.ts | 4f68bbcfd520136355b492eca3f9559d907efc0129d1a27cc4f34eed30e01fb0 | 896cc5f8bdd120cca2b5040ab223f64e32558889a8e838e02ec987875eaeb9ab |
| packages/clinical-content/src/question-topic-statistics-20261111.test.ts | 82d2c1edb4de099ae40443af6c78783c67a204a8543f32eae1767ec4bf93d90c | 6f421d31b81a07dd20b938ff5ec132a8db12fd6e9e5788be0a1dd3bb55ba0947 |
| packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts | 5da396ce4e43f350214cce0949d702268bdc8460cf054540194e3759798bf5d9 | 8abdab95a88d756af81ea2a0e06a7b04651baee5b4104cc5716c39a24eb1d834 |
| packages/clinical-content/src/question-topic-thyroid-nodules-cancer-20261111.test.ts | 71d3ce663f8e2194e76d9cac2018f6bc8f9954520664fd948852750ded908465 | 49119d76cfe4010ebf397be3bbb19d7458704e2c8e7cd64befde61f3b544b6af |
| packages/clinical-content/src/question-topic-transplant-immunosuppression-20261111.test.ts | b49f7f7a20271a71ad8583901961c74b8bcb68e901c026ebe115cd65c6566eea | fa831d766c6486e8b29f86cf5ca8ae7123dc3a64c3b9e7934593ecf6798a09cf |
| packages/clinical-content/src/question-topic-trauma-head-spine-extremities-20261111.test.ts | f0f80832076951cae420100f18156aaa5d250d7cefe7d91b3b21df32f3de7992 | 0c5678170b2dfc7a16200a4c9cdd60d9a3cc9c0b52d2da9c11d637e026a87394 |
| packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.test.ts | 43fc15e225664bec4d7f408ddbc2a805eeebd1f638c584c1d1d19903bd2833e2 | 28acfa6088d43a8be7de8bc5c15e720e125f0cc53b7af7f3a163c21a94d9e983 |
| packages/clinical-content/src/question-topic-vascular-aorta-20261111.test.ts | b7d5e154472f93bfdf8718e91e12f9e64b7bac11890259853b13e04e144ced41 | 64820acc8cff923ae3127118c21974452dfd0e0f96c98c14ae06ff0f7f6deb4a |
| packages/clinical-content/src/question-topic-wound-healing-immunology-20261111.test.ts | 441ebe9971d05421a6d1f417a73b0ceed4705f8556d0d6e580553de9bd9bdce2 | 9bdb26b6888aae0aab6422fa1f0da25b4ecadefd148b2204c44642eea1961366 |
| packages/clinical-content/src/question-topic-bariatric-metabolic-20261111.test.ts | 913f7b7c62eb12f743413b0ea0dd01be4c63adab902756149489bc08e1f0eca0 | f6244ce724f7628fd37ecd4e3b0d1305a5d4ea0ab37def33377da9cfe4d357a7 |
| packages/clinical-content/src/question-topic-vascular-venous-lymphatic-access-20261111.test.ts | cd7d909e5e0168a8b614808954b34c4b2fc3b2bf6ed565b5737400984b6a53db | 929774f0ccc716c7d5e6b239218c9deabf4aeb52bd9688a994a67f57fda17985 |

29 of the 33 original failing topic tests pass
in the final full clinical run. Remaining topic guards are listed below and
in the validation JSON. Their captured review or source mismatch requires
separate reconciliation. Original review files, source packets and immutable
captures retain their original bytes.

| Remaining topic test | Failure title |
| --- | --- |
| packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts | two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items |
| packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts | esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case |
| packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts | pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review |
| packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts | surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue |

## Counts, source views and hashes

| Measure | Before | After |
| --- | --- | --- |
| cases | 1330 | 1338 |
| nodes | 1530 | 1533 |
| registeredMeanings | 1019 | 1035 |
| scoredMeanings | 824 | 840 |
| acceptedRows | 664 | 686 |
| timingRows | 2814 | 2836 |

| Artifact | SHA-256 |
| --- | --- |
| Default release | 2c524904fafc7e915dab19256a191397e0a00f5a68bf0ebc9e2e37fe69394921 |
| Manifest | 6e074c70648de65270be5f86610d55f0a3a1ab2212df453ac0e5adee1834c9ce |
| Authoring catalog | 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40 |

| Accepted source view | Cases | Nodes | SHA-256 |
| --- | --- | --- | --- |
| topic-batch5-vascular-venous-lymphatic-access | 12 | 13 | e9c9cc2d44da710e5b2a3c9ff110aa5bba8fcfac73f2ef87c20a53b21a82afeb |
| topic-batch5-esophagus-motility-achalasia | 1 | 1 | e485d219e2194de3f96ea132a080be753ef3f2d55a2eb37ecf729b92ed018e46 |
| topic-batch5-bariatric-metabolic | 3 | 3 | 91b2ea9aa11c08086d7461f8efe75c303a6849190c82d9c7a6759419cba794e9 |
| topic-batch5-pediatric-gi-abdominal-wall | 5 | 5 | 6629d8ac7dac29ea836d829f5a2b50a28450a234ea323bf9682e98e3912668fa |

The accepted copies reuse 72 existing atomic claims and
26 existing source records. The packet retains their
full metadata, license/reuse status and claim links. This integration adds
no clinical facts or external-source records.

## Validation

All Vitest commands use npm.cmd with --pool=threads --maxWorkers=2. Player
tests use the existing Windows preload. Full output, commands, durations and
every failure message are recorded in
[the validation receipt](question-topic-acceptance-batch5-validation-20261111.json)
and the logs under .local-dev/question-topic-acceptance-batch5-20261111/.
The initial player wrapper returned 1 after React act warnings on stderr,
with all 128 assertions passing. The final player invocation explicitly records
npm's native exit code in player-close-exit.json and retains the warning output.

| Run | Files | Pass | Fail | Skip | Duration |
| --- | --- | --- | --- | --- | --- |
| clinical-final | 200 | 2924 | 8 | 0 | Duration  207.99s (transform 25.16s, setup 0ms, import 360.68s, tests 34.83s, environment 13ms) |
| domain-full | 218 | 5868 | 29 | 1 | Duration  651.29s (transform 17.68s, setup 0ms, import 449.55s, tests 832.14s, environment 13ms) |
| player-close | 4 | 128 | 0 | 0 | Duration  57.39s (transform 10.44s, setup 0ms, import 20.08s, tests 88.54s, environment 0ms) |
| focused-close | 8 | 97 | 0 | 0 | Duration  14.16s (transform 7.41s, setup 0ms, import 24.47s, tests 2.44s, environment 1ms) |

All seven workspace typecheck scripts ran. 7/7 pass.
Cue tests pass 33/33. The full-library naming guard runs in both the complete
clinical suite and focused-close. Exact typecheck diagnostics follow.

```text
All seven workspace typecheck scripts pass.
```

| Run | File | Failing test |
| --- | --- | --- |
| clinical-final | packages/clinical-content/src/question-flags3-20261107.test.ts | flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact |
| clinical-final | packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts | exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures |
| clinical-final | packages/clinical-content/src/question-stats1-20261108.test.ts | stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration |
| clinical-final | packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts | stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions |
| clinical-final | packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts | two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items |
| clinical-final | packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts | esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case |
| clinical-final | packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts | pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review |
| clinical-final | packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts | surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue |
| domain-full | packages/game-domain/tests/approved-clinical-admission.test.ts | approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8 |
| domain-full | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9 |
| domain-full | packages/game-domain/tests/test-choice-order-inventory.test.ts | active-release test-choice order inventory classifies every timing.test choice and permits incorrect records only as explicit non-execution |
| domain-full | packages/game-domain/tests/topic-runtime-bindings.test.ts | accepted topic runtime diagnostic bindings requires every exported acceptance batch, including future batches, to install all its exact bindings |

Advisory lint reports 39 findings in
17 of 22 accepted variants, and
1845 findings in 878
of 1528 unique live variants. The eight
reviewed uniquely-longest keys are individually hash-bound. The full phrase
and field report is [the cue inventory](question-topic-acceptance-batch5-lint-20261111.json).

## Changed Level5 inputs and files

| Changed bound input | Intake SHA-256 | After SHA-256 | Recorded SHA-256 |
| --- | --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | 7fd3dc0cd303c8e6a29b07b68275c78210ee97b534fc38a7e2bd6d0b4c3d2030 | bfc1c6c3051d46543b6f2ca13efa90d2683924d78f6d15506aef468eb90c538f | 6d9870d53383af7da6ee7547ba702410a2545882876faa1696c0e1217fae311c |
| packages/clinical-content/src/index.ts | d02bccc92886a5a4536e183e1f1784babd2f57b4a78892f5233e7b27e9a6a27f | 80f335e1752faa411561443223f30b8a59e0d1a4dd65d89641db04ae6e21a017 | a57ffcec34d75e2e337790f1ac0d71e4bfdc8f79d53cdb28596e00ead60413e4 |
| packages/clinical-content/src/answer-choice-timing.ts | e073bf1ac48cbfc8917ffd52c59d6b6bf13ce1e15ea1c053c4c907179060cd72 | 32ca68874463e954dfccdd211145fa410aaf61bc351001ccc9dd651523a244cd | 7db1b1253c7d3064adb0602360925c0739bb65c719603507c3fa09a6732ba245 |

| New runtime dependency | SHA-256 |
| --- | --- |
| packages/clinical-content/src/question-program-batch5-accepted-data-20261111.ts | 6f85d109511e79a639249d2558a026752b3c920e91bd7c4591dade6eeec089a0 |
| packages/clinical-content/src/question-program-batch5-accepted-20261111.ts | 3f422ab5294215bc2798736bd330b85aa46a19eab252ca20cb1f28a20229329a |

The three bound inputs were already unbound at intake. The manager owns the
dependency inventory, evidence rebind and release integration. Exact scoped
files, preimages/postimages and protected-source receipts are in
[the file receipt](question-topic-acceptance-batch5-files-20261111.json).
Every requested topic-source module, packet, ledger and review file retains
its captured hash. The test-only membership corrections are recorded above.

The shared handoff and ExecPlan record completion. This checkpoint is local
to the main working tree. The manager owns the backup gate and can request
the checkpoint with "push to GitHub".
