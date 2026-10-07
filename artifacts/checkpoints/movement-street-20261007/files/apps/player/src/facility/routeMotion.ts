import type { GridPoint } from "@gamify-surgery/game-domain";

export interface RouteMotionTrack {
  path: GridPoint[];
  signature: string;
  progress: number;
  targetIndex: number;
  /**
   * Index in the render path that corresponds to index zero in the currently
   * persisted route. A handoff may retain the unfinished tail of the previous
   * route before appending the new one. This may become negative after the
   * already-traversed prefix is compacted.
   */
  sourceOffset: number;
  lastObservedPathIndex: number;
  routeActive: boolean;
  /** Render-only facing continuity; it never changes route semantics. */
  rightFacing: boolean;
}

export interface RouteMotionSample {
  location: GridPoint;
  direction: "front" | "side" | "back";
  moving: boolean;
  rightFacing: boolean;
}

/**
 * Keep one additional logical interval available to the renderer.
 *
 * Facility ticks are delivered by a browser timer and their React projection
 * can arrive a little after the nominal boundary, especially with many live
 * actors. A target limited to exactly one interval makes every character hit
 * the same artificial stop before the next snapshot extends the route. This
 * buffer does not increase movement speed or mutate logical progress; it only
 * lets canonical-speed interpolation continue through normal timer jitter.
 */
const ROUTE_LOOKAHEAD_INTERVALS = 2;

function signature(path: readonly GridPoint[]): string {
  return path.map((point) => `${point.x},${point.y}`).join("|");
}

function samePoint(
  left: GridPoint | undefined,
  right: GridPoint | undefined,
): boolean {
  return Boolean(
    left &&
      right &&
      left.x === right.x &&
      left.y === right.y,
  );
}

function clampPathIndex(path: readonly GridPoint[], value: number): number {
  return Math.max(0, Math.min(path.length - 1, value));
}

function appendPoint(path: GridPoint[], point: GridPoint): void {
  if (!samePoint(path.at(-1), point)) {
    path.push({ ...point });
  }
}

function rightFacingAt(
  path: readonly GridPoint[],
  progress: number,
  fallback = false,
): boolean {
  const start = path[Math.max(0, Math.min(path.length - 1, Math.floor(progress)))];
  const end = path[Math.max(0, Math.min(path.length - 1, Math.floor(progress) + 1))];
  return start && end && end.x !== start.x ? end.x > start.x : fallback;
}

function handoffRouteMotion(
  previous: RouteMotionTrack,
  path: readonly GridPoint[],
  routeSignature: string,
  logicalIndex: number,
  predictiveIndex: number,
): RouteMotionTrack {
  // The render may run ahead of the previous logical position by the
  // lookahead buffer. A shared waypoint between that logical position and the
  // rendered sample is still valid: the character walks back along the known
  // edge instead of snapping when a replacement route reverses.
  const searchStart = clampPathIndex(
    previous.path,
    Math.min(
      Math.floor(previous.progress),
      previous.sourceOffset + previous.lastObservedPathIndex,
    ),
  );
  let previousHandoffIndex = -1;
  let nextHandoffIndex = -1;
  const findHandoff = (nextStart: number, nextEnd: number) => {
    for (
      let previousIndex = searchStart;
      previousIndex < previous.path.length;
      previousIndex += 1
    ) {
      for (
        let nextIndex = nextStart;
        nextIndex <= nextEnd;
        nextIndex += 1
      ) {
        if (samePoint(previous.path[previousIndex], path[nextIndex])) {
          return { previousIndex, nextIndex };
        }
      }
    }
    return null;
  };
  // Prefer the successor's authoritative current/predictive window so a late
  // projection can never replay a historical prefix. If the renderer is
  // genuinely behind, a shared prefix waypoint remains a valid catch-up path.
  const handoff =
    findHandoff(logicalIndex, predictiveIndex) ??
    findHandoff(0, logicalIndex - 1);
  if (handoff) {
    previousHandoffIndex = handoff.previousIndex;
    nextHandoffIndex = handoff.nextIndex;
  }

  if (previousHandoffIndex < 0) {
    return {
      path: path.map((point) => ({ ...point })),
      signature: routeSignature,
      progress: logicalIndex,
      targetIndex: predictiveIndex,
      sourceOffset: 0,
      lastObservedPathIndex: logicalIndex,
      routeActive: true,
      rightFacing: rightFacingAt(path, logicalIndex, previous.rightFacing),
    };
  }

  const renderedCurrentEdgeEnd = clampPathIndex(
    previous.path,
    Math.ceil(previous.progress),
  );
  const retainedEnd = Math.max(previousHandoffIndex, renderedCurrentEdgeEnd);
  const combined = previous.path
    .slice(0, retainedEnd + 1)
    .map((point) => ({ ...point }));
  // If interpolation already passed the shared point, complete only the
  // current known edge and walk that same validated edge back. This avoids a
  // visible snap without finishing an unrelated stale route tail.
  if (previousHandoffIndex < previous.progress) {
    for (
      let index = Math.min(
        renderedCurrentEdgeEnd - 1,
        Math.floor(previous.progress),
      );
      index >= previousHandoffIndex;
      index -= 1
    ) {
      appendPoint(combined, previous.path[index]!);
    }
  }
  const renderedHandoffIndex = combined.length - 1;
  const sourceOffset = renderedHandoffIndex - nextHandoffIndex;
  for (const point of path.slice(nextHandoffIndex + 1)) {
    appendPoint(combined, point);
  }

  return {
    path: combined,
    signature: routeSignature,
    progress: Math.min(previous.progress, combined.length - 1),
    targetIndex: Math.max(
      previous.progress,
      sourceOffset + predictiveIndex,
    ),
    sourceOffset,
    lastObservedPathIndex: logicalIndex,
    routeActive: true,
    rightFacing: rightFacingAt(combined, previous.progress, previous.rightFacing),
  };
}

/**
 * Reconciles a persisted logical route with the render-only motion track.
 *
 * The renderer starts exactly at the persisted logical index, then receives a
 * buffered predictive target. This lets it traverse the canonical segment
 * during the interval before the reducer commits that segment without
 * stopping when the next browser-timer snapshot arrives slightly late. A
 * route replacement retains the unfinished cardinal tail through the shared
 * waypoint, so arrival -> waiting -> care transitions cannot snap forward.
 */
export function syncRouteMotion(
  previous: RouteMotionTrack | undefined,
  input: {
    location?: GridPoint;
    path?: GridPoint[];
    pathIndex?: number;
    lookaheadPathNodes?: number;
  },
): RouteMotionTrack | undefined {
  const path = input.path;
  if (path && path.length > 0) {
    const routeSignature = signature(path);
    const logicalIndex = clampPathIndex(
      path,
      input.pathIndex ?? 0,
    );
    const predictiveIndex = clampPathIndex(
      path,
      logicalIndex +
        Math.max(0, input.lookaheadPathNodes ?? 0) *
          ROUTE_LOOKAHEAD_INTERVALS,
    );
    const restartedSamePath =
      previous?.signature === routeSignature &&
      logicalIndex < previous.lastObservedPathIndex;
    if (
      previous &&
      (previous.signature !== routeSignature || restartedSamePath)
    ) {
      return handoffRouteMotion(
        previous,
        path,
        routeSignature,
        logicalIndex,
        predictiveIndex,
      );
    }
    if (!previous) {
      return {
        path: path.map((point) => ({ ...point })),
        signature: routeSignature,
        // Mount and reload begin at the exact persisted route position. The
        // old one-node rewind made characters visibly move backwards first.
        progress: logicalIndex,
        targetIndex: predictiveIndex,
        sourceOffset: 0,
        lastObservedPathIndex: logicalIndex,
        routeActive: true,
        rightFacing: rightFacingAt(path, logicalIndex),
      };
    }
    return {
      ...previous,
      targetIndex: Math.max(
        previous.targetIndex,
        previous.sourceOffset + predictiveIndex,
      ),
      lastObservedPathIndex: logicalIndex,
      routeActive: true,
    };
  }

  if (!previous) {
    // A stationary actor is parked where the game placed it, so its first
    // route starts from where it is drawn. A new route is usually already one
    // tick (two nodes) along when first observed.
    return input.location ? parkedRouteMotion(input.location, false) : undefined;
  }
  // A parked track only stands in for the persisted location. An absent actor
  // disappears, and a moved one is drawn at its new location as before.
  if (isParkedRouteMotion(previous)) {
    return samePoint(previous.path[0], input.location) ? previous : undefined;
  }

  const finalIndex = previous.path.length - 1;
  if (!input.location || samePoint(previous.path[finalIndex], input.location)) {
    return {
      ...previous,
      targetIndex: finalIndex,
      routeActive: false,
    };
  }
  let matchingIndex = -1;
  for (
    let index = Math.floor(previous.progress);
    index < previous.path.length;
    index += 1
  ) {
    if (samePoint(previous.path[index], input.location)) {
      matchingIndex = index;
      break;
    }
  }
  return matchingIndex >= 0
    ? {
        ...previous,
        targetIndex: matchingIndex,
        routeActive: false,
      }
    : undefined;
}

/** Catch-up applies only while the render trails the logical position. */
export const ROUTE_CATCH_UP_START_TILES = 0.5;
export const ROUTE_CATCH_UP_GAIN_PER_TILE = 0.5;
export const ROUTE_CATCH_UP_MAX_MULTIPLIER = 2.5;

/**
 * Route distance the next advance will cover, in render-path tiles.
 *
 * Phaser replaces any frame delta over 200 ms with an earlier short delta, so
 * a main-thread stall loses render time while facility ticks continue. At
 * exactly canonical speed the character could then never catch up, and a
 * later route change would snap it forward. While the render trails the
 * logical position by more than half a tile it walks faster, up to 2.5x.
 */
export function routeMotionStepTiles(
  track: RouteMotionTrack,
  deltaMilliseconds: number,
  tilesPerSecond: number,
): number {
  const trailingTiles = track.routeActive
    ? track.sourceOffset + track.lastObservedPathIndex - track.progress
    : 0;
  const catchUp = trailingTiles > ROUTE_CATCH_UP_START_TILES
    ? Math.min(
        ROUTE_CATCH_UP_MAX_MULTIPLIER,
        1 + (trailingTiles - ROUTE_CATCH_UP_START_TILES) *
          ROUTE_CATCH_UP_GAIN_PER_TILE,
      )
    : 1;
  const step =
    Math.max(0, deltaMilliseconds) *
    Math.max(0, tilesPerSecond) *
    catchUp /
    1_000;
  return Math.max(0, Math.min(track.targetIndex, track.progress + step) - track.progress);
}

export function advanceRouteMotion(
  track: RouteMotionTrack,
  deltaMilliseconds: number,
  tilesPerSecond: number,
): RouteMotionTrack {
  const advanced = {
    ...track,
    progress: track.progress +
      routeMotionStepTiles(track, deltaMilliseconds, tilesPerSecond),
  };
  advanced.rightFacing = rightFacingAt(
    advanced.path,
    advanced.progress,
    track.rightFacing,
  );
  // Back-to-back room-idle and task routes can keep one render track alive for
  // a long session. Retain one node behind the current sample for direction
  // continuity, but discard the consumed prefix so handoffs do not turn the
  // character's entire walking history into a growing in-memory route.
  const consumedPrefix = Math.max(0, Math.floor(advanced.progress) - 1);
  if (consumedPrefix === 0) {
    return advanced;
  }
  return {
    ...advanced,
    path: advanced.path.slice(consumedPrefix),
    progress: advanced.progress - consumedPrefix,
    targetIndex: advanced.targetIndex - consumedPrefix,
    sourceOffset: advanced.sourceOffset - consumedPrefix,
  };
}

export function getRouteTilesPerSecond(
  tilesPerFacilityMinute: number,
  realMillisecondsPerFacilityMinuteAt1x: number,
  simulationSpeed: number,
): number {
  return (
    Math.max(0, tilesPerFacilityMinute) *
    (1_000 / Math.max(1, realMillisecondsPerFacilityMinuteAt1x)) *
    Math.max(0, simulationSpeed)
  );
}

export function sampleRouteMotion(
  track: RouteMotionTrack,
): RouteMotionSample {
  const startIndex = Math.max(
    0,
    Math.min(track.path.length - 1, Math.floor(track.progress)),
  );
  const endIndex = Math.min(track.path.length - 1, startIndex + 1);
  const start = track.path[startIndex]!;
  const end = track.path[endIndex]!;
  const fraction = Math.max(0, Math.min(1, track.progress - startIndex));
  const moving = track.progress < track.targetIndex;
  return {
    location: {
      x: start.x + (end.x - start.x) * fraction,
      y: start.y + (end.y - start.y) * fraction,
    },
    direction:
      end.x !== start.x
        ? "side"
        : end.y < start.y
          ? "back"
          : "front",
    moving,
    rightFacing: end.x !== start.x ? end.x > start.x : track.rightFacing,
  };
}

export function routeMotionComplete(track: RouteMotionTrack): boolean {
  return (
    !track.routeActive &&
    track.progress >= track.targetIndex
  );
}

const PARKED_SIGNATURE_PREFIX = "parked:";

function isParkedRouteMotion(track: RouteMotionTrack): boolean {
  return track.signature.startsWith(PARKED_SIGNATURE_PREFIX);
}

function parkedRouteMotion(
  location: GridPoint,
  rightFacing: boolean,
): RouteMotionTrack {
  return {
    path: [{ x: location.x, y: location.y }],
    signature: `${PARKED_SIGNATURE_PREFIX}${location.x},${location.y}`,
    progress: 0,
    targetIndex: 0,
    sourceOffset: 0,
    lastObservedPathIndex: 0,
    routeActive: false,
    rightFacing,
  };
}

/**
 * Replaces a completed track with a one-point track at its final node.
 *
 * Deleting the track made the next route start at its observed logical index.
 * Routes are created and advanced in the same tick, so that index is usually
 * two nodes along and the character popped forward. A parked track lets the
 * next route hand off at its first waypoint instead.
 */
export function parkRouteMotion(track: RouteMotionTrack): RouteMotionTrack {
  const index = Math.max(
    0,
    Math.min(track.path.length - 1, Math.round(track.progress)),
  );
  return parkedRouteMotion(track.path[index]!, track.rightFacing);
}
