import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_046_APPROVED_BACKLOG,
  ROW_046_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_046_CLINICAL_APPROVAL,
  ROW_046_CONCEPTS,
  ROW_046_CONTENT_VERSION,
  ROW_046_EVIDENCE_CLAIMS,
  ROW_046_QUESTION_VARIANTS,
  ROW_046_SOURCES,
} from "./meckel-resection-extent";

describe("owner row 46 approved Meckel resection-extent content", () => {
  it("records one Future Hospital OR FSRS identity without a numeric level", () => {
    expect(ROW_046_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-046.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_046_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.meckel-diverticulum.resection-extent",
      ],
      approvedReleasePointIds: ["release.future.hospital_or"],
      decision: "approved",
    });
    expect(ROW_046_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 46,
      sourceRecordKey: "owner-concept.sheet1.row-046",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-046.future-hospital-or-meckel-resection-extent.2026-08-06",
    });
    expect(ROW_046_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.meckel-diverticulum.resection-extent",
        conceptType: "management",
        releasePointId: "release.future.hospital_or",
        earliestFacilityStage: null,
        requiredClinicalSetting: "hospital_or",
        currentGameEligibility: "deferred",
      }),
    ]);
  });

  it("stores four complete single-select variants with shuffled answers", () => {
    expect(ROW_046_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_046_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_046_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_046_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe("release.future.hospital_or");
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

  it("preserves the exact approved keyed answers in both directions", () => {
    expect(
      ROW_046_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!.label,
      ),
    ).toEqual([
      "Segmental ileal resection including the diverticulum",
      "Simple diverticulectomy",
      "5 cm long, 1 cm healthy base, tip-only inflammation",
      "2 cm long, 2.5 cm inflamed base, with adjacent ileal involvement",
    ]);
  });

  it("prevents the keyed answer from becoming a unique length cue", () => {
    for (const variant of ROW_046_QUESTION_VARIANTS) {
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

  it("uses measured morphology without making 2 cm a universal cutoff", () => {
    const allText = [
      ...ROW_046_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_046_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain("2 cm or greater as broad");
    expect(allText).toContain("not a validated universal cutoff");
    expect(allText).toContain("must not be confused with a 2 cm base-width");
    expect(allText).toContain("adjacent ileum");
    expect(allText).not.toContain(
      "Tangential stapling would narrow the ileal lumen",
    );
  });

  it("preserves the operative boundaries and excludes unrelated Meckel pathways", () => {
    const approval = ROW_046_CLINICAL_APPROVAL;
    const allVariantText = ROW_046_QUESTION_VARIANTS.map(
      (variant) =>
        `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
    ).join(" ");

    expect(allVariantText).toContain("tip-limited inflammation");
    expect(allVariantText).toContain("base and adjacent ileum");
    expect(approval.deferredElements).toContain(
      "incidental_asymptomatic_meckel_management",
    );
    expect(approval.deferredElements).toContain(
      "patent_omphalomesenteric_duct_management",
    );
    expect(approval.deferredElements).toContain(
      "wedge_resection_selection_as_a_separate_tested_decision",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_046_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_046_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_046_SOURCES).toHaveLength(5);
    for (const source of ROW_046_SOURCES) {
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

    for (const claim of ROW_046_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_046_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }

    expect(
      ROW_046_EVIDENCE_CLAIMS.find((claim) =>
        claim.id.includes("two-centimeter-base"),
      ),
    ).toMatchObject({
      certainty: "low",
    });
  });

  it("keeps the package outside the current runtime", () => {
    expect(ROW_046_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_hospital_or_management",
      releasePointId: "release.future.hospital_or",
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_or",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_046_CONCEPTS) {
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
