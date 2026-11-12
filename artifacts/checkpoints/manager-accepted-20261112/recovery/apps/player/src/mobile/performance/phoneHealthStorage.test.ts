import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { phoneHealthStorage, PHONE_HEALTH_DATABASE, type PhoneHealthStorage } from "./phoneHealthStorage";
import { PhoneMemoryGuard, PHONE_MEMORY_KEY } from "./phoneMemoryPolicy";

afterEach(() => vi.useRealTimers());
const marker = (phase: "opening" | "playing" | null, at = 100_000) => JSON.stringify({ version: 1, active: phase ? { phase, at } : null, restarts: [], safeUntil: 0, updatedAt: at });
function local(text: string | null = null) {
  const values = new Map<string, string>([["save.untouched", "original save bytes"]]);
  if (text) values.set(PHONE_MEMORY_KEY, text);
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem(key: string, text: string) { values.set(key, text); } };
}

it("uses one bounded independent IDB row, survives loss of localStorage and ignores delayed older writes", async () => {
  const factory = new IDBFactory(), storage = phoneHealthStorage(factory);
  await storage.write(marker("playing"));
  expect(await storage.read()).toBe(marker("playing"));
  await storage.write(marker(null, 110_000)); await storage.write(marker("opening", 105_000));
  expect(await storage.read()).toBe(marker(null, 110_000)); storage.close();
  const fresh = phoneHealthStorage(factory);
  expect(await fresh.read()).toBe(marker(null, 110_000));
  expect((await factory.databases()).map(row => row.name)).toEqual([PHONE_HEALTH_DATABASE]);
  await expect(fresh.write("x".repeat(1025))).rejects.toThrow("too large"); fresh.close();
});

it("recovers an unclean marker after localStorage loss and lowers memory automatically", async () => {
  const factory = new IDBFactory(), durable = phoneHealthStorage(factory);
  await durable.write(marker("playing")); durable.close();
  const store = local(), codes: string[] = [], guard = new PhoneMemoryGuard(store, () => 101_000, code => codes.push(code), phoneHealthStorage(factory));
  expect(guard.beginOpening().mode).toBe("reduced"); // Safe while the independent marker is still being read.
  guard.markPlaying(); await guard.flushAuxiliary();
  expect(guard.profile.mode).toBe("reduced"); expect(codes).toContain("phone-memory-marker-recovered");
  expect(guard.health).toMatchObject({ phase: "playing", uncleanRestarts: 1, durableStorage: "ready" });
  expect([...store.values.keys()].sort()).toEqual([PHONE_MEMORY_KEY, "save.untouched"].sort());
  expect(store.values.get("save.untouched")).toBe("original save bytes"); guard.dispose();
});

it("a single interrupted opening selects reduced mode; clean home-screen starts do not accumulate incidents", () => {
  const store = local(JSON.stringify({ ...JSON.parse(marker("opening")), unexpected: "discard-me" })), codes: string[] = [];
  const guard = new PhoneMemoryGuard(store, () => 101_000, code => codes.push(code));
  expect(guard.beginOpening().mode).toBe("reduced"); expect(codes).toContain("phone-memory-incomplete-opening");
  guard.clean();
  expect(JSON.parse(store.getItem(PHONE_MEMORY_KEY)!).active).toBeNull();
  expect(JSON.parse(store.getItem(PHONE_MEMORY_KEY)!).restarts).toEqual([]);
  expect(JSON.parse(store.getItem(PHONE_MEMORY_KEY)!)).not.toHaveProperty("unexpected");
});

it("a fresh standalone phone is conservative even if both stores have been evicted", async () => {
  const store = local(), codes: string[] = [], guard = new PhoneMemoryGuard(store, () => 101_000, code => codes.push(code), phoneHealthStorage(new IDBFactory()), true);
  expect(guard.profile).toMatchObject({ mode: "reduced", maxDpr: 1, textureCount: 32 });
  guard.beginOpening(); await guard.flushAuxiliary(); expect(guard.profile.mode).toBe("reduced");
  expect(codes).toContain("phone-memory-fresh-standalone"); guard.dispose();
});

it("a late mirror read never reactivates a hidden page or overwrites a newer clean local marker", async () => {
  let complete!: (text: string) => void;
  const writes: string[] = [], mirror: PhoneHealthStorage = { read: () => new Promise(done => { complete = done; }), write: async text => { writes.push(text); }, close() {} };
  const guard = new PhoneMemoryGuard(local(), () => 120_000, () => {}, mirror);
  guard.beginOpening(); guard.markPlaying(); guard.clean(); await Promise.resolve(); complete(marker("playing")); await guard.flushAuxiliary();
  expect(guard.health).toMatchObject({ phase: "clean", uncleanRestarts: 0 }); expect(JSON.parse(writes.at(-1)!).active).toBeNull(); guard.dispose();
  const newer = new PhoneMemoryGuard(local(marker(null, 130_000)), () => 140_000, () => {}, { ...mirror, read: async () => marker("opening", 100_000) });
  newer.beginOpening(); await newer.flushAuxiliary(); expect(newer.profile.mode).toBe("normal"); newer.dispose();
});

it("coalesces repeated lifecycle updates while a mirror write is slow, then writes the latest clean state", async () => {
  let release!: () => void;
  const writes: string[] = [], mirror: PhoneHealthStorage = { read: async () => null, write: async text => { writes.push(text); if (writes.length === 1) await new Promise<void>(done => { release = done; }); }, close() {} };
  const guard = new PhoneMemoryGuard(local(), () => 100_000, () => {}, mirror);
  guard.beginOpening(); await vi.waitFor(() => expect(writes).toHaveLength(1));
  for (let i = 0; i < 1000; i++) { guard.resume(); guard.clean(); }
  expect(writes).toHaveLength(1); release(); await guard.flushAuxiliary();
  expect(writes).toHaveLength(2); expect(JSON.parse(writes[1]!).active).toBeNull(); guard.dispose();
});

it("handles unavailable/throwing durable storage without blocking play, throwing or touching saves", async () => {
  const codes: string[] = [], store = local(), guard = new PhoneMemoryGuard(store, () => 100_000, code => codes.push(code), { read() { throw Error("Denied"); }, write: async () => {}, close() {} }, true);
  expect(() => guard.beginOpening()).not.toThrow(); await guard.flushAuxiliary();
  expect(guard.health.durableStorage).toBe("unavailable"); expect(codes).toContain("phone-memory-durable-unavailable");
  expect(store.values.get("save.untouched")).toBe("original save bytes"); guard.dispose();
});

it("times out a blocked IDB open and closes a late success rather than keeping a connection", async () => {
  vi.useFakeTimers();
  const request: Partial<IDBOpenDBRequest> = {}, close = vi.fn();
  const storage = phoneHealthStorage({ open: () => request } as unknown as IDBFactory);
  const read = expect(storage.read()).rejects.toThrow("timeout");
  await vi.advanceTimersByTimeAsync(2_001); await read;
  Object.assign(request, { result: { close } }); request.onsuccess?.call(request as IDBOpenDBRequest, new Event("success"));
  expect(close).toHaveBeenCalledOnce(); storage.close();
});

it("ignores a delayed transaction callback after timeout instead of writing to an aborted transaction", async () => {
  vi.useFakeTimers();
  const get: Partial<IDBRequest> = {}, put = vi.fn(() => { throw Error("TransactionInactiveError"); });
  const tx = { objectStore: () => ({ get: () => get, put }), abort: vi.fn() } as unknown as IDBTransaction;
  const open: Partial<IDBOpenDBRequest> = {};
  const storage = phoneHealthStorage({ open: () => open } as unknown as IDBFactory);
  const pending = expect(storage.write(marker("playing"))).rejects.toThrow("timeout");
  Object.assign(open, { result: { transaction: () => tx, close() {} } });
  open.onsuccess?.call(open as IDBOpenDBRequest, new Event("success"));
  await vi.advanceTimersByTimeAsync(2_001); await pending;
  Object.assign(get, { result: null });
  expect(() => get.onsuccess?.call(get as IDBRequest, new Event("success"))).not.toThrow();
  expect(put).not.toHaveBeenCalled(); expect(tx.abort).toHaveBeenCalledOnce(); storage.close();
});
