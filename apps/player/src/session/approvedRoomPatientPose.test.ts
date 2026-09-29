import { describe, expect, it } from "vitest";

import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("approved room patient pose projection", () => {
  it("keeps the Front Desk overflow patient standing while seating the one approved visitor chair", () => {
    const state = createInitialGameState();
    const encounter = Object.values(state.encounters)[0]!;
    const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
    encounter.lifecycle = "waiting_unopened";
    encounter.assignedRoomInstanceId = frontDesk.id;
    encounter.patientMovement = null;
    const patient = () => createPrototypePlayerView(state, null, false, null).facility.patients!
      .find((candidate) => candidate.instanceId === encounter.id)!;

    const standing = { x: frontDesk.x + 3, y: frontDesk.y + 3 };
    encounter.patientLocation = standing;
    encounter.waitingDestination = { roomInstanceId: frontDesk.id, location: standing, kind: "standing" };
    expect(patient()).toMatchObject({ location: standing, seated: false, pose: undefined });

    const chair = { x: frontDesk.x + 4, y: frontDesk.y + 3 };
    encounter.patientLocation = chair;
    encounter.waitingDestination = { roomInstanceId: frontDesk.id, location: chair, kind: "chair" };
    expect(patient()).toMatchObject({ location: chair, seated: true, pose: "seated" });
  });
});
