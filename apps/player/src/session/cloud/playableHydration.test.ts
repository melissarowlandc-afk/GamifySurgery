import { expect, it } from "vitest";
import { createGameEvidenceCheckpoint, createInitialGameState } from "@gamify-surgery/game-domain";
import { cloudCodec } from "./codecWorker";
import { codecTestCampaign } from "./codecTestSupport";
import { loadCloudSnapshot, snapshotCopy } from "./snapshotCodec";
import { completeSnapshotLearning } from "./snapshotLearning";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";
import type { CloudCodecExecutor } from "./codecTasks";

it("prepares the exact playable learning checkpoint in the codec without changing its raw verified copy", async () => {
  const state = createInitialGameState(), concept = Object.keys(state.learningHistories)[0]!;
  delete state.learningHistories[concept];
  const before = JSON.stringify(state), campaign = codecTestCampaign(before);
  const copy = await snapshotCopy(state, campaign, "1", state.createdAtRealMs,
    { branchId: "public.playable-hydration", sequence: 10, parents: [] });
  const input = { ...copy, expectedRevision: copy.revision, expectedCampaignId: state.campaignId, expectedBaselineId: copy.baselineId };
  const raw = await cloudCodec.run({ kind: "hydrate", input });
  const expected = completeSnapshotLearning(raw.state);
  const playable = await cloudCodec.run({ kind: "hydrate", input: { ...input, preparePlayable: true } });
  expect(playable.learningAdapted).toBe(true);
  expect(JSON.stringify(playable.state)).toBe(JSON.stringify(expected));
  expect(JSON.stringify(playable.checkpoint)).toBe(JSON.stringify(createGameEvidenceCheckpoint(expected)));
  expect(playable.source).toEqual(raw.source); expect(playable.snapshotLineage).toEqual(raw.snapshotLineage);
  expect(playable.campaign).toEqual(raw.campaign);
  const again = await cloudCodec.run({ kind: "hydrate", input });
  expect(JSON.stringify(again)).toBe(JSON.stringify(raw));
  expect(again.state.learningHistories[concept]).toBeUndefined();
  expect(JSON.stringify(state)).toBe(before);
});

it.each([false, undefined])("keeps raw hydration exact when playable preparation is %s", async preparePlayable => {
  const state = createInitialGameState(), concept = Object.keys(state.learningHistories)[0]!;
  delete state.learningHistories[concept];
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "1", state.createdAtRealMs,
    { branchId: `public.raw-hydration.${preparePlayable}`, sequence: 10, parents: [] });
  const expected = await loadCloudSnapshot({ ...copy, expectedRevision: copy.revision, expectedCampaignId: state.campaignId });
  const loaded = await cloudCodec.run({ kind: "hydrate", input: { ...copy, expectedRevision: copy.revision,
    expectedCampaignId: state.campaignId, expectedBaselineId: copy.baselineId, preparePlayable } });
  expect(loaded.learningAdapted).toBeUndefined(); expect(loaded.state.learningHistories[concept]).toBeUndefined();
  expect(JSON.stringify(loaded.state)).toBe(JSON.stringify(expected.state));
  expect(JSON.stringify(loaded.checkpoint)).toBe(JSON.stringify(expected.checkpoint));
  expect(loaded.state).toEqual(state);
});

it("does not invent an adaptation when the selected native state already has all learning defaults", async () => {
  const state = createInitialGameState();
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "1", state.createdAtRealMs,
    { branchId: "public.current-hydration", sequence: 10, parents: [] });
  const expected = await loadCloudSnapshot({ ...copy, expectedRevision: copy.revision, expectedCampaignId: state.campaignId });
  const loaded = await cloudCodec.run({ kind: "hydrate", input: { ...copy, expectedRevision: copy.revision,
    expectedCampaignId: state.campaignId, expectedBaselineId: copy.baselineId, preparePlayable: true } });
  expect(loaded.learningAdapted).toBeUndefined();
  expect(JSON.stringify(loaded.state)).toBe(JSON.stringify(expected.state));
  expect(JSON.stringify(loaded.checkpoint)).toBe(JSON.stringify(expected.checkpoint));
  expect(loaded.state).toEqual(state);
});

it("retains raw read-only state if writer authority changes while playable hydration runs", async () => {
  const state = createInitialGameState(), concept = Object.keys(state.learningHistories)[0]!;
  delete state.learningHistories[concept];
  const clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow), cache = new MemoryCloudCache();
  const scope = { backendId: "public.hydrate-race", accountId: "public.owner", campaignId: state.campaignId };
  const copy = await snapshotCopy(state, codecTestCampaign(JSON.stringify(state)), "1", clock.wall,
    { branchId: "public.hydrate-race", sequence: 10, parents: [] });
  server.setAccess(scope.accountId, { snapshotSaves: true }); server.seed(scope.accountId, copy);
  let coordinator: CloudSyncCoordinator;
  const codec: CloudCodecExecutor = { async run(task) {
    const result = await cloudCodec.run(task);
    if (task.kind === "hydrate" && task.input.preparePlayable) coordinator.pause();
    return result;
  } };
  coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), clock, enabled: true, codec });
  let session: CloudGameSession | undefined;
  try {
    expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
    session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: false });
    const raw = await loadCloudSnapshot({ ...copy, expectedRevision: copy.revision, expectedCampaignId: state.campaignId });
    expect(session.canExecute).toBe(false); expect(session.state.learningHistories[concept]).toBeUndefined();
    // The existing read-only getter pauses the presentation without a command.
    expect(JSON.stringify(session.state)).toBe(JSON.stringify({ ...raw.state, paused: true }));
    expect(server.operationCount(scope.accountId)).toBe(0);
  } finally { session?.dispose(); coordinator.dispose(); }
});
