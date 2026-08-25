import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_029_CASES,
  ROW_029_CLINICAL_APPROVAL,
  ROW_029_CONCEPT,
  ROW_029_CONTENT_VERSION,
  ROW_029_EVIDENCE_CLAIMS,
  ROW_029_SOURCES,
} from "./hcc-milan-criteria";

describe("owner row 29 approved HCC Milan-criteria content", () => {
  it("records the named clinician approval and Level 0 disposition scope", () => {
    expect(ROW_029_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-029.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_029_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 29,
        sourceRecordKey: "owner-concept.sheet1.row-029",
      },
      approvedConceptId: "concept.hcc.milan-transplant-evaluation",
      approvedConceptType: "disposition",
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
    });
    expect(ROW_029_CONCEPT).toMatchObject({
      conceptType: "disposition",
      earliestFacilityStage: 0,
    });
  });

  it("uses one FSRS identity across six patient-forward and four criteria-forward variants", () => {
    expect(ROW_029_CASES).toHaveLength(10);
    expect(
      new Set(
        ROW_029_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
        ),
      ),
    ).toEqual(new Set([ROW_029_CONCEPT.id]));
    expect(
      new Set(
        ROW_029_CASES.map(
          (clinicalCase) =>
            clinicalCase.decisionNodes[0]!.questionVariantId,
        ),
      ).size,
    ).toBe(10);
    expect(
      ROW_029_CASES.filter((clinicalCase) =>
        clinicalCase.id.includes("choose-"),
      ),
    ).toHaveLength(4);

    for (const clinicalCase of ROW_029_CASES) {
      expect(clinicalCase.releasePointId).toBe(
        "release.l0.clinic_evaluation",
      );
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]!.shuffleAnswers).toBe(true);
      expect(
        clinicalCase.decisionNodes[0]!.answerChoices.filter(
          (choice) => choice.isCorrect,
        ),
      ).toHaveLength(1);
    }
  });

  it("keeps clinical facts in complete approved profiles while varying age and narrative lead-in", () => {
    for (const clinicalCase of ROW_029_CASES) {
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(3);
      expect(
        new Set(
          clinicalCase.approvedInstantiationProfiles?.map(
            (profile) => profile.prototypeDemographics?.ageYears,
          ),
        ),
      ).toEqual(new Set([52, 61, 69]));
      expect(
        new Set(
          clinicalCase.approvedInstantiationProfiles?.map(
            (profile) => profile.presentation,
          ),
        ).size,
      ).toBe(3);
      expect(
        clinicalCase.approvedInstantiationProfiles?.every((profile) =>
          profile.presentation.includes(
            clinicalCase.id.includes("choose-")
              ? "several possible"
              : "Staging shows",
          ),
        ),
      ).toBe(true);
    }
  });

  it("covers every approved Milan boundary in both classification directions", () => {
    const allText = JSON.stringify(ROW_029_CASES);
    expect(allText).toContain("one 4.8-cm HCC lesion");
    expect(allText).toContain("2.2, 2.6, and 2.9 cm");
    expect(allText).toContain("one 6.0-cm HCC lesion");
    expect(allText).toContain("four HCC lesions");
    expect(allText).toContain("macrovascular invasion");
    expect(allText).toContain("confirmed extrahepatic disease");
    expect(allText).toContain("One 5.0-cm lesion");
    expect(allText).toContain(
      "Three lesions (1.8, 2.4, and 3.0 cm)",
    );
  });

  it("authors a bounded consequence for every wrong final answer", () => {
    for (const clinicalCase of ROW_029_CASES) {
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

  it("preserves complete source-to-claim provenance and the listing boundary", () => {
    const sourceIds = new Set(ROW_029_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_029_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_029_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.doi).toMatch(/^10\./);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-06");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_029_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_029_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }

    expect(
      ROW_029_EVIDENCE_CLAIMS.some((claim) =>
        claim.statement.includes("does not by itself guarantee listing"),
      ),
    ).toBe(true);
  });

  it("admits every exact reviewed variant to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => concept.id === ROW_029_CONCEPT.id,
      ),
    ).toHaveLength(1);
    for (const approvedCase of ROW_029_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (clinicalCase) => clinicalCase.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
