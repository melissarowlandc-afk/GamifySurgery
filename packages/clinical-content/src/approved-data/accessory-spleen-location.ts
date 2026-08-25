import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";

export const ROW_058_CONTENT_VERSION = "clinical.owner-row-058.2026-08-21.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_058_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-21",
    contentVersion: ROW_058_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_058_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const CONCEPT_ID = "concept.accessory-spleen.common-location";
const LOCATION_CLAIM_ID = "claim.accessory-spleen.splenic-hilum-common-location";
const BOUNDARY_CLAIM_ID = "claim.accessory-spleen.location-teaching-boundary";

const SOURCE_LABELS = [
  "Vikse et al., accessory-spleen meta-analysis, 2017",
  "Clinically approved by Melissa Rowland, MD on 2026-08-21",
] as const;

export const ROW_058_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-058.2026-08-21",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-21",
  contentVersion: ROW_058_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (4).xlsx",
    sheetName: "Sheet1",
    sourceRow: 58,
    sourceRecordKey: "owner-concept.sheet1.row-058",
    exactApprovalConversationDate: "2026-08-21",
  },
  approvedConceptId: CONCEPT_ID,
  approvedQuestionVariantIds: [
    "question.accessory-spleen.preoperative-counseling.v1",
    "question.accessory-spleen.imaging-review.v1",
    "question.accessory-spleen.hospital-planning.v1",
    "question.accessory-spleen.reverse-location.v1",
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  decision: "approved",
} as const;

export const ROW_058_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.vikse.accessory-spleen-meta-analysis.2017",
    title:
      "The prevalence and morphometry of an accessory spleen: A meta-analysis and systematic review of 22,487 patients",
    completeCitation:
      "Vikse J, Sanna B, Henry BM, Taterra D, Sanna S, Pękala PA, Walocha JA, Tomaszewski KA. The prevalence and morphometry of an accessory spleen: A meta-analysis and systematic review of 22,487 patients. International Journal of Surgery. 2017;45:18-28. doi:10.1016/j.ijsu.2017.07.045.",
    organizationOrJournal: "International Journal of Surgery",
    authors: [
      "Jens Vikse",
      "Beatrice Sanna",
      "Brandon Michael Henry",
      "Dominik Taterra",
      "Silvia Sanna",
      "Przemysław A. Pękala",
      "Jerzy A. Walocha",
      "Krzysztof A. Tomaszewski",
    ],
    publicationYear: 2017,
    doi: "10.1016/j.ijsu.2017.07.045",
    pmid: "28716661",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/28716661/",
    accessedOn: "2026-08-21",
    sourceClass: "systematic_review",
    licenseLabel: "Copyrighted journal article; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written factual synthesis only; do not reproduce article prose, tables, figures, or pooled estimates.",
    authorityAssessment:
      "Systematic review and meta-analysis supporting the narrowly taught common anatomical location without importing a prevalence estimate.",
    usageRole: "evidence",
    evidenceClaimIds: [LOCATION_CLAIM_ID, BOUNDARY_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ncbi-bookshelf.accessory-spleen.2023",
    title: "Anatomy, Abdomen and Pelvis: Accessory Spleen",
    completeCitation:
      "Bajwa SA, Kasi A. Anatomy, Abdomen and Pelvis: Accessory Spleen. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. Last updated 2023 Jul 17. Bookshelf ID: NBK519040. PMID: 30085582.",
    organizationOrJournal: "StatPearls Publishing / NCBI Bookshelf",
    authors: ["Suhaib A. Bajwa", "Anup Kasi"],
    publicationYear: 2023,
    doi: null,
    pmid: "30085582",
    officialUrl: "https://www.ncbi.nlm.nih.gov/books/NBK519040/",
    accessedOn: "2026-08-21",
    sourceClass: "open_educational_resource",
    licenseLabel: "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use only independently written factual synthesis and attribution; do not reproduce source prose, tables, figures, or percentages.",
    authorityAssessment:
      "NCBI Bookshelf clinical reference independently cross-checking the narrow common-location teaching point and its operative-search boundary.",
    usageRole: "cross_check",
    evidenceClaimIds: [LOCATION_CLAIM_ID, BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_058_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: LOCATION_CLAIM_ID,
    statement:
      "The splenic hilum is the most common location represented for an accessory spleen in this approved anatomy concept.",
    sourceIds: [
      "source.vikse.accessory-spleen-meta-analysis.2017",
      "source.ncbi-bookshelf.accessory-spleen.2023",
    ],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "The package intentionally omits an exact prevalence estimate and does not turn this common-location teaching point into a complete operative search rule.",
    applicablePopulation:
      "Patients represented by the approved clinic discussions surrounding referral for hospital splenectomy.",
    lastCheckedOn: "2026-08-21",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: BOUNDARY_CLAIM_ID,
    statement:
      "A common accessory-spleen location does not establish that inspection of that one location alone is sufficient during splenectomy.",
    sourceIds: [
      "source.vikse.accessory-spleen-meta-analysis.2017",
      "source.ncbi-bookshelf.accessory-spleen.2023",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This concept does not address retained accessory tissue, recurrent hemolysis, completion splenectomy, reoperation, or any operative-management sequence.",
    applicablePopulation:
      "Learners applying the narrow location-recognition concept rather than an operative-management protocol.",
    lastCheckedOn: "2026-08-21",
  },
] satisfies EvidenceClaim[];

export const ROW_058_CONCEPT = {
  id: CONCEPT_ID,
  displayName: "Accessory spleen common location",
  learningObjective:
    "Recognize the splenic hilum as the most common location represented for an accessory spleen without treating one location as a complete splenectomy plan.",
  earliestFacilityStage: 0,
  conceptType: "anatomy",
} satisfies TestedConcept;

type VariantSpec = {
  caseId: string;
  presentationId: string;
  questionId: string;
  displayName: string;
  chiefComplaint: string;
  presentation: string;
  stem: string;
  choices: readonly (readonly [string, string, boolean])[];
};

const SPECS = [
  {
    caseId: "case.accessory-spleen.preoperative-counseling",
    presentationId: "presentation.accessory-spleen.preoperative-counseling",
    questionId: "question.accessory-spleen.preoperative-counseling.v1",
    displayName: "Clinic Patient: Accessory Spleen Counseling",
    chiefComplaint: "Preparing for a hospital splenectomy referral",
    presentation: "A patient with hereditary spherocytosis returns for preoperative counseling before referral for hospital splenectomy.",
    stem: "Which location is most commonly associated with an accessory spleen in this approved discussion?",
    choices: [["splenic_hilum", "Splenic hilum", true], ["pancreatic_tail", "Pancreatic tail", false], ["greater_omentum", "Greater omentum", false]],
  },
  {
    caseId: "case.accessory-spleen.imaging-review",
    presentationId: "presentation.accessory-spleen.imaging-review",
    questionId: "question.accessory-spleen.imaging-review.v1",
    displayName: "Clinic Patient: Accessory Spleen Imaging Review",
    chiefComplaint: "Reviewing imaging before a hospital splenectomy referral",
    presentation: "A patient returns to review preoperative imaging before a hospital splenectomy referral discussion.",
    stem: "Which imaging location best fits the approved accessory-spleen teaching point?",
    choices: [["adjacent_splenic_hilum", "Adjacent to the splenic hilum", true], ["near_hepatic_hilum", "Near the hepatic hilum", false], ["splenocolic_ligament", "Along the splenocolic ligament", false]],
  },
  {
    caseId: "case.accessory-spleen.hospital-planning",
    presentationId: "presentation.accessory-spleen.hospital-planning",
    questionId: "question.accessory-spleen.hospital-planning.v1",
    displayName: "Clinic Patient: Hospital Splenectomy Planning",
    chiefComplaint: "Discussing a hospital splenectomy referral",
    presentation: "A patient asks what anatomical finding will be discussed with the hospital team before a planned splenectomy referral.",
    stem: "Which location is most commonly associated with an accessory spleen in this approved planning discussion?",
    choices: [["splenic_hilum", "Splenic hilum", true], ["gastrosplenic_ligament", "Gastrosplenic ligament", false], ["greater_omentum", "Greater omentum", false]],
  },
  {
    caseId: "case.accessory-spleen.reverse-location",
    presentationId: "presentation.accessory-spleen.reverse-location",
    questionId: "question.accessory-spleen.reverse-location.v1",
    displayName: "Clinic Patient: Accessory Spleen Location",
    chiefComplaint: "Reviewing a nodule before hospital splenectomy referral",
    presentation: "A patient returns to discuss a small nodule noted during imaging review before hospital splenectomy referral.",
    stem: "Which nodule location best matches the approved accessory-spleen location concept?",
    choices: [["nodule_splenic_hilum", "Nodule at the splenic hilum", true], ["nodule_pancreatic_tail", "Nodule beside the pancreatic tail", false], ["nodule_greater_omentum", "Nodule within the greater omentum", false]],
  },
] as const satisfies readonly VariantSpec[];

const EXPLANATION =
  "The approved anatomy concept identifies the splenic hilum as the most common accessory-spleen location. It does not make one location a complete operative search or management plan.";

function questionVariant(spec: VariantSpec): QuestionVariant {
  return {
    ...CLINICIAN_APPROVAL,
    id: spec.questionId,
    conceptId: CONCEPT_ID,
    stem: spec.stem,
    answerChoices: spec.choices.map(([id, label, isCorrect]) => ({
      id,
      label,
      isCorrect,
      distractorRationale: isCorrect ? null : "This does not match the approved common-location anatomy concept.",
    })),
    explanation: EXPLANATION,
    supportingEvidenceClaimIds: [LOCATION_CLAIM_ID, BOUNDARY_CLAIM_ID],
  };
}

export const ROW_058_QUESTION_VARIANTS = SPECS.map(questionVariant);

export const ROW_058_CASES = SPECS.map((spec) => {
  const question = ROW_058_QUESTION_VARIANTS.find((variant) => variant.id === spec.questionId)!;
  const answers = question.answerChoices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    serviceRequest: null,
  }));
  return {
    id: spec.caseId,
    displayName: spec.displayName,
    patientPresentationVariantId: spec.presentationId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: spec.chiefComplaint,
    presentation: spec.presentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [{
      id: `node.${spec.questionId.replace(/^question\./, "")}`,
      questionVariantId: question.id,
      primaryConceptId: CONCEPT_ID,
      stem: question.stem,
      answerChoices: answers,
      shuffleAnswers: true,
      explanation: question.explanation,
      sourceLabels: [...SOURCE_LABELS],
      resultGateAfter: null,
      terminalDispositions: answers.filter((answer) => !answer.isCorrect).map((answer) => ({
        answerChoiceId: answer.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative: `The encounter recorded ${answer.label} instead of the approved common-location teaching point.`,
        clinicalRationale: EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
      })),
    }],
    learningSummary: EXPLANATION,
  };
}) satisfies SyntheticClinicalCase[];

export const ROW_058_APPROVED_ENCOUNTER_BLUEPRINTS = SPECS.map((spec) => ({
  id: `blueprint.${spec.questionId.replace(/^question\./, "")}`,
  presentationVariantId: spec.presentationId,
  questionVariantIds: [spec.questionId],
  releasePointId: "release.l0.clinic_evaluation",
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [],
  maximumScoredDecisions: 1,
  intermediateDecisionBehavior: "not_applicable",
}));
