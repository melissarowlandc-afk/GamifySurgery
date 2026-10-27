import { act, StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { AccountCampaignRouter } from "./App";
import { AuthAccountActionsContext, AuthAccountContext } from "./auth/AuthAccountContext";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";
import { accountStorageKey } from "./session/accountStorageKey";
import { appendLocalCampaign, createFreshProfile, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY, LEGACY_PROTOTYPE_SAVE_KEY, savePrototypeProfileResult } from "./session/prototypeStorage";
import { CloudAccountProvider, configuredCloudRuntime } from "./session/cloud/CloudAccount";
import { MemoryCloudCache } from "./session/cloud/cache";
import { MemoryCloudEntryStore } from "./session/cloud/entryStorage";
import { deferred } from "./session/cloud/syncTestSupport";
import { CompetitionClientContext } from "./competition/useCompetition";

const sdk = vi.hoisted(() => ({ rpc: vi.fn(), session: vi.fn() }));
vi.mock("./auth/prototypeAuth", async original => ({ ...await original<typeof import("./auth/prototypeAuth")>(),
  hostedAuthConfiguration: () => ({ supabaseUrl: "https://synthetic.supabase.co", supabaseAnonKey: "synthetic-public-key" }),
}));
vi.mock("./auth/supabaseAuth", async original => ({ ...await original<typeof import("./auth/supabaseAuth")>(),
  getSupabaseAuthClient: () => ({ rpc: sdk.rpc, auth: { getSession: sdk.session } }),
}));
// Keep both real shells and the actual session/router; replace drawing only.
// The independent competition client is injected OFF below: its module-wide
// singleton otherwise retains the first fixture's synthetic storage across DOMs.
vi.mock("./facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));

afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
type Outcome = "off" | "disabled" | "network" | "enabled" | "writes-off";
const profileKey = accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a");
const otherKey = accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b");
function screen(env: ReturnType<typeof phoneTestDom>) {
  return { text: env.element.textContent, controls: allElements(env.element, node => ["BUTTON", "INPUT", "SUMMARY"].includes(node.tagName))
    .map(node => ({ tag: node.tagName, text: node.textContent, label: node.attributes["aria-label"], disabled: node.attributes.disabled, value: node.value })) };
}
async function mount(layout: "desktop" | "phone", outcome: Outcome, raw?: string | null, noticeAccepted = false) {
  vi.stubEnv("VITE_CLOUD_SAVES_ENABLED", outcome === "off" ? "false" : "true");
  vi.stubEnv("VITE_CLOUD_SAVES_REGION", "Synthetic QA region");
  sdk.rpc.mockReset(); sdk.session.mockResolvedValue({ data: { session: { user: { id: "account-a" } } }, error: null });
  const wait = deferred(), env = phoneTestDom(), stored = new Map<string, string>([
    [otherKey, "Other account bytes"], [PROTOTYPE_PROFILE_KEY, "Unowned prototype bytes"], [LEGACY_PROTOTYPE_SAVE_KEY, "Legacy bytes"],
  ]);
  Object.assign(env.browser.location, { search: `?layout=${layout}`, href: `http://127.0.0.1:5184/?layout=${layout}` });
  Object.assign(env.doc, { visibilityState: "visible" });
  const createElement = env.doc.createElement.bind(env.doc);
  env.doc.createElement = (name: string) => Object.assign(createElement(name), name === "dialog" ? {
    open: false, showModal() { this.open = true; }, close() { this.open = false; },
  } : {});
  const localStorage = { get length() { return stored.size; }, key: (index: number) => [...stored.keys()][index] ?? null,
    getItem: (key: string) => stored.get(key) ?? null, setItem: vi.fn((key: string, value: string) => stored.set(key, value)), removeItem: vi.fn((key: string) => stored.delete(key)) };
  Object.assign(env.browser, { localStorage, setInterval: () => 1, clearInterval: vi.fn() });
  if (raw) stored.set(profileKey, raw);
  else if (raw !== null) {
    const campaign = appendLocalCampaign(createFreshProfile(), createInitialGameState().founder, "Existing clinic", 100, "cohort-fixture", false);
    campaign.campaign.state.paused = false;
    expect(savePrototypeProfileResult(campaign.profile, "account-a").ok).toBe(true);
  }
  const original = stored.get(profileKey) ?? null;
  localStorage.setItem.mockClear(); localStorage.removeItem.mockClear();
  const unexpectedFetch = vi.fn(() => { throw new Error("Unexpected network; this test only permits the mocked access RPC"); });
  vi.stubGlobal("fetch", unexpectedFetch);
  sdk.rpc.mockImplementation(async (name: string) => {
    if (name === "beta2_cloud_access") {
      await wait.promise;
      if (outcome === "network") throw new TypeError("Synthetic failed fetch");
      return { data: { protocolVersion: 3, enabled: outcome === "enabled" || outcome === "writes-off",
        writesEnabled: outcome !== "writes-off", noticeAccepted: noticeAccepted || outcome === "disabled", enrollmentsEnabled: true }, error: null };
    }
    if (name === "beta2_cloud_list" && noticeAccepted) return { data: { campaigns: [], serverTime: "2026-10-17T12:00:00.000Z" }, error: null };
    throw new Error(`Unexpected RPC: ${name}`);
  });
  const runtime = configuredCloudRuntime("account-a"), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const storageCalls = [vi.spyOn(cache, "read"), vi.spyOn(cache, "write"), vi.spyOn(entryStore, "read"), vi.spyOn(entryStore, "entries"), vi.spyOn(entryStore, "write"), vi.spyOn(entryStore, "create")];
  if (runtime) { runtime.cache = cache; runtime.entryStore = entryStore; }
  const guard = { current: null as (() => Promise<void>) | null };
  const children = <StrictMode><AuthAccountContext.Provider value="account-a"><AuthAccountActionsContext.Provider value={{
    email: "a@example.invalid", pending: false, message: null, signOut: async () => true, signOutGuard: guard,
  }}><CompetitionClientContext.Provider value={null}><CloudAccountProvider runtime={runtime}><AccountCampaignRouter /></CloudAccountProvider></CompetitionClientContext.Provider></AuthAccountActionsContext.Provider></AuthAccountContext.Provider></StrictMode>;
  await env.render(children);
  return { env, stored, original, storageCalls, localStorage, guard, unexpectedFetch, async settle() { await act(async () => { wait.resolve(); await wait.promise; }); } };
}
function expectPending(f: Awaited<ReturnType<typeof mount>>) {
  expect(f.env.element.textContent).toContain("Checking your sign-in…");
  expect(screen(f.env).controls).toEqual([]);
  expect(f.stored.get(profileKey) ?? null).toBe(f.original);
  expect(f.localStorage.setItem).not.toHaveBeenCalled(); expect(f.localStorage.removeItem).not.toHaveBeenCalled();
  for (const spy of f.storageCalls) expect(spy).not.toHaveBeenCalled();
  expect(f.guard.current).toBeNull(); expect(f.unexpectedFetch).not.toHaveBeenCalled();
}
async function resumeAndSave(f: Awaited<ReturnType<typeof mount>>, layout: "desktop" | "phone") {
  await f.env.click("Resume Existing clinic");
  await vi.waitFor(async () => { await act(async () => {}); expect(allElements(f.env.element, node => node.tagName === "BUTTON" && node.textContent === (layout === "phone" ? "More" : "Save & Close")).length, f.env.element.textContent).toBeGreaterThan(0); }, { timeout: 5_000 });
  expect(allElements(f.env.element, node => (node.attributes.class ?? "").split(" ").includes(layout === "phone" ? "mobile-shell" : "game-shell"))).toHaveLength(1);
  const session = screen(f.env);
  if (layout === "phone") await f.env.click("More");
  await f.env.click("Save & Close");
  expect(f.env.element.textContent).toContain("Safe to close this tab");
  await act(async () => { f.env.browser.dispatchEvent(new Event("focus")); f.env.browser.dispatchEvent(new Event("online")); f.env.browser.dispatchEvent(new Event("pagehide")); });
  const saved = loadPrototypeProfile("account-a").profile;
  expect(saved.campaigns).toHaveLength(1); expect(saved.campaigns[0]!.state.paused).toBe(true);
  expect(f.stored.get(otherKey)).toBe("Other account bytes");
  expect(f.stored.get(PROTOTYPE_PROFILE_KEY)).toBe("Unowned prototype bytes"); expect(f.stored.get(LEGACY_PROTOTYPE_SAVE_KEY)).toBe("Legacy bytes");
  return { session, saved, keys: [...f.stored.keys()].sort() };
}
describe.each(["desktop", "phone"] as const)("%s cohort gate against the Beta 1 path", layout => {
  it.each(["disabled", "network"] as const)("keeps identical entry/session/storage behavior after %s access", async outcome => {
    vi.spyOn(Date, "now").mockReturnValue(1_792_232_000_000); vi.spyOn(Math, "random").mockReturnValue(0.25);
    vi.spyOn(crypto, "randomUUID").mockReturnValue("11111111-1111-4111-8111-111111111111");
    const baseline = await mount(layout, "off"), entry = screen(baseline.env), raw = baseline.original;
    const expected = await resumeAndSave(baseline, layout);
    await cleanupPhoneTests();
    const gated = await mount(layout, outcome, raw);
    expectPending(gated);
    await gated.settle();
    expect(screen(gated.env)).toEqual(entry); expect(gated.stored.get(profileKey)).toBe(raw);
    expect(await resumeAndSave(gated, layout)).toEqual(expected);
    expect(sdk.rpc).toHaveBeenCalledExactlyOnceWith("beta2_cloud_access", { p_protocol: 3 });
    for (const spy of gated.storageCalls) expect(spy).not.toHaveBeenCalled();
    expect(gated.guard.current).toBeNull(); expect(gated.unexpectedFetch).not.toHaveBeenCalled();
  });
  it("offers local Resume only after the access check selects the Beta 1 path", async () => {
    const f = await mount(layout, "disabled");
    expectPending(f);
    await f.settle();
    expect(f.env.button("Resume Existing clinic")).toBeDefined();
    await resumeAndSave(f, layout);
    expect(sdk.rpc).toHaveBeenCalledOnce(); for (const spy of f.storageCalls) expect(spy).not.toHaveBeenCalled();
  });
  it("shows cloud entry only for an affirmative account check and uploads nothing before notice acceptance", async () => {
    const f = await mount(layout, "enabled"); expectPending(f); await f.settle();
    await vi.waitFor(() => expect(f.env.element.textContent).toContain("Before using account saves"));
    expect(f.env.element.textContent).toContain("Accept account save notice"); expect(f.env.element.textContent).toContain("Synthetic QA region");
    expect(f.env.button("Accept and continue").parentNode!.attributes.class).toBe("cloud-entry-notice");
    expect(f.env.find(node => node.tagName === "SUMMARY" && node.textContent === "Account & privacy").parentNode!.attributes.open).toBeUndefined();
    expect(f.stored.get(profileKey)).toBe(f.original);
    expect(f.localStorage.setItem).not.toHaveBeenCalled(); expect(f.localStorage.removeItem).not.toHaveBeenCalled();
    expect(sdk.rpc.mock.calls).toEqual([["beta2_cloud_access", { p_protocol: 3 }], ["beta2_cloud_access", { p_protocol: 3 }]]);
    expect(f.unexpectedFetch).not.toHaveBeenCalled();
  });
  it.each([false, true])("never creates a fresh device profile while pending or enabled (notice accepted: %s)", async noticeAccepted => {
    const f = await mount(layout, "enabled", null, noticeAccepted), original = [...f.stored];
    expectPending(f);
    await f.settle();
    await vi.waitFor(() => expect(f.env.element.textContent).toContain(noticeAccepted ? "Resume a previous campaign (0/2)" : "Before using account saves"));
    expect(f.stored.has(profileKey)).toBe(false); expect([...f.stored]).toEqual(original);
    expect(f.localStorage.setItem).not.toHaveBeenCalled(); expect(f.localStorage.removeItem).not.toHaveBeenCalled();
    expect(sdk.rpc.mock.calls.map(([name]) => name)).toEqual(noticeAccepted ? ["beta2_cloud_access", "beta2_cloud_list", "beta2_cloud_access", "beta2_cloud_list"] : ["beta2_cloud_access", "beta2_cloud_access"]);
    expect(f.unexpectedFetch).not.toHaveBeenCalled();
  });
  it("keeps an enabled owner in cloud entry while the global write switch is off", async () => {
    const f = await mount(layout, "writes-off"); await f.settle();
    await vi.waitFor(() => expect(f.env.element.textContent).toContain("Account saving is currently unavailable"));
    expect(f.env.button("Start a new campaign").attributes.disabled).toBeDefined();
    expect(f.stored.get(profileKey)).toBe(f.original);
  });
});
