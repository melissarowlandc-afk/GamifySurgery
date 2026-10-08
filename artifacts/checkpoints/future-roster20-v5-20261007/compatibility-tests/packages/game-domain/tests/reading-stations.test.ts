import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_READING_WORKSTATIONS } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, advanceEmployeeMovement, createInitialGameState, deserializeGameState, gameReducer, getRoomStaffCapacity, serializeGameState, staffStillEligibleEntries } from "../src";
import { getRadiologistReadingStation } from "../src/reading-stations";
import type { GameState } from "../src";

function readingState(): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 3;
  state.cash = 20_000; state.cashCents = 2_000_000;
  state.encounters = {}; state.serviceOperations = [];
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 9 }, (_, i) => ({ id: `room.reading-hall.${i}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + i, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const })));
  state.doors.push({ id: "door.readers", roomId: "room.readers", side: "west", offset: 1, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  return state;
}

function hire(state: GameState, id: string): GameState {
  return gameReducer(state, { type: "HIRE_STAFF", operationId: `hire.${id}`, employeeId: id, staffRoleDefinitionId: "staff.radiologist" });
}

describe("four approved radiologist posts", () => {
  it("hires four unique approved radiologists into distinct reachable seats and rejects a fifth without a charge", () => {
    let state = readingState();
    expect(getRoomStaffCapacity(state, "staff.radiologist").capacity).toBe(4);
    for (let i = 1; i <= 4; i++) {
      state = hire(state, `reader.${i}`);
      expect(state.employees).toHaveLength(i);
    }
    expect(state.employees.map((employee) => employee.readingStationId)).toEqual(DIAGNOSTIC_READING_WORKSTATIONS.map((station) => station.id));
    const radiologistStillIds = new Set<string>(staffStillEligibleEntries("staff.radiologist").map((entry) => entry.stillId));
    const hiredStillIds = state.employees.map((employee) => employee.appearance.stillId);
    expect(new Set(hiredStillIds).size).toBe(4);
    for (const stillId of hiredStillIds) expect(radiologistStillIds.has(stillId!)).toBe(true);
    for (const employee of state.employees) {
      expect(employee.homeRoomInstanceId).toBe("room.readers");
      expect(employee.path.at(-1)).toEqual(getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT)!.location);
    }
    const cash = state.cash;
    state = hire(state, "reader.5");
    expect(state.employees).toHaveLength(4); expect(state.cash).toBe(cash);
    expect(cash).toBe(18_800);
  });

  it("keeps remaining readers at the same seats after dismissal and reload, then fills the vacated seat", () => {
    let state = readingState();
    for (let i = 1; i <= 4; i++) state = hire(state, `reader.${i}`);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "dismiss.reader.1", employeeId: "reader.1" });
    const seats = state.employees.map((employee) => [employee.id, employee.readingStationId]);
    state = deserializeGameState(serializeGameState(state));
    expect(state.employees.map((employee) => [employee.id, employee.readingStationId])).toEqual(seats);
    // The departing actor keeps its art occupied; remove only this synthetic
    // fixture's completed departure before testing replacement capacity.
    state.departingEmployees = [];
    state = hire(state, "reader.replacement");
    expect(state.employees.find((employee) => employee.id === "reader.replacement")?.readingStationId).toBe("northwest");
    expect(state.employees.filter((employee) => employee.id !== "reader.replacement").map((employee) => [employee.id, employee.readingStationId])).toEqual(seats);
  });

  it("routes an idle radiologist back to the assigned post and keeps all four posts independent", () => {
    let state = readingState();
    for (let i = 1; i <= 4; i++) state = hire(state, `reader.${i}`);
    const context = PROTOTYPE_DOMAIN_CONTEXT;
    for (const employee of state.employees) {
      const station = getRadiologistReadingStation(state, employee, context)!;
      employee.location = { ...station.location }; employee.path = []; employee.pathIndex = 0;
    }
    const moved = state.employees[1]!;
    moved.location = { x: 33, y: 21 }; moved.path = []; moved.pathIndex = 0;
    for (let i = 1; i <= 8; i++) { state.facilityTick = i; advanceEmployeeMovement(state, context); }
    expect(moved.location).toEqual(getRadiologistReadingStation(state, moved, context)!.location);
    expect(new Set(state.employees.map((employee) => `${employee.location.x},${employee.location.y}`)).size).toBe(4);
    expect(staffStillEligibleEntries("staff.radiologist").length).toBeGreaterThanOrEqual(4);
  });
});

