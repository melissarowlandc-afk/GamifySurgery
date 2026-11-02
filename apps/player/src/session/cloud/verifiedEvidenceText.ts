import { decompressCloudText, type CloudCompressedText } from "./codecCompression";
import { utf8Bytes } from "./codecJson";

/** Worker-local immutable evidence only. A proof is keyed by ALL actual packed
 * bytes and metadata, never an untrusted claimed digest. Keep canonical text,
 * not mutable parsed objects or game projections. Every new byte still passes
 * bounded decompression, length and SHA checks. Lost worker = cold verification.
 * The byte budget includes keys, and bounds retained large baseline text too. */
export class VerifiedEvidenceTextCache {
  private readonly rows = new Map<string, { work: Promise<string>; bytes: number }>();
  private bytes = 0;
  constructor(private readonly decode = decompressCloudText, private readonly maxBytes = 12_000_000) {}
  async read(value: CloudCompressedText): Promise<string> {
    const key = JSON.stringify([value.encoding, value.uncompressedSha256, value.uncompressedBytes, value.compressedBytes, value.dataBase64]);
    let row = this.rows.get(key);
    if (!row) {
      row = { work: this.decode(value), bytes: 0 };
      this.rows.set(key, row);
      try {
        const text = await row.work;
        if (this.rows.get(key) === row) { row.bytes = utf8Bytes(key) + utf8Bytes(text); this.bytes += row.bytes; }
      } catch (error) { if (this.rows.get(key) === row) this.rows.delete(key); throw error; }
    }
    if (this.rows.get(key) === row) { this.rows.delete(key); this.rows.set(key, row); }
    while (this.bytes > this.maxBytes || this.rows.size > 12_000) {
      const oldest = this.rows.keys().next().value!;
      this.bytes -= this.rows.get(oldest)!.bytes; this.rows.delete(oldest);
    }
    return row.work;
  }
}

// Hydration also imports this module on the UI thread. Do not retain a second
// decoded prefix there; the long-lived proof belongs to the save worker only.
export const verifiedEvidenceText = new VerifiedEvidenceTextCache(decompressCloudText, typeof document === "undefined" ? 12_000_000 : 0);
