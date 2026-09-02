import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "./schema";
import { validateSyntheticClinicalRelease } from "./schema";
import {
  DEFAULT_PATIENT_PRESENTATION_REVISION_MAPPINGS,
  applyPendingPatientPresentationRevisions,
  PATIENT_PRESENTATION_REVISION_CONTENT_VERSION,
  PENDING_BASE_PRESENTATION_REVISIONS,
  PENDING_PATIENT_PRESENTATION_REVISIONS,
  PENDING_PROFILE_PRESENTATION_REVISIONS,
} from "./patient-presentation-revisions";
import {
  ACTIVE_SYNTHETIC_CLINICAL_SOURCE_CASES,
  SYNTHETIC_CLINICAL_RELEASE,
} from "./synthetic-content";

const sourceCases = ACTIVE_SYNTHETIC_CLINICAL_SOURCE_CASES as readonly SyntheticClinicalCase[];
const NARRATIVE_STATE_VERB = /\b(?:are|brings?|comes?|confirms?|continues|develops?|discuss(?:es)?|does|finds?|has|have|had|is|noticed|presents?|reports?|returns?|reviews?|shows?|was|were)\b/i;
const AUDITED_TEACHING_QUESTION_ENDING = /\b(?:asks?|wants?|would like|brings? a short list of questions)\b[^.!?]*[.!?]$/i;

function sentences(value: string): string[] {
  return value.split(/(?<=[.!?])\s+/);
}

describe("pending patient-presentation revisions", () => {
  it("uses complete literal mappings with the audited 105/51/30/54 coverage", () => {
    const revisedCases = applyPendingPatientPresentationRevisions(sourceCases);
    const revisedBaseIds = new Set(PENDING_BASE_PRESENTATION_REVISIONS.map((revision) => revision.caseId));
    const revisedProfiles = PENDING_PROFILE_PRESENTATION_REVISIONS;

    expect(PENDING_PATIENT_PRESENTATION_REVISIONS).toHaveLength(105);
    expect(PENDING_BASE_PRESENTATION_REVISIONS).toHaveLength(51);
    expect(revisedProfiles).toHaveLength(30);
    expect(sourceCases.filter(
      (clinicalCase) => clinicalCase.chiefComplaint && !revisedBaseIds.has(clinicalCase.id),
    )).toHaveLength(54);
    expect(revisedCases).toHaveLength(sourceCases.length);

    for (const revision of PENDING_BASE_PRESENTATION_REVISIONS) {
      const source = sourceCases.find((clinicalCase) => clinicalCase.id === revision.caseId);
      const revised = revisedCases.find((clinicalCase) => clinicalCase.id === revision.caseId);
      expect(source?.presentation).toBe(revision.sourcePresentation);
      expect(revised?.presentation).toBe(revision.revisedPresentation);
      expect(revision.sourcePresentation).not.toBe(revision.revisedPresentation);
    }
    for (const revision of revisedProfiles) {
      const source = sourceCases.find((clinicalCase) => clinicalCase.id === revision.caseId);
      const profile = source?.approvedInstantiationProfiles?.find(
        (candidate) => candidate.id === revision.approvedInstantiationProfileId,
      );
      const revised = revisedCases.find((clinicalCase) => clinicalCase.id === revision.caseId);
      const revisedProfile = revised?.approvedInstantiationProfiles?.find(
        (candidate) => candidate.id === revision.approvedInstantiationProfileId,
      );
      expect(profile?.presentation).toBe(revision.sourcePresentation);
      expect(revisedProfile?.presentation).toBe(revision.revisedPresentation);
      expect(revision.sourcePresentation).not.toBe(revision.revisedPresentation);
    }
  });

  it("does not mutate frozen source content and preserves all non-target base presentations", () => {
    const snapshot = JSON.parse(JSON.stringify(sourceCases)) as SyntheticClinicalCase[];
    const revisedCases = applyPendingPatientPresentationRevisions(sourceCases);
    const revisedBaseIds = new Set(PENDING_BASE_PRESENTATION_REVISIONS.map((revision) => revision.caseId));

    expect(sourceCases).toEqual(snapshot);
    for (const source of sourceCases) {
      const revised = revisedCases.find((candidate) => candidate.id === source.id);
      expect(revised).toBeDefined();
      if (!revisedBaseIds.has(source.id)) {
        expect(revised?.presentation).toBe(source.presentation);
      }
      if (!source.id.startsWith("case.hcc.milan.")) {
        expect(revised?.approvedInstantiationProfiles).toEqual(source.approvedInstantiationProfiles);
      }
    }
  });

  it("keeps stable identities and decision content while exact-binding every pending v2 revision", () => {
    const revisedCases = applyPendingPatientPresentationRevisions(sourceCases);
    for (const source of sourceCases) {
      const revised = revisedCases.find((candidate) => candidate.id === source.id)!;
      expect(revised.id).toBe(source.id);
      expect(revised.patientPresentationVariantId).toBe(source.patientPresentationVariantId);
      expect(revised.decisionNodes).toEqual(source.decisionNodes);
      expect(revised.approvedInstantiationProfiles?.map((profile) => profile.id))
        .toEqual(source.approvedInstantiationProfiles?.map((profile) => profile.id));
      if (!source.chiefComplaint) continue;
      expect(revised.patientPresentationRevision).toMatchObject({
        id: `pprv2.${source.id}`,
        contentVersion: PATIENT_PRESENTATION_REVISION_CONTENT_VERSION,
        aiAssistedDrafting: true,
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
      });
    }
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
  });

  it("keeps revised complaints in patient voice", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (!clinicalCase.chiefComplaint) continue;
      expect(clinicalCase.chiefComplaint.length).toBeLessThanOrEqual(160);
      expect(clinicalCase.chiefComplaint).toMatch(/^(I|My)\b/);
      expect(clinicalCase.chiefComplaint).not.toMatch(/teaching question|referral task|category/i);
    }
  });

  it("keeps every audited final presentation as one or two complete narrative sentences without its source question tail", () => {
    for (const revision of PENDING_BASE_PRESENTATION_REVISIONS) {
      const revisedSentences = sentences(revision.revisedPresentation);
      expect(revision.revisedPresentation, revision.caseId).not.toHaveLength(0);
      expect(revision.revisedPresentation, revision.caseId).toMatch(/[.!?]$/);
      expect(revisedSentences.length, revision.caseId).toBeGreaterThanOrEqual(1);
      expect(revisedSentences.length, revision.caseId).toBeLessThanOrEqual(2);
      expect(revisedSentences.every((sentence) => NARRATIVE_STATE_VERB.test(sentence)), revision.caseId).toBe(true);
      expect(revision.revisedPresentation, revision.caseId).not.toMatch(AUDITED_TEACHING_QUESTION_ENDING);
    }
  });

  it("rejects duplicate, stale, variant, source-drift, and profile-coverage mapping failures before assembly", () => {
    const defaults = DEFAULT_PATIENT_PRESENTATION_REVISION_MAPPINGS;
    expect(() => applyPendingPatientPresentationRevisions(sourceCases, {
      ...defaults,
      complaintRevisions: [...defaults.complaintRevisions, defaults.complaintRevisions[0]!],
    })).toThrow("Duplicate patient-presentation revision");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases, {
      ...defaults,
      basePresentationRevisions: [...defaults.basePresentationRevisions, defaults.basePresentationRevisions[0]!],
    })).toThrow("Duplicate base presentation revision");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases, {
      ...defaults,
      profilePresentationRevisions: [...defaults.profilePresentationRevisions, defaults.profilePresentationRevisions[0]!],
    })).toThrow("Duplicate profile presentation revision");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases, {
      ...defaults,
      basePresentationRevisions: [...defaults.basePresentationRevisions, { ...defaults.basePresentationRevisions[0]!, caseId: "case.stale" }],
    })).toThrow("Stale base presentation revision");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases.map((clinicalCase) =>
      clinicalCase.id === defaults.basePresentationRevisions[0]!.caseId
        ? { ...clinicalCase, patientPresentationVariantId: "presentation.mismatch" }
        : clinicalCase,
    ) as SyntheticClinicalCase[])).toThrow("Presentation variant mismatch");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases.map((clinicalCase) =>
      clinicalCase.id === defaults.basePresentationRevisions[0]!.caseId
        ? { ...clinicalCase, presentation: "Drifted." }
        : clinicalCase,
    ) as SyntheticClinicalCase[])).toThrow("Base presentation drift");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases, {
      ...defaults,
      profilePresentationRevisions: defaults.profilePresentationRevisions.slice(1),
    })).toThrow("Missing profile presentation revision");
  });

  it("rejects profile drift and chief-complaint drift without silently overwriting anything", () => {
    const profileCaseId = "case.hcc.milan.solitary-within";
    expect(() => applyPendingPatientPresentationRevisions(sourceCases.map((clinicalCase) =>
      clinicalCase.id === profileCaseId
        ? { ...clinicalCase, approvedInstantiationProfiles: [...clinicalCase.approvedInstantiationProfiles!, { id: "profile.hcc.milan.solitary-within.new", presentation: clinicalCase.presentation }] }
        : clinicalCase,
    ) as SyntheticClinicalCase[])).toThrow("Missing profile presentation revision");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases.map((clinicalCase) =>
      clinicalCase.id === profileCaseId
        ? { ...clinicalCase, approvedInstantiationProfiles: clinicalCase.approvedInstantiationProfiles!.map((profile, index) => index === 0 ? { ...profile, presentation: "Drifted profile." } : profile) }
        : clinicalCase,
    ) as SyntheticClinicalCase[])).toThrow("Profile presentation drift");
    expect(() => applyPendingPatientPresentationRevisions(sourceCases.map((clinicalCase) =>
      clinicalCase.id === profileCaseId
        ? { ...clinicalCase, approvedInstantiationProfiles: [{ ...clinicalCase.approvedInstantiationProfiles![0]!, chiefComplaint: "I have a concern." }, ...clinicalCase.approvedInstantiationProfiles!.slice(1)] }
        : clinicalCase,
    ) as SyntheticClinicalCase[])).toThrow("Active profile chief complaint needs explicit revision");
  });

  it("rejects an envelope whose output text no longer exact-binds its pending revision", () => {
    const first = SYNTHETIC_CLINICAL_RELEASE.cases.find((clinicalCase) => clinicalCase.patientPresentationRevision)!;
    expect(() => validateSyntheticClinicalRelease({
      ...SYNTHETIC_CLINICAL_RELEASE,
      cases: SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) => clinicalCase.id === first.id
        ? { ...clinicalCase, patientPresentationRevision: { ...clinicalCase.patientPresentationRevision!, revisedPresentation: "Different presentation.", revisedFields: ["chiefComplaint", "presentation"] } }
        : clinicalCase),
    })).toThrow("exact revised presentation");
  });

  it("requires the exact canonical case revised-fields sequence", () => {
    const first = SYNTHETIC_CLINICAL_RELEASE.cases.find(
      (clinicalCase) =>
        clinicalCase.patientPresentationRevision?.revisedFields.length === 2,
    )!;

    expect(() => validateSyntheticClinicalRelease({
      ...SYNTHETIC_CLINICAL_RELEASE,
      cases: SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) =>
        clinicalCase.id === first.id
          ? {
              ...clinicalCase,
              patientPresentationRevision: {
                ...clinicalCase.patientPresentationRevision!,
                revisedFields: ["chiefComplaint", "chiefComplaint"],
              },
            }
          : clinicalCase,
      ),
    })).toThrow("exactly name its revised case fields");
  });

  it("rejects duplicate profile revision record IDs independently of profile coverage", () => {
    const first = SYNTHETIC_CLINICAL_RELEASE.cases.find(
      (clinicalCase) =>
        (clinicalCase.patientPresentationRevision?.revisedProfilePresentations?.length ?? 0) > 1,
    )!;
    const revisions = first.patientPresentationRevision!.revisedProfilePresentations!;

    expect(() => validateSyntheticClinicalRelease({
      ...SYNTHETIC_CLINICAL_RELEASE,
      cases: SYNTHETIC_CLINICAL_RELEASE.cases.map((clinicalCase) =>
        clinicalCase.id === first.id
          ? {
              ...clinicalCase,
              patientPresentationRevision: {
                ...clinicalCase.patientPresentationRevision!,
                revisedProfilePresentations: [
                  revisions[0]!,
                  { ...revisions[1]!, id: revisions[0]!.id },
                  ...revisions.slice(2),
                ],
              },
            }
          : clinicalCase,
      ),
    })).toThrow("Duplicate instantiation-profile presentation revision record ID");
  });
});
