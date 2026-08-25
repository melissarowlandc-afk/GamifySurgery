import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_036_CONTENT_VERSION =
  "clinical.owner-row-036.2026-08-06.2";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_036_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_036_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_036_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const CLASSIC_PHENOTYPE_CLAIM_ID =
  "claim.mondor-disease.classic-clinical-phenotype";
const SELECTIVE_IMAGING_CLAIM_ID =
  "claim.mondor-disease.selective-imaging-evaluation";
const ULTRASOUND_PHENOTYPE_CLAIM_ID =
  "claim.mondor-disease.ultrasound-phenotype";
const SUPPORTIVE_MANAGEMENT_CLAIM_ID =
  "claim.mondor-disease.supportive-management-and-boundaries";

const SOURCE_LABELS = [
  "Rountree, Barazi, and Aulick, Mondor Disease, StatPearls, updated 2023",
  "Amano and Shimizu, Mondor's Disease: A Review of the Literature, 2018",
  "ACR Appropriateness Criteria: Breast Pain, 2018",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

export const ROW_036_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-036.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_036_CONTENT_VERSION,
  supersedesContentVersion: "clinical.owner-row-036.2026-08-06.1",
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 36,
    sourceRecordKey: "owner-concept.sheet1.row-036",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [
    "concept.mondor-disease.clinical-recognition",
    "concept.mondor-disease.selective-imaging-evaluation",
    "concept.mondor-disease.supportive-management",
  ],
  approvedConceptTypes: ["diagnosis", "workup", "management"],
  approvedPresentationVariantIds: [
    "presentation.mondor-disease.full-pathway",
    "presentation.mondor-disease.evaluation-and-management",
    "presentation.mondor-disease.select-matching-patient",
    "presentation.mondor-disease.underlying-process",
    "presentation.mondor-disease.uncertain-targeted-ultrasound",
    "presentation.mondor-disease.ultrasound-finding",
    "presentation.mondor-disease.safety-boundary",
    "presentation.mondor-disease.select-supportive-patient",
  ],
  approvedQuestionVariantIds: [
    "question.mondor-disease.recognition.patient-to-diagnosis.v1",
    "question.mondor-disease.recognition.select-patient.v1",
    "question.mondor-disease.recognition.underlying-process.v1",
    "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    "question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
    "question.mondor-disease.evaluation.ultrasound-finding.v1",
    "question.mondor-disease.management.supportive-care.v1",
    "question.mondor-disease.management.safety-boundary.v1",
    "question.mondor-disease.management.select-supportive-patient.v1",
  ],
  approvedEvidenceClaimIds: [
    CLASSIC_PHENOTYPE_CLAIM_ID,
    SELECTIVE_IMAGING_CLAIM_ID,
    ULTRASOUND_PHENOTYPE_CLAIM_ID,
    SUPPORTIVE_MANAGEMENT_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "three_concept_split",
    "one_fsrs_identity_per_scored_decision",
    "level_zero_release_point",
    "selective_imaging_boundary",
    "nine_exact_single_select_question_variants",
    "complete_answer_sets",
    "keyed_answers",
    "shuffled_answer_order",
    "three_decision_pathway",
    "two_decision_pathway",
    "offsite_imaging_result_gate",
    "corrective_forward_intermediate_choices",
    "supportive_management_scope",
    "safety_boundaries",
    "answer_length_cue_mitigation",
  ],
} as const;

export const ROW_036_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.statpearls.mondor-disease.2023",
    title: "Mondor Disease",
    completeCitation:
      "Rountree KM, Barazi H, Aulick NFA. Mondor Disease. Updated May 22, 2023. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. PMID: 30855866.",
    organizationOrJournal: "StatPearls Publishing",
    authors: [
      "Kaitlyn M. Rountree",
      "Hassana Barazi",
      "Neal F. Aulick",
    ],
    publicationYear: 2023,
    doi: null,
    pmid: "30855866",
    officialUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538282/",
    accessedOn: "2026-08-06",
    sourceClass: "open_educational_resource",
    licenseLabel:
      "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and independently written synthesis only; do not reproduce source prose, tables, or illustrations.",
    authorityAssessment:
      "Clinically useful secondary overview of the characteristic presentation, sonographic findings, selective evaluation, management, and differential diagnosis.",
    usageRole: "evidence",
    evidenceClaimIds: [
      CLASSIC_PHENOTYPE_CLAIM_ID,
      SELECTIVE_IMAGING_CLAIM_ID,
      ULTRASOUND_PHENOTYPE_CLAIM_ID,
      SUPPORTIVE_MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.amano-shimizu.mondor-review.2018",
    title: "Mondor's Disease: A Review of the Literature",
    completeCitation:
      "Amano M, Shimizu T. Mondor's Disease: A Review of the Literature. Intern Med. 2018;57(18):2607-2612. doi:10.2169/internalmedicine.0495-17. PMID: 29780120.",
    organizationOrJournal: "Internal Medicine",
    authors: ["Miki Amano", "Taro Shimizu"],
    publicationYear: 2018,
    doi: "10.2169/internalmedicine.0495-17",
    pmid: "29780120",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6191595/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Open-access article; publisher and article-specific reuse terms apply",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual cross-checking and independently written synthesis; do not reproduce protected prose, figures, or tables.",
    authorityAssessment:
      "Peer-reviewed narrative review independently supporting the clinical cord phenotype, ultrasound evaluation, conservative management, and need to assess secondary causes selectively.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      CLASSIC_PHENOTYPE_CLAIM_ID,
      SELECTIVE_IMAGING_CLAIM_ID,
      ULTRASOUND_PHENOTYPE_CLAIM_ID,
      SUPPORTIVE_MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.breast-pain.2018",
    title: "ACR Appropriateness Criteria: Breast Pain",
    completeCitation:
      "Holbrook AI, Moy L, Akin EA, et al. ACR Appropriateness Criteria Breast Pain. J Am Coll Radiol. 2018;15(11S):S276-S282. doi:10.1016/j.jacr.2018.09.014. PMID: 30392596.",
    organizationOrJournal:
      "Journal of the American College of Radiology",
    authors: [
      "Andrea I. Holbrook",
      "Linda Moy",
      "Eren A. Akin",
      "American College of Radiology Appropriateness Criteria Expert Panel",
    ],
    publicationYear: 2018,
    doi: "10.1016/j.jacr.2018.09.014",
    pmid: "30392596",
    officialUrl: "https://acsearch.acr.org/docs/3091546/Narrative/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society guidance",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce appropriateness tables or protected explanatory wording.",
    authorityAssessment:
      "Authoritative radiology-society guidance supporting age-appropriate diagnostic mammography or tomosynthesis and ultrasound for clinically significant focal, noncyclic breast pain.",
    usageRole: "evidence",
    evidenceClaimIds: [SELECTIVE_IMAGING_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_036_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: CLASSIC_PHENOTYPE_CLAIM_ID,
    statement:
      "A newly developed, tender, cord-like superficial structure along the anterolateral breast or chest wall with little surrounding inflammation is characteristic of Mondor disease, a superficial thrombophlebitis.",
    sourceIds: [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
    ],
    evidenceCategory: "presentation",
    certainty: "moderate",
    limitation:
      "Atypical, progressive, recurrent, systemic, or mass-associated findings require evaluation for alternative or secondary causes rather than pattern recognition alone.",
    applicablePopulation:
      "Stable adults presenting with a new superficial breast or anterior chest-wall cord and no systemic illness.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SELECTIVE_IMAGING_CLAIM_ID,
    statement:
      "When the diagnosis is uncertain, targeted high-frequency ultrasound with color Doppler can evaluate a suspected thrombosed superficial vein; age-appropriate diagnostic breast imaging is also appropriate when focal symptoms warrant evaluation for underlying breast pathology.",
    sourceIds: [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
      "source.acr.breast-pain.2018",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "This is a selective imaging pathway, not a claim that every classic uncomplicated presentation requires the same mammography-plus-ultrasound package.",
    applicablePopulation:
      "Stable adults with a suspected superficial breast or chest-wall venous cord when the diagnosis is uncertain or a clinician must evaluate clinically significant focal breast symptoms or possible underlying pathology.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ULTRASOUND_PHENOTYPE_CLAIM_ID,
    statement:
      "A noncompressible subcutaneous tubular structure with absent internal color-Doppler flow supports thrombosis of a superficial vein in the appropriate clinical setting.",
    sourceIds: [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The finding must be interpreted with the examination and does not substitute for evaluation of a suspicious solid mass, abscess, or progressive inflammatory breast changes.",
    applicablePopulation:
      "Stable adults undergoing targeted ultrasound for a suspected superficial breast or chest-wall venous thrombosis.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SUPPORTIVE_MANAGEMENT_CLAIM_ID,
    statement:
      "Uncomplicated Mondor disease is generally self-limited and may be managed with supportive measures such as warm compresses, an NSAID when appropriate, avoidance of local irritation, and follow-up; antibiotics, venous excision, and routine therapeutic anticoagulation are not standard without another indication.",
    sourceIds: [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Progressive diffuse breast change, adenopathy, a suspicious mass, infection, recurrent or migratory thrombophlebitis, or a known hypercoagulable condition falls outside this uncomplicated supportive-care pathway.",
    applicablePopulation:
      "Stable adults with a concordant uncomplicated superficial breast or chest-wall thrombophlebitis after appropriate clinical evaluation.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_036_CONCEPTS = [
  {
    id: "concept.mondor-disease.clinical-recognition",
    displayName: "Clinical recognition of Mondor disease",
    learningObjective:
      "Recognize the characteristic superficial breast or chest-wall venous cord and its underlying superficial thrombophlebitis.",
    earliestFacilityStage: 0,
    conceptType: "diagnosis",
  },
  {
    id: "concept.mondor-disease.selective-imaging-evaluation",
    displayName: "Selective imaging evaluation of suspected Mondor disease",
    learningObjective:
      "Select targeted Doppler ultrasound when the superficial venous diagnosis is uncertain and age-appropriate diagnostic breast imaging when focal symptoms require evaluation for underlying pathology.",
    earliestFacilityStage: 0,
    conceptType: "workup",
  },
  {
    id: "concept.mondor-disease.supportive-management",
    displayName: "Supportive management of uncomplicated Mondor disease",
    learningObjective:
      "Use supportive care for concordant uncomplicated Mondor disease while recognizing findings that require renewed evaluation.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];
type AnswerChoice = DecisionNode["answerChoices"][number];

const RECOGNITION_EXPLANATION =
  "A tender, taut superficial cord along the anterolateral breast or chest wall is characteristic of Mondor disease, which is superficial thrombophlebitis. Fever with a fluctuant collection suggests abscess; progressive diffuse skin change and adenopathy require evaluation for malignancy; isolated parasternal tenderness is musculoskeletal.";

const EVALUATION_EXPLANATION =
  "Targeted high-frequency ultrasound with color Doppler can demonstrate the thrombosed superficial vein when the diagnosis is uncertain. For this patient with clinically significant focal breast symptoms and concern for underlying pathology, diagnostic mammography or tomosynthesis plus targeted ultrasound is appropriate; routine screening, MRI alone, or biopsy before diagnostic imaging does not answer the initial question.";

const ULTRASOUND_EXPLANATION =
  "In the appropriate clinical setting, a noncompressible subcutaneous tubular structure without internal Doppler flow supports a thrombosed superficial vein. Normal venous flow, a vascular solid mass, or a complex hyperemic collection points away from uncomplicated Mondor disease.";

const MANAGEMENT_EXPLANATION =
  "Concordant uncomplicated Mondor disease is generally self-limited. Initial care is supportive with warm compresses, an NSAID when appropriate, avoidance of irritating activity or clothing, and follow-up. Antibiotics, venous excision, and therapeutic anticoagulation are not routine without a separate indication.";

const SAFETY_EXPLANATION =
  "Improving tenderness and gradual cord softening fit the expected course. Progressive breast enlargement, diffuse skin thickening, or axillary adenopathy does not belong to the uncomplicated pathway and requires renewed evaluation.";

function boundedWrongDispositions(
  answerChoices: AnswerChoice[],
  clinicalRationale: string,
) {
  return answerChoices
    .filter((choice) => !choice.isCorrect)
    .map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome" as const,
      consequenceNarrative:
        `${choice.label} was selected, so this bounded encounter closed with an incorrect decision. No additional clinical outcome is simulated.`,
      clinicalRationale,
      sourceLabels: [...SOURCE_LABELS],
    }));
}

function finalizeNode(
  node: Omit<DecisionNode, "terminalDispositions">,
): DecisionNode {
  return {
    ...node,
    terminalDispositions: boundedWrongDispositions(
      node.answerChoices,
      node.explanation,
    ),
  };
}

function recognitionPatientNode(
  nodeSuffix: string,
  final: boolean,
): DecisionNode {
  const answerChoices: AnswerChoice[] = [
    {
      id: "mondor_disease",
      label: "Mondor disease",
      isCorrect: true,
      serviceRequest: null,
    },
    {
      id: "breast_abscess",
      label: "Breast abscess",
      isCorrect: false,
      serviceRequest: null,
    },
    {
      id: "inflammatory_breast_cancer",
      label: "Inflammatory breast cancer",
      isCorrect: false,
      serviceRequest: null,
    },
    {
      id: "costochondritis",
      label: "Costochondritis",
      isCorrect: false,
      serviceRequest: null,
    },
  ];
  const node = {
    id: `node.mondor-disease.recognition.patient-to-diagnosis.${nodeSuffix}`,
    questionVariantId:
      "question.mondor-disease.recognition.patient-to-diagnosis.v1",
    primaryConceptId:
      "concept.mondor-disease.clinical-recognition",
    stem: "What is the most likely diagnosis for this patient?",
    answerChoices,
    shuffleAnswers: true,
    explanation: RECOGNITION_EXPLANATION,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
  };
  return final
    ? finalizeNode(node)
    : { ...node, terminalDispositions: [] };
}

function diagnosticImagingNode(
  nodeSuffix: string,
  withResultGate: boolean,
): DecisionNode {
  const answerChoices: AnswerChoice[] = [
    {
      id: "diagnostic_mammography_or_dbt_and_targeted_ultrasound",
      label: "Diagnostic mammography and targeted Doppler ultrasound",
      isCorrect: true,
      serviceRequest: withResultGate
        ? { serviceId: "service.diagnostic_breast_imaging" }
        : null,
    },
    {
      id: "screening_mammography",
      label: "Routine screening mammography alone",
      isCorrect: false,
      serviceRequest: withResultGate
        ? { serviceId: "service.mammography" }
        : null,
    },
    {
      id: "breast_mri",
      label: "Contrast-enhanced breast MRI as the sole initial study",
      isCorrect: false,
      serviceRequest: withResultGate
        ? { serviceId: "service.breast_mri" }
        : null,
    },
    {
      id: "immediate_excisional_biopsy",
      label: "Immediate excisional biopsy without diagnostic imaging",
      isCorrect: false,
      serviceRequest: withResultGate
        ? { serviceId: "service.breast_excisional_biopsy" }
        : null,
    },
  ];
  const node = {
    id: `node.mondor-disease.evaluation.diagnostic-breast-imaging.${nodeSuffix}`,
    questionVariantId:
      "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    primaryConceptId:
      "concept.mondor-disease.selective-imaging-evaluation",
    stem:
      "Which imaging plan best addresses this patient's focal symptoms and concern for underlying pathology?",
    answerChoices,
    shuffleAnswers: true,
    explanation: EVALUATION_EXPLANATION,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: withResultGate
      ? {
          id: `gate.mondor-disease.diagnostic-breast-imaging.${nodeSuffix}`,
          resultTypeId: "service.diagnostic_breast_imaging",
          pendingLabel: "Off-site diagnostic breast imaging pending",
          resultNarrative:
            "Diagnostic mammography shows no suspicious breast lesion. Targeted ultrasound with color Doppler demonstrates a noncompressible superficial tubular structure without internal flow, concordant with superficial thrombophlebitis, and no abscess. There is no known hypercoagulable condition.",
          readiness: "all" as const,
          allowedServiceRouteIds: [
            "route.diagnostic_breast_imaging.outsourced",
          ],
        }
      : null,
  };
  return withResultGate
    ? { ...node, terminalDispositions: [] }
    : finalizeNode(node);
}

function supportiveManagementNode(nodeSuffix: string): DecisionNode {
  const answerChoices: AnswerChoice[] = [
    {
      id: "supportive_care",
      label: "Warm compresses, appropriate NSAID, and follow-up",
      isCorrect: true,
      serviceRequest: null,
    },
    {
      id: "incision_and_drainage",
      label: "Incision and drainage with empiric antibiotics",
      isCorrect: false,
      serviceRequest: null,
    },
    {
      id: "venous_excision",
      label: "Surgical excision of the involved superficial vein",
      isCorrect: false,
      serviceRequest: null,
    },
    {
      id: "therapeutic_anticoagulation",
      label: "Routine therapeutic anticoagulation",
      isCorrect: false,
      serviceRequest: null,
    },
  ];
  return finalizeNode({
    id: `node.mondor-disease.management.supportive-care.${nodeSuffix}`,
    questionVariantId:
      "question.mondor-disease.management.supportive-care.v1",
    primaryConceptId:
      "concept.mondor-disease.supportive-management",
    stem: "What initial management should you recommend for this patient now?",
    answerChoices,
    shuffleAnswers: true,
    explanation: MANAGEMENT_EXPLANATION,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
  });
}

function singleDecisionCase(options: {
  id: string;
  displayName: string;
  presentationId: string;
  ageYears: number;
  chiefComplaint: string;
  presentation: string;
  node: DecisionNode;
  learningSummary: string;
}): SyntheticClinicalCase {
  return {
    id: options.id,
    displayName: options.displayName,
    patientPresentationVariantId: options.presentationId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: options.ageYears,
      sexLabel: "Female",
    },
    prototypeVitalSigns: {
      heartRateBpm: 76,
      systolicBloodPressureMmHg: 118,
      diastolicBloodPressureMmHg: 74,
      temperatureF: 98.4,
      oxygenSaturationPercent: 99,
    },
    chiefComplaint: options.chiefComplaint,
    presentation: options.presentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [options.node],
    learningSummary: options.learningSummary,
  };
}

const selectPatientChoices: AnswerChoice[] = [
  {
    id: "superficial_cord",
    label: "Tender superficial breast cord with little inflammation",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "diffuse_inflammatory_change",
    label:
      "Diffuse progressive erythema, breast enlargement, peau d'orange, and adenopathy",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "fluctuant_febrile_mass",
    label: "Fever with a tender fluctuant breast mass",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "parasternal_tenderness",
    label:
      "Reproducible parasternal tenderness without a skin or subcutaneous abnormality",
    isCorrect: false,
    serviceRequest: null,
  },
];

const underlyingProcessChoices: AnswerChoice[] = [
  {
    id: "superficial_thrombophlebitis",
    label: "Superficial chest-wall thrombophlebitis",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "duct_infection",
    label: "Infection of a breast duct",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "fat_necrosis",
    label: "Fat necrosis within the breast parenchyma",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "deep_axillary_thrombosis",
    label: "Thrombosis of a deep axillary vein",
    isCorrect: false,
    serviceRequest: null,
  },
];

const uncertainEvaluationChoices: AnswerChoice[] = [
  {
    id: "targeted_doppler_ultrasound",
    label: "Targeted Doppler ultrasound",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "screening_mammography",
    label: "Routine screening mammography alone",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "breast_mri",
    label: "Contrast-enhanced breast MRI",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "core_biopsy",
    label: "Core-needle biopsy before imaging",
    isCorrect: false,
    serviceRequest: null,
  },
];

const ultrasoundFindingChoices: AnswerChoice[] = [
  {
    id: "noncompressible_tubular_no_flow",
    label: "A noncompressible superficial vein without Doppler flow",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "compressible_vein_normal_flow",
    label: "A compressible superficial vein with normal internal flow",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "vascular_solid_mass",
    label: "An irregular vascular solid mass",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "hyperemic_collection",
    label: "A complex fluid collection with peripheral hyperemia",
    isCorrect: false,
    serviceRequest: null,
  },
];

const safetyBoundaryChoices: AnswerChoice[] = [
  {
    id: "progressive_diffuse_change",
    label: "Progressive skin thickening, breast enlargement, and adenopathy",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "decreasing_tenderness",
    label: "Decreasing tenderness",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "softening_cord",
    label: "Gradual softening of the superficial cord",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "no_infection_or_edema",
    label:
      "Continued absence of fever, fluctuance, and distal extremity edema",
    isCorrect: false,
    serviceRequest: null,
  },
];

const supportivePatientChoices: AnswerChoice[] = [
  {
    id: "uncomplicated_concordant_mondor",
    label: "An uncomplicated cord after reassuring breast evaluation",
    isCorrect: true,
    serviceRequest: null,
  },
  {
    id: "febrile_abscess",
    label: "Fever with a fluctuant breast collection",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "suspicious_mass",
    label: "A suspicious breast mass with axillary adenopathy",
    isCorrect: false,
    serviceRequest: null,
  },
  {
    id: "migratory_thrombophlebitis",
    label:
      "Recurrent migratory thrombophlebitis with systemic symptoms",
    isCorrect: false,
    serviceRequest: null,
  },
];

export const ROW_036_CASES = [
  {
    id: "case.mondor-disease.full-pathway",
    displayName: "Clinic Patient: Tender Breast Cord",
    patientPresentationVariantId:
      "presentation.mondor-disease.full-pathway",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 44,
      sexLabel: "Female",
    },
    prototypeVitalSigns: {
      heartRateBpm: 78,
      systolicBloodPressureMmHg: 120,
      diastolicBloodPressureMmHg: 76,
      temperatureF: 98.5,
      oxygenSaturationPercent: 99,
    },
    chiefComplaint: "Tender cord along the breast",
    presentation:
      "A 44-year-old woman reports sudden burning discomfort and redness along the anterolateral breast. Examination shows a tender, taut subcutaneous cord without fever or fluctuance. She asks what the cord could be and whether it needs testing.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      recognitionPatientNode("full-pathway", false),
      diagnosticImagingNode("full-pathway", true),
      supportiveManagementNode("full-pathway"),
    ],
    learningSummary:
      "Mondor disease is a superficial thrombophlebitis that often presents as a tender subcutaneous breast or chest-wall cord. Use imaging selectively to confirm uncertain venous findings or evaluate relevant breast pathology, then use supportive care for an uncomplicated concordant case.",
  },
  {
    id: "case.mondor-disease.evaluation-and-management",
    displayName: "Clinic Patient: Focal Breast Cord Evaluation",
    patientPresentationVariantId:
      "presentation.mondor-disease.evaluation-and-management",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 44,
      sexLabel: "Female",
    },
    prototypeVitalSigns: {
      heartRateBpm: 74,
      systolicBloodPressureMmHg: 116,
      diastolicBloodPressureMmHg: 72,
      temperatureF: 98.2,
      oxygenSaturationPercent: 100,
    },
    chiefComplaint: "New focal breast discomfort",
    presentation:
      "A 44-year-old woman presents with new focal, noncyclic burning pain and a palpable superficial breast cord. There was no clear procedure or trauma. She asks whether imaging is needed to evaluate the cord and exclude an underlying breast problem.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      diagnosticImagingNode("evaluation-and-management", true),
      supportiveManagementNode("evaluation-and-management"),
    ],
    learningSummary:
      "For clinically significant focal breast symptoms with concern for underlying pathology, use age-appropriate diagnostic breast imaging and targeted Doppler ultrasound. A reassuring evaluation that confirms uncomplicated superficial thrombophlebitis supports conservative care.",
  },
  singleDecisionCase({
    id: "case.mondor-disease.select-matching-patient",
    displayName: "Clinic Patient: Superficial Cord Pattern",
    presentationId:
      "presentation.mondor-disease.select-matching-patient",
    ageYears: 41,
    chiefComplaint: "Comparing focal breast and chest-wall findings",
    presentation:
      "A stable 41-year-old woman comes to clinic for focal breast and chest-wall discomfort that she finds difficult to describe. She asks which examination pattern would most strongly point to Mondor disease.",
    node: finalizeNode({
      id: "node.mondor-disease.recognition.select-patient.v1",
      questionVariantId:
        "question.mondor-disease.recognition.select-patient.v1",
      primaryConceptId:
        "concept.mondor-disease.clinical-recognition",
      stem: "Which possible examination finding would best fit this patient?",
      answerChoices: selectPatientChoices,
      shuffleAnswers: true,
      explanation: RECOGNITION_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "The classic clinical clue is a tender superficial cord with little surrounding inflammation.",
  }),
  singleDecisionCase({
    id: "case.mondor-disease.underlying-process",
    displayName: "Clinic Patient: Chest-Wall Cord",
    presentationId:
      "presentation.mondor-disease.underlying-process",
    ageYears: 39,
    chiefComplaint: "New tender cord beneath the skin",
    presentation:
      "A 39-year-old woman develops a tender cord immediately beneath the anterior chest-wall skin without a deep extremity process. She asks what structure could produce such a sharply outlined finding.",
    node: finalizeNode({
      id: "node.mondor-disease.recognition.underlying-process.v1",
      questionVariantId:
        "question.mondor-disease.recognition.underlying-process.v1",
      primaryConceptId:
        "concept.mondor-disease.clinical-recognition",
      stem: "Which underlying process best explains this patient's finding?",
      answerChoices: underlyingProcessChoices,
      shuffleAnswers: true,
      explanation: RECOGNITION_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "Mondor disease is thrombosis and inflammation of a superficial breast or chest-wall vein.",
  }),
  singleDecisionCase({
    id: "case.mondor-disease.uncertain-targeted-ultrasound",
    displayName: "Clinic Patient: Indeterminate Linear Breast Finding",
    presentationId:
      "presentation.mondor-disease.uncertain-targeted-ultrasound",
    ageYears: 35,
    chiefComplaint: "Tender linear subcutaneous finding",
    presentation:
      "A 35-year-old woman presents with a tender linear subcutaneous breast finding. Examination is not definitive, and there is no discrete mass or systemic illness. She asks which test could clarify what the line represents.",
    node: finalizeNode({
      id: "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
      questionVariantId:
        "question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
      primaryConceptId:
        "concept.mondor-disease.selective-imaging-evaluation",
      stem: "Which study should you order for this patient?",
      answerChoices: uncertainEvaluationChoices,
      shuffleAnswers: true,
      explanation: EVALUATION_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "When the superficial venous diagnosis is uncertain, targeted high-frequency ultrasound with color Doppler can evaluate the suspected vein.",
  }),
  singleDecisionCase({
    id: "case.mondor-disease.ultrasound-finding",
    displayName: "Clinic Patient: Targeted Ultrasound Review",
    presentationId:
      "presentation.mondor-disease.ultrasound-finding",
    ageYears: 42,
    chiefComplaint: "Reviewing ultrasound for a tender breast cord",
    presentation:
      "A stable 42-year-old woman returns to review targeted ultrasound obtained for a tender superficial breast cord. She asks which imaging feature would confirm the suspected venous process.",
    node: finalizeNode({
      id: "node.mondor-disease.evaluation.ultrasound-finding.v1",
      questionVariantId:
        "question.mondor-disease.evaluation.ultrasound-finding.v1",
      primaryConceptId:
        "concept.mondor-disease.selective-imaging-evaluation",
      stem: "Which possible ultrasound finding would support this patient's diagnosis?",
      answerChoices: ultrasoundFindingChoices,
      shuffleAnswers: true,
      explanation: ULTRASOUND_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "A thrombosed superficial vein appears as a noncompressible subcutaneous tubular structure without internal Doppler flow.",
  }),
  singleDecisionCase({
    id: "case.mondor-disease.safety-boundary",
    displayName: "Clinic Patient: Follow-Up Safety Check",
    presentationId:
      "presentation.mondor-disease.safety-boundary",
    ageYears: 46,
    chiefComplaint: "Follow-up after presumed Mondor disease",
    presentation:
      "A 46-year-old woman returns after supportive management for presumed uncomplicated Mondor disease. She asks which new change should prompt her to stop routine supportive care and seek renewed evaluation.",
    node: finalizeNode({
      id: "node.mondor-disease.management.safety-boundary.v1",
      questionVariantId:
        "question.mondor-disease.management.safety-boundary.v1",
      primaryConceptId:
        "concept.mondor-disease.supportive-management",
      stem: "Which possible new finding should change this patient's plan?",
      answerChoices: safetyBoundaryChoices,
      shuffleAnswers: true,
      explanation: SAFETY_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "Progressive diffuse breast change or adenopathy falls outside the uncomplicated supportive-care pathway and requires renewed evaluation.",
  }),
  singleDecisionCase({
    id: "case.mondor-disease.select-supportive-patient",
    displayName: "Clinic Patient: Supportive-Care Selection",
    presentationId:
      "presentation.mondor-disease.select-supportive-patient",
    ageYears: 40,
    chiefComplaint: "Selecting a safe supportive-care pathway",
    presentation:
      "A stable 40-year-old woman with a tender superficial breast cord returns to decide whether routine supportive care is safe. Her final examination and imaging summary is being reconciled, and she asks whether she can avoid an invasive procedure.",
    node: finalizeNode({
      id: "node.mondor-disease.management.select-supportive-patient.v1",
      questionVariantId:
        "question.mondor-disease.management.select-supportive-patient.v1",
      primaryConceptId:
        "concept.mondor-disease.supportive-management",
      stem:
        "Which possible completed finding set would support routine care for this patient?",
      answerChoices: supportivePatientChoices,
      shuffleAnswers: true,
      explanation: MANAGEMENT_EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
    }),
    learningSummary:
      "Reserve routine supportive treatment for a concordant uncomplicated superficial venous cord after reassuring evaluation and without infection, a suspicious mass, or a relevant systemic condition.",
  }),
] satisfies SyntheticClinicalCase[];
