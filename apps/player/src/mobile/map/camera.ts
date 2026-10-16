import { getInitialFacilityCamera } from "../../facility/defaultCamera";
import { clampFacilityCamera } from "../../facility/facilityCameraBounds";
import { snapPresentationOrigin } from "../../facility/presentationOrigin";
import { SURGERY_CENTER_WALL_GEOMETRY } from "../../facility/surgeryCenterArchitecture";
import type { FacilityCameraView, FacilityViewModel } from "../../facility/types";
import { getWorldExteriorHeight, WORLD_EXTERIOR_BANDS } from "../../facility/worldExteriorLayout";
import type { TouchPoint } from "./gestures";

type CameraModel = Pick<FacilityViewModel, "gridColumns" | "gridRows" | "rooms">;
export interface MapViewport { width: number; height: number }

/** Same transform as calculateLayout; this helper is used only by phone input. */
export function phoneCameraLayout(camera: FacilityCameraView, model: CameraModel, viewport: MapViewport) {
  const width = Math.max(1, Math.floor(viewport.width));
  const height = Math.max(1, Math.floor(viewport.height));
  const columns = Number.isFinite(model.gridColumns) && model.gridColumns > 0 ? Math.floor(model.gridColumns) : 16;
  const rows = Number.isFinite(model.gridRows) && model.gridRows > 0 ? Math.floor(model.gridRows) : 10;
  const wall = SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles;
  const exterior = WORLD_EXTERIOR_BANDS.setbackTiles + WORLD_EXTERIOR_BANDS.sidewalkTiles;
  const full = Math.max(1, Math.floor(Math.min(width / columns, height / (rows + wall + exterior))));
  const working = Math.max(full, Math.floor(Math.min(width / Math.min(columns, 14), height / (Math.min(rows, 6) + wall + exterior))));
  const clamped = clampFacilityCamera(camera, model, { width, height }, true);
  const normalized = Math.max(0, Math.min(1, (clamped.zoom - 0.1) / 0.9));
  const tileSize = Math.max(1, Math.round(clamped.zoom <= 1 ? full + (working - full) * normalized : working * clamped.zoom));
  const founder = model.rooms.find((room) => room.isFounderRoom);
  const baseX = Math.floor(width / 2 - (founder ? founder.tileX + founder.width / 2 : columns / 2) * tileSize);
  const baseY = height - getWorldExteriorHeight(tileSize, rows);
  return { tileSize, baseX, baseY, originX: snapPresentationOrigin(baseX + clamped.panX), originY: snapPresentationOrigin(baseY + clamped.panY) };
}

/** Room footprints are already rotated. Include hallways and the cutaway north wall. */
export function builtFacilityBounds(model: CameraModel) {
  if (model.rooms.length === 0) return null;
  return {
    left: Math.min(...model.rooms.map((room) => room.tileX)),
    top: Math.min(...model.rooms.map((room) => room.tileY)) - SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles,
    right: Math.max(...model.rooms.map((room) => room.tileX + room.width)),
    bottom: Math.max(...model.rooms.map((room) => room.tileY + room.height)),
  };
}

export function framePhoneFacility(model: CameraModel, viewport: MapViewport): FacilityCameraView {
  const fallback = getInitialFacilityCamera({ facilityLevel: 0, rooms: [] });
  const bounds = builtFacilityBounds(model);
  if (!bounds) return clampFacilityCamera(fallback, model, viewport, true);
  // A small footprint margin keeps the north wall and entrances off the edges.
  const margin = 0.6;
  const fitTileSize = Math.min(viewport.width / (bounds.right - bounds.left + margin * 2),
    viewport.height / (bounds.bottom - bounds.top + margin * 2));
  // Choose the largest legal zoom that fits, rather than scaling against lawn.
  let low = 0.1;
  let high = 2.5;
  for (let step = 0; step < 32; step += 1) {
    const zoom = (low + high) / 2;
    if (phoneCameraLayout({ ...fallback, zoom }, model, viewport).tileSize <= fitTileSize) low = zoom;
    else high = zoom;
  }
  const zoom = phoneCameraLayout({ ...fallback, zoom: 2.5 }, model, viewport).tileSize <= fitTileSize
    ? 2.5 : Math.floor(low * 1000) / 1000;
  const layout = phoneCameraLayout({ ...fallback, zoom }, model, viewport);
  return clampFacilityCamera({ zoom,
    panX: viewport.width / 2 - (bounds.left + bounds.right) / 2 * layout.tileSize - layout.baseX,
    panY: viewport.height / 2 - (bounds.top + bounds.bottom) / 2 * layout.tileSize - layout.baseY,
  }, model, viewport, true);
}

/** Keep the world point under `from` beneath `to`, including midpoint translation. */
export function transformPhoneCamera(camera: FacilityCameraView, model: CameraModel, viewport: MapViewport,
  from: TouchPoint, to: TouchPoint, zoom = camera.zoom): FacilityCameraView {
  const before = phoneCameraLayout(camera, model, viewport);
  const after = phoneCameraLayout({ ...camera, zoom }, model, viewport);
  return clampFacilityCamera({ zoom,
    panX: to.x - (from.x - before.originX) / before.tileSize * after.tileSize - after.baseX,
    panY: to.y - (from.y - before.originY) / before.tileSize * after.tileSize - after.baseY,
  }, model, viewport, true);
}
