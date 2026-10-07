import { describe, expect, it } from "vitest";
import {
  advanceRouteMotion,
  getRouteTilesPerSecond,
  parkRouteMotion,
  routeMotionComplete,
  routeMotionStepTiles,
  sampleRouteMotion,
  syncRouteMotion,
} from "./routeMotion";

describe("route motion interpolation", () => {
  it("predicts one canonical movement interval and visits every turn", () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    let track = syncRouteMotion(undefined, {
      location: path[0],
      path,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0 });
    track = advanceRouteMotion(track, 250, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0.5 });
  });

  it("mounts and reloads at the exact persisted index without rewinding", () => {
    const path = Array.from({ length: 9 }, (_, x) => ({ x, y: 2 }));
    const track = syncRouteMotion(undefined, {
      location: path[4],
      path,
      pathIndex: 4,
      lookaheadPathNodes: 4,
    })!;

    expect(track.progress).toBe(4);
    expect(track.targetIndex).toBe(8);
    expect(sampleRouteMotion(track).location).toEqual(path[4]);
  });

  it("hands a new route off at its shared waypoint without snapping", () => {
    const arrival = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ];
    const waiting = [
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
    ];
    let track = syncRouteMotion(undefined, {
      location: arrival[0],
      path: arrival,
      pathIndex: 0,
      lookaheadPathNodes: 4,
    })!;
    track = advanceRouteMotion(track, 750, 4);
    expect(sampleRouteMotion(track).location).toEqual({ x: 3, y: 0 });

    track = syncRouteMotion(track, {
      location: waiting[0],
      path: waiting,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;
    expect(sampleRouteMotion(track).location).toEqual({ x: 3, y: 0 });

    // The waiting route's logical start is one tile ahead of the render, so
    // it catches up at 1.25x until level, then walks at canonical speed.
    track = advanceRouteMotion(track, 250, 4);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 0.25 });
    track = advanceRouteMotion(track, 250, 4);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 1.25 });
  });

  it("joins a replacement route at its authoritative current index without replaying its historical prefix", () => {
    const previousPath = [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ];
    const replacementPath = [
      { x: 8, y: 6 },
      { x: 7, y: 6 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 4, y: 5 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
      { x: 4, y: 1 },
    ];
    let track = syncRouteMotion(undefined, {
      location: previousPath[0],
      path: previousPath,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;
    track = advanceRouteMotion(track, 1_000, 2);
    const retainedPreviousPath = track.path.map((point) => ({ ...point }));

    track = syncRouteMotion(track, {
      location: replacementPath[8],
      path: replacementPath,
      pathIndex: 8,
      lookaheadPathNodes: 1,
    })!;

    expect(track.path).toEqual([
      ...retainedPreviousPath,
      replacementPath[9],
    ]);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 2 });
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 1 });
  });

  it("finishes and reverses only the current known edge when its shared waypoint is behind fractional render progress", () => {
    const previousPath = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const replacementPath = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    let track = syncRouteMotion(undefined, {
      location: previousPath[0],
      path: previousPath,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;
    track = advanceRouteMotion(track, 750, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1.5, y: 0 });

    track = syncRouteMotion(track, {
      location: replacementPath[0],
      path: replacementPath,
      pathIndex: 0,
      lookaheadPathNodes: 1,
    })!;

    expect(track.path).toEqual([
      ...previousPath,
      replacementPath[0],
      replacementPath[1],
      replacementPath[2],
    ]);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1.5, y: 0 });
    // The replacement's logical start is 1.5 render tiles ahead (to the edge
    // end and back), so the walk-back runs at catch-up speed.
    track = advanceRouteMotion(track, 250, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1.75, y: 0 });
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0.375 });
  });

  it("resets to the authoritative point when routes are disconnected instead of inventing a bridge", () => {
    const previousPath = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ];
    const replacementPath = [
      { x: 9, y: 9 },
      { x: 9, y: 8 },
      { x: 9, y: 7 },
      { x: 8, y: 7 },
    ];
    let track = syncRouteMotion(undefined, {
      location: previousPath[0],
      path: previousPath,
      pathIndex: 0,
      lookaheadPathNodes: 1,
    })!;
    track = advanceRouteMotion(track, 1_000, 1);

    track = syncRouteMotion(track, {
      location: replacementPath[2],
      path: replacementPath,
      pathIndex: 2,
      lookaheadPathNodes: 1,
    })!;

    expect(track.path).toEqual(replacementPath);
    expect(track.progress).toBe(2);
    expect(sampleRouteMotion(track).location).toEqual(replacementPath[2]);
  });

  it("retains a valid old tail into the successor prefix when rendering is behind the logical route", () => {
    const previousPath = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const replacementPath = [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ];
    let track = syncRouteMotion(undefined, {
      location: previousPath[0],
      path: previousPath,
      pathIndex: 0,
      lookaheadPathNodes: 1,
    })!;
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0 });

    track = syncRouteMotion(track, {
      location: replacementPath[2],
      path: replacementPath,
      pathIndex: 2,
      lookaheadPathNodes: 1,
    })!;

    expect(track.path).toEqual([
      ...previousPath,
      replacementPath[1],
      replacementPath[2],
    ]);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1, y: 0 });
    track = advanceRouteMotion(track, 1_500, 2);
    expect(sampleRouteMotion(track).location).toEqual(replacementPath[2]);
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
      lookaheadPathNodes: 2,
    })!;
    track = syncRouteMotion(track, {
      location: undefined,
    })!;
    expect(routeMotionComplete(track)).toBe(false);
    track = advanceRouteMotion(track, 1_000, 2);
    expect(sampleRouteMotion(track).location).toEqual(path[2]);
    expect(routeMotionComplete(track)).toBe(true);
  });

  it("uses the exact shared rate at each supported simulation speed", () => {
    expect(getRouteTilesPerSecond(2, 1_000, 1)).toBe(2);
    expect(getRouteTilesPerSecond(2, 1_000, 2)).toBe(4);
    expect(getRouteTilesPerSecond(2, 1_000, 4)).toBe(8);
  });

  it("retains a render-only right-facing signal through a horizontal route and stop", () => {
    const path = [{ x: 1, y: 2 }, { x: 2, y: 2 }];
    let track = syncRouteMotion(undefined, {
      location: path[0], path, pathIndex: 0, lookaheadPathNodes: 1,
    })!;
    expect(sampleRouteMotion(track).rightFacing).toBe(true);
    track = advanceRouteMotion(track, 1_000, 1);
    expect(sampleRouteMotion(track).rightFacing).toBe(true);
    const leftTrack = syncRouteMotion(undefined, {
      location: path[1], path: [...path].reverse(), pathIndex: 0, lookaheadPathNodes: 1,
    })!;
    expect(sampleRouteMotion(leftTrack).rightFacing).toBe(false);
  });

  it.each([1, 2, 4] as const)(
    "does not stop between logical ticks when the %sx timer arrives late",
    (simulationSpeed) => {
      const path = Array.from({ length: 17 }, (_, x) => ({ x, y: 0 }));
      const tilesPerFacilityMinute = 2;
      const millisecondsPerFacilityMinute = 1_000;
      const ordinaryTickInterval =
        millisecondsPerFacilityMinute / simulationSpeed;
      const track = syncRouteMotion(undefined, {
        location: path[0],
        path,
        pathIndex: 0,
        lookaheadPathNodes: tilesPerFacilityMinute,
      })!;

      const afterLateTick = advanceRouteMotion(
        track,
        ordinaryTickInterval + 50,
        getRouteTilesPerSecond(
          tilesPerFacilityMinute,
          millisecondsPerFacilityMinute,
          simulationSpeed,
        ),
      );
      const sample = sampleRouteMotion(afterLateTick);

      expect(sample.moving).toBe(true);
      expect(sample.location.x).toBeGreaterThan(
        tilesPerFacilityMinute,
      );
    },
  );

  it("does not move when paused or while Build Mode supplies zero delta", () => {
    const path = Array.from({ length: 9 }, (_, x) => ({ x, y: 0 }));
    const track = syncRouteMotion(undefined, {
      location: path[0],
      path,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;

    const frozen = advanceRouteMotion(track, 0, 8);
    expect(frozen.progress).toBe(track.progress);
    expect(sampleRouteMotion(frozen).location).toEqual(path[0]);
  });

  it("changing speed without elapsed time never repositions a character", () => {
    const path = Array.from({ length: 9 }, (_, x) => ({ x, y: 1 }));
    const track = syncRouteMotion(undefined, {
      location: path[2],
      path,
      pathIndex: 2,
      lookaheadPathNodes: 6,
    })!;
    const before = sampleRouteMotion(track).location;

    const after = advanceRouteMotion(
      track,
      0,
      getRouteTilesPerSecond(2, 1_000, 4),
    );
    expect(sampleRouteMotion(after).location).toEqual(before);
  });

  it("compacts consumed route history during a long continuous walk", () => {
    const path = Array.from({ length: 101 }, (_, x) => ({ x, y: 3 }));
    let track = syncRouteMotion(undefined, {
      location: path[0],
      path,
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;

    for (let logicalIndex = 0; logicalIndex <= 40; logicalIndex += 2) {
      track = syncRouteMotion(track, {
        location: path[logicalIndex],
        path,
        pathIndex: logicalIndex,
        lookaheadPathNodes: 2,
      })!;
      track = advanceRouteMotion(track, 1_000, 2);
    }

    expect(sampleRouteMotion(track).location).toEqual({ x: 42, y: 3 });
    expect(track.path[0]!.x).toBeGreaterThan(30);
    expect(track.path.length).toBeLessThan(70);
    expect(track.progress).toBeLessThan(3);

    const handoff = syncRouteMotion(track, {
      location: { x: 42, y: 3 },
      path: [
        { x: 42, y: 3 },
        { x: 42, y: 4 },
        { x: 42, y: 5 },
      ],
      pathIndex: 0,
      lookaheadPathNodes: 2,
    })!;
    expect(sampleRouteMotion(handoff).location).toEqual({ x: 42, y: 3 });
  });

  it("does not retain every completed prefix across repeated route handoffs", () => {
    let track: ReturnType<typeof syncRouteMotion>;
    let current = { x: 0, y: 0 };
    for (let index = 0; index < 100; index += 1) {
      const destination = { x: current.x === 0 ? 2 : 0, y: 0 };
      const path = [
        current,
        { x: current.x === 0 ? 1 : 1, y: 0 },
        destination,
      ];
      track = syncRouteMotion(track, {
        location: current,
        path,
        pathIndex: 0,
        lookaheadPathNodes: 2,
      });
      track = advanceRouteMotion(track!, 1_000, 2);
      current = destination;
    }

    expect(track).toBeDefined();
    expect(track!.path.length).toBeLessThanOrEqual(3);
    expect(sampleRouteMotion(track!).location).toEqual(current);
  });
  it("starts a route from a parked standstill even when it is first seen two nodes along", () => {
    const route = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
    ];
    let track = syncRouteMotion(undefined, { location: { x: 5, y: 5 } })!;
    expect(routeMotionComplete(track)).toBe(true);
    expect(sampleRouteMotion(track).location).toEqual({ x: 5, y: 5 });

    // Routes are created and advanced in the same tick.
    track = syncRouteMotion(track, {
      location: route[2],
      path: route,
      pathIndex: 2,
      lookaheadPathNodes: 2,
    })!;
    expect(sampleRouteMotion(track).location).toEqual({ x: 5, y: 5 });
    track = advanceRouteMotion(track, 100, 2);
    const first = sampleRouteMotion(track).location;
    expect(first.y).toBe(5);
    expect(first.x).toBeGreaterThan(5);
    expect(first.x).toBeLessThan(5.6);
  });

  it("parks a finished route where it ended and starts the next route there", () => {
    const inbound = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const outbound = [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    let track = syncRouteMotion(undefined, { location: inbound[0], path: inbound, pathIndex: 0, lookaheadPathNodes: 2 })!;
    track = syncRouteMotion(track, { location: inbound[2] })!;
    track = advanceRouteMotion(track, 2_000, 2);
    expect(routeMotionComplete(track)).toBe(true);
    track = parkRouteMotion(track);
    expect(sampleRouteMotion(track)).toMatchObject({ location: { x: 2, y: 0 }, moving: false });

    track = syncRouteMotion(track, { location: outbound[2], path: outbound, pathIndex: 2, lookaheadPathNodes: 2 })!;
    expect(sampleRouteMotion(track).location).toEqual({ x: 2, y: 0 });
    track = advanceRouteMotion(track, 250, 2);
    expect(sampleRouteMotion(track).location.x).toBe(2);
    expect(sampleRouteMotion(track).location.y).toBeGreaterThan(0.5);
  });

  it("drops a parked track when the actor is absent or placed elsewhere", () => {
    const parked = syncRouteMotion(undefined, { location: { x: 3, y: 3 } })!;
    expect(syncRouteMotion(parked, { location: { x: 3, y: 3 } })).toBe(parked);
    expect(syncRouteMotion(parked, {})).toBeUndefined();
    expect(syncRouteMotion(parked, { location: { x: 9, y: 9 } })).toBeUndefined();
  });

  it("catches up while trailing the logical position, capped and never past the target", () => {
    const path = Array.from({ length: 21 }, (_, x) => ({ x, y: 0 }));
    let track = syncRouteMotion(undefined, { location: path[0], path, pathIndex: 0, lookaheadPathNodes: 2 })!;
    expect(routeMotionStepTiles(track, 500, 2)).toBe(1);

    // Ten lost render frames' worth of ticks: logical is now 8 tiles ahead.
    track = syncRouteMotion(track, { location: path[8], path, pathIndex: 8, lookaheadPathNodes: 2 })!;
    expect(routeMotionStepTiles(track, 500, 2)).toBe(2.5);
    track = advanceRouteMotion(track, 500, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 2.5, y: 0 });

    // Ahead of the logical position (lookahead): canonical speed.
    const ahead = advanceRouteMotion(
      syncRouteMotion(undefined, { location: path[0], path, pathIndex: 0, lookaheadPathNodes: 2 })!,
      600,
      2,
    );
    expect(routeMotionStepTiles(ahead, 500, 2)).toBeCloseTo(1, 10);

    // Never past the predictive target.
    const near = syncRouteMotion(undefined, { location: path[19], path, pathIndex: 19, lookaheadPathNodes: 2 })!;
    expect(routeMotionStepTiles(near, 5_000, 2)).toBe(1);
  });

  it("walks back instead of snapping when a reversed route shares a point behind the lookahead render", () => {
    const toward = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ];
    const back = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ];
    let track = syncRouteMotion(undefined, { location: toward[0], path: toward, pathIndex: 0, lookaheadPathNodes: 2 })!;
    // Lookahead lets the render run ahead of the logical start.
    track = advanceRouteMotion(track, 600, 2);
    expect(sampleRouteMotion(track).location).toEqual({ x: 1.2, y: 0 });

    // The replacement starts at the old logical point and is already one tick along.
    track = syncRouteMotion(track, { location: back[2], path: back, pathIndex: 2, lookaheadPathNodes: 2 })!;
    expect(sampleRouteMotion(track).location).toEqual({ x: 1.2, y: 0 });
    let last = sampleRouteMotion(track).location;
    for (let frame = 0; frame < 120; frame += 1) {
      track = advanceRouteMotion(track, 16, 2);
      const next = sampleRouteMotion(track).location;
      expect(Math.hypot(next.x - last.x, next.y - last.y)).toBeLessThan(0.1);
      last = next;
    }
    expect(last.x).toBe(0);
    expect(last.y).toBeGreaterThan(1);
  });
});
