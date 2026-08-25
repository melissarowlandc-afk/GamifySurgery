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
}

export interface RouteMotionSample {
  location: GridPoint;
  direction: "front" | "side" | "back";
  moving: boolean;
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

/**
 * This is only a defensive bridge for malformed or legacy route handoffs.
 * Normal gameplay routes share an exact cardinal waypoint at their boundary.
 */
function appendCardinalBridge(path: GridPoint[], goal: GridPoint): void {
  const last = path.at(-1);
  if (!last) {
    appendPoint(path, goal);
    return;
  }
  let cursor = { ...last };
  while (cursor.x !== goal.x) {
    cursor = {
      x: cursor.x + Math.sign(goal.x - cursor.x),
      y: cursor.y,
    };
    appendPoint(path, cursor);
  }
  while (cursor.y !== goal.y) {
    cursor = {
      x: cursor.x,
      y: cursor.y + Math.sign(goal.y - cursor.y),
    };
    appendPoint(path, cursor);
  }
}

function handoffRouteMotion(
  previous: RouteMotionTrack,
  path: readonly GridPoint[],
  routeSignature: string,
  logicalIndex: number,
  predictiveIndex: number,
): RouteMotionTrack {
  const first = path[0]!;
  const searchStart = clampPathIndex(
    previous.path,
    Math.floor(previous.progress),
  );
  let handoffIndex = -1;
  for (
    let index = searchStart;
    index < previous.path.length;
    index += 1
  ) {
    if (samePoint(previous.path[index], first)) {
      handoffIndex = index;
      break;
    }
  }

  const combined =
    handoffIndex >= 0
      ? previous.path
          .slice(0, handoffIndex + 1)
          .map((point) => ({ ...point }))
      : previous.path.map((point) => ({ ...point }));
  if (handoffIndex < 0) {
    appendCardinalBridge(combined, first);
  }
  const sourceOffset = Math.max(0, combined.length - 1);
  for (const point of path.slice(1)) {
    appendPoint(combined, point);
  }

  return {
    path: combined,
    signature: routeSignature,
    progress: Math.min(previous.progress, sourceOffset),
    targetIndex: Math.max(
      previous.progress,
      sourceOffset + predictiveIndex,
    ),
    sourceOffset,
    lastObservedPathIndex: logicalIndex,
    routeActive: true,
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
    return undefined;
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

export function advanceRouteMotion(
  track: RouteMotionTrack,
  deltaMilliseconds: number,
  tilesPerSecond: number,
): RouteMotionTrack {
  const step =
    Math.max(0, deltaMilliseconds) *
    Math.max(0, tilesPerSecond) /
    1_000;
  const advanced = {
    ...track,
    progress: Math.min(track.targetIndex, track.progress + step),
  };
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
  };
}

export function routeMotionComplete(track: RouteMotionTrack): boolean {
  return (
    !track.routeActive &&
    track.progress >= track.targetIndex
  );
}
