import {beforeProgramBatch8AcceptanceRelease} from "../../../packages/clinical-content/src/question-program-batch8-acceptance-test-support";
import {materializePatientName} from "../../../packages/game-domain/src/patientText";
import {describe, expect, it} from "vitest";
import {
  QUESTION_PROGRAM_BATCH4_ACCEPTED_CASES as cases,
  QUESTION_PROGRAM_BATCH4_RETAINED_CASES as retired,
  QUESTION_PROGRAM_BATCH4_ACCEPTED_TIMING_ENTRIES as timings,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT as activeDefault, gameReducer, getCurrentQuestion, getAnswerChoiceServicePreview,
  applyFsrsReview, createNewFsrsCard, applyGameEvidenceCommand, gameEvidenceDelta,
  type DomainContext, type GameState, type GameCommand,
  createInitialGameState,
  getCurrentCapabilities,
} from "@gamify-surgery/game-domain";
import {endoscopyReadyClinic} from "../../../packages/game-domain/tests/routine-endoscopy-ready.fixture";
import {beforeProgramBatch4AcceptanceRelease} from "../../../packages/clinical-content/src/question-program-batch4-acceptance-test-support";
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

// Exercise the exact accepted batch epoch; reopen/continue through the current
// production session. Batch8 explicitly replaces these prior question versions.
const current: DomainContext = {...activeDefault, clinicalRelease:beforeProgramBatch8AcceptanceRelease(activeDefault.clinicalRelease)};
const encounterId = "encounter.topic4.acceptance";
const now = 1_800_000_000_000;
const previous: DomainContext = {...current, clinicalRelease:beforeProgramBatch4AcceptanceRelease(current.clinicalRelease)};
type Frozen = GameState["encounters"][string]["frozenCase"];

function apply(state: GameState, command: GameCommand, context: DomainContext) {
  const next = gameReducer(state, command, context);
  expect(next.operationReceipts[command.operationId], command.operationId+": "+next.operationReceipts[command.operationId]?.message).toMatchObject({status:"applied"});
  return next;
}

function fixture(clinicalCase: SyntheticClinicalCase, context = current) {
  let state = createLevelFourRoomsQaState(context);
  const commands: GameCommand[] = [
    {type:"PLACE_ROOM", operationId:"topic4.exam", roomDefinitionId:"room.examination", roomId:"room.topic4.exam", x:35, y:24, orientation:0},
    {type:"PLACE_DOOR", operationId:"topic4.door", roomId:"room.topic4.exam", doorId:"door.topic4.exam", side:"south", offset:1},
  ];
  for (const command of commands) state = apply(state, command, context);
  if (clinicalCase.requiredCapabilityIds.includes("capability.minor_procedure")) {
    state = apply(state,{type:"PLACE_ROOM",operationId:"topic4.minor",roomDefinitionId:"room.minor_procedure",roomId:"room.topic4.minor",x:40,y:23,orientation:0},context);
    state = apply(state,{type:"PLACE_DOOR",operationId:"topic4.minor.door",roomId:"room.topic4.minor",doorId:"door.topic4.minor",side:"south",offset:1},context);
  }
  if (clinicalCase.requiredCapabilityIds.includes("capability.endoscopy")) {
    // The retired source requires a real staffed onsite service. Preserve that
    // requirement using the existing procedural fixture, not a capability stub.
    const clinic=endoscopyReadyClinic({appointments:false,provider:true},createInitialGameState(context));
    clinic.advance(60);
    state=clinic.state;
    state.facilityLevel=4;
    expect(getCurrentCapabilities(state,context).has("capability.endoscopy")).toBe(true);
  }
  Object.assign(state, {
    paused:false, nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER, nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick:Number.MAX_SAFE_INTEGER, serviceAppointmentsEnabled:false,
  });
  if (retired.some(old => old.id === clinicalCase.id)) {
    for (const node of clinicalCase.decisionNodes) {
      const earlier = applyFsrsReview(createNewFsrsCard(0), "Good", 1000, context.balanceRelease.learning);
      state.learningHistories[node.primaryConceptId] = {
        conceptId:node.primaryConceptId, card:earlier.card,
        reviews:[{
          id:"review.topic4.previous." + node.id, encounterId:"encounter.topic4.previous", decisionNodeId:node.id,
          questionVariantId:node.questionVariantId, patientPresentationVariantId:clinicalCase.patientPresentationVariantId,
          primaryConceptId:node.primaryConceptId, answerChoiceId:node.answerChoices.find(choice => choice.isCorrect)!.id,
          correct:true, rating:"Good", reviewedAtMs:1000, facilityTick:0, schedulerLog:earlier.log,
        }],
      };
    }
  }
  const admission: GameCommand = {
    type:"ADMIT_PATIENT", operationId:"topic4.admit", encounterId, caseId:clinicalCase.id,
    patientDisplayName:retired.some(old=>old.id===clinicalCase.id)&&!clinicalCase.patientDisplayName.includes("{patientName}")
      ?clinicalCase.patientDisplayName:clinicalCase.prototypeDemographics?.sexLabel==="Female"?"Mira Vale":"Miles Vale",
    arrivalClass:"routine",
  };
  return {state, admission};
}

async function rig(state: GameState) {
  const clock = new TestCloudClock();
  const cache = new MemoryCloudCache();
  const entryStore = new MemoryCloudEntryStore();
  const scope = {backendId:"topic4.acceptance", accountId:"account-a", campaignId:state.campaignId};
  const server = new FakeCloudServer(clock.wallNow);
  server.setAccess(scope.accountId, {snapshotSaves:true});
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "91", clock.wall,
    {branchId:"topic4.before", sequence:400, parents:[]});
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

async function finish(session: CloudGameSession, frozen: Frozen) {
  // Load and continue historical frozen bytes against the actual current default.
  const histories = structuredClone(session.state.learningHistories);
  const execute = (command: GameCommand) => {
    const next = session.execute(command, activeDefault);
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
        execute({type:"ADVANCE_TICK",operationId:`topic4.service.${index}.${elapsed}`,advancedAtRealMs:now});
        if(elapsed%32===31)expect(await session.durable()).toBe(true);
      }
      expect(session.state.facilityTick).toBe(dueTick);
    }
    let question = getCurrentQuestion(session.state, encounterId, activeDefault);
    for (let tick = 0; tick < 240 && !question; tick++) {
      execute({type:"ADVANCE_TICK", operationId:`topic4.tick.${index}.${tick}`, advancedAtRealMs:now});
      const encounter = session.state.encounters[encounterId]!;
      if (session.state.openChartEncounterId !== encounterId && encounter.checkInStatus === "checked_in" && !encounter.patientMovement)
        execute({type:"OPEN_CHART", operationId:`topic4.open.${index}.${tick}`, encounterId});
      if (tick % 32 === 31) expect(await session.durable()).toBe(true);
      question = getCurrentQuestion(session.state, encounterId, activeDefault);
    }
    expect(question, "Frozen node reaches the existing240-tick readiness bound: "+JSON.stringify({
      tick:session.state.facilityTick,encounter:session.state.encounters[encounterId],
    })).not.toBeNull();
    const node = frozen.decisionNodes[index]!;
    expect(question!.node).toEqual(node);
    const classification = timings.find(entry => entry.questionVariantId === node.questionVariantId)?.classification;
    if (classification) for (const choice of node.answerChoices) {
      const preview = getAnswerChoiceServicePreview(session.state, encounterId, choice.id, activeDefault);
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
      type:"SUBMIT_ANSWER", operationId:`topic4.score.${index}`, encounterId, decisionNodeId:node.id,
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
      execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK", operationId:`topic4.ack.${index}`, encounterId, decisionNodeId:node.id});
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

describe("topic batch4 exact accepted-epoch admission and all retired frozen identities", () => {
  it.each(cases.filter(cs => cs.participant?.kind !== "employee_discussion"))("admits $id and completes its exact format3 save", async clinicalCase => {
    expect(current.clinicalRelease.cases.find(cs => cs.id === clinicalCase.id)).toEqual(clinicalCase);
    const f = fixture(clinicalCase);
    const state = apply(f.state, f.admission, current);
    const frozen = structuredClone(state.encounters[encounterId]!.frozenCase);
    expect(frozen.presentation).toContain(f.admission.patientDisplayName);
    expect(state.learningHistories).toEqual(f.state.learningHistories);
    for (const node of frozen.decisionNodes) {
      const authored = materializePatientName(clinicalCase,f.admission.patientDisplayName).decisionNodes.find(original => original.id === node.id)!;
      expect([...node.answerChoices].sort((a,b) => a.id.localeCompare(b.id)))
        .toEqual([...authored.answerChoices].sort((a,b) => a.id.localeCompare(b.id)));
    }
    const r = await rig(state);
    let session = await CloudGameSession.create(await r.open(), undefined, undefined, {operational:false});
    try {
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      preservedHistories(session.state, state);
      await finish(session, frozen);
      const done = session.state;
      session.dispose();
      session = await CloudGameSession.create(await r.open(), undefined, undefined, {operational:false});
      expect(session.state).toEqual(done);
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
    } finally {
      session.dispose();
    }
  });

  it.each(retired.filter(cs=>cs.participant?.kind!=="employee_discussion"))("reopens and completes retired $id with its original questions and FSRS identities", async clinicalCase => {
    expect(current.clinicalRelease.cases.some(cs => cs.id === clinicalCase.id)).toBe(false);
    const f = fixture(clinicalCase, previous);
    expect(Object.keys(f.state.learningHistories)).toHaveLength(813);
    expect(gameReducer(f.state, f.admission, current).operationReceipts[f.admission.operationId]!.status).toBe("rejected");
    const state = apply(f.state, f.admission, previous);
    const frozen = structuredClone(state.encounters[encounterId]!.frozenCase);
    const r = await rig(state);
    const session = await CloudGameSession.create(await r.open(), undefined, undefined, {operational:false});
    try {
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      preservedHistories(session.state, state);
      await finish(session, frozen);
      for (const node of frozen.decisionNodes) expect(session.state.learningHistories[node.primaryConceptId]!.reviews).toHaveLength(2);
    } finally {
      session.dispose();
    }
  });

  it.each(retired.filter(cs=>cs.participant?.kind!=="employee_discussion"))("replays the committed original admission journal for $id", async clinicalCase => {
    const f = fixture(clinicalCase, previous);
    const r = await rig(f.state);
    const coordinator = new CloudSyncCoordinator({...r.runtime, scope:r.scope, clock:r.clock, enabled:true});
    expect(await coordinator.open()).toBe(true);
    expect(await coordinator.startWriter()).toBe(true);
    expect(coordinator.resume()).toBe(true);
    const loaded = await loadCloudEvidenceCheckpoint({...r.copy, expectedRevision:"91", expectedCampaignId:f.state.campaignId, expectedBaselineId:r.copy.baselineId});
    const key = cloudCampaignStorageKey(r.scope);
    const owner = "topic4.previous-writer";
    const head = await bindJournal(r.cache.journal!, key, owner, {
      checkpoint:loaded.checkpoint, campaign:loaded.campaign, source:loaded.source, confirmed:r.copy, usageQuestions:[],
      writerGeneration:coordinator.journalWriterGeneration,
      snapshotPolicy:{lineage:{...loaded.snapshotLineage!, parents:[r.copy.snapshot.uncompressedSha256]}},
    }, cloudCodec);
    const drain = new LocalJournalDrain(r.cache.journal!, key, owner, head.highWater, error => {throw error;});
    const committed = applyGameEvidenceCommand(loaded.checkpoint, f.admission, previous);
    expect(committed.state.operationReceipts[f.admission.operationId]).toMatchObject({status:"applied"});
    const frozen = committed.state.encounters[encounterId]!.frozenCase;
    drain.accept({delta:gameEvidenceDelta(loaded.checkpoint, committed.checkpoint), campaign:loaded.campaign,
      usageQuestions:[], writerGeneration:coordinator.journalWriterGeneration});
    expect(await drain.drain()).toBe(true);
    drain.stop();
    coordinator.dispose();
    expect((await r.cache.journal!.read(key))!.rows).toHaveLength(1);
    const session = await CloudGameSession.create(await r.open(), undefined, undefined, {operational:false});
    try {
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      preservedHistories(session.state, committed.state);
      expect(session.state.operationReceipts[f.admission.operationId]).toEqual(committed.state.operationReceipts[f.admission.operationId]);
      await finish(session, frozen);
      expect((await prepareJournal(r.cache.journal!, key, cloudCodec, {local:true, encode:false}))!.state).toEqual(session.state);
    } finally {
      session.dispose();
    }
  });

  it("requires the exact batch8 successor or rejects fresh admission while preserving all prior save cases",()=>{
    const changed=cases.filter(cs=>JSON.stringify(activeDefault.clinicalRelease.cases.find(c=>c.id===cs.id))!==JSON.stringify(cs));
    expect(changed.map(cs=>cs.id)).toEqual(["case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1", "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1"]);
    for(const old of changed){
      expect(current.clinicalRelease.cases.find(cs=>cs.id===old.id)).toEqual(old);
      const fresh=activeDefault.clinicalRelease.cases.find(cs=>cs.id===old.id);
      const f=fixture(fresh??old,activeDefault);
      const next=gameReducer(f.state,f.admission,activeDefault);
      if(fresh){
        expect(fresh.decisionNodes.map(node=>node.questionVariantId)).not.toEqual(old.decisionNodes.map(node=>node.questionVariantId));
        expect(next.operationReceipts[f.admission.operationId]!.status).toBe("applied");
        expect(next.encounters[encounterId]!.frozenCase.decisionNodes.map(node=>node.questionVariantId)).toEqual(fresh.decisionNodes.map(node=>node.questionVariantId));
      }else{
        expect(next.operationReceipts[f.admission.operationId]!.status).toBe("rejected");
        expect(next.encounters[encounterId]).toBeUndefined();
      }
    }
  });
});
