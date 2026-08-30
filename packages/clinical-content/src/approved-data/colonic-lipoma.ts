import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_034_CONTENT_VERSION =
  "clinical.owner-row-034.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_034_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_034_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_034_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const RECOGNITION_CLAIM_ID =
  "claim.colonic-lipoma.characteristic-endoscopic-phenotype";
const ASYMPTOMATIC_MANAGEMENT_CLAIM_ID =
  "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up";
const MANAGEMENT_BOUNDARY_CLAIM_ID =
  "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway";
const RECOGNITION_CONCEPT_ID =
  "concept.colonic-lipoma.endoscopic-recognition";
const MANAGEMENT_CONCEPT_ID =
  "concept.colonic-lipoma.asymptomatic-management";

const RECOGNITION_EVIDENCE_CLAIM_IDS = [
  RECOGNITION_CLAIM_ID,
] as const;
const MANAGEMENT_EVIDENCE_CLAIM_IDS = [
  ASYMPTOMATIC_MANAGEMENT_CLAIM_ID,
  MANAGEMENT_BOUNDARY_CLAIM_ID,
] as const;
const ALL_EVIDENCE_CLAIM_IDS = [
  ...RECOGNITION_EVIDENCE_CLAIM_IDS,
  ...MANAGEMENT_EVIDENCE_CLAIM_IDS,
] as const;

const SOURCE_LABELS = [
  "ASGE guideline on gastrointestinal subepithelial lesions, 2017",
  "AGA clinical practice update on subepithelial lesions, 2022",
  "ESGE guideline on subepithelial lesions, 2022",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

const PRESENTATION_IDS = {
  directTypicalA: "presentation.colonic-lipoma.direct.typical-a",
  directTypicalB: "presentation.colonic-lipoma.direct.typical-b",
  diagnosisToPhenotype:
    "presentation.colonic-lipoma.recognition.diagnosis-to-phenotype",
  negativeSignBoundary:
    "presentation.colonic-lipoma.recognition.negative-sign-boundary",
  planToPatient:
    "presentation.colonic-lipoma.management.plan-to-patient",
  observationBoundary:
    "presentation.colonic-lipoma.management.observation-boundary",
} as const;

const QUESTION_IDS = {
  recognitionPatientToDiagnosisV1:
    "question.colonic-lipoma.recognition.patient-to-diagnosis.v1",
  recognitionPatientToDiagnosisV2:
    "question.colonic-lipoma.recognition.patient-to-diagnosis.v2",
  recognitionDiagnosisToPhenotypeV1:
    "question.colonic-lipoma.recognition.diagnosis-to-phenotype.v1",
  recognitionNegativeSignBoundaryV1:
    "question.colonic-lipoma.recognition.negative-sign-boundary.v1",
  managementPatientToPlanV1:
    "question.colonic-lipoma.management.patient-to-plan.v1",
  managementPatientToPlanV2:
    "question.colonic-lipoma.management.patient-to-plan.v2",
  managementPlanToPatientV1:
    "question.colonic-lipoma.management.plan-to-patient.v1",
  managementObservationBoundaryV1:
    "question.colonic-lipoma.management.observation-boundary.v1",
} as const;

export const ROW_034_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-034.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_034_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 34,
    sourceRecordKey: "owner-concept.sheet1.row-034",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    approvedScopeDecisionId:
      "decision.owner-row-034.two-concept-split.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [
    "concept.colonic-lipoma.endoscopic-recognition",
    "concept.colonic-lipoma.asymptomatic-management",
  ],
  approvedConceptTypes: ["diagnosis", "management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [...ALL_EVIDENCE_CLAIM_IDS],
  approvedReleasePointIds: ["release.l2.endoscopy"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "two_fsrs_identities",
    "level_2_endoscopy_release_point",
    "four_recognition_question_variants",
    "four_management_question_variants",
    "two_direct_two-decision_encounter_blueprints",
    "four_reverse-or-boundary_single-decision_blueprints",
    "single_select_answer_mode",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "positive-cushion-sign-recognition",
    "negative-cushion-sign-does-not-exclude-boundary",
    "clear-asymptomatic-observation-scope",
    "symptom-ulceration-bleeding-or-uncertainty-boundary",
  ],
  deferredElements: [
    "level_2_runtime_case_materialization",
    "endoscopy_service-and-movement-integration",
    "selection_of_resection-technique-for-symptomatic-lesions",
  ],
} as const;

export const ROW_034_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.asge.subepithelial-lesions.2017",
    title: "The role of endoscopy in subepithelial lesions of the GI tract",
    completeCitation:
      "Faulx AL, Kothari S, Acosta RD, et al. The role of endoscopy in subepithelial lesions of the GI tract. Gastrointest Endosc. 2017;85(6):1117-1132. doi:10.1016/j.gie.2017.02.022.",
    organizationOrJournal:
      "American Society for Gastrointestinal Endoscopy; Gastrointestinal Endoscopy",
    authors: [
      "Ashley L. Faulx",
      "Shivangi Kothari",
      "Ruben D. Acosta",
      "ASGE Standards of Practice Committee",
    ],
    publicationYear: 2017,
    doi: "10.1016/j.gie.2017.02.022",
    pmid: "28385194",
    officialUrl:
      "https://www.asge.org/home/resources/publications/guidelines/the-role-of-endoscopy-in-subepithelial-lesions-of-the-gi-tract",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    authorityAssessment:
      "ASGE specialty-society guidance supporting the characteristic positive endoscopic phenotype of gastrointestinal lipoma and the absence of lesion-directed follow-up or therapy for a clearly diagnosed asymptomatic lipoma.",
    usageRole: "evidence",
    evidenceClaimIds: [...ALL_EVIDENCE_CLAIM_IDS],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aga.subepithelial-lesions.2022",
    title:
      "AGA Clinical Practice Update on Management of Subepithelial Lesions Encountered During Routine Endoscopy: Expert Review",
    completeCitation:
      "Sharzehi K, Sethi A, Savides T. AGA Clinical Practice Update on Management of Subepithelial Lesions Encountered During Routine Endoscopy: Expert Review. Clin Gastroenterol Hepatol. 2022;20(11):2435-2443.e4. doi:10.1016/j.cgh.2022.05.054.",
    organizationOrJournal:
      "American Gastroenterological Association; Clinical Gastroenterology and Hepatology",
    authors: ["Kaveh Sharzehi", "Amrita Sethi", "Thomas Savides"],
    publicationYear: 2022,
    doi: "10.1016/j.cgh.2022.05.054",
    pmid: "35842117",
    officialUrl:
      "https://gastro.org/clinical-guidance/management-of-subepithelial-lesions-sel-encountered-during-routine-endoscopy/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    authorityAssessment:
      "AGA expert guidance supporting no further lesion-directed evaluation or surveillance for an endoscopically characteristic lipoma and identifying ulceration, bleeding, or symptoms as management-changing features.",
    usageRole: "evidence",
    evidenceClaimIds: [...MANAGEMENT_EVIDENCE_CLAIM_IDS],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.esge.subepithelial-lesions.2022",
    title:
      "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline",
    completeCitation:
      "Deprez PH, Moons LMG, O'Toole D, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    organizationOrJournal:
      "European Society of Gastrointestinal Endoscopy; Endoscopy",
    authors: [
      "Pierre H. Deprez",
      "Leon M. G. Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "Gloria Fernandez-Esparrach",
      "Marcin Polkowski",
      "Michael Vieth",
      "Ivan Borbath",
      "Tom G. Moreels",
      "Els Nieveen van Dijkum",
      "Jean-Yves Blay",
      "Jeanin E. van Hooft",
    ],
    publicationYear: 2022,
    doi: "10.1055/a-1751-5742",
    pmid: "35180797",
    officialUrl:
      "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    authorityAssessment:
      "ESGE specialty-society guidance independently supporting the characteristic positive phenotype and no dedicated surveillance when an asymptomatic lipoma diagnosis is clear.",
    usageRole: "cross_check",
    evidenceClaimIds: [...ALL_EVIDENCE_CLAIM_IDS],
  },
] satisfies ClinicalSource[];

export const ROW_034_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: RECOGNITION_CLAIM_ID,
    statement:
      "A smooth, yellowish, soft gastrointestinal subepithelial lesion that indents with gentle probing has an endoscopic phenotype strongly supportive of lipoma; absence of the cushion or pillow sign alone does not exclude lipoma.",
    sourceIds: [
      "source.asge.subepithelial-lesions.2017",
      "source.esge.subepithelial-lesions.2022",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The positive phenotype is supportive, while the maneuver has limited sensitivity. Atypical or indeterminate lesions require a separate diagnostic pathway.",
    applicablePopulation:
      "Adults with a colonic subepithelial lesion encountered during endoscopy.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ASYMPTOMATIC_MANAGEMENT_CLAIM_ID,
    statement:
      "A clearly characterized asymptomatic gastrointestinal lipoma does not require lipoma-directed treatment or dedicated surveillance.",
    sourceIds: [
      "source.asge.subepithelial-lesions.2017",
      "source.aga.subepithelial-lesions.2022",
      "source.esge.subepithelial-lesions.2022",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This applies only when the diagnosis is clear and the lesion is asymptomatic; ordinary colorectal screening or surveillance remains governed by the remainder of the examination and the patient's usual indications.",
    applicablePopulation:
      "Adults with a clearly characterized, incidental, asymptomatic colonic lipoma.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: MANAGEMENT_BOUNDARY_CLAIM_ID,
    statement:
      "Bleeding, ulceration, clinically significant symptoms, obstruction, or diagnostic uncertainty makes the asymptomatic observation-only lipoma pathway inapplicable and requires further individualized evaluation.",
    sourceIds: [
      "source.asge.subepithelial-lesions.2017",
      "source.aga.subepithelial-lesions.2022",
      "source.esge.subepithelial-lesions.2022",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This boundary does not select a particular endoscopic or surgical resection technique; that decision depends on lesion features, patient factors, and available expertise.",
    applicablePopulation:
      "Adults with a suspected or confirmed colonic lipoma whose symptoms, surface features, or diagnostic certainty differ from the approved incidental asymptomatic phenotype.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_034_CONCEPTS = [
  {
    id: RECOGNITION_CONCEPT_ID,
    displayName: "Endoscopic recognition of colonic lipoma",
    learningObjective:
      "Recognize the characteristic soft, yellowish, deformable subepithelial phenotype of a colonic lipoma while preserving the boundary that an absent cushion sign does not exclude it.",
    earliestFacilityStage: 2,
    conceptType: "diagnosis",
  },
  {
    id: MANAGEMENT_CONCEPT_ID,
    displayName: "Management of a clearly characterized asymptomatic colonic lipoma",
    learningObjective:
      "Choose no lipoma-directed treatment or dedicated surveillance for a clearly characterized asymptomatic colonic lipoma and recognize features that make that pathway inapplicable.",
    earliestFacilityStage: 2,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  releasePointId: "release.l2.endoscopy";
  requiredClinicalSetting: "outpatient_endoscopy";
  encounterRole:
    | "direct_two-decision"
    | "reverse_single-decision"
    | "boundary_single-decision";
  shuffleAnswers: true;
};

export const ROW_034_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.recognitionPatientToDiagnosisV1,
    presentationVariantId: PRESENTATION_IDS.directTypicalA,
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "direct_two-decision",
    stem:
      "During a routine colonoscopy, you find a smooth subepithelial lesion with normal overlying mucosa and a faint yellow hue. It feels soft, indents with gentle pressure from closed biopsy forceps, and then regains its shape. What is the most likely diagnosis?",
    answerChoices: [
      {
        id: "colonic_lipoma",
        label: "Colonic lipoma",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "adenomatous_polyp",
        label: "Adenomatous polyp",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved soft subepithelial cushion-sign phenotype.",
      },
      {
        id: "colonic_neuroendocrine_tumor",
        label: "Colonic neuroendocrine tumor",
        isCorrect: false,
        distractorRationale:
          "A neuroendocrine tumor is not identified by the approved combination of a soft yellowish lesion and positive cushion sign.",
      },
      {
        id: "gastrointestinal_stromal_tumor",
        label: "Gastrointestinal stromal tumor",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved soft deformable lipoma phenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A soft, yellowish subepithelial lesion that indents and rebounds demonstrates a characteristic cushion or pillow-sign phenotype that strongly supports colonic lipoma.",
    supportingEvidenceClaimIds: [...RECOGNITION_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.recognitionPatientToDiagnosisV2,
    presentationVariantId: PRESENTATION_IDS.directTypicalB,
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "direct_two-decision",
    stem:
      "An asymptomatic patient has a rounded colonic lesion beneath normal-appearing mucosa. Gentle probing produces a temporary indentation, and the lesion returns to its original contour when pressure is released. Which diagnosis best fits this endoscopic appearance?",
    answerChoices: [
      {
        id: "colonic_lipoma",
        label: "Colonic lipoma",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "colonic_adenocarcinoma",
        label: "Colonic adenocarcinoma",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved smooth, soft subepithelial phenotype.",
      },
      {
        id: "inflammatory_polyp",
        label: "Inflammatory polyp",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved deformable subepithelial phenotype.",
      },
      {
        id: "colonic_neuroendocrine_tumor",
        label: "Colonic neuroendocrine tumor",
        isCorrect: false,
        distractorRationale:
          "This is not the best match for the approved soft lesion with shape recovery after pressure.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The soft, deformable subepithelial appearance with shape recovery is most consistent with a lipoma.",
    supportingEvidenceClaimIds: [...RECOGNITION_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.recognitionDiagnosisToPhenotypeV1,
    presentationVariantId: PRESENTATION_IDS.diagnosisToPhenotype,
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "reverse_single-decision",
    stem:
      "Which colonoscopy description most strongly supports a colonic lipoma?",
    answerChoices: [
      {
        id: "soft_yellowish_cushion_sign",
        label:
          "A smooth, yellowish subepithelial lesion that indents with gentle pressure and regains its shape",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "irregular_ulcerated_mucosal_mass",
        label:
          "An irregular ulcerated mucosal mass that bleeds with contact",
        isCorrect: false,
        distractorRationale:
          "This is a concerning mucosal phenotype rather than the approved characteristic lipoma profile.",
      },
      {
        id: "firm_noncompressible_subepithelial_lesion",
        label:
          "A firm noncompressible subepithelial lesion with an atypical surface",
        isCorrect: false,
        distractorRationale:
          "This lacks the approved soft, deformable lipoma characteristics.",
      },
      {
        id: "blue_serpiginous_vascular_structure",
        label: "A blue, serpiginous vascular-appearing structure",
        isCorrect: false,
        distractorRationale:
          "This vascular-appearing profile is not the approved characteristic lipoma phenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The soft yellowish lesion with a positive cushion or pillow sign is the characteristic profile among these options.",
    supportingEvidenceClaimIds: [...RECOGNITION_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.recognitionNegativeSignBoundaryV1,
    presentationVariantId: PRESENTATION_IDS.negativeSignBoundary,
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "boundary_single-decision",
    stem:
      "A colonic subepithelial lesion does not indent when gently probed. Which interpretation is most accurate?",
    answerChoices: [
      {
        id: "negative_sign_not_exclusionary",
        label:
          "An absent cushion or pillow sign does not by itself exclude lipoma; the full lesion assessment must guide further evaluation",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "lipoma_excluded",
        label: "Lipoma has been excluded",
        isCorrect: false,
        distractorRationale:
          "The approved boundary is that the sign has limited sensitivity and its absence is not exclusionary.",
      },
      {
        id: "gist_confirmed",
        label: "Gastrointestinal stromal tumor has been confirmed",
        isCorrect: false,
        distractorRationale:
          "A negative cushion sign does not establish a different histologic diagnosis.",
      },
      {
        id: "immediate_colectomy",
        label: "The patient requires immediate colectomy",
        isCorrect: false,
        distractorRationale:
          "The maneuver alone neither establishes a diagnosis nor dictates an operation.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The cushion or pillow sign is highly supportive when present but has limited sensitivity. A negative maneuver is not diagnostic of another lesion and does not independently dictate treatment.",
    supportingEvidenceClaimIds: [...RECOGNITION_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.managementPatientToPlanV1,
    presentationVariantId: PRESENTATION_IDS.directTypicalA,
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "direct_two-decision",
    stem:
      "The lesion has a characteristic endoscopic appearance of a colonic lipoma. The patient has no pain, bleeding, ulceration, obstructive symptoms, or other concerning features. What is the most appropriate lipoma-directed plan?",
    answerChoices: [
      {
        id: "no_directed_treatment_or_surveillance",
        label:
          "No lipoma-directed removal or dedicated surveillance; continue ordinary follow-up based on the rest of the colonoscopy and the patient's usual indications",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "immediate_endoscopic_resection",
        label:
          "Immediate endoscopic resection solely because the lesion was found",
        isCorrect: false,
        distractorRationale:
          "The approved clear asymptomatic phenotype does not require removal solely because it was discovered.",
      },
      {
        id: "annual_colonoscopy_for_lipoma",
        label: "Annual colonoscopy solely to monitor the lipoma",
        isCorrect: false,
        distractorRationale:
          "Dedicated surveillance is not required solely for a clearly characterized asymptomatic lipoma.",
      },
      {
        id: "segmental_colectomy",
        label: "Segmental colectomy",
        isCorrect: false,
        distractorRationale:
          "An operation is not indicated solely for the approved clear asymptomatic phenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A clearly characterized asymptomatic lipoma does not require lesion-directed treatment or dedicated surveillance. Other findings and ordinary screening indications still determine routine follow-up.",
    supportingEvidenceClaimIds: [...MANAGEMENT_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.managementPatientToPlanV2,
    presentationVariantId: PRESENTATION_IDS.directTypicalB,
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "direct_two-decision",
    stem:
      "Colonoscopy demonstrates a clearly characterized colonic lipoma with normal overlying mucosa. The finding is incidental, and the patient has no symptoms attributable to it. What should you recommend for this lesion?",
    answerChoices: [
      {
        id: "no_lesion_specific_follow_up",
        label: "No lesion-specific treatment or surveillance",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "eus_with_tissue_acquisition",
        label:
          "Endoscopic ultrasound with tissue acquisition despite the characteristic appearance",
        isCorrect: false,
        distractorRationale:
          "The approved phenotype is already clearly characterized and does not require additional lesion-directed evaluation.",
      },
      {
        id: "remove_solely_because_found",
        label: "Endoscopic removal solely because the lesion was found",
        isCorrect: false,
        distractorRationale:
          "Discovery alone does not justify removal of the approved clear asymptomatic phenotype.",
      },
      {
        id: "elective_segmental_colectomy",
        label: "Elective segmental colectomy",
        isCorrect: false,
        distractorRationale:
          "Surgical resection is not indicated solely for the approved clear asymptomatic phenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Observation without lipoma-specific follow-up is appropriate when the diagnosis is clear and the lesion is asymptomatic.",
    supportingEvidenceClaimIds: [...MANAGEMENT_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.managementPlanToPatientV1,
    presentationVariantId: PRESENTATION_IDS.planToPatient,
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "reverse_single-decision",
    stem:
      "Which patient is the best candidate for no lipoma-directed treatment or dedicated surveillance?",
    answerChoices: [
      {
        id: "clear_asymptomatic_lipoma",
        label:
          "A patient with a clearly characterized, asymptomatic colonic lipoma and no bleeding, ulceration, obstruction, or pain",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "indeterminate_firm_lesion",
        label: "A patient with an indeterminate firm subepithelial lesion",
        isCorrect: false,
        distractorRationale:
          "Diagnostic uncertainty places this patient outside the approved observation-only lipoma pathway.",
      },
      {
        id: "ulcerated_bleeding_lesion",
        label: "A patient with an ulcerated lesion and recurrent bleeding",
        isCorrect: false,
        distractorRationale:
          "Ulceration and bleeding require further individualized evaluation rather than the approved asymptomatic observation pathway.",
      },
      {
        id: "obstructive_symptoms",
        label: "A patient with a lesion causing obstructive symptoms",
        isCorrect: false,
        distractorRationale:
          "Clinically significant symptoms place this patient outside the approved asymptomatic observation pathway.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The no-intervention pathway applies only when the diagnosis is clear and the lipoma is asymptomatic and uncomplicated.",
    supportingEvidenceClaimIds: [...MANAGEMENT_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.managementObservationBoundaryV1,
    presentationVariantId: PRESENTATION_IDS.observationBoundary,
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "outpatient_endoscopy",
    encounterRole: "boundary_single-decision",
    stem:
      "A previously incidental colonic lipoma is being managed without lesion-specific treatment. Which new finding most clearly makes that observation-only plan inappropriate?",
    answerChoices: [
      {
        id: "bleeding_ulcerated_lesion",
        label: "Bleeding from an ulcerated lesion",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "continued_absence_of_symptoms",
        label: "Continued absence of symptoms",
        isCorrect: false,
        distractorRationale:
          "Continued asymptomatic status does not leave the approved observation pathway.",
      },
      {
        id: "unchanged_smooth_surface",
        label: "An unchanged smooth surface",
        isCorrect: false,
        distractorRationale:
          "An unchanged nonconcerning surface does not independently require lesion-directed treatment.",
      },
      {
        id: "no_evidence_of_obstruction",
        label: "No evidence of obstruction",
        isCorrect: false,
        distractorRationale:
          "Absence of obstruction remains compatible with the approved asymptomatic pathway.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Bleeding or ulceration moves the lesion outside the approved asymptomatic observation pathway and warrants further evaluation for individualized treatment. This question does not prescribe a particular resection technique.",
    supportingEvidenceClaimIds: [...MANAGEMENT_EVIDENCE_CLAIM_IDS],
  },
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS = [
  {
    id: "blueprint.colonic-lipoma.direct.typical-a",
    presentationVariantId: PRESENTATION_IDS.directTypicalA,
    questionVariantIds: [
      QUESTION_IDS.recognitionPatientToDiagnosisV1,
      QUESTION_IDS.managementPatientToPlanV1,
    ],
  },
  {
    id: "blueprint.colonic-lipoma.direct.typical-b",
    presentationVariantId: PRESENTATION_IDS.directTypicalB,
    questionVariantIds: [
      QUESTION_IDS.recognitionPatientToDiagnosisV2,
      QUESTION_IDS.managementPatientToPlanV2,
    ],
  },
  {
    id: "blueprint.colonic-lipoma.reverse.diagnosis-to-phenotype",
    presentationVariantId: PRESENTATION_IDS.diagnosisToPhenotype,
    questionVariantIds: [
      QUESTION_IDS.recognitionDiagnosisToPhenotypeV1,
    ],
  },
  {
    id: "blueprint.colonic-lipoma.boundary.negative-sign",
    presentationVariantId: PRESENTATION_IDS.negativeSignBoundary,
    questionVariantIds: [
      QUESTION_IDS.recognitionNegativeSignBoundaryV1,
    ],
  },
  {
    id: "blueprint.colonic-lipoma.reverse.plan-to-patient",
    presentationVariantId: PRESENTATION_IDS.planToPatient,
    questionVariantIds: [QUESTION_IDS.managementPlanToPatientV1],
  },
  {
    id: "blueprint.colonic-lipoma.boundary.observation",
    presentationVariantId: PRESENTATION_IDS.observationBoundary,
    questionVariantIds: [
      QUESTION_IDS.managementObservationBoundaryV1,
    ],
  },
] as const;

export const ROW_034_APPROVED_BACKLOG = {
  conceptIds: ROW_034_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "foundational_endoscopy",
  releasePointId: "release.l2.endoscopy",
  earliestFacilityStage: 2,
  requiredClinicalSetting: "outpatient_endoscopy",
  currentGameEligibility: "partially_active_level_2_direct_blueprints_only",
  activeBlueprintIds: [
    "blueprint.colonic-lipoma.direct.typical-a",
    "blueprint.colonic-lipoma.direct.typical-b",
  ],
  excludedBlueprintIds: [
    "blueprint.colonic-lipoma.reverse.diagnosis-to-phenotype",
    "blueprint.colonic-lipoma.boundary.negative-sign",
    "blueprint.colonic-lipoma.reverse.plan-to-patient",
    "blueprint.colonic-lipoma.boundary.observation",
  ],
  deferredReason:
    "Reverse and options-only blueprints remain excluded by the Level 2 one-patient rule; both approved direct blueprints are mechanically split into their exact context and question sentences.",
  approvedForRuntime: true,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 2,
  directEncounterCount: 2,
  singleDecisionEncounterCount: 4,
  questionVariantIds: ROW_034_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
