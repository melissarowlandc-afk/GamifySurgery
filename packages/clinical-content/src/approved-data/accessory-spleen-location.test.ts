import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_058_CASES,
  ROW_058_CONCEPT,
  ROW_058_EVIDENCE_CLAIMS,
  ROW_058_QUESTION_VARIANTS,
  ROW_058_SOURCES,
} from "./accessory-spleen-location";

describe("owner row 58 accessory-spleen location package", () => {
  it("records one L0 anatomy concept with four approved variants and cases", () => {
    expect(ROW_058_CONCEPT).toMatchObject({
      id: "concept.accessory-spleen.common-location",
      earliestFacilityStage: 0,
      conceptType: "anatomy",
    });
    expect(ROW_058_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_058_CASES).toHaveLength(4);
  });

  it("uses the approved splenic-hilum keys and three-choice shuffled decisions", () => {
    expect(ROW_058_QUESTION_VARIANTS.map((variant) => variant.answerChoices.find((choice) => choice.isCorrect)?.label)).toEqual([
      "Splenic hilum",
      "Adjacent to the splenic hilum",
      "Splenic hilum",
      "Nodule at the splenic hilum",
    ]);
    for (const clinicalCase of ROW_058_CASES) {
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      expect(node.terminalDispositions).toHaveLength(2);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
    }
  });

  it("keeps hospital referral framing without unapproved operative-management teaching", () => {
    const text = JSON.stringify(ROW_058_CASES);
    expect(text).toContain("hospital splenectomy");
    expect(text).not.toMatch(/completion splenectomy|recurrent hemolysis|reoperation/i);
    expect(JSON.stringify(ROW_058_EVIDENCE_CLAIMS)).toContain("not establish that inspection of that one location alone is sufficient");
  });

  it("records the primary source and independent cross-check with complete linkage", () => {
    expect(ROW_058_SOURCES).toHaveLength(2);
    expect(ROW_058_SOURCES[0]).toMatchObject({
      id: "source.vikse.accessory-spleen-meta-analysis.2017",
      doi: "10.1016/j.ijsu.2017.07.045",
      pmid: "28716661",
      reviewStatus: "needs_clinician_review",
    });
    expect(ROW_058_SOURCES[1]).toMatchObject({
      id: "source.ncbi-bookshelf.accessory-spleen.2023",
      pmid: "30085582",
      usageRole: "cross_check",
      reviewStatus: "needs_clinician_review",
    });
    for (const claim of ROW_058_EVIDENCE_CLAIMS) {
      expect(claim.sourceIds).toEqual(ROW_058_SOURCES.map((source) => source.id));
      for (const source of ROW_058_SOURCES) {
        expect(source.evidenceClaimIds).toContain(claim.id);
      }
    }
    expect(ROW_058_EVIDENCE_CLAIMS.every((claim) => claim.reviewStatus === "clinically_approved")).toBe(true);
  });

  it("admits every approved case exactly once", () => {
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    for (const approvedCase of ROW_058_CASES) {
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((clinicalCase) => clinicalCase.id === approvedCase.id)).toHaveLength(1);
    }
  });
});
