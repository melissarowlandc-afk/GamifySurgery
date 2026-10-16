import { getServiceIncomeLine } from "@gamify-surgery/balance-config";

import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getDiagnosticOrderPlans } from "./diagnostic-timing";
import type {
  DomainContext,
  GameState,
  PendingResult,
  RetiredServiceHistory,
  ServiceIncomeReceipt,
  ServiceOperationState,
} from "./types";

/**
 * Income receipts and finished service operations used to accumulate for the
 * whole campaign and were cloned on every facility tick. Records that no rule
 * can read again are removed; their totals and milestones live on in
 * `retiredServiceHistory`, so every rule keeps its result.
 */
export const RETAINED_SERVICE_INCOME_RECEIPT_LIMIT = 50;
export const RETAINED_FINISHED_SERVICE_OPERATION_LIMIT = 10;

const isEndoscopyLine = (lineId: string) =>
  lineId === "income.endoscopy" || lineId === "income.advanced_endoscopy";
const isAmbulatoryOperationLine = (lineId: string) =>
  lineId === "income.ambulatory_operation" ||
  lineId === "income.ambulatory_operation_extended";

export function isEndoscopyCompletionReceipt(receipt: ServiceIncomeReceipt): boolean {
  return (
    isEndoscopyLine(receipt.incomeLineId) &&
    receipt.routeId !== null &&
    Boolean(getServiceIncomeLine(receipt.incomeLineId)?.eligibleRouteIds.includes(receipt.routeId))
  );
}

export function isAmbulatoryOperationReceipt(receipt: ServiceIncomeReceipt): boolean {
  return isAmbulatoryOperationLine(receipt.incomeLineId);
}

export function isCompletedEndoscopyOperation(operation: ServiceOperationState): boolean {
  if (operation.status === "cancelled" || !isEndoscopyLine(operation.incomeLineId)) {
    return false;
  }
  const phases = operation.frozenOperationPhases ??
    getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [];
  return phases.some((phase) => phase.roomDefinitionId === "room.endoscopy") &&
    phases.some((phase) => phase.roomDefinitionId === "room.periop_recovery") &&
    // `leaving` is the normal post-recovery sidewalk trip. Count the
    // completed episode there, rather than waiting for the visitor sprite to
    // leave the map; a legacy terminal completed operation is also valid.
    ((operation.completedAtFacilityTick !== null && operation.phaseIndex >= phases.length) ||
      operation.status === "completed");
}

export function isCompletedAmbulatoryOperation(operation: ServiceOperationState): boolean {
  return (
    isAmbulatoryOperationLine(operation.incomeLineId) &&
    operation.status !== "cancelled" &&
    operation.completedAtFacilityTick !== null
  );
}

const toCents = (amount: number) => Math.round(amount * 100);

/** Retired plus live receipt totals, in cents, for the economy panel. */
export function getServiceIncomeTotalsCents(state: Pick<GameState, "serviceIncomeReceipts" | "retiredServiceHistory">): {
  grossCents: number;
  stockCostCents: number;
  netCashDeltaCents: number;
} {
  const retired = state.retiredServiceHistory;
  const totals = {
    grossCents: retired?.grossCents ?? 0,
    stockCostCents: retired?.stockCostCents ?? 0,
    netCashDeltaCents: retired?.netCashDeltaCents ?? 0,
  };
  for (const receipt of state.serviceIncomeReceipts) {
    totals.grossCents += toCents(receipt.grossAmount);
    totals.stockCostCents += toCents(receipt.stockCost);
    totals.netCashDeltaCents += toCents(receipt.netCashDelta);
  }
  return totals;
}

function createRetiredServiceHistory(): RetiredServiceHistory {
  return {
    version: "retired-service-history.v1",
    retiredReceiptCount: 0,
    grossCents: 0,
    stockCostCents: 0,
    netCashDeltaCents: 0,
    endoscopyReceipt: false,
    ambulatoryOperationReceipt: false,
    retiredOperationCount: 0,
    endoscopyOperationCompleted: false,
    ambulatoryOperationCompleted: false,
  };
}

const terminalServiceOperation = (operation: ServiceOperationState) =>
  operation.status === "completed" || operation.status === "cancelled";

/**
 * Transaction keys whose source could still credit income. Each credit path
 * skips a key that already has a receipt, so these receipts must stay.
 */
function creditableTransactionKeys(state: GameState): Set<string> {
  const keys = new Set<string>();
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (pending && pending.deliveredAtTick === null && pending.serviceIncomeLineId) {
      keys.add(`income.${pending.operationId}.${pending.serviceIncomeLineId}`);
    }
  }
  for (const operation of state.serviceOperations) {
    if (!terminalServiceOperation(operation)) {
      keys.add(`income.service-operation.${operation.id}.${operation.incomeLineId}`);
    }
  }
  for (const operation of state.retailOperations) {
    if (
      operation.status !== "completed" &&
      operation.status !== "abandoned" &&
      operation.status !== "cancelled"
    ) {
      keys.add(`income.retail.${operation.id}.${operation.incomeLineId}`);
    }
  }
  return keys;
}

function addPendingResultOperationIds(
  ids: Set<string>,
  pending: PendingResult | null | undefined,
): void {
  if (!pending) return;
  if (pending.localServiceOperation?.serviceOperationId) {
    ids.add(pending.localServiceOperation.serviceOperationId);
  }
  if (pending.completedCareProvenance?.serviceOperationId) {
    ids.add(pending.completedCareProvenance.serviceOperationId);
  }
}

/** Every service operation id that a live record could still look up. */
function referencedServiceOperationIds(state: GameState): Set<string> {
  const ids = new Set<string>();
  const add = (id: string | null | undefined) => {
    if (id) ids.add(id);
  };
  for (const plan of getDiagnosticOrderPlans(state)) {
    for (const phase of plan.phases) {
      if (phase.status !== "completed" && phase.status !== "cancelled") add(phase.serviceOperationId);
    }
  }
  for (const encounter of Object.values(state.encounters)) {
    addPendingResultOperationIds(ids, encounter.pendingResult);
    add(encounter.testOnlyContinuation?.serviceOperationId);
    add(encounter.terminalTestOrder?.serviceOperationId);
    for (const component of encounter.stagedResultOrder?.components ?? []) {
      add(component.serviceOperationId);
    }
    addPendingResultOperationIds(ids, encounter.stagedResultOrder?.remainder);
  }
  for (const operation of state.retailOperations) {
    if (
      operation.status !== "completed" &&
      operation.status !== "abandoned" &&
      operation.status !== "cancelled"
    ) {
      add(operation.linkedServiceOperationId);
      add(operation.departureServiceOperationId);
      if (operation.actorKind === "service_visitor") add(operation.actorId);
    }
  }
  for (const trip of state.patientAmenityTrips ?? []) {
    add(trip.linkedServiceOperationId);
    if (trip.actorKind === "service_visitor") add(trip.actorId);
  }
  for (const actor of state.retailExternalActors) {
    if (actor.lifecycle !== "departed") add(actor.linkedServiceOperationId);
  }
  const environment = state.environment;
  add(environment.founderActivity?.targetId);
  add(environment.suspendedFounderActivity?.targetId);
  add(environment.pendingFounderConsult?.targetId);
  for (const employee of state.employees) add(employee.facilityTask?.targetId);
  return ids;
}

/** Map keys used by per-actor schedulers and ledgers for a removed actor. */
function deleteActorKeys(state: GameState, actorKey: string): void {
  delete state.retailNextOpportunityTicks[actorKey];
  delete state.retailActorLedgers[actorKey];
  if (state.patientAmenityNextOpportunityTicks) {
    delete state.patientAmenityNextOpportunityTicks[actorKey];
  }
}

export function retireFinishedServiceHistory(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): void {
  const history = state.retiredServiceHistory ?? createRetiredServiceHistory();
  let changed = false;

  // Receipts: keep the newest, every receipt whose source can still credit
  // income, every ambulatory receipt still awaiting its QI review, and
  // anything settled within the last operating day.
  if (state.serviceIncomeReceipts.length > RETAINED_SERVICE_INCOME_RECEIPT_LIMIT) {
    const creditable = creditableTransactionKeys(state);
    const reviewedReceiptIds = new Set(
      (state.levelThreeQiReviews ?? []).map((review) => review.receiptId),
    );
    const operatingDayMinutes =
      (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
    const newest = new Set(
      state.serviceIncomeReceipts
        .map((receipt, index) => ({ receipt, index }))
        .sort((left, right) =>
          right.receipt.completedAtFacilityTick - left.receipt.completedAtFacilityTick ||
          right.index - left.index,
        )
        .slice(0, RETAINED_SERVICE_INCOME_RECEIPT_LIMIT)
        .map(({ receipt }) => receipt),
    );
    const kept: ServiceIncomeReceipt[] = [];
    for (const receipt of state.serviceIncomeReceipts) {
      const retire =
        !newest.has(receipt) &&
        !creditable.has(receipt.transactionKey) &&
        (!isAmbulatoryOperationReceipt(receipt) || reviewedReceiptIds.has(receipt.id)) &&
        state.facilityTick - receipt.completedAtFacilityTick >= operatingDayMinutes;
      if (!retire) {
        kept.push(receipt);
        continue;
      }
      history.retiredReceiptCount += 1;
      history.grossCents += toCents(receipt.grossAmount);
      history.stockCostCents += toCents(receipt.stockCost);
      history.netCashDeltaCents += toCents(receipt.netCashDelta);
      history.endoscopyReceipt ||= isEndoscopyCompletionReceipt(receipt);
      history.ambulatoryOperationReceipt ||= isAmbulatoryOperationReceipt(receipt);
      changed = true;
    }
    state.serviceIncomeReceipts = kept;
  }

  // Finished operations: keep the newest few and anything a live record
  // still references. A finished operation's last location is never read.
  const finished = state.serviceOperations.filter(terminalServiceOperation);
  if (finished.length > RETAINED_FINISHED_SERVICE_OPERATION_LIMIT) {
    const referenced = referencedServiceOperationIds(state);
    const receiptVisitorIds = new Set(
      state.serviceIncomeReceipts
        .filter((receipt) => receipt.actorKind === "visitor")
        .map((receipt) => receipt.actorId),
    );
    const finishedTick = (operation: ServiceOperationState) =>
      operation.completedAtFacilityTick ?? operation.cancelledAtFacilityTick ?? operation.startedAtFacilityTick ?? 0;
    const newest = new Set(
      [...finished]
        .sort((left, right) =>
          finishedTick(right) - finishedTick(left) || right.id.localeCompare(left.id),
        )
        .slice(0, RETAINED_FINISHED_SERVICE_OPERATION_LIMIT),
    );
    const removed = new Set<ServiceOperationState>();
    for (const operation of finished) {
      if (
        newest.has(operation) ||
        referenced.has(operation.id) ||
        receiptVisitorIds.has(operation.actorId)
      ) {
        continue;
      }
      removed.add(operation);
      history.retiredOperationCount += 1;
      history.endoscopyOperationCompleted ||= isCompletedEndoscopyOperation(operation);
      history.ambulatoryOperationCompleted ||= isCompletedAmbulatoryOperation(operation);
      if (operation.actorKind === "visitor") deleteActorKeys(state, `service_visitor:${operation.id}`);
    }
    if (removed.size > 0) {
      state.serviceOperations = state.serviceOperations.filter((operation) => !removed.has(operation));
      changed = true;
    }
  }

  if (changed) state.retiredServiceHistory = history;
}

export const RETAINED_FINISHED_RETAIL_RECORD_LIMIT = 10;

const terminalRetailOperation = (operation: GameState["retailOperations"][number]) =>
  operation.status === "completed" ||
  operation.status === "abandoned" ||
  operation.status === "cancelled";

/**
 * Removes finished shopping trips, departed outside shoppers and companions,
 * and fully used retail orders. No rule totals finished retail records:
 * spending limits and cooldowns live in the per-actor ledgers, and income in
 * receipts. Records that a live record can still look up are kept.
 */
export function retireFinishedRetailHistory(state: GameState): void {
  const operations = state.retailOperations;
  const finishedOperations = operations.filter(terminalRetailOperation);
  if (finishedOperations.length > RETAINED_FINISHED_RETAIL_RECORD_LIMIT) {
    const newest = new Set(finishedOperations.slice(-RETAINED_FINISHED_RETAIL_RECORD_LIMIT));
    const linkedTripIds = new Set<string>();
    for (const operation of state.serviceOperations) {
      if (operation.departureItinerary?.linkedTripId) {
        linkedTripIds.add(operation.departureItinerary.linkedTripId);
      }
    }
    for (const actor of state.retailExternalActors) {
      if (actor.activeRetailOperationId) linkedTripIds.add(actor.activeRetailOperationId);
    }
    state.retailOperations = operations.filter((operation) =>
      !terminalRetailOperation(operation) ||
      newest.has(operation) ||
      linkedTripIds.has(operation.id),
    );
  }

  const departed = state.retailExternalActors.filter((actor) => actor.lifecycle === "departed");
  if (departed.length > RETAINED_FINISHED_RETAIL_RECORD_LIMIT) {
    const newest = new Set(departed.slice(-RETAINED_FINISHED_RETAIL_RECORD_LIMIT));
    const activeActorIds = new Set(
      state.retailOperations
        .filter((operation) => !terminalRetailOperation(operation))
        .map((operation) => operation.actorId),
    );
    // Receipt labels in the economy panel name these shoppers.
    const receiptActorIds = new Set(
      state.serviceIncomeReceipts
        .filter((receipt) => receipt.actorKind === "retail_visitor" || receipt.actorKind === "companion")
        .map((receipt) => receipt.actorId),
    );
    // A departed companion is what stops a second companion being created
    // for the same patient while that patient can still be active.
    const companionStillGuardsEncounter = (encounterId: string | null) => {
      if (!encounterId) return false;
      const lifecycle = state.encounters[encounterId]?.lifecycle;
      return lifecycle !== undefined && lifecycle !== "resolved" && lifecycle !== "resolved_summary_available";
    };
    // A saved visitor companion can also be the only duplicate guard for an
    // active frozen service visit. Keep that guard until the visit finishes.
    const activeServiceOperationIds = new Set(state.serviceOperations
      .filter((operation) => operation.status !== "completed" && operation.status !== "cancelled")
      .map((operation) => operation.id));
    const removed = new Set(departed.filter((actor) =>
      !newest.has(actor) &&
      !activeActorIds.has(actor.id) &&
      !receiptActorIds.has(actor.id) &&
      !(actor.kind === "companion" && actor.linkedServiceOperationId && activeServiceOperationIds.has(actor.linkedServiceOperationId)) &&
      !companionStillGuardsEncounter(actor.linkedEncounterId),
    ));
    if (removed.size > 0) {
      state.retailExternalActors = state.retailExternalActors.filter((actor) => !removed.has(actor));
      for (const actor of removed) deleteActorKeys(state, `${actor.kind}:${actor.id}`);
    }
  }

  if (state.retailOrders.length > RETAINED_FINISHED_RETAIL_RECORD_LIMIT) {
    const authorizedOrderIds = new Set(
      state.retailOperations
        .filter((operation) => !terminalRetailOperation(operation))
        .flatMap((operation) => operation.authorizedOrderId ? [operation.authorizedOrderId] : []),
    );
    const usedUp = state.retailOrders.filter((order) =>
      order.fulfilledQuantity >= order.allowance && !authorizedOrderIds.has(order.id),
    );
    const removable = new Set(usedUp.slice(0, Math.max(0, usedUp.length - RETAINED_FINISHED_RETAIL_RECORD_LIMIT)));
    if (removable.size > 0) {
      state.retailOrders = state.retailOrders.filter((order) => !removable.has(order));
    }
  }
}

export function normalizeRetiredServiceHistory(
  value: unknown,
): RetiredServiceHistory | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const parsed = value as Partial<Record<keyof RetiredServiceHistory, unknown>>;
  if (parsed.version !== "retired-service-history.v1") return undefined;
  const count = (candidate: unknown) =>
    typeof candidate === "number" && Number.isSafeInteger(candidate) && candidate >= 0
      ? candidate
      : 0;
  const cents = (candidate: unknown) =>
    typeof candidate === "number" && Number.isSafeInteger(candidate) ? candidate : 0;
  return {
    version: "retired-service-history.v1",
    retiredReceiptCount: count(parsed.retiredReceiptCount),
    grossCents: cents(parsed.grossCents),
    stockCostCents: cents(parsed.stockCostCents),
    netCashDeltaCents: cents(parsed.netCashDeltaCents),
    endoscopyReceipt: parsed.endoscopyReceipt === true,
    ambulatoryOperationReceipt: parsed.ambulatoryOperationReceipt === true,
    retiredOperationCount: count(parsed.retiredOperationCount),
    endoscopyOperationCompleted: parsed.endoscopyOperationCompleted === true,
    ambulatoryOperationCompleted: parsed.ambulatoryOperationCompleted === true,
  };
}
