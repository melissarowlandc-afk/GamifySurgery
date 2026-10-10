import { describe, expect, it } from "vitest";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import { deserializeGameState, gameReducer, getAppAppointmentTrainingFee, getRoomStaffCapacity, getStaffRoleDefinition,
  normalizeServiceOperationTraining, PREFERRED_STAFF_STILL_IDS_BY_ROLE, serializeGameState, staffStillEligibleEntries, type GameState } from "../src";

const context = createLevelFourRoomsQaContext();
function twoExams(): GameState {
  let state = createLevelFourRoomsQaState(context);
  for (const [i, x] of [28, 38].entries()) {
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: `staff.exam.${i}`, roomId: `room.app.${i}`,
      roomDefinitionId: "room.examination", x, y: 24, orientation: 0 }, context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: `staff.door.${i}`, doorId: `door.app.${i}`,
      roomId: `room.app.${i}`, side: "south", offset: 1 }, context);
    expect(state.operationReceipts[`staff.door.${i}`]?.status).toBe("applied");
  }
  return state;
}

describe("APP physical posts, identity and training", () => {
  it("counts exactly one post per eligible room at any upgrade level", () => {
    const state = twoExams();
    state.rooms.push(...["room.minor_procedure", "room.pediatric_examination", "room.wound_ostomy", "room.reading", "room.mri", "room.glp1_telehealth_suite"].map((id, i) =>
      ({ id: `post.${i}`, roomDefinitionId: id, x: i * 4, y: 0, orientation: 0 as const, doorSide: null, upgradeLevel: 5 as const })));
    expect(getRoomStaffCapacity(state, "staff.app")).toMatchObject({ capacity: 5, builtRoomCount: 5,
      slotsByRoomInstanceId: { "room.app.0": 1, "room.app.1": 1, "post.0": 1, "post.1": 1, "post.2": 1 } });
    for (const room of state.rooms) room.upgradeLevel = 5;
    expect(getRoomStaffCapacity(state, "staff.app").capacity).toBe(5);
  });

  it("hires two distinct approved APPs in separate homes and preserves them on reload", () => {
    let state = twoExams();
    for (let i = 0; i < 2; i++) {
      state = gameReducer(state, { type: "HIRE_STAFF", operationId: `hire.app.${i}`, employeeId: `app.${i}`, staffRoleDefinitionId: "staff.app" }, context);
      expect(state.operationReceipts[`hire.app.${i}`]?.status).toBe("applied");
    }
    expect(new Set(state.employees.map((row) => row.homeRoomInstanceId)).size).toBe(2);
    expect(state.employees.map((row) => row.appearance.stillId).sort()).toEqual(["future-roster20-v5.001", "future-roster20-v5.002"]);
    expect(state.employees.every((row) => row.appearance.roleStyle === "app" && row.salaryPerExpenseInterval === 30)).toBe(true);
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(loaded.employees).toEqual(state.employees);
    const cash = state.cash;
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.third", employeeId: "app.2", staffRoleDefinitionId: "staff.app" }, context);
    expect(state.operationReceipts["hire.third"]?.status).toBe("rejected");
    expect(state.cash).toBe(cash);
  });

  it("uses only the authored APP pool, excluding other preferred lists and unrelated fallback", () => {
    const pool = staffStillEligibleEntries("staff.app");
    expect(pool).toHaveLength(2);
    const reserved = Object.entries(PREFERRED_STAFF_STILL_IDS_BY_ROLE).filter(([role]) => role !== "staff.app").flatMap(([, ids]) => ids ?? []);
    for (const row of pool) {
      expect(reserved).not.toContain(row.stillId);
      expect(row.eligibleStaffRoleDefinitionIds).toEqual(["staff.app"]);
    }
    const role = getStaffRoleDefinition("staff.app", context)!;
    expect(role.maximumEmployees).toBeGreaterThan(2);
  });

  it("freezes individual-provider revenue without shortening clinical work or rewriting old category snapshots", () => {
    let state = twoExams();
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.fee", employeeId: "app.fee", staffRoleDefinitionId: "staff.app" }, context);
    const employee = state.employees[0]!;
    employee.trainingLevel = 3;
    expect(getAppAppointmentTrainingFee(80, employee)).toBe(96);
    const oldCategories = Object.fromEntries(context.balanceRelease.facility.staffRoleDefinitions.filter((role) => role.id !== "staff.app").map((role) => [role.id, 0]));
    const phases = [{ id: "old.phase", roomDefinitionId: "room.examination", durationMinutes: 30, staffRoleDefinitionIds: [] }];
    const oldTiming = { version: "employee-training-timing.v1", categoryPercents: oldCategories,
      phases: [{ phaseId: "old.phase", baselineMinutes: 30, boundPercent: 0 }] };
    expect(normalizeServiceOperationTraining(oldTiming, phases)).toEqual(oldTiming);
  });
});
