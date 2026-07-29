import { describe, expect, it } from "vitest";
import type { FacilityRoomView } from "./types";
import {
  getExposedHorizontalBoundaryRuns,
  getLargestBoundaryRun,
  isHorizontalBoundarySegmentExposed,
  projectRearWallRun,
} from "./roomCutaway";

function room(
  instanceId: string,
  tileX: number,
  tileY: number,
  width: number,
  height: number,
): FacilityRoomView {
  return {
    instanceId,
    definitionId: "room.examination",
    displayName: instanceId,
    tileX,
    tileY,
    width,
    height,
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
});
