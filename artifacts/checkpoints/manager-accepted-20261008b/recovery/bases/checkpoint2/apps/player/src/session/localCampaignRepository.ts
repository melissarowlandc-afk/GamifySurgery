import {
  deserializeGameState,
  serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";
import type {
  LocalCampaignRecord,
  LocalCampaignStatus,
  LocalPrototypeProfile,
} from "./prototypeStorage";

export const LOCAL_CAMPAIGN_DATABASE_NAME = "gamify-surgery.local.v1";

const DATABASE_VERSION = 1;
const PROFILE_KEY = "profile";
const STORE_NAMES = ["profile", "campaigns", "revisions"] as const;
const MAX_PRIOR_REVISIONS = 2;
const MAX_METADATA_RETRIES = 3;

export type RepositoryFailureCategory =
  | "unavailable"
  | "open"
  | "upgrade"
  | "blocked"
  | "transaction"
  | "validation"
  | "checksum"
  | "conflict"
  | "unknown";

export interface RepositoryFailure {
  category: RepositoryFailureCategory;
  operation: "open" | "read" | "write" | "migration";
  name: string;
  message: string;
  migratedCampaignIds?: string[];
  skippedCampaignIds?: string[];
  failingCampaignId?: string;
}

export type RepositoryResult<T> =
  | { ok: true; value: T }
  | { ok: false; failure: RepositoryFailure };

interface CampaignSummary {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  updatedAtRealMs: number;
  status: LocalCampaignStatus;
}

export interface StoredProfileMetadata {
  schemaVersion: 1;
  activeCampaignId: string | null;
  nextCampaignNumber: number;
  tutorialsEnabled: boolean;
  tutorialIntroDismissedCampaignIds: string[];
  campaigns: CampaignSummary[];
}

interface StoredProfile extends StoredProfileMetadata {
  key: typeof PROFILE_KEY;
}

interface Snapshot {
  campaignId: string;
  revision: number;
  schemaVersion: 1;
  writtenAtRealMs: number;
  utf8Bytes: number;
  checksum: string;
  serializedState: string;
}

interface CampaignView {
  profile: unknown;
  campaignKeys: IDBValidKey[];
  current: unknown;
  priors: unknown[];
}

interface ProfileView {
  profile: unknown;
  currents: unknown[];
  priors: unknown[];
}

interface InspectedCampaign {
  profile: StoredProfile | undefined;
  summary: CampaignSummary | undefined;
  rawCurrent: unknown;
  rawPriors: unknown[];
  current: Snapshot | undefined;
  priors: Snapshot[];
  verified: Snapshot[];
  selected: Snapshot | undefined;
  state: GameState | undefined;
  recovered: boolean;
}

interface TransactionOutcome {
  completed: boolean;
  error?: unknown;
}

export interface LocalCampaignRepositoryOptions {
  beforeTransactionCommit?: () => void;
  afterTransactionCommit?: () => void | Promise<void>;
  configureUpgrade?: (database: IDBDatabase) => void;
  encodeUtf8?: (value: string) => Uint8Array;
  calculateChecksum?: (serializedState: string) => Promise<string>;
}

function namedError(name: string, message: string): Error {
  const error = new Error(message);
  error.name = name;
  return error;
}

function repositoryFailure(
  error: unknown,
  operation: RepositoryFailure["operation"],
  fallback: RepositoryFailureCategory,
): RepositoryFailure {
  const source = error as { name?: unknown; message?: unknown } | null;
  const name = typeof source?.name === "string" ? source.name : "UnknownError";
  const rawMessage =
    typeof source?.message === "string" ? source.message : String(error ?? "Unknown error");
  const message = rawMessage.replace(/\s+/g, " ").trim().slice(0, 240);
  const category =
    name === "ConstraintError" || name === "RevisionConflict"
      ? "conflict"
      : name === "ChecksumError"
        ? "checksum"
        : name === "MetadataValidationError" || name === "SnapshotValidationError"
          ? "validation"
        : name === "AbortError" || name === "TransactionInactiveError"
          ? "transaction"
          : fallback;

  return {
    category,
    operation,
    name,
    message: message.length > 0 ? message : "No browser error message was provided.",
  };
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? namedError("UnknownError", "IndexedDB request failed."));
  });
}

function observedRequest<T>(createRequest: () => IDBRequest<T>): Promise<T> {
  let result: Promise<T>;
  try {
    result = requestResult(createRequest());
  } catch (error) {
    result = Promise.reject(error);
  }
  void result.catch(() => undefined);
  return result;
}

function observeTransaction(transaction: IDBTransaction): Promise<TransactionOutcome> {
  return new Promise((resolve) => {
    let error: unknown;

    transaction.onerror = () => {
      error = transaction.error ?? error;
    };
    transaction.oncomplete = () => resolve({ completed: true });
    transaction.onabort = () => {
      resolve({
        completed: false,
        error:
          transaction.error ??
          error ??
          namedError("AbortError", "IndexedDB transaction aborted."),
      });
    };
  });
}

async function abortAndWait(
  transaction: IDBTransaction,
  outcome: Promise<TransactionOutcome>,
): Promise<TransactionOutcome> {
  try {
    transaction.abort();
  } catch {
  }

  return outcome;
}

async function requireCompletion(outcome: Promise<TransactionOutcome>): Promise<void> {
  const terminal = await outcome;
  if (!terminal.completed) {
    throw terminal.error;
  }
}

function closeDatabase(database: IDBDatabase | undefined): void {
  try {
    database?.close();
  } catch {
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isCampaignStatus(value: unknown): value is LocalCampaignStatus {
  return value === "resumable" || value === "archived";
}

function campaignSummary(campaign: LocalCampaignRecord): CampaignSummary {
  return {
    campaignId: campaign.campaignId,
    name: campaign.name,
    createdAtRealMs: campaign.createdAtRealMs,
    updatedAtRealMs: campaign.updatedAtRealMs,
    status: campaign.status,
  };
}

function summariesEqual(left: CampaignSummary, right: CampaignSummary): boolean {
  return (
    left.campaignId === right.campaignId &&
    left.name === right.name &&
    left.createdAtRealMs === right.createdAtRealMs &&
    left.updatedAtRealMs === right.updatedAtRealMs &&
    left.status === right.status
  );
}

function snapshotsEqual(left: Snapshot | undefined, right: Snapshot | undefined): boolean {
  if (left === undefined || right === undefined) {
    return left === right;
  }

  return (
    left.campaignId === right.campaignId &&
    left.revision === right.revision &&
    left.schemaVersion === right.schemaVersion &&
    left.writtenAtRealMs === right.writtenAtRealMs &&
    left.utf8Bytes === right.utf8Bytes &&
    left.checksum === right.checksum &&
    left.serializedState === right.serializedState
  );
}

function keySetsEqual(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return left.size === right.size && [...left].every((key) => right.has(key));
}

function validateCampaignSummary(value: unknown): CampaignSummary {
  if (!isRecord(value)) {
    throw namedError("MetadataValidationError", "Stored campaign metadata must be an object.");
  }

  if (
    typeof value.campaignId !== "string" ||
    value.campaignId.length === 0 ||
    typeof value.name !== "string" ||
    !isFiniteNonNegativeNumber(value.createdAtRealMs) ||
    !isFiniteNonNegativeNumber(value.updatedAtRealMs) ||
    !isCampaignStatus(value.status)
  ) {
    throw namedError("MetadataValidationError", "Stored campaign metadata is malformed.");
  }

  return {
    campaignId: value.campaignId,
    name: value.name,
    createdAtRealMs: value.createdAtRealMs,
    updatedAtRealMs: value.updatedAtRealMs,
    status: value.status,
  };
}

function validateStoredProfile(value: unknown): StoredProfile | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    throw namedError("MetadataValidationError", "Stored profile metadata must be an object.");
  }

  if (
    value.key !== PROFILE_KEY ||
    value.schemaVersion !== 1 ||
    !(value.activeCampaignId === null || typeof value.activeCampaignId === "string") ||
    !Number.isSafeInteger(value.nextCampaignNumber) ||
    (value.nextCampaignNumber as number) < 1 ||
    typeof value.tutorialsEnabled !== "boolean" ||
    !Array.isArray(value.tutorialIntroDismissedCampaignIds) ||
    !value.tutorialIntroDismissedCampaignIds.every(
      (campaignId) => typeof campaignId === "string",
    ) ||
    !Array.isArray(value.campaigns)
  ) {
    throw namedError("MetadataValidationError", "Stored profile metadata is malformed.");
  }

  const campaigns = value.campaigns.map(validateCampaignSummary);
  const campaignIds = new Set(campaigns.map((campaign) => campaign.campaignId));

  if (campaignIds.size !== campaigns.length) {
    throw namedError("MetadataValidationError", "Stored profile metadata contains duplicate campaigns.");
  }

  const dismissedCampaignIds = value.tutorialIntroDismissedCampaignIds as string[];
  if (new Set(dismissedCampaignIds).size !== dismissedCampaignIds.length) {
    throw namedError("MetadataValidationError", "Stored tutorial metadata contains duplicate campaigns.");
  }

  if (value.activeCampaignId !== null) {
    const activeCampaign = campaigns.find(
      (campaign) => campaign.campaignId === value.activeCampaignId,
    );
    if (!activeCampaign || activeCampaign.status !== "resumable") {
      throw namedError(
        "MetadataValidationError",
        "Stored profile metadata references an invalid active campaign.",
      );
    }
  }

  return {
    key: PROFILE_KEY,
    schemaVersion: 1,
    activeCampaignId: value.activeCampaignId as string | null,
    nextCampaignNumber: value.nextCampaignNumber as number,
    tutorialsEnabled: value.tutorialsEnabled,
    tutorialIntroDismissedCampaignIds: [...dismissedCampaignIds],
    campaigns,
  };
}

function validateSnapshotEnvelope(value: unknown, expectedCampaignId?: string): Snapshot {
  if (!isRecord(value)) {
    throw namedError("SnapshotValidationError", "Stored campaign snapshot must be an object.");
  }

  if (
    typeof value.campaignId !== "string" ||
    value.campaignId.length === 0 ||
    !Number.isSafeInteger(value.revision) ||
    (value.revision as number) < 1 ||
    value.schemaVersion !== 1 ||
    !isFiniteNonNegativeNumber(value.writtenAtRealMs) ||
    !Number.isSafeInteger(value.utf8Bytes) ||
    (value.utf8Bytes as number) < 0 ||
    typeof value.checksum !== "string" ||
    value.checksum.length === 0 ||
    typeof value.serializedState !== "string"
  ) {
    throw namedError("SnapshotValidationError", "Stored campaign snapshot envelope is malformed.");
  }

  if (expectedCampaignId !== undefined && value.campaignId !== expectedCampaignId) {
    throw namedError("SnapshotValidationError", "Stored snapshot campaign identity does not match.");
  }

  return {
    campaignId: value.campaignId,
    revision: value.revision as number,
    schemaVersion: 1,
    writtenAtRealMs: value.writtenAtRealMs,
    utf8Bytes: value.utf8Bytes as number,
    checksum: value.checksum,
    serializedState: value.serializedState,
  };
}

function candidateCampaignId(value: unknown): string {
  if (!isRecord(value) || typeof value.campaignId !== "string" || value.campaignId.length === 0) {
    throw namedError(
      "SnapshotValidationError",
      "Stored snapshot cannot be associated with a campaign.",
    );
  }
  return value.campaignId;
}

function unrecoverableFailure(errors: unknown[]): RepositoryFailure {
  const checksumOnly =
    errors.length > 0 &&
    errors.every((error) => (error as { name?: unknown } | null)?.name === "ChecksumError");

  return {
    category: checksumOnly ? "checksum" : "validation",
    operation: "read",
    name: checksumOnly ? "UnrecoverableChecksum" : "UnrecoverableValidation",
    message: checksumOnly
      ? "No stored campaign revision passed checksum verification."
      : "Stored campaign metadata or revisions are malformed, dangling, or unverifiable.",
  };
}

function campaignKeySet(keys: IDBValidKey[]): Set<string> {
  const campaignIds = new Set<string>();
  for (const key of keys) {
    if (typeof key !== "string" || key.length === 0) {
      throw namedError("MetadataValidationError", "Campaign storage contains an invalid key.");
    }
    campaignIds.add(key);
  }
  return campaignIds;
}

function assertMetadataReferencesStoredCampaigns(
  profile: StoredProfile | undefined,
  storedCampaignIds: ReadonlySet<string>,
  recoverableCampaignIds: ReadonlySet<string> = new Set(),
): void {
  if (!profile) {
    if (storedCampaignIds.size > 0) {
      throw namedError(
        "MetadataValidationError",
        "Campaign snapshots exist without profile metadata.",
      );
    }
    return;
  }

  const metadataIds = new Set(profile.campaigns.map((campaign) => campaign.campaignId));
  for (const campaignId of metadataIds) {
    if (!storedCampaignIds.has(campaignId) && !recoverableCampaignIds.has(campaignId)) {
      throw namedError(
        "MetadataValidationError",
        `Profile metadata references unstored campaign ${campaignId}.`,
      );
    }
  }

  for (const campaignId of storedCampaignIds) {
    if (!metadataIds.has(campaignId)) {
      throw namedError(
        "MetadataValidationError",
        `Stored campaign ${campaignId} has no profile metadata.`,
      );
    }
  }
}

function buildStoredProfile(
  storedProfile: StoredProfile | undefined,
  callerProfile: LocalPrototypeProfile,
  targetCampaign: LocalCampaignRecord,
  storedCampaignIds: ReadonlySet<string>,
): StoredProfile {
  const targetSummary = campaignSummary(targetCampaign);
  const summaries = new Map<string, CampaignSummary>();

  for (const summary of storedProfile?.campaigns ?? []) {
    if (storedCampaignIds.has(summary.campaignId)) {
      summaries.set(summary.campaignId, summary);
    }
  }
  summaries.set(targetCampaign.campaignId, targetSummary);

  const campaigns = [...summaries.values()];
  const resultingIds = new Set(campaigns.map((campaign) => campaign.campaignId));
  const callerActive = campaigns.find(
    (campaign) =>
      campaign.campaignId === callerProfile.activeCampaignId && campaign.status === "resumable",
  );
  const storedActive = campaigns.find(
    (campaign) =>
      campaign.campaignId === storedProfile?.activeCampaignId && campaign.status === "resumable",
  );
  const activeCampaignId = callerActive?.campaignId ?? storedActive?.campaignId ?? null;
  const dismissedCampaignIds = new Set([
    ...(storedProfile?.tutorialIntroDismissedCampaignIds ?? []),
    ...callerProfile.tutorialIntroDismissedCampaignIds,
  ]);

  return {
    key: PROFILE_KEY,
    schemaVersion: 1,
    activeCampaignId,
    nextCampaignNumber: Math.max(
      storedProfile?.nextCampaignNumber ?? 1,
      callerProfile.nextCampaignNumber,
    ),
    tutorialsEnabled: callerProfile.tutorialsEnabled,
    tutorialIntroDismissedCampaignIds: [...dismissedCampaignIds].filter((campaignId) =>
      resultingIds.has(campaignId),
    ),
    campaigns,
  };
}

function migrationMetadataMatches(
  storedProfile: StoredProfile | undefined,
  sourceProfile: LocalPrototypeProfile,
  campaignId: string,
): boolean {
  if (!storedProfile) {
    return false;
  }

  const sourceIsActive = sourceProfile.activeCampaignId === campaignId;
  const sourceDismissed = sourceProfile.tutorialIntroDismissedCampaignIds.includes(campaignId);
  const storedDismissed = storedProfile.tutorialIntroDismissedCampaignIds.includes(campaignId);
  return (
    (!sourceIsActive || storedProfile.activeCampaignId === campaignId) &&
    storedProfile.nextCampaignNumber >= sourceProfile.nextCampaignNumber &&
    storedProfile.tutorialsEnabled === sourceProfile.tutorialsEnabled &&
    (!sourceDismissed || storedDismissed)
  );
}

export class LocalCampaignRepository {
  constructor(
    private readonly indexedDBFactory: IDBFactory | undefined =
      typeof indexedDB === "undefined" ? undefined : indexedDB,
    private readonly options: LocalCampaignRepositoryOptions = {},
  ) {}

  private encodeUtf8(value: string): Uint8Array {
    return this.options.encodeUtf8?.(value) ?? new TextEncoder().encode(value);
  }

  private async checksum(serializedState: string): Promise<string> {
    if (this.options.calculateChecksum) {
      return this.options.calculateChecksum(serializedState);
    }

    const bytes = this.encodeUtf8(serializedState);
    const hash = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
    return [...new Uint8Array(hash)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  private async createSnapshot(
    campaign: LocalCampaignRecord,
    revision: number,
  ): Promise<Snapshot> {
    const serializedState = serializeGameState(campaign.state);
    const restoredState = deserializeGameState(serializedState);
    if (restoredState.campaignId !== campaign.campaignId) {
      throw namedError("SnapshotValidationError", "Campaign identity does not match its state.");
    }

    return {
      campaignId: campaign.campaignId,
      revision,
      schemaVersion: 1,
      writtenAtRealMs: Date.now(),
      utf8Bytes: this.encodeUtf8(serializedState).byteLength,
      checksum: await this.checksum(serializedState),
      serializedState,
    };
  }

  private async validateSnapshot(snapshot: Snapshot): Promise<GameState> {
    if (this.encodeUtf8(snapshot.serializedState).byteLength !== snapshot.utf8Bytes) {
      throw namedError("SnapshotValidationError", "Stored snapshot byte count does not match.");
    }

    if ((await this.checksum(snapshot.serializedState)) !== snapshot.checksum) {
      throw namedError("ChecksumError", "Stored snapshot checksum does not match.");
    }

    const state = deserializeGameState(snapshot.serializedState);
    if (state.campaignId !== snapshot.campaignId) {
      throw namedError("SnapshotValidationError", "Stored snapshot campaign identity does not match.");
    }
    return state;
  }

  private configure(database: IDBDatabase): void {
    if (!database.objectStoreNames.contains("profile")) {
      database.createObjectStore("profile", { keyPath: "key" });
    }
    if (!database.objectStoreNames.contains("campaigns")) {
      database.createObjectStore("campaigns", { keyPath: "campaignId" });
    }
    if (!database.objectStoreNames.contains("revisions")) {
      const revisionStore = database.createObjectStore("revisions", {
        keyPath: ["campaignId", "revision"],
      });
      revisionStore.createIndex("campaignId", "campaignId", { unique: false });
    }
    this.options.configureUpgrade?.(database);
  }

  private open(): Promise<IDBDatabase> {
    if (!this.indexedDBFactory) {
      return Promise.reject(namedError("StorageUnavailable", "IndexedDB is unavailable."));
    }

    return new Promise((resolve, reject) => {
      let opening: IDBOpenDBRequest;
      let settled = false;
      let upgradeStarted = false;

      const rejectOnce = (error: unknown) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      try {
        opening = this.indexedDBFactory!.open(
          LOCAL_CAMPAIGN_DATABASE_NAME,
          DATABASE_VERSION,
        );
      } catch (error) {
        rejectOnce(error);
        return;
      }

      opening.onupgradeneeded = () => {
        upgradeStarted = true;
        try {
          this.configure(opening.result);
        } catch (error) {
          try {
            opening.transaction?.abort();
          } catch {
          }
          rejectOnce(
            namedError(
              "UpgradeError",
              error instanceof Error ? error.message : String(error),
            ),
          );
        }
      };
      opening.onblocked = () => {
        rejectOnce(namedError("BlockedError", "IndexedDB open was blocked."));
      };
      opening.onerror = () => {
        rejectOnce(
          upgradeStarted
            ? namedError("UpgradeError", opening.error?.message ?? "IndexedDB upgrade failed.")
            : opening.error ?? namedError("OpenError", "IndexedDB open failed."),
        );
      };
      opening.onsuccess = () => {
        if (settled) {
          closeDatabase(opening.result);
          return;
        }
        settled = true;
        resolve(opening.result);
      };
    });
  }

  private openFailure(error: unknown): RepositoryFailure {
    const name = (error as { name?: unknown } | null)?.name;
    const category =
      name === "UpgradeError"
        ? "upgrade"
        : name === "BlockedError"
          ? "blocked"
          : this.indexedDBFactory
            ? "open"
            : "unavailable";
    return repositoryFailure(error, "open", category);
  }

  private async readCampaignView(
    campaignId: string,
  ): Promise<RepositoryResult<CampaignView>> {
    let database: IDBDatabase;
    try {
      database = await this.open();
    } catch (error) {
      return { ok: false, failure: this.openFailure(error) };
    }

    let transaction: IDBTransaction | undefined;
    let terminal: Promise<TransactionOutcome> | undefined;
    try {
      transaction = database.transaction(STORE_NAMES, "readonly");
      terminal = observeTransaction(transaction);
      const profileStore = transaction.objectStore("profile");
      const campaignStore = transaction.objectStore("campaigns");
      const revisionStore = transaction.objectStore("revisions");
      const requests = [
        observedRequest(() => profileStore.get(PROFILE_KEY)),
        observedRequest(() => campaignStore.getAllKeys()),
        observedRequest(() => campaignStore.get(campaignId)),
        observedRequest(() => revisionStore.index("campaignId").getAll(campaignId)),
      ] as const;
      const [profile, campaignKeys, current, priors] = await Promise.all(requests);
      await requireCompletion(terminal);
      return { ok: true, value: { profile, campaignKeys, current, priors } };
    } catch (error) {
      if (transaction && terminal) {
        await abortAndWait(transaction, terminal);
      }
      return {
        ok: false,
        failure: repositoryFailure(error, "read", "transaction"),
      };
    } finally {
      closeDatabase(database);
    }
  }

  private async readProfileView(): Promise<RepositoryResult<ProfileView>> {
    let database: IDBDatabase;
    try {
      database = await this.open();
    } catch (error) {
      return { ok: false, failure: this.openFailure(error) };
    }

    let transaction: IDBTransaction | undefined;
    let terminal: Promise<TransactionOutcome> | undefined;
    try {
      transaction = database.transaction(STORE_NAMES, "readonly");
      terminal = observeTransaction(transaction);
      const requests = [
        observedRequest(() => transaction!.objectStore("profile").get(PROFILE_KEY)),
        observedRequest(() => transaction!.objectStore("campaigns").getAll()),
        observedRequest(() => transaction!.objectStore("revisions").getAll()),
      ] as const;
      const [profile, currents, priors] = await Promise.all(requests);
      await requireCompletion(terminal);
      return { ok: true, value: { profile, currents, priors } };
    } catch (error) {
      if (transaction && terminal) {
        await abortAndWait(transaction, terminal);
      }
      return {
        ok: false,
        failure: repositoryFailure(error, "read", "transaction"),
      };
    } finally {
      closeDatabase(database);
    }
  }

  private async inspectCampaign(
    campaignId: string,
    view: CampaignView,
  ): Promise<InspectedCampaign> {
    const profile = validateStoredProfile(view.profile);
    const storedCampaignIds = campaignKeySet(view.campaignKeys);
    const recoverableCampaignIds = view.priors.length > 0 ? new Set([campaignId]) : new Set<string>();
    assertMetadataReferencesStoredCampaigns(
      profile,
      storedCampaignIds,
      recoverableCampaignIds,
    );
    const errors: unknown[] = [];
    let current: Snapshot | undefined;
    if (view.current !== undefined) {
      try {
        current = validateSnapshotEnvelope(view.current, campaignId);
      } catch (error) {
        errors.push(error);
      }
    }
    const priors: Snapshot[] = [];
    for (const prior of view.priors) {
      try {
        priors.push(validateSnapshotEnvelope(prior, campaignId));
      } catch (error) {
        errors.push(error);
      }
    }
    const summary = profile?.campaigns.find(
      (campaign) => campaign.campaignId === campaignId,
    );

    if (!summary && (current || priors.length > 0)) {
      throw namedError(
        "MetadataValidationError",
        "Stored campaign snapshots have no matching profile metadata.",
      );
    }

    const verified: Array<{ snapshot: Snapshot; state: GameState }> = [];
    for (const snapshot of [current, ...priors].filter(
      (candidate): candidate is Snapshot => candidate !== undefined,
    )) {
      try {
        verified.push({ snapshot, state: await this.validateSnapshot(snapshot) });
      } catch (error) {
        errors.push(error);
      }
    }
    verified.sort((left, right) => right.snapshot.revision - left.snapshot.revision);

    if (
      verified.length === 0 &&
      (view.current !== undefined || view.priors.length > 0)
    ) {
      throw Object.assign(namedError("UnrecoverableCampaign", "No campaign revision is valid."), {
        repositoryFailure: unrecoverableFailure(errors),
      });
    }

    const selected = verified[0];
    return {
      profile,
      summary,
      rawCurrent: view.current,
      rawPriors: view.priors,
      current,
      priors,
      verified: verified.map((candidate) => candidate.snapshot),
      selected: selected?.snapshot,
      state: selected?.state,
      recovered:
        selected !== undefined &&
        (view.current === undefined || !current || !snapshotsEqual(current, selected.snapshot)),
    };
  }

  private inspectionFailure(error: unknown, operation: "read" | "write"): RepositoryFailure {
    const embedded = (error as { repositoryFailure?: unknown } | null)?.repositoryFailure;
    if (isRecord(embedded)) {
      return {
        ...(embedded as unknown as RepositoryFailure),
        operation,
      };
    }
    return repositoryFailure(error, operation, "validation");
  }

  private async inspectCampaignById(
    campaignId: string,
  ): Promise<RepositoryResult<InspectedCampaign>> {
    const view = await this.readCampaignView(campaignId);
    if (!view.ok) {
      return view;
    }

    try {
      return { ok: true, value: await this.inspectCampaign(campaignId, view.value) };
    } catch (error) {
      return { ok: false, failure: this.inspectionFailure(error, "read") };
    }
  }

  private observedRevision(view: CampaignView): number {
    let maximumRevision = 0;
    for (const candidate of [view.current, ...view.priors]) {
      if (
        isRecord(candidate) &&
        Number.isSafeInteger(candidate.revision) &&
        (candidate.revision as number) >= 1
      ) {
        maximumRevision = Math.max(
          maximumRevision,
          candidate.revision as number,
        );
      }
    }
    return maximumRevision;
  }

  private async commitCampaign(
    callerProfile: LocalPrototypeProfile,
    campaign: LocalCampaignRecord,
    next: Snapshot,
    inspected: InspectedCampaign,
    retainedPriors: Snapshot[],
    campaignKeysBefore: ReadonlySet<string>,
  ): Promise<RepositoryResult<"committed" | "retry">> {
    let database: IDBDatabase;
    try {
      database = await this.open();
    } catch (error) {
      return { ok: false, failure: this.openFailure(error) };
    }

    let transaction: IDBTransaction | undefined;
    let terminal: Promise<TransactionOutcome> | undefined;
    try {
      transaction = database.transaction(STORE_NAMES, "readwrite");
      terminal = observeTransaction(transaction);
      const profileStore = transaction.objectStore("profile");
      const campaignStore = transaction.objectStore("campaigns");
      const revisionStore = transaction.objectStore("revisions");
      const requests = [
        observedRequest(() => profileStore.get(PROFILE_KEY)),
        observedRequest(() => campaignStore.getAllKeys()),
        observedRequest(() => campaignStore.get(campaign.campaignId)),
        observedRequest(() => revisionStore.index("campaignId").getAll(campaign.campaignId)),
        observedRequest(() =>
          revisionStore.index("campaignId").getAllKeys(campaign.campaignId),
        ),
      ] as const;
      const [rawProfile, rawKeys, rawCurrent, rawPriors, rawPriorKeys] =
        await Promise.all(requests);
      const storedProfile = validateStoredProfile(rawProfile);
      const storedKeys = campaignKeySet(rawKeys);
      assertMetadataReferencesStoredCampaigns(
        storedProfile,
        storedKeys,
        rawPriors.length > 0 ? new Set([campaign.campaignId]) : new Set(),
      );

      const targetChanged =
        JSON.stringify(rawCurrent) !== JSON.stringify(inspected.rawCurrent) ||
        JSON.stringify(rawPriors) !== JSON.stringify(inspected.rawPriors);
      const metadataChanged =
        JSON.stringify(storedProfile) !== JSON.stringify(inspected.profile) ||
        !keySetsEqual(storedKeys, campaignKeysBefore);
      if (targetChanged || metadataChanged) {
        await abortAndWait(transaction, terminal);
        return { ok: true, value: "retry" };
      }

      const resultingKeys = new Set(storedKeys);
      resultingKeys.add(campaign.campaignId);
      const nextProfile = buildStoredProfile(
        storedProfile,
        callerProfile,
        campaign,
        resultingKeys,
      );
      const validatedNextProfile = validateStoredProfile(nextProfile);
      if (!validatedNextProfile) {
        throw namedError("MetadataValidationError", "Campaign metadata could not be prepared.");
      }

      for (const priorKey of rawPriorKeys) {
        revisionStore.delete(priorKey);
      }
      for (const prior of retainedPriors) {
        revisionStore.put(prior);
      }
      campaignStore.put(next);
      profileStore.put(validatedNextProfile);
      this.options.beforeTransactionCommit?.();
      await requireCompletion(terminal);
      return { ok: true, value: "committed" };
    } catch (error) {
      if (transaction && terminal) {
        await abortAndWait(transaction, terminal);
      }
      return {
        ok: false,
        failure: repositoryFailure(error, "write", "transaction"),
      };
    } finally {
      closeDatabase(database);
    }
  }

  private async verifyExactCurrent(
    campaign: LocalCampaignRecord,
    intended: Snapshot,
  ): Promise<RepositoryResult<boolean>> {
    const inspected = await this.inspectCampaignById(campaign.campaignId);
    if (!inspected.ok) {
      return inspected;
    }

    return {
      ok: true,
      value:
        snapshotsEqual(inspected.value.current, intended) &&
        inspected.value.summary !== undefined &&
        summariesEqual(inspected.value.summary, campaignSummary(campaign)) &&
        !inspected.value.recovered,
    };
  }

  async saveCampaign(
    profile: LocalPrototypeProfile,
    campaign: LocalCampaignRecord,
    expectedRevision: number | null,
  ): Promise<RepositoryResult<{ revision: number }>> {
    let prepared: Snapshot;
    try {
      prepared = await this.createSnapshot(campaign, 1);
    } catch (error) {
      return {
        ok: false,
        failure: repositoryFailure(error, "write", "validation"),
      };
    }

    for (let attempt = 0; attempt < MAX_METADATA_RETRIES; attempt += 1) {
      const view = await this.readCampaignView(campaign.campaignId);
      if (!view.ok) {
        return { ok: false, failure: { ...view.failure, operation: "write" } };
      }

      let inspected: InspectedCampaign;
      try {
        inspected = await this.inspectCampaign(campaign.campaignId, view.value);
      } catch (error) {
        return { ok: false, failure: this.inspectionFailure(error, "write") };
      }

      const currentRevision = inspected.selected?.revision ?? 0;
      if (expectedRevision !== null && expectedRevision !== currentRevision) {
        return {
          ok: false,
          failure: {
            category: "conflict",
            operation: "write",
            name: "RevisionConflict",
            message: `Expected revision ${expectedRevision}, found ${currentRevision}.`,
          },
        };
      }

      const nextRevision = Math.max(
        currentRevision,
        this.observedRevision(view.value),
      ) + 1;
      const next = { ...prepared, revision: nextRevision };
      const retainedPriors = inspected.verified
        .filter(
          (snapshot, index, snapshots) =>
            snapshots.findIndex((candidate) => candidate.revision === snapshot.revision) === index,
        )
        .sort((left, right) => right.revision - left.revision)
        .slice(0, MAX_PRIOR_REVISIONS);
      let campaignKeysBefore: Set<string>;
      try {
        campaignKeysBefore = campaignKeySet(view.value.campaignKeys);
      } catch (error) {
        return {
          ok: false,
          failure: repositoryFailure(error, "write", "validation"),
        };
      }
      const committed = await this.commitCampaign(
        profile,
        campaign,
        next,
        inspected,
        retainedPriors,
        campaignKeysBefore,
      );
      if (!committed.ok) {
        return committed;
      }
      if (committed.value === "retry") {
        continue;
      }

      try {
        await this.options.afterTransactionCommit?.();
      } catch (error) {
        return {
          ok: false,
          failure: repositoryFailure(error, "write", "validation"),
        };
      }

      const verified = await this.verifyExactCurrent(campaign, next);
      if (!verified.ok) {
        return { ok: false, failure: { ...verified.failure, operation: "write" } };
      }
      if (!verified.value) {
        return {
          ok: false,
          failure: {
            category: "validation",
            operation: "write",
            name: "PostCommitVerificationFailed",
            message: "Committed campaign content or metadata did not match the intended save.",
          },
        };
      }
      return { ok: true, value: { revision: nextRevision } };
    }

    return {
      ok: false,
      failure: {
        category: "conflict",
        operation: "write",
        name: "RevisionConflict",
        message: "Campaign metadata changed repeatedly while this save was being prepared.",
      },
    };
  }

  async loadCampaign(
    campaignId: string,
  ): Promise<
    RepositoryResult<{
      campaign: LocalCampaignRecord;
      revision: number;
      recovered: boolean;
    } | null>
  > {
    const inspected = await this.inspectCampaignById(campaignId);
    if (!inspected.ok) {
      return inspected;
    }

    if (!inspected.value.summary && !inspected.value.selected) {
      return { ok: true, value: null };
    }
    if (!inspected.value.summary || !inspected.value.selected || !inspected.value.state) {
      return {
        ok: false,
        failure: unrecoverableFailure([
          namedError("MetadataValidationError", "Campaign metadata and state are incomplete."),
        ]),
      };
    }

    return {
      ok: true,
      value: {
        campaign: { ...inspected.value.summary, state: inspected.value.state },
        revision: inspected.value.selected.revision,
        recovered: inspected.value.recovered,
      },
    };
  }

  async loadProfile(): Promise<RepositoryResult<LocalPrototypeProfile | null>> {
    const view = await this.readProfileView();
    if (!view.ok) {
      return view;
    }

    try {
      const profile = validateStoredProfile(view.value.profile);
      if (!profile) {
        if (view.value.currents.length > 0 || view.value.priors.length > 0) {
          throw namedError(
            "MetadataValidationError",
            "Campaign snapshots exist without profile metadata.",
          );
        }
        return { ok: true, value: null };
      }

      const currentByCampaign = new Map<string, unknown>();
      for (const current of view.value.currents) {
        const campaignId = candidateCampaignId(current);
        if (currentByCampaign.has(campaignId)) {
          throw namedError(
            "SnapshotValidationError",
            `Campaign ${campaignId} has multiple current snapshots.`,
          );
        }
        currentByCampaign.set(campaignId, current);
      }
      const priorsByCampaign = new Map<string, unknown[]>();
      for (const prior of view.value.priors) {
        const campaignId = candidateCampaignId(prior);
        const campaignPriors = priorsByCampaign.get(campaignId) ?? [];
        campaignPriors.push(prior);
        priorsByCampaign.set(campaignId, campaignPriors);
      }
      const recoverableIds = new Set(priorsByCampaign.keys());
      assertMetadataReferencesStoredCampaigns(
        profile,
        new Set(currentByCampaign.keys()),
        recoverableIds,
      );
      const metadataIds = new Set(profile.campaigns.map((campaign) => campaign.campaignId));
      if ([...priorsByCampaign.keys()].some((campaignId) => !metadataIds.has(campaignId))) {
        throw namedError(
          "MetadataValidationError",
          "Prior revisions exist without profile metadata.",
        );
      }

      const campaigns: LocalCampaignRecord[] = [];
      for (const summary of profile.campaigns) {
        const candidates = [
          currentByCampaign.get(summary.campaignId),
          ...(priorsByCampaign.get(summary.campaignId) ?? []),
        ].filter((snapshot) => snapshot !== undefined);
        const errors: unknown[] = [];
        const verified: Array<{ snapshot: Snapshot; state: GameState }> = [];
        for (const candidate of candidates) {
          try {
            const snapshot = validateSnapshotEnvelope(candidate, summary.campaignId);
            verified.push({ snapshot, state: await this.validateSnapshot(snapshot) });
          } catch (error) {
            errors.push(error);
          }
        }
        verified.sort((left, right) => right.snapshot.revision - left.snapshot.revision);
        const selected = verified[0];
        if (!selected) {
          return { ok: false, failure: unrecoverableFailure(errors) };
        }
        campaigns.push({ ...summary, state: selected.state });
      }

      return {
        ok: true,
        value: {
          schemaVersion: 2,
          activeCampaignId: profile.activeCampaignId,
          nextCampaignNumber: profile.nextCampaignNumber,
          tutorialsEnabled: profile.tutorialsEnabled,
          tutorialIntroDismissedCampaignIds: [
            ...profile.tutorialIntroDismissedCampaignIds,
          ],
          campaigns,
        },
      };
    } catch (error) {
      return {
        ok: false,
        failure: repositoryFailure(error, "read", "validation"),
      };
    }
  }

  private async durableCurrentMatches(
    profile: LocalPrototypeProfile,
    campaign: LocalCampaignRecord,
  ): Promise<RepositoryResult<boolean>> {
    let intended: Snapshot;
    try {
      intended = await this.createSnapshot(campaign, 1);
    } catch (error) {
      return {
        ok: false,
        failure: repositoryFailure(error, "migration", "validation"),
      };
    }

    const inspected = await this.inspectCampaignById(campaign.campaignId);
    if (!inspected.ok) {
      return inspected;
    }
    if (
      !inspected.value.current ||
      !inspected.value.summary ||
      inspected.value.recovered
    ) {
      return { ok: true, value: false };
    }

    return {
      ok: true,
      value:
        inspected.value.current.serializedState === intended.serializedState &&
        inspected.value.current.utf8Bytes === intended.utf8Bytes &&
        inspected.value.current.checksum === intended.checksum &&
        summariesEqual(inspected.value.summary, campaignSummary(campaign)) &&
        migrationMetadataMatches(
          inspected.value.profile,
          profile,
          campaign.campaignId,
        ),
    };
  }

  async migrateLegacyProfile(
    profile: LocalPrototypeProfile,
  ): Promise<
    RepositoryResult<{
      migratedCampaignIds: string[];
      skippedCampaignIds: string[];
    }>
  > {
    const migratedCampaignIds: string[] = [];
    const skippedCampaignIds: string[] = [];
    const migrationFailure = (
      issue: RepositoryFailure,
      failingCampaignId: string,
    ): RepositoryResult<never> => ({
      ok: false,
      failure: {
        ...issue,
        operation: "migration",
        migratedCampaignIds: [...migratedCampaignIds],
        skippedCampaignIds: [...skippedCampaignIds],
        failingCampaignId,
      },
    });

    for (const campaign of profile.campaigns) {
      const inspected = await this.inspectCampaignById(campaign.campaignId);
      if (!inspected.ok) {
        return migrationFailure(inspected.failure, campaign.campaignId);
      }

      const existing =
        inspected.value.summary && inspected.value.selected && inspected.value.state
          ? {
              campaign: { ...inspected.value.summary, state: inspected.value.state },
              revision: inspected.value.selected.revision,
              recovered: inspected.value.recovered,
            }
          : undefined;
      if (existing) {
        let existingState: string;
        let sourceState: string;
        try {
          existingState = serializeGameState(existing.campaign.state);
          sourceState = serializeGameState(campaign.state);
        } catch (error) {
          return migrationFailure(
            repositoryFailure(error, "migration", "validation"),
            campaign.campaignId,
          );
        }

        const exactCampaign =
          existingState === sourceState &&
          summariesEqual(
            existing.campaign,
            campaign,
          );
        if (!exactCampaign) {
          return migrationFailure(
            {
              category: "conflict",
              operation: "migration",
              name: "LegacyCampaignContentConflict",
              message: `Campaign ${campaign.campaignId} already exists with different content.`,
            },
            campaign.campaignId,
          );
        }

        if (
          !existing.recovered &&
          migrationMetadataMatches(
            inspected.value.profile,
            profile,
            campaign.campaignId,
          )
        ) {
          skippedCampaignIds.push(campaign.campaignId);
          continue;
        }
      }

      const saved = await this.saveCampaign(
        profile,
        campaign,
        existing?.revision ?? 0,
      );
      if (!saved.ok) {
        const durable = await this.durableCurrentMatches(profile, campaign);
        if (durable.ok && durable.value) {
          migratedCampaignIds.push(campaign.campaignId);
          continue;
        }
        return migrationFailure(
          durable.ok ? saved.failure : durable.failure,
          campaign.campaignId,
        );
      }

      const durable = await this.durableCurrentMatches(profile, campaign);
      if (!durable.ok) {
        return migrationFailure(durable.failure, campaign.campaignId);
      }
      if (!durable.value) {
        return migrationFailure(
          {
            category: "validation",
            operation: "migration",
            name: "MigrationVerificationFailed",
            message: "Migrated campaign did not become a verified current snapshot.",
          },
          campaign.campaignId,
        );
      }
      migratedCampaignIds.push(campaign.campaignId);
    }

    return { ok: true, value: { migratedCampaignIds, skippedCampaignIds } };
  }
}
