import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_051_APPROVED_BACKLOG,
  ROW_051_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_051_CASES,
  ROW_051_CLINICAL_APPROVAL,
  ROW_051_CONCEPTS,
  ROW_051_CONTENT_VERSION,
  ROW_051_EVIDENCE_CLAIMS,
  ROW_051_FUTURE_QUESTION_VARIANTS,
  ROW_051_QUESTION_VARIANTS,
  ROW_051_SOURCES,
} from "./pancreatic-tail-adenocarcinoma-resection";

const CONCEPT_ID =
  "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy";

describe("owner row 51 approved pancreatic-tail adenocarcinoma resection", () => {
  it("records the clinician approval and one shared FSRS identity", () => {
    expect(ROW_051_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-051.2026-08-10",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-10",
      contentVersion: ROW_051_CONTENT_VERSION,
      decision: "approved",
    });
    expect(ROW_051_CONCEPTS).toEqual([
      expect.objectContaining({
        id: CONCEPT_ID,
        conceptType: "management",
        earliestFacilityStage: 0,
      }),
    ]);
    expect(
      new Set(
        ROW_051_QUESTION_VARIANTS.map((variant) => variant.conceptId),
      ),
    ).toEqual(new Set([CONCEPT_ID]));
  });

  it("stores exactly five approved, single-select variants with keyed answers", () => {
    expect(ROW_051_QUESTION_VARIANTS).toHaveLength(5);
    const keyedAnswers = ROW_051_QUESTION_VARIANTS.map((variant) =>
      variant.answerChoices.find((choice) => choice.isCorrect)?.label,
    );
    expect(keyedAnswers).toEqual([
      "Distal pancreatectomy with splenectomy",
      "Pancreatic tail: distal pancreatectomy with splenectomy",
      "The oncologic distal resection ordinarily includes splenectomy",
      "Resectable tail adenocarcinoma, fit for surgery, no distant disease",
      "Refer for oncologic distal pancreatectomy with splenectomy",
    ]);

    for (const variant of ROW_051_QUESTION_VARIANTS) {
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.reviewStatus).toBe("clinically_approved");
      expect(variant.patientPresentation).toMatch(
        /biopsy-confirmed|biopsy-confirmed,/i,
      );

      const correctLength =
        variant.answerChoices.find((choice) => choice.isCorrect)?.label.length ??
        0;
      const longestWrongLength = Math.max(
        ...variant.answerChoices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => choice.label.length),
      );
      expect(correctLength).toBeLessThanOrEqual(longestWrongLength);
    }
  });

  it("activates four Level 0 counseling cases and defers the Hospital OR variant", () => {
    expect(ROW_051_CASES).toHaveLength(4);
    expect(ROW_051_FUTURE_QUESTION_VARIANTS).toHaveLength(1);
    expect(ROW_051_FUTURE_QUESTION_VARIANTS[0]).toMatchObject({
      id: "question.pancreatic-tail-adenocarcinoma.procedure-by-location.v1",
      releasePointId: "release.future.hospital_or",
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_or",
    });
    expect(ROW_051_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(5);

    for (const clinicalCase of ROW_051_CASES) {
      expect(clinicalCase).toMatchObject({
        releasePointId: "release.l0.clinic_evaluation",
        earliestFacilityStage: 0,
        requiredClinicalSetting: "clinic",
        tutorialEligible: false,
        routineEligible: true,
      });
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(CONCEPT_ID);
    }
  });

  it("keeps resectability and treatment-sequence boundaries explicit", () => {
    const joinedPresentations = ROW_051_QUESTION_VARIANTS.map(
      (variant) => variant.patientPresentation,
    ).join(" ");
    expect(joinedPresentations).toContain("resectable");
    expect(joinedPresentations).toContain("no distant metastases");

    const boundaryClaim = ROW_051_EVIDENCE_CLAIMS.find((claim) =>
      claim.id.includes("surgical-selection-boundary"),
    );
    expect(boundaryClaim?.statement).toContain("necessary but not sufficient");
    expect(boundaryClaim?.limitation).toContain(
      "do not choose neoadjuvant versus upfront treatment",
    );
    expect(ROW_051_APPROVED_BACKLOG.multiDecisionAssessment).toContain(
      "separate diagnosis or staging concepts",
    );
  });

  it("maps every claim to complete source metadata while retaining source review", () => {
    const sourceIds = new Set(ROW_051_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_051_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );
    for (const source of ROW_051_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(1900);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-10");
      expect(source.reuseStatus).not.toBe("metadata_only_rights_reserved");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }
    for (const claim of ROW_051_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastCheckedOn).toBe("2026-08-10");
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits only the active variants to the current synthetic release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.some(
        (concept) => concept.id === CONCEPT_ID,
      ),
    ).toBe(true);
    const activeCaseIds = new Set(
      SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) => clinicalCase.id),
    );
    for (const clinicalCase of ROW_051_CASES) {
      expect(activeCaseIds.has(clinicalCase.id)).toBe(true);
    }
    expect(
      SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
        clinicalCase.decisionNodes.some(
          (node) =>
            node.questionVariantId ===
            "question.pancreatic-tail-adenocarcinoma.procedure-by-location.v1",
        ),
      ),
    ).toBe(false);
  });
});
