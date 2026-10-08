import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema } from "../../schema";
import { ETHICS_FAMILIES } from "./ethics";

const cases = ETHICS_FAMILIES.flatMap((family) => family.cases);
const questions = ETHICS_FAMILIES.flatMap((family) => family.questions);

describe("GS028 patient-centered ethics overhaul", () => {
  it("retains ten concepts and forty questions in thirty-six patient cases", () => {
    expect(ETHICS_FAMILIES.flatMap((family) => family.authoringConcepts)).toHaveLength(10);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(36);
    expect(cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2)).toHaveLength(4);
    for (const clinicalCase of cases) {
      syntheticClinicalCaseSchema.parse(clinicalCase);
      expect(clinicalCase.participant).toBeUndefined();
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).not.toMatch(/A patient with|overhears staff discussing an identifiable clinic case/i);
      for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
        const age = profile.prototypeDemographics!.ageYears;
        expect(profile.presentation).toMatch(new RegExp(`${age}-year-old|de ${age} años`));
        expect(profile.prototypeDemographics!.sexLabel).toMatch(/Female|Male/);
        if (profile.presentation.includes("una mujer")) expect(profile.prototypeDemographics!.sexLabel).toBe("Female");
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(node.teachingPoint).toBeTruthy();
        expect(node.explanation).toBe(node.teachingPoint);
        expect(node.explanation).not.toContain("Correct answer:");
        expect(node.answerChoices.every((choice) => Boolean(choice.rationale))).toBe(true);
        expect(node.shuffleAnswers).toBe(true);
        for (const disposition of node.terminalDispositions) {
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind === "no_terminal_outcome") {
            expect(disposition.consequenceNarrative).toBe("Review the teaching point and choice rationales.");
          }
        }
      }
    }
  });

  it("continues the same patient's interpreted consent discussion without a new clinical treatment claim", () => {
    for (const clinicalCase of cases.filter((item) => item.decisionNodes.length === 2)) {
      expect(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).toEqual([
        "concept.statistics-ethics.qualified-interpreter",
        "concept.statistics-ethics.informed-consent",
      ]);
      expect(clinicalCase.prototypeDemographics!.sexLabel).toBe("Female");
      expect(clinicalCase.decisionNodes[1]!.currentUpdate).toContain("{patientName}");
      expect(clinicalCase.decisionNodes[1]!.currentUpdate).toMatch(/interpret/i);
      expect(clinicalCase.decisionNodes.every((node) => node.resultGateAfter === null)).toBe(true);
    }
  });

  it("keeps feedback and question records aligned without repeating every rationale in a paragraph", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.learningSummary).toBe("Review the teaching points and choice rationales for this encounter.");
      for (const node of clinicalCase.decisionNodes) {
        const authored = questions.find((question) => question.id === node.questionVariantId)!;
        expect(authored.teachingPoint).toBe(node.teachingPoint);
        expect(authored.supportingEvidenceClaimIds).toHaveLength(1);
        for (const choice of node.answerChoices) {
          expect(authored.answerChoices.find((answer) => answer.id === choice.id)?.rationale).toBe(choice.rationale);
        }
      }
    }
  });
});
