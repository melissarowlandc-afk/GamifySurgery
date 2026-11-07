import { createGameEvidenceCheckpoint, importGameEvidence, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { assertCloudRevision, CLOUD_CAPACITY_LIMITS, readCloudCampaignMetadata, type CloudCampaignMetadata } from "./codec";
import { compressCloudText, decompressCloudText, type CloudCompressedText } from "./codecCompression";
import { CloudCodecError, codecObject, logicalJsonText, parseCodecJson, sha256Utf8, utf8Bytes, type CodecJson } from "./codecJson";
import { equalParsedJson } from "./codecWorkerJsonEqual";
import { assertMappedGameFields } from "./codecOwnership";
import type { CloudPackedEvidence } from "./codecEvidence";
import type { CloudConfirmed, SnapshotLineage } from "./transport";

export const SNAPSHOT_BASELINE = "snapshot.v1";
// Every caller below supplies already parsed/checked JSON. Re-parsing an entire
// checked envelope kept another full object and text tree alive during opening.
const canonical = (value: unknown) => logicalJsonText(value as CodecJson);
let empty: Promise<CloudPackedEvidence> | undefined;
/** Compatibility shape inside old cache/journal interfaces only. No header or
 * evidence is sent by protocol 4, and there are never any evidence pages. */
export const snapshotEvidence = () => empty ??= compressCloudText("{}", "gzip").then(header => ({ header, records: [] }));
export const isSnapshotCopy = (copy: { saveFormat?: number; baselineId?: string }) => copy.saveFormat === 3 || copy.baselineId === SNAPSHOT_BASELINE;

/** Match format-2 hydration: frozen state never resolves against today's
 * question registry or silently prunes retired FSRS entries. A fresh baseline
 * validates the existing domain contract without any transition archive. */
function currentSnapshotState(game: ReturnType<typeof codecObject>) {
  assertMappedGameFields(game);
  if (game.schemaVersion !== 8 && game.schemaVersion !== 9) throw new CloudCodecError("unsupported_game_schema", "Unsupported clinic snapshot schema.");
  try {
    const checkpoint = createGameEvidenceCheckpoint(game as unknown as GameState);
    const state = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
    // importGameEvidence resolves plain JSON from the checked archive. Compare
    // it directly: another serialize/strict-parse duplicated the entire clinic.
    if (!equalParsedJson(game, state as unknown as CodecJson)) throw new CloudCodecError("domain_fidelity", "Loading this snapshot would alter saved progress.");
    return { state, checkpoint };
  } catch (error) {
    if (error instanceof CloudCodecError) throw error;
    throw new CloudCodecError("domain_validation", "The current clinic snapshot failed domain validation.");
  }
}

export function readSnapshotLineage(value: unknown): SnapshotLineage {
  const row = codecObject(parseCodecJson(JSON.stringify(value)), "Snapshot lineage");
  if (Object.keys(row).length !== 3 || typeof row.branchId !== "string" || !row.branchId || utf8Bytes(row.branchId) > 160 ||
    !Number.isSafeInteger(row.sequence) || Number(row.sequence) < 0 || !Array.isArray(row.parents) || row.parents.length > 4 ||
    row.parents.some(hash => typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash)))
    throw new CloudCodecError("snapshot_lineage", "Invalid snapshot integrity metadata.");
  return row as unknown as SnapshotLineage;
}

export async function encodeCloudSnapshot(input: { state: GameState; campaign: CloudCampaignMetadata; lineage: SnapshotLineage }) {
  const campaign = readCloudCampaignMetadata(parseCodecJson(JSON.stringify(input.campaign))), lineage = readSnapshotLineage(input.lineage);
  const stateText = serializeGameState(input.state), state = codecObject(parseCodecJson(stateText), "Current clinic");
  assertMappedGameFields(state);
  if (state.campaignId !== campaign.campaignId) throw new CloudCodecError("campaign_identity", "Snapshot belongs to another campaign.");
  if (utf8Bytes(stateText) > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) throw new CloudCodecError("capacity", "Current clinic exceeds the snapshot limit.");
  const text = canonical({ cloudFormatVersion: 3, campaign, lineage, gameState: state });
  const snapshot = await compressCloudText(text, "gzip"), evidence = await snapshotEvidence();
  return { snapshot, evidence, lineage, baselineId: SNAPSHOT_BASELINE, stateText,
    sizes: { decodedGameBytes: utf8Bytes(stateText), snapshotRawBytes: utf8Bytes(text), snapshotStoredBytes: snapshot.compressedBytes } };
}

/** Current state is authoritative. Validate it without replaying a single past
 * action/review. The evidence checkpoint here is an ephemeral, fresh local
 * journal baseline; it contains no old transition archive. */
export async function loadCloudSnapshot(input: { snapshot: CloudCompressedText; revision: string; expectedRevision: string;
  expectedCampaignId: string; lineage?: SnapshotLineage }) {
  assertCloudRevision(input.revision); assertCloudRevision(input.expectedRevision);
  if (input.revision !== input.expectedRevision) throw new CloudCodecError("revision_mismatch", "Snapshot revision differs.");
  const text = await decompressCloudText(input.snapshot), envelope = codecObject(parseCodecJson(text), "Snapshot envelope");
  if (envelope.cloudFormatVersion !== 3 || Object.keys(envelope).length !== 4 || canonical(envelope) !== text)
    throw new CloudCodecError("unsupported_cloud_format", "Unsupported current-state snapshot.");
  const campaign = readCloudCampaignMetadata(envelope.campaign!), lineage = readSnapshotLineage(envelope.lineage);
  if (input.lineage && canonical(lineage) !== canonical(readSnapshotLineage(input.lineage))) throw new CloudCodecError("snapshot_lineage", "Snapshot metadata differs from its checked payload.");
  const game = codecObject(envelope.gameState!, "Current clinic"); assertMappedGameFields(game);
  if (campaign.campaignId !== input.expectedCampaignId || game.campaignId !== campaign.campaignId)
    throw new CloudCodecError("campaign_identity", "Snapshot belongs to another campaign.");
  const stateText = JSON.stringify(game), { state, checkpoint } = currentSnapshotState(game);
  return { state, campaign, checkpoint, originalSource: game,
    revision: input.revision, source: { sha256: await sha256Utf8(stateText), utf8Bytes: utf8Bytes(stateText), schemaVersion: state.schemaVersion },
    snapshotLineage: lineage };
}

export async function snapshotCopy(state: GameState, campaign: CloudCampaignMetadata, revision: string, acceptedAtMs: number,
  lineage: SnapshotLineage): Promise<CloudConfirmed> {
  const encoded = await encodeCloudSnapshot({ state, campaign, lineage });
  return { saveFormat: 3, campaignId: campaign.campaignId, revision, acceptedAtMs, snapshot: encoded.snapshot,
    evidence: encoded.evidence, baselineId: SNAPSHOT_BASELINE, lineage };
}

export async function prepareSnapshotImport(input: { serializedState: string; campaign: CloudCampaignMetadata; branchId: string }) {
  const original = codecObject(parseCodecJson(input.serializedState), "Local clinic");
  let state: GameState;
  if (original.schemaVersion === 8 || original.schemaVersion === 9) state = currentSnapshotState(original).state;
  else {
    // One-time compatibility with older local schemas uses the already tested
    // legacy adapter. Never substitute a fresh state or silently drop history.
    const { prepareCloudEvidenceImport, loadCloudEvidenceCheckpoint } = await import("./codecEvidence");
    const legacy = await prepareCloudEvidenceImport({ serializedState: input.serializedState, campaign: input.campaign, operationId: input.branchId });
    state = (await loadCloudEvidenceCheckpoint({ snapshot: legacy.snapshot, evidence: legacy.packedEvidence, revision: "1", expectedRevision: "1",
      expectedCampaignId: input.campaign.campaignId, expectedBaselineId: legacy.envelope.baselineId })).state;
  }
  const encoded = await encodeCloudSnapshot({ state, campaign: input.campaign, lineage: { branchId: input.branchId, sequence: 0, parents: [] } });
  return { ...encoded, saveFormat: 3 as const, packedEvidence: encoded.evidence, envelope: { baselineId: SNAPSHOT_BASELINE } };
}
