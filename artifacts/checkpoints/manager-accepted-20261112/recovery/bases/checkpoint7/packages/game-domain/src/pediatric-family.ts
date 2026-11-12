import { APPROVED_LEVEL4_SUPPORT_NAVIGATION, APPROVED_PEDIATRIC_SUPPORT_ROUTES,
  isApprovedLevel4SupportEligible } from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance, getPatientAppearanceSelectionContext,
  getPresentPatientDisplayNames } from "./appearance";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getDoorCells } from "./doors";
import { findCareAwareFacilityPath } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getRoomNavigableTiles, getRoomWaitingAnchors, getRoomStandingWaitingAnchors } from "./spatial";
import type { DomainContext, EncounterState, GameState, GridPoint, PediatricFamilyState, PlacedRoom, ServiceOperationState } from "./types";

type Reservation = NonNullable<PediatricFamilyState["reservation"]>;
type Travel = NonNullable<PediatricFamilyState["movement"]>;
export interface PediatricPairPlan { reservation: Reservation | null; movement: Travel }
const key = (point: GridPoint) => `${point.x.toFixed(5)},${point.y.toFixed(5)}`;
const same = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && key(a) === key(b));
const clone = (point: GridPoint) => ({ ...point });
const routes = APPROVED_PEDIATRIC_SUPPORT_ROUTES as Record<string, Array<{ doorSegment: string; supportId: string; walkingPath: number[][] }>>;
const roomOrder = ["room.pediatric_waiting", "room.waiting", "room.front_desk"];

export function pediatricFamilyForActor(state: GameState, kind: "encounter" | "service_visitor" | "companion", id: string): PediatricFamilyState | undefined {
  return Object.values(state.pediatricFamilies ?? {}).find(family => kind === "companion" ? family.parentActorId === id
    : family.child.kind === kind && family.child.id === id);
}

export function pediatricRoomAtPoint(state: GameState, context: DomainContext, point: GridPoint | null | undefined): PlacedRoom | undefined {
  if (!point) return undefined;
  return state.rooms.find(room => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    const width = room.orientation % 180 ? definition?.height : definition?.width;
    const height = room.orientation % 180 ? definition?.width : definition?.height;
    return width && height && point.x + .5 >= room.x && point.x + .5 < room.x + width && point.y + .5 >= room.y && point.y + .5 < room.y + height;
  });
}

function childRecord(state: GameState, family: PediatricFamilyState) {
  const encounter = family.child.kind === "encounter" ? state.encounters[family.child.id] : undefined;
  const operation = family.child.kind === "service_visitor" ? state.serviceOperations.find(row => row.id === family.child.id) : undefined;
  return { encounter, operation, location: encounter?.patientLocation ?? operation?.location ?? null,
    age: encounter?.frozenCase.prototypeDemographics?.ageYears ?? operation?.clinicVisit?.demographics.ageYears };
}

/** Admission freezes a distinct, adult parent look once. No procedural policy. */
export function createPediatricFamily(state: GameState, child: EncounterState | ServiceOperationState, kind: "encounter" | "service_visitor",
  authoredParent?: { displayName: string; sexLabel: "Female" | "Male" }): PediatricFamilyState {
  const id = `pediatric-family.${kind}.${child.id}`;
  const existing = state.pediatricFamilies?.[id];
  if (existing) return existing;
  const parentActorId = `parent.${kind}.${child.id}`;
  const parentSex = authoredParent?.sexLabel ?? (deterministicInteger(state.campaignSeed, RANDOM_STREAMS.patientIdentity, `${id}:parent-sex.v1`, 2) ? "Female" : "Male");
  const family: PediatricFamilyState = { version: "pediatric-family.v1", id, child: { kind, id: child.id },
    parentActorId, phase: "arriving", reservation: null };
  (state.pediatricFamilies ??= {})[id] = family;
  if (kind === "encounter") (child as EncounterState).pediatricFamilyId = id;
  else (child as ServiceOperationState).clinicVisit!.pediatricFamilyId = id;
  const location = kind === "encounter" ? (child as EncounterState).patientLocation : (child as ServiceOperationState).location;
  state.retailExternalActors.push({ id: parentActorId, kind: "companion", pediatricFamilyId: id,
    displayName: authoredParent?.displayName ?? createPatientDisplayName(state.campaignSeed, parentActorId, parentSex, getPresentPatientDisplayNames(state)),
    appearance: createPatientPixelAppearance(state.campaignSeed, parentActorId, { sexLabel: parentSex, ageYears: 38 }, "patient", getPatientAppearanceSelectionContext(state)),
    linkedEncounterId: kind === "encounter" ? child.id : null, linkedServiceOperationId: kind === "service_visitor" ? child.id : null,
    lifecycle: "arriving", location: location ? clone(location) : null, path: [], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
  return family;
}

function segment(door: GameState["doors"][number]) {
  return `${{ north: "N", east: "E", south: "S", west: "W" }[door.side]}${["east", "west"].includes(door.side) ? String.fromCharCode(65 + door.offset) : door.offset + 1}`;
}
function world(room: PlacedRoom, point: readonly number[]): GridPoint { return { x: room.x + point[0]! - .5, y: room.y + point[1]! - .5 }; }

export function pediatricSupportLocation(room: PlacedRoom, supportId: string): GridPoint | null {
  const support = APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.roomDefinitionId]?.find(row => row.id === supportId);
  return support ? { x: room.x + support.standingApproach.x - .5, y: room.y + support.standingApproach.y - .5 } : null;
}

export function pediatricSupportVisible(state: GameState, context: DomainContext, room: PlacedRoom, supportId: string): boolean {
  const support = APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.roomDefinitionId]?.find(row => row.id === supportId);
  if (!support) return false;
  return !support.hiddenByDoorSlots?.some(slot => state.doors.some(door => {
    if (door.roomId === room.id) return door.side === slot.side && door.offset === slot.offset;
    const other = state.rooms.find(row => row.id === door.roomId);
    const definition = other && getRoomDefinition(other.roomDefinitionId, context);
    const cells = other && definition && getDoorCells(door, other, definition);
    if (!cells) return false;
    const target = { x: room.x + (slot.side === "east" ? getRoomDefinition(room.roomDefinitionId, context)!.width - 1 : slot.side === "west" ? 0 : slot.offset),
      y: room.y + (slot.side === "south" ? getRoomDefinition(room.roomDefinitionId, context)!.height - 1 : slot.side === "north" ? 0 : slot.offset) };
    return same(cells.outside, target);
  }));
}

function join(...parts: GridPoint[][]): GridPoint[] {
  const result: GridPoint[] = [];
  for (const part of parts) for (const point of part) if (!same(result.at(-1), point)) result.push(clone(point));
  return result;
}

function ordinaryRoute(state: GameState, context: DomainContext, start: GridPoint, goal: GridPoint, allowed: Set<string>): GridPoint[] {
  const entranceDoor = state.doors.find(door => door.exterior);
  const entranceRoom = entranceDoor && state.rooms.find(room => room.id === entranceDoor.roomId);
  const definition = entranceRoom && getRoomDefinition(entranceRoom.roomDefinitionId, context);
  const entrance = entranceDoor && entranceRoom && definition ? getDoorCells(entranceDoor, entranceRoom, definition) : null;
  const street = (a: GridPoint, b: GridPoint): GridPoint[] => {
    if (![a.x, a.y, b.x, b.y].every(Number.isInteger)) return [];
    const points = [clone(a)]; let cursor = clone(a);
    while (!same(cursor, b)) {
      cursor = cursor.x !== b.x ? { x: cursor.x + Math.sign(b.x - cursor.x), y: cursor.y } : { x: cursor.x, y: cursor.y + Math.sign(b.y - cursor.y) };
      points.push(cursor);
    }
    return points;
  };
  if (entrance && start.y >= context.balanceRelease.facility.gridHeight) {
    if (goal.y >= context.balanceRelease.facility.gridHeight) return street(start, goal);
    const interior = findCareAwareFacilityPath(state, context, entrance.inside, goal, allowed);
    return interior.length ? join(street(start, entrance.outside), [entrance.inside], interior) : [];
  }
  if (entrance && goal.y >= context.balanceRelease.facility.gridHeight) {
    const interior = findRouteFromDisplacedLocationToPoint(state, context, start, entrance.inside, allowed);
    return interior.length ? join(interior, [entrance.outside], street(entrance.outside, goal)) : [];
  }
  return findRouteFromDisplacedLocationToPoint(state, context, start, goal, allowed);
}

/** Exit only along an approved native segment containing the current point. */
function exitVariants(state: GameState, context: DomainContext, start: GridPoint) {
  const room = pediatricRoomAtPoint(state, context, start);
  if (!room) return [{ path: [clone(start)], doorId: null as string | null }];
  const definition = getRoomDefinition(room.roomDefinitionId, context)!;
  const variants: Array<{ path: GridPoint[]; doorId: string | null }> = [];
  for (const door of state.doors.filter(row => row.roomId === room.id && !row.exterior)) {
    const cells = getDoorCells(door, room, definition);
    if (!cells) continue;
    if (routes[room.roomDefinitionId]) {
      for (const route of routes[room.roomDefinitionId]!.filter(row => row.doorSegment === segment(door))) {
        const native = route.walkingPath.map(point => world(room, point));
        const index = native.findIndex(point => same(point, start));
        if (index >= 0) variants.push({ path: join(native.slice(0, index + 1).reverse(), [cells.outside]), doorId: door.id });
      }
    }
    // Coarse points are used only before entering the native seating route.
    if (Number.isInteger(start.x) && Number.isInteger(start.y)) {
      const path = findCareAwareFacilityPath(state, context, start, cells.inside, new Set([room.id]));
      if (path.length) variants.push({ path: join(path, [cells.outside]), doorId: door.id });
    }
  }
  return variants;
}

function destinationVariants(state: GameState, context: DomainContext, room: PlacedRoom, location: GridPoint, seatId: string | null) {
  const definition = getRoomDefinition(room.roomDefinitionId, context)!;
  return state.doors.filter(door => door.roomId === room.id && !door.exterior).flatMap(door => {
    const cells = getDoorCells(door, room, definition);
    if (!cells) return [];
    const native = seatId ? routes[room.roomDefinitionId]?.find(route => route.doorSegment === segment(door) && route.supportId === seatId)
      : routes[room.roomDefinitionId]?.find(route => route.doorSegment === segment(door) && route.walkingPath.some(point => same(world(room, point), location)));
    const nativePath = native?.walkingPath.map(point => world(room, point));
    const path = nativePath ? (seatId ? nativePath : nativePath.slice(0, nativePath.findIndex(point => same(point, location)) + 1))
      : findCareAwareFacilityPath(state, context, cells.inside, location, new Set([room.id]));
    return path.length ? [{ path: join([cells.outside], path), doorId: door.id }] : [];
  });
}

function align(a: GridPoint[], b: GridPoint[], padStart: boolean): [GridPoint[], GridPoint[]] {
  const length = Math.max(a.length, b.length);
  const pad = (path: GridPoint[]) => padStart
    ? [...Array.from({ length: length - path.length }, () => clone(path[0]!)), ...path]
    : [...path, ...Array.from({ length: length - path.length }, () => clone(path.at(-1)!))];
  return [pad(a), pad(b)];
}

/** Pure plan first; the caller commits both physical places in one mutation. */
export function planPediatricPair(state: GameState, context: DomainContext, family: PediatricFamilyState, reservation: Reservation | null,
  point?: GridPoint): PediatricPairPlan | null {
  const child = childRecord(state, family);
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  if (!child.location || !parent?.location) return null;
  const room = reservation && state.rooms.find(row => row.id === reservation.roomInstanceId);
  if (reservation && !room) return null;
  const targetChild = reservation?.childLocation ?? point;
  const targetParent = reservation?.parentLocation ?? point;
  if (!targetChild || !targetParent) return null;
  if (same(child.location, targetChild) && same(parent.location, targetParent)) return { reservation,
    movement: { version: "pediatric-pair-travel.v1", childPath: [clone(targetChild)], parentPath: [clone(targetParent)],
      pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, doorIds: [] } };
  const destinationsChild = room ? destinationVariants(state, context, room, targetChild, reservation!.childSeatId) : [{ path: [targetChild], doorId: null }];
  const destinationsParent = room ? destinationVariants(state, context, room, targetParent, reservation!.parentSeatId) : [{ path: [targetParent], doorId: null }];
  const allowed = new Set([room?.id, pediatricRoomAtPoint(state, context, child.location)?.id].filter((id): id is string => Boolean(id)));
  for (const fromChild of exitVariants(state, context, child.location)) for (const fromParent of exitVariants(state, context, parent.location)) {
    if (fromChild.doorId !== fromParent.doorId) continue;
    for (const toChild of destinationsChild) for (const toParent of destinationsParent) {
      if (toChild.doorId !== toParent.doorId) continue;
      const common = ordinaryRoute(state, context, fromChild.path.at(-1)!, toChild.path[0]!, allowed);
      if (!common.length) continue;
      const [a, b] = align(fromChild.path, fromParent.path, true);
      const [c, d] = align(toChild.path, toParent.path, false);
      return { reservation, movement: { version: "pediatric-pair-travel.v1", childPath: [...a, ...common.slice(1), ...c.slice(1)],
        parentPath: [...b, ...common.slice(1), ...d.slice(1)], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
        doorIds: [...new Set([fromChild.doorId, toChild.doorId, ...state.doors.filter(door => {
          const owningRoom = state.rooms.find(row => row.id === door.roomId);
          const owningDefinition = owningRoom && getRoomDefinition(owningRoom.roomDefinitionId, context);
          const cells = owningRoom && owningDefinition && getDoorCells(door, owningRoom, owningDefinition);
          return cells && common.some(point => same(point, cells.inside));
        }).map(door => door.id)].filter((id): id is string => Boolean(id)))] } };
    }
  }
  return null;
}

export function commitPediatricPairPlan(family: PediatricFamilyState, plan: PediatricPairPlan): GridPoint[] {
  family.reservation = plan.reservation;
  family.movement = plan.movement;
  return plan.movement.childPath.map(clone);
}

/** Providers share the approved fine furniture approaches, without family slots. */
export function pathToPediatricSupport(state: GameState, context: DomainContext, start: GridPoint, room: PlacedRoom, supportId: string): GridPoint[] {
  const target = pediatricSupportLocation(room, supportId);
  if (!target || !pediatricSupportVisible(state, context, room, supportId)) return [];
  if (same(start, target)) return [clone(start)];
  const allowed = new Set([room.id, pediatricRoomAtPoint(state, context, start)?.id].filter((id): id is string => Boolean(id)));
  for (const from of exitVariants(state, context, start)) for (const to of destinationVariants(state, context, room, target, supportId)) {
    const common = ordinaryRoute(state, context, from.path.at(-1)!, to.path[0]!, allowed);
    if (common.length) return join(from.path, common, to.path);
  }
  return [];
}

/** One durable child visit, witnessed with its actual parent in the care room. */
export function recordPediatricVisitCompletion(state: GameState, visit: ServiceOperationState | EncounterState): void {
  const scored = "frozenCase" in visit;
  if (scored ? !visit.frozenCase.pediatricProfile || visit.resolutionReason !== "completed"
    : visit.clinicVisit?.kind !== "pediatric_consult" || visit.incomeLineId !== "income.pediatric_consult") return;
  const family = pediatricFamilyForActor(state, scored ? "encounter" : "service_visitor", visit.id);
  if (!family || !pediatricPairAtReservation(state, family)) return;
  if (scored && (family.reservation?.childSeatId !== "table:patient" || family.reservation.parentSeatId !== "parentChair" ||
    !state.rooms.some(room => room.id === family.reservation!.roomInstanceId && room.roomDefinitionId === "room.pediatric_examination"))) return;
  state.levelFourCompletion ??= { version: "level-four-completion.v1", pediatricVisitWithParent: null,
    woundOstomyCareVisit: null, acknowledgedAtFacilityTick: null };
  state.levelFourCompletion.pediatricVisitWithParent ??= { serviceOperationId: scored ? null : visit.id, encounterId: scored ? visit.id : null,
    incomeLineId: "income.pediatric_consult", completedAtFacilityTick: state.facilityTick, parentActorId: family.parentActorId };
}

function occupiedPlaces(state: GameState, family: PediatricFamilyState): Set<string> {
  const points: Array<GridPoint | null | undefined> = [state.environment.founderLocation];
  for (const other of Object.values(state.pediatricFamilies ?? {})) if (other.id !== family.id) points.push(other.reservation?.childLocation, other.reservation?.parentLocation);
  for (const encounter of Object.values(state.encounters)) if (encounter.id !== family.child.id) points.push(encounter.patientLocation, encounter.waitingDestination?.location);
  for (const operation of state.serviceOperations) if (operation.id !== family.child.id && !["completed", "cancelled"].includes(operation.status)) points.push(operation.location, operation.path.at(-1));
  for (const actor of state.retailExternalActors) if (actor.id !== family.parentActorId && actor.lifecycle !== "departed") points.push(actor.location, actor.path.at(-1));
  for (const employee of state.employees) points.push(employee.location, employee.path.at(-1));
  return new Set(points.filter((point): point is GridPoint => Boolean(point)).map(key));
}

function roomPlaces(state: GameState, context: DomainContext, room: PlacedRoom, family: PediatricFamilyState, parent: boolean) {
  const occupied = occupiedPlaces(state, family);
  const definition = getRoomDefinition(room.roomDefinitionId, context)!;
  const supports = APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.roomDefinitionId];
  if (supports) return supports.filter(support => isApprovedLevel4SupportEligible(support, parent ? "parent" : "child", childRecord(state, family).age) &&
    pediatricSupportVisible(state, context, room, support.id)).map(support => ({ seatId: support.id, location: pediatricSupportLocation(room, support.id)! }))
    .filter(place => !occupied.has(key(place.location))).sort((a, b) => Number(a.seatId.startsWith("kid")) * -1 - Number(b.seatId.startsWith("kid")) * -1 || a.seatId.localeCompare(b.seatId));
  const standing = new Set(getRoomStandingWaitingAnchors(room, definition).map(key));
  return getRoomWaitingAnchors(room, definition).filter(point => !standing.has(key(point)) && !occupied.has(key(point)))
    .map(location => ({ seatId: `waiting:${key(location)}`, location }));
}

export function planPediatricExam(state: GameState, context: DomainContext, family: PediatricFamilyState, room: PlacedRoom): PediatricPairPlan | null {
  if (room.roomDefinitionId !== "room.pediatric_examination") return null;
  const child = roomPlaces(state, context, room, family, false)[0];
  const parent = roomPlaces(state, context, room, family, true)[0];
  return child && parent ? planPediatricPair(state, context, family, { roomInstanceId: room.id, childLocation: child.location,
    parentLocation: parent.location, childSeatId: child.seatId, parentSeatId: parent.seatId }) : null;
}

export function planPediatricWaiting(state: GameState, context: DomainContext, family: PediatricFamilyState, excludedRoomId?: string): PediatricPairPlan | null {
  const rooms = state.rooms.filter(room => room.id !== excludedRoomId && roomOrder.includes(room.roomDefinitionId) && isRoomOperationalForFacilityWork(state, room.id, context))
    .sort((a, b) => roomOrder.indexOf(a.roomDefinitionId) - roomOrder.indexOf(b.roomDefinitionId) || a.id.localeCompare(b.id));
  // Exhaust reachable seated pairs before using standing overflow.
  for (const room of rooms) for (const child of roomPlaces(state, context, room, family, false)) for (const parent of roomPlaces(state, context, room, family, true)) {
    if (same(child.location, parent.location)) continue;
    const plan = planPediatricPair(state, context, family, { roomInstanceId: room.id, childLocation: child.location,
      parentLocation: parent.location, childSeatId: child.seatId, parentSeatId: parent.seatId });
    if (plan) return plan;
  }
  for (const room of rooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context)!;
    const occupied = occupiedPlaces(state, family);
    const seats = new Set((APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.roomDefinitionId] ?? []).map(support => key(pediatricSupportLocation(room, support.id)!)));
    const excluded = new Set(state.doors.filter(door => door.roomId === room.id).flatMap(door => {
      const cells = getDoorCells(door, room, definition);
      return cells ? [key(cells.inside), ...(routes[room.roomDefinitionId] ?? []).filter(route => route.doorSegment === segment(door))
        .map(route => key(world(room, route.walkingPath[0]!)))] : [];
    }));
    const nativeSpots = routes[room.roomDefinitionId]?.flatMap(route => route.walkingPath.map(point => world(room, point)))
      .filter(point => pediatricRoomAtPoint(state, context, point)?.id === room.id);
    const spots = (nativeSpots ? [...new Map(nativeSpots.map(point => [key(point), point])).values()]
      : getRoomNavigableTiles(room, definition, state.doors, state.rooms, id => getRoomDefinition(id, context)))
      .filter(point => !occupied.has(key(point)) && !seats.has(key(point)) && !excluded.has(key(point)));
    for (const childLocation of spots) for (const parentLocation of spots) {
      if (Math.hypot(childLocation.x - parentLocation.x, childLocation.y - parentLocation.y) < .36) continue;
      const plan = planPediatricPair(state, context, family, { roomInstanceId: room.id, childLocation, parentLocation, childSeatId: null, parentSeatId: null });
      if (plan) return plan;
    }
  }
  return null;
}

/** Own the two actor projections. Shared threshold knots are crossed atomically. */
export function advancePediatricPair(state: GameState, context: DomainContext, family: PediatricFamilyState,
  path: GridPoint[], pathIndex: number, lastMovedAtFacilityTick: number): number {
  let movement = family.movement;
  if (!movement || !same(movement.childPath.at(-1), path.at(-1)) || movement.childPath.length !== path.length) {
    // Legacy/M1 arrival or common public path: both lanes share the journey.
    family.movement = movement = { version: "pediatric-pair-travel.v1", childPath: path.map(clone), parentPath: path.map(clone),
      pathIndex, lastMovedAtFacilityTick, doorIds: [] };
  }
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  if (!parent) return pathIndex;
  if (movement.doorIds.some(id => !state.doors.some(door => door.id === id))) {
    parent.movementWaitReason = "Waiting together for a connected family route";
    movement.lastMovedAtFacilityTick = state.facilityTick;
    return pathIndex;
  }
  const index = Math.min(path.length - 1, pathIndex + Math.max(1, state.facilityTick - lastMovedAtFacilityTick) * context.balanceRelease.facility.characterTravelTilesPerTick);
  parent.path = movement.parentPath.map(clone); parent.pathIndex = index;
  parent.location = movement.parentPath[index] ? clone(movement.parentPath[index]!) : parent.location;
  parent.lastMovedAtFacilityTick = state.facilityTick; parent.movementWaitReason = null;
  movement.pathIndex = index; movement.lastMovedAtFacilityTick = state.facilityTick;
  return index;
}

/** Reconcile after every command and load, including paused access/build edits. */
export function reconcilePediatricFamilies(state: GameState, context: DomainContext): void {
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    if (family.phase === "departed") continue;
    const child = childRecord(state, family);
    const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
    if (!parent) continue;
    if (!child.location) {
      family.phase = "departed"; family.reservation = null; family.movement = undefined;
      parent.lifecycle = "departed"; parent.location = null; parent.path = []; parent.pathIndex = 0;
      continue;
    }
    const childPath = child.encounter?.patientMovement ?? child.operation;
    if (childPath?.path) {
      const movement = family.movement;
      const point = movement?.childPath[childPath.pathIndex];
      // Movement seams already advance the parent. A changed common path (e.g.
      // arrival) receives its linked projection before the state is returned.
      if (movement && same(point, child.location) && same(movement.childPath.at(-1), childPath.path.at(-1))) {
        parent.path = movement.parentPath.map(clone); parent.pathIndex = childPath.pathIndex;
        parent.location = clone(movement.parentPath[childPath.pathIndex]!);
      } else if (!movement && childPath.pathIndex < childPath.path.length - 1 && same(parent.location, child.location)) {
        parent.path = childPath.path.map(clone); parent.pathIndex = childPath.pathIndex;
      }
    }
    const reservedRoom = family.reservation && state.rooms.find(room => room.id === family.reservation!.roomInstanceId);
    if (family.reservation && !reservedRoom) family.reservation = null;
    if (reservedRoom?.roomDefinitionId === "room.pediatric_waiting" && family.reservation &&
      [family.reservation.childSeatId, family.reservation.parentSeatId].some(id => id && !pediatricSupportVisible(state, context, reservedRoom, id))) {
      // A paused doorway edit can remove a chair. Reserve two new places
      // together before replacing either actor's route or seated binding.
      const plan = planPediatricWaiting(state, context, family) ?? planPediatricPair(state, context, family, {
        roomInstanceId: reservedRoom.id, childLocation: clone(child.location), parentLocation: clone(parent.location!),
        childSeatId: null, parentSeatId: null,
      });
      if (plan) {
        const path = commitPediatricPairPlan(family, plan);
        if (child.encounter) {
          child.encounter.waitingDestination = { roomInstanceId: plan.reservation!.roomInstanceId,
            location: clone(plan.reservation!.childLocation), kind: plan.reservation!.childSeatId ? "chair" : "standing" };
          child.encounter.patientMovement = { kind: "walking_to_waiting", path, pathIndex: 0,
            lastMovedAtFacilityTick: state.facilityTick, destinationRoomInstanceId: plan.reservation!.roomInstanceId };
        } else if (child.operation) {
          child.operation.path = path; child.operation.pathIndex = 0; child.operation.lastMovedAtFacilityTick = state.facilityTick;
        }
      }
    }
    if (child.operation?.status === "leaving" || child.encounter?.patientMovement?.kind.startsWith("leaving")) {
      family.phase = "departing"; parent.lifecycle = "departing";
    } else if (child.encounter?.lifecycle === "active_pending_result") {
      family.phase = "results_wait"; parent.lifecycle = "onsite";
    } else if (child.operation?.status === "in_service" || child.encounter?.assignedRoomInstanceId &&
      state.rooms.some(room => room.id === child.encounter!.assignedRoomInstanceId && room.roomDefinitionId === "room.pediatric_examination")) {
      family.phase = "in_care"; parent.lifecycle = "onsite";
    } else {
      family.phase = child.operation?.status === "arriving" || child.encounter?.checkInStatus === "approaching" ? "arriving" : "waiting";
      parent.lifecycle = family.phase === "arriving" ? "arriving" : "onsite";
    }
    if (child.encounter && family.phase === "in_care") recordPediatricVisitCompletion(state, child.encounter);
  }
}

export function pediatricPairAtReservation(state: GameState, family: PediatricFamilyState): boolean {
  const child = childRecord(state, family);
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  return Boolean(family.reservation && same(child.location, family.reservation.childLocation) && same(parent?.location, family.reservation.parentLocation));
}

/** Capture a physical escape before a sale removes its door and footprint. */
export function planPediatricRoomSale(state: GameState, context: DomainContext, roomId: string): Map<string, PediatricPairPlan> {
  const plans = new Map<string, PediatricPairPlan>();
  const soldDoors = new Set(state.doors.filter(door => door.roomId === roomId).map(door => door.id));
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    const child = childRecord(state, family);
    if (family.phase === "departed" || family.reservation?.roomInstanceId !== roomId &&
      pediatricRoomAtPoint(state, context, child.location)?.id !== roomId) continue;
    const plan = planPediatricWaiting(state, context, family, roomId);
    if (plan) {
      // A sold room becomes open ground. Retain its safe escape vertices but
      // stop requiring a door that the sale deliberately removes.
      plan.movement.doorIds = plan.movement.doorIds.filter(id => !soldDoors.has(id));
      plans.set(family.id, plan);
    }
  }
  return plans;
}

export function applyPediatricRoomSale(state: GameState, plans: Map<string, PediatricPairPlan>): void {
  for (const [id, plan] of plans) {
    const family = state.pediatricFamilies?.[id];
    if (!family) continue;
    const path = commitPediatricPairPlan(family, plan);
    const child = childRecord(state, family);
    if (child.encounter) {
      child.encounter.patientMovement = { kind: "walking_to_waiting", path, pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick, destinationRoomInstanceId: plan.reservation!.roomInstanceId };
      child.encounter.waitingDestination = { roomInstanceId: plan.reservation!.roomInstanceId,
        location: clone(plan.reservation!.childLocation), kind: plan.reservation!.childSeatId ? "chair" : "standing" };
    } else if (child.operation) {
      child.operation.path = path; child.operation.pathIndex = 0; child.operation.lastMovedAtFacilityTick = state.facilityTick;
    }
  }
}
