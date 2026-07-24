import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";

const LEGACY_PROTOTYPE_SAVE_KEY = "gamify-surgery.prototype.save.v1";
const PROTOTYPE_PROFILE_KEY = "gamify-surgery.prototype.profile.v1";
const PROFILE_SCHEMA_VERSION = 1;

export type LocalCampaignStatus = "active" | "archived";

export interface LocalCampaignRecord {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  updatedAtRealMs: number;
  status: LocalCampaignStatus;
  state: GameState;
}

export interface LocalPrototypeProfile {
  schemaVersion: typeof PROFILE_SCHEMA_VERSION;
  activeCampaignId: string;
  nextCampaignNumber: number;
  tutorialsEnabled: boolean;
  tutorialIntroDismissedCampaignIds: string[];
  campaigns: LocalCampaignRecord[];
}

export interface LoadedPrototypeProfile {
  profile: LocalPrototypeProfile;
  notice: string;
}

interface PersistedCampaignRecord {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  updatedAtRealMs: number;
  status: LocalCampaignStatus;
  serializedState: string;
}

interface PersistedPrototypeProfile {
  schemaVersion: typeof PROFILE_SCHEMA_VERSION;
  activeCampaignId: string;
  nextCampaignNumber: number;
  tutorialsEnabled: boolean;
  tutorialIntroDismissedCampaignIds: string[];
  campaigns: PersistedCampaignRecord[];
}

function storageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage !== undefined;
  } catch {
    return false;
  }
}

function createUniqueToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  const randomPart = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  return `${Date.now().toString(36)}-${randomPart.toString(36)}`;
}

export function createLocalCampaign(
  campaignNumber: number,
  existingCampaignIds: ReadonlySet<string> = new Set(),
  now = Date.now(),
  campaignSeed?: string,
): LocalCampaignRecord {
  let token = createUniqueToken();
  let campaignId = `campaign.local.${token}`;
  while (existingCampaignIds.has(campaignId)) {
    token = createUniqueToken();
    campaignId = `campaign.local.${token}`;
  }

  const state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId,
    campaignSeed: campaignSeed ?? `prototype-seed.${token}`,
    createdAtRealMs: now,
  });

  return {
    campaignId,
    name: `Clinic ${campaignNumber}`,
    createdAtRealMs: now,
    updatedAtRealMs: now,
    status: "active",
    state,
  };
}

function createFreshProfile(now = Date.now()): LocalPrototypeProfile {
  const campaign = createLocalCampaign(1, new Set(), now);
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    activeCampaignId: campaign.campaignId,
    nextCampaignNumber: 2,
    tutorialsEnabled: true,
    tutorialIntroDismissedCampaignIds: [],
    campaigns: [campaign],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSafeTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function parsePersistedProfile(serialized: string): {
  profile: LocalPrototypeProfile;
  skippedCampaignCount: number;
} {
  const candidate: unknown = JSON.parse(serialized);
  if (
    !isRecord(candidate) ||
    candidate.schemaVersion !== PROFILE_SCHEMA_VERSION ||
    typeof candidate.activeCampaignId !== "string" ||
    !Number.isSafeInteger(candidate.nextCampaignNumber) ||
    (candidate.nextCampaignNumber as number) < 1 ||
    !Array.isArray(candidate.campaigns)
  ) {
    throw new Error("Invalid local profile envelope.");
  }

  const campaigns: LocalCampaignRecord[] = [];
  let skippedCampaignCount = 0;

  for (const rawCampaign of candidate.campaigns) {
    try {
      if (
        !isRecord(rawCampaign) ||
        typeof rawCampaign.campaignId !== "string" ||
        typeof rawCampaign.name !== "string" ||
        rawCampaign.name.trim().length === 0 ||
        !isSafeTimestamp(rawCampaign.createdAtRealMs) ||
        !isSafeTimestamp(rawCampaign.updatedAtRealMs) ||
        (rawCampaign.status !== "active" &&
          rawCampaign.status !== "archived") ||
        typeof rawCampaign.serializedState !== "string"
      ) {
        throw new Error("Invalid local campaign record.");
      }

      const state = deserializeGameState(rawCampaign.serializedState);
      if (state.campaignId !== rawCampaign.campaignId) {
        throw new Error("Campaign identity mismatch.");
      }
      campaigns.push({
        campaignId: rawCampaign.campaignId,
        name: rawCampaign.name,
        createdAtRealMs: rawCampaign.createdAtRealMs,
        updatedAtRealMs: rawCampaign.updatedAtRealMs,
        status: rawCampaign.status,
        state,
      });
    } catch {
      skippedCampaignCount += 1;
    }
  }

  if (campaigns.length === 0) {
    throw new Error("No compatible campaigns remain in the local profile.");
  }

  const requestedActiveCampaign = campaigns.find(
    (campaign) => campaign.campaignId === candidate.activeCampaignId,
  );
  const activeCampaign = requestedActiveCampaign ?? campaigns[0];
  if (!activeCampaign) {
    throw new Error("No active local campaign is available.");
  }

  return {
    profile: {
      schemaVersion: PROFILE_SCHEMA_VERSION,
      activeCampaignId: activeCampaign.campaignId,
      nextCampaignNumber: candidate.nextCampaignNumber as number,
      tutorialsEnabled:
        typeof candidate.tutorialsEnabled === "boolean"
          ? candidate.tutorialsEnabled
          : true,
      tutorialIntroDismissedCampaignIds: Array.isArray(
        candidate.tutorialIntroDismissedCampaignIds,
      )
        ? Array.from(
            new Set(
              candidate.tutorialIntroDismissedCampaignIds.filter(
                (campaignId): campaignId is string =>
                  typeof campaignId === "string",
              ),
            ),
          )
        : [],
      campaigns: campaigns.map((campaign) => ({
        ...campaign,
        status:
          campaign.campaignId === activeCampaign.campaignId
            ? "active"
            : "archived",
      })),
    },
    skippedCampaignCount,
  };
}

function migrateLegacySave(serializedState: string): LocalPrototypeProfile {
  const state = deserializeGameState(serializedState);
  const now = Date.now();
  const createdAtRealMs =
    state.createdAtRealMs > 0 ? state.createdAtRealMs : now;
  const campaign: LocalCampaignRecord = {
    campaignId: state.campaignId,
    name: "Clinic 1",
    createdAtRealMs,
    updatedAtRealMs: now,
    status: "active",
    state,
  };
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    activeCampaignId: campaign.campaignId,
    nextCampaignNumber: 2,
    tutorialsEnabled: true,
    tutorialIntroDismissedCampaignIds: [],
    campaigns: [campaign],
  };
}

export function getActiveCampaign(
  profile: LocalPrototypeProfile,
): LocalCampaignRecord {
  const activeCampaign = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!activeCampaign) {
    throw new Error("The local profile has no active campaign.");
  }
  return activeCampaign;
}

export function loadPrototypeProfile(): LoadedPrototypeProfile {
  if (!storageAvailable()) {
    return {
      profile: createFreshProfile(),
      notice: "Local saving is unavailable in this browser session.",
    };
  }

  try {
    const serializedProfile = window.localStorage.getItem(
      PROTOTYPE_PROFILE_KEY,
    );
    if (serializedProfile !== null) {
      const { profile, skippedCampaignCount } =
        parsePersistedProfile(serializedProfile);
      return {
        profile,
        notice:
          skippedCampaignCount === 0
            ? "Local campaigns restored."
            : `${skippedCampaignCount} incompatible local campaign${
                skippedCampaignCount === 1 ? " was" : "s were"
              } skipped; compatible campaigns were restored.`,
      };
    }

    const legacySave = window.localStorage.getItem(
      LEGACY_PROTOTYPE_SAVE_KEY,
    );
    if (legacySave !== null) {
      const profile = migrateLegacySave(legacySave);
      const persisted = savePrototypeProfile(profile);
      return {
        profile,
        notice: persisted
          ? "Existing local save migrated into the campaign list."
          : "Existing local save opened, but the campaign list could not be saved.",
      };
    }

    const profile = createFreshProfile();
    const persisted = savePrototypeProfile(profile);
    return {
      profile,
      notice: persisted
        ? "New synthetic clinic started."
        : "New clinic started, but local saving is unavailable.",
    };
  } catch {
    const profile = createFreshProfile();
    return {
      profile,
      notice:
        "The local campaign data was incompatible, so a new synthetic clinic was started. Existing browser data was left untouched.",
    };
  }
}

export function savePrototypeProfile(
  profile: LocalPrototypeProfile,
): boolean {
  if (!storageAvailable()) {
    return false;
  }

  const persistedProfile: PersistedPrototypeProfile = {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    activeCampaignId: profile.activeCampaignId,
    nextCampaignNumber: profile.nextCampaignNumber,
    tutorialsEnabled: profile.tutorialsEnabled,
    tutorialIntroDismissedCampaignIds:
      profile.tutorialIntroDismissedCampaignIds,
    campaigns: profile.campaigns.map((campaign) => ({
      campaignId: campaign.campaignId,
      name: campaign.name,
      createdAtRealMs: campaign.createdAtRealMs,
      updatedAtRealMs: campaign.updatedAtRealMs,
      status: campaign.status,
      serializedState: serializeGameState(campaign.state),
    })),
  };

  try {
    window.localStorage.setItem(
      PROTOTYPE_PROFILE_KEY,
      JSON.stringify(persistedProfile),
    );
    return true;
  } catch {
    return false;
  }
}
