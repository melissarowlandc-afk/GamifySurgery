import {
  createGameEvidenceCheckpoint, deserializeGameState, importGameEvidence, restoreGameEvidenceImportSource, serializeGameState,
  type DomainContext, type GameEvidenceArchive, type GameEvidenceCheckpoint, type GameEvidenceRecord, type GameEvidenceSnapshot,
} from "@gamify-surgery/game-domain";
import { assertCloudRevision, CLOUD_CAPACITY_LIMITS, readCloudCampaignMetadata, type CloudCampaignMetadata } from "./codec";
import { compressCloudText, decompressCloudText, type CloudCompressedText, type CloudCompression } from "./codecCompression";
import { assertMappedGameFields } from "./codecOwnership";
import { CloudCodecError, codecObject, logicalJsonText, parseCodecJson, sameLogicalJson, sha256Utf8, utf8Bytes, type CodecJson, type CodecObject } from "./codecJson";

/** New normalized layout. Format 1 remains an offline/backward-compatibility baseline reader. */
export const CLOUD_EVIDENCE_FORMAT_VERSION = 2;
export interface CloudSourceProvenance { readonly sha256: string; readonly utf8Bytes: number; readonly schemaVersion: number }
interface EvidenceHeader {
  formatVersion: 1;
  version: 1;
  campaignId: string;
  source: CloudSourceProvenance;
  baseline: GameEvidenceArchive["baseline"];
}
export interface CloudPackedEvidence {
  readonly header: CloudCompressedText;
  readonly records: readonly { readonly id: string; readonly content: CloudCompressedText }[];
}
export interface CloudEvidenceEnvelope {
  cloudFormatVersion: 2;
  evidenceContractVersion: 1;
  campaign: CloudCampaignMetadata;
  baselineId: string;
  evidenceHighWater: number;
  evidenceManifestSha256: string;
  operational: GameEvidenceSnapshot;
}

const canonical = (value: unknown): string => logicalJsonText(parseCodecJson(JSON.stringify(value)));
function exactFields(value: object, fields: readonly string[]): void {
  if (Object.keys(value).length !== fields.length || fields.some(field => !Object.hasOwn(value, field))) throw new CloudCodecError("invalid_shape", "Fields do not match the normalized cloud contract.");
}
const baselineId = (source: CloudSourceProvenance): string => `baseline.${source.sha256}`;
function checkSource(source: CloudSourceProvenance): void {
  if (!/^[a-f0-9]{64}$/.test(source.sha256) || !Number.isSafeInteger(source.utf8Bytes) || source.utf8Bytes <= 0 ||
    !Number.isSafeInteger(source.schemaVersion) || source.schemaVersion < 1 || source.schemaVersion > 9) throw new CloudCodecError("source_provenance", "Invalid immutable source provenance.");
}
async function mapBounded<T, R>(values: readonly T[], operation: (value: T) => Promise<R>): Promise<R[]> {
  const result: R[] = [];
  for (let index = 0; index < values.length; index += 16) result.push(...await Promise.all(values.slice(index, index + 16).map(operation)));
  return result;
}
async function decodedJson(value: CloudCompressedText): Promise<CodecObject> {
  const text = await decompressCloudText(value), parsed = codecObject(parseCodecJson(text), "Compressed canonical JSON");
  if (logicalJsonText(parsed) !== text) throw new CloudCodecError("noncanonical_json", "Decoded storage bytes are not the agreed canonical JSON.");
  return parsed;
}

/** Encode immutable rows ONCE, separately from operational snapshots. Every gzip/deflate result is decoded and SHA-256 verified. */
export async function encodeCloudEvidenceCheckpoint(input: {
  checkpoint: GameEvidenceCheckpoint; campaign: CloudCampaignMetadata; source: CloudSourceProvenance;
  operationId: string; expectedRevision: string; encoding?: CloudCompression;
  acknowledgedEvidence?: { headerSha256: string; records: number };
}) {
  assertCloudRevision(input.expectedRevision, true);
  checkSource(input.source);
  if (!input.operationId || utf8Bytes(input.operationId) > 256) throw new CloudCodecError("operation_id", "Invalid operation ID.");
  const campaign = readCloudCampaignMetadata(parseCodecJson(JSON.stringify(input.campaign)));
  const state = importGameEvidence(input.checkpoint.snapshot, input.checkpoint.evidence);
  if (state.campaignId !== campaign.campaignId || input.checkpoint.evidence.campaignId !== campaign.campaignId) throw new CloudCodecError("campaign_identity", "Campaign metadata differs from the evidence owner.");
  assertMappedGameFields(codecObject(parseCodecJson(serializeGameState(state)), "Domain state"));
  const encoding = input.encoding ?? "gzip", archive = input.checkpoint.evidence;
  const archiveText = canonical(archive);
  const header: EvidenceHeader = { formatVersion: 1, version: archive.version, campaignId: archive.campaignId, source: input.source, baseline: archive.baseline };
  const headerText = canonical(header), recordTexts = archive.records.map(canonical);
  const records = await mapBounded(archive.records, async record => ({ id: record.id, content: await compressCloudText(canonical(record), encoding) }));
  const packedEvidence: CloudPackedEvidence = Object.freeze({ header: await compressCloudText(headerText, encoding), records: Object.freeze(records) });
  const envelope: CloudEvidenceEnvelope = { cloudFormatVersion: CLOUD_EVIDENCE_FORMAT_VERSION, evidenceContractVersion: 1,
    campaign, baselineId: baselineId(input.source), evidenceHighWater: archive.records.length,
    evidenceManifestSha256: await sha256Utf8(archiveText), operational: input.checkpoint.snapshot };
  const snapshotText = canonical(envelope), snapshot = await compressCloudText(snapshotText, encoding);
  const acknowledged = input.acknowledgedEvidence;
  if (acknowledged && (!Number.isSafeInteger(acknowledged.records) || acknowledged.records < 0 || acknowledged.records > records.length ||
    acknowledged.headerSha256 !== packedEvidence.header.uncompressedSha256)) throw new CloudCodecError("evidence_acknowledgment", "Acknowledged immutable baseline/high-water does not match this checkpoint.");
  const mutationEvidence = acknowledged
    ? { headerSha256: acknowledged.headerSha256, fromRecord: acknowledged.records, toRecord: records.length, records: records.slice(acknowledged.records) }
    : { header: packedEvidence.header, fromRecord: 0, toRecord: records.length, records };
  const request = Object.freeze({ protocolVersion: 2, operationId: input.operationId, expectedRevision: input.expectedRevision,
    campaignId: campaign.campaignId, snapshot, evidence: mutationEvidence });
  const requestText = canonical(request);
  const evidenceRawBytes = utf8Bytes(headerText) + recordTexts.reduce((sum, text) => sum + utf8Bytes(text), 0);
  const evidenceStoredBytes = packedEvidence.header.compressedBytes + records.reduce((sum, row) => sum + row.content.compressedBytes, 0);
  // Raw text-RPC comparison includes escaping. Its nested transport strings are
  // not authored game strings and need not satisfy the inner JSON string bound.
  const rawJsonBodyBytes = utf8Bytes(JSON.stringify({ protocolVersion: 2, operationId: input.operationId, expectedRevision: input.expectedRevision,
    campaignId: campaign.campaignId, payloadText: snapshotText,
    ...(acknowledged ? { evidenceHeaderSha256: acknowledged.headerSha256, fromRecord: acknowledged.records } : { evidenceHeaderText: headerText, fromRecord: 0 }),
    toRecord: records.length, evidenceRecords: recordTexts.slice(acknowledged?.records ?? 0) }));
  const sizes = Object.freeze({
    decodedGameBytes: utf8Bytes(serializeGameState(state)), snapshotRawBytes: utf8Bytes(snapshotText), snapshotStoredBytes: snapshot.compressedBytes,
    evidenceRawBytes, evidenceStoredBytes, evidenceArchiveRawBytes: utf8Bytes(archiveText),
    rawJsonBodyBytes, transportBodyBytes: utf8Bytes(requestText), immutableRecords: archive.records.length,
    newEvidenceUploadRows: mutationEvidence.records.length,
    newEvidenceUploadBytes: (acknowledged ? 0 : packedEvidence.header.compressedBytes) + mutationEvidence.records.reduce((sum, row) => sum + row.content.compressedBytes, 0),
  });
  const capacity = (snapshotBytes: number, evidenceBytes: number, bodyBytes: number) => {
    const failures: string[] = [];
    if (sizes.decodedGameBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) failures.push("decoded-game-ceiling");
    if (snapshotBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) failures.push("snapshot-ceiling");
    if (evidenceBytes > CLOUD_CAPACITY_LIMITS.evidencePerCampaignBytes) failures.push("evidence-allowance");
    if (bodyBytes > CLOUD_CAPACITY_LIMITS.transportBodyBytes) failures.push("transport-body-ceiling");
    return { withinSnapshotTarget: snapshotBytes <= CLOUD_CAPACITY_LIMITS.snapshotTargetBytes, failures, withinByteLimits: failures.length === 0 };
  };
  return Object.freeze({ checkpoint: input.checkpoint, envelope, snapshotText, archiveText, packedEvidence, snapshot, request,
    transport: Object.freeze({ text: requestText, sha256: await sha256Utf8(requestText), utf8Bytes: sizes.transportBodyBytes }), sizes,
    rawCapacity: capacity(sizes.snapshotRawBytes, sizes.evidenceRawBytes, sizes.rawJsonBodyBytes),
    compressedCapacity: capacity(sizes.snapshotStoredBytes, sizes.evidenceStoredBytes, sizes.transportBodyBytes),
    // An encoding/byte result is not a backend's decompression, SQL-validation or physical-capacity acceptance.
    serverInflationAndValidationRequired: true as const });
}

export async function prepareCloudEvidenceImport(input: {
  serializedState: string; campaign: CloudCampaignMetadata; operationId: string; encoding?: CloudCompression;
}, context?: DomainContext) {
  const source = codecObject(parseCodecJson(input.serializedState), "Original import source");
  assertMappedGameFields(source);
  let state;
  try { state = deserializeGameState(input.serializedState, context); }
  catch { throw new CloudCodecError("domain_validation", "The public domain loader rejected the import source."); }
  if (typeof source.campaignId === "string" && source.campaignId !== state.campaignId) throw new CloudCodecError("campaign_identity", "The import would change an existing campaign identity.");
  const checkpoint = createGameEvidenceCheckpoint(state, { sourceState: source });
  const provenance = Object.freeze({ sha256: await sha256Utf8(input.serializedState), utf8Bytes: utf8Bytes(input.serializedState), schemaVersion: Number(source.schemaVersion) });
  const prepared = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: input.campaign, operationId: input.operationId,
    expectedRevision: "0", source: provenance, encoding: input.encoding });
  return Object.freeze({ ...prepared, sourceRecovery: Object.freeze({ text: input.serializedState, ...provenance }) });
}

/** Exact uncompressed bytes are verified before JSON/hydration; prior snapshots use their own evidence high-water prefix. */
export async function loadCloudEvidenceCheckpoint(input: {
  snapshot: CloudCompressedText; evidence: CloudPackedEvidence; revision: string;
  expectedRevision: string; expectedCampaignId: string; expectedBaselineId: string;
}) {
  assertCloudRevision(input.revision); assertCloudRevision(input.expectedRevision);
  if (input.revision !== input.expectedRevision) throw new CloudCodecError("revision_mismatch", "The loaded revision differs from the requested revision.");
  const envelope = await decodedJson(input.snapshot);
  exactFields(envelope, ["cloudFormatVersion", "evidenceContractVersion", "campaign", "baselineId", "evidenceHighWater", "evidenceManifestSha256", "operational"]);
  if (envelope.cloudFormatVersion !== CLOUD_EVIDENCE_FORMAT_VERSION || envelope.evidenceContractVersion !== 1) throw new CloudCodecError("unsupported_cloud_format", "Unsupported normalized cloud format.");
  const campaign = readCloudCampaignMetadata(envelope.campaign!);
  const header = await decodedJson(input.evidence.header) as unknown as EvidenceHeader;
  exactFields(header, ["formatVersion", "version", "campaignId", "source", "baseline"]);
  checkSource(header.source);
  if (header.formatVersion !== 1 || header.version !== 1 || header.campaignId !== input.expectedCampaignId ||
    campaign.campaignId !== input.expectedCampaignId || envelope.baselineId !== input.expectedBaselineId ||
    baselineId(header.source) !== input.expectedBaselineId) throw new CloudCodecError("campaign_identity", "Loaded campaign or immutable import identity differs from the expected owner.");
  const count = envelope.evidenceHighWater;
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || count > input.evidence.records.length ||
    typeof envelope.evidenceManifestSha256 !== "string" || !/^[a-f0-9]{64}$/.test(envelope.evidenceManifestSha256)) throw new CloudCodecError("evidence_high_water", "Invalid evidence high-water reference.");
  const required = input.evidence.records.slice(0, count);
  const declaredDecodedBytes = input.evidence.header.uncompressedBytes + required.reduce((sum, row) => sum + row.content.uncompressedBytes, 0);
  if (!Number.isSafeInteger(declaredDecodedBytes) || declaredDecodedBytes > 6_000_000) throw new CloudCodecError("evidence_size", "Aggregate decoded evidence exceeds the processing bound.");
  const records = await mapBounded(required, async row => {
    const record = await decodedJson(row.content) as unknown as GameEvidenceRecord;
    if (row.id !== record.id) throw new CloudCodecError("evidence_identity", "The immutable row ID differs from its hashed contents.");
    return record;
  });
  const archive: GameEvidenceArchive = { version: 1, campaignId: header.campaignId, baseline: header.baseline, records };
  if (archive.baseline.source.schemaVersion !== header.source.schemaVersion) throw new CloudCodecError("source_provenance", "The import source schema does not match its immutable provenance.");
  if (await sha256Utf8(canonical(archive)) !== envelope.evidenceManifestSha256) throw new CloudCodecError("evidence_manifest", "The required immutable evidence prefix failed its manifest check.");
  const operational = envelope.operational as unknown as GameEvidenceSnapshot;
  const state = importGameEvidence(operational, archive);
  assertMappedGameFields(codecObject(parseCodecJson(serializeGameState(state)), "Hydrated domain state"));
  if (state.campaignId !== input.expectedCampaignId) throw new CloudCodecError("campaign_identity", "The reconstructed game has a different owner.");
  return { state, campaign, checkpoint: { snapshot: operational, evidence: archive } satisfies GameEvidenceCheckpoint,
    originalSource: restoreGameEvidenceImportSource(archive), revision: input.revision, source: header.source };
}
