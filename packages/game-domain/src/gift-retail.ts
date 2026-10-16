import { APPROVED_LEVEL5_SUPPORT_ROUTES, getServiceIncomeLine, isGiftIncomeLineId, LEVEL_FIVE_GIFT_RETAIL } from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance } from "./appearance";
import { characterStillCatalogEntryById } from "./characterStillCatalog";
import { isRoomAvailableForNewFacilityWork } from "./selectors";
import type { DomainContext, GameState, GiftCheckoutState, GiftOnlyVisitState, GiftRetailDemandState, GridPoint, PlacedRoom, RetailExternalActorState, RetailOperationState } from "./types";

const routes = APPROVED_LEVEL5_SUPPORT_ROUTES["room.gift_shop"];
const terminal = (trip: RetailOperationState) => ["completed", "cancelled", "abandoned"].includes(trip.status);
const same = (a: GridPoint, b: GridPoint) => Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001;
const world = (room: PlacedRoom, route: typeof routes[number]) => route.logicalPath.map(p => ({ x: room.x + p[0]!, y: room.y + p[1]! }));
const segment = (door: GameState["doors"][number]) => `${{ north: "N", south: "S", west: "W", east: "E" }[door.side]}${door.side === "north" || door.side === "south" ? door.offset + 1 : String.fromCharCode(65 + door.offset)}`;

export function giftContactLocation(room: PlacedRoom, contactId: NonNullable<GiftCheckoutState["contactId"]>): GridPoint {
  return world(room, routes.find(r => r.targetId === contactId)! ).at(-1)!;
}

export function giftContactAtLocation(room: PlacedRoom, location: GridPoint): GiftCheckoutState["contactId"] {
  return (["pay", "queue1", "queue2"] as const).find(id => same(location, giftContactLocation(room, id))) ?? null;
}

/** The approved routes share a narrow aisle. Reserve its traversal as well as
 * the three endpoints, including the renderer's next-minute lookahead. */
export function giftAisleIsBusy(state: GameState, operation: RetailOperationState, nextIndex: number, context: DomainContext): boolean {
  const room = state.rooms.find(row => row.id === operation.outletRoomInstanceId);
  if (!room) return false;
  const inside = (point: GridPoint) => point.x > room.x - .5 && point.x < room.x + 2.5 && point.y > room.y - .5 && point.y < room.y + 2.5;
  const step = context.balanceRelease.facility.characterTravelTilesPerTick;
  const upcoming = operation.path.slice(operation.pathIndex, nextIndex + step + 1);
  if (!upcoming.some(inside)) return false;
  return state.retailOperations.some(other => {
    if (other.id === operation.id || terminal(other) || other.outletRoomInstanceId !== room.id) return false;
    const moving = ["walking_to_outlet", "returning", "leaving"].includes(other.status) && other.pathIndex < other.path.length - 1;
    const otherLeg = other.path.slice(other.pathIndex, other.pathIndex + step + 1);
    const traversing = moving && !other.giftCheckout?.aisleWaiting && !other.giftCheckout?.returnBlocked &&
      (inside(other.location) || other.pathIndex > 0 && otherLeg.some(inside));
    const movedThisMinute = !other.giftCheckout?.aisleWaiting && !other.giftCheckout?.returnBlocked && other.lastMovedAtFacilityTick === state.facilityTick &&
      other.path.slice(Math.max(0, other.pathIndex - step), other.pathIndex + 1).some(inside);
    const occupiedPoint = inside(other.location) && upcoming.slice(1).some(point => same(point, other.location));
    return traversing || movedThisMinute || occupiedPoint;
  });
}

/** Preserve the approved logical knots and synchronization entries. Public paths
 * stop outside the door; queue/counter transitions join native routes inside. */
export function giftContactPath(state: GameState, room: PlacedRoom, contactId: NonNullable<GiftCheckoutState["contactId"]>, start: GridPoint,
  publicPath: (target: GridPoint) => GridPoint[]): { path: GridPoint[]; doorId: string } | null {
  for (const door of state.doors.filter(d => d.roomId === room.id).sort((a, b) => a.id.localeCompare(b.id))) {
    const route = routes.find(r => r.doorSegment === segment(door) && r.targetId === contactId);
    if (!route) continue;
    const path = world(room, route);
    const native = routes.flatMap(r => {
      const source = world(room, r), cursor = source.findIndex(p => same(p, start));
      if (cursor < 0) return [];
      // Join before an open door only at an internal knot, never by walking
      // through a closed former doorway or changing the approved contact.
      return source.flatMap((p, i) => path.flatMap((q, j) => i >= 1 && j >= 1 && same(p, q)
        ? [{ path: i <= cursor ? [...source.slice(i, cursor + 1).reverse(), ...path.slice(j + 1)]
          : [...source.slice(cursor, i + 1), ...path.slice(j + 1)] }] : []));
    }).sort((a, b) => a.path.length - b.path.length)[0];
    if (native) return { path: native.path, doorId: door.id };
    const outside = { x: Math.round(path[0]!.x), y: Math.round(path[0]!.y) };
    const approach = publicPath(outside);
    if (approach.length) return { path: [...approach, ...path], doorId: door.id };
  }
  return null;
}

export function giftContactFree(state: GameState, room: PlacedRoom, contactId: NonNullable<GiftCheckoutState["contactId"]>, excludeId?: string): boolean {
  const target = giftContactLocation(room, contactId);
  return !state.retailOperations.some(trip => trip.id !== excludeId && !terminal(trip) && trip.outletRoomInstanceId === room.id &&
    (trip.giftCheckout?.contactId === contactId || same(trip.location, target)));
}

export function giftNativeExitPath(state: GameState, room: PlacedRoom, start: GridPoint, publicPath: (outside: GridPoint) => GridPoint[]): GridPoint[] {
  const choices: GridPoint[][] = [];
  for (const door of state.doors.filter(d => d.roomId === room.id)) {
    for (const exit of routes.filter(r => r.doorSegment === segment(door))) {
      const lane = world(room, exit), outside = { x: Math.round(lane[0]!.x), y: Math.round(lane[0]!.y) };
      const tail = publicPath(outside);
      if (!tail.length) continue;
      for (const original of routes) {
        const source = world(room, original), cursor = source.findIndex(p => same(p, start));
        if (cursor < 0) continue;
        for (let i = 1; i < source.length; i++) for (let j = 1; j < lane.length; j++) {
          if (!same(source[i]!, lane[j]!)) continue;
          const prefix = i <= cursor ? source.slice(i, cursor + 1).reverse() : source.slice(cursor, i + 1);
          choices.push([...prefix, ...lane.slice(0, j).reverse(), ...tail]);
        }
      }
    }
  }
  return choices.sort((a, b) => a.length - b.length)[0] ?? [];
}

export function giftCheckoutContact(state: GameState, room: PlacedRoom): NonNullable<GiftCheckoutState["contactId"]> | null {
  const hasQueue = state.retailOperations.some(trip => !terminal(trip) && trip.outletRoomInstanceId === room.id &&
    (trip.giftCheckout?.contactId === "queue1" || trip.giftCheckout?.contactId === "queue2"));
  if (!hasQueue && giftContactFree(state, room, "pay")) return "pay";
  // The rear customer gets the next front vacancy; a new arrival cannot cut
  // into queue1 before queue2 has advanced.
  if (state.retailOperations.some(trip => !terminal(trip) && trip.outletRoomInstanceId === room.id && trip.giftCheckout?.contactId === "queue2")) return null;
  return (["queue1", "queue2"] as const).find(id => giftContactFree(state, room, id)) ?? null;
}

/** Required work takes over actor movement; no optional checkout remains held. */
export function releaseGiftCheckout(operation: RetailOperationState): void {
  if (!operation.giftCheckout) return;
  operation.giftCheckout.contactId = null;
  delete operation.giftCheckout.returnBlocked;
  delete operation.giftCheckout.aisleWaiting;
  operation.resourceWaitReason = null;
}

/** One facility clock, independent IDs/seed and external capacity. No acceptance
 * coin flip, appointment toggle, clinical admission or per-room demand. */
export function scheduleGiftRetailDemand(state: GameState, context: DomainContext, arrivalPoint: (id: string) => GridPoint | null,
  start: (actorId: string) => string | null): void {
  if (state.facilityLevel < 5) return;
  const shops = state.rooms.filter(room => room.roomDefinitionId === "room.gift_shop");
  if (!state.giftRetailDemand) {
    if (!shops.length) return;
    state.giftRetailDemand = { version: "gift-retail-demand.v1", nextOpportunityAtFacilityTick: state.facilityTick + LEVEL_FIVE_GIFT_RETAIL.arrivalCadenceMinutes, opportunitySequence: 0 };
  }
  const demand = state.giftRetailDemand;
  if (state.facilityTick < demand.nextOpportunityAtFacilityTick) return;
  const sequence = demand.opportunitySequence++;
  demand.nextOpportunityAtFacilityTick = state.facilityTick + LEVEL_FIVE_GIFT_RETAIL.arrivalCadenceMinutes;
  if (!shops.some(room => isRoomAvailableForNewFacilityWork(state, room.id, context)) ||
    state.retailExternalActors.filter(actor => actor.giftOnlyVisit && actor.lifecycle !== "departed").length >= LEVEL_FIVE_GIFT_RETAIL.queueCapacity + 1) return;
  const id = `gift-visitor.${sequence}`, location = arrivalPoint(id);
  if (!location) return;
  const seed = `${state.campaignSeed}|gift-retail.v1`;
  const appearance = createPatientPixelAppearance(seed, id, {}, "patient");
  const still = characterStillCatalogEntryById(appearance.stillId);
  if (still?.category !== "patient" || (still.compatibleSexLabel !== "Female" && still.compatibleSexLabel !== "Male")) return;
  const sexLabel = still.compatibleSexLabel;
  const ageYears = still.intendedAge ?? (still.ageBand === "young_adult" ? 24 : still.ageBand === "adult" ? 38 : still.ageBand === "middle_aged" ? 54 : 70);
  if (ageYears < 18) return;
  const actor: RetailExternalActorState = { id, kind: "retail_visitor", displayName: createPatientDisplayName(seed, id, sexLabel,
    state.retailExternalActors.filter(a => a.giftOnlyVisit && a.lifecycle !== "departed").map(a => a.displayName)), appearance,
    giftOnlyVisit: { version: "gift-only-visit.v1", opportunitySequence: sequence, ageYears, sexLabel },
    linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "arriving", location, path: [], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null };
  state.retailExternalActors.push(actor);
  if (!start(id)) { actor.lifecycle = "departed"; actor.location = null; }
}

const record = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const tick = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
const invalid = (): never => { throw new Error("The saved Gift Shop contract is invalid."); };
export function normalizeGiftRetailDemand(value: unknown): GiftRetailDemandState | undefined {
  if (value === undefined) return undefined;
  if (!record(value) || Object.keys(value).some(k => !["version", "nextOpportunityAtFacilityTick", "opportunitySequence"].includes(k)) ||
    value.version !== "gift-retail-demand.v1" || !tick(value.nextOpportunityAtFacilityTick) || !tick(value.opportunitySequence)) return invalid();
  return { version: "gift-retail-demand.v1", nextOpportunityAtFacilityTick: value.nextOpportunityAtFacilityTick, opportunitySequence: value.opportunitySequence };
}
export function normalizeGiftOnlyVisit(value: unknown, appearance: unknown): GiftOnlyVisitState | undefined {
  if (value === undefined) return undefined;
  if (!record(value) || Object.keys(value).some(k => !["version", "opportunitySequence", "ageYears", "sexLabel"].includes(k)) ||
    value.version !== "gift-only-visit.v1" || !tick(value.opportunitySequence) || !tick(value.ageYears) || value.ageYears < 18 || value.ageYears > 120 ||
    (value.sexLabel !== "Female" && value.sexLabel !== "Male") || !record(appearance)) return invalid();
  const still = characterStillCatalogEntryById(typeof appearance.stillId === "string" ? appearance.stillId : undefined);
  if (still?.category !== "patient" || still.compatibleSexLabel !== value.sexLabel) return invalid();
  return { version: "gift-only-visit.v1", opportunitySequence: value.opportunitySequence, ageYears: value.ageYears, sexLabel: value.sexLabel };
}
export function normalizeGiftCheckout(value: unknown, operation: Record<string, unknown>, facilityTick: number): GiftCheckoutState | undefined {
  if (value === undefined) return undefined;
  const line = getServiceIncomeLine(String(operation.incomeLineId));
  if (!record(value) || Object.keys(value).some(k => !["version", "contactId", "doorId", "returnBlocked", "aisleWaiting"].includes(k)) || value.version !== "gift-checkout.v1" ||
    ![null, "pay", "queue1", "queue2"].includes(value.contactId as null | string) || typeof value.doorId !== "string" || !value.doorId ||
    value.returnBlocked !== undefined && value.returnBlocked !== true || !isGiftIncomeLineId(String(operation.incomeLineId)) ||
    !record(operation.roomUpgradeRevenue) || operation.roomUpgradeRevenue.baseFee !== line?.fee ||
    (operation.executiveStock === undefined ? operation.quoteStockCost !== line?.retail?.stockCost
      : !record(operation.executiveStock) || operation.executiveStock.baselineCostCents !== (line?.retail?.stockCost ?? -1) * 100) ||
    operation.outletDurationMinutes !== LEVEL_FIVE_GIFT_RETAIL.checkoutMinutes || operation.staffRoleDefinitionId !== null || operation.servingEmployeeId !== null ||
    !tick(operation.createdAtFacilityTick) || operation.createdAtFacilityTick > facilityTick || !tick(operation.lastMovedAtFacilityTick) || operation.lastMovedAtFacilityTick > facilityTick ||
    !Array.isArray(operation.path) || !operation.path.length || operation.path.some(p => !record(p) || typeof p.x !== "number" || !Number.isFinite(p.x) || typeof p.y !== "number" || !Number.isFinite(p.y)) ||
    !tick(operation.pathIndex) || operation.pathIndex >= operation.path.length || !record(operation.location) ||
    !same(operation.location as unknown as GridPoint, operation.path[operation.pathIndex] as GridPoint) ||
    ["walking_to_outlet", "queued", "purchasing"].includes(String(operation.status)) && value.contactId === null ||
    operation.status === "purchasing" && (value.contactId !== "pay" || !tick(operation.startedAtFacilityTick) || !tick(operation.purchaseEndsAtFacilityTick) ||
      operation.purchaseEndsAtFacilityTick !== operation.startedAtFacilityTick + LEVEL_FIVE_GIFT_RETAIL.checkoutMinutes) ||
    value.returnBlocked === true && !["returning", "leaving"].includes(String(operation.status)) ||
    value.aisleWaiting !== undefined && (value.aisleWaiting !== true || value.returnBlocked === true ||
      !["walking_to_outlet", "returning", "leaving"].includes(String(operation.status)))) return invalid();
  return { version: "gift-checkout.v1", contactId: value.contactId as GiftCheckoutState["contactId"], doorId: value.doorId,
    ...(value.returnBlocked ? { returnBlocked: true } : {}), ...(value.aisleWaiting ? { aisleWaiting: true } : {}) };
}

/** Strict marked reservations; legacy unmarked retail keeps its existing reader. */
export function validateGiftRetailReservations(state: GameState): void {
  const contacts = new Set<string>();
  for (const trip of state.retailOperations) {
    const gift = trip.giftCheckout;
    if (!gift) continue;
    if (state.facilityLevel < 5) return invalid();
    if (terminal(trip) || gift.contactId === null) continue;
    if (trip.actorKind === "retail_visitor" && !state.retailExternalActors.some(actor => actor.id === trip.actorId && actor.activeRetailOperationId === trip.id)) return invalid();
    const key = `${trip.outletRoomInstanceId}:${gift.contactId}`;
    if (contacts.has(key)) return invalid();
    contacts.add(key);
    const shop = state.rooms.find(r => r.id === trip.outletRoomInstanceId);
    if (shop && (shop.roomDefinitionId !== "room.gift_shop" || !same(trip.path.at(-1)!, giftContactLocation(shop, gift.contactId)) ||
      ["queued", "purchasing"].includes(trip.status) && !same(trip.location, giftContactLocation(shop, gift.contactId)))) return invalid();
  }
}
