import type { GameState } from "@gamify-surgery/game-domain";

import type { FacilityCameraView } from "./types";

/**
 * Camera selection is session-only. New Level 0 clinics use a slightly closer
 * overview that keeps the complete cutaway Front Desk shell (including its
 * rear frame and south entrance) inside the ordinary facility viewport.
 * A player's later pan/zoom is retained for the life of that session and all
 * larger clinics keep their existing overview.
 */
export function getInitialFacilityCamera(
  state: Pick<GameState, "facilityLevel" | "rooms">,
): FacilityCameraView {
  const isolatedFounderDesk =
    state.facilityLevel === 0 &&
    state.rooms.length === 1 &&
    state.rooms[0]?.roomDefinitionId === "room.front_desk";
  return {
    zoom: isolatedFounderDesk ? 1.1 : 1,
    panX: 0,
    panY: 0,
  };
}
