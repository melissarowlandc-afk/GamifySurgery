import fs from 'node:fs';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const families=['GS028_20261002_CASES','GS028_20261003_CASES','GS028_20261007_CASES'];
const report=families.map(key=>{
 const ids=new Set(c[key].map(c=>c.id));
 const run=release=>{
  const cases=release.cases.filter(c=>ids.has(c.id)),records=d.EXACT_TEST_CHOICE_ORDER_RECORDS.filter(r=>cases.some(c=>c.id===r.caseId&&c.decisionNodes.some(n=>n.id===r.nodeId&&n.questionVariantId===r.questionVariantId)));
  const kind=r=>r.disposition.kind+(r.disposition.kind==='not_executed'?'.'+r.disposition.reason:'');
  return {total:records.length,byDisposition:Object.fromEntries([...new Set(records.map(kind))].map(k=>[k,records.filter(r=>kind(r)===k).length])),records:records.filter(r=>r.questionVariantId.includes('.r')&&r.questionVariantId===c.QUESTION_BANK_BATCH2B_REVISIONS.find(v=>v.questionVariantId===r.questionVariantId)?.questionVariantId)};
 };
 return {family:key,before:run(c.QUESTION_BANK_PRE_BATCH2B_RELEASE),after:run(c.SYNTHETIC_CLINICAL_RELEASE)};
});
fs.writeFileSync('tools/question-quality/question-bank-batch2b-records-control-20261104.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Current and prior stages use the same retained exact registry; compare only current node/version tuples.',families:report},null,2)+'\n');
console.log(JSON.stringify(report.map(r=>({family:r.family,before:{total:r.before.total,byDisposition:r.before.byDisposition},after:{total:r.after.total,byDisposition:r.after.byDisposition},newRecords:r.after.records.map(r=>({variant:r.questionVariantId,choice:r.choiceId,profile:r.timingProfileId,disposition:r.disposition}))}))));
