import { describe, expect, it } from "vitest";
import {
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { STATISTICS_DISCUSSION_HOST_ROLE_IDS, STATISTICS_QI_FAMILIES } from "./statistics-qi";

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
      "concept.statistics-ethics.study-design",
      "concept.statistics-ethics.bias-confounding",
      "concept.statistics-ethics.risk-ratio-odds-ratio",
      "concept.statistics-ethics.p-value",
      "concept.statistics-ethics.confidence-interval",
      "concept.statistics-ethics.errors-power",
      "concept.quality-improvement.pdsa-act-and-iterate",
      "concept.statistics-ethics.qi-measures",
    ]);
    for (const concept of concepts) testedConceptSchema.parse(concept);
    for (const clinicalCase of cases) {
      syntheticClinicalCaseSchema.parse(clinicalCase);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeGreaterThan(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation.toLowerCase()).not.toContain(clinicalCase.chiefComplaint.toLowerCase());
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.answerChoices.filter((answer) => answer.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      const isEmployee = employeeConceptIds.has(node.primaryConceptId);
      expect(clinicalCase.participant?.kind === "employee_discussion").toBe(isEmployee);
      expect(clinicalCase.earliestFacilityStage).toBe(isEmployee ? 2 : 0);
      expect(node.exhibit).toBeDefined();
      expect(node.teachingPoint).toBeTruthy();
      expect(node.answerChoices.every((answer) => Boolean(answer.rationale))).toBe(true);
      expect(node.explanation).toBe(node.teachingPoint);
      expect(clinicalCase.learningSummary).not.toContain(node.explanation);
      expect(JSON.stringify([clinicalCase.presentation, node.stem, node.explanation, node.answerChoices, node.exhibit])).not.toMatch(/fictional|research-literacy|Correct answer:/i);
      if (isEmployee) {
        expect(clinicalCase.participant?.requiredStaffRoleDefinitionIds).toEqual(STATISTICS_DISCUSSION_HOST_ROLE_IDS);
        expect(clinicalCase.prototypeDemographics).toBeUndefined();
        expect(clinicalCase.prototypeVitalSigns).toBeUndefined();
        expect(clinicalCase.approvedInstantiationProfiles).toBeUndefined();
      } else {
        expect(clinicalCase.approvedInstantiationProfiles?.length).toBeGreaterThan(0);
        for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
          expect(profile.presentation).toContain(`${profile.prototypeDemographics!.ageYears}-year-old`);
          expect(profile.prototypeDemographics!.sexLabel).toMatch(/Female|Male/);
        }
      }
    }
    expect(cases.filter((item) => item.participant?.kind === "employee_discussion")).toHaveLength(60);
    expect(cases.filter((item) => !item.participant)).toHaveLength(12);
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

  it("calculates each 30-day teaching ARR and NNT exhibit exactly", () => {
    const arr = questions.filter((question) => question.conceptId === "concept.statistics-ethics.arr-nnt");
    const datasets = arr.map((question) => {
      const exhibit = question.exhibit!;
      if (exhibit.kind !== "table") throw new Error("ARR requires a group-risk table.");
      return { usualEvents: Number(exhibit.cells[0]![0]), usualTotal: Number(exhibit.cells[0]![1]), revisedEvents: Number(exhibit.cells[1]![0]), revisedTotal: Number(exhibit.cells[1]![1]) };
    });
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

  it("keeps method names and method descriptions out of selection stems and varies distractor sets", () => {
    const selectionIds = ["independent-t", "paired-t", "one-way-anova", "rank-sum", "signed-rank", "chi-square", "fisher-exact"];
    for (const suffix of selectionIds) {
      const variants = questions.filter((question) => question.conceptId === `concept.statistics-ethics.${suffix}`);
      expect(new Set(variants.map((question) => question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label).sort().join("|"))).size).toBeGreaterThanOrEqual(3);
      for (const question of variants) {
        expect(question.stem).not.toMatch(/t test|anova|wilcoxon|chi.square|fisher|mcnemar|rank.based|paired|independent|parametric/i);
        expect(question.patientPresentation).not.toMatch(/planned .*analysis|proposed .*anova/i);
      }
    }
  });

  it("preserves the nine authored McNemar boundary mappings through choice rewrites", () => {
    expect(questions.filter((question) => question.supportingEvidenceClaimIds.some((id) => id.endsWith(".mcnemar-boundary")))
      .map((question) => question.id)).toEqual([
      "question.statistics-ethics.independent-t.v2",
      "question.statistics-ethics.rank-sum.v1",
      "question.statistics-ethics.signed-rank.v3",
      "question.statistics-ethics.chi-square.v1",
      "question.statistics-ethics.chi-square.v2",
      "question.statistics-ethics.chi-square.v3",
      "question.statistics-ethics.chi-square.v4",
      "question.statistics-ethics.fisher-exact.v1",
      "question.statistics-ethics.fisher-exact.v4",
    ]);
  });
});
