import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema,
  type SyntheticClinicalCase, type DecisionNode } from "./schema";
import type { QuestionVariant } from "./pilot-schema";
import * as topic from "./question-topic-stomach-neoplasia-20261111";
import ledger from "../../../docs/research/sources-question-topic-stomach-neoplasia-20261111.json";

const rootFile = (path: string) => new URL(`../../../${path}`, import.meta.url);
const readJson = (path: string): unknown => JSON.parse(readFileSync(rootFile(path), "utf8"));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
interface InventoryRow { recordId: string; primaryTopicSlug: string; conceptId: string; caseId: string | null;
  variantIds: string[]; recordedHoldIds: string[]; live: boolean; }
interface BeforeRow { recordId: string; questions: { question: QuestionVariant; questionSha256: string }[];
  contexts: { case: SyntheticClinicalCase; node: DecisionNode; caseSha256: string; nodeSha256: string }[]; }
interface AuditRow { recordId: string; variantIds: string[]; verdict: string; reasons: string[];
  replacementQuestionVariantIds: string[]; beforeQuestionSha256: string;
  sourceFile: string; exportLocator: string; supportingAuditClaimIds: string[];
  clinicalApprovalReference: string | null; frozenIndependentPassReference: string | null;
  contextAudit: { nodeSha256: string; caseSha256: string;
    visibleContexts: { visibleSha256: string; fields: Record<string, string>; profileIds: string[] }[] }[]; }
interface Packet {
  assignment: Record<string, unknown[]> & { inventory: InventoryRow[];
    frozenIndependentPassReferences: { id: string; reviewId?: string; questionVariantId: string; questionSha256: string;
      originalDecisionFile: string; reviewRecordSha256?: string; reviewPacketFile: string; reviewPacketAfterSha256?: string;
      originalFreeze?: { variantSha256: string; authoredCaseSha256: string } }[];
    clinicalApprovalReferences: { id: string; approvedQuestionVariantIds: string[]; contentVersion: string }[];
    recordedHolds: { id: string }[]; };
  baseline: { sourceInputs: { file: string; currentSha256: string; programSha256: string | null }[] };
  audit: AuditRow[]; before: BeforeRow[]; counts: Record<string, number>;
  rankedConcepts: { rank: number; decision: string; closestCredibleError: string; consequence: string;
    inventoryRecordIds: string[]; proposedQuestionVariantIds: string[]; claimIds: string[] }[];
  coverageHistory: { conceptId: string; rankedConcepts: number[] }[];
  afterFingerprints: { questionVariantId: string; questionSha256: string; nodeSha256: string;
    caseSha256: string; manualGateSha256: string }[];
  artifacts: { questions: unknown; cases: unknown; conceptProposals: unknown; timingProposals: unknown; orderProposals: unknown };
  advisoryLint: { totals: { findings: number }; variants: { questionVariantId: string; findings: unknown[] }[] };
  advisoryLintDispositions: { questionVariantId: string; findings: { disposition: string }[] }[];
  ownerApprovalsNeeded: { id: string; items: string[]; question: string; boundary: string }[];
  integration: { runtimeSetting: string; pairedOnlyCases: { caseId: string; conceptIds: string[] }[] };
}
const packet = readJson("docs/research/question-topic-stomach-neoplasia-20261111.json") as Packet;
const program = readJson("docs/research/question-topic-program-20261111.json") as Record<string, { primaryTopicSlug: string }[]>;
const proposal = (slug: string) => topic.STOMACH_NEOPLASIA_PROPOSALS.find(p => p.slug === slug)!;

interface IndependentReviewItem {
  id: string; nodeId: string; verdict: "PASS" | "REVISE" | "FAIL";
  clarityIssues: string[]; cues: { phrase: string; why: string }[]; fairness: string[]; suggestions: string[];
}
interface ReviewResponsePacket {
  sourceReviewFile: string; sourceReviewFileSha256: string; sourceReview: IndependentReviewItem[];
  counts: Record<string, number>;
  items: { slug: string; questionVariantId: string; reviewedQuestionVariantId: string;
    status: "pass-preserved" | "revised" | "parked"; reviewResponseAttempts: number;
    sourceReviewRecordSha256: string; before: { question: QuestionVariant; node: DecisionNode; case: SyntheticClinicalCase };
    after: { question: QuestionVariant; node: DecisionNode; case: SyntheticClinicalCase } | null;
    issueDispositions: Record<"clarityIssues" | "cues" | "fairness" | "suggestions", { issue: unknown; disposition: string }[]>;
    independentReReview: string; clinicalReviewStatus: string }[];
  artifacts: { questions: unknown; cases: unknown; concepts: unknown; timingProposals: unknown; orderProposals: unknown };
  afterFingerprints: { questionVariantId: string; nodeId: string; caseId: string;
    questionSha256: string; nodeSha256: string; caseSha256: string }[];
}
const response = (packet as Packet & { reviewResponse: ReviewResponsePacket }).reviewResponse;

describe("stomach-neoplasia explicit-import topic authoring packet", () => {
  it("validates complete existing-schema clinic cases without granting admission", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.STOMACH_NEOPLASIA_PREVIEW_RELEASE).success).toBe(true);
    expect(topic.STOMACH_NEOPLASIA_CASES).toHaveLength(11);
    expect(topic.STOMACH_NEOPLASIA_QUESTIONS).toHaveLength(16);
    expect(topic.STOMACH_NEOPLASIA_MANIFEST).toMatchObject({ reviewStatus: "needs_clinician_review",
      pipelinePassed: false, managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false });
    const source = readFileSync(new URL("./question-topic-stomach-neoplasia-20261111.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/from ["']\.\/(?:index|synthetic-content|question-ship-manifest)["']/);
    expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest)\s*\(/);
  });

  it("reconciles every primary assignment and every exact verdict", () => {
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"])
      expect(packet.assignment[key]).toEqual(program[key]!.filter(r => r.primaryTopicSlug === "stomach-neoplasia"));
    expect(packet.audit.map(r => r.recordId).sort()).toEqual(packet.assignment.inventory.map(r => r.recordId).sort());
    expect(new Set(packet.audit.map(r => r.recordId)).size).toBe(49);
    expect(packet.counts).toMatchObject({ audited: 49, kept: 17, rewritten: 4, retiredAndReplacedProposed: 28,
      new: 12, proposedQuestions: 16, proposedCases: 11, reusedConcepts: 3, newMeanings: 13,
      rawAndLiveContextAudits: 68, distinctNodeSerializations: 50, distinctVisibleContexts: 67,
      frozenPassVersions: 7, exactClinicallyApprovedVariants: 10, unkeyedSlots: 0, assignedRecordedHolds: 2 });
  });

  it("pins the assigned clinical inputs while allowing shared assembly drift", () => {
    for (const input of packet.baseline.sourceInputs.filter(i => !["packages/clinical-content/src/index.ts",
      "packages/clinical-content/src/synthetic-content.ts"].includes(i.file))) {
      const current = createHash("sha256").update(readFileSync(rootFile(input.file))).digest("hex");
      expect(current, input.file).toBe(input.currentSha256);
      if (input.programSha256) expect(current, input.file).toBe(input.programSha256);
    }
    for (const b of packet.before) {
      expect(b.questions).toHaveLength(1);
      expect(sha(b.questions[0]!.question)).toBe(b.questions[0]!.questionSha256);
      for (const c of b.contexts) {
        expect(sha(c.case)).toBe(c.caseSha256);
        expect(sha(c.node)).toBe(c.nodeSha256);
      }
    }
  });

  it("retains full visible contexts and supported replacement identities", () => {
    const ids = new Set([...packet.assignment.inventory.flatMap(i => i.variantIds),
      ...topic.STOMACH_NEOPLASIA_QUESTIONS.map(q => q.id)]);
    const claims = new Set(ledger.claims.map(c => c.id));
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons).toHaveLength(3);
      expect(row.reasons.every(r => r.length > 60)).toBe(true);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.sourceFile).toContain("packages/clinical-content/src/");
      expect(row.exportLocator.length).toBeGreaterThan(5);
      for (const c of row.supportingAuditClaimIds) expect(claims.has(c)).toBe(true);
      for (const c of row.contextAudit) for (const v of c.visibleContexts) {
        expect(sha(v.fields)).toBe(v.visibleSha256);
        expect(v.profileIds.length).toBeGreaterThan(0);
        expect(v.fields.stem).toBeTruthy();
      }
      if (row.verdict !== "Keep") {
        expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
        for (const id of row.replacementQuestionVariantIds) expect(ids.has(id), id).toBe(true);
      }
    }
    expect(packet.audit.filter(r => r.contextAudit.length === 0)).toHaveLength(2);
  });

  it("preserves exact PASS and clinician-approved versions as separate historical authority", () => {
    expect(packet.assignment.frozenIndependentPassReferences).toHaveLength(7);
    expect(packet.assignment.clinicalApprovalReferences.map(a => a.id).sort()).toEqual([
      "approval.melissa-rowland-md.owner-row-039.2026-08-06",
      "approval.melissa-rowland-md.owner-row-042.2026-08-06",
    ]);
    for (const ref of packet.assignment.frozenIndependentPassReferences) {
      const before = packet.before.find(b => b.questions[0]!.question.id === ref.questionVariantId)!;
      expect(before.questions[0]!.questionSha256).toBe(ref.questionSha256);
      expect(packet.audit.find(r => r.variantIds.includes(ref.questionVariantId))!.verdict).toBe("Keep");
      const decisions = readJson(ref.originalDecisionFile) as { id: string; verdict: string }[];
      const decision = decisions.find(d => d.id === (ref.reviewId ?? ref.id))!;
      expect(decision.verdict).toBe("PASS");
      if (ref.reviewRecordSha256) expect(sha(decision)).toBe(ref.reviewRecordSha256);
      if (ref.reviewPacketAfterSha256) {
        type ReviewView = { id: string; after: { variantId: string; Presentation: string; Task: string;
          Options: string[] }; contextRevisions: ReviewView[] };
        const views = readJson(ref.reviewPacketFile) as ReviewView[];
        const view = views.flatMap(v => [v, ...(v.contextRevisions ?? [])]).find(v => v.id === ref.reviewId)!;
        expect(sha(view.after)).toBe(ref.reviewPacketAfterSha256);
        expect(view.after.variantId).toBe(ref.questionVariantId);
        for (const context of before.contexts) {
          expect(view.after.Presentation.replaceAll("Jamie Taylor", "{patientName}")).toBe(context.case.presentation);
          expect(view.after.Task.replaceAll("Jamie Taylor", "{patientName}")).toBe(context.node.stem);
          expect(view.after.Options.map(o => o.replace(/^\*\*KEY:\*\* /, "")))
            .toEqual([...context.node.answerChoices].sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect)).map(c => c.label));
        }
      }
    }
    const n3 = packet.assignment.frozenIndependentPassReferences.find(r => r.id === "review.n3.gastric-lymphoma-new-large-cell-process.v2")!;
    expect(n3.originalFreeze).toMatchObject({
      variantSha256: "70fb910e8aa9e70f228d04a125be08f880859e132e4687d8b202a3fa7eee09a6",
      authoredCaseSha256: "c0a73c140565409277e2dbc382c3eee17ad8e0699c71db73fabe13a1401f09fc",
    });
    for (const ref of packet.assignment.clinicalApprovalReferences) for (const id of ref.approvedQuestionVariantIds) {
      const b = packet.before.find(b => b.questions[0]!.question.id === id)!;
      expect(b.questions[0]!.question.reviewStatus).toBe("clinically_approved");
      expect(b.questions[0]!.question.contentVersion).toBe(ref.contentVersion);
      expect(packet.audit.find(r => r.variantIds.includes(id))!.verdict).toBe("Keep");
    }
  });

  it("keeps all new clinical records in review and out of old identities", () => {
    for (const record of [...topic.STOMACH_NEOPLASIA_PROPOSALS, ...topic.STOMACH_NEOPLASIA_QUESTIONS,
      ...topic.STOMACH_NEOPLASIA_CONCEPT_PROPOSALS, ...topic.STOMACH_NEOPLASIA_CLAIMS,
      ...topic.STOMACH_NEOPLASIA_SOURCES, ...topic.STOMACH_NEOPLASIA_CASE_REVIEWS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(topic.STOMACH_NEOPLASIA_QUESTIONS.some(q => packet.assignment.inventory.some(i => i.variantIds.includes(q.id)))).toBe(false);
    expect(new Set(topic.STOMACH_NEOPLASIA_CONCEPTS.map(c => c.id)).size).toBe(16);
    expect(topic.STOMACH_NEOPLASIA_CONCEPT_PROPOSALS.filter(c => c.conceptRelation === "reuse").map(c => c.id).sort()).toEqual([
      "concept.gastric-gist.eus-core-molecular-diagnosis", "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
      "concept.n1r2.gastric-organ-specific-resection",
    ].sort());
    expect(proposal("banked-tissue-provenance").previousConceptId).toBe("concept.n2.gastric-wall-mass-specimen-provenance");
    expect(proposal("banked-tissue-provenance").conceptId).not.toBe(proposal("banked-tissue-provenance").previousConceptId);
  });

  it("supplies a concrete evidence-linked gap matrix and registry-only history", () => {
    expect(packet.rankedConcepts).toHaveLength(15);
    expect(packet.coverageHistory).toHaveLength(13);
    expect(packet.rankedConcepts.map(r => r.rank)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    for (const r of packet.rankedConcepts) {
      expect(r.decision.length).toBeGreaterThan(40);
      expect(r.closestCredibleError.length).toBeGreaterThan(40);
      expect(r.consequence.length).toBeGreaterThan(15);
    }
    expect(packet.coverageHistory.every(c => c.rankedConcepts.length > 0)).toBe(true);
  });

  it("uses complete named finite clinic frames and separate acuity/tier/progression fields", () => {
    for (const c of topic.STOMACH_NEOPLASIA_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.patientDisplayName.split(" ").length).toBeGreaterThan(1);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      expect(c.presentation).not.toMatch(/^A patient with/);
      for (const n of c.decisionNodes) {
        expect(n.stem).toContain("{patientName}");
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices).toHaveLength(3);
        expect(n.answerChoices.filter(x => x.isCorrect)).toHaveLength(1);
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(x => x.serviceRequest === null)).toBe(true);
      }
    }
    expect(topic.STOMACH_NEOPLASIA_CASE_REVIEWS.every(r => r.educationalTier === 2 && r.patientAcuity === "stable"
      && r.facilityProgressionLevel === 3 && r.clinicalSetting === "clinic")).toBe(true);
    expect(packet.integration.pairedOnlyCases).toHaveLength(4);
  });

  it("keeps later records and feedback out of the first scored context", () => {
    const first = (slug: string) => {
      const c = topic.STOMACH_NEOPLASIA_CASES.find(c => c.id.endsWith(`${slug}.v1`))!;
      const n = c.decisionNodes[0]!;
      return JSON.stringify({ presentation: c.presentation, update: n.currentUpdate, task: n.stem, exhibit: n.exhibit });
    };
    expect(first("cardia-wall-mass")).not.toMatch(/KIT exon 11|sunitinib|34 HU/);
    expect(first("diffuse-gastric-cancer")).not.toMatch(/concordant|Malignant epithelial cells/);
    expect(first("changed-gastric-lymphoma")).not.toMatch(/R-CHOP|Uptake is confined/);
    expect(proposal("r1-without-rupture").exhibit).not.toEqual(proposal("localized-gist-operation").exhibit);
  });

  it("maps every diagnostic key and distractor to a real placeholder timing profile", () => {
    expect(topic.STOMACH_NEOPLASIA_TIMING_PROPOSALS).toHaveLength(16);
    expect(topic.STOMACH_NEOPLASIA_ORDER_PROPOSALS).toHaveLength(14);
    for (const entry of topic.STOMACH_NEOPLASIA_TIMING_PROPOSALS) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const p = topic.STOMACH_NEOPLASIA_PROPOSALS.find(p => p.questionVariantId === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(3);
        for (const timing of entry.classification.choices) {
          const c = p.choices.find(c => c.id === timing.choiceId)!;
          expect(timing.choiceLabel).toBe(c.label);
          if (timing.timing.kind === "test") {
            expect(timing.timing.timingProfileId).toBe(c.timingProfileId);
            expect(getDiagnosticTimingProfileMapping(timing.timing.timingProfileId), timing.timing.timingProfileId).toBeDefined();
          } else expect(c.timingProfileId).toBeNull();
        }
      } else expect(p.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    for (const o of topic.STOMACH_NEOPLASIA_ORDER_PROPOSALS) {
      expect(o.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(o.serviceRequest).toBeNull();
      expect(o.resultGateAfter).toBeNull();
    }
  });

  it("provides complete sources with independent authority and reuse assessments", () => {
    expect(ledger.sources).toHaveLength(14);
    expect(ledger.claims).toHaveLength(42);
    for (const s of ledger.sources) {
      for (const k of ["id", "title", "completeCitation", "organizationOrJournal", "officialUrl", "accessedOn",
        "sourceClass", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment", "usageRole"] as const) expect(s[k]).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.publicationYear).toBeGreaterThan(2000);
      expect(s.rightsCheck.finding.length).toBeGreaterThan(80);
      expect(s.evidenceClaimIds).toEqual(ledger.claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id));
    }
    for (const link of topic.STOMACH_NEOPLASIA_SOURCE_LINKS) expect(link).toMatchObject({
      target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
    });
    expect(ledger.excludedSources.length).toBeGreaterThan(4);
  });

  it("connects every proposed assertion and option rationale to an atomic claim", () => {
    const claims = new Set(ledger.claims.map(c => c.id));
    const sources = new Set(ledger.sources.map(s => s.id));
    for (const c of ledger.claims) {
      expect(c.id).toContain("claim.question-topic.stomach-neoplasia.");
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.certainty).toBeTruthy();
      expect(c.sourceIds.every(id => sources.has(id))).toBe(true);
      expect(ledger.claimToQuestionMappings.find(m => m.claimId === c.id)).toBeDefined();
    }
    for (const p of topic.STOMACH_NEOPLASIA_PROPOSALS) {
      expect(p.supportingEvidenceClaimIds.every(id => claims.has(id))).toBe(true);
      for (const c of p.choices) {
        expect(c.evidenceClaimIds.every(id => claims.has(id))).toBe(true);
        expect(c.evidenceClaimIds.every(id => p.supportingEvidenceClaimIds.includes(id))).toBe(true);
        expect(c.rationale.length).toBeGreaterThan(70);
        expect(c.temptation.length).toBeGreaterThan(25);
        expect(c.counterfactual.length).toBeGreaterThan(50);
      }
    }
    for (const m of topic.STOMACH_NEOPLASIA_STATEMENT_MAPPINGS) for (const a of m.assertions) {
      expect(a.claimIds.length).toBeGreaterThan(0);
      expect(a.claimIds.every(id => claims.has(id))).toBe(true);
    }
  });

  it("records concrete manual author attacks, reasoning and decision-changing counterfactuals", () => {
    for (const p of topic.STOMACH_NEOPLASIA_PROPOSALS) {
      const g = p.manualAuthorGate;
      expect(g.reasoningSteps).toHaveLength(2);
      for (const value of [g.coverTheKey, g.sameDecisionStageAndCategory, ...g.reasoningSteps,
        g.closestError, g.decidingObservation, g.consequence, g.residentDifficulty,
        g.singleDefensibleBestAnswer, g.counterfactual, g.sequenceReview, g.repairAndRecheck]) {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(35);
      }
      expect(g.deletionTest.length).toBeGreaterThanOrEqual(3);
      expect(p.choices.every(c => !/\balone\b|individualized|tailored|assume|solely because/i.test(c.label))).toBe(true);
      const lengths = p.choices.map(c => c.label.length);
      expect(Math.max(...lengths) / Math.min(...lengths)).toBeLessThan(1.7);
    }
    expect(topic.STOMACH_NEOPLASIA_MANIFEST.reviewDisplay).toContain("key shown first for review only");
  });

  it("retains assigned holds and named clinical decisions without unkeyed scoring", () => {
    expect(packet.assignment.recordedHolds.map(h => h.id).sort()).toEqual([
      "claim.n1r3.gastric-inseparable-invaded-interface", "review.n2.gastric-wall-mass-specimen-provenance.v2",
    ]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(ledger.withheldDisagreements.map(h => h.id)).toContain("claim.n1r3.gastric-inseparable-invaded-interface");
    for (const h of packet.assignment.recordedHolds) expect(packet.ownerApprovalsNeeded.some(a => a.id === h.id)).toBe(true);
    expect(packet.ownerApprovalsNeeded.every(a => a.question.length > 60 && a.boundary.length > 50)).toBe(true);
    expect(topic.STOMACH_NEOPLASIA_PROPOSALS.some(p => p.before?.includes("question.n1.gastric-adjacent-invasion.v3"))).toBe(false);
  });

  it("binds packet after fields and fingerprints to the normal explicit import", () => {
    expect(packet.artifacts.questions).toEqual(topic.STOMACH_NEOPLASIA_QUESTIONS);
    expect(packet.artifacts.cases).toEqual(topic.STOMACH_NEOPLASIA_CASES);
    expect(packet.artifacts.conceptProposals).toEqual(topic.STOMACH_NEOPLASIA_CONCEPT_PROPOSALS);
    expect(packet.artifacts.timingProposals).toEqual(topic.STOMACH_NEOPLASIA_TIMING_PROPOSALS);
    expect(packet.artifacts.orderProposals).toEqual(topic.STOMACH_NEOPLASIA_ORDER_PROPOSALS);
    for (const f of packet.afterFingerprints) {
      const p = topic.STOMACH_NEOPLASIA_PROPOSALS.find(p => p.questionVariantId === f.questionVariantId)!;
      expect(sha(topic.STOMACH_NEOPLASIA_QUESTIONS.find(q => q.id === f.questionVariantId))).toBe(f.questionSha256);
      expect(sha(topic.STOMACH_NEOPLASIA_NODES.find(n => n.id === p.nodeId))).toBe(f.nodeSha256);
      expect(sha(topic.STOMACH_NEOPLASIA_CASES.find(c => c.id === p.caseId))).toBe(f.caseSha256);
      expect(sha(p.manualAuthorGate)).toBe(f.manualGateSha256);
    }
  });

  it("keeps advisory cue findings reviewable rather than asserting clinical PASS", () => {
    const flagged = packet.advisoryLint.variants.filter(v => v.findings.length).map(v => v.questionVariantId).sort();
    expect(packet.advisoryLintDispositions.map(v => v.questionVariantId).sort()).toEqual(flagged);
    expect(packet.advisoryLintDispositions.flatMap(v => v.findings).length).toBe(packet.advisoryLint.totals.findings);
    expect(packet.advisoryLintDispositions.every(v => v.findings.every(f => f.disposition.length > 90))).toBe(true);
  });
});

describe("stomach-neoplasia independent-review response", () => {
  it("accounts for every reviewed exact item and every returned issue once", () => {
    const sourceText = readFileSync(rootFile(response.sourceReviewFile), "utf8");
    expect(createHash("sha256").update(sourceText).digest("hex")).toBe(response.sourceReviewFileSha256);
    expect(response.sourceReview).toEqual(JSON.parse(sourceText));
    expect(response.counts).toMatchObject({ reviewed: 16, passPreserved: 7, revised: 6, parked: 3,
      repairAttempts: 9, currentQuestions: 13, currentCases: 11, sameMeaningRevisions: 4, newMeaningRevisions: 2 });
    expect(new Set(response.items.map(i => i.reviewedQuestionVariantId)).size).toBe(16);
    for (const item of response.sourceReview) {
      const addressed = response.items.find(i => i.reviewedQuestionVariantId === item.id)!;
      expect(addressed).toBeDefined();
      expect(addressed.sourceReviewRecordSha256).toBe(sha(item));
      expect(addressed.reviewResponseAttempts).toBe(item.verdict === "PASS" ? 0 : 1);
      expect(addressed.status === "pass-preserved").toBe(item.verdict === "PASS");
      for (const category of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        expect(addressed.issueDispositions[category].map(d => d.issue)).toEqual(item[category]);
        for (const d of addressed.issueDispositions[category]) expect(d.disposition.length).toBeGreaterThan(70);
      }
    }
  });

  it("preserves every PASS question, node, full case and author gate exactly", () => {
    for (const reviewed of response.sourceReview.filter(i => i.verdict === "PASS")) {
      const item = response.items.find(i => i.reviewedQuestionVariantId === reviewed.id)!;
      const currentQuestion = topic.STOMACH_NEOPLASIA_CURRENT_QUESTIONS.find(q => q.id === reviewed.id)!;
      const currentCase = topic.STOMACH_NEOPLASIA_CURRENT_CASES.find(c => c.decisionNodes.some(n => n.id === reviewed.nodeId))!;
      expect(currentQuestion).toEqual(item.before.question);
      expect(currentCase).toEqual(item.before.case);
      expect(currentCase.decisionNodes.find(n => n.id === reviewed.nodeId)).toEqual(item.before.node);
      expect(item.after).toEqual({ ...item.after, question: item.before.question, case: item.before.case, node: item.before.node });
      const archivedProposal = (packet as Packet & { artifacts: { proposals: { slug: string; manualAuthorGate: unknown }[] } })
        .artifacts.proposals.find(p => p.slug === item.slug)!;
      expect(proposal(item.slug).manualAuthorGate).toEqual(archivedProposal.manualAuthorGate);
    }
  });

  it("retains only all-PASS multipart cases and isolates every revised candidate", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.STOMACH_NEOPLASIA_CURRENT_PREVIEW_RELEASE).success).toBe(true);
    expect(topic.STOMACH_NEOPLASIA_CURRENT_CASES).toHaveLength(11);
    expect(topic.STOMACH_NEOPLASIA_CURRENT_QUESTIONS).toHaveLength(13);
    expect(topic.STOMACH_NEOPLASIA_CURRENT_CONCEPTS).toHaveLength(13);
    const multiparts = topic.STOMACH_NEOPLASIA_CURRENT_CASES.filter(c => c.decisionNodes.length > 1);
    expect(multiparts).toHaveLength(2);
    const passedNodeIds = new Set(response.sourceReview.filter(i => i.verdict === "PASS").map(i => i.nodeId));
    for (const c of multiparts) expect(c.decisionNodes.every(n => passedNodeIds.has(n.id))).toBe(true);
    for (const c of topic.STOMACH_NEOPLASIA_REVISED_CASES) expect(c.decisionNodes).toHaveLength(1);
    for (const parked of topic.STOMACH_NEOPLASIA_PARKED) {
      expect(parked.repairAttempts).toBe(1);
      expect(parked.reason.length).toBeGreaterThan(100);
      expect(topic.STOMACH_NEOPLASIA_CURRENT_QUESTIONS.some(q => q.id.includes(`.${parked.slug}.`))).toBe(false);
    }
    expect(topic.STOMACH_NEOPLASIA_RESPONSE_MANIFEST).toMatchObject({ reviewStatus: "needs_clinician_review",
      pipelinePassed: false, managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false });
  });

  it("versions revisions and preserves history only for unchanged clinical meanings", () => {
    const changed = new Set(["large-cell-distribution", "gastric-large-cell-treatment"]);
    for (const p of topic.STOMACH_NEOPLASIA_REVISED_PROPOSALS) {
      expect(p.questionVariantId).toMatch(/\.v2$/);
      expect(p.nodeId).toMatch(/\.v2$/);
      expect(p.caseId).toMatch(/\.v2$/);
      expect(p.previousQuestionVariantId).toBe(proposal(p.slug).questionVariantId);
      expect(p.before).toEqual([p.previousQuestionVariantId]);
      expect(p.creationKind).toBe(changed.has(p.slug) ? "new" : "Rewrite");
      expect(p).toMatchObject({ reviewStatus: "needs_clinician_review", repairAttempts: 1,
        independentReview: "pending", pipelinePassed: false, shuffleAnswers: true });
      if (changed.has(p.slug)) {
        expect(p.conceptId).not.toBe(proposal(p.slug).conceptId);
        expect(p.previousConceptId).toBe(proposal(p.slug).conceptId);
      } else expect(p.conceptId).toBe(proposal(p.slug).conceptId);
      const c = topic.STOMACH_NEOPLASIA_REVISED_CASES.find(c => c.id === p.caseId)!;
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.patientDisplayName).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.chiefComplaint).toBeTruthy();
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.decisionNodes[0]!.shuffleAnswers).toBe(true);
    }
  });

  it("maps revised claims, rubrics and every testing choice without executing orders", () => {
    const claimIds = new Set(ledger.claims.map(c => c.id));
    for (const p of topic.STOMACH_NEOPLASIA_REVISED_PROPOSALS) {
      expect(p.supportingEvidenceClaimIds.every(id => claimIds.has(id))).toBe(true);
      expect(p.choices.filter(c => c.isCorrect)).toHaveLength(1);
      expect(p.manualAuthorGate.reasoningSteps).toHaveLength(2);
      for (const text of [p.manualAuthorGate.closestError, p.manualAuthorGate.decidingObservation,
        p.manualAuthorGate.counterfactual, p.manualAuthorGate.singleDefensibleBestAnswer,
        p.manualAuthorGate.sequenceReview, p.manualAuthorGate.repairAndRecheck]) expect(text.length).toBeGreaterThan(70);
      for (const c of p.choices) {
        expect(c.evidenceClaimIds.every(id => p.supportingEvidenceClaimIds.includes(id))).toBe(true);
        expect(c.counterfactual.length).toBeGreaterThan(70);
      }
      const timing = topic.STOMACH_NEOPLASIA_CURRENT_TIMING.find(e => e.questionVariantId === p.questionVariantId)!;
      expect(timing).toBeDefined();
      if (p.choices.some(c => c.timingProfileId)) {
        expect(timing.classification.kind).toBe("test_choices");
        if (timing.classification.kind === "test_choices") {
          expect(timing.classification.choices.map(c => c.choiceId)).toEqual(p.choices.map(c => c.id));
          for (const c of timing.classification.choices) if (c.timing.kind === "test")
            expect(getDiagnosticTimingProfileMapping(c.timing.timingProfileId)).toBeTruthy();
        }
      } else expect(timing.classification.kind).toBe("no_test");
    }
    for (const entry of topic.STOMACH_NEOPLASIA_REVISED_ORDERS) expect(entry).toMatchObject({
      disposition: { kind: "not_executed", reason: "future_planned" }, serviceRequest: null, resultGateAfter: null });
    for (const mapping of topic.STOMACH_NEOPLASIA_REVISED_STATEMENT_MAPPINGS) for (const a of mapping.assertions)
      expect(a.claimIds.length > 0 && a.claimIds.every(id => claimIds.has(id))).toBe(true);
    for (const link of topic.STOMACH_NEOPLASIA_CURRENT_SOURCE_LINKS) expect(link).toMatchObject({
      target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });

  it("serializes the current explicit-import artifact exactly in the packet", () => {
    expect(response.artifacts.questions).toEqual(topic.STOMACH_NEOPLASIA_CURRENT_QUESTIONS);
    expect(response.artifacts.cases).toEqual(topic.STOMACH_NEOPLASIA_CURRENT_CASES);
    expect(response.artifacts.concepts).toEqual(topic.STOMACH_NEOPLASIA_CURRENT_CONCEPTS);
    expect(response.artifacts.timingProposals).toEqual(topic.STOMACH_NEOPLASIA_CURRENT_TIMING);
    expect(response.artifacts.orderProposals).toEqual(topic.STOMACH_NEOPLASIA_CURRENT_ORDERS);
    for (const f of response.afterFingerprints) {
      const q = topic.STOMACH_NEOPLASIA_CURRENT_QUESTIONS.find(q => q.id === f.questionVariantId)!;
      const c = topic.STOMACH_NEOPLASIA_CURRENT_CASES.find(c => c.id === f.caseId)!;
      const n = c.decisionNodes.find(n => n.id === f.nodeId)!;
      expect(sha(q)).toBe(f.questionSha256);
      expect(sha(n)).toBe(f.nodeSha256);
      expect(sha(c)).toBe(f.caseSha256);
    }
  });
});
