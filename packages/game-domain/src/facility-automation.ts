import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { findCareAwareFacilityPath } from "./care-room-access";
import { getRoomDefinition, isEmployeeAssignedToOperationalRoom } from "./selectors";
import { getRoomNavigationAnchor, getRotatedFootprint } from "./spatial";
import type { DomainContext, GameState, GridPoint } from "./types";

/** The A5 cooler is an obstacle; all refill commands approach adjacent B5. */
export function getWaterCoolerApproachLocation(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GridPoint | null {
  const frontRoom = state.rooms.find((room) => context.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId));
  const definition = frontRoom ? getRoomDefinition(frontRoom.roomDefinitionId, context) : null;
  return frontRoom && definition
    ? { x: frontRoom.x + Math.max(0, getRotatedFootprint(definition, frontRoom.orientation).width - 1), y: frontRoom.y + 1 }
    : null;
}

function installedHomeAnchor(state: GameState, employeeId: string, roomDefinitionId: string, context: DomainContext) {
  const employee = state.employees.find((candidate) => candidate.id === employeeId);
  const home = state.rooms.find((room) => room.id === employee?.homeRoomInstanceId);
  const definition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
  return home?.roomDefinitionId === roomDefinitionId && definition && isEmployeeAssignedToOperationalRoom(state, employeeId, context)
    ? getRoomNavigationAnchor(home, definition, "staff") : null;
}

/** Coverage is durable installed capability, not a test of current idleness. */
export function hasAutoWaterCoverage(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): boolean {
  if (state.employees.some((employee) => employee.facilityTask?.kind === "refill_water")) return true;
  const approach = getWaterCoolerApproachLocation(state, context);
  if (!approach) return false;
  return state.employees.some((employee) => {
    if (employee.staffRoleDefinitionId !== "staff.receptionist") return false;
    const anchor = installedHomeAnchor(state, employee.id, "room.front_desk", context);
    return Boolean(anchor && findCareAwareFacilityPath(state, context, anchor, approach).length > 0);
  });
}

export function hasAutoTrashCoverage(state: GameState, litterId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): boolean {
  if (state.employees.some((employee) => employee.facilityTask?.kind === "collect_litter" && employee.facilityTask.targetId === litterId)) return true;
  const litter = state.environment.litterItems.find((item) => item.id === litterId);
  if (!litter) return false;
  return state.employees.some((employee) => {
    if (employee.staffRoleDefinitionId !== "staff.evs_worker") return false;
    const anchor = installedHomeAnchor(state, employee.id, "room.evs_closet", context);
    return Boolean(anchor && findCareAwareFacilityPath(state, context, anchor, litter.location, new Set([litter.roomId])).length > 0);
  });
}
