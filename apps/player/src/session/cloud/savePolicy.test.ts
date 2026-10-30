import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { cloudCodec, CloudCodecWorker } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { IndexedDbCloudCache, MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { FakeCloudServer } from "./fakeTransport";
import { prepareCloudEvidenceImport, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { TestCloudClock } from "./syncTestSupport";
import { deferred } from "./syncTestSupport";
import { CloudCodecError } from "./codecJson";
import { CLOUD_CHECKPOINT_MS, CLOUD_RENEW_MS } from "./transport";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { prepareJournal } from "./journalCodec";
import { decompressCloudText } from "./codecCompression";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllGlobals(); });
async function fixture(state = createInitialGameState(undefined, { campaignId: "save.policy", campaignSeed: "policy", createdAtRealMs: 0 }), native = false) {
  const clock = new TestCloudClock(), server = new FakeCloudServer(() => clock.wall);
  if (native) { vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange); }
  const cache = native ? new IndexedDbCloudCache() : new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const scope = { backendId: "policy", accountId: "account-a", campaignId: state.campaignId };
  const prepared = await prepareCloudEvidenceImport({ serializedState: serializeGameState(state), campaign: codecTestCampaign(serializeGameState(state)), operationId: "policy.import" });
  const confirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: clock.wall, baselineId: prepared.envelope.baselineId, snapshot: prepared.snapshot, evidence: prepared.packedEvidence };
  server.seed(scope.accountId, confirmed);
  const transport = server.transport(scope.accountId), runtime = { ...scope, region: "qa", cache, entryStore, transport };
  const coordinator = new CloudSyncCoordinator({ ...runtime, scope, enabled: true, clock });
  expect(await coordinator.open()).toBe(true);
  expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
  const session = await CloudGameSession.create(coordinator);
  return { scope, runtime, clock, server, cache, session, coordinator, confirmed };
}
async function advanceLease(f: Awaited<ReturnType<typeof fixture>>, ms: number) {
  for (let left = ms; left > 0;) { const n = Math.min(left, CLOUD_RENEW_MS); f.clock.advance(n); await f.coordinator.pulse(); left -= n; }
}
describe("owner-approved quiet checkpoint policy", () => {
  it("does not reinterpret an acknowledged journal as new progress", async () => {
    const f = await fixture();
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "unchanged.ack" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.checkpointNow("purchase")).toBe(true);
      const result = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { base: f.coordinator.confirmed! });
      expect(result?.candidate).toBeNull();
    } finally { f.session.dispose(); }
  });
  it("commits commands locally without codec or full-cache work, while lease renewal stays tiny", async () => {
    const f = await fixture();
    try {
      const codec = vi.spyOn(cloudCodec, "run"), writes = vi.spyOn(f.cache, "write");
      const errors = vi.spyOn(problemDiagnostics, "error");
      for (let i = 0; i < 12; i++) {
        const result = f.session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `local.${i}` }, PROTOTYPE_DOMAIN_CONTEXT);
        expect(errors.mock.calls).toEqual([]); expect(result).toBeTruthy();
      }
      expect(f.session.syncView.localDurable).toBe(false);
      expect(await f.session.durable()).toBe(true);
      expect(f.session.syncView.localDurable).toBe(true); expect(f.session.syncView.pending).toBe(true);
      await advanceLease(f, 60_000);
      expect(codec.mock.calls.every(([task]) => task.kind === "journalWarm" && JSON.stringify(task.input).length < 256)).toBe(true);
      expect(writes).not.toHaveBeenCalled(); expect(f.server.operationCount("account-a")).toBe(0);
      expect(f.session.canExecute).toBe(true);
      expect((await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!.highWater).toBe(12);
    } finally { f.session.dispose(); }
  });
  it("prepares/uploads dirty progress at five minutes; unchanged campaigns never upload", async () => {
    const f = await fixture();
    try {
      await advanceLease(f, CLOUD_CHECKPOINT_MS); expect(f.server.operationCount("account-a")).toBe(0);
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "dirty" }, PROTOTYPE_DOMAIN_CONTEXT);
      await f.session.durable();
      await advanceLease(f, CLOUD_CHECKPOINT_MS - CLOUD_RENEW_MS); expect(f.server.operationCount("account-a")).toBe(0);
      await advanceLease(f, CLOUD_RENEW_MS); expect(f.server.operationCount("account-a")).toBe(1);
      expect(f.session.syncView.pending).toBe(false);
      await advanceLease(f, CLOUD_CHECKPOINT_MS * 2); expect(f.server.operationCount("account-a")).toBe(1);
    } finally { f.session.dispose(); }
  });
  it("has twelve ordinary dirty fallback uploads per active hour and zero for an unchanged following hour", async () => {
    const f = await fixture();
    try {
      for (let i = 0; i < 12; i++) {
        f.session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `hour.${i}` }, PROTOTYPE_DOMAIN_CONTEXT);
        expect(await f.session.durable()).toBe(true);
        await advanceLease(f, CLOUD_CHECKPOINT_MS);
        expect(f.server.operationCount("account-a")).toBe(i + 1);
      }
      await advanceLease(f, 60 * 60_000);
      expect(f.server.operationCount("account-a")).toBe(12);
      expect(new Set([...f.server.account("account-a").operations.keys()]).size).toBe(12);
    } finally { f.session.dispose(); }
  });
  it("hidden/pagehide/freeze share a small drain and never begin a full encode", async () => {
    const f = await fixture(), held = deferred(), run = cloudCodec.run.bind(cloudCodec);
    try {
      const codec = vi.spyOn(cloudCodec, "run").mockImplementation(async task => { if (task.kind === "journalWarm") await held.promise; return run(task); });
      const append = vi.spyOn(f.cache.journal!, "append");
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "leaving" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await Promise.all([f.session.checkpointNow("hidden"), f.session.checkpointNow("pagehide"), f.session.checkpointNow("pagehide")])).toEqual([true, true, true]);
      expect(append).toHaveBeenCalledTimes(1); expect(codec).not.toHaveBeenCalled();
      expect(f.server.operationCount("account-a")).toBe(0); expect(f.session.syncView.localDurable).toBe(true);
    } finally { held.resolve(); await f.session.prepareRecoveryCopy(); f.session.dispose(); }
  });
  it("uploads the already prepared candidate on hide, preserving newer journal progress for reopening", async () => {
    const f = await fixture();
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "prepared" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.prepareRecoveryCopy()).toBe(true);
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "latest.journal" }, PROTOTYPE_DOMAIN_CONTEXT);
      const codec = vi.spyOn(cloudCodec, "run");
      expect(await f.session.checkpointNow("hidden")).toBe(true);
      expect(codec.mock.calls.some(([task]) => task.kind === "encode" || task.kind === "journalPrepare")).toBe(false);
      expect(f.server.operationCount("account-a")).toBe(1); expect(f.session.syncView.localDurable).toBe(true);
      expect(f.session.state.simulationSpeed).toBe(4);
      const restored = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
      expect(restored!.state!.simulationSpeed).toBe(4);
    } finally { f.session.dispose(); }
  });
  it("checkpoints a dirty day-end and coalesces automatic boundaries for sixty seconds", async () => {
    const state = createInitialGameState(undefined, { campaignId: "day.boundary", campaignSeed: "day", createdAtRealMs: 0 });
    const c = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock, day = (c.dayEndHour - c.dayStartHour) * 60;
    state.facilityTick = day - 1; state.paused = false;
    const f = await fixture(state);
    try {
      f.session.execute({ type: "ADVANCE_TICK", operationId: "end.day" }, PROTOTYPE_DOMAIN_CONTEXT);
      await vi.waitFor(() => expect(f.server.operationCount("account-a")).toBe(1));
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "next.change" }, PROTOTYPE_DOMAIN_CONTEXT);
      await f.session.durable(); expect(await f.session.checkpointNow("day-end")).toBe(true);
      expect(await f.session.checkpointNow("hidden")).toBe(true); expect(f.server.operationCount("account-a")).toBe(1);
      await advanceLease(f, 60_000); expect(await f.session.checkpointNow("day-end")).toBe(true);
      expect(f.server.operationCount("account-a")).toBe(2);
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "manual.priority" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount("account-a")).toBe(3);
    } finally { f.session.dispose(); }
  });
  it("Save & Close drains and confirms the latest captured progress without waiting for the fallback", async () => {
    const f = await fixture();
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "close.latest" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
      expect(f.coordinator.view.phase).toBe("closed"); expect(f.server.operationCount("account-a")).toBe(1);
      const confirmed = f.coordinator.confirmed!, loaded = await loadCloudEvidenceCheckpoint({ ...confirmed, expectedRevision: confirmed.revision,
        expectedCampaignId: confirmed.campaignId, expectedBaselineId: confirmed.baselineId });
      expect(loaded.state.simulationSpeed).toBe(4); expect(loaded.state.operationReceipts["close.latest"]).toBeTruthy();
    } finally { f.session.dispose(); }
  });
  it("keeps commands and tiny lease renewal responsive while bulk preparation waits on a slow worker", async () => {
    const f = await fixture(), held = deferred(), started = deferred(), run = cloudCodec.run.bind(cloudCodec);
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => { if (task.kind === "journalWarm") { started.resolve(); await held.promise; } return run(task); });
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "slow.before" }, PROTOTYPE_DOMAIN_CONTEXT);
      const saving = f.session.checkpointNow("purchase"); await started.promise;
      expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "slow.during" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeTruthy();
      expect(await f.session.durable()).toBe(true); expect(f.session.canExecute).toBe(true);
      f.clock.advance(CLOUD_RENEW_MS); await f.coordinator.pulse();
      expect(f.server.calls.filter(call => call.method === "renew")).toHaveLength(1);
      expect(f.session.canExecute).toBe(true); held.resolve(); expect(await saving).toBe(true);
      expect(await f.session.checkpointNow("purchase")).toBe(true);
      const saved = f.coordinator.confirmed!, loaded = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
        expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
      expect(loaded.state.operationReceipts["slow.before"]).toBeTruthy(); expect(loaded.state.operationReceipts["slow.during"]).toBeTruthy();
    } finally { held.resolve(); f.session.dispose(); }
  });
  it("Save & Close includes its captured pause even when an older preparation is already in flight", async () => {
    const state = createInitialGameState(); state.paused = false;
    const f = await fixture(state), held = deferred(), started = deferred(), run = cloudCodec.run.bind(cloudCodec); let hold = true;
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "journalWarm" && hold) { hold = false; const result = await run(task); started.resolve(); await held.promise; return result; }
      return run(task);
    });
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "close.before.prepare" }, PROTOTYPE_DOMAIN_CONTEXT);
      const earlier = f.session.prepareRecoveryCopy(); await started.promise;
      const closing = f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT); expect(f.session.state.paused).toBe(true);
      held.resolve(); expect(await earlier).toBe(true); expect(await closing).toBe(true);
      const copy = f.coordinator.confirmed!, loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
        expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
      expect(loaded.state.paused).toBe(true); expect(loaded.state.simulationSpeed).toBe(4);
      expect(loaded.checkpoint.evidence.records.filter(row => row.kind === "transition")).toHaveLength(2);
    } finally { held.resolve(); f.session.dispose(); }
  });
  it("retains playable committed progress after a failed bulk encode, without extending lease authority", async () => {
    const f = await fixture(), run = cloudCodec.run.bind(cloudCodec); let failed = true;
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "journalWarm" && failed) throw new CloudCodecError("worker_unavailable", "Worker unavailable");
      return run(task);
    });
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "worker.fail" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.checkpointNow("purchase")).toBe(false);
      expect(f.session.syncView).toMatchObject({ canExecute: true, localDurable: true, failure: "processing" });
      expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "worker.still.local" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeTruthy();
      expect(await f.session.durable()).toBe(true);
      failed = false;
      expect(await f.session.checkpointNow("purchase")).toBe(true); expect(f.session.syncView.failure).toBeNull();
      f.clock.advance(65_000); expect(f.session.canExecute).toBe(false); expect(f.session.syncView.failure).toBe("lease-expired");
    } finally { f.session.dispose(); }
  });
  it.each([false, true])("recovers an abrupt kill in a second runtime sharing the committed journal (native clone/IDB=%s)", async native => {
    const worker = native ? new FakeCloudCodecWorker() : null, codec = worker ? new CloudCodecWorker(() => worker) : null;
    if (worker && codec) { worker.release(); vi.spyOn(cloudCodec, "run").mockImplementation(task => codec.run(task)); }
    const f = await fixture(undefined, native);
    try {
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "kill.committed" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await f.session.durable()).toBe(true); const saved = f.session.state;
      f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "kill.last.batch" }, PROTOTYPE_DOMAIN_CONTEXT);
      f.session.dispose(); // Deliberately no lifecycle event/drain.
      const reopenedCache = native ? new IndexedDbCloudCache() : f.cache;
      const coordinator = await openAutomaticCloudCampaign({ runtime: { ...f.runtime, cache: reopenedCache }, campaignId: f.scope.campaignId, clock: f.clock });
      const session = await CloudGameSession.create(coordinator);
      expect(session.canExecute).toBe(true); expect(session.state).toEqual(saved);
      expect(session.state.operationReceipts["kill.last.batch"]).toBeUndefined();
      expect(await session.checkpointNow("ordinary")).toBe(true); // App's post-mount background upload.
      expect(f.server.operationCount("account-a")).toBe(1);
      expect(worker?.messages.filter(m => m.task.kind === "journalPrepare").every(m => m.task.kind === "journalPrepare" && Boolean(m.task.input.address) && !m.task.input.data) ?? true).toBe(true);
      session.dispose();
    } finally { f.session.dispose(); codec?.dispose(); }
  });
});
