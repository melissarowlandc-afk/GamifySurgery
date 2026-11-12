import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema } from "./schema";
import { SYNTHETIC_CLINICAL_RELEASE, QUESTION_CATALOG_RELEASE } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const rootFile = (path: string) => readFileSync(new URL("../../../" + path, import.meta.url), "utf8");
const currentPacket = JSON.parse(rootFile("docs/research/question-topic-critical-shock-resuscitation-20261111.json"));
const packet = currentPacket.round2ReviewedSnapshot ?? currentPacket;
const ledger = JSON.parse(rootFile("docs/research/sources-question-topic-critical-shock-resuscitation-20261111.json"));
const acceptancePacket = JSON.parse(rootFile("docs/research/question-topic-acceptance-batch1-packet-20261111.json"));
const acceptanceDispositions = JSON.parse(rootFile("docs/research/question-topic-acceptance-batch1-dispositions-20261111.json"));
const reviewPath = "docs/research/question-topic-critical-shock-resuscitation-review-20261111.json";
const reviewText = rootFile(reviewPath);
const review = JSON.parse(reviewText) as Array<{ id: string; verdict: string }>;
const before = {
  live: sha(SYNTHETIC_CLINICAL_RELEASE),
  catalog: sha(QUESTION_CATALOG_RELEASE),
  manifest: sha(QUESTION_SHIP_MANIFEST),
  timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
};
const topic = await import("./question-topic-critical-shock-resuscitation-20261111");
const frozen = [
  ["choose-valid-fluid-test", "886d87db7bc1d68e9a80ba218f11f5af8ab51177be1d6b0d5b7c7bc4d1309c5a"],
  ["response-versus-fluid-risk", "7a3344ad53401ce6cec8c8c703c276540d2e8810a325f0eeee69777c38a75055"],
  ["inotrope-after-pressure-restored", "bb6ddf3d9dfc96631785adfe4a816b6c7df9427594f621f22e25e5e8a3de1046"],
  ["lactate-perfusion-discordance", "fe6090509b8a8511122ffa86dbee4b8a8f21e040e71cba6ca7bbb2d6b43f6e47"],
];

describe("shock-resuscitation round 2 and exact independent PASS retention", () => {
  it("validates the explicit current stage and preserves shared release objects on import", () => {
    expect({
      live: sha(SYNTHETIC_CLINICAL_RELEASE),
      catalog: sha(QUESTION_CATALOG_RELEASE),
      manifest: sha(QUESTION_SHIP_MANIFEST),
      timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
    }).toEqual(before);
    expect(syntheticClinicalReleaseSchema.parse(topic.SHOCK_TOPIC_ROUND2_SOURCE_RELEASE)).toEqual(topic.SHOCK_TOPIC_ROUND2_SOURCE_RELEASE);
    // Historical census receipts stay exact as other topic batches are integrated.
    // Live import invariance is checked above; exact accepted topic cases below.
    expect(packet.validation.sourceIntegrity.defaultRelease).toEqual({
      cases: 1151, nodes: 1462, concepts: 610, manifestRows: 145,
      sha256: "b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48",
    });
    expect(acceptancePacket.counts.after).toEqual({
      cases: 1167, nodes: 1482, registeredMeanings: 631, scoredMeanings: 475,
      acceptedRows: 167, timingRows: 2317,
    });
    expect(acceptancePacket.hashes.defaultAfter).toBe("7cc62b6e5d9c79133a163bfee8bf810d01a430aa28760d1265b02807b799dee8");
  });

  it("retains every original definition and original claim for frozen history", () => {
    expect(sha(topic.SHOCK_TOPIC_CASES)).toBe("ab2e831e0d9ee2d3128624f3e7a58e7c0493781e446162331dbfdc9afb510704");
    expect(sha(topic.SHOCK_TOPIC_QUESTIONS)).toBe("a0d092066070a4c548557d01e994f4ba5233faaabe5e12337001752646411df8");
    expect(sha(topic.SHOCK_TOPIC_CLAIMS)).toBe("c2f675f9ea5d9d1dc830fec0e636ce1f02bf63b805bb5a1ca0e0011eaf1a0cf5");
    expect(topic.SHOCK_TOPIC_CASES).toEqual(packet.round1ReviewedSnapshot.cases);
    expect(topic.SHOCK_TOPIC_QUESTIONS).toEqual(packet.round1ReviewedSnapshot.questions);
    expect(topic.SHOCK_TOPIC_TIMING_ENTRIES).toEqual(packet.round1ReviewedSnapshot.timingProposals);
    expect(topic.SHOCK_TOPIC_SOURCES).toEqual(ledger.round1ReviewedSnapshot.sources);
    expect(topic.SHOCK_TOPIC_CLAIMS).toEqual(ledger.round1ReviewedSnapshot.claims);
  });

  it.each(frozen)("preserves the exact reviewed context and current node for %s", (slug, digest) => {
    const question = topic.SHOCK_TOPIC_QUESTIONS.find((candidate) => candidate.id.endsWith("." + slug + ".v1"))!;
    const clinicalCase = topic.SHOCK_TOPIC_CASES.find((candidate) => candidate.decisionNodes.some((node) => node.questionVariantId === question.id))!;
    const node = clinicalCase.decisionNodes.find((candidate) => candidate.questionVariantId === question.id)!;
    expect(sha({ clinicalCase, node, question })).toBe(digest);
    const currentCase = topic.SHOCK_TOPIC_ROUND2_CASES.find((candidate) => candidate.decisionNodes.some((candidateNode) => candidateNode.questionVariantId === question.id))!;
    expect(currentCase.decisionNodes.find((candidate) => candidate.id === node.id)).toEqual(node);
    expect(topic.SHOCK_TOPIC_ROUND2_QUESTIONS.find((candidate) => candidate.id === question.id)).toEqual(question);
    for (const key of ["patientDisplayName", "patientPresentationVariantId", "prototypeDemographics", "chiefComplaint", "presentation", "approvedInstantiationProfiles", "requiredClinicalSetting", "requiredCapabilityIds", "earliestFacilityStage"] as const) {
      expect(currentCase[key]).toEqual(clinicalCase[key]);
    }
    expect(topic.SHOCK_TOPIC_ROUND2_REVIEW_DISPOSITIONS.find((row) => row.questionVariantId === question.id)!.status).toBe("pass-preserved");
  });

  it("binds every disposition to the supplied independent review", () => {
    expect(createHash("sha256").update(reviewText).digest("hex")).toBe(topic.SHOCK_TOPIC_INDEPENDENT_REVIEW.sha256);
    expect(review.filter((row) => row.verdict === "PASS")).toHaveLength(4);
    expect(review.filter((row) => row.verdict === "REVISE")).toHaveLength(7);
    const dispositions = topic.SHOCK_TOPIC_ROUND2_REVIEW_DISPOSITIONS;
    expect(dispositions).toHaveLength(11);
    expect(new Set(dispositions.map((row) => row.reviewedQuestionVariantId))).toEqual(new Set(review.map((row) => row.id)));
    expect(dispositions.filter((row) => row.status === "pass-preserved")).toHaveLength(4);
    expect(dispositions.filter((row) => row.status === "revised")).toHaveLength(4);
    expect(dispositions.filter((row) => row.status === "parked")).toHaveLength(3);
    for (const row of dispositions) {
      expect(row.independentPassAppliesToCurrentNode).toBe(review.find((entry) => entry.id === row.reviewedQuestionVariantId)!.verdict === "PASS");
      expect(row.clinicalReviewStatus).toBe("needs_clinician_review");
    }
    expect(packet.counts).toEqual({
      reviewed: 11,
      passPreserved: 4,
      revised: 4,
      parked: 3,
      activeQuestions: 8,
      activeCases: 4,
      existingMeaningRevisions: 3,
      newMeaningVersions: 1,
    });
  });

  it("gives all seven returned items exactly one recorded attempt", () => {
    const returnedIds = review.filter((row) => row.verdict !== "PASS").map((row) => row.id);
    const attempts = packet.revisionRound.attempts as Array<{ reviewedQuestionVariantId: string; attemptNumber: number; status: string }>;
    expect(attempts).toHaveLength(7);
    expect(new Set(attempts.map((attempt) => attempt.reviewedQuestionVariantId))).toEqual(new Set(returnedIds));
    for (const attempt of attempts) {
      expect(attempt.attemptNumber).toBe(1);
      expect(["revised", "parked"]).toContain(attempt.status);
    }
  });

  it("removes parked questions from the current stage while retaining complete repair attempts", () => {
    expect(topic.SHOCK_TOPIC_ROUND2_PARKED_ATTEMPTS).toHaveLength(3);
    for (const attempt of topic.SHOCK_TOPIC_ROUND2_PARKED_ATTEMPTS) {
      expect(attempt.questionVariantId).toBeNull();
      expect(attempt.reviewStatus).toBe("needs_clinician_review");
      expect(attempt.lastClinicianReview).toBeNull();
      expect(attempt.attemptedChoices).toHaveLength(3);
      expect(attempt.repairAttempt.length).toBeGreaterThan(60);
      expect(attempt.gateResult.length).toBeGreaterThan(60);
      expect(attempt.reason.length).toBeGreaterThan(60);
      expect(topic.SHOCK_TOPIC_QUESTIONS.some((question) => question.id === attempt.previousQuestionVariantId)).toBe(true);
      expect(topic.SHOCK_TOPIC_ROUND2_QUESTIONS.some((question) => question.id === attempt.previousQuestionVariantId)).toBe(false);
      const packetRow = packet.reviewItems.find((row: { reviewedQuestionVariantId: string }) => row.reviewedQuestionVariantId === attempt.previousQuestionVariantId);
      expect(packetRow.status).toBe("parked");
      expect(packetRow.parkedAttempt).toEqual(attempt);
      expect(packetRow.after).toBeNull();
      expect(packetRow.proposedQuestionVariantId).toBeNull();
    }
  });

  it("versions revised questions and the materially changed imaging meaning", () => {
    expect(topic.SHOCK_TOPIC_ROUND2_REVISED_QUESTIONS).toHaveLength(4);
    for (const question of topic.SHOCK_TOPIC_ROUND2_REVISED_QUESTIONS) expect(question.id).toMatch(/\.v2$/);
    const echo = topic.SHOCK_TOPIC_ROUND2_REVISED_QUESTIONS.find((question) => question.id.includes(".echo-for-persistent-shock."))!;
    expect(echo.conceptId).toBe("concept.critical-shock-resuscitation.echo-for-persistent-shock.v2");
    expect(topic.SHOCK_TOPIC_CONCEPTS.some((concept) => concept.id === echo.conceptId)).toBe(false);
    expect(topic.SHOCK_TOPIC_ROUND2_CONCEPTS.find((concept) => concept.id === echo.conceptId)!.learningObjective).toContain("limits");
    for (const question of topic.SHOCK_TOPIC_ROUND2_REVISED_QUESTIONS.filter((candidate) => candidate.id !== echo.id)) {
      expect(topic.SHOCK_TOPIC_CONCEPTS.some((concept) => concept.id === question.conceptId)).toBe(true);
    }
    expect(packet.identityDecisions.filter((decision: { previousConceptId: string | null }) => decision.previousConceptId !== null)).toHaveLength(1);
  });

  it("retains natural case composition and makes the later PASS context dependency explicit", () => {
    expect(topic.SHOCK_TOPIC_ROUND2_CASES.map((clinicalCase) => clinicalCase.decisionNodes.length)).toEqual([2, 3, 2, 1]);
    expect(topic.SHOCK_TOPIC_ROUND2_CASES[0]).toEqual(topic.SHOCK_TOPIC_CASES[0]);
    for (const clinicalCase of topic.SHOCK_TOPIC_ROUND2_CASES) {
      const nodes = clinicalCase.decisionNodes;
      expect(new Set(nodes.map((node) => node.primaryConceptId)).size).toBe(nodes.length);
      for (const node of nodes.slice(0, -1)) expect(node.terminalDispositions).toEqual([]);
      expect(nodes.at(-1)!.terminalDispositions).toHaveLength(2);
    }
    const laterPass = topic.SHOCK_TOPIC_ROUND2_REVIEW_DISPOSITIONS.find((row) => row.reviewedQuestionVariantId.includes(".inotrope-after-pressure-restored."))!;
    expect(laterPass.caseCompositionReviewRequired).toBe(true);
    expect(packet.revisionRound.sequenceRecheck.length).toBeGreaterThan(0);
  });

  it("retains finite patient identity and separate clinical/progression metadata", () => {
    for (const clinicalCase of topic.SHOCK_TOPIC_ROUND2_CASES) {
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(clinicalCase.prototypeDemographics!.ageYears + "-year-old");
      expect(clinicalCase.presentation).toContain("clinic teaching consultation");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.presentation).toEqual(clinicalCase.presentation);
    }
    for (const row of packet.presentationReviews) {
      expect(row.educationalTier).toBe("advanced_resident");
      expect(row.patientAcuity).toBe("obvious_emergency");
      expect(row.facilityProgressionLevel).toBe(4);
      expect(row.simulationWeight).toBeNull();
      expect(row.reviewStatus).toBe("needs_clinician_review");
    }
  });

  it("keeps current and retained exact timing records aligned with their own version labels", () => {
    expect(topic.SHOCK_TOPIC_ROUND2_TIMING_ENTRIES).toHaveLength(8);
    expect(topic.SHOCK_TOPIC_TIMING_ENTRIES).toEqual(packet.round1ReviewedSnapshot.timingProposals);
    const known = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map((profile) => profile.id));
    const testChoices: string[] = [];
    for (const entry of topic.SHOCK_TOPIC_ROUND2_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const clinicalCase = topic.SHOCK_TOPIC_ROUND2_CASES.find((candidate) => candidate.id === entry.caseId)!;
      const node = clinicalCase.decisionNodes.find((candidate) => candidate.id === entry.nodeId)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(3);
        for (const choice of entry.classification.choices) {
          expect(node.answerChoices.find((candidate) => candidate.id === choice.choiceId)!.label).toBe(choice.choiceLabel);
          expect(choice.timing.kind).toBe("test");
          if (choice.timing.kind === "test") expect(known.has(choice.timing.timingProfileId)).toBe(true);
          testChoices.push(choice.choiceId);
        }
      }
    }
    expect(testChoices).toHaveLength(9);
    expect(new Set(testChoices).size).toBe(9);
    expect(topic.SHOCK_TOPIC_ROUND2_TEST_ORDER_PROPOSALS).toHaveLength(9);
    for (const order of topic.SHOCK_TOPIC_ROUND2_TEST_ORDER_PROPOSALS) expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
  });

  it("maintains reciprocal claim mappings and original verification dates", () => {
    expect(ledger.sources).toEqual(topic.SHOCK_TOPIC_ROUND2_SOURCES);
    expect(ledger.claims).toEqual(topic.SHOCK_TOPIC_ROUND2_CLAIMS);
    expect(ledger.sources).toHaveLength(9);
    expect(ledger.claims).toHaveLength(31);
    for (const claim of topic.SHOCK_TOPIC_ROUND2_CLAIMS) {
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.lastClinicianReview).toBeNull();
      expect(claim.limitation).toBeTruthy();
      for (const id of claim.sourceIds) expect(topic.SHOCK_TOPIC_ROUND2_SOURCES.find((source) => source.id === id)!.evidenceClaimIds).toContain(claim.id);
    }
    for (const source of topic.SHOCK_TOPIC_ROUND2_SOURCES) for (const claimId of source.evidenceClaimIds) {
      expect(topic.SHOCK_TOPIC_ROUND2_CLAIMS.find((claim) => claim.id === claimId)!.sourceIds).toContain(source.id);
    }
    expect(ledger.questionToClaim).toEqual(topic.SHOCK_TOPIC_ROUND2_STATEMENT_MAPPINGS);
    for (const question of topic.SHOCK_TOPIC_ROUND2_QUESTIONS) {
      const mapping = topic.SHOCK_TOPIC_ROUND2_STATEMENT_MAPPINGS.find((row) => row.questionVariantId === question.id)!;
      expect(mapping.evidenceClaimIds).toEqual(question.supportingEvidenceClaimIds);
      for (const id of question.supportingEvidenceClaimIds) expect(topic.SHOCK_TOPIC_ROUND2_CLAIMS.some((claim) => claim.id === id)).toBe(true);
      for (const choice of mapping.choices) for (const id of choice.evidenceClaimIds) expect(question.supportingEvidenceClaimIds).toContain(id);
    }
  });

  it("keeps evidence rights and authority independent and supplies safe source links", () => {
    for (const source of topic.SHOCK_TOPIC_ROUND2_SOURCES) {
      for (const key of ["completeCitation", "organizationOrJournal", "authors", "publicationYear", "officialUrl", "accessedOn", "sourceClass", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment"] as const) expect(source[key]).toBeTruthy();
      expect(source.accessedOn).toBe("2026-11-11");
    }
    for (const link of topic.SHOCK_TOPIC_ROUND2_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });

  it("makes original and revised review contexts, keys and hashes independently inspectable", () => {
    expect(packet.reviewItems).toHaveLength(11);
    for (const row of packet.reviewItems) {
      const old = packet.round1ReviewedSnapshot.reviewItems.find((candidate: { questionVariantId: string }) => candidate.questionVariantId === row.reviewedQuestionVariantId);
      expect(row.before.question).toEqual(old.after.question);
      expect(row.before.runtimeNode).toEqual(old.after.runtimeNode);
      if (row.status === "parked") continue;
      const clinicalCase = topic.SHOCK_TOPIC_ROUND2_CASES.find((candidate) => candidate.id === row.caseId)!;
      const nodeIndex = clinicalCase.decisionNodes.findIndex((node) => node.id === row.nodeId);
      const node = clinicalCase.decisionNodes[nodeIndex]!;
      const question = topic.SHOCK_TOPIC_ROUND2_QUESTIONS.find((candidate) => candidate.id === row.proposedQuestionVariantId)!;
      expect(row.after.question).toEqual(question);
      expect(row.after.runtimeNode).toEqual(node);
      expect(row.versionHash).toBe(sha({ clinicalCase, node, question }));
      expect(row.visibleContextBeforeAnswer.priorQuestionVariantIds).toEqual(clinicalCase.decisionNodes.slice(0, nodeIndex).map((previous) => previous.questionVariantId));
      expect(row.visibleContextBeforeAnswer.priorFeedback).toEqual(clinicalCase.decisionNodes.slice(0, nodeIndex).map((previous) => previous.explanation));
      expect(row.reviewDisplay).toBe("key shown first for review only");
      expect(row.keyFirstReviewChoices[0].isCorrect).toBe(true);
    }
  });

  it("retains the round-2 clinical review history and recognizes the later batch-1 acceptance", () => {
    expect(packet.independentReview.status).toBe("partial_pass_revisions_pending");
    expect(packet.clinicalReview.status).toBe("needs_clinician_review");
    expect(packet.clinicalReview.reviewer).toBe("Melissa Rowland");
    for (const question of topic.SHOCK_TOPIC_ROUND2_QUESTIONS) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      const accepted = acceptanceDispositions.items.some((row: { questionVariantId: string; status: string }) => row.questionVariantId === question.id && row.status === "accepted");
      if (accepted) expect(topicQuestionAcceptance(question.id).accepted).toBe(true);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.questionVariantId === question.id))).toBe(topicQuestionAcceptance(question.id).live);
    }
    expect(packet.parkedItems).toHaveLength(3);
    expect(packet.newUnkeyedSlots).toHaveLength(1);
  });

  it.each(topic.SHOCK_TOPIC_ROUND2_REVISIONS)("checks the revised author gate and exact options for $slug", (item) => {
    const question = topic.SHOCK_TOPIC_ROUND2_REVISED_QUESTIONS.find((candidate) => candidate.stem === item.task)!;
    const clinicalCase = topic.SHOCK_TOPIC_ROUND2_CASES.find((candidate) => candidate.decisionNodes.some((node) => node.questionVariantId === question.id))!;
    const node = clinicalCase.decisionNodes.find((candidate) => candidate.questionVariantId === question.id)!;
    const check = topic.SHOCK_TOPIC_ROUND2_SELF_CHECKS.find((candidate) => candidate.questionVariantId === question.id)!;
    expect(node.shuffleAnswers).toBe(true);
    expect(node.stem).toContain("{patientName}");
    expect(node.answerChoices).toHaveLength(3);
    expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    expect(node.answerChoices.find((choice) => choice.isCorrect)!.id).toContain("." + item.keyChoice + ".v2");
    expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
    expect(node.resultGateAfter).toBeNull();
    expect(check.independent).toBe(false);
    expect(check.clinicalApproval).toBe(false);
    expect(check.measuredDifficulty).toBe(false);
    for (const text of [check.coverTheKey, check.oneStageAndCategory, ...check.twoConsequentialSteps, check.residentDifficulty, check.singleBestAnswer, check.deletionTest, check.decisionChangingCounterfactual, check.sequenceAudit, check.repairAndRecheck]) expect(text.length).toBeGreaterThan(40);
    expect(node.answerChoices.some((choice) => choice.id === check.closestChoiceId && !choice.isCorrect)).toBe(true);
    expect(node.answerChoices.some((choice) => choice.id === check.counterfactualChoiceId && !choice.isCorrect)).toBe(true);
    for (const choice of item.choices) {
      expect(choice.rationale).toBeTruthy();
      expect(choice.temptation).toBeTruthy();
      expect(choice.correctUnder).toBeTruthy();
      expect(choice.claimSlugs.length).toBeGreaterThan(0);
      expect(choice.label).not.toMatch(/\balone\b|individualized|tailored|shared.decision/i);
    }
  });
});

describe("batch-1 skipped PASS salvage", () => {
  it("submits exactly the three skipped topic PASS nodes for context review", () => {
    const skipped = acceptanceDispositions.items.filter((row: { topic: string; status: string; evidence: { item: { verdict: string } } }) =>
      row.topic === topic.SHOCK_TOPIC_SLUG && row.status === "skipped" && row.evidence.item.verdict === "PASS");
    const expectedIds = skipped.map((row: { questionVariantId: string }) => row.questionVariantId).sort();
    expect(expectedIds).toHaveLength(3);
    expect(topic.SHOCK_TOPIC_SALVAGE_QUESTIONS.map((question) => question.id).sort()).toEqual(expectedIds);
    expect(currentPacket.reviewItems.map((row: { questionVariantId: string }) => row.questionVariantId).sort()).toEqual(expectedIds);
    expect(currentPacket.reviewItems.every((row: { status: string }) => row.status === "salvage")).toBe(true);
    expect(currentPacket.reviewScope.statusFilter).toBe("salvage");
    expect(currentPacket.activeReleaseExport).toBe("SHOCK_TOPIC_SALVAGE_SOURCE_RELEASE");
    expect(currentPacket.cases).toEqual(topic.SHOCK_TOPIC_SALVAGE_CASES);
    expect(currentPacket.questions).toEqual(topic.SHOCK_TOPIC_SALVAGE_QUESTIONS);
    expect(syntheticClinicalReleaseSchema.parse(topic.SHOCK_TOPIC_SALVAGE_SOURCE_RELEASE)).toEqual(topic.SHOCK_TOPIC_SALVAGE_SOURCE_RELEASE);
    expect(new Set(topic.SHOCK_TOPIC_SALVAGE_CASES.map((clinicalCase) => clinicalCase.id)).size).toBe(3);
  });

  it("preserves both reviewed source generations and the two already accepted topic cases", () => {
    expect(sha(topic.SHOCK_TOPIC_ROUND2_SOURCE_RELEASE)).toBe("f9a24caa10fafd0ade71296bbdb014cc8e8a29316aaa2de7508e72099c7edddc");
    expect(sha(topic.SHOCK_TOPIC_ROUND2_QUESTIONS)).toBe("5fca573a49b58b033cae367a81c20c63073bff9f18c739902be52eb3e8b0b6b3");
    const acceptedCases = [
      ["case.critical-shock-resuscitation.fluid-assessment.v1", "111995727f618b2e014ed3cfd5f21c419376df63ac56a24261ef2a303788274f"],
      ["case.critical-shock-resuscitation.reassess-shock-mechanism.v2", "879b94921766aa0b743a0f0538bbf2a68c8b6a1f9ef741a153bcff99052cd85a"],
    ];
    for (const [caseId, digest] of acceptedCases) {
      expect(sha(SYNTHETIC_CLINICAL_RELEASE.cases.find((clinicalCase) => clinicalCase.id === caseId))).toBe(digest);
      expect(topic.SHOCK_TOPIC_SALVAGE_CASES.some((clinicalCase) => clinicalCase.id === caseId)).toBe(false);
    }
    const liveIds = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => node.questionVariantId)));
    for (const question of topic.SHOCK_TOPIC_SALVAGE_QUESTIONS) expect(liveIds.has(question.id)).toBe(topicQuestionAcceptance(question.id).live);
  });

  it.each(topic.SHOCK_TOPIC_SALVAGE_ASSIGNMENTS)("retains the complete exact PASS node for $questionVariantId", (assignment) => {
    const sourceCase = topic.SHOCK_TOPIC_ROUND2_CASES.find((clinicalCase) => clinicalCase.id === assignment.sourceCaseId)!;
    const sourceNode = sourceCase.decisionNodes.find((node) => node.questionVariantId === assignment.questionVariantId)!;
    const clinicalCase = topic.SHOCK_TOPIC_SALVAGE_CASES.find((candidate) => candidate.decisionNodes[0]!.questionVariantId === assignment.questionVariantId)!;
    const node = clinicalCase.decisionNodes[0]!;
    const question = topic.SHOCK_TOPIC_SALVAGE_QUESTIONS.find((candidate) => candidate.id === assignment.questionVariantId)!;
    expect(clinicalCase.decisionNodes).toHaveLength(1);
    expect({ ...node, terminalDispositions: [] }).toEqual({ ...sourceNode, terminalDispositions: [] });
    expect(node.terminalDispositions).toHaveLength(2);
    for (const terminal of node.terminalDispositions) {
      const choice = node.answerChoices.find((candidate) => candidate.id === terminal.answerChoiceId)!;
      expect(choice.isCorrect).toBe(false);
      expect(terminal.kind).toBe("no_terminal_outcome");
      if (terminal.kind === "no_terminal_outcome") expect(terminal.clinicalRationale).toBe(choice.rationale);
    }
    expect(question).toBe(topic.SHOCK_TOPIC_ROUND2_QUESTIONS.find((candidate) => candidate.id === question.id));
    expect(topic.SHOCK_TOPIC_SALVAGE_CONCEPTS.find((concept) => concept.id === question.conceptId)).toBe(topic.SHOCK_TOPIC_ROUND2_CONCEPTS.find((concept) => concept.id === question.conceptId));
    expect(node.shuffleAnswers).toBe(true);
    expect(node.stem).toContain("{patientName}");
    expect(clinicalCase.learningSummary).toBe(node.explanation);
    expect(clinicalCase.sourceLabels).toEqual(node.sourceLabels);
    const row = currentPacket.reviewItems.find((candidate: { questionVariantId: string }) => candidate.questionVariantId === question.id);
    expect(row.before.question).toEqual(question);
    expect(row.before.runtimeNode).toEqual(sourceNode);
    expect(row.after.question).toEqual(question);
    expect(row.after.runtimeNode).toEqual(node);
    expect(row.after.clinicalCase).toEqual(clinicalCase);
    expect(row.versionHash).toBe(sha({ clinicalCase, node, question }));
    expect(row.visibleContextBeforeAnswer.priorQuestionVariantIds).toEqual([]);
    expect(row.visibleContextBeforeAnswer.priorFeedback).toEqual([]);
    expect(row.visibleContextBeforeAnswer.priorVisibleNodes).toEqual([]);
    expect(row.keyFirstReviewChoices).toEqual([...question.answerChoices].sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect)));
    expect(row.reviewDisplay).toBe("key shown first for review only");
    const independentText = rootFile(assignment.reviewPath);
    expect(createHash("sha256").update(independentText).digest("hex")).toBe(row.independentNodeReview.sha256);
    expect(JSON.parse(independentText).find((entry: { id: string }) => entry.id === question.id).verdict).toBe("PASS");
    expect(row.independentContextReview.status).toBe("pending");
    expect(row.clinicalReviewStatus).toBe("needs_clinician_review");
  });

  it("changes only case context while retaining finite demographics and clinic requirements", () => {
    for (const assignment of topic.SHOCK_TOPIC_SALVAGE_ASSIGNMENTS) {
      const original = topic.SHOCK_TOPIC_ROUND2_CASES.find((clinicalCase) => clinicalCase.id === assignment.sourceCaseId)!;
      const clinicalCase = topic.SHOCK_TOPIC_SALVAGE_CASES.find((candidate) => candidate.decisionNodes[0]!.questionVariantId === assignment.questionVariantId)!;
      expect(clinicalCase.patientDisplayName).toBe(original.patientDisplayName);
      expect(clinicalCase.prototypeDemographics).toEqual(original.prototypeDemographics);
      expect(clinicalCase.chiefComplaint).toBe(original.chiefComplaint);
      expect(clinicalCase.presentation).toContain("remains in the surgical ICU");
      expect(clinicalCase.presentation).toContain("clinic teaching consultation");
      expect(clinicalCase.presentation).toContain(clinicalCase.prototypeDemographics!.ageYears + "-year-old");
      expect(clinicalCase.patientPresentationVariantId).not.toBe(original.patientPresentationVariantId);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.id).not.toBe(original.approvedInstantiationProfiles![0]!.id);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.presentation).toBe(clinicalCase.presentation);
      for (const key of ["earliestFacilityStage", "requiredClinicalSetting", "requiredCapabilityIds", "routineEligible", "tutorialEligible", "rewardTierId"] as const) expect(clinicalCase[key]).toEqual(original[key]);
    }
    expect(currentPacket.presentationReviews).toEqual(topic.SHOCK_TOPIC_SALVAGE_CASE_REVIEWS);
    expect(currentPacket.presentationReviews.every((row: { reviewStatus: string }) => row.reviewStatus === "needs_clinician_review")).toBe(true);
  });

  it("rebinds treatment-only timing and existing evidence without adding orders or claims", () => {
    expect(topic.SHOCK_TOPIC_SALVAGE_TIMING_ENTRIES).toHaveLength(3);
    expect(currentPacket.timingProposals).toEqual(topic.SHOCK_TOPIC_SALVAGE_TIMING_ENTRIES);
    for (const entry of topic.SHOCK_TOPIC_SALVAGE_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      expect(entry.classification).toEqual({ kind: "no_test" });
      const clinicalCase = topic.SHOCK_TOPIC_SALVAGE_CASES.find((candidate) => candidate.id === entry.caseId)!;
      expect(clinicalCase.decisionNodes[0]!.id).toBe(entry.nodeId);
      expect(clinicalCase.decisionNodes[0]!.questionVariantId).toBe(entry.questionVariantId);
    }
    expect(topic.SHOCK_TOPIC_SALVAGE_TEST_ORDER_PROPOSALS).toEqual([]);
    expect(currentPacket.testOrderProposals).toEqual([]);
    expect(currentPacket.statementMappings).toEqual(topic.SHOCK_TOPIC_SALVAGE_STATEMENT_MAPPINGS);
    expect(ledger.salvage.questionToClaim).toEqual(topic.SHOCK_TOPIC_SALVAGE_STATEMENT_MAPPINGS);
    expect(ledger.salvage.caseContexts.map((row: { caseId: string }) => row.caseId)).toEqual(topic.SHOCK_TOPIC_SALVAGE_CASES.map((clinicalCase) => clinicalCase.id));
    for (const question of topic.SHOCK_TOPIC_SALVAGE_QUESTIONS) {
      for (const id of question.supportingEvidenceClaimIds) expect(ledger.claims.some((claim: { id: string }) => claim.id === id)).toBe(true);
      expect(question.reviewStatus).toBe("needs_clinician_review");
    }
  });
});
