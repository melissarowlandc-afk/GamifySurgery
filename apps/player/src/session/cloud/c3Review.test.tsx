import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CloudSyncCoordinator, type CloudSyncView } from "./coordinator";
import { copyDescendsFrom } from "./copySelection";
import { CloudGameSession } from "./gameSession";
import { MemoryCloudEntryStore } from "./entryStorage";
import { ControllableOperationalPort, operationalSessionFixture } from "./operationalSessionTestSupport";
import { runCloudCodecTask } from "./codecTasks";
import { snapshotCopy } from "./snapshotCodec";
import { CloudSyncError, type CloudTransport, type SnapshotLineage } from "./transport";
import { MemoryCloudCache } from "./cache";
import { deferred, syncHarness } from "./syncTestSupport";
import { cloudCheckNeedsLoading, cloudStatusText } from "../../ui/CloudSaveControls";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { decompressCloudText } from "./codecCompression";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
const codec = { run: runCloudCodecTask };

async function mounted(lineage?: SnapshotLineage) {
  const h = await operationalSessionFixture({}, undefined, false);
  h.session.dispose();
  const cache = lineage ? new MemoryCloudCache() : h.cache;
  if (lineage) h.server.seed(h.scope.accountId, await snapshotCopy(h.session.state, h.session.metadata, "1", h.clock.wall, lineage));
  const failed = new Set<string>(), transport = new Proxy(h.server.transport(h.scope.accountId), { get(target, key) {
    const method = Reflect.get(target, key);
    return typeof method !== "function" ? method : async (...args: unknown[]) => {
      if (failed.has(String(key))) throw new CloudSyncError("network");
      return method.apply(target, args);
    };
  } }) as CloudTransport;
  const entryStore = new MemoryCloudEntryStore();
  const coordinator = new CloudSyncCoordinator({ scope: h.scope, cache, transport, entryStore, clock: h.clock, enabled: true, codec });
  expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter(true)).toBe(true); expect(coordinator.resume()).toBe(true);
  const ports: ControllableOperationalPort[] = [], replace = vi.fn(async (_checked: boolean) => true);
  const session = await CloudGameSession.create(coordinator, undefined, replace, { operational: { createPort: () => {
    const port = new ControllableOperationalPort(); ports.push(port); return port;
  } } });
  const key = cloudCampaignStorageKey(h.scope), owner = (await cache.journal.head(key))!.owner;
  const window = async () => {
    for (let i = 0; i < 60; i++) { h.clock.advance(5_000); await vi.advanceTimersByTimeAsync(5_000); await session.pulse(); }
  };
  return { ...h, cache, coordinator, session, failed, transport, entryStore, ports, replace, key, owner, window };
}

it.each(["equal", "increasing", "shared-migration-root"] as const)("rejects false native ancestry with valid %s metadata", async mode => {
  const lineage = mode === "shared-migration-root" ? { branchId: `migration.${"a".repeat(64)}`, sequence: 0, parents: ["a".repeat(64)] } :
    { branchId: "c4-forged-metadata", sequence: mode === "increasing" ? 20 : 10, parents: [] };
  const h = await mounted(lineage);
  try {
    const base = h.coordinator.confirmed!;
    const verified = await codec.run({ kind: "hydrate", input: { ...base, expectedRevision: base.revision,
      expectedCampaignId: base.campaignId, expectedBaselineId: base.baselineId } });
    const forged = await snapshotCopy({ ...verified.state, simulationSpeed: 4 }, verified.campaign, base.revision, h.clock.wall,
      { ...base.lineage!, sequence: mode === "shared-migration-root" ? 20 : 10 });
    expect(forged.snapshot.uncompressedSha256).not.toBe(base.snapshot.uncompressedSha256);
    // The pre-C2 compatibility/ranking predicate intentionally remains loose.
    // A mounted owner must independently reject this different content hash.
    expect(copyDescendsFrom(base, forged)).toBe(true);
    h.failed.add("capabilities"); await h.session.reconnect();
    expect(h.session.canExecute).toBe(true);
    h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!.confirmed = forged;
    h.failed.clear(); h.clock.advance(300_000); await h.session.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect((await h.transport.load(h.scope.campaignId)).snapshot.uncompressedSha256).toBe(forged.snapshot.uncompressedSha256);
    expect(h.coordinator.confirmed!.snapshot.uncompressedSha256).toBe(base.snapshot.uncompressedSha256);
    expect(h.replace.mock.calls).toEqual([[false]]);
    expect(h.ports).toHaveLength(1); expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
    // The cold-selection API cannot be used as a back door on a mounted owner.
    expect(await h.coordinator.adoptAutomaticCopy(base, forged, [])).toBe(false);
  } finally { h.session.dispose(); }
});

it("periodic-only recovery never republishes checking after a mounted online outage past grace, and uploads in place", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
  vi.spyOn(Math, "random").mockReturnValue(.5);
  const h = await mounted(), observed: CloudSyncView[] = [];
  const stop = h.coordinator.subscribe(() => observed.push(h.coordinator.view));
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "periodic-before" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true);
    for (const method of ["capabilities", "head", "load", "list", "renew", "acquire", "commit", "operation"]) h.failed.add(method);
    for (let n = 0; n < 3; n++) await h.window();
    expect(observed.filter(view => view.checking || cloudCheckNeedsLoading(view) || view.phase === "checking")).toEqual([]);
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
    expect(h.session.canExecute).toBe(true);
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "periodic-during" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true); const expected = h.session.state;
    h.failed.clear(); await h.window();
    expect(h.coordinator.view).toMatchObject({ pending: false, failure: null, localDurable: true, canExecute: true });
    expect(observed.filter(view => view.phase === "checking")).toEqual([]);
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1); expect(h.ports[0]!.stopped).toBe(false);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner); expect(h.session.state).toEqual(expected);
    const saved = await h.transport.load(h.scope.campaignId);
    const verified = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
    expect(verified.state).toEqual(expected);
  } finally { stop(); h.session.dispose(); }
});

it("uses its last acknowledged revision and hash for later in-place recovery without persisting proof data", async () => {
  const h = await mounted();
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "c4-before-own-ack" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.checkpointNow("purchase")).toBe(true);
    const acknowledged = h.coordinator.confirmed!;
    expect(acknowledged.revision).toBe("2");
    h.failed.add("capabilities"); await h.session.reconnect();
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "c4-after-own-ack" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true); const expected = h.session.state;
    h.failed.clear(); h.clock.advance(300_000); await h.session.pulse();
    expect(h.coordinator.view).toMatchObject({ pending: false, failure: null, canExecute: true, revision: "3" });
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
    const saved = await h.transport.load(h.scope.campaignId);
    const envelope = JSON.parse(await decompressCloudText(saved.snapshot));
    expect(Object.keys(envelope).sort()).toEqual(["campaign", "cloudFormatVersion", "gameState", "lineage"]);
    expect(Object.keys(envelope.lineage).sort()).toEqual(["branchId", "parents", "sequence"]);
    const loaded = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
    expect(loaded.state).toEqual(expected);
    expect(JSON.stringify(h.coordinator.recoveryEntry)).not.toContain("mountedBase");
    expect(JSON.stringify((await h.cache.journal.read(h.key))!.snapshot.seed)).not.toContain("offlineOpeningBase");
  } finally { h.session.dispose(); }
});

it("requires full selection for a different revision even when the account snapshot hash is identical", async () => {
  const h = await mounted();
  try {
    const base = h.coordinator.confirmed!;
    h.failed.add("capabilities"); await h.session.reconnect();
    h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!.confirmed = { ...base, revision: "2" };
    h.failed.clear(); h.clock.advance(300_000); await h.session.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect(h.replace.mock.calls).toEqual([[false]]);
    expect(h.coordinator.confirmedRevision).toBe(base.revision); expect(h.ports).toHaveLength(1);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
  } finally { h.session.dispose(); }
});

it("does not treat a retained offline projection as a confirmed account base merely because its metadata matches", async () => {
  const h = await operationalSessionFixture({}, undefined, false), base = h.coordinator.confirmed!;
  const copy = await snapshotCopy({ ...h.session.state, simulationSpeed: 4 }, h.session.metadata, base.revision, h.clock.wall, base.lineage!);
  h.session.dispose();
  const coordinator = new CloudSyncCoordinator({ scope: h.scope, cache: h.cache, entryStore: new MemoryCloudEntryStore(),
    transport: h.server.transport(h.scope.accountId), clock: h.clock, codec, enabled: true });
  expect(await coordinator.restoreVerifiedOffline(copy)).toBe(true);
  const replace = vi.fn(async (_checked: boolean) => true);
  const session = await CloudGameSession.create(coordinator, undefined, replace, { operational: false });
  try {
    h.clock.advance(300_000); await session.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect(replace.mock.calls).toEqual([[false]]);
    expect(session.state.simulationSpeed).toBe(4); expect(coordinator.confirmed!.snapshot).toEqual(copy.snapshot);
  } finally { session.dispose(); }
});

it.each(["checksum", "owner"] as const)("preserves a post-offline %s journal fence during in-place proof", async kind => {
  const h = await mounted();
  try {
    h.failed.add("capabilities"); await h.session.reconnect(); expect(h.session.canExecute).toBe(true);
    const expected = h.session.state, data = (await h.cache.journal.read(h.key))!;
    if (kind === "owner") await h.cache.journal.bind(h.key, "c4-other-document-owner", data.head, data.snapshot.seed, data.snapshot.sha256);
    else h.cache.journal.data.get(h.key)!.snapshots.get(data.head.snapshotThrough)!.sha256 = "0".repeat(64);
    h.failed.clear(); h.clock.advance(300_000); await h.session.pulse();
    expect(h.session.canExecute).toBe(false);
    expect(h.coordinator.view.failure).toBe(kind === "checksum" ? "corrupt" : "storage");
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    // The existing integrity/owner fence may pause the projection immediately;
    // every other game/learning field and the account bytes stay unchanged.
    expect({ ...h.session.state, paused: expected.paused }).toEqual(expected);
  } finally { h.session.dispose(); }
});

it("rejects a lease that expires during in-place recovery, then retries the owned session without a writer fence or reload", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
  const h = await mounted(), started = deferred(), held = deferred();
  let retry: Promise<boolean> | undefined;
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "expiry-pending" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true); const expected = h.session.state;
    h.failed.add("capabilities"); await h.session.reconnect();
    expect(h.session.canExecute).toBe(true);
    h.failed.clear(); h.clock.advance(70_000);
    const acquire = h.transport.acquire;
    vi.spyOn(h.transport, "acquire").mockImplementationOnce(async request => {
      const lease = await acquire(request); started.resolve(); await held.promise; return lease;
    });
    retry = h.session.reconnect(); await started.promise;
    // The deterministic coordinator/server clock advances past this grant's
    // expiry before its reply; no timer fires or new authority is invented.
    h.clock.advance(61_000); held.resolve(); await retry;
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: true, failure: "network", localDurable: true });
    h.clock.advance(300_000); await h.session.pulse();
    expect(h.coordinator.view).toMatchObject({ pending: false, failure: null, canExecute: true, localDurable: true });
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1); expect(h.ports[0]!.stopped).toBe(false);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner); expect(h.session.state).toEqual(expected);
  } finally { held.resolve(); await retry?.catch(() => {}); h.session.dispose(); }
});

it.each(["focus", "online", "visibility"] as const)("keeps %s recovery inside the durable shell after repeated transient failures", async trigger => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
  const h = await mounted(), observed: CloudSyncView[] = [];
  const stop = h.coordinator.subscribe(() => observed.push(h.session.syncView));
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: `return-${trigger}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true);
    for (const name of ["capabilities", "head", "load", "list", "renew", "commit", "acquire", "operation"]) h.failed.add(name);
    for (let n = 0; n < 60; n++) {
      h.clock.advance(15_000); await vi.advanceTimersByTimeAsync(15_000);
      if (trigger === "online") h.coordinator.markOffline();
      if (trigger === "visibility") h.coordinator.markBackground();
      await h.session.foreground(trigger === "online");
    }
    expect(h.session.canExecute).toBe(true);
    expect(observed.filter(view => view.checking || cloudCheckNeedsLoading(view) || view.phase === "checking")).toEqual([]);
    h.failed.clear(); await h.window();
    expect(h.coordinator.view).toMatchObject({ pending: false, failure: null, localDurable: true, canExecute: true });
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1); expect(h.ports[0]!.stopped).toBe(false);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
  } finally { stop(); h.session.dispose(); }
});

it("keeps the pending/saving contract after connectivity clears, until the exact upload is acknowledged", async () => {
  const h = await mounted(), started = deferred(), held = deferred();
  let retry: Promise<boolean> | undefined;
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "status-pending" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    h.failed.add("capabilities"); await h.session.reconnect();
    h.failed.clear(); h.clock.advance(300_000);
    const commit = h.transport.commit;
    vi.spyOn(h.transport, "commit").mockImplementation(async operation => { started.resolve(); await held.promise; return commit(operation); });
    retry = h.session.reconnect(); await started.promise;
    expect(h.session.syncView).toMatchObject({ phase: "saving", failure: null, pending: true, localDurable: true, checking: false });
    // Healthy autosaves deliberately have no banner. No "saved" or safe-close
    // claim is rendered; Save & Close awaits this same pending receipt.
    expect(cloudStatusText(h.session.syncView)).toBeNull(); expect(cloudCheckNeedsLoading(h.session.syncView)).toBe(false);
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    held.resolve(); await retry;
    await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ pending: false, failure: null, localDurable: true }));
  } finally { held.resolve(); await retry?.catch(() => {}); h.session.dispose(); }
});

it("keeps a newer durable command when its owned journal advances during the recovery proof", async () => {
  const h = await mounted(), started = deferred(), held = deferred();
  let retry: Promise<boolean> | undefined, hold = true;
  try {
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "c4-before-proof" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true);
    h.failed.add("capabilities"); await h.session.reconnect();
    h.failed.clear(); h.clock.advance(300_000);
    const run = h.coordinator.codec.run.bind(h.coordinator.codec);
    vi.spyOn(h.coordinator.codec, "run").mockImplementation(async task => {
      const result = await run(task);
      if (hold && task.kind === "journalPrepare" && task.input.base) {
        hold = false; started.resolve(); await held.promise;
      }
      return result;
    });
    retry = h.session.reconnect(); await started.promise;
    expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "c4-during-proof" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await h.session.durable()).toBe(true); const expected = h.session.state;
    held.resolve(); await retry;
    await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ failure: null, pending: false, canExecute: true, localDurable: true }));
    expect(h.replace).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
    expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
    const saved = await h.transport.load(h.scope.campaignId);
    const loaded = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
    expect(loaded.state).toEqual(expected);
  } finally { held.resolve(); await retry?.catch(() => {}); h.session.dispose(); }
});

it("does not upload lineage-only changes after reconciling a committed legacy prefix", async () => {
  const f = await syncHarness(), entryStore = new MemoryCloudEntryStore();
  await f.coordinator.open(); await f.coordinator.startWriter(); f.coordinator.resume();
  const original = await CloudGameSession.create(f.coordinator);
  original.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "c3-legacy-receipt" }, PROTOTYPE_DOMAIN_CONTEXT);
  f.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
  expect(await original.checkpointNow("purchase")).toBe(false); const expected = original.state;
  original.dispose(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const transport = f.server.transport(f.scope.accountId), send = transport.commit, native: unknown[] = [];
  vi.spyOn(transport, "commit").mockImplementation(async operation => {
    const request = JSON.parse(operation.requestText), envelope = JSON.parse(await decompressCloudText(request.snapshot));
    native.push(envelope);
    return send(operation);
  });
  const coordinator = await openAutomaticCloudCampaign({ runtime: { ...f.scope, cache: f.cache, entryStore, region: "Synthetic", transport },
    campaignId: f.scope.campaignId, clock: f.clock });
  const session = await CloudGameSession.create(coordinator);
  try {
    expect(session.state).toEqual(expected); expect(await session.checkpointNow("purchase")).toBe(true);
    expect(native).toHaveLength(1);
    expect(f.server.operationCount(f.scope.accountId)).toBe(2);
  } finally { session.dispose(); }
});
