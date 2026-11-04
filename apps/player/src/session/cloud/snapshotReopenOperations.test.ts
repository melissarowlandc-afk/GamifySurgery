import { expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { accountStorageKey } from "../accountStorageKey";
import { PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { FakeCloudServer } from "./fakeTransport";
import { CloudGameSession } from "./gameSession";
import { importLocalCloudCampaign, inspectLocalCloudSources } from "./importCampaigns";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { CloudSyncError } from "./transport";
import { deferred, syncFixture, TestCloudClock } from "./syncTestSupport";
import { cloudCopyFamily } from "./copySelection";
import { discoverClinicCopies } from "./retainedCopies";
import { cloudCodec } from "./codecWorker";

/** Unlike seeded cloud-only fixtures, enrollment leaves BOTH its immutable
 * verified import and the exact raw local profile in the entry store. */
async function enrolled(snapshots = true) {
  const fixture = await syncFixture("enrolled.reopen"), clock = new TestCloudClock();
  const scope = { backendId: "test", accountId: "account-a", campaignId: fixture.confirmed.campaignId };
  const entryStore = new MemoryCloudEntryStore(), server = new FakeCloudServer(clock.wallNow);
  server.setAccess(scope.accountId, { snapshotSaves: snapshots });
  const campaign = fixture.prepared.envelope.campaign;
  const raw = JSON.stringify({ schemaVersion: 2, tutorialGuidanceByCampaign: { [campaign.campaignId]: campaign.tutorial.guidance },
    tutorialIntroDismissedCampaignIds: [], tutorialDailyRoutineTipAcknowledgments: {}, tutorialDailyRoutinePauseByCampaign: {},
    campaigns: [{ ...campaign, serializedState: JSON.stringify({ ...JSON.parse(fixture.prepared.sourceRecovery.text), paused: true }) }] });
  const storage = { getItem: (key: string) => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, scope.accountId) ? raw : null };
  const transport = server.transport(scope.accountId), cache = new MemoryCloudCache();
  const sources = await inspectLocalCloudSources(scope.accountId, storage, entryStore, false, null);
  const imported = await importLocalCloudCampaign(sources.sources[0]!, campaign.name, transport, entryStore);
  const runtime = { ...scope, region: "test", cache, entryStore, transport };
  const open = () => openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock, storage });
  const session = await CloudGameSession.create(await open());
  expect(server.operationCount(scope.accountId)).toBe(1);
  return { ...scope, runtime, entryStore, server, storage, raw, clock, session, open, imported };
}
const accepted = (f: Awaited<ReturnType<typeof enrolled>>) => ({
  revisions: [...f.server.account(f.accountId).operations.values()].map(row => row.receipt.revision),
  campaigns: [...f.server.account(f.accountId).campaigns.keys()],
  imports: f.server.calls.filter(row => row.method === "importCampaign").length,
});

it.each(["pending upload", "hidden/pagehide", "unavailable service", "legacy capacity"] as const)(
  "%s recovers one descendant without importing its retained enrollment source as an archive", async scenario => {
    const f = await enrolled(scenario !== "legacy capacity");
    let reopened: CloudGameSession | null = null;
    const gate = deferred();
    try {
      expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "first.local.change" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await f.session.prepareRecoveryCopy()).toBe(true);
      if (scenario === "legacy capacity" || scenario === "unavailable service") {
        f.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError(scenario === "legacy capacity" ? "capacity" : "network") });
        expect(await f.session.checkpointNow("purchase")).toBe(false);
        expect(f.session.syncView.pending).toBe(true);
      }
      if (scenario === "hidden/pagehide") {
        f.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
        expect(await f.session.checkpointNow("hidden")).toBe(false);
        await f.session.checkpointNow("pagehide");
      }
      const expected = f.session.state;
      f.session.dispose(); f.server.setAccess(f.accountId, { snapshotSaves: true });
      const commit = vi.spyOn(f.runtime.transport, "commit");
      // The held first backup cannot be responsible for any operation accepted
      // during selection. An archive import used to bypass this commit hold.
      const transportCommit = f.server.transport(f.accountId).commit;
      commit.mockImplementation(async operation => { await gate.promise; return transportCommit(operation); });
      reopened = await CloudGameSession.create(await f.open());
      expect(reopened.canExecute).toBe(true); expect(reopened.state).toEqual(expected);
      expect(accepted(f)).toEqual({ revisions: ["1"], campaigns: [f.campaignId], imports: 1 });
      const uploading = reopened.checkpointNow("ordinary");
      await vi.waitFor(() => expect(commit).toHaveBeenCalledTimes(1));
      expect(reopened.canExecute).toBe(true);
      expect(f.server.operationCount(f.accountId)).toBe(1);
      gate.resolve(); expect(await uploading).toBe(true);
      expect(accepted(f)).toEqual({ revisions: ["1", "2"], campaigns: [f.campaignId], imports: 1 });
      const copy = await f.runtime.transport.load(f.campaignId);
      const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: "2", expectedCampaignId: f.campaignId, expectedBaselineId: copy.baselineId });
      expect(loaded.state).toEqual(expected); expect(copy.saveFormat).toBe(3); expect(copy.evidence.records).toEqual([]);
      expect(f.server.usageCount(f.accountId)).toBe(0);
      expect(f.storage.getItem(accountStorageKey(PROTOTYPE_PROFILE_KEY, f.accountId))).toBe(f.raw);
      expect((await f.entryStore.entries("raw:")).some(row => (row.value as { text: string }).text === f.raw)).toBe(true);
      expect(await reopened.durable()).toBe(true); reopened.dispose();
      reopened = await CloudGameSession.create(await f.open());
      expect(reopened.canExecute).toBe(true); expect(reopened.state).toEqual(expected);
      expect(await reopened.checkpointNow("ordinary")).toBe(true);
      expect(accepted(f)).toEqual({ revisions: ["1", "2"], campaigns: [f.campaignId], imports: 1 });
    } finally { gate.resolve(); reopened?.dispose(); f.session.dispose(); vi.restoreAllMocks(); }
  });

it.each([false, true])("keeps the exact original campaign ID across hide recovery, acknowledgement and another abrupt reopen (play during upload=%s)", async playDuringUpload => {
  const f = await enrolled(), gate = deferred();
  let active: CloudGameSession | null = null;
  try {
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "before.hidden" }, PROTOTYPE_DOMAIN_CONTEXT);
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "at.hidden" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.prepareRecoveryCopy()).toBe(true);
    f.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
    expect(await f.session.checkpointNow("hidden")).toBe(false);
    await f.session.checkpointNow("pagehide");
    const pending = f.session.state; f.session.dispose();
    active = await CloudGameSession.create(await f.open());
    expect(active.state).toEqual(pending); expect(active.state.campaignId).toBe(f.campaignId);
    const original = f.runtime.transport.commit;
    const commit = vi.spyOn(f.runtime.transport, "commit").mockImplementation(async operation => { await gate.promise; return original(operation); });
    const uploading = active.checkpointNow("ordinary");
    await vi.waitFor(() => expect(commit).toHaveBeenCalledTimes(1));
    const advance = () => {
      for (const command of [{ type: "SET_PAUSED", paused: false },
        ...Array.from({ length: 3 }, (_, index) => ({ type: "ADVANCE_TICK" as const, advancedAtRealMs: index })),
        { type: "SET_PAUSED", paused: true }] as const)
        expect(active!.execute({ ...command, operationId: crypto.randomUUID() }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    };
    if (playDuringUpload) advance();
    gate.resolve(); expect(await uploading).toBe(true);
    // Drain the ACK rebase before accepting the post-upload commands. With no
    // new rows it may retain the same committed snapshot/high-water mark.
    expect(await active.durable()).toBe(true);
    if (!playDuringUpload) advance();
    expect(await active.durable()).toBe(true);
    const expected = active.state;
    expect(expected.facilityTick).toBeGreaterThan(pending.facilityTick);
    expect(expected.campaignId).toBe(f.campaignId);
    active.dispose(); // Kill without a final encode, upload or departure event.
    active = await CloudGameSession.create(await f.open());
    expect(active.canExecute).toBe(true);
    expect(active.state).toEqual(expected); // Includes campaignId, receipts, frozen state and settings.
    expect(active.coordinator.scope.campaignId).toBe(f.campaignId);
    expect(await active.checkpointNow("ordinary")).toBe(true);
    expect(accepted(f)).toEqual({ revisions: ["1", "2", "3"], campaigns: [f.campaignId], imports: 1 });
    expect(f.server.usageCount(f.accountId)).toBe(0);
    expect(f.storage.getItem(accountStorageKey(PROTOTYPE_PROFILE_KEY, f.accountId))).toBe(f.raw);
  } finally { gate.resolve(); active?.dispose(); f.session.dispose(); vi.restoreAllMocks(); }
});

it("still selects genuinely newer raw progress after a verified enrollment, preserving both branches", async () => {
  const f = await enrolled(); f.session.dispose();
  let checkpoint = f.imported.verified.checkpoint;
  for (const command of [{ type: "SET_PAUSED", paused: false }, { type: "ADVANCE_TICK", advancedAtRealMs: 1 },
    { type: "ADVANCE_TICK", advancedAtRealMs: 2 }, { type: "SET_PAUSED", paused: true }] as const)
    checkpoint = applyGameEvidenceCommand(checkpoint, { ...command, operationId: crypto.randomUUID() }, PROTOTYPE_DOMAIN_CONTEXT).checkpoint;
  const expected = importGameEvidence(checkpoint.snapshot, checkpoint.evidence), profile = JSON.parse(f.raw);
  profile.campaigns[0].serializedState = serializeGameState(expected);
  const newerRaw = JSON.stringify(profile);
  f.storage.getItem = key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, f.accountId) ? newerRaw : null;
  const selected = await CloudGameSession.create(await f.open());
  try {
    expect(selected.canExecute).toBe(true);
    expect(selected.state).toEqual({ ...expected, campaignId: selected.state.campaignId });
    expect(selected.state.campaignId).not.toBe(f.campaignId);
    const rows = await f.runtime.transport.list(); expect(rows).toHaveLength(2);
    expect(rows.find(row => row.campaignId === f.campaignId)?.status).toBe("archived");
    const old = await f.runtime.transport.load(f.campaignId), loaded = await loadCloudEvidenceCheckpoint({ ...old,
      expectedRevision: old.revision, expectedCampaignId: f.campaignId, expectedBaselineId: old.baselineId });
    expect(loaded.state).toEqual(f.imported.verified.state);
    const raw = await f.entryStore.entries("raw:");
    expect(raw.some(row => (row.value as { text: string }).text === f.raw)).toBe(true);
    expect(raw.some(row => (row.value as { text: string }).text === newerRaw)).toBe(true);
  } finally { selected.dispose(); }
});

it.each(["unverified", "invalid checksum", "unreadable compacted copy"])(
  "%s enrollment cannot hide a raw recovery source", async failure => {
    const f = await enrolled(); f.session.dispose();
    const row = (await f.entryStore.entries("import:"))[0]!, record = row.value as any;
    if (failure === "unverified") record.verified = false;
    else if (failure === "invalid checksum") record.operation.requestText += " ";
    else { record.compactedCopy = structuredClone(f.imported.loaded); record.compactedCopy.snapshot.dataBase64 = "!"; }
    await f.entryStore.write(row.key, record);
    const copies = await discoverClinicCopies({ scope: f, family: await cloudCopyFamily(f.campaignId), codec: cloudCodec,
      store: f.entryStore, entries: [], account: [f.imported.loaded], storage: f.storage, snapshots: true });
    expect(copies.some(copy => copy.source.startsWith("raw:"))).toBe(true);
    expect(f.server.operationCount(f.accountId)).toBe(1);
  });
