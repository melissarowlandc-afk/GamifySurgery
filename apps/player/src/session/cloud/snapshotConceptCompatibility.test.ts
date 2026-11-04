import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  createNewFsrsCard, gameEvidenceDelta, gameReducer, getCurrentQuestion, PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState, GameEvidenceError,
  type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { LocalJournalDrain } from "../localJournal";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudSyncCoordinator } from "./coordinator";
import { FakeCloudServer } from "./fakeTransport";
import { CloudGameSession } from "./gameSession";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { cloudCodec } from "./codecWorker";
import { bindJournal, prepareJournal } from "./journalCodec";
import { snapshotCopy } from "./snapshotCodec";
import { TestCloudClock } from "./syncTestSupport";
import { CloudSyncError } from "./transport";
import { completeSnapshotLearning } from "./snapshotLearning";

/** A real frozen question/answer and an already reviewed card. Only the catalog
 * membership varies, modelling a save from before a concept was released. */
function questionFixture() {
  let state = createInitialGameState(undefined, { campaignId: "catalog.compatibility", campaignSeed: "evidence.synthetic", createdAtRealMs: 1_800_000_000_000 });
  state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "setup.play" });
  for (let index = 0; index < 250; index++) {
    for (const encounter of Object.values(state.encounters)) {
      if (encounter.lifecycle === "waiting_unopened" && encounter.checkInStatus === "checked_in")
        state = gameReducer(state, { type: "OPEN_CHART", operationId: `setup.open.${index}.${encounter.id}`, encounterId: encounter.id });
      const question = getCurrentQuestion(state, encounter.id);
      if (!question) continue;
      const command: GameCommand = { type: "SUBMIT_ANSWER", operationId: `answer.${index}`, encounterId: encounter.id,
        decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices[0]!.id,
        reviewedAtMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000 };
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: "setup.pause" });
      // Real historical FSRS data, including reviews from retired encounters.
      const historical = JSON.parse(readFileSync(new URL("../../../../../tests/fixtures/level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8")) as GameState;
      const [reviewedConcept, history] = Object.entries(historical.learningHistories).find(([id, row]) => id !== question.node.primaryConceptId && row.reviews.length > 0)!;
      state.learningHistories[reviewedConcept] = history;
      return { state, command, conceptId: question.node.primaryConceptId, reviewedConcept };
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `setup.tick.${index}`, advancedAtRealMs: state.createdAtRealMs + index * 60_000 });
  }
  throw new Error("The deterministic fixture did not reach a question.");
}

async function rig(state: GameState) {
  const clock = new TestCloudClock(), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const scope = { backendId: "catalog-test", accountId: "account-a", campaignId: state.campaignId };
  const server = new FakeCloudServer(clock.wallNow); server.setAccess(scope.accountId, { snapshotSaves: true });
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "57", clock.wall, { branchId: "before.release", sequence: 4623, parents: [] });
  server.seed(scope.accountId, copy);
  const runtime = { ...scope, region: "test", cache, entryStore, transport: server.transport(scope.accountId) };
  const open = () => openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock });
  return { scope, runtime, clock, cache, entryStore, server, copy, open };
}

it("opens a pre-release snapshot and answers a newly released concept without editing any supplied card or review", async () => {
  const fixture = questionFixture(), { state, conceptId, reviewedConcept, command } = fixture;
  expect(state.learningHistories[reviewedConcept]!.reviews.length).toBeGreaterThan(0);
  delete state.learningHistories[conceptId];
  // This is the exact live failure in the domain contract, not corrupt bytes.
  expect(() => applyGameEvidenceCommand(createGameEvidenceCheckpoint(state), command, PROTOTYPE_DOMAIN_CONTEXT)).toThrowError(/concept-set-change/);
  const f = await rig(state), raw = await loadCloudEvidenceCheckpoint({ ...f.copy, expectedRevision: "57", expectedCampaignId: state.campaignId, expectedBaselineId: f.copy.baselineId });
  expect(raw.state).toEqual(state); // Wire verification/selection must stay exact.
  let session: CloudGameSession | null = await CloudGameSession.create(await f.open());
  try {
    expect(session.state.learningHistories[conceptId]).toEqual({ conceptId, card: createNewFsrsCard(state.createdAtRealMs), reviews: [] });
    for (const [id, history] of Object.entries(state.learningHistories)) expect(session.state.learningHistories[id]).toEqual(history);
    expect({ ...session.state, learningHistories: state.learningHistories }).toEqual(state);
    const result = session.execute(command, PROTOTYPE_DOMAIN_CONTEXT);
    expect(result).not.toBeNull(); expect(result!.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(result!.learningHistories[conceptId]!.reviews).toHaveLength(1);
    expect(result!.learningHistories[reviewedConcept]).toEqual(state.learningHistories[reviewedConcept]);
    expect(session.canExecute).toBe(true); expect(session.syncView.failure).toBeNull();
    expect(await session.checkpointNow("purchase")).toBe(true);
    const expected = session.state; session.dispose();
    session = await CloudGameSession.create(await f.open());
    expect(session.state).toEqual(expected); expect(session.canExecute).toBe(true);
    expect((await f.runtime.transport.list())).toHaveLength(1);
  } finally { session?.dispose(); }
});

it.each(["previous", "current"])("recovers a %s-catalog revision 57 plus two dirty journal commands with exact progress and campaign identity", async catalog => {
  const { state, conceptId, command } = questionFixture();
  if (catalog === "previous") delete state.learningHistories[conceptId];
  const f = await rig(state);
  // Persist the old document's actual two incremental commands, without using
  // the new session adapter under test to construct that older writer.
  const coordinator = new CloudSyncCoordinator({ ...f.runtime, scope: f.scope, clock: f.clock, enabled: true });
  expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
  const key = cloudCampaignStorageKey(f.scope), owner = "old.document", loaded = await loadCloudEvidenceCheckpoint({ ...f.copy,
    expectedRevision: "57", expectedCampaignId: state.campaignId, expectedBaselineId: f.copy.baselineId });
  const head = await bindJournal(f.cache.journal!, key, owner, { checkpoint: loaded.checkpoint, campaign: loaded.campaign, source: loaded.source,
    confirmed: f.copy, usageQuestions: [], writerGeneration: coordinator.journalWriterGeneration,
    snapshotPolicy: { lineage: { ...loaded.snapshotLineage!, parents: [f.copy.snapshot.uncompressedSha256] } } }, cloudCodec);
  const drain = new LocalJournalDrain(f.cache.journal!, key, owner, head.highWater, error => { throw error; });
  let checkpoint = loaded.checkpoint, expected = state;
  for (const [index, speed] of [2, 4].entries()) {
    const result = applyGameEvidenceCommand(checkpoint, { type: "SET_SIMULATION_SPEED", speed: speed as 2 | 4, operationId: `pending.${index}` }, PROTOTYPE_DOMAIN_CONTEXT);
    drain.accept({ delta: gameEvidenceDelta(checkpoint, result.checkpoint), campaign: loaded.campaign, usageQuestions: [], writerGeneration: coordinator.journalWriterGeneration });
    checkpoint = result.checkpoint; expected = result.state;
  }
  expect(await drain.drain()).toBe(true);
  expect(checkpoint.snapshot.head.sequence).toBe(2);
  drain.stop();
  // The old release fenced this intact journal as corrupt. Such a block is not
  // a durable command-block; a fresh runtime must recover the saved commands.
  coordinator.reportLocalFailure(new CloudSyncError("corrupt"));
  expect(coordinator.view.failure).toBe("corrupt"); coordinator.dispose();
  let session: CloudGameSession | null = await CloudGameSession.create(await f.open());
  try {
    expect(session.canExecute).toBe(true); expect(session.syncView.failure).toBeNull();
    expect({ ...session.state, learningHistories: expected.learningHistories }).toEqual(expected);
    expect(session.state.campaignId).toBe(state.campaignId); expect(session.state.simulationSpeed).toBe(4);
    expect(session.execute(command, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(true);
    const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    expect(recovered!.state).toEqual(session.state);
    const after = session.state; session.dispose(); session = await CloudGameSession.create(await f.open());
    expect(session.state).toEqual(after); expect(session.canExecute).toBe(true);
    expect(await session.checkpointNow("purchase")).toBe(true);
    expect((await f.runtime.transport.list())).toHaveLength(1);
  } finally { session?.dispose(); }
});

it("matches local additive defaults and retains supplied retired cards/reviews without replaying migrations", () => {
  const { state, conceptId, reviewedConcept } = questionFixture();
  delete state.learningHistories[conceptId];
  const retired = "concept.retired.compatibility";
  state.learningHistories[retired] = { ...structuredClone(state.learningHistories[reviewedConcept]!), conceptId: retired };
  const before = structuredClone(state), compatible = completeSnapshotLearning(state);
  expect(compatible.learningHistories).toEqual(deserializeGameState(JSON.stringify(state)).learningHistories);
  expect(compatible.learningHistories[retired]).toBe(state.learningHistories[retired]);
  expect(compatible.encounters).toBe(state.encounters); expect(compatible.reviewIntents).toBe(state.reviewIntents);
  expect({ ...compatible, learningHistories: state.learningHistories }).toEqual(before);
  expect(state).toEqual(before); expect(completeSnapshotLearning(compatible)).toBe(compatible);
});

it("opens the actual pre-batch Level 5 snapshot catalog, durably adds only missing histories and survives a kill before the first command", async () => {
  const state = JSON.parse(readFileSync(new URL("../../../../../tests/fixtures/level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8")) as GameState;
  const absent = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(row => !Object.hasOwn(state.learningHistories, row.id));
  expect(absent.length).toBeGreaterThan(0);
  const f = await rig(state);
  let session: CloudGameSession | null = await CloudGameSession.create(await f.open());
  try {
    const expected = session.state;
    expect({ ...expected, learningHistories: state.learningHistories }).toEqual(state);
    for (const [id, history] of Object.entries(state.learningHistories)) expect(expected.learningHistories[id]).toEqual(history);
    expect(await session.durable()).toBe(true);
    const committed = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    expect(committed!.state).toEqual(expected);
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    session.dispose(); session = await CloudGameSession.create(await f.open());
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(expected);
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "large.compatibility.command" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(true);
    expect(session.state.learningHistories).toEqual(expected.learningHistories);
  } finally { session?.dispose(); }
}, 30_000);

it.each(["patient", "employee"])("answers a still-frozen retired %s concept even when all of today's catalog histories are already present", async participant => {
  const { state, command } = questionFixture();
  if (command.type !== "SUBMIT_ANSWER") throw new Error("Expected patient fixture");
  const encounter = state.encounters[command.encounterId]!, node = encounter.frozenCase.decisionNodes.find(row => row.id === command.decisionNodeId)!;
  const retired = `concept.retired.compatibility.${participant}`; node.primaryConceptId = retired;
  expect(state.learningHistories).not.toHaveProperty(retired);
  let answer: GameCommand = command;
  if (participant === "employee") {
    const id = "discussion.compatibility";
    state.employeeDiscussions = { [id]: { id, clinicalReleaseId: encounter.clinicalReleaseId,
      frozenCase: structuredClone(encounter.frozenCase), employeeId: "employee.compatibility",
      employeeDisplayName: "Synthetic colleague", employeeAppearance: state.founder.appearance,
      lifecycle: "active_action_required", createdAtFacilityTick: state.facilityTick, firstOpenedAtTick: state.facilityTick,
      resolvedAtFacilityTick: null, cancellationReason: null, currentNodeIndex: encounter.currentNodeIndex,
      answers: [], steps: structuredClone(encounter.steps) } };
    state.openEmployeeDiscussionId = id; state.openChartEncounterId = null;
    answer = { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", discussionId: id, decisionNodeId: command.decisionNodeId,
      answerChoiceId: command.answerChoiceId, operationId: "employee.compatibility.answer", reviewedAtMs: command.reviewedAtMs };
  }
  expect(() => applyGameEvidenceCommand(createGameEvidenceCheckpoint(state), answer, PROTOTYPE_DOMAIN_CONTEXT)).toThrowError(/concept-set-change/);
  const f = await rig(state), session = await CloudGameSession.create(await f.open());
  try {
    expect(session.state.learningHistories[retired]).toEqual({ conceptId: retired, card: createNewFsrsCard(state.createdAtRealMs), reviews: [] });
    expect(session.state.encounters).toEqual(state.encounters); expect(session.state.employeeDiscussions).toEqual(state.employeeDiscussions);
    const result = session.execute(answer, PROTOTYPE_DOMAIN_CONTEXT);
    expect(result).not.toBeNull(); expect(result!.operationReceipts[answer.operationId]?.status).toBe("applied");
    expect(result!.learningHistories[retired]!.reviews).toHaveLength(1); expect(session.canExecute).toBe(true);
    expect(await session.durable()).toBe(true);
  } finally { session.dispose(); }
});

it.each(["concept-set-change", "review-removal-or-edit", "card-change-without-review", "immutable-pins"])("classifies %s without weakening integrity failures", async code => {
  const { state } = questionFixture(), f = await rig(state), coordinator = await f.open();
  try {
    coordinator.reportLocalFailure(new GameEvidenceError(code));
    expect(coordinator.view.failure).toBe(code === "concept-set-change" ? "processing" : "corrupt");
    expect(coordinator.view.canExecute).toBe(false);
    expect(await f.runtime.transport.load(state.campaignId)).toEqual(f.copy);
  } finally { coordinator.dispose(); }
});
