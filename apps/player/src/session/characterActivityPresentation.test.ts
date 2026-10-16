import { describe, expect, it } from "vitest";
import { createInitialGameState, type GameState } from "@gamify-surgery/game-domain";

import { characterRefFromKey } from "../facility/characterInspect";
import { describeFacilityCharacter } from "./characterActivityPresentation";

function stateWithPatient(): { state: GameState; id: string } {
  const state = createInitialGameState(undefined, { campaignId: "campaign.inspect", campaignSeed: "inspect", createdAtRealMs: 0 });
  const encounter = Object.values(state.encounters)[0]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 30, y: 28 };
  return { state, id: encounter.id };
}

describe("describeFacilityCharacter", () => {
  it("names the patient and says what they are waiting for", () => {
    const { state, id } = stateWithPatient();
    const encounter = state.encounters[id]!;
    encounter.checkInStatus = "awaiting_staff";
    expect(describeFacilityCharacter(state, { kind: "patient", id })).toEqual({
      name: `${encounter.patientDisplayName} · Patient`,
      activity: "Waiting to check in",
    });
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "waiting_unopened";
    expect(describeFacilityCharacter(state, { kind: "patient", id })?.activity).toBe("Waiting for clinician");
  });

  it("turns a pending label into a short wait, keeping acronyms", () => {
    const { state, id } = stateWithPatient();
    const encounter = state.encounters[id]!;
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_pending_result";
    encounter.pendingResult = { pendingLabel: "CT abdomen pending" } as NonNullable<typeof encounter.pendingResult>;
    expect(describeFacilityCharacter(state, { kind: "patient", id })?.activity).toBe("Waiting for CT abdomen");
    encounter.pendingResult = { pendingLabel: "Breast ultrasound pending" } as NonNullable<typeof encounter.pendingResult>;
    expect(describeFacilityCharacter(state, { kind: "patient", id })?.activity).toBe("Waiting for breast ultrasound");
  });

  it("describes a bathroom trip", () => {
    const { state, id } = stateWithPatient();
    state.patientAmenityTrips = [{
      version: "patient-amenity-trip.v1", id: "trip.0", actorKind: "encounter", actorId: id, amenityKind: "bathroom",
      bathroomRoomInstanceId: "bathroom", status: "walking_to_amenity", startedAtFacilityTick: 0,
      dwellEndsAtFacilityTick: null, returnRequested: false, returnTarget: { x: 30, y: 28 },
      path: [{ x: 30, y: 28 }, { x: 31, y: 28 }], pathIndex: 0, lastMovedAtFacilityTick: 0,
    }];
    expect(describeFacilityCharacter(state, { kind: "patient", id })?.activity).toBe("Walking to the bathroom");
  });

  it("describes the founder and returns null for someone who left", () => {
    const { state } = stateWithPatient();
    expect(describeFacilityCharacter(state, { kind: "founder", id: "founder" })?.name).toContain("Founder");
    expect(describeFacilityCharacter(state, { kind: "patient", id: "encounter.gone" })).toBeNull();
    expect(describeFacilityCharacter(state, { kind: "staff", id: "employee.gone" })).toBeNull();
  });
});

describe("characterRefFromKey", () => {
  it("maps scene container keys to characters", () => {
    expect(characterRefFromKey("character:founder")).toEqual({ kind: "founder", id: "founder" });
    expect(characterRefFromKey("character:staff:employee.1")).toEqual({ kind: "staff", id: "employee.1" });
    expect(characterRefFromKey("character:patient:encounter.a:b")).toEqual({ kind: "patient", id: "encounter.a:b" });
    expect(characterRefFromKey("character:retail-retail_visitor:shopper.1")).toEqual({ kind: "retail-visitor", id: "shopper.1" });
    expect(characterRefFromKey("character:retail-companion:c.1")).toEqual({ kind: "companion", id: "c.1" });
    expect(characterRefFromKey("approved:room:0:chair:1")).toBeNull();
  });
});
