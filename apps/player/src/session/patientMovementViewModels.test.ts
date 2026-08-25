import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("patient movement presentation", () => {
  it("derives a seated pose only for a stationary patient on a Waiting Room chair", () => {
    const state = createInitialGameState();
    const encounter = Object.values(state.encounters)[0]!;
    state.rooms.push({
      id: "room.test.waiting-presentation",
      roomDefinitionId: "room.waiting",
      x: 10,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    encounter.lifecycle = "waiting_unopened";
    encounter.assignedRoomInstanceId =
      "room.test.waiting-presentation";
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 11, y: 10 };

    const seated = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility.patients?.find(
      (patient) => patient.instanceId === encounter.id,
    );
    expect(seated?.seated).toBe(true);

    // The north-west corner contains a visible plant, not an invisible chair.
    encounter.patientLocation = { x: 10, y: 10 };
    const corner = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility.patients?.find(
      (patient) => patient.instanceId === encounter.id,
    );
    expect(corner?.seated).toBe(false);

    encounter.patientLocation = { x: 11, y: 12 };
    const standing = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility.patients?.find(
      (patient) => patient.instanceId === encounter.id,
    );
    expect(standing?.seated).toBe(false);

    encounter.patientLocation = { x: 11, y: 10 };
    encounter.patientMovement = {
      kind: "idle_within_room",
      path: [
        { x: 11, y: 10 },
        { x: 10, y: 11 },
        { x: 11, y: 10 },
      ],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      destinationRoomInstanceId:
        "room.test.waiting-presentation",
    };
    const moving = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility.patients?.find(
      (patient) => patient.instanceId === encounter.id,
    );
    expect(moving?.seated).toBe(false);
  });

  it("rotates visible Waiting Room chair positions with the room", () => {
    const state = createInitialGameState();
    const encounter = Object.values(state.encounters)[0]!;
    state.rooms.push({
      id: "room.test.waiting-rotated",
      roomDefinitionId: "room.waiting",
      x: 10,
      y: 10,
      orientation: 90,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    encounter.lifecycle = "waiting_unopened";
    encounter.assignedRoomInstanceId =
      "room.test.waiting-rotated";
    encounter.patientMovement = null;
    // Definition-local chair (1, 0) rotates to local (2, 1).
    encounter.patientLocation = { x: 12, y: 11 };

    const patient = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility.patients?.find(
      (candidate) => candidate.instanceId === encounter.id,
    );

    expect(patient?.seated).toBe(true);
  });
});
