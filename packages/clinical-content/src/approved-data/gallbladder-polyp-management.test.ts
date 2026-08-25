import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_119_CASES,
  ROW_119_CLINICAL_APPROVAL,
  ROW_119_CONCEPT,
  ROW_119_CONTENT_VERSION,
  ROW_119_EVIDENCE_CLAIMS,
  ROW_119_QUESTION_VARIANTS,
  ROW_119_SOURCES,
} from "./gallbladder-polyp-management";

describe("owner row 119 approved gallbladder-polyp management package", () => {
  it("records one exact clinician-approved Level 0 management identity", () => {
    expect(ROW_119_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-119.2026-08-21",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-21",
      contentVersion: ROW_119_CONTENT_VERSION,
      approvedConceptId: "concept.gallbladder-polyp.initial-management-category",
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
    });
    expect(ROW_119_CONCEPT).toMatchObject({
      id: "concept.gallbladder-polyp.initial-management-category",
      conceptType: "management",
      earliestFacilityStage: 0,
    });
  });

  it("preserves the six owner-approved keys", () => {
    expect(ROW_119_CASES).toHaveLength(6);
    expect(ROW_119_QUESTION_VARIANTS).toHaveLength(6);
    expect(
      ROW_119_CASES.map((clinicalCase) =>
        clinicalCase.decisionNodes[0]?.answerChoices.find(
          (choice) => choice.isCorrect,
        )?.label,
      ),
    ).toEqual([
      "Refer for cholecystectomy evaluation",
      "Refer for cholecystectomy evaluation",
      "Ultrasound surveillance for this patient",
      "No further follow-up after this report",
      "7 mm polyp with 5 mm adjacent focal wall thickening",
      "8 mm thick-stalk polyp without wall thickening",
    ]);
  });

  it("keeps every case to one shuffled, three-choice final decision", () => {
    for (const clinicalCase of ROW_119_CASES) {
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.routineEligible).toBe(true);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const [node] = clinicalCase.decisionNodes;
      expect(node?.answerChoices).toHaveLength(3);
      expect(node?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node?.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(node?.shuffleAnswers).toBe(true);
      expect(node?.resultGateAfter).toBeNull();
      expect(node?.terminalDispositions).toHaveLength(2);
    }
  });

  it("preserves framework disagreement and excludes a hybrid schedule", () => {
    const disagreement = ROW_119_EVIDENCE_CLAIMS.find((claim) =>
      claim.id.includes("threshold-disagreement"),
    );
    expect(disagreement?.statement).toContain("European guideline");
    expect(disagreement?.statement).toContain("SRU and CAR");
    expect(disagreement?.limitation).toContain("does not teach a hybrid rule");
    expect(ROW_119_CLINICAL_APPROVAL.excludedElements).toContain(
      "exact_surveillance_schedules",
    );
  });

  it("keeps complete source-to-claim links while sources await review", () => {
    expect(ROW_119_SOURCES).toHaveLength(3);
    const sourceIds = new Set(ROW_119_SOURCES.map((source) => source.id));
    for (const source of ROW_119_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.evidenceClaimIds).toHaveLength(2);
    }
    for (const claim of ROW_119_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastCheckedOn).toBe("2026-08-21");
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits the six reviewed cases exactly once", () => {
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => concept.id === ROW_119_CONCEPT.id,
      ),
    ).toHaveLength(1);
    for (const clinicalCase of ROW_119_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.filter(
          (candidate) => candidate.id === clinicalCase.id,
        ),
      ).toHaveLength(1);
    }
  });
});
