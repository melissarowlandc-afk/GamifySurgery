import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import type { FacilityRoomView, FacilityViewModel } from "./types";

export interface ThumbnailBounds { x: number; y: number; width: number; height: number }

// Shared with the browser-free PNG verifier; geometry has one source of truth.
export { roomThumbnailStage } from "./roomThumbnailPixels.mjs";

/** A save-free projection of the same base room purchased at any unlock level. */
export function roomThumbnailModel(definitionId: string, tier = 1): FacilityViewModel {
  const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(room => room.id === definitionId);
  if (!definition?.buildable) throw new Error(`Room is not buildable: ${definitionId}`);
  if (!Number.isInteger(tier) || tier < 1 || tier > definition.maximumUpgradeLevel) throw new Error(`Invalid thumbnail tier: ${tier}`);
  const room: FacilityRoomView = {
    instanceId: `thumbnail-${definitionId}-tier-${tier}`, definitionId, displayName: definition.displayName,
    tileX: 0, tileY: 0, width: definition.width, height: definition.height,
    isFounderRoom: definitionId === "room.front_desk", kind: definition.kind,
    orientation: 0, doorSide: null, upgradeLevel: tier as FacilityRoomView["upgradeLevel"], cleanliness: 100,
  };
  return {
    facilityTitle: "Room thumbnail", facilityTick: 0, paused: true, simulationSpeed: 1,
    realMillisecondsPerFacilityMinuteAt1x: 1_000, characterTravelTilesPerFacilityMinute: 1,
    gridColumns: definition.width, gridRows: definition.height,
    patientCounts: { waiting: 0, active: 0, actionReady: 0, resolved: 0 },
    // FacilityScene expects the founder's appearance in the view contract;
    // this hook draws no characters and does not create a game/session state.
    founder: { displayName: "", appearance: {
      version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
      hairShade: 3, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
      accessory: "none", headVariant: 0, bodyVariant: 0, roleStyle: "founder",
    } },
    rooms: [room], doors: [], staff: [], patients: [], placement: null,
    ...(definition.unlockFacilityLevel === 5 ? { levelFiveRoomArt: true as const } : {}),
  };
}

/** Tight alpha crop; a stage-edge hit means capture would silently cut off art. */
export function roomThumbnailAlphaBounds(rgba: ArrayLike<number>, width: number, height: number): ThumbnailBounds {
  if (![width, height].every(value => Number.isInteger(value) && value > 0) || rgba.length !== width * height * 4) {
    throw new Error("Invalid thumbnail pixel buffer");
  }
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!rgba[(y * width + x) * 4 + 3]) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < 0) throw new Error("Room capture is empty");
  if (left === 0 || top === 0 || right === width - 1 || bottom === height - 1) {
    throw new Error(`Room capture touches stage edge: alpha bounds [${left},${top}]-[${right},${bottom}], stage ${width}x${height}`);
  }
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

/** Preserve aspect ratio; center within a consistent 3× phone frame. */
export function fitRoomThumbnail(bounds: ThumbnailBounds, width: number, height: number, padding: number): ThumbnailBounds {
  if (![bounds.width, bounds.height, width, height].every(value => Number.isFinite(value) && value > 0) ||
      !Number.isFinite(padding) || padding < 0 || 2 * padding >= Math.min(width, height)) throw new Error("Invalid thumbnail frame");
  const scale = Math.min((width - padding * 2) / bounds.width, (height - padding * 2) / bounds.height);
  const fittedWidth = Math.max(1, Math.floor(bounds.width * scale));
  const fittedHeight = Math.max(1, Math.floor(bounds.height * scale));
  return { x: Math.floor((width - fittedWidth) / 2), y: Math.floor((height - fittedHeight) / 2), width: fittedWidth, height: fittedHeight };
}
