import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  selectWaitingDestinationForTesting,
  serializeGameState,
  type GameState,
} from "../src";

function fixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.waiting-routing", campaignSeed: "waiting-routing", createdAtRealMs: 0 });
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "waiting", roomDefinitionId: "room.waiting", x: 29, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "periop", roomDefinitionId: "room.periop_recovery", x: 38, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hall", roomDefinitionId: "room.hallway", x: 28, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "waiting-east", roomId: "waiting", side: "east", offset: 1, exterior: false },
    { id: "waiting-west", roomId: "waiting", side: "west", offset: 0, exterior: false },
    { id: "periop-west", roomId: "periop", side: "west", offset: 2, exterior: false },
  );
  return state;
}

function addEncounter(state: GameState, id: string) {
  const sample = Object.values(createInitialGameState().encounters)[0]!;
  state.encounters[id] = { ...(JSON.parse(JSON.stringify(sample)) as typeof sample), id, checkInStatus: "checked_in", lifecycle: "waiting_unopened", patientLocation: { x: 35, y: 31 }, patientMovement: null, waitingDestination: null, assignedRoomInstanceId: "room.instance.founder_desk" };
  return state.encounters[id]!;
}

describe("waiting destination routing acceptance", () => {
  it("A: reserves indoor preferences in hierarchy order without a sidewalk overflow", () => {
    const state = fixture();
    const keys = new Set<string>();
    const picks = [] as NonNullable<ReturnType<typeof selectWaitingDestinationForTesting>>[];
    for (let index = 0; index < 12; index += 1) {
      const encounter = addEncounter(state, `encounter.hierarchy.${index}`);
      const destination = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, encounter.id)!;
      picks.push(destination);
      encounter.waitingDestination = destination.reservation;
      expect(destination.reservation).not.toBeNull();
      const point = destination.reservation!.location;
      expect(point.y).toBeLessThan(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight);
      expect(keys.has(`${point.x},${point.y}`)).toBe(false);
      keys.add(`${point.x},${point.y}`);
    }
    expect(picks.slice(0, 3).map((pick) => pick.reservation)).toEqual([
      { roomInstanceId: "waiting", location: { x: 30, y: 28 }, kind: "chair" },
      { roomInstanceId: "waiting", location: { x: 31, y: 28 }, kind: "chair" },
      { roomInstanceId: "waiting", location: { x: 29, y: 29 }, kind: "chair" },
    ]);
    expect(picks[3]!.reservation).toEqual({ roomInstanceId: "room.instance.founder_desk", location: { x: 37, y: 31 }, kind: "chair" });
    expect(picks[4]!.reservation).toEqual({ roomInstanceId: "room.instance.founder_desk", location: { x: 36, y: 31 }, kind: "standing" });
    expect(picks[5]!.reservation).toEqual({ roomInstanceId: "periop", location: { x: 39, y: 28 }, kind: "chair" });
    expect(picks.slice(6).every((pick) => pick.reservation?.roomInstanceId === "waiting" && pick.reservation.kind === "standing")).toBe(true);
  });

  it("B: sequential check-in-equivalent selections never duplicate persisted reservations", () => {
    const state = fixture();
    for (let index = 0; index < 12; index += 1) {
      const encounter = addEncounter(state, `encounter.unique.${index}`);
      encounter.waitingDestination = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, encounter.id)!.reservation;
    }
    const keys = Object.values(state.encounters).map((encounter) => `${encounter.waitingDestination!.location.x},${encounter.waitingDestination!.location.y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("C: stationary reservations persist while public wander reservations serialize", () => {
    const state = fixture();
    const chair = addEncounter(state, "encounter.chair");
    chair.waitingDestination = { roomInstanceId: "waiting", location: { x: 30, y: 28 }, kind: "chair" };
    const standing = addEncounter(state, "encounter.standing");
    standing.waitingDestination = { roomInstanceId: "waiting", location: { x: 32, y: 28 }, kind: "standing" };
    const wander = addEncounter(state, "encounter.wander");
    wander.waitingDestination = { roomInstanceId: "hall", location: { x: 28, y: 28 }, kind: "public_wander" };
    chair.assignedRoomInstanceId = "waiting";
    standing.assignedRoomInstanceId = "waiting";
    wander.assignedRoomInstanceId = "hall";
    chair.patientLocation = { x: 30, y: 28 };
    standing.patientLocation = { x: 32, y: 28 };
    wander.patientLocation = { x: 28, y: 28 };
    chair.nextIdleActionAtFacilityTick = 0;
    standing.nextIdleActionAtFacilityTick = 0;
    wander.nextIdleActionAtFacilityTick = 0;
    const eagerContext = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as typeof PROTOTYPE_DOMAIN_CONTEXT;
    eagerContext.balanceRelease.environment.idleActionChancePercent = 100;
    const advanced = gameReducer(state, { type: "ADVANCE_TICK", operationId: "wander.advance" }, eagerContext);
    expect(advanced.encounters[chair.id]!.patientLocation).toEqual({ x: 30, y: 28 });
    expect(advanced.encounters[chair.id]!.patientMovement).toBeNull();
    expect(advanced.encounters[standing.id]!.patientLocation).toEqual({ x: 32, y: 28 });
    expect(advanced.encounters[standing.id]!.patientMovement).toBeNull();
    expect(advanced.encounters[wander.id]!.waitingDestination).toMatchObject({ kind: "public_wander" });
    const wanderMovement = advanced.encounters[wander.id]!.patientMovement;
    if (wanderMovement) {
      expect(wanderMovement.path[0]).toEqual({ x: 28, y: 28 });
      expect(wanderMovement.path.at(-1)).toEqual(advanced.encounters[wander.id]!.waitingDestination?.location);
    }
    const restored = deserializeGameState(serializeGameState(advanced));
    expect(restored.encounters[chair.id]!.waitingDestination).toEqual(advanced.encounters[chair.id]!.waitingDestination);
    expect(restored.encounters[standing.id]!.waitingDestination).toEqual(advanced.encounters[standing.id]!.waitingDestination);
    expect(restored.encounters[wander.id]!.waitingDestination).toEqual(advanced.encounters[wander.id]!.waitingDestination);
  });
});
