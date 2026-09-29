import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  findDeterministicFacilityPath,
  gameReducer,
  serializeGameState,
  type GameState,
} from "../src";

function waitingFixture(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = 1;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  const waiting = {
    id: "room.test.waiting",
    roomDefinitionId: "room.waiting",
    x: 29,
    y: 28,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  state.rooms.push(waiting);
  state.doors.push({
    id: "door.test.waiting.east",
    roomId: waiting.id,
    side: "east",
    offset: 1,
    exterior: false,
  });
  return state;
}

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId });
}

function canFounderReach(state: GameState, point: { x: number; y: number }): boolean {
  return findDeterministicFacilityPath(
    state.environment.founderLocation,
    point,
    state.rooms,
    state.doors,
    (definitionId) => PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (definition) => definition.id === definitionId,
    ) ?? null,
  ).length > 0;
}

describe("litter reachability", () => {
  it("spawns only litter that the founder can reach, including when a normal Waiting Room is present", () => {
    for (let index = 0; index < 80; index += 1) {
      const state = tick(waitingFixture(`reachable-spawn-${index}`), `tick.${index}`);
      const litter = state.environment.litterItems[0]!;
      expect(litter).toBeDefined();
      expect(canFounderReach(state, litter.location)).toBe(true);
      expect(litter.location).not.toEqual({ x: 29, y: 28 });
    }
  });

  it("relocates legacy northwest Waiting Room litter to a reachable same-room tile without changing identity", () => {
    const initial = waitingFixture("legacy-nw");
    initial.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    initial.environment.litterItems = [{
      id: "litter.legacy-nw",
      roomId: "room.test.waiting",
      location: { x: 29, y: 28 },
      spawnedAtFacilityTick: 12,
    }];

    const commandRepaired = gameReducer(initial, {
      type: "COLLECT_LITTER",
      operationId: "legacy-nw.collect-direct",
      litterId: "litter.legacy-nw",
    });
    expect(commandRepaired.operationReceipts["legacy-nw.collect-direct"]).toMatchObject({ status: "applied" });
    expect(commandRepaired.environment.litterItems).toHaveLength(1);
    expect(commandRepaired.environment.litterItems[0]).toMatchObject({
      id: "litter.legacy-nw",
      location: { x: 30, y: 29 },
      spawnedAtFacilityTick: 12,
    });
    expect(commandRepaired.environment.founderActivity).toMatchObject({
      kind: "collect_litter",
      targetId: "litter.legacy-nw",
    });
    let completed = commandRepaired;
    for (let minute = 1; minute <= 100 && completed.environment.litterItems.length > 0; minute += 1) {
      completed = tick(completed, `legacy-nw.collect-work.${minute}`);
    }
    expect(completed.environment.litterItems).toEqual([]);

    const reconciled = tick(initial, "legacy-nw.reconcile");
    const litter = reconciled.environment.litterItems[0]!;
    expect(reconciled.environment.litterItems).toHaveLength(1);
    expect(litter).toMatchObject({
      id: "litter.legacy-nw",
      roomId: "room.test.waiting",
      spawnedAtFacilityTick: 12,
      location: { x: 30, y: 29 },
    });
    expect(canFounderReach(reconciled, litter.location)).toBe(true);

  });

  it("uses deterministic reachable fallback and preserves it through reload when the original room has no accessible floor", () => {
    const initial = waitingFixture("legacy-fallback");
    initial.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    initial.doors = initial.doors.filter((door) => door.roomId !== "room.test.waiting");
    initial.environment.litterItems = [{
      id: "litter.legacy-fallback",
      roomId: "room.test.waiting",
      location: { x: 29, y: 28 },
      spawnedAtFacilityTick: 9,
    }];

    const reconciled = tick(initial, "legacy-fallback.reconcile");
    const litter = reconciled.environment.litterItems[0]!;
    expect(litter.id).toBe("litter.legacy-fallback");
    expect(litter.spawnedAtFacilityTick).toBe(9);
    expect(litter.roomId).not.toBe("room.test.waiting");
    expect(canFounderReach(reconciled, litter.location)).toBe(true);
    expect(deserializeGameState(serializeGameState(reconciled)).environment.litterItems).toEqual(
      reconciled.environment.litterItems,
    );
  });

  it("keeps targeted or otherwise unplaceable legacy litter unchanged", () => {
    const targeted = waitingFixture("targeted-legacy");
    targeted.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    targeted.environment.litterItems = [{
      id: "litter.targeted",
      roomId: "room.test.waiting",
      location: { x: 29, y: 28 },
      spawnedAtFacilityTick: 3,
    }];
    targeted.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.targeted",
      path: [{ ...targeted.environment.founderLocation }],
      pathIndex: 0,
      lastMovedAtFacilityTick: targeted.facilityTick + 1,
      workMinutesRemaining: 10,
    };
    const afterTargetedTick = tick(targeted, "targeted-legacy.tick");
    expect(afterTargetedTick.environment.litterItems[0]!.location).toEqual({ x: 29, y: 28 });

    const unplaceable = waitingFixture("unplaceable-legacy");
    unplaceable.rooms = unplaceable.rooms.filter((room) => room.id === "room.test.waiting");
    unplaceable.doors = [];
    unplaceable.environment.founderLocation = { x: 34, y: 29 };
    unplaceable.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    unplaceable.environment.litterItems = [{
      id: "litter.unplaceable",
      roomId: "room.test.waiting",
      location: { x: 29, y: 28 },
      spawnedAtFacilityTick: 4,
    }];
    const retained = tick(unplaceable, "unplaceable-legacy.tick");
    expect(retained.environment.litterItems).toEqual(unplaceable.environment.litterItems);
    const rejected = gameReducer(retained, {
      type: "COLLECT_LITTER",
      operationId: "unplaceable-legacy.collect",
      litterId: "litter.unplaceable",
    });
    expect(rejected.operationReceipts["unplaceable-legacy.collect"]).toMatchObject({
      status: "rejected",
      message: "The founder cannot reach that destination through the current doors.",
    });
    expect(rejected.environment.litterItems).toEqual(retained.environment.litterItems);
  });
});
