import { SERVICE_INCOME_CATALOG, getServiceIncomeLine, type RetailOutletContract, type ServiceIncomeLine } from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance } from "./appearance";
import { getDoorCells } from "./doors";
import { encounterHasActiveServiceOperation, founderHasActiveServiceOperation, getActiveServiceOperationEmployeeIds, getClinicalResourceReservations } from "./service-operations";
import { deterministicInteger } from "./randomness";
import { getCurrentCapabilities, getRoomDefinition, isEmployeeOperational, isRoomOperationalForFacilityWork } from "./selectors";
import { findDeterministicFacilityPath, getOccupiedTiles, getRoomNavigationAnchor } from "./spatial";
import type { DomainContext, GameState, GridPoint, RetailActorKind, RetailExternalActorState, RetailOperationState } from "./types";

const DAY_MINUTES = 600;
const TRIP_COOLDOWN_MINUTES = 120;
const QUEUE_ABANDON_MINUTES = 10;
const EXTERNAL_OPPORTUNITY_MINUTES = 120;
const MAX_EXTERNAL_RETAIL_ACTORS = 2;
const MAX_OUTLET_QUEUE = 2;

const terminal = (operation: RetailOperationState): boolean =>
  operation.status === "completed" || operation.status === "abandoned" || operation.status === "cancelled";

const actorKey = (kind: RetailActorKind, id: string): string => `${kind}:${id}`;

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
  const internal = findDeterministicFacilityPath(entry.inside, target, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
  return internal.length ? [entry.outside, entry.inside, ...internal.slice(1)] : [];
}

function pathToExit(state: GameState, context: DomainContext, start: GridPoint): GridPoint[] {
  const entry = entrance(state, context);
  if (!entry) return [];
  const internal = findDeterministicFacilityPath(start, entry.inside, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
  return internal.length ? [...internal, entry.outside] : [];
}

function outletForLine(state: GameState, line: ServiceIncomeLine, context: DomainContext): { roomId: string; contract: RetailOutletContract; target: GridPoint; servingEmployeeId: string | null } | null {
  const capabilities = getCurrentCapabilities(state, context);
  const clinical = getClinicalResourceReservations(state, context);
  const serviceEmployees = getActiveServiceOperationEmployeeIds(state);
  for (const contract of line.retail?.outlets ?? []) {
    if (!contract.requiredCapabilityIds.every((id) => capabilities.has(id))) continue;
    const room = [...state.rooms]
      .filter((candidate) => candidate.roomDefinitionId === contract.roomDefinitionId && isRoomOperationalForFacilityWork(state, candidate.id, context))
      .sort((a, b) => a.id.localeCompare(b.id))[0];
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition) continue;
    const servingEmployee = contract.staffRoleDefinitionId ? state.employees
      .filter((employee) => employee.staffRoleDefinitionId === contract.staffRoleDefinitionId && employee.homeRoomInstanceId === room.id && !employee.facilityTask &&
        !clinical.employeeIds.has(employee.id) && !serviceEmployees.has(employee.id) &&
        !state.retailOperations.some((operation) => ["walking_to_outlet", "queued", "purchasing"].includes(operation.status) && operation.servingEmployeeId === employee.id) && isEmployeeOperational(state, employee.id, context))
      .sort((left, right) => left.id.localeCompare(right.id))[0] : null;
    if (contract.staffRoleDefinitionId && !servingEmployee) continue;
    return { roomId: room.id, contract, target: getRoomNavigationAnchor(room, definition, "primary"), servingEmployeeId: servingEmployee?.id ?? null };
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
  const clinical = getClinicalResourceReservations(state, context);
  if (kind === "employee") return Boolean(state.employees.some((employee) => employee.id === id && !employee.facilityTask && isEmployeeOperational(state, id, context) && !clinical.employeeIds.has(id) && !getActiveServiceOperationEmployeeIds(state).has(id) &&
    !state.retailOperations.some((operation) => ["walking_to_outlet", "queued", "purchasing"].includes(operation.status) && operation.servingEmployeeId === id) &&
    !state.environment.glp1AutomationSlots.some((slot) => slot.employeeId === id)));
  if (kind === "founder") return (state.environment.founderActivity === null || ["attend_encounter", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(state.environment.founderActivity.kind)) && !clinical.founderReserved && !founderHasActiveServiceOperation(state);
  if (kind === "encounter") return isWaitingEncounterEligible(state, id, line.retail?.category === "food_drink");
  if (kind === "service_visitor") {
    const actor = state.serviceOperations.find((operation) => operation.id === id);
    return Boolean(actor && actor.status === "waiting_for_resources" && actor.reservedRoomInstanceIds.length === 0 && !companionLines.has(actor.incomeLineId));
  }
  return Boolean(state.retailExternalActors.some((actor) => actor.id === id && actor.lifecycle !== "departed" && actor.activeRetailOperationId === null));
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

export function startRetailPurchase(
  state: GameState,
  lineId: string,
  kind: RetailActorKind,
  actorId: string,
  context: DomainContext,
  authorizedOrderId?: string,
): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.retail || line.kind !== "retail" || state.facilityLevel < line.minimumFacilityLevel) return null;
  const order = line.retail.category === "authorized_order" ? matchingOrder(state, authorizedOrderId, kind, actorId, lineId) : null;
  if (line.retail.category === "authorized_order" && !order) return null;
  if (!actorCanStart(state, kind, actorId, line, context) || !ledgerAllows(state, kind, actorId, line, Boolean(order))) return null;
  const outlet = outletForLine(state, line, context);
  const location = actorLocation(state, kind, actorId);
  const identity = actorIdentity(state, kind, actorId);
  if (!outlet || !location || !identity || (kind === "employee" && outlet.servingEmployeeId === actorId)) return null;
  const activeAtOutlet = state.retailOperations.filter((operation) => !terminal(operation) && operation.outletRoomInstanceId === outlet.roomId);
  if (activeAtOutlet.filter((operation) => operation.status === "queued" || operation.status === "walking_to_outlet").length >= MAX_OUTLET_QUEUE) return null;
  const path = kind === "retail_visitor" || kind === "service_visitor" ? pathFromEntrance(state, context, outlet.target) : findDeterministicFacilityPath(location, outlet.target, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
  if (!path.length) return null;
  const id = `retail-operation.${state.retailOperationSequence++}`;
  const operation: RetailOperationState = {
    id, incomeLineId: line.id, catalogVersion: 1, actorKind: kind, actorId, displayName: identity.displayName, appearance: identity.appearance,
    linkedServiceOperationId: kind === "service_visitor" ? actorId : kind === "companion" ? state.retailExternalActors.find((actor) => actor.id === actorId)?.linkedServiceOperationId ?? null : null,
    authorizedOrderId: order?.id ?? null, status: "walking_to_outlet", createdAtFacilityTick: state.facilityTick,
    waitDeadlineFacilityTick: state.facilityTick + QUEUE_ABANDON_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null,
    quoteGross: line.fee, quoteStockCost: line.retail.stockCost, outletRoomInstanceId: outlet.roomId,
    outletDurationMinutes: outlet.contract.durationMinutes, staffRoleDefinitionId: outlet.contract.staffRoleDefinitionId ?? null, servingEmployeeId: outlet.servingEmployeeId,
    location: { ...location }, returnLocation: kind === "retail_visitor" ? null : { ...location }, path, pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, purchaseEndsAtFacilityTick: null, cancellationReason: null,
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
    state.retailExternalActors.push({ id: actorId, kind: "retail_visitor", displayName: createPatientDisplayName(state.campaignSeed, actorId), appearance: createPatientPixelAppearance(state.campaignSeed, actorId), linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "arriving", location: { ...entry.outside }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
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

function fulfill(state: GameState, operation: RetailOperationState, line: ServiceIncomeLine): boolean {
  if (state.cashCents < operation.quoteStockCost * 100) return false;
  const transactionKey = `income.retail.${operation.id}.${operation.incomeLineId}`;
  if (state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === transactionKey)) return true;
  const founderConsumption = operation.actorKind === "founder";
  const cashDelta = founderConsumption ? -operation.quoteStockCost : operation.quoteGross - operation.quoteStockCost;
  state.cashCents += Math.round(cashDelta * 100);
  state.cash = state.cashCents / 100;
  const receiptActorKind = operation.actorKind === "encounter" ? "patient" : operation.actorKind === "service_visitor" ? "visitor" : operation.actorKind;
  state.serviceIncomeReceipts.push({ id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`, transactionKey, incomeLineId: operation.incomeLineId, catalogVersion: 1, routeId: null, actorKind: receiptActorKind, actorId: operation.actorId, grossAmount: founderConsumption ? 0 : operation.quoteGross, stockCost: operation.quoteStockCost, netCashDelta: cashDelta, completedAtFacilityTick: state.facilityTick });
  const order = operation.authorizedOrderId ? state.retailOrders.find((candidate) => candidate.id === operation.authorizedOrderId) : null;
  if (order) order.fulfilledQuantity += 1;
  updateLedger(state, operation, line);
  return true;
}

function beginReturn(state: GameState, operation: RetailOperationState, context: DomainContext): void {
  const external = state.retailExternalActors.find((actor) => actor.id === operation.actorId);
  if (operation.actorKind === "retail_visitor") {
    operation.path = pathToExit(state, context, operation.location);
    operation.status = "leaving";
    if (external) { external.lifecycle = "departing"; external.path = operation.path; external.pathIndex = 0; }
  } else if (operation.returnLocation) {
    operation.path = findDeterministicFacilityPath(operation.location, operation.returnLocation, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    operation.status = "returning";
  } else operation.status = "completed";
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
}

function advanceMovement(state: GameState, operation: RetailOperationState, context: DomainContext): void {
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
  const actor: RetailExternalActorState = { id, kind: "retail_visitor", displayName: createPatientDisplayName(state.campaignSeed, id), appearance: createPatientPixelAppearance(state.campaignSeed, id), linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "arriving", location: { ...entry.outside }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null };
  state.retailExternalActors.push(actor);
  const product = candidates[deterministicInteger(state.campaignSeed, "environment", `retail-product.${opportunity}`, candidates.length)]!;
  if (!startRetailPurchase(state, product.id, "retail_visitor", id, context)) actor.lifecycle = "departed";
}

function scheduleOptionalShopping(state: GameState, context: DomainContext): void {
  const actors: Array<{ kind: RetailActorKind; id: string }> = [
    ...state.employees.map((actor) => ({ kind: "employee" as const, id: actor.id })),
    ...Object.values(state.encounters).map((actor) => ({ kind: "encounter" as const, id: actor.id })),
    ...state.serviceOperations.filter((actor) => actor.actorKind === "visitor").map((actor) => ({ kind: "service_visitor" as const, id: actor.id })),
    ...state.retailExternalActors.filter((actor) => actor.kind === "companion").map((actor) => ({ kind: "companion" as const, id: actor.id })),
    { kind: "founder", id: "founder" },
  ];
  for (const actor of actors.sort((left, right) =>
    deterministicInteger(state.campaignSeed, "environment", `optional-priority.${left.kind}.${left.id}.${Math.floor(state.facilityTick / 30)}`, 1_000) -
    deterministicInteger(state.campaignSeed, "environment", `optional-priority.${right.kind}.${right.id}.${Math.floor(state.facilityTick / 30)}`, 1_000),
  )) {
    const key = actorKey(actor.kind, actor.id);
    const due = state.retailNextOpportunityTicks[key];
    if (due === undefined) {
      state.retailNextOpportunityTicks[key] = state.facilityTick + 1 + deterministicInteger(state.campaignSeed, "environment", `optional-first.${key}`, 30);
      continue;
    }
    if (due > state.facilityTick) continue;
    const candidates = SERVICE_INCOME_CATALOG.filter((line) => line.kind === "retail" && line.retail?.category !== "authorized_order" && state.facilityLevel >= line.minimumFacilityLevel &&
      actorCanStart(state, actor.kind, actor.id, line, context) && ledgerAllows(state, actor.kind, actor.id, line, false) && outletForLine(state, line, context));
    if (!candidates.length) { state.retailNextOpportunityTicks[key] = state.facilityTick + 15; continue; }
    const choice = candidates[deterministicInteger(state.campaignSeed, "environment", `optional-retail.${actor.kind}.${actor.id}.${state.facilityTick}`, candidates.length)]!;
    state.retailNextOpportunityTicks[key] = state.facilityTick + (startRetailPurchase(state, choice.id, actor.kind, actor.id, context) ? TRIP_COOLDOWN_MINUTES : 15);
  }
}

const companionLines = new Set(["income.endoscopy", "income.advanced_endoscopy", "income.ambulatory_operation", "income.ambulatory_operation_extended", "income.pediatric_consult", "income.minor_procedure_simple", "income.minor_procedure_complex", "income.cutaneous_lesion_biopsy", "income.skin_excisional_biopsy"]);
const legacyCompanionRoutes = new Set(["route.endoscopy.in_house", "route.endoscopy.eus-ercp-sampling.in_house"]);

function ensureCompanions(state: GameState): void {
  for (const operation of state.serviceOperations) {
    if (operation.actorKind === "remote" || !companionLines.has(operation.incomeLineId) || operation.status === "completed" || operation.status === "cancelled") continue;
    if (state.retailExternalActors.some((actor) => actor.kind === "companion" && actor.linkedServiceOperationId === operation.id)) continue;
    const id = `companion.${state.companionSequence++}`;
    const location = operation.location;
    if (!location) continue;
    state.retailExternalActors.push({ id, kind: "companion", displayName: createPatientDisplayName(state.campaignSeed, id), appearance: createPatientPixelAppearance(state.campaignSeed, id), linkedServiceOperationId: operation.id, linkedEncounterId: operation.actorKind === "encounter" ? operation.actorId : null, lifecycle: "onsite", location: { ...location }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
  }
  for (const encounter of Object.values(state.encounters)) {
    if (!encounter.pendingResult || !legacyCompanionRoutes.has(encounter.pendingResult.routeId) || !encounter.patientLocation || encounter.lifecycle !== "active_pending_result") continue;
    if (state.retailExternalActors.some((actor) => actor.kind === "companion" && actor.linkedEncounterId === encounter.id)) continue;
    const id = `companion.${state.companionSequence++}`;
    state.retailExternalActors.push({ id, kind: "companion", displayName: createPatientDisplayName(state.campaignSeed, id), appearance: createPatientPixelAppearance(state.campaignSeed, id), linkedServiceOperationId: null, linkedEncounterId: encounter.id, lifecycle: "onsite", location: { ...encounter.patientLocation }, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null });
  }
}

function advanceCompanions(state: GameState, context: DomainContext): void {
  for (const actor of state.retailExternalActors.filter((candidate) => candidate.kind === "companion" && candidate.lifecycle !== "departed")) {
    if (actor.activeRetailOperationId) continue;
    const service = actor.linkedServiceOperationId ? state.serviceOperations.find((operation) => operation.id === actor.linkedServiceOperationId) : null;
    const encounter = actor.linkedEncounterId ? state.encounters[actor.linkedEncounterId] : null;
    const primaryDone = service ? service.status === "completed" || service.status === "cancelled" : encounter ? encounter.lifecycle !== "active_pending_result" : true;
    if (primaryDone && actor.lifecycle !== "departing") {
      actor.path = actor.location ? pathToExit(state, context, actor.location) : [];
      actor.pathIndex = 0;
      actor.lifecycle = "departing";
    } else if (!primaryDone) {
      const primaryLocation = service?.location ?? encounter?.patientLocation ?? null;
      if (primaryLocation && actor.location) {
        const route = findDeterministicFacilityPath(actor.location, primaryLocation, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
        actor.path = route;
        actor.pathIndex = Math.min(Math.max(0, route.length - 2), 1);
        actor.location = route[actor.pathIndex] ?? actor.location;
        actor.lastMovedAtFacilityTick = state.facilityTick;
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
  scheduleOptionalShopping(state, context);
  if (state.facilityTick >= state.nextExternalRetailOpportunityTick) {
    state.nextExternalRetailOpportunityTick = state.facilityTick + EXTERNAL_OPPORTUNITY_MINUTES;
    createExternalRetailVisitor(state, context);
  }
  ensureCompanions(state);
  for (const operation of state.retailOperations) {
    if (terminal(operation)) continue;
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.retail) { cancelTrip(state, operation, "The product is no longer available.", context); continue; }
    if (preempted(state, operation)) { cancelTrip(state, operation, "Required work superseded optional shopping.", context); continue; }
    if (operation.status === "walking_to_outlet" || operation.status === "returning" || operation.status === "leaving") {
      advanceMovement(state, operation, context);
      if (operation.path.length && operation.pathIndex < operation.path.length - 1) continue;
      if (operation.status === "returning" || operation.status === "leaving") {
        operation.status = operation.cancellationReason ? "abandoned" : "completed";
        operation.completedAtFacilityTick = state.facilityTick;
        const external = state.retailExternalActors.find((actor) => actor.id === operation.actorId);
        if (external) { external.activeRetailOperationId = null; if (operation.actorKind === "retail_visitor") { external.lifecycle = "departed"; external.location = null; } }
      } else { operation.status = "queued"; operation.waitDeadlineFacilityTick = state.facilityTick + QUEUE_ABANDON_MINUTES; }
      continue;
    }
    if (operation.status === "queued") {
      if (state.facilityTick >= operation.waitDeadlineFacilityTick) { cancelTrip(state, operation, "The outlet queue took longer than 10 minutes.", context); continue; }
      const ahead = state.retailOperations.some((candidate) => candidate.id !== operation.id && candidate.outletRoomInstanceId === operation.outletRoomInstanceId &&
        (candidate.status === "purchasing" || candidate.status === "queued" && (candidate.createdAtFacilityTick < operation.createdAtFacilityTick || candidate.createdAtFacilityTick === operation.createdAtFacilityTick && candidate.id.localeCompare(operation.id) < 0)));
      if (!ahead && isOutletStaffed(state, operation, context)) { operation.status = "purchasing"; operation.startedAtFacilityTick = state.facilityTick; operation.purchaseEndsAtFacilityTick = state.facilityTick + operation.outletDurationMinutes; }
      continue;
    }
    if (operation.status === "purchasing" && operation.purchaseEndsAtFacilityTick !== null && state.facilityTick >= operation.purchaseEndsAtFacilityTick) {
      if (!isOutletStaffed(state, operation, context)) { cancelTrip(state, operation, "The outlet could not fulfill the purchase.", context); continue; }
      if (!fulfill(state, operation, line)) { cancelTrip(state, operation, "The clinic could not procure the item.", context); continue; }
      operation.completedAtFacilityTick = state.facilityTick;
      beginReturn(state, operation, context);
    }
  }
  advanceCompanions(state, context);
}

export function activeRetailOperationForActor(state: GameState, kind: RetailActorKind, actorId: string): RetailOperationState | null {
  return state.retailOperations.find((operation) => !terminal(operation) && operation.actorKind === kind && operation.actorId === actorId) ?? null;
}

export function cancelRetailTripsForActor(state: GameState, kind: RetailActorKind, actorId: string, reason: string): void {
  for (const operation of state.retailOperations) {
    if (!terminal(operation) && operation.actorKind === kind && operation.actorId === actorId) cancelTrip(state, operation, reason);
  }
}

export function getPhysicallyPresentRetailExternalActors(state: GameState): RetailExternalActorState[] {
  return state.retailExternalActors.filter((actor) => actor.lifecycle !== "departed" && actor.location !== null);
}
