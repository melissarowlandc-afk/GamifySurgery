import { IDBFactory } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IndexedDbCloudEntryStore, MemoryCloudEntryStore } from "./entryStorage";
import { readOptionalCloudEntry, readWriterIdentity, writeWriterIdentity } from "./writerIdentity";
import type { CloudLease } from "./transport";
import { CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
const scope = { backendId: "synthetic", accountId: "a", campaignId: "c" };
const lease: CloudLease = { campaignId: "c", revision: "1", writerGeneration: "1", writerToken: "a".repeat(64),
  writerActive: true, expiresAtMs: 60_000, serverNowMs: 0 };
describe("bounded per-campaign writer proof", () => {
  it("isolates proof by backend/account in the real IndexedDB entry store", async () => {
    const factory = new IDBFactory(), store = new IndexedDbCloudEntryStore(scope, factory);
    await writeWriterIdentity(store, scope, lease);
    expect((await readWriterIdentity(store, scope))?.lease).toEqual(lease);
    for (const other of [{ ...scope, accountId: "b" }, { ...scope, backendId: "other" }]) {
      expect(await readWriterIdentity(new IndexedDbCloudEntryStore(other, factory), other)).toBeNull();
    }
    expect(await readWriterIdentity(store, { ...scope, campaignId: "other" })).toBeNull();
  });
  it("keeps one tiny record per campaign and reads malformed legacy proof tolerantly without erasing it", async () => {
    const store = new MemoryCloudEntryStore();
    for (let index = 0; index < 50; index++) await writeWriterIdentity(store, scope, { ...lease, writerGeneration: String(index + 1) });
    expect(store.records.size).toBe(1); expect(JSON.stringify(await store.entries()).length).toBeLessThan(4096);
    const raw = { scope: { ...scope, accountId: "different" }, lease, acquisition: null };
    await store.write("writer:c", raw); expect(await readWriterIdentity(store, scope)).toBeNull();
    expect(await store.read("writer:c")).toEqual(raw);
  });
  it.each([null, "invalid-generation"])("replaces an unusable %s journal with checked writer proof", async legacy => {
    const store = new MemoryCloudEntryStore();
    await store.write("writer:c", legacy === null ? null : { scope, lease: { ...lease, writerGeneration: legacy }, acquisition: null });
    expect(await readWriterIdentity(store, scope)).toBeNull();
    expect(await writeWriterIdentity(store, scope, lease)).toBe(true);
    expect((await readWriterIdentity(store, scope))?.lease).toEqual(lease);
  });
  it("bounds optional reads and rejects an unsettled writer proof before it can authorize an acquisition", async () => {
    vi.useFakeTimers(); const store = new MemoryCloudEntryStore();
    vi.spyOn(store, "read").mockImplementation(() => new Promise(() => {}));
    vi.spyOn(store, "write").mockImplementation(() => new Promise(() => {}));
    const reading = readOptionalCloudEntry(store, "last-active-campaign"), writing = writeWriterIdentity(store, scope, lease);
    const rejected = expect(writing).rejects.toMatchObject({ code: "network" });
    await vi.advanceTimersByTimeAsync(1500);
    expect(await reading).toBeNull();
    await vi.advanceTimersByTimeAsync(CLOUD_READ_TIMEOUT_MS - 1500); await rejected;
    expect(vi.getTimerCount()).toBe(0);
  });
});
