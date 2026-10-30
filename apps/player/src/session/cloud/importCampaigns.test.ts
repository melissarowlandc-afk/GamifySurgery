import { describe, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { accountStorageKey } from "../accountStorageKey";
import { PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { IndexedDbCloudEntryStore, MemoryCloudEntryStore } from "./entryStorage";
import { AUTOMATIC_ENROLLMENT_KEY, chooseAutomaticCampaignEnrollment, finishAutomaticCampaignEnrollment, importLocalCloudCampaign, inspectLocalCloudSources, prepareAutomaticCampaignEnrollment, promoteExistingLocalQuestions } from "./importCampaigns";
import { FakeCloudServer } from "./fakeTransport";
import { sha256Utf8 } from "./codecJson";
import { syncFixture } from "./syncTestSupport";
import { CloudSyncError } from "./transport";
import { MemoryJournalStorage } from "../localJournal";

async function fixture(id = "import.synthetic", name = "Local synthetic clinic", owner: string | null = "account-a") {
  const f = await syncFixture(id), metadata = { ...f.prepared.envelope.campaign, name };
  const raw = JSON.stringify({ schemaVersion: 2, tutorialGuidanceByCampaign: { [id]: metadata.tutorial.guidance },
    tutorialIntroDismissedCampaignIds: [], tutorialDailyRoutineTipAcknowledgments: {}, tutorialDailyRoutinePauseByCampaign: {},
    campaigns: [{ ...metadata, serializedState: f.prepared.sourceRecovery.text }] }, null, 2) + "\n";
  const storage = new Map([[accountStorageKey(PROTOTYPE_PROFILE_KEY, owner), raw]]);
  const store = new MemoryCloudEntryStore(), server = new FakeCloudServer(), transport = server.transport("account-a");
  const inspected = await inspectLocalCloudSources("account-a", { getItem: key => storage.get(key) ?? null }, store, owner === null);
  return { ...f, raw, storage, store, server, transport, source: inspected.sources[0]!, inspected };
}
describe("explicit local campaign enrollment", () => {
  it("does not enroll an older legacy profile when inspection of its journal fails", async () => {
    const f = await fixture(), journal = new MemoryJournalStorage();
    vi.spyOn(journal, "keys").mockRejectedValue(new CloudSyncError("storage"));
    const inspected = await inspectLocalCloudSources("account-a", { getItem: key => f.storage.get(key) ?? null }, f.store, false, journal);
    expect(inspected.sources[0]!.error).toContain("Browser recovery storage is unavailable");
    expect(inspected.journalUnavailable).toBe(true); expect(await f.store.read(AUTOMATIC_ENROLLMENT_KEY)).toBeNull();
    expect(f.server.operationCount("account-a")).toBe(0);
    expect(f.storage.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a"))).toBe(f.raw);
  });
  it("preserves an older profile's per-campaign guidance default without changing the original bytes", async () => {
    const f = await fixture(), profile = JSON.parse(f.raw); delete profile.tutorialGuidanceByCampaign; profile.tutorialsEnabled = false;
    const raw = JSON.stringify(profile);
    const inspected = await inspectLocalCloudSources("account-a", { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a") ? raw : null }, f.store);
    expect(inspected.sources[0]?.campaign.tutorial.guidance?.mode).toBe("off");
    expect((await f.store.entries()).some(row => (row.value as { text?: string }).text === raw)).toBe(true);
  });
  it("finishes only already-issued own-account Beta 1 receipts through the old outbox, preserving raw bytes", async () => {
    const f = await fixture(), own = { receipt_id: "00000000-0000-4000-8000-000000000001", kind: "question" as const, occurred_at: new Date().toISOString() };
    const other = { ...own, receipt_id: "00000000-0000-4000-8000-000000000002" };
    const profile = { ...JSON.parse(f.raw), pendingUsageQuestions: [own] }, unowned = { ...profile, pendingUsageQuestions: [other] };
    const raw = JSON.stringify(profile) + "\n";
    const inspection = await inspectLocalCloudSources("account-a", { getItem: key => key === PROTOTYPE_PROFILE_KEY ? JSON.stringify(unowned) : key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a") ? raw : null }, f.store, true);
    expect(inspection.pendingUsageQuestions).toEqual([own]);
    const commitQuestions = vi.fn(() => true), flush = vi.fn(async () => {});
    const usage = { canRecordQuestions: () => true, commitQuestions, flush };
    await promoteExistingLocalQuestions(inspection.pendingUsageQuestions, usage, f.store);
    await promoteExistingLocalQuestions(inspection.pendingUsageQuestions, usage, f.store);
    expect(commitQuestions).toHaveBeenCalledExactlyOnceWith([own]); expect(flush).toHaveBeenCalledOnce();
    expect(f.server.usageCount("account-a")).toBe(0);
    expect((await f.store.entries()).some(row => (row.value as { text?: string }).text === raw)).toBe(true);
  });
  it("never promotes staged counts without the existing usage notice acceptance", async () => {
    const store = new MemoryCloudEntryStore(), commitQuestions = vi.fn(() => true);
    await promoteExistingLocalQuestions([{ receipt_id: "00000000-0000-4000-8000-000000000001", kind: "question", occurred_at: new Date().toISOString() }],
      { canRecordQuestions: () => false, commitQuestions, flush: async () => {} }, store);
    expect(commitQuestions).not.toHaveBeenCalled(); expect(await store.entries()).toEqual([]);
  });
  it("retains exact raw bytes before parsing and does not upload on inspection/decline", async () => {
    const f = await fixture(); expect(f.inspected.problems).toEqual([]); expect(f.source.error).toBeNull();
    const recovery = (await f.store.entries()).find(row => row.key.startsWith("raw:"))!.value as { text: string; sha256: string };
    expect(recovery.text).toBe(f.raw); expect(recovery.sha256).toBe(await sha256Utf8(f.raw));
    expect(f.storage.values().next().value).toBe(f.raw); expect(f.server.calls).toEqual([]);
  });
  it("never inspects another account and requires explicit inclusion of unowned originals", async () => {
    const f = await fixture("unowned", "Unowned", null);
    const getItem = vi.fn((key: string) => f.storage.get(key) ?? null);
    const own = await inspectLocalCloudSources("account-a", { getItem }, f.store);
    expect(own.sources).toEqual([]);
    expect(getItem.mock.calls.every(([key]) => key.endsWith(".account.account-a"))).toBe(true);
    expect(getItem.mock.calls.some(([key]) => key.includes("account-b"))).toBe(false);
    const included = await inspectLocalCloudSources("account-a", { getItem }, f.store, true);
    expect(included.sources[0]?.unowned).toBe(true);
  });
  it("copies and verifies all logical fields, preserves original bytes and mints no historical counts", async () => {
    const f = await fixture(), result = await importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store);
    expect(result.verified.checkpoint).toEqual(f.prepared.checkpoint);
    expect(result.marker.revision).toBe("1"); expect(f.server.usageCount("account-a")).toBe(0);
    expect(f.storage.values().next().value).toBe(f.raw);
    expect((await f.transport.head(f.source.campaign.campaignId)).writerActive).toBe(false);
    const retry = await importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store);
    expect(retry.marker).toEqual(result.marker); expect(f.server.operationCount("account-a")).toBe(1);
  });
  it("recovers a lost import acknowledgement using its frozen operation without another import", async () => {
    const f = await fixture();
    f.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    await expect(importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store)).rejects.toMatchObject({ code: "network" });
    const staged = JSON.stringify((await f.store.entries()).find(row => row.key.startsWith("import:"))!.value);
    const recovered = await importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store);
    expect(recovered.marker.revision).toBe("1"); expect(f.server.operationCount("account-a")).toBe(1);
    expect(f.server.calls.filter(call => call.method === "importCampaign")).toHaveLength(1);
    expect(staged).toContain(recovered.marker.operationId); expect(f.storage.values().next().value).toBe(f.raw);
  });
  it("retains server acceptance when local marking crashes and verifies it on retry", async () => {
    const f = await fixture(); const write = f.store.write.bind(f.store);
    f.store.write = async (key, value) => { if (key.startsWith("enrolled:")) throw new CloudSyncError("storage"); return write(key, value); };
    await expect(importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store)).rejects.toMatchObject({ code: "storage" });
    f.store.write = write;
    await importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store);
    expect(f.server.operationCount("account-a")).toBe(1); expect(f.storage.values().next().value).toBe(f.raw);
  });
  it("rejects changed local branches and duplicate names instead of replacing an account campaign", async () => {
    const f = await fixture(); await importLocalCloudCampaign(f.source, f.source.campaign.name, f.transport, f.store);
    const changed = { ...f.source, serializedState: f.source.serializedState.replace('"cash":500', '"cash":501') + " " };
    await expect(importLocalCloudCampaign(changed, changed.campaign.name, f.transport, f.store)).rejects.toMatchObject({ code: "revision" });
    const other = await fixture("other", f.source.campaign.name);
    await expect(importLocalCloudCampaign(other.source, other.source.campaign.name, f.transport, f.store)).rejects.toMatchObject({ code: "corrupt" });
    expect(f.server.operationCount("account-a")).toBe(1);
    await importLocalCloudCampaign(other.source, "Unique renamed clinic", f.transport, f.store);
    expect((await f.transport.list()).map(row => row.name)).toContain("Unique renamed clinic");
  });
  it("counts archives in the two-campaign limit and allows partial batches without deleting extras", async () => {
    const f = await fixture(), second = await fixture("second", "Second"), third = await fixture("third", "Third");
    await importLocalCloudCampaign({ ...f.source, campaign: { ...f.source.campaign, status: "archived" } }, "Archived", f.transport, f.store);
    await importLocalCloudCampaign(second.source, "Second", f.transport, f.store);
    await expect(importLocalCloudCampaign(third.source, "Third", f.transport, f.store)).rejects.toMatchObject({ code: "capacity" });
    expect((await f.transport.list()).map(row => row.status)).toContain("archived");
    expect(third.storage.values().next().value).toBe(third.raw); expect(f.server.operationCount("account-a")).toBe(2);
  });
  it("does not upload damaged, future-version, oversized or nonconsenting sources", async () => {
    const f = await fixture();
    f.server.setAccess("account-a", { noticeAccepted: false });
    await expect(importLocalCloudCampaign(f.source, "Clinic", f.transport, f.store)).rejects.toMatchObject({ code: "notice" });
    expect(f.server.calls.some(call => call.method === "importCampaign")).toBe(false);
    for (const text of ["broken JSON", JSON.stringify({ schemaVersion: 99, campaigns: [] })]) {
      const store = new MemoryCloudEntryStore();
      const read = await inspectLocalCloudSources("account-a", { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a") ? text : null }, store);
      expect(read.problems.length).toBeGreaterThan(0); expect((await store.entries())[0]?.value).toMatchObject({ text });
    }
    const raw = JSON.parse(f.raw); raw.campaigns[0].serializedState = " ".repeat(3_000_001);
    const inspection = await inspectLocalCloudSources("account-a", { getItem: key => key === accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a") ? JSON.stringify(raw) : null }, f.store);
    expect(inspection.sources[0]?.error).toContain("too large");
  });
});

describe("account-scoped durable import storage", () => {
  it("atomically freezes the first chooser decision across tabs", async () => {
    vi.stubGlobal("IDBKeyRange", IDBKeyRange);
    try {
      const factory = new IDBFactory(), scope = { backendId: "backend", accountId: "account-a" };
      const first = new IndexedDbCloudEntryStore(scope, factory), second = new IndexedDbCloudEntryStore(scope, factory);
      const original = { phase: "choose", ids: [] as string[] }; await first.create("choice", original);
      const results = await Promise.all([first.compareAndSet("choice", original, { phase: "saving", ids: ["first"] }), second.compareAndSet("choice", original, { phase: "saving", ids: ["second"] })]);
      expect(results[0]).toEqual(results[1]); expect(results[0]!.phase).toBe("saving");
      expect(await first.compareAndSet("choice", original, { phase: "saving", ids: ["late"] })).toEqual(results[0]);
    } finally { vi.unstubAllGlobals(); }
  });
  it("preserves exact UTF-8 source text and atomically shares frozen imports across tabs, with scoped clearing", async () => {
    vi.stubGlobal("IDBKeyRange", IDBKeyRange);
    const factory = new IDBFactory(), scope = { backendId: "backend", accountId: "account-a" };
    const a = new IndexedDbCloudEntryStore(scope, factory), tab = new IndexedDbCloudEntryStore(scope, factory);
    const b = new IndexedDbCloudEntryStore({ ...scope, accountId: "account-b" }, factory);
    const raw = { text: '  {"name":"Café 🏥"}\n', sha256: "test" };
    expect(await a.create("raw", raw)).toEqual(raw);
    const results = await Promise.all([a.create("operation", { token: "first" }), tab.create("operation", { token: "second" })]);
    expect(results[0]).toEqual(results[1]); expect(await tab.read("raw")).toEqual(raw);
    await b.write("raw", { text: "other account" }); await a.clear();
    expect(await tab.entries()).toEqual([]); expect(await b.read("raw")).toEqual({ text: "other account" });
    vi.unstubAllGlobals();
  });
});

describe("durable automatic account campaign enrollment", () => {
  it("freezes the chooser once, imports only selected sources, and keeps omitted originals hidden", async () => {
    const first = await fixture("first", "First"), second = await fixture("second", "Second"), third = await fixture("third", "Third");
    const sources = [first.source, second.source, third.source];
    expect((await prepareAutomaticCampaignEnrollment(sources, [], first.store)).phase).toBe("choose");
    await chooseAutomaticCampaignEnrollment([second.source.id], 2, first.store);
    expect((await chooseAutomaticCampaignEnrollment([first.source.id], 2, first.store)).selectedIds).toEqual([second.source.id]);
    await finishAutomaticCampaignEnrollment(first.transport, first.store);
    expect((await first.transport.list()).map(row => row.name)).toEqual(["Second"]);
    expect((await prepareAutomaticCampaignEnrollment(sources, await first.transport.list(), first.store)).phase).toBe("complete");
    expect(first.storage.values().next().value).toBe(first.raw); expect(third.storage.values().next().value).toBe(third.raw);
    expect(first.server.calls.filter(call => call.method === "deleteCampaign")).toHaveLength(0);
  });
  it("uses only remaining slots and refuses an oversized chooser selection", async () => {
    const first = await fixture("first", "First"), second = await fixture("second", "Second"), third = await fixture("third", "Third");
    first.server.seed("account-a", first.confirmed);
    expect((await prepareAutomaticCampaignEnrollment([second.source, third.source], await first.transport.list(), first.store)).freeSlots).toBe(1);
    await expect(chooseAutomaticCampaignEnrollment([second.source.id, third.source.id], 1, first.store)).rejects.toMatchObject({ code: "capacity" });
    expect((await first.store.read<{ phase: string }>(AUTOMATIC_ENROLLMENT_KEY))?.phase).toBe("choose");
  });
  it("retains durable decisions after deleting a chosen account campaign, without re-enrolling its original", async () => {
    const f = await fixture(); await prepareAutomaticCampaignEnrollment([f.source], [], f.store); await finishAutomaticCampaignEnrollment(f.transport, f.store);
    await f.store.create(`retired:${f.source.campaign.campaignId}`, { revision: "1" });
    await f.transport.deleteCampaign!({ campaignId: f.source.campaign.campaignId, expectedRevision: "1" });
    await prepareAutomaticCampaignEnrollment([f.source], [], f.store); await finishAutomaticCampaignEnrollment(f.transport, f.store);
    expect(await f.transport.list()).toEqual([]); expect(f.storage.values().next().value).toBe(f.raw);
  });
  it("names colliding local campaigns uniquely without changing their original names", async () => {
    const first = await fixture("first", "Same name"), second = await fixture("second", "Same name");
    await prepareAutomaticCampaignEnrollment([first.source, second.source], [], first.store); await finishAutomaticCampaignEnrollment(first.transport, first.store);
    expect((await first.transport.list()).map(row => row.name)).toEqual(["Same name", "Same name (2)"]);
    expect(second.source.campaign.name).toBe("Same name"); expect(second.storage.values().next().value).toBe(second.raw);
  });
  it("retries a deliberately created account campaign after its initial import failed", async () => {
    const f = await fixture(); await prepareAutomaticCampaignEnrollment([], [], f.store);
    const source = { ...f.source, sourceKey: `created:${f.source.campaign.campaignId}` };
    await f.store.create(source.sourceKey, source);
    f.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    await expect(importLocalCloudCampaign(source, source.campaign.name, f.transport, f.store)).rejects.toMatchObject({ code: "network" });
    expect((await prepareAutomaticCampaignEnrollment([], await f.transport.list(), f.store)).phase).toBe("saving");
    await finishAutomaticCampaignEnrollment(f.transport, f.store);
    expect(f.server.operationCount("account-a")).toBe(1); expect((await f.store.read<{ phase: string }>(AUTOMATIC_ENROLLMENT_KEY))?.phase).toBe("complete");
  });
});
