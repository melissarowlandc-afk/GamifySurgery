import { describe, expect, it } from "vitest";
import { createInitialGameState, getRoomDefinition, hasAutoTrashCoverage, hasAutoWaterCoverage, isRoomOperationalForFacilityWork, synchronizeFacilityConditionOccurrences, type EmployeeState, type GameState } from "../src";

function employee(state: GameState, roleId: string, homeId: string): EmployeeState {
  const location = { ...state.environment.founderLocation };
  return { id: roleId, staffRoleDefinitionId: roleId, homeRoomInstanceId: homeId, displayName: "Coverage", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 18, morale: 75, trainingLevel: 1, location, path: [location], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100000, facilityTask: null };
}
function addEvsRoom(state: GameState) {
  const def = getRoomDefinition("room.evs_closet")!;
  state.rooms.push({ id: "evs.home", roomDefinitionId: def.id, x: 32 - def.width, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.rooms.push(...Array.from({ length: 9 }, (_, i) => ({ id: `hall.${i}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + i, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
  state.doors.push({ id: "desk.west", roomId: state.rooms[0]!.id, side: "west", offset: 0, exterior: false }, { id: "evs.east", roomId: "evs.home", side: "east", offset: 1, exterior: false });
  expect(isRoomOperationalForFacilityWork(state, "evs.home")).toBe(true);
  return "evs.home";
}

describe("installed water and trash automation coverage", () => {
  it("keeps AutoWater coverage while staff work, walk, take breaks or train", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const receptionist = employee(state, "staff.receptionist", state.rooms[0]!.id); state.employees = [receptionist];
    receptionist.location = { x: 0, y: 0 }; receptionist.path = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    receptionist.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    expect(hasAutoWaterCoverage(state)).toBe(true);
    receptionist.training = { version: 1, requestSequence: 1, requestedAtFacilityTick: 0, earliestDepartureAtFacilityTick: 0, paidAmount: 1, targetLevel: 2, stage: "training", roomInstanceId: null, placeId: null, remainingMinutes: 10, startedAtFacilityTick: 0, completedAtFacilityTick: null, lastProgressAtFacilityTick: 0 };
    expect(hasAutoWaterCoverage(state)).toBe(true);
    state.rooms = []; state.doors = [];
    expect(hasAutoWaterCoverage(state)).toBe(false);
    receptionist.facilityTask = { kind: "refill_water", startedAtFacilityTick: 0, workMinutesRemaining: 2 };
    expect(hasAutoWaterCoverage(state)).toBe(true);
  });
  it("checks the EVS home route to the actual litter, not current employee idleness", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const evs = employee(state, "staff.evs_worker", addEvsRoom(state)); state.employees = [evs];
    evs.facilityTask = { kind: "clean_room", startedAtFacilityTick: 0, workMinutesRemaining: 20, targetId: "another.room" };
    state.environment.litterItems = [{ id: "litter", roomId: state.rooms[0]!.id, location: { ...state.environment.founderLocation }, spawnedAtFacilityTick: 0 }];
    expect(hasAutoTrashCoverage(state, "litter")).toBe(true);
    expect(hasAutoTrashCoverage(state, "absent")).toBe(false);
    state.doors = state.doors.filter((door) => door.id !== "evs.east");
    expect(hasAutoTrashCoverage(state, "litter")).toBe(false);
    evs.facilityTask = { kind: "collect_litter", targetId: "litter", startedAtFacilityTick: 0, workMinutesRemaining: 2 };
    expect(hasAutoTrashCoverage(state, "litter")).toBe(true);
  });
  it("suppresses delivery but preserves real amenity conditions and existing cadence/history", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const home = addEvsRoom(state);
    state.environment.waterCoolerFillPercent = 0;
    state.environment.litterItems = [{ id: "litter", roomId: state.rooms[0]!.id, location: { ...state.environment.founderLocation }, spawnedAtFacilityTick: 0 }];
    synchronizeFacilityConditionOccurrences(state);
    const retained = state.environment.facilityConditionOccurrences.map((row) => row.id);
    state.employees = [employee(state, "staff.receptionist", state.rooms[0]!.id), employee(state, "staff.evs_worker", home)];
    state.facilityTick = 100;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences.map((row) => row.id)).toEqual(retained);
    state.employees = [];
    state.facilityTick = 101;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences.some((row) => row.conditionKey === "empty_water_cooler")).toBe(true);
    expect(state.environment.facilityConditionOccurrences.some((row) => row.conditionKey === "visible_litter")).toBe(true);
  });
});
