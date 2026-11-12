import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_043_APPROVED_BACKLOG,
  ROW_043_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_043_CLINICAL_APPROVAL,
  ROW_043_CONCEPTS,
  ROW_043_CONTENT_VERSION,
  ROW_043_EVIDENCE_CLAIMS,
  ROW_043_QUESTION_VARIANTS,
  ROW_043_SOURCES,
} from "./severe-burn-early-enteral-nutrition";

describe("owner row 43 approved severe-burn nutrition content", () => {
  it("records one Future ICU FSRS identity without assigning a numeric level", () => {
    expect(ROW_043_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-043.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_043_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.severe-burn.early-enteral-nutrition",
      ],
      approvedReleasePointIds: ["release.future.icu"],
      decision: "approved",
    });
    expect(ROW_043_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 43,
      sourceRecordKey: "owner-concept.sheet1.row-043",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-043.future-icu-early-enteral-nutrition.2026-08-06",
    });
    expect(ROW_043_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.severe-burn.early-enteral-nutrition",
        conceptType: "management",
        releasePointId: "release.future.icu",
        earliestFacilityStage: null,
        requiredClinicalSetting: "icu",
        currentGameEligibility: "deferred",
      }),
    ]);
  });

  it("stores four complete single-select variants with shuffled answers", () => {
    expect(ROW_043_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_043_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_043_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_043_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe("release.future.icu");
      expect(variant.earliestFacilityStage).toBeNull();
      expect(variant.requiredClinicalSetting).toBe("icu");
      expect(variant.requiredCapabilityIds).toEqual([]);
      expect(variant.patientPresentation).not.toHaveLength(0);
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(
        variant.answerChoices
          .filter((choice) => !choice.isCorrect)
          .every(
            (choice) =>
              typeof choice.distractorRationale === "string" &&
              choice.distractorRationale.length > 0,
          ),
      ).toBe(true);
      expect(variant.reviewStatus).toBe("clinically_approved");
    }
  });

  it("preserves the exact approved keyed answers", () => {
    expect(
      ROW_043_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Begin enteral tube feeding now",
      "As soon as feasible within the first 24 hours",
      "Use enteral nutrition while the GI tract is functional",
      "Extensive burn, adequately resuscitated, with no enteral contraindication",
    ]);
  });

  it("prevents the keyed answer from becoming a unique length cue", () => {
    for (const variant of ROW_043_QUESTION_VARIANTS) {
      const correct = variant.answerChoices.find(
        (choice) => choice.isCorrect,
      )!;
      const longestDistractor = Math.max(
        ...variant.answerChoices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => choice.label.length),
      );

      expect(
        correct.label.length,
        `${variant.id} has a uniquely longest keyed answer`,
      ).toBeLessThanOrEqual(longestDistractor);
      expect(correct.label.length).toBeLessThanOrEqual(90);
    }
  });

  it("uses 24 hours as the rule while retaining eight hours only as scenario context", () => {
    const timingClaim = ROW_043_EVIDENCE_CLAIMS.find((claim) =>
      claim.id.includes("within-24-hours"),
    )!;
    const eightHourVariant = ROW_043_QUESTION_VARIANTS[0]!;
    const canonicalText = [
      ROW_043_CONCEPTS[0]!.learningObjective,
      timingClaim.statement,
      timingClaim.limitation,
      eightHourVariant.explanation,
    ].join(" ");

    expect(timingClaim.statement).toContain("within the first 24 hours");
    expect(timingClaim.limitation).toContain(
      "does not establish eight hours as a universal cutoff",
    );
    expect(eightHourVariant.patientPresentation).toContain("Eight hours");
    expect(eightHourVariant.explanation).toContain(
      "not a universal cutoff",
    );
    expect(canonicalText).not.toContain("must begin within eight hours");
  });

  it("preserves the approved safety and patient-selection boundaries", () => {
    const allText = [
      ...ROW_043_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_043_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain("adequately resuscitated");
    expect(allText).toContain("no enteral contraindication");
    expect(allText).toContain("ongoing shock");
    expect(allText).toContain("suspected intestinal ischemia");
    expect(allText).toContain("mechanical obstruction");
    expect(allText).toContain(
      "does not itself specify parenteral nutrition",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_043_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_043_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_043_SOURCES).toHaveLength(3);
    for (const source of ROW_043_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-06");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_043_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_043_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the package outside the current Level 0-1 runtime", () => {
    expect(ROW_043_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_critical_care_nutrition",
      releasePointId: "release.future.icu",
      earliestFacilityStage: null,
      requiredClinicalSetting: "icu",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_043_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (runtimeConcept) => runtimeConcept.id === concept.id,
        ),
      ).toBe(false);
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
          clinicalCase.decisionNodes.some(
            (node) => node.primaryConceptId === concept.id,
          ),
        ),
      ).toBe(false);
    }
  });
});
