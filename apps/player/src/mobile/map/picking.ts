import type { TouchPoint } from "./gestures";

export const MAP_TOUCH_RADIUS = 22;
export interface TouchTarget<T> {
  value: T;
  /** A rendered envelope, a chair contact, or a door segment; all in CSS pixels. */
  bounds: { x: number; y: number; width: number; height: number };
  depth?: number;
}

export function nearestTouchTarget<T>(point: TouchPoint, targets: readonly TouchTarget<T>[], radius = MAP_TOUCH_RADIUS): T | null {
  let best: { target: TouchTarget<T>; distance: number; centerDistance: number } | null = null;
  for (const target of targets) {
    const { x, y, width, height } = target.bounds;
    const distance = Math.hypot(Math.max(x - point.x, 0, point.x - x - width),
      Math.max(y - point.y, 0, point.y - y - height));
    if (distance > radius) continue;
    const centerDistance = Math.hypot(point.x - x - width / 2, point.y - y - height / 2);
    if (!best || distance < best.distance || (distance === best.distance &&
      (centerDistance < best.centerDistance || (centerDistance === best.centerDistance &&
        (target.depth ?? 0) > (best.target.depth ?? 0))))) best = { target, distance, centerDistance };
  }
  return best?.target.value ?? null;
}
