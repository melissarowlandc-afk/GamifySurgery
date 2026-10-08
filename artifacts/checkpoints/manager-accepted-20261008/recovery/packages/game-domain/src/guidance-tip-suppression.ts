import { GUIDANCE_TIP_POLICY } from "@gamify-surgery/balance-config";
import { TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID } from "./context";
import type { GameState } from "./types";

/** The shared introductory delivery gate, independent of tutorial coaching. */
export function guidanceDeliveryUnlocked(state: GameState): boolean {
  const tips = state.alertHumor.guidanceTips;
  if (!tips || ![TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].every((id) => state.encounters[id]?.resolutionReason === "completed")) return false;
  const completed = tips.introductoryCompletedAtTick ?? Math.max(...[TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].map((id) => state.encounters[id]?.resolvedAtFacilityTick ?? tips.initializedAtTick));
  return state.facilityTick - completed >= GUIDANCE_TIP_POLICY.introductoryQuietMinutes;
}

export function guidanceOwnsCondition(state: GameState, conditionKey: string): boolean {
  // The required Level-0 room keeps its existing actionable condition row.
  // T38 yields to that remedy, including after the introductory delivery gate.
  if (!state.alertHumor.guidanceTips || conditionKey === "missing_examination_room" && state.facilityLevel === 0) return false;
  return ["visible_litter", "dirty_cleanliness", "empty_water_cooler", "missing_waiting_room", "missing_examination_room", "missing_bathroom", "no_receptionist", "low_staff_morale", "unavailable_onsite_xray", "room_upgrade_requested", "advertising_recommended", "progression_eligible"].includes(conditionKey);
}
