import { decompressCloudText } from "../../session/cloud/codecCompression";

/** Immutable build asset:64 ASCII SHA256 bytes, uint32 LE decoded byte count,
 * followed by gzip bytes. Only one small case (or bounded compatibility chunk)
 * enters JS memory; the complete bank stays in a native Blob in its owner. */
export async function readRuntimeCaseBankSlice(bank: Blob, offset: number, length: number): Promise<string> {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 68 || length > 6_000_068 || offset + length > bank.size)
    throw Error("Invalid runtime case bank slice");
  const buffer = await bank.slice(offset, offset + length).arrayBuffer(), bytes = new Uint8Array(buffer);
  const hash = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, 64));
  let binary = "";
  for (let i = 68; i < bytes.length; i += 16_384) binary += String.fromCharCode(...bytes.subarray(i, i + 16_384));
  return decompressCloudText({ encoding: "gzip", uncompressedSha256: hash, uncompressedBytes: new DataView(buffer).getUint32(64, true),
    compressedBytes: bytes.byteLength - 68, dataBase64: btoa(binary) });
}
