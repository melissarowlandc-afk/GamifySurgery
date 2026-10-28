import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlaytimeTracker, type CasualModeMemory } from "./playtimeTracker";
import { UsageOutbox, type UsageStorage } from "./usageOutbox";
import { USAGE_IDLE_MS, USAGE_MAX_AGE_MS, USAGE_NOTICE_VERSION, USAGE_QUEUE_BYTES, type UsageAccess, type UsageReceipt, type UsageTransport } from "./usageTypes";

export function memoryUsageStorage(): UsageStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return { values, getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
}
export function usageFixture(options: { storage?: UsageStorage; account?: string; start?: number; accepted?: boolean; modeMemory?: CasualModeMemory } = {}) {
  let mono = 0, wall = options.start ?? Date.UTC(2026, 9, 13, 12), sequence = 0;
  const storage = options.storage ?? memoryUsageStorage();
  const transport: UsageTransport = {
    access: vi.fn(async () => ({ admitted: true, notice_accepted: options.accepted ?? true, deletion_requested: false })),
    acceptNotice: vi.fn(async () => undefined), requestDeletion: vi.fn(async () => undefined),
    ingest: vi.fn(async (receipts: readonly UsageReceipt[]) => receipts.map((r) => r.receipt_id)),
  };
  const clock = { monotonic: () => mono, wall: () => Math.floor(wall) };
  const uuid = () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`;
  const outbox = new UsageOutbox(options.account ?? "account-a", storage, clock.wall);
  const tracker = new PlaytimeTracker(outbox, transport, clock, uuid, options.modeMemory);
  const advance = (ms: number) => { mono += ms; wall += ms; };
  async function ready() {
    await tracker.refreshAccess(); tracker.setLease(true); tracker.setVisible(true);
    tracker.setGame({ campaignId: "campaign-a", paused: false, finishReportOpen: false }); tracker.activity();
  }
  const observe = (ms: number) => { for (let remaining = ms; remaining > 0;) { const part = Math.min(1_000, remaining); advance(part); tracker.tick(); remaining -= part; } };
  return { tracker, outbox, transport, clock, storage, uuid, advance, ready, observe, jumpWall: (ms: number) => { wall += ms; } };
}
const activeMs = (receipts: readonly UsageReceipt[]) => receipts.reduce((sum, r) => sum + (r.kind === "playtime" ? r.active_ms : 0), 0);

describe("account access recovery", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  const admitted = (casual: boolean): UsageAccess => ({ admitted: true, notice_accepted: true, deletion_requested: false, casual });

  it("recovers an unknown mode without an online event, using one capped backoff timer until success", async () => {
    const f = usageFixture();
    vi.mocked(f.transport.access).mockRejectedValue(new Error("temporarily unavailable"));
    await f.tracker.refreshAccess();
    expect(f.tracker.casualMode()).toBeNull(); expect(f.tracker.canRecordQuestions()).toBe(false);
    expect(f.transport.access).toHaveBeenCalledTimes(1);
    for (const [index, delay] of [2_000, 5_000, 15_000, 30_000].entries()) {
      expect(vi.getTimerCount()).toBe(1);
      await vi.advanceTimersByTimeAsync(delay - 1);
      expect(f.transport.access).toHaveBeenCalledTimes(index + 1);
      await vi.advanceTimersByTimeAsync(1);
      expect(f.transport.access).toHaveBeenCalledTimes(index + 2);
    }
    vi.mocked(f.transport.access).mockResolvedValue(admitted(true));
    await vi.advanceTimersByTimeAsync(29_999);
    expect(f.transport.access).toHaveBeenCalledTimes(5);
    await vi.advanceTimersByTimeAsync(1);
    expect(f.transport.access).toHaveBeenCalledTimes(6);
    expect(f.tracker.casualMode()).toBe(true); expect(f.tracker.canRecordQuestions()).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(f.transport.access).toHaveBeenCalledTimes(6);
    f.tracker.stop();
  });

  it("deduplicates in-flight reads and replaces a pending retry with a manual refresh", async () => {
    const f = usageFixture();
    let reject!: (error: Error) => void, resolve!: (value: UsageAccess) => void;
    vi.mocked(f.transport.access).mockReturnValueOnce(new Promise((_, fail) => { reject = fail; }))
      .mockReturnValueOnce(new Promise(done => { resolve = done; }));
    const first = f.tracker.refreshAccess();
    expect(f.tracker.refreshAccess()).toBe(first);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(f.transport.access).toHaveBeenCalledTimes(1); expect(vi.getTimerCount()).toBe(0);
    reject(new Error("offline")); await first;
    expect(vi.getTimerCount()).toBe(1);
    const second = f.tracker.refreshAccess();
    expect(f.tracker.refreshAccess()).toBe(second);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(f.transport.access).toHaveBeenCalledTimes(2);
    resolve(admitted(false)); await second;
    expect(f.tracker.casualMode()).toBe(false); expect(vi.getTimerCount()).toBe(0);
    f.tracker.stop();
  });

  it("cancels retry on stop and ignores a later access success or failure", async () => {
    const f = usageFixture();
    vi.mocked(f.transport.access).mockRejectedValue(new Error("offline"));
    await f.tracker.refreshAccess(); expect(vi.getTimerCount()).toBe(1);
    f.tracker.stop(); expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(60_000); await f.tracker.refreshAccess();
    expect(f.transport.access).toHaveBeenCalledTimes(1);

    for (const succeeds of [false, true]) {
      const remember = vi.fn(), pending = usageFixture({ modeMemory: { initial: null, remember } });
      let finish!: () => void;
      vi.mocked(pending.transport.access).mockReturnValueOnce(new Promise((resolve, reject) => {
        finish = () => succeeds ? resolve(admitted(true)) : reject(new Error("offline"));
      }));
      const request = pending.tracker.refreshAccess(); await Promise.resolve();
      pending.tracker.stop(); finish(); await request;
      expect(pending.tracker.casualMode()).toBeNull(); expect(remember).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    }
  });

  it("does not start transport work after an immediate cleanup", async () => {
    const f = usageFixture(); const request = f.tracker.refreshAccess(); f.tracker.stop(); await request;
    expect(f.transport.access).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });

  it.each([false, true])("uses remembered %s only for presentation and replaces it after fresh server access", async (initial) => {
    const remember = vi.fn(), f = usageFixture({ modeMemory: { initial, remember } });
    expect(f.tracker.casualMode()).toBe(initial); expect(f.tracker.createQuestionReceipt()).toBeNull();
    vi.mocked(f.transport.access).mockRejectedValue(new Error("offline"));
    await f.tracker.refreshAccess(); await vi.advanceTimersByTimeAsync(2_000);
    expect(f.transport.access).toHaveBeenCalledTimes(2);
    expect(f.tracker.casualMode()).toBe(initial); expect(remember).not.toHaveBeenCalled();
    expect(f.tracker.canRecordQuestions()).toBe(false); expect(f.transport.ingest).not.toHaveBeenCalled();
    vi.mocked(f.transport.access).mockResolvedValue(admitted(!initial));
    await f.tracker.refreshAccess();
    expect(f.tracker.casualMode()).toBe(!initial); expect(remember).toHaveBeenLastCalledWith(!initial);
    expect(f.tracker.canRecordQuestions()).toBe(true); expect(vi.getTimerCount()).toBe(0);
    vi.mocked(f.transport.access).mockRejectedValue(new Error("later outage"));
    await f.tracker.refreshAccess(); await vi.advanceTimersByTimeAsync(60_000);
    expect(f.transport.access).toHaveBeenCalledTimes(4);
    expect(f.tracker.casualMode()).toBe(!initial); expect(remember).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    f.tracker.stop();
  });

  it("clears remembered mode on deletion without letting a late access result restore it", async () => {
    const remember = vi.fn(), storage = memoryUsageStorage();
    const f = usageFixture({ storage, modeMemory: { initial: true, remember } });
    let resolve!: (value: UsageAccess) => void;
    vi.mocked(f.transport.access).mockReturnValueOnce(new Promise(done => { resolve = done; }));
    const request = f.tracker.refreshAccess(); await Promise.resolve();
    await f.tracker.requestDeletion();
    expect(remember).toHaveBeenLastCalledWith(null);
    resolve(admitted(true)); await request;
    expect(remember.mock.calls.every(([value]) => value === null)).toBe(true);
    expect(f.tracker.canRecordQuestions()).toBe(false); expect(vi.getTimerCount()).toBe(0);
    const reloaded = usageFixture({ storage, modeMemory: { initial: true, remember } });
    expect(reloaded.tracker.casualMode()).toBeNull(); expect(remember).toHaveBeenLastCalledWith(null);
    f.tracker.stop(); reloaded.tracker.stop();
  });
});

describe("shared active playtime accounting", () => {
  it("records no time/count before the full notice and fresh server admission", async () => {
    const f = usageFixture({ accepted: false }); await f.ready(); f.observe(61_000);
    expect(f.transport.ingest).not.toHaveBeenCalled(); expect(f.tracker.createQuestionReceipt()).toBeNull();
    expect(f.tracker.status().state).toBe("requires-notice");
    vi.mocked(f.transport.access).mockResolvedValue({ admitted: true, notice_accepted: true, deletion_requested: false });
    await f.tracker.acceptNotice(USAGE_NOTICE_VERSION); f.tracker.activity(); f.advance(1_000); await f.tracker.flush();
    expect(f.transport.acceptNotice).toHaveBeenCalledWith(USAGE_NOTICE_VERSION);
    expect(activeMs(vi.mocked(f.transport.ingest).mock.calls[0]![0])).toBe(1_000);
  });

  it("accounts visibility and pause at their boundaries; focus and simulation speed are absent from the metric", async () => {
    const f = usageFixture(); await f.ready();
    f.advance(1_000); f.tracker.setVisible(false); await f.tracker.flush();
    expect(activeMs(vi.mocked(f.transport.ingest).mock.calls[0]![0])).toBe(1_000);
    f.observe(10_000); f.tracker.setVisible(true); f.tracker.activity();
    f.advance(500); f.tracker.setGame({ campaignId: "campaign-a", paused: true, finishReportOpen: false }); await f.tracker.flush();
    f.observe(10_000); await f.tracker.flush();
    expect(vi.mocked(f.transport.ingest).mock.calls.reduce((sum, c) => sum + activeMs(c[0]), 0)).toBe(1_500);
    // Scored questions remain countable during a manual pause.
    const question = f.tracker.createQuestionReceipt()!; f.tracker.commitQuestions([question]); await f.tracker.flush();
    expect(vi.mocked(f.transport.ingest).mock.calls.at(-1)![0]).toEqual([question]);
  });

  it("stops exactly at five idle minutes; ticks never reset activity; a new input restarts accounting", async () => {
    const f = usageFixture(); await f.ready();
    vi.mocked(f.transport.ingest).mockRejectedValue(new Error("offline"));
    f.observe(USAGE_IDLE_MS + 12_000); await f.tracker.flush();
    expect(activeMs(f.outbox.batch())).toBe(USAGE_IDLE_MS);
    f.tracker.activity(); f.advance(1_000); await f.tracker.flush();
    expect(activeMs(f.outbox.batch())).toBe(USAGE_IDLE_MS + 1_000);
  });

  it("does not infer sleep gaps or a wall-clock jump as play", async () => {
    const f = usageFixture(); await f.ready(); f.advance(1_000); f.tracker.tick();
    f.advance(60_000); f.tracker.tick(); await f.tracker.flush();
    expect(activeMs(vi.mocked(f.transport.ingest).mock.calls[0]![0])).toBe(1_000);
    f.advance(1_000); await f.tracker.flush();
    expect(activeMs(vi.mocked(f.transport.ingest).mock.calls[1]![0])).toBe(1_000);
    f.jumpWall(3_600_000); f.advance(1_000); await f.tracker.flush();
    expect(f.transport.ingest).toHaveBeenCalledTimes(2);
  });

  it("excludes entry, an unavailable counting lease and the finish report", async () => {
    const f = usageFixture(); await f.ready();
    f.tracker.setLease(false); f.observe(5_000);
    f.tracker.setLease(true); f.tracker.setGame({ campaignId: null, paused: false, finishReportOpen: false }); f.observe(5_000);
    f.tracker.setGame({ campaignId: "campaign-a", paused: false, finishReportOpen: true }); f.observe(5_000); await f.tracker.flush();
    expect(f.transport.ingest).not.toHaveBeenCalled();
  });

  it("persists <=30 second intervals and batches at 60 seconds", async () => {
    const f = usageFixture(); await f.ready(); f.observe(59_000);
    expect(f.transport.ingest).not.toHaveBeenCalled(); expect(f.outbox.batch()).toHaveLength(1);
    f.observe(1_000); await f.tracker.flush();
    const batch = vi.mocked(f.transport.ingest).mock.calls[0]![0];
    expect(batch).toHaveLength(2); expect(activeMs(batch)).toBe(60_000);
    expect(batch.every((r) => r.kind === "playtime" && r.active_ms <= 30_000)).toBe(true);
    expect(f.outbox.batch()).toEqual([]);
  });

  it("carries fractional monotonic time without fragmenting intervals on Date.now millisecond jitter", async () => {
    const f = usageFixture(); await f.ready();
    for (let sample = 0; sample < 120; sample += 1) { f.advance(sample % 2 ? 500.3 : 499.7); f.tracker.tick(); }
    await f.tracker.flush();
    const batch = vi.mocked(f.transport.ingest).mock.calls[0]![0];
    expect(batch).toHaveLength(2); expect(activeMs(batch)).toBe(60_000);
  });

  it("splits UTC midnight and creates a new opaque session after a campaign switch", async () => {
    const f = usageFixture({ start: Date.UTC(2026, 9, 13, 23, 59, 59) }); await f.ready();
    f.observe(2_000); await f.tracker.flush();
    const first = vi.mocked(f.transport.ingest).mock.calls[0]![0];
    expect(first).toHaveLength(2); expect(first[0]).toMatchObject({ ended_at: "2026-10-14T00:00:00.000Z", active_ms: 1_000 });
    expect(first[1]).toMatchObject({ started_at: "2026-10-14T00:00:00.000Z", active_ms: 1_000 });
    f.tracker.setGame({ campaignId: "campaign-b", paused: false, finishReportOpen: false }); f.advance(1_000); await f.tracker.flush();
    expect((vi.mocked(f.transport.ingest).mock.calls[1]![0][0] as { session_id: string }).session_id).not.toBe((first[0] as { session_id: string }).session_id);
  });

  it("retains immutable offline IDs across reload/lost acknowledgement and never sends another account's queue", async () => {
    const storage = memoryUsageStorage(); const f = usageFixture({ storage }); await f.ready();
    vi.mocked(f.transport.ingest).mockRejectedValue(new Error("ack lost")); f.observe(2_000); await f.tracker.flush();
    const original = f.outbox.batch(); expect(f.tracker.status().state).toBe("unavailable");
    const reloaded = usageFixture({ storage }); await reloaded.ready(); await reloaded.tracker.flush();
    expect(vi.mocked(reloaded.transport.ingest).mock.calls[0]![0]).toEqual(original);
    const other = usageFixture({ storage, account: "account-b" }); await other.ready(); await other.tracker.flush();
    expect(other.transport.ingest).not.toHaveBeenCalled();
  });

  it("flushes pagehide with keepalive, preserving the durable queue when the final request fails", async () => {
    const f = usageFixture(); await f.ready(); vi.mocked(f.transport.ingest).mockRejectedValue(new Error("page left"));
    f.advance(2_000); f.tracker.pagehide(); await f.tracker.flush();
    expect(f.transport.ingest).toHaveBeenCalledWith(expect.any(Array), true);
    expect(activeMs(f.outbox.batch())).toBe(2_000);
    f.advance(1_000); f.tracker.tick(); expect(activeMs(f.outbox.batch())).toBe(2_000);
  });

  it("serializes a pending batch and keeps new contributions until their own acknowledgement", async () => {
    const f = usageFixture(); await f.ready();
    let acknowledge!: (ids: readonly string[]) => void;
    vi.mocked(f.transport.ingest).mockImplementationOnce(() => new Promise((resolve) => { acknowledge = resolve; }));
    const first = f.tracker.createQuestionReceipt()!; f.tracker.commitQuestions([first]);
    const inFlight = f.tracker.flush(); await Promise.resolve();
    const second = f.tracker.createQuestionReceipt()!; f.tracker.commitQuestions([second]);
    void f.tracker.flush(); expect(f.transport.ingest).toHaveBeenCalledTimes(1);
    acknowledge([first.receipt_id, "unsent"]); await inFlight;
    expect(f.outbox.batch()).toEqual([second]);
    await f.tracker.flush(); expect(f.outbox.batch()).toEqual([]);
  });

  it("freezes immediately on deletion, erases only this account's queue and rejects a late ingest acknowledgement", async () => {
    const storage = memoryUsageStorage(); const f = usageFixture({ storage }); await f.ready();
    const other = usageFixture({ storage, account: "account-b" }); await other.ready();
    other.tracker.commitQuestions([other.tracker.createQuestionReceipt()!]);
    let ack!: (ids: readonly string[]) => void;
    vi.mocked(f.transport.ingest).mockImplementation(() => new Promise((resolve) => { ack = resolve; }));
    const question = f.tracker.createQuestionReceipt()!; f.tracker.commitQuestions([question]);
    const upload = f.tracker.flush(); await Promise.resolve();
    await f.tracker.requestDeletion(); ack([question.receipt_id]); await upload;
    expect(f.tracker.createQuestionReceipt()).toBeNull(); expect(f.outbox.batch()).toEqual([]);
    expect(other.outbox.batch()).toHaveLength(1); expect(f.tracker.status().state).toBe("deleted");
  });

  it("does not discard queued estimates when access fails, but stops ingestion after fresh revocation", async () => {
    const f = usageFixture(); await f.ready(); f.tracker.commitQuestions([f.tracker.createQuestionReceipt()!]);
    vi.mocked(f.transport.access).mockRejectedValueOnce(new Error("offline")); await f.tracker.refreshAccess();
    expect(f.outbox.batch()).toHaveLength(1);
    vi.mocked(f.transport.access).mockResolvedValueOnce({ admitted: false, notice_accepted: false, deletion_requested: false });
    await f.tracker.refreshAccess(); await f.tracker.flush(); expect(f.transport.ingest).not.toHaveBeenCalled();
    expect(f.tracker.createQuestionReceipt()).toBeNull();
  });

  it("keeps a failed deletion request stopped across reload and allows a retry", async () => {
    const storage = memoryUsageStorage(); const f = usageFixture({ storage }); await f.ready();
    f.tracker.commitQuestions([f.tracker.createQuestionReceipt()!]);
    vi.mocked(f.transport.requestDeletion).mockRejectedValueOnce(new Error("offline"));
    await expect(f.tracker.requestDeletion()).rejects.toThrow("offline");
    await f.tracker.refreshAccess(); expect(f.tracker.createQuestionReceipt()).toBeNull(); expect(f.outbox.batch()).toEqual([]);
    const reloaded = usageFixture({ storage }); await reloaded.ready();
    expect(reloaded.tracker.createQuestionReceipt()).toBeNull(); expect(reloaded.tracker.status().state).toBe("blocked");
    await reloaded.tracker.requestDeletion(); expect(reloaded.tracker.status().state).toBe("deleted");
  });
});

describe("bounded usage outbox", () => {
  it("caps bytes and age, deduplicates IDs, limits batches and reports dropped estimates", () => {
    const f = usageFixture();
    const receipts = Array.from({ length: 6_000 }, () => ({ receipt_id: f.uuid(), kind: "question" as const, occurred_at: new Date(f.clock.wall()).toISOString() }));
    f.outbox.append([...receipts, receipts[0]!]);
    expect(f.outbox.batch()).toHaveLength(100); expect(f.outbox.status().droppedReceipts).toBeGreaterThan(0);
    expect(new TextEncoder().encode((f.storage as ReturnType<typeof memoryUsageStorage>).values.get(f.outbox.key)!).length).toBeLessThanOrEqual(USAGE_QUEUE_BYTES);
    f.advance(USAGE_MAX_AGE_MS + 1); expect(f.outbox.batch()).toEqual([]);
  });

  it("keeps bounded in-memory estimates and reports blocked storage without touching a campaign", () => {
    const f = usageFixture({ storage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => undefined } });
    const q = { receipt_id: f.uuid(), kind: "question" as const, occurred_at: new Date(f.clock.wall()).toISOString() };
    expect(f.outbox.append([q])).toBe(false); expect(f.outbox.batch()).toEqual([q]);
    expect(f.outbox.status().storageAvailable).toBe(false);
  });
});
