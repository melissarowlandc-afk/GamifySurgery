import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type AnswerChoiceTimingRegistryEntry,
  type CaseExhibit,
  type SyntheticClinicalCase,
} from "./schema";
import packet from "../../../docs/research/question-topic-transplant-immunosuppression-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-transplant-immunosuppression-20261111.json";

/** Explicit-import authoring sidecar. The manager owns any release integration. */
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_VERSION = "question-topic-transplant-immunosuppression.2026-11-11.v2";
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_DRAFT = {
  contentVersion: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_VERSION,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};
const draft = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_DRAFT;
const prefix = "topic.transplant-immunosuppression";
const claimId = (name: string) => `claim.transplant-immunosuppression.${name}`;

interface ChoiceDraft {
  id: string;
  label: string;
  rationale: string;
  temptation: string;
  reasonableWhen: string;
  claimNames: string[];
  timingProfileId?: string;
}
interface Reasoning {
  interpret: string;
  apply: string;
  closestChoice: string;
  decidingObservation: string;
  counterfactual: string;
  consequence: string;
  deletionTest: string;
  cueAttack: string;
  stageAudit: string;
  predictedDifficulty: "moderate" | "hard";
  difficultyReason: string;
  sequenceReview: string;
}
interface NodeDraft {
  slug: string;
  version?: number;
  conceptId: string;
  previousConceptId: string | null;
  conceptRelation: "reuse" | "new_meaning";
  creationKind: "Rewrite" | "new";
  replacesInventoryIds: string[];
  objective: string;
  conceptType: "workup" | "management";
  currentUpdate: string;
  task: string;
  choices: ChoiceDraft[];
  correctChoice: string;
  explanation: string;
  claimNames: string[];
  reasoning: Reasoning;
  repairHistory: string[];
  exhibit?: CaseExhibit;
}
interface CaseDraft {
  slug: string;
  version?: number;
  frozenReviewedCaseId?: string;
  patientName: string;
  age: number;
  sex: "Female" | "Male";
  chiefComplaint: string;
  presentation: string;
  clinicalFrame: "outside_hospital_chart_review_in_clinic";
  educationalTier: 1;
  patientAcuity: "stable_outpatient_at_review";
  recordedHospitalAcuity: string;
  earliestFacilityStage: 0;
  requiredClinicalSetting: "clinic";
  requiredCapabilityIds: string[];
  nodes: NodeDraft[];
}

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS = packet.specs as unknown as CaseDraft[];
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_EVIDENCE_CLAIMS = ledger.claims as EvidenceClaim[];
/** Immutable independent-review intake. Returned v1 definitions stay addressable,
 * but are not part of the active candidate pool. Editorial PASS is not clinical approval. */
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_REVIEWED_HISTORY = packet.reviewRound2.baseline;
const reviewed = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_REVIEWED_HISTORY;
const passIds = new Set(packet.reviewRound2.statuses.filter(s => s.status === "pass-preserved").map(s => s.reviewedVariantId));
const labelsFor = (names: string[]) => {
  const ids = new Set(names.map(claimId));
  const sources = new Set(ledger.claims.filter(c => ids.has(c.id)).flatMap(c => c.sourceIds));
  return ledger.sources.filter(s => sources.has(s.id)).map(s => `${s.organizationOrJournal} (${s.publicationYear ?? "undated"})`);
};
const choiceId = (n: NodeDraft, a: ChoiceDraft) => `choice.${prefix}.${n.slug}.${n.version === 2 ? "r2." : ""}${a.id}`;
const questionId = (n: NodeDraft) => `question.${prefix}.${n.slug}.v${n.version ?? 1}`;
const nodeId = (n: NodeDraft) => `node.${prefix}.${n.slug}.v${n.version ?? 1}`;
const caseId = (c: CaseDraft) => c.frozenReviewedCaseId ?? `case.${prefix}.${c.slug}.v${c.version ?? 1}`;

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_QUESTIONS: QuestionVariant[] = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.flatMap(c => c.nodes.map(n => passIds.has(questionId(n))
  ? reviewed.proposals.find(p => p.question.id === questionId(n))!.question as QuestionVariant
  : ({
  ...draft,
  id: questionId(n), conceptId: n.conceptId, stem: n.task,
  ...(n.exhibit ? { exhibit: n.exhibit } : {}),
  answerChoices: n.choices.map(a => ({ id: choiceId(n, a), label: a.label, isCorrect: a.id === n.correctChoice,
    rationale: a.rationale, distractorRationale: a.id === n.correctChoice ? null : a.rationale })),
  explanation: n.explanation, supportingEvidenceClaimIds: n.claimNames.map(claimId),
})));

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES: SyntheticClinicalCase[] = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.map(c => {
  if (c.frozenReviewedCaseId) {
    const original = reviewed.authoredCases.find(old => old.id === c.frozenReviewedCaseId)!;
    // Preserve reviewed words, profiles, choices and feedback. Splitting makes four
    // formerly nonterminal PASS nodes final; the existing schema then requires
    // no-outcome annotations. These repeat exact rationales, adding no clinical text.
    const retained = original.decisionNodes.filter(n => c.nodes.some(s => questionId(s) === n.questionVariantId));
    return syntheticClinicalCaseSchema.parse({ ...original,
      decisionNodes: retained.map((n, i) => i === retained.length - 1 && n.terminalDispositions.length === 0
        ? { ...n, terminalDispositions: n.answerChoices.filter(a => !a.isCorrect).map(a => ({
          answerChoiceId: a.id, kind: "no_terminal_outcome" as const,
          consequenceNarrative: a.rationale!, clinicalRationale: a.rationale!, sourceLabels: n.sourceLabels,
        })) }
        : n),
    });
  }
  return syntheticClinicalCaseSchema.parse({
  id: caseId(c), displayName: `Clinic chart review: ${c.chiefComplaint}`,
  patientPresentationVariantId: `presentation.${prefix}.${c.slug}.v${c.version ?? 1}`,
  releasePointId: "release.l0.clinic_evaluation", patientDisplayName: c.patientName,
  prototypeDemographics: { ageYears: c.age, sexLabel: c.sex },
  chiefComplaint: c.chiefComplaint, presentation: c.presentation,
  approvedInstantiationProfiles: [{ id: `profile.${prefix}.${c.slug}.v${c.version ?? 1}`,
    prototypeDemographics: { ageYears: c.age, sexLabel: c.sex }, chiefComplaint: c.chiefComplaint, presentation: c.presentation }],
  tutorialEligible: false, routineEligible: true, earliestFacilityStage: c.earliestFacilityStage,
  requiredClinicalSetting: c.requiredClinicalSetting, requiredCapabilityIds: c.requiredCapabilityIds,
  rewardTierId: "reward.clinic_basic", sourceLabels: labelsFor(c.nodes.flatMap(n => n.claimNames)),
  decisionNodes: c.nodes.map((n, i) => ({
    id: nodeId(n), questionVariantId: questionId(n), primaryConceptId: n.conceptId,
    currentUpdate: n.currentUpdate, ...(n.exhibit ? { exhibit: n.exhibit } : {}), stem: n.task,
    answerChoices: n.choices.map(a => ({ id: choiceId(n, a), label: a.label,
      isCorrect: a.id === n.correctChoice, rationale: a.rationale, serviceRequest: null })),
    shuffleAnswers: true, explanation: n.explanation, sourceLabels: labelsFor(n.claimNames), resultGateAfter: null,
    terminalDispositions: i === c.nodes.length - 1 ? n.choices.filter(a => a.id !== n.correctChoice).map(a => ({
      answerChoiceId: choiceId(n, a), kind: "no_terminal_outcome" as const,
      consequenceNarrative: "The clinic record review ends with teaching feedback; no hospital intervention or patient outcome is simulated.",
      clinicalRationale: a.rationale, sourceLabels: labelsFor(a.claimNames),
    })) : [],
  })),
  learningSummary: c.nodes.map(n => n.explanation).join(" "),
});
});

const conceptCandidates = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.flatMap(c => c.nodes.map(n => ({
  ...draft, id: n.conceptId, previousConceptId: n.previousConceptId, conceptRelation: n.conceptRelation,
  displayName: n.objective, learningObjective: n.objective, conceptType: n.conceptType,
  educationalTier: c.educationalTier, patientAcuity: c.patientAcuity, recordedHospitalAcuity: c.recordedHospitalAcuity,
  earliestFacilityStage: c.earliestFacilityStage, requiredClinicalSetting: c.requiredClinicalSetting,
  requiredCapabilityIds: c.requiredCapabilityIds, evidenceClaimIds: n.claimNames.map(claimId),
  historyPolicy: "Preserve old concepts, exact versions, frozen encounters and FSRS cards. No transfer of history to changed meanings.",
})));
// Reuse one canonical definition when a revised exposure-trajectory variant tests
// the already-authored renal-biopsy meaning. Do not create duplicate FSRS concepts.
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CONCEPT_PROPOSALS = conceptCandidates
  .filter((c, i, all) => all.findIndex(x => x.id === c.id) === i)
  .map(c => reviewed.proposals.some(p => passIds.has(p.question.id) && p.question.conceptId === c.id)
    ? reviewed.conceptProposals.find(old => old.id === c.id)!
    : c);
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CONCEPTS = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CONCEPT_PROPOSALS.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));

/** Review metadata is separate from the strict runtime case/profile schema.
 * The legacy approvedInstantiationProfiles field name is not clinical approval. */
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASE_REVIEWS = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES.map((c, i) => ({
  ...draft, caseId: c.id, patientPresentationVariantId: c.patientPresentationVariantId,
  presentationProfileIds: c.approvedInstantiationProfiles?.map(p => p.id) ?? [],
  reviewedFields: ["chiefComplaint", "presentation", "prototypeDemographics", "approvedInstantiationProfiles", "learningSummary"],
  educationalTier: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.educationalTier,
  patientAcuity: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.patientAcuity,
  recordedHospitalAcuity: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.recordedHospitalAcuity,
  earliestFacilityStage: c.earliestFacilityStage, requiredClinicalSetting: c.requiredClinicalSetting,
  requiredCapabilityIds: c.requiredCapabilityIds,
  evidenceClaimIds: [...new Set([
    ...TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.nodes.flatMap(n => n.claimNames.map(claimId)),
    ...(reviewed.caseReviews.find(r => r.caseId === TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.frozenReviewedCaseId)?.evidenceClaimIds ?? []),
  ])],
}));

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.flatMap((c, i) => c.nodes.map((n, j) => {
  const cs = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES[i]!, nd = cs.decisionNodes[j]!;
  return answerChoiceTimingRegistryEntrySchema.parse({
    caseId: cs.id, nodeId: nd.id, questionVariantId: nd.questionVariantId,
    classification: n.choices.some(a => a.timingProfileId) ? { kind: "test_choices", choices: n.choices.map(a => ({
      choiceId: choiceId(n, a), choiceLabel: a.label,
      timing: a.timingProfileId ? { kind: "test", timingProfileId: a.timingProfileId } : { kind: "no_test" },
    })) } : { kind: "no_test" },
  });
}));

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ORDER_PROPOSALS = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_TIMING_PROPOSALS.flatMap(t =>
  t.classification.kind === "test_choices" ? t.classification.choices.filter(c => c.timing.kind === "test").map(c => ({
    ...draft, id: `order.${t.questionVariantId}.${c.choiceId}`,
    caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId,
    choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    status: "future_planned" as const, delivery: "teaching_plan_only" as const,
    serviceRequest: null, resultGateAfter: null, newExecutableServiceRequested: false,
    integrationOwner: "manager/domain order-registry owner",
    note: "Existing placeholder estimate only; authored outside records advance without executing a test in clinic. No fixed wait in question prose.",
  })) : []);

export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_SOURCE_LINKS = ledger.sources.map(s => ({
  ...draft, id: `link.${s.id}`, sourceId: s.id, label: s.title, href: s.officialUrl,
  target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
}));
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_AUTHOR_GATES = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.flatMap(c => c.nodes.map(n => ({
  ...draft, questionVariantId: questionId(n), checkedOn: "2026-11-11", gateRole: "manual_author_self_check",
  independentPass: passIds.has(questionId(n)), clinicalApproval: false,
  correctionStatus: passIds.has(questionId(n)) ? "pass-preserved" : "revised",
  independentReviewReference: passIds.has(questionId(n)) ? packet.reviewRound2.reviewFile : null,
  coverTheKey: n.reasoning.cueAttack, sameStageAndCategory: n.reasoning.stageAudit,
  twoConsequentialSteps: [n.reasoning.interpret, n.reasoning.apply],
  predictedResidentDifficulty: { prediction: n.reasoning.predictedDifficulty, reason: n.reasoning.difficultyReason },
  singleBestAnswer: { decidingObservation: n.reasoning.decidingObservation, counterfactual: n.reasoning.counterfactual },
  closestError: n.reasoning.closestChoice, consequence: n.reasoning.consequence,
  deletionTest: n.reasoning.deletionTest, sequenceReview: n.reasoning.sequenceReview, repairHistory: n.repairHistory,
})));
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_STATEMENT_MAPPINGS = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS.flatMap((c, i) => c.nodes.map((n, j) => ({
  ...draft, caseId: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES[i]!.id, questionVariantId: questionId(n),
  fields: ["presentation", `decisionNodes[${j}].currentUpdate`, `decisionNodes[${j}].exhibit`, `decisionNodes[${j}].stem`, `decisionNodes[${j}].explanation`, "learningSummary"],
  evidenceClaimIds: n.claimNames.map(claimId),
  learningSummaryEvidenceClaimIds: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASE_REVIEWS[i]!.evidenceClaimIds,
  choiceMappings: n.choices.map(a => ({ choiceId: choiceId(n, a), evidenceClaimIds: a.claimNames.map(claimId),
    rationale: a.rationale, temptation: a.temptation, reasonableWhen: a.reasonableWhen })),
  constructedDataBasis: "Named adult patients, ages, observations, chronology, specimen results and pathology records are constructed teaching inputs. They are not empirical rates, universal cutoffs or drug/timing protocols. Clinical relationships are supported by the linked atoms.",
})));
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_COMPOSITION_PROPOSALS = TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES.map((c, i) => ({
  ...draft, caseId: c.id, nodeIds: c.decisionNodes.map(n => n.id), questionVariantIds: c.decisionNodes.map(n => n.questionVariantId),
  scoredTopic: "transplant-immunosuppression", clinicalFrame: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS[i]!.clinicalFrame,
  requiredClinicalSetting: "clinic", selection: c.decisionNodes.length > 1 ? "paired_only" : "standalone",
  allScoredNodesIndependentlyPass: c.decisionNodes.every(n => passIds.has(n.questionVariantId)),
  independentReviewPending: c.decisionNodes.some(n => !passIds.has(n.questionVariantId)),
  resultHandling: "sequential_authored_outside_records_no_live_test_execution", pipelinePassed: false,
  selectionLimitation: "All concepts in a selected case must be unseen or due. A future-due companion can block this sequence. No selector or FSRS change proposed.",
}));
export const TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_MANIFEST = {
  ...draft, topicSlug: "transplant-immunosuppression", publicReleaseAuthorized: false,
  pipelinePassed: false, clinicalApproval: false, liveManifestEdited: false,
  reviewOrderLabel: "key shown first for review only.",
  caseCount: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES.length, nodeCount: TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_QUESTIONS.length,
  preservedIndependentPassCount: passIds.size,
  correctionCounts: packet.reviewRound2.counts,
  acceptance: "Eight exact editorial PASS nodes preserved; eleven standalone v2 corrections await independent review; four returned items parked. Melissa Rowland is the named clinical sign-off. No clinical approval or release integration.",
};
