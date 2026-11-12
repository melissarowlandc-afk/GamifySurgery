import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import {
  VENTRAL_TOPIC_AUTHORING_CONCEPTS as authoringConcepts, VENTRAL_TOPIC_CASES as cases,
  VENTRAL_TOPIC_CLAIMS as claims, VENTRAL_TOPIC_COMPOSITION_PROPOSALS as compositions,
  VENTRAL_TOPIC_DEFINITIONS as definitions, VENTRAL_TOPIC_HELD_TEACHING_POINTS as holds,
  VENTRAL_TOPIC_MANIFEST as manifest, VENTRAL_TOPIC_QUESTIONS as questions,
  VENTRAL_TOPIC_REVIEW_RECORDS as reviews, VENTRAL_TOPIC_REUSED_CONCEPT_DEFINITIONS as reusedDefinitions,
  VENTRAL_TOPIC_SOURCE_LINKS as links, VENTRAL_TOPIC_SOURCE_RELEASE as preview,
  VENTRAL_TOPIC_SOURCES as sources, VENTRAL_TOPIC_TEST_ORDER_PROPOSALS as orders,
  VENTRAL_TOPIC_TIMING_ENTRIES as timings, VENTRAL_TOPIC_ROUND1_CASES as round1Cases,
  VENTRAL_TOPIC_ROUND1_QUESTIONS as round1Questions, VENTRAL_TOPIC_ROUND1_DEFINITIONS as round1Definitions,
  VENTRAL_TOPIC_ROUND1_CONCEPTS as round1Concepts, VENTRAL_TOPIC_ROUND1_REVIEW_RECORDS as round1Reviews,
  VENTRAL_TOPIC_ROUND1_TIMING_ENTRIES as round1Timings, VENTRAL_TOPIC_ROUND2_ATTEMPTS as attempts,
  VENTRAL_TOPIC_REVIEW_DISPOSITIONS as dispositions, VENTRAL_TOPIC_PASS_CASES as passCases,
  VENTRAL_TOPIC_PASS_QUESTIONS as passQuestions, VENTRAL_TOPIC_PASS_ONLY_RELEASE as passOnly,
} from "./question-topic-hernia-ventral-abdominal-wall-20261111";
const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const hash = (x: unknown) => createHash("sha256").update(typeof x === "string" ? x : JSON.stringify(x)).digest("hex");
const slug = "hernia-ventral-abdominal-wall";
const packet = JSON.parse(read("docs/research/question-topic-" + slug + "-20261111.json"));
const ledger = JSON.parse(read("docs/research/sources-question-topic-" + slug + "-20261111.json"));
const independent = JSON.parse(read("docs/research/question-topic-" + slug + "-review-20261111.json"));
const nodes = cases.flatMap(c => c.decisionNodes);

describe("ventral topic round-2 exact-review response", () => {
  it("admits only self-contained clinic cases and keeps PASS-only supply separate", () => {
    expect(validateSyntheticClinicalRelease(preview).cases).toHaveLength(13);
    expect(validateSyntheticClinicalRelease(passOnly).cases).toHaveLength(3);
    expect(nodes).toHaveLength(13);
    expect(new Set(nodes.map(n => n.questionVariantId)).size).toBe(13);
    expect(cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe("clinic"); expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.prototypeDemographics?.ageYears).toBeGreaterThan(17);
      expect(c.presentation.startsWith(c.patientDisplayName)).toBe(true);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      const n = c.decisionNodes[0]!;
      expect(n.shuffleAnswers).toBe(true); expect(n.answerChoices).toHaveLength(3);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(n.resultGateAfter).toBeNull(); expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      expect(n.terminalDispositions).toHaveLength(2);
    }
    expect(compositions.every(c => c.admissionSetting === "clinic" && !c.crossTopicScoredCompanions.length)).toBe(true);
    expect(compositions.every(c => c.nodeIds.length === 1)).toBe(true);
  });

  it("preserves every independently passed question, node and visible header exactly", () => {
    expect(hash(read(packet.reviewRound1Snapshot.reviewFile))).toBe(packet.reviewRound1Snapshot.reviewFileSha256);
    expect(independent.filter((r: { verdict: string }) => r.verdict === "PASS")).toHaveLength(3);
    for (const r of independent.filter((r: { verdict: string }) => r.verdict === "PASS")) {
      const oldQ = packet.reviewRound1Snapshot.questions.find((q: { id: string }) => q.id === r.id);
      const oldC = packet.reviewRound1Snapshot.cases.find((c: { decisionNodes: { questionVariantId: string }[] }) => c.decisionNodes.some(n => n.questionVariantId === r.id));
      const newC = passCases.find(c => c.decisionNodes.some(n => n.questionVariantId === r.id))!;
      expect(passQuestions.find(q => q.id === r.id)).toEqual(oldQ);
      expect(newC.decisionNodes[0]).toEqual(oldC.decisionNodes.find((n: { questionVariantId: string }) => n.questionVariantId === r.id));
      const { id: oldId, decisionNodes: oldNodes, learningSummary: oldSummary, ...oldHeader } = oldC;
      const { id: newId, decisionNodes: newNodes, learningSummary: newSummary, ...newHeader } = newC;
      expect(newHeader).toEqual(oldHeader);
      if (oldNodes.length === 1) expect(newC).toEqual(oldC);
      else {
        expect(newId).not.toBe(oldId); expect(newNodes).toHaveLength(1);
        expect(newSummary).toBe(newNodes[0]!.explanation);
        expect(oldSummary).not.toBe(newSummary);
      }
    }
    expect(passOnly.cases.map(c => c.id)).toEqual(passCases.map(c => c.id));
  });

  it("records exactly one concrete attempt per returned item and excludes every park", () => {
    expect(attempts).toHaveLength(20); expect(dispositions).toHaveLength(23);
    expect(dispositions.filter(d => d.status === "pass-preserved")).toHaveLength(3);
    expect(attempts.filter(a => a.status === "revised")).toHaveLength(10);
    expect(attempts.filter(a => a.status === "parked")).toHaveLength(10);
    expect(packet.reviewRound2.attempts).toEqual(attempts);
    expect(packet.reviewRound2.dispositions).toEqual(dispositions);
    expect(new Set(attempts.map(a => a.originalQuestionVariantId)).size).toBe(20);
    for (const a of attempts) {
      expect(a.revisionAttempt).toBe(1);
      expect(independent.find((r: { id: string }) => r.id === a.originalQuestionVariantId).verdict).toBe("REVISE");
      expect(a.caseDefinition.nodes).toHaveLength(1); expect(a.issueResponse.trim()).not.toBe("");
      expect(questions.some(q => q.id === a.originalQuestionVariantId)).toBe(false);
      const version2 = a.originalQuestionVariantId.replace(/\.v1$/, ".v2");
      if (a.status === "parked") {
        expect(a.parkReason!.length).toBeGreaterThan(100); expect(a.nextAction!.length).toBeGreaterThan(50);
        expect(questions.some(q => q.id === version2)).toBe(false);
        expect(a.caseDefinition.nodes[0]!.reasoning.difficulty).toContain("gate failed");
      } else {
        expect(questions.some(q => q.id === version2)).toBe(true);
        expect(reviews.find(r => r.questionVariantId === version2)!.independentReview.verdict).toBe("PENDING");
      }
    }
  });

  it("retains all round-1 definitions, whole cases and question versions unchanged", () => {
    for (const [actual, captured] of [[round1Cases, packet.reviewRound1Snapshot.cases], [round1Questions, packet.reviewRound1Snapshot.questions], [round1Definitions, packet.reviewRound1Snapshot.definitions], [round1Concepts, packet.reviewRound1Snapshot.concepts], [round1Reviews, packet.reviewRound1Snapshot.reviewRecords], [round1Timings, packet.reviewRound1Snapshot.timing]] as const) expect(actual).toEqual(captured);
    expect(round1Cases).toHaveLength(17); expect(round1Questions).toHaveLength(23);
    expect(reusedDefinitions).toEqual(packet.reusedConceptDefinitions);
    for (const c of reusedDefinitions) expect(round1Concepts.find(old => old.id === c.id)).toEqual(c);
    for (const before of packet.before) {
      for (const d of before.definitions) expect(hash(d.value)).toBe(d.sha256);
      for (const c of [...before.contexts, ...before.liveContexts]) expect(hash(c.value)).toBe(c.sha256);
      for (const q of before.caseOnlyQuestions ?? []) expect(hash(q.node)).toBe(q.sha256);
    }
    for (const input of [...packet.protectedInputs, ...packet.inputFiles]) expect(hash(read(input.file))).toBe(input.sha256);
    for (const ref of packet.assignment.frozenReferences.independentPass) for (const r of ref.reviewRecords) {
      expect(r.record.verdict).toBe("PASS"); expect(hash(read(r.file))).toBe(r.fileSha256);
    }
    expect(holds.some(h => h.id === "review.n4.ventral-posterior-layer-versus-fascial-closure.v1")).toBe(true);
  });

  it("keeps the original complete assignment and 52-row audit separate from review counts", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"]) expect(packet.assignment[key]).toEqual(program[key].filter((r: { primaryTopicSlug: string }) => r.primaryTopicSlug === slug));
    expect(packet.assignment.inventory).toHaveLength(52); expect(packet.assignment.concepts).toHaveLength(14);
    expect(packet.audit.map((r: { recordId: string }) => r.recordId).sort()).toEqual(packet.assignment.inventory.map((r: { recordId: string }) => r.recordId).sort());
    expect(packet.counts).toMatchObject({ auditedInventoryRows: 52, kept: 11, rewritten: 10, retiredAndReplacedProposed: 31, contextAuditRows: 51 });
    for (const a of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(a.verdict);
      expect(a.reasons.length).toBeGreaterThan(100); expect(a.fileLocation.file).toBeTruthy();
      expect(a.beforeVersionHashes.length + a.caseOnlyQuestionHashes.length).toBeGreaterThan(0);
      if (a.verdict !== "Keep") expect(round1Questions.some(q => q.id === a.replacementQuestionVariantId) || packet.assignment.inventory.some((r: { variantIds: string[] }) => r.variantIds.includes(a.replacementQuestionVariantId))).toBe(true);
    }
  });

  it("binds every current exact version, old reference and new meaning without migration", () => {
    expect(packet.proposals).toHaveLength(13); expect(manifest.reusedConceptIds).toHaveLength(8); expect(manifest.newMeaningIds).toHaveLength(4);
    for (const q of questions) {
      const p = packet.proposals.find((r: { questionVariantId: string }) => r.questionVariantId === q.id);
      expect(p.question).toEqual(q); expect(hash(q)).toBe(p.questionSha256);
      const c = cases.find(c => c.id === p.caseId)!;
      expect(p.clinicalCase).toEqual(c); expect(hash(c)).toBe(p.caseSha256);
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(q.supportingEvidenceClaimIds.every(id => claims.some(c => c.id === id))).toBe(true);
      if (p.itemStatus === "revised") expect(p.reviewBefore.question.id).toBe(q.id.replace(/\.v2$/, ".v1"));
    }
    for (const c of preview.concepts) {
      const old = round1Concepts.find(x => x.id === c.id);
      if (old) expect(c).toEqual(old);
      else expect(authoringConcepts.find(x => x.id === c.id)!.previousConceptIds.length).toBeGreaterThan(0);
    }
    const controlled = cases.find(c => c.decisionNodes[0]!.questionVariantId.includes("controlled-emergency-material.v2"))!;
    expect(controlled.earliestFacilityStage).toBe(3);
  });

  it("records concrete manual reasoning, discriminator, counterfactual and cue attacks", () => {
    for (const r of reviews) {
      const a = r.authorGate; expect(a.independent).toBe(false); expect(a.clinicalApproval).toBe(false); expect(a.twoConsequentialSteps).toHaveLength(2);
      for (const t of [...a.twoConsequentialSteps, a.coverTheKey, a.sameDecisionStageAndCategory, a.residentDifficultyPrediction, a.oneBestAnswer.decidingObservation, a.oneBestAnswer.closestError, a.oneBestAnswer.counterfactual, a.deletionTest, a.visibleSequenceAudit, a.repairAndRecheck]) expect(t.length).toBeGreaterThan(30);
      expect(a.distractorAudit).toHaveLength(2);
      for (const d of a.distractorAudit) {
        expect(d.temptation.length).toBeGreaterThan(20); expect(d.correctUnder.length).toBeGreaterThan(30); expect(d.whyNotHere.length).toBeGreaterThan(30);
        expect(d.claimIds.every(id => claims.some(c => c.id === id))).toBe(true);
      }
    }
    for (const a of attempts) for (const ch of a.caseDefinition.nodes[0]!.choices) expect(ch.claimIds.every(id => claims.some(c => c.id === id))).toBe(true);
  });

  it("keeps all clinical versions unapproved and performs no shared registration", () => {
    expect(manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false, publicReleaseAuthorized: false, questionCount: 13, independentPassCount: 3, revisedPendingCount: 10, parkedCount: 10, multipartCaseCount: 0 });
    for (const item of [...questions, ...claims, ...authoringConcepts, ...reviews, ...sources]) {
      expect(item.reviewStatus).toBe("needs_clinician_review"); expect(item.lastClinicianReview).toBeNull();
    }
    for (const path of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/question-ship-manifest.ts"]) expect(read(path)).not.toContain("question-topic-" + slug + "-20261111");
  });

  it("binds every testing choice including distractors to exact existing timing profiles", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timings).toHaveLength(13); expect(orders).toHaveLength(4);
    for (const e of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(e).success).toBe(true);
      const n = nodes.find(n => n.id === e.nodeId)!; expect(n.questionVariantId).toBe(e.questionVariantId);
      if (e.classification.kind === "test_choices") {
        expect(e.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.answerChoices.map(c => [c.id, c.label]));
        for (const c of e.classification.choices) if (c.timing.kind === "test") expect(profiles.has(c.timing.timingProfileId)).toBe(true);
      }
    }
    for (const c of definitions) for (const n of c.nodes) for (const ch of n.choices) if (ch.timing.kind === "test") expect(orders.some(o => o.questionVariantId.endsWith("." + n.slug + ".v2") && o.choiceId.endsWith("." + ch.id) && o.choiceLabel === ch.label)).toBe(true);
    expect(orders.every(o => o.disposition.kind === "not_executed" && o.disposition.reason === "future_planned")).toBe(true);
    expect(packet.integration.timingEntries).toEqual(timings); expect(packet.integration.testOrderProposals).toEqual(orders);
  });

  it("retains exact source records, atomic claims, safe links and current/historical maps", () => {
    expect(ledger.sources).toEqual(sources); expect(ledger.claims).toEqual(claims);
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(80); expect(s.authors.length).toBeGreaterThan(0); expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.accessedOn).toBe("2026-11-11"); expect(s.authorityAssessment.length).toBeGreaterThan(50); expect(s.licenseLabel.length).toBeGreaterThan(5);
      expect(s.evidenceClaimIds).toEqual(claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id));
    }
    for (const c of claims) {
      expect(c.lastCheckedOn).toBe("2026-11-11"); expect(c.limitation!.length).toBeGreaterThan(20); expect(c.sourceIds.every(id => sources.some(s => s.id === id))).toBe(true);
      expect(ledger.claimToQuestion.find((m: { claimId: string }) => m.claimId === c.id).questionIds).toEqual(questions.filter(q => q.supportingEvidenceClaimIds.includes(c.id)).map(q => q.id));
    }
    expect(ledger.statementMappings).toHaveLength(13); expect(ledger.parkedAttemptMappings).toHaveLength(10);
    expect(ledger.retainedRound1.claimToQuestion.length).toBeGreaterThan(0);
    expect(links.every(l => l.target === "_blank" && l.rel === "noopener noreferrer" && l.referrerPolicy === "no-referrer")).toBe(true);
  });
});
