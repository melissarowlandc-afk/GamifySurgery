import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const c=await import('../../packages/clinical-content/src/index.ts');
const path='packages/clinical-content/src/question-ship-manifest.ts';
assert.ok(!fs.existsSync(path),'One-time seed only. Later acceptance is an explicit manager edit.');
const baseline=c.QUESTION_FLAGS_PRE_REVISION_RELEASE;
const flags=['F01','F09','F12','F03','F05','F10','F11','F15','F17'];
const batch2a=['B2A01','B2A02','B2A04','B2A05','B2A06','B2A07','B2A08','B2A09','B2A10','B2A11'];
const accepted=[];const headerSources=new Map();
function rewrites(ids,groups,view,decision){for(const id of ids){
 const chain=groups.flatMap(group=>c[group]).filter(r=>r.id.toLowerCase().endsWith('.'+id.toLowerCase()));
 const r=chain.at(-1);assert.ok(r,id);
 accepted.push({acceptanceId:id,caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.question.id,conceptId:r.question.conceptId,sourceView:view,decision});
 if(chain.some(r=>r.presentationTemplate!==undefined))headerSources.set(r.caseId,view);
}}
rewrites(flags,['QUESTION_FLAG_REVISIONS','QUESTION_FLAG_ROUND2_REVISIONS','QUESTION_FLAG_ROUND3_REVISIONS'],'flags-round3','docs/research/question-flags-manager-decision-20261104.md');
rewrites(batch2a,['QUESTION_BANK_BATCH2A_REVISIONS','QUESTION_BANK_BATCH2A_ROUND2_REVISIONS','QUESTION_BANK_BATCH2A_ROUND3_REVISIONS'],'batch2a-round3','docs/research/question-bank-batch2a-manager-decision-20261104.md');
for(const n of [1,2]){
 const decision=`docs/research/question-new-n${n}-review2-20261104.json`;
 const rows=JSON.parse(fs.readFileSync(decision));
 const cases=c[`QUESTION_NEW_N${n}_ROUND2_CASES`];
 for(const r of rows.filter(r=>r.verdict==='PASS')){
  const variant=r.id.replace(/^review\./,'question.');const cs=cases.find(cs=>cs.decisionNodes.some(node=>node.questionVariantId===variant));assert.ok(cs,variant);
  const node=cs.decisionNodes.find(node=>node.questionVariantId===variant);
  accepted.push({acceptanceId:r.id,caseId:cs.id,nodeId:node.id,questionVariantId:variant,conceptId:node.primaryConceptId,sourceView:`n${n}-round2`,decision});
  headerSources.set(cs.id,`n${n}-round2`);
 }
}
assert.equal(accepted.length,40);
const bindings=baseline.cases.flatMap(cs=>cs.decisionNodes.map(node=>[cs.id,node.id,node.questionVariantId,node.primaryConceptId]));
const text=`import type { SyntheticClinicalCase } from "./schema";

/** Single shipping authority. Editorial acceptance is NOT clinical approval.
 * Legacy tuples are a one-time explicit carry-forward of the pre-flag live bank.
 * No new/draft tuple is implicitly accepted; never regenerate from the catalog.
 * Manager adds exact accepted tuples and their decision record here. */
export interface QuestionShipAcceptance {
  acceptanceId: string; caseId: string; nodeId: string; questionVariantId: string; conceptId: string;
  sourceView: string; decision: string;
}
export const QUESTION_SHIP_MANIFEST = {
  id: "question-ship.2026-11-04.v1",
  clinicalApproval: false,
  legacyDecision: "Carry forward the existing live bank before the owner-flag rewrite program; user-directed fallback on 2026-11-05. This does not independently accept prior drafts or grant clinical approval.",
  legacyBindings: ${JSON.stringify(bindings,null,2)} as const,
  accepted: ${JSON.stringify(accepted,null,2)} satisfies QuestionShipAcceptance[],
  headerSources: ${JSON.stringify(Object.fromEntries(headerSources),null,2)} as Record<string,string>,
} as const;

const key = (caseId:string,nodeId:string) => JSON.stringify([caseId,nodeId]);
const allowed = new Map<string,readonly [string,string]>();
for (const [caseId,nodeId,questionVariantId,conceptId] of QUESTION_SHIP_MANIFEST.legacyBindings)
  allowed.set(key(caseId,nodeId),[questionVariantId,conceptId]);
for (const row of QUESTION_SHIP_MANIFEST.accepted)
  allowed.set(key(row.caseId,row.nodeId),[row.questionVariantId,row.conceptId]);
const allowedNodeCount = new Map<string,number>();
for (const identity of allowed.keys()) {
  const [caseId] = JSON.parse(identity) as [string,string];
  allowedNodeCount.set(caseId,(allowedNodeCount.get(caseId) ?? 0)+1);
}

/** Fresh admissions/selection only. Frozen encounters are never rewritten. */
export function isQuestionCaseManagerAccepted(clinicalCase:SyntheticClinicalCase):boolean {
  return clinicalCase.decisionNodes.length > 0 &&
    clinicalCase.decisionNodes.length === allowedNodeCount.get(clinicalCase.id) &&
    new Set(clinicalCase.decisionNodes.map(node=>node.id)).size === clinicalCase.decisionNodes.length &&
    clinicalCase.decisionNodes.every(node=>{
      const binding=allowed.get(key(clinicalCase.id,node.id));
      return binding?.[0]===node.questionVariantId && binding[1]===node.primaryConceptId;
    });
}
`;
fs.writeFileSync(path,text);
fs.writeFileSync('.local-dev/question-new-n2-round3-ship-gate-20261104/ship-seed-receipt.json',JSON.stringify({
 baselineCases:baseline.cases.length,legacyBindings:bindings.length,accepted,headerSources:Object.fromEntries(headerSources),
 decisionHashes:Object.fromEntries([...new Set(accepted.map(r=>r.decision))].map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')])),
},null,2)+'\n');
console.log({baselineCases:baseline.cases.length,legacyBindings:bindings.length,accepted:accepted.length});
