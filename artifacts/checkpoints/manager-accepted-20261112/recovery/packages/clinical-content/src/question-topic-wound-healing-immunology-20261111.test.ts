import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { syntheticClinicalReleaseSchema, answerChoiceTimingRegistryEntrySchema } from "./schema";
import { ROW_038_QUESTION_VARIANTS, ROW_038_CLINICAL_APPROVAL } from "./approved-data/vitamin-c-collagen-hydroxylation";
import * as topic from "./question-topic-wound-healing-immunology-20261111";
import packet from "../../../docs/research/question-topic-wound-healing-immunology-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-wound-healing-immunology-20261111.json";
import program from "../../../docs/research/question-topic-program-20261111.json";

const rootFile = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileDigest = (path: string) => createHash("sha256").update(readFileSync(rootFile(path))).digest("hex");
const proposals = topic.WOUND_HEALING_IMMUNOLOGY_PROPOSALS;
const questions = topic.WOUND_HEALING_IMMUNOLOGY_QUESTIONS;
const cases = topic.WOUND_HEALING_IMMUNOLOGY_CASES;

describe("wound-healing-immunology topic authoring sidecar", () => {
  it("reconciles all assigned exact variants and registry-only meanings without absorbing another lane", () => {
    const assigned = program.inventory.filter(r => r.primaryTopicSlug === "wound-healing-immunology");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map(r => r.recordId).sort()).toEqual(assigned.map(r => r.recordId).sort());
    expect(new Set(packet.audit.flatMap(r => r.variantIds)).size).toBe(48);
    expect(packet.assignment.concepts).toEqual(program.concepts.filter(r => r.primaryTopicSlug === "wound-healing-immunology"));
    expect(packet.assignment.caseAssignments).toEqual(program.caseAssignments.filter(r => r.primaryTopicSlug === "wound-healing-immunology"));
    expect(packet.assignment.nodeAssignments).toEqual(program.nodeAssignments.filter(r => r.primaryTopicSlug === "wound-healing-immunology"));
    expect(packet.assignment.variantAssignments).toEqual(program.variantAssignments.filter(r => r.primaryTopicSlug === "wound-healing-immunology"));
    expect(packet.assignment.unkeyedDraftSlots).toHaveLength(0);
    expect(packet.assignment.withheldTeachingPoints).toHaveLength(0);
  });

  it("assigns one verdict per row with explicit supported successor links", () => {
    const ids = new Set([...questions.map(q => q.id), ...topic.WOUND_HEALING_IMMUNOLOGY_PARKED.map(p => p.candidateQuestionVariantId)]);
    expect(packet.summary).toMatchObject({ audited: 48, kept: 9, rewritten: 7, retireAndReplaceProposals: 32,
      newQuestions: 12, newQuestionVersions: 4, totalDraftQuestions: 16,
      reviewPassPreserved: 5, reviewRevised: 11, reviewParked: 13 });
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons).toHaveLength(3);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.contextAudit.length).toBeGreaterThan(0);
      if (row.verdict !== "Keep") {
        expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
        row.replacementQuestionVariantIds.forEach(id => expect(ids.has(id)).toBe(true));
        const successorIds = new Set<string>(row.replacementQuestionVariantIds);
        const stableSuccessor = proposals.some(p => successorIds.has(p.questionVariantId) && p.conceptId === row.conceptId);
        if (stableSuccessor) expect(row.identityDecision.toLowerCase()).toContain("stable");
      }
    }
  });

  it("preserves exact clinical approvals and distinguishes an owner editorial exception from independent PASS", () => {
    const reference = packet.assignment.clinicalApprovalReferences[0]!;
    expect(reference.id).toBe(ROW_038_CLINICAL_APPROVAL.id);
    expect(fileDigest(reference.recordFile)).toBe(reference.recordFileSha256);
    for (const q of ROW_038_QUESTION_VARIANTS) {
      const binding = reference.questionBindings.find(b => b.variantId === q.id)!;
      expect(digest(q), q.id).toBe(binding.questionSha256);
      expect(packet.audit.find(r => r.variantIds.includes(q.id))!.verdict).toBe("Keep");
      expect(questions.some(n => n.id === q.id)).toBe(false);
    }
    expect(packet.assignment.frozenIndependentPassReferences).toEqual([]);
    expect(packet.assignment.frozenOwnerEditorialReferences[0]!.independentPass).toBe(false);
    expect(packet.audit.find(r => r.variantIds.includes("question.wound.secondary-intention-healing.v1.r2"))!.verdict).toBe("Keep");
    for (const reference of packet.assignment.historicalReviewReferences) expect(fileDigest(reference.file)).toBe(reference.sha256);
  });

  it("preserves every newly supplied independent PASS question, full node and visible clinic frame exactly", () => {
    const receipt = packet.independentReviewRevision;
    expect(fileDigest(receipt.reviewFile)).toBe(receipt.reviewFileSha256);
    expect(JSON.parse(readFileSync(rootFile(receipt.reviewFile), "utf8"))).toEqual(receipt.reviewRows);
    expect(receipt.passPreservationBindings).toHaveLength(5);
    const frame = (value: unknown) => {
      const record = value as Record<string, unknown>;
      return Object.fromEntries(["displayName", "patientDisplayName", "patientPresentationVariantId",
        "prototypeDemographics", "chiefComplaint", "presentation", "approvedInstantiationProfiles",
        "requiredClinicalSetting", "requiredCapabilityIds", "sourceLabels"].map(key => [key, record[key]]));
    };
    for (const binding of receipt.passPreservationBindings) {
      const before = receipt.reviewedProposals.find(p => p.questionVariantId === binding.questionVariantId)!;
      const q = questions.find(q => q.id === binding.questionVariantId)!;
      const cs = cases.find(c => c.id === binding.caseId)!;
      const node = cs.decisionNodes.find(n => n.id === binding.nodeId)!;
      expect(q).toEqual(before.question);
      expect(node).toEqual(before.node);
      expect(digest(q)).toBe(binding.questionSha256);
      expect(digest(node)).toBe(binding.nodeSha256);
      expect(frame(cs)).toEqual(frame(before.case));
      expect(digest(frame(cs))).toBe(binding.visibleFrameSha256);
      const slug = before.slug;
      expect(topic.WOUND_HEALING_IMMUNOLOGY_SPECS.find(s => s.slug === slug))
        .toEqual(topic.WOUND_HEALING_IMMUNOLOGY_REVIEWED_SPECS.find(s => s.slug === slug));
    }
    expect(fileDigest(packet.authoringBindings.moduleFile)).toBe(packet.authoringBindings.moduleSha256);
    expect(fileDigest(packet.authoringBindings.sourceLedgerFile)).toBe(packet.authoringBindings.sourceLedgerSha256);
  });

  it("records one repair per flagged item, withholds parked keys and keeps every active case self-contained", () => {
    const receipt = packet.independentReviewRevision;
    expect(receipt.items).toHaveLength(29);
    expect(receipt.items.filter(i => i.status === "pass-preserved")).toHaveLength(5);
    expect(receipt.items.filter(i => i.status === "revised")).toHaveLength(11);
    expect(receipt.items.filter(i => i.status === "parked")).toHaveLength(13);
    expect(receipt.attempts).toHaveLength(24);
    for (const attempt of receipt.attempts) {
      expect(attempt.attemptNumber).toBe(1);
      expect(attempt.candidateQuestionVariantId).toMatch(/\.v2$/);
      const active = proposals.find(p => p.questionVariantId === attempt.candidateQuestionVariantId);
      if (attempt.status === "parked") {
        expect(active).toBeUndefined();
        expect(attempt.candidate.choices.every(c => !c.isCorrect)).toBe(true);
        expect(attempt.dispositionReason.length).toBeGreaterThan(80);
      } else {
        expect(active).toBeDefined();
        expect(active!.conceptId).toBe(attempt.candidate.conceptId);
        expect(active!.beforeVariantIds).toContain(attempt.reviewedQuestionVariantId);
      }
    }
    expect(receipt.caseComposition).toHaveLength(6);
    expect(cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    for (const proposal of packet.proposals) expect(proposal.priorVisibleFeedback).toEqual([]);
    expect(topic.WOUND_HEALING_IMMUNOLOGY_MANIFEST).toMatchObject({ passPreservedCount: 5,
      revisedPendingCount: 11, parkedCount: 13, pipelinePassed: false, clinicalApproval: false });
  });

  it("binds every retained exact context including raw serialization-order variants", () => {
    expect(packet.before.reduce((n, b) => n + b.contexts.length, 0)).toBe(56);
    for (const before of packet.before) {
      for (const q of before.questions) expect(digest(q.question)).toBe(q.sha256);
      for (const context of before.contexts) {
        expect(digest(context.case)).toBe(context.caseSha256);
        expect(digest(context.node)).toBe(context.nodeSha256);
      }
      const audit = packet.audit.find(r => r.recordId === before.recordId)!;
      expect(audit.contextAudit).toHaveLength(before.contexts.length);
    }
    expect(packet.baseline.retainedSerializationCheck).toHaveLength(4);
    for (const row of packet.baseline.retainedSerializationCheck) expect(row.missingSnapshotDigests).toEqual([]);
    for (const asset of ["question-new-n2-r2-coverage.png", "question-new-n2-r2-vessels.png"])
      expect(existsSync(rootFile(`apps/player/public/clinical-exhibits/${asset}`))).toBe(true);
  });

  it("validates the preview through its explicit sidecar import and preserves question/node exact parity", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.WOUND_HEALING_IMMUNOLOGY_PREVIEW_RELEASE).success).toBe(true);
    expect(cases).toHaveLength(16);
    expect(cases.filter(c => c.decisionNodes.length > 1)).toHaveLength(0);
    expect(questions).toHaveLength(16);
    expect(new Set(questions.map(q => q.id)).size).toBe(16);
    expect(cases.flatMap(c => c.decisionNodes)).toHaveLength(16);
    for (const p of packet.proposals) {
      const q = questions.find(q => q.id === p.questionVariantId)!;
      const cs = cases.find(c => c.id === p.caseId)!;
      const node = cs.decisionNodes.find(n => n.id === p.nodeId)!;
      expect(q).toEqual(p.question);
      expect(digest(q)).toBe(p.questionSha256);
      expect(digest(node)).toBe(p.nodeSha256);
      expect(digest(cs)).toBe(p.caseSha256);
      expect(node.stem).toBe(q.stem);
      expect(node.explanation).toBe(q.explanation);
      expect(node.answerChoices.map(c => [c.id, c.label, c.isCorrect, c.rationale]))
        .toEqual(q.answerChoices.map(c => [c.id, c.label, c.isCorrect, c.rationale]));
      expect(node.resultGateAfter).toBeNull();
    }
  });

  it("uses named finite clinic frames and keeps outside acute care historical", () => {
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.presentation).toContain(c.prototypeDemographics!.sexLabel === "Female" ? "woman" : "man");
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(new Set(c.decisionNodes.map(n => n.primaryConceptId)).size).toBe(c.decisionNodes.length);
      for (const n of c.decisionNodes) {
        expect(n.stem).toContain("{patientName}");
        expect(n.shuffleAnswers).toBe(true);
        expect([3, 4]).toContain(n.answerChoices.length);
        expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      }
    }
    expect(topic.WOUND_HEALING_IMMUNOLOGY_CASE_REVIEWS.every(c => c.patientAcuity === "stable" && c.educationalTier === 2 && c.facilityProgressionLevel === 3)).toBe(true);
  });

  it("separates new meanings from stable identities and does not manufacture history migration", () => {
    const concepts = topic.WOUND_HEALING_IMMUNOLOGY_CONCEPT_PROPOSALS;
    expect(concepts.filter(c => c.conceptRelation === "new_meaning")).toHaveLength(9);
    expect(concepts.filter(c => c.conceptRelation === "reuse")).toHaveLength(4);
    for (const c of concepts.filter(c => c.conceptRelation === "new_meaning")) {
      expect(c.id).not.toBe(c.previousConceptId);
      expect(c.historyPolicy).toContain("without history migration");
    }
    const tetanus = proposals.filter(p => p.conceptId === "concept.prototype.laceration.tetanus");
    expect(tetanus).toHaveLength(4);
    expect(new Set(tetanus.map(p => p.caseId)).size).toBe(4);
  });

  it("does not promote self-checks, sources or new clinical records into clinical or editorial approval", () => {
    for (const record of [...questions, ...topic.WOUND_HEALING_IMMUNOLOGY_CONCEPT_PROPOSALS,
      ...topic.WOUND_HEALING_IMMUNOLOGY_CLAIMS, ...topic.WOUND_HEALING_IMMUNOLOGY_SOURCES,
      ...topic.WOUND_HEALING_IMMUNOLOGY_CASE_REVIEWS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(topic.WOUND_HEALING_IMMUNOLOGY_MANIFEST).toMatchObject({ pipelinePassed: false,
      managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false });
  });

  it("maps supported statements, distractors and counterfactuals to recorded atomic evidence", () => {
    const claims = new Map(ledger.claims.map(c => [c.id, c]));
    const sources = new Set(ledger.sources.map(s => s.id));
    for (const c of ledger.claims) {
      expect(c.sourceIds.length).toBeGreaterThan(0);
      c.sourceIds.forEach(id => expect(sources.has(id)).toBe(true));
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation.length).toBeGreaterThan(0);
    }
    for (const p of proposals) {
      for (const id of p.evidenceClaimIds) expect(claims.has(id), id).toBe(true);
      for (const c of p.choices) {
        expect(c.temptation.length).toBeGreaterThan(20);
        expect(c.counterfactual.length).toBeGreaterThan(20);
        c.evidenceClaimIds.forEach(id => expect(claims.has(id), id).toBe(true));
      }
      const mapping = topic.WOUND_HEALING_IMMUNOLOGY_STATEMENT_MAPPINGS.find(m => m.questionVariantId === p.questionVariantId)!;
      for (const assertion of mapping.assertions) assertion.claimIds.forEach(id => expect(claims.has(id)).toBe(true));
    }
    for (const row of ledger.sourceToClaimMappings)
      expect(row.evidenceClaimIds.sort()).toEqual(ledger.claims.filter(c => c.sourceIds.includes(row.sourceId)).map(c => c.id).sort());
    for (const row of ledger.claimToQuestionMappings)
      expect(row.questionVariantIds.sort()).toEqual(proposals.filter(p => p.evidenceClaimIds.includes(row.claimId) || p.choices.some(c => c.evidenceClaimIds.includes(row.claimId))).map(p => p.questionVariantId).sort());
  });

  it("provides exact wait and nonexecution metadata for every offered testing choice", () => {
    const timing = topic.WOUND_HEALING_IMMUNOLOGY_TIMING_PROPOSALS;
    expect(timing).toHaveLength(16);
    const orders = topic.WOUND_HEALING_IMMUNOLOGY_ORDER_PROPOSALS;
    expect(orders).toHaveLength(14);
    for (const p of proposals) {
      const entry = timing.find(t => t.questionVariantId === p.questionVariantId)!;
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const tests = p.choices.filter(c => c.timingProfileId);
      if (tests.length === 0) expect(entry.classification.kind).toBe("no_test");
      else {
        expect(entry.classification.kind).toBe("test_choices");
        if (entry.classification.kind !== "test_choices") throw new Error("Missing exact timing choices");
        expect(entry.classification.choices).toHaveLength(p.choices.length);
        for (const c of p.choices) {
          const t = entry.classification.choices.find(t => t.choiceId === c.id)!;
          expect(t.choiceLabel).toBe(c.label);
          if (c.timingProfileId) {
            expect(t.timing).toEqual({ kind: "test", timingProfileId: c.timingProfileId });
            expect(getDiagnosticTimingProfileMapping(c.timingProfileId)).not.toBeNull();
            const o = orders.find(o => o.questionVariantId === p.questionVariantId && o.choiceId === c.id)!;
            expect(o.choiceLabel).toBe(c.label);
            expect(o.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
            expect(o.serviceRequest).toBeNull();
          }
        }
      }
      expect(p.task).not.toMatch(/\b\d+\s*(?:minutes?|hours?)\b/i);
    }
  });

  it("keeps concrete manual author checks and prevents known prior-feedback answer leakage", () => {
    for (const p of proposals) {
      expect(p.manualAuthorGate.reasoningSteps).toHaveLength(2);
      expect(p.manualAuthorGate.coverTheKey.length).toBeGreaterThan(80);
      expect(p.manualAuthorGate.decidingObservation.length).toBeGreaterThan(35);
      expect(p.manualAuthorGate.counterfactual.length).toBeGreaterThan(50);
      expect(p.manualAuthorGate.deletionTest.length).toBeGreaterThan(50);
      expect(p.manualAuthorGate.repairAndRecheck.length).toBeGreaterThan(60);
    }
    for (const slug of ["graft-shear", "preclosure-function", "partial-tendon-referral", "glove-new-immediate-event"]) {
      const p = proposals.find(p => p.slug === slug)!;
      expect(cases.find(c => c.id === p.caseId)!.decisionNodes).toHaveLength(1);
    }
    expect(proposals.some(p => p.slug === "glove-material-selection")).toBe(false);
    expect(topic.WOUND_HEALING_IMMUNOLOGY_PARKED.some(p => p.slug === "full-thickness-donor")).toBe(true);
    const newEvent = proposals.find(p => p.slug === "glove-new-immediate-event")!;
    expect(JSON.stringify(newEvent.exhibit)).toContain("specific IgE was not detected");
    expect(JSON.stringify(newEvent.exhibit)).toContain("09:03");
    expect(JSON.stringify(newEvent.exhibit)).toContain("09:08");
  });

  it("retains source limits, disagreements and safe external links without silently unholding legacy drafts", () => {
    expect(packet.assignment.recordedHolds).toHaveLength(4);
    expect(ledger.disagreements.some(d => d.id === "hold.wound-healing-immunology.cdc-clean-complete-interval")).toBe(true);
    expect(ledger.excludedOrLimitedSources.some(s => s.reason.includes("403"))).toBe(true);
    for (const link of topic.WOUND_HEALING_IMMUNOLOGY_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    const manifest = readFileSync(rootFile("packages/clinical-content/src/question-ship-manifest.ts"), "utf8");
    expect(manifest).toContain(JSON.stringify(QUESTION_SHIP_MANIFEST.id));
    for (const question of questions) topicQuestionAcceptance(question.id);
  });
});
