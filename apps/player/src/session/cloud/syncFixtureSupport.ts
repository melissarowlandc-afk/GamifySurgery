import { applyGameEvidenceCommand, createInitialGameState, serializeGameState, type GameCommand, type GameEvidenceCheckpoint } from "@gamify-surgery/game-domain";
import { prepareCloudEvidenceImport, encodeCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import type { CloudCandidate, CloudConfirmed } from "./transport";

// Kept free of the coordinator/codec worker so Playwright specs can import it.
export async function syncFixture(campaignId = "cloud.synthetic") {
  const serializedState = serializeGameState(createInitialGameState(undefined, { campaignId, campaignSeed: "cloud.test", createdAtRealMs: 0 }));
  const prepared = await prepareCloudEvidenceImport({ serializedState, campaign: codecTestCampaign(serializedState), operationId: "import.synthetic" });
  const confirmed: CloudConfirmed = { campaignId, revision: "1", acceptedAtMs: 1_800_000_000_000,
    baselineId: prepared.envelope.baselineId, snapshot: prepared.snapshot, evidence: prepared.packedEvidence };
  async function candidate(checkpoint: GameEvidenceCheckpoint, accepted = confirmed, usageQuestions: CloudCandidate["usageQuestions"] = []): Promise<CloudCandidate> {
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: prepared.envelope.campaign,
      source: { sha256: prepared.sourceRecovery.sha256, utf8Bytes: prepared.sourceRecovery.utf8Bytes, schemaVersion: prepared.sourceRecovery.schemaVersion },
      operationId: "candidate", expectedRevision: accepted.revision, acknowledgedEvidence: {
        headerSha256: accepted.evidence.header.uncompressedSha256, records: accepted.evidence.records.length } });
    const delta = encoded.request.evidence;
    if (!("headerSha256" in delta)) throw new Error("Expected suffix");
    return { campaign: prepared.envelope.campaign, snapshot: encoded.snapshot, evidence: { ...delta, headerSha256: delta.headerSha256! }, usageQuestions };
  }
  const command = (checkpoint: GameEvidenceCheckpoint, input: GameCommand) => applyGameEvidenceCommand(checkpoint, input).checkpoint;
  return { confirmed, prepared, candidate, command };
}
