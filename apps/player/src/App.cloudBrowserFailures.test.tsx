import { act, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { AccountCampaignRouter } from "./App";
import { AuthAccountActionsContext, AuthAccountContext } from "./auth/AuthAccountContext";
import { CompetitionClientContext } from "./competition/useCompetition";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";
import { CloudAccountProvider, useCloudAccount, type CloudAccountValue } from "./session/cloud/CloudAccount";
import { IndexedDbCloudCache } from "./session/cloud/cache";
import { IndexedDbCloudEntryStore } from "./session/cloud/entryStorage";
import { CloudGameSession } from "./session/cloud/gameSession";
import { deferred, syncHarness } from "./session/cloud/syncTestSupport";
import { createQaDeviceCampaign } from "./qa/cloudSavesQaSeed";
import { cloudCodec } from "./session/cloud/codecWorker";
import { CLOUD_CHECK_TIMEOUT_MS } from "./session/cloud/checkDeadline";

vi.mock("./facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });

async function fixture(layout: "phone" | "desktop") {
  const env = phoneTestDom(), values = new Map<string, string>(), factory = new IDBFactory();
  vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key),
    key: (index: number) => [...values.keys()][index] ?? null, get length() { return values.size; } } });
  createQaDeviceCampaign("account-a");
  const profile = JSON.parse(values.get("gamify-surgery.prototype.profile.v1.account.account-a")!);
  const h = await syncHarness({ campaignId: profile.activeCampaignId });
  h.server.account(h.scope.accountId).campaigns.clear();
  const cache = new IndexedDbCloudCache(factory), entryStore = new IndexedDbCloudEntryStore(h.scope, factory);
  const runtime = { ...h.scope, region: "Synthetic", cache, entryStore, transport: h.server.transport(h.scope.accountId) };
  Object.assign(env.browser.location, { search: `?layout=${layout}`, href: `http://127.0.0.1:5184/?layout=${layout}` });
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
  let cloud!: CloudAccountValue, remount!: () => void;
  function Probe() { cloud = useCloudAccount()!; return null; }
  function Router() {
    const [key, setKey] = useState(0); remount = () => setKey(value => value + 1);
    return <><Probe /><AccountCampaignRouter key={key} /></>;
  }
  await env.render(<AuthAccountContext.Provider value={h.scope.accountId}>
    <AuthAccountActionsContext.Provider value={{ email: "synthetic@example.invalid", pending: false, message: null, signOut: async () => true }}>
      <CompetitionClientContext.Provider value={null}><CloudAccountProvider runtime={runtime}><Router /></CloudAccountProvider></CompetitionClientContext.Provider>
    </AuthAccountActionsContext.Provider>
  </AuthAccountContext.Provider>);
  await vi.waitFor(async () => { await act(async () => {}); expect(cloud?.phase).toBe("available"); });
  const playing = () => vi.waitFor(async () => {
    await act(async () => {});
    expect(cloud.active?.syncView).toMatchObject({ canExecute: true, failure: null });
    expect(cloud.active?.needsReload).toBe(false);
  }, { timeout: 5_000 });
  const open = async () => {
    await vi.waitFor(async () => { await act(async () => {}); expect(env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); }, { timeout: 5_000 });
    await env.click("Resume Synthetic clinic 1"); await playing();
    await vi.waitFor(async () => { await act(async () => {}); expect(cloud.active?.syncView.pending).toBe(false); }, { timeout: 5_000 });
    return cloud.active!;
  };
  return { ...h, cache, env, entryStore, runtime, get cloud() { return cloud; }, playing, open, remount: () => remount() };
}

describe.each(["phone", "desktop"] as const)("%s real account provider and automatic session", layout => {
  it("makes a routine selected copy playable and renders one account menu", async () => {
    const f = await fixture(layout), session = await f.open();
    expect(session.canExecute).toBe(true);
    if (layout === "phone") await f.env.click("More clinic options");
    expect(allElements(f.env.doc.body, node => node.tagName === "DETAILS" && node.attributes.class?.split(" ").includes("cloud-account") === true)).toHaveLength(1);
    expect(allElements(f.env.doc.body, node => node.tagName === "SUMMARY" && node.textContent === "Account & privacy")).toHaveLength(1);
  });

  it("reopens newer retained progress after replacing the current cache without replacing the account provider", async () => {
    const f = await fixture(layout), session = await f.open();
    await act(async () => {
      expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "retained.newer" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(await session.durable()).toBe(true);
    });
    const expected = session.state, entry = session.coordinator.recoveryEntry!;
    await f.entryStore.create("conflict:retained", { scope: entry.scope, device: entry, account: entry.confirmed });
    session.coordinator.dispose();
    const current = await f.cache.read(entry.scope);
    await f.cache.write({ ...entry, recovery: null }, current!.cacheRevision);
    await act(async () => f.remount());
    await f.playing();
    expect(f.cloud.active).not.toBe(session);
    expect(f.cloud.active!.state).toEqual(expected);
    await vi.waitFor(() => expect(f.cloud.active?.syncView.pending).toBe(false));
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
  });

  it.each(["opening", "foreground"] as const)("bounds stalled accepted-command encoding before %s and preserves it for Retry", async trigger => {
    const f = await fixture(layout), session = await f.open(), held = deferred(), started = deferred();
    const run = cloudCodec.run.bind(cloudCodec); let hold = true;
    vi.spyOn(cloudCodec, "run").mockImplementation(async task => {
      if (task.kind === "encode" && hold) { started.resolve(); await held.promise; }
      return run(task);
    });
    await act(async () => { session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "encoding.pending" }, PROTOTYPE_DOMAIN_CONTEXT); });
    await started.promise;
    const revision = session.coordinator.confirmedRevision, operations = f.server.operationCount(f.scope.accountId);
    vi.useFakeTimers(); let checking!: Promise<unknown>;
    await act(async () => { checking = trigger === "opening" ? f.cloud.openCampaign!(session.state.campaignId) : session.reconnect(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS); });
    await checking;
    expect(session.coordinator.view).toMatchObject({ canExecute: false, failure: "processing" });
    expect(f.cloud.active).toBe(session);
    expect(f.server.operationCount(f.scope.accountId)).toBe(operations);
    const notices = allElements(f.env.doc.body, node => node.attributes["aria-label"] === "Clinic status");
    expect(notices).toHaveLength(1); expect(notices[0]!.textContent).toContain("Save processing stopped");
    vi.useRealTimers(); hold = false;
    await act(async () => { held.resolve(); expect(await session.durable()).toBe(true); });
    expect(session.coordinator.confirmedRevision).toBe(revision);
    expect(session.coordinator.pendingCandidate?.snapshot).toBeDefined();
    await f.env.clickElement(allElements(f.env.doc.body, node => node.tagName === "BUTTON" && node.textContent === "Retry")[0]!);
    await f.playing();
    expect(f.cloud.active!.state.simulationSpeed).toBe(4);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.cloud.active?.syncView.pending).toBe(false); });
  });

  it.each(["empty", "confirmed", "pending"] as const)("opens a verified prior copy read-only and exports it without closing it or modifying the account (current cache=%s)", async cacheMode => {
    const f = await fixture(layout), session = await f.open();
    await act(async () => {
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "prior.newer" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.checkpointNow("purchase")).toBe(true);
    });
    const row = f.server.account(f.scope.accountId).campaigns.get(f.scope.campaignId)!;
    const prior = structuredClone(row.prior!), before = f.server.operationCount(f.scope.accountId);
    let pendingSha: string | undefined;
    if (cacheMode === "pending") await act(async () => {
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "prior.pending" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.durable()).toBe(true); pendingSha = session.coordinator.pendingCandidate!.snapshot.uncompressedSha256;
    });
    row.confirmed = { ...row.confirmed, snapshot: { ...row.confirmed.snapshot, uncompressedSha256: "0".repeat(64) } };
    const corrupt = structuredClone(row.confirmed);
    session.dispose();
    if (cacheMode === "empty") await f.cache.clearAccount(f.runtime);
    await act(async () => f.remount());
    await vi.waitFor(async () => { await act(async () => {}); expect(f.cloud.active?.syncView.priorRecovery).toMatchObject({ verifiedRevision: prior.revision }); });
    expect(f.cloud.active!.canExecute).toBe(false);
    expect(f.cloud.active!.coordinator.view.phase).toBe("readonly");
    const exported = JSON.parse(await f.cloud.exportDeviceRecovery());
    expect(exported.campaigns).toHaveLength(1);
    expect(JSON.stringify(exported)).toContain(prior.snapshot.uncompressedSha256);
    if (pendingSha) expect(JSON.stringify(exported)).toContain(pendingSha);
    expect(f.cloud.active!.execute({ type: "ADVANCE_TICK", advancedAtRealMs: 0, operationId: "prior.blocked" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(await f.cloud.active!.checkpointNow("purchase")).toBe(false);
    expect(row.confirmed).toEqual(corrupt); expect(row.prior).toEqual(prior);
    expect(f.server.operationCount(f.scope.accountId)).toBe(before);
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
    const notices = allElements(f.env.doc.body, node => node.attributes["aria-label"] === "Clinic status");
    expect(notices).toHaveLength(1); expect(allElements(notices[0]!, node => node.tagName === "BUTTON")).toHaveLength(1);
  });
});
