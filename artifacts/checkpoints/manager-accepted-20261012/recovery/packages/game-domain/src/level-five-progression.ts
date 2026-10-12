import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import type { DomainContext, GameState } from "./types";

/** M7 must retain this durable gate before accepting any booking. */
export function getInspectionBookingBlockedReason(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): string | null {
  if (state.facilityLevel !== 5 || context.balanceRelease.facility.maximumPlayableLevel < 5) {
    return "Inspections unlock after the Level 5 goals are met.";
  }
  if (!state.levelFive?.progress.inspectionUnlocked) {
    return "Meet all three Level 5 goals together to unlock inspections.";
  }
  if (state.levelFive.inspection.status === "preparing" || state.levelFive.inspection.status === "running") {
    return "An inspection is already being prepared or running.";
  }
  return null;
}
