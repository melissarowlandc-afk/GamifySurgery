import type { GridPoint } from "@gamify-surgery/game-domain";
import type { FacilityCameraView, FacilityViewModel } from "../../facility/types";
import { clampFacilityCamera } from "../../facility/facilityCameraBounds";
import { phoneCameraLayout, type MapViewport } from "../map/camera";

type Model = Pick<FacilityViewModel, "rooms" | "gridColumns" | "gridRows">;
export function framePhoneGhost(camera: FacilityCameraView, model: Model, viewport: MapViewport,
  ghost: GridPoint, footprint: { width: number; height: number }): FacilityCameraView {
  const fitTile = Math.min(viewport.width / (footprint.width + 4), viewport.height / (footprint.height + 4));
  let low = 0.1; let high = camera.zoom;
  for (let index = 0; index < 32; index++) {
    const zoom = (low + high) / 2;
    if (phoneCameraLayout({ ...camera, zoom }, model, viewport).tileSize <= fitTile) low = zoom; else high = zoom;
  }
  const zoom = phoneCameraLayout(camera, model, viewport).tileSize <= fitTile ? camera.zoom : Math.floor(low * 1000) / 1000;
  const layout = phoneCameraLayout({ ...camera, zoom }, model, viewport);
  return clampFacilityCamera({ zoom,
    panX: viewport.width / 2 - (ghost.x + footprint.width / 2) * layout.tileSize - layout.baseX,
    panY: viewport.height / 2 - (ghost.y + footprint.height / 2) * layout.tileSize - layout.baseY,
  }, model, viewport, true);
}

/** Screen-space edge drift; callers keep the finger's world grab offset while panning. */
export function phoneGhostEdgePan(point: { x: number; y: number }, viewport: MapViewport, delta = 16) {
  const edge = Math.min(48, viewport.width / 5, viewport.height / 5);
  const speed = Math.min(32, Math.max(0, delta)) * 0.45;
  const shift = (value: number, extent: number) => value < edge ? speed * Math.min(1, (edge - value) / edge)
    : value > extent - edge ? -speed * Math.min(1, (value - extent + edge) / edge) : 0;
  return { x: shift(point.x, viewport.width), y: shift(point.y, viewport.height) };
}
