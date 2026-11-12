import {describe,expect,it} from "vitest";
import {QUESTION_HARDEN1_N3R4_ACCEPTED_CASES as accepted,QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE as oldView,
 QUESTION_NEW_N3_ROUND4_RETAINED_CASES as retainedN3,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
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

const current=PROTOTYPE_DOMAIN_CONTEXT,NOW=1_800_000_000_000,encounterId="encounter.harden1-n3r4-ship",old=oldView.cases[0]!;
type Frozen=GameState["encounters"][string]["frozenCase"];
function apply(state:GameState,command:GameCommand,context:DomainContext){const next=gameReducer(state,command,context);expect(next.operationReceipts[command.operationId]).toMatchObject({status:"applied"});return next;}
function setup(cs:SyntheticClinicalCase){
 const context:DomainContext={...current,clinicalRelease:{...current.clinicalRelease,cases:[cs]}};
 const state=createInitialGameState(current,{campaignId:"campaign.harden1-n3r4-ship",campaignSeed:"harden1-n3r4-ship",createdAtRealMs:NOW});
 state.facilityLevel=5;state.paused=false;state.encounters={};state.openChartEncounterId=null;state.attendedEncounterId=null;
 state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;state.nextEmployeeDiscussionTick=Number.MAX_SAFE_INTEGER;state.nextFinancialPostingTick=Number.MAX_SAFE_INTEGER;
 state.rooms.push({id:"room.harden1.exam",roomDefinitionId:"room.examination",x:34,y:26,orientation:0,doorSide:"south",upgradeLevel:1,cleanliness:100});
 state.doors.push({id:"door.harden1.exam",roomId:"room.harden1.exam",side:"south",offset:1,exterior:false});
 const previous=applyFsrsReview(createNewFsrsCard(0),"Good",1000,current.balanceRelease.learning),n=old.decisionNodes[0]!;
 state.learningHistories[n.primaryConceptId]={conceptId:n.primaryConceptId,card:previous.card,reviews:[{
  id:"review.harden1.previous",encounterId:"encounter.harden1.previous",decisionNodeId:n.id,questionVariantId:n.questionVariantId,
  patientPresentationVariantId:old.patientPresentationVariantId,primaryConceptId:n.primaryConceptId,
  answerChoiceId:n.answerChoices.find(a=>a.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:previous.log,
 }]};
 const admission:GameCommand={type:"ADMIT_PATIENT",operationId:"harden1.admit",encounterId,caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:"routine"};
 return {state,context,admission};
}
async function rig(state:GameState){
 const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
 const scope={backendId:"harden1-n3r4-test",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"61",clock.wall,{branchId:"harden1.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,frozen:Frozen){
 const n=frozen.decisionNodes[0]!,conceptId=n.primaryConceptId,prior=structuredClone(session.state.learningHistories[conceptId]?.reviews??[]);
 const oldHistory=structuredClone(session.state.learningHistories[old.decisionNodes[0]!.primaryConceptId]);
 const execute=(command:GameCommand)=>{const next=session.execute(command,current);expect(next).not.toBeNull();expect(next!.operationReceipts[command.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return next!;};
 let question=getCurrentQuestion(session.state,encounterId,current);
 for(let tick=0;tick<240&&!question;tick++){
  const e=session.state.encounters[encounterId]!;
  if(session.state.openChartEncounterId!==encounterId&&e.checkInStatus==="checked_in"&&!e.patientMovement)execute({type:"OPEN_CHART",operationId:"harden1.open."+tick,encounterId});
  execute({type:"ADVANCE_TICK",operationId:"harden1.tick."+tick,advancedAtRealMs:NOW});question=getCurrentQuestion(session.state,encounterId,current);
 }
 expect(question,"Frozen question reaches the existing 240-tick readiness bound").not.toBeNull();
 expect(question!.node.questionVariantId).toBe(n.questionVariantId);expect(question!.node.primaryConceptId).toBe(conceptId);
 expect(question!.node.answerChoices.map(a=>a.id)).toEqual(n.answerChoices.map(a=>a.id));
 const key=question!.node.answerChoices.find(a=>a.isCorrect)!,command:GameCommand={type:"SUBMIT_ANSWER",operationId:"harden1.score",encounterId,decisionNodeId:n.id,answerChoiceId:key.id,reviewedAtMs:NOW};
 execute(command);const history=session.state.learningHistories[conceptId]!;
 expect(history.reviews).toHaveLength(prior.length+1);expect(history.reviews.slice(0,-1)).toEqual(prior);
 expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:conceptId,questionVariantId:n.questionVariantId,answerChoiceId:key.id,correct:true});
 if(conceptId!==old.decisionNodes[0]!.primaryConceptId)expect(session.state.learningHistories[old.decisionNodes[0]!.primaryConceptId]).toEqual(oldHistory);
 expect(execute(command).learningHistories[conceptId]!.reviews).toEqual(history.reviews);
 expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}
describe("harden1/N3R4 accepted default and legacy frozen identities",()=>{
 it.each(accepted)("admits $id from actual default and reopens/completes its format3 save",async cs=>{
  const f=setup(cs);expect(current.clinicalRelease.cases.find(c=>c.id===cs.id)).toEqual(cs);
  const state=apply(f.state,f.admission,current),frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
  expect(frozen.decisionNodes[0]!.questionVariantId).toBe(cs.decisionNodes[0]!.questionVariantId);expect(state.learningHistories).toEqual(f.state.learningHistories);
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);await finish(session,frozen);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
   expect(session.state).toEqual(done);expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  }finally{session.dispose();}
 });
 it("reopens and completes the replaced live v3.r2 with its original concept and choice order",async()=>{
  const f=setup(old);expect(current.clinicalRelease.cases.some(c=>c.id===old.id)).toBe(false);
  const state=apply(f.state,f.admission,f.context),frozen=structuredClone(state.encounters[encounterId]!.frozenCase),newConceptId=accepted[0]!.decisionNodes[0]!.primaryConceptId,
   unchangedNewCard=structuredClone(state.learningHistories[newConceptId]),r=await rig(state);
  expect(frozen.decisionNodes[0]!.questionVariantId).toBe("question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2");
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);await finish(session,frozen);
   expect(session.state.learningHistories[newConceptId]).toEqual(unchangedNewCard);
  }finally{session.dispose();}
 });
 it("reopens a committed legacy admission journal without re-admitting its replacement",async()=>{
  const f=setup(old),r=await rig(f.state),coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"61",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="harden1.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],
   writerGeneration:coordinator.journalWriterGeneration,snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,f.context);expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
  const frozen=committed.state.encounters[encounterId]!.frozenCase;
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);expect(session.state.learningHistories).toEqual(committed.state.learningHistories);
   expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);await finish(session,frozen);
   expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
 it.each(retainedN3.filter(cs=>accepted.slice(1).some(a=>a.id===cs.id)))("reopens $id from its prior frozen N3 draft without rewriting its scoring identity",async cs=>{
  const f=setup(cs),state=apply(f.state,f.admission,f.context),frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
  const liveConcept=accepted.find(c=>c.id===cs.id)!.decisionNodes[0]!.primaryConceptId,oldConcept=cs.decisionNodes[0]!.primaryConceptId;
  const otherCard=structuredClone(state.learningHistories[liveConcept]),r=await rig(state);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);await finish(session,frozen);
   expect(session.state.learningHistories[oldConcept]!.reviews.at(-1)!.questionVariantId).toBe(cs.decisionNodes[0]!.questionVariantId);
   if(liveConcept!==oldConcept)expect(session.state.learningHistories[liveConcept]).toEqual(otherCard);
  }finally{session.dispose();}
 });
});
