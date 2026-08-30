import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_049_APPROVED_BACKLOG,
  ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_049_CLINICAL_APPROVAL,
  ROW_049_CONCEPTS,
  ROW_049_CONTENT_VERSION,
  ROW_049_EVIDENCE_CLAIMS,
  ROW_049_QUESTION_VARIANTS,
  ROW_049_SOURCES,
} from "./peptic-ulcer-bleeding-hemostasis";

describe("owner row 49 approved peptic-ulcer hemostasis package", () => {
  it("records the exact two-concept clinician approval", () => {
    expect(ROW_049_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-049.2026-08-10",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-10",
      contentVersion: ROW_049_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 49,
        sourceRecordKey: "owner-concept.sheet1.row-049",
      },
      approvedConceptIds: [
        "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
        "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
      ],
      approvedReleasePointIds: [
        "release.l2.endoscopy",
        "release.future.hospital_floor",
      ],
      decision: "approved",
    });
    expect(ROW_049_CONCEPTS).toHaveLength(2);
    expect(
      ROW_049_CONCEPTS.every(
        (concept) =>
          concept.conceptType === "management" &&
          concept.earliestFacilityStage === 2,
      ),
    ).toBe(true);
  });

  it("stores nine reviewed variants behind brief patient presentations", () => {
    expect(ROW_049_QUESTION_VARIANTS).toHaveLength(9);
    for (const variant of ROW_049_QUESTION_VARIANTS) {
      expect(variant.patientPresentation.trim().length).toBeGreaterThan(30);
      expect(variant.presentationVariantId).toMatch(/^presentation\./);
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.reviewStatus).toBe("clinically_approved");
      expect(variant.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-10",
        contentVersion: ROW_049_CONTENT_VERSION,
      });
    }
  });

  it("keeps stable endoscopy and active hospital scopes separate", () => {
    const levelTwo = ROW_049_QUESTION_VARIANTS.filter(
      (variant) => variant.releasePointId === "release.l2.endoscopy",
    );
    const hospital = ROW_049_QUESTION_VARIANTS.filter(
      (variant) =>
        variant.releasePointId === "release.future.hospital_floor",
    );
    expect(levelTwo).toHaveLength(5);
    expect(hospital).toHaveLength(4);
    expect(
      levelTwo.every(
        (variant) =>
          variant.requiredClinicalSetting === "endoscopy" &&
          variant.requiredCapabilityIds.includes("capability.endoscopy"),
      ),
    ).toBe(true);
    expect(
      hospital.every(
        (variant) =>
          variant.requiredClinicalSetting === "hospital_floor" &&
          variant.requiredCapabilityIds.length === 0,
      ),
    ).toBe(true);
  });

  it("admits every variant once through two sequential and five single-decision blueprints", () => {
    expect(ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(7);
    expect(
      ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS.filter(
        (blueprint) => blueprint.maximumScoredDecisions === 2,
      ),
    ).toHaveLength(2);
    expect(
      ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS.filter(
        (blueprint) => blueprint.maximumScoredDecisions === 1,
      ),
    ).toHaveLength(5);

    const questionIds = ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS.flatMap(
      (blueprint) => blueprint.questionVariantIds,
    );
    expect(questionIds).toHaveLength(9);
    expect(new Set(questionIds).size).toBe(9);
    expect(new Set(questionIds)).toEqual(
      new Set(ROW_049_QUESTION_VARIANTS.map((variant) => variant.id)),
    );
  });

  it("preserves the nine reviewed answer keys", () => {
    expect(
      ROW_049_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)?.label,
      ),
    ).toEqual([
      "Perform endoscopic hemostasis",
      "Ulcer with a nonbleeding visible vessel",
      "Clean-based ulcer",
      "Perform endoscopic hemostasis",
      "Epinephrine injection alone",
      "Thermal therapy or clipping may be used without epinephrine",
      "Apply bipolar coagulation to the vessel",
      "Epinephrine injection plus endoscopic clipping",
      "Epinephrine followed only by another epinephrine injection",
    ]);
  });

  it("does not make the correct answer uniquely longest", () => {
    for (const variant of ROW_049_QUESTION_VARIANTS) {
      const correctLength =
        variant.answerChoices.find((choice) => choice.isCorrect)?.label
          .length ?? 0;
      expect(
        variant.answerChoices.some(
          (choice) =>
            !choice.isCorrect && choice.label.length >= correctLength,
        ),
      ).toBe(true);
    }
  });

  it("preserves the modality boundaries used to author hard distractors", () => {
    const inadequate = ROW_049_QUESTION_VARIANTS.find((variant) =>
      variant.id.includes("inadequate-monotherapy"),
    )!;
    expect(inadequate.stem).toContain("inappropriate");
    expect(
      inadequate.answerChoices.find((choice) => choice.isCorrect)?.label,
    ).toBe("Epinephrine injection alone");
    expect(
      inadequate.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => choice.label),
    ).toEqual([
      "Epinephrine plus bipolar coagulation",
      "Bipolar coagulation alone",
      "Endoscopic clip alone",
    ]);

    const activeVariants = ROW_049_QUESTION_VARIANTS.filter(
      (variant) =>
        variant.conceptId ===
          "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality" &&
        variant.requiredClinicalSetting === "hospital_floor",
    );
    expect(activeVariants).toHaveLength(3);
    expect(
      activeVariants.every((variant) =>
        variant.supportingEvidenceClaimIds.includes(
          "claim.peptic-ulcer-bleeding.selected-advanced-monotherapy-boundary",
        ),
      ),
    ).toBe(true);
  });

  it("retains complete source-to-claim provenance", () => {
    const sourceIds = new Set(ROW_049_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_049_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_049_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-10");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_049_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-10",
        contentVersion: ROW_049_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-10");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("activates only approved Level 2 content and retains future exclusion", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(ROW_049_APPROVED_BACKLOG).toMatchObject({
      approvedForRuntime: true,
      currentGameEligibility: "partially_active_level_2_future_hospital_floor_excluded",
      earliestFacilityStage: 2,
      maximumScoredDecisionsPerEncounter: 2,
    });
    for (const concept of ROW_049_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (candidate) => candidate.id === concept.id,
        ),
      ).toBe(true);
    }
  });
});
