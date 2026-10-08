import {
  formatFounderBreakSeatTargetId,
  getLevelThreeBreakSeatTarget,
  LEVEL_THREE_BREAK_SEATS,
} from "./level-three-support";
import { getRoomDefinition } from "./selectors";
import {
  getRoomNavigationAnchor,
  getRoomStandingWaitingAnchors,
  getRoomWaitingAnchors,
} from "./spatial";
import type {
  DomainContext,
  GameState,
  GridPoint,
  LevelThreeBreakSeatId,
} from "./types";

export type FounderSeatKind = "waiting" | "front_desk_public" | "break";

/**
 * A seat the player may send the founder to (owner request, 2026-10-07):
 * Waiting Room chairs, the patient-side Front Desk chair and Break Room seats.
 * Clinical seats stay out so the founder never blocks patient care.
 */
export interface FounderSeat {
  roomInstanceId: string;
  location: GridPoint;
  kind: FounderSeatKind;
  seatId?: LevelThreeBreakSeatId;
  /** Saved as the founder's `sit_in_chair` targetId. */
  targetId: string;
}

function samePoint(left: GridPoint | null | undefined, right: GridPoint | null | undefined): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

export function listFounderSeats(state: GameState, context: DomainContext): FounderSeat[] {
  return state.rooms.flatMap((room): FounderSeat[] => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) return [];
    if (room.roomDefinitionId === "room.waiting") {
      return getRoomWaitingAnchors(room, definition).map((location) => ({
        roomInstanceId: room.id,
        location,
        kind: "waiting",
        targetId: `${room.id}.${location.x}.${location.y}`,
      }));
    }
    if (room.roomDefinitionId === "room.front_desk") {
      const standing = getRoomStandingWaitingAnchors(room, definition);
      const desk = getRoomNavigationAnchor(room, definition, "staff");
      return getRoomWaitingAnchors(room, definition)
        .filter((anchor) => !samePoint(anchor, desk) && !standing.some((point) => samePoint(point, anchor)))
        .map((location) => ({
          roomInstanceId: room.id,
          location,
          kind: "front_desk_public",
          targetId: `${room.id}.${location.x}.${location.y}`,
        }));
    }
    if (room.roomDefinitionId === "room.staff_break") {
      return LEVEL_THREE_BREAK_SEATS.flatMap((seat): FounderSeat[] => {
        const location = getLevelThreeBreakSeatTarget(state, room, seat.id, context);
        return location
          ? [{
              roomInstanceId: room.id,
              location,
              kind: "break",
              seatId: seat.id,
              targetId: formatFounderBreakSeatTargetId(room.id, seat.id),
            }]
          : [];
      });
    }
    return [];
  });
}

/** Break seats are matched by id because two seats can share a nearest tile. */
export function findFounderSeat(
  state: GameState,
  context: DomainContext,
  roomInstanceId: string,
  location: GridPoint,
  seatId?: LevelThreeBreakSeatId,
): FounderSeat | null {
  const seats = listFounderSeats(state, context).filter((seat) => seat.roomInstanceId === roomInstanceId);
  return (seatId ? seats.find((seat) => seat.seatId === seatId) : undefined) ??
    seats.find((seat) => samePoint(seat.location, location)) ??
    null;
}

/** Anyone standing on, walking to, or holding a reservation for the chair tile. */
export function isFounderChairTileOccupied(state: GameState, chair: GridPoint): boolean {
  return state.employees.some((employee) =>
    samePoint(employee.location, chair) || samePoint(employee.path.at(-1) ?? employee.location, chair),
  ) || Object.values(state.encounters).some((encounter) =>
    (encounter.resolutionReason === null || encounter.patientMovement !== null) &&
    (samePoint(encounter.patientLocation, chair) ||
      samePoint(encounter.patientMovement?.path.at(-1), chair) ||
      samePoint(encounter.waitingDestination?.location, chair)),
  ) || state.serviceOperations.some((operation) =>
    operation.status !== "completed" && operation.status !== "cancelled" &&
    (samePoint(operation.location, chair) || samePoint(operation.path.at(-1), chair)),
  ) || state.retailOperations.some((operation) =>
    !(operation.actorKind === "founder" && operation.actorId === "founder") &&
    operation.status !== "completed" && operation.status !== "cancelled" && operation.status !== "abandoned" &&
    (samePoint(operation.location, chair) || samePoint(operation.path.at(-1), chair)),
  ) || state.retailExternalActors.some((actor) =>
    actor.lifecycle !== "departed" &&
    (samePoint(actor.location, chair) || samePoint(actor.path.at(-1), chair)),
  );
}

export function isFounderSeatOccupied(state: GameState, seat: FounderSeat): boolean {
  if (seat.kind === "break") {
    return state.employees.some((employee) =>
      employee.facilityTask?.kind === "take_break" &&
      employee.facilityTask.targetId === seat.roomInstanceId &&
      employee.facilityTask.seatId === seat.seatId,
    );
  }
  return isFounderChairTileOccupied(state, seat.location);
}
