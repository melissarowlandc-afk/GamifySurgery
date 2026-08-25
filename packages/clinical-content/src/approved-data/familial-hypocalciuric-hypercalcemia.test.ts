import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_060_APPROVED_BACKLOG,
  ROW_060_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_060_CASES,
  ROW_060_CLINICAL_APPROVAL,
  ROW_060_CONCEPTS,
  ROW_060_CONTENT_VERSION,
  ROW_060_EVIDENCE_CLAIMS,
  ROW_060_QUESTION_VARIANTS,
  ROW_060_SOURCES,
} from "./familial-hypocalciuric-hypercalcemia";

const CONCEPT_IDS = [
  "concept.fhh.biochemical-evaluation",
  "concept.fhh.recognition-and-confirmation",
  "concept.fhh.avoid-parathyroid-surgery",
];

describe("owner row 60 approved FHH package", () => {
  it("records the clinician approval and three stable FSRS identities", () => {
    expect(ROW_060_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-060.2026-08-13",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-13",
      contentVersion: ROW_060_CONTENT_VERSION,
      decision: "approved",
    });
    expect(ROW_060_CONCEPTS.map((concept) => concept.id)).toEqual(CONCEPT_IDS);
    expect(ROW_060_CONCEPTS.map((concept) => concept.conceptType)).toEqual([
      "workup",
      "diagnosis",
      "management",
    ]);
  });

  it("stores four encounter variants as five single-select scored decisions", () => {
    expect(ROW_060_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);
    expect(ROW_060_QUESTION_VARIANTS).toHaveLength(5);
    expect(ROW_060_CASES).toHaveLength(4);
    expect(ROW_060_CASES.map((clinicalCase) => clinicalCase.decisionNodes.length))
      .toEqual([2, 1, 1, 1]);

    expect(
      ROW_060_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)?.label,
      ),
    ).toEqual([
      "24-hour urine calcium and creatinine with paired serum values",
      "Reassure and observe without surgery",
      "Suspect FHH and arrange genetic testing",
      "Reassure and observe without parathyroid surgery",
      "Parathyroidectomy usually does not correct FHH",
    ]);

    for (const variant of ROW_060_QUESTION_VARIANTS) {
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.reviewStatus).toBe("clinically_approved");
      expect(variant.releasePointId).toBe("release.l0.clinic_evaluation");

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

  it("uses hypocalciuria as a clue and never makes it independently diagnostic", () => {
    const text = JSON.stringify({
      variants: ROW_060_QUESTION_VARIANTS,
      claims: ROW_060_EVIDENCE_CLAIMS,
    });
    expect(text).toMatch(/hypocalciuria/i);
    expect(text).not.toMatch(/comes back with hypercalciuria/i);
    expect(text).toContain("cannot confirm the diagnosis by itself");
    expect(text).toContain("Diagnose FHH from the clearance ratio alone");
    expect(
      ROW_060_QUESTION_VARIANTS.find((variant) =>
        variant.id.includes("suggestive-results"),
      )?.answerChoices.find(
        (choice) => choice.id === "ratio_alone_confirms_fhh",
      )?.isCorrect,
    ).toBe(false);
  });

  it("authors the return as a later confirmed follow-up without a generic timer", () => {
    const pathway = ROW_060_CASES[0];
    expect(pathway?.decisionNodes.map((node) => node.primaryConceptId)).toEqual([
      "concept.fhh.biochemical-evaluation",
      "concept.fhh.avoid-parathyroid-surgery",
    ]);
    expect(pathway?.decisionNodes[0]?.resultGateAfter).toBeNull();
    expect(pathway?.decisionNodes[1]?.stem).toContain(
      "At a later endocrine follow-up",
    );
    expect(pathway?.decisionNodes[1]?.stem).toContain(
      "pathogenic CASR result confirm FHH",
    );
  });

  it("excludes the two removed variants", () => {
    expect(ROW_060_APPROVED_BACKLOG.excludedQuestionVariantIds).toEqual([
      "question.fhh.confounded-low-ratio-limitation.v1",
      "question.fhh.reverse-recognition.v1",
    ]);
    expect(
      ROW_060_QUESTION_VARIANTS.some(
        (variant) =>
          variant.id.includes("confounded-low-ratio") ||
          variant.id.includes("reverse-recognition"),
      ),
    ).toBe(false);
  });

  it("maps approved claims to complete sources retained in source review", () => {
    const sourceIds = new Set(ROW_060_SOURCES.map((source) => source.id));
    const claimIds = new Set(ROW_060_EVIDENCE_CLAIMS.map((claim) => claim.id));
    for (const source of ROW_060_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(1900);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-13");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }
    for (const claim of ROW_060_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastCheckedOn).toBe("2026-08-13");
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits the approved Level 0 package to the development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    const activeConceptIds = new Set(
      SYNTHETIC_CLINICAL_RELEASE.concepts.map((concept) => concept.id),
    );
    const activeCaseIds = new Set(
      SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) => clinicalCase.id),
    );
    for (const conceptId of CONCEPT_IDS) {
      expect(activeConceptIds.has(conceptId)).toBe(true);
    }
    for (const clinicalCase of ROW_060_CASES) {
      expect(activeCaseIds.has(clinicalCase.id)).toBe(true);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
    }
  });
});
