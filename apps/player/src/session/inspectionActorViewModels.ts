import { attendingReviewerByStillId, getRoomDefinition, inspectionReviewersForSeed, type GameState } from "@gamify-surgery/game-domain";
import type { FacilityInspectorActorView } from "../facility/types";

export function inspectionActorActivity(roomName: string | null): string {
  return roomName ? `Inspector · reviewing ${roomName}` : "Inspector · waiting for a safe route";
}

let legacyParty: { seed: string; reviewers: ReturnType<typeof inspectionReviewersForSeed> } | undefined;

function legacyReviewerForSlot(seed: string, slot: number) {
  // Native checkpoint proofs retain the source IDs. Cache their deterministic
  // replacements without rewriting the verified checkpoint.
  if (legacyParty?.seed !== seed) legacyParty = { seed, reviewers: inspectionReviewersForSeed(seed) };
  return legacyParty.reviewers[slot]!;
}

/** Only the presentation lane supplies these actors. */
export function createInspectionActorViews(state: GameState): FacilityInspectorActorView[] {
  const lane = state.levelFive?.inspectionPresentation;
  if (state.facilityLevel !== 5 || state.levelFive?.inspection.status !== "running" ||
    !lane?.seed || lane.runId !== state.levelFive.inspection.run?.id) return [];
  const seed = lane.seed;
  return lane.actors.map((actor, index) => {
    const reviewer = attendingReviewerByStillId(actor.stillId) ?? legacyReviewerForSlot(seed, index);
    const room = state.rooms.find(room => room.id === actor.targetRoomInstanceId);
    const roomName = room ? getRoomDefinition(room.roomDefinitionId)?.displayName ?? null : null;
    const from = actor.path[actor.pathIndex], to = actor.path[actor.pathIndex + 1];
    const moving = actor.phase === "walking" && Boolean(to);
    return { instanceId: actor.id, displayName: reviewer.displayName, appearance: {
      version: "pixel-avatar.v1", stillId: reviewer.stillId, bodyShape: "average", hairStyle: "short", skinTone: 1,
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
