import { createInitialGameState, getRoomDefinition, getRoomWaitingAnchors, TUTORIAL_ENCOUNTER_ID, type GameState } from "@gamify-surgery/game-domain";
import { buildFixture, hallwaySaleClinic } from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { createPrototypePlayerView } from "../session/viewModels";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import type { FacilityRoomView, FacilityViewModel } from "./types";

export const waitingRoom = "public.geometry.waiting";
export const waitingDoor = "public.geometry.waiting-door";
export const seatHall = (x: number) => `public.geometry.hall.${x}`;

export function seatedClinic() {
  const state = buildFixture(hallwaySaleClinic(),
    { type: "PLACE_ROOM", roomId: seatHall(36), roomDefinitionId: "room.hallway", x: 36, y: 26, orientation: 0 },
    { type: "PLACE_ROOM", roomId: seatHall(37), roomDefinitionId: "room.hallway", x: 37, y: 26, orientation: 0 },
    { type: "PLACE_ROOM", roomId: seatHall(38), roomDefinitionId: "room.hallway", x: 38, y: 26, orientation: 0 },
    { type: "PLACE_ROOM", roomId: waitingRoom, roomDefinitionId: "room.waiting", x: 37, y: 23, orientation: 0 },
    { type: "PLACE_DOOR", roomId: waitingRoom, doorId: waitingDoor, side: "south", offset: 1 },
  );
  const room = state.rooms.find(candidate => candidate.id === waitingRoom)!;
  const seats = getRoomWaitingAnchors(room, getRoomDefinition(room.roomDefinitionId)!);
  const patient = createInitialGameState().encounters[TUTORIAL_ENCOUNTER_ID]!;
  state.encounters[patient.id] = {
    ...patient, patientMovement: null, patientLocation: seats[0]!, assignedRoomInstanceId: waitingRoom,
  };
  return { state, seats };
}

export function projectFacility(state: GameState, buildMode = false): FacilityViewModel {
  const facility = createPrototypePlayerView(state, null, false, null, buildMode).facility;
  return { ...facility, buildDoorTool: buildMode ? "place" : null };
}

export function syntheticRoom(instanceId: string, tileX: number, tileY: number, width = 1, height = 1): FacilityRoomView {
  return { instanceId, definitionId: "room.synthetic", displayName: instanceId, tileX, tileY, width, height, isFounderRoom: false };
}

export function doorScene(model: FacilityViewModel, trace = false) {
  const f = headlessFacilityScene(model, false, trace);
  // Use the real bitmap pose/registration path with the headless display objects.
  f.scene.textures.exists = (key: string) => key.startsWith("stitchin-time-art:character") || key === "character-contact-shadow";
  f.scene.ensureCharacterStills = () => {};
  let time = 0;
  const frame = (view = f.bridge.viewModel) => {
    f.bridge.viewModel = view;
    const delta = 1000 / 60;
    f.scene.time.now = time += delta;
    f.scene.update(time, delta);
  };
  return { ...f, frame };
}
