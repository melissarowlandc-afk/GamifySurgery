import { describe, expect, it } from "vitest";

import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedDrawPainterGround } from "./approvedRoomRenderer";
import {
  APPROVED_SIDE_CHAIR_MASKS,
  getApprovedSideChairForegroundDepth,
  getApprovedSideChairMaskForDraw,
  partitionApprovedSideChairPixels,
} from "./approvedSideChairLayers";

describe("approved furniture foreground layers", () => {
  it("binds every armrest, back and non-south bed band to its exact crop and seat", () => {
    expect(new Set(APPROVED_SIDE_CHAIR_MASKS.map((mask) => mask.id)).size).toBe(APPROVED_SIDE_CHAIR_MASKS.length);
    for (const mask of APPROVED_SIDE_CHAIR_MASKS) {
      const roomDraws = resolveApprovedRoomDrawRecords(mask.roomDefinitionId, mask.orientation);
      const draw = roomDraws
        .find((candidate) => candidate.id === mask.drawId)!;
      expect(getApprovedSideChairMaskForDraw(mask.roomDefinitionId, mask.orientation, draw)?.id).toBe(mask.id);
      expect(getApprovedSideChairMaskForDraw(mask.roomDefinitionId, mask.orientation, {
        ...draw,
        sourceRect: [draw.sourceRect[0] + 1, ...draw.sourceRect.slice(1)],
      })).toBeUndefined();
      for (const supportId of mask.supportIds) {
        const support = resolveApprovedRoomActorSupports(mask.roomDefinitionId, mask.orientation)
          .find((candidate) => candidate.id === supportId)!;
        expect(support.sideChairLayer).toEqual({ drawId: mask.drawId, maskId: mask.id });
        const actualDrawGround = getApprovedDrawPainterGround(draw);
        expect(support.fixtureGround.y).toBeGreaterThanOrEqual(actualDrawGround);
      }
    }
  });

  it("leaves armless stools/chairs and south-facing beds unsplit", () => {
    expect(resolveApprovedRoomActorSupports("room.phlebotomy", 270)
      .find((support) => support.id === "stool:clinician")?.sideChairLayer).toBeUndefined();
    expect(resolveApprovedRoomActorSupports("room.staff_break", 0)
      .every((support) => support.sideChairLayer === undefined)).toBe(true);
    expect(resolveApprovedRoomActorSupports("room.periop_recovery", 0)
      .filter((support) => support.facing === "south")
      .every((support) => support.sideChairLayer === undefined)).toBe(true);
  });

  it("partitions every source pixel into exactly one complementary layer", () => {
    for (const mask of APPROVED_SIDE_CHAIR_MASKS) {
      const width = mask.sourceRect[2];
      const height = mask.sourceRect[3];
      const rear = new Uint8ClampedArray(width * height * 4).fill(255);
      const foreground = new Uint8ClampedArray(rear);
      partitionApprovedSideChairPixels(rear, foreground, width, height, mask.southArmPolygon, mask.additionalForegroundPolygons);
      let foregroundPixels = 0;
      let invalidAlphaPartitions = 0;
      for (let offset = 3; offset < rear.length; offset += 4) {
        if (rear[offset]! + foreground[offset]! !== 255) invalidAlphaPartitions += 1;
        if (foreground[offset] !== 0) foregroundPixels += 1;
      }
      expect(invalidAlphaPartitions).toBe(0);
      expect(foregroundPixels).toBeGreaterThan(100);
      expect(foregroundPixels).toBeLessThan(width * height);
    }
    const rear = new Uint8ClampedArray([
      10, 20, 30, 17,
      40, 50, 60, 128,
    ]);
    const foreground = new Uint8ClampedArray(rear);
    partitionApprovedSideChairPixels(rear, foreground, 2, 1, [[0, 0], [1, 0], [1, 1], [0, 1]]);
    expect([...rear]).toEqual([10, 20, 30, 0, 40, 50, 60, 128]);
    expect([...foreground]).toEqual([10, 20, 30, 17, 40, 50, 60, 0]);
  });

  it("keeps each recovery bed's leg band below its seat and clear of its monitor", () => {
    const supports = resolveApprovedRoomActorSupports("room.periop_recovery", 0);
    const draws = resolveApprovedRoomDrawRecords("room.periop_recovery", 0);
    const recoveryMasks = APPROVED_SIDE_CHAIR_MASKS.filter((mask) => mask.roomDefinitionId === "room.periop_recovery");
    expect(recoveryMasks).toHaveLength(6);
    for (const mask of recoveryMasks) {
      const bed = draws.find((draw) => draw.id === mask.drawId)!;
      const bedId = mask.drawId.replace(".bed", "");
      const monitor = draws.find((draw) => draw.id === `${bedId}.monitor`)!;
      const seat = supports.find((support) => support.id === mask.supportIds[0])!.seat;
      // Convert the band's source-pixel bounds into room tiles.
      const tilesPerSourceX = bed.renderSizeTiles[0] / bed.sourceRect[2];
      const tilesPerSourceY = bed.renderSizeTiles[1] / bed.sourceRect[3];
      const xs = mask.southArmPolygon.map(([x]) => bed.destinationTopLeftTiles[0] + x * tilesPerSourceX);
      const ys = mask.southArmPolygon.map(([, y]) => bed.destinationTopLeftTiles[1] + y * tilesPerSourceY);
      const band = { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
      // The seat itself stays above the band; the band starts just under it.
      expect(band.top).toBeGreaterThan(seat.y);
      expect(band.top - seat.y).toBeLessThan(.05);
      expect(seat.x).toBeGreaterThan(band.left);
      expect(seat.x).toBeLessThan(band.right);
      const monitorRect = {
        left: monitor.destinationTopLeftTiles[0],
        right: monitor.destinationTopLeftTiles[0] + monitor.renderSizeTiles[0],
        top: monitor.destinationTopLeftTiles[1],
        bottom: monitor.destinationTopLeftTiles[1] + monitor.renderSizeTiles[1],
      };
      const overlaps = band.left < monitorRect.right && monitorRect.left < band.right &&
        band.top < monitorRect.bottom && monitorRect.top < band.bottom;
      expect(overlaps).toBe(false);
    }
  });

  it("places a foreground fractionally above the deepest current owner only", () => {
    expect(getApprovedSideChairForegroundDepth([])).toBeUndefined();
    expect(getApprovedSideChairForegroundDepth([100_128, 100_171])).toBe(100_171.5);
    expect(getApprovedSideChairForegroundDepth([Number.NaN, 100_191])).toBe(100_191.5);
  });
});
