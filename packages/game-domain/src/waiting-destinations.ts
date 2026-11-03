import { getDoorCells } from "./doors";
import { isProtectedCareRoom } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint, findRouteFromDisplacedLocationToPublicEntrance } from "./displaced-routing";
import { commitPediatricPairPlan, pediatricFamilyForActor, planPediatricPair, planPediatricWaiting } from "./pediatric-family";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomNavigableTiles, getRoomNavigationAnchor, getRoomWaitingAnchors, getRoomStandingWaitingAnchors } from "./spatial";
import type { DomainContext, EncounterState, GameState, GridPoint, PlacedRoom } from "./types";

export interface WaitingActor {
  kind: "encounter" | "service_visitor";
  id: string;
  location: GridPoint | null;
}
const pointKey = (point: GridPoint) => `${point.x},${point.y}`;
const samePoint = (left: GridPoint, right: GridPoint) => left.x === right.x && left.y === right.y;

function getPublicEntrance(state: GameState, context: DomainContext) {
  for (const door of state.doors.filter((candidate) => candidate.exterior)) {
    const room = state.rooms.find((candidate) => candidate.id === door.roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    const cells = room && definition ? getDoorCells(door, room, definition) : null;
    if (room && cells) return { room, ...cells };
  }
  return null;
}

/** Reconstruct an older visitor's reservation from its persisted endpoint. */
export function serviceWaitingPointKind(state: GameState, context: DomainContext, point: GridPoint | undefined): "chair" | "standing" | null {
  if (!point) return null;
  const entrance = getPublicEntrance(state, context);
  if (entrance && point.y === entrance.outside.y && Math.abs(point.x - entrance.outside.x) >= 2 &&
    point.x >= 0 && point.x < context.balanceRelease.facility.gridWidth) return "standing";
  for (const room of state.rooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition || room.roomDefinitionId === "room.front_desk" || isProtectedCareRoom(room) ||
      !isRoomOperationalForFacilityWork(state, room.id, context)) continue;
    if (getRoomWaitingAnchors(room, definition).some((anchor) => samePoint(anchor, point)) &&
      !getRoomStandingWaitingAnchors(room, definition).some((anchor) => samePoint(anchor, point))) return "chair";
    if ((room.roomDefinitionId === "room.waiting" || definition.navigation?.publicWaitingArea) &&
      getRoomNavigableTiles(room, definition, state.doors).some((tile) => samePoint(tile, point))) {
      if (definition.navigation?.staffAnchor && samePoint(getRoomNavigationAnchor(room, definition, "staff"), point)) continue;
      const inDoorway = state.doors.some((door) => {
        const owner = state.rooms.find((candidate) => candidate.id === door.roomId);
        const ownerDefinition = owner ? getRoomDefinition(owner.roomDefinitionId, context) : null;
        const cells = owner && ownerDefinition ? getDoorCells(door, owner, ownerDefinition) : null;
        return cells && (samePoint(cells.inside, point) || samePoint(cells.outside, point));
      });
      if (!inDoorway) return "standing";
    }
  }
  return null;
}

/** Encounter and visitor queues share seats and public-path constraints. */
/** Tiles a waiting patient may not claim: other patients, the founder and staff. */
export function waitingOccupiedPointKeys(
  state: GameState,
  excludedEncounterId: string | null,
  excludedVisitorId: string | null = null,
): Set<string> {
  const occupiedPoints = new Set(
    Object.values(state.encounters)
      .filter(
        (candidate) =>
          candidate.id !== excludedEncounterId &&
          (candidate.lifecycle !== "resolved" ||
            state.serviceOperations.some((operation) => operation.actorKind === "encounter" && operation.actorId === candidate.id && !["completed", "cancelled"].includes(operation.status))),
      )
      .flatMap((candidate) => [
        ...(candidate.patientLocation
          ? [candidate.patientLocation]
          : []),
        ...(candidate.patientMovement?.path.at(-1)
          ? [candidate.patientMovement.path.at(-1)!]
          : []),
        ...(candidate.waitingDestination
          ? [candidate.waitingDestination.location]
          : []),
      ])
      .map((point) => `${point.x},${point.y}`),
  );
  const reservedActors = [
    ...state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && operation.id !== excludedVisitorId && !["completed", "cancelled"].includes(operation.status))
      .flatMap((operation) => [operation.location, operation.path.at(-1)]).filter((point): point is GridPoint => Boolean(point)),
    ...Object.values(state.pediatricFamilies ?? {}).filter((family) => !(family.child.kind === "encounter" ? family.child.id === excludedEncounterId : family.child.id === excludedVisitorId))
      .flatMap((family) => [family.reservation?.childLocation, family.reservation?.parentLocation]).filter((point): point is GridPoint => Boolean(point)),
    state.environment.founderLocation,
    ...(state.environment.founderActivity?.path.at(-1)
      ? [state.environment.founderActivity.path.at(-1)!]
      : []),
    ...state.employees.flatMap((employee) => [
      employee.location,
      ...(employee.path.at(-1) ? [employee.path.at(-1)!] : []),
    ]),
  ];
  for (const point of reservedActors) occupiedPoints.add(`${point.x},${point.y}`);
  return occupiedPoints;
}

export function chooseWaitingAreaDestination(
  state: GameState,
  context: DomainContext,
  actor: WaitingActor,
  serviceQueue = false,
  routeTo?: (target: GridPoint) => GridPoint[],
): {
  roomId: string | null;
  path: GridPoint[];
  reservation: EncounterState["waitingDestination"];
} {
  const family = pediatricFamilyForActor(state, actor.kind, actor.id);
  if (family) {
    const plan = planPediatricWaiting(state, context, family, undefined, serviceQueue);
    if (plan?.reservation) {
      const path = commitPediatricPairPlan(family, plan);
      return { roomId: plan.reservation.roomInstanceId, path, reservation: { roomInstanceId: plan.reservation.roomInstanceId,
        location: { ...plan.reservation.childLocation }, kind: plan.reservation.childSeatId ? "chair" : "standing" } };
    }
    if (!serviceQueue) return { roomId: null, path: [], reservation: null };
  }
  const start = actor.location;
  const entrance = getPublicEntrance(state, context);
  if (!start || !entrance) {
    return { roomId: null, path: [], reservation: null };
  }

  const waitingPathTo = (target: GridPoint): GridPoint[] => {
    if (family) {
      const plan = planPediatricPair(state, context, family, null, target);
      return plan ? commitPediatricPairPlan(family, plan) : [];
    }
    const path = routeTo ? routeTo(target) : findRouteFromDisplacedLocationToPoint(state, context, start, target);
    // The street prefix alone is nonempty even when no public indoor route
    // exists. Never reserve a chair unless the route reaches that exact spot.
    return path.length > 0 && samePoint(path.at(-1)!, target) ? path : [];
  };
  const occupiedPoints = waitingOccupiedPointKeys(state, actor.kind === "encounter" ? actor.id : null, actor.kind === "service_visitor" ? actor.id : null);

  const waitingRooms = state.rooms
    .filter((room) => room.roomDefinitionId === "room.waiting" &&
      isRoomOperationalForFacilityWork(state, room.id, context))
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((room) => {
      const definition = getRoomDefinition(
        room.roomDefinitionId,
        context,
      );
      if (!definition) {
        return [];
      }
      const doorTileKeys = new Set(
        state.doors
          .filter((door) => door.roomId === room.id)
          .flatMap((door) => {
            const cells = getDoorCells(door, room, definition);
            return cells
              ? [`${cells.inside.x},${cells.inside.y}`]
              : [];
          }),
      );
      return [{ room, definition, doorTileKeys }];
    });

  // Every authored Waiting Room anchor corresponds to a chair that is visible
  // in the room art. Fill those seats across every Waiting Room before using
  // the non-room overflow hierarchy.
  for (const {
    room: waitingRoom,
    definition,
    doorTileKeys,
  } of waitingRooms) {
    for (const anchor of getRoomWaitingAnchors(
      waitingRoom,
      definition,
    )) {
      const key = `${anchor.x},${anchor.y}`;
      if (
        doorTileKeys.has(key) ||
        occupiedPoints.has(key)
      ) {
        continue;
      }
      const path = waitingPathTo(anchor);
      if (path.length > 0) {
        return {
          roomId: waitingRoom.id,
          path,
          reservation: { roomInstanceId: waitingRoom.id, location: anchor, kind: "chair" },
        };
      }
    }
  }

  const frontDefinition = getRoomDefinition(entrance.room.roomDefinitionId, context);
  if (frontDefinition && !serviceQueue) {
    const standingKeys = new Set(
      getRoomStandingWaitingAnchors(entrance.room, frontDefinition).map(pointKey),
    );
    for (const anchor of getRoomWaitingAnchors(entrance.room, frontDefinition)) {
      if (occupiedPoints.has(`${anchor.x},${anchor.y}`)) {
        continue;
      }
      const path = waitingPathTo(anchor);
      if (path.length > 0) {
        return {
          roomId: entrance.room.id,
          path,
          reservation: {
            roomInstanceId: entrance.room.id,
            location: anchor,
            kind: standingKeys.has(pointKey(anchor)) ? "standing" : "chair",
          },
        };
      }
    }
  }

  const doorKeysFor = (room: PlacedRoom, definition: NonNullable<ReturnType<typeof getRoomDefinition>>) =>
    new Set(state.doors.filter((door) => door.roomId === room.id).flatMap((door) => {
      const cells = getDoorCells(door, room, definition);
      return cells ? [`${cells.inside.x},${cells.inside.y}`] : [];
    }));
  const findStanding = (
    rooms: readonly PlacedRoom[],
    kind: "standing" | "public_wander",
  ) => {
    for (const room of rooms) {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition || !isRoomOperationalForFacilityWork(state, room.id, context)) continue;
      const doorKeys = doorKeysFor(room, definition);
      const excluded = new Set([
        ...doorKeys,
        ...getRoomWaitingAnchors(room, definition).map((point) => `${point.x},${point.y}`),
      ]);
      // A configured staff post is not a patient waiting point.  Do not use
      // the generic navigation-anchor fallback here: a 1x1 hallway's primary
      // tile is its only legitimate public standing point.
      if (definition.navigation?.staffAnchor) {
        const staffAnchor = getRoomNavigationAnchor(room, definition, "staff");
        excluded.add(`${staffAnchor.x},${staffAnchor.y}`);
      }
      if (serviceQueue) {
        for (const door of state.doors) {
          const owner = state.rooms.find((candidate) => candidate.id === door.roomId);
          const ownerDefinition = owner ? getRoomDefinition(owner.roomDefinitionId, context) : null;
          const cells = owner && ownerDefinition ? getDoorCells(door, owner, ownerDefinition) : null;
          if (cells) { excluded.add(pointKey(cells.inside)); excluded.add(pointKey(cells.outside)); }
        }
      }
      for (const point of getRoomNavigableTiles(room, definition, state.doors).sort((a, b) => a.y - b.y || a.x - b.x)) {
        const key = `${point.x},${point.y}`;
        if (occupiedPoints.has(key) || excluded.has(key)) continue;
        const path = waitingPathTo(point);
        if (path.length > 0) return { roomId: room.id, path, reservation: { roomInstanceId: room.id, location: point, kind } };
      }
    }
    return null;
  };
  if (serviceQueue) {
    const standing = findStanding(waitingRooms.map(({ room }) => room), "standing");
    if (standing) return standing;
  }
  const otherChairRooms = state.rooms
    .filter((room) =>
      room.roomDefinitionId !== "room.waiting" &&
      room.id !== entrance.room.id &&
      !isProtectedCareRoom(room) &&
      isRoomOperationalForFacilityWork(state, room.id, context),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const room of otherChairRooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    for (const anchor of getRoomWaitingAnchors(room, definition)) {
      if (occupiedPoints.has(`${anchor.x},${anchor.y}`)) continue;
      const path = waitingPathTo(anchor);
      if (path.length > 0) return { roomId: room.id, path, reservation: { roomInstanceId: room.id, location: anchor, kind: "chair" } };
    }
  }
  const waitingStanding = findStanding(waitingRooms.map(({ room }) => room), "standing");
  if (waitingStanding) return waitingStanding;
  const publicStanding = findStanding(
    state.rooms.filter((room) => room.roomDefinitionId !== "room.waiting" && (!serviceQueue || room.roomDefinitionId !== "room.front_desk") && getRoomDefinition(room.roomDefinitionId, context)?.navigation?.publicWaitingArea === true).sort((a, b) => a.id.localeCompare(b.id)),
    "public_wander",
  );
  if (publicStanding) return publicStanding;
  if (serviceQueue) {
    // A clinic with no reachable indoor overflow still leaves check-in clear.
    // Reserve a sidewalk point at least two tiles from the public door.
    const exit = findRouteFromDisplacedLocationToPublicEntrance(state, context, start);
    if (exit.length > 0) {
      for (let distance = 2; distance < context.balanceRelease.facility.gridWidth; distance += 1) {
        for (const direction of [-1, 1]) {
          const target = { x: entrance.outside.x + distance * direction, y: entrance.outside.y };
          if (target.x < 0 || target.x >= context.balanceRelease.facility.gridWidth || occupiedPoints.has(pointKey(target))) continue;
          const path = exit.map((point) => ({ ...point }));
          while (path.at(-1)!.x !== target.x) path.push({ x: path.at(-1)!.x + direction, y: target.y });
          if (family) {
            const plan = planPediatricPair(state, context, family, null, target);
            if (!plan) continue;
            return { roomId: null, path: commitPediatricPairPlan(family, plan), reservation: { roomInstanceId: null, location: target, kind: "standing" } };
          }
          return { roomId: null, path, reservation: { roomInstanceId: null, location: target, kind: "standing" } };
        }
      }
    }
    return { roomId: null, path: [], reservation: null };
  }
  const fallbackPath = waitingPathTo(entrance.inside);
  return {
    roomId: entrance.room.id,
    path: fallbackPath,
    reservation: { roomInstanceId: entrance.room.id, location: entrance.inside, kind: "public_wander" },
  };
}

