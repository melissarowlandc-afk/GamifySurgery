import { act, StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountActionsContext, AuthAccountContext } from "../auth/AuthAccountContext";
import { AccountMenu } from "../ui/AccountMenu";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { CASUAL_MODE_STORAGE_KEY, UsageProvider, useCasualMode, useUsageTracking } from "./UsageProvider";
import { accountStorageKey } from "../session/accountStorageKey";
import type { PlaytimeTracker } from "./playtimeTracker";
import type { UsageAccess } from "./usageTypes";

const backend = vi.hoisted(() => ({ access: vi.fn(), authListeners: new Set<(event: string) => void>(), unsubscribe: vi.fn() }));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: () => ({ auth: {
  onAuthStateChange: (listener: (event: string) => void) => {
    backend.authListeners.add(listener);
    return { data: { subscription: { unsubscribe: () => { backend.authListeners.delete(listener); backend.unsubscribe(); } } } };
  },
} }) }));
vi.mock("./supabaseUsage", () => ({ createSupabaseUsageTransport: () => ({ access: backend.access,
  ingest: async () => [], acceptNotice: async () => {}, requestDeletion: async () => {} }) }));
afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllEnvs(); backend.access.mockReset(); backend.authListeners.clear(); backend.unsubscribe.mockReset(); });

const modeKey = (accountId: string) => accountStorageKey(CASUAL_MODE_STORAGE_KEY, accountId);
const admitted = (casual: boolean): UsageAccess => ({ admitted: true, notice_accepted: true, deletion_requested: false, casual });

function hostedFixture(stored = new Map<string, string>()) {
  vi.stubEnv("VITE_SUPABASE_URL", "https://synthetic.supabase.co"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "synthetic-public-key");
  const env = phoneTestDom();
  Object.assign(env.browser, { setInterval: vi.fn(), clearInterval: vi.fn() });
  const setItem = vi.fn((key: string, value: string) => { stored.set(key, value); });
  const removeItem = vi.fn((key: string) => { stored.delete(key); });
  Object.assign(env.browser.localStorage, { getItem: (key: string) => stored.get(key) ?? null, setItem, removeItem });
  let mode: boolean | null = null, tracker: PlaytimeTracker | null = null;
  function Probe() { mode = useCasualMode(); tracker = useUsageTracking(); return <p>{mode === null ? "Awaiting mode" : String(mode)}</p>; }
  const render = (accountId: string, strict = false) => {
    const content = <AuthAccountContext.Provider key={accountId} value={accountId}><UsageProvider><Probe /></UsageProvider></AuthAccountContext.Provider>;
    return env.render(strict ? <StrictMode>{content}</StrictMode> : content);
  };
  return { env, stored, setItem, removeItem, render, mode: () => mode, tracker: () => tracker! };
}

describe("server-assigned casual account mode", () => {
  it("waits for server access, updates from that data only, and offers no account toggle", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://synthetic.supabase.co"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "synthetic-public-key");
    const env = phoneTestDom();
    Object.assign(env.browser, { setInterval: vi.fn(), clearInterval: vi.fn() });
    // Arbitrary storage keys and query strings cannot assign account mode.
    env.browser.location.search = "?casual=true&layout=phone";
    Object.assign(env.browser.localStorage, { getItem: (key: string) => key === "casual" ? "true" : null });
    let resolve!: (access: UsageAccess) => void;
    backend.access.mockReturnValueOnce(new Promise<UsageAccess>(done => { resolve = done; }));
    let mode: boolean | null = null, tracker: PlaytimeTracker | null = null;
    function Probe() { mode = useCasualMode(); tracker = useUsageTracking(); return <><p>{mode === null ? "Awaiting mode" : mode ? "Casual assigned" : "Standard assigned"}</p><AccountMenu /></>; }
    await env.render(<AuthAccountContext.Provider value="account-casual"><AuthAccountActionsContext.Provider value={{ email: "synthetic@example.invalid", signOut: async () => {}, pending: false, message: null }}><UsageProvider><Probe /></UsageProvider></AuthAccountActionsContext.Provider></AuthAccountContext.Provider>);
    expect(mode).toBeNull(); expect(env.element.textContent).toContain("Awaiting mode");
    await act(async () => resolve({ admitted: true, notice_accepted: false, deletion_requested: false, casual: true }));
    expect(mode).toBe(true); expect(env.element.textContent).toContain("Casual assigned");
    expect(tracker!.status().state).toBe("requires-notice");
    expect(allElements(env.element, node => ["BUTTON", "INPUT", "SELECT"].includes(node.tagName) && /casual/i.test(node.textContent + (node.attributes["aria-label"] ?? "")))).toHaveLength(0);
    backend.access.mockRejectedValueOnce(new Error("offline"));
    await act(async () => tracker!.refreshAccess());
    expect(mode).toBe(true); // A failed refresh cannot expose standard distractors.
    backend.access.mockResolvedValueOnce({ admitted: true, notice_accepted: true, deletion_requested: false, casual: false });
    await act(async () => tracker!.refreshAccess());
    expect(mode).toBe(false); expect(env.element.textContent).toContain("Standard assigned");
    expect(env.browser.localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(env.browser.localStorage.setItem).toHaveBeenNthCalledWith(1, modeKey("account-casual"), "true");
    expect(env.browser.localStorage.setItem).toHaveBeenNthCalledWith(2, modeKey("account-casual"), "false");
  });

  it.each([false, true])("restores remembered %s across a remount, retries offline and replaces it with server data", async (casual) => {
    vi.useFakeTimers();
    const f = hostedFixture(); backend.access.mockResolvedValueOnce(admitted(casual));
    await f.render("account/a");
    expect(f.mode()).toBe(casual); expect(f.stored.get(modeKey("account/a"))).toBe(String(casual));
    expect(modeKey("account/a")).toContain("account.account%2Fa");
    await f.env.render(null);
    expect(f.stored.get(modeKey("account/a"))).toBe(String(casual));
    expect(backend.authListeners.size).toBe(0); expect(backend.unsubscribe).toHaveBeenCalledTimes(1);
    backend.access.mockRejectedValue(new Error("no signal"));
    await f.render("account/a");
    expect(f.mode()).toBe(casual); expect(f.tracker().canRecordQuestions()).toBe(false);
    await act(async () => vi.advanceTimersByTimeAsync(2_000));
    expect(backend.access).toHaveBeenCalledTimes(3); expect(f.mode()).toBe(casual);
    backend.access.mockResolvedValue(admitted(!casual));
    await act(async () => vi.advanceTimersByTimeAsync(5_000));
    expect(f.mode()).toBe(!casual); expect(f.stored.get(modeKey("account/a"))).toBe(String(!casual));
    expect(f.setItem.mock.calls.filter(([key]) => key === modeKey("account/a")))
      .toEqual([[modeKey("account/a"), String(casual)], [modeKey("account/a"), String(!casual)]]);
  });

  it("keeps remembered values account-scoped and waits when the next account has no value", async () => {
    const f = hostedFixture(new Map([[modeKey("account-a"), "true"], [modeKey("account-b"), "false"]]));
    backend.access.mockImplementation(() => new Promise(() => {}));
    await f.render("account-a"); expect(f.mode()).toBe(true);
    await f.render("account-b"); expect(f.mode()).toBe(false);
    await f.render("account-c"); expect(f.mode()).toBeNull();
    expect(f.env.element.textContent).toBe("Awaiting mode"); expect(f.setItem).not.toHaveBeenCalled();
  });

  it.each(["null", "1", "{\"casual\":true}", "TRUE"])("ignores a non-boolean remembered value: %s", async (stored) => {
    const f = hostedFixture(new Map([[modeKey("account-a"), stored]]));
    backend.access.mockImplementation(() => new Promise(() => {}));
    await f.render("account-a"); expect(f.mode()).toBeNull(); expect(f.setItem).not.toHaveBeenCalled();
  });

  it.each(["methods", "property"])("keeps server mode usable when storage %s throw", async (blocked) => {
    const f = hostedFixture();
    const fail = () => { throw new Error("storage blocked"); };
    if (blocked === "property") Object.defineProperty(f.env.browser, "localStorage", { get: fail, configurable: true });
    else Object.assign(f.env.browser.localStorage, { getItem: fail, setItem: fail, removeItem: fail });
    let resolve!: (access: UsageAccess) => void;
    backend.access.mockReturnValueOnce(new Promise<UsageAccess>(done => { resolve = done; }));
    await f.render("account-a"); expect(f.mode()).toBeNull();
    await act(async () => resolve(admitted(true)));
    expect(f.mode()).toBe(true); expect(f.tracker().canRecordQuestions()).toBe(true);
    await act(async () => f.tracker().requestDeletion());
    expect(f.mode()).toBe(false);
  });

  it("clears only the signed-out account's cache and ignores an access response arriving afterward", async () => {
    const f = hostedFixture(new Map([[modeKey("account-a"), "true"], [modeKey("account-b"), "false"]]));
    let resolve!: (access: UsageAccess) => void;
    backend.access.mockReturnValueOnce(new Promise<UsageAccess>(done => { resolve = done; }));
    await f.render("account-a"); expect(f.mode()).toBe(true);
    await act(async () => { for (const listener of backend.authListeners) listener("SIGNED_OUT"); });
    expect(f.stored.has(modeKey("account-a"))).toBe(false);
    expect(f.stored.get(modeKey("account-b"))).toBe("false");
    await act(async () => resolve(admitted(true)));
    expect(f.stored.has(modeKey("account-a"))).toBe(false); expect(f.setItem).not.toHaveBeenCalled();
    expect(f.tracker().canRecordQuestions()).toBe(false);
  });

  it.each(["local", "server"])("clears only this account's remembered mode on %s deletion", async (source) => {
    const f = hostedFixture(new Map([[modeKey("account-a"), "true"], [modeKey("account-b"), "false"]]));
    backend.access.mockResolvedValueOnce(source === "server" ? { ...admitted(true), deletion_requested: true } : admitted(true));
    await f.render("account-a");
    if (source === "local") await act(async () => f.tracker().requestDeletion());
    expect(f.stored.has(modeKey("account-a"))).toBe(false);
    expect(f.stored.get(modeKey("account-b"))).toBe("false");
    expect(f.tracker().canRecordQuestions()).toBe(false);
  });

  it("deduplicates startup under StrictMode and remembers a successful standard response too", async () => {
    const f = hostedFixture(new Map([[modeKey("account-a"), "true"]]));
    backend.access.mockResolvedValue(admitted(false));
    await f.render("account-a", true);
    expect(backend.access).toHaveBeenCalledTimes(1); expect(backend.authListeners.size).toBe(1);
    expect(f.mode()).toBe(false); expect(f.stored.get(modeKey("account-a"))).toBe("false");
  });

  it("keeps the local prototype standard despite a casual-shaped URL/storage value", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", ""); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    const env = phoneTestDom(); env.browser.location.search = "?casual=true";
    Object.assign(env.browser.localStorage, { getItem: () => "true" });
    function Probe() { return <p>{String(useCasualMode())}</p>; }
    await env.render(<UsageProvider><Probe /></UsageProvider>);
    expect(env.element.textContent).toBe("false"); expect(backend.access).not.toHaveBeenCalled();
  });
});
