import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CloudAccountProvider, useCloudAccount, type CloudAccountValue } from "./CloudAccount";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudSyncCoordinator, type CloudSyncView } from "./coordinator";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { ControllableOperationalPort, operationalSessionFixture } from "./operationalSessionTestSupport";
import { runCloudCodecTask } from "./codecTasks";
import { copyDescendsFrom } from "./copySelection";
import { deferred } from "./syncTestSupport";
import { snapshotCopy } from "./snapshotCodec";
import { CloudSyncError, type CloudTransport } from "./transport";
import { FakeCloudServer } from "./fakeTransport";
import type { CloudCacheEntry } from "./cache";
import { snapshotConflictBackup } from "./retainedCopies";

const codec = { run: runCloudCodecTask };
const settleCodec = async () => { for (let i = 0; i < 30; i++) await new Promise(resolve => setImmediate(resolve)); };
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

/** A real failed immutable upload, followed by the production automatic opener's
 * offline fallback. This differs from an acquire-only outage: its verified local
 * projection includes progress beyond the still-unchanged account snapshot. */
async function offlinePhone(uncertainUpload: boolean) {
  const h = await operationalSessionFixture({}, undefined, false);
  h.session.dispose();
  const entryStore = new MemoryCloudEntryStore(), failed = new Set<string>();
  const calls: { method: string; at: number; result: "success" | "network" }[] = [];
  const transport = new Proxy(h.server.transport(h.scope.accountId), {
    get(target, name) {
      const method = Reflect.get(target, name);
      if (typeof method !== "function") return method;
      return async (...args: unknown[]) => {
        calls.push({ method: String(name), at: h.clock.mono, result: failed.has(String(name)) ? "network" : "success" });
        if (failed.has(String(name))) throw new CloudSyncError("network");
        return method.apply(target, args);
      };
    },
  }) as CloudTransport;
  const runtime = { ...h.scope, region: "Synthetic", cache: h.cache, entryStore, transport };
  const initial = new CloudSyncCoordinator({ ...runtime, scope: h.scope, clock: h.clock, enabled: true, codec });
  expect(await initial.open()).toBe(true); expect(await initial.startWriter(true)).toBe(true); expect(initial.resume()).toBe(true);
  const seed = await CloudGameSession.create(initial, undefined, undefined, { operational: false });
  for (const name of ["list", "head", "load", "commit"]) failed.add(name);
  if (uncertainUpload) {
    expect(seed.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "read-outage.before-reload" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await seed.durable()).toBe(true);
    expect(await seed.checkpointNow("purchase")).toBe(false);
    expect(initial.recoveryEntry?.recovery?.inFlight).not.toBeNull();
  }
  const atReload = seed.state;
  seed.dispose();
  const selected = await openAutomaticCloudCampaign({ runtime, campaignId: h.scope.campaignId, clock: h.clock, codec });
  const reopen = vi.fn(async (_checked: boolean) => true), ports: ControllableOperationalPort[] = [];
  const session = await CloudGameSession.create(selected, undefined, reopen, { operational: { createPort: () => {
    const port = new ControllableOperationalPort(); ports.push(port); return port;
  } } });
  expect(session.state).toEqual(atReload);
  expect(session.canExecute).toBe(true); expect(selected.view.failure).toBe("network");
  const key = cloudCampaignStorageKey(h.scope), owner = (await h.cache.journal.head(key))!.owner;
  const window = async () => {
    for (let step = 0; step < 60; step++) {
      h.clock.advance(5_000); await vi.advanceTimersByTimeAsync(5_000); await session.pulse();
    }
  };
  return { ...h, runtime, calls, failed, selected, session, reopen, ports, key, owner, window };
}

async function mountedPhone(leaseMs = 60_000) {
  const h = await operationalSessionFixture({}, undefined, false), copy = h.coordinator.confirmed!;
  h.session.dispose();
  const server = new FakeCloudServer(h.clock.wallNow, leaseMs);
  server.setAccess(h.scope.accountId, { snapshotSaves: true }); server.seed(h.scope.accountId, copy);
  const failed = new Set<string>(), entryStore = new MemoryCloudEntryStore();
  const transport = new Proxy(server.transport(h.scope.accountId), { get(target, key) {
    const method = Reflect.get(target, key);
    return typeof method !== "function" ? method : async (...args: unknown[]) => {
      if (failed.has(String(key))) throw new CloudSyncError("network");
      return method.apply(target, args);
    };
  } }) as CloudTransport;
  const runtime = { ...h.scope, region: "Synthetic", cache: h.cache, entryStore, transport };
  const coordinator = new CloudSyncCoordinator({ ...runtime, scope: h.scope, clock: h.clock, codec, enabled: true });
  expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter(true)).toBe(true); expect(coordinator.resume()).toBe(true);
  const reopen = vi.fn(async (_checked: boolean) => true), ports: ControllableOperationalPort[] = [];
  const session = await CloudGameSession.create(coordinator, undefined, reopen, { operational: { createPort: () => {
    const port = new ControllableOperationalPort(); ports.push(port); return port;
  } } });
  const key = cloudCampaignStorageKey(h.scope), owner = (await h.cache.journal.head(key))!.owner;
  return { ...h, server, runtime, coordinator, session, failed, reopen, ports, key, owner };
}

describe("B-009 prolonged partial-read outage recovery", () => {
  it("restores mounted local play after a failed authority retry, preserving and fencing its frozen ancestor before one latest-state upload", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    const h = await mountedPhone(600_000);
    try {
      expect(await h.session.executeAsync({ type: "SET_PAUSED", paused: false, operationId: "mounted-before-outage" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "mounted-pending-upload" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await h.session.durable()).toBe(true);
      for (const name of ["capabilities", "head", "list", "load", "operation", "acquire", "renew", "commit"]) h.failed.add(name);
      expect(await h.session.checkpointNow("purchase")).toBe(false);
      const frozen = h.coordinator.recoveryEntry!.recovery!.inFlight!, before = h.session.state;
      // A prior compacted conflict preview must not satisfy the later promise
      // to retain the exact immutable request after it leaves the active cache.
      const value = { scope: h.scope, device: h.coordinator.recoveryEntry!, account: h.coordinator.confirmed! };
      const digest = await codec.run({ kind: "hash", input: JSON.stringify(value) });
      const compacted = await snapshotConflictBackup(value, codec, digest);
      expect(compacted).toHaveProperty("compactedFrom", digest);
      await h.runtime.entryStore.create(`conflict:${h.scope.campaignId}:${digest}`, compacted);
      expect(await h.coordinator.focus()).toBe(false); expect(h.session.canExecute).toBe(false);
      await h.session.reconnect();
      expect(h.session.canExecute).toBe(true); expect(h.session.state).toEqual(before);
      expect(h.coordinator.view).toMatchObject({ localDurable: true, pending: true, failure: "network" });
      expect(h.coordinator.recoveryEntry!.recovery!.inFlight).toEqual(frozen);
      expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "mounted-during-outage" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await h.session.durable()).toBe(true); const latest = h.session.state;
      h.failed.clear(); h.clock.advance(300_000); await vi.advanceTimersByTimeAsync(300_000); await h.session.pulse();
      await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ canExecute: true, localDurable: true, pending: false, failure: null }));
      expect(h.reopen).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
      expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
      expect(h.server.operationCount(h.scope.accountId)).toBe(1);
      expect(h.server.account(h.scope.accountId).operations.has(frozen.operationId)).toBe(false);
      const originalWriter = JSON.parse(frozen.requestText).writerGeneration;
      expect(BigInt((await h.runtime.transport.head(h.scope.campaignId)).writerGeneration)).toBeGreaterThan(BigInt(originalWriter));
      const backups = await h.runtime.entryStore.entries();
      expect(backups.some(row => JSON.stringify((row.value as { device?: CloudCacheEntry } | null)?.device?.recovery?.inFlight) === JSON.stringify(frozen))).toBe(true);
      const saved = await h.runtime.transport.load(h.scope.campaignId);
      const verified = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
        expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
      expect(verified.state).toEqual(latest); expect(h.session.state).toEqual(latest);
    } finally { h.session.dispose(); }
  });

  it("keeps incidental closed-session polling quiet but permits one real background-return reopen", async () => {
    const h = await mountedPhone();
    try {
      expect(await h.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
      const closedCalls = h.server.calls.length;
      for (let n = 0; n < 20; n++) { await h.session.foreground(); await h.session.foreground(true); await h.session.pulse(); }
      expect(h.reopen).not.toHaveBeenCalled(); expect(h.server.calls).toHaveLength(closedCalls);
      h.coordinator.markBackground();
      expect(await h.session.foreground()).toBe(true);
      expect(h.reopen.mock.calls).toEqual([[false]]);
      for (let n = 0; n < 20; n++) { await h.session.foreground(); await h.session.pulse(); }
      expect(h.reopen.mock.calls).toEqual([[false]]);
    } finally { h.session.dispose(); }
  });

  it.each(["account-block", "journal-owner", "journal-checksum"] as const)("never restores local admission across a %s fence", async fence => {
    const h = await mountedPhone();
    try {
      h.failed.add("capabilities");
      expect(await h.coordinator.focus()).toBe(false); expect(h.session.canExecute).toBe(false);
      if (fence === "account-block") await h.runtime.entryStore.write("account-command-block", { failure: "revoked" });
      else if (fence === "journal-owner") {
        const data = (await h.cache.journal.read(h.key))!;
        await h.cache.journal.bind(h.key, "another.public.owner", data.head, data.snapshot.seed, data.snapshot.sha256);
      } else {
        const stored = h.cache.journal.data.get(h.key)!;
        stored.snapshots.get(stored.head.snapshotThrough)!.sha256 = "0".repeat(64);
      }
      const checked = await h.session.reconnect();
      expect(h.session.canExecute).toBe(false);
      if (fence === "journal-checksum") {
        expect(h.coordinator.view).toMatchObject({ phase: "blocked", failure: "corrupt" });
        // A real integrity failure is an approved replacement exception. The
        // fake router accepts the request; it grants no local command authority.
        expect(h.reopen.mock.calls).toEqual([[false]]);
      } else { expect(checked).toBe(false); expect(h.reopen).not.toHaveBeenCalled(); }
      expect(await h.runtime.entryStore.read(`offline-base:${h.scope.campaignId}`)).toBeNull();
    } finally { h.session.dispose(); }
  });

  it.each([3, 12])("recovers after %s five-minute windows without a router handoff or engine/journal-owner replacement", async windows => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    vi.spyOn(Math, "random").mockReturnValue(.5);
    const h = await offlinePhone(true);
    const account = await h.server.transport(h.scope.accountId).load(h.scope.campaignId);
    expect(h.selected.confirmedRevision).toBe(account.revision);
    expect(h.selected.confirmed!.snapshot.uncompressedSha256).not.toBe(account.snapshot.uncompressedSha256);
    expect(copyDescendsFrom(h.selected.confirmed!, account)).toBe(true);
    const observed: CloudSyncView[] = [];
    const stop = h.selected.subscribe(() => observed.push(h.selected.view));
    try {
      let expected = h.session.state;
      for (let round = 0; round < windows; round++) {
        const before = h.calls.length;
        await h.window();
        const probes = h.calls.slice(before).filter(row => ["capabilities", "head", "load"].includes(row.method));
        expect(probes.some(row => row.method === "head" && row.result === "network")).toBe(true);
        expect(probes.every((row, i) => row.method === (i % 2 ? "head" : "capabilities"))).toBe(true);
        expect(h.reopen.mock.calls.filter(([checked]) => !checked)).toHaveLength(0);
        expect(h.ports).toHaveLength(1); expect(h.session.canExecute).toBe(true);
        if (round === 0) {
          expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "read-outage.between-retries" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
          expect(await h.session.durable()).toBe(true); expected = h.session.state;
        } else expect(h.session.state).toEqual(expected);
      }
      h.failed.clear();
      await h.window();
      await settleCodec();
      if (process.env.GS_C2_PROOF) console.log("C2_RECOVERY", JSON.stringify({ view: h.session.syncView,
        session: problemDiagnostics.snapshot().health.gameSession, calls: h.calls.slice(-20) }));
      expect(h.reopen.mock.calls.filter(([checked]) => !checked)).toHaveLength(0);
      expect(h.ports).toHaveLength(1); expect(h.ports[0]!.stopped).toBe(false);
      expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
      expect(h.session.state).toEqual(expected);
      await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ canExecute: true, pending: false, localDurable: true, failure: null }));
      expect(h.session.needsReload).toBe(false);
      expect(observed.some(view => ["checking", "closed", "blocked"].includes(view.phase))).toBe(false);
      expect(observed.every(view => view.canExecute)).toBe(true);
      const saved = await h.runtime.transport.load(h.scope.campaignId);
      const verified = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
        expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
      expect(verified.state).toEqual(expected);
    } finally { stop(); h.session.dispose(); }
  });

  it("accepts and durably saves a command during the held recovery lease, without a temporary command fence", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    const h = await offlinePhone(true), started = deferred(), held = deferred();
    const acquire = h.runtime.transport.acquire;
    const lease = vi.spyOn(h.runtime.transport, "acquire").mockImplementation(async request => {
      const response = await acquire(request); started.resolve(); await held.promise; return response;
    });
    let retry: Promise<void> | undefined;
    try {
      h.failed.clear(); h.clock.advance(300_000); await vi.advanceTimersByTimeAsync(300_000);
      retry = h.session.pulse(); await started.promise;
      expect(h.session.canExecute).toBe(true);
      expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "read-outage.during-lease" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await h.session.durable()).toBe(true); const expected = h.session.state;
      held.resolve(); await retry;
      await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ pending: false, localDurable: true, failure: null }));
      expect(h.reopen).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
      expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
      const saved = await h.runtime.transport.load(h.scope.campaignId);
      const verified = await codec.run({ kind: "hydrate", input: { ...saved, expectedRevision: saved.revision,
        expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId } });
      expect(h.session.state).toEqual(expected); expect(verified.state).toEqual(expected);
    } finally { held.resolve(); await retry?.catch(() => {}); lease.mockRestore(); h.session.dispose(); }
  });

  it("allows one replacement for a genuinely different account head, with no automatic replacement storm", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    const h = await offlinePhone(true);
    try {
      const account = await h.server.transport(h.scope.accountId).load(h.scope.campaignId);
      const next = await snapshotCopy({ ...h.session.state, simulationSpeed: 1 }, h.session.metadata, "2", h.clock.wall,
        { branchId: "other-device.public", sequence: 1, parents: [account.snapshot.uncompressedSha256] });
      h.server.seed(h.scope.accountId, next); h.failed.clear();
      // The fake router deliberately leaves the old mounted session alive, as
      // a failed real replacement would. That same proven head gets one attempt.
      for (let round = 0; round < 4; round++) await h.window();
      expect(h.reopen.mock.calls).toEqual([[false]]);
      expect(h.ports).toHaveLength(1); expect(h.session.state.simulationSpeed).toBe(2);
      expect((await h.runtime.transport.load(h.scope.campaignId)).snapshot).toEqual(next.snapshot);
    } finally { h.session.dispose(); }
  });

  it("never takes over another device's active lease during same-head background recovery", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    const h = await offlinePhone(true);
    try {
      h.failed.clear(); const remote = h.server.transport(h.scope.accountId), head = await remote.head(h.scope.campaignId);
      const writer = await remote.acquire({ campaignId: head.campaignId, expectedRevision: head.revision,
        expectedWriterGeneration: head.writerGeneration, operationId: "other-device.public-lease", writerToken: "other-device.public-token", takeover: true });
      // Keep that real foreign lease alive through the next retry.
      const renew = h.runtime.transport.renew;
      const renewOwn = vi.spyOn(h.runtime.transport, "renew");
      h.clock.advance(15_000); await vi.advanceTimersByTimeAsync(15_000); await remote.renew(writer);
      await h.session.pulse();
      expect(renewOwn).not.toHaveBeenCalled();
      expect(h.selected.view).toMatchObject({ canExecute: false, failure: "writer" });
      expect((await remote.head(head.campaignId)).writerGeneration).toBe(writer.writerGeneration);
      expect(h.ports).toHaveLength(1); h.runtime.transport.renew = renew;
    } finally { h.session.dispose(); }
  });

  it("recovers a lost lease response with the exact durable acquisition intent and a fresh token renewal", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    vi.spyOn(Math, "random").mockReturnValue(.5);
    const h = await offlinePhone(true), acquire = vi.spyOn(h.runtime.transport, "acquire");
    const observed: boolean[] = [], stop = h.selected.subscribe(() => observed.push(h.session.canExecute));
    try {
      h.failed.clear(); h.server.faults.push({ method: "acquire", at: "after", error: new CloudSyncError("network") });
      h.clock.advance(300_000); await vi.advanceTimersByTimeAsync(300_000); await h.session.pulse();
      expect(h.session.canExecute).toBe(true); expect(h.selected.view.failure).toBe("network");
      expect(acquire).toHaveBeenCalledOnce(); const original = structuredClone(acquire.mock.calls[0]![0]);
      // Exponential recovery backoff still applies. The granted 60 s token is
      // deliberately almost expired when its lost response is recovered.
      h.clock.advance(55_000); await vi.advanceTimersByTimeAsync(55_000); await h.session.pulse();
      await vi.waitFor(() => expect(h.session.syncView).toMatchObject({ pending: false, localDurable: true, failure: null, canExecute: true }));
      expect(acquire).toHaveBeenCalledTimes(2); expect(acquire.mock.calls[1]![0]).toEqual(original);
      expect(observed.every(Boolean)).toBe(true); expect(h.reopen).not.toHaveBeenCalled(); expect(h.ports).toHaveLength(1);
      expect((await h.cache.journal.head(h.key))!.owner).toBe(h.owner);
      expect(h.server.calls.filter(call => call.method === "acquire" && call.operationId === original.operationId)).toHaveLength(2);
    } finally { stop(); h.session.dispose(); }
  });

  it("clears the account provider's transient list error after background recovery without focus, Retry or refresh", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date", "performance"] });
    vi.spyOn(Math, "random").mockReturnValue(.5);
    const h = await offlinePhone(false), env = phoneTestDom();
    let account!: CloudAccountValue;
    function Probe() { const value = useCloudAccount(); if (value) account = value; return <p>{value?.phase ?? "none"}</p>; }
    try {
      await env.render(<AuthAccountContext.Provider value={h.scope.accountId}><CloudAccountProvider runtime={h.runtime}><Probe /></CloudAccountProvider></AuthAccountContext.Provider>);
      // Native compression and codec replies settle independently of fake time.
      await vi.waitFor(async () => { await act(settleCodec); expect(account!.phase).toBe("error"); });
      expect(account!.error).toBe("network");
      await act(async () => { account!.attach(h.session); });
      for (let round = 0; round < 3; round++) await act(async () => { await h.window(); });
      h.failed.clear();
      await act(async () => { await h.window(); });
      expect(h.selected.view).toMatchObject({ canExecute: true, pending: false, localDurable: true, failure: null });
      expect(account!.error).toBeNull(); expect(account!.phase).toBe("available");
      expect(h.reopen.mock.calls.filter(([checked]) => !checked)).toHaveLength(0);
      expect(h.ports).toHaveLength(1);

      // A new list outage after recovery is not cleared by an ordinary local
      // command or its journal commit using the already-checked old lease.
      h.failed.add("list");
      await act(async () => { await account!.refresh(); });
      expect(account!.error).toBe("network");
      await act(async () => {
        expect(await h.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "read-outage.local-is-not-connectivity" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
        expect(await h.session.durable()).toBe(true);
      });
      expect(account!.error).toBe("network"); expect(account!.phase).toBe("error");
      h.failed.clear();
      await act(async () => { h.clock.advance(15_000); await vi.advanceTimersByTimeAsync(15_000); await h.session.pulse(); });
      expect(account!.error).toBeNull(); expect(account!.phase).toBe("available");

      // Verified connection success is never an authorization-error eraser.
      vi.spyOn(h.runtime.transport, "list").mockRejectedValue(new CloudSyncError("auth"));
      await act(async () => { await account!.refresh(); });
      expect(account!.error).toBe("auth");
      await act(async () => { h.clock.advance(15_000); await vi.advanceTimersByTimeAsync(15_000); await h.session.pulse(); });
      expect(account!.error).toBe("auth"); expect(account!.phase).toBe("error");
    } finally { h.session.dispose(); }
  });
});
