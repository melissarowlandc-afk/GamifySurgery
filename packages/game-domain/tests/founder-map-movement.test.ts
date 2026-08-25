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

function move(
  state: GameState,
  destination: { x: number; y: number },
): GameState {
  return gameReducer(state, {
    type: "MOVE_FOUNDER",
    operationId: `founder.move.${operationSequence++}`,
    destination,
  });
}

function tick(state: GameState): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: `founder.tick.${operationSequence++}`,
  });
}

describe("founder map movement", () => {
  it("persists a legal floor destination and advances at the shared speed", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.founder-map-movement",
      campaignSeed: "founder-map-movement",
      createdAtRealMs: 0,
    });
    state.encounters = {};
    state.nextRoutineArrivalTick = 100_000;
    state.environment.nextLitterSpawnTick = 100_000;
    const destination = { x: 33, y: 28 };

    state = move(state, destination);
    expect(state.environment.founderActivity).toMatchObject({
      kind: "walk_to_point",
      pathIndex: 0,
      workMinutesRemaining: 0,
    });
    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(destination);

    state = deserializeGameState(serializeGameState(state));
    expect(state.environment.founderActivity?.kind).toBe(
      "walk_to_point",
    );

    const initialIndex =
      state.environment.founderActivity!.pathIndex;
    state = tick(state);
    expect(
      state.environment.founderActivity!.pathIndex - initialIndex,
    ).toBeLessThanOrEqual(
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
        .characterTravelTilesPerTick,
    );

    for (let index = 0; index < 10; index += 1) {
      if (!state.environment.founderActivity) {
        break;
      }
      state = tick(state);
    }
    expect(state.environment.founderLocation).toEqual(destination);
    expect(state.environment.founderActivity).toBeNull();
  });

  it("retargets ordinary walking but does not interrupt facility work", () => {
    let state = createInitialGameState();
    state = move(state, { x: 33, y: 28 });
    state = move(state, { x: 37, y: 28 });
    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual({ x: 37, y: 28 });

    const location = { ...state.environment.founderLocation };
    state.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.busy",
      path: [location],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 2,
    };
    const blocked = move(state, { x: 33, y: 28 });
    expect(
      blocked.operationReceipts[Object.keys(blocked.operationReceipts).at(-1)!],
    ).toMatchObject({
      status: "rejected",
      message:
        "The founder is already completing another facility interaction.",
    });
    expect(blocked.environment.founderActivity?.kind).toBe(
      "collect_litter",
    );
  });

  it("walks through the entrance to a clicked sidewalk point", () => {
    let state = createInitialGameState();
    const destination = {
      x: 30,
      y: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight,
    };
    state = move(state, destination);

    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(destination);
    expect(
      state.environment.founderActivity?.path,
    ).toContainEqual({ x: 35, y: 32 });
  });

  it("uses the nearest legal floor tile for furniture clicks and rejects empty land", () => {
    let state = createInitialGameState();
    const blockedFixtureTile = { x: 34, y: 30 };
    state = move(state, blockedFixtureTile);
    const resolvedDestination =
      state.environment.founderActivity?.path.at(-1);
    expect(resolvedDestination).toBeDefined();
    expect(resolvedDestination).not.toEqual(blockedFixtureTile);
    expect(
      Math.abs(resolvedDestination!.x - blockedFixtureTile.x) +
        Math.abs(resolvedDestination!.y - blockedFixtureTile.y),
    ).toBe(1);

    const rejected = move(state, { x: 0, y: 0 });
    expect(
      rejected.operationReceipts[
        Object.keys(rejected.operationReceipts).at(-1)!
      ]?.status,
    ).toBe("rejected");
  });
});
