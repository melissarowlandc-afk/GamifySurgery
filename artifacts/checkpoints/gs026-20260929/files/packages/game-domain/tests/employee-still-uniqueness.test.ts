import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  createPixelAppearance,
  deserializeGameState,
  gameReducer,
  getRoomStaffCapacity,
  roleStyleForStaffDefinition,
  selectStaffStillId,
  serializeGameState,
  staffStillEligibleEntries,
  type EmployeeState,
  type GameState,
} from "../src";

function staff(state: GameState, id: string, role: string, stillId: string, hiredAtFacilityTick: number): EmployeeState {
  const appearance = createPixelAppearance(state.campaignSeed, "staff", id, roleStyleForStaffDefinition(role));
  return {
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: { ...appearance, stillId },
    hiredAtFacilityTick,
    salaryPerExpenseInterval: 17 + hiredAtFacilityTick,
    morale: 70 + hiredAtFacilityTick,
    trainingLevel: 1,
    homeRoomInstanceId: null,
    location: { x: 11 + hiredAtFacilityTick, y: 12 },
    path: [{ x: 11 + hiredAtFacilityTick, y: 12 }],
    pathIndex: 0,
    lastMovedAtFacilityTick: hiredAtFacilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 100,
    facilityTask: null,
  };
}

function stateWithStaff(seed = "employee-still-uniqueness"): GameState {
  return createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
}

describe("employee still uniqueness", () => {
  it("allocates 43 distinct eligible employee designs across both role orders", () => {
    const state = stateWithStaff("all-openings");
    const addRooms = (prefix: string, roomDefinitionId: string, count: number) => {
      expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions
        .find((room) => room.id === roomDefinitionId)?.maximumInstances).toBe(count);
      for (let index = 0; index < count; index += 1) {
        state.rooms.push({
          id: `${prefix}.${index}`,
          roomDefinitionId,
          x: index,
          y: 0,
          orientation: 0,
          doorSide: null,
          upgradeLevel: 1,
        });
      }
    };
    addRooms("room.ultrasound", "room.ultrasound", 1);
    addRooms("room.xray", "room.xray", 1);
    addRooms("room.ct", "room.ct", 1);
    addRooms("room.periop", "room.periop_recovery", 3);
    addRooms("room.endoscopy", "room.endoscopy", 5);
    addRooms("room.phlebotomy", "room.phlebotomy", 3);
    addRooms("room.evs", "room.evs_closet", 10);
    addRooms("room.glp", "room.glp1_telehealth_suite", 5);
    const roles = [
      "staff.receptionist",
      "staff.imaging_technician",
      "staff.periop_nurse",
      "staff.endoscopy_nurse",
      "staff.endoscopist",
      "staff.phlebotomist",
      "staff.evs_worker",
      "staff.glp1_np",
    ] as const;
    const openings = roles.map((role) => [role, getRoomStaffCapacity(state, role).capacity] as const);
    expect(openings).toEqual([
      ["staff.receptionist", 1], ["staff.imaging_technician", 3], ["staff.periop_nurse", 6],
      ["staff.endoscopy_nurse", 5], ["staff.endoscopist", 5], ["staff.phlebotomist", 3],
      ["staff.evs_worker", 10], ["staff.glp1_np", 10],
    ]);
    for (const roles of [openings, [...openings].reverse()] as const) {
      const occupied = new Set<string>();
      const roster = stateWithStaff(`all-openings-${roles[0]![0]}`);
      for (const [role, count] of roles) {
        for (let index = 0; index < count; index += 1) {
          const stillId = selectStaffStillId(
            "all-openings-seed",
            `employee.${role}.${index}`,
            role,
            undefined,
            occupied,
          );
          expect(stillId).toBeDefined();
          occupied.add(stillId!);
          roster.employees.push(staff(roster, `employee.${role}.${index}`, role, stillId!, roster.employees.length));
        }
      }
      expect(occupied).toHaveLength(43);
      expect(deserializeGameState(serializeGameState(roster)).employees.map((employee) => employee.appearance.stillId)).toEqual(
        roster.employees.map((employee) => employee.appearance.stillId),
      );
    }
  });

  it("keeps a free deterministic preference when unrelated eligible art is occupied", () => {
    const role = "staff.evs_worker";
    const preferred = selectStaffStillId("preference-seed", "employee.preference", role)!;
    const unrelated = staffStillEligibleEntries(role)
      .map((entry) => entry.stillId)
      .find((stillId) => stillId !== preferred)!;

    expect(selectStaffStillId("preference-seed", "employee.preference", role, undefined, new Set([unrelated]))).toBe(preferred);
  });

  it("repairs only later legacy collisions while retaining earlier and later-unique employee gameplay fields", () => {
    const state = stateWithStaff();
    const duplicate = "gs022-new-employee-017";
    const laterUnique = "gs026-employee-010";
    state.employees.push(
      staff(state, "employee.early", "staff.evs_worker", duplicate, 3),
      staff(state, "employee.collision", "staff.evs_worker", duplicate, 8),
      staff(state, "employee.later-unique", "staff.evs_worker", laterUnique, 12),
    );

    const restored = deserializeGameState(serializeGameState(state));
    const early = restored.employees.find((employee) => employee.id === "employee.early")!;
    const collision = restored.employees.find((employee) => employee.id === "employee.collision")!;
    const unique = restored.employees.find((employee) => employee.id === "employee.later-unique")!;

    expect(early.appearance.stillId).toBe(duplicate);
    expect(unique.appearance.stillId).toBe(laterUnique);
    expect(collision.appearance.stillId).not.toBe(duplicate);
    expect(new Set(restored.employees.map((employee) => employee.appearance.stillId)).size).toBe(3);
    expect(collision).toMatchObject({
      staffRoleDefinitionId: "staff.evs_worker",
      salaryPerExpenseInterval: 25,
      morale: 78,
      location: { x: 19, y: 12 },
      hiredAtFacilityTick: 8,
    });
    expect(deserializeGameState(serializeGameState(restored)).employees.map((employee) => employee.appearance.stillId)).toEqual(
      restored.employees.map((employee) => employee.appearance.stillId),
    );
  });

  it("enforces global shared-nurse uniqueness and preserves an unknown future ID", () => {
    const state = stateWithStaff("shared-nurse");
    state.employees.push(
      staff(state, "employee.periop", "staff.periop_nurse", "mixed-20260910-nurse-01", 1),
      staff(state, "employee.endo", "staff.endoscopy_nurse", "mixed-20260910-nurse-01", 2),
      staff(state, "employee.future", "staff.evs_worker", "future.staff.identity.v2", 3),
    );

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees.find((employee) => employee.id === "employee.periop")?.appearance.stillId).toBe("mixed-20260910-nurse-01");
    expect(restored.employees.find((employee) => employee.id === "employee.endo")?.appearance.stillId).not.toBe("mixed-20260910-nurse-01");
    expect(restored.employees.find((employee) => employee.id === "employee.future")?.appearance.stillId).toBe("future.staff.identity.v2");
  });

  it("rejects an exhausted departing-art pool without charging cash, then hires the exactly freed design", () => {
    let state = stateWithStaff("departing-exhaustion");
    state.facilityLevel = 1;
    state.cash = 5_000;
    state.cashCents = 500_000;
    const receptionistStills = staffStillEligibleEntries("staff.receptionist").map((entry) => entry.stillId);
    expect(receptionistStills).toHaveLength(4);
    state.departingEmployees = receptionistStills.map((stillId, index) => ({
      ...staff(state, `employee.departing.${index}`, "staff.receptionist", stillId, index),
      dismissedAtFacilityTick: 0,
    }));
    const cashBefore = state.cash;
    const rejected = gameReducer(state, {
      type: "HIRE_STAFF", operationId: "hire.reception.exhausted", employeeId: "employee.reception.exhausted", staffRoleDefinitionId: "staff.receptionist",
    });
    expect(rejected.operationReceipts["hire.reception.exhausted"]).toMatchObject({
      status: "rejected",
      message: "No unused Receptionist character design is available yet.",
    });
    expect(rejected.cash).toBe(cashBefore);

    const freedStillId = receptionistStills[0]!;
    state.departingEmployees = state.departingEmployees.filter((employee) => employee.appearance.stillId !== freedStillId);
    state = gameReducer(state, {
      type: "HIRE_STAFF", operationId: "hire.reception.freed", employeeId: "employee.reception.freed", staffRoleDefinitionId: "staff.receptionist",
    });
    expect(state.operationReceipts["hire.reception.freed"]?.status).toBe("applied");
    expect(state.employees[0]!.appearance.stillId).toBe(freedStillId);
  });

  it("keeps legacy capacity-overflow employees on save load instead of laying them off", () => {
    const state = stateWithStaff("legacy-overflow");
    const evsStills = staffStillEligibleEntries("staff.evs_worker").map((entry) => entry.stillId);
    for (let index = 0; index < 5; index += 1) {
      state.employees.push(staff(state, `employee.legacy-overflow.${index}`, "staff.evs_worker", evsStills[index]!, index));
    }
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees.map((employee) => employee.id)).toEqual(state.employees.map((employee) => employee.id));
    expect(restored.employees).toHaveLength(5);
  });
});
