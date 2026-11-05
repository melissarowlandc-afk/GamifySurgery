import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-flags-round3-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const clean=x=>x===undefined?x:JSON.parse(JSON.stringify(x));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const revisions=c.QUESTION_FLAG_ROUND3_REVISIONS,ownLive=c.QUESTION_NEW_N1_PRE_RELEASE,live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.deepEqual(clean(c.QUESTION_FLAGS_PRE_ROUND3_RELEASE),entry.release);
assert.equal(revisions.length,14);assert.equal(c.QUESTION_FLAG_ROUND3_AUTHORING_CONCEPTS.length,8);
assert.deepEqual(clean(c.QUESTION_QUALITY_CLINICAL_APPROVALS),entry.approvals);
let frozenCases=0,frozenNodes=0;
for(const old of entry.release.cases){const now=ownLive.cases.find(c=>c.id===old.id),rr=revisions.filter(r=>r.caseId===old.id);
 assert(now,old.id);assert.deepEqual(now.decisionNodes.map(n=>n.id),old.decisionNodes.map(n=>n.id));
 if(!rr.length){assert.deepEqual(clean(now),old,old.id);frozenCases++;}
 for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){assert.deepEqual(clean(now.decisionNodes.find(x=>x.id===n.id)),n,n.id);frozenNodes++;}
 assert.deepEqual(clean(live.cases.find(c=>c.id===old.id)),clean(now),'Concurrent existing-case change '+old.id);
}
assert.equal(frozenCases,1096);assert.equal(frozenNodes,1409);
assert.deepEqual(clean(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,entry.timings.length)),entry.timings);
assert.deepEqual(clean(d.EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,entry.orders.length)),entry.orders);
const newOrders=d.EXACT_TEST_CHOICE_ORDER_RECORDS.filter(x=>revisions.some(r=>r.questionVariantId===x.questionVariantId));assert.equal(newOrders.length,18);
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-round3-review-20261104.json','utf8'));
const aggregate=JSON.parse(fs.readFileSync('docs/research/question-flags-review-20261104.json','utf8'));
assert.equal(packet.length,14);
for(const id of ['F01','F12','F14'])assert.deepEqual(aggregate.find(x=>x.id===id),entry.packet.find(x=>x.id===id));
for(const p of packet){const r=revisions.find(r=>r.auditId===p.id),cs=live.cases.find(x=>x.id===r.caseId),n=cs.decisionNodes.find(x=>x.id===r.nodeId);
 assert.equal(p.after.variantId,n.questionVariantId);assert.equal(p.after.Presentation,cs.presentation.replaceAll('{patientName}','Jamie Taylor'));assert.equal(p.after.Task,n.stem.replaceAll('{patientName}','Jamie Taylor'));
 assert.deepEqual(p.after.Exhibit,n.exhibit??null);assert(p.after.Options[0].startsWith('**KEY:** '));assert.equal(p.after.Options.filter(x=>x.startsWith('**KEY:** ')).length,1);
 assert.equal(p.reviewStatus,'needs_clinician_review');assert.equal(p.pipelinePassed,false);assert.equal(p.releaseReady,false);
 for(const k of ['cues','fairness','suggestions'])assert.equal(p.reviewResponse.noteResponses[k].length,entry.review.find(x=>x.id===p.id)[k].length);
}
const ownExisting=[
 'packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-bank-batch2a-20261104.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/question-bank-batch2a-bindings.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts','packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/game-domain/tests/gs028-20261007-batch.test.ts','packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts','packages/game-domain/tests/diagnostics/patient-supply.test.ts',
 'packages/game-domain/tests/gs028-20261002-batch.test.ts','packages/game-domain/tests/gs028-20261003-batch.test.ts','packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts','packages/game-domain/tests/patient-supply.test.ts',
];
const changed=Object.entries(entry.files).filter(([p,h])=>fs.existsSync(p)&&sha(p)!==h).map(([path,previous])=>({path,previous,current:sha(path),ownership:ownExisting.includes(path)?'round-three scoped edit (shared assembly may also include N1/N2 appends)':'concurrent unrelated change; preserved'}));
// Exact protected authored definitions/assets, independent of shared runtime additions.
for(const p of [
 'packages/clinical-content/src/question-flags-round2-20261104.ts','packages/clinical-content/src/question-flags-round2-20261104-data.ts',
 'packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts',
 'apps/player/public/clinical-exhibits/batch2a-b01-pressure.png','apps/player/public/clinical-exhibits/batch2a-b03-pressure.png',
])assert.equal(sha(p),entry.files[p],'Frozen definition/asset changed '+p);
const ownBoundInputs=[
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/question-flags-round3-20261104.ts','packages/clinical-content/src/question-flags-round3-20261104-data.ts','packages/clinical-content/src/question-flags-round3-evidence-20261104.ts',
 'packages/game-domain/src/test-choice-orders.ts',
];
const report={verifiedOn:new Date().toISOString(),revisions:14,newConcepts:8,frozenCases,frozenNodes,retainedTimings:entry.timings.length,retainedOrders:entry.orders.length,newOrders:newOrders.length,
 entryConcepts:entry.release.concepts.length,ownConcepts:ownLive.concepts.length,currentConcepts:live.concepts.length,entryCases:entry.release.cases.length,currentCases:live.cases.length,
 noteResponses:packet.reduce((n,p)=>n+Object.values(p.reviewResponse.noteResponses).reduce((n,a)=>n+a.length,0),0),
 exactLevel5BoundInputsThisRound:ownBoundInputs.map(path=>({path,change:Object.hasOwn(entry.files,path)?'modified':'added',sha256:sha(path)})),changedEntryFiles:changed,
 concurrentNewContent:live.cases.filter(cs=>!entry.release.cases.some(old=>old.id===cs.id)).map(cs=>({caseId:cs.id,variantIds:cs.decisionNodes.map(n=>n.questionVariantId)})),
 frozenSourceDefinitionHashes:'Exact for round-two definitions (including F01/F12), batch-2a definitions/evidence and both PNGs. All earlier approvals and source-held F14 exact. Shared assembly appends are separately attributed.'};
fs.writeFileSync('tools/question-quality/question-flags-round3-verification-20261104.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,changedEntryFiles:changed.map(x=>x.path),concurrentNewContent:report.concurrentNewContent.length}));
