import { APPROVED_LEVEL5_SUPPORT_NAVIGATION, APPROVED_ROOM_NAVIGATION_CONTRACTS, type ApprovedFloorFootprint, type RoomDefinition } from "@gamify-surgery/balance-config";
import { INSPECTOR_CHARACTER_STILLS } from "./characterStillCatalog";
import { getDoorCells } from "./doors";
import { findRouteFromDisplacedLocationToPublicEntrance } from "./displaced-routing";
import { deterministicInteger, deterministicShuffle } from "./randomness";
import { getRotatedFootprint } from "./spatial";
import type { DomainContext, GameState, GridPoint, InspectionPresentationActor, InspectorStillId, PlacedRoom } from "./types";

/** Editorial cosmetic cadence and geometry, independent of the inspection rules. */
export const INSPECTOR_OBSERVATION_MINUTES = 5;
export const INSPECTOR_PRESENTATION_STREAM = "inspection_presentation.v1";
const RADIUS = .18, OBSERVATION_RADIUS = .30, EPSILON = .000001;
const key = (point: GridPoint) => `${Math.round((point.x + .5) * 20)},${Math.round((point.y + .5) * 20)}`;
const same = (a: GridPoint, b: GridPoint) => Math.hypot(a.x - b.x, a.y - b.y) < EPSILON;
const distance = (a: GridPoint, b: GridPoint) => Math.hypot(a.x - b.x, a.y - b.y);
type Node = { point: GridPoint; roomId: string; step: number; neighbors: Set<string> };
type Graph = { signature: string; nodes: Map<string, Node>; components: Map<string, number>; targets: Map<string, GridPoint[]>; stopKeys: Set<string>; entrance: GridPoint | null; paths: Map<string, GridPoint[]> };
const cache = new WeakMap<DomainContext, Graph>();
const definition = (context: DomainContext, id: string) => context.balanceRelease.facility.roomDefinitions.find(row => row.id === id) ?? null;
const signature = (state: GameState) => JSON.stringify([state.rooms.map(room => [room.id, room.roomDefinitionId, room.x, room.y, room.orientation, room.upgradeLevel]), state.doors]);

function rotateFloor(point: GridPoint, width: number, height: number, orientation: number): GridPoint {
  return orientation === 90 ? { x: height - point.y, y: point.x }
    : orientation === 180 ? { x: width - point.x, y: height - point.y }
    : orientation === 270 ? { x: point.y, y: width - point.x } : point;
}

function roomSolids(state: GameState, room: PlacedRoom, def: RoomDefinition, context: DomainContext): ApprovedFloorFootprint[] {
  const contract = APPROVED_ROOM_NAVIGATION_CONTRACTS[def.id];
  if (!contract) return (def.navigation?.blockedTiles ?? []).map(point => ({ left: point.x, top: point.y, width: 1, height: 1 }));
  return contract.solidFixtures.filter(fixture => !fixture.hiddenByDoorSlots?.some(slot => {
    const local = slot.side === "north" ? { x: slot.offset + .5, y: 0 }
      : slot.side === "south" ? { x: slot.offset + .5, y: def.height }
      : slot.side === "west" ? { x: 0, y: slot.offset + .5 } : { x: def.width, y: slot.offset + .5 };
    const rotated = rotateFloor(local, def.width, def.height, room.orientation);
    return state.doors.some(door => {
      const owner = state.rooms.find(row => row.id === door.roomId), ownerDef = owner && definition(context, owner.roomDefinitionId);
      const cells = owner && ownerDef ? getDoorCells(door, owner, ownerDef) : null;
      return cells && Math.abs((cells.inside.x + cells.outside.x) / 2 + .5 - (room.x + rotated.x)) < EPSILON &&
        Math.abs((cells.inside.y + cells.outside.y) / 2 + .5 - (room.y + rotated.y)) < EPSILON;
    });
  })).flatMap(fixture => [fixture.footprint, ...(fixture.navigationFootprint ? [fixture.navigationFootprint] : [])]).map(box => {
    const corners = [rotateFloor({ x: box.left, y: box.top }, def.width, def.height, room.orientation),
      rotateFloor({ x: box.left + box.width, y: box.top + box.height }, def.width, def.height, room.orientation)];
    return { left: Math.min(...corners.map(p => p.x)), top: Math.min(...corners.map(p => p.y)),
      width: Math.abs(corners[0]!.x - corners[1]!.x), height: Math.abs(corners[0]!.y - corners[1]!.y) };
  });
}

function clear(point: GridPoint, solids: readonly ApprovedFloorFootprint[], radius = RADIUS): boolean {
  return solids.every(box => {
    const dx = Math.max(box.left - point.x, 0, point.x - box.left - box.width);
    const dy = Math.max(box.top - point.y, 0, point.y - box.top - box.height);
    return Math.hypot(dx, dy) >= radius - EPSILON;
  });
}

/** Presentation-only graph: approved retained solids, real doors and no furniture endpoints. */
function graphFor(state: GameState, context: DomainContext): Graph {
  const stamp = signature(state), previous = cache.get(context);
  if (previous?.signature === stamp) return previous;
  const nodes = new Map<string, Node>(), targets = new Map<string, GridPoint[]>();
  const geometry = new Map<string, { room: PlacedRoom; solids: ApprovedFloorFootprint[]; contacts: GridPoint[] }>();
  const connect = (a: GridPoint, b: GridPoint) => {
    const left = nodes.get(key(a)), right = nodes.get(key(b));
    if (!left || !right) return;
    // Check the complete cardinal edge, including doorway bridges, rather than
    // letting two clear endpoints skirt through a fixture/contact between them.
    for (const roomId of new Set([left.roomId, right.roomId])) {
      const { room, solids, contacts } = geometry.get(roomId)!;
      const start = { x: left.point.x + .5 - room.x, y: left.point.y + .5 - room.y };
      const end = { x: right.point.x + .5 - room.x, y: right.point.y + .5 - room.y };
      for (const box of solids) if (Math.hypot(
        Math.max(box.left - Math.max(start.x, end.x), 0, Math.min(start.x, end.x) - box.left - box.width),
        Math.max(box.top - Math.max(start.y, end.y), 0, Math.min(start.y, end.y) - box.top - box.height)) < RADIUS - EPSILON) return;
      for (const contact of contacts) if (distance(contact, {
        x: Math.max(Math.min(start.x, end.x), Math.min(Math.max(start.x, end.x), contact.x)),
        y: Math.max(Math.min(start.y, end.y), Math.min(Math.max(start.y, end.y), contact.y)),
      }) < RADIUS - EPSILON) return;
    }
    left.neighbors.add(key(b)); right.neighbors.add(key(a));
  };
  for (const room of state.rooms) {
    const def = definition(context, room.roomDefinitionId);
    if (!def) continue;
    const size = getRotatedFootprint(def, room.orientation), solids = roomSolids(state, room, def, context);
    // Gift N2's accepted aisle is at y=.55 between retained shelves/island.
    // Preserve that .05-tile clearance without expanding every hallway graph.
    const grid = def.id === "room.gift_shop" ? 20 : 10;
    const contacts = [def.navigation?.primaryAnchor, def.navigation?.staffAnchor, def.navigation?.patientCareAnchor,
      def.navigation?.clinicianCareAnchor, def.navigation?.sharedStaffAnchor, ...(def.navigation?.waitingAnchors ?? []),
      ...(def.navigation?.standingWaitingAnchors ?? []), ...(def.navigation?.endpointOnlyTiles ?? []),
      ...(def.navigation?.companionSeats ?? []).map(seat => seat.anchor), ...(def.navigation?.careStations ?? []).map(station => station.patientAnchor)]
      .filter((point): point is GridPoint => Boolean(point)).map(point => rotateFloor({ x: point.x + .5, y: point.y + .5 }, def.width, def.height, room.orientation));
    contacts.push(...(APPROVED_LEVEL5_SUPPORT_NAVIGATION[def.id] ?? []).map(support =>
      rotateFloor(support.standingApproach, def.width, def.height, room.orientation)));
    geometry.set(room.id, { room, solids, contacts });
    const stops: GridPoint[] = [];
    for (let x = grid / 5; x <= size.width * grid - grid / 5; x++) for (let y = grid / 5; y <= size.height * grid - grid / 5; y++) {
      const local = { x: x / grid, y: y / grid };
      if (!clear(local, solids) || contacts.some(contact => distance(local, contact) < RADIUS - EPSILON)) continue;
      const point = { x: room.x + local.x - .5, y: room.y + local.y - .5 };
      nodes.set(key(point), { point, roomId: room.id, step: 20 / grid, neighbors: new Set() });
      // Hold away from wall/door thresholds and every seat, care and staff anchor.
      const inset = def.kind === "hallway" ? .4 : .6;
      if (clear(local, solids, OBSERVATION_RADIUS) && local.x >= inset && local.y >= inset && local.x <= size.width - inset && local.y <= size.height - inset &&
        contacts.every(contact => distance(local, contact) >= .55)) stops.push(point);
    }
    targets.set(room.id, stops);
  }
  for (const [id, node] of nodes) {
    const [x, y] = id.split(",").map(Number);
    for (const neighborId of [`${x! + node.step},${y}`, `${x},${y! + node.step}`]) {
      const neighbor = nodes.get(neighborId);
      if (neighbor?.roomId === node.roomId) connect(node.point, neighbor.point);
    }
  }
  // Hallway tiles share open boundaries. A room boundary connects only at a real door.
  const halls = state.rooms.filter(room => definition(context, room.roomDefinitionId)?.kind === "hallway");
  for (const hallway of halls) for (const other of halls) {
    if (hallway.id >= other.id) continue;
    for (const t of [.3, .4, .5, .6, .7]) {
      if (Math.abs(other.x - hallway.x) === 1 && other.y === hallway.y) {
        const left = Math.min(hallway.x, other.x);
        connect({ x: left + .3, y: hallway.y + t - .5 }, { x: left + 1 - .3, y: hallway.y + t - .5 });
      }
      if (Math.abs(other.y - hallway.y) === 1 && other.x === hallway.x) {
        const top = Math.min(hallway.y, other.y);
        connect({ x: hallway.x + t - .5, y: top + .3 }, { x: hallway.x + t - .5, y: top + 1 - .3 });
      }
    }
  }
  let entrance: GridPoint | null = null;
  for (const door of state.doors) {
    const room = state.rooms.find(row => row.id === door.roomId), def = room && definition(context, room.roomDefinitionId);
    const cells = room && def ? getDoorCells(door, room, def) : null;
    if (!cells) continue;
    const dx = cells.outside.x - cells.inside.x, dy = cells.outside.y - cells.inside.y;
    if (door.exterior) {
      // Enter at the actual threshold, then take the fine aisle around the
      // Front Desk's public contact instead of entering its coarse seat tile.
      const entry = { x: cells.inside.x + .3 * dx, y: cells.inside.y + .3 * dy };
      if (nodes.has(key(entry))) entrance = nodes.get(key(entry))!.point;
      continue;
    }
    for (const sideOffset of [-.3, -.2, -.1, 0, .1, .2, .3]) {
      connect({ x: cells.inside.x + .3 * dx + sideOffset * dy, y: cells.inside.y + .3 * dy + sideOffset * dx },
        { x: cells.outside.x - .3 * dx + sideOffset * dy, y: cells.outside.y - .3 * dy + sideOffset * dx });
    }
  }
  const components = new Map<string, number>();
  let component = 0;
  for (const start of nodes.keys()) {
    if (components.has(start)) continue;
    const queue = [start]; components.set(start, component);
    for (let index = 0; index < queue.length; index++) for (const neighbor of nodes.get(queue[index]!)!.neighbors)
      if (!components.has(neighbor)) { components.set(neighbor, component); queue.push(neighbor); }
    component++;
  }
  const stopKeys = new Set([...targets.values()].flatMap(points => points.map(key)));
  const graph = { signature: stamp, nodes, components, targets, stopKeys, entrance, paths: new Map<string, GridPoint[]>() }; cache.set(context, graph); return graph;
}

function pathInGraph(graph: Graph, start: GridPoint, end: GridPoint): GridPoint[] {
  const from = key(start), to = key(end);
  if (!graph.nodes.has(from) || !graph.nodes.has(to) || graph.components.get(from) !== graph.components.get(to)) return [];
  // Memoize only pure graph queries, never whether a shared actor ID has
  // already been compacted. Clones and reloads must take the same state change.
  const routeKey = `${from}:${to}`, cached = graph.paths.get(routeKey);
  if (cached) return cached;
  const parents = new Map<string, string | null>([[from, null]]), queue = [from];
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]!;
    if (current === to) {
      const path: GridPoint[] = [];
      for (let cursor: string | null = to; cursor; cursor = parents.get(cursor) ?? null) path.push(graph.nodes.get(cursor)!.point);
      path.reverse();
      if (graph.paths.size >= 256) graph.paths.delete(graph.paths.keys().next().value!);
      graph.paths.set(routeKey, path);
      return path;
    }
    for (const neighbor of graph.nodes.get(current)!.neighbors) if (!parents.has(neighbor)) { parents.set(neighbor, current); queue.push(neighbor); }
  }
  return [];
}

function actorRoute(state: GameState, context: DomainContext, graph: Graph, start: GridPoint, end: GridPoint): GridPoint[] {
  if (graph.nodes.has(key(start))) return pathInGraph(graph, start, end);
  if (!graph.entrance) return [];
  const approach = findRouteFromDisplacedLocationToPublicEntrance(state, context, start);
  const interior = pathInGraph(graph, graph.entrance, end);
  return approach.length && interior.length ? [...approach, graph.entrance, ...interior] : [];
}

function compact(path: GridPoint[]): GridPoint[] {
  // Keep corners and <= half-tile legs for unchanged routeMotion lookahead/hops.
  if (path.length < 3) return [...path];
  const result = [path[0]!];
  for (let index = 1; index < path.length - 1; index++) {
    const point = path[index]!;
    const previous = path[index - 1]!, next = path[index + 1]!;
    if (Math.abs((point.x - previous.x) * (next.y - point.y) - (point.y - previous.y) * (next.x - point.x)) > EPSILON ||
      distance(result.at(-1)!, next) > .5 + EPSILON) result.push(point);
  }
  result.push(path.at(-1)!); return result;
}

function chooseRoute(state: GameState, context: DomainContext, graph: Graph, actor: InspectionPresentationActor, index: number): boolean {
  const lane = state.levelFive!.inspectionPresentation;
  const ordered = deterministicShuffle(state.rooms.filter(room => definition(context, room.roomDefinitionId)?.kind !== "hallway"),
    lane.seed!, INSPECTOR_PRESENTATION_STREAM, "room-order");
  const occupied = lane.actors.filter(other => other.id !== actor.id).map(other => other.path.at(-1) ?? other.location);
  const currentTargets = new Set(lane.actors.filter(other => other.id !== actor.id).map(other => other.targetRoomInstanceId));
  const offset = (index + Math.floor(Math.max(0, state.facilityTick - state.levelFive!.inspection.run!.startedAtFacilityTick) / INSPECTOR_OBSERVATION_MINUTES)) % Math.max(1, ordered.length);
  const rotated = [...ordered.slice(offset), ...ordered.slice(0, offset)];
  const candidates = [...rotated.filter(room => !currentTargets.has(room.id) && room.id !== actor.targetRoomInstanceId),
    ...rotated.filter(room => room.id !== actor.targetRoomInstanceId), ...state.rooms.filter(room => definition(context, room.roomDefinitionId)?.kind === "hallway"),
    ...rotated.filter(room => room.id === actor.targetRoomInstanceId)];
  for (const room of candidates) {
    const startComponent = graph.components.get(key(actor.location)) ?? (graph.entrance ? graph.components.get(key(graph.entrance)) : undefined);
    const stops = (graph.targets.get(room.id) ?? []).filter(stop => startComponent !== undefined && graph.components.get(key(stop)) === startComponent);
    const first = stops.length ? deterministicInteger(lane.seed!, INSPECTOR_PRESENTATION_STREAM, `${actor.id}:${room.id}:${state.facilityTick}`, stops.length) : 0;
    for (let n = 0; n < stops.length; n++) {
      const stop = stops[(first + n) % stops.length]!;
      if (occupied.some(other => distance(stop, other) < .5)) continue;
      if (room.id === actor.targetRoomInstanceId && distance(stop, actor.location) < .5) continue;
      const path = actorRoute(state, context, graph, actor.location, stop);
      if (!path.length) continue;
      actor.path = compact(path); actor.pathIndex = 0; actor.targetRoomInstanceId = room.id;
      actor.phase = actor.path.length > 1 ? "walking" : "observing";
      actor.observingUntilFacilityTick = actor.phase === "observing" ? state.facilityTick + INSPECTOR_OBSERVATION_MINUTES : null;
      if (actor.phase === "observing") actor.lastMovedAtFacilityTick = state.facilityTick;
      return true;
    }
  }
  actor.phase = "stationary"; actor.path = [actor.location]; actor.pathIndex = 0;
  actor.targetRoomInstanceId = graph.nodes.get(key(actor.location))?.roomId ?? null;
  actor.observingUntilFacilityTick = state.facilityTick + INSPECTOR_OBSERVATION_MINUTES;
  return false;
}

/** Mutates only the existing presentation lane; never any occupant, RNG, clock or score. */
export function advanceInspectionPresentation(state: GameState, context: DomainContext): void {
  const levelFive = state.facilityLevel === 5 ? state.levelFive : null;
  if (!levelFive) return;
  const run = levelFive.inspection.status === "running" ? levelFive.inspection.run : null;
  if (!run) {
    if (levelFive.inspectionPresentation.runId !== null) levelFive.inspectionPresentation = { version: "inspection-presentation.v1", runId: null, seed: null, actors: [] };
    return;
  }
  const graph = graphFor(state, context), lane = levelFive.inspectionPresentation;
  if (lane.runId !== run.id || lane.actors.length === 0) {
    lane.runId = run.id; lane.seed = `inspection-visual.v1.${deterministicInteger(state.campaignSeed, INSPECTOR_PRESENTATION_STREAM, run.id, 0x100000000)}`;
    const exterior = state.doors.find(door => door.exterior), room = exterior && state.rooms.find(row => row.id === exterior.roomId);
    const def = room && definition(context, room.roomDefinitionId), cells = exterior && room && def ? getDoorCells(exterior, room, def) : null;
    lane.actors = INSPECTOR_CHARACTER_STILLS.map((entry, index) => {
      const columns = context.balanceRelease.facility.gridWidth;
      const location = { x: ((cells?.outside.x ?? 5) - 5 + index + columns) % columns,
        y: context.balanceRelease.facility.gridHeight };
      return { id: `inspector.${run.startedAtFacilityTick}.${deterministicInteger(lane.seed!, INSPECTOR_PRESENTATION_STREAM, run.id, 0x1000000)}.${index + 1}`,
        stillId: entry.stillId as InspectorStillId, phase: "stationary", location, path: [location], pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick, targetRoomInstanceId: null, observingUntilFacilityTick: state.facilityTick + index };
    });
  }
  for (const [index, actor] of lane.actors.entries()) {
    try {
      if (!graph.nodes.has(key(actor.location))) {
        const room = state.rooms.find(room => {
          const def = definition(context, room.roomDefinitionId);
          const size = def && getRotatedFootprint(def, room.orientation);
          return size && actor.location.x + .5 >= room.x && actor.location.y + .5 >= room.y &&
            actor.location.x + .5 <= room.x + size.width && actor.location.y + .5 <= room.y + size.height;
        });
        // A pre-fix save or newly restored doorway fixture can leave a cosmetic
        // actor on a now-protected contact. Rehome only that actor to the nearest
        // clear floor node in its room; never route it through a care endpoint.
        const safe = room && [...graph.nodes.values()].filter(node => node.roomId === room.id)
          .sort((a, b) => distance(a.point, actor.location) - distance(b.point, actor.location))[0];
        if (safe) {
          actor.location = { ...safe.point }; actor.path = [{ ...safe.point }]; actor.pathIndex = 0;
          actor.phase = "stationary"; actor.targetRoomInstanceId = room!.id;
          actor.observingUntilFacilityTick = state.facilityTick;
        }
      }
      if (actor.phase !== "walking") {
        if ((actor.phase !== "observing" || graph.stopKeys.has(key(actor.location))) &&
          actor.observingUntilFacilityTick !== null && actor.observingUntilFacilityTick > state.facilityTick) continue;
        chooseRoute(state, context, graph, actor, index);
      } else if (actor.targetRoomInstanceId && !state.rooms.some(room => room.id === actor.targetRoomInstanceId)) {
        chooseRoute(state, context, graph, actor, index);
      } else {
        // Revalidate against live doors/solids; a closed wall cannot retain an old route.
        const end = actor.path.at(-1)!;
        const retained = compact(actorRoute(state, context, graph, actor.path[0] ?? actor.location, end));
        const cursor = retained.findIndex(point => same(point, actor.location));
        const valid = cursor >= 0 ? retained : compact(actorRoute(state, context, graph, actor.location, end));
        if (!valid.length || !graph.stopKeys.has(key(end))) chooseRoute(state, context, graph, actor, index);
        else { actor.path = valid; actor.pathIndex = Math.max(0, cursor); }
      }
      if (actor.phase !== "walking" || actor.lastMovedAtFacilityTick >= state.facilityTick || state.paused) continue;
      let budget = Math.max(0, context.balanceRelease.facility.characterTravelTilesPerTick);
      while (actor.pathIndex < actor.path.length - 1) {
        const next = actor.path[actor.pathIndex + 1]!, length = distance(actor.location, next);
        if (length > budget + EPSILON) break;
        budget -= length; actor.pathIndex++; actor.location = { ...next };
      }
      actor.lastMovedAtFacilityTick = state.facilityTick;
      if (actor.pathIndex >= actor.path.length - 1) {
        actor.phase = "observing"; actor.observingUntilFacilityTick = state.facilityTick + INSPECTOR_OBSERVATION_MINUTES;
      }
    } catch {
      // Cosmetic failure is isolated; the clinic and inspection always continue.
      actor.phase = "stationary"; actor.path = [{ ...actor.location }]; actor.pathIndex = 0;
      actor.targetRoomInstanceId = null; actor.observingUntilFacilityTick = state.facilityTick + INSPECTOR_OBSERVATION_MINUTES;
    }
  }
}

/** Read-only QA evidence; these locations own no gameplay reservation. */
export function isSafeInspectionObservationPoint(state: GameState, point: GridPoint, context: DomainContext): boolean {
  const graph = graphFor(state, context);
  return [...graph.targets.values()].some(points => points.some(candidate => same(candidate, point)));
}

/** Read-only manager QA: inaccessible cosmetic geometry never changes domain access/scoring. */
export function inspectionPresentationNavigationSummary(state: GameState, context: DomainContext) {
  const graph = graphFor(state, context), entranceComponent = graph.entrance ? graph.components.get(key(graph.entrance)) : undefined;
  return { nodes: graph.nodes.size, entrance: graph.entrance,
    rooms: state.rooms.filter(room => definition(context, room.roomDefinitionId)?.kind !== "hallway").map(room => ({
      id: room.id, definitionId: room.roomDefinitionId, safeStops: graph.targets.get(room.id)?.length ?? 0,
      reachableStops: (graph.targets.get(room.id) ?? []).filter(point => entranceComponent !== undefined && graph.components.get(key(point)) === entranceComponent).length,
    })) };
}
