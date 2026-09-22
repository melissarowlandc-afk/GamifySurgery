import { afterEach, describe, expect, it, vi } from "vitest";
import {
  normalizePixelAppearance,
  type FounderIdentity,
} from "@gamify-surgery/game-domain";
import {
  appendLocalCampaign,
  clearPrototypeCampaignStorage,
  createPrototypeCampaignWriteGate,
  createFreshProfile,
  getActiveCampaign,
  loadPrototypeProfile,
  savePrototypeProfile,
  savePrototypeProfileResult,
} from "./prototypeStorage";

const PROFILE_STORAGE_KEY = "gamify-surgery.prototype.profile.v1";
const LEGACY_STORAGE_KEY = "gamify-surgery.prototype.save.v1";

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

describe("prototype storage diagnostics and campaign-only reset", () => {
  it.each([
    ["QuotaExceededError", "quota"],
    ["SecurityError", "security"],
    ["NotAllowedError", "not_allowed"],
    ["UnexpectedError", "unknown"],
  ] as const)("classifies %s without discarding size context", (name, category) => {
    vi.stubGlobal("window", {
      localStorage: {
        setItem: () => {
          const error = new Error(" browser   refused this write ");
          error.name = name;
          throw error;
        },
      },
    });

    const result = savePrototypeProfileResult(createFreshProfile());

    expect(result).toMatchObject({
      ok: false,
      failure: {
        category,
        operation: "write",
        name,
        message: "browser refused this write",
      },
    });
    if (!result.ok) {
      expect(result.failure.profileCharacters).toBeGreaterThan(0);
    }
  });

  it("reports unavailable storage access distinctly", () => {
    vi.stubGlobal("window", {
      get localStorage() {
        const error = new Error("site data disabled");
        error.name = "SecurityError";
        throw error;
      },
    });

    expect(savePrototypeProfileResult(createFreshProfile())).toMatchObject({
      ok: false,
      failure: { category: "security", operation: "access" },
    });
  });

  it("explains a fresh-profile write failure instead of collapsing it to a generic warning", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          const error = new Error("storage full");
          error.name = "QuotaExceededError";
          throw error;
        },
      },
    });

    expect(loadPrototypeProfile().notice).toContain("Browser storage is full");
  });

  it("clears only legacy campaign keys and leaves other storage untouched", () => {
    const values = useMemoryStorage();
    values.set(PROFILE_STORAGE_KEY, "profile");
    values.set(LEGACY_STORAGE_KEY, "legacy");
    values.set("workspace-map-share", "0.6");
    values.set("question-review-flags", "flags");
    const storage = window.localStorage as Storage & { removeItem?: (key: string) => void };
    storage.removeItem = (key) => values.delete(key);

    expect(clearPrototypeCampaignStorage()).toEqual({ ok: true });
    expect(values.has(PROFILE_STORAGE_KEY)).toBe(false);
    expect(values.has(LEGACY_STORAGE_KEY)).toBe(false);
    expect(values.get("workspace-map-share")).toBe("0.6");
    expect(values.get("question-review-flags")).toBe("flags");
  });

  it("does not claim reset success when key removal fails", () => {
    vi.stubGlobal("window", {
      localStorage: {
        removeItem: () => {
          const error = new Error("blocked");
          error.name = "NotAllowedError";
          throw error;
        },
      },
    });

    expect(clearPrototypeCampaignStorage()).toMatchObject({
      ok: false,
      failure: { category: "not_allowed", operation: "remove" },
    });
  });

  it("attempts both campaign-key removals when the second removal fails", () => {
    const removed: string[] = [];
    const sessionValues = new Map([["auth-session", "keep"]]);
    vi.stubGlobal("window", {
      localStorage: {
        removeItem: (key: string) => {
          removed.push(key);
          if (key === LEGACY_STORAGE_KEY) {
            const error = new Error("legacy key blocked");
            error.name = "SecurityError";
            throw error;
          }
        },
      },
      sessionStorage: {
        getItem: (key: string) => sessionValues.get(key) ?? null,
      },
    });

    expect(clearPrototypeCampaignStorage()).toMatchObject({
      ok: false,
      failure: { category: "security", operation: "remove" },
    });
    expect(removed).toEqual([PROFILE_STORAGE_KEY, LEGACY_STORAGE_KEY]);
    expect(window.sessionStorage.getItem("auth-session")).toBe("keep");
  });

  it("suppresses a page-exit-style write after reset so campaigns cannot return", () => {
    const values = useMemoryStorage();
    const storage = window.localStorage as Storage & { removeItem?: (key: string) => void };
    storage.removeItem = (key) => values.delete(key);
    const profile = createFreshProfile();
    expect(savePrototypeProfile(profile)).toBe(true);

    const gate = createPrototypeCampaignWriteGate();
    gate.suppress();
    expect(clearPrototypeCampaignStorage()).toEqual({ ok: true });
    expect(gate.save(profile)).toMatchObject({
      ok: false,
      failure: { name: "CampaignWritesSuppressed" },
    });
    expect(values.has(PROFILE_STORAGE_KEY)).toBe(false);
  });

  it("keeps the exit-write gate suppressed after a partial reset failure", () => {
    const values = useMemoryStorage();
    const storage = window.localStorage as Storage & { removeItem?: (key: string) => void };
    storage.removeItem = (key) => {
      if (key === LEGACY_STORAGE_KEY) {
        const error = new Error("blocked");
        error.name = "NotAllowedError";
        throw error;
      }
      values.delete(key);
    };
    const profile = createFreshProfile();
    expect(savePrototypeProfile(profile)).toBe(true);
    const gate = createPrototypeCampaignWriteGate();

    gate.suppress();
    expect(gate).not.toHaveProperty("resume");
    expect(gate.isSuppressed()).toBe(true);
    expect(clearPrototypeCampaignStorage()).toMatchObject({ ok: false });
    expect(gate.save(profile)).toMatchObject({
      ok: false,
      failure: { name: "CampaignWritesSuppressed" },
    });
    expect(values.has(PROFILE_STORAGE_KEY)).toBe(false);
  });
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
    expect(created.campaign.state.founder).toEqual({
      ...FOUNDER,
      appearance: normalizePixelAppearance(
        FOUNDER.appearance,
        "founder",
      ),
    });
    expect(created.campaign.state.facilityTick).toBe(0);
    expect(created.campaign.state.clinicalXp).toBe(0);
    expect(
      created.campaign.state.rooms.some(
        (room) => room.roomDefinitionId === "room.examination",
      ),
    ).toBe(false);
    expect(
      Object.values(created.campaign.state.learningHistories).every(
        (history) => history.reviews.length === 0,
      ),
    ).toBe(true);
  });

  it("preserves a historical starter-ID Examination Room without reseeding it", () => {
    const state = appendLocalCampaign(
      createFreshProfile(),
      FOUNDER,
      "Built Room Surgical",
      123,
      "built-room-seed",
    ).campaign.state;
    state.rooms.push({
      id: "room.instance.starter_examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.instance.starter_examination",
      roomId: "room.instance.starter_examination",
      side: "south",
      offset: 1,
      exterior: false,
    });
    state.cash = 37;
    state.cashCents = 3_700;
    state.clinicalXp = 20;
    const profile = {
      ...createFreshProfile(),
      activeCampaignId: state.campaignId,
      campaigns: [{
        campaignId: state.campaignId,
        name: "Built Room Surgical",
        createdAtRealMs: 123,
        updatedAtRealMs: 123,
        status: "resumable" as const,
        state,
      }],
    };
    useMemoryStorage();
    expect(savePrototypeProfile(profile)).toBe(true);

    const restored = getActiveCampaign(loadPrototypeProfile().profile)!;
    expect(
      restored.state.rooms.filter(
        (room) => room.roomDefinitionId === "room.examination",
      ),
    ).toEqual([
      expect.objectContaining({ id: "room.instance.starter_examination" }),
    ]);
    expect(restored.state.doors.filter(
      (door) => door.roomId === "room.instance.starter_examination",
    )).toEqual([
      expect.objectContaining({ id: "door.instance.starter_examination" }),
    ]);
    expect(restored.state.cash).toBe(37);
    expect(restored.state.clinicalXp).toBe(20);
  });

  it("reloads a new campaign without silently adding an Examination Room", () => {
    const created = appendLocalCampaign(
      createFreshProfile(),
      FOUNDER,
      "No Reseed Surgical",
      456,
      "no-reseed-seed",
    );
    useMemoryStorage();
    expect(savePrototypeProfile(created.profile)).toBe(true);

    const restored = getActiveCampaign(loadPrototypeProfile().profile)!;
    expect(restored.state.rooms).toHaveLength(1);
    expect(restored.state.rooms[0]).toMatchObject({
      id: "room.instance.founder_desk",
      roomDefinitionId: "room.front_desk",
    });
    expect(restored.state.doors).toHaveLength(1);
    expect(restored.state.doors[0]).toMatchObject({
      id: "door.instance.front_entrance",
      roomId: "room.instance.founder_desk",
    });
  });

  it("enables tutorial guidance for every newly created campaign", () => {
    const profile = {
      ...createFreshProfile(),
      tutorialsEnabled: false,
      tutorialIntroDismissedCampaignIds: ["campaign.previous"],
    };

    const created = appendLocalCampaign(
      profile,
      FOUNDER,
      "Tutorial Returns Surgical",
      456,
      "tutorial-returns-seed",
    );

    expect(created.profile.tutorialsEnabled).toBe(true);
    expect(
      created.profile.tutorialIntroDismissedCampaignIds,
    ).not.toContain(created.campaign.campaignId);
  });

  it("round-trips per-campaign operations-tip acknowledgments and pause ownership", () => {
    useMemoryStorage();
    const created = appendLocalCampaign(createFreshProfile(), FOUNDER, "Tip Clinic", 789, "tip-save-seed");
    const campaignId = created.campaign.campaignId;
    const profile = {
      ...created.profile,
      tutorialDailyRoutineTipAcknowledgments: { [campaignId]: ["sendout-management", "sendout-trash"] },
      tutorialDailyRoutinePauseByCampaign: { [campaignId]: false },
    };
    expect(savePrototypeProfile(profile)).toBe(true);
    expect(loadPrototypeProfile().profile).toMatchObject({
      tutorialDailyRoutineTipAcknowledgments: { [campaignId]: ["sendout-management", "sendout-trash"] },
      tutorialDailyRoutinePauseByCampaign: { [campaignId]: false },
    });
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
