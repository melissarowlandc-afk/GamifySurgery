import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
  type FounderIdentity,
  type GameState,
} from "@gamify-surgery/game-domain";

export const LEGACY_PROTOTYPE_SAVE_KEY = "gamify-surgery.prototype.save.v1";
export const PROTOTYPE_PROFILE_KEY = "gamify-surgery.prototype.profile.v1";
const PROFILE_SCHEMA_VERSION = 2;

export type LocalCampaignStatus = "resumable" | "archived";

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
  activeCampaignId: string | null;
  /** Retained only to migrate historical automatically named local saves. */
  nextCampaignNumber: number;
  tutorialsEnabled: boolean;
  tutorialIntroDismissedCampaignIds: string[];
  /** Completed optional operations tips, kept per campaign so a reload cannot replay them. */
  tutorialDailyRoutineTipAcknowledgments: Record<string, string[]>;
  /** Previous paused value while an operations tip owns the temporary pause. */
  tutorialDailyRoutinePauseByCampaign: Record<string, boolean>;
  campaigns: LocalCampaignRecord[];
}

export interface LoadedPrototypeProfile {
  profile: LocalPrototypeProfile;
  notice: string;
}

export type PrototypeStorageFailureCategory =
  | "quota"
  | "security"
  | "not_allowed"
  | "unavailable"
  | "serialization"
  | "validation"
  | "unknown";

export interface PrototypeStorageFailure {
  category: PrototypeStorageFailureCategory;
  operation: "access" | "serialize" | "write" | "remove";
  name: string;
  message: string;
  profileCharacters?: number;
}

export type PrototypeSaveResult =
  | { ok: true; profileCharacters: number }
  | { ok: false; failure: PrototypeStorageFailure };

export type PrototypeResetResult =
  | { ok: true }
  | { ok: false; failure: PrototypeStorageFailure };

export interface PrototypeCampaignWriteGate {
  save: (profile: LocalPrototypeProfile) => PrototypeSaveResult;
  suppress: () => void;
  isSuppressed: () => boolean;
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
  activeCampaignId: string | null;
  nextCampaignNumber: number;
  tutorialsEnabled: boolean;
  tutorialIntroDismissedCampaignIds: string[];
  tutorialDailyRoutineTipAcknowledgments: Record<string, string[]>;
  tutorialDailyRoutinePauseByCampaign: Record<string, boolean>;
  campaigns: PersistedCampaignRecord[];
}

function storageFailure(
  error: unknown,
  operation: PrototypeStorageFailure["operation"],
  profileCharacters?: number,
): PrototypeStorageFailure {
  const candidate = error as { name?: unknown; message?: unknown } | null;
  const name = typeof candidate?.name === "string" ? candidate.name : "UnknownError";
  const rawMessage =
    typeof candidate?.message === "string" ? candidate.message : String(error ?? "");
  const message = rawMessage.replace(/\s+/g, " ").trim().slice(0, 240);
  const category: PrototypeStorageFailureCategory =
    name === "QuotaExceededError"
      ? "quota"
      : name === "SecurityError"
        ? "security"
        : name === "NotAllowedError"
          ? "not_allowed"
          : name === "ValidationError"
            ? "validation"
            : "unknown";
  return {
    category,
    operation,
    name,
    message: message.length > 0 ? message : "No browser error message was provided.",
    ...(profileCharacters === undefined ? {} : { profileCharacters }),
  };
}

export function describePrototypeStorageFailure(
  failure: PrototypeStorageFailure,
): string {
  switch (failure.category) {
    case "quota":
      return "Browser storage is full. Clear local campaigns or free browser site data, then try saving again.";
    case "security":
      return "This browser blocked access to local storage. Use a normal, non-private browser window and allow site data.";
    case "not_allowed":
      return "This browser does not allow this site to save data. Check site-data permissions, then try again.";
    case "unavailable":
      return "Local storage is unavailable in this browser session. Check browser privacy or site-data settings.";
    case "serialization":
      return "The campaign could not be prepared for saving. Keep this tab open and try again.";
    case "validation":
      return "The campaign data could not be validated for saving. Keep this tab open and try again.";
    default:
      return "The browser rejected this save. Keep this tab open and try again, or clear local campaigns if you no longer need them.";
  }
}

function getBrowserStorage():
  | { ok: true; storage: Storage }
  | { ok: false; failure: PrototypeStorageFailure } {
  if (typeof window === "undefined") {
    return {
      ok: false,
      failure: {
        category: "unavailable",
        operation: "access",
        name: "StorageUnavailable",
        message: "Browser storage is not available outside a browser window.",
      },
    };
  }
  try {
    const storage = window.localStorage;
    if (storage === undefined || storage === null) {
      return {
        ok: false,
        failure: {
          category: "unavailable",
          operation: "access",
          name: "StorageUnavailable",
          message: "This browser session does not provide local storage.",
        },
      };
    }
    return { ok: true, storage };
  } catch (error) {
    return { ok: false, failure: storageFailure(error, "access") };
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
  clinicName: string,
  existingCampaignIds: ReadonlySet<string> = new Set(),
  now = Date.now(),
  campaignSeed?: string,
  founder?: FounderIdentity,
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
    ...(founder ? { founder } : {}),
  });

  return {
    campaignId,
    name: normalizeClinicName(clinicName),
    createdAtRealMs: now,
    updatedAtRealMs: now,
    status: "resumable",
    state,
  };
}

export function createFreshProfile(): LocalPrototypeProfile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    activeCampaignId: null,
    nextCampaignNumber: 1,
    tutorialsEnabled: true,
    tutorialIntroDismissedCampaignIds: [],
    tutorialDailyRoutineTipAcknowledgments: {},
    tutorialDailyRoutinePauseByCampaign: {},
    campaigns: [],
  };
}

export function appendLocalCampaign(
  profile: LocalPrototypeProfile,
  founder: FounderIdentity,
  clinicName: string,
  now = Date.now(),
  campaignSeed?: string,
): {
  profile: LocalPrototypeProfile;
  campaign: LocalCampaignRecord;
} {
  const normalizedName = normalizeClinicName(clinicName);
  if (normalizedName.length === 0) {
    throw new Error("Clinic name is required.");
  }
  if (clinicNameExists(profile, normalizedName)) {
    throw new Error("That clinic name already exists in town.");
  }
  const campaign = createLocalCampaign(
    normalizedName,
    new Set(profile.campaigns.map((existing) => existing.campaignId)),
    now,
    campaignSeed,
    founder,
  );
  return {
    campaign,
    profile: {
      ...profile,
      activeCampaignId: campaign.campaignId,
      nextCampaignNumber: profile.nextCampaignNumber + 1,
      // Every newly created clinic introduces the game from the beginning,
      // even if guidance was disabled during a different campaign.
      tutorialsEnabled: true,
      campaigns: [...profile.campaigns, campaign],
    },
  };
}

export function normalizeClinicName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function clinicNameKey(value: string): string {
  return normalizeClinicName(value).toLocaleLowerCase();
}

export function clinicNameExists(
  profile: Pick<LocalPrototypeProfile, "campaigns">,
  value: string,
): boolean {
  const candidate = clinicNameKey(value);
  return profile.campaigns.some(
    (campaign) => clinicNameKey(campaign.name) === candidate,
  );
}

export function selectLocalCampaign(
  profile: LocalPrototypeProfile,
  campaignId: string,
): LocalPrototypeProfile {
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === campaignId,
  );
  if (!campaign || campaign.status !== "resumable") {
    throw new Error("That clinic is not available to resume.");
  }
  return {
    ...profile,
    activeCampaignId: campaignId,
  };
}

export function archiveLocalCampaign(
  profile: LocalPrototypeProfile,
  campaignId: string,
): LocalPrototypeProfile {
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === campaignId,
  );
  if (!campaign) {
    throw new Error("That clinic could not be found.");
  }
  return {
    ...profile,
    activeCampaignId:
      profile.activeCampaignId === campaignId
        ? null
        : profile.activeCampaignId,
    campaigns: profile.campaigns.map((candidate) =>
      candidate.campaignId === campaignId
        ? { ...candidate, status: "archived" as const }
        : candidate,
    ),
  };
}

export function restoreLocalCampaign(
  profile: LocalPrototypeProfile,
  campaignId: string,
): LocalPrototypeProfile {
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === campaignId,
  );
  if (!campaign || campaign.status !== "archived") {
    throw new Error("That archived clinic could not be found.");
  }
  return {
    ...profile,
    activeCampaignId: campaignId,
    campaigns: profile.campaigns.map((candidate) =>
      candidate.campaignId === campaignId
        ? { ...candidate, status: "resumable" as const }
        : candidate,
    ),
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
    (candidate.schemaVersion !== 1 &&
      candidate.schemaVersion !== PROFILE_SCHEMA_VERSION) ||
    (candidate.activeCampaignId !== null &&
      typeof candidate.activeCampaignId !== "string") ||
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
          rawCampaign.status !== "resumable" &&
          rawCampaign.status !== "archived") ||
        typeof rawCampaign.serializedState !== "string"
      ) {
        throw new Error("Invalid local campaign record.");
      }

      const state = deserializeGameState(rawCampaign.serializedState);
      if (state.campaignId !== rawCampaign.campaignId) {
        throw new Error("Campaign identity mismatch.");
      }
      const migratedStatus: LocalCampaignStatus =
        candidate.schemaVersion === 1
          ? "resumable"
          : rawCampaign.status === "archived"
            ? "archived"
            : "resumable";
      campaigns.push({
        campaignId: rawCampaign.campaignId,
        name: rawCampaign.name,
        createdAtRealMs: rawCampaign.createdAtRealMs,
        updatedAtRealMs: rawCampaign.updatedAtRealMs,
        status: migratedStatus,
        state,
      });
    } catch {
      skippedCampaignCount += 1;
    }
  }

  const resumableCampaigns = campaigns.filter(
    (campaign) => campaign.status === "resumable",
  );
  const requestedActiveCampaign =
    candidate.activeCampaignId === null
      ? undefined
      : resumableCampaigns.find(
          (campaign) => campaign.campaignId === candidate.activeCampaignId,
        );
  const activeCampaign =
    candidate.activeCampaignId === null
      ? undefined
      : (requestedActiveCampaign ?? resumableCampaigns[0]);

  return {
    profile: {
      schemaVersion: PROFILE_SCHEMA_VERSION,
      activeCampaignId: activeCampaign?.campaignId ?? null,
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
      tutorialDailyRoutineTipAcknowledgments: isRecord(
        candidate.tutorialDailyRoutineTipAcknowledgments,
      )
        ? Object.fromEntries(
            Object.entries(candidate.tutorialDailyRoutineTipAcknowledgments)
              .filter(([, value]) => Array.isArray(value))
              .map(([campaignId, value]) => [
                campaignId,
                Array.from(new Set((value as unknown[]).filter((tip): tip is string => typeof tip === "string"))),
              ]),
          )
        : {},
      tutorialDailyRoutinePauseByCampaign: isRecord(
        candidate.tutorialDailyRoutinePauseByCampaign,
      )
        ? Object.fromEntries(
            Object.entries(candidate.tutorialDailyRoutinePauseByCampaign).filter(
              ([, wasPaused]) => typeof wasPaused === "boolean",
            ),
          ) as Record<string, boolean>
        : {},
      campaigns,
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
    status: "resumable",
    state,
  };
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    activeCampaignId: campaign.campaignId,
    nextCampaignNumber: 2,
    tutorialsEnabled: true,
    tutorialIntroDismissedCampaignIds: [],
    tutorialDailyRoutineTipAcknowledgments: {},
    tutorialDailyRoutinePauseByCampaign: {},
    campaigns: [campaign],
  };
}

export function getActiveCampaign(
  profile: LocalPrototypeProfile,
): LocalCampaignRecord | null {
  const activeCampaign = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  return activeCampaign ?? null;
}

export function requireActiveCampaign(
  profile: LocalPrototypeProfile,
): LocalCampaignRecord {
  const activeCampaign = getActiveCampaign(profile);
  if (!activeCampaign) {
    throw new Error("The local profile has no active campaign.");
  }
  return activeCampaign;
}

export function loadPrototypeProfile(): LoadedPrototypeProfile {
  const storageResult = getBrowserStorage();
  if (!storageResult.ok) {
    return {
      profile: createFreshProfile(),
      notice: describePrototypeStorageFailure(storageResult.failure),
    };
  }

  try {
    const serializedProfile = storageResult.storage.getItem(
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

    const legacySave = storageResult.storage.getItem(
      LEGACY_PROTOTYPE_SAVE_KEY,
    );
    if (legacySave !== null) {
      const profile = migrateLegacySave(legacySave);
      const persisted = savePrototypeProfileResult(profile);
      return {
        profile,
        notice: persisted.ok
          ? "Existing local save migrated into the campaign list."
          : `Existing local save opened, but ${describePrototypeStorageFailure(persisted.failure)}`,
      };
    }

    const profile = createFreshProfile();
    const persisted = savePrototypeProfileResult(profile);
    return {
      profile,
      notice: persisted.ok
        ? "New clinic started."
        : `New clinic started, but ${describePrototypeStorageFailure(persisted.failure)}`,
    };
  } catch {
    const profile = createFreshProfile();
    return {
      profile,
      notice:
        "The local campaign data was incompatible, so a new clinic was started. Existing browser data was left untouched.",
    };
  }
}

export function savePrototypeProfile(
  profile: LocalPrototypeProfile,
): boolean {
  return savePrototypeProfileResult(profile).ok;
}

export function savePrototypeProfileResult(
  profile: LocalPrototypeProfile,
): PrototypeSaveResult {
  const storageResult = getBrowserStorage();
  if (!storageResult.ok) {
    return storageResult;
  }

  let serialized: string;
  try {
    const persistedProfile: PersistedPrototypeProfile = {
      schemaVersion: PROFILE_SCHEMA_VERSION,
      activeCampaignId: profile.activeCampaignId,
      nextCampaignNumber: profile.nextCampaignNumber,
      tutorialsEnabled: profile.tutorialsEnabled,
      tutorialIntroDismissedCampaignIds:
        profile.tutorialIntroDismissedCampaignIds,
      tutorialDailyRoutineTipAcknowledgments:
        profile.tutorialDailyRoutineTipAcknowledgments,
      tutorialDailyRoutinePauseByCampaign:
        profile.tutorialDailyRoutinePauseByCampaign,
      campaigns: profile.campaigns.map((campaign) => ({
        campaignId: campaign.campaignId,
        name: campaign.name,
        createdAtRealMs: campaign.createdAtRealMs,
        updatedAtRealMs: campaign.updatedAtRealMs,
        status: campaign.status,
        serializedState: serializeGameState(campaign.state),
      })),
    };
    serialized = JSON.stringify(persistedProfile);
  } catch (error) {
    return {
      ok: false,
      failure: {
        ...storageFailure(error, "serialize"),
        category: "serialization",
      },
    };
  }

  try {
    storageResult.storage.setItem(PROTOTYPE_PROFILE_KEY, serialized);
    return { ok: true, profileCharacters: serialized.length };
  } catch (error) {
    return {
      ok: false,
      failure: storageFailure(error, "write", serialized.length),
    };
  }
}

/** Deletes only the legacy prototype campaign keys; unrelated preferences stay intact. */
export function clearPrototypeCampaignStorage(): PrototypeResetResult {
  const storageResult = getBrowserStorage();
  if (!storageResult.ok) {
    return storageResult;
  }
  let firstFailure: PrototypeStorageFailure | null = null;
  try {
    storageResult.storage.removeItem(PROTOTYPE_PROFILE_KEY);
  } catch (error) {
    firstFailure = storageFailure(error, "remove");
  }
  try {
    storageResult.storage.removeItem(LEGACY_PROTOTYPE_SAVE_KEY);
  } catch (error) {
    firstFailure ??= storageFailure(error, "remove");
  }
  return firstFailure ? { ok: false, failure: firstFailure } : { ok: true };
}

/** Keeps page-exit/autosave writers from recreating campaigns after reset. */
export function createPrototypeCampaignWriteGate(): PrototypeCampaignWriteGate {
  let suppressed = false;
  return {
    save: (profile) => {
      if (suppressed) {
        return {
          ok: false,
          failure: {
            category: "unavailable",
            operation: "write",
            name: "CampaignWritesSuppressed",
            message: "Campaign writes were disabled after local campaigns were cleared.",
          },
        };
      }
      return savePrototypeProfileResult(profile);
    },
    suppress: () => {
      suppressed = true;
    },
    isSuppressed: () => suppressed,
  };
}
