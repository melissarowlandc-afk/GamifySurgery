import { getRoomDefinition, getStaffRoleDefinition, isRoomAvailableForNewFacilityWork } from "./selectors";
import type { DomainContext, GameState, PlacedRoom } from "./types";

export const ROOM_UPKEEP_OUTAGE_VERSION = "room-upkeep-outage.v1" as const;

// These are revenue pathways, including teaching and autonomous/retail work.
// Support rooms keep their ordinary upkeep even when their dependent room fails.
const REVENUE_ROOM_STAFF: Readonly<Record<string, readonly string[]>> = {
  "room.examination": [],
  "room.minor_procedure": [],
  "room.ultrasound": ["staff.imaging_technician"],
  "room.xray": ["staff.imaging_technician"],
  "room.ct": ["staff.imaging_technician"],
  "room.phlebotomy": ["staff.phlebotomist"],
  "room.endoscopy": ["staff.endoscopy_nurse", "staff.periop_nurse"],
  "room.coffee_kiosk": [],
  "room.glp1_telehealth_suite": ["staff.glp1_np"],
  "room.ambulatory_or": ["staff.or_nurse", "staff.periop_nurse"],
  "room.laboratory": ["staff.laboratory_technician"],
  "room.pharmacy": ["staff.pharmacist"],
  "room.vending": [],
  "room.reading": ["staff.radiologist"],
};
const LOCAL_STAFF_ROOMS = new Set([
  "room.glp1_telehealth_suite", "room.pharmacy", "room.reading",
]);

/** Discard unobserved gaps/future clocks; legacy downtime starts at load. */
export function normalizeRoomUpkeepOutage(
  value: unknown,
  facilityTick: number,
): PlacedRoom["upkeepOutage"] {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  if (raw.version !== ROOM_UPKEEP_OUTAGE_VERSION ||
      typeof raw.sinceFacilityTick !== "number" || !Number.isSafeInteger(raw.sinceFacilityTick) ||
      raw.sinceFacilityTick < 0 || raw.sinceFacilityTick > facilityTick ||
      raw.lastObservedFacilityTick !== facilityTick) return undefined;
  return { version: ROOM_UPKEEP_OUTAGE_VERSION, sinceFacilityTick: raw.sinceFacilityTick,
    lastObservedFacilityTick: facilityTick };
}

/**
 * Observe durable technical capacity, never idleness or instantaneous staff
 * availability. Queues, recovery beds, walking, training, breaks, discussions,
 * the appointment switch and lack of patients do not start an outage clock.
 */
export function synchronizeRoomUpkeepOutages(state: GameState, context: DomainContext): void {
  const operational = new Map<string, boolean>();
  const isOperational = (room: PlacedRoom): boolean => {
    let result = operational.get(room.id);
    if (result === undefined) {
      result = isRoomAvailableForNewFacilityWork(state, room.id, context);
      operational.set(room.id, result);
    }
    return result;
  };
  const hasAssignedRole = (roleId: string, target: PlacedRoom): boolean => state.employees.some((employee) => {
    if (employee.staffRoleDefinitionId !== roleId || !employee.homeRoomInstanceId) return false;
    if (LOCAL_STAFF_ROOMS.has(target.roomDefinitionId) && employee.homeRoomInstanceId !== target.id) return false;
    const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId);
    const role = getStaffRoleDefinition(roleId, context);
    if (!home || !role || !isOperational(home)) return false;
    // A stale/incompatible home is not an installed staff assignment.
    const allowedHomes = [...role.requiredRoomDefinitionIds, ...role.requiredAnyRoomDefinitionIds];
    return allowedHomes.includes(home.roomDefinitionId);
  });
  for (const room of state.rooms) {
    const requiredRoles = REVENUE_ROOM_STAFF[room.roomDefinitionId];
    if (!requiredRoles || !getRoomDefinition(room.roomDefinitionId, context)) {
      delete room.upkeepOutage;
      continue;
    }
    const recoveryRequired = room.roomDefinitionId === "room.endoscopy" || room.roomDefinitionId === "room.ambulatory_or";
    const unavailable = !isOperational(room) ||
      !requiredRoles.every((roleId) => hasAssignedRole(roleId, room)) ||
      (recoveryRequired && !state.rooms.some((candidate) => candidate.roomDefinitionId === "room.periop_recovery" && isOperational(candidate)));
    // The founder is an installed provider fallback for minor/endoscopy/OR;
    // ordinary provider busyness is a queue, not a technical outage.
    if (!unavailable) {
      delete room.upkeepOutage;
      continue;
    }
    const previous = room.upkeepOutage;
    const continuous = previous?.version === ROOM_UPKEEP_OUTAGE_VERSION &&
      Number.isSafeInteger(previous.sinceFacilityTick) && previous.sinceFacilityTick >= 0 &&
      previous.sinceFacilityTick <= previous.lastObservedFacilityTick &&
      (previous.lastObservedFacilityTick === state.facilityTick ||
        previous.lastObservedFacilityTick === state.facilityTick - 1);
    room.upkeepOutage = {
      version: ROOM_UPKEEP_OUTAGE_VERSION,
      sinceFacilityTick: continuous ? previous.sinceFacilityTick : state.facilityTick,
      lastObservedFacilityTick: state.facilityTick,
    };
  }
}
