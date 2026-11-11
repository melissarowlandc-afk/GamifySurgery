import {describe,expect,it} from "vitest";
import {QUESTION_N4_ACCEPTED_CASES as cases,QUESTION_N4_ACCEPTED_TIMING_ENTRIES as timings,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {PROTOTYPE_DOMAIN_CONTEXT as current,gameReducer,getCurrentQuestion,getAnswerChoiceServicePreview,
 applyFsrsReview,createNewFsrsCard,getAppAppointmentHomes,applyGameEvidenceCommand,gameEvidenceDelta,
 type GameState,type GameCommand,type DomainContext} from "@gamify-surgery/game-domain";
import {routineOrFixture} from "../../../packages/game-domain/tests/routine-or-demand.fixture";
import {endoscopyReadyClinic} from "../../../packages/game-domain/tests/routine-endoscopy-ready.fixture";
import {createLevelFourIntegrationState} from "../../../tests/fixtures/level-four-integration";
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
type Frozen=GameState["encounters"][string]["frozenCase"];
function sourceFixture(cs:SyntheticClinicalCase){
 expect(current.clinicalRelease.cases.find(c=>c.id===cs.id)).toEqual(cs);
 // Restrict the test's selection pool to an exact admitted default definition.
 // All610 registered meanings/balance/runtime predicates remain real. No
 // timing/family/topic overlays or direct unsourced procedure admission.
 const context:DomainContext={...current,clinicalRelease:{...current.clinicalRelease,cases:[cs]}};
 const group=cs.requiredClinicalSetting==="ambulatory_surgery"?"operation":cs.requiredClinicalSetting==="outpatient_endoscopy"||cs.requiredClinicalSetting==="endoscopy"?"endoscopy":"clinic";
 const isIncision=cs.id.includes("incisional-pocket");
 // The accepted incision already fits an actual APP consult. Its dedicated
 // wound-list addition is separately handed to the domain owner, not patched.
 const line=group==="operation"?"income.ambulatory_operation":group==="endoscopy"?"income.endoscopy":isIncision?"income.app_consult":"income.wound_care";
 let state=structuredClone(group==="operation"?routineOrFixture().state:group==="endoscopy"?endoscopyReadyClinic({provider:true}).state:createLevelFourIntegrationState("n4.ship."+cs.id));
 Object.assign(state,{facilityLevel:4,paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:true});
 const node=cs.decisionNodes[0]!,conceptId=node.primaryConceptId;
 const legacy=current.clinicalRelease.cases.find(c=>!c.id.startsWith("case.n4.")&&c.decisionNodes.some(n=>n.primaryConceptId===conceptId))??cs;
 const priorNode=legacy.decisionNodes.find(n=>n.primaryConceptId===conceptId)!;
 const earlier=applyFsrsReview(createNewFsrsCard(0),"Good",1000,current.balanceRelease.learning);
 state.learningHistories[conceptId]={conceptId,card:{...earlier.card,dueAtMs:0},reviews:[{
  id:"review.n4.ship.previous",encounterId:"encounter.n4.ship.previous",decisionNodeId:priorNode.id,questionVariantId:priorNode.questionVariantId,
  patientPresentationVariantId:legacy.patientPresentationVariantId,primaryConceptId:conceptId,answerChoiceId:priorNode.answerChoices.find(c=>c.isCorrect)!.id,
  correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:earlier.log,
 }]};
 let sequence=0,lastBefore=state,lastCommand:GameCommand|null=null;
 const tick=()=>{lastBefore=state;lastCommand={type:"ADVANCE_TICK",operationId:`n4.ship.${cs.id}.${sequence++}`,advancedAtRealMs:state.createdAtRealMs+state.facilityTick*1000};
  state=gameReducer(state,lastCommand,context);expect(state.operationReceipts[lastCommand.operationId]).toMatchObject({status:"applied"});};
 if(group==="clinic"){
  for(const key of Object.keys(state.nextServiceAppointmentTicks))state.nextServiceAppointmentTicks[key]=Number.MAX_SAFE_INTEGER;
  const homes=getAppAppointmentHomes(state,context,line);expect(homes.length).toBeGreaterThan(0);
  for(const home of homes)state.nextServiceAppointmentTicks[`${line}:${home}`]=state.facilityTick+1;
 }
 const phaseRoom=group==="operation"?"room.ambulatory_or":group==="endoscopy"?"room.endoscopy":null;
 const atPhase=(op:GameState["serviceOperations"][number])=>op.incomeLineId===line&&op.actorKind==="visitor"&&op.status==="in_service"&&
  (!phaseRoom||op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId===phaseRoom);
 for(let minute=0;minute<600&&!state.serviceOperations.some(atPhase);minute++)tick();
 const original=state.serviceOperations.find(atPhase);expect(original,"Actual care source starts inside the existing600-tick bound").toBeDefined();
 const sourceId=original!.id,actor={name:original!.displayName,appearance:structuredClone(original!.appearance),location:structuredClone(original!.location)};
 state.nextRoutineArrivalTick=state.facilityTick+1;
 for(let minute=0;minute<5&&!state.serviceOperations.find(op=>op.id===sourceId)?.consultEncounterId;minute++)tick();
 const source=state.serviceOperations.find(op=>op.id===sourceId)!,encounterId=source.consultEncounterId;
 expect(encounterId,"Default accepted question binds to this existing actor/source").toBeTruthy();
 const encounter=state.encounters[encounterId!]!;
 expect(encounter.frozenCase.decisionNodes[0]!.questionVariantId).toBe(node.questionVariantId);
 expect(encounter.patientDisplayName).toBe(actor.name);expect(encounter.patientAppearance).toEqual(actor.appearance);expect(encounter.patientLocation).toEqual(actor.location);
 expect(encounter.consult?.serviceOperationId).toBe(sourceId);expect(source.consultEncounterId).toBe(encounter.id);
 const frozen=structuredClone(encounter.frozenCase),admitted=state;
 // Preserve the actual final source-admission tick for the journal witness.
 const admissionParent=lastBefore,admissionTick=lastCommand!;
 state=structuredClone(state);state.nextRoutineArrivalTick=Number.MAX_SAFE_INTEGER;state.serviceAppointmentsEnabled=false;
 return {state,context,sourceId,encounterId:encounter.id,frozen,admissionParent,admissionTick,admitted,line};
}
async function rig(state:GameState){
 const clock=new TestCloudClock(),cache=new MemoryCloudCache(),entryStore=new MemoryCloudEntryStore();
 const scope={backendId:"n4.acceptance",accountId:"account-a",campaignId:state.campaignId};
 const server=new FakeCloudServer(clock.wallNow);server.setAccess(scope.accountId,{snapshotSaves:true});
 const copy=await snapshotCopy(state,codecTestCampaign(JSON.stringify(state)),"71",clock.wall,{branchId:"n4.before",sequence:400,parents:[]});
 expect(copy.saveFormat).toBe(3);server.seed(scope.accountId,copy);
 const runtime={...scope,region:"test",cache,entryStore,transport:server.transport(scope.accountId)};
 return {scope,clock,cache,copy,runtime,open:()=>openAutomaticCloudCampaign({runtime,campaignId:scope.campaignId,clock})};
}
async function finish(session:CloudGameSession,frozen:Frozen,encounterId:string,sourceId:string){
 const n=frozen.decisionNodes[0]!,conceptId=n.primaryConceptId,old=structuredClone(session.state.learningHistories[conceptId]!.reviews);
 const execute=(cmd:GameCommand)=>{const next=session.execute(cmd,current);expect(next).not.toBeNull();expect(next!.operationReceipts[cmd.operationId]).toMatchObject({status:"applied"});expect(session.syncView.failure).toBeNull();return next!;};
 expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
 expect(session.state.serviceOperations.find(o=>o.id===sourceId)!.consultEncounterId).toBe(encounterId);
 execute({type:"OPEN_CHART",operationId:"n4.ship.open",encounterId});
 let q=getCurrentQuestion(session.state,encounterId,current);
 for(let tick=0;tick<240&&!q;tick++){execute({type:"ADVANCE_TICK",operationId:"n4.ship.ready."+tick,advancedAtRealMs:session.state.createdAtRealMs});q=getCurrentQuestion(session.state,encounterId,current);}
 expect(q,"Actual frozen source question remains answerable").not.toBeNull();
 expect(q!.node.questionVariantId).toBe(n.questionVariantId);expect(q!.node.primaryConceptId).toBe(conceptId);expect(q!.node.answerChoices).toEqual(n.answerChoices);
 const classification=timings.find(t=>t.questionVariantId===n.questionVariantId)!.classification;
 for(const choice of q!.node.answerChoices){const preview=getAnswerChoiceServicePreview(session.state,encounterId,choice.id,current);
  if(classification.kind==="no_test"){expect(preview).toBeNull();continue;}
  const expected=classification.choices.find(c=>c.choiceId===choice.id)!.timing;
  if(expected.kind==="test"){
   expect(preview?.kind).toBe("test");expect(preview!.timingProfileId).toBe(expected.timingProfileId);expect(preview!.durationTicks).toBeGreaterThan(0);
   expect(preview!.diagnosticTiming).not.toBeNull();expect(preview!.diagnosticTiming!.execution).toBe("preview_only");
  }else{expect(preview?.kind).toBe("no_test");expect(preview!.durationTicks).toBeNull();}}
 const key=q!.node.answerChoices.find(a=>a.isCorrect)!;
 const cmd:GameCommand={type:"SUBMIT_ANSWER",operationId:"n4.ship.score",encounterId,decisionNodeId:n.id,answerChoiceId:key.id,reviewedAtMs:session.state.createdAtRealMs+session.state.facilityTick*1000};
 execute(cmd);const history=session.state.learningHistories[conceptId]!;
 expect(history.reviews.slice(0,-1)).toEqual(old);expect(history.reviews).toHaveLength(old.length+1);
 expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:conceptId,questionVariantId:n.questionVariantId,answerChoiceId:key.id,correct:true});
 expect(execute(cmd).learningHistories[conceptId]!.reviews).toEqual(history.reviews);
 if(session.state.encounters[encounterId]!.steps[0]?.status==="feedback_pending")execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK",operationId:"n4.ship.feedback",encounterId,decisionNodeId:n.id});
 expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
 execute({type:"CLOSE_CHART",operationId:"n4.ship.close",encounterId});
 expect(session.state.encounters[encounterId]!.consult!.closedAtFacilityTick).not.toBeNull();
 expect(session.canExecute).toBe(true);expect(session.needsReload).toBe(false);expect(await session.durable()).toBe(true);
}
describe("N4 exact default source admission and frozen format3 identity",()=>{
 it.each(cases)("admits $id from a real source, reopens and completes the exact frozen question",async cs=>{
  const f=sourceFixture(cs),r=await rig(f.state);let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
   await finish(session,f.frozen,f.encounterId,f.sourceId);const done=session.state;session.dispose();
   session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
   expect(session.state).toEqual(done);expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
  }finally{session.dispose();}
 });
 it("replays a committed source-admission journal without reselecting from the full1151-case default",async()=>{
  const cs=cases.find(c=>c.id.includes("colonic-wall"))!,f=sourceFixture(cs),r=await rig(f.admissionParent);
  const coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
  expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
  const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"71",expectedCampaignId:f.admissionParent.campaignId,expectedBaselineId:r.copy.baselineId});
  const key=cloudCampaignStorageKey(r.scope),owner="n4.previous-writer";
  const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,confirmed:r.copy,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration,
   snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
  const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
  const committed=applyGameEvidenceCommand(loaded.checkpoint,f.admissionTick,f.context);
  expect(committed.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
  drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
  expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();
  expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
  const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
  try{expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
   expect(session.state.serviceOperations.find(o=>o.id===f.sourceId)!.consultEncounterId).toBe(f.encounterId);
   await finish(session,f.frozen,f.encounterId,f.sourceId);
   expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
  }finally{session.dispose();}
 });
});
