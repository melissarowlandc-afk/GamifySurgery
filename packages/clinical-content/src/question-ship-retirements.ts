import type {SyntheticClinicalCase} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";

/** Projection-only retirement; no save/encounter/FSRS mutation. Invalid rows
 * retain the old case. A declared successor must be a complete accepted case. */
export function resolveQuestionShipRetirements(cases: readonly SyntheticClinicalCase[], manifest: QuestionShipManifest) {
  const issues: string[] = [];
  const retiredCaseIds = new Set<string>();
  for (const row of manifest.retirements ?? []) {
    const errors: string[] = [];
    const matches = cases.filter(clinicalCase => clinicalCase.id === row.caseId);
    if (matches.length !== 1) errors.push("retirement must identify one projected case");
    if ((manifest.retirements ?? []).filter(other => other.caseId === row.caseId).length !== 1)
      errors.push("duplicate retirement case");
    if (!row.decision?.trim() || !row.reason?.trim()) errors.push("retirement requires a manager decision and reason");
    const ids = row.questionVariantIds;
    if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length)
      errors.push("retirement requires distinct exact question bindings");
    const source = matches[0];
    if (source && JSON.stringify(source.decisionNodes.map(node => node.questionVariantId)) !== JSON.stringify(ids))
      errors.push("retirement question bindings changed");
    if (row.replacementQuestionVariantId) {
      const accepted = manifest.accepted.filter(candidate => candidate.questionVariantId === row.replacementQuestionVariantId);
      const successors = cases.filter(clinicalCase => clinicalCase.decisionNodes.some(node => node.questionVariantId === row.replacementQuestionVariantId));
      if (accepted.length !== 1 || successors.length !== 1 || accepted[0]?.caseId !== successors[0]?.id)
        errors.push("retirement successor must be one projected exact accepted question");
      const successor = successors[0];
      if (successor?.id === row.caseId) errors.push("retirement cannot remove its own successor");
      if (successor) {
        const rows = manifest.accepted.filter(candidate => candidate.caseId === successor.id);
        if (rows.length !== successor.decisionNodes.length || successor.decisionNodes.some(node =>
          rows.filter(candidate => candidate.nodeId === node.id && candidate.questionVariantId === node.questionVariantId &&
            candidate.conceptId === node.primaryConceptId).length !== 1))
          errors.push("retirement successor requires every scored node to be accepted");
      }
      if ((manifest.retirements ?? []).some(other => other.caseId === successor?.id))
        errors.push("retirement successor is itself retired");
    }
    if (errors.length) issues.push(`invalid retirement ${row.caseId}: ${errors.join("; ")}`);
    else retiredCaseIds.add(row.caseId);
  }
  return {issues, retiredCaseIds};
}
