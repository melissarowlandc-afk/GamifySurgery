import { afterEach, describe, expect, it, vi } from "vitest";
import { accountStorageKey } from "../session/accountStorageKey";
import { createFreshProfile, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY } from "../session/prototypeStorage";
import { createQaDeviceCampaign, seedQaDeviceCampaigns } from "./cloudSavesQaSeed";

afterEach(() => vi.unstubAllGlobals());
const key = accountStorageKey(PROTOTYPE_PROFILE_KEY, "qa-account-a");
function storage(initial: [string, string][] = []) {
  const values = new Map(initial);
  const localStorage = { getItem: vi.fn((name: string) => values.get(name) ?? null),
    setItem: vi.fn((name: string, value: string) => values.set(name, value)) };
  vi.stubGlobal("window", { localStorage });
  return { values, localStorage };
}

describe("disposable cloud QA device fixtures", () => {
  it.each([null, "0", "-1", "invalid"])("leaves fresh cloud contexts without any local profile (%s)", requested => {
    const f = storage();
    seedQaDeviceCampaigns("qa-account-a", requested);
    expect(f.values.has(key)).toBe(false);
    expect(f.localStorage.getItem).not.toHaveBeenCalled();
    expect(f.localStorage.setItem).not.toHaveBeenCalled();
  });
  it.each([JSON.stringify(createFreshProfile()), "Unrecognized original bytes"])("discovers an existing profile without rewriting its bytes", raw => {
    const f = storage([[key, raw], [PROTOTYPE_PROFILE_KEY, "Unowned original"]]);
    seedQaDeviceCampaigns("qa-account-a", "3");
    expect([...f.values]).toEqual([[key, raw], [PROTOTYPE_PROFILE_KEY, "Unowned original"]]);
    expect(f.localStorage.setItem).not.toHaveBeenCalled();
  });
  it.each([1, 2, 3])("explicitly prepares %s synthetic campaigns without writing an empty profile", count => {
    const f = storage([[accountStorageKey(PROTOTYPE_PROFILE_KEY, "qa-account-b"), "Other account original"]]);
    seedQaDeviceCampaigns("qa-account-a", String(count));
    const raw = f.values.get(key)!;
    const campaigns = loadPrototypeProfile("qa-account-a").profile.campaigns;
    expect(campaigns.map(campaign => campaign.name)).toEqual(Array.from({ length: count }, (_, index) => `Synthetic clinic ${index + 1}`));
    expect(campaigns.every(campaign => campaign.state.paused)).toBe(true);
    expect(f.localStorage.setItem.mock.calls.every(([name, text]) => name === key && JSON.parse(text).campaigns.length > 0)).toBe(true);
    const writes = f.localStorage.setItem.mock.calls.length;
    seedQaDeviceCampaigns("qa-account-a", String(count));
    expect(f.values.get(key)).toBe(raw); expect(f.localStorage.setItem).toHaveBeenCalledTimes(writes);
    expect(f.values.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "qa-account-b"))).toBe("Other account original");
  });
  it("retains a seeded original until the QA create button is explicitly used", () => {
    const f = storage(); seedQaDeviceCampaigns("qa-account-a", "1");
    const original = f.values.get(key);
    seedQaDeviceCampaigns("qa-account-a", null); expect(f.values.get(key)).toBe(original);
    createQaDeviceCampaign("qa-account-a");
    expect(loadPrototypeProfile("qa-account-a").profile.campaigns.map(campaign => campaign.name)).toEqual(["Synthetic clinic 1", "Synthetic clinic 2"]);
  });
});
