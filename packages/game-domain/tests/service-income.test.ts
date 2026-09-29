import { describe, expect, it } from "vitest";
import { SECOND_TUTORIAL_CASE_ID } from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
  type PendingResult,
} from "../src";

let operationSequence = 0;

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `service-income.tick.${operationSequence++}`,
    });
  }
  return next;
}

function pendingIncomeState(
  overrides: Partial<PendingResult> & Pick<PendingResult, "routeId">,
): GameState {
  let state = createInitialGameState(undefined, {
    campaignId: `campaign.service-income.${operationSequence++}`,
    campaignSeed: "service-income",
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `service-income.admit.${operationSequence++}`,
    encounterId: "encounter.service-income",
    caseId: SECOND_TUTORIAL_CASE_ID,
    patientDisplayName: "Income Patient",
    arrivalClass: "tutorial",
  });
  const encounter = state.encounters["encounter.service-income"]!;
  expect(encounter.steps.length).toBeGreaterThan(1);
  const { routeId, ...remainingOverrides } = overrides;
  const pending: PendingResult = {
    operationId: `service-income.pending.${operationSequence++}`,
    gateId: "gate.service-income",
    originatingNodeIndex: 0,
    resultTypeId: "service.ultrasound",
    pendingLabel: "Result pending",
    resultNarrative: "Result returned.",
    routeId,
    routeDisplayName: "Frozen local route",
    scheduledAtTick: 0,
    serviceDurationTicks: overrides.dueTick ?? 5,
    durationTicks: overrides.dueTick ?? 5,
    dueTick: overrides.dueTick ?? 5,
    deliveredAtTick: null,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: null,
    patientRemainsOnsite: true,
    ...remainingOverrides,
  };
  encounter.lifecycle = "active_pending_result";
  encounter.currentNodeIndex = 0;
  encounter.pendingResult = pending;
  encounter.steps[0]!.status = "result_pending";
  encounter.steps[0]!.result = pending;
  encounter.steps[1]!.status = "locked";
  encounter.patientMovement = null;
  encounter.idleWaitingSinceTick = null;
  return state;
}

describe("service income accounting", () => {
  it("credits a frozen quote once after local work, before delayed report feedback", () => {
    let state = pendingIncomeState({
      routeId: "route.ultrasound.in_house",
      dueTick: 5,
      serviceIncomeEligible: true,
      serviceIncomeLineId: "income.ultrasound",
      serviceIncomeFee: 123,
      timingPhases: [
        { id: "phase.ultrasound.scan", durationTicks: 2, resourceBound: true, startsAtTick: 0, endsAtTick: 2 },
        { id: "phase.ultrasound.report", durationTicks: 3, resourceBound: false, startsAtTick: 2, endsAtTick: 5 },
      ],
    });
    const cashBefore = state.cash;
    state = advance(state, 1);
    expect(state.cash).toBe(cashBefore);
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 1);
    expect(state.cash).toBe(cashBefore + 123);
    expect(state.encounters["encounter.service-income"]!.lifecycle).toBe("active_pending_result");
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({
      incomeLineId: "income.ultrasound",
      routeId: "route.ultrasound.in_house",
      grossAmount: 123,
      netCashDelta: 123,
      completedAtFacilityTick: 2,
    });
    const transactionKey = state.serviceIncomeReceipts[0]!.transactionKey;
    state = advance(deserializeGameState(serializeGameState(state)), 3);
    expect(state.cash).toBe(cashBefore + 123);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).toEqual([transactionKey]);
    expect(state.encounters["encounter.service-income"]!.lifecycle).toBe("active_action_required");
  });

  it("waits through endoscopy recovery but not the external report phase", () => {
    let state = pendingIncomeState({
      routeId: "route.endoscopy.in_house",
      dueTick: 5,
      serviceIncomeEligible: true,
      serviceIncomeLineId: "income.endoscopy",
      serviceIncomeFee: 400,
      timingPhases: [
        { id: "phase.endoscopy.preparation", durationTicks: 1, resourceBound: true, startsAtTick: 0, endsAtTick: 1 },
        { id: "phase.endoscopy.procedure", durationTicks: 1, resourceBound: true, startsAtTick: 1, endsAtTick: 2 },
        { id: "phase.endoscopy.recovery", durationTicks: 1, resourceBound: true, startsAtTick: 2, endsAtTick: 3 },
        { id: "phase.endoscopy.return_and_report", durationTicks: 2, resourceBound: false, startsAtTick: 3, endsAtTick: 5 },
      ],
    });
    const cashBefore = state.cash;
    state = advance(state, 2);
    expect(state.cash).toBe(cashBefore);
    state = advance(state, 1);
    expect(state.cash).toBe(cashBefore + 400);
    expect(state.serviceIncomeReceipts[0]?.completedAtFacilityTick).toBe(3);
  });

  it("credits an unphased local route at result completion", () => {
    let state = pendingIncomeState({
      routeId: "route.xray.in_house",
      dueTick: 2,
      serviceIncomeEligible: true,
      serviceIncomeLineId: "income.xray",
      serviceIncomeFee: 90,
    });
    const cashBefore = state.cash;
    state = advance(state, 1);
    expect(state.cash).toBe(cashBefore);
    state = advance(state, 1);
    expect(state.cash).toBe(cashBefore + 90);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.encounters["encounter.service-income"]!.lifecycle).toBe("active_action_required");
  });

  it("does not backpay offsite or legacy pending work", () => {
    let offsite = pendingIncomeState({
      routeId: "route.ultrasound.outsourced",
      dueTick: 2,
    });
    const offsiteCash = offsite.cash;
    offsite = advance(offsite, 2);
    expect(offsite.cash).toBe(offsiteCash);
    expect(offsite.serviceIncomeReceipts).toEqual([]);

    let legacy = pendingIncomeState({
      routeId: "route.ultrasound.in_house",
      dueTick: 2,
    });
    const serialized = JSON.parse(serializeGameState(legacy)) as Record<string, unknown>;
    const rawEncounter = (serialized.encounters as Record<string, Record<string, unknown>>)["encounter.service-income"]!;
    const rawPending = rawEncounter.pendingResult as Record<string, unknown>;
    delete rawPending.serviceIncomeEligible;
    delete rawPending.serviceIncomeLineId;
    delete rawPending.serviceIncomeFee;
    legacy = deserializeGameState(JSON.stringify(serialized));
    const legacyCash = legacy.cash;
    legacy = advance(legacy, 2);
    expect(legacy.cash).toBe(legacyCash);
    expect(legacy.serviceIncomeReceipts).toEqual([]);
  });
});
