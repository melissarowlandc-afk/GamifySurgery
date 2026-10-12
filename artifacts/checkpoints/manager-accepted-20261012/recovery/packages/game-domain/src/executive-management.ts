import { EXECUTIVE_TUNING, getExecutiveTrainingEffects, getExecutiveOfficeDuration } from "@gamify-surgery/balance-config";
import { createLevelFiveState } from "./level-five-state";
import { getFacilityClock, isRoomOperationalForFacilityWork } from "./selectors";
import { isEmployeeAwayForTraining } from "./employee-training";
import { findLevelFiveSupportPath, getLevelFiveSupportTarget } from "./level-five-support";
import type { DailyManagementRoundState, DailyManagementTerms, ExecutiveComfortQuote, ExecutiveStockQuote } from "./level-five-types";
import type { DomainContext, EmployeeState, EncounterState, GameState, GridPoint, ServiceOperationState } from "./types";

const terminal = (round: DailyManagementRoundState) => ["completed", "expired", "cancelled"].includes(round.status);
const same = (a: GridPoint, b: GridPoint | undefined | null) => !!b && a.x === b.x && a.y === b.y;
const deskId = "executiveChair";

export function getExecutiveDeskLocation(state: GameState, employee: EmployeeState): GridPoint | null {
  if (state.facilityLevel < 5 || employee.staffRoleDefinitionId !== "staff.executive") return null;
  const office = state.rooms.find(room => room.id === employee.homeRoomInstanceId && room.roomDefinitionId === "room.executive_office");
  return office ? getLevelFiveSupportTarget(office, deskId) : null;
}

function installed(state: GameState, employeeId: string, officeId: string, context: DomainContext): boolean {
  return state.facilityLevel >= 5 && state.employees.some(employee => employee.id === employeeId &&
    employee.staffRoleDefinitionId === "staff.executive" && employee.homeRoomInstanceId === officeId) &&
    state.rooms.some(room => room.id === officeId && room.roomDefinitionId === "room.executive_office") &&
    isRoomOperationalForFacilityWork(state, officeId, context);
}

/** Training/busyness retains installed coverage; loss of access/home ends new quotes. */
export function getActiveExecutiveTerms(state: GameState, context: DomainContext): DailyManagementTerms | null {
  const terms = state.levelFive?.management.activeTerms;
  return terms && terms.dayNumber === getFacilityClock(state, context).dayNumber && state.facilityTick < terms.expiresAtFacilityTick &&
    installed(state, terms.employeeId, terms.officeRoomInstanceId, context) ? terms : null;
}

export function getExecutivePreparationQuote(state: GameState, context: DomainContext) {
  const terms = getActiveExecutiveTerms(state, context);
  const reductionPercent = terms?.effects.inspectionPreparationReductionPercent ?? 0;
  const rawDurationMinutes = EXECUTIVE_TUNING.preparationMinutes * (1 - reductionPercent / 100);
  return { rawDurationMinutes, durationMinutes: Math.ceil(rawDurationMinutes), executiveQuote: terms ? {
    roundId: terms.roundId, employeeId: terms.employeeId, employeeTrainingLevel: terms.employeeTrainingLevel, reductionPercent,
  } : null };
}

function releaseRound(state: GameState, round: DailyManagementRoundState): void {
  const employee = state.employees.find(employee => employee.id === round.employeeId);
  if (employee?.facilityTask?.kind === "daily_management_round" && employee.facilityTask.targetId === round.id) {
    employee.facilityTask = null;
    employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
  }
  round.reservedContactId = null;
}

/** Command reconciliation never works, awards, renews or invents a daily round. */
export function reconcileExecutiveManagement(state: GameState, context: DomainContext): void {
  if (state.facilityLevel < 5) return;
  const terms = state.levelFive?.management.activeTerms;
  if (terms && (!state.employees.some(employee => employee.id === terms.employeeId && employee.staffRoleDefinitionId === "staff.executive" && employee.homeRoomInstanceId === terms.officeRoomInstanceId) ||
    !state.rooms.some(room => room.id === terms.officeRoomInstanceId && room.roomDefinitionId === "room.executive_office"))) state.levelFive!.management.activeTerms = null;
  const round = state.levelFive?.management.round;
  if (!round || terminal(round)) return;
  const employee = state.employees.find(employee => employee.id === round.employeeId && employee.homeRoomInstanceId === round.officeRoomInstanceId);
  const office = state.rooms.find(room => room.id === round.officeRoomInstanceId && room.roomDefinitionId === "room.executive_office");
  if (round.dayNumber !== getFacilityClock(state, context).dayNumber || !employee || !office) {
    releaseRound(state, round);
    round.status = employee && office ? "expired" : "cancelled";
  } else if (!installed(state, employee.id, office.id, context) || isEmployeeAwayForTraining(employee) ||
    employee.facilityTask?.kind !== "daily_management_round" || employee.facilityTask.targetId !== round.id ||
    !state.doors.some(door => door.id === employee.facilityTask?.supportDoorId && door.roomId === office.id)) {
    releaseRound(state, round); round.status = "paused";
    round.lastProgressAtFacilityTick = state.facilityTick;
  }
}

/** Run before optional breaks/idling. Movement itself uses the ordinary staff loop. */
export function advanceExecutiveManagement(state: GameState, context: DomainContext): void {
  if (state.facilityLevel < 5) return;
  reconcileExecutiveManagement(state, context);
  const day = getFacilityClock(state, context).dayNumber;
  let management = state.levelFive?.management;
  let round = management?.round;
  if (round && !terminal(round)) {
    const employee = state.employees.find(employee => employee.id === round!.employeeId)!;
    if (round.status !== "paused") {
      const target = getExecutiveDeskLocation(state, employee);
      if (!target || employee.pathIndex < employee.path.length - 1 || !same(employee.location, target)) {
        round.lastProgressAtFacilityTick = state.facilityTick; return;
      }
      // First seated observation starts work; walking never counts as administration.
      if (round.status === "walking_to_office") {
        round.status = "working"; round.lastProgressAtFacilityTick = state.facilityTick;
        // The approach is complete; retain the desk contact, release traversed doors.
        employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
        return;
      }
      const elapsed = Math.max(0, state.facilityTick - round.lastProgressAtFacilityTick);
      round.lastProgressAtFacilityTick = state.facilityTick;
      round.remainingWorkMinutes = Math.max(0, round.remainingWorkMinutes - elapsed);
      employee.facilityTask!.workMinutesRemaining = round.remainingWorkMinutes;
      if (round.remainingWorkMinutes > 0) return;
      for (const colleague of state.employees) colleague.morale = Math.max(0, Math.min(100, colleague.morale + round.effects.staffMoralePoints));
      round.status = "completed"; round.completedAtFacilityTick = round.effectsAppliedAtFacilityTick = state.facilityTick;
      management!.lastCompletedDayNumber = day;
      management!.activeTerms = { version: "daily-management-terms.v1", roundId: round.id, dayNumber: day,
        employeeId: round.employeeId, officeRoomInstanceId: round.officeRoomInstanceId,
        employeeTrainingLevel: round.employeeTrainingLevel, completedAtFacilityTick: state.facilityTick,
        expiresAtFacilityTick: day * getFacilityClock(state, context).operatingMinutesPerDay, effects: { ...round.effects } };
      releaseRound(state, round); return;
    }
  } else if (round?.dayNumber === day || management?.lastCompletedDayNumber === day) return;
  const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive" &&
    employee.homeRoomInstanceId && installed(state, employee.id, employee.homeRoomInstanceId, context));
  if (!employee || employee.facilityTask || employee.training || isEmployeeAwayForTraining(employee) ||
    employee.pathIndex < Math.max(0, employee.path.length - 1) || state.retailOperations.some(trip =>
      trip.actorKind === "employee" && trip.actorId === employee.id && !["completed", "abandoned", "cancelled"].includes(trip.status))) return;
  const office = state.rooms.find(room => room.id === employee.homeRoomInstanceId)!;
  const route = findLevelFiveSupportPath(state, office, deskId, employee.location, context);
  if (!route) return;
  if (!management) management = (state.levelFive ??= createLevelFiveState()).management;
  if (!round || terminal(round)) {
    const duration = getExecutiveOfficeDuration(office.upgradeLevel);
    round = management.round = { version: "daily-management-round.v1", id: `management.${day}.${employee.id}`, dayNumber: day,
      employeeId: employee.id, officeRoomInstanceId: office.id, status: "walking_to_office", acceptedAtFacilityTick: state.facilityTick,
      employeeTrainingLevel: employee.trainingLevel, officeUpgradeLevel: office.upgradeLevel,
      rawDurationMinutes: duration.rawMinutes, durationMinutes: duration.minutes, remainingWorkMinutes: duration.minutes,
      lastProgressAtFacilityTick: state.facilityTick, completedAtFacilityTick: null, effectsAppliedAtFacilityTick: null,
      reservedContactId: deskId, effects: { version: "executive-effect-quote.v1", ...getExecutiveTrainingEffects(employee.trainingLevel) } };
  }
  round.status = "walking_to_office"; round.reservedContactId = deskId; round.lastProgressAtFacilityTick = state.facilityTick;
  employee.path = route.path; employee.pathIndex = 0; employee.lastMovedAtFacilityTick = state.facilityTick;
  employee.facilityTask = { kind: "daily_management_round", targetId: round.id, supportDoorId: route.doorId,
    startedAtFacilityTick: round.acceptedAtFacilityTick, workMinutesRemaining: round.remainingWorkMinutes };
}

export function freezeExecutiveComfort(state: GameState, visit: EncounterState | ServiceOperationState, context: DomainContext): void {
  if (state.facilityLevel < 5 || visit.executiveComfort || "actorKind" in visit && visit.actorKind !== "visitor" ||
    "resolutionReason" in visit && visit.resolutionReason !== null) return;
  const terms = getActiveExecutiveTerms(state, context);
  visit.executiveComfort = { version: "executive-comfort.v1", roundId: terms?.roundId ?? null, employeeId: terms?.employeeId ?? null,
    employeeTrainingLevel: terms?.employeeTrainingLevel ?? null, acceptedAtFacilityTick: state.facilityTick,
    points: terms?.effects.visitorSatisfactionPoints ?? 0, appliedAtFacilityTick: null };
}

export function applyExecutiveComfort(state: GameState, visit: EncounterState | ServiceOperationState): void {
  const quote = visit.executiveComfort;
  if (!quote || quote.appliedAtFacilityTick !== null) return;
  if ("patientSatisfaction" in visit) visit.patientSatisfaction = Math.max(0, Math.min(100, visit.patientSatisfaction + quote.points));
  // Unscored visitors retain this explicit receipt, without entering scored history.
  quote.appliedAtFacilityTick = state.facilityTick;
}

export function quoteExecutiveStock(state: GameState, baseline: number, context: DomainContext): ExecutiveStockQuote | undefined {
  const terms = getActiveExecutiveTerms(state, context);
  if (!terms) return undefined;
  const baselineCostCents = Math.round(baseline * 100);
  return { version: "executive-stock.v1", roundId: terms.roundId, employeeTrainingLevel: terms.employeeTrainingLevel,
    acceptedAtFacilityTick: state.facilityTick, reductionPercent: terms.effects.supplierReductionPercent,
    baselineCostCents, costCents: Math.round(baseline * (1 - terms.effects.supplierReductionPercent / 100) * 100) };
}

export function normalizeExecutiveComfort(value: unknown, now: number): ExecutiveComfortQuote | undefined {
  if (value === undefined) return undefined;
  const q = value as ExecutiveComfortQuote;
  if (!q || q.version !== "executive-comfort.v1" || Object.keys(q).length !== 7 ||
    (q.employeeTrainingLevel === null ? q.points !== 0 || q.roundId !== null || q.employeeId !== null :
      !validTier(q.employeeTrainingLevel) || !validId(q.roundId) || !validId(q.employeeId) || q.points !== getExecutiveTrainingEffects(q.employeeTrainingLevel).visitorSatisfactionPoints) ||
    !validTick(q.acceptedAtFacilityTick, now) ||
    q.appliedAtFacilityTick !== null && (!validTick(q.appliedAtFacilityTick, now) || q.appliedAtFacilityTick < q.acceptedAtFacilityTick)) throw new Error("The saved Executive comfort quote is invalid.");
  return { ...q };
}
export function normalizeExecutiveStock(value: unknown, now: number, cost: number): ExecutiveStockQuote | undefined {
  if (value === undefined) return undefined;
  const q = value as ExecutiveStockQuote;
  if (!q || q.version !== "executive-stock.v1" || Object.keys(q).length !== 7 || !validTier(q.employeeTrainingLevel) || !validId(q.roundId) ||
    !validTick(q.acceptedAtFacilityTick, now) || !Number.isSafeInteger(q.baselineCostCents) || q.baselineCostCents < 0 ||
    q.reductionPercent !== getExecutiveTrainingEffects(q.employeeTrainingLevel).supplierReductionPercent ||
    q.costCents !== Math.round(q.baselineCostCents * (1 - q.reductionPercent / 100)) || q.costCents !== Math.round(cost * 100)) throw new Error("The saved Executive stock quote is invalid.");
  return { ...q };
}
const validId = (value: unknown) => typeof value === "string" && value.length > 0;
const validTier = (value: number) => Number.isInteger(value) && value >= 1 && value <= 5;
const validTick = (value: number, now: number) => Number.isSafeInteger(value) && value >= 0 && value <= now;

export function validateExecutiveTaskReservations(state: GameState): void {
  const round = state.levelFive?.management.round;
  const taskEmployee = round ? state.employees.find(employee => employee.id === round.employeeId) : undefined;
  if (round && !terminal(round) && round.status !== "paused" && taskEmployee?.staffRoleDefinitionId === "staff.executive" &&
    (taskEmployee.facilityTask?.kind !== "daily_management_round" || taskEmployee.facilityTask.targetId !== round.id)) throw new Error("The saved Executive round has no matching desk task.");
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (task?.kind !== "daily_management_round") continue;
    const round = state.levelFive?.management.round;
    if (state.facilityLevel < 5 || !round || terminal(round) || round.status === "paused" || round.employeeId !== employee.id ||
      employee.staffRoleDefinitionId !== "staff.executive" || employee.homeRoomInstanceId !== round.officeRoomInstanceId ||
      round.reservedContactId !== deskId || task.targetId !== round.id || task.workMinutesRemaining !== round.remainingWorkMinutes ||
      task.startedAtFacilityTick !== round.acceptedAtFacilityTick || !validId(task.supportDoorId) ||
      !same(getExecutiveDeskLocation(state, employee) ?? { x: NaN, y: NaN }, employee.path.at(-1))) throw new Error("The saved Executive desk reservation is invalid.");
  }
}
