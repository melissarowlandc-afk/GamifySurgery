import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { appendLocalCampaign, createFreshProfile, requireActiveCampaign, selectLocalCampaign } from "./prototypeStorage";
import { LocalProfileJournal, recoverLocalProfile } from "./localProfileJournal";
import { MemoryJournalStorage } from "./localJournal";
import { cloudCodec } from "./cloud/codecWorker";
import { inspectLocalCloudSources, importLocalCloudCampaign } from "./cloud/importCampaigns";
import { MemoryCloudEntryStore } from "./cloud/entryStorage";
import { FakeCloudServer } from "./cloud/fakeTransport";
import { loadCloudEvidenceCheckpoint } from "./cloud/codecEvidence";
import { accountStorageKey } from "./accountStorageKey";
import { PROTOTYPE_PROFILE_KEY } from "./prototypeStorage";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });
const activeProfile = () => appendLocalCampaign(createFreshProfile(), createInitialGameState().founder, "Journal clinic", 0, "journal").profile;
describe("legacy local profiles plus incremental durability", () => {
  it("reads a legacy profile unchanged when no journal exists", async () => {
    const profile = createFreshProfile(), before = JSON.stringify(profile);
    expect(await recoverLocalProfile(profile, null, new MemoryJournalStorage())).toBe(profile);
    expect(JSON.stringify(profile)).toBe(before);
  });
  it("restores the exact committed state on a second lifetime, including after compaction", async () => {
    const profile = activeProfile(), store = new MemoryJournalStorage(), receipts: unknown[] = [];
    const original = serializeGameState(requireActiveCampaign(profile).state);
    const journal = await LocalProfileJournal.create(profile, "account", error => { throw error; }, q => receipts.push(q), store);
    const state = journal.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "local.committed" }, PROTOTYPE_DOMAIN_CONTEXT);
    const next = { ...profile, campaigns: profile.campaigns.map(row => ({ ...row, state })) };
    journal.record(next); expect(receipts).toHaveLength(0);
    expect(await journal.durable()).toBe(true); expect(receipts).toHaveLength(1);
    expect(await journal.compact(true)).toBe(true); journal.stop();
    expect(serializeGameState(requireActiveCampaign(profile).state)).toBe(original);
    const restored = await recoverLocalProfile(profile, "account", store);
    expect(requireActiveCampaign(restored).state).toEqual(state);
    const second = await LocalProfileJournal.create(restored, "account", error => { throw error; }, () => {}, store);
    const later = second.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "local.next.document" }, PROTOTYPE_DOMAIN_CONTEXT);
    second.record({ ...restored, campaigns: restored.campaigns.map(row => ({ ...row, state: later })) });
    expect(await second.durable()).toBe(true); second.stop();
    const again = await recoverLocalProfile(profile, "account", store);
    expect(requireActiveCampaign(again).state).toEqual(later);
    const data = await store.read((await store.keys("local|"))[0]!);
    const rows = data!.snapshot.seed.checkpoint.evidence.records.concat(data!.rows.flatMap(row => row.delta?.records ?? []));
    expect(rows.filter(row => row.kind === "transition")).toHaveLength(2);
  });
  it("does not run bulk encoding during ordinary commands or a hidden drain, and does not resurrect deletion", async () => {
    const profile = activeProfile(), store = new MemoryJournalStorage();
    const journal = await LocalProfileJournal.create(profile, null, () => {}, () => {}, store);
    const codec = vi.spyOn(cloudCodec, "run");
    const state = journal.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "hidden.local" }, PROTOTYPE_DOMAIN_CONTEXT);
    journal.record({ ...profile, campaigns: profile.campaigns.map(row => ({ ...row, state })) });
    expect(await journal.durable()).toBe(true); expect(codec).not.toHaveBeenCalled(); journal.stop();
    const removed = { ...profile, campaigns: [], activeCampaignId: null };
    expect(await recoverLocalProfile(removed, null, store)).toBe(removed);
    expect(await store.keys("local|")).toHaveLength(1); // Bytes remain protected; no implicit destructive cleanup.
  });
  it("enrolls the latest local journal faithfully, retaining every transition instead of copying an older legacy profile", async () => {
    const profile = activeProfile(), store = new MemoryJournalStorage(), entries = new MemoryCloudEntryStore(), account = "local.enroll";
    const original = { ...profile, campaigns: profile.campaigns.map(({ state, ...row }) => ({ ...row, serializedState: serializeGameState(state) })) };
    const journal = await LocalProfileJournal.create(profile, account, () => {}, () => {}, store);
    const state = journal.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "local.before.enrollment" }, PROTOTYPE_DOMAIN_CONTEXT);
    journal.record({ ...profile, campaigns: profile.campaigns.map(row => ({ ...row, state })) }); await journal.durable(); journal.stop();
    const inspected = await inspectLocalCloudSources(account, { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, account) ? JSON.stringify(original) : null }, entries, false, store);
    expect(inspected.problems).toEqual([]); expect(inspected.sources).toHaveLength(1);
    const source = inspected.sources[0]!;
    expect(source.localEvidence!.evidence.records.some(row => row.kind === "transition")).toBe(true);
    const server = new FakeCloudServer(), transport = server.transport(account);
    await importLocalCloudCampaign(source, source.campaign.name, transport, entries);
    const copy = await transport.load(state.campaignId), loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
      expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
    expect(loaded.state).toEqual(state); expect(loaded.checkpoint.evidence).toEqual(source.localEvidence!.evidence);
    expect(server.usageCount(account)).toBe(0);
  });
  it("keeps its evidence and guidance metadata when a campaign is switched away and reopened in the same document", async () => {
    const profile = activeProfile(), store = new MemoryJournalStorage();
    const first = await LocalProfileJournal.create(profile, null, () => {}, () => {}, store);
    const state = first.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "before.switch" }, PROTOTYPE_DOMAIN_CONTEXT);
    const changed = { ...profile, campaigns: profile.campaigns.map(row => ({ ...row, state })), tutorialIntroDismissedCampaignIds: [state.campaignId] };
    first.record(changed); await first.durable(); first.stop();
    const reopened = await LocalProfileJournal.create(changed, null, () => {}, () => {}, store);
    const next = reopened.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "after.switch" }, PROTOTYPE_DOMAIN_CONTEXT);
    reopened.record({ ...changed, campaigns: changed.campaigns.map(row => ({ ...row, state: next })) }); await reopened.durable(); reopened.stop();
    const restored = await recoverLocalProfile(profile, null, store);
    expect(requireActiveCampaign(restored).state).toEqual(next); expect(restored.tutorialIntroDismissedCampaignIds).toEqual([state.campaignId]);
    const data = await store.read((await store.keys("local|"))[0]!);
    expect(data!.snapshot.seed.checkpoint.snapshot.head.sequence + data!.rows.filter(row => row.delta).length).toBe(2);
  });
  it("merges campaign-specific preferences and orders global preferences by committed sequence, not traversal or wall time", async () => {
    const one = activeProfile(), two = appendLocalCampaign(one, createInitialGameState().founder, "Other clinic", 1, "two").profile;
    const firstProfile = selectLocalCampaign(two, one.activeCampaignId!), store = new MemoryJournalStorage();
    const first = await LocalProfileJournal.create(firstProfile, "account", () => {}, () => {}, store);
    const firstMeta = { ...firstProfile, tutorialIntroDismissedCampaignIds: [one.activeCampaignId!] };
    first.record(firstMeta); await first.durable(); first.stop();
    const next = { ...selectLocalCampaign(firstMeta, two.activeCampaignId!), tutorialsEnabled: false,
      pendingUsageQuestions: [{ kind: "question" as const, receipt_id: crypto.randomUUID(), occurred_at: new Date().toISOString() }],
      tutorialIntroDismissedCampaignIds: [one.activeCampaignId!, two.activeCampaignId!] };
    const second = await LocalProfileJournal.create(next, "account", () => {}, () => {}, store); second.stop();
    const keys = store.keys.bind(store); vi.spyOn(store, "keys").mockImplementation(async prefix => (await keys(prefix)).reverse());
    const restored = await recoverLocalProfile(firstProfile, "account", store);
    expect(restored.tutorialsEnabled).toBe(false);
    expect(restored.activeCampaignId).toBe(two.activeCampaignId);
    expect(restored.pendingUsageQuestions).toEqual(next.pendingUsageQuestions);
    expect(new Set(restored.tutorialIntroDismissedCampaignIds)).toEqual(new Set([one.activeCampaignId!, two.activeCampaignId!]));
    const text = JSON.stringify({ ...firstProfile, campaigns: firstProfile.campaigns.map(({ state, ...row }) => ({ ...row, serializedState: serializeGameState(state) })) });
    const inspected = await inspectLocalCloudSources("account", { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account") ? text : null }, new MemoryCloudEntryStore(), false, store);
    expect(inspected.pendingUsageQuestions).toEqual(next.pendingUsageQuestions);
  });
});
