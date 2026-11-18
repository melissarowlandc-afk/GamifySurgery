import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { ControllableOperationalPort, operationalSessionFixture } from "./operationalSessionTestSupport";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { cloudCodec } from "./codecWorker";
import { runCloudCodecTask } from "./codecTasks";
import { CloudSyncError } from "./transport";
import { CloudCodecWorker } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { deferred } from "./syncTestSupport";
import { prepareJournal } from "./journalCodec";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

const codec = { run: runCloudCodecTask };
async function devices() {
  const h = await operationalSessionFixture({}, undefined, false);
  const entryStore = new MemoryCloudEntryStore();
  const runtime = { ...h.scope, region: "test", cache: h.cache, entryStore, transport: h.server.transport(h.scope.accountId) };
  const play = async (session: CloudGameSession, label: string, ticks: number) => {
    session.execute({ type: "SET_PAUSED", paused: false, operationId: label + ".play" }, PROTOTYPE_DOMAIN_CONTEXT);
    for (let n = 0; n < ticks; n++) session.execute({ type: "ADVANCE_TICK", advancedAtRealMs: n, operationId: label + n }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true);
  };
  h.session.dispose();
  const phoneCoordinator = new CloudSyncCoordinator({ ...runtime, scope: h.scope, clock: h.clock, enabled: true });
  expect(await phoneCoordinator.open()).toBe(true); expect(await phoneCoordinator.startWriter(true)).toBe(true); expect(phoneCoordinator.resume()).toBe(true);
  const phone = await CloudGameSession.create(phoneCoordinator, undefined, undefined, { operational: false });
  await play(phone, "phone", 2);
  const local = phone.state;
  phone.dispose();
  const other = new CloudSyncCoordinator({ scope: h.scope, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore(),
    transport: h.server.transport(h.scope.accountId), clock: h.clock, enabled: true });
  expect(await other.open()).toBe(true); expect(await other.startWriter(true)).toBe(true); expect(other.resume()).toBe(true);
  const desktop = await CloudGameSession.create(other, undefined, undefined, { operational: false });
  await play(desktop, "desktop", 5);
  expect(await desktop.checkpointNow("purchase")).toBe(true);
  const remote = desktop.state;
  desktop.dispose();
  return { ...h, runtime, local, remote };
}

describe("phone stale journal and newer compacted account opening", () => {
  it("opens the newer account once without falling back to an offline local copy", async () => {
    const h = await devices();
    const spy = vi.spyOn(cloudCodec, "run");
    const start = performance.now();
    const selected = await openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec });
    let opened: CloudGameSession | undefined;
    try {
      opened = await CloudGameSession.create(selected, undefined, undefined, { operational: false });
      if (process.env.GS_PHONE_LOOP_PROOF) console.log("PHONE_DIVERGENCE", JSON.stringify({ ms: performance.now() - start, view: selected.view,
        localTick: h.local.facilityTick, remoteTick: h.remote.facilityTick, openedTick: opened.state.facilityTick,
        journalReads: spy.mock.calls.filter(([task]) => task.kind === "journalPrepare").length,
        calls: h.server.calls.slice(-30).map(row => row.method) }));
      expect(opened.canExecute).toBe(true);
      expect(opened.state.facilityTick).toBe(h.remote.facilityTick);
      expect(selected.view.failure).toBeNull();
      expect(selected.view.phase).toBe("ready");
      expect(spy.mock.calls.filter(([task]) => task.kind === "journalPrepare").length).toBeLessThanOrEqual(2);
    } finally { opened?.dispose(); selected.dispose(); spy.mockRestore(); }
  });

  it("keeps the same playable worker session through failed campaign reads and focus/retry pulses", async () => {
    const h = await devices();
    vi.spyOn(h.runtime.transport, "load").mockRejectedValue(new CloudSyncError("network"));
    const selected = await openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec });
    const reopen = vi.fn(async () => true), ports: ControllableOperationalPort[] = [];
    const session = await CloudGameSession.create(selected, undefined, reopen, { operational: { createPort: () => {
      const port = new ControllableOperationalPort(); ports.push(port); return port;
    } } });
    const head = await h.cache.journal.head(cloudCampaignStorageKey(h.scope)), before = session.state;
    try {
      for (let n = 0; n < 4; n++) { h.clock.advance(60_000); await session.foreground(true); await session.pulse(); }
      expect(reopen).not.toHaveBeenCalled();
      expect(session.state).toBe(before); expect(session.canExecute).toBe(true); expect(ports).toHaveLength(1);
      expect(await h.cache.journal.head(cloudCampaignStorageKey(h.scope))).toEqual(head);
      expect(await session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "offline.still-playable" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await session.durable()).toBe(true);
    } finally { session.dispose(); }
  });

  it("prepares an unchanged journal once across six recovery-cache rewrites, without trusting changed proof bytes", async () => {
    const h = await devices(), spy = vi.spyOn(cloudCodec, "run"), start = performance.now();
    try {
      let stored = (await h.cache.read(h.scope))!;
      const prepares = () => spy.mock.calls.filter(([task]) => task.kind === "journalPrepare").length;
      const initial = prepares();
      for (let n = 0; n < 6; n++) {
        expect(stored.entry.recovery).not.toBeNull();
        await h.cache.write({ ...stored.entry, recovery: { ...stored.entry.recovery!, writerGeneration: String(n + 10) } }, stored.cacheRevision);
        stored = (await h.cache.read(h.scope))!;
      }
      if (process.env.GS_PHONE_LOOP_PROOF) console.log("PHONE_RECOVERY_REWRITES", JSON.stringify({ ms: performance.now() - start, initial, total: prepares() }));
      expect(prepares()).toBe(initial);
      const confirmed = stored.entry.confirmed;
      await h.cache.write({ ...stored.entry, confirmed: { ...confirmed, snapshot: { ...confirmed.snapshot,
        dataBase64: "AAAA" + confirmed.snapshot.dataBase64.slice(4) } } }, stored.cacheRevision);
      await expect(h.cache.read(h.scope)).rejects.toThrow(); expect(prepares()).toBe(initial + 1);
    } finally { spy.mockRestore(); }
  });

  it("keeps the same newest-account engine when writer requests fail, then resumes backup in place", async () => {
    const h = await devices(), acquireOriginal = h.runtime.transport.acquire;
    const acquire = vi.spyOn(h.runtime.transport, "acquire").mockRejectedValue(new CloudSyncError("network"));
    const loadOriginal = h.runtime.transport.load, gate = deferred(); let holdLoad = false, waiting = false;
    const load = vi.spyOn(h.runtime.transport, "load").mockImplementation(async (...args) => {
      if (holdLoad) { waiting = true; await gate.promise; }
      return loadOriginal(...args);
    });
    const chosen = await openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec });
    const reopen = vi.fn(), ports: ControllableOperationalPort[] = [];
    const session = await CloudGameSession.create(chosen, undefined, async checked => { if (!checked) reopen(); return true; },
      { operational: { createPort: () => { const port = new ControllableOperationalPort(); ports.push(port); return port; } } });
    const before = session.state;
    try {
      expect(before.facilityTick).toBe(h.remote.facilityTick); expect(chosen.confirmedRevision).toBe("2");
      for (let n = 0; n < 4; n++) { h.clock.advance(60_000); await session.foreground(true); await session.pulse(); }
      expect(reopen).not.toHaveBeenCalled(); expect(ports).toHaveLength(1);
      expect(session.state).toBe(before); expect(session.canExecute).toBe(true); expect(chosen.view.failure).toBe("network");
      expect(await session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "writer.offline.play" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await session.durable()).toBe(true);
      acquire.mockImplementation(acquireOriginal); h.clock.advance(5 * 60_000);
      expect(await session.foreground(true)).toBe(true);
      holdLoad = true; const retry = session.pulse();
      await vi.waitFor(() => expect(waiting).toBe(true));
      // The read-only probe stays responsive. This accepted action must also be
      // durable before the in-place lease handoff publishes anything.
      expect(await session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "writer.during.probe" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await session.durable()).toBe(true); const expected = session.state;
      gate.resolve(); await retry;
      expect(reopen).not.toHaveBeenCalled(); expect(ports).toHaveLength(1); expect(session.state).toEqual(expected);
      expect(session.canExecute).toBe(true); expect(chosen.view.failure).toBeNull(); expect(session.needsReload).toBe(false);
      expect(Number(chosen.confirmedRevision)).toBeGreaterThan(2);
      const saved = chosen.confirmed!;
      const checked = await codec.run({ kind: "hydrate", input: { snapshot: saved.snapshot, evidence: saved.evidence, lineage: saved.lineage,
        revision: saved.revision, expectedRevision: saved.revision, expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
      expect(checked.state).toEqual(expected);
    } finally { gate.resolve(); load.mockRestore(); acquire.mockRestore(); session.dispose(); }
  });

  it("idle-releases the codec between selection and hydration without reopening or recreating the engine", async () => {
    const h = await devices(), codecPorts: FakeCloudCodecWorker[] = [], enginePorts: ControllableOperationalPort[] = [];
    const workerCodec = new CloudCodecWorker(() => { const port = new FakeCloudCodecWorker(); codecPorts.push(port); port.release(); return port; });
    let session: CloudGameSession | undefined;
    try {
      const selected = await openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec: workerCodec });
      expect(workerCodec.releaseIdle()).toBe(true);
      const reopen = vi.fn(async () => true);
      session = await CloudGameSession.create(selected, undefined, reopen, { operational: { createPort: () => {
        const port = new ControllableOperationalPort(); enginePorts.push(port); return port;
      } } });
      expect(workerCodec.releaseIdle()).toBe(true);
      await session.foreground();
      expect(reopen).not.toHaveBeenCalled(); expect(enginePorts).toHaveLength(1);
      expect(session.state.facilityTick).toBe(h.remote.facilityTick); expect(session.canExecute).toBe(true);
      expect(codecPorts.length).toBeGreaterThanOrEqual(2);
    } finally { session?.dispose(); workerCodec.dispose(); }
  });

  it("serializes an explicit checkpoint behind a held in-place lease response", async () => {
    const h = await devices(), acquireOriginal = h.runtime.transport.acquire, leaseGate = deferred(), leaseStarted = deferred(), validationGate = deferred();
    let online = false, validationStarted = false;
    const acquire = vi.spyOn(h.runtime.transport, "acquire").mockImplementation(async request => {
      if (!online) throw new CloudSyncError("network");
      const lease = await acquireOriginal(request); leaseStarted.resolve(); await leaseGate.promise; return lease;
    });
    const chosen = await openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec });
    const session = await CloudGameSession.create(chosen, undefined, async () => true, { operational: false });
    let retry: Promise<void> | undefined, staging: Promise<boolean> | undefined;
    const run = chosen.codec.run.bind(chosen.codec);
    let execute: ReturnType<typeof vi.spyOn> | undefined;
    try {
      expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "checkpoint.before.lease" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await session.durable()).toBe(true); const expected = session.state;
      const prepared = await prepareJournal(h.cache.journal, cloudCampaignStorageKey(h.scope), codec);
      const candidate = prepared!.candidate!;
      execute = vi.spyOn(chosen.codec, "run").mockImplementation(async task => {
        if (task.kind === "candidate" && task.input.candidate.snapshot.uncompressedSha256 === candidate.snapshot.uncompressedSha256) {
          validationStarted = true; await validationGate.promise;
        }
        return run(task);
      });
      online = true; h.clock.advance(5 * 60_000); retry = session.pulse(); await leaseStarted.promise;
      staging = chosen.stage(candidate, "save-close", true);
      // Drain the already-ready JS queue: staging must remain behind the lease,
      // before candidate validation or any cache publication can begin.
      for (let n = 0; n < 8; n++) await Promise.resolve();
      expect(validationStarted).toBe(false);
      leaseGate.resolve(); validationGate.resolve();
      expect(await staging).toBe(true); await retry;
      expect(session.state).toEqual(expected); expect(session.canExecute).toBe(true); expect(session.needsReload).toBe(false);
      expect(await session.prepareRecoveryCopy()).toBe(true);
      expect(await session.checkpointNow("purchase")).toBe(true);
      const saved = chosen.confirmed!;
      const checked = await codec.run({ kind: "hydrate", input: { snapshot: saved.snapshot, evidence: saved.evidence, lineage: saved.lineage,
        revision: saved.revision, expectedRevision: saved.revision, expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
      expect(checked.state).toEqual(expected);
    } finally {
      leaseGate.resolve(); validationGate.resolve(); await retry?.catch(() => {}); await staging?.catch(() => {});
      execute?.mockRestore(); acquire.mockRestore(); session.dispose();
    }
  });
});
