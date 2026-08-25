import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_047_CASES,
  ROW_047_CLINICAL_APPROVAL,
  ROW_047_CONCEPT,
  ROW_047_CONTENT_VERSION,
  ROW_047_EVIDENCE_CLAIMS,
  ROW_047_SOURCES,
} from "./aaa-female-sex-perioperative-mortality";

describe("owner row 47 approved AAA sex-associated mortality content", () => {
  it("records the exact Level 0 applied-science approval", () => {
    expect(ROW_047_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-047.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_047_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 47,
        sourceRecordKey: "owner-concept.sheet1.row-047",
      },
      approvedConceptId:
        "concept.aaa.female-sex-associated-perioperative-mortality",
      approvedConceptType: "applied_science",
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
      multiDecisionAssessment: {
        status: "single_decision_preferred",
      },
    });
    expect(ROW_047_CONCEPT).toMatchObject({
      conceptType: "applied_science",
      earliestFacilityStage: 0,
    });
  });

  it("uses one FSRS identity for four exact single-decision variants", () => {
    expect(ROW_047_CASES).toHaveLength(4);
    expect(
      new Set(
        ROW_047_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map(
            (decision) => decision.primaryConceptId,
          ),
        ),
      ),
    ).toEqual(new Set([ROW_047_CONCEPT.id]));
    expect(
      new Set(
        ROW_047_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map(
            (decision) => decision.questionVariantId,
          ),
        ),
      ).size,
    ).toBe(4);

    for (const clinicalCase of ROW_047_CASES) {
      expect(clinicalCase.releasePointId).toBe(
        "release.l0.clinic_evaluation",
      );
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.shuffleAnswers).toBe(true);
    }
  });

  it("preserves the four exact keyed answers and group-level boundary", () => {
    expect(
      ROW_047_CASES.map(
        (clinicalCase) =>
          clinicalCase.decisionNodes[0]?.answerChoices.find(
            (choice) => choice.isCorrect,
          )?.label,
      ),
    ).toEqual([
      "Women have higher observed perioperative mortality than men",
      "Women have higher perioperative mortality after both EVAR and open repair",
      "Female sex is associated with increased perioperative mortality at the group level",
      "Women have higher observed perioperative mortality after AAA repair",
    ]);
    expect(
      ROW_047_EVIDENCE_CLAIMS.some(
        (claim) =>
          claim.id ===
            "claim.aaa.sex-association-is-not-individual-determinism" &&
          claim.statement.includes("does not determine"),
      ),
    ).toBe(true);
  });

  it("does not make the correct answer uniquely longest", () => {
    for (const clinicalCase of ROW_047_CASES) {
      const choices =
        clinicalCase.decisionNodes[0]?.answerChoices ?? [];
      const correctLength =
        choices.find((choice) => choice.isCorrect)?.label.length ?? 0;
      expect(
        choices.some(
          (choice) =>
            !choice.isCorrect && choice.label.length >= correctLength,
        ),
      ).toBe(true);
    }
  });

  it("authors one bounded consequence for every wrong final answer", () => {
    for (const clinicalCase of ROW_047_CASES) {
      const decision = clinicalCase.decisionNodes[0]!;
      const wrongChoiceIds = decision.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => choice.id)
        .sort();
      expect(
        decision.terminalDispositions
          .map((disposition) => disposition.answerChoiceId)
          .sort(),
      ).toEqual(wrongChoiceIds);
      expect(
        decision.terminalDispositions.every(
          (disposition) =>
            disposition.kind === "no_terminal_outcome",
        ),
      ).toBe(true);
    }
  });

  it("retains complete source-to-claim provenance", () => {
    const sourceIds = new Set(ROW_047_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_047_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_047_SOURCES) {
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

    for (const claim of ROW_047_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_047_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits the exact reviewed variants to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => concept.id === ROW_047_CONCEPT.id,
      ),
    ).toHaveLength(1);
    for (const approvedCase of ROW_047_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (clinicalCase) => clinicalCase.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
