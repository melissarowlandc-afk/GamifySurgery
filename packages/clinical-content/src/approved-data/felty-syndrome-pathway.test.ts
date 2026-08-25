import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_052_APPROVED_BACKLOG,
  ROW_052_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_052_CASES,
  ROW_052_CLINICAL_APPROVAL,
  ROW_052_CONCEPTS,
  ROW_052_CONTENT_VERSION,
  ROW_052_EVIDENCE_CLAIMS,
  ROW_052_QUESTION_VARIANTS,
  ROW_052_SOURCES,
} from "./felty-syndrome-pathway";

const CONCEPT_IDS = [
  "concept.felty-syndrome.recognition",
  "concept.felty-syndrome.methotrexate-first-line",
  "concept.felty-syndrome.splenectomy-for-refractory-infections",
];

describe("owner row 52 approved Felty syndrome pathway", () => {
  it("records the exact clinician approval and three FSRS identities", () => {
    expect(ROW_052_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-052.2026-08-10",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-10",
      contentVersion: ROW_052_CONTENT_VERSION,
      decision: "approved",
    });
    expect(ROW_052_CONCEPTS.map((concept) => concept.id)).toEqual(CONCEPT_IDS);
    expect(ROW_052_CONCEPTS.map((concept) => concept.conceptType)).toEqual([
      "diagnosis",
      "management",
      "management",
    ]);
    expect(
      ROW_052_CONCEPTS.every((concept) => concept.earliestFacilityStage === 0),
    ).toBe(true);
  });

  it("stores variants 1-6 only as approved single-select questions", () => {
    expect(ROW_052_QUESTION_VARIANTS).toHaveLength(6);
    expect(
      ROW_052_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)?.label,
      ),
    ).toEqual([
      "Felty syndrome",
      "Felty syndrome remains possible without splenomegaly",
      "Persistent neutropenia with splenomegaly",
      "Start methotrexate with specialist monitoring",
      "Methotrexate is first-line; steroids may serve as a bridge",
      "Consider splenectomy after multidisciplinary review",
    ]);

    for (const variant of ROW_052_QUESTION_VARIANTS) {
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

    expect(ROW_052_APPROVED_BACKLOG.excludedQuestionVariantIds).toEqual([
      "question.felty-syndrome.select-surgical-candidate.v1",
    ]);
    expect(
      ROW_052_QUESTION_VARIANTS.some((variant) =>
        variant.id.includes("select-surgical-candidate"),
      ),
    ).toBe(false);
  });

  it("authors one three-decision pathway plus three single-decision cases", () => {
    expect(ROW_052_CASES).toHaveLength(4);
    expect(ROW_052_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);
    expect(ROW_052_CASES.map((clinicalCase) => clinicalCase.decisionNodes.length))
      .toEqual([3, 1, 1, 1]);
    expect(
      ROW_052_CASES[0]?.decisionNodes.map((node) => node.primaryConceptId),
    ).toEqual(CONCEPT_IDS);

    for (const clinicalCase of ROW_052_CASES) {
      expect(clinicalCase).toMatchObject({
        releasePointId: "release.l0.clinic_evaluation",
        earliestFacilityStage: 0,
        requiredClinicalSetting: "clinic",
        tutorialEligible: false,
        routineEligible: true,
      });
    }
  });

  it("preserves the approved diagnostic and treatment boundaries", () => {
    const questionText = ROW_052_QUESTION_VARIANTS.map(
      (variant) =>
        `${variant.patientPresentation} ${variant.stem} ${variant.explanation}`,
    ).join(" ");
    expect(questionText).toContain("no splenic enlargement");
    expect(questionText).toContain("T-LGL");
    expect(questionText).toContain("Methotrexate");
    expect(questionText).toContain("rituximab");
    expect(questionText).not.toMatch(/80%|neutrophil nuclei/i);
  });

  it("maps approved claims to complete source records kept in source review", () => {
    const sourceIds = new Set(ROW_052_SOURCES.map((source) => source.id));
    const claimIds = new Set(ROW_052_EVIDENCE_CLAIMS.map((claim) => claim.id));
    for (const source of ROW_052_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(1900);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-10");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }
    for (const claim of ROW_052_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastCheckedOn).toBe("2026-08-10");
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits all four cases to the current development release", () => {
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
    for (const clinicalCase of ROW_052_CASES) {
      expect(activeCaseIds.has(clinicalCase.id)).toBe(true);
    }
  });
});
