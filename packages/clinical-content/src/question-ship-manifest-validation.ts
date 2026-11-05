import type { SyntheticClinicalRelease } from "./schema";
import { QUESTION_SHIP_MANIFEST, type QuestionShipManifest } from "./question-ship-manifest";

/** Build/test diagnostics only; not called by the live projection or exported
 * from the runtime barrel. */
export function questionShipManifestIssues(
  catalog: SyntheticClinicalRelease,
  legacy: SyntheticClinicalRelease,
  views: Readonly<Record<string, SyntheticClinicalRelease>>,
  manifest: QuestionShipManifest = QUESTION_SHIP_MANIFEST,
): string[] {
  const issues: string[] = [];
  const concepts = new Set(catalog.concepts.map(concept => concept.id));
  const index = new Map(Object.entries({ ...views, catalog }).map(([name, release]) => {
    if (new Set(release.cases.map(cs => cs.id)).size !== release.cases.length) issues.push(`duplicate case: ${name}`);
    return [name, new Map(release.cases.map(cs => [cs.id, cs]))] as const;
  }));
  if (views.legacy !== legacy) issues.push("missing or changed legacy view");
  const legacyKeys = new Set<string>();
  for (const [caseId, nodeId, variantId, conceptId] of manifest.legacyBindings) {
    const key = JSON.stringify([caseId, nodeId]);
    if (legacyKeys.has(key)) issues.push(`duplicate legacy node: ${key}`);
    legacyKeys.add(key);
    const node = legacy.cases.find(cs => cs.id === caseId)?.decisionNodes.find(node => node.id === nodeId);
    if (!node || node.questionVariantId !== variantId || node.primaryConceptId !== conceptId) issues.push(`changed legacy binding: ${key}`);
  }
  for (const cs of legacy.cases) for (const node of cs.decisionNodes) {
    if (!legacyKeys.has(JSON.stringify([cs.id, node.id]))) issues.push(`unbound legacy node: ${cs.id}/${node.id}`);
  }
  const acceptedKeys = new Set<string>(), acceptanceIds = new Set<string>();
  for (const row of manifest.accepted) {
    const key = JSON.stringify([row.caseId, row.nodeId]);
    if (acceptedKeys.has(key)) issues.push(`duplicate accepted node: ${key}`);
    if (acceptanceIds.has(row.acceptanceId)) issues.push(`duplicate acceptance ID: ${row.acceptanceId}`);
    acceptedKeys.add(key); acceptanceIds.add(row.acceptanceId);
    const source = index.get(row.sourceView);
    if (!source) issues.push(`missing view: ${row.sourceView}`);
    const nodes = source?.get(row.caseId)?.decisionNodes.filter(node => node.id === row.nodeId) ?? [];
    if (nodes.length !== 1) issues.push(`missing or duplicate source node: ${key}`);
    const node = nodes[0];
    if (!node || node.questionVariantId !== row.questionVariantId) issues.push(`unknown version: ${row.acceptanceId}`);
    if (!node || node.primaryConceptId !== row.conceptId || !concepts.has(row.conceptId)) issues.push(`changed or unknown concept: ${row.acceptanceId}`);
    const headerView = manifest.headerSources[row.caseId] ?? "legacy";
    const header = index.get(headerView)?.get(row.caseId);
    if (!header) issues.push(`missing header view/case: ${row.caseId}/${headerView}`);
    if (header && !header.decisionNodes.some(node => node.id === row.nodeId)) issues.push(`unknown header node: ${key}`);
  }
  const shippedCases = new Set([...legacy.cases.map(cs => cs.id), ...manifest.accepted.map(row => row.caseId)]);
  for (const caseId of shippedCases) {
    const headerView = manifest.headerSources[caseId] ?? "legacy";
    const header = index.get(headerView)?.get(caseId);
    if (!header) continue;
    const ids = header.decisionNodes.map(node => node.id);
    if (new Set(ids).size !== ids.length) issues.push(`duplicate header node: ${caseId}`);
    for (const node of header.decisionNodes) {
      const key = JSON.stringify([caseId, node.id]);
      if (!legacyKeys.has(key) && !acceptedKeys.has(key)) issues.push(`unaccepted header node: ${key}`);
    }
  }
  return issues;
}
