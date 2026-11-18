import { gunzipSync, gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, deserializeGameState } from "@gamify-surgery/game-domain";
import checkpoints from "../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json";
import pressureHistory from "../../../../../tests/fixtures/level-five-entry-pressure-history-20261116.json";
import { codecTestCampaign } from "./codecTestSupport";
import { encodeCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { decompressCloudText, type CloudCompressedText } from "./codecCompression";
import type { CloudConfirmed } from "./transport";

const stableJson = (value: unknown): string => value === null || typeof value !== "object"
  ? JSON.stringify(value) : Array.isArray(value) ? `[${value.map(stableJson).join(",")}]`
    : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`).join(",")}}`;
const stateHash = (value: unknown) => createHash("sha256").update(stableJson(value)).digest("hex");

/** Later admitted content changes the current journey checkpoints. Preserve the
 * exact public, reducer-generated large-history workload as a <1 MB compressed
 * fixture; a deserialize opt-out cannot recreate already retired history. */
function largeHistorySource(): string {
  const source = gunzipSync(Buffer.from(pressureHistory.gzipBase64, "base64"));
  if (createHash("sha256").update(source).digest("hex") !== "bf0b0e357e36a94f4753ae31976b0fa3fb2477b2d6aac508ff1ad4e92151530c" ||
      stateHash(JSON.parse(source.toString("utf8"))) !== "a3710c4f1611256a87607801f1c599e2e3dfe50a147bc2cf22b943ebfa06ef05")
    throw new Error("Public opening-pressure history changed.");
  if (source.length !== pressureHistory.sourceUtf8Bytes) throw new Error("Public opening-pressure bytes changed.");
  return source.toString("utf8");
}

/** Real retained Level 5 state + reducer-produced operational history. Valid
 * stored-block gzip exercises a ~5 MB byte boundary without inventing content,
 * padding a save or changing the account format. Test-only Node compression. */
export async function largeEntryFixture(actions = 1_200, storedBlocks = true, options: { compactHistory?: boolean } = {}) {
  const source = options.compactHistory === false ? largeHistorySource()
    : JSON.stringify(checkpoints["integration-lower-repeat"]);
  const state = deserializeGameState(source);
  // Workload construction must retain the authentic old history. Actual opening
  // and snapshot creation still use the production compaction policy.
  const imported = await prepareCloudEvidenceImport({ serializedState: source, campaign: codecTestCampaign(source), operationId: "entry.perf" });
  let checkpoint = options.compactHistory === false
    ? createGameEvidenceCheckpoint(deserializeGameState(source, undefined, { compactHistory: false }))
    : imported.checkpoint;
  for (let i = 0; i < actions; i++) checkpoint = applyGameEvidenceCommand(checkpoint,
    { type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `entry.perf.${i}` }).checkpoint;
  const provenance = { sha256: imported.sourceRecovery.sha256, utf8Bytes: imported.sourceRecovery.utf8Bytes, schemaVersion: 9 };
  const prepared = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: imported.envelope.campaign,
    source: provenance,
    operationId: "perf.changed", expectedRevision: "1" });
  const stored = async (value: CloudCompressedText): Promise<CloudCompressedText> => {
    if (!storedBlocks) return value;
    const bytes = gzipSync(await decompressCloudText(value), { level: 0 });
    return { ...value, compressedBytes: bytes.length, dataBase64: bytes.toString("base64") };
  };
  const copy: CloudConfirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 1_800_000_000_000,
    baselineId: prepared.envelope.baselineId, snapshot: await stored(prepared.snapshot), evidence: {
      header: await stored(prepared.packedEvidence.header), records: await Promise.all(prepared.packedEvidence.records.map(async row => ({ ...row, content: await stored(row.content) }))) } };
  return { copy, state, prepared, source, provenance };
}
