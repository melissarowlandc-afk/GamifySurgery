import {
  EMPLOYEE_TRAINING_CAPACITY,
  type ServiceIncomeLine,
} from "@gamify-surgery/balance-config";
import {
  getEmployeeRoleTrainingPercent,
  getEmployeeTrainingRole,
  getFacilityClock,
  getOperatingExpensePerFacilityHour,
  getSupplierUpkeepSavingsPerFacilityHour,
  getPatientEncounterIncomeCents,
  getRollingIncomeSummary,
  getRoomDefinition,
  getStaffRoleDefinition,
  PROTOTYPE_DOMAIN_CONTEXT,
  ROLLING_INCOME_WINDOW_MINUTES,
  type DomainContext,
  type EmployeeState,
  type GameState,
  type RollingIncomeSourceId,
} from "@gamify-surgery/game-domain";
import { employeeTrainingBenefitLabel } from "./employeeTrainingViewModels";
import type {
  ManagementFinanceView,
  ServiceIncomeCatalogLineView,
  ServiceSetupActionView,
  StaffRoleTrainingSummaryView,
  StaffTrainingOverviewView,
} from "../ui/types";

const dollarsFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function dollars(value: number): string {
  return `$${dollarsFormatter.format(value)}`;
}

export function executiveHiringFundingLabel(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): string {
  const income = getRollingIncomeSummary(state);
  const wage = state.employees.some(employee => employee.staffRoleDefinitionId === "staff.executive") ? 0 :
    getStaffRoleDefinition("staff.executive", context)?.salaryPerExpenseInterval ?? 45;
  const current = income.incomePerHour - income.stockCostPerHour + getOperatingExpensePerFacilityHour(state, context);
  return `${dollars(current)}/hr current clinic net; ${dollars(current - wage)}/hr with the Executive on current income. Supplier terms are only 1–2% of stock/upkeep and do not fund the $45 wage. Existing service/Reading income can fund this optional role. $500 cash reserve is advisory.`;
}

export function hasTrainingRoom(state: GameState): boolean {
  return state.rooms.some((room) => room.roomDefinitionId === "room.training");
}

/** Training Room queue state; null until the player has built a Training Room. */
export function createStaffTrainingOverview(
  state: GameState,
): StaffTrainingOverviewView | null {
  if (!hasTrainingRoom(state)) return null;
  const inTrainingCount = state.employees.filter((employee) =>
    employee.training && employee.training.stage !== "queued" && employee.training.stage !== "returning").length;
  const queuedCount = state.employees.filter((employee) => employee.training?.stage === "queued").length;
  return {
    inTrainingCount,
    queuedCount,
    capacity: EMPLOYEE_TRAINING_CAPACITY,
    summaryLabel: `${inTrainingCount}/${EMPLOYEE_TRAINING_CAPACITY} training${queuedCount > 0 ? ` · ${queuedCount} queued` : ""}`,
  };
}

/** Role-wide average training level and the matching average benefit. */
export function createRoleTrainingSummary(
  state: GameState,
  roleId: string,
  employees: readonly EmployeeState[],
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): StaffRoleTrainingSummaryView | undefined {
  if (!hasTrainingRoom(state) || employees.length === 0 || !getEmployeeTrainingRole(roleId)) return undefined;
  const averageLevel = employees.reduce((total, employee) => total + employee.trainingLevel, 0) / employees.length;
  const averagePercent = getEmployeeRoleTrainingPercent(state, roleId);
  return {
    averageLevelLabel: `Avg Lv ${Number.isInteger(averageLevel) ? averageLevel : averageLevel.toFixed(1)}`,
    averageBenefitLabel: employeeTrainingBenefitLabel(
      roleId,
      averagePercent,
      context.balanceRelease.environment.glp1AutomationPayment,
    ),
  };
}

/** Role-average benefit after one more level for this employee, if trainable. */
export function createRoleAverageAfterTrainingLabel(
  state: GameState,
  roleId: string,
  employees: readonly EmployeeState[],
  employeeId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): string | undefined {
  const target = employees.find((employee) => employee.id === employeeId);
  if (!hasTrainingRoom(state) || !target || target.trainingLevel >= 5 || !getEmployeeTrainingRole(roleId)) return undefined;
  const next = Math.min(5, (target.training?.targetLevel ?? target.trainingLevel + 1)) as EmployeeState["trainingLevel"];
  const averagePercent = getEmployeeRoleTrainingPercent({
    ...state,
    employees: state.employees.map((employee) => employee.id === employeeId ? { ...employee, trainingLevel: next } : employee),
  }, roleId);
  return employeeTrainingBenefitLabel(roleId, averagePercent, context.balanceRelease.environment.glp1AutomationPayment);
}

function cadenceLabel(minutes: number): string {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
}

/** Plain description of how a catalog line brings money in. */
export function serviceArrivalLabel(line: ServiceIncomeLine, retailOutletLabel?: string): string {
  if (line.retail?.category === "authorized_order") return `Authorized supply orders only at ${retailOutletLabel ?? "the outlet"}`;
  if (line.retail) return `Walk-up sales at ${retailOutletLabel ?? "the shop"}`;
  const mode = line.operation?.visitorMode;
  const chartOrdered = line.eligibleRouteIds.length > 0 || line.operation?.encounterOnly;
  if (mode === "scheduled" && line.operation?.arrivalCadenceMinutes) {
    return `Booked visitors about every ${cadenceLabel(line.operation.arrivalCadenceMinutes)}${chartOrdered ? " · also ordered from charts" : ""}`;
  }
  if (mode === "work_queue") return "Work you queue";
  if (!line.operation && line.kind === "remote") return "Runs remotely while staffed";
  return "Ordered from patient charts";
}

interface ServiceSetupInput {
  levelLocked: boolean;
  available: boolean;
  missingCapabilityIds: readonly string[];
  missingRoomDefinitionIds: readonly string[];
  missingStaffRoleIds: readonly string[];
}

/**
 * Groups a catalog line for Management and offers Build/Hire shortcuts only
 * for rooms or roles the player does not have at all. A placed room that is
 * out of service (or hired staff who are away) pauses the line instead.
 */
export function createServiceSetupState(
  state: GameState,
  input: ServiceSetupInput,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): Pick<ServiceIncomeCatalogLineView, "group" | "pausedReason" | "setupActions"> {
  if (input.levelLocked) return { group: "future" };
  if (input.available) return { group: "earning" };
  const facility = context.balanceRelease.facility;
  const roomIds = new Set(input.missingRoomDefinitionIds);
  const staffIds = new Set(input.missingStaffRoleIds);
  for (const capabilityId of input.missingCapabilityIds) {
    const room = facility.roomDefinitions.find((definition) => definition.capabilityIds?.includes(capabilityId));
    const role = facility.staffRoleDefinitions.find((definition) => definition.capabilityIds?.includes(capabilityId));
    if (room) roomIds.add(room.id);
    else if (role) staffIds.add(role.id);
  }
  const actions: ServiceSetupActionView[] = [];
  const paused: string[] = [];
  for (const roomId of roomIds) {
    const definition = getRoomDefinition(roomId, context);
    if (!definition) continue;
    const placed = state.rooms.filter((room) => room.roomDefinitionId === roomId);
    if (placed.length > 0) {
      paused.push(placed.some((room) => room.maintenance?.status === "out_of_service")
        ? `${definition.displayName} awaiting repair`
        : `${definition.displayName} unavailable`);
    } else if (definition.buildable && definition.unlockFacilityLevel <= state.facilityLevel) {
      actions.push({ label: `Build ${definition.displayName}`, target: "room", id: roomId });
    }
  }
  for (const roleId of staffIds) {
    const definition = getStaffRoleDefinition(roleId, context);
    if (!definition) continue;
    if (state.employees.some((employee) => employee.staffRoleDefinitionId === roleId)) {
      paused.push(`${definition.displayName} unavailable`);
    } else if (definition.unlockFacilityLevel <= state.facilityLevel) {
      actions.push({ label: `Hire ${definition.displayName}`, target: "staff", id: roleId });
    }
  }
  if (actions.length === 0 && paused.length > 0) {
    return { group: "paused", pausedReason: `Paused: ${paused.join(", ")}` };
  }
  return { group: "needs", ...(actions.length > 0 ? { setupActions: actions } : {}) };
}

export function facilityTimeLabel(state: GameState, facilityTick: number): string {
  return getFacilityClock({ ...state, facilityTick }).displayLabel;
}

const INCOME_SOURCE_LABELS: Record<RollingIncomeSourceId, string> = {
  patient_encounters: "Patient encounters",
  patient_services: "Patient services",
  scheduled_services: "Scheduled services",
  telehealth_automation: "Telehealth automation",
  manual_telehealth: "Manual telehealth consults",
  reads: "Radiology reads",
  retail: "Retail purchases",
  remote_work: "Remote work",
  other: "Other settled income",
};

/** Settled income versus current obligations; opening totals include patients. */
export function createManagementFinanceView(
  state: GameState,
  totalsCents: { grossCents: number; stockCostCents: number; netCashDeltaCents: number },
  receiptDisplayName: (incomeLineId: string) => string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): ManagementFinanceView {
  const income = getRollingIncomeSummary(state);
  // Leave all expense rules in the domain. The difference from full room
  // upkeep is the current domain's relief, not a separate presentation rule.
  const operatingHourly = -getOperatingExpensePerFacilityHour(state, context);
  const roomCost = state.rooms.reduce((total, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    return definition
      ? total + definition.upkeepPerExpenseInterval + Math.max(0, room.upgradeLevel - 1) * definition.upkeepPerUpgradeLevel
      : total;
  }, 0);
  const staffCost = state.employees.reduce((total, employee) => total + employee.salaryPerExpenseInterval, 0);
  const advertising = context.balanceRelease.advertising.levels.find((level) => level.level === state.advertisingLevel);
  const advertisingCost = advertising?.hourlyCost ?? 0;
  const supplierSaving = getSupplierUpkeepSavingsPerFacilityHour(state, context);
  const relief = roomCost + staffCost + advertisingCost - operatingHourly - supplierSaving;
  const hourly = operatingHourly + income.stockCostPerHour;
  const hourlyNet = Math.round((income.incomePerHour - hourly) * 100) / 100 || 0;
  const encounterIncomeCents = getPatientEncounterIncomeCents(state);
  const earned = (encounterIncomeCents === 0 ? totalsCents.netCashDeltaCents : totalsCents.netCashDeltaCents + encounterIncomeCents) / 100;
  const spent = state.totalOperatingExpenses;
  const profit = Math.round((earned - spent) * 100) / 100;
  const runwayHours = operatingHourly > 0 ? Math.floor(state.cash / operatingHourly) : null;
  const incomeWindowLabel = income.earlyEstimate
    ? `Early estimate · since opening (${income.observedMinutes} game minutes)`
    : income.observedMinutes < ROLLING_INCOME_WINDOW_MINUTES
      ? `Since opening · ${dollarsFormatter.format(income.averagingHours)} game hour${income.averagingHours === 1 ? "" : "s"}`
      : `Last ${ROLLING_INCOME_WINDOW_MINUTES / 60} game hours`;
  const incomeWindowExplanation =
    `Settled payments from ${facilityTimeLabel(state, income.windowStartFacilityTick)} to ${facilityTimeLabel(state, income.windowEndFacilityTick)}. ` +
    (income.earlyEstimate ? "Receipts are spread over one game hour until the first hour has elapsed. " : "") +
    "Stock costs use the same income window. Upkeep, salaries, advertising and relief use current rates. Building, hiring and training are excluded.";
  const byLine = new Map<string, { displayName: string; net: number; count: number }>();
  for (const receipt of state.serviceIncomeReceipts) {
    const displayName = receiptDisplayName(receipt.incomeLineId);
    const entry = byLine.get(displayName) ?? { displayName, net: 0, count: 0 };
    entry.net += receipt.netCashDelta;
    entry.count += 1;
    byLine.set(displayName, entry);
  }
  return {
    cashLabel: dollars(state.cash),
    ...(state.facilityLevel >= 5 ? { supplierSavingsLabel: `Actual posted supplier savings: stock ${dollars((state.levelFive?.management.supplierSavings.stockCents ?? 0) / 100)} · upkeep ${dollars((state.levelFive?.management.supplierSavings.upkeepSixtiethCents ?? 0) / 6000)}. Already included in lower costs; payroll unchanged.` } : {}),
    earnedLabel: dollars(earned),
    billedLabel: dollars((encounterIncomeCents === 0 ? totalsCents.grossCents : totalsCents.grossCents + encounterIncomeCents) / 100),
    stockLabel: dollars(totalsCents.stockCostCents / 100),
    runningCostsLabel: dollars(spent),
    profitLabel: `${profit < 0 ? "−" : "+"}${dollars(Math.abs(profit))}`,
    profitPositive: profit >= 0,
    hourlyIncomeLabel: `${dollars(income.incomePerHour)}/hr`,
    hourlyNetLabel: `${hourlyNet < 0 ? "−" : hourlyNet > 0 ? "+" : ""}${dollars(Math.abs(hourlyNet))}/hr`,
    hourlyNetSign: hourlyNet < 0 ? "negative" : hourlyNet > 0 ? "positive" : "neutral",
    incomeWindowLabel,
    incomeWindowExplanation,
    hourlyIncomeSources: income.sources
      .filter((source) => source.id !== "other" || source.receiptCount > 0)
      .map((source) => ({
        id: source.id,
        label: INCOME_SOURCE_LABELS[source.id],
        amount: source.grossCents / 100 / income.averagingHours,
        amountLabel: `${dollars(source.grossCents / 100 / income.averagingHours)}/hr`,
        count: source.receiptCount,
      })),
    hourlyCostLabel: `${dollars(hourly)}/hr`,
    hourlyCosts: [
      { id: "staff", label: "Staff salaries", amount: staffCost, amountLabel: `${dollars(staffCost)}/hr` },
      { id: "rooms", label: "Room upkeep before relief", amount: roomCost, amountLabel: `${dollars(roomCost)}/hr` },
      {
        id: "advertising",
        label: `Advertising${advertising ? ` (${advertising.displayName})` : ""}`,
        amount: advertisingCost,
        amountLabel: `${dollars(advertisingCost)}/hr`,
      },
      { id: "stock", label: "Stock (recent average)", amount: income.stockCostPerHour, amountLabel: `${dollars(income.stockCostPerHour)}/hr` },
      { id: "relief", label: "Upkeep outage relief", amount: -relief, amountLabel: `${relief > 0 ? "−" : ""}${dollars(Math.abs(relief))}/hr` },
      ...(state.facilityLevel >= 5 ? [{ id: "supplier" as const, label: "Executive supplier upkeep reduction", amount: -supplierSaving, amountLabel: `−${dollars(supplierSaving)}/hr` }] : []),
    ],
    runwayLabel: runwayHours === null
      ? "No running costs right now."
      : runwayHours < 1
        ? "Cash covers less than 1 hour of running costs."
        : `Cash covers about ${runwayHours} hour${runwayHours === 1 ? "" : "s"} of running costs with no new income.`,
    recentEarnings: [...byLine.values()]
      .sort((a, b) => b.net - a.net)
      .map((entry) => ({ ...entry, netLabel: dollars(Math.round(entry.net * 100) / 100) })),
    recentEarningsReceiptCount: state.serviceIncomeReceipts.length,
  };
}
