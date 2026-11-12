import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBObjectStore } from "fake-indexeddb";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { CloudCacheError } from "./codecCache";
import { IndexedDbCloudEntryStore, MemoryCloudEntryStore } from "./entryStorage";
import { IndexedDbCloudCache, MemoryCloudCache } from "./cache";
import { CloudGameSession } from "./gameSession";
import { FakeCloudServer } from "./fakeTransport";
import { snapshotCopy } from "./snapshotCodec";
import { codecTestCampaign } from "./codecTestSupport";
import { deferred, syncFixture, TestCloudClock } from "./syncTestSupport";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { LOCAL_JOURNAL_QUEUE_LIMIT } from "../localJournal";
import { cloudStatusText } from "../../ui/CloudSaveControls";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { cloudCodec } from "./codecWorker";
import { LOCAL_NATIVE_PREPARE_MS } from "../localJournal";
import { type CloudCacheEntry } from "./cache";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });
async function fixture() {
  const state = createInitialGameState(), campaign = codecTestCampaign(JSON.stringify(state)), clock = new TestCloudClock();
  const scope = { backendId: "storage-recovery", accountId: crypto.randomUUID(), campaignId: state.campaignId };
  const server = new FakeCloudServer(clock.wallNow), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  server.setAccess(scope.accountId, { snapshotSaves: true });
  server.seed(scope.accountId, await snapshotCopy(state, campaign, "57", clock.wall, { branchId: "storage-base", sequence: 100, parents: [] }));
  const open = async () => {
    const runtime = { ...scope, region: "test", cache, entryStore, transport: server.transport(scope.accountId) };
    const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock });
    expect(coordinator.view.canExecute).toBe(true);
    return { coordinator, session: await CloudGameSession.create(coordinator) };
  };
  return { ...await open(), state, clock, scope, cache, server, entryStore, open };
}

it("retries a slow IDB entry read without interpreting its 10-second deadline as quota", async () => {
  const store = new IndexedDbCloudEntryStore({ backendId: "slow", accountId: "read" }, new IDBFactory());
  const exact = { committedProgress: "preserved" }; await store.write("campaign", exact);
  const get = IDBObjectStore.prototype.get, started = deferred();
  vi.spyOn(IDBObjectStore.prototype, "get").mockImplementationOnce(function(this: IDBObjectStore, key) {
    const req = get.call(this, key);
    return new Proxy(req, {
      get: (target, property) => Reflect.get(target, property, target),
      set(target, property, handler) {
        if (property === "onsuccess") { target.onsuccess = event => { started.resolve(); setTimeout(() => handler.call(target, event), 20_000); }; return true; }
        return Reflect.set(target, property, handler, target);
      },
    });
  });
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const result = store.read("campaign"); await started.promise;
  await vi.advanceTimersByTimeAsync(10_000); await vi.advanceTimersByTimeAsync(250);
  expect(await result).toEqual(exact);
  expect(await store.read("campaign")).toEqual(exact);
});

it("recovers an exact cache write whose post-commit reply timed out, while still fencing another caller", async () => {
  const f = await syncFixture(), entered = deferred(); let first = true;
  const cache = new IndexedDbCloudCache(new IDBFactory(), "storage.lost-reply", { afterCommit: () => {
    if (first) { first = false; entered.resolve(); throw new CloudCacheError("timeout"); }
  } });
  const entry = { schemaVersion: 1 as const, scope: { backendId: "lost", accountId: "reply", campaignId: f.confirmed.campaignId }, confirmed: f.confirmed, recovery: null };
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const written = cache.write(entry, null); await entered.promise; await vi.advanceTimersByTimeAsync(250);
  expect(await written).toMatchObject({ cacheRevision: 1, entry });
  expect((await cache.read(entry.scope))?.cacheRevision).toBe(1);
  await expect(cache.write(entry, null)).rejects.toMatchObject({ reason: "conflict" }); await cache.close();
});

it("keeps valid commands responsive through transient journal failure, retries, and reopens the newest committed state", async () => {
  const f = await fixture(), append = f.cache.journal.append.bind(f.cache.journal);
  const fault = vi.spyOn(f.cache.journal, "append").mockRejectedValueOnce(new CloudCacheError("timeout"));
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  let reopened: Awaited<ReturnType<typeof f.open>> | null = null;
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "slow.first" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(false);
    expect(f.session.canExecute).toBe(true); expect(f.session.syncView.storageRetrying).toBe(true);
    expect(cloudStatusText(f.session.syncView)).toContain("retries"); expect(cloudStatusText(f.session.syncView)).not.toContain("Free storage");
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "slow.second" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    fault.mockImplementation(append); await vi.advanceTimersByTimeAsync(250);
    expect(await f.session.durable()).toBe(true); expect(f.session.canExecute).toBe(true);
    expect(f.session.syncView.failure).toBeNull();
    const exact = structuredClone(f.session.state), committed = (await f.cache.journal.head(cloudCampaignStorageKey(f.scope)))!.highWater;
    f.session.dispose(); // Abrupt kill: no hide, close, checkpoint or replay.
    reopened = await f.open(); expect(reopened.session.state).toStrictEqual(exact); expect(reopened.session.canExecute).toBe(true);
    expect((await f.cache.journal.head(cloudCampaignStorageKey(f.scope)))!.highWater).toBeGreaterThanOrEqual(committed);
    expect(await reopened.session.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(1);
  } finally { f.session.dispose(); reopened?.session.dispose(); }
});

it("automatically recovers a quota-fenced campaign from its newest committed journal after reload without resetting its lineage", async () => {
  const f = await fixture(), write = f.cache.write.bind(f.cache); let reopened: Awaited<ReturnType<typeof f.open>> | null = null;
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "quota.committed" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(true); const exact = structuredClone(f.session.state);
    vi.spyOn(f.cache, "write").mockRejectedValue(new CloudCacheError("quota"));
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.session.syncView).toMatchObject({ canExecute: false, failure: "storage", storageQuota: true });
    expect(f.server.operationCount(f.scope.accountId)).toBe(0); f.session.dispose();
    vi.mocked(f.cache.write).mockImplementation(write);
    reopened = await f.open(); expect(reopened.session.state).toStrictEqual(exact); expect(reopened.session.canExecute).toBe(true);
    expect((await f.cache.journal.read(cloudCampaignStorageKey(f.scope)))!.rows).toHaveLength(0);
    expect(await reopened.session.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(1);
  } finally { f.session.dispose(); reopened?.session.dispose(); }
});

it("reclaims an older release's redundant rows before reopening under the same unchanged quota pressure", async () => {
  const f = await fixture(), key = cloudCampaignStorageKey(f.scope), write = f.cache.write.bind(f.cache);
  let reopened: Awaited<ReturnType<typeof f.open>> | null = null;
  try {
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "quota.old-ack" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    const oldRows = structuredClone([...f.cache.journal.data.get(key)!.rows]);
    expect(oldRows).toHaveLength(1);
    expect(await f.session.checkpointNow("purchase")).toBe(true);
    await (f.session as unknown as { compacting: Promise<unknown> | null }).compacting;
    // Old live releases retained the covered previous-generation rows. Model
    // those exact bytes; current + prior complete seeds and newest suffix stay.
    for (const [version, row] of oldRows) f.cache.journal.data.get(key)!.rows.set(version, row);
    delete f.cache.journal.data.get(key)!.head.snapshotFormat; // Earliest native journals have no optional format hint.
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "quota.newest" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true); const exact = structuredClone(f.session.state);
    const covered = () => { const data = f.cache.journal.data.get(key)!; return [...data.rows.keys()].some(version => version <= data.head.snapshotThrough); };
    expect(covered()).toBe(true);
    vi.spyOn(f.cache, "write").mockImplementation((entry, expected) => covered() ? Promise.reject(new CloudCacheError("quota")) : write(entry, expected));
    // The restriction stays active through the entire reopen. No simulated
    // extra disk space, cleared database or externally reset fault is supplied.
    f.coordinator.reportLocalFailure(new CloudCacheError("quota")); expect(f.session.canExecute).toBe(false); f.session.dispose();
    reopened = await f.open(); expect(reopened.session.state).toStrictEqual(exact); expect(reopened.session.canExecute).toBe(true);
    expect(covered()).toBe(false); expect(f.cache.journal.data.get(key)!.snapshots.size).toBe(2);
    expect(await reopened.session.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(2);
  } finally { f.session.dispose(); reopened?.session.dispose(); }
});

it("fences only at the bounded uncommitted queue limit and resumes immediately when that exact queue commits", async () => {
  const f = await fixture(), append = f.cache.journal.append.bind(f.cache.journal);
  const blocked = vi.spyOn(f.cache.journal, "append").mockRejectedValue(new CloudCacheError("timeout"));
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "queue.0" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(false);
    for (let i = 1; i < LOCAL_JOURNAL_QUEUE_LIMIT; i++) expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 4 : 2, operationId: `queue.${i}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(f.session.canExecute).toBe(false); expect(cloudStatusText(f.session.syncView)).toContain("retries");
    const exact = structuredClone(f.session.state);
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "queue.refused" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(f.session.state).toStrictEqual(exact);
    blocked.mockImplementation(append); await vi.advanceTimersByTimeAsync(250); expect(await f.session.durable()).toBe(true);
    expect(f.session.canExecute).toBe(true); expect(f.session.state).toStrictEqual(exact);
    f.clock.advance(60_001); expect(f.session.canExecute).toBe(false); // Recovery never extends an expired lease.
  } finally { f.session.dispose(); }
});

it("paces native full preparations independently of small durable commits and never uploads an older prepared ancestor on hide", async () => {
  const now = vi.spyOn(performance, "now").mockReturnValue(0), f = await fixture();
  const codec = vi.spyOn(cloudCodec, "run");
  const idle = async () => { while ((f.session as unknown as { warming: Promise<unknown> | null }).warming) await (f.session as unknown as { warming: Promise<unknown> }).warming; };
  try {
    for (let i = 0; i < 12; i++) {
      expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `warm.batch.${i}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await f.session.durable()).toBe(true); await idle();
    }
    expect(codec.mock.calls.filter(([task]) => task.kind === "journalWarm")).toHaveLength(1);
    expect(await f.session.checkpointNow("hidden")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    const exact = structuredClone(f.session.state);
    now.mockReturnValue(LOCAL_NATIVE_PREPARE_MS); await f.session.foreground(); await idle();
    expect(codec.mock.calls.filter(([task]) => task.kind === "journalWarm")).toHaveLength(2);
    expect(await f.session.checkpointNow("purchase")).toBe(true);
    expect(f.server.operationCount(f.scope.accountId)).toBe(1); expect(f.session.state).toStrictEqual(exact);
  } finally { f.session.dispose(); }
});

it("keeps a slow cache retry playable but never submits an immutable operation until its exact bytes are durable", async () => {
  const f = await fixture(), write = f.cache.write.bind(f.cache); let slow = true;
  const durableFlights: CloudCacheEntry[] = [];
  const writes = vi.spyOn(f.cache, "write").mockImplementation(async (entry, expected) => {
    if (entry.recovery?.inFlight && slow) throw new CloudCacheError("timeout");
    const saved = await write(entry, expected); if (entry.recovery?.inFlight) durableFlights.push(structuredClone(entry)); return saved;
  });
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "slow.cache" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    const immutable = f.coordinator.recoveryEntry!.recovery!.inFlight!;
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    expect(f.session.canExecute).toBe(true); expect(f.session.syncView.storageRetrying).toBe(true);
    const attempts = writes.mock.calls.length;
    f.coordinator.preparationRecovered(); // A background preparation completion is not a cache-write acknowledgement.
    expect(await f.session.checkpointNow("ordinary")).toBe(false);
    expect(writes).toHaveBeenCalledTimes(attempts); // A healthy small drain cannot cancel the bulk retry cooldown.
    slow = false; expect(await f.session.checkpointNow("purchase")).toBe(true);
    expect(durableFlights.some(entry => entry.recovery?.inFlight?.operationId === immutable.operationId &&
      entry.recovery.inFlight.requestText === immutable.requestText)).toBe(true);
    expect(f.server.operationCount(f.scope.accountId)).toBe(1);
    expect(f.session.canExecute).toBe(true); expect(f.session.syncView.failure).toBeNull();
  } finally { f.session.dispose(); }
});

it.each(["quota", "transaction", "timeout"] as const)("only a browser-reported quota failure suggests freeing storage (%s)", async reason => {
  const f = await fixture();
  try {
    f.coordinator.reportLocalFailure(new CloudCacheError(reason));
    expect(cloudStatusText(f.session.syncView)?.includes("Free storage")).toBe(reason === "quota");
    expect(f.session.syncView.storageQuota === true).toBe(reason === "quota");
  } finally { f.session.dispose(); }
});
