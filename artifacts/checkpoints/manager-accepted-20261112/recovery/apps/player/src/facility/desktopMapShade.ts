import type { FacilityCameraView, FacilityViewModel } from "./types";
import { snapPresentationOrigin } from "./presentationOrigin";
import { SURGERY_CENTER_WALL_GEOMETRY } from "./surgeryCenterArchitecture";
import { getWorldExteriorHeight, getWorldExteriorLayout, WORLD_EXTERIOR_BANDS } from "./worldExteriorLayout";

type Viewport = { width: number; height: number };
type CameraModel = Pick<FacilityViewModel, "gridColumns" | "gridRows" | "rooms">;
type DesktopViewport = NonNullable<FacilityCameraView["desktopViewport"]>;
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const positiveSize = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;

/** Optional UI metadata is tolerant: malformed metadata never loses a valid zoom/pan. */
export function readDesktopCameraViewport(value: unknown): DesktopViewport | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const view = value as Partial<DesktopViewport>;
  if (![view.width, view.height, view.maxHeight].every(size => typeof size === "number" && Number.isFinite(size) && size >= 1 && size <= 100_000) ||
    view.maxHeight! < view.height!) return undefined;
  return { width: Math.floor(view.width!), height: Math.floor(view.height!), maxHeight: Math.floor(view.maxHeight!) };
}

export function facilityCameraSignature(camera: FacilityCameraView | undefined): string {
  if (!camera) return "default";
  const basis = camera.desktopViewport;
  return `${camera.zoom}:${camera.panX}:${camera.panY}:${basis?.width ?? ""}:${basis?.height ?? ""}:${basis?.maxHeight ?? ""}`;
}

/**
 * Desktop canvas resize is a window shade, not a new zoom-to-fit operation.
 * The first real pane supplies the legacy fit. Preserve that sizing/origin in
 * the existing camera preference; only lift the lower bound when revealing
 * beyond worldBottom. The high-water height prevents reverse clamping when
 * a small world was dragged down by a pane taller than the world itself.
 */
export function desktopMapShade(camera: FacilityCameraView, model: CameraModel, viewport: Viewport) {
  const width = positiveSize(viewport.width, 1), height = positiveSize(viewport.height, 1);
  const reference = readDesktopCameraViewport(camera.desktopViewport) ?? { width, height, maxHeight: height };
  const desktopViewport = { ...reference, maxHeight: Math.max(reference.maxHeight, height) };
  const columns = positiveSize(model.gridColumns, 16), rows = positiveSize(model.gridRows, 10);
  const wall = SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles;
  const exterior = WORLD_EXTERIOR_BANDS.setbackTiles + WORLD_EXTERIOR_BANDS.sidewalkTiles;
  const full = Math.max(1, Math.floor(Math.min(reference.width / columns, reference.height / (rows + wall + exterior))));
  const working = Math.max(full, Math.floor(Math.min(reference.width / Math.min(columns, 14),
    reference.height / (Math.min(rows, 6) + wall + exterior))));
  const zoom = clamp(camera.zoom, 0.1, 2.5), normalized = clamp((zoom - 0.1) / 0.9, 0, 1);
  const tileSize = Math.max(1, Math.round(zoom <= 1 ? full + (working - full) * normalized : working * zoom));
  const founder = model.rooms.find(room => room.isFounderRoom);
  const baseX = Math.floor(reference.width / 2 - (founder ? founder.tileX + founder.width / 2 : columns / 2) * tileSize);
  const worldHeight = getWorldExteriorHeight(tileSize, rows), baseY = reference.height - worldHeight;
  const boundedX = clamp(baseX + camera.panX,
    Math.min(0, width - tileSize * columns), Math.max(0, width - tileSize * columns));
  const boundedY = clamp(baseY + camera.panY,
    height - worldHeight, Math.max(0, desktopViewport.maxHeight - worldHeight));
  const originX = snapPresentationOrigin(boundedX), originY = snapPresentationOrigin(boundedY);
  const bands = getWorldExteriorLayout({ originX, originY, tileSize, gridColumns: columns, gridRows: rows });
  return {
    camera: { zoom, panX: boundedX - baseX, panY: boundedY - baseY, desktopViewport } satisfies FacilityCameraView,
    layout: { originX, originY, tileSize, width: columns * tileSize, height: rows * tileSize,
      sidewalkTop: bands.sidewalkTop, sidewalkHeight: bands.sidewalkHeight,
      setbackTop: bands.setbackTop, setbackHeight: bands.setbackHeight, worldBottom: bands.worldBottom },
  };
}
