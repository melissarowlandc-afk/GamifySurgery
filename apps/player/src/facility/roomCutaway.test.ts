import { describe, expect, it } from "vitest";
import type { FacilityRoomView } from "./types";
import {
  getExposedHorizontalBoundaryRuns,
  getExposedNorthCornerReturns,
  getExposedVerticalBoundaryRuns,
  getLargestBoundaryRun,
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

  it("removes the rear wall where another floor touches from the north", () => {
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

  it("keeps the rear wall shallower than the previous quarter-height treatment", () => {
    expect(getRearWallFaceHeight(100, 40)).toBe(16);
    expect(getRearWallFaceHeight(200, 40)).toBe(19);
    expect(getRearWallFaceHeight(20, 10)).toBe(6);
  });
});
