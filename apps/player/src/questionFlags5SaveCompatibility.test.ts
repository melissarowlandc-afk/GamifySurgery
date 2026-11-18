import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {describe,expect,it} from "vitest";
import {
  QUESTION_FLAGS5_ACCEPTED_ROWS,QUESTION_FLAGS5_FINAL_ACCEPTED_ROWS,
  type SyntheticClinicalCase,type SyntheticClinicalRelease,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT as current,gameReducer,getCurrentQuestion,
  applyFsrsReview,createNewFsrsCard,applyGameEvidenceCommand,gameEvidenceDelta,
  type DomainContext,type GameState,type GameCommand,
} from "@gamify-surgery/game-domain";
import {materializePatientName} from "../../../packages/game-domain/src/patientText";
import {createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
import {createPrototypePlayerView} from "./session/viewModels";
import {snapshotCopy} from "./session/cloud/snapshotCodec";
import {MemoryCloudCache} from "./session/cloud/cache";
import {MemoryCloudEntryStore} from "./session/cloud/entryStorage";
import {FakeCloudServer} from "./session/cloud/fakeTransport";
import {openAutomaticCloudCampaign} from "./session/cloud/automaticResolution";
import {CloudGameSession} from "./session/cloud/gameSession";
import {CloudSyncCoordinator} from "./session/cloud/coordinator";
import {loadCloudEvidenceCheckpoint} from "./session/cloud/codecEvidence";
import {codecTestCampaign} from "./session/cloud/codecTestSupport";
import {TestCloudClock} from "./session/cloud/syncTestSupport";
import {cloudCampaignStorageKey} from "./session/accountStorageKey";
import {bindJournal,prepareJournal} from "./session/cloud/journalCodec";
import {LocalJournalDrain} from "./session/localJournal";
import {cloudCodec} from "./session/cloud/codecWorker";

type Frozen=GameState["encounters"][string]["frozenCase"];
const encounterId="encounter.flags5.format3",now=1_800_000_000_000;
const read=(name:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+name,import.meta.url),"utf8")) as {defaultRelease:SyntheticClinicalRelease;defaultSha256:string};
const hash=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const beforeFirst=read("question-flags5-acceptance-before-20261116.json"),beforeFinal=read("question-flags5-final-acceptance-before-20261116.json");
expect(hash(beforeFirst.defaultRelease)).toBe(beforeFirst.defaultSha256);
expect(hash(beforeFinal.defaultRelease)).toBe(beforeFinal.defaultSha256);
const caseIds=[...new Set([...QUESTION_FLAGS5_ACCEPTED_ROWS,...QUESTION_FLAGS5_FINAL_ACCEPTED_ROWS].map(r=>r.caseId))];
const generations=[
  {name:"pre-flags5",release:beforeFirst.defaultRelease},
  {name:"sixteen-fix",release:beforeFinal.defaultRelease},
  {name:"current",release:current.clinicalRelease},
];
const scenarios=generations.flatMap(g=>caseIds.map(id=>{
  const clinicalCase=g.release.cases.find(c=>c.id===id)!;
  expect(clinicalCase,id).toBeDefined();
  return {name:g.name+" / "+id,clinicalCase,context:{...current,clinicalRelease:g.release} as DomainContext};
}));

/** Canonical paths remove object-key-order differences, not wording. Every
 * saved string, whitespace character and choice position remains byte-exact. */
function wordingBytes(value:unknown):Buffer {
  const strings:Array<[string,string]>=[];
  const visit=(v:unknown,path:string)=>{
    if(typeof v==="string")strings.push([path,v]);
    else if(Array.isArray(v))v.forEach((item,index)=>visit(item,path+"["+index+"]"));
    else if(v&&typeof v==="object")for(const key of Object.keys(v).sort())visit((v as Record<string,unknown>)[key],path+"."+key);
  };
  visit(value,"");return Buffer.from(JSON.stringify(strings),"utf8");
}
function apply(state:GameState,command:GameCommand,context=current):GameState {
  const next=gameReducer(state,command,context);
  expect(next.operationReceipts[command.operationId],command.operationId).toMatchObject({status:"applied"});return next;
}
function fixture(clinicalCase:SyntheticClinicalCase,context:DomainContext){
  const state=createLevelFourRoomsQaState(context);
  Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:false});
  for(const conceptId of new Set(clinicalCase.decisionNodes.map(n=>n.primaryConceptId))){
    const node=clinicalCase.decisionNodes.find(n=>n.primaryConceptId===conceptId)!;
    const old=applyFsrsReview(createNewFsrsCard(0),"Good",1000,current.balanceRelease.learning);
    state.learningHistories[conceptId]={conceptId,card:old.card,reviews:[{
      id:"review.flags5.prior."+node.id,encounterId:"encounter.flags5.prior",decisionNodeId:node.id,
      questionVariantId:node.questionVariantId,patientPresentationVariantId:clinicalCase.patientPresentationVariantId,
      primaryConceptId:conceptId,answerChoiceId:node.answerChoices.find(c=>c.isCorrect)!.id,correct:true,rating:"Good",
      reviewedAtMs:1000,facilityTick:0,schedulerLog:old.log,
    }]};
  }
  const admission:GameCommand={type:"ADMIT_PATIENT",operationId:"flags5.admit",encounterId,caseId:clinicalCase.id,
    patientDisplayName:clinicalCase.prototypeDemographics?.sexLabel==="Female"?"Mira Vale":"Miles Vale",arrivalClass:"routine"};
  return {state,admission};
}
function assertOriginalAdmission(state:GameState,source:SyntheticClinicalCase){
  const e=state.encounters[encounterId]!,original=materializePatientName(source,e.patientDisplayName);
  expect(e.frozenCase.decisionNodes.map(n=>[n.id,n.questionVariantId,n.primaryConceptId])).toEqual(source.decisionNodes.map(n=>[n.id,n.questionVariantId,n.primaryConceptId]));
  for(const node of e.frozenCase.decisionNodes){const authored=original.decisionNodes.find(n=>n.id===node.id)!;
    expect([...node.answerChoices].sort((a,b)=>a.id.localeCompare(b.id))).toEqual([...authored.answerChoices].sort((a,b)=>a.id.localeCompare(b.id)));
  }
}
function historiesPreserved(state:GameState,old:GameState){
  for(const [id,history]of Object.entries(old.learningHistories))expect(state.learningHistories[id],id).toEqual(history);
  for(const [id,history]of Object.entries(state.learningHistories))if(!old.learningHistories[id])expect(history.reviews,id).toEqual([]);
}
async function ready(state:GameState,execute:(command:GameCommand)=>GameState,suffix:string,durable?:()=>Promise<boolean>):Promise<GameState> {
  const pending=state.encounters[encounterId]!.pendingResult;
  // Honor the actual service clock and the existing cloud journal backpressure
  // contract. Drain every32 commands as the earlier save-compatibility suites do.
  let elapsed=0;
  if(pending)while(state.facilityTick<pending.dueTick){
    state=execute({type:"ADVANCE_TICK",operationId:"flags5.pending."+suffix+"."+state.facilityTick,advancedAtRealMs:now});
    if(durable&&++elapsed%32===0)expect(await durable()).toBe(true);
  }
  for(let tick=0;tick<240&&!getCurrentQuestion(state,encounterId,current);tick++){
    state=execute({type:"ADVANCE_TICK",operationId:"flags5.ready."+suffix+"."+tick,advancedAtRealMs:now});
    const e=state.encounters[encounterId]!;
    if(state.openChartEncounterId!==encounterId&&e.checkInStatus==="checked_in"&&!e.patientMovement)
      state=execute({type:"OPEN_CHART",operationId:"flags5.chart."+suffix+"."+tick,encounterId});
    if(durable&&tick%32===31)expect(await durable()).toBe(true);
  }
  expect(getCurrentQuestion(state,encounterId,current),suffix+" existing240-tick readiness bound").not.toBeNull();return state;
}
function renderedWording(state:GameState,frozen:Frozen,index:number):Buffer {
  const node=frozen.decisionNodes[index]!,question=getCurrentQuestion(state,encounterId,current)!;
  expect(question.node).toEqual(node);
  const chart=createPrototypePlayerView(state,encounterId,false,null).chart!;
  expect(chart.answerChoices.map(c=>[c.id,c.label])).toEqual(node.answerChoices.map(c=>[c.id,c.label]));
  const step=chart.decisionSteps?.find(s=>s.id===node.id);
  return wordingBytes({presentation:chart.presentation,complaint:chart.chiefComplaint,prompt:chart.questionPrompt,
    choices:chart.answerChoices.map(c=>({id:c.id,label:c.label})),step:step?{prompt:step.questionPrompt,exhibit:step.exhibit}:null});
}
async function rig(state:GameState){
  const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
  const scope={backendId:"flags5.format3",accountId:"account-a",campaignId:state.campaignId};
  const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
  const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"91",clock.wall,{branchId:"flags5.frozen",sequence:400,parents:[]});
  expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
  const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
  return {clock,cache,scope,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,frozen:Frozen){
  const execute=(command:GameCommand)=>{const state=session.execute(command,current);expect(state,command.operationId).not.toBeNull();expect(state!.operationReceipts[command.operationId]).toMatchObject({status:"applied"});return state!;};
  for(let index=0;index<frozen.decisionNodes.length;index++){
    await ready(session.state,execute,"finish."+index,()=>session.durable());
    expect(wordingBytes(session.state.encounters[encounterId]!.frozenCase)).toEqual(wordingBytes(frozen));
    renderedWording(session.state,frozen,index);
    const node=frozen.decisionNodes[index]!,prior=structuredClone(session.state.learningHistories[node.primaryConceptId]!);
    const answer:GameCommand={type:"SUBMIT_ANSWER",operationId:"flags5.score."+index,encounterId,decisionNodeId:node.id,answerChoiceId:node.answerChoices.find(c=>c.isCorrect)!.id,reviewedAtMs:now+index};
    execute(answer);const history=structuredClone(session.state.learningHistories[node.primaryConceptId]!);
    expect(history.reviews.slice(0,-1)).toEqual(prior.reviews);expect(history.reviews.at(-1)).toMatchObject({questionVariantId:node.questionVariantId,primaryConceptId:node.primaryConceptId,correct:true});
    expect(execute(answer).learningHistories[node.primaryConceptId]).toEqual(history);
    if(index<frozen.decisionNodes.length-1)execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK",operationId:"flags5.ack."+index,encounterId,decisionNodeId:node.id});
  }
  expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  expect(wordingBytes(session.state.encounters[encounterId]!.frozenCase)).toEqual(wordingBytes(frozen));
  expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");expect(await session.durable()).toBe(true);
}

describe("all flags5 format3 frozen wording and FSRS generations",()=>{
  it.each(scenarios)("reopens the exact open-question snapshot: $name",async s=>{
    const f=fixture(s.clinicalCase,s.context);let state=apply(f.state,f.admission,s.context);
    assertOriginalAdmission(state,s.clinicalCase);
    state=await ready(state,command=>state=apply(state,command),"snapshot");
    const frozen=structuredClone(state.encounters[encounterId]!.frozenCase),before=wordingBytes(frozen),view=renderedWording(state,frozen,0);
    const r=await rig(state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
    try{
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      expect(wordingBytes(session.state.encounters[encounterId]!.frozenCase)).toEqual(before);
      expect(renderedWording(session.state,frozen,0)).toEqual(view);historiesPreserved(session.state,state);
      await finish(session,frozen);session.dispose();
      session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);expect(wordingBytes(session.state.encounters[encounterId]!.frozenCase)).toEqual(before);
    }finally{session.dispose();}
  });
  it.each(scenarios)("replays the exact historical admission journal: $name",async s=>{
    const f=fixture(s.clinicalCase,s.context),r=await rig(f.state);
    const coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
    expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
    const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"91",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
    const key=cloudCampaignStorageKey(r.scope),owner="flags5.previous-writer";
    const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,
      confirmed:r.copy,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration,
      snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
    const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
    const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admission,s.context);
    expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});assertOriginalAdmission(committed.state,s.clinicalCase);
    const frozen=structuredClone(committed.state.encounters[encounterId]!.frozenCase),before=wordingBytes(frozen);
    drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
    expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
    const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
    try{
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);expect(wordingBytes(session.state.encounters[encounterId]!.frozenCase)).toEqual(before);
      historiesPreserved(session.state,committed.state);await finish(session,frozen);
      expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
    }finally{session.dispose();}
  });
});
