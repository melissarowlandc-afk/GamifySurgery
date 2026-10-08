import type { LandscapingAtlasFrameId } from "../art/bitmapAssetManifest";

/**
 * Exterior planting is presentation-only, but lives in stable logical-site
 * coordinates.  This keeps its placement independent from simulation RNG,
 * redraw frequency, viewport size, and the current clinic footprint.
 */
export interface ExteriorLandscapeCandidate {
  readonly key: string;
  readonly frameId: LandscapingAtlasFrameId;
  /** Floor-contact point in logical construction-grid coordinates. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ExteriorRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const LANDSCAPE_FRAMES: readonly LandscapingAtlasFrameId[] = [
  "landscape:tree-round",
  "landscape:tree-open",
  "landscape:tree-column",
  "landscape:tree-crown",
  "landscape:shrub-cluster",
  "landscape:shrub-round",
  "landscape:shrub-small",
  "landscape:flowers-white",
  "landscape:flowers-yellow",
  "landscape:flowers-pink",
];

const TREE_FRAMES = new Set<LandscapingAtlasFrameId>([
  "landscape:tree-round",
  "landscape:tree-open",
  "landscape:tree-column",
  "landscape:tree-crown",
]);

/** Small stable integer hash; deliberately unrelated to game/simulation RNG. */
function siteHash(value: number): number {
  let hash = value | 0;
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  return (hash ^ (hash >>> 16)) >>> 0;
}

function unit(seed: number): number {
  return siteHash(seed) / 0x1_0000_0000;
}

function envelope(candidate: ExteriorLandscapeCandidate, margin: number): ExteriorRectangle {
  return {
    x: candidate.x - candidate.width / 2 - margin,
    y: candidate.y - candidate.height - margin,
    width: candidate.width + margin * 2,
    // The small lower allowance includes the atlas contact-shadow pixels.
    height: candidate.height + margin * 2 + 0.12,
  };
}

function intersects(left: ExteriorRectangle, right: ExteriorRectangle): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

/**
 * Produces an intentionally irregular full-site candidate field. Candidates
 * are filtered by the caller against constructed rooms and circulation; they
 * are never derived from current room bounds, so unaffected plant keys do not
 * move when the clinic grows.
 */
export function getExteriorLandscapeCandidates(
  columns: number,
  rows: number,
): readonly ExteriorLandscapeCandidate[] {
  const siteColumns = Math.max(1, Math.floor(columns));
  const siteRows = Math.max(1, Math.floor(rows));
  // The reference reads as a planted site rather than a handful of perimeter
  // props. A denser field is intentional; foliage may visually overlap, but
  // contact points still keep it from becoming a synthetic hedge.
  const desired = Math.max(44, Math.min(900, Math.round(siteColumns * siteRows * 0.24)));
  const candidates: ExteriorLandscapeCandidate[] = [];

  for (let index = 0; candidates.length < desired && index < desired * 8; index += 1) {
    const typeRoll = unit(index * 29 + 7);
    const frameId = LANDSCAPE_FRAMES[
      Math.min(LANDSCAPE_FRAMES.length - 1, Math.floor(typeRoll * LANDSCAPE_FRAMES.length))
    ]!;
    const isTree = TREE_FRAMES.has(frameId);
    const scale = 0.78 + unit(index * 47 + 11) * (isTree ? 0.28 : 0.34);
    const candidate: ExteriorLandscapeCandidate = {
      key: `site-plant-${index}-${frameId}`,
      frameId,
      // Extending a little beyond each map edge gives a natural continuous
      // field at the default view instead of a hedge exactly on the grid.
      x: -0.72 + unit(index * 73 + 3) * (siteColumns + 1.44),
      y: -0.68 + unit(index * 89 + 5) * (siteRows + 0.5),
      width: (isTree ? 1.32 : 0.72) * scale,
      height: (isTree ? 2.12 : 0.62) * scale,
    };
    // Preserve irregular, walkable-looking ground contact without prohibiting
    // natural canopy/flower overlap. Full envelopes are reserved for room and
    // path culling below, where complete removal is required.
    if (candidates.some((existing) => Math.hypot(candidate.x - existing.x, candidate.y - existing.y) < 0.46)) {
      continue;
    }
    candidates.push(candidate);
  }
  return candidates;
}

/** Filters complete visual envelopes, not just sprite contact points. */
export function getVisibleExteriorLandscape(
  candidates: readonly ExteriorLandscapeCandidate[],
  exclusions: readonly ExteriorRectangle[],
  margin = 0.12,
): readonly ExteriorLandscapeCandidate[] {
  return candidates.filter((candidate) => {
    const candidateEnvelope = envelope(candidate, margin);
    return !exclusions.some((exclusion) => intersects(candidateEnvelope, exclusion));
  });
}

export function exteriorCandidateEnvelope(
  candidate: ExteriorLandscapeCandidate,
  margin = 0.12,
): ExteriorRectangle {
  return envelope(candidate, margin);
}
