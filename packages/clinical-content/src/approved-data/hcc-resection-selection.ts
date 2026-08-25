import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";
import { ROW_029_CASES, ROW_029_CONCEPT } from "./hcc-milan-criteria";

export const ROW_092_CONTENT_VERSION = "clinical.owner-row-092.2026-08-21.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_092_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-21",
    contentVersion: ROW_092_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_092_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const CONCEPT_ID = "concept.hcc.compensated-cirrhosis-resection-selection";
const RESECTION_CLAIM_ID = "claim.hcc.resection.favorable-compensated-cirrhosis-profile";
const PORTAL_HYPERTENSION_BOUNDARY_CLAIM_ID = "claim.hcc.resection.portal-hypertension-selection-nuance";

const SOURCE_LABELS = [
  "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
  "Clinically approved by Melissa Rowland, MD on 2026-08-21",
] as const;

export const ROW_092_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-092.2026-08-21",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-21",
  contentVersion: ROW_092_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (4).xlsx",
    sheetName: "Sheet1",
    sourceRow: 92,
    sourceRecordKey: "owner-concept.sheet1.row-092",
    exactApprovalConversationDate: "2026-08-21",
  },
  approvedConceptId: CONCEPT_ID,
  approvedQuestionVariantIds: [
    "question.hcc.resection.direct-selection.v1",
    "question.hcc.resection.milan-trap.v1",
    "question.hcc.resection.candidate-profile.v1",
    "question.hcc.resection.future-liver-remnant.v1",
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  decision: "approved",
} as const;

export const ROW_092_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aasld.hcc-practice-guidance.2023",
    title:
      "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
    completeCitation:
      "Singal AG, Llovet JM, Yarchoan M, Mehta N, Heimbach JK, Dawson LA, Jou JH, Kulik LM, Agopian VG, Marrero JA, Mendiratta-Lala M, Brown DB, Rilling WS, Goyal L, Wei AC, Taddei TH. AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma. Hepatology. 2023;78(6):1922-1965. doi:10.1097/HEP.0000000000000466.",
    organizationOrJournal:
      "Hepatology; American Association for the Study of Liver Diseases",
    authors: [
      "Amit G. Singal", "Josep M. Llovet", "Mark Yarchoan", "Neil Mehta",
      "Julie K. Heimbach", "Laura A. Dawson", "Janice H. Jou", "Laura M. Kulik",
      "Vatche G. Agopian", "Jorge A. Marrero", "Mishal Mendiratta-Lala",
      "Daniel B. Brown", "William S. Rilling", "Lipika Goyal", "Alice C. Wei",
      "Tamar H. Taddei",
    ],
    publicationYear: 2023,
    doi: "10.1097/HEP.0000000000000466",
    pmid: "37199193",
    officialUrl: "https://doi.org/10.1097/HEP.0000000000000466",
    accessedOn: "2026-08-21",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce guideline prose, figures, tables, or algorithms.",
    authorityAssessment:
      "Current AASLD guidance supporting the narrowly approved favorable profile for specialist hepatic-resection evaluation.",
    usageRole: "evidence",
    evidenceClaimIds: [RESECTION_CLAIM_ID, PORTAL_HYPERTENSION_BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_092_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: RESECTION_CLAIM_ID,
    statement:
      "For the approved profile of a solitary HCC with preserved liver function, no clinically significant portal hypertension, adequate future liver remnant, and no macrovascular invasion or extrahepatic disease, hospital HPB-surgery referral for hepatic resection evaluation is the selected disposition.",
    sourceIds: ["source.aasld.hcc-practice-guidance.2023"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This is a deliberately favorable multiparametric profile, not a universal treatment rule for every solitary HCC or every person with Child-Pugh A cirrhosis. EASL 2025 metadata was not locally verifiable, so this package records the single-source limitation rather than inventing a second citation.",
    applicablePopulation:
      "Adults represented by the owner-approved compensated-cirrhosis profiles in this package.",
    lastCheckedOn: "2026-08-21",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: PORTAL_HYPERTENSION_BOUNDARY_CLAIM_ID,
    statement:
      "Clinically significant portal hypertension is one selection consideration in the approved favorable resection profile.",
    sourceIds: ["source.aasld.hcc-practice-guidance.2023"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This package does not teach clinically significant portal hypertension as an absolute contraindication to every limited hepatic resection, nor does it make preserved liver function alone sufficient for selection.",
    applicablePopulation:
      "Learners applying only the clear favorable-profile boundary in the approved cases.",
    lastCheckedOn: "2026-08-21",
  },
] satisfies EvidenceClaim[];

export const ROW_092_CONCEPT = {
  id: CONCEPT_ID,
  displayName: "HCC resection selection in compensated cirrhosis",
  learningObjective:
    "For the approved favorable compensated-cirrhosis profile, select hospital HPB-surgery referral for hepatic resection evaluation without treating Child-Pugh A status or Milan classification alone as sufficient.",
  earliestFacilityStage: 0,
  conceptType: "management",
} satisfies TestedConcept;

const RESECTION_CHOICES = [
  ["hpb_resection_referral", "Refer to hospital HPB surgery for hepatic resection evaluation", true],
  ["transplant_referral", "Refer to a transplant center for liver-transplantation evaluation", false],
  ["ablation_referral", "Refer to interventional radiology for thermal-ablation evaluation", false],
] as const;

const EXPLANATION =
  "This approved package teaches hospital HPB-surgery referral for hepatic resection evaluation only when the complete favorable profile is present. It does not make Child-Pugh A status, Milan classification, or any single finding sufficient by itself.";

type VariantSpec = {
  id: string;
  presentationVariantId: string;
  stem: string;
  choices: readonly (readonly [string, string, boolean])[];
};

const VARIANT_SPECS = [
  {
    id: "question.hcc.resection.direct-selection.v1",
    presentationVariantId: "presentation.hcc.resection.direct-selection",
    stem: "Which referral best fits this complete favorable profile?",
    choices: RESECTION_CHOICES,
  },
  {
    id: "question.hcc.resection.milan-trap.v1",
    presentationVariantId: "presentation.hcc.resection.milan-trap",
    stem: "Which conclusion best fits this complete favorable profile?",
    choices: [
      ["resection_supported", "Preserved hepatic reserve supports hepatic resection evaluation", true],
      ["milan_requires_transplant", "Milan eligibility means liver transplantation is required for this patient", false],
      ["solitary_requires_ablation", "Solitary disease means thermal ablation is required for this patient", false],
    ],
  },
  {
    id: "question.hcc.resection.candidate-profile.v1",
    presentationVariantId: "presentation.hcc.resection.candidate-profile",
    stem: "Which profile supports hepatic resection evaluation in this approved concept?",
    choices: [
      ["favorable_profile", "Preserved function, no clinically significant portal hypertension, and adequate future liver remnant", true],
      ["portal_hypertension_profile", "Preserved function, significant portal hypertension, and inadequate future liver remnant after evaluation", false],
      ["decompensated_profile", "Decompensated function, no distant disease, and inadequate future liver remnant after evaluation", false],
    ],
  },
  {
    id: "question.hcc.resection.future-liver-remnant.v1",
    presentationVariantId: "presentation.hcc.resection.future-liver-remnant",
    stem: "Which operative consideration is required in the approved favorable profile?",
    choices: [
      ["adequate_future_liver_remnant", "Adequate future liver remnant", true],
      ["normal_afp", "Normal serum AFP as the only operative consideration", false],
      ["milan_alone", "Milan eligibility alone as the only operative consideration", false],
    ],
  },
] as const satisfies readonly VariantSpec[];

function variant(spec: VariantSpec): QuestionVariant {
  return {
    ...CLINICIAN_APPROVAL,
    id: spec.id,
    conceptId: CONCEPT_ID,
    stem: spec.stem,
    answerChoices: spec.choices.map(([id, label, isCorrect]) => ({
      id,
      label,
      isCorrect,
      distractorRationale: isCorrect ? null : "This does not match the complete favorable resection-selection profile.",
    })),
    explanation: EXPLANATION,
    supportingEvidenceClaimIds: [RESECTION_CLAIM_ID, PORTAL_HYPERTENSION_BOUNDARY_CLAIM_ID],
  };
}

export const ROW_092_QUESTION_VARIANTS = VARIANT_SPECS.map(variant);
const VARIANT_BY_ID = new Map(ROW_092_QUESTION_VARIANTS.map((entry) => [entry.id, entry]));
const PRESENTATION_BY_QUESTION_ID = new Map<string, string>(
  VARIANT_SPECS.map((spec) => [spec.id, spec.presentationVariantId]),
);

function managementNode(questionId: string, nodeId: string) {
  const question = VARIANT_BY_ID.get(questionId)!;
  const choices = question.answerChoices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    serviceRequest: null,
  }));
  return {
    id: nodeId,
    questionVariantId: question.id,
    primaryConceptId: CONCEPT_ID,
    stem: question.stem,
    answerChoices: choices,
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: choices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome" as const,
      consequenceNarrative: `The encounter recorded ${choice.label} instead of the approved hospital HPB-surgery referral pathway.`,
      clinicalRationale: EXPLANATION,
      sourceLabels: [...SOURCE_LABELS],
    })),
  };
}

function standaloneCase(input: {
  id: string;
  displayName: string;
  presentation: string;
  questionId: string;
}): SyntheticClinicalCase {
  return {
    id: input.id,
    displayName: input.displayName,
    patientPresentationVariantId: PRESENTATION_BY_QUESTION_ID.get(input.questionId)!,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Reviewing an HCC treatment referral",
    presentation: input.presentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [managementNode(input.questionId, `node.${input.id.replace(/^case\./, "")}`)],
    learningSummary: EXPLANATION,
  };
}

const SOLITARY_WITHIN_MILAN_NODE = ROW_029_CASES.find(
  (clinicalCase) => clinicalCase.id === "case.hcc.milan.solitary-within",
)!.decisionNodes[0]!;

const COMBINED_MILAN_NODE = {
  ...SOLITARY_WITHIN_MILAN_NODE,
  id: "node.hcc.resection.combined.milan.v1",
  terminalDispositions: [],
};

export const ROW_092_CASES = [
  standaloneCase({
    id: "case.hcc.resection.direct-selection",
    displayName: "Clinic Patient: HCC Resection Referral",
    presentation: "A patient returns after staging of a solitary 4.0-cm peripheral HCC. Liver function is preserved, there is no clinically significant portal hypertension, future liver remnant is adequate, and there is no macrovascular invasion or extrahepatic disease.",
    questionId: "question.hcc.resection.direct-selection.v1",
  }),
  standaloneCase({
    id: "case.hcc.resection.milan-trap",
    displayName: "Clinic Patient: HCC Beyond a Simple Milan Rule",
    presentation: "A patient reviews a solitary 4.6-cm HCC with preserved liver function, no clinically significant portal hypertension, adequate future liver remnant, and no macrovascular invasion or extrahepatic disease.",
    questionId: "question.hcc.resection.milan-trap.v1",
  }),
  standaloneCase({
    id: "case.hcc.resection.candidate-profile",
    displayName: "Clinic Patient: HCC Resection Candidate Profile",
    presentation: "A patient with a solitary HCC returns to compare completed resection-candidate profiles after staging excludes macrovascular invasion and extrahepatic disease.",
    questionId: "question.hcc.resection.candidate-profile.v1",
  }),
  standaloneCase({
    id: "case.hcc.resection.future-liver-remnant",
    displayName: "Clinic Patient: HCC Operative Consideration",
    presentation: "A patient with a solitary HCC and preserved liver function returns after evaluation shows no clinically significant portal hypertension, no macrovascular invasion or extrahepatic disease, and a potentially adequate future liver remnant.",
    questionId: "question.hcc.resection.future-liver-remnant.v1",
  }),
  {
    id: "case.hcc.resection.combined-milan-to-resection",
    displayName: "Clinic Patient: HCC Milan Review and Resection Referral",
    patientPresentationVariantId: "presentation.hcc.resection.combined-milan-to-resection",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Reviewing staged HCC treatment options",
    presentation: "A patient with cirrhosis returns after staging shows one 4.8-cm HCC lesion without macrovascular invasion or extrahepatic disease. Liver function is preserved, there is no clinically significant portal hypertension, and future liver remnant is adequate.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      COMBINED_MILAN_NODE,
      managementNode("question.hcc.resection.direct-selection.v1", "node.hcc.resection.combined.direct-selection.v1"),
    ],
    learningSummary: "This combined encounter first applies the existing Milan evaluation concept and then the separate approved favorable-profile resection referral concept.",
  },
] satisfies SyntheticClinicalCase[];

export const ROW_092_APPROVED_ENCOUNTER_BLUEPRINTS = [
  ...ROW_092_CASES.slice(0, 4).map((clinicalCase) => ({
    id: `blueprint.${clinicalCase.id.replace(/^case\./, "")}`,
    presentationVariantId: clinicalCase.patientPresentationVariantId,
    questionVariantIds: [clinicalCase.decisionNodes[0]!.questionVariantId],
    releasePointId: "release.l0.clinic_evaluation",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  })),
  {
    id: "blueprint.hcc.resection.combined-milan-to-resection",
    presentationVariantId: "presentation.hcc.resection.combined-milan-to-resection",
    questionVariantIds: [
      SOLITARY_WITHIN_MILAN_NODE.questionVariantId,
      "question.hcc.resection.direct-selection.v1",
    ],
    releasePointId: "release.l0.clinic_evaluation",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    maximumScoredDecisions: 2,
    intermediateDecisionBehavior: "corrective_forward",
  },
] as const;
