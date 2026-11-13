import * as compression from "./cloud/codecCompression";
import { deferred } from "./cloud/syncTestSupport";
import { IDBFactory, IDBKeyRange, IDBObjectStore } from "fake-indexeddb";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createGameEvidenceCheckpoint, createInitialGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { IndexedDbJournalStorage, type JournalRow, type JournalSeed } from "./localJournal";
import { decodeJournalValue, encodeJournalValue, isEncodedJournalValue, rememberEncodedJournalValues } from "./journalEncoding";
import { codecTestCampaign } from "./cloud/codecTestSupport";
import { sha256Utf8 } from "./cloud/codecJson";

const rollout = vi.hoisted(() => ({ enabled: true }));
vi.mock("./localStorageBuildPolicy", () => ({ get LOCAL_STORAGE_COMPRESSION_WRITES() { return rollout.enabled; } }));
beforeEach(() => { rollout.enabled = true; });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const request = <T>(r: IDBRequest<T>) => new Promise<T>((done, fail) => { r.onsuccess = () => done(r.result); r.onerror = () => fail(r.error); });
const committed = (tx: IDBTransaction) => new Promise<void>((done, fail) => { tx.oncomplete = () => done(); tx.onabort = () => fail(Error("abort")); });
async function fixture() {
  vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const factory = new IDBFactory(), name = "compressed-journal";
  const store = new IndexedDbJournalStorage(name, factory);
  const state = createInitialGameState(undefined, { campaignId: "public.compression", campaignSeed: "public.compression", createdAtRealMs: 0 });
  const seed: JournalSeed = { checkpoint: createGameEvidenceCheckpoint(state), campaign: codecTestCampaign(serializeGameState(state)), source: null, confirmed: null, usageQuestions: [] };
  const head = await store.bind("key", "owner", null, seed, await sha256Utf8(JSON.stringify(seed)));
  const db = await request(factory.open(name, 2));
  const row = (version: number): JournalRow => ({ version, delta: null, campaign: seed.campaign, usageQuestions: [],
    profile: { patches: Array.from({ length: 100 }, (_, i) => ({ path: ["environment", "public-fixture", String(i)], present: true, value: i })) } });
  return { store, db, seed, head, row };
}

it("reduces actual stored payload by at least50% and recovers byte-exact logical rows/seeds, including plain predecessors", async () => {
  const f = await fixture();
  try {
    const writes: unknown[] = [], put = IDBObjectStore.prototype.put;
    vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (this: IDBObjectStore, value, key) {
      if (this.name === "rows") writes.push(structuredClone(value)); return put.call(this, value, key!);
    });
    const rows = Array.from({ length: 8 }, (_, i) => f.row(i + 1));
    await f.store.append("key", "owner", 0, rows);
    expect(JSON.stringify(writes).length).toBeLessThan(JSON.stringify(rows).length * .5);
    expect(writes.every(isEncodedJournalValue)).toBe(true);
    const read = (await f.store.read("key"))!;
    expect(JSON.stringify(read.snapshot.seed)).toBe(JSON.stringify(f.seed));
    for (let i = 0; i < rows.length; i++) {
      const expected = { ...rows[i], sha256: await sha256Utf8(JSON.stringify(rows[i])) };
      expect(JSON.stringify(read.rows[i])).toBe(JSON.stringify(expected));
    }
    // A pre-upgrade plain row mixed into the same generation remains readable.
    const tx = f.db.transaction("rows", "readwrite"), done = committed(tx);
    tx.objectStore("rows").put(read.rows[0], JSON.stringify(["key", "0000000000000001"])); await done;
    expect((await f.store.changes("key", 0))!.rows).toStrictEqual(read.rows);
    expect(await f.store.append("key", "owner", 0, rows)).toBe(8); // Lost ack, mixed wire dialects.
    await expect(f.store.append("key", "owner", 0, [{ ...rows[0]!, profile: "different" }, ...rows.slice(1)])).rejects.toMatchObject({ reason: "conflict" });
    await f.store.bind("key", "new-owner", read.head, f.seed, await sha256Utf8(JSON.stringify(f.seed)));
    await expect(f.store.append("key", "owner", 8, [f.row(9)])).rejects.toMatchObject({ reason: "conflict" });
  } finally { f.db.close(); }
});

it("rejects corrupt compressed rows on recovery and lost-ack retry instead of trusting their digest header", async () => {
  const f = await fixture();
  try {
    const rows = [f.row(1)]; await f.store.append("key", "owner", 0, rows);
    const tx = f.db.transaction("rows", "readwrite"), done = committed(tx), key = JSON.stringify(["key", "0000000000000001"]);
    const wire = await request(tx.objectStore("rows").get(key)); expect(isEncodedJournalValue(wire)).toBe(true);
    wire.payload.dataBase64 = "AAAA" + wire.payload.dataBase64.slice(4);
    tx.objectStore("rows").put(wire, key); await done;
    await expect(f.store.read("key")).rejects.toMatchObject({ reason: "checksum" });
    await expect(f.store.append("key", "owner", 0, rows)).rejects.toMatchObject({ reason: "checksum" });
    expect((await f.store.head("key"))!.highWater).toBe(1);
  } finally { f.db.close(); }
});

it("does not acknowledge an aborted row+manifest transaction, then retries the unchanged batch", async () => {
  const f = await fixture();
  try {
    const put = IDBObjectStore.prototype.put;
    const fault = vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (this: IDBObjectStore, value, key) {
      const result = put.call(this, value, key!); if (this.name === "heads") this.transaction.abort(); return result;
    });
    await expect(f.store.append("key", "owner", 0, [f.row(1)])).rejects.toBeDefined();
    expect((await f.store.head("key"))!.highWater).toBe(0); expect((await f.store.read("key"))!.rows).toEqual([]);
    fault.mockRestore(); expect(await f.store.append("key", "owner", 0, [f.row(1)])).toBe(1);
  } finally { f.db.close(); }
});

it.each([false, true])("reads independently of writes=%s and fails closed for unknown or oversized encodings", async writesEnabled => {
  const value = { text: "public fixture ".repeat(1000), ordered: { z: 0, a: 1 }, unicode: "\u2764\ud83d\ude00" };
  const encoded = await encodeJournalValue(value); expect(isEncodedJournalValue(encoded)).toBe(true);
  rollout.enabled = writesEnabled;
  expect(JSON.stringify(await decodeJournalValue(encoded))).toBe(JSON.stringify(value));
  if (!isEncodedJournalValue(encoded)) throw Error("encoding missing");
  await expect(decodeJournalValue({ ...encoded, journalEncoding: "unknown" } as never)).rejects.toMatchObject({ reason: "checksum" });
  await expect(decodeJournalValue({ ...encoded, payload: { ...encoded.payload, uncompressedBytes: 6_000_001 } })).rejects.toMatchObject({ reason: "checksum" });
  vi.stubGlobal("CompressionStream", undefined); expect(await encodeJournalValue(value)).toBe(value);
});

it("rechecks the writer fence after asynchronous lost-ack decoding before acknowledging", async () => {
  const f = await fixture(), gate = deferred();
  try {
    const rows = [f.row(1)]; await f.store.append("key", "owner", 0, rows);
    const wire = await request(f.db.transaction("rows").objectStore("rows").get(JSON.stringify(["key", "0000000000000001"])));
    expect(isEncodedJournalValue(wire)).toBe(true);
    const decode = compression.decompressCloudText; let entered = false;
    vi.spyOn(compression, "decompressCloudText").mockImplementation(async (...args: Parameters<typeof decode>) => {
      if (args[0].uncompressedSha256 === wire.payload.uncompressedSha256) { entered = true; await gate.promise; }
      return decode(...args);
    });
    const retry = f.store.append("key", "owner", 0, rows, [wire]);
    const rejected = expect(retry).rejects.toMatchObject({ reason: "conflict" });
    await vi.waitFor(() => expect(entered).toBe(true));
    const seed = { ...f.seed, profile: rows[0]!.profile };
    await f.store.bind("key", "replacement", await f.store.head("key"), seed, await sha256Utf8(JSON.stringify(seed)));
    gate.resolve(); await rejected;
    expect((await f.store.head("key"))!.owner).toBe("replacement");
    expect(JSON.stringify((await f.store.read("key"))!.snapshot.seed)).toBe(JSON.stringify(seed));
  } finally { gate.resolve(); f.db.close(); }
});

it("bounds recovery decompression scratch across a long tail while preserving row order", async () => {
  const f = await fixture();
  try {
    const rows = Array.from({ length: 64 }, (_, i) => f.row(i + 1));
    await f.store.append("key", "owner", 0, rows);
    const decode = compression.decompressCloudText; let active = 0, peak = 0;
    vi.spyOn(compression, "decompressCloudText").mockImplementation(async (...args: Parameters<typeof decode>) => {
      active++; peak = Math.max(peak, active);
      try { await new Promise(resolve => setTimeout(resolve, 0)); return await decode(...args); }
      finally { active--; }
    });
    const recovered = (await f.store.read("key"))!;
    expect(recovered.rows.map(row => row.version)).toEqual(rows.map(row => row.version));
    expect((await f.store.changes("key", 0))!.rows).toStrictEqual(recovered.rows);
    expect(peak, "At most one row owns stream/UTF-8 scratch during recovery").toBe(1);
    expect(active).toBe(0);
  } finally { f.db.close(); }
});

it.each([false, true].flatMap(writes => ["plain", "compressed", "mixed"].map(format => ({ writes, format }))))(
  "reads $format rows/seeds with compressed writes=$writes", async ({ writes, format }) => {
    rollout.enabled = format !== "plain";
    const f = await fixture();
    try {
      const rows = [f.row(1), f.row(2)];
      await f.store.append("key", "owner", 0, [rows[0]!]);
      if (format === "mixed") rollout.enabled = false;
      await f.store.append("key", "owner", 1, [rows[1]!]);
      rollout.enabled = writes;
      const read = (await f.store.read("key"))!;
      expect(JSON.stringify(read.snapshot.seed)).toBe(JSON.stringify(f.seed));
      for (let i = 0; i < rows.length; i++)
        expect(JSON.stringify(read.rows[i])).toBe(JSON.stringify({ ...rows[i], sha256: await sha256Utf8(JSON.stringify(rows[i])) }));
      expect((await f.store.changes("key", 0))!.rows).toStrictEqual(read.rows);
      expect(await f.store.append("key", "owner", 0, rows)).toBe(2); // Cross-build lost-ack retry.
    } finally { f.db.close(); }
  });

it.each([false, true])("enforces writes=%s at bind/append/compact even with compressed prepared values", async writesEnabled => {
  const f = await fixture();
  try {
    const rows = [f.row(1), f.row(2)];
    const packed = await Promise.all(rows.map(async row => {
      const value = await encodeJournalValue({ ...row, sha256: await sha256Utf8(JSON.stringify(row)) });
      if (!isEncodedJournalValue(value)) throw Error("Public test row must compress");
      return { ...value, version: row.version };
    }));
    const packedSeed = await encodeJournalValue(f.seed);
    expect(isEncodedJournalValue(packedSeed)).toBe(true);
    rememberEncodedJournalValues([rows[1]!], [packed[1]!]);
    rollout.enabled = writesEnabled;
    const compress = vi.spyOn(compression, "compressCloudText"), put = IDBObjectStore.prototype.put;
    const writes: { kind: string; value: unknown }[] = [];
    vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (this: IDBObjectStore, value, key) {
      if (this.name === "rows" || this.name === "snapshots")
        writes.push({ kind: this.name, value: structuredClone(this.name === "snapshots" ? value.seed : value) });
      return put.call(this, value, key!);
    });
    await f.store.append("key", "owner", 0, [rows[0]!], [packed[0]!]);
    await f.store.append("key", "owner", 1, [rows[1]!]); // Weak-key worker preparation.
    const hash = await sha256Utf8(JSON.stringify(f.seed));
    await f.store.compact("key", "owner", 2, f.seed, hash, packedSeed);
    await f.store.bind("other-key", "owner", null, f.seed, hash, packedSeed);
    const direct = await encodeJournalValue(f.seed);
    expect(isEncodedJournalValue(direct)).toBe(writesEnabled);
    expect(writes.map(write => write.kind)).toEqual(["rows", "rows", "snapshots", "snapshots"]);
    expect(writes.every(write => isEncodedJournalValue(write.value) === writesEnabled)).toBe(true);
    if (!writesEnabled) { expect(direct).toBe(f.seed); expect(compress).not.toHaveBeenCalled(); }
    expect(JSON.stringify((await f.store.read("key"))!.snapshot.seed)).toBe(JSON.stringify(f.seed));
  } finally { f.db.close(); }
});
