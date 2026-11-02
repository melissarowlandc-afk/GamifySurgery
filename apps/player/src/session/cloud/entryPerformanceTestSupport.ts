import { gzipSync } from "node:zlib";
import { applyGameEvidenceCommand, deserializeGameState } from "@gamify-surgery/game-domain";
import checkpoints from "../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json";
import { codecTestCampaign } from "./codecTestSupport";
import { encodeCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { decompressCloudText, type CloudCompressedText } from "./codecCompression";
import type { CloudConfirmed } from "./transport";

/** Real retained Level 5 state + reducer-produced operational history. Valid
 * stored-block gzip exercises a ~5 MB byte boundary without inventing content,
 * padding a save or changing the account format. Test-only Node compression. */
export async function largeEntryFixture() {
  const source = JSON.stringify(checkpoints["integration-lower-repeat"]), state = deserializeGameState(source);
  const imported = await prepareCloudEvidenceImport({ serializedState: source, campaign: codecTestCampaign(source), operationId: "entry.perf" });
  let checkpoint = imported.checkpoint;
  for (let i = 0; i < 1_200; i++) checkpoint = applyGameEvidenceCommand(checkpoint,
    { type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `entry.perf.${i}` }).checkpoint;
  const prepared = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: imported.envelope.campaign,
    source: { sha256: imported.sourceRecovery.sha256, utf8Bytes: imported.sourceRecovery.utf8Bytes, schemaVersion: 9 },
    operationId: "perf.changed", expectedRevision: "1" });
  const stored = async (value: CloudCompressedText): Promise<CloudCompressedText> => {
    const bytes = gzipSync(await decompressCloudText(value), { level: 0 });
    return { ...value, compressedBytes: bytes.length, dataBase64: bytes.toString("base64") };
  };
  const copy: CloudConfirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 1_800_000_000_000,
    baselineId: prepared.envelope.baselineId, snapshot: await stored(prepared.snapshot), evidence: {
      header: await stored(prepared.packedEvidence.header), records: await Promise.all(prepared.packedEvidence.records.map(async row => ({ ...row, content: await stored(row.content) }))) } };
  return { copy, state, prepared, source };
}
