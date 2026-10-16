import { describe, expect, it } from "vitest";
import {
  completeExaminationRoomExperience,
  completeWaitingRoomExperience, createInitialGameState, deserializeGameState,
  gameReducer, getFacilityAccessValidation, getOperatingExpensePerFacilityHour, getRoomResaleValue,
  getRoomStaffCapacity, isProtectedCareRoomDefinitionId,
  observeWaitingRoomExperience, serializeGameState,
} from "../src";
import { bindRoomUpgradeRevenueQuote, cloneRoomUpgradeRevenueQuote, createRoomUpgradeRevenueQuote,
  getRoomUpgradeQuotedFee, normalizeRoomUpgradeRevenueQuote } from "../src/room-upgrades";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState, LEVEL_FOUR_ROOMS_QA_PLACEMENTS,
  placeLevelFourRoomsQaRooms } from "../../../tests/fixtures/level-four-rooms";

const context = createLevelFourRoomsQaContext();
const built = () => placeLevelFourRoomsQaRooms(createLevelFourRoomsQaState(context), context);

describe("M3 actual room placement, caps, upgrades and saves", () => {
  it("places all four by reducer commands, attaches working doors and reloads at the playable cap", () => {
    const state = built();
    expect(getFacilityAccessValidation(state, context).unreachableRoomIds).toEqual([]);
    for (const site of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) {
      expect(state.operationReceipts[`qa.place.${site.roomId}`]?.status).toBe("applied");
      expect(state.rooms.find((room) => room.id === site.roomId)).toMatchObject({ roomDefinitionId: site.roomDefinitionId, orientation: 0, upgradeLevel: 1 });
      expect(state.doors.find((door) => door.roomId === site.roomId)).toMatchObject({ side: "south", offset: site.doorOffset });
      const level3 = createLevelFourRoomsQaState(context);
      level3.facilityLevel = 3;
      const denied = gameReducer(level3, { type: "PLACE_ROOM", operationId: "locked", roomId: site.roomId,
        roomDefinitionId: site.roomDefinitionId, x: site.x, y: site.y }, context);
      expect(denied.operationReceipts.locked?.status).toBe("rejected");
      expect(denied.cashCents).toBe(level3.cashCents);
    }
    expect(getRoomStaffCapacity(state, "staff.imaging_technician").capacity).toBe(1);
    expect(isProtectedCareRoomDefinitionId("room.wound_ostomy")).toBe(true);
    expect(isProtectedCareRoomDefinitionId("room.pediatric_waiting")).toBe(false);
    expect(deserializeGameState(serializeGameState(state)).facilityLevel).toBe(4);
  });

  it.each(LEVEL_FOUR_ROOMS_QA_PLACEMENTS)("enforces $roomDefinitionId's instance limit without charging a rejected purchase", (site) => {
    let state = built();
    const definition = context.balanceRelease.facility.roomDefinitions.find((room) => room.id === site.roomDefinitionId)!;
    for (let index = 1; index < definition.maximumInstances!; index++) state = gameReducer(state,
      { type: "PLACE_ROOM", operationId: `copy.${index}`, roomId: `copy.${index}`,
        roomDefinitionId: site.roomDefinitionId, x: index * 5, y: 4 }, context);
    expect(state.rooms.filter((room) => room.roomDefinitionId === site.roomDefinitionId)).toHaveLength(definition.maximumInstances!);
    const denied = gameReducer(state, { type: "PLACE_ROOM", operationId: "over.cap", roomId: "over.cap",
      roomDefinitionId: site.roomDefinitionId, x: 55, y: 4 }, context);
    expect(denied.operationReceipts["over.cap"]?.status).toBe("rejected");
    expect(denied.cashCents).toBe(state.cashCents);
  });

  it("charges all four accepted purchase prices once, accounts for upkeep, reloads and resells their investment", () => {
    let state = built();
    const cash = state.cashCents;
    const baselineExpenses = getOperatingExpensePerFacilityHour(state, context);
    let spent = 0;
    for (const site of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) {
      const definition = context.balanceRelease.facility.roomDefinitions.find((room) => room.id === site.roomDefinitionId)!;
      for (let index = 0; index < 4; index++) {
        const command = { type: "UPGRADE_ROOM" as const, operationId: `upgrade.${site.roomId}.${index}`, roomId: site.roomId };
        state = gameReducer(state, command, context);
        expect(state.operationReceipts[command.operationId]?.status).toBe("applied");
        expect(gameReducer(state, command, context)).toEqual(state);
        spent += definition.upgradeCosts[index]!;
      }
      expect(state.rooms.find((room) => room.id === site.roomId)?.upgradeLevel).toBe(5);
      const denied = gameReducer(state, { type: "UPGRADE_ROOM", operationId: `max.${site.roomId}`, roomId: site.roomId }, context);
      expect(denied.operationReceipts[`max.${site.roomId}`]?.status).toBe("rejected");
    }
    expect(state.cashCents).toBe(cash - spent * 100);
    expect(getOperatingExpensePerFacilityHour(state, context) - baselineExpenses).toBe(-8);
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.rooms).toEqual(state.rooms);
    expect(restored.cashCents).toBe(state.cashCents);
    expect(restored.learningHistories).toEqual(state.learningHistories);
    for (const site of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) {
      const refund = getRoomResaleValue(state, site.roomId, context)!;
      const sold = gameReducer(state, { type: "SELL_ROOM", operationId: `sale.${site.roomId}`, roomId: site.roomId }, context);
      expect(sold.operationReceipts[`sale.${site.roomId}`]?.status).toBe("applied");
      expect(sold.cashCents).toBe(state.cashCents + refund * 100);
      expect(sold.rooms.some((room) => room.id === site.roomId)).toBe(false);
    }
  });

  it("freezes MRI and clinic revenue to the one room used, preserving baseline old work and different copies", () => {
    const state = built();
    for (const [id, fee] of [["room.mri", 240], ["room.wound_ostomy", 60]] as const) {
      const used = state.rooms.find((room) => room.roomDefinitionId === id)!;
      used.upgradeLevel = 2;
      const quote = createRoomUpgradeRevenueQuote(state, fee, [id])!;
      const frozen = cloneRoomUpgradeRevenueQuote(quote)!;
      used.upgradeLevel = 5;
      bindRoomUpgradeRevenueQuote(frozen, used.id);
      expect(getRoomUpgradeQuotedFee(frozen)).toBe(fee * 1.06);
      expect(normalizeRoomUpgradeRevenueQuote(JSON.parse(JSON.stringify(frozen)), fee * 1.06, [id])).toEqual(frozen);
      expect(quote.boundRoom).toBeNull();
      bindRoomUpgradeRevenueQuote(frozen, "different.copy");
      expect(frozen.boundRoom?.roomInstanceId).toBe(used.id);
      const baseline = cloneRoomUpgradeRevenueQuote(quote)!;
      bindRoomUpgradeRevenueQuote(baseline, "built.after.acceptance");
      expect(getRoomUpgradeQuotedFee(baseline)).toBe(fee);
    }
    const wound = state.rooms.find((room) => room.roomDefinitionId === "room.wound_ostomy")!;
    state.rooms.push({ ...wound, id: "other.wound", upgradeLevel: 1 });
    const other = createRoomUpgradeRevenueQuote(state, 75, ["room.wound_ostomy"])!;
    bindRoomUpgradeRevenueQuote(other, "other.wound");
    expect(getRoomUpgradeQuotedFee(other)).toBe(75);
    expect(normalizeRoomUpgradeRevenueQuote(undefined, 60)).toBeUndefined();
  });

  it("binds pediatric comfort once per child visit across copies and ordinary waiting/examination", () => {
    const state = built();
    const encounter = Object.values(createInitialGameState(context).encounters)[0]!;
    // Structural fixture only; no pediatric admission/content/service is enabled.
    encounter.frozenCase.pediatricProfile = { version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" };
    encounter.lifecycle = "waiting_unopened";
    encounter.patientSatisfaction = 70;
    encounter.patientMovement = null;
    encounter.idleWaitingSinceTick = 0;
    state.facilityTick = 1;
    const waiting = state.rooms.find((room) => room.roomDefinitionId === "room.pediatric_waiting")!;
    waiting.upgradeLevel = 3;
    encounter.patientLocation = { x: waiting.x + 1, y: waiting.y + 1 };
    observeWaitingRoomExperience(state, encounter, context);
    waiting.upgradeLevel = 5;
    completeWaitingRoomExperience(encounter, 2);
    completeWaitingRoomExperience(encounter, 3);
    expect(encounter.patientSatisfaction).toBe(74);
    const exam = state.rooms.find((room) => room.roomDefinitionId === "room.pediatric_examination")!;
    exam.upgradeLevel = 2;
    completeExaminationRoomExperience(encounter, exam, 3);
    completeExaminationRoomExperience(encounter, { ...exam, id: "other.exam", upgradeLevel: 5 }, 4);
    completeExaminationRoomExperience(encounter, { ...exam, roomDefinitionId: "room.examination" }, 4);
    expect(encounter.patientSatisfaction).toBe(76);
    const adult = Object.values(createInitialGameState(context).encounters)[0]!;
    Object.assign(adult, { patientLocation: encounter.patientLocation, patientMovement: null, idleWaitingSinceTick: 0 });
    observeWaitingRoomExperience(state, adult, context);
    expect(adult.roomUpgradeExperience?.waiting).toBeUndefined();
    completeExaminationRoomExperience(adult, exam, 4);
    expect(adult.roomUpgradeExperience?.examination).toBeUndefined();
  });
});
