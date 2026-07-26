import { createHash, randomUUID } from "node:crypto";
import {
  access,
  lstat,
  open,
  readFile,
  readdir,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
} from "node:path";

import {
  ensurePrivateIntakePaths,
  type PrivateIntakePaths,
} from "./private-paths.js";
import type { SourceRightsDecision } from "../schemas.js";

export const PRIVATE_INTAKE_PIPELINE_VERSION =
  "gamify-surgery-private-intake-1";
export const DEFAULT_MAX_PRIVATE_SOURCE_BYTES = 100 * 1024 * 1024;

export type PrivateIntakeStatus =
  | "discovered"
  | "queued"
  | "extracting"
  | "extracted"
  | "duplicate"
  | "rights_blocked"
  | "quarantined"
  | "archived";

const PRIVATE_INTAKE_STATUSES: readonly PrivateIntakeStatus[] = [
  "discovered",
  "queued",
  "extracting",
  "extracted",
  "duplicate",
  "rights_blocked",
  "quarantined",
  "archived",
];

export interface PrivateIntakeAcknowledgement {
  id: string;
  noIdentifiablePatientInformation: true;
  authorizedLocalStorageAndProcessing: true;
  sharedAndCopyrightedMaterialConsidered: true;
  acknowledgedBy: string;
  acknowledgedAt: string;
  scope: string;
}

export interface IntakeRightsAuthorization {
  sourceId: string;
  rightsDecisionId: string;
  /** SHA-256 of the exact immutable rights-decision record. */
  rightsDecisionSha256: string;
  rightsDecisionEffectiveAt: string;
  rightsDecisionExpiresAt: string | null;
  reviewedAt: string;
  privateStoragePermitted: boolean;
  localProcessingPermitted: boolean;
}

export interface PrivateIntakeManifestEntry {
  schemaVersion: 1;
  id: string;
  byteIdentityId: string | null;
  originalFilename: string;
  sizeBytes: number;
  sha256: string | null;
  detectedMediaType: string | null;
  status: PrivateIntakeStatus;
  duplicateOfId: string | null;
  sourceId: string | null;
  sourceSnapshotId: string | null;
  rightsDecisionId: string | null;
  rightsDecisionSha256: string | null;
  rightsDecisionEffectiveAt: string | null;
  rightsDecisionExpiresAt: string | null;
  acknowledgementId: string;
  storageRelativePath: string;
  discoveredAt: string;
  updatedAt: string;
  errorCode: string | null;
  errorMessage: string | null;
  extractionArtifactId: string | null;
  extractionArtifactSha256: string | null;
  parserId: string | null;
  parserVersion: string | null;
  chunkerVersion: string | null;
  extractionOutcome: "complete" | "ocr_required" | null;
}

export interface PrivateIntakeTransitionEvent {
  schemaVersion: 1;
  id: string;
  entryId: string;
  ordinal: number;
  fromStatus: PrivateIntakeStatus | null;
  toStatus: PrivateIntakeStatus;
  occurredAt: string;
  storageRelativePath: string;
  errorCode: string | null;
  previousEventHash: string | null;
  eventHash: string;
}

export interface PrivateIntakeManifest {
  schemaVersion: 1;
  manifestVersion: 1;
  pipelineVersion: typeof PRIVATE_INTAKE_PIPELINE_VERSION;
  updatedAt: string;
  acknowledgements: PrivateIntakeAcknowledgement[];
  entries: PrivateIntakeManifestEntry[];
  events: PrivateIntakeTransitionEvent[];
}

export interface IntakeClock {
  now: () => Date;
  nowMs?: () => number;
}

const systemClock: IntakeClock = {
  now: () => new Date(),
  nowMs: () => Date.now(),
};

export interface ScanPrivateIntakeOptions {
  paths: PrivateIntakePaths;
  acknowledgement: PrivateIntakeAcknowledgement;
  resolveRights: (
    filename: string,
  ) =>
    | IntakeRightsAuthorization
    | null
    | Promise<IntakeRightsAuthorization | null>;
  maxBytes?: number;
  clock?: IntakeClock;
  tokenFactory?: () => string;
}

export interface ScanPrivateIntakeReport {
  queued: number;
  duplicates: number;
  rightsBlocked: number;
  quarantined: number;
  ignored: number;
  manifestPath: string;
}

export interface PrivateExtractionResult {
  parserId: string;
  parserVersion: string;
  chunkerVersion: string;
  outcome?: "complete" | "ocr_required";
  /**
   * Private, local-only data. It must not be returned by a browser-facing API
   * or copied into the tracked research workspace.
   */
  payload: unknown;
}

export interface ProcessPrivateIntakeOptions {
  paths: PrivateIntakePaths;
  extract: (
    filePath: string,
    entry: Readonly<PrivateIntakeManifestEntry>,
  ) => PrivateExtractionResult | Promise<PrivateExtractionResult>;
  clock?: IntakeClock;
  tokenFactory?: () => string;
  maxBytes?: number;
}

export interface ProcessPrivateIntakeReport {
  extracted: number;
  quarantined: number;
  manifestPath: string;
}

export class PrivateIntakeError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = "PrivateIntakeError";
    this.code = code;
  }
}

const sha256 = (value: string | Uint8Array): string =>
  createHash("sha256").update(value).digest("hex");

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  );
};

export const fingerprintImmutableRightsDecision = (
  decision: unknown,
): string => sha256(JSON.stringify(canonicalize(decision)));

/**
 * Snapshot an already-selected effective domain rights decision for intake.
 * Callers should select it with `getEffectiveSourceRightsDecision`; this
 * adapter intentionally does not choose between competing decisions.
 */
export const authorizeIntakeFromRightsDecision = (
  decision: SourceRightsDecision,
): IntakeRightsAuthorization => {
  const permitted = decision.decisionStatus === "permitted_with_conditions";
  return {
    sourceId: decision.sourceId,
    rightsDecisionId: decision.id,
    rightsDecisionSha256: fingerprintImmutableRightsDecision(decision),
    rightsDecisionEffectiveAt: decision.effectiveAt,
    rightsDecisionExpiresAt: decision.expiresAt,
    reviewedAt: decision.reviewedAt,
    privateStoragePermitted:
      permitted && decision.permissions.privateStorage,
    localProcessingPermitted:
      permitted && decision.permissions.localTextExtraction,
  };
};

const isoNow = (clock: IntakeClock): string => clock.now().toISOString();

const within = (root: string, candidate: string): boolean => {
  const fromRoot = relative(root, candidate);
  return (
    fromRoot === "" ||
    (!fromRoot.startsWith("..") && !isAbsolute(fromRoot))
  );
};

const privateRelativePath = (
  paths: PrivateIntakePaths,
  absolutePath: string,
): string => {
  const candidate = resolve(absolutePath);
  if (!within(paths.root, candidate)) {
    throw new PrivateIntakeError(
      "PATH_ESCAPE",
      "Private source path escaped the configured intake root.",
    );
  }
  return relative(paths.root, candidate).replaceAll("\\", "/");
};

const absolutePrivatePath = (
  paths: PrivateIntakePaths,
  storedPath: string,
): string => {
  const candidate = resolve(paths.root, storedPath);
  if (!within(paths.root, candidate)) {
    throw new PrivateIntakeError(
      "PATH_ESCAPE",
      "Stored private source path escaped the configured intake root.",
    );
  }
  return candidate;
};

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const sanitizeFilename = (filename: string): string => {
  const safe = basename(filename).replaceAll(/[^A-Za-z0-9._-]/g, "_");
  return safe || "source";
};

export const sanitizePrivateIntakeError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : "Private intake failed.";
  return raw
    .replaceAll(
      /[A-Za-z]:\\(?:[^\\\r\n]+\\)*[^\\\r\n]*/g,
      "[private-path]",
    )
    .replaceAll(/\/(?:[^/\r\n]+\/)*[^/\r\n]*/g, "[private-path]")
    .replaceAll(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[redacted-email]",
    )
    .replaceAll(/([?&](?:token|key|api_key|email|mailto)=)[^&\s]+/gi, "$1[redacted]")
    .slice(0, 500);
};

const stableStringify = (value: unknown): string =>
  `${JSON.stringify(value, null, 2)}\n`;

const syncDirectoryBestEffort = async (directory: string): Promise<void> => {
  try {
    const handle = await open(directory, "r");
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (!["EINVAL", "ENOTSUP", "EPERM", "EISDIR"].includes(code ?? "")) {
      throw error;
    }
  }
};

export const writePrivateJsonAtomic = async (
  path: string,
  value: unknown,
  tokenFactory: () => string = randomUUID,
): Promise<string> => {
  const serialized = stableStringify(value);
  const temporaryPath = `${path}.${process.pid}.${tokenFactory()}.tmp`;
  const handle = await open(temporaryPath, "wx", 0o600);
  try {
    await handle.writeFile(serialized, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await rename(temporaryPath, path);
    await syncDirectoryBestEffort(dirname(path));
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
  return sha256(serialized);
};

const emptyManifest = (timestamp: string): PrivateIntakeManifest => ({
  schemaVersion: 1,
  manifestVersion: 1,
  pipelineVersion: PRIVATE_INTAKE_PIPELINE_VERSION,
  updatedAt: timestamp,
  acknowledgements: [],
  entries: [],
  events: [],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseManifestEntry = (value: unknown): PrivateIntakeManifestEntry => {
  if (!isRecord(value)) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest contains a non-object entry.",
    );
  }
  const requiredStrings = [
    "id",
    "originalFilename",
    "acknowledgementId",
    "storageRelativePath",
    "discoveredAt",
    "updatedAt",
  ];
  if (requiredStrings.some((key) => typeof value[key] !== "string")) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest entry is missing required metadata.",
    );
  }
  if (
    value.schemaVersion !== 1 ||
    typeof value.sizeBytes !== "number" ||
    !Number.isSafeInteger(value.sizeBytes) ||
    value.sizeBytes < 0
  ) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest entry has an invalid version or size.",
    );
  }
  if (!PRIVATE_INTAKE_STATUSES.includes(value.status as PrivateIntakeStatus)) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest entry has an unsupported status.",
    );
  }
  const sha = value.sha256;
  if (sha !== null && (typeof sha !== "string" || !/^[a-f0-9]{64}$/.test(sha))) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest entry has an invalid SHA-256.",
    );
  }
  const extractionOutcome = value.extractionOutcome;
  if (
    extractionOutcome !== undefined &&
    extractionOutcome !== null &&
    extractionOutcome !== "complete" &&
    extractionOutcome !== "ocr_required"
  ) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest entry has an invalid extraction outcome.",
    );
  }
  return {
    ...(value as unknown as PrivateIntakeManifestEntry),
    extractionOutcome: extractionOutcome ?? null,
  };
};

const parseTransitionEvent = (value: unknown): PrivateIntakeTransitionEvent => {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.id !== "string" ||
    typeof value.entryId !== "string" ||
    typeof value.ordinal !== "number" ||
    !Number.isSafeInteger(value.ordinal) ||
    value.ordinal < 1 ||
    typeof value.occurredAt !== "string" ||
    typeof value.storageRelativePath !== "string" ||
    typeof value.eventHash !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.eventHash) ||
    (value.previousEventHash !== null &&
      (typeof value.previousEventHash !== "string" ||
        !/^[a-f0-9]{64}$/.test(value.previousEventHash))) ||
    (value.fromStatus !== null &&
      !PRIVATE_INTAKE_STATUSES.includes(
        value.fromStatus as PrivateIntakeStatus,
      )) ||
    !PRIVATE_INTAKE_STATUSES.includes(value.toStatus as PrivateIntakeStatus)
  ) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest contains an invalid transition event.",
    );
  }
  return value as unknown as PrivateIntakeTransitionEvent;
};

const parseAcknowledgement = (
  value: unknown,
): PrivateIntakeAcknowledgement => {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    value.noIdentifiablePatientInformation !== true ||
    value.authorizedLocalStorageAndProcessing !== true ||
    value.sharedAndCopyrightedMaterialConsidered !== true ||
    typeof value.acknowledgedBy !== "string" ||
    !value.acknowledgedBy.trim() ||
    typeof value.acknowledgedAt !== "string" ||
    Number.isNaN(Date.parse(value.acknowledgedAt)) ||
    typeof value.scope !== "string" ||
    !value.scope.trim()
  ) {
    throw new PrivateIntakeError(
      "INVALID_MANIFEST",
      "Private intake manifest contains an invalid acknowledgement.",
    );
  }
  return value as unknown as PrivateIntakeAcknowledgement;
};

export const loadPrivateIntakeManifest = async (
  paths: PrivateIntakePaths,
  clock: IntakeClock = systemClock,
): Promise<PrivateIntakeManifest> => {
  try {
    const parsed = JSON.parse(await readFile(paths.intakeManifest, "utf8")) as unknown;
    if (
      !isRecord(parsed) ||
      parsed.schemaVersion !== 1 ||
      parsed.manifestVersion !== 1 ||
      parsed.pipelineVersion !== PRIVATE_INTAKE_PIPELINE_VERSION ||
      typeof parsed.updatedAt !== "string" ||
      !Array.isArray(parsed.acknowledgements) ||
      !Array.isArray(parsed.entries) ||
      !Array.isArray(parsed.events)
    ) {
      throw new PrivateIntakeError(
        "INVALID_MANIFEST",
        "Private intake manifest has an unsupported shape.",
      );
    }
    const entries = parsed.entries.map(parseManifestEntry);
    const acknowledgements = parsed.acknowledgements.map(
      parseAcknowledgement,
    );
    const events = parsed.events.map(parseTransitionEvent);
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length) {
      throw new PrivateIntakeError(
        "INVALID_MANIFEST",
        "Private intake manifest contains duplicate entry IDs.",
      );
    }
    if (
      new Set(acknowledgements.map((acknowledgement) => acknowledgement.id))
        .size !== acknowledgements.length ||
      new Set(events.map((event) => event.id)).size !== events.length
    ) {
      throw new PrivateIntakeError(
        "INVALID_MANIFEST",
        "Private intake manifest contains duplicate immutable record IDs.",
      );
    }
    return {
      schemaVersion: 1,
      manifestVersion: 1,
      pipelineVersion: PRIVATE_INTAKE_PIPELINE_VERSION,
      updatedAt: parsed.updatedAt,
      acknowledgements,
      entries,
      events,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return emptyManifest(isoNow(clock));
    }
    throw error;
  }
};

const checkpointManifest = async (
  paths: PrivateIntakePaths,
  manifest: PrivateIntakeManifest,
  clock: IntakeClock,
  tokenFactory: () => string,
): Promise<void> => {
  manifest.updatedAt = isoNow(clock);
  manifest.entries.sort((left, right) => left.id.localeCompare(right.id));
  await writePrivateJsonAtomic(paths.intakeManifest, manifest, tokenFactory);
};

interface PrivateIntakeLock {
  token: string;
  release: () => Promise<void>;
}

interface PrivateIntakeLockRecord {
  schemaVersion: 1;
  token: string;
  processId: number;
  acquiredAt: string;
}

export interface RecoverStalePrivateIntakeLockOptions {
  /**
   * Recovery is deliberately operator initiated. Callers must present an
   * explicit confirmation instead of silently deleting a lock at startup.
   */
  confirmed: true;
  recoveredBy: string;
  reason: string;
  minimumAgeMilliseconds?: number;
  clock?: IntakeClock;
  isProcessAlive?: (processId: number) => boolean | Promise<boolean>;
}

export interface RecoveredPrivateIntakeLock {
  schemaVersion: 1;
  recoveryId: string;
  recoveredAt: string;
  recoveredBy: string;
  reason: string;
  previousProcessId: number;
  previousAcquiredAt: string;
  archivedLockFilename: string;
}

const parsePrivateIntakeLockRecord = (
  value: unknown,
): PrivateIntakeLockRecord => {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.token !== "string" ||
    !/^[A-Za-z0-9._-]{1,200}$/.test(value.token) ||
    typeof value.processId !== "number" ||
    !Number.isSafeInteger(value.processId) ||
    value.processId < 1 ||
    typeof value.acquiredAt !== "string" ||
    !Number.isFinite(Date.parse(value.acquiredAt))
  ) {
    throw new PrivateIntakeError(
      "INVALID_INTAKE_LOCK",
      "The private intake lock is malformed and requires manual inspection.",
    );
  }
  return value as unknown as PrivateIntakeLockRecord;
};

const systemProcessAlive = (processId: number): boolean => {
  try {
    process.kill(processId, 0);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ESRCH") return false;
    // EPERM means the process exists but this process cannot signal it.
    if (code === "EPERM") return true;
    throw error;
  }
};

/**
 * Archive, rather than delete, a demonstrably stale single-writer lock.
 *
 * The exact lock bytes are atomically renamed into the immutable manifests
 * directory. A separate immutable recovery record identifies the operator,
 * time, and reason. If any precondition is uncertain, recovery fails closed.
 */
export const recoverStalePrivateIntakeLock = async (
  paths: PrivateIntakePaths,
  options: RecoverStalePrivateIntakeLockOptions,
): Promise<RecoveredPrivateIntakeLock> => {
  await ensurePrivateIntakePaths(paths);
  if (options.confirmed !== true) {
    throw new PrivateIntakeError(
      "RECOVERY_NOT_CONFIRMED",
      "Stale-lock recovery requires explicit operator confirmation.",
    );
  }
  const recoveredBy = options.recoveredBy.trim();
  const reason = options.reason.trim();
  if (
    !/^[A-Za-z0-9][A-Za-z0-9._ -]{1,119}$/.test(recoveredBy) ||
    reason.length < 4 ||
    reason.length > 500
  ) {
    throw new PrivateIntakeError(
      "INVALID_RECOVERY_AUDIT",
      "Stale-lock recovery requires a stable operator and a concise reason.",
    );
  }
  const minimumAgeMilliseconds =
    options.minimumAgeMilliseconds ?? 15 * 60 * 1000;
  if (
    !Number.isSafeInteger(minimumAgeMilliseconds) ||
    minimumAgeMilliseconds < 60_000 ||
    minimumAgeMilliseconds > 7 * 24 * 60 * 60 * 1000
  ) {
    throw new PrivateIntakeError(
      "INVALID_RECOVERY_AGE",
      "Stale-lock minimum age must be from one minute through seven days.",
    );
  }

  const lockDetails = await lstat(paths.lockFile);
  if (lockDetails.isSymbolicLink() || !lockDetails.isFile()) {
    throw new PrivateIntakeError(
      "UNSAFE_INTAKE_LOCK",
      "The private intake lock is not an ordinary local file.",
    );
  }
  const originalBytes = await readFile(paths.lockFile);
  let lock: PrivateIntakeLockRecord;
  try {
    lock = parsePrivateIntakeLockRecord(
      JSON.parse(originalBytes.toString("utf8")) as unknown,
    );
  } catch (error) {
    if (error instanceof PrivateIntakeError) throw error;
    throw new PrivateIntakeError(
      "INVALID_INTAKE_LOCK",
      "The private intake lock is malformed and requires manual inspection.",
    );
  }

  const clock = options.clock ?? systemClock;
  const recoveredAt = isoNow(clock);
  const age = Date.parse(recoveredAt) - Date.parse(lock.acquiredAt);
  if (!Number.isFinite(age) || age < minimumAgeMilliseconds) {
    throw new PrivateIntakeError(
      "INTAKE_LOCK_NOT_STALE",
      "The private intake lock is not old enough for recovery.",
    );
  }
  const isProcessAlive = options.isProcessAlive ?? systemProcessAlive;
  if (await isProcessAlive(lock.processId)) {
    throw new PrivateIntakeError(
      "INTAKE_LOCK_OWNER_ACTIVE",
      "The process that owns the private intake lock is still active.",
    );
  }

  // Re-read immediately before the atomic rename so a changed owner is never
  // displaced by a stale recovery decision.
  const currentBytes = await readFile(paths.lockFile);
  if (!currentBytes.equals(originalBytes)) {
    throw new PrivateIntakeError(
      "LOCK_OWNERSHIP_CHANGED",
      "Private intake lock ownership changed; refusing stale recovery.",
    );
  }
  const recoveryIdentity = sha256(
    `${sha256(originalBytes)}\n${recoveredAt}\n${recoveredBy}\n${reason}`,
  );
  const timestamp = recoveredAt.replaceAll(/[^0-9]/g, "").slice(0, 17);
  const archivedLockFilename =
    `recovered-intake-lock.${timestamp}.${recoveryIdentity}.json`;
  const archivePath = resolve(paths.manifests, archivedLockFilename);
  if (await exists(archivePath)) {
    throw new PrivateIntakeError(
      "RECOVERY_ARTIFACT_EXISTS",
      "The immutable stale-lock recovery artifact already exists.",
    );
  }
  await rename(paths.lockFile, archivePath);
  await syncDirectoryBestEffort(paths.manifests);

  const recovery: RecoveredPrivateIntakeLock = {
    schemaVersion: 1,
    recoveryId: `private-intake-lock-recovery.${recoveryIdentity}`,
    recoveredAt,
    recoveredBy,
    reason,
    previousProcessId: lock.processId,
    previousAcquiredAt: lock.acquiredAt,
    archivedLockFilename,
  };
  await writePrivateJsonAtomic(
    resolve(paths.manifests, `${recovery.recoveryId}.json`),
    recovery,
  );
  return recovery;
};

export const acquirePrivateIntakeLock = async (
  paths: PrivateIntakePaths,
  options: {
    clock?: IntakeClock;
    tokenFactory?: () => string;
  } = {},
): Promise<PrivateIntakeLock> => {
  await ensurePrivateIntakePaths(paths);
  const clock = options.clock ?? systemClock;
  const token = (options.tokenFactory ?? randomUUID)();
  let handle;
  try {
    handle = await open(paths.lockFile, "wx", 0o600);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new PrivateIntakeError(
        "INTAKE_LOCKED",
        "Another private clinical intake operation holds the single-writer lock.",
      );
    }
    throw error;
  }
  try {
    await handle.writeFile(
      stableStringify({
        schemaVersion: 1,
        token,
        processId: process.pid,
        acquiredAt: isoNow(clock),
      }),
      "utf8",
    );
    await handle.sync();
  } catch (error) {
    await handle.close().catch(() => undefined);
    await unlink(paths.lockFile).catch(() => undefined);
    throw error;
  }
  await handle.close();

  return {
    token,
    release: async () => {
      const current = JSON.parse(await readFile(paths.lockFile, "utf8")) as {
        token?: unknown;
      };
      if (current.token !== token) {
        throw new PrivateIntakeError(
          "LOCK_OWNERSHIP_CHANGED",
          "Private intake lock ownership changed; refusing to remove it.",
        );
      }
      await unlink(paths.lockFile);
    },
  };
};

export interface StreamedPrivateFingerprint {
  sha256: string;
  sizeBytes: number;
  detectedMediaType: string | null;
}

const looksLikeUtf8Text = (sample: Uint8Array): boolean => {
  if (sample.includes(0)) return false;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(sample);
    const unacceptable = [...text].filter((character) => {
      const code = character.charCodeAt(0);
      return code < 32 && !["\n", "\r", "\t", "\f"].includes(character);
    });
    return unacceptable.length <= Math.max(1, Math.floor(text.length / 100));
  } catch {
    return false;
  }
};

export const sniffPrivateSourceMediaType = (
  sample: Uint8Array,
  filename: string,
): string | null => {
  const prefix = Buffer.from(sample.subarray(0, 8));
  if (prefix.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  const extension = extname(filename).toLocaleLowerCase();
  const zipSignature =
    prefix.length >= 4 &&
    prefix[0] === 0x50 &&
    prefix[1] === 0x4b &&
    [0x03, 0x05, 0x07].includes(prefix[2] ?? -1) &&
    [0x04, 0x06, 0x08].includes(prefix[3] ?? -1);
  if (zipSignature && extension === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (looksLikeUtf8Text(sample)) {
    if (extension === ".md" || extension === ".markdown") {
      return "text/markdown";
    }
    if (extension === ".txt") return "text/plain";
  }
  return null;
};

export const fingerprintPrivateSource = async (
  path: string,
  filename = basename(path),
  maxBytes = DEFAULT_MAX_PRIVATE_SOURCE_BYTES,
): Promise<StreamedPrivateFingerprint> => {
  const linkDetails = await lstat(path);
  if (linkDetails.isSymbolicLink() || !linkDetails.isFile()) {
    throw new PrivateIntakeError(
      "UNSAFE_SOURCE_TYPE",
      "Private intake accepts ordinary files only.",
    );
  }
  const handle = await open(path, "r");
  try {
    const before = await handle.stat();
    if (
      !before.isFile() ||
      (linkDetails.dev !== before.dev || linkDetails.ino !== before.ino)
    ) {
      throw new PrivateIntakeError(
        "SOURCE_CHANGED_DURING_SCAN",
        "Private source identity changed before scanning began.",
      );
    }
    if (before.size > maxBytes) {
      throw new PrivateIntakeError(
        "SOURCE_TOO_LARGE",
        `Private source exceeds the configured ${maxBytes}-byte limit.`,
      );
    }

    const hash = createHash("sha256");
    const sampleChunks: Buffer[] = [];
    let sampled = 0;
    let total = 0;
    const stream = handle.createReadStream({ autoClose: false });
    for await (const rawChunk of stream) {
      const chunk = Buffer.isBuffer(rawChunk)
        ? rawChunk
        : Buffer.from(rawChunk);
      total += chunk.byteLength;
      if (total > maxBytes) {
        throw new PrivateIntakeError(
          "SOURCE_TOO_LARGE",
          `Private source exceeds the configured ${maxBytes}-byte limit.`,
        );
      }
      hash.update(chunk);
      if (sampled < 4096) {
        const portion = chunk.subarray(0, 4096 - sampled);
        sampleChunks.push(portion);
        sampled += portion.byteLength;
      }
    }
    const after = await handle.stat();
    if (
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      total !== after.size
    ) {
      throw new PrivateIntakeError(
        "SOURCE_CHANGED_DURING_SCAN",
        "Private source changed while it was being fingerprinted.",
      );
    }
    const sample = Buffer.concat(sampleChunks);
    return {
      sha256: hash.digest("hex"),
      sizeBytes: total,
      detectedMediaType: sniffPrivateSourceMediaType(sample, filename),
    };
  } finally {
    await handle.close();
  }
};

const nextAttempt = (
  entries: readonly PrivateIntakeManifestEntry[],
  originalFilename: string,
  sha: string | null,
): number =>
  entries.filter(
    (entry) =>
      entry.originalFilename === originalFilename && entry.sha256 === sha,
  ).length + 1;

const makeEntryId = (
  filename: string,
  sha: string | null,
  sizeBytes: number,
  attempt: number,
): string => {
  const filenameHash = sha256(filename.toLocaleLowerCase()).slice(0, 16);
  return sha
    ? `private-intake.sha256.${sha}.${filenameHash}.${attempt}`
    : `private-intake.unfingerprinted.${sha256(
        `${filename.toLocaleLowerCase()}:${sizeBytes}`,
      )}.${attempt}`;
};

const retainedFilename = (entry: PrivateIntakeManifestEntry): string =>
  `${entry.id}--${sanitizeFilename(entry.originalFilename)}`;

const replaceEntry = (
  manifest: PrivateIntakeManifest,
  entry: PrivateIntakeManifestEntry,
): void => {
  const existingIndex = manifest.entries.findIndex(
    (candidate) => candidate.id === entry.id,
  );
  const existing =
    existingIndex === -1 ? undefined : manifest.entries[existingIndex];
  if (!existing || existing.status !== entry.status) {
    const priorEvents = manifest.events.filter(
      (event) => event.entryId === entry.id,
    );
    const previousEventHash =
      priorEvents.length === 0
        ? null
        : priorEvents[priorEvents.length - 1]!.eventHash;
    const ordinal = priorEvents.length + 1;
    const eventCore = {
      schemaVersion: 1 as const,
      entryId: entry.id,
      ordinal,
      fromStatus: existing?.status ?? null,
      toStatus: entry.status,
      occurredAt: entry.updatedAt,
      storageRelativePath: entry.storageRelativePath,
      errorCode: entry.errorCode,
      previousEventHash,
    };
    const eventHash = sha256(JSON.stringify(canonicalize(eventCore)));
    manifest.events.push({
      ...eventCore,
      id: `private-intake-event.${entry.id}.${ordinal}.${eventHash}`,
      eventHash,
    });
  }
  if (existingIndex === -1) manifest.entries.push(entry);
  else manifest.entries[existingIndex] = entry;
};

const moveNoClobber = async (
  paths: PrivateIntakePaths,
  sourcePath: string,
  destinationPath: string,
): Promise<void> => {
  privateRelativePath(paths, sourcePath);
  privateRelativePath(paths, destinationPath);
  if (resolve(sourcePath) === resolve(destinationPath)) return;
  if (await exists(destinationPath)) {
    throw new PrivateIntakeError(
      "DESTINATION_EXISTS",
      "Private intake destination already exists; no file was overwritten.",
    );
  }
  await rename(sourcePath, destinationPath);
};

const assertAcknowledgement = (
  acknowledgement: PrivateIntakeAcknowledgement,
): void => {
  if (
    acknowledgement.noIdentifiablePatientInformation !== true ||
    acknowledgement.authorizedLocalStorageAndProcessing !== true ||
    acknowledgement.sharedAndCopyrightedMaterialConsidered !== true ||
    !acknowledgement.id.trim() ||
    !acknowledgement.acknowledgedBy.trim() ||
    !acknowledgement.scope.trim() ||
    Number.isNaN(Date.parse(acknowledgement.acknowledgedAt))
  ) {
    throw new PrivateIntakeError(
      "INVALID_ACKNOWLEDGEMENT",
      "Private source intake requires a complete no-PHI and local-processing acknowledgement.",
    );
  }
};

const assertRightsAuthorization = (
  authorization: IntakeRightsAuthorization,
  timestamp: string,
): void => {
  if (
    !authorization.sourceId.trim() ||
    !authorization.rightsDecisionId.trim() ||
    !/^[a-f0-9]{64}$/.test(authorization.rightsDecisionSha256) ||
    Number.isNaN(Date.parse(authorization.rightsDecisionEffectiveAt)) ||
    (authorization.rightsDecisionExpiresAt !== null &&
      (Number.isNaN(Date.parse(authorization.rightsDecisionExpiresAt)) ||
        Date.parse(authorization.rightsDecisionExpiresAt) <=
          Date.parse(timestamp))) ||
    Number.isNaN(Date.parse(authorization.reviewedAt)) ||
    Date.parse(authorization.rightsDecisionEffectiveAt) > Date.parse(timestamp) ||
    Date.parse(authorization.reviewedAt) > Date.parse(timestamp) ||
    (authorization.localProcessingPermitted &&
      !authorization.privateStoragePermitted)
  ) {
    throw new PrivateIntakeError(
      "INVALID_RIGHTS_AUTHORIZATION",
      "Private intake received an invalid or not-yet-effective rights authorization.",
    );
  }
};

export const scanPrivateIntake = async (
  options: ScanPrivateIntakeOptions,
): Promise<ScanPrivateIntakeReport> => {
  const clock = options.clock ?? systemClock;
  const tokenFactory = options.tokenFactory ?? randomUUID;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_PRIVATE_SOURCE_BYTES;
  assertAcknowledgement(options.acknowledgement);
  await ensurePrivateIntakePaths(options.paths);
  const lock = await acquirePrivateIntakeLock(options.paths, {
    clock,
    tokenFactory,
  });

  const report: ScanPrivateIntakeReport = {
    queued: 0,
    duplicates: 0,
    rightsBlocked: 0,
    quarantined: 0,
    ignored: 0,
    manifestPath: options.paths.intakeManifest,
  };

  try {
    const manifest = await loadPrivateIntakeManifest(options.paths, clock);
    const existingAcknowledgement = manifest.acknowledgements.find(
      (candidate) => candidate.id === options.acknowledgement.id,
    );
    if (
      existingAcknowledgement &&
      JSON.stringify(canonicalize(existingAcknowledgement)) !==
        JSON.stringify(canonicalize(options.acknowledgement))
    ) {
      throw new PrivateIntakeError(
        "ACKNOWLEDGEMENT_ID_REUSED",
        "An immutable intake acknowledgement ID was reused with different content.",
      );
    }
    if (!existingAcknowledgement) {
      manifest.acknowledgements.push(structuredClone(options.acknowledgement));
      await checkpointManifest(
        options.paths,
        manifest,
        clock,
        tokenFactory,
      );
    }
    const directoryEntries = await readdir(options.paths.inbox, {
      withFileTypes: true,
    });
    for (const directoryEntry of directoryEntries.sort((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      if (directoryEntry.name.startsWith(".")) {
        report.ignored += 1;
        continue;
      }
      if (!directoryEntry.isFile()) {
        throw new PrivateIntakeError(
          "UNSAFE_SOURCE_TYPE",
          "Private source inbox contains a non-file entry.",
        );
      }

      const sourcePath = resolve(options.paths.inbox, directoryEntry.name);
      const initialStat = await stat(sourcePath);
      const rights = await options.resolveRights(directoryEntry.name);
      const timestamp = isoNow(clock);
      if (rights) assertRightsAuthorization(rights, timestamp);

      if (!rights?.privateStoragePermitted) {
        const existingBlocked = manifest.entries.find(
          (entry) =>
            entry.originalFilename === directoryEntry.name &&
            entry.sha256 === null &&
            entry.status === "rights_blocked" &&
            entry.storageRelativePath ===
              privateRelativePath(options.paths, sourcePath),
        );
        if (existingBlocked) {
          report.ignored += 1;
          continue;
        }
        const attempt = nextAttempt(
          manifest.entries,
          directoryEntry.name,
          null,
        );
        const entry: PrivateIntakeManifestEntry = {
          schemaVersion: 1,
          id: makeEntryId(
            directoryEntry.name,
            null,
            initialStat.size,
            attempt,
          ),
          byteIdentityId: null,
          originalFilename: directoryEntry.name,
          sizeBytes: initialStat.size,
          sha256: null,
          detectedMediaType: null,
          status: "rights_blocked",
          duplicateOfId: null,
          sourceId: rights?.sourceId ?? null,
          sourceSnapshotId: null,
          rightsDecisionId: rights?.rightsDecisionId ?? null,
          rightsDecisionSha256: rights?.rightsDecisionSha256 ?? null,
          rightsDecisionEffectiveAt:
            rights?.rightsDecisionEffectiveAt ?? null,
          rightsDecisionExpiresAt: rights?.rightsDecisionExpiresAt ?? null,
          acknowledgementId: options.acknowledgement.id,
          storageRelativePath: privateRelativePath(options.paths, sourcePath),
          discoveredAt: timestamp,
          updatedAt: timestamp,
          errorCode: "PRIVATE_STORAGE_NOT_PERMITTED",
          errorMessage:
            "Source bytes were not opened because private storage permission is absent.",
          extractionArtifactId: null,
          extractionArtifactSha256: null,
          parserId: null,
          parserVersion: null,
          chunkerVersion: null,
          extractionOutcome: null,
        };
        replaceEntry(manifest, entry);
        await checkpointManifest(
          options.paths,
          manifest,
          clock,
          tokenFactory,
        );
        report.rightsBlocked += 1;
        continue;
      }

      if (initialStat.size > maxBytes) {
        const attempt = nextAttempt(
          manifest.entries,
          directoryEntry.name,
          null,
        );
        let entry: PrivateIntakeManifestEntry = {
          schemaVersion: 1,
          id: makeEntryId(
            directoryEntry.name,
            null,
            initialStat.size,
            attempt,
          ),
          byteIdentityId: null,
          originalFilename: directoryEntry.name,
          sizeBytes: initialStat.size,
          sha256: null,
          detectedMediaType: null,
          status: "discovered",
          duplicateOfId: null,
          sourceId: rights.sourceId,
          sourceSnapshotId: null,
          rightsDecisionId: rights.rightsDecisionId,
          rightsDecisionSha256: rights.rightsDecisionSha256,
          rightsDecisionEffectiveAt: rights.rightsDecisionEffectiveAt,
          rightsDecisionExpiresAt: rights.rightsDecisionExpiresAt,
          acknowledgementId: options.acknowledgement.id,
          storageRelativePath: privateRelativePath(options.paths, sourcePath),
          discoveredAt: timestamp,
          updatedAt: timestamp,
          errorCode: null,
          errorMessage: null,
          extractionArtifactId: null,
          extractionArtifactSha256: null,
          parserId: null,
          parserVersion: null,
          chunkerVersion: null,
          extractionOutcome: null,
        };
        replaceEntry(manifest, entry);
        await checkpointManifest(
          options.paths,
          manifest,
          clock,
          tokenFactory,
        );
        const destination = resolve(
          options.paths.quarantine,
          retainedFilename(entry),
        );
        await moveNoClobber(options.paths, sourcePath, destination);
        entry = {
          ...entry,
          status: "quarantined",
          storageRelativePath: privateRelativePath(
            options.paths,
            destination,
          ),
          updatedAt: isoNow(clock),
          errorCode: "SOURCE_TOO_LARGE",
          errorMessage: `Source exceeds the configured ${maxBytes}-byte limit.`,
        };
        replaceEntry(manifest, entry);
        await checkpointManifest(
          options.paths,
          manifest,
          clock,
          tokenFactory,
        );
        report.quarantined += 1;
        continue;
      }

      let fingerprint: StreamedPrivateFingerprint;
      try {
        fingerprint = await fingerprintPrivateSource(
          sourcePath,
          directoryEntry.name,
          maxBytes,
        );
      } catch (error) {
        throw new PrivateIntakeError(
          error instanceof PrivateIntakeError ? error.code : "FINGERPRINT_FAILED",
          sanitizePrivateIntakeError(error),
        );
      }
      const attempt = nextAttempt(
        manifest.entries,
        directoryEntry.name,
        fingerprint.sha256,
      );
      let entry: PrivateIntakeManifestEntry = {
        schemaVersion: 1,
        id: makeEntryId(
          directoryEntry.name,
          fingerprint.sha256,
          fingerprint.sizeBytes,
          attempt,
        ),
        byteIdentityId: `source-bytes.sha256.${fingerprint.sha256}`,
        originalFilename: directoryEntry.name,
        sizeBytes: fingerprint.sizeBytes,
        sha256: fingerprint.sha256,
        detectedMediaType: fingerprint.detectedMediaType,
        status: "discovered",
        duplicateOfId: null,
        sourceId: rights.sourceId,
        sourceSnapshotId: null,
        rightsDecisionId: rights.rightsDecisionId,
        rightsDecisionSha256: rights.rightsDecisionSha256,
        rightsDecisionEffectiveAt: rights.rightsDecisionEffectiveAt,
        rightsDecisionExpiresAt: rights.rightsDecisionExpiresAt,
        acknowledgementId: options.acknowledgement.id,
        storageRelativePath: privateRelativePath(options.paths, sourcePath),
        discoveredAt: timestamp,
        updatedAt: timestamp,
        errorCode: null,
        errorMessage: null,
        extractionArtifactId: null,
        extractionArtifactSha256: null,
        parserId: null,
        parserVersion: null,
        chunkerVersion: null,
        extractionOutcome: null,
      };
      replaceEntry(manifest, entry);
      await checkpointManifest(options.paths, manifest, clock, tokenFactory);

      const canonical = manifest.entries.find(
        (candidate) =>
          candidate.id !== entry.id &&
          candidate.sha256 === fingerprint.sha256 &&
          candidate.duplicateOfId === null,
      );
      let destinationDirectory: string;
      if (canonical) {
        entry = {
          ...entry,
          status: "duplicate",
          duplicateOfId: canonical.id,
        };
        destinationDirectory = options.paths.duplicates;
        report.duplicates += 1;
      } else if (!fingerprint.detectedMediaType) {
        entry = {
          ...entry,
          status: "quarantined",
          errorCode: "UNSUPPORTED_MEDIA_TYPE",
          errorMessage:
            "Source bytes did not match an allowed PDF, DOCX, UTF-8 text, or Markdown type.",
        };
        destinationDirectory = options.paths.quarantine;
        report.quarantined += 1;
      } else if (!rights.localProcessingPermitted) {
        entry = {
          ...entry,
          status: "rights_blocked",
          errorCode: "LOCAL_PROCESSING_NOT_PERMITTED",
          errorMessage:
            "Source was fingerprinted and retained privately but cannot be extracted.",
        };
        destinationDirectory = options.paths.rightsBlocked;
        report.rightsBlocked += 1;
      } else {
        entry = { ...entry, status: "queued" };
        destinationDirectory = options.paths.staging;
        report.queued += 1;
      }

      const destination = resolve(
        destinationDirectory,
        retainedFilename(entry),
      );
      await moveNoClobber(options.paths, sourcePath, destination);
      entry = {
        ...entry,
        storageRelativePath: privateRelativePath(options.paths, destination),
        updatedAt: isoNow(clock),
      };
      replaceEntry(manifest, entry);
      await checkpointManifest(options.paths, manifest, clock, tokenFactory);
    }
    return report;
  } finally {
    await lock.release();
  }
};

const findEntryRawPath = async (
  paths: PrivateIntakePaths,
  entry: PrivateIntakeManifestEntry,
): Promise<string | null> => {
  const recorded = absolutePrivatePath(paths, entry.storageRelativePath);
  if (await exists(recorded)) return recorded;
  const retained = retainedFilename(entry);
  for (const directory of [
    paths.staging,
    paths.processed,
    paths.rightsBlocked,
    paths.quarantine,
  ]) {
    const candidate = resolve(directory, retained);
    if (await exists(candidate)) return candidate;
  }
  return null;
};

const writeImmutablePrivateArtifact = async (
  path: string,
  artifact: unknown,
  tokenFactory: () => string,
): Promise<string> => {
  const serialized = stableStringify(artifact);
  const expectedHash = sha256(serialized);
  if (await exists(path)) {
    const existingHash = sha256(await readFile(path));
    if (existingHash !== expectedHash) {
      throw new PrivateIntakeError(
        "IMMUTABLE_ARTIFACT_CONFLICT",
        "An immutable extraction artifact exists with different bytes.",
      );
    }
    return expectedHash;
  }
  return writePrivateJsonAtomic(path, artifact, tokenFactory);
};

export const processPrivateIntake = async (
  options: ProcessPrivateIntakeOptions,
): Promise<ProcessPrivateIntakeReport> => {
  const clock = options.clock ?? systemClock;
  const tokenFactory = options.tokenFactory ?? randomUUID;
  await ensurePrivateIntakePaths(options.paths);
  const lock = await acquirePrivateIntakeLock(options.paths, {
    clock,
    tokenFactory,
  });
  const report: ProcessPrivateIntakeReport = {
    extracted: 0,
    quarantined: 0,
    manifestPath: options.paths.intakeManifest,
  };
  try {
    const manifest = await loadPrivateIntakeManifest(options.paths, clock);
    const candidates = manifest.entries.filter((entry) =>
      ["queued", "extracting"].includes(entry.status),
    );
    for (const candidate of candidates) {
      let entry = manifest.entries.find(
        (current) => current.id === candidate.id,
      )!;
      if (!entry.sha256) {
        throw new PrivateIntakeError(
          "INVALID_MANIFEST",
          "Queued private source lacks a byte fingerprint.",
        );
      }
      entry = {
        ...entry,
        status: "extracting",
        updatedAt: isoNow(clock),
        errorCode: null,
        errorMessage: null,
      };
      replaceEntry(manifest, entry);
      await checkpointManifest(options.paths, manifest, clock, tokenFactory);

      let rawPath: string | null = null;
      try {
        rawPath = await findEntryRawPath(options.paths, entry);
        if (!rawPath) {
          throw new PrivateIntakeError(
            "SOURCE_BYTES_MISSING",
            "Private source bytes are missing from retained storage.",
          );
        }
        const fingerprint = await fingerprintPrivateSource(
          rawPath,
          entry.originalFilename,
          options.maxBytes ?? DEFAULT_MAX_PRIVATE_SOURCE_BYTES,
        );
        if (fingerprint.sha256 !== entry.sha256) {
          throw new PrivateIntakeError(
            "SOURCE_HASH_CHANGED",
            "Private source hash changed after intake.",
          );
        }
        const extraction = await options.extract(rawPath, entry);
        for (const value of [
          extraction.parserId,
          extraction.parserVersion,
          extraction.chunkerVersion,
        ]) {
          if (!value.trim()) {
            throw new PrivateIntakeError(
              "INVALID_EXTRACTOR_RESULT",
              "Extractor identity and versions must be explicit.",
            );
          }
        }
        const extractionIdentityHash = sha256(
          [
            entry.sha256,
            extraction.parserId,
            extraction.parserVersion,
            extraction.chunkerVersion,
            extraction.outcome ?? "complete",
          ].join("\u0000"),
        );
        const artifactId = `private-extraction.sha256.${entry.sha256}.${extractionIdentityHash}`;
        const artifact = {
          schemaVersion: 1,
          id: artifactId,
          sourceIntakeEntryId: entry.id,
          sourceSha256: entry.sha256,
          parserId: extraction.parserId,
          parserVersion: extraction.parserVersion,
          chunkerVersion: extraction.chunkerVersion,
          extractionOutcome: extraction.outcome ?? "complete",
          sourceDiscoveredAt: entry.discoveredAt,
          payload: extraction.payload,
        };
        const artifactPath = resolve(
          options.paths.extracted,
          `${artifactId}.json`,
        );
        const artifactHash = await writeImmutablePrivateArtifact(
          artifactPath,
          artifact,
          tokenFactory,
        );
        const processedPath = resolve(
          options.paths.processed,
          retainedFilename(entry),
        );
        await moveNoClobber(options.paths, rawPath, processedPath);
        entry = {
          ...entry,
          status: "extracted",
          storageRelativePath: privateRelativePath(
            options.paths,
            processedPath,
          ),
          updatedAt: isoNow(clock),
          extractionArtifactId: artifactId,
          extractionArtifactSha256: artifactHash,
          parserId: extraction.parserId,
          parserVersion: extraction.parserVersion,
          chunkerVersion: extraction.chunkerVersion,
          extractionOutcome: extraction.outcome ?? "complete",
          errorCode: null,
          errorMessage: null,
        };
        report.extracted += 1;
      } catch (error) {
        const sourceToQuarantine =
          rawPath ?? (await findEntryRawPath(options.paths, entry));
        if (sourceToQuarantine) {
          const quarantinePath = resolve(
            options.paths.quarantine,
            retainedFilename(entry),
          );
          if (resolve(sourceToQuarantine) !== resolve(quarantinePath)) {
            await moveNoClobber(
              options.paths,
              sourceToQuarantine,
              quarantinePath,
            );
          }
          entry = {
            ...entry,
            storageRelativePath: privateRelativePath(
              options.paths,
              quarantinePath,
            ),
          };
        }
        entry = {
          ...entry,
          status: "quarantined",
          updatedAt: isoNow(clock),
          errorCode:
            error instanceof PrivateIntakeError
              ? error.code
              : "EXTRACTION_FAILED",
          errorMessage: sanitizePrivateIntakeError(error),
        };
        report.quarantined += 1;
      }
      replaceEntry(manifest, entry);
      await checkpointManifest(options.paths, manifest, clock, tokenFactory);
    }
    return report;
  } finally {
    await lock.release();
  }
};

export interface PrivateIntakeValidationReport {
  valid: boolean;
  issues: string[];
}

export const validatePrivateIntake = async (
  paths: PrivateIntakePaths,
): Promise<PrivateIntakeValidationReport> => {
  const manifest = await loadPrivateIntakeManifest(paths);
  const issues: string[] = [];
  const byId = new Map(manifest.entries.map((entry) => [entry.id, entry]));
  const acknowledgementIds = new Set(
    manifest.acknowledgements.map((acknowledgement) => acknowledgement.id),
  );
  for (const event of manifest.events) {
    if (!byId.has(event.entryId)) {
      issues.push(`${event.id}: transition references an unknown intake entry.`);
    }
  }
  for (const entry of manifest.entries) {
    if (!acknowledgementIds.has(entry.acknowledgementId)) {
      issues.push(`${entry.id}: acknowledgement record is missing.`);
    }
    if (
      entry.rightsDecisionId !== null &&
      (!entry.rightsDecisionSha256 ||
        !/^[a-f0-9]{64}$/.test(entry.rightsDecisionSha256) ||
        !entry.rightsDecisionEffectiveAt ||
        Number.isNaN(Date.parse(entry.rightsDecisionEffectiveAt)) ||
        (entry.rightsDecisionExpiresAt !== null &&
          Number.isNaN(Date.parse(entry.rightsDecisionExpiresAt))))
    ) {
      issues.push(`${entry.id}: immutable rights-decision reference is incomplete.`);
    }

    const events = manifest.events
      .filter((event) => event.entryId === entry.id)
      .sort((left, right) => left.ordinal - right.ordinal);
    let expectedPriorHash: string | null = null;
    let expectedFromStatus: PrivateIntakeStatus | null = null;
    events.forEach((event, index) => {
      const eventCore = {
        schemaVersion: 1 as const,
        entryId: event.entryId,
        ordinal: event.ordinal,
        fromStatus: event.fromStatus,
        toStatus: event.toStatus,
        occurredAt: event.occurredAt,
        storageRelativePath: event.storageRelativePath,
        errorCode: event.errorCode,
        previousEventHash: event.previousEventHash,
      };
      const expectedEventHash = sha256(JSON.stringify(canonicalize(eventCore)));
      const expectedEventId =
        `private-intake-event.${entry.id}.${event.ordinal}.${expectedEventHash}`;
      if (
        event.ordinal !== index + 1 ||
        event.previousEventHash !== expectedPriorHash ||
        event.fromStatus !== expectedFromStatus ||
        event.eventHash !== expectedEventHash ||
        event.id !== expectedEventId
      ) {
        issues.push(`${event.id}: transition hash chain is invalid.`);
      }
      expectedPriorHash = event.eventHash;
      expectedFromStatus = event.toStatus;
    });
    if (events.length === 0 || events[events.length - 1]!.toStatus !== entry.status) {
      issues.push(`${entry.id}: current status does not match transition history.`);
    }

    let path: string;
    try {
      path = absolutePrivatePath(paths, entry.storageRelativePath);
    } catch {
      issues.push(`${entry.id}: storage path escapes the private root.`);
      continue;
    }
    if (entry.status !== "archived" && !(await exists(path))) {
      issues.push(`${entry.id}: retained source file is missing.`);
    }
    if (entry.status === "duplicate") {
      const canonical = entry.duplicateOfId
        ? byId.get(entry.duplicateOfId)
        : undefined;
      if (!canonical || !entry.sha256 || canonical.sha256 !== entry.sha256) {
        issues.push(`${entry.id}: duplicate relation is invalid.`);
      }
    }
    if (
      ["queued", "extracting", "extracted", "duplicate"].includes(
        entry.status,
      ) &&
      !entry.sha256
    ) {
      issues.push(`${entry.id}: status requires a SHA-256 identity.`);
    }
    if (entry.status === "extracted") {
      if (
        !entry.extractionArtifactId ||
        !entry.extractionArtifactSha256 ||
        !entry.parserId ||
        !entry.parserVersion ||
        !entry.chunkerVersion ||
        entry.extractionOutcome === null
      ) {
        issues.push(`${entry.id}: extracted provenance is incomplete.`);
      } else {
        const artifactPath = resolve(
          paths.extracted,
          `${entry.extractionArtifactId}.json`,
        );
        if (!(await exists(artifactPath))) {
          issues.push(`${entry.id}: extraction artifact is missing.`);
        } else if (
          sha256(await readFile(artifactPath)) !==
          entry.extractionArtifactSha256
        ) {
          issues.push(`${entry.id}: extraction artifact hash changed.`);
        }
      }
    }
  }
  return { valid: issues.length === 0, issues };
};
