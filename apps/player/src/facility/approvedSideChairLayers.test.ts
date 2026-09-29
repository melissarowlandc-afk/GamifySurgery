import { describe, expect, it } from "vitest";

import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import {
  APPROVED_SIDE_CHAIR_MASKS,
  getApprovedSideChairForegroundDepth,
  getApprovedSideChairMaskForDraw,
  partitionApprovedSideChairPixels,
} from "./approvedSideChairLayers";

describe("approved east/west side-chair layers", () => {
  it("binds all six exact source crops to seven supported seats", () => {
    expect(APPROVED_SIDE_CHAIR_MASKS.map(({ roomDefinitionId, orientation, drawId, supportIds }) => ({
      roomDefinitionId,
      orientation,
      drawId,
      supportIds,
    }))).toEqual([
      { roomDefinitionId: "room.waiting", orientation: 0, drawId: "draws.leftChair", supportIds: ["leftChair:seat-1"] },
      { roomDefinitionId: "room.waiting", orientation: 0, drawId: "draws.rightChair", supportIds: ["rightChair:seat-1"] },
      { roomDefinitionId: "room.waiting", orientation: 270, drawId: "draws.bench", supportIds: ["bench:seat-1", "bench:seat-2"] },
      { roomDefinitionId: "room.phlebotomy", orientation: 270, drawId: "chair", supportIds: ["chair:patient"] },
      { roomDefinitionId: "room.glp1_telehealth_suite", orientation: 0, drawId: "chair1", supportIds: ["telehealth:leftSeat"] },
      { roomDefinitionId: "room.glp1_telehealth_suite", orientation: 0, drawId: "chair2", supportIds: ["telehealth:rightSeat"] },
    ]);
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
        const actualDrawGround = draw.worldLocalGround?.[1] ??
          draw.destinationTopLeftTiles[1] + draw.renderSizeTiles[1];
        expect(support.fixtureGround.y).toBeGreaterThanOrEqual(actualDrawGround);
      }
    }
  });

  it("leaves north/south seats and armless east/west stools unsplit", () => {
    expect(resolveApprovedRoomActorSupports("room.waiting", 270)
      .filter((support) => support.id.startsWith("leftChair") || support.id.startsWith("rightChair"))
      .every((support) => support.sideChairLayer === undefined)).toBe(true);
    expect(resolveApprovedRoomActorSupports("room.phlebotomy", 270)
      .find((support) => support.id === "stool:clinician")?.sideChairLayer).toBeUndefined();
    expect(resolveApprovedRoomActorSupports("room.glp1_telehealth_suite", 270)
      .every((support) => support.sideChairLayer === undefined)).toBe(true);
  });

  it("partitions every source pixel into exactly one complementary layer", () => {
    for (const mask of APPROVED_SIDE_CHAIR_MASKS) {
      const width = mask.sourceRect[2];
      const height = mask.sourceRect[3];
      const rear = new Uint8ClampedArray(width * height * 4).fill(255);
      const foreground = new Uint8ClampedArray(rear);
      partitionApprovedSideChairPixels(rear, foreground, width, height, mask.southArmPolygon);
      let foregroundPixels = 0;
      let invalidAlphaPartitions = 0;
      for (let offset = 3; offset < rear.length; offset += 4) {
        if (rear[offset]! + foreground[offset]! !== 255) invalidAlphaPartitions += 1;
        if (foreground[offset] !== 0) foregroundPixels += 1;
      }
      expect(invalidAlphaPartitions).toBe(0);
      expect(foregroundPixels).toBeGreaterThan(100);
      expect(foregroundPixels).toBeLessThan(width * height / 3);
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

  it("places a foreground fractionally above the deepest current owner only", () => {
    expect(getApprovedSideChairForegroundDepth([])).toBeUndefined();
    expect(getApprovedSideChairForegroundDepth([100_128, 100_171])).toBe(100_171.5);
    expect(getApprovedSideChairForegroundDepth([Number.NaN, 100_191])).toBe(100_191.5);
  });
});
