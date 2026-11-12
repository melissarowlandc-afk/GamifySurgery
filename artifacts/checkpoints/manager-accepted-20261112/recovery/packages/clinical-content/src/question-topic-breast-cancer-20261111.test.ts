import {retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  BREAST_CANCER_TOPIC_AUTHOR_CHECKS as checks, BREAST_CANCER_TOPIC_AUTHORING_CONCEPTS as concepts,
  BREAST_CANCER_TOPIC_CASE_REVIEWS as caseReviews, BREAST_CANCER_TOPIC_CASES as cases,
  BREAST_CANCER_TOPIC_CLAIMS as claims, BREAST_CANCER_TOPIC_DEFINITIONS as definitions,
  BREAST_CANCER_TOPIC_MANIFEST as manifest, BREAST_CANCER_TOPIC_ORDER_PROPOSALS as orders,
  BREAST_CANCER_TOPIC_PREVIEW_RELEASE as preview, BREAST_CANCER_TOPIC_QUESTIONS as questions,
  BREAST_CANCER_TOPIC_SOURCE_LINKS as links, BREAST_CANCER_TOPIC_SOURCES as sources,
  BREAST_CANCER_TOPIC_STATEMENT_MAPPINGS as mappings, BREAST_CANCER_TOPIC_TIMING_ENTRIES as timings,
  BREAST_CANCER_TOPIC_REVIEW_DISPOSITIONS as dispositions, BREAST_CANCER_TOPIC_PARKS as parks,
  BREAST_CANCER_TOPIC_ROUND1_QUESTIONS as reviewedQuestions, BREAST_CANCER_TOPIC_ROUND1_CASES as reviewedCases,
} from "./question-topic-breast-cancer-20261111";

const root = new URL("../../../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const hash = (v: unknown) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");
const packet = JSON.parse(read("docs/research/question-topic-breast-cancer-20261111.json"));
const ledger = JSON.parse(read("docs/research/sources-question-topic-breast-cancer-20261111.json"));
const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
const nodes = cases.flatMap(c => c.decisionNodes);
const specs = definitions.flatMap(c => c.nodes);

describe("breast-cancer topic explicit-import authoring sidecar", () => {
  it("validates all clinic cases with existing runtime schema and no executed outside orders", () => {
    expect(validateSyntheticClinicalRelease(preview).cases).toHaveLength(12);
    expect(nodes).toHaveLength(13);
    expect(cases.every(c => c.requiredClinicalSetting === "clinic")).toBe(true);
    expect(nodes.every(n => n.resultGateAfter === null && n.answerChoices.every(a => a.serviceRequest === null))).toBe(true);
    expect(orders.every(o => o.executionScope === "clinic_review_of_outside_care")).toBe(true);
  });

  it("preserves independent review, manager acceptance and clinical approval as distinct states", () => {
    expect(manifest).toMatchObject({ pipelinePassed: false, managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false, executableOrdersAdded: false });
    for (const x of [...questions, ...claims, ...sources, ...concepts, ...checks, ...caseReviews]) {
      expect(x.reviewStatus).toBe("needs_clinician_review");
      expect(x.lastClinicianReview).toBeNull();
    }
    expect(checks.every(c => !c.pipelinePassed && c.reviewerRole === "author_self_check")).toBe(true);
    expect(packet.clinicalApproval).toBe(false);
  });

  it("reconciles all primary-topic assignment rows, concepts and holds without omitting history", () => {
    const assigned = program.inventory.filter((r: any) => r.primaryTopicSlug === "breast-cancer");
    expect(packet.assignment.inventory).toEqual(assigned);
    for (const key of ["concepts", "caseAssignments", "nodeAssignments", "variantAssignments", "unkeyedDraftSlots", "withheldTeachingPoints"]) {
      expect(packet.assignment[key]).toEqual(program[key].filter((r: any) => r.primaryTopicSlug === "breast-cancer"));
    }
    expect(packet.audit.map((r: any) => r.recordId).sort()).toEqual(assigned.map((r: any) => r.recordId).sort());
    expect(new Set(packet.audit.map((r: any) => r.recordId)).size).toBe(50);
    expect(packet.assignment.concepts).toHaveLength(13);
    expect(packet.assignment.recordedHolds.map((h: any) => h.id)).toEqual(["review.n4.dcis-gland-removal-and-sentinel-sequence.v1"]);
    expect(packet.round1Snapshot.counts).toMatchObject({ audited: 50, kept: 7, rewritten: 7, retiredAndReplacedProposed: 36, new: 11, replacementDrafts: 2, authoredNodes: 20, reusedConcepts: 8, newMeanings: 10 });
    expect(packet.reviewResponse.counts).toMatchObject({ reviewed: 20, passPreserved: 7, revised: 6, parked: 7, activeNodes: 13, activeCases: 12 });
  });

  it("gives each exact old row a single verdict, supported replacement and hashed before context", () => {
    const available = new Set([...nodes.map(n => n.questionVariantId), ...packet.assignment.inventory.filter((r: any) => r.live).flatMap((r: any) => r.variantIds)]);
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.length).toBeGreaterThan(100);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.beforeContexts.length).toBeGreaterThan(0);
      expect(row.capturedDistinctNodeSerializations).toBeGreaterThanOrEqual(row.planningDistinctNodeSerializations);
      for (const context of row.beforeContexts) {
        expect(hash(context.projection.node)).toBe(context.nodeSha256);
        expect(hash(context.projection)).toBe(context.projectionSha256);
        expect(context.projection.node.questionVariantId).toBe(row.variantIds[0]);
      }
      if (row.verdict !== "Keep") {
        if (row.replacementReviewStatus === "parked") {
          expect(row.replacementQuestionVariantId).toBeNull();
          expect(row.retirementIntegrationHold).toContain("do not withdraw");
        } else expect(available.has(row.replacementQuestionVariantId)).toBe(true);
      }
    }
    expect(packet.audit.filter((r: any) => r.planningDistinctNodeSerializations === 2)).toHaveLength(2);
  });

  it("retains exact frozen live case fields and original review references", () => {
    const refs = packet.assignment.frozenAndAcceptedReferences;
    expect(refs.filter((r: any) => r.originalReview.verdict === "PASS")).toHaveLength(6);
    expect(refs.find((r: any) => r.id === "F10").originalReview.verdict).toBe("REVISE");
    for (const ref of refs) expect(hash(read(ref.originalDecisionFile))).toBe(ref.originalDecisionFileSha256);
    for (const c of packet.frozenLiveCases) {
      expect(hash(retainedTopicCase(c.caseId))).toBe(c.sha256);
      expect(hash(c.case)).toBe(c.sha256);
    }
    expect(packet.currentSnapshot.assignedCaseDrift).toEqual([]);
  });

  it("keeps question, node, case and concept identities unique and every reference resolvable", () => {
    for (const ids of [questions.map(q => q.id), nodes.map(n => n.id), cases.map(c => c.id), concepts.map(c => c.id)]) {
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every(id => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(id) && id.length <= 120)).toBe(true);
    }
    expect(concepts).toHaveLength(13);
    expect(nodes.every(n => questions.some(q => q.id === n.questionVariantId && q.conceptId === n.primaryConceptId))).toBe(true);
    expect(concepts.filter(c => c.previousConceptId)).toHaveLength(2);
    expect(concepts.filter(c => c.previousConceptId).map(c => c.id).sort()).toEqual(["concept.topic.breast-cancer.current-recurrence-biomarker-evidence.v2", "concept.topic.breast-cancer.upfront-limited-sentinel-burden.v2"]);
  });

  it("preserves fixed patient demographics, short complaints, complete tasks and shuffled options", () => {
    for (const c of cases) {
      expect(c.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old woman`);
      expect(c.prototypeDemographics!.sexLabel).toBe("Female");
      expect(c.patientDisplayName).not.toBe("Clinic Patient");
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.stem).toContain("{patientName}");
        expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(n.answerChoices.length).toBeLessThanOrEqual(4);
        expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.every(a => Boolean(a.rationale))).toBe(true);
      }
    }
  });

  it("maps every testing choice including distractors to exact labels and existing placeholder profiles", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timings).toHaveLength(nodes.length);
    for (const entry of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(entry)).toEqual(entry);
      const n = nodes.find(n => n.id === entry.nodeId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(a => [a.choiceId, a.choiceLabel])).toEqual(n.answerChoices.map(a => [a.id, a.label]));
        for (const a of entry.classification.choices) if (a.timing.kind === "test") expect(profiles.has(a.timing.timingProfileId)).toBe(true);
      }
    }
    const marker = timings.find(t => t.questionVariantId.includes("marker-target-reconciliation"))!;
    expect(marker.classification.kind).toBe("test_choices");
    for (const spec of specs) {
      const entry = timings.find(t => t.questionVariantId.startsWith(`question.topic.breast-cancer.${spec.slug}.`))!;
      expect(entry.classification.kind === "test_choices").toBe(spec.choices.some(a => a.timing.kind === "test"));
    }
    expect(JSON.stringify(cases)).not.toMatch(/\b(?:wait|returns? in)\s+\d+\s*(?:minutes?|hours?|days?)\b/i);
  });

  it("maps source-to-claim and claim-to-question provenance in both directions", () => {
    expect(ledger.sources).toEqual(sources);
    expect(ledger.claims).toEqual(claims);
    for (const c of claims) {
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation!.length).toBeGreaterThan(20);
      for (const id of c.sourceIds) expect(sources.find(s => s.id === id)!.evidenceClaimIds).toContain(c.id);
      expect(ledger.claimToQuestions.find((x: any) => x.claimId === c.id).questionVariantIds).toEqual(questions.filter(q => q.supportingEvidenceClaimIds.includes(c.id)).map(q => q.id));
    }
    for (const q of questions) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(q.supportingEvidenceClaimIds.every(id => claims.some(c => c.id === id))).toBe(true);
    }
    for (const s of sources) for (const id of s.evidenceClaimIds) expect(claims.find(c => c.id === id)!.sourceIds).toContain(s.id);
  });

  it("records full bibliographic/rights data and safe source links without source text", () => {
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(70);
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.accessedOn).toBe("2026-11-11");
      expect(s.reuseNotes.length).toBeGreaterThan(100);
      expect(s.authorityAssessment.length).toBeGreaterThan(100);
      expect(links.find(x => x.sourceId === s.id)).toMatchObject({ href: s.officialUrl, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    }
    expect(ledger.sourceTextStored).toBe(false);
  });

  it("records actual author attacks and decision-changing counterfactuals for every exact draft", () => {
    expect(checks).toHaveLength(nodes.length);
    expect(mappings).toHaveLength(nodes.length);
    for (const check of checks) {
      expect(check.steps).toHaveLength(2);
      for (const key of ["closestError", "decidingObservation", "consequence", "counterfactual", "deletionTest", "cueAttack", "stageAndCategory", "difficulty", "sequenceCheck", "repairRecord"] as const) expect(check[key].length).toBeGreaterThan(40);
      expect(check.distractorChecks).toHaveLength(2);
      expect(check.distractorChecks.every(d => d.temptation.length > 25 && d.rankingRationale.length > 50 && d.counterfactual.length > 40)).toBe(true);
    }
    expect(packet.beforeAfter.filter((r: any) => r.status === "revised").every((r: any) => r.before.length === 1 && r.before[0].questionVariantId.endsWith(".v1"))).toBe(true);
  });

  it("preserves later clinical updates and reports paired-only selector constraints", () => {
    const paired = cases.filter(c => c.decisionNodes.length > 1);
    expect(paired).toHaveLength(1);
    for (const c of paired) {
      expect(c.decisionNodes.slice(1).every(n => Boolean(n.currentUpdate))).toBe(true);
      expect(caseReviews.find(r => r.caseId === c.id)!.selectionConstraint).toContain("all-concepts");
      expect(c.decisionNodes.every(n => dispositions.find(d => d.activeQuestionVariantId === n.questionVariantId)!.status === "pass-preserved")).toBe(true);
    }
    const gate = checks.find(c => c.questionVariantId.includes("invasive-with-dcis-margin"))!;
    expect(gate.closestError).toContain("2 mm");
    expect(gate.sequenceCheck).toContain("outside-care chart event");
  });

  it("preserves every exact independent PASS question, target node and patient fields", () => {
    const review = JSON.parse(read("docs/research/question-topic-breast-cancer-review-20261111.json"));
    expect(hash(read("docs/research/question-topic-breast-cancer-review-20261111.json"))).toBe(packet.reviewResponse.reviewFileSha256);
    const passed = review.filter((r: any) => r.verdict === "PASS");
    expect(passed).toHaveLength(7);
    for (const r of passed) {
      const before = packet.round1Snapshot.beforeAfter.find((x: any) => x.questionVariantId === r.id);
      const q = questions.find(q => q.id === r.id)!;
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === r.id))!;
      expect(hash(q)).toBe(before.afterQuestionSha256);
      expect(hash(c.decisionNodes.find(n => n.questionVariantId === r.id))).toBe(before.afterNodeSha256);
      for (const k of ["presentation", "chiefComplaint", "patientDisplayName", "prototypeDemographics", "approvedInstantiationProfiles", "patientPresentationRevision"] as const) expect(c[k]).toEqual(before.after.case[k]);
    }
    const dcis = cases.find(c => c.id === "case.topic.breast-cancer.dcis-final-boundary.v1")!;
    expect(hash(dcis)).toBe(packet.round1Snapshot.beforeAfter.find((x: any) => x.questionVariantId.includes("dcis-positive-shave")).afterCaseSha256);
    expect(caseReviews.filter(c => c.splitFromMixedCase)).toHaveLength(3);
  });

  it("reconciles one response per reviewed item and excludes every park from active supply", () => {
    const review = packet.reviewResponse.independentReview;
    expect(dispositions).toHaveLength(20);
    expect(dispositions.map(d => d.reviewedQuestionVariantId).sort()).toEqual(review.map((r: any) => r.id).sort());
    expect(dispositions.filter(d => d.status === "pass-preserved")).toHaveLength(7);
    expect(dispositions.filter(d => d.status === "revised")).toHaveLength(6);
    expect(parks).toHaveLength(7);
    for (const d of dispositions) {
      expect(d.revisionAttempts).toBe(d.status === "pass-preserved" ? 0 : 1);
      expect(d.independentPassForRevision).toBe(false);
      if (d.status === "parked") {
        expect(d.activeQuestionVariantId).toBeNull();
        const park = parks.find(p => p.reviewedQuestionVariantId === d.reviewedQuestionVariantId)!;
        expect(park.scoredKey).toBeNull();
        expect(park.attempt.length).toBeGreaterThan(60);
        expect(park.reason.length).toBeGreaterThan(100);
      } else expect(questions.some(q => q.id === d.activeQuestionVariantId)).toBe(true);
      const response = packet.reviewResponse.items.find((x: any) => x.reviewedQuestionVariantId === d.reviewedQuestionVariantId);
      const original = review.find((x: any) => x.id === d.reviewedQuestionVariantId);
      expect(response.issueResponses).toHaveLength(original.clarityIssues.length + original.cues.length + original.fairness.length + original.suggestions.length);
    }
    // Historical definitions are retained, not silently edited to construct v2.
    for (const row of packet.round1Snapshot.beforeAfter) {
      expect(hash(reviewedQuestions.find(q => q.id === row.questionVariantId))).toBe(row.afterQuestionSha256);
      const c = reviewedCases.find(c => c.id === row.after.case.id)!;
      expect(hash(c)).toBe(row.afterCaseSha256);
    }
  });
});
