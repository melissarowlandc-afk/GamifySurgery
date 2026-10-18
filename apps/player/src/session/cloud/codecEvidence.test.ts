import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { applyGameEvidenceCommand, createInitialGameState, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { codecTestCampaign } from "./codecTestSupport";
import { logicalJsonText } from "./codecJson";
import { compressCloudEvidencePages, decompressCloudEvidencePages } from "./codecEvidencePages";

const root = new URL("../../../../../tests/fixtures/", import.meta.url);
const measured: Array<{ name: string; source: string; file: string; fileSha256: string }> = [];
for (const file of ["level-four-legacy-pre-m3.json", "level-five-economy-checkpoint-20261012.json", "level-five-integration-checkpoints-20261012.json"]) {
  const bytes = readFileSync(new URL(file, root)), parsed = JSON.parse(bytes.toString("utf8"));
  const states = parsed.schemaVersion ? [[file, parsed]] : Object.entries(parsed);
  for (const [name, state] of states) measured.push({ name, source: JSON.stringify(state), file, fileSha256: createHash("sha256").update(bytes).digest("hex") });
}
function fresh() {
  return serializeGameState(createInitialGameState(undefined, { campaignId: "campaign.cloud.normalized", campaignSeed: "cloud.normalized", createdAtRealMs: 0 }));
}
async function prepare(source = fresh(), operationId = "import.cloud.normalized") {
  return prepareCloudEvidenceImport({ serializedState: source, campaign: codecTestCampaign(source), operationId });
}
async function hydrate(prepared: Awaited<ReturnType<typeof prepare>>) {
  return loadCloudEvidenceCheckpoint({ snapshot: prepared.snapshot, evidence: prepared.packedEvidence, revision: "9007199254740993",
    expectedRevision: "9007199254740993", expectedCampaignId: prepared.envelope.campaign.campaignId, expectedBaselineId: prepared.envelope.baselineId });
}

describe("cloud format 2 normalized evidence and compressed storage", () => {
  it.each(measured)("measures gzip/deflate and round-trips all logical fields in $name", async fixture => {
    const prepared = await prepare(fixture.source, `import.normalized.${fixture.name}`), loaded = await hydrate(prepared);
    expect(JSON.parse(serializeGameState(loaded.state))).toEqual(JSON.parse(serializeGameState(deserializeGameState(fixture.source))));
    expect(loaded.originalSource).toEqual(JSON.parse(fixture.source));
    expect(loaded.campaign).toEqual(codecTestCampaign(fixture.source));
    expect(prepared.sourceRecovery.text).toBe(fixture.source);
    expect(prepared.sourceRecovery.sha256).toBe(createHash("sha256").update(fixture.source).digest("hex"));
    expect(prepared.snapshotText).not.toContain('"schedulerLog"');
    expect(prepared.snapshotText).not.toContain('"explanation"');
    expect(prepared.compressedCapacity.failures).toEqual([]);
    const deflate = await encodeCloudEvidenceCheckpoint({ checkpoint: prepared.checkpoint, campaign: prepared.envelope.campaign,
      operationId: `import.deflate.${fixture.name}`, expectedRevision: "0", source: loaded.source, encoding: "deflate" });
    const deflatedLoad = await loadCloudEvidenceCheckpoint({ snapshot: deflate.snapshot, evidence: deflate.packedEvidence, revision: "1",
      expectedRevision: "1", expectedCampaignId: loaded.state.campaignId, expectedBaselineId: prepared.envelope.baselineId });
    expect(JSON.parse(serializeGameState(deflatedLoad.state))).toEqual(JSON.parse(serializeGameState(loaded.state)));
    const aggregateGzip = await compressCloudText(prepared.archiveText, "gzip"), aggregateDeflate = await compressCloudText(prepared.archiveText, "deflate");
    const recordTexts = prepared.checkpoint.evidence.records.map(record => logicalJsonText(JSON.parse(JSON.stringify(record))));
    const gzipPages = await compressCloudEvidencePages(recordTexts), deflatePages = await compressCloudEvidencePages(recordTexts, 0, "deflate");
    expect(await decompressCloudEvidencePages(gzipPages)).toEqual(prepared.checkpoint.evidence.records);
    expect(await decompressCloudEvidencePages(deflatePages)).toEqual(prepared.checkpoint.evidence.records);
    process.stdout.write(`B2.1b MEASURE ${JSON.stringify({ fixture: fixture.name, file: fixture.file, fileSha256: fixture.fileSha256,
      sourceBytes: Buffer.byteLength(fixture.source), ...prepared.sizes, deflateSnapshotBytes: deflate.sizes.snapshotStoredBytes,
      deflateEvidenceRowsBytes: deflate.sizes.evidenceStoredBytes, deflateTransportBodyBytes: deflate.sizes.transportBodyBytes,
      aggregateEvidenceGzipBytes: aggregateGzip.compressedBytes, aggregateEvidenceDeflateBytes: aggregateDeflate.compressedBytes,
      gzipPagesEvidenceBytes: prepared.packedEvidence.header.compressedBytes + gzipPages.reduce((sum, page) => sum + page.content.compressedBytes, 0),
      deflatePagesEvidenceBytes: deflate.packedEvidence.header.compressedBytes + deflatePages.reduce((sum, page) => sum + page.content.compressedBytes, 0),
      immutablePages: gzipPages.length,
      rawCapacityFailures: prepared.rawCapacity.failures, compressedCapacityFailures: prepared.compressedCapacity.failures })}\n`);
  }, 120_000);

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])("keeps source schema %i and its complete public migration with the new layout", async version => {
    const raw = JSON.parse(fresh()); raw.schemaVersion = version;
    if (version === 1) { delete raw.campaignId; delete raw.campaignSeed; delete raw.learningHistories; }
    if (version === 3) delete raw.founder;
    const source = JSON.stringify(raw), prepared = await prepare(source), loaded = await hydrate(prepared);
    expect(loaded.originalSource).toEqual(raw);
    expect(JSON.parse(serializeGameState(loaded.state))).toEqual(JSON.parse(serializeGameState(deserializeGameState(source))));
    expect(loaded.checkpoint.evidence.baseline.legacyReviewProjection).toBe(version === 1);
  }, 30_000);

  it("shares an immutable header/row prefix across later snapshots and restores a prior revision without a second evidence copy", async () => {
    const original = await prepare(), first = await hydrate(original);
    let next = applyGameEvidenceCommand(first.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "normalized.play" }).checkpoint;
    next = applyGameEvidenceCommand(next, { type: "ADVANCE_TICK", operationId: "normalized.tick", advancedAtRealMs: 60_000 }).checkpoint;
    const later = await encodeCloudEvidenceCheckpoint({ checkpoint: next, campaign: first.campaign, source: first.source,
      operationId: "save.normalized.1", expectedRevision: "9007199254740993",
      acknowledgedEvidence: { headerSha256: original.packedEvidence.header.uncompressedSha256, records: original.packedEvidence.records.length } });
    expect(later.packedEvidence.header.uncompressedSha256).toBe(original.packedEvidence.header.uncompressedSha256);
    expect(later.packedEvidence.records.slice(0, original.packedEvidence.records.length)).toEqual(original.packedEvidence.records);
    expect(later.request.evidence).not.toHaveProperty("header");
    expect(later.sizes.newEvidenceUploadRows).toBe(later.packedEvidence.records.length - original.packedEvidence.records.length);
    expect(later.request.evidence.records).toHaveLength(later.sizes.newEvidenceUploadRows);
    const prior = await loadCloudEvidenceCheckpoint({ snapshot: original.snapshot, evidence: later.packedEvidence, revision: "1",
      expectedRevision: "1", expectedCampaignId: first.state.campaignId, expectedBaselineId: original.envelope.baselineId });
    expect(prior.state.facilityTick).toBe(0);
    const current = await loadCloudEvidenceCheckpoint({ snapshot: later.snapshot, evidence: later.packedEvidence, revision: "2",
      expectedRevision: "2", expectedCampaignId: first.state.campaignId, expectedBaselineId: original.envelope.baselineId });
    expect(current.state.facilityTick).toBe(1);
    expect(current.originalSource).toEqual(JSON.parse(fresh()));
  });

  it("measures six further hours of real mature-facility commands without discarding immutable rows", async () => {
    const fixture = measured.find(value => value.name === "integration-lower-repeat")!;
    const initial = await prepare(fixture.source, "import.growth"), loaded = await hydrate(initial);
    let checkpoint = applyGameEvidenceCommand(loaded.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "growth.play" }).checkpoint;
    const initialPages = await compressCloudEvidencePages(initial.checkpoint.evidence.records.map(record => logicalJsonText(JSON.parse(JSON.stringify(record)))));
    const sealedPages = [...initialPages];
    let sealedRows = initial.checkpoint.evidence.records.length;
    for (let index = 0; index < 360; index += 1) {
      checkpoint = applyGameEvidenceCommand(checkpoint,
        { type: "ADVANCE_TICK", operationId: `growth.tick.${index}`, advancedAtRealMs: loaded.state.createdAtRealMs + (loaded.state.facilityTick + index + 1) * 60_000 }).checkpoint;
      if ((index + 1) % 60 === 0) {
        const added = checkpoint.evidence.records.slice(sealedRows).map(record => logicalJsonText(JSON.parse(JSON.stringify(record))));
        sealedPages.push(...await compressCloudEvidencePages(added, sealedRows));
        sealedRows = checkpoint.evidence.records.length;
      }
    }
    expect(checkpoint.evidence.records.slice(0, loaded.checkpoint.evidence.records.length)).toEqual(loaded.checkpoint.evidence.records);
    const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: loaded.campaign, source: loaded.source,
      operationId: "save.growth", expectedRevision: "1", acknowledgedEvidence: {
        headerSha256: initial.packedEvidence.header.uncompressedSha256, records: initial.packedEvidence.records.length } });
    const current = await loadCloudEvidenceCheckpoint({ snapshot: encoded.snapshot, evidence: encoded.packedEvidence, revision: "2",
      expectedRevision: "2", expectedCampaignId: loaded.state.campaignId, expectedBaselineId: initial.envelope.baselineId });
    expect(current.state.facilityTick).toBe(loaded.state.facilityTick + 360);
    expect(current.originalSource).toEqual(JSON.parse(fixture.source));
    expect(await decompressCloudEvidencePages(sealedPages)).toEqual(checkpoint.evidence.records);
    expect(sealedPages.slice(0, initialPages.length)).toEqual(initialPages);
    process.stdout.write(`B2.1b GROWTH ${JSON.stringify({ fixture: fixture.name, additionalFacilityMinutes: 360,
      initialEvidenceBytes: initial.sizes.evidenceStoredBytes, ...encoded.sizes,
      gzipPagesEvidenceBytes: initial.packedEvidence.header.compressedBytes + sealedPages.reduce((sum, page) => sum + page.content.compressedBytes, 0),
      immutablePages: sealedPages.length, sealedUploadBatches: 6,
      compressedCapacityFailures: encoded.compressedCapacity.failures, rawCapacityFailures: encoded.rawCapacity.failures })}\n`);
  }, 180_000);

  it("hashes the entire encoded request, rejects identity/row corruption, and verifies uncompressed canonical bytes", async () => {
    const prepared = await prepare(), input = { snapshot: prepared.snapshot, evidence: prepared.packedEvidence, revision: "1",
      expectedRevision: "1", expectedCampaignId: prepared.envelope.campaign.campaignId, expectedBaselineId: prepared.envelope.baselineId };
    expect(prepared.transport.sha256).toBe(createHash("sha256").update(prepared.transport.text).digest("hex"));
    expect(JSON.parse(prepared.transport.text)).toEqual(prepared.request);
    await expect(loadCloudEvidenceCheckpoint({ ...input, expectedCampaignId: "campaign.other" })).rejects.toMatchObject({ code: "campaign_identity" });
    await expect(loadCloudEvidenceCheckpoint({ ...input, revision: "2" })).rejects.toMatchObject({ code: "revision_mismatch" });
    await expect(loadCloudEvidenceCheckpoint({ ...input, evidence: { ...input.evidence, records: [] } })).rejects.toMatchObject({ code: "evidence_high_water" });
    await expect(loadCloudEvidenceCheckpoint({ ...input, snapshot: { ...input.snapshot, uncompressedSha256: "0".repeat(64) } })).rejects.toMatchObject({ code: "checksum" });
    const rows = [...input.evidence.records]; rows[0] = { ...rows[0]!, id: "not-the-hashed-id" };
    await expect(loadCloudEvidenceCheckpoint({ ...input, evidence: { ...input.evidence, records: rows } })).rejects.toMatchObject({ code: "evidence_identity" });
    const oversized = input.evidence.records.map(row => ({ ...row, content: { ...row.content, uncompressedBytes: 6_000_000 } }));
    await expect(loadCloudEvidenceCheckpoint({ ...input, evidence: { ...input.evidence, records: oversized } })).rejects.toMatchObject({ code: "evidence_size" });
    expect(await decompressCloudText(prepared.snapshot)).toBe(prepared.snapshotText);
  });
});
