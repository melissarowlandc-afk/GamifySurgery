import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_040_APPROVED_BACKLOG,
  ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_040_CLINICAL_APPROVAL,
  ROW_040_CONCEPTS,
  ROW_040_CONTENT_VERSION,
  ROW_040_EVIDENCE_CLAIMS,
  ROW_040_QUESTION_VARIANTS,
  ROW_040_SOURCES,
} from "./gastroparesis";

describe("owner row 40 approved gastroparesis diagnostic content", () => {
  it("records one Level 2 workup FSRS identity without a facility gate", () => {
    expect(ROW_040_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-040.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_040_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy",
      ],
      approvedReleasePointIds: ["release.l2.endoscopy"],
      decision: "approved",
    });
    expect(ROW_040_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 40,
      sourceRecordKey: "owner-concept.sheet1.row-040",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-040.four-hour-solid-meal-scintigraphy.2026-08-06",
    });
    expect(ROW_040_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy",
        conceptType: "workup",
        earliestFacilityStage: 2,
      }),
    ]);
  });

  it("stores the four exact single-select variants and complete distractors", () => {
    expect(ROW_040_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_040_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_040_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe("release.l2.endoscopy");
      expect(variant.requiredClinicalSetting).toBe("clinic");
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

    expect(
      ROW_040_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Four-hour solid-meal gastric emptying scintigraphy",
      "Four-hour scintigraphy after a standardized solid meal",
      "Four-hour solid-meal gastric emptying scintigraphy",
      "Delayed solid-meal emptying on four-hour scintigraphy",
    ]);
  });

  it("prevents the keyed answer from becoming a length cue", () => {
    for (const variant of ROW_040_QUESTION_VARIANTS) {
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
      expect(
        correct.label.length,
        `${variant.id} has an overlong chart label`,
      ).toBeLessThanOrEqual(80);
    }
  });

  it("preserves diagnostic prerequisites and the nonemptying-test boundary", () => {
    const allText = [
      ...ROW_040_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_040_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "after mechanical obstruction has been excluded",
    );
    expect(allText).toContain(
      "does not teach an exact abnormal-retention cutoff",
    );
    expect(allText).toContain(
      "Upper endoscopy can help exclude mechanical obstruction",
    );
    expect(allText).toContain(
      "esophageal manometry and ambulatory pH monitoring evaluate different physiologic questions",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_040_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_040_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_040_SOURCES).toHaveLength(3);
    for (const source of ROW_040_SOURCES) {
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

    for (const claim of ROW_040_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_040_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the approved Level 2 package outside the Level 0-1 runtime", () => {
    expect(ROW_040_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "intermediate",
      releasePointId: "release.l2.endoscopy",
      earliestFacilityStage: 2,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: [],
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_040_CONCEPTS) {
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
