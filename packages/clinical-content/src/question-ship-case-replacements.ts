import type {SyntheticClinicalCase,SyntheticClinicalRelease} from "./schema";
import type {QuestionShipAcceptance,QuestionShipManifest} from "./question-ship-manifest";

/** Resolve only explicit whole-case relations at the shipping projection.
 * No admission, frozen-save or scheduler path calls this function. */
export function resolveQuestionShipCaseReplacements(
  catalog:SyntheticClinicalRelease,legacy:SyntheticClinicalRelease,
  views:Readonly<Record<string,SyntheticClinicalRelease>>,manifest:QuestionShipManifest,
) {
  const issues:string[]=[],byLegacy=new Map<string,SyntheticClinicalCase>();
  const blockedLegacyIds=new Set<string>(),reservedTargetIds=new Set<string>();
  const concepts=new Set(catalog.concepts.map(c=>c.id));
  const index:Readonly<Record<string,SyntheticClinicalRelease>>={...views,catalog};
  const candidates:(
    {legacyCase:SyntheticClinicalCase;target:QuestionShipAcceptance;source:SyntheticClinicalCase;errors:string[]}
  )[]=[];
  for(const relation of manifest.replacements??[]){
    const old=legacy.cases.filter(cs=>cs.id===relation.replaces||cs.decisionNodes.some(n=>n.questionVariantId===relation.replaces));
    old.forEach(cs=>blockedLegacyIds.add(cs.id));
    const targets=manifest.accepted.filter(r=>r.questionVariantId===relation.with);
    targets.forEach(r=>reservedTargetIds.add(r.caseId));
    if(old.length!==1||targets.length!==1){
      issues.push(`replacement must identify one legacy case and one accepted exact draft: ${relation.replaces} -> ${relation.with}`);
      continue;
    }
    const target=targets[0]!,sourceCases=index[target.sourceView]?.cases.filter(cs=>cs.id===target.caseId)??[];
    if(sourceCases.length!==1){
      issues.push(`replacement has missing or duplicate source case: ${relation.with}`);
      continue;
    }
    const source=sourceCases[0]!,errors:string[]=[];
    if(source.id!==old[0]!.id&&legacy.cases.some(cs=>cs.id===source.id))errors.push("target would overwrite another legacy case");
    if(manifest.headerSources[source.id]!==target.sourceView)errors.push("header must use the exact replacement source view");
    const rows=manifest.accepted.filter(r=>r.caseId===source.id);
    const nodeIds=new Set(source.decisionNodes.map(n=>n.id));
    if(!source.decisionNodes.length||nodeIds.size!==source.decisionNodes.length)errors.push("empty or duplicate source nodes");
    if(rows.length!==source.decisionNodes.length)errors.push("whole source case must have exactly one acceptance for every node");
    for(const node of source.decisionNodes){
      const matching=rows.filter(r=>r.nodeId===node.id&&r.questionVariantId===node.questionVariantId&&
        r.conceptId===node.primaryConceptId&&r.sourceView===target.sourceView);
      if(matching.length!==1||!concepts.has(node.primaryConceptId))errors.push(`unaccepted or unknown source node/concept ${node.id}`);
    }
    candidates.push({legacyCase:old[0]!,target,source,errors});
  }
  for(const candidate of candidates){
    const {legacyCase,target,source,errors}=candidate;
    // Reject both sides of a conflicting relation, rather than keeping whichever
    // row happened to be encountered first.
    const oldRelations=(manifest.replacements??[]).filter(r=>r.replaces===legacyCase.id||legacyCase.decisionNodes.some(n=>n.questionVariantId===r.replaces));
    const targetRelations=(manifest.replacements??[]).filter(r=>r.with===target.questionVariantId);
    if(oldRelations.length!==1||targetRelations.length!==1||candidates.filter(c=>c.source.id===source.id).length!==1)
      errors.push("duplicate or conflicting replacement relation");
    if(errors.length)issues.push(`invalid replacement ${legacyCase.id} -> ${target.questionVariantId}: ${errors.join("; ")}`);
    else byLegacy.set(legacyCase.id,source);
  }
  return {issues,byLegacy,blockedLegacyIds,reservedTargetIds};
}
