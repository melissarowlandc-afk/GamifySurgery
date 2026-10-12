import { describe, expect, it } from "vitest";

import {
  APPROVED_ROOM_PRESENTATIONS,
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomDrawRecords,
  resolveApprovedRoomProceduralDrawRecords,
} from "./approvedRoomPresentation";
import {
  getApprovedFloorPrimitives,
  getApprovedDrawPainterGround,
  getApprovedProceduralScreenRect,
  getApprovedSupportFacing,
  getApprovedSupportPainterGround,
  getApprovedRoomStateVariant,
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
    expect([[1, 0], [2, 0], [0, 1], [3, 1]].map(([x, y]) =>
      getNearestApprovedActorSupport(supports, { x: x!, y: y! })?.id
    )).toEqual(["bench:seat-1", "bench:seat-2", "leftChair:seat-1", "rightChair:seat-1"]);
    const rotated = resolveApprovedRoomActorSupports("room.waiting", 270);
    expect([[0, 2], [0, 1], [1, 3], [1, 0]].map(([x, y]) =>
      getNearestApprovedActorSupport(rotated, { x: x!, y: y! })?.id
    )).toEqual(["bench:seat-1", "bench:seat-2", "leftChair:seat-1", "rightChair:seat-1"]);
  });

  it("filters semantic roles and converts all cardinal furniture facings", () => {
    const supports = resolveApprovedRoomActorSupports("room.examination", 0);
    expect(getNearestApprovedActorSupport(supports, { x: 1, y: 1 }, "examination-clinician")?.role).toBe("examination-clinician");
    expect(getNearestApprovedActorSupport(supports, { x: 1, y: 1 }, "ct-operator")).toBeUndefined();
    expect(getApprovedSupportFacing("north")).toEqual({ direction: "back", rightFacing: false });
    expect(getApprovedSupportFacing("south")).toEqual({ direction: "front", rightFacing: false });
    expect(getApprovedSupportFacing("east")).toEqual({ direction: "side", rightFacing: true });
    expect(getApprovedSupportFacing("west")).toEqual({ direction: "side", rightFacing: false });
  });

  it("uses an exact requested support instead of falling through to another Peri-op bed", () => {
    const beds = resolveApprovedRoomActorSupports("room.periop_recovery", 0);
    // N3's logical cell is closer to WC's fixture baseline, so nearest-only
    // selection would visibly put the patient in the wrong bay.
    expect(getNearestApprovedActorSupport(beds, { x: 2, y: 2 }, "periop-bed-patient")?.id).toBe("periop-bed:WC");
    expect(getNearestApprovedActorSupport(beds, { x: 2, y: 2 }, "periop-bed-patient", "periop-bed:N3")?.id).toBe("periop-bed:N3");
    expect(getNearestApprovedActorSupport(beds, { x: 2, y: 2 }, "periop-bed-patient", "periop-bed:unknown")).toBeUndefined();
  });

  it("floors only seated actor depth at the owning fixture baseline", () => {
    const waiting = resolveApprovedRoomActorSupports("room.waiting", 270);
    const upperBench = waiting.find((support) => support.id === "bench:seat-2")!;
    const lowerBench = waiting.find((support) => support.id === "bench:seat-1")!;
    expect(upperBench.ground.y).toBeCloseTo(1.55);
    expect(upperBench.fixtureGround.y).toBe(2);
    expect(getApprovedSupportPainterGround(upperBench).y).toBe(2);
    expect(getApprovedSupportPainterGround(lowerBench).y).toBeCloseTo(2.45);
    expect(getApprovedSupportPainterGround(waiting.find((support) => support.id === "leftChair:seat-1")!).y).toBe(3.3);

    const exam270 = resolveApprovedRoomActorSupports("room.examination", 270);
    const clinician = exam270.find((support) => support.role === "examination-clinician")!;
    expect(clinician.ground.y).toBeCloseTo(2.22);
    expect(clinician.fixtureGround.y).toBeCloseTo(2.47);
    expect(getApprovedSupportPainterGround(clinician).y).toBeCloseTo(2.47);

    const telehealthWest = resolveApprovedRoomActorSupports("room.glp1_telehealth_suite", 270);
    const northNp = telehealthWest.find((support) => support.role === "glp1-np-station-1")!;
    const southNp = telehealthWest.find((support) => support.role === "glp1-np-station-2")!;
    expect(getApprovedSupportPainterGround(northNp).y).toBeCloseTo(northNp.ground.y);
    expect(getApprovedSupportPainterGround(southNp).y).toBeGreaterThan(southNp.ground.y);

    const ctOperator = resolveApprovedRoomActorSupports("room.ct", 0).find((support) => support.role === "ct-operator")!;
    expect(getApprovedSupportPainterGround({ ...ctOperator, fixtureGround: { x: 3.35, y: 3.5 } })).toEqual(ctOperator.ground);

    for (const bed of resolveApprovedRoomActorSupports("room.periop_recovery", 0)) {
      expect(getApprovedSupportPainterGround(bed)).toEqual(bed.fixtureGround);
    }
  });

  it("selects occupied presentation only for rooms with an approved covered-patient proof", () => {
    expect(getApprovedRoomStateVariant("room.ambulatory_or", true, false)).toBe("occupiedCovered");
    expect(getApprovedRoomStateVariant("room.endoscopy", true, false)).toBe("occupiedCovered");
    expect(getApprovedRoomStateVariant("room.front_desk", false, true)).toBe("emptyWater");
    expect(getApprovedRoomStateVariant("room.laboratory", true, true)).toBeUndefined();
  });

  it("preserves the approved OR table, light, and live-character painter order", () => {
    const empty = resolveApprovedRoomDrawRecords("room.ambulatory_or", 0);
    const occupied = resolveApprovedRoomDrawRecords("room.ambulatory_or", 0, "occupiedCovered");
    for (const records of [empty, occupied]) {
      expect(getApprovedDrawPainterGround(records.find((draw) => draw.id === "table")!)).toBe(2.58);
      expect(getApprovedDrawPainterGround(records.find((draw) => draw.id === "lights")!)).toBe(2.59);
      expect(resolveApprovedRoomActorSupports("room.ambulatory_or", 0).map((support) =>
        getApprovedSupportPainterGround(support).y
      )).toEqual([2.6, 3.05, 2.6, 3.05]);
    }
  });

  it("ports the Level 3 proof floor phases and fixed procedural details", () => {
    const byId = (id: string) => APPROVED_ROOM_PRESENTATIONS.find((room) => room.roomDefinitionId === id)!;
    const operatingRoom = getApprovedFloorPrimitives(byId("room.ambulatory_or").shell, 4, 4, [60, 130]);
    expect(operatingRoom[0]).toMatchObject({ color: "#69757a", width: 480, height: 480 });
    expect(operatingRoom).toContainEqual(expect.objectContaining({ shape: "line", x: 24, y: 0, color: "#1d272e", alpha: .24 }));

    const workshop = getApprovedFloorPrimitives(byId("room.maintenance_workshop").shell, 3, 3, [60, 130]);
    expect(workshop[0]).toMatchObject({ color: "#aaa9a2", width: 360, height: 360 });
    expect(workshop).toContainEqual(expect.objectContaining({ shape: "line", x: 198, y: 0, height: 360 }));
    expect(workshop).toContainEqual(expect.objectContaining({ shape: "line", x: 0, y: 252, width: 360 }));

    const breakRoom = getApprovedFloorPrimitives(byId("room.staff_break").shell, 4, 4, [60, 130]);
    expect(breakRoom).toContainEqual(expect.objectContaining({ shape: "rect", x: 30, y: 156, width: 198, height: 240, color: "#a85f4e" }));

    const vending = getApprovedFloorPrimitives(byId("room.vending").shell, 2, 2, [150, 150]);
    expect(vending[0]).toMatchObject({ color: "#d9c1a5", width: 240, height: 240 });
    expect(vending.some((primitive) => primitive.shape === "ellipse" && primitive.x === 0 && primitive.y === 0)).toBe(true);
  });

});
