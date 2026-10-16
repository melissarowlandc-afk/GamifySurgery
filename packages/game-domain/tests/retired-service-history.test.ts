import { describe, expect, it } from "vitest";
import {
  RETAINED_FINISHED_RETAIL_RECORD_LIMIT,
  RETAINED_FINISHED_SERVICE_OPERATION_LIMIT,
  RETAINED_SERVICE_INCOME_RECEIPT_LIMIT,
  createInitialGameState,
  deserializeGameState,
  getFacilityProgressionStatus,
  getServiceIncomeTotalsCents,
  retireFinishedRetailHistory,
  retireFinishedServiceHistory,
  serializeGameState,
  type GameState,
  type ServiceIncomeReceipt,
  type ServiceOperationState,
} from "../src";

const DAY = 9 * 60;

function receipt(index: number, overrides: Partial<ServiceIncomeReceipt> = {}): ServiceIncomeReceipt {
  return {
    id: `receipt.fixture.${index}`,
    transactionKey: `income.retail.retail-operation.fixture-${index}.income.coffee`,
    incomeLineId: "income.coffee",
    catalogVersion: 1,
    routeId: null,
    actorKind: "employee",
    actorId: "employee.fixture",
    grossAmount: 3.5 + (index % 7) * 0.25,
    stockCost: 1.25,
    netCashDelta: 2.25 + (index % 7) * 0.25,
    completedAtFacilityTick: index,
    ...overrides,
  };
}

/** Only the fields finished-operation rules read; finished ops hold no resources. */
function finishedOperation(index: number, overrides: Partial<ServiceOperationState> = {}): ServiceOperationState {
  return {
    id: `service-operation.fixture.${index}`,
    incomeLineId: "income.minor_procedure_simple",
    actorKind: "visitor",
    actorId: `visitor.fixture.${index}`,
    displayName: `Visitor ${index}`,
    status: "completed",
    location: null,
    path: [],
    pathIndex: 0,
    phaseIndex: 1,
    completedAtFacilityTick: index,
    reservedRoomInstanceIds: [],
    reservedEmployeeIds: [],
    ...overrides,
  } as unknown as ServiceOperationState;
}

function grownCampaign(level: 2 | 3): GameState {
  const state = createInitialGameState();
  state.facilityLevel = level;
  state.facilityTick = 40 * DAY;
  state.serviceIncomeReceipts = Array.from({ length: 400 }, (_, index) => receipt(index));
  state.serviceOperations = Array.from({ length: 120 }, (_, index) => finishedOperation(index));
  return state;
}

function results(state: GameState) {
  return {
    totals: getServiceIncomeTotalsCents(state),
    requirements: getFacilityProgressionStatus(state).requirements,
  };
}

describe("retired service history", () => {
  it("keeps totals and Level 2 endoscopy milestones after old records retire", () => {
    const state = grownCampaign(2);
    // Old milestone sources: a visitor endoscopy operation and a patient receipt.
    state.serviceOperations[3] = finishedOperation(3, {
      incomeLineId: "income.endoscopy",
      phaseIndex: 2,
    });
    state.serviceIncomeReceipts[5] = receipt(5, {
      incomeLineId: "income.endoscopy",
      routeId: "route.endoscopy.in_house",
      actorKind: "patient",
    });
    const before = results(state);
    expect(before.requirements).toContainEqual(
      expect.objectContaining({ id: "progression.endoscopy_completion", met: true }),
    );

    retireFinishedServiceHistory(state);

    expect(state.serviceIncomeReceipts.length).toBeLessThan(400);
    expect(state.serviceIncomeReceipts.length).toBeGreaterThanOrEqual(RETAINED_SERVICE_INCOME_RECEIPT_LIMIT);
    expect(state.serviceOperations).toHaveLength(RETAINED_FINISHED_SERVICE_OPERATION_LIMIT);
    expect(state.serviceIncomeReceipts.some((candidate) => candidate.id === "receipt.fixture.5")).toBe(false);
    expect(state.serviceOperations.some((operation) => operation.id === "service-operation.fixture.3")).toBe(false);
    expect(results(state)).toEqual(before);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.retiredServiceHistory).toEqual(state.retiredServiceHistory);
    expect(getServiceIncomeTotalsCents(restored)).toEqual(before.totals);
  });

  it("keeps the Level 3 first ambulatory operation milestone", () => {
    const state = grownCampaign(3);
    state.serviceOperations[4] = finishedOperation(4, {
      incomeLineId: "income.ambulatory_operation",
    });
    const before = results(state);
    expect(before.requirements).toContainEqual(
      expect.objectContaining({ id: "progression.ambulatory_operation_completion", met: true }),
    );
    retireFinishedServiceHistory(state);
    expect(state.serviceOperations.some((operation) => operation.id === "service-operation.fixture.4")).toBe(false);
    expect(results(state)).toEqual(before);
  });

  it("keeps receipts that could be credited again or still await QI review", () => {
    const state = grownCampaign(3);
    state.retailOperations.push({
      id: "retail-operation.fixture-1",
      incomeLineId: "income.coffee",
      status: "purchasing",
    } as unknown as GameState["retailOperations"][number]);
    state.serviceIncomeReceipts[2] = receipt(2, {
      id: "receipt.fixture.ambulatory",
      incomeLineId: "income.ambulatory_operation",
      transactionKey: "income.service-operation.fixture.ambulatory",
    });
    retireFinishedServiceHistory(state);
    const ids = new Set(state.serviceIncomeReceipts.map((candidate) => candidate.id));
    expect(ids.has("receipt.fixture.1")).toBe(true);
    expect(ids.has("receipt.fixture.ambulatory")).toBe(true);
    expect(ids.has("receipt.fixture.0")).toBe(false);
  });

  it("keeps recent receipts and finished operations that live records still use", () => {
    const state = grownCampaign(2);
    state.serviceIncomeReceipts.push(receipt(9_999, { completedAtFacilityTick: state.facilityTick - 10 }));
    // A finished in-room location alone no longer pins an operation.
    state.serviceOperations[1] = finishedOperation(1, { location: { x: 4, y: 4 } });
    state.environment.founderActivity = {
      kind: "perform_service",
      targetId: "service-operation.fixture.2",
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      workMinutesRemaining: 1,
    } as GameState["environment"]["founderActivity"];
    retireFinishedServiceHistory(state);
    const operationIds = new Set(state.serviceOperations.map((operation) => operation.id));
    expect(operationIds.has("service-operation.fixture.1")).toBe(false);
    expect(operationIds.has("service-operation.fixture.2")).toBe(true);
    expect(state.serviceIncomeReceipts.some((candidate) => candidate.id === "receipt.fixture.9999")).toBe(true);
  });

  it("retires finished shopping trips and departed shoppers that nothing still uses", () => {
    const state = createInitialGameState();
    const trip = (index: number, status: string) => ({
      id: `retail-operation.${index}`, incomeLineId: "income.coffee", actorKind: "employee",
      actorId: "employee.fixture", status, authorizedOrderId: null,
    }) as unknown as GameState["retailOperations"][number];
    state.retailOperations = [
      ...Array.from({ length: 40 }, (_, index) => trip(index, index % 5 === 0 ? "cancelled" : "completed")),
      trip(40, "walking_to_outlet"),
    ];
    // A visitor's departure plan still links trip 3.
    state.serviceOperations = [{
      ...finishedOperation(1),
      departureItinerary: { version: "service-departure-itinerary.v1", status: "retail", choiceKind: "retail",
        selectedAtFacilityTick: 0, completedAtFacilityTick: null, linkedTripId: "retail-operation.3", retailIncomeLineId: "income.coffee" },
    } as ServiceOperationState];
    const shopper = (index: number, overrides: Partial<GameState["retailExternalActors"][number]> = {}) => ({
      id: `retail-visitor.${index}`, kind: "retail_visitor", displayName: `Shopper ${index}`,
      appearance: state.encounters[Object.keys(state.encounters)[0]!]!.patientAppearance,
      linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "departed", location: null,
      path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, activeRetailOperationId: null, ...overrides,
    }) as GameState["retailExternalActors"][number];
    const activeEncounterId = Object.keys(state.encounters)[0]!;
    state.encounters[activeEncounterId]!.lifecycle = "active_pending_result";
    state.retailExternalActors = [
      ...Array.from({ length: 30 }, (_, index) => shopper(index)),
      shopper(30, { id: "companion.guard", kind: "companion", linkedEncounterId: activeEncounterId }),
      shopper(31, { id: "retail-visitor.named", lifecycle: "departed" }),
      shopper(32, { id: "retail-visitor.onsite", lifecycle: "onsite", location: { x: 1, y: 1 } }),
      ...Array.from({ length: 12 }, (_, index) => shopper(100 + index)),
    ];
    state.serviceIncomeReceipts = [receipt(1, { actorKind: "retail_visitor", actorId: "retail-visitor.named" })];

    retireFinishedRetailHistory(state);

    const tripIds = new Set(state.retailOperations.map((operation) => operation.id));
    expect(tripIds.has("retail-operation.40")).toBe(true);
    expect(tripIds.has("retail-operation.3")).toBe(true);
    expect(tripIds.has("retail-operation.1")).toBe(false);
    expect(state.retailOperations.filter((operation) => operation.status !== "walking_to_outlet"))
      .toHaveLength(RETAINED_FINISHED_RETAIL_RECORD_LIMIT + 1);
    const actorIds = new Set(state.retailExternalActors.map((actor) => actor.id));
    expect(actorIds.has("companion.guard")).toBe(true);
    expect(actorIds.has("retail-visitor.named")).toBe(true);
    expect(actorIds.has("retail-visitor.onsite")).toBe(true);
    expect(actorIds.has("retail-visitor.0")).toBe(false);
    expect(actorIds.has("retail-visitor.111")).toBe(true);
  });
});
