/**
 * Eases a character between the floor and a seat (or any furniture post)
 * instead of snapping. A seat draws the sitter at the furniture's seat point,
 * which can be up to half a tile from where the walk ended; standing up snaps
 * back the same way. When the pose changes and the drawn point jumps, the
 * character glides from where it was to the new point over a short ease-out.
 *
 * Pure presentation state: positions are display pixels, nothing reaches the
 * game rules or saves.
 */
export const SEAT_SETTLE_DURATION_MS = 180;

/** Jumps beyond this many tiles are relocations (rebuilds, loads), not seats. */
const MAXIMUM_SETTLE_DISTANCE_TILES = 1.5;
const MINIMUM_SETTLE_DISTANCE_PX = 0.5;

export interface SeatSettlePoint {
  readonly x: number;
  readonly y: number;
}

export interface SeatSettleState {
  /** Where the character was last drawn, and in which pose. */
  readonly drawn: SeatSettlePoint;
  readonly pose: string;
  /** Active glide, if any. */
  readonly glide?: Readonly<{ from: SeatSettlePoint; elapsedMs: number }>;
}

export interface SeatSettleFrame {
  readonly state: SeatSettleState;
  /** Where to draw this frame. */
  readonly point: SeatSettlePoint;
}

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

export function advanceSeatSettle(
  previous: SeatSettleState | undefined,
  target: SeatSettlePoint,
  pose: string,
  deltaMs: number,
  tileSize: number,
): SeatSettleFrame {
  let glide = previous?.glide;
  if (previous && previous.pose !== pose) {
    const distance = Math.hypot(target.x - previous.drawn.x, target.y - previous.drawn.y);
    glide = distance > MINIMUM_SETTLE_DISTANCE_PX && distance <= tileSize * MAXIMUM_SETTLE_DISTANCE_TILES
      ? { from: previous.drawn, elapsedMs: 0 }
      : undefined;
  } else if (glide) {
    glide = { ...glide, elapsedMs: glide.elapsedMs + Math.max(0, deltaMs) };
  }
  if (!glide || glide.elapsedMs >= SEAT_SETTLE_DURATION_MS) {
    return { state: { drawn: target, pose }, point: target };
  }
  const eased = easeOutCubic(glide.elapsedMs / SEAT_SETTLE_DURATION_MS);
  const point = {
    x: glide.from.x + (target.x - glide.from.x) * eased,
    y: glide.from.y + (target.y - glide.from.y) * eased,
  };
  return { state: { drawn: point, pose, glide }, point };
}
