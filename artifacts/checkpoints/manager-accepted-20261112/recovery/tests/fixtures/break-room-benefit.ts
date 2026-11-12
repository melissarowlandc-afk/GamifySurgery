import {
  gameReducer, getCurrentPeriopNurseAttention, getEmployeeEffectiveMorale,
  getRoomDefinition, getRoomNavigationAnchor,
  type DomainContext, type EmployeeState, type GameState,
} from "@gamify-surgery/game-domain";
import { periopFlowFixture } from "../../packages/game-domain/tests/periop-nurse-flow-fixture";
import { createEarlyLevelFourEconomyState } from "../../tools/economy-audit/level-four-simulation";
import { createLevelFiveEconomyState } from "./level-five-economy";
import { integrationReviewTime, LevelFiveIntegrationJourney } from "./level-five-integration";

export type BreakBenefitRooms = "none" | "break" | "gym" | "both";

/** Funded synthetic clinics, real hires/doors/care/payroll/arrivals. Removing a
 * support room is a matched setup intervention; capital cost is reported apart
 * from operating income. No earned morale, completed care or goal is seeded. */
export function createBreakBenefitClinic(level: 3 | 4 | 5, rooms: BreakBenefitRooms, context: DomainContext, seed: string): GameState {
  const state = level === 3
    ? structuredClone(periopFlowFixture(2, 3, { amenities: true, surgery: true }).state)
    : level === 4 ? createEarlyLevelFourEconomyState(seed, context)
      : createLevelFiveEconomyState(context, { seed, scored: true });
  state.campaignSeed = seed;
  state.cash = 100_000; state.cashCents = 10_000_000;
  state.serviceAppointmentsEnabled = true;
  state.nextRoutineArrivalTick = state.facilityTick + context.balanceRelease.arrivals.routineBaseIntervalMinutes;
  state.nextFinancialPostingTick = state.facilityTick + context.balanceRelease.economy.postingIntervalMinutes;
  state.paused = false;
  for (const employee of state.employees) {
    employee.morale = context.balanceRelease.facility.staffRoleDefinitions.find(role => role.id === employee.staffRoleDefinitionId)!.baseMorale;
  }
  const removed = new Set(state.rooms.filter(room =>
    room.roomDefinitionId === "room.staff_break" && rooms !== "break" && rooms !== "both" ||
    room.roomDefinitionId === "room.staff_gym" && rooms !== "gym" && rooms !== "both",
  ).map(room => room.id));
  state.rooms = state.rooms.filter(room => !removed.has(room.id));
  state.doors = state.doors.filter(door => !removed.has(door.roomId));
  return state;
}

const moving = (employee: EmployeeState) => employee.pathIndex < employee.path.length - 1;
const queueStatus = (value: string) => value === "waiting_for_resources" || value === "waiting_for_next_phase";

/** A one-minute shadow intervention never enters the real trajectory. It
 * releases active breaks at home, and lets workers returning from a break reach
 * their already-assigned care contact. A task is counted only when this alone
 * allows dispatch/work/check-in that the ordinary shadow cannot perform.
 * Return-travel counts identify break-origin travel waits, not the marginal
 * extra distance versus a hypothetical ordinary home-to-care journey. */
function breakHeldCare(state: GameState, context: DomainContext, returning: ReadonlySet<string>): string[] {
  const affected = state.employees.filter(employee => employee.facilityTask?.kind === "take_break" || returning.has(employee.id));
  if (!affected.length || !state.serviceOperations.some(op => !["completed", "cancelled", "leaving"].includes(op.status)) &&
      !Object.values(state.encounters).some(encounter => encounter.checkInStatus === "awaiting_staff" && !encounter.resolutionReason)) return [];
  const command = { type: "ADVANCE_TICK" as const, operationId: `break.benefit.shadow.${state.facilityTick}`, advancedAtRealMs: integrationReviewTime(state, state.facilityTick + 1) };
  const freed = structuredClone(state);
  for (const original of affected) {
    const employee = freed.employees.find(row => row.id === original.id)!;
    const care = employee.facilityTask?.kind === "perform_service" || employee.facilityTask?.kind === "periop_attention";
    const home = freed.rooms.find(room => room.id === employee.homeRoomInstanceId);
    const target = care ? employee.path.at(-1) : home && getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId, context)!, "staff");
    if (!target) continue;
    if (employee.facilityTask?.kind === "take_break") employee.facilityTask = null;
    employee.location = { ...target }; employee.path = [{ ...target }]; employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
  }
  const normal = gameReducer(structuredClone(state), command, context), ready = gameReducer(freed, command, context);
  const holds: string[] = [];
  for (const operation of state.serviceOperations) {
    const a = normal.serviceOperations.find(row => row.id === operation.id), b = ready.serviceOperations.find(row => row.id === operation.id);
    if (!a || !b) continue;
    if (queueStatus(a.status) && !queueStatus(b.status) && !["cancelled", "leaving"].includes(b.status) ||
        (a.status === "walking_to_service" || a.status === "walking_between_phases") && b.status === "in_service") {
      holds.push(`${operation.id}:phase:${operation.phaseIndex}`);
      continue;
    }
    const at = getCurrentPeriopNurseAttention(a), bt = getCurrentPeriopNurseAttention(b);
    if (at && bt && at.kind === bt.kind && at.phaseIndex === bt.phaseIndex && at.remainingMinutes > bt.remainingMinutes) holds.push(`${operation.id}:attention:${at.kind}:${at.phaseIndex}`);
  }
  for (const encounter of Object.values(state.encounters)) {
    if (normal.encounters[encounter.id]?.checkInStatus === "awaiting_staff" && ready.encounters[encounter.id]?.checkInStatus === "checked_in") holds.push(`${encounter.id}:check-in`);
  }
  return holds;
}

export function measureBreakBenefitClinic(level: 3 | 4 | 5, rooms: BreakBenefitRooms, context: DomainContext, seed: string, days = 3) {
  const initial = createBreakBenefitClinic(level, rooms, context, seed);
  const journey = new LevelFiveIntegrationJourney(context, initial);
  const dayMinutes = (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
  const returning = new Set<string>(), heldTasks = new Set<string>();
  let seated = 0, outbound = 0, inbound = 0, breaksStarted = 0, breaksCompleted = 0, interrupted = 0;
  let waitMinutes = 0, staffMinutes = 0, moraleSum = 0, storedMoraleSum = 0, serviceCompletions = 0;
  const initialEmployeeCount = initial.employees.length;
  const daily: Array<Record<string, number>> = [];
  let last = { seated: 0, outbound: 0, inbound: 0, waitMinutes: 0, gross: 0, serviceCompletions: 0 };
  for (let minute = 0; minute < days * dayMinutes; minute++) {
    journey.pump();
    const state = journey.state;
    for (const employee of state.employees) {
      if (employee.facilityTask?.kind === "take_break") {
        if (moving(employee)) outbound++; else seated++;
      } else if (returning.has(employee.id) && moving(employee)) inbound++;
      staffMinutes++; moraleSum += getEmployeeEffectiveMorale(state, employee); storedMoraleSum += employee.morale;
    }
    const holds = breakHeldCare(state, context, returning);
    waitMinutes += holds.length; for (const hold of holds) heldTasks.add(hold);
    journey.tick();
    const after = journey.state;
    for (const employee of after.employees) {
      const before = state.employees.find(row => row.id === employee.id);
      if (employee.facilityTask?.kind === "take_break" && before?.facilityTask?.kind !== "take_break") breaksStarted++;
      if (before?.facilityTask?.kind === "take_break" && employee.facilityTask?.kind !== "take_break") {
        if (employee.lastBreakAtFacilityTick !== before.lastBreakAtFacilityTick && employee.morale > before.morale) breaksCompleted++;
        else interrupted++;
        if (moving(employee)) returning.add(employee.id);
      }
      if (!moving(employee) || employee.facilityTask && !["perform_service", "periop_attention", "take_break"].includes(employee.facilityTask.kind)) returning.delete(employee.id);
    }
    for (const operation of after.serviceOperations) if (operation.completedAtFacilityTick !== null &&
      state.serviceOperations.find(row => row.id === operation.id)?.completedAtFacilityTick == null) serviceCompletions++;
    if ((minute + 1) % dayMinutes === 0) {
      daily.push({ day: daily.length + 1, seated: seated - last.seated, outbound: outbound - last.outbound,
        inbound: inbound - last.inbound, breakRelatedCareWaitTaskMinutes: waitMinutes - last.waitMinutes,
        grossCents: journey.grossCents - last.gross, serviceCompletions: serviceCompletions - last.serviceCompletions });
      last = { seated, outbound, inbound, waitMinutes, gross: journey.grossCents, serviceCompletions };
    }
  }
  const state = journey.state;
  const scoredCompleted = (state.retiredEncounterSummary?.completedCount ?? 0) + Object.values(state.encounters).filter(e => e.resolutionReason === "completed").length;
  return { level, rooms, seed, days, dayMinutes, initialEmployeeCount, finalEmployeeCount: state.employees.length,
    breakStarts: breaksStarted, completedBreaks: breaksCompleted, interruptedBreaks: interrupted,
    seatedStaffMinutes: seated, outboundStaffMinutes: outbound, returnStaffMinutes: inbound,
    breakRelatedStaffMinutesPerDay: (seated + outbound + inbound) / days,
    seatedStaffMinutesPerDay: seated / days, breakRelatedCareWaitTaskMinutes: waitMinutes,
    uniqueCareTasksHeld: heldTasks.size, careWaitTaskMinutesPerDay: waitMinutes / days,
    grossCents: journey.grossCents, stockCents: journey.stockCents, operatingCostsCents: journey.paidCents,
    netOperatingCents: journey.grossCents - journey.stockCents - journey.paidCents,
    scoredCompleted, serviceCompletions, averageEffectiveMorale: moraleSum / staffMinutes,
    averageStoredMorale: storedMoraleSum / staffMinutes,
    closingAverageEffectiveMorale: state.employees.reduce((sum, employee) => sum + getEmployeeEffectiveMorale(state, employee), 0) / state.employees.length,
    daily };
}
