import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_045_APPROVED_BACKLOG,
  ROW_045_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_045_CLINICAL_APPROVAL,
  ROW_045_CONCEPTS,
  ROW_045_CONTENT_VERSION,
  ROW_045_EVIDENCE_CLAIMS,
  ROW_045_QUESTION_VARIANTS,
  ROW_045_SOURCES,
} from "./right-thoracotomy-trauma-exposure";

describe("owner row 45 approved right-thoracotomy exposure content", () => {
  it("records one Future ED / Trauma FSRS identity without a numeric level", () => {
    expect(ROW_045_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-045.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_045_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.thoracic-trauma.right-thoracotomy-exposure",
      ],
      approvedReleasePointIds: ["release.future.ed_trauma"],
      decision: "approved",
    });
    expect(ROW_045_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      sourceRow: 45,
      sourceRecordKey: "owner-concept.sheet1.row-045",
      evidencePackageId: "owner-concept-intake-2026-08-05-v3",
      approvedScopeDecisionId:
        "decision.owner-row-045.future-ed-trauma-right-thoracotomy-exposure.2026-08-06",
    });
    expect(ROW_045_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.thoracic-trauma.right-thoracotomy-exposure",
        conceptType: "anatomy",
        releasePointId: "release.future.ed_trauma",
        earliestFacilityStage: null,
        requiredClinicalSetting: "hospital_or",
        currentGameEligibility: "deferred",
      }),
    ]);
  });

  it("stores four complete single-select variants with shuffled answers", () => {
    expect(ROW_045_QUESTION_VARIANTS).toHaveLength(4);
    expect(ROW_045_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);

    for (const variant of ROW_045_QUESTION_VARIANTS) {
      expect(variant.conceptId).toBe(ROW_045_CONCEPTS[0]!.id);
      expect(variant.releasePointId).toBe(
        "release.future.ed_trauma",
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
      ROW_045_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "Right posterolateral thoracotomy",
      "Proximal thoracic esophagus and azygos vein",
      "Right thoracotomy",
      "Traumatic arrest requiring immediate resuscitative chest access",
    ]);
  });

  it("prevents the keyed answer from becoming a unique length cue", () => {
    for (const variant of ROW_045_QUESTION_VARIANTS) {
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

  it("keeps right thoracotomy canonical and posterolateral context-specific", () => {
    const concept = ROW_045_CONCEPTS[0]!;
    const directVariant = ROW_045_QUESTION_VARIANTS[0]!;
    const boundaryVariant = ROW_045_QUESTION_VARIANTS[3]!;
    const allText = [
      concept.learningObjective,
      ...ROW_045_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_045_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(concept.displayName).toContain("Right thoracotomy");
    expect(directVariant.patientPresentation).toContain("stable patient");
    expect(allText).toContain("planned right posterolateral thoracotomy");
    expect(allText).toContain("not the default incision");
    expect(boundaryVariant.explanation).toContain(
      "resuscitative situation",
    );
  });

  it("preserves the approved anatomy and competing-injury boundaries", () => {
    const allText = [
      ...ROW_045_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_045_QUESTION_VARIANTS.map(
        (variant) =>
          `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain("proximal or middle intrathoracic esophagus");
    expect(allText).toContain("intrathoracic trachea");
    expect(allText).toContain("azygos vein");
    expect(allText).toContain("Distal esophageal injuries");
    expect(allText).toContain("dominant left-pleural injury");
    expect(allText).toContain("cardiac or great-arterial injury");
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_045_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_045_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_045_SOURCES).toHaveLength(4);
    for (const source of ROW_045_SOURCES) {
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

    for (const claim of ROW_045_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_045_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the package outside the current runtime", () => {
    expect(ROW_045_APPROVED_BACKLOG).toMatchObject({
      educationalDifficulty: "advanced_trauma_operative_anatomy",
      releasePointId: "release.future.ed_trauma",
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_or",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 1,
    });

    for (const concept of ROW_045_CONCEPTS) {
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
