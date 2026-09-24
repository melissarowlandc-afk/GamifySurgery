import { describe, expect, it } from "vitest";

import {
  APPROVED_ROOM_PRESENTATIONS,
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomProceduralDrawRecords,
} from "./approvedRoomPresentation";
import {
  getApprovedFloorPrimitives,
  getApprovedProceduralScreenRect,
  getNearestApprovedActorSupport,
  parseApprovedCssColor,
} from "./approvedRoomRenderer";

describe("approved room renderer helpers", () => {
  it("parses every proof color form without changing opacity", () => {
    expect(parseApprovedCssColor("#789173")).toEqual({ color: 0x789173, alpha: 1 });
    expect(parseApprovedCssColor("rgba(105,78,48,.18)")).toEqual({ color: 0x694e30, alpha: .18 });
    expect(parseApprovedCssColor("rgb(1, 2, 3)")).toEqual({ color: 0x010203, alpha: 1 });
    expect(() => parseApprovedCssColor("sage")).toThrow(/Unsupported approved proof color/);
  });

  it("ports every approved floor algorithm to deterministic paint primitives", () => {
    for (const room of APPROVED_ROOM_PRESENTATIONS) {
      const [width, height] = room.orientations[0]!.footprint;
      const first = getApprovedFloorPrimitives(room.shell, width, height, [240, 360]);
      const second = getApprovedFloorPrimitives(room.shell, width, height, [240, 360]);
      expect(first, room.proofId).toEqual(second);
      expect(first[0], room.proofId).toMatchObject({
        shape: "rect",
        x: 0,
        y: 0,
        width: width * room.shell.tilePixels,
        height: height * room.shell.tilePixels,
        color: room.shell.floorBase,
      });
      expect(first.length, room.proofId).toBeGreaterThan(1);
      expect(first.every((primitive) => [primitive.x, primitive.y, primitive.width, primitive.height].every(Number.isFinite))).toBe(true);
    }
  });

  it("retains the Front Desk's 88px tiles and 44px square floor grid", () => {
    const room = APPROVED_ROOM_PRESENTATIONS.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
    const primitives = getApprovedFloorPrimitives(room.shell, 5, 4);
    expect(primitives[0]).toMatchObject({ width: 440, height: 352 });
    expect(primitives.some((primitive) => primitive.shape === "line" && primitive.x === 44)).toBe(true);
    expect(primitives.some((primitive) => primitive.shape === "line" && primitive.y === 44)).toBe(true);
  });

  it("keeps hallway texture phase tied to facility coordinates", () => {
    const hallway = APPROVED_ROOM_PRESENTATIONS.find((candidate) => candidate.roomDefinitionId === "room.hallway")!;
    const atOrigin = getApprovedFloorPrimitives(hallway.shell, 1, 1, [0, 0]);
    const oneCellEast = getApprovedFloorPrimitives(hallway.shell, 1, 1, [120, 0]);
    expect(oneCellEast).not.toEqual(atOrigin);
  });

  it("projects exact CT and Recovery procedural geometry into proof pixels", () => {
    const ct = resolveApprovedRoomProceduralDrawRecords("room.ct", 0)[0]!;
    expect(getApprovedProceduralScreenRect(ct, 120)).toEqual({ left: 322.8, top: 90, width: 14.399999999999999, height: 288 });
    const west = resolveApprovedRoomProceduralDrawRecords("room.periop_recovery", 0).find((draw) => draw.id === "partitionW")!;
    expect(getApprovedProceduralScreenRect(west, 120)).toEqual({ left: 0, top: 325, width: 186, height: 29 });
  });

  it("selects the closest authored support without changing the logical actor cell", () => {
    const supports = resolveApprovedRoomActorSupports("room.waiting", 0);
    const target = supports[0]!;
    expect(getNearestApprovedActorSupport(supports, {
      x: Math.floor(target.seat.x),
      y: Math.floor(target.seat.y),
    })).toBeDefined();
    expect(getNearestApprovedActorSupport([], { x: 0, y: 0 })).toBeUndefined();
  });
});
