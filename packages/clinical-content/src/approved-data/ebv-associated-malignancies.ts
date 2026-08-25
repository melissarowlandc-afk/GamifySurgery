import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_031_CONTENT_VERSION =
  "clinical.owner-row-031.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_031_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_031_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_031_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const CLASSIC_ASSOCIATIONS_CLAIM_ID =
  "claim.ebv.associated-malignancies.classic";
const GASTRIC_SUBTYPE_CLAIM_ID =
  "claim.ebv.gastric-adenocarcinoma.subtype";
const ASSOCIATION_BOUNDARY_CLAIM_ID =
  "claim.ebv.association-not-universal";

const SOURCE_LABELS = [
  "CDC Clinical Overview of Epstein-Barr Virus, April 10, 2024",
  "NCI PDQ Stomach (Gastric) Cancer Prevention, updated April 7, 2025",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

export const ROW_031_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-031.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_031_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 31,
    sourceRecordKey: "owner-concept.sheet1.row-031",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptId: "concept.ebv.associated-malignancy-recognition",
  approvedConceptType: "applied_science",
  approvedPresentationVariantIds: [
    "presentation.ebv-associated-malignancy.burkitt",
    "presentation.ebv-associated-malignancy.gastric",
    "presentation.ebv-associated-malignancy.nasopharyngeal",
  ],
  approvedQuestionVariantIds: [
    "question.ebv-associated-malignancy.burkitt.v1",
    "question.ebv-associated-malignancy.gastric.v1",
    "question.ebv-associated-malignancy.nasopharyngeal.v1",
  ],
  approvedEvidenceClaimIds: [
    CLASSIC_ASSOCIATIONS_CLAIM_ID,
    GASTRIC_SUBTYPE_CLAIM_ID,
    ASSOCIATION_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "applied_science_concept_type",
    "one_fsrs_identity",
    "release_point",
    "association_scope",
    "three_exact_question_stems",
    "three_exact_answer_sets",
    "keyed_answers",
    "feedback",
    "nonuniversal_association_boundary",
    "noncatastrophic_terminal_consequence_framing",
  ],
  deferredElements: [
    "hodgkin_lymphoma_question_variant_pending_exact_wording_review",
  ],
} as const;

export const ROW_031_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.cdc.ebv-clinical-overview.2024",
    title: "Clinical Overview of Epstein-Barr Virus (EBV)",
    completeCitation:
      "Centers for Disease Control and Prevention, National Center for Immunization and Respiratory Diseases, Division of Viral Diseases. Clinical Overview of Epstein-Barr Virus (EBV). April 10, 2024.",
    organizationOrJournal:
      "Centers for Disease Control and Prevention",
    authors: [
      "Centers for Disease Control and Prevention, Division of Viral Diseases",
    ],
    publicationYear: 2024,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.cdc.gov/epstein-barr/hcp/clinical-overview/index.html",
    accessedOn: "2026-08-06",
    sourceClass: "government_guidance",
    licenseLabel:
      "U.S. government public-domain conditions apply; third-party material may be excluded",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis; do not reproduce page layout, agency marks, linked third-party material, or protected media.",
    authorityAssessment:
      "Current CDC clinical overview supporting the bounded recognition of Burkitt lymphoma, Hodgkin lymphoma, and nasopharyngeal carcinoma as EBV-associated malignancies.",
    usageRole: "evidence",
    evidenceClaimIds: [
      CLASSIC_ASSOCIATIONS_CLAIM_ID,
      ASSOCIATION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nci.pdq-gastric-prevention.2025",
    title: "Stomach (Gastric) Cancer Prevention (PDQ), Health Professional Version",
    completeCitation:
      "PDQ Screening and Prevention Editorial Board. Stomach (Gastric) Cancer Prevention (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated April 7, 2025.",
    organizationOrJournal:
      "National Cancer Institute, PDQ Screening and Prevention Editorial Board",
    authors: ["PDQ Screening and Prevention Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: "26389263",
    officialUrl:
      "https://www.cancer.gov/types/stomach/hp/stomach-prevention-pdq",
    accessedOn: "2026-08-06",
    sourceClass: "government_guidance",
    licenseLabel:
      "NCI reuse conditions apply; third-party illustrations and separately credited material are excluded",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis with NCI attribution; do not reproduce the PDQ summary, tables, references, illustrations, or protected marks.",
    authorityAssessment:
      "Continuously reviewed NCI evidence summary supporting an EBV-associated subset of gastric cancer and the boundary that the association is not universal across gastric cancers.",
    usageRole: "evidence",
    evidenceClaimIds: [
      GASTRIC_SUBTYPE_CLAIM_ID,
      ASSOCIATION_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_031_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: CLASSIC_ASSOCIATIONS_CLAIM_ID,
    statement:
      "Epstein-Barr virus has recognized associations with Burkitt lymphoma, Hodgkin lymphoma, and nasopharyngeal carcinoma.",
    sourceIds: ["source.cdc.ebv-clinical-overview.2024"],
    evidenceCategory: "epidemiology",
    certainty: "high",
    limitation:
      "The strength and prevalence of the association vary by malignancy subtype, geography, age, and immune context.",
    applicablePopulation:
      "Learners distinguishing canonical virus-malignancy associations; this is not an individual cancer-risk prediction.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: GASTRIC_SUBTYPE_CLAIM_ID,
    statement:
      "A subset of gastric adenocarcinomas is associated with Epstein-Barr virus.",
    sourceIds: ["source.nci.pdq-gastric-prevention.2025"],
    evidenceCategory: "epidemiology",
    certainty: "high",
    limitation:
      "The association applies to a subset and must not be phrased as though every gastric adenocarcinoma is EBV-positive.",
    applicablePopulation:
      "Learners recognizing EBV-associated gastric adenocarcinoma as a molecularly defined subset.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ASSOCIATION_BOUNDARY_CLAIM_ID,
    statement:
      "An established EBV-malignancy association does not mean that every case of that malignancy is EBV-positive.",
    sourceIds: [
      "source.cdc.ebv-clinical-overview.2024",
      "source.nci.pdq-gastric-prevention.2025",
    ],
    evidenceCategory: "epidemiology",
    certainty: "high",
    limitation:
      "This boundary does not quantify the prevalence of EBV positivity for any individual malignancy or predict risk for an individual with prior EBV infection.",
    applicablePopulation:
      "Learners interpreting a recognized virus-malignancy association without converting it into a universal or patient-specific claim.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_031_CONCEPT = {
  id: "concept.ebv.associated-malignancy-recognition",
  displayName: "Recognition of EBV-associated malignancies",
  learningObjective:
    "Recognize canonical EBV-associated malignancies while preserving the boundary that an association is neither universal across every tumor nor an individual cancer-risk prediction.",
  earliestFacilityStage: 0,
  conceptType: "applied_science",
} satisfies TestedConcept;

const SHARED_EXPLANATION =
  "Epstein-Barr virus has recognized associations with Burkitt lymphoma, Hodgkin lymphoma, nasopharyngeal carcinoma, and a subset of gastric adenocarcinomas. This is an association-recognition concept: it does not mean every case is EBV-positive or predict an individual patient's future cancer.";

function incorrectAssociationDisposition(
  answerChoiceId: string,
  selectedLabel: string,
  correctLabel: string,
) {
  return {
    answerChoiceId,
    kind: "no_terminal_outcome" as const,
    consequenceNarrative:
      `The referral discussion recorded ${selectedLabel} instead of ${correctLabel} as the keyed EBV-associated malignancy for this bounded item.`,
    clinicalRationale:
      `${correctLabel} is the approved EBV-associated answer in this variant. The item does not make a universal claim about every case of that malignancy.`,
    sourceLabels: [...SOURCE_LABELS],
  };
}

export const ROW_031_CASES = [
  {
    id: "case.ebv-associated-malignancy.burkitt",
    displayName: "Clinic Patient: Oncology Association Review",
    patientPresentationVariantId:
      "presentation.ebv-associated-malignancy.burkitt",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Reviewing an oncology referral",
    presentation:
      "An adult brings an oncology referral containing several candidate diagnoses and a note asking about Epstein-Barr virus. The patient wants to understand which diagnosis on the list has a recognized EBV association; the discussion does not predict their individual future cancer risk.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.ebv-associated-malignancy.burkitt.v1",
        questionVariantId:
          "question.ebv-associated-malignancy.burkitt.v1",
        primaryConceptId: ROW_031_CONCEPT.id,
        stem:
          "Which diagnosis on this patient's referral list has a recognized EBV association?",
        answerChoices: [
          {
            id: "burkitt_lymphoma",
            label: "Burkitt lymphoma",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "cervical_squamous_cell_carcinoma",
            label: "Cervical squamous cell carcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "adult_t_cell_leukemia_lymphoma",
            label: "Adult T-cell leukemia/lymphoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "kaposi_sarcoma",
            label: "Kaposi sarcoma",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: SHARED_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectAssociationDisposition(
            "cervical_squamous_cell_carcinoma",
            "cervical squamous cell carcinoma",
            "Burkitt lymphoma",
          ),
          incorrectAssociationDisposition(
            "adult_t_cell_leukemia_lymphoma",
            "adult T-cell leukemia/lymphoma",
            "Burkitt lymphoma",
          ),
          incorrectAssociationDisposition(
            "kaposi_sarcoma",
            "Kaposi sarcoma",
            "Burkitt lymphoma",
          ),
        ],
      },
    ],
    learningSummary: SHARED_EXPLANATION,
  },
  {
    id: "case.ebv-associated-malignancy.gastric",
    displayName: "Clinic Patient: Gastric Tumor Review",
    patientPresentationVariantId:
      "presentation.ebv-associated-malignancy.gastric",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Reviewing gastric-tumor biology",
    presentation:
      "An adult returns while an epithelial-cancer referral is being clarified. The pathology note asks which possible primary diagnosis can occur as an EBV-associated molecular subtype, and the patient asks what that note means. The discussion does not imply that every tumor at that site shares the association.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.ebv-associated-malignancy.gastric.v1",
        questionVariantId:
          "question.ebv-associated-malignancy.gastric.v1",
        primaryConceptId: ROW_031_CONCEPT.id,
        stem: "Which possible diagnosis on this patient's report fits that association?",
        answerChoices: [
          {
            id: "gastric_adenocarcinoma",
            label: "Gastric adenocarcinoma",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "pancreatic_adenocarcinoma",
            label: "Pancreatic adenocarcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "renal_cell_carcinoma",
            label: "Renal cell carcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "colorectal_adenocarcinoma",
            label: "Colorectal adenocarcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: SHARED_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectAssociationDisposition(
            "pancreatic_adenocarcinoma",
            "pancreatic adenocarcinoma",
            "gastric adenocarcinoma",
          ),
          incorrectAssociationDisposition(
            "renal_cell_carcinoma",
            "renal cell carcinoma",
            "gastric adenocarcinoma",
          ),
          incorrectAssociationDisposition(
            "colorectal_adenocarcinoma",
            "colorectal adenocarcinoma",
            "gastric adenocarcinoma",
          ),
        ],
      },
    ],
    learningSummary: SHARED_EXPLANATION,
  },
  {
    id: "case.ebv-associated-malignancy.nasopharyngeal",
    displayName: "Clinic Patient: Head and Neck Referral Review",
    patientPresentationVariantId:
      "presentation.ebv-associated-malignancy.nasopharyngeal",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Reviewing a head-and-neck oncology referral",
    presentation:
      "An adult brings a head-and-neck oncology referral with several possible diagnoses and a pathology note about Epstein-Barr virus. The patient asks which diagnosis is known to carry that association rather than what the note predicts about their individual outcome.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.ebv-associated-malignancy.nasopharyngeal.v1",
        questionVariantId:
          "question.ebv-associated-malignancy.nasopharyngeal.v1",
        primaryConceptId: ROW_031_CONCEPT.id,
        stem: "Which diagnosis on this patient's referral list has the recognized association?",
        answerChoices: [
          {
            id: "nasopharyngeal_carcinoma",
            label: "Nasopharyngeal carcinoma",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "laryngeal_squamous_cell_carcinoma",
            label: "Laryngeal squamous cell carcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "papillary_thyroid_carcinoma",
            label: "Papillary thyroid carcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "oral_cavity_squamous_cell_carcinoma",
            label: "Oral cavity squamous cell carcinoma",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: SHARED_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectAssociationDisposition(
            "laryngeal_squamous_cell_carcinoma",
            "laryngeal squamous cell carcinoma",
            "nasopharyngeal carcinoma",
          ),
          incorrectAssociationDisposition(
            "papillary_thyroid_carcinoma",
            "papillary thyroid carcinoma",
            "nasopharyngeal carcinoma",
          ),
          incorrectAssociationDisposition(
            "oral_cavity_squamous_cell_carcinoma",
            "oral cavity squamous cell carcinoma",
            "nasopharyngeal carcinoma",
          ),
        ],
      },
    ],
    learningSummary: SHARED_EXPLANATION,
  },
] satisfies SyntheticClinicalCase[];
