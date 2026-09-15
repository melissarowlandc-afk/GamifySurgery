/**
 * Resolves the repeated-material offset for an authored environment
 * TileSprite. Phaser samples source pixels at `local / scale + phase`; using
 * the positive coordinate relative to the facility origin keeps that sample
 * fixed to the semantic world surface while its rendered rectangle moves on
 * pan.
 */
export function getEnvironmentTileLogicalPhase(
  renderedX: number,
  renderedY: number,
  originX: number,
  originY: number,
  tileScale: number,
): Readonly<{ x: number; y: number }> {
  const safeScale = Math.max(0.02, tileScale);
  const phase = (coordinate: number, origin: number): number => {
    const rounded = Math.round((coordinate - origin) / safeScale);
    return Object.is(rounded, -0) ? 0 : rounded;
  };

  return {
    x: phase(renderedX, originX),
    y: phase(renderedY, originY),
  };
}
