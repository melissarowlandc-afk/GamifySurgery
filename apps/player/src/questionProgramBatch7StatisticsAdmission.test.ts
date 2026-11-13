import {describe,expect,it} from "vitest";
import {QUESTION_PROGRAM_BATCH7_ACCEPTED_CASES as acceptedCases,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
import {PROTOTYPE_DOMAIN_CONTEXT,createInitialGameState,applyFsrsReview,createNewFsrsCard,gameReducer,getCurrentQuestion,
 getCurrentEmployeeDiscussionQuestion,applyGameEvidenceCommand,gameEvidenceDelta,type DomainContext,type GameState,type GameCommand} from "@gamify-surgery/game-domain";
import {cloudCampaignStorageKey} from "./session/accountStorageKey";
import {LocalJournalDrain} from "./session/localJournal";
import {MemoryCloudCache} from "./session/cloud/cache";
import {MemoryCloudEntryStore} from "./session/cloud/entryStorage";
import {FakeCloudServer} from "./session/cloud/fakeTransport";
import {CloudGameSession} from "./session/cloud/gameSession";
import {CloudSyncCoordinator} from "./session/cloud/coordinator";
import {openAutomaticCloudCampaign} from "./session/cloud/automaticResolution";
import {loadCloudEvidenceCheckpoint} from "./session/cloud/codecEvidence";
import {codecTestCampaign} from "./session/cloud/codecTestSupport";
import {cloudCodec} from "./session/cloud/codecWorker";
import {bindJournal,prepareJournal} from "./session/cloud/journalCodec";
import {snapshotCopy} from "./session/cloud/snapshotCodec";
import {TestCloudClock} from "./session/cloud/syncTestSupport";

const current=PROTOTYPE_DOMAIN_CONTEXT,NOW=1_800_000_000_000,encounterId="encounter.topic7.stats-ship";
const cases=acceptedCases.filter(cs=>cs.participant?.kind==="employee_discussion").map(cs=>({id:cs.id,caseId:cs.id,employee:true}));
function setup(example:typeof cases[number]){
 const cs=current.clinicalRelease.cases.find(c=>c.id===example.caseId)!;
 const context:DomainContext={...current,clinicalRelease:{...current.clinicalRelease,cases:[cs]}};
 let state=createLevelFourRoomsQaState(current);
 const commands:GameCommand[]=[
  {type:"PLACE_ROOM",operationId:"topic7.stats.office",roomDefinitionId:"room.surgeon_office",roomId:"room.topic7.stats.office",x:40,y:24,orientation:0},
  {type:"PLACE_DOOR",operationId:"topic7.stats.door",roomId:"room.topic7.stats.office",doorId:"door.topic7.stats.office",side:"south",offset:1},
 ];
 for(const command of commands)state=apply(state,command,current);
 state.employees.push({id:"employee.topic7.surgeon",staffRoleDefinitionId:"staff.surgeon",displayName:"Dana Rivera",appearance:state.founder.appearance,
  hiredAtFacilityTick:0,salaryPerExpenseInterval:0,morale:100,trainingLevel:1,homeRoomInstanceId:"room.topic7.stats.office",location:{x:40,y:25},path:[],pathIndex:0,
  lastMovedAtFacilityTick:0,lastPraisedAtFacilityTick:null,nextIdleActionAtFacilityTick:Number.MAX_SAFE_INTEGER,facilityTask:null});
 Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:1,serviceAppointmentsEnabled:false});
 const admission:GameCommand={type:"ADVANCE_TICK",operationId:"topic7.stats.schedule",advancedAtRealMs:NOW};
 return {state,context,cs,admission,conceptId:cs.decisionNodes[0]!.primaryConceptId};
}

type Frozen=GameState["encounters"][string]["frozenCase"];
function subject(state:GameState,employee:boolean){
 if(employee){const ds=Object.values(state.employeeDiscussions??{});expect(ds).toHaveLength(1);return {id:ds[0]!.id,frozen:ds[0]!.frozenCase};}
 return {id:encounterId,frozen:state.encounters[encounterId]!.frozenCase};
}
function apply(state:GameState,command:GameCommand,context:DomainContext){
 const next=gameReducer(state,command,context);expect(next.operationReceipts[command.operationId],command.operationId).toMatchObject({status:"applied"});return next;
}
async function ready(read:()=>GameState,execute:(c:GameCommand)=>GameState,employee:boolean,id:string,prefix:string){
 for(let tick=0;tick<240;tick++){
  const state=read();
  const q=employee?getCurrentEmployeeDiscussionQuestion(state,id,current):getCurrentQuestion(state,id,current);
  if(q)return q;
  if(employee){if(state.openEmployeeDiscussionId!==id)execute({type:"OPEN_EMPLOYEE_DISCUSSION",operationId:prefix+".open."+tick,discussionId:id});}
  else {const e=state.encounters[id]!;if(state.openChartEncounterId!==id&&e.checkInStatus==="checked_in"&&!e.patientMovement)
   execute({type:"OPEN_CHART",operationId:prefix+".open."+tick,encounterId:id});}
  execute({type:"ADVANCE_TICK",operationId:prefix+".tick."+tick,advancedAtRealMs:NOW});
 }
 throw new Error("Stats1 frozen question did not become answer-ready: "+id);
}
async function rig(state:GameState){
 const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
 const scope={backendId:"topic7.stats-ship-test",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"57",clock.wall,{branchId:"topic7.stats.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,employee:boolean,id:string,frozen:Frozen,conceptId:string){
 const previous=structuredClone(session.state.learningHistories[conceptId]!);
 const execute=(c:GameCommand)=>{const s=session.execute(c,current);expect(s,c.operationId).not.toBeNull();expect(s!.operationReceipts[c.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return s!;};
 const q=await ready(()=>session.state,execute,employee,id,"topic7.stats.current"),n=frozen.decisionNodes[0]!;
 expect(q.node.questionVariantId).toBe(n.questionVariantId);expect(q.node.primaryConceptId).toBe(conceptId);
 expect(q.node.answerChoices.map(a=>a.id)).toEqual(n.answerChoices.map(a=>a.id));
 const key=q.node.answerChoices.find(a=>a.isCorrect)!;
 const answer:GameCommand=employee?{type:"SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",operationId:"topic7.stats.score",discussionId:id,decisionNodeId:q.node.id,answerChoiceId:key.id,reviewedAtMs:NOW}:
  {type:"SUBMIT_ANSWER",operationId:"topic7.stats.score",encounterId:id,decisionNodeId:q.node.id,answerChoiceId:key.id,reviewedAtMs:NOW};
 execute(answer);const h=session.state.learningHistories[conceptId]!;expect(h.reviews).toHaveLength(previous.reviews.length+1);expect(h.reviews.slice(0,-1)).toEqual(previous.reviews);
 expect(h.reviews.at(-1)).toMatchObject({primaryConceptId:conceptId,questionVariantId:n.questionVariantId,answerChoiceId:key.id,correct:true});
 expect(execute(answer).learningHistories[conceptId]!.reviews).toEqual(h.reviews);
 if(employee){
  execute({type:"ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK",operationId:"topic7.stats.feedback",discussionId:id,decisionNodeId:n.id});
  execute({type:"FILE_EMPLOYEE_DISCUSSION",operationId:"topic7.stats.file",discussionId:id});
  expect(session.state.employeeDiscussions![id]!.lifecycle).toBe("resolved");
  expect(session.state.employeeDiscussions![id]!.frozenCase).toEqual(frozen);
 }else{expect(session.state.encounters[id]!.resolutionReason).toBe("completed");expect(session.state.encounters[id]!.frozenCase).toEqual(frozen);}
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}
function expectDefinition(frozen:Frozen,cs:SyntheticClinicalCase){
 const n=frozen.decisionNodes[0]!,original=cs.decisionNodes[0]!;
 expect(n).toMatchObject({id:original.id,questionVariantId:original.questionVariantId,primaryConceptId:original.primaryConceptId});
 expect(n.exhibit).toEqual(original.exhibit);
 const order=(a:typeof n.answerChoices)=>[...a].sort((a,b)=>a.id.localeCompare(b.id));expect(order(n.answerChoices)).toEqual(order(original.answerChoices));
}

describe("topic batch7 statistics and quality use the existing clinic staff discussion path",()=>{
 it.each(cases)("schedules $id from the accepted default and completes its format3 save",async example=>{
  const f=setup(example);
  expect(f.cs.participant).toEqual({kind:"employee_discussion",requiredStaffRoleDefinitionIds:["staff.surgeon"]});
  const state=apply(f.state,f.admission,f.context),original=subject(state,true);
  expectDefinition(original.frozen,f.cs);
  expect(state.learningHistories).toEqual(f.state.learningHistories);
  const patientAdmission:GameCommand={type:"ADMIT_PATIENT",operationId:"topic7.stats.patient-rejection",encounterId,caseId:f.cs.id,patientDisplayName:f.cs.patientDisplayName,arrivalClass:"routine"};
  expect(gameReducer(f.state,patientAdmission,current).operationReceipts[patientAdmission.operationId]).toMatchObject({status:"rejected",message:"Employee discussion content cannot be admitted as a patient."});
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{
   expect(subject(session.state,true).frozen).toEqual(original.frozen);
   await finish(session,true,original.id,original.frozen,f.conceptId);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
});
