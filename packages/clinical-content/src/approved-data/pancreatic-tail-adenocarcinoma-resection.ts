import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_051_CONTENT_VERSION =
  "clinical.owner-row-051.2026-08-10.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_051_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-10",
    contentVersion: ROW_051_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_051_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const DISTAL_RESECTION_CLAIM_ID =
  "claim.pancreatic-adenocarcinoma.body-tail-distal-pancreatectomy";
const ONCOLOGIC_SPLENECTOMY_CLAIM_ID =
  "claim.pancreatic-adenocarcinoma.distal-resection-includes-splenectomy";
const SURGICAL_SELECTION_BOUNDARY_CLAIM_ID =
  "claim.pancreatic-adenocarcinoma.surgical-selection-boundary";
const LOCATION_BOUNDARY_CLAIM_ID =
  "claim.pancreatic-adenocarcinoma.operation-follows-location";
const CONCEPT_ID =
  "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy";

const PRESENTATION_IDS = {
  clinicCounseling:
    "presentation.pancreatic-tail-adenocarcinoma.clinic-counseling",
  procedureByLocation:
    "presentation.pancreatic-tail-adenocarcinoma.procedure-by-location",
  spleenCounseling:
    "presentation.pancreatic-tail-adenocarcinoma.spleen-counseling",
  operativeCandidate:
    "presentation.pancreatic-tail-adenocarcinoma.operative-candidate",
  referralPlan:
    "presentation.pancreatic-tail-adenocarcinoma.referral-plan",
} as const;

const QUESTION_IDS = {
  clinicCounseling:
    "question.pancreatic-tail-adenocarcinoma.clinic-counseling.v1",
  procedureByLocation:
    "question.pancreatic-tail-adenocarcinoma.procedure-by-location.v1",
  spleenCounseling:
    "question.pancreatic-tail-adenocarcinoma.spleen-counseling.v1",
  operativeCandidate:
    "question.pancreatic-tail-adenocarcinoma.operative-candidate.v1",
  referralPlan:
    "question.pancreatic-tail-adenocarcinoma.referral-plan.v1",
} as const;

const SOURCE_LABELS = [
  "Martin-Perez et al., Multidisciplinary Pancreatic Cancer Consensus, 2020",
  "NCI PDQ Pancreatic Cancer Treatment, updated 2025",
  "Clinically approved by Melissa Rowland, MD on 2026-08-10",
] as const;

export const ROW_051_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-051.2026-08-10",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-10",
  contentVersion: ROW_051_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 51,
    sourceRecordKey: "owner-concept.sheet1.row-051",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-051.staged-pancreatic-tail-adenocarcinoma-resection.2026-08-10",
    exactApprovalConversationDate: "2026-08-10",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    DISTAL_RESECTION_CLAIM_ID,
    ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
    SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
    LOCATION_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: [
    "release.l0.clinic_evaluation",
    "release.future.hospital_or",
  ],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity_across_settings",
    "four_level_zero_counseling_and_referral_variants",
    "one_future_hospital_or_planning_variant",
    "biopsy_confirmed_pancreatic_adenocarcinoma",
    "tail_location",
    "multidisciplinary_resectability_determination",
    "absence_of_distant_metastases",
    "fitness_for_major_surgery",
    "distal_pancreatectomy_with_splenectomy",
    "five_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  excludedElements: [
    "absence_of_metastases_as_the_only_resectability_criterion",
    "operation_selection_for_unresectable_or_metastatic_disease",
    "neoadjuvant_or_adjuvant_sequence_selection",
    "spleen_preservation_as_standard_for_confirmed_adenocarcinoma",
    "whipple_for_tail_location",
    "total_pancreatectomy_for_tail_location_alone",
    "generalization_to_benign_distal_lesions_neuroendocrine_tumors_or_trauma",
  ],
  multiDecisionAssessment: {
    status: "single_decision_until_separate_concepts_are_approved",
    rationale:
      "Diagnosis and staging could eventually precede this management concept, but no separate pancreatic-cancer diagnosis or staging concept has yet been clinically approved for the same encounter.",
  },
} as const;

export const ROW_051_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.pancreatic-cancer-multidisciplinary-consensus.2020",
    title:
      "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
    completeCitation:
      "Martin-Perez E, Dominguez-Munoz JE, Botella-Romero F, Cerezo L, Matute Teresa F, Serrano T, Vera R. Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer. Clin Transl Oncol. 2020;22(11):1963-1975. doi:10.1007/s12094-020-02350-6.",
    organizationOrJournal:
      "Clinical and Translational Oncology / Spanish multidisciplinary professional societies",
    authors: [
      "E Martin-Perez",
      "J E Dominguez-Munoz",
      "F Botella-Romero",
      "L Cerezo",
      "F Matute Teresa",
      "T Serrano",
      "R Vera",
    ],
    publicationYear: 2020,
    doi: "10.1007/s12094-020-02350-6",
    pmid: "32318964",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7505812/",
    accessedOn: "2026-08-10",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Multidisciplinary consensus from seven Spanish professional societies, with a strong recommendation and high evidence rating for distal pancreatectomy with splenectomy for pancreatic body or tail cancer.",
    usageRole: "evidence",
    evidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
      LOCATION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nci-pdq.pancreatic-cancer-treatment.2025",
    title: "Pancreatic Cancer Treatment (PDQ): Health Professional Version",
    completeCitation:
      "PDQ Adult Treatment Editorial Board. PDQ Pancreatic Cancer Treatment. Bethesda, MD: National Cancer Institute. Updated February 12, 2025. Available at https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq. PMID:26389394.",
    organizationOrJournal: "National Cancer Institute",
    authors: ["PDQ Adult Treatment Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: "26389394",
    officialUrl:
      "https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq",
    accessedOn: "2026-08-10",
    sourceClass: "government_guidance",
    licenseLabel: "United States government work; PDQ reuse conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use short independently written factual synthesis and link to the current NCI page. Do not reproduce third-party images or identify excerpts as a complete NCI PDQ summary.",
    authorityAssessment:
      "Continuously reviewed NCI evidence summary independently cross-checking distal pancreatectomy for body and tail tumors and the need to distinguish resectable disease from unresectable or metastatic disease.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
      LOCATION_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_051_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: DISTAL_RESECTION_CLAIM_ID,
    statement:
      "When operative resection is selected for resectable pancreatic ductal adenocarcinoma in the body or tail, the anatomic pancreatic resection is a distal pancreatectomy rather than a pancreaticoduodenectomy.",
    sourceIds: [
      "source.pancreatic-cancer-multidisciplinary-consensus.2020",
      "source.nci-pdq.pancreatic-cancer-treatment.2025",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This location-based operation does not determine treatment sequencing or establish resectability by itself.",
    applicablePopulation:
      "Adults with resectable pancreatic ductal adenocarcinoma in the pancreatic body or tail who are selected to proceed with operative resection.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
    statement:
      "Standard oncologic distal resection for pancreatic body or tail adenocarcinoma includes splenectomy as part of distal pancreatectomy and regional oncologic clearance.",
    sourceIds: [
      "source.pancreatic-cancer-multidisciplinary-consensus.2020",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This approved teaching point is specific to confirmed pancreatic adenocarcinoma and does not define the operation for benign distal lesions, pancreatic neuroendocrine tumors, trauma, or other non-adenocarcinoma indications.",
    applicablePopulation:
      "Adults with resectable pancreatic ductal adenocarcinoma in the body or tail who are selected for oncologic resection.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
    statement:
      "Absence of distant metastases is necessary but not sufficient to select pancreatic-cancer surgery; anatomic resectability, operative fitness, disease biology, and multidisciplinary treatment planning also matter.",
    sourceIds: [
      "source.pancreatic-cancer-multidisciplinary-consensus.2020",
      "source.nci-pdq.pancreatic-cancer-treatment.2025",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "The approved variants state that the tumor has already been judged resectable and ask which operation or referral follows if surgery proceeds; they do not choose neoadjuvant versus upfront treatment.",
    applicablePopulation:
      "Adults undergoing multidisciplinary evaluation for potentially resectable pancreatic ductal adenocarcinoma.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: LOCATION_BOUNDARY_CLAIM_ID,
    statement:
      "Pancreaticoduodenectomy is used for pancreatic head or uncinate cancer, while distal pancreatectomy is used for pancreatic body or tail cancer; total pancreatectomy is not required solely because a resectable cancer is in the tail.",
    sourceIds: [
      "source.pancreatic-cancer-multidisciplinary-consensus.2020",
      "source.nci-pdq.pancreatic-cancer-treatment.2025",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Multifocal or locally extensive disease can create separate indications for total pancreatectomy, but those scenarios are outside this concept.",
    applicablePopulation:
      "Adults with localized pancreatic ductal adenocarcinoma being considered for resection.",
    lastCheckedOn: "2026-08-10",
  },
] satisfies EvidenceClaim[];

export const ROW_051_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName:
      "Distal pancreatectomy with splenectomy for resectable tail adenocarcinoma",
    learningObjective:
      "Select oncologic distal pancreatectomy with splenectomy when a fit patient with pancreatic-tail adenocarcinoma has been judged resectable and is proceeding to surgery.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

export const ROW_051_CONTENT_CLASSIFICATION = {
  conceptId: CONCEPT_ID,
  educationalDifficulty: "advanced",
  expectedLearnerStage: "senior_surgical_learner",
  earliestFacilityStage: 0,
  releasePointIds: [
    "release.l0.clinic_evaluation",
    "release.future.hospital_or",
  ],
  requiredClinicalSettings: ["clinic", "hospital_or"],
  currentGameEligibility: "partially_active",
  deferredFutureScope: ["hospital_or"],
} as const;

type ApprovedPancreaticTailQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId:
    | "release.l0.clinic_evaluation"
    | "release.future.hospital_or";
  earliestFacilityStage: 0 | null;
  requiredClinicalSetting: "clinic" | "hospital_or";
  requiredCapabilityIds: readonly [];
  encounterRole:
    | "single-decision-clinic-counseling"
    | "single-decision-hospital-or-planning";
  shuffleAnswers: true;
};

export const ROW_051_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.clinicCounseling,
    presentationVariantId: PRESENTATION_IDS.clinicCounseling,
    patientPresentation:
      "A medically fit older adult has biopsy-confirmed pancreatic adenocarcinoma in the tail. Staging shows no distant metastases, and multidisciplinary review has judged the tumor resectable. The patient asks what operation would be discussed if they proceed with surgery.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-counseling",
    stem: "Which operation should you discuss with this patient?",
    answerChoices: [
      {
        id: "distal_pancreatectomy_splenectomy",
        label: "Distal pancreatectomy with splenectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "spleen_preserving_distal_pancreatectomy",
        label: "Spleen-preserving distal pancreatectomy",
        isCorrect: false,
        distractorRationale:
          "Spleen preservation is not the standard oncologic distal resection for confirmed pancreatic adenocarcinoma.",
      },
      {
        id: "whipple_procedure",
        label: "Pancreaticoduodenectomy, or Whipple procedure",
        isCorrect: false,
        distractorRationale:
          "A Whipple addresses disease in the pancreatic head or uncinate rather than an isolated tail cancer.",
      },
      {
        id: "total_pancreatectomy_tail_location",
        label: "Total pancreatectomy for the tail location alone",
        isCorrect: false,
        distractorRationale:
          "Tail location alone does not require removal of the entire pancreas.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For a fit patient with resectable pancreatic-tail adenocarcinoma who is proceeding to surgery, the oncologic operation is distal pancreatectomy with splenectomy. The scenario has already established resectability; absence of metastases alone would not do so.",
    supportingEvidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.procedureByLocation,
    presentationVariantId: PRESENTATION_IDS.procedureByLocation,
    patientPresentation:
      "A hospital pancreatic-surgery conference reviews a medically fit patient with biopsy-confirmed, resectable pancreatic adenocarcinoma and no distant metastases. The operative team is matching tumor location to resection.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem: "Which location-operation pair is correct?",
    answerChoices: [
      {
        id: "tail_distal_with_splenectomy",
        label: "Pancreatic tail: distal pancreatectomy with splenectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "tail_whipple_spleen_preservation",
        label: "Pancreatic tail: pancreaticoduodenectomy with splenic preservation",
        isCorrect: false,
        distractorRationale:
          "Pancreaticoduodenectomy is not the anatomic resection for an isolated tail cancer.",
      },
      {
        id: "head_distal_with_splenectomy",
        label: "Pancreatic head: distal pancreatectomy with splenectomy",
        isCorrect: false,
        distractorRationale:
          "Distal pancreatectomy does not remove the pancreatic head and uncinate process.",
      },
      {
        id: "tail_total_by_location",
        label: "Pancreatic tail: total pancreatectomy based solely on location",
        isCorrect: false,
        distractorRationale:
          "An isolated resectable tail location does not by itself justify total pancreatectomy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A resectable pancreatic-tail adenocarcinoma is matched to oncologic distal pancreatectomy with splenectomy. Head or uncinate cancers use pancreaticoduodenectomy, and tail location alone is not an indication for total pancreatectomy.",
    supportingEvidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      LOCATION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.spleenCounseling,
    presentationVariantId: PRESENTATION_IDS.spleenCounseling,
    patientPresentation:
      "A fit patient with biopsy-confirmed, resectable pancreatic-tail adenocarcinoma and no distant metastases asks whether the planned distal resection ordinarily preserves the spleen.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-counseling",
    stem: "Which explanation should you give this patient?",
    answerChoices: [
      {
        id: "oncologic_distal_includes_splenectomy",
        label: "The oncologic distal resection ordinarily includes splenectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "spleen_preservation_standard_adenocarcinoma",
        label: "Spleen preservation is standard for confirmed tail adenocarcinoma",
        isCorrect: false,
        distractorRationale:
          "That generalization conflicts with the standard oncologic distal resection for pancreatic adenocarcinoma.",
      },
      {
        id: "whipple_removes_tail_preserves_spleen",
        label: "A Whipple removes the pancreatic tail while preserving the spleen",
        isCorrect: false,
        distractorRationale:
          "A Whipple is a pancreatic-head operation and does not describe resection of an isolated tail tumor.",
      },
      {
        id: "total_required_with_spleen",
        label: "Total pancreatectomy is required whenever the spleen is removed",
        isCorrect: false,
        distractorRationale:
          "Splenectomy with a distal pancreatic resection does not require removal of the entire pancreas.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For confirmed pancreatic-tail adenocarcinoma selected for resection, the standard oncologic distal operation ordinarily includes splenectomy. This does not generalize the same rule to benign distal lesions or other diagnoses.",
    supportingEvidenceClaimIds: [
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      DISTAL_RESECTION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.operativeCandidate,
    presentationVariantId: PRESENTATION_IDS.operativeCandidate,
    patientPresentation:
      "A patient with biopsy-confirmed pancreatic adenocarcinoma comes to discuss possible major oncologic surgery. The referral note is incomplete, and the patient asks which possible completed staging summary would fit distal pancreatectomy with splenectomy counseling.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-counseling",
    stem:
      "Which possible completed summary would fit that counseling for this patient?",
    answerChoices: [
      {
        id: "fit_resectable_tail_no_distant_disease",
        label: "Resectable tail adenocarcinoma, fit for surgery, no distant disease",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "fit_resectable_head_adenocarcinoma",
        label: "Resectable adenocarcinoma confined to the pancreatic head",
        isCorrect: false,
        distractorRationale:
          "A pancreatic-head cancer is not treated with a distal pancreatectomy.",
      },
      {
        id: "tail_with_distant_liver_metastases",
        label: "Tail adenocarcinoma with established distant liver metastases",
        isCorrect: false,
        distractorRationale:
          "Established distant metastatic disease falls outside this curative-resection counseling scenario.",
      },
      {
        id: "benign_distal_lesion_spleen_preservation",
        label: "A selected benign distal lesion being considered for spleen preservation",
        isCorrect: false,
        distractorRationale:
          "A benign distal lesion is outside this pancreatic-adenocarcinoma FSRS concept.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "This operation concept applies when pancreatic-tail adenocarcinoma is resectable, the patient is fit for major surgery, and distant disease is absent. Location, resectability, and operative fitness all matter.",
    supportingEvidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
      LOCATION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.referralPlan,
    presentationVariantId: PRESENTATION_IDS.referralPlan,
    patientPresentation:
      "A medically fit patient has biopsy-confirmed pancreatic adenocarcinoma in the tail, no distant metastases, and a multidisciplinary determination that the tumor is resectable. The patient is ready for surgical-oncology referral and asks what operation the referral should anticipate.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-counseling",
    stem: "Which referral plan should you recommend for this patient?",
    answerChoices: [
      {
        id: "refer_oncologic_distal_with_splenectomy",
        label: "Refer for oncologic distal pancreatectomy with splenectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "refer_whipple_all_pancreatic_cancers",
        label: "Refer for a Whipple because all pancreatic cancers use the same operation",
        isCorrect: false,
        distractorRationale:
          "The operative resection depends in part on pancreatic location; a Whipple is not the tail operation.",
      },
      {
        id: "observe_because_no_metastases",
        label: "Observe without surgical-oncology referral because metastases are absent",
        isCorrect: false,
        distractorRationale:
          "A fit patient with resectable localized disease requires multidisciplinary treatment planning rather than observation solely because metastases are absent.",
      },
      {
        id: "recommend_spleen_preserving_standard",
        label: "Recommend spleen-preserving resection as the standard adenocarcinoma operation",
        isCorrect: false,
        distractorRationale:
          "Spleen-preserving distal pancreatectomy is not the standard oncologic operation for confirmed pancreatic adenocarcinoma.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The clinic should refer this already selected patient for oncologic distal pancreatectomy with splenectomy. This question identifies the operation if surgery proceeds; it does not choose systemic-therapy sequencing.",
    supportingEvidenceClaimIds: [
      DISTAL_RESECTION_CLAIM_ID,
      ONCOLOGIC_SPLENECTOMY_CLAIM_ID,
      SURGICAL_SELECTION_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedPancreaticTailQuestionVariant[];

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];

function getQuestionVariant(id: string): ApprovedPancreaticTailQuestionVariant {
  const variant = ROW_051_QUESTION_VARIANTS.find(
    (candidate) => candidate.id === id,
  );
  if (!variant) {
    throw new Error(`Missing approved pancreatic-tail question variant: ${id}`);
  }
  return variant;
}

function finalNodeFromVariant(
  variant: ApprovedPancreaticTailQuestionVariant,
): DecisionNode {
  const answerChoices = variant.answerChoices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    serviceRequest: null,
  }));
  const correctLabel =
    answerChoices.find((choice) => choice.isCorrect)?.label ??
    "the reviewed operation";
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
  variantId: string;
  displayName: string;
  chiefComplaint: string;
  learningSummary: string;
}): SyntheticClinicalCase {
  const variant = getQuestionVariant(input.variantId);
  if (variant.releasePointId !== "release.l0.clinic_evaluation") {
    throw new Error(
      `Deferred question variant cannot enter the active Level 0 release: ${variant.id}`,
    );
  }
  return {
    id: input.id,
    displayName: input.displayName,
    patientPresentationVariantId: variant.presentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: input.chiefComplaint,
    presentation: variant.patientPresentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [finalNodeFromVariant(variant)],
    learningSummary: input.learningSummary,
  };
}

const LEARNING_SUMMARY =
  "A fit patient with resectable pancreatic-tail adenocarcinoma who is proceeding to surgery is referred for oncologic distal pancreatectomy with splenectomy. The teaching point does not substitute absence of metastases for a complete resectability assessment or determine systemic-treatment sequencing.";

export const ROW_051_CASES = [
  clinicCase({
    id: "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
    variantId: QUESTION_IDS.clinicCounseling,
    displayName: "Clinic Patient: Pancreatic-Tail Operation Counseling",
    chiefComplaint: "Discussing surgery for pancreatic-tail cancer",
    learningSummary: LEARNING_SUMMARY,
  }),
  clinicCase({
    id: "case.pancreatic-tail-adenocarcinoma.spleen-counseling",
    variantId: QUESTION_IDS.spleenCounseling,
    displayName: "Clinic Patient: Spleen Counseling Before Referral",
    chiefComplaint: "Asking whether surgery includes splenectomy",
    learningSummary: LEARNING_SUMMARY,
  }),
  clinicCase({
    id: "case.pancreatic-tail-adenocarcinoma.operative-candidate",
    variantId: QUESTION_IDS.operativeCandidate,
    displayName: "Clinic Patient: Select the Distal Resection Candidate",
    chiefComplaint: "Clarifying a pancreatic-cancer referral",
    learningSummary: LEARNING_SUMMARY,
  }),
  clinicCase({
    id: "case.pancreatic-tail-adenocarcinoma.referral-plan",
    variantId: QUESTION_IDS.referralPlan,
    displayName: "Clinic Patient: Pancreatic Surgical-Oncology Referral",
    chiefComplaint: "Planning referral for resectable tail cancer",
    learningSummary: LEARNING_SUMMARY,
  }),
] satisfies SyntheticClinicalCase[];

export const ROW_051_FUTURE_QUESTION_VARIANTS =
  ROW_051_QUESTION_VARIANTS.filter(
    (variant) => variant.releasePointId === "release.future.hospital_or",
  );

export const ROW_051_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_051_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_051_APPROVED_BACKLOG = {
  conceptIds: ROW_051_CONCEPTS.map((concept) => concept.id),
  activeCaseIds: ROW_051_CASES.map((clinicalCase) => clinicalCase.id),
  deferredQuestionVariantIds: ROW_051_FUTURE_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  questionVariantIds: ROW_051_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_051_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
  releasePointIds: [
    "release.l0.clinic_evaluation",
    "release.future.hospital_or",
  ],
  status: "partially_active_and_partially_deferred",
  fsrsIdentityPolicy:
    "All five approved variants score the same stable concept identity; the future Hospital OR iteration does not create a second card.",
  multiDecisionAssessment:
    "Keep these variants single-decision until separate diagnosis or staging concepts are clinically approved for a multi-decision pancreatic-cancer encounter.",
} as const;
