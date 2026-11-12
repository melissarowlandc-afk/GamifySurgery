import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_041_APPROVED_BACKLOG,
  ROW_041_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_041_CLINICAL_APPROVAL,
  ROW_041_CONCEPTS,
  ROW_041_CONTENT_VERSION,
  ROW_041_EVIDENCE_CLAIMS,
  ROW_041_QUESTION_VARIANTS,
  ROW_041_SOURCES,
} from "./postoperative-ileus";

describe("owner row 41 approved prolonged postoperative-ileus content", () => {
  it("records one Future Hospital Floor concept with no numeric level", () => {
    expect(ROW_041_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-041.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_041_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible",
      ],
      approvedReleasePointIds: ["release.future.hospital_floor"],
      decision: "approved",
    });
    expect(ROW_041_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 41,
      sourceRecordKey: "owner-concept.sheet1.row-041",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-041.future-hospital-floor-parenteral-nutrition.2026-08-06",
    });
    expect(ROW_041_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible",
        conceptType: "management",
        releasePointId: "release.future.hospital_floor",
        earliestFacilityStage: null,
        requiredClinicalSetting: "hospital_floor",
        requiredCapabilityIds: [],
      }),
    ]);
  });

  it("stores four exact single-select variants and complete distractors", () => {
    expect(ROW_041_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_041_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_041_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_041_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe(
        "release.future.hospital_floor",
      );
      expect(variant.earliestFacilityStage).toBeNull();
      expect(variant.requiredClinicalSetting).toBe("hospital_floor");
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
      ROW_041_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Initiate parenteral nutrition",
      "Initiate parenteral nutrition",
      "POD 8 with severe ileus, no obstruction, and enteral feeding infeasible",
      "Provide nutrition while enteral feeding remains infeasible",
    ]);
  });

  it("prevents the keyed answer from becoming a length cue", () => {
    for (const variant of ROW_041_QUESTION_VARIANTS) {
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
      ).toBeLessThanOrEqual(90);
    }
  });

  it("preserves the nutrition indication and treatment boundary", () => {
    const allText = [
      ...ROW_041_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_041_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "A postoperative-day number or high nasogastric output alone is insufficient",
    );
    expect(allText).toContain(
      "does not establish a universal instruction to delay nutrition until day seven",
    );
    expect(allText).toContain(
      "does not directly restore bowel motility",
    );
    expect(allText).toContain(
      "does not treat the ileus itself",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_041_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_041_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_041_SOURCES).toHaveLength(2);
    for (const source of ROW_041_SOURCES) {
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

    for (const claim of ROW_041_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_041_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the approved future package outside the current runtime", () => {
    expect(ROW_041_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_postoperative_management",
      releasePointId: "release.future.hospital_floor",
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_floor",
      requiredCapabilityIds: [],
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_041_CONCEPTS) {
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
