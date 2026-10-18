import {
  deserializeGameState, serializeGameState, type DomainContext, type GameState,
} from "@gamify-surgery/game-domain";
import type { CampaignTutorialGuidance } from "../tutorialGuidance";
import { assertMappedGameFields } from "./codecOwnership";
import {
  changedTopLevelFields, CloudCodecError, codecObject, parseCodecJson, sameLogicalJson,
  sha256Utf8, utf8Bytes, type CodecJson, type CodecObject,
} from "./codecJson";

export { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";

/** Historical B2.1 format. New normalized writes use CLOUD_EVIDENCE_FORMAT_VERSION (2). */
export const CLOUD_FORMAT_VERSION = 1;
export const CLOUD_EVIDENCE_CONTRACT_VERSION = 1;
export const CLOUD_PROTOCOL_VERSION = 1;
export const CLOUD_CODEC_MODE = "baseline-import-only";
export const CLOUD_CAPACITY_LIMITS = Object.freeze({
  snapshotTargetBytes: 2_000_000,
  snapshotCeilingBytes: 3_000_000,
  evidencePerCampaignBytes: 1_000_000,
  retainedSnapshotsPerAccountBytes: 8_000_000,
  evidencePerAccountBytes: 2_000_000,
  transportBodyBytes: 6_000_000,
  recoveryBytes: 7_000_000,
  campaignsPerAccount: 2,
});

/** Only selected campaign metadata travels. No whole profile, usage outbox or camera settings. */
export interface CloudCampaignMetadata {
  campaignId: string;
  name: string;
  status: "resumable" | "archived";
  createdAtRealMs: number;
  updatedAtRealMs: number;
  tutorial: {
    guidance: CampaignTutorialGuidance | null;
    introDismissed: boolean;
    dailyRoutineTipAcknowledgments: string[];
    dailyRoutinePause: boolean | null;
  };
}

export interface CloudImportBaseline {
  evidenceContractVersion: 1;
  kind: "local-import-baseline";
  baselineId: string;
  campaignId: string;
  sourceSchemaVersion: number;
  sourceStateSha256: string;
  sourceStateUtf8Bytes: number;
  historicalCoverage: "available-local-data-only";
  legacyReviewProjection: "not-reconstructed" | "domain-v1-reconstruction-not-observed-evidence";
  historicalQuestionCountCredit: 0;
  /** Exact parsed original, including fields the public domain loader migrates or bounds. */
  sourceState: CodecObject;
}

export interface CloudSnapshotEnvelope {
  cloudFormatVersion: 1;
  evidenceContractVersion: 1;
  mode: "baseline-import-only";
  campaign: CloudCampaignMetadata;
  gameSchemaVersion: number;
  /** Compatibility cache; the immutable baseline owns the imported evidence. */
  gameState: CodecObject;
  baselineId: string;
}

export interface CloudTextReceipt {
  readonly text: string;
  readonly sha256: string;
  readonly utf8Bytes: number;
}

export interface CloudBaselineImportRequest {
  protocolVersion: 1;
  operationId: string;
  expectedRevision: "0";
  campaignId: string;
  payloadText: string;
  payloadSha256: string;
  baselineText: string;
  baselineSha256: string;
}

export interface CloudCodecSizes {
  decodedStateBytes: number;
  snapshotBytes: number;
  baselineEvidenceBytes: number;
  transportBytes: number;
}

export function assessCloudCodecCapacity(sizes: CloudCodecSizes): {
  withinSnapshotTarget: boolean; eligibleForBaselineImport: boolean; failures: string[];
} {
  for (const bytes of [sizes.decodedStateBytes, sizes.snapshotBytes, sizes.baselineEvidenceBytes, sizes.transportBytes]) {
    if (!Number.isSafeInteger(bytes) || bytes < 0) throw new CloudCodecError("invalid_size", "Invalid UTF-8 size measurement.");
  }
  const failures: string[] = [];
  if (sizes.decodedStateBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) failures.push("decoded-state-ceiling");
  if (sizes.snapshotBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) failures.push("snapshot-ceiling");
  if (sizes.baselineEvidenceBytes > CLOUD_CAPACITY_LIMITS.evidencePerCampaignBytes) failures.push("baseline-evidence-allowance");
  if (sizes.transportBytes > CLOUD_CAPACITY_LIMITS.transportBodyBytes) failures.push("transport-body-ceiling");
  return { withinSnapshotTarget: sizes.snapshotBytes <= CLOUD_CAPACITY_LIMITS.snapshotTargetBytes,
    eligibleForBaselineImport: failures.length === 0, failures };
}

function exactKeys(value: CodecObject, keys: readonly string[], label: string): void {
  if (Object.keys(value).length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) {
    throw new CloudCodecError("invalid_shape", `${label} fields do not match this codec version.`);
  }
}

function requireString(value: CodecJson | undefined, max: number, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0 || utf8Bytes(value) > max) {
    throw new CloudCodecError("invalid_shape", `${label} is missing or exceeds its UTF-8 limit.`);
  }
}

function requireTimestamp(value: CodecJson | undefined): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new CloudCodecError("invalid_shape", "Local timestamp must be a nonnegative safe integer, never a cloud revision.");
  }
}

function requireHash(value: unknown): asserts value is string {
  if (typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value)) {
    throw new CloudCodecError("invalid_hash", "Expected a lowercase SHA-256 digest.");
  }
}

/** Revisions remain decimal strings across JS/SQL; no floating-point bigint conversion. */
export function assertCloudRevision(value: unknown, allowZero = false): asserts value is string {
  if (typeof value !== "string" || !/^(0|[1-9]\d{0,18})$/.test(value)) {
    throw new CloudCodecError("invalid_revision", "Cloud revision must be a supported PostgreSQL bigint decimal string.");
  }
  if ((!allowZero && value === "0") || BigInt(value) > 9_223_372_036_854_775_807n) {
    throw new CloudCodecError("invalid_revision", "Cloud revision must be a supported PostgreSQL bigint decimal string.");
  }
}

export function readCloudCampaignMetadata(value: CodecJson): CloudCampaignMetadata {
  const object = codecObject(value, "Campaign metadata");
  exactKeys(object, ["campaignId", "name", "status", "createdAtRealMs", "updatedAtRealMs", "tutorial"], "Campaign metadata");
  requireString(object.campaignId, 256, "Campaign ID");
  requireString(object.name, 160, "Campaign name");
  if (object.status !== "resumable" && object.status !== "archived") throw new CloudCodecError("invalid_shape", "Invalid campaign lifecycle status.");
  requireTimestamp(object.createdAtRealMs);
  requireTimestamp(object.updatedAtRealMs);
  const tutorial = codecObject(object.tutorial!, "Campaign tutorial");
  exactKeys(tutorial, ["guidance", "introDismissed", "dailyRoutineTipAcknowledgments", "dailyRoutinePause"], "Campaign tutorial");
  if (typeof tutorial.introDismissed !== "boolean" || tutorial.dailyRoutinePause !== null && typeof tutorial.dailyRoutinePause !== "boolean" ||
    !Array.isArray(tutorial.dailyRoutineTipAcknowledgments) ||
    tutorial.dailyRoutineTipAcknowledgments.some(id => typeof id !== "string" || id.length === 0 || utf8Bytes(id) > 256)) {
    throw new CloudCodecError("invalid_shape", "Invalid campaign tutorial state.");
  }
  if (tutorial.guidance !== null) {
    const guidance = codecObject(tutorial.guidance!, "Tutorial guidance");
    exactKeys(guidance, ["version", "mode", "exposedTopicIds"], "Tutorial guidance");
    if (guidance.version !== 2 || !["guided", "off", "complete"].includes(String(guidance.mode)) ||
      !Array.isArray(guidance.exposedTopicIds) || guidance.exposedTopicIds.some(id =>
        typeof id !== "string" || id.length === 0 || utf8Bytes(id) > 256)) {
      throw new CloudCodecError("invalid_shape", "Invalid tutorial guidance version or fields.");
    }
  }
  return object as unknown as CloudCampaignMetadata;
}

function persistedState(state: GameState): CodecObject {
  const parsed = codecObject(parseCodecJson(serializeGameState(state)), "Serialized domain state");
  assertMappedGameFields(parsed);
  return parsed;
}

function domainLoad(source: CodecObject, context?: DomainContext): { state: GameState; persisted: CodecObject } {
  const schema = source.schemaVersion;
  if (typeof schema !== "number" || !Number.isSafeInteger(schema) || schema < 1 || schema > 9) {
    throw new CloudCodecError("unsupported_game_schema", "The saved game uses an unsupported schema version.");
  }
  assertMappedGameFields(source);
  try {
    const state = deserializeGameState(JSON.stringify(source), context);
    return { state, persisted: persistedState(state) };
  } catch (error) {
    if (error instanceof CloudCodecError) throw error;
    // Keep arbitrary domain error content out of logs and future sync UI.
    throw new CloudCodecError("domain_validation", "The public domain deserializer rejected the saved game.");
  }
}

async function textReceipt(text: string): Promise<CloudTextReceipt> {
  return Object.freeze({ text, sha256: await sha256Utf8(text), utf8Bytes: utf8Bytes(text) });
}

/**
 * Pure offline preparation, NOT permission to upload. Source bytes remain unchanged
 * and must be retained by the caller. B2.2 must check auth, consent, quotas and IDs.
 * There is deliberately no live-checkpoint encoder until the domain exports evidence.
 * @deprecated Format 1 compatibility only. New writes use prepareCloudEvidenceImport / encodeCloudEvidenceCheckpoint.
 */
export async function prepareCloudBaselineImport(input: {
  serializedState: string; campaign: CloudCampaignMetadata; operationId: string;
}, context?: DomainContext) {
  requireString(input.operationId, 256, "Import operation ID");
  const campaign = readCloudCampaignMetadata(parseCodecJson(JSON.stringify(input.campaign)));
  const source = codecObject(parseCodecJson(input.serializedState), "Local source state");
  const migrated = domainLoad(source, context);
  if (migrated.state.campaignId !== campaign.campaignId ||
    typeof source.campaignId === "string" && source.campaignId !== campaign.campaignId) {
    throw new CloudCodecError("campaign_identity", "Campaign metadata and the saved game have different IDs.");
  }
  const reloaded = domainLoad(migrated.persisted, context);
  if (!sameLogicalJson(migrated.persisted, reloaded.persisted)) {
    throw new CloudCodecError("domain_fidelity", "The public domain load changes the migrated logical state; preserve the source and request domain review.");
  }
  const sourceRecovery = await textReceipt(input.serializedState);
  const baselineId = `baseline.${sourceRecovery.sha256}`;
  const baseline: CloudImportBaseline = {
    evidenceContractVersion: CLOUD_EVIDENCE_CONTRACT_VERSION, kind: "local-import-baseline", baselineId,
    campaignId: campaign.campaignId, sourceSchemaVersion: source.schemaVersion as number,
    sourceStateSha256: sourceRecovery.sha256, sourceStateUtf8Bytes: sourceRecovery.utf8Bytes,
    historicalCoverage: "available-local-data-only",
    legacyReviewProjection: source.schemaVersion === 1 ? "domain-v1-reconstruction-not-observed-evidence" : "not-reconstructed",
    historicalQuestionCountCredit: 0, sourceState: source,
  };
  const envelope: CloudSnapshotEnvelope = {
    cloudFormatVersion: CLOUD_FORMAT_VERSION, evidenceContractVersion: CLOUD_EVIDENCE_CONTRACT_VERSION,
    mode: CLOUD_CODEC_MODE, campaign, gameSchemaVersion: migrated.state.schemaVersion,
    gameState: migrated.persisted, baselineId,
  };
  const snapshot = await textReceipt(JSON.stringify(envelope));
  const evidence = await textReceipt(JSON.stringify(baseline));
  const request: Readonly<CloudBaselineImportRequest> = Object.freeze({
    protocolVersion: CLOUD_PROTOCOL_VERSION, operationId: input.operationId, expectedRevision: "0",
    campaignId: campaign.campaignId, payloadText: snapshot.text, payloadSha256: snapshot.sha256,
    baselineText: evidence.text, baselineSha256: evidence.sha256,
  });
  // Hash the WHOLE immutable codec request. A future RPC adding a material argument
  // must version/extend this contract instead of reusing this digest for a subset.
  const transport = await textReceipt(JSON.stringify(request));
  const sizes: CloudCodecSizes = { decodedStateBytes: utf8Bytes(JSON.stringify(migrated.persisted)),
    snapshotBytes: snapshot.utf8Bytes, baselineEvidenceBytes: evidence.utf8Bytes, transportBytes: transport.utf8Bytes };
  return Object.freeze({ request, transport, snapshot, evidence, sourceRecovery, sizes: Object.freeze(sizes),
    capacity: assessCloudCodecCapacity(sizes),
    migration: { sourceSchemaVersion: source.schemaVersion as number, targetSchemaVersion: migrated.state.schemaVersion,
      changedFields: changedTopLevelFields(source, migrated.persisted) },
    liveEvidenceReady: false as const, blocker: "domain-evidence-export-required" as const });
}

/** Verify the exact server-returned UTF-8 bytes before parsing ANY stored JSON. */
export async function verifyCloudStoredText(receipt: CloudTextReceipt, ceilingBytes: number = CLOUD_CAPACITY_LIMITS.transportBodyBytes): Promise<void> {
  requireHash(receipt.sha256);
  if (typeof receipt.text !== "string" || !Number.isSafeInteger(receipt.utf8Bytes) || receipt.utf8Bytes < 0 ||
    receipt.text.length > ceilingBytes || receipt.utf8Bytes > ceilingBytes || utf8Bytes(receipt.text) !== receipt.utf8Bytes) {
    throw new CloudCodecError("stored_size", "The stored text byte count is invalid or exceeds the processing ceiling.");
  }
  if (await sha256Utf8(receipt.text) !== receipt.sha256) throw new CloudCodecError("checksum", "Stored text failed SHA-256 verification.");
}

function readBaseline(value: CodecJson): CloudImportBaseline {
  const object = codecObject(value, "Import baseline");
  exactKeys(object, ["evidenceContractVersion", "kind", "baselineId", "campaignId", "sourceSchemaVersion",
    "sourceStateSha256", "sourceStateUtf8Bytes", "historicalCoverage", "legacyReviewProjection", "historicalQuestionCountCredit", "sourceState"], "Import baseline");
  if (object.evidenceContractVersion !== CLOUD_EVIDENCE_CONTRACT_VERSION || object.kind !== "local-import-baseline" ||
    object.historicalCoverage !== "available-local-data-only" || object.historicalQuestionCountCredit !== 0) {
    throw new CloudCodecError("unsupported_evidence_contract", "Unsupported baseline evidence contract.");
  }
  requireHash(object.sourceStateSha256);
  requireString(object.campaignId, 256, "Baseline campaign ID");
  if (object.baselineId !== `baseline.${object.sourceStateSha256}` || typeof object.sourceStateUtf8Bytes !== "number" ||
    !Number.isSafeInteger(object.sourceStateUtf8Bytes) || object.sourceStateUtf8Bytes <= 0) {
    throw new CloudCodecError("invalid_shape", "Invalid baseline identity or source provenance.");
  }
  const source = codecObject(object.sourceState!, "Baseline source state");
  if (object.sourceSchemaVersion !== source.schemaVersion) throw new CloudCodecError("invalid_shape", "Baseline source schema does not match its state.");
  if (object.legacyReviewProjection !== (source.schemaVersion === 1 ? "domain-v1-reconstruction-not-observed-evidence" : "not-reconstructed")) {
    throw new CloudCodecError("invalid_shape", "Legacy reconstructed reviews must be identified as projections.");
  }
  return object as unknown as CloudImportBaseline;
}

/**
 * B2.1 import hydration only. A later evolving snapshot requires a new evidence
 * mode/version. Equality to the authoritative migrated baseline is mandatory;
 * this rejects changed cash/cards/reviews instead of silently trusting the cache.
 * SQL canonical text/hashes are supplied by B2.2, never emulated here.
 */
export async function loadCloudBaselineImport(input: {
  snapshot: CloudTextReceipt & { revision: string };
  evidence: CloudTextReceipt;
  expectedCampaignId: string;
  expectedRevision: string;
  expectedBaselineId: string;
}, context?: DomainContext): Promise<{
  state: GameState; campaign: CloudCampaignMetadata; baseline: CloudImportBaseline;
  revision: string; liveEvidenceReady: false;
}> {
  assertCloudRevision(input.expectedRevision);
  assertCloudRevision(input.snapshot.revision);
  if (input.snapshot.revision !== input.expectedRevision) throw new CloudCodecError("revision_mismatch", "The loaded revision differs from the requested revision.");
  await verifyCloudStoredText(input.snapshot, CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes);
  await verifyCloudStoredText(input.evidence);
  const envelope = codecObject(parseCodecJson(input.snapshot.text), "Cloud envelope");
  exactKeys(envelope, ["cloudFormatVersion", "evidenceContractVersion", "mode", "campaign", "gameSchemaVersion", "gameState", "baselineId"], "Cloud envelope");
  if (envelope.cloudFormatVersion !== CLOUD_FORMAT_VERSION || envelope.evidenceContractVersion !== CLOUD_EVIDENCE_CONTRACT_VERSION ||
    envelope.mode !== CLOUD_CODEC_MODE) throw new CloudCodecError("unsupported_cloud_format", "Unsupported cloud envelope or evidence mode.");
  const campaign = readCloudCampaignMetadata(envelope.campaign!);
  const baseline = readBaseline(parseCodecJson(input.evidence.text));
  const game = codecObject(envelope.gameState!, "Cloud state");
  if (campaign.campaignId !== input.expectedCampaignId || baseline.campaignId !== campaign.campaignId ||
    game.campaignId !== campaign.campaignId || baseline.baselineId !== input.expectedBaselineId ||
    envelope.baselineId !== baseline.baselineId) throw new CloudCodecError("campaign_identity", "Loaded campaign or baseline identity does not match the requested campaign.");
  if (envelope.gameSchemaVersion !== game.schemaVersion) throw new CloudCodecError("invalid_shape", "Envelope and game schema versions differ.");
  const original = domainLoad(baseline.sourceState, context);
  const loaded = domainLoad(game, context);
  if (!sameLogicalJson(game, loaded.persisted)) throw new CloudCodecError("domain_fidelity", "The public domain load would alter this snapshot.");
  if (!sameLogicalJson(original.persisted, game)) {
    throw new CloudCodecError("baseline_projection_mismatch", "The snapshot does not reconcile with the immutable import baseline.");
  }
  return { state: loaded.state, campaign, baseline, revision: input.snapshot.revision, liveEvidenceReady: false };
}
