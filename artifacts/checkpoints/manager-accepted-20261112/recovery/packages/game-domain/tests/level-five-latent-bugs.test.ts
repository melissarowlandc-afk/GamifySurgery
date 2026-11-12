import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getDiagnosticOrderPlans, getPatientAmenityTrip,
  PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameState } from "../src";
import { replaceDiagnosticOrderPlan } from "../src/diagnostic-orders";
import { validateSavedGardenRest } from "../src/level-five-support";
import captured from "./fixtures/level-five-garden-offsite-overlap-20261017.json";

// Actual synthetic rebind-4 continuation, minute 112 / tick 15344. Retain the
// raw save independently of regenerated campaign checkpoints.
const encounterId = "encounter.auto.5.255";
const context = PROTOTYPE_DOMAIN_CONTEXT;
const rawState = () => structuredClone(captured) as unknown as GameState;
const canonical = (state: GameState) => deserializeGameState(serializeGameState(state), context);

describe("Level 5 garden and diagnostic movement ownership", () => {
  it("loads the captured overlapping save using the validated garden owner and requeues only the departure", () => {
    const raw = rawState(), encounter = raw.encounters[encounterId]!;
    const trip = getPatientAmenityTrip(raw, "encounter", encounterId)!;
    expect(trip.amenityKind).toBe("garden");
    if (trip.amenityKind !== "garden") throw new Error("Missing captured garden trip.");
    expect(raw.facilityTick).toBe(15344);
    expect(encounter.patientLocation).toEqual({ x: 37, y: 26 });
    expect(encounter.patientMovement!.path[encounter.patientMovement!.pathIndex]).toEqual({ x: 35, y: 28 });
    expect(validateSavedGardenRest(raw, trip)).toBe(true);

    const loaded = canonical(raw), restored = loaded.encounters[encounterId]!;
    expect(restored.patientLocation).toEqual(encounter.patientLocation);
    expect(restored.patientMovement).toBeNull();
    expect(getPatientAmenityTrip(loaded, "encounter", encounterId)).toEqual(trip);
    const plan = getDiagnosticOrderPlans(loaded).find(plan => plan.encounterId === encounterId)!;
    const expected = structuredClone(encounter.pendingResult!.diagnosticTiming!);
    const departure = expected.phases.find(phase => phase.kind === "patient_departure")!;
    departure.status = "queued"; departure.startedAtTick = null;
    expect(plan).toEqual(expected);
    expect(restored.steps[0]!.result!.diagnosticTiming).toEqual(expected);
    expect([loaded.facilityTick, loaded.cashCents, restored.patientSatisfaction, restored.gardenVisitBenefit])
      .toEqual([raw.facilityTick, raw.cashCents, encounter.patientSatisfaction, encounter.gardenVisitBenefit]);
    expect(canonical(loaded)).toEqual(loaded);
  });

  it.each(["live", "legacy reload"] as const)("finishes the garden return before starting offsite movement after %s", mode => {
    let state = rawState();
    if (mode === "legacy reload") state = canonical(state);
    else {
      // The same actual live state immediately before a departure can claim it.
      const encounter = state.encounters[encounterId]!;
      encounter.patientMovement = null;
      const plan = structuredClone(encounter.pendingResult!.diagnosticTiming!);
      const departure = plan.phases.find(phase => phase.kind === "patient_departure")!;
      departure.status = "pending"; departure.startedAtTick = null;
      replaceDiagnosticOrderPlan(encounter, plan);
    }
    state.paused = false;
    const returnTarget = getPatientAmenityTrip(state, "encounter", encounterId)!.returnTarget;
    let sawReturn = false, sawDeparture = false, leftMap = false;
    for (let minute = 0; minute < 60; minute++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `garden.departure.${mode}.${minute}` }, context);
      const encounter = state.encounters[encounterId]!, trip = getPatientAmenityTrip(state, "encounter", encounterId);
      if (trip) {
        sawReturn = true;
        expect(trip).toMatchObject({ status: "returning", returnRequested: true });
        expect(encounter.patientMovement).toBeNull();
        expect(encounter.patientLocation).toEqual(trip.path[trip.pathIndex]);
      }
      if (encounter.patientMovement?.kind === "departing_for_offsite_testing") {
        if (!sawDeparture) expect(encounter.patientMovement.path[0]).toEqual(returnTarget);
        sawDeparture = true;
        expect(trip).toBeNull();
      }
      expect(canonical(state).encounters[encounterId]!.patientLocation).toEqual(encounter.patientLocation);
      if (sawDeparture && encounter.patientLocation === null) { leftMap = true; break; }
    }
    expect([sawReturn, sawDeparture, leftMap]).toEqual([true, true, true]);
  });

  it.each(["location", "quote", "clock"] as const)("still rejects a malformed garden %s in the overlapping save", field => {
    const raw = rawState(), trip = getPatientAmenityTrip(raw, "encounter", encounterId)!;
    if (trip.amenityKind !== "garden") throw new Error("Missing captured garden trip.");
    if (field === "location") raw.encounters[encounterId]!.patientLocation = { x: 0, y: 0 };
    if (field === "quote") trip.gardenSatisfactionPoints = 10;
    if (field === "clock") trip.lastMovedAtFacilityTick = raw.facilityTick + 1;
    expect(() => canonical(raw)).toThrow(/garden rest contract/);
  });
});
