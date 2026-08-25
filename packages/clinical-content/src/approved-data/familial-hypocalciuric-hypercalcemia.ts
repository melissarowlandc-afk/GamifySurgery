import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";

export const ROW_060_CONTENT_VERSION =
  "clinical.owner-row-060.2026-08-13.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_060_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-13",
    contentVersion: ROW_060_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_060_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const BIOCHEMICAL_PATTERN_CLAIM_ID =
  "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria";
const URINE_EVALUATION_CLAIM_ID =
  "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation";
const CLEARANCE_LIMITATION_CLAIM_ID =
  "claim.fhh.low-cccr-supports-but-does-not-confirm";
const GENETIC_CONFIRMATION_CLAIM_ID =
  "claim.fhh.genetic-and-family-confirmation";
const MANAGEMENT_CLAIM_ID =
  "claim.fhh.reassurance-observation-avoid-parathyroid-surgery";

const WORKUP_CONCEPT_ID = "concept.fhh.biochemical-evaluation";
const RECOGNITION_CONCEPT_ID = "concept.fhh.recognition-and-confirmation";
const MANAGEMENT_CONCEPT_ID = "concept.fhh.avoid-parathyroid-surgery";

const PRESENTATION_IDS = {
  initialEvaluation: "presentation.fhh.initial-biochemical-evaluation",
  returnManagement: "presentation.fhh.confirmed-return-management",
  interpretSuggestive: "presentation.fhh.suggestive-results-confirmation",
  confirmedManagement: "presentation.fhh.confirmed-asymptomatic-management",
  surgicalCounseling: "presentation.fhh.parathyroid-surgery-counseling",
} as const;

const QUESTION_IDS = {
  initialEvaluation: "question.fhh.initial-biochemical-evaluation.v1",
  returnManagement: "question.fhh.confirmed-return-management.v1",
  interpretSuggestive: "question.fhh.suggestive-results-confirmation.v1",
  confirmedManagement: "question.fhh.confirmed-asymptomatic-management.v1",
  surgicalCounseling: "question.fhh.parathyroid-surgery-counseling.v1",
} as const;

const SOURCE_LABELS = [
  "Bollerslev et al., ESE PARAT parathyroid-disorders consensus, 2022",
  "Bilezikian et al., Fifth International Workshop PHPT guideline, 2022",
  "Clinically approved by Melissa Rowland, MD on 2026-08-13",
] as const;

export const ROW_060_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-060.2026-08-13",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-13",
  contentVersion: ROW_060_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (3).xlsx",
    sheetName: "Sheet1",
    sourceRow: 60,
    sourceRecordKey: "owner-concept.sheet1.row-060",
    intakeRecord: "NEW_CONCEPT_INTAKE_2026-08-10.md",
    approvedScopeDecisionId:
      "decision.owner-row-060.fhh-three-concept-four-encounter-package.2026-08-13",
    exactApprovalConversationDate: "2026-08-13",
  },
  approvedConceptIds: [
    WORKUP_CONCEPT_ID,
    RECOGNITION_CONCEPT_ID,
    MANAGEMENT_CONCEPT_ID,
  ],
  approvedConceptTypes: ["workup", "diagnosis", "management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    BIOCHEMICAL_PATTERN_CLAIM_ID,
    URINE_EVALUATION_CLAIM_ID,
    CLEARANCE_LIMITATION_CLAIM_ID,
    GENETIC_CONFIRMATION_CLAIM_ID,
    MANAGEMENT_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "three_concept_split",
    "four_encounter_variants",
    "five_single_select_scored_decisions",
    "one_two_decision_evaluation_to_management_encounter",
    "paired_24_hour_urine_and_serum_calcium_creatinine_evaluation",
    "relative_hypocalciuria_not_hypercalciuria",
    "low_clearance_ratio_as_clue_not_standalone_diagnosis",
    "family_and_genetic_context_for_confirmation",
    "reassurance_observation_and_avoidance_of_unnecessary_surgery",
    "authored_later_follow_up_without_facility_time_simulation",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "hypercalciuria_as_the_fhh_return_result",
    "low_urinary_calcium_as_independently_diagnostic",
    "serum_magnesium_as_a_definitive_discriminator",
    "routine_parathyroid_localization_before_biochemical_differentiation",
    "routine_parathyroidectomy_for_confirmed_fhh",
    "routine_lifelong_cinacalcet_for_every_fhh_case",
    "prior_variant_three_confounded-low-ratio-question",
    "prior_variant_four_reverse-recognition-question",
  ],
  multiDecisionAssessment: {
    status: "approved_two_decision_encounter",
    rationale:
      "One encounter scores the initial biochemical evaluation and then an explicitly authored later return after family and genetic confirmation, where management is scored. The collection and genetic interval is not simulated with the clinic's generic laboratory timer.",
  },
} as const;

export const ROW_060_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bollerslev.parat-parathyroid-consensus.2022",
    title:
      "European expert consensus on practical management of specific aspects of parathyroid disorders in adults and in pregnancy: recommendations of the ESE Educational Program of Parathyroid Disorders (PARAT 2021)",
    completeCitation:
      "Bollerslev J, Rejnmark L, Zahn A, et al.; 2021 PARAT Working Group. European expert consensus on practical management of specific aspects of parathyroid disorders in adults and in pregnancy: recommendations of the ESE Educational Program of Parathyroid Disorders (PARAT 2021). Eur J Endocrinol. 2022;186(2):R33-R63. doi:10.1530/EJE-21-1044.",
    organizationOrJournal:
      "European Journal of Endocrinology / European Society of Endocrinology",
    authors: [
      "Jens Bollerslev",
      "Lars Rejnmark",
      "Alexandra Zahn",
      "Ansgar Heck",
      "Natasha M Appelman-Dijkstra",
      "Luis Cardoso",
      "Fadil M Hannan",
      "Filomena Cetani",
      "2021 PARAT Working Group",
    ],
    publicationYear: 2022,
    doi: "10.1530/EJE-21-1044",
    pmid: "34863037",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8789028/",
    accessedOn: "2026-08-13",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, figures, tables, or diagnostic algorithms.",
    authorityAssessment:
      "European Society of Endocrinology expert consensus directly addressing the differential diagnosis of FHH, biochemical-test limitations, genetic evaluation, and the no-routine-surgery boundary.",
    usageRole: "evidence",
    evidenceClaimIds: [
      BIOCHEMICAL_PATTERN_CLAIM_ID,
      URINE_EVALUATION_CLAIM_ID,
      CLEARANCE_LIMITATION_CLAIM_ID,
      GENETIC_CONFIRMATION_CLAIM_ID,
      MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    title:
      "Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop",
    completeCitation:
      "Bilezikian JP, Khan AA, Silverberg SJ, et al.; International Workshop on Primary Hyperparathyroidism. Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop. J Bone Miner Res. 2022;37(11):2293-2314. doi:10.1002/jbmr.4677.",
    organizationOrJournal:
      "Journal of Bone and Mineral Research / International Workshop on Primary Hyperparathyroidism",
    authors: [
      "John P Bilezikian",
      "Aliya A Khan",
      "Shonni J Silverberg",
      "Ghada El-Hajj Fuleihan",
      "Claudio Marcocci",
      "Salvatore Minisola",
      "Nancy Perrier",
      "Antonio Sitges-Serra",
      "Rajesh V Thakker",
      "International Workshop on Primary Hyperparathyroidism",
    ],
    publicationYear: 2022,
    doi: "10.1002/jbmr.4677",
    pmid: "36245251",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/36245251/",
    accessedOn: "2026-08-13",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "Copyrighted guideline; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Current international workshop guideline independently supporting consideration of FHH in younger patients or those with familial hypercalcemia, use and limitations of the clearance ratio, and avoidance of surgery in most confirmed cases.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      BIOCHEMICAL_PATTERN_CLAIM_ID,
      URINE_EVALUATION_CLAIM_ID,
      CLEARANCE_LIMITATION_CLAIM_ID,
      GENETIC_CONFIRMATION_CLAIM_ID,
      MANAGEMENT_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_060_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: BIOCHEMICAL_PATTERN_CLAIM_ID,
    statement:
      "FHH commonly presents as lifelong, nonprogressive mild hypercalcemia with normal or mildly increased PTH, typically low urinary calcium excretion, and often a family history of hypercalcemia.",
    sourceIds: [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    ],
    evidenceCategory: "presentation",
    certainty: "moderate",
    limitation:
      "No individual feature is sufficient to distinguish FHH from primary hyperparathyroidism, and serum magnesium is not a reliable discriminator.",
    applicablePopulation:
      "Stable patients undergoing outpatient evaluation of persistent PTH-dependent hypercalcemia.",
    lastCheckedOn: "2026-08-13",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: URINE_EVALUATION_CLAIM_ID,
    statement:
      "When FHH is suspected, urinary calcium excretion should be evaluated with a calcium-to-creatinine clearance ratio calculated from concurrent serum measurements and a 24-hour urine calcium and creatinine collection.",
    sourceIds: [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Collection quality, renal function, vitamin-D status, pregnancy, and thiazides can affect interpretation; the game does not treat the collection as localization imaging.",
    applicablePopulation:
      "Stable patients with persistent hypercalcemia and nonsuppressed PTH when FHH and primary hyperparathyroidism are being differentiated.",
    lastCheckedOn: "2026-08-13",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: CLEARANCE_LIMITATION_CLAIM_ID,
    statement:
      "A calcium-to-creatinine clearance ratio below 0.01 supports suspicion for FHH but cannot confirm the diagnosis by itself because values overlap with primary hyperparathyroidism.",
    sourceIds: [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "The exact 0.01 threshold is used only as a source-supported screening clue, not as a standalone diagnostic cutoff.",
    applicablePopulation:
      "Patients with interpretable paired serum and 24-hour urine calcium and creatinine measurements.",
    lastCheckedOn: "2026-08-13",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: GENETIC_CONFIRMATION_CLAIM_ID,
    statement:
      "Suggestive biochemistry and family history should prompt family evaluation and genetic testing; a pathogenic FHH-associated variant can confirm the diagnosis, while negative testing does not exclude every clinically suspected case.",
    sourceIds: [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Variants of uncertain significance and mutation-negative clinically suspected FHH require specialist interpretation; the approved questions use a pathogenic CASR result when confirmation is stated.",
    applicablePopulation:
      "Patients with a biochemical and family pattern that raises suspicion for FHH.",
    lastCheckedOn: "2026-08-13",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: MANAGEMENT_CLAIM_ID,
    statement:
      "Confirmed uncomplicated FHH is generally managed with reassurance and observation rather than parathyroid surgery, which usually does not correct the inherited calcium-sensing disorder.",
    sourceIds: [
      "source.bollerslev.parat-parathyroid-consensus.2022",
      "source.bilezikian.fifth-workshop-phpt-guideline.2022",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Rare symptomatic or atypical FHH and coexisting primary hyperparathyroidism require specialist individualized management and are excluded from these variants.",
    applicablePopulation:
      "Asymptomatic patients with confirmed FHH, stable mild hypercalcemia, and no authored complication or coexisting primary hyperparathyroidism.",
    lastCheckedOn: "2026-08-13",
  },
] satisfies EvidenceClaim[];

export const ROW_060_CONCEPTS = [
  {
    id: WORKUP_CONCEPT_ID,
    displayName: "Biochemical evaluation for suspected FHH",
    learningObjective:
      "Order paired 24-hour urine and serum calcium-creatinine measurements before parathyroid localization when FHH is suspected.",
    earliestFacilityStage: 0,
    conceptType: "workup",
  },
  {
    id: RECOGNITION_CONCEPT_ID,
    displayName: "Recognize and confirm FHH",
    learningObjective:
      "Use relative hypocalciuria, family context, and appropriate genetic evaluation without treating a low clearance ratio as independently diagnostic.",
    earliestFacilityStage: 0,
    conceptType: "diagnosis",
  },
  {
    id: MANAGEMENT_CONCEPT_ID,
    displayName: "Avoid unnecessary parathyroid surgery in FHH",
    learningObjective:
      "Reassure and observe a patient with confirmed uncomplicated FHH rather than performing routine parathyroid surgery.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type ApprovedFhhQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l0.clinic_evaluation";
  earliestFacilityStage: 0;
  requiredClinicalSetting: "clinic";
  requiredCapabilityIds: readonly [];
  encounterRole:
    | "two-decision-clinic-pathway"
    | "single-decision-clinic-review";
  shuffleAnswers: true;
};

export const ROW_060_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.initialEvaluation,
    presentationVariantId: PRESENTATION_IDS.initialEvaluation,
    patientPresentation:
      "A 27-year-old with repeatedly mild hypercalcemia, high-normal PTH, no nephrolithiasis, and a parent with similar calcium values is referred before parathyroid localization. The patient asks which test can help determine whether an inherited disorder is responsible.",
    conceptId: WORKUP_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "two-decision-clinic-pathway",
    stem: "What evaluation should you obtain next for this patient?",
    answerChoices: [
      {
        id: "paired_24h_urine_serum_values",
        label: "24-hour urine calcium and creatinine with paired serum values",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "localization_before_differentiation",
        label:
          "Neck ultrasound and sestamibi before biochemical differentiation",
        isCorrect: false,
        distractorRationale:
          "Localization imaging is not the next step when an inherited biochemical mimic of primary hyperparathyroidism remains plausible.",
      },
      {
        id: "parathyroid_biopsy",
        label: "Parathyroid biopsy to distinguish inherited from sporadic disease",
        isCorrect: false,
        distractorRationale:
          "Parathyroid biopsy does not establish the biochemical and inherited distinction and is not the appropriate diagnostic step.",
      },
      {
        id: "magnesium_alone",
        label: "Serum magnesium alone as the definitive discriminator",
        isCorrect: false,
        distractorRationale:
          "Serum magnesium may vary but does not reliably distinguish FHH from primary hyperparathyroidism.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Paired serum values and a 24-hour urine calcium and creatinine collection allow calculation of calcium-to-creatinine clearance. This helps evaluate FHH before localization or surgery, but the result must be interpreted with the full clinical context.",
    supportingEvidenceClaimIds: [
      BIOCHEMICAL_PATTERN_CLAIM_ID,
      URINE_EVALUATION_CLAIM_ID,
      CLEARANCE_LIMITATION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.returnManagement,
    presentationVariantId: PRESENTATION_IDS.returnManagement,
    patientPresentation:
      "At a later endocrine follow-up, relative hypocalciuria, family evaluation, and a pathogenic CASR result confirm FHH. The patient remains asymptomatic with stable mild hypercalcemia and no complications and asks whether treatment or surgery is needed.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "two-decision-clinic-pathway",
    stem: "What management plan should you recommend for this patient?",
    answerChoices: [
      {
        id: "reassure_observe_no_surgery",
        label: "Reassure and observe without surgery",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "focused_parathyroidectomy",
        label: "Perform focused parathyroidectomy for the inherited disorder",
        isCorrect: false,
        distractorRationale:
          "Routine focused parathyroidectomy does not correct the inherited calcium-sensing disorder.",
      },
      {
        id: "subtotal_parathyroidectomy",
        label: "Perform routine subtotal parathyroidectomy despite confirmation",
        isCorrect: false,
        distractorRationale:
          "Routine subtotal parathyroidectomy should be avoided in uncomplicated confirmed FHH.",
      },
      {
        id: "lifelong_cinacalcet_all",
        label: "Start lifelong cinacalcet routinely for every confirmed case",
        isCorrect: false,
        distractorRationale:
          "Routine drug treatment is not required for every asymptomatic uncomplicated FHH case.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Confirmed uncomplicated FHH is generally benign and is managed with reassurance and observation. Routine parathyroid surgery is avoided because it usually does not correct the inherited disorder.",
    supportingEvidenceClaimIds: [
      GENETIC_CONFIRMATION_CLAIM_ID,
      MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.interpretSuggestive,
    presentationVariantId: PRESENTATION_IDS.interpretSuggestive,
    patientPresentation:
      "A young adult with mild hypercalcemia and nonsuppressed PTH returns to review testing. Renal function and vitamin-D status are adequate, there is no thiazide use, the calcium-to-creatinine clearance ratio is 0.007, and several relatives have mild hypercalcemia. The patient asks what these results mean before surgery is considered.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "How should you interpret this patient's results and proceed?",
    answerChoices: [
      {
        id: "suspect_fhh_genetic_testing",
        label: "Suspect FHH and arrange genetic testing",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "diagnose_phpt_schedule_surgery",
        label: "Diagnose primary hyperparathyroidism and schedule surgery",
        isCorrect: false,
        distractorRationale:
          "The low clearance ratio and family pattern require evaluation for FHH before surgery is planned.",
      },
      {
        id: "ratio_alone_confirms_fhh",
        label: "Diagnose FHH from the clearance ratio alone",
        isCorrect: false,
        distractorRationale:
          "A ratio below 0.01 supports suspicion but overlaps with primary hyperparathyroidism and is not independently diagnostic.",
      },
      {
        id: "malignancy_hypercalcemia",
        label: "Diagnose malignancy-associated hypercalcemia from this pattern",
        isCorrect: false,
        distractorRationale:
          "The familial, mild, PTH-nonsuppressed pattern is not the typical biochemical presentation of malignancy-associated hypercalcemia.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A clearance ratio below 0.01 plus lifelong or familial mild hypercalcemia raises suspicion for FHH, but the ratio does not confirm FHH by itself. Family assessment and genetic testing provide the next diagnostic step.",
    supportingEvidenceClaimIds: [
      BIOCHEMICAL_PATTERN_CLAIM_ID,
      CLEARANCE_LIMITATION_CLAIM_ID,
      GENETIC_CONFIRMATION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.confirmedManagement,
    presentationVariantId: PRESENTATION_IDS.confirmedManagement,
    patientPresentation:
      "Genetic testing confirms a pathogenic CASR variant in an asymptomatic patient with stable mild hypercalcemia, no nephrolithiasis, and no other authored complication. The patient asks whether the confirmed diagnosis requires an operation.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "What plan should you recommend for this patient?",
    answerChoices: [
      {
        id: "reassure_observe_without_parathyroid_surgery",
        label: "Reassure and observe without parathyroid surgery",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "focused_surgery_now",
        label: "Perform focused parathyroidectomy now despite confirmed FHH",
        isCorrect: false,
        distractorRationale:
          "Confirmed uncomplicated FHH is not routinely treated with focused parathyroidectomy.",
      },
      {
        id: "routine_subtotal_surgery",
        label: "Plan routine subtotal parathyroidectomy for inherited disease",
        isCorrect: false,
        distractorRationale:
          "Routine subtotal parathyroidectomy should be avoided in uncomplicated FHH.",
      },
      {
        id: "lifelong_cinacalcet_routine",
        label: "Begin lifelong cinacalcet for every asymptomatic patient",
        isCorrect: false,
        distractorRationale:
          "Every asymptomatic uncomplicated patient does not require chronic drug therapy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "An asymptomatic patient with confirmed uncomplicated FHH is generally reassured and observed. Routine parathyroid surgery is unnecessary and usually ineffective for the inherited calcium-sensing disorder.",
    supportingEvidenceClaimIds: [
      GENETIC_CONFIRMATION_CLAIM_ID,
      MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.surgicalCounseling,
    presentationVariantId: PRESENTATION_IDS.surgicalCounseling,
    patientPresentation:
      "A patient with confirmed uncomplicated FHH and stable mild hypercalcemia asks why the clinic is not referring them for parathyroid surgery.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "Which explanation should you give this patient?",
    answerChoices: [
      {
        id: "surgery_usually_does_not_correct_fhh",
        label: "Parathyroidectomy usually does not correct FHH",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "localized_adenoma_causes_fhh",
        label: "A localized parathyroid adenoma causes FHH and should be removed",
        isCorrect: false,
        distractorRationale:
          "FHH is an inherited calcium-sensing disorder, not a diagnosis established by a localized adenoma.",
      },
      {
        id: "single_gland_excision_cures",
        label: "Routine single-gland excision reliably cures the inherited disorder",
        isCorrect: false,
        distractorRationale:
          "Removing one gland does not reliably correct the systemic inherited calcium-sensing abnormality.",
      },
      {
        id: "prophylactic_thyroidectomy",
        label: "FHH instead requires prophylactic thyroidectomy",
        isCorrect: false,
        distractorRationale:
          "Prophylactic thyroidectomy is not treatment for uncomplicated FHH.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "FHH reflects inherited altered calcium sensing rather than a routine single-gland surgical problem. Parathyroidectomy usually does not normalize the biochemical phenotype and is avoided in uncomplicated confirmed FHH.",
    supportingEvidenceClaimIds: [MANAGEMENT_CLAIM_ID],
  },
] satisfies ApprovedFhhQuestionVariant[];

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];

function getVariant(id: string): ApprovedFhhQuestionVariant {
  const variant = ROW_060_QUESTION_VARIANTS.find(
    (candidate) => candidate.id === id,
  );
  if (!variant) {
    throw new Error(`Missing approved FHH question variant: ${id}`);
  }
  return variant;
}

function answerChoicesFor(
  variant: ApprovedFhhQuestionVariant,
): DecisionNode["answerChoices"] {
  return variant.answerChoices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    serviceRequest: null,
  }));
}

function intermediateNode(
  variant: ApprovedFhhQuestionVariant,
): DecisionNode {
  return {
    id: variant.id.replace(/^question\./, "node."),
    questionVariantId: variant.id,
    primaryConceptId: variant.conceptId,
    stem: variant.stem,
    answerChoices: answerChoicesFor(variant),
    shuffleAnswers: true,
    explanation: variant.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: [],
  };
}

function finalNode(variant: ApprovedFhhQuestionVariant): DecisionNode {
  const answerChoices = answerChoicesFor(variant);
  const correctLabel =
    answerChoices.find((choice) => choice.isCorrect)?.label ??
    "the reviewed plan";
  return {
    id: variant.id.replace(/^question\./, "node."),
    questionVariantId: variant.id,
    primaryConceptId: variant.conceptId,
    stem: variant.stem,
    answerChoices,
    shuffleAnswers: true,
    explanation: variant.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: answerChoices
      .filter((choice) => !choice.isCorrect)
      .map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative:
          `The encounter recorded ${choice.label} instead of ${correctLabel}.`,
        clinicalRationale: variant.explanation,
        sourceLabels: [...SOURCE_LABELS],
      })),
  };
}

function clinicCase(input: {
  id: string;
  displayName: string;
  chiefComplaint: string;
  firstVariantId: string;
  decisionNodes: DecisionNode[];
  learningSummary: string;
}): SyntheticClinicalCase {
  const firstVariant = getVariant(input.firstVariantId);
  return {
    id: input.id,
    displayName: input.displayName,
    patientPresentationVariantId: firstVariant.presentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: input.chiefComplaint,
    presentation: firstVariant.patientPresentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: input.decisionNodes,
    learningSummary: input.learningSummary,
  };
}

const EVALUATION_SUMMARY =
  "Suspected FHH should be evaluated with paired serum and 24-hour urine calcium-creatinine measurements. Relative hypocalciuria is a clue, not an independent diagnosis, so family and genetic context matter.";
const MANAGEMENT_SUMMARY =
  "Confirmed uncomplicated FHH is generally managed with reassurance and observation. Routine parathyroid surgery is avoided because it usually does not correct the inherited calcium-sensing disorder.";

const INITIAL_VARIANT = getVariant(QUESTION_IDS.initialEvaluation);
const RETURN_VARIANT = getVariant(QUESTION_IDS.returnManagement);

export const ROW_060_CASES = [
  clinicCase({
    id: "case.fhh.evaluation-to-confirmed-management",
    displayName: "Clinic Patient: Familial Hypercalcemia Evaluation",
    chiefComplaint: "Persistent mild hypercalcemia",
    firstVariantId: QUESTION_IDS.initialEvaluation,
    decisionNodes: [
      intermediateNode(INITIAL_VARIANT),
      finalNode({
        ...RETURN_VARIANT,
        stem:
          "At a later endocrine follow-up, relative hypocalciuria, family evaluation, and a pathogenic CASR result confirm FHH in the same patient. They remain asymptomatic without complications. What plan should you recommend now?",
      }),
    ],
    learningSummary: `${EVALUATION_SUMMARY} ${MANAGEMENT_SUMMARY}`,
  }),
  clinicCase({
    id: "case.fhh.suggestive-results-confirmation",
    displayName: "Clinic Patient: Suspected Familial Hypercalcemia",
    chiefComplaint: "Review of urine calcium results",
    firstVariantId: QUESTION_IDS.interpretSuggestive,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.interpretSuggestive))],
    learningSummary: EVALUATION_SUMMARY,
  }),
  clinicCase({
    id: "case.fhh.confirmed-asymptomatic-management",
    displayName: "Clinic Patient: Confirmed FHH",
    chiefComplaint: "Management after genetic confirmation",
    firstVariantId: QUESTION_IDS.confirmedManagement,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.confirmedManagement))],
    learningSummary: MANAGEMENT_SUMMARY,
  }),
  clinicCase({
    id: "case.fhh.parathyroid-surgery-counseling",
    displayName: "Clinic Patient: FHH Surgical Counseling",
    chiefComplaint: "Question about parathyroid surgery",
    firstVariantId: QUESTION_IDS.surgicalCounseling,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.surgicalCounseling))],
    learningSummary: MANAGEMENT_SUMMARY,
  }),
] satisfies SyntheticClinicalCase[];

export const ROW_060_APPROVED_ENCOUNTER_BLUEPRINTS = [
  {
    id: "blueprint.fhh.evaluation-to-confirmed-management",
    presentationVariantId: PRESENTATION_IDS.initialEvaluation,
    questionVariantIds: [
      QUESTION_IDS.initialEvaluation,
      QUESTION_IDS.returnManagement,
    ],
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
  },
  ...[
    QUESTION_IDS.interpretSuggestive,
    QUESTION_IDS.confirmedManagement,
    QUESTION_IDS.surgicalCounseling,
  ].map((questionVariantId) => {
    const variant = getVariant(questionVariantId);
    return {
      id: `blueprint.${questionVariantId.replace(/^question\./, "")}`,
      presentationVariantId: variant.presentationVariantId,
      questionVariantIds: [questionVariantId],
      releasePointId: "release.l0.clinic_evaluation" as const,
      earliestFacilityStage: 0 as const,
      requiredClinicalSetting: "clinic" as const,
      requiredCapabilityIds: [] as const,
    };
  }),
];

export const ROW_060_APPROVED_BACKLOG = {
  conceptIds: ROW_060_CONCEPTS.map((concept) => concept.id),
  activeCaseIds: ROW_060_CASES.map((clinicalCase) => clinicalCase.id),
  questionVariantIds: ROW_060_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_060_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
  releasePointIds: ["release.l0.clinic_evaluation"],
  status: "approved_and_active",
  excludedQuestionVariantIds: [
    "question.fhh.confounded-low-ratio-limitation.v1",
    "question.fhh.reverse-recognition.v1",
  ],
  multiDecisionAssessment:
    "Four approved encounter variants contain five scored decisions. One encounter scores biochemical evaluation and then management at an explicitly authored later follow-up; the other three encounters are single-decision reviews.",
} as const;
