import { compressCloudText, decompressCloudText, type CloudCompressedText } from "./cloud/codecCompression";
import { CloudCacheError } from "./cloud/codecCache";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "./localStorageBuildPolicy";

/** Local storage dialect only. The digest inside payload authenticates the
 * original JSON, including its key order; cloud/checkpoint formats are unchanged.
 * Old plain records remain readable. Small/unsupported records stay plain. */
export interface EncodedJournalValue { journalEncoding: "gzip-json-v1"; payload: CloudCompressedText }
export function isEncodedJournalValue(value: unknown): value is EncodedJournalValue {
  return !!value && typeof value === "object" && "journalEncoding" in value;
}
export async function encodeJournalValue<T>(value: T): Promise<T | EncodedJournalValue> {
  if (!LOCAL_STORAGE_COMPRESSION_WRITES) return value;
  if (typeof CompressionStream !== "function" || typeof DecompressionStream !== "function") return value;
  const text = JSON.stringify(value);
  if (text.length < 512) return value;
  try {
    const payload = await compressCloudText(text);
    // Include base64/envelope overhead. Never inflate small/incompressible rows.
    return JSON.stringify(payload).length + 64 < text.length ? { journalEncoding: "gzip-json-v1", payload } : value;
  } catch {
    // Compression is optional, not a durability prerequisite. The unchanged
    // original still takes the same strict transaction and checksum path.
    return value;
  }
}
export async function decodeJournalValue<T>(value: T | EncodedJournalValue): Promise<T> {
  if (!isEncodedJournalValue(value)) return value;
  try {
    if (value.journalEncoding !== "gzip-json-v1") throw Error("encoding");
    return JSON.parse(await decompressCloudText(value.payload)) as T;
  } catch { throw new CloudCacheError("checksum"); }
}

// Worker replies are tied to the immutable admitted row identity. Weak keys
// release compressed buffers with the queue; no session-long memo table grows.
const prepared = new WeakMap<object, unknown>();
export function rememberEncodedJournalValues(rows: readonly object[], values: readonly unknown[]): void {
  if (rows.length === values.length) rows.forEach((row, i) => prepared.set(row, values[i]));
}
export function preparedJournalValue<T>(row: object): T | undefined { return prepared.get(row) as T | undefined; }
