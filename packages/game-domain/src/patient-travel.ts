import type { ServiceRouteDefinition } from "@gamify-surgery/balance-config";
import { findDeterministicRoomPath } from "./spatial";
import type {
  DomainContext,
  FrozenPatientTravel,
  GameState,
  GridPoint,
  PendingResult,
} from "./types";

export interface FrozenServiceRouteTiming {
  serviceDurationTicks: number;
  durationTicks: number;
  patientTravel: FrozenPatientTravel | null;
}

export interface OffsitePatientTravelPresentation {
  phase: "departing" | "away" | "returning";
  /**
   * Progress through the visible leg. Departing runs from the entrance toward
   * the edge of the map; returning runs from the edge back to the entrance.
   */
  progress: number;
  /** A stable sidewalk direction chosen from the encounter identity. */
  direction: -1 | 1;
}

function getDefinition(context: DomainContext, definitionId: string) {
  return (
    context.balanceRelease.facility.roomDefinitions.find(
      (definition) => definition.id === definitionId,
    ) ?? null
  );
}

function travelTicks(path: readonly GridPoint[], tilesPerTick: number): number {
  return Math.ceil(Math.max(0, path.length - 1) / tilesPerTick);
}

/**
 * Freezes all path and timing inputs at scheduling time. Later construction,
 * remodeling, or balance changes cannot move an already-scheduled patient.
 */
export function createFrozenServiceRouteTiming(
  state: GameState,
  context: DomainContext,
  route: ServiceRouteDefinition,
): FrozenServiceRouteTiming | null {
  if (route.patientTravel === null) {
    return {
      serviceDurationTicks: route.durationTicks,
      durationTicks: route.durationTicks,
      patientTravel: null,
    };
  }

  const origins = state.rooms
    .filter(
      (room) =>
        room.roomDefinitionId ===
        route.patientTravel?.originRoomDefinitionId,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const destinations = state.rooms
    .filter(
      (room) =>
        room.roomDefinitionId ===
        route.patientTravel?.destinationRoomDefinitionId,
    )
    .filter(
      (destination) =>
        !Object.values(state.encounters).some(
          (encounter) =>
            encounter.pendingResult?.routeId === route.id &&
            encounter.pendingResult.deliveredAtTick === null &&
            encounter.pendingResult.patientTravel
              ?.destinationRoomInstanceId === destination.id,
        ),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const candidates = origins.flatMap((origin) =>
    destinations.flatMap((destination) => {
      const outboundPath = findDeterministicRoomPath(
        origin,
        destination,
        (definitionId) => getDefinition(context, definitionId),
        state.rooms,
        new Set(
          context.balanceRelease.facility.protectedRoomDefinitionIds,
        ),
        state.doors,
      );
      return outboundPath.length === 0
        ? []
        : [{ origin, destination, outboundPath }];
    }),
  );
  candidates.sort(
    (left, right) =>
      left.outboundPath.length - right.outboundPath.length ||
      left.origin.id.localeCompare(right.origin.id) ||
      left.destination.id.localeCompare(right.destination.id),
  );
  const selected = candidates[0];
  if (!selected) {
    return null;
  }

  const tilesPerTick =
    context.balanceRelease.facility.patientTravelTilesPerTick;
  const returnPath = [...selected.outboundPath]
    .reverse()
    .map((point) => ({ ...point }));
  const outboundTicks = travelTicks(selected.outboundPath, tilesPerTick);
  const returnTicks = travelTicks(returnPath, tilesPerTick);
  const outboundStartTick = state.facilityTick;
  const outboundArrivalTick = outboundStartTick + outboundTicks;
  const serviceCompletionTick =
    outboundArrivalTick + route.durationTicks;
  const returnArrivalTick = serviceCompletionTick + returnTicks;

  return {
    serviceDurationTicks: route.durationTicks,
    durationTicks: returnArrivalTick - outboundStartTick,
    patientTravel: {
      version: "patient-travel.v1",
      originRoomInstanceId: selected.origin.id,
      destinationRoomInstanceId: selected.destination.id,
      outboundPath: selected.outboundPath.map((point) => ({ ...point })),
      returnPath,
      tilesPerTick,
      outboundStartTick,
      outboundArrivalTick,
      serviceCompletionTick,
      returnArrivalTick,
    },
  };
}

function pointAtElapsedTicks(
  path: readonly GridPoint[],
  elapsedTicks: number,
  tilesPerTick: number,
): GridPoint | null {
  if (path.length === 0) {
    return null;
  }
  const index = Math.min(
    path.length - 1,
    Math.max(0, elapsedTicks) * tilesPerTick,
  );
  return { ...path[index]! };
}

export function getFrozenPatientTravelLocation(
  travel: FrozenPatientTravel,
  facilityTick: number,
): GridPoint | null {
  if (facilityTick <= travel.outboundArrivalTick) {
    return pointAtElapsedTicks(
      travel.outboundPath,
      facilityTick - travel.outboundStartTick,
      travel.tilesPerTick,
    );
  }
  if (facilityTick <= travel.serviceCompletionTick) {
    return travel.outboundPath.length > 0
      ? { ...travel.outboundPath.at(-1)! }
      : null;
  }
  return pointAtElapsedTicks(
    travel.returnPath,
    facilityTick - travel.serviceCompletionTick,
    travel.tilesPerTick,
  );
}

function stableSidewalkDirection(stableId: string): -1 | 1 {
  let hash = 2166136261;
  for (let index = 0; index < stableId.length; index += 1) {
    hash ^= stableId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? -1 : 1;
}

/**
 * Creates the purely presentational sidewalk phase for an outsourced result.
 *
 * The phase is derived only from the pending result's frozen scheduling
 * fields and the persisted facility tick. It therefore survives reload
 * exactly and cannot drift with render-frame timing. In-facility routes keep
 * using their frozen grid path instead.
 */
export function getOffsitePatientTravelPresentation(
  pendingResult: PendingResult,
  facilityTick: number,
  stableId: string,
): OffsitePatientTravelPresentation | null {
  if (
    pendingResult.patientTravel !== null ||
    pendingResult.deliveredAtTick !== null ||
    pendingResult.offsiteReturnStartedAtTick !== null
  ) {
    return null;
  }

  const totalTicks = Math.max(
    1,
    pendingResult.dueTick - pendingResult.scheduledAtTick,
  );
  const elapsedTicks = Math.max(
    0,
    Math.min(totalTicks, facilityTick - pendingResult.scheduledAtTick),
  );
  const direction = stableSidewalkDirection(stableId);

  if (elapsedTicks === 0) {
    return {
      phase: "departing",
      progress: 0,
      direction,
    };
  }

  // Reserve roughly the first and final thirds for visible sidewalk travel,
  // while ensuring ordinary 4- and 6-hour send-outs have an absent midpoint.
  const legTicks = Math.max(1, Math.floor(totalTicks / 3));
  const returnStartTick = Math.max(legTicks, totalTicks - legTicks);

  if (elapsedTicks < legTicks) {
    return {
      phase: "departing",
      progress: elapsedTicks / legTicks,
      direction,
    };
  }

  if (elapsedTicks < returnStartTick) {
    return {
      phase: "away",
      progress: 1,
      direction,
    };
  }

  // The +1 makes the patient visibly partway home on the first returning
  // facility tick instead of lingering motionless at the edge until ready.
  return {
    phase: "returning",
    progress: Math.min(
      1,
      (elapsedTicks - returnStartTick + 1) / (legTicks + 1),
    ),
    direction,
  };
}
