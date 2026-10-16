import {
  FRONTAGE_V2_ASSETS, LANDSCAPING_ATLAS_V1_FRAMES,
  type FrontageAssetId, type LandscapingAtlasFrameId,
} from "../art/bitmapAssetManifest";
import { SURGERY_CENTER_WALL_GEOMETRY } from "./surgeryCenterArchitecture";
import siteLayout from "./data/exterior-landscape-v2.json";

export type ExteriorGrassFrameId = Extract<FrontageAssetId,
  "frontage:grass-low-v2" | "frontage:grass-clover-v2" | "frontage:grass-upright-v2">;
export type ExteriorLandscapeFrameId = LandscapingAtlasFrameId | ExteriorGrassFrameId;

/** Presentation-only contacts from the single frozen site-wide layout. */
export interface ExteriorLandscapeCandidate {
  readonly key: string;
  readonly groupKey: string;
  readonly frameId: ExteriorLandscapeFrameId;
  /** Authored floor contact, including its measured source anchor. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ExteriorRectangle {
  readonly x: number; readonly y: number;
  readonly width: number; readonly height: number;
}

const SITE_CANDIDATES: readonly ExteriorLandscapeCandidate[] = Object.freeze(
  siteLayout.plants.map(plant => {
    const frameId = plant.frameId as ExteriorLandscapeFrameId;
    const source = getExteriorLandscapeSource(frameId);
    return Object.freeze({ ...plant, frameId,
      height: plant.width * source.nativeHeight / source.nativeWidth });
  }),
);

export function getExteriorLandscapeSource(frameId: ExteriorLandscapeFrameId) {
  return frameId.startsWith("frontage:")
    ? FRONTAGE_V2_ASSETS[frameId as ExteriorGrassFrameId]
    : LANDSCAPING_ATLAS_V1_FRAMES[frameId as LandscapingAtlasFrameId];
}

function intersects(left: ExteriorRectangle, right: ExteriorRectangle): boolean {
  return left.x < right.x+right.width && left.x+left.width > right.x &&
    left.y < right.y+right.height && left.y+left.height > right.y;
}

/** Full source/shadow rectangle, including grass pixels below its contact. */
export function exteriorCandidateEnvelope(
  candidate: ExteriorLandscapeCandidate, margin = 0.12, tileSize?: number,
): ExteriorRectangle {
  const source = getExteriorLandscapeSource(candidate.frameId);
  const scale = candidate.width/source.nativeWidth;
  // Canvas roundPixels may move an edge by half a rendered pixel. Account for
  // that in logical space; never enlarge the sprite to a fixed screen size.
  const pad = margin + (tileSize === undefined ? 0 : 0.5/Math.max(1,tileSize));
  return { x: candidate.x-source.anchor.x*scale-pad,
    y: candidate.y-source.anchor.y*scale-pad,
    width: source.nativeWidth*scale+pad*2, height: source.nativeHeight*scale+pad*2 };
}

export function getExteriorLandscapeDisplay(
  candidate: ExteriorLandscapeCandidate, tileSize: number, originX = 0, originY = 0,
) {
  const source = getExteriorLandscapeSource(candidate.frameId);
  const scale = candidate.width*tileSize/source.nativeWidth;
  const x = originX+candidate.x*tileSize;
  const y = originY+candidate.y*tileSize;
  return { x, y, scale, width: source.nativeWidth*scale, height: source.nativeHeight*scale,
    bounds: { x: x-source.anchor.x*scale, y: y-source.anchor.y*scale,
      width: source.nativeWidth*scale, height: source.nativeHeight*scale } };
}

/** Ordinary cutaway rooms include their projected wall/shadow envelope. */
export function getExteriorConstructionEnvelope(rectangle: ExteriorRectangle, hallway = false): ExteriorRectangle {
  if (hallway) return rectangle;
  const side = SURGERY_CENTER_WALL_GEOMETRY.sideThicknessTiles + SURGERY_CENTER_WALL_GEOMETRY.shadowOffsetTiles.x;
  const north = SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles;
  const south = SURGERY_CENTER_WALL_GEOMETRY.foregroundOutsetTiles + SURGERY_CENTER_WALL_GEOMETRY.shadowOffsetTiles.y;
  return { x: rectangle.x-side, y: rectangle.y-north,
    width: rectangle.width+side*2, height: rectangle.height+north+south };
}

/**
 * One offline-authored 96x64 field, cropped by full visual bounds. Campaigns,
 * construction and camera changes never generate or reposition its plants.
 * Smaller/legacy sites use the same coordinates; expansion reveals more of
 * the frozen field without moving any previously visible plant.
 */
export function getExteriorLandscapeCandidates(columns: number, rows: number): readonly ExteriorLandscapeCandidate[] {
  return SITE_CANDIDATES.filter(candidate => {
    const bounds = exteriorCandidateEnvelope(candidate);
    return bounds.x >= 0 && bounds.y >= 0 &&
      bounds.x + bounds.width <= columns && bounds.y + bounds.height <= rows;
  });
}

/** Culls complete rendered envelopes, then orders overlap by floor contact. */
export function getVisibleExteriorLandscape(
  candidates: readonly ExteriorLandscapeCandidate[], exclusions: readonly ExteriorRectangle[],
  margin = 0.12, tileSize?: number,
): readonly ExteriorLandscapeCandidate[] {
  return candidates.filter(candidate => !exclusions.some(exclusion =>
    intersects(exteriorCandidateEnvelope(candidate,margin,tileSize),exclusion)))
    .sort((left,right) => left.y-right.y || left.x-right.x || left.key.localeCompare(right.key));
}
