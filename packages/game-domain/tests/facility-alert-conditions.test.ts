import { describe, expect, it } from "vitest";
import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
  synchronizeFacilityOperationalAlertOccurrences,
} from "../src";

describe("durable operational alert conditions", () => {
  it("paces low-cash recurrences across a rolling operating day and survives reload", () => {
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
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash"),
    ).toHaveLength(1);

    const restored = deserializeGameState(serializeGameState(state));
    restored.facilityTick = 599;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    expect(
      restored.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash"),
    ).toHaveLength(1);

    restored.facilityTick = 600;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    const lowCashOccurrences =
      restored.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash",
      );
    expect(lowCashOccurrences).toHaveLength(2);
    expect(lowCashOccurrences[1]).toMatchObject({
      occurredAtFacilityTick: 600,
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

  it("paces inner-peace guidance from actual arrivals regardless of advertising or active patients", () => {
    const state = createInitialGameState();
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    first.resolutionReason = "completed";
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {
      ...JSON.parse(JSON.stringify(first)),
      id: SECOND_TUTORIAL_ENCOUNTER_ID,
      resolutionReason: "completed",
    };
    state.encounters["encounter.active"] = {
      ...JSON.parse(JSON.stringify(first)),
      id: "encounter.active",
      resolutionReason: null,
      lifecycle: "active_pending_result",
    };
    state.advertisingLevel = 1;
    state.alertHumor.lastPatientArrivalTick = 0;
    state.facilityTick = 60;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) =>
          candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(0);

    state.facilityTick = 61;
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

    state.facilityTick = 62;
    state.alertHumor.lastPatientArrivalTick = 62;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(occurrence?.resolvedAtFacilityTick).toBe(62);

    state.facilityTick = 123;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) => candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(1);

    state.facilityTick = 662;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) => candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(2);
  });
});
