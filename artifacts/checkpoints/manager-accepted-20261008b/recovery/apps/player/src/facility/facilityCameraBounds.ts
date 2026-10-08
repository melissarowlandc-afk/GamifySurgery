import type { FacilityCameraView, FacilityViewModel } from "./types";
import { SURGERY_CENTER_WALL_GEOMETRY } from "./surgeryCenterArchitecture";
import { getWorldExteriorHeight, WORLD_EXTERIOR_BANDS } from "./worldExteriorLayout";

export function isValidFacilityCamera(value: unknown): value is FacilityCameraView {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const camera = value as Partial<FacilityCameraView>;
  return typeof camera.zoom === "number" && Number.isFinite(camera.zoom) && camera.zoom > 0 &&
    typeof camera.panX === "number" && Number.isFinite(camera.panX) &&
    typeof camera.panY === "number" && Number.isFinite(camera.panY);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

/**
 * Match FacilityScene.calculateLayout's camera transform without touching its
 * rendering lane. Pan is a pixel offset from the founder/entrance default, not
 * a Phaser camera scroll value. Keep fractional intent; the scene snaps pixels.
 */
export function clampFacilityCamera(
  camera: FacilityCameraView,
  model: Pick<FacilityViewModel, "gridColumns" | "gridRows" | "rooms">,
  viewport: { width: number; height: number },
): FacilityCameraView {
  const width = Math.max(1, Math.floor(viewport.width));
  const height = Math.max(1, Math.floor(viewport.height));
  const columns = Number.isFinite(model.gridColumns) && model.gridColumns > 0
    ? Math.floor(model.gridColumns) : 16;
  const rows = Number.isFinite(model.gridRows) && model.gridRows > 0
    ? Math.floor(model.gridRows) : 10;
  const wallOverhang = SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles;
  const exterior = WORLD_EXTERIOR_BANDS.setbackTiles + WORLD_EXTERIOR_BANDS.sidewalkTiles;
  const fullSiteTileSize = Math.max(1, Math.floor(Math.min(
    width / columns,
    height / (rows + wallOverhang + exterior),
  )));
  const workingTileSize = Math.max(fullSiteTileSize, Math.floor(Math.min(
    width / Math.min(columns, 14),
    height / (Math.min(rows, 6) + wallOverhang + exterior),
  )));
  const zoom = clamp(camera.zoom, 0.1, 2.5);
  const normalizedZoom = clamp((zoom - 0.1) / 0.9, 0, 1);
  const tileSize = Math.max(1, Math.round(zoom <= 1
    ? fullSiteTileSize + (workingTileSize - fullSiteTileSize) * normalizedZoom
    : workingTileSize * zoom));
  const founderRoom = model.rooms.find((room) => room.isFounderRoom);
  const focusTileX = founderRoom
    ? founderRoom.tileX + founderRoom.width / 2 : columns / 2;
  const defaultOriginX = Math.floor(width / 2 - focusTileX * tileSize);
  const worldHeight = getWorldExteriorHeight(tileSize, rows);
  const defaultOriginY = height - worldHeight;
  const horizontalGap = width - tileSize * columns;
  const verticalGap = height - worldHeight;
  return {
    zoom,
    panX: clamp(camera.panX,
      Math.min(0, horizontalGap) - defaultOriginX,
      Math.max(0, horizontalGap) - defaultOriginX),
    panY: clamp(camera.panY,
      Math.min(0, verticalGap) - defaultOriginY,
      Math.max(0, verticalGap) - defaultOriginY),
  };
}
