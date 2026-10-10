import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  activeRetailOperationForActor,
  getFounderBreakSeatClaim,
  getPatientAmenityTrip,
  getRoomDefinition,
  getActiveOutsideRadiologyReads,
  getRoomInstanceFootprint,
  getRoomNavigationAnchor,
  getCurrentPeriopNurseAttention,
  getPlacedRoomIdleSpotAt,
  isEmployeeAssignedToOperationalRoom,
  periopNurseAttentionStatus,
  getStaffRoleDefinition,
  type EmployeeState,
  type EncounterState,
  type GameState,
  type GridPoint,
  type PlacedRoom,
  type RetailOperationState,
  type ServiceOperationState,
} from "@gamify-surgery/game-domain";

import type {
  FacilityCharacterDescription,
  FacilityCharacterRef,
} from "../facility/types";
import { getFounderActivityLabel } from "./founderActivityPresentation";

/*
 * Short "what are they doing" text for the map info box (owner request,
 * 2026-10-07). Presentation only: it reads the live game state and never
 * changes it. Wording stays non-clinical; test names come from the chart's
 * existing pending label.
 */

function samePoint(left: GridPoint | null | undefined, right: GridPoint | null | undefined): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function roomById(state: GameState, roomId: string | null | undefined): PlacedRoom | undefined {
  return roomId ? state.rooms.find((room) => room.id === roomId) : undefined;
}

function roomName(room: PlacedRoom | undefined): string | null {
  return room ? getRoomDefinition(room.roomDefinitionId)?.displayName ?? null : null;
}

function theRoom(room: PlacedRoom | undefined, fallback: string): string {
  const name = roomName(room);
  return name ? `the ${name}` : fallback;
}

function arrived(path: readonly GridPoint[], pathIndex: number): boolean {
  return pathIndex >= path.length - 1;
}

const OUTLET_PLACES: Record<string, string> = {
  "room.coffee_kiosk": "the coffee kiosk",
  "room.vending": "the vending machine",
  "room.gift_shop": "the gift shop",
  "room.pharmacy": "the pharmacy",
};

function retailPurchase(incomeLineId: string): string {
  if (incomeLineId === "income.coffee") return "Getting coffee";
  if (incomeLineId.includes("drink")) return "Buying a drink";
  if (incomeLineId.includes("snack")) return "Buying a snack";
  if (incomeLineId.startsWith("income.gift_shop")) return "Buying a gift";
  return "Picking up supplies";
}

export function describeRetailTrip(state: GameState, operation: RetailOperationState): string {
  const outlet = roomById(state, operation.outletRoomInstanceId);
  const place = (outlet && OUTLET_PLACES[outlet.roomDefinitionId]) ?? theRoom(outlet, "the shop");
  switch (operation.status) {
    case "walking_to_outlet":
      return operation.incomeLineId === "income.coffee" ? "Going to get coffee" : `Walking to ${place}`;
    case "queued":
      return `In line at ${place}`;
    case "purchasing":
      return retailPurchase(operation.incomeLineId);
    case "returning":
      return `Walking back from ${place}`;
    default:
      return "Leaving";
  }
}

function lineName(incomeLineId: string): string {
  return getServiceIncomeLine(incomeLineId)?.displayName ?? "their visit";
}

function describeServiceOperation(operation: ServiceOperationState, tick: number): string {
  const bed = operation.periopBedReservation;
  const destination = operation.path.at(-1);
  if (bed && ["in_service", "waiting_for_next_phase"].includes(operation.status) && operation.pathIndex < operation.path.length - 1 &&
      destination?.x === bed.endpoint.x && destination.y === bed.endpoint.y) return "Walking to a peri-op bed";
  const nurseWait = periopNurseAttentionStatus(operation, tick);
  if (nurseWait) return nurseWait;
  if (operation.resourceWaitReason) return operation.resourceWaitReason;
  const name = lineName(operation.incomeLineId);
  switch (operation.status) {
    case "arriving": return "Arriving";
    case "waiting_for_resources": return `Waiting for ${name}`;
    case "walking_to_service": return `Walking to ${name}`;
    case "in_service": return `${name} in progress`;
    case "walking_between_phases": return "Moving to the next step";
    case "waiting_for_next_phase": return "Waiting for the next step";
    case "discharging": return "Getting ready to leave";
    default: return "Going home";
  }
}

/** "CT abdomen pending" → "Waiting for CT abdomen"; keeps acronyms intact. */
function waitingForPendingLabel(label: string | null | undefined): string {
  const base = (label ?? "").replace(/\s+pending\.?$/i, "").trim();
  if (!base || base === label) return "Waiting for results";
  const softened = /^[A-Z][a-z]/.test(base) ? base[0]!.toLowerCase() + base.slice(1) : base;
  return `Waiting for ${softened}`;
}

const PUBLIC_ROOMS = new Set(["room.waiting", "room.hallway", "room.front_desk", "room.vending", "room.coffee_kiosk"]);

function roomAtPoint(state: GameState, point: GridPoint | null | undefined): PlacedRoom | undefined {
  if (!point) return undefined;
  return state.rooms.find((room) => {
    const footprint = getRoomInstanceFootprint(state, room.id);
    return Boolean(footprint && point.x >= room.x && point.x < room.x + footprint.width &&
      point.y >= room.y && point.y < room.y + footprint.height);
  });
}

function describePatient(state: GameState, encounter: EncounterState): string {
  const bathroom = getPatientAmenityTrip(state, "encounter", encounter.id);
  if (bathroom) {
    return bathroom.status === "walking_to_amenity"
      ? "Walking to the bathroom"
      : bathroom.status === "using_amenity"
        ? "In the bathroom"
        : "Walking back from the bathroom";
  }
  const retail = activeRetailOperationForActor(state, "encounter", encounter.id);
  if (retail) return describeRetailTrip(state, retail);
  const service = state.serviceOperations.find((operation) =>
    operation.actorKind === "encounter" && operation.actorId === encounter.id &&
    operation.status !== "completed" && operation.status !== "cancelled");
  if (service) return describeServiceOperation(service, state.facilityTick);
  if (encounter.checkInStatus === "awaiting_staff") return "Waiting to check in";

  const movement = encounter.patientMovement;
  if (movement) {
    const destination = roomById(state, movement.destinationRoomInstanceId);
    switch (movement.kind) {
      case "arriving_for_check_in": return "Walking to check-in";
      case "walking_to_care": return `Walking to ${theRoom(destination, "an exam room")}`;
      case "walking_to_waiting": return "Walking to the waiting area";
      case "departing_for_offsite_testing": return "Leaving for testing";
      case "returning_from_offsite_testing": return "Returning from testing";
      case "returning_from_onsite_service": return "Returning to the Front Desk";
      case "idle_within_room":
        return encounter.waitingDestination?.kind === "chair" ? "Walking to a seat" : "Walking around while waiting";
      case "leaving_after_resolution": return "Going home";
      case "leaving_after_walkout": return "Leaving without being seen";
    }
  }

  switch (encounter.lifecycle) {
    case "waiting_unopened":
      return "Waiting for clinician";
    case "active_action_required": {
      const founderActivity = state.environment.founderActivity;
      const withFounder = founderActivity?.kind === "attend_encounter" &&
        founderActivity.targetId === encounter.id &&
        arrived(founderActivity.path, founderActivity.pathIndex);
      return withFounder ? "Talking with the clinician" : "Waiting for clinician";
    }
    case "active_pending_result": {
      const room = roomAtPoint(state, encounter.patientLocation);
      if (room && !PUBLIC_ROOMS.has(room.roomDefinitionId)) return `In ${theRoom(room, "a care room")}`;
      return waitingForPendingLabel(encounter.pendingResult?.pendingLabel);
    }
    case "resolved_summary_available":
      return "Finishing up";
    default:
      return "Going home";
  }
}

function describeEmployeeTask(state: GameState, employee: EmployeeState): string | null {
  const task = employee.facilityTask;
  if (!task) return null;
  const there = arrived(employee.path, employee.pathIndex);
  const target = roomById(state, task.targetId);
  switch (task.kind) {
    case "refill_water": return "Refilling the water cooler";
    case "collect_litter": return "Picking up trash";
    case "clean_room": return there ? `Cleaning ${theRoom(target, "a room")}` : `Walking to clean ${theRoom(target, "a room")}`;
    case "perform_imaging": return there ? "Running a scan" : "Walking to a scan";
    case "perform_service": {
      const operation = state.serviceOperations.find((candidate) => candidate.id === task.targetId);
      if (operation?.diagnosticPhaseWork?.kind === "interpretation") {
        const patient = state.encounters[operation.diagnosticPhaseWork.encounterId];
        return there ? `Reading a study for ${patient?.patientDisplayName ?? "this center"}` : "Walking to read an in-house study";
      }
      return operation ? `Working on ${lineName(operation.incomeLineId)}` : "Working with a patient";
    }
    case "cover_periop": return "Covering Peri-op/Recovery";
    case "periop_attention": {
      const operation = state.serviceOperations.find((candidate) => candidate.id === task.targetId);
      const attention = operation && getCurrentPeriopNurseAttention(operation);
      const label = attention?.kind === "post_op" ? "Post-op check" : "Pre-op check";
      return `${there ? label : `Walking to ${label.toLowerCase()}`} · ${operation?.displayName ?? "patient"}`;
    }
    case "participate_qi_discussion": return "In a team discussion";
    case "take_break": return there ? "On break" : "Walking to the break room";
    case "repair_room": return there ? `Repairing ${theRoom(target, "a room")}` : `Walking to repair ${theRoom(target, "a room")}`;
    case "review_ambulatory_qi": return "Reviewing surgery quality";
    default: return null;
  }
}

function describeEmployee(state: GameState, employee: EmployeeState, departing: boolean): string {
  if (departing) return "Leaving the clinic";
  const training = employee.training;
  if (training?.stage === "walking_to_training") return "Walking to training";
  if (training?.stage === "training") return "In training";
  if (training?.stage === "returning") return "Returning from training";
  const retail = activeRetailOperationForActor(state, "employee", employee.id);
  if (retail) return describeRetailTrip(state, retail);
  const task = describeEmployeeTask(state, employee);
  if (task) return task;
  const home = roomById(state, employee.homeRoomInstanceId);
  if (employee.staffRoleDefinitionId === "staff.periop_nurse") {
    if (!home || home.roomDefinitionId !== "room.periop_recovery" || !isEmployeeAssignedToOperationalRoom(state, employee.id)) return "Needs an operational Peri-op room";
    const destination = employee.path.at(-1) ?? employee.location;
    const seat = getPlacedRoomIdleSpotAt(home, destination)?.kind === "seat";
    if (!arrived(employee.path, employee.pathIndex)) {
      if (seat) return "Walking to a staff seat";
      const size = getRoomInstanceFootprint(state, home.id)!;
      const inside = employee.location.x >= home.x && employee.location.x < home.x + size.width &&
        employee.location.y >= home.y && employee.location.y < home.y + size.height;
      return inside ? "Taking a short walk" : "Walking back to Peri-op";
    }
    return seat ? "Sitting between patient checks" : "Between patient checks";
  }
  if (!arrived(employee.path, employee.pathIndex)) return `Walking to ${theRoom(home, "their station")}`;
  if (getActiveOutsideRadiologyReads(state).some((read) => read.employeeId === employee.id)) return "Reading an outside study";
  if (home?.roomDefinitionId === "room.front_desk") {
    return Object.values(state.encounters).some((encounter) => encounter.checkInStatus === "awaiting_staff")
      ? "Checking in patients"
      : "Ready at the Front Desk";
  }
  return home ? `Ready in ${theRoom(home, "their room")}` : "Standing by";
}

function describeFounder(state: GameState): string {
  const label = getFounderActivityLabel({
    activity: state.environment.founderActivity,
    serviceOperations: state.serviceOperations,
    retailOperations: state.retailOperations,
    rooms: state.rooms,
    encounters: Object.values(state.encounters),
  });
  if (label) return label;
  const activity = state.environment.founderActivity;
  if (activity?.kind === "sit_in_chair") {
    if (getFounderBreakSeatClaim(state)) return "Taking a break";
    const room = roomAtPoint(state, state.environment.founderLocation);
    return `Sitting in ${theRoom(room, "a chair")}`;
  }
  const room = roomAtPoint(state, state.environment.founderLocation);
  if (room?.roomDefinitionId === "room.front_desk") {
    const definition = getRoomDefinition(room.roomDefinitionId);
    if (definition && samePoint(state.environment.founderLocation, getRoomNavigationAnchor(room, definition, "staff"))) {
      return "Checking in patients";
    }
  }
  return "Standing by";
}

function withRole(name: string, role: string | null | undefined): string {
  return role ? `${name} · ${role}` : name;
}

export function describeFacilityCharacter(
  state: GameState,
  character: FacilityCharacterRef,
): FacilityCharacterDescription | null {
  switch (character.kind) {
    case "founder":
      return { name: withRole(state.founder.displayName, "Founder"), activity: describeFounder(state) };
    case "staff": {
      const active = state.employees.find((employee) => employee.id === character.id);
      const departing = active ? undefined : (state.departingEmployees ?? []).find((employee) => employee.id === character.id);
      const employee = active ?? departing;
      if (!employee) return null;
      return {
        name: withRole(employee.displayName, getStaffRoleDefinition(employee.staffRoleDefinitionId)?.displayName),
        activity: describeEmployee(state, employee, Boolean(departing)),
      };
    }
    case "patient": {
      const encounter = state.encounters[character.id];
      return encounter
        ? { name: withRole(encounter.patientDisplayName, "Patient"), activity: describePatient(state, encounter) }
        : null;
    }
    case "service-visitor": {
      const operation = state.serviceOperations.find((candidate) =>
        candidate.actorKind === "visitor" && candidate.actorId === character.id &&
        candidate.status !== "completed" && candidate.status !== "cancelled");
      if (!operation) return null;
      const bathroom = getPatientAmenityTrip(state, "service_visitor", operation.id);
      const retail = activeRetailOperationForActor(state, "service_visitor", operation.id);
      return {
        name: withRole(operation.displayName, "Visitor"),
        activity: bathroom
          ? bathroom.status === "using_amenity" ? "In the bathroom" : "Walking to the bathroom"
          : retail ? describeRetailTrip(state, retail) : describeServiceOperation(operation, state.facilityTick),
      };
    }
    case "retail-visitor":
    case "companion": {
      const actor = state.retailExternalActors.find((candidate) => candidate.id === character.id);
      if (!actor) return null;
      const operation = actor.activeRetailOperationId
        ? state.retailOperations.find((candidate) => candidate.id === actor.activeRetailOperationId)
        : undefined;
      const companionOf = actor.linkedEncounterId ? state.encounters[actor.linkedEncounterId] : undefined;
      const activity = actor.movementWaitReason ?? (operation && !["completed", "abandoned", "cancelled"].includes(operation.status)
        ? describeRetailTrip(state, operation)
        : actor.lifecycle === "arriving"
          ? "Arriving"
          : actor.lifecycle === "departing"
            ? "Leaving"
            : companionOf
              ? `Waiting with ${companionOf.patientDisplayName}`
              : "Visiting");
      return { name: withRole(actor.displayName, character.kind === "companion" ? "Companion" : "Shopper"), activity };
    }
    case "ambient":
      return { name: "Passerby", activity: "Walking by" };
  }
}
