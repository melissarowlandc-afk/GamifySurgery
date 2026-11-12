/** Explicit-import authoring sidecar; no production registration or service execution. */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import { PEDIATRIC_PROFILE } from "./development-batch/2026-10-08-pediatric-clinic/batch-helpers";
import {
  answerChoiceTimingRegistryEntrySchema, caseExhibitSchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, testedConceptSchema, validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry, type DecisionNode, type SyntheticClinicalCase,
} from "./schema";

export const PEDIATRIC_GI_TOPIC_PACKET = packet;
export const PEDIATRIC_GI_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
const authored = {
  contentVersion: z.enum([
    "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    PEDIATRIC_GI_TOPIC_DRAFT.contentVersion,
  ]),
  reviewStatus: z.literal("needs_clinician_review"),
  aiAssistedDrafting: z.literal(true), lastClinicianReview: z.null(),
};
const sourceSchema = z.object({
  ...authored, id: z.string().startsWith("source.pediatric-gi-abdominal-wall."),
  title: z.string().min(1), completeCitation: z.string().min(1),
  organizationOrJournal: z.string().min(1), authors: z.array(z.string()).min(1),
  publicationYear: z.number().int(), doi: z.string().nullable(), pmid: z.string().nullable(),
  officialUrl: z.url(), accessedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceClass: z.enum(["professional_society_guideline", "government_guidance", "narrative_review", "systematic_review", "observational_study"]),
  licenseLabel: z.string().min(1),
  reuseStatus: z.enum(["cc_by_4_0", "cc_by_nc_4_0_restricted", "copyrighted_targeted_verification_only", "public_domain_conditions_apply"]),
  reuseNotes: z.string().min(1), authorityAssessment: z.string().min(1),
  usageRole: z.enum(["evidence", "cross_check", "both"]), evidenceClaimIds: z.array(z.string()).min(1),
}).passthrough();
const claimSchema = z.object({
  ...authored, id: z.string().startsWith("claim.pediatric-gi-abdominal-wall."),
  statement: z.string().min(1), sourceIds: z.array(z.string()).min(1),
  evidenceCategory: z.enum(["definition", "anatomy", "epidemiology", "presentation", "evaluation", "management", "disposition", "safety_boundary"]),
  certainty: z.enum(["high", "moderate", "low", "conflicting"]),
  limitation: z.string().nullable(), applicablePopulation: z.string().min(1),
  lastCheckedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).passthrough();
export const PEDIATRIC_GI_TOPIC_SOURCES: ClinicalSource[] = ledger.sources.map(s => sourceSchema.parse(s));
export const PEDIATRIC_GI_TOPIC_CLAIMS: EvidenceClaim[] = ledger.claims.map(c => claimSchema.parse(c));
export const PEDIATRIC_GI_TOPIC_REVIEW_RESPONSES = packet.independentReviewFollowup.itemResponses;
export const PEDIATRIC_GI_TOPIC_PARKED_ITEMS = packet.parkedItems;
export const PEDIATRIC_GI_TOPIC_SALVAGE = packet.salvage;
export const PEDIATRIC_GI_TOPIC_SALVAGE_PROPOSALS = packet.salvageProposals.filter(s => s.status === "salvage");
export const PEDIATRIC_GI_TOPIC_PARKED_SALVAGE = packet.salvageProposals.filter(s => s.status === "parked");
const salvageByQuestionId = new Map(PEDIATRIC_GI_TOPIC_SALVAGE_PROPOSALS.map(s => [s.questionVariantId, s]));
const intussusceptionRevision = packet.salvageReviewFollowup.intussusceptionRevision;
// Retain the exact reviewed objects separately from standalone composition.
// A former first node needs neutral final-answer metadata when split; no
// reviewed clinical field or feedback wording changes in that wrapper.
const preservedByQuestionId = new Map(packet.independentReviewFollowup.reviews
  .filter(r => r.verdict === "PASS")
  .map(r => {
    const snapshot = packet.independentReviewFollowup.reviewInput.proposals
      .find(p => p.questionVariantId === r.id);
    if (!snapshot) throw new Error(`Missing exact PASS input: ${r.id}`);
    return [r.id, snapshot] as const;
  }));
export const PEDIATRIC_GI_TOPIC_PRESERVED_REVIEW_INPUTS = [...preservedByQuestionId.values()];
const sourceById = new Map(PEDIATRIC_GI_TOPIC_SOURCES.map(s => [s.id, s]));
const claimById = new Map(PEDIATRIC_GI_TOPIC_CLAIMS.map(c => [c.id, c]));
function sourceLabels(ids: readonly string[]): string[] {
  return [...new Set(ids.flatMap(id => {
    const claim = claimById.get(id);
    if (!claim) throw new Error(`Unknown pediatric GI claim: ${id}`);
    return claim.sourceIds.map(sourceId => {
      if (!sourceById.has(sourceId)) throw new Error(`Unknown pediatric GI source: ${sourceId}`);
      return sourceId;
    });
  }))];
}
function caseForNode(id: string) {
  const clinicalCase = packet.cases.find(c => c.nodeIds.includes(id));
  if (!clinicalCase) throw new Error(`Pediatric GI node has no clinic record: ${id}`);
  return clinicalCase;
}
function template(text: string, name: string): string {
  return text.split(name).join("{patientName}");
}
export const PEDIATRIC_GI_TOPIC_QUESTIONS: QuestionVariant[] = packet.nodes.map(n => {
  if (n.questionVariantId === intussusceptionRevision.questionVariantId) {
    return structuredClone(intussusceptionRevision.question) as QuestionVariant;
  }
  const salvage = salvageByQuestionId.get(n.questionVariantId);
  if (salvage) return structuredClone(salvage.before.question) as QuestionVariant;
  const frozen = preservedByQuestionId.get(n.questionVariantId);
  if (frozen) return structuredClone(frozen.after.question) as QuestionVariant;
  const c = caseForNode(n.id);
  return {
    ...PEDIATRIC_GI_TOPIC_DRAFT, contentVersion: n.contentVersion,
    id: n.questionVariantId, conceptId: n.conceptId,
    stem: template(n.task, c.patientDisplayName), exhibit: caseExhibitSchema.parse(n.exhibit),
    answerChoices: n.choices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.id === n.keyChoiceId,
      rationale: choice.rationale,
      distractorRationale: choice.id === n.keyChoiceId ? null : choice.rationale,
    })),
    explanation: template(n.explanation, c.patientDisplayName),
    supportingEvidenceClaimIds: [...n.evidenceClaimIds],
  };
});
export const PEDIATRIC_GI_TOPIC_DECISION_NODES: DecisionNode[] = packet.nodes.map((n, i) => {
  if (n.id === intussusceptionRevision.nodeId) {
    return decisionNodeSchema.parse(structuredClone(intussusceptionRevision.node));
  }
  const salvage = salvageByQuestionId.get(n.questionVariantId);
  if (salvage) {
    decisionNodeSchema.parse(salvage.before.node);
    return structuredClone(salvage.before.node) as DecisionNode;
  }
  const frozen = preservedByQuestionId.get(n.questionVariantId);
  if (frozen) {
    decisionNodeSchema.parse(frozen.after.currentNode);
    const reviewedNode = structuredClone(frozen.after.currentNode) as DecisionNode;
    if (frozen.after.clinicalCase.decisionNodes.length > 1) {
      reviewedNode.terminalDispositions = reviewedNode.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: choice.id, kind: "no_terminal_outcome",
        consequenceNarrative: "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
        clinicalRationale: choice.rationale!, sourceLabels: [...reviewedNode.sourceLabels],
      }));
    }
    return reviewedNode;
  }
  const q = PEDIATRIC_GI_TOPIC_QUESTIONS[i]!;
  const c = caseForNode(n.id), labels = sourceLabels(n.evidenceClaimIds);
  return decisionNodeSchema.parse({
    id: n.id, questionVariantId: q.id, primaryConceptId: q.conceptId,
    currentUpdate: template(n.currentUpdate, c.patientDisplayName), stem: q.stem, exhibit: q.exhibit,
    answerChoices: q.answerChoices.map(choice => ({
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
      rationale: choice.rationale!, serviceRequest: null,
    })),
    shuffleAnswers: true, explanation: q.explanation, sourceLabels: labels, resultGateAfter: null,
    terminalDispositions: c.nodeIds.at(-1) === n.id ? q.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id, kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
      clinicalRationale: choice.rationale!, sourceLabels: labels,
    })) : [],
  });
});
const nodeById = new Map(PEDIATRIC_GI_TOPIC_DECISION_NODES.map(n => [n.id, n]));
export const PEDIATRIC_GI_TOPIC_CASES: SyntheticClinicalCase[] = packet.cases.map(c => {
  const nodes = c.nodeIds.map(id => {
    const n = nodeById.get(id);
    if (!n) throw new Error(`Missing pediatric GI case node: ${id}`);
    return n;
  });
  const frozen = preservedByQuestionId.get(nodes[0]!.questionVariantId);
  const salvage = salvageByQuestionId.get(nodes[0]!.questionVariantId);
  if (frozen && !salvage) {
    const reviewedCase = structuredClone(frozen.after.clinicalCase) as SyntheticClinicalCase;
    if (reviewedCase.decisionNodes.length === 1) {
      syntheticClinicalCaseSchema.parse(reviewedCase);
      return reviewedCase;
    }
    // Only composition identities and removed-companion fields change. The
    // exact reviewed clinical header, finite profile, node and question remain.
    reviewedCase.id = c.id;
    reviewedCase.patientPresentationVariantId = c.patientPresentationVariantId;
    for (const profile of reviewedCase.approvedInstantiationProfiles ?? []) {
      profile.id = c.patientPresentationVariantId.replace("presentation.", "profile.");
    }
    reviewedCase.decisionNodes = nodes;
    reviewedCase.sourceLabels = [...new Set(nodes.flatMap(n => n.sourceLabels))];
    reviewedCase.learningSummary = nodes.map(n => n.explanation).join(" ");
    syntheticClinicalCaseSchema.parse(reviewedCase);
    return reviewedCase;
  }
  const presentation = template(c.presentation, c.patientDisplayName);
  return syntheticClinicalCaseSchema.parse({
    id: c.id, displayName: c.displayName, patientDisplayName: c.patientDisplayName,
    patientPresentationVariantId: c.patientPresentationVariantId,
    prototypeDemographics: c.prototypeDemographics, chiefComplaint: c.chiefComplaint, presentation,
    ...(salvage ? { pediatricProfile: PEDIATRIC_PROFILE } : {}),
    // The child attends clinic now. The historical infant age stays in the
    // record-review wrapper; it is never used as the current child-art age.
    approvedInstantiationProfiles: [{
      id: c.patientPresentationVariantId.replace("presentation.", "profile."),
      prototypeDemographics: c.prototypeDemographics, chiefComplaint: c.chiefComplaint, presentation,
      ...(salvage ? { pediatricProfile: PEDIATRIC_PROFILE } : {}),
    }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: c.earliestFacilityStage,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [...c.requiredCapabilityIds],
    rewardTierId: "reward.clinic_basic", sourceLabels: [...new Set(nodes.flatMap(n => n.sourceLabels))],
    decisionNodes: nodes, learningSummary: nodes.map(n => n.explanation).join(" "),
  });
});
export const PEDIATRIC_GI_TOPIC_SALVAGE_CASES = PEDIATRIC_GI_TOPIC_CASES.filter(c =>
  c.decisionNodes.some(n => salvageByQuestionId.has(n.questionVariantId)));
export const PEDIATRIC_GI_TOPIC_SALVAGE_QUESTIONS = PEDIATRIC_GI_TOPIC_QUESTIONS.filter(q => salvageByQuestionId.has(q.id));
export const PEDIATRIC_GI_TOPIC_SALVAGE_NODES = PEDIATRIC_GI_TOPIC_DECISION_NODES.filter(n => salvageByQuestionId.has(n.questionVariantId));
// Only this revised context is queued for another salvage review. The four
// current PASS contexts stay available unchanged; gastroschisis is archived.
export const PEDIATRIC_GI_TOPIC_SALVAGE_REVIEW_PROPOSALS = PEDIATRIC_GI_TOPIC_SALVAGE_PROPOSALS.filter(s =>
  s.questionVariantId === intussusceptionRevision.questionVariantId);
export const PEDIATRIC_GI_TOPIC_SALVAGE_REVIEW_CASES = PEDIATRIC_GI_TOPIC_SALVAGE_CASES.filter(c =>
  c.id === intussusceptionRevision.caseId);
export const PEDIATRIC_GI_TOPIC_AUTHORING_CONCEPTS = packet.concepts;
export const PEDIATRIC_GI_TOPIC_TESTED_CONCEPTS = packet.concepts.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  earliestFacilityStage: c.earliestFacilityStage, conceptType: c.conceptType,
}));
export const PEDIATRIC_GI_TOPIC_CASE_REVIEWS = packet.cases.map(c => ({
  ...PEDIATRIC_GI_TOPIC_DRAFT, contentVersion: c.contentVersion,
  caseId: c.id, educationalTier: c.educationalTier,
  patientAcuity: c.acuity, earliestFacilityStage: c.earliestFacilityStage,
  requiredClinicalSetting: c.requiredClinicalSetting, requiredCapabilityIds: c.requiredCapabilityIds,
  presentationMode: c.presentationMode, nodeAcuities: packet.nodes.filter(n => c.nodeIds.includes(n.id)).map(n => ({
    nodeId: n.id, recordedPatientAcuity: n.recordedPatientAcuity,
  })),
}));
export const PEDIATRIC_GI_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = packet.nodes.map(n =>
  answerChoiceTimingRegistryEntrySchema.parse(salvageByQuestionId.get(n.questionVariantId)?.runtimeTiming ?? {
    caseId: caseForNode(n.id).id, nodeId: n.id, questionVariantId: n.questionVariantId,
    classification: n.choices.some(c => c.timingProfileId) ? {
      kind: "test_choices", choices: n.choices.map(c => ({
        choiceId: c.id, choiceLabel: c.label,
        timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" },
      })),
    } : { kind: "no_test" },
  }),
);
// Outside-hospital procedures in the historical record are not clinic orders.
// Retain their former placeholder metadata without registering pediatric tests.
export const PEDIATRIC_GI_TOPIC_OUTSIDE_RECORD_TIMING = packet.salvageProposals.map(s => s.before.timing);
export const PEDIATRIC_GI_TOPIC_OUTSIDE_RECORD_ORDER_PROPOSALS = packet.salvageProposals.flatMap(s => s.before.orders);
export const PEDIATRIC_GI_TOPIC_SALVAGE_TIMING_ENTRIES = PEDIATRIC_GI_TOPIC_TIMING_ENTRIES.filter(t => salvageByQuestionId.has(t.questionVariantId));
export const PEDIATRIC_GI_TOPIC_ORDER_PROPOSALS = packet.nodes.filter(n => !salvageByQuestionId.has(n.questionVariantId)).flatMap(n => n.choices.flatMap(c =>
  c.timingProfileId ? [{
    caseId: caseForNode(n.id).id, nodeId: n.id, questionVariantId: n.questionVariantId,
    choiceId: c.id, choiceLabel: c.label, timingProfileId: c.timingProfileId,
    disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    scope: "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed.",
  }] : [],
));
export const PEDIATRIC_GI_TOPIC_SOURCE_LINKS = PEDIATRIC_GI_TOPIC_SOURCES.map(s => ({
  sourceId: s.id, label: s.title, href: s.officialUrl!, target: "_blank" as const,
  rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
}));
export const PEDIATRIC_GI_TOPIC_STATEMENT_MAPPINGS = ledger.statementMappings;
export const PEDIATRIC_GI_TOPIC_AUTHOR_CHECKS = packet.nodes.map(n => ({
  ...PEDIATRIC_GI_TOPIC_DRAFT, contentVersion: n.contentVersion, questionVariantId: n.questionVariantId,
  ...n.authorGate, reasoning: n.reasoning,
}));
export const PEDIATRIC_GI_TOPIC_AUDIT = packet.audit;
export const PEDIATRIC_GI_TOPIC_HELD_PLANNING = packet.heldPlanning;
export const PEDIATRIC_GI_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic pediatric GI authoring preview; not clinically approved. All current clinical versions need clinician review by Melissa Rowland. Four exact editorial PASS items are preserved; eight revisions await independent re-review. Five parked items have no executable key. Tests are not clinical approval.",
  concepts: PEDIATRIC_GI_TOPIC_TESTED_CONCEPTS, cases: PEDIATRIC_GI_TOPIC_CASES,
});
export const PEDIATRIC_GI_TOPIC_MANIFEST = {
  ...PEDIATRIC_GI_TOPIC_DRAFT, ...packet.counts,
  sourceCount: PEDIATRIC_GI_TOPIC_SOURCES.length, claimCount: PEDIATRIC_GI_TOPIC_CLAIMS.length,
  testingChoiceCount: PEDIATRIC_GI_TOPIC_ORDER_PROPOSALS.length,
  independentPass: false, managerAccepted: false, clinicalApproval: false,
  reviewOrderNotice: "key shown first for review only", integration: "explicit-import authoring sidecar only",
} as const;
