import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "./schema";
import {
  VASCULAR_CAROTID_AUTHOR_GATES,
  VASCULAR_CAROTID_AUTHORING_CONCEPTS,
  VASCULAR_CAROTID_CASE_REVIEWS,
  VASCULAR_CAROTID_CASES,
  VASCULAR_CAROTID_CLAIMS,
  VASCULAR_CAROTID_CONCEPTS,
  VASCULAR_CAROTID_DRAFT_CASES,
  VASCULAR_CAROTID_IDENTITY_DECISIONS,
  VASCULAR_CAROTID_ITEM_STATUSES,
  VASCULAR_CAROTID_ORDER_PROPOSALS,
  VASCULAR_CAROTID_PARKED_ITEMS,
  VASCULAR_CAROTID_PASSED_CASES,
  VASCULAR_CAROTID_QUESTIONS,
  VASCULAR_CAROTID_REVISION_CASES,
  VASCULAR_CAROTID_SOURCES,
  VASCULAR_CAROTID_SOURCE_LINKS,
  VASCULAR_CAROTID_STATEMENT_MAPPINGS,
  VASCULAR_CAROTID_TIMING_ENTRIES,
} from "./question-topic-vascular-carotid-20261111";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const readJson = (path: string) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const packet = readJson("docs/research/question-topic-vascular-carotid-20261111.json");
const ledger = readJson("docs/research/sources-question-topic-vascular-carotid-20261111.json");
const reviewPath = "docs/research/question-topic-vascular-carotid-review-20261111.json";
const independentReview = readJson(reviewPath);
const baseline = packet.reviewRound1Baseline;
const digest = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

const passedQuestionHashes = new Map([
  ["question.vascular-carotid.nascet-plan.20261111.v1", "9fadb54aa16a41af86297594809dfa8c70078131b25dae4c6bde8f065a17c553"],
  ["question.vascular-carotid.chronic-occlusion.20261111.v1", "88fdcd1012ceb9abb73b2a7ad44dd37442bfc9e424feef81435bd52341f0b461"],
  ["question.vascular-carotid.near-occlusion.20261111.v1", "6dccfc8a5f9299f28e154e205b67c9370e09cf340d33a1abe396d618dfc45d2d"],
]);

describe("vascular-carotid independent-review response", () => {
  it("binds the supplied review and assigns exactly one status to every reviewed version", () => {
    const actualReviewHash = createHash("sha256")
      .update(readFileSync(resolve(root, reviewPath)))
      .digest("hex");
    expect(actualReviewHash).toBe("255122048db02a41c559eb54c6b54bfb46284733258043816c1fe2b6000e01dc");
    expect(packet.reviewResponse.reviewSha256).toBe(actualReviewHash);
    expect(baseline.review).toEqual(independentReview);
    const reviewedIds = independentReview.map((row: { id: string }) => row.id).sort();
    const statusIds = VASCULAR_CAROTID_ITEM_STATUSES.map(row => row.reviewedVariantId).sort();
    expect(statusIds).toEqual(reviewedIds);
    expect(new Set(statusIds).size).toBe(12);
    expect(VASCULAR_CAROTID_ITEM_STATUSES.filter(row => row.status === "pass-preserved")).toHaveLength(3);
    expect(VASCULAR_CAROTID_ITEM_STATUSES.filter(row => row.status === "revised")).toHaveLength(5);
    expect(VASCULAR_CAROTID_ITEM_STATUSES.filter(row => row.status === "parked")).toHaveLength(4);
    expect(packet.itemStatuses).toEqual(VASCULAR_CAROTID_ITEM_STATUSES);
  });

  it("preserves each PASS question byte-for-byte under its reviewed question ID", () => {
    for (const [id, expectedHash] of passedQuestionHashes) {
      const current = VASCULAR_CAROTID_QUESTIONS.find(question => question.id === id)!;
      const original = baseline.questions.find((question: { id: string }) => question.id === id);
      expect(current, id).toBeDefined();
      expect(current).toEqual(original);
      expect(digest(current)).toBe(expectedHash);
      expect(current.contentVersion).toBe("clinical.question-topic-vascular-carotid.2026-11-11.v1");
    }
  });

  it("preserves PASS nodes and all visible shared context when splitting companions", () => {
    for (const id of passedQuestionHashes.keys()) {
      const original = baseline.cases.find((clinicalCase: { decisionNodes: Array<{ questionVariantId: string }> }) =>
        clinicalCase.decisionNodes.some(node => node.questionVariantId === id)
      );
      const current = VASCULAR_CAROTID_CASES.find(clinicalCase =>
        clinicalCase.decisionNodes.some(node => node.questionVariantId === id)
      )!;
      expect(current.decisionNodes).toHaveLength(1);
      expect(current.decisionNodes[0]).toEqual(
        original.decisionNodes.find((node: { questionVariantId: string }) => node.questionVariantId === id)
      );
      const { decisionNodes: oldNodes, learningSummary: oldSummary, ...oldHeader } = original;
      const { decisionNodes: newNodes, learningSummary: newSummary, ...newHeader } = current;
      expect(newHeader).toEqual(oldHeader);
      expect(newSummary).toBe(current.decisionNodes[0]!.explanation);
      if (id.includes(".near-occlusion.")) {
        expect(current).toEqual(original);
      } else {
        expect(oldNodes).toHaveLength(2);
      }
    }
  });

  it("retains the original audit and all twelve reviewed definitions in the archive", () => {
    const sourceProgram = readJson("docs/research/question-topic-program-20261111.json");
    const assignedIds = sourceProgram.inventory
      .filter((row: { primaryTopicSlug: string }) => row.primaryTopicSlug === "vascular-carotid")
      .map((row: { recordId: string }) => row.recordId)
      .sort();
    expect(packet.audit.map((row: { recordId: string }) => row.recordId).sort()).toEqual(assignedIds);
    expect(baseline.questions).toHaveLength(12);
    expect(baseline.cases).toHaveLength(7);
    expect(baseline.sourceHashes[0].sha256).toBe("c22e3f301fe069462156e514b981d3f772ccd43d6a9879dad7554e70182d20c4");
    expect(packet.counts).toMatchObject({
      reviewedItems: 12,
      passPreserved: 3,
      revised: 5,
      parked: 4,
      currentQuestions: 8,
      currentCases: 8,
      currentMultiPartCases: 0,
    });
  });

  it("replaces returned active versions with v2 and excludes parked items from current cases", () => {
    for (const status of VASCULAR_CAROTID_ITEM_STATUSES) {
      const current = VASCULAR_CAROTID_QUESTIONS.find(question => question.id === status.questionVariantId);
      if (status.status === "parked") {
        expect(current).toBeUndefined();
        expect(status.caseId).toBeNull();
      } else if (status.status === "revised") {
        expect(current!.id).toMatch(/\.v2$/);
        expect(current!.contentVersion).toBe("clinical.question-topic-vascular-carotid.2026-11-11.v2");
        expect(current!.id).not.toBe(status.reviewedVariantId);
        expect(status.independentReview).toBe("awaiting_re_review");
        expect(VASCULAR_CAROTID_QUESTIONS.some(question => question.id === status.reviewedVariantId)).toBe(false);
      }
    }
    expect(packet.parkedItems).toEqual(VASCULAR_CAROTID_PARKED_ITEMS);
    for (const parked of VASCULAR_CAROTID_PARKED_ITEMS) {
      expect(parked.candidateConsidered.length).toBeGreaterThan(70);
      expect(parked.reason.length).toBeGreaterThan(150);
      expect(parked.nextAction.length).toBeGreaterThan(60);
    }
  });

  it("keeps passed and pending review sets distinct and leaves no mixed multi-part case", () => {
    expect(VASCULAR_CAROTID_PASSED_CASES).toHaveLength(3);
    expect(VASCULAR_CAROTID_REVISION_CASES).toHaveLength(5);
    expect(VASCULAR_CAROTID_CASES).toHaveLength(8);
    for (const clinicalCase of VASCULAR_CAROTID_CASES) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const statuses = VASCULAR_CAROTID_ITEM_STATUSES.filter(item => item.caseId === clinicalCase.id);
      expect(statuses).toHaveLength(1);
      expect(statuses[0]!.status).not.toBe("parked");
    }
    for (const clinicalCase of VASCULAR_CAROTID_PASSED_CASES) {
      expect(passedQuestionHashes.has(clinicalCase.decisionNodes[0]!.questionVariantId)).toBe(true);
    }
  });

  it("parses the normal explicit-import cases, concepts and timing records", () => {
    expect(VASCULAR_CAROTID_CONCEPTS).toHaveLength(8);
    for (const clinicalCase of VASCULAR_CAROTID_CASES) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success, clinicalCase.id).toBe(true);
    }
    for (const concept of VASCULAR_CAROTID_CONCEPTS) {
      expect(testedConceptSchema.safeParse(concept).success, concept.id).toBe(true);
    }
    for (const timing of VASCULAR_CAROTID_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(timing).success, timing.nodeId).toBe(true);
    }
  });

  it("binds unique runtime identities, exact question data and randomized answer choices", () => {
    const seen = new Set<string>();
    for (const clinicalCase of VASCULAR_CAROTID_CASES) {
      const node = clinicalCase.decisionNodes[0]!;
      const ids = [clinicalCase.id, node.id, node.questionVariantId, ...node.answerChoices.map(answer => answer.id)];
      for (const id of ids) {
        expect(seen.has(id), id).toBe(false);
        seen.add(id);
      }
      const question = VASCULAR_CAROTID_QUESTIONS.find(question => question.id === node.questionVariantId)!;
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter(answer => answer.isCorrect)).toHaveLength(1);
      expect(node.stem).toBe(question.stem);
      expect(node.primaryConceptId).toBe(question.conceptId);
      expect(node.answerChoices.map(answer => [answer.id, answer.label, answer.isCorrect]))
        .toEqual(question.answerChoices.map(answer => [answer.id, answer.label, answer.isCorrect]));
    }
    expect(packet.questions).toEqual(VASCULAR_CAROTID_QUESTIONS);
    expect(packet.cases).toEqual(VASCULAR_CAROTID_CASES);
  });

  it("retains clinic admission and complete named demographic profiles", () => {
    for (const [index, clinicalCase] of VASCULAR_CAROTID_CASES.entries()) {
      const authored = VASCULAR_CAROTID_DRAFT_CASES[index]!;
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.patientDisplayName).toBe(authored.patientName);
      expect(clinicalCase.presentation).toContain(authored.patientName);
      expect(clinicalCase.presentation).toContain(String(authored.age) + "-year-old");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics)
        .toEqual(clinicalCase.prototypeDemographics);
      if (authored.clinicalContext === "outside_hospital_chart_review") {
        expect(clinicalCase.presentation).toMatch(/founder reviews.*outside hospital/s);
      }
    }
  });

  it("maps every current testing choice to its exact label and an existing placeholder profile", () => {
    const balanceSource = readFileSync(resolve(root, "packages/balance-config/src/prototype-balance.ts"), "utf8");
    let testChoices = 0;
    for (const clinicalCase of VASCULAR_CAROTID_CASES) {
      const node = clinicalCase.decisionNodes[0]!;
      const timing = VASCULAR_CAROTID_TIMING_ENTRIES.find(entry =>
        entry.caseId === clinicalCase.id &&
        entry.nodeId === node.id &&
        entry.questionVariantId === node.questionVariantId
      )!;
      if (timing.classification.kind === "test_choices") {
        expect(timing.classification.choices.map(answer => [answer.choiceId, answer.choiceLabel]))
          .toEqual(node.answerChoices.map(answer => [answer.id, answer.label]));
        for (const answer of timing.classification.choices) {
          if (answer.timing.kind === "test") {
            testChoices++;
            expect(balanceSource).toContain('id: "' + answer.timing.timingProfileId + '"');
            const proposal = VASCULAR_CAROTID_ORDER_PROPOSALS.find(proposal =>
              proposal.questionVariantId === node.questionVariantId &&
              proposal.choiceId === answer.choiceId
            )!;
            expect(proposal.choiceLabel).toBe(answer.choiceLabel);
            expect(proposal.currentServiceRequest).toBeNull();
            expect(proposal.currentResultGate).toBeNull();
          }
        }
      }
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every(answer => answer.serviceRequest === null)).toBe(true);
    }
    expect(testChoices).toBe(4);
    expect(VASCULAR_CAROTID_ORDER_PROPOSALS).toHaveLength(4);
  });

  it("preserves existing claims and maps every current question to supported atomic records", () => {
    for (const oldClaim of baseline.claims) {
      expect(VASCULAR_CAROTID_CLAIMS.find(claim => claim.id === oldClaim.id)).toEqual(oldClaim);
    }
    expect(ledger.sources).toEqual(VASCULAR_CAROTID_SOURCES);
    expect(ledger.claims).toEqual(VASCULAR_CAROTID_CLAIMS);
    for (const question of VASCULAR_CAROTID_QUESTIONS) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) {
        const claim = VASCULAR_CAROTID_CLAIMS.find(claim => claim.id === id)!;
        expect(claim, id).toBeDefined();
        expect(ledger.claimToQuestions[id]).toContain(question.id);
        for (const sourceId of claim.sourceIds) {
          expect(VASCULAR_CAROTID_SOURCES.find(source => source.id === sourceId)!.evidenceClaimIds).toContain(id);
        }
      }
    }
    expect(VASCULAR_CAROTID_STATEMENT_MAPPINGS).toHaveLength(8);
  });

  it("records a concrete response to every review issue and rubric for every revised version", () => {
    for (const response of packet.reviewResponse.entries) {
      const review = independentReview.find((review: { id: string }) => review.id === response.reviewedVariantId);
      expect(response.issueResponses.clarityIssues).toHaveLength(review.clarityIssues.length);
      expect(response.issueResponses.cues).toHaveLength(review.cues.length);
      expect(response.issueResponses.fairness).toHaveLength(review.fairness.length);
      expect(response.issueResponses.suggestions).toHaveLength(review.suggestions.length);
      if (response.status === "revised") {
        expect(response.revisionCycles).toBe(1);
        expect(response.currentIndependentVerdict).toBe("pending_or_parked");
        const gate = VASCULAR_CAROTID_AUTHOR_GATES.find(gate =>
          gate.questionVariantId === response.currentVariantId
        )!;
        expect(gate.twoConsequentialSteps).toHaveLength(2);
        expect(gate.coverTheKey.length).toBeGreaterThan(100);
        expect(gate.deletionTest.length).toBeGreaterThan(100);
        expect(gate.singleBestAnswer.decidingObservation.length).toBeGreaterThan(70);
        const authored = VASCULAR_CAROTID_DRAFT_CASES.flatMap(clinicalCase => clinicalCase.nodes)
          .find(node => response.currentVariantId === "question.vascular-carotid." + node.slug + ".20261111.v2")!;
        expect(authored.choices.some(answer => answer.id === gate.singleBestAnswer.counterfactual.thenChoice)).toBe(true);
        expect(gate.options).toHaveLength(3);
        for (const option of gate.options) {
          expect(option.temptation.length).toBeGreaterThan(30);
          expect(option.reasonableUnder.length).toBeGreaterThan(30);
        }
      }
    }
  });

  it("versions changed objectives and records the established-concept reuse explicitly", () => {
    const revised = VASCULAR_CAROTID_IDENTITY_DECISIONS.filter(item => item.questionVariantId.endsWith(".v2"));
    expect(revised).toHaveLength(5);
    expect(revised.filter(item => item.identityDecision === "new_meaning")).toHaveLength(3);
    for (const item of revised.filter(item => item.identityDecision === "new_meaning")) {
      expect(item.conceptId).not.toBe(item.previousConceptId);
      expect(item.conceptId).toMatch(/^concept\.vascular-carotid\..*\.v1$/);
    }
    const reused = revised.find(item => item.identityDecision === "reuse_existing_concept")!;
    expect(reused.conceptId).toBe("concept.n3.bilateral-carotid-symptom-attribution");
    const same = revised.find(item => item.identityDecision === "same_meaning")!;
    expect(same.conceptId).toBe(same.previousConceptId);
  });

  it("keeps exact clinical versions pending sign-off and all source links safe", () => {
    for (const record of [
      ...VASCULAR_CAROTID_QUESTIONS,
      ...VASCULAR_CAROTID_CLAIMS,
      ...VASCULAR_CAROTID_SOURCES,
      ...VASCULAR_CAROTID_AUTHORING_CONCEPTS,
      ...VASCULAR_CAROTID_CASE_REVIEWS,
    ]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const link of VASCULAR_CAROTID_SOURCE_LINKS) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
      expect(link.href).toMatch(/^https:\/\//);
    }
    expect(packet.managerAccepted).toBe(false);
    expect(packet.independentReview.revisedVersionsAwaitingIndependentReview).toBe(5);
  });
});
