import { afterEach, describe, expect, it, vi } from "vitest";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { sha256Utf8 } from "./codecJson";
import golden from "./codecGoldenVectors.json";

afterEach(() => vi.unstubAllGlobals());
describe("verified browser-native lossless compression", () => {
  it.each(["gzip", "deflate"] as const)("round-trips every golden uncompressed byte through %s", async encoding => {
    for (const vector of golden.vectors) {
      const packed = await compressCloudText(vector.storedText, encoding);
      expect(packed.uncompressedSha256).toBe(vector.storedSha256);
      expect(packed.uncompressedBytes).toBe(vector.storedUtf8Bytes);
      expect(await decompressCloudText(packed)).toBe(vector.storedText);
    }
  });
  it("verifies the uncompressed canonical digest rather than assuming compressed bytes are a stable identity", async () => {
    const text = JSON.stringify({ text: "caf\u00e9 \ud83e\ude7a".repeat(1000) });
    const gzip = await compressCloudText(text, "gzip"), deflate = await compressCloudText(text, "deflate");
    expect(gzip.dataBase64).not.toBe(deflate.dataBase64);
    expect(gzip.uncompressedSha256).toBe(await sha256Utf8(text));
    expect(deflate.uncompressedSha256).toBe(gzip.uncompressedSha256);
    expect(gzip.compressedBytes).toBeLessThan(gzip.uncompressedBytes);
  });
  it("rejects corrupt bytes, sizes, digests, base64 and unsupported encodings", async () => {
    const packed = await compressCloudText("verified synthetic text".repeat(20));
    await expect(decompressCloudText({ ...packed, uncompressedSha256: "0".repeat(64) })).rejects.toMatchObject({ code: "checksum" });
    await expect(decompressCloudText({ ...packed, compressedBytes: packed.compressedBytes + 1 })).rejects.toMatchObject({ code: "compressed_size" });
    await expect(decompressCloudText({ ...packed, uncompressedBytes: packed.uncompressedBytes + 1 })).rejects.toMatchObject({ code: "decompressed_size" });
    await expect(decompressCloudText({ ...packed, dataBase64: "invalid%%%" })).rejects.toMatchObject({ code: "compressed_shape" });
    await expect(decompressCloudText({ ...packed, encoding: "brotli" as "gzip" })).rejects.toMatchObject({ code: "compressed_shape" });
    const altered = Uint8Array.from(atob(packed.dataBase64), character => character.charCodeAt(0));
    altered[0] = 0;
    await expect(decompressCloudText({ ...packed, dataBase64: btoa(String.fromCharCode(...altered)) })).rejects.toMatchObject({ code: "decompression" });
  });
  it("enforces actual streamed output bounds when a compressed payload lies about decoded size", async () => {
    const packed = await compressCloudText("x".repeat(1_000_000));
    await expect(decompressCloudText({ ...packed, uncompressedBytes: 100 })).rejects.toMatchObject({ code: "decompression_size" });
    await expect(decompressCloudText(packed, 999_999)).rejects.toMatchObject({ code: "compressed_shape" });
  });
  it("fails explicitly when compression APIs are unavailable", async () => {
    const packed = await compressCloudText("{}"), actualCompression = globalThis.CompressionStream;
    vi.stubGlobal("CompressionStream", undefined);
    await expect(compressCloudText("{}")).rejects.toMatchObject({ code: "compression_unavailable" });
    vi.stubGlobal("CompressionStream", actualCompression); vi.stubGlobal("DecompressionStream", undefined);
    await expect(decompressCloudText(packed)).rejects.toMatchObject({ code: "compression_unavailable" });
  });
});
