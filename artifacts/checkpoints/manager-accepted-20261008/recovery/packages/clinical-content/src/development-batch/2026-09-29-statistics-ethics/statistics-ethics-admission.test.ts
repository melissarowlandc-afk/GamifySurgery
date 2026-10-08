import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import {
  GS028_STATS_ETHICS_20260929_AUTHORING_CONCEPTS as concepts,
  GS028_STATS_ETHICS_20260929_BATCH_MANIFEST as manifest,
  GS028_STATS_ETHICS_20260929_CASE_REVIEWS as caseReviews,
  GS028_STATS_ETHICS_20260929_CASES as cases,
  GS028_STATS_ETHICS_20260929_CLAIMS as claims,
  GS028_STATS_ETHICS_20260929_QUESTIONS as questions,
  GS028_STATS_ETHICS_20260929_SERVICE_CONTRACTS as serviceContracts,
  GS028_STATS_ETHICS_20260929_SOURCES as sources,
  GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS as tested,
  GS028_STATS_ETHICS_20260929_TIMING_ENTRIES as timingEntries,
} from "./statistics-ethics-batch";
import { STATISTICS_DISCUSSION_HOST_ROLE_IDS } from "./statistics-qi";

const employeeConceptIds = new Set([
  "concept.statistics-ethics.independent-t",
  "concept.statistics-ethics.paired-t",
  "concept.statistics-ethics.one-way-anova",
  "concept.statistics-ethics.rank-sum",
  "concept.statistics-ethics.signed-rank",
  "concept.statistics-ethics.chi-square",
  "concept.statistics-ethics.fisher-exact",
  "concept.statistics-ethics.study-design",
  "concept.statistics-ethics.bias-confounding",
  "concept.statistics-ethics.risk-ratio-odds-ratio",
  "concept.statistics-ethics.p-value",
  "concept.statistics-ethics.confidence-interval",
  "concept.statistics-ethics.errors-power",
  "concept.quality-improvement.pdsa-act-and-iterate",
  "concept.statistics-ethics.qi-measures",
]);

const allDraftRecords = [
  ...concepts,
  ...questions,
  ...caseReviews,
  ...claims,
  ...sources,
];

describe("GS-028 statistics and ethics batch admission", () => {
  it("contains the exact 28 objectives and four question variants for each", () => {
    expect(concepts).toHaveLength(28);
    expect(tested).toHaveLength(28);
    expect(questions).toHaveLength(112);
    expect(cases).toHaveLength(108);
    expect(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)).toHaveLength(112);
    expect(manifest).toMatchObject({
      authoringConceptCount: 28,
      testedConceptCount: 28,
      questionVariantCount: 112,
      caseCount: 108,
      decisionNodeCount: 112,
      admissionScope: "owner_development_preview_only",
      publicReleaseAuthorized: false,
    });
    for (const concept of concepts) {
      expect(questions.filter((question) => question.conceptId === concept.id)).toHaveLength(4);
      expect(cases.filter((clinicalCase) =>
        clinicalCase.decisionNodes.some((node) => node.primaryConceptId === concept.id),
      )).toHaveLength(4);
    }
  });

  it("keeps every authored record as an unapproved clinician-review draft", () => {
    for (const record of allDraftRecords) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const record of [...concepts, ...questions, ...caseReviews]) {
      expect(record.agentReview.clinicianSignOff).toBe(false);
    }
    expect(concepts.find((concept) => concept.id === "concept.quality-improvement.pdsa-act-and-iterate")).toBeDefined();
  });

  it("maps concepts, questions, claims, and sources in both directions", () => {
    const conceptIds = new Set(concepts.map((concept) => concept.id));
    const questionIds = new Set(questions.map((question) => question.id));
    const claimIds = new Set(claims.map((claim) => claim.id));
    const sourceIds = new Set(sources.map((source) => source.id));
    expect(conceptIds.size).toBe(concepts.length);
    expect(questionIds.size).toBe(questions.length);
    expect(claimIds.size).toBe(claims.length);
    expect(sourceIds.size).toBe(sources.length);

    for (const concept of concepts) {
      expect(concept.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of concept.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    }
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of question.supportingEvidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    }
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
        expect(sources.find((source) => source.id === sourceId)?.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const source of sources) {
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of source.evidenceClaimIds) {
        expect(claims.find((claim) => claim.id === claimId)?.sourceIds).toContain(source.id);
      }
    }
  });

  it("keeps patient topics early and methods at level 2, free of fake procedures", () => {
    expect(serviceContracts).toEqual([]);
    expect(concepts.every((concept) => concept.earliestFacilityStage === (employeeConceptIds.has(concept.id) ? 2 : 0))).toBe(true);
    expect(timingEntries).toHaveLength(112);
    for (const timing of timingEntries) {
      answerChoiceTimingRegistryEntrySchema.parse(timing);
      expect(timing.classification).toEqual({ kind: "no_test" });
    }
    for (const clinicalCase of cases) {
      syntheticClinicalCaseSchema.parse(clinicalCase);
      expect(clinicalCase.earliestFacilityStage).toBe(clinicalCase.participant ? 2 : 0);
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect([1, 2]).toContain(clinicalCase.decisionNodes.length);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.resultGateAfter).toBeNull();
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices).toHaveLength(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
        expect(node.teachingPoint).toBeTruthy();
        expect(node.answerChoices.every((choice) => Boolean(choice.rationale))).toBe(true);
        expect(node.explanation).not.toContain("Correct answer:");
      }
    }
    for (const question of questions) {
      expect(question.answerChoices).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    }
  });

  it("materializes fifteen methods discussions with a content-owned clinical host list", () => {
    const employeeCases = cases.filter(
      (clinicalCase) => clinicalCase.participant?.kind === "employee_discussion",
    );
    const ordinaryCases = cases.filter(
      (clinicalCase) => clinicalCase.participant?.kind !== "employee_discussion",
    );
    expect(employeeConceptIds.size).toBe(15);
    expect(employeeCases).toHaveLength(60);
    expect(ordinaryCases).toHaveLength(48);

    for (const clinicalCase of employeeCases) {
      const node = clinicalCase.decisionNodes[0]!;
      expect(employeeConceptIds.has(node.primaryConceptId)).toBe(true);
      expect(clinicalCase.participant).toEqual({
        kind: "employee_discussion",
        requiredStaffRoleDefinitionIds: STATISTICS_DISCUSSION_HOST_ROLE_IDS,
      });
      expect(clinicalCase.prototypeDemographics).toBeUndefined();
      expect(clinicalCase.prototypeVitalSigns).toBeUndefined();
      expect(clinicalCase.approvedInstantiationProfiles).toBeUndefined();
    }
    for (const clinicalCase of ordinaryCases) {
      expect(clinicalCase.participant).toBeUndefined();
      expect(clinicalCase.approvedInstantiationProfiles?.length).toBeGreaterThan(0);
    }
  });

  it("keeps keys parallel enough not to be uniquely longest and validates tested concepts", () => {
    for (const concept of tested) testedConceptSchema.parse(concept);
    const uniqueLongestKeys = questions.flatMap((question) => {
      const correct = question.answerChoices.find((choice) => choice.isCorrect)!;
      return question.answerChoices.every(
        (choice) => choice.isCorrect || correct.label.length > choice.label.length,
      )
        ? [{ id: question.id, label: correct.label }]
        : [];
    });
    expect(uniqueLongestKeys).toEqual([]);
  });

  it("flags keys more than 1.5 times the mean distractor length across all 112 variants", () => {
    expect(questions).toHaveLength(112);
    const outliers = questions.flatMap((question) => {
      const key = question.answerChoices.find((choice) => choice.isCorrect)!;
      const distractors = question.answerChoices.filter((choice) => !choice.isCorrect);
      const meanCharacters = distractors.reduce((sum, choice) => sum + choice.label.length, 0) / distractors.length;
      const words = (label: string) => label.trim().split(/\s+/).length;
      const meanWords = distractors.reduce((sum, choice) => sum + words(choice.label), 0) / distractors.length;
      return key.label.length > 1.5 * meanCharacters || words(key.label) > 1.5 * meanWords
        ? [{ questionId: question.id, key: key.label, meanCharacters, meanWords }]
        : [];
    });
    expect(outliers).toEqual([]);
  });
});
