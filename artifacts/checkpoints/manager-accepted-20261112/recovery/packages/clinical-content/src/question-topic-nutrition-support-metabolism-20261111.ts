import type { ClinicalSource, EvidenceClaim, QuestionVariant } from './pilot-schema';
import { validateSyntheticClinicalRelease, type SyntheticClinicalCase, type TestedConcept, type CaseExhibit, type AnswerChoiceTimingRegistryEntry } from './schema';
import ledger from '../../../docs/research/sources-question-topic-nutrition-support-metabolism-20261111.json';

/** Additive, explicit-import authoring lane. No default release or registry admission. */
export const NUTRITION_TOPIC_SLUG = 'nutrition-support-metabolism';
export const NUTRITION_TOPIC_DRAFT = {
  contentVersion: 'question-topic-nutrition-support-metabolism.2026-11-11.v1',
  reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
const prefix = `topic.${NUTRITION_TOPIC_SLUG}`;
const claim = (s: string) => `claim.${NUTRITION_TOPIC_SLUG}.${s}`;
const concept = (s: string) => `concept.${NUTRITION_TOPIC_SLUG}.${s}.v1`;
export const NUTRITION_TOPIC_IDS = {
  case: (s: string) => `case.${prefix}.${s}.v1`,
  node: (s: string) => `node.${prefix}.${s}.v1`,
  question: (s: string) => `question.${prefix}.${s}.v1`,
  choice: (s: string, c: string) => `choice.${prefix}.${s}.${c}.v1`,
};
interface Option {
  id: string; label: string; rationale: string; temptation: string; correctUnder: string;
  claims: string[]; timingProfileId?: string;
}
interface Gate {
  interpret: string; apply: string; closestChoice: string; decidingObservation: string;
  counterfactual: string; counterfactualChoice: string; deletionTest: string; cueAttack: string;
  stageAudit: string; predictedDifficulty: 'moderate' | 'hard'; difficultyReason: string;
  sequenceAudit: string; limitation: string;
}
interface DraftNode {
  slug: string; conceptId: string; previousConceptId?: string; conceptVersionReason?: string;
  creationKind: 'Rewrite' | 'new'; replacesInventoryIds: string[];
  identityRelation?: 'reuse_existing_meaning';
  objective: string; conceptType: TestedConcept['conceptType']; task: string; update: string;
  exhibit?: CaseExhibit; choices: Option[]; key: string; explanation: string; claims: string[]; gate: Gate;
}
interface DraftCase {
  slug: string; name: string; age: number; sex: 'Female' | 'Male'; complaint: string;
  presentation: string; historicalAcuity: 'stable' | 'urgent_stable'; nodes: DraftNode[];
}
const o = (id: string, label: string, rationale: string, temptation: string, correctUnder: string, claims: string[], timingProfileId?: string): Option =>
  ({ id, label, rationale, temptation, correctUnder, claims, ...(timingProfileId ? { timingProfileId } : {}) });
const table = (columnHeaders: string[], rowHeaders: string[], cells: string[][]): CaseExhibit => ({
  kind: 'table', caption: 'Original constructed teaching record; fictional patient observations', columnHeaders, rowHeaders, cells,
});
const labs = 'timing.test.basic_labs';

export const NUTRITION_TOPIC_DEFINITIONS: DraftCase[] = [
  {
    slug: 'perioperative-intake', name: 'Nora Bennett', age: 63, sex: 'Female', complaint: 'Preoperative weight loss', historicalAcuity: 'stable',
    presentation: '{patientName}, a 63-year-old woman, attends clinic before elective colectomy. Her weight remains above the usual reference range, but she now uses tighter belt holes and getting out of a chair has become harder. She leaves much of each meal. Albumin fell while C-reactive protein rose.',
    nodes: [
      {
        slug: 'risk-assessment', conceptId: 'concept.preoperative-nutrition.nutritional-risk-screening', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.673325eaba37e723'], conceptType: 'workup',
        objective: 'Choose structured nutrition assessment when intake and functional decline coexist with an inflammation-sensitive marker.',
        task: 'Which preoperative nutrition evaluation should Nora undergo next?', update: '',
        choices: [
          o('assessment', 'Dietitian assessment of intake, weight and muscle function', 'The intake and functional trajectory warrants structured assessment even at a higher body weight; inflammation limits the albumin interpretation.', 'Integrate the clinical trajectory rather than one marker.', 'The current trajectory supports this evaluation.', ['screen', 'albumin']),
          o('albumin', 'Serial albumin measurement after inflammatory markers settle', 'Repeating albumin may clarify its course but defers assessment of the already documented intake and functional changes.', 'Attribute the entire presentation to inflammation.', 'Stable intake, strength and weight with isolated inflammatory hypoalbuminemia would make laboratory follow-up more pertinent.', ['screen', 'albumin'], labs),
          o('protein-loss', 'Urine protein measurement and hepatic synthetic-function testing', 'A protein-loss or synthesis evaluation may be indicated by corresponding findings, but does not assess the nutritional trajectory shown here.', 'Treat a low albumin as a renal or hepatic problem before assessing intake.', 'Proteinuria, edema or signs of hepatic disease could prioritize that evaluation.', ['screen', 'albumin'], labs),
        ], key: 'assessment', explanation: 'Higher body weight does not remove nutritional risk when intake and function deteriorate. Assess the clinical trajectory rather than wait for albumin to behave as a nutrition marker.', claims: ['screen', 'albumin'],
        gate: {
          interpret: 'Distinguish poor intake and loss of function from isolated inflammatory hypoalbuminemia.', apply: 'Select a nutrition assessment instead of making the marker the prerequisite for assessment.', closestChoice: 'albumin', decidingObservation: 'Meal reduction and declining chair-rise function accompany the laboratory change.',
          counterfactual: 'If intake, strength and weight were unchanged and only albumin tracked an inflammatory flare, serial laboratory review would address a different, more limited question.', counterfactualChoice: 'albumin',
          deletionTest: 'The higher weight sustains a credible false reassurance error; chair-rise change and intake create the independent clinical signal. Remove either the inflammatory trajectory or clinical trajectory and the competing interpretation changes.',
          cueAttack: 'Removed the legacy named omission of a screen. Neither complaint nor task says malnutrition. Laboratory options are specific investigations with wait proposals; the key is not the sole cautious option.', stageAudit: 'All options are evaluations before a route prescription.', predictedDifficulty: 'moderate', difficultyReason: 'Inflammation provides a plausible competing attribution, while body weight can falsely reassure.', sequenceAudit: 'First node; later intake and tolerance results are not visible yet.', limitation: 'Screening is not a diagnosis; no proprietary screening instrument or invented cutoff.',
        },
      },
      {
        slug: 'oral-escalation', conceptId: 'concept.preoperative-nutrition.oral-enteral-first-line', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.a9ab124b7bd28df1'], conceptType: 'management', objective: 'Select enteral access after sustained failure of an implemented oral strategy with distal passage.',
        task: 'Which nutrition route should Nora use next after the documented oral treatment trial?',
        update: 'The dietitian introduced fortified meals and oral supplements. Over repeated reviews, fatigue ends meals after a few mouthfuls, weight continues to fall and consumed supplements remain mostly unfinished. Swallow assessment shows no aspiration. A contrast examination obtained for abdominal symptoms shows passage through stomach and small bowel without hold-up.',
        choices: [
          o('gastric', 'Nasogastric tube nutrition', 'The oral plan has actually failed while swallowing and gastrointestinal transit do not show a barrier to gastric tube delivery.', 'Use the functioning gastrointestinal route after an ineffective oral trial.', 'This observed route boundary applies.', ['enteral-next', 'pn-boundary']),
          o('oral', 'Fortified meals with additional oral supplements', 'The implemented strategy remains unable to supply intake because the patient cannot finish it; another oral prescription does not establish delivery.', 'Confuse an order for more supplements with actual intake.', 'Improving consumption and a narrowing deficit on the oral plan could justify continued oral optimization.', ['oral-first', 'delivered']),
          o('pn', 'Central parenteral nutrition', 'Neither oral failure nor low albumin establishes that enteral delivery is infeasible. Tube nutrition is the next route to assess.', 'Interpret oral failure as failure of the entire gut.', 'Persistent intolerance of appropriate enteral delivery or an enteral contraindication would support PN.', ['enteral-next', 'pn-boundary']),
        ], key: 'gastric', explanation: 'Interpret the failed trial as a problem delivering enough by mouth, then select a usable enteral route. Oral inadequacy and intestinal failure are different boundaries.', claims: ['oral-first', 'enteral-next', 'pn-boundary', 'delivered'],
        gate: {
          interpret: 'Recognize an unsuccessful implemented oral plan rather than an untried prescription.', apply: 'Choose gastric access because the observed failure is oral delivery, not downstream passage.', closestChoice: 'pn', decidingObservation: 'Repeated oral failure with preserved transit and swallow findings.', counterfactual: 'If tube delivery were also intolerable and no effective enteral route existed, central PN would become the appropriate alternative.', counterfactualChoice: 'pn', deletionTest: 'The actual trial, consumption trajectory and transit each establish a route boundary; no repeated normal-gut permission sentence is retained.', cueAttack: 'No key-only phrase such as safe enteral access appears. Three named nutrition routes have similar label length. The previous explanation teaches assessment, not this access choice.', stageAudit: 'All options select a nutrient-delivery route at the current stage.', predictedDifficulty: 'moderate', difficultyReason: 'The resident must separate oral failure from an intuitive escalation directly to PN.', sequenceAudit: 'New actual treatment response is required; deleting the update returns an assessment problem rather than proving tube feeding is needed.', limitation: 'Passage does not guarantee future enteral tolerance or absorption; the selected route requires monitored implementation.',
        },
      },
    ],
  },
  {
    slug: 'severe-preoperative-risk', name: 'Daniel Foster', age: 59, sex: 'Male', complaint: 'Surgery preparation', historicalAcuity: 'stable',
    presentation: '{patientName}, a 59-year-old man, attends clinic before a nonurgent major abdominal operation. He has lost 20% of his weight over six months and has a BMI of 17 kg/m2. Oral supplements and meals are tolerated but current consumption remains low. The surgical assessment records no obstruction, bleeding or other indication for urgent operation.',
    nodes: [{
      slug: 'preop-nutrition-timing', conceptId: concept('severe-risk-operative-timing'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Apply severe nutritional-risk findings to the timing of nonurgent surgery.', task: 'Which preparation plan best fits Daniel before his nonurgent operation?', update: '',
      choices: [
        o('nutrition', 'Defer surgery for supervised oral or enteral nutrition', 'The measured loss and low BMI cross directly supported severe-risk criteria. Nutrition treatment before nonurgent surgery is appropriate.', 'Use a clinically meaningful risk finding to alter preparation.', 'The severe-risk and nonurgent conditions are present.', ['severe-risk', 'preop-optimize', 'oral-first']),
        o('pn', 'Defer surgery for exclusive parenteral nutrition', 'Preoperative nutrition is indicated, but the functioning tolerated oral route does not establish the need for exclusive PN.', 'Equate the severity of nutritional risk with a need to bypass the gut.', 'Severe risk plus inability to meet requirements through an appropriate enteral route could justify preoperative PN.', ['preop-optimize', 'pn-boundary']),
        o('proceed', 'Proceed to surgery with postoperative nutrition treatment', 'Deferring support until after a nonurgent operation misses the preoperative risk-reduction opportunity.', 'Treat removal of the surgical disease as the only way to address nutritional decline.', 'A current urgent surgical indication could make proceeding with perioperative support preferable to delay.', ['preop-optimize']),
      ], key: 'nutrition', explanation: 'Interpret the weight/BMI observations as severe nutritional risk, then apply both urgency and route feasibility. Severe risk supports preoperative treatment; it does not independently select PN.', claims: ['severe-risk', 'preop-optimize', 'oral-first', 'pn-boundary'],
      gate: { interpret: 'Apply severe-risk criteria to observed loss and BMI.', apply: 'Balance the nonurgent operation against a preoperative treatment opportunity without over-escalating route.', closestChoice: 'pn', decidingObservation: 'Severe risk coexists with tolerated oral intake and a nonurgent procedure.', counterfactual: 'If obstruction prevented effective oral/enteral supply, preoperative PN would become appropriate for the same severe risk.', counterfactualChoice: 'pn', deletionTest: 'Urgency, actual weight loss, BMI and tolerance each change a named competing plan; no cancer-stage or arbitrary delay interval is added.', cueAttack: 'All options contain a timing and nutrition strategy. The task does not name severe risk or suggest postponement.', stageAudit: 'Same preoperative preparation decision, with parallel timing/route plans.', predictedDifficulty: 'moderate', difficultyReason: 'Severe depletion can prompt an unnecessary PN choice, while an operation-first instinct competes with optimization.', sequenceAudit: 'Standalone to prevent the earlier nutrition-route feedback from preselecting this answer.', limitation: 'One older direct surgical guideline. No exact delay duration is taught; clinician verifies the nonurgent decision.', },
    }],
  },
  {
    slug: 'delivery-reconciliation', name: 'Lena Ortiz', age: 66, sex: 'Female', complaint: 'Nutrition follow-up', historicalAcuity: 'stable',
    presentation: '{patientName}, a 66-year-old woman, brings her outside hospital nutrition record to clinic after prolonged postoperative intestinal dysfunction. PN was combined with a small jejunal feed. The dietitian reassessed energy and protein needs while intestinal delivery changed.',
    nodes: [
      {
        slug: 'supplement-delivered', conceptId: 'concept.n2r3.supplemental-pn-delivery-reconciliation', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.27d6a149cf2044df'], conceptType: 'management', objective: 'Reconcile supplemental PN with tolerated actual enteral delivery instead of the unachieved order.', task: 'Which change should Lena\'s hospital team make to the combined nutrition prescription at this review?',
        update: 'The jejunal order was increased. At the higher rate, abdominal distension repeatedly required a return to the prior rate. At that lower rate she had no vomiting. The following totals persisted through repeated reviews; the assessed requirements were unchanged.',
        exhibit: table(['Energy (kcal/day)', 'Protein (g/day)'], ['Assessed total need', 'PN actually delivered', 'Jejunal order', 'Jejunal delivery'], [['1900', '90'], ['1900', '90'], ['1400', '65'], ['600', '30']]),
        choices: [
          o('residual', 'Retain tolerated jejunal feeding and adjust supplemental PN', 'Actual jejunal delivery contributes nutrients, but the unachieved larger order cannot be counted as delivered. Reconcile PN to the remaining assessed need with ongoing monitoring.', 'Integrate route tolerance with cumulative delivery.', 'Partial enteral delivery remains inadequate but useful.', ['supplemental', 'delivered', 'pn-boundary']),
          o('full-pn', 'Pause jejunal feeding and retain the prior full PN', 'Failure at a higher rate does not erase documented lower-rate tolerance; the patient is receiving a usable enteral contribution.', 'Treat partial intolerance as a reason to abandon the route.', 'Loss of tolerance even at the lower rate or a new enteral contraindication could favor temporary exclusive PN.', ['supplemental', 'pn-boundary']),
          o('stop-pn', 'Stop PN and continue the increased jejunal prescription', 'This counts prescribed nutrients that were not actually delivered and leaves a substantial gap.', 'Use the larger order as evidence of recovered delivery.', 'Sustained tolerated enteral delivery that meets assessed needs could allow PN withdrawal.', ['delivered', 'pn-withdraw']),
        ], key: 'residual', explanation: 'The lower-rate enteral contribution is real; the higher-rate order is not achieved. Preserve the tolerated route and reassess supplemental PN against actual total delivery. This is an indication review, not a universal taper formula.', claims: ['supplemental', 'delivered', 'pn-boundary', 'pn-withdraw'],
        gate: { interpret: 'Separate an unachieved order from actual tolerated nutrient delivery.', apply: 'Preserve partial enteral nutrition while avoiding duplicate full PN.', closestChoice: 'stop-pn', decidingObservation: 'Higher-rate attempts fail; the lower rate is tolerated but supplies only part of assessed needs.', counterfactual: 'If repeated actual jejunal delivery reached assessed requirements with stable clinical tolerance, PN withdrawal would replace supplementation.', counterfactualChoice: 'stop-pn', deletionTest: 'Without the rate-response observations the table reduces to arithmetic; both are required to choose between correcting delivery and adding support.', cueAttack: 'Replaced the old task direction to use the administration record with a neutral combined-prescription task. The key contains no numeric record-matching shortcut.', stageAudit: 'Three route-and-supplement plans at the same review.', predictedDifficulty: 'hard', difficultyReason: 'The resident must avoid both double provision and premature discontinuation while recognizing partial rather than total enteral failure.', sequenceAudit: 'No earlier scored node; later recovery evidence is absent here.', limitation: 'The qualitative indication now has guideline support. Exact PN reduction amount/rate remains source-held and is not prescribed.', },
      },
      {
        slug: 'pn-withdrawal', conceptId: 'concept.n1.post-ileus-nutrition-route-reassessment', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.28c39606d0c916e0'], conceptType: 'management', objective: 'Reassess the PN indication using sustained oral delivery and clinical trajectory rather than stool passage alone.', task: 'Which nutrition route should Lena\'s team retain after the later review?',
        update: 'Later in the same admission, jejunal support was replaced by meals and drinks. Weighed consumption repeatedly matched her current individual energy/protein plan. Weight and function remained stable as PN was reduced, with no recurrent distension, vomiting or high-volume stool loss. Albumin remained low while inflammation persisted.',
        choices: [
          o('oral', 'Meals and oral supplements with withdrawal of PN', 'Sustained actual delivery and the response during PN reduction support removal of the former PN indication; albumin does not override this trajectory.', 'Use clinical response during transition to reassess the route.', 'The sustained intake/tolerance trajectory applies.', ['pn-withdraw', 'delivered', 'albumin']),
          o('combined', 'Meals and oral supplements with continuation of PN', 'The remaining low albumin does not establish a residual delivery failure after observed clinical stability during reduction.', 'Retain PN until an inflammatory laboratory marker normalizes.', 'A persistent nutrient gap or evidence of malabsorption despite intake would justify supplementation.', ['pn-boundary', 'albumin', 'delivered']),
          o('tube', 'Jejunal tube nutrition with withdrawal of oral supplements', 'The current oral plan is delivering nutrients without the former intolerance; replacement with a tube has no demonstrated delivery advantage here.', 'Treat previous tube use as a permanent requirement.', 'Failure to consume adequate oral nutrients with preserved enteral tolerance could warrant tube support.', ['enteral-next', 'pn-withdraw']),
        ], key: 'oral', explanation: 'Stool passage by itself would be insufficient. Here actual consumption and a stable trajectory while PN decreased support transition to oral support, even while albumin continues to reflect inflammation.', claims: ['pn-withdraw', 'delivered', 'albumin', 'enteral-next'],
        gate: { interpret: 'Use the observed response during PN reduction to judge whether oral supply is sustaining the patient.', apply: 'Withdraw the former route instead of treating low albumin as a continuing PN indication.', closestChoice: 'combined', decidingObservation: 'Stable clinical trajectory during PN reduction despite persistently low albumin.', counterfactual: 'If weight and function deteriorated during PN reduction despite recorded intake, a residual absorption/delivery problem would favor continued supplemental support.', counterfactualChoice: 'combined', deletionTest: 'The PN-reduction response earns its role beyond an exact target-matching sum; the update cannot be removed without losing the evidence for withdrawal.', cueAttack: 'Removed high-output-stoma fluid choices from the old version and kept all choices at nutrition-route scope. No target percentage or claim that intake equals absorption is supplied.', stageAudit: 'All options select the ongoing nutrition routes.', predictedDifficulty: 'moderate', difficultyReason: 'Persistently low albumin and historical dependence compete with a real monitored transition.', sequenceAudit: 'Earlier feedback supports partial PN at an earlier phase; the later clinical response must reverse that decision.', limitation: 'No stopping threshold, taper schedule or glucose protocol; excludes stoma-specific replacement.', },
      },
    ],
  },
  {
    slug: 'restart-chronology', name: 'Mira Collins', age: 54, sex: 'Female', complaint: 'Nutrition restart review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 54-year-old woman, attends clinic to review a completed hospital nutrition restart after weeks of very little intake. The initial sample was drawn before intravenous dextrose, meals or formula were given. Phosphate was already below range; potassium and magnesium were also low.',
    nodes: [
      {
        slug: 'baseline-attribution', conceptId: 'concept.n2.refeeding-baseline-phosphate-attribution', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.7db5902fa72086b3'], conceptType: 'workup', objective: 'Use exposure chronology to separate pre-existing depletion from evidence of a feeding-associated change.', task: 'Which interpretation of Mira\'s initial electrolyte results should guide the hospital restart assessment?', update: '',
        choices: [
          o('baseline', 'Pre-existing depletion with continued risk during nutrition restart', 'The sample predates nutrient exposure. It establishes a baseline abnormality, while prolonged low intake still requires monitored restart assessment.', 'Keep causal chronology and prospective risk separate.', 'The documented sample and exposure chronology apply.', ['preexisting', 'refeed-risk', 'not-specific']),
          o('syndrome', 'Feeding-associated depletion already established by the initial sample', 'A later exposure cannot explain a measurement obtained beforehand; the laboratory abnormalities are not by themselves proof of refeeding syndrome.', 'Call every low phosphate in an undernourished patient refeeding.', 'An appropriate postexposure clinical course with alternative causes assessed could support a feeding-associated syndrome.', ['preexisting', 'not-specific']),
          o('resolved', 'Corrected depletion after a completed monitored nutrition restart', 'The sample is an initial abnormality before any nutrition restart; neither correction nor a stable postrestart course is represented.', 'Read a later recovery state into a single baseline result.', 'A subsequently stable, adequately nourished course after completed monitored reintroduction would support this interpretation.', ['refeed-risk', 'monitor']),
        ], key: 'baseline', explanation: 'First establish the order of events. A pretreatment low phosphate value is baseline depletion, not evidence that a later feed caused it. Risk assessment and monitoring still matter as nutrition resumes.', claims: ['preexisting', 'not-specific', 'refeed-risk', 'monitor'],
        gate: { interpret: 'Recognize that the abnormality precedes every recorded calorie exposure.', apply: 'Retain prospective restart precautions while withholding causal overdiagnosis.', closestChoice: 'resolved', decidingObservation: 'Prolonged low intake persists as a risk context even after baseline replacement.', counterfactual: 'If a completed nutrition restart were followed by stable intake and serial biochemical/clinical stability, routine postrestart care would replace the acute restart-risk interpretation.', counterfactualChoice: 'resolved', deletionTest: 'The before-exposure timing defeats false attribution; prolonged low intake prevents the alternative false reassurance. Both are needed.', cueAttack: 'The key has two components but each option is a two-part interpretation. No supplied syndrome label or phosphate cutoff selects it.', stageAudit: 'All choices interpret evidence and its restart-risk implication, not disparate treatments.', predictedDifficulty: 'moderate', difficultyReason: 'The tempting correction-is-clearance error differs from the more obvious temporal attribution error.', sequenceAudit: 'First node; no prior prophylaxis explanation supplies the answer.', limitation: 'Not a diagnostic criteria item; no syndrome is diagnosed from this sample.', },
      },
      {
        slug: 'restart-thiamine', conceptId: 'concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.45f19e6e2532a3c3'], conceptType: 'management', objective: 'Apply antecedent undernutrition to thiamine planning despite correction of baseline electrolytes.', task: 'Which vitamin plan should Mira\'s team use before the planned nutrition restart?',
        update: 'Electrolyte replacement brought the next sample into the reporting intervals. Nutrition had not yet begun. Close electrolyte and clinical surveillance was arranged. Repeated oral tablet trials ended in vomiting; intravenous nutrition was being prepared.',
        choices: [
          o('thiamine', 'Give intravenous thiamine before nutrition starts', 'Correction of baseline electrolytes does not remove the undernutrition risk. Thiamine is recommended before nutrition, using a deliverable route when oral tablets are not retained.', 'Integrate ongoing risk with actual medication-route failure.', 'The at-risk restart and inability to retain tablets are present.', ['thiamine-before', 'thiamine-route', 'refeed-risk']),
          o('result', 'Give intravenous thiamine after electrolyte deterioration', 'This uses a complication as the trigger for a precaution recommended before feeding.', 'Let the improved blood sample defer preventive treatment.', 'A newly discovered risk or deficiency after an unanticipated course could prompt treatment then; known prefeeding risk calls for earlier prophylaxis.', ['thiamine-before', 'monitor']),
          o('oral-thiamine', 'Give oral thiamine before nutrition starts', 'The timing is appropriate but repeated oral medication vomiting makes the proposed route unreliable at this review.', 'Apply the prefeeding rule without checking whether the vitamin is delivered.', 'Retention of oral medication would make an oral thiamine plan reasonable.', ['thiamine-before', 'thiamine-route']),
          o('oral-after', 'Give oral thiamine after electrolyte deterioration', 'Deferring initiation and using an unretained route miss the current indication for deliverable prefeeding prophylaxis.', 'Treat correction as clearance and use the familiar route if a later problem appears.', 'A newly recognized deficiency after an unforeseen course with reliable tablet retention would be a different treatment stage.', ['thiamine-before', 'thiamine-route', 'monitor']),
        ], key: 'thiamine', explanation: 'The corrected sample addresses current electrolyte depletion, not the prospective restart risk. Plan thiamine before nutrition using a route that can actually deliver it, while monitoring continues. The exact regimen belongs to the treating team.', claims: ['thiamine-before', 'thiamine-route', 'refeed-risk', 'monitor'],
        gate: { interpret: 'Separate correction of current depletion from antecedent restart risk, and interpret actual tablet retention.', apply: 'Deliver prefeeding thiamine through a reliable route rather than merely order it or wait for another fall.', closestChoice: 'oral-thiamine', decidingObservation: 'Repeated oral tablet trials end in vomiting despite corrected electrolytes.', counterfactual: 'If oral medication were retained, oral thiamine before nutrition would become a reasonable route.', counterfactualChoice: 'oral-thiamine', deletionTest: 'The corrected sample sustains the clearance error; medication tolerance makes the route choice consequential. No named missing action previews the key.', cueAttack: 'Removed the named omission and vitamin matching. A second attack found majority convergence in three choices. Repaired to four balanced combinations: each route and each timing occurs twice; no majority creates the key. Re-solved from the risk history and medication retention.', stageAudit: 'All options are thiamine route/timing plans; shared monitoring stays in context.', predictedDifficulty: 'moderate', difficultyReason: 'A correct timing rule can still produce an undelivered precaution if actual medication retention is ignored.', sequenceAudit: 'Prior feedback retains monitoring but does not name thiamine or its route; the new tablet-response observation earns the later decision.', limitation: 'Consensus evidence; no exact regimen. Route selection is a constructed clinical application requiring clinician review.', },
      },
    ],
  },
  {
    slug: 'renal-ward-nutrition', name: 'Owen Clark', age: 65, sex: 'Male', complaint: 'Dialysis nutrition review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 65-year-old man, reviews his outside hospital nutrition plan in clinic. He received conventional chronic intermittent hemodialysis during a ward admission without acute or critical illness. Before admission, repeated postdialysis weights were near 70 kg without edema. The ward scale later read 88 kg after a large positive fluid balance and new dependent edema.',
    nodes: [
      {
        slug: 'renal-protein-reference', conceptId: 'concept.dialysis-nutrition.hospital-protein-target', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.33f1a303ca425e30'], conceptType: 'management', objective: 'Apply the stable hospitalized dialysis protein minimum using a defensible reference weight.', task: 'Which daily protein prescription best applies the ESPEN minimum to Owen\'s documented ward context?', update: '',
        choices: [
          o('84', '84 g protein per day', 'Use the usual approximately 70-kg weight rather than edema-associated mass; the stable hospitalized conventional-dialysis minimum is 1.2 g/kg/day.', 'Combine population-specific guidance with the weight trajectory.', 'The stated stable ward dialysis context and prior weights apply.', ['renal-protein', 'renal-weight']),
          o('106', '106 g protein per day', 'This applies the same multiplier to the edema-increased 88-kg scale value, mistaking retained fluid for the intended nutritional reference.', 'Use the most recent weight without interpreting fluid change.', 'If 88 kg were the established prehospital weight without fluid accumulation, this amount would approximate the same minimum.', ['renal-protein', 'renal-weight']),
          o('56', '56 g protein per day', 'This applies a lower nondialysis-level multiplier to the prior weight instead of the minimum for this hospitalized chronic-KRT population.', 'Carry a previous nondialysis restriction into a dialysis admission.', 'A stable nondialysis CKD prescription may use a lower range; it is a different population.', ['renal-protein']),
        ], key: '84', explanation: 'Interpret the weight change before calculating. The repeated prior postdialysis weights are the more appropriate reference here; 70 × 1.2 = 84 g/day. The 1.2 rule belongs to the stated hospitalized conventional-dialysis population.', claims: ['renal-protein', 'renal-weight'],
        gate: { interpret: 'Identify acute fluid accumulation rather than new nutritional mass.', apply: 'Use the stable hospital dialysis recommendation rather than a nondialysis or critical-care prescription.', closestChoice: '106', decidingObservation: 'Repeated prior postdialysis values and the acute fluid/edema trajectory.', counterfactual: 'If 88 kg were the established euvolemic prehospital weight, approximately 106 g/day would apply the same minimum.', counterfactualChoice: '106', deletionTest: 'The chronology and dialysis/acuity status each change a credible numerical alternative; no supplied selected reference or target rehearses both steps.', cueAttack: 'All labels are protein quantities with identical units. The task names the guideline population but does not supply its multiplier. No numerical outlier is used.', stageAudit: 'All options are daily protein prescriptions.', predictedDifficulty: 'moderate', difficultyReason: 'Population selection and edema interpretation must precede arithmetic; arithmetic is not the sole scored demand.', sequenceAudit: 'Standalone first node; does not reuse the accepted N2 exact case or its nonformula calorie exhibit.', limitation: 'A new variant reuses the stable construct; does not overwrite the N2 PASS or promote an outpatient target.', },
      },
      {
        slug: 'renal-energy-revision', conceptId: 'concept.dialysis-nutrition.avoid-calorie-overfeeding', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.7fd96f844016998d'], conceptType: 'management', objective: 'Correct unnecessary energy excess without using nitrogen balance as a calorie-escalation target.', task: 'Which energy prescription should Owen\'s hospital team use at the later review?',
        update: 'Protein delivery was corrected. Repeated energy assessments were unchanged, but additional carbohydrate had been added after nitrogen balance remained negative. Total delivery now exceeded the assessment and glucose rose. No new increase in activity or measured expenditure accompanied the change.',
        choices: [
          o('assessed', 'Return total energy to the assessed requirement', 'A negative nitrogen balance does not justify the demonstrated surplus; reassess illness and protein factors separately.', 'Respond to measured need and tolerance rather than chase nitrogen balance.', 'The current documented energy excess applies.', ['renal-energy']),
          o('lipid', 'Replace the excess carbohydrate with equal lipid energy', 'Changing substrate while retaining the surplus does not correct energy overdelivery.', 'Attribute the entire problem to carbohydrate rather than total energy.', 'A substrate-specific tolerance issue at an appropriate total energy level could justify an isocaloric composition change.', ['renal-energy']),
          o('escalate', 'Increase total energy until nitrogen balance becomes positive', 'This makes nitrogen balance the endpoint of calorie dosing despite an unchanged energy assessment and emerging intolerance.', 'Treat negative nitrogen balance as proof of an energy shortfall.', 'An actual energy deficit demonstrated on reassessment could warrant increased provision, without targeting unlimited positive nitrogen balance.', ['renal-energy']),
        ], key: 'assessed', explanation: 'The assessment and actual delivery show excess energy. Correct the surplus rather than exchange its substrate or increase calories further to manipulate nitrogen balance.', claims: ['renal-energy'],
        gate: { interpret: 'Distinguish energy excess from persistent protein catabolism.', apply: 'Correct the excess rather than use substrate exchange as a substitute for energy reassessment.', closestChoice: 'lipid', decidingObservation: 'Total energy exceeds an unchanged assessment, not merely a glucose abnormality at appropriate intake.', counterfactual: 'If total energy matched needs but carbohydrate-specific intolerance persisted, an isocaloric substrate revision could become reasonable.', counterfactualChoice: 'lipid', deletionTest: 'The assessed-versus-delivered difference resolves total excess; glucose makes the substrate-switch near miss credible. Negative balance explains why the surplus was introduced.', cueAttack: 'Removed caricatures such as doubling calories and option explanations. Each label names a plausible prescription strategy.', stageAudit: 'All choices revise energy provision rather than mix calorie plans with diagnoses.', predictedDifficulty: 'moderate', difficultyReason: 'The attractive switch-to-lipid response treats a symptom of overfeeding while retaining the excess.', sequenceAudit: 'Earlier protein feedback does not determine a later energy prescription; new assessment/delivery evidence is required.', limitation: 'Single direct renal guideline; no glucose treatment dose or nitrogen-balance cutoff.', },
      },
    ],
  },
  {
    slug: 'renal-critical-record', name: 'Ava Morgan', age: 61, sex: 'Female', complaint: 'Hospital nutrition questions', historicalAcuity: 'stable',
    presentation: '{patientName}, a 61-year-old woman, attends clinic after an outside ICU admission complicated by acute kidney injury. You review the hospital nutrition decisions during infection recovery, when urea remained elevated and kidney-replacement therapy was being considered.',
    nodes: [
      {
        slug: 'aki-protein-restriction', conceptId: concept('aki-protein-versus-krt-delay'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Distinguish nutritional protein needs from an attempt to postpone KRT by underfeeding.', task: 'Which protein strategy best fits Ava\'s recorded acute hospital illness?', update: 'Muscle wasting progressed and delivered protein was below the nutrition team\'s current prescription. A proposed order would reduce protein further to lower urea and postpone KRT. The team was evaluating the indication for KRT separately.',
        choices: [
          o('assessed', 'Provide the assessed acute-illness protein plan', 'Do not compound the demonstrated shortfall solely to delay KRT. The acute illness and nutritional assessment differ from a stable predialysis restriction.', 'Keep nutrition and KRT indication assessments connected but distinct.', 'The active illness, wasting and delivered shortfall are present.', ['renal-no-restrict', 'renal-dialysis-loss', 'delivered']),
          o('restrict', 'Reduce protein to a stable predialysis CKD plan', 'This transfers a stable chronic-disease restriction into acute catabolic illness despite the observed shortfall.', 'Use urea as the sole reason to restrict nutrition.', 'A stable nonacute nondialysis CKD context is a different prescription population.', ['renal-no-restrict', 'renal-protein']),
          o('dextrose', 'Replace the missing protein with additional dextrose', 'Nonprotein calories do not supply the missing amino-acid contribution and can create energy excess.', 'Try to spare protein by replacing the deficit with carbohydrate.', 'A genuine energy deficit with protein already appropriate could support additional nonprotein energy.', ['renal-no-restrict', 'renal-energy']),
        ], key: 'assessed', explanation: 'An elevated urea value does not establish that nutritional protein should be withheld to delay KRT. Interpret acute illness and actual delivery, then maintain an appropriate protein plan while the renal team assesses KRT indications.', claims: ['renal-no-restrict', 'renal-dialysis-loss', 'renal-protein', 'delivered', 'renal-energy'],
        gate: { interpret: 'Recognize acute catabolism and a real protein delivery shortfall rather than stable chronic dietary restriction.', apply: 'Reject underfeeding as a method of postponing KRT.', closestChoice: 'restrict', decidingObservation: 'Active acute illness with wasting and inadequate delivered protein.', counterfactual: 'In stable nonacute CKD without KRT, a lower chronic protein prescription could fit a different evidence population.', counterfactualChoice: 'restrict', deletionTest: 'Urea explains the tempting restriction; acute illness and the delivery/wasting trajectory distinguish the guideline population.', cueAttack: 'The key does not contain a unique complete bundle. All choices are protein/substrate prescriptions. The task does not announce the KRT-delay prohibition.', stageAudit: 'All options address the nutrition prescription while KRT assessment is shared background care.', predictedDifficulty: 'hard', difficultyReason: 'The resident must resist applying stable renal restriction to catabolic acute illness and avoid confusing urea control with nutritional adequacy.', sequenceAudit: 'New case; the earlier stable dialysis minimum is not displayed and is not applied to acute illness.', limitation: 'No exact critical-care protein target or KRT trigger; one direct renal guideline.', },
      },
      {
        slug: 'renal-calorie-sources', conceptId: concept('krt-energy-source-reconciliation'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Include kidney-replacement substrate calories without scaling protein to remove an energy surplus.', task: 'Which revision should Ava\'s hospital team make after KRT began?', update: 'Later, the hospital team used continuous KRT. The circuit record supplied a daily estimate of metabolized citrate/glucose energy. Formula energy still equaled the entire measured energy plan before that contribution was added. Delivered protein remained below the separate current assessment.',
        choices: [
          o('energy', 'Reduce formula energy while correcting the protein shortfall', 'Count the extra circuit-derived energy in the total while retaining the separately assessed protein requirement.', 'Reconcile all energy sources without treating protein and calories as interchangeable.', 'The current excess energy and low protein coexist.', ['renal-extras', 'renal-energy', 'renal-dialysis-loss']),
          o('volume', 'Reduce formula volume with proportional protein reduction', 'This removes excess energy at the cost of worsening an existing protein shortfall; composition needs separate review.', 'Assume scaling the entire formula solves both targets.', 'If both energy and protein delivery exceeded their current assessments, proportional reduction might fit.', ['renal-extras', 'renal-dialysis-loss']),
          o('unchanged', 'Retain formula energy and increase protein concentration', 'This addresses protein but ignores the extra nonformula calories and preserves energy excess.', 'Treat calories from the circuit as outside the nutrition total.', 'If extra circuit-derived energy were absent and total energy matched assessment, increasing protein concentration could address an isolated deficit.', ['renal-extras', 'renal-energy']),
        ], key: 'energy', explanation: 'Count metabolized circuit substrates as energy and assess protein independently. A single proportional change to the whole formula need not solve opposite protein and energy discrepancies.', claims: ['renal-extras', 'renal-energy', 'renal-dialysis-loss'],
        gate: { interpret: 'Identify circuit-derived calories as part of total delivery, alongside a separate protein deficit.', apply: 'Choose a composition revision instead of a proportional volume change or protein-only correction.', closestChoice: 'volume', decidingObservation: 'Energy is above assessment while protein is below its separate assessment.', counterfactual: 'If both energy and protein were excessive, proportional formula reduction could be appropriate.', counterfactualChoice: 'volume', deletionTest: 'Removing either the circuit contribution or the protein shortfall changes the preferred plan; no conversion-factor arithmetic is decorative.', cueAttack: 'Three similarly scoped energy/protein revisions; no option gets a unique cautious monitoring bundle. The chart provides substrate accounting observations rather than a conclusion to count them.', stageAudit: 'All choices revise the formula, with KRT already in place.', predictedDifficulty: 'hard', difficultyReason: 'The closest correction solves energy while worsening protein; the resident must reconcile two independently assessed constraints.', sequenceAudit: 'Earlier feedback discusses protein restriction, not circuit energy. New KRT exposure changes the evidence.', limitation: 'Patient-specific circuit energy is supplied as a constructed estimate; no universal citrate/glucose absorption or protein target.', },
      },
    ],
  },
  {
    slug: 'chyle-record', name: 'Henry Patel', age: 64, sex: 'Male', complaint: 'Drainage follow-up', historicalAcuity: 'stable',
    presentation: '{patientName}, a 64-year-old man, attends clinic after retroperitoneal surgery. You review outside hospital nutrition decisions for a leak confirmed by fluid chylomicrons. The drain relieved abdominal pressure. The dietitian recorded intake and output during two formula periods.',
    nodes: [
      {
        slug: 'chyle-composition', conceptId: 'concept.n3.chyle-leak-diet-composition-versus-calories', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.58ff6eb4a4b8d4e1'], conceptType: 'management', objective: 'Correct both an energy shortfall and fat composition without attributing output change to one confounded exposure.', task: 'Which replacement nutrition prescription should Henry\'s hospital team trial at this stage?', update: 'During both periods, creatinine and electrolytes remained stable and replacement needs did not increase. The oral route remained tolerated. Protein delivery was unchanged. Energy and fat composition changed together.',
        exhibit: table(['Energy relative to assessed need', 'Long-chain fat', 'Medium-chain fat', 'Drain course'], ['Earlier formula', 'Later formula', 'Proposed A', 'Proposed B', 'Proposed C', 'Proposed D'], [['60%', 'Lower', 'Higher', 'Falling'], ['100%', 'Higher', 'Lower', 'Rising'], ['100%', 'Lower', 'Higher', 'Not yet observed'], ['100%', 'Higher', 'Lower', 'Not yet observed'], ['60%', 'Lower', 'Higher', 'Not yet observed'], ['60%', 'Higher', 'Lower', 'Not yet observed']]),
        choices: [
          o('a', 'Trial nutrition prescription A', 'This preserves the intended energy provision while moving fat composition toward the supported lymph-flow strategy. The past periods do not isolate a causal ingredient effect.', 'Combine appropriate composition with adequate delivery.', 'The currently tolerated oral route and nonprogressive losses support a monitored trial.', ['chyle-fat', 'chyle-compose', 'delivered']),
          o('b', 'Trial nutrition prescription B', 'Energy is supplied but the fat composition remains the less appropriate one for the lymphatic-loss strategy.', 'Treat achieved energy as proof the formula fits the leak.', 'A patient without a reason for intestinal lymph-flow reduction could have a different fat-composition goal.', ['chyle-fat', 'chyle-compose']),
          o('c', 'Trial nutrition prescription C', 'Returning to a prior lower-output period also returns to a demonstrated energy deficit; output response does not establish that deliberate underfeeding is the best complete plan.', 'Select the earlier output trajectory without reconciling nutrition.', 'A temporary medically directed restriction during a different unstable course would require a separate complete support plan.', ['chyle-compose', 'delivered']),
          o('d', 'Trial nutrition prescription D', 'This retains both the energy deficit and the less appropriate fat pattern.', 'Anchor on an earlier total volume instead of composition and actual need.', 'Different assessed needs and absence of a lymphatic-loss constraint would change the prescription problem.', ['chyle-compose', 'delivered']),
        ], key: 'a', explanation: 'The historical changes are confounded. Use the supported fat strategy while correcting the energy shortfall, then observe response. The record does not prove which past change caused the output difference.', claims: ['chyle-fat', 'chyle-compose', 'delivered'],
        gate: { interpret: 'Recognize that energy and fat changed together, so lower output cannot validate underfeeding.', apply: 'Choose a supported composition at the assessed energy provision.', closestChoice: 'c', decidingObservation: 'The lower-output period also delivered only part of the assessed energy requirement.', counterfactual: 'If the assessed energy need itself were lower so the earlier delivery met it, the earlier lower-energy-labelled prescription would no longer represent underfeeding.', counterfactualChoice: 'c', deletionTest: 'The output record makes return-to-earlier-formula tempting; delivery data must defeat that error. Stable losses/chemistries limit a route-escalation question without pretending all chyle leaks favor oral feeding.', cueAttack: 'Balanced 2x2 components occur equally across the four proposed plans. No unique majority component or explanatory key label. Removed direct olive-oil-to-fat-restriction cue.', stageAudit: 'All choices are formula prescriptions with the same protein/route scope.', predictedDifficulty: 'hard', difficultyReason: 'A real response trend favors the wrong energy decision unless the resident interprets the confounding and support objective.', sequenceAudit: 'First node; the later refractory trajectory is not visible.', limitation: 'Single older narrative source. No output cutoff or duration; exact patient boundary still needs clinician review.', },
      },
      {
        slug: 'refractory-chyle-route', conceptId: concept('chyle-nutrition-route-after-failed-diet'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Escalate nutrition route when monitored fat modification does not control consequential losses.', task: 'Which nutrition route should Henry\'s hospital team select during the later course?', update: 'Later, delivered records confirmed the intended long-chain-fat restriction and adequate protein/energy intake. Drain losses nevertheless increased on successive reviews, weight fell and fluid/electrolyte replacement needs rose. Drainage and specialist leak evaluation continued.',
        choices: [
          o('pn', 'PN with temporary cessation of enteral feeding', 'The later trajectory shows failure of a monitored dietary strategy with consequential losses; bowel rest and PN are a supported option while the leak is reassessed.', 'Use actual failure rather than a fixed output rule.', 'Progressive losses despite the verified dietary strategy apply.', ['chyle-pn', 'chyle-compose']),
          o('jejunal', 'Postpyloric delivery of the same fat-modified formula', 'Moving the same nutrients beyond the stomach does not bypass intestinal lymphatic absorption or the demonstrated leak response.', 'Apply a gastric-failure solution to an intestinal lymph-flow problem.', 'Gastric intolerance with an effective downstream feeding strategy would support postpyloric access.', ['chyle-fat', 'chyle-pn', 'postpyloric']),
          o('oral', 'Continued oral delivery of the same fat-modified plan', 'Earlier stability no longer describes the later progressive loss course; actual failure warrants route reassessment.', 'Persist with a once-reasonable initial strategy despite deterioration.', 'Falling losses with stable nutritional and volume status could favor continued monitored oral treatment.', ['chyle-compose', 'chyle-pn']),
        ], key: 'pn', explanation: 'This decision comes from the later failure trajectory, not the diagnosis label or drain appearance. PN and bowel rest are a nutrition option while source evaluation continues; they do not replace evaluation of the leak.', claims: ['chyle-pn', 'chyle-compose', 'chyle-fat', 'postpyloric'],
        gate: { interpret: 'Recognize failure despite verified composition and delivery rather than nonadherence or a calorie gap.', apply: 'Select a route that bypasses intestinal nutrient-related lymph flow.', closestChoice: 'jejunal', decidingObservation: 'The problem persists beyond gastric delivery and progresses despite the correct composition.', counterfactual: 'If gastric intolerance prevented delivery but an intestinal lymphatic-loss problem were absent, postpyloric feeding could be the route correction.', counterfactualChoice: 'jejunal', deletionTest: 'Adherence, the serial loss course and physiological consequences each establish why the first strategy is no longer sufficient.', cueAttack: 'The earlier explanation endorses monitored treatment, not automatic success. Three named route plans have comparable scope; no long-chain-enrichment caricature.', stageAudit: 'All choices select ongoing nutrition route; source evaluation and drainage are common background care.', predictedDifficulty: 'hard', difficultyReason: 'The usual enteral-first heuristic competes with the need to bypass a demonstrably unsuccessful intestinal strategy.', sequenceAudit: 'The later deterioration reverses the earlier reasonable formula trial. Feedback from node one does not include the escalation key.', limitation: 'Sparse comparative evidence and one older review; no mandatory failure interval or numerical output threshold. Clinical sign-off must confirm this exact ranking.', },
      },
    ],
  },
  {
    slug: 'airway-feeding-record', name: 'Grace Turner', age: 58, sex: 'Female', complaint: 'Feeding plan review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 58-year-old woman, attends clinic after a prolonged outside airway admission. You review the hospital feeding decisions. Trial sips passed below the vocal cords on the swallowing examination. Gastric tube feeds were delivered without regurgitation and maintained the assessed nutrition plan.',
    nodes: [
      {
        slug: 'swallow-versus-gut', conceptId: 'concept.n3.swallowing-failure-versus-intestinal-failure', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.847a7a61964a4bc4'], conceptType: 'management', objective: 'Distinguish oral aspiration from failure of a successful gastric enteral route.', task: 'Which nutrition route should Grace\'s hospital team retain at the documented review?', update: 'The team was considering discharge while swallowing rehabilitation continued. Weight and clinical hydration remained stable on the delivered gastric plan.',
        choices: [
          o('gastric', 'Gastric tube nutrition', 'The unsafe oral route is separate from the gastric route already delivering effective nutrition.', 'Localize the route failure before escalating support.', 'The current gastric delivery and tolerance are sustained.', ['swallow', 'enteral-next', 'delivered']),
          o('pn', 'Central parenteral nutrition', 'Oral aspiration does not establish enteral failure when gastric feeding is effective.', 'Treat inability to swallow as intestinal failure.', 'No effective oral or enteral route would favor PN.', ['swallow', 'pn-boundary']),
          o('oral', 'Oral food and supplements', 'Adequate gastrointestinal function does not resolve the observed swallowing/airway problem.', 'Use nutritional adequacy to overrule oral-route safety.', 'A later swallowing reassessment showing a safe and sufficient oral route would support oral transition.', ['swallow', 'oral-first']),
        ], key: 'gastric', explanation: 'Localize the failure. The swallowing examination limits oral intake; actual successful gastric delivery supports continued tube nutrition rather than PN.', claims: ['swallow', 'enteral-next', 'delivered', 'pn-boundary', 'oral-first'],
        gate: { interpret: 'Locate aspiration during oral swallowing while evaluating a separately functioning tube route.', apply: 'Maintain the effective route instead of bypassing the gut or resuming unsafe oral intake.', closestChoice: 'pn', decidingObservation: 'Gastric feeding itself is delivered without regurgitation and sustains the clinical trajectory.', counterfactual: 'If no effective enteral route existed, PN would become reasonable despite unchanged swallowing findings.', counterfactualChoice: 'pn', deletionTest: 'The swallow observation establishes oral risk; actual gastric delivery and trajectory establish the usable alternative. Either alone is insufficient.', cueAttack: 'No diagnostic label announces intestinal failure. Three route labels are parallel; prior finite profiles are replaced by one constrained adult profile for review.', stageAudit: 'All options select ongoing nutrient-delivery route.', predictedDifficulty: 'moderate', difficultyReason: 'The real competing error is conflating two anatomically distinct route failures; this remains at the lower end of moderate.', sequenceAudit: 'First node, with no later regurgitation findings visible.', limitation: 'Tube feeding does not guarantee freedom from aspiration. Clinical difficulty may be lower than intended; no accepted basic exception claimed.', },
      },
      {
        slug: 'gastric-aspiration-route', conceptId: 'concept.nutrition.gastric-versus-postpyloric-delivery.v1', identityRelation: 'reuse_existing_meaning', creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Select a postpyloric trial after recurrent gastric regurgitation with downstream passage.', task: 'Which nutrition route should Grace\'s hospital team trial during the later course?', update: 'Later, formula repeatedly appeared in her mouth during gastric feeding and respiratory deterioration followed those events. This continued after head elevation, a slower continuous schedule and a prokinetic trial. Contrast imaging showed gastric retention with passage through the duodenum and small bowel. Swallowing remained impaired.',
        choices: [
          o('jejunal', 'Nasojejunal tube nutrition', 'Recurrent gastric regurgitation despite initial measures supports a monitored postpyloric strategy when the downstream route remains usable.', 'Localize the delivery problem to the gastric compartment.', 'The current gastric failure and downstream passage apply.', ['postpyloric', 'pn-boundary']),
          o('pn', 'Central parenteral nutrition', 'PN remains possible if enteral support is infeasible or insufficient, but this record supports trying a downstream enteral route first.', 'Treat recurrent gastric failure as failure of all enteral access.', 'Failure or contraindication of an appropriate postpyloric route would favor PN.', ['postpyloric', 'pn-boundary']),
          o('gastrostomy', 'Gastrostomy tube nutrition', 'A different access into the same gastric compartment does not address the represented retention/regurgitation.', 'Assume a durable access removes gastric aspiration risk.', 'A durable access requirement with adequate gastric tolerance could support gastrostomy.', ['postpyloric', 'swallow']),
        ], key: 'jejunal', explanation: 'The later course establishes gastric delivery failure despite measures that were reasonable initially. Postpyloric feeding is a conditional enteral strategy; it cannot guarantee prevention of aspiration, especially of secretions.', claims: ['postpyloric', 'pn-boundary', 'swallow'],
        gate: { interpret: 'Separate aspiration/regurgitation during gastric delivery from the earlier aspiration during swallowing.', apply: 'Try a downstream enteral route before assigning total intestinal failure.', closestChoice: 'pn', decidingObservation: 'Gastric retention/regurgitation persists despite measures while distal contrast passage is present.', counterfactual: 'If downstream feeding were also infeasible or repeatedly failed, PN would become the next route.', counterfactualChoice: 'pn', deletionTest: 'Actual gastric events and prior measures distinguish this from oral aspiration or a mere interrupted schedule; distal passage supports a specific route trial without guaranteeing absorption.', cueAttack: 'No phrase announces a safe available jejunal route. All three options name access routes; gastrostomy is a credible mistaken durability solution rather than oral feeding already ruled unsafe.', stageAudit: 'All options select the next access/route strategy, with continued airway management common.', predictedDifficulty: 'hard', difficultyReason: 'The resident must reinterpret a changed route-specific failure instead of repeating the earlier successful gastric plan.', sequenceAudit: 'Earlier feedback explicitly applies to successful gastric delivery. New actual regurgitation must change the decision; no future event is revealed early.', limitation: 'New clinical draft with direct HEN support and adult ICU cross-check. The inherited owner hold on question.n3.swallowing-failure-versus-intestinal-failure.v2 remains unresolved; this draft is not a decision on it.', },
      },
    ],
  },
  {
    slug: 'ileus-support-record', name: 'Miles Evans', age: 67, sex: 'Male', complaint: 'Postoperative recovery review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 67-year-old man, attends clinic after colectomy and reviews his outside hospital nutrition record. Before surgery he had prolonged poor intake and muscle loss. On postoperative day ten, nasogastric output remained substantial. CT showed diffuse dilation through the colon without a focal transition; the surgical reassessment identified no mechanical obstruction.',
    nodes: [
      {
        slug: 'ileus-support', conceptId: 'concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.d7175604050d6fa9'], conceptType: 'management', objective: 'Distinguish nutritional-support need from day-count or a presumed motility treatment during prolonged enteral infeasibility.', task: 'Which nutrition route should Miles\' hospital team use at this documented review?', update: 'Repeated gastric and postpyloric feeding attempts caused vomiting and increased distension even at reduced delivery. Intake remained far below assessed needs. The hospital nutrition team would supervise the restart with thiamine, electrolyte replacement and clinical monitoring.',
        choices: [
          o('pn', 'Parenteral nutrition with monitored initiation', 'Prolonged inadequate delivery and actual failure of both enteral approaches establish an indication for nutritional support via PN.', 'Use actual route failure and depletion rather than the postoperative day alone.', 'The stated monitored prolonged enteral-infeasibility context applies.', ['pn-boundary', 'refeed-risk', 'monitor']),
          o('jejunal', 'Postpyloric nutrition with monitored escalation', 'The represented postpyloric attempt has also failed; merely bypassing the stomach has not supplied nutrition.', 'Reuse the gastric-failure solution after distal delivery also failed.', 'Isolated gastric intolerance with successful postpyloric delivery would favor this route.', ['postpyloric', 'pn-boundary']),
          o('gastric', 'Gastric nutrition with continuous low-rate delivery', 'Lower-rate gastric delivery was already unsuccessful and the sustained nutrient gap is unresolved.', 'Repeat a general enteral-first rule despite the observed failure boundary.', 'Tolerated lower-rate gastric delivery with a manageable deficit would support an enteral-based strategy.', ['enteral-next', 'pn-boundary']),
        ], key: 'pn', explanation: 'The route decision depends on depletion, duration of inadequate delivery and actual enteral failure. PN supplies nutrients while intestinal dysfunction is reassessed; it does not itself restore motility.', claims: ['pn-boundary', 'refeed-risk', 'monitor', 'postpyloric', 'enteral-next', 'pn-not-motility'],
        gate: { interpret: 'Recognize failure beyond a single gastric attempt in a depleted patient with a sustained deficit.', apply: 'Choose monitored PN support while retaining the distinction between nutrition and treatment of the bowel disorder.', closestChoice: 'jejunal', decidingObservation: 'Postpyloric feeding as well as gastric feeding was actually attempted and failed.', counterfactual: 'If only gastric feeding failed and a postpyloric trial was tolerated, enteral support would replace exclusive PN.', counterfactualChoice: 'jejunal', deletionTest: 'The low intake history, actual attempts, prolonged course and CT context each constrain route and care stage. The day number is an observation, not a universal PN trigger.', cueAttack: 'Removed the legacy nonfunctional-gut conclusion and overtly absurd maintenance-fluid/operation alternatives. All three choices are monitored nutrition-delivery strategies.', stageAudit: 'Same nutrient route stage; workup and restart supervision are shared context.', predictedDifficulty: 'moderate', difficultyReason: 'A postpyloric strategy is a credible near miss unless its actual failure is interpreted.', sequenceAudit: 'First node; later improvement on PN has not occurred.', limitation: 'Old stable concept has a narrower beyond-seven-day definition; the new case remains within it. No earlier universal PN-timing inference.', },
      },
      {
        slug: 'pn-response-versus-function', conceptId: 'concept.n2.parenteral-response-versus-bowel-recovery', creationKind: 'Rewrite', replacesInventoryIds: ['inventory.5d5b20c9ff9f8253'], conceptType: 'management', objective: 'Do not treat nutritional improvement on PN as evidence enteral function has recovered.', task: 'Which nutrition plan should Miles\' team use after the later feeding trial?', update: 'Later, strength and wound granulation improved during PN. A new enteral trial again caused vomiting and distension, so actual enteral delivery remained small. Imaging continued to show diffuse dilation without a focal transition. The current assessed nutrition need was unchanged.',
        choices: [
          o('retain', 'Continue PN while enteral tolerance is reassessed', 'Improvement during PN supports delivery of nutrients, not recovered gut function. The repeat trial still fails to supply assessed needs.', 'Read the nutrition response and gut response as different outcomes.', 'The later feeding failure remains present.', ['pn-not-motility', 'pn-boundary', 'delivered']),
          o('withdraw', 'Withdraw PN and retain the current enteral plan', 'The current actual enteral delivery remains inadequate; improved strength on PN is not proof the alternate route can sustain it.', 'Infer route independence from the response to PN.', 'Sustained enteral adequacy during monitored PN reduction could support withdrawal.', ['pn-withdraw', 'pn-not-motility']),
          o('increase', 'Increase PN energy while restricting further enteral trials', 'There is no demonstrated increase in nutritional need; persistent bowel dysfunction does not by itself justify excess PN calories.', 'Treat failure of motility recovery as failure of nutrient dosing.', 'A newly assessed unmet energy requirement would justify revising nutrient delivery, rather than a generic increase for persistent ileus.', ['pn-boundary', 'delivered']),
        ], key: 'retain', explanation: 'Two outcomes diverged: nutritional recovery improved while enteral tolerance did not. Continue indicated support and reassess the route; do not interpret PN response as proof of bowel recovery or a reason to exceed assessed need.', claims: ['pn-not-motility', 'pn-boundary', 'pn-withdraw', 'delivered'],
        gate: { interpret: 'Separate improvement under nutritional support from the failed test of the alternate route.', apply: 'Maintain indicated support instead of withdrawing or escalating calories from the wrong outcome.', closestChoice: 'withdraw', decidingObservation: 'A new enteral trial remains unsuccessful despite improved strength during PN.', counterfactual: 'If actual enteral delivery sustained requirements during monitored PN reduction, withdrawal would become appropriate.', counterfactualChoice: 'withdraw', deletionTest: 'Both the nutritional response and the failed enteral trial are needed to create and resolve the competing inference; removing the update removes the new decision.', cueAttack: 'The earlier explanation says PN is support, but cannot answer this node without the new trial result. Options compare concrete ongoing prescriptions; no option says PN cures ileus.', stageAudit: 'All options are nutrition plans at reassessment, not diagnostic tests mixed with treatments.', predictedDifficulty: 'moderate', difficultyReason: 'The tempting mistake transfers success of one outcome to a different, actually tested function.', sequenceAudit: 'A distinct later response assessment; earlier feedback does not establish the result of this actual trial.', limitation: 'No guarantee that absent focal transition excludes every evolving mechanical problem; ongoing clinical reassessment remains necessary.', },
      },
    ],
  },
  {
    slug: 'micronutrient-wound', name: 'Isabel Reed', age: 62, sex: 'Female', complaint: 'Bruising and wound delay', historicalAcuity: 'stable',
    presentation: '{patientName}, a 62-year-old woman, attends clinic for slow closure of a superficial incision and bruising. Her restricted food record contains starches, dairy and meat but no fruit or vegetables for months. She has bleeding gums and pinpoint hemorrhages around hair follicles. Platelet count and coagulation tests are within their reporting intervals; protein intake meets the dietitian\'s current assessment.',
    nodes: [{
      slug: 'vitc-directed-support', conceptId: concept('ascorbate-deficiency-clinical-application'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Use a deficiency-compatible pattern to target micronutrient support instead of applying blanket wound supplementation.', task: 'Which micronutrient-directed intervention best fits Isabel\'s findings while wound assessment continues?', update: '',
      choices: [
        o('c', 'Oral vitamin C replacement', 'The dietary pattern and mucocutaneous findings support vitamin C deficiency. This is a targeted deficiency assessment, distinct from prescribing ascorbate for every delayed wound.', 'Integrate intake with connective-tissue findings.', 'The present combined dietary and physical pattern applies.', ['vitc-deficiency', 'vitc-collagen']),
        o('k', 'Oral vitamin K replacement', 'Vitamin K deficiency can prompt a bleeding assessment, but the normal coagulation results and perifollicular/gingival pattern favor a connective-tissue nutrient problem here.', 'Treat every nutritional bleeding presentation as a coagulation-factor deficiency.', 'A compatible coagulation abnormality with an appropriate history would favor a vitamin-K-directed evaluation.', ['vitc-deficiency', 'vitk-bleeding']),
        o('protein', 'Oral protein fortification', 'Protein deficiency matters in wound care, but the documented protein plan does not account for this selective diet and physical findings.', 'Attribute any wound delay to protein shortage.', 'A demonstrated protein delivery deficit without the selective micronutrient pattern would support protein-directed revision.', ['delivered', 'vitc-deficiency']),
      ], key: 'c', explanation: 'Interpret the restrictive diet together with gingival and perifollicular findings. Target deficiency evaluation and correction rather than equating a nutrient\'s collagen role with a blanket postoperative treatment indication.', claims: ['vitc-deficiency', 'vitc-collagen', 'vitk-bleeding', 'delivered'],
      gate: { interpret: 'Connect selective dietary exclusion and connective-tissue bleeding findings while distinguishing a coagulation-factor pathway.', apply: 'Choose targeted nutrient correction/assessment rather than nonspecific wound supplementation.', closestChoice: 'k', decidingObservation: 'Gingival/perifollicular bleeding with normal coagulation results and the selective diet.', counterfactual: 'A coagulation abnormality with an appropriate vitamin-K deficiency context would redirect evaluation toward vitamin K.', counterfactualChoice: 'k', deletionTest: 'The intake pattern, physical distribution and coagulation result distinguish competing mechanisms; protein assessment prevents treating every wound problem as an unmeasured protein deficit.', cueAttack: 'Complaint does not name a deficiency. The three options use parallel correction/assessment scope. Recognition remains part of the demand, with normal coagulation retaining a necessary competing mechanism boundary.', stageAudit: 'All options are nutrient-directed assessment/correction, with wound care shared.', predictedDifficulty: 'moderate', difficultyReason: 'Competing nutrition and coagulation explanations require integration, although this is a classic deficiency pattern and may review as easier.', sequenceAudit: 'Standalone, without a preceding collagen explanation.', limitation: 'No dose or proof of a single cause of delayed healing. Vitamin-K alternative now has NIH factual support; normal PT is not asserted to exclude every early deficiency.', },
    }],
  },
  {
    slug: 'trace-element-record', name: 'Caleb Hayes', age: 60, sex: 'Male', complaint: 'Fatigue and imbalance', historicalAcuity: 'stable',
    presentation: '{patientName}, a 60-year-old man, attends clinic after prolonged use of a high-zinc over-the-counter wound supplement. Hemoglobin and neutrophils have fallen. He reports new imbalance and reduced vibration sensation in his feet. A recent B12 result and methylmalonic acid were within their reporting intervals; C-reactive protein is not raised.',
    nodes: [{
      slug: 'zinc-copper-assessment', conceptId: concept('zinc-associated-copper-evaluation'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'workup', objective: 'Investigate a potentially reversible trace-element cause before assigning cytopenias and sensory findings to unrelated disease.', task: 'Which investigation should Caleb\'s team obtain next to evaluate the combined blood-count and neurologic findings?', update: '',
      choices: [
        o('copper', 'Serum copper and ceruloplasmin', 'Excess zinc can impair copper absorption. Copper deficiency can connect cytopenias and neurologic dysfunction; the lack of a raised inflammatory marker aids interpretation but does not make either assay definitive.', 'Use the exposure to connect both affected systems.', 'The high-zinc exposure and combined findings apply.', ['copper-zinc', 'copper-findings', 'copper-tests'], labs),
        o('marrow', 'Bone-marrow aspiration and biopsy', 'Marrow disease remains possible, but a reversible exposure-related cause deserves targeted evaluation before this more invasive assessment.', 'Assign cytopenias to a primary marrow disorder while separating off the sensory findings.', 'Persistent unexplained cytopenias after evaluation of reversible causes could warrant marrow assessment.', ['copper-findings', 'copper-tests', 'marrow-evaluation'], 'timing.test.biopsy'),
        o('b12', 'Repeat vitamin B12 and methylmalonic acid', 'The recent functional and concentration tests do not support making B12 the next repeated investigation; they do not evaluate the high-zinc copper interaction.', 'Anchor on a familiar cause of sensory changes and anemia.', 'An indeterminate or unassessed B12 status with a compatible clinical context could favor that pathway.', ['copper-zinc', 'copper-findings', 'b12-assessment'], labs),
      ], key: 'copper', explanation: 'The supplement exposure can connect the cytopenias and sensory findings through impaired copper absorption. Test that reversible possibility; normal inflammatory markers do not make serum copper or ceruloplasmin independently diagnostic.', claims: ['copper-zinc', 'copper-findings', 'copper-tests', 'b12-assessment', 'marrow-evaluation'],
      gate: { interpret: 'Integrate cytopenias and sensory findings with prolonged zinc exposure rather than diagnose two unrelated problems.', apply: 'Choose a targeted reversible-cause assessment before repeating a recently reassuring pathway or moving to marrow sampling.', closestChoice: 'marrow', decidingObservation: 'A plausible reversible exposure links both systems; B12 testing is recent and not abnormal.', counterfactual: 'Persistent otherwise unexplained cytopenias after reversible causes are evaluated would make marrow investigation appropriate.', counterfactualChoice: 'marrow', deletionTest: 'Zinc exposure establishes the causal candidate; neutropenia prevents anemia-only reasoning; sensory findings make the marrow-only explanation incomplete. Recent B12 and CRP results resolve assay alternatives.', cueAttack: 'All labels are named investigations with wait proposals. No copper diagnosis or source phrase is given before answering. The key is not uniquely the longest label.', stageAudit: 'One diagnostic investigation stage, with no treatment option mixed in.', predictedDifficulty: 'hard', difficultyReason: 'A familiar B12 pathway and a plausible marrow diagnosis compete with a medication/nutrient interaction affecting both systems.', sequenceAudit: 'Standalone; no preceding explanation names the zinc-copper interaction.', limitation: 'Marrow sequence and B12/MMA counterfactual require clinician review; government sources establish interaction, findings and assay limitations rather than a full diagnostic algorithm.', },
    }],
  },
  {
    slug: 'home-access', name: 'Ethan Brooks', age: 56, sex: 'Male', complaint: 'Feeding access follow-up', historicalAcuity: 'stable',
    presentation: '{patientName}, a 56-year-old man, attends clinic with persistent swallowing impairment after an outside hospitalization. His recovery team anticipates months of tube nutrition. Gastric feeding has sustained his weight without vomiting or regurgitation, but his nasal tube has repeatedly dislodged and interrupted delivery. His abdominal assessment identifies no barrier to percutaneous access.',
    nodes: [{
      slug: 'durable-enteral-access', conceptId: concept('long-term-enteral-access-selection'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Use anticipated duration and the location of delivery failure to select durable enteral access.', task: 'Which access plan best fits Ethan\'s ongoing nutrition needs?', update: '',
      choices: [
        o('peg', 'Percutaneous endoscopic gastrostomy', 'A sustained gastric route with long-term need and repeated nasal mechanical interruptions supports durable gastric access.', 'Separate mechanical access failure from gastric intolerance.', 'Long-term need and effective gastric nutrition are present.', ['hen-access-duration', 'hen-displacement']),
        o('pej', 'Percutaneous endoscopic jejunostomy', 'The current problem is repeated nasal displacement, not failure of gastric delivery; a jejunal destination is not established by duration alone.', 'Treat a longer access requirement as a reason to bypass the stomach.', 'Gastric dysfunction or a relevant aspiration-risk course could favor jejunal access.', ['postpyloric', 'hen-access-duration']),
        o('ng', 'Replacement fine-bore nasogastric tube', 'Nasal access can provide short-term support, but recurrent displacement and anticipated months of use favor a durable route when suitable.', 'Extend an initially appropriate temporary device despite repeated interruptions.', 'A short expected remaining need, or an unsuitable percutaneous route, could favor replacement nasal access.', ['hen-access-duration', 'hen-displacement']),
      ], key: 'peg', explanation: 'Infer the problem from the actual course: the stomach tolerates feeding, while the temporary access repeatedly fails mechanically. Long-term need changes the preferred access, without establishing a reason to bypass the stomach.', claims: ['hen-access-duration', 'hen-displacement', 'postpyloric'],
      gate: { interpret: 'Distinguish nasal access dislodgement from gastric intolerance.', apply: 'Use anticipated duration and repeated interruption to choose a durable access destination.', closestChoice: 'pej', decidingObservation: 'Gastric delivery is tolerated; the failures are mechanical and long-term support is anticipated.', counterfactual: 'If gastric intolerance persisted or a supported gastric aspiration-risk course emerged, jejunal access could become appropriate.', counterfactualChoice: 'pej', deletionTest: 'Duration establishes durable access need; the observed gastric course resolves PEG versus PEJ; displacement explains why repeated temporary replacement is insufficient.', cueAttack: 'No task term matches gastrostomy uniquely. Every option is a named access device; the percutaneous assessment applies equally to both durable access choices.', stageAudit: 'One enteral-access selection stage.', predictedDifficulty: 'moderate', difficultyReason: 'A resident may overinterpret repeated tube problems as a reason for distal rather than durable access.', sequenceAudit: 'Standalone; the gastric-aspiration sequence is not displayed here.', limitation: 'The guideline uses approximately four-to-six-week short-term boundaries; the fictional months-long expectation avoids treating a day threshold as absolute.', },
    }],
  },
  {
    slug: 'postoperative-feeding', name: 'Sophia Lane', age: 68, sex: 'Female', complaint: 'Recovery plan review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 68-year-old woman, attends clinic after an uncomplicated laparoscopic colon resection. You review her first postoperative nutrition decision. She was awake, thirsty and mobilizing, with no vomiting, progressive abdominal distension or hemodynamic instability. Flatus had not yet been recorded.',
    nodes: [{
      slug: 'early-postop-oral', conceptId: concept('postoperative-oral-intake-tolerance'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Distinguish a traditional bowel-function milestone from actual contraindications to tolerated early oral intake.', task: 'Which postoperative nutrition order best fit Sophia at that documented review?', update: '',
      choices: [
        o('oral', 'Begin oral intake and adjust to tolerance', 'The uncomplicated clinical course supports early oral intake; absent documented flatus does not by itself establish a need for routine interruption.', 'Apply current clinical tolerance rather than a historical milestone.', 'The uncomplicated, clinically tolerant course applies.', ['early-oral', 'oral-first']),
        o('fast', 'Continue fasting until passage of flatus', 'This makes a traditional milestone the prerequisite despite no current intolerance or complication findings.', 'Equate absent flatus with a mandatory feeding prohibition.', 'Active postoperative intolerance or a specific surgical complication would warrant a different restricted-intake plan; fasting would then reflect that indication rather than flatus alone.', ['early-oral']),
        o('pn', 'Begin PN until bowel sounds return', 'Neither absent recorded flatus nor bowel sounds establish a PN indication after this uncomplicated operation.', 'Use a postoperative examination milestone as evidence of prolonged enteral infeasibility.', 'A sustained inability to provide oral/enteral nutrition with an established support indication would justify PN.', ['early-oral', 'pn-boundary']),
      ], key: 'oral', explanation: 'Read the actual postoperative trajectory. Early oral intake is usual after an uncomplicated course and is adapted to tolerance; it need not await a routine flatus milestone. This does not apply to new vomiting, progressive distension or other concerning findings.', claims: ['early-oral', 'oral-first', 'pn-boundary'],
      gate: { interpret: 'Recognize absence of flatus as different evidence from actual feeding intolerance.', apply: 'Choose tolerance-guided oral intake rather than milestone-gated fasting or PN.', closestChoice: 'fast', decidingObservation: 'The clinical course is uncomplicated and lacks current intolerance findings.', counterfactual: 'If progressive vomiting and distension developed, oral intake should be withheld during reassessment; however the offered flatus-gated wording would still be an imprecise plan.', counterfactualChoice: 'fast', deletionTest: 'The operation and actual clinical findings set safety; absent flatus makes the traditional delay tempting.', cueAttack: 'The key is comparable in length to the alternatives; no pre-answer statement calls the gut functional. The flatus-gated distractor remains a known historical error and limits difficulty.', stageAudit: 'All options are immediate postoperative feeding orders.', predictedDifficulty: 'moderate', difficultyReason: 'Intended to challenge a traditional fasting rule, but the strongest distractor may be too familiar for PGY-2/3.', sequenceAudit: 'Standalone historical record review.', limitation: 'Author gate failed: the counterfactual does not make the flatus-gated plan the best exact option; parked outside the scored preview pending stronger same-stage competitors.', },
    }],
  },
  {
    slug: 'enteral-diarrhea', name: 'Amelia Ross', age: 57, sex: 'Female', complaint: 'Loose stools', historicalAcuity: 'stable',
    presentation: '{patientName}, a 57-year-old woman, attends clinic with loose stools during home gastric feeding. The formula and pump rate had been unchanged for weeks. Stools became watery after several medicines were changed to liquid preparations; the pharmacy list records sorbitol in those preparations. She has no fever, abdominal pain or blood in stool, and clinical hydration is stable.',
    nodes: [{
      slug: 'enteral-medication-review', conceptId: concept('enteral-diarrhea-medication-formulation'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Use exposure chronology to correct a medication-related feeding complication without assuming formula intolerance.', task: 'Which preparation change should Amelia\'s team make first while reassessing the diarrhea?', update: '',
      choices: [
        o('meds', 'Use pharmacy-verified sorbitol-free medicine preparations', 'The chronology points to a new osmotic medication exposure; formulation review can preserve established nutrient delivery while assessing response.', 'Use the changed exposure rather than blame the unchanged feed.', 'The medication change preceded symptoms while the feed was unchanged.', ['diarrhea-review', 'sorbitol']),
        o('formula', 'Replace the standard feed with a peptide-based formula', 'The formula had been tolerated before the medication change. Changing its composition first overlooks the new exposure.', 'Treat all tube-associated diarrhea as formula maldigestion.', 'A demonstrated digestive/absorptive problem after other causes are assessed could support a specific formula revision.', ['diarrhea-review']),
        o('rate', 'Reduce the pump rate and extend the feeding schedule', 'A rate-related intervention is plausible for rate-associated symptoms, but the rate was unchanged while the medication exposure changed.', 'Apply a common enteral-tolerance adjustment without interpreting chronology.', 'Symptoms beginning during rate escalation and improving with reduction could support this change.', ['diarrhea-review', 'delivered']),
      ], key: 'meds', explanation: 'Do not infer that the feed caused diarrhea because feeding and diarrhea coexist. A changed medication formulation is the relevant exposure here; reassess its role while preserving an effective nutrition plan and monitoring the patient.', claims: ['diarrhea-review', 'sorbitol', 'delivered'],
      gate: { interpret: 'Compare the new medicine formulation exposure with the unchanged feed and rate.', apply: 'Target the plausible reversible osmotic exposure before changing an established formula or schedule.', closestChoice: 'rate', decidingObservation: 'Symptoms begin after medication reformulation, not feed-rate escalation.', counterfactual: 'If symptoms instead began with pump-rate escalation and resolved when it was reduced, the rate/schedule revision would become the reasonable first change.', counterfactualChoice: 'rate', deletionTest: 'The chronology changes the priority; stable hydration and absence of warning findings permit a clinic formulation reassessment rather than urgent resuscitation.', cueAttack: 'The pharmacy ingredient is necessary mechanistic evidence, but the exact word is repeated in the key. Repaired option labels to compare equally specific formulation/schedule changes; independent review must attack the residual recognition cue.', stageAudit: 'All choices change an administered preparation or delivery schedule at the same management stage.', predictedDifficulty: 'moderate', difficultyReason: 'The resident must distinguish a new medicine exposure from familiar feed-related explanations; causal proof is not asserted.', sequenceAudit: 'Standalone, with no prior sorbitol explanation.', limitation: 'Sorbitol-free substitution requires pharmacist verification of drug/tube compatibility; no unsupported crushing instruction or dose equivalence is taught.', },
    }],
  },
  {
    slug: 'renal-formula-selection', name: 'Julian Ward', age: 69, sex: 'Male', complaint: 'Formula review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 69-year-old man, reviews an outside hospital nutrition plan in clinic during chronic dialysis follow-up. Gastric feeding is tolerated. Fluid overload led the team to set a patient-specific formula allowance of 1,000 mL/day after accounting for other fluids. The current nutrition assessment requires 1,800 kcal and 90 g protein per day from formula.',
    nodes: [{
      slug: 'renal-volume-composition', conceptId: concept('renal-formula-energy-protein-volume'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management', objective: 'Choose a renal formula from protein/energy ratio and a genuine volume constraint instead of the renal label.', task: 'Which of the proposed formula orders best fits Julian\'s current recorded constraints?', update: 'The team compared these constructed candidate orders; electrolyte content is suitable in each. These are fictional prescription inputs, not universal requirements or commercial product claims.',
      exhibit: table(['Volume/day', 'Energy/day', 'Protein/day'], ['Plan A', 'Plan B', 'Plan C'], [['1000 mL', '1800 kcal', '90 g'], ['1000 mL', '1800 kcal', '60 g'], ['1500 mL', '1800 kcal', '90 g']]),
      choices: [
        o('a', 'Use formula order A', 'This supplies the independently assessed protein and energy amounts within the patient-specific fluid allowance.', 'Apply all three recorded constraints.', 'The stated energy/protein need and volume allowance apply.', ['renal-formula-ratio', 'renal-formula-concentration']),
        o('b', 'Use formula order B', 'Energy and volume fit, but the protein amount leaves the assessed shortfall unresolved.', 'Choose a concentrated renal formula without checking its protein ratio.', 'A lower independently assessed protein need could make this composition fit.', ['renal-formula-ratio']),
        o('c', 'Use formula order C', 'Energy and protein fit, but the order exceeds the documented formula fluid allowance.', 'Match nutrients while ignoring the reason a concentrated product is being considered.', 'If the fluid allowance increased to accommodate this volume, this order could meet the nutrient plan.', ['renal-formula-ratio', 'renal-formula-concentration']),
      ], key: 'a', explanation: 'A renal label does not establish that a formula fits. Check the protein/energy ratio and the actual fluid allowance together. The stated values are individual constructed prescription inputs.', claims: ['renal-formula-ratio', 'renal-formula-concentration'],
      gate: { interpret: 'Identify which constraint each otherwise plausible formula fails.', apply: 'Select the formulation that solves both nutritional delivery and the volume problem.', closestChoice: 'c', decidingObservation: 'The team has an active formula-fluid allowance because of overload, not merely a preference for a smaller volume.', counterfactual: 'If the formula allowance rose to 1,500 mL/day, C would also become acceptable; under that counterfactual A would remain acceptable, so the exact option set would no longer have a unique key.', counterfactualChoice: 'c', deletionTest: 'Each value represents an active constraint, but all can be solved by direct table matching without interpreting additional clinical evidence.', cueAttack: 'All options have identical labels and no key-only lexical cue. The one all-target row is a matching shortcut despite balanced lengths.', stageAudit: 'One formula-order decision stage.', predictedDifficulty: 'moderate', difficultyReason: 'The constraints are consequential but the exact-target exhibit makes this too easy for the owner standard.', sequenceAudit: 'Standalone.', limitation: 'Author gate failed: target matching and the nonunique counterfactual do not meet the difficulty/single-best counterfactual requirements. Parked outside active scored preview; this does not resolve the inherited whey-substitution hold.', },
    }],
  },
];

NUTRITION_TOPIC_DEFINITIONS.push(
  {
    slug: 'postoperative-feeding-repaired', name: 'Sophia Lane', age: 68, sex: 'Female', complaint: 'Recovery plan review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 68-year-old woman, attends clinic after laparoscopic colon resection. You review her early postoperative nutrition record. Before admission she had weeks of reduced intake and weight loss. After surgery she coughed during sips; the swallowing examination showed liquid passing below the vocal folds. Her abdomen remained soft without progressive distension or vomiting. Flatus had not yet been recorded.',
    nodes: [{
      slug: 'postoperative-route-after-swallow', conceptId: concept('postoperative-oral-intake-tolerance'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management',
      objective: 'Adapt early postoperative nutrition to actual oral safety rather than using absent flatus as a contraindication to all enteral feeding.',
      task: 'Which nutrition route should Sophia\'s hospital team initiate at the documented review?', update: '',
      choices: [
        o('gastric', 'Nasogastric tube nutrition', 'The oral assessment limits swallowing, while absent flatus after an otherwise uncomplicated operation does not by itself establish enteral infeasibility. Early monitored tube nutrition addresses the current route boundary.', 'Separate oral safety from the postoperative bowel milestone.', 'The current unsafe swallowing and uncomplicated abdominal course apply.', ['swallow', 'early-oral', 'enteral-next']),
        o('oral', 'Oral food and supplements', 'Early feeding guidance does not override the actual airway-entry finding during swallowing.', 'Apply early oral recovery guidance without adapting it to the observed swallowing result.', 'An adequate swallowing examination showing a safe oral route would favor oral food and supplements.', ['swallow', 'oral-first', 'early-oral']),
        o('pn', 'Central parenteral nutrition', 'The oral barrier and absence of recorded flatus do not establish that the enteral route cannot be used.', 'Treat a postoperative milestone and oral failure as combined proof of intestinal failure.', 'An established enteral contraindication or repeated enteral failure with a support indication would favor PN.', ['pn-boundary', 'enteral-next', 'early-oral']),
      ], key: 'gastric', explanation: 'Apply both observations. Airway entry changes the oral plan, while absent flatus does not independently prohibit enteral nutrition after an uncomplicated course. Start with the appropriate enteral route and monitor tolerance.', claims: ['swallow', 'early-oral', 'enteral-next', 'oral-first', 'pn-boundary'],
      gate: { interpret: 'Locate the demonstrated problem in swallowing rather than infer intestinal failure from absent flatus.', apply: 'Adapt early nutrition to a tube route while retaining actual tolerance assessment.', closestChoice: 'oral', decidingObservation: 'Liquid passes below the vocal folds during the actual swallowing examination.', counterfactual: 'If the adequate swallowing examination instead demonstrated safe oral intake without airway entry, oral food and supplements would be the preferred offered route despite the same absent-flatus observation.', counterfactualChoice: 'oral', deletionTest: 'The airway finding resolves oral versus tube nutrition; the abdominal course and missing flatus resolve tube nutrition versus the tempting PN escalation. The undernutrition history establishes why support matters now.', cueAttack: 'Replaced the failed historical waiting-rule item with a route decision requiring two anatomically different observations. All options are specific nutrition routes of comparable length; no availability permission or interpreted functional-gut label is supplied.', stageAudit: 'Three initiation routes at one postoperative decision stage.', predictedDifficulty: 'moderate', difficultyReason: 'Early-oral guidance and the familiar absent-flatus concern point toward different wrong routes unless both findings are interpreted.', sequenceAudit: 'Standalone chart review. Unlike the other swallowing case, there is no previously successful gastric delivery supplied; the question applies the postoperative tolerance boundary to initiation.', limitation: 'A repaired unapproved draft, not independent PASS. Same broad tolerance-adapted postoperative nutrition meaning as the failed unadmitted attempt; no patient history is migrated.', },
    }],
  },
  {
    slug: 'renal-formula-repaired', name: 'Julian Ward', age: 69, sex: 'Male', complaint: 'Formula review', historicalAcuity: 'stable',
    presentation: '{patientName}, a 69-year-old man, reviews an outside ward nutrition prescription in clinic. He received conventional chronic intermittent dialysis without acute or critical illness. Repeated preadmission postdialysis weights were near 70 kg without edema; the current 88-kg weight followed positive fluid balance with dependent edema. The team assessed formula energy at 1,800 kcal/day and total fluid at 1,400 mL/day. Medicines and other required fluids supplied 400 mL/day.',
    nodes: [{
      slug: 'renal-formula-reference-budget', conceptId: concept('renal-formula-energy-protein-volume'), creationKind: 'new', replacesInventoryIds: [], conceptType: 'management',
      objective: 'Infer a defensible weight and formula-fluid budget before implementing the stable hospitalized dialysis minimum in a formula order.',
      task: 'Which formula order best implements the ESPEN minimum protein amount and current fluid allowance for Julian\'s documented ward context?',
      update: 'The proposed orders below have suitable electrolyte content and the same assessed formula energy. These are constructed orders, not commercial product claims.',
      exhibit: table(['Formula volume/day', 'Energy/day', 'Protein/day'], ['Order A', 'Order B', 'Order C', 'Order D'], [['1000 mL', '1800 kcal', '84 g'], ['1000 mL', '1800 kcal', '60 g'], ['1400 mL', '1800 kcal', '84 g'], ['1400 mL', '1800 kcal', '60 g']]),
      choices: [
        o('a', 'Use formula order A', 'The usual approximately 70-kg reference gives 84 g/day at the population-specific minimum. Required other fluids leave 1,000 mL for formula.', 'Integrate the weight trajectory, illness/KRT population and the whole fluid budget.', 'The stated population, usual weight and current other-fluid requirement apply.', ['renal-protein', 'renal-weight', 'renal-formula-ratio', 'renal-formula-concentration']),
        o('b', 'Use formula order B', 'The fluid budget fits, but 60 g does not implement the minimum for the inferred 70-kg hospitalized conventional-dialysis reference.', 'Choose a lower-protein concentrated product because kidney failure suggests restriction.', 'If the appropriate usual reference were 50 kg, this would implement the same 1.2-g/kg/day minimum within the same fluid budget.', ['renal-protein', 'renal-weight', 'renal-formula-ratio']),
        o('c', 'Use formula order C', 'The protein amount fits the requested minimum but the formula uses the entire total-fluid allowance before the required other fluids are counted.', 'Treat the total-fluid order as an allowance for formula itself.', 'A clinically assessed larger formula allowance and a need for this less concentrated product could make this volume acceptable; no superiority over a lower-volume adequate product is claimed.', ['renal-protein', 'renal-formula-ratio', 'renal-formula-concentration']),
        o('d', 'Use formula order D', 'This combines the protein shortfall with the unaccounted nonformula fluid contribution.', 'Select an older lower-protein order and use total rather than residual fluid capacity.', 'A different reference/protein goal and a larger assessed formula-fluid allowance would create a different order-selection problem.', ['renal-protein', 'renal-formula-ratio', 'renal-formula-concentration']),
      ], key: 'a', explanation: 'Interpret the fluid-associated weight increase before applying the stable hospital-dialysis minimum: 70 × 1.2 = 84 g/day. Required nonformula fluid leaves 1,400 − 400 = 1,000 mL/day for the formula. This is an application of a stated minimum, not a maximum protein rule or a universal fluid prescription.', claims: ['renal-protein', 'renal-weight', 'renal-formula-ratio', 'renal-formula-concentration'],
      gate: { interpret: 'Infer usual nutritional weight from dialysis/edema chronology and derive formula capacity from total minus required other fluids.', apply: 'Implement the relevant hospitalized conventional-KRT minimum through a product that fits the residual volume.', closestChoice: 'b', decidingObservation: 'Repeated nonedematous preadmission weights are near 70 kg rather than 50 kg or the fluid-increased 88 kg.', counterfactual: 'If the repeated appropriate preadmission reference were instead 50 kg, the same minimum would be 60 g/day. B would implement that minimum within 1,000 mL, while D still exceeds the fluid budget and A exceeds the requested minimum amount.', counterfactualChoice: 'b', deletionTest: 'Unlike the failed version, the exhibit does not state the protein target or formula allowance. Weight chronology and required other fluid must both be interpreted before the orders can be ranked.', cueAttack: 'Repaired the all-target matching shortcut. Four balanced orders show each volume and protein amount twice; no majority component or unique cautious wording constructs the key. All order labels have the same structure.', stageAudit: 'One formula-order decision stage with shared energy/electrolyte suitability.', predictedDifficulty: 'moderate', difficultyReason: 'Three plausible errors compete: renal protein restriction, edema-based weight and counting the entire fluid order as formula capacity. The arithmetic follows those clinical/record inferences.', sequenceAudit: 'Standalone. Distinct from accepted N2: this tests required nonformula fluid and product concentration rather than hidden calorie subtraction.', limitation: 'The task deliberately asks to implement the sourced minimum amount, not to prove that higher protein is unsafe. Same unadmitted formula/volume meaning as the failed attempt; its exact failed version remains historical.', },
    }],
  },
);

/** Failed exact attempts remain historical; the repaired versions are independently reviewable. */
export const NUTRITION_TOPIC_V1_PARKED_ATTEMPTS = NUTRITION_TOPIC_DEFINITIONS.filter(c => ['postoperative-feeding', 'renal-formula-selection'].includes(c.slug));
export const NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS = NUTRITION_TOPIC_DEFINITIONS.filter(c => !['postoperative-feeding', 'renal-formula-selection'].includes(c.slug));
export const NUTRITION_TOPIC_V1_AUTHOR_REPAIR_HISTORY = [
  { attemptedCaseSlug: 'postoperative-feeding', repairedQuestionVariantId: NUTRITION_TOPIC_IDS.question('postoperative-route-after-swallow'), disposition: 'repaired_author_gate_repeated' },
  { attemptedCaseSlug: 'renal-formula-selection', repairedQuestionVariantId: NUTRITION_TOPIC_IDS.question('renal-formula-reference-budget'), disposition: 'repaired_author_gate_repeated' },
];
export const NUTRITION_TOPIC_V1_UNKEYED_HOLDS = NUTRITION_TOPIC_V1_PARKED_ATTEMPTS.filter(c => !NUTRITION_TOPIC_V1_AUTHOR_REPAIR_HISTORY.some(r => r.attemptedCaseSlug === c.slug)).flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_DRAFT, id: `hold.${prefix}.${n.slug}.v1`, proposedConceptId: n.conceptId,
  activeQuestionVariantId: null, activeKeyChoiceId: null, attemptedQuestionVariantId: NUTRITION_TOPIC_IDS.question(n.slug),
  reason: n.gate.limitation, owner: 'manager authoring-quality revision', originalAttemptRetained: true,
  nextAction: 'Rewrite the exact options/counterfactual and repeat the complete author gate before any scored preview admission.',
})));
export const NUTRITION_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const NUTRITION_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
const nodes = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.flatMap(c => c.nodes);
const textFor = (c: DraftCase, s: string) => s.replaceAll(c.name.split(' ')[0]!, '{patientName}');
export const NUTRITION_TOPIC_V1_QUESTIONS: QuestionVariant[] = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_DRAFT, id: NUTRITION_TOPIC_IDS.question(n.slug), conceptId: n.conceptId, stem: textFor(c, n.task),
  answerChoices: n.choices.map(x => ({ id: NUTRITION_TOPIC_IDS.choice(n.slug, x.id), label: x.label, isCorrect: x.id === n.key, rationale: x.rationale, distractorRationale: x.id === n.key ? null : x.rationale })),
  explanation: n.explanation, supportingEvidenceClaimIds: n.claims.map(claim), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
})));
export const NUTRITION_TOPIC_V1_CONCEPTS: TestedConcept[] = nodes.map(n => ({ id: n.conceptId, displayName: n.slug.replaceAll('-', ' '), learningObjective: n.objective, earliestFacilityStage: 2, conceptType: n.conceptType }));
export const NUTRITION_TOPIC_V1_CONCEPT_PROPOSALS = nodes.map(n => ({
  ...NUTRITION_TOPIC_DRAFT, conceptId: n.conceptId, previousConceptId: n.previousConceptId ?? null,
  relation: n.previousConceptId ? 'new_version' : n.creationKind === 'Rewrite' || n.identityRelation === 'reuse_existing_meaning' ? 'reuse_existing_meaning' : 'new_meaning',
  reason: n.conceptVersionReason ?? (n.creationKind === 'Rewrite' || n.identityRelation === 'reuse_existing_meaning' ? 'Unchanged clinical meaning; preserve stable concept history while creating a new exact variant and case. The aspiration variant reuses the existing gastric-versus-postpyloric construct rather than splitting its history.' : 'Distinct scored decision absent from the assigned registry; no existing history is migrated.'),
  educationalTier: 1, acuity: 'stable', earliestFacilityStage: 2, requiredCapabilityIds: [], evidenceClaimIds: n.claims.map(claim),
}));
export const NUTRITION_TOPIC_V1_CASES: SyntheticClinicalCase[] = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.map(c => {
  const d = { ageYears: c.age, sexLabel: c.sex };
  const labels = ['Original constructed teaching record', 'Unapproved topic sidecar; Melissa Rowland is clinical sign-off'];
  return {
    id: NUTRITION_TOPIC_IDS.case(c.slug), displayName: c.complaint, patientDisplayName: c.name,
    patientPresentationVariantId: `presentation.${prefix}.${c.slug}.v1`, prototypeDemographics: d, chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: `profile.${prefix}.${c.slug}.v1`, prototypeDemographics: d, chiefComplaint: c.complaint, presentation: c.presentation }],
    releasePointId: 'release.l0.clinic_evaluation', tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: 2, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels: labels,
    decisionNodes: c.nodes.map((n, index) => {
      const q = NUTRITION_TOPIC_V1_QUESTIONS.find(q => q.id === NUTRITION_TOPIC_IDS.question(n.slug))!;
      return { id: NUTRITION_TOPIC_IDS.node(n.slug), questionVariantId: q.id, primaryConceptId: n.conceptId, stem: q.stem,
        ...(n.update ? { currentUpdate: textFor(c, n.update) } : {}), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
        answerChoices: q.answerChoices.map(x => ({ id: x.id, label: x.label, isCorrect: x.isCorrect, rationale: x.rationale!, serviceRequest: null })),
        shuffleAnswers: true, explanation: q.explanation, sourceLabels: labels, resultGateAfter: null,
        terminalDispositions: index === c.nodes.length - 1 ? q.answerChoices.filter(x => !x.isCorrect).map(x => ({
          answerChoiceId: x.id, kind: 'no_terminal_outcome' as const,
          consequenceNarrative: 'Review the recorded decision; no patient outcome is simulated.', clinicalRationale: x.rationale!, sourceLabels: labels,
        })) : [],
      };
    }), learningSummary: c.nodes.map(n => n.explanation).join(' '),
  };
});
export const NUTRITION_TOPIC_V1_CASE_REVIEWS = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.map(c => ({
  ...NUTRITION_TOPIC_DRAFT, caseId: NUTRITION_TOPIC_IDS.case(c.slug), educationalTier: 1, acuity: 'stable', historicalAcuity: c.historicalAcuity,
  earliestFacilityStage: 2, requiredCapabilityIds: [],
  encounterMode: c.presentation.includes('hospital') || c.presentation.includes('outside') ? 'outside_record_review_in_clinic' : 'outpatient_clinic',
  finiteProfiles: 1, profileApproval: 'needs_clinician_review; approvedInstantiationProfiles is a legacy structural field, not clinical approval',
}));
export const NUTRITION_TOPIC_V1_AUTHOR_CHECKS = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_DRAFT, checkedOn: '2026-11-11', rubric: 'question-authoring.2026-11-08.v15',
  questionVariantId: NUTRITION_TOPIC_IDS.question(n.slug), caseId: NUTRITION_TOPIC_IDS.case(c.slug), nodeId: NUTRITION_TOPIC_IDS.node(n.slug),
  authorVerdict: 'DRAFT_FOR_INDEPENDENT_REVIEW', independent: false, clinicalApproval: false, finiteProfileCount: 1, ...n.gate,
  optionAudit: n.choices.map(x => ({ choiceId: NUTRITION_TOPIC_IDS.choice(n.slug, x.id), isKey: x.id === n.key, temptation: x.temptation, whyRankedHere: x.rationale, correctUnder: x.correctUnder, evidenceClaimIds: x.claims.map(claim) })),
})));
export const NUTRITION_TOPIC_V1_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  caseId: NUTRITION_TOPIC_IDS.case(c.slug), nodeId: NUTRITION_TOPIC_IDS.node(n.slug), questionVariantId: NUTRITION_TOPIC_IDS.question(n.slug),
  classification: n.choices.some(x => x.timingProfileId) ? { kind: 'test_choices' as const, choices: n.choices.map(x => ({
    choiceId: NUTRITION_TOPIC_IDS.choice(n.slug, x.id), choiceLabel: x.label,
    timing: x.timingProfileId ? { kind: 'test' as const, timingProfileId: x.timingProfileId } : { kind: 'no_test' as const },
  })) } : { kind: 'no_test' as const },
})));
export const NUTRITION_TOPIC_V1_ORDER_PROPOSALS = NUTRITION_TOPIC_V1_TIMING_ENTRIES.flatMap(e => e.classification.kind === 'test_choices'
  ? e.classification.choices.flatMap(c => c.timing.kind === 'test' ? [{ ...NUTRITION_TOPIC_DRAFT, caseId: e.caseId, nodeId: e.nodeId, questionVariantId: e.questionVariantId, choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing, disposition: { kind: 'not_executed', reason: 'future_planned' }, serviceRequest: null, resultGateAfter: null }] : []) : []);
export const NUTRITION_TOPIC_V1_STATEMENT_MAPPINGS = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_DRAFT, questionVariantId: NUTRITION_TOPIC_IDS.question(n.slug), caseId: NUTRITION_TOPIC_IDS.case(c.slug),
  constructedObservations: 'Names, demographics, chronology, delivered amounts, weights, examinations and laboratory-relative values are fictional patient observations; they are not empirical rates or invented treatment thresholds.',
  fieldMappings: [
    { field: 'presentation/currentUpdate/exhibit interpretation', claimIds: n.claims.map(claim) },
    { field: 'task', claimIds: n.claims.map(claim) }, { field: 'explanation', claimIds: n.claims.map(claim) },
    ...n.choices.map(x => ({ field: `answerChoices.${NUTRITION_TOPIC_IDS.choice(n.slug, x.id)}.label/rationale/counterfactual`, claimIds: x.claims.map(claim) })),
  ],
})));
export const NUTRITION_TOPIC_SOURCE_LINKS = NUTRITION_TOPIC_SOURCES.map(s => ({
  sourceId: s.id, label: s.title, href: s.officialUrl!, target: '_blank' as const, rel: 'noopener noreferrer' as const, referrerPolicy: 'no-referrer' as const,
}));
export const NUTRITION_TOPIC_V1_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: 'clinical.synthetic.prototype.v1', schemaVersion: 1, publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Synthetic original nutrition teaching drafts; not clinically approved. Melissa Rowland is clinical sign-off. Not medical advice.',
  concepts: NUTRITION_TOPIC_V1_CONCEPTS, cases: NUTRITION_TOPIC_V1_CASES,
});
export const NUTRITION_TOPIC_V1_MANIFEST = {
  ...NUTRITION_TOPIC_DRAFT, topicSlug: NUTRITION_TOPIC_SLUG, caseCount: NUTRITION_TOPIC_V1_CASES.length, variantCount: nodes.length,
  reusedConceptCount: nodes.filter(n => (n.creationKind === 'Rewrite' || n.identityRelation === 'reuse_existing_meaning') && !n.previousConceptId).length,
  changedMeaningCount: nodes.filter(n => n.previousConceptId).length,
  additiveNewMeaningCount: nodes.filter(n => n.creationKind === 'new' && !n.identityRelation).length,
  newVariantCount: nodes.filter(n => n.creationKind === 'new').length,
  reviewDisplay: 'key shown first for review only.', managerAccepted: false, independentPass: false, clinicalApproval: false, publicReleaseAuthorized: false,
  parkedUnkeyedAttemptCount: NUTRITION_TOPIC_V1_UNKEYED_HOLDS.length,
  executableOrdersAdded: false, educationalTier: 1, acuity: 'stable', earliestFacilityStage: 2, requiredCapabilityIds: [],
  integrationDependencies: [
    'Manager installs accepted exact tuples after independent review; this module is not imported by a default barrel or ship manifest.',
    'All multi-part cases retain existing all-concepts-unseen-or-due eligibility; paired-only coverage must be reviewed by the manager.',
    'Append exact choice/label timing and future_planned nonexecuted order records; preserve all frozen legacy tuples.',
    'Inherited aspiration-route owner hold, combined-carbohydrate reduction hold and protein-module substitution hold remain open.',
    'All inpatient and ICU decisions are outside-record chart reviews in clinic; no ICU/ED runtime setting is requested.',
    'Clinical sources and claims are offline authoring data; no gameplay web or AI requests.',
  ],
};


/** Round 2 response. V1 exports above are immutable historical review payloads. */
export const NUTRITION_TOPIC_ROUND2_DRAFT = {
  "contentVersion": "question-topic-nutrition-support-metabolism.2026-11-11.r2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null
} as const;
export const NUTRITION_TOPIC_ROUND2_ATTEMPTS: DraftCase[] = [
  {
    "slug": "r2-supplement-delivered",
    "name": "Lena Ortiz",
    "age": 66,
    "sex": "Female",
    "complaint": "Nutrition follow-up",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 66-year-old woman, reviews an outside hospital feeding record in clinic after prolonged postoperative intestinal dysfunction. PN and jejunal feeding were being delivered together. The nutrition team reassessed the combined prescription.",
    "nodes": [
      {
        "slug": "supplement-delivered",
        "conceptId": "concept.n2r3.supplemental-pn-delivery-reconciliation",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.27d6a149cf2044df"
        ],
        "conceptType": "management",
        "objective": "Reconcile supplemental PN with tolerated actual enteral delivery instead of the unachieved order.",
        "task": "Which daily PN prescription should the hospital team prepare for {patientName} while retaining the current tolerated jejunal feed?",
        "update": "The larger jejunal order repeatedly produced distension and was returned to the preceding rate. The pump-on record below represents delivery at that tolerated rate; higher-rate prescriptions were not sustained.",
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Energy (kcal/day)",
            "Protein (g/day)"
          ],
          "rowHeaders": [
            "Assessed combined requirement",
            "PN administration",
            "Jejunal prescription",
            "Jejunal administration"
          ],
          "cells": [
            [
              "1900",
              "90"
            ],
            [
              "1900",
              "90"
            ],
            [
              "1400",
              "65"
            ],
            [
              "600",
              "30"
            ]
          ]
        },
        "choices": [
          {
            "id": "residual",
            "label": "1,300 kcal and 60 g protein",
            "rationale": "The tolerated jejunal contribution is 600 kcal and 30 g. The proposed PN supplies the remaining 1,300 kcal and 60 g rather than counting the unachieved order.",
            "temptation": "Reconcile actual contribution with the combined target.",
            "correctUnder": "The represented actual delivery and current assessed needs apply.",
            "claims": [
              "supplemental",
              "delivered"
            ]
          },
          {
            "id": "ordered",
            "label": "500 kcal and 25 g protein",
            "rationale": "This subtracts the larger prescribed jejunal amount rather than the amount delivered at the tolerated rate.",
            "temptation": "Treat a larger order as a successful feeding trial.",
            "correctUnder": "If the higher rate actually delivered 1,400 kcal and 65 g without intolerance, this PN proposal would fit the same total assessment.",
            "claims": [
              "supplemental",
              "delivered"
            ]
          },
          {
            "id": "prior",
            "label": "1,900 kcal and 90 g protein",
            "rationale": "Keeping the previous full PN ignores the delivered enteral contribution. Together they supply 2,500 kcal and 120 g.",
            "temptation": "Treat continued intestinal dysfunction as a reason to leave full PN unchanged.",
            "correctUnder": "If the enteral route contributed no nutrients, this would match the stated combined assessment.",
            "claims": [
              "supplemental",
              "pn-boundary",
              "delivered"
            ]
          }
        ],
        "key": "residual",
        "explanation": "Distinguish the failed larger order from the tolerated actual delivery, then reconcile the combined prescription: 1,900 − 600 = 1,300 kcal and 90 − 30 = 60 g protein from PN. The previous combined administration supplied 2,500 kcal and 120 g. These are constructed proposed daily prescriptions, not a universal PN taper or rate-change protocol.",
        "claims": [
          "supplemental",
          "delivered",
          "pn-boundary"
        ],
        "gate": {
          "interpret": "Use the response to rate escalation to distinguish an unachieved order from a real enteral contribution.",
          "apply": "Prepare a specific residual PN prescription instead of a generic instruction to adjust support.",
          "closestChoice": "ordered",
          "decidingObservation": "The larger jejunal prescription was not actually sustained; administration is 600 kcal and 30 g.",
          "counterfactual": "If the actual higher-rate trial instead delivered 1,400 kcal and 65 g without intolerance, the 500-kcal/25-g PN option would meet the same combined assessment.",
          "counterfactualChoice": "ordered",
          "deletionTest": "The tolerance record determines which amount may be counted; the actual-versus-prescribed exhibit determines the size and direction of PN revision. Neither can be deleted.",
          "cueAttack": "Replaced the sole flexible combined-plan label with three specific PN prescriptions; enteral delivery is shared care. Every alternative is an actual order derived from a recognizable record error, not total abandonment of a route.",
          "stageAudit": "All choices are proposed daily PN nutrient prescriptions at the same pharmacy-preparation review.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A resident must first resolve delivery feasibility, then compute a prescription from the appropriate evidence. This is fair moderate prescription application, not a claim of calibrated hardness.",
          "sequenceAudit": "Standalone case; no earlier feedback instructs the resident which record to use or supplies a later answer.",
          "limitation": "Single direct guideline for supplemental PN; constructed individual totals do not establish a general taper percentage, administration rate or clinical approval."
        }
      }
    ]
  },
  {
    "slug": "r2-pn-withdrawal",
    "name": "Lena Ortiz",
    "age": 66,
    "sex": "Female",
    "complaint": "Nutrition follow-up",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 66-year-old woman, attends clinic to review an outside hospital transition from PN after postoperative intestinal dysfunction. You review the later oral trial, when the current PN prescription provided 450 kcal and 25 g protein per day.",
    "nodes": [
      {
        "slug": "pn-withdrawal",
        "conceptId": "concept.n1.post-ileus-nutrition-route-reassessment",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.28c39606d0c916e0"
        ],
        "conceptType": "management",
        "objective": "Reassess the PN indication using sustained oral delivery and clinical trajectory rather than stool passage alone.",
        "task": "Which ongoing nutrition prescription should the hospital team use for {patientName} at this review?",
        "update": "The hospital team supervised an interval without PN while she took meals and supplements. Morning weights were 66.2, 66.1 and 66.2 kg, with the same recorded chair-rise performance. She had no vomiting or progressive distension. Albumin remained below range while C-reactive protein remained raised.",
        "choices": [
          {
            "id": "oral",
            "label": "Continue meals and supplements; discontinue PN",
            "rationale": "The meals plus consumed supplements supply 1,850 kcal and 80 g, and the observed PN-free course supports sustaining that delivery. Low albumin during inflammation does not independently restore the PN indication.",
            "temptation": "Use actual supply together with the monitored transition response.",
            "correctUnder": "The represented intake and PN-free response support this transition.",
            "claims": [
              "pn-withdraw",
              "delivered",
              "albumin"
            ]
          },
          {
            "id": "combined",
            "label": "Continue meals, supplements and the current PN",
            "rationale": "This retains another 450 kcal and 25 g despite the observed oral delivery and PN-free course.",
            "temptation": "Use low albumin or historical dependence as evidence of a residual support requirement.",
            "correctUnder": "If supplement delivery were only 150 kcal and 5 g, retaining all three contributions would supply 1,850 kcal and 80 g.",
            "claims": [
              "pn-withdraw",
              "delivered",
              "albumin"
            ]
          },
          {
            "id": "pn-meals",
            "label": "Continue meals and the current PN; discontinue supplements",
            "rationale": "Meals plus this PN amount supply 1,700 kcal and 75 g; withdrawing the actually consumed supplement leaves a delivery gap.",
            "temptation": "Assume the small PN prescription replaces all nutrition supplied by the oral drinks.",
            "correctUnder": "A different PN amount that covered an otherwise unresolved oral gap could support a combined prescription.",
            "claims": [
              "delivered",
              "pn-boundary"
            ]
          },
          {
            "id": "meals",
            "label": "Continue meals; discontinue supplements and PN",
            "rationale": "The ordinary meals provide 1,250 kcal and 50 g; absence of vomiting does not establish sufficient meal consumption.",
            "temptation": "Equate improved gut tolerance with an adequate unassisted meal intake.",
            "correctUnder": "If actual meals supplied the assessed nutrients without supplements or PN, that route simplification would fit.",
            "claims": [
              "delivered",
              "pn-withdraw"
            ]
          }
        ],
        "key": "oral",
        "explanation": "First total what was consumed: meals plus supplements provide 1,850 kcal and 80 g. Then interpret the observed PN-free weight and functional course before withdrawing support. The supplements remain necessary at this intake; the low inflammatory albumin result is not itself an indication for PN. The fictional trial duration and measurements are not a universal stopping threshold.",
        "claims": [
          "pn-withdraw",
          "delivered",
          "albumin",
          "pn-boundary"
        ],
        "gate": {
          "interpret": "Quantify the contribution of consumed supplements rather than treat all oral intake as ordinary meals or equate tolerance with adequacy.",
          "apply": "Use the observed response without PN to choose which of the existing support components may be removed.",
          "closestChoice": "combined",
          "decidingObservation": "The supplement contribution is actually consumed during the PN-free trial, with the recorded weight and function trajectory.",
          "counterfactual": "If supplement administration were 150 kcal and 5 g rather than 600 kcal and 30 g, meals plus supplements would supply 1,400 kcal and 55 g. Keeping the current 450-kcal/25-g PN with both oral contributions would then meet the assessment.",
          "counterfactualChoice": "combined",
          "deletionTest": "Removing the supplement row changes which components are necessary. Removing the PN-free observations removes the evidence that the represented transition has sustained the patient; intake is not asserted to prove absorption.",
          "cueAttack": "Removed the announced needs-matched conclusion and unindicated switch to a jejunal tube. Four balanced continuation/discontinuation plans retain each PN/supplement component twice; no majority component constructs the key.",
          "stageAudit": "All choices specify continuation or withdrawal of the same existing nutrition components.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "This is a fair moderate transition application. Its arithmetic is short; the second clinical inference is the response during an actual PN-free interval rather than a supplied adequacy label.",
          "sequenceAudit": "Standalone later-record review; it cannot inherit a delivery-reconciliation explanation from another scored node.",
          "limitation": "No universal PN-free observation interval, stopping percentage, glucose protocol or guarantee of absorption is asserted."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Energy (kcal/day)",
            "Protein (g/day)"
          ],
          "rowHeaders": [
            "Current assessed daily requirement",
            "Consumed meals each day",
            "Consumed oral supplements each day"
          ],
          "cells": [
            [
              "1850",
              "80"
            ],
            [
              "1250",
              "50"
            ],
            [
              "600",
              "30"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-restart-thiamine",
    "name": "Mira Collins",
    "age": 54,
    "sex": "Female",
    "complaint": "Nutrition restart review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 54-year-old woman, attends clinic to review the hospital nutrition-start record after weeks of very little intake and weight loss. Phosphate, potassium and magnesium were initially below range. Replacement brought the next sample into the reporting intervals.",
    "nodes": [
      {
        "slug": "restart-thiamine",
        "conceptId": "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.45f19e6e2532a3c3"
        ],
        "conceptType": "management",
        "objective": "Apply antecedent undernutrition to thiamine planning despite correction of baseline electrolytes.",
        "task": "Which thiamine plan fits the documented nutrition review for {patientName}?",
        "update": "The first nutrition infusion was being prepared. Repeated oral medication trials had been vomited back. Close electrolyte and clinical surveillance was already arranged.",
        "choices": [
          {
            "id": "thiamine",
            "label": "Give intravenous thiamine at this review",
            "rationale": "The undernutrition history remains relevant despite corrected electrolytes. Give the prefeeding precaution through a route that can deliver it.",
            "temptation": "Integrate the risk history with the actual medication delivery problem.",
            "correctUnder": "The stated risk and unretained oral medication apply.",
            "claims": [
              "thiamine-before",
              "thiamine-route",
              "refeed-risk"
            ]
          },
          {
            "id": "oral-thiamine",
            "label": "Give oral thiamine at this review",
            "rationale": "The timing addresses the restart risk but the represented oral medication trials have not been retained.",
            "temptation": "Prescribe the appropriate vitamin while overlooking whether it is delivered.",
            "correctUnder": "Reliable oral medication retention would make oral prefeeding thiamine a reasonable less invasive plan.",
            "claims": [
              "thiamine-before",
              "thiamine-route"
            ]
          },
          {
            "id": "result",
            "label": "Give intravenous thiamine if electrolytes deteriorate",
            "rationale": "This defers a precaution recommended for the known risk until a new abnormality develops.",
            "temptation": "Treat the corrected sample as clearance of the nutritional history.",
            "correctUnder": "A newly recognized deficiency after an unforeseen course could create a later treatment indication, distinct from known prefeeding risk.",
            "claims": [
              "thiamine-before",
              "monitor"
            ]
          },
          {
            "id": "oral-after",
            "label": "Give oral thiamine if electrolytes deteriorate",
            "rationale": "This combines deferred prophylaxis with a route that has not retained medication.",
            "temptation": "Use corrected electrolytes to defer the familiar oral prescription.",
            "correctUnder": "A newly recognized later deficiency with reliable tablet retention would be a different treatment stage.",
            "claims": [
              "thiamine-before",
              "thiamine-route",
              "monitor"
            ]
          }
        ],
        "key": "thiamine",
        "explanation": "Correction of the initial sample and prevention during nutrition reintroduction address different problems. The nutritional history supports thiamine at the current review, and actual medication retention determines the practical route. Continue the shared monitoring. No dose or advancement schedule is inferred.",
        "claims": [
          "thiamine-before",
          "thiamine-route",
          "refeed-risk",
          "monitor"
        ],
        "gate": {
          "interpret": "Recognize that replacement corrects current depletion without erasing prospective restart risk; distinguish an ordered oral dose from retained medication.",
          "apply": "Choose current thiamine administration by a deliverable route rather than waiting for another abnormality.",
          "closestChoice": "oral-thiamine",
          "decidingObservation": "The corrected sample coexists with prolonged undernutrition and observed failure to retain oral medications.",
          "counterfactual": "If the same patient reliably retained oral medication, oral thiamine at this review would become a reasonable less invasive precaution; no rule requiring intravenous delivery would remain.",
          "counterfactualChoice": "oral-thiamine",
          "deletionTest": "The nutritional history is required to resolve timing; oral medication observations are required to resolve the route. Shared surveillance does not name the vitamin or decide its timing.",
          "cueAttack": "The task no longer says before the restart. All four labels answer the neutral documented-review task; each route and initiation condition occurs twice. The retained oral observation is a necessary clinical route constraint, not a grammatical timing answer.",
          "stageAudit": "All options are thiamine route/initiation plans at one review; monitoring is shared.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Intended fair moderate application after removing the task giveaway. Timing requires the refeeding precaution rather than matching before in the task; route requires actual medication-delivery evidence.",
          "sequenceAudit": "Standalone nutrition-start record, without preceding feedback about continuing restart risk.",
          "limitation": "Consensus precaution with limited direct prevention-specific trial evidence. Oral and intravenous routes are not asserted to have universal superiority; exact route and regimen require clinical sign-off."
        }
      }
    ]
  },
  {
    "slug": "r2-renal-energy-revision",
    "name": "Owen Clark",
    "age": 65,
    "sex": "Male",
    "complaint": "Dialysis nutrition review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 65-year-old man, attends clinic to review an outside ward nutrition prescription during conventional chronic intermittent dialysis without acute or critical illness. Glycemic treatment was continuing while the nutrition prescription was reviewed.",
    "nodes": [
      {
        "slug": "renal-energy-revision",
        "conceptId": "concept.dialysis-nutrition.avoid-calorie-overfeeding",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.7fd96f844016998d"
        ],
        "conceptType": "management",
        "objective": "Correct unnecessary energy excess without using nitrogen balance as a calorie-escalation target.",
        "task": "Which daily formula prescription should the hospital team use for {patientName} at this review?",
        "update": "The glucose record rose after an intravenous carbohydrate infusion was added. Nitrogen balance remained negative. The administration and current assessment are shown below. All proposed formula orders retain the existing intravenous treatment.",
        "choices": [
          {
            "id": "assessed",
            "label": "1,500 kcal with 84 g protein",
            "rationale": "Count the 400 kcal outside the formula, leaving 1,500 kcal for formula while retaining its independently assessed protein contribution.",
            "temptation": "Separate correction of energy provision from a proportional reduction in every nutrient.",
            "correctUnder": "The current administered intravenous energy and assessment apply.",
            "claims": [
              "renal-energy",
              "delivered"
            ]
          },
          {
            "id": "proportional",
            "label": "1,500 kcal with 66 g protein",
            "rationale": "This reduces energy by proportionally scaling the original formula, but also reduces protein below the current assessment.",
            "temptation": "Solve the calorie total by reducing the volume of the unchanged product.",
            "correctUnder": "A separately lower protein assessment could make this combination fit a different prescription.",
            "claims": [
              "renal-energy",
              "delivered"
            ]
          },
          {
            "id": "lipid",
            "label": "1,900 kcal with 84 g protein",
            "rationale": "This preserves the old formula totals; changing its carbohydrate-to-lipid mix would still leave the total provision at 2,300 kcal when the IV contribution is included.",
            "temptation": "Treat the glucose change as a substrate issue without reconciling total energy.",
            "correctUnder": "If the IV administration record showed no additional energy, this formula would meet the current total assessment.",
            "claims": [
              "renal-energy",
              "delivered"
            ]
          },
          {
            "id": "restricted",
            "label": "1,900 kcal with 66 g protein",
            "rationale": "A lower-protein, isocaloric product neither accounts for the IV calories nor retains the assessed protein amount.",
            "temptation": "Apply renal protein restriction while leaving formula energy unchanged.",
            "correctUnder": "Different energy and protein assessments could support this composition, but neither change is represented here.",
            "claims": [
              "renal-energy",
              "delivered"
            ]
          }
        ],
        "key": "assessed",
        "explanation": "The administration record supplies 1,900 + 400 = 2,300 kcal. With the current 1,900-kcal assessment, formula energy should be 1,500 kcal if the IV treatment continues. Preserve the separate 84-g protein assessment. A substrate exchange at unchanged energy or a proportional reduction of both protein and energy would not implement both assessed goals. Negative nitrogen balance is not a reason to ignore the energy assessment.",
        "claims": [
          "renal-energy",
          "delivered"
        ],
        "gate": {
          "interpret": "Recognize the administered IV carbohydrate as part of total nutrient energy rather than attribute the glucose rise only to formula composition.",
          "apply": "Revise formula energy while preserving the independently assessed protein amount.",
          "closestChoice": "lipid",
          "decidingObservation": "The administration record shows an additional 400 kcal outside the 1,900-kcal formula.",
          "counterfactual": "If the IV treatment had already stopped and contributed no energy during this record, the 1,900-kcal/84-g formula would meet the same assessment.",
          "counterfactualChoice": "lipid",
          "deletionTest": "The external energy row changes the prescription; the protein assessment distinguishes a composition revision from proportional volume reduction. The glucose and nitrogen-balance findings establish the plausible competing reasons the old formula might be retained.",
          "cueAttack": "Removed the supplied conclusion that delivery exceeded assessment and the word excess from the distractor. Four specific formula prescriptions balance each energy and protein component twice; the unchanged total is a credible substrate-switch error, not open-ended calorie escalation.",
          "stageAudit": "All options are daily formula energy/protein prescriptions; IV treatment and glycemic care remain shared.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The application requires reconciling a new nonformula exposure and resisting a proportional nutrient reduction. It is a fair moderate prescription problem rather than a claimed hard physiology diagnosis.",
          "sequenceAudit": "Standalone later ward record; the passed weight/protein node is preserved separately and cannot supply feedback.",
          "limitation": "Individual assessment and IV calorie amounts are constructed data, not a universal calorie target or a rule to retain every IV treatment."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Energy (kcal/day)",
            "Protein (g/day)"
          ],
          "rowHeaders": [
            "Current assessed total requirement",
            "Current formula administration",
            "Intravenous carbohydrate administration"
          ],
          "cells": [
            [
              "1900",
              "84"
            ],
            [
              "1900",
              "84"
            ],
            [
              "400",
              "0"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-aki-protein-restriction",
    "name": "Ava Morgan",
    "age": 61,
    "sex": "Female",
    "complaint": "Hospital nutrition questions",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 61-year-old woman, attends clinic after an outside ICU admission. You review the first specialist nutrition assessment during ongoing sepsis and acute kidney injury. She was not receiving kidney-replacement therapy. Her established preillness weight was 60 kg.",
    "nodes": [
      {
        "slug": "aki-protein-restriction",
        "conceptId": "concept.nutrition-support-metabolism.acute-kidney-injury-initial-protein.v2",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Distinguish nutritional protein needs from an attempt to postpone KRT by underfeeding.",
        "task": "Which daily protein prescription should the hospital nutrition team begin with for {patientName} in this record?",
        "update": "The administration record showed 30 g protein per day while assessed energy delivery was being supplied. Urea rose and muscle wasting progressed. Kidney-replacement indications were being assessed separately. Each proposed protein amount would be supplied without increasing the current assessed energy provision.",
        "choices": [
          {
            "id": "assessed",
            "label": "60 g protein per day",
            "rationale": "For the stated acute/critical illness without KRT, ESPEN describes starting at 1 g/kg/day and increasing according to tolerance. At 60 kg that starts at 60 g, rather than perpetuating the 30-g delivery.",
            "temptation": "Match the illness and KRT state before selecting the initial amount.",
            "correctUnder": "The current non-KRT acute-illness state and reference weight apply.",
            "claims": [
              "r2.aki-start-protein",
              "renal-no-restrict",
              "delivered"
            ]
          },
          {
            "id": "restrict",
            "label": "36 g protein per day",
            "rationale": "This applies 0.6 g/kg/day, a lower chronic nondialysis-style amount, rather than the stated acute-illness start. Rising urea is not by itself a reason to restrict protein to postpone KRT.",
            "temptation": "Use urea to select a low-protein renal diet without interpreting the acute catabolic state.",
            "correctUnder": "A stable nonacute CKD situation with an appropriate individualized lower-protein assessment would be a different population.",
            "claims": [
              "r2.aki-start-protein",
              "renal-no-restrict"
            ]
          },
          {
            "id": "higher",
            "label": "90 g protein per day",
            "rationale": "This applies 1.5 g/kg/day immediately. That is not the initial non-KRT prescription described for this acute-illness record.",
            "temptation": "Import a KRT-associated higher protein prescription before that treatment is present.",
            "correctUnder": "If continuous KRT had begun, 1.5 g/kg/day is within the guideline range for the appropriate critical-illness population.",
            "claims": [
              "r2.aki-start-protein",
              "r2.ckrt-protein-context"
            ]
          }
        ],
        "key": "assessed",
        "explanation": "Interpret the illness and KRT status before using the reference weight. For this initial acute/critical-illness prescription without KRT, 60 kg at 1 g/kg/day gives 60 g/day; subsequent tolerance and assessment guide progression. The urea result does not establish that restricting delivery should be used to defer KRT. This is not an outpatient target or a maximum protein rule.",
        "claims": [
          "r2.aki-start-protein",
          "r2.ckrt-protein-context",
          "renal-no-restrict",
          "delivered"
        ],
        "gate": {
          "interpret": "Distinguish ongoing acute catabolic illness without KRT from a stable renal restriction or an established KRT population.",
          "apply": "Select a specific supported initial amount from the appropriate reference weight while recognizing the actual delivery and wasting trajectory.",
          "closestChoice": "higher",
          "decidingObservation": "KRT has not begun at the first specialist assessment.",
          "counterfactual": "If continuous KRT were present at that assessment, the 90-g option would equal 1.5 g/kg/day and fit the relevant guideline range, while the lower two options would not implement that range.",
          "counterfactualChoice": "higher",
          "deletionTest": "Illness/KRT status selects the recommendation; weight determines the amount; urea and wasting create the credible restriction error rather than supplying a target label.",
          "cueAttack": "Removed acute-illness and stable-CKD labels from the choices and replaced the generic endorsed plan with three concrete protein prescriptions. No option substitutes the wrong nutrient for protein.",
          "stageAudit": "All choices are initial daily protein prescriptions at the same specialist review, with energy and KRT assessment common.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A resident must select the clinical recommendation before calculating, rather than simply restore a supplied target or pick the acute-labelled option.",
          "sequenceAudit": "Standalone first ICU nutrition record; the later circuit-calorie case is not visible.",
          "limitation": "One directly verified ESPEN recommendation supports the exact initial amount and KRT context; clinical sign-off remains required, including applicability in this fictional phase of illness."
        },
        "previousConceptId": "concept.nutrition-support-metabolism.aki-protein-versus-krt-delay.v1",
        "conceptVersionReason": "The scored objective now selects a population-specific initial protein amount instead of only rejecting protein restriction to postpone KRT. This is a material new objective, so prior restriction history is retained under the previous concept."
      }
    ]
  },
  {
    "slug": "r2-renal-calorie-sources",
    "name": "Ava Morgan",
    "age": 61,
    "sex": "Female",
    "complaint": "Hospital nutrition questions",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 61-year-old woman, attends clinic after an outside ICU admission with acute kidney injury. You review a later hospital nutrition record during continuous KRT. The previous formula order supplied 2,200 kcal and 60 g protein per day.",
    "nodes": [
      {
        "slug": "renal-calorie-sources",
        "conceptId": "concept.nutrition-support-metabolism.krt-energy-source-reconciliation.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Include kidney-replacement substrate calories without scaling protein to remove an energy surplus.",
        "task": "Which daily formula prescription should the hospital team prepare for {patientName} during the documented KRT course?",
        "update": "The circuit team estimated the net substrate energy metabolized by this patient, after circuit removal; that estimate is shown below. The current clinical assessment was made for this stage of illness. KRT and the other administered treatments would continue with each proposed formula.",
        "choices": [
          {
            "id": "energy",
            "label": "1,600 kcal with 100 g protein",
            "rationale": "The 600 circuit-derived kcal count toward the total; the formula therefore supplies 1,600 kcal while providing the current 100-g protein assessment.",
            "temptation": "Reconcile net external energy and the separate nutrient prescription.",
            "correctUnder": "The represented net circuit contribution and current assessment apply.",
            "claims": [
              "renal-extras",
              "renal-energy",
              "renal-dialysis-loss"
            ]
          },
          {
            "id": "unchanged",
            "label": "2,200 kcal with 100 g protein",
            "rationale": "This updates protein but counts the entire total energy assessment as formula energy before adding the circuit contribution.",
            "temptation": "Correct protein while treating circuit substrates as outside nutritional energy.",
            "correctUnder": "If there were no metabolized external energy, this would supply the current assessment.",
            "claims": [
              "renal-extras",
              "renal-energy"
            ]
          },
          {
            "id": "volume",
            "label": "1,600 kcal with 60 g protein",
            "rationale": "This counts the circuit calories but leaves protein at the preceding prescription despite the separate current assessment.",
            "temptation": "Correct energy by retaining the former protein amount.",
            "correctUnder": "If the current protein assessment were still 60 g, this combination would fit the stated energy accounting.",
            "claims": [
              "renal-extras",
              "renal-dialysis-loss"
            ]
          },
          {
            "id": "prior",
            "label": "2,200 kcal with 60 g protein",
            "rationale": "This is the unchanged previous formula. It does not account for either the new circuit contribution or the current protein assessment.",
            "temptation": "Continue a familiar previous order after a new treatment changes the assessment.",
            "correctUnder": "Without the new external energy or a changed protein assessment, the former order could remain appropriate.",
            "claims": [
              "renal-extras",
              "renal-energy",
              "renal-dialysis-loss"
            ]
          }
        ],
        "key": "energy",
        "explanation": "The stipulated net metabolized circuit contribution is 600 kcal, so the 2,200-kcal total assessment leaves 1,600 kcal for formula. Independently implement the current 100-g protein assessment. A proportional reduction or a protein-only correction solves only one part of the current record. Actual circuit-derived energy requires its own measurement or estimate; no universal citrate or glucose yield is assumed.",
        "claims": [
          "renal-extras",
          "renal-energy",
          "renal-dialysis-loss"
        ],
        "gate": {
          "interpret": "Treat the estimated net metabolized circuit substrates as patient energy, rather than total dialysate content or an irrelevant device input.",
          "apply": "Prepare a concrete formula that meets the residual energy and current independent protein assessment.",
          "closestChoice": "unchanged",
          "decidingObservation": "The circuit estimate represents 600 kcal actually metabolized after removal, not a zero-energy treatment.",
          "counterfactual": "If the circuit estimate were zero net metabolized energy, the 2,200-kcal/100-g formula would implement the same current assessment.",
          "counterfactualChoice": "unchanged",
          "deletionTest": "Removing the circuit estimate changes formula energy. Removing the separate protein assessment changes whether the old protein amount should remain. No completed comparison is announced in prose.",
          "cueAttack": "Four balanced prescriptions replace convergent verbal bundles. The fourth is the actual prior order and therefore a credible status-quo error, not filler added solely for symmetry. Each energy and protein component occurs twice.",
          "stageAudit": "All options are daily formula prescriptions while the same KRT course continues.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The two independent prescription constraints require interpreting a net circuit estimate and revising nutrient composition; no preceding answer repeats a protein-deficit label.",
          "sequenceAudit": "Standalone later KRT record, separate from the initial non-KRT protein case. No earlier feedback is available.",
          "limitation": "The 600-kcal estimate and 100-g assessment are constructed patient inputs; no universal circuit absorption factor, KRT dose or protein requirement is taught."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Energy (kcal/day)",
            "Protein (g/day)"
          ],
          "rowHeaders": [
            "Current assessed total need",
            "Actual formula administration",
            "Net metabolized circuit substrates"
          ],
          "cells": [
            [
              "2200",
              "100"
            ],
            [
              "2200",
              "60"
            ],
            [
              "600",
              "0"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-swallow-versus-gut",
    "name": "Grace Turner",
    "age": 58,
    "sex": "Female",
    "complaint": "Feeding plan review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic after an outside airway admission. You review the discharge nutrition plan. During the swallowing examination, thin and thickened liquids entered below the vocal folds. Teaspoon purees were swallowed without airway entry, but fatigue stopped the supervised meals after a few spoonfuls.",
    "nodes": [
      {
        "slug": "swallow-versus-gut",
        "conceptId": "concept.n3.swallowing-failure-versus-intestinal-failure",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.847a7a61964a4bc4"
        ],
        "conceptType": "management",
        "objective": "Distinguish oral aspiration from failure of a successful gastric enteral route.",
        "task": "Which discharge nutrition plan should the hospital team use for {patientName} while swallowing rehabilitation continues?",
        "update": "Gastric tube administration was recorded without regurgitation. The dietitian compared the foods actually consumed with the current individual nutrition assessment.",
        "choices": [
          {
            "id": "gastric",
            "label": "Gastric tube nutrition with supervised puree intake",
            "rationale": "Safe swallowing of the tested puree does not establish enough oral delivery. The represented tube contribution plus supervised puree supplies the current assessment.",
            "temptation": "Separate a safe texture from sufficient nutrient delivery.",
            "correctUnder": "The current texture-specific findings and consumed amount apply.",
            "claims": [
              "r2.swallow-scope",
              "swallow",
              "delivered",
              "enteral-next"
            ]
          },
          {
            "id": "oral",
            "label": "Pureed meals with texture-modified oral supplements",
            "rationale": "Modified oral intake can be appropriate when safe and sufficient, but the supervised consumption here is small and fatigue-limited; a written oral prescription does not demonstrate delivery.",
            "temptation": "Treat successful swallowing of a few puree spoonfuls as nutritional independence from the tube.",
            "correctUnder": "A sustained supervised oral trial that actually supplies the assessed nutrients could support an oral-only regimen.",
            "claims": [
              "r2.swallow-scope",
              "oral-first",
              "delivered"
            ]
          },
          {
            "id": "pn",
            "label": "Central PN with supervised puree intake",
            "rationale": "The record does not show failure of gastric delivery. Unsafe liquids or low oral consumption do not independently establish a PN indication.",
            "temptation": "Escalate beyond the gut because an unrestricted oral diet is not possible.",
            "correctUnder": "If appropriate enteral delivery became infeasible or inadequate, PN could become necessary while oral practice was separately assessed.",
            "claims": [
              "pn-boundary",
              "swallow",
              "delivered"
            ]
          }
        ],
        "key": "gastric",
        "explanation": "Interpret swallowing safety by the tested consistency, then assess actual delivery. The puree is safe in the represented small trial, but it supplies only 300 kcal and 10 g; the gastric feed supplies the remaining recorded contribution. Preserve supervised puree practice and tube support rather than infer that every oral texture is unsafe or that a safe texture provides enough nutrition.",
        "claims": [
          "r2.swallow-scope",
          "swallow",
          "delivered",
          "enteral-next",
          "oral-first",
          "pn-boundary"
        ],
        "gate": {
          "interpret": "Distinguish texture-specific swallowing safety from the ability to consume enough of that texture.",
          "apply": "Select the combined discharge delivery plan instead of assuming either unrestricted oral sufficiency or intestinal failure.",
          "closestChoice": "oral",
          "decidingObservation": "Safe puree trials are fatigue-limited and actually supply 300 kcal and 10 g against the recorded assessment.",
          "counterfactual": "If supervised safe puree and texture-modified supplement intake actually supplied the full assessed nutrition over the monitored oral trial, the oral-only regimen would become appropriate.",
          "counterfactualChoice": "oral",
          "deletionTest": "Without the texture findings, oral practice cannot be judged safe. Without consumed quantities and fatigue response, its sufficiency cannot be judged. The former redundant stable-weight update is removed.",
          "cueAttack": "Removed the supplied successful-route/needs-maintained conclusion and the retain task. Every label is a specific discharge nutrition regimen; the oral plan is a credible modified-consistency competitor, not an already excluded unrestricted-liquid regimen.",
          "stageAudit": "All options specify the discharge nutrient-delivery plan with swallowing rehabilitation shared.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A resident must avoid two different overgeneralizations: aspiration of liquids means every texture is unsafe, and a safe texture means enough food can be consumed.",
          "sequenceAudit": "Standalone discharge review. The later independently passed gastric-regurgitation item is split and retains all its reviewed words separately.",
          "limitation": "Constructed consumption amounts and texture observations are not universal swallow-testing rules or nutrition thresholds. The swallowing team still individualizes safe oral practice."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Energy (kcal/day)",
            "Protein (g/day)"
          ],
          "rowHeaders": [
            "Current daily assessment",
            "Purees actually consumed",
            "Gastric feed administered"
          ],
          "cells": [
            [
              "1600",
              "75"
            ],
            [
              "300",
              "10"
            ],
            [
              "1300",
              "65"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-vitc-directed-support",
    "name": "Isabel Reed",
    "age": 62,
    "sex": "Female",
    "complaint": "Bruising and wound delay",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 62-year-old woman, attends clinic to review a recent hospital nutrition decision for bruising and delayed incision healing. For months her diet had contained starches, dairy and meat but no fruit or vegetables. The examination documented bleeding gums and perifollicular hemorrhages; platelet count and prothrombin time were within their reporting intervals.",
    "nodes": [
      {
        "slug": "vitc-directed-support",
        "conceptId": "concept.nutrition-support-metabolism.ascorbate-deficiency-route.v2",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Recognize a symptomatic vitamin C deficiency pattern and select a deliverable replacement route when oral treatment is unavailable.",
        "task": "Which vitamin replacement plan best fits {patientName} at the documented hospital review?",
        "update": "During that admission, repeated trials of oral food, fluids and vitamin preparations were followed by vomiting. The hospital team was managing the gastrointestinal cause and arranging nutrition support. The vitamin decision concerned treatment during this interval.",
        "choices": [
          {
            "id": "c",
            "label": "Intravenous vitamin C replacement",
            "rationale": "The clinical pattern supports symptomatic vitamin C deficiency. The current inability to deliver oral treatment meets the labeled route boundary for a short parenteral course.",
            "temptation": "Apply both the deficiency pattern and the actual treatment-delivery limitation.",
            "correctUnder": "The represented symptomatic deficiency and inability to retain oral treatment apply.",
            "claims": [
              "vitc-deficiency",
              "vitc-collagen",
              "r2.vitc-parenteral"
            ]
          },
          {
            "id": "oral-c",
            "label": "Oral vitamin C replacement",
            "rationale": "The nutrient addresses the represented deficiency, but the current oral trials have not retained treatment.",
            "temptation": "Recognize the right nutrient but treat an undelivered oral prescription as effective replacement.",
            "correctUnder": "If oral vitamin treatment were reliably retained, oral replacement would be appropriate and the labeled need for parenteral treatment would not be established.",
            "claims": [
              "vitc-deficiency",
              "r2.vitc-parenteral"
            ]
          },
          {
            "id": "k",
            "label": "Intravenous vitamin K replacement",
            "rationale": "An injectable route does not make vitamin K the nutrient indicated by the dietary, mucocutaneous and prothrombin-time findings.",
            "temptation": "Attribute nutritional bleeding to a vitamin-K-dependent coagulation problem.",
            "correctUnder": "A compatible vitamin-K-related coagulation abnormality with inability to receive oral treatment would create a different nutrient/route decision.",
            "claims": [
              "vitc-deficiency",
              "vitk-bleeding"
            ]
          },
          {
            "id": "oral-k",
            "label": "Oral vitamin K replacement",
            "rationale": "This does not address the represented vitamin C pattern and also relies on currently unretained oral treatment.",
            "temptation": "Choose a familiar bleeding-related vitamin and the routine oral route.",
            "correctUnder": "A vitamin-K deficiency context with reliable oral treatment would be a different clinical problem.",
            "claims": [
              "vitc-deficiency",
              "vitk-bleeding"
            ]
          }
        ],
        "key": "c",
        "explanation": "Interpret the diet, connective-tissue findings and coagulation result before choosing the nutrient. Then apply the actual inability to retain oral treatment. The ascorbic-acid injection label supports short-term treatment of symptomatic scurvy when oral administration is not possible or sufficient; this is not a routine IV treatment for postoperative wounds. The treating team determines the regimen and monitors its risks.",
        "claims": [
          "vitc-deficiency",
          "vitc-collagen",
          "vitk-bleeding",
          "r2.vitc-parenteral"
        ],
        "gate": {
          "interpret": "Identify a symptomatic deficiency pattern rather than treat every nutritional bleed as a coagulation-factor problem.",
          "apply": "Choose a route that can deliver the indicated nutrient during the observed oral-treatment failure.",
          "closestChoice": "oral-c",
          "decidingObservation": "The actual oral food, fluid and vitamin trials are not retained at the documented review.",
          "counterfactual": "If oral vitamin C were reliably retained in the same deficiency context, oral replacement would become the appropriate listed plan and the indication for parenteral treatment would no longer be shown.",
          "counterfactualChoice": "oral-c",
          "deletionTest": "The examination and prothrombin result distinguish the nutrient; the treatment-response observation distinguishes the route. Removing either leaves two clinically different candidates unresolved.",
          "cueAttack": "All options are vitamin replacement prescriptions of parallel scope. Protein fortification and its exclusion sentence are removed. The four nutrient/route combinations occur with equal component frequency; no key can be assembled from majority labels.",
          "stageAudit": "One vitamin replacement decision with management of the vomiting and broader nutrition support shared.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The case now requires a deficiency inference and a consequential route decision; recognizing a classic pattern alone does not select between oral and IV vitamin C.",
          "sequenceAudit": "Standalone retrospective hospital decision in clinic; no earlier collagen explanation or vitamin answer is available.",
          "limitation": "New meaning/version requires clinical review. Current official labeling supports the qualitative indication only; no dose, administration interval, duration rule or assumption of safety in every patient is taught."
        },
        "previousConceptId": "concept.nutrition-support-metabolism.ascorbate-deficiency-clinical-application.v1",
        "conceptVersionReason": "The revised scored decision adds clinically indicated parenteral replacement when oral treatment cannot be delivered, rather than merely associating a deficiency pattern with a nutrient name. Preserve the unadmitted v1 concept and do not transfer history."
      }
    ]
  },
  {
    "slug": "r2-zinc-copper-assessment",
    "name": "Caleb Hayes",
    "age": 60,
    "sex": "Male",
    "complaint": "Fatigue and imbalance",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 60-year-old man, attends clinic for declining hemoglobin, neutropenia and new gait imbalance with reduced vibration sensation. He has been taking two zinc-containing wound supplements for months; medication reconciliation finds the combined zinc intake above the adult upper intake level.",
    "nodes": [
      {
        "slug": "zinc-copper-assessment",
        "conceptId": "concept.nutrition-support-metabolism.zinc-associated-copper-evaluation.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "workup",
        "objective": "Investigate a potentially reversible trace-element cause before assigning cytopenias and sensory findings to unrelated disease.",
        "task": "Which investigation should the team add next for {patientName} after interpreting the available results?",
        "update": "The current laboratory record is shown below. The blood-count and neurologic findings remain under evaluation rather than assigned to a single deficiency.",
        "choices": [
          {
            "id": "copper",
            "label": "Serum copper and ceruloplasmin",
            "rationale": "Renal impairment can raise MMA, so this result does not by itself establish B12 depletion. The zinc exposure and combined hematologic/neurologic findings justify evaluating copper status.",
            "temptation": "Integrate a confounded functional marker with a separate reversible nutrient exposure.",
            "correctUnder": "The renal context, zinc exposure and combined findings apply.",
            "claims": [
              "r2.mma-renal",
              "copper-zinc",
              "copper-findings",
              "copper-tests"
            ],
            "timingProfileId": "timing.test.basic_labs"
          },
          {
            "id": "intrinsic",
            "label": "Serum intrinsic-factor antibodies",
            "rationale": "This investigates an autoimmune cause of B12 deficiency, but the elevated MMA here needs renal-context interpretation before it is treated as proof of that pathway.",
            "temptation": "Treat a positive functional marker as confirmed tissue B12 deficiency and move directly to its cause.",
            "correctUnder": "Clear B12 deficiency with an appropriate autoimmune-gastritis context would support this etiologic investigation.",
            "claims": [
              "r2.mma-renal",
              "r2.intrinsic-factor",
              "b12-assessment"
            ],
            "timingProfileId": "timing.test.basic_labs"
          },
          {
            "id": "marrow",
            "label": "Bone-marrow aspiration and biopsy",
            "rationale": "Marrow disease remains a possible explanation for cytopenias, but the current record includes a potentially reversible nutrient exposure that merits targeted evaluation.",
            "temptation": "Separate the sensory findings from cytopenias and assign a primary marrow diagnosis first.",
            "correctUnder": "Persistent unexplained cytopenias after reversible causes are evaluated could justify marrow investigation.",
            "claims": [
              "marrow-evaluation",
              "copper-findings",
              "copper-tests"
            ],
            "timingProfileId": "timing.test.biopsy"
          }
        ],
        "key": "copper",
        "explanation": "Interpret MMA with renal function: an increased result is not specific for B12 deficiency in renal impairment. Then integrate zinc exposure with cytopenias and sensory dysfunction and assess copper status. This does not exclude coexisting B12 deficiency or marrow disease; the result and subsequent course still need clinical interpretation.",
        "claims": [
          "r2.mma-renal",
          "r2.intrinsic-factor",
          "b12-assessment",
          "copper-zinc",
          "copper-findings",
          "copper-tests",
          "marrow-evaluation"
        ],
        "gate": {
          "interpret": "Recognize renal confounding of the elevated functional B12 marker rather than diagnose tissue depletion from that result alone.",
          "apply": "Prioritize a targeted reversible-cause assessment that links the exposure to both affected systems.",
          "closestChoice": "intrinsic",
          "decidingObservation": "MMA is raised in the setting of substantial renal impairment, while the total B12 is not below its reporting interval and an alternative nutrient exposure is present.",
          "counterfactual": "If the biochemical pattern instead showed low B12 with elevated MMA and preserved renal function, without the high-zinc exposure, an intrinsic-factor antibody investigation for the cause of B12 deficiency would become the appropriate competing pathway.",
          "counterfactualChoice": "intrinsic",
          "deletionTest": "The MMA result makes the B12 etiologic test a credible new comparison; renal function limits that inference. Zinc exposure and the combined clinical findings motivate the alternative targeted test rather than a generic unexplained-cytopenia workup.",
          "cueAttack": "Removed the unmotivated repeat B12/MMA option. Both copper studies and intrinsic-factor antibodies are genuinely new blood investigations at this review; the key is not uniquely the only untried noninvasive test.",
          "stageAudit": "All options are named etiologic investigations; the task does not prefilter by asking only for a blood test.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The resident must interpret an apparently supportive but confounded marker before ranking a familiar B12 pathway against another reversible cause and marrow disease.",
          "sequenceAudit": "Standalone with all currently available results; no prior feedback supplies the zinc-copper relationship.",
          "limitation": "Government and NHS sources support the mechanisms and test roles, not a universal copper-before-B12 algorithm. Coexistence remains possible; the exact prioritization requires independent and clinical review without categorical assay exclusions."
        },
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional patient observations",
          "items": [
            {
              "label": "Serum vitamin B12",
              "value": "Within the reporting interval"
            },
            {
              "label": "Methylmalonic acid",
              "value": "Above the reporting interval"
            },
            {
              "label": "Estimated GFR",
              "value": "Persistently 25 mL/min/1.73 m2"
            }
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-enteral-medication-review",
    "name": "Amelia Ross",
    "age": 57,
    "sex": "Female",
    "complaint": "Loose stools",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 57-year-old woman, attends clinic with diarrhea during home gastric feeding. The hospital record shows a formula change and a medication-formulation change during the same period. She has no fever, abdominal pain or blood in stool, and clinical hydration is stable.",
    "nodes": [
      {
        "slug": "enteral-medication-review",
        "conceptId": "concept.nutrition-support-metabolism.enteral-diarrhea-medication-formulation.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Use exposure chronology to correct a medication-related feeding complication without assuming formula intolerance.",
        "task": "Which management change should the team make next for {patientName} while reassessing the diarrhea?",
        "update": "The subsequent administration record is shown below. Doses of the prescribed medicines remained required; the pharmacist would review tube compatibility for any substitute formulation.",
        "choices": [
          {
            "id": "meds",
            "label": "Use tube-compatible alternatives to the current liquid medicines",
            "rationale": "The recurrence pattern persists after the feed returns to baseline and changes again with medicine-formulation exposure. Review substitute compatible formulations while preserving nutrition and needed medicine doses.",
            "temptation": "Interpret the separated exposure sequence instead of assigning all diarrhea to the initial feed change.",
            "correctUnder": "The represented medication-associated course applies.",
            "claims": [
              "diarrhea-review",
              "sorbitol",
              "delivered"
            ]
          },
          {
            "id": "formula",
            "label": "Use a peptide-based formula instead of the current polymeric feed",
            "rationale": "The original formula was tolerated before the coincident changes and symptoms persisted after it was restored. The later course points to the medicine preparations rather than establishing a peptide-formula indication.",
            "temptation": "Anchor on the first formula change and ignore the subsequent separated observations.",
            "correctUnder": "A demonstrated digestive/absorptive problem or formula-associated course after other causes were assessed could support a specific formula change.",
            "claims": [
              "diarrhea-review",
              "delivered"
            ]
          },
          {
            "id": "rate",
            "label": "Use a lower hourly feed rate over a longer schedule",
            "rationale": "Rate adjustment can be useful when symptoms track administration rate, but this record separates the stool course from the restored feeding schedule.",
            "temptation": "Apply a familiar tolerance adjustment without accounting for the medicine exposure sequence.",
            "correctUnder": "Symptoms consistently appearing during rate escalation and resolving when it is reduced would support a rate/schedule intervention.",
            "claims": [
              "diarrhea-review",
              "delivered"
            ]
          }
        ],
        "key": "meds",
        "explanation": "The initial changes were confounded. Later, diarrhea persisted on the original feed and then decreased and recurred with withdrawal and return of the liquid medicine preparations. That supports a pharmacist-led formulation change before replacing a previously effective feed. Liquid preparations can contain diarrhea-promoting excipients; this record does not prove a single ingredient or exclude every other cause.",
        "claims": [
          "diarrhea-review",
          "sorbitol",
          "delivered"
        ],
        "gate": {
          "interpret": "Use the separated later observations to resolve the coincident initial feed and medicine changes, without treating one episode as proof of causation.",
          "apply": "Preserve useful nutrient delivery while substituting compatible medicine formulations rather than merely stop needed doses or change the wrong exposure.",
          "closestChoice": "formula",
          "decidingObservation": "Restoring the original feed does not reverse the course, whereas the medicine-formulation withdrawal and resumption track its reversal and recurrence.",
          "counterfactual": "If the liquid medicines remained unchanged while returning to the original formula consistently resolved symptoms and reintroducing the alternative feed reproduced them, formula revision would become the reasonable first intervention.",
          "counterfactualChoice": "formula",
          "deletionTest": "The initial row alone cannot distinguish medicine from formula. The later rows separate those exposures and determine which administration component should change.",
          "cueAttack": "Removed sorbitol from the pre-answer fields and label. The neutral task no longer says preparation change. Each option is a specific administration change of comparable scope; the feed and medicines both changed initially, so novelty alone cannot select the key.",
          "stageAudit": "All options revise an administered preparation or schedule while clinical reassessment and required medicine treatment continue.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Interpretation of a confounded and then separated exposure sequence precedes the practical management choice. This is a fair moderate clinical attribution problem, not a claim that any dechallenge proves exclusivity.",
          "sequenceAudit": "Standalone with all chronology in the current record; no previous sorbitol explanation is visible.",
          "limitation": "The pharmacist must verify actual drug/formulation/tube compatibility. No unnamed ingredient is diagnosed, no crushing instruction or dose equivalence is invented, and other diarrhea causes remain under review."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional sequential observations",
          "columnHeaders": [
            "Feed administered",
            "Medicine formulation administered",
            "Recorded stools"
          ],
          "rowHeaders": [
            "Baseline",
            "Day 1",
            "Day 2",
            "Day 3",
            "Day 4"
          ],
          "cells": [
            [
              "Original polymeric feed and schedule",
              "Usual preparations",
              "Two formed"
            ],
            [
              "Concentrated feed; same daily energy",
              "New liquid preparations",
              "Six watery"
            ],
            [
              "Original feed and schedule restored",
              "New liquid preparations",
              "Six watery"
            ],
            [
              "Original feed and schedule",
              "Liquid preparations not supplied during a pharmacy delay",
              "One formed"
            ],
            [
              "Original feed and schedule",
              "Liquid preparations resumed",
              "Five watery"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-postoperative-route-after-swallow",
    "name": "Sophia Lane",
    "age": 68,
    "sex": "Female",
    "complaint": "Recovery plan review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 68-year-old woman, attends clinic after laparoscopic colon resection. You review her early postoperative hospital feeding record. Before admission she had weeks of reduced intake and weight loss. The postoperative abdomen remained soft without progressive distension or vomiting, and flatus had not yet been recorded.",
    "nodes": [
      {
        "slug": "postoperative-route-after-swallow",
        "conceptId": "concept.nutrition-support-metabolism.postoperative-oral-intake-tolerance.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Adapt early postoperative nutrition to actual oral safety rather than using absent flatus as a contraindication to all enteral feeding.",
        "task": "Which nutrition route should the hospital team initiate for {patientName} at the documented review?",
        "update": "The swallowing team observed airway entry below the vocal folds with thin and thickened liquids. Teaspoon puree was swallowed without airway entry. A supervised trial using the allowed, fortified textures supplied 200 kcal and 10 g protein over the day before fatigue stopped further intake; the current assessment was 1,800 kcal and 85 g protein. Swallowing therapy and clinical postoperative reassessment continued.",
        "choices": [
          {
            "id": "gastric",
            "label": "Nasogastric tube nutrition",
            "rationale": "The observed safe texture is not delivering sufficient nutrition in the actual supported trial. The abdominal course does not establish an enteral contraindication merely because flatus is unrecorded.",
            "temptation": "Apply both the observed oral-delivery limit and the actual postoperative tolerance boundary.",
            "correctUnder": "The current supervised trial and uncomplicated abdominal course apply.",
            "claims": [
              "r2.swallow-scope",
              "delivered",
              "early-oral",
              "enteral-next"
            ]
          },
          {
            "id": "oral",
            "label": "Oral food and supplements",
            "rationale": "A modified oral plan is clinically possible for the safe texture, but the actual fortified trial is fatigue-limited and far below the current assessment.",
            "temptation": "Treat safety of one consistency as proof that an oral prescription can supply enough.",
            "correctUnder": "If the supervised safe oral regimen actually delivered the assessed nutrition, oral support would be preferred.",
            "claims": [
              "r2.swallow-scope",
              "oral-first",
              "delivered"
            ]
          },
          {
            "id": "pn",
            "label": "Central parenteral nutrition",
            "rationale": "The record shows an oral delivery problem, not failure or contraindication of a downstream enteral route. Unrecorded flatus is not by itself that boundary.",
            "temptation": "Combine oral inadequacy and a traditional postoperative milestone into an assumption of intestinal failure.",
            "correctUnder": "An actual enteral contraindication or sustained failure of appropriate enteral delivery would justify considering PN.",
            "claims": [
              "pn-boundary",
              "enteral-next",
              "early-oral"
            ]
          }
        ],
        "key": "gastric",
        "explanation": "The complete swallowing record permits some puree, so it would be wrong to call every oral consistency unsafe. The supported oral trial nevertheless supplies very little of the assessed requirement. Choose enteral delivery while the swallowing problem is managed; absent flatus alone does not establish that the gut cannot be used after this represented uncomplicated operation.",
        "claims": [
          "r2.swallow-scope",
          "swallow",
          "early-oral",
          "enteral-next",
          "oral-first",
          "delivered",
          "pn-boundary"
        ],
        "gate": {
          "interpret": "Distinguish a consistency that can be swallowed safely from an actually sufficient oral nutrition strategy.",
          "apply": "Initiate an appropriate enteral route rather than delay nutrition for flatus or escalate directly to PN.",
          "closestChoice": "oral",
          "decidingObservation": "The allowed fortified textures were actually trialed but supplied only 200 kcal and 10 g before fatigue limited further consumption.",
          "counterfactual": "If the supervised safe oral regimen actually supplied the assessed nutrients, oral food and supplements would become preferred despite unchanged absence of recorded flatus.",
          "counterfactualChoice": "oral",
          "deletionTest": "The texture observations prevent an unsupported blanket oral prohibition. The consumed amounts and fatigue response establish oral inadequacy. The abdominal trajectory prevents absent flatus from being treated as an enteral contraindication.",
          "cueAttack": "Added the decision-critical consistency and actual delivery evidence instead of announcing tube feeding indicated. All options remain parallel named routes and the task names no preferred pathway or waiting period.",
          "stageAudit": "One early postoperative nutrition-route initiation decision with swallowing therapy and reassessment shared.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The revised item requires both complete oral-route interpretation and application of the postoperative enteral-feeding boundary; it is not a universal no-flatus test.",
          "sequenceAudit": "Standalone historical review, independent of the other swallowing or PN nodes.",
          "limitation": "The case does not assert that an NG tube eliminates aspiration or that all postoperative patients may be fed regardless of their current clinical course. No universal postoperative waiting interval is used."
        }
      }
    ]
  },
  {
    "slug": "r2-risk-assessment",
    "name": "Nora Bennett",
    "age": 63,
    "sex": "Female",
    "complaint": "Preoperative weight loss",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 63-year-old woman, attends clinic before elective colectomy. Her weight remains above the usual reference range, but she now uses tighter belt holes and getting out of a chair has become harder. She leaves much of each meal. Albumin fell while C-reactive protein rose.",
    "nodes": [
      {
        "slug": "risk-assessment",
        "conceptId": "concept.preoperative-nutrition.nutritional-risk-screening",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.673325eaba37e723"
        ],
        "conceptType": "workup",
        "objective": "Choose structured nutrition assessment when intake and functional decline coexist with an inflammation-sensitive marker.",
        "task": "Which evaluation should be arranged next for {patientName}?",
        "update": "Her usual clothes have become loose despite a body weight above the reference range. A meal record shows unfinished servings, and serial chair-rise observations show declining function. Albumin and inflammatory-marker trends were obtained during the same period.",
        "choices": [
          {
            "id": "clinical",
            "label": "Dietitian assessment of intake and physical function",
            "rationale": "This evaluates the documented intake and functional trajectory rather than interpreting albumin alone.",
            "temptation": "Integrate observed function with intake.",
            "correctUnder": "A clinical nutritional trajectory warrants assessment.",
            "claims": [
              "screen",
              "albumin"
            ]
          },
          {
            "id": "repeat",
            "label": "Repeat albumin and inflammatory-marker assessment",
            "rationale": "This addresses the biochemical trajectory but would not measure the observed intake and functional changes.",
            "temptation": "Treat an inflammation-sensitive marker as the prerequisite to assessment.",
            "correctUnder": "Isolated hypoalbuminemia without a clinical nutritional trajectory could support biochemical follow-up.",
            "claims": [
              "screen",
              "albumin"
            ],
            "timingProfileId": "timing.test.basic_labs"
          },
          {
            "id": "loss",
            "label": "Urinary protein and hepatic synthetic-function assessment",
            "rationale": "These tests investigate different explanations for hypoalbuminemia; the current record supplies no corresponding renal or hepatic finding.",
            "temptation": "Investigate the low marker before assessing the clinical trajectory.",
            "correctUnder": "Proteinuria, edema or hepatic disease would establish a closer competing pathway.",
            "claims": [
              "screen",
              "albumin"
            ],
            "timingProfileId": "timing.test.basic_labs"
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. Intake and function deserve clinical assessment, and albumin is affected by inflammation. This record does not make a renal/hepatic pathway a credible nearest competitor. Adding those findings would create concurrent indications rather than justify one exclusive next evaluation.",
        "claims": [
          "screen",
          "albumin"
        ],
        "gate": {
          "interpret": "Separate the clinical trajectory from inflammatory hypoalbuminemia.",
          "apply": "Attempt to choose a next evaluation from three assessment pathways.",
          "closestChoice": "repeat",
          "decidingObservation": "Reduced intake and function extend beyond the laboratory change.",
          "counterfactual": "With stable intake and function, biochemical follow-up could address isolated inflammatory hypoalbuminemia, but that is a different low-risk problem.",
          "counterfactualChoice": "repeat",
          "deletionTest": "The biochemical trend is removable without changing the obvious assessment; the proposed two-step demand fails deletion.",
          "cueAttack": "Removed the nutrition category from the task and shortened the key; the unmotivated renal/hepatic alternative remains unfairly remote.",
          "stageAudit": "Three evaluation pathways; their present indications are not comparable.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Intended moderate but not accepted: the supplied trajectory largely repeats the chosen assessment and the strongest alternate lacks an indication.",
          "sequenceAudit": "Standalone attempt; PASS oral-escalation is preserved separately.",
          "limitation": "PARKED after one revision: no supported observation makes these alternatives comparable without creating co-indications. No active key."
        }
      }
    ]
  },
  {
    "slug": "r2-baseline-attribution",
    "name": "Mira Collins",
    "age": 54,
    "sex": "Female",
    "complaint": "Nutrition restart review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 54-year-old woman, reviews an outside hospital nutrition restart in clinic after weeks of minimal intake. Electrolyte deficits were present before any nutrition and were replaced. At the later decision reviewed here, intravenous carbohydrate and formula had begun, and serial phosphate, potassium and magnesium subsequently fell.",
    "nodes": [
      {
        "slug": "baseline-attribution",
        "conceptId": "concept.nutrition-support-metabolism.restart-advancement-boundary.v2",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.7db5902fa72086b3"
        ],
        "conceptType": "workup",
        "objective": "Attempt to distinguish postexposure deterioration from baseline depletion before selecting a restart-advancement response.",
        "task": "Which change to the current nutrition plan should the hospital team make for {patientName}?",
        "update": "The clinical team is replacing electrolytes and investigating alternative causes. The record supplies no approved local restart protocol. Both enteral formula and intravenous dextrose contribute carbohydrate.",
        "choices": [
          {
            "id": "reduce",
            "label": "Reduce the combined enteral and intravenous carbohydrate delivery",
            "rationale": "A reduction strategy may be appropriate in a supported severe deterioration context, but the verified sources do not establish a unique reduction boundary for this exact record.",
            "temptation": "Count all carbohydrate rather than formula alone.",
            "correctUnder": "Requires a clinician-approved severity and reduction rule.",
            "claims": [
              "monitor",
              "not-specific",
              "refeed-risk"
            ]
          },
          {
            "id": "hold",
            "label": "Maintain current delivery and defer further advancement",
            "rationale": "Deferring escalation is a different strategy from reducing present delivery; available recommendations do not support one unique choice for this underspecified severity.",
            "temptation": "Avoid advancing during unresolved deterioration.",
            "correctUnder": "Requires the exact clinical severity and an approved advancement plan.",
            "claims": [
              "monitor",
              "not-specific",
              "refeed-risk"
            ]
          },
          {
            "id": "advance",
            "label": "Advance nutrition while continuing electrolyte replacement",
            "rationale": "Contemporary guidance differs in how nutritional progression is managed with electrolyte changes; this option cannot be ranked merely from chronology.",
            "temptation": "Avoid prolonged underfeeding but underestimate a clinically important change.",
            "correctUnder": "Requires sufficient clinical stability and the applicable guidance/protocol.",
            "claims": [
              "monitor",
              "refeed-risk"
            ]
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. The new chronology is consequential rather than a pretreatment truism. It still cannot choose reduction, deferred advancement or progression from chronology alone; severity and the disputed restart policy need clinician resolution.",
        "claims": [
          "monitor",
          "not-specific",
          "refeed-risk",
          "preexisting"
        ],
        "gate": {
          "interpret": "Separate pre-existing abnormalities from a later change after combined carbohydrate exposure while assessing other causes.",
          "apply": "Attempt to select a concrete nutrition-advancement response.",
          "closestChoice": "hold",
          "decidingObservation": "Serial postexposure change is relevant, but its severity and appropriate policy are not established by the available evidence.",
          "counterfactual": "A clinically stable course with reassuring serial results would remove the present obstacle to monitored advancement; it does not settle the offered choices in the actual record.",
          "counterfactualChoice": "advance",
          "deletionTest": "Exposure chronology now matters, but deleting an unsupported severity interpretation leaves no defensible unique action.",
          "cueAttack": "Removed the temporally impossible corrected-postrestart distractor. All choices now concern current delivery, exposing rather than concealing the policy disagreement.",
          "stageAudit": "Three same-stage nutrition-advancement actions; no one is keyed.",
          "predictedDifficulty": "hard",
          "difficultyReason": "Potentially consequential two-step decision, withheld because difficulty cannot substitute for an evidence-supported action boundary.",
          "sequenceAudit": "Standalone unkeyed attempt; no prior prophylaxis feedback or PASS companion.",
          "limitation": "PARKED after one revision: combined-carbohydrate reduction versus deferred advancement remains an inherited owner hold and guideline disagreement; no invented severity cutoff or active key."
        },
        "previousConceptId": "concept.n2.refeeding-baseline-phosphate-attribution",
        "conceptVersionReason": "Attempted consequential restart-advancement decision differs materially from baseline temporal attribution; parked, with no active history migration."
      }
    ]
  },
  {
    "slug": "r2-chyle-composition",
    "name": "Henry Patel",
    "age": 64,
    "sex": "Male",
    "complaint": "Drainage follow-up",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 64-year-old man, reviews an outside hospital record in clinic after postoperative chylous ascites. The nutrition team has established energy and protein goals. The record does not establish a drainage-response boundary for changing route.",
    "nodes": [
      {
        "slug": "chyle-composition",
        "conceptId": "concept.n3.chyle-leak-diet-composition-versus-calories",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.58ff6eb4a4b8d4e1"
        ],
        "conceptType": "management",
        "objective": "Correct both an energy shortfall and fat composition without attributing output change to one confounded exposure.",
        "task": "Which nutrition plan should be selected next for {patientName}?",
        "update": "Each proposed plan is constructed to meet the same assessed energy and protein needs. There has not been a documented adequate trial of a specifically described low-long-chain-fat regimen.",
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Composition and route",
            "Energy and protein"
          ],
          "rowHeaders": [
            "Plan A",
            "Plan B",
            "Plan C"
          ],
          "cells": [
            [
              "Oral/enteral, long-chain fat restricted with MCT substitution",
              "Meets the assessed goals"
            ],
            [
              "Oral/enteral, fat-free carbohydrate-based supplementation",
              "Meets the assessed goals"
            ],
            [
              "Parenteral nutrition with enteral intake withheld",
              "Meets the assessed goals"
            ]
          ]
        },
        "choices": [
          {
            "id": "mct",
            "label": "Use nutrition plan A",
            "rationale": "Long-chain fat restriction with MCT substitution is a supported conservative approach, but the case does not establish its superiority over every nutritionally adequate alternative.",
            "temptation": "Recognize the lymphatic transport distinction.",
            "correctUnder": "A clinician-approved initial conservative plan could select this approach.",
            "claims": [
              "chyle-fat",
              "chyle-compose"
            ]
          },
          {
            "id": "carbohydrate",
            "label": "Use nutrition plan B",
            "rationale": "The earlier underfeeding flaw has been removed. The verified evidence does not rank this fully supplemented alternative against plan A in this exact record.",
            "temptation": "Avoid intestinal long-chain-fat delivery while preserving adequacy.",
            "correctUnder": "Requires clinician evaluation of composition and feasibility rather than a categorical assertion of inferiority.",
            "claims": [
              "chyle-fat",
              "chyle-compose"
            ]
          },
          {
            "id": "pn",
            "label": "Use nutrition plan C",
            "rationale": "PN can be used in selected chyle-management courses, but this record supplies no verified failure boundary that establishes the need for enteral withdrawal now.",
            "temptation": "Escalate to bowel rest before defining failure of conservative nutrition.",
            "correctUnder": "Persistent drainage and failed conservative management may support PN, but the exact transition requires review.",
            "claims": [
              "chyle-pn",
              "chyle-compose"
            ]
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. Long-chain fat and MCT follow different transport pathways. That supports the rationale for a conservative MCT-containing plan, not a unique ranking of all energy/protein-adequate plans in this record. The route/composition boundary is withheld.",
        "claims": [
          "chyle-fat",
          "chyle-compose",
          "chyle-pn"
        ],
        "gate": {
          "interpret": "Apply the lymphatic transport distinction without assuming that unchanged protein means adequate protein.",
          "apply": "Attempt to select among fully specified adequate composition/route plans.",
          "closestChoice": "carbohydrate",
          "decidingObservation": "No actual response or verified patient-specific contraindication distinguishes the two nutritionally adequate conservative plans.",
          "counterfactual": "A documented inability to meet assessed needs with plan B might favor plan A, but that result has not been supplied or verified as a general ranking rule.",
          "counterfactualChoice": "mct",
          "deletionTest": "The transport fact alone permits a recognition shortcut; the adequacy statements no longer eliminate two options but expose uncertain ranking.",
          "cueAttack": "Removed lower/higher adjectives, favorable-history cells and underfed alternatives. Comparable plans leave no uniquely supported key.",
          "stageAudit": "All options select a whole nutrition plan at the same stage.",
          "predictedDifficulty": "hard",
          "difficultyReason": "A genuinely closer comparison was attempted; uncertain clinical ranking prevents fair scoring.",
          "sequenceAudit": "Standalone; does not teach the later refractory-route answer.",
          "limitation": "PARKED after one revision: a single older open-access review supports mechanisms and conservative options but not a unique ranking of these adequate plans. No new threshold or active key."
        }
      }
    ]
  },
  {
    "slug": "r2-refractory-chyle-route",
    "name": "Henry Patel",
    "age": 64,
    "sex": "Male",
    "complaint": "Drainage follow-up",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 64-year-old man, reviews his outside hospital chylous-ascites management in clinic. The team documented adherence to a long-chain-fat-restricted, MCT-containing plan that supplied assessed energy and protein.",
    "nodes": [
      {
        "slug": "refractory-chyle-route",
        "conceptId": "concept.nutrition-support-metabolism.chyle-nutrition-route-after-failed-diet.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Escalate nutrition route when monitored fat modification does not control consequential losses.",
        "task": "Which nutrition-route plan should the hospital team use next for {patientName}?",
        "update": "During the recorded trial, drainage rose rather than fell and replacement needs increased. The record does not define a validated output or duration threshold for failure; procedural reassessment is being arranged for all plans.",
        "choices": [
          {
            "id": "pn",
            "label": "Use PN with temporary enteral withdrawal",
            "rationale": "A PN strategy may be selected for persistent chyle loss, but these fictional observations are not a validated route-change threshold.",
            "temptation": "Recognize a worsening course despite a delivered conservative plan.",
            "correctUnder": "Requires clinician selection of the failure boundary and accompanying procedural plan.",
            "claims": [
              "chyle-pn",
              "chyle-compose"
            ]
          },
          {
            "id": "modify",
            "label": "Use a revised enteral composition plan",
            "rationale": "A further nutrition modification is not proven futile by the supplied record, although repeated loss warrants reassessment.",
            "temptation": "Continue a less invasive route while addressing composition.",
            "correctUnder": "A supported, feasible alternate enteral plan and a different response might justify this choice.",
            "claims": [
              "chyle-fat",
              "chyle-compose"
            ]
          },
          {
            "id": "continue",
            "label": "Use the current enteral plan during procedural reassessment",
            "rationale": "The same plan has not reduced drainage, but the evidence does not supply an exclusive nutrition route independent of procedural timing.",
            "temptation": "Preserve achieved adequacy while addressing the leak itself.",
            "correctUnder": "May be selected with a clinician-defined procedural strategy and monitoring.",
            "claims": [
              "chyle-compose",
              "chyle-pn"
            ]
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. The actual course replaces the earlier conclusion that conservative treatment had failed. It raises a route reassessment without proving that a particular output, trial length or replacement trend makes PN the sole next answer.",
        "claims": [
          "chyle-pn",
          "chyle-compose",
          "chyle-fat"
        ],
        "gate": {
          "interpret": "Recognize persistent worsening loss despite documented delivery rather than an untried prescription.",
          "apply": "Attempt to choose a nutrition route while procedural reassessment is shared.",
          "closestChoice": "continue",
          "decidingObservation": "The trajectory is concerning, but no verified route-transition rule maps it uniquely to the offered PN plan.",
          "counterfactual": "A falling output and stable replacement needs could support the current plan. The actual opposite trend warrants reassessment but does not itself validate PN superiority.",
          "counterfactualChoice": "continue",
          "deletionTest": "Chronology and magnitude now matter, but an unsupported failure cutoff would still be needed to force a single key.",
          "cueAttack": "Replaced two identical same-failed-plan distractors with a composition revision and a procedural-bridge plan; neither is asserted impossible.",
          "stageAudit": "Three nutrition-route strategies with the procedural review held common.",
          "predictedDifficulty": "hard",
          "difficultyReason": "The closer alternatives reveal a real evidence boundary rather than provide a fair difficult key.",
          "sequenceAudit": "Standalone unkeyed attempt; no preceding MCT explanation pre-ranks the options.",
          "limitation": "PARKED after one revision: no verified output/duration or procedural-context boundary chooses PN over the credible alternatives; fictional drainage values are not treatment thresholds."
        },
        "exhibit": {
          "kind": "table",
          "caption": "Original constructed teaching record; fictional patient observations",
          "columnHeaders": [
            "Recorded drainage/day",
            "Replacement requirement"
          ],
          "rowHeaders": [
            "First review",
            "Later review",
            "Latest review"
          ],
          "cells": [
            [
              "500 mL",
              "Unchanged"
            ],
            [
              "900 mL",
              "Increased"
            ],
            [
              "1300 mL",
              "Increased"
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "r2-ileus-support",
    "name": "Miles Evans",
    "age": 67,
    "sex": "Male",
    "complaint": "Postoperative recovery review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 67-year-old man, reviews an outside hospital record in clinic after prolonged postoperative intestinal dysfunction. Distension and vomiting prevented effective gastric and postpyloric delivery. A nutrition-support indication was established; the new question concerns implementation rather than reselecting a route.",
    "nodes": [
      {
        "slug": "ileus-support",
        "conceptId": "concept.nutrition-support-metabolism.ileus-support-initiation-plan.v2",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.d7175604050d6fa9"
        ],
        "conceptType": "management",
        "objective": "Attempt to choose an initial PN delivery strategy after interpreting prolonged undernutrition and currently corrected electrolytes.",
        "task": "Which initial PN delivery plan should the hospital team use for {patientName}?",
        "update": "The record documents prolonged minimal intake and loss of weight and function. Electrolyte replacement has brought the latest values into their reporting intervals. Thiamine and close electrolyte/clinical surveillance are arranged for every plan.",
        "choices": [
          {
            "id": "progress",
            "label": "Use a staged PN prescription with monitored advancement",
            "rationale": "A staged strategy is one possible policy, but exact progression depends on the guidance and approved local protocol.",
            "temptation": "Retain restart risk despite corrected baseline values.",
            "correctUnder": "Requires clinician-approved restart policy and patient severity assessment.",
            "claims": [
              "refeed-risk",
              "monitor",
              "pn-boundary"
            ]
          },
          {
            "id": "full",
            "label": "Use the assessed PN prescription with monitored adjustment",
            "rationale": "Modern guidance does not uniformly prescribe the same initial restriction in every at-risk patient. The record cannot uniquely rule this plan in or out.",
            "temptation": "Avoid sustained underfeeding while monitoring risk.",
            "correctUnder": "Requires an applicable protocol and individualized clinical assessment.",
            "claims": [
              "refeed-risk",
              "monitor",
              "pn-boundary"
            ]
          },
          {
            "id": "delay",
            "label": "Defer PN delivery for further biochemical observation",
            "rationale": "Waiting carries nutritional costs; the evidence does not make laboratory normalization alone either a clearance rule or a universal reason to delay.",
            "temptation": "Treat normal baseline values as an unresolved clearance process.",
            "correctUnder": "A separate active contraindication could warrant a temporary delay, but none is established here.",
            "claims": [
              "monitor",
              "refeed-risk",
              "pn-boundary"
            ]
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. Corrected baseline electrolytes do not erase restart risk. The verified sources and inherited owner hold do not support one exact initiation/advancement strategy from this record. This attempt gives no claim that PN restores motility and supplies no unsupported rate.",
        "claims": [
          "pn-boundary",
          "refeed-risk",
          "monitor"
        ],
        "gate": {
          "interpret": "Distinguish biochemical correction from resolution of risk after prolonged undernutrition.",
          "apply": "Attempt to select among complete PN implementation strategies rather than retrying routes already documented to have failed.",
          "closestChoice": "full",
          "decidingObservation": "The record supports monitoring, not a uniquely specified initial energy or advancement policy.",
          "counterfactual": "A completed tolerated restart with stable serial results would support the assessed ongoing prescription, but does not identify a universally correct initial plan here.",
          "counterfactualChoice": "full",
          "deletionTest": "The updated baseline data do not settle the conflicting advancement policies; inventing a rate would be necessary to force the key.",
          "cueAttack": "Fixed the possessive token grammar. Removed the two expressly failed-route distractors and the motility teaching that cued the later node.",
          "stageAudit": "All choices address initial PN delivery; exact policy ranking remains unresolved.",
          "predictedDifficulty": "hard",
          "difficultyReason": "A consequential two-step implementation decision was attempted but cannot be scored fairly without an approved policy.",
          "sequenceAudit": "Standalone parked attempt; no explanation precedes the separately parked response item.",
          "limitation": "PARKED after one revision: exact initiation/advancement policy is not uniquely supported, overlaps the inherited restart hold, and must not be supplied by invented feeding rates."
        },
        "previousConceptId": "concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible",
        "conceptVersionReason": "Attempted initiation/advancement decision differs from the original route-support meaning; parked and not admitted to any learning history."
      }
    ]
  },
  {
    "slug": "r2-pn-response-versus-function",
    "name": "Miles Evans",
    "age": 67,
    "sex": "Male",
    "complaint": "Postoperative recovery review",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 67-year-old man, reviews a later outside hospital nutrition assessment in clinic. He has been receiving PN after prolonged postoperative intestinal dysfunction. Strength has improved, while the team is assessing whether a new enteral trial can replace intravenous delivery.",
    "nodes": [
      {
        "slug": "pn-response-versus-function",
        "conceptId": "concept.n2.parenteral-response-versus-bowel-recovery",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.5d5b20c9ff9f8253"
        ],
        "conceptType": "management",
        "objective": "Do not treat nutritional improvement on PN as evidence enteral function has recovered.",
        "task": "Which ongoing nutrition plan should the hospital team choose for {patientName}?",
        "update": "An enteral order was written, but a complete administration and tolerance record is not available at this review. The record includes improved chair-rise performance during PN. There is no repeat absorption assessment or documented clinical course during PN reduction.",
        "choices": [
          {
            "id": "maintain",
            "label": "Maintain PN while assessing enteral delivery",
            "rationale": "The record does not establish an adequate alternative route, but a plan to assess missing data is an evidentially safer option rather than a comparable completed prescription.",
            "temptation": "Avoid equating recovery under one route with replacement-route success.",
            "correctUnder": "Appropriate while the alternative delivery and clinical response remain unestablished.",
            "claims": [
              "pn-not-motility",
              "pn-boundary",
              "pn-withdraw",
              "delivered"
            ]
          },
          {
            "id": "withdraw",
            "label": "Withdraw PN and use the enteral prescription",
            "rationale": "An order is not administration, and improved strength does not establish the ability to replace PN.",
            "temptation": "Transfer improvement in nutritional status to unmeasured enteral function.",
            "correctUnder": "Actual sustained enteral delivery with an appropriate clinical course during transition would support withdrawal.",
            "claims": [
              "pn-not-motility",
              "pn-withdraw",
              "delivered"
            ]
          },
          {
            "id": "increase",
            "label": "Increase PN while assessing enteral delivery",
            "rationale": "The record supplies no reassessed deficit that justifies escalation.",
            "temptation": "Treat incomplete route evidence as proof of greater total need.",
            "correctUnder": "A documented remaining deficit after complete delivery reconciliation could support a different PN amount.",
            "claims": [
              "delivered",
              "pn-boundary"
            ]
          }
        ],
        "key": "",
        "explanation": "Unkeyed revision attempt. Improved strength under PN is not evidence of enteral autonomy. Once the previously failed enteral-trial giveaway is removed, the assessment option wins from missing data, while the increase has no indication. Adding complete delivery data would duplicate the active reconciliation/withdrawal items instead of testing a distinct supported motility-response decision.",
        "claims": [
          "pn-not-motility",
          "pn-boundary",
          "pn-withdraw",
          "delivered"
        ],
        "gate": {
          "interpret": "Separate recovery under PN from the unmeasured performance of the alternate route.",
          "apply": "Attempt to choose an ongoing plan without assuming intestinal recovery.",
          "closestChoice": "withdraw",
          "decidingObservation": "Alternative-route administration and transition response are unknown; this makes the option that obtains information uniquely cautious.",
          "counterfactual": "Documented sustained enteral adequacy during monitored PN reduction could support withdrawal, but that repeats the separately revised withdrawal construct.",
          "counterfactualChoice": "withdraw",
          "deletionTest": "Improved strength remains removable once the absence of a delivery record is stated; the claimed second inference is not earned.",
          "cueAttack": "Fixed possessive grammar and removed the decisive failed-trial statement. The resulting obtain-more-data advantage remains, and increase still has no indication.",
          "stageAudit": "One option includes reassessment while another commits to withdrawal; comparability remains unresolved.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Cannot honestly retain this as fair moderate: missing-data caution and an unmotivated escalation still reveal the intended key.",
          "sequenceAudit": "Standalone attempt eliminates prior-feedback scaffolding, but cannot produce a distinct supported harder decision.",
          "limitation": "PARKED after one revision: the deletion and same-stage fairness gates still fail; a complete-delivery repair would duplicate the separately revised PN reconciliation/withdrawal questions."
        }
      }
    ]
  }
];
export const NUTRITION_TOPIC_CURRENT_ITEM_STATUS = [
  {
    "slug": "risk-assessment",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.risk-assessment.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.risk-assessment.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.perioperative-intake.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.risk-assessment.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: no supported observation makes these alternatives comparable without creating co-indications. No active key.",
    "response": {
      "clarity": "Removed the category-preselecting nutrition evaluation task.",
      "cues": "Shortened the assessment label and removed the key-only inventory of every finding.",
      "fairness": "A renal/hepatic work-up still lacks an indication; adding one would make parallel evaluations defensible. This issue remains unresolved.",
      "suggestions": "A raw clinical trajectory was attempted; the deletion and nearest-competitor gates still fail. Parked; PASS companion split unchanged."
    }
  },
  {
    "slug": "oral-escalation",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.oral-escalation.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.oral-escalation.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.perioperative-intake.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.oral-escalation.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-preserved-oral-escalation.v2",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "67b536856329857569a506e43d40ba6f5111335aca27ffd8b2e554a5ac12ffe3",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  },
  {
    "slug": "preop-nutrition-timing",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.severe-preoperative-risk.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.severe-preoperative-risk.v1",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "21e34c7f01a396db7a831a9d8140c1a31ab57f3cb389a632517fd52676b9177d",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  },
  {
    "slug": "supplement-delivered",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.supplement-delivered.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.supplement-delivered.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.delivery-reconciliation.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.supplement-delivered.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-supplement-delivered.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.supplement-delivered.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "The PN direction and daily amounts are explicit; the vague adjust instruction is removed.",
      "cues": "All options keep the tolerated jejunal contribution and differ only in the proposed PN prescription.",
      "fairness": "Actual total and remaining requirements are explained; prescribed intake has a credible concrete competitor.",
      "suggestions": "Implemented a delivery-based versus order-based prescription comparison and retained the no-universal-taper boundary."
    }
  },
  {
    "slug": "pn-withdrawal",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.pn-withdrawal.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.pn-withdrawal.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.delivery-reconciliation.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.pn-withdrawal.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-pn-withdrawal.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.pn-withdrawal.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Actual consumed amounts and serial weight/function replace the adequacy conclusion.",
      "cues": "The jejunal diversion is removed; all four choices compare existing components at the same transition stage.",
      "fairness": "The supplement contribution is necessary and the PN-free response supplies separate clinical evidence. A decision-changing counterfactual is fully re-solved.",
      "suggestions": "Retained as fair moderate application, with no claim that simple arithmetic itself establishes a hard item."
    }
  },
  {
    "slug": "baseline-attribution",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.baseline-attribution.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.baseline-attribution.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.restart-chronology.v1",
    "independentReviewVerdict": "FAIL",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.baseline-attribution.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: combined-carbohydrate reduction versus deferred advancement remains an inherited owner hold and guideline disagreement; no invented severity cutoff or active key.",
    "response": {
      "clarity": "Replaced the baseline chronological truism with a later nutrition-plan decision.",
      "cues": "Removed the corrected-baseline temporal contradiction and supplied three same-stage actions.",
      "fairness": "Exact ranking depends on a severity/advancement rule that is not approved and is not uniquely supported. Remains unkeyed.",
      "suggestions": "Attempted a consequential supported restart question; the inherited combined-carbohydrate hold prevents scored admission."
    }
  },
  {
    "slug": "restart-thiamine",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.restart-thiamine.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.restart-thiamine.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.restart-chronology.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.restart-thiamine.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-restart-thiamine.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.restart-thiamine.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Removed the temporal task language that selected before-feeding options.",
      "cues": "Retained the necessary failed oral delivery, balanced the options and kept electrolyte checks in shared care.",
      "fairness": "No dose or withholding of urgent care was introduced. The counterfactual acknowledges route flexibility instead of asserting IV superiority when oral delivery works.",
      "suggestions": "Fair moderate version; repeat independent review must assess the residual familiar precaution rather than assume hardness."
    }
  },
  {
    "slug": "renal-protein-reference",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.renal-ward-nutrition.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-preserved-renal-protein-reference.v2",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "64c99cde9b4b35527ec66d7ce65b80ed8c1e9873dbe41a7a20d6983a07b1b97b",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  },
  {
    "slug": "renal-energy-revision",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-energy-revision.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.renal-energy-revision.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.renal-ward-nutrition.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-energy-revision.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-renal-energy-revision.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-energy-revision.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Current assessed and administered values are shown rather than narrating the completed surplus comparison.",
      "cues": "Removed excess wording and unlimited escalation; every option is a concrete current prescription with balanced component frequency.",
      "fairness": "A substrate-change error and proportional nutrient reduction are credible alternatives; glucose care continues in all plans.",
      "suggestions": "Moderate clinical prescription reconciliation retained after repairing all editorial issues; no carbohydrate threshold introduced."
    }
  },
  {
    "slug": "aki-protein-restriction",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.aki-protein-restriction.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.aki-protein-restriction.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.renal-critical-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.aki-protein-restriction.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-aki-protein-restriction.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.aki-protein-restriction.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Replaced assessed plan with specific daily protein amounts and documented phase/KRT status.",
      "cues": "No option announces acute or stable status; the deficit conclusion is not supplied as a target-match phrase.",
      "fairness": "Freshly checked ESPEN recommendation 38; the initial non-KRT and critical-KRT boundaries are explicit, without a new urea trigger.",
      "suggestions": "Concrete same-stage prescriptions now compare restriction, initial treatment and premature higher-protein application."
    }
  },
  {
    "slug": "renal-calorie-sources",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-calorie-sources.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.renal-calorie-sources.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.renal-critical-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-calorie-sources.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-renal-calorie-sources.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-calorie-sources.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "The missing daily estimate and actual delivery are now shown in a compact record.",
      "cues": "Removed the deficit conclusion and the three-option convergence; the former actual order provides a credible fourth competitor.",
      "fairness": "Only net metabolized substrate energy is counted. Each choice is concrete and the new circuit contribution is independently required.",
      "suggestions": "No repetition of the preceding protein answer; both calculations are re-solved and the zero-net-energy counterfactual changes the best order."
    }
  },
  {
    "slug": "chyle-composition",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.chyle-composition.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.chyle-composition.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.chyle-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.chyle-composition.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: a single older open-access review supports mechanisms and conservative options but not a unique ranking of these adequate plans. No new threshold or active key.",
    "response": {
      "clarity": "Replaced vague lower/higher composition language with named whole plans and explicit assessed protein/energy adequacy.",
      "cues": "Removed underfeeding elimination and the favorable-history/MCT novelty match.",
      "fairness": "The nearest nutritionally adequate conservative alternative cannot be ranked uniquely from verified facts.",
      "suggestions": "Attempted real composition/route choices; parked instead of inventing a superiority claim."
    }
  },
  {
    "slug": "refractory-chyle-route",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.refractory-chyle-route.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.refractory-chyle-route.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.chyle-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.refractory-chyle-route.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: no verified output/duration or procedural-context boundary chooses PN over the credible alternatives; fictional drainage values are not treatment thresholds.",
    "response": {
      "clarity": "Added chronological raw drainage and replacement observations instead of declaring refractory failure.",
      "cues": "Removed the pair of plainly unchanged failed options.",
      "fairness": "Ranking PN against another enteral strategy or a procedural bridge remains uncertain in the single-source evidence.",
      "suggestions": "Attempted an actual failure boundary; parked because no supported exact boundary can be supplied."
    }
  },
  {
    "slug": "swallow-versus-gut",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.swallow-versus-gut.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.swallow-versus-gut.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.airway-feeding-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.swallow-versus-gut.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-swallow-versus-gut.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.swallow-versus-gut.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "The swallowing assessment now distinguishes liquids from puree and records actual oral consumption.",
      "cues": "Removed redundant stability information and replaced the already-successful route conclusion with administration data.",
      "fairness": "The oral competitor is a modified-consistency plan; the explanation no longer implies all oral textures are unsafe.",
      "suggestions": "Texture safety and delivery adequacy both change the discharge decision; the passed companion is protected in a separate case."
    }
  },
  {
    "slug": "gastric-aspiration-route",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.airway-feeding-record.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-preserved-gastric-aspiration-route.v2",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "44a37b2b3df81daef452b0598f4d22a1b0680adc6d214dc381ddbe20bc96f8ee",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  },
  {
    "slug": "ileus-support",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.ileus-support.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.ileus-support.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.ileus-support-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.ileus-support.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: exact initiation/advancement policy is not uniquely supported, overlaps the inherited restart hold, and must not be supplied by invented feeding rates.",
    "response": {
      "clarity": "Fixed the patient-token grammar and made the task a complete implementation decision.",
      "cues": "Replaced both explicitly failed enteral choices and removed the motility-recovery explanation.",
      "fairness": "The new closest alternative is clinically credible, but the evidence cannot rank the initial PN strategies uniquely.",
      "suggestions": "Attempted an unresolved later implementation decision; parked rather than force a disputed protocol."
    }
  },
  {
    "slug": "pn-response-versus-function",
    "status": "parked",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.pn-response-versus-function.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.pn-response-versus-function.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.ileus-support-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": null,
    "activeCaseId": null,
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.pn-response-versus-function.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": "PARKED after one revision: the deletion and same-stage fairness gates still fail; a complete-delivery repair would duplicate the separately revised PN reconciliation/withdrawal questions.",
    "response": {
      "clarity": "Fixed the patient-token grammar and made the later review standalone.",
      "cues": "Removed the explicit new failed trial and unchanged-needs labels that preselected continuation.",
      "fairness": "The replacement creates a uniquely cautious assessment option and leaves escalation unmotivated; these issues are unresolved.",
      "suggestions": "Attempted a separate response decision. Parked because stronger facts either duplicate other revised constructs or require an unsupported absorption endpoint."
    }
  },
  {
    "slug": "vitc-directed-support",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.vitc-directed-support.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.vitc-directed-support.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.micronutrient-wound.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.vitc-directed-support.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-vitc-directed-support.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.vitc-directed-support.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Protein is removed from the micronutrient set; all choices are vitamin replacement plans.",
      "cues": "Removed the protein-adequacy exclusion and balanced nutrient/route combinations. The normal prothrombin result remains decision-critical to the bleeding mechanism.",
      "fairness": "Added a directly verified labeled parenteral indication and actual oral-treatment failure rather than another classic sign.",
      "suggestions": "The treatment-delivery constraint changes management after recognition; the concept is explicitly versioned for the new scored meaning."
    }
  },
  {
    "slug": "zinc-copper-assessment",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.zinc-copper-assessment.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.zinc-copper-assessment.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.trace-element-record.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.zinc-copper-assessment.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-zinc-copper-assessment.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.zinc-copper-assessment.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "The new result pattern and renal context are explicit.",
      "cues": "The already-completed repeat test is replaced by a genuinely new, clinically motivated B12 etiologic test with the same lab wait scope.",
      "fairness": "Preserves uncertainty in MMA, copper and ceruloplasmin and does not exclude coexisting disease; marrow assessment remains a credible alternative.",
      "suggestions": "Adds interpretation of a confounded result before the consequential investigation choice, rather than claiming obscurity supplies a second step."
    }
  },
  {
    "slug": "durable-enteral-access",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.home-access.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.home-access.v1",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "41792b65fa0a79c12188ecb281490f4c8c36cbf35dc9886df3793027c7a12138",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  },
  {
    "slug": "enteral-medication-review",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.enteral-medication-review.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.enteral-medication-review.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.enteral-diarrhea.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.enteral-medication-review.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-enteral-medication-review.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.enteral-medication-review.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "The task is neutral management rather than preparation matching.",
      "cues": "Removed sorbitol wording and made both feed and medicine formulations change initially; the later sequence now earns interpretation.",
      "fairness": "Needed medication doses and hydration/safety review remain shared. The key changes formulation rather than inappropriately stopping required therapy.",
      "suggestions": "A compact actual sequence replaces the unchanged-factor shortcut; alternatives are concrete administration changes."
    }
  },
  {
    "slug": "postoperative-route-after-swallow",
    "status": "revised",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.postoperative-feeding-repaired.v1",
    "independentReviewVerdict": "REVISE",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v2",
    "activeCaseId": "case.topic.nutrition-support-metabolism.r2-postoperative-route-after-swallow.v2",
    "attemptedQuestionVariantId": "question.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v2",
    "attemptCount": 1,
    "independentStatus": "not_reviewed",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": null,
    "parkingReason": null,
    "response": {
      "clarity": "Added the safe puree finding and the actual fortified-texture delivery, closing the liquid-only ambiguity.",
      "cues": "The vignette does not simply label the patient eligible for a tube; it presents the observations and consumed amount.",
      "fairness": "The broad oral option now has a documented inadequate trial, while a safe texture remains acknowledged.",
      "suggestions": "Preserved the absence-of-flatus misconception and current abdominal observations without creating a universal waiting rule."
    }
  },
  {
    "slug": "renal-formula-reference-budget",
    "status": "pass-preserved",
    "reviewedQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "reviewedNodeId": "node.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "reviewedCaseId": "case.topic.nutrition-support-metabolism.renal-formula-repaired.v1",
    "independentReviewVerdict": "PASS",
    "activeQuestionVariantId": "question.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "activeCaseId": "case.topic.nutrition-support-metabolism.renal-formula-repaired.v1",
    "attemptedQuestionVariantId": null,
    "attemptCount": 0,
    "independentStatus": "PASS_EXACT_VERSION",
    "clinicalReviewStatus": "needs_clinician_review",
    "passQuestionSha256": "4b41f1e2374b459d1800c98875d297a68e9f7d906cdf1511e747512c5253bbe7",
    "parkingReason": null,
    "response": {
      "clarity": "Preserved exactly; no optional reviewer suggestion applied.",
      "cues": "No wording changed.",
      "fairness": "Existing exact PASS retained; clinical approval and inherited holds remain separate.",
      "suggestions": "No rewrite authorized for PASS."
    }
  }
];

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export const NUTRITION_TOPIC_ROUND2_IDS = {
  case: (s: string) => 'case.' + prefix + '.' + s + '.v2',
  node: (s: string) => 'node.' + prefix + '.' + s + '.v2',
  question: (s: string) => 'question.' + prefix + '.' + s + '.v2',
  choice: (s: string, c: string) => 'choice.' + prefix + '.' + s + '.' + c + '.v2',
};
const itemFor = (slug: string) => NUTRITION_TOPIC_CURRENT_ITEM_STATUS.find(i => i.slug === slug)!;
export const NUTRITION_TOPIC_PARKED_ATTEMPTS = NUTRITION_TOPIC_ROUND2_ATTEMPTS.filter(c => !c.nodes[0]!.key);
const revisedDefinitions = NUTRITION_TOPIC_ROUND2_ATTEMPTS.filter(c => !!c.nodes[0]!.key);
export const NUTRITION_TOPIC_ACTIVE_DEFINITIONS: DraftCase[] = NUTRITION_TOPIC_CURRENT_ITEM_STATUS.filter(i => i.status !== 'parked').map(i => {
  if (i.status === 'revised') return revisedDefinitions.find(c => c.nodes[0]!.slug === i.slug)!;
  const original = NUTRITION_TOPIC_V1_ACTIVE_DEFINITIONS.find(c => c.nodes.some(n => n.slug === i.slug))!;
  return { ...copy(original), nodes: [copy(original.nodes.find(n => n.slug === i.slug)!)] };
});
const currentNodes = NUTRITION_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes);
const revisedQuestions: QuestionVariant[] = revisedDefinitions.flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_ROUND2_DRAFT, id: NUTRITION_TOPIC_ROUND2_IDS.question(n.slug), conceptId: n.conceptId, stem: textFor(c, n.task),
  answerChoices: n.choices.map(x => ({ id: NUTRITION_TOPIC_ROUND2_IDS.choice(n.slug, x.id), label: x.label, isCorrect: x.id === n.key, rationale: x.rationale, distractorRationale: x.id === n.key ? null : x.rationale })),
  explanation: n.explanation, supportingEvidenceClaimIds: n.claims.map(claim), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
})));
export const NUTRITION_TOPIC_QUESTIONS: QuestionVariant[] = NUTRITION_TOPIC_CURRENT_ITEM_STATUS.filter(i => i.activeQuestionVariantId).map(i =>
  i.status === 'pass-preserved' ? NUTRITION_TOPIC_V1_QUESTIONS.find(q => q.id === i.activeQuestionVariantId)! : revisedQuestions.find(q => q.id === i.activeQuestionVariantId)!);
const terminalFor = (q: QuestionVariant, labels: string[]) => q.answerChoices.filter(x => !x.isCorrect).map(x => ({
  answerChoiceId: x.id, kind: 'no_terminal_outcome' as const,
  consequenceNarrative: 'Review the recorded decision; no patient outcome is simulated.', clinicalRationale: x.rationale!, sourceLabels: labels,
}));
const revisedCases: SyntheticClinicalCase[] = revisedDefinitions.map(c => {
  const d = { ageYears: c.age, sexLabel: c.sex };
  const labels = ['Original constructed teaching record', 'Unapproved topic sidecar; Melissa Rowland is clinical sign-off'];
  return {
    id: NUTRITION_TOPIC_ROUND2_IDS.case(c.slug), displayName: c.complaint, patientDisplayName: c.name,
    patientPresentationVariantId: 'presentation.' + prefix + '.' + c.slug + '.v2', prototypeDemographics: d, chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: 'profile.' + prefix + '.' + c.slug + '.v2', prototypeDemographics: d, chiefComplaint: c.complaint, presentation: c.presentation }],
    releasePointId: 'release.l0.clinic_evaluation', tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: 2, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels: labels,
    decisionNodes: c.nodes.map(n => {
      const q = revisedQuestions.find(q => q.id === NUTRITION_TOPIC_ROUND2_IDS.question(n.slug))!;
      return { id: NUTRITION_TOPIC_ROUND2_IDS.node(n.slug), questionVariantId: q.id, primaryConceptId: n.conceptId, stem: q.stem,
        ...(n.update ? { currentUpdate: textFor(c, n.update) } : {}), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
        answerChoices: q.answerChoices.map(x => ({ id: x.id, label: x.label, isCorrect: x.isCorrect, rationale: x.rationale!, serviceRequest: null })),
        shuffleAnswers: true, explanation: q.explanation, sourceLabels: labels, resultGateAfter: null, terminalDispositions: terminalFor(q, labels),
      };
    }), learningSummary: c.nodes.map(n => n.explanation).join(' '),
  };
});
export const NUTRITION_TOPIC_CASES: SyntheticClinicalCase[] = NUTRITION_TOPIC_CURRENT_ITEM_STATUS.filter(i => i.activeCaseId).map(i => {
  if (i.status === 'revised') return revisedCases.find(c => c.id === i.activeCaseId)!;
  const original = NUTRITION_TOPIC_V1_CASES.find(c => c.id === i.reviewedCaseId)!;
  if (original.decisionNodes.length === 1) return copy(original);
  const preserved = copy(original.decisionNodes.find(n => n.questionVariantId === i.reviewedQuestionVariantId)!);
  // Composition-only metadata: terminalize the formerly first PASS node; no visible text changes.
  if (!preserved.terminalDispositions.length) preserved.terminalDispositions = terminalFor(NUTRITION_TOPIC_QUESTIONS.find(q => q.id === i.activeQuestionVariantId)!, original.sourceLabels);
  return { ...copy(original), id: i.activeCaseId!, decisionNodes: [preserved], learningSummary: preserved.explanation };
});
export const NUTRITION_TOPIC_CONCEPTS: TestedConcept[] = currentNodes.map(n => ({ id: n.conceptId, displayName: n.slug.replaceAll('-', ' '), learningObjective: n.objective, earliestFacilityStage: 2, conceptType: n.conceptType }));
export const NUTRITION_TOPIC_CONCEPT_PROPOSALS = currentNodes.map(n => itemFor(n.slug).status === 'pass-preserved'
  ? copy(NUTRITION_TOPIC_V1_CONCEPT_PROPOSALS.find(p => p.conceptId === n.conceptId)!)
  : ({ ...NUTRITION_TOPIC_ROUND2_DRAFT, conceptId: n.conceptId, previousConceptId: n.previousConceptId ?? null,
    relation: n.previousConceptId ? 'new_version' : n.creationKind === 'Rewrite' || n.identityRelation === 'reuse_existing_meaning' ? 'reuse_existing_meaning' : 'new_meaning',
    reason: n.conceptVersionReason ?? 'Wording, raw findings and competitors changed; the scored clinical meaning is retained from the v1 draft. Existing concept history is preserved.',
    educationalTier: 1, acuity: 'stable', earliestFacilityStage: 2, requiredCapabilityIds: [], evidenceClaimIds: n.claims.map(claim),
  }));
export const NUTRITION_TOPIC_CASE_REVIEWS = NUTRITION_TOPIC_CASES.map(c => ({
  ...NUTRITION_TOPIC_ROUND2_DRAFT, caseId: c.id, educationalTier: 1, acuity: 'stable',
  historicalAcuity: NUTRITION_TOPIC_ACTIVE_DEFINITIONS.find(d => d.nodes.some(n => c.decisionNodes.some(v => v.primaryConceptId === n.conceptId)))!.historicalAcuity,
  earliestFacilityStage: 2, requiredCapabilityIds: [], encounterMode: c.presentation.includes('hospital') || c.presentation.includes('outside') ? 'outside_record_review_in_clinic' : 'outpatient_clinic',
  finiteProfiles: 1, profileApproval: 'needs_clinician_review; approvedInstantiationProfiles is a legacy structural field, not clinical approval',
}));
const attemptCheck = (c: DraftCase, n: DraftNode) => ({
  ...NUTRITION_TOPIC_ROUND2_DRAFT, checkedOn: '2026-11-11', rubric: 'question-authoring.2026-11-08.v15',
  questionVariantId: NUTRITION_TOPIC_ROUND2_IDS.question(n.slug), caseId: NUTRITION_TOPIC_ROUND2_IDS.case(c.slug), nodeId: NUTRITION_TOPIC_ROUND2_IDS.node(n.slug),
  authorVerdict: n.key ? 'REVISED_FOR_INDEPENDENT_REVIEW' : 'PARKED_UNRESOLVED_FAIRNESS_OR_EVIDENCE', independent: false, clinicalApproval: false, finiteProfileCount: 1,
  ...n.gate, optionAudit: n.choices.map(x => ({ choiceId: NUTRITION_TOPIC_ROUND2_IDS.choice(n.slug, x.id), isKey: !!n.key && x.id === n.key,
    temptation: x.temptation, whyRankedHere: x.rationale, correctUnder: x.correctUnder, evidenceClaimIds: x.claims.map(claim) })),
});
export const NUTRITION_TOPIC_AUTHOR_CHECKS = NUTRITION_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => itemFor(n.slug).status === 'pass-preserved'
  ? { ...copy(NUTRITION_TOPIC_V1_AUTHOR_CHECKS.find(g => g.questionVariantId === itemFor(n.slug).activeQuestionVariantId)!), caseId: itemFor(n.slug).activeCaseId! }
  : attemptCheck(c, n)));
export const NUTRITION_TOPIC_PARKED_AUTHOR_CHECKS = NUTRITION_TOPIC_PARKED_ATTEMPTS.flatMap(c => c.nodes.map(n => attemptCheck(c, n)));
export const NUTRITION_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = NUTRITION_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => {
  const i = itemFor(n.slug);
  if (i.status === 'pass-preserved') return { ...copy(NUTRITION_TOPIC_V1_TIMING_ENTRIES.find(t => t.questionVariantId === i.activeQuestionVariantId)!), caseId: i.activeCaseId! };
  return { caseId: i.activeCaseId!, nodeId: NUTRITION_TOPIC_ROUND2_IDS.node(n.slug), questionVariantId: i.activeQuestionVariantId!,
    classification: n.choices.some(x => x.timingProfileId) ? { kind: 'test_choices' as const, choices: n.choices.map(x => ({ choiceId: NUTRITION_TOPIC_ROUND2_IDS.choice(n.slug, x.id), choiceLabel: x.label,
      timing: x.timingProfileId ? { kind: 'test' as const, timingProfileId: x.timingProfileId } : { kind: 'no_test' as const },
    })) } : { kind: 'no_test' as const },
  };
}));
export const NUTRITION_TOPIC_ORDER_PROPOSALS = NUTRITION_TOPIC_TIMING_ENTRIES.flatMap(e => e.classification.kind === 'test_choices'
  ? e.classification.choices.flatMap(c => c.timing.kind === 'test' ? [{ ...NUTRITION_TOPIC_ROUND2_DRAFT, caseId: e.caseId, nodeId: e.nodeId, questionVariantId: e.questionVariantId, choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    disposition: { kind: 'not_executed', reason: 'future_planned' }, serviceRequest: null, resultGateAfter: null }] : []) : []);
const mapStatements = (c: DraftCase, n: DraftNode) => ({
  ...NUTRITION_TOPIC_ROUND2_DRAFT, questionVariantId: NUTRITION_TOPIC_ROUND2_IDS.question(n.slug), caseId: NUTRITION_TOPIC_ROUND2_IDS.case(c.slug),
  constructedObservations: 'Names, demographics, chronology, delivered amounts, weights, examinations and laboratory-relative values are fictional patient observations; they are not empirical rates or invented treatment thresholds.',
  fieldMappings: [{ field: 'presentation/currentUpdate/exhibit interpretation', claimIds: n.claims.map(claim) }, { field: 'task', claimIds: n.claims.map(claim) }, { field: 'explanation', claimIds: n.claims.map(claim) },
    ...n.choices.map(x => ({ field: 'answerChoices.' + NUTRITION_TOPIC_ROUND2_IDS.choice(n.slug, x.id) + '.label/rationale/counterfactual', claimIds: x.claims.map(claim) }))],
});
export const NUTRITION_TOPIC_STATEMENT_MAPPINGS = NUTRITION_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => itemFor(n.slug).status === 'pass-preserved'
  ? { ...copy(NUTRITION_TOPIC_V1_STATEMENT_MAPPINGS.find(s => s.questionVariantId === itemFor(n.slug).activeQuestionVariantId)!), caseId: itemFor(n.slug).activeCaseId! }
  : mapStatements(c, n)));
export const NUTRITION_TOPIC_PARKED_STATEMENT_MAPPINGS = NUTRITION_TOPIC_PARKED_ATTEMPTS.flatMap(c => c.nodes.map(n => mapStatements(c, n)));
export const NUTRITION_TOPIC_AUTHOR_REPAIR_HISTORY = NUTRITION_TOPIC_V1_AUTHOR_REPAIR_HISTORY;
export const NUTRITION_TOPIC_UNKEYED_HOLDS = NUTRITION_TOPIC_PARKED_ATTEMPTS.flatMap(c => c.nodes.map(n => ({
  ...NUTRITION_TOPIC_ROUND2_DRAFT, id: 'hold.' + prefix + '.' + n.slug + '.v2', proposedConceptId: n.conceptId,
  activeQuestionVariantId: null, activeKeyChoiceId: null, attemptedQuestionVariantId: NUTRITION_TOPIC_ROUND2_IDS.question(n.slug),
  reason: n.gate.limitation, owner: n.slug === 'baseline-attribution' || n.slug === 'ileus-support' ? 'Melissa Rowland: inherited restart policy hold' : 'manager: evidence and authoring repair', originalAttemptRetained: true,
  nextAction: 'Resolve the exact evidence/fairness boundary, then obtain independent review of a new version before any scored admission.',
})));
export const NUTRITION_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: 'clinical.synthetic.prototype.v1', schemaVersion: 1, publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Synthetic original nutrition teaching drafts; not clinically approved. Melissa Rowland is clinical sign-off. Not medical advice.',
  concepts: NUTRITION_TOPIC_CONCEPTS, cases: NUTRITION_TOPIC_CASES,
});
export const NUTRITION_TOPIC_MANIFEST = {
  ...NUTRITION_TOPIC_ROUND2_DRAFT, topicSlug: NUTRITION_TOPIC_SLUG, caseCount: NUTRITION_TOPIC_CASES.length, variantCount: NUTRITION_TOPIC_QUESTIONS.length,
  passPreservedCount: 6, revisedCount: revisedDefinitions.length, parkedUnkeyedAttemptCount: NUTRITION_TOPIC_UNKEYED_HOLDS.length,
  reusedConceptCount: currentNodes.filter(n => (n.creationKind === 'Rewrite' || n.identityRelation === 'reuse_existing_meaning') && !n.previousConceptId).length,
  changedMeaningCount: currentNodes.filter(n => n.previousConceptId).length,
  additiveNewMeaningCount: currentNodes.filter(n => n.creationKind === 'new' && !n.identityRelation && !n.previousConceptId).length,
  newVariantCount: currentNodes.filter(n => n.creationKind === 'new').length,
  reviewDisplay: 'key shown first for review only.', managerAccepted: false, independentPass: false, clinicalApproval: false, publicReleaseAuthorized: false,
  executableOrdersAdded: false, educationalTier: 1, acuity: 'stable', earliestFacilityStage: 2, requiredCapabilityIds: [],
  integrationDependencies: [
    'Explicit-import draft only; no ship manifest or shared registry edited.',
    'Six exact independent PASS payloads retained; three former multipart PASS nodes split into standalone cases with the same visible wording, demographics and profiles.',
    'All eleven revised exact versions require a new independent review and named clinical approval. Author checks do not confer either.',
    'No multipart case has mixed review status: all current cases are standalone. Future composition requires every exact scored node to pass independent review.',
    'Six returned attempts are unkeyed and absent from scored supply; their original meanings and exact versions remain archived.',
    'All inherited owner holds remain in the packet; source holds are not cleared by a PASS or a rewrite.',
    'Only local timing/order proposals are supplied; no gameplay network requests or executable orders added.',
  ],
};
