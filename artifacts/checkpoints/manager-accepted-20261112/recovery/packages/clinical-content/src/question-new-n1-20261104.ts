import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, TestedConcept } from "./schema";
import { QUESTION_NEW_N1_ABDOMINAL } from "./question-new-n1-abdominal";
import { QUESTION_NEW_N1_BREAST } from "./question-new-n1-breast";
import { QUESTION_NEW_N1_PERIOPERATIVE } from "./question-new-n1-perioperative";
import { QUESTION_NEW_N1_CLAIMS, QUESTION_NEW_N1_CLAIM_PROVENANCE, QUESTION_NEW_N1_SOURCES } from "./question-new-n1-evidence-20261104";
import { QUESTION_NEW_N1_DRAFT, QUESTION_NEW_N1_VERSION } from "./question-new-n1-types";

export const QUESTION_NEW_N1_ITEMS = [...QUESTION_NEW_N1_ABDOMINAL, ...QUESTION_NEW_N1_BREAST, ...QUESTION_NEW_N1_PERIOPERATIVE];
export { QUESTION_NEW_N1_CLAIMS, QUESTION_NEW_N1_CLAIM_PROVENANCE, QUESTION_NEW_N1_SOURCES };

// Use the established name materializer so automatic arrivals, explicit admissions
// and frozen profiles all refer to the same generated named patient.
const patientTemplate = (text: string, patientName: string) => text.split(patientName).join("{patientName}");

function claimsFor(existingIds: readonly string[]): string[] {
  return existingIds.map(id => {
    const row = QUESTION_NEW_N1_CLAIM_PROVENANCE.find(item => item.inheritedClaimId === id);
    if (!row) throw new Error(`N1 has no inherited verification for ${id}`);
    return row.claimId;
  });
}
export const QUESTION_NEW_N1_AUTHORING_CONCEPTS = QUESTION_NEW_N1_ITEMS.map(item => ({
  ...QUESTION_NEW_N1_DRAFT,
  id: item.conceptId, displayName: item.displayName, learningObjective: item.learningObjective,
  conceptType: item.conceptType, earliestFacilityStage: item.level, educationalTier: item.educationalTier,
  acuity: item.acuity, requiredCapabilityIds: [] as string[],
  evidenceClaimIds: claimsFor(item.existingClaimIds), identityBasis: item.identityBasis,
  nearestExistingConceptIds: item.nearestExistingConceptIds, novelty: item.novelty,
}));
export const QUESTION_NEW_N1_TESTED_CONCEPTS: TestedConcept[] = QUESTION_NEW_N1_AUTHORING_CONCEPTS.map(item => ({
  id: item.id, displayName: item.displayName, learningObjective: item.learningObjective,
  conceptType: item.conceptType, earliestFacilityStage: item.earliestFacilityStage,
}));

export const QUESTION_NEW_N1_QUESTIONS: QuestionVariant[] = QUESTION_NEW_N1_ITEMS.map(item => ({
  ...QUESTION_NEW_N1_DRAFT, id: `question.n1.${item.slug}.v1`, conceptId: item.conceptId,
  stem: patientTemplate(item.stem, item.patientName),
  answerChoices: item.choices.map((choice, index) => ({ id: `choice.n1.${item.slug}.${choice.id}`,
    label: choice.label, isCorrect: index === 0, rationale: choice.rationale,
    distractorRationale: index === 0 ? null : choice.rationale })),
  explanation: item.explanation, ...(item.exhibit ? { exhibit: item.exhibit } : {}),
  supportingEvidenceClaimIds: claimsFor(item.existingClaimIds),
}));

export const QUESTION_NEW_N1_CASES: SyntheticClinicalCase[] = QUESTION_NEW_N1_ITEMS.map((item, index) => {
  const question = QUESTION_NEW_N1_QUESTIONS[index]!;
  const sourceIds = [...new Set(QUESTION_NEW_N1_CLAIMS.filter(claim => question.supportingEvidenceClaimIds.includes(claim.id)).flatMap(claim => claim.sourceIds))];
  const sourceLabels = sourceIds.map(id => QUESTION_NEW_N1_SOURCES.find(source => source.id === id)!.title);
  const demographics = { ageYears: item.age, sexLabel: item.sex };
  const presentation = patientTemplate(item.presentation, item.patientName);
  return {
    id: `case.n1.${item.slug}.v1`, displayName: item.displayName,
    patientPresentationVariantId: `presentation.n1.${item.slug}.v1`,
    // An adult clinic/outside-plan review lane; the exact numeric stage is independent.
    releasePointId: "release.l3.ambulatory_or_qi",
    patientDisplayName: item.patientName, prototypeDemographics: demographics,
    chiefComplaint: item.complaint, presentation,
    approvedInstantiationProfiles: [{ id: `profile.n1.${item.slug}.v1`, prototypeDemographics: demographics,
      chiefComplaint: item.complaint, presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: item.level,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic", sourceLabels,
    decisionNodes: [{
      id: `node.n1.${item.slug}.v1`, questionVariantId: question.id, primaryConceptId: item.conceptId,
      stem: question.stem,
      answerChoices: question.answerChoices.map(choice => ({ id: choice.id, label: choice.label,
        isCorrect: choice.isCorrect, rationale: choice.rationale!, serviceRequest: null })),
      shuffleAnswers: true, explanation: question.explanation,
      ...(item.exhibit ? { exhibit: item.exhibit } : {}), sourceLabels, resultGateAfter: null,
      terminalDispositions: question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: choice.id, kind: "no_terminal_outcome" as const,
        consequenceNarrative: "This draft ends with feedback on the selected plan; no clinical outcome is simulated.",
        clinicalRationale: choice.rationale!, sourceLabels,
      })),
    }], learningSummary: question.explanation,
  };
});

export const QUESTION_NEW_N1_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = QUESTION_NEW_N1_CASES.map((clinicalCase, index) => {
  const node = clinicalCase.decisionNodes[0]!, item = QUESTION_NEW_N1_ITEMS[index]!;
  return { caseId: clinicalCase.id, nodeId: node.id, questionVariantId: node.questionVariantId,
    classification: item.choices.some(choice => choice.timingProfileId)
      ? { kind: "test_choices", choices: node.answerChoices.map((choice, i) => ({ choiceId: choice.id, choiceLabel: choice.label,
        timing: item.choices[i]!.timingProfileId ? { kind: "test", timingProfileId: item.choices[i]!.timingProfileId! } : { kind: "no_test" } })) }
      : { kind: "no_test" } };
});

export const QUESTION_NEW_N1_CASE_REVIEWS = QUESTION_NEW_N1_CASES.map((clinicalCase, index) => ({
  ...QUESTION_NEW_N1_DRAFT, id: `review.n1.${QUESTION_NEW_N1_ITEMS[index]!.slug}.v1`, caseId: clinicalCase.id,
  educationalTier: QUESTION_NEW_N1_ITEMS[index]!.educationalTier,
  acuity: QUESTION_NEW_N1_ITEMS[index]!.acuity, earliestFacilityStage: clinicalCase.earliestFacilityStage,
  evidenceClaimIds: QUESTION_NEW_N1_QUESTIONS[index]!.supportingEvidenceClaimIds,
}));

export const QUESTION_NEW_N1_STATEMENT_MAPPINGS = QUESTION_NEW_N1_CASES.map((clinicalCase, index) => ({
  ...QUESTION_NEW_N1_DRAFT, caseId: clinicalCase.id, questionVariantId: clinicalCase.decisionNodes[0]!.questionVariantId,
  fields: ["presentation", "decisionNodes[0].stem", "decisionNodes[0].exhibit", "decisionNodes[0].explanation", "learningSummary",
    ...clinicalCase.decisionNodes[0]!.answerChoices.map((_, i) => `decisionNodes[0].answerChoices[${i}].rationale`)],
  evidenceClaimIds: QUESTION_NEW_N1_QUESTIONS[index]!.supportingEvidenceClaimIds,
  constructedDataBasis: "Fictional finite observations for application, not epidemiologic frequencies, diagnostic thresholds, clinical turnaround claims or demographic disease-selection weights.",
}));

export const QUESTION_NEW_N1_SOURCE_LINKS = QUESTION_NEW_N1_SOURCES.filter(source => source.officialUrl).map(source => ({
  ...QUESTION_NEW_N1_DRAFT, id: `link.n1.${source.id.replace(/^source\./, "")}`, sourceId: source.id,
  label: source.title, href: source.officialUrl!, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
}));

export const QUESTION_NEW_N1_BATCH_MANIFEST = {
  ...QUESTION_NEW_N1_DRAFT, id: "batch.question-new-n1.2026-11-04", contentVersion: QUESTION_NEW_N1_VERSION,
  conceptCount: QUESTION_NEW_N1_TESTED_CONCEPTS.length, caseCount: QUESTION_NEW_N1_CASES.length,
  variantCount: QUESTION_NEW_N1_QUESTIONS.length,
  newDecisionIdentityCount: QUESTION_NEW_N1_ITEMS.filter(item => item.identityBasis === "new_decision_construct").length,
  preservedPreviouslyUnadmittedIdentityCount: QUESTION_NEW_N1_ITEMS.filter(item => item.identityBasis === "preserved_unadmitted_identity").length,
  preservedPreviouslyUnadmittedIdentityIds: QUESTION_NEW_N1_ITEMS.filter(item => item.identityBasis === "preserved_unadmitted_identity").map(item => item.conceptId),
  assemblyAuthorization: "Owner task N0/N1 explicitly requests new draft clinic content and registry admission; original deferred hospital/presentation/question versions remain unadmitted.",
  requiredFacilityStages: [3, 4], requiredClinicalSetting: "clinic", requiredCapabilityIds: [] as string[],
  executionScope: "clinic_decisions_and_outside_hospital_record_review",
  serviceContracts: [] as string[], executableOrdersAdded: false,
  educationalIntent: "application_pending_independent_difficulty_and_clinical_review",
  clinicalApproval: false, pipelinePassed: false, publicReleaseAuthorized: false,
  sourceVerification: "Offline reuse of recorded atomic claims and source receipts; original check/access dates retained. No new retrieval or currentness claim.",
  reviewLimitations: [
    "Author self-check is not independent adversarial review, manager acceptance or clinical approval.",
    "Several preserved phyllodes category/target and mechanism items may need greater difficulty after independent review; no measured success-rate claim.",
    "Hospital-record questions do not install a hospital, ICU, blood bank, thoracic operation or a new clinical service.",
    "New testing choices have existing presentation timing profiles; no serviceRequest or result gate executes them.",
  ],
} as const;
