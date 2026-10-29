import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { observeStorage, problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { CloudCacheError, IndexedDbCloudCache } from "./cache";
import { IndexedDbCloudEntryStore } from "./entryStorage";
import { CloudCodecWorker, cloudCodec } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { deferred, syncHarness } from "./syncTestSupport";
import { startFacilityClock, type FacilityClockScheduler } from "../facilityClock";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });
describe("responsive commands and self-healing technical boundaries", () => {
  it.each(["hung", "killed", "throwing"] as const)("accepts commands while a %s codec worker recovers and preserves every evidence record", async fault => {
    const h = await syncHarness(), worker = new FakeCloudCodecWorker(), next = new FakeCloudCodecWorker(); next.release();
    const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(worker).mockReturnValueOnce(next));
    let useWorker = false;
    const coordinator = new CloudSyncCoordinator({ scope: h.scope, cache: h.cache, transport: h.server.transport(h.scope.accountId), clock: h.clock,
      codec: { run: task => useWorker && task.kind === "encode" ? codec.run(task) : cloudCodec.run(task) }, enabled: true });
    await coordinator.open(); await coordinator.startWriter(); coordinator.resume(); const session = await CloudGameSession.create(coordinator);
    try {
      useWorker = true; vi.useFakeTimers();
      const first = session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "watchdog.first" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(first?.simulationSpeed).toBe(2); expect(session.canExecute).toBe(true);
      await Promise.resolve(); worker.reply({ ready: true });
      expect(codec.health.inFlight[0]?.[0]).toBe("encode");
      expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "watchdog.second" }, PROTOTYPE_DOMAIN_CONTEXT)?.simulationSpeed).toBe(4);
      expect(problemDiagnostics.report().current.health.gameSession).toMatchObject({ encoding: true, canExecute: true });
      if (fault === "hung") await vi.advanceTimersByTimeAsync(5_000);
      else if (fault === "killed") worker.onerror?.({ preventDefault() {} } as ErrorEvent);
      else worker.reply({ id: worker.messages[0]!.id, error: { kind: "codec", code: "worker", message: "Unexpected error" } });
      expect(worker.terminated).toBe(true);
      expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "watchdog.third" }, PROTOTYPE_DOMAIN_CONTEXT)?.simulationSpeed).toBe(1);
      vi.useRealTimers(); expect(await session.durable()).toBe(true); expect(session.canExecute).toBe(true);
      const candidate = coordinator.pendingCandidate!;
      expect(candidate.evidence.records.length).toBeGreaterThanOrEqual(3);
      expect(session.state.operationReceipts["watchdog.third"]?.status).toBe("applied");
      expect(problemDiagnostics.report().current.events.some(row => row[2] === "codec-worker-restart")).toBe(true);
      expect(codec.health.restarts).toBe(1);
    } finally { session.dispose(); codec.dispose(); }
  });
  it("accepts commands during slow IndexedDB and bounds an explicit durability wait, with visible classified health", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    const session = await CloudGameSession.create(h.coordinator), held = deferred();
    const write = h.cache.write.bind(h.cache); let entered = false;
    vi.spyOn(h.cache, "write").mockImplementationOnce((...args) => observeStorage("cache.write", async () => { entered = true; await held.promise; return write(...args); }));
    try {
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "storage.first" }, PROTOTYPE_DOMAIN_CONTEXT);
      await vi.waitFor(() => expect(entered).toBe(true));
      expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "storage.second" }, PROTOTYPE_DOMAIN_CONTEXT)?.simulationSpeed).toBe(4);
      expect(session.canExecute).toBe(true); expect(session.syncView.pending).toBe(true);
      expect(problemDiagnostics.report().current.health.storage!.operations).toEqual(expect.arrayContaining([["cache.write", expect.any(Number)]]));
      held.resolve(); expect(await session.durable()).toBe(true);
      expect(session.state.operationReceipts["storage.second"]?.status).toBe("applied");
    } finally { held.resolve(); session.dispose(); }
  });
  it.each(["cache", "entry"] as const)("bounds an IndexedDB %s open that never fires an event and reports the failure", async kind => {
    vi.useFakeTimers();
    const factory = { open: () => ({}) } as unknown as IDBFactory;
    const scope = { backendId: "test", accountId: "synthetic", campaignId: "synthetic" };
    const result = kind === "cache" ? new IndexedDbCloudCache(factory).read(scope) : new IndexedDbCloudEntryStore(scope, factory).read("test");
    const rejected = expect(result).rejects.toMatchObject({ code: "storage" });
    await vi.advanceTimersByTimeAsync(10_000); await rejected;
    expect(problemDiagnostics.report().current.health.storage).toMatchObject({ pending: 0, lastError: expect.stringMatching(/blocked|storage/) });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("starts an immediate retry registered between a failed flush result and its cleanup", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    const session = await CloudGameSession.create(h.coordinator);
    try {
      vi.spyOn(h.cache, "write").mockRejectedValueOnce(new CloudCacheError("transaction"));
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "retry.cleanup" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.durable()).toBe(false);
      // Deliberately no timer/microtask delay before the second barrier.
      expect(await session.durable()).toBe(true);
      expect(session.state.operationReceipts["retry.cleanup"]?.status).toBe("applied");
      expect(h.server.operationCount(h.scope.accountId)).toBe(0);
      expect(await session.reconnect()).toBe(true); expect(session.canExecute).toBe(true);
      expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    } finally { session.dispose(); }
  });
  it("publishes an expired command gate even when a health/clock read detected it before a slow heartbeat check", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    const session = await CloudGameSession.create(h.coordinator); expect(await session.reconnect()).toBe(true);
    const held = deferred(), notices: { canExecute: boolean; failure: string | null }[] = [];
    session.subscribe(() => notices.push({ canExecute: session.syncView.canExecute, failure: session.syncView.failure }));
    h.clock.advance(65_000);
    expect(session.canExecute).toBe(false); // view.checkTime() runs before pulse.
    expect(notices).toHaveLength(0);
    h.server.faults.push({ method: "capabilities", at: "before", wait: held.promise });
    const checking = h.coordinator.pulse();
    expect(notices).toContainEqual({ canExecute: false, failure: "lease-expired" });
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "expired.refused" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    held.resolve(); await checking; session.dispose();
  });
  it("finishes a durability barrier at its accepted command version while newer ticks still encode", async () => {
    const h = await syncHarness(), later = deferred(); let encodes = 0, laterEntered = false;
    const coordinator = new CloudSyncCoordinator({ scope: h.scope, cache: h.cache, transport: h.server.transport(h.scope.accountId), clock: h.clock, enabled: true,
      codec: { run: async task => { if (task.kind === "encode" && ++encodes === 2) { laterEntered = true; await later.promise; } return cloudCodec.run(task); } } });
    await coordinator.open(); await coordinator.startWriter(); coordinator.resume(); const session = await CloudGameSession.create(coordinator);
    const held = deferred(), write = h.cache.write.bind(h.cache); let writeEntered = false;
    vi.spyOn(h.cache, "write").mockImplementationOnce(async (...args) => { writeEntered = true; await held.promise; return write(...args); });
    try {
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "barrier.before" }, PROTOTYPE_DOMAIN_CONTEXT);
      await vi.waitFor(() => expect(writeEntered).toBe(true));
      let completed = false; const barrier = session.durable().then(ok => { completed = ok; return ok; });
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "barrier.after" }, PROTOTYPE_DOMAIN_CONTEXT);
      held.resolve(); await vi.waitFor(() => expect(laterEntered).toBe(true));
      // Before the fix this waited on the while(dirty) loop's LATER encode.
      expect(completed).toBe(true); expect(await barrier).toBe(true);
      expect(session.canExecute).toBe(true); expect(session.syncView.pending).toBe(true);
      later.resolve(); expect(await session.durable()).toBe(true);
      // Each applied command has command + receipt evidence, with no replay.
      expect(coordinator.pendingCandidate!.evidence.records).toHaveLength(4);
    } finally { held.resolve(); later.resolve(); session.dispose(); }
  });
  it("repairs a lost facility interval even when requestAnimationFrame never fires, without catching up ticks", () => {
    let now = 0, tick = 0, sequence = 0;
    const intervals = new Map<number, () => void>(), timers = new Map<number, () => void>();
    const scheduler: FacilityClockScheduler = { setInterval: callback => { intervals.set(++sequence, callback); return sequence; }, clearInterval: id => { intervals.delete(id); },
      setTimeout: callback => { timers.set(++sequence, callback); return sequence; }, clearTimeout: id => { timers.delete(id); },
      requestAnimationFrame: () => ++sequence, cancelAnimationFrame: vi.fn() };
    const stop = startFacilityClock(scheduler, 1_000, () => ({ tick, paused: false, speed: 1, visible: true, allowed: true }), () => { tick++; }, () => now);
    try {
      // Drop all primary interval callbacks; only independent watchdog timeouts run.
      for (let i = 0; i < 6; i++) { now += 1_000; const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(fn => fn()); }
      expect(tick).toBe(1); expect(intervals.size).toBe(1);
      expect(problemDiagnostics.report().current.health.clock).toMatchObject({ restarts: 1, rafPendingAge: 5_000, tick: 1 });
      [...intervals.values()][0]!(); expect(tick).toBe(2);
    } finally { stop(); }
    expect(timers.size).toBe(0); expect(intervals.size).toBe(0);
  });
  it.each(["paused", "hidden", "fenced"] as const)("never uses its watchdog to bypass a %s clinic", reason => {
    vi.useFakeTimers(); let tick = 0;
    const scheduler = { setInterval, clearInterval, setTimeout, clearTimeout } as unknown as FacilityClockScheduler;
    const stop = startFacilityClock(scheduler, 1_000, () => ({ tick, paused: reason === "paused", speed: 1, visible: reason !== "hidden", allowed: reason !== "fenced" }), () => { tick++; });
    vi.advanceTimersByTime(20_000); expect(tick).toBe(0); stop(); expect(vi.getTimerCount()).toBe(0);
  });
});
