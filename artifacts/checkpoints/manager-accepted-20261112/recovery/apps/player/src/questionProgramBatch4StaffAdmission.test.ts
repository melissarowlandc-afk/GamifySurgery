import {describe,expect,it} from "vitest";
import {QUESTION_PROGRAM_BATCH4_ACCEPTED_CASES as acceptedCases,QUESTION_PROGRAM_BATCH4_RETAINED_CASES as retainedCases,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {beforeProgramBatch4AcceptanceRelease} from "../../../packages/clinical-content/src/question-program-batch4-acceptance-test-support";
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

const current=PROTOTYPE_DOMAIN_CONTEXT,NOW=1_800_000_000_000,encounterId="encounter.topic4.stats-ship";
const cases=acceptedCases.filter(cs=>cs.participant?.kind==="employee_discussion").map(cs=>({id:cs.id,caseId:cs.id,employee:true}));
const retired=retainedCases.filter(cs=>cs.participant?.kind==="employee_discussion");
const previous:DomainContext={...current,clinicalRelease:beforeProgramBatch4AcceptanceRelease(current.clinicalRelease)};
function setup(example:typeof cases[number],base:DomainContext=current){
 const cs=base.clinicalRelease.cases.find(c=>c.id===example.caseId)!;
 const context:DomainContext={...base,clinicalRelease:{...base.clinicalRelease,cases:[cs]}};
 let state=createLevelFourRoomsQaState(base);
 const commands:GameCommand[]=[
  {type:"PLACE_ROOM",operationId:"topic4.stats.office",roomDefinitionId:"room.surgeon_office",roomId:"room.topic4.stats.office",x:40,y:24,orientation:0},
  {type:"PLACE_DOOR",operationId:"topic4.stats.door",roomId:"room.topic4.stats.office",doorId:"door.topic4.stats.office",side:"south",offset:1},
 ];
 for(const command of commands)state=apply(state,command,base);
 state.employees.push({id:"employee.topic4.surgeon",staffRoleDefinitionId:"staff.surgeon",displayName:"Dana Rivera",appearance:state.founder.appearance,
  hiredAtFacilityTick:0,salaryPerExpenseInterval:0,morale:100,trainingLevel:1,homeRoomInstanceId:"room.topic4.stats.office",location:{x:40,y:25},path:[],pathIndex:0,
  lastMovedAtFacilityTick:0,lastPraisedAtFacilityTick:null,nextIdleActionAtFacilityTick:Number.MAX_SAFE_INTEGER,facilityTask:null});
 Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:1,serviceAppointmentsEnabled:false});
 if(retired.some(old=>old.id===cs.id))for(const node of cs.decisionNodes){
  const earlier=applyFsrsReview(createNewFsrsCard(0),"Good",1000,base.balanceRelease.learning);
  state.learningHistories[node.primaryConceptId]={conceptId:node.primaryConceptId,card:earlier.card,reviews:[{
   id:"review.topic4.staff.previous."+node.id,encounterId:"discussion.topic4.previous",decisionNodeId:node.id,
   questionVariantId:node.questionVariantId,patientPresentationVariantId:cs.patientPresentationVariantId,
   primaryConceptId:node.primaryConceptId,answerChoiceId:node.answerChoices.find(choice=>choice.isCorrect)!.id,
   correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:earlier.log,
  }]};
 }
 const admission:GameCommand={type:"ADVANCE_TICK",operationId:"topic4.stats.schedule",advancedAtRealMs:NOW};
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
 const scope={backendId:"topic4.stats-ship-test",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"57",clock.wall,{branchId:"topic4.stats.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,employee:boolean,id:string,frozen:Frozen,_conceptId:string){
 const execute=(command:GameCommand)=>{const state=session.execute(command,current);expect(state,command.operationId).not.toBeNull();expect(state!.operationReceipts[command.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return state!;};
 for(const [index,node]of frozen.decisionNodes.entries()){
  const previous=structuredClone(session.state.learningHistories[node.primaryConceptId]!);
  const question=await ready(()=>session.state,execute,employee,id,"topic4.staff.current."+index);
  expect(question.node.questionVariantId).toBe(node.questionVariantId);
  expect(question.node.primaryConceptId).toBe(node.primaryConceptId);
  expect(question.node.answerChoices.map(choice=>choice.id)).toEqual(node.answerChoices.map(choice=>choice.id));
  const key=question.node.answerChoices.find(choice=>choice.isCorrect)!;
  const answer:GameCommand={type:"SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",operationId:"topic4.staff.score."+index,discussionId:id,decisionNodeId:node.id,answerChoiceId:key.id,reviewedAtMs:NOW+index};
  execute(answer);
  const history=session.state.learningHistories[node.primaryConceptId]!;
  expect(history.reviews).toHaveLength(previous.reviews.length+1);
  expect(history.reviews.slice(0,-1)).toEqual(previous.reviews);
  expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:node.primaryConceptId,questionVariantId:node.questionVariantId,answerChoiceId:key.id,correct:true});
  expect(execute(answer).learningHistories[node.primaryConceptId]!.reviews).toEqual(history.reviews);
  execute({type:"ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK",operationId:"topic4.staff.feedback."+index,discussionId:id,decisionNodeId:node.id});
 }
 execute({type:"FILE_EMPLOYEE_DISCUSSION",operationId:"topic4.staff.file",discussionId:id});
 expect(session.state.employeeDiscussions![id]!.lifecycle).toBe("resolved");
 expect(session.state.employeeDiscussions![id]!.frozenCase).toEqual(frozen);
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}

function expectDefinition(frozen:Frozen,cs:SyntheticClinicalCase){
 const n=frozen.decisionNodes[0]!,original=cs.decisionNodes[0]!;
 expect(n).toMatchObject({id:original.id,questionVariantId:original.questionVariantId,primaryConceptId:original.primaryConceptId,exhibit:original.exhibit});
 const order=(a:typeof n.answerChoices)=>[...a].sort((a,b)=>a.id.localeCompare(b.id));expect(order(n.answerChoices)).toEqual(order(original.answerChoices));
}

describe("topic batch4 quality cases use the existing clinic staff discussion path",()=>{
 it.each(cases)("schedules $id from the accepted default and completes its format3 save",async example=>{
  const f=setup(example);
  expect(f.cs.participant).toEqual({kind:"employee_discussion",requiredStaffRoleDefinitionIds:["staff.surgeon"]});
  const state=apply(f.state,f.admission,f.context),original=subject(state,true);
  expectDefinition(original.frozen,f.cs);
  expect(state.learningHistories).toEqual(f.state.learningHistories);
  const patientAdmission:GameCommand={type:"ADMIT_PATIENT",operationId:"topic4.stats.patient-rejection",encounterId,caseId:f.cs.id,patientDisplayName:f.cs.patientDisplayName,arrivalClass:"routine"};
  expect(gameReducer(f.state,patientAdmission,current).operationReceipts[patientAdmission.operationId]).toMatchObject({status:"rejected",message:"Employee discussion content cannot be admitted as a patient."});
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{
   expect(subject(session.state,true).frozen).toEqual(original.frozen);
   await finish(session,true,original.id,original.frozen,f.conceptId);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
 it.each(retired)("reopens retired staff $id and completes its original questions and histories",async clinicalCase=>{
  expect(current.clinicalRelease.cases.some(cs=>cs.id===clinicalCase.id)).toBe(false);
  const f=setup({id:clinicalCase.id,caseId:clinicalCase.id,employee:true},previous);
  const state=apply(f.state,f.admission,f.context),original=subject(state,true);
  const r=await rig(state);
  let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{
   expect(subject(session.state,true).frozen).toEqual(original.frozen);
   for(const [id,history]of Object.entries(state.learningHistories))expect(session.state.learningHistories[id]).toEqual(history);
   await finish(session,true,original.id,original.frozen,f.conceptId);
   for(const node of original.frozen.decisionNodes)expect(session.state.learningHistories[node.primaryConceptId]!.reviews).toHaveLength(2);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
   expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
 it.each(retired)("replays the original staff-scheduling journal for $id",async clinicalCase=>{
  const f=setup({id:clinicalCase.id,caseId:clinicalCase.id,employee:true},previous);
  const r=await rig(f.state);
  const coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"57",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="topic4.staff.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{
   checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],
   writerGeneration:coordinator.journalWriterGeneration,
   snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}},
  },cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,f.context);
  expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
  const original=subject(committed.state,true);
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();
  expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{
   expect(subject(session.state,true).frozen).toEqual(original.frozen);
   for(const [id,history]of Object.entries(committed.state.learningHistories))expect(session.state.learningHistories[id]).toEqual(history);
   expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);
   await finish(session,true,original.id,original.frozen,f.conceptId);
   expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
});
