import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";

const PATIENT_NAME_TOKEN = "{patientName}";

function materialize(text: string, patientName: string): string {
  return text.split(PATIENT_NAME_TOKEN).join(patientName);
}

/**
 * Returns a frozen-case copy with only the allowlisted patient-facing fields
 * materialized. Stable IDs, routes, source labels, and provenance are copied
 * byte-for-byte and are never treated as templates.
 */
export function materializePatientName(
  sourceCase: SyntheticClinicalCase,
  patientName: string,
): SyntheticClinicalCase {
  const clinicalCase = JSON.parse(JSON.stringify(sourceCase)) as SyntheticClinicalCase;
  clinicalCase.patientDisplayName = patientName;
  clinicalCase.presentation = materialize(clinicalCase.presentation, patientName);
  clinicalCase.chiefComplaint = clinicalCase.chiefComplaint
    ? materialize(clinicalCase.chiefComplaint, patientName)
    : clinicalCase.chiefComplaint;
  clinicalCase.learningSummary = materialize(clinicalCase.learningSummary, patientName);

  for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
    profile.presentation = materialize(profile.presentation, patientName);
    if (profile.chiefComplaint) profile.chiefComplaint = materialize(profile.chiefComplaint, patientName);
  }

  const revision = clinicalCase.patientPresentationRevision;
  if (revision) {
    if (revision.revisedChiefComplaint) revision.revisedChiefComplaint = materialize(revision.revisedChiefComplaint, patientName);
    if (revision.revisedPresentation) revision.revisedPresentation = materialize(revision.revisedPresentation, patientName);
    for (const profileRevision of revision.revisedProfilePresentations ?? []) {
      profileRevision.revisedPresentation = materialize(profileRevision.revisedPresentation, patientName);
    }
  }

  for (const node of clinicalCase.decisionNodes) {
    if (node.currentUpdate) node.currentUpdate = materialize(node.currentUpdate, patientName);
    node.stem = materialize(node.stem, patientName);
    node.explanation = materialize(node.explanation, patientName);
    if (node.teachingPoint) node.teachingPoint = materialize(node.teachingPoint, patientName);
    if (node.exhibit?.kind === "table") {
      node.exhibit.caption = materialize(node.exhibit.caption, patientName);
      node.exhibit.columnHeaders = node.exhibit.columnHeaders.map((value) => materialize(value, patientName));
      node.exhibit.rowHeaders = node.exhibit.rowHeaders.map((value) => materialize(value, patientName));
      node.exhibit.cells = node.exhibit.cells.map((row) => row.map((value) => materialize(value, patientName)));
    } else if (node.exhibit?.kind === "keyValue") {
      if (node.exhibit.caption) node.exhibit.caption = materialize(node.exhibit.caption, patientName);
      node.exhibit.items = node.exhibit.items.map((item) => ({ label: materialize(item.label, patientName), value: materialize(item.value, patientName) }));
    } else if (node.exhibit?.kind === "abstract") {
      node.exhibit.title = materialize(node.exhibit.title, patientName);
      node.exhibit.body = materialize(node.exhibit.body, patientName);
    }
    for (const choice of node.answerChoices) {
      choice.label = materialize(choice.label, patientName);
      if (choice.rationale) choice.rationale = materialize(choice.rationale, patientName);
    }
    if (node.resultGateAfter) {
      node.resultGateAfter.pendingLabel = materialize(node.resultGateAfter.pendingLabel, patientName);
      node.resultGateAfter.resultNarrative = materialize(node.resultGateAfter.resultNarrative, patientName);
    }
    for (const disposition of node.terminalDispositions) {
      if (disposition.kind === "no_terminal_outcome") {
        disposition.consequenceNarrative = materialize(disposition.consequenceNarrative, patientName);
        disposition.clinicalRationale = materialize(disposition.clinicalRationale, patientName);
      } else {
        disposition.outcome.narrative = materialize(disposition.outcome.narrative, patientName);
        disposition.outcome.clinicalRationale = materialize(disposition.outcome.clinicalRationale, patientName);
      }
    }
  }
  return clinicalCase;
}
