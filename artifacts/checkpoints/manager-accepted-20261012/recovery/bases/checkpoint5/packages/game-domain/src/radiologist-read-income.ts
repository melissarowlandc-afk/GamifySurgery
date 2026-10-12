import {
  DIAGNOSTIC_READING_WORKSTATIONS,
  RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID,
  RADIOLOGIST_OUTSIDE_INCOME_LINE_ID,
  RADIOLOGIST_READ_INCOME,
} from "@gamify-surgery/balance-config";
import { operatingDayMinutes } from "./alert-cadence";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getEmployeeRoleTrainingPercent } from "./employee-training-effects";
import { getQueuedEmployeeTrainingDepartures, isEmployeeAwayForTraining } from "./employee-training";
import { getRadiologistReadingStation } from "./reading-stations";
import { getReadingWorkMinutes, isReadingWorkMinute } from "./room-upgrade-reading";
import { isEmployeeAssignedToOperationalRoom, isRoomAvailableForNewFacilityWork } from "./selectors";
import type {
  DomainContext, EmployeeState, GameState, OutsideRadiologyRead,
  RadiologistReadIncomeState, RadiologistReadTotals,
} from "./types";

const active = (status: string) => !["completed", "cancelled", "abandoned"].includes(status);
const samePoint = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y;
const zeroTotals = (): RadiologistReadTotals => ({ inHouseReads: 0, inHouseIncomeCents: 0, outsideReads: 0, outsideIncomeCents: 0 });
const dayNumber = (state: GameState, context: DomainContext) => Math.floor(state.facilityTick / operatingDayMinutes(context)) + 1;

/** Independent of retained receipt history; reading the summary never earns cash. */
export function getRadiologistReadIncomeSummary(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): {
  today: RadiologistReadTotals; thisLevel: RadiologistReadTotals;
} {
  const history = state.radiologistReadIncome;
  return {
    today: history?.dayNumber === dayNumber(state, context) ? { ...history.today } : zeroTotals(),
    thisLevel: history?.facilityLevel === state.facilityLevel ? { ...history.thisLevel } : zeroTotals(),
  };
}

function currentHistory(state: GameState, context: DomainContext): RadiologistReadIncomeState {
  const summary = getRadiologistReadIncomeSummary(state, context);
  state.radiologistReadIncome = {
    version: "radiologist-read-income.v1", nextOutsideReadSequence: state.radiologistReadIncome?.nextOutsideReadSequence ?? 0,
    dayNumber: dayNumber(state, context), facilityLevel: state.facilityLevel, ...summary,
  };
  return state.radiologistReadIncome;
}

/** Counts actual completions, including legacy reads whose bundle is already paid. */
export function recordRadiologistReadCompletion(state: GameState, kind: "in_house" | "outside", fee: number, context: DomainContext): void {
  const cents = Math.round(fee * 100);
  const history = currentHistory(state, context);
  for (const totals of [history.today, history.thisLevel]) {
    if (kind === "in_house") { totals.inHouseReads += 1; totals.inHouseIncomeCents += cents; }
    else { totals.outsideReads += 1; totals.outsideIncomeCents += cents; }
  }
}

/** Uses the ordinary income receipts and cash presentation, with no feed event. */
export function creditRadiologistRead(
  state: GameState, kind: "in_house" | "outside", transactionKey: string,
  employeeId: string, fee: number, context: DomainContext,
): void {
  if (state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === transactionKey)) return;
  const cents = Math.round(fee * 100);
  const amount = cents / 100;
  state.serviceIncomeReceipts.push({
    id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`, transactionKey,
    incomeLineId: kind === "in_house" ? RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID : RADIOLOGIST_OUTSIDE_INCOME_LINE_ID,
    catalogVersion: 1, routeId: null, actorKind: "remote", actorId: employeeId,
    displayAnchor: { actorKind: "employee", actorId: employeeId },
    grossAmount: amount, stockCost: 0, netCashDelta: amount, completedAtFacilityTick: state.facilityTick,
  });
  state.cashCents += cents;
  state.cash = state.cashCents / 100;
  recordRadiologistReadCompletion(state, kind, amount, context);
}

export function isRadiologistAvailableForOutsideRead(state: GameState, employee: EmployeeState, context: DomainContext): boolean {
  const post = getRadiologistReadingStation(state, employee, context);
  if (!post || !isEmployeeAssignedToOperationalRoom(state, employee.id, context) ||
    !isRoomAvailableForNewFacilityWork(state, post.roomInstanceId, context) ||
    isEmployeeAwayForTraining(employee) || employee.facilityTask ||
    employee.pathIndex < Math.max(0, employee.path.length - 1) || !samePoint(employee.location, post.location) ||
    getQueuedEmployeeTrainingDepartures(state, context, state.facilityTick, new Set(), true).some((departure) => departure.employeeId === employee.id)) return false;
  if (state.serviceOperations.some((operation) => active(operation.status) && operation.reservedRoomInstanceIds.includes(post.roomInstanceId) &&
      !(operation.diagnosticPhaseWork?.kind === "interpretation" && operation.diagnosticPhaseWork.resource?.stationId && operation.diagnosticPhaseWork.resource.stationId !== post.station.id)) ||
    state.serviceOperations.some((operation) => active(operation.status) &&
      (operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id)) ||
    state.retailOperations.some((operation) => active(operation.status) &&
      (operation.servingEmployeeId === employee.id || operation.actorKind === "employee" && operation.actorId === employee.id)) ||
    // A queued conversation or completed summary does not occupy the reader.
    // Open/active discussion and feedback still pause outside work.
    Object.values(state.employeeDiscussions ?? {}).some((discussion) => discussion.employeeId === employee.id &&
      discussion.lifecycle !== "waiting_unopened" && discussion.lifecycle !== "resolved_summary_available" &&
      discussion.lifecycle !== "resolved" && discussion.lifecycle !== "cancelled") ||
    state.environment.founderActivity?.kind === "praise_employee" && state.environment.founderActivity.targetId === employee.id) return false;
  return true;
}

export function outsideReadEndsAtTick(read: OutsideRadiologyRead): number {
  return read.startedAtFacilityTick + read.durationMinutes;
}

function canContinue(state: GameState, read: OutsideRadiologyRead, context: DomainContext): boolean {
  const employee = state.employees.find((entry) => entry.id === read.employeeId);
  const post = employee && getRadiologistReadingStation(state, employee, context);
  return Boolean(employee && post && post.roomInstanceId === read.roomInstanceId && post.station.id === read.stationId &&
    state.facilityTick - read.lastObservedAtFacilityTick <= 1 &&
    employee.lastMovedAtFacilityTick <= Math.floor(read.startedAtFacilityTick) &&
    isRadiologistAvailableForOutsideRead(state, employee, context));
}

/** Present only currently eligible work, including the short priority handoff. */
export function getActiveOutsideRadiologyReads(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): OutsideRadiologyRead[] {
  return (state.outsideRadiologyReads ?? []).filter((read) => canContinue(state, read, context));
}

function finishOutsideRead(state: GameState, read: OutsideRadiologyRead, context: DomainContext): void {
  creditRadiologistRead(state, "outside", `income.outside-read.${read.sequence}`, read.employeeId, read.fee, context);
  state.outsideRadiologyReads = state.outsideRadiologyReads?.filter((entry) => entry !== read);
}

/** At most one observing minute may delay a center study. Longer work is unpaid. */
export function prepareRadiologistForInHouseRead(state: GameState, employeeId: string, context: DomainContext): boolean {
  const read = state.outsideRadiologyReads?.find((entry) => entry.employeeId === employeeId);
  if (!read) return true;
  if (canContinue(state, read, context)) {
    const remaining = outsideReadEndsAtTick(read) - state.facilityTick;
    if (remaining <= 0) { finishOutsideRead(state, read, context); return true; }
    if (remaining <= RADIOLOGIST_READ_INCOME.finishOutsideBeforeInHouseMaximumMinutes) return false;
  }
  state.outsideRadiologyReads = state.outsideRadiologyReads?.filter((entry) => entry !== read);
  return true;
}

/** Only this near-complete outside work is a nonpreemptible forecast claim. */
export function getOutsideReadPriorityEnd(state: GameState, employeeId: string, context: DomainContext): number | null {
  const read = state.outsideRadiologyReads?.find((entry) => entry.employeeId === employeeId);
  if (!read || !canContinue(state, read, context)) return null;
  const end = outsideReadEndsAtTick(read);
  return end > state.facilityTick && end - state.facilityTick <= RADIOLOGIST_READ_INCOME.finishOutsideBeforeInHouseMaximumMinutes ? Math.ceil(end) : null;
}

function hasQueuedCenterRead(state: GameState, employee: EmployeeState): boolean {
  return state.serviceOperations.some((operation) => {
    const work = operation.diagnosticPhaseWork;
    return work?.kind === "interpretation" && active(operation.status) && operation.status === "waiting_for_resources" &&
      (work.readingUpgradeWork?.readyAtTick ?? operation.createdAtFacilityTick) <= state.facilityTick &&
      (!work.resource || work.resource.employeeIds.includes(employee.id));
  });
}

function createOutsideRead(state: GameState, employee: EmployeeState, context: DomainContext, startedAtTick: number): OutsideRadiologyRead {
  const post = getRadiologistReadingStation(state, employee, context)!;
  const room = state.rooms.find((entry) => entry.id === post.roomInstanceId)!;
  const reduction = getEmployeeRoleTrainingPercent(state, "staff.radiologist");
  const history = currentHistory(state, context);
  return {
    version: "outside-radiology-read.v1", sequence: history.nextOutsideReadSequence++, employeeId: employee.id,
    roomInstanceId: room.id, stationId: post.station.id, startedAtFacilityTick: startedAtTick,
    lastObservedAtFacilityTick: state.facilityTick, baselineMinutes: RADIOLOGIST_READ_INCOME.outsideDurationMinutes,
    employeeReductionPercent: reduction, upgradeLevel: room.upgradeLevel,
    durationMinutes: getReadingWorkMinutes(RADIOLOGIST_READ_INCOME.outsideDurationMinutes, reduction, room.upgradeLevel),
    fee: RADIOLOGIST_READ_INCOME.outsideFee,
  };
}

/** Called around ordinary service dispatch, never during load or paused time. */
export function advanceOutsideRadiologyReads(state: GameState, context: DomainContext, startNewWork: boolean): void {
  const continuousStarts = new Map<string, number>();
  for (const read of [...state.outsideRadiologyReads ?? []]) {
    const employee = state.employees.find((entry) => entry.id === read.employeeId);
    if (!employee || !canContinue(state, read, context) || state.facilityTick - read.lastObservedAtFacilityTick > 1) {
      state.outsideRadiologyReads = state.outsideRadiologyReads?.filter((entry) => entry !== read);
      continue;
    }
    read.lastObservedAtFacilityTick = state.facilityTick;
    const end = outsideReadEndsAtTick(read);
    if (end <= state.facilityTick) {
      finishOutsideRead(state, read, context);
      continuousStarts.set(employee.id, end);
    } else if (hasQueuedCenterRead(state, employee) && end - state.facilityTick > RADIOLOGIST_READ_INCOME.finishOutsideBeforeInHouseMaximumMinutes) {
      state.outsideRadiologyReads = state.outsideRadiologyReads?.filter((entry) => entry !== read);
    }
  }
  // Starting again at the prior exact endpoint keeps fractional work continuous.
  // Dispatch gets first claim whenever a center study is already queued.
  for (const employee of state.employees) {
    if ((!startNewWork && !continuousStarts.has(employee.id)) ||
      state.outsideRadiologyReads?.some((read) => read.employeeId === employee.id) ||
      !isRadiologistAvailableForOutsideRead(state, employee, context) || hasQueuedCenterRead(state, employee)) continue;
    (state.outsideRadiologyReads ??= []).push(createOutsideRead(state, employee, context, continuousStarts.get(employee.id) ?? state.facilityTick));
  }
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const integer = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const money = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 100));
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function normalizeRadiologistReadIncome(value: unknown): RadiologistReadIncomeState | undefined {
  if (value === undefined) return undefined;
  const totals = (candidate: unknown) => record(candidate) && Object.keys(zeroTotals()).every((key) => integer(candidate[key]));
  if (!record(value) || value.version !== "radiologist-read-income.v1" || !integer(value.nextOutsideReadSequence) ||
    !integer(value.dayNumber) || value.dayNumber < 1 || !integer(value.facilityLevel) || value.facilityLevel > 5 ||
    !totals(value.today) || !totals(value.thisLevel)) throw new Error("The saved radiologist read income is invalid.");
  return copy(value) as unknown as RadiologistReadIncomeState;
}

export function normalizeOutsideRadiologyReads(value: unknown, facilityTick: number): OutsideRadiologyRead[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || !value.every((read) => record(read) && read.version === "outside-radiology-read.v1" &&
    integer(read.sequence) && id(read.employeeId) && id(read.roomInstanceId) && DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === read.stationId) &&
    isReadingWorkMinute(read.startedAtFacilityTick) && read.startedAtFacilityTick <= facilityTick && integer(read.lastObservedAtFacilityTick) &&
    read.lastObservedAtFacilityTick >= read.startedAtFacilityTick && read.lastObservedAtFacilityTick <= facilityTick &&
    isReadingWorkMinute(read.baselineMinutes) && read.baselineMinutes > 0 && typeof read.employeeReductionPercent === "number" &&
    Number.isFinite(read.employeeReductionPercent) && read.employeeReductionPercent >= 0 && read.employeeReductionPercent <= 40 &&
    integer(read.upgradeLevel) && read.upgradeLevel >= 1 && read.upgradeLevel <= 5 && money(read.fee) &&
    read.durationMinutes === getReadingWorkMinutes(read.baselineMinutes, read.employeeReductionPercent, read.upgradeLevel)) ||
    new Set(value.map((read) => read.employeeId)).size !== value.length || new Set(value.map((read) => read.sequence)).size !== value.length) {
    throw new Error("The saved outside radiology reads are invalid.");
  }
  return copy(value) as OutsideRadiologyRead[];
}
