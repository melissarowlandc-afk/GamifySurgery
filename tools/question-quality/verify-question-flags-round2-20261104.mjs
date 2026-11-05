import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round2-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const clean=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.deepEqual(clean(c.QUESTION_FLAGS_ROUND1_RELEASE),entry.release);
assert.deepEqual(clean(c.QUESTION_FLAG_REVISIONS),entry.priorRevisions);
assert.deepEqual(clean(c.QUESTION_QUALITY_CLINICAL_APPROVALS),entry.approvals);
const rr=c.QUESTION_FLAG_ROUND2_REVISIONS,live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(rr.length,16);assert.deepEqual(clean(live.concepts.slice(0,398)),entry.release.concepts);assert.equal(live.concepts.length,412);
let frozenCases=0,frozenNodes=0;
for(const old of entry.release.cases){const now=live.cases.find(x=>x.id===old.id),changed=rr.filter(r=>r.caseId===old.id);assert(now);
 if(!changed.length){assert.deepEqual(clean(now),old);frozenCases++;}
 for(const key of ['earliestFacilityStage','requiredCapabilityIds','routineEligible','tutorialEligible','participant'])assert.deepEqual(clean(now[key]),old[key],old.id+' '+key);
 assert.deepEqual(now.decisionNodes.map(n=>n.id),old.decisionNodes.map(n=>n.id));
 for(const n of old.decisionNodes){const next=now.decisionNodes.find(x=>x.id===n.id),r=changed.find(r=>r.nodeId===n.id);
  if(!r){assert.deepEqual(clean(next),n);frozenNodes++;continue;}
  assert.equal(next.questionVariantId,r.questionVariantId);assert.equal(r.previousQuestionVariantId,n.questionVariantId);
  assert.equal(r.question.reviewStatus,'needs_clinician_review');assert.equal(r.question.lastClinicianReview,null);
  assert.deepEqual(clean(next.resultGateAfter),n.resultGateAfter);assert.deepEqual(clean(next.answerChoices.find(a=>a.isCorrect).serviceRequest),n.answerChoices.find(a=>a.isCorrect).serviceRequest);
  assert(next.shuffleAnswers);assert([3,4].includes(next.answerChoices.length));
 }
}
assert.equal(frozenCases,1094);assert.equal(frozenNodes,1407);
assert.deepEqual(clean(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,1783)),entry.timings);assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.length,1799);
assert.deepEqual(clean(d.EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,335)),entry.orders);assert.equal(d.EXACT_TEST_CHOICE_ORDER_RECORDS.length,357);
const restored=fs.readFileSync('packages/game-domain/src/test-choice-orders.ts','utf8')
 .replace(/\/\/ BEGIN QUESTION FLAGS ROUND2 20261104 EXACT RECORDS[\s\S]*?\/\/ END QUESTION FLAGS ROUND2 20261104 EXACT RECORDS\r?\n\r?\n/,'')
 .replace('\n  ...questionFlagRound2Records,','');
assert.equal(restored,entry.registryText);
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-review-20261104.json','utf8'));let responses=0;
for(const p of packet){const r=rr.find(r=>r.auditId===p.id),cs=live.cases.find(x=>x.id===p.caseId),n=cs.decisionNodes.find(x=>x.id===p.nodeId);
 assert.equal(p.after.variantId,n.questionVariantId);assert.equal(p.after.Task,n.stem.replaceAll('{patientName}','Jamie Taylor'));
 assert.equal(p.after.Options.filter(a=>a.startsWith('**KEY:** ')).length,1);assert(p.keyOrderNotice.includes('key shown first for review only'));
 assert.equal(p.pipelinePassed,false);assert.equal(p.releaseReady,false);assert.equal(p.retirementApplied,false);
 if(!r){assert.equal(p.id,'F14');assert.deepEqual(p.before,p.after);assert(p.retirementProposed);}else assert.equal(p.reviewStatus,'needs_clinician_review');
 for(const key of ['cues','fairness','suggestions'])responses+=p.reviewResponse.noteResponses[key].length;
}
assert.equal(responses,177);
const ownedExisting=[
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-flags-20261104.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/game-domain/tests/gs028-20260928-batch.test.ts','packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts',
 'packages/game-domain/tests/gs028-20261002-batch.test.ts','packages/game-domain/tests/gs028-20261003-batch.test.ts','packages/game-domain/tests/gs028-20261007-batch.test.ts','packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts',
 'packages/game-domain/tests/patient-supply.test.ts','packages/game-domain/tests/diagnostics/patient-supply.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts','packages/game-domain/tests/question-flags-bindings.test.ts',
 'tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/report.mjs','docs/clinical/question-authoring-standard.md',
];
const changes=Object.entries(entry.files).filter(([p,h])=>sha(p)!==h).map(([path,old])=>({path,entry:old,current:sha(path),ownership:ownedExisting.includes(path)?'this round':'external shared-tree change; not edited by this worker'}));
const paths=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(?:ts|json)$/.test(p)&&!/(?:\.test\.|\.spec\.)/.test(p))paths.push(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src'])walk(dir);
paths.push('tests/fixtures/level-five-integration.ts','tests/fixtures/level-five-rooms.ts','tests/fixtures/level-four-rooms.ts','tools/economy-audit/level-four-simulation.ts','tools/qa/level-five-integration-run.mjs');
const recorded=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8')).inputs;
const added=['packages/clinical-content/src/question-flags-round2-20261104.ts','packages/clinical-content/src/question-flags-round2-20261104-data.ts','packages/clinical-content/src/question-flags-round2-evidence-20261104.ts'];
const bound={recordedInputCount:Object.keys(recorded).length,currentInputCount:paths.length,
 changedThisRound:paths.filter(p=>entry.files[p]&&sha(p)!==entry.files[p]&&ownedExisting.includes(p)).map(path=>({path,entry:entry.files[path],current:sha(path),recorded:recorded[path]??null})),
 addedThisRound:added.map(path=>({path,current:sha(path)})),
 cumulativeFlagAdditions:['packages/clinical-content/src/question-flags-20261104.ts','packages/clinical-content/src/question-flags-20261104-data.ts',...added].map(path=>({path,current:sha(path)})),
 allRecordedDifferences:Object.entries(recorded).filter(([p,h])=>sha(p)!==h).map(([path,hash])=>({path,recorded:hash,current:sha(path),changedSinceRoundTwoEntry:entry.files[path]!==sha(path)})),
 newSinceRecorded:paths.filter(p=>!Object.hasOwn(recorded,p)),note:'Read-only audit; rebind and behavioral refresh belong to the manager. No evidence or Level 4/5 tests edited.'};
assert.equal(bound.changedThisRound.length,4);assert.equal(bound.addedThisRound.length,3);
function timing(release){let tests=0,keys=0;for(const cs of release.cases)for(const[i,n]of cs.decisionNodes.entries()){
 const t=c.ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);
 if(t.classification.kind==='test_choices')for(const a of t.classification.choices)if(a.timing.kind==='test'){tests++;if(i===cs.decisionNodes.length-1&&n.answerChoices.find(c=>c.id===a.choiceId).isCorrect)keys++;}
 }return {timedChoices:tests,terminalTimedKeys:keys};}
const output={checkedOn:'2026-11-04',frozenCases,frozenNodes,changedNodes:16,conceptsBefore:398,conceptsAfter:412,oldApprovalsPreserved:11,
 retainedRoundOneDefinitions:entry.priorRevisions.length,timingRowsBefore:1783,timingRowsAfter:1799,exactRowsBefore:335,exactRowsAfter:357,
 originalRegistryBytesPreservedOutsideAppend:true,timingBefore:timing(entry.release),timingAfter:timing(live),responses,changedExistingFiles:changes,
 protectedChanges:changes.filter(c=>!ownedExisting.includes(c.path)),ownedExisting,boundInputs:bound};
assert.deepEqual(output.timingAfter,{timedChoices:1478,terminalTimedKeys:143});
fs.writeFileSync('tools/question-quality/question-flags-round2-verification-20261104.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({frozenCases,frozenNodes,newConcepts:14,responses,modifiedExisting:changes.filter(x=>x.ownership==='this round').length,protectedChanges:output.protectedChanges.map(x=>x.path),
 timing:output.timingAfter,bound:{edited:4,added:3,cumulativeAdded:5,recorded:bound.recordedInputCount,current:bound.currentInputCount}}));
