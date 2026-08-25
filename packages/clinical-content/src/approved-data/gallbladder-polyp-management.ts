import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";

export const ROW_119_CONTENT_VERSION = "clinical.owner-row-119.2026-08-21.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_119_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-21",
    contentVersion: ROW_119_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_119_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const CONCEPT_ID = "concept.gallbladder-polyp.initial-management-category";
const DISAGREEMENT_CLAIM_ID =
  "claim.gallbladder-polyp.european-sru-car-threshold-disagreement";
const CONCORDANT_PROFILE_CLAIM_ID =
  "claim.gallbladder-polyp.approved-concordant-management-categories";

const SOURCE_LABELS = [
  "Foley et al., European joint gallbladder-polyp guideline, 2022",
  "Kamaya et al., SRU gallbladder-polyp consensus, 2022",
  "Fung et al., CAR gallbladder-polyp update, 2026",
  "Clinically approved by Melissa Rowland, MD on 2026-08-21",
] as const;

export const ROW_119_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-119.2026-08-21",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-21",
  contentVersion: ROW_119_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (4).xlsx",
    sheetName: "Sheet1",
    sourceRow: 119,
    sourceRecordKey: "owner-concept.sheet1.row-119",
    exactApprovalConversationDate: "2026-08-21",
  },
  approvedConceptId: CONCEPT_ID,
  approvedConceptType: "management",
  approvedPresentationVariantIds: [
    "presentation.gallbladder-polyp.16mm",
    "presentation.gallbladder-polyp.12mm-wall-thickening",
    "presentation.gallbladder-polyp.8mm-thick-stalk",
    "presentation.gallbladder-polyp.4mm-thin-stalk",
    "presentation.gallbladder-polyp.select-surgical-profile",
    "presentation.gallbladder-polyp.select-surveillance-profile",
  ],
  approvedQuestionVariantIds: [
    "question.gallbladder-polyp.16mm.v1",
    "question.gallbladder-polyp.12mm-wall-thickening.v1",
    "question.gallbladder-polyp.8mm-thick-stalk.v1",
    "question.gallbladder-polyp.4mm-thin-stalk.v1",
    "question.gallbladder-polyp.select-surgical-profile.v1",
    "question.gallbladder-polyp.select-surveillance-profile.v1",
  ],
  approvedEvidenceClaimIds: [
    DISAGREEMENT_CLAIM_ID,
    CONCORDANT_PROFILE_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedScopeDecisionId:
    "decision.owner-row-119.initial-management-category.2026-08-21",
  multiDecisionAssessment: {
    status: "single_decision_preferred",
    rationale:
      "Each approved patient arrives with an ultrasound report. Ordering ultrasound, an exact surveillance schedule, and later intervention would be separate concepts.",
  },
  excludedElements: [
    "exact_surveillance_schedules",
    "older_workbook_hybrid_thresholds",
    "ethnicity_or_race_selection",
    "age_selection",
    "gallstones_or_cirrhosis_as_rules",
    "ultrasound_ordering",
    "multi_decision_encounter",
  ],
} as const;

export const ROW_119_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.foley.european-joint-gallbladder-polyp-guideline.2022",
    title:
      "Management and follow-up of gallbladder polyps: updated joint guidelines between ESGAR, EAES, EFISDS and ESGE",
    completeCitation:
      "Foley KG, Lahaye MJ, Thoeni RF, et al. Management and follow-up of gallbladder polyps: updated joint guidelines between ESGAR, EAES, EFISDS and ESGE. European Radiology. 2022;32:3358-3368. doi:10.1007/s00330-021-08384-w.",
    organizationOrJournal:
      "European Radiology / ESGAR, EAES, EFISDS, and ESGE",
    authors: ["Katherine G. Foley", "Marie J. Lahaye", "Richard F. Thoeni"],
    publicationYear: 2022,
    doi: "10.1007/s00330-021-08384-w",
    pmid: null,
    officialUrl: "https://link.springer.com/article/10.1007/s00330-021-08384-w",
    accessedOn: "2026-08-21",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Multisociety European guideline documenting its size-and-risk-factor framework, retained to preserve disagreement with the radiology-led frameworks.",
    usageRole: "evidence",
    evidenceClaimIds: [DISAGREEMENT_CLAIM_ID, CONCORDANT_PROFILE_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.kamaya.sru-gallbladder-polyp-consensus.2022",
    title:
      "Management of Incidentally Detected Gallbladder Polyps: SRU Consensus Conference Recommendations",
    completeCitation:
      "Kamaya A, Fung C, Szpakowski J-L, et al. Management of Incidentally Detected Gallbladder Polyps: SRU Consensus Conference Recommendations. Radiology. 2022;305(2):277-289. doi:10.1148/radiol.213079.",
    organizationOrJournal: "Radiology / Society of Radiologists in Ultrasound",
    authors: ["Aya Kamaya", "Christopher Fung", "Jean-Luc Szpakowski"],
    publicationYear: 2022,
    doi: "10.1148/radiol.213079",
    pmid: null,
    officialUrl: "https://pubs.rsna.org/doi/full/10.1148/radiol.213079",
    accessedOn: "2026-08-21",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted consensus; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Radiology consensus providing the morphology-led framework that differs from the European guideline on selected thresholds and surveillance details.",
    usageRole: "evidence",
    evidenceClaimIds: [DISAGREEMENT_CLAIM_ID, CONCORDANT_PROFILE_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.fung.car-gallbladder-polyp-update.2026",
    title:
      "Recommendations for the Management of Incidentally Detected Gallbladder Polyps: Update of the 2020 CAR Recommendations",
    completeCitation:
      "Fung CI, Kamaya A, Brahm GL, Bird JR, Kirkpatrick IDC. Recommendations for the Management of Incidentally Detected Gallbladder Polyps: Update of the 2020 CAR Recommendations. Canadian Association of Radiologists Journal. 2026;77(1):30-32. Online June 8, 2025. doi:10.1177/08465371251346728.",
    organizationOrJournal: "Canadian Association of Radiologists Journal",
    authors: [
      "Christopher I. Fung",
      "Aya Kamaya",
      "G. L. Brahm",
      "J. R. Bird",
      "I. D. C. Kirkpatrick",
    ],
    publicationYear: 2026,
    doi: "10.1177/08465371251346728",
    pmid: null,
    officialUrl:
      "https://car.ca/wp-content/uploads/2025/07/CAR-Recommendations-for-the-Management-of-Incidentally-Detected-Gallbladder-Polyps_2025.pdf",
    accessedOn: "2026-08-21",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms, and confirm noncommercial conditions before any reuse.",
    authorityAssessment:
      "Canadian professional-society update endorsing the SRU morphology-led approach and serving as an independent cross-check for the approved profile categories.",
    usageRole: "cross_check",
    evidenceClaimIds: [DISAGREEMENT_CLAIM_ID, CONCORDANT_PROFILE_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_119_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: DISAGREEMENT_CLAIM_ID,
    statement:
      "The 2022 European guideline recommends cholecystectomy for gallbladder polyps measuring at least 10 mm and for 6-9 mm polyps with its specified risk factors, whereas the SRU and CAR framework uses morphology and generally places surgical consultation at 15 mm or lower when adjacent focal wall thickening is indeterminate.",
    sourceIds: [
      "source.foley.european-joint-gallbladder-polyp-guideline.2022",
      "source.kamaya.sru-gallbladder-polyp-consensus.2022",
      "source.fung.car-gallbladder-polyp-update.2026",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The frameworks disagree on selected thresholds and surveillance details. This package does not teach a hybrid rule, an exact surveillance interval, or a disputed borderline profile.",
    applicablePopulation:
      "Patients with incidentally detected gallbladder polyps whose completed ultrasound reports match the explicitly approved profiles.",
    lastCheckedOn: "2026-08-21",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: CONCORDANT_PROFILE_CLAIM_ID,
    statement:
      "For the owner-approved profiles, the teaching categories are referral for cholecystectomy evaluation for a 16 mm polyp or a 12 mm polyp with adjacent focal wall thickening, ultrasound surveillance for an 8 mm thick-stalk polyp without focal wall thickening or PSC, and no further follow-up for a 4 mm thin-stalk polyp without suspicious features or PSC.",
    sourceIds: [
      "source.foley.european-joint-gallbladder-polyp-guideline.2022",
      "source.kamaya.sru-gallbladder-polyp-consensus.2022",
      "source.fung.car-gallbladder-polyp-update.2026",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This is a constrained profile-level teaching set, not a complete management algorithm; it excludes invasion, attributable symptoms, PSC where specified, and all unapproved risk modifiers or schedules.",
    applicablePopulation:
      "Patients represented by the six owner-approved completed-ultrasound profiles only.",
    lastCheckedOn: "2026-08-21",
  },
] satisfies EvidenceClaim[];

export const ROW_119_CONCEPT = {
  id: CONCEPT_ID,
  displayName: "Initial gallbladder-polyp management category",
  learningObjective:
    "Select the owner-approved initial management category for a completed incidental gallbladder-polyp ultrasound profile.",
  earliestFacilityStage: 0,
  conceptType: "management",
} satisfies TestedConcept;

type Choice = readonly [string, string, boolean];
type CaseSpec = {
  id: string;
  presentationVariantId: string;
  questionVariantId: string;
  displayName: string;
  chiefComplaint: string;
  presentation: string;
  stem: string;
  choices: readonly Choice[];
};

const CASE_SPECS = [
  {
    id: "case.gallbladder-polyp.16mm",
    presentationVariantId: "presentation.gallbladder-polyp.16mm",
    questionVariantId: "question.gallbladder-polyp.16mm.v1",
    displayName: "Clinic Patient: Incidental 16 mm Gallbladder Polyp",
    chiefComplaint: "Reviewing an incidental ultrasound finding",
    presentation:
      "A patient returns to review an ultrasound showing an incidental 16 mm gallbladder polyp without invasion.",
    stem: "Which initial management category fits this report?",
    choices: [
      ["refer_cholecystectomy", "Refer for cholecystectomy evaluation", true],
      ["ultrasound_surveillance", "Ultrasound surveillance for this patient", false],
      [
        "no_follow_up",
        "No further follow-up is needed after this completed ultrasound report",
        false,
      ],
    ],
  },
  {
    id: "case.gallbladder-polyp.12mm-wall-thickening",
    presentationVariantId: "presentation.gallbladder-polyp.12mm-wall-thickening",
    questionVariantId: "question.gallbladder-polyp.12mm-wall-thickening.v1",
    displayName: "Clinic Patient: Gallbladder Polyp With Wall Thickening",
    chiefComplaint: "Reviewing an incidental ultrasound finding",
    presentation:
      "A patient returns to review an ultrasound showing a 12 mm gallbladder polyp with 5 mm adjacent focal wall thickening and no invasion.",
    stem: "Which initial management category fits this report?",
    choices: [
      ["refer_cholecystectomy", "Refer for cholecystectomy evaluation", true],
      ["ultrasound_surveillance", "Ultrasound surveillance for this patient", false],
      ["no_follow_up", "No further follow-up after this report", false],
    ],
  },
  {
    id: "case.gallbladder-polyp.8mm-thick-stalk",
    presentationVariantId: "presentation.gallbladder-polyp.8mm-thick-stalk",
    questionVariantId: "question.gallbladder-polyp.8mm-thick-stalk.v1",
    displayName: "Clinic Patient: Thick-Stalk Gallbladder Polyp",
    chiefComplaint: "Reviewing an incidental ultrasound finding",
    presentation:
      "A patient returns to review an 8 mm pedunculated thick-stalk gallbladder polyp without focal wall thickening, PSC, or attributable symptoms.",
    stem: "Which initial management category fits this report?",
    choices: [
      ["ultrasound_surveillance", "Ultrasound surveillance for this patient", true],
      ["refer_cholecystectomy", "Refer for cholecystectomy evaluation", false],
      [
        "no_follow_up",
        "No further follow-up is needed after this completed ultrasound report",
        false,
      ],
    ],
  },
  {
    id: "case.gallbladder-polyp.4mm-thin-stalk",
    presentationVariantId: "presentation.gallbladder-polyp.4mm-thin-stalk",
    questionVariantId: "question.gallbladder-polyp.4mm-thin-stalk.v1",
    displayName: "Clinic Patient: Thin-Stalk Gallbladder Polyp",
    chiefComplaint: "Reviewing an incidental ultrasound finding",
    presentation:
      "A patient returns to review a 4 mm thin-stalk gallbladder polyp without suspicious wall change, PSC, or attributable symptoms.",
    stem: "Which initial management category fits this report?",
    choices: [
      ["no_follow_up", "No further follow-up after this report", true],
      ["refer_cholecystectomy", "Refer for cholecystectomy evaluation", false],
      ["ultrasound_surveillance", "Ultrasound surveillance for this patient", false],
    ],
  },
  {
    id: "case.gallbladder-polyp.select-surgical-profile",
    presentationVariantId: "presentation.gallbladder-polyp.select-surgical-profile",
    questionVariantId: "question.gallbladder-polyp.select-surgical-profile.v1",
    displayName: "Clinic Patient: Select Gallbladder Polyp Surgical Profile",
    chiefComplaint: "Comparing possible ultrasound reports",
    presentation:
      "A patient with an incidental gallbladder-polyp finding reviews possible completed ultrasound report profiles with the clinic.",
    stem: "Which report profile warrants cholecystectomy evaluation now?",
    choices: [
      ["seven_mm_wall_thickening", "7 mm polyp with 5 mm adjacent focal wall thickening", true],
      [
        "eight_mm_thick_stalk",
        "8 mm thick-stalk polyp without wall thickening on the completed ultrasound report",
        false,
      ],
      ["four_mm_thin_stalk", "4 mm thin-stalk polyp without suspicious features", false],
    ],
  },
  {
    id: "case.gallbladder-polyp.select-surveillance-profile",
    presentationVariantId: "presentation.gallbladder-polyp.select-surveillance-profile",
    questionVariantId: "question.gallbladder-polyp.select-surveillance-profile.v1",
    displayName: "Clinic Patient: Select Gallbladder Polyp Surveillance Profile",
    chiefComplaint: "Comparing possible ultrasound reports",
    presentation:
      "A patient with an incidental gallbladder-polyp finding reviews possible completed ultrasound report profiles with the clinic.",
    stem: "Which report profile warrants ultrasound surveillance?",
    choices: [
      ["eight_mm_thick_stalk", "8 mm thick-stalk polyp without wall thickening", true],
      ["seven_mm_wall_thickening", "7 mm polyp with 5 mm adjacent focal wall thickening", false],
      ["four_mm_thin_stalk", "4 mm thin-stalk polyp without suspicious features", false],
    ],
  },
] as const satisfies readonly CaseSpec[];

const EXPLANATION =
  "This package teaches only the owner-approved management category for the completed profile and does not supply an exact surveillance schedule or a hybrid threshold rule.";

function finalNode(spec: CaseSpec) {
  const answerChoices = spec.choices.map(([id, label, isCorrect]) => ({
    id,
    label,
    isCorrect,
    serviceRequest: null,
  }));
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
        consequenceNarrative: `The encounter recorded ${choice.label} instead of the approved management category.`,
        clinicalRationale: EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
      })),
  };
}

export const ROW_119_QUESTION_VARIANTS = CASE_SPECS.map((spec) => ({
  ...CLINICIAN_APPROVAL,
  id: spec.questionVariantId,
  conceptId: CONCEPT_ID,
  stem: spec.stem,
  answerChoices: spec.choices.map(([id, label, isCorrect]) => ({
    id,
    label,
    isCorrect,
    distractorRationale: isCorrect
      ? null
      : "This choice does not match the approved management category for the completed report.",
  })),
  explanation: EXPLANATION,
  supportingEvidenceClaimIds: [
    DISAGREEMENT_CLAIM_ID,
    CONCORDANT_PROFILE_CLAIM_ID,
  ],
})) satisfies QuestionVariant[];

export const ROW_119_CASES = CASE_SPECS.map((spec) => ({
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

export const ROW_119_APPROVED_ENCOUNTER_BLUEPRINTS = CASE_SPECS.map((spec) => ({
  id: `blueprint.${spec.questionVariantId.replace(/^question\./, "")}`,
  presentationVariantId: spec.presentationVariantId,
  questionVariantIds: [spec.questionVariantId],
  releasePointId: "release.l0.clinic_evaluation",
  earliestFacilityStage: 0,
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [],
}));
