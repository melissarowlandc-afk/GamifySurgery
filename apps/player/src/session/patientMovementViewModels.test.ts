import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { getRoomCareAnchor } from "@gamify-surgery/game-domain";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("patient movement presentation", () => {
  it("projects every waiting reservation kind and semantic examination attendance", () => {
    const state = createInitialGameState();
    const encounter = Object.values(state.encounters)[0]!;
    const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
    state.rooms.push(
      { id: "room.test.waiting-matrix", roomDefinitionId: "room.waiting", x: 10, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.exam-matrix", roomDefinitionId: "room.examination", x: 16, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.other-chair", roomDefinitionId: "room.periop_recovery", x: 22, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    encounter.lifecycle = "waiting_unopened";
    encounter.patientMovement = null;
    const patient = () => createPrototypePlayerView(state, null, false, null).facility.patients!.find((candidate) => candidate.instanceId === encounter.id)!;
    for (const [roomId, location] of [["room.test.waiting-matrix", { x: 11, y: 10 }], [frontDesk.id, { x: frontDesk.x + 4, y: frontDesk.y + 3 }], ["room.test.other-chair", { x: 24, y: 11 }]] as const) {
      encounter.assignedRoomInstanceId = roomId;
      encounter.patientLocation = location;
      encounter.waitingDestination = { roomInstanceId: roomId, location, kind: "chair" };
      expect(patient().seated).toBe(true);
    }
    encounter.assignedRoomInstanceId = "room.test.waiting-matrix";
    encounter.patientLocation = { x: 10, y: 10 };
    encounter.waitingDestination = { roomInstanceId: "room.test.waiting-matrix", location: { x: 10, y: 10 }, kind: "standing" };
    expect(patient().seated).toBe(false);
    encounter.assignedRoomInstanceId = frontDesk.id;
    encounter.patientLocation = { x: frontDesk.x + 1, y: frontDesk.y + 3 };
    encounter.waitingDestination = { roomInstanceId: frontDesk.id, location: { ...encounter.patientLocation }, kind: "public_wander" };
    expect(patient().seated).toBe(false);
    const exam = state.rooms.find((room) => room.id === "room.test.exam-matrix")!;
    const examDefinition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.examination")!;
    encounter.assignedRoomInstanceId = exam.id;
    encounter.patientLocation = getRoomCareAnchor(exam, examDefinition, "patient");
    encounter.waitingDestination = null;
    expect(patient().pose).toBe("exam-table");
    state.environment.founderActivity = { kind: "attend_encounter", targetId: encounter.id, path: [{ ...state.environment.founderLocation }, getRoomCareAnchor(exam, examDefinition, "clinician")], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: 1 };
    expect(createPrototypePlayerView(state, null, false, null).facility.founder.seated).toBe(false);
    state.environment.founderLocation = getRoomCareAnchor(exam, examDefinition, "clinician");
    state.environment.founderActivity.pathIndex = 1;
    expect(createPrototypePlayerView(state, null, false, null).facility.founder.seated).toBe(true);
  });

  it("only seats the founder after a chair auto-plan arrives", () => {
    const state = createInitialGameState();
    const location = { ...state.environment.founderLocation };
    const chair = { x: location.x + 1, y: location.y };
    state.environment.founderActivity = {
      kind: "sit_in_chair",
      targetId: "chair.test",
      path: [location, chair],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 10,
    };
    expect(createPrototypePlayerView(state, null, false, null).facility.founder.seated).toBe(false);
    state.environment.founderLocation = chair;
    state.environment.founderActivity.pathIndex = 1;
    expect(createPrototypePlayerView(state, null, false, null).facility.founder.seated).toBe(true);
    for (const kind of ["wander_facility", "visit_bathroom"] as const) {
      state.environment.founderActivity = {
        kind,
        targetId: `auto.${kind}`,
        path: [chair],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        workMinutesRemaining: 10,
      };
      expect(createPrototypePlayerView(state, null, false, null).facility.founder.seated).toBe(false);
    }
  });
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
