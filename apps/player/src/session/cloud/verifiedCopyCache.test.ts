import { describe, expect, it, vi } from "vitest";
import { VerifiedCopyCache } from "./verifiedCopyCache";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { syncFixture } from "./syncFixtureSupport";

describe("session-local byte-keyed copy verification", () => {
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
