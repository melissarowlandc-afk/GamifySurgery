import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_031_CASES,
  ROW_031_CLINICAL_APPROVAL,
  ROW_031_CONCEPT,
  ROW_031_CONTENT_VERSION,
  ROW_031_EVIDENCE_CLAIMS,
  ROW_031_SOURCES,
} from "./ebv-associated-malignancies";

describe("owner row 31 approved EBV-associated malignancy content", () => {
  it("records the exact owner approval and applied-science schema decision", () => {
    expect(ROW_031_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-031.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_031_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 31,
        sourceRecordKey: "owner-concept.sheet1.row-031",
      },
      approvedConceptId:
        "concept.ebv.associated-malignancy-recognition",
      approvedConceptType: "applied_science",
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
    });
    expect(ROW_031_CONCEPT).toMatchObject({
      conceptType: "applied_science",
      earliestFacilityStage: 0,
    });
  });

  it("uses one FSRS identity for the three exact approved question variants", () => {
    expect(ROW_031_CASES).toHaveLength(3);
    expect(
      new Set(
        ROW_031_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map(
            (decision) => decision.primaryConceptId,
          ),
        ),
      ),
    ).toEqual(new Set([ROW_031_CONCEPT.id]));
    expect(
      new Set(
        ROW_031_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map(
            (decision) => decision.questionVariantId,
          ),
        ),
      ).size,
    ).toBe(3);

    for (const clinicalCase of ROW_031_CASES) {
      expect(clinicalCase.releasePointId).toBe(
        "release.l0.clinic_evaluation",
      );
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.shuffleAnswers).toBe(true);
    }
  });

  it("preserves the three exact keyed associations without adding the unreviewed Hodgkin variant", () => {
    const correctLabels = ROW_031_CASES.map(
      (clinicalCase) =>
        clinicalCase.decisionNodes[0]?.answerChoices.find(
          (choice) => choice.isCorrect,
        )?.label,
    );
    expect(correctLabels).toEqual([
      "Burkitt lymphoma",
      "Gastric adenocarcinoma",
      "Nasopharyngeal carcinoma",
    ]);
    expect(
      ROW_031_CASES.some((clinicalCase) =>
        clinicalCase.decisionNodes.some((decision) =>
          decision.answerChoices.some(
            (choice) => choice.label === "Hodgkin lymphoma",
          ),
        ),
      ),
    ).toBe(false);
  });

  it("authors one bounded consequence for every wrong final answer", () => {
    for (const clinicalCase of ROW_031_CASES) {
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
          (disposition) => disposition.kind === "no_terminal_outcome",
        ),
      ).toBe(true);
    }
  });

  it("retains complete source-to-claim provenance and the nonuniversal boundary", () => {
    const sourceIds = new Set(ROW_031_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_031_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_031_SOURCES) {
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

    for (const claim of ROW_031_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_031_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }

    expect(
      ROW_031_EVIDENCE_CLAIMS.some((claim) =>
        claim.statement.includes("does not mean that every case"),
      ),
    ).toBe(true);
  });

  it("admits the exact reviewed variants to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => concept.id === ROW_031_CONCEPT.id,
      ),
    ).toHaveLength(1);
    for (const approvedCase of ROW_031_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (clinicalCase) => clinicalCase.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
