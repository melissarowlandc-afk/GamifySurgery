import { facilityDefinitionReader, facilityNavigationKey } from "./facilityNavigation";
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
  { layoutKey: string; width: number; height: number; protectedKey: string; validation: FacilityAccessValidation }
>();


export function getCachedFacilityAccessValidation(
  state: Pick<GameState, "rooms" | "doors">,
  context: DomainContext,
): FacilityAccessValidation {
  const facility = context.balanceRelease.facility;
  const layoutKey = facilityNavigationKey(state.rooms, state.doors,
    facilityDefinitionReader(context));
  const protectedKey = JSON.stringify(facility.protectedRoomDefinitionIds);
  let cached = facilityAccessValidationCache.get(context);
  if (!cached || cached.layoutKey !== layoutKey || cached.width !== facility.gridWidth ||
      cached.height !== facility.gridHeight || cached.protectedKey !== protectedKey) {
    const facility = context.balanceRelease.facility;
    cached = {
      layoutKey, width: facility.gridWidth, height: facility.gridHeight, protectedKey,
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
