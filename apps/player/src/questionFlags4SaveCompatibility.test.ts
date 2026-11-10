import {describe,expect,it} from "vitest";
import {QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE as accepted,QUESTION_FLAGS4_RETAINED_INPUT as retained} from "@gamify-surgery/clinical-content";
import {PROTOTYPE_DOMAIN_CONTEXT,createInitialGameState,applyFsrsReview,createNewFsrsCard,gameReducer,getCurrentQuestion,
 applyGameEvidenceCommand,gameEvidenceDelta,type DomainContext,type GameState,type GameCommand} from "@gamify-surgery/game-domain";
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

import {beforeHarden1N3r4AcceptanceRelease} from "../../../packages/clinical-content/src/question-harden1-n3r4-acceptance-test-support";
const current={...PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:beforeHarden1N3r4AcceptanceRelease(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease)},NOW=1_800_000_000_000,encounterId="encounter.flags4-ship";
type Frozen=GameState["encounters"][string]["frozenCase"];
function setup(historical:boolean){
 const cs=(historical?retained:accepted).cases[0]!;
 // Isolate the exact old/current case only for deterministic admission. All
 // eligibility, navigation, source nodes and frozen-data paths remain real.
 const context:DomainContext={...current,clinicalRelease:{...current.clinicalRelease,cases:[cs]}};
 const state=createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT,{campaignId:"campaign.flags4-ship",campaignSeed:"flags4-ship",createdAtRealMs:NOW});
 state.facilityLevel=2;state.paused=false;state.encounters={};state.openChartEncounterId=null;state.attendedEncounterId=null;
 state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;state.nextEmployeeDiscussionTick=Number.MAX_SAFE_INTEGER;state.nextFinancialPostingTick=Number.MAX_SAFE_INTEGER;
 state.rooms.push({id:"room.flags4.exam",roomDefinitionId:"room.examination",x:34,y:26,orientation:0,doorSide:"south",upgradeLevel:1,cleanliness:100});
 state.doors.push({id:"door.flags4.exam",roomId:"room.flags4.exam",side:"south",offset:1,exterior:false});
 const old=retained.cases[0]!,node=old.decisionNodes[0]!,previous=applyFsrsReview(createNewFsrsCard(0),"Good",1000,context.balanceRelease.learning);
 state.learningHistories[node.primaryConceptId]={conceptId:node.primaryConceptId,card:previous.card,reviews:[{
  id:"review.flags4.previous",encounterId:"encounter.flags4.previous",decisionNodeId:node.id,questionVariantId:node.questionVariantId,
  patientPresentationVariantId:old.patientPresentationVariantId,primaryConceptId:node.primaryConceptId,
  answerChoiceId:node.answerChoices.find(a=>a.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:previous.log,
 }]};
 const admission:GameCommand={type:"ADMIT_PATIENT",operationId:"flags4.admit",encounterId,caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:"routine"};
 return {state,context,cs,admission,conceptId:node.primaryConceptId};
}
function apply(state:GameState,command:GameCommand,context:DomainContext){
 const next=gameReducer(state,command,context);expect(next.operationReceipts[command.operationId]).toMatchObject({status:"applied"});return next;
}
async function ready(read:()=>GameState,execute:(c:GameCommand)=>GameState,prefix:string){
 for(let tick=0;tick<240;tick++){
  const state=read(),q=getCurrentQuestion(state,encounterId,current);if(q)return q;
  const e=state.encounters[encounterId]!;
  if(state.openChartEncounterId!==encounterId&&e.checkInStatus==="checked_in"&&!e.patientMovement)
   execute({type:"OPEN_CHART",operationId:prefix+".open."+tick,encounterId});
  execute({type:"ADVANCE_TICK",operationId:prefix+".tick."+tick,advancedAtRealMs:NOW});
 }
 throw new Error("Flags4 frozen question did not become answer-ready");
}
async function rig(state:GameState){
 const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
 const scope={backendId:"flags4-ship-test",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"57",clock.wall,{branchId:"flags4.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,frozen:Frozen,conceptId:string){
 const previous=structuredClone(session.state.learningHistories[conceptId]!);
 const execute=(command:GameCommand)=>{const next=session.execute(command,current);expect(next).not.toBeNull();expect(next!.operationReceipts[command.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return next!;};
 const q=await ready(()=>session.state,execute,"flags4.current"),n=frozen.decisionNodes[0]!;
 expect(q.node.questionVariantId).toBe(n.questionVariantId);expect(q.node.primaryConceptId).toBe(conceptId);
 expect(q.node.answerChoices.map(a=>a.id)).toEqual(n.answerChoices.map(a=>a.id));
 const key=q.node.answerChoices.find(a=>a.isCorrect)!;
 const command:GameCommand={type:"SUBMIT_ANSWER",operationId:"flags4.score",encounterId,decisionNodeId:n.id,answerChoiceId:key.id,reviewedAtMs:NOW};
 execute(command);const history=session.state.learningHistories[conceptId]!;
 expect(history.reviews).toHaveLength(previous.reviews.length+1);expect(history.reviews.slice(0,-1)).toEqual(previous.reviews);
 expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:conceptId,questionVariantId:n.questionVariantId,answerChoiceId:key.id,correct:true});
 expect(execute(command).learningHistories[conceptId]!.reviews).toEqual(history.reviews);
 expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}

describe("flags4 accepted default and original frozen save compatibility",()=>{
 it("admits the exact accepted default and completes its format-three save using the stable concept",async()=>{
  const f=setup(false);
  expect(current.clinicalRelease.cases.find(c=>c.id===f.cs.id)).toEqual(f.cs);
  const state=apply(f.state,f.admission,current),frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
  expect(frozen.decisionNodes[0]!.questionVariantId).toBe(accepted.cases[0]!.decisionNodes[0]!.questionVariantId);
  expect(frozen.decisionNodes[0]!.currentUpdate).toBeUndefined();expect(frozen.decisionNodes[0]!.answerChoices).toHaveLength(3);
  expect(state.learningHistories).toEqual(f.state.learningHistories);
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);await finish(session,frozen,f.conceptId);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
 for(const phase of ["waiting","in-progress"] as const)it("reopens "+phase+" original v3 with its old four-choice order and scores its frozen identity",async()=>{
  const f=setup(true);let state=apply(f.state,f.admission,f.context);
  expect(state.encounters[encounterId]!.lifecycle).toBe("waiting_unopened");
  if(phase==="in-progress")await ready(()=>state,c=>state=apply(state,c,f.context),"flags4.old");
  const frozen=structuredClone(state.encounters[encounterId]!.frozenCase),history=structuredClone(state.learningHistories);
  expect(frozen.decisionNodes[0]!.questionVariantId).toBe(retained.cases[0]!.decisionNodes[0]!.questionVariantId);expect(frozen.decisionNodes[0]!.answerChoices).toHaveLength(4);
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);expect(session.state.learningHistories).toEqual(history);
   await finish(session,frozen,f.conceptId);const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});expect(session.state).toEqual(done);
  }finally{session.dispose();}
 });
 it("replays a committed original v3 admission journal without selecting the accepted rewrite",async()=>{
  const f=setup(true),r=await rig(f.state),coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"57",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="flags4.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],
   writerGeneration:coordinator.journalWriterGeneration,snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,f.context);expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
  const frozen=committed.state.encounters[encounterId]!.frozenCase;expect(frozen.decisionNodes[0]!.questionVariantId).toBe(retained.cases[0]!.decisionNodes[0]!.questionVariantId);
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);expect(session.state.learningHistories).toEqual(committed.state.learningHistories);
   expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);
   await finish(session,frozen,f.conceptId);expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
});
