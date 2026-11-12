import { describe, expect, it, vi } from "vitest";
import { VerifiedCopyCache } from "./verifiedCopyCache";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { syncFixture } from "./syncFixtureSupport";
import { createInitialGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { codecTestCampaign } from "./codecTestSupport";
import { snapshotCopy } from "./snapshotCodec";

async function nativeInput() {
  const state = createInitialGameState(undefined, { campaignId: "proof.native", campaignSeed: "proof.native", createdAtRealMs: 0 });
  const copy = await snapshotCopy(state, codecTestCampaign(serializeGameState(state)), "1", 0,
    { parents: ["a".repeat(64)], branchId: "proof.branch", sequence: 3 });
  return { state, input: { ...copy, expectedRevision: "1", expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId } };
}

describe("session-local byte-keyed copy verification", () => {
  it("reuses a native proof after IDB/JSONB reorders complete lineage keys", async () => {
    const { input } = await nativeInput(), load = vi.fn(loadCloudEvidenceCheckpoint), cache = new VerifiedCopyCache(load);
    const first = await cache.read(input);
    const reordered = structuredClone(input);
    reordered.lineage = { sequence: input.lineage!.sequence, branchId: input.lineage!.branchId, parents: input.lineage!.parents };
    expect(await cache.read(reordered)).toEqual(first);
    expect(load).toHaveBeenCalledTimes(1);
  });
  it("rejects every changed/unknown lineage field before reusing a native proof", async () => {
    const { input } = await nativeInput(), load = vi.fn(loadCloudEvidenceCheckpoint), cache = new VerifiedCopyCache(load);
    await cache.read(input);
    for (const lineage of [
      { ...input.lineage!, branchId: "another.branch" }, { ...input.lineage!, sequence: 4 },
      { ...input.lineage!, parents: ["b".repeat(64)] }, { ...input.lineage!, unexpected: true },
      { ...input.lineage!, unexpected: undefined }, { ...input.lineage!, sequence: "3" },
      { ...input.lineage!, parents: ["not-a-hash"] }, null,
    ]) await expect(cache.read({ ...input, lineage: lineage as typeof input.lineage })).rejects.toMatchObject({ code: "snapshot_lineage" });
    expect((await cache.read(input)).inspection.lineage).toEqual(input.lineage);
    await expect(cache.hydrate({ ...input, expectedCampaignId: "wrong.campaign" })).rejects.toMatchObject({ code: "campaign_identity" });
    await expect(cache.hydrate({ ...input, expectedBaselineId: "wrong.baseline" })).rejects.toBeInstanceOf(Error);
    await expect(cache.hydrate({ ...input, expectedRevision: "2" })).rejects.toMatchObject({ code: "revision_mismatch" });
    await expect(cache.hydrate({ ...input, revision: "invalid", expectedRevision: "invalid" })).rejects.toBeInstanceOf(Error);
  });
  it("hydrates independent playable snapshots without revalidating identical bytes", async () => {
    const { input, state } = await nativeInput(), load = vi.fn(loadCloudEvidenceCheckpoint), cache = new VerifiedCopyCache(load);
    await cache.read(input);
    const first = await cache.hydrate(input), second = await cache.hydrate({ ...input, revision: "2", expectedRevision: "2" });
    expect(first.state).toEqual(state); expect(second).toEqual(first); expect(load).toHaveBeenCalledTimes(1);
    first.state.cashCents = 1;
    first.campaign.name = "mutated";
    first.checkpoint.evidence.baseline.source.cashCents = 2;
    Object.assign(first.source, { sha256: "0".repeat(64) });
    (first.snapshotLineage!.parents as string[]).push("b".repeat(64));
    const projected = await cache.projection(input); projected.state.cashCents = 3;
    expect(await cache.hydrate(input)).toEqual(second);
    expect(load).toHaveBeenCalledTimes(1);
  });
  it("rechecks actual packed bytes and metadata before returning a playable snapshot", async () => {
    const { input } = await nativeInput(), cache = new VerifiedCopyCache();
    await cache.read(input);
    for (const snapshot of [
      { ...input.snapshot, dataBase64: "bad!" }, { ...input.snapshot, uncompressedSha256: "0".repeat(64) },
      { ...input.snapshot, compressedBytes: input.snapshot.compressedBytes + 1 },
      { ...input.snapshot, uncompressedBytes: input.snapshot.uncompressedBytes + 1 },
      { ...input.snapshot, encoding: "deflate" as const },
    ]) await expect(cache.hydrate({ ...input, snapshot })).rejects.toBeInstanceOf(Error);
    expect((await cache.hydrate(input)).state.campaignId).toBe(input.expectedCampaignId);
  });
  it("retains at most two hydrated snapshots and revalidates an evicted one", async () => {
    const { input } = await nativeInput(), load = vi.fn(loadCloudEvidenceCheckpoint), cache = new VerifiedCopyCache(load);
    const first = await cache.hydrate(input);
    for (const sequence of [4, 5]) {
      const copy = await snapshotCopy(first.state, first.campaign, "1", 0, { ...input.lineage!, sequence });
      await cache.read({ ...input, ...copy });
    }
    expect(load).toHaveBeenCalledTimes(3);
    expect(await cache.hydrate(input)).toEqual(first);
    expect(load).toHaveBeenCalledTimes(4);
    expect(await cache.hydrate(input)).toEqual(first); expect(load).toHaveBeenCalledTimes(4);
  });
  it("shares pending and completed verification across clone boundaries and keeps results private", async () => {
    const f = await syncFixture(), load = vi.fn(loadCloudEvidenceCheckpoint), cache = new VerifiedCopyCache(load);
    const input = { ...f.confirmed, expectedRevision: "1", expectedCampaignId: f.confirmed.campaignId, expectedBaselineId: f.confirmed.baselineId };
    const [one, two] = await Promise.all([cache.read(input), cache.read(structuredClone(input))]);
    expect(one).toEqual(two); expect(load).toHaveBeenCalledTimes(1);
    const reordered = structuredClone(input);
    reordered.snapshot = Object.fromEntries(Object.entries(reordered.snapshot).reverse()) as unknown as typeof input.snapshot;
    reordered.evidence = { records: reordered.evidence.records.map(row => ({ content: Object.fromEntries(Object.entries(row.content).reverse()) as unknown as typeof row.content, id: row.id })),
      header: Object.fromEntries(Object.entries(reordered.evidence.header).reverse()) as unknown as typeof input.evidence.header };
    expect(await cache.read(reordered)).toEqual(two); expect(load).toHaveBeenCalledTimes(1);
    // An unchanged accepted payload can have a new CAS revision. Validate that
    // small external fence independently; don't decode the identical bytes.
    expect(await cache.read({ ...input, revision: "2", expectedRevision: "2" })).toEqual(two);
    expect(load).toHaveBeenCalledTimes(1);
    one.inspection.progress.level = 999;
    expect((await cache.read(structuredClone(input))).inspection.progress.level).toBe(0);
    expect(load).toHaveBeenCalledTimes(1);
  });
  it("does not trust claimed hashes, altered bytes, another identity or a revision mismatch", async () => {
    const f = await syncFixture(), cache = new VerifiedCopyCache();
    const input = { ...f.confirmed, expectedRevision: "1", expectedCampaignId: f.confirmed.campaignId, expectedBaselineId: f.confirmed.baselineId };
    await cache.read(input);
    const damaged = structuredClone(input); damaged.snapshot = { ...damaged.snapshot, dataBase64: "bad!" };
    await expect(cache.read(damaged)).rejects.toBeInstanceOf(Error);
    await expect(cache.read({ ...input, expectedCampaignId: "another" })).rejects.toMatchObject({ code: "campaign_identity" });
    await expect(cache.read({ ...input, expectedRevision: "2" })).rejects.toMatchObject({ code: "revision_mismatch" });
    expect((await cache.read(input)).inspection.progress.level).toBe(0);
  });
  it("evicts a failed attempt so a transient processor failure remains retryable", async () => {
    const f = await syncFixture(), load = vi.fn(loadCloudEvidenceCheckpoint).mockRejectedValueOnce(new Error("temporary")), cache = new VerifiedCopyCache(load);
    const input = { ...f.confirmed, expectedRevision: "1", expectedCampaignId: f.confirmed.campaignId, expectedBaselineId: f.confirmed.baselineId };
    await expect(cache.read(input)).rejects.toThrow("temporary");
    expect((await cache.read(input)).inspection.progress.level).toBe(0); expect(load).toHaveBeenCalledTimes(2);
  });
});
