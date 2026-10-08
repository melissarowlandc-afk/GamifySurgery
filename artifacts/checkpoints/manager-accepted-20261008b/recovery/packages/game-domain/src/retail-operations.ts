import { SERVICE_INCOME_CATALOG, getServiceIncomeLine, type RetailOutletContract, type ServiceIncomeLine } from "@gamify-surgery/balance-config";
import { getEmployeeRoleTrainingPercent, getEmployeeTrainingMoney } from "./employee-training-effects";
import { bindRoomUpgradeRevenueQuote, createRoomUpgradeRevenueQuote, getRoomUpgradeQuotedFee } from "./room-upgrades";
import { createPatientDisplayName, createPatientPixelAppearance, getPatientAppearanceSelectionContext, getPresentPatientDisplayNames } from "./appearance";
import { getDoorCells } from "./doors";
import {
  encounterHasActiveServiceOperation,
  founderHasActiveServiceOperation,
  getActiveServiceOperationEmployeeIds,
  getClinicalResourceReservations,
  pathServiceVisitorFromCurrentLocation,
  pathServiceVisitorToOffscreenEndpoint,
  straightServiceVisitorSidewalkPath,
} from "./service-operations";
import { deterministicInteger } from "./randomness";
import { hasActivePatientAmenityTrip } from "./patient-amenities";
import { getCurrentCapabilities, getRoomDefinition, isEmployeeOperational, isRoomAvailableForNewFacilityWork, isRoomOperationalForFacilityWork } from "./selectors";
import {
  findDeterministicFacilityPath,
  getOccupiedTiles,
  getRoomNavigableTiles,
  getRoomNavigationAnchor,
  getRoomStandingWaitingAnchors,
  getRoomWaitingAnchors,
} from "./spatial";
import type { DomainContext, GameState, GridPoint, RetailActorKind, RetailExternalActorState, RetailOperationState } from "./types";
import { findRouteFromDisplacedLocationOffscreen, findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { findCareAwareFacilityPath } from "./care-room-access";
import { recordLevelThreeRoomUse } from "./level-three-support";
import { advanceProcedureCompanion, createProcedureCompanionState, planProcedureCompanionWait, reconcileProcedureCompanions } from "./procedure-companions";

function facilityRoute(state: GameState, context: DomainContext, start: GridPoint, goal: GridPoint, allowedRoomIds: ReadonlySet<string> = new Set()): GridPoint[] {
  const ordinary = findCareAwareFacilityPath(state, context, start, goal, allowedRoomIds);
  return ordinary.length > 0 ? ordinary : findRouteFromDisplacedLocationToPoint(state, context, start, goal, allowedRoomIds);
}

const DAY_MINUTES = 600;
const TRIP_COOLDOWN_MINUTES = 120;
const QUEUE_ABANDON_MINUTES = 10;
const EXTERNAL_OPPORTUNITY_MINUTES = 120;
const MAX_EXTERNAL_RETAIL_ACTORS = 2;
const MAX_OUTLET_QUEUE = 2;

const terminal = (operation: RetailOperationState): boolean =>
  operation.status === "completed" || operation.status === "abandoned" || operation.status === "cancelled";

const actorKey = (kind: RetailActorKind, id: string): string => `${kind}:${id}`;

function samePoint(left: GridPoint | null | undefined, right: GridPoint | null | undefined): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function entrance(state: GameState, context: DomainContext): { inside: GridPoint; outside: GridPoint } | null {
  for (const door of [...state.doors].filter((candidate) => candidate.exterior).sort((a, b) => a.id.localeCompare(b.id))) {
    const room = state.rooms.find((candidate) => candidate.id === door.roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    const cells = room && definition ? getDoorCells(door, room, definition) : null;
    if (cells) return cells;
  }
  return null;
}

function pathFromEntrance(state: GameState, context: DomainContext, target: GridPoint): GridPoint[] {
  const entry = entrance(state, context);
  if (!entry) return [];
  const internal = findCareAwareFacilityPath(state, context, entry.inside, target);
  return internal.length ? [entry.outside, entry.inside, ...internal.slice(1)] : [];
}

function pathToExit(state: GameState, context: DomainContext, start: GridPoint): GridPoint[] {
  return findRouteFromDisplacedLocationOffscreen(state, context, start);
}

/**
 * Off-map start for anyone who arrives on foot. Like patients, visitors and
 * staff, they walk in along the sidewalk instead of appearing at the door.
 */
function streetArrivalPoint(state: GameState, context: DomainContext, actorId: string): GridPoint | null {
  const entry = entrance(state, context);
  if (!entry) return null;
  const fromLeft = deterministicInteger(state.campaignSeed, "environment", `${actorId}:street-arrival-side.v1`, 2) === 0;
  return { x: fromLeft ? -2 : context.balanceRelease.facility.gridWidth + 1, y: entry.outside.y };
}

/** The street row, beyond either map edge, or the tile outside the front door. */
function isStreetOrigin(state: GameState, context: DomainContext, point: GridPoint): boolean {
  const { gridWidth, gridHeight } = context.balanceRelease.facility;
  return point.y >= gridHeight || point.x < 0 || point.x >= gridWidth ||
    samePoint(point, entrance(state, context)?.outside);
}

/** Sidewalk to the front door, then the route inside. */
function pathFromStreet(
  state: GameState,
  context: DomainContext,
  origin: GridPoint,
  target: GridPoint,
  insideRoute: (entry: { inside: GridPoint; outside: GridPoint }) => GridPoint[] = () => pathFromEntrance(state, context, target),
): GridPoint[] {
  const entry = entrance(state, context);
  if (!entry) return [];
  const inside = insideRoute(entry);
  if (!inside.length) return [];
  return [...straightServiceVisitorSidewalkPath(origin, entry.outside), ...inside.slice(1)];
}

function outletForLine(state: GameState, line: ServiceIncomeLine, context: DomainContext, origin?: GridPoint | null): { roomId: string; contract: RetailOutletContract; target: GridPoint; servingEmployeeId: string | null } | null {
  const capabilities = getCurrentCapabilities(state, context);
  const clinical = getClinicalResourceReservations(state, context);
  const serviceEmployees = getActiveServiceOperationEmployeeIds(state);
  for (const contract of line.retail?.outlets ?? []) {
    if (!contract.requiredCapabilityIds.every((id) => capabilities.has(id))) continue;
    const rooms = [...state.rooms]
      .filter((candidate) => candidate.roomDefinitionId === contract.roomDefinitionId && isRoomAvailableForNewFacilityWork(state, candidate.id, context))
      .flatMap(room => {
        const definition = getRoomDefinition(room.roomDefinitionId, context);
        if (!definition) return [];
        const target = getRoomNavigationAnchor(room, definition, "primary");
        const queue = state.retailOperations.filter(operation => !terminal(operation) && operation.outletRoomInstanceId === room.id &&
          (operation.status === "queued" || operation.status === "walking_to_outlet")).length;
        const path = origin ? isStreetOrigin(state, context, origin) ? pathFromStreet(state, context, origin, target) : facilityRoute(state, context, origin, target) : [target];
        return queue < MAX_OUTLET_QUEUE && path.length ? [{ room, target, queue, distance: path.length }] : [];
      }).sort((a, b) => a.queue - b.queue || a.distance - b.distance || a.room.id.localeCompare(b.room.id));
    for (const { room, target } of rooms) {
      const servingEmployee = contract.staffRoleDefinitionId ? state.employees
        .filter((employee) => employee.staffRoleDefinitionId === contract.staffRoleDefinitionId && employee.homeRoomInstanceId === room.id && !employee.facilityTask &&
          !clinical.employeeIds.has(employee.id) && !serviceEmployees.has(employee.id) &&
          !state.retailOperations.some((operation) => ["walking_to_outlet", "queued", "purchasing"].includes(operation.status) && operation.servingEmployeeId === employee.id) && isEmployeeOperational(state, employee.id, context))
        .sort((left, right) => left.id.localeCompare(right.id))[0] : null;
      if (contract.staffRoleDefinitionId && !servingEmployee) continue;
      return { roomId: room.id, contract, target, servingEmployeeId: servingEmployee?.id ?? null };
    }
  }
  return null;
}

function actorLocation(state: GameState, kind: RetailActorKind, id: string): GridPoint | null {
  if (kind === "employee") return state.employees.find((employee) => employee.id === id)?.location ?? null;
  if (kind === "founder") return state.environment.founderLocation;
  if (kind === "encounter") return state.encounters[id]?.patientLocation ?? null;
  if (kind === "service_visitor") return state.serviceOperations.find((operation) => operation.id === id)?.location ?? null;
  return state.retailExternalActors.find((actor) => actor.id === id)?.location ?? null;
}

function actorIdentity(state: GameState, kind: RetailActorKind, id: string): { displayName: string; appearance: RetailOperationState["appearance"] } | null {
  if (kind === "employee") {
    const actor = state.employees.find((employee) => employee.id === id);
    return actor ? { displayName: actor.displayName, appearance: actor.appearance } : null;
  }
  if (kind === "founder") return { displayName: state.founder.displayName, appearance: state.founder.appearance };
  if (kind === "encounter") {
    const actor = state.encounters[id];
    return actor ? { displayName: actor.patientDisplayName, appearance: actor.patientAppearance } : null;
  }
  if (kind === "service_visitor") {
    const actor = state.serviceOperations.find((operation) => operation.id === id);
    return actor?.appearance ? { displayName: actor.displayName, appearance: actor.appearance } : null;
  }
  const actor = state.retailExternalActors.find((candidate) => candidate.id === id);
  return actor ? { displayName: actor.displayName, appearance: actor.appearance } : null;
}

function setActorMovement(state: GameState, operation: RetailOperationState): void {
  const location = operation.path[operation.pathIndex];
  if (!location) return;
  operation.location = { ...location };
  if (operation.actorKind === "employee") {
    const actor = state.employees.find((employee) => employee.id === operation.actorId);
    if (actor) { actor.location = { ...location }; actor.path = operation.path; actor.pathIndex = operation.pathIndex; actor.lastMovedAtFacilityTick = state.facilityTick; }
  } else if (operation.actorKind === "founder") state.environment.founderLocation = { ...location };
  else if (operation.actorKind === "encounter") {
    const actor = state.encounters[operation.actorId];
    if (actor) actor.patientLocation = { ...location };
    const service = operation.departureServiceOperationId
      ? state.serviceOperations.find((candidate) => candidate.id === operation.departureServiceOperationId)
      : null;
    if (service) service.location = { ...location };
  } else if (operation.actorKind === "service_visitor") {
    const actor = state.serviceOperations.find((candidate) => candidate.id === operation.actorId);
    if (actor) actor.location = { ...location };
  } else {
    const actor = state.retailExternalActors.find((candidate) => candidate.id === operation.actorId);
    if (actor) { actor.location = { ...location }; actor.path = operation.path; actor.pathIndex = operation.pathIndex; actor.lastMovedAtFacilityTick = state.facilityTick; }
  }
}

function isWaitingEncounterEligible(state: GameState, encounterId: string, foodDrink: boolean): boolean {
  const encounter = state.encounters[encounterId];
  if (!encounter || encounter.lifecycle !== "active_pending_result" || !encounter.patientLocation || encounterHasActiveServiceOperation(state, encounterId)) return false;
  if (encounter.patientMovement && encounter.patientMovement.kind !== "idle_within_room") return false;
  if (!encounter.steps.some((step) => step.status === "result_pending")) return false;
  const pending = encounter.pendingResult;
  if (pending && pending.deliveredAtTick === null && (pending.timingPhases?.some((phase) => phase.resourceBound && state.facilityTick < phase.endsAtTick) ?? true)) return false;
  return !foodDrink || encounter.retailFoodDrinkAllowed !== false;
}

function actorCanStart(state: GameState, kind: RetailActorKind, id: string, line: ServiceIncomeLine, context: DomainContext): boolean {
  if (state.retailOperations.some((operation) => !terminal(operation) && operation.actorKind === kind && operation.actorId === id)) return false;
  if ((kind === "encounter" || kind === "service_visitor") &&
    hasActivePatientAmenityTrip(state, kind, id)) return false;
  const clinical = getClinicalResourceReservations(state, context);
  if (kind === "employee") return Boolean(state.employees.some((employee) => employee.id === id && !employee.facilityTask && isEmployeeOperational(state, id, context) && !clinical.employeeIds.has(id) && !getActiveServiceOperationEmployeeIds(state).has(id) &&
    !state.retailOperations.some((operation) => ["walking_to_outlet", "queued", "purchasing"].includes(operation.status) && operation.servingEmployeeId === id) &&
    !state.environment.glp1AutomationSlots.some((slot) => slot.employeeId === id)));
  // A seat the player chose holds until they move the founder or open a chart (owner rule, 2026-10-07).
  if (kind === "founder") return (state.environment.founderActivity === null || ["attend_encounter", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(state.environment.founderActivity.kind)) &&
    state.environment.founderActivity?.explicitSeat !== true && !clinical.founderReserved && !founderHasActiveServiceOperation(state);
  if (kind === "encounter") return isWaitingEncounterEligible(state, id, line.retail?.category === "food_drink");
  if (kind === "service_visitor") {
    const actor = state.serviceOperations.find((operation) => operation.id === id);
    return Boolean(actor && actor.status === "waiting_for_resources" &&
      (!actor.visitorTravel || actor.visitorTravel.arrivedAtFacilityTick !== null) &&
      actor.reservedRoomInstanceIds.length === 0 && !companionLines.has(actor.incomeLineId));
  }
  return Boolean(state.retailExternalActors.some((actor) => actor.id === id && actor.lifecycle !== "departed" && actor.activeRetailOperationId === null &&
    // New procedure companions have their own phase-gated amenity flow. Saved
    // companions retain their current retail/visit behaviour.
    !actor.procedureCompanion));
}

function ledgerAllows(state: GameState, kind: RetailActorKind, id: string, line: ServiceIncomeLine, authorized: boolean): boolean {
  if (authorized) return true;
  const key = actorKey(kind, id);
  const dayNumber = Math.floor(state.facilityTick / DAY_MINUTES);
  const saved = state.retailActorLedgers[key];
  const recurring = kind === "employee" || kind === "founder";
  const ledger = saved ? {
    dayNumber,
    foodDayNumber: dayNumber,
    discretionarySpent: recurring && saved.dayNumber !== dayNumber ? 0 : saved.discretionarySpent,
    foodDrinkPurchases: saved.foodDayNumber === dayNumber ? saved.foodDrinkPurchases : 0,
    giftSupplyPurchases: recurring && saved.dayNumber !== dayNumber ? 0 : saved.giftSupplyPurchases,
    lastTripAtFacilityTick: saved.lastTripAtFacilityTick,
  } : { dayNumber, foodDayNumber: dayNumber, discretionarySpent: 0, foodDrinkPurchases: 0, giftSupplyPurchases: 0, lastTripAtFacilityTick: null };
  if (ledger.lastTripAtFacilityTick !== null && state.facilityTick - ledger.lastTripAtFacilityTick < TRIP_COOLDOWN_MINUTES) return false;
  if (line.retail?.category === "food_drink" && ledger.foodDrinkPurchases >= 2) return false;
  if (line.retail?.category === "gift_supply" && ledger.giftSupplyPurchases >= 1) return false;
  const budget = kind === "employee" || kind === "founder" ? 20 : 30;
  return ledger.discretionarySpent + line.fee <= budget;
}

function matchingOrder(state: GameState, orderId: string | undefined, kind: RetailActorKind, actorId: string, lineId: string) {
  if (!orderId) return null;
  return state.retailOrders.find((order) => order.id === orderId && order.actorKind === kind && order.actorId === actorId && order.incomeLineId === lineId && order.fulfilledQuantity < order.allowance) ?? null;
}

function validDepartureLink(state: GameState, kind: RetailActorKind, actorId: string, serviceOperationId?: string): boolean {
  if (!serviceOperationId || (kind !== "encounter" && kind !== "service_visitor")) return false;
  const operation = state.serviceOperations.find((candidate) => candidate.id === serviceOperationId);
  return Boolean(operation && operation.periopBedFlowVersion === 1 && !operation.periopBedReservation &&
    operation.status === "discharging" && operation.departureItinerary?.status === "pending" &&
    (kind === "encounter"
      ? operation.actorKind === "encounter" && operation.actorId === actorId && state.encounters[actorId]?.lifecycle === "resolved"
      : operation.actorKind === "visitor" && operation.id === actorId));
}

export function getViableDepartureRetailLineIds(
  state: GameState,
  kind: "encounter" | "service_visitor",
  actorId: string,
  context: DomainContext,
): string[] {
  const location = actorLocation(state, kind, actorId);
  if (!location) return [];
  return SERVICE_INCOME_CATALOG.filter((line) => line.kind === "retail" &&
    (line.retail?.category === "food_drink" || line.retail?.category === "gift_supply") &&
    state.facilityLevel >= line.minimumFacilityLevel &&
    !(kind === "encounter" && line.retail.category === "food_drink" && state.encounters[actorId]?.retailFoodDrinkAllowed === false) &&
    ledgerAllows(state, kind, actorId, line, false))
    .flatMap((line) => {
      const outlet = outletForLine(state, line, context, location);
      if (!outlet) return [];
      const path = kind === "service_visitor"
        ? pathServiceVisitorFromCurrentLocation(state, context, location, outlet.target)
        : facilityRoute(state, context, location, outlet.target);
      return path.length > 0 ? [line.id] : [];
    })
    .sort();
}

export function startRetailPurchase(
  state: GameState,
  lineId: string,
  kind: RetailActorKind,
  actorId: string,
  context: DomainContext,
  authorizedOrderId?: string,
  departureServiceOperationId?: string,
): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.retail || line.kind !== "retail" || state.facilityLevel < line.minimumFacilityLevel) return null;
  const order = line.retail.category === "authorized_order" ? matchingOrder(state, authorizedOrderId, kind, actorId, lineId) : null;
  if (line.retail.category === "authorized_order" && !order) return null;
  const departureLinked = validDepartureLink(state, kind, actorId, departureServiceOperationId);
  if (departureLinked && ((kind === "encounter" || kind === "service_visitor") && hasActivePatientAmenityTrip(state, kind, actorId) ||
    state.retailOperations.some((candidate) => !terminal(candidate) && candidate.actorKind === kind && candidate.actorId === actorId))) return null;
  if (departureLinked && kind === "encounter" && line.retail.category === "food_drink" && state.encounters[actorId]?.retailFoodDrinkAllowed === false) return null;
  if ((!departureLinked && !actorCanStart(state, kind, actorId, line, context)) || !ledgerAllows(state, kind, actorId, line, Boolean(order))) return null;
  const location = actorLocation(state, kind, actorId);
  const outlet = outletForLine(state, line, context, location);
  const identity = actorIdentity(state, kind, actorId);
  if (!outlet || !location || !identity || (kind === "employee" && outlet.servingEmployeeId === actorId)) return null;
  const activeAtOutlet = state.retailOperations.filter((operation) => !terminal(operation) && operation.outletRoomInstanceId === outlet.roomId);
  if (activeAtOutlet.filter((operation) => operation.status === "queued" || operation.status === "walking_to_outlet").length >= MAX_OUTLET_QUEUE) return null;
  const path = kind === "retail_visitor"
    ? isStreetOrigin(state, context, location)
      ? pathFromStreet(state, context, location, outlet.target)
      : facilityRoute(state, context, location, outlet.target)
    : kind === "service_visitor"
      ? pathServiceVisitorFromCurrentLocation(state, context, location, outlet.target)
      : facilityRoute(state, context, location, outlet.target);
  if (!path.length) return null;
  const id = `retail-operation.${state.retailOperationSequence++}`;
  const roomUpgradeRevenue = createRoomUpgradeRevenueQuote(state, line.fee, [outlet.contract.roomDefinitionId]);
  bindRoomUpgradeRevenueQuote(roomUpgradeRevenue, outlet.roomId);
  const operation: RetailOperationState = {
    id, incomeLineId: line.id, catalogVersion: 1, actorKind: kind, actorId, displayName: identity.displayName, appearance: identity.appearance,
    linkedServiceOperationId: kind === "service_visitor" ? actorId : kind === "companion" ? state.retailExternalActors.find((actor) => actor.id === actorId)?.linkedServiceOperationId ?? null : null,
    authorizedOrderId: order?.id ?? null, status: "walking_to_outlet", createdAtFacilityTick: state.facilityTick,
    waitDeadlineFacilityTick: state.facilityTick + QUEUE_ABANDON_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null,
    quoteGross: roomUpgradeRevenue ? getRoomUpgradeQuotedFee(roomUpgradeRevenue) : line.fee, roomUpgradeRevenue,
    quoteStockCost: outlet.contract.staffRoleDefinitionId === "staff.pharmacist"
      ? getEmployeeTrainingMoney(line.retail.stockCost, getEmployeeRoleTrainingPercent(state, "staff.pharmacist"), "decrease")
      : line.retail.stockCost, outletRoomInstanceId: outlet.roomId,
    outletDurationMinutes: outlet.contract.durationMinutes, staffRoleDefinitionId: outlet.contract.staffRoleDefinitionId ?? null, servingEmployeeId: outlet.servingEmployeeId,
    location: { ...location }, returnLocation: kind === "retail_visitor" ? null : { ...location }, path, pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, purchaseEndsAtFacilityTick: null, cancellationReason: null,
    ...(departureLinked ? { departureServiceOperationId } : {}),
  };
  state.retailOperations.push(operation);
  if (kind === "encounter") {
    const encounter = state.encounters[actorId];
    if (encounter) encounter.patientMovement = null;
  } else if (kind === "employee") {
    const employee = state.employees.find((candidate) => candidate.id === actorId);
    if (employee) { employee.path = path; employee.pathIndex = 0; employee.lastMovedAtFacilityTick = state.facilityTick; }
  } else if (kind === "founder") state.environment.founderActivity = null;
  if (!order) recordTripStart(state, operation);
  const external = state.retailExternalActors.find((actor) => actor.id === actorId);
  if (external) external.activeRetailOperationId = id;
  return id;
}

export function authorizeRetailOrder(state: GameState, orderId: string, lineId: string, kind: RetailActorKind, actorId: string, allowance = 1, context?: DomainContext): boolean {
  const line = getServiceIncomeLine(lineId);
  if (!line?.retail || line.retail.category !== "authorized_order" || state.retailOrders.some((order) => order.id === orderId)) return false;
  if (kind === "retail_visitor" && !state.retailExternalActors.some((actor) => actor.id === actorId)) {
    if (!context || state.retailExternalActors.filter((actor) => actor.kind === "retail_visitor" && actor.lifecycle !== "departed").length >= MAX_EXTERNAL_RETAIL_ACTORS) return false;
    const entry = entrance(state, context);
    if (!entry) return false;
    state.retailExternalActors.push({ id: actorId, kind: "retail_visitor", displayName: createPatientDisplayName(state.campaignSeed, actorId, undefined, getPresentPatientDisplayNames(state)), appearance: createPatientPixelAppearance(state.campaignSeed, actorId, {}, "patient", getPatientAppearanceSelectionContext(state)), linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "arriving", location: streetArrivalPoint(state, context, actorId) ?? { ...entry.outside }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
  }
  state.retailOrders.push({ id: orderId, actorKind: kind, actorId, incomeLineId: lineId, allowance: Math.max(1, Math.floor(allowance)), fulfilledQuantity: 0, createdAtFacilityTick: state.facilityTick });
  return true;
}

function cancelTrip(state: GameState, operation: RetailOperationState, reason: string, context?: DomainContext): void {
  operation.cancellationReason = reason;
  const external = state.retailExternalActors.find((actor) => actor.id === operation.actorId);
  if (external && operation.actorKind === "retail_visitor" && context) {
    operation.path = pathToExit(state, context, operation.location);
    operation.pathIndex = 0;
    operation.status = "leaving";
    external.lifecycle = "departing";
    external.path = operation.path;
    external.pathIndex = 0;
  } else {
    operation.status = "cancelled";
    if (external?.activeRetailOperationId === operation.id) external.activeRetailOperationId = null;
  }
}

function preempted(state: GameState, operation: RetailOperationState): boolean {
  if (operation.departureServiceOperationId) {
    const service = state.serviceOperations.find((candidate) => candidate.id === operation.departureServiceOperationId);
    return !(service?.status === "discharging" && service.departureItinerary?.status === "retail");
  }
  if (operation.actorKind === "employee") return Boolean(state.employees.find((employee) => employee.id === operation.actorId)?.facilityTask);
  if (operation.actorKind === "founder") return state.environment.founderActivity !== null;
  if (operation.actorKind === "encounter") return !isWaitingEncounterEligible(state, operation.actorId, getServiceIncomeLine(operation.incomeLineId)?.retail?.category === "food_drink");
  if (operation.actorKind === "service_visitor") return state.serviceOperations.find((candidate) => candidate.id === operation.actorId)?.status !== "waiting_for_resources";
  return false;
}

function updateLedger(state: GameState, operation: RetailOperationState, line: ServiceIncomeLine): void {
  const key = actorKey(operation.actorKind, operation.actorId);
  const dayNumber = Math.floor(state.facilityTick / DAY_MINUTES);
  const previous = state.retailActorLedgers[key];
  const recurring = operation.actorKind === "employee" || operation.actorKind === "founder";
  const ledger = previous ? {
    dayNumber,
    foodDayNumber: dayNumber,
    discretionarySpent: recurring && previous.dayNumber !== dayNumber ? 0 : previous.discretionarySpent,
    foodDrinkPurchases: previous.foodDayNumber === dayNumber ? previous.foodDrinkPurchases : 0,
    giftSupplyPurchases: recurring && previous.dayNumber !== dayNumber ? 0 : previous.giftSupplyPurchases,
    lastTripAtFacilityTick: previous.lastTripAtFacilityTick,
  } : { dayNumber, foodDayNumber: dayNumber, discretionarySpent: 0, foodDrinkPurchases: 0, giftSupplyPurchases: 0, lastTripAtFacilityTick: null };
  if (!operation.authorizedOrderId) {
    ledger.discretionarySpent += operation.quoteGross;
    if (line.retail?.category === "food_drink") ledger.foodDrinkPurchases += 1;
    if (line.retail?.category === "gift_supply") ledger.giftSupplyPurchases += 1;
  }
  ledger.lastTripAtFacilityTick = state.facilityTick;
  state.retailActorLedgers[key] = ledger;
}

function recordTripStart(state: GameState, operation: RetailOperationState): void {
  const key = actorKey(operation.actorKind, operation.actorId);
  const dayNumber = Math.floor(state.facilityTick / DAY_MINUTES);
  const previous = state.retailActorLedgers[key];
  const recurring = operation.actorKind === "employee" || operation.actorKind === "founder";
  state.retailActorLedgers[key] = previous ? {
    ...previous,
    dayNumber,
    foodDayNumber: previous.foodDayNumber,
    discretionarySpent: recurring && previous.dayNumber !== dayNumber ? 0 : previous.discretionarySpent,
    giftSupplyPurchases: recurring && previous.dayNumber !== dayNumber ? 0 : previous.giftSupplyPurchases,
    lastTripAtFacilityTick: state.facilityTick,
  } : { dayNumber, foodDayNumber: dayNumber, discretionarySpent: 0, foodDrinkPurchases: 0, giftSupplyPurchases: 0, lastTripAtFacilityTick: state.facilityTick };
}

function fulfill(state: GameState, operation: RetailOperationState, line: ServiceIncomeLine, context: DomainContext): boolean {
  if (state.cashCents < operation.quoteStockCost * 100) return false;
  const transactionKey = `income.retail.${operation.id}.${operation.incomeLineId}`;
  if (state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === transactionKey)) return true;
  const founderConsumption = operation.actorKind === "founder";
  const cashDelta = founderConsumption ? -operation.quoteStockCost : operation.quoteGross - operation.quoteStockCost;
  state.cashCents += Math.round(cashDelta * 100);
  state.cash = state.cashCents / 100;
  const receiptActorKind = operation.actorKind === "encounter" ? "patient" : operation.actorKind === "service_visitor" ? "visitor" : operation.actorKind;
  state.serviceIncomeReceipts.push({ id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`, transactionKey, incomeLineId: operation.incomeLineId, catalogVersion: 1, routeId: null, actorKind: receiptActorKind, actorId: operation.actorId, grossAmount: founderConsumption ? 0 : operation.quoteGross, stockCost: operation.quoteStockCost, netCashDelta: cashDelta, completedAtFacilityTick: state.facilityTick });
  recordLevelThreeRoomUse(state, operation.outletRoomInstanceId, `retail:${operation.id}`, context);
  const order = operation.authorizedOrderId ? state.retailOrders.find((candidate) => candidate.id === operation.authorizedOrderId) : null;
  if (order) order.fulfilledQuantity += 1;
  updateLedger(state, operation, line);
  return true;
}

function beginReturn(state: GameState, operation: RetailOperationState, context: DomainContext): void {
  if (operation.departureServiceOperationId) {
    operation.path = [{ ...operation.location }];
    operation.pathIndex = 0;
    operation.status = "completed";
    return;
  }
  const external = state.retailExternalActors.find((actor) => actor.id === operation.actorId);
  if (operation.actorKind === "retail_visitor") {
    operation.path = pathToExit(state, context, operation.location);
    operation.status = "leaving";
    if (external) { external.lifecycle = "departing"; external.path = operation.path; external.pathIndex = 0; }
  } else if (operation.returnLocation) {
    operation.path = facilityRoute(state, context, operation.location, operation.returnLocation);
    operation.status = "returning";
  } else operation.status = "completed";
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
}

function advanceMovement(state: GameState, operation: RetailOperationState, context: DomainContext): void {
  if ((operation.departureServiceOperationId || operation.actorKind === "retail_visitor") && operation.createdAtFacilityTick === state.facilityTick) return;
  if (operation.pathIndex < operation.path.length - 1) {
    const elapsed = Math.max(1, state.facilityTick - operation.lastMovedAtFacilityTick);
    operation.pathIndex = Math.min(operation.path.length - 1, operation.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick);
    operation.lastMovedAtFacilityTick = state.facilityTick;
    setActorMovement(state, operation);
  }
}

function isOutletStaffed(state: GameState, operation: RetailOperationState, context: DomainContext): boolean {
  if (!isRoomOperationalForFacilityWork(state, operation.outletRoomInstanceId, context)) return false;
  if (!operation.staffRoleDefinitionId) return true;
  const clinical = getClinicalResourceReservations(state, context);
  const serviceEmployees = getActiveServiceOperationEmployeeIds(state);
  const outletRoom = state.rooms.find((room) => room.id === operation.outletRoomInstanceId);
  const outletDefinition = outletRoom ? getRoomDefinition(outletRoom.roomDefinitionId, context) : null;
  return Boolean(operation.servingEmployeeId && outletRoom && outletDefinition && state.employees.some((employee) => employee.id === operation.servingEmployeeId && employee.staffRoleDefinitionId === operation.staffRoleDefinitionId && employee.homeRoomInstanceId === operation.outletRoomInstanceId &&
    getOccupiedTiles(outletRoom, outletDefinition).some((point) => point.x === employee.location.x && point.y === employee.location.y) &&
    !employee.facilityTask && !clinical.employeeIds.has(employee.id) && !serviceEmployees.has(employee.id) && isEmployeeOperational(state, employee.id, context)) &&
    !state.retailOperations.some((candidate) => candidate.id !== operation.id && !terminal(candidate) && candidate.servingEmployeeId === operation.servingEmployeeId && candidate.status === "purchasing"));
}

function createExternalRetailVisitor(state: GameState, context: DomainContext): void {
  if (state.retailExternalActors.filter((actor) => actor.kind === "retail_visitor" && actor.lifecycle !== "departed").length >= MAX_EXTERNAL_RETAIL_ACTORS) return;
  const opportunity = state.externalRetailSequence++;
  const candidates = SERVICE_INCOME_CATALOG.filter((line) => line.kind === "retail" && line.retail?.category !== "authorized_order" && state.facilityLevel >= line.minimumFacilityLevel && outletForLine(state, line, context));
  if (!candidates.length) return;
  if (deterministicInteger(state.campaignSeed, "environment", `retail-opportunity.${opportunity}`, 2) !== 0) return;
  const id = `retail-visitor.${opportunity}`;
  const entry = entrance(state, context);
  if (!entry) return;
  const actor: RetailExternalActorState = { id, kind: "retail_visitor", displayName: createPatientDisplayName(state.campaignSeed, id, undefined, getPresentPatientDisplayNames(state)), appearance: createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state)), linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "arriving", location: streetArrivalPoint(state, context, id) ?? { ...entry.outside }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null };
  state.retailExternalActors.push(actor);
  const product = candidates[deterministicInteger(state.campaignSeed, "environment", `retail-product.${opportunity}`, candidates.length)]!;
  if (!startRetailPurchase(state, product.id, "retail_visitor", id, context)) actor.lifecycle = "departed";
}

function scheduleOptionalShopping(state: GameState, context: DomainContext): void {
  // Resolved patients, finished visitor operations and departed companions can
  // never start a purchase again. Excluding them keeps this per-minute pass
  // proportional to the people present rather than to campaign history.
  const actors: Array<{ kind: RetailActorKind; id: string }> = [
    ...state.employees.map((actor) => ({ kind: "employee" as const, id: actor.id })),
    ...Object.values(state.encounters).filter((actor) => actor.lifecycle !== "resolved" && actor.lifecycle !== "resolved_summary_available").map((actor) => ({ kind: "encounter" as const, id: actor.id })),
    ...state.serviceOperations.filter((actor) => actor.actorKind === "visitor" && actor.status !== "completed" && actor.status !== "cancelled").map((actor) => ({ kind: "service_visitor" as const, id: actor.id })),
    ...state.retailExternalActors.filter((actor) => actor.kind === "companion" && actor.lifecycle !== "departed").map((actor) => ({ kind: "companion" as const, id: actor.id })),
    { kind: "founder", id: "founder" },
  ];
  const priorityWindow = Math.floor(state.facilityTick / 30);
  const dueActors: Array<{
    actor: { kind: RetailActorKind; id: string };
    key: string;
    priority: number;
    ordinal: number;
  }> = [];
  for (const [ordinal, actor] of actors.entries()) {
    const key = actorKey(actor.kind, actor.id);
    const due = state.retailNextOpportunityTicks[key];
    if (due === undefined) {
      state.retailNextOpportunityTicks[key] = state.facilityTick + 1 + deterministicInteger(state.campaignSeed, "environment", `optional-first.${key}`, 30);
      continue;
    }
    if (due > state.facilityTick) continue;
    dueActors.push({
      actor,
      key,
      priority: deterministicInteger(
        state.campaignSeed,
        "environment",
        `optional-priority.${actor.kind}.${actor.id}.${priorityWindow}`,
        1_000,
      ),
      // The previous stable sort retained actor construction order when
      // deterministic priorities tied. Keep that exact tie behavior explicit.
      ordinal,
    });
  }
  dueActors.sort((left, right) =>
    left.priority - right.priority || left.ordinal - right.ordinal,
  );
  for (const { actor, key } of dueActors) {
    const candidates = SERVICE_INCOME_CATALOG.filter((line) => line.kind === "retail" && line.retail?.category !== "authorized_order" && state.facilityLevel >= line.minimumFacilityLevel &&
      actorCanStart(state, actor.kind, actor.id, line, context) && ledgerAllows(state, actor.kind, actor.id, line, false) && outletForLine(state, line, context));
    if (!candidates.length) { state.retailNextOpportunityTicks[key] = state.facilityTick + 15; continue; }
    const choice = candidates[deterministicInteger(state.campaignSeed, "environment", `optional-retail.${actor.kind}.${actor.id}.${state.facilityTick}`, candidates.length)]!;
    state.retailNextOpportunityTicks[key] = state.facilityTick + (startRetailPurchase(state, choice.id, actor.kind, actor.id, context) ? TRIP_COOLDOWN_MINUTES : 15);
  }
}

/** Owner rule: only endoscopy, surgery and pediatric visits create companions. */
export const COMPANION_VISIT_POLICIES = {
  "income.endoscopy": { kind: "procedure", parentMustStayWithPatient: false },
  "income.advanced_endoscopy": { kind: "procedure", parentMustStayWithPatient: false },
  "income.ambulatory_operation": { kind: "procedure", parentMustStayWithPatient: false },
  "income.ambulatory_operation_extended": { kind: "procedure", parentMustStayWithPatient: false },
  // Pediatric rooms are not built yet. Their future parent spot must stay in
  // the patient's room at all times; never reuse procedure amenity behaviour.
  "income.pediatric_consult": { kind: "pediatric", parentMustStayWithPatient: true },
} as const;
const companionLines = new Set(Object.keys(COMPANION_VISIT_POLICIES));
const legacyCompanionRoutes = new Set(["route.endoscopy.in_house", "route.endoscopy.eus-ercp-sampling.in_house"]);

function isPeriopBedFlowOperation(operation: GameState["serviceOperations"][number] | null | undefined): boolean {
  return operation?.periopBedFlowVersion === 1;
}

function publicCompanionOccupiedTargets(state: GameState, excludeCompanionId?: string): Set<string> {
  const occupied = new Set<string>();
  const add = (point: GridPoint | null | undefined) => {
    if (point) occupied.add(pointKey(point));
  };
  for (const encounter of Object.values(state.encounters)) {
    add(encounter.patientLocation);
    add(encounter.patientMovement?.path.at(-1));
    add(encounter.waitingDestination?.location);
  }
  for (const employee of state.employees) {
    add(employee.location);
    add(employee.path.at(-1));
  }
  add(state.environment.founderLocation);
  add(state.environment.founderActivity?.path.at(-1));
  for (const retail of state.retailOperations) {
    if (!terminal(retail)) {
      add(retail.location);
      add(retail.path.at(-1));
    }
  }
  for (const companion of state.retailExternalActors) {
    if (companion.id === excludeCompanionId || companion.lifecycle === "departed") continue;
    add(companion.location);
    add(companion.path.at(-1));
  }
  return occupied;
}

function isPublicCompanionTarget(
  state: GameState,
  context: DomainContext,
  point: GridPoint,
): boolean {
  return state.rooms.some((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition?.navigation?.publicWaitingArea || !isRoomOperationalForFacilityWork(state, room.id, context)) return false;
    const blocked = new Set([
      ...getRoomWaitingAnchors(room, definition).map(pointKey),
      ...state.doors
        .filter((door) => door.roomId === room.id)
        .flatMap((door) => {
          const cells = getDoorCells(door, room, definition);
          return cells ? [pointKey(cells.inside)] : [];
        }),
    ]);
    return !blocked.has(pointKey(point)) && getRoomNavigableTiles(room, definition, state.doors).some((candidate) => samePoint(candidate, point));
  });
}

function publicCompanionRoute(
  state: GameState,
  context: DomainContext,
  origin: GridPoint,
  target: GridPoint,
): GridPoint[] {
  return isStreetOrigin(state, context, origin)
    ? pathFromStreet(state, context, origin, target)
    : facilityRoute(state, context, origin, target);
}

function procedureCompanionRoute(state: GameState, context: DomainContext, origin: GridPoint, target: GridPoint, periopRoomId: string | null): GridPoint[] {
  if (isStreetOrigin(state, context, target)) return pathServiceVisitorToOffscreenEndpoint(state, context, origin, target);
  const allowed = new Set(periopRoomId ? [periopRoomId] : []);
  return isStreetOrigin(state, context, origin)
    ? pathFromStreet(state, context, origin, target, (entry) => {
      const inside = facilityRoute(state, context, entry.inside, target, allowed);
      return inside.length ? [entry.outside, ...inside] : [];
    })
    : facilityRoute(state, context, origin, target, allowed);
}

function choosePeriopCompanionPublicTarget(
  state: GameState,
  context: DomainContext,
  origin: GridPoint,
  excludeCompanionId?: string,
): { target: GridPoint; path: GridPoint[] } | null {
  const occupied = publicCompanionOccupiedTargets(state, excludeCompanionId);
  const rooms = state.rooms
    .filter((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      return Boolean(definition?.navigation?.publicWaitingArea && isRoomOperationalForFacilityWork(state, room.id, context));
    })
    .sort((left, right) =>
      Number(right.roomDefinitionId === "room.waiting") - Number(left.roomDefinitionId === "room.waiting") ||
      left.id.localeCompare(right.id),
    );
  for (const room of rooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context)!;
    const chairs = new Set(getRoomWaitingAnchors(room, definition).map(pointKey));
    const doors = new Set(
      state.doors
        .filter((door) => door.roomId === room.id)
        .flatMap((door) => {
          const cells = getDoorCells(door, room, definition);
          return cells ? [pointKey(cells.inside)] : [];
        }),
    );
    const standingAnchors = getRoomStandingWaitingAnchors(room, definition);
    const candidates = [...standingAnchors, ...getRoomNavigableTiles(room, definition, state.doors)]
      .filter((point, index, all) => all.findIndex((candidate) => samePoint(candidate, point)) === index)
      .filter((point) => !chairs.has(pointKey(point)) && !doors.has(pointKey(point)) && !occupied.has(pointKey(point)))
      .sort((left, right) => left.y - right.y || left.x - right.x);
    for (const target of candidates) {
      const path = publicCompanionRoute(state, context, origin, target);
      if (path.length > 0) return { target: { ...target }, path };
    }
  }
  return null;
}

function setPeriopCompanionPublicRoute(
  state: GameState,
  actor: RetailExternalActorState,
  path: GridPoint[],
): void {
  actor.path = path.map((point) => ({ ...point }));
  actor.pathIndex = 0;
  actor.lastMovedAtFacilityTick = state.facilityTick;
}

/** Returns the companions created this tick; they first appear off-map. */
function ensureCompanions(state: GameState, context: DomainContext): Set<string> {
  const created = new Set<string>();
  for (const operation of state.serviceOperations) {
    if (operation.actorKind === "remote" || !companionLines.has(operation.incomeLineId) || operation.status === "completed" || operation.status === "cancelled") continue;
    if (state.retailExternalActors.some((actor) => actor.kind === "companion" &&
      (actor.linkedServiceOperationId === operation.id || operation.actorKind === "encounter" && actor.linkedEncounterId === operation.actorId))) continue;
    const id = `companion.${state.companionSequence++}`;
    if (isPeriopBedFlowOperation(operation) && COMPANION_VISIT_POLICIES[operation.incomeLineId as keyof typeof COMPANION_VISIT_POLICIES].kind === "procedure") {
      const start = streetArrivalPoint(state, context, id);
      if (!start) continue;
      const actor: RetailExternalActorState = { id, kind: "companion", displayName: createPatientDisplayName(state.campaignSeed, id, undefined, getPresentPatientDisplayNames(state)), appearance: createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state)), linkedServiceOperationId: operation.id, linkedEncounterId: operation.actorKind === "encounter" ? operation.actorId : null, lifecycle: "arriving", location: { ...start }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null, procedureCompanion: createProcedureCompanionState() };
      const periopPlan = planProcedureCompanionWait(state, context, actor, operation, (origin, target, roomId) => procedureCompanionRoute(state, context, origin, target, roomId));
      if (periopPlan) actor.procedureCompanion!.waitingReservation = periopPlan.reservation;
      const plan = periopPlan ?? choosePeriopCompanionPublicTarget(state, context, start, id);
      if (!start || !plan) continue;
      actor.path = plan.path;
      state.retailExternalActors.push(actor);
      created.add(id);
      continue;
    }
    // A patient's companion walks in from the street; a visitor's companion
    // starts beside the visitor, who is still off-map when it is created.
    const fromStreet = operation.actorKind === "encounter";
    const location = fromStreet ? streetArrivalPoint(state, context, id) : operation.location;
    if (!location) continue;
    state.retailExternalActors.push({ id, kind: "companion", displayName: createPatientDisplayName(state.campaignSeed, id, undefined, getPresentPatientDisplayNames(state)), appearance: createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state)), linkedServiceOperationId: operation.id, linkedEncounterId: operation.actorKind === "encounter" ? operation.actorId : null, lifecycle: fromStreet ? "arriving" : "onsite", location: { ...location }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
    created.add(id);
  }
  for (const encounter of Object.values(state.encounters)) {
    if (!encounter.pendingResult || !legacyCompanionRoutes.has(encounter.pendingResult.routeId) || !encounter.patientLocation || encounter.lifecycle !== "active_pending_result") continue;
    if (state.serviceOperations.some((operation) =>
      operation.actorKind === "encounter" &&
      operation.actorId === encounter.id &&
      operation.status !== "completed" &&
      operation.status !== "cancelled" &&
      isPeriopBedFlowOperation(operation),
    )) continue;
    if (state.retailExternalActors.some((actor) => actor.kind === "companion" && actor.linkedEncounterId === encounter.id)) continue;
    const id = `companion.${state.companionSequence++}`;
    const start = streetArrivalPoint(state, context, id);
    if (!start) continue;
    state.retailExternalActors.push({ id, kind: "companion", displayName: createPatientDisplayName(state.campaignSeed, id, undefined, getPresentPatientDisplayNames(state)), appearance: createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state)), linkedServiceOperationId: null, linkedEncounterId: encounter.id, lifecycle: "arriving", location: start, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
    created.add(id);
  }
  return created;
}

function advanceCompanions(state: GameState, context: DomainContext, createdThisTick: ReadonlySet<string> = new Set()): void {
  for (const actor of state.retailExternalActors.filter((candidate) => candidate.lifecycle !== "departed")) {
    if (actor.activeRetailOperationId) continue;
    const service = actor.linkedServiceOperationId ? state.serviceOperations.find((operation) => operation.id === actor.linkedServiceOperationId) : null;
    const encounter = actor.linkedEncounterId ? state.encounters[actor.linkedEncounterId] : null;
    if (service && advanceProcedureCompanion(state, context, actor, service, createdThisTick.has(actor.id),
      (origin, target, roomId) => procedureCompanionRoute(state, context, origin, target, roomId),
      (origin) => pathToExit(state, context, origin))) continue;
    const primaryDone = service ? service.status === "completed" || service.status === "cancelled" : actor.procedureCompanion ? true : encounter ? encounter.lifecycle !== "active_pending_result" : true;
    if (isPeriopBedFlowOperation(service) && !primaryDone) {
      const endpoint = actor.path.at(-1);
      const retainedPath = endpoint && actor.location && isPublicCompanionTarget(state, context, endpoint)
        ? publicCompanionRoute(state, context, actor.location, endpoint)
        : [];
      const plan = retainedPath.length > 0 && endpoint
        ? { target: endpoint, path: retainedPath }
        : actor.location
          ? choosePeriopCompanionPublicTarget(state, context, actor.location, actor.id)
          : null;
      if (!plan) continue;
      setPeriopCompanionPublicRoute(state, actor, plan.path);
      if (actor.pathIndex < actor.path.length - 1 && !createdThisTick.has(actor.id)) {
        const elapsed = Math.max(1, state.facilityTick - actor.lastMovedAtFacilityTick);
        actor.pathIndex = Math.min(
          actor.path.length - 1,
          actor.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick,
        );
        actor.location = actor.path[actor.pathIndex] ? { ...actor.path[actor.pathIndex]! } : actor.location;
        actor.lastMovedAtFacilityTick = state.facilityTick;
      }
      if (actor.pathIndex >= actor.path.length - 1 && actor.location) actor.lifecycle = "onsite";
      continue;
    }
    if (service?.actorKind === "visitor") {
      if (!primaryDone && service.location) {
        const route = actor.location
          ? service.location.y >= context.balanceRelease.facility.gridHeight
            ? pathServiceVisitorToOffscreenEndpoint(state, context, actor.location, service.location)
            : pathServiceVisitorFromCurrentLocation(state, context, actor.location, service.location)
          : [];
        const companionPathIndex = Math.min(1, Math.max(0, route.length - 1));
        const location = route[companionPathIndex] ?? actor.location ?? service.location;
        actor.lifecycle = "onsite";
        actor.path = route.map((point) => ({ ...point }));
        actor.pathIndex = companionPathIndex;
        actor.location = { ...location };
        actor.lastMovedAtFacilityTick = state.facilityTick;
        continue;
      }
      if (primaryDone && actor.lifecycle !== "departing") {
        const endpoint = service.visitorTravel?.offscreenEndpoint ?? null;
        actor.path = endpoint && actor.location
          ? pathServiceVisitorToOffscreenEndpoint(state, context, actor.location, endpoint)
          : [];
        actor.pathIndex = 0;
        actor.lastMovedAtFacilityTick = state.facilityTick;
        actor.lifecycle = "departing";
      }
    }
    const final = actor.path.at(-1);
    const completeExitPath = final && (final.x < 0 || final.x >= context.balanceRelease.facility.gridWidth) &&
      final.y >= context.balanceRelease.facility.gridHeight;
    if (primaryDone && (actor.lifecycle !== "departing" || !completeExitPath)) {
      const exitPath = actor.location ? pathToExit(state, context, actor.location) : [];
      if (actor.location && !exitPath.length) {
        actor.movementWaitReason = "Waiting for a connected exit route";
        continue;
      }
      actor.movementWaitReason = null;
      actor.path = exitPath;
      actor.pathIndex = 0;
      actor.lifecycle = "departing";
    } else if (!primaryDone) {
      const primaryLocation = service?.location ?? encounter?.patientLocation ?? null;
      if (primaryLocation && actor.location) {
        const arriving = actor.lifecycle === "arriving";
        let route = isStreetOrigin(state, context, actor.location)
          ? pathFromStreet(state, context, actor.location, primaryLocation, (entry) => facilityRoute(state, context, entry.inside, primaryLocation))
          : facilityRoute(state, context, actor.location, primaryLocation);
        // A patient inside a care room is not publicly reachable. An arriving
        // companion then waits in a public waiting area instead.
        if (!route.length && arriving) {
          route = choosePeriopCompanionPublicTarget(state, context, actor.location, actor.id)?.path ?? [];
        }
        // Walking in from the street uses the shared travel speed; once
        // beside the patient, the companion keeps its one-tile follow step.
        // A companion created this tick first appears at its off-map start,
        // like an arriving patient.
        const step = createdThisTick.has(actor.id)
          ? 0
          : arriving ? context.balanceRelease.facility.characterTravelTilesPerTick : 1;
        actor.path = route;
        actor.pathIndex = Math.min(Math.max(0, route.length - 2), step);
        actor.location = route[actor.pathIndex] ?? actor.location;
        actor.lastMovedAtFacilityTick = state.facilityTick;
        if (arriving && actor.pathIndex >= route.length - 2) actor.lifecycle = "onsite";
      }
    }
    if (actor.lifecycle === "departing") {
      if (actor.pathIndex < actor.path.length - 1) actor.pathIndex += 1;
      actor.location = actor.path[actor.pathIndex] ?? actor.location;
      if (!actor.path.length || actor.pathIndex >= actor.path.length - 1) { actor.lifecycle = "departed"; actor.location = null; }
    }
  }
}

export function advanceRetailOperations(state: GameState, context: DomainContext): void {
  reconcileProcedureCompanions(state);
  scheduleOptionalShopping(state, context);
  if (state.facilityTick >= state.nextExternalRetailOpportunityTick) {
    state.nextExternalRetailOpportunityTick = state.facilityTick + EXTERNAL_OPPORTUNITY_MINUTES;
    createExternalRetailVisitor(state, context);
  }
  const companionsCreatedThisTick = ensureCompanions(state, context);
  for (const operation of state.retailOperations) {
    if (terminal(operation)) continue;
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.retail) { cancelTrip(state, operation, "The product is no longer available.", context); continue; }
    if (preempted(state, operation)) { cancelTrip(state, operation, "Required work superseded optional shopping.", context); continue; }
    if (operation.status === "walking_to_outlet" || operation.status === "returning" || operation.status === "leaving") {
      if (operation.status === "leaving" && operation.path.length <= 1) {
        const retry = pathToExit(state, context, operation.location);
        if (retry.length > 1) {
          operation.path = retry;
          operation.pathIndex = 0;
          operation.lastMovedAtFacilityTick = state.facilityTick;
        } else {
          continue;
        }
      }
      advanceMovement(state, operation, context);
      if (operation.path.length && operation.pathIndex < operation.path.length - 1) continue;
      if (operation.status === "returning" || operation.status === "leaving") {
        if (operation.actorKind === "retail_visitor" &&
            operation.location.x >= 0 &&
            operation.location.x < context.balanceRelease.facility.gridWidth) {
          operation.path = [{ ...operation.location }];
          operation.pathIndex = 0;
          continue;
        }
        operation.status = operation.cancellationReason ? "abandoned" : "completed";
        operation.completedAtFacilityTick = state.facilityTick;
        const external = state.retailExternalActors.find((actor) => actor.id === operation.actorId);
        if (external) { external.activeRetailOperationId = null; if (operation.actorKind === "retail_visitor") { external.lifecycle = "departed"; external.location = null; } }
      } else { operation.status = "queued"; operation.waitDeadlineFacilityTick = state.facilityTick + QUEUE_ABANDON_MINUTES; }
      continue;
    }
    if (operation.status === "queued") {
      const outlet = state.rooms.find((room) => room.id === operation.outletRoomInstanceId);
      const repairAssigned = state.employees.some((employee) =>
        employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId === outlet?.id);
      const maintenanceUnavailable = outlet?.maintenance?.status === "out_of_service" ||
        outlet?.maintenance?.status === "due" && outlet.maintenance.outOfServiceAtFacilityTick !== null &&
          state.facilityTick >= outlet.maintenance.outOfServiceAtFacilityTick || repairAssigned;
      if (maintenanceUnavailable && outlet && !isRoomAvailableForNewFacilityWork(state, outlet.id, context)) {
        operation.resourceWaitReason = "Waiting for equipment repair.";
        operation.waitDeadlineFacilityTick = state.facilityTick + QUEUE_ABANDON_MINUTES;
        continue;
      }
      operation.resourceWaitReason = null;
      if (state.facilityTick >= operation.waitDeadlineFacilityTick) { cancelTrip(state, operation, "The outlet queue took longer than 10 minutes.", context); continue; }
      const ahead = state.retailOperations.some((candidate) => candidate.id !== operation.id && candidate.outletRoomInstanceId === operation.outletRoomInstanceId &&
        (candidate.status === "purchasing" || candidate.status === "queued" && (candidate.createdAtFacilityTick < operation.createdAtFacilityTick || candidate.createdAtFacilityTick === operation.createdAtFacilityTick && candidate.id.localeCompare(operation.id) < 0)));
      if (!ahead && isOutletStaffed(state, operation, context)) { operation.status = "purchasing"; operation.startedAtFacilityTick = state.facilityTick; operation.purchaseEndsAtFacilityTick = state.facilityTick + operation.outletDurationMinutes; }
      continue;
    }
    if (operation.status === "purchasing" && operation.purchaseEndsAtFacilityTick !== null && state.facilityTick >= operation.purchaseEndsAtFacilityTick) {
      if (!isOutletStaffed(state, operation, context)) { cancelTrip(state, operation, "The outlet could not fulfill the purchase.", context); continue; }
      if (!fulfill(state, operation, line, context)) { cancelTrip(state, operation, "The clinic could not procure the item.", context); continue; }
      operation.completedAtFacilityTick = state.facilityTick;
      beginReturn(state, operation, context);
    }
  }
  advanceCompanions(state, context, companionsCreatedThisTick);
}

/** Same chair rule as bathroom returns, for a patient walking back from a shop. */
export function redirectRetailReturn(
  state: GameState,
  encounterId: string,
  target: GridPoint,
  context: DomainContext,
): boolean {
  const operation = activeRetailOperationForActor(state, "encounter", encounterId);
  if (!operation || operation.status !== "returning" || operation.departureServiceOperationId) return false;
  const path = facilityRoute(state, context, operation.location, target);
  if (path.length === 0) return false;
  operation.returnLocation = { ...target };
  operation.path = path;
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  return true;
}

export function activeRetailOperationForActor(state: GameState, kind: RetailActorKind, actorId: string): RetailOperationState | null {
  return state.retailOperations.find((operation) => !terminal(operation) && operation.actorKind === kind && operation.actorId === actorId) ?? null;
}

export function cancelRetailTripsForActor(state: GameState, kind: RetailActorKind, actorId: string, reason: string): void {
  for (const operation of state.retailOperations) {
    if (!terminal(operation) && operation.actorKind === kind && operation.actorId === actorId) cancelTrip(state, operation, reason);
  }
}

export function cancelRetailOperationsForRoom(
  state: GameState,
  roomId: string,
  reason: string,
  context: DomainContext,
): void {
  for (const operation of state.retailOperations) {
    if (!terminal(operation) && operation.outletRoomInstanceId === roomId) {
      cancelTrip(state, operation, reason, context);
    }
  }
}

export function getPhysicallyPresentRetailExternalActors(state: GameState): RetailExternalActorState[] {
  return state.retailExternalActors.filter((actor) => actor.lifecycle !== "departed" && actor.location !== null);
}
