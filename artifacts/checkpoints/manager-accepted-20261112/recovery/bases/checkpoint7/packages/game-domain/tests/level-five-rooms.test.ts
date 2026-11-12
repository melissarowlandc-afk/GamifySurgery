import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, gameReducer,
  getFacilityAccessValidation, getRoomResaleValue, getRoomStaffCapacity, getCurrentCapabilities,
  getOperatingExpensePerFacilityHour, serializeGameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { LEVEL_FIVE_ROOMS_QA_PLACEMENTS, placeLevelFiveRoomsQaRooms } from "../../../tests/fixtures/level-five-rooms";
import { createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";

const context = createLevelFiveStateQaContext();
describe("Level 5 M2 real construction and compatibility", () => {
  it("charges all five once, connects them and adds only room upkeep and one physical home", () => {
    const before = createLevelFiveStateQaState("pre-goal", context);
    const state = placeLevelFiveRoomsQaRooms(before, context);
    const halls = state.rooms.length - before.rooms.length - 5;
    expect(before.cashCents - state.cashCents).toBe((5800 + halls * context.balanceRelease.facility.roomDefinitions.find(r => r.id === "room.hallway")!.constructionCost) * 100);
    expect(getFacilityAccessValidation(state, context).unreachableRoomIds).toEqual([]);
    // Existing selector expresses costs as a negative cash-flow rate.
    expect(getOperatingExpensePerFacilityHour(state, context) - getOperatingExpensePerFacilityHour(before, context)).toBe(-5);
    expect(state.employees).toEqual(before.employees);
    expect(state.levelFive).toEqual(before.levelFive);
    expect(getCurrentCapabilities(state, context)).toEqual(new Set([...getCurrentCapabilities(before, context), "capability.gift_shop"]));
    expect(getRoomStaffCapacity(state, "staff.executive")).toMatchObject({ capacity: 1, builtRoomCount: 1,
      slotsByRoomInstanceId: { "room.qa.level5.executive": 1 } });
    for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
      expect(state.operationReceipts[`level5.rooms.place.${site.roomId}`]?.status).toBe("applied");
      expect(state.operationReceipts[`level5.rooms.door.${site.roomId}`]?.status).toBe("applied");
    }
  });
  it.each(LEVEL_FIVE_ROOMS_QA_PLACEMENTS)("guards $roomDefinitionId's unlock/cap/upgrade and sale without duplicated finance", site => {
    const state = createLevelFiveStateQaState("rooms", context);
    const over = gameReducer(state, { type: "PLACE_ROOM", operationId: "over-cap", roomId: "second", roomDefinitionId: site.roomDefinitionId, x: 5, y: 5 }, context);
    expect(over.operationReceipts["over-cap"]?.status).toBe("rejected"); expect(over.cashCents).toBe(state.cashCents);
    const locked = structuredClone(state); locked.facilityLevel = 4;
    locked.rooms = locked.rooms.filter(r => r.roomDefinitionId !== site.roomDefinitionId);
    const denied = gameReducer(locked, { type: "PLACE_ROOM", operationId: "locked", roomId: "locked-room", roomDefinitionId: site.roomDefinitionId, x: 5, y: 5 }, context);
    expect(denied.operationReceipts.locked?.status).toBe("rejected"); expect(denied.cashCents).toBe(locked.cashCents);
    const upgrade = gameReducer(state, { type: "UPGRADE_ROOM", operationId: "future-effect", roomId: site.roomId }, context);
    const active = true;
    expect(upgrade.operationReceipts["future-effect"]?.status).toBe(active ? "applied" : "rejected");
    const cost = context.balanceRelease.facility.roomDefinitions.find(room => room.id === site.roomDefinitionId)!.upgradeCosts[0]!;
    expect(upgrade.cashCents).toBe(state.cashCents - (active ? cost * 100 : 0));
    const refund = getRoomResaleValue(state, site.roomId, context)!;
    const command = { type: "SELL_ROOM" as const, operationId: "sale", roomId: site.roomId };
    const sold = gameReducer(state, command, context);
    expect(sold.operationReceipts.sale?.status).toBe("applied");
    expect(sold.cashCents).toBe(state.cashCents + refund * 100);
    expect(sold.rooms.some(r => r.id === site.roomId)).toBe(false);
    expect(gameReducer(sold, command, context)).toEqual(sold);
    expect(sold.employees).toEqual(state.employees);
  });
  it("preserves every placed tier through ordinary reload and rejects Level 5 under the historical cap 4", () => {
    for (const tier of [1, 2, 3, 4, 5] as const) {
      let state = createLevelFiveStateQaState("rooms", context);
      state.rooms.find(r => r.roomDefinitionId === "room.founder_office")!.upgradeLevel = tier; // explicit appearance-only fixture
      for (let reload = 0; reload < 2; reload++) {
        const restored = deserializeGameState(serializeGameState(state), context);
        for (const key of ["rooms", "doors", "cashCents", "levelFive", "learningHistories", "operationReceipts", "serviceIncomeReceipts"] as const) expect(restored[key], key).toEqual(state[key]);
        state = restored;
      }
      expect(deserializeGameState(serializeGameState(state))).toEqual(state);
      expect(() => deserializeGameState(serializeGameState(state), createPreLevelFiveLaunchContext())).toThrow();
    }
  });
  it.each([0, 1, 2, 3, 4] as const)("loads and ticks Level %s identically with the old room catalog", level => {
    const prior = { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: structuredClone(PROTOTYPE_BALANCE_RELEASE) };
    prior.balanceRelease.facility.roomDefinitions = prior.balanceRelease.facility.roomDefinitions.filter(r => r.unlockFacilityLevel < 5);
    let state = createInitialGameState(prior); state.facilityLevel = level;
    const saved = serializeGameState(state);
    expect(deserializeGameState(saved)).toEqual(deserializeGameState(saved, prior));
    state = deserializeGameState(saved, prior);
    state.paused = false;
    const command = { type: "ADVANCE_TICK" as const, operationId: "old-catalog-tick", advancedAtRealMs: 0 };
    expect(gameReducer(state, command)).toEqual(gameReducer(state, command, prior));
    expect(state).not.toHaveProperty("levelFive");
  });
});
