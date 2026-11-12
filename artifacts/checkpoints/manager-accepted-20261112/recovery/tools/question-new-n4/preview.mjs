// Disposable explicit-draft execution only. No source/runtime registry edits.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n4-20261110.ts');
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const {clinicCaseMatchesLine}=await import('../../packages/game-domain/src/clinic-consult-topics.ts');
const {routineOrFixture}=await import('../../packages/game-domain/tests/routine-or-demand.fixture.ts');
const {endoscopyReadyClinic}=await import('../../packages/game-domain/tests/routine-endoscopy-ready.fixture.ts');
const {createLevelFourIntegrationState}=await import('../../tests/fixtures/level-four-integration.ts');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const dir='.local-dev/question-new-n4-20261110';
const timing=c.ANSWER_CHOICE_TIMING_REGISTRY,families=c.PEDIATRIC_CLINIC_FAMILY_CONTEXTS;
const beforeTiming=structuredClone(timing),beforeFamilies=structuredClone(families),liveHash=hash(c.SYNTHETIC_CLINICAL_RELEASE);
const rows=[],blocked=[];
const lineFor=i=>i.group==='intra_op'?'income.ambulatory_operation':i.group==='intra_endoscopy'?'income.endoscopy':
 i.group==='pediatric'?'income.pediatric_consult':/venous-ulcer|incisional-pocket/.test(i.slug)?'income.wound_care':'income.ostomy_support';
try{
 assert.ok(b.QUESTION_NEW_N4_TIMING_ENTRIES.every(t=>!timing.some(r=>r.questionVariantId===t.questionVariantId)));
 timing.push(...b.QUESTION_NEW_N4_TIMING_ENTRIES);
 families.push(...b.QUESTION_NEW_N4_FAMILY_BINDINGS);
 for(const [index,cs]of b.QUESTION_NEW_N4_CASES.entries()){
  const item=b.QUESTION_NEW_N4_ITEMS[index],line=lineFor(item),kind=d.procedureConsultKind(cs);
  const matches=item.group==='intra_op'?kind==='operation':item.group==='intra_endoscopy'?kind==='endoscopy':clinicCaseMatchesLine(cs,line);
  if(!matches){blocked.push({caseId:cs.id,questionVariantId:cs.decisionNodes[0].questionVariantId,group:item.group,line,
   primaryConceptId:cs.decisionNodes[0].primaryConceptId,reason:'Existing hardcoded topic affinity does not recognize this meaning; no runtime predicate is patched by this preview.'});continue;}
  const ctx={...d.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...b.QUESTION_NEW_N4_SOURCE_RELEASE,cases:[cs]}};
  let state=item.group==='intra_op'?structuredClone(routineOrFixture().state):item.group==='intra_endoscopy'?
   structuredClone(endoscopyReadyClinic({provider:true}).state):createLevelFourIntegrationState('n4.'+item.slug);
  Object.assign(state,{facilityLevel:Math.max(4,cs.earliestFacilityStage),paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,
   nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:true});
  const concept=cs.decisionNodes[0].primaryConceptId,oldCase=c.QUESTION_CATALOG_RELEASE.cases.find(x=>x.decisionNodes.some(n=>n.primaryConceptId===concept));
  assert.ok(oldCase,'Source-compatible rows here reuse an existing card');
  const oldNode=oldCase.decisionNodes.find(n=>n.primaryConceptId===concept),update=d.applyFsrsReview(d.createNewFsrsCard(0),'Good',1000,ctx.balanceRelease.learning);
  const oldReview={id:'n4.old.'+concept,encounterId:'n4.old',decisionNodeId:oldNode.id,questionVariantId:oldNode.questionVariantId,
   patientPresentationVariantId:oldCase.patientPresentationVariantId,primaryConceptId:concept,answerChoiceId:oldNode.answerChoices[0].id,
   correct:true,rating:'Good',reviewedAtMs:1000,facilityTick:0,schedulerLog:update.log};
  state.learningHistories[concept]={conceptId:concept,card:{...update.card,dueAtMs:0},reviews:[oldReview]};
  let sequence=0;
  const apply=(command,context=ctx)=>{const operationId='n4.preview.'+index+'.'+sequence++;
   state=d.gameReducer(state,{...command,operationId},context);const receipt=state.operationReceipts[operationId];
   assert.equal(receipt?.status,'applied',receipt?.message);};
  const tick=(count=1,context=ctx)=>{for(let n=0;n<count;n++)apply({type:'ADVANCE_TICK',advancedAtRealMs:state.createdAtRealMs+state.facilityTick*1000},context);};
  if(item.group==='pediatric'||item.group==='wound_ostomy'){
   for(const key of Object.keys(state.nextServiceAppointmentTicks))state.nextServiceAppointmentTicks[key]=Number.MAX_SAFE_INTEGER;
   for(const home of d.getAppAppointmentHomes(state,ctx,line))state.nextServiceAppointmentTicks[`${line}:${home}`]=state.facilityTick+1;
  }
  const phaseRoom=item.group==='intra_op'?'room.ambulatory_or':item.group==='intra_endoscopy'?'room.endoscopy':null;
  const inService=op=>op.incomeLineId===line&&op.actorKind==='visitor'&&op.status==='in_service'&&
   (!phaseRoom||op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId===phaseRoom);
  for(let minute=0;minute<600&&!state.serviceOperations.some(inService);minute++)tick();
  const original=state.serviceOperations.find(inService);assert.ok(original,'Actual routine source must start: '+item.slug);
  const originalActor={name:original.displayName,appearance:structuredClone(original.appearance),location:structuredClone(original.location)},sourceId=original.id;
  // Opening the scored clock converts this existing actor; it does not create
  // a second person or a new operation for the authored operation.
  state.nextRoutineArrivalTick=state.facilityTick+1;
  for(let minute=0;minute<5&&!state.serviceOperations.find(o=>o.id===sourceId)?.consultEncounterId;minute++)tick();
  const source=state.serviceOperations.find(o=>o.id===sourceId),eid=source?.consultEncounterId;assert.ok(eid,'Source consult must bind: '+item.slug);
  state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;state.serviceAppointmentsEnabled=false;
  let encounter=state.encounters[eid];assert.equal(encounter.frozenCase.decisionNodes[0].questionVariantId,cs.decisionNodes[0].questionVariantId);
  assert.equal(encounter.patientDisplayName,originalActor.name);assert.deepEqual(encounter.patientAppearance,originalActor.appearance);
  assert.deepEqual(encounter.patientLocation,originalActor.location);
  const frozen=structuredClone(encounter.frozenCase),phase=source.phaseIndex;
  const deadline=source.phaseEndsAtFacilityTick;
  assert.ok(deadline!==null);tick(Math.max(1,deadline-state.facilityTick+2));
  assert.equal(state.serviceOperations.find(o=>o.id===sourceId).phaseIndex,phase,'Unanswered chart holds phase');
  assert.equal(state.serviceOperations.find(o=>o.id===sourceId).completedAtFacilityTick,null);
  // Frozen draft version is absent from the real default projection on reopen.
  state=d.deserializeGameState(d.serializeGameState(state),d.PROTOTYPE_DOMAIN_CONTEXT);
  assert.deepEqual(state.encounters[eid].frozenCase,frozen);
  apply({type:'OPEN_CHART',encounterId:eid},d.PROTOTYPE_DOMAIN_CONTEXT);
  let question=null;
  for(let minute=0;minute<240;minute++){
   question=d.getCurrentQuestion(state,eid,d.PROTOTYPE_DOMAIN_CONTEXT);if(question)break;tick(1,d.PROTOTYPE_DOMAIN_CONTEXT);
  }
  assert.ok(question,'Frozen source question must be available');
  const estimates=[];
  for(const choice of question.node.answerChoices){const preview=d.getAnswerChoiceServicePreview(state,eid,choice.id,d.PROTOTYPE_DOMAIN_CONTEXT);
   const expected=b.QUESTION_NEW_N4_TIMING_ENTRIES[index].classification;
   const setting=expected.kind==='test_choices'?expected.choices.find(a=>a.choiceId===choice.id).timing:{kind:'no_test'};
   if(setting.kind==='test'){assert.equal(preview?.kind,'test');assert.equal(preview.timingProfileId,setting.timingProfileId);
    assert.ok(preview.durationTicks>0);assert.equal(preview.diagnosticTiming.execution,'preview_only');estimates.push({choiceId:choice.id,profileId:preview.timingProfileId});}
   else if(expected.kind==='no_test')assert.equal(preview,null);
   else {assert.equal(preview?.kind,'no_test');assert.equal(preview.durationTicks,null);}
  }
  const chosen=question.node.answerChoices.find(a=>a.isCorrect);
  apply({type:'SUBMIT_ANSWER',encounterId:eid,decisionNodeId:question.node.id,answerChoiceId:chosen.id,
   reviewedAtMs:state.createdAtRealMs+state.facilityTick*1000},d.PROTOTYPE_DOMAIN_CONTEXT);
  encounter=state.encounters[eid];
  if(encounter.steps[encounter.currentNodeIndex]?.status==='feedback_pending')apply({type:'ACKNOWLEDGE_DECISION_FEEDBACK',encounterId:eid,decisionNodeId:question.node.id},d.PROTOTYPE_DOMAIN_CONTEXT);
  if(state.encounters[eid].terminalFeedback&&!state.encounters[eid].terminalFeedback.acknowledged)apply({type:'ACKNOWLEDGE_TERMINAL_FEEDBACK',encounterId:eid},d.PROTOTYPE_DOMAIN_CONTEXT);
  const history=state.learningHistories[concept];assert.deepEqual(history.reviews[0],oldReview);assert.equal(history.reviews.length,2);
  assert.equal(history.reviews[1].questionVariantId,question.node.questionVariantId);assert.equal(history.reviews[1].correct,true);
  assert.equal(state.serviceOperations.find(o=>o.id===sourceId).phaseIndex,phase,'Answer alone does not release phase');
  apply({type:'CLOSE_CHART',encounterId:eid},d.PROTOTYPE_DOMAIN_CONTEXT);
  assert.notEqual(state.encounters[eid].consult.closedAtFacilityTick,null);
  rows.push({caseId:cs.id,questionVariantId:question.node.questionVariantId,group:item.group,sourceId,
   actualSourcePreserved:true,phaseHeldUntilAnswerAndClose:true,frozenReopenUnderDefault:true,correctlyScored:true,
   oldReviewPreserved:true,keyPosition:question.node.answerChoices.findIndex(a=>a.id===chosen.id),estimates,
   noCircularOperationOrder:cs.decisionNodes.every(n=>!n.resultGateAfter&&n.answerChoices.every(a=>!a.serviceRequest))});
 }
}finally{timing.splice(0,timing.length,...beforeTiming);families.splice(0,families.length,...beforeFamilies);}
assert.deepEqual(timing,beforeTiming);assert.deepEqual(families,beforeFamilies);assert.equal(hash(c.SYNTHETIC_CLINICAL_RELEASE),liveHash);
assert.ok(new Set(rows.map(r=>r.keyPosition)).size>1,'Actual runtime order must not fix the key first');
const receipt={scope:'Actual existing routine source actors, real reducer/holds/answer/close and frozen reopen; unrecognized topic rows are reported, never patched.',
 testedSourceFlows:rows.length,blockedByCurrentTopicAffinity:blocked.length,newProductionRegistrations:0,
 temporaryCandidateTimingAndFamilyBindingsRestored:true,defaultReleaseUnchanged:true,rows,blocked};
fs.writeFileSync(dir+'/preview.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
