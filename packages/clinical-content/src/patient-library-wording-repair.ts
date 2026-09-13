import type { SyntheticClinicalCase } from "./schema";
import {
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
  PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
} from "./patient-library-wording-repair-data";

export const PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION =
  "presentation-revision.patient-library.2026-09-13.v3";

export {
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
  PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
};

export interface PatientLibraryCaseWordingRevision {
  caseId: string;
  patientPresentationVariantId: string;
  sourceChiefComplaint: string | null;
  revisedChiefComplaint: string;
  sourcePresentation: string;
  revisedPresentation: string;
}

export interface PatientLibraryProfileWordingRevision {
  caseId: string;
  approvedInstantiationProfileId: string;
  sourcePresentation: string;
  revisedPresentation: string;
}

export interface PatientLibraryNodeStemRevision {
  caseId: string;
  nodeId: string;
  questionVariantId: string;
  sourceStem: string;
  revisedStem: string;
}

export interface PatientLibraryWordingRepairMappings {
  caseRevisions: readonly PatientLibraryCaseWordingRevision[];
  profileRevisions: readonly PatientLibraryProfileWordingRevision[];
  nodeStemRevisions: readonly PatientLibraryNodeStemRevision[];
}

export const DEFAULT_PATIENT_LIBRARY_WORDING_REPAIR_MAPPINGS = {
  caseRevisions: PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  profileRevisions: PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
  nodeStemRevisions: PATIENT_LIBRARY_NODE_STEM_REVISIONS,
} satisfies PatientLibraryWordingRepairMappings;

function uniqueMap<T>(
  items: readonly T[],
  keyFor: (item: T) => string,
  label: string,
): Map<string, T> {
  const result = new Map<string, T>();
  for (const item of items) {
    const key = keyFor(item);
    if (result.has(key)) throw new Error(`Duplicate ${label}: ${key}`);
    result.set(key, item);
  }
  return result;
}

/**
 * Applies the fully enumerated September 13 wording repair.
 *
 * Every active case and approved profile must have one literal source binding.
 * This function intentionally performs no prose inference or runtime regex repair.
 */
export function applyPatientLibraryWordingRepair(
  sourceCases: readonly SyntheticClinicalCase[],
  mappings: PatientLibraryWordingRepairMappings =
    DEFAULT_PATIENT_LIBRARY_WORDING_REPAIR_MAPPINGS,
): SyntheticClinicalCase[] {
  const casesById = uniqueMap(
    mappings.caseRevisions,
    (revision) => revision.caseId,
    "patient-library case wording revision",
  );
  const profilesByKey = uniqueMap(
    mappings.profileRevisions,
    (revision) => `${revision.caseId}/${revision.approvedInstantiationProfileId}`,
    "patient-library profile wording revision",
  );
  const stemsByKey = uniqueMap(
    mappings.nodeStemRevisions,
    (revision) => `${revision.caseId}/${revision.nodeId}`,
    "patient-library node-stem revision",
  );
  const sourceById = uniqueMap(sourceCases, (clinicalCase) => clinicalCase.id, "source case");

  if (casesById.size !== sourceCases.length) {
    throw new Error(
      `Patient-library case wording coverage mismatch: ${casesById.size}/${sourceCases.length}`,
    );
  }

  for (const revision of mappings.caseRevisions) {
    const sourceCase = sourceById.get(revision.caseId);
    if (!sourceCase) throw new Error(`Stale patient-library case wording revision: ${revision.caseId}`);
    if (sourceCase.patientPresentationVariantId !== revision.patientPresentationVariantId) {
      throw new Error(`Patient-library presentation variant mismatch: ${revision.caseId}`);
    }
    if ((sourceCase.chiefComplaint ?? null) !== revision.sourceChiefComplaint) {
      throw new Error(`Patient-library chief complaint drift: ${revision.caseId}`);
    }
    if (sourceCase.presentation !== revision.sourcePresentation) {
      throw new Error(`Patient-library base presentation drift: ${revision.caseId}`);
    }
  }

  let expectedProfileCount = 0;
  for (const sourceCase of sourceCases) {
    for (const profile of sourceCase.approvedInstantiationProfiles ?? []) {
      expectedProfileCount += 1;
      const key = `${sourceCase.id}/${profile.id}`;
      const revision = profilesByKey.get(key);
      if (!revision) throw new Error(`Missing patient-library profile wording revision: ${key}`);
      if (profile.presentation !== revision.sourcePresentation) {
        throw new Error(`Patient-library profile presentation drift: ${key}`);
      }
    }
  }
  if (profilesByKey.size !== expectedProfileCount) {
    throw new Error(
      `Patient-library profile wording coverage mismatch: ${profilesByKey.size}/${expectedProfileCount}`,
    );
  }

  for (const revision of mappings.nodeStemRevisions) {
    const sourceCase = sourceById.get(revision.caseId);
    if (!sourceCase) throw new Error(`Stale patient-library node-stem revision: ${revision.caseId}`);
    const node = sourceCase.decisionNodes.find((candidate) => candidate.id === revision.nodeId);
    if (!node || node.questionVariantId !== revision.questionVariantId) {
      throw new Error(`Patient-library node identity mismatch: ${revision.caseId}/${revision.nodeId}`);
    }
    if (node.stem !== revision.sourceStem) {
      throw new Error(`Patient-library node stem drift: ${revision.caseId}/${revision.nodeId}`);
    }
  }

  return sourceCases.map((sourceCase) => {
    const revision = casesById.get(sourceCase.id)!;
    const revisedProfiles = (sourceCase.approvedInstantiationProfiles ?? []).map((profile) => {
      const profileRevision = profilesByKey.get(`${sourceCase.id}/${profile.id}`)!;
      return { ...profile, presentation: profileRevision.revisedPresentation };
    });
    const revisedNodes = sourceCase.decisionNodes.map((node) => {
      const stemRevision = stemsByKey.get(`${sourceCase.id}/${node.id}`);
      return stemRevision ? { ...node, stem: stemRevision.revisedStem } : { ...node };
    });
    const changedProfileRevisions = revisedProfiles.flatMap((profile) => {
      const profileRevision = profilesByKey.get(`${sourceCase.id}/${profile.id}`)!;
      return profileRevision.sourcePresentation === profileRevision.revisedPresentation
        ? []
        : [{
            id: `pprv3.${profile.id}`,
            approvedInstantiationProfileId: profile.id,
            contentVersion: PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION,
            revisedPresentation: profile.presentation,
            revisedFields: ["presentation"] as ["presentation"],
            aiAssistedDrafting: true as const,
            reviewStatus: "needs_clinician_review" as const,
            lastClinicianReview: null,
          }];
    });
    const changedStemRevisions = revisedNodes.flatMap((node) => {
      const stemRevision = stemsByKey.get(`${sourceCase.id}/${node.id}`);
      return stemRevision
        ? [{
            id: `pprv3.${node.id}`,
            decisionNodeId: node.id,
            questionVariantId: node.questionVariantId,
            contentVersion: PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION,
            revisedStem: node.stem,
            aiAssistedDrafting: true as const,
            reviewStatus: "needs_clinician_review" as const,
            lastClinicianReview: null,
          }]
        : [];
    });
    const presentationChanged = revision.sourcePresentation !== revision.revisedPresentation;

    return {
      ...sourceCase,
      chiefComplaint: revision.revisedChiefComplaint,
      presentation: revision.revisedPresentation,
      ...(sourceCase.approvedInstantiationProfiles
        ? { approvedInstantiationProfiles: revisedProfiles }
        : {}),
      decisionNodes: revisedNodes,
      patientPresentationRevision: {
        id: `pprv3.${sourceCase.id}`,
        patientPresentationVariantId: sourceCase.patientPresentationVariantId,
        contentVersion: PATIENT_LIBRARY_WORDING_REPAIR_CONTENT_VERSION,
        revisedChiefComplaint: revision.revisedChiefComplaint,
        ...(presentationChanged ? { revisedPresentation: revision.revisedPresentation } : {}),
        revisedFields: [
          "chiefComplaint" as const,
          ...(presentationChanged ? ["presentation" as const] : []),
        ],
        ...(changedProfileRevisions.length
          ? { revisedProfilePresentations: changedProfileRevisions }
          : {}),
        ...(changedStemRevisions.length
          ? { revisedDecisionStems: changedStemRevisions }
          : {}),
        aiAssistedDrafting: true,
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
      },
    };
  });
}
