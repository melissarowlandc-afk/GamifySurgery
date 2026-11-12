import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-bank-batch2a-round2-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const before=c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE,live=c.QUESTION_BANK_BATCH2A_ROUND2_RELEASE,revisions=c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS;
const clean=x=>JSON.parse(JSON.stringify(x)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),newContent=id=>/^question\.n\d+\./.test(id);
assert.equal(revisions.length,10);assert.equal(c.QUESTION_BANK_BATCH2A_ROUND2_TESTED_CONCEPTS.length,6);
assert.deepEqual(clean(c.QUESTION_QUALITY_CLINICAL_APPROVALS),entry.approvals);
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-round2-20261104.json','utf8'));
const pass=packet.find(p=>p.id==='B2A01'),oldPass=entry.packet.find(p=>p.id==='B2A01');
for(const k of ['before','after','rationalePairs','visibleHistory'])assert.deepEqual(pass[k],oldPass[k],'Frozen PASS '+k);
assert.equal(pass.pipelinePassed,true);assert.equal(pass.basicAccepted,true);
for(const p of packet.filter(p=>p.id!=='B2A01')){
 const s=specs.find(s=>s.id===p.id),r=revisions.find(r=>r.auditId===p.id),cs=live.cases.find(cs=>cs.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 assert.deepEqual(p.before,s.prior.after);assert.equal(p.after.variantId,n.questionVariantId);assert.equal(p.after.Task,n.stem.replaceAll('{patientName}','Jamie Taylor'));
 assert.equal(p.after.Presentation,cs.presentation.replaceAll('{patientName}','Jamie Taylor'));assert.equal(p.after['Current update'],(n.currentUpdate??null)?.replaceAll('{patientName}','Jamie Taylor')??null);
 assert.deepEqual(p.after.Exhibit,n.exhibit??null);
 const ordered=[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
 assert.deepEqual(p.after.Options,ordered.map(a=>(a.isCorrect?'**KEY:** ':'')+a.label));
 assert.deepEqual(p.encounterContinuity.afterGate,n.resultGateAfter);
 assert(p.after.Options[0].startsWith('**KEY:** '));assert.equal(p.after.Options.filter(x=>x.startsWith('**KEY:** ')).length,1);
 assert.equal(p.pipelinePassed,false);assert.equal(p.reviewStatus,'needs_clinician_review');assert.equal(p.releaseReady,false);
 for(const kind of ['cues','fairness','suggestions'])assert.equal(p.reviewResponse.noteResponses[kind].length,s.review[kind].length);
 for(const key of ['cueAttack','stageCategory','twoSteps','difficulty','oneBest'])assert(p.reviewResponse.selfCheck[key].length>30);
}
let unchangedCases=0,unchangedNodes=0;
for(const old of before.cases){const now=live.cases.find(c=>c.id===old.id),rr=revisions.filter(r=>r.caseId===old.id);assert(now);
 assert.deepEqual(now.decisionNodes.map(n=>n.id),old.decisionNodes.map(n=>n.id));
 if(!rr.length){assert.deepEqual(clean(now),clean(old),old.id);unchangedCases++;}
 for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){assert.deepEqual(clean(now.decisionNodes.find(x=>x.id===n.id)),clean(n),n.id);unchangedNodes++;}
}
assert.equal(unchangedCases,1181);assert.equal(unchangedNodes,1492);
for(const old of entry.release.cases.filter(c=>!c.decisionNodes.some(n=>newContent(n.questionVariantId))))assert.deepEqual(clean(before.cases.find(c=>c.id===old.id)),old,'Entry bank outside new-content lane '+old.id);
assert.deepEqual(clean(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,c.QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES.length)),clean(c.QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES));
assert.deepEqual(clean(c.QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES.filter(t=>!newContent(t.questionVariantId))),entry.timings.filter(t=>!newContent(t.questionVariantId)));
assert.deepEqual(clean(d.EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,entry.orders.length).filter(r=>!newContent(r.questionVariantId))),entry.orders.filter(r=>!newContent(r.questionVariantId)));
const orders=d.EXACT_TEST_CHOICE_ORDER_RECORDS.filter(o=>revisions.some(r=>r.questionVariantId===o.questionVariantId));assert.equal(orders.length,17);
for(const path of [
 'packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts',
 'packages/clinical-content/src/question-flags-round3-20261104.ts','packages/clinical-content/src/question-flags-round3-20261104-data.ts','packages/clinical-content/src/question-flags-round3-evidence-20261104.ts',
 'packages/clinical-content/src/question-flags-round2-20261104.ts','packages/clinical-content/src/question-flags-round2-20261104-data.ts',
 'apps/player/public/clinical-exhibits/batch2a-b01-pressure.png','apps/player/public/clinical-exhibits/batch2a-b03-pressure.png',
])assert.equal(sha(path),entry.files[path],'Protected source/asset '+path);
const changedEntryFiles=Object.entries(entry.files).filter(([p,h])=>fs.existsSync(p)&&sha(p)!==h).map(([path,previous])=>({path,previous,current:sha(path)}));
// Remove only our marked integration hunks in memory. Matching the immutable
// entry hash proves the other author's appended implementation was retained.
const restorations={
 'packages/clinical-content/src/index.ts':s=>s.replace(/^export \* from "\.\/question-bank-batch2a-round2(?:-evidence)?-20261104";\r?\n/gm,''),
 'packages/clinical-content/src/synthetic-content.ts':s=>s.replace(/\n\/\/ BEGIN BATCH2A ROUND2 projection[^]*?\/\/ END BATCH2A ROUND2 projection\.\r?\n/,'').replace('export const QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE =','export const SYNTHETIC_CLINICAL_RELEASE ='),
 'packages/clinical-content/src/answer-choice-timing.ts':s=>s.replace(/\n\/\/ BEGIN BATCH2A ROUND2 timing[^]*?\/\/ END BATCH2A ROUND2 timing\.\r?\n/,'').replace('export const QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES =','export const ANSWER_CHOICE_TIMING_REGISTRY ='),
 'packages/game-domain/src/test-choice-orders.ts':s=>s.replace(/\/\/ BEGIN QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS[^]*?\/\/ END QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS\r?\n\r?\n/,'').replace('\n  ...questionBankBatch2aRound2Records,',''),
};
const integrationHunks=Object.entries(restorations).map(([path,restore])=>{
 const text=restore(fs.readFileSync(path,'utf8')),restoredSha256=crypto.createHash('sha256').update(text).digest('hex');
 return {path,restoredSha256,entrySha256:entry.files[path],outsideOurHunksByteExact:restoredSha256===entry.files[path]};
});
const bound=[
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/game-domain/src/test-choice-orders.ts',
 'packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts','packages/clinical-content/src/question-bank-batch2a-round2-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts',
];
const report={checkedAt:new Date().toISOString(),revisions:10,newConcepts:6,entryConcepts:entry.release.concepts.length,currentConcepts:live.concepts.length,cases:live.cases.length,unchangedCases,unchangedNodes,
 retainedTimingRows:c.QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES.length,newTimingRows:c.QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES.length,entryOrderRows:entry.orders.length,newOrderRows:orders.length,gates:orders.filter(o=>o.disposition.kind==='result_gate_route_override').length,
 noteResponses:packet.filter(p=>p.id!=='B2A01').reduce((n,p)=>n+Object.values(p.reviewResponse.noteResponses).reduce((n,a)=>n+a.length,0),0),protected:'B2A01 visible fields, all old source definitions/images, fourteen flag drafts, F01/F12/F14 and all earlier exact approval records; no change across this projection to current N1/N2 cases.',
 concurrentNewContentChanges:before.cases.filter(cs=>{const old=entry.release.cases.find(c=>c.id===cs.id);return old&&cs.decisionNodes.some(n=>newContent(n.questionVariantId))&&JSON.stringify(old)!==JSON.stringify(cs);}).map(cs=>({caseId:cs.id,variants:cs.decisionNodes.map(n=>n.questionVariantId)})),
 exactLevel5BoundInputsThisRound:bound.map(path=>({path,change:Object.hasOwn(entry.files,path)?'modified':'added',sha256:sha(path)})),
 addedAssetOutsideLevel5SourceCollector:{path:'apps/player/public/clinical-exhibits/batch2a-r2-b04-pressure.png',sha256:sha('apps/player/public/clinical-exhibits/batch2a-r2-b04-pressure.png')},integrationHunks,changedEntryFiles};
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round2-verification-20261104.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,changedEntryFiles:changedEntryFiles.map(x=>x.path)}));
