import {describe,expect,it} from "vitest";
import {QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE as accepted,QUESTION_STATS1_ACCEPTED_REVISIONS as revisions,
 QUESTION_STATS1_RETAINED_INPUT as retained,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
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

const current=PROTOTYPE_DOMAIN_CONTEXT,NOW=1_800_000_000_000,encounterId="encounter.stats1-ship";
const cases=revisions.map(r=>({id:r.auditId,caseId:r.caseId,employee:r.employeeDiscussion}));
function setup(example:typeof cases[number],historical:boolean){
 const cs=(historical?retained:current.clinicalRelease).cases.find(c=>c.id===example.caseId)!;
 // Isolate one real source case so the ordinary staff scheduler's random
 // selection is deterministic. Do not alter eligibility, nodes or identities.
 const context:DomainContext={...current,clinicalRelease:{...current.clinicalRelease,cases:[cs]}};
 // Ordinary initialization still needs its two real tutorial templates; only
 // later admission/scheduling uses the isolated source-case context.
 const state=createInitialGameState(current,{campaignId:"campaign.stats1-ship."+example.id,campaignSeed:"stats1-ship."+example.id,createdAtRealMs:NOW});
 state.facilityLevel=2;state.paused=false;state.encounters={};state.openChartEncounterId=null;state.attendedEncounterId=null;
 state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;state.nextFinancialPostingTick=Number.MAX_SAFE_INTEGER;
 state.nextEmployeeDiscussionTick=example.employee?1:Number.MAX_SAFE_INTEGER;
 state.rooms.push({id:"room.stats1.exam",roomDefinitionId:"room.examination",x:34,y:26,orientation:0,doorSide:"south",upgradeLevel:1,cleanliness:100});
 state.doors.push({id:"door.stats1.exam",roomId:"room.stats1.exam",side:"south",offset:1,exterior:false});
 if(example.employee){
  state.rooms.push({id:"room.stats1.np",roomDefinitionId:"room.glp1_telehealth_suite",x:29,y:29,orientation:0,doorSide:null,upgradeLevel:1,cleanliness:100},
   ...[24,25,26,27,28,29,30].map(y=>({id:"room.stats1.hall."+y,roomDefinitionId:"room.hallway",x:32,y,orientation:0 as const,doorSide:null,upgradeLevel:1 as const,cleanliness:100})));
  state.doors.push({id:"door.stats1.front",roomId:"room.instance.founder_desk",side:"west",offset:0,exterior:false},
   {id:"door.stats1.np",roomId:"room.stats1.np",side:"east",offset:1,exterior:false});
  state.employees.push({id:"employee.stats1.np",staffRoleDefinitionId:"staff.glp1_np",displayName:"Dana Rivera",appearance:state.founder.appearance,
   hiredAtFacilityTick:0,salaryPerExpenseInterval:0,morale:100,trainingLevel:1,homeRoomInstanceId:"room.stats1.np",location:{x:31,y:30},path:[],pathIndex:0,
   lastMovedAtFacilityTick:0,lastPraisedAtFacilityTick:null,nextIdleActionAtFacilityTick:Number.MAX_SAFE_INTEGER,facilityTask:null});
 }
 const old=retained.cases.find(c=>c.id===cs.id)!,node=old.decisionNodes[0]!,previous=applyFsrsReview(createNewFsrsCard(0),"Good",1000,context.balanceRelease.learning);
 state.learningHistories[node.primaryConceptId]={conceptId:node.primaryConceptId,card:previous.card,reviews:[{
  id:"review.stats1.previous",encounterId:"encounter.stats1.previous",decisionNodeId:node.id,questionVariantId:node.questionVariantId,
  patientPresentationVariantId:old.patientPresentationVariantId,primaryConceptId:node.primaryConceptId,
  answerChoiceId:node.answerChoices.find(a=>a.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:previous.log,
 }]};
 const admission:GameCommand=example.employee?{type:"ADVANCE_TICK",operationId:"stats1.admit",advancedAtRealMs:NOW}:
  {type:"ADMIT_PATIENT",operationId:"stats1.admit",encounterId,caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:"routine"};
 return {state,context,cs,admission,conceptId:node.primaryConceptId};
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
 const scope={backendId:"stats1-ship-test",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"57",clock.wall,{branchId:"stats1.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,employee:boolean,id:string,frozen:Frozen,conceptId:string){
 const previous=structuredClone(session.state.learningHistories[conceptId]!);
 const execute=(c:GameCommand)=>{const s=session.execute(c,current);expect(s,c.operationId).not.toBeNull();expect(s!.operationReceipts[c.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return s!;};
 const q=await ready(()=>session.state,execute,employee,id,"stats1.current"),n=frozen.decisionNodes[0]!;
 expect(q.node.questionVariantId).toBe(n.questionVariantId);expect(q.node.primaryConceptId).toBe(conceptId);
 expect(q.node.answerChoices.map(a=>a.id)).toEqual(n.answerChoices.map(a=>a.id));
 const key=q.node.answerChoices.find(a=>a.isCorrect)!;
 const answer:GameCommand=employee?{type:"SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",operationId:"stats1.score",discussionId:id,decisionNodeId:q.node.id,answerChoiceId:key.id,reviewedAtMs:NOW}:
  {type:"SUBMIT_ANSWER",operationId:"stats1.score",encounterId:id,decisionNodeId:q.node.id,answerChoiceId:key.id,reviewedAtMs:NOW};
 execute(answer);const h=session.state.learningHistories[conceptId]!;expect(h.reviews).toHaveLength(previous.reviews.length+1);expect(h.reviews.slice(0,-1)).toEqual(previous.reviews);
 expect(h.reviews.at(-1)).toMatchObject({primaryConceptId:conceptId,questionVariantId:n.questionVariantId,answerChoiceId:key.id,correct:true});
 expect(execute(answer).learningHistories[conceptId]!.reviews).toEqual(h.reviews);
 if(employee){
  execute({type:"ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK",operationId:"stats1.feedback",discussionId:id,decisionNodeId:n.id});
  execute({type:"FILE_EMPLOYEE_DISCUSSION",operationId:"stats1.file",discussionId:id});
  expect(session.state.employeeDiscussions![id]!.lifecycle).toBe("resolved");
  expect(session.state.employeeDiscussions![id]!.frozenCase).toEqual(frozen);
 }else{expect(session.state.encounters[id]!.resolutionReason).toBe("completed");expect(session.state.encounters[id]!.frozenCase).toEqual(frozen);}
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}
function expectDefinition(frozen:Frozen,cs:SyntheticClinicalCase){
 const n=frozen.decisionNodes[0]!,original=cs.decisionNodes[0]!;
 expect(n).toMatchObject({id:original.id,questionVariantId:original.questionVariantId,primaryConceptId:original.primaryConceptId,exhibit:original.exhibit});
 const order=(a:typeof n.answerChoices)=>[...a].sort((a,b)=>a.id.localeCompare(b.id));expect(order(n.answerChoices)).toEqual(order(original.answerChoices));
}

describe("stats1 accepted-default and original frozen save compatibility",()=>{
 it.each(cases)("admits $id from the accepted default and completes its format-three save",async example=>{
  const f=setup(example,false),state=apply(f.state,f.admission,f.context),s=subject(state,example.employee);
  expectDefinition(s.frozen,accepted.cases.find(c=>c.id===example.caseId)!);expect(state.learningHistories).toEqual(f.state.learningHistories);
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try {expect(subject(session.state,example.employee).frozen).toEqual(s.frozen);await finish(session,example.employee,s.id,s.frozen,f.conceptId);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
 for(const phase of ["waiting","in-progress"] as const)it.each(cases)("reopens "+phase+" original $id and scores its old frozen question and stable concept",async example=>{
  const f=setup(example,true);let state=apply(f.state,f.admission,f.context);const s=subject(state,example.employee);
  expectDefinition(s.frozen,f.cs);expect(s.frozen.decisionNodes[0]!.questionVariantId).not.toBe(accepted.cases.find(c=>c.id===example.caseId)!.decisionNodes[0]!.questionVariantId);
  if(phase==="in-progress")await ready(()=>state,c=>state=apply(state,c,f.context),example.employee,s.id,"stats1.old");
  const frozen=structuredClone(subject(state,example.employee).frozen),history=structuredClone(state.learningHistories);
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try {expect(subject(session.state,example.employee).frozen).toEqual(frozen);expect(session.state.learningHistories).toEqual(history);
   await finish(session,example.employee,s.id,frozen,f.conceptId);const done=session.state;session.dispose();
   session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);expect(await r.runtime.transport.list()).toHaveLength(1);
  }finally{session.dispose();}
 });
 it.each(cases)("replays the committed original $id admission/scheduling journal without reselecting a new version",async example=>{
  const f=setup(example,true),r=await rig(f.state),coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"57",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="stats1.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],
   writerGeneration:coordinator.journalWriterGeneration,snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,e=>{throw e;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,f.context);expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
  const s=subject(committed.state,example.employee);expectDefinition(s.frozen,f.cs);
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try {expect(subject(session.state,example.employee).frozen).toEqual(s.frozen);expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);
   expect(session.state.learningHistories).toEqual(committed.state.learningHistories);await finish(session,example.employee,s.id,s.frozen,f.conceptId);
   expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
});
