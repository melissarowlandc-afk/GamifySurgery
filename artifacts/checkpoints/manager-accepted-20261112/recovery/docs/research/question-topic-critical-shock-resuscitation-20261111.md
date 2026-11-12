# Critical care — shock and resuscitation

## Assignment

- Topic slug `critical-shock-resuscitation`, wave 1, priority high.
- Included scope. Shock phenotypes, perfusion/hemodynamic interpretation, fluid/vasoactive resuscitation, sepsis-associated shock and source-control timing in unstable physiology.
- Boundary assignments. Disease-specific source-control choices stay with the organ topic. Trauma hemorrhage tactics belong to `trauma-initial-abdomen`. Generic product/reversal questions belong to `hematology-transfusion-coagulation`.
- Priority reason. Foundational ICU reasoning has little visible primary-objective coverage in this bank.
- Starting counts. Zero live concepts, cases, nodes, variants, registered identities, retained draft rows, owner-held versions, unkeyed slots and withheld teaching points.
- Complete assigned inventory, concept, case, node and variant rows. Each filtered list is `[]`. Secondary-topic inventory and concept lists are also `[]`.
- Relevant identityReuseNotes, recordedHolds, unkeyedDraftSlots and withheldTeachingPoints. Each filtered list is `[]`.
- Exact frozen independent PASS and clinical approval references. No matching assigned versions or references exist in the program snapshot.
- Active coordination. `docs/research/question-topic-program-20261111.md` and its JSON companion, wave 1. The manager maintains shared planning and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.
- Baseline. `question-topic-program.2026-11-11.v1`, captured `2026-11-11T15:28:05.732Z`, generated `2026-11-11T15:41:40.423Z`. Default `clinical.synthetic.prototype.v1`, manifest `question-ship.2026-11-10.v9`, 145 manifest rows, 1,151 cases, 1,462 nodes and 610 registered identities.
- Program JSON SHA-256 `a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4`.
- Authoring standard SHA-256 `87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671`, version `question-authoring.2026-11-08.v15`.
- Manifest source SHA-256 `cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a` and assembly source SHA-256 `5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd` match the program snapshot on intake.

## Salvage assignment and outcome

Current reviewer scope is only `status: salvage`. Acceptance batch 1 skipped three independently passed shock nodes because their cases contained unaccepted scored companions. Each is now the only node of a new case. The three already accepted nodes are outside this submission.

The current explicit preview is `SHOCK_TOPIC_SALVAGE_SOURCE_RELEASE`. The original round-1 and round-2 exports and full prior packets remain retained. Question IDs, concept IDs, wording, options, current updates, exhibits, explanations and rationales remain exact. Two formerly intermediate nodes receive the schema-required neutral final-answer records, using existing consultation text and exact choice rationales.

Counts: three reviewed skipped PASS variants, three salvage cases, three unchanged concepts, zero new meanings, zero changed question versions and zero changed accepted nodes. All three standalone contexts remain `needs_clinician_review` and need independent context recheck.

| Status | New standalone case | Exact node | Exact question |
|---|---|---|---|
| salvage | `case.critical-shock-resuscitation.inotrope-after-pressure-restored-salvage.v1` | `node.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` | `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` |
| salvage | `case.critical-shock-resuscitation.lactate-perfusion-discordance-salvage.v1` | `node.critical-shock-resuscitation.lactate-perfusion-discordance.v1` | `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` |
| salvage | `case.critical-shock-resuscitation.vasopressin-escalation-salvage.v1` | `node.critical-shock-resuscitation.vasopressin-escalation.v2` | `question.critical-shock-resuscitation.vasopressin-escalation.v2` |

### Scope, preservation and intake

Input dispositions `docs/research/question-topic-acceptance-batch1-dispositions-20261111.json`, SHA-256 `bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4`. The JSON records each skipped PASS decision and its original review. The original acceptance authority is unchanged.

The salvage intake acceptance epoch had 1167 cases / 1482 nodes / 631 concepts and 167 manifest rows. Default object SHA-256 `7cc62b6e5d9c79133a163bfee8bf810d01a430aa28760d1265b02807b799dee8`. The earlier 145-row baseline remains historical.

Accepted and protected: `question.critical-shock-resuscitation.choose-valid-fluid-test.v1`, `question.critical-shock-resuscitation.response-versus-fluid-risk.v1`, `question.critical-shock-resuscitation.echo-for-persistent-shock.v2`. Both accepted case object hashes are recorded at intake and protected by the focused tests.

New case, presentation and finite-profile IDs prevent reuse of a changed context under an old case identity. The patient names, ages, sexes, complaints, clinic admission requirements, facility progression and meaning identities are preserved. Each profile exactly repeats its new case presentation.

### Standalone salvage review

**key shown first for review only**. Runtime options still shuffle. There are no preceding questions or visible feedback in any of the three cases.

#### case.critical-shock-resuscitation.inotrope-after-pressure-restored-salvage.v1

**Status** salvage. Node `node.critical-shock-resuscitation.inotrope-after-pressure-restored.v1`. Question `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1`.

**Source PASS** `docs/research/question-topic-critical-shock-resuscitation-review-20261111.json`. Reviewed case `case.critical-shock-resuscitation.pressure-and-flow.v1`. Acceptance skipped source case `case.critical-shock-resuscitation.pressure-and-flow.v2`. Exact node SHA-256 `7ae82ea619b92e182fff4b24e059a7573a5247cdad767089ec0e8f2fbd4ab8e7`.

**Presentation** Daniel Mercer, a 47-year-old man, remains in the surgical ICU after initial fluid treatment for a postoperative abdominal infection. During a clinic teaching consultation, the team reviews his ICU chart after the source-control procedure while IV antibiotic treatment continues.

**Patient** Daniel Mercer, 47 years, Male. Chief complaint: Increasing circulatory support.

**Minimal context change** Carries forward only the postoperative infection, initial fluid treatment, completed source-control procedure and continuing antibiotics. The exact current update supplies the later pressure support and worsening examination; the current exhibit supplies every decision measurement.

**Current update** Later, norepinephrine and vasopressin maintain the arterial pressure. A fresh assessment is obtained because the peripheral examination has worsened.

**Exhibit** Constructed chart observations

- **Pressure** MAP 70 mm Hg on stable norepinephrine and vasopressin infusions.
- **Perfusion** Cold extremities, capillary refill 6 seconds and a rising lactate trend.
- **Flow and contraction** Cardiac index 1.6 L/min/m². Repeat echocardiography shows diffuse weak left ventricular contraction.
- **Preload response** Technically adequate passive leg raising does not increase stroke volume.

**Complete task** Which next infusion adjustment best addresses Daniel Mercer's current hypoperfusion?

**key shown first for review only**

1. Add a dobutamine infusion **Key** - The new low flow and weak contraction accompany persistent hypoperfusion despite restored pressure and an assessment that does not support more fluid. Adding dobutamine to norepinephrine is a supported option for this phenotype.
2. Increase the norepinephrine infusion - The MAP target is achieved. Additional pressure support does not directly correct the newly demonstrated low flow and weak contraction.
3. Give a balanced-crystalloid bolus - The current reversible test shows no flow response, and the new cardiac findings identify a different support problem. Another empiric bolus is poorly supported by these observations.

**Explanation** The pressure response has separated from the flow response. New low output and diffuse weak contraction accompany persistent hypoperfusion, while passive leg raising produces no flow increase. Adding dobutamine is a supported option in this setting, with reassessment of perfusion and adverse effects.

**Two reasoning steps** Recognize the new low-output cardiac pattern from measured index, changed contraction and peripheral findings despite MAP recovery. Then Add inotropic support after confirming that neither more pressure nor an empiric volume load addresses the represented limitation.

**Deciding observation** The achieved MAP coexists with newly low measured flow and weak contraction.

**Counterfactual** Replace the current MAP with persistent inadequate pressure and restore vigorous contraction and substantial output. Norepinephrine titration becomes the best offered adjustment.

**Standalone check** This is the only scored node. All current decision observations are in its exact update and exhibit. The new header supplies only patient and treatment chronology; no preceding question, answer or feedback is visible.

**Evidence** `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`, `claim.critical-shock-resuscitation.norepinephrine-first`. Existing statement-to-claim mappings and the full bibliography remain in the source ledger.

The JSON before fields preserve the full originally passed case, prior visible nodes and feedback. The after fields contain this complete standalone case. All clinical node fields and the question are unchanged. Only the schema-required neutral completion records are added for the two formerly intermediate nodes. The new presentation and binding require recheck.

#### case.critical-shock-resuscitation.lactate-perfusion-discordance-salvage.v1

**Status** salvage. Node `node.critical-shock-resuscitation.lactate-perfusion-discordance.v1`. Question `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1`.

**Source PASS** `docs/research/question-topic-critical-shock-resuscitation-review-20261111.json`. Reviewed case `case.critical-shock-resuscitation.perfusion-and-pressure-target.v1`. Acceptance skipped source case `case.critical-shock-resuscitation.perfusion-and-pressure-target.v2`. Exact node SHA-256 `5642194115cd0da7633c0554b27f72c11954064e3a031cfe1ba5a0eb563a9054`.

**Presentation** Tomas Reed, a 60-year-old man, remains in the surgical ICU after treatment and source control of an abdominal infection. The surgical ICU team reviews his chart during a clinic teaching consultation.

**Patient** Tomas Reed, 60 years, Male. Chief complaint: Perfusion reassessment.

**Minimal context change** This was already the first scored node. The presentation preserves its infection-treatment context and makes the location of care and chart-review framing explicit. The later unaccepted measurement question is absent.

**Current update** None. The current exhibit supplies the observations.

**Exhibit** Constructed chart observations

- **Lactate course** Lactate has fallen from 7.0 to 4.6 mmol/L after treatment and source control.
- **Current bedside examination** Alert, warm extremities, capillary refill 2 seconds and urine output improving.
- **Pressure** MAP 68 mm Hg on an unchanged norepinephrine target of 65 mm Hg.
- **Flow response** Stroke volume remains unchanged during technically adequate passive leg raising.

**Complete task** Which current resuscitation order best fits Tomas Reed's combined response?

**key shown first for review only**

1. Maintain the norepinephrine MAP target at 65 mm Hg **Key** - Pressure is at the current supported target, perfusion is improving, lactate is falling and the flow test does not support further fluid. Continue serial assessment while maintaining the current target.
2. Raise the norepinephrine MAP target to 85 mm Hg - The improving examination and flow assessment do not show a current perfusion benefit from a higher pressure target. An elevated lactate by itself does not establish that more vasopressor is needed.
3. Give another intravenous balanced-crystalloid resuscitation bolus now - The flow test does not support a preload-responsive problem, and clinical perfusion is improving. Further fluid is not justified by the remaining lactate elevation.

**Explanation** The trend and examination support continuing the current pressure target with reassessment. Remaining lactate elevation warrants attention, but the falling trend and absent preload response do not justify reflex fluid or a higher MAP goal.

**Two reasoning steps** Reconcile residual hyperlactatemia with a falling trend, improving peripheral and organ signs, and absent preload response. Then Maintain the current supported pressure target while following serial findings instead of prescribing an unsubstantiated escalation.

**Deciding observation** Perfusion is improving, lactate is falling and stroke volume does not respond to a reversible preload change.

**Counterfactual** If refill and urine output worsened, lactate rose and a technically reliable preload test showed a strong reversible flow increase with acceptable fluid risk, a crystalloid bolus would become the best offered order.

**Standalone check** This is the only scored node. All current decision observations are in its exact update and exhibit. The new header supplies only patient and treatment chronology; no preceding question, answer or feedback is visible.

**Evidence** `claim.critical-shock-resuscitation.lactate-context`, `claim.critical-shock-resuscitation.map-target`, `claim.critical-shock-resuscitation.higher-map-tradeoff`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`. Existing statement-to-claim mappings and the full bibliography remain in the source ledger.

The JSON before fields preserve the full originally passed case, prior visible nodes and feedback. The after fields contain this complete standalone case. All clinical node fields and the question are unchanged. Only the schema-required neutral completion records are added for the two formerly intermediate nodes. The new presentation and binding require recheck.

#### case.critical-shock-resuscitation.vasopressin-escalation-salvage.v1

**Status** salvage. Node `node.critical-shock-resuscitation.vasopressin-escalation.v2`. Question `question.critical-shock-resuscitation.vasopressin-escalation.v2`.

**Source PASS** `docs/research/question-topic-critical-shock-resuscitation-review2-20261111.json`. Reviewed case `case.critical-shock-resuscitation.pressure-and-flow.v2`. Acceptance skipped source case `case.critical-shock-resuscitation.pressure-and-flow.v2`. Exact node SHA-256 `af7deefd9ab53b2d497b81b519c66d8be39199be68fb1d288b92e62adf7a75fc`.

**Presentation** Daniel Mercer, a 47-year-old man, remains in the surgical ICU with persistent hypotension after initial fluid treatment for a postoperative abdominal infection. The surgical ICU team reviews his chart during a clinic teaching consultation.

**Patient** Daniel Mercer, 47 years, Male. Chief complaint: Increasing circulatory support.

**Minimal context change** Retains the postoperative infection and initial fluid context. The exact current update already states completed source control, continuing antibiotics and the norepinephrine trajectory. No peripheral-access observations or prior answer feedback are imported.

**Current update** The source-control procedure is complete. IV antibiotic treatment continues. Across successive reassessments, higher norepinephrine support briefly raises the MAP, which then falls again.

**Exhibit** Constructed chart observations

- **Current pressure** MAP 58 mm Hg during the increasing norepinephrine requirement.
- **Current flow** Measured cardiac output is 7.6 L/min.
- **Reversible preload assessment** Averaged stroke volume is 63 mL at baseline, 64 mL during passive leg raising and 63 mL after return to baseline position.

**Complete task** Which resuscitation adjustment best fits Daniel Mercer's current pressure and flow observations?

**key shown first for review only**

1. Add a vasopressin infusion **Key** - The current problem is inadequate pressure despite substantial flow and an assessment that does not support further volume. Vasopressin is a supported adjunct during escalating norepinephrine requirements.
2. Give a balanced-crystalloid bolus - The direct reversible assessment does not show an appreciable increase in flow. Further volume is poorly supported by the current response despite the persistent low pressure.
3. Add a dobutamine infusion - The measured output does not identify a current flow deficit for this adjustment. The low arterial pressure remains the represented support problem.

**Explanation** The direct measurements show little preload-related change in flow and substantial current output. Persistent low pressure during increasing norepinephrine requirements supports adding vasopressin. Antibiotics continue during reassessment after the source-control procedure.

**Two reasoning steps** Interpret current substantial output and the raw reversible flow measurements to distinguish pressure failure from a flow or preload-response problem. Then Choose the adjunct addressing that pressure deficit during the represented norepinephrine trajectory.

**Deciding observation** The pressure remains low while output is substantial and the preload maneuver produces virtually unchanged stroke volume.

**Counterfactual** Replace the nearly unchanged reversible measurements with a clear flow rise and substantial ongoing volume loss, retaining hypoperfusion and acceptable fluid tolerance. A monitored balanced-crystalloid bolus becomes the best offered adjustment.

**Standalone check** This is the only scored node. All current decision observations are in its exact update and exhibit. The new header supplies only patient and treatment chronology; no preceding question, answer or feedback is visible.

**Evidence** `claim.critical-shock-resuscitation.vasopressin-addition`, `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`, `claim.critical-shock-resuscitation.inotrope-low-flow`. Existing statement-to-claim mappings and the full bibliography remain in the source ledger.

The JSON before fields preserve the full originally passed case, prior visible nodes and feedback. The after fields contain this complete standalone case. All clinical node fields and the question are unchanged. Only the schema-required neutral completion records are added for the two formerly intermediate nodes. The new presentation and binding require recheck.

### Timing, evidence, approvals and next action

Three exact `no_test` timing proposals use the new case IDs. Zero testing-choice order proposals are needed. The passive-leg-raise and other measurements are already reported observations. The three options in each node are treatment adjustments.

The ledger retains nine sources and 31 atomic claims. No new source, management claim, threshold, dose, wait interval or outcome assertion is introduced. Patient chronology and chart-review framing are constructed context. Existing rights and certainty limits remain unchanged.

Owner approvals needed: Melissa Rowland reviews the three exact standalone contexts and preserved clinical decisions. The independent reviewer rechecks only these `salvage` rows. Source-node PASS is retained as history and does not approve the new case contexts.

The manager installs accepted new case bindings, existing meaning/question identities and three no-test timing rows. Previously accepted cases, returned companion nodes, source versions and old timing tuples remain outside this submission.

Validation: focused 28/28 passed; clinical-content typecheck exited 1 with 65 diagnostics outside this topic lane. Both owned JSON files parse. Exact current output is in the salvage handoff below.

All round-2 sections below are retained historical records of that earlier submission.


## Round 2 assignment and outcome (historical)

The manager requested one revision attempt for each returned item in `docs/research/question-topic-critical-shock-resuscitation-review-20261111.json`. Input review SHA-256 is `42ef629534bc752ecfdebaedb886954c9eece104546393c3c4cf1f27f53dfaef`. The reviewed round-1 packet SHA-256 is `c0a9d6a9568f7cce31f598f827605df06807da2bff3734c5d4096f5069a9f923`.

Four exact PASS versions are preserved. Four returned items have revised question version 2 candidates. Three returned items are parked after their single documented repair attempt. The current stage has eight questions and eight scored meanings across four cases, with node counts 2, 3, 2 and 1.

The current direct-import export is `SHOCK_TOPIC_ROUND2_SOURCE_RELEASE`. `SHOCK_TOPIC_SOURCE_RELEASE` and the original source exports retain the exact round-1 objects for history.

All current and parked clinical versions remain `needs_clinician_review`. The four retained PASS findings are editorial review results. The four revised versions and changed case compositions still require independent review.

## Per-item disposition

| Reviewed exact question | Independent verdict | Current status | Current scored question |
|---|---|---|---|
| `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` | PASS | pass-preserved | `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` |
| `question.critical-shock-resuscitation.response-versus-fluid-risk.v1` | PASS | pass-preserved | `question.critical-shock-resuscitation.response-versus-fluid-risk.v1` |
| `question.critical-shock-resuscitation.peripheral-norepinephrine.v1` | REVISE | revised | `question.critical-shock-resuscitation.peripheral-norepinephrine.v2` |
| `question.critical-shock-resuscitation.vasopressin-escalation.v1` | REVISE | revised | `question.critical-shock-resuscitation.vasopressin-escalation.v2` |
| `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` | PASS | pass-preserved | `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` |
| `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` | PASS | pass-preserved | `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` |
| `question.critical-shock-resuscitation.validate-pressure-measurement.v1` | REVISE | revised | `question.critical-shock-resuscitation.validate-pressure-measurement.v2` |
| `question.critical-shock-resuscitation.antibiotics-despite-low-pct.v1` | REVISE | parked | Parked, no current scored question |
| `question.critical-shock-resuscitation.source-control-during-resuscitation.v1` | REVISE | parked | Parked, no current scored question |
| `question.critical-shock-resuscitation.echo-for-persistent-shock.v1` | REVISE | revised | `question.critical-shock-resuscitation.echo-for-persistent-shock.v2` |
| `question.critical-shock-resuscitation.pericardial-compression-intervention.v1` | REVISE | parked | Parked, no current scored question |

## Exact PASS preservation

The original five cases, eleven questions and 25 atomic claims retain their original object hashes. Four hard-coded context hashes are tested against the supplied reviewed versions. The current stage reuses their exact question, node and finite patient presentation fields.

| Preserved question | Reviewed whole-case context SHA-256 |
|---|---|
| `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` | `886d87db7bc1d68e9a80ba218f11f5af8ab51177be1d6b0d5b7c7bc4d1309c5a` |
| `question.critical-shock-resuscitation.response-versus-fluid-risk.v1` | `7a3344ad53401ce6cec8c8c703c276540d2e8810a325f0eeee69777c38a75055` |
| `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` | `bb6ddf3d9dfc96631785adfe4a816b6c7df9427594f621f22e25e5e8a3de1046` |
| `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` | `fe6090509b8a8511122ffa86dbee4b8a8f21e040e71cba6ca7bbb2d6b43f6e47` |

The complete two-node fluid-assessment case remains exact. The pressure-and-flow case receives new earlier questions while its later PASS node remains exact. That new case composition has its own version and requires sequence review. The lactate PASS item retains its original earlier visible context while its following returned measurement item changes.

## Complete before and after review

**key shown first for review only**

All active runtime nodes retain `shuffleAnswers: true`. The before fields contain the exact reviewed versions. All seven returned items have exactly one recorded repair attempt. The JSON includes complete prior visible node objects and feedback for each current scored question.

### question.critical-shock-resuscitation.choose-valid-fluid-test.v1

**Status** pass-preserved. Exact independently passed question, node and finite patient presentation are preserved.

**Independent review** PASS, predicted moderate.

#### Reviewed version

**Patient** Morgan Ellis, 56 years, Female. Chief complaint is low blood pressure.

Morgan Ellis, a 56-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after drainage of an abdominal infection. Hypotension persists after initial crystalloid.

Finite profile `profile.critical-shock-resuscitation.fluid-assessment.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Circulation** MAP 57 mm Hg after initial crystalloid. Capillary refill 5 seconds.
- **Rhythm** Atrial fibrillation with variable R-R intervals.
- **Ventilation** Pressure support with variable patient-triggered breaths.
- **Arterial waveform** Displayed pulse-pressure variation 22%.

**Complete task** Which bedside assessment should guide the decision about another fluid bolus for Morgan Ellis at this stage?

**key shown first for review only**

1. Track stroke-volume change during passive leg raising **Key**
2. Track pulse-pressure variation from the arterial waveform
3. Track respiratory variation of inferior vena-caval diameter

**Explanation** The waveform value is affected by both irregular beats and spontaneous respiratory effort. Measure the change in stroke volume during passive leg raising. This answers whether flow responds to preload under the actual acquisition conditions.

**Track pulse-pressure variation from the arterial waveform** Both the irregular rhythm and spontaneous breaths disturb the cyclic relationship needed to interpret this displayed value. A large number does not establish fluid responsiveness under these conditions.

**Track stroke-volume change during passive leg raising** A reversible change in preload can be assessed through direct flow measurement despite the represented breathing pattern and rhythm. The later treatment decision still requires assessment of perfusion need and fluid risk.

**Track respiratory variation of inferior vena-caval diameter** Inspiratory effort and other cardiopulmonary factors affect vena-caval variation. It is less dependable for this decision than a direct reversible flow-response test.

Supporting claims are `claim.critical-shock-resuscitation.ppv-validity`, `claim.critical-shock-resuscitation.plr-flow`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.ivc-variation-limitations`.

#### Preserved current version

The question, node and finite patient fields above are reused exactly. The current case binding is `case.critical-shock-resuscitation.fluid-assessment.v1`. Reviewed context hash `886d87db7bc1d68e9a80ba218f11f5af8ab51177be1d6b0d5b7c7bc4d1309c5a` remains test-protected in the retained case.

The current item retains the same preceding visible content.

### question.critical-shock-resuscitation.response-versus-fluid-risk.v1

**Status** pass-preserved. Exact independently passed question, node and finite patient presentation are preserved.

**Independent review** PASS, predicted moderate.

#### Reviewed version

**Patient** Morgan Ellis, 56 years, Female. Chief complaint is low blood pressure.

Morgan Ellis, a 56-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after drainage of an abdominal infection. Hypotension persists after initial crystalloid.

Finite profile `profile.critical-shock-resuscitation.fluid-assessment.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.choose-valid-fluid-test.v1` - The waveform value is affected by both irregular beats and spontaneous respiratory effort. Measure the change in stroke volume during passive leg raising. This answers whether flow responds to preload under the actual acquisition conditions.

**Current update** Norepinephrine has been started since the preceding ICU assessment.

**Exhibit** Constructed chart observations

- **Pressure and perfusion** MAP 55 mm Hg on norepinephrine. Capillary refill 5 seconds.
- **Reversible flow test** Stroke volume 48 mL at baseline, 64 mL during passive leg raising and 49 mL after return to baseline position.
- **Respiratory course** Oxygen requirement rose after the preceding fluid administration. Bilateral crackles and diffuse new B-lines are present.
- **Cardiac assessment** Left ventricular contraction is vigorous. Measured cardiac output is 7.0 L/min.

**Complete task** Which next resuscitation adjustment best fits Morgan Ellis's current pressure, flow response and respiratory course?

**key shown first for review only**

1. Increase the norepinephrine infusion **Key**
2. Give a balanced-crystalloid bolus
3. Start a dobutamine infusion

**Explanation** The reversible flow rise shows preload responsiveness. The worsening respiratory course after fluid changes whether that response should be pursued with another bolus. Titrate norepinephrine for the current low pressure while reassessing the evolving physiology.

**Give a balanced-crystalloid bolus** The flow response is genuine, but it does not establish that another bolus offers the best risk-benefit balance. Worsening oxygen needs and new diffuse lung findings after fluids argue against further empiric volume loading here.

**Start a dobutamine infusion** The represented low pressure occurs with vigorous contraction and substantial measured output. There is no demonstrated low-output cardiac dysfunction to make an inotrope the preferred adjustment.

**Increase the norepinephrine infusion** The low MAP needs pressure support while the large flow response is weighed against the deteriorating respiratory course. Norepinephrine titration addresses the current hypotension without another empiric fluid load.

Supporting claims are `claim.critical-shock-resuscitation.fluid-need-risk`, `claim.critical-shock-resuscitation.plr-flow`, `claim.critical-shock-resuscitation.norepinephrine-first`, `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.pressure-flow-distinction`.

#### Preserved current version

The question, node and finite patient fields above are reused exactly. The current case binding is `case.critical-shock-resuscitation.fluid-assessment.v1`. Reviewed context hash `7a3344ad53401ce6cec8c8c703c276540d2e8810a325f0eeee69777c38a75055` remains test-protected in the retained case.

The current item retains the same preceding visible content.

### question.critical-shock-resuscitation.peripheral-norepinephrine.v1

**Status** revised. Removed the convergent agent-by-route set. Added separate actual cannula observations, kept the needed circulation evidence and re-solved three route plans. No new dose, gauge or dwell-time rule was added.

**Independent review** REVISE, predicted easy.

#### Cue findings

- Place a central line before starting norepinephrine / Start norepinephrine through the monitored upper-arm IV / Start epinephrine through the monitored upper-arm IV - Component convergence selects the key without physiology: norepinephrine appears twice, the monitored upper-arm route appears twice, and only the key combines both repeated components. The three choices are an incomplete agent-by-route matrix.
- An upper-arm peripheral IV flushes freely and has a normal insertion site. Central-line preparation is under way. - These are legitimate access observations, but in this option set they nearly narrate the route decision. Once combined with the convergence pattern, the perfusion and flow data add little discrimination.

#### Reviewed version

**Patient** Daniel Mercer, 47 years, Male. Chief complaint is increasing circulatory support.

Daniel Mercer, a 47-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation. He has persistent hypotension after initial fluid treatment for a postoperative abdominal infection. Antibiotics and source-control treatment are under way.

Finite profile `profile.critical-shock-resuscitation.pressure-and-flow.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Pressure and perfusion** MAP 46 mm Hg, new confusion and mottled knees after initial crystalloid.
- **Flow assessment** Stroke volume remains unchanged during a technically adequate passive leg raise. Left ventricular contraction is preserved.
- **Access** An upper-arm peripheral IV flushes freely and has a normal insertion site. Central-line preparation is under way.

**Complete task** Which initial vasopressor delivery plan should Daniel Mercer's ICU team use now?

**key shown first for review only**

1. Start norepinephrine through the monitored upper-arm IV **Key**
2. Place a central line before starting norepinephrine
3. Start epinephrine through the monitored upper-arm IV

**Explanation** The current circulation needs prompt support, and the represented flow test does not support repeating empiric fluid. Begin norepinephrine through the suitable monitored proximal peripheral IV during central-access preparation. Reassess the infusion site and access plan as treatment continues.

**Place a central line before starting norepinephrine** Central access can be useful for continuing treatment, but making it a prerequisite prolongs severe hypotension when suitable monitored peripheral access is already present.

**Start norepinephrine through the monitored upper-arm IV** Severe hypotension with organ hypoperfusion persists after initial fluid assessment. A suitable proximal peripheral site allows prompt norepinephrine while central access is arranged and the site is monitored.

**Start epinephrine through the monitored upper-arm IV** The access route addresses urgency, but norepinephrine is the preferred initial agent for the represented septic shock with preserved contraction. Epinephrine is a credible agent in other hemodynamic contexts.

Supporting claims are `claim.critical-shock-resuscitation.peripheral-start`, `claim.critical-shock-resuscitation.norepinephrine-first`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.epinephrine-cardiac-phenotype`.

#### Single repair attempt

Removed the convergent agent-by-route set. Added separate actual cannula observations, kept the needed circulation evidence and re-solved three route plans. No new dose, gauge or dwell-time rule was added.

The incomplete drug-by-route matrix is removed. All options select the same drug through a different delivery plan. Actual separate patency records and continuing organ hypoperfusion now determine site selection and the consequence of delay. The author predicts moderate difficulty, with no basic-item exception claimed.

#### Revised version

Question `question.critical-shock-resuscitation.peripheral-norepinephrine.v2`, concept `concept.critical-shock-resuscitation.peripheral-norepinephrine.v1`, node `node.critical-shock-resuscitation.peripheral-norepinephrine.v2`. Current whole-case version hash `27a4d8a021f60090d04f63b31aeba77d09e29d7d92ea7b9595c6a3e6ffd1ccce`.

**Patient** Daniel Mercer, 47 years, Male. Chief complaint is increasing circulatory support.

Daniel Mercer, a 47-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation. He has persistent hypotension after initial fluid treatment for a postoperative abdominal infection. Antibiotics and source-control treatment are under way.

Finite profile `profile.critical-shock-resuscitation.pressure-and-flow.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Circulation** MAP 46 mm Hg, new confusion and mottled knees after initial crystalloid.
- **Response assessment** A technically adequate passive leg raise leaves averaged stroke volume unchanged. Left ventricular contraction is preserved.
- **Left forearm cannula** Blood returns on aspiration. Saline flushes easily without visible swelling around the insertion site.
- **Right forearm cannula** Blood does not return. A saline flush produces new swelling around the insertion site.
- **Access preparation** A new internal jugular line is being prepared.

**Complete task** Which circulatory-support delivery plan should the ICU team use for Daniel Mercer now?

**key shown first for review only**

1. Infuse norepinephrine through the left forearm cannula **Key**
2. Infuse norepinephrine through the right forearm cannula
3. Infuse norepinephrine after internal jugular cannulation

**Explanation** The two cannulas have different patency findings. Use the left forearm route with site monitoring while central access is prepared. The continuing organ hypoperfusion makes waiting for central cannulation consequential.

**Infuse norepinephrine through the right forearm cannula** The right-sided flush observations do not establish usable intravascular delivery. The site needs assessment rather than selection for the vasoactive infusion.

**Infuse norepinephrine after internal jugular cannulation** Central access is useful for continuing support, but the represented organ hypoperfusion and usable left-sided access do not support making completed central cannulation a prerequisite.

**Infuse norepinephrine through the left forearm cannula** Severe organ hypoperfusion makes a delivery delay consequential. The left-sided observations establish the usable monitored peripheral route while central preparation continues.

Supporting claims are `claim.critical-shock-resuscitation.peripheral-start`, `claim.critical-shock-resuscitation.r2-peripheral-patency`, `claim.critical-shock-resuscitation.norepinephrine-first`.

#### Five author checks

1. All three options use norepinephrine. There is no agent-by-route matrix, no majority drug component and no key-only monitoring adjective. Both peripheral options repeat the same grammatical pattern. Actual access observations carry the safety distinction.

2. Three concrete delivery plans for the same current pressure support. Central preparation and monitoring are common care, with no choice between different drugs hidden in the route decision.

3. Interpret the two actual flush and aspiration records separately instead of classifying both existing cannulas as equivalent. Use the demonstrated patent route during severe ongoing hypoperfusion rather than choose the abnormal route or wait for central access.

4. Predicted fair moderate. The resident must distinguish a failed site from a failed peripheral strategy and then apply the consequence of delay. This familiar safety task is not predicted hard.

5. The patent left route and continuing severe hypoperfusion resolve the choice. Neither all peripheral access nor peripheral infusion in every circumstance is certified as safe.

**Closest competitor** `choice.critical-shock-resuscitation.peripheral-norepinephrine.central-line.v2`.

**Deciding observation** A usable left-sided route remains despite right-sided swelling, and organ hypoperfusion continues during central preparation.

**Error consequence** Rejecting both peripheral routes can prolong hypoperfusion; using the abnormal site can fail to deliver the intended support safely.

**Deletion test** Without the separate patency records, the choice between peripheral sites is unsupported. Without current hypoperfusion, the clinical consequence of central-first delivery is weaker. The route labels themselves contain no patency conclusion.

**Decision-changing counterfactual** Reverse the two cannula records while retaining the current circulation. The right forearm cannula becomes the best offered route. The resulting offered choice is `choice.critical-shock-resuscitation.peripheral-norepinephrine.right-forearm.v2`.

**Sequence check** First node. The new feedback concerns access and delay. It names neither the next adjunct nor the later inotrope answer.

**Remaining review issue** An experienced ICU resident may find the access problem straightforward. The construction resolves every reviewer-identified cue and retains a patient-specific patency and urgency decision for moderate review.

**Infuse norepinephrine through the right forearm cannula** The temptation is treat any existing IV as equivalent access while trying to avoid a central-line delay.

A reasonable alternative context follows. If the right cannula had reliable blood return and an easy flush without swelling while the left cannula failed those checks, the right-sided route would be reasonable.

Mapped claims are `claim.critical-shock-resuscitation.r2-peripheral-patency`, `claim.critical-shock-resuscitation.peripheral-start`.

**Infuse norepinephrine after internal jugular cannulation** The temptation is respond to one abnormal peripheral site by treating both peripheral routes as unsuitable.

A reasonable alternative context follows. If neither peripheral cannula were usable, prompt central access or another appropriate emergency access route would be needed for delivery.

Mapped claims are `claim.critical-shock-resuscitation.peripheral-start`, `claim.critical-shock-resuscitation.r2-peripheral-patency`.

**Infuse norepinephrine through the left forearm cannula** The temptation is integrate the circulation and the separate patency observations to choose immediate usable access.

A reasonable alternative context follows. The represented persistent hypoperfusion and demonstrated left-sided patency, with appropriate peripheral-infusion safeguards.

Mapped claims are `claim.critical-shock-resuscitation.peripheral-start`, `claim.critical-shock-resuscitation.r2-peripheral-patency`, `claim.critical-shock-resuscitation.norepinephrine-first`.

### question.critical-shock-resuscitation.vasopressin-escalation.v1

**Status** revised. Clarified ongoing antibiotic treatment and separately completed source control. Replaced the drug-sequence lead-in and epinephrine option with a neutral adjustment task and a real fluid competitor. The data are now needed to rank the three mechanisms.

**Independent review** REVISE, predicted easy.

#### Clarity findings

- The update says 'Antimicrobial treatment and source control have been completed' during ongoing resuscitation. Completed antimicrobial treatment can mean the whole course has ended, rather than that initial antibiotics were administered. That creates avoidable uncertainty about elapsed time and current therapy.

#### Reviewed version

**Patient** Daniel Mercer, 47 years, Male. Chief complaint is increasing circulatory support.

Daniel Mercer, a 47-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation. He has persistent hypotension after initial fluid treatment for a postoperative abdominal infection. Antibiotics and source-control treatment are under way.

Finite profile `profile.critical-shock-resuscitation.pressure-and-flow.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.peripheral-norepinephrine.v1` - The current circulation needs prompt support, and the represented flow test does not support repeating empiric fluid. Begin norepinephrine through the suitable monitored proximal peripheral IV during central-access preparation. Reassess the infusion site and access plan as treatment continues.

**Current update** During ongoing ICU resuscitation, the norepinephrine requirement has continued to rise. Antimicrobial treatment and source control have been completed.

**Exhibit** Constructed chart observations

- **Pressure** MAP remains 58 mm Hg despite successive norepinephrine increases.
- **Cardiac assessment** Left ventricular contraction remains vigorous. Measured output is 7.6 L/min.
- **Preload response** A repeated technically adequate passive leg raise produces no meaningful stroke-volume change.

**Complete task** Which additional vasoactive infusion best fits Daniel Mercer's current response to norepinephrine?

**key shown first for review only**

1. Add vasopressin infusion **Key**
2. Add dobutamine infusion
3. Add epinephrine infusion

**Explanation** Pressure remains inadequate despite rising norepinephrine requirements, while output and contraction are substantial. Vasopressin is the supported adjunct at this point. The lack of a flow response argues against another empiric fluid load.

**Add dobutamine infusion** The current observations do not demonstrate low-output systolic dysfunction. Adding contractility does not address the represented pressure-support problem as directly as the supported vasopressin adjunct.

**Add epinephrine infusion** Epinephrine can provide additional support, but the current SSC sequence favors adding vasopressin as norepinephrine requirements escalate in this preserved-output context.

**Add vasopressin infusion** Escalating norepinephrine with persistent hypotension and preserved output fits the supported vasopressin adjunct. Further volume is not supported by the repeat response assessment.

Supporting claims are `claim.critical-shock-resuscitation.vasopressin-addition`, `claim.critical-shock-resuscitation.norepinephrine-first`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.epinephrine-after-dual`.

#### Single repair attempt

Clarified ongoing antibiotic treatment and separately completed source control. Replaced the drug-sequence lead-in and epinephrine option with a neutral adjustment task and a real fluid competitor. The data are now needed to rank the three mechanisms.

Antibiotics explicitly continue and the source-control procedure is separately complete. The neutral task compares pressure, volume and inotropic adjustments. Direct output and raw reversible measurements are required to choose among them. Qualitative norepinephrine escalation carries no invented dose boundary.

#### Revised version

Question `question.critical-shock-resuscitation.vasopressin-escalation.v2`, concept `concept.critical-shock-resuscitation.vasopressin-escalation.v1`, node `node.critical-shock-resuscitation.vasopressin-escalation.v2`. Current whole-case version hash `7c651cde4209dd2e88f0f2889c551ffc05e7de5e40de9c2adecb9056e366271f`.

**Patient** Daniel Mercer, 47 years, Male. Chief complaint is increasing circulatory support.

Daniel Mercer, a 47-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation. He has persistent hypotension after initial fluid treatment for a postoperative abdominal infection. Antibiotics and source-control treatment are under way.

Finite profile `profile.critical-shock-resuscitation.pressure-and-flow.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.peripheral-norepinephrine.v2` - The two cannulas have different patency findings. Use the left forearm route with site monitoring while central access is prepared. The continuing organ hypoperfusion makes waiting for central cannulation consequential.

**Current update** The source-control procedure is complete. IV antibiotic treatment continues. Across successive reassessments, higher norepinephrine support briefly raises the MAP, which then falls again.

**Exhibit** Constructed chart observations

- **Current pressure** MAP 58 mm Hg during the increasing norepinephrine requirement.
- **Current flow** Measured cardiac output is 7.6 L/min.
- **Reversible preload assessment** Averaged stroke volume is 63 mL at baseline, 64 mL during passive leg raising and 63 mL after return to baseline position.

**Complete task** Which resuscitation adjustment best fits Daniel Mercer's current pressure and flow observations?

**key shown first for review only**

1. Add a vasopressin infusion **Key**
2. Give a balanced-crystalloid bolus
3. Add a dobutamine infusion

**Explanation** The direct measurements show little preload-related change in flow and substantial current output. Persistent low pressure during increasing norepinephrine requirements supports adding vasopressin. Antibiotics continue during reassessment after the source-control procedure.

**Give a balanced-crystalloid bolus** The direct reversible assessment does not show an appreciable increase in flow. Further volume is poorly supported by the current response despite the persistent low pressure.

**Add a vasopressin infusion** The current problem is inadequate pressure despite substantial flow and an assessment that does not support further volume. Vasopressin is a supported adjunct during escalating norepinephrine requirements.

**Add a dobutamine infusion** The measured output does not identify a current flow deficit for this adjustment. The low arterial pressure remains the represented support problem.

Supporting claims are `claim.critical-shock-resuscitation.vasopressin-addition`, `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`, `claim.critical-shock-resuscitation.inotrope-low-flow`.

#### Five author checks

1. The options are three specific infusion adjustments of comparable length. The task does not preselect a vasopressor class or ask for the drug after norepinephrine. Neither drug availability nor a newly invented dose threshold supplies the key.

2. Three immediate resuscitation adjustments addressing competing pressure, flow and volume mechanisms at the same current assessment.

3. Interpret current substantial output and the raw reversible flow measurements to distinguish pressure failure from a flow or preload-response problem. Choose the adjunct addressing that pressure deficit during the represented norepinephrine trajectory.

4. Predicted moderate. The learner must use measured flow and the reversible response before applying the pressure-support sequence. The medication principle remains familiar.

5. The offered fluid and inotrope plans lack their represented physiological indication. The current conditional vasopressin recommendation fits the remaining pressure problem.

**Closest competitor** `choice.critical-shock-resuscitation.vasopressin-escalation.fluid-bolus.v2`.

**Deciding observation** The pressure remains low while output is substantial and the preload maneuver produces virtually unchanged stroke volume.

**Error consequence** Choosing volume or inotropy on the pressure value alone can treat a mechanism that the current flow observations do not establish.

**Deletion test** With the neutral resuscitation task, deleting the flow and maneuver rows leaves the fluid and inotrope choices unresolved. The former task preselected an additional vasoactive drug and let a sequence rule settle the answer.

**Decision-changing counterfactual** Replace the nearly unchanged reversible measurements with a clear flow rise and substantial ongoing volume loss, retaining hypoperfusion and acceptable fluid tolerance. A monitored balanced-crystalloid bolus becomes the best offered adjustment. The resulting offered choice is `choice.critical-shock-resuscitation.vasopressin-escalation.fluid-bolus.v2`.

**Sequence check** The preceding access explanation does not name an adjunct. The new runtime feedback explains the current pressure and measured-flow state without teaching the later low-output dobutamine decision. The preserved later PASS node still supplies its own new pressure, output, contraction and perfusion findings.

**Remaining review issue** Clinical circumstances can support other vasopressors. The item makes a patient-specific comparison of the offered actions and claims no universal dose boundary.

**Give a balanced-crystalloid bolus** The temptation is interpret persistent hypotension as sufficient evidence that the patient still needs a bolus.

A reasonable alternative context follows. A strong reversible flow increase, hypoperfusion and acceptable fluid risk would support a monitored volume challenge.

Mapped claims are `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`.

**Add a vasopressin infusion** The temptation is use the actual pressure-flow pattern to select the supported pressure adjunct.

A reasonable alternative context follows. This represented low-pressure, substantial-output course during norepinephrine escalation.

Mapped claims are `claim.critical-shock-resuscitation.vasopressin-addition`, `claim.critical-shock-resuscitation.pressure-flow-distinction`.

**Add a dobutamine infusion** The temptation is treat every persistent perfusion concern as a reason to add an inotrope without integrating the measured output.

A reasonable alternative context follows. Ongoing hypoperfusion with low measured output and cardiac dysfunction after adequate pressure and volume assessment would change this comparison.

Mapped claims are `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.pressure-flow-distinction`.

### question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1

**Status** pass-preserved. Exact independently passed question, node and finite patient presentation are preserved.

**Independent review** PASS, predicted moderate.

#### Reviewed version

**Patient** Daniel Mercer, 47 years, Male. Chief complaint is increasing circulatory support.

Daniel Mercer, a 47-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation. He has persistent hypotension after initial fluid treatment for a postoperative abdominal infection. Antibiotics and source-control treatment are under way.

Finite profile `profile.critical-shock-resuscitation.pressure-and-flow.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.peripheral-norepinephrine.v1` - The current circulation needs prompt support, and the represented flow test does not support repeating empiric fluid. Begin norepinephrine through the suitable monitored proximal peripheral IV during central-access preparation. Reassess the infusion site and access plan as treatment continues.

`question.critical-shock-resuscitation.vasopressin-escalation.v1` - Pressure remains inadequate despite rising norepinephrine requirements, while output and contraction are substantial. Vasopressin is the supported adjunct at this point. The lack of a flow response argues against another empiric fluid load.

**Current update** Later, norepinephrine and vasopressin maintain the arterial pressure. A fresh assessment is obtained because the peripheral examination has worsened.

**Exhibit** Constructed chart observations

- **Pressure** MAP 70 mm Hg on stable norepinephrine and vasopressin infusions.
- **Perfusion** Cold extremities, capillary refill 6 seconds and a rising lactate trend.
- **Flow and contraction** Cardiac index 1.6 L/min/m². Repeat echocardiography shows diffuse weak left ventricular contraction.
- **Preload response** Technically adequate passive leg raising does not increase stroke volume.

**Complete task** Which next infusion adjustment best addresses Daniel Mercer's current hypoperfusion?

**key shown first for review only**

1. Add a dobutamine infusion **Key**
2. Increase the norepinephrine infusion
3. Give a balanced-crystalloid bolus

**Explanation** The pressure response has separated from the flow response. New low output and diffuse weak contraction accompany persistent hypoperfusion, while passive leg raising produces no flow increase. Adding dobutamine is a supported option in this setting, with reassessment of perfusion and adverse effects.

**Add a dobutamine infusion** The new low flow and weak contraction accompany persistent hypoperfusion despite restored pressure and an assessment that does not support more fluid. Adding dobutamine to norepinephrine is a supported option for this phenotype.

**Increase the norepinephrine infusion** The MAP target is achieved. Additional pressure support does not directly correct the newly demonstrated low flow and weak contraction.

**Give a balanced-crystalloid bolus** The current reversible test shows no flow response, and the new cardiac findings identify a different support problem. Another empiric bolus is poorly supported by these observations.

Supporting claims are `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`, `claim.critical-shock-resuscitation.norepinephrine-first`.

#### Preserved current version

The question, node and finite patient fields above are reused exactly. The current case binding is `case.critical-shock-resuscitation.pressure-and-flow.v2`. Reviewed context hash `bb6ddf3d9dfc96631785adfe4a816b6c7df9427594f621f22e25e5e8a3de1046` remains test-protected in the retained case.

The two earlier returned nodes change in this case. The sequence assessment below records the new preceding feedback, and independent review of the composition remains necessary.

### question.critical-shock-resuscitation.lactate-perfusion-discordance.v1

**Status** pass-preserved. Exact independently passed question, node and finite patient presentation are preserved.

**Independent review** PASS, predicted moderate.

#### Reviewed version

**Patient** Tomas Reed, 60 years, Male. Chief complaint is perfusion reassessment.

Tomas Reed, a 60-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation after treatment and source control of an abdominal infection.

Finite profile `profile.critical-shock-resuscitation.perfusion-and-pressure-target.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Lactate course** Lactate has fallen from 7.0 to 4.6 mmol/L after treatment and source control.
- **Current bedside examination** Alert, warm extremities, capillary refill 2 seconds and urine output improving.
- **Pressure** MAP 68 mm Hg on an unchanged norepinephrine target of 65 mm Hg.
- **Flow response** Stroke volume remains unchanged during technically adequate passive leg raising.

**Complete task** Which current resuscitation order best fits Tomas Reed's combined response?

**key shown first for review only**

1. Maintain the norepinephrine MAP target at 65 mm Hg **Key**
2. Raise the norepinephrine MAP target to 85 mm Hg
3. Give another intravenous balanced-crystalloid resuscitation bolus now

**Explanation** The trend and examination support continuing the current pressure target with reassessment. Remaining lactate elevation warrants attention, but the falling trend and absent preload response do not justify reflex fluid or a higher MAP goal.

**Raise the norepinephrine MAP target to 85 mm Hg** The improving examination and flow assessment do not show a current perfusion benefit from a higher pressure target. An elevated lactate by itself does not establish that more vasopressor is needed.

**Give another intravenous balanced-crystalloid resuscitation bolus now** The flow test does not support a preload-responsive problem, and clinical perfusion is improving. Further fluid is not justified by the remaining lactate elevation.

**Maintain the norepinephrine MAP target at 65 mm Hg** Pressure is at the current supported target, perfusion is improving, lactate is falling and the flow test does not support further fluid. Continue serial assessment while maintaining the current target.

Supporting claims are `claim.critical-shock-resuscitation.lactate-context`, `claim.critical-shock-resuscitation.map-target`, `claim.critical-shock-resuscitation.higher-map-tradeoff`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.fluid-need-risk`.

#### Preserved current version

The question, node and finite patient fields above are reused exactly. The current case binding is `case.critical-shock-resuscitation.perfusion-and-pressure-target.v2`. Reviewed context hash `fe6090509b8a8511122ffa86dbee4b8a8f21e040e71cba6ca7bbb2d6b43f6e47` remains test-protected in the retained case.

The current item retains the same preceding visible content.

### question.critical-shock-resuscitation.validate-pressure-measurement.v1

**Status** revised. Explained the system in ordinary language, replaced the assessment lead-in with an action task and replaced unrelated physiological tests with three plausible troubleshooting actions. Raw heights replace an authored statement naming the setup fault.

**Independent review** REVISE, predicted easy.

#### Clarity findings

- 'The arterial pressure system has no fluid-filled zero line' is specialized setup language without an explanation of the system being described. A resident may confuse the zero-reference arrangement with the fluid-filled arterial pressure tubing itself.
- The task asks 'Which assessment', but the key is an equipment correction, while the other two choices obtain new physiological measurements. A neutral next-action task or a same-stage troubleshooting option set would be clearer.

#### Cue findings

- Its transducer is now above the level of the right atrium / Relevel the arterial-pressure transducer to the right atrium - The exhibit names the misplaced object and reference point; only the key repeats both and reverses the stated setup problem. A reader can match problem to correction without interpreting the pressure discrepancy.
- after the bed and monitoring equipment were repositioned - This primes equipment trouble before the table; combined with the explicit transducer position, it makes the unrelated echo and venous-saturation measurements weak competitors. The chronology is legitimate, but the current choices do not test its interpretation.

#### Reviewed version

**Patient** Tomas Reed, 60 years, Male. Chief complaint is perfusion reassessment.

Tomas Reed, a 60-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation after treatment and source control of an abdominal infection.

Finite profile `profile.critical-shock-resuscitation.perfusion-and-pressure-target.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` - The trend and examination support continuing the current pressure target with reassessment. Remaining lactate elevation warrants attention, but the falling trend and absent preload response do not justify reflex fluid or a higher MAP goal.

**Current update** Later, the arterial monitor displays a lower MAP after the bed and monitoring equipment were repositioned. Norepinephrine has been increased once in response to that display.

**Exhibit** Constructed chart observations

- **Pressure comparison** Arterial MAP 49 mm Hg. Repeated correctly sized upper-arm cuff measurements give MAP values of 72 and 74 mm Hg.
- **Examination** Mental status, warm extremities and capillary refill remain unchanged.
- **Measurement setup** The arterial pressure system has no fluid-filled zero line. Its transducer is now above the level of the right atrium.

**Complete task** Which assessment should guide the next decision about Tomas Reed's vasoactive support?

**key shown first for review only**

1. Relevel the arterial-pressure transducer to the right atrium **Key**
2. Repeat echocardiographic cardiac-output measurement at the bedside
3. Measure oxygen saturation in a central venous sample

**Explanation** The discordant pressure measurements and unchanged examination should prompt validation of the arterial setup. With this system, a transducer above the right atrial reference can read falsely low. Relevel it and reassess the pressure before another dose change.

**Repeat echocardiographic cardiac-output measurement at the bedside** Flow reassessment can help genuine deterioration, but it does not correct the represented pressure-system geometry. The unchanged examination and discordant cuff measurements first require validation of the arterial reading.

**Relevel the arterial-pressure transducer to the right atrium** For this system without a zero line, the transducer level must match the intended vascular reference. Its elevated position can produce a falsely low pressure and inappropriate vasopressor escalation.

**Measure oxygen saturation in a central venous sample** An oxygen-delivery assessment may aid genuine unresolved hypoperfusion. It cannot establish the accuracy of this displaced arterial-pressure reference and is not the first assessment of the represented discrepancy.

Supporting claims are `claim.critical-shock-resuscitation.arterial-level`, `claim.critical-shock-resuscitation.arterial-artifact-treatment`, `claim.critical-shock-resuscitation.echo-first`, `claim.critical-shock-resuscitation.pressure-flow-distinction`.

#### Single repair attempt

Explained the system in ordinary language, replaced the assessment lead-in with an action task and replaced unrelated physiological tests with three plausible troubleshooting actions. Raw heights replace an authored statement naming the setup fault.

Ordinary tubing description replaces unexplained zero-line shorthand. All options are pressure-system actions. Raw heights, simultaneous pressure values and a complete current examination replace an authored declaration of the hardware error. The key has no unique hardware or reference-mark vocabulary.

#### Revised version

Question `question.critical-shock-resuscitation.validate-pressure-measurement.v2`, concept `concept.critical-shock-resuscitation.validate-pressure-measurement.v1`, node `node.critical-shock-resuscitation.validate-pressure-measurement.v2`. Current whole-case version hash `dc5ba10bba88eab4420f320d09315341e2aee6331dd83c467f85c725e701fc1d`.

**Patient** Tomas Reed, 60 years, Male. Chief complaint is perfusion reassessment.

Tomas Reed, a 60-year-old man, is reviewed with the surgical ICU team during a clinic teaching consultation after treatment and source control of an abdominal infection.

Finite profile `profile.critical-shock-resuscitation.perfusion-and-pressure-target.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` - The trend and examination support continuing the current pressure target with reassessment. Remaining lactate elevation warrants attention, but the falling trend and absent preload response do not justify reflex fluid or a higher MAP goal.

**Current update** At a later measurement, the arterial display and simultaneous cuff readings differ. The team is considering another norepinephrine adjustment.

**Exhibit** Constructed chart observations

- **Circulation** Arterial MAP 90 mm Hg. Two correctly sized upper-arm cuff measurements, with the arm at heart level, give MAP 68 and 69 mm Hg. The current MAP goal is 65 mm Hg.
- **Current examination** Alert, warm extremities and capillary refill 2 seconds.
- **Pressure-system arrangement** Fluid-filled arterial tubing connects directly to the transducer. There is no separate fluid-filled tube running from a body-level reference to that transducer.
- **Heights above the floor** Right-atrial reference mark 120 cm. Transducer stopcock 90 cm.

**Complete task** Which pressure-system action should precede Tomas Reed's next norepinephrine adjustment?

**key shown first for review only**

1. Raise the pressure transducer to the reference mark **Key**
2. Zero the pressure transducer at its current height
3. Lower the pressure transducer to the reference mark

**Explanation** The measured geometry places the stopcock below the vascular reference and can account for the higher arterial display. Raise it to the reference and repeat the pressure assessment before changing norepinephrine. Zeroing at the same height does not correct that hydrostatic difference.

**Zero the pressure transducer at its current height** Atmospheric zeroing sets the device reference. It does not remove this configuration's hydrostatic offset caused by the physical height difference.

**Raise the pressure transducer to the reference mark** The stopcock is below the vascular reference, which can bias the displayed pressure upward. Raising it corrects that offset before a pressure-guided dose change.

**Lower the pressure transducer to the reference mark** The transducer is already below the reference. Moving it farther down would increase the same pressure offset.

Supporting claims are `claim.critical-shock-resuscitation.r2-hydrostatic-reference`, `claim.critical-shock-resuscitation.r2-zero-versus-level`, `claim.critical-shock-resuscitation.arterial-artifact-treatment`, `claim.critical-shock-resuscitation.arterial-level`.

#### Five author checks

1. All three options act on the same transducer and have comparable grammar and length. The exhibit gives two measured heights without saying that the transducer is misplaced or naming the correction. The task asks for an action, matching every option. Equipment-repositioning priming was removed.

2. Three pressure-system troubleshooting actions before a dose change. Echo and venous sampling no longer compete with an equipment correction.

3. Interpret the relative heights as a positive hydrostatic offset and relate its direction to the arterial-versus-cuff discrepancy. Choose physical leveling instead of another zeroing operation or an adjustment in the opposite direction before the pressure-guided dose decision.

4. Predicted moderate. Distinguishing the hydrostatic sign from an atmospheric zero error is a practical technical inference. The question does not claim difficult hemodynamic treatment selection.

5. The exact configuration and direction of the measurement discrepancy support raising the stopcock. The source directly distinguishes leveling from zeroing in this arrangement.

**Closest competitor** `choice.critical-shock-resuscitation.validate-pressure-measurement.zero.v2`.

**Deciding observation** The conventional stopcock is 30 cm below the right-atrial reference while the arterial display is higher than repeated heart-level cuff measurements.

**Error consequence** Treating the apparent arterial hypertension can unnecessarily reduce pressure support while true pressure remains near the intended target.

**Deletion test** Without the heights or configuration, neither the required physical correction nor the zeroing distinction is established. Without the simultaneous readings, the direction of the clinical measurement discrepancy is absent. The examination now stands alone.

**Decision-changing counterfactual** Put the transducer at 150 cm with the same 120 cm reference and a correspondingly low arterial display despite heart-level cuff readings near the goal. Lowering the transducer becomes the best offered correction. The resulting offered choice is `choice.critical-shock-resuscitation.validate-pressure-measurement.lower.v2`.

**Sequence check** The preceding PASS question and its feedback remain exact. This node repeats current alertness, extremity temperature, refill, cuff values and the MAP goal, so it requires no recalled observations.

**Remaining review issue** A resident familiar with transducer physics may solve it quickly. It is retained as a fair moderate acquisition problem after removing the literal problem-to-correction matching set.

**Zero the pressure transducer at its current height** The temptation is treat zeroing and leveling as interchangeable calibration procedures.

A reasonable alternative context follows. If the transducer were correctly leveled but the atmospheric zero reference had not been established or had become invalid, zeroing would address that problem.

Mapped claims are `claim.critical-shock-resuscitation.r2-zero-versus-level`.

**Raise the pressure transducer to the reference mark** The temptation is infer the direction of the pressure offset from the actual height measurements and select its physical correction.

A reasonable alternative context follows. This direct-transducer system with the stopcock below the intended vascular reference.

Mapped claims are `claim.critical-shock-resuscitation.r2-hydrostatic-reference`, `claim.critical-shock-resuscitation.r2-zero-versus-level`, `claim.critical-shock-resuscitation.arterial-artifact-treatment`.

**Lower the pressure transducer to the reference mark** The temptation is recognize a height-related discrepancy but reverse the hydrostatic direction of correction.

A reasonable alternative context follows. A transducer above the reference, with a correspondingly low arterial display, would need lowering to the reference.

Mapped claims are `claim.critical-shock-resuscitation.r2-hydrostatic-reference`, `claim.critical-shock-resuscitation.arterial-level`.

### question.critical-shock-resuscitation.antibiotics-despite-low-pct.v1

**Status** parked. The single revision attempt remains an easy safety item. A fair moderate or harder two-step comparison was not established. The original definition is retained for history and excluded from the round-2 stage.

**Independent review** REVISE, predicted easy.

#### Clarity findings

- 'After a focused diagnostic reassessment' does not specify what is reassessed or whether it introduces any meaningful delay. A rapid reassessment can occur during the current resuscitation, so the temporal alternatives are not clearly exclusive.

#### Cue findings

- begin the planned empirical broad-spectrum IV antibiotic treatment - 'Planned' preannounces that the treatment decision has already been made. 'Empirical' also makes waiting for organism identification sound internally inconsistent before the learner interprets infection evidence or procalcitonin.
- After the initial culture identification / During the current shock resuscitation - The option set contrasts waiting for a stated pending result with the sole immediate option in an explicitly urgent shock frame. The low biomarker can be ignored and the familiar urgency rule still selects the key.

#### Reviewed version

**Patient** Nora Bennett, 57 years, Female. Chief complaint is postoperative fever.

Nora Bennett, a 57-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation four days after abdominal surgery.

Finite profile `profile.critical-shock-resuscitation.infection-priorities.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Current illness** Temperature 39.2 °C, new confusion, worsening abdominal tenderness and cloudy postoperative drain output.
- **Circulation** MAP 52 mm Hg after initial crystalloid. Lactate 5.6 mmol/L.
- **Biomarker** Procalcitonin is within the laboratory reference interval.
- **Microbiology** Blood and drain samples have been collected. Organism identification is pending.

**Complete task** When should Nora Bennett's team begin the planned empirical broad-spectrum IV antibiotic treatment?

**key shown first for review only**

1. During the current shock resuscitation **Key**
2. After a focused diagnostic reassessment
3. After the initial culture identification

**Explanation** The clinical findings support likely infection with shock. Start the planned empirical treatment during resuscitation after the already obtained samples. Procalcitonin cannot independently exclude this treatment need, and organism identification can guide later refinement.

**After a focused diagnostic reassessment** The represented clinical assessment already supports likely infection with shock. A reassuring biomarker does not justify deferring treatment for another diagnostic assessment at this point.

**After the initial culture identification** Specimens have already been obtained. Waiting for organism identification would defer empirical treatment during likely infection with shock.

**During the current shock resuscitation** The current infectious findings and shock support prompt empirical treatment despite the biomarker result. Diagnostic assessment and source evaluation continue alongside resuscitation.

Supporting claims are `claim.critical-shock-resuscitation.antibiotic-urgency`, `claim.critical-shock-resuscitation.pct-initiation`, `claim.critical-shock-resuscitation.possible-infection-reassessment`.

#### Single repair attempt

Removed planned and empirical from the task. Made both deferral choices explicitly withhold antibiotics, resolving the overlapping-timing wording. Rechecked the complete current chart and all three plans.

The timing overlap is resolved, but the two deferral options still lose through the same familiar urgent-infection rule. Removing the biomarker leaves the key. No supported third immediate antibiotic plan was established within this narrow objective.

**Attempt identity** `attempt.critical-shock-resuscitation.antibiotics-despite-low-pct.v2`. This is unscored authoring material with `needs_clinician_review`.

**Exhibit** Constructed chart observations

- **Current illness** Temperature 39.2 °C, new confusion, worsening abdominal tenderness and cloudy postoperative drain output.
- **Circulation** MAP 52 mm Hg after initial crystalloid. Lactate 5.6 mmol/L.
- **Biomarker** Procalcitonin is within the laboratory reference interval.
- **Microbiology** Blood and drain samples have been collected. Organism identification is pending.

**Attempted task** Which antibiotic-management plan should the team use during Nora Bennett's current ICU assessment?

**key shown first for review only**

1. Start broad-spectrum IV antibiotics while resuscitation continues
2. Withhold antibiotics until a repeat abdominal examination and biomarker review are complete
3. Withhold antibiotics until the initial cultures identify an organism

The first action was the attempted priority. This attempted option set is excluded from the current stage.

**Attempted explanation** Likely infection and ongoing shock support prompt antibiotics after the already obtained samples. The low procalcitonin does not independently veto that decision.

**Deciding observation considered** Local infectious findings accompany new organ dysfunction and persistent hypotension.

**Counterfactual considered** A stable diagnostically uncertain illness with a credible noninfectious explanation could support diagnostic reassessment before the treatment decision.

**Author gate result** The timing overlap is resolved, but the two deferral options still lose through the same familiar urgent-infection rule. Removing the biomarker leaves the key. No supported third immediate antibiotic plan was established within this narrow objective.

**Parking reason** The single revision attempt remains an easy safety item. A fair moderate or harder two-step comparison was not established. The original definition is retained for history and excluded from the round-2 stage.

**Next action** A later author can verify a genuinely competing treatment decision, or the manager can seek separate explicit acceptance of a basic safety role.

Mapped evidence claims are `claim.critical-shock-resuscitation.antibiotic-urgency`, `claim.critical-shock-resuscitation.pct-initiation`, `claim.critical-shock-resuscitation.possible-infection-reassessment`.

### question.critical-shock-resuscitation.source-control-during-resuscitation.v1

**Status** parked. The one attempted repair did not establish a fair moderate comparison. Unsupported delay or procedural criteria would introduce a fairness problem, so the item is parked.

**Independent review** REVISE, predicted easy.

#### Cue findings

- The surgical and interventional-radiology teams have agreed on drainage / the agreed drainage procedure - The indication and procedure are settled twice. In this option set, the learner is left choosing the plainly indicated intervention against two complete-recovery delays, rather than resolving a remaining procedural decision.
- Schedule drainage after vasopressors have been discontinued / Schedule drainage after lactate reaches the reference interval / Proceed with drainage during the ongoing resuscitation - Two options demand complete resolution of a current abnormality, while the key is the only concurrent action and repeats the task's resuscitation language. This wait/wait/proceed structure provides an urgency shortcut.

#### Reviewed version

**Patient** Nora Bennett, 57 years, Female. Chief complaint is postoperative fever.

Nora Bennett, a 57-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation four days after abdominal surgery.

Finite profile `profile.critical-shock-resuscitation.infection-priorities.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.antibiotics-despite-low-pct.v1` - The clinical findings support likely infection with shock. Start the planned empirical treatment during resuscitation after the already obtained samples. Procalcitonin cannot independently exclude this treatment need, and organism identification can guide later refinement.

**Current update** CT now shows a postoperative intra-abdominal collection. The surgical and interventional-radiology teams have agreed on drainage. Empirical antibiotics and norepinephrine have begun. The current MAP is 67 mm Hg, lactate is 5.0 mmol/L and the norepinephrine requirement persists.

**Complete task** How should Nora Bennett's team time the agreed drainage procedure in relation to the current resuscitation?

**key shown first for review only**

1. Proceed with drainage during the ongoing resuscitation **Key**
2. Schedule drainage after vasopressors have been discontinued
3. Schedule drainage after lactate reaches the reference interval

**Explanation** Arrange early drainage with ongoing resuscitation and procedural safety assessment. The need and approach have been established in the current case. Complete lactate normalization or vasopressor discontinuation can require treating the source, so neither is a universal prerequisite.

**Schedule drainage after vasopressors have been discontinued** Waiting for complete independence from support can defer control of the process sustaining shock. Initial stabilization and procedural preparation proceed together with the required source control.

**Proceed with drainage during the ongoing resuscitation** The source-control need and approach have already been established. Continuing support is compatible with organizing early control after initial stabilization and assessing procedural safety.

**Schedule drainage after lactate reaches the reference interval** Lactate normalization is not a prerequisite for controlling an established infectious source. Waiting can prolong the cause of the abnormal physiology.

Supporting claims are `claim.critical-shock-resuscitation.early-source-control`, `claim.critical-shock-resuscitation.lactate-context`.

#### Single repair attempt

Removed duplicate declarations that drainage was agreed and replaced the complete-recovery prerequisites with narrower care plans. Re-solved the timing set against the actual supported pressure and source-control need.

The revised stabilization plan has no represented unresolved safety issue, and its duration is undefined. Adding one would require a new exact procedural constraint and supporting evidence. The remaining set still permits an urgency shortcut.

**Attempt identity** `attempt.critical-shock-resuscitation.source-control-during-resuscitation.v2`. This is unscored authoring material with `needs_clinician_review`.

**Attempted current update** CT shows a postoperative intra-abdominal collection requiring drainage. IV antibiotics and norepinephrine have begun. MAP is 67 mm Hg, lactate is 5.0 mmol/L and the norepinephrine requirement persists.

**Attempted task** When should Nora Bennett's team perform drainage of the collection during the current supported circulation?

**key shown first for review only**

1. Arrange drainage while resuscitation continues
2. Complete further ICU stabilization before arranging drainage
3. Continue antibiotics and reconsider drainage after the next clinical review

The first action was the attempted priority. This attempted option set is excluded from the current stage.

**Attempted explanation** Early source control and resuscitation should be coordinated after initial stabilization and procedural safety assessment.

**Deciding observation considered** A required untreated source remains during ongoing supported circulation.

**Counterfactual considered** If no urgent untreated source remained and the procedure were elective, more physiologic recovery could appropriately precede it.

**Author gate result** The revised stabilization plan has no represented unresolved safety issue, and its duration is undefined. Adding one would require a new exact procedural constraint and supporting evidence. The remaining set still permits an urgency shortcut.

**Parking reason** The one attempted repair did not establish a fair moderate comparison. Unsupported delay or procedural criteria would introduce a fairness problem, so the item is parked.

**Next action** A later source-verified scenario must supply an actual remaining sequencing or safety decision within the shock-timing scope.

Mapped evidence claims are `claim.critical-shock-resuscitation.early-source-control`.

### question.critical-shock-resuscitation.echo-for-persistent-shock.v1

**Status** revised. Supplied an actual initial acquisition log, retained the valid local result and compared contrast TTE, TEE and invasive hemodynamic measurement. Removed key-only portability wording. The materially changed assessment objective receives concept version 2.

**Independent review** REVISE, predicted easy.

#### Cue findings

- Obtain bedside transthoracic echocardiography - Only this investigation is explicitly described as bedside, giving it a portability advantage in an unstable-patient vignette. This is a partial wording cue, not proof by itself: a pulmonary artery catheter can also be placed at the bedside.

#### Reviewed version

**Patient** Elena Park, 54 years, Female. Chief complaint is persistent hypotension.

Elena Park, a 54-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after major abdominal surgery. Fever prompted empirical antibiotics, but hypotension has persisted during initial circulatory support.

Finite profile `profile.critical-shock-resuscitation.reassess-shock-mechanism.v1` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Response** MAP 54 mm Hg despite initial crystalloid and norepinephrine. Stroke volume did not increase with the last monitored bolus.
- **Examination** Distended neck veins, narrow arterial pulse pressure and equal breath sounds.
- **Filling pressure** Central venous pressure is 18 mm Hg and rose during the last bolus.

**Complete task** Which investigation should Elena Park's team obtain first to reassess the cause of the persistent shock?

**key shown first for review only**

1. Obtain bedside transthoracic echocardiography **Key**
2. Obtain CT pulmonary angiography
3. Insert a pulmonary artery catheter

**Explanation** High filling pressure with absent flow response makes further empiric fluid a poor way to clarify the mechanism. Bedside echocardiography is a first-line way to reassess cardiac and obstructive contributions to the ongoing shock.

**Obtain CT pulmonary angiography** Pulmonary embolism is a credible postoperative possibility, but the current severe shock and uncertain cardiac filling mechanism call for immediate bedside cardiac assessment before choosing that targeted transfer investigation.

**Obtain bedside transthoracic echocardiography** The nonresponsive bolus and elevated filling pressure challenge simple volume depletion. Bedside cardiac imaging can distinguish ventricular dysfunction and obstructive filling causes while resuscitation continues.

**Insert a pulmonary artery catheter** Advanced pressure and flow measurements can help selected complex cases, but they do not replace the first-line imaging assessment that can identify an immediate structural or obstructive cause.

Supporting claims are `claim.critical-shock-resuscitation.echo-first`, `claim.critical-shock-resuscitation.dynamic-over-static`, `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.rv-fluid-risk`.

#### Single repair attempt

Supplied an actual initial acquisition log, retained the valid local result and compared contrast TTE, TEE and invasive hemodynamic measurement. Removed key-only portability wording. The materially changed assessment objective receives concept version 2.

An actual incomplete acquisition now precedes the decision. The valid local LV result is preserved without treating unexamined structures as negative. Contrast TTE, TEE and invasive pressure measurements address different remaining questions, with comparable labels. A new concept version records the changed meaning.

#### Revised version

Question `question.critical-shock-resuscitation.echo-for-persistent-shock.v2`, concept `concept.critical-shock-resuscitation.echo-for-persistent-shock.v2`, node `node.critical-shock-resuscitation.echo-for-persistent-shock.v2`. Current whole-case version hash `e5326e573f832aef0ddeae35e6dd5186221cc7d0591fbc10389bb9c25968d54a`.

**Patient** Elena Park, 54 years, Female. Chief complaint is persistent hypotension.

Elena Park, a 54-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after laparoscopic sigmoid colectomy. Fever prompted empirical antibiotics, but hypotension has persisted during initial circulatory support.

Finite profile `profile.critical-shock-resuscitation.reassess-shock-mechanism.v2` retains the stated age, sex, complaint and presentation.

**Exhibit** Constructed chart observations

- **Current circulation** MAP 54 mm Hg despite norepinephrine and initial crystalloid. CVP is 18 mm Hg. Stroke volume did not increase with the last monitored bolus.
- **Transthoracic acquisition log** One subcostal view outlines the anterior left ventricle with preserved contraction. Parasternal and apical views cannot be acquired through the current dressings and intervening subcutaneous air.
- **Structures documented** The right ventricular free wall, posterior cardiac contour and most of the pericardial space are outside the acquired views.
- **Current airway** Mechanically ventilated after the abdominal operation.

**Complete task** Which investigation should Elena Park's team obtain next to guide circulatory support after this echocardiographic examination?

**key shown first for review only**

1. Transesophageal echocardiography **Key**
2. Contrast-enhanced transthoracic echocardiography
3. Pulmonary artery catheterization

**Explanation** The acquired left-ventricular view supplies useful local information. The record does not establish the status of the other structures needed to explain this filling and pressure pattern. TEE supplies an alternative structural approach when those transthoracic windows cannot be acquired.

**Contrast-enhanced transthoracic echocardiography** Contrast can improve endocardial-border definition in an acquired view. The current limitation is failed acoustic access to the structures needed for this shock assessment, beyond the already outlined left ventricle.

**Pulmonary artery catheterization** Additional pressure and flow data can help mixed shock, but they do not show the currently unexamined chambers and surrounding structures that might explain the filling problem.

**Transesophageal echocardiography** The represented transthoracic views leave important right-sided and surrounding structures unexamined. An alternative acoustic approach can address that structural uncertainty while support continues.

Supporting claims are `claim.critical-shock-resuscitation.r2-limited-tte`, `claim.critical-shock-resuscitation.r2-tee-after-limited-tte`, `claim.critical-shock-resuscitation.r2-contrast-border`, `claim.critical-shock-resuscitation.echo-first`, `claim.critical-shock-resuscitation.pressure-flow-distinction`.

#### Five author checks

1. No option alone is labeled bedside or immediately available. All labels are named investigations at the same next-assessment stage. The exhibit retains valid local findings without calling the entire study negative or naming the eventual diagnosis.

2. Three next investigations after an actual incomplete acquisition. This is no longer a first-echo recognition question.

3. Separate an adequately observed left-ventricular contraction finding from the right-sided and surrounding structures that were never visualized. Choose an alternative acoustic approach that addresses the acquisition failure instead of enhancing one existing border or obtaining pressures without the missing structural assessment.

4. Predicted moderate to hard. The nearest error is escalating an acquisition that addresses a different limitation, or overextending the valid left-ventricular finding into whole-heart exclusion.

5. The physical acquisition limits and unexamined structures resolve the comparison in favor of TEE. Its actual use requires operator expertise and the usual safety screen, with no blanket outcome-benefit claim.

**Closest competitor** `choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2`.

**Deciding observation** The acquisition log documents inaccessible windows and unvisualized target structures, rather than poor endocardial definition in otherwise complete images.

**Error consequence** Treating the limited study as a complete structural assessment can leave a reversible cardiac or obstructive mechanism unrecognized.

**Deletion test** Delete the acquisition details and the distinction between contrast TTE and TEE is not established. Delete the persistent pressure/filling problem and there is no stated immediate reason to pursue those unexamined structures.

**Decision-changing counterfactual** If suitable transthoracic views covered the relevant structures and only ventricular endocardial definition remained inadequate, contrast-enhanced TTE would become the best offered investigation. The resulting offered choice is `choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2`.

**Sequence check** The previous pericardial intervention is parked, so this revised node is a self-contained assessment. Its feedback supplies no subsequent scored answer. No future diagnosis is disclosed.

**Remaining review issue** The current supporting cohort is cardiovascular-ICU evidence. The acquisition principle applied to this abdominal postoperative case is an explicit physical inference requiring clinician review.

**Contrast-enhanced transthoracic echocardiography** The temptation is treat all incomplete echocardiographic information as an endocardial-border problem that a contrast injection can resolve.

A reasonable alternative context follows. Usable transthoracic views covering the relevant structures, with poor endocardial definition as the residual ventricular-function question, would support contrast enhancement.

Mapped claims are `claim.critical-shock-resuscitation.r2-contrast-border`, `claim.critical-shock-resuscitation.r2-limited-tte`.

**Pulmonary artery catheterization** The temptation is regard preserved contraction in the one acquired view as adequate structural exclusion and move directly to more invasive pressure measurements.

A reasonable alternative context follows. An adequate structural cardiac assessment with persistent mixed-shock uncertainty that additional pressure and flow measurements would resolve.

Mapped claims are `claim.critical-shock-resuscitation.echo-first`, `claim.critical-shock-resuscitation.pressure-flow-distinction`, `claim.critical-shock-resuscitation.r2-limited-tte`.

**Transesophageal echocardiography** The temptation is preserve the valid left-ventricular observation while recognizing what the acquired examination cannot establish.

A reasonable alternative context follows. This persistent shock with failed transthoracic acoustic access to the structures needed for the current assessment, after the usual procedure-specific safety screen.

Mapped claims are `claim.critical-shock-resuscitation.r2-tee-after-limited-tte`, `claim.critical-shock-resuscitation.r2-limited-tte`.

### question.critical-shock-resuscitation.pericardial-compression-intervention.v1

**Status** parked. The single repair remains a classic easy safety association. It is parked rather than submitted as a moderate or hard two-step question.

**Independent review** REVISE, predicted easy.

#### Clarity findings

- The option commits to 'Arrange urgent pericardial drainage', whereas the explanation repeatedly softens this to 'drainage assessment'. In the stated shock context, distinguish prompt mobilization for drainage and selection of its approach from merely requesting another assessment.

#### Cue findings

- Pericardial fluid / Arrange urgent pericardial drainage - The key is the only choice repeating the exhibit's anatomical term and the only procedure beside two general infusion adjustments. Anatomy-to-action matching can select it without interpreting chamber motion or comparing yesterday with today.
- Which immediate intervention / Arrange urgent pericardial drainage - Only the key includes an urgency adjective that mirrors 'immediate'. The other actions could also be initiated immediately, so this label adds a preferential wording signal rather than clinical information.

#### Reviewed version

**Patient** Elena Park, 54 years, Female. Chief complaint is persistent hypotension.

Elena Park, a 54-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after major abdominal surgery. Fever prompted empirical antibiotics, but hypotension has persisted during initial circulatory support.

Finite profile `profile.critical-shock-resuscitation.reassess-shock-mechanism.v1` retains the stated age, sex, complaint and presentation.

**Prior visible feedback**

`question.critical-shock-resuscitation.echo-for-persistent-shock.v1` - High filling pressure with absent flow response makes further empiric fluid a poor way to clarify the mechanism. Bedside echocardiography is a first-line way to reassess cardiac and obstructive contributions to the ongoing shock.

**Current update** MAP remains 54 mm Hg despite ongoing norepinephrine.

**Exhibit** Constructed echocardiography report comparison

| Observation | Yesterday | Current study |
|---|---|---|
| Pericardial fluid | Circumferential collection | Similar-size circumferential collection |
| Right-sided chamber motion | No chamber collapse | Right atrial systolic and right ventricular diastolic collapse |
| Left ventricular contraction | Preserved | Preserved |

**Complete task** Which immediate intervention should Elena Park's team prioritize for the current shock findings?

**key shown first for review only**

1. Arrange urgent pericardial drainage **Key**
2. Increase the norepinephrine infusion
3. Start a dobutamine infusion

**Explanation** The new chamber collapse indicates a hemodynamically important filling impediment even though the collection size and left ventricular contraction appear similar. Prioritize urgent pericardial drainage assessment while maintaining support. The exact drainage approach depends on the collection and clinical setting.

**Increase the norepinephrine infusion** Pressure support may continue during preparation, but the changed chamber motion identifies a filling impediment that escalating vasopressor alone cannot remove.

**Start a dobutamine infusion** Preserved contraction with new right-sided collapse points to impaired filling. The report does not support primary low-output systolic dysfunction as the intervention target.

**Arrange urgent pericardial drainage** The new chamber collapse during continued shock establishes a changed hemodynamic effect despite similar collection size. Urgent drainage assessment addresses the filling impediment while support continues.

Supporting claims are `claim.critical-shock-resuscitation.tamponade-physiology`, `claim.critical-shock-resuscitation.tamponade-drainage`, `claim.critical-shock-resuscitation.inotrope-low-flow`, `claim.critical-shock-resuscitation.norepinephrine-first`.

#### Single repair attempt

Removed the key-only urgent adjective and the decorative Yesterday comparison. Aligned the explanation with mobilizing for drainage instead of merely requesting an assessment.

The clinical priority is fair after wording alignment, but the procedure remains the sole compartment-directed action and the infusion foils do not create a distinct second inference. The support does not establish a closer procedural or temporizing comparison.

**Attempt identity** `attempt.critical-shock-resuscitation.pericardial-compression-intervention.v2`. This is unscored authoring material with `needs_clinician_review`.

**Attempted current update** MAP remains 54 mm Hg despite ongoing norepinephrine.

**Exhibit** Constructed chart observations

- **Pericardial fluid** Circumferential collection on the current examination.
- **Right-sided motion** Right atrial systolic and right ventricular diastolic collapse.
- **Left ventricular contraction** Preserved.

**Attempted task** Which intervention should Elena Park's team prioritize for the current shock findings?

**key shown first for review only**

1. Mobilize the team for pericardial drainage
2. Increase norepinephrine during continued cardiac reassessment
3. Start dobutamine during continued cardiac reassessment

The first action was the attempted priority. This attempted option set is excluded from the current stage.

**Attempted explanation** Persistent shock with chamber compression warrants prompt mobilization for drainage while circulatory support continues. The acute team selects the approach.

**Deciding observation considered** Current shock and new chamber compression coexist despite preserved systolic contraction.

**Counterfactual considered** A validated absence of a hemodynamically important collection with a supported vasodilatory mechanism would redirect the priority toward pressure support.

**Author gate result** The clinical priority is fair after wording alignment, but the procedure remains the sole compartment-directed action and the infusion foils do not create a distinct second inference. The support does not establish a closer procedural or temporizing comparison.

**Parking reason** The single repair remains a classic easy safety association. It is parked rather than submitted as a moderate or hard two-step question.

**Next action** A later author needs directly supported competing intervention priorities, or a separately accepted basic recognition purpose.

Mapped evidence claims are `claim.critical-shock-resuscitation.tamponade-physiology`, `claim.critical-shock-resuscitation.tamponade-drainage`.

## Sequence, meaning and history decisions

- `case.critical-shock-resuscitation.fluid-assessment.v1` - The complete two-node fluid-assessment case remains byte-exact as an object, including both passed questions and all presentation profiles.
- `case.critical-shock-resuscitation.pressure-and-flow.v2` - The later PASS question, node, demographics and profile are exact. Earlier feedback is changed only with the two returned nodes. It explains current access, current pressure and measured flow, with no literal instruction to select dobutamine later. The preserved later node supplies its new low output, weak contraction and restored pressure. Recomposition needs independent review.
- `case.critical-shock-resuscitation.perfusion-and-pressure-target.v2` - The first PASS node and all finite presentation fields are exact. The revised later measurement item supplies all current values and examination findings. It needs no remembered prior answer.
- `case.critical-shock-resuscitation.reassess-shock-mechanism.v2` - The revised acquisition-assessment item stands alone after parking the pericardial priority question. The new finite presentation specifies the lower-abdominal operation and preserves name, age, sex and clinic-record frame.

Three revised questions retain their existing concept identity because their scored clinical meanings remain the same. The imaging revision receives `concept.critical-shock-resuscitation.echo-for-persistent-shock.v2` with previous concept `concept.critical-shock-resuscitation.echo-for-persistent-shock.v1`. The current objective interprets an acquired study?s limits before selecting the next investigation. Both versions remain inspectable.

Name, age and sex are retained in every current profile. The revised imaging case specifies a lower-abdominal operation in its new presentation version. Passed patient presentations remain exact. Original timing and order tuples remain in the retained definitions and JSON snapshot.

## Research coverage and remaining gaps

The original nineteen ranked priorities remain recorded in JSON. Eight have current scored candidates. Eight earlier research gaps and the three newly parked objectives remain open. The pre-existing unkeyed individualized-MAP-target slot is also retained.

| Rank | Priority | Current question or disposition |
|---|---|---|
| 1 | Persistent shock mechanism | `question.critical-shock-resuscitation.echo-for-persistent-shock.v2` |
| 2 | Validity of preload assessment | `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` |
| 3 | Fluid response, need and tolerance | `question.critical-shock-resuscitation.response-versus-fluid-risk.v1` |
| 4 | Early pressure support and access | `question.critical-shock-resuscitation.peripheral-norepinephrine.v2` |
| 5 | Vasoactive escalation by phenotype | `question.critical-shock-resuscitation.vasopressin-escalation.v2` |
| 6 | Low flow after pressure recovery | `question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` |
| 7 | Integrated perfusion endpoints | `question.critical-shock-resuscitation.lactate-perfusion-discordance.v1` |
| 8 | Pressure measurement validity | `question.critical-shock-resuscitation.validate-pressure-measurement.v2` |
| 9 | Antibiotic initiation with discordant evidence | parked_after_one_revision_attempt |
| 10 | Source-control timing | parked_after_one_revision_attempt |
| 11 | Pericardial filling impediment | parked_after_one_revision_attempt |
| 12 | Individualized pressure targets | research_or_authoring_gap_with_no_scored_candidate |
| 13 | Right ventricular pressure overload | research_or_authoring_gap_with_no_scored_candidate |
| 14 | Initial fluid formulation and reassessment | research_or_authoring_gap_with_no_scored_candidate |
| 15 | Adjunct corticosteroid strategies | research_or_authoring_gap_with_no_scored_candidate |
| 16 | Venous oxygen and carbon-dioxide signals | research_or_authoring_gap_with_no_scored_candidate |
| 17 | Fluid de-escalation | research_or_authoring_gap_with_no_scored_candidate |
| 18 | Dynamic outflow obstruction | research_or_authoring_gap_with_no_scored_candidate |
| 19 | Additional noninfectious and mixed shock | research_or_authoring_gap_with_no_scored_candidate |

## Sources and atomic claims

The current source ledger has nine source records and 31 atomic claims. The original 25 claims and original verification dates remain exact. Six added claims support cannula patency, pressure-reference geometry, zeroing versus leveling, limits of an acquired TTE view, next structural imaging and contrast-assisted endocardial definition.

- `source.critical-shock-resuscitation.saugel-arterial-pressure-2020` - Saugel B, Kouz K, Meidert AS, Schulte-Uentrop L, Romagnoli S. How to measure blood pressure using an arterial catheter: a systematic 5-step approach. Critical Care. 2020;24:172. doi:10.1186/s13054-020-02859-w. Creative Commons Attribution 4.0 International. Technical review of arterial measurement physics and setup. It distinguishes systems with and without a zero line. One directly inspected detailed source supports this exact technical application. [Arterial catheter pressure measurement and pitfalls](https://link.springer.com/article/10.1186/s13054-020-02859-w)
- `source.critical-shock-resuscitation.ssc-2026` - Prescott HC, Antonelli M, Alhazzani W, et al. Surviving Sepsis Campaign: international guidelines for management of sepsis and septic shock 2026. Intensive Care Medicine. 2026;52:863–936. doi:10.1007/s00134-026-08361-1. Parallel publication in Critical Care Medicine. doi:10.1097/CCM.0000000000007075. Copyright SCCM and ESICM, all rights reserved. Current international multidisciplinary adult sepsis guideline. Conditional recommendations and low or very-low evidence remain conditional in the claims. The two journal publications and companion materials are one guideline, with no independent-source credit. [Surviving Sepsis Campaign adult guidelines 2026](https://survivingsepsis.org/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines)
- `source.critical-shock-resuscitation.esicm-shock-2025` - Monnet X, Messina A, Greco M, et al. ESICM guidelines on circulatory shock and hemodynamic monitoring 2025. Intensive Care Medicine. 2025;51:1971–2012. doi:10.1007/s00134-025-08137-z. Copyrighted society guideline, public abstract. Current adult shock guideline with graded recommendations and ungraded good-practice statements. Abstract directly supports dynamic assessment, echocardiography and serial perfusion assessment. It cannot verify unexposed technical details. [ESICM circulatory shock and hemodynamic monitoring 2025](https://link.springer.com/article/10.1007/s00134-025-08137-z)
- `source.critical-shock-resuscitation.jsscg-2024` - Shime N, Nakada T, Yatabe T, et al. The Japanese Clinical Practice Guidelines for Management of Sepsis and Septic Shock 2024. Journal of Intensive Care. 2025;13:15. doi:10.1186/s40560-025-00776-0. Creative Commons Attribution 4.0 International. Independent society guideline with explicit evidence grading. Its recommendations reflect a Japanese practice context. Specific disagreements with SSC are recorded separately. [Japanese sepsis and septic shock clinical practice guideline 2024](https://link.springer.com/article/10.1186/s40560-025-00776-0)
- `source.critical-shock-resuscitation.monnet-fluid-response-2016` - Monnet X, Marik PE, Teboul JL. Prediction of fluid responsiveness: an update. Annals of Intensive Care. 2016;6:111. doi:10.1186/s13613-016-0216-7. Creative Commons Attribution 4.0 International. Detailed physiology review for test validity and the distinction between fluid responsiveness, perfusion need and fluid risk. Older technical source cross-checked against current ESICM and SSC principles. No outcome benefit or universal cutoff inferred. [Prediction of fluid responsiveness](https://link.springer.com/article/10.1186/s13613-016-0216-7)
- `source.critical-shock-resuscitation.mclean-echo-2016` - McLean AS. Echocardiography in shock management. Critical Care. 2016;20:275. doi:10.1186/s13054-016-1401-7. Creative Commons Attribution 4.0 International. Physiology-oriented critical-care echocardiography review. Current ESICM supports the general first-line echo role. Tamponade-specific management has one directly inspected adequate source in this packet and needs named clinician review. [Echocardiography in shock management](https://link.springer.com/article/10.1186/s13054-016-1401-7)
- `source.critical-shock-resuscitation.global-alliance-iai-2024` - Sartelli M, Barie P, Agnoletti V, et al. Intra-abdominal infections survival guide: a position statement by the Global Alliance For Infections In Surgery. World Journal of Emergency Surgery. 2024;19:22. doi:10.1186/s13017-024-00552-9. Creative Commons Attribution 4.0 International. Surgical infection position statement with graded statements. Source-control urgency is supported by low-quality evidence. Used for timing and coordination only. Disease-specific procedure ranking belongs to the organ lane. [Global Alliance surgical infection position statement](https://link.springer.com/article/10.1186/s13017-024-00552-9)
- `source.critical-shock-resuscitation.ics-peripheral-2022` - Intensive Care Society Standards and Guidelines Committee. Guidance for the use of vasopressor agents by peripheral intravenous infusion in adult critical care patients. Version 1.1. November 2020, interim update September 2022. Intensive Care Society. Copyrighted professional-society guidance, no open adaptation license established. Adult critical-care society guidance. Its scheduled review date has passed, so it supplies a narrow technical cross-check. The original current SSC and Japanese guidance support prompt appropriate peripheral administration during central preparation. No exact gauge, dose, concentration or duration rule is authored. [ICS guidance on peripheral vasopressor infusion](https://ics.ac.uk/resource/peripheral-vasopressor-guide.html)
- `source.critical-shock-resuscitation.minami-tee-2026` - Minami K, Saga T, Kato M, Nakayama D, Morinaga M, Shimatani T, Takeuchi M. Derivation of a pragmatic three-view protocol for point-of-care transesophageal echocardiography in the cardiovascular ICU: a real-world cohort study. Critical Care. 2026;30:154. doi:10.1186/s13054-026-05925-x. Creative Commons Attribution 4.0 International. Current retrospective single-center cardiovascular-ICU cohort. Supports the observed use of TEE when TTE is nondiagnostic and describes postoperative acoustic barriers. Application to this abdominal postoperative patient is a physical-acquisition inference, with the older general shock review as a cross-check. No outcome benefit or universal TEE superiority is inferred. [TEE after limited transthoracic imaging in the cardiovascular ICU](https://link.springer.com/article/10.1186/s13054-026-05925-x)

The ICS source is version 1.1 with a September 2022 interim update and a November 2023 scheduled review date. Its patency advice supplies a narrow cross-check alongside the already verified current sepsis guidance. The unavailable general terms page is recorded. Copyrighted society text receives targeted factual verification, with no permissive artifact license claimed.

The Minami 2026 article has an inspected CC BY 4.0 notice. Its cardiovascular-ICU population limits transfer of outcome findings. This packet applies a physical acquisition principle to the constructed abdominal postoperative case and records that inference. The older general shock review supports the local imaging and contrast distinctions.

The conventional pressure-system claims have one inspected detailed technical source. Constructed heights, pressures and response values create no new cutoff, medication dose, waiting interval or demographic weight. No protected source prose, tables, figures, algorithms or article excerpts are stored.

## Timing, orders and integration

Eight current timing classifications cover nine testing choices, including distractors. The retained round-1 records remain exact. Current test-order proposals have `not_executed` / `future_planned` dispositions and exact case, node, question, choice ID and label mappings.

| Current question | Testing choice | Existing placeholder profile |
|---|---|---|
| `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` | Track pulse-pressure variation from the arterial waveform | `timing.test.physiology` |
| `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` | Track stroke-volume change during passive leg raising | `timing.test.physiology` |
| `question.critical-shock-resuscitation.choose-valid-fluid-test.v1` | Track respiratory variation of inferior vena-caval diameter | `timing.test.ultrasound` |
| `question.critical-shock-resuscitation.validate-pressure-measurement.v2` | Zero the pressure transducer at its current height | `timing.test.physiology` |
| `question.critical-shock-resuscitation.validate-pressure-measurement.v2` | Raise the pressure transducer to the reference mark | `timing.test.physiology` |
| `question.critical-shock-resuscitation.validate-pressure-measurement.v2` | Lower the pressure transducer to the reference mark | `timing.test.physiology` |
| `question.critical-shock-resuscitation.echo-for-persistent-shock.v2` | Contrast-enhanced transthoracic echocardiography | `timing.test.echocardiography` |
| `question.critical-shock-resuscitation.echo-for-persistent-shock.v2` | Pulmonary artery catheterization | `timing.test.advanced_diagnostic` |
| `question.critical-shock-resuscitation.echo-for-persistent-shock.v2` | Transesophageal echocardiography | `timing.test.echocardiography` |

Both echo approaches use the existing generic echocardiography placeholder. The pressure-system actions use the existing physiology placeholder. Authored prose contains no fixed wait. Safe source-link metadata retains `target="_blank"`, `rel="noopener noreferrer"` and `referrerPolicy="no-referrer"`.

- manager owns the next action. Review SHOCK_TOPIC_ROUND2_SOURCE_RELEASE as the current explicit stage. SHOCK_TOPIC_SOURCE_RELEASE and the original exports retain the exact round-1 definitions for history.
- manager owns the next action. Four exact editorial PASS nodes are preserved. The recomposed pressure-and-flow case still needs sequence review before acceptance.
- manager owns the next action. Three parked items have no current scored definition. Their original versions and one attempted repair remain inspectable in the retained source and packet.
- manager owns the next action. Install only accepted exact case, question and concept bindings, eight current timing classifications and nine future_planned order tuples. Preserve old records by exact identity and label.
- manager owns the next action. The new imaging concept v2 scores acquisition adequacy and next structural assessment. Preserve the previous meaning and its history. Seven other current concept identities are reused.
- manager owns the next action. Three current cases have paired-only coverage. The revised imaging case has standalone coverage. Existing selector and FSRS rules apply.
- manager owns the next action. The TEE and contrast-TTE choices both use the existing generic echocardiography placeholder profile. These estimates execute no actual acute ICU service.

Three current cases have paired-only coverage under the existing all-concepts-unseen-or-due eligibility. The revised imaging case has standalone coverage. Clinical care remains in the described ICU record, presented through the existing clinic teaching-consultation frame.

## Owner approvals needed

- **clinical-review.critical-shock-resuscitation.round2-eight** Do the eight current exact versions, finite profiles, claims, keys and distractor rankings represent the clinical decisions accurately? The four retained editorial PASS findings confer no named clinical approval. Four revised versions still need independent review.
- **clinical-review.critical-shock-resuscitation.round2-acquisition** Are the direct-transducer configuration and post-colectomy echocardiographic acquisition limits sufficiently specified to support the proposed correction and TEE comparison? The arterial principle has a single detailed technical source. TEE use combines general shock review with a current cardiovascular-ICU cohort and an explicit physical-acquisition inference.
- **clinical-review.critical-shock-resuscitation.fluid-risk-ranking** Do the exact respiratory deterioration, preserved contraction and measured output sufficiently favor norepinephrine escalation over another monitored bolus despite the positive flow response? The exact individual risk-benefit ranking requires clinical judgment.

No basic-item acceptance is claimed for the parked questions. The manager can commission a later supported comparison or seek separate explicit acceptance of a basic purpose. This round's three parking dispositions require no guessed clinical key.

## Validation

Both package commands ran from `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`. Each exited 0. The focused file passed 21 tests, including four hard-coded PASS context hashes and retained-object checks. The package typecheck emitted no diagnostics.

```powershell
npm.cmd test -- --pool=threads src/question-topic-critical-shock-resuscitation-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-shock-resuscitation-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  12:06:45
   Duration  3.81s (transform 2.20s, setup 0ms, import 3.63s, tests 69ms, environment 0ms)
```

```powershell
npm.cmd run typecheck
```

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Both owned JSON files parse successfully. The command ran from the repository root and exited 0.

```powershell
node -e "const fs=require('fs'); for (const f of ['docs/research/question-topic-critical-shock-resuscitation-20261111.json','docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('JSON validity PASS (2 files)');"
```

```text
JSON validity PASS (2 files)
```

The closing comparison checked 443 recorded source inputs and found 0 changed inputs. The actual default export remains 1151 cases / 1462 nodes / 610 concepts, with 145 manifest rows. Default object SHA-256 `b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`.

The independent review file retains SHA-256 `42ef629534bc752ecfdebaedb886954c9eece104546393c3c4cf1f27f53dfaef`. Independent review of the revised versions and new case compositions remains pending.

## Bounded handoff

Topic critical-shock-resuscitation, round 2.

Files changed

- packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.ts
- packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.test.ts
- docs/research/question-topic-critical-shock-resuscitation-20261111.json
- docs/research/question-topic-critical-shock-resuscitation-20261111.md
- docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json

Counts reviewed 11, pass-preserved 4, revised 4, parked 3. Current stage eight scored questions and eight meanings across four cases. Three meaning identities are reused for rewrites, and one imaging meaning receives version 2.

Exact preservation all four independently passed questions, nodes and finite patient contexts are retained. The original five cases, eleven questions and 25 claims remain exact in the retained exports. The changed pressure-and-flow composition requires sequence review.

Parked antibiotics-despite-low-pct, source-control-during-resuscitation and pericardial-compression-intervention. Each has one complete unscored attempt, an explicit failed author gate and a reason. The previous unkeyed MAP slot and eight earlier research gaps remain recorded.

Packet docs/research/question-topic-critical-shock-resuscitation-20261111.md, docs/research/question-topic-critical-shock-resuscitation-20261111.json and docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json.

Current packet JSON SHA-256 300e4da91d5ce1eeb737d63444ebafa7749ef831d9a4af818e0f8f894615d920.

Owner approvals needed Melissa Rowland exact clinical review of all eight current versions, with technical-acquisition and retained fluid-risk questions recorded above.

Validation focused 21 passed / 0 failed / one file, exit 0. Clinical-content typecheck exit 0. Both JSON files parse, exit 0. Full native output is recorded above and in JSON.

Open work manager inspects the actual lane, commissions independent review of four revised versions and changed composition, and decides accepted-only integration. The checkpoint exists locally. The manager owns the GitHub backup step after the owner says push to GitHub.

## Salvage validation and bounded handoff

Topic `critical-shock-resuscitation`, skipped-PASS standalone salvage.

Files changed

- `packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.ts`
- `packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.test.ts`
- `docs/research/question-topic-critical-shock-resuscitation-20261111.json`
- `docs/research/question-topic-critical-shock-resuscitation-20261111.md`
- `docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json`

Inventory: exactly three skipped PASS rows from acceptance batch 1. Intake was 1167 cases / 1482 nodes / 631 concepts, with 167 manifest rows. Closing live default is 1174 cases / 1491 nodes / 654 concepts, with 193 manifest rows. Default unchanged since salvage intake: false. The concurrent batch-2 integration advanced the broader default. The three already accepted topic nodes in two cases retain their exact intake hashes.

Counts audited 3, kept 3 exact clinical question/node versions, rewritten 0, retired-and-replaced proposed 0, new questions 0, new standalone cases 3. Count basis is three unique skipped variants, three nodes and three reused concept identities. No new meaning version is created.

Held/unkeyed: no new hold is added. The prior three parked questions and `slot.critical-shock-resuscitation.individualized-map-target` remain historical; neither returned companion is included in salvage.

Research: no new source or medical claim. Nine source records and 31 atomic claims retain their dates, rights mappings and limitations. Constructed presentation chronology uses only facts in the reviewed chart context.

Packet `docs/research/question-topic-critical-shock-resuscitation-20261111.json`, `docs/research/question-topic-critical-shock-resuscitation-20261111.md` and `docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json`. Current JSON SHA-256 `a7b772576bffc1fc951e47fb6b09ee1ed6b8125af52f2710071853103fd2008d`.

Identity preservation: all three question/concept IDs, stems, options, exhibits, current updates, explanations and rationales remain exact. New case, presentation and finite-profile IDs record the standalone contexts. Two previously intermediate nodes receive only required neutral final-answer metadata. Original round-1/round-2 sources, both accepted cases and all original histories remain preserved.

Owner approvals needed: Melissa Rowland reviews the three standalone contexts and clinical rankings. All new context metadata remains `needs_clinician_review`. Independent reviewer filters `status: salvage` and rechecks only these three cases; original PASS does not approve their new compositions.

Integration: manager installs accepted-only new case bindings, existing questions/concepts and three `no_test` timing rows. Zero new test-order proposals. Existing clinic, selector and FSRS representations apply.

Validation: focused test exit 0, 28 passed / 0 failed / one file. Clinical-content typecheck exit 1 with zero owned-file diagnostics and 65 out-of-lane diagnostics. Both JSON files parse, exit 0.

Package commands ran from `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`.

```powershell
npm.cmd test -- --pool=threads src/question-topic-critical-shock-resuscitation-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-shock-resuscitation-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  14:27:52
   Duration  4.36s (transform 2.49s, setup 0ms, import 4.18s, tests 90ms, environment 0ms)
```

```powershell
npm.cmd run typecheck
```

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

Out-of-lane diagnostics

- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:3796:5` TS2353 - Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:3835:5` TS2353 - Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:3873:5` TS2353 - Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:3934:5` TS2353 - Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:3973:5` TS2353 - Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
- `packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts:7999:5` TS2322 - Type '"applied_science"' is not assignable to type '"anatomy" | "definition" | "disposition" | "epidemiology" | "evaluation" | "management" | "presentation" | "safety_boundary"'.
- `packages/clinical-content/src/question-ship-case-replacements.ts:63:21` TS7053 - Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
- `packages/clinical-content/src/question-ship-case-replacements.ts:63:60` TS7006 - Parameter 'clinicalCase' implicitly has an 'any' type.
- `packages/clinical-content/src/question-ship-case-replacements.ts:70:63` TS18048 - 'source' is possibly 'undefined'.
- `packages/clinical-content/src/question-ship-case-replacements.ts:70:98` TS18048 - 'source' is possibly 'undefined'.
- `packages/clinical-content/src/question-ship-case-replacements.ts:72:32` TS18048 - 'source' is possibly 'undefined'.
- `packages/clinical-content/src/question-ship-case-replacements.ts:74:28` TS2345 - Argument of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:193:56` TS7006 - Parameter 'check' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:196:37` TS7006 - Parameter 'check' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:201:38` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:216:66` TS7006 - Parameter 'row' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:217:42` TS7006 - Parameter 'row' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:219:44` TS7006 - Parameter 'row' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:247:26` TS2551 - Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import("C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111")'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:247:53` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:247:80` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:260:36` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts:297:49` TS7006 - Parameter 'gate' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1736:57` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1736:84` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1737:19` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1742:38` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1755:33` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1755:60` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1755:86` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1760:7` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1761:16` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1762:22` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1764:16` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1769:60` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1771:20` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1772:22` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1773:33` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1773:60` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1774:14` TS7006 - Parameter 'candidate' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1774:52` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1775:15` TS7006 - Parameter 'candidate' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1776:21` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1778:7` TS18046 - 'node' is of type 'unknown'.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1788:59` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1788:82` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1812:36` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1812:42` TS7006 - Parameter 'index' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1843:38` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1847:41` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1847:64` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1853:53` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1861:78` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1861:105` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1862:19` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1866:40` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1869:36` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1898:40` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1898:67` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1898:92` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1919:34` TS7006 - Parameter 'choice' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1929:47` TS2552 - Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1929:74` TS7006 - Parameter 'item' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1929:99` TS7006 - Parameter 'node' implicitly has an 'any' type.
- `packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts:1944:26` TS7006 - Parameter 'choice' implicitly has an 'any' type.

The initial adapter validation exposed the existing final-node requirement. The final implementation adds neutral completion metadata without changing reviewed clinical text. Two strict typing issues in this lane were corrected before the final checks. The remaining package errors are in shared batch-2 accepted-data, case-replacement code and the colon topic files; their owners retain responsibility. Concurrent integration also advanced the live census. A stale census assertion was replaced by strict historical receipt checks while retaining live import invariance and exact accepted-topic case hashes; the final focused run passes all 28.

JSON command ran from the repository root.

```powershell
node -e "const fs=require('fs'); for (const f of ['docs/research/question-topic-critical-shock-resuscitation-20261111.json','docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('JSON validity PASS (2 files)');"
```

```text
JSON validity PASS (2 files)
```

Open work: manager commissions independent context review for the three salvage cases, coordinates the out-of-lane typecheck fixes, obtains named clinical review and decides exact acceptance/integration. The checkpoint is local; the manager owns the GitHub backup step after the owner says `push to GitHub`.

Salvaged cases and exact nodes

| Case | Node |
|---|---|
| `case.critical-shock-resuscitation.inotrope-after-pressure-restored-salvage.v1` | `node.critical-shock-resuscitation.inotrope-after-pressure-restored.v1` |
| `case.critical-shock-resuscitation.lactate-perfusion-discordance-salvage.v1` | `node.critical-shock-resuscitation.lactate-perfusion-discordance.v1` |
| `case.critical-shock-resuscitation.vasopressin-escalation-salvage.v1` | `node.critical-shock-resuscitation.vasopressin-escalation.v2` |

