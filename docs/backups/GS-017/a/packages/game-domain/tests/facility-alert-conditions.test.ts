import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
  synchronizeFacilityOperationalAlertOccurrences,
} from "../src";

describe("durable operational alert conditions", () => {
  it("resolves a low-cash row in place and creates a new occurrence on recurrence", () => {
    const state = createInitialGameState();
    state.cash = 50;
    state.cashCents = 5_000;

    synchronizeFacilityOperationalAlertOccurrences(state);
    const first = state.environment.facilityConditionOccurrences.find(
      (occurrence) => occurrence.conditionKey === "low_cash",
    );
    expect(first).toMatchObject({
      occurredAtFacilityTick: 0,
      resolvedAtFacilityTick: null,
      definitionId: "alert.finance.low-cash",
      priority: "action_required",
      target: {
        kind: "emergency_glp1",
        id: "emergency-glp1",
      },
    });

    state.facilityTick = 10;
    state.cash = 500;
    state.cashCents = 50_000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(first?.resolvedAtFacilityTick).toBe(10);

    state.facilityTick = 20;
    state.cash = 50;
    state.cashCents = 5_000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const lowCashOccurrences =
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash",
      );
    expect(lowCashOccurrences).toHaveLength(2);
    expect(lowCashOccurrences[1]).toMatchObject({
      occurredAtFacilityTick: 20,
      resolvedAtFacilityTick: null,
    });
    expect(lowCashOccurrences[1]?.id).not.toBe(first?.id);
  });

  it("uses a distinct no-cash occurrence and preserves frozen copy and target through reload", () => {
    const state = createInitialGameState();
    state.cash = 0;
    state.cashCents = 0;
    synchronizeFacilityOperationalAlertOccurrences(state);

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.environment.facilityConditionOccurrences.find(
        (occurrence) => occurrence.conditionKey === "no_cash",
      ),
    ).toMatchObject({
      definitionId: "alert.finance.no-cash",
      priority: "action_required",
      target: {
        kind: "emergency_glp1",
        id: "emergency-glp1",
      },
    });
    expect(
      restored.environment.facilityConditionOccurrences.some(
        (occurrence) => occurrence.conditionKey === "low_cash",
      ),
    ).toBe(false);
  });

  it("materializes and resolves advertising guidance without changing satisfaction keys", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    state.encounters = {};
    state.advertisingLevel = 0;
    state.nextRoutineArrivalTick = state.facilityTick + 60;
    synchronizeFacilityOperationalAlertOccurrences(state);

    const occurrence =
      state.environment.facilityConditionOccurrences.find(
        (candidate) =>
          candidate.conditionKey === "advertising_recommended",
      );
    expect(occurrence).toMatchObject({
      priority: "informational",
      target: {
        kind: "advertising",
        id: "advertising",
      },
    });

    state.facilityTick = 1;
    state.advertisingLevel = 1;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(occurrence?.resolvedAtFacilityTick).toBe(1);
  });
});
