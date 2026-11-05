import {QUESTION_NEW_N3_ROUND2_CASES as priorCases,QUESTION_NEW_N3_ROUND3_REVISIONS as revisions} from "@gamify-surgery/clinical-content";
import {describe,expect,it} from "vitest";
import {QUESTION_SHIP_MANIFEST as manifest} from "@gamify-surgery/clinical-content";
import {QUESTION_NEW_N3_ROUND3_CASES as cases,QUESTION_NEW_N3_ROUND3_REVIEW_TIMING as timings,QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as QUESTION_CATALOG_RELEASE,SYNTHETIC_CLINICAL_RELEASE,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {createLevelFourRoomsQaContext,createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
import {applyFsrsReview,createNewFsrsCard,deserializeGameState,gameReducer,getClinicalCaseEligibilityIssue,
 getRoutinePatientAvailability,getCurrentQuestion,getAnswerChoiceServicePreview,selectRoutineClinicalCase,serializeGameState,
 type DomainContext,type GameCommand,type GameState} from "../src";
import {getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
const base=createLevelFourRoomsQaContext(),NOW=1_800_000_000_000;
const context=(pool:SyntheticClinicalCase[]):DomainContext=>({...base,clinicalRelease:{...QUESTION_CATALOG_RELEASE,cases:pool}});
function vacant(level:3|4=4,_ctx=base){const s=createLevelFourRoomsQaState(base);Object.assign(s,{facilityLevel:level,paused:false,nextRoutineArrivalTick:0});return s;}
const admission=(cs:SyntheticClinicalCase,patientName=cs.patientDisplayName):GameCommand=>({type:"ADMIT_PATIENT",operationId:"n3.admit",encounterId:"encounter.n3",caseId:cs.id,patientDisplayName:patientName,arrivalClass:"routine"});
function reviewed(state:GameState,cs:SyntheticClinicalCase,dueAtMs:number){
 const n=cs.decisionNodes[0]!,conceptId=n.primaryConceptId,update=applyFsrsReview(createNewFsrsCard(0),"Good",1000,base.balanceRelease.learning);
 state.learningHistories[conceptId]={conceptId,card:{...update.card,dueAtMs},reviews:[{id:`review.n3.${conceptId}`,encounterId:"encounter.old",decisionNodeId:n.id,
  questionVariantId:n.questionVariantId,patientPresentationVariantId:cs.patientPresentationVariantId,primaryConceptId:conceptId,answerChoiceId:n.answerChoices[0]!.id,
  correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:update.log}]};
}
describe("N3 round-three explicit draft supply and frozen completion",()=>{
 it.each(cases.map(cs=>[cs.id,cs]as const))("admits %s in the explicit catalog and defaults only to its exact accepted version",(_id,cs)=>{
  const ctx=context([cs]),state=vacant(cs.earliestFacilityStage as 3|4,ctx);
  const accepted=manifest.accepted.find(row=>row.sourceView==="n3-round3"&&row.caseId===cs.id);
  expect(SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===cs.id)?.decisionNodes[0]!.questionVariantId).toBe(accepted?.questionVariantId);
  expect(getClinicalCaseEligibilityIssue({...state,facilityLevel:(cs.earliestFacilityStage-1) as GameState["facilityLevel"]},cs,ctx)).toContain(`Level ${cs.earliestFacilityStage}`);
  expect(getClinicalCaseEligibilityIssue(state,cs,ctx)).toBeNull();
  expect(selectRoutineClinicalCase(state,[cs],NOW)).toMatchObject({kind:"new_concept",clinicalCase:{id:cs.id}});
  const freshDefault=gameReducer(state,admission(cs),base);
  expect(freshDefault.operationReceipts["n3.admit"]?.status).toBe(accepted?"applied":"rejected");
  if(accepted)expect(freshDefault.encounters["encounter.n3"]!.frozenCase.decisionNodes[0])
    .toMatchObject({questionVariantId:accepted.questionVariantId,primaryConceptId:accepted.conceptId});
  const isRevised=cs.decisionNodes[0]!.questionVariantId.endsWith(".v3"),patientName=isRevised?"Avery Taylor":cs.patientDisplayName;
  const admitted=gameReducer(state,admission(cs,patientName),ctx);expect(admitted.operationReceipts["n3.admit"]?.status).toBe("applied");
  if(isRevised){const frozen=admitted.encounters["encounter.n3"]!.frozenCase;
   expect(frozen.patientDisplayName).toBe(patientName);expect(frozen.presentation).toContain(patientName);
   const displayed=JSON.stringify({presentation:frozen.presentation,stem:frozen.decisionNodes[0]!.stem,exhibit:frozen.decisionNodes[0]!.exhibit});
   expect(displayed).not.toContain("{patientName}");
   for(const part of cs.patientDisplayName.split(" "))expect(displayed).not.toContain(part);
  }
  const e=admitted.encounters["encounter.n3"]!,node=e.frozenCase.decisionNodes[0]!;
  expect(node.questionVariantId).toBe(cs.decisionNodes[0]!.questionVariantId);
  for(const c of node.answerChoices){const row=timings.find(t=>t.caseId===cs.id)!;
   if(row.classification.kind==="test_choices"){
    const expected=row.classification.choices.find(x=>x.choiceId===c.id)!.timing;
    if(expected.kind==="test")expect(getExactTestChoiceOrderRecord(e,node,c.id)).toMatchObject({timingProfileId:expected.timingProfileId,disposition:{kind:"not_executed",reason:"external_only"}});
   }
  }
  expect(admitted.serviceOperations).toEqual([]);
 });
 it.each([3,4]as const)("selects each distinct explicit case construct at Level %s and waits when all are scheduled",level=>{
  const pool=cases.filter(c=>c.earliestFacilityStage<=level),ctx=context(pool),state=vacant(level,ctx),seen=new Set<string>();
  expect(pool).toHaveLength(level===3?3:8);
  for(let index=0;index<pool.length;index++){
   const selected=selectRoutineClinicalCase(state,pool,NOW)!;expect(selected.kind).toBe("new_concept");
   expect(seen.has(selected.clinicalCase.id)).toBe(false);seen.add(selected.clinicalCase.id);reviewed(state,selected.clinicalCase,NOW+60_000);
  }
  expect(selectRoutineClinicalCase(state,pool,NOW)).toBeNull();
  expect(getRoutinePatientAvailability(state,NOW,ctx)).toMatchObject({reason:"reviews_scheduled",nextReviewAtRealMs:NOW+60_000});
  state.learningHistories[pool[0]!.decisionNodes[0]!.primaryConceptId]!.card.dueAtMs=NOW;
  expect(selectRoutineClinicalCase(state,pool,NOW)).toMatchObject({kind:"due_review",clinicalCase:{id:pool[0]!.id}});
 });
 it("retains scheduled history for wording changes and keeps the changed operative construct separate",()=>{
  for(const revision of revisions){const cs=cases.find(c=>c.id==="case.n3."+revision.slug+".v1")!,old=priorCases.find(c=>c.id===cs.id)!;
   const ctx=context([cs]),state=vacant(4,ctx);reviewed(state,old,NOW+60_000);
   const oldHistory=structuredClone(state.learningHistories[old.decisionNodes[0]!.primaryConceptId]);
   const selected=selectRoutineClinicalCase(state,[cs],NOW);
   if(revision.conceptMeaning==="same")expect(selected).toBeNull();
   else{expect(selected).toMatchObject({kind:"new_concept",clinicalCase:{id:cs.id}});expect(state.learningHistories[cs.decisionNodes[0]!.primaryConceptId]).toBeUndefined();}
   expect(state.learningHistories[old.decisionNodes[0]!.primaryConceptId]).toEqual(oldHistory);
  }
 });
 it("freezes randomized choice positions and preserves their identities",()=>{
  const positions=new Set<number>();for(const cs of cases){const ctx=context([cs]);const s=gameReducer(vacant(4,ctx),admission(cs),ctx);
   const n=s.encounters["encounter.n3"]!.frozenCase.decisionNodes[0]!;positions.add(n.answerChoices.findIndex(c=>c.isCorrect));
   expect(n.answerChoices.map(c=>c.id).sort()).toEqual(cs.decisionNodes[0]!.answerChoices.map(c=>c.id).sort());
  }expect(positions.size).toBeGreaterThan(1);
 });
 it.each(cases.filter(cs=>cs.decisionNodes[0]!.questionVariantId.endsWith(".v3")))("reopens frozen $id under default and completes with its original FSRS identity",(cs)=>{
  const ctx=context([cs]);let state=vacant(4,ctx);state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;
  let activeContext=ctx;const apply=(cmd:GameCommand)=>{state=gameReducer(state,cmd,activeContext);expect(state.operationReceipts[cmd.operationId]).toMatchObject({status:"applied"});};
  apply({type:"PLACE_ROOM",operationId:"n3.exam",roomDefinitionId:"room.examination",roomId:"room.n3.exam",x:35,y:24,orientation:0});
  apply({type:"PLACE_DOOR",operationId:"n3.door",roomId:"room.n3.exam",doorId:"door.n3.exam",side:"south",offset:1});
  reviewed(state,cs,NOW);const previous=structuredClone(state.learningHistories[cs.decisionNodes[0]!.primaryConceptId]!.reviews);
  apply(admission(cs));const frozen=structuredClone(state.encounters["encounter.n3"]!.frozenCase);
  state=deserializeGameState(serializeGameState(state),base);activeContext=base;
  expect(state.encounters["encounter.n3"]!.frozenCase).toEqual(frozen);
  let opened=false;for(let t=0;t<240;t++){
   apply({type:"ADVANCE_TICK",operationId:`n3.tick.${t}`,advancedAtRealMs:NOW});const encounter=state.encounters["encounter.n3"]!;
   if(!opened&&encounter.checkInStatus==="checked_in"&&!encounter.patientMovement){apply({type:"OPEN_CHART",operationId:"n3.open",encounterId:encounter.id});opened=true;}
   const q=getCurrentQuestion(state,encounter.id,base);if(!opened||encounter.assignedRoomInstanceId!=="room.n3.exam"||encounter.patientMovement||!q)continue;
   for(const c of q.node.answerChoices){const row=timings.find(t=>t.caseId===cs.id)!;
    const timing=row.classification.kind==="test_choices"?row.classification.choices.find(x=>x.choiceId===c.id)!.timing:null;
    const preview=getAnswerChoiceServicePreview(state,encounter.id,c.id,base);
    if(timing?.kind==="test")expect(preview).toMatchObject({kind:"test",timingProfileId:timing.timingProfileId,diagnosticTiming:{execution:"preview_only"}});
    else expect(preview).toBeNull();
   }
   apply({type:"SUBMIT_ANSWER",operationId:"n3.answer",encounterId:encounter.id,decisionNodeId:q.node.id,answerChoiceId:q.node.answerChoices.find(c=>c.isCorrect)!.id,reviewedAtMs:NOW});
   expect(state.serviceOperations).toEqual([]);
   const history=state.learningHistories[q.node.primaryConceptId]!;expect(history.reviews.slice(0,-1)).toEqual(previous);expect(history.reviews).toHaveLength(previous.length+1);
   expect(history.reviews.at(-1)?.questionVariantId).toBe(frozen.decisionNodes[0]!.questionVariantId);expect(history.reviews.at(-1)?.correct).toBe(true);return;
  }throw new Error("N3 frozen chart did not reach its ordinary answer step");
 });
});
