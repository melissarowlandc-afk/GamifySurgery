import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { logicalJsonText, sha256Utf8 } from "./codecJson";
import { cloudProgress } from "./progress";
import type { CloudConfirmed } from "./transport";
import { isSnapshotCopy } from "./snapshotCodec";

/** Identity is the only change made by a faithful separate-campaign import.
 * Normalize it for comparison so importing a branch cannot make it newer. */
export async function inspectVerifiedCopy(copy: CloudConfirmed) {
  const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
    expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
  return inspectLoadedCopy(loaded);
}
export async function inspectLoadedCopy(loaded: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>) {
  const { snapshot, evidence } = loaded.checkpoint;
  const identity = "copy-comparison";
  const normalized = { snapshot: { ...snapshot, campaignId: identity,
    patches: snapshot.patches.filter(row => !(row.path.length === 1 && row.path[0] === "campaignId")) },
    evidence: { ...evidence, campaignId: identity, baseline: { ...evidence.baseline,
      source: { ...evidence.baseline.source, campaignId: identity }, pins: { ...evidence.baseline.pins, campaignId: identity } } } };
  const progress = cloudProgress(loaded.state);
  const stateDigest = await sha256Utf8(logicalJsonText(JSON.parse(JSON.stringify({ ...loaded.state, campaignId: identity }))));
  return { campaign: loaded.campaign, progress, rank: [progress.facilityTick, loaded.snapshotLineage?.sequence ?? snapshot.head.sequence,
    progress.xp, progress.level, loaded.snapshotLineage ? 0 : evidence.records.length], stateDigest,
    ...(loaded.snapshotLineage ? { lineage: loaded.snapshotLineage } : {}),
    digest: loaded.snapshotLineage ? stateDigest : await sha256Utf8(logicalJsonText(JSON.parse(JSON.stringify(normalized)))) };
}
export type VerifiedCopyInspection = Awaited<ReturnType<typeof inspectVerifiedCopy>>;

/** Never order by device wall clocks, cash (which can decrease), or cache revision. */
export function compareVerifiedProgress(left: VerifiedCopyInspection, right: VerifiedCopyInspection): number {
  for (let index = 0; index < left.rank.length; index++) {
    const difference = left.rank[index]! - right.rank[index]!;
    if (difference) return difference;
  }
  return left.digest < right.digest ? -1 : left.digest > right.digest ? 1 : 0;
}
export function copyDescendsFrom(copy: CloudConfirmed, base: CloudConfirmed): boolean {
  const legacyRoot = /^migration\.([a-f0-9]{64})$/.exec(base.lineage?.branchId ?? "")?.[1];
  if (isSnapshotCopy(copy)) return !copy.priorRecovery && !base.priorRecovery && copy.campaignId === base.campaignId &&
    (copy.snapshot.uncompressedSha256 === base.snapshot.uncompressedSha256 || copy.lineage?.parents.includes(base.snapshot.uncompressedSha256) === true ||
      Boolean(legacyRoot && base.lineage?.parents.includes(legacyRoot) && copy.lineage?.parents.includes(legacyRoot)) ||
      Boolean(copy.lineage && base.lineage && copy.lineage.branchId === base.lineage.branchId && copy.lineage.sequence >= base.lineage.sequence));
  return !copy.priorRecovery && !base.priorRecovery && copy.campaignId === base.campaignId && copy.baselineId === base.baselineId &&
    copy.evidence.header.uncompressedSha256 === base.evidence.header.uncompressedSha256 &&
    copy.evidence.records.length >= base.evidence.records.length && base.evidence.records.every((row, index) => {
      const next = copy.evidence.records[index];
      return next?.id === row.id && next.content.uncompressedSha256 === row.content.uncompressedSha256 &&
        next.content.uncompressedBytes === row.content.uncompressedBytes;
    });
}

/** Public campaign IDs carry only an opaque family hash, never user/account data.
 * Other devices can find the active branch even if the old slot was reclaimed. */
export async function cloudCopyFamily(campaignId: string, parents: Readonly<Record<string, string>> = {}): Promise<string> {
  const seen = new Set<string>();
  while (parents[campaignId] && !seen.has(campaignId)) { seen.add(campaignId); campaignId = parents[campaignId]!; }
  return /^auto\.([a-f0-9]{64})\.[a-f0-9]{64}$/.exec(campaignId)?.[1] ?? sha256Utf8(campaignId);
}
export const automaticCopyId = (family: string, digest: string) => `auto.${family}.${digest}`;
