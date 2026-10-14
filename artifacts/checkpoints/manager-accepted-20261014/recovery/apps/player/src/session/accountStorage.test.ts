import { afterEach, describe, expect, it, vi } from "vitest";
import type { FounderIdentity } from "@gamify-surgery/game-domain";
import { serializeGameState } from "@gamify-surgery/game-domain";
import { accountStorageKey } from "./accountStorageKey";
import {
  appendLocalCampaign, clearPrototypeCampaignStorage, createFreshProfile, createPrototypeCampaignWriteGate,
  LEGACY_PROTOTYPE_SAVE_KEY, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult,
} from "./prototypeStorage";
import { loadQuestionReviewFlags, QUESTION_REVIEW_FLAGS_STORAGE_KEY, saveQuestionReviewFlags } from "./questionReviewFlags";

const founder: FounderIdentity = { displayName: "Synthetic Founder", headId: "head.test", bodyId: "body.test",
  appearance: { version: "pixel-avatar.v1", bodyShape: "broad", hairStyle: "parted", hairShade: 3,
    faceStyle: "square", outfitStyle: "checked", outfitShade: 2, accessory: "none" } };
function storage() {
  const values = new Map<string, string>();
  const browserStorage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  vi.stubGlobal("window", { localStorage: browserStorage });
  return { values, browserStorage };
}
afterEach(() => vi.unstubAllGlobals());

describe("Beta 1 local account ownership", () => {
  it("loads A and B independently and leaves the preexisting prototype profile byte-unchanged", () => {
    const { values } = storage();
    const local = appendLocalCampaign(createFreshProfile(), founder, "Owner Local", 100).profile;
    expect(savePrototypeProfileResult(local).ok).toBe(true);
    const original = values.get(PROTOTYPE_PROFILE_KEY);
    expect(loadPrototypeProfile("account-a").profile.campaigns).toEqual([]);
    expect(loadPrototypeProfile("account-b").profile.campaigns).toEqual([]);
    const a = appendLocalCampaign(createFreshProfile(), founder, "Tester A", 200).profile;
    const b = appendLocalCampaign(createFreshProfile(), founder, "Tester B", 300).profile;
    expect(savePrototypeProfileResult(a, "account-a").ok).toBe(true);
    expect(savePrototypeProfileResult(b, "account-b").ok).toBe(true);
    expect(loadPrototypeProfile("account-a").profile.campaigns[0]?.name).toBe("Tester A");
    expect(loadPrototypeProfile("account-b").profile.campaigns[0]?.name).toBe("Tester B");
    expect(loadPrototypeProfile().profile.campaigns[0]?.name).toBe("Owner Local");
    expect(values.get(PROTOTYPE_PROFILE_KEY)).toBe(original);
  });

  it("keeps historical single-save migration exclusive to the local fallback", () => {
    const { values } = storage();
    const legacy = appendLocalCampaign(createFreshProfile(), founder, "Legacy", 100).campaign;
    const original = serializeGameState(legacy.state);
    values.set(LEGACY_PROTOTYPE_SAVE_KEY, original);
    expect(loadPrototypeProfile("account-a").profile.campaigns).toEqual([]);
    expect(values.has(PROTOTYPE_PROFILE_KEY)).toBe(false);
    expect(loadPrototypeProfile().profile.campaigns[0]?.state.campaignId).toBe(legacy.campaignId);
    expect(values.get(LEGACY_PROTOTYPE_SAVE_KEY)).toBe(original);
  });

  it("captures account ownership in an old writer and limits Clear local campaigns to the signed-in account", () => {
    const { values } = storage();
    const a = appendLocalCampaign(createFreshProfile(), founder, "A", 200).profile;
    const b = appendLocalCampaign(createFreshProfile(), founder, "B", 300).profile;
    const oldWriter = createPrototypeCampaignWriteGate("account-a");
    savePrototypeProfileResult(b, "account-b");
    savePrototypeProfileResult(createFreshProfile()); values.set(LEGACY_PROTOTYPE_SAVE_KEY, "untouched legacy");
    const bBytes = values.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b"));
    oldWriter.save(a); // A's delayed cleanup, after B has signed in.
    expect(values.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b"))).toBe(bBytes);
    expect(clearPrototypeCampaignStorage("account-a")).toEqual({ ok: true });
    oldWriter.suppress(); expect(oldWriter.save(a).ok).toBe(false);
    expect(values.has(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a"))).toBe(false);
    expect(values.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-b"))).toBe(bBytes);
    expect(values.get(LEGACY_PROTOTYPE_SAVE_KEY)).toBe("untouched legacy");
    expect(values.has(PROTOTYPE_PROFILE_KEY)).toBe(true);
  });

  it("preserves a damaged scoped save without trying another account or the legacy profile", () => {
    const { values } = storage();
    values.set(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a"), "damaged A");
    values.set(LEGACY_PROTOTYPE_SAVE_KEY, "owner legacy");
    expect(loadPrototypeProfile("account-a").notice).toContain("left untouched");
    expect(values.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, "account-a"))).toBe("damaged A");
    expect(values.get(LEGACY_PROTOTYPE_SAVE_KEY)).toBe("owner legacy");
  });

  it("also isolates existing local review flags without any hosted flag upload", () => {
    const { values, browserStorage } = storage();
    values.set(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "unowned flags untouched");
    expect(saveQuestionReviewFlags([], browserStorage, "account-a")).toBe(true);
    expect(loadQuestionReviewFlags(browserStorage, "account-b")).toEqual([]);
    expect(values.get(QUESTION_REVIEW_FLAGS_STORAGE_KEY)).toBe("unowned flags untouched");
    expect(values.has(accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "account-a"))).toBe(true);
    expect(values.has(accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "account-b"))).toBe(false);
  });
});
