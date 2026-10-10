import { describe, expect, it } from "vitest";
import {
  advanceRouteMotion,
  getRouteTilesPerSecond,
  routeMotionComplete,
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

    track = advanceRouteMotion(track, 250, 4);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 0 });
    track = advanceRouteMotion(track, 250, 4);
    expect(sampleRouteMotion(track).location).toEqual({ x: 4, y: 1 });
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
});
