import packet from "../../../docs/research/question-topic-pancreas-acute-pancreatitis-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-pancreas-acute-pancreatitis-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring preview. This module admits nothing to the default release. */
export const ACUTE_PANCREATITIS_TOPIC_PACKET = packet;
export const ACUTE_PANCREATITIS_TOPIC_LEDGER = ledger;
export const ACUTE_PANCREATITIS_TOPIC_REVIEW_ROUND = packet.reviewRound;
export const ACUTE_PANCREATITIS_TOPIC_ITEM_STATUSES = packet.reviewRound.dispositions;
export const ACUTE_PANCREATITIS_TOPIC_PASS_FREEZE = packet.reviewRound.passFreeze;
export const ACUTE_PANCREATITIS_TOPIC_PARKED_ATTEMPTS = packet.reviewRound.parkedAttempts;
export const ACUTE_PANCREATITIS_TOPIC_COMPOSITION_PROPOSALS = packet.reviewRound.compositionProposals;
export const ACUTE_PANCREATITIS_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic.pancreas-acute-pancreatitis.2026-11-11.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const ACUTE_PANCREATITIS_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const ACUTE_PANCREATITIS_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const ACUTE_PANCREATITIS_TOPIC_SOURCE_LINKS = ACUTE_PANCREATITIS_TOPIC_SOURCES.map(source => ({
  sourceId: source.id,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

export interface AcutePancreatitisConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "existing_meaning_variant" | "new_meaning";
  educationalTier: number;
  evidenceClaimIds: string[];
  clinicalVersioningReason: string | null;
}

export const ACUTE_PANCREATITIS_TOPIC_CONCEPT_PROPOSALS: AcutePancreatitisConceptProposal[] =
  [...new Set(packet.proposedNodes.map(node => node.conceptId))].map(id => {
    const items = packet.proposedNodes.filter(node => node.conceptId === id);
    const first = items[0]!;
    const existing = packet.assignment.concepts.find(concept => concept.conceptId === id);
    return {
      ...ACUTE_PANCREATITIS_TOPIC_DRAFT,
      contentVersion: first.contentVersion,
      id,
      displayName: existing?.displayName ?? first.objective,
      learningObjective: existing?.learningObjective ?? first.objective,
      conceptType: first.conceptType as TestedConcept["conceptType"],
      earliestFacilityStage: 0,
      educationalTier: 2,
      previousConceptId: existing ? id : first.previousConceptId,
      conceptRelation: existing ? "existing_meaning_variant" : "new_meaning",
      evidenceClaimIds: [...new Set(items.flatMap(node => node.supportingEvidenceClaimIds))],
      clinicalVersioningReason: "clinicalVersioningReason" in first ? first.clinicalVersioningReason! : null,
    };
  });

export const ACUTE_PANCREATITIS_TOPIC_CONCEPTS = ACUTE_PANCREATITIS_TOPIC_CONCEPT_PROPOSALS.map(concept =>
  testedConceptSchema.parse({
    id: concept.id, displayName: concept.displayName, learningObjective: concept.learningObjective,
    conceptType: concept.conceptType, earliestFacilityStage: concept.earliestFacilityStage,
  }));

export const ACUTE_PANCREATITIS_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map(node => {
  const frozen = packet.reviewRound.passFreeze.find(item => item.questionVariantId === node.questionVariantId);
  if (frozen) return frozen.question as QuestionVariant;
  return {
  ...ACUTE_PANCREATITIS_TOPIC_DRAFT,
  contentVersion: node.contentVersion,
  id: node.questionVariantId,
  conceptId: node.conceptId,
  stem: node.task,
  answerChoices: node.choices.map(choice => ({
    id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
    rationale: choice.rationale, distractorRationale: choice.isCorrect ? null : choice.rationale,
  })),
  explanation: node.explanation,
  ...(node.exhibit ? { exhibit: caseExhibitSchema.parse(node.exhibit) } : {}),
  supportingEvidenceClaimIds: node.supportingEvidenceClaimIds,
  };
});

export const ACUTE_PANCREATITIS_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item, index) => {
  const frozen = packet.reviewRound.passFreeze.find(row => row.questionVariantId === item.questionVariantId);
  if (frozen) return decisionNodeSchema.parse(frozen.node);
  const question = ACUTE_PANCREATITIS_TOPIC_QUESTIONS[index]!;
  const sourceIds = new Set(ACUTE_PANCREATITIS_TOPIC_CLAIMS
    .filter(claim => question.supportingEvidenceClaimIds.includes(claim.id)).flatMap(claim => claim.sourceIds));
  const sourceLabels = ACUTE_PANCREATITIS_TOPIC_SOURCES.filter(source => sourceIds.has(source.id)).map(source => source.title);
  const clinicalCase = packet.caseDefinitions.find(row => row.id === item.caseId)!;
  const last = clinicalCase.nodeIds.at(-1) === item.nodeId;
  const key = question.answerChoices.find(choice => choice.isCorrect)!;
  return decisionNodeSchema.parse({
    id: item.nodeId, questionVariantId: question.id, primaryConceptId: question.conceptId,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    ...(question.exhibit ? { exhibit: question.exhibit } : {}),
    stem: question.stem,
    answerChoices: question.answerChoices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect, rationale: choice.rationale,
      serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels,
    resultGateAfter: null,
    terminalDispositions: last ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: `The chart-review note selected ${choice.label} rather than ${key.label}.`,
      clinicalRationale: choice.rationale!,
      sourceLabels,
    })) : [],
  });
});

export const ACUTE_PANCREATITIS_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseDefinitions.map(clinicalCase => {
  const nodes = clinicalCase.nodeIds.map(id => ACUTE_PANCREATITIS_TOPIC_NODES.find(node => node.id === id)!);
  return syntheticClinicalCaseSchema.parse({
    id: clinicalCase.id,
    displayName: `Clinic Chart Review: ${clinicalCase.name}`,
    patientPresentationVariantId: `presentation.topic.pancreas-acute-pancreatitis.${clinicalCase.slug}.v1`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: clinicalCase.name,
    prototypeDemographics: { ageYears: clinicalCase.age, sexLabel: clinicalCase.sex },
    chiefComplaint: clinicalCase.chiefComplaint,
    presentation: clinicalCase.presentation,
    tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: clinicalCase.facilityProgressionLevel,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...new Set(nodes.flatMap(node => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map(node => node.explanation).join(" "),
  });
});

export const ACUTE_PANCREATITIS_TOPIC_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = packet.proposedNodes.map(item =>
  answerChoiceTimingRegistryEntrySchema.parse({
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    classification: item.choices.some(choice => choice.timing.kind === "test") ? {
      kind: "test_choices",
      choices: item.choices.map(choice => ({ choiceId: choice.id, choiceLabel: choice.label, timing: choice.timing })),
    } : { kind: "no_test" },
  }));

/** Metadata describes a proposed investigation, never an order executed in this clinic. */
export const ACUTE_PANCREATITIS_TOPIC_ORDER_PROPOSALS = packet.proposedNodes.flatMap(item => item.choices
  .filter(choice => choice.timing.kind === "test")
  .map(choice => ({
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    choiceId: choice.id, choiceLabel: choice.label,
    timingProfileId: ("timingProfileId" in choice.timing ? choice.timing.timingProfileId : undefined)!,
    serviceRequest: null, resultGateAfter: null, execution: "archived_record_review_only" as const,
    sharedRegistryChangeRequiredForAdmission: true,
  })));

const passedIds = new Set(packet.reviewRound.passFreeze.map(item => item.questionVariantId));

export const ACUTE_PANCREATITIS_TOPIC_REVIEWED_QUESTIONS =
  ACUTE_PANCREATITIS_TOPIC_QUESTIONS.filter(question => passedIds.has(question.id));
export const ACUTE_PANCREATITIS_TOPIC_REVISED_QUESTIONS =
  ACUTE_PANCREATITIS_TOPIC_QUESTIONS.filter(question => !passedIds.has(question.id));
export const ACUTE_PANCREATITIS_TOPIC_REVIEWED_CASES = ACUTE_PANCREATITIS_TOPIC_CASES.filter(clinicalCase =>
  clinicalCase.decisionNodes.every(node => passedIds.has(node.questionVariantId)));
export const ACUTE_PANCREATITIS_TOPIC_REVISION_CANDIDATE_CASES = ACUTE_PANCREATITIS_TOPIC_CASES.filter(clinicalCase =>
  !clinicalCase.decisionNodes.some(node => passedIds.has(node.questionVariantId)));

/** Only exact independent PASS versions appear in this normal preview entry point. */
export const ACUTE_PANCREATITIS_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic clinic chart-review preview of two exact editorial PASS versions. Not clinically approved; Melissa Rowland's exact-version clinical review and manager acceptance remain pending. Revised candidates are separately exported for re-review.",
  concepts: ACUTE_PANCREATITIS_TOPIC_CONCEPTS.filter(concept => ACUTE_PANCREATITIS_TOPIC_REVIEWED_CASES
    .some(clinicalCase => clinicalCase.decisionNodes.some(node => node.primaryConceptId === concept.id))),
  cases: ACUTE_PANCREATITIS_TOPIC_REVIEWED_CASES,
});

export const ACUTE_PANCREATITIS_TOPIC_MANIFEST = {
  publicationStatus: "authoring_sidecar", clinicalApproval: false, pipelinePassed: false,
  managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false,
  reviewStatus: "needs_clinician_review",
  runtimeSetting: "clinic", facilityProgressionLevel: 0, educationalTier: 2,
  reviewOrderNotice: "key shown first for review only.",
  independentPassPreserved: 2, revisedAwaitingIndependentReview: 14, parked: 4,
  normalPreviewContainsOnlyExactPassItems: true,
  executableMultipartCases: 0,
} as const;
