import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { IndexedDbCloudCache, MemoryCloudCache } from "./cache";
import { cloudCodec } from "./codecWorker";
import { MemoryCloudEntryStore } from "./entryStorage";
import { completedAutomaticEnrollment, AUTOMATIC_ENROLLMENT_KEY } from "./importCampaigns";
import { syncHarness } from "./syncTestSupport";
import { CloudGameSession } from "./gameSession";
import { readCampaignPreview, rememberCampaignPreview } from "./campaignPreview";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it.each([false, true])("inventory reads only scoped IDs without codec or journal work (IDB=%s)", async idb => {
  vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const h = await syncHarness(), cache = idb ? new IndexedDbCloudCache(new IDBFactory()) : new MemoryCloudCache();
  try {
    await cache.write({ schemaVersion: 1, scope: h.scope, confirmed: h.confirmed, recovery: null }, null);
    const codec = vi.spyOn(cloudCodec, "run"), journal = vi.spyOn(cache.journal, "head");
    expect(await cache.accountInventory(h.scope)).toEqual([{ campaignId: h.scope.campaignId }]);
    expect(await cache.accountInventory({ ...h.scope, accountId: "another" })).toEqual([]);
    expect(codec).not.toHaveBeenCalled(); expect(journal).not.toHaveBeenCalled();
  } finally { if (cache instanceof IndexedDbCloudCache) await cache.close(); }
});
it("shares journal preparation only while the checked bytes and committed high-water are unchanged", async () => {
  const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
  const session = await CloudGameSession.create(h.coordinator);
  try {
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "entry.journal.one" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true);
    const tasks = vi.spyOn(cloudCodec, "run");
    const [one, all] = await Promise.all([h.cache.read(h.scope), h.cache.accountEntries!(h.scope)]);
    expect(all[0]).toEqual(one!.entry);
    await h.cache.read(h.scope);
    expect(tasks.mock.calls.filter(([task]) => task.kind === "journalPrepare")).toHaveLength(1);
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "entry.journal.two" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.durable()).toBe(true); await h.cache.read(h.scope);
    expect(tasks.mock.calls.filter(([task]) => task.kind === "journalPrepare")).toHaveLength(2);
  } finally { session.dispose(); }
});
it("completed enrollment reads only pending creations, preserving retries and retired exclusions", async () => {
  const store = new MemoryCloudEntryStore(), prior = { version: 1, phase: "complete", candidates: [], selectedIds: [], freeSlots: 2 };
  await store.write(AUTOMATIC_ENROLLMENT_KEY, prior);
  await store.write("older-copy:large", { text: "untouched recovery" });
  const entries = vi.spyOn(store, "entries");
  expect(await completedAutomaticEnrollment(store)).toEqual(prior); expect(entries).toHaveBeenCalledExactlyOnceWith("created:");
  await store.write("created:pending", { campaign: { campaignId: "pending" } });
  expect(await completedAutomaticEnrollment(store)).toBeNull();
  await store.write("retired:pending", { revision: "1" });
  expect(await completedAutomaticEnrollment(store)).toEqual(prior);
  expect(await store.read("older-copy:large")).toEqual({ text: "untouched recovery" });
});
it("preview metadata is optional, revision-specific, and written only from a verified inspection", async () => {
  const h = await syncHarness(), store = new MemoryCloudEntryStore();
  expect(await readCampaignPreview(store, h.scope.campaignId, "1")).toBeNull();
  const inspection = await cloudCodec.run({ kind: "inspectCopy", input: h.confirmed });
  await rememberCampaignPreview(store, h.confirmed, inspection);
  expect(await readCampaignPreview(store, h.scope.campaignId, "1")).toBe(0);
  expect(await readCampaignPreview(store, h.scope.campaignId, "2")).toBeNull();
});
