import packet from "../../../docs/research/question-topic-vascular-venous-lymphatic-access-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-vascular-venous-lymphatic-access-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, CaseExhibit, SyntheticClinicalCase, TestedConcept } from "./schema";

/** Explicit-import authoring sidecar. Admission and all shared registries belong to the manager. */
export const VENOUS_TOPIC_SLUG = "vascular-venous-lymphatic-access";
export const VENOUS_TOPIC_REVIEW = {
  contentVersion: "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;
const R = VENOUS_TOPIC_REVIEW;

export interface VenousTopicOption {
  slug: string;
  label: string;
  rationale: string;
  temptation: string;
  reasonableUnder: string;
  timingProfileId: string | null;
}
export interface VenousTopicNode {
  slug: string;
  questionVersion?: 1 | 2;
  conceptId: string;
  conceptType: "workup" | "management";
  objective: string;
  claimSlugs: string[];
  task: string;
  options: VenousTopicOption[];
  reasoning: string[];
  decidingObservation: string;
  counterfactual: string;
  cueAttack: string;
  deletionTest: string;
  decisionStageAndCategory: string;
  beforeRecordIds: string[];
  beforeVariantIds: string[];
  previousConceptId: string | null;
  previousReviewedQuestionId?: string;
  identityDecision: string;
  currentUpdate: string | null;
  exhibit: CaseExhibit | null;
  predictedDifficulty: string;
  closestCredibleError: { choiceSlug: string; temptation: string; errorAndConsequence: string };
  clinicalReviewStatus: "needs_clinician_review";
  authorCheck: string;
}
export interface VenousTopicCase {
  slug: string;
  caseVersion?: 1 | 2;
  preservedRound1CaseId?: string;
  patientName: string;
  ageYears: number;
  sexLabel: "Female" | "Male";
  complaint: string;
  presentation: string;
  sequenceReview: string;
  clinicalContext: string;
  patientAcuity: string;
  nodes: VenousTopicNode[];
}

export const VENOUS_TOPIC_DRAFT_CASES = packet.draftCases as unknown as VenousTopicCase[];
export const VENOUS_TOPIC_SOURCES = ledger.sources as unknown as ClinicalSource[];
export const VENOUS_TOPIC_CLAIMS = ledger.claims as unknown as EvidenceClaim[];
export const VENOUS_TOPIC_AUDIT = packet.audit;
export const VENOUS_TOPIC_ASSIGNMENT = packet.assignment;
const claimId = (slug: string) => `claim.${VENOUS_TOPIC_SLUG}.${slug}`;
export const venousCaseId = (c: VenousTopicCase) => `case.${VENOUS_TOPIC_SLUG}.${c.slug}.20261111.v${c.caseVersion ?? 1}`;
export const venousNodeId = (n: VenousTopicNode) => `node.${VENOUS_TOPIC_SLUG}.${n.slug}.20261111.v${n.questionVersion ?? 1}`;
export const venousQuestionId = (n: VenousTopicNode) => `question.${VENOUS_TOPIC_SLUG}.${n.slug}.20261111.v${n.questionVersion ?? 1}`;
export const venousChoiceId = (n: VenousTopicNode, o: VenousTopicOption) => `choice.${VENOUS_TOPIC_SLUG}.${n.slug}.${o.slug}.v${n.questionVersion ?? 1}`;
const reviewFor = (n: VenousTopicNode) => n.questionVersion === 2
  ? { ...R, contentVersion: R.contentVersion.replace(/v1$/, "v2") } : R;
const reviewedCases = packet.round1Archive.authoredProjection.cases as unknown as SyntheticClinicalCase[];
const preservedNodes = new Map(reviewedCases.flatMap(c => c.decisionNodes.map(n => [n.questionVariantId, n] as const)));
const preservedNodeForPosition = (n: VenousTopicNode, isFinal: boolean) => {
  const reviewed = preservedNodes.get(venousQuestionId(n))!;
  if (!isFinal || reviewed.terminalDispositions.length > 0) return reviewed;
  // Splitting a formerly nonfinal PASS requires closure metadata. Reviewed clinical text stays exact.
  return { ...reviewed, terminalDispositions: reviewed.answerChoices.filter(a => !a.isCorrect).map(a => ({
    answerChoiceId: a.id, kind: "no_terminal_outcome" as const,
    consequenceNarrative: "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
    clinicalRationale: a.rationale!, sourceLabels: reviewed.sourceLabels,
  })) };
};
export const VENOUS_TOPIC_REVIEW_RESPONSE = packet.independentReviewResponse;
export const VENOUS_TOPIC_PARKED_AFTER_REVIEW = packet.parkedAfterIndependentReview;
const claimsFor = (n: VenousTopicNode) => n.claimSlugs.map(claimId);
const labelsFor = (n: VenousTopicNode) => [...new Set(VENOUS_TOPIC_CLAIMS
  .filter(c => claimsFor(n).includes(c.id)).flatMap(c => c.sourceIds)
  .map(id => VENOUS_TOPIC_SOURCES.find(s => s.id === id)!.title))];
const explanation = (n: VenousTopicNode) => `${n.options[0]!.rationale} ${n.options[1]!.rationale}`;

/** Authoring data is key-first; this is never a runtime ordering contract. */
export const VENOUS_TOPIC_QUESTIONS: QuestionVariant[] = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes.map(n => ({
  ...reviewFor(n), id: venousQuestionId(n), conceptId: n.conceptId, stem: n.task,
  answerChoices: n.options.map((o, index) => ({
    id: venousChoiceId(n, o), label: o.label, isCorrect: index === 0,
    distractorRationale: index === 0 ? null : o.rationale, rationale: o.rationale,
  })),
  explanation: explanation(n), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
  supportingEvidenceClaimIds: claimsFor(n),
})));

export const VENOUS_TOPIC_CASES: SyntheticClinicalCase[] = VENOUS_TOPIC_DRAFT_CASES.map(c => {
  const demographics = { ageYears: c.ageYears, sexLabel: c.sexLabel };
  const preserved = c.preservedRound1CaseId ? reviewedCases.find(x => x.id === c.preservedRound1CaseId) : undefined;
  const result: SyntheticClinicalCase = {
    id: venousCaseId(c), displayName: `${c.patientName}: venous/access review`,
    patientPresentationVariantId: `presentation.${VENOUS_TOPIC_SLUG}.${c.slug}.20261111.v${c.caseVersion ?? 1}`,
    releasePointId: "release.l0.clinic_evaluation", patientDisplayName: c.patientName,
    prototypeDemographics: demographics, chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.${VENOUS_TOPIC_SLUG}.${c.slug}.20261111.v${c.caseVersion ?? 1}`,
      prototypeDemographics: demographics, chiefComplaint: c.complaint, presentation: c.presentation,
    }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(c.nodes.flatMap(labelsFor))],
    decisionNodes: c.nodes.map((n, index) => n.questionVersion !== 2 ? preservedNodeForPosition(n, index === c.nodes.length - 1) : ({
      id: venousNodeId(n), questionVariantId: venousQuestionId(n), primaryConceptId: n.conceptId,
      stem: n.task, ...(n.currentUpdate ? { currentUpdate: n.currentUpdate } : {}),
      ...(n.exhibit ? { exhibit: n.exhibit } : {}),
      answerChoices: n.options.map((o, i) => ({
        id: venousChoiceId(n, o), label: o.label, isCorrect: i === 0,
        rationale: o.rationale, serviceRequest: null,
      })),
      shuffleAnswers: true, explanation: explanation(n), sourceLabels: labelsFor(n), resultGateAfter: null,
      terminalDispositions: index === c.nodes.length - 1 ? n.options.slice(1).map(o => ({
        answerChoiceId: venousChoiceId(n, o), kind: "no_terminal_outcome" as const,
        consequenceNarrative: "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
        clinicalRationale: o.rationale, sourceLabels: labelsFor(n),
      })) : [],
    })),
    learningSummary: c.nodes.map(explanation).join(" "),
  };
  if (preserved) {
    result.patientPresentationVariantId = preserved.patientPresentationVariantId;
    result.prototypeDemographics = preserved.prototypeDemographics;
    result.patientDisplayName = preserved.patientDisplayName;
    result.chiefComplaint = preserved.chiefComplaint;
    result.presentation = preserved.presentation;
    result.approvedInstantiationProfiles = preserved.approvedInstantiationProfiles;
    result.sourceLabels = preserved.sourceLabels;
  }
  return result;
});

const allNodes = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes);
export const VENOUS_TOPIC_CONCEPTS: TestedConcept[] = [...new Map(allNodes.map((n): [string, TestedConcept] => {
  const registered = packet.assignment.concepts.find(c => c.conceptId === n.conceptId);
  return [n.conceptId, {
    id: n.conceptId, displayName: registered?.displayName ?? n.slug.replaceAll("-", " "),
    learningObjective: registered?.learningObjective ?? n.objective,
    earliestFacilityStage: 0, conceptType: n.conceptType,
  } satisfies TestedConcept];
})).values()];
export const VENOUS_TOPIC_AUTHORING_CONCEPTS = VENOUS_TOPIC_CONCEPTS.map(c => ({
  ...R, ...c, educationalTier: 1,
  evidenceClaimIds: [...new Set(allNodes.filter(n => n.conceptId === c.id).flatMap(claimsFor))],
}));
export const VENOUS_TOPIC_CASE_REVIEWS = VENOUS_TOPIC_DRAFT_CASES.map(c => ({
  ...R, caseId: venousCaseId(c), educationalTier: 1, patientAcuity: c.patientAcuity,
  clinicalContext: c.clinicalContext, facilityCapability: "Existing clinic assessment and outside-record review; outside procedures are plans, not locally performed services.",
  facilityProgressionLevel: 0, requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
  prototypeDemographics: { ageYears: c.ageYears, sexLabel: c.sexLabel },
  generationPolicy: "One fixed authored name/age/sex profile. No demographic disease-selection weights. The existing finite-profile field conveys no clinical approval.",
  clinicalApproval: false, exposure: "owner_development_preview_only", sequenceReview: c.sequenceReview,
}));

export const VENOUS_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes.map(n => ({
  caseId: venousCaseId(c), nodeId: venousNodeId(n), questionVariantId: venousQuestionId(n),
  classification: n.options.some(o => o.timingProfileId) ? {
    kind: "test_choices" as const, choices: n.options.map(o => ({
      choiceId: venousChoiceId(n, o), choiceLabel: o.label,
      timing: o.timingProfileId ? { kind: "test" as const, timingProfileId: o.timingProfileId } : { kind: "no_test" as const },
    })),
  } : { kind: "no_test" as const },
})));

export const VENOUS_TOPIC_ORDER_PROPOSALS = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes.flatMap(n => n.options
  .filter(o => o.timingProfileId).map(o => ({
    caseId: venousCaseId(c), nodeId: venousNodeId(n), questionVariantId: venousQuestionId(n),
    choiceId: venousChoiceId(n, o), choiceLabel: o.label, timingProfileId: o.timingProfileId!,
    delivery: "external_plan_estimate_only", sharedRegistryChangeRequired: true,
    currentServiceRequest: null, currentResultGate: null,
    executionBoundary: "A supplied later teaching record is not a result generated by this choice. Manager must bind exact services/routes/gates before enabling any execution.",
  }))));

export const VENOUS_TOPIC_SOURCE_LINKS = VENOUS_TOPIC_SOURCES.map(s => ({
  sourceId: s.id, href: s.officialUrl!, label: s.title,
  target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
}));
export const VENOUS_TOPIC_IDENTITY_DECISIONS = allNodes.map(n => ({
  ...reviewFor(n), questionVariantId: venousQuestionId(n), conceptId: n.conceptId,
  beforeRecordIds: n.beforeRecordIds, beforeVariantIds: n.beforeVariantIds,
  previousReviewedQuestionId: n.previousReviewedQuestionId ?? null,
  previousConceptId: n.previousConceptId, identityDecision: n.identityDecision, objective: n.objective,
  historyPolicy: "No migration: preserve every old definition, frozen encounter, exact timing/order tuple and FSRS history. New meaning starts under its own identity.",
}));
export const VENOUS_TOPIC_AUTHOR_GATES = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes.map(n => ({
  ...reviewFor(n), caseId: venousCaseId(c), nodeId: venousNodeId(n), questionVariantId: venousQuestionId(n),
  kind: "manual_author_self_check", checkedOn: "2026-11-11", independentReview: false, clinicalApproval: false,
  disposition: "AUTHORED_FOR_INDEPENDENT_CHALLENGE_NOT_PASS",
  coverTheKey: n.cueAttack, oneDecisionStageAndCategory: n.decisionStageAndCategory,
  twoConsequentialSteps: n.reasoning, residentDifficulty: n.predictedDifficulty,
  singleBestAnswer: { decidingObservation: n.decidingObservation, counterfactual: n.counterfactual },
  closestCredibleError: n.closestCredibleError, deletionTest: n.deletionTest, fullSequence: c.sequenceReview,
  options: n.options.map(o => ({ choiceId: venousChoiceId(n, o), temptation: o.temptation, rationale: o.rationale, reasonableUnder: o.reasonableUnder })),
})));
export const VENOUS_TOPIC_STATEMENT_MAPPINGS = allNodes.map(n => ({
  ...reviewFor(n), questionVariantId: venousQuestionId(n), claimIds: claimsFor(n),
  fields: ["presentation", "currentUpdate", "exhibit", "task", "key rationale", "distractor rationales", "counterfactuals"],
  claimStatements: VENOUS_TOPIC_CLAIMS.filter(c => claimsFor(n).includes(c.id)).map(c => ({ claimId: c.id, statement: c.statement })),
  observationBasis: "Named patients, ages, serial measurements, distances, elapsed periods, laboratory findings and response records are constructed teaching observations. They are not empirical rates, invented thresholds or actual patient records.",
}));

/** Current review lane only. Earlier exports stay exact for accepted/frozen definitions. */
export const VENOUS_TOPIC_CURRENT_REVIEW_QUEUE = packet.currentReviewQueue;
export const VENOUS_TOPIC_SALVAGE_CASES: SyntheticClinicalCase[] = packet.salvage.items.map(item =>
  JSON.parse(JSON.stringify(item.afterCase)) as SyntheticClinicalCase);
export const VENOUS_TOPIC_SALVAGE_QUESTIONS: QuestionVariant[] = packet.salvage.items.map(item =>
  JSON.parse(JSON.stringify(item.afterQuestion)) as QuestionVariant);
export const VENOUS_TOPIC_SALVAGE_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = packet.salvage.items.flatMap(item =>
  JSON.parse(JSON.stringify(item.timingEntries)) as AnswerChoiceTimingRegistryEntry[]);
export const VENOUS_TOPIC_SALVAGE_ORDER_PROPOSALS = packet.salvage.items.flatMap(item => item.orderProposals);
export const VENOUS_TOPIC_SALVAGE_CONCEPTS = VENOUS_TOPIC_AUTHORING_CONCEPTS.filter(concept =>
  packet.salvage.items.some(item => item.conceptId === concept.id));
export const VENOUS_TOPIC_SALVAGE_SOURCE_LINKS = VENOUS_TOPIC_SOURCE_LINKS.filter(source =>
  packet.salvage.items.some(item => item.sourceIds.some(id => id === source.sourceId)));
export const VENOUS_TOPIC_SALVAGE_CASE_REVIEWS = packet.salvage.items.map(item => ({
  ...R, contentVersion: "clinical.question-topic-vascular-venous-lymphatic-access.salvage.2026-11-12.v1",
  caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
  status: "salvage" as const, clinicalContext: "outside_hospital_chart_review",
  educationalTier: 1, patientAcuity: "historical_acute", facilityProgressionLevel: 0,
  requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
  facilityCapability: "Existing clinic chart review; pulmonary tests are external-plan estimates, with no local acute-care procedure.",
  selection: "standalone", contextReviewStatus: "pending_salvage_recheck",
  independentNodeVerdict: item.independentNodeVerdict, independentContextPass: false,
  integrationEligible: false, clinicalApproval: false, reviewSource: packet.salvage.reviewPath,
  sequenceReview: item.sequenceReview,
}));
