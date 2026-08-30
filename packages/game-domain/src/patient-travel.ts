import type { ServiceRouteDefinition } from "@gamify-surgery/balance-config";
import { findDeterministicRoomPath } from "./spatial";
import type {
  DomainContext,
  FrozenPatientTravel,
  GameState,
  GridPoint,
} from "./types";

export interface FrozenServiceRouteTiming {
  serviceDurationTicks: number;
  durationTicks: number;
  patientTravel: FrozenPatientTravel | null;
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
            (!(encounter.pendingResult.timingPhases?.length) ||
              encounter.pendingResult.timingPhases.some(
                (phase) =>
                  phase.resourceBound && state.facilityTick < phase.endsAtTick,
              )) &&
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
    context.balanceRelease.facility.characterTravelTilesPerTick;
  const returnPath = [...selected.outboundPath]
    .reverse()
    .map((point) => ({ ...point }));
  const outboundTicks = travelTicks(selected.outboundPath, tilesPerTick);
  const returnTicks = travelTicks(returnPath, tilesPerTick);
  const outboundStartTick = state.facilityTick;
  const outboundArrivalTick = outboundStartTick + outboundTicks;
  const returnArrivalTick = outboundStartTick + route.durationTicks;
  const serviceCompletionTick = returnArrivalTick - returnTicks;
  if (serviceCompletionTick < outboundArrivalTick) {
    return null;
  }

  return {
    serviceDurationTicks: route.durationTicks,
    durationTicks: route.durationTicks,
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
  if (facilityTick < travel.serviceCompletionTick) {
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
