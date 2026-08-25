import type { GridPoint } from "@gamify-surgery/game-domain";

/**
 * Returns every grid square crossed by a pointer drag, including both ends.
 *
 * Pointer events can be farther apart than a tile when the browser is busy or
 * the player drags quickly. Rasterizing the segment keeps hallway painting
 * continuous without tying construction to the browser's event frequency.
 */
export function rasterizeGridLine(
  from: GridPoint,
  to: GridPoint,
): GridPoint[] {
  const bresenhamPoints: GridPoint[] = [];
  let x = from.x;
  let y = from.y;
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);
  const stepX = from.x < to.x ? 1 : -1;
  const stepY = from.y < to.y ? 1 : -1;
  let error = deltaX - deltaY;

  while (true) {
    bresenhamPoints.push({ x, y });
    if (x === to.x && y === to.y) {
      break;
    }
    const doubledError = error * 2;
    if (doubledError > -deltaY) {
      error -= deltaY;
      x += stepX;
    }
    if (doubledError < deltaX) {
      error += deltaX;
      y += stepY;
    }
  }

  // A hallway path must connect by shared edges, not just touch at corners.
  // Insert one orthogonal bridge whenever Bresenham advances both axes.
  const points: GridPoint[] = [];
  for (const point of bresenhamPoints) {
    const previous = points.at(-1);
    if (
      previous &&
      previous.x !== point.x &&
      previous.y !== point.y
    ) {
      points.push({ x: point.x, y: previous.y });
    }
    points.push(point);
  }

  return points;
}
