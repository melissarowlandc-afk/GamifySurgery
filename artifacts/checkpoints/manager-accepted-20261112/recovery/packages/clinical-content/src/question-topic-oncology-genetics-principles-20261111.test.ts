import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { decisionNodeSchema, syntheticClinicalCaseSchema, syntheticClinicalReleaseSchema,
  answerChoiceTimingRegistryEntrySchema, type DecisionNode, type SyntheticClinicalCase } from "./schema";
import { ROW_031_CASES, ROW_031_CLINICAL_APPROVAL } from "./approved-data/ebv-associated-malignancies";
import { QUESTION_NEW_N3_ROUND3_CASES } from "./question-new-n3-round3-20261105";
import * as topic from "./question-topic-oncology-genetics-principles-20261111";
import type { QuestionVariant } from "./pilot-schema";

const slug = "oncology-genetics-principles";
const file = (path: string) => new URL(`../../../${path}`, import.meta.url);
const json = <T,>(path: string): T => JSON.parse(readFileSync(file(path), "utf8")) as T;
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
interface AssignmentRow {
  recordId: string; primaryTopicSlug: string; variantIds: string[]; conceptId: string;
  fileLocation: { file: string }; live: boolean;
}
interface AuditRow {
  recordId: string; verdict: string; reasons: string[]; replacementQuestionVariantIds: string[];
  beforeNodeSha256: string; beforeCaseSha256: string;
  contextAudit: { finiteProfileCount: number; finiteProfiles: unknown[]; priorVisibleFeedback: unknown[] };
}
interface BeforeRow {
  recordId: string; case: SyntheticClinicalCase; node: DecisionNode; nodeSha256: string; caseSha256: string;
  contexts: { case: SyntheticClinicalCase; node: DecisionNode; nodeSha256: string; caseSha256: string;
    origins: { file: string; export: string }[] }[];
}
interface Packet {
  assignment: Record<"concepts" | "caseAssignments" | "nodeAssignments" | "variantAssignments", unknown[]> & {
    inventory: AssignmentRow[]; sourceHashes: { file: string; sha256: string }[];
    recordedHolds: unknown[]; unkeyedDraftSlots: unknown[]; withheldTeachingPoints: unknown[];
  };
  counts: Record<string, number>; audits: AuditRow[]; before: BeforeRow[];
  proposals: typeof topic.ONCOLOGY_GENETICS_PROPOSALS;
  timingProposals: typeof topic.ONCOLOGY_GENETICS_TIMING_PROPOSALS;
  sourceLinks: typeof topic.ONCOLOGY_GENETICS_SOURCE_LINKS;
  conceptProposals: typeof topic.ONCOLOGY_GENETICS_CONCEPT_PROPOSALS;
  ownerApprovalsNeeded: unknown[];
}
interface Program { [key: string]: { primaryTopicSlug?: string }[] }
interface Ledger {
  sources: { id: string; evidenceClaimIds: string[]; accessedOn: string; completeCitation: string;
    officialUrl: string; licenseLabel: string; authorityAssessment: string }[];
  claims: { id: string; sourceIds: string[]; questionVariantIds: string[]; lastCheckedOn: string;
    reviewStatus: string; limitation: string | null }[];
  questionMappings: { questionVariantId: string; claimIds: string[]; sourceIds: string[] }[];
  sourceTextStored: boolean;
}
const packet = json<Packet>(`docs/research/question-topic-${slug}-20261111.json`);
const ledger = json<Ledger>(`docs/research/sources-question-topic-${slug}-20261111.json`);
const program = json<Program>("docs/research/question-topic-program-20261111.json");

describe("oncology-genetics-principles explicit-import authoring sidecar", () => {
  it("parses the existing release representation without granting admission", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.ONCOLOGY_GENETICS_PREVIEW_RELEASE).success).toBe(true);
    expect(topic.ONCOLOGY_GENETICS_VALIDATE_PREVIEW().cases).toHaveLength(15);
    expect(topic.ONCOLOGY_GENETICS_QUESTIONS).toHaveLength(25);
    expect(topic.ONCOLOGY_GENETICS_MANIFEST).toMatchObject({ pipelinePassed: false, managerAccepted: false,
      clinicalApproval: false, publicReleaseAuthorized: false, reviewStatus: "needs_clinician_review" });
  });

  it("reconciles every complete primary assignment and every verdict", () => {
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"] as const) {
      expect(packet.assignment[key]).toEqual(program[key]!.filter(r => r.primaryTopicSlug === slug));
    }
    expect(packet.assignment.inventory).toHaveLength(25);
    expect(packet.assignment.inventory.filter(r => r.live)).toHaveLength(24);
    expect(packet.audits.map(a => a.recordId).sort()).toEqual(packet.assignment.inventory.map(r => r.recordId).sort());
    expect(new Set(packet.audits.map(a => a.recordId)).size).toBe(25);
    for (const a of packet.audits) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(a.verdict);
      expect(a.reasons.length).toBeGreaterThanOrEqual(3);
      expect(a.reasons.every(r => r.length > 50)).toBe(true);
      expect(a.beforeNodeSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(a.beforeCaseSha256).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(packet.counts).toMatchObject({ audited: 25, kept: 4, rewritten: 1,
      retiredAndReplacedProposed: 20, newGapQuestions: 21, proposedQuestions: 25, proposedCases: 15 });
    expect(packet.audits.filter(a => a.verdict === "Keep")).toHaveLength(4);
    expect(packet.audits.filter(a => a.verdict === "Rewrite")).toHaveLength(1);
    expect(packet.audits.filter(a => a.verdict === "Retire-and-replace")).toHaveLength(20);
  });

  it("binds before contexts and input definitions to exact hashes", () => {
    const critical = new Set(packet.assignment.inventory.map(r => r.fileLocation.file));
    critical.add("packages/clinical-content/src/question-new-n3-round3-20261105.ts");
    for (const path of critical) {
      const expected = packet.assignment.sourceHashes.find(f => f.file === path)!;
      expect(expected, path).toBeDefined();
      expect(createHash("sha256").update(readFileSync(file(path))).digest("hex"), path).toBe(expected.sha256);
    }
    for (const b of packet.before) {
      expect(sha(b.case)).toBe(b.caseSha256);
      expect(sha(b.node)).toBe(b.nodeSha256);
      expect(syntheticClinicalCaseSchema.safeParse(b.case).success).toBe(true);
      expect(decisionNodeSchema.safeParse(b.node).success).toBe(true);
      const a = packet.audits.find(a => a.recordId === b.recordId)!;
      expect(a.beforeNodeSha256).toBe(b.nodeSha256);
      expect(a.contextAudit.finiteProfileCount).toBe((b.case.approvedInstantiationProfiles ?? []).length);
      expect(a.contextAudit.finiteProfiles).toEqual(b.case.approvedInstantiationProfiles ?? []);
      for (const c of b.contexts) {
        expect(sha(c.case)).toBe(c.caseSha256);
        expect(sha(c.node)).toBe(c.nodeSha256);
        expect(c.node).toEqual(b.node);
      }
    }
    expect(packet.before.reduce((n, b) => n + b.contexts.length, 0)).toBe(32);
  });

  it("preserves complete exact clinical approvals and the independent N3 PASS", () => {
    expect(ROW_031_CLINICAL_APPROVAL.id).toBe("approval.melissa-rowland-md.owner-row-031.2026-08-06");
    for (const c of ROW_031_CASES) {
      const b = packet.before.find(b => b.case.id === c.id)!;
      const original = b.contexts.find(x => x.origins.some(o =>
        o.file.endsWith("approved-data/ebv-associated-malignancies.ts") && o.export === "ROW_031_CASES"))!;
      expect(c).toEqual(original.case);
      expect(sha(c)).toBe(original.caseSha256);
      expect(c.decisionNodes).toEqual(b.case.decisionNodes);
      expect(original.caseSha256).not.toBe(b.caseSha256);
    }
    const frozen = QUESTION_NEW_N3_ROUND3_CASES.find(c =>
      c.decisionNodes.some(n => n.questionVariantId === "question.n3.tumor-screen-versus-family-test-sequence.v2"))!;
    const b = packet.before.find(b => b.node.questionVariantId === "question.n3.tumor-screen-versus-family-test-sequence.v2")!;
    expect(frozen).toEqual(b.case);
    expect(sha(frozen)).toBe(b.caseSha256);
    expect(topic.ONCOLOGY_GENETICS_PROPOSALS.some(p => p.replaces.includes(b.node.questionVariantId))).toBe(false);
  });

  it("maps every proposed retirement to real successor or preserved accepted supply", () => {
    const valid = new Set([...topic.ONCOLOGY_GENETICS_QUESTIONS.map(q => q.id),
      "question.n3.tumor-screen-versus-family-test-sequence.v2"]);
    for (const a of packet.audits.filter(a => a.verdict !== "Keep")) {
      expect(a.replacementQuestionVariantIds.length).toBeGreaterThan(0);
      for (const id of a.replacementQuestionVariantIds) expect(valid.has(id), id).toBe(true);
    }
    expect(packet.assignment.recordedHolds).toEqual([]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.ownerApprovalsNeeded.length).toBeGreaterThan(0);
  });

  it("matches the packet to the exact authored definitions", () => {
    expect(packet.proposals.map(p => p.questionVariantId)).toEqual(topic.ONCOLOGY_GENETICS_PROPOSALS.map(p => p.questionVariantId));
    for (const p of topic.ONCOLOGY_GENETICS_PROPOSALS) {
      const recorded = packet.proposals.find(x => x.questionVariantId === p.questionVariantId)!;
      for (const key of ["task", "update", "choices", "exhibit", "gate", "evidenceClaimIds", "conceptId"] as const) {
        expect(recorded[key], `${p.slug} ${key}`).toEqual(p[key]);
      }
    }
    expect(packet.timingProposals).toEqual(topic.ONCOLOGY_GENETICS_TIMING_PROPOSALS);
    expect(packet.sourceLinks).toEqual(topic.ONCOLOGY_GENETICS_SOURCE_LINKS);
    expect(packet.conceptProposals).toEqual(topic.ONCOLOGY_GENETICS_CONCEPT_PROPOSALS);
  });

  it("separates unchanged concepts, new versions and variant reuse", () => {
    const concepts = topic.ONCOLOGY_GENETICS_CONCEPT_PROPOSALS;
    expect(concepts).toHaveLength(22);
    expect(concepts.filter(c => c.conceptMeaning === "same").map(c => c.id)).toEqual([
      "concept.fap.germline-testing-after-diffuse-adenomas",
    ]);
    expect(concepts.filter(c => c.conceptMeaning === "new_version")).toHaveLength(2);
    expect(concepts.filter(c => c.conceptMeaning === "new")).toHaveLength(19);
    for (const c of concepts.filter(c => c.previousConceptId)) expect(c.id).not.toBe(c.previousConceptId);
    for (const id of ["known-familial-variant-testing", "informative-affected-relative", "childhood-actionable-predictive-testing"]) {
      expect(topic.ONCOLOGY_GENETICS_PROPOSALS.filter(p => p.conceptId.endsWith(`.${id}.v1`))).toHaveLength(2);
    }
    for (const c of topic.ONCOLOGY_GENETICS_CASES) {
      expect(new Set(c.decisionNodes.map(n => n.primaryConceptId)).size).toBe(c.decisionNodes.length);
    }
  });

  it("keeps every new authored record under exact clinical review", () => {
    for (const r of [...topic.ONCOLOGY_GENETICS_PROPOSALS, ...topic.ONCOLOGY_GENETICS_QUESTIONS,
      ...topic.ONCOLOGY_GENETICS_CONCEPT_PROPOSALS, ...topic.ONCOLOGY_GENETICS_CLAIMS,
      ...topic.ONCOLOGY_GENETICS_SOURCES, ...topic.ONCOLOGY_GENETICS_CASE_REVIEWS]) {
      expect(r.reviewStatus).toBe("needs_clinician_review");
      expect(r.lastClinicianReview).toBeNull();
    }
    expect(topic.ONCOLOGY_GENETICS_QUESTIONS.some(q => packet.assignment.inventory.some(r => r.variantIds.includes(q.id)))).toBe(false);
  });

  it("uses finite adult clinic profiles and complete separated tasks", () => {
    for (const c of topic.ONCOLOGY_GENETICS_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.prototypeDemographics!.ageYears).toBeGreaterThanOrEqual(18);
      expect(c.patientDisplayName.split(" ")).toHaveLength(2);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      for (const n of c.decisionNodes) {
        expect(n.stem).toContain("{patientName}");
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices).toHaveLength(3);
        expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      }
    }
    expect(topic.ONCOLOGY_GENETICS_CASES.filter(c => c.decisionNodes.length > 1)).toHaveLength(7);
    expect(topic.ONCOLOGY_GENETICS_CASE_REVIEWS.every(r => r.educationalTier === 1 && r.patientAcuity === "stable" && r.facilityProgressionLevel === 3)).toBe(true);
    for (const id of ["checkpoint", "rasburicase", "cord-review"]) {
      expect(topic.ONCOLOGY_GENETICS_CASE_SPECS.find(c => c.slug === id)!.presentation).toMatch(/outside|hospital|discharge/i);
    }
  });

  it("resolves all question-to-claim-to-source and reverse mappings", () => {
    const sources = new Set(ledger.sources.map(s => s.id)), claims = new Map(ledger.claims.map(c => [c.id, c]));
    expect(ledger.sourceTextStored).toBe(false);
    for (const q of topic.ONCOLOGY_GENETICS_QUESTIONS) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      const mapping = ledger.questionMappings.find(m => m.questionVariantId === q.id)!;
      expect(mapping.claimIds).toEqual(q.supportingEvidenceClaimIds);
      for (const id of q.supportingEvidenceClaimIds) {
        const claim = claims.get(id)!;
        expect(claim, id).toBeDefined();
        expect(claim.questionVariantIds).toContain(q.id);
        expect(claim.reviewStatus).toBe("needs_clinician_review");
        expect(claim.lastCheckedOn).toBe("2026-11-11");
        for (const sid of claim.sourceIds) {
          expect(sources.has(sid), sid).toBe(true);
          expect(ledger.sources.find(s => s.id === sid)!.evidenceClaimIds).toContain(id);
        }
      }
    }
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(80);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.licenseLabel.length).toBeGreaterThan(10);
      expect(source.authorityAssessment.length).toBeGreaterThan(50);
    }
    for (const m of topic.ONCOLOGY_GENETICS_STATEMENT_MAPPINGS) {
      expect(m.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of m.evidenceClaimIds) expect(claims.has(id)).toBe(true);
    }
  });

  it("has exact timing/label mappings for every testing choice and no executed order", () => {
    expect(topic.ONCOLOGY_GENETICS_TIMING_PROPOSALS).toHaveLength(25);
    for (const entry of topic.ONCOLOGY_GENETICS_TIMING_PROPOSALS) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const p = topic.ONCOLOGY_GENETICS_PROPOSALS.find(p => p.questionVariantId === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(p.choices.length);
        for (const t of entry.classification.choices) {
          const c = p.choices.find(c => c.id === t.choiceId)!;
          expect(t.choiceLabel).toBe(c.label);
          if (t.timing.kind === "test") {
            expect(t.timing.timingProfileId).toBe(c.timingProfileId);
            expect(getDiagnosticTimingProfileMapping(t.timing.timingProfileId), `${p.slug}: ${c.label}`).toBeTruthy();
          } else expect(c.timingProfileId).toBeNull();
        }
      } else expect(p.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    expect(topic.ONCOLOGY_GENETICS_ORDER_PROPOSALS).toHaveLength(56);
    for (const order of topic.ONCOLOGY_GENETICS_ORDER_PROPOSALS) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
    const p = (slug: string) => topic.ONCOLOGY_GENETICS_PROPOSALS.find(p => p.slug === slug)!;
    expect(p("mlh1-methylation").choices.find(c => c.isCorrect)!.timingProfileId).toBe("timing.test.pathology_review");
    expect(p("unmethylated-germline").choices.find(c => c.isCorrect)!.timingProfileId).toBe("timing.test.genetic");
    expect(p("failed-ihc-controls").choices.find(c => c.isCorrect)!.timingProfileId).toBe("timing.test.tumor_mmr_ihc");
  });

  it("retains concrete manual attacks, two steps and in-set counterfactuals", () => {
    expect(topic.ONCOLOGY_GENETICS_AUTHOR_CHECKS).toHaveLength(25);
    for (const p of topic.ONCOLOGY_GENETICS_PROPOSALS) {
      const g = p.gate;
      expect(g.reasoningSteps).toHaveLength(2);
      for (const value of [g.coverTheKey, g.stageAndCategory, ...g.reasoningSteps, g.closestError,
        g.decidingObservation, g.consequence, g.counterfactual, g.deletionTest, g.sequenceReview, g.repairAndRecheck]) {
        expect(value.length, p.slug).toBeGreaterThan(15);
      }
      const alternative = p.choices.find(c => c.id.endsWith(`.${g.thenBestChoiceId}`))!;
      expect(alternative, p.slug).toBeDefined();
      expect(alternative.isCorrect).toBe(false);
      for (const c of p.choices) {
        expect(c.rationale.length).toBeGreaterThan(30);
        expect(c.temptation.length).toBeGreaterThan(15);
        expect(c.counterfactual.length).toBeGreaterThan(25);
        expect(c.label).not.toMatch(/\balone\b|individualized|shared.decision|without addressing/i);
      }
    }
    expect(topic.ONCOLOGY_GENETICS_AUTHOR_CHECKS.every(c => !c.independent && !c.clinicalApproval)).toBe(true);
  });

  it("uses safe external links and stays outside runtime/release assembly", () => {
    for (const link of topic.ONCOLOGY_GENETICS_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    const source = readFileSync(new URL(`./question-topic-${slug}-20261111.ts`, import.meta.url), "utf8");
    expect(source).not.toMatch(/from ["']\.\/(?:index|synthetic-content|question-ship-manifest)["']/);
    expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest)\s*\(/);
    for (const path of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts"]) {
      expect(readFileSync(file(path), "utf8")).not.toContain(`question-topic-${slug}-20261111`);
    }
  });
});

interface ReviewRow {
  id: string; nodeId: string; verdict: string; clarityIssues: string[];
  cues: { phrase: string; why: string }[]; fairness: string[]; suggestions: string[];
}
type CurrentProposal = (typeof topic.ONCOLOGY_GENETICS_RESPONSE_PROPOSALS)[number] & {
  beforeExact: { questionVariantId: string; nodeSha256: string; caseSha256: string };
  after: { node: DecisionNode; question: QuestionVariant; case: SyntheticClinicalCase;
    nodeSha256: string; questionSha256: string; caseSha256: string; caseHeader: unknown };
  sourceIds: string[]; reviewDisplay: string;
};
const response = json<{ reviewResponse: {
  reviewFileSha256: string; reviewPath: string; counts: Record<string, number>;
  items: ((typeof topic.ONCOLOGY_GENETICS_RESPONSE_ITEMS)[number] & {
    reviewRow: ReviewRow; issueResponses: { category: string; reviewedIssue: unknown; response: string; disposition: string }[];
    repairedCandidate: (typeof topic.ONCOLOGY_GENETICS_RESPONSE_EDITS)[number] | null;
  })[];
  proposals: CurrentProposal[];
  passPreservation: { slug: string; sourceNode: DecisionNode; sourceNodeSha256: string;
    sourceQuestion: QuestionVariant; sourceQuestionSha256: string; reviewedCaseHeader: unknown;
    reviewedCaseHeaderSha256: string; terminalMetadataAdded: boolean }[];
  timingProposals: typeof topic.ONCOLOGY_GENETICS_RESPONSE_TIMING_PROPOSALS;
  orderProposals: typeof topic.ONCOLOGY_GENETICS_RESPONSE_ORDER_PROPOSALS;
  authoringManifest: typeof topic.ONCOLOGY_GENETICS_RESPONSE_MANIFEST;
} }>(`docs/research/question-topic-${slug}-20261111.json`).reviewResponse;
const responseLedger = json<{ reviewResponse: {
  sources: Ledger["sources"]; claims: Ledger["claims"];
  questionMappings: Ledger["questionMappings"];
  reusedClaimExtensions: { claimId: string; questionVariantIds: string[]; originalMetadataChanged: boolean }[];
  reusedSourceExtensions: { sourceId: string; evidenceClaimIds: string[]; originalMetadataChanged: boolean }[];
  exactSourceClaimQuestionMappings: { sourceId: string; claimId: string; questionVariantId: string; scored: boolean }[];
} }>(`docs/research/sources-question-topic-${slug}-20261111.json`).reviewResponse;
const visibleHeader = (c: SyntheticClinicalCase) => ({ patientDisplayName: c.patientDisplayName,
  prototypeDemographics: c.prototypeDemographics, chiefComplaint: c.chiefComplaint, presentation: c.presentation,
  approvedInstantiationProfiles: c.approvedInstantiationProfiles });

describe("oncology genetics independent-review response", () => {
  it("accounts for every exact review and every returned issue once", () => {
    const review = json<ReviewRow[]>(response.reviewPath);
    expect(createHash("sha256").update(readFileSync(file(response.reviewPath))).digest("hex"))
      .toBe(response.reviewFileSha256);
    expect(response.items.map(i => i.reviewedQuestionVariantId)).toEqual(review.map(r => r.id));
    expect(response.counts).toMatchObject({ reviewed: 25, passPreserved: 3, revised: 15, parked: 7,
      currentQuestions: 18, standaloneCases: 18, multiPartCases: 0, newGapItemsAddedThisResponse: 0 });
    for (const row of review) {
      const item = response.items.find(i => i.reviewedQuestionVariantId === row.id)!;
      expect(item.reviewRow).toEqual(row);
      expect(item.candidateRevisionCount).toBe(row.verdict === "PASS" ? 0 : 1);
      expect(item.status === "pass-preserved").toBe(row.verdict === "PASS");
      for (const category of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        expect(item.issueResponses.filter(r => r.category === category).map(r => r.reviewedIssue)).toEqual(row[category]);
      }
      expect(item.issueResponses.every(r => r.disposition === item.status && r.response.length > 40)).toBe(true);
      expect(item.clinicalApproval).toBe(false);
      expect(item.managerAccepted).toBe(false);
    }
    expect(response.items.filter(i => i.status === "revised")).toHaveLength(15);
    expect(response.items.filter(i => i.status === "parked")).toHaveLength(7);
  });

  it("preserves all PASS question words, updates, exhibits and finite profiles exactly", () => {
    expect(response.passPreservation).toHaveLength(3);
    for (const frozen of response.passPreservation) {
      const old = topic.ONCOLOGY_GENETICS_PROPOSALS.find(p => p.slug === frozen.slug)!;
      const originalNode = topic.ONCOLOGY_GENETICS_NODES.find(n => n.id === old.nodeId)!;
      const originalQuestion = topic.ONCOLOGY_GENETICS_QUESTIONS.find(q => q.id === old.questionVariantId)!;
      const c = topic.ONCOLOGY_GENETICS_RESPONSE_CASES.find(c => c.decisionNodes[0]!.id === old.nodeId)!;
      const currentNode = c.decisionNodes[0]!;
      expect(sha(originalNode)).toBe(frozen.sourceNodeSha256);
      expect(originalNode).toEqual(frozen.sourceNode);
      expect(originalQuestion).toEqual(frozen.sourceQuestion);
      expect(sha(originalQuestion)).toBe(frozen.sourceQuestionSha256);
      expect(topic.ONCOLOGY_GENETICS_RESPONSE_QUESTIONS.find(q => q.id === old.questionVariantId)).toEqual(originalQuestion);
      expect(visibleHeader(c)).toEqual(frozen.reviewedCaseHeader);
      expect(sha(visibleHeader(c))).toBe(frozen.reviewedCaseHeaderSha256);
      const { terminalDispositions: originalDispositions, ...originalWords } = originalNode;
      const { terminalDispositions: currentDispositions, ...currentWords } = currentNode;
      expect(currentWords).toEqual(originalWords);
      if (frozen.terminalMetadataAdded) {
        expect(originalDispositions).toEqual([]);
        for (const a of originalNode.answerChoices.filter(a => !a.isCorrect)) {
          expect(currentDispositions.find(d => d.answerChoiceId === a.id)).toMatchObject({
            kind: "no_terminal_outcome", clinicalRationale: a.rationale, sourceLabels: originalNode.sourceLabels,
          });
        }
      } else expect(currentDispositions).toEqual(originalDispositions);
    }
  });

  it("excludes every parked candidate and historical returned variant from current scored supply", () => {
    const questions = new Set(topic.ONCOLOGY_GENETICS_RESPONSE_QUESTIONS.map(q => q.id));
    for (const item of response.items) {
      if (item.status === "parked") {
        expect(item.currentQuestionVariantId).toBeNull();
        expect(item.currentCaseId).toBeNull();
        expect(item.parkingReason!.length).toBeGreaterThan(100);
        expect(item.repairedCandidate?.status).toBe("parked");
        expect(item.repairedCandidate?.gate.repairAndRecheck).toContain("failed admission");
        expect(questions.has(item.reviewedQuestionVariantId)).toBe(false);
      } else {
        expect(questions.has(item.currentQuestionVariantId!)).toBe(true);
        if (item.status === "revised") {
          expect(item.currentQuestionVariantId).toMatch(/\.v2$/);
          expect(questions.has(item.reviewedQuestionVariantId)).toBe(false);
        }
      }
    }
    expect(topic.ONCOLOGY_GENETICS_RESPONSE_CASES).toHaveLength(18);
    expect(topic.ONCOLOGY_GENETICS_RESPONSE_CASES.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(topic.ONCOLOGY_GENETICS_RESPONSE_VALIDATE_PREVIEW().cases).toHaveLength(18);
    expect(syntheticClinicalReleaseSchema.safeParse(topic.ONCOLOGY_GENETICS_RESPONSE_PREVIEW_RELEASE).success).toBe(true);
  });

  it("matches all current packet payloads to their explicit-import artifacts", () => {
    for (const p of topic.ONCOLOGY_GENETICS_RESPONSE_PROPOSALS) {
      const stored = response.proposals.find(s => s.questionVariantId === p.questionVariantId)!;
      for (const k of ["task", "update", "choices", "exhibit", "gate", "conceptId", "evidenceClaimIds", "status"] as const) {
        expect(stored[k], `${p.slug}: ${k}`).toEqual(p[k]);
      }
      expect(stored.after.node).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_NODES.find(n => n.id === p.nodeId));
      expect(stored.after.question).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_QUESTIONS.find(q => q.id === p.questionVariantId));
      expect(stored.after.case).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_CASES.find(c => c.id === p.caseId));
      expect(stored.after.nodeSha256).toBe(sha(stored.after.node));
      expect(stored.after.questionSha256).toBe(sha(stored.after.question));
      expect(stored.after.caseSha256).toBe(sha(stored.after.case));
      expect(stored.beforeExact.questionVariantId).toBe(p.reviewedQuestionVariantId);
      expect(stored.reviewDisplay).toBe("key shown first for review only.");
    }
    expect(response.authoringManifest).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_MANIFEST);
    expect(response.authoringManifest).toMatchObject({ pipelinePassed: false, managerAccepted: false,
      clinicalApproval: false, publicReleaseAuthorized: false });
  });

  it("retains actual author attacks, competing errors and decision-changing counterfactuals", () => {
    const revised = topic.ONCOLOGY_GENETICS_RESPONSE_PROPOSALS.filter(p => p.status === "revised");
    expect(revised).toHaveLength(15);
    for (const p of revised) {
      const g = p.gate;
      expect(g.reasoningSteps).toHaveLength(2);
      for (const text of [...g.reasoningSteps, g.coverTheKey, g.stageAndCategory, g.closestError,
        g.decidingObservation, g.consequence, g.counterfactual, g.deletionTest, g.repairAndRecheck]) {
        expect(text.length, p.slug).toBeGreaterThan(20);
      }
      expect(p.choices.filter(c => c.isCorrect)).toHaveLength(1);
      const alternative = p.choices.find(c => c.id.endsWith(`.v2.${g.thenBestChoiceId}`));
      expect(alternative, p.slug).toBeDefined();
      expect(alternative!.isCorrect).toBe(false);
      expect(p.choices.length).toBeGreaterThanOrEqual(3);
      expect(p.choices.length).toBeLessThanOrEqual(4);
      expect(p.authorCheckStatus).toBe("manual_author_check_pending_independent_review");
      expect(p.reviewStatus).toBe("needs_clinician_review");
      expect(p.lastClinicianReview).toBeNull();
    }
    expect(topic.ONCOLOGY_GENETICS_RESPONSE_AUTHOR_CHECKS.every(g => !g.independent && !g.clinicalApproval)).toBe(true);
    const apc = revised.find(p => p.slug === "apc-child-testing")!;
    expect(apc.choices.filter(c => /now$/.test(c.label))).toHaveLength(2);
    expect(apc.choices.filter(c => /adulthood$/.test(c.label))).toHaveLength(2);
    expect(revised.find(p => p.slug === "rasburicase-reexposure")!.observations.flat().join(" ")).not.toMatch(/methemoglobin|hemolysis/i);
    expect(revised.find(p => p.slug === "cord-whole-spine-mri")!.choices.every(c => c.label.startsWith("Urgent ") && c.label.includes("MRI"))).toBe(true);
  });

  it("uses stable concepts for wording repairs and one explicit new sampling version", () => {
    expect(topic.ONCOLOGY_GENETICS_RESPONSE_CONCEPTS).toHaveLength(16);
    const changed = topic.ONCOLOGY_GENETICS_RESPONSE_CONCEPT_PROPOSALS.filter(c => c.responseIdentityDecision === "new_version_changed_sampling_meaning");
    expect(changed).toHaveLength(1);
    expect(changed[0]).toMatchObject({ id: "concept.topic.oncology-genetics-principles.tumor-variant-constitutional-confirmation.v2",
      previousConceptId: "concept.topic.oncology-genetics-principles.tumor-variant-constitutional-confirmation.v1" });
    for (const p of topic.ONCOLOGY_GENETICS_RESPONSE_PROPOSALS.filter(p => p.slug !== "tumor-brca-constitutional")) {
      expect(p.conceptId).toBe(topic.ONCOLOGY_GENETICS_PROPOSALS.find(o => o.slug === p.slug)!.conceptId);
    }
  });

  it("maps all clinical fields to atomic claims and source provenance without changing v1 records", () => {
    const claims = new Map(topic.ONCOLOGY_GENETICS_RESPONSE_CLAIMS.map(c => [c.id, c]));
    const sources = new Set(topic.ONCOLOGY_GENETICS_RESPONSE_SOURCES.map(s => s.id));
    for (const q of topic.ONCOLOGY_GENETICS_RESPONSE_QUESTIONS) {
      const mapping = responseLedger.questionMappings.find(m => m.questionVariantId === q.id)!;
      expect(mapping.claimIds).toEqual(q.supportingEvidenceClaimIds);
      for (const id of q.supportingEvidenceClaimIds) {
        const c = claims.get(id)!;
        expect(c, id).toBeDefined();
        expect(c.reviewStatus).toBe("needs_clinician_review");
        for (const sid of c.sourceIds) {
          expect(sources.has(sid)).toBe(true);
          expect(responseLedger.exactSourceClaimQuestionMappings).toContainEqual({
            sourceId: sid, claimId: id, questionVariantId: q.id, scored: true,
          });
        }
      }
    }
    expect(responseLedger.sources).toHaveLength(6);
    expect(responseLedger.claims).toHaveLength(9);
    expect(responseLedger.reusedSourceExtensions.every(s => s.originalMetadataChanged === false)).toBe(true);
    expect(responseLedger.reusedClaimExtensions.every(c => c.originalMetadataChanged === false)).toBe(true);
    for (const m of topic.ONCOLOGY_GENETICS_RESPONSE_STATEMENT_MAPPINGS) {
      expect(m.evidenceClaimIds.length).toBeGreaterThan(0);
      expect(m.evidenceClaimIds.every(id => claims.has(id))).toBe(true);
    }
    for (const link of topic.ONCOLOGY_GENETICS_RESPONSE_SOURCE_LINKS) {
      expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    }
  });

  it("maps every testing choice and preserves outpatient retrospective care scope", () => {
    expect(response.timingProposals).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_TIMING_PROPOSALS);
    expect(response.orderProposals).toEqual(topic.ONCOLOGY_GENETICS_RESPONSE_ORDER_PROPOSALS);
    expect(response.orderProposals).toHaveLength(42);
    for (const p of topic.ONCOLOGY_GENETICS_RESPONSE_PROPOSALS) {
      const entry = topic.ONCOLOGY_GENETICS_RESPONSE_TIMING_PROPOSALS.find(t => t.questionVariantId === p.questionVariantId)!;
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      expect(entry.caseId).toBe(p.caseId);
      if (entry.classification.kind === "test_choices") {
        for (const c of p.choices) {
          const mapped = entry.classification.choices.find(t => t.choiceId === c.id)!;
          expect(mapped.choiceLabel).toBe(c.label);
          if (c.timingProfileId) {
            expect(mapped.timing).toEqual({ kind: "test", timingProfileId: c.timingProfileId });
            expect(getDiagnosticTimingProfileMapping(c.timingProfileId)).toBeTruthy();
          } else expect(mapped.timing).toEqual({ kind: "no_test" });
        }
      } else expect(p.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    for (const c of topic.ONCOLOGY_GENETICS_RESPONSE_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.presentation).toContain("{patientName}");
      expect(c.prototypeDemographics!.ageYears).toBeGreaterThanOrEqual(18);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.decisionNodes[0]!.shuffleAnswers).toBe(true);
      expect(c.decisionNodes[0]!.resultGateAfter).toBeNull();
      expect(c.decisionNodes[0]!.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
    }
    for (const order of response.orderProposals) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
    }
  });
});
