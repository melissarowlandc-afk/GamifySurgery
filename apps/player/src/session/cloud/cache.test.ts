import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { cloudCampaignStorageKey, accountStorageKey } from "../accountStorageKey";
import { CloudCacheError, IndexedDbCloudCache, MemoryCloudCache, cloudRecoveryBytes, type CloudCacheEntry } from "./cache";
import { syncFixture } from "./syncTestSupport";

async function entry(): Promise<CloudCacheEntry> {
  const fixture = await syncFixture();
  return { schemaVersion: 1, scope: { backendId: "backend-a", accountId: "account-a", campaignId: fixture.confirmed.campaignId }, confirmed: fixture.confirmed, recovery: null };
}
describe("versioned account/backend/campaign cloud cache", () => {
  it("keeps prototype keys unchanged and requires three unambiguous namespace components", () => {
    expect(accountStorageKey("gamify-surgery.prototype.profile.v1")).toBe("gamify-surgery.prototype.profile.v1");
    expect(() => cloudCampaignStorageKey({ backendId: "", accountId: "a", campaignId: "b" })).toThrow();
    expect(cloudCampaignStorageKey({ backendId: "a:b", accountId: "c", campaignId: "d" }))
      .not.toBe(cloudCampaignStorageKey({ backendId: "a", accountId: "b:c", campaignId: "d" }));
  });
  it.each(["indexeddb", "memory"])("verifies durable writes and isolates A/B, backend and campaign (%s)", async kind => {
    const cache = kind === "indexeddb" ? new IndexedDbCloudCache(new IDBFactory()) : new MemoryCloudCache();
    const initial = await entry(), saved = await cache.write(initial, null);
    expect(saved.cacheRevision).toBe(1);
    expect((await cache.read(initial.scope))?.entry).toEqual(initial);
    for (const scope of [{ ...initial.scope, accountId: "account-b" }, { ...initial.scope, backendId: "backend-b" }, { ...initial.scope, campaignId: "other" }]) {
      expect(await cache.read(scope)).toBeNull();
    }
    await expect(cache.write(initial, null)).rejects.toMatchObject({ reason: "conflict" });
    expect((await cache.read(initial.scope))?.cacheRevision).toBe(1);
  });
  it("fences concurrent tabs with an IndexedDB transaction compare-and-swap", async () => {
    const factory = new IDBFactory(), a = new IndexedDbCloudCache(factory), b = new IndexedDbCloudCache(factory), initial = await entry();
    const outcomes = await Promise.allSettled([a.write(initial, null), b.write(initial, null)]);
    expect(outcomes.filter(result => result.status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter(result => result.status === "rejected")).toHaveLength(1);
    expect((await a.read(initial.scope))?.cacheRevision).toBe(1);
  });
  it("preserves old bytes on transaction abort and distinguishes a commit with a lost response", async () => {
    const factory = new IDBFactory(), cache = new IndexedDbCloudCache(factory), initial = await entry();
    await cache.write(initial, null);
    const aborting = new IndexedDbCloudCache(factory, undefined, { beforeCommit: tx => tx.abort() });
    await expect(aborting.write(initial, 1)).rejects.toBeInstanceOf(CloudCacheError);
    expect((await cache.read(initial.scope))?.cacheRevision).toBe(1);
    const lost = new IndexedDbCloudCache(factory, undefined, { afterCommit: () => { throw new Error("crash after durable commit"); } });
    await expect(lost.write(initial, 1)).rejects.toBeInstanceOf(CloudCacheError);
    expect((await cache.read(initial.scope))?.cacheRevision).toBe(2);
  });
  it("does not fall back when IndexedDB is unavailable or blocked by browser policy", async () => {
    await expect(new IndexedDbCloudCache(null).read((await entry()).scope)).rejects.toMatchObject({ reason: "unavailable" });
    const denied = { open() { throw new DOMException("denied", "SecurityError"); } } as unknown as IDBFactory;
    await expect(new IndexedDbCloudCache(denied).read((await entry()).scope)).rejects.toMatchObject({ reason: "unavailable" });
  });
  it("detects corrupted readback and never reports a verified local write", async () => {
    const cache = new MemoryCloudCache(), initial = await entry(); cache.fault = "corrupt";
    await expect(cache.write(initial, null)).rejects.toMatchObject({ reason: "checksum" });
    await expect(cache.read(initial.scope)).rejects.toMatchObject({ reason: "checksum" });
  });
  it("counts UTF-8, escaping, scope and metadata in the actual 7 MB recovery cap", async () => {
    const cache = new MemoryCloudCache(), initial = await entry();
    initial.recovery = { baseRevision: "1", writerGeneration: "1", following: null,
      inFlight: { operationId: "large", createdAtMs: 0, requestSha256: "0".repeat(64), requestText: "\"🩺".repeat(1_200_000) } };
    expect(cloudRecoveryBytes(initial)).toBeGreaterThan(7_000_000);
    await expect(cache.write(initial, null)).rejects.toMatchObject({ reason: "capacity" });
    expect(await cache.read(initial.scope)).toBeNull();
  });
});
