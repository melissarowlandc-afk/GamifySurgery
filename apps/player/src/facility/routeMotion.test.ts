import { describe, expect, it } from "vitest";
import {
  advanceRouteMotion,
  routeMotionComplete,
  sampleRouteMotion,
  syncRouteMotion,
} from "./routeMotion";

describe("route motion interpolation", () => {
  it("visits cardinal waypoints instead of cutting across a turn", () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    let track = syncRouteMotion(undefined, {
      location: path[0],
      path,
      pathIndex: 0,
    })!;
    track = syncRouteMotion(track, {
      location: path[2],
      path,
      pathIndex: 2,
    })!;
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0 });
    track = advanceRouteMotion(track, 250, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0.5 });
  });

  it("finishes a saved route smoothly after logical movement clears", () => {
    const path = [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ];
    let track = syncRouteMotion(undefined, {
      location: path[0],
      path,
      pathIndex: 0,
    })!;
    track = syncRouteMotion(track, {
      location: path[2],
    })!;
    expect(routeMotionComplete(track)).toBe(false);
    track = advanceRouteMotion(track, 1_000, 2);
    expect(sampleRouteMotion(track).location).toEqual(path[2]);
    expect(routeMotionComplete(track)).toBe(true);
  });
});
