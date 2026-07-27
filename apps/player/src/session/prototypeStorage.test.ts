import { afterEach, describe, expect, it, vi } from "vitest";
import type { FounderIdentity } from "@gamify-surgery/game-domain";
import {
  appendLocalCampaign,
  createFreshProfile,
  getActiveCampaign,
  loadPrototypeProfile,
  savePrototypeProfile,
} from "./prototypeStorage";

const PROFILE_STORAGE_KEY = "gamify-surgery.prototype.profile.v1";

const FOUNDER: FounderIdentity = {
  displayName: "Avery",
  headId: "head.test",
  bodyId: "body.test",
  appearance: {
    version: "pixel-avatar.v1",
    bodyShape: "broad",
    hairStyle: "parted",
    hairShade: 3,
    faceStyle: "square",
    outfitStyle: "checked",
    outfitShade: 2,
    accessory: "none",
  },
};

function useMemoryStorage(): Map<string, string> {
  const storedValues = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => storedValues.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storedValues.set(key, value);
      },
    },
  });
  return storedValues;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("new-campaign opening storage", () => {
  it("starts without a campaign, clinic, or FSRS history", () => {
    const profile = createFreshProfile();

    expect(profile.activeCampaignId).toBeNull();
    expect(profile.campaigns).toEqual([]);
    expect(getActiveCampaign(profile)).toBeNull();
  });

  it("creates the Level 0 campaign only when the clinic branch is committed", () => {
    const untouchedProfile = createFreshProfile();
    const created = appendLocalCampaign(
      untouchedProfile,
      FOUNDER,
      "Kent Surgical",
      123,
      "opening-test-seed",
    );

    expect(untouchedProfile.campaigns).toEqual([]);
    expect(created.profile.campaigns).toHaveLength(1);
    expect(created.profile.nextCampaignNumber).toBe(2);
    expect(created.campaign.state.founder).toEqual(FOUNDER);
    expect(created.campaign.state.facilityTick).toBe(0);
    expect(created.campaign.state.clinicalXp).toBe(0);
    expect(
      Object.values(created.campaign.state.learningHistories).every(
        (history) => history.reviews.length === 0,
      ),
    ).toBe(true);
  });

  it("round-trips an intentional no-active-campaign state with archived campaigns", () => {
    useMemoryStorage();
    const created = appendLocalCampaign(
      createFreshProfile(),
      FOUNDER,
      "Archived Surgical",
      123,
      "archived-campaign-seed",
    );
    const profile = {
      ...created.profile,
      activeCampaignId: null,
      campaigns: created.profile.campaigns.map((campaign) => ({
        ...campaign,
        status: "archived" as const,
      })),
    };

    expect(savePrototypeProfile(profile)).toBe(true);

    const loaded = loadPrototypeProfile();
    expect(loaded.profile.activeCampaignId).toBeNull();
    expect(getActiveCampaign(loaded.profile)).toBeNull();
    expect(loaded.profile.campaigns).toHaveLength(1);
    expect(loaded.profile.campaigns[0]?.status).toBe("archived");
  });

  it("keeps a null active campaign after incompatible archived records are skipped", () => {
    const storedValues = useMemoryStorage();
    const created = appendLocalCampaign(
      createFreshProfile(),
      FOUNDER,
      "Compatible Surgical",
      123,
      "compatible-archived-seed",
    );
    const profile = {
      ...created.profile,
      activeCampaignId: null,
      campaigns: created.profile.campaigns.map((campaign) => ({
        ...campaign,
        status: "archived" as const,
      })),
    };
    expect(savePrototypeProfile(profile)).toBe(true);

    const persistedProfile = JSON.parse(
      storedValues.get(PROFILE_STORAGE_KEY) ?? "{}",
    ) as { campaigns?: unknown[] };
    persistedProfile.campaigns?.push({
      campaignId: "campaign.local.incompatible",
      name: "Broken archive",
      createdAtRealMs: 123,
      updatedAtRealMs: 123,
      status: "archived",
      serializedState: "{}",
    });
    storedValues.set(PROFILE_STORAGE_KEY, JSON.stringify(persistedProfile));

    const loaded = loadPrototypeProfile();
    expect(loaded.profile.activeCampaignId).toBeNull();
    expect(getActiveCampaign(loaded.profile)).toBeNull();
    expect(loaded.profile.campaigns).toHaveLength(1);
    expect(loaded.profile.campaigns[0]?.status).toBe("archived");
    expect(loaded.notice).toContain("1 incompatible local campaign was skipped");
  });
});
