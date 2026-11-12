import {describe,expect,it} from "vitest";
import {QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH1_RETAINED_CASES as retired,
 QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES as timings,
 type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {PROTOTYPE_DOMAIN_CONTEXT as current,gameReducer,getCurrentQuestion,getAnswerChoiceServicePreview,applyFsrsReview,createNewFsrsCard,
 applyGameEvidenceCommand,gameEvidenceDelta,type DomainContext,type GameState,type GameCommand} from "@gamify-surgery/game-domain";
import {beforeProgramBatch1AcceptanceRelease} from "../../../packages/clinical-content/src/question-program-batch1-acceptance-test-support";
import {createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
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

const encounterId="encounter.topic.acceptance",NOW=1_800_000_000_000;
const previous:DomainContext={...current,clinicalRelease:beforeProgramBatch1AcceptanceRelease(current.clinicalRelease)};
type Frozen=GameState["encounters"][string]["frozenCase"];
function apply(state:GameState,cmd:GameCommand,context:DomainContext){
 const next=gameReducer(state,cmd,context);expect(next.operationReceipts[cmd.operationId],cmd.operationId).toMatchObject({status:"applied"});return next;
}
function fixture(cs:SyntheticClinicalCase,context=current){
 let state=createLevelFourRoomsQaState(context);
 for(const cmd of [
  {type:"PLACE_ROOM",operationId:"topic.exam",roomDefinitionId:"room.examination",roomId:"room.topic.exam",x:35,y:24,orientation:0},
  {type:"PLACE_DOOR",operationId:"topic.door",roomId:"room.topic.exam",doorId:"door.topic.exam",side:"south",offset:1},
 ] as const)state=apply(state,cmd,context);
 Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,
  nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:false});
 // Historical cards use the actual old question and its original meaning.
 if(retired.some(old=>old.id===cs.id)){
  const n=cs.decisionNodes[0]!,earlier=applyFsrsReview(createNewFsrsCard(0),"Good",1000,context.balanceRelease.learning);
  state.learningHistories[n.primaryConceptId]={conceptId:n.primaryConceptId,card:earlier.card,reviews:[{
   id:"review.topic.previous",encounterId:"encounter.topic.previous",decisionNodeId:n.id,questionVariantId:n.questionVariantId,
   patientPresentationVariantId:cs.patientPresentationVariantId,primaryConceptId:n.primaryConceptId,
   answerChoiceId:n.answerChoices.find(a=>a.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:earlier.log,
  }]};
 }
 const admission:GameCommand={type:"ADMIT_PATIENT",operationId:"topic.admit",encounterId,caseId:cs.id,
  patientDisplayName:cs.prototypeDemographics?.sexLabel==="Female"?"Nora White":"Noah White",arrivalClass:"routine"};
 return {state,admission};
}
async function rig(state:GameState){
 const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
 const scope={backendId:"topic.acceptance",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"81",clock.wall,{branchId:"topic.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
function preservedHistories(actual:GameState,old:GameState){
 for(const [id,history] of Object.entries(old.learningHistories))expect(actual.learningHistories[id],id).toEqual(history);
 for(const [id,history] of Object.entries(actual.learningHistories))if(!old.learningHistories[id])expect(history.reviews,id).toEqual([]);
}
async function finish(session:CloudGameSession,frozen:Frozen){
 const histories=structuredClone(session.state.learningHistories);
 const execute=(cmd:GameCommand)=>{
  const next=session.execute(cmd,current);expect(next,cmd.operationId).not.toBeNull();
  expect(next!.operationReceipts[cmd.operationId],cmd.operationId).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return next!;
 };
 for(let index=0;index<frozen.decisionNodes.length;index++){
  let q=getCurrentQuestion(session.state,encounterId,current);
  for(let tick=0;tick<240&&!q;tick++){
   execute({type:"ADVANCE_TICK",operationId:`topic.tick.${index}.${tick}`,advancedAtRealMs:NOW});
   const e=session.state.encounters[encounterId]!;
   if(session.state.openChartEncounterId!==encounterId&&e.checkInStatus==="checked_in"&&!e.patientMovement)
    execute({type:"OPEN_CHART",operationId:`topic.open.${index}.${tick}`,encounterId});
   if(tick%32===31)expect(await session.durable()).toBe(true);
   q=getCurrentQuestion(session.state,encounterId,current);
  }
  expect(q,"Ordinary question reaches the unchanged240-tick bound").not.toBeNull();
  const n=frozen.decisionNodes[index]!;expect(q!.node).toEqual(n);
  const classification=timings.find(t=>t.questionVariantId===n.questionVariantId)?.classification;
  if(classification)for(const choice of n.answerChoices){
   const preview=getAnswerChoiceServicePreview(session.state,encounterId,choice.id,current);
   if(classification.kind==="no_test"){expect(preview).toBeNull();continue;}
   const expected=classification.choices.find(c=>c.choiceId===choice.id)!.timing;
   if(expected.kind==="test"){
    expect(preview?.kind).toBe("test");expect(preview!.timingProfileId).toBe(expected.timingProfileId);expect(preview!.durationTicks).toBeGreaterThan(0);
   }else{expect(preview?.kind).toBe("no_test");expect(preview!.durationTicks).toBeNull();}
  }
  const cmd:GameCommand={type:"SUBMIT_ANSWER",operationId:`topic.score.${index}`,encounterId,decisionNodeId:n.id,
   answerChoiceId:n.answerChoices.find(a=>a.isCorrect)!.id,reviewedAtMs:NOW+index};
  execute(cmd);const history=session.state.learningHistories[n.primaryConceptId]!,old=histories[n.primaryConceptId]?.reviews??[];
  expect(history.reviews.slice(0,-1)).toEqual(old);expect(history.reviews).toHaveLength(old.length+1);
  expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:n.primaryConceptId,questionVariantId:n.questionVariantId,correct:true});
  expect(execute(cmd).learningHistories[n.primaryConceptId]).toEqual(history);
  if(index<frozen.decisionNodes.length-1)execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK",operationId:`topic.ack.${index}`,encounterId,decisionNodeId:n.id});
 }
 for(const [id,history] of Object.entries(histories))if(!frozen.decisionNodes.some(n=>n.primaryConceptId===id))expect(session.state.learningHistories[id]).toEqual(history);
 expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
 expect(session.state.encounters[encounterId]!.answers).toHaveLength(frozen.decisionNodes.length);
 expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}
describe("topic batch1 projection admission and original frozen-save identities",()=>{
 it.each(cases)("admits $id from actual default and completes every exact frozen node",async cs=>{
  expect(current.clinicalRelease.cases.find(c=>c.id===cs.id)).toEqual(cs);
  const f=fixture(cs),state=apply(f.state,f.admission,current),frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
  expect(frozen.decisionNodes.map(n=>n.questionVariantId)).toEqual(cs.decisionNodes.map(n=>n.questionVariantId));
  expect(state.learningHistories).toEqual(f.state.learningHistories);
  expect(frozen.presentation).toContain(f.admission.patientDisplayName);
  if(cs.id.includes("critical-respiratory-ventilation")){
   expect(frozen.decisionNodes[0]!.stem).toContain(f.admission.patientDisplayName);
   expect(JSON.stringify(frozen.decisionNodes)).not.toContain(cs.patientDisplayName);
  }
  for(const n of frozen.decisionNodes){const authored=cs.decisionNodes.find(a=>a.id===n.id)!;
   expect([...n.answerChoices].sort((a,b)=>a.id.localeCompare(b.id))).toEqual([...authored.answerChoices].sort((a,b)=>a.id.localeCompare(b.id)));
  }
  const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);preservedHistories(session.state,state);await finish(session,frozen);
   const done=session.state;session.dispose();session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
   expect(session.state).toEqual(done);expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  }finally{session.dispose();}
 });
 it.each(retired)("reopens retired $id from its610-meaning format3 save and scores its original card",async cs=>{
  expect(current.clinicalRelease.cases.some(c=>c.id===cs.id)).toBe(false);
  const f=fixture(cs,previous);expect(Object.keys(f.state.learningHistories)).toHaveLength(610);
  expect(gameReducer(f.state,f.admission,current).operationReceipts[f.admission.operationId]!.status).toBe("rejected");
  const state=apply(f.state,f.admission,previous),frozen=structuredClone(state.encounters[encounterId]!.frozenCase),r=await rig(state);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);preservedHistories(session.state,state);await finish(session,frozen);
   expect(session.state.learningHistories[cs.decisionNodes[0]!.primaryConceptId]!.reviews).toHaveLength(2);
  }finally{session.dispose();}
 });
 it("replays a committed retired admission journal without fresh-selection substitution",async()=>{
  const cs=retired[0]!,f=fixture(cs,previous),r=await rig(f.state),coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"81",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="topic.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],
   writerGeneration:coordinator.journalWriterGeneration,snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,previous);expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
  const frozen=committed.state.encounters[encounterId]!.frozenCase;
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);preservedHistories(session.state,committed.state);
   expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);await finish(session,frozen);
   expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
});
