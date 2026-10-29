import { act, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountCampaignRouter } from "./App";
import { AuthAccountContext } from "./auth/AuthAccountContext";
import { CompetitionClientContext } from "./competition/useCompetition";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";
import { CloudAccountContext, type CloudAccountValue } from "./session/cloud/CloudAccount";
import { MemoryCloudEntryStore } from "./session/cloud/entryStorage";
import { deferred, syncFixture, syncHarness } from "./session/cloud/syncTestSupport";
import { encodeCloudEvidenceCheckpoint } from "./session/cloud/codecEvidence";
import type { CloudGameSession } from "./session/cloud/gameSession";
import { CLOUD_CHECK_TIMEOUT_MS } from "./session/cloud/checkDeadline";

vi.mock("./facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });

async function fixture(layout: "phone" | "desktop", marker: boolean, partialSummaries: boolean,
  options: { heldSelection?: ReturnType<typeof deferred>; fakeTimers?: boolean; secondCampaign?: boolean } = {}) {
  const h = await syncHarness(), store = new MemoryCloudEntryStore(), transport = h.server.transport(h.scope.accountId);
  const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: h.prepared.checkpoint, source: h.prepared.sourceRecovery,
    campaign: { ...h.prepared.envelope.campaign, tutorial: { guidance: { version: 2, mode: "off", exposedTopicIds: [] },
      introDismissed: true, dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null } }, operationId: "reopen.fixture", expectedRevision: "1" });
  const confirmed = { ...h.confirmed, snapshot: encoded.snapshot }; h.server.seed(h.scope.accountId, confirmed);
  if (options.secondCampaign) {
    const second = await syncFixture("manual.other-clinic");
    const copy = await encodeCloudEvidenceCheckpoint({ checkpoint: second.prepared.checkpoint, source: second.prepared.sourceRecovery,
      campaign: { ...second.prepared.envelope.campaign, name: "Manual clinic", tutorial: { ...h.prepared.envelope.campaign.tutorial,
        guidance: { version: 2, mode: "off", exposedTopicIds: [] } } }, operationId: "manual.fixture", expectedRevision: "1" });
    h.server.seed(h.scope.accountId, { ...second.confirmed, snapshot: copy.snapshot });
  }
  await h.cache.write({ schemaVersion: 1, scope: h.scope, confirmed, recovery: null }, null);
  if (marker) await store.write("last-active-campaign", { campaignId: h.scope.campaignId });
  const read = store.read.bind(store), readSelection = deferred(), inventoryRead = deferred(), inventory = h.cache.accountEntries!.bind(h.cache);
  vi.spyOn(store, "read").mockImplementation(async key => {
    if (key === "last-active-campaign") { readSelection.resolve(); await options.heldSelection?.promise; }
    return read(key);
  });
  vi.spyOn(h.cache, "accountEntries").mockImplementation(async scope => { const rows = await inventory(scope); inventoryRead.resolve(); return rows; });
  const env = phoneTestDom(); Object.assign(env.browser.location, { search: `?layout=${layout}` });
  Object.assign(env.doc, { visibilityState: "visible" }); Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
  let active: CloudGameSession | null = null, publish!: (rows: CloudAccountValue["summaries"]) => void;
  let goToList: (() => void) | null = null;
  const complete = await transport.list();
  function Provider() {
    const [summaries, setSummaries] = useState<CloudAccountValue["summaries"]>(partialSummaries ? [] : complete); publish = setSummaries;
    const account: CloudAccountValue = { runtime: { ...h.scope, region: "Synthetic", transport, cache: h.cache, entryStore: store },
      access, summaries, phase: "available", error: null, active: null, refresh: async () => {}, acceptNotice: async () => {},
      attach: session => { active = session; }, stop: async () => {}, requestDeletion: async () => {}, exportDeviceRecovery: async () => "",
      clearDevice: async () => {}, showCampaigns: () => goToList?.(), setCampaignNavigation: handler => { goToList = handler; } };
    // The runtime has stable identity just as BoundCloudAccount's scoped runtime.
    account.runtime = runtime;
    return <CloudAccountContext.Provider value={account}><AccountCampaignRouter /></CloudAccountContext.Provider>;
  }
  const access = await transport.capabilities(), runtime = { ...h.scope, region: "Synthetic", transport, cache: h.cache, entryStore: store };
  if (options.fakeTimers) vi.useFakeTimers();
  await env.render(<AuthAccountContext.Provider value={h.scope.accountId}><CompetitionClientContext.Provider value={null}><Provider /></CompetitionClientContext.Provider></AuthAccountContext.Provider>);
  const playing = () => vi.waitFor(async () => { await act(async () => {}); expect(active?.canExecute).toBe(true); }, { timeout: 5_000 });
  return { ...h, store, transport, env, readSelection, inventoryRead, complete, playing, get active() { return active; },
    publish: () => publish([...complete]) };
}

describe.each(["phone", "desktop"] as const)("%s asynchronous automatic reopen", layout => {
  it.each([true, false])("reopens when access is available before campaign summaries (marker=%s)", async marker => {
    const f = await fixture(layout, marker, true);
    await f.readSelection.promise;
    // Commit access with an empty list separately from the later list response.
    // An empty early list is not a completed automatic-selection attempt.
    await f.inventoryRead.promise;
    // Complete the IDB job and its Promise continuations before publishing the
    // later response. This is an event-loop boundary, not a timing sleep.
    await act(async () => { await new Promise<void>(resolve => setImmediate(resolve)); });
    await act(async () => f.publish());
    await f.playing();
    expect(f.active!.coordinator.scope.campaignId).toBe(f.scope.campaignId);
    expect(f.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
  }, 15_000);

  it("manual Resume of another clinic cancels a late automatic-selection read", async () => {
    const held = deferred(), f = await fixture(layout, true, false, { heldSelection: held, secondCampaign: true });
    try {
      await f.readSelection.promise;
      await vi.waitFor(async () => { await act(async () => {}); expect(f.env.button("Resume Manual clinic").attributes.disabled).toBeUndefined(); });
      await f.env.click("Resume Manual clinic"); await f.playing();
      expect(f.active!.coordinator.scope.campaignId).toBe("manual.other-clinic");
      await act(async () => { held.resolve(); await new Promise<void>(resolve => setImmediate(resolve)); f.publish(); });
      expect(f.active!.coordinator.scope.campaignId).toBe("manual.other-clinic");
      expect(f.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
      expect(await f.store.read("last-active-campaign")).toEqual({ campaignId: "manual.other-clinic" });
    } finally { held.resolve(); }
  });

  it("bounds repeated unavailable reads despite summary updates; late replies cannot open and manual Resume still works", async () => {
    const held = deferred(), f = await fixture(layout, true, false, { heldSelection: held, fakeTimers: true });
    try {
      await f.readSelection.promise;
      await act(async () => { await vi.advanceTimersByTimeAsync(10_000); f.publish(); });
      await act(async () => { await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS - 10_000); });
      expect(f.active).toBeNull(); expect(f.server.calls.some(call => call.method === "acquire")).toBe(false);
      vi.useRealTimers();
      await act(async () => { held.resolve(); await new Promise<void>(resolve => setImmediate(resolve)); f.publish(); });
      expect(f.active).toBeNull();
      await f.env.click(`Resume ${f.prepared.envelope.campaign.name}`); await f.playing();
      expect(f.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    } finally { held.resolve(); vi.useRealTimers(); }
  });
});
