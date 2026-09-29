import type {
  FounderActivityState,
  EncounterState,
  RetailOperationState,
  PlacedRoom,
  ServiceOperationState,
} from "@gamify-surgery/game-domain";

type FounderActivityInput = Pick<FounderActivityState, "kind" | "targetId" | "path" | "pathIndex"> | null;

function hasArrived(activity: Exclude<FounderActivityInput, null>): boolean {
  return activity.pathIndex >= activity.path.length - 1;
}

function isEndoscopyOperation(operation: ServiceOperationState | undefined, rooms: readonly PlacedRoom[]): boolean {
  if (!operation) return false;
  const isEndoscopy = operation.incomeLineId === "income.endoscopy" ||
    operation.incomeLineId === "income.advanced_endoscopy" ||
    operation.reservedRoomInstanceIds.some((roomId) =>
      rooms.find((room) => room.id === roomId)?.roomDefinitionId === "room.endoscopy",
    );
  return isEndoscopy;
}

function retailLabel(operation: RetailOperationState | undefined): string | undefined {
  if (!operation) return undefined;
  const item = operation.incomeLineId === "income.coffee"
    ? "coffee"
    : operation.incomeLineId.includes("drink") ? "a drink" : "a snack";
  if (operation.status === "purchasing") {
    return `Getting ${item}`;
  }
  return operation.status === "returning" ? "Walking through clinic" : "Going to kiosk";
}

/**
 * Maps only active founder work to a short visible activity box. Stationary
 * founder rest deliberately has no label, so a quiet clinic remains quiet.
 */
export function getFounderActivityLabel(input: {
  activity: FounderActivityInput;
  serviceOperations: readonly ServiceOperationState[];
  retailOperations: readonly RetailOperationState[];
  rooms: readonly PlacedRoom[];
  encounters?: readonly EncounterState[];
}): string | undefined {
  const retail = input.retailOperations.find((operation) =>
    operation.actorKind === "founder" &&
    !["completed", "abandoned", "cancelled"].includes(operation.status),
  );
  const retailActivity = retailLabel(retail);
  if (retailActivity) return retailActivity;

  const activity = input.activity;
  if (!activity) return undefined;
  const arrived = hasArrived(activity);
  switch (activity.kind) {
    case "perform_service":
      const operation = input.serviceOperations.find((candidate) => candidate.id === activity.targetId);
      const pending = input.encounters?.find((encounter) => encounter.pendingResult?.operationId === activity.targetId)?.pendingResult;
      const isEndoscopy = isEndoscopyOperation(operation, input.rooms) ||
        pending?.serviceIncomeLineId === "income.endoscopy" ||
        pending?.serviceIncomeLineId === "income.advanced_endoscopy" ||
        pending?.patientTravel?.destinationRoomInstanceId !== undefined &&
          input.rooms.find((room) => room.id === pending.patientTravel?.destinationRoomInstanceId)?.roomDefinitionId === "room.endoscopy";
      if (!arrived) return isEndoscopy ? "Walking to endoscopy" : "Walking to procedure";
      return isEndoscopy ? "Performing endoscopy" : "Performing procedure";
    case "collect_litter": return "Picking up trash";
    case "refill_water": return "Refilling water cooler";
    case "praise_employee": return "Praising employee";
    case "attend_encounter": return arrived ? "Talking to patient" : "Walking to patient";
    case "return_to_front_desk": return "Walking to Front Desk";
    case "wander_facility": return arrived ? undefined : "Walking through clinic";
    case "sit_in_chair": return arrived ? undefined : "Walking to a seat";
    case "visit_bathroom": return "Going to bathroom";
    case "walk_to_point": return arrived ? undefined : "Walking through clinic";
    default: return undefined;
  }
}
