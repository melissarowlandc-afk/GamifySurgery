# Critical care — renal injury and organ support

## Assignment and baseline

- Topic slug `critical-renal-organ-support`, wave 1, manager dispatch 2026-11-11.
- Included scope from the taxonomy is “AKI mechanisms and assessment, oliguria, renal replacement selection/complications, abdominal compartment physiology and ICU organ-support coordination.”
- Boundary assignments from the taxonomy are “Standalone electrolyte treatment belongs to fluids-electrolytes-acid-base. Dialysis access belongs to vascular-venous-lymphatic-access. Postoperative bladder retention belongs to adult-urology-gynecology.” General shock resuscitation and ventilation objectives retain their separate topic owners.
- Priority is `high`. The recorded reason is “A general-surgery ICU essentials lane with minimal direct live coverage.”
- Starting counts are 0 live concepts, 0 live nodes, 0 live cases, 0 live variants, 0 registered concepts, 0 retained draft rows, 0 unassembled variants, 0 explicit owner-held versions, 0 unkeyed slots and 0 withheld teaching points.
- Exact assigned inventory records `[]`. Registered concept identities `[]`. Complete assigned concept, case, node and variant rows `[]`.
- Case/header owners `[]`. Relevant secondary-topic assignments and identity-reuse notes `[]`. Recorded holds `[]`, unkeyed slots `[]`, withheld teaching points `[]` and supplied owner approval questions `[]`.
- Exact frozen independent PASS and clinical approval references `[]`. The assignment has no previous versions to rewrite or retire.
- Active manager context is `docs/research/question-topic-program-20261111.md`, its JSON companion, the wave-1 worker brief, and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. The manager maintains shared planning and handoffs.
- Program `question-topic-program.2026-11-11.v1` was captured at `2026-11-11T15:28:05.732Z` and generated at `2026-11-11T15:41:40.423Z`. Default release `clinical.synthetic.prototype.v1` uses manifest `question-ship.2026-11-10.v9` with 145 acceptance rows, 1,151 cases, 1,462 node occurrences and 610 registered identities. There are 454 actively scored identities and 156 registry-only identities.
- Manifest file SHA-256 `cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a`. Authoring standard `question-authoring.2026-11-08.v15` SHA-256 `87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671`.
- Initial live-tree check found all 443 program input hashes unchanged. The five assigned output paths were absent. The shared worktree contains extensive concurrent owner and worker work.

## Batch1 PASS salvage — review only these three cases

Status **`salvage`**. Acceptance batch1 skipped three renal PASS nodes because their original cases contain non-PASS companions. Each is now an independent one-node clinic chart review. This is an additive review view, exported as `CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE`. The reviewer should recheck only `salvageRound.proposedNodes` and its three `caseDefinitions`.

Clinical stems, current exhibits, option labels, keys, rationales and explanations are verbatim. Existing named-patient clinic headers contain the needed setting, age, sex and hospital history, so no clinical observations or teaching facts were added. Earlier scored tasks and feedback are absent. Stable question, node and concept IDs preserve the intended meaning. New case, presentation and profile IDs distinguish these standalone contexts.

The already accepted citrate-bleeding and CRRT-recovery cases remain exact. Their case definitions, items, questions and nodes are hash-checked against the pre-salvage packet and accepted snapshot. Non-PASS companions and the two parked comparisons stay outside this re-review.

| Status | Salvaged case ID | Exact PASS node ID | Previous unaccepted case |
|---|---|---|---|
| `salvage` | `case.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1` | `node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1` | `case.topic.critical-renal-organ-support.oliguria-response.v1` |
| `salvage` | `case.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1` | `node.topic.critical-renal-organ-support.rrt-treatment-response.v1` | `case.topic.critical-renal-organ-support.rrt-escalation.v1` |
| `salvage` | `case.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1` | `node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1` | `case.topic.critical-renal-organ-support.rrt-escalation.v1` |

The authority is the batch1 Skipped nodes table and disposition receipt. Independent PASS source is `question-topic-critical-renal-organ-support-review2-20261111.json`. These references and their exact SHA-256 values are stored in `salvageRound.acceptanceReceipts`. The clinical/presentation review status remains `needs_clinician_review`; the standalone context re-review is pending.

### Salvage packet exports

- `CRITICAL_RENAL_TOPIC_SALVAGE_CASES` contains exactly three normalized clinic cases.
- `CRITICAL_RENAL_TOPIC_SALVAGE_NODES` contains exactly three PASS node identities.
- `CRITICAL_RENAL_TOPIC_SALVAGE_QUESTIONS` and `CRITICAL_RENAL_TOPIC_SALVAGE_CONCEPTS` reuse the existing exact clinical definitions.
- `CRITICAL_RENAL_TOPIC_SALVAGE_TIMING_PROPOSALS` contains three classifications; `CRITICAL_RENAL_TOPIC_SALVAGE_TEST_ORDER_PROPOSALS` contains two exact outside-hospital test choices.
- `CRITICAL_RENAL_TOPIC_SALVAGE_REVIEW_ITEMS` marks all three entries `status: salvage`.

The original six-case authoring export is retained as the pre-salvage view. The standalone salvage source release is the current requested admission target. Its original mixed cases must remain outside fresh supply when these standalone cases are admitted. No shared manifest, registry, runtime, accepted-data module or other topic file was edited.

### case.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1

**Status** `salvage`. Node `node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1`. Question `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1`. Concept `concept.critical-renal-organ-support.congestion-directed-oliguria.v1`.

**Patient** Nadia Ellis, 67 years, Female. Chief complaint — Low urine output.

**Presentation** In clinic, the founder reviews Nadia Ellis's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Nadia Ellis, a 67-year-old woman, is in the surgical ICU after colectomy. A patent urinary catheter drains small volumes." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Current update** None. The current exhibit supplies the recorded observations.

| Recorded observation | Value |
|---|---|
| Course | Urine output has fallen as weight has risen 6 kg from the preoperative value. |
| Circulation | MAP is 76 mmHg without vasopressors. A monitored crystalloid challenge changed neither measured stroke volume nor urine output. |
| Respiratory findings | New bilateral lung B-lines accompany an oxygen increase from room air to 3 L/min. |
| Kidney trend | Creatinine rose from 0.9 to 1.8 mg/dL. Potassium is 4.6 mmol/L and arterial pH is 7.36. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which treatment should Nadia Ellis receive now for her low urine output?

**key shown first for review only**

1. **Key** Give intravenous furosemide

   Exact choice `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.furosemide.v1`. Accumulated fluid, lung findings and challenge nonresponse favor a monitored diuretic attempt.

   Clinical claims `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`.

   Timing profile none.

2. Give an isotonic crystalloid bolus

   Exact choice `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crystalloid.v1`. The observed volume challenge supplied no circulatory or urine benefit while fluid and lung findings accumulated.

   Clinical claims `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.fluid-excess`.

   Timing profile none.

3. Begin continuous venovenous hemodialysis

   Exact choice `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crrt.v1`. A diuretic attempt remains reasonable at this respiratory and metabolic stage before extracorporeal removal.

   Clinical claims `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`.

   Timing profile none.

**Explanation** The record favors fluid accumulation without benefit from further expansion. An IV loop-diuretic trial addresses the volume problem, with reassessment of urine output and breathing. Its purpose here is decongestion.

**Deciding observation** Fluid loading produced no measured circulatory or urine response as pulmonary findings and weight increased.

**Closest competitor** `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crystalloid.v1`. Further expansion can aggravate renal and lung congestion.

**Counterfactual** Replace the gain and lung findings with new high-output drainage and a prompt circulatory response to volume. Choose the bolus.

**Standalone context check** Existing clinic presentation, named patient, demographics, record-time framing and clinical facts are verbatim. New case/presentation/profile identities and removal of scored prior companions only. Added clinical observations `[]`. Prior scored-node dependencies `[]`. No previous question, options, rationale or feedback is rendered.

**Runtime binding** Existing clinic and `capability.examination`, facility Level 4, educational tier 2 and recorded acuity `urgent`. No service request or result gate is enacted.

**Identity** Presentation `presentation.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1`; profile `profile.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1`. Visible-context SHA-256 `9711d1459bb72794e9cb9e31a5f6a8b5cee6707074eb89b189397f199af64ef5`.

**Unchanged clinical evidence** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`. Exact statement mappings remain in the JSON and source ledger.

**Node preservation** Original node canonical SHA-256 `d204d648f8f7b4e6d222b45e876ade5f4f5f9d297cfd91f94ea26f39a9464f40`; standalone node canonical SHA-256 `48fe45157060782117dc131086801c550f0f86965569d2f0aeaa38613dcaadd0`. Only existing final-node no-outcome metadata is carried forward for runtime validity.

### case.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1

**Status** `salvage`. Node `node.topic.critical-renal-organ-support.rrt-treatment-response.v1`. Question `question.topic.critical-renal-organ-support.rrt-treatment-response.v1`. Concept `concept.critical-renal-organ-support.rrt-treatment-response.v1`.

**Patient** Evan Brooks, 59 years, Male. Chief complaint — Kidney support review.

**Presentation** In clinic, the founder reviews Evan Brooks's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Evan Brooks, a 59-year-old man, is in the surgical ICU after source control for a perforated colon. Kidney function worsened during the initial hypotensive period." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Current update** None. The current exhibit supplies the recorded observations.

| Recorded observation | Value |
|---|---|
| Kidney course | During the first day, creatinine rose from 0.8 to 3.2 mg/dL and urine output fell markedly. |
| Response | Potassium fell from 6.3 to 4.8 mmol/L after medical treatment and is unchanged on repeat sampling. Arterial pH improved from 7.23 to 7.34. |
| Current organ support | MAP is 74 mmHg without vasopressors. He breathes room air and follows commands. Fluid balance is close to even. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which plan should guide Evan Brooks’s kidney-replacement decision at this assessment?

**key shown first for review only**

1. **Key** Repeat chemistry and fluid-balance assessment

   Exact choice `choice.topic.critical-renal-organ-support.rrt-treatment-response.surveillance.v1`. Serial assessment can detect recurrence while cause-directed care continues after the observed response.

   Clinical claims `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.kidney-assessment`.

   Timing profile `timing.test.basic_labs`.

2. Begin continuous venovenous hemodialysis

   Exact choice `choice.topic.critical-renal-organ-support.rrt-treatment-response.crrt.v1`. The current response and organ course do not establish an immediate need despite the severe creatinine rise.

   Clinical claims `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`.

   Timing profile none.

3. Perform a furosemide stress test

   Exact choice `choice.topic.critical-renal-organ-support.rrt-treatment-response.stress.v1`. Prognostic response testing does not replace assessment of current complications and their response.

   Clinical claims `claim.critical-renal-organ-support.furosemide-prognosis`, `claim.critical-renal-organ-support.rrt-context`.

   Timing profile `timing.test.physiology`.

**Explanation** Potassium and pH have improved and remain controlled at this assessment. Repeat chemistry and balance assessment addresses recurrence risk while cause-directed kidney care continues. The creatinine rise describes injury severity but does not independently establish an immediate extracorporeal support need.

**Deciding observation** Repeat potassium remains controlled after treatment, pH improved, and current respiratory and fluid needs are stable.

**Closest competitor** `choice.topic.critical-renal-organ-support.rrt-treatment-response.crrt.v1`. Unnecessary replacement exposes the patient to treatment-related hemodynamic and access burdens.

**Counterfactual** Replace the response with recurrent dangerous hyperkalemia despite appropriate medical treatment. Begin replacement.

**Standalone context check** Existing clinic presentation, named patient, demographics, record-time framing and clinical facts are verbatim. New case/presentation/profile identities and removal of scored prior companions only. Added clinical observations `[]`. Prior scored-node dependencies `[]`. No previous question, options, rationale or feedback is rendered.

**Runtime binding** Existing clinic and `capability.examination`, facility Level 4, educational tier 2 and recorded acuity `urgent`. No service request or result gate is enacted.

**Identity** Presentation `presentation.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1`; profile `profile.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1`. Visible-context SHA-256 `eee0db489f400d4364b13194fdfa122b74e15d72c7026d86f9ae7b0566edc61e`.

**Unchanged clinical evidence** `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.furosemide-prognosis`, `claim.critical-renal-organ-support.rrt-pulmonary`. Exact statement mappings remain in the JSON and source ledger.

**Node preservation** Original node canonical SHA-256 `bd2b66725d4efcb791d78297ad4bcad9573e512f22fd7319f0d92c9e89f5aef9`; standalone node canonical SHA-256 `b1a383a8f99f9bd3e5229c482afd0a7204ffe508531ad25f362c30c156682c40`. Only existing final-node no-outcome metadata is carried forward for runtime validity.

### case.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1

**Status** `salvage`. Node `node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`. Question `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`. Concept `concept.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`.

**Patient** Evan Brooks, 59 years, Male. Chief complaint — Kidney support review.

**Presentation** In clinic, the founder reviews Evan Brooks's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Evan Brooks, a 59-year-old man, is in the surgical ICU after source control for a perforated colon. Kidney function worsened during the initial hypotensive period." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Current update** None. The current exhibit supplies the recorded observations.

| Recorded observation | Value |
|---|---|
| Interval course | Urine output remained minimal and cumulative balance increased by 5 L. |
| Respiratory course | Bilateral B-lines and diffuse alveolar opacities accompany escalation to noninvasive ventilation. Saturation is 88% on FiO2 0.60. |
| Diuretic response | Escalated IV furosemide followed by infusion produced negligible additional urine. Respiratory support continues to increase. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which treatment should Evan Brooks receive now for the worsening respiratory course?

**key shown first for review only**

1. **Key** Begin continuous venovenous hemodialysis

   Exact choice `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.crrt.v1`. Progressive major hypoxemia and pulmonary fluid accumulation persist despite the observed IV diuretic treatment.

   Clinical claims `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.rrt-context`.

   Timing profile none.

2. Add intravenous chlorothiazide to furosemide

   Exact choice `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.thiazide.v1`. Sequential nephron blockade is credible, but the worsening major hypoxemia makes another drug attempt insufficient at this stage.

   Clinical claims `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.rrt-pulmonary`.

   Timing profile none.

3. Replace furosemide with intravenous bumetanide

   Exact choice `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.bumetanide.v1`. An agent change is poorly matched to the present urgency after negligible response to escalated IV treatment.

   Clinical claims `claim.critical-renal-organ-support.loop-agent-route`, `claim.critical-renal-organ-support.rrt-pulmonary`.

   Timing profile none.

**Explanation** The actual failed diuretic course now coincides with worsening major hypoxemia and accumulating pulmonary fluid. These findings support urgent kidney replacement with fluid removal. The scored decision is escalation to extracorporeal support.

**Deciding observation** Major hypoxemia worsens despite escalated IV loop treatment with negligible urine response.

**Closest competitor** `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.thiazide.v1`. Another pharmacologic trial can delay effective removal during respiratory deterioration.

**Counterfactual** Change to stable oxygenation and a substantial but incomplete loop response. The adjunct-diuretic option becomes reasonable.

**Standalone context check** Existing clinic presentation, named patient, demographics, record-time framing and clinical facts are verbatim. New case/presentation/profile identities and removal of scored prior companions only. Added clinical observations `[]`. Prior scored-node dependencies `[]`. No previous question, options, rationale or feedback is rendered.

**Runtime binding** Existing clinic and `capability.examination`, facility Level 4, educational tier 2 and recorded acuity `urgent`. No service request or result gate is enacted.

**Identity** Presentation `presentation.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1`; profile `profile.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1`. Visible-context SHA-256 `e4e828dd7f30b8dc2503f878b8f39524fecfe3a475c2ef672e42771eb0fa889d`.

**Unchanged clinical evidence** `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.loop-agent-route`. Exact statement mappings remain in the JSON and source ledger.

**Node preservation** Original node canonical SHA-256 `75ac963a3caf3bab697cca6f3caedbfa6f00f85669d9091282deb4d74038af76`; standalone node canonical SHA-256 `ee30a88621b763734b8221b00ce1c6155b73660dfe86bb5d4adf54519993c2c8`. Only existing final-node no-outcome metadata is carried forward for runtime validity.

### Accepted cases preserved

| Protected accepted case | Question | Case-definition SHA-256 |
|---|---|---|
| `case.topic.critical-renal-organ-support.circuit-anticoagulation.v1` | `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1` | `0662fe5834d87908877993c87beec1c031b3adc814d51d6550f4e66653598b38` |
| `case.topic.critical-renal-organ-support.kidney-recovery.v1` | `question.topic.critical-renal-organ-support.trial-off-crrt.v2` | `04005f859ca0838ec1423c873fead541b91ae1fdcfa5d5127cbffb55410218bb` |

No companion repair or clinical research was required. All twelve source records and thirty-one atomic claims remain unchanged. Only the salvage delivery-view evidence/context mappings and new case/profile/presentation identities are added.

## Retained pre-salvage packet

The following clinical research, histories, prior review dispositions and six-case authoring view are retained for traceability. They are outside the current three-case salvage review scope. The earlier six-PASS disposition refers to the initial review; the latest review2 verdicts and the batch1 receipt govern this salvage selection.

## Owner-directed clinic setting conversion

Owner decision relayed by the manager on 2026-11-11 replaces all ICU/inpatient gameplay settings with **CHART REVIEW IN CLINIC**. The founder reviews outside hospital and ICU records for the named patient at the referring hospital’s request. Current decisions select advice at the recorded hospital time. Hospital facts, treatment choices, keys, feedback, concept meanings and evidence claims are preserved.

The active packet contains **six normalized clinic cases, nine keyed questions and two clinic-framed parked comparisons**. There are **zero active ICU composition proposals**. Each case uses existing `requiredClinicalSetting: clinic`, existing `capability.examination`, `reward.clinic_basic` and facility Level 4. Educational tier remains 2 and the outside-record acuity is unchanged. These are separate fields.

`CRITICAL_RENAL_TOPIC_CASES` and `CRITICAL_RENAL_TOPIC_SOURCE_RELEASE` validate through the current case/release schema. The default release, manifest and shared registries remain unchanged. All new clinical and presentation records remain `needs_clinician_review`.

All nine clinical `QuestionVariant` definitions are unchanged. Runtime node stems add only the clinic/referring-hospital frame, tracked by `patientPresentationRevision`. Six PASS question values remain exact. The full old item, node and visible-context hashes remain audit references. The new clinic context is explicitly versioned and does not silently inherit an exact presentation approval.

The old drainage acquisition history is read-only record content in its current clinic node. Its original task, observations, options, rationales and feedback are retained. The returned acquisition v1 is not scored. Revised acquisition v2 stays in a separate clinic case. Earlier nonfinal nodes omit terminal metadata to meet the existing case schema. Their clinical content is unchanged.

No new clinical source or claim was needed. All twelve source records and thirty-one atomic claims remain exact. `settingConversion.beforeItems`, `beforeParkedItems`, `beforeCaseCompositionProposals` and `beforeFrozenContexts` retain the pre-conversion audit state. Any ICU setting in those historical snapshots describes the former authoring version.

## Independent-review disposition

The independent review file remains `docs/research/question-topic-critical-renal-organ-support-review-20261111.json`, SHA-256 `8140780cbc17d9382c53c5020c126e36487739a10b2a2536d0e071dfdbb89e80`. The clinical revision counts remain **6 pass-preserved / 3 revised / 2 parked**. The owner-authorized setting conversion applies to all eleven without another clinical rewrite.

| Reviewed variant | Disposition | Current variant | Clinic delivery |
|---|---|---|---|
| `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.diuretic-confounded-indices.v1` | `revised` | `question.topic.critical-renal-organ-support.diuretic-confounded-indices.v2` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.rrt-treatment-response.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.rrt-treatment-response.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.uf-clearance-separation.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.uf-clearance-separation.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.pressure-acquisition.v1` | `revised` | `question.topic.critical-renal-organ-support.pressure-acquisition.v2` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.pressure-refractory-decompression.v1` | `parked` | `question.topic.critical-renal-organ-support.pressure-refractory-decompression.v2` (unkeyed) | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1` | `pass-preserved` | `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1` | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.citrate-metabolic-course.v1` | `parked` | `question.topic.critical-renal-organ-support.citrate-metabolic-course.v2` (unkeyed) | founder reviews outside hospital records in clinic |
| `question.topic.critical-renal-organ-support.trial-off-crrt.v1` | `revised` | `question.topic.critical-renal-organ-support.trial-off-crrt.v2` | founder reviews outside hospital records in clinic |

### Original PASS hashes and current clinical preservation

| Clinical question | Original whole-item SHA-256 | Exact current QuestionVariant SHA-256 |
|---|---|---|
| `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1` | `6a0f659c782f5072d87bde3eef8fc6fea8cd34589913fc11a49ce33b513528e6` | `035a0ac3b3fd1e7d3a43a1e4ec516ce0c59d3957d334092ce01c5102484ca01f` |
| `question.topic.critical-renal-organ-support.rrt-treatment-response.v1` | `f0c7ff80fa91c56d44e2f15b7f8e583cc62f030e640aa6acbab24716a036ed51` | `8b3817185fb7762b932245e7ed5a044ceae63e92145cd99ba78e117d311065bd` |
| `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1` | `b0443044e71b0e2ca3af359f17fbd2e905f364c4d7969ba2c9013622c0557481` | `b6c789d7b2fc71f5652a034c2592651fc7e28f9a10e8fcea51ac61dec15be0c8` |
| `question.topic.critical-renal-organ-support.uf-clearance-separation.v1` | `9d6bd2c9c3a132f31cc0f7de6c9e4ba2008e56e27fd49060188ec3aae70b8ec8` | `17c60a8f5d0b2138460e33d92426f51e7031645c1af40778554701ddf745473a` |
| `question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1` | `546ee627f9333bfd0ab960a7a98fdc9793bd04afbf1f3fa5f8d1659f14ca9962` | `3d27fde2aa797fdc3bd083958074a6f22eb25a5b5f0fa22a2180c52325d6cb15` |
| `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1` | `e6863ef955e60512cde0c9e9f34319c0b7be29e636fbbd7afb5acd352857d153` | `060977dee00935fc63e4c5d0d7a8bfebcd7bde08339fbdbfb9fcfb149cd8cd84` |

The whole-item hashes refer to the immutable reviewed versions. Current rendering-context hashes appear with each converted item. Clinical payload hashes cover all nine keyed and both parked versions and are independently pinned by the focused test.

## Retained keyed clinic chart-review packet

### Case oliguria-response

Case `case.topic.critical-renal-organ-support.oliguria-response.v1`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Nadia Ellis, 67 years, Female. Chief complaint — Low urine output.

**Presentation** In clinic, the founder reviews Nadia Ellis's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Nadia Ellis, a 67-year-old woman, is in the surgical ICU after colectomy. A patent urinary catheter drains small volumes." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.oliguria-response.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.oliguria-response.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.oliguria-response.clinic.v1`. Passed initial congestion decision followed by a revised current volume-assessment objective. The earlier passed fields and feedback are exact.

#### congestion-directed-oliguria — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1`, node `node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1`, concept `concept.critical-renal-organ-support.congestion-directed-oliguria.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Choose decongestion when postoperative oliguria accompanies fluid accumulation and absent response to further volume.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Course | Urine output has fallen as weight has risen 6 kg from the preoperative value. |
| Circulation | MAP is 76 mmHg without vasopressors. A monitored crystalloid challenge changed neither measured stroke volume nor urine output. |
| Respiratory findings | New bilateral lung B-lines accompany an oxygen increase from room air to 3 L/min. |
| Kidney trend | Creatinine rose from 0.9 to 1.8 mg/dL. Potassium is 4.6 mmol/L and arterial pH is 7.36. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which treatment should Nadia Ellis receive now for her low urine output?

**Preserved clinical task** Which treatment should Nadia Ellis receive now for her low urine output?

**key shown first for review only**

1. **Key** Give intravenous furosemide

   **Exact choice** `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.furosemide.v1`. Timing profile none.

   **Rationale** Accumulated fluid, lung findings and challenge nonresponse favor a monitored diuretic attempt.

   **Temptation** Treat the current congestion while assessing diuretic response.

   **Reasonable counterfactual** New external losses with improved lung findings and a response to volume would favor replacement.

   **Clinical claims** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`.

2. Give an isotonic crystalloid bolus

   **Exact choice** `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crystalloid.v1`. Timing profile none.

   **Rationale** The observed volume challenge supplied no circulatory or urine benefit while fluid and lung findings accumulated.

   **Temptation** Equate oliguria with intravascular depletion.

   **Reasonable counterfactual** A perfusion deficit after external losses with a response to volume would favor a bolus.

   **Clinical claims** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.fluid-excess`.

3. Begin continuous venovenous hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crrt.v1`. Timing profile none.

   **Rationale** A diuretic attempt remains reasonable at this respiratory and metabolic stage before extracorporeal removal.

   **Temptation** Escalate automatically because creatinine doubled.

   **Reasonable counterfactual** Major hypoxemia persisting after adequate diuretic treatment would favor replacement.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`.

**Explanation** The record favors fluid accumulation without benefit from further expansion. An IV loop-diuretic trial addresses the volume problem, with reassessment of urine output and breathing. Its purpose here is decongestion.

**Author check 1 — cue attack** Complaint and task disclose oliguria, which every option addresses. The key is a short named drug action. No diagnosis, resource permission, teaching sentence or list excluding all alternatives identifies it.

**Author check 2 — stage and category** All options are named treatments for the present renal-volume decision. The key contains no extra assessment bundle.

**Author check 3 — consequential steps** Integrate weight gain, lung observations and actual fluid-challenge nonresponse. Choose a monitored diuretic attempt before extracorporeal removal.

**Author check 4 — difficulty** Predicted moderate. A PGY-2/3 may reflexively give fluid for oliguria or start replacement for the creatinine rise.

**Author check 5 — single-best boundary** Fluid loading produced no measured circulatory or urine response as pulmonary findings and weight increased. Without the response and pulmonary record, another bolus could be reasonable.

**Closest competitor** `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crystalloid.v1`. Further expansion can aggravate renal and lung congestion.

**Decision-changing counterfactual** Replace the gain and lung findings with new high-output drainage and a prompt circulatory response to volume. Choose the bolus. Candidate `choice.topic.critical-renal-organ-support.congestion-directed-oliguria.crystalloid.v1`.

**Deletion test** Weight establishes accumulated fluid. The challenge separates the closest competitor. Breathing and chemistry establish the current escalation boundary. Demographics and operation supply patient context.

**Full-sequence attack** Only the common header and this exhibit are visible. Feedback addresses decongestion without teaching a FENa rule.

**Revision and repeated author check** Removed the draft interpretation volume-overloaded. Added raw weight, lung observations and measured response, then re-solved the options.

**Remaining boundary** Independent reviewer and Melissa must judge the clinical ranking and difficulty of this exact context. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `91646116ec6e2525062a8841735813ef39f168d903c4d2a370da0a9bd16083ca`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes None.

#### diuretic-confounded-indices — revised

##### Archived before — original reviewed clinical version

Complete item SHA-256 `f391ba035584ea56210422797844859505796ff09f283a18ee49e136d1208066`. Historical hospital presentation below is an audit snapshot, excluded from executable case definitions.

**Patient** Nadia Ellis, 67 years, Female. Chief complaint — Low urine output.

**Presentation** Nadia Ellis, a 67-year-old woman, is in the surgical ICU after colectomy. A patent urinary catheter drains small volumes.

**Presentation identity** `presentation.topic.critical-renal-organ-support.oliguria-response.v1`. Finite profiles `profile.topic.critical-renal-organ-support.oliguria-response.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.diuretic-confounded-indices.v1`, node `node.topic.critical-renal-organ-support.diuretic-confounded-indices.v1`, concept `concept.critical-renal-organ-support.diuretic-confounded-indices.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Choose volume replacement after new external losses despite a sodium-excretion result obtained after diuretic treatment.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Interval course | After furosemide, urine output increased and oxygen was discontinued. |
| New losses | Nasogastric suction then removed 2.8 L. Replacement fell behind. Her weight is now close to the preoperative value. |
| Current response | MAP fell to 62 mmHg. A small monitored crystalloid challenge increased stroke volume and MAP, with clear lungs. |
| Urine and chemistry | Urine output has fallen again. FENa is 3% in a specimen collected after furosemide. Creatinine is 2.0 mg/dL and potassium is 4.5 mmol/L. |

**Complete displayed task** Which treatment should Nadia Ellis receive now after the new decline in urine output?

**key shown first for review only**

1. **Key** Replace losses with isotonic crystalloid

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.crystalloid.v1`. Timing profile none.

   **Rationale** The new loss and observed perfusion response favor controlled replacement despite the post-diuretic FENa.

   **Temptation** Reassess a changed physiologic state.

   **Reasonable counterfactual** Persistent lung congestion and absent volume response would favor decongestion.

   **Clinical claims** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.urine-indices`.

2. Resume intravenous furosemide treatment

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.furosemide.v1`. Timing profile none.

   **Rationale** Recent diuretic treatment confounds the urine index, and the current loss-associated course makes further decongestion inappropriate.

   **Temptation** Treat high FENa as proof that volume cannot help.

   **Reasonable counterfactual** Recurrent congestion with adequate circulation and absent volume response could favor a diuretic.

   **Clinical claims** `claim.critical-renal-organ-support.urine-indices`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`.

3. Begin continuous venovenous hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.crrt.v1`. Timing profile none.

   **Rationale** The current observations supply a reversible perfusion problem without a demonstrated replacement-requiring complication.

   **Temptation** Escalate because creatinine increased after the earlier decision.

   **Reasonable counterfactual** A persistent life-threatening AKI complication despite medical care would favor replacement.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-context`.

**Explanation** Current losses and the observed stroke-volume response favor controlled crystalloid replacement. Diuretic exposure limits interpretation of FENa. The earlier fluid state must be reassessed after this new course.

**Exact visible-context SHA-256** `0de547dc9d5c2d866d088c881b2a64a1bf8cfba192733255b2d724074c1668d1`. Archived pre-conversion context.

**Atomic support** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.urine-indices`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.rrt-context`. Exact field mappings remain in the JSON and source ledger.

##### Current clinic record review

**Exact identity** Variant `question.topic.critical-renal-organ-support.diuretic-confounded-indices.v2`, node `node.topic.critical-renal-organ-support.diuretic-confounded-indices.v2`, concept `concept.critical-renal-organ-support.oliguria-volume-response-assessment.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1`.

**Objective** Select a current volume-response assessment when recurrent postoperative oliguria follows measured losses while pulmonary fluid findings persist.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Interval output and intake | During the last eight hours after furosemide, urine output was 1.0 L, nasogastric output was 1.4 L and IV intake was 1.0 L. Urine output has now fallen again. |
| Current examination | Weight remains above the preoperative value. Leg edema and bilateral lung B-lines persist. Oxygen remains at 2 L/min, while MAP has fallen from 76 to 66 mmHg. |
| Kidney observations | Creatinine is 2.0 mg/dL and potassium is 4.5 mmol/L. The urinary catheter remains patent. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which assessment should guide Nadia Ellis’s next volume-management decision for recurrent oliguria?

**Preserved clinical task** Which assessment should guide Nadia Ellis’s next volume-management decision for recurrent oliguria?

**key shown first for review only**

1. **Key** Measure stroke-volume response during passive leg raising

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.plr.v2`. Timing profile `timing.test.physiology`.

   **Rationale** Recent external losses and persistent pulmonary fluid findings leave the current response to additional volume unresolved. A reversible preload assessment measures the information needed for the next volume decision.

   **Temptation** Determine current volume responsiveness while avoiding another irreversible fluid challenge.

   **Reasonable counterfactual** With stable volume balance and new urine blood/protein suggesting a renal parenchymal mechanism, fresh sediment assessment would take priority.

   **Clinical claims** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.plr-output-assessment.r2`, `claim.critical-renal-organ-support.plr-treatment-boundary.r2`.

2. Examine fresh urine sediment by manual microscopy

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.sediment.v2`. Timing profile `timing.test.basic_labs`.

   **Rationale** Sediment can inform an intrinsic renal differential, but it does not establish the immediate circulatory response to volume under the competing current loss and lung findings.

   **Temptation** Attribute worsening creatinine and oliguria to a new intrinsic lesion before resolving the present volume decision.

   **Reasonable counterfactual** Matched intake/output, stable circulation and new urine blood/protein would favor sediment assessment.

   **Clinical claims** `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.sediment-scope`, `claim.critical-renal-organ-support.volume-context`.

3. Measure paired urine and serum urea for FEUrea

   **Exact choice** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.feurea.v2`. Timing profile `timing.test.basic_labs`.

   **Rationale** A fractional-excretion result has limited ability to establish the current treatment response and does not directly measure the output response to preload.

   **Temptation** Use a urinary index as a substitute for functional circulatory assessment after a diuretic.

   **Reasonable counterfactual** A broader renal-etiology evaluation after the immediate perfusion question is resolved may include urinary chemistry interpreted with the clinical course.

   **Clinical claims** `claim.critical-renal-organ-support.urine-solute-indices-limits.r2`, `claim.critical-renal-organ-support.kidney-assessment`.

**Explanation** The measured outputs exceed intake, yet lung fluid findings persist. These observations leave a consequential current volume question. Passive leg raising with direct stroke-volume or cardiac-output assessment can test preload responsiveness reversibly. Interpret its result with perfusion need and pulmonary risk before choosing treatment.

**Author check 1 — cue attack** Removed the authored replacement-deficit conclusion and the already successful fluid challenge. All three labels are specific assessments with comparable length. The task names the real volume-management decision, and every choice could contribute to an AKI evaluation. No treatment response or volume-status interpretation is supplied.

**Author check 2 — stage and category** All choices are assessments before the next volume-management treatment. Urinary indices and sediment compete as etiologic approaches, while the key measures the current physiological response.

**Author check 3 — consequential steps** Combine measured net losses, persistent lung fluid and changing MAP to recognize that neither the prior congestion state nor a urinary index settles present volume responsiveness. Select a reversible direct output-response assessment before committing to further volume or removal.

**Author check 4 — difficulty** Predicted fair moderate. The nearest error is pursuing an intrinsic-renal workup or urinary index while the unresolved immediate decision concerns a potentially fluid-responsive component and pulmonary risk. No hard rating is claimed.

**Author check 5 — single-best boundary** Substantial measured external loss coexists with continuing pulmonary fluid findings and a falling MAP, with no current challenge response supplied. Removing the simultaneous loss and pulmonary-risk observations removes the reason to prioritize this functional assessment. The originally included FENa was deleted because it did not change the prior treatment key.

**Closest competitor** `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.sediment.v2`. An etiologic test can leave the immediate volume decision unresolved. An empiric fluid or diuretic choice can worsen one side of the competing physiology.

**Decision-changing counterfactual** Replace this interval with matched intake/output, stable circulation and clear lungs, together with newly positive urine blood and protein. Fresh urine-sediment microscopy becomes the relevant next assessment among the offered choices. Candidate `choice.topic.critical-renal-organ-support.diuretic-confounded-indices.sediment.v2`.

**Deletion test** Actual intake and both output streams permit the learner to establish net loss. Persistent weight, edema and B-lines preserve the competing lung-risk boundary. MAP supplies a current perfusion change. Creatinine, potassium and catheter patency establish the renal course and immediate context. FENa and an already successful fluid challenge were removed.

**Full-sequence attack** The preceding PASS item and its feedback stay exact. They establish the earlier congestion state, but the new measured output/intake and current examination require reassessment. This follow-up assesses a different information need.

**Revision and repeated author check** Replaced the easy repeated-treatment item with an assessment decision. This materially changes the scored objective, so the new concept points to the previous concept without transferring history. Checked all assessments against the present stage and solved the stated alternative-course counterfactual.

**Remaining boundary** The revised assessment ranking requires independent review. One directly retrieved expert commentary supports the precise passive-leg-raise technique. The source provides no universal treatment rule from a positive response. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `1cb5f6e790395da249e8b721dde90c8e5f5a49219dacb2555d4b5e4e5c653d91`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.plr-output-assessment.r2`, `claim.critical-renal-organ-support.plr-treatment-boundary.r2`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.sediment-scope`, `claim.critical-renal-organ-support.urine-solute-indices-limits.r2`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes `node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1`.

### Case rrt-escalation

Case `case.topic.critical-renal-organ-support.rrt-escalation.v1`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Evan Brooks, 59 years, Male. Chief complaint — Kidney support review.

**Presentation** In clinic, the founder reviews Evan Brooks's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Evan Brooks, a 59-year-old man, is in the surgical ICU after source control for a perforated colon. Kidney function worsened during the initial hypotensive period." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.rrt-escalation.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.rrt-escalation.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.rrt-escalation.clinic.v1`. Three stages assess response before initiation, later refractory pulmonary fluid accumulation, then adjustment during active support. Earlier feedback avoids the next answer.

#### rrt-treatment-response — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.rrt-treatment-response.v1`, node `node.topic.critical-renal-organ-support.rrt-treatment-response.v1`, concept `concept.critical-renal-organ-support.rrt-treatment-response.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Assess current need for replacement using actual treatment response despite a severe creatinine rise.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Kidney course | During the first day, creatinine rose from 0.8 to 3.2 mg/dL and urine output fell markedly. |
| Response | Potassium fell from 6.3 to 4.8 mmol/L after medical treatment and is unchanged on repeat sampling. Arterial pH improved from 7.23 to 7.34. |
| Current organ support | MAP is 74 mmHg without vasopressors. He breathes room air and follows commands. Fluid balance is close to even. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which plan should guide Evan Brooks’s kidney-replacement decision at this assessment?

**Preserved clinical task** Which plan should guide Evan Brooks’s kidney-replacement decision at this assessment?

**key shown first for review only**

1. **Key** Repeat chemistry and fluid-balance assessment

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-treatment-response.surveillance.v1`. Timing profile `timing.test.basic_labs`.

   **Rationale** Serial assessment can detect recurrence while cause-directed care continues after the observed response.

   **Temptation** Distinguish injury severity from current support need.

   **Reasonable counterfactual** A recurrent treatment-resistant complication would favor starting replacement.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.kidney-assessment`.

2. Begin continuous venovenous hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-treatment-response.crrt.v1`. Timing profile none.

   **Rationale** The current response and organ course do not establish an immediate need despite the severe creatinine rise.

   **Temptation** Start replacement automatically for marked creatinine elevation.

   **Reasonable counterfactual** Persistent dangerous hyperkalemia or major refractory pulmonary fluid accumulation would favor replacement.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`.

3. Perform a furosemide stress test

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-treatment-response.stress.v1`. Timing profile `timing.test.physiology`.

   **Rationale** Prognostic response testing does not replace assessment of current complications and their response.

   **Temptation** Use a prognostic maneuver as a dialysis-initiation test.

   **Reasonable counterfactual** A selected patient whose clinical question concerns progression risk may undergo prognostic assessment.

   **Clinical claims** `claim.critical-renal-organ-support.furosemide-prognosis`, `claim.critical-renal-organ-support.rrt-context`.

**Explanation** Potassium and pH have improved and remain controlled at this assessment. Repeat chemistry and balance assessment addresses recurrence risk while cause-directed kidney care continues. The creatinine rise describes injury severity but does not independently establish an immediate extracorporeal support need.

**Author check 1 — cue attack** The task does not announce absent indications. Serial values must be interpreted. A specific assessment, a prognostic test and an immediate support procedure are real competing initiation strategies.

**Author check 2 — stage and category** The common stage is deciding whether current support need has been established. The stress test is a prognostic error at that stage. All choices name a concrete proposed action.

**Author check 3 — consequential steps** Distinguish corrected chemistry and stable current organ support from the earlier peak and creatinine trajectory. Choose serial assessment while treating the cause.

**Author check 4 — difficulty** Predicted moderate, with a concern for independent difficulty review. The severity cue and prior potassium peak may drive premature replacement.

**Author check 5 — single-best boundary** Repeat potassium remains controlled after treatment, pH improved, and current respiratory and fluid needs are stable. Without post-treatment and repeat values, the peak findings leave urgency unresolved.

**Closest competitor** `choice.topic.critical-renal-organ-support.rrt-treatment-response.crrt.v1`. Unnecessary replacement exposes the patient to treatment-related hemodynamic and access burdens.

**Decision-changing counterfactual** Replace the response with recurrent dangerous hyperkalemia despite appropriate medical treatment. Begin replacement. Candidate `choice.topic.critical-renal-organ-support.rrt-treatment-response.crrt.v1`.

**Deletion test** Creatinine establishes the competing severity cue. Serial chemistry determines response. Breathing, mentation and balance establish current relevant organ complications.

**Full-sequence attack** Future pulmonary findings are withheld. Current feedback explains response-based assessment without naming a later rescue or UF adjustment.

**Revision and repeated author check** Replaced two competing immediate-dialysis modality labels with a prognostic-testing competitor. Replaced the no-indication conclusion with actual response values.

**Remaining boundary** Independent reviewer and Melissa must judge the clinical ranking and difficulty of this exact context. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `113126bc87a5c943f52219365e0bc149cd7d270f49cfdc93e6200f7eb6427068`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.furosemide-prognosis`, `claim.critical-renal-organ-support.rrt-pulmonary`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes None.

#### rrt-refractory-pulmonary-fluid — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`, node `node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`, concept `concept.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Escalate renal fluid removal when progressive major hypoxemia persists despite actual diuretic treatment.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Interval course | Urine output remained minimal and cumulative balance increased by 5 L. |
| Respiratory course | Bilateral B-lines and diffuse alveolar opacities accompany escalation to noninvasive ventilation. Saturation is 88% on FiO2 0.60. |
| Diuretic response | Escalated IV furosemide followed by infusion produced negligible additional urine. Respiratory support continues to increase. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which treatment should Evan Brooks receive now for the worsening respiratory course?

**Preserved clinical task** Which treatment should Evan Brooks receive now for the worsening respiratory course?

**key shown first for review only**

1. **Key** Begin continuous venovenous hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.crrt.v1`. Timing profile none.

   **Rationale** Progressive major hypoxemia and pulmonary fluid accumulation persist despite the observed IV diuretic treatment.

   **Temptation** Recognize that the current respiratory course requires escalation.

   **Reasonable counterfactual** Improving oxygenation with useful diuretic response could favor continued pharmacologic care.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.rrt-context`.

2. Add intravenous chlorothiazide to furosemide

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.thiazide.v1`. Timing profile none.

   **Rationale** Sequential nephron blockade is credible, but the worsening major hypoxemia makes another drug attempt insufficient at this stage.

   **Temptation** Extend a reasonable nonurgent diuretic strategy into a deteriorating respiratory emergency.

   **Reasonable counterfactual** Stable breathing and residual loop response with a less urgent volume problem could favor an adjunct.

   **Clinical claims** `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.rrt-pulmonary`.

3. Replace furosemide with intravenous bumetanide

   **Exact choice** `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.bumetanide.v1`. Timing profile none.

   **Rationale** An agent change is poorly matched to the present urgency after negligible response to escalated IV treatment.

   **Temptation** Attribute the current failure principally to the chosen loop agent.

   **Reasonable counterfactual** A nonurgent agent-specific delivery or pharmacokinetic problem could justify a regimen change.

   **Clinical claims** `claim.critical-renal-organ-support.loop-agent-route`, `claim.critical-renal-organ-support.rrt-pulmonary`.

**Explanation** The actual failed diuretic course now coincides with worsening major hypoxemia and accumulating pulmonary fluid. These findings support urgent kidney replacement with fluid removal. The scored decision is escalation to extracorporeal support.

**Author check 1 — cue attack** Labels name three real fluid-removal treatments. The key is comparable in length to both drug choices and has no uniquely complete rescue bundle. The task does not supply the pulmonary mechanism.

**Author check 2 — stage and category** All options concern escalation of renal fluid removal now. A named CRRT regimen instantiates the replacement option without a claim that it universally outranks other adapted modalities.

**Author check 3 — consequential steps** Integrate balance, lung observations and oxygen trajectory into a worsening fluid-related complication. Escalate after actual pharmacologic nonresponse.

**Author check 4 — difficulty** Predicted moderate. The closest error is choosing adjunct nephron blockade while underweighting the escalating respiratory support.

**Author check 5 — single-best boundary** Major hypoxemia worsens despite escalated IV loop treatment with negligible urine response. Without actual treatment response and escalating oxygen needs, adding a thiazide could be reasonable.

**Closest competitor** `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.thiazide.v1`. Another pharmacologic trial can delay effective removal during respiratory deterioration.

**Decision-changing counterfactual** Change to stable oxygenation and a substantial but incomplete loop response. The adjunct-diuretic option becomes reasonable. Candidate `choice.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.thiazide.v1`.

**Deletion test** Balance shows accumulation, lung observations suggest the mechanism, oxygen trajectory establishes urgency, and actual IV response separates the nearest alternative.

**Full-sequence attack** The earlier explanation described monitoring corrected chemistry. New pulmonary and treatment-response observations are required for this escalation. Feedback avoids later UF troubleshooting.

**Revision and repeated author check** Removed further crystalloid as an easy foil. Added a credible adjunct drug and an agent-change error, each with separate pharmacology support.

**Remaining boundary** Independent reviewer and Melissa must judge the clinical ranking and difficulty of this exact context. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `3d66a643fe629b59b829c4035ee5ce860ce4842b55a78ec7b077f207473b2760`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.loop-agent-route`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes `node.topic.critical-renal-organ-support.rrt-treatment-response.v1`.

#### uf-clearance-separation — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.uf-clearance-separation.v1`, node `node.topic.critical-renal-organ-support.uf-clearance-separation.v1`, concept `concept.critical-renal-organ-support.uf-clearance-separation.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Adjust net removal separately from needed solute support when current circulation indicates intolerance of ultrafiltration.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Current treatment | After initial respiratory improvement, CRRT continues for solute control and net fluid removal. |
| New course | With cumulative removal, MAP falls and norepinephrine requirements rise. Stroke volume increases during a brief passive leg raise. |
| Observed responses | Pausing net fluid removal improves MAP. Breathing remains improved. Potassium still rises when solute-clearance treatment is interrupted. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which change should be made to Evan Brooks’s active CRRT prescription now?

**Preserved clinical task** Which change should be made to Evan Brooks’s active CRRT prescription now?

**key shown first for review only**

1. **Key** Set net removal to zero and continue clearance

   **Exact choice** `choice.topic.critical-renal-organ-support.uf-clearance-separation.zero-net.v1`. Timing profile none.

   **Rationale** The circulation improves when removal pauses, while solute control still depends on treatment.

   **Temptation** Separate intravascular tolerance from continuing solute-support need.

   **Reasonable counterfactual** Instability persisting after net removal stops or a circuit complication may require wider interruption.

   **Clinical claims** `claim.critical-renal-organ-support.uf-hypovolemia`, `claim.critical-renal-organ-support.clearance-versus-removal`.

2. Continue net removal and increase norepinephrine

   **Exact choice** `choice.topic.critical-renal-organ-support.uf-clearance-separation.pressor.v1`. Timing profile none.

   **Rationale** The actual response supports intolerance of current removal despite residual total-body fluid burden.

   **Temptation** Use pressor support to maintain removal without interpreting the response.

   **Reasonable counterfactual** Important residual congestion with adequate intravascular tolerance could favor continued removal.

   **Clinical claims** `claim.critical-renal-organ-support.uf-hypovolemia`, `claim.critical-renal-organ-support.volume-context`.

3. Stop solute clearance and net fluid removal

   **Exact choice** `choice.topic.critical-renal-organ-support.uf-clearance-separation.stop.v1`. Timing profile none.

   **Rationale** The supplied responses show an avoidable removal component and a remaining need for clearance.

   **Temptation** Treat one prescription component’s intolerance as failure of the entire treatment.

   **Reasonable counterfactual** Persistent shock despite zero net removal or a circuit-associated problem could require stopping all treatment.

   **Clinical claims** `claim.critical-renal-organ-support.uf-hypovolemia`, `claim.critical-renal-organ-support.clearance-versus-removal`.

**Explanation** Perfusion improves when net removal pauses, while the observed potassium course still requires solute support. Set net removal to zero while continuing clearance and reassessing circulation. Future removal targets depend on that reassessment.

**Author check 1 — cue attack** Each option is a CRRT prescription change. Components are balanced between continuing clearance and stopping both. The task does not name depletion or tell the learner which prescription component caused the change.

**Author check 2 — stage and category** One current prescription decision. Calcium, access checks and ventilation care are not bundled uniquely into the key.

**Author check 3 — consequential steps** Recognize loss of intravascular removal tolerance despite earlier total-body excess. Stop net removal while retaining currently needed solute support.

**Author check 4 — difficulty** Predicted moderate to hard. The resident must separate total-body fluid, intravascular tolerance and solute clearance.

**Author check 5 — single-best boundary** MAP improves after net removal pauses and potassium control remains dependent on solute treatment. Without separate circulatory and potassium responses, stopping removal versus all treatment is unresolved.

**Closest competitor** `choice.topic.critical-renal-organ-support.uf-clearance-separation.stop.v1`. Stopping all support loses needed clearance. Pressor-driven removal can worsen perfusion intolerance.

**Decision-changing counterfactual** Supply persistent shock after net removal stops with a new circuit-associated deterioration. Stop the extracorporeal treatment for urgent assessment. Candidate `choice.topic.critical-renal-organ-support.uf-clearance-separation.stop.v1`.

**Deletion test** Prior improvement supplies chronology. Measured response establishes intravascular tolerance. Potassium during actual interruptions explains why clearance remains needed.

**Full-sequence attack** Previous feedback justified starting support and did not teach UF adjustment. These newly observed responses supply the current inference.

**Revision and repeated author check** Restricted options to the CRRT change after a draft key accumulated several extra safety actions. Re-solved the component distinction.

**Remaining boundary** The exact ranking of zero net removal versus stopping all treatment needs Melissa’s review. One retrieved current guideline directly supports the UF action as panel opinion. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `1c0c2fd8e1088a31eda86d6e6d825259df7e37483fe5ad8018a9c4b12caf5cfe`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.uf-hypovolemia`, `claim.critical-renal-organ-support.clearance-versus-removal`, `claim.critical-renal-organ-support.volume-context`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes `node.topic.critical-renal-organ-support.rrt-treatment-response.v1`, `node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1`.

### Case abdominal-pressure

Case `case.topic.critical-renal-organ-support.abdominal-pressure.v1`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Leah Morgan, 64 years, Female. Chief complaint — Falling urine output.

**Presentation** In clinic, the founder reviews Leah Morgan's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Leah Morgan, a 64-year-old woman, is in the surgical ICU after laparotomy for bowel perforation. Her abdominal girth increases as urine output falls." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.abdominal-pressure.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.abdominal-pressure.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.abdominal-pressure.clinic.v1`. Single scored drainage decision in clinic chart review. The original earlier acquisition facts, options, rationales and feedback are displayed as read-only outside-record history. Revised acquisition v2 remains a separate clinic case.

#### pressure-fluid-drainage — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1`, node `node.topic.critical-renal-organ-support.pressure-fluid-drainage.v1`, concept `concept.critical-renal-organ-support.pressure-fluid-drainage.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Use fluid anatomy to select an initial decompressive route after valid pressure-associated organ deterioration.

**Outside chart history / current update**

> Earlier outside ICU record
>
> Which investigation should guide Leah Morgan’s next renal-support decision?
>
> Clinical course
> Abdominal distension, ventilator pressure requirements and creatinine have increased. Blood pressure remains stable.
>
> First pressure record
> A bladder pressure of 27 mmHg was recorded during coughing, with the head of bed elevated and 100 mL instilled into the bladder.
>
> Urinary drainage
> The catheter irrigates freely. The bladder is not distended on bedside assessment.
>
> Repeat transvesical pressure with standardized acquisition
> The displayed pressure needs technically reliable repetition using relaxed supine end-expiratory acquisition, correct zeroing and limited instillation.
>
> Obtain contrast CT of the abdomen and pelvis
> CT may assess an abdominal source but does not resolve the flawed acquisition currently governing this pressure-related decision.
>
> Obtain renal and urinary-tract ultrasonography
> Upper-tract imaging can address obstruction but leaves the present acquisition discrepancy unresolved.
>
> The initial bladder reading needs technically standardized repetition. Coughing, position and excessive instillation compromise its interpretation. A valid series can then be related to the organ-function changes.

| Recorded observation | Value |
|---|---|
| Repeat pressures | Two resting supine end-expiratory readings are 23 and 24 mmHg using 20 mL instillation and midaxillary zeroing. |
| Organ course | Urine output continues to fall and ventilator pressure requirements increase. |
| Abdominal assessment | Ultrasound shows a large free intraperitoneal fluid pocket with a safe percutaneous window and diffuse bowel-wall swelling. |
| Interval surgical course | Hemoglobin is unchanged without further transfusion. The drains return clear fluid and lactate has fallen after source control. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which decompressive intervention should Leah Morgan receive first at this assessment?

**Preserved clinical task** Which decompressive intervention should Leah Morgan receive first at this assessment?

**key shown first for review only**

1. **Key** Place a percutaneous peritoneal drainage catheter

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-fluid-drainage.drain.v1`. Timing profile none.

   **Rationale** The large accessible fluid component offers a targeted initial decompressive route, followed by prompt reassessment.

   **Temptation** Use the current drainable anatomical component.

   **Reasonable counterfactual** Little residual fluid with worsening organ dysfunction after drainage favors operative release.

   **Clinical claims** `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.pressure-organ-failure`.

2. Perform decompressive laparotomy with temporary closure

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-fluid-drainage.laparotomy.v1`. Timing profile none.

   **Rationale** Operative release is important, but the current fluid anatomy permits a targeted initial drainage attempt under the society suggestion.

   **Temptation** Treat every overt pressure-related organ problem as requiring immediate open-abdomen management.

   **Reasonable counterfactual** Persistent deterioration after less invasive treatment with little accessible fluid favors laparotomy.

   **Clinical claims** `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.peritoneal-drainage`.

3. Begin CRRT with net fluid removal

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-fluid-drainage.crrt.v1`. Timing profile none.

   **Rationale** Renal support can address independent renal indications, but it does not directly drain the identified peritoneal component.

   **Temptation** Substitute systemic volume removal for a direct decompressive target.

   **Reasonable counterfactual** An urgent independent replacement indication can require renal support alongside abdominal care.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.peritoneal-drainage`.

**Explanation** Valid pressures and new renal and respiratory dysfunction establish a pressure-related organ problem. The large accessible peritoneal fluid component supports an initial catheter-drainage attempt. Pressure and organ responses require close reassessment.

**Author check 1 — cue attack** Three named decompressive or organ-support procedures compete. The task names neither minimal invasiveness nor fluid removal. The safe window is necessary anatomical eligibility. No general availability permission favors the key.

**Author check 2 — stage and category** All options propose the first intervention for this current pressure-associated organ problem.

**Author check 3 — consequential steps** Integrate valid repeated pressure with new renal and respiratory dysfunction. Use the accessible fluid anatomy to choose the initial decompressive route.

**Author check 4 — difficulty** Predicted moderate to hard. Both laparotomy and catheter drainage are credible. Exact ranking has a low-certainty evidence boundary.

**Author check 5 — single-best boundary** Large accessible free fluid remains, with no separate current surgical source-control indication. Without the fluid map, drainage has no established target and surgery becomes a stronger choice.

**Closest competitor** `choice.topic.critical-renal-organ-support.pressure-fluid-drainage.laparotomy.v1`. An immediate open-abdomen intervention may be avoidable if targeted fluid drainage relieves the pressure component.

**Decision-changing counterfactual** Replace the fluid pocket with diffuse edema and persistent deterioration after actual drainage. Choose decompressive laparotomy. Candidate `choice.topic.critical-renal-organ-support.pressure-fluid-drainage.laparotomy.v1`.

**Deletion test** Technique supports validity. Organ changes establish significance. Fluid anatomy separates drainage from surgery. Hemoglobin, drain appearance and lactate trajectory address competing hemorrhage or unresolved-source concerns using actual observations.

**Full-sequence attack** Earlier feedback covered acquisition. This exhibit adds valid measurements and fluid anatomy. Feedback here does not state the next failed-treatment action.

**Revision and repeated author check** Replaced an eligibility conclusion with a concrete fluid map. Replaced no need for re-exploration with hemoglobin, drain and lactate observations. Re-solved the catheter-versus-laparotomy ranking under the WSACS 2D suggestion and retained Melissa’s exact-review question.

**Remaining boundary** Single-guideline GRADE 2D ranking. Melissa must decide whether the exact organ course permits a catheter-first key. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `f3066ba7f645094b639d6ee4dcfd4b9ac7bc7bfabf0460840bfccc51578d6702`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.rrt-pulmonary`. Exact field mappings remain in the JSON and source ledger.

**Selection** `standalone`. Required scored prior nodes None.

### Case circuit-anticoagulation

Case `case.topic.critical-renal-organ-support.circuit-anticoagulation.v1`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Owen Carter, 71 years, Male. Chief complaint — Dialysis circuit clotting.

**Presentation** In clinic, the founder reviews Owen Carter's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Owen Carter, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1`. Single scored circuit strategy in clinic chart review. The later unresolved metabolic comparison stays parked and unkeyed.

#### citrate-bleeding-circuit — pass-preserved

**Exact identity** Variant `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1`, node `node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1`, concept `concept.critical-renal-organ-support.citrate-bleeding-circuit.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Choose a circuit anticoagulation strategy when repeated clotting and recent hemorrhage compete.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Bleeding course | Reoperation controlled a postoperative bleed. Drain output remains blood-stained and red-cell support was needed recently. |
| Circuit course | Two anticoagulant-free circuits clotted early and interrupted treatment. Access flow and catheter position have been checked. |
| Current metabolism | He is off vasopressors. Lactate is 1.3 mmol/L, bilirubin is 0.8 mg/dL and systemic ionized calcium is within the local reference range. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which CRRT anticoagulation strategy should Owen Carter receive now?

**Preserved clinical task** Which CRRT anticoagulation strategy should Owen Carter receive now?

**key shown first for review only**

1. **Key** Use regional citrate anticoagulation

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.citrate.v1`. Timing profile none.

   **Rationale** The repeated circuit loss makes an unanticoagulated strategy problematic, while the bleeding course makes systemic heparin less attractive.

   **Temptation** Preserve circuit patency while limiting systemic anticoagulant exposure.

   **Reasonable counterfactual** Documented metabolic intolerance to citrate could favor an unanticoagulated or other specialist-directed strategy.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`.

2. Use systemic unfractionated heparin

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.heparin.v1`. Timing profile none.

   **Rationale** Systemic heparin adds systemic anticoagulation during the current bleeding-risk course.

   **Temptation** Prioritize filter life without adequately weighting recent hemorrhage.

   **Reasonable counterfactual** A separate systemic anticoagulation indication with acceptable bleeding risk can favor heparin.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-bleeding`.

3. Continue anticoagulant-free CRRT

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1`. Timing profile none.

   **Rationale** This avoids anticoagulant exposure but has repeatedly lost circuits despite checked access.

   **Temptation** Treat bleeding risk as a reason to accept any interruption burden.

   **Reasonable counterfactual** High citrate-intolerance risk with adequate unanticoagulated circuit survival could favor this strategy.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`.

**Explanation** Regional citrate can preserve circuit patency while limiting systemic anticoagulant exposure in this bleeding-risk course. Metabolic monitoring is required. The current choice depends on both hemorrhage risk and the observed failure of anticoagulant-free circuits.

**Author check 1 — cue attack** Three standard strategies have parallel short labels. No availability sentence or pre-answer safety conclusion selects citrate. Actual metabolic observations establish the relevant boundary.

**Author check 2 — stage and category** One current circuit-anticoagulation choice. The key has no uniquely complete monitoring bundle.

**Author check 3 — consequential steps** Weigh recent hemorrhage against actual repeated circuit failure after access assessment. Choose regional circuit anticoagulation with metabolic monitoring.

**Author check 4 — difficulty** Predicted moderate. The closest error is treating recent bleeding as an absolute reason to tolerate repeated unanticoagulated failures.

**Author check 5 — single-best boundary** Repeated early clotting persists despite checked access and the current course supplies no demonstrated citrate intolerance. Without actual circuit failure, continued unanticoagulated treatment becomes a stronger competitor.

**Closest competitor** `choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1`. Repeated circuit loss can compromise delivery, while systemic anticoagulation can aggravate bleeding risk.

**Decision-changing counterfactual** Supply prior documented citrate accumulation and adequate unanticoagulated circuit survival. Continue anticoagulant-free CRRT. Candidate `choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1`.

**Deletion test** Bleeding establishes systemic risk. Clotting after access assessment establishes the remaining circuit problem. Metabolic observations contribute to citrate-tolerance assessment.

**Full-sequence attack** The later calcium trajectory and perfusion impairment are absent. Current feedback states monitoring needs without explaining the next answer.

**Revision and repeated author check** Removed citrate-availability wording and moved monitoring rationale out of the key. Rechecked the competing risks.

**Remaining boundary** Independent reviewer and Melissa must judge the clinical ranking and difficulty of this exact context. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `6915d4e4eee72b3fead7e6019172cb39fc29f775853c14933f8e7ef0888f4f11`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`. Exact field mappings remain in the JSON and source ledger.

**Selection** `standalone`. Required scored prior nodes None.

### Case kidney-recovery

Case `case.topic.critical-renal-organ-support.kidney-recovery.v1`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent_stable`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Maya Reed, 62 years, Female. Chief complaint — Kidney recovery review.

**Presentation** In clinic, the founder reviews Maya Reed's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Maya Reed, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.kidney-recovery.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.kidney-recovery.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.kidney-recovery.clinic.v1`. An independent single-node assessment uses an actual treatment interruption. No earlier explanation teaches its interpretation.

#### trial-off-crrt — revised

##### Archived before — original reviewed clinical version

Complete item SHA-256 `c83b1ed310b71725a301581bb709662d43871561f3d2e41f33da41359ed2e4b3`. Historical hospital presentation below is an audit snapshot, excluded from executable case definitions.

**Patient** Maya Reed, 62 years, Female. Chief complaint — Kidney recovery review.

**Presentation** Maya Reed, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI.

**Presentation identity** `presentation.topic.critical-renal-organ-support.kidney-recovery.v1`. Finite profiles `profile.topic.critical-renal-organ-support.kidney-recovery.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.trial-off-crrt.v1`, node `node.topic.critical-renal-organ-support.trial-off-crrt.v1`, concept `concept.critical-renal-organ-support.trial-off-crrt.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Choose a monitored interruption when actual off-treatment control and spontaneous urine support recovery despite residual creatinine elevation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Urine course | Urine output rose spontaneously to 1.6 L during the past day without diuretics. Net machine fluid removal was zero during the last shift. |
| Actual interruption | The circuit has been stopped for eight hours. Potassium changed from 4.3 to 4.5 mmol/L and arterial pH from 7.39 to 7.37. |
| Current balance | Intake and urine losses remain close to matched. Breathing and blood pressure remain stable without new support. |
| Creatinine | Creatinine rose from 1.1 mg/dL during treatment to 2.0 mg/dL during the interruption. Her pre-illness value was 0.8 mg/dL. |

**Complete displayed task** Which kidney-support plan should Maya Reed receive now at the end of this CRRT circuit?

**key shown first for review only**

1. **Key** Continue the interruption with chemistry and balance monitoring

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.trial.v1`. Timing profile `timing.test.basic_labs`.

   **Rationale** Spontaneous urine and the actual metabolic and volume course support a monitored trial despite residual dysfunction.

   **Temptation** Judge recovery against current support needs.

   **Reasonable counterfactual** An observed recurrent metabolic or fluid-removal need favors restarting support.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`.

2. Restart CRRT at the preceding prescription

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v1`. Timing profile none.

   **Rationale** The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart.

   **Temptation** Treat the on-circuit creatinine as an independent native-filtration baseline.

   **Reasonable counterfactual** Recurrent dangerous hyperkalemia or pulmonary fluid accumulation during the interruption favors restarting support.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`.

3. Convert to scheduled intermittent hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.ihd.v1`. Timing profile none.

   **Rationale** Conversion still provides replacement when the current observations support assessing whether replacement is needed.

   **Temptation** Interpret hemodynamic improvement as a reason to switch before considering liberation.

   **Reasonable counterfactual** Stable circulation with continuing support needs may favor intermittent therapy.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.stable-rrt-modality`.

**Explanation** The actual interruption shows spontaneous urine production with current metabolic and volume control. Continue a monitored trial off treatment. The on-circuit creatinine reflected extracorporeal removal, so its rise needs interpretation alongside the observed support needs.

**Exact visible-context SHA-256** `cd22123dd1f8de68d0a6d270e44384a0e197935305300abdc14721fc95cd259f`. Archived pre-conversion context.

**Atomic support** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.stable-rrt-modality`. Exact field mappings remain in the JSON and source ledger.

##### Current clinic record review

**Exact identity** Variant `question.topic.critical-renal-organ-support.trial-off-crrt.v2`, node `node.topic.critical-renal-organ-support.trial-off-crrt.v2`, concept `concept.critical-renal-organ-support.trial-off-crrt.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1`.

**Objective** Choose a monitored interruption when actual off-treatment control and spontaneous urine support recovery despite residual creatinine elevation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Urine course | Urine output rose spontaneously to 1.6 L during the past day without diuretics. Net machine fluid removal was zero during the last shift. |
| Treatment course | The circuit has been stopped for eight hours. Potassium changed from 4.3 to 4.5 mmol/L and arterial pH from 7.39 to 7.37. |
| Current balance | Intake and urine losses remain close to matched. Breathing and blood pressure remain stable without new support. |
| Creatinine | Creatinine rose from 1.1 mg/dL during treatment to 2.0 mg/dL during the interruption. Her pre-illness value was 0.8 mg/dL. |
| Ongoing care | Chemistry, urine output, fluid balance, breathing and circulation continue to be monitored with each proposed support plan. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. At this reassessment after CRRT interruption, which kidney-support plan should Maya Reed receive?

**Preserved clinical task** At this reassessment after CRRT interruption, which kidney-support plan should Maya Reed receive?

**key shown first for review only**

1. **Key** Continue the current trial off CRRT

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.trial.v2`. Timing profile none.

   **Rationale** Spontaneous urine and the actual metabolic and volume course support a monitored trial despite residual dysfunction.

   **Temptation** Judge recovery against current support needs.

   **Reasonable counterfactual** An observed recurrent metabolic or fluid-removal need favors restarting support.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`.

2. Restart the previous CRRT prescription

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2`. Timing profile none.

   **Rationale** The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart.

   **Temptation** Treat the on-circuit creatinine as an independent native-filtration baseline.

   **Reasonable counterfactual** Recurrent dangerous hyperkalemia or pulmonary fluid accumulation during the interruption favors restarting support.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`.

3. Switch to intermittent hemodialysis

   **Exact choice** `choice.topic.critical-renal-organ-support.trial-off-crrt.ihd.v2`. Timing profile none.

   **Rationale** Conversion still provides replacement when the current observations support assessing whether replacement is needed.

   **Temptation** Interpret hemodynamic improvement as a reason to switch before considering liberation.

   **Reasonable counterfactual** Stable circulation with continuing support needs may favor intermittent therapy.

   **Clinical claims** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.stable-rrt-modality`.

**Explanation** The actual interruption shows spontaneous urine production with current metabolic and volume control. Continue a monitored trial off treatment. The on-circuit creatinine reflected extracorporeal removal, so its rise needs interpretation alongside the observed support needs.

**Author check 1 — cue attack** Moved monitoring into common observed care and shortened all options to comparable kidney-support plans. Replaced the exhibit label Actual interruption with Treatment course. The task explicitly places the decision at the current reassessment after interruption.

**Author check 2 — stage and category** All three choices concern the support plan at the same reassessment. Monitoring continues across choices, and the key contains no unique caution or assessment bundle.

**Author check 3 — consequential steps** Interpret the rise from an on-treatment creatinine alongside actual spontaneous urine, chemistry and fluid control after extracorporeal clearance has stopped. Choose continued monitored trial off support over automatic restart or modality conversion.

**Author check 4 — difficulty** Predicted fair moderate, consistent with independent review of the clinical construct. The nearest error treats the on-circuit creatinine as a native-function baseline.

**Author check 5 — single-best boundary** Actual off-treatment potassium, pH, fluid balance and support remain controlled as spontaneous urine rises. Without interruption data, urine and on-circuit creatinine cannot establish whether support can be withheld.

**Closest competitor** `choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2`. Automatic restart may prolong support, while an unmonitored stop can miss recurrent needs.

**Decision-changing counterfactual** Replace the interruption course with rising potassium despite medical treatment and increasing pulmonary fluid burden. Restart CRRT. Candidate `choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2`.

**Deletion test** Retained spontaneous urine, actual interruption observations, serial chemistry, balance and both creatinine comparisons because they determine present support need. Shared monitoring preserves the safety boundary while removing unique key wording. The circuit-completion task phrase was deleted.

**Full-sequence attack** Standalone reassessment. The task now agrees with the observed eight-hour interruption. The interval remains a constructed observation, and no universal liberation duration is taught.

**Revision and repeated author check** Repaired the timeline and the elaborated-key cue in one version. Re-solved the unchanged physiological key and the restart counterfactual after moving surveillance into shared care.

**Remaining boundary** All identified clarity and surveillance-wording issues are addressed. Exact clinical review and independent re-review remain pending. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `63c935480e7edb11e15e5e9196c7c4552aebf90c43b9f4927c52f400a9013ebe`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.stable-rrt-modality`. Exact field mappings remain in the JSON and source ledger.

**Selection** `standalone`. Required scored prior nodes None.

### Case pressure-acquisition-revision

Case `case.topic.critical-renal-organ-support.pressure-acquisition.v2`. Header owner `critical-renal-organ-support`. Gameplay setting `clinic`, outside care setting `outside_hospital_intensive_care`, educational tier 2, recorded acuity `urgent`, facility level 4 and simulation weight `null`. Required capability `capability.examination`.

**Patient** Leah Morgan, 64 years, Female. Chief complaint — Falling urine output.

**Presentation** In clinic, the founder reviews Leah Morgan's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Leah Morgan, a 64-year-old woman, is in the surgical ICU after laparotomy for bowel perforation. Her abdominal girth increases as urine output falls." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.pressure-acquisition.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.pressure-acquisition.clinic.v1`.

**Runtime delivery** Normalized clinic case present. Presentation revision `presentation-revision.topic.critical-renal-organ-support.pressure-acquisition-revision.clinic.v1`. Standalone revised measurement assessment. The passed v1 drainage item retains its separate reviewed prior context.

#### pressure-acquisition — revised

##### Archived before — original reviewed clinical version

Complete item SHA-256 `eb9995dcf6213715a56985c38f869d26b73eb212663104410b24550b35f996e7`. Historical hospital presentation below is an audit snapshot, excluded from executable case definitions.

**Patient** Leah Morgan, 64 years, Female. Chief complaint — Falling urine output.

**Presentation** Leah Morgan, a 64-year-old woman, is in the surgical ICU after laparotomy for bowel perforation. Her abdominal girth increases as urine output falls.

**Presentation identity** `presentation.topic.critical-renal-organ-support.abdominal-pressure.v1`. Finite profiles `profile.topic.critical-renal-organ-support.abdominal-pressure.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.pressure-acquisition.v1`, node `node.topic.critical-renal-organ-support.pressure-acquisition.v1`, concept `concept.critical-renal-organ-support.pressure-acquisition.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Validate compromised pressure acquisition before choosing abdominal decompressive escalation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Clinical course | Abdominal distension, ventilator pressure requirements and creatinine have increased. Blood pressure remains stable. |
| First pressure record | A bladder pressure of 27 mmHg was recorded during coughing, with the head of bed elevated and 100 mL instilled into the bladder. |
| Urinary drainage | The catheter irrigates freely. The bladder is not distended on bedside assessment. |

**Complete displayed task** Which investigation should guide Leah Morgan’s next renal-support decision?

**key shown first for review only**

1. **Key** Repeat transvesical pressure with standardized acquisition

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.repeat.v1`. Timing profile `timing.test.physiology`.

   **Rationale** The displayed pressure needs technically reliable repetition using relaxed supine end-expiratory acquisition, correct zeroing and limited instillation.

   **Temptation** Validate decisive bedside data before escalating.

   **Reasonable counterfactual** An adequate pressure series with concern for an unresolved abdominal source could justify anatomical investigation.

   **Clinical claims** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`.

2. Obtain contrast CT of the abdomen and pelvis

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.ct.v1`. Timing profile `timing.test.ct`.

   **Rationale** CT may assess an abdominal source but does not resolve the flawed acquisition currently governing this pressure-related decision.

   **Temptation** Accept the displayed pressure and seek its anatomical cause first.

   **Reasonable counterfactual** Reliable pressure data with concern for leak, hemorrhage or an unresolved lesion could favor CT.

   **Clinical claims** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.kidney-assessment`.

3. Obtain renal and urinary-tract ultrasonography

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.renal-us.v1`. Timing profile `timing.test.ultrasound`.

   **Rationale** Upper-tract imaging can address obstruction but leaves the present acquisition discrepancy unresolved.

   **Temptation** Anchor on a collecting-system cause of oliguria.

   **Reasonable counterfactual** An obstructive history without the current pressure-acquisition discrepancy could favor renal ultrasound.

   **Clinical claims** `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.pressure-technique`.

**Explanation** The initial bladder reading needs technically standardized repetition. Coughing, position and excessive instillation compromise its interpretation. A valid series can then be related to the organ-function changes.

**Exact visible-context SHA-256** `f21219065220247ea49f317941a3453e492f8e1acfc0727d19830698258dcf0e`. Archived pre-conversion context.

**Atomic support** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.kidney-assessment`. Exact field mappings remain in the JSON and source ledger.

##### Current clinic record review

**Exact identity** Variant `question.topic.critical-renal-organ-support.pressure-acquisition.v2`, node `node.topic.critical-renal-organ-support.pressure-acquisition.v2`, concept `concept.critical-renal-organ-support.pressure-acquisition.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1`.

**Objective** Validate compromised pressure acquisition before choosing abdominal decompressive escalation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Clinical course | Abdominal distension, ventilator pressure requirements and creatinine have increased. Blood pressure remains stable. |
| First pressure record | A bladder pressure of 27 mmHg was recorded during coughing, with the head of bed elevated and 100 mL instilled into the bladder. |
| Urinary drainage | The catheter irrigates freely. The bladder is not distended on bedside assessment. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which investigation should Leah Morgan undergo next for her increasing abdominal distension, falling urine output and rising ventilator pressure requirements?

**Preserved clinical task** Which investigation should Leah Morgan undergo next for her increasing abdominal distension, falling urine output and rising ventilator pressure requirements?

**key shown first for review only**

1. **Key** Repeat bladder pressure supine at end expiration

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.repeat.v2`. Timing profile `timing.test.physiology`.

   **Rationale** The displayed pressure needs technically reliable repetition using relaxed supine end-expiratory acquisition, correct zeroing and limited instillation.

   **Temptation** Validate decisive bedside data before escalating.

   **Reasonable counterfactual** An adequate pressure series with concern for an unresolved abdominal source could justify anatomical investigation.

   **Clinical claims** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`.

2. Obtain abdominal and pelvic CT with IV contrast

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.ct.v2`. Timing profile `timing.test.ct`.

   **Rationale** CT may assess an abdominal source but does not resolve the flawed acquisition currently governing this pressure-related decision.

   **Temptation** Accept the displayed pressure and seek its anatomical cause first.

   **Reasonable counterfactual** Reliable pressure data with concern for leak, hemorrhage or an unresolved lesion could favor CT.

   **Clinical claims** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.kidney-assessment`.

3. Obtain renal ultrasonography with bladder-volume assessment

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-acquisition.renal-us.v2`. Timing profile `timing.test.ultrasound`.

   **Rationale** Upper-tract imaging can address obstruction but leaves the present acquisition discrepancy unresolved.

   **Temptation** Anchor on a collecting-system cause of oliguria.

   **Reasonable counterfactual** An obstructive history without the current pressure-acquisition discrepancy could favor renal ultrasound.

   **Clinical claims** `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.pressure-technique`.

**Explanation** Coughing, head elevation and excessive bladder filling compromise the first reading. Repeat the transvesical measurement with the patient supine and relaxed at end expiration, using at most 25 mL bladder instillation and a midaxillary zero reference. Relate the resulting pressure to the current organ changes.

**Author check 1 — cue attack** Removed standardized acquisition. The key names a concrete repeat procedure and positions, while the other options name comparably specific imaging acquisitions. The task asks for the next investigation of the actual findings and supplies no dialysis-prescription frame.

**Author check 2 — stage and category** Three investigations compete for the current abdominal and organ-function assessment. No treatment or broadly qualified quality-assurance plan appears.

**Author check 3 — consequential steps** Identify the acquisition faults in the recorded position, coughing and instillation. Prioritize a repeat transvesical measurement using a specified physiological acquisition over a different diagnostic pathway.

**Author check 4 — difficulty** Predicted fair moderate. A resident must distinguish an unreliable pressure from an established high value and choose the investigation that resolves that uncertainty.

**Author check 5 — single-best boundary** The only pressure was acquired during coughing, head elevation and excessive bladder filling. Without acquisition details, CT or urinary imaging can be reasonable and repeating pressure lacks a specific justification.

**Closest competitor** `choice.topic.critical-renal-organ-support.pressure-acquisition.ct.v2`. Treating an unreliable value as established can drive incorrect invasive escalation.

**Decision-changing counterfactual** Supply a valid pressure series and an unresolved postoperative abdominal-source concern. Choose abdominal CT. Candidate `choice.topic.critical-renal-organ-support.pressure-acquisition.ct.v2`.

**Deletion test** Retained abdominal, respiratory and renal changes to establish the clinical question. Retained acquisition observations to make its reliability consequential. Catheter patency keeps simple retention from becoming an unmentioned competing explanation. The abstract quality qualifier was removed.

**Full-sequence attack** This revised acquisition candidate has its own case/presentation identity. It does not precede the frozen drainage PASS. That PASS retains the reviewed v1 acquisition context byte-for-byte in its preserved visible-context record.

**Revision and repeated author check** Aligned the task with the actual evolving findings, replaced the unique quality qualifier with a concrete procedure, and added the supported supine, relaxation, respiratory-phase, instillation-limit and zero-reference method in feedback. Re-solved CT in the counterfactual with already adequate pressure acquisition.

**Remaining boundary** Moderate difficulty is retained after all identified clarity and qualifier issues were addressed. Manager must preserve the v1 context of the passed drainage item and keep this revised branch separate. Author disposition `DRAFT_FOR_INDEPENDENT_REVIEW`.

**Exact visible-context SHA-256** `b819f6ac232ef389ecf75a76530f59a67567b9ff45e9707a93cd3e1b1a9895c6`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.kidney-assessment`. Exact field mappings remain in the JSON and source ledger.

**Selection** `standalone`. Required scored prior nodes None.

## Parked after one revision attempt

Both comparisons now use the same clinic chart-review frame. Their keys remain null and every correctness flag remains null. They are excluded from executable questions, nodes, cases and the source release.

### pressure-refractory-decompression — parked

**Park reason** Melissa must select the clinically supported repeat-catheter versus operative strategy or a different supported discriminator. The parked draft supplies no scored key.

##### Archived before — original reviewed clinical version

Complete item SHA-256 `45692c1bdada406f8d92e1b7a311396a87f585d0738dcfaf125c5d4ccb1ef603`. Historical hospital presentation below is an audit snapshot, excluded from executable case definitions.

**Patient** Leah Morgan, 64 years, Female. Chief complaint — Falling urine output.

**Presentation** Leah Morgan, a 64-year-old woman, is in the surgical ICU after laparotomy for bowel perforation. Her abdominal girth increases as urine output falls.

**Presentation identity** `presentation.topic.critical-renal-organ-support.abdominal-pressure.v1`. Finite profiles `profile.topic.critical-renal-organ-support.abdominal-pressure.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.pressure-refractory-decompression.v1`, node `node.topic.critical-renal-organ-support.pressure-refractory-decompression.v1`, concept `concept.critical-renal-organ-support.pressure-refractory-decompression.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Escalate to operative decompression after actual failure of less invasive measures and loss of the drainable fluid target.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Observed drainage | The catheter removed a large volume. Repeat ultrasound now shows little free peritoneal fluid and diffuse bowel-wall edema. |
| Current measures | Gastric decompression functions. Adequate analgesia and a brief neuromuscular-blockade trial have not lowered the pressure. |
| Current course | Resting bladder pressure remains 28 mmHg. Anuria, worsening ventilation and an increasing norepinephrine requirement develop. |

**Complete displayed task** Which decompressive intervention should Leah Morgan receive now after catheter drainage?

**key shown first for review only**

1. **Key** Perform decompressive laparotomy with temporary closure

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.laparotomy.v1`. Timing profile none.

   **Rationale** Pressure-related organ failure persists after the recorded less invasive measures. Operative release addresses the remaining abdominal constraint.

   **Temptation** Escalate using actual treatment response and current anatomy.

   **Reasonable counterfactual** A sizeable residual accessible fluid pocket with stable physiology might favor another drainage procedure.

   **Clinical claims** `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.pressure-organ-failure`.

2. Place another percutaneous peritoneal drainage catheter

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.drain.v1`. Timing profile none.

   **Rationale** The new map provides little target while organ function deteriorates.

   **Temptation** Repeat the formerly reasonable action without reassessing its result.

   **Reasonable counterfactual** A large residual accessible collection with a pressure contribution could favor another catheter.

   **Clinical claims** `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.operative-decompression`.

3. Begin CRRT with net fluid removal

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.crrt.v1`. Timing profile none.

   **Rationale** Indirect systemic removal cannot substitute for necessary urgent abdominal decompression in this persistent overt course.

   **Temptation** Treat the remaining pressure problem as a total-body volume prescription issue.

   **Reasonable counterfactual** Independent renal-support need with improving abdominal pressure can justify a systemic removal adjustment.

   **Clinical claims** `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.clearance-versus-removal`.

**Explanation** The drainable fluid has largely been removed, yet pressure and organ failures worsen despite the recorded measures. Decompressive laparotomy addresses the persistent abdominal constraint. The previous intervention must be reassessed using its actual result.

**Exact visible-context SHA-256** `d051ba32904d6bc44c806d9ba6e549d8010648cff5b3c111e32a54bbe87cb852`. Archived pre-conversion context.

**Atomic support** `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.clearance-versus-removal`. Exact field mappings remain in the JSON and source ledger.

##### Current clinic record review

**Patient** Leah Morgan, 64 years, Female. Chief complaint — Falling urine output.

**Presentation** In clinic, the founder reviews Leah Morgan's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Leah Morgan, a 64-year-old woman, is in the surgical ICU after laparotomy for bowel perforation. Her abdominal girth increases as urine output falls." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.abdominal-pressure.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.abdominal-pressure.clinic.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.pressure-refractory-decompression.v2`, node `node.topic.critical-renal-organ-support.pressure-refractory-decompression.v2`, concept `concept.critical-renal-organ-support.pressure-refractory-decompression.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1`.

**Objective** Escalate to operative decompression after actual failure of less invasive measures and loss of the drainable fluid target.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Drainage result | The first catheter emptied the central fluid pocket. Repeat ultrasound shows a substantial separate lateral peritoneal pocket with a percutaneous access window and continuing diffuse bowel-wall swelling. |
| Pressure and organ course | Two resting measurements remain 24 and 25 mmHg. Urine output falls as ventilator requirements and vasopressor support increase. |
| Completed measures | Gastric drainage functions. Analgesia and a brief neuromuscular-blockade trial produced no sustained pressure change. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which decompressive intervention should Leah Morgan receive after this incomplete drainage response?

**Preserved clinical task** Which decompressive intervention should Leah Morgan receive after this incomplete drainage response?

**Unkeyed parked alternatives — no answer is correct yet**

1. Perform decompressive laparotomy with temporary closure

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.laparotomy.v2`. Timing profile none.

   **Rationale** Surgical release addresses persistent pressure-associated organ dysfunction after failed measures. Its priority over another targeted catheter in this residual-fluid pattern requires the exact clinical decision.

   **Temptation** Treat the ongoing organ dysfunction as failure of the less invasive strategy.

   **Reasonable counterfactual** Persistent worsening with no meaningful accessible fluid target supports operative decompression.

   **Clinical claims** `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.decompression-after-failed-measures.r2`.

2. Place a catheter in the remaining peritoneal fluid pocket

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.drain.v2`. Timing profile none.

   **Rationale** A remaining accessible component creates a genuine direct-drainage competitor. The retrieved suggestion does not establish how long or in which exact deterioration pattern to repeat drainage before surgery.

   **Temptation** Treat the initial drainage as anatomically incomplete rather than proof that all catheter drainage has failed.

   **Reasonable counterfactual** An accessible residual target with a less urgent organ course can favor targeted additional drainage.

   **Clinical claims** `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.decompression-after-failed-measures.r2`.

3. Begin CRRT with net fluid removal

   **Exact choice** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.crrt.v2`. Timing profile none.

   **Rationale** Renal support can address separate renal indications. Its use does not settle the current direct abdominal-decompression choice.

   **Temptation** Treat the remaining pressure problem as a systemic removal prescription.

   **Reasonable counterfactual** An independently indicated renal-support need with improving abdominal physiology can justify systemic removal.

   **Clinical claims** `claim.critical-renal-organ-support.clearance-versus-removal`, `claim.critical-renal-organ-support.operative-decompression`.

**Explanation** Pressure and organ changes remain concerning after partial drainage. A real residual peritoneal target makes additional catheter drainage and operative decompression compete. The retrieved guidance does not establish one keyed strategy for the exact proposed course. The candidate remains unkeyed pending clinical adjudication.

**Author check 1 — cue attack** Replaced the absent-fluid-target cue with a genuine residual accessible pocket. The three options are named support/decompression plans, and earlier diagnosis feedback no longer disposes of the direct-drainage competitor.

**Author check 2 — stage and category** The choices concern the current decompressive strategy after an actual incomplete response. Two direct procedures remain credible.

**Author check 3 — consequential steps** Interpret repeated pressure, organ changes and the post-drainage anatomical map. Rank another direct catheter against operative release in the current deterioration pattern.

**Author check 4 — difficulty** The harder comparison creates unresolved clinical ranking. The original fair emergency-recognition version remains easy in its reviewed sequence. A moderate label is withheld for the unkeyed attempt.

**Author check 5 — single-best boundary** The decision-critical boundary between an incompletely drained accessible component and failure requiring operative release remains unresolved for this exact organ trajectory. Removing the residual fluid target returns the easy elimination problem identified by review.

**Closest competitor** `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.drain.v2`. An unsupported ranking could delay needed operative decompression or impose avoidable open-abdomen treatment.

**Decision-changing counterfactual** With little accessible fluid remaining and worsening organ dysfunction despite completed measures, the retrieved operative-decompression indication is stronger. A sizeable residual target with stable physiology favors the catheter competitor. Candidate `choice.topic.critical-renal-organ-support.pressure-refractory-decompression.laparotomy.v2`.

**Deletion test** The residual map creates the credible procedural competitor. Repeated pressure and actual organ deterioration preserve urgency. Completed measures preserve what treatment has actually occurred. The prior diagnostic scaffold remains visible and acknowledged.

**Full-sequence attack** The earlier acquisition and drainage definitions are the exact reviewed v1 context. Their diagnostic teaching cannot be undone by a new task alone. The revised remaining-target comparison adds a new decision but lacks a supported unique ranking.

**Revision and repeated author check** One v2 attempt replaced the defeated catheter foil with an actual residual target. Re-solved all three plans. Two direct actions remained defensible under the low-certainty boundary, so the attempt was parked with an empty key.

**Remaining boundary** Melissa must select the clinically supported repeat-catheter versus operative strategy or a different supported discriminator. The parked draft supplies no scored key. Author disposition `PARKED_UNRESOLVED_SINGLE_BEST_ANSWER`.

**Exact visible-context SHA-256** `240597d4fc1dc8616b6dca368ba62e965b68285b2c32494a31be1efbea3a9ce1`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.decompression-after-failed-measures.r2`, `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.clearance-versus-removal`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes `node.topic.critical-renal-organ-support.pressure-acquisition.v1`, `node.topic.critical-renal-organ-support.pressure-fluid-drainage.v1`.

### citrate-metabolic-course — parked

**Park reason** Melissa must choose cessation versus reduced citrate for this exact supported trajectory before a keyed strategy version is authored.

##### Archived before — original reviewed clinical version

Complete item SHA-256 `768c31cd68f7a92fb061855f19e9ab712682745c800b3776cb1bb329d4565b18`. Historical hospital presentation below is an audit snapshot, excluded from executable case definitions.

**Patient** Owen Carter, 71 years, Male. Chief complaint — Dialysis circuit clotting.

**Presentation** Owen Carter, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage.

**Presentation identity** `presentation.topic.critical-renal-organ-support.circuit-anticoagulation.v1`. Finite profiles `profile.topic.critical-renal-organ-support.circuit-anticoagulation.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.citrate-metabolic-course.v1`, node `node.topic.critical-renal-organ-support.citrate-metabolic-course.v1`, concept `concept.critical-renal-organ-support.citrate-metabolic-course.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.v1`.

**Objective** Reduce citrate exposure after a calcium and perfusion trajectory supports accumulation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Interval course | He has received regional citrate CRRT. A new infection is accompanied by increasing vasopressor requirements and lactate. |
| Calcium trend | Total calcium rises from 2.2 to 2.8 mmol/L as systemic ionized calcium falls from 1.10 to 0.80 mmol/L. |
| Current support | The calcium infusion has required repeated increases. Arterial pH falls. Calcium correction and treatment of impaired perfusion continue with every proposed infusion choice. |

**Complete displayed task** Which change should be made to Owen Carter’s citrate infusion now?

**key shown first for review only**

1. **Key** Reduce the citrate infusion rate

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.reduce.v1`. Timing profile none.

   **Rationale** The diverging calcium measurements and increasing replacement needs during impaired perfusion support accumulation. Reduce the citrate load while shared corrective care continues.

   **Temptation** Interpret the calcium relationship before changing the citrate input.

   **Reasonable counterfactual** Intact metabolism with inadequate circuit anticoagulation may support increasing citrate within a protocol.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`.

2. Increase the citrate infusion rate

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.increase.v1`. Timing profile none.

   **Rationale** A greater citrate load may worsen the inferred accumulation.

   **Temptation** Treat falling pH as insufficient citrate-derived base without interpreting the calcium trend.

   **Reasonable counterfactual** Acidosis from inadequate base delivery without evidence of accumulation may require another citrate/base strategy.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`.

3. Maintain the citrate infusion rate

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.maintain.v1`. Timing profile none.

   **Rationale** Replacing calcium leaves the accumulating citrate load unchanged in this observed course.

   **Temptation** Attribute the falling ionized calcium entirely to replacement deficit.

   **Reasonable counterfactual** A verified calcium-delivery problem with preserved perfusion and a stable total-to-ionized relationship may favor maintaining citrate.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`.

**Explanation** Total calcium rises as ionized calcium falls and replacement needs increase during new perfusion impairment. This pattern supports citrate accumulation. Reduce exposure while correcting calcium and circulation, then reassess the metabolic course.

**Exact visible-context SHA-256** `6dfd312d548b50b2429c07abc202a32120a36c0528687bf4198f9092bd471568`. Archived pre-conversion context.

**Atomic support** `claim.critical-renal-organ-support.citrate-monitoring`, `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`. Exact field mappings remain in the JSON and source ledger.

##### Current clinic record review

**Patient** Owen Carter, 71 years, Male. Chief complaint — Dialysis circuit clotting.

**Presentation** In clinic, the founder reviews Owen Carter's outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, "Owen Carter, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage." All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.

**Presentation identity** `presentation.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1`. Finite profiles `profile.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1`.

**Exact identity** Variant `question.topic.critical-renal-organ-support.citrate-metabolic-course.v2`, node `node.topic.critical-renal-organ-support.citrate-metabolic-course.v2`, concept `concept.critical-renal-organ-support.citrate-metabolic-course.v1`, clinical content version `clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1`.

**Objective** Reduce citrate exposure after a calcium and perfusion trajectory supports accumulation.

**Current update** The displayed observations describe the recorded hospital decision point.

| Recorded observation | Value |
|---|---|
| Observed course | During four hours of regional citrate CRRT, MAP falls from 72 to 64 mmHg despite increasing vasopressor support. Lactate rises from 1.8 to 4.0 mmol/L and arterial pH falls from 7.34 to 7.22. |
| Calcium trend | Over the same interval, total calcium rises from 2.2 to 2.8 mmol/L as systemic ionized calcium falls from 1.10 to 0.80 mmol/L. The calcium infusion has required repeated increases. |
| Current renal support | CRRT remains needed for solute control. The preceding anticoagulant-free circuits clotted early during the bleeding-risk course. |
| Shared supportive care | Calcium correction, circulatory treatment and repeated metabolic assessment continue with every proposed circuit strategy. |

**Complete displayed task** During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which CRRT anticoagulation strategy should Owen Carter receive at this reassessment?

**Preserved clinical task** Which CRRT anticoagulation strategy should Owen Carter receive at this reassessment?

**Unkeyed parked alternatives — no answer is correct yet**

1. Run CRRT without citrate anticoagulation

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.no-citrate.v2`. Timing profile none.

   **Rationale** Stopping exposure avoids additional citrate during the accumulating pattern but returns the circuit-patency problem. Its ranking against an immediate reduced-load trial requires clinical adjudication.

   **Temptation** Treat the metabolic course as sufficient reason to cease exposure immediately.

   **Reasonable counterfactual** A clinician-adjudicated intolerable accumulation course may require an anticoagulant-free or alternative strategy.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`, `claim.critical-renal-organ-support.citrate-bleeding`.

2. Run CRRT with a reduced regional citrate load

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.lower-citrate.v2`. Timing profile none.

   **Rationale** The specialist consensus describes reducing citrate load while correcting perfusion. It does not establish that this is sufficient for every exact severe calcium and perfusion trajectory.

   **Temptation** Preserve circuit patency while attempting to correct the accumulating input.

   **Reasonable counterfactual** A clinician-adjudicated course amenable to a closely monitored reduced-load trial may favor this strategy.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`.

3. Continue citrate with increased calcium replacement

   **Exact choice** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.calcium.v2`. Timing profile none.

   **Rationale** The total-to-ionized calcium divergence and increasing replacement need make an isolated calcium-delivery deficit an inadequate explanation of the proposed observations.

   **Temptation** Treat low ionized calcium as a replacement problem without interpreting the total-calcium trend.

   **Reasonable counterfactual** A verified calcium-delivery failure with stable total-to-ionized relationship and preserved perfusion may favor repairing calcium delivery while continuing citrate.

   **Clinical claims** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-monitoring`.

**Explanation** The total-to-ionized calcium relationship rises from 2.0 to 3.5 while ionized calcium falls despite increasing replacement. This supports accumulation during the worsening perfusion course. Stopping exposure and reducing the load are genuine competing strategies. Their exact ranking remains for Melissa, with common calcium and circulatory care continuing.

**Author check 1 — cue attack** Removed the task naming an infusion-rate lever and the reduce/increase/maintain set. Three concrete circuit strategies now compete. Shared supportive care avoids making one option uniquely complete. The calcium relationship distinguishes the replacement-deficit foil but does not rank cessation against load reduction.

**Author check 2 — stage and category** One current CRRT anticoagulation strategy. Each option includes the circuit approach while supportive treatment stays common.

**Author check 3 — consequential steps** Interpret paired calcium changes and escalating replacement during the quantified perfusion/acidemia course. Choose an exposure/circuit strategy after distinguishing accumulation from an isolated calcium-delivery deficit.

**Author check 4 — difficulty** The mechanism is clinically consequential, but a fair keyed moderate/hard strategy item requires adjudication of cessation versus reduction. The original directional key is withheld from the active candidate set.

**Author check 5 — single-best boundary** The quantified four-hour calcium, perfusion and pH course resolves the earlier pace ambiguity but lacks a sourced unique reduction-versus-cessation boundary. Removing the total-calcium course leaves calcium-delivery failure as a credible mechanism. Removing the quantified clinical course recreates the reviewed severity ambiguity.

**Closest competitor** `choice.topic.critical-renal-organ-support.citrate-metabolic-course.lower-citrate.v2`. A reduction-only key may understate the necessary response, while a cessation key may discard a monitored strategy and compromise circuit delivery without a supported ranking.

**Decision-changing counterfactual** With a verified stopped calcium infusion, stable total-to-ionized relationship and preserved perfusion, restoring calcium delivery while continuing citrate becomes reasonable. Candidate `choice.topic.critical-renal-organ-support.citrate-metabolic-course.calcium.v2`.

**Deletion test** The shared interval makes the observations comparable. MAP, lactate and pH provide pace and severity. Both calcium measurements and replacement trend establish the mechanism. Ongoing renal need and prior circuit failure make the exposure strategies genuinely compete.

**Full-sequence attack** The preceding citrate PASS remains exact. Its bleeding/patency teaching supplies no calcium pattern or exposure adjustment. The current candidate restates the necessary earlier circuit result.

**Revision and repeated author check** One v2 attempt added decision-critical pace, moved to complete competing circuit plans and retained common supportive care. The reduction-versus-cessation boundary remained unresolved, so all isCorrect fields and the key are empty and the item is parked.

**Remaining boundary** Melissa must choose cessation versus reduced citrate for this exact supported trajectory before a keyed strategy version is authored. Author disposition `PARKED_UNRESOLVED_CLINICAL_KEY`.

**Exact visible-context SHA-256** `096165b16c1a2682377c8a5421f2cc46a7901dfda55528559971da219a070fd7`. Includes the current clinic framing. The pre-conversion context is archived in the structured packet.

**Atomic support** `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`, `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`. Exact field mappings remain in the JSON and source ledger.

**Selection** `complete_case_only`. Required scored prior nodes `node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1`.

## Review findings and resolution records

### question.topic.critical-renal-organ-support.diuretic-confounded-indices.v1

**Status** `revised`. Exactly one revision attempt. Replaced the easy repeated-treatment item with an assessment decision. This materially changes the scored objective, so the new concept points to the previous concept without transferring history. Checked all assessments against the present stage and solved the stated alternative-course counterfactual.

- **Reviewed clarity issue** The clinical course is understandable, but 'Replacement fell behind' supplies the assessment of the replacement balance rather than the actual intake/loss observations.

- **Reviewed cue** Replacement fell behind. — This authored conclusion directly selects 'Replace losses with isotonic crystalloid'; recognizing the word relationship requires no interpretation of FENa.

- **Reviewed cue** A small monitored crystalloid challenge increased stroke volume and MAP, with clear lungs. — This is legitimate clinical evidence, but combined with resolved oxygen need, near-baseline weight and explicitly under-replaced losses it makes repeating the successful action nearly automatic. Deleting the entire FENa result leaves the same obvious answer.

- **Reviewed fairness note** Controlled crystalloid replacement is the best offered answer. FENa obtained after furosemide cannot independently establish the cause of AKI; a high value does not negate the observed fluid-responsive course. No confident clinical inaccuracy was identified.

- **Reviewed fairness note** The serial case coherently reverses the earlier fluid state, and the current exhibit contains enough of the preceding treatment and response to stand on its own with the header. Prior feedback does not directly teach the FENa answer.

- **Reviewed fairness note** The intended confounded-index judgment is not consequential in this option set. Both the renewed furosemide and immediate CRRT options are weak after the explicit replacement deficit and successful fluid challenge. The item tests a useful reassessment principle, but not two substantial resident-level steps.

- **Reviewed suggestion** Replace the conclusion 'Replacement fell behind' with concise actual intake and loss observations; retain clinically necessary current perfusion and pulmonary findings.

- **Reviewed suggestion** Rebuild the closest competing plan so interpretation of the diuretic-exposed urine result actually changes the decision, rather than adding FENa to an already solved fluid-replacement vignette. Reapply the deletion test to that result.

- **Reviewed suggestion** If retained as a straightforward fluid-state reversal exercise, seek explicit acceptance of its easy educational role rather than calling it a difficult two-step item.

**Current boundary** The revised assessment ranking requires independent review. One directly retrieved expert commentary supports the precise passive-leg-raise technique. The source provides no universal treatment rule from a positive response.

### question.topic.critical-renal-organ-support.pressure-acquisition.v1

**Status** `revised`. Exactly one revision attempt. Aligned the task with the actual evolving findings, replaced the unique quality qualifier with a concrete procedure, and added the supported supine, relaxation, respiratory-phase, instillation-limit and zero-reference method in feedback. Re-solved CT in the counterfactual with already adequate pressure acquisition.

- **Reviewed clarity issue** 'Next renal-support decision' is less specific than the actual question: the immediate investigation of rising abdominal distension, oliguria and ventilator pressure. It can sound like a dialysis-prescription task.

- **Reviewed clarity issue** 'Standardized acquisition' names a quality goal rather than the concrete repeat-measurement procedure. The feedback identifies the faults but does not teach the correct acquisition method.

- **Reviewed cue** Repeat transvesical pressure with standardized acquisition — Only this option carries an explicit quality-assurance qualifier. A test-wise reader can select the standardized redo of the prominently described first measurement without knowing which acquisition features invalidate it.

- **Reviewed fairness note** Repeating the bladder measurement with proper technique is the best offered investigation in this currently blood-pressure-stable patient. Coughing, position and the large instilled volume compromise interpretation; CT or renal ultrasound does not validate the pressure measurement.

- **Reviewed fairness note** The intended two steps are real: recognize acquisition limitations, then prioritize validation over a different diagnostic pathway. The clinical concept is high yield, but the quality qualifier weakens the delivered discrimination.

- **Reviewed fairness note** This first node is self-contained. Its explanation correctly avoids announcing which intervention the later fluid-anatomy findings will select. No confident clinical inaccuracy was identified.

- **Reviewed suggestion** Ask which investigation should be obtained next for the evolving abdominal and organ-function findings.

- **Reviewed suggestion** Replace 'with standardized acquisition' with concise concrete acquisition wording, keeping the other investigation labels comparably specific. Do not simply rename the key 'properly' or 'correctly' performed measurement.

- **Reviewed suggestion** Teach the supported acquisition method after the answer, including positioning, respiratory phase, bladder instillation and zero reference; verify any exact protocol values through the existing clinical-review process rather than inventing them.

**Current boundary** Moderate difficulty is retained after all identified clarity and qualifier issues were addressed. Manager must preserve the v1 context of the passed drainage item and keep this revised branch separate.

### question.topic.critical-renal-organ-support.pressure-refractory-decompression.v1

**Status** `parked`. Exactly one revision attempt. One v2 attempt replaced the defeated catheter foil with an actual residual target. Re-solved all three plans. Two direct actions remained defensible under the low-certainty boundary, so the attempt was parked with an empty key.

- **Reviewed cue** Repeat ultrasound now shows little free peritoneal fluid — Against 'Place another percutaneous peritoneal drainage catheter', this is an explicit absence of the proposed target. It is clinically necessary evidence, but makes that alternative a conspicuously defeated repeat rather than a close next decision.

- **Reviewed cue** Perform decompressive laparotomy with temporary closure — This is the only newly escalated direct intervention after the preceding node already offered the same three strategies, selected drainage and explained the pressure-related organ problem. The sequence plus elimination of further drainage makes the key apparent before substantial new reasoning.

- **Reviewed fairness note** Urgent decompressive laparotomy is the best offered answer for persistent high pressure with anuria, worsening ventilation and increasing pressor need after the stated measures. No confident clinical inaccuracy was identified.

- **Reviewed fairness note** The escalation is coherent and the current exhibit supplies the previous drainage result, unsuccessful measures and current deterioration, so it stands alone with the header. In sequence, however, the earlier explanation has already supplied the pressure-related diagnosis and the need to reassess drainage.

- **Reviewed fairness note** The raw safety findings must stay. The weakness is difficulty: further drainage lacks a target and CRRT is an indirect response to an immediately worsening abdominal constraint. This is a valuable emergency-recognition decision, but the delivered alternatives do not require two consequential independent steps.

- **Reviewed suggestion** Seek explicit acceptance as an easy safety/escalation node if this exact emergency-recognition purpose is desired.

- **Reviewed suggestion** If moderate/hard resident reasoning remains required, rebuild the decision around a real remaining clinical competitor whose eligibility is resolved by the current observations. Do not manufacture uncertainty by hiding the organ deterioration or failed measures.

- **Reviewed suggestion** Re-review the whole three-node sequence after revision; changing only this task wording will not undo the earlier diagnostic scaffold.

**Current boundary** Melissa must select the clinically supported repeat-catheter versus operative strategy or a different supported discriminator. The parked draft supplies no scored key.

### question.topic.critical-renal-organ-support.citrate-metabolic-course.v1

**Status** `parked`. Exactly one revision attempt. One v2 attempt added decision-critical pace, moved to complete competing circuit plans and retained common supportive care. The reduction-versus-cessation boundary remained unresolved, so all isCorrect fields and the key are empty and the item is parked.

- **Reviewed clarity issue** 'Arterial pH falls' and 'increasing vasopressor requirements and lactate' establish direction but not the severity or pace of the new deterioration. That matters if the intended distinction is reducing citrate versus stopping its exposure.

- **Reviewed clarity issue** The task confines the answer to changing 'citrate infusion' and offers only three directions, so it does not test a complete response to the potentially serious complication.

- **Reviewed cue** Which change should be made to Owen Carter’s citrate infusion now? — After an adverse metabolic course, the task names the suspected treatment lever. With only 'Reduce', 'Increase' and 'Maintain' that infusion, a reader can favor reducing the implicated treatment without working through the calcium relationship.

- **Reviewed cue** Reduce the citrate infusion rate / Increase the citrate infusion rate / Maintain the citrate infusion rate — This directional option set supplies no strong competing mechanism or management strategy. Recognizing an adverse effect and reducing its named exposure is a recall chain, not two consequential clinical decisions.

- **Reviewed fairness note** The total-to-ionized calcium ratio rises from 2.0 to 3.5, with falling ionized calcium despite escalating replacement and worsening perfusion/acidemia. This supports citrate accumulation rather than merely an isolated calcium replacement deficit.

- **Reviewed fairness note** Reducing citrate exposure is directionally defensible, and no confident clinical falsehood is asserted here. However, the severe supplied calcium abnormality and worsening course make cessation a clinically important alternative that is not offered. Offline review cannot establish whether a reduction-only infusion plan is sufficient for this exact trajectory; that boundary requires clinical review rather than an invented cutoff.

- **Reviewed fairness note** The second node follows the earlier citrate choice coherently and restates treatment, new infection and the relevant laboratory course. It stands alone with the header; prior feedback mentions monitoring but does not reveal accumulation or the specific response. The shared continuation of calcium/perfusion treatment is useful and avoids a uniquely comprehensive key.

- **Reviewed suggestion** Ask for a concrete next CRRT/anticoagulation strategy, with parallel competing plans representing accumulation, inadequate calcium replacement or another genuinely plausible interpretation; keep shared supportive care in the stem.

- **Reviewed suggestion** Have Melissa resolve whether reducing or stopping citrate is the best action for the exact supported severity and trajectory. Supply the decision-critical clinical information and avoid implying that merely reducing the rate is always sufficient.

- **Reviewed suggestion** Make interpretation of the total-versus-ionized calcium relationship necessary to distinguish the competing plans, and explain that relationship after the answer without inventing a universal treatment threshold.

**Current boundary** Melissa must choose cessation versus reduced citrate for this exact supported trajectory before a keyed strategy version is authored.

### question.topic.critical-renal-organ-support.trial-off-crrt.v1

**Status** `revised`. Exactly one revision attempt. Repaired the timeline and the elaborated-key cue in one version. Re-solved the unchanged physiological key and the restart counterfactual after moving surveillance into shared care.

- **Reviewed clarity issue** The task says 'now at the end of this CRRT circuit', but the exhibit says 'The circuit has been stopped for eight hours'. The decision is at reassessment during an interruption, not at circuit completion.

- **Reviewed cue** Continue the interruption with chemistry and balance monitoring — Only the key expressly includes surveillance and is appreciably more elaborated than either dialysis alternative. Its distinctive caution and the exhibit's 'Actual interruption' wording create an avoidable test-taking advantage, although physiology is still needed for a confident answer.

- **Reviewed fairness note** Continuing a monitored trial off treatment is the best offered plan given spontaneous urine, current off-treatment metabolic control, matched balance and stable support needs. The rise from an on-circuit creatinine value is not by itself proof that replacement must restart.

- **Reviewed fairness note** The two consequential steps are to interpret creatinine after extracorporeal clearance ends, then judge current endogenous control and choose a monitored trial rather than automatic resumption or modality substitution. This is high-yield practical renal-support reasoning.

- **Reviewed fairness note** The case stands alone and the clinical course is otherwise coherent. Neither eight hours off therapy nor the stated daily urine volume establishes a universal liberation threshold; the explanation appropriately rests on the combined current observations. No confident clinical inaccuracy was identified.

- **Reviewed suggestion** Change the task to ask which kidney-support plan she should receive at this reassessment after CRRT interruption.

- **Reviewed suggestion** Put ongoing chemistry, fluid-balance and clinical monitoring in shared context, then compare similarly brief support plans. Preserve that stopping therapy is a monitored trial, not a declaration of completed recovery.

- **Reviewed suggestion** Keep both the on-circuit/off-circuit creatinine comparison and actual off-treatment observations; they supply the useful reasoning and should not be replaced by a 'kidneys have recovered' label.

**Current boundary** All identified clarity and surveillance-wording issues are addressed. Exact clinical review and independent re-review remain pending.

## Concept identity and historical definitions

The revised pressure-acquisition and recovery items retain their concept IDs and receive v2 question/node IDs. The rebuilt oliguria item scores a different assessment decision, so it receives `concept.critical-renal-organ-support.oliguria-volume-response-assessment.v1` with previous concept `concept.critical-renal-organ-support.diuretic-confounded-indices.v1`. History migration is `null`.

All eleven reviewed item definitions, all five original case proposals, old question/node exports, timing/order records and the complete prior source ledger are retained under `reviewRound`. Six PASS definitions retain their exact question version and context. The two parked current comparisons contribute no executable key.

## Ranked coverage and remaining gaps

| Rank | Concept | Current status | Exact candidate |
|---|---|---|---|
| 1 | Escalate renal fluid removal when progressive major hypoxemia persists despite actual diuretic treatment. | `pass-preserved` | `question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1` |
| 2 | Choose decongestion when postoperative oliguria accompanies fluid accumulation and absent response to further volume. | `pass-preserved` | `question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1` |
| 3 | Assess current need for replacement using actual treatment response despite a severe creatinine rise. | `pass-preserved` | `question.topic.critical-renal-organ-support.rrt-treatment-response.v1` |
| 4 | Adjust net removal separately from needed solute support when current circulation indicates intolerance of ultrafiltration. | `pass-preserved` | `question.topic.critical-renal-organ-support.uf-clearance-separation.v1` |
| 5 | Validate compromised pressure acquisition before choosing abdominal decompressive escalation. | `revised` | `question.topic.critical-renal-organ-support.pressure-acquisition.v2` |
| 6 | Use fluid anatomy to select an initial decompressive route after valid pressure-associated organ deterioration. | `pass-preserved` | `question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1` |
| 7 | Choose a circuit anticoagulation strategy when repeated clotting and recent hemorrhage compete. | `pass-preserved` | `question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1` |
| 8 | Choose a monitored interruption when actual off-treatment control and spontaneous urine support recovery despite residual creatinine elevation. | `revised` | `question.topic.critical-renal-organ-support.trial-off-crrt.v2` |
| 9 | Select a current volume-response assessment when recurrent postoperative oliguria follows measured losses while pulmonary fluid findings persist. | `revised_new_meaning` | `question.topic.critical-renal-organ-support.diuretic-confounded-indices.v2` |

- **new_unkeyed_slot** Select gradual solute clearance when acute cerebral and circulatory vulnerability changes the safety of a renal-support prescription. The candidate contrast between standard-dose continuous treatment and two high-intensity labels risked answer selection by qualifier. Current guidance supports low-clearance methods and does not establish a universal CRRT ranking over every adapted intermittent or hybrid prescription. A fair three-choice set needs a supported patient-specific discriminator.

- **remaining_gap** Active urinary sediment and specialist tissue assessment after postoperative kidney injury. A management-specific guideline and adequate biopsy-safety context are needed for a difficult fair action item.

- **withheld_quantitative_teaching_point** Prescribed versus delivered CRRT dose before intensity escalation. Current maximum-prescription language and older individualized/delivered-dose framing require a clinician-selected numerical teaching boundary.

- **remaining_gap** Kidney-health follow-up after persistent postoperative dysfunction. Exact earlier follow-up and medication-restart actions need a current targeted source beyond the retrieved older recommendation.

- **remaining_gap** Pigment-associated, interstitial and obstructive mechanisms of ICU kidney injury. Mechanism-specific action and near-miss support need further permitted-source research. Retention and access-construction questions retain their topic owners.

- **parked_after_independent_review** Escalate to operative decompression after actual failure of less invasive measures and loss of the drainable fluid target. Melissa must select the clinically supported repeat-catheter versus operative strategy or a different supported discriminator. The parked draft supplies no scored key.

- **parked_after_independent_review** Reduce citrate exposure after a calcium and perfusion trajectory supports accumulation. Melissa must choose cessation versus reduced citrate for this exact supported trajectory before a keyed strategy version is authored.

## Clinical claims and source provenance

The current ledger contains 31 atomic claims and 12 source records. All original claim statements and verification dates remain exact. New claims identify additional physiological or guideline checks. Source-to-claim, current-question, parked-candidate and field-level mappings are separate. The reviewed original mappings remain in `reviewRound.reviewedSourceLedger`.

- `claim.critical-renal-organ-support.volume-context` — Oliguria requires assessment of current perfusion, losses and accumulated fluid before choosing further volume treatment. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Urine volume by itself does not establish hypovolemia. Sources `src.critical-renal-organ-support.esicm-2017`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.diuretic-congestion` — Loop diuretics can address volume overload during AKI when a response remains achievable. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — A diuretic response does not establish repair of renal tissue. Reassess the actual response. Sources `src.critical-renal-organ-support.esicm-2017`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.fluid-excess` — Further fluid loading can worsen renal and systemic congestion when expansion is no longer needed. Category `safety_boundary`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Edema can coexist with intravascular depletion. Current perfusion assessment governs. Sources `src.critical-renal-organ-support.esicm-2017`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.urine-indices` — Recent diuretic exposure can limit the ability of fractional sodium excretion to distinguish reduced perfusion from intrinsic renal injury. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — A high result does not independently exclude a volume-responsive component. No universal cutoff is taught. Sources `src.critical-renal-organ-support.aki-workup-2016`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.kidney-assessment` — Creatinine and urine-output trajectories should be integrated with the clinical course when assessing AKI. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Creatinine lags changes in filtration and is affected by fluid distribution and treatment clearance. Sources `src.critical-renal-organ-support.japanese-aki-2018`, `src.critical-renal-organ-support.aki-workup-2016`.

- `claim.critical-renal-organ-support.rrt-context` — Kidney-replacement initiation depends on current complications and treatment response rather than an isolated creatinine result. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Deferral requires close surveillance. This claim supplies no universal waiting period. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.rrt-pulmonary` — AKI-associated pulmonary fluid accumulation with continuing major hypoxemia despite adequate medical treatment supports urgent kidney replacement. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — The current pulmonary-edema recommendation is panel opinion with low-certainty evidence. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.uf-hypovolemia` — Net ultrafiltration should be interrupted when treatment-associated findings indicate intravascular hypovolemia. Category `management`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Only one adequately retrieved current guideline directly supports this action. It is panel opinion and supplies no fixed MAP or removal target. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`.

- `claim.critical-renal-organ-support.clearance-versus-removal` — Solute clearance and net fluid removal can be adjusted separately during continuous kidney replacement. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — A functioning circuit and continued bedside reassessment are required. Persistent severe instability can require wider interruption. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.pressure-technique` — Transvesical pressure assessment uses relaxed supine end-expiratory acquisition, a midaxillary reference and at most 25 mL instillation. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Both sources are the same consensus lineage and count as one publication. Acquisition errors can distort a reading. Sources `src.critical-renal-organ-support.wsacs-2013`, `src.critical-renal-organ-support.wsacs-summary-2021`.

- `claim.critical-renal-organ-support.pressure-organ-failure` — Sustained intra-abdominal pressure above 20 mmHg with new organ dysfunction meets the adult abdominal compartment syndrome definition. Category `definition`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — A flawed acquisition or pressure elevation without new dysfunction is insufficient. Sources `src.critical-renal-organ-support.wsacs-2013`, `src.critical-renal-organ-support.wsacs-summary-2021`, `src.critical-renal-organ-support.aki-workup-2016`.

- `claim.critical-renal-organ-support.peritoneal-drainage` — Accessible intraperitoneal fluid contributing to pressure-related organ dysfunction can be treated initially with percutaneous catheter drainage. Category `management`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Single society guideline. Preference over immediate laparotomy is a GRADE 2D suggestion. Prompt reassessment is necessary. Sources `src.critical-renal-organ-support.wsacs-2013`.

- `claim.critical-renal-organ-support.operative-decompression` — Persistent overt abdominal compartment syndrome after failed less invasive measures warrants decompressive laparotomy. Category `management`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Single society guideline with a strong recommendation supported by low-quality evidence. No mandatory waiting interval is asserted. Sources `src.critical-renal-organ-support.wsacs-2013`.

- `claim.critical-renal-organ-support.citrate-bleeding` — Regional citrate can extend CRRT circuit life in adults at high bleeding risk when citrate use is appropriate. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — The preference over no anticoagulation is conditional. Systemic anticoagulation needs and metabolic risk alter the decision. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.citrate-consensus-2023`.

- `claim.critical-renal-organ-support.citrate-monitoring` — Citrate anticoagulation requires monitoring of systemic ionized calcium and metabolic changes. Category `safety_boundary`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — No universal infusion recipe or monitoring interval is authored. Sources `src.critical-renal-organ-support.citrate-consensus-2023`, `src.critical-renal-organ-support.srlf-gfrup-2025`.

- `claim.critical-renal-organ-support.citrate-accumulation` — A rising total-to-ionized calcium relationship with falling ionized calcium and rising calcium-replacement needs supports citrate accumulation. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — This is an indirect marker. The course and other causes of calcium disturbance remain relevant. No absolute cutoff is taught. Sources `src.critical-renal-organ-support.citrate-consensus-2023`, `src.critical-renal-organ-support.srlf-gfrup-2025`.

- `claim.critical-renal-organ-support.citrate-response` — Suspected citrate accumulation warrants reducing citrate load while correcting impaired perfusion and calcium disturbance. Category `management`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Only one retrieved specialist consensus directly supports this adjustment. Change strategy if measures fail. No fixed infusion change is specified. Sources `src.critical-renal-organ-support.citrate-consensus-2023`.

- `claim.critical-renal-organ-support.rrt-weaning` — A monitored trial off CRRT can be considered when spontaneous urine output and current metabolic and volume needs suggest sufficient kidney support. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — There is no universal successful-weaning urine cutoff. Reassess and restart if needed. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.creatinine-on-circuit` — A low creatinine during CRRT can reflect treatment removal and does not establish independent kidney recovery. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — One guideline explicitly explains production, native elimination and treatment removal. Use the observed interruption course. Sources `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.slow-clearance-neuro` — Intracranial pressure risk may require a low-clearance kidney-replacement approach to limit rapid osmotic shifts. Category `safety_boundary`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Current panel opinion. CRRT is one approach. No mortality superiority over every intermittent or hybrid prescription is claimed. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.dose-outcome` — Routine high-intensity CRRT has not established better general adult AKI survival or kidney recovery. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Prescribed and delivered dose differ. Optimal or maximum dose framing differs between sources. A universal numerical dose-ranking item is withheld. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.sediment-scope` — Dysmorphic red cells or red-cell casts in a suitable urine sample support glomerular disease as an AKI mechanism. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — One diagnostic review. A remaining research gap with no scored draft. Sources `src.critical-renal-organ-support.aki-workup-2016`.

- `claim.critical-renal-organ-support.aki-followup` — AKI survivors warrant kidney-health follow-up according to residual dysfunction and course. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Older guidance suggests approximately three-month reassessment. Exact earlier postoperative choices need a current targeted source. Sources `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.diuretic-alternatives` — A thiazide can augment loop-diuretic treatment when congestion persists with loop resistance. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Combination therapy is a credible competing strategy. It does not override the urgent RRT indication established by refractory major hypoxemia. No dose is prescribed. Sources `src.critical-renal-organ-support.diuretic-pharmacology-2025`, `src.critical-renal-organ-support.diuretic-congestion-2022`.

- `claim.critical-renal-organ-support.loop-agent-route` — Loop agents and their administration routes differ in pharmacokinetics, which can affect the diuretic response. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — An agent or route change is a credible nonurgent consideration. No universal superiority or dose conversion is taught. Sources `src.critical-renal-organ-support.diuretic-pharmacology-2025`, `src.critical-renal-organ-support.diuretic-congestion-2022`.

- `claim.critical-renal-organ-support.furosemide-prognosis` — Furosemide response testing can inform AKI progression assessment. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — This prognostic role does not replace complication- and response-based assessment for current kidney replacement. Sources `src.critical-renal-organ-support.esicm-2017`, `src.critical-renal-organ-support.diuretic-pharmacology-2025`.

- `claim.critical-renal-organ-support.stable-rrt-modality` — Hemodynamically stable adults with an ongoing replacement need may receive either continuous or intermittent kidney support. Category `management`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Modality conversion does not establish that replacement remains necessary. Current requirements and local expertise govern. Sources `src.critical-renal-organ-support.srlf-gfrup-2025`, `src.critical-renal-organ-support.japanese-aki-2018`.

- `claim.critical-renal-organ-support.plr-output-assessment.r2` — A reversible passive leg raise assessed by a direct cardiac-output or stroke-volume measurement can inform whether volume expansion would increase output. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — One directly retrieved physiological commentary supports the exact assessment. Blood-pressure change by itself is an inadequate substitute for measured output. No numerical response cutoff is authored. Sources `src.critical-renal-organ-support.passive-leg-raise-2015`.

- `claim.critical-renal-organ-support.plr-treatment-boundary.r2` — A preload-response result requires interpretation alongside perfusion need and the risk of worsening pulmonary fluid accumulation. Category `safety_boundary`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — A positive response does not establish a universal instruction to give fluid. The revised item selects an assessment and prescribes no resulting bolus. Sources `src.critical-renal-organ-support.passive-leg-raise-2015`.

- `claim.critical-renal-organ-support.decompression-after-failed-measures.r2` — Persistent abdominal compartment physiology after failed nonoperative measures can require surgical decompression assessed with repeated reliable pressure observations. Category `management`, certainty `low`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — The sources do not establish a single repeat-drainage versus operation ranking for every residual accessible-fluid pattern. That comparison remains parked for the exact candidate. Sources `src.critical-renal-organ-support.wses-open-abdomen-2018`, `src.critical-renal-organ-support.wsacs-2013`.

- `claim.critical-renal-organ-support.urine-solute-indices-limits.r2` — Fractional urinary sodium or urea measurements have limited ability to independently distinguish functional perfusion-related AKI from intrinsic injury. Category `evaluation`, certainty `moderate`, checked 2026-11-11, clinical state `needs_clinician_review`. Limitation — Interpret indices with medications, hemodynamics, urine findings and course. The revised item uses FEUrea as a plausible competing assessment and teaches no cutoff. Sources `src.critical-renal-organ-support.aki-workup-2016`, `src.critical-renal-organ-support.japanese-aki-2018`.

### Source records and rights

**`src.critical-renal-organ-support.srlf-gfrup-2025`** Jourdain M, Gragueb Chatti I, Housni B, et al. Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference. Ann Intensive Care. 2025;15:100. doi:10.1186/s13613-025-01517-0.

Organization/journal — Annals of Intensive Care / SRLF and GFRUP. Authors — Mercè Jourdain, Ines Gragueb Chatti, Brahim Housni, Pierre Jaquet, Mélissa Jezequel, Oumar Kane, Béatrice La Combe, Mickael Landais, Mehdi Marzouk, Etienne de Montmollin, Guillaume Mortamet, Mai-Anh Nay, Charlotte Salmon-Gandonnière, Sophie Perinel-Ragey, Jérôme Rambaud, Joanna Schmitt, Marie Simon, Julie Starck, Arnaud W. Thille, Pierre-François Dequin.   Publication year 2025. DOI `10.1186/s13613-025-01517-0`. Accessed 2026-11-11. Source class `peer_reviewed_guideline`, intended use `both`.

Authority — Current multisociety adult/pediatric ICU consensus using GRADE. Adult recommendations are used. Several bedside actions rely on low-certainty panel opinion. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — Sections 1, 2, 4 and 5. Recommendations 1.1C, 1.1E, 1.2, 3.1, 4.4, 4.5, 6.2 and 7.2. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.uf-hypovolemia`, `claim.critical-renal-organ-support.clearance-versus-removal`, `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`, `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.slow-clearance-neuro`, `claim.critical-renal-organ-support.dose-outcome`, `claim.critical-renal-organ-support.stable-rrt-modality`.

<a href="https://link.springer.com/article/10.1186/s13613-025-01517-0" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference</a>

**`src.critical-renal-organ-support.wsacs-2013`** Kirkpatrick AW, Roberts DJ, De Waele J, et al. Intra-abdominal hypertension and the abdominal compartment syndrome: updated consensus definitions and clinical practice guidelines from the World Society of the Abdominal Compartment Syndrome. Intensive Care Med. 2013;39:1190–1206. doi:10.1007/s00134-013-2906-z.

Organization/journal — Intensive Care Medicine / WSACS. Authors — Andrew W. Kirkpatrick, Derek J. Roberts, Jan J. De Waele. First three authors in standard et al. citation. Complete author list is available at the DOI.  Publication year 2013. DOI `10.1007/s00134-013-2906-z`. Accessed 2026-11-11. Source class `professional_society_guideline`, intended use `both`.

Authority — Society consensus on measurement and decompression. Percutaneous-first ranking is a GRADE 2D suggestion. Overt compartment decompression is a strong recommendation with low-quality support. Rights — Creative Commons Attribution Noncommercial License as displayed by publisher, reuse status `copyrighted_targeted_verification_only`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. Noncommercial restrictions are preserved. No commercial adaptation of source expression is authorized.

Verification — IAP measurement section, management suggestion 8 and recommendation 5. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.peritoneal-drainage`, `claim.critical-renal-organ-support.operative-decompression`, `claim.critical-renal-organ-support.decompression-after-failed-measures.r2`.

<a href="https://link.springer.com/article/10.1007/s00134-013-2906-z" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Intra-abdominal hypertension and abdominal compartment syndrome — WSACS consensus, 2013</a>

**`src.critical-renal-organ-support.wsacs-summary-2021`** World Society of the Abdominal Compartment Syndrome. WSACS Consensus Guidelines Summary. Official society education page. Published and modified April 7, 2021. Accessed November 11, 2026.

Organization/journal — World Society of the Abdominal Compartment Syndrome. Authors — World Society of the Abdominal Compartment Syndrome.   Publication year 2021. DOI `none`. Accessed 2026-11-11. Source class `professional_society_guideline`, intended use `cross_check`.

Authority — Official targeted cross-check for definitions. This is the same consensus lineage. Older management statements on this page do not override the 2013 article. Rights — All rights reserved under WSACS website disclaimer, reuse status `copyrighted_targeted_verification_only`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — Definitions 4, 5, 7 and 9. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.pressure-technique`, `claim.critical-renal-organ-support.pressure-organ-failure`.

<a href="https://www.wsacs.org/education/436/wsacs-consensus-guidelines-summary/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">WSACS Consensus Guidelines Summary</a>

**`src.critical-renal-organ-support.esicm-2017`** Joannidis M, Druml W, Forni LG, et al. Prevention of acute kidney injury and protection of renal function in the intensive care unit: update 2017. Expert opinion of the Working Group on Prevention, AKI section, European Society of Intensive Care Medicine. Intensive Care Med. 2017;43:730–749. doi:10.1007/s00134-017-4832-y.

Organization/journal — Intensive Care Medicine / ESICM. Authors — Michael Joannidis, Wilfred Druml, Lui G. Forni, A. B. Johan Groeneveld, Patrick M. Honoré, Eric Hoste, Marlies Ostermann, Heleen M. Oudemans-van Straaten, Miet Schetz.   Publication year 2017. DOI `10.1007/s00134-017-4832-y`. Accessed 2026-11-11. Source class `professional_society_guideline`, intended use `both`.

Authority — ESICM expert opinion with GRADE review through March 2017. Supports targeted volume and diuretic principles. Current RRT guidance governs RRT decisions. Rights — CC BY-NC 4.0, reuse status `cc_by_nc_4_0_restricted`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. Noncommercial restrictions are preserved. No commercial adaptation of source expression is authorized.

Verification — Volume expansion and diuretics sections. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.furosemide-prognosis`.

<a href="https://link.springer.com/article/10.1007/s00134-017-4832-y" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Prevention of acute kidney injury and protection of renal function in the ICU — update 2017</a>

**`src.critical-renal-organ-support.japanese-aki-2018`** Doi K, Nishida O, Shigematsu T, et al., Japanese Clinical Practice Guideline for Acute Kidney Injury 2016 Committee. The Japanese Clinical Practice Guideline for acute kidney injury 2016. J Intensive Care. 2018;6:48. doi:10.1186/s40560-018-0308-6.

Organization/journal — Journal of Intensive Care / Japanese multidisciplinary AKI committee. Authors — Kent Doi, Osamu Nishida, Takashi Shigematsu, Tomohito Sadahiro, Noritomo Itami, Kunitoshi Iseki, Yukio Yuzawa, Hirokazu Okada, Daisuke Koya, Hideyasu Kiyomoto, Yugo Shibagaki, Kenichi Matsuda, Akihiko Kato, Terumasa Hayashi, Tomonari Ogawa, Tatsuo Tsukamoto, Eisei Noiri, Shigeo Negi, Koichi Kamei, Hirotsugu Kitayama, Naoki Kashihara, Toshiki Moriyama, Yoshio Terada, Japanese Clinical Practice Guideline for Acute Kidney Injury 2016 Committee.   Publication year 2018. DOI `10.1186/s40560-018-0308-6`. Accessed 2026-11-11. Source class `peer_reviewed_guideline`, intended use `both`.

Authority — Multisociety guideline based mainly on evidence through 2015–2016. Co-publications count once. Regional dose and anticoagulation practice is not universalized. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — CQ2, CQ4-3, CQ5-3, CQ7-1 to CQ7-4 and CQ8. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.volume-context`, `claim.critical-renal-organ-support.diuretic-congestion`, `claim.critical-renal-organ-support.fluid-excess`, `claim.critical-renal-organ-support.urine-indices`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.rrt-context`, `claim.critical-renal-organ-support.rrt-pulmonary`, `claim.critical-renal-organ-support.clearance-versus-removal`, `claim.critical-renal-organ-support.rrt-weaning`, `claim.critical-renal-organ-support.creatinine-on-circuit`, `claim.critical-renal-organ-support.slow-clearance-neuro`, `claim.critical-renal-organ-support.dose-outcome`, `claim.critical-renal-organ-support.aki-followup`, `claim.critical-renal-organ-support.stable-rrt-modality`, `claim.critical-renal-organ-support.urine-solute-indices-limits.r2`.

<a href="https://link.springer.com/article/10.1186/s40560-018-0308-6" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">The Japanese Clinical Practice Guideline for acute kidney injury 2016</a>

**`src.critical-renal-organ-support.aki-workup-2016`** Ostermann M, Joannidis M. Acute kidney injury 2016: diagnosis and diagnostic workup. Crit Care. 2016;20:299. doi:10.1186/s13054-016-1478-z.

Organization/journal — Critical Care. Authors — Marlies Ostermann, Michael Joannidis.   Publication year 2016. DOI `10.1186/s13054-016-1478-z`. Accessed 2026-11-11. Source class `narrative_review`, intended use `both`.

Authority — Diagnostic review addressing limitations of urinary indices and creatinine. Supplies diagnostic physiology, with separate current guidance for management. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — Urine microscopy, urinary electrolytes, ultrasound, creatinine limitations and biopsy. No claim uses the review’s quotation of NICE. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.urine-indices`, `claim.critical-renal-organ-support.kidney-assessment`, `claim.critical-renal-organ-support.pressure-organ-failure`, `claim.critical-renal-organ-support.sediment-scope`, `claim.critical-renal-organ-support.urine-solute-indices-limits.r2`.

<a href="https://link.springer.com/article/10.1186/s13054-016-1478-z" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Acute kidney injury 2016: diagnosis and diagnostic workup</a>

**`src.critical-renal-organ-support.citrate-consensus-2023`** Liu SY, Xu SY, Yin L, et al. Management of regional citrate anticoagulation for continuous renal replacement therapy: guideline recommendations from Chinese emergency medical doctor consensus. Mil Med Res. 2023;10:23. doi:10.1186/s40779-023-00457-9.

Organization/journal — Military Medical Research / Emergency Medical Doctor Branch, Chinese Medical Doctor Association. Authors — Shu-Yuan Liu, Sheng-Yong Xu, Lu Yin. First three authors in standard et al. citation. Complete author list is available at the DOI.  Publication year 2023. DOI `10.1186/s40779-023-00457-9`. Accessed 2026-11-11. Source class `professional_society_guideline`, intended use `both`.

Authority — Specialist consensus on citrate monitoring and adverse effects. Some recommendations have low-certainty support and region-specific fluid formulations. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — Recommendations 9–12 and the citrate-accumulation discussion. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.citrate-bleeding`, `claim.critical-renal-organ-support.citrate-monitoring`, `claim.critical-renal-organ-support.citrate-accumulation`, `claim.critical-renal-organ-support.citrate-response`.

<a href="https://link.springer.com/article/10.1186/s40779-023-00457-9" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus</a>

**`src.critical-renal-organ-support.kdigo-status-2026`** Kidney Disease: Improving Global Outcomes. Acute Kidney Injury (AKI) and Acute Kidney Disease (AKD). Official guideline-status page. Accessed November 11, 2026.

Organization/journal — Kidney Disease: Improving Global Outcomes. Authors — KDIGO.  Undated official status page, accessed 2026-11-11, describing the 2026 public-review draft. Publication year undated. DOI `none`. Accessed 2026-11-11. Source class `bibliographic_metadata`, intended use `cross_check`.

Authority — Official publication-status source. The page describes a public-review draft under preparation for publication. Draft recommendations supply no scored-key support. Rights — Copyright KDIGO, status metadata only, reuse status `metadata_only_rights_reserved`. Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. 

Verification — Guideline Update paragraph only. Terms/rights checked 2026-11-11.  Supported claims .

<a href="https://kdigo.org/guidelines/acute-kidney-injury/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">KDIGO AKI/AKD guideline update status</a>

**`src.critical-renal-organ-support.diuretic-pharmacology-2025`** Ferrari F, Zanza C, Tesauro M, et al. Clinical Pharmacology of Loop Diuretics in Critical Care. Clin Pharmacokinet. 2025;64:987–997. doi:10.1007/s40262-025-01524-1.

Organization/journal — Clinical Pharmacokinetics. Authors — Fiorenza Ferrari, Christian Zanza, Manfredi Tesauro, Yaroslava Longhitano, Raymond Planinsic, Antonio Voza, Jacopo Fumagalli, Vittorio Scaravilli, Giacomo Grasselli.   Publication year 2025. DOI `10.1007/s40262-025-01524-1`. Accessed 2026-11-11. Source class `narrative_review`, intended use `both`.

Authority — Current pharmacology review. Supports credibility of medication and prognostic-testing alternatives. It does not establish an optimal urgent RRT timing rule. Rights — CC BY-NC 4.0, reuse status `cc_by_nc_4_0_restricted`. Independent factual synthesis with attribution. Noncommercial restrictions apply to source expression. No source dose table, figure or prose is reproduced.

Verification — Introduction and sections 3.2–3.4. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.loop-agent-route`, `claim.critical-renal-organ-support.furosemide-prognosis`.

<a href="https://link.springer.com/article/10.1007/s40262-025-01524-1" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Clinical Pharmacology of Loop Diuretics in Critical Care</a>

**`src.critical-renal-organ-support.diuretic-congestion-2022`** Escudero VJ, Mercadal J, Molina-Andújar A, Piñeiro GJ, Cucchiari D, Jacas A, Carramiñana A, Poch E. New Insights Into Diuretic Use to Treat Congestion in the ICU: Beyond Furosemide. Front Nephrol. 2022;2:879766. doi:10.3389/fneph.2022.879766.

Organization/journal — Frontiers in Nephrology. Authors — V. J. Escudero, J. Mercadal, A. Molina-Andújar, G. J. Piñeiro, D. Cucchiari, A. Jacas, A. Carramiñana, E. Poch.   Publication year 2022. DOI `10.3389/fneph.2022.879766`. Accessed 2026-11-11. Source class `narrative_review`, intended use `both`.

Authority — Peer-reviewed ICU pharmacology review. Supports named thiazide/loop alternatives and the limits of pharmacologic attempts. Urgent RRT ranking is supported separately. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Original factual synthesis with full attribution and licence link. No source table, algorithm, dose, figure or wording is reproduced.

Verification — Loop Diuretics and Distal Convoluted Tubule Diuretics, Potential ICU Indications. Terms/rights checked 2026-11-11. The public terms endpoint returned only a copyright footer. The article-specific CC BY grant was accessible and verified. No separate AI prohibition was observed in the retrieved article material. Supported claims `claim.critical-renal-organ-support.diuretic-alternatives`, `claim.critical-renal-organ-support.loop-agent-route`.

<a href="https://www.frontiersin.org/journals/nephrology/articles/10.3389/fneph.2022.879766/full" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">New Insights Into Diuretic Use to Treat Congestion in the ICU: Beyond Furosemide</a>

**`src.critical-renal-organ-support.passive-leg-raise-2015`** Monnet X, Teboul JL. Passive leg raising: five rules, not a drop of fluid! Crit Care. 2015;19:18. doi:10.1186/s13054-014-0708-5.

Organization/journal — Critical Care. Authors — Xavier Monnet, Jean-Louis Teboul.  PubMed records 2015-01-14 electronic publication. The current publisher page displays 2015-12-01. The publication year and DOI agree. Publication year 2015. DOI `10.1186/s13054-014-0708-5`. Accessed 2026-11-11. Source class `narrative_review`, intended use `both`.

Authority — Expert physiological editorial. It supports dynamic cardiac-output assessment and its limitations. It supplies no calibrated guarantee of benefit from a positive test. Authors disclose medical-device advisory roles. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted independent factual synthesis from an editorial commentary. Article prose, figures, rule lists and protocol diagrams are excluded. Attribution and licence link retained.

Verification — Text on direct output measurement, reversible preload challenge and the limits of applying a positive response. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.plr-output-assessment.r2`, `claim.critical-renal-organ-support.plr-treatment-boundary.r2`.

<a href="https://link.springer.com/article/10.1186/s13054-014-0708-5" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Passive leg raising — physiological assessment of volume responsiveness</a>

**`src.critical-renal-organ-support.wses-open-abdomen-2018`** Coccolini F, Roberts D, Ansaloni L, et al. The open abdomen in trauma and non-trauma patients: WSES guidelines. World J Emerg Surg. 2018;13:7. doi:10.1186/s13017-018-0167-4.

Organization/journal — World Journal of Emergency Surgery / World Society of Emergency Surgery. Authors — Federico Coccolini, Derek Roberts, Luca Ansaloni. First three named authors in the complete et al. citation. The official DOI page carries the full author list.  Publication year 2018. DOI `10.1186/s13017-018-0167-4`. Accessed 2026-11-11. Source class `professional_society_guideline`, intended use `both`.

Authority — Society guideline on operative decompression and open-abdomen care. It supports the decompression indication but does not resolve a universal repeat-catheter versus operation boundary after partial drainage. Rights — CC BY 4.0, reuse status `cc_by_4_0`. Targeted verification and independently written atomic claim only. Source wording, tables, figures and algorithms are excluded. Attribution and licence link retained.

Verification — Indications for decompressive laparotomy after failed medical treatment and reliable repeated pressure measurements. Terms/rights checked 2026-11-11.  Supported claims `claim.critical-renal-organ-support.decompression-after-failed-measures.r2`.

<a href="https://link.springer.com/article/10.1186/s13017-018-0167-4" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">The open abdomen in trauma and non-trauma patients — WSES guidelines</a>

### Excluded and limited sources

- **NICE NG148** Section 18.3 requires separate approval and a licence for AI use in this service context. Initial discovery results supply no claim support. Disposition `excluded_from_evidence`. Checked 2026-11-11.

- **KDIGO 2026 AKI/AKD public-review draft** Official page describes preparation for publication following public review. Draft recommendations supply no clinical-key support. Disposition `status_metadata_only`. Checked 2026-11-11.

- **ADQI/POQI postoperative AKI consensus, 2021** Publisher open redirected to an inaccessible identity endpoint and PMC open returned a browser challenge. Search snippets supply no factual support. Disposition `excluded_from_evidence`. Checked 2026-11-11.

- **ISCCM AKI/RRT guideline, 2022** Publisher request failed and PMC open was challenged. Discovery licence metadata was insufficient access to the required clinical text. Disposition `excluded_from_evidence`. Checked 2026-11-11.

- **Chinese Society RRT guideline, 2026 edition** Metadata gives August 18 electronic publication with a December issue. PMC open was challenged and publisher rights/full text were not established. No recommendation from search snippets supplies a key. Disposition `metadata_only_not_claim_support`. Checked 2026-11-11.

- **KDIGO summaries Parts 1 and 2, 2013** Publisher displayed subscription previews. Inaccessible recommendation snippets supply no support. Disposition `excluded_from_evidence`. Checked 2026-11-11.

### Withheld teaching points and unkeyed slots

- `withheld.critical-renal-organ-support.universal-crrt-dose` — SRLF/GFRUP 2025 recommendation 3.1 states a maximum prescription. The Japanese guideline describes individualized dose, uncertain optimum and regional practice. These positions are preserved without merging them into a universal quantitative rule. Melissa and independent review establish a supported teaching boundary before a numeric ranking item is authored.

- `withheld.critical-renal-organ-support.universal-weaning-cutoff` — Observational studies use different urine cutoffs, diuretic contexts and success durations. No universal threshold or guaranteed liberation interval is supported here. Keep the response-based draft and obtain a specific adequate source before teaching a universal cutoff.

- `withheld.critical-renal-organ-support.renal-removal-as-abdominal-decompression` — Retrieved WSACS guidance does not establish renal replacement as a substitute for required abdominal decompression or establish a universal abdominal-perfusion pressure target. Keep unsupported pressure targets and replacement-substitution claims out of scored teaching.

- `slot.critical-renal-organ-support.intracranial-rrt-modality` — The candidate contrast between standard-dose continuous treatment and two high-intensity labels risked answer selection by qualifier. Current guidance supports low-clearance methods and does not establish a universal CRRT ranking over every adapted intermittent or hybrid prescription. A fair three-choice set needs a supported patient-specific discriminator. Melissa and independent review select the exact clinically supported comparison. Author a new question version after resolving the boundary. Current question, concept and key fields are empty.

- `slot.critical-renal-organ-support.repeat-drainage-decompression` — Melissa must select the clinically supported repeat-catheter versus operative strategy or a different supported discriminator. The parked draft supplies no scored key. Manager obtains Melissa’s exact clinical decision or a newly supported discriminator before a keyed version proceeds. Current question, concept and key fields are empty.

- `slot.critical-renal-organ-support.citrate-exposure-strategy` — Melissa must choose cessation versus reduced citrate for this exact supported trajectory before a keyed strategy version is authored. Manager obtains Melissa’s exact clinical decision or a newly supported discriminator before a keyed version proceeds. Current question, concept and key fields are empty.

## Timing, order and source-link proposals

The nine current node classifications include eight offered testing choices, with an exact choice ID, exact label and existing placeholder profile for every testing alternative. The new acquisition labels receive v2 identity mappings. The revised recovery choices select support strategies while routine surveillance remains shared ongoing care. Its classification is `no_test`.

Every selected-test order proposal remains `not_executed` with reason `future_planned`. Service requests and result gates remain empty. Original eleven-node timing/order history is preserved in the reviewed snapshots. Fixed waits are absent from authored prose. All twelve source-link records retain `target="_blank"`, `rel="noopener noreferrer"` and `referrerPolicy="no-referrer"`.

## Owner approvals needed

- **`owner.critical-renal-organ-support.pressure-fluid-drainage.v1`** For this exact pressure, organ trajectory and fluid anatomy, is catheter drainage a defensible first key, or should immediate decompressive laparotomy be keyed? Competing actions — Percutaneous peritoneal catheter drainage and Decompressive laparotomy with temporary closure. Single-guideline GRADE 2D preference. The exact draft supplies accessible free fluid, new organ dysfunction and no separate re-exploration indication. 

- **`owner.critical-renal-organ-support.uf-clearance-separation.v1`** Are these exact responses sufficient to key zero net removal with continued clearance, or should the stated instability require interruption of all treatment? Competing actions — Zero net removal with continuing clearance and Interrupt the entire extracorporeal treatment. Current panel opinion supports stopping UF with hypovolemia findings. The draft supplies response to pausing removal and loss of potassium control with clearance interruption. 

- **`owner.critical-renal-organ-support.citrate-metabolic-course.v1`** Does this exact calcium/perfusion pattern support the drafted initial reduction, or should immediate cessation be required? Competing actions — Reduce citrate load during shared corrective care and Immediately stop citrate and change strategy. The 2023 consensus supports reduction first and a strategy change if ineffective. The current 2025 guideline corroborates risk and monitoring without directly ranking this exact first adjustment. Parked candidate `question.topic.critical-renal-organ-support.citrate-metabolic-course.v2`.

- **`owner.critical-renal-organ-support.all-exact-versions.v1`** Which exact versions have defensible keys, realistic close alternatives and intended resident difficulty? Competing actions — Approve the exact reviewed clinical version and Request changes or retain a held key. All case headers, profiles, concepts, claims, keys and explanations are AI-assisted drafts. Author checks and structural validation retain separate roles. 

- **`owner.critical-renal-organ-support.intracranial-rrt-modality`** Which patient-specific renal prescription comparison should distinguish continuous support from adapted low-clearance intermittent or hybrid therapy while preserving one defensible key? Competing actions — Continuous kidney replacement with gradual clearance and Adapted low-clearance intermittent or sustained low-efficiency treatment. Current guidance supports low-clearance therapy but does not universally rank all adapted intermittent or hybrid regimens below CRRT. The former qualifier-based set was withdrawn. 

- **`owner.critical-renal-organ-support.repeat-drainage-decompression.r2`** For this exact partial-drainage anatomy and organ trajectory, should another targeted catheter or operative decompression be the immediate key, and what supported discriminator resolves that comparison? Competing actions — Additional catheter drainage of the remaining accessible fluid and Decompressive laparotomy with temporary closure. A genuine residual target removes the easy foil, but the retrieved guidelines do not resolve the exact repeat-drainage versus operation ranking during this deteriorating course. Parked candidate `question.topic.critical-renal-organ-support.pressure-refractory-decompression.v2`.

## Integration dependencies

- **clinic_preview_admission** Six normalized clinic cases and an explicit synthetic unapproved source release use existing clinic/examination capability at facility Level 4. Shared manifest, registries and default release remain unchanged. Independent presentation review, exact clinical approval and manager admission remain pending. Responsible owner — manager.

- **shared_registries** After review and acceptance, install exact concepts, questions, case definitions, timing/order mappings and source links through the release pipeline. Test orders are not_executed / future_planned presentation proposals. Responsible owner — manager.

- **selection** Two multi-node clinic record reviews preserve their displayed chronological course. Four other clinic cases are standalone, including drainage with its original earlier acquisition as read-only chart history. No selector or FSRS change is proposed. Responsible owner — manager.

- **cross_topic** Neuro, shock, ventilation, standalone electrolyte treatment, urinary retention and dialysis access have separate scored-scope owners. Responsible owner — manager.

- **parked_companions** Both unresolved v2 comparisons have clinic chart-review presentation and remain unkeyed. They are excluded from normalized cases, questions and nodes. The keyed cases have complete current contexts and no ICU delivery dependency. Responsible owner — manager.


## Salvage validation and handoff

The required focused command passes **66/66 tests**, including all three standalone clinic cases, exact PASS clinical wording/options/keys, unchanged accepted definitions, receipt hashes, timing tuples and source mappings. The existing historical checks reconstruct the exact original baseline through the manager-owned acceptance helper chain. No immutable acceptance receipt or shared helper was edited in this lane.

The package typecheck returns **exit 1** with **65 out-of-lane diagnostics** in four files. No diagnostic names an owned renal file. Current out-of-lane files follow.

- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts`
- `packages/clinical-content/src/question-ship-case-replacements.ts`
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts`
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts`

**Command** `npm.cmd test -- --pool=threads src/question-topic-critical-renal-organ-support-20261111.test.ts`, working directory `packages/clinical-content`, exit 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-renal-organ-support-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  66 passed (66)
   Start at  14:30:47
   Duration  5.15s (transform 3.15s, setup 0ms, import 4.84s, tests 226ms, environment 0ms)
```

**Command** `npm.cmd run typecheck`, working directory `packages/clinical-content`, exit 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-program-batch2-accepted-data-20261111.ts(3796,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3835,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3873,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3934,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3973,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(7999,5): error TS2322: Type '"applied_science"' is not assignable to type '"anatomy" | "definition" | "disposition" | "epidemiology" | "evaluation" | "management" | "presentation" | "safety_boundary"'.
src/question-ship-case-replacements.ts(63,21): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
  No index signature with a parameter of type 'string' was found on type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
src/question-ship-case-replacements.ts(63,60): error TS7006: Parameter 'clinicalCase' implicitly has an 'any' type.
src/question-ship-case-replacements.ts(70,63): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(70,98): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(72,32): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(74,28): error TS2345: Argument of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
  Type 'undefined' is not assignable to type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(193,56): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(196,37): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(201,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(216,66): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(217,42): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(219,44): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,26): error TS2551: Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import("C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111")'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,53): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,80): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(260,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(297,49): error TS7006: Parameter 'gate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,57): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,84): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1737,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1742,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,86): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1760,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1761,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1762,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1764,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1769,60): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1771,20): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1772,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,14): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,52): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1775,15): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1776,21): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1778,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,59): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,82): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,36): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,42): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1843,38): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,41): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,64): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1853,53): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,78): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,105): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1862,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1866,40): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1869,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,40): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,67): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,92): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1919,34): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,47): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,74): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,99): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1944,26): error TS7006: Parameter 'choice' implicitly has an 'any' type.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

**Command** `node -e "const fs=require('fs'); for(const path of ['docs/research/question-topic-critical-renal-organ-support-20261111.json','docs/research/sources-question-topic-critical-renal-organ-support-20261111.json']) { JSON.parse(fs.readFileSync(path,'utf8')); console.log(path+' JSON.parse PASS'); }"`, working directory `repository root`, exit 0.

```text
docs/research/question-topic-critical-renal-organ-support-20261111.json JSON.parse PASS
docs/research/sources-question-topic-critical-renal-organ-support-20261111.json JSON.parse PASS
```

All earlier attempts and concurrent integration failures are retained in the JSON. The first standalone normalization needed existing final-choice feedback metadata. Later strict epoch/source failures and a temporarily missing shared batch2 fixture cleared on the final focused rerun. Existing guards were retained.

## Bounded handoff

```text
Topic critical-renal-organ-support
Files changed packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.ts
  packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.test.ts
  docs/research/question-topic-critical-renal-organ-support-20261111.json
  docs/research/question-topic-critical-renal-organ-support-20261111.md
  docs/research/sources-question-topic-critical-renal-organ-support-20261111.json
Counts salvage 3 cases / 3 scored PASS nodes. New question variants 0 / new concept meanings 0 / companion rewrites 0.
Protected accepted 2 cases / 2 nodes. No accepted definition changed. Original assignment audit 0 / kept 0 / rewritten 0 / retired 0.
Review scope only status salvage entries in salvageRound and CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE.
Case/node identities
  case.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1 -> node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1
  case.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1 -> node.topic.critical-renal-organ-support.rrt-treatment-response.v1
  case.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1 -> node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1
Clinical presentation existing clinic chart review, named patient, age/sex and hospital history verbatim. Added clinical observations 0.
Clinical content exact PASS tasks, exhibits, choices, keys, rationales and feedback. Stable question/node/concept IDs.
Runtime three single-node normalized clinic cases, no earlier scored/held companion dependency. Existing no-outcome final-choice records reused.
Source provenance 31 atomic claims / 12 sources unchanged. Three scoped salvage question/context mappings added.
Packet docs/research/question-topic-critical-renal-organ-support-20261111.md + .json and sources-question-topic-critical-renal-organ-support-20261111.json
Owner approvals needed independent re-review of the three standalone contexts and the usual named clinician approval of exact clinical versions. Other held comparisons remain outside this task.
Validation focused 66/66 PASS, exit 0. Both JSON files parse, exit 0. Package typecheck exit 1 with 65 out-of-lane diagnostics across four files.
Next manager reviews only salvage cases, admits them after review and keeps the old mixed cases outside fresh supply. Other owners resolve package diagnostics.
Local shared-worktree checkpoint. All clinical content remains needs_clinician_review. No commit/push/install/deploy/agents.
```
