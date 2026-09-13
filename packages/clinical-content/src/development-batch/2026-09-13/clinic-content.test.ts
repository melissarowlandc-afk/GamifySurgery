import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import * as lynch from "./lynch-tumor";
import * as fissure from "./chronic-anal-fissure";
import * as skin from "./cutaneous-scc";
import * as venous from "./venous-leg-ulcer";
import * as spleen from "./splenectomy-infection-prevention";

const families = [
  lynch,
  fissure,
  skin,
  venous,
  spleen,
] as const;
const concepts = families.flatMap((f) => {
  const key = Object.keys(f).find((name) => name.endsWith("_CONCEPTS"))!;
  return f[key as keyof typeof f] as typeof lynch.LYNCH_TUMOR_CONCEPTS;
});
const questions = families.flatMap((f) => {
  const key = Object.keys(f).find((name) => name.endsWith("_QUESTIONS"))!;
  return f[key as keyof typeof f] as typeof lynch.LYNCH_TUMOR_QUESTIONS;
});
const cases = families.flatMap((f) => {
  const key = Object.keys(f).find((name) => name.endsWith("_CASES"))!;
  return f[key as keyof typeof f] as typeof lynch.LYNCH_TUMOR_CASES;
});
const timing = families.flatMap((f) => {
  const key = Object.keys(f).find((name) => name.endsWith("_TIMING_ENTRIES"))!;
  return f[key as keyof typeof f] as typeof lynch.LYNCH_TUMOR_TIMING_ENTRIES;
});

describe("2026-09-13 clinic authoring", () => {
  it("contains ten concepts, four variants each, and the expected encounter count", () => {
    expect(concepts).toHaveLength(10);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(28);
    expect(timing).toHaveLength(40);
    for (const concept of concepts) expect(questions.filter((question) => question.conceptId === concept.id)).toHaveLength(4);
  });

  it("keeps schema-valid profiles, identities, and one answer key per node", () => {
    for (const concept of concepts) {
      const tested = {
        id: concept.id,
        displayName: concept.displayName,
        learningObjective: concept.learningObjective,
        earliestFacilityStage: concept.earliestFacilityStage,
        conceptType: concept.conceptType,
      };
      expect(testedConceptSchema.parse(tested)).toEqual(tested);
    }
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeGreaterThan(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        expect(profile.presentation).toContain("{patientName}");
        expect(profile.presentation).toMatch(/\d+-year-old (woman|man|adult)/);
      }
      for (const node of clinicalCase.decisionNodes) expect(node.answerChoices.filter((answer) => answer.isCorrect)).toHaveLength(1);
    }
  });

  it("preserves gates and records timing semantics for every test choice", () => {
    const gated = cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2);
    expect(gated).toHaveLength(12);
    for (const clinicalCase of gated) {
      const [first, second] = clinicalCase.decisionNodes;
      expect(first?.resultGateAfter).not.toBeNull();
      expect(second?.currentUpdate).toBe(first?.resultGateAfter?.resultNarrative);
      expect(first?.answerChoices.find((answer) => answer.isCorrect)?.serviceRequest?.serviceId).toBe(first?.resultGateAfter?.resultTypeId);
    }
    for (const entry of timing) {
      const node = cases.find((clinicalCase) => clinicalCase.id === entry.caseId)?.decisionNodes.find((item) => item.id === entry.nodeId);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(4);
        for (const choice of entry.classification.choices) expect(node?.answerChoices.some((answer) => answer.id === choice.choiceId)).toBe(true);
      }
    }
  });

  it("keeps the clinical boundaries explicit", () => {
    for (const clinicalCase of lynch.LYNCH_TUMOR_CASES) {
      expect(clinicalCase.decisionNodes[0]?.answerChoices.find((answer) => answer.isCorrect)?.label).toBe("MMR immunohistochemistry");
      expect(clinicalCase.decisionNodes[1]?.currentUpdate).toContain("loss of MSH2 and MSH6");
    }
    expect(JSON.stringify(fissure.CHRONIC_ANAL_FISSURE_CASES)).not.toContain("nitrate");
    expect(JSON.stringify(venous.VENOUS_LEG_ULCER_CASES)).toContain("ABI of 1.05 with normal arterial waveforms");
    expect(skin.CUTANEOUS_SCC_CASES.filter((clinicalCase) => clinicalCase.decisionNodes[1]?.currentUpdate?.includes("well-differentiated")).length).toBe(2);
    expect(skin.CUTANEOUS_SCC_CASES.filter((clinicalCase) => clinicalCase.decisionNodes[1]?.currentUpdate?.includes("poorly differentiated")).length).toBe(2);
    for (const clinicalCase of spleen.SPLENECTOMY_INFECTION_PREVENTION_CASES.filter((item) => item.id.startsWith("case.asplenia-fever"))) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.resultGateAfter).toBeNull();
      expect(clinicalCase.decisionNodes[0]?.answerChoices.find((answer) => answer.isCorrect)?.label).toBe("Seek emergency care now");
    }
    expect(spleen.SPLENECTOMY_INFECTION_PREVENTION_CASE_REVIEWS.filter((review) => review.acuity === "urgent")).toHaveLength(4);
  });

  it("does not make a clinic answer uniquely longest", () => {
    const violations = cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.flatMap((node) => {
      const correct = node.answerChoices.find((answer) => answer.isCorrect)!;
      const longestDistractor = Math.max(...node.answerChoices.filter((answer) => !answer.isCorrect).map((answer) => answer.label.length));
      return correct.label.length > longestDistractor ? [node.questionVariantId] : [];
    }));
    expect(violations).toEqual([]);
  });
});
