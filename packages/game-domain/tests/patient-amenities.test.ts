import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advancePatientAmenityTrips,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getRoomDefinition,
  getRoomNavigationAnchor,
  isRoomOperationalForFacilityWork,
  requestPatientAmenityReturn,
  serializeGameState,
  tryStartPatientBathroomTrip,
  type GameState,
  type PendingResult,
} from "../src";

function amenityState(): { state: GameState; encounterId: string } {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.patient-amenities",
    campaignSeed: "patient-amenities",
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.facilityLevel = 1;
  state.paused = false;
  const front = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
  const bathroom = {
    id: "room.test.bathroom",
    roomDefinitionId: "room.bathroom",
    x: front.x + 5,
    y: front.y + 1,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  state.rooms.push(bathroom);
  state.doors.push({ id: "door.test.bathroom", roomId: bathroom.id, side: "west", offset: 1, exterior: false });
  const encounter = Object.values(state.encounters)[0]!;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: front.x + 4, y: front.y + 3 };
  encounter.assignedRoomInstanceId = front.id;
  encounter.waitingDestination = { roomInstanceId: front.id, location: { ...encounter.patientLocation }, kind: "standing" };
  state.openChartEncounterId = null;
  return { state, encounterId: encounter.id };
}

function tickAmenities(state: GameState, minutes: number): void {
  for (let minute = 0; minute < minutes; minute += 1) {
    state.facilityTick += 1;
    advancePatientAmenityTrips(state, PROTOTYPE_DOMAIN_CONTEXT);
  }
}

describe("patient bathroom amenities", () => {
  it("walks a checked-in waiter to one real bathroom and physically returns to the retained wait target", () => {
    const { state, encounterId } = amenityState();
    const origin = { ...state.encounters[encounterId]!.patientLocation! };
    expect(isRoomOperationalForFacilityWork(state, "room.test.bathroom", PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const reservation = JSON.parse(JSON.stringify(state.encounters[encounterId]!.waitingDestination));
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    expect(state.patientAmenityTrips).toHaveLength(1);
    expect(state.encounters[encounterId]!.waitingDestination).toEqual(reservation);
    for (let minute = 0; minute < 30 && state.patientAmenityTrips?.[0]?.status !== "using_amenity"; minute += 1) tickAmenities(state, 1);
    expect(state.patientAmenityTrips?.[0]?.status).toBe("using_amenity");
    expect(requestPatientAmenityReturn(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    tickAmenities(state, 30);
    expect(state.patientAmenityTrips).toEqual([]);
    expect(state.encounters[encounterId]!.patientLocation).toEqual(origin);
  });

  it("arbitrates bathroom capacity with the founder and another patient", () => {
    const { state, encounterId } = amenityState();
    const bathroom = state.rooms.find((room) => room.roomDefinitionId === "room.bathroom")!;
    const definition = getRoomDefinition(bathroom.roomDefinitionId)!;
    const endpoint = getRoomNavigationAnchor(bathroom, definition);
    state.environment.founderActivity = {
      kind: "visit_bathroom",
      targetId: `${bathroom.id}.${endpoint.x}.${endpoint.y}`,
      path: [{ ...state.environment.founderLocation }, endpoint],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 5,
    };
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(false);
    state.environment.founderActivity = null;
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const second = JSON.parse(JSON.stringify(state.encounters[encounterId]!)) as typeof state.encounters[string];
    second.id = "encounter.second-bathroom-waiter";
    state.encounters[second.id] = second;
    expect(tryStartPatientBathroomTrip(state, "encounter", second.id, PROTOTYPE_DOMAIN_CONTEXT)).toBe(false);
  });

  it("keeps automatic Founder idling out of a bathroom reserved by a patient trip", () => {
    const { state, encounterId } = amenityState();
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const front = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
    const frontDefinition = getRoomDefinition(front.roomDefinitionId)!;
    const desk = getRoomNavigationAnchor(front, frontDefinition, "staff");
    state.employees.push({
      id: "employee.amenity-reception", staffRoleDefinitionId: "staff.receptionist",
      displayName: "Reception", appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1,
      homeRoomInstanceId: front.id, location: desk, path: [desk], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
    });
    state.openChartEncounterId = encounterId;
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: encounterId,
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    const closed = gameReducer(state, { type: "CLOSE_CHART", operationId: "amenity.close", encounterId });
    expect(closed.environment.founderActivity?.kind).not.toBe("visit_bathroom");
    expect(closed.patientAmenityTrips).toHaveLength(1);
  });

  it("round-trips a valid trip and drops an invalid route without moving the patient", () => {
    const { state, encounterId } = amenityState();
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state.patientAmenityNextOpportunityTicks![`encounter:${encounterId}`] = Number.MAX_SAFE_INTEGER;
    tickAmenities(state, 1);
    const location = { ...state.encounters[encounterId]!.patientLocation! };
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.patientAmenityTrips).toHaveLength(1);
    expect(restored.encounters[encounterId]!.patientLocation).toEqual(location);
    restored.patientAmenityTrips![0]!.path = [{ x: 1, y: 1 }, { x: 4, y: 4 }];
    const invalid = deserializeGameState(serializeGameState(restored));
    expect(invalid.patientAmenityTrips).toEqual([]);
    expect(invalid.encounters[encounterId]!.patientLocation).toEqual(location);
  });

  it("returns from the current location when the bathroom becomes unavailable", () => {
    const { state, encounterId } = amenityState();
    const origin = { ...state.encounters[encounterId]!.patientLocation! };
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state.patientAmenityNextOpportunityTicks![`encounter:${encounterId}`] = Number.MAX_SAFE_INTEGER;
    tickAmenities(state, 1);
    state.rooms.find((room) => room.id === "room.test.bathroom")!.cleanliness = 0;
    tickAmenities(state, 30);
    expect(state.patientAmenityTrips).toEqual([]);
    expect(state.encounters[encounterId]!.patientLocation).toEqual(origin);
  });

  it("returns safely when the bathroom is removed after the outbound trip starts", () => {
    const { state, encounterId } = amenityState();
    const origin = { ...state.encounters[encounterId]!.patientLocation! };
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state.patientAmenityNextOpportunityTicks![`encounter:${encounterId}`] = Number.MAX_SAFE_INTEGER;
    const trip = state.patientAmenityTrips![0]!;
    const intermediate = trip.path[1] ?? trip.path[0]!;
    trip.pathIndex = Math.min(1, trip.path.length - 1);
    state.encounters[encounterId]!.patientLocation = { ...intermediate };
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.bathroom");
    state.doors = state.doors.filter((door) => door.roomId !== "room.test.bathroom");
    expect(requestPatientAmenityReturn(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    expect(state.patientAmenityTrips![0]).toMatchObject({ status: "returning" });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.patientAmenityTrips).toHaveLength(1);
    tickAmenities(restored, 30);
    expect(restored.patientAmenityTrips).toEqual([]);
    expect(restored.encounters[encounterId]!.patientLocation).toEqual(origin);
  });

  it("turns an open-chart request into a real bathroom return instead of teleporting", () => {
    const { state, encounterId } = amenityState();
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    tickAmenities(state, 1);
    const current = { ...state.encounters[encounterId]!.patientLocation! };
    const next = gameReducer(state, { type: "OPEN_CHART", operationId: "amenity.open", encounterId });
    expect(next.operationReceipts["amenity.open"]).toMatchObject({ status: "rejected" });
    expect(next.openChartEncounterId).toBeNull();
    expect(next.encounters[encounterId]!.patientLocation).toEqual(current);
    expect(next.patientAmenityTrips?.[0]).toMatchObject({ status: "returning", returnRequested: true });
  });

  it("delays an actionable result until the bathroom trip physically returns", () => {
    let { state, encounterId } = amenityState();
    const encounter = state.encounters[encounterId]!;
    const pending: PendingResult = {
      operationId: "amenity.pending", gateId: "amenity.gate", originatingNodeIndex: 0,
      resultTypeId: "service.test", pendingLabel: "Result pending", resultNarrative: "Ready",
      routeId: "route.test", routeDisplayName: "Test", scheduledAtTick: state.facilityTick,
      serviceDurationTicks: 0, durationTicks: 0, dueTick: state.facilityTick,
      deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null,
      patientTravel: null, externalProcessingOnly: true,
      localServiceOperation: {
        version: "pending-result-service-operation.v1", status: "external_processing",
        incomeLineId: "income.endoscopy", serviceOperationId: null, externalDurationTicks: 0,
      },
    };
    encounter.lifecycle = "active_pending_result";
    encounter.pendingResult = pending;
    encounter.steps[0]!.status = "result_pending";
    encounter.steps[0]!.result = pending;
    encounter.steps.push({
      ...encounter.steps[0]!, nodeIndex: 1, decisionNodeId: "amenity.followup",
      status: "locked", answer: null, result: null,
    });
    expect(tryStartPatientBathroomTrip(state, "encounter", encounterId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "amenity.result.tick" });
    expect(state.encounters[encounterId]!.pendingResult?.deliveredAtTick).toBeNull();
    expect(state.patientAmenityTrips?.[0]).toMatchObject({ returnRequested: true, status: "returning" });
    for (let minute = 0; minute < 30 && state.patientAmenityTrips?.length; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `amenity.result.return.${minute}` });
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "amenity.result.deliver" });
    expect(state.patientAmenityTrips).toEqual([]);
    expect(state.encounters[encounterId]!.pendingResult?.deliveredAtTick).not.toBeNull();
  });
});
