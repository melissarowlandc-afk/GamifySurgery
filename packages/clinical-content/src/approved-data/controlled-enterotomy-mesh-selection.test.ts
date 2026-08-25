import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_044_APPROVED_BACKLOG,
  ROW_044_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_044_CLINICAL_APPROVAL,
  ROW_044_CONCEPTS,
  ROW_044_CONTENT_VERSION,
  ROW_044_EVIDENCE_CLAIMS,
  ROW_044_QUESTION_VARIANTS,
  ROW_044_SOURCES,
} from "./controlled-enterotomy-mesh-selection";

describe("owner row 44 approved controlled-enterotomy mesh content", () => {
  it("records one Future Hospital OR FSRS identity without a numeric level", () => {
    expect(ROW_044_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-044.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_044_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection",
      ],
      approvedReleasePointIds: ["release.future.hospital_or"],
      decision: "approved",
    });
    expect(ROW_044_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 44,
      sourceRecordKey: "owner-concept.sheet1.row-044",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-044.future-hospital-or-controlled-enterotomy-mesh.2026-08-06",
    });
    expect(ROW_044_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection",
        conceptType: "management",
        releasePointId: "release.future.hospital_or",
        earliestFacilityStage: null,
        requiredClinicalSetting: "hospital_or",
        currentGameEligibility: "deferred",
      }),
    ]);
  });

  it("stores four complete single-select variants with shuffled answers", () => {
    expect(ROW_044_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_044_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_044_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_044_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe(
        "release.future.hospital_or",
      );
      expect(variant.earliestFacilityStage).toBeNull();
      expect(variant.requiredClinicalSetting).toBe("hospital_or");
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
      ROW_044_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Permanent macroporous monofilament synthetic mesh",
      "Permanent, monofilament, and macroporous",
      "Stable patient with a repaired enterotomy, source control, and no gross spillage",
      "Persistent gross enteric spillage despite attempted source control",
    ]);
  });

  it("prevents the keyed answer from becoming a unique length cue", () => {
    for (const variant of ROW_044_QUESTION_VARIANTS) {
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

  it("requires a selected single-stage repair rather than making mesh automatic", () => {
    const allText = [
      ...ROW_044_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_044_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "does not automatically preclude a selected single-stage mesh repair",
    );
    expect(allText).toContain(
      "only after the team has determined that single-stage repair is appropriate",
    );
    expect(allText).toContain(
      "not permission to proceed after every enterotomy",
    );
  });

  it("preserves source-control, contamination, and safety boundaries", () => {
    const allText = [
      ...ROW_044_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_044_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain("securely repaired");
    expect(allText).toContain("adequate source control");
    expect(allText).toContain("minimal controlled contamination");
    expect(allText).toContain("persistent gross enteric");
    expect(allText).toContain("uncertain bowel viability");
    expect(allText).toContain(
      "does not by itself prescribe tissue repair",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_044_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_044_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_044_SOURCES).toHaveLength(4);
    for (const source of ROW_044_SOURCES) {
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

    for (const claim of ROW_044_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_044_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the package outside the current runtime", () => {
    expect(ROW_044_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_operational_hernia_management",
      releasePointId: "release.future.hospital_or",
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_or",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_044_CONCEPTS) {
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
