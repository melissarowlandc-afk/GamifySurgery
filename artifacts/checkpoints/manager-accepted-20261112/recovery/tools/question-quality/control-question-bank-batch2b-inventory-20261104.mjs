import fs from 'node:fs';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const summarize=release=>{
 const choices=release.cases.flatMap(cs=>cs.decisionNodes.flatMap((n,i)=>{
  const t=c.ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);
  return t?.classification.kind==='test_choices'?t.classification.choices.filter(x=>x.timing.kind==='test').map(x=>({terminal:i===cs.decisionNodes.length-1,key:n.answerChoices.find(a=>a.id===x.choiceId)?.isCorrect})):[];
 }));
 return {concepts:release.concepts.length,cases:release.cases.length,nodes:release.cases.flatMap(c=>c.decisionNodes).length,offeredStudies:choices.length,terminalTestingKeys:choices.filter(x=>x.terminal&&x.key).length};
};
const before=summarize(c.QUESTION_BANK_PRE_BATCH2B_RELEASE),after=summarize(c.SYNTHETIC_CLINICAL_RELEASE);
const result={checkedAt:new Date().toISOString(),scope:'Same current shared N1/N2 bank and timing registry on both sides; only the additive batch-2b projection differs. No source/runtime/evidence mutation.',before,after,delta:Object.fromEntries(Object.keys(before).map(k=>[k,after[k]-before[k]])),newConceptIds:c.QUESTION_BANK_BATCH2B_TESTED_CONCEPTS.map(c=>c.id)};
fs.writeFileSync('tools/question-quality/question-bank-batch2b-inventory-control-20261104.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
