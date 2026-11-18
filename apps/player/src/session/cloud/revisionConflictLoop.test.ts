import { afterEach, expect, it, vi } from "vitest";
import { CloudSyncCoordinator } from "./coordinator";
import { deferred, syncHarness } from "./syncTestSupport";
import { CloudSyncError, CLOUD_RENEW_MS } from "./transport";
import { SupabaseCloudTransport } from "./supabaseTransport";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { snapshotCopy } from "./snapshotCodec";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { numericClinic } from "./unsafeNumberTestSupport";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { logicalJsonText } from "./codecJson";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { ControllableOperationalPort } from "./operationalSessionTestSupport";
import { cloudCampaignStorageKey } from "../accountStorageKey";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it("stops the one-second stale renewal when local recovery preparation returns false", async () => {
  const f = await syncHarness(), transport = f.server.transport(f.scope.accountId);
  const coordinator = new CloudSyncCoordinator({ scope: f.scope, transport, cache: f.cache, clock: f.clock, enabled: true });
  try {
    expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
    coordinator.beforeReconnect(async () => false); // Committed local work has not finished preparing recovery.
    const renew = vi.spyOn(transport, "renew").mockRejectedValue(new CloudSyncError("revision"));
    f.clock.advance(CLOUD_RENEW_MS);
    for (let second = 0; second < 20; second++) { await coordinator.pulse(); f.clock.advance(1_000); }
    expect(renew).toHaveBeenCalledTimes(1);
    expect(coordinator.view).toMatchObject({ phase: "conflict", failure: "revision", localDurable: true, canExecute: false });
  } finally { coordinator.dispose(); f.coordinator.dispose(); }
});

it.each(["40001", "54000", "55000", "42501", "XX000"])("bounds repeated failed mutation RPCs (%s) despite a caller retrying every second", async code => {
  let now = 1_800_000_000_000, conflict = false;
  vi.spyOn(Math, "random").mockReturnValue(.5);
  const rpc = vi.fn(async (name: string) => {
    if (name === "beta2_cloud_list") return { data: { serverTime: new Date(now).toISOString(), campaigns: [{
      campaignId: "public.conflict", name: "Public clinic", status: "resumable", revision: "1", priorRevision: null,
      evidenceHighWater: 0, writerGeneration: "2", writerActive: true, updatedAt: new Date(now).toISOString(),
    }] }, error: null };
    return conflict ? { data: null, error: { code, message: "Cloud revision conflict" } } :
      { data: { revision: "1", writerGeneration: "2", expiresAt: new Date(now + 60_000).toISOString(), serverTime: new Date(now).toISOString() }, error: null };
  });
  const transport = new SupabaseCloudTransport({ rpc }, "public.account", async () => "public.account", () => now);
  const lease = await transport.acquire({ campaignId: "public.conflict", expectedRevision: "1", expectedWriterGeneration: "1",
    writerToken: "a".repeat(64), operationId: "public.acquire", takeover: false });
  conflict = true; rpc.mockClear();
  for (let second = 0; second < 60; second++) {
    await transport.head("public.conflict"); // Reads must remain available to reconcile the conflict.
    await expect(transport.renew(lease)).rejects.toBeInstanceOf(CloudSyncError);
    now += 1_000;
  }
  expect(rpc.mock.calls.filter(([name]) => name === "beta2_cloud_lease")).toHaveLength(3);
});

async function snapshotDevice(repaired = false, worker = false) {
  const f = await syncHarness(), entryStore = new MemoryCloudEntryStore(), transport = f.server.transport(f.scope.accountId);
  const state = createInitialGameState(undefined, { campaignId: f.scope.campaignId, campaignSeed: "cloud.test", createdAtRealMs: 0 });
  const campaign = f.prepared.envelope.campaign;
  const source = repaired ? numericClinic() : null;
  const current = source ? { ...source.state, campaignId: f.scope.campaignId } : state;
  let confirmed = await snapshotCopy(current, campaign, "57", f.clock.wall, { branchId: "public.revision", sequence: 0, parents: [] });
  if (source) {
    const envelope = JSON.parse(await decompressCloudText(confirmed.snapshot));
    envelope.gameState = JSON.parse(serializeGameState({ ...numericClinic(true).state, campaignId: f.scope.campaignId }));
    confirmed = { ...confirmed, snapshot: await compressCloudText(logicalJsonText(envelope), "gzip") };
  }
  f.server.setAccess(f.scope.accountId, { snapshotSaves: true }); f.server.seed(f.scope.accountId, confirmed);
  const coordinator = new CloudSyncCoordinator({ scope: f.scope, transport, cache: f.cache, clock: f.clock, entryStore, enabled: true });
  expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
  if (repaired) {
    const loaded = await coordinator.codec.run({ kind: "hydrate", input: { ...confirmed, expectedRevision: confirmed.revision,
      expectedCampaignId: confirmed.campaignId, expectedBaselineId: confirmed.baselineId } });
    expect(loaded.numberRepairs).toHaveLength(1);
  }
  const selected = vi.fn(async () => false);
  const ports: ControllableOperationalPort[] = [];
  const session = await CloudGameSession.create(coordinator, undefined, selected, { operational: worker ? { createPort: () => {
    const port = new ControllableOperationalPort(); ports.push(port); return port;
  } } : false });
  const runtime = { ...f.scope, region: "test", cache: f.cache, entryStore, transport };
  return { ...f, coordinator, session, transport, entryStore, runtime, selected, ports };
}

it.each(["pulses", "Retry"])("uploads after an unchanged-head revision rejection through %s without disposing the mounted session", async trigger => {
  const f = await snapshotDevice(false, true), commit = vi.spyOn(f.transport, "commit").mockRejectedValue(new CloudSyncError("revision"));
  try {
    const key = cloudCampaignStorageKey(f.scope), owner = (await f.cache.journal!.head(key))!.owner;
    expect(await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "revision-mounted-before" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    const rejected = f.coordinator.recoveryEntry!.recovery!.inFlight!;
    expect(f.session.canExecute).toBe(true);
    expect(await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "revision-mounted-after" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(true);
    const expected = f.session.state;
    commit.mockRestore();
    for (let attempt = 0; attempt < 4 && f.coordinator.view.pending; attempt++) {
      f.clock.advance(300_000);
      if (trigger === "pulses") await f.session.pulse(); else await f.session.reconnect();
    }
    expect(f.coordinator.view).toMatchObject({ pending: false, failure: null, localDurable: true, canExecute: true });
    expect(f.session.state).toEqual(expected); expect(f.session.needsReload).toBe(false);
    expect(f.selected).not.toHaveBeenCalled(); expect(f.ports).toHaveLength(1); expect(f.ports[0]!.stopped).toBe(false);
    expect((await f.cache.journal!.head(key))!.owner).toBe(owner);
    expect(f.server.operationCount(f.scope.accountId)).toBe(1);
    expect((await f.entryStore.entries()).some(row => JSON.stringify(row.value).includes(rejected.requestSha256))).toBe(true);
    const saved = await f.transport.load(f.scope.campaignId);
    const loaded = await f.coordinator.codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
    expect(loaded.state).toEqual(expected);
  } finally { f.session.dispose(); }
});

it("bounds repeated same-head rejections while retaining every exact request, then also supports a later cold reopen", async () => {
  const f = await snapshotDevice(), commit = vi.spyOn(f.transport, "commit").mockRejectedValue(new CloudSyncError("revision"));
  let reopened: CloudGameSession | undefined;
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "local.before.conflict" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.coordinator.view).toMatchObject({ canExecute: true, localDurable: true, pending: true, phase: "waiting", failure: "network" });
    const rejected = f.coordinator.recoveryEntry!.recovery!.inFlight!;
    expect(JSON.parse(rejected.requestText).expectedRevision).toBe("57");
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "local.during.conflict" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(true);
    for (let second = 0; second < 20; second++) { f.clock.advance(1_000); await f.session.pulse(); }
    // One initial write plus one backoff-governed reconciliation, never a 1 Hz
    // mutation storm. The original rejected bytes remain in a verified backup.
    expect(commit).toHaveBeenCalledTimes(2); expect(f.selected).not.toHaveBeenCalled();
    expect(f.session.canExecute).toBe(true); expect(f.session.needsReload).toBe(false);
    expect((await f.entryStore.entries()).some(row => JSON.stringify(row.value).includes(rejected.requestSha256))).toBe(true);
    expect(JSON.parse(f.coordinator.recoveryEntry!.recovery!.inFlight!.requestText).expectedRevision).toBe("57");
    // Reconciliation preserves release-40 snapshot bytes: provenance is held
    // by the mounted base/journal proof, never written as new lineage anchors.
    expect(JSON.parse(f.coordinator.recoveryEntry!.recovery!.inFlight!.requestText).lineage.parents)
      .not.toContain(JSON.parse(rejected.requestText).snapshot.uncompressedSha256);
    const learning = f.session.state.learningHistories;
    f.session.dispose(); commit.mockRestore();
    const coordinator = await openAutomaticCloudCampaign({ runtime: f.runtime, campaignId: f.scope.campaignId, clock: f.clock });
    reopened = await CloudGameSession.create(coordinator, undefined, undefined, { operational: false });
    expect(reopened.canExecute).toBe(true); expect(reopened.state.simulationSpeed).toBe(4);
    expect(reopened.state.learningHistories).toEqual(learning); expect(reopened.state.campaignId).toBe(f.scope.campaignId);
    expect(await reopened.checkpointNow("purchase")).toBe(true);
    expect(f.server.operationCount(f.scope.accountId)).toBe(1);
    expect((await f.transport.load(f.scope.campaignId)).revision).toBe("58");
    expect(await reopened.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(1);
  } finally { reopened?.dispose(); f.session.dispose(); }
});

it("fences a real other device and never retries its rejected write on the next one-second pulses", async () => {
  const f = await snapshotDevice();
  const other = new CloudSyncCoordinator({ scope: f.scope, transport: f.server.transport(f.scope.accountId), cache: new MemoryCloudCache(),
    entryStore: new MemoryCloudEntryStore(), clock: f.clock, enabled: true });
  let remote: CloudGameSession | undefined;
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "old.device.branch" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await f.session.durable()).toBe(true);
    expect(await other.open()).toBe(true); expect(await other.startWriter(true)).toBe(true); expect(other.resume()).toBe(true);
    remote = await CloudGameSession.create(other, undefined, undefined, { operational: false });
    remote.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "new.device.branch" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await remote.checkpointNow("purchase")).toBe(true);
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.coordinator.view).toMatchObject({ failure: "writer", canExecute: false, localDurable: true });
    const rejected = f.coordinator.recoveryEntry!.recovery!.inFlight!;
    const mutations = f.server.calls.filter(row => row.method === "commit").length;
    for (let second = 0; second < 30; second++) { f.clock.advance(1_000); await f.session.pulse(); }
    expect(f.server.calls.filter(row => row.method === "commit")).toHaveLength(mutations);
    expect(f.coordinator.recoveryEntry!.recovery!.inFlight).toEqual(rejected);
    expect(f.session.execute({ type: "ADVANCE_TICK", operationId: "fenced.tap" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(remote.canExecute).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(1);
  } finally { remote?.dispose(); other.dispose(); f.session.dispose(); }
});

it("checks the current head before the first hydrate-repair upload and never freezes against a stale revision", async () => {
  const f = await snapshotDevice(true), commit = vi.spyOn(f.transport, "commit");
  try {
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "repaired.first.tap" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    const before = f.session.state;
    const row = f.server.account(f.scope.accountId).campaigns.get(f.scope.campaignId)!;
    row.confirmed = { ...row.confirmed, revision: "58" }; // Accepted by another request after hydration.
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(commit).not.toHaveBeenCalled();
    expect(f.coordinator.recoveryEntry!.recovery!.inFlight).toBeNull();
    expect(f.coordinator.view).toMatchObject({ canExecute: true, localDurable: true, pending: true, failure: "revision" });
    expect(f.session.state).toEqual(before); expect(f.session.state.learningHistories).toEqual(before.learningHistories);
    for (let second = 0; second < 20; second++) { f.clock.advance(1_000); await f.session.pulse(); }
    expect(commit).not.toHaveBeenCalled(); expect(row.confirmed.revision).toBe("58");
  } finally { f.session.dispose(); }
});

it("aborts the actual RPC at the transport deadline rather than leaving an unchecked HTTP request running", async () => {
  vi.useFakeTimers(); let signal: AbortSignal | undefined;
  const pending = new Promise<{ data: unknown; error: unknown }>(() => {});
  const request = Object.assign(pending, { abortSignal(value: AbortSignal) { signal = value; return pending; } });
  const transport = new SupabaseCloudTransport({ rpc: vi.fn(() => request) }, "public.account", async () => "public.account");
  const result = transport.acquire({ campaignId: "public.deadline", expectedRevision: "1", expectedWriterGeneration: "1",
    writerToken: "a".repeat(64), operationId: "public.deadline", takeover: false }).catch(error => error);
  await vi.advanceTimersByTimeAsync(30_000);
  expect(await result).toMatchObject({ code: "network" }); expect(signal?.aborted).toBe(true);
});

it("cannot restore cloud authority with a renewal that arrives after local conflict recovery", async () => {
  const f = await snapshotDevice(), held = deferred(), sent = deferred(), renew = f.transport.renew.bind(f.transport);
  vi.spyOn(f.transport, "renew").mockImplementation(async input => { sent.resolve(); await held.promise; return renew(input); });
  const commit = vi.spyOn(f.transport, "commit").mockRejectedValue(new CloudSyncError("revision"));
  let pulse: Promise<void> | undefined;
  try {
    f.clock.advance(CLOUD_RENEW_MS); pulse = f.session.pulse(); await sent.promise;
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "local.pending.renewal" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.coordinator.view).toMatchObject({ phase: "waiting", canExecute: true });
    held.resolve(); await pulse;
    expect(problemDiagnostics.report().current.health.coordinator!.leaseExpiresAt).toBeNull();
    expect(f.coordinator.view).toMatchObject({ phase: "waiting", canExecute: true });
    expect(await f.session.checkpointNow("purchase")).toBe(false); expect(commit).toHaveBeenCalledTimes(1);
  } finally { held.resolve(); await pulse; f.session.dispose(); }
});
