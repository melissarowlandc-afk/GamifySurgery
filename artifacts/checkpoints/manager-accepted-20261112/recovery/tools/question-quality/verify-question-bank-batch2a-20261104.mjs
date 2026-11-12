import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-bank-batch2a-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const clean=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rr=c.QUESTION_BANK_BATCH2A_REVISIONS,live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.deepEqual(clean(c.QUESTION_BANK_PRE_BATCH2A_RELEASE),entry.release);
assert.deepEqual(clean(c.QUESTION_FLAG_ROUND2_REVISIONS),entry.flagRound2Revisions);
assert.deepEqual(clean(c.QUESTION_QUALITY_CLINICAL_APPROVALS),entry.approvals);
assert.equal(rr.length,11);assert.deepEqual(clean(live.concepts.slice(0,412)),entry.release.concepts);assert.equal(live.concepts.length,414);
let frozenCases=0,frozenNodes=0;
for(const old of entry.release.cases){
 const now=live.cases.find(x=>x.id===old.id),revisions=rr.filter(r=>r.caseId===old.id);assert(now);
 if(!revisions.length){assert.deepEqual(clean(now),old);frozenCases++;}
 for(const k of ['earliestFacilityStage','requiredCapabilityIds','routineEligible','tutorialEligible','participant'])assert.deepEqual(clean(now[k]),old[k],old.id+' '+k);
 assert.deepEqual(now.decisionNodes.map(n=>n.id),old.decisionNodes.map(n=>n.id));
 for(const n of old.decisionNodes){const next=now.decisionNodes.find(x=>x.id===n.id),r=revisions.find(r=>r.nodeId===n.id);
  if(!r){assert.deepEqual(clean(next),n);frozenNodes++;continue;}
  assert.equal(next.questionVariantId,r.questionVariantId);assert.equal(r.previousQuestionVariantId,n.questionVariantId);
  assert.equal(r.question.reviewStatus,'needs_clinician_review');assert.equal(r.question.lastClinicianReview,null);assert(next.shuffleAnswers);assert([3,4].includes(next.answerChoices.length));
  assert.deepEqual(clean(next.resultGateAfter),r.clinicalBinding.nextResultGate);
 }
}
assert.equal(frozenCases,1101);assert.equal(frozenNodes,1412);
for(const r of entry.flagRound2Revisions)assert.deepEqual(clean(live.cases.find(cs=>cs.id===r.caseId)),entry.release.cases.find(cs=>cs.id===r.caseId));
assert.deepEqual(clean(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,1799)),entry.timings);assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.length,1810);
assert.deepEqual(clean(d.EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,357)),entry.orders);assert.equal(d.EXACT_TEST_CHOICE_ORDER_RECORDS.length,371);
const restored=fs.readFileSync('packages/game-domain/src/test-choice-orders.ts','utf8').replace(/\/\/ BEGIN QUESTION BANK BATCH2A 20261104 EXACT RECORDS[\s\S]*?\/\/ END QUESTION BANK BATCH2A 20261104 EXACT RECORDS\r?\n\r?\n/,'').replace('\n  ...questionBankBatch2aRecords,','');
assert.equal(restored,entry.registryText);
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-20261104.json','utf8'));
assert.equal(packet.length,11);
for(const p of packet){const r=rr.find(r=>r.auditId===p.id),cs=live.cases.find(cs=>cs.id===p.caseId),n=cs.decisionNodes.find(n=>n.id===p.nodeId);
 assert.equal(p.after.variantId,n.questionVariantId);assert.equal(p.after.Task,n.stem.replaceAll('{patientName}','Jamie Taylor'));assert.equal(p.after.Presentation,cs.presentation.replaceAll('{patientName}','Jamie Taylor'));
 assert.deepEqual(p.after.Exhibit,n.exhibit??null);assert(p.after.Options[0].startsWith('**KEY:** '));assert.equal(p.after.Options.filter(a=>a.startsWith('**KEY:** ')).length,1);assert(p.keyOrderNotice.includes('key shown first for review only'));
 assert.equal(p.pipelinePassed,false);assert.equal(p.releaseReady,false);assert.equal(p.reviewStatus,'needs_clinician_review');assert(p.reviewResponse.notes.length);
 assert.deepEqual(p.supportingEvidenceClaimIds,r.question.supportingEvidenceClaimIds);
}
const ownedExisting=[
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/schema.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-flags-round2-20261104.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/approved-clinical-admission.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts','packages/game-domain/tests/question-flags-round2-bindings.test.ts',
 'packages/game-domain/tests/patient-supply.test.ts','packages/game-domain/tests/diagnostics/patient-supply.test.ts',
 'packages/game-domain/tests/gs028-20261007-batch.test.ts','packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts','packages/game-domain/tests/surgery-center-batch.test.ts',
 'apps/player/src/ui/ChartPanel.tsx','apps/player/src/mobile/MobileChart.tsx',
 'tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/report.mjs','tools/question-quality/bank.mjs','tools/question-quality/owner-flag-rules-20261104.mjs',
 'docs/clinical/question-authoring-standard.md',
];
const changes=Object.entries(entry.files).filter(([p,h])=>sha(p)!==h).map(([path,old])=>({path,entry:old,current:sha(path),ownership:ownedExisting.includes(path)?'this batch':'external shared-tree change; preserve and report'}));
const ownNew=new Set(['packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104.test.ts','packages/game-domain/tests/question-bank-batch2a-bindings.test.ts','apps/player/src/ui/ClinicalImageExhibit.tsx','apps/player/src/ui/ClinicalImageExhibit.test.tsx']);
const externalAddedFiles=[];function inventoryNew(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())inventoryNew(p);else if(/\.(?:ts|tsx|mjs|cjs|json|md|sql|svg)$/.test(p)&&!Object.hasOwn(entry.files,p)&&!ownNew.has(p))externalAddedFiles.push({path:p,current:sha(p),ownership:'concurrent external addition; not edited by this worker'});}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','tools/economy-audit','apps/player/src','apps/player/public','supabase'])inventoryNew(dir);
const paths=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(?:ts|json)$/.test(p)&&!/(?:\.test\.|\.spec\.)/.test(p))paths.push(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src'])walk(dir);
paths.push('tests/fixtures/level-five-integration.ts','tests/fixtures/level-five-rooms.ts','tests/fixtures/level-four-rooms.ts','tools/economy-audit/level-four-simulation.ts','tools/qa/level-five-integration-run.mjs');
const recorded=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8')).inputs;
const added=['packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts'];
const bound={recordedInputCount:Object.keys(recorded).length,currentInputCount:paths.length,
 changedThisBatch:paths.filter(p=>entry.files[p]&&sha(p)!==entry.files[p]&&ownedExisting.includes(p)).map(path=>({path,entry:entry.files[path],current:sha(path),recorded:recorded[path]??null})),
 addedThisBatch:added.map(path=>({path,current:sha(path)})),allRecordedDifferences:Object.entries(recorded).filter(([p,h])=>sha(p)!==h).map(([path,hash])=>({path,recorded:hash,current:sha(path),changedSinceBatch2aEntry:entry.files[path]!==sha(path)})),newSinceRecorded:paths.filter(p=>!Object.hasOwn(recorded,p)),
 externalChangesSinceBatchEntry:paths.filter(p=>entry.files[p]&&sha(p)!==entry.files[p]&&!ownedExisting.includes(p)).map(path=>({path,entry:entry.files[path],current:sha(path)})),
 externalAdditionsSinceBatchEntry:paths.filter(p=>!Object.hasOwn(entry.files,p)&&!added.includes(p)).map(path=>({path,current:sha(path)})),
 note:'Read-only audit of the existing Level 5 enumerator. PNG assets and player UI are not currently bound by this guard; their hashes are separately locked. No evidence, rebind, legacy refresh or Level 4/5 test edited. External concurrent changes are attributed separately.'};
assert.equal(bound.changedThisBatch.length,5);assert.equal(bound.addedThisBatch.length,3);
const output={checkedOn:'2026-11-04',frozenCases,frozenNodes,changedNodes:11,caseCount:live.cases.length,conceptsBefore:412,conceptsAfter:414,exactPilotApprovalsPreserved:11,pendingFlagDraftsPreserved:16,timingRowsBefore:1799,timingRowsAfter:1810,exactRowsBefore:357,exactRowsAfter:371,registryBytesOutsideAppendPreserved:true,
 ownerDirectionCoverage:specs.map(s=>({id:s.id,ownerItemId:s.ownerId})),changedExistingFiles:changes,protectedChanges:changes.filter(x=>!ownedExisting.includes(x.path)),externalAddedFiles,ownedExisting,boundInputs:bound};
fs.writeFileSync('tools/question-quality/question-bank-batch2a-verification-20261104.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({frozenCases,frozenNodes,concepts:414,preservedPendingFlags:16,protectedChanges:output.protectedChanges.map(x=>x.path),externalAddedFiles:externalAddedFiles.map(x=>x.path),boundModified:bound.changedThisBatch.map(x=>x.path),boundAdded:added}));
