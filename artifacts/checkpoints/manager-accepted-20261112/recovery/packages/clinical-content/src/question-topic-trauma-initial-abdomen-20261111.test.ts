import {topicQuestionAcceptance, topicCaseIsExplicitlyLive} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE as balance } from "@gamify-surgery/balance-config";
import {
  answerChoiceTimingRegistryEntrySchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, validateSyntheticClinicalRelease,
} from "./schema";
import packet from "../../../docs/research/question-topic-trauma-initial-abdomen-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json";
import review from "../../../docs/research/question-topic-trauma-initial-abdomen-review-20261111.json";
import dispositions from "../../../docs/research/question-topic-acceptance-batch1-dispositions-20261111.json";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileSha = (name: string) => createHash("sha256").update(readFileSync(new URL("../../../" + name, import.meta.url))).digest("hex");
const b = await import("./question-topic-trauma-initial-abdomen-20261111");
const active = packet.nodes.filter(n => n.itemStatus !== "parked");

function clinicalPayload(n: (typeof packet.nodes)[number], cs: (typeof packet.cases)[number]) {
  return {
    questionVariantId: n.questionVariantId, nodeId: n.id, conceptId: n.conceptId,
    contentVersion: n.contentVersion, reviewStatus: n.reviewStatus,
    aiAssistedDrafting: n.aiAssistedDrafting, lastClinicianReview: n.lastClinicianReview,
    objective: n.objective, clinicalPhase: n.clinicalPhase, patientAcuity: n.patientAcuity,
    currentUpdate: n.currentUpdate, task: n.task, exhibit: n.exhibit,
    choices: n.choices, keyChoiceId: n.keyChoiceId, explanation: n.explanation,
    evidenceClaimIds: n.evidenceClaimIds, shuffleAnswers: n.shuffleAnswers,
    patientDisplayName: cs.patientDisplayName, prototypeDemographics: cs.prototypeDemographics,
    recordPresentation: cs.outsideRecordPresentation,
    recordChiefComplaint: cs.outsideRecordChiefComplaint, recordProfiles: cs.outsideRecordProfiles,
  };
}

describe("trauma initial abdomen: reviewed clinic chart-review sidecar", () => {
  it("reconciles original zero-row assignment separately from the 22-item independent review", () => {
    for (const field of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments", "identityReuseNotes", "recordedHolds", "unkeyedDraftSlots", "withheldTeachingPoints", "frozenIndependentPASSReferences", "clinicalApprovalReferences"] as const) expect(packet.assignment[field]).toEqual([]);
    expect(packet.auditRows).toEqual([]);
    expect(packet.auditReconciliation.missing).toEqual([]);
    expect(packet.auditReconciliation.extra).toEqual([]);
    expect(review).toHaveLength(22);
    expect(review.filter(r => r.verdict === "PASS")).toHaveLength(9);
    expect(review.filter(r => r.verdict === "REVISE")).toHaveLength(13);
    expect(fileSha(packet.reviewRound2.reviewFile)).toBe(packet.reviewRound2.reviewFileSha256);
    expect(packet.reviewedSnapshot.reviews).toEqual(review);
    expect(packet.reviewRound2.responses.map(r => r.reviewedQuestionVariantId).sort()).toEqual(review.map(r => r.id).sort());
    expect(packet.counts).toMatchObject({ auditedExactVariants: 22, auditedCaseNodeContexts: 22, kept: 9, rewritten: 9, parked: 4, retireAndReplaceProposed: 0, newQuestionVariants: 18, newCases: 14, multiDecisionCases: 4, meaningChangesThisRound: 3, salvagedCases: 3, salvagedNodes: 3 });
  });

  it("validates the exact shared acceptance epoch and keeps salvage out of the default release", async () => {
    // Keep shared-runtime construction and migration-fixture failures in this
    // guard. They still fail the command, while all independent topic checks run.
    const [runtime, shipping, estimates, epoch] = await Promise.all([
      import("./synthetic-content"), import("./question-ship-manifest"),
      import("./answer-choice-timing"), import("./question-program-batch1-acceptance-test-support"),
    ]);
    const live = runtime.SYNTHETIC_CLINICAL_RELEASE;
    const manifest = shipping.QUESTION_SHIP_MANIFEST;
    const globalTiming = estimates.ANSWER_CHOICE_TIMING_REGISTRY;
    const { beforeProgramBatch1AcceptanceRelease, beforeProgramBatch1AcceptanceManifest,
      beforeProgramBatch1AcceptanceTimings, beforeProgramBatch1AcceptanceSource } = epoch;
    // Prove the complete authorized acceptance delta before restoring the old
    // epoch. Original captures stay exact; unrelated drift still fails closed.
    const priorRelease = beforeProgramBatch1AcceptanceRelease(live);
    const priorManifest = beforeProgramBatch1AcceptanceManifest(manifest);
    const priorTiming = beforeProgramBatch1AcceptanceTimings(globalTiming);
    expect([priorRelease.cases.length, priorRelease.cases.flatMap(c => c.decisionNodes).length, priorRelease.concepts.length, priorManifest.accepted.length]).toEqual([1151, 1462, 610, 145]);
    const ids = new Set(packet.nodes.map(n => n.questionVariantId));
    expect(priorRelease.cases.flatMap(c => c.decisionNodes).some(n => ids.has(n.questionVariantId))).toBe(false);
    expect(priorManifest.accepted.some(r => ids.has(r.questionVariantId))).toBe(false);
    expect(priorTiming.some(r => ids.has(r.questionVariantId))).toBe(false);
    const acceptedIds = [...ids].filter(id => topicQuestionAcceptance(id).live).sort();
    expect(live.cases.flatMap(c => c.decisionNodes).filter(n => ids.has(n.questionVariantId)).map(n => n.questionVariantId).sort()).toEqual(acceptedIds);
    expect(manifest.accepted.filter(r => ids.has(r.questionVariantId)).map(r => r.questionVariantId).sort()).toEqual([...ids].filter(id => topicQuestionAcceptance(id).accepted).sort());
    for (const id of packet.salvage.caseIds) {
      const source = topicCaseIsExplicitlyLive(id);
      expect(live.cases.some(c => c.id === id)).toBe(source);
      expect(manifest.accepted.some(r => r.caseId === id)).toBe(source);
    }
    for (const [name, hash] of Object.entries(packet.reviewRound2.sourceInputSha256)) {
      const current = readFileSync(new URL("../../../" + name, import.meta.url), "utf8");
      const historical = beforeProgramBatch1AcceptanceSource(name, current);
      expect(createHash("sha256").update(historical).digest("hex"), name).toBe(hash);
    }
    // Batch 2 was integrated concurrently. Its exact inverse must recover this
    // task's original intake bytes; no expected hash or capture is refreshed.
    const { beforeProgramBatch2AcceptanceSource } = await import("./question-program-batch2-acceptance-test-support");
    for (const [name, hash] of Object.entries(packet.salvage.sourceInputSha256)) {
      const current = readFileSync(new URL("../../../" + name, import.meta.url), "utf8");
      const atIntake = beforeProgramBatch2AcceptanceSource(name, current);
      expect(createHash("sha256").update(atIntake).digest("hex"), name).toBe(hash);
    }
  });

  it.each(packet.reviewedSnapshot.passFreezes.map(f => [f.questionVariantId, f] as const))("preserves PASS clinical payload exactly: %s", (id, frozen) => {
    const n = packet.nodes.find(n => n.questionVariantId === id)!;
    const cs = packet.cases.find(c => c.id === n.caseId)!;
    expect(n.itemStatus).toBe(packet.salvage.questionVariantIds.includes(id) ? "salvage" : "pass-preserved");
    expect(n.revisionNumber).toBe(1);
    expect(sha(frozen.clinicalPayload)).toBe(frozen.clinicalPayloadSha256);
    expect(clinicalPayload(n, cs)).toEqual(frozen.clinicalPayload);
    expect(sha(clinicalPayload(n, cs))).toBe(frozen.clinicalPayloadSha256);
    const old = packet.reviewedSnapshot.nodes.find(n => n.questionVariantId === id)!;
    expect(n.authorGate).toEqual(old.authorGate);
    expect(n.preservedIndependentReview?.clinicalPayloadSha256).toBe(frozen.clinicalPayloadSha256);
    const runtime = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_DECISION_NODES.find(r => r.questionVariantId === id)!;
    expect(runtime.stem).toBe(old.task);
    expect(runtime.currentUpdate ?? null).toBe(old.currentUpdate);
    expect(runtime.exhibit ?? null).toEqual(old.exhibit);
    expect(runtime.answerChoices.map(c => [c.id, c.label, c.rationale, c.isCorrect])).toEqual(old.choices.map(c => [c.id, c.label, c.rationale, c.id === old.keyChoiceId]));
    expect(runtime.explanation).toBe(old.explanation);
    expect(cs.id).not.toBe(old.caseId);
    expect(cs.presentation.endsWith(cs.outsideRecordPresentation)).toBe(true);
  });

  it.each(packet.nodes.filter(n => n.questionVariantId !== n.originalQuestionVariantId).map(n => [n.slug, n] as const))("records exactly one versioned response for returned item %s", (_slug, n) => {
    const old = packet.reviewedSnapshot.nodes.find(o => o.questionVariantId === n.originalQuestionVariantId)!;
    expect(n.questionVariantId).toMatch(/\.v2$/);
    expect(n.id).toMatch(/\.v2$/);
    expect(n.before?.exactDraftSha256).toBe(old.exactDraftSha256);
    expect(n.beforeVersionHash).toBe(old.exactDraftSha256);
    expect(n.exportLocator).toContain(JSON.stringify(n.questionVariantId));
    expect(n.exportLocator.startsWith(n.itemStatus === "parked" ? "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.find" : "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find")).toBe(true);
    expect(n.reviewResponse.revisionAttempts).toBe(1);
    expect(n.reviewResponse.clarityResolutions.length).toBeGreaterThan(0);
    expect(n.reviewResponse.cueResolutions.length).toBeGreaterThan(0);
    expect(n.reviewResponse.fairnessResolutions.length).toBeGreaterThan(0);
    expect(n.reviewResponse.sourceBoundary).toBeTruthy();
    expect(n.independentReview).toBeNull();
    expect(n.clinicalApproval).toBeNull();
  });

  it("excludes every parked candidate from cases, feedback, concepts and timing supply", () => {
    const parked = packet.nodes.filter(n => n.itemStatus === "parked");
    expect(parked.map(n => n.slug)).toEqual(["crash-operative-route", "crash-abbreviated-operation", "belt-bowel-wall-defect", "spleen-failed-nonoperative"]);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS).toHaveLength(22);
    for (const n of parked) {
      expect(n.reviewResponse.parkReason).toBeTruthy();
      expect(n.authorGate.authorVerdict).toBe("PARKED_FAILED_DIFFICULTY_OR_COMPETITION_GATE");
      expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.some(q => q.id === n.questionVariantId)).toBe(false);
      expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CASES.some(c => c.decisionNodes.some(d => d.id === n.id))).toBe(false);
      expect(packet.timingProposals.some(t => t.questionVariantId === n.questionVariantId)).toBe(false);
      expect(() => b.traumaTopicReviewContext(n.questionVariantId)).toThrow("Unknown active");
    }
    expect(packet.nodes.find(n => n.slug === "spleen-failed-nonoperative")!.currentUpdate).toContain("increased intraperitoneal fluid compared with the earlier study");
  });

  it("admits 18 active decisions in 14 existing-schema clinic cases with complete final-answer dispositions", () => {
    const release = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCE_RELEASE;
    expect(validateSyntheticClinicalRelease(release)).toEqual(release);
    expect(release.cases).toHaveLength(14);
    expect(release.concepts).toHaveLength(18);
    expect(release.cases.flatMap(c => c.decisionNodes)).toHaveLength(18);
    expect(release.cases.filter(c => c.decisionNodes.length > 1)).toHaveLength(4);
    for (const cs of release.cases) {
      expect(syntheticClinicalCaseSchema.safeParse(cs).success).toBe(true);
      expect(cs.requiredClinicalSetting).toBe("clinic");
      expect(cs.requiredCapabilityIds).toEqual(["capability.examination"]);
      expect([cs.earliestFacilityStage, cs.rewardTierId, cs.routineEligible, cs.tutorialEligible]).toEqual([0, "reward.clinic_basic", true, false]);
      expect(cs.prototypeVitalSigns).toBeUndefined();
      expect(cs.chiefComplaint).toBe("Trauma follow-up");
      expect(cs.presentation).toContain("As the clinic founder");
      expect(cs.presentation).toContain("outside-hospital records");
      expect(cs.presentation).toContain("recorded hospital decision point");
      expect(cs.presentation).toContain(cs.prototypeDemographics!.ageYears + "-year-old");
      expect(cs.approvedInstantiationProfiles).toHaveLength(1);
      expect(cs.approvedInstantiationProfiles![0]!.presentation).toBe(cs.presentation);
      const binding = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLINIC_CASE_BINDINGS.find(c => c.caseId === cs.id)!;
      expect(binding.clinicPatientAcuity).toBe("stable");
      expect(binding.educationalTier).toBe("resident_application");
      expect(["obvious_emergency", "urgent_stable"]).toContain(binding.outsideRecordInitialAcuity);
      for (const [i, n] of cs.decisionNodes.entries()) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(c => c.serviceRequest === null)).toBe(true);
        expect(n.terminalDispositions.map(d => d.answerChoiceId).sort()).toEqual(i === cs.decisionNodes.length - 1 ? n.answerChoices.filter(c => !c.isCorrect).map(c => c.id).sort() : []);
        expect(n.terminalDispositions.every(d => d.kind === "no_terminal_outcome")).toBe(true);
      }
    }
  });

  it("retains old meanings and uses separate identities for all three changed meanings", () => {
    expect(packet.concepts).toHaveLength(24);
    expect(new Set(packet.concepts.map(c => c.id)).size).toBe(24);
    const changed = packet.nodes.filter(n => n.previousConceptId);
    expect(changed).toHaveLength(3);
    for (const n of changed) {
      expect(packet.concepts.find(c => c.id === n.previousConceptId)?.active).toBe(false);
      const next = packet.concepts.find(c => c.id === n.conceptId)!;
      expect(next.previousConceptId).toBe(n.previousConceptId);
      expect(next.historyMigration).toContain("None");
      expect(next.questionVariantIds).toEqual([n.questionVariantId]);
      expect(n.conceptId).not.toBe(n.previousConceptId);
    }
    for (const n of active.filter(n => !n.previousConceptId)) expect(n.conceptId).toBe(packet.reviewedSnapshot.nodes.find(o => o.questionVariantId === n.originalQuestionVariantId)!.conceptId);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TESTED_CONCEPTS.every(c => c.earliestFacilityStage === 0)).toBe(true);
  });

  it("preserves complete source rights and reciprocal atomic claim mappings", () => {
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES).toHaveLength(15);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLAIMS).toHaveLength(55);
    for (const s of b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES) {
      for (const value of [s.completeCitation, s.organizationOrJournal, s.authorityAssessment, s.reuseNotes, s.officialUrl, s.usageRole]) expect(value).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.accessedOn).toBe("2026-11-11");
      expect(s.evidenceClaimIds.sort()).toEqual(ledger.claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id).sort());
    }
    for (const c of b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLAIMS) {
      expect(c.limitation).toBeTruthy();
      expect(c.lastCheckedOn).toBe("2026-11-11");
      for (const id of c.sourceIds) expect(ledger.sources.some(s => s.id === id && s.evidenceClaimIds.includes(c.id))).toBe(true);
      const mapping = ledger.claimToQuestionMappings.find(m => m.claimId === c.id)!;
      expect(mapping.questionVariantIds.sort()).toEqual(packet.nodes.filter(n => n.evidenceClaimIds.includes(c.id)).map(n => n.questionVariantId).sort());
      expect(mapping.activeQuestionVariantIds.sort()).toEqual(active.filter(n => n.evidenceClaimIds.includes(c.id)).map(n => n.questionVariantId).sort());
    }
    const cc3 = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES.find(s => s.reuseStatus === "cc_by_3_0")!;
    expect(cc3.licenseUrl).toBe("https://creativecommons.org/licenses/by/3.0/");
    expect(ledger.revisionVerification.claimsAdded).toHaveLength(4);
    expect(ledger.revisionVerification.sourceTextStored).toBe(false);
  });

  it("covers every current clinical statement/option and preserves exact original versions", () => {
    for (const n of packet.nodes) {
      const { exactDraftSha256, ...exact } = n;
      expect(sha(exact)).toBe(exactDraftSha256);
      const mapping = packet.clinicalStatementMappings.find(m => m.questionVariantId === n.questionVariantId)!;
      expect(mapping.interpretationAndManagementClaimIds).toEqual(n.evidenceClaimIds);
      expect(mapping.optionMappings.map(c => c.choiceId)).toEqual(n.choices.map(c => c.id));
      for (const id of n.evidenceClaimIds) expect(ledger.claims.some(c => c.id === id)).toBe(true);
    }
    for (const cs of packet.cases) {
      const { exactDraftSha256, ...exact } = cs;
      expect(sha(exact)).toBe(exactDraftSha256);
    }
    for (const old of packet.reviewedSnapshot.nodes) {
      const { exactDraftSha256, ...exact } = old;
      expect(sha(exact)).toBe(exactDraftSha256);
    }
  });

  it("retains reviewed timing identities and supplies exact-label waits for active testing choices", () => {
    const profiles = new Set(balance.answerChoiceTimingProfiles.map(p => p.id));
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TIMING_ENTRIES).toEqual(packet.timingProposals);
    expect(packet.timingProposals).toHaveLength(18);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_RETAINED_TIMING_ENTRIES).toEqual(packet.reviewedSnapshot.timingProposals);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TEST_ORDER_PROPOSALS).toEqual(packet.testOrderProposals);
    for (const t of b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(t).success).toBe(true);
      const n = active.find(n => n.id === t.nodeId)!;
      if (t.classification.kind === "test_choices") {
        expect(t.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.choices.map(c => [c.id, c.label]));
        for (const c of t.classification.choices) if (c.timing.kind === "test") expect(profiles.has(c.timing.timingProfileId)).toBe(true);
      }
      for (const c of n.choices) if (/\b(?:CT|ultrasonography|angiography|ERCP|urethrography|Doppler)\b/i.test(c.label)) expect(c.timingProfileId, c.label).toBeTruthy();
      expect(JSON.stringify({ task: n.task, update: n.currentUpdate, exhibit: n.exhibit, labels: n.choices.map(c => c.label) })).not.toMatch(/\b(?:wait|results? (?:in|after)|turnaround)\s*\d/i);
    }
    for (const order of packet.testOrderProposals) expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCE_LINKS).toEqual(packet.sourceLinkProposals);
    for (const link of packet.sourceLinkProposals) expect([link.target, link.rel, link.referrerPolicy]).toEqual(["_blank", "noopener noreferrer", "no-referrer"]);
  });

  it("keeps revised decisions self-contained and repairs acquisition/chronology ambiguity", () => {
    const belt = active.find(n => n.slug === "belt-evolving-repeat-imaging")!;
    expect(belt.currentUpdate).toContain("six hours earlier");
    expect(belt.currentUpdate).toContain("small interloop fluid");
    expect(belt.task).not.toMatch(/which.*(?:imaging|test)/i);
    expect(belt.choices.map(c => c.label)).toEqual(["Repeat contrast-enhanced abdominal and pelvic CT", "Continue inpatient serial abdominal examinations", "Proceed to operative abdominal exploration"]);
    const renal = active.find(n => n.slug === "renal-no-hematuria-protocol")!;
    expect(renal.choices.slice(0, 2).map(c => c.label)).toEqual(["IV-contrast CT with arterial, venous and excretory acquisitions", "IV-contrast CT with arterial and venous acquisitions"]);
    const bladder = active.find(n => n.slug === "bladder-acquisition")!;
    expect(JSON.stringify(bladder.exhibit)).not.toMatch(/no retrograde instillation/i);
    expect(bladder.choices.find(c => c.id.endsWith(".urethrogram"))!.rationale).toContain("do not prove");
    const duodenum = active.find(n => n.slug === "duodenum-contained-wall-injury")!;
    expect(duodenum.task).not.toContain("obstruction");
    expect(ledger.claims.find(c => c.id.endsWith(".duodenal-fourteen-day-nonresolution"))!.certainty).toBe("low");
  });

  it.each(active.map(n => [n.slug, n] as const))("exports the exact active question and bounded visible context: %s", (_slug, n) => {
    const q = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === n.questionVariantId)!;
    const runtime = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_DECISION_NODES.find(r => r.id === n.id)!;
    expect(decisionNodeSchema.safeParse(runtime).success).toBe(true);
    expect(q.contentVersion).toBe(n.contentVersion);
    expect(q.stem).toBe(n.task);
    expect(q.answerChoices.filter(c => c.isCorrect).map(c => c.id)).toEqual([n.keyChoiceId]);
    expect(q.supportingEvidenceClaimIds).toEqual(n.evidenceClaimIds);
    const ctx = b.traumaTopicReviewContext(q.id);
    const prior = active.filter(p => p.caseId === n.caseId && p.sequenceIndex < n.sequenceIndex);
    expect(ctx.priorFeedback.map(p => p.questionVariantId)).toEqual(prior.map(p => p.questionVariantId));
    expect(ctx.priorObservations.map(p => p.nodeId)).toEqual(prior.map(p => p.id));
    expect(ctx.task).toContain(ctx.patientName);
    expect(ctx.task).not.toContain("{patientName}");
    expect(ctx.exhibit).toEqual(n.exhibit);
    if (n.itemStatus === "revised") {
      const g = n.authorGate;
      expect(g.authorVerdict).toBe("REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW");
      expect(g.twoConsequentialSteps.interpret).toBeTruthy();
      expect(g.twoConsequentialSteps.apply).toBeTruthy();
      expect(g.residentDifficulty.prediction).toBe("moderate");
      const cf = "counterfactualChoiceId" in g.singleBest ? g.singleBest.counterfactualChoiceId : null;
      expect(n.choices.some(c => c.id === cf && c.id !== n.keyChoiceId)).toBe(true);
      expect(g.deletionTest.actualResolution).toBeTruthy();
    }
  });

  it.each(packet.salvage.reviewQueue.map(row => [row.caseId, row] as const))("salvages only the exact skipped PASS as a self-contained single-node case: %s", (caseId, row) => {
    const receipt = dispositions.items.find(r => r.questionVariantId === row.questionVariantIds[0])!;
    expect(receipt.status).toBe("skipped");
    expect(receipt.evidence.item.verdict).toBe("PASS");
    expect(row.status).toBe("salvage");
    expect(row.newClinicalFacts).toEqual([]);
    const cs = b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_CASES.find(c => c.id === caseId)!;
    const sourceCase = packet.salvage.retainedMixedCases.find(c => c.id === row.sourceCaseId)!;
    expect(cs.presentation).toBe(sourceCase.presentation);
    expect(cs.displayName).toBe(sourceCase.displayName);
    expect(cs.prototypeDemographics).toEqual(sourceCase.prototypeDemographics);
    expect(cs.patientDisplayName).toBe(sourceCase.patientDisplayName);
    expect(cs.requiredClinicalSetting).toBe("clinic");
    expect(cs.decisionNodes.map(n => n.id)).toEqual(row.nodeIds);
    expect(cs.decisionNodes).toHaveLength(1);
    const n = packet.nodes.find(n => n.id === row.nodeIds[0])!;
    const old = packet.salvage.retainedSkippedNodes.find(o => o.id === n.id)!;
    expect(n.itemStatus).toBe("salvage");
    expect(n.sequenceIndex).toBe(0);
    expect(n.priorQuestionVariantIds).toEqual([]);
    for (const field of ["id", "questionVariantId", "conceptId", "contentVersion", "task", "currentUpdate", "exhibit", "choices", "keyChoiceId", "explanation", "evidenceClaimIds", "authorGate"] as const) expect(n[field], field).toEqual(old[field]);
    const context = b.traumaTopicReviewContext(n.questionVariantId);
    expect(context.priorObservations).toEqual([]);
    expect(context.priorFeedback).toEqual([]);
    expect(context.task).toContain(cs.patientDisplayName);
    expect(packet.cases.flatMap(c => c.nodeIds).filter(id => id === n.id)).toHaveLength(1);
    expect(cs.decisionNodes[0]!.terminalDispositions.map(d => d.answerChoiceId).sort()).toEqual(n.choices.filter(c => c.id !== n.keyChoiceId).map(c => c.id).sort());
    expect(packet.timingProposals.find(t => t.nodeId === n.id)!.caseId).toBe(caseId);
    expect(ledger.salvageMappings.cases.find(c => c.nodeId === n.id)?.caseId).toBe(caseId);
  });

  it("limits the salvage review queue to all three skipped topic PASS nodes and protects every accepted record", () => {
    const skipped = dispositions.items.filter(r => r.topic === "trauma-initial-abdomen" && r.status === "skipped");
    expect(packet.salvage.questionVariantIds.slice().sort()).toEqual(skipped.map(r => r.questionVariantId).sort());
    expect(fileSha(packet.salvage.acceptanceReceipt)).toBe(packet.salvage.acceptanceReceiptSha256);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_CASES).toHaveLength(3);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_QUESTIONS).toHaveLength(3);
    expect(validateSyntheticClinicalRelease(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_SOURCE_RELEASE).cases).toHaveLength(3);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_SOURCE_RELEASE.concepts).toHaveLength(3);
    expect(b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_TIMING_ENTRIES).toHaveLength(3);
    expect(packet.salvage.protectedAcceptedNodes).toHaveLength(9);
    for (const frozen of packet.salvage.protectedAcceptedNodes) expect(sha(packet.nodes.find(n => n.questionVariantId === frozen.questionVariantId))).toBe(frozen.sha256);
    for (const frozen of packet.salvage.protectedAcceptedCases) expect(sha(packet.cases.find(c => c.id === frozen.caseId))).toBe(frozen.sha256);
    expect(sha(ledger.sources)).toBe(packet.salvage.sourceAndClaimPreimageSha256.sources);
    expect(sha(ledger.claims)).toBe(packet.salvage.sourceAndClaimPreimageSha256.claims);
  });

  it("keeps all current clinical data unapproved and all five planning holds unkeyed", () => {
    for (const record of [...packet.nodes, ...packet.cases, ...packet.concepts, ...ledger.sources, ...ledger.claims, ...b.QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(packet.reviewDisplay).toBe("key shown first for review only");
    expect(packet.newUnkeyedHolds).toHaveLength(5);
    for (const h of packet.newUnkeyedHolds) {
      expect(h.nodeIds).toEqual([]); expect(h.variantIds).toEqual([]);
      expect(h.conceptId).toBeNull(); expect(h.caseId).toBeNull();
      expect(h.reason).toBeTruthy(); expect(h.nextAction).toBeTruthy();
    }
    expect(() => b.traumaTopicReviewContext("question.unknown.v1")).toThrow("Unknown active");
  });
});
