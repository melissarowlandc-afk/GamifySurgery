import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "./schema";
import { validateSyntheticClinicalRelease } from "./schema";
import {
  applyPatientLibraryWordingRepair,
  DEFAULT_PATIENT_LIBRARY_WORDING_REPAIR_MAPPINGS,
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
  PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
  PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION,
} from "./patient-library-wording-repair";
import {
  PATIENT_LIBRARY_WORDING_REPAIR_SOURCE_CASES,
  SYNTHETIC_CLINICAL_RELEASE,
} from "./synthetic-content";

const sourceCases =
  PATIENT_LIBRARY_WORDING_REPAIR_SOURCE_CASES as readonly SyntheticClinicalCase[];

function nonEditorialFields(clinicalCase: SyntheticClinicalCase): unknown {
  const {
    chiefComplaint: _chiefComplaint,
    presentation: _presentation,
    patientPresentationRevision: _patientPresentationRevision,
    approvedInstantiationProfiles,
    decisionNodes,
    ...rest
  } = clinicalCase;
  return {
    ...rest,
    approvedInstantiationProfiles: approvedInstantiationProfiles?.map(
      ({ chiefComplaint: _profileComplaint, presentation: _profilePresentation, ...profile }) =>
        profile,
    ),
    decisionNodes: decisionNodes.map(({ stem: _stem, ...node }) => node),
  };
}

describe("full patient-library wording repair", () => {
  it("covers every implemented case and approved profile with literal source bindings", () => {
    expect(sourceCases).toHaveLength(298);
    expect(PATIENT_LIBRARY_CASE_WORDING_REVISIONS).toHaveLength(298);
    expect(PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS).toHaveLength(664);
    expect(PATIENT_LIBRARY_NODE_STEM_REVISIONS).toHaveLength(1);

    const revised = applyPatientLibraryWordingRepair(sourceCases);
    expect(revised).toHaveLength(sourceCases.length);
    expect(
      revised.reduce(
        (count, clinicalCase) =>
          count + (clinicalCase.approvedInstantiationProfiles?.length ?? 0),
        0,
      ),
    ).toBe(664);
  });

  it("preserves all non-editorial case, profile, and decision fields", () => {
    const snapshot = JSON.parse(JSON.stringify(sourceCases)) as SyntheticClinicalCase[];
    const revised = applyPatientLibraryWordingRepair(sourceCases);

    expect(sourceCases).toEqual(snapshot);
    for (const sourceCase of sourceCases) {
      const revisedCase = revised.find((candidate) => candidate.id === sourceCase.id)!;
      expect(nonEditorialFields(revisedCase), sourceCase.id).toEqual(
        nonEditorialFields(sourceCase),
      );
    }
  });

  it("uses concise complaint phrases and named presentations throughout the library", () => {
    const repaired = SYNTHETIC_CLINICAL_RELEASE.cases;
    for (const clinicalCase of repaired) {
      expect(clinicalCase.chiefComplaint, clinicalCase.id).toBeDefined();
      const words = clinicalCase.chiefComplaint!.trim().split(/\s+/);
      expect(words.length, clinicalCase.id).toBeGreaterThanOrEqual(1);
      expect(words.length, clinicalCase.id).toBeLessThanOrEqual(5);
      expect(clinicalCase.chiefComplaint, clinicalCase.id).not.toMatch(/[.!]$/);
      expect(clinicalCase.chiefComplaint, clinicalCase.id).not.toMatch(
        /^(?:Select|Identify|Level|Clinic|Outpatient)\b|\bv\d+\b/i,
      );
      expect(clinicalCase.presentation, clinicalCase.id).toContain("{patientName}");
      expect(clinicalCase.presentation, clinicalCase.id).not.toMatch(
        /^(?:A patient|An adult|Patient with)\b/i,
      );
      for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
        expect(profile.presentation, `${clinicalCase.id}/${profile.id}`).toContain(
          "{patientName}",
        );
        expect(profile.presentation, `${clinicalCase.id}/${profile.id}`).not.toMatch(
          /^(?:A patient|An adult|Patient with)\b/i,
        );
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(node.stem, `${clinicalCase.id}/${node.id}`).toMatch(/\?$/);
        expect(node.stem, `${clinicalCase.id}/${node.id}`).not.toBe(
          "Which answer is appropriate?",
        );
      }
    }
  });

  it("marks every repaired complaint and all changed narrative text for clinician review", () => {
    const historicalCaseIds = new Set(sourceCases.map((clinicalCase) => clinicalCase.id));
    const historicalCases = SYNTHETIC_CLINICAL_RELEASE.cases.filter(
      (clinicalCase) => historicalCaseIds.has(clinicalCase.id),
    );
    expect(historicalCases).toHaveLength(298);
    for (const clinicalCase of historicalCases) {
      expect(clinicalCase.patientPresentationRevision).toMatchObject({
        id: `pprv3.${clinicalCase.id}`,
        patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
        contentVersion: PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION,
        revisedChiefComplaint: clinicalCase.chiefComplaint,
        aiAssistedDrafting: true,
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
      });
    }
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe(
      "synthetic_unapproved_prototype",
    );
  });

  it("restores the named anal-HSIL viral-association task", () => {
    const hsil = SYNTHETIC_CLINICAL_RELEASE.cases.find(
      (clinicalCase) => clinicalCase.id === "case.anal-hsil.hpv.3b",
    )!;
    expect(hsil.presentation).toBe(
      "{patientName} returns to clinic for follow-up of documented anal HSIL.",
    );
    expect(hsil.decisionNodes).toContainEqual(
      expect.objectContaining({
        id: "node.anal-hsil.hpv.3b",
        questionVariantId: "question.anal-hsil.hpv.3b.v1",
        primaryConceptId: "concept.anal-hsil.high-risk-hpv-association",
        stem: "Which virus is etiologically linked to this dysplastic lesion?",
      }),
    );
    expect(hsil.patientPresentationRevision?.revisedDecisionStems).toEqual([
      expect.objectContaining({
        decisionNodeId: "node.anal-hsil.hpv.3b",
        questionVariantId: "question.anal-hsil.hpv.3b.v1",
        reviewStatus: "needs_clinician_review",
      }),
    ]);
  });

  it("retains the two explicitly constrained FHH age descriptions", () => {
    const byId = new Map(
      SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) => [clinicalCase.id, clinicalCase]),
    );
    expect(byId.get("case.fhh.evaluation-to-confirmed-management")?.presentation).toContain(
      "27-year-old",
    );
    expect(byId.get("case.fhh.suggestive-results-confirmation")?.presentation).toContain(
      "young adult",
    );
  });

  it("rejects duplicate, incomplete, stale, and drifted literal bindings", () => {
    const defaults = DEFAULT_PATIENT_LIBRARY_WORDING_REPAIR_MAPPINGS;
    expect(() => applyPatientLibraryWordingRepair(sourceCases, {
      ...defaults,
      caseRevisions: [...defaults.caseRevisions, defaults.caseRevisions[0]!],
    })).toThrow("Duplicate patient-library case wording revision");
    expect(() => applyPatientLibraryWordingRepair(sourceCases, {
      ...defaults,
      caseRevisions: defaults.caseRevisions.slice(1),
    })).toThrow("coverage mismatch");
    expect(() => applyPatientLibraryWordingRepair(sourceCases, {
      ...defaults,
      profileRevisions: defaults.profileRevisions.slice(1),
    })).toThrow("Missing patient-library profile wording revision");
    expect(() => applyPatientLibraryWordingRepair(sourceCases, {
      ...defaults,
      caseRevisions: [
        { ...defaults.caseRevisions[0]!, sourcePresentation: "Drifted." },
        ...defaults.caseRevisions.slice(1),
      ],
    })).toThrow("base presentation drift");
    expect(() => applyPatientLibraryWordingRepair(sourceCases, {
      ...defaults,
      nodeStemRevisions: [{
        ...defaults.nodeStemRevisions[0]!,
        sourceStem: "Drifted?",
      }],
    })).toThrow("node stem drift");
  });
});
