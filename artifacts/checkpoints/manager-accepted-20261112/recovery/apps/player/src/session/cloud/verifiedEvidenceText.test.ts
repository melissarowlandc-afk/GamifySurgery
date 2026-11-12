import { describe, expect, it, vi } from "vitest";
import { VerifiedEvidenceTextCache } from "./verifiedEvidenceText";
import { compressCloudText, decompressCloudText } from "./codecCompression";

describe("verified immutable evidence text reuse", () => {
  it("shares a single proof across cloned identical bytes and concurrent reads", async () => {
    const packed = await compressCloudText('{"id":"e1"}'), decode = vi.fn(decompressCloudText), cache = new VerifiedEvidenceTextCache(decode);
    expect(await Promise.all([cache.read(packed), cache.read(structuredClone(packed))])).toEqual(['{"id":"e1"}', '{"id":"e1"}']);
    expect(await cache.read(packed)).toBe('{"id":"e1"}'); expect(decode).toHaveBeenCalledTimes(1);
  });
  it.each(["dataBase64", "uncompressedSha256", "compressedBytes", "uncompressedBytes", "encoding"] as const)("never trusts the cached digest after %s changes", async field => {
    const packed = await compressCloudText('{"id":"e1"}'), cache = new VerifiedEvidenceTextCache();
    await cache.read(packed);
    const bad = { ...packed, [field]: field === "dataBase64" ? "AAAA" : field === "encoding" ? "deflate" : field === "uncompressedSha256" ? "0".repeat(64) : packed[field] + 1 };
    await expect(cache.read(bad)).rejects.toBeInstanceOf(Error);
    expect(await cache.read(packed)).toBe('{"id":"e1"}');
  });
  it("bounds retained bytes including keys and re-verifies after eviction or worker restart", async () => {
    const packed = await compressCloudText('{"id":"e1"}'), decode = vi.fn(decompressCloudText);
    const evicted = new VerifiedEvidenceTextCache(decode, 1);
    await evicted.read(packed); await evicted.read(packed); expect(decode).toHaveBeenCalledTimes(2);
    await new VerifiedEvidenceTextCache(decode).read(packed); expect(decode).toHaveBeenCalledTimes(3);
  });
  it("never remembers a failed decompression", async () => {
    const packed = await compressCloudText('{"id":"e1"}'), decode = vi.fn(decompressCloudText).mockRejectedValueOnce(new Error("worker interrupted"));
    const cache = new VerifiedEvidenceTextCache(decode);
    await expect(cache.read(packed)).rejects.toThrow("worker interrupted");
    expect(await cache.read(packed)).toBe('{"id":"e1"}'); expect(decode).toHaveBeenCalledTimes(2);
  });
});
