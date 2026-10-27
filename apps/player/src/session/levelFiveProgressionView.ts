import { LEVEL_FIVE_INSPECTION_UNLOCK_MESSAGE, LEVEL_FIVE_INSPECTION_UNLOCK_TIP } from "@gamify-surgery/balance-config";
import { getInspectionBookingBlockedReason, type GameState, type ProgressionRequirementStatus } from "@gamify-surgery/game-domain";
import type { ProgressionGoalView, ProgressionView } from "../ui/types";
import { facilityTimeLabel } from "./managementViewModels";

const numberLabel = (value: number) => (Math.floor(value * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

export function levelFiveGoalView(state: GameState, requirement: ProgressionRequirementStatus): ProgressionGoalView {
  const base = { id: requirement.id, label: requirement.label, complete: requirement.met };
  if (requirement.id === "progression.clinical_xp") return { ...base, label: "Current-level Clinical XP",
    displayProgressLabel: `${numberLabel(requirement.current)}/${numberLabel(requirement.required)}`,
    progressLabel: `${numberLabel(requirement.current)}/${numberLabel(requirement.required)} XP` };
  if (requirement.id === "progression.satisfaction") return { ...base,
    displayProgressLabel: `${numberLabel(requirement.current)}%`,
    progressLabel: `${numberLabel(requirement.current)}% · goal above ${requirement.required - 1}%` };
  return { ...base,
    displayProgressLabel: state.employees.length ? `${numberLabel(requirement.current)}/${numberLabel(requirement.required)}` : "No staff",
    progressLabel: state.employees.length
    ? `${numberLabel(requirement.current)}/${numberLabel(requirement.required)} · ${state.employees.length} ${state.employees.length === 1 ? "employee" : "employees"}`
    : "No employees · hire staff to establish an average" };
}

export function createInspectionUnlockView(state: GameState): NonNullable<ProgressionView["inspectionUnlock"]> {
  const unlock = state.levelFive?.progress.inspectionUnlocked;
  return {
    unlocked: Boolean(unlock), statusLabel: unlock ? "Inspections unlocked" : "Inspections locked",
    ...(unlock ? { earnedLabel: `Earned ${facilityTimeLabel(state, unlock.earnedAtFacilityTick)}` } : {}),
    description: unlock ? LEVEL_FIVE_INSPECTION_UNLOCK_MESSAGE : "Meet all three goals together to unlock inspections.",
    bookingLabel: unlock ? "Book inspection" : "Book inspection · Locked",
    bookingDisabledReason: getInspectionBookingBlockedReason(state),
    ...(unlock ? { tip: LEVEL_FIVE_INSPECTION_UNLOCK_TIP } : {}),
  };
}
