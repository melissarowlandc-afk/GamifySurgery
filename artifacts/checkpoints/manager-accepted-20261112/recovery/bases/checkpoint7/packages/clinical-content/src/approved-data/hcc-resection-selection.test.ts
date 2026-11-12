import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import { ROW_029_CONCEPT } from "./hcc-milan-criteria";
import {
  ROW_092_CASES,
  ROW_092_CONCEPT,
  ROW_092_EVIDENCE_CLAIMS,
  ROW_092_QUESTION_VARIANTS,
  ROW_092_SOURCES,
} from "./hcc-resection-selection";

describe("owner row 92 HCC resection-selection package", () => {
  it("keeps one new management concept, four variants, and five active cases", () => {
    expect(ROW_092_CONCEPT.id).toBe("concept.hcc.compensated-cirrhosis-resection-selection");
    expect(ROW_092_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_092_CASES).toHaveLength(5);
  });

  it("authors each new row-92 decision with three shuffled choices and one key", () => {
    for (const variant of ROW_092_QUESTION_VARIANTS) {
      expect(variant.answerChoices).toHaveLength(3);
      expect(variant.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    }
    for (const clinicalCase of ROW_092_CASES.slice(0, 4)) {
      expect(clinicalCase.decisionNodes[0]!.shuffleAnswers).toBe(true);
      expect(clinicalCase.decisionNodes[0]!.resultGateAfter).toBeNull();
    }
  });

  it("keeps the combined encounter as Milan first and resection selection second", () => {
    const combined = ROW_092_CASES[4]!;
    expect(combined.decisionNodes.map((node) => node.primaryConceptId)).toEqual([
      ROW_029_CONCEPT.id,
      ROW_092_CONCEPT.id,
    ]);
    expect(combined.decisionNodes[0]!.id).not.toBe("node.hcc.milan.solitary-within.v1");
    expect(combined.decisionNodes[0]!.resultGateAfter).toBeNull();
    expect(combined.decisionNodes[0]!.terminalDispositions).toEqual([]);
  });

  it("preserves favorable-profile and portal-hypertension boundaries", () => {
    const text = JSON.stringify(ROW_092_CASES);
    expect(text).toContain("no clinically significant portal hypertension");
    expect(text).toContain("adequate future liver remnant");
    expect(JSON.stringify(ROW_092_EVIDENCE_CLAIMS)).toContain("as an absolute contraindication");
  });

  it("keeps source metadata review separate and admits each case exactly once", () => {
    expect(ROW_092_SOURCES).toHaveLength(1);
    expect(ROW_092_SOURCES[0]?.id).toBe("source.aasld.hcc-practice-guidance.2023");
    expect(ROW_092_SOURCES[0]?.reviewStatus).toBe("needs_clinician_review");
    expect(ROW_092_EVIDENCE_CLAIMS.every((claim) => claim.reviewStatus === "clinically_approved")).toBe(true);
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    for (const approvedCase of ROW_092_CASES) {
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((clinicalCase) => clinicalCase.id === approvedCase.id)).toHaveLength(1);
    }
  });
});
