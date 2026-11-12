import packet from "../../../docs/research/question-topic-head-neck-salivary-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-head-neck-salivary-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  validateSyntheticClinicalRelease,
  type DecisionNode,
  type SyntheticClinicalCase,
} from "./schema";

/** Explicit-import unapproved authoring sidecar; mutates no shared authority. */
export const HEAD_NECK_SALIVARY_TOPIC_PACKET = packet;
export const HEAD_NECK_SALIVARY_TOPIC_LEDGER = ledger;
export const HEAD_NECK_SALIVARY_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic.head-neck-salivary.2026-11-11.review2.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const HEAD_NECK_SALIVARY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const HEAD_NECK_SALIVARY_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const HEAD_NECK_SALIVARY_TOPIC_CONCEPT_PROPOSALS = packet.conceptProposals;
export const HEAD_NECK_SALIVARY_TOPIC_CONCEPTS = packet.conceptProposals.map(item =>
  testedConceptSchema.parse({
    id: item.id,
    displayName: item.displayName,
    learningObjective: item.learningObjective,
    conceptType: item.conceptType,
    earliestFacilityStage: item.earliestFacilityStage,
  }));

const statusFor = (code: string) => packet.reviewRound.statuses.find(item => item.code === code)!;
const scoredItems = packet.proposedNodes.filter(item => statusFor(item.code).status !== "parked");

/** Parked attempts are inspectable authoring data and have no scored bindings. */
export const HEAD_NECK_SALIVARY_TOPIC_PARKED_ITEMS = packet.proposedNodes
  .filter(item => statusFor(item.code).status === "parked");

export const HEAD_NECK_SALIVARY_TOPIC_QUESTIONS: Array<QuestionVariant & { shuffleAnswers: true }> =
  scoredItems.map(item => {
    const frozen = packet.reviewRound.passFreeze.find(record => record.code === item.code);
    if (frozen) return structuredClone(frozen.question) as QuestionVariant & { shuffleAnswers: true };
    return {
    ...HEAD_NECK_SALIVARY_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.questionVariantId,
    conceptId: item.conceptId,
    stem: item.task,
    answerChoices: item.choices.map(choice => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      distractorRationale: choice.isCorrect ? null : choice.rationale,
    })),
    shuffleAnswers: true,
    explanation: item.explanation,
    supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
    };
  });

function sourceLabelsFor(claimIds: string[]): string[] {
  const sourceIds = new Set(HEAD_NECK_SALIVARY_TOPIC_CLAIMS
    .filter(claim => claimIds.includes(claim.id)).flatMap(claim => claim.sourceIds));
  return HEAD_NECK_SALIVARY_TOPIC_SOURCES.filter(source => sourceIds.has(source.id))
    .map(source => `${source.authors[0]} et al. (${source.publicationYear ?? "undated"}): ${source.title}`);
}

export const HEAD_NECK_SALIVARY_TOPIC_NODES: DecisionNode[] = scoredItems.map((item, index) => {
  const frozen = packet.reviewRound.passFreeze.find(record => record.code === item.code);
  if (frozen) return decisionNodeSchema.parse(frozen.node);
  const question = HEAD_NECK_SALIVARY_TOPIC_QUESTIONS[index]!;
  const definition = packet.caseDefinitions.find(candidate => candidate.id === item.caseId)!;
  const final = definition.nodeCodes.at(-1) === item.code;
  const sourceLabels = sourceLabelsFor(item.supportingEvidenceClaimIds);
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    stem: question.stem,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    answerChoices: question.answerChoices.map(choice => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels,
    resultGateAfter: null,
    terminalDispositions: final ? item.choices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic records the proposed decision; no clinical outcome is simulated.",
      clinicalRationale: choice.rationale,
      sourceLabels,
    })) : [],
  });
});

/** A split final case needs neutral terminal metadata; reviewed clinical fields stay exact. */
function bindFinalNode(node: DecisionNode): DecisionNode {
  if (node.terminalDispositions.length > 0) return node;
  return decisionNodeSchema.parse({
    ...node,
    terminalDispositions: node.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic records the proposed decision; no clinical outcome is simulated.",
      clinicalRationale: choice.rationale!,
      sourceLabels: node.sourceLabels,
    })),
  });
}

export const HEAD_NECK_SALIVARY_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseDefinitions.map(definition => {
  const decisionNodes = definition.nodeCodes.map((code, index) => {
    const item = packet.proposedNodes.find(candidate => candidate.code === code)!;
    const node = HEAD_NECK_SALIVARY_TOPIC_NODES.find(candidate => candidate.id === item.nodeId)!;
    return index === definition.nodeCodes.length - 1 ? bindFinalNode(node) : node;
  });
  const demographics = { ageYears: definition.age, sexLabel: definition.sex };
  return syntheticClinicalCaseSchema.parse({
    id: definition.id,
    displayName: definition.chiefComplaint,
    patientPresentationVariantId: `presentation.topic.head-neck-salivary.${definition.slug}.v1`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: definition.name,
    prototypeDemographics: demographics,
    chiefComplaint: definition.chiefComplaint,
    presentation: definition.presentation,
    approvedInstantiationProfiles: [{
      id: definition.profiles[0]!.id,
      prototypeDemographics: demographics,
      chiefComplaint: definition.chiefComplaint,
      presentation: definition.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: definition.facilityProgressionLevel,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(decisionNodes.flatMap(node => node.sourceLabels))],
    decisionNodes,
    learningSummary: decisionNodes.map(node => node.explanation).join(" "),
  });
});

/** Every diagnostic option, including wrong choices, binds its exact label. */
export const HEAD_NECK_SALIVARY_TOPIC_TIMING_ENTRIES = packet.timingProposals.map(entry =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));

/** Existing domain record shape; estimates never execute an order in this sidecar. */
export const HEAD_NECK_SALIVARY_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals.map(entry => ({
  ...entry,
  disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
}));
export const HEAD_NECK_SALIVARY_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const HEAD_NECK_SALIVARY_TOPIC_AUTHOR_CHECKS = scoredItems.map(item => ({
  questionVariantId: item.questionVariantId,
  ...item.authorGate,
}));

const casesWithStatus = (status: string) => HEAD_NECK_SALIVARY_TOPIC_CASES.filter(clinicalCase =>
  clinicalCase.decisionNodes.every(node => packet.reviewRound.statuses.some(item =>
    item.currentQuestionVariantId === node.questionVariantId && item.status === status)));
const conceptsForCases = (cases: SyntheticClinicalCase[]) => {
  const ids = new Set(cases.flatMap(item => item.decisionNodes.map(node => node.primaryConceptId)));
  return HEAD_NECK_SALIVARY_TOPIC_CONCEPTS.filter(item => ids.has(item.id));
};

/** Only exact independent PASS items enter this explicit unapproved owner preview. */
export const HEAD_NECK_SALIVARY_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic unapproved AI-assisted clinic preview of two exact editorial PASS questions, not clinically approved. Melissa Rowland's clinical approval and manager integration remain pending; editorial PASS and automated tests are not clinical approval.",
  concepts: conceptsForCases(casesWithStatus("pass-preserved")),
  cases: casesWithStatus("pass-preserved"),
});

/** Schema-checkable review candidates; excluded from the PASS-only preview and shared release. */
export const HEAD_NECK_SALIVARY_TOPIC_REVISION_CANDIDATE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic unapproved author-only revised head/neck clinic candidates, not clinically approved. No current-version independent PASS or preview admission is claimed. All cases are self-contained and require exact review.",
  concepts: conceptsForCases(casesWithStatus("revised")),
  cases: casesWithStatus("revised"),
});

export const HEAD_NECK_SALIVARY_TOPIC_MANIFEST = {
  ...HEAD_NECK_SALIVARY_TOPIC_DRAFT,
  publicationStatus: "authoring_sidecar",
  pipelinePassed: false,
  clinicalApproval: false,
  managerAccepted: false,
  publicReleaseAuthorized: false,
  executableOrdersAdded: false,
  previewPolicy: "Only pass-preserved cases; revised candidates and parked attempts are excluded.",
  reviewOrderNotice: "key shown first for review only.",
  runtimeSetting: "clinic",
  counts: packet.counts,
  integration: packet.managerIntegration,
} as const;
