import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_042_APPROVED_BACKLOG,
  ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_042_CLINICAL_APPROVAL,
  ROW_042_CONCEPTS,
  ROW_042_CONTENT_VERSION,
  ROW_042_EVIDENCE_CLAIMS,
  ROW_042_QUESTION_VARIANTS,
  ROW_042_SOURCES,
} from "./gastric-splenectomy";

describe("owner row 42 approved gastric splenectomy content", () => {
  it("records one FSRS identity with the approved staged release plan", () => {
    expect(ROW_042_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-042.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_042_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance",
      ],
      approvedReleasePointIds: [
        "release.l2.endoscopy",
        "release.future.hospital_or",
      ],
      decision: "approved",
    });
    expect(ROW_042_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 42,
      sourceRecordKey: "owner-concept.sheet1.row-042",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-042.staged-prophylactic-splenectomy-avoidance.2026-08-06",
    });
    expect(ROW_042_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance",
        conceptType: "management",
        releasePointIds: [
          "release.l2.endoscopy",
          "release.future.hospital_or",
        ],
        earliestFacilityStage: 2,
        eligibleClinicalSettings: ["endoscopy", "hospital_or"],
      }),
    ]);
  });

  it("stores two Level 2 and two Future Hospital OR variants", () => {
    expect(ROW_042_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    const level2 = ROW_042_QUESTION_VARIANTS.filter(
      (variant) => variant.releasePointId === "release.l2.endoscopy",
    );
    const hospitalOr = ROW_042_QUESTION_VARIANTS.filter(
      (variant) =>
        variant.releasePointId === "release.future.hospital_or",
    );
    expect(level2).toHaveLength(2);
    expect(hospitalOr).toHaveLength(2);

    for (const variant of level2) {
      expect(variant.earliestFacilityStage).toBe(2);
      expect(variant.requiredClinicalSetting).toBe("endoscopy");
      expect(variant.requiredCapabilityIds).toEqual([
        "capability.endoscopy",
      ]);
    }
    for (const variant of hospitalOr) {
      expect(variant.earliestFacilityStage).toBeNull();
      expect(variant.requiredClinicalSetting).toBe("hospital_or");
      expect(variant.requiredCapabilityIds).toEqual([]);
    }
  });

  it("stores four complete single-select variants with shuffled answers", () => {
    for (const variant of ROW_042_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_042_CONCEPTS[0]!.id);
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
      ROW_042_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Avoid routine prophylactic splenectomy",
      "Spleen preservation maintains survival with less morbidity",
      "Proximal cancer without greater-curvature, splenic, or hilar involvement",
      "Direct extension of the tumor into the spleen",
    ]);
  });

  it("prevents the keyed answer from becoming a unique length cue", () => {
    for (const variant of ROW_042_QUESTION_VARIANTS) {
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

  it("preserves the narrow evidence boundary without teaching never splenectomy", () => {
    const allText = [
      ...ROW_042_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_042_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain("without greater-curvature invasion");
    expect(allText).toContain("direct splenic invasion");
    expect(allText).toContain("suspected splenic-hilar disease");
    expect(allText).toContain(
      "not a rule that splenectomy is never appropriate",
    );
    expect(allText).toContain(
      "does not independently prescribe an operation",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_042_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_042_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_042_SOURCES).toHaveLength(3);
    for (const source of ROW_042_SOURCES) {
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

    for (const claim of ROW_042_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_042_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps both approved stages outside the current Level 0-1 runtime", () => {
    expect(ROW_042_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_operational_oncology",
      releasePointIds: [
        "release.l2.endoscopy",
        "release.future.hospital_or",
      ],
      earliestFacilityStage: 2,
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_042_CONCEPTS) {
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
