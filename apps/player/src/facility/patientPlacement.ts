import type { GridPoint } from "@gamify-surgery/game-domain";
import type { FacilityRoomView } from "./types";

function stableIndex(stableId: string, modulus: number): number {
  let hash = 2166136261;
  for (let index = 0; index < stableId.length; index += 1) {
    hash ^= stableId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return modulus === 0 ? 0 : (hash >>> 0) % modulus;
}

/**
 * Assigns the current waiting patients to deterministic, non-overlapping room
 * tiles. Input order never changes the result. When no waiting room exists,
 * the empty map tells the scene to retain the Level 0 sidewalk queue.
 */
export function getWaitingPatientRoomLocations(
  patientIds: readonly string[],
  rooms: readonly FacilityRoomView[],
): ReadonlyMap<string, GridPoint> {
  const slots = rooms
    .filter((room) => room.definitionId === "room.waiting")
    .sort((left, right) => left.instanceId.localeCompare(right.instanceId))
    .flatMap((room) => {
      const roomSlots: GridPoint[] = [];
      for (let y = 0; y < room.height; y += 1) {
        for (let x = 0; x < room.width; x += 1) {
          roomSlots.push({
            x: room.tileX + x,
            y: room.tileY + y,
          });
        }
      }
      return roomSlots;
    });

  const locations = new Map<string, GridPoint>();
  if (slots.length === 0) {
    return locations;
  }

  const occupied = new Set<number>();
  [...new Set(patientIds)].sort().forEach((patientId) => {
    const preferredSlot = stableIndex(patientId, slots.length);
    let selectedSlot: number | null = null;
    for (let offset = 0; offset < slots.length; offset += 1) {
      const candidate = (preferredSlot + offset) % slots.length;
      if (!occupied.has(candidate)) {
        selectedSlot = candidate;
        occupied.add(candidate);
        break;
      }
    }
    if (selectedSlot !== null) {
      locations.set(patientId, { ...slots[selectedSlot]! });
    }
  });

  return locations;
}

/**
 * Keeps the sidewalk queue independent of Active/off-site patients and of the
 * renderer's object traversal order.
 */
export function getWaitingPatientQueueIndices(
  patientIds: readonly string[],
): ReadonlyMap<string, number> {
  return new Map(
    [...new Set(patientIds)]
      .sort()
      .map((patientId, index) => [patientId, index] as const),
  );
}
