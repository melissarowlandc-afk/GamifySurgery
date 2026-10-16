import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  findCareAwareFacilityPath,
  gameReducer,
  getEncounterPatientLocation,
  getFrozenPatientTravelLocation,
  getRoomCareAnchor,
  getRoomDefinition,
  getRoomNavigableTiles,
  pathEntersUnauthorizedProtectedRoom,
  protectedCareRoomAtPoint,
  serializeGameState,
  type EncounterState,
  type FrozenPatientTravel,
  type PendingResult,
} from "../src";

function pendingWithTravel(
  encounter: EncounterState,
  travel: FrozenPatientTravel,
  overrides: Partial<PendingResult> = {},
): PendingResult {
  return {
    operationId: `result.${encounter.id}`,
    gateId: `gate.${encounter.id}`,
    originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: "service.xray",
    pendingLabel: "Frozen test pending",
    resultNarrative: "Frozen result",
    routeId: "route.xray.in_house",
    routeDisplayName: "Onsite X-ray",
    scheduledAtTick: 0,
    serviceDurationTicks: 10,
    durationTicks: travel.returnArrivalTick,
    dueTick: travel.returnArrivalTick,
    deliveredAtTick: null,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: travel,
    timingPhases: [],
    resourceReservations: [],
    imagingTechnicianId: null,
    phlebotomistId: null,
    providerReservation: null,
    ...overrides,
  };
}

function fixture() {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.care-access",
    campaignSeed: "care-access",
    createdAtRealMs: 0,
  });
  state.rooms.push(
    {
      id: "room.test.protected-exam",
      roomDefinitionId: "room.examination",
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.public-hall",
      roomDefinitionId: "room.hallway",
      x: 21,
      y: 22,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
  );
  state.doors.push({
    id: "door.test.protected-exam",
    roomId: "room.test.protected-exam",
    side: "south",
    offset: 1,
    exterior: false,
  });
  const room = state.rooms.find((candidate) => candidate.id === "room.test.protected-exam")!;
  const definition = getRoomDefinition(room.roomDefinitionId, PROTOTYPE_DOMAIN_CONTEXT)!;
  const start = getRoomCareAnchor(room, definition, "patient");
  const otherInterior = getRoomNavigableTiles(room, definition, state.doors)
    .find((point) => point.x !== start.x || point.y !== start.y)!;
  return { state, room, start, otherInterior, hall: { x: 21, y: 22 } };
}

function addWaitingIncoming(
  state: ReturnType<typeof createInitialGameState>,
  hall: { x: number; y: number },
) {
  const sample = Object.values(createInitialGameState().encounters)[0]!;
  const incoming = JSON.parse(JSON.stringify(sample)) as typeof sample;
  incoming.id = "incoming";
  incoming.checkInStatus = "checked_in";
  incoming.lifecycle = "waiting_unopened";
  incoming.assignedRoomInstanceId = null;
  incoming.queuedCareRoomInstanceId = null;
  incoming.patientLocation = { ...hall };
  incoming.patientMovement = null;
  incoming.waitingDestination = null;
  incoming.steps.forEach((step, index) => {
    step.status = index === incoming.currentNodeIndex ? "action_required" :
      index < incoming.currentNodeIndex ? "completed" : "locked";
  });
  state.encounters.incoming = incoming;
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderLocation = { ...hall };
  state.environment.founderActivity = null;
  return gameReducer(state, {
    type: "OPEN_CHART",
    operationId: `care-access.open-incoming.${state.facilityTick}`,
    encounterId: incoming.id,
  });
}

describe("protected care-room path access", () => {
  it("denies an unrelated destination inside a patient room, including same-room loitering", () => {
    const { state, room, start, otherInterior } = fixture();
    expect(findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      start,
      otherInterior,
    )).toEqual([]);
    expect(findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      start,
      otherInterior,
      new Set([room.id]),
    ).at(-1)).toEqual(otherInterior);
  });

  it("allows legacy egress while identifying an old route that remains in the protected room", () => {
    const { state, start, otherInterior, hall } = fixture();
    const egress = findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      start,
      hall,
    );
    expect(egress.at(-1)).toEqual(hall);
    expect(pathEntersUnauthorizedProtectedRoom(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      egress,
      0,
    )).toBe(false);
    expect(pathEntersUnauthorizedProtectedRoom(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      [start, otherInterior],
      0,
    )).toBe(true);

    state.environment.founderLocation = { ...start };
    state.environment.founderActivity = {
      kind: "wander_facility",
      targetId: "legacy.protected-loiter",
      path: [start, otherInterior],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 5,
    };
    const reconciled = gameReducer(state, {
      type: "ADVANCE_TICK",
      operationId: "care-access.reconcile-legacy-founder",
    });
    expect(protectedCareRoomAtPoint(
      reconciled,
      PROTOTYPE_DOMAIN_CONTEXT,
      reconciled.environment.founderLocation,
    )).toBeNull();
    expect(reconciled.environment.founderActivity?.path.at(-1)).not.toEqual(otherInterior);
  });

  it("holds a single-patient room until the outgoing patient physically clears it", () => {
    const { state, room, start, hall } = fixture();
    const sample = Object.values(createInitialGameState().encounters)[0]!;
    state.encounters = {
      outgoing: {
        ...JSON.parse(JSON.stringify(sample)),
        id: "outgoing",
        lifecycle: "resolved",
        resolutionReason: "completed",
        assignedRoomInstanceId: room.id,
        patientLocation: start,
        patientMovement: {
          kind: "leaving_after_resolution",
          path: [start, hall],
          pathIndex: 0,
          lastMovedAtFacilityTick: state.facilityTick,
          destinationRoomInstanceId: null,
        },
      },
    };
    const occupied = addWaitingIncoming(state, hall);
    expect(occupied.operationReceipts["care-access.open-incoming.0"]?.status).toBe("applied");
    expect(occupied.openChartEncounterId).toBe("incoming");
    expect(occupied.encounters.incoming).toMatchObject({
      assignedRoomInstanceId: null,
      queuedCareRoomInstanceId: null,
      patientMovement: null,
    });

    delete state.encounters.incoming;
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state.encounters.outgoing!.patientLocation = { ...hall };
    state.encounters.outgoing!.patientMovement = {
      kind: "leaving_after_resolution",
      path: [{ ...hall }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      destinationRoomInstanceId: null,
    };
    const cleared = addWaitingIncoming(state, hall);
    expect(cleared.encounters.incoming).toMatchObject({
      patientMovement: { destinationRoomInstanceId: room.id },
    });
  });

  it("holds an Examination Room for a patient whose frozen service path is still visibly inside", () => {
    const { state, room, start, hall } = fixture();
    const sample = Object.values(createInitialGameState().encounters)[0]!;
    const outgoing = JSON.parse(JSON.stringify(sample)) as typeof sample;
    outgoing.id = "frozen-outgoing";
    outgoing.lifecycle = "active_pending_result";
    outgoing.assignedRoomInstanceId = null;
    outgoing.queuedCareRoomInstanceId = null;
    outgoing.patientLocation = { ...hall };
    outgoing.patientMovement = null;
    (outgoing as typeof outgoing & { pendingResult: unknown }).pendingResult = {
      operationId: "result.frozen-outgoing",
      gateId: "gate.frozen-outgoing",
      originatingNodeIndex: outgoing.currentNodeIndex,
      resultTypeId: "service.xray",
      pendingLabel: "Frozen test pending",
      resultNarrative: "Frozen result",
      routeId: "route.xray.in_house",
      routeDisplayName: "Onsite X-ray",
      scheduledAtTick: 0,
      serviceDurationTicks: 10,
      durationTicks: 11,
      dueTick: 11,
      deliveredAtTick: null,
      offsiteReturnStartedAtTick: null,
      offsiteTravel: null,
      patientTravel: {
        version: "patient-travel.v1",
        originRoomInstanceId: "room.test.public-hall",
        destinationRoomInstanceId: room.id,
        outboundPath: [hall, start],
        returnPath: [start, hall],
        tilesPerTick: 1,
        outboundStartTick: 0,
        outboundArrivalTick: 1,
        serviceCompletionTick: 10,
        returnArrivalTick: 11,
      },
      timingPhases: [],
      resourceReservations: [],
      imagingTechnicianId: null,
      phlebotomistId: null,
      providerReservation: null,
    };
    state.facilityTick = 5;
    state.encounters = { "frozen-outgoing": outgoing };
    const occupied = addWaitingIncoming(state, hall);
    expect(occupied.encounters.incoming).toMatchObject({
      queuedCareRoomInstanceId: null,
      patientMovement: null,
    });
  });

  it("repairs frozen travel from its projected tile and preserves completed work and history", () => {
    const makeEncounter = () => {
      const sample = Object.values(createInitialGameState().encounters)[0]!;
      const encounter = JSON.parse(JSON.stringify(sample)) as typeof sample;
      encounter.id = "saved-route";
      encounter.checkInStatus = "checked_in";
      encounter.lifecycle = "active_pending_result";
      encounter.assignedRoomInstanceId = null;
      encounter.queuedCareRoomInstanceId = null;
      encounter.waitingDestination = null;
      while (encounter.frozenCase.decisionNodes.length <= encounter.currentNodeIndex + 2) {
        const sourceNode = encounter.frozenCase.decisionNodes.at(-1)!;
        encounter.frozenCase.decisionNodes.push({
          ...JSON.parse(JSON.stringify(sourceNode)),
          id: `${sourceNode.id}.care-access-followup.${encounter.frozenCase.decisionNodes.length}`,
        });
      }
      while (encounter.steps.length <= encounter.currentNodeIndex + 2) {
        const node = encounter.frozenCase.decisionNodes[encounter.steps.length]!;
        encounter.steps.push({
          ...JSON.parse(JSON.stringify(encounter.steps.at(-1)!)),
          decisionNodeId: node.id,
          status: "locked",
          result: null,
        });
      }
      return encounter;
    };
    const withUnrelatedRoom = () => {
      const built = fixture();
      built.state.rooms.push({
        id: "room.test.unrelated-exam", roomDefinitionId: "room.examination",
        x: 25, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
      });
      for (let y = 23; y <= 28; y += 1) {
        built.state.rooms.push({
          id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway",
          x: 21, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
        });
      }
      for (let x = 22; x <= 32; x += 1) {
        built.state.rooms.push({
          id: `room.test.hall.horizontal.${x}`, roomDefinitionId: "room.hallway",
          x, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
        });
      }
      return built;
    };

    const outboundFixture = withUnrelatedRoom();
    const outbound = makeEncounter();
    const outboundOrigin = { x: 21, y: 28 };
    const legalOutbound = findCareAwareFacilityPath(
      outboundFixture.state, PROTOTYPE_DOMAIN_CONTEXT, outboundOrigin,
      outboundFixture.start, new Set([outboundFixture.room.id]),
    );
    expect(legalOutbound.length).toBeGreaterThan(5);
    const outboundTravel: FrozenPatientTravel = {
      version: "patient-travel.v1",
      originRoomInstanceId: "room.test.hall.28",
      destinationRoomInstanceId: outboundFixture.room.id,
      outboundPath: [...legalOutbound.slice(0, 3), { x: 25, y: 20 }, outboundFixture.start],
      returnPath: [...legalOutbound].reverse(),
      tilesPerTick: 1,
      outboundStartTick: 0,
      outboundArrivalTick: 4,
      serviceCompletionTick: 10,
      returnArrivalTick: 16,
    };
    outbound.patientLocation = { ...outboundOrigin };
    outbound.patientMovement = null;
    outbound.pendingResult = pendingWithTravel(outbound, outboundTravel, {
      dueTick: 16, durationTicks: 16,
      timingPhases: [{ id: "work", durationTicks: 6, resourceBound: true, startsAtTick: 4, endsAtTick: 10 }],
    });
    outboundFixture.state.facilityTick = 2;
    outboundFixture.state.encounters = { [outbound.id]: outbound };
    const reloadedOutbound = deserializeGameState(serializeGameState(outboundFixture.state));
    expect(reloadedOutbound.encounters[outbound.id]!.pendingResult!.patientTravel!.tilesPerTick).toBe(1);
    expect(getEncounterPatientLocation(reloadedOutbound, outbound.id)).toEqual(legalOutbound[2]);
    const offsiteSpeedFixture = withUnrelatedRoom();
    const offsiteSpeed = makeEncounter();
    offsiteSpeed.pendingResult = pendingWithTravel(offsiteSpeed, outboundTravel, {
      patientTravel: null,
      offsiteTravel: {
        version: "offsite-patient-travel.v1",
        direction: 1,
        outboundPath: [outboundOrigin, legalOutbound[1]!],
        returnPath: [legalOutbound[1]!, outboundOrigin],
        tilesPerTick: 1,
        outboundStartTick: 0,
        outboundArrivalTick: 1,
        returnStartTick: 2,
        returnArrivalTick: 3,
      },
    });
    offsiteSpeedFixture.state.encounters = { [offsiteSpeed.id]: offsiteSpeed };
    expect(deserializeGameState(serializeGameState(offsiteSpeedFixture.state))
      .encounters[offsiteSpeed.id]!.pendingResult!.offsiteTravel!.tilesPerTick).toBe(1);
    const outboundRestored = gameReducer(
      reloadedOutbound,
      { type: "ADVANCE_TICK", operationId: "care-access.repair-mid-outbound" },
    );
    const repairedOutbound = outboundRestored.encounters[outbound.id]!;
    expect(getEncounterPatientLocation(outboundRestored, outbound.id)).toEqual(legalOutbound[3]);
    expect(repairedOutbound.pendingResult!.patientTravel!.outboundArrivalTick).toBeGreaterThan(4);
    const outboundNext = gameReducer(outboundRestored, {
      type: "ADVANCE_TICK", operationId: "care-access.repair-mid-outbound.next",
    });
    const outboundNextTravel = outboundNext.encounters[outbound.id]!.pendingResult!.patientTravel!;
    const outboundNextProjected = getFrozenPatientTravelLocation(
      outboundNextTravel,
      outboundNext.facilityTick,
    );
    expect(getEncounterPatientLocation(outboundNext, outbound.id)).toEqual(
      outboundNextProjected,
    );
    expect(outboundNext.encounters[outbound.id]!.patientLocation).toEqual(outboundNextProjected);
    const outboundMovement = outboundNext.encounters[outbound.id]!.patientMovement;
    if (outboundMovement) {
      expect(outboundMovement.path[outboundMovement.pathIndex]).toEqual(outboundNextProjected);
    }

    const returnFixture = withUnrelatedRoom();
    const returning = makeEncounter();
    const returnTarget = { x: 21, y: 28 };
    const legalReturn = findCareAwareFacilityPath(
      returnFixture.state, PROTOTYPE_DOMAIN_CONTEXT, returnFixture.start, returnTarget,
    );
    const returnTravel: FrozenPatientTravel = {
      version: "patient-travel.v1",
      originRoomInstanceId: "room.test.hall.28",
      destinationRoomInstanceId: returnFixture.room.id,
      outboundPath: [...legalReturn].reverse(),
      returnPath: [...legalReturn.slice(0, 3), { x: 25, y: 20 }, returnTarget],
      tilesPerTick: 1,
      outboundStartTick: 0,
      outboundArrivalTick: 4,
      serviceCompletionTick: 10,
      returnArrivalTick: 14,
    };
    returning.patientLocation = { ...returnFixture.start };
    returning.patientMovement = null;
    returning.pendingResult = pendingWithTravel(returning, returnTravel, {
      dueTick: 14, durationTicks: 14,
      timingPhases: [{ id: "completed-work", durationTicks: 6, resourceBound: true, startsAtTick: 4, endsAtTick: 10 }],
    });
    returnFixture.state.facilityTick = 12;
    returnFixture.state.encounters = { [returning.id]: returning };
    const completedPhases = JSON.parse(JSON.stringify(returning.pendingResult.timingPhases));
    const returnRestored = gameReducer(
      deserializeGameState(serializeGameState(returnFixture.state)),
      { type: "ADVANCE_TICK", operationId: "care-access.repair-mid-return" },
    );
    expect(returnRestored.encounters[returning.id]!.pendingResult!.patientTravel!.serviceCompletionTick).toBe(10);
    expect(returnRestored.encounters[returning.id]!.pendingResult!.timingPhases).toEqual(completedPhases);
    expect(getEncounterPatientLocation(returnRestored, returning.id)).toEqual(legalReturn[3]);

    const serviceFixture = withUnrelatedRoom();
    const inService = makeEncounter();
    const serviceTarget = { x: 21, y: 28 };
    const longReturn = findCareAwareFacilityPath(
      serviceFixture.state, PROTOTYPE_DOMAIN_CONTEXT, serviceFixture.start, serviceTarget,
    );
    const serviceTravel: FrozenPatientTravel = {
      version: "patient-travel.v1",
      originRoomInstanceId: "room.test.hall.28",
      destinationRoomInstanceId: serviceFixture.room.id,
      outboundPath: [serviceFixture.start],
      returnPath: [serviceFixture.start, { x: 25, y: 20 }, serviceTarget],
      tilesPerTick: 1,
      outboundStartTick: 0,
      outboundArrivalTick: 1,
      serviceCompletionTick: 10,
      returnArrivalTick: 12,
    };
    inService.patientLocation = { ...serviceFixture.start };
    inService.patientMovement = null;
    inService.pendingResult = pendingWithTravel(inService, serviceTravel, {
      dueTick: 12, durationTicks: 12,
      timingPhases: [{ id: "completed-part", durationTicks: 4, resourceBound: true, startsAtTick: 1, endsAtTick: 5 }],
    });
    serviceFixture.state.facilityTick = 5;
    serviceFixture.state.encounters = { [inService.id]: inService };
    const serviceRepaired = gameReducer(
      deserializeGameState(serializeGameState(serviceFixture.state)),
      { type: "ADVANCE_TICK", operationId: "care-access.repair-future-return" },
    );
    const repairedServicePending = serviceRepaired.encounters[inService.id]!.pendingResult!;
    expect(repairedServicePending.patientTravel!.serviceCompletionTick).toBe(10);
    expect(repairedServicePending.timingPhases).toEqual(inService.pendingResult.timingPhases);
    expect(repairedServicePending.patientTravel!.returnArrivalTick).toBeGreaterThanOrEqual(
      10 + longReturn.length - 1,
    );
    expect(repairedServicePending.dueTick).toBeGreaterThanOrEqual(
      repairedServicePending.patientTravel!.returnArrivalTick,
    );

    const protectedReturnFixture = withUnrelatedRoom();
    const protectedReturn = makeEncounter();
    const protectedTravel: FrozenPatientTravel = {
      ...serviceTravel,
      destinationRoomInstanceId: protectedReturnFixture.room.id,
      outboundPath: [protectedReturnFixture.start],
      returnPath: [protectedReturnFixture.start, protectedReturnFixture.otherInterior],
    };
    protectedReturn.patientLocation = { ...protectedReturnFixture.start };
    protectedReturn.patientMovement = null;
    protectedReturn.pendingResult = pendingWithTravel(protectedReturn, protectedTravel, {
      dueTick: 12, durationTicks: 12,
    });
    protectedReturnFixture.state.facilityTick = 5;
    protectedReturnFixture.state.encounters = { [protectedReturn.id]: protectedReturn };
    const publicReturn = gameReducer(
      deserializeGameState(serializeGameState(protectedReturnFixture.state)),
      { type: "ADVANCE_TICK", operationId: "care-access.retarget-legacy-protected-return" },
    ).encounters[protectedReturn.id]!.pendingResult!.patientTravel!;
    expect(protectedCareRoomAtPoint(
      protectedReturnFixture.state,
      PROTOTYPE_DOMAIN_CONTEXT,
      publicReturn.returnPath.at(-1)!,
    )).toBeNull();
    expect(publicReturn.originRoomInstanceId).not.toBe(protectedReturnFixture.room.id);

    const blockedFixture = withUnrelatedRoom();
    blockedFixture.state.rooms.push({
      id: "room.test.disconnected-care", roomDefinitionId: "room.examination",
      x: 30, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
    });
    const blocked = makeEncounter();
    const disconnected = blockedFixture.state.rooms.find((room) => room.id === "room.test.disconnected-care")!;
    const disconnectedDefinition = getRoomDefinition(disconnected.roomDefinitionId, PROTOTYPE_DOMAIN_CONTEXT)!;
    const disconnectedStart = getRoomCareAnchor(disconnected, disconnectedDefinition, "patient");
    const adjacentTarget = { x: 31, y: 23 };
    const blockedTravel: FrozenPatientTravel = {
      version: "patient-travel.v1",
      originRoomInstanceId: disconnected.id,
      destinationRoomInstanceId: blockedFixture.room.id,
      outboundPath: [blockedFixture.start],
      returnPath: [disconnectedStart, adjacentTarget],
      tilesPerTick: 1,
      outboundStartTick: 0,
      outboundArrivalTick: 0,
      serviceCompletionTick: 1,
      returnArrivalTick: 2,
    };
    blocked.patientLocation = { ...disconnectedStart };
    blocked.patientMovement = null;
    blocked.pendingResult = pendingWithTravel(blocked, blockedTravel, { dueTick: 2, durationTicks: 2 });
    blockedFixture.state.facilityTick = 1;
    blockedFixture.state.encounters = { [blocked.id]: blocked };
    let held = gameReducer(
      deserializeGameState(serializeGameState(blockedFixture.state)),
      { type: "ADVANCE_TICK", operationId: "care-access.hold-unreachable-return.1" },
    );
    held = gameReducer(held, {
      type: "ADVANCE_TICK", operationId: "care-access.hold-unreachable-return.2",
    });
    expect(getEncounterPatientLocation(held, blocked.id)).toEqual(disconnectedStart);
    expect(held.encounters[blocked.id]!.pendingResult!.deliveredAtTick).toBeNull();
    for (const y of [22, 23]) held.rooms.push({
      id: `room.test.disconnected-hall.${y}`, roomDefinitionId: "room.hallway",
      x: adjacentTarget.x, y, orientation: 0, doorSide: null,
      upgradeLevel: 1, cleanliness: 100,
    });
    held.doors.push({
      id: "door.test.disconnected-care", roomId: disconnected.id,
      side: "south", offset: 1, exterior: false,
    });
    expect(findCareAwareFacilityPath(
      held,
      PROTOTYPE_DOMAIN_CONTEXT,
      disconnectedStart,
      adjacentTarget,
    ).length).toBeGreaterThan(0);
    const resumed = gameReducer(held, {
      type: "ADVANCE_TICK", operationId: "care-access.resume-return-after-door",
    });
    expect(resumed.encounters[blocked.id]!.pendingResult!.deliveredAtTick).toBeNull();
    const progressed = gameReducer(resumed, {
      type: "ADVANCE_TICK", operationId: "care-access.progress-restored-return",
    });
    expect(getEncounterPatientLocation(progressed, blocked.id)).not.toEqual(disconnectedStart);
    expect(getEncounterPatientLocation(progressed, blocked.id)).toEqual(adjacentTarget);
    expect(progressed.encounters[blocked.id]!.pendingResult!.deliveredAtTick).toBe(progressed.facilityTick);

    const historicalFixture = withUnrelatedRoom();
    const historical = makeEncounter();
    historical.pendingResult = pendingWithTravel(historical, returnTravel, { deliveredAtTick: 12 });
    historical.steps[historical.currentNodeIndex]!.result = JSON.parse(JSON.stringify(historical.pendingResult));
    const historicalPending = JSON.parse(JSON.stringify(historical.pendingResult));
    const historicalStepResult = JSON.parse(JSON.stringify(historical.steps[historical.currentNodeIndex]!.result));
    historicalFixture.state.facilityTick = 20;
    historicalFixture.state.encounters = { [historical.id]: historical };
    const historicalAdvanced = gameReducer(historicalFixture.state, {
      type: "ADVANCE_TICK", operationId: "care-access.preserve-delivered-history",
    });
    expect(historicalAdvanced.encounters[historical.id]!.pendingResult).toEqual(historicalPending);
    expect(historicalAdvanced.encounters[historical.id]!.steps[historical.currentNodeIndex]!.result).toEqual(historicalStepResult);
  });
});
