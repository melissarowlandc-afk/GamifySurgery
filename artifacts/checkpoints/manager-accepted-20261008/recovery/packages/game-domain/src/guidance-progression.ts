import { evaluateFacilityExperienceConditions } from "./facility-experience";
import { guidanceOwnsCondition } from "./guidance-tip-suppression";
import { getRetiredEndedSatisfactionSamples } from "./retired-encounters";
import { getClinicSatisfaction, getDisplayedClinicSatisfaction, getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import type { GuidanceTipAction } from "./guidance-tip-types";
import type { DomainContext, GameState } from "./types";

/** Match the actual remedy, never authored copy or a resolved occurrence. */
export function progressionRemedyHasLiveCondition(state: GameState, action: GuidanceTipAction | undefined, context: DomainContext): boolean {
  const missingRoom = (id: string): string => {
    const dependency = getRoomDefinition(id, context)?.requiredRoomDefinitionIds.find((required) => !state.rooms.some((room) => room.roomDefinitionId === required));
    return dependency ? missingRoom(dependency) : id;
  };
  return state.environment.facilityConditionOccurrences.some((occurrence) => {
    if (!action || occurrence.resolvedAtFacilityTick !== null || guidanceOwnsCondition(state, occurrence.conditionKey)) return false;
    const target = occurrence.target;
    if (action.kind === "place_room") {
      if (target?.kind === "build_mode") return missingRoom(target.id) === action.definitionId;
      const home = target?.kind === "staff_role" && getStaffRoleDefinition(target.id, context)?.requiredRoomDefinitionIds.find((id) => !state.rooms.some((room) => room.roomDefinitionId === id));
      return Boolean(home && missingRoom(home) === action.definitionId);
    }
    if (action.kind === "hire_staff") return target?.kind === "staff_role" && target.id === action.roleId;
    if (action.kind === "upgrade_room") return occurrence.conditionKey === "room_upgrade_requested" && target?.kind === "room" && target.id === action.roomId;
    if (action.kind === "restore_access") return target?.kind === "room" && target.id === action.roomId;
    if (action.kind === "level_up") return occurrence.conditionKey === "progression_eligible";
    return false;
  });
}

/** Real operational levers for a metric; none creates a navigation-only button. */
export function progressionMetricGuidance(state: GameState, goal: { id: string; current: number; required: number }, context: DomainContext): string | null {
  const remaining = Math.max(0, goal.required - goal.current).toLocaleString("en-US");
  if (goal.id === "progression.clinical_xp") return `Complete patient visits to earn ${remaining} more Clinical XP.`;
  if (goal.id === "progression.completed_encounters") return `Complete ${remaining} more patient ${goal.required - goal.current === 1 ? "visit" : "visits"} to meet the completed-patient goal.`;
  if (goal.id === "progression.endoscopy_completion") return "Complete the first endoscopy visit through the staffed Endoscopy and Peri-op/Recovery Rooms to meet this clinic goal.";
  if (goal.id === "progression.ambulatory_operation_completion") return "Complete the first ambulatory operation visit through the staffed OR and Peri-op/Recovery Rooms to meet this clinic goal.";
  if (goal.id !== "progression.satisfaction") return null;
  const stage = context.balanceRelease.facility.stageDefinitions.find((entry) => entry.level === state.facilityLevel)!;
  const current = getDisplayedClinicSatisfaction(state, context);
  const target = stage.satisfactionMustBeGreaterThan;
  if (getClinicSatisfaction(state, context) === null) return `Provisional satisfaction is ${current}% (goal: above ${target}%); complete patient visits to record a rating.`;
  const largest = evaluateFacilityExperienceConditions(state, context).conditions.sort((a, b) => b.penalty - a.penalty)[0];
  const roomName = (id: string) => getRoomDefinition(id, context)?.displayName ?? id;
  const roleName = (id: string) => getStaffRoleDefinition(id, context)?.displayName ?? id;
  const currentLevers: Record<string, string> = {
    visible_litter: "clear visible litter, the largest current facility penalty",
    dirty_cleanliness: "use EVS room cleaning to address dirty rooms, the largest current facility penalty",
    empty_water_cooler: "refill the empty water cooler, the largest current facility penalty",
    missing_waiting_room: `restore a working ${roomName("room.waiting")}, the largest current facility penalty`,
    missing_examination_room: `restore a working ${roomName("room.examination")}, the largest current facility penalty`,
    missing_bathroom: `restore a working ${roomName("room.bathroom")}, the largest current facility penalty`,
    no_receptionist: `restore ${roleName("staff.receptionist")} coverage, the largest current facility penalty`,
    low_staff_morale: "use salaries, praise or breaks to address low staff morale, the largest current facility penalty",
    unavailable_onsite_xray: `restore on-site ${roomName("room.xray")} coverage, the largest current facility penalty`,
  };
  let lever = largest ? currentLevers[largest.conditionKey] : undefined;
  if (!lever) {
    // Match the rolling rating's retained ended visits. Past causes can explain
    // the baseline, but must not be presented as still-active conditions.
    const ended = [...Object.values(state.encounters).filter((encounter) => encounter.finalPatientSatisfaction !== null &&
      encounter.resolvedAtFacilityTick !== null && ["completed", "walkout"].includes(encounter.resolutionReason ?? "")), ...getRetiredEndedSatisfactionSamples(state)]
      .sort((a, b) => b.resolvedAtFacilityTick! - a.resolvedAtFacilityTick! || b.id.localeCompare(a.id))
      .slice(0, context.balanceRelease.patientSatisfaction.rollingWindowSize);
    const losses = new Map<string, number>();
    for (const encounter of ended) for (const [cause, loss] of Object.entries(state.encounters[encounter.id]?.dissatisfactionByCause ?? {}))
      if (loss) losses.set(cause, (losses.get(cause) ?? 0) + loss.pointsLost);
    const cause = [...losses].filter(([, points]) => points > 0).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
    const recordedLevers: Record<string, string> = {
      excessive_waiting: "reduce patient waits, the largest recorded satisfaction loss",
      poor_cleanliness: "keep rooms clean for future visits; cleanliness caused the largest recorded loss",
      missing_amenities: "keep amenities working for future visits; missing amenities caused the largest recorded loss",
      no_receptionist: "maintain Front Desk coverage; unstaffed check-ins caused the largest recorded loss",
      imaging_unavailable: "maintain on-site imaging coverage; unavailable imaging caused the largest recorded loss",
    };
    lever = cause && recordedLevers[cause] || "complete patient visits with short waits and working amenities to improve the rolling rating";
  }
  return `Satisfaction is ${current}% (goal: above ${target}%); ${lever}.`;
}
