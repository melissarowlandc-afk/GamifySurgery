import { validateFacilityAccess, type FacilityAccessValidation } from "./doors";
import type { DomainContext, GameState } from "./types";

/**
 * Whole-facility door and reachability validation depends only on room
 * placement and doors, yet operational, staffing, scheduling, condition and
 * view checks ask for it dozens of times per facility minute. Recomputing it
 * each time dominated tick cost in large clinics, so the last result for each
 * domain context is reused until the layout changes.
 */
const facilityAccessValidationCache = new WeakMap<
  DomainContext,
  { layoutKey: string; validation: FacilityAccessValidation }
>();

function facilityAccessLayoutKey(state: Pick<GameState, "rooms" | "doors">): string {
  // Door and spatial validation read only these room fields.
  const rooms = state.rooms
    .map((room) => `${room.id}:${room.roomDefinitionId}:${room.x},${room.y}:${room.orientation ?? ""}:${room.doorSide ?? ""}`)
    .join("|");
  return `${rooms}#${JSON.stringify(state.doors)}`;
}

export function getCachedFacilityAccessValidation(
  state: Pick<GameState, "rooms" | "doors">,
  context: DomainContext,
): FacilityAccessValidation {
  const layoutKey = facilityAccessLayoutKey(state);
  let cached = facilityAccessValidationCache.get(context);
  if (!cached || cached.layoutKey !== layoutKey) {
    const facility = context.balanceRelease.facility;
    cached = {
      layoutKey,
      validation: validateFacilityAccess(
        state.rooms,
        state.doors,
        (definitionId) =>
          facility.roomDefinitions.find((definition) => definition.id === definitionId) ?? null,
        facility.gridWidth,
        facility.gridHeight,
        new Set(facility.protectedRoomDefinitionIds),
      ),
    };
    facilityAccessValidationCache.set(context, cached);
  }
  // Callers receive their own arrays, so the cached result cannot be mutated.
  return {
    ...cached.validation,
    issues: [...cached.validation.issues],
    unreachableRoomIds: [...cached.validation.unreachableRoomIds],
  };
}
