import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FounderIdentity } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { accountStorageKey } from "./accountStorageKey";
import { appendLocalCampaign, createFreshProfile, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";

afterEach(cleanupPhoneTests);
describe("actual local session under account auth context", () => {
  it("loads the matching clinic and persists final staged ticks on account-switch cleanup in its original namespace", async () => {
    vi.useFakeTimers();
    const env = phoneTestDom();
    const stored = new Map<string, string>();
    Object.assign(env.browser.localStorage, { getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value), removeItem: (key: string) => stored.delete(key) });
    Object.assign(env.doc, { visibilityState: "visible" });
    const callbacks: (() => void)[] = [];
    Object.assign(env.browser, { setInterval: (callback: () => void) => { callbacks.push(callback); return callbacks.length; }, clearInterval: vi.fn() });
    const founder: FounderIdentity = { displayName: "Synthetic Founder", headId: "head.test", bodyId: "body.test",
      appearance: { version: "pixel-avatar.v1", bodyShape: "broad", hairStyle: "parted", hairShade: 3,
        faceStyle: "square", outfitStyle: "checked", outfitShade: 2, accessory: "none" } };
    const a = appendLocalCampaign(createFreshProfile(), founder, "A Clinic", 100, undefined, false).profile;
    const b = appendLocalCampaign(createFreshProfile(), founder, "B Clinic", 200, undefined, false).profile;
    savePrototypeProfileResult(a, "account-a"); savePrototypeProfileResult(b, "account-b");
    const bBefore = stored.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b"));
    let current!: PrototypeSession;
    function Game() { current = usePrototypeSession(); return <p>{current.campaigns[0]?.name}</p>; }
    await env.render(<AuthAccountContext.Provider key="a" value="account-a"><Game /></AuthAccountContext.Provider>);
    expect(env.element.textContent).toBe("A Clinic");
    if (current.state.paused) await act(async () => { current.togglePause(); });
    expect(current.state.paused).toBe(false);
    const tickBefore = current.state.facilityTick;
    await act(async () => { vi.advanceTimersByTime(1_000); callbacks.at(-1)!(); });
    expect(current.state.facilityTick).toBeGreaterThan(tickBefore);
    const finalTick = current.state.facilityTick;
    await env.render(<AuthAccountContext.Provider key="b" value="account-b"><Game /></AuthAccountContext.Provider>);
    expect(env.element.textContent).toBe("B Clinic");
    expect(loadPrototypeProfile("account-a").profile.campaigns[0]?.state.facilityTick).toBe(finalTick);
    expect(stored.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b"))).toBe(bBefore);
    expect(stored.has(PROTOTYPE_PROFILE_KEY)).toBe(false);
  });
});
