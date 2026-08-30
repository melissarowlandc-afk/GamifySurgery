import { createPatientPixelAppearance } from "./appearance";
import {
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import type {
  AmbientPedestrianState,
  DomainContext,
  GameState,
  GridPoint,
} from "./types";

function sidewalkPath(start: GridPoint, destination: GridPoint): GridPoint[] {
  if (start.y !== destination.y) {
    return [];
  }
  const path = [{ ...start }];
  let x = start.x;
  while (x !== destination.x) {
    x += Math.sign(destination.x - x);
    path.push({ x, y: start.y });
  }
  return path;
}

export function getNextAmbientPedestrianTick(
  state: GameState,
  context: DomainContext,
): number {
  const config = context.balanceRelease.environment;
  const spread =
    config.sidewalkPedestrianMaximumMinutes -
    config.sidewalkPedestrianMinimumMinutes +
    1;
  return (
    state.facilityTick +
    config.sidewalkPedestrianMinimumMinutes +
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.sidewalkPedestrians,
      `next.${state.environment.ambientPedestrianSequence}.${state.facilityTick}`,
      spread,
    )
  );
}

function createAmbientPedestrian(
  state: GameState,
  context: DomainContext,
): AmbientPedestrianState {
  const sequence = state.environment.ambientPedestrianSequence;
  const id = `ambient-pedestrian.${sequence}`;
  const gridWidth = context.balanceRelease.facility.gridWidth;
  const sidewalkY = context.balanceRelease.facility.gridHeight;
  const startsOnLeft =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.sidewalkPedestrians,
      `${id}.direction`,
      2,
    ) === 0;
  const start = {
    x: startsOnLeft ? -2 : gridWidth + 1,
    y: sidewalkY,
  };
  const destination = {
    x: startsOnLeft ? gridWidth + 1 : -2,
    y: sidewalkY,
  };
  return {
    id,
    // This reuses only the canonical civilian artwork generator. The actor is
    // not an encounter and never enters any patient or clinical collection.
    appearance: createPatientPixelAppearance(
      state.campaignSeed,
      id,
      {},
      "ambient-pedestrian",
    ),
    path: sidewalkPath(start, destination),
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
  };
}

/**
 * Advances noninteractive sidewalk life at the same rate as every other map
 * character. Passersby exist only on a frozen west-east/east-west route and
 * are removed after reaching the opposite offscreen boundary.
 */
export function advanceAmbientPedestrians(
  state: GameState,
  context: DomainContext,
): void {
  const speed =
    context.balanceRelease.facility.characterTravelTilesPerTick;
  state.environment.ambientPedestrians =
    state.environment.ambientPedestrians.flatMap((pedestrian) => {
      const elapsedTicks = Math.max(
        1,
        state.facilityTick - pedestrian.lastMovedAtFacilityTick,
      );
      const pathIndex = Math.min(
        pedestrian.path.length - 1,
        pedestrian.pathIndex + elapsedTicks * speed,
      );
      if (pathIndex >= pedestrian.path.length - 1) {
        return [];
      }
      return [
        {
          ...pedestrian,
          pathIndex,
          lastMovedAtFacilityTick: state.facilityTick,
        },
      ];
    });

  if (state.facilityTick < state.environment.nextAmbientPedestrianTick) {
    return;
  }
  const maximum =
    context.balanceRelease.environment.maximumSidewalkPedestrians;
  if (state.environment.ambientPedestrians.length < maximum) {
    state.environment.ambientPedestrians.push(
      createAmbientPedestrian(state, context),
    );
    state.environment.ambientPedestrianSequence += 1;
  }
  state.environment.nextAmbientPedestrianTick =
    getNextAmbientPedestrianTick(state, context);
}
