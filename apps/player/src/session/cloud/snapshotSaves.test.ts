import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { syncHarness, syncFixture } from "./syncTestSupport";
import { CloudGameSession } from "./gameSession";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { runCloudCodecTask } from "./codecTasks";
import { prepareCloudWire } from "./codecWire";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { snapshotCopy } from "./snapshotCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { prepareJournal } from "./journalCodec";
import { cloudCodec } from "./codecWorker";
import { logicalJsonText, sha256Utf8 } from "./codecJson";
import { MemoryCloudEntryStore } from "./entryStorage";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { cloudCopyFamily } from "./copySelection";
import { protectClinicCopy } from "./retainedCopies";
import { CloudSyncError } from "./transport";
import { SupabaseCloudTransport, cloudWireBlob } from "./supabaseTransport";
import { CloudCacheError } from "./codecCache";
const stateText = (state: Parameters<typeof serializeGameState>[0]) => logicalJsonText(JSON.parse(serializeGameState(state)));

afterEach(() => vi.restoreAllMocks());
it("a cloud compaction retry keeps its original baseline and commits commands accepted while storage was slow", async () => {
  let now = 0; vi.spyOn(performance, "now").mockImplementation(() => now);
  const f = await syncHarness(), loaded = await loadCloudEvidenceCheckpoint({ ...f.confirmed, expectedCampaignId: f.scope.campaignId,
    expectedRevision: "1", expectedBaselineId: f.confirmed.baselineId });
  f.server.seed(f.scope.accountId, await snapshotCopy(loaded.state, loaded.campaign, "1", f.clock.wall, { branchId: "retry.baseline", sequence: 0, parents: [] }));
  f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  await f.coordinator.open(); await f.coordinator.startWriter(); f.coordinator.resume();
  vi.spyOn(f.coordinator, "pulse").mockResolvedValue(); // Isolate the local compaction from cloud cadence.
  const session = await CloudGameSession.create(f.coordinator), journal = f.cache.journal!;
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  const compact = vi.spyOn(journal, "compact").mockImplementationOnce(async () => { await gate; throw new CloudCacheError("transaction"); });
  try {
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "cloud.before.compact" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true); now = 300_001;
    const failed = session.pulse(); await vi.waitFor(() => expect(compact).toHaveBeenCalledTimes(1));
    const second = session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "cloud.during.compact" }, PROTOTYPE_DOMAIN_CONTEXT)!;
    expect(second).not.toBeNull(); release(); await failed;
    now += 61_000; await session.pulse();
    const recovered = await prepareJournal(journal, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    expect(recovered!.state).toEqual(second); expect(recovered!.through).toBe((await journal.head(cloudCampaignStorageKey(f.scope)))!.highWater);
  } finally { release(); session.dispose(); }
});
it("recovers a locally committed settings reversal without uploading an unchanged clinic", async () => {
  const f = await syncHarness(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const runtime = { ...f.scope, region: "test", cache: f.cache, entryStore: new MemoryCloudEntryStore(), transport: f.server.transport(f.scope.accountId) };
  const session = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock }));
  expect(await session.checkpointNow("purchase")).toBe(true); const original = session.metadata;
  session.updateMetadata({ ...original, name: "Temporary local name" }); expect(await session.prepareRecoveryCopy()).toBe(true);
  session.updateMetadata(original); expect(await session.durable()).toBe(true); session.dispose();
  const count = f.server.operationCount(f.scope.accountId), next = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock }));
  try {
    expect(next.metadata).toEqual(original); expect(next.canExecute).toBe(true);
    expect(await next.checkpointNow("purchase")).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(count);
  } finally { next.dispose(); }
});
it("keeps pending campaign settings/name when the gameplay snapshot is otherwise equal to the account head", async () => {
  const f = await syncHarness(), entryStore = new MemoryCloudEntryStore(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const runtime = { ...f.scope, region: "test", cache: f.cache, entryStore, transport: f.server.transport(f.scope.accountId) };
  const first = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock }));
  expect(await first.checkpointNow("purchase")).toBe(true);
  const changed = { ...first.metadata, name: "Kept clinic name", tutorial: { ...first.metadata.tutorial, introDismissed: true } };
  first.updateMetadata(changed); expect(await first.prepareRecoveryCopy()).toBe(true); first.dispose();
  const second = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock }));
  try {
    expect(second.canExecute).toBe(true); expect(second.metadata).toEqual(changed);
    expect(await second.checkpointNow("purchase")).toBe(true); expect((await runtime.transport.list())[0]!.name).toBe(changed.name);
    expect((await runtime.transport.list())).toHaveLength(1);
  } finally { second.dispose(); }
});
it("upgrades a legacy descendant and retained backup once without inventing a divergent campaign", async () => {
  const f = await syncHarness(), entries = new MemoryCloudEntryStore();
  expect(await f.coordinator.open()).toBe(true); await f.coordinator.startWriter(); f.coordinator.resume();
  const local = await CloudGameSession.create(f.coordinator);
  local.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "legacy.descendant" }, PROTOTYPE_DOMAIN_CONTEXT);
  expect(await local.prepareRecoveryCopy()).toBe(true); const expected = local.state;
  const inspected = await runCloudCodecTask({ kind: "inspectCopy", input: f.confirmed });
  const key = await protectClinicCopy(entries, await cloudCopyFamily(f.scope.campaignId), { copy: f.confirmed, inspection: inspected, source: "fixture", usageQuestions: [] }, "legacy backup");
  local.dispose(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const runtime = { ...f.scope, region: "test", entryStore: entries, cache: f.cache, transport: f.server.transport(f.scope.accountId) };
  const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock });
  const session = await CloudGameSession.create(coordinator);
  try {
    expect(session.state).toEqual(expected); expect(session.canExecute).toBe(true);
    expect(await session.checkpointNow("purchase")).toBe(true); expect((await runtime.transport.list())).toHaveLength(1);
    expect((await entries.read<{ copy: { saveFormat: number; evidence: { records: unknown[] } } }>(key))!.copy).toMatchObject({ saveFormat: 3, evidence: { records: [] } });
    const verify = vi.spyOn(cloudCodec, "run"), next = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock });
    expect(verify.mock.calls.filter(([task]) => task.kind === "inspectCopy" && task.input.evidence.records.length > 0)).toHaveLength(0);
    const reopened = await CloudGameSession.create(next); expect(reopened.state).toEqual(expected); reopened.dispose();
  } finally { session.dispose(); }
});
it("converts a legacy head and its pending progress to exact current snapshots; subsequent saves upload no evidence", async () => {
  const f = await syncHarness(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  expect(await f.coordinator.open()).toBe(true); expect(await f.coordinator.startWriter()).toBe(true); f.coordinator.resume();
  const session = await CloudGameSession.create(f.coordinator);
  try {
    const original = await loadCloudEvidenceCheckpoint({ ...f.confirmed, expectedCampaignId: f.scope.campaignId,
      expectedRevision: "1", expectedBaselineId: f.confirmed.baselineId });
    expect(stateText(session.state)).toBe(stateText(original.state));
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "native.speed" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    const selected = stateText(session.state);
    expect(await session.checkpointNow("purchase")).toBe(true);
    const confirmed = f.coordinator.confirmed!;
    expect(confirmed.saveFormat).toBe(3); expect(confirmed.evidence.records).toEqual([]);
    const loaded = await loadCloudEvidenceCheckpoint({ ...confirmed, expectedCampaignId: confirmed.campaignId,
      expectedRevision: confirmed.revision, expectedBaselineId: confirmed.baselineId });
    expect(stateText(loaded.state)).toBe(selected);
    const prior = await f.server.transport(f.scope.accountId).load(confirmed.campaignId, "1");
    expect(prior.saveFormat).toBe(3); expect(prior.evidence.records).toEqual([]);
    const recovered = await loadCloudEvidenceCheckpoint({ ...prior, expectedCampaignId: prior.campaignId, expectedRevision: prior.revision, expectedBaselineId: prior.baselineId });
    expect(stateText(recovered.state)).toBe(stateText(original.state));
    const pending = await runCloudCodecTask({ kind: "snapshotEncode", input: { checkpoint: loaded.checkpoint,
      campaign: loaded.campaign, lineage: { ...loaded.snapshotLineage!, sequence: loaded.snapshotLineage!.sequence + 1 } } });
    const request = { ...pending, protocolVersion: 2 as const, operationId: "wire.snapshot", campaignId: prior.campaignId,
      expectedRevision: confirmed.revision, writerGeneration: "1", writerToken: "a".repeat(64) };
    const wireRequest = await prepareCloudWire(request, f.clock.wall), wire = JSON.parse(wireRequest.text);
    expect(wire.protocolVersion).toBe(4); expect(wire.cloudFormatVersion).toBe(3); expect(wire).not.toHaveProperty("evidence");
    // Exercise the actual negotiated RPC names and receipt/load shapes, not
    // only the simulator's internal request representation. No fetch or SDK.
    const rpc = vi.fn(async (name: string, args: Record<string, unknown>) => {
      if (name === "beta2_cloud_access") return { data: { protocolVersion: 3, enabled: true, writesEnabled: true, noticeAccepted: true, snapshotSaves: true }, error: null };
      if (name === "beta2_snapshot_load") return { data: { cloudFormatVersion: 3, revision: confirmed.revision, lineage: confirmed.lineage,
        acceptedAt: new Date(f.clock.wall).toISOString(), snapshot: await cloudWireBlob(confirmed.snapshot) }, error: null };
      expect(name).toBe("beta2_snapshot_write"); expect(args.p_request_text).toBe(wireRequest.text);
      return { data: { operationId: request.operationId, requestSha256: wireRequest.sha256, writerGeneration: request.writerGeneration,
        revision: String(BigInt(confirmed.revision) + 1n), acceptedAt: new Date(f.clock.wall).toISOString(), evidenceHighWater: 0,
        snapshotSha256: request.snapshot.uncompressedSha256, snapshotBytes: request.snapshot.uncompressedBytes }, error: null };
    });
    const transport = new SupabaseCloudTransport({ rpc }, f.scope.accountId, async () => f.scope.accountId);
    expect((await transport.capabilities()).snapshotSaves).toBe(true);
    expect(await transport.load(confirmed.campaignId, confirmed.revision)).toMatchObject({ saveFormat: 3, lineage: confirmed.lineage, evidence: { records: [] } });
    const requestText = JSON.stringify(request), receipt = await transport.commit({ operationId: request.operationId, createdAtMs: f.clock.wall,
      requestText, requestSha256: await sha256Utf8(requestText), wireRequest });
    expect(receipt.evidenceHighWater).toBe(0); expect(rpc.mock.calls.map(([name]) => name)).toEqual(["beta2_cloud_access", "beta2_snapshot_load", "beta2_snapshot_write"]);
  } finally { session.dispose(); }
});

it("reconciles a committed legacy operation once before converting, without replaying its command or upload", async () => {
  const f = await syncHarness(), entryStore = new MemoryCloudEntryStore();
  await f.coordinator.open(); await f.coordinator.startWriter(); f.coordinator.resume();
  const session = await CloudGameSession.create(f.coordinator);
  session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "legacy.lost" }, PROTOTYPE_DOMAIN_CONTEXT);
  const exact = session.state;
  f.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
  expect(await session.checkpointNow("purchase")).toBe(false);
  const priorId = f.coordinator.recoveryEntry!.recovery!.inFlight!.operationId;
  session.dispose(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const coordinator = await openAutomaticCloudCampaign({ runtime: { ...f.scope, cache: f.cache, entryStore, region: "test", transport: f.server.transport(f.scope.accountId) },
    campaignId: f.scope.campaignId, clock: f.clock });
  const recovered = await CloudGameSession.create(coordinator);
  try {
    expect(recovered.state).toEqual(exact); expect(recovered.canExecute).toBe(true);
    expect(await recovered.checkpointNow("purchase")).toBe(true); expect(coordinator.confirmed!.saveFormat).toBe(3);
    expect(f.server.calls.filter(row => row.method === "commit" && row.operationId === priorId)).toHaveLength(1);
    expect(f.server.calls.some(row => row.method === "operation" && row.operationId === priorId)).toBe(true);
    expect(f.server.operationCount(f.scope.accountId)).toBe(2);
  } finally { recovered.dispose(); }
});

it("native journal recovery survives an abrupt document kill and compacts the move tail after acknowledgement", async () => {
  const f = await syncHarness({ cache: new MemoryCloudCache() });
  const loaded = await loadCloudEvidenceCheckpoint({ ...f.confirmed, expectedCampaignId: f.scope.campaignId,
    expectedRevision: "1", expectedBaselineId: f.confirmed.baselineId });
  const native = await snapshotCopy(loaded.state, loaded.campaign, "1", f.clock.wall, { branchId: "initial", sequence: 0, parents: [] });
  f.server.seed(f.scope.accountId, native); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  expect(await f.coordinator.open()).toBe(true); await f.coordinator.startWriter(); f.coordinator.resume();
  const session = await CloudGameSession.create(f.coordinator);
  let next: CloudSyncCoordinator | null = null;
  try {
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "kill.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true); const exact = stateText(session.state);
    const key = cloudCampaignStorageKey(f.scope);
    const recovered = await prepareJournal(f.cache.journal!, key, cloudCodec, { local: true });
    expect(stateText(recovered!.state!)).toBe(exact); expect(recovered!.candidate!.saveFormat).toBe(3);
    expect(await session.checkpointNow("purchase")).toBe(true);
    await vi.waitFor(async () => expect((await f.cache.journal!.read(key))!.rows).toHaveLength(0));
    const compacted = await prepareJournal(f.cache.journal!, key, cloudCodec, { local: true, encode: false });
    expect(stateText(compacted!.state!)).toBe(exact);
    session.detach();
    next = new CloudSyncCoordinator({ scope: f.scope, transport: f.server.transport(f.scope.accountId), cache: f.cache, enabled: true, clock: f.clock });
    expect(await next.open()).toBe(true); await next.startWriter(true); next.resume();
    const reopened = await CloudGameSession.create(next); expect(stateText(reopened.state)).toBe(exact); reopened.detach();
  } finally { session.dispose(); next?.dispose(); }
});

it.each([[true, true], [true, false], [false, true], [false, false]] as const)("automatically selects the newest native branch and protects both complete states (local newer=%s, free slot=%s)", async (localNewer, freeSlot) => {
  const f = await syncHarness(); f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const runtime = { ...f.scope, cache: f.cache, entryStore: new MemoryCloudEntryStore(), transport: f.server.transport(f.scope.accountId), region: "test" };
  const initial = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock });
  const first = await CloudGameSession.create(initial); expect(await first.checkpointNow("purchase")).toBe(true); first.dispose();
  const branch = async (remote: boolean, ticks: number) => {
    const r = remote ? { ...runtime, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() } : runtime;
    const c = await openAutomaticCloudCampaign({ runtime: r, campaignId: f.scope.campaignId, clock: f.clock });
    const s = await CloudGameSession.create(c);
    s.execute({ type: "SET_PAUSED", paused: false, operationId: `run.${remote}` }, PROTOTYPE_DOMAIN_CONTEXT);
    for (let i = 0; i < ticks; i++) s.execute({ type: "ADVANCE_TICK", advancedAtRealMs: i, operationId: `tick.${remote}.${i}` }, PROTOTYPE_DOMAIN_CONTEXT);
    s.execute({ type: "SET_PAUSED", paused: true, operationId: `rest.${remote}` }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await s.prepareRecoveryCopy()).toBe(true); if (remote) expect(await s.checkpointNow("purchase")).toBe(true);
    return s;
  };
  const local = await branch(false, localNewer ? 3 : 1), localState = local.state;
  const remote = await branch(true, localNewer ? 1 : 3), remoteState = remote.state;
  local.dispose(); remote.dispose();
  let unrelated: Awaited<ReturnType<typeof snapshotCopy>> | null = null;
  if (!freeSlot) {
    const other = await syncFixture("native.unrelated"), loaded = await loadCloudEvidenceCheckpoint({ ...other.confirmed,
      expectedCampaignId: other.confirmed.campaignId, expectedRevision: "1", expectedBaselineId: other.confirmed.baselineId });
    unrelated = await snapshotCopy(loaded.state, { ...loaded.campaign, name: "Unrelated archive", status: "archived" }, "1", f.clock.wall,
      { branchId: "unrelated", sequence: 0, parents: [] }); f.server.seed(f.scope.accountId, unrelated);
  }
  const c = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock }), selected = await CloudGameSession.create(c);
  try {
    expect(selected.canExecute).toBe(true); expect(selected.state).toEqual({ ...(localNewer ? localState : remoteState), campaignId: selected.state.campaignId });
    expect(await selected.checkpointNow("purchase")).toBe(true);
    const rows = await runtime.transport.list(); expect(rows).toHaveLength(2);
    const loser = localNewer ? remoteState : localState;
    const archived = rows.find(row => /\(older copy\)$/.test(row.name));
    if (freeSlot) {
      expect(archived).toBeDefined();
      const copy = await runtime.transport.load(archived!.campaignId), older = await loadCloudEvidenceCheckpoint({ ...copy,
        expectedRevision: copy.revision, expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
      expect(copy.saveFormat).toBe(3); expect(copy.evidence.records).toEqual([]);
      expect(older.state).toEqual({ ...loser, campaignId: copy.campaignId });
    } else {
      expect(archived).toBeUndefined(); expect(await runtime.transport.load(unrelated!.campaignId)).toEqual(unrelated);
      const protectedStates = await Promise.all((await runtime.entryStore.entries("older-copy:")).map(async row => {
        const copy = (row.value as { copy: import("./transport").CloudConfirmed }).copy;
        return (await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision, expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId })).state;
      }));
      expect(protectedStates.some(state => stateText({ ...state, campaignId: loser.campaignId }) === stateText(loser))).toBe(true);
    }
    const state = selected.state; selected.detach();
    const next = await openAutomaticCloudCampaign({ runtime, campaignId: state.campaignId, clock: f.clock });
    const s = await CloudGameSession.create(next); expect(s.state).toEqual(state); s.dispose();
  } finally { selected.dispose(); }
});
