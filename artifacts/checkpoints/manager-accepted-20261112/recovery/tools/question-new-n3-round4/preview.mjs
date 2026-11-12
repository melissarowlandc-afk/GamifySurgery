// Explicit unapproved developer preview in a disposable Node process. Staged
// estimates are installed only in this process and restored in finally. This
// script is never imported by the player or default release.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n3-round4-20261110.ts');
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const f=await import('../../tests/fixtures/level-four-rooms.ts');
const base=f.createLevelFourRoomsQaContext(),NOW=1_800_000_000_000;
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const timing=c.ANSWER_CHOICE_TIMING_REGISTRY,originalTiming=structuredClone(timing),liveHash=sha(c.SYNTHETIC_CLINICAL_RELEASE),rows=[];
const seed=(state,cs)=>{
 const n=cs.decisionNodes[0],id=n.primaryConceptId,update=d.applyFsrsReview(d.createNewFsrsCard(0),'Good',1000,base.balanceRelease.learning);
 state.learningHistories[id]={conceptId:id,card:{...update.card,dueAtMs:NOW},reviews:[{id:'r4.old.'+id,encounterId:'r4.old',decisionNodeId:n.id,
  questionVariantId:n.questionVariantId,patientPresentationVariantId:cs.patientPresentationVariantId,primaryConceptId:id,
  answerChoiceId:n.answerChoices[0].id,correct:true,rating:'Good',reviewedAtMs:1000,facilityTick:0,schedulerLog:update.log}]};
};
try{
 // These are the exact validated candidate tuples, not replacements for live rows.
 assert.ok(b.QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES.every(t=>!timing.some(o=>o.questionVariantId===t.questionVariantId)));
 timing.push(...b.QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES);
 for(const [index,cs] of b.QUESTION_NEW_N3_ROUND4_CASES.entries()){
  const context={...base,clinicalRelease:{...b.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE,cases:[cs]}};
  let state=f.createLevelFourRoomsQaState(base);Object.assign(state,{facilityLevel:cs.earliestFacilityStage,paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER});
  const admission={type:'ADMIT_PATIENT',operationId:'r4.admit',encounterId:'r4.encounter',caseId:cs.id,patientDisplayName:'Jordan Ellis',arrivalClass:'routine'};
  const ordinary=d.gameReducer(state,admission,base);assert.equal(ordinary.operationReceipts[admission.operationId].status,'rejected','Draft absent from default');
  assert.equal(d.getClinicalCaseEligibilityIssue({...state,facilityLevel:cs.earliestFacilityStage-1},cs,context),`This patient becomes eligible at Level ${cs.earliestFacilityStage}.`);
  assert.equal(d.getClinicalCaseEligibilityIssue(state,cs,context),null);
  assert.equal(d.selectRoutineClinicalCase(state,[cs],NOW).kind,'new_concept');
  const apply=(command,ctx=context)=>{state=d.gameReducer(state,command,ctx);assert.equal(state.operationReceipts[command.operationId]?.status,'applied',state.operationReceipts[command.operationId]?.message);};
  apply({type:'PLACE_ROOM',operationId:'r4.exam',roomDefinitionId:'room.examination',roomId:'room.r4.exam',x:35,y:24,orientation:0});
  apply({type:'PLACE_DOOR',operationId:'r4.door',roomId:'room.r4.exam',doorId:'door.r4.exam',side:'south',offset:1});
  seed(state,b.QUESTION_NEW_N3_ROUND4_RETAINED_CASES[index]);
  const priorId=b.QUESTION_NEW_N3_ROUND4_DEFINITIONS[index].previousConceptId;
  const priorHistory=structuredClone(state.learningHistories[priorId]);
  if(priorId!==cs.decisionNodes[0].primaryConceptId)seed(state,cs);
  const currentReviews=structuredClone(state.learningHistories[cs.decisionNodes[0].primaryConceptId].reviews);
  apply(admission);const frozen=structuredClone(state.encounters['r4.encounter'].frozenCase);
  assert.ok(frozen.presentation.includes('Jordan Ellis'));assert.ok(!frozen.presentation.includes('{patientName}'));
  const visible=JSON.stringify({presentation:frozen.presentation,stem:frozen.decisionNodes[0].stem,exhibit:frozen.decisionNodes[0].exhibit});
  for(const part of cs.patientDisplayName.split(' '))assert.ok(!visible.includes(part),'No stale original name');
  assert.equal(state.serviceOperations.length,0);
  // Normal domain serialization/reopen under the real default, where this case
  // version is absent. The frozen definition, not current supply, scores it.
  state=d.deserializeGameState(d.serializeGameState(state),base);assert.deepEqual(state.encounters['r4.encounter'].frozenCase,frozen);
  let opened=false,completed=false;const waits=[];
  for(let tick=0;tick<240;tick++){
   apply({type:'ADVANCE_TICK',operationId:'r4.tick.'+tick,advancedAtRealMs:NOW},base);
   const encounter=state.encounters['r4.encounter'];
   if(!opened&&encounter.checkInStatus==='checked_in'&&!encounter.patientMovement){apply({type:'OPEN_CHART',operationId:'r4.open',encounterId:encounter.id},base);opened=true;}
   const q=d.getCurrentQuestion(state,encounter.id,base);
   if(!opened||encounter.assignedRoomInstanceId!=='room.r4.exam'||encounter.patientMovement||!q)continue;
   const registered=b.QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES[index];
   for(const choice of q.node.answerChoices){
    const preview=d.getAnswerChoiceServicePreview(state,encounter.id,choice.id,base);
    if(registered.classification.kind==='no_test'){assert.equal(preview,null);continue;}
    const wanted=registered.classification.choices.find(a=>a.choiceId===choice.id).timing;
    assert.equal(wanted.kind,'test');assert.equal(preview?.kind,'test');assert.equal(preview.timingProfileId,wanted.timingProfileId);
    assert.equal(preview.diagnosticTiming.execution,'preview_only');assert.ok(preview.durationTicks>0);
    waits.push({choiceId:choice.id,profileId:preview.timingProfileId,durationTicks:preview.durationTicks,execution:preview.diagnosticTiming.execution});
   }
   apply({type:'SUBMIT_ANSWER',operationId:'r4.answer',encounterId:encounter.id,decisionNodeId:q.node.id,
    answerChoiceId:q.node.answerChoices.find(a=>a.isCorrect).id,reviewedAtMs:NOW},base);
   const history=state.learningHistories[q.node.primaryConceptId];assert.deepEqual(history.reviews.slice(0,-1),currentReviews);
   assert.equal(history.reviews.length,currentReviews.length+1);assert.equal(history.reviews.at(-1).questionVariantId,frozen.decisionNodes[0].questionVariantId);
   assert.equal(history.reviews.at(-1).correct,true);assert.equal(state.serviceOperations.length,0);
   if(priorId!==q.node.primaryConceptId)assert.deepEqual(state.learningHistories[priorId],priorHistory,'No changed-construct history transfer');
   rows.push({caseId:cs.id,questionVariantId:q.node.questionVariantId,level:cs.earliestFacilityStage,
    randomizedKeyPosition:q.node.answerChoices.findIndex(a=>a.isCorrect),waits,defaultRejected:true,explicitAdmission:true,
    frozenReopenDefault:true,correctlyScored:true,priorReviewsPreserved:true,oldConstructHistoryPreserved:true,servicesExecuted:0});
   completed=true;break;
  }
  assert.ok(completed,'Candidate reaches ordinary answer step');
 }
 assert.ok(new Set(rows.map(r=>r.randomizedKeyPosition)).size>1,'Actual admission does not fix the key first');
}finally{timing.splice(0,timing.length,...originalTiming);}
assert.deepEqual(timing,originalTiming);assert.equal(sha(c.SYNTHETIC_CLINICAL_RELEASE),liveHash);
const receipt={scope:'Disposable explicit unapproved preview, real reducer/selection/movement/serialization/scoring. No source/config/production-registry mutations.',
 cases:rows.length,testingEstimates:rows.reduce((n,r)=>n+r.waits.length,0),defaultLiveSha256:liveHash,globalTimingRestored:true,rows};
fs.writeFileSync('.local-dev/question-new-n3-round4-20261110/preview.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
