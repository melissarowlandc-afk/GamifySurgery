import { afterEach, describe, expect, it, vi } from "vitest";
import { bindBrowserUsage } from "./browserUsage";
import { PlaytimeTracker } from "./playtimeTracker";
import { UsageOutbox } from "./usageOutbox";
import type { UsageAccess, UsageReceipt, UsageTransport } from "./usageTypes";

afterEach(() => vi.useRealTimers());

function browserFixture(locks?: LockManager) {
  let now = Date.UTC(2026, 9, 13, 12), mono = 0, sequence = 0;
  const values = new Map<string, string>();
  const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); }, removeItem: (k: string) => { values.delete(k); } };
  const transport: UsageTransport = { access: vi.fn(async () => ({ admitted: true, notice_accepted: true, deletion_requested: false })),
    acceptNotice: async () => undefined, requestDeletion: async () => undefined,
    ingest: vi.fn(async (rs: readonly UsageReceipt[]) => rs.map((r) => r.receipt_id)) };
  const tracker = new PlaytimeTracker(new UsageOutbox("a", storage, () => now), transport,
    { wall: () => now, monotonic: () => mono }, () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`);
  const listeners = new Map<string, Set<(e: Event) => void>>();
  const host = { addEventListener: (type: string, fn: (e: Event) => void) => { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type)!.add(fn); },
    removeEventListener: (type: string, fn: (e: Event) => void) => { listeners.get(type)?.delete(fn); } };
  const doc = { ...host, visibilityState: "visible" };
  let timer!: () => void;
  const browser = { ...host, navigator: { locks }, setInterval: (fn: () => void) => { timer = fn; return 1; }, clearInterval: vi.fn() };
  const emit = (type: string, fields = {}) => { for (const fn of listeners.get(type) ?? []) fn({ type, isTrusted: true, ...fields } as Event); };
  return { tracker, transport, doc, browser, emit, listeners,
    advance: (ms: number) => { now += ms; mono += ms; }, timer: () => timer(),
    bind: () => bindBrowserUsage(tracker, "a", browser as unknown as Window, doc as unknown as Document, locks) };
}

function testLocks(): LockManager {
  const held = new Set<string>();
  return { request: async (name: string, _options: unknown, callback: (lock: Lock | null) => Promise<void>) => {
    if (held.has(name)) return callback(null);
    held.add(name); try { await callback({ name } as Lock); } finally { held.delete(name); }
  } } as unknown as LockManager;
}

describe("browser usage binding", () => {
  it("retries access on returning visible and deduplicates simultaneous visibility, pageshow and online events", async () => {
    vi.useFakeTimers();
    const f = browserFixture();
    let resolve!: (access: UsageAccess) => void;
    vi.mocked(f.transport.access).mockRejectedValueOnce(new Error("no signal"))
      .mockReturnValueOnce(new Promise(done => { resolve = done; }));
    await f.tracker.refreshAccess(); const unbind = f.bind();
    expect(f.transport.access).toHaveBeenCalledTimes(1); expect(vi.getTimerCount()).toBe(1);
    f.doc.visibilityState = "hidden"; f.emit("visibilitychange");
    expect(f.transport.access).toHaveBeenCalledTimes(1);
    f.doc.visibilityState = "visible"; f.emit("visibilitychange"); f.emit("pageshow"); f.emit("online");
    await vi.advanceTimersByTimeAsync(60_000);
    expect(f.transport.access).toHaveBeenCalledTimes(2); expect(vi.getTimerCount()).toBe(0);
    resolve({ admitted: true, notice_accepted: true, deletion_requested: false, casual: false });
    await f.tracker.refreshAccess();
    expect(f.tracker.casualMode()).toBe(false); expect(vi.getTimerCount()).toBe(0);
    unbind(); f.tracker.stop(); f.emit("visibilitychange"); f.emit("online");
    await vi.advanceTimersByTimeAsync(60_000);
    expect(f.transport.access).toHaveBeenCalledTimes(2);
  });

  it("uses one account/origin Web Lock across tabs; hide/pagehide releases it and cleanup removes listeners", async () => {
    const locks = testLocks(), a = browserFixture(locks), b = browserFixture(locks);
    for (const f of [a, b]) { await f.tracker.refreshAccess(); f.tracker.setGame({ campaignId: "clinic", paused: false, finishReportOpen: false }); }
    const unbindA = a.bind(), unbindB = b.bind();
    a.emit("pointerdown"); b.emit("pointerdown"); a.advance(1_000); b.advance(1_000); a.timer(); b.timer();
    await a.tracker.flush(); await b.tracker.flush();
    expect(a.transport.ingest).toHaveBeenCalledTimes(1); expect(b.transport.ingest).not.toHaveBeenCalled();
    a.doc.visibilityState = "hidden"; a.emit("visibilitychange"); await Promise.resolve(); await Promise.resolve();
    b.timer(); b.advance(1_000); b.timer(); await b.tracker.flush();
    expect(b.transport.ingest).toHaveBeenCalledTimes(1);
    b.advance(1_000); b.emit("pagehide"); await b.tracker.flush();
    expect(vi.mocked(b.transport.ingest).mock.calls.at(-1)![1]).toBe(true);
    unbindA(); unbindB();
    expect(a.browser.clearInterval).toHaveBeenCalled();
    expect([...a.listeners.values()].every((listeners) => listeners.size === 0)).toBe(true);
  });

  it("does not count synthetic events, animation/pointer hover, repeated keys or focus loss; meaningful drag/wheel/nav count without retaining input", async () => {
    const f = browserFixture(testLocks()); await f.tracker.refreshAccess();
    f.tracker.setGame({ campaignId: "clinic", paused: false, finishReportOpen: false }); const unbind = f.bind();
    f.emit("pointerdown", { isTrusted: false }); f.emit("pointermove", { buttons: 0 }); f.emit("keydown", { key: "Shift" });
    f.advance(1_000); f.timer(); await f.tracker.flush(); expect(f.transport.ingest).not.toHaveBeenCalled();
    f.emit("click"); f.emit("blur"); f.advance(1_000); f.timer(); await f.tracker.flush();
    expect(f.transport.ingest).toHaveBeenCalledTimes(1);
    f.emit("pointermove", { buttons: 1 }); f.advance(1_000); f.timer(); await f.tracker.flush();
    expect(f.transport.ingest).toHaveBeenCalledTimes(2);
    f.emit("wheel"); f.emit("keydown", { key: "ArrowRight", repeat: false });
    expect(JSON.stringify(f.tracker.outbox.batch())).not.toContain("ArrowRight");
    unbind();
  });

  it("fails time counting closed when atomic browser locks are unavailable, while scored counts remain available", async () => {
    const f = browserFixture(); await f.tracker.refreshAccess();
    f.tracker.setGame({ campaignId: "clinic", paused: false, finishReportOpen: false }); const unbind = f.bind();
    f.emit("pointerdown"); f.advance(1_000); f.timer(); await f.tracker.flush();
    expect(f.transport.ingest).not.toHaveBeenCalled(); expect(f.tracker.status().countingHere).toBe(false);
    expect(f.tracker.createQuestionReceipt()).not.toBeNull(); unbind();
  });
});
