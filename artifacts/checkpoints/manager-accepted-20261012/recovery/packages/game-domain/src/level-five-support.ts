import { APPROVED_LEVEL5_SUPPORT_ROUTES, getRoomUpgradePoints, LEVEL_FIVE_SUPPORT_TUNING } from "@gamify-surgery/balance-config";
import { findCareAwareFacilityPath } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import type { DomainContext, EmployeeState, GameState, GardenVisitBenefit, GridPoint, PatientAmenityTripState, PlacedRoom } from "./types";

export function getFounderOfficeMoraleBonus(state: Pick<GameState, "facilityLevel" | "rooms">): number {
  if (state.facilityLevel < 5) return 0;
  const office = state.rooms.find(room => room.roomDefinitionId === "room.founder_office");
  return office ? LEVEL_FIVE_SUPPORT_TUNING.founderOwnershipMorale +
    getRoomUpgradePoints(office.roomDefinitionId, office.upgradeLevel, "founder_office_morale_points") : 0;
}

/** Current stored/earned morale plus one reversible ownership modifier. */
export function getEmployeeEffectiveMorale(state: Pick<GameState, "facilityLevel" | "rooms">, employee: Pick<EmployeeState, "morale">): number {
  if (state.facilityLevel < 5) return employee.morale;
  return Math.max(0, Math.min(100, employee.morale + getFounderOfficeMoraleBonus(state)));
}

export function getAverageEffectiveStaffMorale(state: Pick<GameState, "facilityLevel" | "rooms" | "employees">): number | null {
  return state.employees.length ? state.employees.reduce((sum, employee) => sum + getEmployeeEffectiveMorale(state, employee), 0) / state.employees.length : null;
}

export function getGardenSatisfactionPoints(level: number): number {
  return LEVEL_FIVE_SUPPORT_TUNING.gardenSatisfaction + getRoomUpgradePoints("room.indoor_garden", level, "garden_satisfaction_points");
}

export function getGymMoralePoints(level: number): number {
  return LEVEL_FIVE_SUPPORT_TUNING.gymMorale + getRoomUpgradePoints("room.staff_gym", level, "gym_morale_points");
}

export function getPatientAmenityRoomId(trip: PatientAmenityTripState): string {
  return trip.amenityKind === "garden" ? trip.gardenRoomInstanceId : trip.bathroomRoomInstanceId;
}

const same = (a: GridPoint, b: GridPoint) => a.x === b.x && a.y === b.y;
type SupportRoute = (typeof APPROVED_LEVEL5_SUPPORT_ROUTES)["room.indoor_garden"][number];
const routesFor = (room: PlacedRoom): readonly SupportRoute[] =>
  APPROVED_LEVEL5_SUPPORT_ROUTES[room.roomDefinitionId as keyof typeof APPROVED_LEVEL5_SUPPORT_ROUTES] ?? [];

function doorSegment(door: GameState["doors"][number]): string {
  return door.side === "north" || door.side === "south"
    ? `${door.side === "north" ? "N" : "S"}${door.offset + 1}`
    : `${door.side === "west" ? "W" : "E"}${String.fromCharCode(65 + door.offset)}`;
}

function worldPath(room: PlacedRoom, route: SupportRoute): GridPoint[] {
  // Retain every approved logical knot, including synchronization duplicates.
  return route.logicalPath.map(point => ({ x: room.x + point[0]!, y: room.y + point[1]! }));
}

function outside(room: PlacedRoom, route: SupportRoute): GridPoint {
  const first = worldPath(room, route)[0]!;
  return { x: Math.round(first.x), y: Math.round(first.y) };
}

function ordinaryPath(state: GameState, context: DomainContext, start: GridPoint, target: GridPoint, allowed = new Set<string>()): GridPoint[] {
  const path = findCareAwareFacilityPath(state, context, start, target, allowed);
  return path.length ? path : findRouteFromDisplacedLocationToPoint(state, context, start, target, allowed);
}

/** Coarse public circulation ends outside; native radius-clear knots enter the room. */
export function findLevelFiveSupportPath(state: GameState, room: PlacedRoom, contactId: string, start: GridPoint, context: DomainContext): { path: GridPoint[]; doorId: string } | null {
  for (const door of state.doors.filter(door => door.roomId === room.id).sort((a, b) => a.id.localeCompare(b.id))) {
    const route = routesFor(room).find(route => route.targetId === contactId && route.doorSegment === doorSegment(door));
    if (!route) continue;
    if (room.roomDefinitionId === "room.executive_office") {
      const retained = routesFor(room).find(candidate => candidate.targetId === contactId && worldPath(room, candidate).some(point => same(point, start)));
      if (retained) {
        const native = worldPath(room, retained), index = native.findIndex(point => same(point, start));
        return { path: native.slice(index), doorId: door.id };
      }
    }
    const originRoom = room.roomDefinitionId === "room.executive_office" ? getLevelFiveSupportRoomAt(state, start) : null;
    const publicPath = originRoom && originRoom.id !== room.id
      ? findLevelFiveSupportExitPath(state, originRoom, start, outside(room, route), context)
      : ordinaryPath(state, context, start, outside(room, route));
    if (!publicPath.length) continue;
    return { path: [...publicPath, ...worldPath(room, route)], doorId: door.id };
  }
  return null;
}

/** Leave a native contact/approach before returning to ordinary circulation. */
export function findLevelFiveSupportExitPath(state: GameState, room: PlacedRoom, start: GridPoint, target: GridPoint, context: DomainContext, allowed = new Set<string>()): GridPoint[] {
  for (const door of state.doors.filter(door => door.roomId === room.id).sort((a, b) => a.id.localeCompare(b.id))) {
    const routes = routesFor(room).filter(route => route.doorSegment === doorSegment(door));
    const match = routes.flatMap(route => worldPath(room, route).map((point, index) => ({ route, point, index })))
      .sort((a, b) => Math.hypot(a.point.x - start.x, a.point.y - start.y) - Math.hypot(b.point.x - start.x, b.point.y - start.y))[0];
    if (!match) continue;
    const publicPath = ordinaryPath(state, context, outside(room, match.route), target, allowed);
    if (!publicPath.length) continue;
    if (same(match.point, start)) return [...worldPath(room, match.route).slice(0, match.index + 1).reverse(), ...publicPath];
    // A closed entrance may leave an actor on its old approach. Use the
    // permanent contact to join another live approved exit, never a closed wall.
    for (const original of routesFor(room)) {
      const oldPath = worldPath(room, original), index = oldPath.findIndex(point => same(point, start));
      if (index < 0) continue;
      const exit = routes.find(route => route.targetId === original.targetId);
      if (!exit) continue;
      const continuation = ordinaryPath(state, context, outside(room, exit), target, allowed);
      if (continuation.length) return [...oldPath.slice(index), ...worldPath(room, exit).reverse(), ...continuation];
    }
  }
  return [];
}

export function getLevelFiveSupportExitDoorId(state: GameState, room: PlacedRoom, path: readonly GridPoint[]): string | undefined {
  return state.doors.filter(door => door.roomId === room.id).map(door => {
    const route = routesFor(room).find(route => route.doorSegment === doorSegment(door));
    const first = route ? worldPath(room, route)[0] : null;
    return { id: door.id, index: first ? path.reduce((latest, point, index) => same(point, first) ? index : latest, -1) : -1 };
  }).filter(door => door.index >= 0).sort((a, b) => b.index - a.index)[0]?.id;
}

export function getLevelFiveSupportRoomAt(state: GameState, location: GridPoint): PlacedRoom | undefined {
  return state.rooms.find(room => (room.roomDefinitionId === "room.executive_office" || location.x >= room.x && location.x < room.x + 4 && location.y >= room.y && location.y < room.y + 4) &&
    routesFor(room).some(route => worldPath(room, route).some(point => same(point, location))));
}

export function getLevelFiveSupportTarget(room: PlacedRoom, contactId: string): GridPoint | null {
  const route = routesFor(room).find(route => route.targetId === contactId);
  return route ? worldPath(room, route).at(-1)! : null;
}

export function validateSavedGymBreakReservations(state: GameState): void {
  const claims = new Set<string>();
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (task?.roomUpgradeBreakBenefit?.roomDefinitionId !== "room.staff_gym") continue;
    const room = state.rooms.find(room => room.id === task.targetId);
    if (!room) continue; // Lost-room interruption is reconciled by the existing task reader.
    const key = `${room.id}:${task.seatId}`;
    const target = getLevelFiveSupportTarget(room, task.seatId!);
    if (claims.has(key) || !target || !employee.path.length || !same(employee.path.at(-1)!, target)) throw new Error("The saved gym break reservation is invalid.");
    claims.add(key);
  }
}

/** Strict accepted clocks/contact/path cursors, without resetting overdue work. */
export function validateSavedGardenRest(state: GameState, trip: Extract<PatientAmenityTripState, { amenityKind: "garden" }>): boolean {
  const encounter = trip.actorKind === "encounter" ? state.encounters[trip.actorId] : null;
  const visitor = trip.actorKind === "service_visitor" ? state.serviceOperations.find(operation => operation.id === trip.actorId) : null;
  const actor = encounter ?? visitor;
  const location = encounter?.patientLocation ?? visitor?.location;
  const room = state.rooms.find(room => room.id === trip.gardenRoomInstanceId);
  if (!actor || !location) return false;
  if (state.facilityLevel < 5 || encounter?.frozenCase.pediatricProfile || visitor?.clinicVisit && visitor.clinicVisit.demographics.ageYears < 18 ||
    Object.values(state.pediatricFamilies ?? {}).some(family => family.child.kind === trip.actorKind && family.child.id === trip.actorId) ||
    trip.startedAtFacilityTick > state.facilityTick || trip.lastMovedAtFacilityTick > state.facilityTick ||
    !same(location, trip.path[trip.pathIndex]!) || actor.gardenVisitBenefit && trip.status !== "returning") return invalid();
  if (trip.status === "returning") {
    if (!trip.returnBlocked && !same(trip.path.at(-1)!, trip.returnTarget)) return invalid();
  } else {
    if (!room || room.roomDefinitionId !== "room.indoor_garden") return false;
    const target = getLevelFiveSupportTarget(room, trip.gardenSeatId);
    if (!target || !same(trip.path.at(-1)!, target) ||
      trip.status === "using_amenity" && (!same(location, target) || trip.dwellEndsAtFacilityTick! < trip.startedAtFacilityTick + trip.gardenRestMinutes)) return invalid();
  }
  return true;
}

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const level = (value: unknown): value is 1 | 2 | 3 | 4 | 5 => value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const tick = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const point = (value: unknown): value is GridPoint => record(value) && typeof value.x === "number" && Number.isFinite(value.x) && typeof value.y === "number" && Number.isFinite(value.y);
const invalid = (): never => { throw new Error("The saved garden rest contract is invalid."); };

export function normalizeGardenVisitBenefit(value: unknown, facilityTick: number): GardenVisitBenefit | undefined {
  if (value === undefined) return undefined;
  if (!record(value) || Object.keys(value).some(key => !["version", "roomInstanceId", "upgradeLevel", "seatId", "points", "completedAtFacilityTick"].includes(key)) ||
    value.version !== "garden-visit-benefit.v1" || !id(value.roomInstanceId) || !level(value.upgradeLevel) ||
    (value.seatId !== "leftSeat" && value.seatId !== "rightSeat") || value.points !== getGardenSatisfactionPoints(value.upgradeLevel) ||
    !tick(value.completedAtFacilityTick) || value.completedAtFacilityTick > facilityTick) return invalid();
  return { version: "garden-visit-benefit.v1", roomInstanceId: value.roomInstanceId, upgradeLevel: value.upgradeLevel,
    seatId: value.seatId, points: value.points as number, completedAtFacilityTick: value.completedAtFacilityTick };
}

export function normalizeGardenRestTrip(value: unknown): Extract<PatientAmenityTripState, { amenityKind: "garden" }> {
  if (!record(value) || Object.keys(value).some(key => !["version", "id", "actorKind", "actorId", "amenityKind", "gardenRoomInstanceId", "gardenSeatId", "gardenUpgradeLevel", "gardenSatisfactionPoints", "gardenRestMinutes", "supportDoorId", "status", "startedAtFacilityTick", "dwellEndsAtFacilityTick", "returnRequested", "returnTarget", "path", "pathIndex", "lastMovedAtFacilityTick", "returnBlocked"].includes(key)) ||
    value.version !== "patient-amenity-trip.v1" || value.amenityKind !== "garden" || !id(value.id) || !id(value.actorId) ||
    (value.actorKind !== "encounter" && value.actorKind !== "service_visitor") || !id(value.gardenRoomInstanceId) ||
    (value.gardenSeatId !== "leftSeat" && value.gardenSeatId !== "rightSeat") || !level(value.gardenUpgradeLevel) ||
    value.gardenSatisfactionPoints !== getGardenSatisfactionPoints(value.gardenUpgradeLevel) || value.gardenRestMinutes !== LEVEL_FIVE_SUPPORT_TUNING.gardenRestMinutes ||
    !id(value.supportDoorId) || !["walking_to_amenity", "using_amenity", "returning"].includes(value.status as string) ||
    !tick(value.startedAtFacilityTick) || !(value.dwellEndsAtFacilityTick === null || tick(value.dwellEndsAtFacilityTick)) ||
    value.status === "using_amenity" && value.dwellEndsAtFacilityTick === null ||
    typeof value.returnRequested !== "boolean" || !point(value.returnTarget) || !Array.isArray(value.path) || !value.path.length || !value.path.every(point) ||
    !tick(value.pathIndex) || value.pathIndex >= value.path.length || !tick(value.lastMovedAtFacilityTick) ||
    value.returnBlocked !== undefined && (value.returnBlocked !== true || value.status !== "returning" || value.returnRequested !== true || value.dwellEndsAtFacilityTick !== null)) return invalid();
  return structuredClone(value) as unknown as Extract<PatientAmenityTripState, { amenityKind: "garden" }>;
}
