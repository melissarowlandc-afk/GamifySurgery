import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  type EmployeeState,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  createManagementFinanceView,
  createRoleAverageAfterTrainingLabel,
  createRoleTrainingSummary,
  createServiceSetupState,
  createStaffTrainingOverview,
} from "./managementViewModels";

function addEmployee(state: GameState, roleId: string, level: EmployeeState["trainingLevel"], salary = 20): EmployeeState {
  const employee: EmployeeState = {
    id: `employee.management-test.${state.employees.length}`,
    staffRoleDefinitionId: roleId,
    displayName: "Management Test",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: salary,
    morale: 80,
    trainingLevel: level,
    homeRoomInstanceId: null,
    location: { x: 33, y: 28 },
    path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999,
    facilityTask: null,
  };
  state.employees.push(employee);
  return employee;
}

function addTrainingRoom(state: GameState): void {
  const template = state.rooms[0]!;
  state.rooms.push({ ...template, id: "room.training-test", roomDefinitionId: "room.training", x: 0, y: 0 });
}

describe("management view models", () => {
  it("hides training summaries until a Training Room is built", () => {
    const state = createInitialGameState();
    const employees = [addEmployee(state, "staff.imaging_technician", 2)];
    expect(createStaffTrainingOverview(state)).toBeNull();
    expect(createRoleTrainingSummary(state, "staff.imaging_technician", employees)).toBeUndefined();
  });

  it("averages the role's training levels and benefits once a Training Room exists", () => {
    const state = createInitialGameState();
    addTrainingRoom(state);
    const employees = [
      addEmployee(state, "staff.imaging_technician", 1),
      addEmployee(state, "staff.imaging_technician", 2),
    ];
    expect(createRoleTrainingSummary(state, "staff.imaging_technician", employees)).toEqual({
      averageLevelLabel: "Avg Lv 1.5",
      averageBenefitLabel: "Reduces scan time 5%",
    });
    expect(createRoleAverageAfterTrainingLabel(state, "staff.imaging_technician", employees, employees[0]!.id))
      .toBe("Reduces scan time 10%");
    expect(createStaffTrainingOverview(state)).toMatchObject({ inTrainingCount: 0, queuedCount: 0, capacity: 2 });
  });

  it("offers Build or Hire only for missing rooms and roles, and pauses placed ones", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    expect(createServiceSetupState(state, {
      levelLocked: false, available: false, missingCapabilityIds: [],
      missingRoomDefinitionIds: ["room.ultrasound"], missingStaffRoleIds: ["staff.imaging_technician"],
    })).toEqual({
      group: "needs",
      setupActions: [
        { label: "Build Ultrasound Room", target: "room", id: "room.ultrasound" },
        { label: "Hire Imaging Technician", target: "staff", id: "staff.imaging_technician" },
      ],
    });
    addEmployee(state, "staff.imaging_technician", 1);
    expect(createServiceSetupState(state, {
      levelLocked: false, available: false, missingCapabilityIds: [],
      missingRoomDefinitionIds: [], missingStaffRoleIds: ["staff.imaging_technician"],
    })).toEqual({ group: "paused", pausedReason: "Paused: Imaging Technician unavailable" });
    expect(createServiceSetupState(state, {
      levelLocked: true, available: false, missingCapabilityIds: [], missingRoomDefinitionIds: [], missingStaffRoleIds: [],
    })).toEqual({ group: "future" });
  });

  it("reports since-opening profit, the hourly cost split and cash runway", () => {
    const state = createInitialGameState();
    addEmployee(state, "staff.receptionist", 1, 30);
    state.cash = 600;
    state.totalOperatingExpenses = 250;
    const view = createManagementFinanceView(state, { grossCents: 50_000, stockCostCents: 2_000, netCashDeltaCents: 48_000 }, (id) => id);
    expect(view.earnedLabel).toBe("$480");
    expect(view.runningCostsLabel).toBe("$250");
    expect(view.profitLabel).toBe("+$230");
    expect(view.hourlyCosts.find((cost) => cost.id === "staff")?.amount).toBe(30);
    const hourly = view.hourlyCosts.reduce((total, cost) => total + cost.amount, 0);
    expect(view.runwayLabel).toContain(`about ${Math.floor(600 / hourly)} hour`);
  });
});
