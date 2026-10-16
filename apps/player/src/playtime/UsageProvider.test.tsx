import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { UsageNoticePlaceholder, UsageProvider, useUsageTracking } from "./UsageProvider";

vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: vi.fn(() => { throw new Error("Unconfigured usage must not create a client"); }) }));
afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllEnvs(); vi.clearAllMocks(); });

describe("unconfigured usage path in either shell", () => {
  for (const phone of [false, true]) it(`has no client, network, timer, notice or queue in ${phone ? "phone" : "desktop"} local play`, async () => {
    vi.stubEnv("VITE_SUPABASE_URL", ""); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    const env = phoneTestDom(); env.browser.location.search = phone ? "?layout=phone" : "";
    const setInterval = vi.fn(); Object.assign(env.browser, { setInterval, clearInterval: vi.fn() });
    const fetch = vi.fn(() => { throw new Error("Unexpected network"); }); vi.stubGlobal("fetch", fetch);
    function Game() { const tracker = useUsageTracking(); return <p>{tracker === null ? "Local game" : "Tracked game"}</p>; }
    await env.render(<StrictMode><AuthAccountContext.Provider value={null}><UsageProvider><Game /><UsageNoticePlaceholder /></UsageProvider></AuthAccountContext.Provider></StrictMode>);
    expect(env.element.textContent).toBe("Local game");
    expect(getSupabaseAuthClient).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
    expect(setInterval).not.toHaveBeenCalled(); expect(env.browser.localStorage.setItem).not.toHaveBeenCalled();
  });

  it("makes no usage call for a supplied account when hosted configuration is partial", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.invalid"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    const env = phoneTestDom();
    await env.render(<AuthAccountContext.Provider value="account-a"><UsageProvider><UsageNoticePlaceholder /></UsageProvider></AuthAccountContext.Provider>);
    expect(env.element.textContent).toBe(""); expect(getSupabaseAuthClient).not.toHaveBeenCalled();
  });
});
