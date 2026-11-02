import { serializeGameState } from "@gamify-surgery/game-domain";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { inspectLoadedCopy } from "./copySelection";
import { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";
import type { CloudCompressedText } from "./codecCompression";
import { assertCloudRevision } from "./codec";

type Input = Parameters<typeof loadCloudEvidenceCheckpoint>[0];
const packed = (value: CloudCompressedText) => [value.encoding, value.uncompressedSha256, value.uncompressedBytes, value.compressedBytes, value.dataBase64];
/** Worker-local, small verified summaries only. Key the ACTUAL packed bytes,
 * never their untrusted claimed hashes. No decoded history is retained. */
export class VerifiedCopyCache {
  private readonly copies = new Map<string, Promise<{ inspection: Awaited<ReturnType<typeof inspectLoadedCopy>>; decodedGameBytes: number; evidenceRecords: number }>>();
  constructor(private readonly load = loadCloudEvidenceCheckpoint) {}
  async read(input: Input) {
    assertCloudRevision(input.revision); assertCloudRevision(input.expectedRevision);
    if (input.revision !== input.expectedRevision) throw new CloudCodecError("revision_mismatch", "The loaded revision differs from the requested revision.");
    // Explicit field order also shares a proof after JSONB/IDB reorder object
    // keys. Include compressed bytes and lengths, not only claimed digests.
    const key = await sha256Utf8(JSON.stringify([input.expectedCampaignId, input.expectedBaselineId,
      packed(input.snapshot), packed(input.evidence.header), input.evidence.records.map(row => [row.id, packed(row.content)])]));
    let request = this.copies.get(key);
    if (!request) {
      request = this.load(input).then(async loaded => ({ inspection: await inspectLoadedCopy(loaded),
        decodedGameBytes: utf8Bytes(serializeGameState(loaded.state)), evidenceRecords: loaded.checkpoint.evidence.records.length }));
      this.copies.set(key, request);
      void request.catch(() => { if (this.copies.get(key) === request) this.copies.delete(key); });
    }
    return structuredClone(await request); // Small result; callers cannot mutate the cached proof.
  }
}
