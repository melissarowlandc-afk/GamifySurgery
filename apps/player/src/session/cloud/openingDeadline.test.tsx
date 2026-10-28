import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { AccountCampaignRouter } from "../../App";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { CompetitionClientContext } from "../../competition/useCompetition";
import { cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { CloudAccountContext, type CloudAccountValue } from "./CloudAccount";
import { MemoryCloudCache } from "./cache";
import { CLOUD_CHECK_TIMEOUT_MS } from "./checkDeadline";
import { CloudCodecError } from "./codecJson";
import { cloudCodec, CLOUD_WORKER_STARTUP_TIMEOUT_MS, CLOUD_WORKER_TASK_TIMEOUT_MS } from "./codecWorker";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { deferred, syncHarness } from "./syncTestSupport";

vi.mock("../../facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("../../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
afterEach(async () => { vi.useRealTimers(); vi.restoreAllMocks(); await cleanupPhoneTests(); });

async function otherDevice() {
  const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
  const owner = await CloudGameSession.create(h.coordinator);
  owner.updateMetadata({ ...owner.metadata, tutorial: { guidance: { version: 2, mode: "off", exposedTopicIds: [] },
    introDismissed: true, dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null } });
  await owner.checkpointNow("purchase");
  const transport = h.server.transport(h.scope.accountId), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const make = () => new CloudSyncCoordinator({ scope: h.scope, transport, cache, entryStore, enabled: true, clock: h.clock });
  return { ...h, transport, cache, entryStore, make };
}
async function renderOtherDevice(layout: "phone" | "desktop", h: Awaited<ReturnType<typeof otherDevice>>) {
  const env = phoneTestDom(); Object.assign(env.browser.location, { search: `?layout=${layout}`, href: `http://127.0.0.1:4173/?layout=${layout}` });
  Object.assign(env.doc, { visibilityState: "visible" }); Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
  let active: CloudAccountValue["active"] = null;
  const account: CloudAccountValue = {
    runtime: { ...h.scope, region: "Synthetic", transport: h.transport, cache: h.cache, entryStore: h.entryStore },
    access: await h.transport.capabilities(), summaries: await h.transport.list(), phase: "available", error: null, active: null,
    refresh: vi.fn(async () => {}), acceptNotice: vi.fn(async () => {}), attach: session => { active = session; }, stop: vi.fn(async () => {}),
    requestDeletion: vi.fn(async () => {}), exportDeviceRecovery: vi.fn(async () => ""), clearDevice: vi.fn(async () => {}),
    showCampaigns: vi.fn(), setCampaignNavigation: vi.fn(),
  };
  await env.render(<AuthAccountContext.Provider value={h.scope.accountId}><CompetitionClientContext.Provider value={null}>
    <CloudAccountContext.Provider value={account}><AccountCampaignRouter /></CloudAccountContext.Provider>
  </CompetitionClientContext.Provider></AuthAccountContext.Provider>);
  const resume = `Resume ${h.prepared.envelope.campaign.name}`;
  const ready = async () => vi.waitFor(async () => { await act(async () => {}); expect(env.button(resume).attributes.disabled).toBeUndefined(); }, { timeout: 5_000 });
  const choice = async () => vi.waitFor(async () => { await act(async () => {}); expect(env.element.textContent).toContain("This campaign is open somewhere else."); }, { timeout: 5_000 });
  return { env, resume, ready, choice, get active() { return active; } };
}

describe.each(["phone", "desktop"] as const)("%s bounded account opening", layout => {
  it("keeps a failed warmup visible and retries before offering the other-writer choice", async () => {
    const h = await otherDevice(), run = cloudCodec.run.bind(cloudCodec);
    let fail = true;
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "hash" && task.input === "" && fail) throw new CloudCodecError("worker_unavailable", "Worker startup failed");
      return run(task);
    });
    const f = await renderOtherDevice(layout, h);
    await vi.waitFor(() => expect(f.env.element.textContent).toContain("Clinic preparation could not finish"));
    expect(f.env.button(f.resume).attributes.disabled).toBeDefined(); expect(f.active).toBeNull();
    fail = false; await f.env.click("Retry clinic preparation"); await f.ready();
    await f.env.click(f.resume); await f.choice();
    expect(f.active!.canExecute).toBe(false); expect(f.active!.coordinator.view.failure).toBe("writer-elsewhere");
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!.generation).toBe(1n);
    await f.env.click("Continue on this device");
    await vi.waitFor(() => expect(f.active!.canExecute).toBe(true));
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!.generation).toBe(2n);
    expect(await h.coordinator.focus()).toBe(false); expect(h.coordinator.view.canExecute).toBe(false);
  });

  it("bounds a preparation that never settles and offers Retry without opening a writer", async () => {
    const h = await otherDevice(), held = deferred(), started = deferred(), run = cloudCodec.run.bind(cloudCodec);
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "hash" && task.input === "") { started.resolve(); await held.promise; }
      return run(task);
    });
    vi.useFakeTimers();
    const f = await renderOtherDevice(layout, h); await started.promise;
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOUD_WORKER_STARTUP_TIMEOUT_MS + CLOUD_WORKER_TASK_TIMEOUT_MS); });
    expect(f.env.element.textContent).toContain("Clinic preparation could not finish");
    expect(f.env.button("Retry clinic preparation").attributes.disabled).toBeUndefined();
    expect(f.env.button(f.resume).attributes.disabled).toBeDefined();
    vi.useRealTimers();
    await act(async () => { held.resolve(); });
    expect(f.env.element.textContent).toContain("Clinic preparation could not finish");
    await f.env.click("Retry clinic preparation"); await f.ready(); expect(f.active).toBeNull();
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
  });

  it.each(["deadline", "back"] as const)("fences an uncompleted opening on %s and a later reply cannot replace the explicit choice", async exit => {
    const h = await otherDevice(), f = await renderOtherDevice(layout, h); await f.ready();
    const held = deferred(), started = deferred(), head = h.transport.head.bind(h.transport); let first = true;
    vi.spyOn(h.transport, "head").mockImplementation(async id => {
      if (first) { first = false; started.resolve(); await held.promise; }
      return head(id);
    });
    vi.useFakeTimers(); await f.env.click(f.resume); await started.promise;
    expect(f.env.element.textContent).toContain("Checking account save");
    expect(f.env.button("Back to your clinics").attributes.disabled).toBeUndefined();
    if (exit === "deadline") await act(async () => { await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS); });
    else await f.env.click("Back to your clinics");
    expect(f.env.element.textContent).toContain("Your campaigns");
    if (exit === "deadline") expect(f.env.element.textContent).toContain("Your saved copies have been kept");
    vi.useRealTimers(); await f.ready(); await f.env.click(f.resume); await f.choice();
    const opened = f.active; expect(opened!.canExecute).toBe(false);
    await act(async () => { held.resolve(); await held.promise; });
    expect(f.active).toBe(opened); expect(f.active!.canExecute).toBe(false);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
  });
});

describe("bounded coordinator checks", () => {
  it("retains an accepted command queued behind a frozen upload when a foreground check times out", async () => {
    const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    const session = await CloudGameSession.create(h.coordinator);
    session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "queued.first" }, PROTOTYPE_DOMAIN_CONTEXT); await session.durable();
    const held = deferred(), freezing = deferred(), staged = deferred(), run = cloudCodec.run.bind(cloudCodec);
    let first = true;
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "freeze" && first) { first = false; freezing.resolve(); await held.promise; } return run(task);
    });
    const checkpoint = h.coordinator.checkpoint(); await freezing.promise;
    const stage = h.coordinator.stage.bind(h.coordinator);
    vi.spyOn(h.coordinator, "stage").mockImplementation((...args) => { staged.resolve(); return stage(...args); });
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "queued.second" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    await staged.promise;
    vi.useFakeTimers(); const checking = h.coordinator.focus();
    await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS); expect(await checking).toBe(false);
    vi.useRealTimers(); held.resolve(); expect(await checkpoint).toBe(false);
    expect(await session.durable()).toBe(true);
    expect(await session.reconnect()).toBe(true); expect(await session.checkpointNow("purchase")).toBe(true);
    session.dispose();
    const next = new CloudSyncCoordinator({ scope: h.scope, cache: h.cache, transport: h.server.transport(h.scope.accountId), enabled: true, clock: h.clock });
    expect(await next.open()).toBe(true);
    const reloaded = await CloudGameSession.create(next); expect(reloaded.state.simulationSpeed).toBe(4);
    expect(next.view.pending).toBe(false); expect(h.server.operationCount(h.scope.accountId)).toBe(2);
    reloaded.dispose();
  });
  it("resolves a timed-out explicit acquisition with its original proof, fencing the late response", async () => {
    const h = await otherDevice(), next = h.make(); await next.open();
    const acquire = h.transport.acquire.bind(h.transport), held = deferred(), started = deferred();
    const requests: Parameters<typeof acquire>[0][] = [];
    vi.spyOn(h.transport, "acquire").mockImplementation(async input => {
      requests.push(structuredClone(input)); const result = await acquire(input);
      if (requests.length === 1) { started.resolve(); await held.promise; } return result;
    });
    vi.useFakeTimers(); const continuing = next.startWriter(true); await started.promise;
    await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS); expect(await continuing).toBe(false);
    expect(next.view.canExecute).toBe(false);
    vi.useRealTimers(); expect(await next.focus()).toBe(true);
    expect(requests).toHaveLength(2); expect(requests[1]).toEqual(requests[0]);
    expect(h.server.account(h.scope.accountId).campaigns.get(h.scope.campaignId)!.generation).toBe(2n);
    held.resolve(); await held.promise;
    expect(next.view).toMatchObject({ canExecute: true, failure: null });
    next.dispose(); h.coordinator.dispose();
  });

  it("reports an unavailable worker as processing, without misclassifying a valid head as corrupt", async () => {
    const h = await otherDevice(), next = h.make(), run = cloudCodec.run.bind(cloudCodec);
    const load = vi.spyOn(h.transport, "load");
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "verify") throw new CloudCodecError("worker_unavailable", "Worker unavailable"); return run(task);
    });
    expect(await next.open()).toBe(false); expect(next.view).toMatchObject({ failure: "processing", canExecute: false });
    expect(load).toHaveBeenCalledExactlyOnceWith(h.scope.campaignId, "2");
    next.dispose(); h.coordinator.dispose();
  });
  it("offers a choice immediately for a cached account copy with an unproven active writer", async () => {
    const h = await otherDevice(), preview = h.make(); await preview.open(); preview.dispose();
    const next = h.make(); expect(await next.open()).toBe(true); expect(await next.focus()).toBe(false);
    expect(next.view).toMatchObject({ phase: "readonly", failure: "writer-elsewhere", canExecute: false, pending: false });
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    next.dispose(); h.coordinator.dispose();
  });
  it.each(["capabilities", "read", "head", "load", "verify", "write"] as const)("a missing %s completion cannot hold an opening or claim the other writer", async boundary => {
    const h = await otherDevice(), coordinator = h.make(), held = deferred(), started = deferred();
    const hold = async () => { started.resolve(); await held.promise; };
    if (boundary === "capabilities") { const real = h.transport.capabilities.bind(h.transport); vi.spyOn(h.transport, "capabilities").mockImplementation(async () => { await hold(); return real(); }); }
    if (boundary === "read") { const real = h.cache.read.bind(h.cache); vi.spyOn(h.cache, "read").mockImplementation(async (...args) => { await hold(); return real(...args); }); }
    if (boundary === "head") { const real = h.transport.head.bind(h.transport); vi.spyOn(h.transport, "head").mockImplementation(async (...args) => { await hold(); return real(...args); }); }
    if (boundary === "load") { const real = h.transport.load.bind(h.transport); vi.spyOn(h.transport, "load").mockImplementation(async (...args) => { await hold(); return real(...args); }); }
    if (boundary === "verify") { const real = cloudCodec.run.bind(cloudCodec); vi.spyOn(cloudCodec, "run").mockImplementation(async task => { if (task.kind === "verify") await hold(); return real(task); }); }
    if (boundary === "write") { const real = h.cache.write.bind(h.cache); vi.spyOn(h.cache, "write").mockImplementation(async (...args) => { await hold(); return real(...args); }); }
    vi.useFakeTimers(); const opening = coordinator.open();
    // Codec compression/IDB use real async jobs; no polling or fixed delay.
    await started.promise;
    await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS);
    expect(await opening).toBe(false); expect(coordinator.view).toMatchObject({ phase: "waiting", failure: "network", canExecute: false });
    vi.useRealTimers(); vi.restoreAllMocks();
    expect(await coordinator.open()).toBe(true); expect(await coordinator.focus()).toBe(false);
    expect(coordinator.view).toMatchObject({ phase: "readonly", failure: "writer-elsewhere", canExecute: false });
    held.resolve(); await held.promise;
    expect(coordinator.view.canExecute).toBe(false);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    coordinator.dispose(); h.coordinator.dispose();
  });

  it("releases a coalesced foreground check after its deadline; a later callback cannot grant play", async () => {
    const h = await otherDevice(), coordinator = h.make(); await coordinator.open();
    const held = deferred(), started = deferred();
    const unsubscribe = coordinator.beforeReconnect(async () => { started.resolve(); await held.promise; return true; });
    vi.useFakeTimers(); const first = coordinator.focus(); expect(coordinator.focus()).toBe(first); await started.promise;
    await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS); expect(await first).toBe(false);
    vi.useRealTimers(); unsubscribe();
    expect(await coordinator.focus()).toBe(false); expect(coordinator.view.failure).toBe("writer-elsewhere");
    held.resolve(); await held.promise;
    expect(coordinator.view.canExecute).toBe(false);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    coordinator.dispose(); h.coordinator.dispose();
  });
});
