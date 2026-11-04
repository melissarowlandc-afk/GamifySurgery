import { expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, importGameEvidence } from "@gamify-surgery/game-domain";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { FakeCloudServer } from "./fakeTransport";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { decompressCloudText } from "./codecCompression";
import { prepareCloudWire } from "./codecWire";
import { runCloudCodecTask } from "./codecTasks";
import { sha256Utf8 } from "./codecJson";
import { snapshotEvidence } from "./snapshotCodec";
import { SupabaseCloudTransport, cloudWireBlob } from "./supabaseTransport";
import type { CloudCommitRequest, CloudConfirmed, CloudFrozenOperation } from "./transport";

const now = 1_800_000_000_000;
async function freeze(request: CloudCommitRequest, wire = false): Promise<CloudFrozenOperation> {
  const requestText = JSON.stringify(request);
  return { operationId: request.operationId, createdAtMs: now, requestText, requestSha256: await sha256Utf8(requestText),
    ...(wire ? { wireRequest: await prepareCloudWire(request, now) } : {}) };
}
const hydrate = (copy: CloudConfirmed) => loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
  expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });

it("round-trips a real legacy current/prior pair through native SQL RPC bytes and the production adapter/codec without losing FSRS or frozen work", async () => {
  const fixture = await largeEntryFixture(0, false), owner = "rpc.synthetic", id = fixture.copy.campaignId;
  const server = new FakeCloudServer(() => now), fake = server.transport(owner); server.seed(owner, fixture.copy);
  const lease = await fake.acquire({ campaignId: id, expectedRevision: "1", expectedWriterGeneration: "0", writerToken: "a".repeat(64), operationId: "rpc.lease", takeover: false });
  const checkpoint = applyGameEvidenceCommand(fixture.prepared.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "rpc.legacy.action" }).checkpoint;
  const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: fixture.prepared.envelope.campaign, source: fixture.provenance,
    operationId: "rpc.legacy.save", expectedRevision: "1", acknowledgedEvidence: {
      headerSha256: fixture.copy.evidence.header.uncompressedSha256, records: fixture.copy.evidence.records.length } });
  if (!("headerSha256" in encoded.request.evidence)) throw new Error("Expected legacy suffix");
  await fake.commit(await freeze({ protocolVersion: 2, campaignId: id, campaign: fixture.prepared.envelope.campaign, snapshot: encoded.snapshot,
    evidence: { ...encoded.request.evidence, headerSha256: encoded.request.evidence.headerSha256! }, usageQuestions: [], expectedRevision: "1", operationId: "rpc.legacy.save",
    writerGeneration: lease.writerGeneration, writerToken: lease.writerToken }));
  const legacyHead = await fake.load(id, "2"), legacyPrior = await fake.load(id, "1");
  const expectedPrior = await hydrate(legacyHead), oldPrior = await hydrate(legacyPrior);
  expect(oldPrior.state).not.toEqual(expectedPrior.state);
  expect(Object.values(expectedPrior.state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0)).toBeGreaterThan(500);
  expect(Object.keys(expectedPrior.state.encounters).length).toBeGreaterThan(0);

  const next = applyGameEvidenceCommand(checkpoint, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "rpc.native.action" }).checkpoint;
  const expectedCurrent = importGameEvidence(next.snapshot, next.evidence);
  const pending = await encodeCloudEvidenceCheckpoint({ checkpoint: next, campaign: expectedPrior.campaign, source: fixture.provenance,
    operationId: "rpc.pending", expectedRevision: "2", acknowledgedEvidence: {
      headerSha256: legacyHead.evidence.header.uncompressedSha256, records: legacyHead.evidence.records.length } });
  if (!("headerSha256" in pending.request.evidence)) throw new Error("Expected legacy suffix");
  const candidate = await runCloudCodecTask({ kind: "snapshotUpgrade", input: { confirmed: legacyHead, candidate: {
    campaign: expectedPrior.campaign, snapshot: pending.snapshot, evidence: { ...pending.request.evidence, headerSha256: pending.request.evidence.headerSha256! }, usageQuestions: [] } } });
  server.setAccess(owner, { snapshotSaves: true });
  const rpc = vi.fn(async (name: string, args: Record<string, unknown>) => {
    if (name === "beta2_cloud_access") return { data: { protocolVersion: 3, enabled: true, writesEnabled: true, snapshotSaves: true, noticeAccepted: true }, error: null };
    if (name === "beta2_snapshot_write") {
      const text = String(args.p_request_text), body = JSON.parse(text);
      expect(await sha256Utf8(text)).toBe(args.p_request_sha256);
      expect(body.protocolVersion).toBe(4); expect(body.cloudFormatVersion).toBe(3); expect(body).not.toHaveProperty("evidence");
      const current = JSON.parse(await decompressCloudText(body.snapshot)), prior = JSON.parse(await decompressCloudText(body.legacyBaseSnapshot));
      expect(body.legacyBaseLineage).toEqual(prior.lineage);
      // Consume the ACTUAL request blobs/lineage, not separately prepared test
      // values. This bridge emulates the opaque SQL contract, not SQL/RLS.
      const empty = await snapshotEvidence();
      const request: CloudCommitRequest = { protocolVersion: 2, saveFormat: 3, operationId: body.operationId, campaignId: body.campaignId,
        expectedRevision: body.expectedRevision, writerGeneration: body.writerGeneration, writerToken: body.writerToken,
        snapshot: body.snapshot, lineage: body.lineage, legacyBaseSnapshot: body.legacyBaseSnapshot, campaign: current.campaign,
        evidence: { headerSha256: empty.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] }, usageQuestions: body.usageReceipts };
      const receipt = await fake.commit(await freeze(request));
      return { data: { ...receipt, requestSha256: args.p_request_sha256, writerGeneration: body.writerGeneration,
        acceptedAt: new Date(receipt.acceptedAtMs).toISOString() }, error: null };
    }
    expect(name).toBe("beta2_snapshot_load");
    expect(args.p_protocol).toBe(3);
    const copy = await fake.load(String(args.p_campaign_id), args.p_revision == null ? undefined : String(args.p_revision));
    return { data: { cloudFormatVersion: 3, revision: copy.revision, lineage: copy.lineage,
      acceptedAt: new Date(copy.acceptedAtMs).toISOString(), snapshot: await cloudWireBlob(copy.snapshot) }, error: null };
  });
  const transport = new SupabaseCloudTransport({ rpc }, owner, async () => owner);
  expect((await transport.capabilities()).snapshotSaves).toBe(true);
  const operation = await freeze({ ...candidate, protocolVersion: 2, campaignId: id, operationId: "rpc.native.save", expectedRevision: "2",
    writerGeneration: lease.writerGeneration, writerToken: lease.writerToken }, true);
  const receipt = await transport.commit(operation); expect(receipt.revision).toBe("3");
  expect(await transport.commit(operation)).toEqual(receipt); // One immutable acceptance.
  const current = await hydrate(await transport.load(id, "3")), prior = await hydrate(await transport.load(id, "2"));
  expect(current.state).toEqual(expectedCurrent); expect(prior.state).toEqual(expectedPrior.state);
  expect(current.state.learningHistories).toEqual(expectedCurrent.learningHistories);
  expect(prior.state.learningHistories).toEqual(expectedPrior.state.learningHistories);
  expect(current.state.encounters).toEqual(expectedCurrent.encounters); expect(prior.state.encounters).toEqual(expectedPrior.state.encounters);
  expect(server.operationCount(owner)).toBe(2); expect(server.usageCount(owner)).toBe(0);
  expect((await fake.load(id)).evidence.records).toEqual([]); expect((await fake.load(id, "2")).evidence.records).toEqual([]);
}, 120_000);
