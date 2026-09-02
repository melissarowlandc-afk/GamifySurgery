import { describe, expect, it } from "vitest";
import type { FacilityRoomView } from "./types";
import {
  getBackedHorizontalBoundaryRuns,
  getExposedHorizontalBoundaryRuns,
  getExposedNorthCornerReturns,
  getExposedVerticalBoundaryRuns,
  getLargestBoundaryRun,
  getOwnedVerticalBoundaryRuns,
  getOwnedHorizontalBoundaryRuns,
  getOwnedBackedNorthBoundaryRuns,
  getRearWallFaceHeight,
  isHorizontalBoundarySegmentExposed,
  isVerticalBoundarySegmentExposed,
  projectRearWallArtwork,
  projectRearWallRun,
} from "./roomCutaway";

function room(
  instanceId: string,
  tileX: number,
  tileY: number,
  width: number,
  height: number,
  kind: FacilityRoomView["kind"] = "room",
): FacilityRoomView {
  return {
    instanceId,
    definitionId: "room.examination",
    displayName: instanceId,
    tileX,
    tileY,
    width,
    height,
    kind,
    isFounderRoom: false,
  };
}

describe("room cutaway boundaries", () => {
  it("shows the complete rear wall on an exposed northern edge", () => {
    const subject = room("south", 3, 5, 4, 2);
    expect(
      getExposedHorizontalBoundaryRuns(subject, [subject], "north"),
    ).toEqual([{ offset: 0, length: 4 }]);
  });

  it("identifies backed north segments where another floor touches from the north", () => {
    const subject = room("south", 3, 5, 4, 2);
    const northern = room("north", 3, 3, 4, 2);
    expect(
      getExposedHorizontalBoundaryRuns(
        subject,
        [subject, northern],
        "north",
      ),
    ).toEqual([]);
    expect(
      getBackedHorizontalBoundaryRuns(subject, [subject, northern], "north"),
    ).toEqual([{ offset: 0, length: 4 }]);
    expect(
      getExposedHorizontalBoundaryRuns(
        northern,
        [subject, northern],
        "south",
      ),
    ).toEqual([]);
  });

  it("keeps only genuinely exterior portions of a partially covered wall", () => {
    const subject = room("south", 3, 5, 5, 2);
    const northern = room("north", 5, 3, 2, 2);
    const runs = getExposedHorizontalBoundaryRuns(
      subject,
      [subject, northern],
      "north",
    );
    expect(runs).toEqual([
      { offset: 0, length: 2 },
      { offset: 4, length: 1 },
    ]);
    expect(getLargestBoundaryRun(runs)).toEqual({
      offset: 0,
      length: 2,
    });
    expect(
      getBackedHorizontalBoundaryRuns(subject, [subject, northern], "north"),
    ).toEqual([{ offset: 2, length: 2 }]);
  });

  it("crops full-width wall artwork instead of rescaling it into an exposed run", () => {
    const floor = { x: 100, y: 80, width: 200, height: 100 };
    const fullProjection = projectRearWallArtwork(
      floor,
      [{ offset: 0, length: 5 }],
      40,
      24,
      0.5,
      0.5,
      0.8,
      0.5,
    );
    const croppedProjection = projectRearWallArtwork(
      floor,
      [
        { offset: 0, length: 2 },
        { offset: 4, length: 1 },
      ],
      40,
      24,
      0.5,
      0.5,
      0.8,
      0.5,
    );

    // The original artwork coordinate system never changes as neighboring
    // floors cover portions of the wall.
    expect(croppedProjection.bounds).toEqual(fullProjection.bounds);
    expect(croppedProjection.bounds).toEqual({
      x: 120,
      y: 62,
      width: 160,
      height: 12,
    });
    expect(croppedProjection.visibleFragments).toEqual([
      { x: 120, y: 62, width: 60, height: 12 },
      { x: 260, y: 62, width: 20, height: 12 },
    ]);
  });

  it("gives a northmost hallway the same shallow exposed rear wall geometry", () => {
    const hallway = room("hallway", 3, 5, 4, 1, "hallway");
    expect(
      getExposedHorizontalBoundaryRuns(hallway, [hallway], "north"),
    ).toEqual([{ offset: 0, length: 4 }]);

    const northernRoom = room("north", 4, 3, 2, 2);
    expect(
      getExposedHorizontalBoundaryRuns(
        hallway,
        [hallway, northernRoom],
        "north",
      ),
    ).toEqual([
      { offset: 0, length: 1 },
      { offset: 3, length: 1 },
    ]);
  });

  it("removes the shared wall between vertically adjacent room and hallway floors", () => {
    const southernRoom = room("south", 2, 5, 3, 2);
    const northernHallway = room("north-hall", 2, 4, 3, 1, "hallway");
    const rooms = [southernRoom, northernHallway];
    expect(
      getExposedHorizontalBoundaryRuns(southernRoom, rooms, "north"),
    ).toEqual([]);
    expect(
      getBackedHorizontalBoundaryRuns(southernRoom, rooms, "north"),
    ).toEqual([{ offset: 0, length: 3 }]);
    expect(
      getExposedHorizontalBoundaryRuns(northernHallway, rooms, "south"),
    ).toEqual([]);
  });

  it("draws side-wall runs only where the vertical edge is exterior", () => {
    const subject = room("subject", 3, 5, 3, 3);
    const westMiddleNeighbor = room("west-middle", 1, 6, 2, 1);

    expect(
      getExposedVerticalBoundaryRuns(
        subject,
        [subject, westMiddleNeighbor],
        "west",
      ),
    ).toEqual([
      { offset: 0, length: 1 },
      { offset: 2, length: 1 },
    ]);
    expect(
      getExposedVerticalBoundaryRuns(
        subject,
        [subject, westMiddleNeighbor],
        "east",
      ),
    ).toEqual([{ offset: 0, length: 3 }]);
  });

  it("gives closed vertical partitions one east-side owner and cuts exact door slots", () => {
    const left = room("left", 3, 5, 2, 3);
    const right = room("right", 5, 5, 2, 3);
    const rooms = [left, right];
    expect(getOwnedVerticalBoundaryRuns(left, rooms, "east", [{ side: "east", offset: 1 }]))
      .toEqual([{ offset: 0, length: 1 }, { offset: 2, length: 1 }]);
    expect(getOwnedVerticalBoundaryRuns(right, rooms, "west", []))
      .toEqual([]);
  });

  it("leaves hallway-to-hallway vertical circulation open while retaining room-hall partitions", () => {
    const hallLeft = room("hall-left", 0, 0, 1, 2, "hallway");
    const hallRight = room("hall-right", 1, 0, 1, 2, "hallway");
    expect(getOwnedVerticalBoundaryRuns(hallLeft, [hallLeft, hallRight], "east")).toEqual([]);
    const clinical = room("clinical", 0, 0, 1, 2);
    expect(getOwnedVerticalBoundaryRuns(clinical, [clinical, hallRight], "east"))
      .toEqual([{ offset: 0, length: 2 }]);
  });

  it("makes the south space the only owner of a shared horizontal wall", () => {
    const north = room("north", 0, 0, 3, 2);
    const south = room("south", 0, 2, 3, 2);
    const rooms = [north, south];
    expect(getOwnedHorizontalBoundaryRuns(north, rooms, "south")).toEqual([]);
    expect(getOwnedBackedNorthBoundaryRuns(south, rooms)).toEqual([{ offset: 0, length: 3 }]);
    expect(getOwnedBackedNorthBoundaryRuns(south, rooms, [{ side: "north", offset: 1 }]))
      .toEqual([{ offset: 0, length: 1 }, { offset: 2, length: 1 }]);
  });

  it("keeps a hallway south of a room as the short-wall owner but opens hall-to-hall", () => {
    const north = room("north", 0, 0, 2, 1);
    const southHall = room("south-hall", 0, 1, 2, 1, "hallway");
    expect(getOwnedBackedNorthBoundaryRuns(southHall, [north, southHall]))
      .toEqual([{ offset: 0, length: 2 }]);
    const northHall = room("north-hall", 0, 0, 2, 1, "hallway");
    expect(getOwnedBackedNorthBoundaryRuns(southHall, [northHall, southHall])).toEqual([]);
  });

  it("adds short side returns only at genuinely exposed north corners", () => {
    const subject = room("subject", 3, 5, 4, 2);
    expect(getExposedNorthCornerReturns(subject, [subject])).toEqual([
      { side: "west", northOffset: 0 },
      { side: "east", northOffset: 3 },
    ]);

    const westNeighbor = room("west", 1, 5, 2, 1);
    expect(
      isVerticalBoundarySegmentExposed(
        subject,
        [subject, westNeighbor],
        "west",
        0,
      ),
    ).toBe(false);
    expect(
      getExposedNorthCornerReturns(subject, [subject, westNeighbor]),
    ).toEqual([{ side: "east", northOffset: 3 }]);

    const northEastNeighbor = room("north-east", 6, 3, 1, 2);
    expect(
      getExposedNorthCornerReturns(subject, [
        subject,
        northEastNeighbor,
      ]),
    ).toEqual([{ side: "west", northOffset: 0 }]);
  });

  it("does not remove a wall for a diagonal corner touch", () => {
    const subject = room("south", 3, 5, 3, 2);
    const diagonal = room("diagonal", 6, 3, 2, 2);
    expect(
      isHorizontalBoundarySegmentExposed(
        subject,
        [subject, diagonal],
        "north",
        2,
      ),
    ).toBe(true);
  });

  it("projects the bonus rear wall outside the fixed floor footprint", () => {
    const floor = { x: 100, y: 80, width: 160, height: 100 };
    const projection = projectRearWallRun(
      floor,
      { offset: 1, length: 2 },
      40,
      28,
      6,
    );
    expect(projection.face).toEqual({
      x: 140,
      y: 52,
      width: 80,
      height: 28,
    });
    expect(projection.cap).toEqual({
      x: 140,
      y: 46,
      width: 80,
      height: 6,
    });
    expect(projection.groundY).toBe(floor.y);
    expect(projection.face.y + projection.face.height).toBe(floor.y);
  });

  it("uses the Front Desk-derived wall face regardless of footprint depth", () => {
    const atForty = getRearWallFaceHeight(100, 40);
    expect(getRearWallFaceHeight(200, 40)).toBe(atForty);
    expect(getRearWallFaceHeight(20, 40)).toBe(atForty);
    expect(getRearWallFaceHeight(100, 10)).toBeGreaterThan(0);
  });
});
