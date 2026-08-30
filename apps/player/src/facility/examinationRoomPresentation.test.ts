import { describe, expect, it } from "vitest";

import {
  EXAMINATION_ROOM_PRESENTATIONS,
  getExaminationRoomPresentation,
} from "./examinationRoomPresentation";

describe("Examination Room presentation", () => {
  it("keeps separate north-up art packages for horizontal and vertical footprints", () => {
    expect(getExaminationRoomPresentation(0).atlasId).not.toBe(
      getExaminationRoomPresentation(90).atlasId,
    );
    expect(EXAMINATION_ROOM_PRESENTATIONS[0].floor.width / EXAMINATION_ROOM_PRESENTATIONS[0].floor.height)
      .toBeCloseTo(3 / 2, 1);
    expect(EXAMINATION_ROOM_PRESENTATIONS[90].floor.width / EXAMINATION_ROOM_PRESENTATIONS[90].floor.height)
      .toBeCloseTo(2 / 3, 1);
  });

  it("keeps every required fixture independent and leaves optional chart art only on the wide north wall", () => {
    expect(EXAMINATION_ROOM_PRESENTATIONS[0].fixtures.map((fixture) => fixture.id)).toEqual(
      expect.arrayContaining(["examTable", "sinkCabinet", "rollingStool", "wasteBin", "diagnosticPanel", "gloveDispenser", "wallChart"]),
    );
    expect(EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.map((fixture) => fixture.id)).toEqual(
      expect.arrayContaining(["examTable", "sinkCabinet", "rollingStool", "wasteBin", "diagnosticPanel", "gloveDispenser"]),
    );
    expect(EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.some((fixture) => fixture.id === "wallChart")).toBe(false);
  });

  it("keeps every floor-contact fixture inside its Examination Room floor envelope", () => {
    for (const presentation of Object.values(EXAMINATION_ROOM_PRESENTATIONS)) {
      for (const fixture of presentation.fixtures.filter((candidate) => !candidate.wallMounted)) {
        expect(fixture.centerXRatio - fixture.widthRatio / 2).toBeGreaterThanOrEqual(0);
        expect(fixture.centerXRatio + fixture.widthRatio / 2).toBeLessThanOrEqual(1);
        expect(fixture.centerYRatio - fixture.heightRatio / 2).toBeGreaterThanOrEqual(0);
        expect(fixture.centerYRatio + fixture.heightRatio / 2).toBeLessThanOrEqual(1);
      }
    }
  });
});
