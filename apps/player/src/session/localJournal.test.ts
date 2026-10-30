import { IDBFactory, IDBObjectStore } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, gameEvidenceDelta, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, restoreGameEvidenceJournal } from "@gamify-surgery/game-domain";
import { IndexedDbJournalStorage, LocalJournalDrain, LOCAL_JOURNAL_QUEUE_LIMIT, MemoryJournalStorage, type JournalRow, type JournalSeed, type JournalStorage } from "./localJournal";
import { sha256Utf8 } from "./cloud/codecJson";
import { bindJournal, prepareJournal } from "./cloud/journalCodec";
import { CloudCodecWorker } from "./cloud/codecWorker";
import { codecTestCampaign } from "./cloud/codecTestSupport";
import { serializeGameState } from "@gamify-surgery/game-domain";
import { deferred } from "./cloud/syncTestSupport";
import { CloudCacheError } from "./cloud/codecCache";

const codec = new CloudCodecWorker(null);
function initial() {
  const state = createInitialGameState(undefined, { campaignId: "journal.test", campaignSeed: "journal", createdAtRealMs: 0 });
  const checkpoint = createGameEvidenceCheckpoint(state), campaign = codecTestCampaign(serializeGameState(state));
  const seed: JournalSeed = { checkpoint, campaign, source: null, confirmed: null, usageQuestions: [] };
  return { state, checkpoint, seed };
}
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("incremental local operational journal", () => {
  it("rejects a missing IDB request callback at the transaction deadline even after completion", async () => {
    const store = new IndexedDbJournalStorage("journal.missing-callback", new IDBFactory()), f = initial();
    await bindJournal(store, "preserved", "owner", f.seed, codec);
    const started = deferred();
    const request = vi.spyOn(IDBObjectStore.prototype, "getAllKeys").mockImplementation(() => {
      started.resolve(); return { onsuccess: null, onerror: null } as IDBRequest<IDBValidKey[]>;
    });
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const failed = expect(store.keys("preserved")).rejects.toMatchObject({ reason: "transaction" });
    await started.promise; await vi.advanceTimersByTimeAsync(10_000); await failed;
    request.mockRestore(); vi.useRealTimers();
    expect((await store.read("preserved"))!.snapshot.seed).toEqual(f.seed);
  });
  it("upgrades an existing version-one journal without rewriting its committed snapshot or rows", async () => {
    const factory = new IDBFactory(), f = initial(), key = "compatibility", hash = await sha256Utf8(JSON.stringify(f.seed));
    await new Promise<void>((resolve, reject) => {
      const request = factory.open("journal.v1", 1);
      request.onupgradeneeded = () => {
        for (const name of ["heads", "snapshots", "rows"]) request.result.createObjectStore(name);
        const tx = request.transaction!;
        tx.objectStore("heads").put({ schemaVersion: 1, key, owner: "old-writer", highWater: 0, snapshotThrough: 0, previousThrough: null }, key);
        tx.objectStore("snapshots").put({ key, through: 0, seed: f.seed, sha256: hash }, JSON.stringify([key, 0]));
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => { request.result.close(); resolve(); };
    });
    const store = new IndexedDbJournalStorage("journal.v1", factory);
    expect((await prepareJournal(store, key, codec, { local: true }))!.state).toEqual(f.state);
    expect((await store.head(key))!.owner).toBe("old-writer");
    expect(await store.prepared(key)).toBeNull();
  });
  it("restores recorded projections and every immutable evidence row without replaying commands", () => {
    const f = initial(); let current = f.checkpoint;
    const deltas: ReturnType<typeof gameEvidenceDelta>[] = [];
    for (let i = 0; i < 10; i++) {
      const result = applyGameEvidenceCommand(current, { type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `op.${i}` });
      deltas.push(gameEvidenceDelta(current, result.checkpoint)); current = result.checkpoint;
    }
    const restored = restoreGameEvidenceJournal(f.checkpoint, structuredClone(deltas));
    expect(restored).toEqual(current);
    expect(importGameEvidence(restored.snapshot, restored.evidence)).toEqual(importGameEvidence(current.snapshot, current.evidence));
    expect(deltas.flatMap(d => d.records)).toEqual(current.evidence.records.slice(f.checkpoint.evidence.records.length));
    expect(() => restoreGameEvidenceJournal(f.checkpoint, [deltas[1]!])).toThrow(/journal-sequence/);
  });
  it.each(["memory", "indexeddb"])("commits/reopens small rows with a completed high-water, then compacts atomically (%s)", async kind => {
    const store: JournalStorage = kind === "memory" ? new MemoryJournalStorage() : new IndexedDbJournalStorage("journal.integration", new IDBFactory());
    const f = initial(), head = await bindJournal(store, "campaign", "writer", f.seed, codec);
    const drain = new LocalJournalDrain(store, "campaign", "writer", head.highWater, error => { throw error; });
    let previous = f.checkpoint;
    for (let i = 0; i < 3; i++) {
      const result = applyGameEvidenceCommand(previous, { type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `append.${i}` });
      drain.accept({ delta: gameEvidenceDelta(previous, result.checkpoint), campaign: f.seed.campaign, usageQuestions: [] }); previous = result.checkpoint;
    }
    expect((await store.head("campaign"))!.highWater).toBe(head.highWater);
    expect(await drain.drain()).toBe(true);
    expect((await store.head("campaign"))!.highWater).toBe(head.highWater + 3);
    const reopened = await prepareJournal(store, "campaign", codec, { local: true, compact: true });
    expect(reopened!.seed!.checkpoint).toEqual(previous);
    expect(reopened!.state).toEqual(importGameEvidence(previous.snapshot, previous.evidence));
    expect((await store.read("campaign"))!.rows).toHaveLength(0);
    expect((await store.head("campaign"))!.previousThrough).toBe(head.highWater);
    expect(await prepareJournal(store, "campaign", codec, { local: true })).toMatchObject({ state: reopened!.state });
    drain.stop();
  });
  it("abrupt kill without an event loses only the uncommitted batch and never acknowledges memory", async () => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "kill", "owner", f.seed, codec);
    const drain = new LocalJournalDrain(store, "kill", "owner", head.highWater, () => {});
    const one = applyGameEvidenceCommand(f.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "committed" });
    drain.accept({ delta: gameEvidenceDelta(f.checkpoint, one.checkpoint), campaign: f.seed.campaign, usageQuestions: [] });
    expect(await drain.drain()).toBe(true);
    const two = applyGameEvidenceCommand(one.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "uncommitted" });
    drain.accept({ delta: gameEvidenceDelta(one.checkpoint, two.checkpoint), campaign: f.seed.campaign, usageQuestions: [] });
    expect(drain.dirty).toBe(true); drain.stop(); // No pagehide, visibilitychange or final flush.
    const restored = await prepareJournal(store, "kill", codec, { local: true });
    expect(restored!.state).toEqual(one.state);
    expect(restored!.seed!.checkpoint.evidence.records).toEqual(one.checkpoint.evidence.records);
  });
  it("ticks have a fixed one-second deadline; a meaningful action expedites the batch", async () => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "timers", "owner", f.seed, codec);
    vi.useFakeTimers();
    const drain = new LocalJournalDrain(store, "timers", "owner", head.highWater, () => {});
    const append = vi.spyOn(store, "append");
    const row = { delta: null, campaign: f.seed.campaign, usageQuestions: [] };
    drain.accept(row, true); await vi.advanceTimersByTimeAsync(700); drain.accept(row, true);
    await vi.advanceTimersByTimeAsync(300); expect(append).toHaveBeenCalledOnce(); await drain.drain(); expect(drain.committed).toBe(head.highWater + 2);
    drain.accept(row, true); await vi.advanceTimersByTimeAsync(100); drain.accept(row);
    await vi.advanceTimersByTimeAsync(250); expect(append).toHaveBeenCalledTimes(2); await drain.drain(); expect(drain.dirty).toBe(false); drain.stop();
  });
  it("has one active drain, bounded pending rows and a barrier captured before future work", async () => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "slow", "owner", f.seed, codec);
    const held = deferred(), append = store.append.bind(store); let calls = 0;
    vi.spyOn(store, "append").mockImplementation(async (...args) => { calls++; await held.promise; return append(...args); });
    const drain = new LocalJournalDrain(store, "slow", "owner", head.highWater, () => {});
    const row = { delta: null, campaign: f.seed.campaign, usageQuestions: [] };
    drain.accept(row); const barrier = drain.drain();
    for (let i = 1; i < LOCAL_JOURNAL_QUEUE_LIMIT; i++) drain.accept(row, true);
    expect(drain.canAccept).toBe(false); expect(() => drain.accept(row)).toThrow(); expect(calls).toBe(1);
    held.resolve(); expect(await barrier).toBe(true); expect(drain.committed).toBe(head.highWater + 1);
    expect(await drain.drain()).toBe(true); expect(calls).toBe(2); expect(drain.queued).toBe(0); drain.stop();
  });
  it.each(["before-commit", "after-commit"] as const)("retries an uncertain local acknowledgement idempotently (%s)", async fault => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "fault", "owner", f.seed, codec);
    const failed = vi.fn(), drain = new LocalJournalDrain(store, "fault", "owner", head.highWater, failed);
    const result = applyGameEvidenceCommand(f.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "once" });
    drain.accept({ delta: gameEvidenceDelta(f.checkpoint, result.checkpoint), campaign: f.seed.campaign, usageQuestions: [] });
    store.fault = fault; expect(await drain.drain()).toBe(false); expect(failed).toHaveBeenCalledOnce(); expect(drain.dirty).toBe(true);
    expect(await drain.drain()).toBe(true); expect((await store.read("fault"))!.rows).toHaveLength(1);
    expect((await prepareJournal(store, "fault", codec, { local: true }))!.state).toEqual(result.state); drain.stop();
  });
  it("fences a previous document after a durable writer rotation and retries a completed bind safely", async () => {
    const f = initial(), store = new MemoryJournalStorage(), hash = await sha256Utf8(JSON.stringify(f.seed));
    const first = await store.bind("shared", "first", null, f.seed, hash);
    const second = await store.bind("shared", "second", first, f.seed, hash);
    expect(await store.bind("shared", "second", first, f.seed, hash)).toEqual(second);
    const row: JournalRow = { version: first.highWater + 1, delta: null, campaign: f.seed.campaign, usageQuestions: [] };
    await expect(store.append("shared", "first", first.highWater, [row])).rejects.toMatchObject({ reason: "conflict" });
  });
  it("rejects corrupt snapshots instead of returning an older state as saved", async () => {
    const f = initial(), store = new MemoryJournalStorage(); await bindJournal(store, "corrupt", "owner", f.seed, codec);
    store.data.get("corrupt")!.snapshots.get(0)!.sha256 = "0".repeat(64);
    await expect(prepareJournal(store, "corrupt", codec, { local: true })).rejects.toMatchObject({ reason: "checksum" });
  });
  it.each(["before-commit", "after-commit"] as const)("keeps recoverable evidence across an interrupted compaction (%s)", async fault => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "compact", "owner", f.seed, codec);
    const drain = new LocalJournalDrain(store, "compact", "owner", head.highWater, () => {});
    const result = applyGameEvidenceCommand(f.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "compact.once" });
    drain.accept({ delta: gameEvidenceDelta(f.checkpoint, result.checkpoint), campaign: f.seed.campaign, usageQuestions: [] });
    expect(await drain.drain()).toBe(true); store.fault = fault;
    await expect(prepareJournal(store, "compact", codec, { compact: true })).rejects.toMatchObject({ code: "storage" });
    expect((await prepareJournal(store, "compact", codec, { local: true }))!.state).toEqual(result.state);
    expect(await prepareJournal(store, "compact", codec, { compact: true })).toBeTruthy();
    expect(store.data.get("compact")!.snapshots.size).toBe(2); drain.stop();
  });
  it("retries an identical small batch after quota reclamation and never evicts campaign/journal bytes", async () => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "quota", "owner", f.seed, codec);
    const append = vi.spyOn(store, "append").mockRejectedValueOnce(new CloudCacheError("quota"));
    const failed = vi.fn(), drain = new LocalJournalDrain(store, "quota", "owner", head.highWater, failed);
    drain.accept({ delta: null, campaign: f.seed.campaign, usageQuestions: [] });
    expect(await drain.drain()).toBe(true); expect(append).toHaveBeenCalledTimes(2);
    expect(append.mock.calls[0]).toEqual(append.mock.calls[1]); expect(failed).not.toHaveBeenCalled();
    expect(store.data.get("quota")!.snapshots.get(0)!.seed.checkpoint).toEqual(f.checkpoint); drain.stop();
  });
  it("refuses to bind an older snapshot over a newer committed journal", async () => {
    const f = initial(), store = new MemoryJournalStorage(), head = await bindJournal(store, "race", "first", f.seed, codec);
    const drain = new LocalJournalDrain(store, "race", "first", head.highWater, () => {});
    const newer = applyGameEvidenceCommand(f.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "newer" });
    drain.accept({ delta: gameEvidenceDelta(f.checkpoint, newer.checkpoint), campaign: f.seed.campaign, usageQuestions: [] }); await drain.drain();
    await expect(bindJournal(store, "race", "late-document", f.seed, codec)).rejects.toMatchObject({ reason: "conflict" });
    expect((await prepareJournal(store, "race", codec, { local: true }))!.state).toEqual(newer.state); drain.stop();
  });
  it("rolls back an interrupted native IDB compaction transaction with its old snapshot and complete journal intact", async () => {
    const f = initial(), store = new IndexedDbJournalStorage("native.abort", new IDBFactory());
    const head = await bindJournal(store, "native", "owner", f.seed, codec), drain = new LocalJournalDrain(store, "native", "owner", head.highWater, () => {});
    const changed = applyGameEvidenceCommand(f.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "before.abort" });
    drain.accept({ delta: gameEvidenceDelta(f.checkpoint, changed.checkpoint), campaign: f.seed.campaign, usageQuestions: [] }); await drain.drain();
    const before = await store.read("native"), put = IDBObjectStore.prototype.put; let abort = true;
    const intercept = vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (this: IDBObjectStore, ...args) {
      const request = put.apply(this, args);
      if (this.name === "snapshots" && abort) { abort = false; request.addEventListener("success", () => this.transaction.abort()); }
      return request;
    });
    try { await expect(prepareJournal(store, "native", codec, { compact: true })).rejects.toMatchObject({ code: "storage" }); }
    finally { intercept.mockRestore(); }
    expect(await store.read("native")).toEqual(before);
    expect((await prepareJournal(store, "native", codec, { local: true }))!.state).toEqual(changed.state); drain.stop();
  });
});
