import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_035_CONTENT_VERSION =
  "clinical.owner-row-035.2026-08-06.1";
export const ROW_035_DRAFT_WORKUP_VERSION =
  "clinical.owner-row-035.workup-draft.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_035_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_035_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const DRAFT_WORKUP_REVIEW = {
  contentVersion: ROW_035_DRAFT_WORKUP_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_035_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const MASS_MORPHOLOGY_CLAIM_ID =
  "claim.breast-imaging.mass.suspicious-morphology";
const MASS_DENSITY_BOUNDARY_CLAIM_ID =
  "claim.breast-imaging.mass.density-not-diagnostic-alone";
const CALCIFICATION_PATTERN_CLAIM_ID =
  "claim.breast-imaging.calcification.suspicious-pattern";
const BENIGN_CALCIFICATION_CLAIM_ID =
  "claim.breast-imaging.calcification.typically-benign-patterns";
const TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID =
  "claim.breast-imaging.suspicion-is-not-tissue-diagnosis";
const AGE_30_TO_39_WORKUP_CLAIM_ID =
  "claim.breast-mass.age-30-to-39.initial-diagnostic-imaging";

const MASS_MORPHOLOGY_CONCEPT_ID =
  "concept.breast-imaging.suspicious-mass-morphology";
const CALCIFICATION_PATTERN_CONCEPT_ID =
  "concept.breast-imaging.suspicious-calcification-pattern";
const DRAFT_WORKUP_CONCEPT_ID =
  "concept.breast-mass.age-30-to-39.initial-diagnostic-imaging";

const MASS_CLAIM_IDS = [
  MASS_MORPHOLOGY_CLAIM_ID,
  MASS_DENSITY_BOUNDARY_CLAIM_ID,
  TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID,
] as const;
const CALCIFICATION_CLAIM_IDS = [
  CALCIFICATION_PATTERN_CLAIM_ID,
  BENIGN_CALCIFICATION_CLAIM_ID,
  TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID,
] as const;
const APPROVED_CLAIM_IDS = [
  MASS_MORPHOLOGY_CLAIM_ID,
  MASS_DENSITY_BOUNDARY_CLAIM_ID,
  CALCIFICATION_PATTERN_CLAIM_ID,
  BENIGN_CALCIFICATION_CLAIM_ID,
  TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID,
] as const;

const APPROVED_SOURCE_LABELS = [
  "ACR BI-RADS v2025 Mammography Lexicon Summary Form",
  "National Cancer Institute Mammograms resource, updated 2025",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

const DRAFT_WORKUP_SOURCE_LABELS = [
  "ACR Appropriateness Criteria: Palpable Breast Masses, 2022 update",
  "Exact workup-question wording requires clinician review",
] as const;

const PRESENTATION_IDS = {
  massSequentialA:
    "presentation.breast-imaging.mass.sequential-new-mass-a",
  massSequentialB:
    "presentation.breast-imaging.mass.sequential-new-mass-b",
  massSpiculatedReport:
    "presentation.breast-imaging.mass.results-spiculated-report",
  massDensityReport:
    "presentation.breast-imaging.mass.results-density-report",
  calcificationConcerning:
    "presentation.breast-imaging.calcification.results-concerning",
  calcificationMorphology:
    "presentation.breast-imaging.calcification.results-morphology",
  calcificationBenign:
    "presentation.breast-imaging.calcification.results-benign",
  calcificationDistribution:
    "presentation.breast-imaging.calcification.results-distribution",
} as const;

const QUESTION_IDS = {
  massConcerningProfileV1:
    "question.breast-imaging.mass.select-concerning-profile.v1",
  massConcerningProfileV2:
    "question.breast-imaging.mass.select-concerning-profile.v2",
  massSpiculatedMarginV1:
    "question.breast-imaging.mass.identify-spiculated-margin.v1",
  massDensityBoundaryV1:
    "question.breast-imaging.mass.density-boundary.v1",
  calcificationConcerningPatternV1:
    "question.breast-imaging.calcification.select-concerning-pattern.v1",
  calcificationSuspiciousMorphologyV1:
    "question.breast-imaging.calcification.select-suspicious-morphology.v1",
  calcificationBenignProfileV1:
    "question.breast-imaging.calcification.select-benign-profile.v1",
  calcificationDistributionBoundaryV1:
    "question.breast-imaging.calcification.distribution-boundary.v1",
} as const;

const DRAFT_WORKUP_QUESTION_IDS = {
  combinedImagingV1:
    "question.breast-mass.age-30-to-39.initial-diagnostic-imaging.v1",
  combinedImagingV2:
    "question.breast-mass.age-30-to-39.initial-diagnostic-imaging.v2",
} as const;

export const ROW_035_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-035.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_035_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 35,
    sourceRecordKey: "owner-concept.sheet1.row-035",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    approvedScopeDecisionId:
      "decision.owner-row-035.two-concept-imaging-split.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [
    MASS_MORPHOLOGY_CONCEPT_ID,
    CALCIFICATION_PATTERN_CONCEPT_ID,
  ],
  approvedConceptTypes: ["diagnosis"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [...APPROVED_CLAIM_IDS],
  approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "two_fsrs_identities",
    "level_3_ambulatory_or_qi_release_point",
    "four_mass-morphology_question_variants",
    "four_calcification-pattern_question_variants",
    "single_select_answer_mode",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "brief_patient_presentation_before_every_question",
    "six_results-in-hand_single-decision_blueprints",
    "imaging-suspicion-is-not-tissue-diagnosis-boundary",
  ],
  deferredElements: [
    "level_3_runtime_case_materialization",
    "developing-or-focal-asymmetry-concept",
    "biopsy-proven-breast-cancer-management",
    "exact_initial-imaging-workup-question-approval",
    "activation-of-two-sequential-blueprints",
  ],
} as const;

export const ROW_035_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.birads-mammography-summary.2025",
    title: "ACR BI-RADS v2025 Mammography Lexicon Summary Form",
    completeCitation:
      "Destounis SV, Friedewald SM, Grimm LJ, Poplack SP, Sung JS. Mammography. In: ACR BI-RADS v2025 Manual. Reston, VA: American College of Radiology; 2025. Public resource used: ACR BI-RADS v2025 Mammography Lexicon Summary Form, Appendix B.",
    organizationOrJournal: "American College of Radiology",
    authors: [
      "Stamatia V. Destounis",
      "Sarah M. Friedewald",
      "Lars J. Grimm",
      "Steven P. Poplack",
      "Jessica S. Sung",
    ],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society reporting standard",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only. Do not reproduce manual prose, tables, figures, clinical images, or algorithms.",
    authorityAssessment:
      "Current authoritative ACR breast-imaging lexicon for mammographic mass and calcification descriptors.",
    usageRole: "evidence",
    evidenceClaimIds: [
      MASS_MORPHOLOGY_CLAIM_ID,
      MASS_DENSITY_BOUNDARY_CLAIM_ID,
      CALCIFICATION_PATTERN_CLAIM_ID,
      BENIGN_CALCIFICATION_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nci.mammograms.2025",
    title: "Mammograms",
    completeCitation:
      "National Cancer Institute. Mammograms. Updated December 2, 2025.",
    organizationOrJournal: "National Cancer Institute",
    authors: ["National Cancer Institute"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.cancer.gov/types/breast/screening/mammograms",
    accessedOn: "2026-08-06",
    sourceClass: "government_guidance",
    licenseLabel:
      "U.S. government resource; NCI reuse conditions and third-party credits apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Store independently written facts and bibliographic metadata only. Exclude illustrations and separately credited material.",
    authorityAssessment:
      "Current U.S. government cancer-information resource independently cross-checking concerning mass morphology, calcification findings, follow-up, and the need for tissue diagnosis when imaging is suspicious.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      MASS_MORPHOLOGY_CLAIM_ID,
      MASS_DENSITY_BOUNDARY_CLAIM_ID,
      CALCIFICATION_PATTERN_CLAIM_ID,
      TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.palpable-breast-masses.2022-update",
    title:
      "ACR Appropriateness Criteria: Palpable Breast Masses, 2022 Update",
    completeCitation:
      "Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al. ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update. J Am Coll Radiol. 2023;20(5S):S146-S163. doi:10.1016/j.jacr.2023.02.013.",
    organizationOrJournal:
      "American College of Radiology; Journal of the American College of Radiology",
    authors: [
      "Katherine A. Klein",
      "Maddi Kocher",
      "Ana P. Lourenco",
      "Bethany L. Niell",
      "Debbie L. Bennett",
      "ACR Expert Panel on Breast Imaging",
    ],
    publicationYear: 2023,
    doi: "10.1016/j.jacr.2023.02.013",
    pmid: "37236740",
    officialUrl:
      "https://acsearch.acr.org/docs/69495/Narrative",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only. Do not reproduce appropriateness tables or protected explanatory wording.",
    authorityAssessment:
      "Authoritative radiology-society guidance for initial imaging of a palpable breast mass in its specified age groups.",
    usageRole: "evidence",
    evidenceClaimIds: [AGE_30_TO_39_WORKUP_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_035_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: MASS_MORPHOLOGY_CLAIM_ID,
    statement:
      "An irregular mammographic mass with a spiculated margin is a concerning morphologic combination that warrants suspicious assessment rather than benign reassurance.",
    sourceIds: [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "Imaging morphology raises or lowers concern but is not itself a tissue diagnosis.",
    applicablePopulation:
      "Adults undergoing diagnostic mammographic assessment of a breast mass.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: MASS_DENSITY_BOUNDARY_CLAIM_ID,
    statement:
      "Mammographic mass density is one descriptor and must be interpreted with shape, margin, associated features, comparison imaging, and the final radiologist assessment rather than being used alone to diagnose or exclude malignancy.",
    sourceIds: [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "The approved questions do not assign a final BI-RADS category from density alone.",
    applicablePopulation:
      "Adults whose diagnostic mammogram includes a described breast mass.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: CALCIFICATION_PATTERN_CLAIM_ID,
    statement:
      "Fine pleomorphic or fine linear or fine linear-branching calcifications are suspicious morphologies, and a linear or segmental distribution can add concern when interpreted with morphology and the complete examination.",
    sourceIds: [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "No morphology or distribution descriptor independently establishes cancer.",
    applicablePopulation:
      "Adults whose mammographic assessment includes breast calcifications.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: BENIGN_CALCIFICATION_CLAIM_ID,
    statement:
      "Vascular, large rod-like, rim, layering, and coarse densely calcified patterns are among calcification appearances categorized as typically benign in the current mammography lexicon.",
    sourceIds: ["source.acr.birads-mammography-summary.2025"],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "The classification belongs within the complete radiologist assessment and cannot override other suspicious findings.",
    applicablePopulation:
      "Adults whose mammographic assessment includes breast calcifications.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: TISSUE_DIAGNOSIS_BOUNDARY_CLAIM_ID,
    statement:
      "Suspicious breast imaging warrants the indicated diagnostic pathway and does not by itself establish a cancer diagnosis or authorize cancer-directed surgery without tissue diagnosis.",
    sourceIds: ["source.nci.mammograms.2025"],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This package teaches imaging-feature recognition only; biopsy technique and cancer treatment are separate concepts.",
    applicablePopulation:
      "Adults with breast imaging assessed as suspicious or highly suggestive of malignancy.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...DRAFT_WORKUP_REVIEW,
    id: AGE_30_TO_39_WORKUP_CLAIM_ID,
    statement:
      "For a woman age 30 to 39 with a new palpable breast mass, diagnostic mammography or tomosynthesis and targeted breast ultrasound are appropriate components of the initial diagnostic imaging evaluation.",
    sourceIds: ["source.acr.palpable-breast-masses.2022-update"],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "Only one adequate authoritative source is mapped. The exact combined-order question wording and distractors remain pending named-clinician review.",
    applicablePopulation:
      "Nonpregnant, nonlactating, average-risk adult women age 30 to 39 with a new persistent palpable breast mass and no overt inflammatory findings.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_035_APPROVED_CONCEPTS = [
  {
    id: MASS_MORPHOLOGY_CONCEPT_ID,
    displayName: "Recognition of suspicious mammographic mass morphology",
    learningObjective:
      "Recognize mass shape and margin combinations that are concerning on mammography while preserving the boundary that imaging morphology is not a tissue diagnosis.",
    earliestFacilityStage: 3,
    conceptType: "diagnosis",
  },
  {
    id: CALCIFICATION_PATTERN_CONCEPT_ID,
    displayName: "Recognition of suspicious mammographic calcification patterns",
    learningObjective:
      "Distinguish suspicious calcification morphology and distribution from typically benign patterns without treating any isolated descriptor as a tissue diagnosis.",
    earliestFacilityStage: 3,
    conceptType: "diagnosis",
  },
] satisfies TestedConcept[];

export const ROW_035_DRAFT_WORKUP_CONCEPT = {
  id: DRAFT_WORKUP_CONCEPT_ID,
  displayName:
    "Initial diagnostic imaging of a palpable breast mass at age 30 to 39",
  learningObjective:
    "Select diagnostic mammography or tomosynthesis with targeted breast ultrasound for the scoped patient age 30 to 39 with a new palpable breast mass.",
  earliestFacilityStage: 3,
  conceptType: "workup",
} as const satisfies TestedConcept;

type ApprovedBreastImagingQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l3.ambulatory_or_qi";
  requiredClinicalSetting: "clinic_preoperative_evaluation";
  encounterRole:
    | "two-step-result"
    | "results-in-hand-single-decision";
  shuffleAnswers: true;
};

export const ROW_035_APPROVED_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.massConcerningProfileV1,
    presentationVariantId: PRESENTATION_IDS.massSequentialA,
    patientPresentation:
      "A 34-year-old woman returns after diagnostic evaluation of a persistent palpable breast mass. The imaging report describes several candidate mass profiles for review, and no tissue diagnosis has been made.",
    conceptId: MASS_MORPHOLOGY_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "two-step-result",
    stem:
      "Which mammographic mass profile is most concerning for malignancy?",
    answerChoices: [
      {
        id: "irregular_spiculated",
        label: "An irregular mass with spiculated margins",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "oval_circumscribed_fat",
        label: "An oval, circumscribed, fat-containing mass",
        isCorrect: false,
        distractorRationale:
          "This profile is less concerning than the irregular spiculated mass in this answer set.",
      },
      {
        id: "round_sharply_circumscribed",
        label: "A round mass with a sharply circumscribed margin",
        isCorrect: false,
        distractorRationale:
          "A sharply circumscribed round mass is less concerning than an irregular spiculated mass in this comparison.",
      },
      {
        id: "oval_circumscribed_low_density",
        label: "An oval, circumscribed low-density mass",
        isCorrect: false,
        distractorRationale:
          "This descriptor combination is less concerning than irregular shape with spiculation.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Irregular shape and a spiculated margin form the most concerning combination among these options. Imaging suspicion is not the same as a tissue diagnosis.",
    supportingEvidenceClaimIds: [...MASS_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.massConcerningProfileV2,
    presentationVariantId: PRESENTATION_IDS.massSequentialB,
    patientPresentation:
      "A 38-year-old woman returns with diagnostic mammography and targeted ultrasound results obtained for a new discrete breast mass. The next decision is to interpret the reported mammographic morphology.",
    conceptId: MASS_MORPHOLOGY_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "two-step-result",
    stem:
      "Which combination of mammographic mass descriptors should receive the most suspicious assessment?",
    answerChoices: [
      {
        id: "irregular_spiculated",
        label: "Irregular shape with a spiculated margin",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "oval_circumscribed",
        label: "Oval shape with a circumscribed margin",
        isCorrect: false,
        distractorRationale:
          "This is less concerning than the irregular spiculated combination.",
      },
      {
        id: "round_circumscribed",
        label: "Round shape with a circumscribed margin",
        isCorrect: false,
        distractorRationale:
          "This is less concerning than the irregular spiculated combination.",
      },
      {
        id: "fat_containing_circumscribed",
        label: "Fat-containing density with a circumscribed margin",
        isCorrect: false,
        distractorRationale:
          "This is less concerning than the irregular spiculated combination.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The irregular, spiculated combination is the most concerning profile in this answer set. The finding still requires the appropriate diagnostic pathway rather than being treated as tissue proof of malignancy.",
    supportingEvidenceClaimIds: [...MASS_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.massSpiculatedMarginV1,
    presentationVariantId: PRESENTATION_IDS.massSpiculatedReport,
    patientPresentation:
      "A patient brings a diagnostic mammography report for a recently evaluated breast mass. The report describes the edge of the mass but does not provide a tissue diagnosis.",
    conceptId: MASS_MORPHOLOGY_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "A mammography report describes thin lines radiating outward from the edge of a breast mass. Which margin descriptor best matches that finding?",
    answerChoices: [
      {
        id: "spiculated",
        label: "Spiculated",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "circumscribed",
        label: "Circumscribed",
        isCorrect: false,
        distractorRationale:
          "A circumscribed margin is sharply defined rather than radiating outward.",
      },
      {
        id: "obscured",
        label: "Obscured",
        isCorrect: false,
        distractorRationale:
          "Obscured does not describe radiating lines from the mass edge.",
      },
      {
        id: "indistinct",
        label: "Indistinct",
        isCorrect: false,
        distractorRationale:
          "Indistinct is not the specific descriptor for radiating lines.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Radiating lines from the margin describe a spiculated mass. The term is a morphology descriptor, not histologic proof of cancer.",
    supportingEvidenceClaimIds: [...MASS_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.massDensityBoundaryV1,
    presentationVariantId: PRESENTATION_IDS.massDensityReport,
    patientPresentation:
      "A patient arrives with diagnostic breast imaging already completed. The report lists mass density along with shape, margin, associated features, and a final radiologist assessment.",
    conceptId: MASS_MORPHOLOGY_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "Which statement about mammographic mass density is most accurate?",
    answerChoices: [
      {
        id: "density_in_context",
        label:
          "Density is one descriptor and must be interpreted with shape, margin, associated features, comparison imaging, and the final assessment",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "every_high_density_malignant",
        label: "Every high-density mass is malignant",
        isCorrect: false,
        distractorRationale:
          "Density alone does not establish malignancy.",
      },
      {
        id: "every_low_density_benign",
        label: "Every low-density mass is benign",
        isCorrect: false,
        distractorRationale:
          "Density alone cannot exclude malignancy.",
      },
      {
        id: "density_alone_birads",
        label: "Density alone determines the final BI-RADS category",
        isCorrect: false,
        distractorRationale:
          "The complete imaging assessment, not one descriptor, determines the final category.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Density contributes to assessment but cannot diagnose or exclude malignancy by itself.",
    supportingEvidenceClaimIds: [...MASS_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.calcificationConcerningPatternV1,
    presentationVariantId: PRESENTATION_IDS.calcificationConcerning,
    patientPresentation:
      "A patient is referred with diagnostic mammography results showing breast calcifications. The report is available for review before any tissue diagnosis.",
    conceptId: CALCIFICATION_PATTERN_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "Which mammographic calcification pattern is most concerning for malignancy?",
    answerChoices: [
      {
        id: "fine_linear_segmental",
        label:
          "Fine linear or fine linear-branching calcifications in a segmental distribution",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "vascular_parallel_tracks",
        label: "Vascular calcifications following parallel tracks",
        isCorrect: false,
        distractorRationale:
          "Vascular calcifications are categorized as typically benign.",
      },
      {
        id: "large_smooth_rod_like",
        label: "Large, smooth rod-like calcifications",
        isCorrect: false,
        distractorRationale:
          "Large rod-like calcifications are categorized as typically benign.",
      },
      {
        id: "coarse_dense_confluent",
        label: "Coarse, densely calcified, confluent calcifications",
        isCorrect: false,
        distractorRationale:
          "This coarse densely calcified profile is categorized as typically benign.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Suspicious fine linear or branching morphology combined with a segmental distribution is the most concerning profile in this answer set.",
    supportingEvidenceClaimIds: [...CALCIFICATION_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.calcificationSuspiciousMorphologyV1,
    presentationVariantId: PRESENTATION_IDS.calcificationMorphology,
    patientPresentation:
      "A patient brings a completed mammography report that lists several possible calcification descriptors. The task is to identify the suspicious morphology.",
    conceptId: CALCIFICATION_PATTERN_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "Which calcification morphology is categorized as suspicious on mammography?",
    answerChoices: [
      {
        id: "fine_pleomorphic",
        label: "Fine pleomorphic calcifications",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "vascular",
        label: "Vascular calcifications",
        isCorrect: false,
        distractorRationale:
          "Vascular calcifications are categorized as typically benign.",
      },
      {
        id: "rim",
        label: "Rim calcifications",
        isCorrect: false,
        distractorRationale:
          "Rim calcifications are categorized as typically benign.",
      },
      {
        id: "layering",
        label: "Layering calcifications",
        isCorrect: false,
        distractorRationale:
          "Layering calcifications are categorized as typically benign.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Fine pleomorphic morphology is suspicious; the other listed patterns are categorized as typically benign.",
    supportingEvidenceClaimIds: [...CALCIFICATION_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.calcificationBenignProfileV1,
    presentationVariantId: PRESENTATION_IDS.calcificationBenign,
    patientPresentation:
      "A patient is seen after mammography has identified breast calcifications. The imaging descriptors are already available, and the question is which profile is typically benign.",
    conceptId: CALCIFICATION_PATTERN_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "Which calcification profile is categorized as typically benign?",
    answerChoices: [
      {
        id: "coarse_dense_confluent",
        label: "Coarse, large, densely calcified, confluent calcifications",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "fine_pleomorphic",
        label: "Fine pleomorphic calcifications",
        isCorrect: false,
        distractorRationale:
          "Fine pleomorphic calcifications are a suspicious morphology.",
      },
      {
        id: "fine_linear_branching",
        label: "Fine linear-branching calcifications",
        isCorrect: false,
        distractorRationale:
          "Fine linear or fine linear-branching calcifications are a suspicious morphology.",
      },
      {
        id: "coarse_heterogeneous",
        label: "Coarse heterogeneous calcifications",
        isCorrect: false,
        distractorRationale:
          "Coarse heterogeneous calcifications are in the suspicious lexicon rather than the typically benign group.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The coarse densely calcified pattern is typically benign. The other listed morphologies are in the suspicious lexicon.",
    supportingEvidenceClaimIds: [...CALCIFICATION_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.calcificationDistributionBoundaryV1,
    presentationVariantId: PRESENTATION_IDS.calcificationDistribution,
    patientPresentation:
      "A patient presents with diagnostic mammography results describing calcification morphology and distribution. No biopsy result is available.",
    conceptId: CALCIFICATION_PATTERN_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    encounterRole: "results-in-hand-single-decision",
    stem:
      "Which statement about a segmental distribution of breast calcifications is most accurate?",
    answerChoices: [
      {
        id: "distribution_in_context",
        label:
          "It is a distribution descriptor that must be interpreted with calcification morphology and the complete imaging assessment; it does not by itself diagnose cancer",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "segmental_confirms_cancer",
        label: "Segmental distribution automatically confirms breast cancer",
        isCorrect: false,
        distractorRationale:
          "Distribution alone does not provide tissue diagnosis.",
      },
      {
        id: "distribution_irrelevant",
        label: "Calcification distribution has no role in imaging assessment",
        isCorrect: false,
        distractorRationale:
          "Distribution is an imaging descriptor that contributes to the complete assessment.",
      },
      {
        id: "every_diffuse_requires_tissue",
        label: "Every diffuse calcification pattern requires tissue diagnosis",
        isCorrect: false,
        distractorRationale:
          "The complete morphology and imaging assessment determine whether tissue diagnosis is indicated.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Distribution modifies interpretation but does not replace morphology, the rest of the examination, or tissue diagnosis when indicated.",
    supportingEvidenceClaimIds: [...CALCIFICATION_CLAIM_IDS],
  },
] satisfies ApprovedBreastImagingQuestionVariant[];

type DraftBreastWorkupQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l3.ambulatory_or_qi";
  requiredClinicalSetting: "clinic_preoperative_evaluation";
  orderedServiceIds: [
    "service.diagnostic-mammography",
    "service.targeted-breast-ultrasound",
  ];
  shuffleAnswers: true;
};

export const ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS = [
  {
    ...DRAFT_WORKUP_REVIEW,
    id: DRAFT_WORKUP_QUESTION_IDS.combinedImagingV1,
    presentationVariantId: PRESENTATION_IDS.massSequentialA,
    patientPresentation:
      "A nonpregnant, nonlactating 34-year-old woman at average breast-cancer risk presents with a new persistent palpable breast mass and no overt inflammatory findings.",
    conceptId: DRAFT_WORKUP_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    orderedServiceIds: [
      "service.diagnostic-mammography",
      "service.targeted-breast-ultrasound",
    ],
    stem:
      "Which initial diagnostic imaging plan is most appropriate for this presentation?",
    answerChoices: [
      {
        id: "diagnostic_mammography_and_targeted_ultrasound",
        label:
          "Order diagnostic mammography or tomosynthesis with targeted breast ultrasound",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "screening_mammography_only",
        label: "Order routine screening mammography only",
        isCorrect: false,
        distractorRationale:
          "A new palpable mass requires diagnostic rather than routine screening evaluation.",
      },
      {
        id: "breast_mri_only",
        label: "Order contrast-enhanced breast MRI as the sole initial study",
        isCorrect: false,
        distractorRationale:
          "MRI is not the appropriate sole initial imaging plan for this scoped presentation.",
      },
      {
        id: "observe_without_imaging",
        label: "Observe without imaging unless the mass enlarges",
        isCorrect: false,
        distractorRationale:
          "A new persistent palpable mass in this age group warrants diagnostic imaging.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For this scoped patient age 30 to 39 with a new palpable mass, diagnostic mammography or tomosynthesis and targeted ultrasound are appropriate components of the initial imaging evaluation.",
    supportingEvidenceClaimIds: [AGE_30_TO_39_WORKUP_CLAIM_ID],
  },
  {
    ...DRAFT_WORKUP_REVIEW,
    id: DRAFT_WORKUP_QUESTION_IDS.combinedImagingV2,
    presentationVariantId: PRESENTATION_IDS.massSequentialB,
    patientPresentation:
      "A nonpregnant, nonlactating 38-year-old woman at average breast-cancer risk presents with a newly noticed discrete breast mass without erythema, drainage, or other overt inflammatory findings.",
    conceptId: DRAFT_WORKUP_CONCEPT_ID,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "clinic_preoperative_evaluation",
    orderedServiceIds: [
      "service.diagnostic-mammography",
      "service.targeted-breast-ultrasound",
    ],
    stem:
      "What is the most appropriate initial diagnostic imaging approach?",
    answerChoices: [
      {
        id: "diagnostic_mammography_and_targeted_ultrasound",
        label:
          "Obtain diagnostic mammography or tomosynthesis and targeted breast ultrasound",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "annual_screening_only",
        label: "Wait for the next annual screening mammogram",
        isCorrect: false,
        distractorRationale:
          "A new palpable finding should receive diagnostic evaluation rather than waiting for routine screening.",
      },
      {
        id: "pet_ct",
        label: "Order PET/CT as the initial breast imaging study",
        isCorrect: false,
        distractorRationale:
          "PET/CT is not the appropriate initial breast imaging approach for this scoped presentation.",
      },
      {
        id: "surgical_excision_before_imaging",
        label: "Proceed directly to surgical excision before diagnostic imaging",
        isCorrect: false,
        distractorRationale:
          "The approved pathway begins with diagnostic imaging rather than cancer-directed surgery without imaging or tissue diagnosis.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For this scoped patient age 30 to 39, diagnostic mammography or tomosynthesis and targeted ultrasound are appropriate initial imaging modalities. Subsequent tissue diagnosis depends on the complete assessment.",
    supportingEvidenceClaimIds: [AGE_30_TO_39_WORKUP_CLAIM_ID],
  },
] satisfies DraftBreastWorkupQuestionVariant[];

export const ROW_035_APPROVED_RESULTS_IN_HAND_BLUEPRINTS = [
  {
    id: "blueprint.breast-imaging.mass.results-spiculated-report",
    presentationVariantId: PRESENTATION_IDS.massSpiculatedReport,
    questionVariantIds: [QUESTION_IDS.massSpiculatedMarginV1],
  },
  {
    id: "blueprint.breast-imaging.mass.results-density-report",
    presentationVariantId: PRESENTATION_IDS.massDensityReport,
    questionVariantIds: [QUESTION_IDS.massDensityBoundaryV1],
  },
  {
    id: "blueprint.breast-imaging.calcification.results-concerning",
    presentationVariantId: PRESENTATION_IDS.calcificationConcerning,
    questionVariantIds: [
      QUESTION_IDS.calcificationConcerningPatternV1,
    ],
  },
  {
    id: "blueprint.breast-imaging.calcification.results-morphology",
    presentationVariantId: PRESENTATION_IDS.calcificationMorphology,
    questionVariantIds: [
      QUESTION_IDS.calcificationSuspiciousMorphologyV1,
    ],
  },
  {
    id: "blueprint.breast-imaging.calcification.results-benign",
    presentationVariantId: PRESENTATION_IDS.calcificationBenign,
    questionVariantIds: [QUESTION_IDS.calcificationBenignProfileV1],
  },
  {
    id: "blueprint.breast-imaging.calcification.results-distribution",
    presentationVariantId: PRESENTATION_IDS.calcificationDistribution,
    questionVariantIds: [
      QUESTION_IDS.calcificationDistributionBoundaryV1,
    ],
  },
] as const;

export const ROW_035_DRAFT_TWO_STEP_BLUEPRINTS = [
  {
    id: "blueprint.breast-imaging.mass.sequential-new-mass-a",
    reviewStatus: "needs_clinician_review",
    presentationVariantId: PRESENTATION_IDS.massSequentialA,
    questionVariantIds: [
      DRAFT_WORKUP_QUESTION_IDS.combinedImagingV1,
      QUESTION_IDS.massConcerningProfileV1,
    ],
    resultGate: {
      orderedServiceIds: [
        "service.diagnostic-mammography",
        "service.targeted-breast-ultrasound",
      ],
      resultNarrative:
        "Diagnostic breast imaging is complete. The patient returns with the report for morphology review.",
    },
  },
  {
    id: "blueprint.breast-imaging.mass.sequential-new-mass-b",
    reviewStatus: "needs_clinician_review",
    presentationVariantId: PRESENTATION_IDS.massSequentialB,
    questionVariantIds: [
      DRAFT_WORKUP_QUESTION_IDS.combinedImagingV2,
      QUESTION_IDS.massConcerningProfileV2,
    ],
    resultGate: {
      orderedServiceIds: [
        "service.diagnostic-mammography",
        "service.targeted-breast-ultrasound",
      ],
      resultNarrative:
        "The patient returns after diagnostic mammography and targeted ultrasound. The imaging descriptors are ready for review.",
    },
  },
] as const;

export const ROW_035_APPROVED_BACKLOG = {
  conceptIds: ROW_035_APPROVED_CONCEPTS.map((concept) => concept.id),
  proposedWorkupConceptId: ROW_035_DRAFT_WORKUP_CONCEPT.id,
  educationalDifficulty: "intermediate_breast_imaging",
  releasePointId: "release.l3.ambulatory_or_qi",
  earliestFacilityStage: 3,
  requiredClinicalSetting: "clinic_preoperative_evaluation",
  currentGameEligibility: "deferred",
  deferredReason:
    "The clinically approved recognition package is held outside the playable Level 0-1 release until Level 3 Ambulatory OR / QI content admission exists. The two sequential blueprints also require exact approval of their new workup questions.",
  approvedForRuntime: false,
  tutorialEligible: false,
  approvedQuestionVariantIds:
    ROW_035_APPROVED_QUESTION_VARIANTS.map((variant) => variant.id),
  approvedResultsInHandBlueprintIds:
    ROW_035_APPROVED_RESULTS_IN_HAND_BLUEPRINTS.map(
      (blueprint) => blueprint.id,
    ),
  draftWorkupQuestionVariantIds:
    ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS.map(
      (variant) => variant.id,
    ),
  draftTwoStepBlueprintIds: ROW_035_DRAFT_TWO_STEP_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
  maximumScoredDecisionsPerEncounter: 2,
  approvedResultsInHandEncounterCount: 6,
  proposedSequentialEncounterCount: 2,
} as const;
