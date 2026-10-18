import { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";

export type CloudCompression = "gzip" | "deflate";
export interface CloudCompressedText {
  readonly encoding: CloudCompression;
  readonly uncompressedSha256: string;
  readonly uncompressedBytes: number;
  readonly compressedBytes: number;
  readonly dataBase64: string;
}
export const CLOUD_COMPRESSION_LIMITS = Object.freeze({ compressedBytes: 6_000_000, decodedBytes: 6_000_000 });

function base64(bytes: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 16_384) binary += String.fromCharCode(...bytes.subarray(index, index + 16_384));
  return btoa(binary);
}
function fromBase64(text: string, ceiling: number): Uint8Array<ArrayBuffer> {
  if (typeof text !== "string" || text.length > Math.ceil(ceiling / 3) * 4 || text.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(text)) {
    throw new CloudCodecError("compressed_shape", "Invalid or oversized compressed base64 text.");
  }
  try { return Uint8Array.from(atob(text), character => character.charCodeAt(0)); }
  catch { throw new CloudCodecError("compressed_shape", "Invalid compressed base64 text."); }
}

/** Bound output while streaming, before concatenation; a false decoded-size header cannot bless a decompression bomb. */
async function boundedBytes(stream: ReadableStream<Uint8Array>, ceiling: number): Promise<Uint8Array<ArrayBuffer>> {
  const reader = stream.getReader(), parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > ceiling) {
        await reader.cancel();
        throw new CloudCodecError("decompression_size", "Decoded text exceeds the permitted byte limit.");
      }
      parts.push(part.value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.byteLength; }
  return result;
}

/** Hash UNCOMPRESSED canonical UTF-8. Compressed bytes are not a stable cross-browser identity. */
export async function compressCloudText(text: string, encoding: CloudCompression = "gzip"): Promise<CloudCompressedText> {
  if (typeof CompressionStream !== "function") throw new CloudCodecError("compression_unavailable", "Lossless compression is unavailable.");
  if (encoding !== "gzip" && encoding !== "deflate") throw new CloudCodecError("compressed_shape", "Unsupported lossless encoding.");
  const uncompressedBytes = utf8Bytes(text);
  if (uncompressedBytes > CLOUD_COMPRESSION_LIMITS.decodedBytes) throw new CloudCodecError("decompression_size", "Decoded text exceeds the permitted byte limit.");
  const uncompressedSha256 = await sha256Utf8(text);
  const input = new Uint8Array(new TextEncoder().encode(text));
  const output = await boundedBytes(new Blob([input]).stream().pipeThrough(new CompressionStream(encoding)), CLOUD_COMPRESSION_LIMITS.compressedBytes);
  const result = Object.freeze({ encoding, uncompressedSha256, uncompressedBytes, compressedBytes: output.byteLength, dataBase64: base64(output) });
  // Verify every emitted compressed object, rather than assuming a successful
  // compression operation establishes a durable/lossless write.
  await decompressCloudText(result);
  return result;
}

export async function decompressCloudText(value: CloudCompressedText, decodedCeiling: number = CLOUD_COMPRESSION_LIMITS.decodedBytes): Promise<string> {
  if (typeof DecompressionStream !== "function") throw new CloudCodecError("compression_unavailable", "Lossless decompression is unavailable.");
  if ((value.encoding !== "gzip" && value.encoding !== "deflate") || !/^[a-f0-9]{64}$/.test(value.uncompressedSha256) ||
    !Number.isSafeInteger(value.uncompressedBytes) || value.uncompressedBytes < 0 || value.uncompressedBytes > decodedCeiling ||
    !Number.isSafeInteger(value.compressedBytes) || value.compressedBytes < 0 || value.compressedBytes > CLOUD_COMPRESSION_LIMITS.compressedBytes ||
    !Number.isSafeInteger(decodedCeiling) || decodedCeiling < 0 || decodedCeiling > CLOUD_COMPRESSION_LIMITS.decodedBytes) {
    throw new CloudCodecError("compressed_shape", "Invalid compressed text metadata.");
  }
  const input = fromBase64(value.dataBase64, CLOUD_COMPRESSION_LIMITS.compressedBytes);
  if (input.byteLength !== value.compressedBytes) throw new CloudCodecError("compressed_size", "Compressed byte count does not match.");
  let decoded: Uint8Array<ArrayBuffer>;
  try {
    decoded = await boundedBytes(new Blob([input]).stream().pipeThrough(new DecompressionStream(value.encoding)), Math.min(decodedCeiling, value.uncompressedBytes));
  } catch (error) {
    if (error instanceof CloudCodecError) throw error;
    throw new CloudCodecError("decompression", "Compressed text could not be decoded losslessly.");
  }
  if (decoded.byteLength !== value.uncompressedBytes) throw new CloudCodecError("decompressed_size", "Decoded byte count does not match.");
  if (!globalThis.crypto?.subtle) throw new CloudCodecError("crypto_unavailable", "SHA-256 is unavailable; the save was not verified.");
  const hash = await globalThis.crypto.subtle.digest("SHA-256", decoded);
  const digest = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== value.uncompressedSha256) throw new CloudCodecError("checksum", "Uncompressed canonical bytes failed SHA-256 verification.");
  try { return new TextDecoder("utf-8", { fatal: true }).decode(decoded); }
  catch { throw new CloudCodecError("invalid_unicode", "Decoded bytes are not valid UTF-8."); }
}
