import { describe, expect, it } from "vitest";
import { QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE, SYNTHETIC_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
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
const NOW = 1_800_000_000_000, encounterId = "encounter.ship-save";
const examples = [
  ["excluded", "case.n1.incidental-t1b.v1"],
  ["replaced", "case.n2.sglt2-postoperative-restart.v1"],
] as const;

function fixture(caseId: string) {
  const cs = preGate.clinicalRelease.cases.find(cs => cs.id === caseId)!;
  const conceptId = cs.decisionNodes[0]!.primaryConceptId;
  let state = createLevelFourRoomsQaState(preGate);
  state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  const apply = (command: GameCommand) => {
    state = gameReducer(state, command, preGate);
    expect(state.operationReceipts[command.operationId]).toMatchObject({ status: "applied" });
  };
  apply({ type: "PLACE_ROOM", operationId: "ship-save.exam", roomDefinitionId: "room.examination", roomId: "room.ship-save.exam", x: 35, y: 24, orientation: 0 });
  apply({ type: "PLACE_DOOR", operationId: "ship-save.door", roomId: "room.ship-save.exam", doorId: "door.ship-save.exam", side: "south", offset: 1 });
  const previous = applyFsrsReview(createNewFsrsCard(0), "Good", 1000, preGate.balanceRelease.learning);
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
  return !!encounter && state.openChartEncounterId === encounterId &&
    encounter.assignedRoomInstanceId === "room.ship-save.exam" && !encounter.patientMovement &&
    getCurrentQuestion(state, encounterId, current) !== null;
}
function advanceToQuestion(read: () => GameState, execute: (command: GameCommand) => GameState, prefix: string) {
  for (let tick = 0; tick < 240; tick++) {
    if (ready(read())) return;
    execute({ type: "ADVANCE_TICK", operationId: `${prefix}.tick.${tick}`, advancedAtRealMs: NOW });
    const encounter = read().encounters[encounterId]!;
    if (read().openChartEncounterId !== encounterId && encounter.checkInStatus === "checked_in" && !encounter.patientMovement)
      execute({ type: "OPEN_CHART", operationId: `${prefix}.open.${tick}`, encounterId });
  }
  throw new Error("Historical encounter did not reach its ordinary answer step");
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
  const previous = structuredClone(session.state.learningHistories[conceptId]!);
  advanceToQuestion(() => session.state, execute, "ship-save.current");
  const question = getCurrentQuestion(session.state, encounterId, current)!;
  expect(question.node.questionVariantId).toBe(frozen.decisionNodes[0]!.questionVariantId);
  const answer: GameCommand = { type: "SUBMIT_ANSWER", operationId: "ship-save.score", encounterId,
    decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id, reviewedAtMs: NOW };
  execute(answer);
  expect(session.state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  expect(session.state.encounters[encounterId]!.answers).toHaveLength(1);
  expect(session.state.encounters[encounterId]!.resolutionReason).toBe("completed");
  const history = session.state.learningHistories[conceptId]!;
  expect(history.reviews.slice(0, -1)).toEqual(previous.reviews);
  expect(history.reviews.at(-1)).toMatchObject({ primaryConceptId: conceptId, questionVariantId: question.node.questionVariantId, correct: true });
  expect(history.reviews).toHaveLength(previous.reviews.length + 1);
  expect(session.execute(answer, current)!.learningHistories[conceptId]!.reviews).toHaveLength(history.reviews.length);
  expect(session.canExecute).toBe(true); expect(session.needsReload).toBe(false);
  expect(await session.durable()).toBe(true);
}

describe("pre-gate questions survive projection-only shipping", () => {
  for (const [kind, caseId] of examples) for (const phase of ["waiting", "in-progress"] as const) {
    it(`reopens format-three ${phase} ${kind} content without reset and scores its frozen concept`, async () => {
      const old = fixture(caseId);
      let state = gameReducer(old.state, old.admission, preGate);
      expect(state.operationReceipts[old.admission.operationId]).toMatchObject({ status: "applied" });
      if (kind === "excluded") expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(cs => cs.id === caseId)).toBe(false);
      else expect(SYNTHETIC_CLINICAL_RELEASE.cases.find(cs => cs.id === caseId)!.decisionNodes[0]!.questionVariantId).not.toBe(old.cs.decisionNodes[0]!.questionVariantId);
      if (phase === "in-progress") advanceToQuestion(() => state, command => state = gameReducer(state, command, preGate), "ship-save.old");
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
    const old = fixture(caseId), f = await rig(old.state);
    const coordinator = new CloudSyncCoordinator({ ...f.runtime, scope: f.scope, clock: f.clock, enabled: true });
    expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
    const loaded = await loadCloudEvidenceCheckpoint({ ...f.copy, expectedRevision: "57", expectedCampaignId: old.state.campaignId, expectedBaselineId: f.copy.baselineId });
    const key = cloudCampaignStorageKey(f.scope), owner = "pre-gate.writer";
    const head = await bindJournal(f.cache.journal!, key, owner, { checkpoint: loaded.checkpoint, campaign: loaded.campaign, source: loaded.source,
      confirmed: f.copy, usageQuestions: [], writerGeneration: coordinator.journalWriterGeneration,
      snapshotPolicy: { lineage: { ...loaded.snapshotLineage!, parents: [f.copy.snapshot.uncompressedSha256] } } }, cloudCodec);
    const drain = new LocalJournalDrain(f.cache.journal!, key, owner, head.highWater, error => { throw error; });
    const committed = applyGameEvidenceCommand(loaded.checkpoint, old.admission, preGate);
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
