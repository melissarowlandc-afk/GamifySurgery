import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-flags-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const clean=v=>v===undefined?v:JSON.parse(JSON.stringify(v)),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.deepEqual(clean(c.QUESTION_FLAGS_PRE_REVISION_RELEASE),entry.release,'starting clinical assembly changed');
const revisions=c.QUESTION_FLAG_REVISIONS,live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(revisions.length,16);assert.equal(live.cases.length,entry.release.cases.length);
let frozenCases=0,frozenNodes=0,changedNodes=0;
for(const old of entry.release.cases){
 const now=live.cases.find(cs=>cs.id===old.id);assert(now,old.id);
 const rr=revisions.filter(r=>r.caseId===old.id);
 if(!rr.length){assert.deepEqual(clean(now),old,old.id);frozenCases++;}
 assert.deepEqual(now.decisionNodes.map(n=>n.id),old.decisionNodes.map(n=>n.id));
 for(const n of old.decisionNodes){
   const current=now.decisionNodes.find(x=>x.id===n.id),r=rr.find(r=>r.nodeId===n.id);
   if(!r){assert.deepEqual(clean(current),n,n.id);frozenNodes++;continue;}
   changedNodes++;assert.equal(r.previousQuestionVariantId,n.questionVariantId);
   assert.equal(current.questionVariantId,r.questionVariantId);assert.equal(r.question.reviewStatus,'needs_clinician_review');
   assert.deepEqual(clean(current.resultGateAfter),n.resultGateAfter);
   assert.deepEqual(clean(current.answerChoices.find(x=>x.isCorrect).serviceRequest),n.answerChoices.find(x=>x.isCorrect).serviceRequest);
   assert(current.shuffleAnswers);assert([3,4].includes(current.answerChoices.length));
   for(const field of ['stem','explanation','teachingPoint'])assert(!/source.verification|pipeline|draft|claim\.|F\d\d|authored|constructed|needs_clinician_review/i.test(current[field]??''),r.auditId+' runtime editorial text '+field);
 }
}
assert.equal(changedNodes,16);assert.equal(frozenNodes,1407);assert.equal(frozenCases,1094);
assert.deepEqual(clean(c.QUESTION_QUALITY_CLINICAL_APPROVALS),entry.approvals);
assert.deepEqual(clean(live.concepts.slice(0,entry.release.concepts.length)),entry.release.concepts);
assert.equal(live.concepts.length,entry.release.concepts.length+2);
assert.deepEqual(clean(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,entry.timings.length)),entry.timings);
assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.length,entry.timings.length+16);
const oldOrders=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-orders-before-20261104.json','utf8'));
assert.deepEqual(clean(orders.EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,oldOrders.length)),oldOrders);
assert.equal(orders.EXACT_TEST_CHOICE_ORDER_RECORDS.length,oldOrders.length+12);
const registryPath='packages/game-domain/src/test-choice-orders.ts';
const restoredRegistry=fs.readFileSync(registryPath,'utf8')
 .replace(/\/\/ BEGIN QUESTION FLAGS 20261104 EXACT RECORDS[\s\S]*?\/\/ END QUESTION FLAGS 20261104 EXACT RECORDS\r?\n\r?\n/,'')
 .replace('\n  ...questionFlag20261104Records,','');
assert.equal(crypto.createHash('sha256').update(restoredRegistry).digest('hex'),entry.files[registryPath],'Only the new exact-record block/list entry may change');
const timedCounts=release=>{
 let total=0,terminalKeys=0;
 for(const cs of release.cases)for(const [i,n]of cs.decisionNodes.entries()){
  const row=c.ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);
  if(row.classification.kind!=='test_choices')continue;
  for(const ch of row.classification.choices)if(ch.timing.kind==='test'){total++;if(i===cs.decisionNodes.length-1&&n.answerChoices.find(a=>a.id===ch.choiceId).isCorrect)terminalKeys++;}
 }
 return {timedChoices:total,terminalTimedKeys:terminalKeys};
};
const timingDelta={before:timedCounts(entry.release),after:timedCounts(live),reason:'Neck prospective biopsy previews +3; removed HIDA CT -1; removed breast mammography -1. DCIS SLNB deferral preview replaces limited-node-sampling preview; ALND remains no_test. Four new keyed tests are planned/outside-only non-execution.'};
assert.deepEqual(timingDelta.after,{timedChoices:1468,terminalTimedKeys:139});
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-review-20261104.json','utf8'));
assert.equal(packet.length,17);assert.equal(packet.flatMap(p=>p.flags).length,18);
for(const p of packet){
 const s=specs.find(s=>s.id===p.id),r=revisions.find(r=>r.auditId===p.id),cs=live.cases.find(cs=>cs.id===p.caseId),n=cs.decisionNodes.find(n=>n.id===p.nodeId);
 assert.equal(p.after.variantId,n.questionVariantId);assert.equal(p.after.Task,n.stem.replaceAll('{patientName}','Jamie Taylor'));
 assert(p.keyOrderNotice.includes('key shown first for review only'));
 assert.equal(p.after.Options.filter(x=>x.startsWith('**KEY:** ')).length,1);
 assert.equal(p.pipelinePassed,false);assert.equal(p.releaseReady,false);assert.equal(p.supersededByLiveBatch1,false);
 if(s.hold){assert(!r);assert.deepEqual(p.before,p.after);assert(p.sourceVerificationHold);}
 else assert.equal(p.reviewStatus,'needs_clinician_review');
}
const ownedExisting=new Set([
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-quality-adversarial-r7.test.ts',
 'packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics-clinical-pairings.test.ts',
 'tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','docs/clinical/question-authoring-standard.md',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts',
 'apps/player/src/session/flagFreeze.test.tsx',
 'packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/game-domain/tests/gs028-20261002-batch.test.ts',
 'packages/game-domain/tests/gs028-20261003-batch.test.ts',
 'packages/game-domain/tests/gs028-20261007-batch.test.ts',
 'packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts',
 'packages/game-domain/tests/patient-supply.test.ts',
 'packages/game-domain/tests/diagnostics/patient-supply.test.ts',
]);
const changes=Object.entries(entry.files).flatMap(([path,old])=>{const current=fs.existsSync(path)?hash(path):null;return old===current?[]:[{path,entry:old,current,ownership:ownedExisting.has(path)?'this milestone':'external/shared tree; this worker did not edit'}];});
const boundPaths=[];const walk=dir=>{for(const x of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+x.name;if(x.isDirectory())walk(p);else if(!/\.(test|spec)\./.test(p)&&/\.(ts|json)$/.test(p))boundPaths.push(p);}};
for(const d of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src'])walk(d);
boundPaths.push('tests/fixtures/level-five-integration.ts','tests/fixtures/level-five-rooms.ts','tests/fixtures/level-four-rooms.ts','tools/economy-audit/level-four-simulation.ts','tools/qa/level-five-integration-run.mjs');
const evidence=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8'));
const bound={changedThisMilestone:boundPaths.filter(p=>entry.files[p]&&hash(p)!==entry.files[p]&&ownedExisting.has(p)).map(p=>({path:p,entry:entry.files[p],current:hash(p),recorded:evidence.inputs[p]??null})),
 addedThisMilestone:['packages/clinical-content/src/question-flags-20261104.ts','packages/clinical-content/src/question-flags-20261104-data.ts'].map(path=>({path,current:hash(path)})),
 allRecordedDifferences:Object.entries(evidence.inputs).filter(([p,h])=>!fs.existsSync(p)||hash(p)!==h).map(([path,recorded])=>({path,recorded,current:fs.existsSync(path)?hash(path):null})),
 newSinceRecorded:boundPaths.filter(p=>!Object.hasOwn(evidence.inputs,p)),recordedInputCount:Object.keys(evidence.inputs).length,currentInputCount:boundPaths.length,
 note:'Read-only input audit. Manager performs the actual Level 5 rebind and any necessary behavioral refresh; no evidence was edited.'};
assert.equal(bound.changedThisMilestone.length,4);
const protectedChanges=changes.filter(x=>!ownedExisting.has(x.path)&&/^(?:apps\/player\/src\/session|supabase|tests\/fixtures|tools\/qa|tools\/economy-audit|packages\/game-domain)/.test(x.path));
const output={checkedOn:'2026-11-04',frozenCases,frozenNodes,changedNodes,conceptsBefore:entry.release.concepts.length,conceptsAfter:live.concepts.length,
  timingsBefore:entry.timings.length,timingsAfter:c.ANSWER_CHOICE_TIMING_REGISTRY.length,approvalsPreserved:entry.approvals.length,
  exactOrdersBefore:oldOrders.length,exactOrdersAfter:orders.EXACT_TEST_CHOICE_ORDER_RECORDS.length,originalRegistryBytesPreservedOutsideAppend:true,timingDelta,
  changedExistingFiles:changes,protectedChanges,boundInputs:bound,holds:packet.filter(p=>p.sourceVerificationHold||p.scopeDecision).map(p=>({id:p.id,source:p.sourceVerificationHold,scope:p.scopeDecision}))};
fs.writeFileSync('tools/question-quality/question-flags-verification-20261104.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({...output,changedExistingFiles:changes.map(c=>({path:c.path,ownership:c.ownership})),boundInputs:{...bound,allRecordedDifferences:bound.allRecordedDifferences.map(x=>x.path)}},null,2));
