import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("ambient pedestrian presentation", () => {
  it("projects a passerby as a map actor without adding a patient tab or count", () => {
    let state = createInitialGameState();
    state.encounters = {};
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextAmbientPedestrianTick = 1;
    state = gameReducer(state, {
      type: "ADVANCE_TICK",
      operationId: "ambient-pedestrian.presentation",
    });

    const view = createPrototypePlayerView(state, null, false, null);
    const pedestrian = state.environment.ambientPedestrians[0]!;
    expect(view.patients).toHaveLength(0);
    expect(view.facility.patientCounts).toMatchObject({
      waiting: 0,
      active: 0,
      actionReady: 0,
    });
    expect(view.facility.ambientPedestrians).toEqual([
      expect.objectContaining({
        instanceId: pedestrian.id,
        appearance: pedestrian.appearance,
        location: pedestrian.path[0],
        path: pedestrian.path,
        pathIndex: 0,
        moving: true,
        direction: "side",
      }),
    ]);
  });
});
