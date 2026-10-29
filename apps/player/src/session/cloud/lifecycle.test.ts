import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudEntryStore } from "./entryStorage";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { deferred, syncHarness } from "./syncTestSupport";
import { CloudSyncError } from "./transport";

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

  it("confirms foreground progress within 15 seconds without needing a close event", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    await h.coordinator.stage(await h.candidate(h.command(h.prepared.checkpoint,
      { type: "SET_PAUSED", paused: false, operationId: "standalone.play" })));
    h.clock.advance(15_000); await h.coordinator.pulse();
    expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    expect(h.coordinator.view.pending).toBe(false);
  });

  it.each([10_000, 120_000, 3 * 86_400_000])("automatically rechecks an iOS suspension of %i ms while performance.now is paused", async elapsed => {
    const h = await device();
    h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "sleep.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.durable(); const before = serializeGameState(h.session.state);
    h.clock.wall += elapsed;
    expect(h.coordinator.view.canExecute).toBe(false);
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
    h.clock.advance(15_000); await reopened.pulse();
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
