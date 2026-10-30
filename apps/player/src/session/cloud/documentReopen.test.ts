import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache, type CloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudEntryStore, type CloudEntryStore } from "./entryStorage";
import { FakeCloudServer } from "./fakeTransport";
import { CloudGameSession, cloudCampaignMetadata } from "./gameSession";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { importLocalCloudCampaign } from "./importCampaigns";
import { deferred, syncFixture } from "./syncTestSupport";
import { CloudSyncError, type CloudTransport } from "./transport";
import { readWriterIdentity, writeWriterIdentity } from "./writerIdentity";
import { appendLocalCampaign, createFreshProfile, PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { accountStorageKey } from "../accountStorageKey";
import { prepareCloudEvidenceImport } from "./codecEvidence";
import { CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";
import { CloudCacheError } from "./codecCache";
import type { CloudFrozenOperation } from "./transport";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
const task = () => new Promise<void>(resolve => setImmediate(resolve));

/** Separate document objects, one persistent device database. Every operation
 * crosses a task boundary; entry values round-trip through JSON as in IDB.
 * No document's coordinator, transport closure or token map is reused. */
function persistentDevice(server: FakeCloudServer, accountId: string) {
  const cache = new MemoryCloudCache(), entries = new MemoryCloudEntryStore();
  return () => {
    const transport = server.transport(accountId);
    const bridge = new Proxy(transport, { get(target, name) {
      const method = Reflect.get(target, name);
      return typeof method !== "function" ? method : async (...args: unknown[]) => {
        await task();
        try { const value = await method(...structuredClone(args)); await task(); return structuredClone(value); }
        catch (error) { throw new CloudSyncError(error instanceof CloudSyncError ? error.code : "network"); }
      };
    } });
    const delayed = <T extends CloudCache | CloudEntryStore>(store: T): T => new Proxy(store, { get(target, name) {
      const method = Reflect.get(target, name);
      return typeof method !== "function" ? method : async (...args: unknown[]) => {
        await task();
        const value = await method.apply(target, JSON.parse(JSON.stringify(args)));
        await task();
        return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
      };
    } });
    return { backendId: "disposable-fake-cloud-qa", accountId, region: "Synthetic", transport: bridge,
      cache: delayed(cache), entryStore: delayed(entries) };
  };
}

describe("independent document lifetimes on one device", () => {
  it("retains the exact immutable request when local acknowledgement loses its cache CAS, then confirms it without replay", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const nextDocument = persistentDevice(server, "account-a"), first = nextDocument(), campaignId = fixture.confirmed.campaignId;
    const old = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime: first, campaignId }));
    old.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "ack.cas" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await old.durable()).toBe(true); const expected = old.state; old.dispose();
    const second = nextDocument(), write = second.cache.write.bind(second.cache); let rejected = false, frozen: CloudFrozenOperation | null = null;
    vi.spyOn(second.cache, "write").mockImplementation(async (entry, revision) => {
      if (entry.recovery?.inFlight) frozen = entry.recovery.inFlight;
      if (!rejected && entry.confirmed.revision === "2" && !entry.recovery) { rejected = true; throw new CloudCacheError("conflict"); }
      return write(entry, revision);
    });
    const reopened = await openAutomaticCloudCampaign({ runtime: second, campaignId }), session = await CloudGameSession.create(reopened);
    expect(rejected).toBe(true); expect(frozen).not.toBeNull(); expect(session.canExecute).toBe(true); expect(session.state).toEqual(expected);
    const retained = await second.entryStore.entries();
    expect(retained.some(row => {
      const operation = (row.value as { device?: { recovery?: { inFlight?: CloudFrozenOperation } } })?.device?.recovery?.inFlight;
      return operation && operation.requestText === frozen!.requestText && operation.requestSha256 === frozen!.requestSha256;
    })).toBe(true);
    expect(server.operationCount("account-a")).toBe(1); expect(server.calls.filter(call => call.method === "commit")).toHaveLength(1);
    expect(server.usageCount("account-a")).toBe(0); session.dispose();
  });

  it("bounds repeated local cache conflicts without granting a lease or replacing the saved campaign", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const nextDocument = persistentDevice(server, "account-a"), first = nextDocument(), campaignId = fixture.confirmed.campaignId;
    const original = await openAutomaticCloudCampaign({ runtime: first, campaignId }); original.dispose();
    const second = nextDocument(), scope = { ...second, campaignId }, before = await second.cache.read(scope);
    const acquisitions = server.calls.filter(call => call.method === "acquire").length;
    const write = vi.spyOn(second.cache, "write").mockRejectedValue(new CloudCacheError("conflict"));
    await expect(openAutomaticCloudCampaign({ runtime: second, campaignId })).rejects.toMatchObject({ reason: "conflict" });
    expect(write).toHaveBeenCalledTimes(3); expect(await second.cache.read(scope)).toEqual(before);
    expect(server.calls.filter(call => call.method === "acquire")).toHaveLength(acquisitions);
    expect(server.operationCount("account-a")).toBe(0);
  });

  it.each(["pending", "confirmed", "lost-ack"] as const)("reselects fresh progress when the previous document's %s checkpoint commits after the opening read", async outcome => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const nextDocument = persistentDevice(server, "account-a"), first = nextDocument(), campaignId = fixture.confirmed.campaignId;
    const original = await openAutomaticCloudCampaign({ runtime: first, campaignId }), old = await CloudGameSession.create(original);
    const second = nextDocument(), captured = deferred(), release = deferred(), read = second.cache.read.bind(second.cache); let initial = true;
    vi.spyOn(second.cache, "read").mockImplementation(async scope => {
      const value = await read(scope);
      if (initial) { initial = false; captured.resolve(); await release.promise; }
      return value;
    });
    const reopening = openAutomaticCloudCampaign({ runtime: second, campaignId });
    const result = reopening.then(value => ({ value }), error => ({ error }));
    await captured.promise;
    old.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: `late.${outcome}` }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await old.durable()).toBe(true); const expected = old.state;
    const acknowledgement = deferred(); let uploading: Promise<boolean> | null = null;
    if (outcome === "confirmed") expect(await old.checkpointNow("ordinary")).toBe(true);
    if (outcome === "lost-ack") {
      server.faults.push({ method: "commit", at: "after", wait: acknowledgement.promise });
      expect(await old.prepareRecoveryCopy()).toBe(true);
      uploading = old.checkpointNow("pagehide");
      await vi.waitFor(() => expect(server.operationCount("account-a")).toBe(1));
    }
    old.dispose(); release.resolve();
    try {
      const opened = await result;
      expect(opened).not.toHaveProperty("error");
      if (!("value" in opened)) throw opened.error;
      const session = await CloudGameSession.create(opened.value);
      expect(session.canExecute).toBe(true); expect(session.state).toEqual(expected);
      expect(await session.checkpointNow("ordinary")).toBe(true);
      expect(server.operationCount("account-a")).toBe(1); expect(server.usageCount("account-a")).toBe(0);
      expect((await second.transport.list()).map(row => row.campaignId)).toEqual([campaignId]);
      session.dispose();
    } finally { acknowledgement.resolve(); await uploading; }
  });

  it.each([[false, false], [false, true], [true, false], [true, true]])("reclaims an ordinary single-device account clinic without a branch (QA source=%s, pending=%s)", async (qaSource, pending) => {
    const fixture = await syncFixture(), server = new FakeCloudServer(), nextDocument = persistentDevice(server, "account-a");
    let storage: Pick<Storage, "getItem"> | undefined;
    if (qaSource) {
      const local = appendLocalCampaign(createFreshProfile(), createInitialGameState().founder, "Synthetic clinic 1", Date.now(), "cloud-qa-1", false);
      local.campaign.state.paused = true;
      const serializedState = serializeGameState(local.campaign.state), campaign = cloudCampaignMetadata(local.profile);
      const prepared = await prepareCloudEvidenceImport({ serializedState, campaign, operationId: "qa.fixture" });
      fixture.prepared = prepared; fixture.confirmed.campaignId = campaign.campaignId;
      const text = JSON.stringify({ ...local.profile, campaigns: [{ ...local.campaign, state: undefined, serializedState }] });
      storage = { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a") ? text : null };
    }
    const campaignId = fixture.confirmed.campaignId, first = nextDocument();
    await importLocalCloudCampaign({ id: "local.fixture", sourceKey: "local.fixture", unowned: false,
      campaign: fixture.prepared.envelope.campaign, serializedState: fixture.prepared.sourceRecovery.text,
      bytes: fixture.prepared.sourceRecovery.utf8Bytes, facilityLevel: 1, error: null }, fixture.prepared.envelope.campaign.name, first.transport, first.entryStore);
    const original = await openAutomaticCloudCampaign({ runtime: first, campaignId, storage }), old = await CloudGameSession.create(original);
    expect(old.canExecute).toBe(true);
    expect((await first.entryStore.entries()).filter(row => row.key.startsWith("conflict:") || row.key.startsWith("older-copy:"))).toHaveLength(0);
    old.execute({ type: "SET_PAUSED", paused: false, operationId: "document.play" }, PROTOTYPE_DOMAIN_CONTEXT);
    for (let index = 0; index < 3; index++) old.execute({ type: "ADVANCE_TICK", advancedAtRealMs: Date.now(), operationId: `document.tick.${index}` }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await old.durable()).toBe(true);
    if (!pending) expect(await old.checkpointNow("ordinary")).toBe(true);
    const expected = old.state, proof = await readWriterIdentity(first.entryStore, original.scope);
    expect(proof?.lease?.writerToken).toBe(server.account("account-a").campaigns.get(campaignId)!.token);
    // Silent kill: no pagehide, release, Save & Close or elapsed lease.
    old.dispose();
    const second = nextDocument(), reopened = await openAutomaticCloudCampaign({ runtime: second, campaignId, storage });
    const session = await CloudGameSession.create(reopened);
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(expected);
    expect(BigInt(server.account("account-a").campaigns.get(campaignId)!.generation)).toBeGreaterThan(BigInt(proof!.lease!.writerGeneration));
    expect(await session.checkpointNow("ordinary")).toBe(true);
    expect((await second.transport.list()).map(row => row.campaignId)).toEqual([campaignId]);
    expect((await second.entryStore.entries()).some(row => row.key.startsWith("promotion:") || row.key.startsWith("separate:"))).toBe(false);
    expect((await second.entryStore.entries()).filter(row => row.key.startsWith("conflict:") || row.key.startsWith("older-copy:"))).toHaveLength(0);
    await expect(first.transport.renew(proof!.lease!)).rejects.toMatchObject({ code: "writer" });
    await expect(first.transport.release(proof!.lease!)).rejects.toMatchObject({ code: "writer" });
    session.dispose();
  });

  it("does not acquire before a delayed durable writer-intent write completes", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const store = new MemoryCloudEntryStore(), held = deferred(), started = deferred(), write = store.write.bind(store);
    vi.spyOn(store, "write").mockImplementation(async (key, value) => {
      if (key.startsWith("writer:")) { started.resolve(); await held.promise; }
      return write(key, value);
    });
    const coordinator = new CloudSyncCoordinator({ scope: { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId },
      transport: server.transport("account-a"), cache: new MemoryCloudCache(), entryStore: store, enabled: true });
    await coordinator.open(); vi.useFakeTimers();
    try {
      const acquiring = coordinator.startWriter(); await started.promise;
      await vi.advanceTimersByTimeAsync(1_501);
      expect(server.calls.filter(call => call.method === "acquire")).toHaveLength(0);
      held.resolve(); expect(await acquiring).toBe(true);
      expect((await readWriterIdentity(store, coordinator.scope))?.lease?.writerToken).toBe(server.account("account-a").campaigns.get(fixture.confirmed.campaignId)!.token);
    } finally { held.resolve(); coordinator.dispose(); }
  });

  it("waits for a valid retained writer read beyond 1.5 seconds instead of treating its own token as absent", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const store = new MemoryCloudEntryStore(), scope = { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId };
    const coordinator = new CloudSyncCoordinator({ scope, transport: server.transport("account-a"), cache: new MemoryCloudCache(), entryStore: store, enabled: true });
    await coordinator.open(); expect(await coordinator.startWriter()).toBe(true);
    const proof = await readWriterIdentity(store, scope), held = deferred(), read = store.read.bind(store);
    vi.spyOn(store, "read").mockImplementation(async key => { await held.promise; return read(key); });
    vi.useFakeTimers();
    try {
      let settled = false; const reopening = readWriterIdentity(store, scope).then(value => { settled = true; return value; });
      await vi.advanceTimersByTimeAsync(2_000); expect(settled).toBe(false);
      held.resolve(); expect(await reopening).toEqual(proof);
    } finally { held.resolve(); coordinator.dispose(); }
  });

  it("reclaims a persisted acquisition intent after its own checkpoint advanced the account revision", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const store = new MemoryCloudEntryStore(), cache = new MemoryCloudCache(), scope = { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId };
    const write = store.write.bind(store), cas = store.compareAndSet.bind(store);
    const receiptDenied = (key: string, value: unknown) => { if (key.startsWith("writer:") && !(value as { acquisition: unknown }).acquisition) throw new DOMException("quota", "QuotaExceededError"); };
    vi.spyOn(store, "write").mockImplementation(async (key, value) => { receiptDenied(key, value); return write(key, value); });
    vi.spyOn(store, "compareAndSet").mockImplementation(async (key, expected, value) => { receiptDenied(key, value); return cas(key, expected, value); });
    const make = () => new CloudSyncCoordinator({ scope, transport: server.transport("account-a"), cache, entryStore: store, enabled: true });
    const original = make(); await original.open(); expect(await original.focus()).toBe(true);
    const old = await CloudGameSession.create(original);
    old.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "intent.advanced" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await old.checkpointNow("ordinary")).toBe(true);
    const proof = await readWriterIdentity(store, scope); expect(proof?.acquisition?.expectedRevision).toBe("1");
    expect((await server.transport("account-a").head(scope.campaignId)).revision).toBe("2");
    old.dispose(); const next = make(); expect(await next.open()).toBe(true);
    expect(await next.focus()).toBe(true);
    expect(next.view).toMatchObject({ canExecute: true, failure: null, pending: false });
    expect((await CloudGameSession.create(next)).state.simulationSpeed).toBe(2);
    expect(server.operationCount("account-a")).toBe(1); // Renew/rotation cannot replay the checkpoint.
    next.dispose();
  });

  it("bounds a frozen journal write without sending an unjournaled acquisition or a late RPC", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const store = new MemoryCloudEntryStore(), cache = new MemoryCloudCache(), held = deferred(), started = deferred(), write = store.write.bind(store);
    vi.spyOn(store, "write").mockImplementation(async (key, value) => { if (key.startsWith("writer:")) { started.resolve(); await held.promise; } return write(key, value); });
    const scope = { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId };
    const coordinator = new CloudSyncCoordinator({ scope, transport: server.transport("account-a"), cache, entryStore: store, enabled: true });
    await coordinator.open(); const before = await cache.read(scope); vi.useFakeTimers();
    try {
      const opening = coordinator.startWriter(); await started.promise;
      await vi.advanceTimersByTimeAsync(CLOUD_READ_TIMEOUT_MS); expect(await opening).toBe(false);
      expect(server.calls.some(call => call.method === "acquire")).toBe(false);
      held.resolve(); await vi.advanceTimersByTimeAsync(0); vi.useRealTimers();
      expect(await cache.read(scope)).toEqual(before); expect(server.calls.some(call => call.method === "acquire")).toBe(false);
    } finally { held.resolve(); coordinator.dispose(); }
  });

  it("a late old-document lease journal cannot replace a newer document's acquisition proof", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const store = new MemoryCloudEntryStore(), scope = { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId };
    const oldLease = await server.transport("account-a").acquire({ campaignId: scope.campaignId, expectedRevision: "1", expectedWriterGeneration: "0", operationId: "old.document", writerToken: "a".repeat(64), takeover: false });
    const held = deferred(), started = deferred(), read = store.read.bind(store); let first = true;
    vi.spyOn(store, "read").mockImplementation(async key => { if (first) { first = false; started.resolve(); await held.promise; } return read(key); });
    const late = writeWriterIdentity(store, scope, oldLease); await started.promise;
    const acquisition = { campaignId: scope.campaignId, expectedRevision: "1", expectedWriterGeneration: "1", operationId: "new.document", writerToken: "b".repeat(64), takeover: true };
    expect(await writeWriterIdentity(store, scope, oldLease, acquisition)).toBe(true);
    const rejected = expect(late).rejects.toMatchObject({ code: "writer" }); held.resolve(); await rejected;
    expect((await readWriterIdentity(store, scope))?.acquisition).toEqual(acquisition);
  });

  it("a disposed document cannot invoke automatic opening after its delayed foreground check completes", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(); server.seed("account-a", fixture.confirmed);
    const transport = server.transport("account-a"), held = deferred(), started = deferred(), head = transport.head.bind(transport);
    const coordinator = new CloudSyncCoordinator({ scope: { backendId: "qa", accountId: "account-a", campaignId: fixture.confirmed.campaignId },
      transport, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore(), enabled: true });
    await coordinator.open(); expect(await coordinator.focus()).toBe(true);
    const automatic = vi.fn(async () => true), session = await CloudGameSession.create(coordinator, undefined, automatic);
    vi.spyOn(transport, "head").mockImplementation(async id => { started.resolve(); await held.promise; return head(id); });
    const reconnecting = session.reconnect(); await started.promise;
    session.dispose(); held.resolve(); expect(await reconnecting).toBe(false);
    expect(automatic).not.toHaveBeenCalled();
  });
});
