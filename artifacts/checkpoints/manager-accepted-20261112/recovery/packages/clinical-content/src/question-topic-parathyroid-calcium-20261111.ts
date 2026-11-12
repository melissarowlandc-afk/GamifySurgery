import packet from "../../../docs/research/question-topic-parathyroid-calcium-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-parathyroid-calcium-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingClassificationSchema,
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

/** Explicit-import authoring sidecar. Importing this module changes no shipping registry. */
export const PARATHYROID_CALCIUM_TOPIC_PACKET = packet;
export const PARATHYROID_CALCIUM_TOPIC_LEDGER = ledger;
export const PARATHYROID_CALCIUM_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic.parathyroid-calcium.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const activeDefinitions = packet.proposedNodes.filter(item =>
  packet.reviewRound.statuses.find(status => status.currentQuestionVariantId === item.questionVariantId)?.status !== "parked");
const passedIds = new Set(packet.reviewRound.passFreeze.map(item => item.questionVariantId));
const frozenFor = (questionId: string) => packet.reviewRound.passFreeze.find(item => item.questionVariantId === questionId);
export const PARATHYROID_CALCIUM_TOPIC_PARKED_ATTEMPTS = packet.proposedNodes.filter(item =>
  !activeDefinitions.includes(item));

export const PARATHYROID_CALCIUM_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const PARATHYROID_CALCIUM_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const PARATHYROID_CALCIUM_TOPIC_SOURCE_LINKS = PARATHYROID_CALCIUM_TOPIC_SOURCES.map(source => ({
  sourceId: source.id,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

export interface ParathyroidCalciumConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "existing_meaning_variant" | "new_meaning";
  educationalTier: number;
  evidenceClaimIds: string[];
}

// Preserve the established types as well as the stable identities of reused concepts.
const existingTypes: Record<string, TestedConcept["conceptType"]> = {
  "concept.primary-hyperparathyroidism.biochemical-confirmation": "workup",
  "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment": "management",
  "concept.asymptomatic-phpt.three-site-dxa": "workup",
  "concept.asymptomatic-phpt.age-based-surgery": "management",
  "concept.fhh.biochemical-evaluation": "workup",
  "concept.fhh.recognition-and-confirmation": "diagnosis",
};

export const PARATHYROID_CALCIUM_TOPIC_CONCEPT_PROPOSALS: ParathyroidCalciumConceptProposal[] =
  [...new Set(activeDefinitions.map(node => node.conceptId))].map(id => {
    const items = activeDefinitions.filter(node => node.conceptId === id);
    const first = items[0]!;
    const existing = packet.assignment.concepts.find(concept => concept.conceptId === id);
    return {
      ...PARATHYROID_CALCIUM_TOPIC_DRAFT,
      id,
      displayName: existing?.displayName ?? first.objective,
      learningObjective: existing?.learningObjective ?? first.objective,
      conceptType: existingTypes[id] ?? first.conceptType as TestedConcept["conceptType"],
      earliestFacilityStage: 0,
      educationalTier: 2,
      previousConceptId: first.conceptIdentityDecision.previousConceptId,
      conceptRelation: first.conceptIdentityDecision.relation as ParathyroidCalciumConceptProposal["conceptRelation"],
      evidenceClaimIds: [...new Set(items.flatMap(node => node.supportingEvidenceClaimIds))],
    };
  });

export const PARATHYROID_CALCIUM_TOPIC_CONCEPTS = PARATHYROID_CALCIUM_TOPIC_CONCEPT_PROPOSALS.map(concept =>
  testedConceptSchema.parse({
    id: concept.id, displayName: concept.displayName, learningObjective: concept.learningObjective,
    conceptType: concept.conceptType, earliestFacilityStage: concept.earliestFacilityStage,
  }));

type DraftQuestion = QuestionVariant & { shuffleAnswers: true };

export const PARATHYROID_CALCIUM_TOPIC_QUESTIONS: DraftQuestion[] = activeDefinitions.map(node => {
  const frozen = frozenFor(node.questionVariantId);
  if (frozen) return frozen.question as unknown as DraftQuestion;
  return {
  ...PARATHYROID_CALCIUM_TOPIC_DRAFT,
  id: node.questionVariantId,
  conceptId: node.conceptId,
  stem: node.task,
  answerChoices: node.choices.map(choice => ({
    id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
    rationale: choice.rationale, distractorRationale: choice.isCorrect ? null : choice.rationale,
  })),
  shuffleAnswers: true,
  explanation: node.explanation,
  ...(node.exhibit ? { exhibit: caseExhibitSchema.parse(node.exhibit) } : {}),
  supportingEvidenceClaimIds: node.supportingEvidenceClaimIds,
  };
});

const labelsFor = (claimIds: readonly string[]) => {
  const sourceIds = new Set(PARATHYROID_CALCIUM_TOPIC_CLAIMS
    .filter(claim => claimIds.includes(claim.id)).flatMap(claim => claim.sourceIds));
  return PARATHYROID_CALCIUM_TOPIC_SOURCES.filter(source => sourceIds.has(source.id))
    .map(source => `${source.authors[0]} et al. (${source.publicationYear ?? "undated"}); ${source.doi ?? source.title}`);
};

export const PARATHYROID_CALCIUM_TOPIC_NODES: DecisionNode[] = activeDefinitions.map((item, index) => {
  const frozen = frozenFor(item.questionVariantId);
  if (frozen) return frozen.node as unknown as DecisionNode;
  const question = PARATHYROID_CALCIUM_TOPIC_QUESTIONS[index]!;
  const sourceLabels = labelsFor(question.supportingEvidenceClaimIds);
  const definition = packet.caseDefinitions.find(clinicalCase => clinicalCase.id === item.caseId)!;
  const last = definition.nodeIds.at(-1) === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId, questionVariantId: question.id, primaryConceptId: question.conceptId,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    ...(question.exhibit ? { exhibit: question.exhibit } : {}),
    stem: question.stem,
    answerChoices: question.answerChoices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
      rationale: choice.rationale, serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels,
    resultGateAfter: null,
    terminalDispositions: last ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The review recorded a different proposed plan; review the explanation.",
      clinicalRationale: choice.distractorRationale!,
      sourceLabels,
    })) : [],
  });
});

export const PARATHYROID_CALCIUM_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseDefinitions
  .filter(definition => definition.nodeIds.some(id => PARATHYROID_CALCIUM_TOPIC_NODES.some(node => node.id === id)))
  .map(definition => {
  const nodes = definition.nodeIds.map(id => PARATHYROID_CALCIUM_TOPIC_NODES.find(node => node.id === id)!);
  const frozen = frozenFor(nodes[0]!.questionVariantId);
  if (frozen) {
    const exactNode = frozen.node as unknown as DecisionNode;
    // N07/N13 were non-final nodes. Singleton composition needs final-choice
    // dispositions; duplicate reviewed rationale text, without revising it.
    const terminalNode: DecisionNode = exactNode.terminalDispositions.length ? exactNode : {
      ...exactNode,
      terminalDispositions: exactNode.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: choice.id, kind: "no_terminal_outcome" as const,
        consequenceNarrative: choice.rationale!, clinicalRationale: choice.rationale!,
        sourceLabels: exactNode.sourceLabels,
      })),
    };
    return {
      ...frozen.clinicalCase as unknown as SyntheticClinicalCase,
      decisionNodes: [terminalNode],
      learningSummary: frozen.node.explanation,
    };
  }
  const demographics = { ageYears: definition.age, sexLabel: definition.sex };
  return syntheticClinicalCaseSchema.parse({
    id: definition.id,
    displayName: `Clinic review: ${definition.name}`,
    patientPresentationVariantId: `presentation.topic.parathyroid-calcium.${definition.slug}.v1`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: definition.name,
    prototypeDemographics: demographics,
    chiefComplaint: definition.chiefComplaint,
    presentation: definition.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.parathyroid-calcium.${definition.slug}.${definition.sex.toLowerCase()}.${definition.age}`,
      prototypeDemographics: demographics,
      presentation: definition.presentation,
      chiefComplaint: definition.chiefComplaint,
    }],
    tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: definition.facilityProgressionLevel,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(nodes.flatMap(node => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map(node => node.explanation).join(" "),
  });
});

export const PARATHYROID_CALCIUM_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = activeDefinitions.map(item =>
  answerChoiceTimingRegistryEntrySchema.parse({
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    classification: item.choices.some(choice => choice.timing.kind === "test") ? {
      kind: "test_choices",
      choices: item.choices.map(choice => ({
        choiceId: choice.id,
        choiceLabel: choice.label,
        timing: answerChoiceTimingClassificationSchema.parse(choice.timing),
      })),
    } : { kind: "no_test" },
  }));

/** Exact estimate identities only. No service executes and no result is fabricated by a timer. */
export const PARATHYROID_CALCIUM_TOPIC_ORDER_PROPOSALS = activeDefinitions.flatMap(item => item.choices
  .filter(choice => choice.timing.kind === "test")
  .map(choice => ({
    id: `order-proposal.${choice.id.replace(/^choice\./, "")}`,
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    choiceId: choice.id, choiceLabel: choice.label,
    timing: answerChoiceTimingClassificationSchema.parse(choice.timing),
    execution: "presentation_only_estimate" as const,
    serviceRequest: null, resultGateAfter: null,
    sharedRegistryChangeRequiredForAdmission: true,
  })));

/** Passed wording only. Singleton projection changes no passed question/node/header. */
export const PARATHYROID_CALCIUM_TOPIC_PASS_PRESERVED_CASES = PARATHYROID_CALCIUM_TOPIC_CASES.filter(clinicalCase =>
  clinicalCase.decisionNodes.every(node => passedIds.has(node.questionVariantId)));
/** These standalone candidates still need independent editorial re-review and clinical approval. */
export const PARATHYROID_CALCIUM_TOPIC_REVISION_CANDIDATE_CASES = PARATHYROID_CALCIUM_TOPIC_CASES.filter(clinicalCase =>
  clinicalCase.decisionNodes.every(node => !passedIds.has(node.questionVariantId)));

export const PARATHYROID_CALCIUM_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic topic authoring preview, not clinically approved. Exact editorial PASS nodes only; named clinical review and manager acceptance remain pending.",
  concepts: PARATHYROID_CALCIUM_TOPIC_CONCEPTS.filter(concept => PARATHYROID_CALCIUM_TOPIC_PASS_PRESERVED_CASES
    .some(clinicalCase => clinicalCase.decisionNodes.some(node => node.primaryConceptId === concept.id))),
  cases: PARATHYROID_CALCIUM_TOPIC_PASS_PRESERVED_CASES,
});

export const PARATHYROID_CALCIUM_TOPIC_REVISION_CANDIDATE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic correction candidates, not clinically approved. Explicit author review only; independent re-review is pending. No candidate is an independent PASS.",
  concepts: PARATHYROID_CALCIUM_TOPIC_CONCEPTS,
  cases: PARATHYROID_CALCIUM_TOPIC_REVISION_CANDIDATE_CASES,
});

export const PARATHYROID_CALCIUM_TOPIC_MANIFEST = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  clinicalApproval: false, pipelinePassed: false, managerAccepted: false,
  publicReleaseAuthorized: false, executableOrdersAdded: false,
  reviewOrderNotice: "key shown first for review only.",
  runtimeSetting: "clinic", educationalTier: 2, facilityProgressionLevel: 0,
  assignedExactVariants: 27, audited: 27, keptExact: 1, rewritten: 6,
  retireAndReplaceProposed: 20, newQuestionVariants: 18,
  correctionRound: { audited: 24, passPreserved: 8, revised: 12, parked: 4, activeSingletonCases: 20,
    mixedMultipartCases: 0, independentRevisionPasses: 0 },
} as const;
