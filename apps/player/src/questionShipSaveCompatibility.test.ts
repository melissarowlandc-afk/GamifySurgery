import {QUESTION_SHIP_MANIFEST} from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE, SYNTHETIC_CLINICAL_RELEASE, QUESTION_FLAGS3_RETAINED_INPUT, QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE,QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE } from "@gamify-surgery/clinical-content";
import { applyFsrsReview, applyGameEvidenceCommand, createNewFsrsCard, gameEvidenceDelta,
  gameReducer, getCurrentQuestion, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import { cloudCampaignStorageKey } from "./session/accountStorageKey";
import { LocalJournalDrain } from "./session/localJournal";
import { MemoryCloudCache } from "./session/cloud/cache";
import { MemoryCloudEntryStore } from "./session/cloud/entryStorage";
import { FakeCloudServer } from "./session/cloud/fakeTransport";
import { CloudGameSession } from "./session/cloud/gameSession";
import { CloudSyncCoordinator } from "./session/cloud/coordinator";
import { openAutomaticCloudCampaign } from "./session/cloud/automaticResolution";
import { loadCloudEvidenceCheckpoint } from "./session/cloud/codecEvidence";
import { codecTestCampaign } from "./session/cloud/codecTestSupport";
import { cloudCodec } from "./session/cloud/codecWorker";
import { bindJournal, prepareJournal } from "./session/cloud/journalCodec";
import { snapshotCopy } from "./session/cloud/snapshotCodec";
import { TestCloudClock } from "./session/cloud/syncTestSupport";

const current = createLevelFourRoomsQaContext();
const preGate: DomainContext = { ...current, clinicalRelease: QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE };
// Exact flagged live definitions, retained independently of fresh projection.
const beforeFlags3: DomainContext = {...current, clinicalRelease: {...current.clinicalRelease,
  cases: current.clinicalRelease.cases.map(cs => QUESTION_FLAGS3_RETAINED_INPUT.cases.find(old => old.id === cs.id) ?? cs)}};
const historicalContext = (caseId: string) => QUESTION_FLAGS3_RETAINED_INPUT.cases.some(cs => cs.id === caseId) ? beforeFlags3 : preGate;
const NOW = 1_800_000_000_000, encounterId = "encounter.ship-save";
const examples = [
  ["excluded", "case.n1.incidental-t1b.v1"],
  ["replaced", "case.n2.sglt2-postoperative-restart.v1"],
  ["whole-case breast", "case.gs028c.palpable-breast.paired-dense-focal"],
  ["whole-case calcium", "case.asymptomatic-phpt.incidental-calcium"],
  ["flags3 statistics", "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed"],
  ["flags3 dysphagia", "case.achalasia.night-regurgitation"],
  ["flags3 hernia", "case.inguinal-hernia.caregiving-strain"],
] as const;

function fixture(caseId: string, clinicalContext: DomainContext = historicalContext(caseId)) {
  const cs = clinicalContext.clinicalRelease.cases.find(cs => cs.id === caseId)!;
  const conceptId = cs.decisionNodes[0]!.primaryConceptId;
  let state = createLevelFourRoomsQaState(clinicalContext);
  state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  const apply = (command: GameCommand) => {
    state = gameReducer(state, command, clinicalContext);
    expect(state.operationReceipts[command.operationId]).toMatchObject({ status: "applied" });
  };
  apply({ type: "PLACE_ROOM", operationId: "ship-save.exam", roomDefinitionId: "room.examination", roomId: "room.ship-save.exam", x: 35, y: 24, orientation: 0 });
  apply({ type: "PLACE_DOOR", operationId: "ship-save.door", roomId: "room.ship-save.exam", doorId: "door.ship-save.exam", side: "south", offset: 1 });
  const previous = applyFsrsReview(createNewFsrsCard(0), "Good", 1000, clinicalContext.balanceRelease.learning);
  state.learningHistories[conceptId] = { conceptId, card: previous.card, reviews: [{
    id: "review.ship-save.previous", encounterId: "encounter.ship-save.previous", decisionNodeId: cs.decisionNodes[0]!.id,
    questionVariantId: cs.decisionNodes[0]!.questionVariantId, patientPresentationVariantId: cs.patientPresentationVariantId,
    primaryConceptId: conceptId, answerChoiceId: cs.decisionNodes[0]!.answerChoices.find(choice => choice.isCorrect)!.id,
    correct: true, rating: "Good", reviewedAtMs: 1000, facilityTick: 0, schedulerLog: previous.log,
  }] };
  const admission: GameCommand = { type: "ADMIT_PATIENT", operationId: "ship-save.admit", encounterId,
    caseId, patientDisplayName: cs.patientDisplayName, arrivalClass: "routine" };
  return { state, cs, conceptId, admission };
}

function ready(state: GameState): boolean {
  const encounter = state.encounters[encounterId];
  // A no-gate classification/plan pair stays in its examination room. Existing
  // result-gated encounters still return to the founder desk after that gate.
  const returnedFromResult = encounter?.frozenCase.decisionNodes.slice(0,encounter.currentNodeIndex).some(n=>n.resultGateAfter);
  return !!encounter && state.openChartEncounterId === encounterId &&
    encounter.assignedRoomInstanceId === (returnedFromResult?"room.instance.founder_desk":"room.ship-save.exam") && !encounter.patientMovement &&
    getCurrentQuestion(state, encounterId, current) !== null;
}
async function advanceToQuestion(read: () => GameState, execute: (command: GameCommand) => GameState, prefix: string, durable?:()=>Promise<boolean>) {
  for (let tick = 0; tick < 240; tick++) {
    if (ready(read())) return;
    execute({ type: "ADVANCE_TICK", operationId: `${prefix}.tick.${tick}`, advancedAtRealMs: NOW });
    const encounter = read().encounters[encounterId]!;
    if (read().openChartEncounterId !== encounterId && encounter.checkInStatus === "checked_in" && !encounter.patientMovement)
      execute({ type: "OPEN_CHART", operationId: `${prefix}.open.${tick}`, encounterId });
    // Real result waits span many commands. Let the actual journal drain at a
    // bounded cadence instead of overrunning its existing backpressure limit.
    if(durable&&tick%32===31)expect(await durable()).toBe(true);
  }
  const state=read(),encounter=state.encounters[encounterId]!;
  throw new Error("Historical encounter did not reach its ordinary answer step: "+JSON.stringify({tick:state.facilityTick,paused:state.paused,
    lifecycle:encounter.lifecycle,pendingResult:encounter.pendingResult?{dueTick:encounter.pendingResult.dueTick,deliveredAtTick:encounter.pendingResult.deliveredAtTick}:null,movement:encounter.patientMovement?.kind,steps:encounter.steps.map(s=>s.status),
    room:encounter.assignedRoomInstanceId,openChart:state.openChartEncounterId}));
}
async function rig(state: GameState) {
  const clock = new TestCloudClock(), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const scope = { backendId: "ship-save-test", accountId: "account-a", campaignId: state.campaignId };
  const server = new FakeCloudServer(clock.wallNow); server.setAccess(scope.accountId, { snapshotSaves: true });
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "57", clock.wall,
    { branchId: "pre-gate.release", sequence: 400, parents: [] });
  expect(copy.saveFormat).toBe(3);
  server.seed(scope.accountId, copy);
  const runtime = { ...scope, region: "test", cache, entryStore, transport: server.transport(scope.accountId) };
  const open = () => openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock });
  return { scope, runtime, clock, cache, server, copy, open };
}
async function finish(session: CloudGameSession, conceptId: string, frozen: GameState["encounters"][string]["frozenCase"]) {
  const execute = (command: GameCommand) => {
    const state = session.execute(command, current);
    expect(state, command.operationId).not.toBeNull();
    expect(state!.operationReceipts[command.operationId]).toMatchObject({ status: "applied" });
    expect(session.syncView.failure).toBeNull();
    return state!;
  };
  expect(frozen.decisionNodes.some(n=>n.primaryConceptId===conceptId)).toBe(true);
  const previous = structuredClone(session.state.learningHistories);
  for(let index=0;index<frozen.decisionNodes.length;index++){
    await advanceToQuestion(() => session.state, execute, `ship-save.current.${index}`,()=>session.durable());
    const question = getCurrentQuestion(session.state, encounterId, current)!;
    expect(question.node.questionVariantId).toBe(frozen.decisionNodes[index]!.questionVariantId);
    const answer: GameCommand = { type: "SUBMIT_ANSWER", operationId: `ship-save.score.${index}`, encounterId,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id, reviewedAtMs: NOW+index };
    execute(answer);
    const history=session.state.learningHistories[question.node.primaryConceptId]!;
    const earlier=previous[question.node.primaryConceptId]?.reviews??[];
    expect(history.reviews.slice(0,-1)).toEqual(earlier);
    expect(history.reviews.at(-1)).toMatchObject({primaryConceptId:question.node.primaryConceptId,questionVariantId:frozen.decisionNodes[index]!.questionVariantId,correct:true});
    expect(history.reviews).toHaveLength(earlier.length+1);
    expect(session.execute(answer,current)!.learningHistories[question.node.primaryConceptId]!.reviews).toHaveLength(history.reviews.length);
    if(index<frozen.decisionNodes.length-1)
      execute({type:"ACKNOWLEDGE_DECISION_FEEDBACK",operationId:`ship-save.feedback.${index}`,encounterId,decisionNodeId:question.node.id});
  }
  expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  expect(session.state.encounters[encounterId]!.answers).toHaveLength(frozen.decisionNodes.length);
  expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");
  for(const node of current.clinicalRelease.cases.find(c=>c.id===frozen.id)?.decisionNodes??[]){
    if(!frozen.decisionNodes.some(old=>old.primaryConceptId===node.primaryConceptId))
      expect(session.state.learningHistories[node.primaryConceptId]).toEqual(previous[node.primaryConceptId]);
  }
  expect(session.canExecute).toBe(true); expect(session.needsReload).toBe(false);
  expect(await session.durable()).toBe(true);
}

describe("pre-gate questions survive projection-only shipping", () => {
  it.each(SYNTHETIC_CLINICAL_RELEASE.cases.filter(cs=>cs.id.startsWith("case.n3.")).map(cs=>[cs.id] as const))
  ("admits accepted N3 %s from the default and completes its exact format-three frozen save", async caseId=>{
    const example=fixture(caseId,current);
    const state=gameReducer(example.state,example.admission,current);
    expect(state.operationReceipts[example.admission.operationId]).toMatchObject({status:"applied"});
    const frozen=structuredClone(state.encounters[encounterId]!.frozenCase);
    expect(frozen.decisionNodes).toHaveLength(1);
    expect(frozen.decisionNodes[0]!.questionVariantId).toBe(QUESTION_SHIP_MANIFEST.accepted.find(row=>row.caseId===caseId&&row.nodeId===frozen.decisionNodes[0]!.id)!.questionVariantId);
    const authored=current.clinicalRelease.cases.find(cs=>cs.id===caseId)!.decisionNodes[0]!;
    expect(frozen.decisionNodes[0]).toMatchObject({id:authored.id,questionVariantId:authored.questionVariantId,primaryConceptId:authored.primaryConceptId});
    const orderedChoices=(choices:typeof authored.answerChoices)=>[...choices].sort((a,b)=>a.id.localeCompare(b.id));
    expect(orderedChoices(frozen.decisionNodes[0]!.answerChoices)).toEqual(orderedChoices(authored.answerChoices));
    expect(frozen.decisionNodes[0]!.stem).toBe(authored.stem.split("{patientName}").join(state.encounters[encounterId]!.patientDisplayName));
    expect(state.learningHistories).toEqual(example.state.learningHistories);
    const f=await rig(state);
    let session=await CloudGameSession.create(await f.open(),undefined,undefined,{operational:false});
    try{
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      expect(session.state.learningHistories).toEqual(state.learningHistories);
      await finish(session,example.conceptId,frozen);
      const completed=session.state;session.dispose();
      session=await CloudGameSession.create(await f.open(),undefined,undefined,{operational:false});
      expect(session.state).toEqual(completed);expect(session.canExecute).toBe(true);
      expect(session.state.learningHistories[example.conceptId]!.reviews.at(-1)).toMatchObject({
        questionVariantId:frozen.decisionNodes[0]!.questionVariantId,primaryConceptId:example.conceptId,correct:true,
      });
    }finally{session.dispose();}
  });
  it.each(QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE.cases.map(cs=>[cs.id] as const))
  ("admits accepted flags3 %s, then reopens and completes its exact frozen format-three save",async caseId=>{
    const old=fixture(caseId,beforeFlags3),previous=structuredClone(old.state.learningHistories);
    const admitted=gameReducer(old.state,old.admission,current);
    expect(admitted.operationReceipts[old.admission.operationId]).toMatchObject({status:"applied"});
    expect(admitted.learningHistories).toEqual(previous);
    const frozen=structuredClone(admitted.encounters[encounterId]!.frozenCase);
    // Stats1 intentionally supersedes only the old flags3 statistics row.
    // The other two flags3 cases stay exact; old frozen flags3 inputs remain below.
    const source=QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE.cases.find(cs=>cs.id===caseId)??QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE.cases.find(cs=>cs.id===caseId)!;
    expect(frozen.decisionNodes.map(n=>[n.id,n.questionVariantId,n.primaryConceptId])).toEqual(source.decisionNodes.map(n=>[n.id,n.questionVariantId,n.primaryConceptId]));
    for(const [index,node] of frozen.decisionNodes.entries()){
      const original=source.decisionNodes[index]!;
      const ordered=(choices:typeof node.answerChoices)=>[...choices].sort((a,b)=>a.id.localeCompare(b.id));
      expect(ordered(node.answerChoices)).toEqual(ordered(original.answerChoices));
      expect(node.stem).toBe(original.stem.replaceAll("{patientName}",admitted.encounters[encounterId]!.patientDisplayName));
    }
    const f=await rig(admitted);
    let session=await CloudGameSession.create(await f.open(),undefined,undefined,{operational:false});
    try{
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      expect(session.state.learningHistories).toEqual(previous);
      await finish(session,frozen.decisionNodes[0]!.primaryConceptId,frozen);
      for(const id of Object.keys(previous))if(!frozen.decisionNodes.some(n=>n.primaryConceptId===id))expect(session.state.learningHistories[id]).toEqual(previous[id]);
      const completed=session.state;session.dispose();
      session=await CloudGameSession.create(await f.open(),undefined,undefined,{operational:false});
      expect(session.state).toEqual(completed);expect(session.canExecute).toBe(true);
    }finally{session.dispose();}
  });
  it.each(examples.filter(([kind])=>kind.startsWith("whole-case")))("admits the fresh %s replacement without changing its legacy history",(_kind,caseId)=>{
    const old=fixture(caseId),history=structuredClone(old.state.learningHistories[old.conceptId]);
    const admitted=gameReducer(old.state,old.admission,current);
    expect(admitted.operationReceipts[old.admission.operationId]).toMatchObject({status:"applied"});
    expect(admitted.encounters[encounterId]!.frozenCase.decisionNodes).toHaveLength(1);
    expect(admitted.encounters[encounterId]!.frozenCase.decisionNodes[0]!.questionVariantId)
      .toBe(current.clinicalRelease.cases.find(c=>c.id===caseId)!.decisionNodes[0]!.questionVariantId);
    expect(admitted.learningHistories[old.conceptId]).toEqual(history);
  });
  for (const [kind, caseId] of examples) for (const phase of ["waiting", "in-progress"] as const) {
    it(`reopens format-three ${phase} ${kind} content without reset and scores its frozen concept`, async () => {
      const oldContext = historicalContext(caseId), old = fixture(caseId,oldContext);
      let state = gameReducer(old.state, old.admission, oldContext);
      expect(state.operationReceipts[old.admission.operationId]).toMatchObject({ status: "applied" });
      if (kind === "excluded") expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(cs => cs.id === caseId)).toBe(false);
      else expect(SYNTHETIC_CLINICAL_RELEASE.cases.find(cs => cs.id === caseId)!.decisionNodes.map(n=>n.questionVariantId)).not.toEqual(old.cs.decisionNodes.map(n=>n.questionVariantId));
      if (phase === "in-progress") await advanceToQuestion(() => state, command => state = gameReducer(state, command, oldContext), "ship-save.old");
      else expect(state.encounters[encounterId]!.lifecycle).toBe("waiting_unopened");
      const frozen = structuredClone(state.encounters[encounterId]!.frozenCase), before = structuredClone(state);
      const f = await rig(state);
      let session = await CloudGameSession.create(await f.open(), undefined, undefined, { operational: false });
      try {
        expect(session.state.campaignId).toBe(before.campaignId); expect(session.state.facilityLevel).toBe(4);
        expect(session.state.encounters).toEqual(before.encounters);
        for (const [id, history] of Object.entries(before.learningHistories)) expect(session.state.learningHistories[id]).toEqual(history);
        await finish(session, old.conceptId, frozen);
        const completed = session.state; session.dispose();
        session = await CloudGameSession.create(await f.open(), undefined, undefined, { operational: false });
        expect(session.state).toEqual(completed); expect(session.canExecute).toBe(true);
        expect(await f.runtime.transport.list()).toHaveLength(1);
      } finally { session.dispose(); }
    });
  }
  it.each(examples)("replays a committed pre-gate admission of %s content from the local journal without reselecting it", async (_kind, caseId) => {
    const oldContext = historicalContext(caseId), old = fixture(caseId,oldContext), f = await rig(old.state);
    const coordinator = new CloudSyncCoordinator({ ...f.runtime, scope: f.scope, clock: f.clock, enabled: true });
    expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
    const loaded = await loadCloudEvidenceCheckpoint({ ...f.copy, expectedRevision: "57", expectedCampaignId: old.state.campaignId, expectedBaselineId: f.copy.baselineId });
    const key = cloudCampaignStorageKey(f.scope), owner = "pre-gate.writer";
    const head = await bindJournal(f.cache.journal!, key, owner, { checkpoint: loaded.checkpoint, campaign: loaded.campaign, source: loaded.source,
      confirmed: f.copy, usageQuestions: [], writerGeneration: coordinator.journalWriterGeneration,
      snapshotPolicy: { lineage: { ...loaded.snapshotLineage!, parents: [f.copy.snapshot.uncompressedSha256] } } }, cloudCodec);
    const drain = new LocalJournalDrain(f.cache.journal!, key, owner, head.highWater, error => { throw error; });
    const committed = applyGameEvidenceCommand(loaded.checkpoint, old.admission, oldContext);
    expect(committed.state.operationReceipts[old.admission.operationId]).toMatchObject({ status: "applied" });
    drain.accept({ delta: gameEvidenceDelta(loaded.checkpoint, committed.checkpoint), campaign: loaded.campaign, usageQuestions: [], writerGeneration: coordinator.journalWriterGeneration });
    expect(await drain.drain()).toBe(true); drain.stop(); coordinator.dispose();
    const stored = await f.cache.journal!.read(key);
    expect(stored!.rows).toHaveLength(1);
    const frozen = committed.state.encounters[encounterId]!.frozenCase;
    const session = await CloudGameSession.create(await f.open(), undefined, undefined, { operational: false });
    try {
      expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
      expect(session.state.operationReceipts[old.admission.operationId]).toEqual(committed.state.operationReceipts[old.admission.operationId]);
      expect(session.state.learningHistories[old.conceptId]).toEqual(committed.state.learningHistories[old.conceptId]);
      expect(session.state.campaignId).toBe(old.state.campaignId); expect(session.syncView.failure).toBeNull();
      await finish(session, old.conceptId, frozen);
      const restored = await prepareJournal(f.cache.journal!, key, cloudCodec, { local: true, encode: false });
      expect(restored!.state).toEqual(session.state);
    } finally { session.dispose(); }
  });
});
