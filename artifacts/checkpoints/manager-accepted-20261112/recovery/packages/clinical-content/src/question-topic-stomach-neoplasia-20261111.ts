import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema, caseExhibitSchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, testedConceptSchema, validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry, type CaseExhibit, type DecisionNode,
  type SyntheticClinicalCase, type TestedConcept,
} from "./schema";
import ledger from "../../../docs/research/sources-question-topic-stomach-neoplasia-20261111.json";

/** Explicit-import authoring sidecar. Manager acceptance is a separate operation. */
export const STOMACH_NEOPLASIA_VERSION = "question-topic.stomach-neoplasia.2026-11-11.v1";
export const STOMACH_NEOPLASIA_REVIEW = {
  contentVersion: STOMACH_NEOPLASIA_VERSION, reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true, lastClinicianReview: null,
};
const claimId = (slug: string) => `claim.question-topic.stomach-neoplasia.${slug}`;
const questionId = (slug: string) => `question.topic.stomach-neoplasia.${slug}.v1`;
const nodeId = (slug: string) => `node.topic.stomach-neoplasia.${slug}.v1`;
const caseId = (slug: string) => `case.topic.stomach-neoplasia.${slug}.v1`;
const conceptId = (slug: string) => `concept.topic.stomach-neoplasia.${slug}.v1`;

interface ChoiceSpec {
  id: string; label: string; isCorrect: boolean; rationale: string;
  temptation: string; counterfactual: string; evidenceClaimIds: string[];
  timingProfileId: string | null;
}
export interface StomachNeoplasiaAuthorGate {
  coverTheKey: string; sameDecisionStageAndCategory: string;
  reasoningSteps: [string, string]; closestError: string; decidingObservation: string;
  consequence: string; residentDifficulty: string; singleDefensibleBestAnswer: string;
  counterfactual: string; deletionTest: string[]; sequenceReview: string; repairAndRecheck: string;
}
interface NodeSpec {
  slug: string; caseSlug: string; conceptId: string; previousConceptId: string | null;
  creationKind: "Rewrite" | "new"; before: string[] | null;
  objective: string; conceptType: TestedConcept["conceptType"];
  currentUpdate: string; task: string; exhibit: CaseExhibit;
  choices: ChoiceSpec[]; explanation: string; supportingEvidenceClaimIds: string[];
  manualAuthorGate: StomachNeoplasiaAuthorGate;
}
interface CaseSpec {
  slug: string; patientDisplayName: string; age: number; sex: "Female" | "Male";
  complaint: string; presentation: string; nodes: string[];
}
const exhibit = (rows: [string, string][]): CaseExhibit => caseExhibitSchema.parse({
  kind: "keyValue", caption: "Original constructed teaching record; fictional patient observations",
  items: rows.map(([label, value]) => ({ label, value })),
});
const choice = (id: string, label: string, isCorrect: boolean, rationale: string,
  temptation: string, counterfactual: string, claims: string[], timingProfileId: string | null = null): ChoiceSpec =>
  ({ id, label, isCorrect, rationale, temptation, counterfactual, evidenceClaimIds: claims.map(claimId), timingProfileId });

export const STOMACH_NEOPLASIA_SPECS: NodeSpec[] = [
  {
    slug: "occult-peritoneal-staging", caseSlug: "diffuse-gastric-cancer",
    conceptId: conceptId("occult-peritoneal-staging"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "workup",
    objective: "Select additional staging for an advanced diffuse gastric cancer despite CT without distant lesions.",
    currentUpdate: "The outside team is planning treatment before gastrectomy.",
    task: "Which additional staging procedure should be arranged for {patientName} before the proposed gastric-cancer treatment sequence?",
    exhibit: exhibit([
      ["Endoscopy and biopsy", "Most of the gastric body is rigid and poorly distensible. Multiple biopsies contain poorly cohesive adenocarcinoma."],
      ["Contrast CT chest, abdomen and pelvis", "Diffuse gastric-wall thickening reaches the surrounding fat. Several regional nodes are enlarged. No ascites, peritoneal nodule or distant organ lesion is identified."],
    ]),
    choices: [
      choice("laparoscopy", "Staging laparoscopy with peritoneal washings", true,
        "The diffuse advanced pattern raises concern for disease that CT may not show on the peritoneal surface. Laparoscopic inspection and washings can alter the intended treatment sequence.",
        "Look beyond an unrevealing distant-organ CT survey.",
        "A superficial small lesion with an unresolved wall-depth question would instead prioritize local depth assessment.", ["laparoscopy"], "timing.test.general_diagnostic"),
      choice("eus", "Endoscopic ultrasound with regional-node sampling", false,
        "Regional depth and node information would not settle the consequential possibility of occult peritoneal spread in this advanced diffuse presentation.",
        "Treat more precise local staging as completion of the metastatic assessment.",
        "EUS can be appropriate when uncertain local depth would determine endoscopic versus surgical treatment.", ["laparoscopy"], "timing.test.advanced_diagnostic"),
      choice("pet", "Whole-body FDG PET/CT for distant staging", false,
        "A metabolic survey does not replace direct peritoneal assessment and cytology in this selected high-risk pattern.",
        "Use another negative noninvasive survey to clear the proposed pathway.",
        "PET/CT is a useful initial staging tool for the gastric large-B-cell lymphoma tested separately in this packet.", ["laparoscopy", "pet-staging"], "timing.test.pet_ct"),
    ],
    explanation: "Diffuse advanced gastric involvement changes what a negative CT can establish. Laparoscopic peritoneal staging can uncover a treatment-changing distribution before the planned sequence; this is not a rule for every early gastric lesion.",
    supportingEvidenceClaimIds: ["laparoscopy", "pet-staging"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No complaint or task says peritoneal disease, washings or occult metastasis. All three options are staging procedures with comparable labels and wait proposals. The necessary negative CT cannot be deleted merely because it makes the inference possible.",
      sameDecisionStageAndCategory: "Three additional staging procedures before initial treatment, not a test against a premature operation.",
      reasoningSteps: ["Interpret the poorly distensible, diffuse poorly cohesive cancer and extension beyond the wall as an advanced pattern with peritoneal-spread concern.", "Recognize that an unrevealing CT does not settle that distribution and choose direct staging with washings."],
      closestError: "Request PET/CT to clear distant staging after an unrevealing CT.", decidingObservation: "Diffuse rigid gastric-body involvement with extension into surrounding fat despite no CT-visible peritoneal deposits.",
      consequence: "An unrecognized peritoneal distribution can put the patient into the wrong surgical sequence.",
      residentDifficulty: "Moderate to hard PGY-2/3 prediction from local staging versus occult distribution; not measured.",
      singleDefensibleBestAnswer: "Laparoscopy and washings answer the remaining distribution question among the offered procedures in this selected presentation.",
      counterfactual: "Replace diffuse advanced involvement with a small superficial lesion whose invasion depth is uncertain: EUS becomes a reasonable next staging procedure.",
      deletionTest: ["The CT negative establishes the actual staging limitation.", "The diffuse endoscopic pattern and poorly cohesive biopsy establish why additional peritoneal assessment is consequential.", "The clinic frame supplies patient identity and avoids an inpatient setting requirement."],
      sequenceReview: "First node; no lavage result or later treatment feedback is visible. Feedback does not announce what positive cytology requires.",
      repairAndRecheck: "Removed a task that named occult peritoneal disease and removed a statement that laparoscopy was available. Re-solved three staging competitors using the actual pattern and the negative CT. Current direct guideline support is one weak recommendation, explicitly limited in the ledger.",
    },
  },
  {
    slug: "preinitial-positive-washings", caseSlug: "diffuse-gastric-cancer",
    conceptId: conceptId("preinitial-positive-washings"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Apply positive peritoneal cytology obtained before initial treatment to the gastric-cancer treatment sequence.",
    currentUpdate: "At a later clinic visit, the outside staging-laparoscopy report has arrived. No cancer treatment has begun.",
    task: "Which treatment sequence should the clinic recommend discussing for {patientName}'s newly returned gastric-cancer staging findings?",
    exhibit: exhibit([
      ["Laparoscopic findings", "No visible peritoneal deposit was seen. Washings were collected before manipulation of the primary tumor."],
      ["Cytology", "Malignant epithelial cells with features concordant with the gastric primary are present."],
      ["Current clinical course", "She continues oral intake and has no ongoing bleeding or obstruction."],
    ]),
    choices: [
      choice("systemic", "Systemic treatment, then reassess resection candidacy", true,
        "The positive washings establish clinically important spread despite an unrevealing visual survey. With this finding obtained before initial treatment, systemic treatment precedes reconsideration of surgery; subsequent clearance can change candidacy.",
        "Use cytology and its acquisition phase rather than the absence of visible nodules.",
        "If washings and the rest of staging were negative, the ordinary curative-intent multimodality sequence would remain available.", ["preinitial-cytology"]),
      choice("surgery", "Upfront gastrectomy, then postoperative chemotherapy", false,
        "This treats a pre-initial-treatment cytology result as if it were a finding discovered during an already undertaken gastrectomy. The chronology matters.",
        "Equate no visible deposit with a purely localized cancer.",
        "The current Japanese guideline has a different weak recommendation when CY1 is first identified during gastrectomy; that is not this record.", ["preinitial-cytology"]),
      choice("radiation", "Gastric chemoradiation, then reassess resection candidacy", false,
        "A stomach-focused treatment strategy does not address the demonstrated peritoneal distribution in the way a systemic-first plan does.",
        "Treat this as a problem of local tumor control rather than disease distribution.",
        "A nonmetastatic local-control problem can prompt a specialist chemoradiation discussion; it does not reverse positive pre-treatment washings.", ["preinitial-cytology", "adjuvant-rt"]),
    ],
    explanation: "Positive washings and a negative visual survey are not equivalent staging results. Because cytology was obtained before initial treatment, discuss systemic therapy followed by reassessment rather than immediate gastrectomy. This does not assert that surgery can never become appropriate.",
    supportingEvidenceClaimIds: ["preinitial-cytology", "adjuvant-rt"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The update supplies acquisition chronology without telling the learner its significance. All options specify a treatment sequence; none uniquely says multidisciplinary or individualized care.",
      sameDecisionStageAndCategory: "Three initial treatment sequences after completed staging.",
      reasoningSteps: ["Recognize that concordant malignant peritoneal cytology changes disease distribution despite no visible implant.", "Apply the pre-initial-treatment chronology to systemic-first care and later resection reassessment."],
      closestError: "Proceed to gastrectomy because the laparoscopy showed no nodule.", decidingObservation: "Positive washings obtained before any initial treatment, not a result first discovered during gastrectomy.",
      consequence: "Ignoring microscopic spread can lead to an inappropriate immediate surgical sequence.",
      residentDifficulty: "Hard PGY-2/3 prediction because visual/cytologic disagreement and chronology must both be interpreted.",
      singleDefensibleBestAnswer: "Systemic-first reassessment fits the directly verified current guideline for pre-initial-treatment CY1.",
      counterfactual: "Changing the discovery phase to an already undertaken gastrectomy changes the cited Japanese recommendation; changing washings to negative removes this reason to defer resection.",
      deletionTest: ["Removing the cytology eliminates the management change.", "Removing before-treatment chronology makes regional recommendations harder to distinguish fairly.", "Intake and bleeding/obstruction observations separate oncologic sequencing from urgent palliation."],
      sequenceReview: "Earlier feedback recommends staging but gives no positive-washing treatment rule. No future response is disclosed.",
      repairAndRecheck: "Rejected a never-operate key. Added the exact acquisition phase and retained reassessment, then re-solved the competing sequences against current JGCA CQ5-4. Single-source/regional limitation is explicit.",
    },
  },
  {
    slug: "endoscopic-lymphatic-risk", caseSlug: "endoscopic-resection",
    conceptId: conceptId("endoscopic-lymphatic-risk"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Choose completion gastric surgery when a clear-margin endoscopic specimen contains lymphatic tumor involvement.",
    currentUpdate: "", task: "Which management plan should be discussed for {patientName} after review of the gastric endoscopic-resection specimen?",
    exhibit: exhibit([
      ["Endoscopic specimen", "An 18-mm differentiated tubular adenocarcinoma was removed en bloc. It is confined to the mucosa, with no ulceration; lateral and deep margins are clear."],
      ["Additional sections", "Separate clusters of epithelial tumor cells lie inside endothelial-lined lymphatic spaces beneath the lesion."],
      ["Staging and health", "CT shows no enlarged regional node or distant lesion. She is independently active and has no major cardiopulmonary disease."],
    ]),
    choices: [
      choice("gastrectomy", "Gastrectomy with lymphadenectomy", true,
        "The lymphatic tumor finding changes endoscopic curability. A clear scar and normal-size nodes do not eliminate the concern outside the endoscopically removed mucosal field.",
        "Distinguish removal of the visible lesion from clearance of its nodal-risk pathway.",
        "If lymphatic and vascular invasion were absent and the other stated favorable criteria remained, endoscopic follow-up could be appropriate.", ["esd-lymphatic", "esd-completion"]),
      choice("repeat-esd", "Repeat endoscopic submucosal dissection", false,
        "More scar resection does not address lymphatic involvement when the existing mucosal resection margins are already clear.",
        "Treat every noncurative endoscopic result as a local-margin problem.",
        "An isolated favorable horizontal-margin problem can permit further endoscopic treatment after appropriate specimen assessment.", ["esd-lymphatic", "esd-completion"]),
      choice("surveillance", "Endoscopic and radiologic surveillance", false,
        "Surveillance gives excessive weight to the small mucosal lesion, clear margins and CT node size while overlooking the lymphatic finding in a fit patient.",
        "Assume a clear-margin mucosal cancer is necessarily an endoscopic cure.",
        "A fully curative endoscopic specimen or severe operative comorbidity changes this decision and its counseling.", ["esd-lymphatic", "esd-completion"]),
    ],
    explanation: "Clear margins answer a local removal question. Tumor within lymphatic spaces changes the concern for disease beyond that field. In this fit patient, completion gastrectomy with lymphadenectomy is the supported discussion despite unrevealing CT nodes.",
    supportingEvidenceClaimIds: ["esd-lymphatic", "esd-completion"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The record reports what is seen in lymphatic spaces rather than an eCura label or a statement that surgery is needed. Three specific definitive plans have comparable scope; no key-only availability or preservation preference is supplied.",
      sameDecisionStageAndCategory: "Three definitive post-endoscopic-resection management plans.",
      reasoningSteps: ["Interpret epithelial tumor clusters within endothelial-lined lymphatic spaces as lymphatic involvement.", "Recognize that this invalidates a local endoscopic cure despite favorable depth/margins and select a plan addressing nodes."],
      closestError: "Choose surveillance from clear margins, small mucosal size and non-enlarged CT nodes.", decidingObservation: "Tumor in lymphatic spaces; margin status and local depth do not remove this finding.",
      consequence: "The patient could retain an untreated regional-risk compartment.", residentDifficulty: "Moderate to hard PGY-2/3 prediction from discordant local-clearance and extra-field-risk evidence.",
      singleDefensibleBestAnswer: "Fit patient, clear local margins and lymphatic involvement favor gastrectomy/lymphadenectomy over another local resection or routine surveillance.",
      counterfactual: "Remove lymphatic and vascular invasion while retaining the other favorable pathology: surveillance becomes reasonable; change only the horizontal margin and repeat endoscopic treatment can become reasonable.",
      deletionTest: ["Clear margins and mucosal depth create the credible surveillance error.", "The lymphatic observation changes the decision.", "Fitness establishes applicability of the surgical recommendation; CT node size tests its limited negative value."],
      sequenceReview: "Standalone; there is no earlier endoscopic-curability feedback to supply the answer.",
      repairAndRecheck: "Replaced the preinterpreted noncurative-ESD label with the actual lymphatic observation and removed exact risk percentages. Re-solved against current JGCA and independent Korean guidance.",
    },
  },
  {
    slug: "upfront-d2-adjuvant", caseSlug: "postgastrectomy-records",
    conceptId: conceptId("upfront-d2-adjuvant"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Select an evidence-supported postoperative regimen after upfront R0 D2 gastric-cancer resection.",
    currentUpdate: "", task: "Which postoperative treatment should be discussed for {patientName}'s gastric cancer on the basis of the outside operative and pathology records?",
    exhibit: exhibit([
      ["Prior treatment", "The outside hospital performed upfront gastrectomy; she received no preoperative drug treatment or radiotherapy."],
      ["Operation and pathology", "D2 dissection is documented with clear gastric margins. The primary extends into subserosa, and regional nodes contain carcinoma; the final pathology stage is III."],
      ["Treatment assessment", "Mismatch-repair proteins are retained. She has recovered oral intake, with preserved renal function and no function-limiting neuropathy."],
    ]),
    choices: [
      choice("capox", "Adjuvant CAPOX chemotherapy", true,
        "Capecitabine and oxaliplatin are supported after curative D2 surgery for stage II/III disease. This is postoperative treatment after upfront surgery, not selection of a new perioperative regimen.",
        "Apply evidence to the actual completed treatment phase and dissection.",
        "Severe persistent neuropathy or renal dysfunction would require a different specific regimen assessment; neither is supplied here.", ["adjuvant-capox"]),
      choice("crt", "Adjuvant capecitabine chemoradiation", false,
        "The completed R0 D2 record lacks the margin or inadequate-dissection boundary that would make a postoperative local-control strategy more compelling.",
        "Apply an older postoperative chemoradiation pathway without checking resection quality.",
        "An inadequate lymphadenectomy or involved margin can change the chemoradiation discussion.", ["adjuvant-rt"]),
      choice("nivolumab", "Adjuvant CAPOX plus nivolumab", false,
        "The adjuvant nivolumab trial after upfront D2 surgery did not establish added benefit. A newer perioperative immunotherapy approval is not interchangeable with this postoperative-only plan.",
        "Extrapolate metastatic or perioperative immunotherapy success into an untested treatment phase.",
        "A patient beginning an indicated perioperative immunotherapy regimen before surgery represents a different evidence setting; the current FDA update is recorded separately.", ["adjuvant-immune", "durvalumab-update"]),
    ],
    explanation: "Match systemic treatment to the pathway that actually occurred. Stage III disease after upfront R0 D2 resection supports adjuvant CAPOX among these options. Adequate dissection and clear margins affect the radiation comparison; postoperative nivolumab is not established by perioperative immunotherapy results.",
    supportingEvidenceClaimIds: ["adjuvant-capox", "adjuvant-rt", "adjuvant-immune", "durvalumab-update"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Every option is a named postoperative treatment. CAPOX appears in two options, defeating simple regimen-name matching; the longest option is not the key. The chart does not announce which guideline applies.",
      sameDecisionStageAndCategory: "Three postoperative oncologic regimens after completed upfront surgery.",
      reasoningSteps: ["Interpret the node-positive stage III specimen as a systemic-recurrence problem despite R0 removal.", "Use the D2 record and absence of preoperative therapy to distinguish adjuvant chemotherapy from routine chemoradiation or a perioperative-immunotherapy extrapolation."],
      closestError: "Add immunotherapy because it helps in a different gastric-cancer treatment phase.", decidingObservation: "Upfront R0 D2 gastrectomy with no preoperative systemic therapy; the retained mismatch-repair pattern avoids a separate disputed MSI-H adjuvant boundary.",
      consequence: "An evidence mismatch can add toxicity without established benefit or substitute an unsuitable pathway.",
      residentDifficulty: "Hard PGY-2/3 prediction from treatment-phase transfer and dissection adequacy rather than remembering one drug name.",
      singleDefensibleBestAnswer: "CAPOX is an evidence-supported offered adjuvant regimen in this fit R0 D2 stage III setting.",
      counterfactual: "Change D2/clear margins to an inadequate nodal dissection or R1 margin: a chemoradiation discussion becomes reasonable. Change chronology to initiation before surgery: contemporary perioperative immunotherapy evidence becomes relevant.",
      deletionTest: ["Upfront chronology distinguishes adjuvant from perioperative evidence.", "D2 and clear margins determine the radiation comparison.", "Functional recovery, renal function and neuropathy inform CAPOX feasibility; stage III establishes adjuvant need."],
      sequenceReview: "Standalone outside-hospital chart review. The ESD case does not become a fictional stage-III progression or an unsupported T1N2 adjuvant example.",
      repairAndRecheck: "Abandoned an ESD-to-T1N2 companion after finding a source limitation for that subgroup. Created this separate stage III case and rechecked the actual postoperative evidence; no FLOT-versus-durvalumab preference is silently inferred.",
    },
  },
  {
    slug: "organ-specific-resection", caseSlug: "splenic-extension",
    conceptId: "concept.n1r2.gastric-organ-specific-resection", previousConceptId: null,
    creationKind: "Rewrite", before: ["question.n1.gastric-adjacent-invasion.v2"], conceptType: "management",
    objective: "Match gastric-cancer adjacent-organ resection to separately documented splenic and pancreatic interfaces.",
    currentUpdate: "", task: "Which adjacent-organ extent best fits {patientName}'s documented gastric-cancer operative findings?",
    exhibit: exhibit([
      ["Disease and operative stage", "At the outside operation after completed staging and treatment planning, no distant or peritoneal disease was found. The gastric resection could achieve clear margins."],
      ["Splenic interface", "Tumor extended through the gastrosplenic tissues into splenic parenchyma."],
      ["Pancreatic interface", "The tail of the pancreas separated from the gastric lesion along a continuous soft-tissue plane with an intact pancreatic surface."],
    ]),
    choices: [
      choice("spleen", "Gastrectomy with splenectomy", true,
        "Splenic involvement is therapeutic resection territory rather than a prophylactic splenectomy scenario. The separately documented pancreatic plane does not support adding distal pancreatectomy.",
        "Interpret each organ interface before choosing the extent.",
        "Without splenic invasion, greater-curvature involvement or suspicious hilar disease, ordinary spleen-preservation evidence would become applicable.", ["direct-organ-invasion", "pancreatic-preservation", "spleen-preservation"]),
      choice("pancreas", "Gastrectomy with pancreatosplenectomy", false,
        "This adds removal of an organ whose interface is documented as separate and intact. Splenic involvement does not automatically establish pancreatic invasion.",
        "Treat adjacent upper-abdominal organs as one inseparable oncologic unit.",
        "Demonstrated pancreatic invasion with feasible clear margins can support combined pancreatic resection; post-treatment inseparable adhesion alone remains a separately held question.", ["direct-organ-invasion", "pancreatic-preservation"]),
      choice("preserve", "Gastrectomy preserving both organs", false,
        "The prophylactic spleen-preservation rule cannot override direct splenic invasion in this represented resectable record.",
        "Apply the routine preservation rule outside its population.",
        "Preserved splenic and pancreatic planes with no greater-curvature or hilar involvement would support preservation.", ["direct-organ-invasion", "spleen-preservation"]),
    ],
    explanation: "Direct splenic invasion changes the spleen decision; a documented intact pancreatic plane changes the pancreas decision separately. This draft retains the organ-specific objective and does not answer the held question about peeling a treated, inseparable interface.",
    supportingEvidenceClaimIds: ["direct-organ-invasion", "pancreatic-preservation", "spleen-preservation"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No feasibility sentence names the operation to choose. Three surgical extents are specific and credible; the longest, most extensive option is a distractor. No task word matches only the key.",
      sameDecisionStageAndCategory: "Three operative extents at the same documented outside-operation phase.",
      reasoningSteps: ["Recognize that direct splenic extension takes the patient outside prophylactic splenectomy evidence.", "Use the independently preserved pancreatic plane to avoid adding removal of an uninvolved organ."],
      closestError: "Remove pancreatic tail with the spleen because of their proximity.", decidingObservation: "Splenic parenchymal invasion and a separate intact pancreatic interface are documented independently.",
      consequence: "Over-resection adds pancreatic morbidity; under-resection can leave involved tissue.", residentDifficulty: "Moderate PGY-2/3 prediction from independently interpreted organ interfaces.",
      singleDefensibleBestAnswer: "The record supports splenic removal and pancreatic preservation among the offered extents.",
      counterfactual: "Replace the intact pancreatic plane with proven pancreatic invasion: combined resection becomes a reasonable extent discussion. Remove splenic invasion as well: preservation becomes reasonable.",
      deletionTest: ["Each organ-interface row changes a different extent decision.", "Staging and clear-margin feasibility prevent adjacency from being equated with automatic curability.", "The clinic frame places a retrospective outside operation within the current runtime setting."],
      sequenceReview: "Standalone retrospective chart review. No frozen prophylactic-splenectomy case/header is edited or composed into this case.",
      repairAndRecheck: "Preserved the N1r2 scored meaning but replaced vague hilar involvement with actual parenchymal extension. Removed an unsupported universal treated-interface plane rule and carried that source hold forward unchanged.",
    },
  },
  {
    slug: "gastric-wall-tissue-route", caseSlug: "cardia-wall-mass",
    conceptId: "concept.gastric-gist.eus-core-molecular-diagnosis", previousConceptId: null,
    creationKind: "Rewrite", before: ["question.gastric-gist.eus-core-molecular-diagnosis.v2"], conceptType: "workup",
    objective: "Select representative pretreatment tissue and molecular evaluation for a challenging gastric-wall mass.",
    currentUpdate: "The outside team is considering drug treatment before resection if tissue classification supports it.",
    task: "Which tissue-acquisition route should be requested for {patientName}'s gastric mass before the proposed treatment?",
    exhibit: exhibit([
      ["Contrast CT", "An 8-cm mass is centered in the gastric wall at the cardia. It has a substantial enhancing tissue component and no distant lesion."],
      ["Endoscopy and earlier specimen", "The overlying mucosa is intact. Forceps specimens contain gastric glands and lamina propria, without tissue from the wall mass."],
      ["EUS record", "The mass is contiguous with the muscular wall layer and can be reached from the gastric lumen."],
    ]),
    choices: [
      choice("eus-core", "EUS-guided core needle biopsy", true,
        "The superficial result does not classify the wall lesion. EUS core sampling can obtain representative tissue for histology and subsequent KIT/PDGFRA assessment before medical treatment.",
        "Match the sampled layer and route to the treatment question.",
        "If the lesion could not be reached endoscopically, a safe image-guided percutaneous route could be appropriate.", ["core-tissue", "eus-route", "tissue-provenance"], "timing.test.gist_eus_core_molecular"),
      choice("ct-core", "CT-guided transabdominal core biopsy", false,
        "A percutaneous biopsy can be appropriate, but the reachable localized gastric mass favors the endoscopic route that avoids traversing the peritoneal cavity.",
        "Treat all core routes as equivalent once molecular testing is planned.",
        "An inaccessible gastric route or an accessible metastatic focus could make image-guided percutaneous core sampling preferable.", ["core-tissue", "eus-route"], "timing.test.biopsy"),
      choice("forceps", "Repeat endoscopic forceps mucosal biopsy", false,
        "The intact mucosa and represented superficial layers do not establish that repeating this sampling method would reach the mass requiring classification.",
        "Repeat the familiar procedure without reconsidering the sampled compartment.",
        "A mucosal lesion or a visibly ulcerated tumor reaching the sampled surface can make targeted forceps biopsy appropriate.", ["tissue-provenance", "eus-route"], "timing.test.endoscopy_with_sampling"),
    ],
    explanation: "Interpret a benign sample in relation to what it contains. This specimen describes superficial mucosa, while the treatment question concerns a deeper wall mass. Representative EUS-guided core tissue and molecular evaluation fit the selected pretreatment pathway; not every resectable GIST needs this sequence.",
    supportingEvidenceClaimIds: ["core-tissue", "eus-route", "tissue-provenance"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The task asks for a route and all labels name a biopsy route. Molecular testing is a common downstream purpose, not a key-only phrase. No explicit sentence says the core is missing or that EUS is immediately available.",
      sameDecisionStageAndCategory: "Three tissue-acquisition procedures before classification-dependent treatment.",
      reasoningSteps: ["Infer that the prior benign mucosal sample does not classify the muscular-wall mass.", "Choose representative core sampling through the reachable gastric route for a medical-treatment pathway."],
      closestError: "Order another superficial forceps biopsy or regard a percutaneous core as the default equivalent route.", decidingObservation: "The prior specimen contains superficial layers, and the mass is continuous with the deeper muscular wall on EUS.",
      consequence: "Wrong-compartment sampling can delay diagnosis or permit mutation-uninformed treatment.", residentDifficulty: "Moderate PGY-2/3 prediction from sampling provenance and route selection; percutaneous biopsy remains a credible alternative in different anatomy.",
      singleDefensibleBestAnswer: "EUS core is the preferred offered route for this reachable localized gastric-wall mass needing pretreatment classification.",
      counterfactual: "If the gastric route were inaccessible but a safe percutaneous route existed, CT-guided core would become reasonable; if disease involved the mucosal surface, forceps sampling could answer the question.",
      deletionTest: ["The specimen-layer description prevents a benign result from being overgeneralized.", "The EUS layer and reach establish the route comparison.", "The proposed preoperative drug phase establishes why tissue and genotype are required."],
      sequenceReview: "First node; no genotype or drug is named in feedback. Later KIT exon 11 and operative anatomy remain unseen.",
      repairAndRecheck: "Removed the original explicit mutation-status-missing cue and interpreted imatinib-sensitive label. Replaced PET-without-tissue and symptom-only foils with actual acquisition routes, then checked that all three have timing entries.",
    },
  },
  {
    slug: "kit-exon11-neoadjuvant", caseSlug: "cardia-wall-mass",
    conceptId: "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib", previousConceptId: null,
    creationKind: "Rewrite", before: ["question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v2"], conceptType: "management",
    objective: "Apply GIST genotype and cardia anatomy to the choice of preoperative targeted treatment.",
    currentUpdate: "At the next clinic review, the outside core-biopsy and operative-planning records are available.",
    task: "Which initial tumor-treatment plan best fits {patientName}'s gastric-mass records?",
    exhibit: exhibit([
      ["Core pathology and sequencing", "Spindle-cell tumor with diffuse DOG1 and CD117 staining; sequencing identifies a KIT exon 11 deletion."],
      ["Operative anatomy", "The mass encircles the cardia. The current margin-negative resection plan requires total gastrectomy; reducing the interface could allow a more limited gastric resection."],
      ["Clinical extent", "No metastatic disease, active bleeding or obstruction is present."],
    ]),
    choices: [
      choice("imatinib", "Preoperative imatinib with resection reassessment", true,
        "The genotype supports imatinib responsiveness, and the anatomy gives shrinkage a consequential operative purpose. The combination supports a neoadjuvant plan rather than treatment from size alone.",
        "Combine predictive molecular evidence with a patient-specific operative consequence.",
        "A similarly genotyped peripheral lesion removable by a small wedge would favor primary surgery rather than automatically adding preoperative treatment.", ["genotype-sensitive", "neoadjuvant"]),
      choice("surgery", "Primary gastrectomy with margin-negative resection", false,
        "Primary surgery treats the local disease but accepts the represented total-gastrectomy extent before exploring genotype-responsive reduction of that morbidity.",
        "Apply the usual localized-GIST surgery rule without accounting for the particular cardia anatomy.",
        "A straightforward limited resection, an urgent complication or an imatinib-resistant genotype can change the initial plan.", ["neoadjuvant", "gist-excision", "genotype-sensitive"]),
      choice("avapritinib", "Preoperative avapritinib with resection reassessment", false,
        "This substitutes a drug associated with another molecular subgroup for an imatinib-responsive KIT exon 11 tumor. Routine preoperative avapritinib is not established here.",
        "Treat all kinase-driven GIST as interchangeable targeted-therapy candidates.",
        "PDGFRA D842V with unresectable or metastatic disease supports avapritinib; that is a different genotype and indication.", ["genotype-sensitive", "d842v-treatment"]),
    ],
    explanation: "The molecular result and operative cost must both matter. KIT exon 11 supports imatinib responsiveness, while the cardia involvement gives response a reason to precede resection. Reassess the operation after treatment rather than assuming that every large GIST or every kinase inhibitor has the same pathway.",
    supportingEvidenceClaimIds: ["genotype-sensitive", "neoadjuvant", "gist-excision", "d842v-treatment", "gist-phenotype"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The update gives the actual exon rather than imatinib-sensitive. Both drug options share the same reassessment wording; the unique generic cautious-plan shortcut is absent. The necessary operative goal is concrete and shared with the surgery competitor.",
      sameDecisionStageAndCategory: "Three initial local-tumor treatment strategies.",
      reasoningSteps: ["Interpret the diagnostic phenotype and KIT exon 11 deletion as an imatinib-responsive GIST.", "Use the cardia-related total-gastrectomy consequence to favor preoperative response before resection."],
      closestError: "Proceed to total gastrectomy because the disease is localized and technically removable.", decidingObservation: "KIT exon 11 plus an operation whose extent could be reduced by tumor response.",
      consequence: "The wrong sequence can impose avoidable gastric loss or expose the patient to an unsuitable drug.", residentDifficulty: "Moderate to hard PGY-2/3 prediction from genotype versus operability, not the source's former sensitivity label.",
      singleDefensibleBestAnswer: "Among these options, preoperative imatinib addresses both a responsive driver and the represented avoidable surgical extent.",
      counterfactual: "Change cardia encirclement to a peripheral wedge-resectable lesion: primary surgery becomes preferable. Change to metastatic D842V: avapritinib becomes the appropriate offered drug in that revised indication.",
      deletionTest: ["Deleting genotype leaves the drug choice unsupported.", "Deleting the operative consequence collapses the reason to precede surgery with treatment.", "Bleeding/obstruction negatives protect the elective sequencing premise."],
      sequenceReview: "The first node's feedback describes representative tissue and molecular evaluation but names neither a drug nor sensitivity. This node does not disclose CT-response interpretation in advance.",
      repairAndRecheck: "Replaced the supplied sensitivity conclusion and cytotoxic/symptom-only distractors. Re-solved with actual genotype, a credible primary operation and a neighboring targeted agent; no dose or fixed duration introduced.",
    },
  },
  {
    slug: "attenuation-versus-diameter", caseSlug: "cardia-wall-mass",
    conceptId: conceptId("attenuation-versus-diameter"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Interpret paired CT size and attenuation changes before declaring imatinib failure in gastric GIST.",
    currentUpdate: "The clinic now reviews the first outside response assessment during imatinib treatment. Adherence is documented and treatment is well tolerated.",
    task: "Which drug plan best fits {patientName}'s first gastric-GIST response assessment?",
    exhibit: exhibit([
      ["Matched contrast CT protocol", "The same acquisition phase and lesion region were used. Maximum diameter changed from 8.0 to 8.6 cm; attenuation changed from 72 to 34 HU."],
      ["Lesion appearance and distribution", "The enhancing solid component has become homogeneous and low attenuation. No new enhancing nodule or additional lesion is seen."],
      ["Clinical course", "Early satiety has improved and oral intake has increased."],
    ]),
    choices: [
      choice("continue", "Continue the current imatinib regimen", true,
        "The attenuation and enhancement changes, absence of a new viable-appearing nodule, and clinical improvement support treatment effect despite the modest diameter increase.",
        "Integrate matched CT features rather than one dimension.",
        "A new enhancing intratumoral nodule or unequivocal new disease would prompt reassessment for true progression.", ["ct-response", "progression-plan"]),
      choice("escalate", "Escalate the current imatinib regimen", false,
        "The supplied pattern does not establish inadequate tumor suppression requiring dose escalation. Diameter change must be interpreted with density and clinical findings.",
        "Apply a size-only progression rule to a targeted-therapy response.",
        "Confirmed progression after review of adherence, interactions and genotype can support escalation in selected GIST settings.", ["ct-response", "progression-plan"]),
      choice("switch", "Replace imatinib with sunitinib", false,
        "A second-line switch is premature when the integrated record supports response and no intolerance is present.",
        "Treat the larger measurement as proof of acquired drug resistance.",
        "Confirmed imatinib failure or intolerance can support sunitinib after specialist assessment.", ["ct-response", "progression-plan"]),
    ],
    explanation: "Targeted GIST responses can reduce attenuation before the tumor shrinks. The matched protocol, lower attenuation, loss of enhancing tissue and improved symptoms argue against calling this imatinib failure from diameter alone. Continue the current regimen while following the planned response assessment.",
    supportingEvidenceClaimIds: ["ct-response", "progression-plan", "sunitinib-after-failure"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The exhibit gives raw paired measurements and appearances, with no response label, Choi label or pre-answer teaching sentence. All alternatives are similarly sized drug actions; the key is not uniquely cautious or comprehensive.",
      sameDecisionStageAndCategory: "Three current systemic-drug actions at a response assessment.",
      reasoningSteps: ["Recognize a density/enhancement response despite increasing diameter on a comparable acquisition.", "Separate treatment effect from resistance and choose continuation rather than dose escalation or a line change."],
      closestError: "Switch to sunitinib after reading only the diameter increase.", decidingObservation: "Substantially lower attenuation and homogeneous appearance on matched acquisitions with no new enhancing nodule.",
      consequence: "An active regimen could be abandoned prematurely.", residentDifficulty: "Hard PGY-2/3 prediction from discordant measurements and the danger of transferring generic size-only criteria.",
      singleDefensibleBestAnswer: "The integrated response pattern supports current imatinib continuation among the three offered drug actions.",
      counterfactual: "A new enhancing nodule inside a previously low-attenuation lesion would reverse the response interpretation and prompt progression assessment before the next drug decision.",
      deletionTest: ["Protocol matching establishes comparability of attenuation.", "Both measurements are needed to create the competing interpretation.", "Enhancing-nodule absence and symptoms distinguish a coherent response from ambiguous bleeding or clinical deterioration."],
      sequenceReview: "Previous feedback explains why imatinib was started but does not describe response criteria. The new imaging must be interpreted; deleting it leaves no basis to choose continuation over failure management.",
      repairAndRecheck: "Removed the words pseudoprogression and partial response from the stem. Kept matched acquisition details and avoided a claimed exact Choi cutoff. Re-solved escalation and switching using the current integrated pattern.",
    },
  },
  {
    slug: "banked-tissue-provenance", caseSlug: "archived-wall-specimens",
    conceptId: conceptId("banked-tissue-provenance"), previousConceptId: "concept.n2.gastric-wall-mass-specimen-provenance",
    creationKind: "Rewrite", before: ["question.n2.gastric-wall-mass-specimen-provenance.v2"], conceptType: "workup",
    objective: "Identify usable previously obtained tumor tissue before requesting a repeat gastric-wall biopsy for genotyping.",
    currentUpdate: "The referral attachment and archived accession records differ. The clinic is arranging KIT/PDGFRA testing before preoperative drug treatment is selected.",
    task: "Which specimen plan should the clinic use next for {patientName}'s gastric-mass molecular assessment?",
    exhibit: exhibit([
      ["Attached report: accession A", "Forceps material from the overlying gastric surface contains glands and lamina propria, without the imaged wall mass."],
      ["Archive: accession B", "EUS cores from the gastric-wall mass contain a spindle-cell tumor with diffuse DOG1 and CD117 staining. The accession and sampling site match the procedure map."],
      ["Archive adequacy check", "Representative tumor remains in block B. The molecular laboratory confirms sufficient material for its validated KIT/PDGFRA assay."],
    ]),
    choices: [
      choice("block-b", "KIT/PDGFRA testing on archived block B", true,
        "The archive establishes both representative tumor identity and assay adequacy. The superficial referral report does not invalidate the separate core specimen, and another acquisition is unnecessary for this question.",
        "Reconcile specimen identity, represented tissue and analytic adequacy.",
        "If block B were exhausted or had too little tumor for the assay, repeat core acquisition would be justified.", ["banked-core", "tissue-provenance", "core-tissue"], "timing.test.pathology_review"),
      choice("block-a", "KIT/PDGFRA testing on attached block A", false,
        "The attached accession represents surface tissue rather than the wall tumor. A technically completed assay on that material would not supply the intended tumor genotype.",
        "Use the report present in the referral rather than check tissue provenance.",
        "If accession A actually contained representative tumor with validated assay adequacy, it could be a usable molecular specimen.", ["tissue-provenance", "banked-core"], "timing.test.pathology_review"),
      choice("repeat", "Repeat EUS-guided gastric-wall core biopsy", false,
        "The current record already establishes a usable tumor-containing core block. Repeating acquisition does not resolve a remaining identity or adequacy problem.",
        "Equate missing referral paperwork with absent representative tissue.",
        "An exhausted, wrong-target or inadequate archived specimen would make repeat acquisition appropriate.", ["banked-core", "core-tissue"], "timing.test.gist_eus_core_molecular"),
    ],
    explanation: "Specimen adequacy and referral completeness are different questions. A benign superficial accession cannot classify a deeper mass, but the separately documented tumor core remains usable. Use the identified adequate block for genotyping rather than repeat acquisition from an administrative omission.",
    supportingEvidenceClaimIds: ["banked-core", "tissue-provenance", "core-tissue", "gist-phenotype"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Both molecular-test choices have the same assay wording, while each testing path has wait metadata. The task does not name the missing report or say to retrieve the block. Archive identity and adequacy are observations, not a statement that the laboratory has already run the assay.",
      sameDecisionStageAndCategory: "Three specimen plans for the same pending molecular assessment.",
      reasoningSteps: ["Distinguish an irrelevant superficial accession from a correctly mapped tumor-containing wall core.", "Use the confirmed residual tumor and assay adequacy to select testing from existing tissue rather than repeat acquisition."],
      closestError: "Repeat EUS because only a benign report accompanied the referral.", decidingObservation: "The archived B accession matches the mass and retains assay-adequate tumor, independently of A.",
      consequence: "The wrong accession can produce an uninformative genotype; unnecessary resampling adds procedure burden.", residentDifficulty: "Moderate PGY-2/3 prediction from administrative-versus-sampling failure and analytic adequacy; independent reviewer must assess whether the archive row makes it too direct.",
      singleDefensibleBestAnswer: "Block B is the only documented representative, analytically adequate existing specimen, so it can answer the pending molecular question.",
      counterfactual: "Exhaust block B or fail its tumor-adequacy assessment: repeat EUS core becomes the reasonable next plan. Make A representative and adequate instead: A becomes usable.",
      deletionTest: ["Without accession A the superficial-result misconception disappears.", "Without identity/site matching, B cannot be safely attributed to this mass.", "Without remaining-tumor adequacy, existing tissue cannot be ranked against repeat sampling."],
      sequenceReview: "Standalone; no prior tissue-route feedback supplies the available-specimen answer. No frozen N2 context is edited.",
      repairAndRecheck: "The old N2 map made the only solid region the answer. Replaced region picking with a changed evidence-status objective and created a new meaning so its FSRS history is not transferred. Old editorial hold remains on the exact v2 item.",
    },
  },
  {
    slug: "localized-gist-operation", caseSlug: "fundic-gist-resection",
    conceptId: conceptId("localized-gist-operation"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Choose a capsule-preserving local operation for a conventional localized gastric GIST rather than epithelial-cancer nodal surgery.",
    currentUpdate: "", task: "Which operation best fits {patientName}'s localized gastric tumor?",
    exhibit: exhibit([
      ["Biopsy", "A spindle-cell tumor stains for DOG1 and CD117. KIT exon 11 is altered; SDHB expression is retained."],
      ["Contrast CT and EUS", "A 3.2-cm mass projects from the greater-curvature side of the fundus. It does not encircle the cardia or contact an adjacent organ. No enlarged node or distant lesion is identified."],
    ]),
    choices: [
      choice("wedge", "Full-thickness wedge gastrectomy", true,
        "A limited resection can remove this peripheral conventional GIST with an intact capsule. Its lymphatic behavior differs from gastric adenocarcinoma, so routine D2 clearance is not required.",
        "Combine tumor type with the specific resectable peripheral anatomy.",
        "A cardia-encircling mass requiring major gastric loss could instead justify a molecularly informed preoperative approach.", ["gist-excision", "gist-nodes", "neoadjuvant"]),
      choice("d2", "Total gastrectomy with D2 dissection", false,
        "This applies an epithelial gastric-cancer operation and routine nodal strategy to a fundic mesenchymal tumor, with more gastric loss and no stated nodal indication.",
        "Treat all malignant gastric tumors with the same lymphadenectomy template.",
        "An extensive proximal gastric adenocarcinoma can warrant total gastrectomy with stage-appropriate nodal dissection.", ["gist-nodes", "gist-excision", "adjuvant-capox"]),
      choice("enucleation", "Endoscopic submucosal enucleation", false,
        "Shelling out a muscular-wall GIST does not provide the same assurance of complete excision with an intact capsule and appropriate wall clearance.",
        "Equate the smallest operation with an adequate organ-sparing oncologic excision.",
        "A confidently characterized benign lesion with an appropriate endoscopic dissection plane is a different operative problem; this tumor is not that record.", ["gist-excision"]),
    ],
    explanation: "The biopsy establishes a conventional GIST pattern, and the peripheral fundic anatomy permits a local full-thickness excision. Preserve the capsule and obtain complete removal; do not substitute routine adenocarcinoma lymphadenectomy or shelling out the mass.",
    supportingEvidenceClaimIds: ["gist-excision", "gist-nodes", "neoadjuvant", "adjuvant-capox", "gist-phenotype"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The task does not request organ preservation, and the vignette does not state that a wedge is feasible. All labels are actual operations. The key is neither the longest nor the only limited operation.",
      sameDecisionStageAndCategory: "Three primary gastric operations before resection: local wedge, formal gastrectomy and endoscopic enucleation.",
      reasoningSteps: ["Infer a conventional mesenchymal GIST rather than an epithelial cancer from the biopsy and molecular findings.", "Use fundic peripheral anatomy and capsule-based excision principles to choose an adequate limited operation without routine D2 surgery."],
      closestError: "Choose enucleation to minimize gastric loss or apply D2 surgery from gastric adenocarcinoma.", decidingObservation: "Conventional GIST phenotype and a peripheral fundic mass without nodal disease or cardia encirclement.",
      consequence: "A wrong procedure can risk inadequate excision or unnecessary gastric and nodal surgery.", residentDifficulty: "Moderate PGY-2/3 prediction from competing organ-sparing and oncologic-extent errors.",
      singleDefensibleBestAnswer: "A full-thickness wedge balances complete capsule-preserving excision and the represented anatomy.",
      counterfactual: "Change the tumor type to an extensive proximal adenocarcinoma: total gastrectomy with nodal clearance becomes reasonable. Change to cardia encirclement: reassess whether primary limited resection remains feasible.",
      deletionTest: ["Biopsy/molecular data distinguish tumor-specific operative principles.", "Fundic location and absence of cardia encirclement determine the local extent.", "Nodal observations and retained SDHB keep the routine no-lymphadenectomy application within conventional disease."],
      sequenceReview: "First node. Feedback addresses the planned operation but does not state the later microscopic-margin management rule.",
      repairAndRecheck: "Removed a preservation preference that previewed the key. Replaced generic surgery labels with named extents. The initial distal-gastrectomy distractor did not remove a fundic lesion; repaired it to total gastrectomy and re-solved both actual competing operations.",
    },
  },
  {
    slug: "r1-without-rupture", caseSlug: "fundic-gist-resection",
    conceptId: conceptId("r1-without-rupture"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Distinguish a microscopic GIST margin from gross residual disease or rupture before recommending major completion surgery.",
    currentUpdate: "At follow-up in clinic, the outside resection report and proposed completion operation are reviewed.",
    task: "Which next management plan best fits {patientName}'s returned gastric-GIST resection records?",
    exhibit: exhibit([
      ["Operation", "The mass was removed intact. No tumor spill, rupture or gross residual lesion was recorded."],
      ["Pathology", "The 3.2-cm gastric GIST has two mitoses per 5 mm2. A microscopic focus reaches the inked gastric-wall edge."],
      ["Postoperative review", "CT shows no residual mass. The postoperative remnant is narrowed near the cardia, and a wider resection would require completion total gastrectomy."],
    ]),
    choices: [
      choice("surveillance", "Scheduled CT tumor surveillance", true,
        "A microscopic margin does not equal rupture or macroscopic residual tumor. Given the limited tumor risk features and major completion operation, review-based surveillance is the best offered plan rather than automatic resection or imatinib for the margin itself.",
        "Separate R1 evidence from rupture and weigh the actual completion extent.",
        "Gross residual disease or a genuinely high-risk imatinib-responsive tumor would change the treatment assessment.", ["r1-boundary", "gist-excision"] , "timing.test.ct"),
      choice("completion", "Completion total gastrectomy", false,
        "The microscopic edge does not by itself establish benefit sufficient to justify the represented major gastric loss. Low-morbidity re-excision is a different discussion.",
        "Apply an automatic completion-resection rule to any positive tumor margin.",
        "Macroscopic residual localized disease for which complete resection is feasible can justify further surgery; a small low-morbidity re-excision also requires separate assessment.", ["r1-boundary", "gist-excision"]),
      choice("imatinib", "Adjuvant imatinib treatment", false,
        "R1 status alone is not an adjuvant-imatinib criterion. The reported size, gastric site, low mitotic count and absence of rupture do not supply a high-risk indication in this case.",
        "Treat any positive microscopic edge as evidence of disseminated or high-risk GIST.",
        "A high-risk tumor with an imatinib-responsive genotype or tumor rupture changes the systemic-treatment question.", ["r1-boundary", "genotype-sensitive"]),
    ],
    explanation: "Read margin, gross residual tumor and rupture as separate findings. A microscopic edge in an otherwise intact, macroscopically complete resection does not independently require major completion surgery or adjuvant imatinib. The actual re-excision burden and tumor risk support surveillance among these choices.",
    supportingEvidenceClaimIds: ["r1-boundary", "gist-excision", "genotype-sensitive", "gist-risk-features"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The positive edge initially supports the surgical distractor; the record never labels it harmless or low risk. The key names scheduled CT surveillance rather than a uniquely cautious individualized plan; matching CT to the completed scan does not select management without interpreting the margin and rupture record. Its surveillance test has timing metadata despite not being performed in this preview.",
      sameDecisionStageAndCategory: "Three post-resection management plans.",
      reasoningSteps: ["Interpret an inked microscopic focus with intact removal as R1 rather than rupture or gross residual disease.", "Use the tumor's risk features and the morbidity of total gastrectomy to reject automatic completion surgery or margin-driven imatinib."],
      closestError: "Recommend total gastrectomy for every positive margin.", decidingObservation: "Microscopic involvement only, no rupture/gross residual tumor, and a completion operation requiring removal of the remaining stomach.",
      consequence: "Misclassification can impose unnecessary major surgery or systemic treatment.", residentDifficulty: "Hard PGY-2/3 prediction because a genuinely adverse-sounding pathology result must be interpreted within GIST-specific surgical evidence.",
      singleDefensibleBestAnswer: "Surveillance after sarcoma review is preferable among the offered options for this macroscopically complete low-mitotic gastric tumor and major proposed completion extent.",
      counterfactual: "Change the edge finding to gross residual tumor or change the record to rupture/high-risk disease: the management assessment changes. A low-morbidity re-excision is not equivalent to the proposed total gastrectomy.",
      deletionTest: ["The microscopic edge creates the central decision.", "Intact removal and no gross residual disease prevent conflating distinct adverse events.", "Size/site/mitoses and proposed completion extent determine the risk-benefit comparison."],
      sequenceReview: "Previous feedback sought complete excision but supplied no positive-margin management rule. The new pathology and completion extent change what must be inferred.",
      repairAndRecheck: "Replaced a blanket observe-every-R1 claim with the actual major completion operation and separate risk features. Retained conditional specialist review and re-solved against three independent source groups; no fixed surveillance interval authored.",
    },
  },
  {
    slug: "metastatic-d842v", caseSlug: "metastatic-molecular-records",
    conceptId: conceptId("metastatic-d842v"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Use a PDGFRA D842V result to choose initial systemic therapy for metastatic gastric GIST.",
    currentUpdate: "", task: "Which initial systemic drug should be discussed for {patientName}'s gastric tumor and matching liver lesions?",
    exhibit: exhibit([
      ["Tissue and distribution", "The gastric-wall core and a liver-lesion core show the same DOG1-positive epithelioid tumor. Several separate liver deposits are present."],
      ["Molecular result", "PDGFRA exon 18 D842V is identified in representative tumor tissue."],
      ["Treatment history", "He has received no systemic tumor therapy."],
    ]),
    choices: [
      choice("avapritinib", "Begin avapritinib treatment", true,
        "The metastatic setting fits the regulatory indication, and D842V identifies a molecular subgroup for which avapritinib is active while imatinib is not.",
        "Let the specific driver override the default first-line GIST drug.",
        "A localized completely resected D842V tumor is a different adjuvant setting and does not automatically warrant this treatment.", ["d842v-treatment", "genotype-sensitive", "d842v-adjuvant"]),
      choice("imatinib", "Begin imatinib treatment", false,
        "The usual first-line choice for many metastatic GISTs does not apply to the primary D842V genotype.",
        "Use the tumor label while ignoring the exact exon-18 alteration.",
        "A metastatic KIT exon 11 GIST would ordinarily support initial imatinib.", ["genotype-sensitive", "d842v-treatment"]),
      choice("sunitinib", "Begin sunitinib treatment", false,
        "This is not an imatinib-failure sequence, and sunitinib does not solve the primary D842V resistance boundary.",
        "Jump to a familiar later-line GIST drug after noticing imatinib resistance.",
        "Confirmed imatinib failure in an appropriate non-D842V molecular context can support sunitinib.", ["d842v-treatment", "genotype-sensitive", "progression-plan"]),
    ],
    explanation: "Identify the molecular subgroup within metastatic GIST rather than stop at its name. PDGFRA D842V changes the initial drug choice to avapritinib in this unresectable/metastatic indication; a default imatinib sequence would miss the predictive result.",
    supportingEvidenceClaimIds: ["d842v-treatment", "genotype-sensitive", "d842v-adjuvant", "progression-plan", "gist-phenotype", "sunitinib-after-failure"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The driver is necessary raw data, not labelled imatinib-resistant. All choices are first-action drug plans with parallel grammar and similar length; no regulatory availability permission appears in the vignette.",
      sameDecisionStageAndCategory: "Three initial systemic kinase inhibitors.",
      reasoningSteps: ["Integrate concordant gastric and liver tissue as metastatic GIST rather than a localized gastric lesion.", "Apply the exact PDGFRA D842V driver to drug selection rather than follow the generic imatinib-first sequence."],
      closestError: "Choose sunitinib after remembering D842V imatinib resistance but overlooking a directly active first-line agent.", decidingObservation: "PDGFRA D842V in a treatment-naive metastatic tumor.",
      consequence: "A biologically ineffective first drug can delay disease control.", residentDifficulty: "Moderate to hard PGY-2/3 prediction from molecular subclassification and therapy-line confusion.",
      singleDefensibleBestAnswer: "Avapritinib fits both the exact driver and the metastatic indication among these drugs.",
      counterfactual: "Change D842V to KIT exon 11: imatinib becomes reasonable. Change treatment-naive disease to confirmed imatinib failure in an appropriate sensitive genotype: sunitinib becomes reasonable.",
      deletionTest: ["Both specimen concordance and liver distribution establish the systemic setting.", "The exact mutation changes the key.", "Treatment history establishes the line and prevents a later-line sequence from being assumed."],
      sequenceReview: "Standalone; the neoadjuvant-imatinib case supplies no visible history here. Exact drug doses and treatment durations are not tested.",
      repairAndRecheck: "Replaced a direct drug-mutation matching task with a tissue/distribution and treatment-phase decision. Kept all three active GIST drugs as competitors and verified the 2026 FDA indication rather than extrapolate from resected disease.",
    },
  },
  {
    slug: "resected-d842v", caseSlug: "resected-molecular-records",
    conceptId: conceptId("resected-d842v"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Avoid transferring metastatic targeted-therapy efficacy to unproven adjuvant treatment after complete D842V GIST resection.",
    currentUpdate: "", task: "Which postoperative plan should be discussed for {patientName}'s completely resected gastric tumor?",
    exhibit: exhibit([
      ["Resection record", "The gastric GIST was removed intact with clear margins. No rupture, gross residual tumor or metastatic lesion was found."],
      ["Tumor pathology", "The tumor measures 7 cm and has 12 mitoses per 5 mm2. Sequencing identifies PDGFRA exon 18 D842V."],
    ]),
    choices: [
      choice("surveillance", "CT surveillance after complete resection", true,
        "The adverse risk features justify close sarcoma follow-up, but do not make an imatinib-resistant driver sensitive. Metastatic avapritinib activity does not establish routine adjuvant benefit after complete resection.",
        "Keep recurrence risk, drug sensitivity and treatment setting separate.",
        "Residual unresectable or metastatic D842V disease would support avapritinib; an imatinib-responsive high-risk resected GIST could support adjuvant imatinib.", ["d842v-adjuvant", "d842v-treatment", "genotype-sensitive"], "timing.test.ct"),
      choice("imatinib", "Adjuvant imatinib after complete resection", false,
        "Size and mitotic activity cannot overcome primary D842V resistance. Adjuvant imatinib is not indicated for this molecular subtype.",
        "Apply a high-risk adjuvant rule without its predictive-genotype condition.",
        "A comparable high-risk GIST with an imatinib-responsive KIT driver would change this decision.", ["d842v-adjuvant", "genotype-sensitive"]),
      choice("avapritinib", "Adjuvant avapritinib after complete resection", false,
        "Selecting an active drug from the metastatic setting does not establish an adjuvant indication in a patient with complete local removal. A clinical trial is a separate discussion.",
        "Translate genotype-specific metastatic efficacy directly into routine adjuvant treatment.",
        "Demonstrated unresectable or metastatic D842V disease fits the verified indication.", ["d842v-adjuvant", "d842v-treatment"]),
    ],
    explanation: "High recurrence risk is not a substitute for a supported adjuvant drug. D842V excludes routine adjuvant imatinib, and the established avapritinib indication concerns unresectable or metastatic disease. Use risk-based surveillance and sarcoma review rather than invent an adjuvant standard.",
    supportingEvidenceClaimIds: ["d842v-adjuvant", "d842v-treatment", "genotype-sensitive", "gist-risk-features"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The high mitotic activity makes treatment tempting instead of making surveillance the only safe-looking choice. All labels name a postoperative plan with identical phase wording; surveillance has the same testing metadata discipline as other diagnostic paths.",
      sameDecisionStageAndCategory: "Three postoperative plans after macroscopically and microscopically complete resection.",
      reasoningSteps: ["Interpret size and mitoses as adverse recurrence-risk features while preserving the completely resected status.", "Apply D842V sensitivity and adjuvant-versus-metastatic evidence boundaries to reject automatic imatinib or avapritinib."],
      closestError: "Prescribe avapritinib because it is active against D842V in metastatic disease.", decidingObservation: "Complete intact resection with no metastatic disease, together with D842V.",
      consequence: "The patient could receive unestablished adjuvant therapy based on a treatment-setting extrapolation.", residentDifficulty: "Hard PGY-2/3 prediction from risk, predictive marker and evidence-setting conflict.",
      singleDefensibleBestAnswer: "Surveillance is the supported offered routine plan; this does not preclude trial discussion or personalized specialist review.",
      counterfactual: "Change the molecular result to an imatinib-responsive high-risk GIST: adjuvant imatinib becomes reasonable. Change complete resection to metastatic D842V: avapritinib becomes reasonable.",
      deletionTest: ["Size/mitoses establish why an adjuvant treatment is tempting.", "The mutation changes imatinib suitability.", "Complete resection and no rupture/metastasis prevent importing an advanced-disease indication."],
      sequenceReview: "Standalone so the metastatic-D842V answer and feedback are not rehearsed immediately before this decision.",
      repairAndRecheck: "Avoided a fixed three-year answer because optimal durations are evolving. Rechecked that an FDA metastatic indication is not treated as proof of no possible future adjuvant research; the key concerns routine current care among offered choices.",
    },
  },
  {
    slug: "metastatic-remission-continuation", caseSlug: "metastatic-resection-followup",
    conceptId: conceptId("metastatic-remission-continuation"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Maintain effective imatinib after response and removal of metastatic gastric GIST rather than apply a finite-adjuvant stopping rule.",
    currentUpdate: "", task: "Which imatinib plan should be discussed for {patientName} after review of the outside gastric-GIST treatment records?",
    exhibit: exhibit([
      ["Original disease", "A gastric GIST and biopsy-confirmed liver metastasis both carried a KIT exon 11 alteration."],
      ["Treatment and operation", "Both sites regressed during imatinib. The residual gastric and liver lesions were then completely removed without rupture."],
      ["Current follow-up", "CT shows no visible tumor. She continues imatinib with good tolerance and no progression; she asks about stopping because the scans are clear."],
    ]),
    choices: [
      choice("continue", "Continue imatinib with tumor surveillance", true,
        "The original metastatic state remains relevant despite current radiographic clearance and resection. Effective imatinib is generally maintained rather than stopped using a localized-adjuvant completion rule.",
        "Use the original disease distribution rather than only the current scan.",
        "Unacceptable toxicity can require treatment modification; a genuinely localized resected tumor has a different finite-adjuvant discussion.", ["metastatic-continuation"]),
      choice("interrupt", "Interrupt imatinib with tumor surveillance", false,
        "A clear scan and complete metastasectomy do not establish that interrupting an effective systemic treatment is safe in metastatic GIST.",
        "Reclassify metastatic disease as a completed localized-adjuvant course after visible disease disappears.",
        "A finite course after resection of genuinely localized disease is a different setting; treatment-limiting toxicity also changes the discussion.", ["metastatic-continuation"]),
      choice("switch", "Switch to sunitinib with tumor surveillance", false,
        "Neither resistance nor intolerance is present to support a second-line switch. Absence of visible tumor is not a progression criterion.",
        "Confuse completion of surgery with completion of the current drug's role.",
        "Confirmed imatinib failure or intolerance can make a sunitinib plan appropriate.", ["metastatic-continuation", "progression-plan"]),
    ],
    explanation: "A current clear scan does not erase the original biopsy-confirmed metastatic state. Continue effective tolerated imatinib after response and metastatic resection, rather than apply a finite localized-adjuvant stopping rule or switch lines without failure.",
    supportingEvidenceClaimIds: ["metastatic-continuation", "progression-plan", "sunitinib-after-failure"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Both continuation and interruption share surveillance. The patient's request is a real decision stimulus without stating the correct preference. No fixed duration or always/never option permits elimination.",
      sameDecisionStageAndCategory: "Three current systemic-drug plans after metastatic resection.",
      reasoningSteps: ["Reconcile current radiographic clearance with the original biopsy-proven metastatic distribution.", "Apply metastatic suppression rather than localized-adjuvant completion logic to the ongoing drug plan."],
      closestError: "Stop imatinib after complete removal and clear imaging.", decidingObservation: "The original liver lesion was biopsy-confirmed metastatic GIST and the same drug remains effective and tolerated.",
      consequence: "Routine interruption can permit progression despite apparent remission.", residentDifficulty: "Moderate to hard PGY-2/3 prediction from treatment-intent and current-versus-historical disease-state confusion.",
      singleDefensibleBestAnswer: "Continue imatinib among the offered choices because the disease was metastatic and neither failure nor intolerance justifies changing therapy.",
      counterfactual: "Remove the original metastatic state and use a completed finite adjuvant course after localized resection: interruption may become appropriate. Add verified failure or intolerance: the next-line plan changes.",
      deletionTest: ["Original metastatic tissue provenance prevents a benign liver lesion from being misread as spread.", "Resection and clear CT make stopping genuinely tempting.", "Current response and tolerance distinguish a continuation decision from drug failure management."],
      sequenceReview: "Standalone; no preceding explanation gives the lifelong-versus-adjuvant distinction. No exact treatment duration is prescribed.",
      repairAndRecheck: "Removed a stop-after-three-years foil and used parallel surveillance plans. Re-solved using original disease distribution and ongoing benefit, with toxicity and true failure retained as boundaries.",
    },
  },
  {
    slug: "large-cell-distribution", caseSlug: "changed-gastric-lymphoma",
    conceptId: conceptId("large-cell-distribution"), previousConceptId: null,
    creationKind: "new", before: null, conceptType: "workup",
    objective: "Stage a newly documented gastric large-B-cell lymphoma component after adequate tissue classification.",
    currentUpdate: "", task: "Which investigation should the clinic arrange next for {patientName}'s newly sampled gastric lesion before lymphoma treatment selection?",
    exhibit: exhibit([
      ["Earlier disease", "Localized gastric MALT lymphoma regressed after H. pylori eradication."],
      ["New sampling", "Multiple intact biopsies of a new ulcerated mass contain broad confluent sheets of large atypical CD20-positive B cells replacing the mucosa. Expert hematopathology review confirms an aggressive large-B-cell component."],
      ["Current record", "There is no cytopenia or palpable peripheral node. A current nonserologic H. pylori test is negative under documented testing conditions."],
    ]),
    choices: [
      choice("pet", "Whole-body FDG PET/CT staging", true,
        "The adequate tissue establishes a new aggressive component rather than uncertain residual low-grade disease. Whole-body distribution now matters for systemic lymphoma treatment planning.",
        "Change the staging scope when the tissue-defined disease changes.",
        "An inadequate crushed sample would require diagnostic tissue before assuming the new histology; that frozen N3 case remains separate.", ["large-cell", "pet-staging", "uncertain-biopsy"], "timing.test.pet_ct"),
      choice("eus", "EUS gastric-wall and regional-node staging", false,
        "Local wall depth can contribute information, but does not provide the systemic distribution assessment needed for this adequately classified aggressive lymphoma.",
        "Continue the previous localized-MALT depth-staging pathway despite changed histology.",
        "A localized low-grade MALT question about wall invasion or regional disease can justify EUS.", ["large-cell", "pet-staging"], "timing.test.advanced_diagnostic"),
      choice("biopsy", "Repeat endoscopy with gastric mapping biopsies", false,
        "The intact multiple biopsies and expert assessment already establish the current large-cell component. Repeating gastric acquisition does not address the pending distribution question.",
        "Apply the uncertain-biopsy rescue rule when classification is already adequately supported.",
        "Scant crushed material unable to establish architecture would justify repeat tissue acquisition.", ["uncertain-biopsy", "pet-staging"], "timing.test.endoscopy_with_sampling"),
    ],
    explanation: "The present sample is adequate and differs from the prior low-grade process. After a large-B-cell component has been established, assess systemic distribution rather than repeat tissue simply because the prior disease was MALT. This case deliberately differs from the frozen inadequate-biopsy N3 version.",
    supportingEvidenceClaimIds: ["large-cell", "pet-staging", "uncertain-biopsy"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The known aggressive diagnosis is legitimate for a staging task; the learner still chooses systemic rather than local scope. All three are named investigations with waits. The neutral next-investigation task does not prefilter the repeat-biopsy competitor by asking specifically for staging. There is no instruction that PET is pending or available.",
      sameDecisionStageAndCategory: "Three next investigation plans; tissue adequacy decides whether further acquisition or distribution assessment is needed now.",
      reasoningSteps: ["Distinguish a fully represented large-cell component from scattered large cells or the old low-grade lesion.", "Use the new aggressive histology and adequate sample to select systemic distribution staging rather than local-depth or repeat-classification testing."],
      closestError: "Repeat endoscopy from a remembered uncertain-MALT-biopsy rule.", decidingObservation: "Multiple intact biopsies and expert-confirmed confluent large-cell architecture, not tiny crushed fragments.",
      consequence: "Persisting with the prior workup can delay systemic staging and suitable treatment.", residentDifficulty: "Moderate to hard PGY-2/3 prediction from the reversed tissue-adequacy boundary and old-versus-new disease phase.",
      singleDefensibleBestAnswer: "Whole-body PET/CT addresses the outstanding systemic distribution among the offered studies.",
      counterfactual: "Replace intact adequate tissue with crushed fragments of uncertain architecture: repeat endoscopic biopsies becomes the better next step. Retain indolent localized MALT and ask local depth: EUS can become appropriate.",
      deletionTest: ["Earlier MALT establishes why a resident might anchor on the wrong staging scope.", "Adequacy and architecture separate this case from the preserved N3 tissue-rescue question.", "Clinical and infection observations keep subsequent treatment interpretation within the intended non-eradication scenario."],
      sequenceReview: "First node; no PET result or treatment answer is visible. Feedback stops at distribution and does not name R-CHOP.",
      repairAndRecheck: "Rejected reuse of the frozen N3 question: that sample is inadequate and its key must remain repeat biopsy. Authored a distinct adequate-sample objective and re-solved local versus systemic staging.",
    },
  },
  {
    slug: "gastric-large-cell-treatment", caseSlug: "changed-gastric-lymphoma",
    conceptId: conceptId("gastric-large-cell-treatment"), previousConceptId: "concept.n3.gastric-lymphoma-new-large-cell-process",
    creationKind: "new", before: null, conceptType: "management",
    objective: "Select systemic lymphoma treatment for adequately classified gastric large-B-cell disease despite a stomach-limited distribution.",
    currentUpdate: "At the subsequent clinic review, the outside staging and pretreatment assessment have arrived.",
    task: "Which initial treatment should be discussed for {patientName}'s gastric large-B-cell lymphoma after the returned assessment?",
    exhibit: exhibit([
      ["PET/CT", "Uptake is confined to the gastric mass and contiguous perigastric nodes; no distant site is identified."],
      ["Pretreatment assessment", "She is independently active with normal cardiac systolic function and preserved major-organ function. There is no perforation, ongoing hemorrhage or obstruction."],
      ["Tissue and infection review", "The adequately sampled large-B-cell component is confirmed. H. pylori remains undetected."],
    ]),
    choices: [
      choice("rchop", "R-CHOP-based systemic chemotherapy", true,
        "The aggressive large-cell histology supports systemic lymphoma therapy even when staging remains gastric and contiguous. R-CHOP is an evidence-supported offered plan; exact cycles and any radiation addition belong to hematology review.",
        "Apply histology-specific treatment rather than equate localized distribution with local-only therapy.",
        "An indolent localized MALT process after eradication failure can favor involved-site radiation; an acute surgical complication changes immediate priorities.", ["dlbcl-treatment", "large-cell", "malt-response"]),
      choice("radiotherapy", "Involved-site gastric radiotherapy", false,
        "This transfers a localized indolent-MALT treatment pathway to an adequately established aggressive large-B-cell component in a fit patient.",
        "Choose the prior subtype's local treatment because the PET distribution remains limited.",
        "Symptomatic localized low-grade MALT after adequate eradication and reassessment can warrant involved-site radiotherapy.", ["dlbcl-treatment", "malt-response"]),
      choice("gastrectomy", "Gastrectomy with D2 lymphadenectomy", false,
        "The lymphoma histology and absence of a surgical emergency do not support routine epithelial-cancer resection as the initial lymphoma treatment.",
        "Let the organ and apparently resectable extent outweigh tumor type.",
        "Gastric adenocarcinoma with the appropriate stage or an uncontrolled surgical complication is a different operative indication.", ["dlbcl-treatment", "large-cell"]),
    ],
    explanation: "Stomach-limited distribution does not make an aggressive lymphoma an epithelial gastric-cancer operation or indolent MALT radiation case. In this fit patient without a surgical complication, R-CHOP-based systemic lymphoma treatment is the supported offered approach, with exact regimen details reviewed by hematology.",
    supportingEvidenceClaimIds: ["dlbcl-treatment", "large-cell", "malt-response"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "All alternatives are named active oncologic treatments of comparable specificity. No generic referral or uniquely comprehensive plan is keyed. The known diagnosis is necessary for this management question, not a diagnosis-answer disclosure.",
      sameDecisionStageAndCategory: "Three initial oncologic treatment approaches after tissue and staging are complete.",
      reasoningSteps: ["Interpret limited PET distribution within the established aggressive large-cell histology rather than as persistent indolent MALT.", "Use fitness and absence of an acute surgical complication to choose systemic lymphoma treatment over local radiation or routine gastrectomy."],
      closestError: "Give involved-site radiation because the disease remains local and arose after MALT.", decidingObservation: "Confirmed adequate large-cell component in a fit patient, despite only gastric/contiguous disease and without an operative emergency.",
      consequence: "Wrong histology-based care can undertreat aggressive lymphoma or impose unnecessary gastrectomy.", residentDifficulty: "Moderate PGY-2/3 prediction from competing local-versus-histology treatment rules; independent reviewer must assess the closeness of the radiation competitor.",
      singleDefensibleBestAnswer: "R-CHOP-based therapy is the evidence-supported offered initial approach for this fit, adequately classified early-stage aggressive lymphoma.",
      counterfactual: "Return the tissue to low-grade MALT with symptomatic progression after eradication: involved-site radiation becomes reasonable. Add uncontrolled perforation or hemorrhage: immediate surgical priorities change.",
      deletionTest: ["PET extent makes a local-treatment error credible rather than providing a decorative result.", "Tissue confirmation prevents an unsupported transformation diagnosis.", "Fitness and complication negatives establish the represented systemic-treatment phase; negative H. pylori avoids importing selected antibiotic-responsive series."],
      sequenceReview: "The prior feedback only establishes the need for systemic staging and names no regimen. Current limited distribution creates a new consequential treatment decision rather than repeating tissue acquisition.",
      repairAndRecheck: "Replaced the old vague hematology-review key with a named evidence-supported regimen and made tissue/staging adequate. Removed the unnecessary key-only word lymphoma from the option label. Removed exact cycles and radiation doses, retained the selected H. pylori-negative boundary and re-solved local treatment competitors.",
    },
  },
];

export const STOMACH_NEOPLASIA_CASE_SPECS: CaseSpec[] = [
  { slug: "diffuse-gastric-cancer", patientDisplayName: "Marina Cole", age: 61, sex: "Female", complaint: "Early satiety",
    presentation: "{patientName}, a 61-year-old woman, attends clinic to review outside gastric-cancer staging records.",
    nodes: ["occult-peritoneal-staging", "preinitial-positive-washings"] },
  { slug: "endoscopic-resection", patientDisplayName: "Celia Hart", age: 66, sex: "Female", complaint: "Biopsy follow-up",
    presentation: "{patientName}, a 66-year-old woman, attends clinic after endoscopic removal of a gastric lesion at another center.", nodes: ["endoscopic-lymphatic-risk"] },
  { slug: "postgastrectomy-records", patientDisplayName: "Nora Bell", age: 59, sex: "Female", complaint: "Cancer treatment review",
    presentation: "{patientName}, a 59-year-old woman, attends clinic after discharge following gastrectomy at another hospital.", nodes: ["upfront-d2-adjuvant"] },
  { slug: "splenic-extension", patientDisplayName: "Victor Hale", age: 64, sex: "Male", complaint: "Operation record review",
    presentation: "{patientName}, a 64-year-old man, attends clinic to review the extent of his outside gastric-cancer operation.", nodes: ["organ-specific-resection"] },
  { slug: "cardia-wall-mass", patientDisplayName: "Elaine Rivers", age: 56, sex: "Female", complaint: "Early satiety",
    presentation: "{patientName}, a 56-year-old woman, attends clinic to review an outside gastric-wall mass workup.",
    nodes: ["gastric-wall-tissue-route", "kit-exon11-neoadjuvant", "attenuation-versus-diameter"] },
  { slug: "archived-wall-specimens", patientDisplayName: "Leon Ward", age: 63, sex: "Male", complaint: "Gastric mass review",
    presentation: "{patientName}, a 63-year-old man, attends clinic to reconcile outside gastric-mass specimen records before treatment.", nodes: ["banked-tissue-provenance"] },
  { slug: "fundic-gist-resection", patientDisplayName: "Arthur Pike", age: 68, sex: "Male", complaint: "Gastric mass follow-up",
    presentation: "{patientName}, a 68-year-old man, attends clinic to review outside records of a gastric tumor and its later resection.",
    nodes: ["localized-gist-operation", "r1-without-rupture"] },
  { slug: "metastatic-molecular-records", patientDisplayName: "Edwin Brooks", age: 67, sex: "Male", complaint: "Biopsy results",
    presentation: "{patientName}, a 67-year-old man, attends clinic to review outside gastric and liver biopsy records.", nodes: ["metastatic-d842v"] },
  { slug: "resected-molecular-records", patientDisplayName: "Helen Moss", age: 62, sex: "Female", complaint: "Tumor follow-up",
    presentation: "{patientName}, a 62-year-old woman, attends clinic after an outside operation removed a gastric stromal tumor.", nodes: ["resected-d842v"] },
  { slug: "metastatic-resection-followup", patientDisplayName: "Sylvia Lane", age: 65, sex: "Female", complaint: "Medication review",
    presentation: "{patientName}, a 65-year-old woman, attends clinic to review ongoing treatment after outside gastric and liver tumor surgery.", nodes: ["metastatic-remission-continuation"] },
  { slug: "changed-gastric-lymphoma", patientDisplayName: "Lydia Grant", age: 69, sex: "Female", complaint: "New early satiety",
    presentation: "{patientName}, a 69-year-old woman, attends clinic to review outside biopsies after a new gastric lesion appeared during lymphoma follow-up.",
    nodes: ["large-cell-distribution", "gastric-large-cell-treatment"] },
];

export const STOMACH_NEOPLASIA_PROPOSALS = STOMACH_NEOPLASIA_SPECS.map(spec => ({
  ...STOMACH_NEOPLASIA_REVIEW, ...spec,
  questionVariantId: questionId(spec.slug), nodeId: nodeId(spec.slug), caseId: caseId(spec.caseSlug),
  conceptRelation: spec.conceptId.startsWith("concept.topic.") ? "new_meaning" as const : "reuse" as const,
  shuffleAnswers: true as const, pipelinePassed: false,
  choices: spec.choices.map(c => ({ ...c, id: `choice.topic.stomach-neoplasia.${spec.slug}.${c.id}` })),
}));
// Keep the first submission reproducible; review-response evidence is versioned below.
export const STOMACH_NEOPLASIA_SOURCES = ledger.sources.filter(s => s.contentVersion === STOMACH_NEOPLASIA_VERSION) as ClinicalSource[];
export const STOMACH_NEOPLASIA_CLAIMS = ledger.claims.filter(c => c.contentVersion === STOMACH_NEOPLASIA_VERSION) as EvidenceClaim[];
const sourceLabels = (ids: string[]) => {
  const sources = new Set(STOMACH_NEOPLASIA_CLAIMS.filter(c => ids.includes(c.id)).flatMap(c => c.sourceIds));
  return STOMACH_NEOPLASIA_SOURCES.filter(s => sources.has(s.id)).map(s => s.title);
};
const caseSpecFor = (slug: string) => STOMACH_NEOPLASIA_CASE_SPECS.find(c => c.slug === slug)!;

export const STOMACH_NEOPLASIA_QUESTIONS: QuestionVariant[] = STOMACH_NEOPLASIA_PROPOSALS.map(p => ({
  ...STOMACH_NEOPLASIA_REVIEW, id: p.questionVariantId, conceptId: p.conceptId,
  stem: p.task, exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect,
    rationale: c.rationale, distractorRationale: c.isCorrect ? null : c.rationale })),
  explanation: p.explanation, supportingEvidenceClaimIds: p.supportingEvidenceClaimIds,
}));
export const STOMACH_NEOPLASIA_CONCEPT_PROPOSALS = STOMACH_NEOPLASIA_PROPOSALS.map(p => ({
  ...STOMACH_NEOPLASIA_REVIEW, id: p.conceptId, displayName: p.objective, learningObjective: p.objective,
  conceptType: p.conceptType, earliestFacilityStage: 3, educationalTier: 2,
  previousConceptId: p.previousConceptId, conceptRelation: p.conceptRelation,
  identityDecision: p.conceptRelation === "reuse" ? "Unchanged scored meaning; new question version retains existing FSRS identity."
    : p.previousConceptId ? "Changed scored objective; retain prior meaning/history and create a separate new identity."
      : "Consequential unrepresented topic objective; new identity with no transferred history.",
  evidenceClaimIds: p.supportingEvidenceClaimIds,
}));
export const STOMACH_NEOPLASIA_CONCEPTS: TestedConcept[] = STOMACH_NEOPLASIA_CONCEPT_PROPOSALS.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const STOMACH_NEOPLASIA_NODES: DecisionNode[] = STOMACH_NEOPLASIA_PROPOSALS.map(p => {
  const final = caseSpecFor(p.caseSlug).nodes.at(-1) === p.slug;
  return decisionNodeSchema.parse({
    id: p.nodeId, questionVariantId: p.questionVariantId, primaryConceptId: p.conceptId,
    ...(p.currentUpdate ? { currentUpdate: p.currentUpdate } : {}), stem: p.task, exhibit: p.exhibit,
    answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale, serviceRequest: null })),
    shuffleAnswers: true, explanation: p.explanation, sourceLabels: sourceLabels(p.supportingEvidenceClaimIds), resultGateAfter: null,
    terminalDispositions: final ? p.choices.filter(c => !c.isCorrect).map(c => ({
      answerChoiceId: c.id, kind: "no_terminal_outcome",
      consequenceNarrative: "This authoring preview provides reasoning feedback and simulates no patient outcome.",
      clinicalRationale: c.rationale, sourceLabels: sourceLabels(c.evidenceClaimIds),
    })) : [],
  });
});
export const STOMACH_NEOPLASIA_CASES: SyntheticClinicalCase[] = STOMACH_NEOPLASIA_CASE_SPECS.map(c => {
  const demographics = { ageYears: c.age, sexLabel: c.sex };
  const nodes = c.nodes.map(slug => STOMACH_NEOPLASIA_NODES.find(n => n.id === nodeId(slug))!);
  return syntheticClinicalCaseSchema.parse({
    id: caseId(c.slug), displayName: c.complaint, patientPresentationVariantId: `presentation.topic.stomach-neoplasia.${c.slug}.v1`,
    patientDisplayName: c.patientDisplayName, prototypeDemographics: demographics, chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.stomach-neoplasia.${c.slug}.v1`, prototypeDemographics: demographics,
      chiefComplaint: c.complaint, presentation: c.presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 3,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(nodes.flatMap(n => n.sourceLabels))], decisionNodes: nodes,
    learningSummary: nodes.map(n => n.explanation).join(" "),
  });
});
export const STOMACH_NEOPLASIA_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = STOMACH_NEOPLASIA_PROPOSALS.map(p =>
  answerChoiceTimingRegistryEntrySchema.parse({
    caseId: p.caseId, nodeId: p.nodeId, questionVariantId: p.questionVariantId,
    classification: p.choices.some(c => c.timingProfileId) ? { kind: "test_choices",
      choices: p.choices.map(c => ({ choiceId: c.id, choiceLabel: c.label,
        timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" } }))
    } : { kind: "no_test" },
  }));
export const STOMACH_NEOPLASIA_ORDER_PROPOSALS = STOMACH_NEOPLASIA_TIMING_PROPOSALS.flatMap(entry =>
  entry.classification.kind === "test_choices" ? entry.classification.choices.filter(c => c.timing.kind === "test").map(c => ({
    ...STOMACH_NEOPLASIA_REVIEW, caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId,
    choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    executionScope: "clinic_plan_or_outside_record_review", serviceRequest: null, resultGateAfter: null,
  })) : []);
export const STOMACH_NEOPLASIA_SOURCE_LINKS = STOMACH_NEOPLASIA_SOURCES.map(s => ({
  ...STOMACH_NEOPLASIA_REVIEW, sourceId: s.id, label: s.title, attribution: s.completeCitation,
  licenseLabel: s.licenseLabel, licenseUrl: s.reuseStatus === "cc_by_4_0" ? "https://creativecommons.org/licenses/by/4.0/"
    : s.reuseStatus === "cc_by_nc_4_0_restricted" ? "https://creativecommons.org/licenses/by-nc/4.0/" : null,
  href: s.officialUrl!, target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
  changes: "Original factual synthesis and fictional application; no source prose, image, table or algorithm reproduced.",
}));
export const STOMACH_NEOPLASIA_AUTHOR_CHECKS = STOMACH_NEOPLASIA_PROPOSALS.map(p => ({
  ...STOMACH_NEOPLASIA_REVIEW, questionVariantId: p.questionVariantId, ...p.manualAuthorGate,
}));
export const STOMACH_NEOPLASIA_STATEMENT_MAPPINGS = STOMACH_NEOPLASIA_PROPOSALS.map(p => ({
  ...STOMACH_NEOPLASIA_REVIEW, questionVariantId: p.questionVariantId, caseId: p.caseId,
  constructedFields: ["presentation", "prototypeDemographics", "currentUpdate", "exhibit"],
  constructedBasis: "Original finite fictional patient observations and chronology. Measured values are constructed data, not invented clinical cutoffs, probabilities, weights or waiting durations.",
  assertions: [
    { field: "learningObjective", text: p.objective, claimIds: p.supportingEvidenceClaimIds },
    { field: "explanation", text: p.explanation, claimIds: p.supportingEvidenceClaimIds },
    ...p.choices.flatMap(c => [
      { field: `answerChoices[id=${c.id}].rationale`, text: c.rationale, claimIds: c.evidenceClaimIds },
      { field: `answerChoices[id=${c.id}].counterfactual`, text: c.counterfactual, claimIds: c.evidenceClaimIds },
    ]),
  ],
}));
export const STOMACH_NEOPLASIA_CASE_REVIEWS = STOMACH_NEOPLASIA_CASE_SPECS.map(c => ({
  ...STOMACH_NEOPLASIA_REVIEW, caseId: caseId(c.slug), educationalTier: 2, patientAcuity: "stable",
  historicalAcuity: "Outside diagnostic, operative or oncology records reviewed at clinic visits",
  facilityProgressionLevel: 3, clinicalSetting: "clinic", requiredCapabilityIds: [] as string[],
  composition: "Scripted sequential outside records; testing choices are plans, not executed orders. Later updates are revealed at their own node.",
  selectionConstraint: c.nodes.length > 1
    ? "Paired-only sidecar coverage; the existing all-concepts-unseen/due rule applies and a future-due companion can block selection."
    : "Standalone sidecar coverage.",
}));
export const STOMACH_NEOPLASIA_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1, publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic authoring preview, not clinically approved. Exact versions require independent review, manager acceptance and Melissa Rowland's clinical sign-off.",
  concepts: STOMACH_NEOPLASIA_CONCEPTS, cases: STOMACH_NEOPLASIA_CASES,
});
export const STOMACH_NEOPLASIA_MANIFEST = {
  ...STOMACH_NEOPLASIA_REVIEW, scope: "explicit_import_authoring_sidecar", reviewDisplay: "key shown first for review only.",
  caseCount: STOMACH_NEOPLASIA_CASES.length, nodeCount: STOMACH_NEOPLASIA_QUESTIONS.length,
  conceptCount: STOMACH_NEOPLASIA_CONCEPTS.length, pipelinePassed: false, managerAccepted: false,
  clinicalApproval: false, publicReleaseAuthorized: false,
};

/** One response to the independent 2026-11-11 review. V1 remains an archived submission. */
export const STOMACH_NEOPLASIA_RESPONSE_VERSION = "question-topic.stomach-neoplasia.2026-11-11.v2";
const responseReview = { ...STOMACH_NEOPLASIA_REVIEW, contentVersion: STOMACH_NEOPLASIA_RESPONSE_VERSION };
const originalSpec = (slug: string) => STOMACH_NEOPLASIA_SPECS.find(p => p.slug === slug)!;
const responseQuestionId = (slug: string) => `question.topic.stomach-neoplasia.${slug}.v2`;
const responseNodeId = (slug: string) => `node.topic.stomach-neoplasia.${slug}.v2`;
const responseCaseId = (slug: string) => `case.topic.stomach-neoplasia.${slug}.v2`;

export const STOMACH_NEOPLASIA_PASS_PRESERVED_SLUGS = [
  "occult-peritoneal-staging", "preinitial-positive-washings", "endoscopic-lymphatic-risk",
  "upfront-d2-adjuvant", "localized-gist-operation", "r1-without-rupture", "resected-d842v",
] as const;
const preservedSlugs = new Set<string>(STOMACH_NEOPLASIA_PASS_PRESERVED_SLUGS);

export const STOMACH_NEOPLASIA_REVISED_SPECS: NodeSpec[] = [
  {
    ...originalSpec("gastric-wall-tissue-route"), caseSlug: "wall-mass-tissue-review",
    currentUpdate: "Outside imaging and the first specimen report are available for clinic review.",
    task: "Which next tissue-acquisition procedure best fits {patientName}'s gastric-wall findings and the need for tumor classification and sequencing?",
    exhibit: exhibit([
      ["Endoscopy and submitted specimen", "The mucosal surface over the cardia bulge is smooth. The forceps specimen contains gastric glands and lamina propria; no muscular tissue is present."],
      ["EUS images", "An 8-cm mass is continuous with the fourth gastric-wall layer. Its enhancing solid portion lies against the luminal wall; the outer component contains a large fluid-filled region."],
      ["CT and surgical review", "The anterior skin-to-solid-tumor trajectory crosses the transverse colon. The proposed diagnostic wedge would cross the gastroesophageal junction and require gastric reconstruction. No distant lesion is identified."],
    ]),
    choices: [
      choice("eus-core", "EUS-guided core biopsy of the solid component", true,
        "The submitted mucosa does not represent the fourth-layer mass. EUS can target its solid component through the adjacent gastric wall and obtain tissue for classification and molecular testing without committing to a reconstructive resection.",
        "Match both the specimen compartment and the route to the solid target.",
        "An extraluminal solid target inaccessible to EUS with a safe percutaneous trajectory would favor an image-guided percutaneous core instead.", ["core-tissue", "eus-route", "tissue-provenance"], "timing.test.gist_eus_core_molecular"),
      choice("ct-core", "CT-guided core biopsy of the solid component", false,
        "Percutaneous core biopsy is a legitimate alternative for some GISTs, but the represented direct trajectory crosses colon while the solid target borders the gastric lumen. This anatomy favors EUS; percutaneous biopsy is not categorically prohibited.",
        "Choose a generally valid core technique without comparing the represented routes.",
        "A safely accessible extraluminal target beyond EUS reach would make a percutaneous core a reasonable choice.", ["core-tissue", "eus-route"], "timing.test.biopsy"),
      choice("wedge", "Laparoscopic wedge excision of the wall mass", false,
        "Excision would obtain diagnostic tissue but here entails gastroesophageal-junction reconstruction before the tumor type is known. Representative needle tissue can determine whether such an operation is appropriate.",
        "Treat a diagnostic excision as a low-cost substitute for representative sampling.",
        "A small readily resectable lesion, or a symptomatic lesion that cannot be sampled safely, may reasonably undergo excision in a specialist pathway.", ["core-tissue", "eus-route", "gist-excision"], "timing.test.general_diagnostic"),
    ],
    explanation: "The benign mucosal sample and the fourth-layer mass describe different compartments. After recognizing that mismatch, compare routes to solid tumor rather than repeat superficial sampling or use a cystic component. The represented luminal relationship, transcolonic percutaneous trajectory and reconstructive cost of excision favor EUS-guided core tissue. Archived tissue from a different specimen must not substitute merely because a report is attached to the referral.",
    supportingEvidenceClaimIds: ["core-tissue", "eus-route", "tissue-provenance", "gist-excision"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No report declares the sample inadequate or the lesion reachable. Raw specimen layers and route geometry must be compared with the target before choosing among three tissue procedures.",
      sameDecisionStageAndCategory: "All choices obtain representative tumor tissue now; none is a repeated unchanged forceps biopsy or an unrelated staging test.",
      reasoningSteps: ["Infer that glands and lamina propria do not classify a fourth-layer mass even though the surface biopsy is benign.", "Compare access to solid tumor and the cost of diagnostic excision; choose EUS core in this represented anatomy."],
      closestError: "CT-guided core is a credible technique but ignores the colon on the represented skin-to-solid-target trajectory.",
      decidingObservation: "Solid tumor borders the luminal wall, while colon lies on the direct percutaneous trajectory and a wedge crosses the gastroesophageal junction.",
      consequence: "Obtain classifying and sequenceable tumor tissue without an avoidable transcolonic approach or reconstructive diagnostic excision.",
      residentDifficulty: "Moderate after repair: compartment interpretation followed by access selection; not labeled hard merely because EUS is specialized.",
      singleDefensibleBestAnswer: "EUS core is the best offered route for these observations. No universal EUS-over-percutaneous rule or invented assay-adequacy threshold is asserted.",
      counterfactual: "With solid tumor beyond EUS reach and a safe skin trajectory, CT-guided core could become the preferred offered procedure.",
      deletionTest: ["Delete the specimen layers and the reason a benign report fails to classify the mass is lost.", "Delete route geometry and the EUS-versus-percutaneous preference is less discriminating; no prediction of treatment benefit is supplied."],
      sequenceReview: "Self-contained singleton; no prior explanation announces preoperative imatinib and no later genotype is exposed.",
      repairAndRecheck: "One review response removed feasibility language and the weak unchanged-forceps foil, retained neutral anatomy, and incorporated provenance as unscored feedback. Re-review remains required.",
    },
  },
  {
    ...originalSpec("kit-exon11-neoadjuvant"), caseSlug: "cardia-gist-treatment-review",
    currentUpdate: "The clinic reviews the outside core pathology and operative proposal before initial treatment.",
    exhibit: exhibit([
      ["Core pathology and sequencing", "Spindle-cell tumor with diffuse DOG1 and CD117 staining; sequencing identifies a KIT exon 11 deletion."],
      ["Operative anatomy", "The 8-cm mass encircles the cardia. The proposed margin-negative operation is total gastrectomy."],
      ["Clinical extent", "No metastatic disease, active bleeding or obstruction is present."],
    ]),
    manualAuthorGate: {
      ...originalSpec("kit-exon11-neoadjuvant").manualAuthorGate,
      coverTheKey: "The record gives cardia encirclement and the proposed operation without predicting shrinkage, organ preservation or a preferred treatment sequence. Genotype and operative morbidity must both inform the plan.",
      decidingObservation: "KIT exon 11 supplies drug sensitivity; cardia encirclement with proposed total gastrectomy supplies a consequential reason to consider treatment before surgery.",
      deletionTest: ["Without genotype, imatinib responsiveness is not established and empiric treatment is unsafe.", "Without the morbid operative anatomy, a readily resectable localized GIST could favor primary surgery; size alone does not dictate neoadjuvant therapy."],
      sequenceReview: "Self-contained singleton repeats pathology and extent; the prior tissue-acquisition item and its treatment-scaffolding feedback are absent.",
      repairAndRecheck: "One review response removed the explicit organ-preservation prediction and split the returned chain. The already defensible genotype-by-anatomy decision remains; independent re-review is pending.",
    },
  },
  {
    ...originalSpec("attenuation-versus-diameter"), caseSlug: "gist-response-record-review",
    currentUpdate: "The clinic reviews the first outside response scan during preoperative imatinib. No dose-limiting toxicity is reported.",
    task: "Which systemic-treatment plan best fits {patientName}'s first response assessment for gastric GIST?",
    exhibit: exhibit([
      ["Pretreatment tissue and plan", "Core biopsy showed DOG1-positive GIST with a KIT exon 11 deletion. The cardia location prompted preoperative imatinib before the proposed total gastrectomy."],
      ["Matched contrast CT measurements", "The same acquisition phase and lesion region were used. Maximum diameter changed from 8.0 to 10.8 cm; mean attenuation changed from 72 to 34 HU."],
      ["Other imaging observations", "No new enhancing intratumoral nodule or additional lesion is present. There is no internal high-attenuation blood product or peritumoral fluid."],
    ]),
    choices: [
      choice("continue", "Continue the current imatinib regimen", true,
        "A substantial fall in attenuation on comparable scans can represent GIST response despite increased size. The lack of a new enhancing nodule or additional lesion supports continuing while the specialist team follows the response, rather than declaring resistance from diameter alone.",
        "Interpret the discordant measurements before selecting a treatment line.",
        "New enhancing viable tumor or additional progressive sites would require reassessment for true progression rather than continuation on the basis of low mean density alone.", ["ct-response", "progression-plan"]),
      choice("escalate", "Escalate the current imatinib regimen", false,
        "Size has increased, but the density change is a competing treatment-effect signal. Escalation for presumed resistance should not follow a diameter-only progression call before integrated GIST response review.",
        "Apply a size-only solid-tumor progression rule to a targeted GIST response.",
        "Confirmed progression after adherence, interactions and imaging have been reviewed can make dose escalation a specialist option in appropriate disease.", ["ct-response", "progression-plan"]),
      choice("switch", "Replace imatinib with sunitinib", false,
        "A second-line drug presumes failure or intolerance. The supplied discordant scan does not establish failure, and dose-limiting toxicity is absent.",
        "Treat any diameter increase as sufficient evidence to abandon first-line therapy.",
        "Confirmed imatinib resistance or relevant intolerance would make second-line treatment a different decision.", ["ct-response", "progression-plan", "sunitinib-after-failure"]),
    ],
    explanation: "The larger diameter cannot be ignored, but it cannot be interpreted alone. On matched contrast imaging, the marked attenuation decrease without a new enhancing nodule can reflect imatinib effect even as a GIST enlarges. Continue the current regimen with specialist response review rather than escalate or switch on size alone. This is not a claim that every enlarging low-density lesion is responding.",
    supportingEvidenceClaimIds: ["ct-response", "progression-plan", "sunitinib-after-failure", "genotype-sensitive", "neoadjuvant"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Neither improved symptoms nor a qualitative radiology response conclusion is supplied. A large diameter increase competes with the raw matched-protocol attenuation decrease.",
      sameDecisionStageAndCategory: "Three current systemic-treatment plans compare continuation, dose escalation and line change after the same first response assessment.",
      reasoningSteps: ["Interpret increased diameter together with lower attenuation and absence of new enhancing tumor on comparable scans.", "Distinguish possible targeted-treatment response from established failure before deciding whether to continue or change treatment."],
      closestError: "Escalating imatinib after reading only the increased diameter is the nearest credible error; the size change is no longer a small subthreshold distraction.",
      decidingObservation: "Attenuation falls from 72 to 34 HU using the same acquisition phase and lesion region, without a new enhancing nodule or additional lesion.",
      consequence: "Avoid prematurely abandoning or escalating effective treatment on a size-only progression interpretation.",
      residentDifficulty: "Moderate-to-hard intended response interpretation, pending independent review; no numeric response cutoff is invented or scored.",
      singleDefensibleBestAnswer: "Continue is the best offered drug plan while expert response assessment proceeds. An additional scan or PET is not forced against drug decisions, and no unsupported universal response diagnosis is made.",
      counterfactual: "A new enhancing intratumoral nodule or additional progressive sites would defeat the simple response interpretation and prompt resistance evaluation.",
      deletionTest: ["Hide attenuation and the large diameter increase makes progression and escalation credible; density is necessary to the scored choice.", "Remove symptom improvement entirely: the item still depends on imaging interpretation, not redundant clinical-success language."],
      sequenceReview: "Self-contained singleton supplies tumor type, genotype and current treatment; earlier feedback cannot supply the attenuation interpretation.",
      repairAndRecheck: "One response replaced the 7.5% size change with a consequential constructed enlargement, removed symptom-success and qualitative-density cues, and retained matched acquisition plus progression checks. Re-review is pending.",
    },
  },
  {
    ...originalSpec("metastatic-remission-continuation"), caseSlug: "metastatic-gist-maintenance-review",
    task: "Which ongoing systemic-treatment plan best fits {patientName}'s gastric-GIST treatment records?",
    choices: [
      choice("continue", "Continue imatinib during scan-negative follow-up", true,
        "The liver biopsy established metastatic GIST before treatment. Resection and a clear current scan do not convert ongoing effective metastatic therapy into a finite adjuvant course; continue while effective and tolerated.",
        "Use the original disease state as well as the current scan.",
        "A completely resected localized primary without metastasis would instead raise a risk- and genotype-dependent finite adjuvant decision.", ["metastatic-continuation"]),
      choice("finite", "Set an adjuvant-course endpoint and then stop imatinib", false,
        "This applies a finite localized-adjuvant framework to previously biopsy-proven metastatic disease. The original liver metastasis remains consequential after all visible sites have been removed.",
        "Reclassify postoperative absence of visible tumor as localized adjuvant treatment.",
        "If the original disease had been confined to a completely resected primary, a finite evidence-supported adjuvant course could be appropriate for a sensitive high-risk tumor.", ["metastatic-continuation", "gist-risk-features", "genotype-sensitive"]),
      choice("interrupt", "Stop imatinib now and restart at measurable recurrence", false,
        "A monitored stop-and-restart policy is not equivalent to maintaining effective treatment in metastatic GIST. A current clear scan does not establish that interruption is safe.",
        "Treat surveillance and later re-treatment as substitutes for suppressing known metastatic disease continuously.",
        "Relevant intolerance would require a toxicity-driven treatment reassessment; it is absent here and is not a scan-clearance stopping rule.", ["metastatic-continuation", "progression-plan"]),
    ],
    explanation: "Interpret the pretreatment liver biopsy before assigning the current treatment phase. This remains previously metastatic GIST despite complete resection and clear scans. Effective, tolerated imatinib continues; neither a finite localized-adjuvant endpoint nor scan-triggered stop-and-restart follows from radiographic clearance.",
    supportingEvidenceClaimIds: ["metastatic-continuation", "gist-risk-features", "genotype-sensitive", "progression-plan"].map(claimId),
    manualAuthorGate: {
      ...originalSpec("metastatic-remission-continuation").manualAuthorGate,
      coverTheKey: "The neutral task does not name imatinib. All three choices are imatinib-duration policies; tolerability no longer disposes of a mismatched line-switch option.",
      sameDecisionStageAndCategory: "Three ongoing-treatment policies differ in continuation, a finite adjuvant endpoint, or interruption until measurable recurrence.",
      closestError: "Applying a finite adjuvant endpoint after complete metastasectomy is the nearest error, distinct from stopping immediately because the present scan is clear.",
      counterfactual: "Without an original metastatic site, completely resected localized high-risk sensitive GIST could warrant a finite adjuvant course; intolerance would require a different reassessment rather than a clearance-based stop.",
      sequenceReview: "Self-contained singleton preserves original biopsy-proven metastasis, operative clearance and tolerability; no prerequisite case supplies its disease-phase conclusion.",
      repairAndRecheck: "One response neutralized the task and replaced the disposable sunitinib foil with a finite-adjuvant policy. No arbitrary stopping interval or new duration rule was introduced; re-review is pending.",
    },
  },
  {
    ...originalSpec("large-cell-distribution"), caseSlug: "discordant-gastric-lymphoma-review",
    conceptId: conceptId("lymphoma-discordant-site-biopsy"), previousConceptId: originalSpec("large-cell-distribution").conceptId,
    before: [questionId("large-cell-distribution")], creationKind: "new", conceptType: "workup",
    objective: "Select a representative biopsy site when a new gastric-region lesion behaves differently from previously sampled MALT lymphoma.",
    currentUpdate: "The clinic reviews new outside imaging alongside a recent endoscopy report.",
    task: "Which tissue-acquisition plan should be arranged next for {patientName} before choosing treatment for the new gastric-region disease?",
    exhibit: exhibit([
      ["History and recent endoscopy", "Gastric MALT lymphoma previously regressed after H. pylori eradication. New forceps samples from the old antral scar show small CD20-positive lymphocytes and lymphoepithelial lesions, without sheets of large cells."],
      ["Interval CT and laboratory results", "A separate posterior gastric/perigastric mass has enlarged from 1.8 to 5.2 cm across the two recent scans. LDH is now 720 U/L (laboratory upper limit 250 U/L); the blood counts are normal."],
      ["PET/CT and endoscopic location map", "The posterior mass has much greater FDG uptake than the old antral scar. It lies outside the mucosal biopsy sites and abuts the posterior gastric wall. No peripheral node is available for sampling."],
    ]),
    choices: [
      choice("new-mass", "EUS-guided core biopsy of the posterior mass", true,
        "The recent small-cell mucosal sample represents the old site, not the rapidly enlarging metabolically discordant mass. Obtain representative tissue from the new lesion to evaluate a changed lymphoma component before selecting treatment; FDG uptake alone does not prove transformation.",
        "Reconcile which site was sampled with which site changed.",
        "If representative tissue from the changing mass had already established its histology, repeating acquisition would not answer a remaining staging question.", ["lymphoma-transformation-suspicion", "lymphoma-targeted-biopsy", "core-tissue"], "timing.test.biopsy"),
      choice("old-scar", "Repeat forceps biopsies of the antral scar", false,
        "The scar biopsy can describe residual MALT at that site but does not classify the separate mass. Repeating the same old-site acquisition leaves the consequential spatial and biologic discrepancy unresolved.",
        "Let a recent low-grade gastric result stand for all current gastric-region disease.",
        "If the uncertain progressive lesion were mucosal and located in that scar, directed repeat endoscopic sampling could be representative.", ["lymphoma-transformation-suspicion", "lymphoma-targeted-biopsy", "uncertain-biopsy"], "timing.test.endoscopy_with_sampling"),
      choice("marrow", "Iliac-crest marrow aspirate and trephine biopsy", false,
        "Marrow assessment may answer selected staging questions, but it does not sample the lesion responsible for the current discrepancy. Normal blood counts do not prove absence of marrow disease; the immediate need is the new mass's histology.",
        "Substitute another lymphoma staging specimen for tissue from the changing focal lesion.",
        "A specific marrow or cytopenia question could justify marrow sampling, but would not replace biopsy of a discordant mass suspected of a changed component.", ["lymphoma-targeted-biopsy", "pet-staging"] , "timing.test.bone_marrow"),
    ],
    explanation: "A low-grade result from the old mucosal scar cannot classify a different rapidly enlarging, more FDG-avid mass. The clinical and imaging discrepancy raises concern for a changed component, but requires histologic confirmation. Use the PET/location map to obtain representative tissue from that mass rather than repeat the old scar or substitute a staging specimen.",
    supportingEvidenceClaimIds: ["lymphoma-transformation-suspicion", "lymphoma-targeted-biopsy", "core-tissue", "uncertain-biopsy", "pet-staging"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No expert report supplies transformation or declares current tissue inadequate. The learner must compare the actual sampled site, small-cell findings and separate changing lesion.",
      sameDecisionStageAndCategory: "All three options are specific tissue-acquisition plans before treatment selection; no drug or unrelated local staging procedure is a category outlier.",
      reasoningSteps: ["Interpret discordant growth, LDH and FDG avidity despite small-cell histology from a different gastric site as an unresolved possible changed component.", "Choose tissue from the changing mass rather than repeat a nonrepresentative old site or substitute marrow staging."],
      closestError: "Repeat old-scar endoscopy is a credible gastric-lymphoma acquisition habit but samples the already described low-grade compartment again.",
      decidingObservation: "The rapidly enlarging FDG-avid posterior mass lies outside the antral mucosal biopsy sites; no specimen yet classifies that mass.",
      consequence: "Avoid selecting a low-grade or aggressive treatment pathway without representative confirmation of the new lesion.",
      residentDifficulty: "Moderate-to-hard intended spatial/specimen reasoning, pending review. PET avidity is not treated as a diagnostic threshold or proof of transformation.",
      singleDefensibleBestAnswer: "The mass's location against the gastric wall supports targeted EUS core as the best offered representative acquisition; the other specimens do not resolve its histology.",
      counterfactual: "A changing mucosal lesion actually located within the sampled antral scar would support directed repeat endoscopic biopsy there; already established mass histology would move the task to staging or treatment.",
      deletionTest: ["Delete the sampled-site map and repeat scar biopsy may look equally representative, making the item unfair.", "Delete the growth/LDH/avidity discrepancy and the urgency of obtaining new mass histology is weakened; no cutoff is needed."],
      sequenceReview: "Standalone new meaning: the previous PET-staging node is archived, not a prerequisite. No lymphoma-treatment explanation or diagnosis is revealed first.",
      repairAndRecheck: "One response replaced direct PET recall with an unresolved site-specific tissue problem, removed vague H. pylori wording and the frozen-version sentence, and created a distinct concept identity. Re-review is pending.",
    },
  },
  {
    ...originalSpec("gastric-large-cell-treatment"), caseSlug: "gastric-lymphoma-cardiac-review",
    conceptId: conceptId("gastric-large-cell-cardiac-regimen"), previousConceptId: originalSpec("gastric-large-cell-treatment").conceptId,
    before: [questionId("gastric-large-cell-treatment")], creationKind: "new", conceptType: "management",
    objective: "Distinguish an anthracycline-free lymphoma regimen from simple dose attenuation when cardiac dysfunction constrains treatment of gastric large-B-cell lymphoma.",
    currentUpdate: "The clinic reviews outside hematopathology and pretreatment assessment for a hematology planning visit.",
    task: "Which initial systemic regimen best fits {patientName}'s gastric diffuse large-B-cell lymphoma and pretreatment findings among the options offered?",
    exhibit: exhibit([
      ["Lymphoma record", "Gastric biopsies establish CD20-positive diffuse large-B-cell lymphoma. Systemic treatment with curative intent is planned. There is no perforation, ongoing hemorrhage or obstruction."],
      ["Functional assessment", "She is independently active, walks without assistance and has preserved renal and hepatic function. There is no general frailty limiting combination treatment."],
      ["Cardiac assessment", "Longstanding ischemic cardiomyopathy predates the lymphoma. Repeat echocardiography after cardiac optimization shows left ventricular ejection fraction 30%; previous examinations show similar values."],
    ]),
    choices: [
      choice("rceop", "R-CEOP combination immunochemotherapy", true,
        "Persistent marked systolic dysfunction makes doxorubicin exposure the limiting issue despite preserved general function. R-CEOP substitutes etoposide for doxorubicin and is a guideline-supported offered option for anthracycline-ineligible large-B-cell lymphoma, with hematology and cardio-oncology review.",
        "Distinguish organ-specific contraindication from a need to reduce every drug because of frailty.",
        "With preserved cardiac function and no anthracycline contraindication, an anthracycline-containing first-line regimen could be preferred; R-CEOP is not claimed superior for all patients.", ["lymphoma-cardiac-anthracycline", "lymphoma-rceop", "dlbcl-treatment"]),
      choice("rchop", "R-CHOP combination immunochemotherapy", false,
        "R-CHOP includes doxorubicin. Otherwise good function does not remove the persistent severe systolic dysfunction that changes the appropriate drug backbone.",
        "Apply the usual aggressive-lymphoma regimen based on performance status while overlooking organ-specific cardiac risk.",
        "Preserved systolic function without a relevant anthracycline contraindication would make R-CHOP a defensible first-line option in an appropriate disease setting.", ["lymphoma-cardiac-anthracycline", "lymphoma-rceop", "dlbcl-treatment"]),
      choice("rmini", "R-mini-CHOP combination immunochemotherapy", false,
        "Dose-attenuated R-mini-CHOP retains doxorubicin; it does not remove the drug constrained by this cardiac assessment. The record supports a cardiac-specific substitution rather than treating an independently active 69-year-old as generally frail.",
        "Use dose attenuation as a universal solution to organ-specific anthracycline ineligibility.",
        "A suitable very elderly patient without this cardiac constraint may be considered for attenuated R-mini-CHOP; that different fitness problem is not represented here.", ["lymphoma-cardiac-anthracycline", "lymphoma-rceop", "lymphoma-dose-attenuation"]),
    ],
    explanation: "The biopsy establishes the lymphoma family, but the regimen comparison turns on pretreatment fitness. Persistent severe systolic dysfunction changes whether doxorubicin belongs in the regimen; preserved independence does not cancel that constraint. R-CEOP is the supported offered anthracycline-free alternative. Simply reducing CHOP doses still exposes her to doxorubicin. Other specialist alternatives exist; this item does not rank them or prescribe doses or cycles.",
    supportingEvidenceClaimIds: ["lymphoma-cardiac-anthracycline", "lymphoma-rceop", "lymphoma-dose-attenuation", "dlbcl-treatment"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "All options treat aggressive B-cell lymphoma at the same phase. The exhibit reports raw repeat LVEF and functional observations without declaring anthracycline ineligibility.",
      sameDecisionStageAndCategory: "Three named initial combination immunochemotherapy regimens; no MALT-only radiation or epithelial-cancer operation is used as an easy disease-category foil.",
      reasoningSteps: ["Distinguish persistent severe organ-specific systolic dysfunction from age alone or general frailty in an independently active patient.", "Choose a doxorubicin-free backbone rather than the usual or dose-attenuated doxorubicin-containing CHOP regimen."],
      closestError: "R-mini-CHOP is a credible attempt to accommodate fitness but retains the very anthracycline constrained by the repeated cardiac assessment.",
      decidingObservation: "Repeated LVEF is 30% despite cardiac optimization, while general independence and renal/hepatic function remain preserved.",
      consequence: "Discuss a curative-intent lymphoma plan without treating dose attenuation as removal of anthracycline cardiac exposure.",
      residentDifficulty: "Moderate intended regimen discrimination with a meaningful fitness modifier, pending independent review; no unsupported superiority claim or dose arithmetic.",
      singleDefensibleBestAnswer: "R-CEOP is supported among these choices. Other accepted anthracycline-ineligible regimens are deliberately not offered as competing equally defensible keys.",
      counterfactual: "Preserved cardiac function would restore an anthracycline-containing first-line option; general age-related vulnerability without cardiac ineligibility would raise a different attenuation question.",
      deletionTest: ["Hide the cardiac findings and R-CHOP becomes a defensible default; the new modifier changes the scored regimen.", "Delete diagnosis and treatment intent and the regimen comparison lacks necessary context; no unnecessary PET result is used to pretend to add a step."],
      sequenceReview: "Self-contained singleton repeats diagnosis, treatment intent and complication screen. No preceding large-cell explanation rehearses the cardiac discriminator.",
      repairAndRecheck: "One response replaced cross-disease foils with lymphoma regimens and a source-verified cardiac constraint, removed unnecessary infection/stage detail, and created a distinct concept meaning. Re-review remains required.",
    },
  },
];

export const STOMACH_NEOPLASIA_PARKED = [
  { slug: "organ-specific-resection", status: "parked" as const, repairAttempts: 1,
    attemptedRepair: "Removed the internal held-interface sentence in the proposed feedback and tested whether the remaining direct-invasion/organ-plane facts could support distinct consequential inferences.",
    reason: "The supported fair comparison still repeats the same remove-involved/preserve-uninvolved rule. A harder treated inseparable-interface question would borrow a held unsupported teaching point. No additional scored basic exception is requested; retain the original only as archived, unshipped work.",
    cleanedFeedback: "Direct splenic invasion supports en-bloc removal of the involved spleen. An uninvolved pancreatic plane does not justify adding pancreatic resection solely to extend lymph-node dissection.",
    claimIds: ["direct-organ-invasion", "pancreatic-preservation"].map(claimId) },
  { slug: "banked-tissue-provenance", status: "parked" as const, repairAttempts: 1,
    attemptedRepair: "Reframed the attachment as incomplete rather than conflicting and removed the lab-certified B-letter matching task; considered whether raw provenance could support a second consequential scored decision without inventing assay thresholds.",
    reason: "A defensible standalone repair remained low-yield specimen matching or required unsupported laboratory adequacy rules. The useful provenance principle is incorporated as unscored tissue-route feedback; no scored archive-accession item remains current.",
    cleanedFeedback: "An incomplete referral attachment need not contradict the archive. Confirm the sampled lesion and specimen contents before treating an attached report as representative tumor tissue.",
    claimIds: ["tissue-provenance", "banked-core"].map(claimId) },
  { slug: "metastatic-d842v", status: "parked" as const, repairAttempts: 1,
    attemptedRepair: "Tested adding a consequential disease-setting comparison; that comparison duplicated the preserved resected-D842V PASS item. Retained the accurate molecular fact in the ledger without creating another genotype-to-drug scored item.",
    reason: "The original key was fair but focused recall. Supported setting-based hardening is already tested by the exact preserved resected-D842V item; consolidation avoids a redundant standalone node and does not alter the PASS wording.",
    cleanedFeedback: "For adult unresectable or metastatic GIST with PDGFRA D842V, avapritinib has an established role; that setting does not establish an adjuvant indication after complete resection.",
    claimIds: ["d842v-treatment", "d842v-adjuvant"].map(claimId) },
];

export const STOMACH_NEOPLASIA_REVISED_PROPOSALS = STOMACH_NEOPLASIA_REVISED_SPECS.map(spec => ({
  ...responseReview, ...spec, questionVariantId: responseQuestionId(spec.slug), nodeId: responseNodeId(spec.slug),
  caseId: responseCaseId(spec.caseSlug), previousQuestionVariantId: questionId(spec.slug),
  before: [questionId(spec.slug)],
  creationKind: ["large-cell-distribution", "gastric-large-cell-treatment"].includes(spec.slug) ? "new" as const : "Rewrite" as const,
  status: "revised" as const, repairAttempts: 1, independentReview: "pending" as const, pipelinePassed: false,
  shuffleAnswers: true as const,
  choices: spec.choices.map(c => ({ ...c, id: `choice.topic.stomach-neoplasia.${spec.slug}.v2.${c.id}` })),
}));
const allResponseSources = ledger.sources as ClinicalSource[];
const allResponseClaims = ledger.claims as EvidenceClaim[];
const responseSourceLabels = (ids: string[]) => {
  const sources = new Set(allResponseClaims.filter(c => ids.includes(c.id)).flatMap(c => c.sourceIds));
  return allResponseSources.filter(s => sources.has(s.id)).map(s => s.title);
};
export const STOMACH_NEOPLASIA_REVISED_QUESTIONS: QuestionVariant[] = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => ({
  ...responseReview, id: p.questionVariantId, conceptId: p.conceptId, stem: p.task, exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect,
    rationale: c.rationale, distractorRationale: c.isCorrect ? null : c.rationale })),
  explanation: p.explanation, supportingEvidenceClaimIds: p.supportingEvidenceClaimIds,
}));
export const STOMACH_NEOPLASIA_REVISED_NODES: DecisionNode[] = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => decisionNodeSchema.parse({
  id: p.nodeId, questionVariantId: p.questionVariantId, primaryConceptId: p.conceptId,
  ...(p.currentUpdate ? { currentUpdate: p.currentUpdate } : {}), stem: p.task, exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale, serviceRequest: null })),
  shuffleAnswers: true, explanation: p.explanation, sourceLabels: responseSourceLabels(p.supportingEvidenceClaimIds), resultGateAfter: null,
  terminalDispositions: p.choices.filter(c => !c.isCorrect).map(c => ({ answerChoiceId: c.id, kind: "no_terminal_outcome",
    consequenceNarrative: "This authoring preview provides reasoning feedback and simulates no patient outcome.",
    clinicalRationale: c.rationale, sourceLabels: responseSourceLabels(c.evidenceClaimIds) })),
}));
export const STOMACH_NEOPLASIA_REVISED_CASES: SyntheticClinicalCase[] = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => {
  const originalCase = caseSpecFor(originalSpec(p.slug).caseSlug);
  const node = STOMACH_NEOPLASIA_REVISED_NODES.find(n => n.id === p.nodeId)!;
  const demographics = { ageYears: originalCase.age, sexLabel: originalCase.sex };
  const presentation = `{patientName}, a ${originalCase.age}-year-old ${originalCase.sex === "Female" ? "woman" : "man"}, attends clinic to review outside records of ${p.slug === "gastric-large-cell-treatment" ? "gastric lymphoma and pretreatment cardiac assessment" : p.slug === "large-cell-distribution" ? "a new gastric-region mass during lymphoma follow-up" : "a gastric-wall tumor and its current treatment planning"}.`;
  return syntheticClinicalCaseSchema.parse({
    id: p.caseId, displayName: originalCase.complaint, patientPresentationVariantId: `presentation.topic.stomach-neoplasia.${p.caseSlug}.v2`,
    patientDisplayName: originalCase.patientDisplayName, prototypeDemographics: demographics,
    chiefComplaint: originalCase.complaint, presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.stomach-neoplasia.${p.caseSlug}.v2`, prototypeDemographics: demographics,
      chiefComplaint: originalCase.complaint, presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 3, requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic", sourceLabels: node.sourceLabels, decisionNodes: [node], learningSummary: node.explanation,
  });
});
export const STOMACH_NEOPLASIA_RESPONSE_STATUS = [
  ...STOMACH_NEOPLASIA_PROPOSALS.filter(p => preservedSlugs.has(p.slug)).map(p => ({
    slug: p.slug, questionVariantId: p.questionVariantId, nodeId: p.nodeId, caseId: p.caseId,
    status: "pass-preserved" as const, repairAttempts: 0, independentReview: "PASS" as const })),
  ...STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => ({ slug: p.slug, questionVariantId: p.questionVariantId,
    previousQuestionVariantId: p.previousQuestionVariantId, nodeId: p.nodeId, caseId: p.caseId,
    status: p.status, repairAttempts: p.repairAttempts, independentReview: p.independentReview })),
  ...STOMACH_NEOPLASIA_PARKED.map(p => ({ ...p, questionVariantId: questionId(p.slug), nodeId: nodeId(p.slug),
    caseId: caseId(originalSpec(p.slug).caseSlug), independentReview: "REVISE; not current" as const })),
];
export const STOMACH_NEOPLASIA_CURRENT_QUESTIONS = [
  ...STOMACH_NEOPLASIA_QUESTIONS.filter(q => STOMACH_NEOPLASIA_RESPONSE_STATUS.some(s => s.status === "pass-preserved" && s.questionVariantId === q.id)),
  ...STOMACH_NEOPLASIA_REVISED_QUESTIONS,
];
export const STOMACH_NEOPLASIA_CURRENT_CASES = [
  ...STOMACH_NEOPLASIA_CASES.filter(c => c.decisionNodes.every(n => STOMACH_NEOPLASIA_RESPONSE_STATUS.some(s => s.status === "pass-preserved" && s.nodeId === n.id))),
  ...STOMACH_NEOPLASIA_REVISED_CASES,
];
export const STOMACH_NEOPLASIA_REVISED_CONCEPT_PROPOSALS = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => ({
  ...responseReview, id: p.conceptId, displayName: p.objective, learningObjective: p.objective, conceptType: p.conceptType,
  earliestFacilityStage: 3, educationalTier: 2, previousConceptId: p.previousConceptId,
  identityDecision: ["large-cell-distribution", "gastric-large-cell-treatment"].includes(p.slug)
    ? "Changed scored meaning; new identity preserves the previous concept and its FSRS history without transfer."
    : "Same scored meaning with revised wording and new question/node/case versions; preserve concept history.",
  evidenceClaimIds: p.supportingEvidenceClaimIds,
}));
export const STOMACH_NEOPLASIA_CURRENT_CONCEPTS: TestedConcept[] = [
  ...STOMACH_NEOPLASIA_CONCEPTS.filter(c => STOMACH_NEOPLASIA_CURRENT_QUESTIONS.some(q => q.conceptId === c.id)),
  ...STOMACH_NEOPLASIA_REVISED_CONCEPT_PROPOSALS.filter(c => !STOMACH_NEOPLASIA_CONCEPTS.some(old => old.id === c.id))
    .map(c => testedConceptSchema.parse({ id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
      conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage })),
];
export const STOMACH_NEOPLASIA_REVISED_TIMING: AnswerChoiceTimingRegistryEntry[] = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p =>
  answerChoiceTimingRegistryEntrySchema.parse({ caseId: p.caseId, nodeId: p.nodeId, questionVariantId: p.questionVariantId,
    classification: p.choices.some(c => c.timingProfileId) ? { kind: "test_choices", choices: p.choices.map(c => ({
      choiceId: c.id, choiceLabel: c.label, timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" },
    })) } : { kind: "no_test" } }));
export const STOMACH_NEOPLASIA_CURRENT_TIMING = [
  ...STOMACH_NEOPLASIA_TIMING_PROPOSALS.filter(e => STOMACH_NEOPLASIA_CURRENT_QUESTIONS.some(q => q.id === e.questionVariantId)),
  ...STOMACH_NEOPLASIA_REVISED_TIMING,
];
export const STOMACH_NEOPLASIA_REVISED_ORDERS = STOMACH_NEOPLASIA_REVISED_TIMING.flatMap(e =>
  e.classification.kind === "test_choices" ? e.classification.choices.filter(c => c.timing.kind === "test").map(c => ({
    ...responseReview, caseId: e.caseId, nodeId: e.nodeId, questionVariantId: e.questionVariantId, choiceId: c.choiceId,
    choiceLabel: c.choiceLabel, timing: c.timing, disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    executionScope: "clinic_plan_or_outside_record_review", serviceRequest: null, resultGateAfter: null,
  })) : []);
export const STOMACH_NEOPLASIA_CURRENT_ORDERS = [
  ...STOMACH_NEOPLASIA_ORDER_PROPOSALS.filter(e => STOMACH_NEOPLASIA_CURRENT_QUESTIONS.some(q => q.id === e.questionVariantId)),
  ...STOMACH_NEOPLASIA_REVISED_ORDERS,
];
export const STOMACH_NEOPLASIA_REVISED_AUTHOR_CHECKS = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => ({
  ...responseReview, questionVariantId: p.questionVariantId, ...p.manualAuthorGate,
}));
export const STOMACH_NEOPLASIA_REVISED_CASE_REVIEWS = STOMACH_NEOPLASIA_REVISED_CASES.map(c => ({
  ...responseReview, caseId: c.id, educationalTier: 2, patientAcuity: "stable",
  historicalAcuity: "Outside diagnostic, surgical or hematology records reviewed in clinic",
  facilityProgressionLevel: 3, clinicalSetting: "clinic", requiredCapabilityIds: [] as string[],
  composition: "One self-contained scored review candidate; no result execution or simulated acute-care facility.",
  selectionConstraint: "Standalone candidate pending independent re-review; no future-due companion can block selection.",
}));
export const STOMACH_NEOPLASIA_CURRENT_SOURCE_LINKS = [
  ...STOMACH_NEOPLASIA_SOURCE_LINKS,
  ...allResponseSources.filter(s => s.contentVersion === STOMACH_NEOPLASIA_RESPONSE_VERSION).map(s => ({
    ...responseReview, sourceId: s.id, label: s.title, attribution: s.completeCitation,
    licenseLabel: s.licenseLabel, licenseUrl: s.reuseStatus === "cc_by_4_0" ? "https://creativecommons.org/licenses/by/4.0/"
      : s.id.endsWith("eha-lbcl-2025") ? "https://creativecommons.org/licenses/by-nc-nd/4.0/" : null,
    href: s.officialUrl!, target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
    changes: "Underlying facts independently synthesized; no source expression, adapted table, figure or algorithm retained.",
  })),
];
export const STOMACH_NEOPLASIA_REVISED_STATEMENT_MAPPINGS = STOMACH_NEOPLASIA_REVISED_PROPOSALS.map(p => ({
  ...responseReview, questionVariantId: p.questionVariantId, caseId: p.caseId,
  constructedFields: ["presentation", "prototypeDemographics", "currentUpdate", "exhibit"],
  constructedBasis: "Original fictional measurements, anatomy and chronology; not empirical cutoffs, medication doses, probabilities or waiting durations.",
  assertions: [{ field: "learningObjective", text: p.objective, claimIds: p.supportingEvidenceClaimIds },
    { field: "explanation", text: p.explanation, claimIds: p.supportingEvidenceClaimIds },
    ...p.choices.flatMap(c => [
      { field: `answerChoices[id=${c.id}].rationale`, text: c.rationale, claimIds: c.evidenceClaimIds },
      { field: `answerChoices[id=${c.id}].counterfactual`, text: c.counterfactual, claimIds: c.evidenceClaimIds },
    ])],
}));
export const STOMACH_NEOPLASIA_CURRENT_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1, publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic authoring preview, not clinically approved. Seven editorial PASS versions preserved; six revised singletons await independent re-review. All clinical versions require named clinician approval.",
  concepts: STOMACH_NEOPLASIA_CURRENT_CONCEPTS, cases: STOMACH_NEOPLASIA_CURRENT_CASES,
});
export const STOMACH_NEOPLASIA_RESPONSE_MANIFEST = {
  ...responseReview, scope: "explicit_import_authoring_sidecar", reviewDisplay: "key shown first for review only.",
  reviewed: 16, passPreserved: 7, revised: 6, parked: 3,
  currentQuestionCount: STOMACH_NEOPLASIA_CURRENT_QUESTIONS.length, currentCaseCount: STOMACH_NEOPLASIA_CURRENT_CASES.length,
  currentConceptCount: STOMACH_NEOPLASIA_CURRENT_CONCEPTS.length,
  multipartPolicy: "Only cases whose every scored node has independent PASS are retained as multi-part; all revisions are singleton candidates pending re-review.",
  pipelinePassed: false, managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false,
};
