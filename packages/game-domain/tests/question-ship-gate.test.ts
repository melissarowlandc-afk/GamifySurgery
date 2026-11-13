import {describe,expect,it} from "vitest";
import {FIRST_TUTORIAL_CASE_ID,SECOND_TUTORIAL_CASE_ID,QUESTION_SHIP_MANIFEST,
 QUESTION_CATALOG_RELEASE,SYNTHETIC_CLINICAL_RELEASE,QUESTION_NEW_N1_ROUND3_REVISED_CASES,
 QUESTION_NEW_N2_ROUND3_REVISED_CASES,QUESTION_NEW_N2_CASES,QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES,
 QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {createLevelFourRoomsQaContext,createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
import {applyFsrsReview,createInitialGameState,createNewFsrsCard,deserializeGameState,gameReducer,
 getClinicalCaseEligibilityIssue,getRoutinePatientAvailability,getCurrentQuestion,getAnswerChoiceServicePreview,
 selectRoutineClinicalCase,serializeGameState,TUTORIAL_ENCOUNTER_ID,type DomainContext,type GameCommand,type GameState} from "../src";
import {materializePatientName} from "../src/patientText";
import {getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import {getRoutinePatientAvailability as referenceAvailability} from "../src/routineAvailabilityReference.testSupport";
const context=createLevelFourRoomsQaContext(),NOW=1_800_000_000_000,encounterId="encounter.ship-gate";
const acceptedNew=QUESTION_SHIP_MANIFEST.accepted.filter(r=>/^review\.n[12]\./.test(r.acceptanceId)).map(r=>SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!);
const rejected=QUESTION_CATALOG_RELEASE.cases.filter(cs=>/^case\.n[12]\./.test(cs.id)&&!QUESTION_SHIP_MANIFEST.accepted.some(row=>row.caseId===cs.id));
const only=(cases:SyntheticClinicalCase[]):DomainContext=>({...context,clinicalRelease:{...QUESTION_CATALOG_RELEASE,cases}});
function vacant(level:GameState["facilityLevel"]=4):GameState{
 const state=createLevelFourRoomsQaState(context);Object.assign(state,{facilityLevel:level,paused:false,nextRoutineArrivalTick:0});return state;
}
function command(cs:SyntheticClinicalCase,operationId="gate.admit"):GameCommand{
 return {type:"ADMIT_PATIENT",operationId,encounterId,caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:"routine"};
}
function reviewed(state:GameState,cs:SyntheticClinicalCase,dueAtMs:number):void{
 for(const node of cs.decisionNodes){const conceptId=node.primaryConceptId;
  const update=applyFsrsReview(createNewFsrsCard(0),"Good",1000,context.balanceRelease.learning);
  state.learningHistories[conceptId]={conceptId,card:{...update.card,dueAtMs},reviews:[{
   id:`review.gate.${conceptId}`,encounterId:"encounter.historical",decisionNodeId:node.id,questionVariantId:node.questionVariantId,
   patientPresentationVariantId:cs.patientPresentationVariantId,primaryConceptId:conceptId,
   answerChoiceId:node.answerChoices.find(c=>c.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:update.log,
  }]};
 }
}
describe("default release projection and explicit catalog runtime behavior",()=>{
 it.each(rejected.map(c=>[c.id,c] as const))("excludes draft %s from default supply while explicit catalogs remain usable",(_id,cs)=>{
  expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(row=>row.id===cs.id)).toBe(false);
  const state=vacant(cs.earliestFacilityStage as GameState["facilityLevel"]),empty=only([]),catalogContext=only([cs]);
  expect(selectRoutineClinicalCase(state,SYNTHETIC_CLINICAL_RELEASE.cases.filter(row=>row.id===cs.id),NOW)).toBeNull();
  expect(getRoutinePatientAvailability(state,NOW,empty).reason).toBe("content_unavailable");
  const missing=command(cs),blocked=gameReducer(state,missing,empty);
  expect(blocked.operationReceipts[missing.operationId]).toMatchObject({status:"rejected"});
  expect(blocked.encounters[encounterId]).toBeUndefined();
  expect(getClinicalCaseEligibilityIssue(state,cs,catalogContext)).toBeNull();
  expect(selectRoutineClinicalCase(state,[cs],NOW)?.clinicalCase).toBe(cs);
  const admitted=gameReducer(state,command(cs),catalogContext);
  expect(admitted.operationReceipts["gate.admit"]).toMatchObject({status:"applied"});
  expect(admitted.encounters[encounterId]!.frozenCase.id).toBe(cs.id);
  reviewed(state,cs,NOW);
  expect(selectRoutineClinicalCase(state,[cs],NOW)).toMatchObject({kind:"due_review",clinicalCase:{id:cs.id}});
 });
 it.each(acceptedNew.map(c=>[c.id,c] as const))("admits and selects exact accepted %s at its facility stage",(_id,cs)=>{
  const ctx=only([cs]),level=cs.earliestFacilityStage as GameState["facilityLevel"];
  const below=vacant((level-1)as GameState["facilityLevel"]);expect(getClinicalCaseEligibilityIssue(below,cs,ctx)).toContain(`Level ${level}`);
  const state=vacant(level);expect(getClinicalCaseEligibilityIssue(state,cs,ctx)).toBeNull();
  expect(selectRoutineClinicalCase(state,[cs],NOW)).toMatchObject({clinicalCase:{id:cs.id},kind:"new_concept"});
  const cmd=command(cs),next=gameReducer(state,cmd,ctx);expect(next.operationReceipts[cmd.operationId]).toMatchObject({status:"applied"});
  const frozen=next.encounters[encounterId]!.frozenCase;
  expect(frozen.decisionNodes[0]!.questionVariantId).toBe(cs.decisionNodes[0]!.questionVariantId);
  expect(frozen.decisionNodes[0]!.answerChoices.map(c=>c.id).sort()).toEqual(cs.decisionNodes[0]!.answerChoices.map(c=>c.id).sort());
  expect(deserializeGameState(serializeGameState(next),context).encounters[encounterId]!.frozenCase).toEqual(frozen);
  const automatic=gameReducer(state,{type:"ADVANCE_TICK",operationId:"gate.auto.accepted",advancedAtRealMs:NOW},ctx);
  expect(Object.values(automatic.encounters)[0]!.frozenCase.id).toBe(cs.id);
 });
 it.each(acceptedNew.map(c=>[c.id,c]as const))("keeps FSRS future/due and in-progress rules for accepted %s",(_id,cs)=>{
  const state=vacant(),ctx=only([cs]);reviewed(state,cs,NOW+100_000);
  expect(selectRoutineClinicalCase(state,[cs],NOW)).toBeNull();
  expect(getRoutinePatientAvailability(state,NOW,ctx)).toMatchObject({reason:"reviews_scheduled",nextReviewAtRealMs:NOW+100_000});
  const before=structuredClone(state.learningHistories);state.learningHistories[cs.decisionNodes[0]!.primaryConceptId]!.card.dueAtMs=NOW;
  expect(selectRoutineClinicalCase(state,[cs,...rejected],NOW)).toMatchObject({kind:"due_review",clinicalCase:{id:cs.id}});
  const next=gameReducer(state,command(cs),ctx);expect(selectRoutineClinicalCase(next,[cs],NOW)).toBeNull();
  expect(next.learningHistories[cs.decisionNodes[0]!.primaryConceptId]!.reviews).toEqual(before[cs.decisionNodes[0]!.primaryConceptId]!.reviews);
 });
 it.each(QUESTION_SHIP_MANIFEST.accepted.filter(r=>!r.acceptanceId.startsWith("review.n")).map(r=>[r.acceptanceId,r]as const))
 ("selects manager-accepted rewrite %s with its full accepted/fallback case",(_id,row)=>{
  const relation=QUESTION_SHIP_MANIFEST.replacements.find(r=>r.replaces===row.caseId) ??
    QUESTION_SHIP_MANIFEST.topicConsolidations.find(r=>r.replaces.includes(row.caseId));
  const replacementRow=relation?QUESTION_SHIP_MANIFEST.accepted.find(r=>r.questionVariantId===relation.with)!:null;
  const effectiveRow=replacementRow&&replacementRow.caseId!==row.caseId?replacementRow:row;
  if(replacementRow&&replacementRow.caseId!==row.caseId)expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(c=>c.id===row.caseId)).toBe(false);
  const retirement=QUESTION_SHIP_MANIFEST.retirements.find(r=>r.caseId===effectiveRow.caseId);
  if(retirement){
   const authorized=[...QUESTION_PROGRAM_BATCH7_RETIREMENTS,...QUESTION_PROGRAM_BATCH8_RETIREMENTS].find(r=>r.caseId===retirement.caseId);
   expect(authorized).toBeDefined();expect(retirement).toEqual(authorized);
   expect(retirement.questionVariantIds).toContain(effectiveRow.questionVariantId);
   expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(c=>c.id===effectiveRow.caseId)).toBe(false);
   const retiredPool=SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>c.id===effectiveRow.caseId);
   expect(selectRoutineClinicalCase(vacant(),retiredPool,NOW)).toBeNull();
   expect(getRoutinePatientAvailability(vacant(),NOW,only(retiredPool)).reason).toBe("content_unavailable");
   return;
  }
  const cs=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===effectiveRow.caseId)!;
  const selected=selectRoutineClinicalCase(vacant(),[cs],NOW)!;
  expect(selected.clinicalCase.id).toBe(cs.id);
  expect(selected.clinicalCase.decisionNodes.find(n=>n.id===effectiveRow.nodeId)).toMatchObject({questionVariantId:effectiveRow.questionVariantId,primaryConceptId:effectiveRow.conceptId});
 });
 it("selects only supplied default versions across seeds and honors future-due histories",()=>{
  const state=vacant();const pool=acceptedNew;
  for(let seed=0;seed<96;seed++){state.campaignSeed=`ship.seed.${seed}`;state.routineArrivalSequence=seed;
   const selected=selectRoutineClinicalCase(state,pool,NOW)!;expect(acceptedNew.map(c=>c.id)).toContain(selected.clinicalCase.id);
   expect(QUESTION_SHIP_MANIFEST.accepted.some(row=>row.caseId===selected.clinicalCase.id)).toBe(true);
  }
  for(const cs of acceptedNew)reviewed(state,cs,NOW+100_000);
  expect(selectRoutineClinicalCase(state,pool,NOW)).toBeNull();
 });
 it("keeps the availability reference and optimized reader consistent with accepted and rejected pools",()=>{
  for(const pool of [rejected,acceptedNew,[...rejected,...acceptedNew]]){
   const state=vacant(),ctx=only(pool);
   expect(getRoutinePatientAvailability(state,NOW,ctx)).toEqual(referenceAvailability(state,NOW,ctx));
   for(const cs of acceptedNew)reviewed(state,cs,NOW+100_000);
   expect(getRoutinePatientAvailability(state,NOW,ctx)).toEqual(referenceAvailability(state,NOW,ctx));
  }
 });
 it("freezes randomized runtime positions for accepted variants",()=>{
  const positions=new Set<number>();
  for(const cs of acceptedNew){const next=gameReducer(vacant(),command(cs),only([cs]));
   positions.add(next.encounters[encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.findIndex(c=>c.isCorrect));
  }
  expect(positions.size).toBeGreaterThan(1);
 });
 it("creates protected tutorials from the supplied release without a manifest check",()=>{
  const altered=(id:string):DomainContext=>({...context,clinicalRelease:{...context.clinicalRelease,cases:context.clinicalRelease.cases.map(cs=>cs.id!==id?cs:{...cs,
   decisionNodes:cs.decisionNodes.map(n=>({...n,questionVariantId:n.questionVariantId+".preview"}))})}});
  const first=createInitialGameState(altered(FIRST_TUTORIAL_CASE_ID));
  expect(first.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase.decisionNodes[0]!.questionVariantId).toContain(".preview");
  const state=createInitialGameState(context);state.paused=false;state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason="completed";
  const second=gameReducer(state,{type:"ADVANCE_TICK",operationId:"gate.protected",advancedAtRealMs:NOW},altered(SECOND_TUTORIAL_CASE_ID));
  expect(Object.values(second.encounters).find(e=>e.frozenCase.id===SECOND_TUTORIAL_CASE_ID)!.frozenCase.decisionNodes[0]!.questionVariantId).toContain(".preview");
 });
 it("retains exact draft timing/order records for review and frozen charts without making them new supply",()=>{
  const base=gameReducer(vacant(),command(acceptedNew[0]!),context).encounters[encounterId]!;
  let timed=0;
  for(const cs of QUESTION_NEW_N2_ROUND3_REVISED_CASES){const node=cs.decisionNodes[0]!,row=QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES.find(t=>t.caseId===cs.id)!;
   const state=vacant();state.encounters[encounterId]={...structuredClone(base),frozenCase:materializePatientName(cs,cs.patientDisplayName),lifecycle:"active_action_required",patientMovement:null,checkInStatus:"checked_in"};
   state.openChartEncounterId=encounterId;state.attendedEncounterId=encounterId;
   for(const choice of node.answerChoices){const preview=getAnswerChoiceServicePreview(state,encounterId,choice.id,context);
    if(row.classification.kind==="test_choices"){
     const expected=row.classification.choices.find(c=>c.choiceId===choice.id)!.timing;
     expect(preview?.kind).toBe(expected.kind);
     if(expected.kind==="test"){
      expect(preview?.durationTicks).toBeGreaterThan(0);timed++;
      expect(getExactTestChoiceOrderRecord(state.encounters[encounterId]!,node,choice.id)).toMatchObject({timingProfileId:expected.timingProfileId,disposition:{kind:"not_executed",reason:"external_only"}});
     }
    }else expect(preview).toBeNull();
   }
   expect(state.serviceOperations).toEqual([]);expect(selectRoutineClinicalCase(vacant(),[cs],NOW)?.clinicalCase).toBe(cs);
  }
  expect(timed).toBeGreaterThan(10);
 });
 it("admits under a pre-gate release then reopens and scores its replaced frozen definition exactly once",()=>{
  const current=acceptedNew.find(c=>c.id==="case.n2.sglt2-postoperative-restart.v1")!,old=QUESTION_NEW_N2_CASES.find(c=>c.id===current.id)!;
  const preGate={...context,clinicalRelease:QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE};
  let state=createLevelFourRoomsQaState(preGate);state.paused=false;state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;
  let activeContext=preGate;
  const apply=(cmd:GameCommand)=>{state=gameReducer(state,cmd,activeContext);expect(state.operationReceipts[cmd.operationId]).toMatchObject({status:"applied"});};
  apply({type:"PLACE_ROOM",operationId:"gate.flow.exam",roomDefinitionId:"room.examination",roomId:"room.gate.exam",x:35,y:24,orientation:0});
  apply({type:"PLACE_DOOR",operationId:"gate.flow.door",roomId:"room.gate.exam",doorId:"door.gate.exam",side:"south",offset:1});
  apply(command(old));
  const frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
  state=deserializeGameState(serializeGameState(state),context);activeContext=context;
  expect(state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  expect(frozen.decisionNodes[0]!.questionVariantId).not.toBe(current.decisionNodes[0]!.questionVariantId);
  let opened=false;
  for(let tick=0;tick<240;tick++){
   apply({type:"ADVANCE_TICK",operationId:`gate.flow.tick.${tick}`,advancedAtRealMs:NOW});
   const active=state.encounters[encounterId]!;
   if(!opened&&active.checkInStatus==="checked_in"&&!active.patientMovement){apply({type:"OPEN_CHART",operationId:"gate.flow.open",encounterId});opened=true;}
   const question=getCurrentQuestion(state,encounterId,context);
   if(!opened||state.encounters[encounterId]!.assignedRoomInstanceId!=="room.gate.exam"||state.encounters[encounterId]!.patientMovement||!question)continue;
   const answer:GameCommand={type:"SUBMIT_ANSWER",operationId:"gate.flow.answer",encounterId,decisionNodeId:question.node.id,
    answerChoiceId:question.node.answerChoices.find(c=>c.isCorrect)!.id,reviewedAtMs:NOW};
   apply(answer);expect(gameReducer(state,answer,context)).toBe(state);
   expect(state.learningHistories[old.decisionNodes[0]!.primaryConceptId]!.reviews).toHaveLength(1);
   expect(state.serviceOperations).toEqual([]);
   expect(deserializeGameState(serializeGameState(state),context).encounters[encounterId]!.frozenCase).toEqual(state.encounters[encounterId]!.frozenCase);
   return;
  }
  throw new Error("The pre-gate frozen chart did not reach its ordinary answer step");
 });
});
import {QUESTION_PROGRAM_BATCH7_RETIREMENTS,QUESTION_PROGRAM_BATCH8_RETIREMENTS} from "@gamify-surgery/clinical-content";
