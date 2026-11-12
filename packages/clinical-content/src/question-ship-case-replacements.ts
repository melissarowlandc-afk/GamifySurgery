import type {SyntheticClinicalCase, SyntheticClinicalRelease} from "./schema";
import type {QuestionShipAcceptance, QuestionShipManifest} from "./question-ship-manifest";

interface ReplacementGroup {
  references: readonly string[];
  with: string;
  errors: string[];
  legacyIds: Set<string>;
  targetIds: Set<string>;
  source?: SyntheticClinicalCase;
}

/** Resolve explicit whole-case replacements and authorized topic consolidations. */
export function resolveQuestionShipCaseReplacements(
  catalog: SyntheticClinicalRelease,
  legacy: SyntheticClinicalRelease,
  views: Readonly<Record<string, SyntheticClinicalRelease>>,
  manifest: QuestionShipManifest,
) {
  const issues: string[] = [];
  const byLegacy = new Map<string, SyntheticClinicalCase>();
  const blockedLegacyIds = new Set<string>();
  const reservedTargetIds = new Set<string>();
  const concepts = new Set(catalog.concepts.map(concept => concept.id));
  const index: Readonly<Record<string, SyntheticClinicalRelease>> = {...views, catalog};
  const groups: ReplacementGroup[] = (manifest.replacements ?? []).map(relation => ({
    references: [relation.replaces], with: relation.with, errors: [], legacyIds: new Set(), targetIds: new Set(),
  }));
  const consolidations = manifest.topicConsolidations ?? [];
  for (const relation of consolidations) {
    const errors: string[] = [];
    if (relation.program !== "topic-program" || typeof relation.id !== "string" || !relation.id.trim() ||
      typeof relation.decision !== "string" || !relation.decision.trim())
      errors.push("topic consolidation requires explicit program, identity and manager decision");
    if (consolidations.filter(candidate => candidate.id === relation.id).length !== 1)
      errors.push("duplicate topic consolidation identity");
    const references: readonly string[] = Array.isArray(relation.replaces) ? relation.replaces : [];
    if (references.length < 2 || new Set(references).size !== references.length)
      errors.push("topic consolidation requires distinct legacy cases");
    groups.push({references, with: relation.with, errors, legacyIds: new Set(), targetIds: new Set()});
  }

  for (const group of groups) {
    for (const reference of group.references) {
      const matches = legacy.cases.filter(clinicalCase => clinicalCase.id === reference ||
        clinicalCase.decisionNodes.some(node => node.questionVariantId === reference));
      for (const clinicalCase of matches) {
        blockedLegacyIds.add(clinicalCase.id);
        group.legacyIds.add(clinicalCase.id);
      }
      if (matches.length !== 1) group.errors.push("replacement must identify one legacy case: " + reference);
    }
    // A case ID and its question ID cannot count as two retired cases.
    if (group.legacyIds.size !== group.references.length) group.errors.push("duplicate or unresolved legacy case");
    const targets = manifest.accepted.filter(row => row.questionVariantId === group.with);
    for (const row of targets) {
      group.targetIds.add(row.caseId);
      reservedTargetIds.add(row.caseId);
    }
    if (targets.length !== 1) {
      group.errors.push("replacement must identify one accepted exact draft: " + group.with);
      continue;
    }
    const target = targets[0]!;
    const sources = index[target.sourceView]?.cases.filter(clinicalCase => clinicalCase.id === target.caseId) ?? [];
    if (sources.length !== 1) {
      group.errors.push("replacement has missing or duplicate source case: " + group.with);
      continue;
    }
    const source = sources[0]!;
    group.source = source;
    if (legacy.cases.some(clinicalCase => clinicalCase.id === source.id) && !group.legacyIds.has(source.id))
      group.errors.push("target would overwrite another legacy case");
    if (manifest.headerSources[source.id] !== target.sourceView)
      group.errors.push("header must use the exact replacement source view");
    validateCompleteSource(source, target, manifest, concepts, group.errors);
  }

  for (const group of groups) {
    // Conflicts invalidate every affected group, including invalid siblings.
    // A valid prefix cannot retire part of a malformed consolidation.
    const conflict = groups.some(other => other !== group && (
      other.with === group.with ||
      [...group.legacyIds].some(id => other.legacyIds.has(id)) ||
      [...group.targetIds].some(id => other.targetIds.has(id))
    ));
    if (conflict) group.errors.push("duplicate or conflicting replacement relation");
    if (group.errors.length || !group.source) {
      issues.push(`invalid replacement ${group.references.join(", ")} -> ${group.with}: ${group.errors.join("; ")}`);
      continue;
    }
    for (const legacyId of group.legacyIds) byLegacy.set(legacyId, group.source);
  }
  return {issues, byLegacy, blockedLegacyIds, reservedTargetIds};
}

function validateCompleteSource(
  source: SyntheticClinicalCase,
  target: QuestionShipAcceptance,
  manifest: QuestionShipManifest,
  concepts: Set<string>,
  errors: string[],
) {
  const rows = manifest.accepted.filter(row => row.caseId === source.id);
  const nodeIds = new Set(source.decisionNodes.map(node => node.id));
  if (!source.decisionNodes.length || nodeIds.size !== source.decisionNodes.length)
    errors.push("empty or duplicate source nodes");
  if (rows.length !== source.decisionNodes.length)
    errors.push("whole source case must have exactly one acceptance for every node");
  for (const node of source.decisionNodes) {
    const matches = rows.filter(row => row.nodeId === node.id && row.questionVariantId === node.questionVariantId &&
      row.conceptId === node.primaryConceptId && row.sourceView === target.sourceView);
    if (matches.length !== 1 || !concepts.has(node.primaryConceptId))
      errors.push("unaccepted or unknown source node/concept " + node.id);
  }
}
