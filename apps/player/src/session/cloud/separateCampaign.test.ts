import { describe, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { logicalJsonText } from "./codecJson";
import { importSeparateCloudCampaign } from "./importCampaigns";
import { deferred, syncFixture, syncHarness } from "./syncTestSupport";
import { CloudSyncError, type CloudConfirmed } from "./transport";

async function divergent() {
  const h = await syncHarness(), entryStore = new MemoryCloudEntryStore(), transport = h.server.transport(h.scope.accountId);
  const coordinator = new CloudSyncCoordinator({ scope: h.scope, transport, cache: h.cache, clock: h.clock, entryStore, enabled: true });
  await coordinator.open(); const local = await CloudGameSession.create(coordinator); await local.reconnect();
  local.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "branch.local" }, PROTOTYPE_DOMAIN_CONTEXT);
  await local.durable();
  const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
  await other.open(); await other.startWriter(true); other.resume();
  const remote = await CloudGameSession.create(other);
  remote.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "branch.remote" }, PROTOTYPE_DOMAIN_CONTEXT);
  await remote.durable(); expect(await remote.checkpointNow("purchase")).toBe(true);
  expect(await local.reconnect()).toBe(false);
  expect(coordinator.view.conflictCopies?.canKeepDevice).toBe(false);
  const recovery = coordinator.exportRecovery()!, entry = JSON.parse(recovery), pending = coordinator.pendingCandidate!;
  const device: CloudConfirmed = { ...entry.confirmed, snapshot: pending.snapshot,
    evidence: { header: entry.confirmed.evidence.header, records: [...entry.confirmed.evidence.records, ...pending.evidence.records] } };
  const account = structuredClone(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!);
  return { ...h, coordinator, entryStore, transport, local, remote, device, account, recovery };
}
const load = (copy: CloudConfirmed) => loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
  expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });

describe("explicit separate account campaign for a divergent local branch", () => {
  it("retains real retired encounters which no longer exist in the playable state", async () => {
    const h = await syncHarness(), state = createInitialGameState(undefined, { campaignId: "branch.retirement" });
    const template = Object.values(state.encounters)[0]!; state.encounters = {};
    for (let index = 0; index < 12; index++) {
      const id = `branch.retired.${index}`;
      state.encounters[id] = { ...structuredClone(template), id, arrivalClass: "routine", lifecycle: "resolved",
        patientLocation: null, patientMovement: null, pendingResult: null, resolvedAtFacilityTick: 0,
        resolutionReason: "completed", finalPatientSatisfaction: 100 };
    }
    state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER; state.serviceAppointmentsEnabled = false;
    state.openChartEncounterId = null; state.attendedEncounterId = null;
    const serializedState = serializeGameState(state), campaign = codecTestCampaign(serializedState);
    const initial = await prepareCloudEvidenceImport({ serializedState, campaign, operationId: "retired.import" });
    const next = applyGameEvidenceCommand(initial.checkpoint, { type: "ADVANCE_TICK", operationId: "retired.tick", advancedAtRealMs: 60_000 });
    const retired = next.checkpoint.evidence.records.filter(row => row.kind === "retired-encounter");
    expect(retired.length).toBeGreaterThan(0); expect(Object.keys(next.state.encounters).length).toBeLessThan(12);
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: next.checkpoint, campaign, operationId: "retired.encode", expectedRevision: "1", source: initial.sourceRecovery });
    const device = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 0, baselineId: encoded.envelope.baselineId, snapshot: encoded.snapshot, evidence: encoded.packedEvidence };
    const copy = await importSeparateCloudCampaign(device, h.server.transport(h.scope.accountId), new MemoryCloudEntryStore());
    expect(copy.verified.checkpoint.evidence.records).toEqual(next.checkpoint.evidence.records);
    expect(copy.verified.checkpoint.evidence.records.filter(row => row.kind === "retired-encounter")).toEqual(retired);
    expect(copy.verified.state).toEqual({ ...next.state, campaignId: copy.marker.campaignId });
    expect(copy.loaded.evidence.records.map(row => [row.id, row.content.uncompressedSha256])).toEqual(device.evidence.records.map(row => [row.id, row.content.uncompressedSha256]));
  });

  it("carries a legacy baseline with a generated identity and its existing transition chain", async () => {
    const h = await syncHarness(), raw = JSON.parse(serializeGameState(createInitialGameState()));
    raw.schemaVersion = 1; delete raw.campaignId; delete raw.campaignSeed; delete raw.learningHistories;
    const serializedState = JSON.stringify(raw), campaign = codecTestCampaign(serializedState);
    const initial = await prepareCloudEvidenceImport({ serializedState, campaign, operationId: "legacy.import" });
    const next = applyGameEvidenceCommand(initial.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "legacy.branch" });
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: next.checkpoint, campaign, operationId: "legacy.encode", expectedRevision: "1", source: initial.sourceRecovery });
    const copy = await importSeparateCloudCampaign({ campaignId: campaign.campaignId, revision: "1", acceptedAtMs: 0,
      baselineId: encoded.envelope.baselineId, snapshot: encoded.snapshot, evidence: encoded.packedEvidence }, h.server.transport(h.scope.accountId), new MemoryCloudEntryStore());
    expect(copy.verified.state).toEqual({ ...next.state, campaignId: copy.marker.campaignId });
    expect(copy.verified.checkpoint.evidence.records).toEqual(next.checkpoint.evidence.records);
    expect(copy.verified.checkpoint.evidence.baseline.legacyReviewProjection).toBe(true);
  });

  it("imports the full checkpoint and transition chain without changing a record or the existing account campaign", async () => {
    const h = await divergent(), original = await load(h.device), acquired = h.server.calls.filter(row => row.method === "acquire").length;
    const id = await h.coordinator.keepBothProgress(); expect(id).toMatch(/^branch\.[a-f0-9]{64}$/);
    const imported = await load(await h.transport.load(id!));
    expect(imported.state).toEqual({ ...original.state, campaignId: id });
    expect(imported.checkpoint.evidence.records).toEqual(original.checkpoint.evidence.records);
    expect(imported.checkpoint.snapshot.head).toEqual(original.checkpoint.snapshot.head);
    expect(imported.checkpoint.snapshot.head.sequence).toBeGreaterThan(0);
    expect(imported.campaign).toEqual({ ...original.campaign, campaignId: id, name: `${original.campaign.name} (this device)`, status: "resumable" });
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)).toEqual(h.account);
    expect(h.server.calls.filter(row => row.method === "acquire")).toHaveLength(acquired);
    expect(h.server.usageCount(h.scope.accountId)).toBe(0);
    expect(h.coordinator.view.pending).toBe(false);
    const protectedCopy = (await h.entryStore.entries()).find(row => row.key.startsWith("conflict:"))!.value as { device: unknown; account: unknown };
    expect(JSON.stringify(protectedCopy.device)).toBe(h.recovery); expect(protectedCopy.account).toEqual(h.account.confirmed);
    const reopened = new CloudSyncCoordinator({ scope: { ...h.scope, campaignId: id! }, cache: h.cache, transport: h.transport,
      entryStore: h.entryStore, clock: h.clock, enabled: true });
    await reopened.open(); const session = await CloudGameSession.create(reopened);
    expect(await session.reconnect()).toBe(true); expect(session.canExecute).toBe(true);
    expect(serializeGameState(session.state)).toBe(serializeGameState(imported.state));
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "branch.continue" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.checkpointNow("purchase")).toBe(true);
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)).toEqual(h.account);
  });

  it("uses the frozen import after a lost acknowledgement even when the second account slot is now occupied", async () => {
    const h = await divergent();
    h.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    expect(await h.coordinator.keepBothProgress()).toBeNull();
    expect(h.coordinator.exportRecovery()).toBe(h.recovery); expect(h.server.account(h.scope.accountId).campaigns.size).toBe(2);
    const journal = (await h.entryStore.entries()).find(row => row.key.startsWith("import:"))!;
    const frozen = JSON.stringify(journal.value);
    await h.local.reconnect();
    expect(h.coordinator.view.conflictCopies).toMatchObject({ canSaveSeparate: true, separateCampaignSlots: 0 });
    const id = await h.coordinator.keepBothProgress(); expect(id).not.toBeNull();
    expect(h.server.calls.filter(row => row.method === "importCampaign")).toHaveLength(1);
    expect(h.server.operationCount(h.scope.accountId)).toBe(2); // remote save plus import
    expect(JSON.stringify((await h.entryStore.read<{ operation: unknown }>(journal.key))!.operation)).toBe(JSON.stringify(JSON.parse(frozen).operation));
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)).toEqual(h.account);
  });

  it("counts an archive against the slot limit and retains verified originals without uploading or deleting", async () => {
    const h = await divergent(), second = await syncFixture("separate.other-slot");
    h.server.seed(h.scope.accountId, second.confirmed);
    h.server.account(h.scope.accountId).campaigns.get("separate.other-slot")!.summary = { name: "Archived other clinic", status: "archived" };
    await h.local.reconnect();
    expect(h.coordinator.view.conflictCopies).toMatchObject({ canSaveSeparate: false, separateCampaignSlots: 0 });
    expect(await h.coordinator.keepBothProgress()).toBeNull();
    expect(h.coordinator.view).toMatchObject({ phase: "conflict", canExecute: false, failure: "campaign-slots", pending: true });
    expect(h.coordinator.exportRecovery()).toBe(h.recovery);
    expect((await h.entryStore.entries()).some(row => row.key.startsWith("conflict:"))).toBe(true);
    expect(h.server.calls.some(row => row.method === "importCampaign" || row.method === "deleteCampaign")).toBe(false);
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)).toEqual(h.account);
  });

  it("recovers a lost import after a cold reload with differently ordered cache JSON", async () => {
    const h = await divergent();
    h.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    expect(await h.coordinator.keepBothProgress()).toBeNull(); h.local.dispose();
    const cache = new MemoryCloudCache();
    await cache.write(JSON.parse(logicalJsonText(JSON.parse(h.recovery))), null);
    const coordinator = new CloudSyncCoordinator({ scope: h.scope, transport: h.transport, cache, clock: h.clock, entryStore: h.entryStore, enabled: true });
    await coordinator.open(); const session = await CloudGameSession.create(coordinator); expect(await session.reconnect()).toBe(false);
    expect(await coordinator.keepBothProgress()).not.toBeNull();
    expect(h.server.calls.filter(row => row.method === "importCampaign")).toHaveLength(1);
    expect(h.server.account(h.scope.accountId).campaigns.size).toBe(2);
  });

  it("reports backend capacity rather than claiming a free account slot is full", async () => {
    const h = await divergent();
    h.server.faults.push({ method: "importCampaign", at: "before", error: new CloudSyncError("capacity") });
    expect(await h.coordinator.keepBothProgress()).toBeNull();
    expect(h.coordinator.view).toMatchObject({ phase: "capacity", failure: "capacity", canExecute: false, pending: true });
    expect(h.coordinator.view.conflictCopies?.canSaveSeparate).toBe(true);
    expect(h.coordinator.exportRecovery()).toBe(h.recovery);
  });

  it("requires verified original-copy readback before any branch import", async () => {
    const h = await divergent(), read = h.entryStore.read.bind(h.entryStore);
    vi.spyOn(h.entryStore, "read").mockImplementation(key => key.startsWith("conflict:") ? Promise.resolve(null) : read(key));
    expect(await h.coordinator.keepBothProgress()).toBeNull();
    expect(h.coordinator.exportRecovery()).toBe(h.recovery);
    expect(h.server.calls.some(row => row.method === "importCampaign")).toBe(false);
  });

  it("keeps the original pending branch if the imported campaign fails verification", async () => {
    const h = await divergent(), transport = h.transport, importing = transport.importCampaign!.bind(transport);
    vi.spyOn(transport, "importCampaign").mockImplementation(async op => {
      const receipt = await importing(op);
      h.server.account(h.scope.accountId).campaigns.get(receipt.campaignId)!.confirmed.snapshot = { ...h.device.snapshot, uncompressedSha256: "0".repeat(64) };
      return receipt;
    });
    expect(await h.coordinator.keepBothProgress()).toBeNull(); expect(h.coordinator.exportRecovery()).toBe(h.recovery);
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)).toEqual(h.account);
  });

  it("requires a new comparison when another device saves after the dialog was reviewed", async () => {
    const h = await divergent();
    h.remote.execute({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "branch.remote-again" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await h.remote.checkpointNow("purchase")).toBe(true);
    expect(await h.coordinator.keepBothProgress()).toBeNull();
    expect(h.coordinator.view.conflictCopies?.accountRevision).toBe("3");
    expect(h.coordinator.exportRecovery()).toBe(h.recovery); expect(h.server.calls.some(row => row.method === "importCampaign")).toBe(false);
  });

  it("serializes an explicit branch import against retry and focus without granting commands", async () => {
    const h = await divergent(), gate = deferred();
    h.server.faults.push({ method: "importCampaign", at: "before", wait: gate.promise });
    const choosing = h.coordinator.keepBothProgress();
    await vi.waitFor(() => expect(h.server.calls.some(row => row.method === "importCampaign")).toBe(true));
    expect(await h.coordinator.retry()).toBe(false); expect(await h.local.reconnect()).toBe(false);
    expect(h.local.canExecute).toBe(false); expect(h.coordinator.exportRecovery()).toBe(h.recovery);
    gate.resolve(); expect(await choosing).not.toBeNull();
  });

  it("rejects a corrupt source before creating an import", async () => {
    const h = await divergent();
    await expect(importSeparateCloudCampaign({ ...h.device, snapshot: { ...h.device.snapshot, uncompressedSha256: "0".repeat(64) } }, h.transport, h.entryStore)).rejects.toThrow();
    expect(h.server.calls.some(row => row.method === "importCampaign")).toBe(false);
  });
});
