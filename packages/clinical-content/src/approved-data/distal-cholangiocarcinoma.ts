import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";

export const ROW_111_CONTENT_VERSION = "clinical.owner-row-111.2026-08-21.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_111_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-21",
    contentVersion: ROW_111_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_111_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const WORKUP_CONCEPT_ID = "concept.distal-cholangiocarcinoma.operable-tissue-evaluation";
const MANAGEMENT_CONCEPT_ID = "concept.distal-cholangiocarcinoma.resection-selection";
const WORKUP_CLAIM_ID = "claim.distal-cholangiocarcinoma.operable-tissue-evaluation";
const RESECTION_CLAIM_ID = "claim.distal-cholangiocarcinoma.distal-whipple-referral";
const BOUNDARY_CLAIM_ID = "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries";

const SOURCE_LABELS = [
  "Rushbrook et al., BSG cholangiocarcinoma guideline, 2024",
  "NCI PDQ Bile Duct Cancer Treatment, updated 2025",
  "Clinically approved by Melissa Rowland, MD on 2026-08-21",
] as const;

export const ROW_111_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-111.2026-08-21",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-21",
  contentVersion: ROW_111_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (4).xlsx",
    sheetName: "Sheet1",
    sourceRow: 111,
    sourceRecordKey: "owner-concept.sheet1.row-111",
    exactApprovalConversationDate: "2026-08-21",
  },
  approvedConceptIds: [WORKUP_CONCEPT_ID, MANAGEMENT_CONCEPT_ID],
  approvedQuestionVariantIds: [
    "question.distal-cholangiocarcinoma.workup-a.v1",
    "question.distal-cholangiocarcinoma.workup-b.v1",
    "question.distal-cholangiocarcinoma.management-a.v1",
    "question.distal-cholangiocarcinoma.management-b.v1",
    "question.distal-cholangiocarcinoma.management-c.v1",
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation", "release.l2.endoscopy"],
  decision: "approved",
  multiDecisionAssessment: {
    status: "approved_two_decision_deferred_endoscopy_pathway",
    rationale:
      "The combined pathway scores tissue evaluation and then resection selection. Only the separately approved treatment-only and reverse-location management variants are active at Level 0.",
  },
} as const;

export const ROW_111_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.rushbrook.bsg-cholangiocarcinoma-guideline.2024",
    title:
      "British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma",
    completeCitation:
      "Rushbrook SM, Kendall TJ, Zen Y, et al. British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma. Gut. 2024;73:16-46. doi:10.1136/gutjnl-2023-330029.",
    organizationOrJournal: "Gut / British Society of Gastroenterology",
    authors: ["Simon M. Rushbrook", "Timothy J. Kendall", "Yoji Zen"],
    publicationYear: 2024,
    doi: "10.1136/gutjnl-2023-330029",
    pmid: null,
    officialUrl:
      "https://www.bsg.org.uk/getmedia/eeb6686a-02b1-4e7d-9298-3547c9fcb972/British-Society-of-Gastroenterology-guidelines-for-the-diagnosis-and-management-of-cholangiocarcinoma.pdf?ext=.pdf",
    accessedOn: "2026-08-21",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted guideline; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only independently written factual synthesis and citation. Do not reproduce guideline prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Current BSG guideline supporting the narrowly approved completed-imaging, combined endoscopic tissue-evaluation, distal-resection, and specialist-referral pathway.",
    usageRole: "evidence",
    evidenceClaimIds: [WORKUP_CLAIM_ID, RESECTION_CLAIM_ID, BOUNDARY_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nci-pdq.bile-duct-cancer-treatment.2025",
    title: "PDQ Bile Duct Cancer (Cholangiocarcinoma) Treatment",
    completeCitation:
      "PDQ Adult Treatment Editorial Board. PDQ Bile Duct Cancer (Cholangiocarcinoma) Treatment. Bethesda, MD: National Cancer Institute. Updated 2025-03-28. https://www.cancer.gov/types/liver/hp/bile-duct-treatment-pdq",
    organizationOrJournal: "National Cancer Institute",
    authors: ["PDQ Adult Treatment Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl: "https://www.cancer.gov/types/liver/hp/bile-duct-treatment-pdq",
    accessedOn: "2026-08-21",
    sourceClass: "government_guidance",
    licenseLabel: "U.S. government work; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy page prose, tables, figures, or treatment summaries.",
    authorityAssessment:
      "National Cancer Institute source independently cross-checking distal anatomy, imaging evaluation, and resectable distal disease treated with pancreaticoduodenectomy.",
    usageRole: "cross_check",
    evidenceClaimIds: [WORKUP_CLAIM_ID, RESECTION_CLAIM_ID, BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_111_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: WORKUP_CLAIM_ID,
    statement:
      "For the constrained approved profile of jaundice with completed cross-sectional imaging showing an operable distal malignant biliary obstruction, combined EUS-guided sampling and ERCP brushings is the selected tissue-evaluation plan.",
    sourceIds: ["source.rushbrook.bsg-cholangiocarcinoma-guideline.2024", "source.nci-pdq.bile-duct-cancer-treatment.2025"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "This is a constrained BSG pathway after completed CT and MRI/MRCP, not a universal inference for every biliary stricture. CA 19-9 is not diagnostic confirmation, and the eight-hour result requirement is editorial simulation rather than clinical evidence.",
    applicablePopulation:
      "Adults represented by the approved completed-imaging distal-obstruction profiles without metastatic disease.",
    lastCheckedOn: "2026-08-21",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: RESECTION_CLAIM_ID,
    statement:
      "For the approved fit patient with biopsy-confirmed resectable lower common-bile-duct cholangiocarcinoma and no distant disease, referral to hospital HPB surgery for pancreaticoduodenectomy is the selected operation pathway.",
    sourceIds: ["source.rushbrook.bsg-cholangiocarcinoma-guideline.2024", "source.nci-pdq.bile-duct-cancer-treatment.2025"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Distal pancreaticoduodenectomy referral is hospital-only and specialist-directed; this does not establish a universal operation for all cholangiocarcinoma locations or biliary strictures.",
    applicablePopulation:
      "Fit adults with biopsy-confirmed resectable distal common-bile-duct cholangiocarcinoma and no distant disease in the approved variants.",
    lastCheckedOn: "2026-08-21",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: BOUNDARY_CLAIM_ID,
    statement:
      "Distal common-bile-duct disease near the pancreatic head is the location represented by the approved Whipple-referral variant.",
    sourceIds: ["source.nci-pdq.bile-duct-cancer-treatment.2025"],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "The package does not extend this location-to-operation relationship to perihilar or intrahepatic disease.",
    applicablePopulation:
      "The completed, biopsy-confirmed distal-location profile used only in the approved reverse-location variant.",
    lastCheckedOn: "2026-08-21",
  },
] satisfies EvidenceClaim[];

export const ROW_111_CONCEPTS = [
  {
    id: WORKUP_CONCEPT_ID,
    displayName: "Operable distal cholangiocarcinoma tissue evaluation",
    learningObjective:
      "For the approved completed-imaging distal-obstruction profile, select the constrained combined endoscopic tissue-evaluation plan without treating CA 19-9 as confirmation.",
    earliestFacilityStage: 2,
    conceptType: "workup",
  },
  {
    id: MANAGEMENT_CONCEPT_ID,
    displayName: "Distal cholangiocarcinoma resection selection",
    learningObjective:
      "For the approved resectable distal common-bile-duct profile, select hospital HPB referral for pancreaticoduodenectomy and distinguish the represented distal location.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

const WORKUP_CHOICES = [
  ["eus_ercp_sampling", "EUS-guided sampling with ERCP brushings", true],
  ["percutaneous_biopsy", "Percutaneous transhepatic biopsy", false],
  ["pet_without_tissue", "PET-CT without tissue sampling", false],
] as const;
const WORKUP_B_CHOICES = [
  ["eus_ercp_sampling", "EUS-guided sampling with ERCP brushings", true],
  ["repeat_mrcp", "Repeat MRI/MRCP for interval change", false],
  ["repeat_ca19_9", "Repeat CA 19-9 without tissue sampling", false],
] as const;
const PROCEDURE_CHOICES = [
  ["whipple", "Whipple pancreaticoduodenectomy", true],
  ["hepaticojejunostomy", "Bile-duct excision with hepaticojejunostomy", false],
  ["left_hepatectomy", "Left hepatectomy with caudate resection", false],
] as const;

type ApprovedVariant = QuestionVariant & {
  presentationVariantId: string;
  releasePointId: "release.l0.clinic_evaluation" | "release.l2.endoscopy";
  requiredClinicalSetting: "clinic" | "outpatient_endoscopy";
  requiredCapabilityIds: readonly string[];
  shuffleAnswers: true;
  editorialSimulation?: { resultDelayMinutes: 480; basis: "editorial_simulation" };
  answerChoices: Array<
    QuestionVariant["answerChoices"][number] & {
      deferredService?: {
        serviceId: string;
        editorialSimulation: { resultDelayMinutes: 480; basis: "editorial_simulation" };
      };
    }
  >;
};

function questionVariant(input: {
  id: string;
  presentationVariantId: string;
  conceptId: string;
  stem: string;
  choices: readonly (readonly [string, string, boolean])[];
  deferred: boolean;
  deferredServiceIds?: readonly string[];
}): ApprovedVariant {
  return {
    ...CLINICIAN_APPROVAL,
    id: input.id,
    presentationVariantId: input.presentationVariantId,
    conceptId: input.conceptId,
    releasePointId: input.deferred ? "release.l2.endoscopy" : "release.l0.clinic_evaluation",
    requiredClinicalSetting: input.deferred ? "outpatient_endoscopy" : "clinic",
    requiredCapabilityIds: input.deferred ? ["capability.endoscopy"] : [],
    stem: input.stem,
    answerChoices: input.choices.map(([id, label, isCorrect], index) => ({
      id,
      label,
      isCorrect,
      distractorRationale: isCorrect ? null : "This does not match the approved constrained pathway.",
      ...(input.deferredServiceIds
        ? {
            deferredService: {
              serviceId: input.deferredServiceIds?.[index]!,
              editorialSimulation: { resultDelayMinutes: 480 as const, basis: "editorial_simulation" as const },
            },
          }
        : {}),
    })),
    shuffleAnswers: true,
    explanation: "This package applies only the approved completed-profile pathway and does not broaden it to every biliary stricture.",
    supportingEvidenceClaimIds: input.conceptId === WORKUP_CONCEPT_ID
      ? [WORKUP_CLAIM_ID, BOUNDARY_CLAIM_ID]
      : [RESECTION_CLAIM_ID, BOUNDARY_CLAIM_ID],
    ...(input.deferredServiceIds
      ? { editorialSimulation: { resultDelayMinutes: 480 as const, basis: "editorial_simulation" as const } }
      : {}),
  };
}

export const ROW_111_QUESTION_VARIANTS = [
  questionVariant({ id: "question.distal-cholangiocarcinoma.workup-a.v1", presentationVariantId: "presentation.distal-cholangiocarcinoma.deferred-pathway", conceptId: WORKUP_CONCEPT_ID, stem: "Which tissue-evaluation plan best fits this completed-imaging profile?", choices: WORKUP_CHOICES, deferred: true, deferredServiceIds: ["service.endoscopy.eus-ercp-sampling", "service.interventional-radiology.percutaneous-transhepatic-biopsy", "service.imaging.pet-ct"] }),
  questionVariant({ id: "question.distal-cholangiocarcinoma.workup-b.v1", presentationVariantId: "presentation.distal-cholangiocarcinoma.deferred-workup-only", conceptId: WORKUP_CONCEPT_ID, stem: "Which tissue-evaluation plan best fits this completed-imaging profile?", choices: WORKUP_B_CHOICES, deferred: true, deferredServiceIds: ["service.endoscopy.eus-ercp-sampling", "service.imaging.repeat-mri-mrcp", "service.laboratory.repeat-ca19-9"] }),
  questionVariant({ id: "question.distal-cholangiocarcinoma.management-a.v1", presentationVariantId: "presentation.distal-cholangiocarcinoma.deferred-pathway", conceptId: MANAGEMENT_CONCEPT_ID, stem: "Refer to hospital HPB surgery for which operation?", choices: PROCEDURE_CHOICES, deferred: true }),
  questionVariant({ id: "question.distal-cholangiocarcinoma.management-b.v1", presentationVariantId: "presentation.distal-cholangiocarcinoma.active-treatment", conceptId: MANAGEMENT_CONCEPT_ID, stem: "Refer to hospital HPB surgery for which operation?", choices: PROCEDURE_CHOICES, deferred: false }),
  questionVariant({ id: "question.distal-cholangiocarcinoma.management-c.v1", presentationVariantId: "presentation.distal-cholangiocarcinoma.active-location", conceptId: MANAGEMENT_CONCEPT_ID, stem: "Which tumor location explains this hospital HPB surgery referral for a Whipple procedure?", choices: [["distal_cbd", "Distal common bile duct near the pancreatic head", true], ["perihilar", "Perihilar duct confluence where the hepatic ducts meet", false], ["left_intrahepatic", "Left intrahepatic bile duct within the liver parenchyma", false]], deferred: false }),
] satisfies ApprovedVariant[];

const ACTIVE_VARIANT_BY_ID = new Map(ROW_111_QUESTION_VARIANTS.map((variant) => [variant.id, variant]));
function activeFinalCase(input: { id: string; displayName: string; chiefComplaint: string; presentation: string; questionId: string; summary: string }): SyntheticClinicalCase {
  const variant = ACTIVE_VARIANT_BY_ID.get(input.questionId)!;
  const choices = variant.answerChoices.map(
    ({ distractorRationale: _distractorRationale, ...choice }) => ({
      ...choice,
      serviceRequest: null,
    }),
  );
  return {
    id: input.id, displayName: input.displayName, patientPresentationVariantId: variant.presentationVariantId,
    releasePointId: "release.l0.clinic_evaluation", patientDisplayName: "Clinic Patient", chiefComplaint: input.chiefComplaint,
    presentation: input.presentation, tutorialEligible: false, routineEligible: true, earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.referral", sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [{ id: `node.${variant.id.replace(/^question\./, "")}`, questionVariantId: variant.id, primaryConceptId: MANAGEMENT_CONCEPT_ID,
      stem: variant.stem, answerChoices: choices, shuffleAnswers: true, explanation: variant.explanation, sourceLabels: [...SOURCE_LABELS], resultGateAfter: null,
      terminalDispositions: choices.filter((choice) => !choice.isCorrect).map((choice) => ({ answerChoiceId: choice.id, kind: "no_terminal_outcome" as const, consequenceNarrative: `The encounter recorded ${choice.label} instead of the approved hospital-referral operation pathway.`, clinicalRationale: variant.explanation, sourceLabels: [...SOURCE_LABELS] })),
    }], learningSummary: input.summary,
  };
}

export const ROW_111_CASES = [
  activeFinalCase({ id: "case.distal-cholangiocarcinoma.active-treatment", displayName: "Clinic Patient: Distal Cholangiocarcinoma Referral", chiefComplaint: "Discussing a confirmed lower bile-duct cancer", presentation: "A fit patient returns after biopsy confirmation of resectable lower common-bile-duct cholangiocarcinoma without distant disease.", questionId: "question.distal-cholangiocarcinoma.management-b.v1", summary: "This active clinic case uses hospital HPB referral for the approved distal resection pathway; it does not simulate hospital surgery." }),
  activeFinalCase({ id: "case.distal-cholangiocarcinoma.active-location", displayName: "Clinic Patient: Distal Cholangiocarcinoma Location", chiefComplaint: "Reviewing a hospital HPB surgery referral", presentation: "A patient with cholangiocarcinoma returns to discuss a hospital HPB surgery referral for a Whipple procedure.", questionId: "question.distal-cholangiocarcinoma.management-c.v1", summary: "The approved reverse-location case is limited to the distal common bile duct near the pancreatic head." }),
] satisfies SyntheticClinicalCase[];

export const ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS = [
  { id: "blueprint.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection", presentation: "One adult has progressive painless jaundice and pruritus. Completed CT and MRI/MRCP show an operable distal common-bile-duct stricture without metastatic disease; CA 19-9 may be elevated but is non-diagnostic.", questionVariantIds: ["question.distal-cholangiocarcinoma.workup-a.v1", "question.distal-cholangiocarcinoma.management-a.v1"], releasePointId: "release.l2.endoscopy", requiredClinicalSetting: "outpatient_endoscopy", requiredCapabilityIds: ["capability.endoscopy"], maximumScoredDecisions: 2, intermediateDecisionBehavior: "corrective_forward", editorialSimulation: { resultDelayMinutes: 480, basis: "editorial_simulation" }, resultUpdate: "Sampling supports distal cholangiocarcinoma and disease remains resectable." },
  { id: "blueprint.distal-cholangiocarcinoma.deferred-eus-ercp-workup-only", presentation: "An adult with jaundice has completed CT and MRI/MRCP showing potentially operable distal malignant biliary obstruction; the diagnosis is unconfirmed.", questionVariantIds: ["question.distal-cholangiocarcinoma.workup-b.v1"], releasePointId: "release.l2.endoscopy", requiredClinicalSetting: "outpatient_endoscopy", requiredCapabilityIds: ["capability.endoscopy"], maximumScoredDecisions: 1, intermediateDecisionBehavior: "not_applicable", editorialSimulation: { resultDelayMinutes: 480, basis: "editorial_simulation" } },
  { id: "blueprint.distal-cholangiocarcinoma.active-treatment", presentationVariantId: "presentation.distal-cholangiocarcinoma.active-treatment", questionVariantIds: ["question.distal-cholangiocarcinoma.management-b.v1"], releasePointId: "release.l0.clinic_evaluation", requiredClinicalSetting: "clinic", requiredCapabilityIds: [], maximumScoredDecisions: 1, intermediateDecisionBehavior: "not_applicable" },
  { id: "blueprint.distal-cholangiocarcinoma.active-location", presentationVariantId: "presentation.distal-cholangiocarcinoma.active-location", questionVariantIds: ["question.distal-cholangiocarcinoma.management-c.v1"], releasePointId: "release.l0.clinic_evaluation", requiredClinicalSetting: "clinic", requiredCapabilityIds: [], maximumScoredDecisions: 1, intermediateDecisionBehavior: "not_applicable" },
] as const;

export const ROW_111_APPROVED_BACKLOG = {
  conceptIds: ROW_111_CONCEPTS.map((concept) => concept.id),
  currentGameEligibility: "level_0_and_approved_level_2_pathway_active",
  activeCaseIds: ROW_111_CASES.map((clinicalCase) => clinicalCase.id),
  activeLevelTwoBlueprintIds: ["blueprint.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection"],
  deferredBlueprintIds: ["blueprint.distal-cholangiocarcinoma.deferred-eus-ercp-workup-only"],
  deferredReason: "The final-node timed workup-only variant remains excluded because no later scored node can truthfully display its result; the approved two-step pathway is active at Level 2.",
  editorialSimulationTiming: { resultDelayMinutes: 480, basis: "editorial_simulation" },
} as const;
