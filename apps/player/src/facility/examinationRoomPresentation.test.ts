import { describe, expect, it } from "vitest";
import { LEVEL_ONE_BITMAP_FIXTURE_FRAMES } from "../art/bitmapAssetManifest";
import { getFixturePresentationSize } from "./fixturePresentation";

import {
  EXAMINATION_ROOM_PRESENTATIONS,
  getExaminationRoomPresentation,
  isExaminationNorthWallFixtureBacked,
  isExaminationNorthWallFixtureVisible,
} from "./examinationRoomPresentation";

describe("Examination Room presentation", () => {
  it("keeps separate authored north-up v3 compositions for both footprints", () => {
    expect(getExaminationRoomPresentation(0)).not.toBe(getExaminationRoomPresentation(90));
    expect(EXAMINATION_ROOM_PRESENTATIONS[0].version).toBe(3);
    expect(EXAMINATION_ROOM_PRESENTATIONS[90].version).toBe(3);
  });

  it("maps both unchanged logical footprints to the exact display-only visual cells", () => {
    const horizontal = EXAMINATION_ROOM_PRESENTATIONS[0].fixtures;
    const vertical = EXAMINATION_ROOM_PRESENTATIONS[90].fixtures;
    expect(horizontal.find((fixture) => fixture.id === "sinkCabinet")).toMatchObject({ centerXRatio: 0.125, centerYRatio: 0.25 });
    expect(horizontal.find((fixture) => fixture.id === "rollingStool")).toMatchObject({ centerXRatio: 0.375, centerYRatio: 0.75 });
    expect(horizontal.find((fixture) => fixture.id === "examTable")).toMatchObject({ centerXRatio: 0.75, centerYRatio: 0.75, footDirection: "left", rotationDegrees: 90 });
    expect(vertical.find((fixture) => fixture.id === "sinkCabinet")).toMatchObject({ centerXRatio: 0.75, centerYRatio: 0.125 });
    expect(vertical.find((fixture) => fixture.id === "rollingStool")).toMatchObject({ centerXRatio: 0.25, centerYRatio: 0.375 });
    expect(vertical.find((fixture) => fixture.id === "examTable")).toMatchObject({ centerXRatio: 0.25, centerYRatio: 0.75, footDirection: "north", rotationDegrees: 180 });
  });

  it("removes named clutter while keeping subordinate utilities in the sink cell", () => {
    for (const presentation of Object.values(EXAMINATION_ROOM_PRESENTATIONS)) {
      const ids = presentation.fixtures.map((fixture) => fixture.id);
      expect(ids).not.toContain("wallChart");
      expect(ids).not.toContain("gloveDispenser");
      expect(ids).not.toContain("examinationPhysicianScale");
      expect(ids).not.toContain("examinationPrivacyCurtain");
      const sink = presentation.fixtures.find((fixture) => fixture.id === "sinkCabinet")!;
      const bin = presentation.fixtures.find((fixture) => fixture.id === "wasteBin")!;
      expect(Math.abs(bin.centerXRatio - sink.centerXRatio)).toBeLessThan(0.16);
      expect(Math.abs(bin.centerYRatio - sink.centerYRatio)).toBeLessThan(0.5);
    }
  });

  it("uses the portrait source with rotations that produce the requested visible bed spans", () => {
    const source = LEVEL_ONE_BITMAP_FIXTURE_FRAMES.examTable!;
    expect(source.nativeHeight).toBeGreaterThan(source.nativeWidth);
    const horizontal = EXAMINATION_ROOM_PRESENTATIONS[0].fixtures.find((fixture) => fixture.id === "examTable")!;
    const vertical = EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.find((fixture) => fixture.id === "examTable")!;
    // A 90° clockwise image receives reversed pre-rotation source axes, so
    // its on-screen result spans B3+B4 horizontally.
    const horizontalSize = getFixturePresentationSize(
      source.nativeHeight, source.nativeWidth, horizontal.widthRatio, horizontal.heightRatio,
    );
    const verticalSize = getFixturePresentationSize(
      source.nativeWidth, source.nativeHeight, vertical.widthRatio, vertical.heightRatio,
    );
    expect(horizontal.rotationDegrees).toBe(90);
    expect(horizontalSize.width).toBeGreaterThan(horizontalSize.height);
    expect(vertical.rotationDegrees).toBe(180);
    expect(verticalSize.height).toBeGreaterThan(verticalSize.width);
  });

  it("binds retained diagnostic and paper-towel units to precise north-wall slots", () => {
    expect(EXAMINATION_ROOM_PRESENTATIONS[0].fixtures.find((fixture) => fixture.id === "diagnosticPanel")).toMatchObject({ wallMounted: true, northWallOffsets: [2] });
    expect(EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.find((fixture) => fixture.id === "diagnosticPanel")).toMatchObject({ wallMounted: true, northWallOffsets: [0] });
    for (const presentation of Object.values(EXAMINATION_ROOM_PRESENTATIONS)) {
      expect(presentation.fixtures.find((fixture) => fixture.id === "examinationPaperTowel")).toMatchObject({ wallMounted: true });
    }
  });

  it("suppresses wall art only when its exact north-wall slot is replaced by a door", () => {
    const horizontalDiagnostic = EXAMINATION_ROOM_PRESENTATIONS[0].fixtures.find((fixture) => fixture.id === "diagnosticPanel")!;
    const verticalDiagnostic = EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.find((fixture) => fixture.id === "diagnosticPanel")!;
    expect(isExaminationNorthWallFixtureVisible(horizontalDiagnostic, [2])).toBe(false);
    expect(isExaminationNorthWallFixtureVisible(horizontalDiagnostic, [1])).toBe(true);
    expect(isExaminationNorthWallFixtureVisible(verticalDiagnostic, [0])).toBe(false);
    expect(isExaminationNorthWallFixtureVisible(verticalDiagnostic, [1])).toBe(true);
  });

  it("suppresses Examination wall art only when one of its own slots is backed", () => {
    const horizontalDiagnostic = EXAMINATION_ROOM_PRESENTATIONS[0].fixtures.find((fixture) => fixture.id === "diagnosticPanel")!;
    const verticalDiagnostic = EXAMINATION_ROOM_PRESENTATIONS[90].fixtures.find((fixture) => fixture.id === "diagnosticPanel")!;
    expect(isExaminationNorthWallFixtureBacked(horizontalDiagnostic, [2])).toBe(true);
    expect(isExaminationNorthWallFixtureBacked(horizontalDiagnostic, [1])).toBe(false);
    expect(isExaminationNorthWallFixtureBacked(verticalDiagnostic, [0])).toBe(true);
    expect(isExaminationNorthWallFixtureBacked(verticalDiagnostic, [1])).toBe(false);
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
