import { applyGameEvidenceCommand, createInitialGameState, serializeGameState, type GameCommand, type GameEvidenceCheckpoint } from "@gamify-surgery/game-domain";
import { prepareCloudEvidenceImport, encodeCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { CloudSyncCoordinator, type CloudClock } from "./coordinator";
import { MemoryCloudCache, type CloudCache } from "./cache";
import { FakeCloudServer } from "./fakeTransport";
import type { CloudCandidate, CloudConfirmed, CloudScope } from "./transport";

export class TestCloudClock implements CloudClock {
  wall = 1_800_000_000_000;
  mono = 0;
  wallNow = (): number => this.wall;
  monotonicNow = (): number => this.mono;
  advance(ms: number): void { this.wall += ms; this.mono += ms; }
}
export function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}
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
let harnessSequence = 0;
export async function syncHarness(options: { cache?: CloudCache; server?: FakeCloudServer; clock?: TestCloudClock;
  accountId?: string; backendId?: string; enabled?: boolean; campaignId?: string } = {}) {
  const fixture = await syncFixture(options.campaignId), clock = options.clock ?? new TestCloudClock();
  const server = options.server ?? new FakeCloudServer(() => clock.wall);
  const scope: CloudScope = { backendId: options.backendId ?? "backend-a", accountId: options.accountId ?? "account-a", campaignId: fixture.confirmed.campaignId };
  server.seed(scope.accountId, fixture.confirmed);
  const cache = options.cache ?? new MemoryCloudCache();
  let sequence = 0; const instance = ++harnessSequence;
  const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), enabled: options.enabled ?? true,
    clock, newOperationId: () => `sync.${instance}.${scope.accountId}.${++sequence}` });
  return { ...fixture, scope, clock, server, cache, coordinator };
}
