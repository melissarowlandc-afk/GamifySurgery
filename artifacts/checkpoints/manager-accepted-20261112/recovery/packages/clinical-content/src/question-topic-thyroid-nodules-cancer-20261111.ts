import packet from "../../../docs/research/question-topic-thyroid-nodules-cancer-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-thyroid-nodules-cancer-20261111.json";
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

/** Explicit-import, unapproved authoring sidecar. No shared registry is mutated. */
export const THYROID_NODULES_CANCER_TOPIC_PACKET = packet;
export const THYROID_NODULES_CANCER_TOPIC_LEDGER = ledger;
export const THYROID_NODULES_CANCER_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic.thyroid-nodules-cancer.2026-11-11.review2.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const parkedCodes = new Set(packet.reviewRound.statuses.filter(item => item.status === "parked").map(item => item.code));
const activeDefinitions = packet.proposedNodes.filter(item => !parkedCodes.has(item.code));
const frozenFor = (code: string) => packet.reviewRound.passFreeze.find(item => item.code === code);

/** Corrected holds are author-only evidence, excluded from every runtime candidate export. */
export const THYROID_NODULES_CANCER_TOPIC_PARKED_ATTEMPTS =
  packet.proposedNodes.filter(item => parkedCodes.has(item.code));

export const THYROID_NODULES_CANCER_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const THYROID_NODULES_CANCER_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const THYROID_NODULES_CANCER_TOPIC_SOURCE_LINKS = THYROID_NODULES_CANCER_TOPIC_SOURCES.map(source => ({
  sourceId: source.id,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

export interface ThyroidConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "existing_meaning_variant" | "new_meaning";
  evidenceClaimIds: string[];
  educationalTier: number;
}

export const THYROID_NODULES_CANCER_TOPIC_CONCEPT_PROPOSALS: ThyroidConceptProposal[] =
  [...new Set(activeDefinitions.map(item => item.conceptId))].map(id => {
    const items = activeDefinitions.filter(item => item.conceptId === id);
    const first = items[0]!;
    const old = packet.assignment.concepts.find(item => item.conceptId === id);
    return {
      ...THYROID_NODULES_CANCER_TOPIC_DRAFT,
      id,
      displayName: old?.displayName ?? first.objective,
      learningObjective: old?.learningObjective ?? first.objective,
      conceptType: first.conceptType as TestedConcept["conceptType"],
      earliestFacilityStage: 0,
      educationalTier: 2,
      previousConceptId: first.conceptIdentityDecision.previousConceptId,
      conceptRelation: first.conceptIdentityDecision.relation as ThyroidConceptProposal["conceptRelation"],
      evidenceClaimIds: [...new Set(items.flatMap(item => item.supportingEvidenceClaimIds))],
    };
  });

export const THYROID_NODULES_CANCER_TOPIC_CONCEPTS = THYROID_NODULES_CANCER_TOPIC_CONCEPT_PROPOSALS.map(item =>
  testedConceptSchema.parse({
    id: item.id, displayName: item.displayName, learningObjective: item.learningObjective,
    conceptType: item.conceptType, earliestFacilityStage: item.earliestFacilityStage,
  }));

export const THYROID_NODULES_CANCER_TOPIC_QUESTIONS: Array<QuestionVariant & { shuffleAnswers: true }> =
  activeDefinitions.map((item): QuestionVariant & { shuffleAnswers: true } => {
    const frozen = frozenFor(item.code);
    if (frozen) return frozen.question as QuestionVariant & { shuffleAnswers: true };
    return {
    ...THYROID_NODULES_CANCER_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.questionVariantId,
    conceptId: item.conceptId,
    stem: item.task,
    answerChoices: item.choices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      distractorRationale: choice.isCorrect ? null : choice.rationale,
    })),
    shuffleAnswers: true,
    explanation: item.explanation,
    supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
    ...(item.exhibit ? { exhibit: caseExhibitSchema.parse(item.exhibit) } : {}),
  };
  });

const sourceLabelsFor = (claimIds: string[]) => {
  const sourceIds = new Set(THYROID_NODULES_CANCER_TOPIC_CLAIMS
    .filter(item => claimIds.includes(item.id)).flatMap(item => item.sourceIds));
  return THYROID_NODULES_CANCER_TOPIC_SOURCES.filter(item => sourceIds.has(item.id))
    .map(item => `${item.authors[0]} et al. (${item.publicationYear ?? "undated"}); ${item.doi ?? item.title}`);
};

export const THYROID_NODULES_CANCER_TOPIC_NODES: DecisionNode[] = activeDefinitions.map((item, index) => {
  const frozen = frozenFor(item.code);
  if (frozen) return decisionNodeSchema.parse(frozen.node);
  const question = THYROID_NODULES_CANCER_TOPIC_QUESTIONS[index]!;
  const sourceLabels = sourceLabelsFor(item.supportingEvidenceClaimIds);
  const definition = packet.caseDefinitions.find(candidate => candidate.id === item.caseId)!;
  const final = definition.nodeCodes.at(-1) === item.code;
  return decisionNodeSchema.parse({
    id: item.nodeId, questionVariantId: question.id, primaryConceptId: question.conceptId,
    stem: question.stem,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    ...(question.exhibit ? { exhibit: question.exhibit } : {}),
    answerChoices: question.answerChoices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
      rationale: choice.rationale, serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation, sourceLabels,
    resultGateAfter: null,
    terminalDispositions: final ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic review records the proposed decision; review the clinical explanation.",
      clinicalRationale: choice.distractorRationale!, sourceLabels,
    })) : [],
  });
});

export const THYROID_NODULES_CANCER_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseDefinitions.map(definition => {
  const nodes = definition.nodeCodes.map(code => {
    const item = packet.proposedNodes.find(candidate => candidate.code === code)!;
    return THYROID_NODULES_CANCER_TOPIC_NODES.find(node => node.id === item.nodeId)!;
  });
  // Only schema-required terminal bindings change when a reviewed nonfinal node becomes final.
  // Repeat existing feedback exactly: no new patient, question, option or explanation prose.
  const final = nodes.at(-1)!;
  if (final.terminalDispositions.length === 0) {
    nodes[nodes.length - 1] = decisionNodeSchema.parse({
      ...final,
      terminalDispositions: final.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: choice.id, kind: "no_terminal_outcome",
        consequenceNarrative: choice.rationale, clinicalRationale: choice.rationale,
        sourceLabels: final.sourceLabels,
      })),
    });
  }
  const frozenCase = packet.reviewRound.beforeCompiledCases.find(candidate => candidate.id === definition.id);
  if (frozenCase) return syntheticClinicalCaseSchema.parse({
    ...frozenCase,
    decisionNodes: nodes,
    sourceLabels: [...new Set(nodes.flatMap(node => node.sourceLabels))],
    learningSummary: nodes.map(node => node.explanation).join(" "),
  });
  const demographics = { ageYears: definition.age, sexLabel: definition.sex };
  return syntheticClinicalCaseSchema.parse({
    id: definition.id,
    displayName: `Clinic review: ${definition.name}`,
    patientPresentationVariantId: `presentation.topic.thyroid-nodules-cancer.${definition.slug}.v1`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: definition.name,
    prototypeDemographics: demographics,
    chiefComplaint: definition.chiefComplaint,
    presentation: definition.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.thyroid-nodules-cancer.${definition.slug}.v1`,
      prototypeDemographics: demographics,
      presentation: definition.presentation,
      chiefComplaint: definition.chiefComplaint,
    }],
    tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: definition.facilityProgressionLevel,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(nodes.flatMap(node => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map(node => node.explanation).join(" "),
  });
});

export const THYROID_NODULES_CANCER_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  activeDefinitions.map(item => {
    const frozen = frozenFor(item.code);
    if (frozen) return answerChoiceTimingRegistryEntrySchema.parse(frozen.timing);
    return answerChoiceTimingRegistryEntrySchema.parse({
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    classification: item.choices.some(choice => choice.timing.kind === "test") ? {
      kind: "test_choices",
      choices: item.choices.map(choice => ({
        choiceId: choice.id, choiceLabel: choice.label,
        timing: answerChoiceTimingClassificationSchema.parse(choice.timing),
      })),
    } : { kind: "no_test" },
  });
  });

/** Estimates are proposals for exact labels, never executable clinical orders. */
export const THYROID_NODULES_CANCER_TOPIC_ORDER_PROPOSALS = activeDefinitions.flatMap(item =>
  item.choices.filter(choice => choice.timing.kind === "test").map(choice => ({
    id: `order-proposal.${choice.id}`,
    caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
    choiceId: choice.id, choiceLabel: choice.label,
    timing: answerChoiceTimingClassificationSchema.parse(choice.timing),
    execution: "presentation_only_estimate" as const,
    serviceRequest: null, resultGateAfter: null,
    sharedRegistryChangeRequiredForAdmission: true,
  })));

/** Multipart supply contains only independently passed scored nodes. */
export const THYROID_NODULES_CANCER_TOPIC_PASS_PRESERVED_CASES =
  THYROID_NODULES_CANCER_TOPIC_CASES.filter(clinicalCase =>
    clinicalCase.decisionNodes.every(node => packet.reviewRound.passFreeze.some(item => item.node.id === node.id)));
export const THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_CASES =
  THYROID_NODULES_CANCER_TOPIC_CASES.filter(clinicalCase =>
    !THYROID_NODULES_CANCER_TOPIC_PASS_PRESERVED_CASES.includes(clinicalCase));
const conceptsFor = (cases: SyntheticClinicalCase[]) => {
  const ids = new Set(cases.flatMap(clinicalCase => clinicalCase.decisionNodes.map(node => node.primaryConceptId)));
  return THYROID_NODULES_CANCER_TOPIC_CONCEPTS.filter(concept => ids.has(concept.id));
};

/** Independent editorial PASS is exact-version metadata, never clinical approval. */
export const THYROID_NODULES_CANCER_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic thyroid PASS-preserved preview, not clinically approved. Manager acceptance and named clinical review remain pending.",
  concepts: conceptsFor(THYROID_NODULES_CANCER_TOPIC_PASS_PRESERVED_CASES),
  cases: THYROID_NODULES_CANCER_TOPIC_PASS_PRESERVED_CASES,
});

/** Isolated review artifact, not admitted supply: these singletons require independent re-review. */
export const THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic thyroid revision candidates, not clinically approved. Independent re-review, manager acceptance and named clinical review remain pending.",
  concepts: conceptsFor(THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_CASES),
  cases: THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_CASES,
});

export const THYROID_NODULES_CANCER_TOPIC_MANIFEST = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  pipelinePassed: false, clinicalApproval: false, managerAccepted: false,
  publicReleaseAuthorized: false, executableOrdersAdded: false,
  runtimeSetting: "clinic",
  reviewOrderNotice: "key shown first for review only.",
  passPreservedNodes: packet.reviewRound.counts.passPreserved,
  revisedAwaitingIndependentReview: packet.reviewRound.counts.revised,
  parkedAuthorOnly: packet.reviewRound.counts.parked,
  newOrRevisedNodes: THYROID_NODULES_CANCER_TOPIC_NODES.length,
  newOrRevisedCases: THYROID_NODULES_CANCER_TOPIC_CASES.length,
} as const;
