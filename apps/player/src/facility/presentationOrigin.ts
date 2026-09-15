/**
 * Snap an already-clamped world presentation origin to Canvas' whole-pixel
 * raster grid. Camera intent remains fractional; only its rendered layout is
 * quantized so TileSprites and Phaser Graphics share identical coordinates.
 */
export function snapPresentationOrigin(origin: number): number {
  const rounded = Math.round(origin);
  return Object.is(rounded, -0) ? 0 : rounded;
}
