import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudEntryStore } from "./entryStorage";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { deferred, syncHarness } from "./syncTestSupport";
import { CLOUD_CHECKPOINT_MS, CLOUD_LEASE_MS, CLOUD_RENEW_MS, CloudSyncError } from "./transport";

afterEach(() => vi.restoreAllMocks());

async function device() {
  const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
  const make = () => new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId),
    cache: h.cache, clock: h.clock, entryStore, enabled: true });
  const coordinator = make(); await coordinator.open();
  const session = await CloudGameSession.create(coordinator); expect(await session.reconnect()).toBe(true);
  return { ...h, entryStore, make, coordinator, session };
}

describe("standalone hosted lifecycle", () => {
  it("requires explicit takeover on a fresh device while another writer is visible", async () => {
    const h = await device(), other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId),
      cache: new MemoryCloudCache(), clock: h.clock, entryStore: new MemoryCloudEntryStore(), enabled: true });
    const generation = (await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerGeneration;
    await other.open(); expect(await other.focus()).toBe(false);
    expect(other.view).toMatchObject({ phase: "readonly", failure: "writer-elsewhere", writerElsewhere: true, canExecute: false });
    expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerGeneration).toBe(generation);
    expect(await other.startWriter(true)).toBe(true); expect(other.resume()).toBe(true);
    expect(await h.session.reconnect()).toBe(false); expect(h.session.canExecute).toBe(false);
  });

  it("reopens a clean closed copy at the latest account revision without treating its stale token as a conflict", async () => {
    const h = await device(); expect(await h.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); const remote = await CloudGameSession.create(other); expect(await remote.reconnect()).toBe(true);
    remote.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "other.closed-save" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await remote.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const reopened = h.make(); await reopened.open(); const session = await CloudGameSession.create(reopened);
    expect(await session.reconnect()).toBe(true); expect(session.state.simulationSpeed).toBe(4);
    expect(reopened.view).toMatchObject({ canExecute: true, failure: null, pending: false });
  });

  it("automatically restores command authority after an ordinary foreground check", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    expect(await h.coordinator.focus()).toBe(true);
    expect(h.coordinator.view.canExecute).toBe(true);
  });

  it("recognizes its own writer on a rapid relaunch without pagehide", async () => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
    const make = () => new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId),
      cache: h.cache, clock: h.clock, entryStore, enabled: true });
    let coordinator = make(); await coordinator.open(); await coordinator.startWriter(); coordinator.resume();
    await coordinator.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "standalone.speed" })));
    // No save/close, release, visibilitychange or elapsed lease: simulate a silent kill.
    coordinator.dispose(); h.clock.advance(500); coordinator = make();
    expect(await coordinator.open()).toBe(true);
    const session = await CloudGameSession.create(coordinator);
    expect(session.state.simulationSpeed).toBe(2);
    expect(await coordinator.focus()).toBe(true);
    expect(session.canExecute).toBe(true);
    expect(coordinator.view.pending).toBe(false);
    expect(coordinator.confirmedRevision).toBe("2");
    session.dispose();
  });

  it("confirms dirty foreground progress every five minutes while renewing only the lease every 15 seconds", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    await h.coordinator.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_PAUSED", paused: false, operationId: "standalone.play" })));
    expect(CLOUD_CHECKPOINT_MS).toBe(300_000);
    const cacheRead = vi.spyOn(h.cache, "read"), cacheWrite = vi.spyOn(h.cache, "write"), codec = vi.spyOn(h.coordinator.codec, "run");
    for (let elapsed = CLOUD_RENEW_MS; elapsed < CLOUD_CHECKPOINT_MS; elapsed += CLOUD_RENEW_MS) {
      h.clock.advance(CLOUD_RENEW_MS); await h.coordinator.pulse();
      expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: true });
      expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    }
    expect(cacheRead).not.toHaveBeenCalled(); expect(cacheWrite).not.toHaveBeenCalled(); expect(codec).not.toHaveBeenCalled();
    expect(h.server.calls.filter(call => call.method === "renew")).toHaveLength(19);
    h.clock.advance(CLOUD_RENEW_MS); await h.coordinator.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    expect(h.coordinator.view.pending).toBe(false);
    h.clock.advance(CLOUD_RENEW_MS); await h.coordinator.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(1);
  });

  it("makes repeated fresh focus/pageshow/online/resume events free of RPC, cache, codec and session notifications", async () => {
    const h = await device(), notify = vi.fn(); h.session.subscribe(notify);
    const cacheRead = vi.spyOn(h.cache, "read"), cacheWrite = vi.spyOn(h.cache, "write"), codec = vi.spyOn(h.coordinator.codec, "run");
    const calls = h.server.calls.length;
    for (let second = 0; second < 60; second++) {
      h.clock.advance(1_000); await h.coordinator.pulse();
      expect(await h.session.foreground()).toBe(true);
      expect(await h.session.foreground(true)).toBe(true); // spurious online without offline
    }
    expect(h.server.calls.slice(calls).map(call => call.method)).toEqual(["renew", "renew", "renew", "renew"]);
    expect(cacheRead).not.toHaveBeenCalled(); expect(cacheWrite).not.toHaveBeenCalled(); expect(codec).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled(); h.session.dispose();
  });

  it("checks a meaningful background return with small RPCs, preserving dirty progress without an early checkpoint", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "cheap.dirty" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const before = h.session.state;
    const cacheWrite = vi.spyOn(h.cache, "write"), cacheRead = vi.spyOn(h.cache, "read"), journal = vi.spyOn(h.entryStore, "write"), codec = vi.spyOn(h.coordinator.codec, "run");
    h.coordinator.markBackground(); h.clock.advance(10_000); const calls = h.server.calls.length;
    expect(await Promise.all(Array.from({ length: 20 }, () => h.session.foreground()))).toEqual(Array(20).fill(true));
    expect(h.server.calls.slice(calls).map(call => call.method)).toEqual(["capabilities", "head", "renew"]);
    expect(h.session.state).toBe(before); expect(h.session.syncView).toMatchObject({ canExecute: true, pending: true, failure: null });
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect(cacheRead).not.toHaveBeenCalled(); expect(cacheWrite).not.toHaveBeenCalled(); expect(journal).not.toHaveBeenCalled(); expect(codec).not.toHaveBeenCalled();
    h.session.dispose();
  });

  it("renews a still-owned lease after iOS monotonic suspension without re-encoding pending commands", async () => {
    const h = await device(); h.coordinator.markBackground(); h.clock.wall += 10_000;
    const codec = vi.spyOn(h.coordinator.codec, "run"), cacheWrite = vi.spyOn(h.cache, "write");
    expect(await h.session.foreground()).toBe(true);
    expect(h.session.canExecute).toBe(true); expect(codec).not.toHaveBeenCalled(); expect(cacheWrite).not.toHaveBeenCalled();
    h.session.dispose();
  });

  it("uses full checked recovery after an expired lease, never inventing authority from the old window", async () => {
    const h = await device(); h.coordinator.markBackground(); h.clock.wall += 120_000;
    const full = vi.spyOn(h.coordinator, "focus"); expect(await h.session.foreground()).toBe(true);
    expect(full).toHaveBeenCalledOnce(); expect(h.session.canExecute).toBe(true); h.session.dispose();
  });

  it.each(["revoked", "deleted"] as const)("checks %s access on a meaningful return and never falls through into automatic selection", async failure => {
    const h = await device(), full = vi.spyOn(h.session, "reconnect"); h.coordinator.markBackground(); h.clock.advance(10_000);
    h.server.setAccess(h.scope.accountId, failure === "revoked" ? { admitted: false } : { deletionRequested: true });
    expect(await h.session.foreground()).toBe(false); expect(h.coordinator.view).toMatchObject({ canExecute: false, failure });
    expect(full).not.toHaveBeenCalled(); h.session.dispose();
  });

  it("reproduces the old routine-focus freeze through the still-explicit full-reconnect API", async () => {
    const h = await device(), gate = deferred();
    h.session.execute({ type: "SET_PAUSED", paused: false, operationId: "old.focus.play" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const tick = h.session.state.facilityTick;
    h.server.faults.push({ method: "head", at: "before", wait: gate.promise });
    // Before this fix every focus/visible/pageshow event called this full API.
    const repairing = h.session.reconnect();
    await vi.waitFor(() => expect(h.server.calls.at(-1)?.method).toBe("head"));
    h.clock.advance(20_000); // Lease is still valid, but the old check gated it.
    expect(h.session.canExecute).toBe(false); expect(h.session.state.paused).toBe(true);
    expect(h.session.execute({ type: "ADVANCE_TICK", operationId: "old.focus.dead.tap" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(h.session.state.facilityTick).toBe(tick);
    gate.resolve(); expect(await repairing).toBe(true); expect(h.session.state.paused).toBe(false);
    h.session.dispose();
  });

  it("keeps commands and facility time advancing during a 20-second foreground check with a valid lease", async () => {
    const h = await device(), gate = deferred();
    expect(h.session.execute({ type: "SET_PAUSED", paused: false, operationId: "play.before.check" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    await h.session.durable(); const tick = h.session.state.facilityTick;
    h.coordinator.markBackground(); h.clock.wall += 10_000; // monotonic clock stopped in iOS
    h.server.faults.push({ method: "head", at: "before", wait: gate.promise });
    const checking = h.session.foreground();
    await vi.waitFor(() => expect(h.server.calls.at(-1)?.method).toBe("head"));
    h.clock.advance(20_000); // Slow transport, still inside the ORIGINAL lease.
    expect(h.session.state.paused).toBe(false);
    expect(h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "while.checking" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(h.session.execute({ type: "ADVANCE_TICK", operationId: "tick.while.checking" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(h.session.state.facilityTick).toBe(tick + 1);
    await h.session.durable(); gate.resolve(); expect(await checking).toBe(true);
    expect(h.session.state.simulationSpeed).toBe(4); expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: true }); h.session.dispose();
  });

  it("keeps the tiny heartbeat running during a slow foreground read so the lease does not expire needlessly", async () => {
    const h = await device(), gate = deferred(); h.clock.advance(45_000);
    h.server.faults.push({ method: "head", at: "before", wait: gate.promise });
    const checking = h.session.foreground();
    await vi.waitFor(() => expect(h.server.calls.at(-1)?.method).toBe("head"));
    const codec = vi.spyOn(h.coordinator.codec, "run"), writes = vi.spyOn(h.cache, "write");
    await h.coordinator.pulse(); // Tiny renewal must not wait behind the head read.
    h.clock.advance(20_000); expect(h.session.canExecute).toBe(true); // past the old deadline, inside the renewed one
    expect(codec).not.toHaveBeenCalled(); expect(writes).not.toHaveBeenCalled();
    gate.resolve(); expect(await checking).toBe(true); h.session.dispose();
  });

  it("cannot let a late small foreground check undo an explicit authority pause", async () => {
    const h = await device(), gate = deferred(); h.coordinator.markBackground(); h.clock.advance(10_000);
    h.server.faults.push({ method: "head", at: "before", wait: gate.promise });
    const checking = h.session.foreground();
    await vi.waitFor(() => expect(h.server.calls.at(-1)?.method).toBe("head"));
    h.coordinator.pause(); gate.resolve(); expect(await checking).toBe(false);
    expect(h.session.canExecute).toBe(false); h.session.dispose();
  });

  it("times out only a missing foreground RPC while preserving the original valid lease and fencing its late reply", async () => {
    const h = await device(), gate = deferred(); h.coordinator.markBackground(); h.clock.advance(10_000);
    h.server.faults.push({ method: "head", at: "before", wait: gate.promise });
    vi.useFakeTimers();
    try {
      const checking = h.coordinator.foreground();
      h.clock.advance(30_000); await vi.advanceTimersByTimeAsync(30_000);
      expect(await checking).toBe(true); expect(h.coordinator.view).toMatchObject({ canExecute: true, failure: "network" });
      gate.resolve(); await vi.advanceTimersByTimeAsync(0);
      expect(h.coordinator.view).toMatchObject({ canExecute: true, failure: "network" });
      h.clock.advance(20_000); // The old deadline, not a late renewal, is binding.
      expect(h.coordinator.view.canExecute).toBe(false);
    } finally { vi.useRealTimers(); h.session.dispose(); }
  });

  it("does not turn a transient foreground network failure into a full command-fencing reconnect", async () => {
    const h = await device(), full = vi.spyOn(h.session, "reconnect"); h.coordinator.markBackground(); h.clock.advance(10_000);
    h.server.faults.push({ method: "head", at: "before", error: new CloudSyncError("network") });
    expect(await h.session.foreground()).toBe(true);
    expect(h.coordinator.view).toMatchObject({ canExecute: true, phase: "waiting", failure: "network" });
    const calls = h.server.calls.length;
    expect(await h.session.foreground()).toBe(true); expect(h.server.calls).toHaveLength(calls); expect(full).not.toHaveBeenCalled();
    h.coordinator.markOffline();
    expect(await h.session.foreground(true)).toBe(true);
    expect(h.coordinator.view).toMatchObject({ canExecute: true, failure: null, phase: "ready" }); expect(full).not.toHaveBeenCalled();
    h.session.dispose();
  });

  it("fences a reported other writer before awaiting any slow local preparation for full recovery", async () => {
    const h = await device(), gate = deferred();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); await other.startWriter(true);
    vi.spyOn(h.session, "durable").mockImplementation(async () => { await gate.promise; return true; });
    h.coordinator.markBackground(); h.clock.advance(10_000);
    const checking = h.session.foreground();
    await vi.waitFor(() => expect(h.coordinator.view).toMatchObject({ canExecute: false, failure: "writer" }));
    expect(h.session.execute({ type: "ADVANCE_TICK", operationId: "fenced.immediately" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    gate.resolve(); expect(await checking).toBe(false); h.session.dispose(); other.dispose();
  });

  it("preserves accepted local bytes when a different writer appears during a small foreground check", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "fenced.focus" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const recovery = h.coordinator.exportRecovery();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); expect(await other.startWriter(true)).toBe(true);
    h.coordinator.markBackground(); h.clock.advance(10_000);
    expect(await h.session.foreground()).toBe(false); expect(h.session.canExecute).toBe(false);
    expect(h.coordinator.exportRecovery()).toBe(recovery); expect(await h.coordinator.saveAndClose()).toBe(false);
    expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerActive).toBe(true);
    h.session.dispose(); other.dispose();
  });

  it.each([10_000, 120_000, 3 * 86_400_000])("automatically rechecks an iOS suspension of %i ms while performance.now is paused", async elapsed => {
    const h = await device();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "sleep.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const before = serializeGameState(h.session.state);
    h.clock.wall += elapsed;
    expect(h.coordinator.view.canExecute).toBe(elapsed < CLOUD_LEASE_MS);
    expect(await h.session.reconnect()).toBe(true);
    expect(serializeGameState(h.session.state)).toBe(before);
    expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: false, failure: null });
    h.session.dispose();
  });

  it("recovers a silent suspension on the next pulse even when no visibility/focus events arrive", async () => {
    const h = await device(); h.clock.wall += 120_000;
    await h.coordinator.pulse(); expect(h.session.canExecute).toBe(true);
    h.session.dispose();
  });

  it("coalesces rapid foreground events and retains a short-sessions account checkpoint", async () => {
    const h = await device(); let coordinator = h.coordinator, session = h.session;
    for (let index = 0; index < 4; index++) {
      session.execute({ type: "SET_SIMULATION_SPEED", speed: index % 2 ? 4 : 2, operationId: `rapid.${index}` }, PROTOTYPE_DOMAIN_CONTEXT);
      await session.durable(); const before = JSON.parse(serializeGameState(session.state));
      session.dispose(); h.clock.advance(250); coordinator = h.make();
      expect(await coordinator.open()).toBe(true); session = await CloudGameSession.create(coordinator);
      expect((await Promise.all([session.reconnect(), session.reconnect(), session.reconnect()])).every(Boolean)).toBe(true);
      expect(session.canExecute).toBe(true); expect(JSON.parse(serializeGameState(session.state))).toEqual(before);
      expect(coordinator.view.pending).toBe(false);
    }
    expect(h.server.operationCount(h.scope.accountId)).toBe(4);
    expect(h.entryStore.records.size).toBe(1); session.dispose();
  });

  it("automatically waits out an active legacy lease whose token was never persisted", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    await h.coordinator.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "legacy.speed" })));
    h.coordinator.dispose();
    const next = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: h.cache, clock: h.clock, enabled: true });
    await next.open(); expect(await next.focus()).toBe(false);
    expect(next.view).toMatchObject({ phase: "waiting", failure: "lease-check", pending: true });
    h.clock.advance(60_001); await next.pulse();
    expect(next.view).toMatchObject({ canExecute: true, pending: false, failure: null });
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(2);
  });

  it("recovers an acquisition whose response was lost before the lease journal update", async () => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
    const make = () => new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: h.cache, clock: h.clock, entryStore, enabled: true });
    const first = make(); await first.open();
    h.server.faults.push({ method: "acquire", at: "after", error: new CloudSyncError("network") });
    expect(await first.focus()).toBe(false); first.dispose();
    const next = make(); await next.open(); expect(await next.focus()).toBe(true);
    expect(next.view.canExecute).toBe(true);
    expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerGeneration).toBe("2");
  });

  it("recovers a response lost during same-device lease rotation without losing the pending candidate", async () => {
    const h = await device();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "rotation.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); h.session.dispose();
    const second = h.make(); await second.open();
    h.server.faults.push({ method: "acquire", at: "after", error: new CloudSyncError("network") });
    expect(await second.focus()).toBe(false); second.dispose();
    const third = h.make(); await third.open(); expect(await third.focus()).toBe(true);
    expect(third.view).toMatchObject({ pending: false, canExecute: true });
    expect((await CloudGameSession.create(third)).state.simulationSpeed).toBe(2);
  });

  it("reclaims its lease with a new generation so the former document cannot resume writing", async () => {
    const h = await device(), next = h.make(); await next.open();
    expect(await next.focus()).toBe(true);
    h.clock.advance(15_000); await h.coordinator.pulse();
    expect(h.coordinator.view).toMatchObject({ canExecute: false, failure: "writer" });
    expect(next.view.canExecute).toBe(true);
  });

  it("keeps a real two-device revision conflict paused and preserves the exact local branch", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "local.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const recovery = h.coordinator.exportRecovery();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); await other.startWriter(true); other.resume();
    await other.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "other.speed" })));
    expect(await other.checkpoint()).toBe(true);
    expect(await h.session.reconnect()).toBe(false);
    expect(h.coordinator.view).toMatchObject({ canExecute: false, phase: "conflict", failure: "revision" });
    expect(h.coordinator.exportRecovery()).toBe(recovery);
    expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).revision).toBe("2");
  });

  it.each(["revoked", "deleted"] as const)("never resumes automatically after access is %s", async failure => {
    const h = await device(); h.clock.wall += 120_000;
    h.server.setAccess(h.scope.accountId, failure === "revoked" ? { admitted: false } : { deletionRequested: true });
    expect(await h.session.reconnect()).toBe(false);
    expect(h.coordinator.view).toMatchObject({ canExecute: false, failure });
  });

  it("retries network loss automatically without a resume click or changing operation bytes", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "offline.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); h.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
    expect(await h.session.checkpointNow("hidden")).toBe(false);
    const frozen = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!;
    h.clock.advance(30_001); await h.coordinator.pulse();
    expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: false });
    expect(h.server.calls.filter(call => call.method === "commit")).toHaveLength(1);
    expect(h.server.calls.some(call => call.method === "operation" && call.operationId === frozen.operationId)).toBe(true);
  });

  it("persists an accepted command if suspension expires the lease during encoding", async () => {
    const h = await device(), gate = deferred(), codec = h.coordinator.codec;
    vi.spyOn(h.coordinator, "codec", "get").mockReturnValue({ run: async task => {
      if (task.kind === "encode") await gate.promise;
      return codec.run(task);
    } });
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "encoding.sleep" }, PROTOTYPE_DOMAIN_CONTEXT);
    await Promise.resolve(); h.clock.wall += 120_000; expect(h.session.canExecute).toBe(false);
    gate.resolve(); expect(await h.session.durable()).toBe(true);
    expect(h.coordinator.pendingCandidate).not.toBeNull();
    expect(await h.session.reconnect()).toBe(true); expect(h.session.state.simulationSpeed).toBe(2);
  });

  it("rebinds a command finishing local encoding while an expired lease is being reacquired", async () => {
    const h = await device(), gate = deferred(); h.clock.wall += 120_000;
    h.server.faults.push({ method: "acquire", at: "before", wait: gate.promise });
    const reconnecting = h.session.reconnect();
    await vi.waitFor(() => expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(2));
    const candidate = await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "late.encoding" }));
    expect(await h.coordinator.stage(candidate, "ordinary", true)).toBe(true);
    gate.resolve(); expect(await reconnecting).toBe(true);
    expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: false });
    const loaded = await CloudGameSession.create(h.coordinator); expect(loaded.state.simulationSpeed).toBe(2);
  });

  it("resolves its own hide upload before deciding that a racing renewal is a revision conflict", async () => {
    const h = await device(), gate = deferred();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "renewal.race" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable();
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const uploading = h.session.checkpointNow("hidden");
    await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    h.server.faults.push({ method: "renew", at: "before", error: new CloudSyncError("revision") });
    h.clock.advance(15_000); const renewing = h.coordinator.pulse();
    await vi.waitFor(() => expect(h.coordinator.view.phase).toBe("checking"));
    gate.resolve(); expect(await uploading).toBe(true); await renewing;
    expect(h.coordinator.view).toMatchObject({ canExecute: true, pending: false, failure: null });
  });

  it("lets an explicit keep-device choice upload a nondivergent branch only after verified copy retention", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "chosen.device" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const original = h.coordinator.exportRecovery();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); await other.startWriter(true);
    expect(await h.session.reconnect()).toBe(false);
    expect(h.coordinator.view.conflictCopies?.canKeepDevice).toBe(true);
    expect(await h.coordinator.keepDeviceProgress()).toBe(true);
    const copy = (await h.entryStore.entries()).find(entry => entry.key.startsWith("conflict:"))!.value as { device: unknown; account: { revision: string } };
    expect(JSON.stringify(copy.device)).toBe(original); expect(copy.account.revision).toBe("1");
    const reopened = h.make(); await reopened.open(); const session = await CloudGameSession.create(reopened);
    expect(await session.reconnect()).toBe(true); expect(session.state.simulationSpeed).toBe(2);
    expect(reopened.view).toMatchObject({ pending: false, canExecute: true });
    expect(reopened.confirmedRevision).toBe("2");
  });

  it("does not acquire or replace any save if the explicit conflict copy fails readback", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "copy.failure" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const original = h.coordinator.exportRecovery();
    const read = h.entryStore.read.bind(h.entryStore);
    vi.spyOn(h.entryStore, "read").mockImplementation(key => key.startsWith("conflict:") ? Promise.resolve(null) : read(key));
    const acquired = h.server.calls.filter(call => call.method === "acquire").length;
    expect(await h.coordinator.keepDeviceProgress()).toBe(false);
    expect(h.coordinator.exportRecovery()).toBe(original);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(acquired);
  });

  it("does not let auxiliary lease-proof quota errors block campaign persistence", async () => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
    vi.spyOn(entryStore, "write").mockRejectedValue(new DOMException("quota", "QuotaExceededError"));
    const coordinator = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: h.cache, clock: h.clock, entryStore, enabled: true });
    expect(await coordinator.open()).toBe(true); expect(await coordinator.focus()).toBe(true);
    expect(await coordinator.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "proof.quota" })))).toBe(true);
    expect(await coordinator.checkpoint()).toBe(true); expect(coordinator.view.canExecute).toBe(true);
  });

  it("requires a fresh choice if the account revision changes after the comparison was shown", async () => {
    const h = await device(); h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "review.device" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    await other.open(); await other.startWriter(true); other.resume();
    await h.session.reconnect(); expect(h.coordinator.view.conflictCopies?.accountRevision).toBe("1");
    await other.stage(await h.candidate(h.prepared.checkpoint)); expect(await other.checkpoint()).toBe(true);
    const acquired = h.server.calls.filter(call => call.method === "acquire").length;
    expect(await h.coordinator.keepDeviceProgress()).toBe(false);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(acquired);
    expect(h.coordinator.view.conflictCopies?.accountRevision).toBe("2");
    expect(h.coordinator.view).toMatchObject({ canExecute: false, failure: "revision", pending: true });
  });

  it.each(["device", "account"] as const)("serializes an explicit %s choice against focus/retry while recovery bytes are retained", async choice => {
    const h = await device(), gate = deferred();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "choice.pending" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const original = h.coordinator.exportRecovery();
    const create = h.entryStore.create.bind(h.entryStore);
    const retaining = vi.spyOn(h.entryStore, "create").mockImplementation(async (key, value) => { await gate.promise; return create(key, value); });
    const choosing = choice === "device" ? h.coordinator.keepDeviceProgress() : h.coordinator.useAccountSave(async () => {});
    await vi.waitFor(() => expect(retaining).toHaveBeenCalled());
    expect(await h.coordinator.retry()).toBe(false);
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    expect(h.coordinator.exportRecovery()).toBe(original);
    gate.resolve(); expect(await choosing).toBe(true);
  });

  it("resumes verified local play while its reopen upload is still waiting for the network", async () => {
    const h = await device(), gate = deferred();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "background.saved" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); h.session.dispose();
    const reopened = h.make(); await reopened.open(); const session = await CloudGameSession.create(reopened);
    h.server.faults.push({ method: "commit", at: "before", wait: gate.promise });
    let confirmed = false; const connecting = session.reconnect().then(value => { confirmed = value; return value; });
    await vi.waitFor(() => expect(reopened.view.phase).toBe("saving"));
    expect(confirmed).toBe(false); expect(session.canExecute).toBe(true); expect(session.state.simulationSpeed).toBe(2);
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "background.continue" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    await session.durable(); gate.resolve(); expect(await connecting).toBe(true);
    expect(session.state.simulationSpeed).toBe(4); expect(reopened.view.pending).toBe(true);
    for (let elapsed = 0; elapsed < CLOUD_CHECKPOINT_MS; elapsed += CLOUD_RENEW_MS) { h.clock.advance(CLOUD_RENEW_MS); await reopened.pulse(); }
    expect(reopened.view.pending).toBe(false); expect(reopened.confirmedRevision).toBe("3");
  });

  it("fences a former document even when only its acquisition intent survived a quota error", async () => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore(), write = entryStore.write.bind(entryStore), cas = entryStore.compareAndSet.bind(entryStore);
    const rejectLeaseReceipt = (key: string, value: unknown) => {
      if (key.startsWith("writer:") && !(value as { acquisition: unknown }).acquisition) throw new DOMException("quota", "QuotaExceededError");
    };
    vi.spyOn(entryStore, "write").mockImplementation(async (key, value) => {
      rejectLeaseReceipt(key, value);
      return write(key, value);
    });
    vi.spyOn(entryStore, "compareAndSet").mockImplementation(async (key, expected, value) => {
      rejectLeaseReceipt(key, value);
      return cas(key, expected, value);
    });
    const make = () => new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: h.cache, clock: h.clock, entryStore, enabled: true });
    const old = make(); await old.open(); expect(await old.focus()).toBe(true);
    expect((await entryStore.read<{ acquisition: unknown }>(`writer:${h.scope.campaignId}`))?.acquisition).not.toBeNull();
    const next = make(); await next.open(); expect(await next.focus()).toBe(true);
    h.clock.advance(15_000); await old.pulse();
    expect(old.view).toMatchObject({ canExecute: false, failure: "writer" }); expect(next.view.canExecute).toBe(true);
  });
});
