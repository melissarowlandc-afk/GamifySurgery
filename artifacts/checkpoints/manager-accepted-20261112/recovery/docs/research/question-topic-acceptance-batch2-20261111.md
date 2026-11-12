# Topic program acceptance batch 2 — 2026-11-11

Accepted **26 exact PASS nodes in 20 complete cases** from the manager’s 43-node list. The remaining **17 nodes are skipped** because their reviewed cases include unlisted scored siblings. Every new question remains **needs_clinician_review**.

The acceptance binds four static source views. The packet records each latest independent review, full source hashes, clinical claims, source records, exact source nodes and current clinic admission. Keys appear first only in the review packet. Runtime choices shuffle. [Packet](question-topic-acceptance-batch2-packet-20261111.json)

## Accepted nodes

| Exact accepted node | Variant | Case | Meaning | Pending runtime records |
| --- | --- | --- | --- | --- |
| `node.trauma-thoracic.bci-selective-imaging.20261111.v2` | `question.trauma-thoracic.bci-selective-imaging.20261111.v2` | `case.trauma-thoracic.cardiac-course.20261111.v1` | `concept.trauma-thoracic.bci-selective-imaging.v1` | 2 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2` | `question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2` | `case.trauma-thoracic.cardiac-course.20261111.v1` | `concept.trauma-thoracic.bci-arrhythmia-echo.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1` | `question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1` | `case.trauma-thoracic.cardiac-disposition.20261111.v1` | `concept.blunt-cardiac-injury.monitored-disposition` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1` | `question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1` | `case.trauma-thoracic.drain-complication.20261111.v1` | `concept.trauma-thoracic.chest-drain-organ-trajectory.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.thoracic-bleeding-control.20261111.v1` | `question.trauma-thoracic.thoracic-bleeding-control.20261111.v1` | `case.trauma-thoracic.bleeding-course.20261111.v1` | `concept.trauma-thoracic.hemothorax-physiology-escalation.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.retained-hemothorax.20261111.v2` | `question.trauma-thoracic.retained-hemothorax.20261111.v2` | `case.trauma-thoracic.bleeding-course.20261111.v1` | `concept.trauma-thoracic.retained-hemothorax-vats.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.trauma-thoracic.rib-fixation-weaning.20261111.v2` | `question.trauma-thoracic.rib-fixation-weaning.20261111.v2` | `case.trauma-thoracic.chestwall-course.20261111.v1` | `concept.trauma-thoracic.rib-fixation-failed-weaning.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.screening.v2` | `question.vascular-aorta.screening.v2` | `case.vascular-aorta.screening-review.v2` | `concept.aaa.one-time-ultrasound-screening` | 2 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.proximal-seal-repair.v1` | `question.vascular-aorta.proximal-seal-repair.v1` | `case.vascular-aorta.proximal-attachment-leak.v1` | `concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1` | 1 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.ascending-emergency.v1` | `question.vascular-aorta.ascending-emergency.v1` | `case.vascular-aorta.retrograde-ascending-extension.v1` | `concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1` | 1 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.initial-type-b.v2` | `question.vascular-aorta.initial-type-b.v2` | `case.vascular-aorta.impulse-response-review.v2` | `concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.lsa-coronary-inflow.v1` | `question.vascular-aorta.lsa-coronary-inflow.v1` | `case.vascular-aorta.tevar-inflow-and-neurology.v1` | `concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.post-tevar-cord-rescue.v1` | `question.vascular-aorta.post-tevar-cord-rescue.v1` | `case.vascular-aorta.tevar-inflow-and-neurology.v1` | `concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.small-embolizing-paa.v2` | `question.vascular-aorta.small-embolizing-paa.v2` | `case.vascular-aorta.small-popliteal-course.v2` | `concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1` | 2 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.associated-aneurysm-survey.v2` | `question.vascular-aorta.associated-aneurysm-survey.v2` | `case.vascular-aorta.small-popliteal-course.v2` | `concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.graft-bleed-imaging.v2` | `question.vascular-aorta.graft-bleed-imaging.v2` | `case.vascular-aorta.graft-diagnostic-review.v2` | `concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.vascular-aorta.marfan-repair-approach.v1` | `question.vascular-aorta.marfan-repair-approach.v1` | `case.vascular-aorta.heritable-native-taaa.v1` | `concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.liver-malignancy.hcc-acquisition.v1` | `question.topic.liver-malignancy.hcc-acquisition.v1` | `case.topic.liver-malignancy.dynamic-hcc.v1` | `concept.topic.liver-malignancy.dynamic-acquisition.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.liver-malignancy.hcc-imaging-diagnosis.v2` | `question.topic.liver-malignancy.hcc-imaging-diagnosis.v2` | `case.topic.liver-malignancy.dynamic-hcc.v1` | `concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.liver-malignancy.hcc-raw-reserve.v2` | `question.topic.liver-malignancy.hcc-raw-reserve.v2` | `case.topic.liver-malignancy.hcc-favorable-resection.v1` | `concept.hcc.compensated-cirrhosis-resection-selection` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.liver-malignancy.hcc-portal-flow.v1` | `question.topic.liver-malignancy.hcc-portal-flow.v1` | `case.topic.liver-malignancy.hcc-portal-flow.v1` | `concept.topic.liver-malignancy.hcc-vascular-pathway.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2` | `question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2` | `case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2` | `concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1` | 0 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2` | `question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2` | `case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2` | `concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1` | 2 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2` | `question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2` | `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2` | `concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1` | 3 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1` | `question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1` | `concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1` | 1 diagnostic tuples, timing installed, APP affinity available |
| `node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1` | `question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1` | `concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1` | 1 diagnostic tuples, timing installed, APP affinity available |

The topic totals are thoracic trauma 7 of 8 requested nodes, vascular aorta 10 of 19, liver malignancy 4 of 4 and pancreas 5 of 12. All 20 accepted cases admit through the current default release in an existing Level4 QA clinic with a real Examination Room placed through ordinary commands.

## Skipped nodes and exact siblings

| Requested node | Retained reviewed case | Unlisted scored siblings |
| --- | --- | --- |
| `node.trauma-thoracic.aortic-repair-sequence.20261111.v1` | `case.trauma-thoracic.aortic-course.20261111.v1`<br>`case.trauma-thoracic.aortic-course.20261111.v1` | `node.trauma-thoracic.aortic-acquisition.20261111.v2`<br>`node.trauma-thoracic.aortic-acquisition.20261111.v1` |
| `node.vascular-aorta.female-threshold.v2` | `case.vascular-aorta.female-aortoiliac-planning.v2` | `node.vascular-aorta.pelvic-inflow.v2` |
| `node.vascular-aorta.graft-source-control.v1` | `case.vascular-aorta.graft-infection-course.v1` | `node.vascular-aorta.graft-bleed-imaging.v1` |
| `node.vascular-aorta.growing-sac-source.v1` | `case.vascular-aorta.changing-evar-sac.v2`<br>`case.vascular-aorta.changing-evar-sac.v1` | `node.vascular-aorta.component-gap-repair.v2`<br>`node.vascular-aorta.component-gap-repair.v1` |
| `node.vascular-aorta.measurement-comparison.v2` | `case.vascular-aorta.measurement-surveillance-symptoms.v2` | `node.vascular-aorta.symptomatic-small-aaa.v2` |
| `node.vascular-aorta.new-malperfusion.v1` | `case.vascular-aorta.descending-perfusion-course.v1` | `node.vascular-aorta.initial-type-b.v1` |
| `node.vascular-aorta.residual-static-branch.v1` | `case.vascular-aorta.descending-perfusion-course.v1` | `node.vascular-aorta.initial-type-b.v1` |
| `node.vascular-aorta.six-cm-referral.v1` | `case.vascular-aorta.screen-to-repair.v1` | `node.vascular-aorta.screening.v1` |
| `node.vascular-aorta.small-male-surveillance.v2` | `case.vascular-aorta.measurement-surveillance-symptoms.v2` | `node.vascular-aorta.symptomatic-small-aaa.v2` |
| `node.vascular-aorta.stable-branch-flow.v1` | `case.vascular-aorta.changing-evar-sac.v2`<br>`case.vascular-aorta.changing-evar-sac.v1` | `node.vascular-aorta.component-gap-repair.v2`<br>`node.vascular-aorta.component-gap-repair.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.chronic-failed-stenting.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.chronic-pancreatitis.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.pert-administration.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.functional-net-enucleation.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.functional-net.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.functional-net-anatomic-study.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-plan.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.duct-cyst.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.cyst-duct-study.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.mcn-large-symptomatic.v2` | `case.topic.pancreas-chronic-cysts-neoplasia.two-cysts.v2` | `node.topic.pancreas-chronic-cysts-neoplasia.prior-cyst-target.v2` |
| `node.topic.pancreas-chronic-cysts-neoplasia.net-growth-duct-proximity.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.nonfunctional-net.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.small-nonfunctional-net.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.postop-transient-drain-bleed.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-record.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v1` |
| `node.topic.pancreas-chronic-cysts-neoplasia.postop-vomiting-inflammation.v1` | `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-record.v1` | `node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v1` |

The skipped vascular and pancreatic PASS versions retain their full original presentations and earlier feedback. Several occur only in retained earlier contexts. A revised neighbor’s similar objective or later PASS does not place that new version into an earlier reviewed case. Each candidate above stays available to its topic worker for salvage under a later decision.

## Whole-case replacement and consolidation

Six ordinary replacement relations and one explicit topic-program consolidation retire 13 fresh cases containing 17 original scored nodes. The BCI consolidation names all seven retired cases and one exact accepted two-node target in `topicConsolidations`. The manifest stores its program, stable group ID and manager decision. Each scored target node has its own exact acceptance row.

The resolver validates the complete group before adding any replacement. Missing references, repeated aliases, unaccepted nodes, wrong headers, missing views, missing decision metadata, duplicate group IDs and conflicts preserve every affected legacy case. The projector admits each validated replacement case once. Ordinary duplicate replacement rows still fail validation. Twelve new projection tests cover the accepted group and ten malformed/conflicting configurations.

This mechanism supports the later appendix four-to-one integration. Its exact acceptance belongs to that later manager decision. The current authority rows contain the four requested topics.

| Retired fresh case | Original variants and meanings |
| --- | --- |
| `case.hcc.resection.candidate-profile` | `question.hcc.resection.candidate-profile.v1`<br>`concept.hcc.compensated-cirrhosis-resection-selection` |
| `case.pancreatic-cyst.surveillance-question` | `question.pancreatic-cyst.mrcp-duct-assessment.v3`<br>`concept.pancreatic-cyst.mrcp-duct-assessment`<br>`question.pancreatic-cyst.mcn-pattern-recognition.v3`<br>`concept.pancreatic-cyst.mcn-pattern-recognition` |
| `case.pancreatic-cyst.tail-lesion-review` | `question.pancreatic-cyst.mrcp-duct-assessment.v4`<br>`concept.pancreatic-cyst.mrcp-duct-assessment`<br>`question.pancreatic-cyst.mcn-pattern-recognition.v4`<br>`concept.pancreatic-cyst.mcn-pattern-recognition` |
| `case.aaa.retired-carpenter` | `question.aaa.one-time-ultrasound-screening.v1`<br>`concept.aaa.one-time-ultrasound-screening`<br>`question.aaa.six-cm-elective-repair-referral.v1`<br>`concept.aaa.six-cm-elective-repair-referral` |
| `case.aaa.current-smoker` | `question.aaa.one-time-ultrasound-screening.v4`<br>`concept.aaa.one-time-ultrasound-screening`<br>`question.aaa.six-cm-elective-repair-referral.v4`<br>`concept.aaa.six-cm-elective-repair-referral` |
| `case.gs028d.blunt-cardiac-injury.a-steering-wheel-impact` | `question.blunt-cardiac-injury.ecg-troponin-evaluation.v1`<br>`concept.blunt-cardiac-injury.ecg-troponin-evaluation` |
| `case.gs028d.blunt-cardiac-injury.a-sports-chest-impact` | `question.blunt-cardiac-injury.ecg-troponin-evaluation.v2`<br>`concept.blunt-cardiac-injury.ecg-troponin-evaluation` |
| `case.gs028d.blunt-cardiac-injury.a-fall-anterior-chest` | `question.blunt-cardiac-injury.ecg-troponin-evaluation.v3`<br>`concept.blunt-cardiac-injury.ecg-troponin-evaluation` |
| `case.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact` | `question.blunt-cardiac-injury.ecg-troponin-evaluation.v4`<br>`concept.blunt-cardiac-injury.ecg-troponin-evaluation` |
| `case.gs028d.blunt-cardiac-injury.b-new-ecg-change` | `question.blunt-cardiac-injury.monitored-disposition.v1`<br>`concept.blunt-cardiac-injury.monitored-disposition` |
| `case.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation` | `question.blunt-cardiac-injury.monitored-disposition.v2`<br>`concept.blunt-cardiac-injury.monitored-disposition` |
| `case.gs028d.blunt-cardiac-injury.b-both-results-abnormal` | `question.blunt-cardiac-injury.monitored-disposition.v3`<br>`concept.blunt-cardiac-injury.monitored-disposition` |
| `case.gs028d.blunt-cardiac-injury.b-both-results-normal` | `question.blunt-cardiac-injury.monitored-disposition.v4`<br>`concept.blunt-cardiac-injury.monitored-disposition` |

All 631 earlier registered meanings and their definitions are retained. The source declares 23 new meaning identities. The ECG/troponin-screening meaning `concept.blunt-cardiac-injury.ecg-troponin-evaluation` has its last fresh variants replaced by the new interpretation/assessment objectives. Its stored history and all original frozen questions remain available. The three shared existing meanings keep their current registry definitions and FSRS histories.

## Projection adaptations and provenance

Every scored stem, update, exhibit, option, explanation, question ID and meaning ID matches the captured independently reviewed version. The runtime learning summary uses the projector’s existing joined-explanation rule.

One facility-stage adaptation was necessary. `case.vascular-aorta.screening-review.v2` changes from entry stage 0 to stage 1 because its stable existing AAA-screening meaning is already registered at stage 1. The original case-local preview used a stage-0 concept proposal. The final probe uses the full current registry and confirms admission at the inherited floor. Clinical wording and educational-tier metadata retain their source values.

The archive retains 72 existing independently authored atomic claims and 24 source records with their bibliographic, access, licence/reuse and authority metadata. Each accepted question’s claim mappings are preserved. Current source-view and question hashes are in the packet. Clinical sign-off remains Melissa Rowland. No new medical claim was authored in this integration.

| Source view | Cases / nodes | SHA-256 |
| --- | --- | --- |
| `topic-batch2-trauma-thoracic` | 5 / 7 | `e7fb33d0a4b18f1345d066458e8bd015406e63e59b6093156826ff0e12b98656` |
| `topic-batch2-vascular-aorta` | 8 / 10 | `52a54b76c64cdcd6f37c7ab3440f257dbf63f3c48b8b6d7cfae7a1546053527f` |
| `topic-batch2-liver-malignancy` | 3 / 4 | `30ebda2c31f62ed99b1ab4f7212b6e56d8c5b4320f309de6d2d33ed16fb30b9d` |
| `topic-batch2-pancreas-chronic-cysts-neoplasia` | 4 / 5 | `27f7dec7ed910ddfd637ecbc4dd94594525cef7c1d140fc6037e0bc4ebcbe456` |

## Default counts and hashes

| Measure | Before | After |
| --- | --- | --- |
| cases | 1167 | 1174 |
| nodes | 1482 | 1491 |
| registeredMeanings | 631 | 654 |
| scoredMeanings | 475 | 497 |
| acceptedRows | 167 | 193 |
| timingRows | 2317 | 2343 |

The default gains 7 cases and 9 scored nodes. It registers 654 meanings, of which 497 currently have fresh scored coverage. The manifest is `question-ship.2026-11-11.v11` with 193 accepted rows, 12 ordinary replacement relations, one seven-case consolidation and 1423 archived legacy bindings.

- Manifest SHA-256 `8eee58d13a936d3771573f705edc66e20852f8fa3a20f1f11dcd4219e052352c`
- Default SHA-256 `751b750e5cd139229a933570244fc5c613f4d60f7fa626bf5e7eb4fc5fa4feab`
- Prior default SHA-256 `7cc62b6e5d9c79133a163bfee8bf810d01a430aa28760d1265b02807b799dee8`
- Catalog SHA-256 `3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40`

The strict acceptance inverse verifies all 20 exact additions, 13 retirements, 23 new registry identities, authority rows, timing entries and owned source postimages before reconstructing the previous 1167-case epoch. Negative tests reject unrelated content, timing and authority drift. The earlier batch1 and HCC package tests use that verified historical epoch.

## Runtime bindings for the domain owner

Every accepted case uses the existing clinic setting and matches `clinicCaseMatchesLine(case, "income.app_consult")`. Each has a null procedure-consult kind. The per-item packet records its capability requirements, entry stage and admission receipt. These cases require no extra topic-affinity entry for APP, OR, endoscopy or wound/ostomy selection.

All 26 timing classifications are installed, bringing the timing archive to 2343 rows. The domain owner still needs **33 exact diagnostic-choice records** from `QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS` in `packages/game-domain/src/test-choice-orders.ts` / `EXACT_TEST_CHOICE_ORDER_RECORDS`. Each carries `{kind:"not_executed", reason:"future_planned"}`. Existing profiles supply the runtime previews for these record-review and planned-investigation choices. The earlier batch1 contributes a separate 15 pending records.

| Case, node and variant | Choice ID and exact label | Timing profile |
| --- | --- | --- |
| `case.trauma-thoracic.cardiac-course.20261111.v1`<br>`node.trauma-thoracic.bci-selective-imaging.20261111.v2`<br>`question.trauma-thoracic.bci-selective-imaging.20261111.v2` | `choice.trauma-thoracic.bci-selective-imaging.v2.tte`<br>Add transthoracic echocardiography to reassessment | `timing.test.advanced_diagnostic` |
| `case.trauma-thoracic.cardiac-course.20261111.v1`<br>`node.trauma-thoracic.bci-selective-imaging.20261111.v2`<br>`question.trauma-thoracic.bci-selective-imaging.20261111.v2` | `choice.trauma-thoracic.bci-selective-imaging.v2.ct`<br>Add cardiac CT to reassessment | `timing.test.ct` |
| `case.trauma-thoracic.cardiac-course.20261111.v1`<br>`node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2`<br>`question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2` | `choice.trauma-thoracic.bci-persistent-arrhythmia.v2.tee`<br>Transesophageal echocardiography | `timing.test.advanced_diagnostic` |
| `case.trauma-thoracic.cardiac-course.20261111.v1`<br>`node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2`<br>`question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2` | `choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct`<br>Cardiac CT | `timing.test.ct` |
| `case.trauma-thoracic.cardiac-course.20261111.v1`<br>`node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2`<br>`question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2` | `choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri`<br>Cardiac magnetic resonance imaging | `timing.test.mri` |
| `case.trauma-thoracic.drain-complication.20261111.v1`<br>`node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1`<br>`question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1` | `choice.trauma-thoracic.chest-drain-organ-trajectory.retain`<br>Retain the tube; obtain contrast CT mapping | `timing.test.ct` |
| `case.trauma-thoracic.drain-complication.20261111.v1`<br>`node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1`<br>`question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1` | `choice.trauma-thoracic.chest-drain-organ-trajectory.remove`<br>Remove the tube; obtain ultrasound reassessment | `timing.test.ultrasound` |
| `case.trauma-thoracic.drain-complication.20261111.v1`<br>`node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1`<br>`question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1` | `choice.trauma-thoracic.chest-drain-organ-trajectory.retract`<br>Retract the tube; obtain repeat chest radiographs | `timing.test.radiography` |
| `case.vascular-aorta.screening-review.v2`<br>`node.vascular-aorta.screening.v2`<br>`question.vascular-aorta.screening.v2` | `choice.vascular-aorta.screening.ultrasound.v2`<br>Obtain abdominal aortic ultrasound | `timing.test.ultrasound` |
| `case.vascular-aorta.screening-review.v2`<br>`node.vascular-aorta.screening.v2`<br>`question.vascular-aorta.screening.v2` | `choice.vascular-aorta.screening.cta.v2`<br>Obtain abdominal aortic CT angiography | `timing.test.ct` |
| `case.vascular-aorta.proximal-attachment-leak.v1`<br>`node.vascular-aorta.proximal-seal-repair.v1`<br>`question.vascular-aorta.proximal-seal-repair.v1` | `choice.vascular-aorta.proximal-seal-repair.surveillance.v1`<br>Continue aortic duplex imaging surveillance | `timing.test.ultrasound` |
| `case.vascular-aorta.retrograde-ascending-extension.v1`<br>`node.vascular-aorta.ascending-emergency.v1`<br>`question.vascular-aorta.ascending-emergency.v1` | `choice.vascular-aorta.ascending-emergency.medical.v1`<br>Intravenous esmolol with CT angiographic follow-up | `timing.test.ct` |
| `case.vascular-aorta.small-popliteal-course.v2`<br>`node.vascular-aorta.small-embolizing-paa.v2`<br>`question.vascular-aorta.small-embolizing-paa.v2` | `choice.vascular-aorta.small-embolizing-paa.anticoagulate.v2`<br>Start anticoagulation with popliteal duplex follow-up | `timing.test.ultrasound` |
| `case.vascular-aorta.small-popliteal-course.v2`<br>`node.vascular-aorta.small-embolizing-paa.v2`<br>`question.vascular-aorta.small-embolizing-paa.v2` | `choice.vascular-aorta.small-embolizing-paa.surveillance.v2`<br>Continue annual popliteal duplex surveillance | `timing.test.ultrasound` |
| `case.vascular-aorta.small-popliteal-course.v2`<br>`node.vascular-aorta.associated-aneurysm-survey.v2`<br>`question.vascular-aorta.associated-aneurysm-survey.v2` | `choice.vascular-aorta.associated-aneurysm-survey.left_arterial.v2`<br>Left popliteal arterial duplex ultrasound | `timing.test.ultrasound` |
| `case.vascular-aorta.small-popliteal-course.v2`<br>`node.vascular-aorta.associated-aneurysm-survey.v2`<br>`question.vascular-aorta.associated-aneurysm-survey.v2` | `choice.vascular-aorta.associated-aneurysm-survey.aortic.v2`<br>Abdominal aortic duplex ultrasound | `timing.test.ultrasound` |
| `case.vascular-aorta.small-popliteal-course.v2`<br>`node.vascular-aorta.associated-aneurysm-survey.v2`<br>`question.vascular-aorta.associated-aneurysm-survey.v2` | `choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2`<br>Thoracic aortic CT angiography | `timing.test.ct` |
| `case.vascular-aorta.graft-diagnostic-review.v2`<br>`node.vascular-aorta.graft-bleed-imaging.v2`<br>`question.vascular-aorta.graft-bleed-imaging.v2` | `choice.vascular-aorta.graft-bleed-imaging.cta.v2`<br>Multiphase abdominal CT angiography | `timing.test.ct` |
| `case.vascular-aorta.graft-diagnostic-review.v2`<br>`node.vascular-aorta.graft-bleed-imaging.v2`<br>`question.vascular-aorta.graft-bleed-imaging.v2` | `choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2`<br>Push enteroscopy into the distal duodenum | `timing.test.upper_endoscopy` |
| `case.vascular-aorta.graft-diagnostic-review.v2`<br>`node.vascular-aorta.graft-bleed-imaging.v2`<br>`question.vascular-aorta.graft-bleed-imaging.v2` | `choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2`<br>Tagged-red-cell gastrointestinal bleeding scintigraphy | `timing.test.nuclear_imaging` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-acquisition.v1`<br>`question.topic.liver-malignancy.hcc-acquisition.v1` | `dedicated_mri`<br>Multiphasic contrast-enhanced liver MRI | `timing.test.mri` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-acquisition.v1`<br>`question.topic.liver-malignancy.hcc-acquisition.v1` | `core_biopsy`<br>Image-guided core biopsy of the lesion | `timing.test.biopsy` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-acquisition.v1`<br>`question.topic.liver-malignancy.hcc-acquisition.v1` | `ultrasound`<br>Interval conventional liver ultrasound | `timing.test.ultrasound` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-imaging-diagnosis.v2`<br>`question.topic.liver-malignancy.hcc-imaging-diagnosis.v2` | `sample_six`<br>Biopsy segment VI; classify segment II by imaging | `timing.test.biopsy` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-imaging-diagnosis.v2`<br>`question.topic.liver-malignancy.hcc-imaging-diagnosis.v2` | `sample_two`<br>Biopsy segment II; classify segment VI by imaging | `timing.test.biopsy` |
| `case.topic.liver-malignancy.dynamic-hcc.v1`<br>`node.topic.liver-malignancy.hcc-imaging-diagnosis.v2`<br>`question.topic.liver-malignancy.hcc-imaging-diagnosis.v2` | `sample_both`<br>Biopsy both lesions; defer classification of each | `timing.test.biopsy` |
| `case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2`<br>`node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2`<br>`question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2` | `choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.metal.v2`<br>ERCP metal stenting before chemotherapy | `timing.test.therapeutic_ercp` |
| `case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2`<br>`node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2`<br>`question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2` | `choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2`<br>ERCP plastic stenting before chemotherapy | `timing.test.therapeutic_ercp` |
| `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2`<br>`node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2`<br>`question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2` | `choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.catheter.v2`<br>Antibiotics plus image-guided catheter drainage | `timing.test.clinical_procedure` |
| `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2`<br>`node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2`<br>`question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2` | `choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2`<br>Antibiotics plus interval imaging reassessment | `timing.test.ct` |
| `case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2`<br>`node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2`<br>`question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2` | `choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2`<br>Antibiotics plus operative washout and drainage | `timing.test.clinical_procedure` |
| `case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1`<br>`node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1`<br>`question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1` | `choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1`<br>Continue pancreatic MRI surveillance | `timing.test.mrcp` |
| `case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1`<br>`node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1`<br>`question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1` | `choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1`<br>MRI-based surveillance of the pancreatic remnant | `timing.test.mrcp` |

## Validation and compatibility

| Run | Files passed / failed | Tests passed / failed / skipped | Duration |
| --- | --- | --- | --- |
| clinical-focused-final | 8 / 0 | 77 / 0 / 0 | 14.77s (transform 6.16s, setup 0ms, import 25.26s, tests 2.88s, environment 1ms) |
| clinical-final | 148 / 9 | 2139 / 18 / 0 | 145.88s (transform 12.45s, setup 0ms, import 248.00s, tests 27.59s, environment 10ms) |
| domain-retired-focused | 3 / 0 | 95 / 0 / 0 | 12.03s (transform 5.75s, setup 0ms, import 10.85s, tests 11.58s, environment 0ms) |
| domain-final | 213 / 3 | 5355 / 28 / 1 | 551.04s (transform 13.90s, setup 0ms, import 403.97s, tests 676.57s, environment 14ms) |
| player-final | 7 / 1 | 167 / 1 / 0 | 64.18s (transform 12.08s, setup 0ms, import 31.12s, tests 92.62s, environment 1ms) |
| Root typechecks | 7 workspaces | 7 pass / 0 fail | see log |
| Cue linter tests | 1 tool | 33 / 0 / 0 | 1640.9376 ms |

Commands run from clinical-content and game-domain use `npm.cmd test -- --pool=threads --maxWorkers=2`. Root `npm.cmd run typecheck` covers seven workspace scripts. Focused player includes the new batch2 suite, batch1, N4, harden1/N3R4, flags4, questionShipSaveCompatibility, separateCampaign and flagFreeze. Its preload supplies Vite’s optional Windows drive probe. Exact commands, durations, report hashes and every failure message are preserved in the validation receipt. [Validation](question-topic-acceptance-batch2-validation-20261111.json)

All 46 new player cases pass. They cover admission and exact format-3 completion of all 20 current cases, plus snapshot and committed-journal replay for each of the 13 retired cases. Every original choice order, question version and FSRS identity survives. Previously reviewed cards retain their history, new cards start without reviews and repeated answer commands score once. Legacy MRCP and ultrasound result gates complete through the original contracts and existing wait bounds.

Five initial domain failures came from historical tests selecting retired cases through fresh supply. `board-expansion-batch.test.ts` and `brief-early-levels-20260917-batch.test.ts` now use the verified pre-batch source through the existing author-stage fixture. Their reducer, gate, wait and FSRS assertions remain intact. `diagnostic-result-dispositions.test.ts` resolves annotations against active cases or explicitly retained retired cases and verifies the retirement’s manifest relation. That focused run passes 95 tests. Their changes are test fixtures only.

The full clinical result includes source-guard and concurrent topic-test failures. The source workers own those files. The domain’s remaining evidence hashes, concept-list fixture and deferred-order inventory are listed below. Earlier colon/appendix compilation errors occurred during active edits, and the final seven-workspace typecheck succeeds. The separateCampaign codec-limit failure also remains in the player result.

- `clinical-final` `packages/clinical-content/src/question-flags3-20261107.test.ts` — flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact. AssertionError: packages/game-domain/src/app-appointments.ts: expected '72e1168893dfdcb4f2dc0c0a9a598340f1f59…' to be '9053ef12e1024cdb87865de85d190bb9dc649…' // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts` — exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures. AssertionError: packages/game-domain/src/test-choice-orders.ts exact authorized acceptance postimage: expected 'e7b33358a0f5b189c1f94e6777b80014cd73d…' to be '573f4c6156d7c1819db74ad87e9a6413482a8…' // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-stats1-20261108.test.ts` — stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration. AssertionError: packages/game-domain/src/app-appointments.ts: expected '72e1168893dfdcb4f2dc0c0a9a598340f1f59…' to be '9053ef12e1024cdb87865de85d190bb9dc649…' // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts` — stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions. AssertionError: apps/player/src/session/cloud/codecJson.ts: expected '0994becd5f0022d2489de303987a6bb6a4c59…' to be 'd490196e1988db2f39fc66df0589b768fd109…' // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar validates the normal explicit-import authoring release. AssertionError: expected [ { …(18) }, { …(18) }, …(11) ] to have a length of 15 but got 13
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar assigns exactly one verdict and a supported replacement to every before row. AssertionError: expected false to be true // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar preserves stable meanings and explicitly versions changed constructs. AssertionError: expected [ { …(14) }, { …(14) } ] to have a length of 3 but got 2
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar binds every packet after-version and manual gate to exact authored data. TypeError: Cannot read properties of undefined (reading 'decisionNodes')
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar resolves every atomic claim, source and question mapping bidirectionally. AssertionError: expected [ { …(22) }, { …(22) }, …(8) ] to have a length of 8 but got 10
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar provides identity-and-label timing for every proposed testing choice. AssertionError: expected [ { …(4) }, { …(4) }, { …(4) }, …(17) ] to have a length of 25 but got 20
- `clinical-final` `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` — colon diverticular disease and lower bleeding topic sidecar records paired eligibility and preserves qualitative review roles. AssertionError: expected [ { …(18) }, { …(18) }, …(4) ] to have a length of 10 but got 6
- `clinical-final` `packages/clinical-content/src/question-topic-liver-malignancy-20261111.test.ts` — liver malignancy explicit-import topic sidecar preserves source hashes and every live approved/PASS visible context. TypeError: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
- `clinical-final` `packages/clinical-content/src/question-topic-liver-malignancy-20261111.test.ts` — liver malignancy explicit-import topic sidecar keeps all new definitions outside the default release and all review roles separate. AssertionError: expected false to be true // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.test.ts` — pancreas chronic/cysts/neoplasia explicit-import authoring packet detects drift of exact preserved source inputs without accepting new hashes automatically. AssertionError: expected 'b470422f55280d0a7b0fe318f0254b83be686…' to be 'cc05d21e43357d1f80f6500a3c53868acf06a…' // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-topic-trauma-thoracic-20261111.test.ts` — trauma-thoracic explicit-import topic sidecar preserves the eight live before versions and all four exact historical approvals. TypeError: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
- `clinical-final` `packages/clinical-content/src/question-topic-trauma-thoracic-20261111.test.ts` — trauma-thoracic explicit-import topic sidecar keeps proposed identities unique and fresh supply out of the default release. AssertionError: expected false to be true // Object.is equality
- `clinical-final` `packages/clinical-content/src/question-topic-vascular-aorta-20261111.test.ts` — vascular-aorta explicit-import authoring sidecar preserves the exact old live cases and historical clinician-approved source versions. TypeError: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
- `clinical-final` `packages/clinical-content/src/question-topic-vascular-aorta-20261111.test.ts` — vascular-aorta explicit-import authoring sidecar keeps disputed thresholds unkeyed and never silently installs the sidecar. AssertionError: expected true to be false // Object.is equality
- `domain-final` `packages/game-domain/tests/approved-clinical-admission.test.ts` — approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts. AssertionError: expected [ …(654) ] to deeply equal [ …(587) ]
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash. AssertionError: packages/balance-config/src/employee-training.ts: expected '2d2886b1b2f3615a2513b98f892c339394489…' to be '9daacd4783b15e7fa5ee85c1348a313e6454b…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5. AssertionError: expected 'bd7912848953bc80724011c179059515b2db7…' to be '92728e650dc9a0f02b005470db49ab566769a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6. AssertionError: expected 'bd7912848953bc80724011c179059515b2db7…' to be '92728e650dc9a0f02b005470db49ab566769a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7. AssertionError: expected 'bd7912848953bc80724011c179059515b2db7…' to be '92728e650dc9a0f02b005470db49ab566769a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8. AssertionError: expected 'bd7912848953bc80724011c179059515b2db7…' to be '92728e650dc9a0f02b005470db49ab566769a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9. AssertionError: expected 'bd7912848953bc80724011c179059515b2db7…' to be '92728e650dc9a0f02b005470db49ab566769a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5. AssertionError: expected '47143328859913043b39df2e5462575ef7740…' to be '5b2c0785dfcbc2ddad65e3f56683dae5e7f9a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6. AssertionError: expected '47143328859913043b39df2e5462575ef7740…' to be '5b2c0785dfcbc2ddad65e3f56683dae5e7f9a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7. AssertionError: expected '47143328859913043b39df2e5462575ef7740…' to be '5b2c0785dfcbc2ddad65e3f56683dae5e7f9a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8. AssertionError: expected '47143328859913043b39df2e5462575ef7740…' to be '5b2c0785dfcbc2ddad65e3f56683dae5e7f9a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9. AssertionError: expected '47143328859913043b39df2e5462575ef7740…' to be '5b2c0785dfcbc2ddad65e3f56683dae5e7f9a…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5. AssertionError: expected '86bc06e534f562075af78d00e6f47c1029b0c…' to be 'a157ed60cc08d3cddd0428b11ac11f87121e4…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6. AssertionError: expected '86bc06e534f562075af78d00e6f47c1029b0c…' to be 'a157ed60cc08d3cddd0428b11ac11f87121e4…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7. AssertionError: expected '86bc06e534f562075af78d00e6f47c1029b0c…' to be 'a157ed60cc08d3cddd0428b11ac11f87121e4…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8. AssertionError: expected '86bc06e534f562075af78d00e6f47c1029b0c…' to be 'a157ed60cc08d3cddd0428b11ac11f87121e4…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9. AssertionError: expected '86bc06e534f562075af78d00e6f47c1029b0c…' to be 'a157ed60cc08d3cddd0428b11ac11f87121e4…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5. AssertionError: expected 'c6d9c55f70bbbe34a7fad75c13f725ed2106f…' to be '259feb3aba6e3d09bb369cc458620cd3d78f2…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6. AssertionError: expected 'c6d9c55f70bbbe34a7fad75c13f725ed2106f…' to be '259feb3aba6e3d09bb369cc458620cd3d78f2…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7. AssertionError: expected 'c6d9c55f70bbbe34a7fad75c13f725ed2106f…' to be '259feb3aba6e3d09bb369cc458620cd3d78f2…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8. AssertionError: expected 'c6d9c55f70bbbe34a7fad75c13f725ed2106f…' to be '259feb3aba6e3d09bb369cc458620cd3d78f2…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9. AssertionError: expected 'c6d9c55f70bbbe34a7fad75c13f725ed2106f…' to be '259feb3aba6e3d09bb369cc458620cd3d78f2…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5. AssertionError: expected '1e3545c6ab2a0ea00ef24b250c86030c23fa9…' to be '3d3603171902d39a439090f0026ae33ac7654…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6. AssertionError: expected '1e3545c6ab2a0ea00ef24b250c86030c23fa9…' to be '3d3603171902d39a439090f0026ae33ac7654…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7. AssertionError: expected '1e3545c6ab2a0ea00ef24b250c86030c23fa9…' to be '3d3603171902d39a439090f0026ae33ac7654…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8. AssertionError: expected '1e3545c6ab2a0ea00ef24b250c86030c23fa9…' to be '3d3603171902d39a439090f0026ae33ac7654…' // Object.is equality
- `domain-final` `packages/game-domain/tests/level-five-integration.test.ts` — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9. AssertionError: expected '1e3545c6ab2a0ea00ef24b250c86030c23fa9…' to be '3d3603171902d39a439090f0026ae33ac7654…' // Object.is equality
- `domain-final` `packages/game-domain/tests/test-choice-order-inventory.test.ts` — active-release test-choice order inventory classifies every timing.test choice and permits incorrect records only as explicit non-execution. AssertionError: correct timing.test case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1|node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1|question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1|choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1 is uncategorized; add an exact record or a result gate: expected false to be true // Object.is equality
- `player-final` `apps/player/src/session/cloud/separateCampaign.test.ts` — explicit separate account campaign for a divergent local branch retains real retired encounters which no longer exist in the playable state. CloudCodecError: JSON string exceeds the codec limit.

## Advisory cue lint

Accepted subset 42 raw findings across 19 of 26 variants. Whole bank 1947 findings across 917 of 1486 distinct variants. The receipt preserves exact fields and phrases. [Lint report](question-topic-acceptance-batch2-lint-20261111.json)

Six accepted keys are uniquely longest by raw character count. Each residual is explicitly pinned to its measured lengths, accepted decision and whole-case hash in the existing length test. The independent PASS wording is preserved. The 33 linter tests pass.

## Changed Level5 bound inputs

| Changed Level5 bound input | Intake SHA-256 | After SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/synthetic-content.ts` | `1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221` | `9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b` |
| `packages/clinical-content/src/index.ts` | `0fad854518fa1babd8fd7c6e91627df094a21ad9edf338397f7432b0d3f3e878` | `aa69ce2b91e00459f137b467567878d2986c0eaa00055488c43b3a9aadd3c68e` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `4f5e6bae6b16fbd693153add3ddbbb48c2e997ed16159522f177d917167077c2` | `99be435f815472aa35dec0c1150cf0419e8f51a39da1f9a07f0e06e04b1ceee2` |

Each of these three files already differed from the evidence’s recorded hash at intake. The packet retains those recorded values separately. The manifest, resolver, projector and new accepted modules are additional runtime inputs absent from that older bound-input map. Their exact raw hashes appear in the file receipt. The manager owns the later rebind.

## Files and handoff

| Existing clinical file | After SHA-256 |
| --- | --- |
| `packages/clinical-content/src/question-ship-manifest.ts` | `b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a` |
| `packages/clinical-content/src/question-ship-case-replacements.ts` | `0e2bfd04492b1444cbb48261221fba1febd6ade4e01c764ceee7515cbed31b6e` |
| `packages/clinical-content/src/question-ship-projection.ts` | `29351156d08b1d94feb70d1d513357a8eb26c029e1f8f94c31c8a5ca6bb79689` |
| `packages/clinical-content/src/synthetic-content.ts` | `9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b` |
| `packages/clinical-content/src/index.ts` | `aa69ce2b91e00459f137b467567878d2986c0eaa00055488c43b3a9aadd3c68e` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `99be435f815472aa35dec0c1150cf0419e8f51a39da1f9a07f0e06e04b1ceee2` |
| `packages/clinical-content/src/answer-choice-timing.test.ts` | `9bd3677e9ae43927c537b9af6904934740e07bbe520f27708af204c13f2a49d8` |
| `packages/clinical-content/src/question-ship-manifest.test.ts` | `aa5539b73141b993400bc60a77f93ebd1b7b352b2ed4869defa7cb5dd8a51ba9` |
| `packages/clinical-content/src/pilot-content.test.ts` | `19374661d49e01984ab234f725cc56697ebc653410b1d215c86976cbc59c5c23` |
| `packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts` | `a6a642fbdbce085b2636403fa03905d7f77c679384caf792009d0c69d4302ef3` |
| `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts` | `01b03a00e33fa635bad87150f70afa9bf7907ffd52d0a22f6cc8f5141f182d8f` |
| `packages/clinical-content/src/approved-data/hcc-resection-selection.test.ts` | `f0d222c8067dc24ba114c889a54e94ed4486d3e34e15d5852561efb176b5df21` |

| Historical domain test | After SHA-256 |
| --- | --- |
| `packages/game-domain/tests/board-expansion-batch.test.ts` | `a3f70770c9e620f9758e5b50d4797a1fa6f8c444b8b4e0d8412e0f8601bdbc7a` |
| `packages/game-domain/tests/brief-early-levels-20260917-batch.test.ts` | `12d9550fd53c88faf1ac6b1eaa3e2d2cea25d063b4bff19507da488e1ed1ece0` |
| `packages/game-domain/tests/diagnostic-result-dispositions.test.ts` | `f5754cb3d206a9b21bbc1eb23e387679e50d45fd52b529e2ab0c32a7ced5b6dc` |

New archive/wrapper, strict historical support, clinical and consolidation tests, player compatibility tests, intake/build/probe receipts and the active plan are listed with raw hashes in the file receipt. The accepted topic sources, packets and reviews retain their captured hashes. Concurrent worker changes are recorded separately. [Files](question-topic-acceptance-batch2-files-20261111.json)

The manager can now hand the 33 exact tuples to the domain owner and return the 17 skipped contexts to the topic workers. Consolidation support is ready for the later appendix acceptance. The bounded acceptance work ends with this handoff.

This checkpoint is local to the working tree. A later explicit “push to GitHub” request creates the backup through the manager’s workflow.
