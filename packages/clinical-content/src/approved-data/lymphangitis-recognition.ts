import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";

export const ROW_104_CONTENT_VERSION = "clinical.owner-row-104.2026-08-21.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_104_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-21",
    contentVersion: ROW_104_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_104_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const PHENOTYPE_CLAIM_ID =
  "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes";
const CONCEPT_ID = "concept.lymphangitis.acute-clinical-recognition";

const SOURCE_LABELS = [
  "MSD Manual Professional: Lymphangitis, reviewed May 2026",
  "Clinically approved by Melissa Rowland, MD on 2026-08-21",
] as const;

export const ROW_104_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-104.2026-08-21",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-21",
  contentVersion: ROW_104_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (4).xlsx",
    sheetName: "Sheet1",
    sourceRow: 104,
    sourceRecordKey: "owner-concept.sheet1.row-104",
    exactApprovalConversationDate: "2026-08-21",
  },
  approvedConceptId: CONCEPT_ID,
  approvedConceptType: "diagnosis",
  approvedPresentationVariantIds: [
    "presentation.lymphangitis.toe-inguinal",
    "presentation.lymphangitis.palm-axillary",
    "presentation.lymphangitis.heel-inguinal",
    "presentation.lymphangitis.reverse-axillary",
    "presentation.lymphangitis.finger-axillary",
  ],
  approvedQuestionVariantIds: [
    "question.lymphangitis.toe-inguinal.v1",
    "question.lymphangitis.palm-axillary.v1",
    "question.lymphangitis.heel-inguinal.v1",
    "question.lymphangitis.reverse-axillary.v1",
    "question.lymphangitis.finger-axillary.v1",
  ],
  approvedEvidenceClaimIds: [PHENOTYPE_CLAIM_ID],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedScopeDecisionId:
    "decision.owner-row-104.acute-lymphangitis-recognition.2026-08-21",
  multiDecisionAssessment: {
    status: "single_decision_preferred",
    rationale:
      "The approval is limited to one recognition identity. Adding testing, organism, treatment, or disposition decisions would introduce unapproved concepts.",
  },
  approvedElements: [
    "one_diagnosis_fsrs_identity",
    "five_one_decision_recognition_variants",
    "three_choices_per_variant",
    "shuffled_answer_display",
    "level_0_clinic_evaluation_release_point",
    "no_result_gate",
    "bounded_wrong_final_dispositions",
  ],
  excludedElements: [
    "treatment",
    "organism_identification",
    "testing",
    "probabilities",
    "exact_timeline_teaching",
    "multi_decision_encounter",
  ],
} as const;

export const ROW_104_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.msd-manual-professional.lymphangitis.2026",
    title: "Lymphangitis",
    completeCitation:
      "Passarelli PJ. Lymphangitis. MSD Manual Professional Edition. Reviewed May 2026 by Brenda L. Tesini, MD. Accessed 2026-08-21. https://www.msdmanuals.com/professional/infectious-diseases/bacterial-skin-infections/lymphangitis",
    organizationOrJournal: "MSD Manual Professional Edition",
    authors: ["Patrick James Passarelli, MD", "Brenda L. Tesini, MD"],
    publicationYear: 2026,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.msdmanuals.com/professional/infectious-diseases/bacterial-skin-infections/lymphangitis",
    accessedOn: "2026-08-21",
    sourceClass: "open_educational_resource",
    licenseLabel: "MSD Manual copyrighted; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce source prose, illustrations, or page structure.",
    authorityAssessment:
      "Clinician-authored and peer-reviewed professional reference retained as the sole adequate targeted-verification source for the approved recognition phenotype.",
    usageRole: "evidence",
    evidenceClaimIds: [PHENOTYPE_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_104_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: PHENOTYPE_CLAIM_ID,
    statement:
      "Acute lymphangitis can be recognized clinically when a distal skin entry site is accompanied by a tender erythematous streak extending proximally toward tender regional lymph nodes.",
    sourceIds: ["source.msd-manual-professional.lymphangitis.2026"],
    evidenceCategory: "presentation",
    certainty: "moderate",
    limitation:
      "This narrow claim supports pattern recognition only; it does not establish an organism, severity, testing plan, treatment, prognosis, or disposition. MSD Manual Professional is the sole adequate targeted-verification source retained for this claim; an independent source has not yet been recorded.",
    applicablePopulation:
      "Patients represented in the approved outpatient clinic vignettes with a distal skin entry site, proximal tender streak, and regional nodal tenderness.",
    lastCheckedOn: "2026-08-21",
  },
] satisfies EvidenceClaim[];

export const ROW_104_CONCEPT = {
  id: CONCEPT_ID,
  displayName: "Acute lymphangitis clinical recognition",
  learningObjective:
    "Recognize acute lymphangitis from a distal skin entry site, a tender erythematous streak extending proximally, and tender regional lymph nodes.",
  earliestFacilityStage: 0,
  conceptType: "diagnosis",
} satisfies TestedConcept;

type CaseSpec = {
  id: string;
  presentationVariantId: string;
  questionVariantId: string;
  displayName: string;
  chiefComplaint: string;
  presentation: string;
  stem: string;
  correctChoice: { id: string; label: string };
  wrongChoices: readonly { id: string; label: string }[];
};

const CASE_SPECS = [
  {
    id: "case.lymphangitis.toe-inguinal",
    presentationVariantId: "presentation.lymphangitis.toe-inguinal",
    questionVariantId: "question.lymphangitis.toe-inguinal.v1",
    displayName: "Clinic Patient: Toe Streak",
    chiefComplaint: "Tender red streak after a toe blister",
    presentation:
      "An adult patient reports a small blister on a toe. A tender red streak now extends up the foot toward tender groin nodes.",
    stem: "Which diagnosis best matches this pattern?",
    correctChoice: { id: "acute_lymphangitis", label: "Acute lymphangitis" },
    wrongChoices: [
      { id: "localized_blister", label: "A localized blister only" },
      { id: "isolated_groin_node", label: "An isolated groin-node problem" },
    ],
  },
  {
    id: "case.lymphangitis.palm-axillary",
    presentationVariantId: "presentation.lymphangitis.palm-axillary",
    questionVariantId: "question.lymphangitis.palm-axillary.v1",
    displayName: "Clinic Patient: Palm Cut",
    chiefComplaint: "Tender line after a palm cut",
    presentation:
      "An adult patient reports a small palm cut. A tender red line travels up the forearm, and the axillary nodes are tender.",
    stem: "Which diagnosis best matches this pattern?",
    correctChoice: { id: "acute_lymphangitis", label: "Acute lymphangitis" },
    wrongChoices: [
      { id: "localized_palm_cut", label: "A localized palm cut only" },
      { id: "isolated_axillary_node", label: "An isolated axillary-node problem" },
    ],
  },
  {
    id: "case.lymphangitis.heel-inguinal",
    presentationVariantId: "presentation.lymphangitis.heel-inguinal",
    questionVariantId: "question.lymphangitis.heel-inguinal.v1",
    displayName: "Clinic Patient: Cracked Heel",
    chiefComplaint: "Linear redness after a cracked heel",
    presentation:
      "An adult patient reports a cracked heel. Linear erythema extends proximally from the heel, and the groin nodes are tender.",
    stem: "Which diagnosis best matches this pattern?",
    correctChoice: { id: "acute_lymphangitis", label: "Acute lymphangitis" },
    wrongChoices: [
      { id: "heel_crack_alone", label: "A heel crack alone" },
      { id: "isolated_groin_node", label: "An isolated groin-node problem" },
    ],
  },
  {
    id: "case.lymphangitis.reverse-axillary",
    presentationVariantId: "presentation.lymphangitis.reverse-axillary",
    questionVariantId: "question.lymphangitis.reverse-axillary.v1",
    displayName: "Clinic Patient: Hand Finding",
    chiefComplaint: "Reviewing a tender hand finding",
    presentation:
      "An adult patient reports a small hand injury and tenderness near the axilla. The clinician is reviewing which finding best explains the pattern.",
    stem:
      "Which finding most supports spread through lymphatics in this patient?",
    correctChoice: {
      id: "proximal_red_streak_to_axillary_nodes",
      label: "A red streak extending toward tender axillary nodes",
    },
    wrongChoices: [
      {
        id: "small_hand_injury_alone",
        label: "A red area confined to the hand without a streak toward the axilla",
      },
      { id: "tender_axilla_alone", label: "Tenderness near the axilla alone" },
    ],
  },
  {
    id: "case.lymphangitis.finger-axillary",
    presentationVariantId: "presentation.lymphangitis.finger-axillary",
    questionVariantId: "question.lymphangitis.finger-axillary.v1",
    displayName: "Clinic Patient: Finger Puncture",
    chiefComplaint: "Tender red streak after a finger puncture",
    presentation:
      "An adult patient reports a small finger puncture. A tender red streak extends up the arm, and the axillary nodes are tender.",
    stem: "Which diagnosis best matches this pattern?",
    correctChoice: { id: "acute_lymphangitis", label: "Acute lymphangitis" },
    wrongChoices: [
      { id: "finger_puncture_alone", label: "A finger puncture alone" },
      { id: "isolated_axillary_node", label: "An isolated axillary-node problem" },
    ],
  },
] as const satisfies readonly CaseSpec[];

const EXPLANATION =
  "The approved recognition pattern combines a distal skin entry site, a tender erythematous streak extending proximally, and tender regional lymph nodes.";

function finalNode(spec: CaseSpec) {
  const answerChoices = [
    { ...spec.correctChoice, isCorrect: true, serviceRequest: null },
    ...spec.wrongChoices.map((choice) => ({
      ...choice,
      isCorrect: false,
      serviceRequest: null,
    })),
  ];
  return {
    id: `node.${spec.questionVariantId.replace(/^question\./, "")}`,
    questionVariantId: spec.questionVariantId,
    primaryConceptId: CONCEPT_ID,
    stem: spec.stem,
    answerChoices,
    shuffleAnswers: true,
    explanation: EXPLANATION,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: answerChoices
      .filter((choice) => !choice.isCorrect)
      .map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative: `The encounter recorded ${choice.label} instead of the approved recognition pattern.`,
        clinicalRationale: EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
      })),
  };
}

export const ROW_104_QUESTION_VARIANTS = CASE_SPECS.map((spec) => ({
  ...CLINICIAN_APPROVAL,
  id: spec.questionVariantId,
  conceptId: CONCEPT_ID,
  stem: spec.stem,
  answerChoices: [
    { ...spec.correctChoice, isCorrect: true, distractorRationale: null },
    ...spec.wrongChoices.map((choice) => ({
      ...choice,
      isCorrect: false,
      distractorRationale:
        "This choice does not identify the complete approved recognition pattern.",
    })),
  ],
  explanation: EXPLANATION,
  supportingEvidenceClaimIds: [PHENOTYPE_CLAIM_ID],
})) satisfies QuestionVariant[];

export const ROW_104_CASES = CASE_SPECS.map((spec) => ({
  id: spec.id,
  displayName: spec.displayName,
  patientPresentationVariantId: spec.presentationVariantId,
  releasePointId: "release.l0.clinic_evaluation",
  patientDisplayName: "Clinic Patient",
  chiefComplaint: spec.chiefComplaint,
  presentation: spec.presentation,
  tutorialEligible: false,
  routineEligible: true,
  earliestFacilityStage: 0,
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [],
  rewardTierId: "reward.clinic_basic",
  sourceLabels: [...SOURCE_LABELS],
  decisionNodes: [finalNode(spec)],
  learningSummary: EXPLANATION,
})) satisfies SyntheticClinicalCase[];

export const ROW_104_APPROVED_ENCOUNTER_BLUEPRINTS = CASE_SPECS.map((spec) => ({
  id: `blueprint.${spec.questionVariantId.replace(/^question\./, "")}`,
  presentationVariantId: spec.presentationVariantId,
  questionVariantIds: [spec.questionVariantId],
  releasePointId: "release.l0.clinic_evaluation",
  earliestFacilityStage: 0,
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [],
}));

export const ROW_104_APPROVED_BACKLOG = {
  conceptIds: [CONCEPT_ID],
  activeCaseIds: ROW_104_CASES.map((clinicalCase) => clinicalCase.id),
  questionVariantIds: ROW_104_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_104_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
  releasePointIds: ["release.l0.clinic_evaluation"],
  status: "approved_and_active",
  multiDecisionAssessment:
    "All five approved encounters are one-decision recognition encounters; no unrelated follow-up decision was added.",
} as const;
