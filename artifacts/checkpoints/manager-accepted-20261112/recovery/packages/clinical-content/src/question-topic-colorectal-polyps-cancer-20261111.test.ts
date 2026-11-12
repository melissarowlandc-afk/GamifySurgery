
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease, type SyntheticClinicalCase } from "./schema";
import {
  CPC_AUTHOR_CHECKS, CPC_AUTHORING_CONCEPTS, CPC_CASE_REVIEWS, CPC_CASES, CPC_CLAIMS,
  CPC_CONCEPTS, CPC_ITEMS, CPC_MANIFEST, CPC_ORDER_PROPOSALS, CPC_PREVIEW_RELEASE,
  CPC_QUESTIONS, CPC_SOURCE_LINKS, CPC_SOURCES, CPC_STATEMENT_MAPPINGS, CPC_TIMING_ENTRIES,
  CPC_COMPOSITION_PROPOSALS, CPC_ITEM_STATUSES, CPC_PARKED_ATTEMPTS, CPC_REVIEW_INPUT,
  CPC_REVIEWED_V1_CATALOG, CPC_REVIEWED_V1_CLAIMS, CPC_REVIEWED_V1_SOURCES, CPC_REVISION_ITEMS,
} from "./question-topic-colorectal-polyps-cancer-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const sha = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
interface Review { id: string; verdict: string; clarityIssues: string[]; cues: unknown[]; fairness: string[]; suggestions: string[] }
interface InventoryRow { recordId: string; primaryTopicSlug: string; conceptId: string; variantIds: string[] }
interface FindingResponse { index: number; finding: unknown; response: string; disposition: string }
interface Correction {
  reviewedQuestionVariantId: string; status: string; attemptCount: number; currentQuestionVariantId: string | null;
  response: { clarityIssues?: FindingResponse[]; cues?: FindingResponse[]; fairness?: FindingResponse[]; suggestions?: FindingResponse[] };
}
interface Context { sha256: string; origins: unknown; [key: string]: unknown }
const packet = JSON.parse(read("docs/research/question-topic-colorectal-polyps-cancer-20261111.json")) as {
  assignment: {
    inventory: InventoryRow[]; concepts: unknown[]; caseAssignments: unknown[]; nodeAssignments: unknown[]; variantAssignments: unknown[];
    frozenIndependentPassReferences: Array<{ file: string; fileSha256: string; variantIds: string[] }>;
    historicalClinicalApprovals: Array<{ variantId: string; contentVersion: string; sha256: string }>;
    recordedHolds: Array<{ id: string }>; unkeyedDraftSlots: unknown[];
  };
  before: Array<{ recordId: string; questionDefinitions: Array<{ question: { id: string; contentVersion: string }; sha256: string }>; contexts: Context[] }>;
  audit: Array<{ recordId: string; variantIds: string[]; verdict: string; replacementQuestionVariantId: string | null; currentReplacementQuestionVariantId: string | null; contextAudits: Array<{ contextSha256: string }> }>;
  coverageHistory: unknown[]; rankedConcepts: Array<{ inventoryRecordIds: string[] }>;
  proposedItems: Array<{ questionVariantId: string; exactAfterSha256: string; exactQuestionSha256: string; after: unknown; reviewStatus: string; status: string }>;
  exportsSnapshot: {
    questions: typeof CPC_QUESTIONS; cases: typeof CPC_CASES; concepts: typeof CPC_CONCEPTS;
    selfChecks: typeof CPC_AUTHOR_CHECKS; timing: typeof CPC_TIMING_ENTRIES; orders: typeof CPC_ORDER_PROPOSALS;
  };
  independentReviewRound1: {
    reviewSha256: string; reviewRecords: Review[]; reviewedSnapshot: typeof CPC_REVIEWED_V1_CATALOG;
    items: Correction[]; counts: Record<string, number>;
    passPreservationReceipts: Array<{ originalQuestionSha256: string; currentQuestionSha256: string; originalHeaderSha256: string; currentHeaderSha256: string; originalVisibleNodeSha256: string; currentVisibleNodeSha256: string }>;
  };
  ownerApprovalsNeeded: Array<{ id: string }>;
};
const ledger = JSON.parse(read("docs/research/sources-question-topic-colorectal-polyps-cancer-20261111.json")) as {
  sources: typeof CPC_SOURCES; evidenceClaims: typeof CPC_CLAIMS;
  sourceToClaim: Array<{ sourceId: string; claimIds: string[] }>;
  claimToQuestion: Array<{ claimId: string; questionVariantIds: string[] }>;
  historicalEvidence: { unresolvedClaimIds: string[]; claims: unknown[] };
  reviewedV1Evidence: { sourceRecords: typeof CPC_SOURCES; evidenceClaims: typeof CPC_CLAIMS };
  excludedOrLimitedCandidates: Array<{ source?: string; decision?: string }>;
};
const review = JSON.parse(read(CPC_REVIEW_INPUT.path)) as Review[];
const passIds = new Set(review.filter(r => r.verdict === "PASS").map(r => r.id));
const header = ({ decisionNodes: _nodes, ...rest }: SyntheticClinicalCase) => rest;
const visibleNode = ({ terminalDispositions: _terminal, ...rest }: SyntheticClinicalCase["decisionNodes"][number]) => rest;

describe("colorectal independent-review correction sidecar", () => {
  it("binds the exact review input and all 34 original definitions", () => {
    expect(sha(read(CPC_REVIEW_INPUT.path))).toBe("20acba0aa5cb233abbb31324e2a18d4234a68be47d3f0016faac99fbc368afd0");
    expect(CPC_REVIEW_INPUT.sha256).toBe(packet.independentReviewRound1.reviewSha256);
    expect(review).toEqual(packet.independentReviewRound1.reviewRecords);
    expect(CPC_REVIEWED_V1_CATALOG.questions).toHaveLength(34);
    expect(sha(CPC_REVIEWED_V1_CATALOG.questions)).toBe("39a5689889ad246f2a80ef6e95965b8f286752f26a0329adb451661fe74c476f");
    expect(sha(CPC_REVIEWED_V1_CATALOG.cases)).toBe("02df2209589c0c1a4b5f7ff511e4fca4e654f6cc34aa163d63a479369bca3dae");
    for (const key of Object.keys(CPC_REVIEWED_V1_CATALOG) as Array<keyof typeof CPC_REVIEWED_V1_CATALOG>) {
      expect(CPC_REVIEWED_V1_CATALOG[key]).toEqual(packet.independentReviewRound1.reviewedSnapshot[key]);
    }
  });

  it("preserves every PASS question, header and visible node exactly", () => {
    expect(passIds.size).toBe(13);
    const adapted: string[] = [];
    for (const id of passIds) {
      expect(CPC_QUESTIONS.find(q => q.id === id)).toEqual(CPC_REVIEWED_V1_CATALOG.questions.find(q => q.id === id));
      const before = CPC_REVIEWED_V1_CATALOG.cases.find(c => c.decisionNodes.some(n => n.questionVariantId === id))!;
      const after = CPC_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === id))!;
      expect(header(after)).toEqual(header(before));
      const oldNode = before.decisionNodes.find(n => n.questionVariantId === id)!;
      const newNode = after.decisionNodes[0]!;
      expect(visibleNode(newNode)).toEqual(visibleNode(oldNode));
      if (sha(newNode) !== sha(oldNode)) {
        adapted.push(id);
        expect(oldNode.terminalDispositions).toEqual([]);
        expect(newNode.terminalDispositions).toHaveLength(newNode.answerChoices.filter(a => !a.isCorrect).length);
        for (const disposition of newNode.terminalDispositions) {
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind === "no_terminal_outcome") {
            expect(disposition.clinicalRationale).toBe(newNode.answerChoices.find(a => a.id === disposition.answerChoiceId)!.rationale);
          }
        }
      }
    }
    expect(adapted).toEqual(["question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1"]);
    expect(packet.independentReviewRound1.passPreservationReceipts).toHaveLength(13);
    for (const r of packet.independentReviewRound1.passPreservationReceipts) {
      expect(r.currentQuestionSha256).toBe(r.originalQuestionSha256);
      expect(r.currentHeaderSha256).toBe(r.originalHeaderSha256);
      expect(r.currentVisibleNodeSha256).toBe(r.originalVisibleNodeSha256);
    }
  });

  it("makes exactly one attempt for each returned item and excludes every parked key", () => {
    expect(CPC_ITEM_STATUSES).toHaveLength(34);
    expect(CPC_ITEM_STATUSES.filter(s => s.status === "pass-preserved")).toHaveLength(13);
    expect(CPC_ITEM_STATUSES.filter(s => s.status === "revised")).toHaveLength(13);
    expect(CPC_ITEM_STATUSES.filter(s => s.status === "parked")).toHaveLength(8);
    expect(packet.independentReviewRound1.counts).toMatchObject({ audited: 34, reviewPASS: 13, reviewREVISE: 20, reviewFAIL: 1, passPreserved: 13, revised: 13, parked: 8, oneRevisionAttempts: 21 });
    for (const r of review) {
      const status = CPC_ITEM_STATUSES.find(s => s.reviewedQuestionVariantId === r.id)!;
      expect(status.attemptCount).toBe(r.verdict === "PASS" ? 0 : 1);
      if (r.verdict !== "PASS") expect(CPC_QUESTIONS.some(q => q.id === r.id)).toBe(false);
      if (status.status === "revised") {
        expect(status.currentQuestionVariantId).toBe(r.id.replace(/v1$/, "v2"));
        expect(CPC_QUESTIONS.some(q => q.id === status.currentQuestionVariantId)).toBe(true);
      }
    }
    expect(CPC_PARKED_ATTEMPTS).toHaveLength(8);
    for (const attempt of CPC_PARKED_ATTEMPTS) {
      expect(attempt.attemptCount).toBe(1);
      expect(attempt.correctChoice).toBeNull();
      expect(attempt.currentQuestionVariantId).toBeNull();
      expect(attempt.emittedInSidecar).toBe(false);
      expect(attempt.reason.length).toBeGreaterThan(70);
      expect(attempt.nextAction.length).toBeGreaterThan(40);
      expect(attempt.caseDraft.nodes[0]).not.toHaveProperty("correctChoice");
      expect(CPC_QUESTIONS.some(q => q.id === attempt.attemptedQuestionVariantId || q.id === attempt.reviewedQuestionVariantId)).toBe(false);
    }
  });

  it("addresses every indexed clarity, cue, fairness and suggestion finding", () => {
    for (const r of review.filter(r => r.verdict !== "PASS")) {
      const row = packet.independentReviewRound1.items.find(s => s.reviewedQuestionVariantId === r.id)!;
      for (const field of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        const responses = row.response[field]!;
        expect(responses).toHaveLength(r[field].length);
        responses.forEach((response, index) => {
          expect(response.index).toBe(index);
          expect(response.finding).toEqual(r[field][index]);
          expect(response.response.length).toBeGreaterThan(50);
          expect(response.disposition).toBeTruthy();
        });
      }
    }
  });

  it("validates active standalone cases and disables all unreviewed pair compositions", () => {
    expect(() => validateSyntheticClinicalRelease(CPC_PREVIEW_RELEASE)).not.toThrow();
    expect(CPC_QUESTIONS).toHaveLength(26);
    expect(CPC_CASES).toHaveLength(26);
    expect(CPC_CONCEPTS).toHaveLength(22);
    expect(new Set(CPC_QUESTIONS.map(q => q.id)).size).toBe(26);
    expect(new Set(CPC_CASES.map(c => c.id)).size).toBe(26);
    expect(CPC_CASES.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(CPC_COMPOSITION_PROPOSALS).toHaveLength(8);
    expect(CPC_COMPOSITION_PROPOSALS.every(c => c.enabled === false && c.reason.includes("every exact scored node"))).toBe(true);
    expect(packet.exportsSnapshot.questions).toEqual(CPC_QUESTIONS);
    expect(packet.exportsSnapshot.cases).toEqual(CPC_CASES);
    expect(packet.exportsSnapshot.concepts).toEqual(CPC_CONCEPTS);
  });

  it("retains the complete original inventory audit and visible before contexts", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as { inventory: InventoryRow[] };
    const assigned = program.inventory.filter(r => r.primaryTopicSlug === "colorectal-polyps-cancer");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(96);
    expect(packet.audit.map(r => r.recordId).sort()).toEqual(assigned.map(r => r.recordId).sort());
    expect(packet.assignment.concepts).toHaveLength(20);
    expect(packet.assignment.caseAssignments).toHaveLength(36);
    expect(packet.assignment.nodeAssignments).toHaveLength(50);
    expect(packet.assignment.variantAssignments).toHaveLength(96);
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      const before = packet.before.find(b => b.recordId === row.recordId)!;
      expect(row.contextAudits.map(c => c.contextSha256).sort()).toEqual(before.contexts.map(c => c.sha256).sort());
      for (const context of before.contexts) {
        const { sha256, origins: _origins, ...projection } = context;
        expect(sha(projection)).toBe(sha256);
      }
      for (const q of before.questionDefinitions) expect(sha(q.question)).toBe(q.sha256);
      if (row.verdict !== "Keep") {
        expect([...CPC_REVIEWED_V1_CATALOG.questions.map(q => q.id), ...packet.before.flatMap(b => b.questionDefinitions.map(q => q.question.id))]).toContain(row.replacementQuestionVariantId);
      }
      if (row.currentReplacementQuestionVariantId) expect(CPC_QUESTIONS.some(q => q.id === row.currentReplacementQuestionVariantId)).toBe(true);
    }
    expect(packet.before.flatMap(b => b.contexts)).toHaveLength(143);
    expect(packet.before.filter(b => b.contexts.length === 0)).toHaveLength(4);
    expect(packet.coverageHistory).toHaveLength(20);
    expect(new Set(packet.rankedConcepts.flatMap(r => r.inventoryRecordIds)).size).toBe(96);
  });

  it("preserves frozen earlier PASS references, original approvals and owner holds", () => {
    expect(packet.assignment.frozenIndependentPassReferences).toHaveLength(14);
    for (const receipt of packet.assignment.frozenIndependentPassReferences) {
      expect(sha(read(receipt.file))).toBe(receipt.fileSha256);
      for (const id of receipt.variantIds) expect(packet.audit.find(r => r.variantIds.includes(id))!.verdict).toBe("Keep");
    }
    expect(packet.assignment.historicalClinicalApprovals).toHaveLength(8);
    for (const approval of packet.assignment.historicalClinicalApprovals) {
      const q = packet.before.flatMap(b => b.questionDefinitions).find(q => q.question.id === approval.variantId)!;
      expect(q.sha256).toBe(approval.sha256);
      expect(q.question.contentVersion).toBe(approval.contentVersion);
      expect(packet.audit.find(r => r.variantIds.includes(approval.variantId))!.verdict).toBe("Keep");
    }
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.recordedHolds.map(h => h.id)).toEqual(expect.arrayContaining(["review.n3.rectal-response-assessment-timepoint.v2", "review.n4.small-polyp-residual-after-forceps.v1"]));
    expect(packet.ownerApprovalsNeeded.some(h => h.id === "review.n3.rectal-response-assessment-timepoint.v2")).toBe(true);
    expect(CPC_QUESTIONS.every(q => !q.id.includes("rectal-response-assessment-timepoint"))).toBe(true);
  });

  it("keeps clinical, author, independent and manager approval roles separate", () => {
    for (const record of [...CPC_QUESTIONS, ...CPC_CLAIMS, ...CPC_SOURCES, ...CPC_AUTHORING_CONCEPTS, ...CPC_CASE_REVIEWS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(CPC_MANIFEST).toMatchObject({ clinicalApproval: false, independentPass: false, managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false });
    expect(CPC_AUTHOR_CHECKS.every(c => c.reviewRole === "author_self_check_only" && !c.independentPass && !c.clinicalApproval)).toBe(true);
    for (const status of CPC_ITEM_STATUSES.filter(s => s.status === "revised")) expect(status.independentReviewCurrent).toBe("not_yet_reviewed");
    expect(CPC_AUTHORING_CONCEPTS.filter(c => c.conceptRelation === "new_version").map(c => c.previousConceptId).sort()).toEqual([
      "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v1",
      "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v1",
    ].sort());
  });

  it("uses clinic chart reviews with consistent finite patient profiles", () => {
    for (const c of CPC_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toMatch(new RegExp(c.prototypeDemographics!.ageYears + "-year-old " + (c.prototypeDemographics!.sexLabel === "Male" ? "man" : "woman")));
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.decisionNodes[0]!.resultGateAfter).toBeNull();
      expect(c.decisionNodes[0]!.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
    }
    const emergency = CPC_CASE_REVIEWS.find(c => c.historicalAcuity === "obvious_emergency")!;
    expect(emergency).toMatchObject({ acuity: "stable", educationalTier: 1, earliestFacilityStage: 1, requiredCapabilityIds: [] });
    const reconstruction = CPC_REVISION_ITEMS.find(c => c.nodes[0]!.slug === "perforation-overrides-systemic-first")!;
    expect(reconstruction.nodes[0]!.update).toContain("At the recorded decision point");
    expect(reconstruction.nodes[0]!.update).toContain("norepinephrine");
    expect(reconstruction.nodes[0]!.choices.every(c => !/stent|antibiotic course|staged reconstruction/i.test(c.label))).toBe(true);
  });

  it("maps every active clinical field and source to atomic evidence", () => {
    expect(ledger.sources).toEqual(CPC_SOURCES);
    expect(ledger.evidenceClaims).toEqual(CPC_CLAIMS);
    expect(CPC_SOURCES).toHaveLength(12);
    expect(CPC_CLAIMS).toHaveLength(48);
    expect(CPC_STATEMENT_MAPPINGS).toHaveLength(26);
    expect(ledger.reviewedV1Evidence.evidenceClaims).toEqual(CPC_REVIEWED_V1_CLAIMS);
    expect(ledger.reviewedV1Evidence.sourceRecords).toEqual(CPC_REVIEWED_V1_SOURCES);
    for (const q of CPC_QUESTIONS) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      const mapping = CPC_STATEMENT_MAPPINGS.find(m => m.questionVariantId === q.id)!;
      expect(mapping.evidenceClaimIds).toEqual(q.supportingEvidenceClaimIds);
      expect(mapping.fieldMappings.map(f => f.field)).toEqual(expect.arrayContaining(["presentation", "currentUpdate", "stem", "explanation"]));
    }
    for (const claim of CPC_CLAIMS) {
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation).toBeTruthy();
      for (const id of claim.sourceIds) expect(CPC_SOURCES.some(s => s.id === id && s.evidenceClaimIds.includes(claim.id))).toBe(true);
      expect(ledger.claimToQuestion.find(m => m.claimId === claim.id)!.questionVariantIds.sort()).toEqual(CPC_QUESTIONS.filter(q => q.supportingEvidenceClaimIds.includes(claim.id)).map(q => q.id).sort());
    }
    for (const s of CPC_SOURCES) {
      expect(s.completeCitation && s.organizationOrJournal && s.licenseLabel && s.reuseNotes && s.authorityAssessment && s.accessedOn).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(ledger.sourceToClaim.find(m => m.sourceId === s.id)!.claimIds).toEqual(s.evidenceClaimIds);
    }
    expect(ledger.historicalEvidence.unresolvedClaimIds).toEqual([]);
    expect(ledger.historicalEvidence.claims).toHaveLength(47);
  });

  it("retains randomized parallel choices and exact timing metadata for all testing choices", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(CPC_TIMING_ENTRIES).toHaveLength(26);
    expect(packet.exportsSnapshot.timing).toEqual(CPC_TIMING_ENTRIES);
    for (const c of CPC_CASES) {
      const n = c.decisionNodes[0]!;
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
      expect(n.answerChoices.length).toBeLessThanOrEqual(4);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      const q = CPC_QUESTIONS.find(q => q.id === n.questionVariantId)!;
      expect(n.answerChoices.map(a => [a.id, a.label, a.isCorrect])).toEqual(q.answerChoices.map(a => [a.id, a.label, a.isCorrect]));
      const timing = CPC_TIMING_ENTRIES.find(t => t.nodeId === n.id)!;
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(timing).success).toBe(true);
      expect(timing.questionVariantId).toBe(n.questionVariantId);
      const draft = CPC_ITEMS.flatMap(c => c.nodes).find(d => d.slug === q.id.split(".").at(-2))!;
      if (timing.classification.kind === "test_choices") {
        expect(timing.classification.choices.map(a => [a.choiceId, a.choiceLabel])).toEqual(n.answerChoices.map(a => [a.id, a.label]));
        for (const entry of timing.classification.choices) {
          const option = draft.choices.find(a => entry.choiceId === "choice.cpc." + draft.slug + "." + a.id + (q.id.endsWith(".v2") ? ".v2" : ".v1"))!;
          if (option.timingProfileId) {
            expect(entry.timing).toEqual({ kind: "test", timingProfileId: option.timingProfileId });
            expect(profiles.has(option.timingProfileId)).toBe(true);
          } else expect(entry.timing.kind).toBe("no_test");
        }
      } else expect(draft.choices.every(a => !a.timingProfileId)).toBe(true);
    }
    expect(CPC_ORDER_PROPOSALS).toHaveLength(41);
    expect(CPC_ORDER_PROPOSALS.every(o => o.disposition.kind === "not_executed" && o.disposition.reason === "future_planned" && o.serviceRequest === null && o.resultGateAfter === null)).toBe(true);
    expect(CPC_MANIFEST.reviewDisplay).toBe("key shown first for review only");
  });

  it("records concrete revised author gates with credible alternatives and counterfactuals", () => {
    expect(CPC_REVISION_ITEMS).toHaveLength(13);
    expect(CPC_AUTHOR_CHECKS).toHaveLength(26);
    expect(packet.exportsSnapshot.selfChecks).toEqual(CPC_AUTHOR_CHECKS);
    for (const c of CPC_REVISION_ITEMS) {
      const n = c.nodes[0]!;
      expect(n.gate.steps).toHaveLength(2);
      expect(n.gate.cueAttack.length).toBeGreaterThan(80);
      expect(n.gate.decidingObservation.length).toBeGreaterThan(40);
      expect(n.gate.counterfactual.length).toBeGreaterThan(70);
      expect(n.gate.deletionTest.length).toBeGreaterThan(70);
      expect(n.choices.some(a => a.id === n.gate.closestChoice && a.id !== n.correctChoice)).toBe(true);
      expect(n.choices.some(a => a.id === n.gate.counterfactualChoice && a.id !== n.correctChoice)).toBe(true);
      for (const a of n.choices) expect(a.temptation && a.rationale && a.reasonableWhen).toBeTruthy();
    }
    const pathology = CPC_REVISION_ITEMS.find(c => c.nodes[0]!.slug === "intact-low-risk-specimen")!.nodes[0]!.update;
    expect(pathology).toContain("Both lateral mucosal edges");
    expect(pathology).toContain("nonpedunculated");
    const serial = CPC_REVISION_ITEMS.find(c => c.nodes[0]!.slug === "advanced-baseline-normal-surveillance")!.nodes[0]!.update;
    expect(serial).toContain("three years later");
  });

  it("keeps external links safe and source restrictions explicit", () => {
    for (const link of CPC_SOURCE_LINKS) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    expect(CPC_SOURCES.every(s => !s.officialUrl?.includes("esge.com"))).toBe(true);
    expect(CPC_CLAIMS.every(c => c.sourceIds.every(id => !id.includes("esge")))).toBe(true);
    expect(ledger.excludedOrLimitedCandidates.some(c => c.source?.includes("ESGE") && c.decision?.includes("Excluded"))).toBe(true);
    for (const source of CPC_SOURCES.filter(s => s.reuseStatus === "cc_by_4_0")) {
      expect(source.reuseNotes).toContain("https://creativecommons.org/licenses/by/4.0/");
      expect(source.reuseNotes).toMatch(/Attribution:/);
    }
  });

  it("binds all active exact after cards without promoting a revised version", () => {
    expect(packet.proposedItems).toHaveLength(26);
    for (const proposal of packet.proposedItems) {
      const q = CPC_QUESTIONS.find(q => q.id === proposal.questionVariantId)!;
      expect(q).toBeTruthy();
      expect(proposal.reviewStatus).toBe("needs_clinician_review");
      expect(sha(proposal.after)).toBe(proposal.exactAfterSha256);
      expect(sha(q)).toBe(proposal.exactQuestionSha256);
      expect(["pass-preserved", "revised"]).toContain(proposal.status);
    }
  });
});
