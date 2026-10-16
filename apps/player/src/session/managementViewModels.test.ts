import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  getServiceIncomeTotalsCents,
  getOperatingExpensePerFacilityHour,
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

  it("includes patient settlements in opening totals and recent hourly income", () => {
    const state = createInitialGameState();
    state.rooms = [];
    state.facilityTick = 600;
    state.totalOperatingExpenses = 100;
    state.settlements = [
      { id: "old", encounterId: "old", completionRevenue: 300, qualityRevenueBonus: 0, incorrectFinancialConsequence: 0, netCashDelta: 300, satisfactionDelta: 0, clinicalXpAwarded: 0, correctAnswers: 0, incorrectAnswers: 0, terminalOutcomeSeverity: null, settledAtFacilityTick: 100 },
      { id: "recent", encounterId: "recent", completionRevenue: 600, qualityRevenueBonus: 0, incorrectFinancialConsequence: 0, netCashDelta: 600, satisfactionDelta: 0, clinicalXpAwarded: 0, correctAnswers: 0, incorrectAnswers: 0, terminalOutcomeSeverity: null, settledAtFacilityTick: 600 },
    ];
    state.serviceIncomeReceipts = [{ id: "retail", transactionKey: "retail", incomeLineId: "income.coffee", catalogVersion: 1, routeId: null, actorKind: "retail_visitor", actorId: "retail", grossAmount: 60, stockCost: 6, netCashDelta: 54, completedAtFacilityTick: 500 }];
    const view = createManagementFinanceView(state, getServiceIncomeTotalsCents(state), (id) => id);
    expect(view).toMatchObject({
      earnedLabel: "$954", billedLabel: "$960", stockLabel: "$6", profitLabel: "+$854",
      hourlyIncomeLabel: "$110/hr", hourlyCostLabel: "$1/hr", hourlyNetLabel: "+$109/hr",
      hourlyNetSign: "positive", incomeWindowLabel: "Last 6 game hours",
    });
    expect(view.hourlyIncomeSources.find((source) => source.id === "patient_encounters")).toMatchObject({ amount: 100, count: 1 });
    expect(view.hourlyCosts.find((cost) => cost.id === "stock")?.amountLabel).toBe("$1/hr");
    expect(view.incomeWindowExplanation).toContain("Stock costs use the same income window");
  });

  it("reads current obligations while keeping no-income runway independent of variable stock", () => {
    const state = createInitialGameState();
    state.facilityTick = 120;
    state.cash = 600;
    addEmployee(state, "staff.receptionist", 1, 30);
    state.advertisingLevel = 1;
    state.serviceIncomeReceipts = [{ id: "stock", transactionKey: "stock", incomeLineId: "income.coffee", catalogVersion: 1, routeId: null, actorKind: "retail_visitor", actorId: "retail", grossAmount: 60, stockCost: 6, netCashDelta: 54, completedAtFacilityTick: 100 }];
    const operating = -getOperatingExpensePerFacilityHour(state);
    const view = createManagementFinanceView(state, getServiceIncomeTotalsCents(state), (id) => id);
    expect(view.hourlyCosts.reduce((total, cost) => total + cost.amount, 0)).toBeCloseTo(operating + 3);
    expect(view.runwayLabel).toContain(`about ${Math.floor(600 / operating)} hour`);
    expect(view.hourlyIncomeLabel).toBe("$30/hr");
    expect(view.hourlyNetSign).toBe("negative");
    expect(view.incomeWindowLabel).toBe("Since opening · 2 game hours");
    state.employees[0]!.salaryPerExpenseInterval += 10;
    const raised = createManagementFinanceView(state, getServiceIncomeTotalsCents(state), (id) => id);
    expect(raised.hourlyCosts.find((cost) => cost.id === "staff")!.amount - view.hourlyCosts.find((cost) => cost.id === "staff")!.amount).toBe(10);
  });

  it("labels the early estimate and presents zero without a false positive sign", () => {
    const state = createInitialGameState();
    state.rooms = [];
    const view = createManagementFinanceView(state, getServiceIncomeTotalsCents(state), (id) => id);
    expect(view).toMatchObject({ hourlyIncomeLabel: "$0/hr", hourlyNetLabel: "$0/hr", hourlyNetSign: "neutral" });
    expect(view.incomeWindowLabel).toContain("Early estimate");
    expect(view.incomeWindowExplanation).toContain("spread over one game hour");
  });

  it("shows the domain's active outage relief without duplicating its eligibility rule", () => {
    const state = createInitialGameState();
    state.facilityTick = 600;
    state.rooms = [{ ...state.rooms[0]!, id: "outage", roomDefinitionId: "room.ultrasound", upgradeLevel: 3, upkeepOutage: { version: "room-upkeep-outage.v1", sinceFacilityTick: 0, lastObservedFacilityTick: 600 } }];
    const view = createManagementFinanceView(state, getServiceIncomeTotalsCents(state), (id) => id);
    const relief = view.hourlyCosts.find((cost) => cost.id === "relief")!;
    expect(relief.amount).toBeLessThan(0);
    expect(relief.amountLabel).toMatch(/^−\$/);
    expect(view.hourlyCosts.reduce((total, cost) => total + cost.amount, 0)).toBeCloseTo(-getOperatingExpensePerFacilityHour(state));
    expect(view.hourlyCosts.find((cost) => cost.id === "rooms")!.amount).toBeGreaterThan(-getOperatingExpensePerFacilityHour(state));
  });
});
