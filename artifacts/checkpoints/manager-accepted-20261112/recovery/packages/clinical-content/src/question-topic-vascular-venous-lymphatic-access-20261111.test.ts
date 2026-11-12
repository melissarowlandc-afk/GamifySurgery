import {retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import packet from "../../../docs/research/question-topic-vascular-venous-lymphatic-access-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-vascular-venous-lymphatic-access-20261111.json";
import { DIAGNOSTIC_PROFILE_TIMING_MAPPINGS } from "../../balance-config/src/diagnostic-timing";
import { syntheticClinicalCaseSchema, testedConceptSchema, answerChoiceTimingRegistryEntrySchema } from "./schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  VENOUS_TOPIC_AUTHOR_GATES, VENOUS_TOPIC_AUTHORING_CONCEPTS, VENOUS_TOPIC_CASE_REVIEWS,
  VENOUS_TOPIC_CASES, VENOUS_TOPIC_CLAIMS, VENOUS_TOPIC_CONCEPTS, VENOUS_TOPIC_DRAFT_CASES,
  VENOUS_TOPIC_IDENTITY_DECISIONS, VENOUS_TOPIC_ORDER_PROPOSALS, VENOUS_TOPIC_QUESTIONS,
  VENOUS_TOPIC_PARKED_AFTER_REVIEW, VENOUS_TOPIC_REVIEW_RESPONSE,
  VENOUS_TOPIC_SOURCE_LINKS, VENOUS_TOPIC_SOURCES, VENOUS_TOPIC_STATEMENT_MAPPINGS,
  VENOUS_TOPIC_TIMING_ENTRIES, venousCaseId, venousChoiceId, venousNodeId, venousQuestionId,
  VENOUS_TOPIC_CURRENT_REVIEW_QUEUE, VENOUS_TOPIC_SALVAGE_CASES, VENOUS_TOPIC_SALVAGE_QUESTIONS,
  VENOUS_TOPIC_SALVAGE_TIMING_ENTRIES, VENOUS_TOPIC_SALVAGE_ORDER_PROPOSALS,
  VENOUS_TOPIC_SALVAGE_CASE_REVIEWS, VENOUS_TOPIC_SALVAGE_SOURCE_LINKS,
} from "./question-topic-vascular-venous-lymphatic-access-20261111";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const bytesDigest = (file: string) => createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex");
const authoredNodes = VENOUS_TOPIC_DRAFT_CASES.flatMap(c => c.nodes);
const ids = (values: { id: string }[]) => values.map(v => v.id);

describe("vascular venous, lymphatic and access topic sidecar", () => {
  it("reconciles all exact assigned variants, including retained rows", () => {
    expect(packet.assignment.inventory).toHaveLength(61);
    expect(packet.audit).toHaveLength(61);
    expect(new Set(packet.audit.map(a => a.recordId)).size).toBe(61);
    expect(packet.audit.map(a => a.recordId).sort()).toEqual(packet.assignment.inventory.map(r => r.recordId).sort());
    expect(packet.audit.filter(a => a.verdict === "Keep")).toHaveLength(5);
    expect(packet.audit.filter(a => a.verdict === "Rewrite")).toHaveLength(23);
    expect(packet.audit.filter(a => a.verdict === "Retire-and-replace")).toHaveLength(33);
    const successorIds = new Set([
      ...ids(VENOUS_TOPIC_QUESTIONS), ...packet.round1Archive.authoredProjection.questions.map(q => q.id),
      ...packet.assignment.frozenAcceptanceReferences.map(r => r.questionVariantId),
    ]);
    for (const a of packet.audit) {
      expect(a.reasons.join(" ").length).toBeGreaterThan(100);
      expect(a.beforeNodeSha256s.length).toBeGreaterThan(0);
      expect(a.beforeCaseSha256s.length).toBeGreaterThan(0);
      expect(a.sourceFileAndExport.file).toMatch(/\.ts$/);
      expect(a.variantIds).toHaveLength(1);
      if (a.verdict !== "Keep") {
        expect(a.replacementQuestionIds.length).toBeGreaterThan(0);
        for (const id of a.replacementQuestionIds) expect(successorIds.has(id), id).toBe(true);
      }
    }
    expect(packet.contextCapture.complete).toBe(61);
    expect(packet.contextCapture.missing).toEqual([]);
  });

  it("retains registry-only history and original holds without manufacturing approvals", () => {
    expect(packet.coverageHistory).toHaveLength(23);
    expect(packet.coverageHistory.filter(c => c.registeredInDefaultRelease)).toHaveLength(20);
    expect(packet.coverageHistory.filter(c => c.registeredInDefaultRelease && !c.activeInDefaultRelease)).toHaveLength(7);
    expect(packet.assignment.recordedHolds).toHaveLength(5);
    expect(packet.originalHoldDispositions.map(h => h.id).sort()).toEqual(packet.assignment.recordedHolds.map(h => h.id).sort());
    expect(packet.assignment.unkeyedDraftSlots).toHaveLength(0);
    expect(packet.newUnkeyedPlanningSlots).toHaveLength(3);
    for (const h of packet.newUnkeyedPlanningSlots) {
      expect(h.keyed).toBe(false);
      expect(h.evidenceBoundary.length).toBeGreaterThan(50);
      expect(h.questionForMelissa.length).toBeGreaterThan(50);
    }
  });

  it("keeps all assigned live node bytes and exact frozen cases intact", () => {
    const retained = packet.assignment.inventory.filter(row => row.live).map(row => retainedTopicCase(row.caseId)!);
    const contexts = [...new Map([...SYNTHETIC_CLINICAL_RELEASE.cases, ...retained].map(clinicalCase => [clinicalCase.id, clinicalCase])).values()];
    const current = contexts.flatMap(c => c.decisionNodes.map(n => ({ c, n })));
    for (const r of packet.assignment.inventory.filter(r => r.live)) {
      const b = packet.beforeSnapshots.find(b => b.recordId === r.recordId)!;
      const found = current.find(t => t.c.id === r.caseId && t.n.id === r.nodeIds[0] && r.variantIds.includes(t.n.questionVariantId));
      expect(found, r.recordId).toBeDefined();
      expect(b.nodeSha256).toContain(digest(found!.n));
    }
    for (const frozen of packet.assignment.frozenIndependentReviews) {
      const found = current.find(t => t.n.questionVariantId === frozen.exactVariantId)!;
      expect(frozen.exactNodeSha256).toContain(digest(found.n));
      expect(frozen.exactCaseSha256s).toContain(digest(found.c));
      expect(bytesDigest(frozen.reviewFile)).toBe(frozen.reviewFileSha256);
      expect(bytesDigest(frozen.managerDecisionFile)).toBe(frozen.managerDecisionSha256);
    }
    expect(bytesDigest(packet.frozenAssetInspection.path)).toBe(packet.frozenAssetInspection.sha256);
    const f03 = packet.assignment.frozenIndependentReviews.find(r => r.reviewId === "F03")!;
    expect(f03.review.verdict).toBe("REVISE");
    expect(packet.assignment.frozenIndependentReviews.filter(r => r.review.verdict === "PASS")).toHaveLength(4);
    expect(packet.assignment.clinicalApprovalReferences).toEqual([]);
  });

  it("preserves exact source inputs while allowing documented shared-release drift", () => {
    const shared = new Set([
      "packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
      "packages/clinical-content/src/question-ship-manifest.ts",
    ]);
    for (const input of packet.assignment.inputHashes.filter(i => !shared.has(i.file))) {
      expect(bytesDigest(input.file), input.file).toBe(input.snapshotSha256);
    }
    expect(packet.currentReleaseCheck.assignedConceptNodeCount).toBe(44);
    expect(packet.currentReleaseCheck.topicNodeDrift).toEqual([]);
  });

  it("validates every explicit-import draft through the existing runtime schemas", () => {
    expect(VENOUS_TOPIC_CASES).toHaveLength(27);
    expect(VENOUS_TOPIC_QUESTIONS).toHaveLength(29);
    expect(authoredNodes.filter(n => n.beforeRecordIds.length === 0)).toHaveLength(16);
    expect(authoredNodes.filter(n => n.beforeRecordIds.length > 0)).toHaveLength(13);
    for (const c of VENOUS_TOPIC_CASES) expect(syntheticClinicalCaseSchema.safeParse(c).success, c.id).toBe(true);
    for (const c of VENOUS_TOPIC_CONCEPTS) expect(testedConceptSchema.safeParse(c).success, c.id).toBe(true);
    expect(new Set(ids(VENOUS_TOPIC_CASES)).size).toBe(27);
    expect(new Set(ids(VENOUS_TOPIC_QUESTIONS)).size).toBe(29);
    expect(VENOUS_TOPIC_CONCEPTS).toHaveLength(26);
  });

  it("keeps the review packet identical to the explicit-import clinical projection", () => {
    expect(packet.authoredProjection.questions).toEqual(VENOUS_TOPIC_QUESTIONS);
    expect(packet.authoredProjection.cases).toEqual(VENOUS_TOPIC_CASES);
    expect(packet.authoredProjection.concepts).toEqual(VENOUS_TOPIC_AUTHORING_CONCEPTS);
    expect(packet.authoredProjection.authorGates).toEqual(VENOUS_TOPIC_AUTHOR_GATES);
    expect(packet.authoredProjection.identityDecisions).toEqual(VENOUS_TOPIC_IDENTITY_DECISIONS);
    expect(packet.authoredProjection.timingEntries).toEqual(VENOUS_TOPIC_TIMING_ENTRIES);
    expect(packet.authoredProjection.orderProposals).toEqual(VENOUS_TOPIC_ORDER_PROPOSALS);
    expect(packet.authoredProjection.sourceLinks).toEqual(VENOUS_TOPIC_SOURCE_LINKS);
  });

  it("keeps named demographics, complete tasks and clinic admission aligned", () => {
    for (const c of VENOUS_TOPIC_DRAFT_CASES) {
      const runtime = VENOUS_TOPIC_CASES.find(x => x.id === venousCaseId(c))!;
      expect(c.complaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.presentation).toContain(c.patientName);
      expect(c.presentation).toContain(String(c.ageYears));
      expect(runtime.requiredClinicalSetting).toBe("clinic");
      expect(runtime.earliestFacilityStage).toBe(0);
      expect(runtime.requiredCapabilityIds).toEqual([]);
      expect(runtime.prototypeDemographics).toEqual({ ageYears: c.ageYears, sexLabel: c.sexLabel });
      expect(runtime.approvedInstantiationProfiles).toHaveLength(1);
      expect(runtime.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      for (const n of c.nodes) expect(n.task).toContain(c.patientName);
      if (c.clinicalContext === "outside_hospital_chart_review") expect(c.presentation).toMatch(/clinic/);
    }
    for (const r of VENOUS_TOPIC_CASE_REVIEWS) {
      expect(r.educationalTier).toBe(1);
      expect(r.facilityProgressionLevel).toBe(0);
      expect(r.patientAcuity.length).toBeGreaterThan(0);
      expect(r.facilityCapability.length).toBeGreaterThan(0);
      expect(r.clinicalApproval).toBe(false);
    }
  });

  it("randomizes every runtime option set and preserves complete feedback", () => {
    for (const c of VENOUS_TOPIC_CASES) for (const n of c.decisionNodes) {
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
      expect(n.answerChoices.length).toBeLessThanOrEqual(4);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(new Set(n.answerChoices.map(a => a.id)).size).toBe(n.answerChoices.length);
      expect(new Set(n.answerChoices.map(a => a.label)).size).toBe(n.answerChoices.length);
      for (const a of n.answerChoices) expect(a.rationale!.length).toBeGreaterThan(40);
      expect(n.resultGateAfter).toBeNull();
      for (const a of n.answerChoices) expect(a.serviceRequest).toBeNull();
    }
  });

  it("maps every testing choice and distractor by exact identity and label to an existing profile", () => {
    expect(VENOUS_TOPIC_TIMING_ENTRIES).toHaveLength(29);
    for (const t of VENOUS_TOPIC_TIMING_ENTRIES) expect(answerChoiceTimingRegistryEntrySchema.safeParse(t).success).toBe(true);
    let expectedOrders = 0;
    for (const c of VENOUS_TOPIC_DRAFT_CASES) for (const n of c.nodes) {
      const entry = VENOUS_TOPIC_TIMING_ENTRIES.find(t => t.caseId === venousCaseId(c) && t.nodeId === venousNodeId(n) && t.questionVariantId === venousQuestionId(n))!;
      const testing = n.options.some(o => o.timingProfileId);
      expect(entry.classification.kind).toBe(testing ? "test_choices" : "no_test");
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(n.options.length);
        for (const o of n.options) {
          const timed = entry.classification.choices.find(t => t.choiceId === venousChoiceId(n, o))!;
          expect(timed.choiceLabel).toBe(o.label);
          if (o.timingProfileId) {
            expectedOrders++;
            expect(timed.timing).toEqual({ kind: "test", timingProfileId: o.timingProfileId });
            expect(Object.hasOwn(DIAGNOSTIC_PROFILE_TIMING_MAPPINGS, o.timingProfileId)).toBe(true);
          } else expect(timed.timing.kind).toBe("no_test");
        }
      }
      // Elapsed clinical observations can be supported evidence; authored testing waits remain metadata-only.
      expect(`${c.presentation} ${n.currentUpdate ?? ""} ${n.task}`).not.toMatch(/\b(?:wait(?:ing)?|turnaround|estimated time|results? (?:in|after))\b[^.]{0,80}\b\d+\s*(?:minutes?|hours?)\b/i);
    }
    expect(VENOUS_TOPIC_ORDER_PROPOSALS).toHaveLength(expectedOrders);
    for (const o of VENOUS_TOPIC_ORDER_PROPOSALS) {
      expect(o.currentServiceRequest).toBeNull();
      expect(o.currentResultGate).toBeNull();
      expect(o.delivery).toBe("external_plan_estimate_only");
    }
  });

  it("provides concrete manual gates and decision-changing counterfactuals for every exact draft", () => {
    expect(VENOUS_TOPIC_AUTHOR_GATES).toHaveLength(29);
    for (const g of VENOUS_TOPIC_AUTHOR_GATES) {
      expect(g.independentReview).toBe(false);
      expect(g.clinicalApproval).toBe(false);
      expect(g.coverTheKey.length).toBeGreaterThan(80);
      expect(g.oneDecisionStageAndCategory.length).toBeGreaterThan(20);
      expect(g.twoConsequentialSteps).toHaveLength(2);
      expect(g.singleBestAnswer.decidingObservation.length).toBeGreaterThan(30);
      expect(g.singleBestAnswer.counterfactual.length).toBeGreaterThan(50);
      expect(g.deletionTest.length).toBeGreaterThan(60);
      expect(g.fullSequence.length).toBeGreaterThan(50);
      for (const o of g.options) {
        expect(o.temptation.length).toBeGreaterThan(20);
        expect(o.reasonableUnder.length).toBeGreaterThan(25);
      }
    }
  });

  it("distinguishes stable identity reuse, new meanings and unkeyed extensions", () => {
    const registered = new Set(packet.assignment.concepts.map(c => c.conceptId));
    const reused = new Set(authoredNodes.filter(n => registered.has(n.conceptId)).map(n => n.conceptId));
    const newIds = new Set(authoredNodes.filter(n => !registered.has(n.conceptId)).map(n => n.conceptId));
    expect(reused.size).toBe(7);
    expect(newIds.size).toBe(19);
    expect(new Set(VENOUS_TOPIC_IDENTITY_DECISIONS.filter(d => d.previousConceptId).map(d => d.conceptId)).size).toBe(9);
    for (const n of authoredNodes) {
      if (n.beforeRecordIds.length) expect(packet.audit.some(a => a.verdict === "Rewrite" && a.round2SuccessorDispositions.some(d => d.activeQuestionId === venousQuestionId(n)))).toBe(true);
      if (n.previousConceptId) expect(n.conceptId).not.toBe(n.previousConceptId);
      expect(n.beforeVariantIds).not.toContain(venousQuestionId(n));
    }
    expect(VENOUS_TOPIC_QUESTIONS.some(q => q.id === "question.n2.vte-prophylaxis-to-treatment.v3")).toBe(false);
  });

  it("closes source-to-claim and claim-to-question mappings without snippets or placeholder citations", () => {
    const claims = new Set(ids(VENOUS_TOPIC_CLAIMS));
    const sources = new Set(ids(VENOUS_TOPIC_SOURCES));
    expect(sources.size).toBe(VENOUS_TOPIC_SOURCES.length);
    expect(claims.size).toBe(VENOUS_TOPIC_CLAIMS.length);
    for (const q of VENOUS_TOPIC_QUESTIONS) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      const mapping = ledger.questionToClaimMappings.find(m => m.questionVariantId === q.id)!;
      expect(mapping.claimIds).toEqual(q.supportingEvidenceClaimIds);
      for (const id of q.supportingEvidenceClaimIds) {
        expect(claims.has(id), id).toBe(true);
        expect(ledger.claimToQuestionMappings.find(m => m.claimId === id)!.questionVariantIds).toContain(q.id);
      }
    }
    for (const c of VENOUS_TOPIC_CLAIMS) {
      expect(c.sourceIds.length).toBeGreaterThan(0);
      expect(c.lastCheckedOn).toBe("2026-11-11");
      for (const id of c.sourceIds) {
        expect(sources.has(id), id).toBe(true);
        expect(VENOUS_TOPIC_SOURCES.find(s => s.id === id)!.evidenceClaimIds).toContain(c.id);
      }
    }
    for (const s of VENOUS_TOPIC_SOURCES) {
      expect(s.completeCitation.length).toBeGreaterThan(80);
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.publicationYear).not.toBeNull();
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.authorityAssessment.length).toBeGreaterThan(40);
      expect(s.reuseNotes.length).toBeGreaterThan(80);
      expect(s.completeCitation).not.toMatch(/\bTODO\b|placeholder/i);
    }
    expect(VENOUS_TOPIC_STATEMENT_MAPPINGS).toHaveLength(29);
    expect(ledger.statementFieldMappings).toHaveLength(29 * 7);
  });

  it("reconciles the independent review with one disposition per exact item", () => {
    expect(bytesDigest(VENOUS_TOPIC_REVIEW_RESPONSE.reviewFile)).toBe(VENOUS_TOPIC_REVIEW_RESPONSE.reviewFileSha256);
    const rows = VENOUS_TOPIC_REVIEW_RESPONSE.rows;
    expect(rows).toHaveLength(46);
    expect(new Set(rows.map(r => r.reviewedQuestionId)).size).toBe(46);
    expect(rows.filter(r => r.status === "pass-preserved")).toHaveLength(15);
    expect(rows.filter(r => r.status === "revised")).toHaveLength(14);
    expect(rows.filter(r => r.status === "parked")).toHaveLength(17);
    expect(VENOUS_TOPIC_PARKED_AFTER_REVIEW).toHaveLength(17);
    for (const r of rows) {
      expect(r.repairAttempts).toBe(r.status === "pass-preserved" ? 0 : 1);
      expect(r.clinicalReviewStatus).toBe("needs_clinician_review");
      expect(r.pipelinePassed).toBe(r.status === "pass-preserved");
      if (r.status === "parked") expect(r.activeQuestionId).toBeNull();
      else expect(VENOUS_TOPIC_QUESTIONS.some(q => q.id === r.activeQuestionId)).toBe(true);
    }
    for (const r of VENOUS_TOPIC_PARKED_AFTER_REVIEW) {
      expect(r.reason.length).toBeGreaterThan(100);
      expect(r.repairAttempt.length).toBeGreaterThan(40);
      expect(VENOUS_TOPIC_QUESTIONS.some(q => q.id === r.reviewedQuestionId)).toBe(false);
    }
  });

  it("preserves every PASS question, authored node, runtime clinical fields and visible context exactly", () => {
    const oldCases = packet.round1Archive.authoredProjection.cases as unknown as typeof VENOUS_TOPIC_CASES;
    const oldAuthored = packet.round1Archive.draftCases as unknown as typeof VENOUS_TOPIC_DRAFT_CASES;
    const visible = (c: (typeof VENOUS_TOPIC_CASES)[number]) => ({
      patientPresentationVariantId: c.patientPresentationVariantId, patientDisplayName: c.patientDisplayName,
      prototypeDemographics: c.prototypeDemographics, chiefComplaint: c.chiefComplaint, presentation: c.presentation,
      approvedInstantiationProfiles: c.approvedInstantiationProfiles, sourceLabels: c.sourceLabels,
    });
    for (const r of VENOUS_TOPIC_REVIEW_RESPONSE.rows.filter(r => r.status === "pass-preserved")) {
      const q = VENOUS_TOPIC_QUESTIONS.find(q => q.id === r.activeQuestionId)!;
      expect(q).toEqual(packet.round1Archive.authoredProjection.questions.find(x => x.id === r.reviewedQuestionId));
      const c = VENOUS_TOPIC_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === q.id))!;
      const old = oldCases.find(c => c.decisionNodes.some(n => n.questionVariantId === q.id))!;
      const currentNode = c.decisionNodes.find(n => n.questionVariantId === q.id)!;
      const oldNode = old.decisionNodes.find(n => n.questionVariantId === q.id)!;
      const { terminalDispositions: oldEnding, ...oldClinical } = oldNode;
      const { terminalDispositions: currentEnding, ...currentClinical } = currentNode;
      expect(currentClinical).toEqual(oldClinical);
      if (oldEnding.length === 0 && c.decisionNodes.indexOf(currentNode) === c.decisionNodes.length - 1) {
        expect(currentEnding).toEqual(oldNode.answerChoices.filter(a => !a.isCorrect).map(a => ({
          answerChoiceId: a.id, kind: "no_terminal_outcome",
          consequenceNarrative: "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
          clinicalRationale: a.rationale!, sourceLabels: oldNode.sourceLabels,
        })));
      } else expect(currentEnding).toEqual(oldEnding);
      expect(visible(c)).toEqual(visible(old));
      const n = authoredNodes.find(n => venousQuestionId(n) === q.id)!;
      expect(n).toEqual(oldAuthored.flatMap(c => c.nodes).find(x => x.slug === n.slug));
      const frozen = VENOUS_TOPIC_REVIEW_RESPONSE.passPreservation.find(x => x.questionVariantId === q.id)!;
      expect(digest(q)).toBe(frozen.reviewedQuestionSha256);
      expect(digest(currentClinical)).toBe(frozen.reviewedClinicalNodeBodySha256);
    }
  });

  it("admits only all-PASS multipart cases and keeps revision candidates self-contained", () => {
    const passed = new Set(VENOUS_TOPIC_REVIEW_RESPONSE.rows.filter(r => r.status === "pass-preserved").map(r => r.activeQuestionId));
    const multi = VENOUS_TOPIC_CASES.filter(c => c.decisionNodes.length > 1);
    expect(multi).toHaveLength(2);
    for (const c of multi) {
      for (const n of c.decisionNodes) expect(passed.has(n.questionVariantId), n.questionVariantId).toBe(true);
      expect(c).toEqual(packet.round1Archive.authoredProjection.cases.find(old => old.id === c.id));
    }
    for (const r of VENOUS_TOPIC_REVIEW_RESPONSE.rows.filter(r => r.status === "revised")) {
      const c = VENOUS_TOPIC_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === r.activeQuestionId))!;
      expect(c.decisionNodes).toHaveLength(1);
      expect(r.independentRereviewRequired).toBe(true);
      expect(r.pipelinePassed).toBe(false);
    }
  });

  it("versions repaired questions and timing tuples while retaining the reviewed before versions", () => {
    for (const r of VENOUS_TOPIC_REVIEW_RESPONSE.rows.filter(r => r.status === "revised")) {
      expect(r.activeQuestionId).toMatch(/\.v2$/);
      expect(packet.round1Archive.authoredProjection.questions.some(q => q.id === r.reviewedQuestionId)).toBe(true);
      const q = VENOUS_TOPIC_QUESTIONS.find(q => q.id === r.activeQuestionId)!;
      expect(q.contentVersion).toMatch(/\.v2$/);
      const n = authoredNodes.find(n => venousQuestionId(n) === q.id)!;
      expect(n.previousReviewedQuestionId).toBe(r.reviewedQuestionId);
      const t = VENOUS_TOPIC_TIMING_ENTRIES.find(t => t.questionVariantId === q.id)!;
      expect(t.nodeId).toMatch(/\.v2$/);
      for (const a of q.answerChoices) expect(a.id).toMatch(/\.v2$/);
    }
  });

  it("keeps all new clinical records unapproved and source links safe", () => {
    for (const r of [...VENOUS_TOPIC_QUESTIONS, ...VENOUS_TOPIC_CLAIMS, ...VENOUS_TOPIC_SOURCES, ...VENOUS_TOPIC_AUTHORING_CONCEPTS, ...VENOUS_TOPIC_CASE_REVIEWS]) {
      expect(r.reviewStatus).toBe("needs_clinician_review");
      expect(r.aiAssistedDrafting).toBe(true);
      expect(r.lastClinicianReview).toBeNull();
    }
    for (const l of VENOUS_TOPIC_SOURCE_LINKS) {
      expect(l.target).toBe("_blank");
      expect(l.rel).toBe("noopener noreferrer");
      expect(l.referrerPolicy).toBe("no-referrer");
    }
  });

  it("queues every batch5 skipped PASS for salvage and excludes all already accepted nodes", () => {
    expect(bytesDigest(packet.salvage.dispositionPath)).toBe(packet.salvage.dispositionSha256);
    expect(bytesDigest(packet.salvage.reviewPath)).toBe(packet.salvage.reviewSha256);
    const dispositions = JSON.parse(readFileSync(resolve(root, packet.salvage.dispositionPath), "utf8")) as {
      items: { topic: string; status: string; nodeId: string; evidence?: { record?: { verdict: string } } }[];
    };
    const topic = dispositions.items.filter(row => row.topic === "vascular-venous-lymphatic-access");
    const skipped = topic.filter(row => row.status === "skipped" && row.evidence?.record?.verdict === "PASS");
    const accepted = new Set(topic.filter(row => row.status === "accepted").map(row => row.nodeId));
    expect(skipped).toHaveLength(1);
    expect(VENOUS_TOPIC_CURRENT_REVIEW_QUEUE).toHaveLength(1);
    expect(VENOUS_TOPIC_CURRENT_REVIEW_QUEUE.flatMap(row => row.nodeIds)).toEqual(skipped.map(row => row.nodeId));
    expect(VENOUS_TOPIC_SALVAGE_CASES).toHaveLength(1);
    for (const row of VENOUS_TOPIC_CURRENT_REVIEW_QUEUE) {
      expect(row.status).toBe("salvage");
      expect(row.contextReviewStatus).toBe("pending_salvage_recheck");
      expect(row.integrationEligible).toBe(false);
      for (const id of row.nodeIds) expect(accepted.has(id)).toBe(false);
    }
  });

  it("preserves every previous authoring export and all thirteen accepted source/runtime nodes", () => {
    const baseline = packet.salvage.baselineProjection;
    expect(VENOUS_TOPIC_CASES).toEqual(baseline.cases);
    expect(VENOUS_TOPIC_QUESTIONS).toEqual(baseline.questions);
    expect(VENOUS_TOPIC_AUTHORING_CONCEPTS).toEqual(baseline.concepts);
    expect(VENOUS_TOPIC_AUTHOR_GATES).toEqual(baseline.authorGates);
    expect(VENOUS_TOPIC_TIMING_ENTRIES).toEqual(baseline.timingEntries);
    expect(VENOUS_TOPIC_ORDER_PROPOSALS).toEqual(baseline.orderProposals);
    expect(VENOUS_TOPIC_SOURCE_LINKS).toEqual(baseline.sourceLinks);
    expect(packet.salvage.acceptedSnapshots).toHaveLength(13);
    for (const frozen of packet.salvage.acceptedSnapshots) {
      const sourceCase = VENOUS_TOPIC_CASES.find(c => c.id === frozen.caseId)!;
      const sourceQuestion = VENOUS_TOPIC_QUESTIONS.find(q => q.id === frozen.questionVariantId)!;
      const runtimeCase = SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.id === frozen.caseId)!;
      expect(sourceCase).toEqual(frozen.sourceCase);
      expect(sourceQuestion).toEqual(frozen.sourceQuestion);
      expect(runtimeCase).toEqual(frozen.runtimeCase);
      expect(digest(sourceCase)).toBe(frozen.sourceCaseSha256);
      expect(digest(sourceQuestion)).toBe(frozen.sourceQuestionSha256);
      expect(digest(runtimeCase)).toBe(frozen.runtimeCaseSha256);
    }
  });

  it("extracts the exact PASS imaging question into a complete clinic case without the non-PASS companion", () => {
    const item = packet.salvage.items[0]!;
    const c = VENOUS_TOPIC_SALVAGE_CASES[0]!;
    const node = c.decisionNodes[0]!;
    expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(true);
    expect(c).toEqual(item.afterCase);
    expect(c.decisionNodes).toHaveLength(1);
    expect(c.requiredClinicalSetting).toBe("clinic");
    expect(c.earliestFacilityStage).toBe(0);
    expect(c.presentation).toBe(item.beforeCase.presentation);
    expect(c.chiefComplaint).toBe(item.beforeCase.chiefComplaint);
    expect(c.prototypeDemographics).toEqual(item.beforeCase.prototypeDemographics);
    expect(c.learningSummary).toBe(item.beforeNode.explanation);
    expect(VENOUS_TOPIC_SALVAGE_QUESTIONS[0]).toEqual(item.beforeQuestion);
    expect(digest(VENOUS_TOPIC_SALVAGE_QUESTIONS[0])).toBe(item.preservation.questionSha256);
    const { terminalDispositions: ending, ...clinical } = node;
    const { terminalDispositions: oldEnding, ...oldClinical } = item.beforeNode;
    expect(clinical).toEqual(oldClinical);
    expect(oldEnding).toEqual([]);
    expect(ending).toEqual(node.answerChoices.filter(a => !a.isCorrect).map(a => ({
      answerChoiceId: a.id, kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
      clinicalRationale: a.rationale, sourceLabels: node.sourceLabels,
    })));
    expect(node.shuffleAnswers).toBe(true);
    expect(node.resultGateAfter).toBeNull();
    expect(c.decisionNodes.some(n => item.excludedSiblingIds.some(id => id === n.id))).toBe(false);
    expect(JSON.stringify(c)).not.toMatch(/troponin|right-ventricular enlargement|V\/Q imaging subsequently supports PE/);
    for (const review of VENOUS_TOPIC_SALVAGE_CASE_REVIEWS) {
      expect(review.status).toBe("salvage");
      expect(review.reviewStatus).toBe("needs_clinician_review");
      expect(review.independentContextPass).toBe(false);
      expect(review.integrationEligible).toBe(false);
      expect(review.clinicalApproval).toBe(false);
    }
  });

  it("binds all three salvage testing choices to exact new-case tuples and existing evidence", () => {
    const item = packet.salvage.items[0]!;
    const c = VENOUS_TOPIC_SALVAGE_CASES[0]!;
    const node = c.decisionNodes[0]!;
    expect(VENOUS_TOPIC_SALVAGE_TIMING_ENTRIES).toHaveLength(1);
    const entry = VENOUS_TOPIC_SALVAGE_TIMING_ENTRIES[0]!;
    expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
    expect(entry.caseId).toBe(c.id);
    expect(entry.nodeId).toBe(node.id);
    expect(entry.questionVariantId).toBe(node.questionVariantId);
    expect(entry.classification.kind).toBe("test_choices");
    if (entry.classification.kind !== "test_choices") throw new Error("Expected three testing choices");
    expect(entry.classification.choices).toHaveLength(3);
    expect(VENOUS_TOPIC_SALVAGE_ORDER_PROPOSALS).toHaveLength(3);
    for (const choice of node.answerChoices) {
      const timed = entry.classification.choices.find(t => t.choiceId === choice.id)!;
      expect(timed.choiceLabel).toBe(choice.label);
      expect(timed.timing.kind).toBe("test");
      if (timed.timing.kind !== "test") throw new Error("Missing test timing");
      expect(Object.hasOwn(DIAGNOSTIC_PROFILE_TIMING_MAPPINGS, timed.timing.timingProfileId)).toBe(true);
      const order = VENOUS_TOPIC_SALVAGE_ORDER_PROPOSALS.find(o => o.choiceId === choice.id)!;
      expect(order.caseId).toBe(c.id);
      expect(order.choiceLabel).toBe(choice.label);
      expect(order.currentServiceRequest).toBeNull();
      expect(order.currentResultGate).toBeNull();
      expect(choice.serviceRequest).toBeNull();
    }
    expect(ledger.salvageReuse.newClinicalClaims).toBe(0);
    expect(ledger.salvageReuse.newSources).toBe(0);
    expect(ledger.salvageReuse.contextMappings[0]!.claimIds).toEqual(item.supportingEvidenceClaimIds);
    for (const id of item.supportingEvidenceClaimIds) expect(VENOUS_TOPIC_CLAIMS.some(c => c.id === id)).toBe(true);
    for (const link of VENOUS_TOPIC_SALVAGE_SOURCE_LINKS) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });
});
