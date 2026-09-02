import { describe, expect, it } from "vitest";

import { getDoorPresentationOpenings, getDoorPresentationRun } from "./doorPresentation";

const source = { instanceId: "front-desk", tileX: 10, tileY: 10, width: 5, height: 4 };
const door = (offset: number) => ({ instanceId: `door-${offset}`, roomInstanceId: source.instanceId, side: "north" as const, offset });

describe("door presentation runs", () => {
  it("merges consecutive source-wall doors only when they enter the same destination room", () => {
    const doors = [door(1), door(2)];
    const rooms = [source, { instanceId: "waiting", tileX: 10, tileY: 9, width: 5, height: 1 }];
    expect(getDoorPresentationRun(doors[0]!, doors, rooms)).toEqual({
      startOffset: 1, endOffset: 2, destinationRoomInstanceId: "waiting",
    });
  });

  it("keeps consecutive source-wall doors separate when their outside cells enter different destinations", () => {
    const doors = [door(1), door(2)];
    const rooms = [
      source,
      { instanceId: "north-left", tileX: 11, tileY: 9, width: 1, height: 1 },
      { instanceId: "north-right", tileX: 12, tileY: 9, width: 1, height: 1 },
    ];
    expect(getDoorPresentationRun(doors[0]!, doors, rooms)).toEqual({
      startOffset: 1, endOffset: 1, destinationRoomInstanceId: "north-left",
    });
    expect(getDoorPresentationRun(doors[1]!, doors, rooms)).toEqual({
      startOffset: 2, endOffset: 2, destinationRoomInstanceId: "north-right",
    });
  });

  it("uses the same destination identity rule for consecutive east-wall door rows", () => {
    const eastSource = { instanceId: "exam", tileX: 20, tileY: 20, width: 3, height: 2 };
    const eastDoors = [
      { instanceId: "east-0", roomInstanceId: eastSource.instanceId, side: "east" as const, offset: 0 },
      { instanceId: "east-1", roomInstanceId: eastSource.instanceId, side: "east" as const, offset: 1 },
    ];
    expect(getDoorPresentationRun(eastDoors[0]!, eastDoors, [
      eastSource,
      { instanceId: "hall", tileX: 23, tileY: 20, width: 1, height: 2 },
    ])).toEqual({ startOffset: 0, endOffset: 1, destinationRoomInstanceId: "hall" });
    expect(getDoorPresentationRun(eastDoors[0]!, eastDoors, [
      eastSource,
      { instanceId: "hall-a", tileX: 23, tileY: 20, width: 1, height: 1 },
      { instanceId: "hall-b", tileX: 23, tileY: 21, width: 1, height: 1 },
    ])).toEqual({ startOffset: 0, endOffset: 0, destinationRoomInstanceId: "hall-a" });
  });
});

describe("reciprocal door presentation openings", () => {
  const target = { instanceId: "target", tileX: 13, tileY: 8, width: 4, height: 3 };

  it("maps north and south source doors to reciprocal south and north target slots", () => {
    const northSource = { instanceId: "north-source", tileX: 14, tileY: 7, width: 1, height: 1 };
    const southSource = { instanceId: "south-source", tileX: 15, tileY: 11, width: 1, height: 1 };
    const doors = [
      { instanceId: "north", roomInstanceId: northSource.instanceId, side: "south" as const, offset: 0 },
      { instanceId: "south", roomInstanceId: southSource.instanceId, side: "north" as const, offset: 0 },
    ];
    expect(getDoorPresentationOpenings(target, doors, [target, northSource, southSource]))
      .toEqual([{ side: "north", offset: 1 }, { side: "south", offset: 2 }]);
  });

  it("maps east and west source doors to reciprocal west and east target slots", () => {
    const westSource = { instanceId: "west-source", tileX: 12, tileY: 9, width: 1, height: 1 };
    const eastSource = { instanceId: "east-source", tileX: 17, tileY: 10, width: 1, height: 1 };
    const doors = [
      { instanceId: "west", roomInstanceId: westSource.instanceId, side: "east" as const, offset: 0 },
      { instanceId: "east", roomInstanceId: eastSource.instanceId, side: "west" as const, offset: 0 },
    ];
    expect(getDoorPresentationOpenings(target, doors, [target, westSource, eastSource]))
      .toEqual([{ side: "west", offset: 1 }, { side: "east", offset: 2 }]);
  });

  it("dedupes direct and reciprocal openings, excludes exterior doors, and uses projected dimensions", () => {
    const rotatedSource = { instanceId: "rotated-source", tileX: 10, tileY: 20, width: 3, height: 2 };
    const rotatedTarget = { instanceId: "rotated-target", tileX: 13, tileY: 20, width: 2, height: 3 };
    const doors = [
      { instanceId: "source", roomInstanceId: rotatedSource.instanceId, side: "east" as const, offset: 1 },
      { instanceId: "direct", roomInstanceId: rotatedTarget.instanceId, side: "west" as const, offset: 1 },
      { instanceId: "exterior", roomInstanceId: rotatedSource.instanceId, side: "south" as const, offset: 0, exterior: true },
    ];
    expect(getDoorPresentationOpenings(rotatedTarget, doors, [rotatedSource, rotatedTarget]))
      .toEqual([{ side: "west", offset: 1 }]);
  });
});
