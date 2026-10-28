import { StrictMode, act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GameState } from "@gamify-surgery/game-domain";
import type { PlaytimeTracker } from "../playtime/playtimeTracker";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { accountStorageKey } from "../session/accountStorageKey";
import { USAGE_OUTBOX_KEY } from "../playtime/usageOutbox";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { CompetitionClient } from "./competitionClient";
import type { CompetitionRankChange } from "./competitionClient";
import { CompetitionClientContext, useCompetitionSubmission } from "./useCompetition";
import { fakeTransport, memoryStorage, receipt, revenueState } from "./testFixtures";

const hosted = vi.hoisted(() => ({ getClient: vi.fn(), usage: null as PlaytimeTracker | null, casual: false as boolean | null }));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: hosted.getClient }));
vi.mock("../playtime/UsageProvider", () => ({ useUsageTracking: () => hosted.usage, useCasualMode: () => hosted.casual }));
function Observe({ state, onRankChange }: { state: GameState; onRankChange?: (change: CompetitionRankChange) => void }) { useCompetitionSubmission(state, "Clinic", onRankChange); return <span>Game continues</span>; }
afterEach(() => { vi.unstubAllEnvs(); hosted.getClient.mockReset(); hosted.usage = null; hosted.casual = false; return cleanupPhoneTests(); });

describe("nonblocking day completion hook", () => {
  it("reads rank after submission, publishes a changed rank once, and retries offline reads", async () => {
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, memoryStorage(), "rank-hook"), notify = vi.fn();
    const order: string[] = []; let rank = 3;
    transport.submit.mockImplementation(async () => { order.push("submit"); });
    transport.leaderboard.mockImplementation(async () => { order.push("rank"); return { hidden: false, rows: [{ rank, isSelf: true, clinicName: "Clinic", facilityLevel: 0, averageDailyRevenueCents: 0, daysCounted: 1 }] }; });
    const render = (day: number) => env.render(<StrictMode><CompetitionClientContext.Provider value={client}><Observe state={revenueState(day)} onRankChange={notify} /></CompetitionClientContext.Provider></StrictMode>);
    await render(1); expect(order).toEqual(["submit", "rank"]); expect(notify).not.toHaveBeenCalled();
    rank = 2; await render(2);
    expect(order).toEqual(["submit", "rank", "submit", "rank"]);
    expect(notify).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ message: "You moved up to #2 in Clinic Competition!" }));
    await render(2); expect(notify).toHaveBeenCalledTimes(1);
    rank = 4; transport.leaderboard.mockRejectedValueOnce(new Error("offline")); await render(3);
    expect(notify).toHaveBeenCalledTimes(1); expect(env.element.textContent).toBe("Game continues");
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(notify).toHaveBeenCalledTimes(2); expect(notify.mock.calls[1]![0].message).toBe("Another clinic passed yours — you're now #4.");
  });
  it.each([true, null])("makes no rank request/alert when casual access is %s", async casual => {
    hosted.casual = casual;
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, null, "casual-rank"), notify = vi.fn();
    await env.render(<CompetitionClientContext.Provider value={client}><Observe state={revenueState()} onRankChange={notify} /></CompetitionClientContext.Provider>);
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(transport.leaderboard).not.toHaveBeenCalled(); expect(notify).not.toHaveBeenCalled();
  });
  it("submits once per completed day across pauses, ordinary ticks, strict effects and remounts", async () => {
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, memoryStorage(), "a");
    const render = (state: GameState) => env.render(<StrictMode><CompetitionClientContext.Provider value={client}><Observe state={state} /></CompetitionClientContext.Provider></StrictMode>);
    let state = revenueState(0); state.facilityTick = 599; state.serviceIncomeReceipts = [receipt(10, 10)];
    await render(state); expect(transport.submit).not.toHaveBeenCalled();
    state = { ...state, facilityTick: 600 }; await render(state);
    expect(transport.submit).toHaveBeenCalledTimes(1);
    await render({ ...state, facilityTick: 601, paused: true });
    expect(transport.submit).toHaveBeenCalledTimes(1);
    await render({ ...state, facilityTick: 1205 });
    expect(transport.submit).toHaveBeenCalledTimes(2);
    expect(transport.submit.mock.calls[1]![0]).toMatchObject({ completedDay: 2, averageDailyRevenueCents: 500, daysCounted: 2 });
    await env.render(null); await render({ ...state, facilityTick: 1205 });
    expect(transport.submit).toHaveBeenCalledTimes(2);
  });
  it("retries on reconnect while leaving gameplay rendered during failures", async () => {
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, memoryStorage(), "a");
    transport.submit.mockRejectedValueOnce(new Error("offline"));
    await env.render(<CompetitionClientContext.Provider value={client}><Observe state={revenueState()} /></CompetitionClientContext.Provider>);
    expect(env.element.textContent).toBe("Game continues");
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(transport.submit).toHaveBeenCalledTimes(2);
  });
  it("deduplicates StrictMode mount effects even while the first acknowledgement is pending", async () => {
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, null, "a");
    let acknowledge!: () => void;
    transport.submit.mockImplementationOnce(() => new Promise<void>(resolve => { acknowledge = resolve; }));
    await env.render(<StrictMode><CompetitionClientContext.Provider value={client}><Observe state={revenueState()} /></CompetitionClientContext.Provider></StrictMode>);
    await act(async () => { acknowledge(); await client.flush(); });
    expect(transport.submit).toHaveBeenCalledTimes(1);
  });
  it("never creates an auth client or queue in the local prototype, even with an account-shaped fixture", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", ""); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    const env = phoneTestDom();
    const notify = vi.fn();
    await env.render(<AuthAccountContext.Provider value="fixture"><Observe state={revenueState()} onRankChange={notify} /></AuthAccountContext.Provider>);
    await act(async () => { env.browser.dispatchEvent(new Event("online")); env.browser.dispatchEvent(new Event("focus")); });
    expect(hosted.getClient).not.toHaveBeenCalled(); expect(env.browser.localStorage.setItem).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(env.element.textContent).toBe("Game continues");
  });
  it("does not submit in a configured hosted build without a signed-in account", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://fixture.invalid"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "fixture");
    const env = phoneTestDom(); await env.render(<Observe state={revenueState()} />);
    expect(hosted.getClient).not.toHaveBeenCalled(); expect(env.browser.localStorage.setItem).not.toHaveBeenCalled();
  });
  it("honors a persisted deletion request before the first asynchronous usage-access refresh", async () => {
    const env = phoneTestDom(), transport = fakeTransport(), client = new CompetitionClient(transport, null, "a");
    hosted.usage = { outbox: { deletionRequested: () => true }, status: () => ({ state: "requires-notice" }),
      subscribe: () => () => {} } as unknown as PlaytimeTracker;
    await env.render(<CompetitionClientContext.Provider value={client}><Observe state={revenueState()} /></CompetitionClientContext.Provider>);
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(transport.submit).not.toHaveBeenCalled();
    await expect(client.leaderboard()).rejects.toThrow("stopped"); expect(transport.leaderboard).not.toHaveBeenCalled();
  });
  it("reads the persisted stop marker before UsageProvider has created its tracker", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://fixture.invalid"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "fixture");
    const env = phoneTestDom(), accountId = "deleted-before-tracker", storage = memoryStorage();
    storage.setItem(`${accountStorageKey(USAGE_OUTBOX_KEY, accountId)}.deletion-requested`, "true");
    Object.assign(env.browser, { localStorage: storage });
    const getSession = vi.fn(), rpc = vi.fn(); hosted.getClient.mockReturnValue({ auth: { getSession }, rpc });
    expect(hosted.usage).toBeNull();
    await env.render(<AuthAccountContext.Provider value={accountId}><Observe state={revenueState()} /></AuthAccountContext.Provider>);
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(getSession).not.toHaveBeenCalled(); expect(rpc).not.toHaveBeenCalled();
  });
});
