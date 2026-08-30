import { describe, expect, it } from "vitest";
import {
  FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS,
  getSurgeryCenterArchitectureAtScale,
  SURGERY_CENTER_WALL_GEOMETRY,
} from "./surgeryCenterArchitecture";
import { EXAMINATION_ROOM_PRESENTATIONS } from "./examinationRoomPresentation";
import {
  ADVANCED_ROOM_VISUAL_IDS,
  PRIMARY_ROOM_VISUAL_IDS,
} from "./roomVisualLayout";
import { getRearWallFaceHeight } from "./roomCutaway";

describe("shared surgery-center architecture", () => {
  it("derives the normalized cutaway grammar directly from Front Desk v4 measurements", () => {
    expect(SURGERY_CENTER_WALL_GEOMETRY.sideThicknessTiles).toBeCloseTo(55 / (832 / 5), 8);
    expect(SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles).toBeCloseTo(242 / (622 / 4), 8);
    expect(SURGERY_CENTER_WALL_GEOMETRY.foregroundInsetTiles).toBeCloseTo(20 / (622 / 4), 8);
    expect(SURGERY_CENTER_WALL_GEOMETRY.foregroundOutsetTiles).toBeCloseTo(133 / (622 / 4), 8);
    expect(
      FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.foregroundInsetPixels +
        FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.foregroundOutsetPixels,
    ).toBe(153);
    expect(FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.tilesWide).toBe(5);
  });

  it("gives horizontal and vertical Examination presentations the identical Front Desk wall contract", () => {
    for (const presentation of Object.values(EXAMINATION_ROOM_PRESENTATIONS)) {
      expect(presentation.wallGeometry).toBe(SURGERY_CENTER_WALL_GEOMETRY);
    }
    expect(getSurgeryCenterArchitectureAtScale(100).northEnvelope).toBeGreaterThan(
      getSurgeryCenterArchitectureAtScale(100).foregroundOutset,
    );
  });

  it("keeps Front Desk source X and Y tile axes independent for component tiling", () => {
    const sourceTileX = FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.width / 5;
    const sourceTileY = FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.height / 4;
    expect(sourceTileX).not.toBeCloseTo(sourceTileY, 2);
    const geometry = getSurgeryCenterArchitectureAtScale(100);
    expect(geometry.foregroundInset + geometry.foregroundOutset).toBeCloseTo(
      100 * 153 / sourceTileY,
      -1,
    );
  });

  it("gives every implemented Level 0–2 room and hallway one Front Desk-derived north envelope", () => {
    const tileSize = 96;
    const geometry = getSurgeryCenterArchitectureAtScale(tileSize);
    const implementedRoomIds = [
      ...PRIMARY_ROOM_VISUAL_IDS,
      ...ADVANCED_ROOM_VISUAL_IDS,
    ];

    expect(implementedRoomIds).toContain("room.hallway");
    for (const [index, definitionId] of implementedRoomIds.entries()) {
      // Different representative depths prove that neither a footprint nor a
      // room type can change the projected north-wall height.
      const representativeDepth = (index % 4 + 1) * tileSize;
      expect(getRearWallFaceHeight(representativeDepth, tileSize)).toBe(
        geometry.northEnvelope - geometry.outerBorderY,
      );
      expect(
        getRearWallFaceHeight(representativeDepth, tileSize) +
          geometry.outerBorderY,
        definitionId,
      ).toBe(geometry.northEnvelope);
    }
  });
});
