import type { ClinicalSource, EvidenceClaim, QuestionVariant } from './pilot-schema';
import type { AnswerChoiceTimingRegistryEntry, CaseExhibit, SyntheticClinicalCase, TestedConcept } from './schema';
import packet from '../../../docs/research/question-topic-anesthesia-analgesia-pharmacology-20261111.json';
import ledger from '../../../docs/research/sources-question-topic-anesthesia-analgesia-pharmacology-20261111.json';

/** Explicit-import authoring sidecar. No default-release or shared-registry mutation. */
export const ANESTHESIA_TOPIC_SLUG = 'anesthesia-analgesia-pharmacology';
export const ANESTHESIA_TOPIC_DRAFT = {
  contentVersion: 'question-topic-anesthesia-analgesia-pharmacology.2026-11-11.v2',
  reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null,
} as const;

interface Option {
  id: string; exactChoiceId: string; label: string; rationale: string;
  temptation: string; counterfactual: string; claimIds: string[];
  timing: { kind: 'no_test' } | { kind: 'test'; timingProfileId: string };
}
interface AuthorGate {
  interpret: string; apply: string; closestError: string; decidingObservation: string;
  counterfactual: string; cueAttack: string; deletionTest: string; sequenceAudit: string;
  predictedDifficulty: 'moderate' | 'hard'; difficultyReason: string;
  stageAndCategory: string; checkedOn: string; rubric: string; authorDisposition: string;
  repairRecord: string; oneBestAnswer: string; finiteProfileCheck: string; separateTaskCheck: string;
}
interface DraftNode {
  slug: string; id: string; questionVariantId: string; conceptId: string; objective: string;
  conceptType: TestedConcept['conceptType']; task: string; choices: Option[]; key: string;
  explanation: string; claimIds: string[]; currentUpdate: string; exhibit?: CaseExhibit;
  beforeInventoryIds: string[]; authorship: 'rewrite' | 'new'; previousConceptId: string | null;
  replacesDifferentConceptId?: string;
  conceptMeaning: 'unchanged_meaning' | 'new_meaning' | 'new_version'; conceptVersionReason: string;
  authorGate: AuthorGate;
  contentVersion?: string;
}
interface DraftCase {
  id: string; slug: string; name: string; ageYears: number; sexLabel: 'Female' | 'Male';
  chiefComplaint: string; presentation: string; nodes: DraftNode[];
  encounterMode: 'outpatient_clinic' | 'outside_record_review_in_clinic';
  historicalAcuity: 'stable' | 'urgent_stable' | 'obvious_emergency';
  educationalTier: 1; currentAcuity: 'stable'; earliestFacilityStage: 0;
  requiredClinicalSetting: 'clinic'; requiredCapabilityIds: string[]; selectionConstraint: string;
}

export const ANESTHESIA_TOPIC_DEFINITIONS = packet.proposedCases as unknown as DraftCase[];
export const ANESTHESIA_TOPIC_SOURCES = ledger.sources as unknown as ClinicalSource[];
export const ANESTHESIA_TOPIC_CLAIMS = ledger.claims as unknown as EvidenceClaim[];
export const ANESTHESIA_TOPIC_AUDIT = packet.audit;
export const ANESTHESIA_TOPIC_ASSIGNMENT = packet.assignment;
export const ANESTHESIA_TOPIC_BEFORE_SNAPSHOTS = packet.beforeSnapshots;
export const ANESTHESIA_TOPIC_FROZEN_REFERENCES = packet.assignment.freezeReferences;
export const ANESTHESIA_TOPIC_OWNER_APPROVALS = packet.ownerApprovalsNeeded;
export const ANESTHESIA_TOPIC_DISCOVERED_HOLDS = packet.discoveredHolds;
export const ANESTHESIA_TOPIC_WITHHELD_POINTS = packet.assignment.withheldTeachingPoints;
export const ANESTHESIA_TOPIC_WITHDRAWN_ATTEMPTS = packet.withdrawnAuthorAttempts;
export const ANESTHESIA_TOPIC_REVIEW_REVISION = packet.independentReviewRevision;
export const ANESTHESIA_TOPIC_REVIEW_DISPOSITIONS = packet.independentReviewRevision.dispositions;
export const ANESTHESIA_TOPIC_PARKED_ATTEMPTS = packet.independentReviewRevision.parkedAttempts;
export const ANESTHESIA_TOPIC_COMPOSITION_PROPOSALS = packet.independentReviewRevision.compositionProposals;

// These are immutable review receipts. Reuse the exact PASS payloads, including
// their v1 metadata, rather than projecting them through the v2 authoring builder.
const reviewedQuestions = packet.independentReviewRevision.originalArtifacts
  .ANESTHESIA_TOPIC_QUESTIONS as unknown as QuestionVariant[];
const reviewedCases = packet.independentReviewRevision.originalArtifacts
  .ANESTHESIA_TOPIC_CASES as unknown as SyntheticClinicalCase[];
const passIds = new Set(ANESTHESIA_TOPIC_REVIEW_DISPOSITIONS
  .filter(r => r.status === 'pass-preserved').map(r => r.reviewedQuestionVariantId));

const nodes = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes);
const textFor = (c: DraftCase, text: string) => text.split(c.name).join('{patientName}');
const claimsFor = (n: DraftNode) => [...new Set([...n.claimIds, ...n.choices.flatMap(ch => ch.claimIds)])];
const labelsFor = (ids: string[]) => {
  const sourceIds = new Set(ANESTHESIA_TOPIC_CLAIMS.filter(c => ids.includes(c.id)).flatMap(c => c.sourceIds));
  return ANESTHESIA_TOPIC_SOURCES.filter(s => sourceIds.has(s.id)).map(s => s.title);
};

export const ANESTHESIA_TOPIC_QUESTIONS: QuestionVariant[] = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes.map(n => {
  if (passIds.has(n.questionVariantId)) return reviewedQuestions.find(q => q.id === n.questionVariantId)!;
  return {
  ...ANESTHESIA_TOPIC_DRAFT, id: n.questionVariantId, conceptId: n.conceptId,
  stem: textFor(c, n.task), explanation: textFor(c, n.explanation),
  ...(n.exhibit ? { exhibit: n.exhibit } : {}), supportingEvidenceClaimIds: claimsFor(n),
  answerChoices: n.choices.map(ch => ({ id: ch.exactChoiceId, label: ch.label,
    isCorrect: ch.id === n.key, rationale: ch.rationale,
    distractorRationale: ch.id === n.key ? null : ch.rationale })),
  };
}));

export const ANESTHESIA_TOPIC_CASES: SyntheticClinicalCase[] = ANESTHESIA_TOPIC_DEFINITIONS.map(c => {
  if (c.nodes.length === 1 && passIds.has(c.nodes[0]!.questionVariantId)) {
    const questionId = c.nodes[0]!.questionVariantId;
    const original = reviewedCases.find(before => before.decisionNodes.some(n => n.questionVariantId === questionId))!;
    if (original.decisionNodes.length === 1) return original;
    const exactNode = original.decisionNodes.find(n => n.questionVariantId === questionId)!;
    // Splitting makes the former first node final. The schema requires explicit
    // final-choice dispositions. Only this binding metadata is added; every
    // reviewed word, question payload and other node field stays unchanged.
    const finalNode = { ...exactNode, terminalDispositions: exactNode.answerChoices
      .filter(ch => !ch.isCorrect).map(ch => ({
        answerChoiceId: ch.id, kind: 'no_terminal_outcome' as const,
        consequenceNarrative: 'Review the outside-care decision; no patient outcome is simulated.',
        clinicalRationale: ch.rationale!, sourceLabels: exactNode.sourceLabels,
      })) };
    return { ...original, id: c.id, decisionNodes: [finalNode], learningSummary: exactNode.explanation };
  }
  const demographics = { ageYears: c.ageYears, sexLabel: c.sexLabel };
  const sourceLabels = labelsFor(c.nodes.flatMap(claimsFor));
  const presentation = textFor(c, c.presentation);
  return {
    id: c.id, displayName: `Clinic chart: ${c.name}`, patientDisplayName: c.name,
    patientPresentationVariantId: `presentation.topic.${ANESTHESIA_TOPIC_SLUG}.${c.slug}.v1`,
    prototypeDemographics: demographics, chiefComplaint: c.chiefComplaint, presentation,
    // Existing structural field; the profile is a draft, not named clinician approval.
    approvedInstantiationProfiles: [{ id: `profile.topic.${ANESTHESIA_TOPIC_SLUG}.${c.slug}.v1`,
      prototypeDemographics: demographics, chiefComplaint: c.chiefComplaint, presentation }],
    releasePointId: 'release.l0.clinic_evaluation', tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: c.earliestFacilityStage, requiredClinicalSetting: 'clinic',
    requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels,
    decisionNodes: c.nodes.map((n, index) => {
      const q = ANESTHESIA_TOPIC_QUESTIONS.find(q => q.id === n.questionVariantId)!;
      const labels = labelsFor(claimsFor(n));
      return { id: n.id, questionVariantId: q.id, primaryConceptId: n.conceptId,
        stem: q.stem, ...(n.currentUpdate ? { currentUpdate: textFor(c, n.currentUpdate) } : {}),
        ...(n.exhibit ? { exhibit: n.exhibit } : {}), shuffleAnswers: true,
        answerChoices: q.answerChoices.map(ch => ({ id: ch.id, label: ch.label,
          isCorrect: ch.isCorrect, rationale: ch.rationale!, serviceRequest: null })),
        explanation: q.explanation, sourceLabels: labels, resultGateAfter: null,
        terminalDispositions: index === c.nodes.length - 1 ? q.answerChoices.filter(ch => !ch.isCorrect).map(ch => ({
          answerChoiceId: ch.id, kind: 'no_terminal_outcome' as const,
          consequenceNarrative: 'Review the outside-care decision; no patient outcome is simulated.',
          clinicalRationale: ch.rationale!, sourceLabels: labels,
        })) : [],
      };
    }),
    learningSummary: c.nodes.map(n => textFor(c, n.explanation)).join(' '),
  };
});

export const ANESTHESIA_TOPIC_TESTED_CONCEPTS: TestedConcept[] = [...new Map(nodes.map(n => {
  const existing = packet.assignment.concepts.find(c => c.conceptId === n.conceptId);
  return [n.conceptId, { id: n.conceptId, displayName: existing?.displayName ?? n.objective,
    learningObjective: existing?.learningObjective ?? n.objective,
    conceptType: n.conceptType, earliestFacilityStage: 0 }] as const;
})).values()];

export const ANESTHESIA_TOPIC_AUTHORING_CONCEPTS = ANESTHESIA_TOPIC_TESTED_CONCEPTS.map(c => {
  const definition = nodes.find(n => n.conceptId === c.id)!;
  return { ...ANESTHESIA_TOPIC_DRAFT, ...c, previousConceptId: definition.previousConceptId,
    conceptMeaning: definition.conceptMeaning, conceptVersionReason: definition.conceptVersionReason,
    evidenceClaimIds: [...new Set(nodes.filter(n => n.conceptId === c.id).flatMap(claimsFor))],
    historyMigration: 'None. Keep old definitions, cards, frozen encounters and exact timing/order records.',
  };
});

export const ANESTHESIA_TOPIC_IDENTITY_DECISIONS = nodes.map(n => ({
  ...ANESTHESIA_TOPIC_DRAFT, questionVariantId: n.questionVariantId, conceptId: n.conceptId,
  previousConceptId: n.previousConceptId, replacesDifferentConceptId: n.replacesDifferentConceptId ?? null,
  conceptMeaning: n.conceptMeaning, reason: n.conceptVersionReason, beforeInventoryIds: n.beforeInventoryIds,
  historyMigration: 'None; an existing target concept is reused only for the same clinical rule.',
}));

export const ANESTHESIA_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  classification: n.choices.some(ch => ch.timing.kind === 'test') ? {
    kind: 'test_choices' as const,
    choices: n.choices.map(ch => ({ choiceId: ch.exactChoiceId, choiceLabel: ch.label, timing: ch.timing })),
  } : { kind: 'no_test' as const },
})));

export const ANESTHESIA_TOPIC_ORDER_PROPOSALS = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...ANESTHESIA_TOPIC_DRAFT, caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  serviceRequest: null, resultGateAfter: null, execution: 'review_plan_only' as const,
  choices: n.choices.map(ch => ({ choiceId: ch.exactChoiceId, choiceLabel: ch.label, timing: ch.timing })),
  integrationDependency: 'Manager installs accepted exact choice/label timing identities; estimates do not execute services. Keep historical records.',
})));

export const ANESTHESIA_TOPIC_AUTHOR_CHECKS = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...ANESTHESIA_TOPIC_DRAFT, caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  ...n.authorGate, independent: false, pipelinePassed: false, clinicalApproval: false,
  distractorChecks: n.choices.filter(ch => ch.id !== n.key).map(ch => ({
    choiceId: ch.exactChoiceId, temptation: ch.temptation, whyLessAppropriate: ch.rationale,
    counterfactual: ch.counterfactual, claimIds: ch.claimIds,
  })),
})));

export const ANESTHESIA_TOPIC_CASE_REVIEWS = ANESTHESIA_TOPIC_DEFINITIONS.map(c => ({
  ...ANESTHESIA_TOPIC_DRAFT, caseId: c.id, educationalTier: c.educationalTier,
  acuity: c.currentAcuity, historicalAcuity: c.historicalAcuity, encounterMode: c.encounterMode,
  earliestFacilityStage: c.earliestFacilityStage, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [],
  finiteProfileCount: 1, profileApproval: 'needs_clinician_review', selectionConstraint: c.selectionConstraint,
  generationConstraint: 'Preserve age, sex, drug sequence, measurements and update chronology together; no unconstrained clinical recombination.',
}));

export const ANESTHESIA_TOPIC_STATEMENT_MAPPINGS = ANESTHESIA_TOPIC_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...ANESTHESIA_TOPIC_DRAFT, caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  constructedObservations: { fields: ['prototypeDemographics', 'presentation', 'currentUpdate', 'exhibit'],
    basis: 'Fictional fixed patient observations, not empirical rates, universal cutoffs, doses or observation periods. Interpretation rules are mapped separately.' },
  fieldMappings: [
    { fields: ['presentation.relationships', 'currentUpdate.relationships', 'exhibit.interpretation', 'objective', 'stem', 'explanation', 'learningSummary'], claimIds: n.claimIds },
    ...n.choices.map(ch => ({ fields: [`answerChoices[id=${ch.exactChoiceId}].label`, `answerChoices[id=${ch.exactChoiceId}].rationale`, `distractorChecks[id=${ch.exactChoiceId}].counterfactual`], claimIds: ch.claimIds })),
  ],
  evidenceClaimIds: claimsFor(n),
})));

export const ANESTHESIA_TOPIC_SOURCE_LINKS = ANESTHESIA_TOPIC_SOURCES.filter(s => s.officialUrl).map(s => ({
  ...ANESTHESIA_TOPIC_DRAFT, sourceId: s.id, label: s.title, href: s.officialUrl!,
  target: '_blank' as const, rel: 'noopener noreferrer' as const, referrerPolicy: 'no-referrer' as const,
}));

export const ANESTHESIA_TOPIC_PREVIEW_RELEASE = {
  id: 'clinical.topic.anesthesia-analgesia-pharmacology.2026-11-11.v2', schemaVersion: 1,
  publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Synthetic authoring preview, not clinically approved. Independent review, manager acceptance and exact named clinical sign-off are separate requirements.',
  concepts: ANESTHESIA_TOPIC_TESTED_CONCEPTS, cases: ANESTHESIA_TOPIC_CASES,
} as const;

export const ANESTHESIA_TOPIC_MANIFEST = {
  ...ANESTHESIA_TOPIC_DRAFT, id: 'batch.question-topic.anesthesia-analgesia-pharmacology.2026-11-11.v2',
  scope: 'explicit_import_authoring_sidecar', clinicalApproval: false, pipelinePassed: false,
  managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false,
  caseCount: ANESTHESIA_TOPIC_CASES.length, questionCount: ANESTHESIA_TOPIC_QUESTIONS.length,
  conceptCount: ANESTHESIA_TOPIC_TESTED_CONCEPTS.length, counts: packet.counts,
  keyOrderNotice: 'key shown first for review only; runtime options are randomized',
  integrationDependencies: packet.integrationDependencies,
};
