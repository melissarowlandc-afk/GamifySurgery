import { getRoomDefinition, type GameState } from "@gamify-surgery/game-domain";
import type { FacilityInspectorActorView } from "../facility/types";

export function inspectionActorActivity(roomName: string | null): string {
  return roomName ? `Inspector · reviewing ${roomName}` : "Inspector · waiting for a safe route";
}

/** Only the presentation lane supplies these actors; no selection/appearance RNG is called. */
export function createInspectionActorViews(state: GameState): FacilityInspectorActorView[] {
  const lane = state.levelFive?.inspectionPresentation;
  if (state.facilityLevel !== 5 || state.levelFive?.inspection.status !== "running" ||
    !lane?.runId || lane.runId !== state.levelFive.inspection.run?.id) return [];
  return lane.actors.map(actor => {
    const room = state.rooms.find(room => room.id === actor.targetRoomInstanceId);
    const roomName = room ? getRoomDefinition(room.roomDefinitionId)?.displayName ?? null : null;
    const from = actor.path[actor.pathIndex], to = actor.path[actor.pathIndex + 1];
    const moving = actor.phase === "walking" && Boolean(to);
    return { instanceId: actor.id, appearance: {
      version: "pixel-avatar.v1", stillId: actor.stillId, bodyShape: "average", hairStyle: "short", skinTone: 1,
      hairShade: 3, faceStyle: "round", outfitStyle: "plain", outfitShade: 1, accessory: "none",
    },
      location: actor.location, path: actor.path, pathIndex: actor.pathIndex, moving,
      direction: moving && from && to ? to.x !== from.x ? "side" : to.y < from.y ? "back" : "front" : "front",
      observedRoomInstanceId: room?.id ?? null, observedRoomName: roomName,
      activity: inspectionActorActivity(roomName),
      ...(actor.phase === "stationary" && actor.observingUntilFacilityTick !== null &&
        actor.lastMovedAtFacilityTick < state.facilityTick && !roomName ? { routeIssue: "No safe inspection route; stationary observer." } : {}),
    };
  });
}
