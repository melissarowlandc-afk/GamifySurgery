import { serializeGameState } from "@gamify-surgery/game-domain";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { inspectLoadedCopy } from "./copySelection";
import { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";
import type { CloudCompressedText } from "./codecCompression";
import { assertCloudRevision } from "./codec";
import { readSnapshotLineage, SNAPSHOT_BASELINE } from "./snapshotCodec";

type Input = Parameters<typeof loadCloudEvidenceCheckpoint>[0];
type Loaded = Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>;
export type VerifiedSessionSnapshot = Pick<Loaded, "state" | "campaign" | "checkpoint" | "source" | "snapshotLineage">;
type Projection = Pick<Loaded, "state" | "campaign" | "snapshotLineage"> & { sequence: number };
const packed = (value: CloudCompressedText) => [value.encoding, value.uncompressedSha256, value.uncompressedBytes, value.compressedBytes, value.dataBase64];
const sessionSnapshot = ({ state, campaign, checkpoint, source, snapshotLineage }: Loaded): VerifiedSessionSnapshot =>
  ({ state, campaign, checkpoint, source, snapshotLineage });
/** Worker-local proofs key ACTUAL packed bytes, never their claimed hashes.
 * Keep only two hydrated current states; no decoded move archive is retained. */
export class VerifiedCopyCache {
  private readonly copies = new Map<string, Promise<{ inspection: Awaited<ReturnType<typeof inspectLoadedCopy>>; decodedGameBytes: number; evidenceRecords: number }>>();
  // Migration/opening reuse two current states. Native ephemeral checkpoints
  // have no move archive. Legacy projections never retain a decoded archive.
  private readonly projections = new Map<string, Projection & { session?: VerifiedSessionSnapshot }>();
  constructor(private readonly load = loadCloudEvidenceCheckpoint) {}
  private key(input: Input) {
    let lineage: unknown = null;
    if (input.lineage !== undefined) {
      // Validate BEFORE normalization, including unknown undefined fields that
      // JSON.stringify would drop. Parent array order is meaningful and stays.
      if (input.lineage === null || Object.keys(input.lineage).length !== 3)
        throw new CloudCodecError("snapshot_lineage", "Invalid snapshot integrity metadata.");
      const row = readSnapshotLineage(input.lineage);
      lineage = [row.branchId, row.sequence, row.parents];
    }
    return sha256Utf8(JSON.stringify([input.expectedCampaignId, input.expectedBaselineId, lineage,
      packed(input.snapshot), packed(input.evidence.header), input.evidence.records.map(row => [row.id, packed(row.content)])]));
  }
  private remember(key: string, loaded: Loaded) {
    const value = { state: loaded.state, campaign: loaded.campaign, sequence: loaded.snapshotLineage?.sequence ?? loaded.checkpoint.snapshot.head.sequence,
      snapshotLineage: loaded.snapshotLineage, ...(loaded.snapshotLineage ? { session: sessionSnapshot(loaded) } : {}) };
    this.projections.delete(key); this.projections.set(key, value);
    while (this.projections.size > 2) this.projections.delete(this.projections.keys().next().value!);
    return value;
  }
  async projection(input: Input): Promise<Projection> {
    const { key } = await this.proof(input), known = this.projections.get(key);
    const value = known ?? this.remember(key, await this.load(input));
    this.projections.delete(key); this.projections.set(key, value);
    const { state, campaign, snapshotLineage, sequence } = value;
    return structuredClone({ state, campaign, snapshotLineage, sequence });
  }
  async hydrate(input: Input): Promise<VerifiedSessionSnapshot> {
    if (input.expectedBaselineId !== SNAPSHOT_BASELINE) return sessionSnapshot(await this.load(input));
    const { key } = await this.proof(input), known = this.projections.get(key);
    if (known?.session) {
      this.projections.delete(key); this.projections.set(key, known);
      // Sessions own mutable state/checkpoints. Never expose the worker cache.
      return structuredClone(known.session);
    }
    const loaded = await this.load(input);
    this.remember(key, loaded);
    return structuredClone(sessionSnapshot(loaded));
  }
  async read(input: Input) { return structuredClone((await this.proof(input)).value); }
  private async proof(input: Input) {
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
      while (this.copies.size > 64) this.copies.delete(this.copies.keys().next().value!);
      void request.catch(() => { if (this.copies.get(key) === request) { this.copies.delete(key); this.projections.delete(key); } });
    } else {
      this.copies.delete(key); this.copies.set(key, request);
    }
    return { key, value: await request };
  }
}

/** One cache per codec realm, shared by opening and native journal recovery. */
export const verifiedCopies = new VerifiedCopyCache();
