import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry,
  type CaseExhibit,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";
import ledger from "../../../docs/research/sources-question-topic-colon-diverticular-lower-bleeding-20261111.json";

export const COLON_TOPIC_VERSION = "question-topic-colon-diverticular-lower-bleeding.2026-11-11.v1";
export const COLON_TOPIC_DRAFT = {
  contentVersion: COLON_TOPIC_VERSION,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};

const topic = "colon-diverticular-lower-bleeding";
const claimId = (name: string) => `claim.${topic}.${name}`;
const newConceptId = (name: string) => `concept.${topic}.${name}.v1`;
const electiveConcept = "concept.recovered-diverticulitis.elective-sigmoid-selection.v2";
const previousElectiveConcept = "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion";
const reconstructionConcept = newConceptId("emergency-reconstruction");
const embolizationConcept = newConceptId("embolization-selection");

interface TopicChoice {
  id: string;
  label: string;
  rationale: string;
  temptation: string;
  reasonableWhen: string;
  claims: string[];
  timingProfileId?: string;
}

interface AuthorReasoning {
  interpret: string;
  apply: string;
  closestChoice: string;
  decidingObservation: string;
  consequenceOfError: string;
  counterfactual: string;
  counterfactualChoice: string;
  deletionTest: string;
  cueAttack: string;
  stageAudit: string;
  difficulty: "moderate" | "hard";
  difficultyReason: string;
  sequenceCheck: string;
  limitation: string;
}

interface TopicNode {
  slug: string;
  version?: 2;
  conceptId: string;
  previousConceptId?: string;
  conceptRelation: "reuse" | "new_meaning" | "new_version";
  displayName: string;
  objective: string;
  conceptType: TestedConcept["conceptType"];
  creationKind: "Rewrite" | "new";
  replacesInventoryIds: string[];
  task: string;
  update: string;
  exhibit?: CaseExhibit;
  correctChoice: string;
  choices: TopicChoice[];
  explanation: string;
  claims: string[];
  reasoning: AuthorReasoning;
}

interface TopicCase {
  slug: string;
  version?: 2;
  name: string;
  age: number;
  sex: "Female" | "Male";
  complaint: string;
  presentation: string;
  historicalAcuity: "stable" | "urgent_stable" | "obvious_emergency";
  nodes: TopicNode[];
}

/** Each case has one finite patient profile and a clinic encounter. Hospital
 * findings are retrospective outside records. Choices propose historical care
 * decisions and do not execute orders or introduce a hospital runtime setting.
 */
export const COLON_TOPIC_REVIEWED_V1_ITEMS: TopicCase[] = [
  {
    slug: "first-outpatient-episode",
    name: "Elena Brooks",
    age: 49,
    sex: "Female",
    complaint: "Abdominal pain follow-up",
    presentation: "{patientName}, a 49-year-old woman, attends clinic to review her first episode of lower abdominal pain and its outpatient treatment.",
    historicalAcuity: "stable",
    nodes: [
      {
        slug: "first-presentation-ct",
        conceptId: "concept.diverticulitis.first-presentation-ct",
        conceptRelation: "reuse",
        displayName: "CT for first suspected diverticulitis",
        objective: "Select CT to confirm a first suspected diverticulitis presentation and assess for complications.",
        conceptType: "workup",
        creationKind: "Rewrite",
        replacesInventoryIds: ["inventory.ae16574e9d4cde6f"],
        task: "Which investigation best fits {patientName}'s initial presentation?",
        update: "At that visit she had left-lower-quadrant tenderness, a low-grade fever and discomfort during urination. Urinalysis showed a few leukocytes without nitrites or blood. Her abdomen was soft outside the tender area. She had never had similar pain or abdominal imaging. Creatinine was within the laboratory reference interval.",
        correctChoice: "contrast-ct",
        choices: [
          {
            id: "stone-ct",
            label: "Noncontrast CT using a ureteric-stone protocol",
            rationale: "The urinary discomfort can accompany adjacent colonic inflammation. The focal abdominal findings and uncertain first episode call for assessment of bowel inflammation and complications, beyond a stone-focused examination.",
            temptation: "Anchoring on dysuria and urinary leukocytes.",
            reasonableWhen: "Colicky flank-to-groin pain and the rest of the assessment make ureteric obstruction the leading problem.",
            claims: ["initial-ct", "contrast-ct", "stone-ct-counterfactual"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "contrast-ct",
            label: "Contrast-enhanced CT of the abdomen and pelvis",
            rationale: "The first episode has overlapping urinary and colonic features. Abdominopelvic CT can establish the source and assess for a collection or other complication.",
            temptation: "Integrating the abdominal examination with the limited urinary findings.",
            reasonableWhen: "A first suspected diverticulitis episode needs confirmation and assessment of its extent.",
            claims: ["initial-ct", "contrast-ct", "stone-ct-counterfactual"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "colonoscopy",
            label: "Colonoscopy with inspection of the entire colon",
            rationale: "Colonoscopy may have a later role in luminal assessment. It does not supply the initial cross-sectional assessment of a possible acute extraluminal inflammatory complication.",
            temptation: "Choosing direct colonic inspection whenever a colonic cause is suspected.",
            reasonableWhen: "The acute episode has resolved and an indicated luminal assessment remains outstanding.",
            claims: ["initial-ct", "recovery-colonoscopy"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
        ],
        explanation: "The urinary findings do not establish the source of pain. For a first suspected colonic inflammatory episode, CT can confirm the diagnosis and evaluate its extent.",
        claims: ["initial-ct", "recovery-colonoscopy"],
        reasoning: {
          interpret: "Interpret mild urinary findings alongside focal abdominal inflammation without declaring the urinary tract to be the source.",
          apply: "Choose a cross-sectional study that evaluates bowel and adjacent structures during a first uncertain episode.",
          closestChoice: "stone-ct",
          decidingObservation: "The focal left-lower abdominal syndrome has no hematuria or characteristic renal-colic course.",
          consequenceOfError: "A stone-focused pathway can leave an inflammatory complication insufficiently characterized.",
          counterfactual: "Replace focal left-lower tenderness and fever with abrupt colicky flank pain radiating to the groin and hematuria. A stone-protocol CT becomes reasonable among these choices.",
          counterfactualChoice: "stone-ct",
          deletionTest: "Urinary discomfort earns the stone competitor. First-episode status earns confirmation. Renal function supplies contrast context. Further routine history was removed.",
          cueAttack: "The complaint and task name no diagnosis or protocol. All options are specific studies. Both CT choices have the same placeholder profile, and colonoscopy has its own estimate.",
          stageAudit: "Three initial investigations for the same unresolved source of pain.",
          difficulty: "moderate",
          difficultyReason: "The resident must resist urinary anchoring and select the acquisition appropriate to the broader clinical problem.",
          sequenceCheck: "First node. Feedback identifies the value of CT and supplies no antibiotic-eligibility rule for the next node.",
          limitation: "Protocol detail is a qualitative clinical application of the CT guidance. Exact wording and acquisition ranking require clinician review.",
        },
      },
      {
        slug: "selected-supportive-care",
        conceptId: "concept.diverticulitis.selected-supportive-care",
        conceptRelation: "reuse",
        displayName: "Selected supportive care for uncomplicated diverticulitis",
        objective: "Use outpatient supportive care without routine antibiotics for a carefully selected mild uncomplicated case.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.7502125de76f8da4", "inventory.757746fac779389a"],
        task: "Which initial outpatient plan best fits {patientName}'s CT findings and subsequent assessment?",
        update: "CT showed sigmoid wall thickening and adjacent fat stranding, with no collection, extraluminal gas or obstruction. By reassessment her pain was improving, pulse was 78/min and temperature 37.1 C. She drank and ate without vomiting, took no immunosuppressive medicine and managed her usual activities independently. She could return for reassessment. Her history included two antibiotic-associated C. difficile infections.",
        correctChoice: "support",
        choices: [
          {
            id: "amoxicillin",
            label: "Start oral amoxicillin-clavulanate with early reassessment",
            rationale: "Antibiotics remain appropriate for higher-risk or worsening disease. Here the mild improving course meets selective omission criteria, and prior C. difficile increases the cost of avoidable antibiotic exposure.",
            temptation: "Treating every CT-confirmed inflammatory episode with an antibiotic.",
            reasonableWhen: "There is immunocompromise, substantial frailty, clinical worsening or another supported reason to treat with antibiotics.",
            claims: ["selected-no-antibiotics", "oral-amoxicillin-clavulanate", "antibiotic-cdi-risk"],
          },
          {
            id: "support",
            label: "Use oral hydration and analgesia with early reassessment",
            rationale: "The CT and observed course support a selected nonantibiotic outpatient plan. Give explicit return instructions for worsening pain, fever or inability to maintain intake.",
            temptation: "Applying the selection criteria while accounting for a meaningful antibiotic-related harm.",
            reasonableWhen: "The patient is stable, immunocompetent, nonfrail, tolerating intake and able to obtain reassessment.",
            claims: ["uncomplicated-observations", "selected-no-antibiotics", "antibiotic-cdi-risk"],
          },
          {
            id: "admit",
            label: "Use inpatient intravenous antibiotics with serial reassessment",
            rationale: "Admission is appropriate when illness severity or oral-intake failure warrants it. Her current trajectory and oral tolerance support outpatient care.",
            temptation: "Equating the first confirmed episode with a need for inpatient treatment.",
            reasonableWhen: "Vomiting, systemic illness, a complication or an unsafe outpatient course requires hospital treatment.",
            claims: ["selected-no-antibiotics", "antibiotics-immunosuppression"],
          },
        ],
        explanation: "Her CT and clinical trajectory support selective omission of antibiotics. Previous C. difficile makes unnecessary exposure consequential. Outpatient care still includes reassessment and return instructions.",
        claims: ["uncomplicated-observations", "selected-no-antibiotics", "oral-amoxicillin-clavulanate", "antibiotic-cdi-risk", "antibiotics-immunosuppression"],
        reasoning: {
          interpret: "Combine the absence of a CT complication with the actual improving course and ability to maintain intake.",
          apply: "Choose selective nonantibiotic care while weighing the patient's prior antibiotic-associated harm.",
          closestChoice: "amoxicillin",
          decidingObservation: "Mild improving uncomplicated disease in an independent immunocompetent outpatient with previous C. difficile.",
          consequenceOfError: "Routine treatment adds avoidable antibiotic exposure to a patient with a relevant prior complication.",
          counterfactual: "Replace immune competence with active transplant immunosuppression while retaining oral tolerance and stability. Oral antibiotic treatment becomes the better plan among the offered choices.",
          counterfactualChoice: "amoxicillin",
          deletionTest: "CT determines complication status. Oral intake and reassessment establish disposition. Independence and medicine history establish eligibility. Prior C. difficile distinguishes an otherwise defensible antibiotic option.",
          cueAttack: "Removed the summary labels nonfrail and eligible for no antibiotics. Options have comparable follow-up scope. Prior infection is a legitimate patient-specific harm, recorded for independent review.",
          stageAudit: "Three initial care plans with the same reassessment obligation.",
          difficulty: "moderate",
          difficultyReason: "The resident must apply omission criteria and resist routine antibiotics despite a confirmed inflammatory diagnosis.",
          sequenceCheck: "The CT explanation does not teach the omission criteria. The current clinical course, immune history and prior harm enter only at this node.",
          limitation: "Guidance permits selective omission rather than forbidding antibiotics. Clinician review must confirm the patient-specific ranking against oral amoxicillin-clavulanate.",
        },
      },
    ],
  },
  {
    slug: "recovered-abscess",
    name: "Martin Ellis",
    age: 58,
    sex: "Male",
    complaint: "Recovery planning",
    presentation: "{patientName}, a 58-year-old man, attends clinic after treatment of his first sigmoid diverticular abscess at an outside hospital.",
    historicalAcuity: "stable",
    nodes: [
      {
        slug: "post-abscess-colonoscopy",
        conceptId: "concept.recovered-diverticulitis.interval-colonoscopy",
        conceptRelation: "reuse",
        displayName: "Colonoscopy after recovered complicated diverticulitis",
        objective: "Select colonoscopy after first recovered complicated diverticulitis without recent adequate examination.",
        conceptType: "workup",
        creationKind: "Rewrite",
        replacesInventoryIds: ["inventory.4ebfb2555165927a"],
        task: "Which investigation should {patientName}'s post-recovery plan include?",
        update: "Drainage and antibiotics resolved his fever and focal tenderness. Follow-up CT documented collapse of the collection and resolution of adjacent inflammation. He had returned to his usual bowel pattern. His only prior endoscopy report described the esophagus, stomach and duodenum. His records contained no colorectal screening examination.",
        correctChoice: "colonoscopy",
        choices: [
          {
            id: "ct",
            label: "Repeat contrast-enhanced CT of the abdomen and pelvis",
            rationale: "CT has already documented collection resolution. Another routine scan would not supply the outstanding mucosal evaluation after this recovered abscess.",
            temptation: "Treating radiologic resolution of the inflammatory complication as the only required follow-up endpoint.",
            reasonableWhen: "Persistent symptoms or infection raise concern for an unresolved collection or another extraluminal complication.",
            claims: ["recovery-colonoscopy", "failure-source-control"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "colonoscopy",
            label: "Arrange complete colonoscopy at follow-up",
            rationale: "The prior upper examination did not assess the colon. This recovered abscess episode and absent colorectal examination support colonoscopy for an alternative lesion.",
            temptation: "Distinguishing an endoscopy heading from the actual organ examined.",
            reasonableWhen: "A recovered complicated episode leaves an indicated colonic examination outstanding.",
            claims: ["recovery-colonoscopy"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "stool",
            label: "Obtain a fecal immunochemical test at follow-up",
            rationale: "A stool blood test does not replace the indicated direct examination of the colon in this post-abscess assessment.",
            temptation: "Substituting a screening tool for diagnostic follow-up of a complicated colonic episode.",
            reasonableWhen: "An otherwise suitable average-risk screening patient is choosing a stool-based screening pathway.",
            claims: ["recovery-colonoscopy"],
            timingProfileId: "timing.test.general_diagnostic",
          },
        ],
        explanation: "Clinical and CT recovery address the abscess. The earlier endoscopy assessed the upper tract. A complete colonic examination remains indicated in this patient after the complicated episode.",
        claims: ["recovery-colonoscopy", "failure-source-control"],
        reasoning: {
          interpret: "Separate collection resolution from assessment of the colonic lumen, and identify the actual extent of the earlier endoscopy.",
          apply: "Select colonoscopy for the outstanding post-recovery evaluation.",
          closestChoice: "ct",
          decidingObservation: "The collection has resolved, but no prior examination evaluated the colon.",
          consequenceOfError: "Repeating the extraluminal study can leave a relevant mucosal lesion unassessed.",
          counterfactual: "Replace recovery and a collapsed collection with recurrent fever and focal tenderness after drainage. Repeat CT becomes the initial reassessment among these options.",
          counterfactualChoice: "ct",
          deletionTest: "Clinical recovery makes this an interval evaluation. CT completion removes redundant imaging. The documented upper examination establishes organ provenance. No fixed interval was retained.",
          cueAttack: "The complaint and task do not name colonoscopy. All three options are investigations with estimates. The wrong-site history adds an inference without an unsupported repeat-modality hierarchy.",
          stageAudit: "Three investigations proposed at the same recovered follow-up visit.",
          difficulty: "moderate",
          difficultyReason: "Two apparently reassuring completed investigations must be interpreted for the question each actually answered.",
          sequenceCheck: "First node. Feedback addresses colonic evaluation and gives no elective surgery rule.",
          limitation: "The stool-test foil is weaker for an experienced resident. This replacement retains a core existing objective and needs independent difficulty review.",
        },
      },
      {
        slug: "elective-burden-after-abscess",
        conceptId: electiveConcept,
        previousConceptId: previousElectiveConcept,
        conceptRelation: "new_version",
        displayName: "Elective sigmoid treatment selection after recovery",
        objective: "Select a concrete elective sigmoid treatment plan using ongoing burden, operative risk and informed patient priorities.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.211460bd073bfb80", "inventory.17ed6da0bc0d1f83"],
        task: "Which treatment plan best fits {patientName}'s subsequent clinic assessment?",
        update: "Colonoscopy found no mucosal mass. During later follow-up he had another CT-confirmed inflammatory episode, with symptom-free recovery between episodes. The episodes repeatedly interrupted work. His current CT showed resolution, he exercised without limitation, and preoperative assessment identified no major cardiopulmonary disease. After discussing operative complications and possible persistent symptoms, he preferred resection to further recurrences.",
        correctChoice: "sigmoid",
        choices: [
          {
            id: "observe",
            label: "Continue nonoperative follow-up for future episodes",
            rationale: "Observation remains a valid option after recovery. His recurrent burden, operative assessment and informed preference now support offering a specific elective operation.",
            temptation: "Reading individualized guidance as a reason to defer every operation after recovery.",
            reasonableWhen: "Symptoms are minimal, operative risk is substantial or the informed patient prefers observation.",
            claims: ["elective-burden", "abscess-elective-choice"],
          },
          {
            id: "sigmoid",
            label: "Schedule an elective sigmoid colectomy",
            rationale: "The decision is supported by recurrent burden and informed preference in a patient with an acceptable operative assessment. It is not triggered by a required episode count.",
            temptation: "Combining patient-specific burden and risk with a concrete operative plan.",
            reasonableWhen: "Ongoing or recurrent burden and patient priorities justify the operative tradeoff after recovery.",
            claims: ["elective-burden", "abscess-elective-choice"],
          },
          {
            id: "mesalamine",
            label: "Start oral mesalamine maintenance therapy",
            rationale: "Maintenance mesalamine is not a supported substitute for the elective decision in recurrent diverticular disease.",
            temptation: "Treating repeated colonic inflammation as if it followed an IBD maintenance pathway.",
            reasonableWhen: "A separate appropriately established inflammatory bowel disease indication supports mesalamine.",
            claims: ["elective-burden", "mesalamine-prevention", "elective-resection-tradeoff"],
          },
        ],
        explanation: "Elective resection can be offered after recovery when burden, operative risk and an informed patient's priorities support it. It reduces recurrence risk while carrying operative and persistent-symptom risks. Episode count does not supply the decision.",
        claims: ["elective-burden", "abscess-elective-choice"],
        reasoning: {
          interpret: "Identify discrete recovered recurrences with substantial functional burden rather than ongoing uncontrolled infection.",
          apply: "Choose a concrete elective resection plan consistent with acceptable risk and informed preference.",
          closestChoice: "observe",
          decidingObservation: "Repeated work interruption and a preference for surgery after an explicit risk discussion, with recovery and acceptable operative assessment.",
          consequenceOfError: "A fixed policy of waiting leaves the patient's recurrent burden untreated despite an appropriate elective option.",
          counterfactual: "Replace work interruption and the operative preference with no current symptoms, substantial operative risk and a preference to avoid surgery. Nonoperative follow-up becomes the better option.",
          counterfactualChoice: "observe",
          deletionTest: "Interval recovery distinguishes elective treatment from source control. Function and risk establish the tradeoff. Informed preference is necessary because two reasonable strategies otherwise remain.",
          cueAttack: "Removed generic shared-decision labels and episode-count caricatures. The preference earns its place as the legitimate tie-breaker. All labels name actual treatment plans.",
          stageAudit: "Three elective strategies after resolution of acute infection.",
          difficulty: "moderate",
          difficultyReason: "The resident must apply conditional guidance to a concrete decision instead of repeating that counseling is individualized.",
          sequenceCheck: "The prior explanation addresses colonic evaluation. New recurrence burden, operative assessment and informed preference determine this node.",
          limitation: "This changes the old discussion objective to treatment selection and therefore uses a new concept version. It cannot inherit the old FSRS identity or approval.",
        },
      },
    ],
  },
  {
    slug: "urinary-symptoms",
    name: "Daniel Mercer",
    age: 64,
    sex: "Male",
    complaint: "Urinary infection review",
    presentation: "{patientName}, a 64-year-old man, attends clinic to review outside records of recurrent urinary symptoms and lower abdominal pain.",
    historicalAcuity: "urgent_stable",
    nodes: [
      {
        slug: "first-episode-with-urinary-symptoms",
        conceptId: "concept.diverticulitis.first-presentation-ct",
        conceptRelation: "reuse",
        displayName: "CT for first suspected diverticulitis",
        objective: "Select CT to confirm a first suspected diverticulitis presentation and assess for complications.",
        conceptType: "workup",
        creationKind: "Rewrite",
        replacesInventoryIds: ["inventory.d4d90395f0b59495"],
        task: "Which investigation best addresses {patientName}'s initial combination of findings?",
        update: "Cultured urinary infections recurred after appropriate treatment. He described bubbles during urination and left-lower-quadrant discomfort. Examination found focal abdominal tenderness. There had been no urinary catheterization or abdominal imaging, and he had no prior imaging-confirmed colonic diagnosis.",
        correctChoice: "ct",
        choices: [
          {
            id: "cystoscopy",
            label: "Cystoscopy to inspect the bladder lumen",
            rationale: "Cystoscopy can assess a bladder lesion, but it does not supply the initial cross-sectional assessment of an adjacent colonic inflammatory source.",
            temptation: "Keeping the entire investigation within the repeatedly positive urinary tract.",
            reasonableWhen: "The remaining concern is a bladder mucosal lesion after the adjacent pelvic structures have been assessed.",
            claims: ["initial-ct", "contrast-ct", "fistula-observations", "cystoscopy-scope"],
            timingProfileId: "timing.test.advanced_diagnostic",
          },
          {
            id: "ct",
            label: "Contrast-enhanced CT of the abdomen and pelvis",
            rationale: "The urinary and abdominal findings raise concern for a connected pelvic process. CT evaluates bowel inflammation, adjacent bladder involvement and other complications.",
            temptation: "Combining the recurrent infections with the abdominal localization and absence of instrumentation.",
            reasonableWhen: "Suspected first diverticulitis or a complication requires assessment of bowel and surrounding structures.",
            claims: ["initial-ct", "contrast-ct", "fistula-observations", "cystoscopy-scope"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "ultrasound",
            label: "Ultrasound of the kidneys and bladder",
            rationale: "Ultrasound can assess urinary obstruction but may leave the neighboring bowel process and its extent unresolved.",
            temptation: "Choosing a urinary structural test after repeated positive cultures.",
            reasonableWhen: "The leading unresolved problem is hydronephrosis, retention or another urinary obstruction.",
            claims: ["initial-ct", "contrast-ct", "fistula-observations", "cystoscopy-scope"],
            timingProfileId: "timing.test.ultrasound",
          },
        ],
        explanation: "Recurrent urinary infection with bubbles during urination and focal lower abdominal tenderness requires assessment of adjacent bowel and bladder. CT supplies that cross-sectional evaluation.",
        claims: ["initial-ct", "contrast-ct", "fistula-observations", "cystoscopy-scope"],
        reasoning: {
          interpret: "Recognize that repeated urinary infection with gas symptoms may arise from an adjacent bowel process.",
          apply: "Choose an initial study that evaluates the source and its extraluminal extent.",
          closestChoice: "cystoscopy",
          decidingObservation: "Gas symptoms and focal abdominal tenderness accompany recurrent culture-proven infection without instrumentation.",
          consequenceOfError: "Bladder-focused inspection may postpone characterization of the diseased bowel and pelvic connection.",
          counterfactual: "Replace the gas symptoms and abdominal tenderness with persistent painless hematuria after adequate normal cross-sectional imaging. Bladder inspection becomes the appropriate offered next study.",
          counterfactualChoice: "cystoscopy",
          deletionTest: "Recurrent cultures distinguish one uncomplicated urinary infection. Gas symptoms and no instrumentation support the communication concern. The abdominal localization makes a bowel assessment consequential.",
          cueAttack: "The full context avoids the names fistula and diverticulitis before answering. All options are credible urinary/pelvic investigations with individual timing records.",
          stageAudit: "Three initial investigations of the same unresolved pelvic source.",
          difficulty: "moderate",
          difficultyReason: "The resident must integrate findings across organ systems and choose the initial acquisition rather than merely label the communication.",
          sequenceCheck: "The first explanation identifies the assessment need. It does not name a later operation or guarantee a diagnosis.",
          limitation: "The fistula pattern is familiar. Difficulty comes from CT versus cystoscopy sequencing and needs independent clinical review.",
        },
      },
      {
        slug: "symptomatic-colovesical-fistula",
        conceptId: newConceptId("symptomatic-fistula-resection"),
        conceptRelation: "new_meaning",
        displayName: "Resection for symptomatic diverticular fistula",
        objective: "Select elective sigmoid resection for a persistent symptomatic colovesical communication after acute infection control.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.bd4de6b2bce0d504"],
        task: "Which treatment plan best fits {patientName}'s subsequent records?",
        update: "CT showed an inflamed sigmoid segment with a tract to the bladder dome and intravesical gas. After infection treatment, fever and abdominal tenderness resolved, but bubbles during urination and culture-proven urinary infections continued. Colonoscopy and cystoscopy found no mucosal tumor. Preoperative assessment found no major functional limitation.",
        correctChoice: "resect",
        choices: [
          {
            id: "suppress",
            label: "Use repeated culture-directed urinary antibiotic courses",
            rationale: "Antibiotics treat infection but leave the persistent symptomatic communication in place.",
            temptation: "Continuing an effective short-term infection treatment as the definitive plan.",
            reasonableWhen: "Symptoms are controlled and operative risk or informed patient priorities favor a nonoperative strategy.",
            claims: ["fistula-observations", "fistula-resection"],
          },
          {
            id: "resect",
            label: "Plan elective resection of the involved sigmoid segment",
            rationale: "A symptomatic diverticular fistula after acute infection control supports elective or semielective colonic resection.",
            temptation: "Linking the persistent infections to the documented structural source.",
            reasonableWhen: "A patient with acceptable operative assessment has an ongoing symptomatic diverticular communication.",
            claims: ["fistula-resection"],
          },
          {
            id: "bladder",
            label: "Plan bladder repair with the sigmoid left in place",
            rationale: "An isolated bladder operation leaves the diseased colonic source. Any necessary bladder treatment is considered within source-directed surgery.",
            temptation: "Operating on the organ producing the most troublesome symptoms.",
            reasonableWhen: "An independent bladder injury is the source and the colon is uninvolved.",
            claims: ["fistula-resection"],
          },
        ],
        explanation: "The persistent urinary symptoms arise from a documented sigmoid-to-bladder communication. After acute infection control, resection of the diseased colon addresses the structural source. The precise bladder technique is a separate operative judgment.",
        claims: ["fistula-observations", "fistula-resection"],
        reasoning: {
          interpret: "Distinguish treated infection from persistence of its documented structural source.",
          apply: "Choose definitive colonic source-directed treatment after recovery.",
          closestChoice: "suppress",
          decidingObservation: "Urinary symptoms and infections persist after the acute inflammatory illness has resolved.",
          consequenceOfError: "Repeated infection treatment leaves the symptomatic communication untreated.",
          counterfactual: "Replace acceptable operative assessment with prohibitive operative risk and mild controllable symptoms after an informed choice for nonsurgical care. Culture-directed conservative treatment becomes reasonable.",
          counterfactualChoice: "suppress",
          deletionTest: "CT establishes the actual anatomic connection. The response separates acute infection from a persistent fistula. Function informs elective suitability. Tumor assessment avoids an unannounced oncologic objective.",
          cueAttack: "All options name specific definitive treatment strategies. The prior CT answer does not teach the resection indication. No operative availability permission is supplied.",
          stageAudit: "Three definitive source-management strategies after initial infection treatment.",
          difficulty: "moderate",
          difficultyReason: "The decision separates repeated treatment of a consequence from treatment of the persisting source.",
          sequenceCheck: "This node adds CT anatomy, treatment response and continued infections. Without the update, a definitive operation cannot be selected from the earlier suspicion.",
          limitation: "One adequate current surgical guideline supports the specific recommendation. Bladder-repair technique and occult malignancy exclusion remain clinician judgments.",
        },
      },
    ],
  },
  {
    slug: "persistent-bowel-change",
    name: "Nora Bennett",
    age: 62,
    sex: "Female",
    complaint: "Changed bowel pattern",
    presentation: "{patientName}, a 62-year-old woman, attends clinic after an outside admission for diverticulitis with an abscess.",
    historicalAcuity: "stable",
    nodes: [
      {
        slug: "post-recovery-alarm-colonoscopy",
        conceptId: "concept.recovered-diverticulitis.alarm-colonoscopy.v2",
        previousConceptId: "concept.recovered-diverticulitis.interval-colonoscopy",
        conceptRelation: "new_version",
        displayName: "Colonic assessment after atypical recovery",
        objective: "Select colonoscopy when atypical symptoms and residual focal findings persist after apparent diverticulitis recovery.",
        conceptType: "workup",
        creationKind: "Rewrite",
        replacesInventoryIds: ["inventory.167ae4bbcd8eb876"],
        task: "Which investigation best fits {patientName}'s current post-recovery findings?",
        update: "Her fever and acute tenderness resolved, and CT showed no residual collection. She continued to pass narrow stools and had lost weight despite resuming her usual diet. CT still showed a short thickened sigmoid segment. A complete well-prepared colonoscopy performed before this illness had shown no mass.",
        correctChoice: "colonoscopy",
        choices: [
          {
            id: "ct",
            label: "Repeat CT during the next routine surveillance visit",
            rationale: "The current scan has already shown persistent focal change. A new symptomatic course warrants direct luminal assessment instead of routine interval imaging.",
            temptation: "Extending radiologic surveillance because the acute collection resolved.",
            reasonableWhen: "The unresolved concern is a persistent extraluminal complication requiring cross-sectional reassessment.",
            claims: ["alarm-colonoscopy", "failure-source-control"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "colonoscopy",
            label: "Perform colonoscopy to assess the persistent colonic change",
            rationale: "The ongoing bowel change, weight loss and residual focal finding require evaluation despite a reassuring examination before the illness.",
            temptation: "Recognizing that an earlier adequate examination does not answer a new symptomatic problem.",
            reasonableWhen: "An atypical recovery or concerning focal finding raises concern for an alternative colonic lesion.",
            claims: ["alarm-colonoscopy"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "stool",
            label: "Obtain stool DNA testing at the current follow-up visit",
            rationale: "A screening stool test cannot resolve this new structural and symptomatic concern.",
            temptation: "Using a less invasive screening test after a previously reassuring colonoscopy.",
            reasonableWhen: "An asymptomatic average-risk patient is selecting an eligible routine screening strategy.",
            claims: ["alarm-colonoscopy"],
            timingProfileId: "timing.test.general_diagnostic",
          },
        ],
        explanation: "The new course earns a diagnostic examination even though the earlier screening colonoscopy was adequate. Persistent symptoms and a focal residual abnormality need assessment after acute inflammation has settled.",
        claims: ["alarm-colonoscopy", "failure-source-control"],
        reasoning: {
          interpret: "Distinguish resolved acute infection from an atypical persistent bowel problem.",
          apply: "Select a diagnostic colonoscopy despite a previously adequate screening examination.",
          closestChoice: "ct",
          decidingObservation: "New persistent stool change and weight loss accompany residual focal wall thickening after the collection resolves.",
          consequenceOfError: "Reassurance from prior screening can delay evaluation of a new lesion or symptomatic narrowing.",
          counterfactual: "Replace clinical recovery with recurrent fever and renewed focal tenderness. Repeat cross-sectional imaging becomes the first offered reassessment for a possible residual collection.",
          counterfactualChoice: "ct",
          deletionTest: "Prior adequate colonoscopy creates a credible reason to defer repetition. New symptoms and residual focal change defeat that shortcut. Collection resolution defines the current phase.",
          cueAttack: "Removed language saying cancer must be excluded. All choices are diagnostic studies with estimates. The old examination remains explicitly adequate, so this is not another preparation-repair item.",
          stageAudit: "Three diagnostic strategies at the recovered follow-up stage.",
          difficulty: "moderate",
          difficultyReason: "The learner must interpret why a valid earlier negative examination does not settle a changed clinical course.",
          sequenceCheck: "First node. Feedback does not state the treatment of a subsequently demonstrated fixed symptomatic narrowing.",
          limitation: "The underlying scored meaning differs from the original missing-examination objective. A new concept identity preserves the original history.",
        },
      },
      {
        slug: "symptomatic-sigmoid-stricture",
        conceptId: newConceptId("symptomatic-stricture-resection"),
        conceptRelation: "new_meaning",
        displayName: "Resection for a symptomatic sigmoid stricture",
        objective: "Select resection for persistent obstructive symptoms from a fixed sigmoid narrowing after acute inflammation resolves.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.aa011e810c5dd36c", "inventory.c52c83dee7b35e20"],
        task: "Which treatment plan best fits {patientName}'s persistent bowel symptoms?",
        update: "Colonoscopy passed a fixed sigmoid narrowing with a slim instrument. Later she continued to have post-meal distension and difficulty passing stool. CT showed proximal colonic dilation at the same short narrowing, with no collection or surrounding fat inflammation. She had no peritoneal signs and remained able to drink.",
        correctChoice: "resect",
        choices: [
          {
            id: "antibiotics",
            label: "Restart antibiotics for another presumed inflammatory episode",
            rationale: "The current evidence shows a persistent mechanical narrowing after acute inflammation has resolved. Another antibiotic course does not address that obstruction.",
            temptation: "Attributing every subsequent symptom to another acute flare.",
            reasonableWhen: "A new episode has supportive inflammatory findings or another current infectious indication.",
            claims: ["symptomatic-stricture", "antibiotics-immunosuppression"],
          },
          {
            id: "dilate",
            label: "Arrange endoscopic balloon dilation of the narrowed segment",
            rationale: "A diverticular stricture with persistent obstruction calls for surgical assessment and resection. Dilation is not the recommended definitive strategy for this constructed post-diverticulitis course.",
            temptation: "Transferring a treatment used for selected other benign strictures to this setting.",
            reasonableWhen: "A separately established, suitable nondiverticular benign stricture has an evidence-supported endoscopic plan.",
            claims: ["symptomatic-stricture"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "resect",
            label: "Plan resection of the persistently narrowed sigmoid segment",
            rationale: "The fixed lesion and continuing obstructive course support resection. Definitive pathology remains part of evaluating its cause.",
            temptation: "Connecting symptoms, dilation and fixed anatomy to a source-directed treatment.",
            reasonableWhen: "A fixed sigmoid stricture produces continuing obstructive symptoms after acute recovery.",
            claims: ["symptomatic-stricture"],
          },
        ],
        explanation: "A fixed narrowing with proximal dilation and persistent obstructive symptoms requires a mechanical treatment decision. Resection is supported for symptomatic diverticular strictures. Definitive evaluation of the underlying cause remains part of the surgical workup.",
        claims: ["symptomatic-stricture", "alarm-colonoscopy", "antibiotics-immunosuppression"],
        reasoning: {
          interpret: "Identify a fixed mechanical consequence after acute inflammation has subsided.",
          apply: "Choose resection for the persistent symptomatic narrowing.",
          closestChoice: "dilate",
          decidingObservation: "The same fixed sigmoid lesion causes persistent symptoms and upstream dilation after inflammation resolves.",
          consequenceOfError: "Treating an assumed recurrent flare or an incompletely characterized stricture can postpone effective treatment of obstruction.",
          counterfactual: "Replace the post-diverticulitis narrowing with a proven short benign anastomotic stricture under an appropriate specialist plan. Endoscopic dilation becomes reasonable among the choices.",
          counterfactualChoice: "dilate",
          deletionTest: "The new CT establishes obstruction and absence of active inflammation. Oral tolerance and examination define the nonemergency phase. Noncontributory biopsy details were removed.",
          cueAttack: "The task asks about symptoms. Each option names a treatment. No benign pathology label is supplied to justify an unsupported endoscopic pathway.",
          stageAudit: "Three treatments for the continuing symptomatic narrowed segment.",
          difficulty: "hard",
          difficultyReason: "The resident must distinguish persistent structural disease from recurrent inflammation and choose between mechanical treatment approaches.",
          sequenceCheck: "The earlier feedback justifies diagnosis. Fixed narrowing, proximal dilation and continued symptoms are new observations that determine treatment.",
          limitation: "Single current surgical guideline for the diverticular-stricture recommendation. Oncologic extent and detailed endoscopic dilation eligibility are outside the scored scope and require clinician confirmation.",
        },
      },
    ],
  },
  {
    slug: "pelvic-abscess-course",
    name: "Grace Warren",
    age: 55,
    sex: "Female",
    complaint: "Admission decision review",
    presentation: "{patientName}, a 55-year-old woman, attends clinic after an outside admission for lower abdominal pain and fever.",
    historicalAcuity: "urgent_stable",
    nodes: [
      {
        slug: "large-accessible-abscess",
        conceptId: newConceptId("abscess-source-control"),
        conceptRelation: "new_meaning",
        displayName: "Drainage of a large diverticular abscess",
        objective: "Select image-guided drainage with antibiotics for a large accessible diverticular abscess in a stable patient.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.b7fac41b4cc315d1"],
        task: "Which initial hospital plan best fits {patientName}'s admission findings?",
        update: "CT showed sigmoid inflammation and a rim-enhancing pelvic collection measuring 6 cm. There was no diffuse free fluid or remote gas. She had focal tenderness without generalized guarding, and blood pressure remained stable after fluid replacement. The interventional radiology review documented a percutaneous route that avoided bowel. Intravenous antibiotics had been started.",
        correctChoice: "drain",
        choices: [
          {
            id: "antibiotics",
            label: "Continue antibiotics with serial inpatient reassessment",
            rationale: "Antibiotics are required, but this large collection and feasible route support adding drainage. Antibiotics without drainage remain an option when access is unsafe and the clinical course permits close observation.",
            temptation: "Applying the successful small-abscess pathway to a larger drainable collection.",
            reasonableWhen: "The collection is small, or no safe drainage route exists and the patient remains suitable for a monitored antibiotic trial.",
            claims: ["abscess-drainage", "small-abscess-treatment"],
          },
          {
            id: "resect",
            label: "Perform sigmoid resection during the initial admission assessment",
            rationale: "Immediate resection can control a failed or uncontained process. Stable physiology, a localized collection and a safe drainage route support an initial less invasive source-control approach here.",
            temptation: "Treating every abscess as an immediate colectomy indication.",
            reasonableWhen: "There is diffuse peritonitis, deterioration or failed nonoperative source control.",
            claims: ["abscess-drainage", "failure-source-control"],
          },
          {
            id: "drain",
            label: "Add image-guided percutaneous drainage to the antibiotics",
            rationale: "The collection is beyond both retrieved guideline size boundaries and has an assessed safe route. Drainage adds source control while antibiotics continue.",
            temptation: "Integrating collection size, host physiology and technical access.",
            reasonableWhen: "A large localized diverticular abscess is accessible for percutaneous drainage in a stable patient.",
            claims: ["abscess-drainage"],
            timingProfileId: "timing.test.advanced_diagnostic",
          },
        ],
        explanation: "A large accessible abscess calls for source control in addition to antibiotics. Stable physiology and localized contamination support percutaneous drainage as the initial approach.",
        claims: ["abscess-drainage", "small-abscess-treatment", "failure-source-control"],
        reasoning: {
          interpret: "Recognize a localized large infected collection without diffuse peritonitis.",
          apply: "Combine size and safe access with physiology to choose drainage while antibiotics continue.",
          closestChoice: "antibiotics",
          decidingObservation: "A 6-cm localized collection has a documented bowel-avoiding percutaneous route.",
          consequenceOfError: "An antibiotic-only plan can leave a substantial accessible source undrained.",
          counterfactual: "Replace the 6-cm collection with a small collection and retain clinical improvement. Initial antibiotic treatment with serial reassessment becomes reasonable.",
          counterfactualChoice: "antibiotics",
          deletionTest: "Size distinguishes the antibiotic-only competitor. The route review establishes actual access rather than permission wording. Physiology and examination distinguish drainage from immediate resection.",
          cueAttack: "The complaint does not disclose the treatment. Access is documented as an anatomic observation and is necessary to the decision. Drainage has its exact planned-procedure timing record.",
          stageAudit: "Three initial source-control strategies with antibiotics common to the context.",
          difficulty: "moderate",
          difficultyReason: "The resident must combine localization, access and patient condition instead of responding to abscess size in isolation.",
          sequenceCheck: "Feedback explains the initial source-control choice without supplying a future operative failure rule.",
          limitation: "The 6-cm dimension is a constructed observation beyond both source boundaries. Borderline drainage thresholds are withheld for clinician review.",
        },
      },
      {
        slug: "failed-abscess-source-control",
        conceptId: newConceptId("failed-source-control-operation"),
        conceptRelation: "new_meaning",
        displayName: "Operation after failed abscess source control",
        objective: "Select operative source control when drainage and antibiotics fail and an undrained collection has no safe percutaneous route.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.efd57db08ebc77b6"],
        task: "Which next hospital plan best fits {patientName}'s changed course?",
        update: "After drainage, she developed increasing fever, tachycardia and broader abdominal tenderness despite antibiotics active against the cultured organisms. Repeat CT showed the drained cavity had collapsed, but another rim-enhancing collection had enlarged between bowel loops. The existing drain entered the collapsed cavity. Interventional review found no percutaneous path to the enlarging collection that avoided bowel.",
        correctChoice: "operate",
        choices: [
          {
            id: "broaden",
            label: "Broaden antibiotics and continue the current drain plan",
            rationale: "The organisms are already covered. The changed anatomy and clinical deterioration point to inadequate source control rather than a documented antimicrobial mismatch.",
            temptation: "Treating continued fever as proof of insufficient antibiotic breadth.",
            reasonableWhen: "Source control is adequate and microbiology or a new infection supports changing antimicrobial coverage.",
            claims: ["failure-source-control", "abscess-drainage"],
          },
          {
            id: "upsize",
            label: "Exchange the existing drain for a larger catheter",
            rationale: "The catheter reaches a collapsed cavity. Increasing its size does not establish access to the separate enlarging collection.",
            temptation: "Equating catheter caliber with drainage of every adjacent space.",
            reasonableWhen: "The remaining infected collection communicates with the catheter and catheter obstruction or size limits drainage.",
            claims: ["failure-source-control", "abscess-drainage"],
            timingProfileId: "timing.test.advanced_diagnostic",
          },
          {
            id: "operate",
            label: "Proceed to operative control of the undrained source",
            rationale: "The patient is worsening with an enlarging collection despite active antibiotics. The current drain misses that space and a safe percutaneous rescue route is absent.",
            temptation: "Connecting the response trajectory with the exact drain and collection anatomy.",
            reasonableWhen: "Nonoperative source control has failed and deterioration continues without a suitable drainage route.",
            claims: ["failure-source-control"],
          },
        ],
        explanation: "The new collection lies outside the drained space. The combination of clinical worsening and an inaccessible enlarging source supports operative source control. A larger catheter in the collapsed cavity does not repair the anatomic mismatch.",
        claims: ["failure-source-control", "abscess-drainage"],
        reasoning: {
          interpret: "Distinguish collapse of one drained cavity from control of a separate infected space.",
          apply: "Escalate to operative source control after a technically defined nonoperative failure.",
          closestChoice: "upsize",
          decidingObservation: "The catheter and enlarging collection occupy different spaces, with no safe percutaneous access to the latter.",
          consequenceOfError: "Repeated manipulation of the wrong cavity can delay source control during clinical deterioration.",
          counterfactual: "Replace the separate inaccessible collection with residual fluid communicating with an obstructed catheter. Drain exchange or upsizing becomes a reasonable rescue step.",
          counterfactualChoice: "upsize",
          deletionTest: "Culture activity tests the antibiotic-breadth error. The cavity map and catheter tip are essential. The worsening clinical course gives the unresolved anatomy a management consequence.",
          cueAttack: "The task does not name source-control failure. All options are specific treatment changes. No elapsed-time deadline or generic failure label supplies the answer.",
          stageAudit: "Three rescue treatment plans after a documented drainage attempt.",
          difficulty: "hard",
          difficultyReason: "The resident must integrate microbiology, drain position, separate-space anatomy and actual deterioration.",
          sequenceCheck: "The initial drainage decision supplies neither the new separate cavity nor the route limitation. Deleting this update removes the operative indication.",
          limitation: "Exact operative technique is deliberately left to the treating surgeon. Guidelines support escalation but provide no universal clock or catheter-size rule.",
        },
      },
    ],
  },
  {
    slug: "perforation-operative-review",
    name: "Owen Clarke",
    age: 46,
    sex: "Male",
    complaint: "Operation review",
    presentation: "{patientName}, a 46-year-old man, attends clinic after emergency abdominal surgery at an outside hospital. The founder reviews the sequential operative records with him.",
    historicalAcuity: "obvious_emergency",
    nodes: [
      {
        slug: "gross-perforation-source-control",
        conceptId: newConceptId("gross-perforation-resection"),
        conceptRelation: "new_meaning",
        displayName: "Resection for gross diverticular perforation",
        objective: "Choose colectomy for a gross sigmoid perforation with diffuse fecal contamination instead of a lavage-based plan.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.210b860e533ffefe"],
        task: "Which source-control procedure best fits {patientName}'s initial operative findings?",
        update: "After resuscitation, exploration found a disrupted sigmoid diverticulum with a visible full-thickness opening and liquid stool in several abdominal compartments. The remaining colon was viable. Broad-spectrum antibiotics had already been given.",
        correctChoice: "resection",
        choices: [
          {
            id: "lavage",
            label: "Perform peritoneal lavage and place abdominal drains",
            rationale: "A visible perforation with diffuse fecal contamination requires control of the diseased bowel source. Evidence for selected lavage in purulent disease does not support this feculent presentation.",
            temptation: "Generalizing a selected nonresection strategy to any generalized diverticular contamination.",
            reasonableWhen: "A carefully selected purulent-peritonitis case without gross perforation is being considered by an experienced team under the appropriate evidence boundary.",
            claims: ["gross-perforation-resection"],
          },
          {
            id: "repair",
            label: "Close the visible opening and place abdominal drains",
            rationale: "Simple closure leaves the diseased sigmoid segment in a setting requiring definitive source control. A limited repair strategy has a different role in selected damage-control circumstances.",
            temptation: "Treating the visible hole as an isolated defect independent of the diseased segment.",
            reasonableWhen: "A selected limited injury or staged damage-control situation supports a deliberately abbreviated repair.",
            claims: ["gross-perforation-resection", "hartmann-high-risk"],
          },
          {
            id: "resection",
            label: "Resect the perforated diseased sigmoid segment",
            rationale: "The gross perforation and fecal contamination favor removal of the diseased source.",
            temptation: "Applying the actual contamination and perforation findings to source control.",
            reasonableWhen: "Gross diverticular perforation produces diffuse fecal contamination.",
            claims: ["gross-perforation-resection"],
          },
        ],
        explanation: "The operative findings establish a gross perforation with fecal contamination. Colectomy addresses the diseased source. Reconstruction is considered separately after resection and assessment of physiology and bowel condition.",
        claims: ["gross-perforation-resection", "hartmann-high-risk"],
        reasoning: {
          interpret: "Distinguish a gross fecal leak from contained gas or selected purulent peritonitis.",
          apply: "Choose definitive colonic source control at the current operation.",
          closestChoice: "lavage",
          decidingObservation: "A visible full-thickness sigmoid opening accompanies liquid stool across abdominal compartments.",
          consequenceOfError: "A lavage-based plan can leave the continuing fecal source uncontrolled.",
          counterfactual: "Replace gross perforation and fecal contamination with a selected purulent-peritonitis presentation without a visible opening. Lavage becomes a possible specialist option requiring explicit clinical review.",
          counterfactualChoice: "lavage",
          deletionTest: "The visible opening and contamination type earn the distinction. Viability defines the source-control scope. Antibiotics are shared care and keep the choice at the procedural stage.",
          cueAttack: "All options are operative source-control procedures with parallel verbs. The complaint and task do not name a diagnosis grade or a preferred method. Contamination remains essential raw evidence.",
          stageAudit: "Three source-control procedures before a reconstruction decision.",
          difficulty: "moderate",
          difficultyReason: "The challenge is applying the limits of a less invasive strategy to the actual operative findings.",
          sequenceCheck: "Feedback separates source control from reconstruction and gives no answer-specific anastomotic eligibility criteria.",
          limitation: "The counterfactual makes lavage potentially reasonable and does not claim it becomes universally preferred. This high-acuity decision is displayed as retrospective clinic chart review.",
        },
      },
      {
        slug: "stable-primary-reconstruction",
        conceptId: reconstructionConcept,
        conceptRelation: "new_meaning",
        displayName: "Reconstruction after emergency diverticular resection",
        objective: "Select reconstruction after emergency sigmoid resection using patient physiology, host risk and bowel condition.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which reconstruction best fits {patientName}'s findings after sigmoid resection?",
        update: "After source resection, blood pressure remained stable without vasopressors. He had no major comorbidity, took no immunosuppressive drugs and had maintained his weight before the illness. The planned bowel ends were perfused, free of gross inflammation and reached without tension. The operating colorectal surgeon documented these findings.",
        correctChoice: "primary",
        choices: [
          {
            id: "hartmann",
            label: "Close the rectal stump and form an end colostomy",
            rationale: "Hartmann reconstruction remains appropriate for a high-risk host or unstable physiology. This record supplies the selected conditions under which restoration of continuity is supported.",
            temptation: "Treating the original fecal contamination as an automatic requirement for an end colostomy.",
            reasonableWhen: "Critical illness, substantial host risk or unsuitable bowel makes an immediate colorectal anastomosis unfavorable.",
            claims: ["primary-anastomosis-selection", "hartmann-high-risk", "staged-source-control"],
          },
          {
            id: "primary",
            label: "Create a colorectal anastomosis with a diverting loop ileostomy",
            rationale: "The host, physiology and bowel observations support primary restoration with proximal diversion in this selected patient.",
            temptation: "Weighing the post-resuscitation and intraoperative assessment against a traditional default.",
            reasonableWhen: "A selected stable patient has suitable bowel and appropriate operative conditions for reconstruction.",
            claims: ["primary-anastomosis-selection"],
          },
          {
            id: "discontinuity",
            label: "Leave bowel ends closed for a staged reconstruction",
            rationale: "Staged reconstruction is valuable during physiologic extremis. The current record describes stable physiology and suitable bowel after source control.",
            temptation: "Applying a damage-control sequence solely because the operation was an emergency.",
            reasonableWhen: "Physiologic deterioration requires an abbreviated source-control operation and later reassessment.",
            claims: ["primary-anastomosis-selection", "hartmann-high-risk", "staged-source-control"],
          },
        ],
        explanation: "The reconstruction decision uses the current physiology, host risk and bowel assessment. Primary colorectal anastomosis with diversion is supported under these selected conditions. It is a conditional recommendation requiring exact-version clinician review.",
        claims: ["primary-anastomosis-selection", "hartmann-high-risk", "staged-source-control"],
        reasoning: {
          interpret: "Assess current perfusion, tension and host physiology after source control instead of carrying the original contamination label forward as the whole decision.",
          apply: "Choose primary continuity restoration with diversion for a selected suitable patient.",
          closestChoice: "hartmann",
          decidingObservation: "Stable unsupported circulation, acceptable host condition and perfused tension-free bowel ends.",
          consequenceOfError: "An automatic end-colostomy policy can forgo a supported restoration strategy in a suitable patient.",
          counterfactual: "Replace stable physiology and healthy host conditions with persistent vasopressor dependence, major comorbidity and edematous bowel. Hartmann reconstruction becomes the preferred offered definitive reconstruction if the team proceeds with definitive surgery.",
          counterfactualChoice: "hartmann",
          deletionTest: "Each host and bowel observation addresses an actual anastomotic eligibility dimension. The specific surgeon role records provenance. No generic phrase saying suitable for anastomosis was used.",
          cueAttack: "All three options are reconstructions at the same stage. Raw observations replace an eligibility conclusion. Prior feedback gives no host or bowel rule that answers this node.",
          stageAudit: "Three reconstruction strategies after the diseased segment has been resected.",
          difficulty: "hard",
          difficultyReason: "The resident must separate source-control indication from reconstruction and apply the limits of selected-trial evidence.",
          sequenceCheck: "Source-control feedback cannot choose the reconstruction without the new physiology and bowel findings. These data are withheld until this stage.",
          limitation: "Guidelines support consideration under selected conditions. Hartmann may remain defensible for reasons absent from a short record, so Melissa must confirm the intended ranking.",
        },
      },
    ],
  },
  {
    slug: "immunosuppressed-recovery",
    name: "Helen Shaw",
    age: 68,
    sex: "Female",
    complaint: "Treatment follow-up",
    presentation: "{patientName}, a 68-year-old woman, attends clinic after outpatient treatment of her first CT-confirmed sigmoid inflammatory episode. She receives tacrolimus and mycophenolate after a kidney transplant.",
    historicalAcuity: "stable",
    nodes: [
      {
        slug: "immunosuppressed-antibiotic-decision",
        conceptId: newConceptId("immunosuppressed-antibiotic-eligibility"),
        conceptRelation: "new_meaning",
        displayName: "Antibiotic eligibility during immunosuppression",
        objective: "Use immune status and observed disease severity to select antibiotic treatment for uncomplicated diverticulitis.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.198779ae87cae5e7"],
        task: "Which initial care plan best fits {patientName}'s acute assessment?",
        update: "At that visit CT showed focal sigmoid wall thickening and fat inflammation without a collection or free perforation. Pulse and blood pressure were normal, she ate without vomiting and pain was controlled with oral medication. Tacrolimus and mycophenolate had been continued throughout the illness. She had no penicillin allergy, renal function was preserved, and an early reassessment visit was arranged.",
        correctChoice: "oral-antibiotic",
        choices: [
          {
            id: "support",
            label: "Use oral hydration and analgesia with outpatient reassessment",
            rationale: "The reassuring CT and oral tolerance do not place a chronically immunosuppressed patient within the usual nonantibiotic-trial population.",
            temptation: "Extending the selected antibiotic-omission evidence to every radiologically uncomplicated episode.",
            reasonableWhen: "The patient is immunocompetent and otherwise meets selective outpatient omission criteria.",
            claims: ["selected-no-antibiotics", "antibiotics-immunosuppression"],
          },
          {
            id: "oral-antibiotic",
            label: "Start oral amoxicillin-clavulanate with outpatient reassessment",
            rationale: "Her immune status supports antibiotics despite limited CT disease. The supplied stability, oral tolerance and reassessment plan support an oral outpatient approach.",
            temptation: "Combining antibiotic eligibility with the actual clinical route and disposition assessment.",
            reasonableWhen: "Antibiotics are indicated and the patient can safely receive an appropriate oral regimen with close reassessment.",
            claims: ["antibiotics-immunosuppression", "oral-amoxicillin-clavulanate"],
          },
          {
            id: "inpatient",
            label: "Arrange inpatient intravenous antibiotic treatment and observation",
            rationale: "Hospital treatment is appropriate for deterioration, systemic illness, oral-intake failure or unsafe follow-up. Those features are not supplied by this stable assessment.",
            temptation: "Treating immune suppression as an automatic admission rule.",
            reasonableWhen: "Illness severity or inability to maintain a safe outpatient course warrants inpatient treatment.",
            claims: ["antibiotics-immunosuppression", "selected-no-antibiotics"],
          },
        ],
        explanation: "Immune suppression changes antibiotic eligibility even when CT shows limited disease. Route and disposition still follow the actual clinical assessment. In this constructed stable orally tolerant patient, the proposed plan is oral antibiotic treatment with early reassessment.",
        claims: ["uncomplicated-observations", "antibiotics-immunosuppression", "selected-no-antibiotics", "oral-amoxicillin-clavulanate"],
        reasoning: {
          interpret: "Distinguish uncomplicated imaging from membership in the immunocompetent antibiotic-omission population.",
          apply: "Select antibiotic treatment and then match its route to the observed stability and intake.",
          closestChoice: "support",
          decidingObservation: "Antirejection therapy after kidney transplantation continues during an otherwise stable orally tolerant episode.",
          consequenceOfError: "Applying omission data to an excluded host can undertreat a patient at higher complication concern.",
          counterfactual: "Remove immunosuppression and retain mild disease, oral tolerance, stability and reliable review. Supportive outpatient care becomes reasonable among the offered plans.",
          counterfactualChoice: "support",
          deletionTest: "Immune status determines treatment eligibility. Vitals, intake and follow-up determine route and disposition. Allergy and renal context support the named medicine without adding an invented dose.",
          cueAttack: "No pre-answer label says high risk or needs antibiotics. All options are complete initial care plans with reassessment. Immune status is a necessary clinical observation.",
          stageAudit: "Three initial treatment/disposition plans for the acute episode.",
          difficulty: "moderate",
          difficultyReason: "The resident must apply an evidence-population boundary while avoiding an automatic admission shortcut.",
          sequenceCheck: "First node. Feedback discusses acute antibiotic eligibility and gives no prophylactic elective-operation policy.",
          limitation: "Oral outpatient treatment in a chronically immunosuppressed patient is patient-specific. One checked highlight supports the named oral regimen. Exact severity and disposition ranking need Melissa's review.",
        },
      },
      {
        slug: "high-risk-recovered-observation",
        conceptId: electiveConcept,
        previousConceptId: previousElectiveConcept,
        conceptRelation: "new_version",
        displayName: "Elective sigmoid treatment selection after recovery",
        objective: "Select a concrete elective sigmoid treatment plan using ongoing burden, operative risk and informed patient priorities.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: ["inventory.5710c1c72bde2364"],
        task: "Which elective plan best fits {patientName}'s recovered clinic assessment?",
        update: "She recovered fully and returned to her previous bowel pattern. CT showed no collection or narrowing, and she had no further episodes. Pulmonary assessment documented substantial operative risk from chronic lung disease. After discussing recurrence, emergency care and operative complications, she preferred to continue nonsurgical care while symptoms remained absent.",
        correctChoice: "observe",
        choices: [
          {
            id: "colectomy",
            label: "Schedule elective sigmoid colectomy after recovery",
            rationale: "Chronic immunosuppression warrants an explicit discussion but does not mandate surgery after one successfully treated episode. Her current burden, operative risk and informed preference favor observation.",
            temptation: "Converting the acute immunosuppression-related antibiotic indication into a universal prophylactic operation rule.",
            reasonableWhen: "Recurrent burden or a complication and an informed patient's operative tradeoff support resection.",
            claims: ["immunosuppressed-elective-choice", "elective-burden"],
          },
          {
            id: "mesalamine",
            label: "Begin maintenance mesalamine during observation",
            rationale: "Routine mesalamine does not provide a supported recurrence-prevention strategy for diverticular disease.",
            temptation: "Adding maintenance anti-inflammatory medication because surgery is deferred.",
            reasonableWhen: "A distinct established IBD indication calls for mesalamine.",
            claims: ["elective-burden", "mesalamine-prevention", "elective-resection-tradeoff"],
          },
          {
            id: "observe",
            label: "Continue nonoperative follow-up with a recurrence response plan",
            rationale: "A patient-specific plan can favor observation after successful recovery when symptoms are absent, operative risk is substantial and the informed patient prefers nonsurgical care.",
            temptation: "Weighing present burden and surgical risk separately from acute antibiotic eligibility.",
            reasonableWhen: "The recovered patient's burden and informed preferences do not justify elective operative risk.",
            claims: ["immunosuppressed-elective-choice", "elective-burden"],
          },
        ],
        explanation: "The decision after recovery uses a new tradeoff. Acute antibiotic eligibility does not determine elective surgery. Continued observation fits the current symptom burden, operative assessment and informed preference.",
        claims: ["immunosuppressed-elective-choice", "elective-burden"],
        reasoning: {
          interpret: "Recognize successful recovery without a persisting structural complication or recurrent burden.",
          apply: "Weigh operative risk and informed preference to choose a concrete nonoperative plan.",
          closestChoice: "colectomy",
          decidingObservation: "Absent symptoms and recurrence coexist with substantial operative risk and a preference for observation.",
          consequenceOfError: "A blanket immune-status rule can expose the patient to an elective risk she has chosen to avoid.",
          counterfactual: "Replace the absent burden and high operative risk with repeated disabling attacks, a favorable preoperative assessment and informed preference for resection. Elective colectomy becomes reasonable.",
          counterfactualChoice: "colectomy",
          deletionTest: "Recovery establishes elective phase. Absent burden and structural complication prevent hidden surgery indications. Pulmonary assessment and informed preference determine the conditional choice.",
          cueAttack: "Options are specific elective strategies. The informed preference remains because it distinguishes reasonable plans. No vague individualized key is offered.",
          stageAudit: "Three prevention/follow-up strategies after full recovery.",
          difficulty: "moderate",
          difficultyReason: "The resident must avoid carrying a valid acute-treatment rule into a different care phase.",
          sequenceCheck: "Acute antibiotic feedback does not teach the elective conclusion. New recovery, risk and preference observations determine this node.",
          limitation: "The exact elective post-transplant boundary has one adequate current surgical guideline and needs named clinical review. The changed treatment-selection construct uses a new concept version.",
        },
      },
    ],
  },
  {
    slug: "ongoing-hemorrhage-review",
    name: "Arthur Lane",
    age: 72,
    sex: "Male",
    complaint: "Bleeding admission review",
    presentation: "{patientName}, a 72-year-old man, attends clinic after an outside admission for repeated passage of maroon blood. The founder reviews the hospital decisions in order.",
    historicalAcuity: "obvious_emergency",
    nodes: [
      {
        slug: "ongoing-bleeding-cta",
        conceptId: newConceptId("ongoing-bleeding-localization"),
        conceptRelation: "new_meaning",
        displayName: "CTA during ongoing significant hematochezia",
        objective: "Select CTA to localize ongoing hemodynamically significant suspected colonic bleeding when preparation is unsuitable.",
        conceptType: "workup",
        creationKind: "new",
        replacesInventoryIds: ["inventory.3ebd3aaf232dcca2"],
        task: "Which localization study best fits {patientName}'s hospital reassessment?",
        update: "After intravenous fluids and red-cell replacement, blood pressure repeatedly fell as further large bloody stools passed. An upper endoscopy found no blood or bleeding lesion. He vomited the attempted bowel preparation, and rectal output remained blood and clot. Resuscitation continued while the next investigation was arranged.",
        correctChoice: "cta",
        choices: [
          {
            id: "colonoscopy",
            label: "Colonoscopy after another attempt at full bowel preparation",
            rationale: "Colonoscopy can diagnose and treat bleeding in a stable adequately prepared patient. Continued significant bleeding and unsuccessful preparation make another preparation-dependent route less suitable at this reassessment.",
            temptation: "Applying the stable-bleeding colonoscopy pathway to continuing hemodynamic blood loss.",
            reasonableWhen: "The patient has stabilized and can complete preparation for diagnostic and therapeutic colonoscopy.",
            claims: ["cta-ongoing-bleeding", "bleeding-colon-preparation"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "cta",
            label: "Multiphase CT angiography of the abdomen and pelvis",
            rationale: "Ongoing significant blood loss offers a chance to localize active bleeding without requiring bowel preparation.",
            temptation: "Using the ongoing bleeding phase to choose a localization test that fits the present condition.",
            reasonableWhen: "Suspected colonic bleeding remains hemodynamically significant and a preparation-based examination is unsuitable.",
            claims: ["cta-ongoing-bleeding", "scintigraphy-intermittent"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "scan",
            label: "Tagged red-cell scintigraphy of the abdomen and pelvis",
            rationale: "Scintigraphy can help with intermittent bleeding. CTA offers a more useful prompt anatomic localization route for this continuing significant hemorrhage.",
            temptation: "Choosing a sensitive intermittent-bleeding study despite an actively severe episode.",
            reasonableWhen: "A stable intermittent obscure bleed calls for a selected radionuclide localization approach.",
            claims: ["cta-ongoing-bleeding", "scintigraphy-intermittent"],
            timingProfileId: "timing.test.nuclear_imaging",
          },
        ],
        explanation: "The repeated blood loss and circulatory response establish an ongoing significant bleed. After assessment of the upper tract, CTA is the proposed localization study while resuscitation continues. The bleeding phase and preparation failure determine the choice.",
        claims: ["cta-ongoing-bleeding", "bleeding-colon-preparation"],
        reasoning: {
          interpret: "Distinguish persistent hemodynamically important blood loss from a stopped bleed after initial resuscitation, while accounting for upper-source evaluation.",
          apply: "Choose a current localization strategy that does not depend on successful bowel preparation.",
          closestChoice: "colonoscopy",
          decidingObservation: "Further large bloody stools repeatedly worsen circulation, and the attempted preparation is not retained.",
          consequenceOfError: "Repeated preparation attempts can postpone localization during continued blood loss.",
          counterfactual: "Replace continued blood loss and vomiting with sustained stability, cessation of bleeding and successful preparation. Colonoscopy becomes the appropriate offered investigation.",
          counterfactualChoice: "colonoscopy",
          deletionTest: "The trajectory determines active severity. Upper endoscopy prevents an unresolved upper-source alternative. Preparation response distinguishes CTA from a reasonable colonoscopy pathway.",
          cueAttack: "The task asks for localization without naming an angiographic property. Every option is a localization test with a mapped estimate. Continued resuscitation is common care rather than a distractor.",
          stageAudit: "Three localization investigations after initial resuscitation and upper-tract assessment.",
          difficulty: "hard",
          difficultyReason: "The resident must use actual response and preparation tolerance to select between credible diagnostic pathways.",
          sequenceCheck: "First node. Feedback explains the localization choice without naming a future radiologic treatment.",
          limitation: "Current ACG guidance was checked through its official author presentation. This does not assert a universal CTA-first policy or a fixed time-to-scan rule.",
        },
      },
      {
        slug: "positive-cta-embolization",
        conceptId: embolizationConcept,
        conceptRelation: "new_meaning",
        displayName: "Angiographic treatment selection for ongoing colonic bleeding",
        objective: "Select angiographic assessment with possible embolization for a localized ongoing significant colonic bleed unsuitable for immediate prepared colonoscopy.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which next hemostatic plan best fits {patientName}'s CTA and continuing course?",
        update: "On CTA, the ascending-colon lumen contained no dense focus before contrast. A new focus appeared during the arterial phase and enlarged into the lumen on the later phase. He continued to pass blood and require resuscitation. The earlier preparation had not cleared the colon.",
        correctChoice: "ir",
        choices: [
          {
            id: "surgery",
            label: "Perform urgent right colectomy for hemorrhage control",
            rationale: "Surgery can be necessary after failed or unsuitable less invasive measures. The localized active bleed supplies an angiographic treatment opportunity before colectomy.",
            temptation: "Treating an identified colonic source as an immediate surgical indication.",
            reasonableWhen: "Endoscopic and radiologic control have failed or are unsuitable and the bleeding course requires surgery.",
            claims: ["positive-cta-ir", "localized-rescue-resection"],
          },
          {
            id: "colonoscopy",
            label: "Repeat bowel preparation followed by therapeutic colonoscopy",
            rationale: "Prepared colonoscopy can be useful in selected centers and patients. Continued resuscitation needs and unsuccessful preparation make prompt angiographic treatment the proposed route here.",
            temptation: "Returning to the familiar endoscopic pathway after CTA has localized continuing active blood loss.",
            reasonableWhen: "The patient can stabilize and complete preparation, with an appropriate endoscopic treatment pathway.",
            claims: ["positive-cta-ir", "bleeding-colon-preparation"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "ir",
            label: "Proceed to selective angiography with possible embolization",
            rationale: "The changing intraluminal contrast focus indicates active extravasation in the setting of continued significant bleeding. Prompt angiographic treatment is supported.",
            temptation: "Interpreting the sequential contrast phases and applying them to the continuing clinical course.",
            reasonableWhen: "CTA localizes an active colonic bleed and radiologic hemostasis fits the patient's condition.",
            claims: ["positive-cta-ir", "dynamic-cta-observation"],
            timingProfileId: "timing.test.advanced_diagnostic",
          },
        ],
        explanation: "A focus that appears with arterial contrast and enlarges in the lumen represents active bleeding. In this continuing significant bleed with unsuccessful preparation, selective angiography with possible embolization is the proposed next hemostatic route.",
        claims: ["positive-cta-ir", "bleeding-colon-preparation", "localized-rescue-resection"],
        reasoning: {
          interpret: "Distinguish newly accumulating intraluminal contrast from pre-existing dense stool or a fixed incidental finding.",
          apply: "Use localized active bleeding and the current preparation/hemodynamic context to select angiographic treatment.",
          closestChoice: "colonoscopy",
          decidingObservation: "Dynamic intraluminal contrast accumulation accompanies continuing resuscitation-dependent bleeding and uncleared bowel.",
          consequenceOfError: "Delaying a suitable hemostatic route can permit continuing blood loss.",
          counterfactual: "Replace the continuing resuscitation need and failed preparation with sustained stability and a completed full preparation. Therapeutic colonoscopy becomes a reasonable route among these choices.",
          counterfactualChoice: "colonoscopy",
          deletionTest: "The precontrast and later phases establish the nature of the focus. The continuing course prevents using a static localization result in isolation. Preparation remains necessary to distinguish a competing accepted route.",
          cueAttack: "The report supplies phase observations instead of the label active extravasation. All options are specific hemostatic plans. Both procedure-based diagnostic paths have estimates.",
          stageAudit: "Three hemostatic treatment routes after a localization study.",
          difficulty: "hard",
          difficultyReason: "The learner must interpret acquisition phases and then choose a treatment route using actual ongoing physiology.",
          sequenceCheck: "The previous explanation does not name embolization. The contrast result and continuing course are revealed only here.",
          limitation: "The exhibit is a constructed written radiology record. Image interpretation is not claimed, and no source scan is reproduced. Selected-center colonoscopy remains a real alternative requiring clinical ranking review.",
        },
      },
    ],
  },
  {
    slug: "stopped-bleed-review",
    name: "Ruth Lawson",
    age: 66,
    sex: "Female",
    complaint: "Bleeding follow-up",
    presentation: "{patientName}, a 66-year-old woman, attends clinic after an outside admission for rectal bleeding. The founder reviews her hospital workup.",
    historicalAcuity: "urgent_stable",
    nodes: [
      {
        slug: "stable-bleed-colonoscopy",
        conceptId: newConceptId("stable-bleeding-colonoscopy"),
        conceptRelation: "new_meaning",
        displayName: "Prepared nonemergent colonoscopy after stabilization",
        objective: "Select nonemergent prepared colonoscopy when a hospitalized lower-GI bleed has stopped and the patient is stable.",
        conceptType: "workup",
        creationKind: "new",
        replacesInventoryIds: ["inventory.203664394b8ef156"],
        task: "Which investigation plan best fits {patientName}'s hospital reassessment?",
        update: "After initial fluid replacement, she had no further bloody stool. Serial pulse and blood-pressure measurements remained stable, and hemoglobin did not continue to fall. She tolerated oral liquids. Her last complete colon examination was several years earlier, and no source had been established during this admission.",
        correctChoice: "colonoscopy",
        choices: [
          {
            id: "cta",
            label: "Obtain immediate CT angiography for active-source localization",
            rationale: "CTA has lower yield after bleeding has clinically stopped. The present stable course supports a prepared luminal examination.",
            temptation: "Applying the severe ongoing-bleeding CTA pathway to every hospitalized bleed.",
            reasonableWhen: "Further significant hematochezia and hemodynamic effects suggest ongoing active bleeding.",
            claims: ["cta-ongoing-bleeding", "stable-nonemergent-colonoscopy"],
            timingProfileId: "timing.test.ct",
          },
          {
            id: "scan",
            label: "Obtain tagged red-cell scintigraphy for source localization",
            rationale: "Scintigraphy may help selected intermittent obscure bleeding. It does not replace the indicated colon evaluation in this stable patient without a current examination.",
            temptation: "Seeking a bleeding signal instead of evaluating the colon after an unlocalized episode.",
            reasonableWhen: "Intermittent obscure bleeding persists after an appropriate luminal assessment and the selected workup calls for scintigraphy.",
            claims: ["cta-ongoing-bleeding", "stable-nonemergent-colonoscopy"],
            timingProfileId: "timing.test.nuclear_imaging",
          },
          {
            id: "colonoscopy",
            label: "Arrange nonemergent inpatient colonoscopy after preparation",
            rationale: "She is stable, bleeding has stopped and she can prepare. Colonoscopy can assess the source without a routine emergency timing requirement.",
            temptation: "Using the actual response to select a different pathway from the ongoing severe-bleeding algorithm.",
            reasonableWhen: "A stable hospitalized patient needs colon evaluation after a lower-GI bleeding episode.",
            claims: ["stable-nonemergent-colonoscopy", "bleeding-colon-preparation"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
        ],
        explanation: "Her observed course supports prepared nonemergent inpatient colonoscopy. A routine urgent deadline has not improved important outcomes in most hospitalized lower-GI bleeds. Active-bleeding imaging becomes more useful if significant bleeding resumes.",
        claims: ["stable-nonemergent-colonoscopy", "bleeding-colon-preparation", "cta-ongoing-bleeding"],
        reasoning: {
          interpret: "Recognize sustained cessation of bleeding and hemodynamic stability from serial observations.",
          apply: "Select a prepared nonemergent luminal investigation rather than low-yield active-bleeding imaging.",
          closestChoice: "cta",
          decidingObservation: "No additional bleeding, stable serial measurements and no further hemoglobin decline.",
          consequenceOfError: "An indiscriminate CTA pathway can add a low-yield study while leaving the luminal investigation outstanding.",
          counterfactual: "Replace cessation and serial stability with ongoing large bloody stools and repeated circulatory deterioration. CTA becomes the appropriate offered localization study.",
          counterfactualChoice: "cta",
          deletionTest: "Serial observations establish the phase of bleeding. Oral tolerance permits preparation. The outdated examination and unlocalized admission establish the need for colon evaluation.",
          cueAttack: "The task does not request a timing rule or name colonoscopy. Three study plans have comparable diagnostic scope and explicit wait profiles. No fixed scheduling duration is authored.",
          stageAudit: "Three investigation plans after initial treatment and reassessment.",
          difficulty: "moderate",
          difficultyReason: "The resident must differentiate a currently stopped bleed from the original dramatic presentation.",
          sequenceCheck: "First node. Feedback identifies the role of colonoscopy but supplies no lesion-treatment rule.",
          limitation: "One current ACG publication supports the nonemergent recommendation. Historical 2016 urgent timing was excluded. Exact scheduling remains clinical and resource dependent.",
        },
      },
      {
        slug: "nonbleeding-vessel-treatment",
        conceptId: newConceptId("diverticular-stigma-treatment"),
        conceptRelation: "new_meaning",
        displayName: "Treatment of a nonbleeding diverticular vessel",
        objective: "Recognize a high-risk diverticular hemorrhage finding and select definitive local endoscopic treatment despite cessation of active flow.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which treatment plan best fits {patientName}'s colonoscopy findings?",
        update: "After full preparation, the endoscopist found a focal exposed vessel at the neck of a sigmoid diverticulum. It remained after washing, although no blood was flowing at that moment. Inspection found no other bleeding lesion.",
        correctChoice: "clip",
        choices: [
          {
            id: "observe",
            label: "End the examination after washing the area",
            rationale: "A visible vessel remains a high-risk hemorrhage finding even when active flow has stopped.",
            temptation: "Equating the absence of active flow with the absence of a treatable high-risk lesion.",
            reasonableWhen: "Adequate inspection shows incidental diverticula without a bleeding stigma or another lesion requiring treatment.",
            claims: ["diverticular-stigmata"],
          },
          {
            id: "inject",
            label: "Inject dilute epinephrine at the observed site",
            rationale: "Injection can provide temporary control but does not supply the intended definitive treatment without another modality.",
            temptation: "Using a familiar immediate-control technique as the completed hemostatic plan.",
            reasonableWhen: "Temporary control is needed to improve visualization before definitive mechanical or thermal therapy.",
            claims: ["epinephrine-not-definitive"],
          },
          {
            id: "clip",
            label: "Apply endoscopic clips at the observed site",
            rationale: "The exposed vessel supports treatment, and clipping is an accepted definitive local hemostatic modality for an accessible diverticular site.",
            temptation: "Interpreting the remaining vessel as clinically important despite stopped bleeding.",
            reasonableWhen: "An identified diverticular bleeding site can be treated by a suitable endoscopic clipping approach.",
            claims: ["diverticular-stigmata", "endoscopic-clips"],
          },
        ],
        explanation: "A nonbleeding visible vessel is a high-risk hemorrhage finding. Treat the site despite the absence of current flow. Clipping is an accepted option, and temporary injection should not be the endpoint of treatment.",
        claims: ["diverticular-stigmata", "endoscopic-clips", "epinephrine-not-definitive"],
        reasoning: {
          interpret: "Recognize the persistent vessel as a bleeding stigma rather than an incidental diverticulum.",
          apply: "Select definitive endoscopic treatment rather than observation or temporary injection as the endpoint.",
          closestChoice: "observe",
          decidingObservation: "An exposed vessel remains visible after washing despite no current blood flow.",
          consequenceOfError: "Stopping at visual cessation or transient control leaves a high-risk site untreated.",
          counterfactual: "Replace the exposed vessel with clean diverticula after adequate washing and inspection. Completing the examination without local hemostatic treatment becomes reasonable.",
          counterfactualChoice: "observe",
          deletionTest: "The washed persistent vessel distinguishes a stigma from removable material. Its exposed neck location supplies the anatomic target. No-flow status creates the credible observation error.",
          cueAttack: "The written record supplies a washed persistent vessel. Removed the sentence naming clip access before answering. Three procedural plans have comparable scope. The clip-versus-band evidence boundary remains withheld.",
          stageAudit: "Three end-of-procedure local hemostatic plans for the same observed site.",
          difficulty: "moderate",
          difficultyReason: "The resident must treat future bleeding risk conveyed by a present finding despite apparently successful spontaneous cessation.",
          sequenceCheck: "The preceding colonoscopy explanation gives no stigma or treatment criterion. The focal finding enters only at this stage.",
          limitation: "The exact stigma and injection principles have one directly retrieved historical guideline. Current ASGE 2026 hierarchy needs permitted verification. This draft avoids that hierarchy and remains under review.",
        },
      },
    ],
  },
  {
    slug: "recurrent-localized-hemorrhage",
    name: "Samuel Porter",
    age: 70,
    sex: "Male",
    complaint: "Recurrent bleeding review",
    presentation: "{patientName}, a 70-year-old man, attends clinic after an outside admission for recurrent colonic bleeding. The founder reviews the endoscopic, radiologic and surgical records in sequence.",
    historicalAcuity: "obvious_emergency",
    nodes: [
      {
        slug: "rebleed-after-clipping",
        conceptId: embolizationConcept,
        conceptRelation: "new_meaning",
        displayName: "Angiographic treatment selection for ongoing colonic bleeding",
        objective: "Select angiographic assessment with possible embolization for a localized ongoing significant colonic bleed unsuitable for immediate prepared colonoscopy.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which next hemostatic plan best fits {patientName}'s recurrent hospital bleeding?",
        update: "A prepared colonoscopy had treated an actively bleeding ascending-colon diverticulum with clips. Later, recurrent large bloody stools required further transfusion and fluid replacement. Repeat CTA showed active contrast accumulation beside the marked ascending-colon site. The colon had again filled with blood and clot, and his blood pressure fell during further bleeding.",
        correctChoice: "ir",
        choices: [
          {
            id: "colonoscopy",
            label: "Repeat full preparation and endoscopic hemostasis",
            rationale: "Repeat colonoscopy is reasonable in selected stable prepared recurrences. The continuing significant blood loss and newly localized active source support radiologic hemostasis here.",
            temptation: "Repeating the initially successful modality without incorporating the changed physiology and bowel contents.",
            reasonableWhen: "The recurrence is stable enough for effective preparation and repeat endoscopic treatment.",
            claims: ["repeat-bleed-escalation", "bleeding-colon-preparation"],
            timingProfileId: "timing.test.lower_endoscopy",
          },
          {
            id: "colectomy",
            label: "Proceed directly to right colectomy for hemorrhage control",
            rationale: "The localization makes surgery possible if needed. A radiologic treatment route remains to be attempted before surgical rescue.",
            temptation: "Interpreting one failed endoscopic attempt as exhaustion of less invasive hemostatic strategies.",
            reasonableWhen: "Bleeding remains consequential after failed or unsuitable endoscopic and radiologic control.",
            claims: ["localized-rescue-resection", "repeat-bleed-escalation"],
          },
          {
            id: "ir",
            label: "Proceed to selective angiography with possible embolization",
            rationale: "CTA localizes recurrent active bleeding after endoscopic treatment, and the continuing course is poorly suited to another preparation-dependent examination.",
            temptation: "Selecting the next hemostatic route from the actual failed treatment and current localized bleeding.",
            reasonableWhen: "Ongoing severe recurrent colonic bleeding after endoscopy is suitable for radiologic hemostasis.",
            claims: ["positive-cta-ir", "repeat-bleed-escalation"],
            timingProfileId: "timing.test.advanced_diagnostic",
          },
        ],
        explanation: "The recurrence is ongoing and hemodynamically significant after attempted endoscopic treatment. CTA supplies a current anatomic target. Selective angiography with possible embolization is the proposed next route.",
        claims: ["positive-cta-ir", "repeat-bleed-escalation", "bleeding-colon-preparation", "localized-rescue-resection"],
        reasoning: {
          interpret: "Distinguish recurrent substantial bleeding after a treated lesion from persistent incidental old blood.",
          apply: "Escalate to a localized radiologic treatment opportunity before rescue resection.",
          closestChoice: "colonoscopy",
          decidingObservation: "New active CTA accumulation accompanies recurrent blood loss and circulatory deterioration after clipping.",
          consequenceOfError: "Repeating a preparation-dependent plan can delay hemostasis during continued blood loss.",
          counterfactual: "Replace the significant circulatory recurrence with a stable small-volume recurrence while the colon remains adequately prepared. Repeat endoscopic assessment becomes reasonable.",
          counterfactualChoice: "colonoscopy",
          deletionTest: "Initial clipping establishes the completed treatment. New CTA distinguishes current active blood loss. The present physiology and bowel contents distinguish repeat endoscopy from angiographic rescue.",
          cueAttack: "All options name specific hemostatic plans. No text says endoscopy failed or IR is available. The resident must infer the significance of the actual recurrent course.",
          stageAudit: "Three rescue hemostatic routes after an attempted endoscopic treatment.",
          difficulty: "hard",
          difficultyReason: "The initially successful treatment remains tempting until the learner integrates new physiology, anatomy and visualization limits.",
          sequenceCheck: "First node. Feedback does not name a future resection segment or imply that embolization has already failed.",
          limitation: "The same new embolization concept is reused across two distinct contexts. It adds a variant without creating a second concept for the same decision.",
        },
      },
      {
        slug: "localized-surgical-rescue",
        conceptId: newConceptId("localized-bleeding-resection"),
        conceptRelation: "new_meaning",
        displayName: "Localized resection after failed bleeding control",
        objective: "Use concordant anatomic localization to select the bleeding segment for surgical rescue after failed endoscopic and radiologic therapy.",
        conceptType: "management",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which resection best fits {patientName}'s subsequent hemorrhage-control decision?",
        update: "Angiography confirmed the ascending-colon site and embolization initially stopped bleeding. Hemorrhage then recurred despite repeat endoscopic and radiologic attempts. After multidisciplinary review, resection was selected. The colonoscopy report described many sigmoid diverticula but no left-colon bleeding stigma. CTA, endoscopy and angiography all localized active bleeding to the ascending segment. Upper endoscopy and the terminal ileum showed no blood source.",
        correctChoice: "right",
        choices: [
          {
            id: "sigmoid",
            label: "Sigmoid colectomy",
            rationale: "The greatest diverticular burden does not identify the bleeding source. All direct localization evidence points to the ascending colon.",
            temptation: "Choosing the segment with the most diverticula or the most familiar diverticular location.",
            reasonableWhen: "Concordant studies localize the culprit bleeding site to the sigmoid segment.",
            claims: ["localized-rescue-resection"],
          },
          {
            id: "right",
            label: "Right colectomy",
            rationale: "The ascending-colon source is concordantly established after failed less invasive control. Source-directed resection matches that localization.",
            temptation: "Using direct source evidence to determine operative extent.",
            reasonableWhen: "A refractory bleed is securely localized to the right colon and the operative assessment supports segmental resection.",
            claims: ["localized-rescue-resection"],
          },
          {
            id: "subtotal",
            label: "Subtotal colectomy",
            rationale: "More extensive resection can be considered in an unlocalized uncontrollable colonic bleed. The present record has a concordantly localized right-colon target.",
            temptation: "Treating severe recurrent bleeding as if its anatomic origin were still unknown.",
            reasonableWhen: "A surgical rescue decision is required but adequate efforts cannot localize a colonic source, after excluding other origins.",
            claims: ["localized-rescue-resection"],
          },
        ],
        explanation: "The source is the ascending segment on three concordant modalities. The sigmoid diverticula are an incidental distribution finding. When surgical rescue is selected, operative extent should follow credible localization rather than the greatest diverticular burden.",
        claims: ["localized-rescue-resection"],
        reasoning: {
          interpret: "Separate direct source localization from incidental disease distribution and distinguish treatment failure from uncertainty about the source.",
          apply: "Select the corresponding source-directed resection after the rescue-operation decision has been made.",
          closestChoice: "subtotal",
          decidingObservation: "Three modalities concordantly localize the active site to the ascending colon despite extensive sigmoid diverticula.",
          consequenceOfError: "The wrong segment can leave the culprit behind, while unnecessary extensive resection increases operative burden.",
          counterfactual: "Change the three concordant localizations to a sigmoid culprit while retaining failed less invasive control. Sigmoid colectomy becomes the source-directed operation.",
          counterfactualChoice: "sigmoid",
          deletionTest: "Completed failed therapies establish the operative phase. Concordant localization and absent alternate origin establish extent. Incidental sigmoid disease creates the credible anatomic anchoring error.",
          cueAttack: "Options are three named resections with comparable grammar. The task does not say localized or segmental. No prevalence cue determines the target.",
          stageAudit: "Three resection extents after the team has already selected surgical rescue.",
          difficulty: "hard",
          difficultyReason: "The resident must distinguish source certainty from severity and from incidental diverticular distribution.",
          sequenceCheck: "Prior feedback identifies a radiologic opportunity and does not teach surgical extent. Actual embolization response, later failures and concordance enter in this node.",
          limitation: "One directly accessed historical guideline supports this surgical localization principle. It does not establish a universal segmental-versus-subtotal outcome hierarchy. Melissa must confirm the exact offered ranking.",
        },
      },
    ],
  },
  {
    slug: "high-risk-reconstruction",
    name: "Victor Hayes",
    age: 76,
    sex: "Male",
    complaint: "Reconstruction review",
    presentation: "{patientName}, a 76-year-old man, attends clinic after emergency sigmoid resection at an outside hospital. The founder reviews the reconstruction decision documented during surgery.",
    historicalAcuity: "obvious_emergency",
    nodes: [{
      slug: "high-risk-hartmann",
      conceptId: reconstructionConcept,
      conceptRelation: "new_meaning",
      displayName: "Reconstruction after emergency diverticular resection",
      objective: "Select reconstruction after emergency sigmoid resection using patient physiology, host risk and bowel condition.",
      conceptType: "management",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which reconstruction best fits {patientName}'s operative record?",
      update: "After resection for diffuse diverticular peritonitis, he still required norepinephrine to maintain circulation. He had severe chronic lung disease and was taking long-term corticosteroids. The bowel was edematous. The team proceeded with definitive closure of the abdomen during that operation.",
      correctChoice: "hartmann",
      choices: [
        {
          id: "primary",
          label: "Colorectal anastomosis without proximal diversion",
          rationale: "Persistent support needs and major host-risk factors fall outside the selected favorable conditions for this reconstruction.",
          temptation: "Applying favorable selected-patient anastomosis evidence to a critically ill host.",
          reasonableWhen: "A fully reassessed stable patient has favorable host and bowel conditions and the surgeon judges an undiverted anastomosis appropriate.",
          claims: ["primary-anastomosis-selection", "hartmann-high-risk", "staged-source-control"],
        },
        {
          id: "divert",
          label: "Colorectal anastomosis with a diverting loop ileostomy",
          rationale: "Diversion does not remove the risk of creating an anastomosis in an unfavorable host and physiologic state. Hartmann is the supported offered definitive reconstruction for this high-risk setting.",
          temptation: "Treating proximal diversion as complete protection against adverse anastomotic conditions.",
          reasonableWhen: "Stable physiology, suitable bowel and host assessment support a selected primary reconstruction with diversion.",
          claims: ["primary-anastomosis-selection", "hartmann-high-risk", "staged-source-control"],
        },
        {
          id: "hartmann",
          label: "Rectal-stump closure with an end colostomy",
          rationale: "Persistent vasopressor support and substantial host risk support Hartmann reconstruction among these definitive choices.",
          temptation: "Integrating current physiology and host risk rather than applying the stable-patient pathway.",
          reasonableWhen: "A critically ill or substantially comorbid patient requires a definitive reconstruction after resection for diffuse diverticular peritonitis.",
          claims: ["hartmann-high-risk"],
        },
      ],
      explanation: "This host and physiology differ from the selected stable-patient population supporting primary anastomosis. Among the offered definitive reconstructions, Hartmann is the proposed choice. Staged damage-control strategies are a separate judgment when definitive closure is deferred.",
      claims: ["hartmann-high-risk", "primary-anastomosis-selection"],
      reasoning: {
        interpret: "Recognize persistent critical illness and unfavorable host conditions after source resection.",
        apply: "Select a supported definitive reconstruction without assuming that a diverting stoma eliminates anastomotic risk.",
        closestChoice: "divert",
        decidingObservation: "Continued vasopressor support, chronic corticosteroids, severe lung disease and edematous bowel.",
        consequenceOfError: "Generalizing favorable-host evidence can create an anastomosis under an unsupported risk profile.",
        counterfactual: "Replace ongoing support and host-risk findings with stable unsupported circulation, healthy bowel and acceptable host condition. Primary anastomosis with diversion becomes reasonable.",
        counterfactualChoice: "divert",
        deletionTest: "Current support and host factors establish the risk boundary. Bowel edema contributes local context. Documented definitive closure defines the offered reconstruction stage without claiming damage control is unavailable.",
        cueAttack: "All three labels are definitive reconstructions. The task names the documented stage. No rationale, prognosis percentage or categorical no-anastomosis sentence precedes the choice.",
        stageAudit: "Three definitive reconstructions after resection, with staged closure outside the documented decision.",
        difficulty: "hard",
        difficultyReason: "The resident must apply limits of the primary-anastomosis evidence and avoid viewing diversion as universal protection.",
        sequenceCheck: "Standalone context prevents another reconstruction answer from rehearsing this host-risk discriminator.",
        limitation: "WSES supplies the direct high-risk recommendation. The preexisting definitive-closure decision is a constructed record constraint that must earn clinical review. A staged-operation decision is not scored.",
      },
    }],
  },
  {
    slug: "elective-resection-planning",
    name: "Mara Collins",
    age: 57,
    sex: "Female",
    complaint: "Surgery planning",
    presentation: "{patientName}, a 57-year-old woman, attends clinic to review the planned extent of elective surgery for recurrent sigmoid diverticulitis.",
    historicalAcuity: "stable",
    nodes: [{
      slug: "healthy-resection-boundaries",
      conceptId: newConceptId("elective-resection-boundaries"),
      conceptRelation: "new_meaning",
      displayName: "Healthy boundaries for elective sigmoid resection",
      objective: "Choose resection boundaries that remove diseased sigmoid and reach healthy rectum while preserving uninvolved proximal colon.",
      conceptType: "management",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which resection plan best fits {patientName}'s operative anatomy?",
      update: "Her disease was confined to a thickened, fibrotic sigmoid segment. The descending colon was soft and free of inflammation but contained scattered diverticula. The proximal rectum was healthy. The colon could reach the rectum without tension after mobilization. Preoperative colonic assessment found no other lesion requiring resection.",
      correctChoice: "sigmoid",
      choices: [
        {
          id: "limited",
          label: "Remove the thickened segment and join descending colon to distal sigmoid",
          rationale: "Leaving distal sigmoid as the anastomotic target does not follow the recommended rectal distal boundary.",
          temptation: "Minimizing resection to the visibly thickest area without considering the distal sigmoid remnant.",
          reasonableWhen: "A different focal colonic lesion has an evidence-supported segmental resection with those healthy boundaries.",
          claims: ["resection-margins"],
        },
        {
          id: "sigmoid",
          label: "Remove the diseased sigmoid and join descending colon to rectum",
          rationale: "This removes the diseased sigmoid, uses a healthy proximal margin and reaches rectum. Uninflamed proximal diverticula do not by themselves justify additional resection.",
          temptation: "Applying disease boundaries and the distal target separately.",
          reasonableWhen: "Sigmoid disease can be resected with healthy proximal bowel and a suitable rectal anastomosis.",
          claims: ["resection-margins"],
        },
        {
          id: "extended",
          label: "Remove sigmoid and descending colon and join transverse colon to rectum",
          rationale: "Scattered diverticula in soft uninflamed descending colon do not establish a need to remove that additional segment.",
          temptation: "Treating every diverticulum as tissue that must be removed to prevent recurrence.",
          reasonableWhen: "The descending colon also has relevant disease or another indication for resection.",
          claims: ["resection-margins"],
        },
      ],
      explanation: "Resection should remove the diseased sigmoid and use healthy proximal colon with a rectal distal target. Uninflamed proximal diverticula do not require an extended colectomy.",
      claims: ["resection-margins"],
      reasoning: {
        interpret: "Distinguish diverticula from inflamed or fibrotic disease and identify the rectal distal target.",
        apply: "Choose the operation matching both healthy-margin requirements without unnecessary proximal extension.",
        closestChoice: "limited",
        decidingObservation: "The distal target in the limited plan remains sigmoid, while the descending colon is healthy despite diverticula.",
        consequenceOfError: "A retained sigmoid anastomotic target can leave an unfavorable disease boundary, while extension removes uninvolved colon.",
        counterfactual: "Extend clinically relevant inflammation and fibrosis into the descending colon while preserving a healthy transverse margin. The extended resection becomes reasonable.",
        counterfactualChoice: "extended",
        deletionTest: "The proximal tissue description distinguishes disease from diverticulosis. The distal and reach observations establish a feasible rectal target. Other-lesion assessment prevents a hidden reason for extension.",
        cueAttack: "All options state complete proximal and distal boundaries with comparable specificity. The key is not the shortest operation. No component majority uniquely selects its combination.",
        stageAudit: "Three extents of the same elective resection and anastomosis plan.",
        difficulty: "hard",
        difficultyReason: "The resident must solve independent proximal and distal boundary errors while interpreting the actual anatomy.",
        sequenceCheck: "Standalone operative-planning context gives no previous explanation that names the target boundaries.",
        limitation: "One directly checked current surgical guideline supplies the exact technical boundary. This is an original written anatomy record and does not claim to be an operative image exhibit.",
      },
    }],
  },
  {
    slug: "secondary-prevention-aspirin",
    name: "Peter Walsh",
    age: 63,
    sex: "Male",
    complaint: "Medication review",
    presentation: "{patientName}, a 63-year-old man, attends clinic after successful treatment of a diverticular hemorrhage at an outside hospital.",
    historicalAcuity: "stable",
    nodes: [{
      slug: "continue-secondary-aspirin",
      conceptId: newConceptId("secondary-prevention-aspirin"),
      conceptRelation: "new_meaning",
      displayName: "Aspirin indication after controlled diverticular bleeding",
      objective: "Preserve aspirin for established cardiovascular disease after controlled lower-GI bleeding while avoiding nonaspirin NSAID exposure.",
      conceptType: "management",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which discharge medication plan best fits {patientName}'s records?",
      update: "The bleeding site was treated and there had been no further blood loss. Aspirin was prescribed after a documented myocardial infarction. He also used naproxen for knee pain. He was taking no other antiplatelet or anticoagulant drug.",
      correctChoice: "aspirin-stop-naproxen",
      choices: [
        {
          id: "both",
          label: "Continue aspirin and continue naproxen",
          rationale: "The cardiovascular aspirin indication remains, but nonaspirin NSAID exposure should be avoided when feasible after diverticular bleeding.",
          temptation: "Keeping the whole preadmission regimen because bleeding has stopped.",
          reasonableWhen: "A separate compelling NSAID need has been reviewed against bleeding risk and the clinician accepts that tradeoff.",
          claims: ["aspirin-secondary", "nsaid-rebleeding"],
        },
        {
          id: "aspirin-stop-naproxen",
          label: "Continue aspirin and discontinue naproxen",
          rationale: "Aspirin serves established secondary prevention. Naproxen provides no equivalent cardiovascular indication and adds a relevant recurrent-bleeding concern.",
          temptation: "Separating the two medicines by indication and bleeding consequence.",
          reasonableWhen: "Hemostasis is secure, aspirin is indicated for established cardiovascular disease and a nonaspirin NSAID can be avoided.",
          claims: ["aspirin-secondary", "nsaid-rebleeding"],
        },
        {
          id: "stop-aspirin",
          label: "Discontinue aspirin and continue naproxen",
          rationale: "This removes secondary cardiovascular prevention while retaining the avoidable NSAID exposure.",
          temptation: "Treating aspirin as the most important medication to remove because it is an antiplatelet drug.",
          reasonableWhen: "There is no current aspirin indication and a separately reviewed NSAID indication justifies continued use.",
          claims: ["aspirin-secondary", "aspirin-primary", "nsaid-rebleeding"],
        },
        {
          id: "stop-both",
          label: "Discontinue aspirin and discontinue naproxen",
          rationale: "Avoiding naproxen fits the bleeding history, but the established cardiovascular aspirin indication still needs preservation after controlled bleeding.",
          temptation: "Removing all potentially bleeding-associated medicines without assessing the reason each is prescribed.",
          reasonableWhen: "Aspirin is being used for primary prevention and the NSAID can also be avoided after a bleed.",
          claims: ["aspirin-secondary", "aspirin-primary", "nsaid-rebleeding"],
        },
      ],
      explanation: "After secure hemostasis, aspirin for a documented prior myocardial infarction generally remains indicated. Nonaspirin NSAIDs should be avoided when feasible after diverticular hemorrhage. The medicine's indication determines which bleeding-risk tradeoff is justified.",
      claims: ["aspirin-secondary", "aspirin-primary", "nsaid-rebleeding"],
      reasoning: {
        interpret: "Distinguish established cardiovascular secondary prevention from symptom treatment with a nonaspirin NSAID.",
        apply: "Reconcile the discharge medicines by preserving the indicated aspirin and removing avoidable NSAID exposure.",
        closestChoice: "stop-both",
        decidingObservation: "A documented myocardial infarction establishes the aspirin indication after the bleed has been controlled.",
        consequenceOfError: "A blanket bleeding-risk response can remove cardiovascular protection or retain avoidable recurrent-bleeding exposure.",
        counterfactual: "Replace the prior myocardial infarction with aspirin started for primary prevention in a patient without established cardiovascular disease. Discontinuing both medicines becomes the preferred offered plan.",
        counterfactualChoice: "stop-both",
        deletionTest: "Hemostasis establishes the discharge phase. The infarction defines aspirin's indication. Naproxen creates a distinct modifiable exposure. Absence of other antithrombotics prevents an unsupported dual-therapy timing problem.",
        cueAttack: "The four options form a balanced two-by-two medication matrix. Each medicine is continued in two labels and stopped in two labels, so component frequency cannot identify the key.",
        stageAudit: "Four discharge medication-reconciliation plans with identical scope.",
        difficulty: "hard",
        difficultyReason: "The resident must resist stopping every bleeding-associated drug and distinguish two different medication indications.",
        sequenceCheck: "Standalone case. No prior explanation identifies the aspirin-versus-NSAID distinction.",
        limitation: "The objective is one medication-reconciliation plan. Exact resumption intervals, new analgesic selection and dual antiplatelet therapy are outside the scored scope.",
      },
    }],
  },
  {
    slug: "primary-prevention-aspirin",
    name: "Irene Foster",
    age: 60,
    sex: "Female",
    complaint: "Medication follow-up",
    presentation: "{patientName}, a 60-year-old woman, attends clinic after a treated diverticular hemorrhage. The founder reviews her discharge medicines against their recorded indications.",
    historicalAcuity: "stable",
    nodes: [{
      slug: "stop-primary-prevention-aspirin",
      conceptId: newConceptId("primary-prevention-aspirin"),
      conceptRelation: "new_meaning",
      displayName: "Primary-prevention aspirin after diverticular bleeding",
      objective: "Discontinue primary-prevention aspirin after diverticular hemorrhage when no established cardiovascular indication is present.",
      conceptType: "management",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which aspirin plan best fits {patientName}'s recovered discharge assessment?",
      update: "Aspirin had been started because of hypertension, elevated cholesterol and a family history of early myocardial infarction. She had no previous myocardial infarction, stroke, peripheral arterial disease or coronary intervention. The current bleed had stopped after treatment. She took no nonaspirin NSAID and had no other recorded antiplatelet indication.",
      correctChoice: "stop",
      choices: [
        {
          id: "continue",
          label: "Continue daily aspirin after discharge",
          rationale: "Her recorded use is primary prevention. After diverticular bleeding, that indication generally does not justify continued aspirin exposure.",
          temptation: "Treating several cardiovascular risk factors as equivalent to established cardiovascular disease.",
          reasonableWhen: "Aspirin is indicated for established cardiovascular disease after control of bleeding.",
          claims: ["aspirin-primary", "aspirin-secondary"],
        },
        {
          id: "stop",
          label: "Discontinue daily aspirin after discharge",
          rationale: "No established cardiovascular indication is recorded. Current lower-GI bleeding guidance supports discontinuing primary-prevention aspirin after this event.",
          temptation: "Reclassifying the drug by its actual indication before applying the bleeding tradeoff.",
          reasonableWhen: "Aspirin serves primary prevention and a diverticular bleed has changed the risk-benefit balance.",
          claims: ["aspirin-primary"],
        },
        {
          id: "substitute",
          label: "Replace daily aspirin with daily clopidogrel",
          rationale: "Substituting another antiplatelet agent does not establish an indication that was absent for aspirin.",
          temptation: "Assuming another antiplatelet agent automatically preserves benefit with an acceptable bleeding tradeoff.",
          reasonableWhen: "A separate established antiplatelet indication and an appropriate clinician-reviewed reason favor clopidogrel.",
          claims: ["aspirin-primary", "aspirin-secondary"],
        },
      ],
      explanation: "Risk factors and family history place aspirin in a primary-prevention role here. After diverticular hemorrhage, that role generally supports discontinuation. A different antiplatelet drug does not create a missing indication.",
      claims: ["aspirin-primary", "aspirin-secondary"],
      reasoning: {
        interpret: "Distinguish cardiovascular risk factors from established atherosclerotic disease requiring secondary prevention.",
        apply: "Reassess the primary-prevention aspirin tradeoff after a consequential bleeding event.",
        closestChoice: "continue",
        decidingObservation: "The reason for aspirin is risk-factor prevention, with no established cardiovascular disease or other antiplatelet indication.",
        consequenceOfError: "Misclassification can perpetuate a bleeding-associated medicine without the intended secondary-prevention benefit.",
        counterfactual: "Replace the primary-prevention history with a documented prior myocardial infarction while retaining controlled bleeding. Continuing aspirin becomes the supported offered plan.",
        counterfactualChoice: "continue",
        deletionTest: "Risk factors establish the credible continuation error. Event and disease history establish actual indication. Controlled bleeding defines the discharge phase. Other-indication history prevents a hidden reason to continue treatment.",
        cueAttack: "The task does not say primary prevention. All options are specific antiplatelet plans. Negative cardiovascular history is necessary to classify indication and is not replaced with the answer label.",
        stageAudit: "Three antiplatelet strategies at the same recovered discharge stage.",
        difficulty: "moderate",
        difficultyReason: "The learner must classify the medication indication before applying the post-bleed recommendation.",
        sequenceCheck: "Standalone case prevents an immediately preceding secondary-prevention explanation from supplying the answer.",
        limitation: "This is a qualitative indication decision. No age cutoff, cardiovascular risk percentage or interruption interval is authored.",
      },
    }],
  },
  {
    "slug": "vascular-lesion-review",
    "name": "Leonard Price",
    "age": 74,
    "sex": "Male",
    "complaint": "Bleeding treatment review",
    "presentation": "{patientName}, a 74-year-old man, attends clinic after an outside endoscopic treatment for recurrent lower gastrointestinal bleeding.",
    "historicalAcuity": "urgent_stable",
    "nodes": [
      {
        "slug": "flat-vascular-lesion-treatment",
        "conceptId": "concept.colon-diverticular-lower-bleeding.angioectasia-hemostasis.v1",
        "conceptRelation": "new_meaning",
        "displayName": "Endoscopic treatment of colonic angioectasia",
        "objective": "Interpret a superficial vascular bleeding pattern and select noncontact endoscopic coagulation.",
        "conceptType": "management",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "task": "Which endoscopic treatment best fits {patientName}'s colonoscopy record?",
        "update": "During a well-prepared colonoscopy, several flat branching red vascular patches in the cecum slowly oozed blood after washing. The surrounding mucosa was intact. There was no focal exposed vessel within a diverticulum. Circulation remained stable during the examination.",
        "correctChoice": "apc",
        "choices": [
          {
            "id": "clip",
            "label": "Apply through-the-scope clips to the bleeding patches",
            "rationale": "Clips suit a discrete target such as a focal diverticular bleeding vessel. These broad superficial vascular patches call for a different endoscopic approach.",
            "temptation": "Applying the familiar focal-vessel strategy to a broad mucosal vascular lesion.",
            "reasonableWhen": "A discrete accessible diverticular bleeding vessel requires mechanical hemostasis.",
            "claims": [
              "angioectasia-apc",
              "endoscopic-clips"
            ]
          },
          {
            "id": "inject",
            "label": "Inject dilute epinephrine into the bleeding patches",
            "rationale": "Injection may give transient control but is not the definitive treatment proposed for these superficial vascular lesions.",
            "temptation": "Selecting immediate vasoconstriction as the completed treatment.",
            "reasonableWhen": "Temporary bleeding control is needed before definitive endoscopic therapy.",
            "claims": [
              "angioectasia-apc",
              "epinephrine-not-definitive"
            ]
          },
          {
            "id": "apc",
            "label": "Apply argon plasma coagulation to the bleeding patches",
            "rationale": "The report describes superficial vascular lesions consistent with angioectasia. Noncontact argon plasma coagulation is an accepted endoscopic treatment.",
            "temptation": "Using the distribution and surface pattern to select a lesion-specific modality.",
            "reasonableWhen": "Bleeding colonic angioectasias are suitable for endoscopic noncontact coagulation.",
            "claims": [
              "angioectasia-apc"
            ]
          }
        ],
        "explanation": "The flat branching mucosal vascular pattern supports angioectasia. Argon plasma coagulation is an accepted noncontact treatment. A discrete diverticular vessel and a broad superficial vascular lesion call for different hemostatic approaches.",
        "claims": [
          "angioectasia-apc",
          "endoscopic-clips",
          "epinephrine-not-definitive"
        ],
        "reasoning": {
          "interpret": "Distinguish superficial mucosal vascular patches from a focal diverticular vessel.",
          "apply": "Select a lesion-specific definitive endoscopic hemostatic modality.",
          "closestChoice": "clip",
          "decidingObservation": "Several flat branching vascular patches produce broad superficial oozing.",
          "consequenceOfError": "A focal mechanical approach can fail to treat the distribution of the vascular lesion.",
          "counterfactual": "Replace the broad patches with a single accessible exposed vessel at a diverticular neck. Endoscopic clipping becomes the supported offered treatment.",
          "counterfactualChoice": "clip",
          "deletionTest": "The patch morphology and oozing distribution establish the lesion pattern. The focal-vessel observation resolves the closest competing mechanical treatment. Stability keeps the decision within ongoing endoscopy.",
          "cueAttack": "The task and complaint supply no diagnosis or preferred modality. All three choices are local endoscopic treatments. The report uses independently written observations and includes no image asset.",
          "stageAudit": "Three definitive local endoscopic treatment proposals during the same prepared examination.",
          "difficulty": "moderate",
          "difficultyReason": "The resident must infer lesion type and transfer the appropriate hemostatic method across two credible lower-GI bleeding patterns.",
          "sequenceCheck": "Standalone case prevents a preceding explanation from naming the lesion-specific modality.",
          "limitation": "One directly accessed historical ACG guideline supports APC for colonic angioectasia. A permitted current ASGE 2026 full guideline check and clinician confirmation remain required. The task selects treatment from a written record and makes no image-interpretation claim."
        }
      }
    ]
  },
];

/** One attempt per returned item. The reviewed v1 data above stays frozen. */
export const COLON_TOPIC_REVISION_VERSION = "question-topic-colon-diverticular-lower-bleeding.2026-11-11.v2";
interface RevisionSpec {
  slug: string;
  status: "revised" | "parked";
  reason: string;
  changes: string[];
  patch: Partial<Omit<TopicNode, "reasoning">> & { reasoning?: Partial<AuthorReasoning> };
}
const revisedChoice = (
  id: string, label: string, rationale: string, temptation: string,
  reasonableWhen: string, claims: string[], timingProfileId?: string,
): TopicChoice => ({ id, label, rationale, temptation, reasonableWhen, claims,
  ...(timingProfileId ? { timingProfileId } : {}) });

export const COLON_TOPIC_REVISION_SPECS: RevisionSpec[] = [
  {
    slug: "selected-supportive-care", status: "revised",
    reason: "Fair moderate: host, trajectory and oral tolerance determine antibiotic eligibility; the task no longer preselects outpatient care.",
    changes: ["Anchor at reassessment", "Remove initial and outpatient from task", "Retain improving trajectory, prior C. difficile and host observations"],
    patch: {
      task: "Which treatment plan best fits {patientName}'s documented reassessment?",
      reasoning: {
        cueAttack: "The task anchors at reassessment without excluding the hospital option. Every plan includes reassessment; CT, host and clinical trajectory must be interpreted.",
        sequenceCheck: "The preceding exact PASS selects initial CT. Its explanation does not establish antibiotic eligibility from the new host and CT observations.",
        difficulty: "moderate", difficultyReason: "Interpret uncomplicated CT and improving low-risk host observations, then balance selected omission against unnecessary antibiotic exposure after previous C. difficile.",
        limitation: "This selected improving host establishes no omission rule for immune suppression, worsening or oral intolerance.",
      },
    },
  },
  {
    slug: "post-abscess-colonoscopy", status: "parked",
    reason: "One repair removes the explicit missing-test cue and upper-versus-lower mismatch but remains straightforward recovery-colonoscopy recall, below moderate. A harder examination-quality or recent-adequate-exam boundary needs further evidence; the supplied hold remains unresolved.",
    changes: ["Remove the explicit no-colorectal-screening cue", "Remove upper-organ mismatch", "Neutral comparable investigation labels"],
    patch: {
      task: "Which investigation best fits {patientName}'s post-recovery records?",
      update: "Drainage and antibiotics resolved his fever and focal tenderness. Follow-up imaging documented collapse of the collection and resolution of adjacent inflammation. He returned to his usual bowel pattern. The prior procedure record documented anoscopy for hemorrhoidal bleeding; no other endoscopic report was available.",
      choices: [
        revisedChoice("ct", "Contrast-enhanced abdominal and pelvic CT", "CT assesses an extraluminal complication but does not complete the post-recovery mucosal examination.", "Reusing successful recovery imaging for a new objective.", "Fever and tenderness suggest an unresolved collection.", ["recovery-colonoscopy", "failure-source-control"], "timing.test.ct"),
        revisedChoice("colonoscopy", "Optical colonoscopy", "A complete colonic examination remains indicated after this complicated episode; the prior local examination does not supply it.", "Separating local anal examination from complete mucosal assessment.", "Indicated post-recovery mucosal examination remains outstanding.", ["recovery-colonoscopy", "optical-colonoscopy-capability"], "timing.test.lower_endoscopy"),
        revisedChoice("virtual", "CT colonography", "CT colonography assesses colonic structure but cannot sample abnormal tissue. A finding may need optical colonoscopy.", "Treating structural imaging and tissue-capable examination as interchangeable.", "Structural colonic assessment is needed and optical examination cannot be completed.", ["ct-colonography-capability"], "timing.test.ct"),
      ],
      explanation: "Resolution of the collection and assessment of colonic mucosa are separate objectives. This repair remains a basic follow-up examination association and is parked below moderate difficulty.",
      claims: ["recovery-colonoscopy", "failure-source-control", "optical-colonoscopy-capability", "ct-colonography-capability"],
      reasoning: {
        interpret: "Separate collection recovery from complete mucosal assessment.", apply: "Choose an indicated colonic examination that can inspect and sample mucosa.",
        closestChoice: "virtual", counterfactualChoice: "ct",
        decidingObservation: "The recovered complicated episode has not had a complete colonic examination.",
        counterfactual: "Recurrent fever and tenderness suggesting an unresolved collection would prioritize contrast CT.",
        cueAttack: "Neutral names remove the explicit missing-test wording, but the earlier local examination still leaves an easy extent-of-examination association.",
        deletionTest: "Removing that prior report makes the stem incomplete; adding a recent adequate colonoscopy would cross the unresolved supplied hold.",
        stageAudit: "Three diagnostic examinations at recovery; inactive because the attempted difficulty repair failed.",
        difficulty: "moderate", difficultyReason: "Attempted two-step scope-to-modality question remains below a defensible moderate resident challenge; parked, not relabeled hard.",
        sequenceCheck: "Both attempted nodes in this case are parked. No active question depends on this feedback.",
        limitation: "Parked below moderate. The recent adequate examination after asymptomatic abscess-recovery hold remains unkeyed.",
      },
    },
  },
  {
    slug: "elective-burden-after-abscess", status: "parked",
    reason: "Removing explicit preference for resection exposes a conditional operation-versus-observation choice. The supported facts justify discussion, not a uniquely mandatory operation. The one repair remains nonunique and is excluded.",
    changes: ["Express work and risk goals without naming a procedure", "Replace mesalamine filler with deferred surgical review", "Record nonunique elective ranking"],
    patch: {
      update: "Colonic evaluation found no mucosal mass. Another CT-confirmed episode interrupted work, with symptom-free recovery between episodes. Current imaging showed resolution, he exercised without limitation and no major cardiopulmonary disease was documented. He wanted fewer unplanned work absences but also wanted to understand operative and persistent-symptom risks before choosing a plan.",
      choices: [
        revisedChoice("observe", "Continue nonoperative follow-up", "Observation remains reasonable after recovery. The current goals do not establish the patient's accepted tradeoff.", "Equating recovery with a completed elective decision.", "Informed preference favors accepting current recurrence burden over operative risks.", ["elective-burden", "abscess-elective-choice"]),
        revisedChoice("sigmoid", "Arrange elective sigmoid resection", "Resection is a reasonable option for burdensome disease but the supplied goals do not uniquely rank it over observation.", "Converting burden into an automatic operation.", "The informed patient elects surgery after weighing recurrence reduction against its risks.", ["elective-burden", "abscess-elective-choice", "elective-resection-tradeoff"]),
        revisedChoice("reassess", "Arrange another surgical consultation", "Further discussion can reasonably precede either plan. This is a credible competing action rather than a false distractor.", "Recognizing the preference tradeoff is incomplete.", "Patient values and acceptance of operative risks remain unresolved.", ["elective-burden", "elective-resection-tradeoff"]),
      ],
      explanation: "Disease burden supports a discussion of elective surgery. It does not make resection obligatory. This attempted repair is parked because more than one offered plan remains defensible.",
      claims: ["elective-burden", "abscess-elective-choice", "elective-resection-tradeoff"],
      reasoning: {
        closestChoice: "observe", counterfactualChoice: "observe",
        decidingObservation: "Work disruption motivates discussion but does not uniquely rank the offered elective plans.",
        counterfactual: "An informed preference to accept recurrences rather than operative risk would support observation.",
        deletionTest: "Deleting the goals leaves more ambiguity; restoring explicit preference for surgery reveals the key.",
        cueAttack: "No procedure preference is given. The remaining nonunique ranking is recorded instead of disguised as difficulty.",
        stageAudit: "Three elective next strategies; several are reasonable, so inactive.",
        difficulty: "moderate", difficultyReason: "The intended burden-risk synthesis is conditional and fails the unique-key gate.",
        sequenceCheck: "Both nodes in this case are parked; no active sequence uses their explanations.",
        limitation: "Parked for nonunique ranking. Individualized guidance cannot be converted into a mandatory operation from burden alone.",
      },
    },
  },
  {
    slug: "symptomatic-colovesical-fistula", status: "parked",
    reason: "One repair removes the omission-advertising bladder label and failed-antibiotic straw man. It remains an easy source-operation association. The current evidence does not support a harder fair timing or bladder-technique comparison, so excluded.",
    changes: ["Neutral complete operative labels", "Remove repeated antibiotic failure", "Do not invent bladder-technique ranking"],
    patch: {
      task: "Which elective treatment best fits {patientName}'s completed investigation?",
      update: "CT showed a tract between inflamed sigmoid and bladder dome with intravesical gas. After infection treatment he was afebrile without acute tenderness but still passed bubbles during urination. Colonoscopy and cystoscopy found no mucosal tumor. He walked and climbed stairs without limitation.",
      choices: [
        revisedChoice("suppress", "Continue culture-directed medical treatment", "Medical treatment addresses infection without removing the diseased colonic source. It may still be chosen when risk or preference argues against resection.", "Treating infection as the entire structural problem.", "Operative risk or informed preference favors nonoperative care.", ["fistula-resection", "elective-burden"]),
        revisedChoice("resect", "Perform sigmoid resection with fistula management", "Resection addresses the symptomatic diverticular source after acute infection control; bladder management needs separate assessment.", "Following the demonstrated tract to its diseased source.", "A fit patient has a persistent symptomatic diverticular colovesical fistula.", ["fistula-observations", "fistula-resection"]),
        revisedChoice("bladder", "Perform bladder-directed fistula closure", "Bladder-directed treatment does not remove the diseased sigmoid source. The packet does not rank bladder repair techniques.", "Focusing on the organ producing the urinary symptom.", "A different established bladder-centered process calls for a separately evidenced treatment plan.", ["fistula-resection"]),
      ],
      explanation: "The symptomatic tract supports treatment of its sigmoid source after acute infection control. This repaired item remains an easy association and is parked rather than assigned unsupported technical distractors.",
      reasoning: {
        decidingObservation: "Persistent urinary symptoms accompany a documented sigmoid-to-bladder tract after infection control.",
        cueAttack: "The bladder choice no longer advertises omitted colon treatment. The explicit tract still makes the scored source principle straightforward.",
        deletionTest: "Removing the tract makes diagnosis uncertain; retaining it leaves basic source-directed recall.",
        stageAudit: "Three complete elective strategies rather than a complete operation against a partial maneuver.",
        difficulty: "moderate", difficultyReason: "One repair does not earn moderate difficulty; the attempt is parked.",
        sequenceCheck: "The initial CT-selection PASS, header and feedback remain exact. This follow-on is excluded from the active case.",
        limitation: "Parked below moderate. No bladder material, staging or routine repair rule is authored.",
      },
    },
  },
  {
    slug: "post-recovery-alarm-colonoscopy", status: "revised",
    reason: "Fair moderate: current alarm findings outweigh reassurance from earlier screening; CT colonography is a credible capability competitor.",
    changes: ["Date prior scope as fictional chronology, not a cutoff", "Remove surveillance delay and rationale-bearing labels", "Replace stool screening with CT colonography", "Freeze feedback visible to downstream stricture PASS"],
    patch: {
      update: "Her fever and acute tenderness resolved, and CT showed no residual collection. She continued to pass narrow stools and lost weight despite resuming her usual diet. CT still showed a short thickened sigmoid segment. The earlier colonoscopy report documented cecal intubation, good preparation and no mass; its date was eight months before the admission. She tolerated that examination without a procedural problem.",
      choices: [
        revisedChoice("ct", "Contrast-enhanced abdominopelvic CT", "Repeat CT is useful for suspected extraluminal complications. The current scan has addressed the collection while new symptoms and focal thickening remain unexplained.", "Reusing abscess imaging for the new mucosal question.", "Recurrent fever and focal tenderness suggest an unresolved collection.", ["alarm-colonoscopy", "failure-source-control"], "timing.test.ct"),
        revisedChoice("colonoscopy", "Optical colonoscopy", "New bowel change, weight loss and a persistent segment need diagnostic luminal assessment despite the adequate earlier examination. Optical colonoscopy can inspect and sample abnormal mucosa.", "Prioritizing the new diagnostic problem over earlier screening reassurance.", "New alarm findings need mucosal assessment with tissue access.", ["alarm-colonoscopy", "optical-colonoscopy-capability"], "timing.test.lower_endoscopy"),
        revisedChoice("virtual", "CT colonography", "CT colonography can show structural lesions but cannot obtain tissue. It is a less complete initial answer when new findings need assessment and optical examination is feasible.", "Choosing another whole-colon test without considering tissue access.", "Structural examination is needed and optical colonoscopy is not feasible; abnormalities may need a further diagnostic procedure.", ["alarm-colonoscopy", "ct-colonography-capability", "optical-colonoscopy-capability"], "timing.test.ct"),
      ],
      claims: ["alarm-colonoscopy", "failure-source-control", "ct-colonography-capability", "optical-colonoscopy-capability"],
      reasoning: {
        interpret: "Separate earlier screening reassurance from a new post-recovery alarm pattern.",
        apply: "Choose diagnostic luminal assessment with tissue capability for the focal abnormality.",
        closestChoice: "virtual", counterfactualChoice: "ct",
        decidingObservation: "New narrow stools, weight loss and focal thickening persist after acute recovery, without an obstacle to optical examination.",
        counterfactual: "Replace recovery with recurrent fever and focal tenderness suggesting a collection; contrast CT becomes the first offered investigation.",
        deletionTest: "Without the new alarm pattern this could become the held recent-adequate-examination problem. Eight months establishes chronology, not a repeat threshold.",
        cueAttack: "Neutral test names replace the rationale-bearing key. No arbitrary CT delay or screening-only distractor remains.",
        stageAudit: "Three diagnostic examinations at one post-recovery assessment.",
        difficulty: "moderate", difficultyReason: "Infer that resolved infection does not explain the new alarm pattern, then distinguish test capabilities despite prior screening reassurance.",
        sequenceCheck: "The v1 explanation remains byte-for-byte unchanged for the downstream stricture PASS, along with the shared header and the full passed node.",
        limitation: "Fictional prior-scope chronology is not a guideline interval. This alarm-driven diagnostic indication does not clear the separate asymptomatic recent-adequate-examination hold.",
      },
    },
  },
  {
    slug: "failed-abscess-source-control", status: "revised",
    reason: "Fair moderate: interpret low drain output using the compartment map, then integrate worsening with lack of a safe route to select operative source control.",
    changes: ["Remove susceptibility-based pre-elimination", "Use neutral operation label", "Keep essential compartment and safe-access observations"],
    patch: {
      update: "After drainage and antibiotics she developed increasing fever, tachycardia and broader abdominal tenderness. Drain output had fallen. CT showed the catheter tip in a nearly collapsed cavity and an enlarging rim-enhancing collection between bowel loops in a separate compartment. Interventional review found no route to that compartment that avoided bowel.",
      choices: [
        revisedChoice("broaden", "Change antibiotics and continue the existing drain", "Medication changes do not drain the separate enlarging collection during clinical worsening. Monitored nonoperative care can remain reasonable when the course improves.", "Interpreting fever and low output only as a medication problem.", "Clinical improvement permits closely monitored nonoperative treatment.", ["failure-source-control", "abscess-drainage"]),
        revisedChoice("upsize", "Exchange and enlarge the existing drain catheter", "The catheter ends in the collapsed compartment, not the enlarging source; its exchange does not correct that mismatch.", "Equating low output with catheter obstruction.", "The catheter occupies the persisting collection, is blocked and can be safely exchanged.", ["failure-source-control", "abscess-drainage"], "timing.test.advanced_diagnostic"),
        revisedChoice("operate", "Perform sigmoid resection and abdominal drainage", "Deterioration with an enlarging separate collection and no safe percutaneous route supports operative source control. Reconstruction is a separate decision.", "Combining the anatomic map and treatment trajectory.", "Nonoperative source control has failed and the persisting source cannot be adequately drained percutaneously.", ["failure-source-control"]),
      ],
      reasoning: {
        interpret: "Low output comes from the collapsed drained cavity while a separate source enlarges.",
        apply: "Escalate source control using deterioration plus the absence of safe percutaneous access.",
        closestChoice: "upsize", counterfactualChoice: "upsize",
        decidingObservation: "The catheter is outside the enlarging compartment, which has no safe percutaneous approach.",
        counterfactual: "If a blocked catheter lay within the persistent collection and could be exchanged safely, catheter exchange would be a reasonable next procedure.",
        deletionTest: "Without the catheter map, exchange remains credible; without deterioration, monitored medical care may remain reasonable.",
        cueAttack: "No label supplies the undrained-source inference. An explicit culture-coverage fact no longer exists solely to eliminate antibiotics.",
        stageAudit: "Three hospital treatment plans at the same point; reconstruction is outside the scored objective.",
        difficulty: "moderate", difficultyReason: "Interpret compartment anatomy and drain behavior, then apply deterioration and access constraints to source control.",
        sequenceCheck: "Initial abscess-drainage PASS stays exact. New low-output anatomy and deterioration earn the later decision.",
        limitation: "A worsening inaccessible collection, not the held drainage-size borderline. Operative details remain clinical judgments.",
      },
    },
  },
  {
    slug: "gross-perforation-source-control", status: "parked",
    reason: "The single repair removes redundant framing and reconstruction scaffolding. Gross fecal perforation still makes resection basic safety recall. A harder fair lavage or closure comparison is unsupported for these findings; excluded below moderate.",
    changes: ["Remove reconstruction criteria from feedback", "Keep indispensable full-thickness perforation and fecal contamination", "Do not invent a safe lavage competitor"],
    patch: {
      task: "Which source-control procedure best fits {patientName}'s operative record?",
      explanation: "The open sigmoid perforation and fecal contamination require treatment of the diseased source by resection. This repaired basic safety item is parked below moderate difficulty.",
      reasoning: {
        cueAttack: "Essential gross perforation and fecal contamination make resection straightforward; removing them would change the supported clinical question.",
        deletionTest: "Keeping the essential contamination leaves easy recall; deleting it creates a different source-control problem.",
        stageAudit: "Three source-control procedures; reconstruction criteria are removed from feedback.",
        difficulty: "moderate", difficultyReason: "The attempted repair does not earn moderate challenge; parked rather than labeled hard.",
        sequenceCheck: "Excluded. Active reconstruction now states its own perforation context without preceding scaffolding.",
        limitation: "Parked below moderate. No lavage recommendation is extended to fecal perforation.",
      },
    },
  },
  {
    slug: "stable-primary-reconstruction", status: "revised",
    reason: "Fair moderate conditional reconstruction choice; the exact perforation context is self-contained and no earlier source-control feedback supplies the criteria.",
    changes: ["Add perforated diverticulum and diffuse fecal contamination to update", "Remove editorial instruction from learner feedback", "Make active standalone after source-control parking"],
    patch: {
      update: "The operative record described resection of a perforated sigmoid diverticulum after liquid stool was found in several abdominal compartments. After resection, blood pressure remained stable without vasopressors. He had no major comorbidity, took no immunosuppressive drugs and had maintained his weight before the illness. The planned bowel ends were perfused, free of gross inflammation and reached without tension. The operating colorectal surgeon documented these findings.",
      explanation: "Diffuse fecal contamination establishes a major emergency but does not determine reconstruction alone. In this stable low-risk host with suitable bowel ends, primary colorectal anastomosis with diversion is a supported selected approach. Hartmann reconstruction remains appropriate under different physiology or host risk; anastomosis is not obligatory in every contaminated case.",
      reasoning: {
        interpret: "Distinguish perforation severity from current post-resection physiology and host/bowel suitability.",
        apply: "Choose conditional primary anastomosis with diversion rather than treating contamination as an absolute end-colostomy indication.",
        closestChoice: "hartmann", counterfactualChoice: "hartmann",
        decidingObservation: "Stable without vasopressors, low host risk and healthy perfused tension-free bowel ends despite diffuse fecal contamination.",
        counterfactual: "Persistent vasopressor-dependent shock and major comorbidity would support the offered Hartmann plan.",
        deletionTest: "Without current host, physiology and bowel findings, contamination alone cannot uniquely rank reconstruction strategies.",
        cueAttack: "The standalone update supplies disease context and findings, not a named preferred reconstruction; preceding criteria feedback is absent.",
        stageAudit: "Three complete reconstruction strategies after the same source resection.",
        difficulty: "moderate", difficultyReason: "Integrate contamination with current physiology and host/bowel suitability, then apply a conditional reconstruction recommendation.",
        sequenceCheck: "Active standalone; the basic source-control attempt is parked. Shared concept definition remains exact for the separate high-risk Hartmann PASS.",
        limitation: "Conditional recommendation, not a claim Hartmann is always wrong in a stable patient. Exact operative judgment needs named clinical review.",
      },
    },
  },
  {
    slug: "immunosuppressed-antibiotic-decision", status: "revised",
    reason: "Admission is common background. The medication choice now requires both host eligibility and complete oral regimen selection, with no outpatient-versus-IV ambiguity.",
    changes: ["Remove already-completed outpatient treatment from header", "Disclose lung disease upfront", "Fix ward observation across every option", "Replace location choice with ciprofloxacin monotherapy"],
    patch: {
      task: "Which oral medication plan best fits {patientName}'s acute hospital assessment?",
      update: "The admitting team had already chosen ward observation. CT showed focal sigmoid thickening and fat inflammation without a collection or free perforation. She was alert with normal pulse and blood pressure, tolerated food and tablets without vomiting, and reported improving pain. Tacrolimus and mycophenolate were continued. She had no penicillin allergy and renal function was preserved. Each medication plan would use the same observation and reassessment arrangements.",
      choices: [
        revisedChoice("support", "Use oral hydration and analgesia", "Limited CT disease does not make a transplant recipient on immune suppression eligible for routine antibiotic omission.", "Applying the uncomplicated omission pathway from imaging alone.", "A selected immunocompetent nonfrail improving patient meets all omission conditions.", ["selected-no-antibiotics", "antibiotics-immunosuppression"]),
        revisedChoice("oral-antibiotic", "Use oral amoxicillin-clavulanate", "Immune suppression supports antibiotics despite limited CT disease. Amoxicillin-clavulanate is a listed complete oral regimen while the selected observation continues.", "Integrating host eligibility and regimen completeness.", "Antibiotics are indicated, oral treatment is clinically suitable and allergy or organ-function constraints do not preclude this regimen.", ["antibiotics-immunosuppression", "oral-amoxicillin-clavulanate"]),
        revisedChoice("ciprofloxacin", "Use oral ciprofloxacin", "The listed ciprofloxacin-based diverticulitis regimen pairs it with metronidazole. The offered entire plan omits that anaerobic component.", "Choosing a familiar enteric drug without the required regimen partner.", "A different established susceptible infection is treated; a diverticulitis regimen would need the appropriate partner and clinical assessment.", ["ciprofloxacin-partner"]),
      ],
      explanation: "Uncomplicated imaging does not erase the antibiotic indication from immune suppression. With observation held common and oral tolerance established, amoxicillin-clavulanate is the supported offered oral regimen. A ciprofloxacin-based diverticulitis plan includes an anaerobic partner. Admission, intravenous route, dose and duration are not decided here.",
      claims: ["uncomplicated-observations", "antibiotics-immunosuppression", "selected-no-antibiotics", "oral-amoxicillin-clavulanate", "ciprofloxacin-partner"],
      reasoning: {
        interpret: "The CT is uncomplicated but transplant medicines place this host outside routine antibiotic-omission eligibility.",
        apply: "Choose the complete offered oral regimen with observation common to every option.",
        closestChoice: "support", counterfactualChoice: "support",
        decidingObservation: "Tacrolimus and mycophenolate change antibiotic eligibility; the offered ciprofloxacin plan lacks its listed anaerobic partner.",
        counterfactual: "Remove transplant immune suppression and medical complexity while retaining a selected nonfrail improving orally tolerant host and reliable reassessment; supportive care becomes reasonable.",
        deletionTest: "Without host information omission cannot be ranked. Without common ward observation the original location ambiguity returns. The incomplete regimen requires a separate drug-spectrum inference.",
        cueAttack: "Every label names oral medicines without a different monitoring privilege. Transplant therapy and lung disease are disclosed before the decision.",
        stageAudit: "Three oral medication strategies during already selected observation; no hospital-versus-outpatient contest.",
        difficulty: "moderate", difficultyReason: "Interpret a host-specific omission exclusion, then select a complete oral regimen over a plausible incomplete one.",
        sequenceCheck: "First and only active node. Parked elective review no longer withholds lung disease from the earlier assessment.",
        limitation: "No unique admission, IV-route, drug-interaction, dose or duration rule. The current official ACG highlight verifies regimen composition; this transplant application needs clinical review.",
      },
    },
  },
  {
    slug: "high-risk-recovered-observation", status: "parked",
    reason: "One repair removes the named nonsurgical preference, pulmonary conclusion and mesalamine filler. Raw functional findings inform discussion but do not uniquely rank observation, optimization and elective surgery. The conditional ranking remains unresolved.",
    changes: ["Lung disease visible upfront", "Use functional observations rather than risk conclusion", "Remove named nonsurgical preference", "Add credible delayed surgical assessment"],
    patch: {
      update: "She returned to her usual bowel pattern after the first episode and had no further attacks. CT showed no collection or narrowing. She used home oxygen, stopped to rest while crossing a room and needed help bathing. She wanted to preserve independence and avoid both an emergency operation and prolonged postoperative loss of function; she had not ranked those competing risks.",
      choices: [
        revisedChoice("colectomy", "Arrange elective sigmoid resection", "Transplant status prompts individualized discussion, not automatic surgery. Functional and operative tradeoffs remain unresolved.", "Using immune suppression alone to mandate prophylactic resection.", "Burden, operative assessment and informed priorities favor surgery.", ["immunosuppressed-elective-choice", "elective-burden"]),
        revisedChoice("optimize", "Arrange pulmonary optimization before surgical reassessment", "Further assessment can reasonably precede an operative decision, competing with observation in this incomplete tradeoff.", "Treating risk assessment as the completed decision about benefit.", "A patient pursuing surgery needs assessment of remediable limitations.", ["immunosuppressed-elective-choice", "elective-burden"]),
        revisedChoice("observe", "Arrange nonoperative follow-up", "Absent recurrent burden and major functional limitations make observation reasonable, but the guideline does not uniquely mandate it without the individualized decision.", "Separating elective risk-benefit assessment from acute antibiotic eligibility.", "Informed preference accepts nonoperative risks relative to operative risks and current burden.", ["immunosuppressed-elective-choice", "elective-burden"]),
      ],
      explanation: "Recovery, absent recurrence and major functional limitations all matter. Immune suppression alone does not settle elective surgery. This attempt is parked because the competing priorities remain unranked and several next strategies are reasonable.",
      reasoning: {
        interpret: "Infer functional limitation from home oxygen, walking tolerance and assistance needs while noting absent recurrence.",
        apply: "Balance future disease risks against operative and functional risks without an automatic transplant-based rule.",
        closestChoice: "optimize", counterfactualChoice: "colectomy",
        decidingObservation: "Competing risks remain unranked; functional observations alone do not uniquely settle the plan.",
        counterfactual: "Recurrent disruptive episodes, improved operative fitness and an informed operative preference would support elective resection.",
        deletionTest: "Deleting functional observations hides real risk; restoring explicit nonsurgical preference reveals the answer.",
        cueAttack: "No preference names an action. The unresolved tradeoff is recorded as a parking reason.",
        stageAudit: "Three complete elective next strategies; more than one is defensible.",
        difficulty: "moderate", difficultyReason: "The attempted risk-burden synthesis remains nonunique, not a fair difficult scored item.",
        sequenceCheck: "Parked; chronic lung disease is now disclosed before the preceding active medication question.",
        limitation: "Parked for conditional ranking. Fictional function findings establish no operative-risk score or threshold.",
      },
    },
  },
  {
    slug: "stable-bleed-colonoscopy", status: "revised",
    reason: "Fair moderate modality choice; key no longer uniquely bundles preparation and timing, while inpatient workup is common background.",
    changes: ["Score modality alone", "Neutral comparable test names", "Hold inpatient source evaluation common"],
    patch: {
      task: "Which investigation modality best fits {patientName}'s inpatient source evaluation at this reassessment?",
      update: "The hospital team continued inpatient source evaluation. After initial fluid replacement she had no further bloody stool. Serial pulse and blood-pressure measurements remained stable and hemoglobin did not continue to fall. She tolerated oral liquids and could complete bowel preparation. Her last complete colon examination was several years earlier; no source had been established during this admission.",
      choices: [
        revisedChoice("cta", "CT angiography", "CTA becomes more useful during significant ongoing bleeding. Cessation and stable serial observations favor prepared luminal evaluation here.", "Carrying an active-bleed strategy into the stopped-bleed reassessment.", "Significant ongoing hematochezia needs rapid active-source localization.", ["cta-ongoing-bleeding", "stable-nonemergent-colonoscopy"], "timing.test.ct"),
        revisedChoice("scan", "Tagged red-cell scintigraphy", "Scintigraphy can help with intermittent localization but does not provide direct colonic inspection and possible treatment in this stable preparation-tolerant inpatient.", "Choosing a bleeding-localization test without considering trajectory and feasibility.", "Intermittent obscure overt bleeding remains a localization problem.", ["scintigraphy-intermittent", "stable-nonemergent-colonoscopy"], "timing.test.nuclear_imaging"),
        revisedChoice("colonoscopy", "Optical colonoscopy", "Stopped bleeding, serial stability and feasible preparation support inpatient colonoscopy. The choice is modality, without a mandatory urgent interval.", "Using the changed trajectory to select a luminal examination.", "Inpatient lower-GI source evaluation remains indicated after stabilization and preparation is feasible.", ["stable-nonemergent-colonoscopy", "bleeding-colon-preparation"], "timing.test.lower_endoscopy"),
      ],
      claims: ["stable-nonemergent-colonoscopy", "bleeding-colon-preparation", "cta-ongoing-bleeding", "scintigraphy-intermittent"],
      reasoning: {
        interpret: "Distinguish the stopped bleed with stable serial physiology from significant ongoing hemorrhage.",
        apply: "Select prepared luminal evaluation rather than active-bleeding imaging.",
        closestChoice: "cta", counterfactualChoice: "cta",
        decidingObservation: "No further bloody stool, stable serial measurements and feasible bowel preparation.",
        counterfactual: "Repeated large bloody stools with recurrent circulatory deterioration would favor the offered CTA for active localization.",
        deletionTest: "Without the serial course the initial complaint cannot distinguish the modalities. Inpatient evaluation is common, so discharge risk is not bundled into the key.",
        cueAttack: "All labels name a modality. CTA no longer teaches its indication and colonoscopy no longer uniquely includes timing or preparation.",
        stageAudit: "Three modalities for the same inpatient source evaluation.",
        difficulty: "moderate", difficultyReason: "Interpret the bleeding trajectory, then choose among credible inpatient investigation modalities.",
        sequenceCheck: "Later endoscopic findings are absent; earlier feedback does not name this modality.",
        limitation: "No discharge score or urgent deadline is claimed. Current ACG guidance governs timing over historical guidance.",
      },
    },
  },
  {
    slug: "nonbleeding-vessel-treatment", status: "revised",
    reason: "Fair moderate response interpretation: injection stops flow but leaves a high-risk target requiring a second modality. All choices are completed local plans.",
    changes: ["Add an interpretable treatment response", "Make every option a complete endpoint", "Keep clip-versus-band hierarchy withheld"],
    patch: {
      task: "Which completed endoscopic plan best fits {patientName}'s findings after injection?",
      update: "During prepared colonoscopy, blood from a sigmoid diverticular neck obscured a focal target. Dilute epinephrine slowed the flow and allowed inspection. After washing a focal exposed vessel remained at the neck, although blood no longer flowed. The endoscopist could reach it with a clipping device. No other bleeding lesion was identified.",
      choices: [
        revisedChoice("observe", "Wash the site and end local treatment", "Stopped flow after injection does not remove the high-risk residual vessel. Ending treatment leaves durable hemostasis unresolved.", "Treating visual improvement as elimination of the target.", "No bleeding target or high-risk stigma remains on careful inspection.", ["diverticular-stigmata", "epinephrine-not-definitive"]),
        revisedChoice("inject", "Repeat epinephrine and end local treatment", "Further injection still makes epinephrine the endpoint. It can aid visualization but should not be the final modality for the persistent vessel.", "Confusing a useful bridge maneuver with completed hemostasis.", "Injection is needed before another modality for poor visualization, rather than as the completed plan offered here.", ["epinephrine-not-definitive"]),
        revisedChoice("clip", "Apply endoscopic clips and end local treatment", "A reachable residual vessel is a high-risk target despite stopped flow. Clips are an accepted second modality after temporary injection control.", "Combining the response with the persistent target.", "A discrete reachable diverticular bleeding stigma can be mechanically treated.", ["diverticular-stigmata", "endoscopic-clips", "epinephrine-not-definitive"]),
      ],
      explanation: "Injection changed flow and visibility, but an exposed vessel remained. Complete hemostasis with an accepted second modality such as clips instead of stopping with observation or epinephrine alone.",
      reasoning: {
        interpret: "Distinguish temporary injection response from disappearance of the high-risk stigma.",
        apply: "Complete treatment with an accepted reachable mechanical modality.",
        closestChoice: "inject", counterfactualChoice: "observe",
        decidingObservation: "An exposed reachable vessel remains after injection stops the flow.",
        counterfactual: "If careful inspection instead found no target or high-risk stigma, washing and ending local treatment could be appropriate.",
        deletionTest: "Without the residual vessel the need for completion is unearned. Without injection history this loses the bridge-versus-endpoint inference.",
        cueAttack: "Every option explicitly completes local treatment. No ambiguous adjunct-only maneuver competes with a full treatment plan.",
        stageAudit: "Three completed local endoscopic strategies after the same injection.",
        difficulty: "moderate", difficultyReason: "Interpret a favorable incomplete response, then choose durable completion for the remaining target.",
        sequenceCheck: "Earlier feedback chooses the investigation without revealing the later vessel or injection response.",
        limitation: "Clips are an accepted offered choice, without ranking them over band ligation or every thermal technique.",
      },
    },
  },
  {
    slug: "localized-surgical-rescue", status: "revised",
    reason: "Fair moderate reliability-to-extent inference using a delayed-only tracer competitor against current dynamic and selective localization.",
    changes: ["Raw localization records replace a concordance conclusion", "Add a supported delayed-only scintigraphic reliability distinction", "Freeze preceding rebleeding PASS"],
    patch: {
      update: "Embolization initially controlled the ascending-colon bleed, but transfusion-requiring hematochezia recurred despite repeat endoscopic and radiologic attempts. The team selected surgical rescue. A tagged red-cell study showed activity in the left pelvis only on delayed images; early images showed no focal activity. During recurrent bleeding, CTA showed new contrast entering the ascending-colon lumen and increasing on the next phase. Selective angiography showed extravasation from the matching right-colon branch. Upper endoscopy and terminal ileal inspection found no source. Sigmoid diverticula were also present.",
      choices: [
        revisedChoice("sigmoid", "Sigmoid colectomy", "Unconfirmed delayed pelvic tracer and sigmoid diverticula do not outweigh current matching right-colon extravasation. Delayed-only scintigraphic location needs confirmation before directing segmental resection.", "Choosing the location of late tracer or prominent diverticular burden.", "Current reliable localization confirms an isolated sigmoid source.", ["localized-rescue-resection", "delayed-scintigraphy-localization"]),
        revisedChoice("right", "Right colectomy", "Current dynamic ascending-lumen contrast and matching selective extravasation support the localized right-colon source despite unconfirmed delayed tracer elsewhere.", "Rank localization reliability before selecting resection extent.", "Surgical rescue is required and the source is credibly localized to right colon.", ["localized-rescue-resection", "delayed-scintigraphy-localization", "dynamic-cta-observation"]),
        revisedChoice("subtotal", "Subtotal colectomy", "An unconfirmed delayed tracer location does not erase the credible current right-sided source. Greater extent is not earned merely by incidental sigmoid diverticula.", "Treating any study-location difference as proof localization has failed.", "Life-threatening colonic bleeding requires surgery and reliable localization cannot be achieved after appropriate assessment.", ["localized-rescue-resection", "delayed-scintigraphy-localization"]),
      ],
      explanation: "A delayed-only tagged-cell location needs confirmation before directing segmental colectomy. Current dynamic CTA and matching selective angiography localize the ascending source more credibly here. Once surgery is selected after failed hemostatic attempts, right colectomy follows the credible localization. Genuinely unresolved current localization would require a different extent discussion.",
      claims: ["localized-rescue-resection", "delayed-scintigraphy-localization", "dynamic-cta-observation"],
      reasoning: {
        interpret: "Distinguish delayed-only tracer location from current luminal contrast accumulation corroborated by selective extravasation.",
        apply: "Use the credible source rather than distribution of diverticula or unconfirmed tracer to choose resection extent.",
        closestChoice: "subtotal", counterfactualChoice: "sigmoid",
        decidingObservation: "Current CTA and matching selective angiography localize ascending colon; the competing pelvic record is delayed-only and unconfirmed.",
        counterfactual: "If the current dynamic CTA and selective angiogram instead concordantly localized an isolated sigmoid source, sigmoid colectomy would become the supported segmental operation.",
        deletionTest: "Without current corroboration the old right-sided bleed cannot alone establish this recurrent source. Without the delayed-only distinction genuinely conflicting current studies could make a segmental key unsafe.",
        cueAttack: "Observations replace the assertion that all tests agree. A tailored absence of left-colon stigma no longer eliminates sigmoid surgery. Options are comparable operation names.",
        stageAudit: "Three resection extents after rescue surgery is already selected, not surgery versus another embolization attempt.",
        difficulty: "moderate", difficultyReason: "Interpret relative reliability of recurrent-bleed localization, then translate the source into surgical extent.",
        sequenceCheck: "The preceding rebleeding PASS remains exact. Its earlier source does not establish the new recurrence without interpreting current studies and delayed tracer reliability.",
        limitation: "One historical ACG guideline directly supports delayed-study confirmation. No numeric accuracy or automatic subtotal rule is authored; genuinely discordant high-quality current studies would invalidate this key.",
      },
    },
  },
  {
    slug: "healthy-resection-boundaries", status: "revised",
    reason: "Fair moderate two-margin decision. Four balanced plans remove wording convergence; clinic chronology is now a completed operative record.",
    changes: ["Postoperative record review", "Two proximal by two distal target matrix", "Explain the fourth plan's two real boundary misconceptions"],
    patch: {
      task: "Which pair of transection targets best fits {patientName}'s operative findings?",
      update: "The completed operative report described a thickened fibrotic sigmoid segment. The descending colon was soft without inflammation but contained scattered diverticula. A short distal sigmoid segment felt soft. The proximal rectum was healthy, and mobilized descending colon reached it without tension. Preoperative assessment found no other lesion requiring removal. The clinic review compares the boundary plans considered during that operation.",
      choices: [
        revisedChoice("limited", "Descending colon proximally; distal sigmoid distally", "The proximal target preserves uninvolved colon, but retained distal sigmoid is not the supported distal target for sigmoid diverticulitis resection.", "Using the first soft distal segment rather than the rectal target.", "A different operation has a separately supported reason to preserve distal sigmoid.", ["resection-margins"]),
        revisedChoice("sigmoid", "Descending colon proximally; proximal rectum distally", "Healthy descending colon need not be removed for uninflamed diverticula; healthy rectum supplies the supported distal target.", "Applying the proximal and distal boundary rules independently.", "Sigmoid disease has suitable healthy proximal colon and reachable rectum.", ["resection-margins"]),
        revisedChoice("extended", "Transverse colon proximally; proximal rectum distally", "The rectal target fits, but extension removes uninflamed descending colon for diverticula alone.", "Removing every proximal diverticulum to prevent recurrence.", "Additional descending-colon disease requires a more proximal healthy target.", ["resection-margins"]),
        revisedChoice("extended-sigmoid", "Transverse colon proximally; distal sigmoid distally", "This combines unnecessary proximal extension with retention of distal sigmoid; both proposed targets need correction in this context.", "Combining proximal diverticula clearance with a first-soft-distal-segment rule.", "A different established descending-colon indication could use these anatomic targets and would require separate evidence.", ["resection-margins"]),
      ],
      explanation: "Assess each margin independently. Remove diseased sigmoid to a healthy rectal distal target while using healthy uninvolved proximal colon. Scattered diverticula in uninflamed descending colon do not require extension to transverse colon.",
      reasoning: {
        interpret: "Separate actual inflammatory disease from proximal diverticulosis and a merely soft distal sigmoid segment.",
        apply: "Choose both a healthy conservative proximal target and the supported rectal distal target.",
        closestChoice: "limited", counterfactualChoice: "extended",
        decidingObservation: "Uninflamed descending colon reaches healthy rectum; soft distal sigmoid remains sigmoid.",
        counterfactual: "Additional descending-colon disease with transverse colon as the next suitable healthy proximal target would support transverse-to-rectum reconstruction.",
        deletionTest: "Without disease extent the proximal choice is uncertain; without healthy reachable rectum the distal plan is uncertain. Balanced alternatives prevent majority-word convergence.",
        cueAttack: "Each proximal and distal target occurs twice in a two-by-two matrix. The fourth plan combines two actual boundary misconceptions, without an unrelated filler operation.",
        stageAudit: "Four complete target pairs at one operation, reviewed afterward in clinic.",
        difficulty: "moderate", difficultyReason: "Interpret disease boundaries, then apply both proximal preservation and distal rectal-target rules without a word-frequency shortcut.",
        sequenceCheck: "Standalone completed operative-record review without preceding margin feedback.",
        limitation: "The fourth plan is technically interpretable, not reasonable for this same disease. No cancer or IBD boundary recommendation is introduced.",
      },
    },
  },
  {
    slug: "flat-vascular-lesion-treatment", status: "revised",
    reason: "Fair moderate rather than hard: interpret residual distributed oozing after focal control, then select an accepted feasible treatment for the remaining mucosal vascular target.",
    changes: ["Remove tailored negative diverticular finding", "Add a focal-treatment response", "Avoid a universal modality hierarchy"],
    patch: {
      task: "Which completed endoscopic plan best fits {patientName}'s post-treatment findings?",
      update: "During prepared colonoscopy, a flat branching red vascular patch in the cecum oozed after washing. A clip stopped a focal point in its center. Further washing showed slow oozing across the remaining flat branching patch beyond the clipped point. The surrounding mucosa was intact and circulation remained stable. Mechanical, injection and thermal devices were available, and the residual patch was accessible.",
      choices: [
        revisedChoice("clip", "Apply further clips across the residual patch", "The first clip controlled its point but left distributed superficial oozing. Repeating point control fits the remaining pattern less well than the offered accepted noncontact treatment; clips are not declared ineffective for every vascular lesion.", "Repeating a locally successful action without reassessing what remains.", "A discrete reachable vessel remains while surrounding mucosa is dry.", ["angioectasia-apc", "endoscopic-clips"]),
        revisedChoice("inject", "Inject epinephrine across the residual patch", "Injection can provide temporary control but is not the completed definitive plan for this persisting lesion.", "Choosing a flow-reducing bridge as the final therapy.", "Temporary control is needed before a suitable second modality.", ["angioectasia-apc", "epinephrine-not-definitive"]),
        revisedChoice("apc", "Apply argon plasma coagulation across the residual patch", "The remaining flat branching mucosal vascular patch supports angioectasia. APC is an accepted noncontact treatment and is feasible in the recorded examination.", "Reclassifying the residual target after focal treatment.", "An accessible bleeding colonic angioectasia is suitable for noncontact coagulation.", ["angioectasia-apc"]),
      ],
      explanation: "The clip controlled one point while an oozing mucosal vascular patch remained. Reassess the residual target instead of equating focal response with complete control. APC is an accepted treatment for bleeding colonic angioectasia; this does not rank every mechanical and thermal method universally.",
      reasoning: {
        interpret: "The successful focal response leaves a broader superficial vascular target rather than a single remaining point.",
        apply: "Choose an accepted feasible noncontact treatment for the residual angioectatic patch.",
        closestChoice: "clip", counterfactualChoice: "clip",
        decidingObservation: "Oozing persists across the flat branching patch outside the successfully clipped point.",
        counterfactual: "A single remaining reachable vessel with dry surrounding mucosa would favor further focal clipping.",
        deletionTest: "Without the post-clip distribution this is simple morphology-to-APC recall. The response adds reassessment, not new comparative trial evidence.",
        cueAttack: "The tailored no-diverticular-vessel negative is removed. Every plan treats the residual target at the same stage; no label gives the diagnosis.",
        stageAudit: "Three completed local treatment proposals after the same focal clip.",
        difficulty: "moderate", difficultyReason: "Interpret what focal treatment achieved and what remains, then choose accepted lesion-directed therapy. Hard difficulty is not claimed.",
        sequenceCheck: "Standalone; no preceding feedback teaches the lesion or method.",
        limitation: "One historical ACG guideline supports APC with low-quality conditional evidence. This original treatment-response application is not comparative efficacy proof. A current permitted endoscopy cross-check and clinical confirmation remain outstanding.",
      },
    },
  },
];

const casePresentationRevisions: Record<string, string> = {
  "perforation-operative-review": "{patientName}, a 46-year-old man, attends clinic after emergency abdominal surgery at an outside hospital. The clinic review examines his operative record.",
  "immunosuppressed-recovery": "{patientName}, a 68-year-old woman, attends clinic to review her first sigmoid inflammatory episode. Her records document a kidney transplant treated with tacrolimus and mycophenolate and chronic lung disease requiring home oxygen.",
  "elective-resection-planning": "{patientName}, a 57-year-old woman, attends clinic after elective sigmoid surgery for recurrent diverticulitis. The clinic review examines the operative record.",
};
const revisedCase = (item: TopicCase): TopicCase => ({
  ...structuredClone(item),
  ...(casePresentationRevisions[item.slug]
    ? { presentation: casePresentationRevisions[item.slug], version: 2 as const } : {}),
  nodes: item.nodes.map((node) => {
    const spec = COLON_TOPIC_REVISION_SPECS.find((candidate) => candidate.slug === node.slug);
    return spec ? { ...structuredClone(node), ...spec.patch, version: 2 as const,
      reasoning: { ...node.reasoning, ...spec.patch.reasoning } } : structuredClone(node);
  }),
});
export const COLON_TOPIC_REVISION_ATTEMPT_ITEMS = COLON_TOPIC_REVIEWED_V1_ITEMS
  .map(revisedCase).map((item) => ({ ...item, nodes: item.nodes.filter((node) => node.version === 2) }))
  .filter((item) => item.nodes.length > 0);
export const COLON_TOPIC_ITEMS = COLON_TOPIC_REVIEWED_V1_ITEMS.map(revisedCase)
  .map((item) => ({ ...item, nodes: item.nodes.filter((node) =>
    COLON_TOPIC_REVISION_SPECS.find((spec) => spec.slug === node.slug)?.status !== "parked") }))
  .filter((item) => item.nodes.length > 0);
export const COLON_TOPIC_PARKED_ITEMS = COLON_TOPIC_REVISION_ATTEMPT_ITEMS
  .map((item) => ({ ...item, nodes: item.nodes.filter((node) =>
    COLON_TOPIC_REVISION_SPECS.find((spec) => spec.slug === node.slug)?.status === "parked") }))
  .filter((item) => item.nodes.length > 0);
const draftForNode = (node: TopicNode) => node.version === 2
  ? { ...COLON_TOPIC_DRAFT, contentVersion: COLON_TOPIC_REVISION_VERSION } : COLON_TOPIC_DRAFT;
const caseId = (item: TopicCase) => `case.topic.${topic}.${item.slug}.v${item.version ?? 1}`;
const questionId = (node: TopicNode) => `question.topic.${topic}.${node.slug}.v${node.version ?? 1}`;
const nodeId = (node: TopicNode) => `node.topic.${topic}.${node.slug}.v${node.version ?? 1}`;
const choiceId = (node: TopicNode, choice: TopicChoice) => `choice.topic.${topic}.${node.slug}.${choice.id}.v${node.version ?? 1}`;
const evidenceForNode = (node: TopicNode) => [...new Set([
  ...node.claims,
  ...node.choices.flatMap((choice) => choice.claims),
])].map(claimId);

export const COLON_TOPIC_CLAIMS = ledger.claims as EvidenceClaim[];
export const COLON_TOPIC_SOURCES = ledger.sources as ClinicalSource[];

const buildQuestions = (items: TopicCase[]): QuestionVariant[] => items.flatMap((item) =>
  item.nodes.map((node) => ({
    ...draftForNode(node),
    id: questionId(node),
    conceptId: node.conceptId,
    stem: node.task,
    answerChoices: node.choices.map((choice) => ({
      id: choiceId(node, choice),
      label: choice.label,
      isCorrect: choice.id === node.correctChoice,
      rationale: choice.rationale,
      distractorRationale: choice.id === node.correctChoice ? null : choice.rationale,
    })),
    explanation: node.explanation,
    ...(node.exhibit ? { exhibit: node.exhibit } : {}),
    supportingEvidenceClaimIds: evidenceForNode(node),
  })),
);

export const COLON_TOPIC_QUESTIONS = buildQuestions(COLON_TOPIC_ITEMS);

const uniqueNodes = [...new Map(COLON_TOPIC_ITEMS.flatMap((item) => item.nodes).map((node) =>
  [node.conceptId, node],
)).values()];

export const COLON_TOPIC_CONCEPTS: TestedConcept[] = uniqueNodes.map((node) => ({
  id: node.conceptId,
  displayName: node.displayName,
  learningObjective: node.objective,
  earliestFacilityStage: 1,
  conceptType: node.conceptType,
}));

export const COLON_TOPIC_AUTHORING_CONCEPTS = uniqueNodes.map((node) => ({
  ...COLON_TOPIC_DRAFT,
  ...COLON_TOPIC_CONCEPTS.find((concept) => concept.id === node.conceptId)!,
  educationalTier: 1,
  conceptRelation: node.conceptRelation,
  previousConceptId: node.previousConceptId ?? null,
  evidenceClaimIds: [...new Set(COLON_TOPIC_ITEMS.flatMap((item) => item.nodes)
    .filter((candidate) => candidate.conceptId === node.conceptId)
    .flatMap((candidate) => evidenceForNode(candidate)))],
  identityDecision: node.conceptRelation === "reuse"
    ? "The original scored meaning is retained under its existing stable identity. This is a fresh question version."
    : node.previousConceptId
      ? "The scored meaning changes materially. Preserve the predecessor definition and history. Integration requires the new concept identity."
      : "A distinct consequential objective receives a new topic-local identity.",
}));

const sourceLabels = [
  "Original constructed clinic chart review of outside records",
  "AI-assisted clinical draft requiring Melissa Rowland's review",
];

const buildCases = (items: TopicCase[]): SyntheticClinicalCase[] => {
  const questions = buildQuestions(items);
  return items.map((item) => {
  const demographics = { ageYears: item.age, sexLabel: item.sex };
  return {
    id: caseId(item),
    displayName: item.complaint,
    patientDisplayName: item.name,
    patientPresentationVariantId: `presentation.topic.${topic}.${item.slug}.v${item.version ?? 1}`,
    prototypeDemographics: demographics,
    chiefComplaint: item.complaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.${topic}.${item.slug}.v${item.version ?? 1}`,
      prototypeDemographics: demographics,
      chiefComplaint: item.complaint,
      presentation: item.presentation,
    }],
    releasePointId: "release.l0.clinic_evaluation",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 1,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels,
    decisionNodes: item.nodes.map((node, index) => {
      const question = questions.find((candidate) => candidate.id === questionId(node))!;
      return {
        id: nodeId(node),
        questionVariantId: question.id,
        primaryConceptId: node.conceptId,
        currentUpdate: node.update,
        stem: question.stem,
        answerChoices: question.answerChoices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          isCorrect: choice.isCorrect,
          rationale: choice.rationale!,
          serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: question.explanation,
        ...(node.exhibit ? { exhibit: node.exhibit } : {}),
        sourceLabels,
        resultGateAfter: null,
        terminalDispositions: (node.version === 2
          ? index === item.nodes.length - 1
          : COLON_TOPIC_REVIEWED_V1_ITEMS.find((candidate) => candidate.slug === item.slug)!.nodes.at(-1)!.slug === node.slug)
          ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative: "This retrospective chart review ends with explanation of the proposed decision.",
            clinicalRationale: choice.rationale!,
            sourceLabels,
          }))
          : [],
      };
    }),
    learningSummary: item.nodes.map((node) => node.explanation).join(" "),
  };
  });
};
/** The urinary CT PASS was nonterminal as reviewed. Removing its parked
 * follow-on would require changing that PASS node's terminal metadata. Keep
 * the entire reviewed context in this audit-only export and defer assembly. */
export const COLON_TOPIC_DEFERRED_PASS_CASES = buildCases(
  COLON_TOPIC_REVIEWED_V1_ITEMS.filter((item) => item.slug === "urinary-symptoms"),
);
export const COLON_TOPIC_CASES = buildCases(
  COLON_TOPIC_ITEMS.filter((item) => item.slug !== "urinary-symptoms"),
);

export const COLON_TOPIC_CASE_REVIEWS = COLON_TOPIC_ITEMS.map((item) => ({
  ...COLON_TOPIC_DRAFT,
  caseId: caseId(item),
  patientPresentationVariantId: `presentation.topic.${topic}.${item.slug}.v1`,
  finiteProfileIds: [`profile.topic.${topic}.${item.slug}.v${item.version ?? 1}`],
  questionVariantIds: item.nodes.map(questionId),
  evidenceClaimIds: [...new Set(item.nodes.flatMap((node) => evidenceForNode(node)))],
  educationalTier: 1,
  encounterAcuity: "stable",
  historicalDecisionAcuity: item.historicalAcuity,
  earliestFacilityStage: 1,
  requiredCapabilityIds: [],
}));

const buildTiming = (items: TopicCase[]): AnswerChoiceTimingRegistryEntry[] => items.flatMap((item) =>
  item.nodes.map((node) => ({
    caseId: caseId(item),
    nodeId: nodeId(node),
    questionVariantId: questionId(node),
    classification: node.choices.some((choice) => choice.timingProfileId)
      ? {
        kind: "test_choices" as const,
        choices: node.choices.map((choice) => ({
          choiceId: choiceId(node, choice),
          choiceLabel: choice.label,
          timing: choice.timingProfileId
            ? { kind: "test" as const, timingProfileId: choice.timingProfileId }
            : { kind: "no_test" as const },
        })),
      }
      : { kind: "no_test" as const },
  })),
);

export const COLON_TOPIC_TIMING_ENTRIES = buildTiming(COLON_TOPIC_ITEMS);

export const COLON_TOPIC_ORDER_PROPOSALS = COLON_TOPIC_TIMING_ENTRIES.flatMap((entry) =>
  entry.classification.kind === "test_choices"
    ? entry.classification.choices.filter((choice) => choice.timing.kind === "test").map((choice) => ({
      ...COLON_TOPIC_DRAFT,
      caseId: entry.caseId,
      nodeId: entry.nodeId,
      questionVariantId: entry.questionVariantId,
      choiceId: choice.choiceId,
      choiceLabel: choice.choiceLabel,
      timing: choice.timing,
      disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
      serviceRequest: null,
      resultGateAfter: null,
    }))
    : [],
);

const buildSelfChecks = (items: TopicCase[]) => items.flatMap((item) => item.nodes.map((node) => ({
  ...draftForNode(node),
  caseId: caseId(item),
  nodeId: nodeId(node),
  questionVariantId: questionId(node),
  checkedOn: "2026-11-11",
  rubric: "question-authoring.2026-11-08.v15",
  authorVerdict: "DRAFT_FOR_INDEPENDENT_REVIEW",
  independent: false,
  clinicalApproval: false,
  finiteProfileCount: 1,
  ...node.reasoning,
  closestChoiceId: `choice.topic.${topic}.${node.slug}.${node.reasoning.closestChoice}.v${node.version ?? 1}`,
  counterfactualChoiceId: `choice.topic.${topic}.${node.slug}.${node.reasoning.counterfactualChoice}.v${node.version ?? 1}`,
  fiveChecks: [
    { check: "Cover-the-key cue attack", record: node.reasoning.cueAttack },
    { check: "One decision stage and category", record: node.reasoning.stageAudit },
    { check: "Two consequential reasoning steps", record: `${node.reasoning.interpret} ${node.reasoning.apply}` },
    { check: "Predicted resident difficulty", record: `${node.reasoning.difficulty}. ${node.reasoning.difficultyReason}` },
    { check: "One defensible key and counterfactual", record: `${node.reasoning.decidingObservation} ${node.reasoning.counterfactual} Review boundary. ${node.reasoning.limitation}` },
  ],
  optionAudit: node.choices.map((choice) => ({
    choiceId: choiceId(node, choice),
    isKey: choice.id === node.correctChoice,
    temptation: choice.temptation,
    whyRankedHere: choice.rationale,
    reasonableWhen: choice.reasonableWhen,
    evidenceClaimIds: choice.claims.map(claimId),
  })),
})));

export const COLON_TOPIC_SELF_CHECKS = buildSelfChecks(COLON_TOPIC_ITEMS);

const buildMappings = (items: TopicCase[]) => items.flatMap((item) => item.nodes.map((node) => ({
  ...draftForNode(node),
  caseId: caseId(item),
  nodeId: nodeId(node),
  questionVariantId: questionId(node),
  constructedObservations: {
    fields: ["presentation", "currentUpdate", "prototypeDemographics", "approvedInstantiationProfiles"],
    basis: "Original fictional patient records. Ages, measured observations, treatment responses and chronology are constructed applications. These values establish no empirical probability, demographic weight or new clinical cutoff.",
    inferenceClaimIds: evidenceForNode(node),
  },
  fieldMappings: [
    { field: "presentation", claimIds: evidenceForNode(node) },
    { field: "currentUpdate", claimIds: evidenceForNode(node) },
    { field: "stem", claimIds: evidenceForNode(node) },
    { field: "explanation", claimIds: evidenceForNode(node) },
    ...node.choices.map((choice) => ({
      field: `answerChoices.${choiceId(node, choice)}`,
      claimIds: choice.claims.map(claimId),
    })),
    { field: "authorReasoningAndCounterfactuals", claimIds: evidenceForNode(node) },
  ],
})));

export const COLON_TOPIC_STATEMENT_MAPPINGS = buildMappings(COLON_TOPIC_ITEMS);

/** Audit-only v2 attempts, including parked versions. Never assembled by the preview release. */
export const COLON_TOPIC_REVISION_CATALOG = {
  questions: buildQuestions(COLON_TOPIC_REVISION_ATTEMPT_ITEMS),
  cases: buildCases(COLON_TOPIC_REVISION_ATTEMPT_ITEMS),
  selfChecks: buildSelfChecks(COLON_TOPIC_REVISION_ATTEMPT_ITEMS),
  statementMappings: buildMappings(COLON_TOPIC_REVISION_ATTEMPT_ITEMS),
  timing: buildTiming(COLON_TOPIC_REVISION_ATTEMPT_ITEMS),
};
/** Immutable reviewed versions, including returned versions, for audit only. */
export const COLON_TOPIC_REVIEWED_V1_CATALOG = {
  questions: buildQuestions(COLON_TOPIC_REVIEWED_V1_ITEMS),
  cases: buildCases(COLON_TOPIC_REVIEWED_V1_ITEMS),
  selfChecks: buildSelfChecks(COLON_TOPIC_REVIEWED_V1_ITEMS),
  statementMappings: buildMappings(COLON_TOPIC_REVIEWED_V1_ITEMS),
  timing: buildTiming(COLON_TOPIC_REVIEWED_V1_ITEMS),
};

export const COLON_TOPIC_SOURCE_LINKS = COLON_TOPIC_SOURCES.map((source) => ({
  ...COLON_TOPIC_DRAFT,
  sourceId: source.id,
  label: source.title,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

/** Normal explicit-import entry point for structural authoring preview. */
export const COLON_TOPIC_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic clinical draft, not clinically approved. AI-assisted educational software content requiring review by Melissa Rowland.",
  concepts: COLON_TOPIC_CONCEPTS,
  cases: COLON_TOPIC_CASES,
});

export const COLON_TOPIC_MANIFEST = {
  ...COLON_TOPIC_DRAFT,
  contentVersion: COLON_TOPIC_REVISION_VERSION,
  topicSlug: topic,
  passPreserved: 10,
  revised: 10,
  parked: 5,
  variantCount: COLON_TOPIC_QUESTIONS.length,
  previewVariantCount: COLON_TOPIC_CASES.reduce((total, item) => total + item.decisionNodes.length, 0),
  deferredPassQuestionIds: ["question.topic.colon-diverticular-lower-bleeding.first-episode-with-urinary-symptoms.v1"],
  caseCount: COLON_TOPIC_CASES.length,
  conceptCount: COLON_TOPIC_CONCEPTS.length,
  reviewDisplay: "key shown first for review only",
  encounterMode: "outside-records-review-in-clinic",
  educationalTier: 1,
  encounterAcuity: "stable",
  earliestFacilityStage: 1,
  requiredCapabilityIds: [],
  managerAccepted: false,
  independentPass: false,
  clinicalApproval: false,
  selectionLimitation: "Twenty questions are retained: twelve nodes in six pairs and eight standalone. The preview assembles nineteen nodes in thirteen cases. One nonterminal CT-selection PASS is deferred because parking its follow-on would require changing its exact terminal metadata. Its complete reviewed case is audit-only. Existing all-concepts-unseen-or-due eligibility can block paired nodes. Five v2 attempts are parked. PASS versions and prior visible feedback remain frozen.",
  integrationDependencies: [
    "Ten exact v1 items have editorial PASS; ten active v2 items and five parked v2 attempts have no independent re-review. Manager acceptance and named clinical decisions remain pending.",
    "Manager installs accepted concept, question, case, timing and order definitions from this explicitly imported sidecar.",
    "Manager appends exact choice identity and label mappings using existing placeholder timing profiles.",
    "Retrospective planned-test proposals use not_executed/future_planned disposition. All supplied results are authored outside records.",
    "The manager preserves original cases, frozen encounters, old concept definitions and their FSRS histories during integration.",
    "Cancer-specific treatment and detailed endoscopy-modality rankings require coordination with the colorectal-polyp/cancer lane.",
    "Clinical source metadata for the historical recovered-diverticulitis ASCRS 2020 citation needs a manager correction. Its recorded DOI differs from PubMed.",
  ],
};

/** Standalone contexts for the three PASS nodes skipped by acceptance batch 3.
 * Original questions, reviewed contexts and accepted cases remain unchanged.
 * Only these new contexts require salvage re-review; no companion is admitted. */
export const COLON_TOPIC_SALVAGE_VERSION = "question-topic-colon-diverticular-lower-bleeding.salvage.2026-11-11.v1";
const salvageDraft = { ...COLON_TOPIC_DRAFT, contentVersion: COLON_TOPIC_SALVAGE_VERSION };
const salvageSlugs = [
  "first-episode-with-urinary-symptoms",
  "first-presentation-ct",
  "post-recovery-alarm-colonoscopy",
] as const;

export const COLON_TOPIC_SALVAGE_ORIGINS = salvageSlugs.map((slug) => {
  const question = COLON_TOPIC_QUESTIONS.find((question) =>
    question.id === `question.topic.${topic}.${slug}.${slug === "post-recovery-alarm-colonoscopy" ? "v2" : "v1"}`,
  )!;
  const originalCase = [...COLON_TOPIC_CASES, ...COLON_TOPIC_DEFERRED_PASS_CASES]
    .find((item) => item.decisionNodes.some((node) => node.questionVariantId === question.id))!;
  const originalNode = originalCase.decisionNodes.find((node) => node.questionVariantId === question.id)!;
  return {
    ...salvageDraft,
    status: "salvage" as const,
    questionVariantId: question.id,
    conceptId: question.conceptId,
    originalCaseId: originalCase.id,
    originalNodeId: originalNode.id,
    originalNodeIndex: originalCase.decisionNodes.indexOf(originalNode),
    caseId: `case.topic.${topic}.salvage-${slug}.v1`,
    nodeId: `node.topic.${topic}.salvage-${slug}.v1`,
    patientPresentationVariantId: `presentation.topic.${topic}.salvage-${slug}.v1`,
    profileId: `profile.topic.${topic}.salvage-${slug}.v1`,
    presentationChange: "None. The original first-node clinic presentation and fixed profile already contain the necessary context.",
    nodeChanges: ["New standalone node identity", "Explicit wrong-final-answer terminal metadata"],
    independentPass: false,
    clinicalApproval: false,
  };
});

/** Exact PASS question objects and concept identities, reused without edits. */
export const COLON_TOPIC_SALVAGE_QUESTIONS = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) =>
  COLON_TOPIC_QUESTIONS.find((question) => question.id === origin.questionVariantId)!,
);
export const COLON_TOPIC_SALVAGE_CONCEPTS = COLON_TOPIC_CONCEPTS.filter((concept) =>
  COLON_TOPIC_SALVAGE_ORIGINS.some((origin) => origin.conceptId === concept.id),
);

export const COLON_TOPIC_SALVAGE_CASES: SyntheticClinicalCase[] = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) => {
  const originalCase = [...COLON_TOPIC_CASES, ...COLON_TOPIC_DEFERRED_PASS_CASES]
    .find((item) => item.id === origin.originalCaseId)!;
  const originalNode = originalCase.decisionNodes.find((node) => node.id === origin.originalNodeId)!;
  const node = {
    ...structuredClone(originalNode),
    id: origin.nodeId,
    terminalDispositions: originalNode.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome" as const,
      consequenceNarrative: "This retrospective chart review ends with explanation of the proposed decision.",
      clinicalRationale: choice.rationale!,
      sourceLabels: [...sourceLabels],
    })),
  };
  return {
    ...structuredClone(originalCase),
    id: origin.caseId,
    patientPresentationVariantId: origin.patientPresentationVariantId,
    approvedInstantiationProfiles: originalCase.approvedInstantiationProfiles!.map((profile) => ({
      ...structuredClone(profile), id: origin.profileId,
    })),
    decisionNodes: [node],
    learningSummary: originalNode.explanation,
  };
});

export const COLON_TOPIC_SALVAGE_CASE_REVIEWS = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) => ({
  ...COLON_TOPIC_CASE_REVIEWS.find((review) => review.caseId === origin.originalCaseId)!,
  ...salvageDraft,
  status: "salvage" as const,
  caseId: origin.caseId,
  patientPresentationVariantId: origin.patientPresentationVariantId,
  finiteProfileIds: [origin.profileId],
  questionVariantIds: [origin.questionVariantId],
  evidenceClaimIds: COLON_TOPIC_SALVAGE_QUESTIONS.find((question) => question.id === origin.questionVariantId)!.supportingEvidenceClaimIds,
}));

export const COLON_TOPIC_SALVAGE_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) => ({
  ...structuredClone(COLON_TOPIC_TIMING_ENTRIES.find((entry) => entry.questionVariantId === origin.questionVariantId)!),
  caseId: origin.caseId,
  nodeId: origin.nodeId,
}));
export const COLON_TOPIC_SALVAGE_ORDER_PROPOSALS = COLON_TOPIC_SALVAGE_TIMING_ENTRIES.flatMap((entry) =>
  entry.classification.kind === "test_choices"
    ? entry.classification.choices.filter((choice) => choice.timing.kind === "test").map((choice) => ({
      ...salvageDraft,
      status: "salvage" as const,
      caseId: entry.caseId,
      nodeId: entry.nodeId,
      questionVariantId: entry.questionVariantId,
      choiceId: choice.choiceId,
      choiceLabel: choice.choiceLabel,
      timing: choice.timing,
      disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
      serviceRequest: null,
      resultGateAfter: null,
    })) : [],
);
export const COLON_TOPIC_SALVAGE_STATEMENT_MAPPINGS = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) => ({
  ...structuredClone(COLON_TOPIC_STATEMENT_MAPPINGS.find((entry) => entry.questionVariantId === origin.questionVariantId)!),
  ...salvageDraft,
  status: "salvage" as const,
  caseId: origin.caseId,
  nodeId: origin.nodeId,
  contextChange: "No clinical text or observation added. Reuse the original first-node clinic header, profile, update, exhibit, task, choices and feedback.",
}));
export const COLON_TOPIC_SALVAGE_SELF_CHECKS = COLON_TOPIC_SALVAGE_ORIGINS.map((origin) => ({
  ...structuredClone(COLON_TOPIC_SELF_CHECKS.find((check) => check.questionVariantId === origin.questionVariantId)!),
  ...salvageDraft,
  status: "salvage" as const,
  caseId: origin.caseId,
  nodeId: origin.nodeId,
  authorVerdict: "SALVAGE_FOR_INDEPENDENT_CONTEXT_REVIEW",
  sequenceCheck: "Standalone first-node context. The original scored node was also first, so no prior result, answer or explanation is removed from the learner's pre-answer context. No non-PASS companion remains.",
  contextReview: "The complete passed question and every visible clinical field stay exact. New case/profile/node identities and final-node terminal metadata isolate the target. The existing clinic frame already supplies all necessary context; zero added presentation words.",
  independent: false,
  clinicalApproval: false,
}));

/** Explicit-import review target for these three salvage contexts only. */
export const COLON_TOPIC_SALVAGE_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  ...COLON_TOPIC_SOURCE_RELEASE,
  concepts: COLON_TOPIC_SALVAGE_CONCEPTS,
  cases: COLON_TOPIC_SALVAGE_CASES,
});
export const COLON_TOPIC_SALVAGE_MANIFEST = {
  ...salvageDraft,
  status: "salvage" as const,
  topicSlug: topic,
  caseCount: COLON_TOPIC_SALVAGE_CASES.length,
  nodeCount: COLON_TOPIC_SALVAGE_CASES.length,
  questionVariantCount: COLON_TOPIC_SALVAGE_QUESTIONS.length,
  conceptCount: COLON_TOPIC_SALVAGE_CONCEPTS.length,
  newClinicalStatements: 0,
  newConcepts: 0,
  presentationWordsAdded: 0,
  reviewDisplay: "key shown first for review only",
  runtimeAnswerOrder: "randomized",
  independentPass: false,
  managerAccepted: false,
  clinicalApproval: false,
  integration: "Re-review only the three standalone contexts. Preserve all accepted nodes and original contexts. Install exact new case/node timing and order tuples only after manager acceptance; no shared integration performed here.",
};
