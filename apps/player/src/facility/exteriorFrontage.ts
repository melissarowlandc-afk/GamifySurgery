import type { FrontageAssetId } from "../art/bitmapAssetManifest";
import { WORLD_EXTERIOR_BANDS } from "./worldExteriorLayout";
import siteLayout from "./data/exterior-landscape-v2.json";

export const FRONTAGE_PAVING = {
  slabWidth: 1.2,
  rowHeight: (WORLD_EXTERIOR_BANDS.sidewalkTiles - WORLD_EXTERIOR_BANDS.curbTiles) / 2,
} as const;

/** Canvas TileSprite buffers must be whole pixels; displayed bounds must not. */
export function getFrontageTileBuffer(width: number, height: number, materialScale: number) {
  const bufferWidth = Math.max(1,Math.ceil(width));
  const bufferHeight = Math.max(1,Math.ceil(height));
  const displayScaleX = width/bufferWidth;
  const displayScaleY = height/bufferHeight;
  return { bufferWidth,bufferHeight,displayScaleX,displayScaleY,
    tileScaleX:materialScale/displayScaleX,tileScaleY:materialScale/displayScaleY };
}

export interface FrontageJoint {
  readonly x1: number; readonly y1: number;
  readonly x2: number; readonly y2: number;
}

/** The only slab-joint authority; coordinates are tiles relative to the site. */
export function getExteriorPavingJoints(columns: number): readonly FrontageJoint[] {
  const width = Math.max(0, columns);
  if (!width) return [];
  const { slabWidth, rowHeight } = FRONTAGE_PAVING;
  const joints: FrontageJoint[] = [{ x1: 0, y1: rowHeight, x2: width, y2: rowHeight }];
  for (let row = 0; row < 2; row += 1) {
    const offset = row === 0 ? 0 : slabWidth / 2;
    for (let index = 0; index * slabWidth + offset < width; index += 1) {
      const x = index * slabWidth + offset;
      if (x <= 0) continue;
      joints.push({ x1: x, y1: row * rowHeight, x2: x, y2: (row + 1) * rowHeight });
    }
  }
  return joints;
}

export function getFrontageEntryInset(frontDeskLeft: number, rows: number) {
  return { x: frontDeskLeft + 2, y: rows, width: 1, height: 0.5 } as const;
}

/** Uniformly scaled 256x16 strips, with a cropped last run. */
export function getFrontageCurbRuns(columns: number) {
  const runWidth = WORLD_EXTERIOR_BANDS.curbTiles * 256 / 16;
  const runs: { key: string; x: number; width: number; assetId: FrontageAssetId }[] = [];
  for (let index = 0; index * runWidth < columns; index += 1) {
    const x = index * runWidth;
    runs.push({ key: `frontage:curb:${index}`, x, width: Math.min(runWidth, columns-x),
      assetId: index % 2 === 0 ? "frontage:curb-a-v2" : "frontage:curb-b-v2" });
  }
  return runs;
}

export interface ExteriorLawnPatch {
  readonly key: string;
  readonly assetId: Extract<FrontageAssetId, "frontage:lawn-sage-v2" | "frontage:lawn-olive-v2">;
  readonly x: number; readonly y: number; readonly width: number; readonly alpha: number;
  readonly rotation: number; readonly flipX: boolean; readonly flipY: boolean;
}

const SITE_LAWN_PATCHES: readonly ExteriorLawnPatch[] = Object.freeze(
  siteLayout.lawnPatches.map(patch => Object.freeze({ ...patch,
    assetId: patch.assetId as ExteriorLawnPatch["assetId"] })),
);

/** Complete rotated 2:1 overlay bounds, so material never spills onto paving. */
export function getExteriorLawnPatchEnvelope(patch: ExteriorLawnPatch) {
  const c = Math.abs(Math.cos(patch.rotation)), s = Math.abs(Math.sin(patch.rotation));
  const width = patch.width * c + patch.width / 2 * s;
  const height = patch.width * s + patch.width / 2 * c;
  return { x: patch.x - width / 2, y: patch.y - height / 2, width, height };
}

/** Site-scale pockets from the same frozen field as plants; no patch lattice. */
export function getExteriorLawnPatches(columns: number, rows: number): readonly ExteriorLawnPatch[] {
  return SITE_LAWN_PATCHES.filter(patch => {
    const bounds = getExteriorLawnPatchEnvelope(patch);
    return bounds.x >= 0 && bounds.y >= 0 &&
      bounds.x + bounds.width <= columns && bounds.y + bounds.height <= rows;
  });
}
