import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type AnswerChoiceTimingRegistryEntry,
  type CaseExhibit,
  type SyntheticClinicalCase,
} from "./schema";
import packet from "../../../docs/research/question-topic-adult-urology-gynecology-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-adult-urology-gynecology-20261111.json";

/** Explicit-import authoring sidecar. Nothing here registers or executes a service. */
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_VERSION = packet.contentVersion;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_DRAFT = {
  contentVersion: ADULT_UROLOGY_GYNECOLOGY_TOPIC_VERSION,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};
const draft = ADULT_UROLOGY_GYNECOLOGY_TOPIC_DRAFT;
// A batch revision must not change an exact independently passed question's
// contentVersion. Each candidate retains its own reviewed/draft metadata.
const metadata = (record: { contentVersion: string }) => ({ ...draft, contentVersion: record.contentVersion });
const sources = ledger.sources as unknown as ClinicalSource[];
const claims = ledger.claims as unknown as EvidenceClaim[];
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_PACKET = packet;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_AUDIT = packet.audit;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_SOURCES = sources;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_EVIDENCE_CLAIMS = claims;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_REVIEW_RESPONSES = packet.independentReviewFollowup.responses;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_PARKED = packet.parked;

const labelsFor = (ids: string[]): string[] => {
  const sourceIds = new Set(claims.filter(c => ids.includes(c.id)).flatMap(c => c.sourceIds));
  return sources.filter(s => sourceIds.has(s.id)).map(s => `${s.organizationOrJournal} (${s.publicationYear ?? "undated"})`);
};

export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_QUESTIONS: QuestionVariant[] = packet.nodes.map(n => ({
  ...metadata(n),
  id: n.questionVariantId,
  conceptId: n.conceptId,
  stem: n.task,
  ...("exhibit" in n ? { exhibit: n.exhibit as CaseExhibit } : {}),
  answerChoices: n.choices.map(a => ({
    id: a.id,
    label: a.label,
    isCorrect: a.id === n.correctChoiceId,
    rationale: a.rationale,
    distractorRationale: a.id === n.correctChoiceId ? null : a.rationale,
  })),
  explanation: n.explanation,
  supportingEvidenceClaimIds: n.evidenceClaimIds,
}));

export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_CASES: SyntheticClinicalCase[] = packet.cases.map(c => {
  const nodes = c.nodeIds.map(id => {
    const node = packet.nodes.find(n => n.id === id);
    if (!node) throw new Error(`Missing topic node ${id}`);
    return node;
  });
  return syntheticClinicalCaseSchema.parse({
    id: c.id,
    displayName: `Clinic chart review: ${c.chiefComplaint}`,
    patientDisplayName: c.patientDisplayName,
    patientPresentationVariantId: c.patientPresentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    prototypeDemographics: c.prototypeDemographics,
    chiefComplaint: c.chiefComplaint,
    presentation: c.presentation,
    // This legacy schema name does not clinically approve a draft profile.
    approvedInstantiationProfiles: [{
      id: c.patientPresentationVariantId.replace("presentation.", "profile."),
      prototypeDemographics: c.prototypeDemographics,
      chiefComplaint: c.chiefComplaint,
      presentation: c.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: c.earliestFacilityStage,
    requiredClinicalSetting: c.requiredClinicalSetting,
    requiredCapabilityIds: c.requiredCapabilityIds,
    rewardTierId: "reward.clinic_basic",
    sourceLabels: labelsFor(nodes.flatMap(n => n.evidenceClaimIds)),
    decisionNodes: nodes.map((n, index) => ({
      id: n.id,
      questionVariantId: n.questionVariantId,
      primaryConceptId: n.conceptId,
      currentUpdate: n.currentUpdate,
      stem: n.task,
      ...("exhibit" in n ? { exhibit: n.exhibit as CaseExhibit } : {}),
      answerChoices: n.choices.map(a => ({
        id: a.id, label: a.label, isCorrect: a.id === n.correctChoiceId,
        rationale: a.rationale, serviceRequest: null,
      })),
      shuffleAnswers: true,
      explanation: n.explanation,
      sourceLabels: labelsFor(n.evidenceClaimIds),
      resultGateAfter: null,
      terminalDispositions: index === nodes.length - 1 ? n.choices.filter(a => a.id !== n.correctChoiceId).map(a => ({
        answerChoiceId: a.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative: "The clinic chart review ends with teaching feedback; no hospital treatment or patient outcome is simulated.",
        clinicalRationale: a.rationale,
        sourceLabels: labelsFor(a.evidenceClaimIds),
      })) : [],
    })),
    learningSummary: nodes.map(n => n.explanation).join(" "),
  });
});

export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_CONCEPT_PROPOSALS = packet.concepts;
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_CONCEPTS = packet.concepts.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  earliestFacilityStage: c.earliestFacilityStage, conceptType: c.conceptType,
}));
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_CASE_REVIEWS = packet.cases.map(c => ({
  ...metadata(c),
  caseId: c.id,
  patientPresentationVariantId: c.patientPresentationVariantId,
  profileIds: [c.patientPresentationVariantId.replace("presentation.", "profile.")],
  educationalTier: c.educationalTier,
  patientAcuity: c.patientAcuity,
  recordedPatientAcuity: c.recordedPatientAcuity,
  earliestFacilityStage: c.earliestFacilityStage,
  requiredClinicalSetting: c.requiredClinicalSetting,
  requiredCapabilityIds: c.requiredCapabilityIds,
  presentationMode: c.presentationMode,
  clinicalApproval: false,
}));

export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] =
  packet.cases.flatMap(c => c.nodeIds.map(id => {
    const n = packet.nodes.find(n => n.id === id)!;
    return answerChoiceTimingRegistryEntrySchema.parse({
      caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
      classification: n.choices.some(a => a.timingProfileId) ? {
        kind: "test_choices",
        choices: n.choices.map(a => ({
          choiceId: a.id, choiceLabel: a.label,
          timing: a.timingProfileId ? { kind: "test", timingProfileId: a.timingProfileId } : { kind: "no_test" },
        })),
      } : { kind: "no_test" },
    });
  }));

export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_ORDER_PROPOSALS = packet.cases.flatMap(c => c.nodeIds.flatMap(id => {
  const n = packet.nodes.find(n => n.id === id)!;
  return n.choices.filter(a => a.timingProfileId).map(a => ({
    ...metadata(n),
    caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
    choiceId: a.id, choiceLabel: a.label, timingProfileId: a.timingProfileId!,
    disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    serviceRequest: null, resultGateAfter: null,
    scope: a.timingScope,
    integrationOwner: "manager / shared timing and order registry owner",
  }));
}));
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_SOURCE_LINKS = sources.map(s => ({
  ...draft, sourceId: s.id, label: s.title, href: s.officialUrl,
  target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
}));
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_AUTHOR_GATES = packet.nodes.map(n => ({
  questionVariantId: n.questionVariantId, ...n.manualAuthorGate,
  closestCredibleError: n.reasoning.closestCredibleError,
  consequence: n.reasoning.consequence, deletionTest: n.reasoning.deletionTest,
  sequenceReview: n.sequenceReview, repairHistory: n.repairHistory,
}));
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_STATEMENT_MAPPINGS = ledger.statementMappings.filter(m =>
  packet.nodes.some(n => n.questionVariantId === m.questionVariantId),
);
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_COMPOSITION_PROPOSALS = packet.cases.map(c => ({
  ...metadata(c), caseId: c.id, nodeIds: c.nodeIds,
  scoredTopic: "adult-urology-gynecology", selection: c.selection,
  requiredClinicalSetting: "clinic", presentationMode: c.presentationMode,
  selectionLimitation: "Standalone after review. Re-pairing is withheld until every exact companion independently passes. No selector or FSRS change.",
  resultHandling: "Sequential authored outside records; no clinic service or hospital intervention is executed.",
}));
/** Editorial PASS is separate from clinical sign-off and manager admission. */
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_PASSED_CASES = ADULT_UROLOGY_GYNECOLOGY_TOPIC_CASES.filter(c =>
  packet.independentReviewFollowup.responses.some(r => r.status === "pass-preserved" && r.currentCaseId === c.id),
);
export const ADULT_UROLOGY_GYNECOLOGY_TOPIC_MANIFEST = {
  ...draft, topicSlug: "adult-urology-gynecology", counts: packet.counts,
  reviewOrderLabel: "key shown first for review only.",
  publicReleaseAuthorized: false, pipelinePassed: false, clinicalApproval: false,
  liveManifestEdited: false,
  reviewCounts: packet.independentReviewFollowup.counts,
  acceptance: "Five exact editorial PASS versions preserved; revised items await independent re-review. Manager admission and Melissa Rowland clinical sign-off are separate.",
};
