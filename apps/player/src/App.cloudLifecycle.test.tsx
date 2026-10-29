import { act, StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { AccountCampaignRouter } from "./App";
import { AuthAccountContext } from "./auth/AuthAccountContext";
import { CompetitionClientContext } from "./competition/useCompetition";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";
import { CloudAccountContext, type CloudAccountValue } from "./session/cloud/CloudAccount";
import { CloudSyncCoordinator } from "./session/cloud/coordinator";
import { MemoryCloudCache } from "./session/cloud/cache";
import { MemoryCloudEntryStore } from "./session/cloud/entryStorage";
import { CloudGameSession } from "./session/cloud/gameSession";
import { deferred, syncFixture, syncHarness } from "./session/cloud/syncTestSupport";
import { cloudCodec } from "./session/cloud/codecWorker";
import { encodeCloudEvidenceCheckpoint } from "./session/cloud/codecEvidence";

vi.mock("./facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });

describe.each(["phone", "desktop"] as const)("%s account campaign reopen", layout => {
  it.each([true, false])("keeps both divergent copies with an available account slot=%s", async freeSlot => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore(), transport = h.server.transport(h.scope.accountId);
    const first = new CloudSyncCoordinator({ scope: h.scope, transport, cache: h.cache, entryStore, enabled: true, clock: h.clock });
    await first.open(); const local = await CloudGameSession.create(first); await local.reconnect();
    const noGuidance = { guidance: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] }, introDismissed: true,
      dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null };
    local.updateMetadata({ ...local.metadata, tutorial: noGuidance });
    local.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "app.local-branch" }, PROTOTYPE_DOMAIN_CONTEXT);
    local.execute({ type: "SET_PAUSED", paused: false, operationId: "app.local-start" }, PROTOTYPE_DOMAIN_CONTEXT);
    local.execute({ type: "ADVANCE_TICK", advancedAtRealMs: 0, operationId: "app.local-tick" }, PROTOTYPE_DOMAIN_CONTEXT);
    await local.durable(); local.dispose();
    const other = new CloudSyncCoordinator({ scope: h.scope, transport, cache: new MemoryCloudCache(), enabled: true, clock: h.clock });
    await other.open(); await other.startWriter(true); other.resume();
    const remote = await CloudGameSession.create(other); remote.updateMetadata({ ...remote.metadata, tutorial: noGuidance });
    remote.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "app.remote-branch" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await remote.checkpointNow("purchase")).toBe(true);
    const accountSave = structuredClone(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!);
    if (!freeSlot) {
      const unrelated = await syncFixture("app.other-slot");
      const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: unrelated.prepared.checkpoint,
        campaign: { ...unrelated.prepared.envelope.campaign, name: "Other clinic" }, source: unrelated.prepared.sourceRecovery,
        operationId: "unrelated.name", expectedRevision: "1" });
      h.server.seed(h.scope.accountId, { ...unrelated.confirmed, snapshot: encoded.snapshot });
    }
    const env = phoneTestDom(); Object.assign(env.browser.location, { search: `?layout=${layout}`, href: `http://127.0.0.1:4173/?layout=${layout}` });
    Object.assign(env.doc, { visibilityState: "visible" }); Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
    let active: CloudGameSession | null = null;
    const account: CloudAccountValue = {
      runtime: { ...h.scope, region: "Synthetic", transport, cache: h.cache, entryStore }, access: await transport.capabilities(),
      summaries: await transport.list(), phase: "available", error: null, active: null, refresh: vi.fn(async () => {}),
      acceptNotice: vi.fn(async () => {}), attach: session => { active = session; }, stop: vi.fn(async () => {}),
      requestDeletion: vi.fn(async () => {}), exportDeviceRecovery: vi.fn(async () => ""), clearDevice: vi.fn(async () => {}),
      showCampaigns: vi.fn(), setCampaignNavigation: vi.fn(),
    };
    await env.render(<AuthAccountContext.Provider value={h.scope.accountId}><CompetitionClientContext.Provider value={null}>
      <CloudAccountContext.Provider value={account}><AccountCampaignRouter /></CloudAccountContext.Provider>
    </CompetitionClientContext.Provider></AuthAccountContext.Provider>);
    await vi.waitFor(async () => { await act(async () => {}); expect(active?.canExecute).toBe(true); }, { timeout: 5_000 });
    expect(active!.coordinator.scope.campaignId).not.toBe(h.scope.campaignId);
    expect(active!.state.simulationSpeed).toBe(2);
    expect(active!.metadata.name).toBe(h.prepared.envelope.campaign.name);
    expect(await entryStore.read("last-active-campaign")).toEqual({ campaignId: active!.state.campaignId });
    expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")).toHaveLength(0);
    expect(env.element.textContent).not.toContain("Keep both");
    expect((await entryStore.entries()).some(row => row.key.startsWith("conflict:"))).toBe(true);
    if (freeSlot) {
      const archived = h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!;
      expect(archived.confirmed.evidence).toEqual(accountSave.confirmed.evidence);
      expect((await transport.list()).find(row => row.campaignId === h.scope.campaignId)).toMatchObject({ status: "archived", name: expect.stringContaining("(older copy)") });
    } else {
      expect(h.server.account(h.scope.accountId).campaigns.has(h.scope.campaignId)).toBe(false);
      expect(h.server.account(h.scope.accountId).campaigns.has("app.other-slot")).toBe(true);
      expect((await entryStore.entries()).filter(row => row.key.startsWith("older-copy:")).some(row =>
        JSON.stringify((row.value as any).copy.evidence) === JSON.stringify(accountSave.confirmed.evidence))).toBe(true);
    }
    expect(h.server.usageCount(h.scope.accountId)).toBe(0);
  });

  it.each([false, true, "manual", "warmup"] as const)("opens and uploads its newest retained campaign (selection marker=%s)", async marker => {
    const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
    const selection = deferred(), read = entryStore.read.bind(entryStore); let selectionReads = 0;
    vi.spyOn(entryStore, "read").mockImplementation(async key => {
      if (key === "last-active-campaign") { selectionReads++; if (marker === "manual") await selection.promise; }
      return read(key);
    });
    const transport = h.server.transport(h.scope.accountId);
    const previous = new CloudSyncCoordinator({ scope: h.scope, transport, cache: h.cache, entryStore, enabled: true, clock: h.clock });
    await previous.open(); const priorSession = await CloudGameSession.create(previous); await priorSession.reconnect();
    priorSession.updateMetadata({ ...priorSession.metadata, tutorial: { guidance: { version: 2, mode: "off", exposedTopicIds: [] },
      introDismissed: true, dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null } });
    priorSession.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "router.pending" }, PROTOTYPE_DOMAIN_CONTEXT);
    await priorSession.durable(); priorSession.dispose();
    if (marker === true) await entryStore.write("last-active-campaign", { campaignId: h.scope.campaignId });
    const preparation = deferred(), processCodec = cloudCodec.run.bind(cloudCodec);
    if (marker === "warmup") vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "hash" && task.input === "") await preparation.promise;
      return processCodec(task);
    });
    const env = phoneTestDom(); Object.assign(env.browser.location, { search: `?layout=${layout}`, href: `http://127.0.0.1:4173/?layout=${layout}` });
    Object.assign(env.doc, { visibilityState: "visible" });
    Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
    let active: CloudGameSession | null = null;
    let campaigns: (() => void) | null = null;
    const account: CloudAccountValue = {
      runtime: { ...h.scope, region: "Synthetic", transport, cache: h.cache, entryStore },
      access: await transport.capabilities(), summaries: await transport.list(), phase: "available", error: null, active: null,
      refresh: vi.fn(async () => {}), acceptNotice: vi.fn(async () => {}), attach: session => { active = session; },
      stop: vi.fn(async () => {}), requestDeletion: vi.fn(async () => {}), exportDeviceRecovery: vi.fn(async () => ""),
      clearDevice: vi.fn(async () => {}), showCampaigns: () => campaigns?.(), setCampaignNavigation: callback => { campaigns = callback; },
    };
    await env.render(<StrictMode><AuthAccountContext.Provider value={h.scope.accountId}><CompetitionClientContext.Provider value={null}>
      <CloudAccountContext.Provider value={account}><AccountCampaignRouter /></CloudAccountContext.Provider>
    </CompetitionClientContext.Provider></AuthAccountContext.Provider></StrictMode>);
    if (marker === "warmup") {
      expect(active).toBeNull(); expect(env.element.textContent).toContain("Getting your campaigns ready");
      expect(env.button(`Resume ${h.prepared.envelope.campaign.name}`).attributes.disabled).toBeDefined();
      expect(h.server.operationCount(h.scope.accountId)).toBe(0);
      await act(async () => { preparation.resolve(); await preparation.promise; });
    }
    if (marker === "manual") {
      await vi.waitFor(() => expect(selectionReads).toBeGreaterThan(0));
      await env.click(`Resume ${h.prepared.envelope.campaign.name}`);
    }
    await vi.waitFor(async () => { await act(async () => {}); expect(active?.canExecute).toBe(true); }, { timeout: 5_000 });
    expect(active!.state.simulationSpeed).toBe(2);
    await vi.waitFor(() => expect(active!.coordinator.confirmedRevision).toBe("2"));
    expect(active!.coordinator.view.pending).toBe(false); expect(active!.coordinator.confirmedRevision).toBe("2");
    expect(allElements(env.doc.body, node => node.tagName === "DIALOG" && node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
    expect(env.element.textContent).not.toContain("Continue on this device?");
    expect(await read("last-active-campaign")).toEqual({ campaignId: h.scope.campaignId });
    expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    if (marker === "manual") {
      const beforeNavigation = selectionReads;
      await act(async () => { account.showCampaigns(); });
      await vi.waitFor(() => expect(env.element.textContent).toContain("Resume a previous campaign"));
      expect(selectionReads).toBe(beforeNavigation);
      await act(async () => { selection.resolve(); await selection.promise; });
      expect(env.element.textContent).toContain("Resume a previous campaign");
    }
  });
});
