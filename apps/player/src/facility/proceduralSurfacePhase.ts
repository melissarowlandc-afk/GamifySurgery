/**
 * Returns a repeated procedural pattern row relative to its owning surface.
 * Both values are rendered coordinates, so a camera translation cancels out.
 */
export function getProceduralSurfaceRow(
  renderedCoordinate: number,
  renderedSurfaceStart: number,
  spacing: number,
): number {
  return Math.floor(
    (renderedCoordinate - renderedSurfaceStart) / Math.max(1, spacing),
  );
}
