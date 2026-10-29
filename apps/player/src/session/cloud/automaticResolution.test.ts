import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache } from "./cache";
import { CloudCacheError } from "./codecCache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { CloudSyncCoordinator } from "./coordinator";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { cloudCopyFamily } from "./copySelection";
import { discoverClinicCopies, protectClinicCopy } from "./retainedCopies";
import { runCloudCodecTask, type CloudCodecExecutor } from "./codecTasks";
import { deferred, syncFixture, syncHarness } from "./syncTestSupport";
import { encodeCloudEvidenceCheckpoint } from "./codecEvidence";
import { CloudCodecError, logicalJsonText, sha256Utf8 } from "./codecJson";
import { accountStorageKey } from "../accountStorageKey";
import { PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { CLOUD_RENEW_MS, CloudSyncError } from "./transport";
import { listOlderClinicCopies, exportOlderClinicCopy, restoreOlderClinicCopy } from "./olderCopies";
import { importSeparateCloudCampaign } from "./importCampaigns";

const codec = { run: runCloudCodecTask };
async function rig(cache?: MemoryCloudCache) {
  const h = await syncHarness({ cache }), entryStore = new MemoryCloudEntryStore();
  const runtime = { ...h.scope, region: "test", cache: h.cache, entryStore, transport: h.server.transport(h.scope.accountId) };
  const resolve = (campaignId = h.scope.campaignId) => openAutomaticCloudCampaign({ runtime, campaignId, clock: h.clock, codec });
  return { ...h, runtime, entryStore, resolve };
}
async function localBranch(h: Awaited<ReturnType<typeof rig>>, ticks: number, speed: 2 | 4 = 2) {
  const coordinator = new CloudSyncCoordinator({ ...h.runtime, scope: h.scope, clock: h.clock, enabled: true });
  expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter(true)).toBe(true); expect(coordinator.resume()).toBe(true);
  const session = await CloudGameSession.create(coordinator);
  session.execute({ type: "SET_PAUSED", paused: false, operationId: `start.${speed}` }, PROTOTYPE_DOMAIN_CONTEXT);
  session.execute({ type: "SET_SIMULATION_SPEED", speed, operationId: `speed.${speed}` }, PROTOTYPE_DOMAIN_CONTEXT);
  for (let index = 0; index < ticks; index++) session.execute({ type: "ADVANCE_TICK", advancedAtRealMs: index, operationId: `tick.${speed}.${index}` }, PROTOTYPE_DOMAIN_CONTEXT);
  expect(await session.durable()).toBe(true);
  return { coordinator, session };
}
async function divergent(h: Awaited<ReturnType<typeof rig>>, localTicks: number, accountTicks: number) {
  const local = await localBranch(h, localTicks);
  const otherCache = new MemoryCloudCache();
  const otherRig = { ...h, runtime: { ...h.runtime, cache: otherCache, entryStore: new MemoryCloudEntryStore() } };
  const remote = await localBranch(otherRig, accountTicks, 4);
  expect(await remote.session.checkpointNow("purchase")).toBe(true);
  local.session.dispose(); remote.session.dispose();
  return { local, remote };
}

describe("automatic verified clinic progress selection", () => {
  describe.each([true, false])("durably paused winning branch (local newer=%s)", localNewer => {
    it.each([true, false])("keeps the exact paused projection with free slot=%s", async freeSlot => {
      const h = await rig(), local = await localBranch(h, localNewer ? 3 : 1);
      expect(local.session.execute({ type: "SET_PAUSED", paused: true, operationId: "local.paused.fixture" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await local.session.durable()).toBe(true); const localState = local.session.state;
      const remoteRuntime = { ...h.runtime, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() };
      const remote = await localBranch({ ...h, runtime: remoteRuntime }, localNewer ? 1 : 3, 4);
      expect(remote.session.execute({ type: "SET_PAUSED", paused: true, operationId: "remote.paused.fixture" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await remote.session.checkpointNow("purchase")).toBe(true); const remoteState = remote.session.state;
      local.session.dispose(); remote.session.dispose();
      if (!freeSlot) {
        const other = await syncFixture("unrelated.paused-slot");
        const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: other.prepared.checkpoint,
          campaign: { ...other.prepared.envelope.campaign, name: "Unrelated archived clinic", status: "archived" },
          source: other.prepared.sourceRecovery, expectedRevision: "1", operationId: "unrelated.paused.fixture" });
        h.server.seed(h.scope.accountId, { ...other.confirmed, snapshot: encoded.snapshot });
      }
      const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
      try {
        const expected = localNewer ? localState : remoteState;
        expect(session.canExecute).toBe(true); expect(session.state.paused).toBe(true);
        expect(session.state).toEqual({ ...expected, campaignId: session.state.campaignId });
        expect(await session.checkpointNow("ordinary")).toBe(true);
        const opened = await h.resolve();
        try { expect((await CloudGameSession.create(opened)).state).toEqual(session.state); }
        finally { opened.dispose(); }
      } finally { session.dispose(); }
    });
  });
  describe.each(["current", "retained import"] as const)("a newer %s copy", source => {
    it.each(["worker_data_clone", "worker_payload"])("never skips it after %s to choose an older account head", async code => {
      const h = await rig(), local = await localBranch(h, 2), entry = local.coordinator.recoveryEntry!;
      try {
        const following = entry.recovery!.following!, failure = new CloudCodecError(code, "Invalid worker input");
        if (source === "retained import") {
          const requestText = JSON.stringify({ ...h.confirmed, snapshot: following.snapshot,
            evidence: { header: h.confirmed.evidence.header, records: [...h.confirmed.evidence.records, ...following.evidence.records] } });
          await h.entryStore.create("import:worker-boundary", { operation: { requestText, requestSha256: await sha256Utf8(requestText) } });
        }
        const original = await h.entryStore.entries(), cached = await h.cache.read(h.scope);
        const failedCodec: CloudCodecExecutor = { run(task) {
          if (task.kind === "inspectCopy" && task.input.snapshot.uncompressedSha256 === following.snapshot.uncompressedSha256) return Promise.reject(failure);
          return runCloudCodecTask(task);
        } };
        await expect(discoverClinicCopies({ scope: h.scope, family: await cloudCopyFamily(h.scope.campaignId), codec: failedCodec,
          store: h.entryStore, entries: source === "current" ? [entry] : [], account: [h.confirmed] })).rejects.toBe(failure);
        expect(await h.entryStore.entries()).toEqual(original); expect(await h.cache.read(h.scope)).toEqual(cached);
        expect(await h.runtime.transport.load(h.scope.campaignId)).toEqual(h.confirmed);
      } finally { local.session.dispose(); }
    });
  });
  it("resumes a pending descendant, uploads once, and keeps its immutable rows", async () => {
    const h = await rig(), local = await localBranch(h, 2), expected = local.session.state.facilityTick;
    const rows = local.coordinator.pendingCandidate!.evidence.records;
    local.session.dispose();
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true); expect(session.state.facilityTick).toBe(expected);
    expect(await session.checkpointNow("ordinary")).toBe(true);
    const account = await h.runtime.transport.load(h.scope.campaignId);
    expect(account.evidence.records.slice(-rows.length)).toEqual(rows);
    expect((await h.runtime.transport.list())).toHaveLength(1);
    session.dispose();
  });
  it.each([true, false])("automatically keeps both divergent copies (local newer: %s)", async localNewer => {
    const h = await rig(); const branches = await divergent(h, localNewer ? 3 : 1, localNewer ? 1 : 3);
    const expected = Math.max(branches.local.session.state.facilityTick, branches.remote.session.state.facilityTick);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true); expect(session.state.facilityTick).toBe(expected);
    expect(session.metadata.name).toBe(h.prepared.envelope.campaign.name);
    const summaries = await h.runtime.transport.list();
    expect(summaries).toHaveLength(2);
    expect(summaries.filter(row => row.status === "archived")).toMatchObject([{ name: expect.stringContaining("(older copy)") }]);
    const again = await h.resolve();
    expect((await CloudGameSession.create(again)).state.facilityTick).toBe(expected);
    session.dispose(); again.dispose();
  });
  it("automatically fences a visible other writer; its old writer cannot commit or release", async () => {
    const h = await rig(), local = await localBranch(h, 0);
    const secondRuntime = { ...h.runtime, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() };
    const opened = await openAutomaticCloudCampaign({ runtime: secondRuntime, campaignId: h.scope.campaignId, clock: h.clock, codec });
    expect(opened.view.canExecute).toBe(true);
    expect(await local.session.checkpointNow("ordinary")).toBe(false);
    expect(local.coordinator.view.failure).toBe("writer");
    expect(await local.coordinator.saveAndClose()).toBe(false);
    expect(opened.view.canExecute).toBe(true);
    local.session.dispose(); opened.dispose();
  });
  it("finds a newer protected copy even when the current cache points to older progress", async () => {
    const h = await rig(), local = await localBranch(h, 5), expected = local.session.state.facilityTick;
    const family = await cloudCopyFamily(h.scope.campaignId);
    const copies = await discoverClinicCopies({ scope: h.scope, family, codec, store: h.entryStore,
      entries: [local.coordinator.recoveryEntry!], account: [h.confirmed] });
    await protectClinicCopy(h.entryStore, family, copies[0]!, "previous recovery");
    local.session.dispose();
    const cached = await h.cache.read(h.scope); await h.cache.write({ schemaVersion: 1, scope: h.scope, confirmed: h.confirmed, recovery: null }, cached!.cacheRevision);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.state.facilityTick).toBe(expected); expect(session.canExecute).toBe(true);
    session.dispose();
  });
  it("reclaims only the protected older slot when full, retaining its exact bytes locally", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    const unrelated = await syncFixture("unrelated.clinic");
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: unrelated.prepared.checkpoint, campaign: { ...unrelated.prepared.envelope.campaign, name: "Other clinic" },
      source: unrelated.prepared.sourceRecovery, expectedRevision: "1", operationId: "other.name" });
    unrelated.confirmed = { ...unrelated.confirmed, snapshot: encoded.snapshot };
    h.server.seed(h.scope.accountId, unrelated.confirmed);
    const previous = await h.runtime.transport.load(h.scope.campaignId);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true);
    expect((await h.runtime.transport.list()).map(row => row.campaignId)).toContain("unrelated.clinic");
    expect(await h.runtime.transport.load("unrelated.clinic")).toEqual(unrelated.confirmed);
    const protectedCopies = (await h.entryStore.entries()).filter(row => row.key.startsWith("older-copy:"));
    expect(protectedCopies.some(row => JSON.stringify((row.value as any).copy) === JSON.stringify(previous))).toBe(true);
    session.dispose();
  });
  it("recovers a newer raw Day 2 profile even after enrollment and last-active cache replacement", async () => {
    const h = await rig(), local = await localBranch(h, 1);
    const rawState = { ...local.session.state, facilityTick: 1514, cash: 1131.8, clinicalXp: 72 };
    const sourceKey = accountStorageKey(PROTOTYPE_PROFILE_KEY, h.scope.accountId);
    const text = JSON.stringify({ schemaVersion: 2, campaigns: [{ ...local.session.metadata, serializedState: serializeGameState(rawState) }] });
    await h.entryStore.create(`raw:${sourceKey}:${await sha256Utf8(text)}`, { sourceKey, text, sha256: await sha256Utf8(text) });
    await h.entryStore.write(`enrolled:${h.scope.campaignId}`, { revision: "1" });
    await h.entryStore.write("last-active-campaign", { campaignId: h.scope.campaignId });
    local.session.dispose();
    const cache = await h.cache.read(h.scope);
    await h.cache.write({ schemaVersion: 1, scope: h.scope, confirmed: h.confirmed, recovery: null }, cache!.cacheRevision);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    const expected = deserializeGameState(serializeGameState(rawState));
    expect(session.state).toEqual({ ...expected, campaignId: session.state.campaignId });
    expect(session.state.facilityTick).toBe(1514);
    expect(session.canExecute).toBe(true);
    expect((await h.entryStore.entries()).find(row => row.key.startsWith(`raw:${sourceKey}:`))!.value).toEqual({ sourceKey, text, sha256: await sha256Utf8(text) });
    session.dispose();
  });
  it("does not prefer a later device timestamp or a larger balance over clinic time", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    const cache = await h.cache.read(h.scope), original = cache!.entry.recovery!.following!;
    expect(original.campaign.updatedAtRealMs).toBeGreaterThan(0);
    const changed = { ...original, campaign: { ...original.campaign, updatedAtRealMs: 0 } };
    // Metadata time is unrelated to game progress; re-encode its envelope so
    // the SHA/checkpoint verification is meaningful rather than bypassed.
    const copy = { ...cache!.entry.confirmed, snapshot: original.snapshot,
      evidence: { header: cache!.entry.confirmed.evidence.header, records: [...cache!.entry.confirmed.evidence.records, ...original.evidence.records] } };
    const { loadCloudEvidenceCheckpoint } = await import("./codecEvidence");
    const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision, expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: loaded.checkpoint, campaign: changed.campaign, source: loaded.source, operationId: "zero.clock", expectedRevision: "1",
      acknowledgedEvidence: { headerSha256: h.confirmed.evidence.header.uncompressedSha256, records: h.confirmed.evidence.records.length } });
    await h.cache.write({ ...cache!.entry, recovery: { ...cache!.entry.recovery!, following: { ...changed, snapshot: encoded.snapshot } } }, cache!.cacheRevision);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.state.facilityTick).toBe(loaded.state.facilityTick); expect(session.canExecute).toBe(true); session.dispose();
  });
  it("recovers a lost import acknowledgement without a second branch or history replay", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    h.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    // A temporary outage may continue verified local play, but the immutable
    // import receipt is resolved on the next online open.
    const first = await h.resolve(); first.dispose();
    const count = h.server.operationCount(h.scope.accountId), coordinator = await h.resolve();
    expect(coordinator.view.canExecute).toBe(true);
    expect(h.server.operationCount(h.scope.accountId)).toBe(count);
    expect(h.server.calls.filter(row => row.method === "importCampaign")).toHaveLength(1);
    expect((await h.runtime.transport.list())).toHaveLength(2);
    expect(h.server.usageCount(h.scope.accountId)).toBe(0); coordinator.dispose();
  });
  it("continues verified local progress offline without a server lease, then resolves/upload on reconnect", async () => {
    const h = await rig(), local = await localBranch(h, 1); local.session.dispose();
    const capabilities = h.runtime.transport.capabilities;
    h.runtime.transport.capabilities = async () => { throw new CloudSyncError("network"); };
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true); expect(coordinator.view.failure).toBe("network"); expect(coordinator.view.pending).toBe(true);
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "offline.local" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(true);
    const count = h.server.operationCount(h.scope.accountId);
    expect(await session.checkpointNow("ordinary")).toBe(false); expect(h.server.operationCount(h.scope.accountId)).toBe(count);
    session.dispose(); h.runtime.transport.capabilities = capabilities;
    const online = await h.resolve(), resumed = await CloudGameSession.create(online);
    expect(resumed.canExecute).toBe(true); expect(resumed.state.simulationSpeed).toBe(4);
    expect(await resumed.checkpointNow("ordinary")).toBe(true); resumed.dispose();
  });
  it.each(["revoked", "deleted"] as const)("never resurrects a %s account from retained bytes", async code => {
    const h = await rig(), local = await localBranch(h, 1); local.session.dispose();
    h.server.setAccess(h.scope.accountId, { admitted: code !== "revoked", deletionRequested: code === "deleted" });
    await expect(h.resolve()).rejects.toMatchObject({ code });
    h.runtime.transport.capabilities = async () => { throw new CloudSyncError("network"); };
    await expect(h.resolve()).rejects.toMatchObject({ code: "network" });
  });
  it("never clears/deletes a copy when its protected readback fails", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    const before = structuredClone([...h.server.account(h.scope.accountId).campaigns.values()]);
    const read = h.entryStore.read.bind(h.entryStore);
    vi.spyOn(h.entryStore, "read").mockImplementation(async key => key.startsWith("older-copy:") ? null : read(key));
    await expect(h.resolve()).rejects.toMatchObject({ code: "storage" });
    expect([...h.server.account(h.scope.accountId).campaigns.values()]).toEqual(before);
    expect(h.server.calls.some(row => row.method === "deleteCampaign" || row.method === "importCampaign")).toBe(false);
  });
  it("lists and faithfully exports older copies; support restores an independent campaign only when a slot is free", async () => {
    const h = await rig(), local = await localBranch(h, 1);
    const copies = await discoverClinicCopies({ scope: h.scope, family: await cloudCopyFamily(h.scope.campaignId), codec,
      store: h.entryStore, entries: [local.coordinator.recoveryEntry!], account: [h.confirmed] });
    const key = await protectClinicCopy(h.entryStore, await cloudCopyFamily(h.scope.campaignId), copies[0]!, "support");
    const listed = await listOlderClinicCopies(h.runtime); expect(listed).toHaveLength(1);
    expect(listed[0]!.facilityTick).toBe(local.session.state.facilityTick);
    expect(JSON.parse(await exportOlderClinicCopy(h.runtime, key)).retainedCopy.copy).toEqual(copies[0]!.copy);
    const id = await restoreOlderClinicCopy(h.runtime, key);
    expect(id).not.toBe(h.scope.campaignId); expect(await cloudCopyFamily(id)).not.toBe(await cloudCopyFamily(h.scope.campaignId));
    const loaded = await h.runtime.transport.load(id);
    expect(logicalJsonText(JSON.parse(JSON.stringify(loaded.evidence.records)))).toBe(logicalJsonText(JSON.parse(JSON.stringify(copies[0]!.copy.evidence.records))));
    expect(await restoreOlderClinicCopy(h.runtime, key)).toBe(id); local.session.dispose();
  });
  it("recovers after a kill/lost acknowledgement while reclaiming an older full-account slot", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    const unrelated = await syncFixture("unrelated.kill");
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: unrelated.prepared.checkpoint,
      campaign: { ...unrelated.prepared.envelope.campaign, name: "Unrelated clinic" }, source: unrelated.prepared.sourceRecovery,
      expectedRevision: "1", operationId: "other.kill" });
    h.server.seed(h.scope.accountId, { ...unrelated.confirmed, snapshot: encoded.snapshot });
    h.server.faults.push({ method: "deleteCampaign", at: "after", error: new CloudSyncError("network") });
    const interrupted = await h.resolve(); interrupted.dispose();
    expect((await h.runtime.transport.list()).map(row => row.campaignId)).toEqual(["unrelated.kill"]);
    const reopened = await h.resolve(), session = await CloudGameSession.create(reopened);
    expect(session.canExecute).toBe(true); expect(session.state.simulationSpeed).toBe(2);
    expect(session.metadata.name).toBe(h.prepared.envelope.campaign.name);
    expect((await h.runtime.transport.list())).toHaveLength(2);
    expect(h.server.calls.filter(row => row.method === "deleteCampaign")).toHaveLength(1);
    expect(h.server.calls.filter(row => row.method === "importCampaign")).toHaveLength(1);
    session.dispose();
  });
  it("bounds an opening head check and continues its verified device copy without granting a server lease", async () => {
    const h = await rig(), local = await localBranch(h, 1); local.session.dispose();
    const head = vi.spyOn(h.runtime.transport, "head").mockImplementation(() => new Promise(() => {}));
    vi.useFakeTimers();
    let pending: Promise<CloudSyncCoordinator>;
    try {
      pending = h.resolve();
      await vi.waitFor(() => expect(head).toHaveBeenCalled(), { timeout: 1_000 });
      await vi.advanceTimersByTimeAsync(30_001);
    } finally { vi.useRealTimers(); }
    const coordinator = await pending!;
    expect(coordinator.view).toMatchObject({ canExecute: true, failure: "network", phase: "waiting" });
    expect(h.server.calls.filter(row => row.method === "commit")).toHaveLength(0);
    coordinator.dispose();
  });
  it("finds an older release's separate newer campaign using its retained parent proof and makes it discoverable on another device", async () => {
    const h = await rig(), local = await localBranch(h, 3), expected = local.session.state.facilityTick;
    const entry = local.coordinator.recoveryEntry!, family = await cloudCopyFamily(h.scope.campaignId);
    const copies = await discoverClinicCopies({ scope: h.scope, family, codec, store: h.entryStore, entries: [entry], account: [h.confirmed] });
    await h.entryStore.create("conflict:legacy-upgrade", { scope: h.scope, device: entry, account: h.confirmed });
    const legacy = await importSeparateCloudCampaign(copies[0]!.copy, h.runtime.transport, h.entryStore);
    expect(legacy.marker.campaignId).toMatch(/^branch\./);
    // Account list ordering is not a naming/selection guarantee. A newer
    // legacy import may be listed first in production, unlike fake insertion order.
    const list = h.runtime.transport.list.bind(h.runtime.transport);
    vi.spyOn(h.runtime.transport, "list").mockImplementation(async () => [...await list()].reverse());
    local.session.dispose();
    const cached = await h.cache.read(h.scope);
    await h.cache.write({ ...entry, recovery: null }, cached!.cacheRevision);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.state.facilityTick).toBe(expected); expect(session.metadata.name).toBe(h.prepared.envelope.campaign.name);
    expect(session.state.campaignId).toMatch(/^auto\./); expect(session.canExecute).toBe(true);
    session.dispose();
    const another = { ...h.runtime, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() };
    const reopened = await openAutomaticCloudCampaign({ runtime: another, campaignId: h.scope.campaignId, clock: h.clock, codec });
    expect((await CloudGameSession.create(reopened)).state.facilityTick).toBe(expected);
    reopened.dispose();
  });
  it("ranks both frozen and following candidates instead of blindly choosing a stale following snapshot", async () => {
    const h = await rig(), local = await localBranch(h, 3), expected = local.session.state.facilityTick;
    const entry = local.coordinator.recoveryEntry!, candidate = entry.recovery!.following!;
    const requestText = JSON.stringify({ ...candidate, protocolVersion: 2, operationId: "retained.original-operation",
      campaignId: h.scope.campaignId, expectedRevision: "1", writerGeneration: "1", writerToken: "stale-writer-proof" });
    const operation = { operationId: "retained.original-operation", requestText, requestSha256: await sha256Utf8(requestText), createdAtMs: 0 };
    const older = await h.candidate(h.command(h.prepared.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "stale.following" }));
    local.session.dispose();
    const cached = await h.cache.read(h.scope);
    await h.cache.write({ ...entry, recovery: { ...entry.recovery!, inFlight: operation, following: older } }, cached!.cacheRevision);
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    expect(session.state.facilityTick).toBe(expected); expect(session.state.simulationSpeed).toBe(2);
    expect(session.canExecute).toBe(true);
    const protectedEntries = (await h.entryStore.entries()).filter(row => row.key.startsWith("conflict:"));
    expect(protectedEntries.some(row => (row.value as any).device?.recovery?.inFlight?.requestText === requestText)).toBe(true);
    session.dispose();
  });
  it("fences a cancelled offline opening even when its final durable write replies late", async () => {
    const h = await rig(), local = await localBranch(h, 1); local.session.dispose();
    h.runtime.transport.capabilities = async () => { throw new CloudSyncError("network"); };
    const held = deferred(), started = deferred(), write = h.cache.write.bind(h.cache);
    vi.spyOn(h.cache, "write").mockImplementation(async (...args) => { started.resolve(); await held.promise; return write(...args); });
    let cancelled = false, restoring: CloudSyncCoordinator | null = null;
    const restore = CloudSyncCoordinator.prototype.restoreVerifiedOffline;
    vi.spyOn(CloudSyncCoordinator.prototype, "restoreVerifiedOffline").mockImplementation(function (this: CloudSyncCoordinator, ...args) { restoring = this; return restore.apply(this, args); });
    const opening = openAutomaticCloudCampaign({ runtime: h.runtime, campaignId: h.scope.campaignId, clock: h.clock, codec, cancelled: () => cancelled });
    const rejected = expect(opening).rejects.toMatchObject({ code: "auth" });
    await started.promise; cancelled = true; held.resolve(); await rejected;
    expect((restoring as CloudSyncCoordinator | null)?.view.canExecute).toBe(false);
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    vi.restoreAllMocks();
  });
  it("checks for a restored service in the background without pausing offline play, then selects and uploads", async () => {
    const h = await rig(), local = await localBranch(h, 1); local.session.dispose();
    const capabilities = h.runtime.transport.capabilities;
    h.runtime.transport.capabilities = async () => { throw new CloudSyncError("network"); };
    const coordinator = await h.resolve();
    let session!: CloudGameSession, reconnected: CloudSyncCoordinator | null = null;
    const select = vi.fn(async () => {
      session.coordinator.pause(); reconnected = await h.resolve(); return true;
    });
    session = await CloudGameSession.create(coordinator, undefined, select);
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "background.offline" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true);
    h.clock.advance(CLOUD_RENEW_MS); await coordinator.pulse();
    expect(session.canExecute).toBe(true); expect(select).not.toHaveBeenCalled();
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    h.runtime.transport.capabilities = capabilities;
    h.clock.advance(CLOUD_RENEW_MS); await coordinator.pulse();
    expect(select).toHaveBeenCalledOnce();
    const online = await CloudGameSession.create(reconnected!);
    expect(online.canExecute).toBe(true); expect(online.state.simulationSpeed).toBe(4);
    expect(await online.checkpointNow("ordinary")).toBe(true);
    session.dispose(); online.dispose();
  });
  it("shows the moved-writer gate when the real transport classifies a reclaimed head as corrupt/missing", async () => {
    const h = await rig(); await divergent(h, 3, 1);
    const unrelated = await syncFixture("unrelated.moved");
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: unrelated.prepared.checkpoint,
      campaign: { ...unrelated.prepared.envelope.campaign, name: "Unrelated clinic" }, source: unrelated.prepared.sourceRecovery,
      operationId: "other.moved", expectedRevision: "1" });
    h.server.seed(h.scope.accountId, { ...unrelated.confirmed, snapshot: encoded.snapshot });
    const observer = new CloudSyncCoordinator({ ...h.runtime, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore(), scope: h.scope, enabled: true, clock: h.clock });
    expect(await observer.open()).toBe(true); expect(await observer.startWriter(true)).toBe(true); observer.resume();
    const winner = await h.resolve(); expect(winner.view.canExecute).toBe(true);
    const head = h.runtime.transport.head.bind(h.runtime.transport);
    h.runtime.transport.head = async id => {
      try { return await head(id); }
      catch (error) { if (error instanceof CloudSyncError && error.code === "deleted") throw new CloudSyncError("corrupt"); throw error; }
    };
    expect(await observer.focus()).toBe(false);
    expect(observer.view).toMatchObject({ canExecute: false, phase: "conflict", failure: "writer" });
    expect(winner.view.canExecute).toBe(true); observer.dispose(); winner.dispose();
  });
  it("repairs offline quota failure on Retry without uploading an unverified local base", async () => {
    class QuotaCache extends MemoryCloudCache {
      denied = false;
      override async write(...args: Parameters<MemoryCloudCache["write"]>) {
        if (this.denied) throw new CloudCacheError("quota");
        return super.write(...args);
      }
    }
    const cache = new QuotaCache(), h = await rig(cache), local = await localBranch(h, 1); local.session.dispose();
    h.runtime.transport.capabilities = async () => { throw new CloudSyncError("network"); };
    const coordinator = await h.resolve(), session = await CloudGameSession.create(coordinator);
    cache.denied = true;
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "offline.quota" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(false); expect(session.canExecute).toBe(false);
    cache.denied = false;
    expect(await session.reconnect()).toBe(false); // Account authority is still unavailable.
    expect(session.canExecute).toBe(true); expect(session.state.simulationSpeed).toBe(4);
    expect(coordinator.view.pending).toBe(true);
    expect(h.server.calls.some(row => row.method === "commit" || row.method === "importCampaign")).toBe(false);
    session.dispose();
  });
});
