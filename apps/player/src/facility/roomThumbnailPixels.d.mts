interface Bounds { x: number; y: number; width: number; height: number }
export interface RoomThumbnailPixelStats {
  version: number; bounds: Bounds; samples: number; opaqueCoverage: number;
  distinctColors: number; quantizedColors: number; dominantFraction: number; contrastFraction: number;
}
export function roomThumbnailStage(width: number, height: number): {
  tileSize: number; originX: number; originY: number; width: number; height: number;
};
export function roomThumbnailFootprint(width: number, height: number): Bounds;
export function thumbnailFootprintInFrame(footprint: Bounds, source: Bounds, destination: Bounds): Bounds;
export function assertRoomThumbnailPixels(rgba: ArrayLike<number>, width: number, height: number, footprint: Bounds): RoomThumbnailPixelStats;
