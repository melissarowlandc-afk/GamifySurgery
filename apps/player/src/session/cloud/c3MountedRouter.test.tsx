import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { AccountCampaignRouter } from "../../App";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { CompetitionClientContext } from "../../competition/useCompetition";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CloudAccountContext, type CloudAccountValue } from "./CloudAccount";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { deferred } from "./syncTestSupport";
import { CloudSyncError, type CloudTransport } from "./transport";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudCache } from "./cache";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { isDeepStrictEqual } from "node:util";
import { runCloudCodecTask } from "./codecTasks";
import type { ProtectedClinicCopy } from "./retainedCopies";

vi.mock("../../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Fixture map</div> }));
vi.mock("../../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); vi.useRealTimers(); });

it("defers an automatic replacement when real selection can only open offline, then selects the newer account exactly once", async () => {
  const h = await operationalSessionFixture({}, undefined, false); h.session.dispose();
  const entryStore = new MemoryCloudEntryStore(), failed = new Set<string>(), listStarted = deferred(), held = deferred();
  let holdList = false;
  const transport = new Proxy(h.server.transport(h.scope.accountId), { get(target, key) {
    const method = Reflect.get(target, key);
    return typeof method !== "function" ? method : async (...args: unknown[]) => {
      if (key === "list" && holdList) { listStarted.resolve(); await held.promise; }
      if (failed.has(String(key))) throw new CloudSyncError("network");
      return method.apply(target, args);
    };
  } }) as CloudTransport;
  await entryStore.write("last-active-campaign", { campaignId: h.scope.campaignId });
  const env = phoneTestDom(); env.browser.location.search = "?layout=phone";
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: () => 1, clearInterval: () => {} });
  let active: CloudGameSession | null = null;
  const openingFailures: unknown[] = [];
  const attach = vi.fn((session: CloudGameSession | null) => { active = session; });
  const account: CloudAccountValue = { runtime: { ...h.scope, region: "Synthetic", cache: h.cache, entryStore, transport,
    onOpeningDiagnostic: failure => { if (failure) openingFailures.push(failure); } },
    access: await transport.capabilities(), summaries: await transport.list(), phase: "available", error: null,
    active: null, attach, refresh: vi.fn(async () => {}), acceptNotice: vi.fn(async () => {}), stop: vi.fn(async () => {}),
    requestDeletion: vi.fn(async () => {}), exportDeviceRecovery: vi.fn(async () => ""), clearDevice: vi.fn(async () => {}),
    showCampaigns: vi.fn(), setCampaignNavigation: vi.fn() };
  const create = vi.spyOn(CloudGameSession, "create");
  let retry: Promise<boolean> | undefined;
  try {
    await env.render(<AuthAccountContext.Provider value={h.scope.accountId}><CompetitionClientContext.Provider value={null}>
      <CloudAccountContext.Provider value={account}><AccountCampaignRouter /></CloudAccountContext.Provider>
    </CompetitionClientContext.Provider></AuthAccountContext.Provider>);
    await vi.waitFor(async () => { await act(async () => {}); expect(active?.canExecute).toBe(true); }, { timeout: 5_000 });
    await vi.waitFor(() => expect(active!.syncView.pending).toBe(false));
    const original = active!, key = cloudCampaignStorageKey(h.scope);
    const owner = (await h.cache.journal.head(key))!.owner;
    await act(async () => {
      expect(await original.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "c3-original-local-branch" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await original.durable()).toBe(true);
    });
    const localState = original.state;
    // A genuine second device advances the revision AND writer generation;
    // replacing the fake server's seed would incorrectly reset its CAS fence.
    const remote = new CloudSyncCoordinator({ scope: h.scope, cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore(),
      transport: h.server.transport(h.scope.accountId), clock: h.clock, enabled: true });
    expect(await remote.open()).toBe(true); expect(await remote.startWriter(true)).toBe(true); expect(remote.resume()).toBe(true);
    const remoteSession = await CloudGameSession.create(remote, undefined, undefined, { operational: false });
    expect(remoteSession.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "c3-real-other-device" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(remoteSession.execute({ type: "SET_PAUSED", paused: false, operationId: "c3-real-other-unpause" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(remoteSession.execute({ type: "ADVANCE_TICK", operationId: "c3-real-other-tick" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await remoteSession.checkpointNow("purchase")).toBe(true); remoteSession.dispose(); h.clock.advance(61_000);
    const created = create.mock.calls.length;
    failed.add("list"); holdList = true;
    await act(async () => { retry = original.reconnect(); await listStarted.promise; });
    expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Loading clinic")).toHaveLength(0);
    held.resolve(); holdList = false; await act(async () => { await retry; });
    expect(active === original).toBe(true); expect(create.mock.calls).toHaveLength(created);
    expect((await h.cache.journal.head(key))!.owner).toBe(owner);
    for (let n = 0; n < 3; n++) { await act(async () => { await original.reconnect(); }); expect(active).toBe(original); }
    expect(create.mock.calls).toHaveLength(created);
    failed.clear();
    await act(async () => { await original.reconnect(); });
    await vi.waitFor(() => { expect(active).not.toBe(original); expect(active!.canExecute).toBe(true); });
    expect(create.mock.calls).toHaveLength(created + 1); expect(active!.state.simulationSpeed).toBe(4);
    const stable = active!;
    for (let n = 0; n < 3; n++) { await act(async () => { await stable.reconnect(); }); expect(active).toBe(stable); }
    expect(create.mock.calls).toHaveLength(created + 1);
    // Real automatic selection protects a divergent/older device copy before
    // replacement. This assertion uses its actual entry store, not a router spy.
    const protectedCopies = (await entryStore.entries()).filter(row => row.key.startsWith("older-copy:"));
    let exactLocalCopy = false;
    for (const row of protectedCopies) {
      const copy = (row.value as ProtectedClinicCopy).copy;
      const loaded = await runCloudCodecTask({ kind: "hydrate", input: { ...copy, expectedRevision: copy.revision,
        expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId } });
      if (isDeepStrictEqual(loaded.state, localState)) exactLocalCopy = true;
    }
    expect(exactLocalCopy).toBe(true);
  } finally { held.resolve(); await retry?.catch(() => {}); await act(async () => { (active as CloudGameSession | null)?.dispose(); }); }
});
