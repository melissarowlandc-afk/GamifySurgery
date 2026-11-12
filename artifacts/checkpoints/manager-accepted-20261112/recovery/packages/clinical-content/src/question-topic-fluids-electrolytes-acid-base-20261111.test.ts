import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import { SYNTHETIC_CLINICAL_RELEASE, QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE } from "./synthetic-content";
import { QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS } from "./question-bank-batch2b-round2-20261104";
import { syntheticClinicalReleaseSchema } from "./schema";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const beforeImport = {
  release: sha(SYNTHETIC_CLINICAL_RELEASE),
  manifest: sha(QUESTION_SHIP_MANIFEST),
  timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
};
const topic = await import("./question-topic-fluids-electrolytes-acid-base-20261111");
const packet = topic.FLUIDS_TOPIC_PACKET;
const round = packet.reviewRound;
const ledger = topic.FLUIDS_TOPIC_SOURCE_LEDGER;
const readJson = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const proposal = (shortId: string) => packet.proposedNodes.find((item) => item.shortId === shortId)!;
const ph = (bicarbonate: number, pco2: number) => 6.1 + Math.log10(bicarbonate / (0.03 * pco2));
type VisibleContextCase = {
  id: string;
  presentation: string;
  runtimeFields: { approvedInstantiationProfiles: unknown };
  sequenceReview: { questionVariantId: string; priorFeedback: readonly string[] }[];
};
const visibleContext = (item: typeof packet.proposedNodes[number],
  clinicalCase: VisibleContextCase) => ({
  caseId: clinicalCase.id,
  presentation: clinicalCase.presentation,
  profile: clinicalCase.runtimeFields.approvedInstantiationProfiles,
  currentUpdate: item.currentUpdate,
  task: item.task,
  exhibit: item.exhibit,
  choices: item.choices.map(({ id, label }) => ({ id, label })),
  priorFeedback: clinicalCase.sequenceReview.find((entry) => entry.questionVariantId === item.questionVariantId)!.priorFeedback,
});

describe("fluids, electrolytes and acid-base independent-review response", () => {
  it("imports a valid clinic preview without mutating shared supply or registries", () => {
    expect({
      release: sha(SYNTHETIC_CLINICAL_RELEASE),
      manifest: sha(QUESTION_SHIP_MANIFEST),
      timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
    }).toEqual(beforeImport);
    expect(syntheticClinicalReleaseSchema.safeParse(topic.FLUIDS_TOPIC_SOURCE_RELEASE).success).toBe(true);
    expect(topic.FLUIDS_TOPIC_QUESTIONS).toHaveLength(11);
    expect(topic.FLUIDS_TOPIC_NODES).toHaveLength(11);
    expect(topic.FLUIDS_TOPIC_CASES).toHaveLength(11);
    expect(topic.FLUIDS_TOPIC_INTEGRATION.managerAcceptance).toBeNull();
  });

  it("reconciles the initial complete inventory, historical verdicts and exact before definitions", () => {
    const program = readJson("../../../docs/research/question-topic-program-20261111.json");
    for (const key of Object.keys(packet.assignment.completeAssignedRows)) {
      expect(packet.assignment.completeAssignedRows[key as keyof typeof packet.assignment.completeAssignedRows]).toEqual(
        program[key].filter((item: { primaryTopicSlug?: string }) => item.primaryTopicSlug === packet.assignment.slug));
    }
    const rows = packet.completeAudit.rows;
    expect(rows.map((row) => row.inventoryRecordId).sort()).toEqual(packet.completeAudit.assignedInventoryRecordIds.slice().sort());
    expect(new Set(rows.map((row) => row.variantIds[0])).size).toBe(36);
    expect(rows.reduce((sum, row) => sum + row.contextAudits.length, 0)).toBe(39);
    expect(round.originalCounts).toMatchObject({ auditedExactVariants: 36, kept: 3, rewritten: 3,
      retireAndReplaceProposed: 30, totalProposedQuestionVariants: 19, newQuestionVariants: 16 });
    for (const [verdict, count] of [["Keep", 3], ["Rewrite", 3], ["Retire-and-replace", 30]] as const)
      expect(rows.filter((row) => row.verdict === verdict)).toHaveLength(count);
    for (const row of rows) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.contextAudits.length).toBeGreaterThan(0);
      if (row.verdict !== "Keep") for (const id of row.replacementQuestionVariantIds)
        expect(round.originalProposedNodes.some((item) => item.questionVariantId === id)).toBe(true);
    }
    for (const item of [...packet.beforeDefinitions.questions, ...packet.beforeDefinitions.caseContexts]) {
      expect(sha(item.definition)).toBe(item.sha256);
      expect(item.origins.length).toBeGreaterThan(0);
    }
    expect(round.originalQuestionDefinitions).toHaveLength(19);
    expect(round.originalNodeDefinitions).toHaveLength(19);
    expect(round.originalRuntimeCases).toHaveLength(14);
    expect(topic.FLUIDS_TOPIC_RETAINED_QUESTIONS).toEqual(round.originalQuestionDefinitions);
    expect(topic.FLUIDS_TOPIC_RETAINED_NODES).toEqual(round.originalNodeDefinitions);
  });

  it("accounts for all 19 review decisions and all issue categories without self-assigning PASS", () => {
    const file = readFileSync(new URL("../../../" + round.reviewFile, import.meta.url), "utf8");
    expect(createHash("sha256").update(file).digest("hex")).toBe(round.reviewFileSha256);
    const decisions = JSON.parse(file) as typeof round.reviewDecisions;
    expect(round.reviewDecisions).toEqual(decisions);
    expect(round.reviewCounts).toEqual({ PASS: 3, REVISE: 16, FAIL: 0 });
    expect(new Set(round.dispositions.map((item) => item.id)).size).toBe(19);
    expect(round.dispositions.map((item) => item.id).sort()).toEqual(decisions.map((item) => item.id).sort());
    for (const [status, count] of [["pass-preserved", 3], ["revised", 8], ["parked", 8]] as const)
      expect(round.dispositions.filter((item) => item.status === status)).toHaveLength(count);
    for (const decision of decisions) {
      const disposition = round.dispositions.find((item) => item.id === decision.id)!;
      expect(disposition.originalVerdict).toBe(decision.verdict);
      expect(disposition.issueDispositions).toHaveLength(
        decision.clarityIssues.length + decision.cues.length + decision.fairness.length + decision.suggestions.length);
      expect(disposition.issueDispositions.every((item) => item.response.length > 40)).toBe(true);
      if (decision.verdict === "PASS") expect(disposition.status).toBe("pass-preserved");
      else expect(["revised", "parked"]).toContain(disposition.status);
    }
    expect(packet.counts).toMatchObject({ reviewed: 19, passPreserved: 3, revised: 8, parked: 8,
      activeQuestionVariants: 11, activeCases: 11, activeMultiDecisionCases: 0,
      revisedQuestionVersions: 8, newConceptVersions: 1, testingChoiceProposals: 14 });
  });

  it("pins exact PASS questions and nodes and permits only the authorized DKA case split", () => {
    const pins = {
      "potassium-provenance": ["1cee9e3c20b889930ebce2c8c3494d5a4eace6f530067b115d0581bc7e4b7569", "d1a551e77c524838c21cc91b6c2bedf71ffd7d63d4b3148c45facee2c666aaca"],
      "siad-fluid-plan": ["45110b099570fd74bd7785cc8f920ddce88f6113c00a4a4388b0b883b780f0cc", "b5817fa6fd0945598a4d74a730a3c7f3d94ddbb1637814152957e206dc0a2498"],
      "dka-resolution-transition": ["e17da93a4b6c4a09fd9ab7be7766db89b91dba51eaea490ee11709ac174cfde9", "8ca54365929f462df2e8a9586f14c73b3e3dea38d6ff5706c67271baf7decb0d"],
    } as const;
    for (const frozen of topic.FLUIDS_TOPIC_PASS_FREEZE) {
      const [questionHash, nodeHash] = pins[frozen.reviewId as keyof typeof pins];
      const question = topic.FLUIDS_TOPIC_QUESTIONS.find((item) => item.id === frozen.questionVariantId)!;
      const node = topic.FLUIDS_TOPIC_NODES.find((item) => item.id === frozen.nodeId)!;
      expect(sha(question)).toBe(questionHash);
      expect(sha(frozen.questionDefinition)).toBe(questionHash);
      expect(sha(node)).toBe(nodeHash);
      expect(sha(frozen.nodeDefinition)).toBe(nodeHash);
      expect(sha(frozen.caseDefinition)).toBe(frozen.caseSha256);
      expect(sha(visibleContext(frozen.proposal, frozen.caseProposal))).toBe(frozen.proposal.exactVisibleContextSha256);
      const currentCase = topic.FLUIDS_TOPIC_CASES.find((item) => item.decisionNodes.some((entry) => entry.id === node.id))!;
      if (frozen.reviewId !== "dka-resolution-transition") expect(currentCase).toEqual(frozen.caseDefinition);
      else {
        expect(currentCase).toEqual({ ...frozen.caseDefinition,
          id: "case.topic.fluids-electrolytes-acid-base.dka-transition-pass-standalone.r2", decisionNodes: [node] });
        expect(currentCase.approvedInstantiationProfiles).toEqual(frozen.caseDefinition.approvedInstantiationProfiles);
        expect(packet.caseDefinitions.find((item) => item.id === currentCase.id)!.sequenceReview[0]!.priorFeedback).toEqual([]);
      }
    }
    expect(round.standalonePassCases).toHaveLength(1);
    expect(sha(round.standalonePassCases[0]!.caseDefinition)).toBe(round.standalonePassCases[0]!.caseSha256);
  });

  it("preserves the older frozen PASS versions, source inputs and unresolved holds", () => {
    for (const frozen of packet.assignment.frozenPassAndClinicalApprovalReferences) {
      const question = QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS.find((item) => item.id === frozen.variantId)!;
      expect(frozen.questionDigests).toContain(sha(question));
      const clinicalCase = QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE.cases
        .find((item) => item.decisionNodes.some((node) => node.questionVariantId === frozen.variantId))!;
      expect(frozen.caseContextDigests).toContain(sha(clinicalCase));
      expect(packet.completeAudit.rows.find((row) => row.variantIds.includes(frozen.variantId))!.verdict).toBe("Keep");
      expect(topic.FLUIDS_TOPIC_QUESTIONS.some((item) => item.id === frozen.variantId)).toBe(false);
      expect(frozen.clinicalApproval).toBeNull();
    }
    const held = packet.completeAudit.rows.find((row) => row.variantIds[0] === "question.n1.respiratory-acidosis.v3")!;
    expect(held.sourceOrClinicalHolds).toContain("claim.n1r3.co2-ventilatory-response");
    expect(packet.assignment.additionalDiscoveredHolds[0]!.id).toBe("B2B32.numeric-albumin-correction-source-hold");
    const evolving = new Set(["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
      "packages/clinical-content/src/question-ship-manifest.ts"]);
    for (const captured of packet.assignment.baseline.inputHashChecks.filter((item) => !evolving.has(item.file))) {
      const data = readFileSync(new URL("../../../" + captured.file, import.meta.url), "utf8");
      expect(createHash("sha256").update(data).digest("hex"), captured.file).toBe(captured.sha256);
    }
    expect(packet.unkeyedDraftSlots[0]!.questionVariantId).toBeNull();
    expect(packet.withheldTeachingPoints).toHaveLength(4);
  });

  it("excludes parked items and prevents a mixed multi-node case from reaching the preview", () => {
    for (const parked of topic.FLUIDS_TOPIC_PARKED_ITEMS) {
      expect(parked.runtimeAdmission).toBe("excluded");
      expect(parked.reason.length).toBeGreaterThan(80);
      expect(parked.nextAction.length).toBeGreaterThan(50);
      expect(topic.FLUIDS_TOPIC_QUESTIONS.some((item) => item.id === parked.questionVariantId)).toBe(false);
      expect(topic.FLUIDS_TOPIC_NODES.some((item) => item.id === parked.nodeId)).toBe(false);
      expect(round.originalQuestionDefinitions.some((item) => item.id === parked.questionVariantId)).toBe(true);
      expect(packet.timingProposals.some((item) => item.questionVariantId === parked.questionVariantId)).toBe(false);
    }
    for (const clinicalCase of topic.FLUIDS_TOPIC_CASES) expect(clinicalCase.decisionNodes).toHaveLength(1);
    expect(new Set(topic.FLUIDS_TOPIC_CASES.flatMap((item) => item.decisionNodes.map((node) => node.id))).size).toBe(11);
    for (const revised of round.dispositions.filter((item) => item.status === "revised")) {
      expect(revised.afterQuestionVariantId).not.toBe(revised.beforeQuestionVariantId);
      expect(topic.FLUIDS_TOPIC_QUESTIONS.some((item) => item.id === revised.beforeQuestionVariantId)).toBe(false);
      expect(topic.FLUIDS_TOPIC_QUESTIONS.some((item) => item.id === revised.afterQuestionVariantId)).toBe(true);
    }
  });

  it("preserves seven revised meanings and explicitly versions the broader DKA construct", () => {
    expect(new Set(topic.FLUIDS_TOPIC_QUESTIONS.map((item) => item.id)).size).toBe(11);
    expect(new Set(topic.FLUIDS_TOPIC_CONCEPTS.map((item) => item.id)).size).toBe(11);
    for (const disposition of round.dispositions.filter((item) => item.status === "revised")) {
      const original = round.originalProposedNodes.find((item) => item.shortId === disposition.id)!;
      const current = proposal(disposition.id);
      if (disposition.id === "dka-potassium-sequence") {
        expect(current.conceptId).toBe("concept.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2");
        expect(current.previousConceptId).toBe(original.conceptId);
        expect(current.conceptId).not.toBe(original.conceptId);
      } else expect(current.conceptId).toBe(original.conceptId);
      expect(current.authorReviewState).toBe("self_checked_pending_rereview");
    }
    for (const item of [...packet.proposedNodes, ...topic.FLUIDS_TOPIC_QUESTIONS, ...topic.FLUIDS_TOPIC_CONCEPT_PROPOSALS,
      ...topic.FLUIDS_TOPIC_CLAIMS, ...topic.FLUIDS_TOPIC_SOURCES]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
    }
    expect(packet.identityAndHistory.registeredAndHistoricalCoverage.filter((item) => item.registryOnly)).toHaveLength(5);
  });

  it("binds named adult clinic profiles to randomized tasks without executing outside-record tests", () => {
    for (const clinicalCase of topic.FLUIDS_TOPIC_CASES) {
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.patientDisplayName).not.toContain("{");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      const demographic = clinicalCase.prototypeDemographics!;
      expect(demographic.ageYears).toBeGreaterThanOrEqual(18);
      expect(clinicalCase.presentation).toContain(demographic.ageYears + "-year-old");
      expect(clinicalCase.presentation).toContain(demographic.sexLabel === "Female" ? "woman" : "man");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      for (const profile of clinicalCase.approvedInstantiationProfiles!) {
        expect(profile.presentation).toBe(clinicalCase.presentation);
        expect(profile.prototypeDemographics).toEqual(demographic);
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.stem).toContain("{patientName}");
        expect(node.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(node.answerChoices.length).toBeLessThanOrEqual(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      }
    }
  });

  it("maps all 14 testing choices and distractors by exact choice identity and label", () => {
    let testingChoices = 0;
    for (const item of packet.proposedNodes) {
      const timing = topic.FLUIDS_TOPIC_TIMING_PROPOSALS.find((entry) => entry.questionVariantId === item.questionVariantId)!;
      expect(timing.caseId).toBe(item.caseId);
      expect(timing.nodeId).toBe(item.nodeId);
      const tests = item.choices.filter((choice) => choice.testingChoice);
      testingChoices += tests.length;
      if (!tests.length) { expect(timing.classification.kind).toBe("no_test"); continue; }
      expect(timing.classification.kind).toBe("test_choices");
      if (timing.classification.kind !== "test_choices") throw new Error("Missing test mapping");
      expect(timing.classification.choices.map((entry) => [entry.choiceId, entry.choiceLabel]))
        .toEqual(item.choices.map((choice) => [choice.id, choice.label]));
      for (const choice of item.choices) {
        const mapped = timing.classification.choices.find((entry) => entry.choiceId === choice.id)!;
        if (!choice.testingChoice) { expect(mapped.timing.kind).toBe("no_test"); continue; }
        expect(mapped.timing.kind).toBe("test");
        if (mapped.timing.kind === "test") expect(getDiagnosticTimingProfileMapping(mapped.timing.timingProfileId)).toBeDefined();
        const order = topic.FLUIDS_TOPIC_ORDER_PROPOSALS.find((entry) => entry.questionVariantId === item.questionVariantId && entry.choiceId === choice.id)!;
        expect(order.choiceLabel).toBe(choice.label);
        expect(order.caseId).toBe(item.caseId);
        expect(order.nodeId).toBe(item.nodeId);
        expect(order.execution).toBe("none");
        expect(order.serviceRequest).toBeNull();
        expect(order.resultGateAfter).toBeNull();
      }
    }
    expect(testingChoices).toBe(14);
    expect(topic.FLUIDS_TOPIC_ORDER_PROPOSALS).toHaveLength(14);
    expect(round.originalTimingProposals).toHaveLength(19);
    expect(round.originalOrderProposals).toHaveLength(16);
  });

  it("keeps bidirectional evidence mappings, article-specific rights and safe source links", () => {
    expect(ledger.sources).toHaveLength(11);
    expect(ledger.evidenceClaims).toHaveLength(48);
    expect(ledger.reviewRound.originalSourceRecords).toHaveLength(10);
    expect(ledger.reviewRound.originalEvidenceClaims).toHaveLength(42);
    expect(ledger.reviewRound.originalQuestionToClaimMappings).toHaveLength(19);
    expect(ledger.questionToClaimMappings).toHaveLength(11);
    for (const question of topic.FLUIDS_TOPIC_QUESTIONS) {
      const forward = ledger.questionToClaimMappings.find((item) => item.questionVariantId === question.id)!;
      expect(forward.claimIds).toEqual(question.supportingEvidenceClaimIds);
      for (const id of question.supportingEvidenceClaimIds) {
        const claim = ledger.evidenceClaims.find((item) => item.id === id)!;
        expect(claim).toBeDefined();
        expect(claim.lastCheckedOn).toBe("2026-11-11");
        expect(claim.limitation.length).toBeGreaterThan(0);
        expect(ledger.claimToQuestionMappings.find((item) => item.claimId === id)!.questionVariantIds).toContain(question.id);
        for (const sourceId of claim.sourceIds) expect(ledger.sources.find((item) => item.id === sourceId)!.evidenceClaimIds).toContain(id);
      }
    }
    for (const source of ledger.sources) {
      for (const field of [source.completeCitation, source.organizationOrJournal, source.licenseLabel,
        source.reuseNotes, source.authorityAssessment, source.officialUrl]) expect(field.length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-11");
    }
    const sterns = ledger.sources.find((item) => item.id.endsWith("sterns-2024"))!;
    expect(sterns.doi).toBe("10.2215/CJN.0000000000000244");
    expect(sterns.reuseStatus).toBe("cc_by_4_0");
    expect(sterns.reuseNotes).toContain("Article-specific");
    for (const link of topic.FLUIDS_TOPIC_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });

  it("independently calculates revised boundaries and checks the constructed gas trajectories", () => {
    const gap = proposal("current-corrected-gap").exhibit;
    expect(gap.caption).toContain("AG + 0.25 * (40 - albumin in g/L)");
    const [sodium, chloride] = gap.cells[0]![0]!.split(" / ").map(Number);
    const bicarbonate = Number(gap.cells[1]![0]);
    const albumin = Number(gap.cells[2]![0]);
    const rawGap = sodium! - chloride! - bicarbonate;
    expect(rawGap).toBe(12);
    expect(rawGap + 0.25 * (40 - albumin)).toBe(18);
    expect(rawGap + 0.25 * (40 - 40)).toBeLessThanOrEqual(16);
    const hhs = proposal("hhs-tonicity-response").exhibit;
    expect((Number(hhs.cells[0]![0]) - Number(hhs.cells[0]![1])) / 2).toBe(4);
    expect((Number(hhs.cells[2]![0]) - Number(hhs.cells[2]![1])) / 2).toBe(3);
    expect(Number(hhs.cells[1]![1])).toBeGreaterThan(Number(hhs.cells[1]![0]));
    const sodiumResponse = proposal("hyponatraemia-relowering").exhibit;
    expect(Number(sodiumResponse.cells[0]![0])).toBeLessThanOrEqual(120);
    expect(Number(sodiumResponse.cells[0]![1]) - Number(sodiumResponse.cells[0]![0])).toBe(11);
    expect(11).toBeGreaterThan(8);
    const mixed = proposal("mixed-gas-reassessment").exhibit;
    for (const column of [0, 1]) expect(ph(Number(mixed.cells[2]![column]), Number(mixed.cells[1]![column])))
      .toBeCloseTo(Number(mixed.cells[0]![column]), 2);
    const expected = 1.5 * Number(mixed.cells[2]![1]) + 8;
    expect(expected).toBe(32);
    expect(Number(mixed.cells[1]![0])).toBeLessThan(expected - 2);
    expect(Number(mixed.cells[1]![1])).toBeGreaterThan(expected + 2);
    const gastric = proposal("gastric-chloride-replacement").exhibit;
    const [gasPh, co2] = gastric.cells[0]![0]!.split(" / ").map((value) => Number(value.replace(" mmHg", "")));
    const alkali = Number(gastric.cells[1]![0]!.split(" / ")[0]);
    expect(ph(alkali, co2!)).toBeCloseTo(gasPh!, 2);
  });

  it("retains concrete author attacks, counterfactuals, matrix balance and exact context bindings", () => {
    for (const item of packet.proposedNodes) {
      const clinicalCase = packet.caseDefinitions.find((entry) => entry.id === item.caseId)!;
      const binding = round.activeContextBindings.find((entry) => entry.reviewId === item.shortId)!;
      expect(sha(visibleContext(item, clinicalCase))).toBe(binding.currentVisibleContextSha256);
      if (item.shortId === "dka-resolution-transition") {
        expect(binding.currentVisibleContextSha256).not.toBe(item.exactVisibleContextSha256);
        expect(binding.originalReviewedContextSha256).toBe(item.exactVisibleContextSha256);
        continue;
      }
      expect(binding.currentVisibleContextSha256).toBe(item.exactVisibleContextSha256);
      if (binding.status !== "revised") continue;
      const gate = item.manualAuthorGate;
      expect(gate.exactContextSha256).toBe(item.exactVisibleContextSha256);
      expect(gate.reasoningSteps).toHaveLength(2);
      for (const value of [gate.coverTheKeyCueAttack, gate.stageAndCategory, gate.difficultyPrediction,
        gate.bestAnswerBoundary, gate.deletionAndCounterfactual, gate.sequenceReview]) expect(value.length).toBeGreaterThan(40);
      expect(clinicalCase.sequenceReview[0]!.priorFeedback).toEqual([]);
      for (const distractor of item.choices.filter((choice) => !choice.isCorrect)) {
        expect(distractor.temptation!.length).toBeGreaterThan(15);
        expect(distractor.counterfactualWhereReasonable!.length).toBeGreaterThan(25);
      }
    }
    for (const shortId of ["hyperkalaemia-substrate", "dka-potassium-sequence"]) {
      const labels = proposal(shortId).choices.map((choice) => choice.label);
      expect(labels).toHaveLength(4);
      const principal = shortId === "hyperkalaemia-substrate" ? "IV insulin-glucose" : "IV insulin";
      const second = shortId === "hyperkalaemia-substrate" ? "subsequent glucose" : "Replace potassium first";
      expect(labels.filter((label) => label.includes(principal))).toHaveLength(2);
      expect(labels.filter((label) => label.includes(second))).toHaveLength(2);
    }
  });
});
