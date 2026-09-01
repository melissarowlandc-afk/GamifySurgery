export const WORLD_EXTERIOR_BANDS = {
  /** Kept at zero only for backwards-compatible layout field consumers. */
  setbackTiles: 0,
  sidewalkTiles: 1,
  curbTiles: 0.12,
} as const;

export interface WorldExteriorLayoutInput {
  readonly originX: number;
  readonly originY: number;
  readonly tileSize: number;
  readonly gridColumns: number;
  readonly gridRows: number;
}

export interface WorldExteriorLayout {
  readonly siteLeft: number;
  readonly siteTop: number;
  readonly siteWidth: number;
  readonly gridBottom: number;
  readonly setbackTop: number;
  readonly setbackHeight: number;
  readonly sidewalkTop: number;
  readonly sidewalkHeight: number;
  readonly sidewalkBottom: number;
  readonly curbTop: number;
  readonly worldBottom: number;
  readonly actorSidewalkBaseline: number;
}

/**
 * All exterior bands share the same world transform as rooms. Nothing here is
 * derived from viewport dimensions, which makes pan/zoom a normal translation
 * and scale operation rather than a separate overlay.
 */
export function getWorldExteriorLayout(
  input: WorldExteriorLayoutInput,
): WorldExteriorLayout {
  const siteWidth = input.gridColumns * input.tileSize;
  const gridBottom = input.originY + input.gridRows * input.tileSize;
  const setbackHeight = input.tileSize * WORLD_EXTERIOR_BANDS.setbackTiles;
  const sidewalkHeight = input.tileSize * WORLD_EXTERIOR_BANDS.sidewalkTiles;
  const sidewalkTop = gridBottom + setbackHeight;
  const sidewalkBottom = sidewalkTop + sidewalkHeight;
  return {
    siteLeft: input.originX,
    siteTop: input.originY,
    siteWidth,
    gridBottom,
    setbackTop: gridBottom,
    setbackHeight,
    sidewalkTop,
    sidewalkHeight,
    sidewalkBottom,
    curbTop: sidewalkBottom - input.tileSize * WORLD_EXTERIOR_BANDS.curbTiles,
    worldBottom: sidewalkBottom,
    actorSidewalkBaseline: sidewalkTop + sidewalkHeight * 0.58,
  };
}

export function getWorldExteriorHeight(tileSize: number, gridRows: number): number {
  return (
    gridRows * tileSize +
    (WORLD_EXTERIOR_BANDS.setbackTiles + WORLD_EXTERIOR_BANDS.sidewalkTiles) * tileSize
  );
}
