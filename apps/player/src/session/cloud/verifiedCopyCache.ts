import { serializeGameState } from "@gamify-surgery/game-domain";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { inspectLoadedCopy } from "./copySelection";
import { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";
import type { CloudCompressedText } from "./codecCompression";
import { assertCloudRevision } from "./codec";

type Input = Parameters<typeof loadCloudEvidenceCheckpoint>[0];
type Loaded = Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>;
type Projection = { state: Loaded["state"]; campaign: Loaded["campaign"]; sequence: number; snapshotLineage: Loaded["snapshotLineage"] };
const packed = (value: CloudCompressedText) => [value.encoding, value.uncompressedSha256, value.uncompressedBytes, value.compressedBytes, value.dataBase64];
/** Worker-local, small verified summaries only. Key the ACTUAL packed bytes,
 * never their untrusted claimed hashes. No decoded history is retained. */
export class VerifiedCopyCache {
  private readonly copies = new Map<string, Promise<{ inspection: Awaited<ReturnType<typeof inspectLoadedCopy>>; decodedGameBytes: number; evidenceRecords: number }>>();
  // Migration alone may reuse two hydrated current states. Never retain the
  // decoded move archive; ordinary proofs remain small session summaries.
  private readonly projections = new Map<string, Projection>();
  constructor(private readonly load = loadCloudEvidenceCheckpoint) {}
  private key(input: Input) { return sha256Utf8(JSON.stringify([input.expectedCampaignId, input.expectedBaselineId, input.lineage ?? null,
    packed(input.snapshot), packed(input.evidence.header), input.evidence.records.map(row => [row.id, packed(row.content)])])); }
  private remember(key: string, loaded: Loaded) {
    const value = { state: loaded.state, campaign: loaded.campaign, sequence: loaded.snapshotLineage?.sequence ?? loaded.checkpoint.snapshot.head.sequence,
      snapshotLineage: loaded.snapshotLineage };
    this.projections.delete(key); this.projections.set(key, value);
    while (this.projections.size > 2) this.projections.delete(this.projections.keys().next().value!);
    return value;
  }
  async projection(input: Input): Promise<Projection> {
    await this.read(input); const key = await this.key(input), known = this.projections.get(key);
    if (known) { this.projections.delete(key); this.projections.set(key, known); return known; }
    return this.remember(key, await this.load(input));
  }
  async read(input: Input) {
    assertCloudRevision(input.revision); assertCloudRevision(input.expectedRevision);
    if (input.revision !== input.expectedRevision) throw new CloudCodecError("revision_mismatch", "The loaded revision differs from the requested revision.");
    // Explicit field order also shares a proof after JSONB/IDB reorder object
    // keys. Include compressed bytes and lengths, not only claimed digests.
    const key = await this.key(input);
    let request = this.copies.get(key);
    if (!request) {
      request = this.load(input).then(async loaded => {
        this.remember(key, loaded);
        return { inspection: await inspectLoadedCopy(loaded), decodedGameBytes: utf8Bytes(serializeGameState(loaded.state)),
          evidenceRecords: loaded.snapshotLineage ? 0 : loaded.checkpoint.evidence.records.length };
      });
      this.copies.set(key, request);
      void request.catch(() => { if (this.copies.get(key) === request) this.copies.delete(key); });
    }
    return structuredClone(await request); // Small result; callers cannot mutate the cached proof.
  }
}
