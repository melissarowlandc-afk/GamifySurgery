import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_038_APPROVED_BACKLOG,
  ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_038_CLINICAL_APPROVAL,
  ROW_038_CONCEPTS,
  ROW_038_CONTENT_VERSION,
  ROW_038_EVIDENCE_CLAIMS,
  ROW_038_QUESTION_VARIANTS,
  ROW_038_SOURCES,
} from "./vitamin-c-collagen-hydroxylation";

describe("owner row 38 approved vitamin-C collagen-hydroxylation content", () => {
  it("records one Level 2 applied-science FSRS identity", () => {
    expect(ROW_038_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-038.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_038_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.wound-healing.vitamin-c-collagen-hydroxylation",
      ],
      approvedReleasePointIds: ["release.l2.endoscopy"],
      decision: "approved",
    });
    expect(ROW_038_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 38,
      sourceRecordKey: "owner-concept.sheet1.row-038",
      approvedScopeDecisionId:
        "decision.owner-row-038.general-collagen-hydroxylation-not-type-three-specific.2026-08-06",
    });
    expect(ROW_038_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.wound-healing.vitamin-c-collagen-hydroxylation",
        conceptType: "applied_science",
        earliestFacilityStage: 2,
      }),
    ]);
  });

  it("stores the four exact single-select variants and complete distractors", () => {
    expect(ROW_038_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_038_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_038_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe("release.l2.endoscopy");
      expect(variant.requiredClinicalSetting).toBe("periop_recovery");
      expect(variant.requiredCapabilityIds).toEqual([
        "capability.periop_recovery",
      ]);
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
      ROW_038_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Vitamin C",
      "Hydroxylation of proline and lysine residues in procollagen",
      "It supports the activity of prolyl and lysyl hydroxylases needed for collagen maturation and stability",
      "Impaired proline and lysine hydroxylation, producing less stable collagen",
    ]);
  });

  it("preserves the broad-collagen and supplementation boundaries", () => {
    const allText = [
      ...ROW_038_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_038_QUESTION_VARIANTS.map(
        (variant) => `${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "should not be taught as unique to type III collagen",
    );
    expect(allText).toContain(
      "does not by itself justify routine high-dose supplementation",
    );
    expect(allText).toContain(
      "does not prescribe a dose or treatment protocol",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_038_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_038_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_038_SOURCES).toHaveLength(3);
    for (const source of ROW_038_SOURCES) {
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

    for (const claim of ROW_038_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_038_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the approved Level 2 package outside the playable Level 0-1 release", () => {
    expect(ROW_038_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "foundational",
      releasePointId: "release.l2.endoscopy",
      earliestFacilityStage: 2,
      requiredClinicalSetting: "periop_recovery",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_038_CONCEPTS) {
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
