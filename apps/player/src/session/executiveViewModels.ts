import { getExecutiveOfficeDuration, getExecutiveTrainingEffects } from "@gamify-surgery/balance-config";
import { getActiveExecutiveTerms, getExecutivePreparationQuote, getFacilityClock, getRoomDefinition,
  PROTOTYPE_DOMAIN_CONTEXT, type EmployeeState, type GameState } from "@gamify-surgery/game-domain";
import type { ExecutiveManagementView } from "../ui/types";

const n = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });

export function createExecutiveManagementView(state: GameState, employee?: EmployeeState): ExecutiveManagementView | undefined {
  if (state.facilityLevel < 5) return undefined;
  employee ??= state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive");
  const level = employee?.trainingLevel ?? 1;
  const office = state.rooms.find(room => room.id === employee?.homeRoomInstanceId && room.roomDefinitionId === "room.executive_office");
  const current = getExecutiveTrainingEffects(level), next = level < 5 ? getExecutiveTrainingEffects(level + 1) : null;
  const terms = getActiveExecutiveTerms(state, PROTOTYPE_DOMAIN_CONTEXT);
  const savedRound = state.levelFive?.management.round;
  const round = savedRound && (savedRound.id.startsWith("management.") || employee?.id === savedRound.employeeId) ? savedRound : null;
  const duration = getExecutiveOfficeDuration(office?.upgradeLevel ?? 1);
  const preparation = getExecutivePreparationQuote(state, PROTOTYPE_DOMAIN_CONTEXT);
  const labels = (effects: ReturnType<typeof getExecutiveTrainingEffects>) => [
    `+${n(effects.staffMoralePoints)} points/day`, `+${n(effects.visitorSatisfactionPoints)} points/visit`,
    `${n(effects.inspectionPreparationReductionPercent)}% less · ${n(60 * (1 - effects.inspectionPreparationReductionPercent / 100))} raw → ${Math.ceil(60 * (1 - effects.inspectionPreparationReductionPercent / 100))} min`,
    `${n(effects.supplierReductionPercent)}% off stock/upkeep`,
  ];
  const nowLabels = labels(current), nextLabels = next ? labels(next) : null, activeLabels = terms ? labels(terms.effects) : null;
  const savings = state.levelFive?.management.supplierSavings;
  return {
    homeLabel: office ? getRoomDefinition(office.roomDefinitionId)!.displayName : "Needs a reachable Executive Office",
    statusLabel: !employee ? "Hire an Executive for daily management" : round && round.employeeId !== employee.id && round.dayNumber === getFacilityClock(state).dayNumber
      ? "Today's round already ended; the next round begins tomorrow"
      : round?.employeeId === employee.id && round.dayNumber === getFacilityClock(state).dayNumber
      ? ({ walking_to_office: "Walking to the daily management round", working: `Daily management round · ${round.remainingWorkMinutes}/${round.durationMinutes} min left`,
        paused: `Round paused · ${round.remainingWorkMinutes} min left`, completed: "Today's management round completed", expired: "Unfinished round expired", cancelled: "Round cancelled" })[round.status]
      : "Daily round starts when available",
    durationLabel: `Office tier ${office?.upgradeLevel ?? 1}: ${n(duration.rawMinutes)} raw → ${duration.minutes} active min. Ladder 30/28.5/27/25.5/24 raw → 30/29/27/26/24 min.`,
    acceptedLabel: round ? `Day ${round.dayNumber} · accepted employee tier ${round.employeeTrainingLevel}, office tier ${round.officeUpgradeLevel} · ${n(round.rawDurationMinutes)} raw → ${round.durationMinutes} min · ${round.remainingWorkMinutes} remaining` : "No round accepted yet",
    lastRoundLabel: round ? round.completedAtFacilityTick !== null ? `Last completed: Day ${round.dayNumber}, tick ${round.completedAtFacilityTick}`
      : `Day ${round.dayNumber}: ${round.status.replaceAll("_", " ")}` : "No completed round",
    activeLabel: terms ? `Day ${terms.dayNumber} terms · employee tier ${terms.employeeTrainingLevel} · expire at tick ${terms.expiresAtFacilityTick}` : "No qualified terms for new quotes",
    preparationLabel: `Preparation terms: ${n(preparation.rawDurationMinutes)} raw → ${preparation.durationMinutes} min (ceiling once). Inspections arrive in a later milestone.`,
    effects: ["Staff morale", "Patient/visitor comfort", "Inspection preparation", "Supplier negotiation"].map((label, index) => ({
      label, currentLabel: nowLabels[index]!, nextLabel: nextLabels?.[index] ?? null, activeLabel: activeLabels?.[index] ?? "Inactive",
    })),
    savingsLabel: `Actual posted savings: stock $${n((savings?.stockCents ?? 0) / 100)} · upkeep $${n((savings?.upkeepSixtiethCents ?? 0) / 6000)}. Expense reductions; already included in costs.`,
  };
}
