import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { codecTestCampaign } from "./codecTestSupport";
import * as snapshots from "./snapshotCodec";
import { CloudCodecWorker } from "./codecWorker";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudGameSession } from "./gameSession";
import type { CloudCandidate } from "./transport";
import { MessageChannelCloudCodecWorker } from "./codecWorkerMessageTestSupport";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { writeFileSync } from "node:fs";

afterEach(() => vi.restoreAllMocks());
let sequence = 0;
async function fixture() {
  const state = createInitialGameState(undefined, { campaignId: `opening.proof.${++sequence}`, campaignSeed: "native.proof", createdAtRealMs: 0 });
  const confirmed = await snapshots.snapshotCopy(state, codecTestCampaign(serializeGameState(state)), "1", 0,
    { parents: ["a".repeat(64)], branchId: "native.opening", sequence: 4 });
  const input = { ...confirmed, expectedRevision: "1", expectedCampaignId: state.campaignId, expectedBaselineId: confirmed.baselineId };
  const candidate: CloudCandidate = { saveFormat: 3, campaign: codecTestCampaign(serializeGameState(state)), snapshot: confirmed.snapshot,
    lineage: { sequence: 4, branchId: "native.opening", parents: ["a".repeat(64)] },
    evidence: { headerSha256: confirmed.evidence.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] }, usageQuestions: [] };
  return { state, confirmed, input, candidate, scope: { backendId: "native.proof", accountId: "synthetic", campaignId: state.campaignId } };
}

it("opens a native campaign through clone boundaries with exactly one full hydration, preserving all state", async () => {
  const f = await fixture(), clock = new TestCloudClock(), codec = new CloudCodecWorker(null), server = new FakeCloudServer(clock.wallNow);
  server.setAccess(f.scope.accountId, { snapshotSaves: true }); server.seed(f.scope.accountId, f.confirmed);
  const load = vi.spyOn(snapshots, "loadCloudSnapshot"), entryStore = new MemoryCloudEntryStore();
  const runtime = { ...f.scope, region: "test", transport: server.transport(f.scope.accountId), cache: new MemoryCloudCache(), entryStore };
  let session: CloudGameSession | null = null;
  const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, codec, clock });
  try {
    session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(f.state);
    expect(session.state.learningHistories).toEqual(f.state.learningHistories);
    expect(session.state.encounters).toEqual(f.state.encounters);
    expect(load).toHaveBeenCalledTimes(1);
    expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "proof.independent" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect((await codec.run({ kind: "hydrate", input: f.input })).state).toEqual(f.state);
    expect(load).toHaveBeenCalledTimes(1);
    expect(server.operationCount(f.scope.accountId)).toBe(0);
  } finally { session?.dispose(); coordinator.dispose(); codec.dispose(); }
});

it("native candidates reuse a proof but still check metadata, lineage, scope, evidence and usage on every request", async () => {
  const f = await fixture(), codec = new CloudCodecWorker(null), load = vi.spyOn(snapshots, "loadCloudSnapshot");
  try {
    await codec.run({ kind: "inspectCopy", input: f.confirmed });
    const check = (candidate = f.candidate, scope = f.scope) => codec.run({ kind: "candidate", input: { candidate, confirmed: f.confirmed, scope } });
    await check(); await check();
    expect(load).toHaveBeenCalledTimes(1);
    await expect(check({ ...f.candidate, campaign: { ...f.candidate.campaign, name: "wrong metadata" } })).rejects.toMatchObject({ code: "corrupt" });
    await expect(check({ ...f.candidate, lineage: { ...f.candidate.lineage!, sequence: 5 } })).rejects.toMatchObject({ code: "snapshot_lineage" });
    await expect(check(f.candidate, { ...f.scope, campaignId: "wrong.campaign" })).rejects.toMatchObject({ code: "corrupt" });
    await expect(check({ ...f.candidate, evidence: { ...f.candidate.evidence, toRecord: 1 } })).rejects.toMatchObject({ code: "corrupt" });
    const receipt = { receipt_id: "duplicate" } as CloudCandidate["usageQuestions"][number];
    await expect(check({ ...f.candidate, usageQuestions: [receipt, receipt] })).rejects.toMatchObject({ code: "corrupt" });
    await expect(check({ ...f.candidate, usageQuestions: Array.from({ length: 101 }, (_, i) => ({ receipt_id: `receipt.${i}` }) as typeof receipt) })).rejects.toMatchObject({ code: "corrupt" });
    await check();
    const changed = structuredClone(f.state); changed.cashCents++;
    const validOther = await snapshots.snapshotCopy(changed, f.candidate.campaign, "1", 0, f.confirmed.lineage!);
    // Same claimed digest is not a proof of another set of bytes.
    await expect(check({ ...f.candidate, snapshot: { ...validOther.snapshot, uncompressedSha256: f.confirmed.snapshot.uncompressedSha256 } })).rejects.toBeInstanceOf(Error);
    // Valid new bytes must be fully checked, and their original state is retained.
    await check({ ...f.candidate, snapshot: validOther.snapshot });
    expect((await codec.run({ kind: "hydrate", input: { ...f.input, snapshot: validOther.snapshot } })).state).toEqual(changed);
    expect((await codec.run({ kind: "hydrate", input: f.input })).state).toEqual(f.state);
  } finally { codec.dispose(); }
});

it("recovers committed native journal commands without repeatedly hydrating the unchanged account head", async () => {
  const f = await fixture(), clock = new TestCloudClock(), codec = new CloudCodecWorker(null), server = new FakeCloudServer(clock.wallNow);
  server.setAccess(f.scope.accountId, { snapshotSaves: true }); server.seed(f.scope.accountId, f.confirmed);
  const runtime = { ...f.scope, region: "test", transport: server.transport(f.scope.accountId), cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() };
  const open = () => openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, codec, clock });
  let session: CloudGameSession | null = await CloudGameSession.create(await open());
  try {
    for (const speed of [2, 4] as const) expect(session.execute({ type: "SET_SIMULATION_SPEED", speed, operationId: `tail.${speed}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(true);
    const expected = structuredClone(session.state); session.dispose(); session = null;
    const load = vi.spyOn(snapshots, "loadCloudSnapshot");
    session = await CloudGameSession.create(await open());
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(expected);
    // The already checked account head is reused by journal comparison, copy
    // ranking, candidate validation and session hydration. Only NEW bytes load.
    const hashes = load.mock.calls.map(([input]) => input.snapshot.uncompressedSha256);
    expect(hashes).not.toContain(f.confirmed.snapshot.uncompressedSha256);
    expect(new Set(hashes).size).toBe(hashes.length);
    expect(server.operationCount(f.scope.accountId)).toBe(0);
  } finally { session?.dispose(); codec.dispose(); }
});

it("opens the converted ~5 MB Level 5 fixture with one hydration across a queued MessageChannel", async () => {
  const started = performance.now(), large = await largeEntryFixture();
  const sourceBytes = Buffer.byteLength(JSON.stringify(large.copy)); expect(sourceBytes).toBeGreaterThan(5_000_000);
  const loaded = await loadCloudEvidenceCheckpoint({ ...large.copy, expectedRevision: "1", expectedCampaignId: large.copy.campaignId, expectedBaselineId: large.copy.baselineId });
  const confirmed = await snapshots.snapshotCopy(loaded.state, loaded.campaign, "1", 0, { branchId: "opening.level5", sequence: 1_200, parents: [] });
  const codec = new CloudCodecWorker(() => new MessageChannelCloudCodecWorker()), clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow);
  const scope = { backendId: "opening.level5", accountId: "synthetic", campaignId: confirmed.campaignId };
  server.setAccess(scope.accountId, { snapshotSaves: true }); server.seed(scope.accountId, confirmed);
  const runtime = { ...scope, region: "test", transport: server.transport(scope.accountId), cache: new MemoryCloudCache(), entryStore: new MemoryCloudEntryStore() };
  const load = vi.spyOn(snapshots, "loadCloudSnapshot"), opening = performance.now();
  const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, codec, clock });
  let session: CloudGameSession | null = null;
  try {
    session = await CloudGameSession.create(coordinator);
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(loaded.state);
    expect(load).toHaveBeenCalledTimes(1); expect(server.operationCount(scope.accountId)).toBe(0);
    expect(codec.health).toMatchObject({ restarts: 0, lastError: null, inFlight: [] });
    if (process.env.GAMIFY_NATIVE_OPEN_MEASURE === "1") writeFileSync(new URL("../../../../../.local-dev/native-open-proof-reuse-20261104/level5.json", import.meta.url),
      JSON.stringify({ sourceBytes, snapshotBytes: confirmed.snapshot.uncompressedBytes, snapshotStoredBytes: confirmed.snapshot.compressedBytes,
        openMs: performance.now() - opening, fixtureAndTestMs: performance.now() - started, fullHydrations: load.mock.calls.length, canExecute: session.canExecute }) + "\n");
  } finally { session?.dispose(); coordinator.dispose(); codec.dispose(); }
}, 120_000);
