import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
} from "../src";

let operationSequence = 0;

function tick(state: GameState): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: `ambient-pedestrian.tick.${operationSequence++}`,
  });
}

function quietState(seed = "ambient-pedestrian-seed"): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  return state;
}

describe("ambient sidewalk pedestrians", () => {
  it("spawns offscreen, crosses only the sidewalk, and creates no patient encounter", () => {
    let state = quietState();
    state.environment.nextAmbientPedestrianTick = 1;
    state = tick(state);

    expect(Object.keys(state.encounters)).toHaveLength(0);
    expect(state.environment.ambientPedestrians).toHaveLength(1);
    const pedestrian = state.environment.ambientPedestrians[0]!;
    const grid = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
    expect(pedestrian.path.every((point) => point.y === grid.gridHeight)).toBe(
      true,
    );
    expect(
      [pedestrian.path[0]!.x, pedestrian.path.at(-1)!.x].sort(
        (a, b) => a - b,
      ),
    ).toEqual([-2, grid.gridWidth + 1]);
    expect(pedestrian.path.some((point) => point.y < grid.gridHeight)).toBe(
      false,
    );

    const frozen = deserializeGameState(serializeGameState(state));
    expect(frozen.environment.ambientPedestrians).toEqual(
      state.environment.ambientPedestrians,
    );
    expect(frozen.environment.nextAmbientPedestrianTick).toBe(
      state.environment.nextAmbientPedestrianTick,
    );

    state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
    const previousIndex = pedestrian.pathIndex;
    state = tick(state);
    expect(
      state.environment.ambientPedestrians[0]!.pathIndex - previousIndex,
    ).toBe(
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
        .characterTravelTilesPerTick,
    );

    for (let minute = 0; minute < 100; minute += 1) {
      if (state.environment.ambientPedestrians.length === 0) {
        break;
      }
      state = tick(state);
    }
    expect(state.environment.ambientPedestrians).toHaveLength(0);
    expect(Object.keys(state.encounters)).toHaveLength(0);
  });

  it("uses a campaign-stable random interval and freezes while paused", () => {
    const first = quietState("same-pedestrian-seed");
    const second = quietState("same-pedestrian-seed");
    const config = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment;
    expect(first.environment.nextAmbientPedestrianTick).toBe(
      second.environment.nextAmbientPedestrianTick,
    );
    expect(first.environment.nextAmbientPedestrianTick).toBeGreaterThanOrEqual(
      config.sidewalkPedestrianMinimumMinutes,
    );
    expect(first.environment.nextAmbientPedestrianTick).toBeLessThanOrEqual(
      config.sidewalkPedestrianMaximumMinutes,
    );

    first.environment.nextAmbientPedestrianTick = 0;
    first.paused = true;
    const paused = tick(first);
    expect(paused.facilityTick).toBe(0);
    expect(paused.environment.ambientPedestrians).toHaveLength(0);

    paused.paused = false;
    const resumed = tick(paused);
    expect(resumed.environment.ambientPedestrians).toHaveLength(1);
  });
});
