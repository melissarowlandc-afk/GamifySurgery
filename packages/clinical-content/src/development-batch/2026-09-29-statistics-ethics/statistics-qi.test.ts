import { describe, expect, it } from "vitest";
import {
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { STATISTICS_QI_FAMILIES } from "./statistics-qi";

const concepts = STATISTICS_QI_FAMILIES.flatMap((family) => family.testedConcepts);
const questions = STATISTICS_QI_FAMILIES.flatMap((family) => family.questions);
const cases = STATISTICS_QI_FAMILIES.flatMap((family) => family.cases);
const claims = STATISTICS_QI_FAMILIES.flatMap((family) => family.claims);
const sourcesById = new Map<string, (typeof STATISTICS_QI_FAMILIES)[number]["sources"][number]>();
for (const source of STATISTICS_QI_FAMILIES.flatMap((family) => family.sources)) {
  const previous = sourcesById.get(source.id);
  sourcesById.set(
    source.id,
    previous
      ? {
          ...previous,
          evidenceClaimIds: [
            ...new Set([...previous.evidenceClaimIds, ...source.evidenceClaimIds]),
          ],
        }
      : source,
  );
}

describe("GS028 statistics and QI authoring draft", () => {
  it("keeps eighteen concepts, four variants each, and no diagnostic service semantics", () => {
    expect(concepts).toHaveLength(18);
    expect(questions).toHaveLength(72);
    expect(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)).toHaveLength(72);
    expect(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes).every((node) => node.answerChoices.every((choice) => choice.serviceRequest === null))).toBe(true);
  });

  it("passes schemas, provenance, story, key, and employee-subject guards", () => {
    const employeeConceptIds = new Set([
      "concept.statistics-ethics.independent-t",
      "concept.statistics-ethics.paired-t",
      "concept.statistics-ethics.one-way-anova",
      "concept.statistics-ethics.rank-sum",
      "concept.statistics-ethics.signed-rank",
      "concept.statistics-ethics.chi-square",
      "concept.statistics-ethics.fisher-exact",
      "concept.quality-improvement.pdsa-act-and-iterate",
      "concept.statistics-ethics.qi-measures",
    ]);
    for (const concept of concepts) testedConceptSchema.parse(concept);
    for (const clinicalCase of cases) {
      syntheticClinicalCaseSchema.parse(clinicalCase);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeGreaterThan(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.answerChoices.filter((answer) => answer.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      const isEmployee = employeeConceptIds.has(node.primaryConceptId);
      expect(clinicalCase.participant?.kind === "employee_discussion").toBe(isEmployee);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      if (isEmployee) {
        expect(clinicalCase.prototypeDemographics).toBeUndefined();
        expect(clinicalCase.prototypeVitalSigns).toBeUndefined();
        expect(clinicalCase.approvedInstantiationProfiles).toBeUndefined();
      } else {
        expect(clinicalCase.approvedInstantiationProfiles?.length).toBeGreaterThan(0);
      }
    }
    expect(cases.filter((item) => item.participant?.kind === "employee_discussion")).toHaveLength(36);
    expect(
      questions.every(
        (question) => question.supportingEvidenceClaimIds.length >= 1,
      ),
    ).toBe(true);
    const lengthCues = questions.flatMap((question) => {
      const key = question.answerChoices.find((answer) => answer.isCorrect)!;
      const longestDistractor = Math.max(
        ...question.answerChoices
          .filter((answer) => !answer.isCorrect)
          .map((answer) => answer.label.length),
      );
      return key.label.length > longestDistractor
        ? [{ id: question.id, key: key.label }]
        : [];
    });
    expect(lengthCues).toEqual([]);
    for (const claim of claims) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourcesById.get(sourceId)?.evidenceClaimIds).toContain(claim.id);
      }
    }
  });

  it("calculates each fictional 30-day ARR and NNT example exactly", () => {
    const arr = questions.filter((question) => question.conceptId === "concept.statistics-ethics.arr-nnt");
    const datasets = [
      { usualEvents: 20, usualTotal: 100, revisedEvents: 10, revisedTotal: 100 },
      { usualEvents: 30, usualTotal: 200, revisedEvents: 10, revisedTotal: 100 },
      { usualEvents: 30, usualTotal: 100, revisedEvents: 10, revisedTotal: 100 },
      { usualEvents: 20, usualTotal: 100, revisedEvents: 14, revisedTotal: 100 },
    ];
    expect(
      datasets.map((item) => {
        const absoluteDifference =
          item.usualEvents / item.usualTotal -
          item.revisedEvents / item.revisedTotal;
        const absoluteEventNumerator =
          item.usualEvents * item.revisedTotal -
          item.revisedEvents * item.usualTotal;
        return {
          percentagePoints: Math.round(absoluteDifference * 100),
          nnt: Math.ceil(
            (item.usualTotal * item.revisedTotal) /
              absoluteEventNumerator,
          ),
        };
      }),
    ).toEqual([
      { percentagePoints: 10, nnt: 10 },
      { percentagePoints: 5, nnt: 20 },
      { percentagePoints: 20, nnt: 5 },
      { percentagePoints: 6, nnt: 17 },
    ]);
    expect(arr.map((question) => question.answerChoices.find((choice) => choice.isCorrect)?.label)).toEqual([
      "ARR 10 percentage points; NNT 10 over 30 days",
      "ARR 5 percentage points; NNT 20 over 30 days",
      "ARR 20 percentage points; NNT 5 over 30 days",
      "ARR 6 percentage points; NNT 17 over 30 days",
    ]);
  });
});
