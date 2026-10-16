import { describe, expect, it } from "vitest";
import {
  CHARACTER_WALK_CADENCE_MS,
  CHARACTER_WALK_FRAME_COUNT,
  characterWalkFrameAt,
  getAllCharacterWalkEntries,
  getCharacterWalkEntry,
  getCharacterWalkFrame,
} from "./characterWalkRegistry";

describe("GS-026 simple cardinal walk registry", () => {
  it("opts in the five authorized identities with four authored eight-frame directions", () => {
    const entries = getAllCharacterWalkEntries();
    expect(entries.map((entry) => entry.id)).toEqual([
      "patient.adult.039",
      "patient.adult.035",
      "patient.adult.043",
      "patient.adult.032",
      "retained.gray-braid",
    ]);
    expect(CHARACTER_WALK_CADENCE_MS).toBe(180);
    expect(CHARACTER_WALK_FRAME_COUNT).toBe(8);
    for (const entry of entries) for (const direction of ["south", "east", "west", "north"] as const) {
        expect(entry.directions[direction].frames).toHaveLength(8);
        const expectedUnique = entry.id === "patient.adult.035" && direction === "north" ? 7
          : entry.id === "patient.adult.043" && direction === "north" ? 6
          : entry.id === "patient.adult.043" && direction === "south" ? 7
          : entry.id === "retained.gray-braid" && direction === "north" ? 7
          : entry.id === "retained.gray-braid" && direction === "south" ? 5
          : 8;
        expect(new Set(entry.directions[direction].frames.map((frame) => frame.sha256)).size).toBe(expectedUnique);
        expect(entry.directions[direction].frames.every((frame) =>
          frame.width === 160 && frame.height === 320 &&
          frame.anchors.bodyAxisX === 80 && frame.anchors.floorY === 287
        )).toBe(true);
      }
    expect(getCharacterWalkEntry("patient.adult.035")!.directions.north.frames[6]!.sha256)
      .toBe(getCharacterWalkEntry("patient.adult.035")!.directions.north.frames[7]!.sha256);
    expect(getCharacterWalkEntry("patient.adult.043")!.directions.north.frames[4]!.sha256)
      .toBe(getCharacterWalkEntry("patient.adult.043")!.directions.north.frames[5]!.sha256);
    expect(getCharacterWalkEntry("patient.adult.043")!.directions.north.frames[6]!.sha256)
      .toBe(getCharacterWalkEntry("patient.adult.043")!.directions.north.frames[7]!.sha256);
    expect(getCharacterWalkEntry("patient.adult.043")!.directions.south.frames[6]!.sha256)
      .toBe(getCharacterWalkEntry("patient.adult.043")!.directions.south.frames[7]!.sha256);
    const braid = getCharacterWalkEntry("retained.gray-braid")!;
    expect(braid.directions.north.frames[2]!.sha256).toBe(braid.directions.north.frames[3]!.sha256);
    expect(new Set(braid.directions.south.frames.slice(4).map((frame) => frame.sha256)).size).toBe(1);
  });

  it("preserves direct owner approvals and records delegated production review separately", () => {
    const directions = getCharacterWalkEntry("patient.adult.039")!.directions;
    expect(directions.east.approvalStatus).toBe("owner-approved");
    expect(directions.west.approvalStatus).toBe("owner-approved");
    expect(directions.north.approvalStatus).toBe("owner-approved");
    expect(directions.south.approvalStatus).toBe("owner-approved");
    for (const id of ["patient.adult.035", "patient.adult.043"] as const) {
      const expanded = getCharacterWalkEntry(id)!.directions;
      expect(expanded.east.approvalStatus).toBe("owner-approved");
      expect(expanded.west.approvalStatus).toBe("owner-approved");
      expect(expanded.north.approvalStatus).toBe("owner-approved");
      expect(expanded.south.approvalStatus).toBe("owner-approved");
    }
    for (const id of ["patient.adult.032", "retained.gray-braid"] as const) {
      const expanded = getCharacterWalkEntry(id)!.directions;
      for (const direction of ["south", "east", "west", "north"] as const) {
        expect(expanded[direction].approvalStatus).toBe("production-reviewed-owner-authorized");
      }
    }
  });

  it("normalizes frame indexes and never supplies art for another identity", () => {
    expect(getCharacterWalkFrame("patient.adult.039", "south", 8)).toBe(getCharacterWalkFrame("patient.adult.039", "south", 0));
    expect(getCharacterWalkFrame("patient.adult.039", "south", -1)).toBe(getCharacterWalkFrame("patient.adult.039", "south", 7));
    expect(getCharacterWalkFrame("founder.01", "south", 0)).toBeUndefined();
  });

  it("advances one visible phase every 180 simulation milliseconds", () => {
    expect([0, 179, 180, 359, 360, 1_440].map(characterWalkFrameAt)).toEqual([0, 0, 1, 1, 2, 0]);
  });
});
