import { getAvailableEmployeeHomeRoom, getRoomDefinition, type DomainEvent, type FacilityConditionOccurrenceState, type GameState } from "@gamify-surgery/game-domain";
import type { MessageBoardItemView } from "../ui/types";

export function ambientSpeaker(message: string): string {
  const subjects: Array<[RegExp, string]> = [
    [/waiting.?room plant|\bplant\b/i, "Waiting-room plant"],
    [/break.?room fridge|\bfridge\b|leftovers|yogurt/i, "Break-room fridge"],
    [/front desk phone|\bphone\b/i, "Front Desk phone"],
    [/label maker/i, "Label maker"], [/reading|radiologist/i, "Reading Room"],
    [/pharmacy|pharmacist/i, "Pharmacy"], [/laborator|specimen|tube/i, "Laboratory"],
    [/operating room/i, "Operating Room"], [/\bOR\b/, "Operating Room"], [/water cooler/i, "Water cooler"],
    [/printer|cyan|printed/i, "Printer"], [/waiting.?room|magazine/i, "Waiting Room"],
    [/break.?room|mug|spoon/i, "Break Room"], [/thermostat/i, "Thermostat"],
    [/clipboard|pen|front desk/i, "Front Desk"], [/bathroom|soap/i, "Bathroom"],
    [/supply|gloves/i, "Supply closet"], [/examination|gown/i, "Examination Room"],
  ];
  return subjects.find(([pattern]) => pattern.test(message))?.[1] ?? "Clinic grapevine";
}

export function clinicFeedSpeaker(state: GameState, item: MessageBoardItemView, event?: DomainEvent, occurrence?: FacilityConditionOccurrenceState): string {
  const key = occurrence?.conditionKey;
  if (item.targetType === "water_cooler" || key === "empty_water_cooler" || event?.type === "water_cooler_low") return "Water cooler";
  if (item.targetType === "litter" || key === "visible_litter" || key === "dirty_cleanliness") return "Housekeeping";
  if (key === "low_cash" || key === "no_cash" || item.targetType === "money" || item.targetType === "emergency_glp1") return "Finance";
  if (item.targetType === "advertising" || key === "advertising_recommended" || key === "no_receptionist") return "Front Desk";
  const target = occurrence?.target ?? event?.target;
  const encounterId = event?.encounterId ?? (target?.kind === "encounter" ? target.id : item.targetType === "patient" ? item.targetId : undefined);
  if (encounterId) return state.encounters[encounterId]?.patientDisplayName ?? "Patient";
  if (target?.kind === "employee" || item.targetType === "employee") return state.employees.find((employee) => employee.id === (target?.id ?? item.targetId))?.displayName ?? "Staff";
  if (target?.kind === "room" || item.targetType === "room") {
    const room = state.rooms.find((candidate) => candidate.id === (target?.id ?? item.targetId));
    if (room) return getRoomDefinition(room.roomDefinitionId)?.displayName ?? "Room";
  }
  if (item.targetType === "build_mode" && item.targetId) return getRoomDefinition(item.targetId)?.displayName ?? "Front Desk";
  if (item.targetType === "staff_role" && item.targetId) {
    const home = getAvailableEmployeeHomeRoom(state, item.targetId);
    if (home) return getRoomDefinition(home.roomDefinitionId)?.displayName ?? "Front Desk";
  }
  if (item.targetType === "save") return "Campaign storage";
  return "Front Desk";
}

/** Reminders and severity changes supersede presentation, never recovery. */
export function supersededConditionOccurrenceIds(occurrences: readonly FacilityConditionOccurrenceState[]): Set<string> {
  const renewed = new Set<string>();
  const preceding = new Map<string, FacilityConditionOccurrenceState>();
  for (const occurrence of [...occurrences].sort((left, right) => left.occurredAtFacilityTick - right.occurredAtFacilityTick)) {
    const finance = occurrence.conditionKey === "low_cash" || occurrence.conditionKey === "no_cash";
    const key = finance ? "finance.cash" : JSON.stringify([occurrence.conditionKey, occurrence.definitionId, occurrence.target?.kind, occurrence.target?.id]);
    const prior = preceding.get(key);
    // Includes legacy saves that recorded renewal as resolution at this tick.
    if ((finance || occurrence.kind === "reminder") && prior && (prior.resolvedAtFacilityTick === null || prior.resolvedAtFacilityTick >= occurrence.occurredAtFacilityTick)) renewed.add(prior.id);
    preceding.set(key, occurrence);
  }
  return renewed;
}

/** Keep the problem and joke; the one-click button supplies the instruction. */
export function problemOnlyActionCopy(message: string): string {
  return message.split(/(?<=[.!?])\s+/).filter((sentence) =>
    !/^(?:Select|Click|Open|Refill|Send|Hire|Build|Place|Restore|Raise|Lower|Increase|Reduce|Run|Complete|Upgrade|Add)\b/i.test(sentence) &&
    sentence !== "Keep operating costs funded.",
  ).join(" ");
}
