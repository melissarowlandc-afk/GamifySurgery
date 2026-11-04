import { expect, it } from "vitest";
import legacy from "../../../../../tests/fixtures/level-four-legacy-pre-m3.json";
import { createInitialGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { prepareSnapshotImport, loadCloudSnapshot, encodeCloudSnapshot } from "./snapshotCodec";
import { prepareCloudEvidenceImport, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { compressCloudText, decompressCloudText } from "./codecCompression";

it.each([8, 9] as const)("opens an exact older snapshot when the current question registry changes (schema %s)", async schemaVersion => {
  const state = createInitialGameState(), ids = Object.keys(state.learningHistories), absent = ids.at(-1)!;
  state.schemaVersion = schemaVersion;
  expect(ids.length).toBeGreaterThan(0);
  const retired = "concept.retired.synthetic.snapshot";
  state.learningHistories[retired] = { ...structuredClone(state.learningHistories[absent]!), conceptId: retired };
  delete state.learningHistories[absent]; // This concept did not exist when the older client saved.
  const campaign = codecTestCampaign(serializeGameState(state));
  const encoded = await encodeCloudSnapshot({ state, campaign, lineage: { branchId: "older.registry", sequence: 1, parents: [] } });
  const loaded = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
  expect(loaded.state).toEqual(state); expect(loaded.state.learningHistories[retired]).toEqual(state.learningHistories[retired]);
  expect(loaded.state.learningHistories).not.toHaveProperty(absent);
  const local = await prepareSnapshotImport({ serializedState: serializeGameState(state), campaign, branchId: "older.local.registry" });
  expect((await loadCloudSnapshot({ snapshot: local.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId })).state).toEqual(state);
});

it("keeps every field of a current-schema archived local profile without re-running release migrations", async () => {
  const serializedState = JSON.stringify(legacy), campaign = codecTestCampaign(serializedState);
  const converted = await prepareSnapshotImport({ serializedState, campaign, branchId: "archived.local.converted" });
  const actual = await loadCloudSnapshot({ snapshot: converted.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
  expect(actual.state).toEqual(legacy); expect(actual.state.learningHistories).toEqual(legacy.learningHistories);
  expect(actual.state.encounters).toEqual(legacy.encounters); expect(converted.packedEvidence.records).toEqual([]);
});

it.each([1, 2, 3, 4, 5, 6, 7])("migrates an older local schema %s with the existing adapter and keeps its exact hydrated FSRS and frozen work", async schemaVersion => {
  const source = JSON.parse(serializeGameState(createInitialGameState())); source.schemaVersion = schemaVersion;
  if (schemaVersion === 1) { delete source.campaignId; delete source.campaignSeed; delete source.learningHistories; }
  if (schemaVersion === 3) delete source.founder;
  const serializedState = JSON.stringify(source), campaign = codecTestCampaign(serializedState);
  const old = await prepareCloudEvidenceImport({ serializedState, campaign, operationId: "legacy.profile" });
  const expected = await loadCloudEvidenceCheckpoint({ snapshot: old.snapshot, evidence: old.packedEvidence, revision: "1", expectedRevision: "1",
    expectedCampaignId: campaign.campaignId, expectedBaselineId: old.envelope.baselineId });
  const converted = await prepareSnapshotImport({ serializedState, campaign, branchId: "legacy.converted" });
  const actual = await loadCloudSnapshot({ snapshot: converted.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
  expect(actual.state).toEqual(expected.state); expect(actual.state.learningHistories).toEqual(expected.state.learningHistories);
  expect(actual.state.encounters).toEqual(expected.state.encounters); expect(converted.packedEvidence.records).toEqual([]);
});

it("checks scope, revision, canonical bytes, checksum and hash-bound lineage without a move archive", async () => {
  const text = serializeGameState(createInitialGameState()), campaign = codecTestCampaign(text);
  const encoded = await prepareSnapshotImport({ serializedState: text, campaign, branchId: "snapshot.integrity" });
  const input = { snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId };
  await expect(loadCloudSnapshot({ ...input, expectedRevision: "2" })).rejects.toMatchObject({ code: "revision_mismatch" });
  await expect(loadCloudSnapshot({ ...input, expectedCampaignId: "some.other.campaign" })).rejects.toMatchObject({ code: "campaign_identity" });
  await expect(loadCloudSnapshot({ ...input, lineage: { ...encoded.lineage, parents: ["0".repeat(64)] } })).rejects.toMatchObject({ code: "snapshot_lineage" });
  await expect(loadCloudSnapshot({ ...input, snapshot: { ...input.snapshot, uncompressedSha256: "0".repeat(64) } })).rejects.toBeInstanceOf(Error);
  const body = JSON.parse(await decompressCloudText(encoded.snapshot)); body.unexpected = true;
  await expect(loadCloudSnapshot({ ...input, snapshot: await compressCloudText(JSON.stringify(body), "gzip") })).rejects.toMatchObject({ code: "unsupported_cloud_format" });
  const invalid = createInitialGameState(); invalid.cashCents = 1.5;
  const malformed = await encodeCloudSnapshot({ state: invalid, campaign: codecTestCampaign(serializeGameState(invalid)), lineage: encoded.lineage });
  await expect(loadCloudSnapshot({ ...input, expectedCampaignId: invalid.campaignId, snapshot: malformed.snapshot })).rejects.toMatchObject({ code: "domain_validation" });
});
