import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountActionsContext, AuthAccountContext } from "../../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { CloudAccountProvider, configuredCloudRuntime, useCloudAccount, type CloudAccountValue, type CloudAccountRuntime } from "./CloudAccount";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { FakeCloudServer } from "./fakeTransport";
import { CloudSyncError } from "./transport";
import { deferred, syncFixture } from "./syncTestSupport";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createFreshProfile } from "../prototypeStorage";
import { usePrototypeSession } from "../usePrototypeSession";

afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllEnvs(); });
async function fixture() {
  const env = phoneTestDom(), server = new FakeCloudServer(), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const runtime: CloudAccountRuntime = { backendId: "synthetic", accountId: "account-a", region: "Disposable QA", transport: server.transport("account-a"), cache, entryStore };
  let current!: CloudAccountValue;
  const guard = { current: null as (() => Promise<void>) | null };
  function Probe() { const cloud = useCloudAccount(); if (cloud) current = cloud; return <p>{cloud?.phase ?? "Beta 1"}</p>; }
  await env.render(<AuthAccountContext.Provider value="account-a"><AuthAccountActionsContext.Provider value={{ email: "a@example.invalid", signOut: async () => true, signOutGuard: guard, pending: false, message: null }}>
    <CloudAccountProvider runtime={runtime}><Probe /></CloudAccountProvider>
  </AuthAccountActionsContext.Provider></AuthAccountContext.Provider>);
  await vi.waitFor(() => expect(current?.phase).toBe("available"));
  return { env, server, cache, entryStore, runtime, guard, get current() { return current; } };
}
describe("account entry lifetime and privacy", () => {
  it("fences late entry/import callbacks and new local writes after sign-out starts", async () => {
    const f = await fixture(), wait = deferred(), scoped = f.current.runtime;
    f.server.faults.push({ method: "list", at: "after", wait: wait.promise });
    const late = scoped.transport.list();
    await f.current.stop(); wait.resolve();
    await expect(late).rejects.toMatchObject({ code: "auth" });
    await expect(scoped.entryStore.write("late-marker", {})).rejects.toMatchObject({ code: "auth" });
    expect(await f.entryStore.read("late-marker")).toBeNull();
  });
  it("fences a device-only session's late pagehide and unmount writes before clearing that account", async () => {
    const f = await fixture();
    const a = "gamify-surgery.prototype.profile.v1.account.account-a", b = "gamify-surgery.prototype.profile.v1.account.account-b";
    const keys = new Map([[a, "A"], [b, "B"], ["gamify-surgery.prototype.profile.v1", "owner prototype"]]);
    Object.assign(f.env.browser, { localStorage: { get length() { return keys.size; }, key: (index: number) => [...keys.keys()][index] ?? null,
      getItem: (key: string) => keys.get(key) ?? null, setItem: (key: string, value: string) => keys.set(key, value), removeItem: (key: string) => keys.delete(key) } });
    const state = createInitialGameState(); state.paused = true;
    const profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
      campaigns: [{ campaignId: state.campaignId, name: "Local only", status: "resumable" as const, createdAtRealMs: 0, updatedAtRealMs: 0, state }] };
    let account!: CloudAccountValue;
    function LocalGame() { usePrototypeSession({ profile, notice: "Local only." }); account = useCloudAccount()!; return <p>Local session</p>; }
    await f.env.render(<AuthAccountContext.Provider value="account-a"><CloudAccountProvider runtime={f.runtime}><LocalGame /></CloudAccountProvider></AuthAccountContext.Provider>);
    const exported = JSON.parse(await account.exportDeviceRecovery()); expect(JSON.parse(exported.localSessionProfile).campaigns[0].state).toEqual(state);
    await account.clearDevice(true); expect(keys.has(a)).toBe(false);
    await act(async () => { f.env.browser.dispatchEvent(new Event("pagehide")); });
    await f.env.render(<p>Signed out</p>);
    expect(keys.has(a)).toBe(false); expect(keys.get(b)).toBe("B"); expect(keys.get("gamify-surgery.prototype.profile.v1")).toBe("owner prototype");
  });
  it("keeps cloud OFF by default and never configures a prototype account", () => {
    vi.stubEnv("VITE_CLOUD_SAVES_ENABLED", "false"); expect(configuredCloudRuntime("account-a")).toBeNull();
    vi.stubEnv("VITE_CLOUD_SAVES_ENABLED", "true"); expect(configuredCloudRuntime(null)).toBeNull();
  });
  it("requires the versioned cloud notice separately and leaves historical campaigns unclaimed", async () => {
    const f = await fixture(); f.server.setAccess("account-a", { noticeAccepted: false });
    await act(async () => { await f.current.refresh(); }); expect(f.current.summaries).toEqual([]);
    await act(async () => { await f.current.acceptNotice(); }); expect(f.current.access?.noticeAccepted).toBe(true);
    expect(f.server.operationCount("account-a")).toBe(0); expect(f.entryStore.records.size).toBe(0);
  });
  it.each(["disabled", "network"] as const)("keeps admitted cloud entry, summaries and sign-out protection after a later %s check", async outcome => {
    const f = await fixture();
    const summaries = ["resumable", "archived"].map((status, index) => ({
      campaignId: `cloud-${index}`, name: `Account clinic ${index}`, status: status as "resumable" | "archived",
      revision: "1", writerGeneration: "0", writerActive: false, serverNowMs: 100, acceptedAtMs: 100,
    }));
    const list = vi.spyOn(f.runtime.transport, "list").mockResolvedValue(summaries);
    await act(async () => { await f.current.refresh(); });
    expect(f.current.summaries).toEqual(summaries);
    const guard = f.guard.current; expect(guard).toBeTypeOf("function");
    if (outcome === "disabled") f.server.setAccess("account-a", { enabled: false });
    else f.server.faults.push({ method: "capabilities", at: "before", error: new CloudSyncError("network") });
    list.mockClear();
    await act(async () => { await f.current.refresh(); });
    expect(f.env.element.textContent).toBe(outcome === "disabled" ? "available" : "error");
    expect(f.current.access?.enabled).toBe(outcome !== "disabled");
    expect(f.current.summaries).toEqual(summaries); expect(f.guard.current).toBe(guard);
    expect(list).not.toHaveBeenCalled();
  });
  it("stops and remembers deletion before a failed request; retries the full endpoint without resurrection", async () => {
    const f = await fixture(); f.server.faults.push({ method: "deleteMyData", at: "before", error: new CloudSyncError("network") });
    await act(async () => { await expect(f.current.requestDeletion()).rejects.toMatchObject({ code: "network" }); });
    expect(f.current.phase).toBe("deletion-requested"); expect(await f.entryStore.read("deletion-requested")).toEqual({ version: "beta2.cloud.v1" });
    const calls = f.server.calls.length;
    await act(async () => { await f.current.refresh(); });
    expect(f.current.phase).toBe("deletion-requested"); expect(f.server.calls).toHaveLength(calls);
    await act(async () => { await f.current.requestDeletion(); }); expect(f.current.phase).toBe("deleted");
    expect(f.server.account("account-a").access.deletionRequested).toBe(true);
  });
  it("clears only this backend/account after explicit recovery confirmation", async () => {
    const f = await fixture(), data = await syncFixture();
    const scope = { backendId: f.runtime.backendId, accountId: "account-a", campaignId: data.confirmed.campaignId };
    await f.cache.write({ schemaVersion: 1, scope, confirmed: data.confirmed, recovery: { baseRevision: "1", writerGeneration: "0", inFlight: null, following: null } }, null);
    const other = { ...scope, accountId: "account-b" }; await f.cache.write({ schemaVersion: 1, scope: other, confirmed: data.confirmed, recovery: null }, null);
    const keys = new Map([["gamify-surgery.prototype.profile.v1", "owner prototype"], ["gamify-surgery.prototype.profile.v1.account.account-a", "A"], ["gamify-surgery.prototype.profile.v1.account.account-b", "B"]]);
    Object.assign(f.env.browser, { localStorage: { get length() { return keys.size; }, key: (index: number) => [...keys.keys()][index] ?? null,
      getItem: (key: string) => keys.get(key) ?? null, removeItem: (key: string) => keys.delete(key) } });
    await expect(f.current.clearDevice(false)).rejects.toMatchObject({ code: "storage" });
    await f.current.clearDevice(true);
    expect(await f.cache.read(scope)).toBeNull(); expect(await f.cache.read(other)).not.toBeNull();
    expect(keys.get("gamify-surgery.prototype.profile.v1")).toBe("owner prototype"); expect(keys.get("gamify-surgery.prototype.profile.v1.account.account-b")).toBe("B");
    expect(keys.has("gamify-surgery.prototype.profile.v1.account.account-a")).toBe(false);
  });
  it("does not clear any cache during default sign-out preparation", async () => {
    const f = await fixture(); await f.entryStore.write("raw", { text: "exact original" });
    await f.guard.current?.();
    expect(await f.entryStore.read("raw")).toEqual({ text: "exact original" });
    expect(f.server.calls.some(call => call.method === "deleteMyData")).toBe(false);
  });
});
