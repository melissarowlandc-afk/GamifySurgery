import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getFacilityAccessValidation,
  validateFacilityAccess,
  getRoomDefinition,
  type GameState,
} from "../src";
import { synchronizeFacilityOperationalAlertOccurrences } from "../src/facility-alert-conditions";
import { synchronizeFacilityConditionOccurrences } from "../src/facility-experience";

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId });
}

describe("per-minute tick work", () => {
  it("leaves nothing for a second condition synchronization after an unpaused tick", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 900; index += 1) {
      state = tick(state, `sync-idempotence.${index}`);
      const resynchronized = JSON.parse(JSON.stringify(state)) as GameState;
      synchronizeFacilityConditionOccurrences(resynchronized, PROTOTYPE_DOMAIN_CONTEXT);
      synchronizeFacilityOperationalAlertOccurrences(resynchronized, PROTOTYPE_DOMAIN_CONTEXT);
      expect(resynchronized).toEqual(state);
    }
  }, 120_000);

  it("reuses facility access validation only while rooms and doors are unchanged", () => {
    const state = createInitialGameState();
    const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
    const direct = (candidate: GameState) => validateFacilityAccess(
      candidate.rooms,
      candidate.doors,
      (definitionId) => getRoomDefinition(definitionId),
      facility.gridWidth,
      facility.gridHeight,
      new Set(facility.protectedRoomDefinitionIds),
    );
    const first = getFacilityAccessValidation(state);
    expect(first).toEqual(direct(state));
    first.unreachableRoomIds.push("mutated.by.caller");
    expect(getFacilityAccessValidation(state)).toEqual(direct(state));

    // Removing every door changes the answer and must not reuse the cache.
    const doorless = { ...state, doors: [] } as GameState;
    expect(getFacilityAccessValidation(doorless)).toEqual(direct(doorless));
    expect(getFacilityAccessValidation(doorless)).not.toEqual(direct(state));
    const moved = JSON.parse(JSON.stringify(state)) as GameState;
    moved.rooms[0]!.x += 3;
    expect(getFacilityAccessValidation(moved)).toEqual(direct(moved));
    expect(getFacilityAccessValidation(state)).toEqual(direct(state));
  });
});
