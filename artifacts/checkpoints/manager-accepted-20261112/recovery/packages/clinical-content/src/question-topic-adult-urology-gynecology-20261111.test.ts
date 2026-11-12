import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import program from "../../../docs/research/question-topic-program-20261111.json";
import packet from "../../../docs/research/question-topic-adult-urology-gynecology-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-adult-urology-gynecology-20261111.json";
import { PROTOTYPE_BALANCE_RELEASE } from "../../balance-config/src/prototype-balance";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";
import {
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_CASES as cases,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_CASE_REVIEWS as caseReviews,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_CONCEPTS as concepts,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_QUESTIONS as questions,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_TIMING_PROPOSALS as timings,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_ORDER_PROPOSALS as orders,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_SOURCE_LINKS as links,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_AUTHOR_GATES as gates,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_STATEMENT_MAPPINGS as mappings,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_COMPOSITION_PROPOSALS as compositions,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_PASSED_CASES as passedCases,
  ADULT_UROLOGY_GYNECOLOGY_TOPIC_MANIFEST as manifest,
} from "./question-topic-adult-urology-gynecology-20261111";

const slug = "adult-urology-gynecology";
const repository = new URL("../../../", import.meta.url);
const sha = (input: string | Uint8Array) => createHash("sha256").update(input).digest("hex");
const followup = packet.independentReviewFollowup;
const original = followup.reviewInput;

describe("adult-urology-gynecology independent-review follow-up", () => {
  it("retains the complete assignment, original audit and exact historical inputs", () => {
    expect(packet.assignment.inventory).toEqual(program.inventory.filter(r => r.primaryTopicSlug === slug));
    expect(packet.assignment.concepts).toEqual(program.concepts.filter(r => r.primaryTopicSlug === slug));
    expect(packet.assignment.caseAssignments).toEqual(program.caseAssignments.filter(r => r.primaryTopicSlug === slug));
    expect(packet.assignment.nodeAssignments).toEqual(program.nodeAssignments.filter(r => r.primaryTopicSlug === slug));
    expect(packet.assignment.variantAssignments).toEqual(program.variantAssignments.filter(r => r.primaryTopicSlug === slug));
    expect(packet.audit.map(a => [a.inventoryRecordId, a.verdict])).toEqual(original.audit.map(a => [a.inventoryRecordId, a.verdict]));
    expect(packet.beforeSnapshots).toEqual(original.beforeSnapshots);
    expect(original.proposals).toHaveLength(35);
    for (const b of packet.beforeSnapshots) {
      expect(sha(JSON.stringify(b.question))).toBe(b.questionSha256);
      expect(sha(JSON.stringify(b.node))).toBe(b.nodeSha256);
      expect(sha(JSON.stringify(b.clinicalCase))).toBe(b.caseSha256);
    }
  });

  it("maps every exact review note and makes precisely one attempt per returned item", () => {
    expect(sha(readFileSync(new URL(followup.reviewPath, repository)))).toBe("e54d2a21893a2e182a31dca0a93486920a2b19d7d234f8e177b4410bc559fd01");
    expect(followup.responses).toHaveLength(35);
    expect(followup.counts).toMatchObject({ reviewed: 35, passPreserved: 5, revised: 22, parked: 8, revisionAttempts: 30, active: 27, multipartCases: 0 });
    for (const review of followup.reviews) {
      const response = followup.responses.find(r => r.reviewedQuestionVariantId === review.id)!;
      expect(response.originalVerdict).toBe(review.verdict);
      expect(response.revisionPasses).toBe(review.verdict === "PASS" ? 0 : 1);
      const expected = (["clarityIssues", "cues", "fairness", "suggestions"] as const).flatMap(category =>
        review[category].map((reviewNote, index) => ({ category, index, reviewNote })),
      );
      expect(response.notes.map(({ category, index, reviewNote }) => ({ category, index, reviewNote }))).toEqual(expected);
      expect(response.notes.every(n => n.response.length > 80)).toBe(true);
      expect(review.verdict === "PASS" ? response.status === "pass-preserved" : ["revised", "parked"].includes(response.status)).toBe(true);
    }
  });

  it("preserves the five exact PASS questions, visible nodes and patient profiles", () => {
    expect(followup.passPreservation).toHaveLength(5);
    expect(passedCases).toHaveLength(5);
    for (const frozen of followup.passPreservation) {
      const before = original.proposals.find(p => p.questionVariantId === frozen.questionVariantId)!;
      const current = packet.proposals.find(p => p.questionVariantId === frozen.questionVariantId)!;
      const q = questions.find(q => q.id === frozen.questionVariantId)!;
      expect(JSON.stringify(q)).toBe(JSON.stringify(before.after.question));
      expect(sha(JSON.stringify(q))).toBe(frozen.reviewedQuestionSha256);
      expect(current.after.questionSha256).toBe(frozen.reviewedQuestionSha256);
      expect(packet.nodes.find(n => n.questionVariantId === frozen.questionVariantId)).toEqual(original.nodes.find(n => n.questionVariantId === frozen.questionVariantId));
      const h = current.after.caseHeader, old = before.after.caseHeader;
      expect([h.patientDisplayName, h.prototypeDemographics, h.chiefComplaint, h.presentation, h.approvedInstantiationProfiles]).toEqual([old.patientDisplayName, old.prototypeDemographics, old.chiefComplaint, old.presentation, old.approvedInstantiationProfiles]);
      expect(current.after.node.currentUpdate).toBe(before.after.node.currentUpdate);
      expect(current.after.node.answerChoices).toEqual(before.after.node.answerChoices);
      expect(current.after.node.stem).toBe(before.after.node.stem);
      expect(current.after.node.explanation).toBe(before.after.node.explanation);
      expect(frozen.clinicalApproval).toBe(false);
    }
  });

  it("versions all returned attempts and excludes the eight parked definitions", () => {
    expect(packet.parked).toHaveLength(8);
    for (const response of followup.responses.filter(r => r.originalVerdict !== "PASS")) {
      const n = response.attemptedRevision.node;
      expect(n.questionVariantId).toBe(response.reviewedQuestionVariantId.replace(/\.v1$/, ".v2"));
      expect(n.contentVersion).toBe("question-topic-adult-urology-gynecology.2026-11-11.v2");
      expect(n.reviewStatus).toBe("needs_clinician_review");
      expect(n.lastClinicianReview).toBeNull();
      expect(n.manualAuthorGate.independentPass).toBe(false);
      if (response.status === "parked") {
        expect(response.parkReason!.length).toBeGreaterThan(100);
        expect(questions.some(q => q.id === n.questionVariantId || q.id === response.reviewedQuestionVariantId)).toBe(false);
        expect(cases.some(c => c.decisionNodes.some(d => d.id === n.id))).toBe(false);
      } else {
        expect(response.independentReviewState).toBe("not re-reviewed");
        expect(questions.some(q => q.id === n.questionVariantId)).toBe(true);
      }
    }
  });

  it("has no mixed multi-part case and covers each wrong final answer explicitly", () => {
    expect(cases).toHaveLength(27);
    expect(questions).toHaveLength(27);
    expect(followup.compositionChanges).toHaveLength(13);
    for (const [index, c] of cases.entries()) {
      expect(syntheticClinicalCaseSchema.parse(c)).toEqual(c);
      expect(c.decisionNodes).toHaveLength(1);
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.earliestFacilityStage).toBe(0);
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.presentation).toContain(c.patientDisplayName);
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(caseReviews[index]).toMatchObject({ patientAcuity: "stable_outpatient_at_review", reviewStatus: "needs_clinician_review", educationalTier: 1 });
      const n = c.decisionNodes[0]!;
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices).toHaveLength(3);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      expect(n.terminalDispositions).toHaveLength(2);
      for (const d of n.terminalDispositions) {
        if (d.kind !== "no_terminal_outcome") throw new Error("No clinical outcome is simulated by a chart review.");
        expect(d.clinicalRationale).toBe(n.answerChoices.find(a => a.id === d.answerChoiceId)!.rationale);
      }
    }
    expect(compositions.every(c => c.selection === "standalone")).toBe(true);
  });

  it("separates changed clinical meanings from the retained history", () => {
    expect(concepts).toHaveLength(15);
    expect(packet.identityChanges).toHaveLength(3);
    for (const c of concepts) expect(testedConceptSchema.parse(c)).toEqual(c);
    for (const change of packet.identityChanges) {
      expect(original.concepts.some(c => c.id === change.previousConceptId)).toBe(true);
      expect(concepts.some(c => c.id === change.currentConceptId)).toBe(true);
      expect(change.historyPolicy).toContain("do not transfer");
      expect(change.reviewStatus).toBe("needs_clinician_review");
    }
    for (const r of followup.responses.filter(r => r.status === "revised")) {
      const old = original.nodes.find(n => n.questionVariantId === r.reviewedQuestionVariantId)!;
      const n = r.attemptedRevision.node;
      if (!packet.identityChanges.some(c => c.currentConceptId === n.conceptId)) expect(n.conceptId).toBe(old.conceptId);
    }
    expect(new Set(questions.map(q => q.id)).size).toBe(27);
    expect(original.nodes).toHaveLength(35);
  });

  it("maps exact testing-choice identities and labels to existing timing profiles", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timings).toHaveLength(27);
    expect(orders).toHaveLength(38);
    for (const t of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(t)).toEqual(t);
      const n = packet.nodes.find(n => n.questionVariantId === t.questionVariantId)!;
      if (t.classification.kind === "test_choices") {
        expect(t.classification.choices).toHaveLength(n.choices.length);
        for (const e of t.classification.choices) {
          const a = n.choices.find(a => a.id === e.choiceId)!;
          expect(e.choiceLabel).toBe(a.label);
          if (a.timingProfileId) {
            expect(e.timing.kind).toBe("test");
            expect(profiles.has(a.timingProfileId)).toBe(true);
            const order = orders.find(o => o.questionVariantId === n.questionVariantId && o.choiceId === a.id)!;
            expect(order.choiceLabel).toBe(a.label);
            expect(order.timingProfileId).toBe(a.timingProfileId);
            expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
          } else expect(e.timing.kind).toBe("no_test");
        }
      } else expect(n.choices.every(a => a.timingProfileId === null)).toBe(true);
    }
    expect(packet.timingProposals).toEqual(timings);
    expect(packet.orderProposals).toEqual(orders);
  });

  it("maps active and parked attempts to claims and records new-source rights", () => {
    expect(ledger.sources).toHaveLength(13);
    expect(ledger.claims).toHaveLength(33);
    expect(ledger.statementMappings).toHaveLength(35);
    expect(mappings).toHaveLength(27);
    for (const response of followup.responses) {
      const n = response.attemptedRevision.node;
      const m = ledger.statementMappings.find(m => m.questionVariantId === n.questionVariantId)!;
      expect(m.evidenceClaimIds).toEqual(n.evidenceClaimIds);
      for (const id of n.evidenceClaimIds) {
        const atom = ledger.claims.find(c => c.id === id)!;
        expect(atom, id).toBeDefined();
        expect(atom.questionVariantIds).toContain(n.questionVariantId);
        expect(atom.reviewStatus).toBe("needs_clinician_review");
        expect(atom.limitation).toBeTruthy();
        for (const sid of atom.sourceIds) expect(ledger.sources.find(s => s.id === sid)!.evidenceClaimIds).toContain(id);
      }
      for (const a of n.choices) expect(m.choiceMappings.find(m => m.choiceId === a.id)!.evidenceClaimIds).toEqual(a.evidenceClaimIds);
    }
    expect(ledger.sources.find(s => s.id.endsWith("ureca-2024"))!.accessedOn).toBe("2026-09-17");
    expect(ledger.sources.find(s => s.id.endsWith("medlineplus-urine-collection"))!.reuseNotes).toContain("Source: MedlinePlus, National Library of Medicine");
    expect(ledger.independentReviewInput.sources).toHaveLength(12);
    for (const link of links) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });

  it("keeps author self-checks separate from independent PASS and clinical approval", () => {
    expect(gates).toHaveLength(27);
    for (const response of followup.responses.filter(r => r.status === "revised")) {
      const n = response.attemptedRevision.node;
      expect(n.reasoning.interpret.length).toBeGreaterThan(40);
      expect(n.reasoning.apply.length).toBeGreaterThan(40);
      expect(n.reasoning.counterfactual.length).toBeGreaterThan(80);
      expect(n.manualAuthorGate.coverTheKey.length).toBeGreaterThan(100);
      expect(n.manualAuthorGate.independentPass).toBe(false);
      expect(n.manualAuthorGate.clinicalApproval).toBe(false);
    }
    for (const q of questions) expect(q).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null });
    expect(manifest).toMatchObject({ pipelinePassed: false, clinicalApproval: false, publicReleaseAuthorized: false, liveManifestEdited: false });
    expect(manifest.reviewOrderLabel).toBe("key shown first for review only.");
  });

  it("normalizes every current proposal while retaining the reviewed before-version", () => {
    expect(packet.proposals).toHaveLength(27);
    for (const p of packet.proposals) {
      const q = questions.find(q => q.id === p.questionVariantId)!;
      expect(p.after.question).toEqual(q);
      expect(p.after.questionSha256).toBe(sha(JSON.stringify(q)));
      expect(original.proposals.some(old => old.questionVariantId === p.beforeReview.questionVariantId)).toBe(true);
      expect(p.after.node.questionVariantId).toBe(p.questionVariantId);
    }
  });

  it("retains both exact clinical/source holds and all remaining research boundaries", () => {
    expect(packet.assignment.recordedHolds).toEqual(original.assignment.recordedHolds);
    expect(packet.heldUnkeyed).toEqual(original.heldUnkeyed);
    for (const held of packet.heldUnkeyed.scoredHeldVersions) expect(questions.some(q => q.id === held)).toBe(false);
    expect(packet.remainingResearchGaps).toEqual(original.remainingResearchGaps);
    expect(packet.assignment.taxonomy.scopeOut).toContain("pediatric-neck-thoracic-gu");
    expect(packet.assignment.taxonomy.scopeOut).toContain("trauma-head-spine-extremities");
  });
});
