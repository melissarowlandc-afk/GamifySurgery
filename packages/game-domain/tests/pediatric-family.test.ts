import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { APPROVED_PEDIATRIC_SUPPORT_ROUTES, APPROVED_LEVEL4_SUPPORT_NAVIGATION } from "@gamify-surgery/balance-config";
import { advancePediatricPair, commitPediatricPairPlan, deserializeGameState, planPediatricWaiting, planPediatricExam,
  pediatricPairAtReservation, pediatricRoomAtPoint, serializeGameState, startRetailPurchase, tryStartPatientBathroomTrip,
  advanceRetailOperations, reconcilePediatricFamilies, gameReducer, pediatricSupportLocation, getRoomDefinition } from "../src";
import { getRoomWaitingAnchors } from "../src/spatial";
import { createPediatricFamilyFixture } from "../../../tests/fixtures/pediatric-families";

describe("M5b pediatric families", () => {
  it("consumes the exact M2 fine routes, rather than chair-crossing grid interpolation", () => {
    for (const [name, id] of [["pediatric-exam", "room.pediatric_examination"], ["pediatric-waiting", "room.pediatric_waiting"]] as const) {
      const approved = JSON.parse(readFileSync(new URL(`../../../apps/player/src/facility/level4/${name}.json`, import.meta.url), "utf8"));
      expect(APPROVED_PEDIATRIC_SUPPORT_ROUTES[id]).toEqual(approved.approachRoutes);
    }
  });

  it("keeps both actors together at every one of the 12 exam and 16 waiting door segments", () => {
    for (const definitionId of ["room.pediatric_examination", "room.pediatric_waiting"]) {
      const fixture = createPediatricFamilyFixture(10);
      let { state } = fixture;
      const { context, family, encounter } = fixture;
      const room = state.rooms.find(row => row.roomDefinitionId === definitionId)!;
      const definition = getRoomDefinition(definitionId, context)!;
      for (let x = room.x - 1; x <= room.x + definition.width; x++) for (let y = room.y - 1; y <= room.y + definition.height; y++) {
        if (x > room.x - 1 && x < room.x + definition.width && y > room.y - 1 && y < room.y + definition.height) continue;
        if (state.rooms.some(other => { const def = getRoomDefinition(other.roomDefinitionId, context)!;
          return x >= other.x && x < other.x + def.width && y >= other.y && y < other.y + def.height; })) continue;
        state = gameReducer(state, { type: "PLACE_ROOM", operationId: `ring.${x}.${y}`, roomId: `room.ring.${x}.${y}`,
          roomDefinitionId: "room.hallway", x, y, orientation: 0 }, context);
      }
      for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < definition.width; offset++) {
        const copy = structuredClone(state);
        copy.doors = copy.doors.filter(door => door.roomId !== room.id);
        copy.doors.push({ id: `door.matrix.${side}.${offset}`, roomId: room.id, side, offset, exterior: false });
        const copiedFamily = copy.pediatricFamilies![family.id]!;
        const plan = definitionId === "room.pediatric_examination" ? planPediatricExam(copy, context, copiedFamily, copy.rooms.find(row => row.id === room.id)!)
          : planPediatricWaiting(copy, context, copiedFamily);
        expect(plan, `${definitionId} ${side} ${offset}`).toBeTruthy();
        expect(plan?.reservation?.roomInstanceId).toBe(room.id);
        for (let index = 0; index < plan!.movement.childPath.length; index++) expect(pediatricRoomAtPoint(copy, context, plan!.movement.childPath[index])?.id,
          `${definitionId} ${side} ${offset} step ${index}`).toBe(pediatricRoomAtPoint(copy, context, plan!.movement.parentPath[index])?.id);
        expect(encounter.patientAppearance.stillId).toBeTruthy();
      }
    }
  });

  it.each([9, 10, 17])("reserves age %i and an adult parent atomically and walks both lanes across doors", age => {
    const { state, context, encounter, family } = createPediatricFamilyFixture(age);
    const parent = state.retailExternalActors[0]!;
    const frozen = structuredClone([encounter.patientAppearance, parent.appearance, encounter.patientDisplayName, parent.displayName]);
    const plan = planPediatricWaiting(state, context, family)!;
    expect(plan).toBeTruthy();
    expect(family.reservation).toBeNull();
    expect(plan.reservation?.parentSeatId?.startsWith("kid")).toBe(false);
    expect(plan.reservation?.childSeatId?.startsWith("kid")).toBe(age < 10);
    const path = commitPediatricPairPlan(family, plan);
    let index = 0;
    while (index < path.length - 1) {
      const lastTick = state.facilityTick++;
      index = advancePediatricPair(state, context, family, path, index, lastTick);
      encounter.patientLocation = { ...path[index]! };
      expect(pediatricRoomAtPoint(state, context, encounter.patientLocation)?.id).toBe(pediatricRoomAtPoint(state, context, parent.location)?.id);
    }
    expect(pediatricPairAtReservation(state, family)).toBe(true);
    expect(frozen).toEqual([encounter.patientAppearance, parent.appearance, encounter.patientDisplayName, parent.displayName]);
    const examPlan = planPediatricExam(state, context, family, state.rooms.find(room => room.id === "room.peds.exam")!)!;
    expect(examPlan).toBeTruthy();
    expect(examPlan.reservation).toMatchObject({ childSeatId: "table:patient", parentSeatId: "parentChair" });
  });

  it("never schedules independent child/parent retail or bathroom movement", () => {
    const { state, context, family, encounter } = createPediatricFamilyFixture();
    expect(startRetailPurchase(state, "income.coffee", "companion", family.parentActorId, context)).toBeNull();
    expect(startRetailPurchase(state, "income.coffee", "encounter", encounter.id, context)).toBeNull();
    expect(tryStartPatientBathroomTrip(state, "encounter", encounter.id, context)).toBe(false);
    const before = structuredClone(state.retailExternalActors[0]);
    advanceRetailOperations(state, context);
    expect(state.retailExternalActors[0]).toEqual(before);
  });

  it("stalls the whole pair on access loss, retains a reload, and resumes after restoration", () => {
    const fixture = createPediatricFamilyFixture();
    let { state } = fixture;
    const { context, family, encounter } = fixture;
    const path = commitPediatricPairPlan(family, planPediatricWaiting(state, context, family)!);
    const door = state.doors.find(row => row.id === "room.peds.wait.door")!;
    state.doors = state.doors.filter(row => row.id !== door.id);
    state.facilityTick++;
    expect(advancePediatricPair(state, context, family, path, 0, 0)).toBe(0);
    expect(state.retailExternalActors[0]?.location).toEqual(encounter.patientLocation);
    state = deserializeGameState(serializeGameState(state), context);
    const restored = state.pediatricFamilies![family.id]!;
    expect(restored.movement).toEqual(family.movement);
    state.doors.push(door); state.facilityTick++;
    expect(advancePediatricPair(state, context, restored, path, 0, state.facilityTick - 1)).toBeGreaterThan(0);
  });

  it("keeps the optional M1 save fields optional and departure together", () => {
    const { state, context, family, encounter } = createPediatricFamilyFixture();
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.pediatricFamilies![family.id]!.movement).toBeUndefined();
    encounter.patientLocation = null;
    reconcilePediatricFamilies(state, context);
    expect(family.phase).toBe("departed");
    expect(state.retailExternalActors[0]).toMatchObject({ lifecycle: "departed", location: null });
  });

  it("uses another reachable waiting room before same-room standing overflow", () => {
    let { state, context, family } = createPediatricFamilyFixture(10);
    const room = state.rooms.find(row => row.id === "room.peds.wait")!;
    const occupy = (location: { x: number; y: number }) => state.retailExternalActors.push({
      ...structuredClone(state.retailExternalActors[0]!), id: `occupied.${state.retailExternalActors.length}`,
      pediatricFamilyId: undefined, location, path: [], lifecycle: "onsite" });
    for (const support of APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.roomDefinitionId]!) occupy(pediatricSupportLocation(room, support.id)!);
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: "overflow.place", roomId: "room.peds.overflow",
      roomDefinitionId: "room.pediatric_waiting", x: 23, y: 22, orientation: 0 }, context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "overflow.door", roomId: "room.peds.overflow",
      doorId: "overflow.door", side: "south", offset: 2 }, context);
    family = state.pediatricFamilies![family.id]!;
    const first = planPediatricWaiting(state, context, family)!;
    expect(first.reservation?.roomInstanceId).toBe("room.peds.overflow");
    expect(first.reservation?.parentSeatId?.startsWith("kid")).toBe(false);
    // With ordinary waiting/front-desk seats blocked, overflow remains in the
    // pediatric room and reserves two distinct standing points.
    const overflow = state.rooms.find(row => row.id === "room.peds.overflow")!;
    for (const support of APPROVED_LEVEL4_SUPPORT_NAVIGATION[overflow.roomDefinitionId]!) occupy(pediatricSupportLocation(overflow, support.id)!);
    const desk = state.rooms.find(row => row.roomDefinitionId === "room.front_desk")!;
    for (const point of getRoomWaitingAnchors(desk, getRoomDefinition(desk.roomDefinitionId, context)!)) occupy(point);
    const standing = planPediatricWaiting(state, context, family)!;
    expect(standing.reservation).toMatchObject({ childSeatId: null, parentSeatId: null });
    expect(standing.reservation?.childLocation).not.toEqual(standing.reservation?.parentLocation);
    expect(pediatricRoomAtPoint(state, context, standing.reservation?.childLocation)?.id)
      .toBe(pediatricRoomAtPoint(state, context, standing.reservation?.parentLocation)?.id);
  });

  it("blocks moving a reserved family room and reroutes the pair when it is sold", () => {
    let { state, context, encounter, family } = createPediatricFamilyFixture();
    const path = commitPediatricPairPlan(family, planPediatricWaiting(state, context, family)!);
    state.facilityTick += path.length;
    const index = advancePediatricPair(state, context, family, path, 0, 0);
    encounter.patientLocation = { ...path[index]! };
    const moved = gameReducer(state, { type: "MOVE_ROOM", operationId: "peds.move", roomId: "room.peds.wait", x: 29, y: 16 }, context);
    expect(moved.operationReceipts["peds.move"]?.status).toBe("rejected");
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "peds.sell", roomId: "room.peds.wait" }, context);
    expect(state.operationReceipts["peds.sell"]?.status).toBe("applied");
    const savedFamily = state.pediatricFamilies![family.id]!;
    expect(savedFamily.reservation?.roomInstanceId).not.toBe("room.peds.wait");
    expect(savedFamily.movement?.parentPath).toHaveLength(savedFamily.movement!.childPath.length);
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.pediatricFamilies![family.id]).toEqual(savedFamily);
  });

  it("replaces both reservations after a paused door edit hides the parent's chair", () => {
    let { state, context, family, encounter } = createPediatricFamilyFixture();
    const room = state.rooms.find(row => row.id === "room.peds.wait")!;
    const plan = planPediatricWaiting(state, context, family)!;
    plan.reservation!.parentSeatId = "olderChildChair";
    plan.reservation!.parentLocation = pediatricSupportLocation(room, "olderChildChair")!;
    family.reservation = plan.reservation;
    encounter.patientLocation = { ...plan.reservation!.childLocation };
    state.retailExternalActors[0]!.location = { ...plan.reservation!.parentLocation };
    state.doors.push({ id: "peds.hidden-chair.door", roomId: room.id, side: "west", offset: 1, exterior: false });
    reconcilePediatricFamilies(state, context);
    expect(family.reservation!.parentSeatId).not.toBe("olderChildChair");
    expect(family.movement!.parentPath).toHaveLength(family.movement!.childPath.length);
    for (let i = 0; i < 80 && state.encounters[encounter.id]!.patientMovement; i++) {
      state = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `peds.hidden-chair.tick.${i}` }, context);
      expect(pediatricRoomAtPoint(state, context, state.encounters[encounter.id]!.patientLocation)?.id)
        .toBe(pediatricRoomAtPoint(state, context, state.retailExternalActors[0]!.location)?.id);
    }
    expect(pediatricPairAtReservation(state, state.pediatricFamilies![family.id]!)).toBe(true);
    expect(deserializeGameState(serializeGameState(state), context).pediatricFamilies).toEqual(state.pediatricFamilies);
  });
});
