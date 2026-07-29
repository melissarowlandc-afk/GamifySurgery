import type { GridPoint } from "@gamify-surgery/game-domain";

export interface RouteMotionTrack {
  path: GridPoint[];
  signature: string;
  progress: number;
  targetIndex: number;
  routeActive: boolean;
}

export interface RouteMotionSample {
  location: GridPoint;
  direction: "front" | "side" | "back";
  moving: boolean;
}

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

/**
 * Reconciles a persisted logical route with the render-only motion track.
 *
 * The reducer may advance multiple route nodes in one simulation minute.
 * Retaining the complete prior path lets Phaser animate every cardinal
 * waypoint instead of jumping directly to the newest saved node.
 */
export function syncRouteMotion(
  previous: RouteMotionTrack | undefined,
  input: {
    location?: GridPoint;
    path?: GridPoint[];
    pathIndex?: number;
  },
): RouteMotionTrack | undefined {
  const path = input.path;
  if (path && path.length > 0) {
    const routeSignature = signature(path);
    const targetIndex = Math.max(
      0,
      Math.min(path.length - 1, input.pathIndex ?? 0),
    );
    if (!previous || previous.signature !== routeSignature) {
      return {
        path: path.map((point) => ({ ...point })),
        signature: routeSignature,
        // A newly observed route normally arrives at index zero. If the
        // renderer mounted or resumed after the domain already advanced it,
        // retain the final incoming segment instead of snapping directly to
        // the latest logical tile.
        progress: Math.max(0, targetIndex - 1),
        targetIndex,
        routeActive: true,
      };
    }
    return {
      ...previous,
      targetIndex: Math.max(previous.targetIndex, targetIndex),
      routeActive: true,
    };
  }

  if (!previous || !input.location) {
    return undefined;
  }

  const finalIndex = previous.path.length - 1;
  if (samePoint(previous.path[finalIndex], input.location)) {
    return {
      ...previous,
      targetIndex: finalIndex,
      routeActive: false,
    };
  }
  return undefined;
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
  return {
    ...track,
    progress: Math.min(track.targetIndex, track.progress + step),
  };
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
    track.progress >= track.targetIndex &&
    track.targetIndex >= track.path.length - 1
  );
}
