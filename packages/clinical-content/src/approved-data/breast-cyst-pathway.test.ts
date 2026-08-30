import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import { ROW_047_CASES } from "./aaa-female-sex-perioperative-mortality";
import { ROW_048_CASES } from "./desmoid-management-pathway";
import { ROW_029_CASES } from "./hcc-milan-criteria";
import { ROW_036_CASES } from "./mondor-disease";
import { ROW_051_CASES } from "./pancreatic-tail-adenocarcinoma-resection";
import { ROW_052_CASES } from "./felty-syndrome-pathway";
import { ROW_060_CASES } from "./familial-hypocalciuric-hypercalcemia";
import { ROW_104_CASES } from "./lymphangitis-recognition";
import { ROW_119_CASES } from "./gallbladder-polyp-management";
import { ROW_111_CASES } from "./distal-cholangiocarcinoma";
import { ROW_115_CASES } from "./obstructive-jaundice-vitamin-k";
import { ROW_092_CASES } from "./hcc-resection-selection";
import { LEVEL_TWO_ROUTINE_CASE_IDS } from "./level-two-runtime";
import { ROW_058_CASES } from "./accessory-spleen-location";
import { ROW_057_CASES } from "./hereditary-spherocytosis-postsplenectomy";
import {
  ROW_030_CASES,
  ROW_030_CLINICAL_APPROVAL,
  ROW_030_CONCEPTS,
  ROW_030_CONTENT_VERSION,
  ROW_030_EVIDENCE_CLAIMS,
  ROW_030_SOURCES,
} from "./breast-cyst-pathway";

describe("owner row 30 approved breast-cyst pathway", () => {
  it("preserves the named approval, source row, and semantic release points", () => {
    expect(ROW_030_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-030.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_030_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 30,
        sourceRecordKey: "owner-concept.sheet1.row-030",
      },
      approvedReleasePointIds: [
        "release.l0.clinic_evaluation",
        "release.l1.minor_procedure",
      ],
      decision: "approved",
    });
  });

  it("keeps the two encounters sequential and scores one distinct concept per decision", () => {
    expect(ROW_030_CASES).toHaveLength(2);
    expect(ROW_030_CONCEPTS).toHaveLength(3);

    for (const clinicalCase of ROW_030_CASES) {
      expect(clinicalCase.decisionNodes).toHaveLength(2);
      expect(
        new Set(
          clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
        ).size,
      ).toBe(2);
      expect(
        clinicalCase.decisionNodes.every((node) => node.shuffleAnswers),
      ).toBe(true);
    }

    const imagingConceptIds = ROW_030_CASES.map(
      (clinicalCase) => clinicalCase.decisionNodes[0]!.primaryConceptId,
    );
    expect(new Set(imagingConceptIds)).toEqual(
      new Set(["concept.breast-mass.under-30-initial-ultrasound"]),
    );
    expect(
      new Set(
        ROW_030_CASES.map(
          (clinicalCase) =>
            clinicalCase.decisionNodes[0]!.questionVariantId,
        ),
      ).size,
    ).toBe(2);
  });

  it("uses corrective-forward off-site ultrasound before either management decision", () => {
    for (const clinicalCase of ROW_030_CASES) {
      const imaging = clinicalCase.decisionNodes[0]!;
      expect(
        imaging.answerChoices.filter((choice) => choice.isCorrect),
      ).toEqual([
        expect.objectContaining({
          id: "targeted_ultrasound",
          serviceRequest: { serviceId: "service.ultrasound" },
        }),
      ]);
      expect(imaging.resultGateAfter).toMatchObject({
        resultTypeId: "service.ultrasound",
        allowedServiceRouteIds: ["route.ultrasound.outsourced"],
      });
      expect(imaging.terminalDispositions).toEqual([]);
      expect(
        Object.fromEntries(
          imaging.answerChoices.map((choice) => [
            choice.id,
            choice.serviceRequest?.serviceId,
          ]),
        ),
      ).toEqual({
        targeted_ultrasound: "service.ultrasound",
        diagnostic_mammography: "service.mammography",
        breast_mri: "service.breast_mri",
        core_biopsy: "service.breast_core_needle_biopsy",
      });
    }
  });

  it("separates asymptomatic observation from painful-cyst aspiration", () => {
    const asymptomatic = ROW_030_CASES[0]!;
    const painful = ROW_030_CASES[1]!;
    const asymptomaticFinal = asymptomatic.decisionNodes[1]!;
    const painfulFinal = painful.decisionNodes[1]!;

    expect(
      asymptomaticFinal.answerChoices.find((choice) => choice.isCorrect)?.id,
    ).toBe("routine_care");
    expect(
      painfulFinal.answerChoices.find((choice) => choice.isCorrect)?.id,
    ).toBe("needle_aspiration");
    expect(asymptomatic.releasePointId).toBe(
      "release.l0.clinic_evaluation",
    );
    expect(asymptomatic.requiredCapabilityIds).toEqual([]);
    expect(painful.releasePointId).toBe("release.l1.minor_procedure");
    expect(painful.requiredCapabilityIds).toEqual([
      "capability.minor_procedure",
    ]);
  });

  it("authors a bounded consequence for every wrong final answer", () => {
    for (const clinicalCase of ROW_030_CASES) {
      const finalNode = clinicalCase.decisionNodes[1]!;
      const incorrectIds = finalNode.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => choice.id)
        .sort();
      expect(
        finalNode.terminalDispositions
          .map((disposition) => disposition.answerChoiceId)
          .sort(),
      ).toEqual(incorrectIds);
      expect(
        finalNode.terminalDispositions.every(
          (disposition) => disposition.kind === "no_terminal_outcome",
        ),
      ).toBe(true);
    }
  });

  it("retains complete source-to-claim provenance", () => {
    const sourceIds = new Set(ROW_030_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_030_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_030_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-06");
      expect(source.reuseStatus).toBe(
        "copyrighted_targeted_verification_only",
      );
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_030_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_030_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits only today's reviewed cases to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe(
      "synthetic_unapproved_prototype",
    );
    expect(
      SYNTHETIC_CLINICAL_RELEASE.cases.map(
        (clinicalCase) => clinicalCase.id,
      ),
    ).toEqual([
      "case.ventral-hernia.pulmonary-optimization.a",
      "case.ventral-hernia.pulmonary-optimization.b",
      "case.breast-cyst.under-30-asymptomatic-simple",
      "case.breast-cyst.under-30-painful-simple",
      "case.ebv-associated-malignancy.burkitt",
      "case.ebv-associated-malignancy.gastric",
      "case.ebv-associated-malignancy.nasopharyngeal",
      ...ROW_029_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_036_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_047_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_048_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_051_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_052_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_060_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_104_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_119_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_111_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_115_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_092_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_058_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_057_CASES.map((clinicalCase) => clinicalCase.id),
      ...LEVEL_TWO_ROUTINE_CASE_IDS,
    ]);
    expect(
      SYNTHETIC_CLINICAL_RELEASE.cases.some(
        (clinicalCase) =>
          clinicalCase.id.startsWith("case.prototype.") ||
          clinicalCase.id.startsWith("case.synthetic.") ||
          clinicalCase.id.startsWith("case.pilot."),
      ),
    ).toBe(false);
  });
});
