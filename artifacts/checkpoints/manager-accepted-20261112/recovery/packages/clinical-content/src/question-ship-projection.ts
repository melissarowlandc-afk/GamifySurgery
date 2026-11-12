import type { SyntheticClinicalCase, SyntheticClinicalRelease } from "./schema";
import { QUESTION_SHIP_MANIFEST, type QuestionShipManifest } from "./question-ship-manifest";
import { resolveQuestionShipCaseReplacements } from "./question-ship-case-replacements";

/** The only runtime shipping boundary. Explicit catalogs remain usable.
 * Frozen encounters never pass through this projection. */
export function projectManagerAcceptedQuestions(
  catalog: SyntheticClinicalRelease,
  legacy: SyntheticClinicalRelease,
  views: Readonly<Record<string, SyntheticClinicalRelease>>,
  manifest: QuestionShipManifest = QUESTION_SHIP_MANIFEST,
): SyntheticClinicalRelease {
  // A source-view configuration error must not remove the legacy fallback.
  const legacyCases = new Map(legacy.cases.map(cs => [cs.id, cs]));
  const index = new Map(Object.entries({ ...views, catalog }).map(([name, release]) =>
    [name, new Map(release.cases.map(cs => [cs.id, cs]))]));
  const concepts = new Set(catalog.concepts.map(concept => concept.id));
  const replacements=resolveQuestionShipCaseReplacements(catalog,legacy,views,manifest);
  for(const issue of replacements.issues)
    console.warn(`[question-ship] ${issue}; retaining legacy case and omitting unverifiable replacement.`);
  const rows = new Map<string, QuestionShipManifest["accepted"][number][]>();
  for (const row of manifest.accepted) {
    rows.set(row.caseId, [...(rows.get(row.caseId) ?? []), row]);
  }
  const cases: SyntheticClinicalCase[] = [];
  const admittedReplacementIds = new Set<string>();
  for (const caseId of new Set([...legacyCases.keys(), ...rows.keys()])) {
    const fallback = legacyCases.get(caseId);
    const replacement=replacements.byLegacy.get(caseId);
    if(replacement){
      // Use the complete accepted source, including its node list. Never merge
      // retired neighbors into an explicitly approved one-node encounter.
      if (!admittedReplacementIds.has(replacement.id)) {
        cases.push(replacement);
        admittedReplacementIds.add(replacement.id);
      }
      continue;
    }
    if(replacements.blockedLegacyIds.has(caseId)||replacements.reservedTargetIds.has(caseId)){
      // Also prevents a malformed whole-case relation from silently becoming a
      // partial node override or an ordinary new-case acceptance.
      if(fallback)cases.push(fallback);
      continue;
    }
    const overrides = rows.get(caseId) ?? [];
    if (!overrides.length) {
      if (fallback) cases.push(fallback);
      continue;
    }
    const retainLegacy = (reason: string) => {
      console.warn(`[question-ship] ${caseId}: ${reason}; ${fallback ? "retaining legacy case" : "omitting new draft"}.`);
      if (fallback) cases.push(fallback);
    };
    if (new Set(overrides.map(row => row.nodeId)).size !== overrides.length) {
      retainLegacy("duplicate acceptance node");
      continue;
    }
    const headerView = manifest.headerSources[caseId] ?? "legacy";
    const header = index.get(headerView)?.get(caseId);
    if (!header) {
      retainLegacy(`missing case header in ${headerView}`);
      continue;
    }
    const baseNodes = fallback?.decisionNodes ?? header.decisionNodes;
    const nodeIds = new Set(baseNodes.map(node => node.id));
    if (nodeIds.size !== baseNodes.length ||
      new Set(header.decisionNodes.map(node => node.id)).size !== header.decisionNodes.length ||
      overrides.some(row => !nodeIds.has(row.nodeId)) ||
      (!fallback && baseNodes.some(node => !overrides.some(row => row.nodeId === node.id)))) {
      retainLegacy("duplicate, unknown or unaccepted case node");
      continue;
    }
    const nodes = [];
    let invalid = false;
    for (const node of baseNodes) {
      const row = overrides.find(row => row.nodeId === node.id);
      if (!row) {
        nodes.push(node);
        continue;
      }
      const matches = index.get(row.sourceView)?.get(caseId)?.decisionNodes.filter(candidate => candidate.id === row.nodeId);
      const candidate = matches?.[0];
      if (matches?.length !== 1 || !candidate ||
        candidate.questionVariantId !== row.questionVariantId || candidate.primaryConceptId !== row.conceptId ||
        !concepts.has(row.conceptId)) {
        retainLegacy(`missing exact accepted version/concept ${row.acceptanceId} in ${row.sourceView}`);
        invalid = true;
        break;
      }
      nodes.push(candidate);
    }
    if (invalid) continue;
    cases.push({
      ...header, decisionNodes: nodes,
      // Mixed accepted/fallback cases summarize the definitions actually used.
      learningSummary: nodes.length === 1 ? nodes[0]!.explanation : nodes.map(node => node.explanation).join(" "),
    });
  }
  // Preserve concepts used by prior frozen encounters and FSRS histories.
  return { ...catalog, cases };
}
