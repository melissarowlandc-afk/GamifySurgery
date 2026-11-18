import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, gameEvidenceDelta,
  importGameEvidence, restoreGameEvidenceJournal, serializeGameState, type GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { IndexedDbJournalStorage, LocalJournalDrain, LOCAL_JOURNAL_QUEUE_LIMIT, MemoryJournalStorage, type JournalSeed } from "./localJournal";
import { IDBFactory } from "fake-indexeddb";
import { MAX_CLOCK_JOURNAL_COMMANDS } from "./clockJournalDelta";
import { bindJournal } from "./cloud/journalCodec";
import { CloudCodecWorker } from "./cloud/codecWorker";
import { codecTestCampaign } from "./cloud/codecTestSupport";
import { deferred } from "./cloud/syncTestSupport";

const codec = new CloudCodecWorker(null);
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

async function fixture(kind = "memory") {
  const state = createInitialGameState(undefined, { campaignId: "public.clock-batch", campaignSeed: "clock-batch", createdAtRealMs: 0 });
  state.paused = false; state.facilityLevel = 1; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER; state.serviceAppointmentsEnabled = false;
  const checkpoint = createGameEvidenceCheckpoint(state), campaign = codecTestCampaign(serializeGameState(state));
  const seed: JournalSeed = { checkpoint, campaign, source: null, confirmed: null, usageQuestions: [] };
  const store = kind === "indexeddb" ? new IndexedDbJournalStorage("public.clock-batch", new IDBFactory()) : new MemoryJournalStorage();
  const head = await bindJournal(store, "clock", "owner", seed, codec);
  const drain = new LocalJournalDrain(store, "clock", "owner", head.highWater, () => {});
  let current = checkpoint;
  const row = () => {
    const result = applyGameEvidenceCommand(current, { type: "ADVANCE_TICK", operationId: `clock.${current.snapshot.head.sequence}`, advancedAtRealMs: current.snapshot.head.sequence * 1_000 });
    const delta = gameEvidenceDelta(current, result.checkpoint); current = result.checkpoint;
    return { delta, campaign, usageQuestions: [], writerGeneration: "1" };
  };
  return { seed, store, drain, head, row, current: () => current };
}

it.each(["memory", "indexeddb"])("coalesces real clock transitions in the released row format, keeping state, learning and all operation receipts byte-exact (%s)", async kind => {
  const f = await fixture(kind), append = vi.spyOn(f.store, "append");
  try {
    f.drain.acceptAdmitted(f.row(), true, true); f.drain.acceptAdmitted(f.row(), true, true);
    expect(f.drain.highWater).toBe(f.head.highWater + 1); expect(f.drain.queued).toBe(2);
    expect(f.drain.admissionSerial).toBe(2); expect(await f.drain.drain()).toBe(true);
    expect(append).toHaveBeenCalledTimes(1); expect(append.mock.calls[0]![3]).toHaveLength(1);
    const rows = (await f.store.read("clock"))!.rows;
    expect(Object.keys(rows[0]!.delta!).sort()).toEqual(["fromSequence", "fromRecord", "head", "patches", "records"].sort());
    // This is the unchanged release-41/42 recovery implementation, not a new reader.
    const restored = restoreGameEvidenceJournal(f.seed.checkpoint, rows.map(row => row.delta!));
    expect(JSON.stringify(restored)).toBe(JSON.stringify(f.current()));
    expect(JSON.stringify(importGameEvidence(restored.snapshot, restored.evidence))).toBe(JSON.stringify(importGameEvidence(f.current().snapshot, f.current().evidence)));
    expect(f.drain.queued).toBe(0); expect(f.drain.dirty).toBe(false);
  } finally { f.drain.stop(); }
});

it("seals captured durability prefixes and never mutates a row already being hashed/written", async () => {
  const f = await fixture(), entered = deferred(), gate = deferred(), append = f.store.append.bind(f.store);
  const held = vi.spyOn(f.store, "append").mockImplementationOnce(async (...args) => { entered.resolve(); await gate.promise; return append(...args); });
  try {
    f.drain.acceptAdmitted(f.row(), true, true);
    const first = f.drain.drain(); await entered.promise;
    const captured = JSON.stringify(held.mock.calls[0]![3]);
    f.drain.acceptAdmitted(f.row(), true, true); f.drain.acceptAdmitted(f.row(), true, true);
    expect(JSON.stringify(held.mock.calls[0]![3])).toBe(captured);
    gate.resolve(); expect(await first).toBe(true);
    expect(f.drain.committed).toBe(f.head.highWater + 1); expect(f.drain.queued).toBe(2);
    expect(await f.drain.drain()).toBe(true);
    const restored = restoreGameEvidenceJournal(f.seed.checkpoint, (await f.store.read("clock"))!.rows.map(row => row.delta!));
    expect(JSON.stringify(restored)).toBe(JSON.stringify(f.current()));
  } finally { gate.resolve(); f.drain.stop(); }
});

it("keeps player, metadata, writer and explicit-tick boundaries out of clock coalescing", async () => {
  const f = await fixture();
  try {
    f.drain.acceptAdmitted(f.row(), true, true);
    f.drain.acceptAdmitted({ delta: null, campaign: f.seed.campaign, usageQuestions: [], writerGeneration: "1" });
    f.drain.acceptAdmitted(f.row(), true, true);
    f.drain.acceptAdmitted({ ...f.row(), writerGeneration: "2" }, true, true);
    f.drain.acceptAdmitted(f.row(), true); // An explicit ADVANCE_TICK keeps its own row.
    expect(f.drain.highWater).toBe(f.head.highWater + 5); expect(await f.drain.drain()).toBe(true);
    const rows = (await f.store.read("clock"))!.rows;
    expect(rows).toHaveLength(5);
    const restored = restoreGameEvidenceJournal(f.seed.checkpoint, rows.flatMap(row => row.delta ? [row.delta] : []));
    expect(JSON.stringify(restored)).toBe(JSON.stringify(f.current()));
  } finally { f.drain.stop(); }
});

it("retains the 128-command backlog fence even though consecutive clock commands share a row", async () => {
  const f = await fixture();
  try {
    for (let i = 0; i < LOCAL_JOURNAL_QUEUE_LIMIT; i++) {
      const delta: GameEvidenceDelta = { fromSequence: i, fromRecord: 0, head: { sequence: i + 1, transitionId: `tick.${i}` }, patches: [], records: [] };
      f.drain.acceptAdmitted({ delta, campaign: f.seed.campaign, usageQuestions: [] }, true, true);
    }
    expect(f.drain.queued).toBe(128); expect(f.drain.highWater).toBe(f.head.highWater + Math.ceil(128 / MAX_CLOCK_JOURNAL_COMMANDS));
    expect(f.drain.canAccept).toBe(false);
    expect(() => f.drain.acceptAdmitted({ delta: null, campaign: f.seed.campaign, usageQuestions: [] })).toThrow();
    expect(await f.drain.drain()).toBe(true); expect(f.drain.canAccept).toBe(true); expect(f.drain.queued).toBe(0);
  } finally { f.drain.stop(); }
});

it("uses a fixed two-pulse clock deadline while player work retains the earlier 250 ms deadline", async () => {
  const f = await fixture(), append = vi.spyOn(f.store, "append");
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
  try {
    f.drain.acceptAdmitted(f.row(), true, true);
    await vi.advanceTimersByTimeAsync(1_000); expect(append).not.toHaveBeenCalled();
    f.drain.acceptAdmitted(f.row(), true, true);
    await vi.advanceTimersByTimeAsync(999); expect(append).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1); expect(await f.drain.drain()).toBe(true); expect(append).toHaveBeenCalledTimes(1);
    f.drain.acceptAdmitted(f.row(), true, true);
    f.drain.acceptAdmitted({ delta: null, campaign: f.seed.campaign, usageQuestions: [] });
    await vi.advanceTimersByTimeAsync(249); expect(append).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); expect(await f.drain.drain()).toBe(true); expect(append).toHaveBeenCalledTimes(2);
  } finally { f.drain.stop(); }
});
