import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import type { StaffMemberView, StaffRoleGroupView } from "../../ui/types";
import type { MobileManageProps } from "./MobileManage";

export const employeeFixture: StaffMemberView = {
  id: "employee.phone.first", displayName: "Morgan Fixture", roleDisplayName: "Receptionist",
  activityLabel: "Working at Front Desk A", salaryLabel: "$30/hr", salaryPerHour: 30,
  moraleLabel: "80%", moralePercent: 80, canDecreaseSalary: true, canIncreaseSalary: true,
  training: { level: 1, nextLevel: 2, cost: 500, costLabel: "$500", canTrain: true, blockedReason: null,
    status: "idle", statusLabel: "Level 1", minutesRemaining: null, sessionDurationMinutes: null,
    currentBenefitLabel: "Fixture current benefit", nextBenefitLabel: "Fixture next benefit", incrementBenefitLabel: "Fixture increment" },
  trainingTeamAverageAfterLabel: "Fixture team benefit",
};
export const roleFixture: StaffRoleGroupView = {
  id: "staff.receptionist", displayName: "Receptionist", currentCount: 1, maximumCount: 2,
  hiringCostLabel: "$1,000", canHire: true, staffingGuidance: "Fixture setup guidance.", employees: [employeeFixture],
};

/** Synthetic UI fixture. Prices/status flags are supplied labels, never gameplay calculations. */
export function createManageFixture(overrides: Partial<MobileManageProps> = {}): MobileManageProps {
  const state = createInitialGameState();
  state.facilityTick = 600;
  state.totalOperatingExpenses = 100;
  state.serviceIncomeReceipts = [{ id: "fixture.receipt", transactionKey: "fixture.receipt", catalogVersion: 1,
    incomeLineId: "income.coffee", routeId: null, actorKind: "retail_visitor", actorId: "fixture.visitor",
    grossAmount: 60, stockCost: 6, netCashDelta: 54, completedAtFacilityTick: 500 }];
  const view = createPrototypePlayerView(state, null, false, null);
  const noop = () => {};
  return {
    ...view, managementMode: true,
    staffRoles: [roleFixture], staffTraining: { inTrainingCount: 0, queuedCount: 0, capacity: 2, summaryLabel: "0/2 training" },
    facility: { ...view.facility, staff: [{ instanceId: employeeFixture.id, displayName: employeeFixture.displayName,
      roleDisplayName: "Receptionist", homeRoomInstanceId: state.rooms[0]!.id, trainingLevel: 1 }] },
    ownedRooms: view.ownedRooms.map((room) => ({ ...room, displayName: "Front Desk A" })),
    serviceIncome: { ...view.serviceIncome, appointmentsEnabled: true, catalogLines: [
      { id: "income.fixture.scheduled", displayName: "Fixture booked service", kind: "clinical", feeLabel: "$120",
        minimumFacilityLevel: 2, requirementLabel: "Fixture Room + Fixture Provider", available: true, group: "earning",
        scheduled: true, arrivalLabel: "Booked visitors about every 2 hr · also ordered from charts" },
      { id: "income.fixture.needs", displayName: "Fixture missing setup", kind: "remote", feeLabel: "$50", minimumFacilityLevel: 3,
        requirementLabel: "Laboratory + Laboratory Technician", available: false, group: "needs", unavailableReason: "Requires a laboratory",
        arrivalLabel: "Work you queue", setupActions: [
          { label: "Build Laboratory", target: "room", id: "room.laboratory" }, { label: "Hire Laboratory Technician", target: "staff", id: "staff.laboratory_technician" },
        ] },
      { id: "income.fixture.paused", displayName: "Fixture paused service", kind: "clinical", feeLabel: "$100", minimumFacilityLevel: 2,
        requirementLabel: "Fixture Equipment", available: false, group: "paused", pausedReason: "Paused: fixture equipment awaiting repair", arrivalLabel: "Ordered from patient charts" },
      { id: "income.fixture.future", displayName: "Fixture future service", kind: "retail", feeLabel: "$10", stockCostLabel: "$3", contributionLabel: "$7",
        minimumFacilityLevel: 4, requirementLabel: "Fixture outlet", available: false, group: "future", arrivalLabel: "Walk-up sales at the fixture outlet" },
    ], activeOperations: [{ id: "fixture.operation", incomeLineId: "income.fixture.scheduled", displayName: "Fixture queued work", actorLabel: "Fixture Visitor",
      providerLabel: "Fixture Provider", statusLabel: "Queued · awaiting resources", quoteFeeLabel: "$120" }],
    laboratoryWorkQueue: { enabled: true, statusLabel: "1 queued · 1 working" } },
    onEnterManagementMode: noop, onExitManagementMode: noop, onHireStaff: noop, onDecreaseEmployeeSalary: noop,
    onIncreaseEmployeeSalary: noop, onFireEmployee: noop, onTrainEmployee: noop, onPraiseEmployee: noop,
    onServiceAppointmentsEnabledChange: noop, onStartLaboratoryProcessing: noop, onAdvertisingLevelChange: noop, onSetupAction: noop,
    ...overrides,
  };
}
