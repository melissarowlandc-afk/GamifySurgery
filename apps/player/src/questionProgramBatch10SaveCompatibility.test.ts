import {describe, expect, it} from "vitest";
import {
  QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES as cases,
  ANSWER_CHOICE_TIMING_REGISTRY as allTimings, type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT as current, gameReducer, getCurrentQuestion, getAnswerChoiceServicePreview,
  applyFsrsReview, createNewFsrsCard, applyGameEvidenceCommand, gameEvidenceDelta,
  type GameState, type GameCommand,
} from "@gamify-surgery/game-domain";
import {createPediatricAppointmentsQaState} from "../../../tests/fixtures/pediatric-appointments";
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
import {bindJournal, prepareJournal} from "./session/cloud/journalCodec";
import {snapshotCopy} from "./session/cloud/snapshotCodec";
import {TestCloudClock} from "./session/cloud/syncTestSupport";


import {engProcedureClinic,advanceEngProcedure,openEngConsult} from "../../../packages/game-domain/tests/eng-i01-live-procedure.fixture";
const now=1_800_000_000_000;
type Frozen=GameState["encounters"][string]["frozenCase"];
function prepared(c:SyntheticClinicalCase){
  expect(current.clinicalRelease.cases.find(x=>x.id===c.id)).toEqual(c);
  let state:GameState,encounterId:string;
  if(c.procedureContext?.mode==="live"){
    const f=engProcedureClinic(c.procedureContext.kind,structuredClone(c));
    const opened=openEngConsult(advanceEngProcedure(f.state,f.context,f.id),f.context,f.id);
    state=opened.state;encounterId=opened.encounterId;
  }else{
    state=c.pediatricProfile?createPediatricAppointmentsQaState(current,1):createLevelFourRoomsQaState(current);
    encounterId="encounter.batch10.record";
    const cmd:GameCommand={type:"ADMIT_PATIENT",operationId:"batch10.record",encounterId,caseId:c.id,
      patientDisplayName:c.patientDisplayName,arrivalClass:"routine"};
    state=gameReducer(state,cmd,current);expect(state.operationReceipts[cmd.operationId]!.status).toBe("applied");
  }
  Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:false});
  const frozen=state.encounters[encounterId]!.frozenCase;
  for(const n of frozen.decisionNodes){
    const old=applyFsrsReview(createNewFsrsCard(0),"Good",1000,current.balanceRelease.learning);
    state.learningHistories[n.primaryConceptId]={conceptId:n.primaryConceptId,card:old.card,reviews:[{
      id:"review.batch10.prior."+n.id,encounterId:"encounter.batch10.prior",decisionNodeId:n.id,questionVariantId:n.questionVariantId,
      patientPresentationVariantId:frozen.patientPresentationVariantId,primaryConceptId:n.primaryConceptId,
      answerChoiceId:n.answerChoices.find(a=>a.isCorrect)!.id,correct:true,rating:"Good",reviewedAtMs:1000,facilityTick:0,schedulerLog:old.log,
    }]};
  }
  return {state,encounterId,frozen:structuredClone(frozen)};
}
async function rig(state: GameState) {
  const clock = new TestCloudClock();
  const cache = new MemoryCloudCache();
  const entryStore = new MemoryCloudEntryStore();
  const scope = {backendId:"batch10.acceptance", accountId:"account-a", campaignId:state.campaignId};
  const server = new FakeCloudServer(clock.wallNow);
  server.setAccess(scope.accountId, {snapshotSaves:true});
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "91", clock.wall,
    {branchId:"batch10.before", sequence:400, parents:[]});
  expect(copy.saveFormat).toBe(3);
  server.seed(scope.accountId, copy);
  const runtime = {...scope, region:"test", cache, entryStore, transport:server.transport(scope.accountId)};
  return {scope, clock, cache, copy, runtime, open:() => openAutomaticCloudCampaign({runtime, campaignId:scope.campaignId, clock})};
}

function preservedHistories(actual: GameState, old: GameState) {
  for (const [id, history] of Object.entries(old.learningHistories)) expect(actual.learningHistories[id], id).toEqual(history);
  for (const [id, history] of Object.entries(actual.learningHistories))
    if (!old.learningHistories[id]) expect(history.reviews, id).toEqual([]);
}

async function finish(session: CloudGameSession, frozen: Frozen, encounterId: string) {
  const histories = structuredClone(session.state.learningHistories);
  const execute = (command: GameCommand) => {
    const next = session.execute(command, current);
    expect(next, command.operationId).not.toBeNull();
    expect(next!.operationReceipts[command.operationId], command.operationId).toMatchObject({status:"applied"});
    expect(session.syncView.failure).toBeNull();
    return next!;
  };
  for (let index = 0; index < frozen.decisionNodes.length; index++) {
    // Honor the actual pending service clock before measuring the existing
    // physical answer-readiness bound. Some retained external routes are300
    // minutes; they cannot be assessed with a240-minute travel budget.
    const pending = session.state.encounters[encounterId]!.pendingResult;
    if (pending && pending.dueTick > session.state.facilityTick) {
      const dueTick=pending.dueTick;
      const start=session.state.facilityTick;
      for(let elapsed=0;elapsed<dueTick-start;elapsed++) {
        execute({type:"ADVANCE_TICK",operationId:`batch10.service.${index}.${elapsed}`,advancedAtRealMs:now});
        if(elapsed%32===31)expect(await session.durable()).toBe(true);
      }
      expect(session.state.facilityTick).toBe(dueTick);
    }
    let question = getCurrentQuestion(session.state, encounterId, current);
    for (let tick = 0; tick < 240 && !question; tick++) {
      execute({type:"ADVANCE_TICK", operationId:`batch10.tick.${index}.${tick}`, advancedAtRealMs:now});
      const encounter = session.state.encounters[encounterId]!;
      if (session.state.openChartEncounterId !== encounterId && encounter.checkInStatus === "checked_in" && !encounter.patientMovement)
        execute({type:"OPEN_CHART", operationId:`batch10.open.${index}.${tick}`, encounterId});
      if (tick % 32 === 31) expect(await session.durable()).toBe(true);
      question = getCurrentQuestion(session.state, encounterId, current);
    }
    expect(question, "Frozen node reaches the existing240-tick readiness bound: "+JSON.stringify({
      tick:session.state.facilityTick,encounter:session.state.encounters[encounterId],
    })).not.toBeNull();
    const node = frozen.decisionNodes[index]!;
    expect(question!.node).toEqual(node);
    const classification = allTimings.find(entry => entry.caseId===frozen.id && entry.nodeId===node.id && entry.questionVariantId === node.questionVariantId)?.classification;
    if (classification) for (const choice of node.answerChoices) {
      const preview = getAnswerChoiceServicePreview(session.state, encounterId, choice.id, current);
      if (classification.kind === "no_test") {
        expect(preview).toBeNull();
        continue;
      }
      const expected = classification.choices.find(record => record.choiceId === choice.id)!.timing;
      if (expected.kind === "test") {
        expect(preview?.kind).toBe("test");
        expect(preview!.timingProfileId).toBe(expected.timingProfileId);
        expect(preview!.durationTicks).toBeGreaterThan(0);
      } else {
        expect(preview?.kind).toBe("no_test");
        expect(preview!.durationTicks).toBeNull();
      }
    }
    const answer: GameCommand = {
      type:"SUBMIT_ANSWER", operationId:`batch10.score.${index}`, encounterId, decisionNodeId:node.id,
      answerChoiceId:node.answerChoices.find(choice => choice.isCorrect)!.id, reviewedAtMs:now + index,
    };
    execute(answer);
    const history = session.state.learningHistories[node.primaryConceptId]!;
    const prior = histories[node.primaryConceptId]?.reviews ?? [];
    expect(history.reviews.slice(0,-1)).toEqual(prior);
    expect(history.reviews).toHaveLength(prior.length + 1);
    expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:node.primaryConceptId, questionVariantId:node.questionVariantId, correct:true});
    expect(execute(answer).learningHistories[node.primaryConceptId]).toEqual(history);
    if (index < frozen.decisionNodes.length - 1)
      execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK", operationId:`batch10.ack.${index}`, encounterId, decisionNodeId:node.id});
  }
  for (const [id, history] of Object.entries(histories))
    if (!frozen.decisionNodes.some(node => node.primaryConceptId === id)) expect(session.state.learningHistories[id]).toEqual(history);
  expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  expect(session.state.encounters[encounterId]!.answers).toHaveLength(frozen.decisionNodes.length);
  expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");
  expect(session.canExecute).toBe(true);
  expect(session.needsReload).toBe(false);
  expect(await session.durable()).toBe(true);
}


describe("batch10 actual default admission, format3 saves, journal and stable FSRS",()=>{
  it.each(cases)("reopens and completes the exact format3 frozen encounter for $id",async c=>{
    const f=prepared(c),r=await rig(f.state);
    let session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
    try{
      expect(r.copy.saveFormat).toBe(3);
      expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);preservedHistories(session.state,f.state);
      const familyId=f.state.encounters[f.encounterId]!.pediatricFamilyId;
      if(familyId)expect(session.state.pediatricFamilies![familyId]).toEqual(f.state.pediatricFamilies![familyId]);
      await finish(session,f.frozen,f.encounterId);
      expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
      for(const n of f.frozen.decisionNodes)expect(session.state.learningHistories[n.primaryConceptId]!.reviews).toHaveLength(2);
      const done=session.state;session.dispose();
      session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
      expect(session.state).toEqual(done);expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);
    }finally{session.dispose();}
  });
  it.each(cases)("replays a committed frozen-encounter journal for $id without changing original question bytes",async c=>{
    const f=prepared(c),r=await rig(f.state);
    const coordinator=new CloudSyncCoordinator({...r.runtime,scope:r.scope,clock:r.clock,enabled:true});
    expect(await coordinator.open()).toBe(true);expect(await coordinator.startWriter()).toBe(true);expect(coordinator.resume()).toBe(true);
    const loaded=await loadCloudEvidenceCheckpoint({...r.copy,expectedRevision:"91",expectedCampaignId:f.state.campaignId,expectedBaselineId:r.copy.baselineId});
    const key=cloudCampaignStorageKey(r.scope),owner="batch10.previous-writer";
    const head=await bindJournal(r.cache.journal!,key,owner,{checkpoint:loaded.checkpoint,campaign:loaded.campaign,source:loaded.source,
      confirmed:r.copy,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration,
      snapshotPolicy:{lineage:{...loaded.snapshotLineage!,parents:[r.copy.snapshot.uncompressedSha256]}}},cloudCodec);
    const drain=new LocalJournalDrain(r.cache.journal!,key,owner,head.highWater,error=>{throw error;});
    const cmd:GameCommand={type:"ADVANCE_TICK",operationId:"batch10.frozen-journal",advancedAtRealMs:now};
    const committed=applyGameEvidenceCommand(loaded.checkpoint,cmd,current);expect(committed.state.operationReceipts[cmd.operationId]!.status).toBe("applied");
    drain.accept({delta:gameEvidenceDelta(loaded.checkpoint,committed.checkpoint),campaign:loaded.campaign,usageQuestions:[],writerGeneration:coordinator.journalWriterGeneration});
    expect(await drain.drain()).toBe(true);drain.stop();coordinator.dispose();expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
    const session=await CloudGameSession.create(await r.open(),undefined,undefined,{operational:false});
    try{
      expect(session.state.encounters[f.encounterId]!.frozenCase).toEqual(f.frozen);preservedHistories(session.state,committed.state);
      await finish(session,f.frozen,f.encounterId);
      expect((await prepareJournal(r.cache.journal!,key,cloudCodec,{local:true,encode:false}))!.state).toEqual(session.state);
    }finally{session.dispose();}
  });
});
