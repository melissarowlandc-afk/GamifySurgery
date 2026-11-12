import { createHash } from "node:crypto";
import {beforeProgramBatch3AcceptanceSource} from "./question-program-batch3-acceptance-test-support";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import { ROW_051_CLINICAL_APPROVAL } from "./approved-data/pancreatic-tail-adenocarcinoma-resection";
import * as round2 from "./question-topic-pancreas-chronic-cysts-neoplasia-20261111";
import { PROGRAM_BATCH2_VIEWS } from "./question-program-batch2-accepted-data-20261111";
import {
  PANCREAS_TOPIC_AUTHORING_CONCEPTS as concepts,
  PANCREAS_TOPIC_AUTHOR_CHECKS as checks,
  PANCREAS_TOPIC_CASE_DEFINITIONS as definitions,
  PANCREAS_TOPIC_CASE_REVIEWS as caseReviews,
  PANCREAS_TOPIC_CASES as cases,
  PANCREAS_TOPIC_CLAIMS as claims,
  PANCREAS_TOPIC_MANIFEST as manifest,
  PANCREAS_TOPIC_ORDER_PROPOSALS as orders,
  PANCREAS_TOPIC_PREVIEW_RELEASE as preview,
  PANCREAS_TOPIC_QUESTIONS as questions,
  PANCREAS_TOPIC_SOURCES as sources,
  PANCREAS_TOPIC_SOURCE_LINKS as links,
  PANCREAS_TOPIC_STATEMENT_MAPPINGS as mappings,
  PANCREAS_TOPIC_TIMING_ENTRIES as timings,
} from "./question-topic-pancreas-chronic-cysts-neoplasia-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const hash = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const slug = "pancreas-chronic-cysts-neoplasia";
const packetPath = `docs/research/question-topic-${slug}-20261111.json`;
interface Inventory { recordId: string; primaryTopicSlug: string; variantIds: string[]; declaredClinicalReviewStatuses: string[]; }
interface Audit {
  recordId: string; verdict: "Keep" | "Rewrite" | "Retire-and-replace"; reasons: string;
  replacementQuestionVariantIds: string[]; beforeQuestionSha256: string; contextAudits: Array<{ contextSha256: string; disposition: string }>;
}
interface Packet {
  assignment: { inventory: Inventory[]; recordedHolds: Array<{ id: string }>; frozenReferences: Array<{ kind: string; record?: unknown }> };
  inputHashes: Array<{ file: string; snapshotSha256: string; currentSha256: string }>;
  drift: unknown[];
  beforeVersions: Array<{ recordId: string; contexts: Array<{ contextSha256: string; nodeSha256: string; context: { currentNode: unknown } }>; questions: Array<{ sha256: string; question: unknown }> }>;
  audit: Audit[];
  counts: Record<string, number>;
  proposals: Array<{ questionVariantId: string; conceptId: string; before: unknown[]; kind: string; exactAfterSha256: string; after: unknown; reviewStatus: string }>;
  existingHoldDispositions: Array<{ id: string; disposition: string }>;
  ownerApprovalsNeeded: Array<{ id: string; affectedQuestionVariantIds: string[]; exactQuestion: string }>;
}
const packet = JSON.parse(read(packetPath)) as Packet;
const ledger = JSON.parse(read(`docs/research/sources-question-topic-${slug}-20261111.json`)) as {
  sources: typeof sources; evidenceClaims: typeof claims;
  sourceToClaim: Array<{ sourceId: string; evidenceClaimIds: string[] }>;
  claimToQuestion: Array<{ claimId: string; questionVariantIds: string[] }>;
  exactValueProvenance: Array<{ claimId: string; sourceIds: string[]; sourceLocator: string; values: string[] }>;
  excludedOrLimitedCandidates: Array<{ disposition: string; evidenceClaimIds: string[] }>;
};

describe("pancreas chronic/cysts/neoplasia explicit-import authoring packet", () => {
  it("validates every draft case through the existing release contract without admitting it", () => {
    expect(() => validateSyntheticClinicalRelease(preview)).not.toThrow();
    expect(cases).toHaveLength(11);
    expect(questions).toHaveLength(20);
    expect(concepts).toHaveLength(20);
    expect(cases.filter(c => c.decisionNodes.length > 1)).toHaveLength(8);
    expect(manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false });
    const source = read("packages/clinical-content/src/synthetic-content.ts");
    const barrel = read("packages/clinical-content/src/index.ts");
    expect(source).not.toContain(`question-topic-${slug}`);
    expect(barrel).not.toContain(`question-topic-${slug}`);
  });

  it("reconciles the complete assigned inventory and every distinct captured case/node context", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as { inventory: Inventory[] };
    const assigned = program.inventory.filter(i => i.primaryTopicSlug === slug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(17);
    expect(packet.audit.map(a => a.recordId).sort()).toEqual(assigned.map(a => a.recordId).sort());
    expect(new Set(packet.audit.map(a => a.recordId)).size).toBe(17);
    expect(packet.audit.filter(a => a.verdict === "Keep")).toHaveLength(5);
    expect(packet.audit.filter(a => a.verdict === "Rewrite")).toHaveLength(2);
    expect(packet.audit.filter(a => a.verdict === "Retire-and-replace")).toHaveLength(10);
    for (const a of packet.audit) {
      expect(a.reasons.length).toBeGreaterThan(120);
      const before = packet.beforeVersions.find(b => b.recordId === a.recordId)!;
      expect(a.contextAudits).toHaveLength(before.contexts.length);
      expect(a.beforeQuestionSha256).toBe(before.questions[0]!.sha256);
      for (const q of before.questions) expect(hash(q.question)).toBe(q.sha256);
      for (const c of before.contexts) {
        expect(hash(c.context)).toBe(c.contextSha256);
        expect(hash(c.context.currentNode)).toBe(c.nodeSha256);
        expect(a.contextAudits.some(v => v.contextSha256 === c.contextSha256 && v.disposition.length > 30)).toBe(true);
      }
      if (a.verdict !== "Keep") expect(a.replacementQuestionVariantIds.every(id => questions.some(q => q.id === id))).toBe(true);
    }
  });

  it("retains all exact clinical approvals and the unresolved old N2 editorial park", () => {
    const frozen = packet.assignment.frozenReferences.find(f => f.kind === "clinical_approval_exact_unchanged")!;
    expect(frozen.record).toEqual(ROW_051_CLINICAL_APPROVAL);
    const approved = packet.assignment.inventory.filter(i => i.declaredClinicalReviewStatuses.includes("clinically_approved"));
    expect(approved).toHaveLength(5);
    expect(approved.every(i => packet.audit.find(a => a.recordId === i.recordId)?.verdict === "Keep")).toBe(true);
    expect(packet.assignment.recordedHolds.map(h => h.id)).toEqual(["review.n2.pancreatic-cyst-predates-pancreatitis.v3"]);
    expect(packet.existingHoldDispositions).toEqual(expect.arrayContaining([expect.objectContaining({ id: "review.n2.pancreatic-cyst-predates-pancreatitis.v3", disposition: "preserve_exact_old_park_pending_independent_review" })]));
  });

  it("detects drift of exact preserved source inputs without accepting new hashes automatically", () => {
    expect(packet.drift).toEqual([]);
    for (const i of packet.inputHashes) {
      const authorized = salvagePacket.authorizedInputDrift.find(d => d.file === i.file);
      if (authorized) {
        expect(authorized.originalCurrentSha256).toBe(i.currentSha256);
        expect(authorized.originalSnapshotSha256).toBe(i.snapshotSha256);
        expect(hash(read(authorized.managerEvidencePath))).toBe(authorized.managerEvidenceSha256);
        const evidence = JSON.parse(read(authorized.managerEvidencePath)) as { existingClinicalFiles: Array<{ path: string; afterSha256: string }> };
        expect(evidence.existingClinicalFiles.find(f => f.path === i.file)?.afterSha256).toBe(authorized.observedSha256);
        expect(hash(beforeProgramBatch3AcceptanceSource(i.file, read(i.file)))).toBe(authorized.observedSha256);
      } else expect(hash(beforeProgramBatch3AcceptanceSource(i.file, read(i.file)))).toBe(i.currentSha256);
      if (i.snapshotSha256) expect(i.currentSha256).toBe(i.snapshotSha256);
    }
  });

  it("separates stable concept reuse from eighteen new meanings and retains previous IDs", () => {
    const reused = concepts.filter(c => !c.id.startsWith(`concept.${slug}.`)).map(c => c.id).sort();
    expect(reused).toEqual(["concept.n2r3.pancreatic-referral-target-characterization", "concept.pancreatic-cyst.mrcp-duct-assessment"].sort());
    expect(concepts.filter(c => c.id.startsWith(`concept.${slug}.`))).toHaveLength(18);
    expect(concepts.filter(c => c.previousConceptId !== null)).toHaveLength(3);
    expect(packet.counts).toMatchObject({ audited: 17, kept: 5, rewritten: 2, retiredAndReplacedProposed: 10, new: 18, proposedQuestions: 20, reusedConcepts: 2, newConcepts: 18 });
  });

  it("uses named finite clinic profiles and holds hospital work inside existing chart-review frames", () => {
    for (const [i, c] of cases.entries()) {
      const d = definitions[i]!;
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(c.patientDisplayName).toBe(d.name);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.prototypeDemographics).toEqual({ ageYears: d.age, sexLabel: d.sex });
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${d.age}-year-old`);
      expect(c.tutorialEligible).toBe(false);
      expect(caseReviews[i]).toMatchObject({ reviewStatus: "needs_clinician_review", educationalTier: 1, patientAcuity: "stable_in_clinic", earliestFacilityStage: 1 });
      if (d.frame === "outside_hospital_chart_review") expect(c.presentation).toMatch(/outside|hospital/);
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices).toHaveLength(3);
        expect(n.answerChoices.filter(o => o.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.every(o => o.serviceRequest === null)).toBe(true);
        expect(n.resultGateAfter).toBeNull();
        expect(n.stem).toContain("{patientName}");
      }
    }
  });

  it("maps exact choice identities and labels to existing wait profiles, including diagnostic distractors", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timings).toHaveLength(20);
    for (const t of timings) {
      expect(() => answerChoiceTimingRegistryEntrySchema.parse(t)).not.toThrow();
      const n = cases.flatMap(c => c.decisionNodes).find(n => n.id === t.nodeId)!;
      if (t.classification.kind !== "test_choices") continue;
      expect(t.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.answerChoices.map(o => [o.id, o.label]));
      for (const o of t.classification.choices) if (o.timing.kind === "test") expect(profiles.has(o.timing.timingProfileId)).toBe(true);
    }
    const cta = timings.find(t => t.questionVariantId.includes("postop-transient-drain-bleed"))!;
    expect(cta.classification.kind).toBe("test_choices");
    if (cta.classification.kind === "test_choices") expect(cta.classification.choices.find(o => o.choiceId.includes(".cta."))!.timing).toEqual({ kind: "test", timingProfileId: "timing.test.ct_angiography" });
    expect(orders.every(o => o.serviceRequest === null && o.resultGateAfter === null)).toBe(true);
  });

  it("keeps sources and independently written atomic claims in a closed bidirectional provenance graph", () => {
    expect(ledger.sources).toEqual(sources);
    expect(ledger.evidenceClaims).toEqual(claims);
    expect(new Set(sources.map(s => s.id)).size).toBe(sources.length);
    expect(new Set(claims.map(c => c.id)).size).toBe(claims.length);
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(60);
      expect(s.authorityAssessment.length).toBeGreaterThan(40);
      expect(s.reuseNotes.length).toBeGreaterThan(40);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.authors.length).toBeGreaterThan(0);
      expect(ledger.sourceToClaim.find(v => v.sourceId === s.id)?.evidenceClaimIds).toEqual(s.evidenceClaimIds);
    }
    for (const c of claims) {
      expect(c.reviewStatus).toBe("needs_clinician_review");
      expect(c.lastClinicianReview).toBeNull();
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation).toBeTruthy();
      expect(c.sourceIds.every(id => sources.some(s => s.id === id && s.evidenceClaimIds.includes(c.id)))).toBe(true);
      expect(ledger.claimToQuestion.find(v => v.claimId === c.id)?.questionVariantIds.sort()).toEqual(questions.filter(q => q.supportingEvidenceClaimIds.includes(c.id)).map(q => q.id).sort());
    }
    for (const q of questions) expect(q.supportingEvidenceClaimIds.every(id => claims.some(c => c.id === id))).toBe(true);
    expect(ledger.exactValueProvenance.every(v => v.sourceIds.length && v.sourceLocator.length > 15 && v.values.length)).toBe(true);
    expect(ledger.excludedOrLimitedCandidates.every(v => v.evidenceClaimIds.length === 0)).toBe(true);
  });

  it("preserves concrete manual reasoning, counterfactuals and checks for all exact drafts", () => {
    expect(checks).toHaveLength(20);
    expect(mappings).toHaveLength(20);
    for (const d of definitions) for (const n of d.nodes) {
      expect(n.choices.some(o => o.id === n.gate.counterfactualChoiceId && !o.isCorrect)).toBe(true);
      const gate = checks.find(g => g.questionVariantId.includes(`.${n.slug}.v1`))!;
      for (const field of [gate.interpret, gate.apply, gate.closestError, gate.decidingObservation, gate.consequence, gate.counterfactual, gate.deletionTest, gate.cueAttack, gate.stageCategory, gate.difficulty, gate.singleBest, gate.fullVisibleSequenceCheck]) expect(field.length).toBeGreaterThan(25);
      expect(gate.pipelinePassed).toBe(false);
      expect(gate.reviewStatus).toBe("needs_clinician_review");
      expect(gate.distractorChecks).toHaveLength(2);
      for (const x of gate.distractorChecks) {
        expect(x.temptation.length).toBeGreaterThan(15);
        expect(x.rankingRationale.length).toBeGreaterThan(30);
        expect(x.counterfactual.length).toBeGreaterThan(25);
      }
    }
  });

  it("binds review packets to exact current after versions and explicitly empty before fields for new gaps", () => {
    expect(packet.proposals).toHaveLength(20);
    expect(packet.proposals.filter(p => p.kind === "Rewrite")).toHaveLength(2);
    expect(packet.proposals.filter(p => p.kind === "New")).toHaveLength(18);
    for (const p of packet.proposals) {
      expect(p.exactAfterSha256).toBe(hash(p.after));
      expect(p.reviewStatus).toBe("needs_clinician_review");
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === p.questionVariantId))!;
      const n = c.decisionNodes.find(n => n.questionVariantId === p.questionVariantId)!;
      expect(p.after).toMatchObject({ case: c, node: n, question: questions.find(q => q.id === p.questionVariantId), reviewOrderNotice: "key shown first for review only", runtimeShuffleAnswers: true });
      if (p.kind === "New") expect(p.before).toEqual([]);
      else expect(p.before.length).toBe(1);
    }
  });

  it("provides safe static source links and precise outstanding clinical questions", () => {
    for (const l of links) expect(l).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    expect(packet.ownerApprovalsNeeded.length).toBeGreaterThanOrEqual(4);
    expect(packet.ownerApprovalsNeeded.every(a => a.exactQuestion.length > 50)).toBe(true);
    expect(packet.ownerApprovalsNeeded.flatMap(a => a.affectedQuestionVariantIds).every(id => questions.some(q => q.id === id) || id === "question.n2.pancreatic-cyst-predates-pancreatitis.v3")).toBe(true);
    const authored = read(`packages/clinical-content/src/question-topic-${slug}-20261111.ts`);
    expect(authored).not.toMatch(/\b(?:fetch|XMLHttpRequest)\s*\(/);
    expect(authored).not.toMatch(/\b(?:localStorage|indexedDB)\b/);
  });
});


interface RevisionAfter {
  case: (typeof cases)[number]; node: (typeof cases)[number]["decisionNodes"][number]; question: (typeof questions)[number];
  reviewOrderNotice: string; runtimeShuffleAnswers: boolean;
  authorGate: (typeof round2.PANCREAS_TOPIC_R2_ATTEMPT_AUTHOR_CHECKS)[number];
  statementMapping: (typeof mappings)[number]; timing: (typeof timings)[number];
  concept: (typeof round2.PANCREAS_TOPIC_R2_ATTEMPT_AUTHORING_CONCEPTS)[number];
}
interface RevisionRecord {
  reviewedQuestionVariantId: string; currentQuestionVariantId: string | null; attemptQuestionVariantId?: string;
  status: "pass-preserved" | "revised" | "parked"; reviewStatus: string; attempts: number;
  exactBeforeAfterSha256?: string; completeCaseSha256?: string; exactAfterSha256?: string;
  before?: { exactAfterSha256: string; artifact: unknown }; after?: RevisionAfter;
  resolution?: { clarity: string; cues: string; fairness: string; suggestions: string; outcome: string };
  identity?: { previousVersionConceptId: string; currentConceptId: string; clinicalMeaningChanged: boolean; historyTransfer: boolean };
  parkReason?: string | null; previewEligible?: boolean;
}
const revision = (JSON.parse(read(packetPath)) as { reviewResponse: {
  reviewPath: string; reviewSha256: string; reviewedV1Hashes: Record<string, string>; records: RevisionRecord[];
  counts: Record<string, number>; currentPreview: unknown; currentCatalogQuestionVariantIds: string[];
} }).reviewResponse;
const revisedLedger = (JSON.parse(read('docs/research/sources-question-topic-pancreas-chronic-cysts-neoplasia-20261111.json')) as { reviewResponse: {
  sources: typeof sources; evidenceClaims: typeof claims;
  sourceToClaim: Array<{ sourceId: string; evidenceClaimIds: string[] }>;
  claimToQuestion: Array<{ claimId: string; questionVariantIds: string[] }>;
  questionToClaim: Array<{ questionVariantId: string; evidenceClaimIds: string[]; status: string }>;
  statementMappings: typeof mappings; additionalSourceIds: string[]; additionalClaimIds: string[];
} }).reviewResponse;

describe("pancreas independent-review response and frozen PASS contexts", () => {
  it("keeps every exported v1 artifact and each complete PASS case exactly as captured before revision", () => {
    expect(Object.keys(revision.reviewedV1Hashes).length).toBeGreaterThan(15);
    const exports = round2 as unknown as Record<string, unknown>;
    for (const [name, digest] of Object.entries(revision.reviewedV1Hashes)) expect(hash(exports[name]), name).toBe(digest);
    const reviews = JSON.parse(read(revision.reviewPath)) as Array<{ id: string; verdict: string }>;
    expect(hash(read(revision.reviewPath))).toBe(revision.reviewSha256);
    const passIds = reviews.filter(r => r.verdict === "PASS").map(r => r.id).sort();
    expect(passIds).toHaveLength(8);
    expect(round2.PANCREAS_TOPIC_R2_PASS_IDS.slice().sort()).toEqual(passIds);
    for (const r of revision.records.filter(r => r.status === "pass-preserved")) {
      const before = packet.proposals.find(p => p.questionVariantId === r.reviewedQuestionVariantId)!;
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === r.reviewedQuestionVariantId))!;
      expect(r.currentQuestionVariantId).toBe(r.reviewedQuestionVariantId);
      expect(r.exactBeforeAfterSha256).toBe(before.exactAfterSha256);
      expect(r.completeCaseSha256).toBe(hash(c));
      expect(r.attempts).toBe(0);
      expect(r.after).toBeUndefined();
    }
  });

  it("disposes of all 20 reviewed items with one exact attempt per returned item and no automatic new PASS", () => {
    const reviews = JSON.parse(read(revision.reviewPath)) as Array<{ id: string; verdict: string }>;
    expect(revision.records.map(r => r.reviewedQuestionVariantId).sort()).toEqual(reviews.map(r => r.id).sort());
    expect(revision.records.filter(r => r.status === "pass-preserved")).toHaveLength(8);
    expect(revision.records.filter(r => r.status === "revised")).toHaveLength(11);
    expect(revision.records.filter(r => r.status === "parked")).toHaveLength(1);
    expect(round2.PANCREAS_TOPIC_R2_MANIFEST).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false, publicReleaseAuthorized: false });
    for (const r of revision.records.filter(r => r.status !== "pass-preserved")) {
      expect(r.attempts).toBe(1);
      expect(r.attemptQuestionVariantId).toBe(r.reviewedQuestionVariantId.replace(/\.v1$/, ".v2"));
      expect(r.before!.exactAfterSha256).toBe(packet.proposals.find(p => p.questionVariantId === r.reviewedQuestionVariantId)!.exactAfterSha256);
      expect(hash(r.before!.artifact)).toBe(r.before!.exactAfterSha256);
      expect(r.exactAfterSha256).toBe(hash(r.after));
      expect(r.after!.question).toEqual(round2.PANCREAS_TOPIC_R2_ATTEMPT_QUESTIONS.find(q => q.id === r.attemptQuestionVariantId));
      expect(r.after!.case).toEqual(round2.PANCREAS_TOPIC_R2_ATTEMPT_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === r.attemptQuestionVariantId)));
      expect(r.after!.question.reviewStatus).toBe("needs_clinician_review");
      expect(r.after!.reviewOrderNotice).toBe("key shown first for review only");
      expect(r.after!.runtimeShuffleAnswers).toBe(true);
      for (const field of Object.values(r.resolution!)) expect(field.length).toBeGreaterThan(40);
      if (r.status === "parked") {
        expect(r.currentQuestionVariantId).toBeNull();
        expect(r.previewEligible).toBe(false);
        expect(r.parkReason!.length).toBeGreaterThan(50);
      } else expect(r.currentQuestionVariantId).toBe(r.attemptQuestionVariantId);
    }
  });

  it("excludes the parked attempt and all mixed v1 contexts from the active preview without changing PASS composition", () => {
    const p = round2.PANCREAS_TOPIC_R2_PREVIEW_RELEASE;
    expect(() => validateSyntheticClinicalRelease(p)).not.toThrow();
    expect(revision.currentPreview).toEqual(p);
    expect(p.cases).toHaveLength(10);
    expect(p.cases.flatMap(c => c.decisionNodes)).toHaveLength(13);
    expect(round2.PANCREAS_TOPIC_R2_CURRENT_QUESTIONS).toHaveLength(19);
    expect(revision.currentCatalogQuestionVariantIds).toEqual(round2.PANCREAS_TOPIC_R2_CURRENT_QUESTIONS.map(q => q.id));
    expect(round2.PANCREAS_TOPIC_R2_CASES.filter(c => c.decisionNodes.length > 1)).toHaveLength(3);
    expect(round2.PANCREAS_TOPIC_R2_CONTEXT_HOLDS.flatMap(h => h.questionVariantIds)).toHaveLength(6);
    for (const h of round2.PANCREAS_TOPIC_R2_CONTEXT_HOLDS) {
      expect(p.cases.some(c => c.id === h.caseId)).toBe(false);
      expect(round2.PANCREAS_TOPIC_R2_PASS_CONTEXTS.find(c => c.id === h.caseId)).toEqual(cases.find(c => c.id === h.caseId));
    }
    const ids = p.cases.flatMap(c => c.decisionNodes.map(n => n.questionVariantId));
    expect(ids.some(id => id.endsWith("cyst-duct-study.v2"))).toBe(false);
    for (const c of p.cases) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.prototypeDemographics!.ageYears).toBeGreaterThan(17);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(o => o.serviceRequest === null)).toBe(true);
      }
    }
  });

  it("retains nine stable concepts and links two new clinical meanings without transferring old histories", () => {
    const revised = revision.records.filter(r => r.status === "revised");
    expect(revised.filter(r => r.identity!.clinicalMeaningChanged)).toHaveLength(2);
    expect(revised.filter(r => !r.identity!.clinicalMeaningChanged)).toHaveLength(9);
    for (const r of revised) {
      expect(r.identity!.historyTransfer).toBe(false);
      if (r.identity!.clinicalMeaningChanged) {
        expect(r.after!.concept.previousConceptId).toBe(r.identity!.previousVersionConceptId);
        expect(r.identity!.currentConceptId).not.toBe(r.identity!.previousVersionConceptId);
        expect(concepts.some(c => c.id === r.identity!.previousVersionConceptId)).toBe(true);
      } else expect(r.identity!.currentConceptId).toBe(r.identity!.previousVersionConceptId);
    }
  });

  it("closes the additive source/claim/statement graph for exact PASS versions and all revision attempts", () => {
    expect(revisedLedger.sources).toEqual(round2.PANCREAS_TOPIC_R2_SOURCES);
    expect(revisedLedger.evidenceClaims).toEqual(round2.PANCREAS_TOPIC_R2_CLAIMS);
    expect(revisedLedger.additionalSourceIds).toHaveLength(4);
    expect(revisedLedger.additionalClaimIds).toHaveLength(6);
    const artifacts = [...round2.PANCREAS_TOPIC_R2_PASS_QUESTIONS, ...round2.PANCREAS_TOPIC_R2_ATTEMPT_QUESTIONS];
    expect(artifacts).toHaveLength(20);
    expect(new Set(artifacts.map(q => q.id)).size).toBe(20);
    for (const s of revisedLedger.sources) {
      expect(revisedLedger.sourceToClaim.find(x => x.sourceId === s.id)!.evidenceClaimIds).toEqual(s.evidenceClaimIds);
      expect(s.completeCitation.length).toBeGreaterThan(60);
      expect(s.authorityAssessment.length).toBeGreaterThan(40);
      expect(s.reuseNotes.length).toBeGreaterThan(40);
    }
    for (const c of revisedLedger.evidenceClaims) {
      expect(c.sourceIds.length).toBeGreaterThan(0);
      expect(c.sourceIds.every(id => revisedLedger.sources.some(s => s.id === id && s.evidenceClaimIds.includes(c.id)))).toBe(true);
      expect(c.reviewStatus).toBe("needs_clinician_review");
      expect(c.lastClinicianReview).toBeNull();
      expect(revisedLedger.claimToQuestion.find(x => x.claimId === c.id)!.questionVariantIds.sort()).toEqual(artifacts.filter(q => q.supportingEvidenceClaimIds.includes(c.id)).map(q => q.id).sort());
    }
    for (const q of artifacts) {
      expect(q.supportingEvidenceClaimIds.every(id => revisedLedger.evidenceClaims.some(c => c.id === id))).toBe(true);
      expect(revisedLedger.questionToClaim.find(x => x.questionVariantId === q.id)!.evidenceClaimIds).toEqual(q.supportingEvidenceClaimIds);
      const mapping = revisedLedger.statementMappings.find(x => x.questionVariantId === q.id)!;
      expect(mapping.constructedObservations.basis.length).toBeGreaterThan(40);
      expect(mapping.clinicalAssertions).toHaveLength(4);
      expect(mapping.clinicalAssertions.every(x => x.evidenceClaimIds.length > 0)).toBe(true);
    }
  });

  it("preserves exact timing identities, genuine counterfactual choices and manual reasoning for the new attempts", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    const definitions = round2.PANCREAS_TOPIC_R2_CASE_DEFINITIONS;
    for (const [i, c] of round2.PANCREAS_TOPIC_R2_ATTEMPT_CASES.entries()) {
      const d = definitions[i]!;
      expect(c.patientDisplayName).toBe(d.name);
      expect(c.prototypeDemographics).toEqual({ ageYears: d.age, sexLabel: d.sex });
      expect(c.presentation).toContain(d.age + "-year-old");
      for (const n of c.decisionNodes) {
        const definition = d.nodes.find(x => n.id.includes("." + x.slug + ".v2"))!;
        expect(definition.choices.some(o => o.id === definition.gate.counterfactualChoiceId && !o.isCorrect)).toBe(true);
        const gate = round2.PANCREAS_TOPIC_R2_ATTEMPT_AUTHOR_CHECKS.find(g => g.questionVariantId === n.questionVariantId)!;
        for (const v of [gate.interpret, gate.apply, gate.closestError, gate.decidingObservation, gate.counterfactual, gate.deletionTest, gate.cueAttack, gate.singleBest]) expect(v.length).toBeGreaterThan(30);
        expect(gate.pipelinePassed).toBe(false);
        expect(gate.distractorChecks).toHaveLength(2);
        expect(n.answerChoices.filter(o => o.isCorrect)).toHaveLength(1);
        const timing = round2.PANCREAS_TOPIC_R2_ATTEMPT_TIMING_ENTRIES.find(t => t.nodeId === n.id)!;
        expect(() => answerChoiceTimingRegistryEntrySchema.parse(timing)).not.toThrow();
        if (timing.classification.kind === "test_choices") {
          expect(timing.classification.choices.map(o => [o.choiceId, o.choiceLabel])).toEqual(n.answerChoices.map(o => [o.id, o.label]));
          for (const o of timing.classification.choices) if (o.timing.kind === "test") expect(profiles.has(o.timing.timingProfileId)).toBe(true);
        }
        if (!n.questionVariantId.includes("cyst-duct-study")) expect(n.explanation).not.toMatch(/FSRS|authoring|exact previously approved|metastatic construct|pipeline/);
      }
    }
    for (const l of round2.PANCREAS_TOPIC_R2_ATTEMPT_SOURCE_LINKS) expect(l).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });
});


interface SalvageRecord {
  status: string; caseId: string; nodeId: string; questionVariantId: string; sourceCaseId: string; conceptId: string;
  independentSourceReview: { path: string; record: { verdict: string } };
  before: { case: (typeof cases)[number]; node: (typeof cases)[number]["decisionNodes"][number]; question: (typeof questions)[number]; caseSha256: string; nodeSha256: string; questionSha256: string };
  after: { case: (typeof cases)[number]; node: (typeof cases)[number]["decisionNodes"][number]; question: (typeof questions)[number]; authorGate: (typeof round2.PANCREAS_TOPIC_SALVAGE_AUTHOR_CHECKS)[number]; reviewOrderNotice: string; runtimeShuffleAnswers: boolean };
  exactAfterSha256: string;
}
const salvagePacket = (JSON.parse(read(packetPath)) as { salvage: {
  status: string; records: SalvageRecord[]; frozenPriorExportHashes: Record<string, string>; counts: Record<string, number>;
  inputHashes: Array<{ file: string; sha256: string }>;
  acceptedFrozen: Array<{ caseId: string; nodeId: string; questionVariantId: string; caseSha256: string; nodeSha256: string; questionSha256: string; managerFrozenCase: { rawCaseSha256: string } }>;
  authorizedInputDrift: Array<{ file: string; originalCurrentSha256: string; originalSnapshotSha256: string; observedSha256: string; managerEvidencePath: string; managerEvidenceSha256: string }>;
  preview: unknown; currentReviewCaseIds: string[]; currentReviewNodeIds: string[]; excludedAcceptedNodeIds: string[];
} }).salvage;
const salvageLedger = (JSON.parse(read('docs/research/sources-question-topic-pancreas-chronic-cysts-neoplasia-20261111.json')) as { salvage: {
  sources: typeof sources; evidenceClaims: typeof claims; additionalSources: unknown[]; additionalEvidenceClaims: unknown[];
  sourceAccessDatesChanged: boolean; claimLastCheckedDatesChanged: boolean;
  sourceToClaim: Array<{ sourceId: string; evidenceClaimIds: string[] }>;
  claimToCase: Array<{ claimId: string; caseIds: string[]; questionVariantIds: string[] }>;
  caseToClaim: Array<{ caseId: string; nodeId: string; questionVariantId: string; evidenceClaimIds: string[]; status: string }>;
  statementMappings: typeof round2.PANCREAS_TOPIC_SALVAGE_STATEMENT_MAPPINGS;
} }).salvage;

describe("pancreas batch-2 skipped-PASS standalone salvage", () => {
  it("covers exactly every skipped topic PASS, excludes accepted nodes and preserves all prior exports", () => {
    const dispositions = JSON.parse(read('docs/research/question-topic-acceptance-batch2-dispositions-20261111.json')) as { items: Array<{ topic: string; status: string; nodeId: string }> };
    const topic = dispositions.items.filter(x => x.topic === slug);
    const skipped = topic.filter(x => x.status === "skipped").map(x => x.nodeId).sort();
    const accepted = topic.filter(x => x.status === "accepted").map(x => x.nodeId).sort();
    expect(skipped).toHaveLength(7);
    expect(accepted).toHaveLength(5);
    expect(salvagePacket.currentReviewNodeIds.slice().sort()).toEqual(skipped);
    expect(round2.PANCREAS_TOPIC_SALVAGE_REVIEW_QUEUE.map(x => x.nodeId).sort()).toEqual(skipped);
    expect(salvagePacket.excludedAcceptedNodeIds.slice().sort()).toEqual(accepted);
    expect(skipped.some(id => accepted.includes(id))).toBe(false);
    const exports = round2 as unknown as Record<string, unknown>;
    expect(Object.keys(salvagePacket.frozenPriorExportHashes)).toHaveLength(45);
    for (const [name, digest] of Object.entries(salvagePacket.frozenPriorExportHashes)) expect(hash(exports[name]), name).toBe(digest);
    for (const input of salvagePacket.inputHashes) expect(hash(read(input.file)), input.file).toBe(input.sha256);
    const priorCases = [...cases, ...round2.PANCREAS_TOPIC_R2_ATTEMPT_CASES];
    const priorQuestions = [...questions, ...round2.PANCREAS_TOPIC_R2_ATTEMPT_QUESTIONS];
    const admittedCases = Object.values(PROGRAM_BATCH2_VIEWS).flatMap(v => v.cases);
    for (const frozen of salvagePacket.acceptedFrozen) {
      const c = priorCases.find(c => c.id === frozen.caseId)!;
      expect(hash(c)).toBe(frozen.caseSha256);
      const admitted = admittedCases.find(a => a.id === frozen.caseId)!;
      expect(admitted).toEqual(c);
      expect(hash(admitted)).toBe(frozen.managerFrozenCase.rawCaseSha256);
      expect(hash(c.decisionNodes.find(n => n.id === frozen.nodeId))).toBe(frozen.nodeSha256);
      expect(hash(priorQuestions.find(q => q.id === frozen.questionVariantId))).toBe(frozen.questionSha256);
    }
    expect(salvagePacket.authorizedInputDrift).toHaveLength(1);
    expect(salvagePacket.authorizedInputDrift[0]!.file).toBe('packages/clinical-content/src/question-ship-manifest.ts');
  });

  it("creates seven distinct contexts with exact scored content and only required final-node metadata", () => {
    expect(round2.PANCREAS_TOPIC_SALVAGE_CASES).toHaveLength(7);
    expect(new Set(round2.PANCREAS_TOPIC_SALVAGE_CASES.map(c => c.id)).size).toBe(7);
    expect(round2.PANCREAS_TOPIC_SALVAGE_AUTHORING_CONCEPTS).toHaveLength(7);
    for (const r of salvagePacket.records) {
      const c = round2.PANCREAS_TOPIC_SALVAGE_CASES.find(c => c.id === r.caseId)!;
      expect(c.id).not.toBe(r.sourceCaseId);
      expect(c.decisionNodes).toHaveLength(1);
      const finalNode = c.decisionNodes[0]!;
      const { terminalDispositions: beforeTerminal, ...beforeScored } = r.before.node;
      const { terminalDispositions: afterTerminal, ...afterScored } = finalNode;
      expect(afterScored).toEqual(beforeScored);
      if (beforeTerminal.length) {
        expect(finalNode).toEqual(r.before.node);
        expect(hash(finalNode)).toBe(r.before.nodeSha256);
      } else {
        expect(r.nodeId).toBe('node.topic.pancreas-chronic-cysts-neoplasia.postop-vomiting-inflammation.v1');
        expect(afterTerminal).toEqual(finalNode.answerChoices.filter(o => !o.isCorrect).map(o => ({ answerChoiceId: o.id, kind: 'no_terminal_outcome', consequenceNarrative: 'The chart-review decision receives feedback; no patient outcome is simulated.', clinicalRationale: o.rationale, sourceLabels: finalNode.sourceLabels })));
      }
      expect(round2.PANCREAS_TOPIC_SALVAGE_QUESTIONS.find(q => q.id === r.questionVariantId)).toEqual(r.before.question);
      expect(hash(round2.PANCREAS_TOPIC_SALVAGE_QUESTIONS.find(q => q.id === r.questionVariantId))).toBe(r.before.questionSha256);
      expect(c.decisionNodes[0]!.primaryConceptId).toBe(r.conceptId);
      expect(c.prototypeDemographics).toEqual(r.before.case.prototypeDemographics);
      expect(c.patientDisplayName).toBe(r.before.case.patientDisplayName);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      const profile = c.approvedInstantiationProfiles![0]!;
      expect(profile.id).not.toBe(r.before.case.approvedInstantiationProfiles![0]!.id);
      expect(profile.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(profile.presentation).toBe(c.presentation);
      expect(profile.chiefComplaint).toBe(c.chiefComplaint);
      expect(c.patientPresentationVariantId).not.toBe(r.before.case.patientPresentationVariantId);
      expect(c.presentation).toContain('{patientName}');
      expect(c.presentation).toContain(c.prototypeDemographics!.ageYears + '-year-old');
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.learningSummary).toBe(c.decisionNodes[0]!.explanation);
    }
  });

  it("validates the clinic-only unapproved salvage release without hospital capabilities or executable services", () => {
    const preview = round2.PANCREAS_TOPIC_SALVAGE_PREVIEW_RELEASE;
    expect(() => validateSyntheticClinicalRelease(preview)).not.toThrow();
    expect(salvagePacket.preview).toEqual(preview);
    expect(round2.PANCREAS_TOPIC_SALVAGE_MANIFEST).toMatchObject({ status: 'salvage', caseCount: 7, nodeCount: 7, newConcepts: 0, rewrittenScoredNodes: 0, changedAcceptedNodes: 0, changedCompanions: 0, clinicalApproval: false, pipelinePassed: false, managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false });
    for (const c of preview.cases) {
      expect(c.requiredClinicalSetting).toBe('clinic');
      expect(c.releasePointId).toBe('release.l0.clinic_evaluation');
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.earliestFacilityStage).toBe(1);
      expect(c.presentation).toMatch(/clinic.*outside/);
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices.filter(o => o.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.every(o => o.serviceRequest === null)).toBe(true);
        expect(n.resultGateAfter).toBeNull();
      }
      expect(round2.PANCREAS_TOPIC_SALVAGE_CASE_REVIEWS.find(r => r.caseId === c.id)).toMatchObject({ status: 'salvage', reviewStatus: 'needs_clinician_review', patientAcuity: 'stable_in_clinic', educationalTier: 1, earliestFacilityStage: 1, finiteProfileCount: 1 });
    }
  });

  it("changes only the case tuple for timing and retains every exact choice label and existing profile", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(round2.PANCREAS_TOPIC_SALVAGE_TIMING_ENTRIES).toHaveLength(7);
    for (const t of round2.PANCREAS_TOPIC_SALVAGE_TIMING_ENTRIES) {
      expect(() => answerChoiceTimingRegistryEntrySchema.parse(t)).not.toThrow();
      const r = salvagePacket.records.find(r => r.caseId === t.caseId)!;
      const old = [...timings, ...round2.PANCREAS_TOPIC_R2_ATTEMPT_TIMING_ENTRIES].find(x => x.caseId === r.sourceCaseId && x.nodeId === t.nodeId)!;
      expect({ ...t, caseId: old.caseId }).toEqual(old);
      const n = round2.PANCREAS_TOPIC_SALVAGE_CASES.find(c => c.id === t.caseId)!.decisionNodes[0]!;
      if (t.classification.kind === 'test_choices') {
        expect(t.classification.choices.map(o => [o.choiceId, o.choiceLabel])).toEqual(n.answerChoices.map(o => [o.id, o.label]));
        for (const o of t.classification.choices) if (o.timing.kind === 'test') expect(profiles.has(o.timing.timingProfileId)).toBe(true);
      }
      const order = round2.PANCREAS_TOPIC_SALVAGE_ORDER_PROPOSALS.find(o => o.caseId === t.caseId)!;
      expect(order).toMatchObject({ status: 'salvage', serviceRequest: null, resultGateAfter: null });
      expect(order.choices.map(o => [o.choiceId, o.choiceLabel])).toEqual(n.answerChoices.map(o => [o.id, o.label]));
    }
  });

  it("reuses exact evidence and access dates in a closed context-specific provenance graph", () => {
    expect(salvageLedger.sources).toEqual(round2.PANCREAS_TOPIC_SALVAGE_SOURCES);
    expect(salvageLedger.evidenceClaims).toEqual(round2.PANCREAS_TOPIC_SALVAGE_CLAIMS);
    expect(salvageLedger.additionalSources).toEqual([]);
    expect(salvageLedger.additionalEvidenceClaims).toEqual([]);
    expect(salvageLedger.sourceAccessDatesChanged).toBe(false);
    expect(salvageLedger.claimLastCheckedDatesChanged).toBe(false);
    for (const c of salvageLedger.evidenceClaims) {
      expect(c).toEqual(round2.PANCREAS_TOPIC_R2_CLAIMS.find(x => x.id === c.id));
      expect(c.sourceIds.every(id => salvageLedger.sources.some(s => s.id === id && s.evidenceClaimIds.includes(c.id)))).toBe(true);
      expect(salvageLedger.claimToCase.find(x => x.claimId === c.id)!.caseIds.sort()).toEqual(salvagePacket.records.filter(r => r.after.question.supportingEvidenceClaimIds.includes(c.id)).map(r => r.caseId).sort());
    }
    for (const s of salvageLedger.sources) {
      const original = round2.PANCREAS_TOPIC_R2_SOURCES.find(x => x.id === s.id)!;
      expect({ ...s, evidenceClaimIds: original.evidenceClaimIds }).toEqual(original);
      expect(salvageLedger.sourceToClaim.find(x => x.sourceId === s.id)!.evidenceClaimIds).toEqual(s.evidenceClaimIds);
    }
    for (const r of salvagePacket.records) {
      expect(salvageLedger.caseToClaim.find(x => x.caseId === r.caseId)).toMatchObject({ caseId: r.caseId, nodeId: r.nodeId, questionVariantId: r.questionVariantId, evidenceClaimIds: r.after.question.supportingEvidenceClaimIds, status: 'salvage' });
      const mapping = salvageLedger.statementMappings.find(x => x.caseId === r.caseId)!;
      expect(mapping.constructedObservations.sourceCaseId).toBe(r.sourceCaseId);
      expect(mapping.clinicalAssertions).toHaveLength(4);
      expect(mapping.clinicalAssertions.every(x => x.evidenceClaimIds.every(id => salvageLedger.evidenceClaims.some(c => c.id === id)))).toBe(true);
    }
    for (const l of round2.PANCREAS_TOPIC_SALVAGE_SOURCE_LINKS) expect(l).toMatchObject({ target: '_blank', rel: 'noopener noreferrer', referrerPolicy: 'no-referrer' });
  });

  it("binds only the seven salvage packets to exact artifacts and records actual standalone context checks", () => {
    expect(salvagePacket.status).toBe('salvage');
    expect(salvagePacket.records).toHaveLength(7);
    expect(salvagePacket.currentReviewCaseIds).toEqual(round2.PANCREAS_TOPIC_SALVAGE_CASES.map(c => c.id));
    for (const r of salvagePacket.records) {
      expect(r.status).toBe('salvage');
      expect(r.independentSourceReview.record.verdict).toBe('PASS');
      expect(r.exactAfterSha256).toBe(hash(r.after));
      expect(r.after.case).toEqual(round2.PANCREAS_TOPIC_SALVAGE_CASES.find(c => c.id === r.caseId));
      expect(r.after.node).toEqual(round2.PANCREAS_TOPIC_SALVAGE_CASES.find(c => c.id === r.caseId)!.decisionNodes[0]);
      expect(r.after.node.stem).toBe(r.before.node.stem);
      expect(r.after.node.answerChoices).toEqual(r.before.node.answerChoices);
      expect(r.after.node.currentUpdate).toBe(r.before.node.currentUpdate);
      expect(r.after.node.explanation).toBe(r.before.node.explanation);
      expect(r.after.question).toEqual(r.before.question);
      expect(r.after.reviewOrderNotice).toBe('key shown first for review only');
      expect(r.after.runtimeShuffleAnswers).toBe(true);
      const gate = round2.PANCREAS_TOPIC_SALVAGE_AUTHOR_CHECKS.find(g => g.caseId === r.caseId)!;
      expect(r.after.authorGate).toEqual(gate);
      expect(gate).toMatchObject({ status: 'salvage', reviewStatus: 'needs_clinician_review', pipelinePassed: false, independentSalvageReview: null });
      for (const text of [gate.fullVisibleSequenceCheck, gate.cueAttack, gate.deletionTest, gate.interpret, gate.apply, gate.decidingObservation, gate.counterfactual]) expect(text.length).toBeGreaterThan(35);
    }
  });
});
