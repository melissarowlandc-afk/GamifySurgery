import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_039_APPROVED_BACKLOG,
  ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_039_CLINICAL_APPROVAL,
  ROW_039_CONCEPTS,
  ROW_039_CONTENT_VERSION,
  ROW_039_EVIDENCE_CLAIMS,
  ROW_039_QUESTION_VARIANTS,
  ROW_039_SOURCES,
} from "./gastric-malt-lymphoma";

describe("owner row 39 approved gastric MALT content", () => {
  it("records two Level 2 FSRS concepts with exact owner approval", () => {
    expect(ROW_039_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-039.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_039_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.gastric-malt-lymphoma.pathologic-recognition",
        "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      ],
      approvedReleasePointIds: ["release.l2.endoscopy"],
      decision: "approved",
    });
    expect(ROW_039_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 39,
      sourceRecordKey: "owner-concept.sheet1.row-039",
      approvedScopeDecisionId:
        "decision.owner-row-039.two-concept-integrated-pathology-and-eradication.2026-08-06",
    });
    expect(ROW_039_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.gastric-malt-lymphoma.pathologic-recognition",
        conceptType: "diagnosis",
        earliestFacilityStage: 2,
      }),
      expect.objectContaining({
        id: "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
        conceptType: "management",
        earliestFacilityStage: 2,
      }),
    ]);
  });

  it("stores six complete single-select variants and four approved blueprints", () => {
    expect(ROW_039_QUESTION_VARIANTS).toHaveLength(6);
    expect(ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_039_QUESTION_VARIANTS) {
      expect(variant.releasePointId).toBe("release.l2.endoscopy");
      expect(variant.requiredClinicalSetting).toBe("endoscopy");
      expect(variant.requiredCapabilityIds).toEqual([
        "capability.endoscopy",
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
      ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS.map(
        (blueprint) => blueprint.maximumScoredDecisions,
      ),
    ).toEqual([2, 2, 1, 1]);
  });

  it("prevents answer length from identifying the keyed answer", () => {
    for (const variant of ROW_039_QUESTION_VARIANTS) {
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
      ).toBeLessThanOrEqual(100);
    }
  });

  it("preserves the CD20 and eradication-follow-up boundaries", () => {
    const allText = [
      ...ROW_039_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_039_QUESTION_VARIANTS.map(
        (variant) => `${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "CD20 establishes B-cell lineage but is not specific for MALT lymphoma",
    );
    expect(allText).toContain(
      "without concurrent gastrectomy, chemotherapy, or radiotherapy",
    );
    expect(allText).toContain(
      "confirmation that H. pylori was eradicated",
    );
    expect(allText).toContain(
      "does not assign one universal second-line treatment",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_039_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_039_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_039_SOURCES).toHaveLength(4);
    for (const source of ROW_039_SOURCES) {
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

    for (const claim of ROW_039_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_039_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("activates the approved Level 2 package", () => {
    expect(ROW_039_APPROVED_BACKLOG).toMatchObject({
      releasePointId: "release.l2.endoscopy",
      earliestFacilityStage: 2,
      requiredClinicalSetting: "endoscopy",
      currentGameEligibility: "active_level_2",
      approvedForRuntime: true,
      maximumScoredDecisionsPerEncounter: 2,
    });

    for (const concept of ROW_039_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (runtimeConcept) => runtimeConcept.id === concept.id,
        ),
      ).toBe(true);
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
          clinicalCase.decisionNodes.some(
            (node) => node.primaryConceptId === concept.id,
          ),
        ),
      ).toBe(true);
    }
  });
});
