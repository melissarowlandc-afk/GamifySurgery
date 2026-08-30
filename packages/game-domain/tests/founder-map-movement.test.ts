import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getOccupiedTiles,
  getRoomNavigableTiles,
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

function founderRoomNavigation(state: GameState) {
  const room = state.rooms.find((candidate) =>
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      candidate.roomDefinitionId,
    ),
  );
  expect(room).toBeDefined();
  const definition =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (candidate) => candidate.id === room!.roomDefinitionId,
    );
  expect(definition).toBeDefined();
  return { room: room!, definition: definition! };
}

function legalFounderRoomDestinations(state: GameState) {
  const { room, definition } = founderRoomNavigation(state);
  return getRoomNavigableTiles(room, definition, state.doors).filter(
    (point) =>
      point.x !== state.environment.founderLocation.x ||
      point.y !== state.environment.founderLocation.y,
  );
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
    const destination = legalFounderRoomDestinations(state)[0]!;

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
    const destinations = legalFounderRoomDestinations(state);
    expect(destinations.length).toBeGreaterThanOrEqual(2);
    const firstDestination = destinations[0]!;
    const secondDestination = destinations[1]!;
    state = move(state, firstDestination);
    state = move(state, secondDestination);
    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(secondDestination);

    const location = { ...state.environment.founderLocation };
    state.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.busy",
      path: [location],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 2,
    };
    const blocked = move(state, firstDestination);
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
    const { room, definition } = founderRoomNavigation(state);
    const navigable = getRoomNavigableTiles(room, definition, state.doors);
    const navigableKeys = new Set(
      navigable.map((point) => `${point.x},${point.y}`),
    );
    const blockedFixtureTile = getOccupiedTiles(room, definition).find(
      (point) => !navigableKeys.has(`${point.x},${point.y}`),
    );
    expect(blockedFixtureTile).toBeDefined();
    state = move(state, blockedFixtureTile!);
    const resolvedDestination =
      state.environment.founderActivity?.path.at(-1);
    expect(resolvedDestination).toBeDefined();
    expect(resolvedDestination).not.toEqual(blockedFixtureTile);
    expect(
      Math.abs(resolvedDestination!.x - blockedFixtureTile!.x) +
        Math.abs(resolvedDestination!.y - blockedFixtureTile!.y),
    ).toBe(1);

    const rejected = move(state, { x: 0, y: 0 });
    expect(
      rejected.operationReceipts[
        Object.keys(rejected.operationReceipts).at(-1)!
      ]?.status,
    ).toBe("rejected");
  });
});
