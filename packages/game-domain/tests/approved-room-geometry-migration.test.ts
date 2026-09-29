import { describe, expect, it } from "vitest";

import { PROTOTYPE_DOMAIN_CONTEXT } from "../src/context";
import { validateDoorPlacement, validateFacilityAccess } from "../src/doors";
import {
  migrateApprovedRoomGeometry,
  normalizeApprovedRoomOrientations,
} from "../src/approved-room-geometry-migration";
import { deserializeGameState, serializeGameState } from "../src/persistence";
import { createInitialGameState, gameReducer } from "../src/reducer";
import {
  findDeterministicFacilityPath,
  getRoomNavigationAnchor,
  getRoomNavigableTiles,
  roomsOverlap,
} from "../src/spatial";
import type { DoorState, GameState, PendingResult, PlacedRoom } from "../src/types";

const context = PROTOTYPE_DOMAIN_CONTEXT;
const definitionFor = (id: string) =>
  context.balanceRelease.facility.roomDefinitions.find(
    (definition) => definition.id === id,
  ) ?? null;

function room(
  id: string,
  roomDefinitionId: string,
  x: number,
  y: number,
): PlacedRoom {
  return {
    id,
    roomDefinitionId,
    x,
    y,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  };
}

function asVersionSeven(state: GameState): string {
  const legacy = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
  legacy.schemaVersion = 7;
  delete legacy.approvedRoomGeometryMigration;
  delete legacy.approvedRoomNavigationMigration;
  return JSON.stringify(legacy);
}

function expectValidFacility(state: GameState): void {
  const access = validateFacilityAccess(
    state.rooms,
    state.doors,
    definitionFor,
    context.balanceRelease.facility.gridWidth,
    context.balanceRelease.facility.gridHeight,
    new Set(context.balanceRelease.facility.protectedRoomDefinitionIds),
  );
  expect(access).toMatchObject({ valid: true, unreachableRoomIds: [] });
  for (let leftIndex = 0; leftIndex < state.rooms.length; leftIndex += 1) {
    const left = state.rooms[leftIndex]!;
    const leftDefinition = definitionFor(left.roomDefinitionId)!;
    for (let rightIndex = leftIndex + 1; rightIndex < state.rooms.length; rightIndex += 1) {
      const right = state.rooms[rightIndex]!;
      const rightDefinition = definitionFor(right.roomDefinitionId)!;
      expect(
        roomsOverlap(left, leftDefinition, right, rightDefinition),
        `${left.id} overlaps ${right.id}`,
      ).toBe(false);
    }
  }
}

function expectFunctionalRecoveryRoute(state: GameState): void {
  const front = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
  const recovery = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.periop_recovery")!;
  const path = findDeterministicFacilityPath(
    getRoomNavigationAnchor(front, definitionFor(front.roomDefinitionId)!),
    getRoomNavigationAnchor(recovery, definitionFor(recovery.roomDefinitionId)!),
    state.rooms,
    state.doors,
    definitionFor,
  );
  expect(path.length).toBeGreaterThan(1);
}

function baseLegacyState(recoveryX = 10, recoveryY = 10): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 2;
  state.rooms.push(room("room.test.recovery", "room.periop_recovery", recoveryX, recoveryY));
  return state;
}

describe("approved Recovery geometry migration", () => {
  it("expands a clear legacy Recovery room in place without changing cash, capacity, identity, upgrades, or cleanliness", () => {
    const state = baseLegacyState();
    const recovery = state.rooms.find((candidate) => candidate.id === "room.test.recovery")!;
    recovery.upgradeLevel = 4;
    recovery.cleanliness = 63;
    state.cash = 777;
    state.cashCents = 77_700;
    const beforeRoomCount = state.rooms.filter(
      (candidate) => candidate.roomDefinitionId !== "room.hallway",
    ).length;

    const restored = deserializeGameState(asVersionSeven(state));
    const migrated = restored.rooms.find((candidate) => candidate.id === recovery.id)!;

    expect(migrated).toMatchObject({
      id: recovery.id,
      x: recovery.x,
      y: recovery.y,
      orientation: 0,
      upgradeLevel: 4,
      cleanliness: 63,
    });
    expect(restored.schemaVersion).toBe(8);
    expect(restored.cash).toBe(777);
    expect(restored.cashCents).toBe(77_700);
    const recoveryDefinition = definitionFor("room.periop_recovery")!;
    expect(recoveryDefinition.workloadLimitContribution).toBe(1);
    expect(recoveryDefinition.navigation?.waitingAnchors).toHaveLength(1);
    expect(
      restored.rooms.filter((candidate) => candidate.roomDefinitionId !== "room.hallway"),
    ).toHaveLength(beforeRoomCount);
    expect(restored.approvedRoomGeometryMigration?.relocatedRecoveryRoomIds).toEqual([]);
    expectValidFacility(restored);
    expectFunctionalRecoveryRoute(restored);
  });

  it("migrates multiple legacy Recovery rooms without treating the not-yet-migrated footprints as 6x6", () => {
    const state = baseLegacyState(8, 8);
    state.rooms.push(room("room.test.recovery.second", "room.periop_recovery", 20, 8));

    const restored = deserializeGameState(asVersionSeven(state));
    const recoveryRooms = restored.rooms
      .filter((candidate) => candidate.roomDefinitionId === "room.periop_recovery")
      .sort((left, right) => left.id.localeCompare(right.id));

    expect(recoveryRooms.map((candidate) => candidate.id)).toEqual([
      "room.test.recovery",
      "room.test.recovery.second",
    ]);
    expectValidFacility(restored);
  });

  it("relocates a blocked Recovery room, reconnects its access for free, and reprojects active actors and frozen routes while preserving timing", () => {
    let state = createInitialGameState();
    state.facilityLevel = 2;
    const front = state.rooms[0]!;
    const recovery = room("room.l2.periop", "room.periop_recovery", 34, 24);
    const phlebotomy = room("room.l2.phlebotomy", "room.phlebotomy", 38, 25);
    const hallways = Array.from({ length: 8 }, (_, index) =>
      room(`room.l2.hall.${index}`, "room.hallway", 33 + index, 27),
    );
    state.rooms = [front, recovery, phlebotomy, ...hallways];
    state.doors = [
      { id: "door.front.exterior", roomId: front.id, side: "south", offset: 2, exterior: true },
      { id: "door.front.hall", roomId: front.id, side: "north", offset: 2, exterior: false },
      { id: "door.recovery.hall", roomId: recovery.id, side: "south", offset: 1, exterior: false },
      { id: "door.phleb.hall", roomId: phlebotomy.id, side: "south", offset: 1, exterior: false },
    ];
    state.cash = 12_345;
    state.cashCents = 1_234_500;
    state.employees.push({
      id: "employee.recovery",
      staffRoleDefinitionId: "staff.periop_nurse",
      displayName: "Recovery Nurse",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 2,
      salaryPerExpenseInterval: 10,
      morale: 88,
      trainingLevel: 3,
      homeRoomInstanceId: recovery.id,
      location: { x: 35, y: 25 },
      path: [{ x: 35, y: 25 }, { x: 35, y: 26 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 9,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 99,
      facilityTask: null,
    });
    state.environment.litterItems.push({
      id: "litter.recovery",
      roomId: recovery.id,
      location: { x: 36, y: 24 },
      spawnedAtFacilityTick: 7,
    });
    state.serviceOperations.push({
      id: "service-operation.recovery",
      incomeLineId: "income.endoscopy",
      catalogVersion: 1,
      actorKind: "visitor",
      actorId: "visitor.recovery",
      displayName: "Recovery Visitor",
      appearance: state.founder.appearance,
      status: "in_service",
      createdAtFacilityTick: 1,
      waitDeadlineFacilityTick: 200,
      startedAtFacilityTick: 10,
      completedAtFacilityTick: null,
      cancelledAtFacilityTick: null,
      quoteFee: 400,
      phaseIndex: 1,
      phaseStartedAtFacilityTick: 20,
      phaseEndsAtFacilityTick: 65,
      reservedRoomInstanceIds: [recovery.id],
      reservedEmployeeIds: ["employee.recovery"],
      providerReservation: null,
      location: { x: 35, y: 25 },
      path: [{ x: 35, y: 25 }, { x: 35, y: 26 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 11,
      cancellationReason: null,
    });
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "migration.admit",
      encounterId: "encounter.migration",
      caseId: "case.thyroid-nodule.palpable-referral",
      patientDisplayName: "Migration Patient",
      arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.migration"]!;
    encounter.patientLocation = { x: 35, y: 25 };
    encounter.patientMovement = {
      kind: "walking_to_care",
      path: [{ x: 35, y: 25 }, { x: 35, y: 26 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 11,
      destinationRoomInstanceId: recovery.id,
    };
    encounter.assignedRoomInstanceId = recovery.id;
    encounter.queuedCareRoomInstanceId = recovery.id;
    const frozenTravel: PendingResult = {
      operationId: "pending.migration",
      gateId: "gate.migration",
      originatingNodeIndex: 0,
      resultTypeId: "result.migration",
      pendingLabel: "Pending",
      resultNarrative: "Result",
      routeId: "route.migration",
      routeDisplayName: "Migration route",
      scheduledAtTick: 10,
      serviceDurationTicks: 40,
      durationTicks: 40,
      dueTick: 50,
      deliveredAtTick: null,
      offsiteReturnStartedAtTick: null,
      offsiteTravel: null,
      patientTravel: {
        version: "patient-travel.v1",
        originRoomInstanceId: front.id,
        destinationRoomInstanceId: recovery.id,
        outboundPath: [{ x: 35, y: 29 }, { x: 35, y: 25 }],
        returnPath: [{ x: 35, y: 25 }, { x: 35, y: 29 }],
        tilesPerTick: 2,
        outboundStartTick: 10,
        outboundArrivalTick: 20,
        serviceCompletionTick: 40,
        returnArrivalTick: 50,
      },
      resourceReservations: [
        { roomDefinitionId: "room.periop_recovery", staffRoleDefinitionId: "staff.periop_nurse" },
      ],
      providerReservation: null,
    };
    encounter.lifecycle = "active_pending_result";
    encounter.steps[0]!.status = "result_pending";
    encounter.pendingResult = frozenTravel;
    encounter.steps[0]!.result = JSON.parse(JSON.stringify(frozenTravel));
    const legacyFrozenTimes = {
      outboundStartTick: frozenTravel.patientTravel!.outboundStartTick,
      outboundArrivalTick: frozenTravel.patientTravel!.outboundArrivalTick,
      serviceCompletionTick: frozenTravel.patientTravel!.serviceCompletionTick,
      returnArrivalTick: frozenTravel.patientTravel!.returnArrivalTick,
      dueTick: frozenTravel.dueTick,
    };
    const oldSnapshot = JSON.parse(asVersionSeven(state)) as { rooms: PlacedRoom[]; doors: DoorState[] };
    const originalHallIds = hallways.map((candidate) => candidate.id);

    const restored = deserializeGameState(JSON.stringify(oldSnapshot));
    const movedRecovery = restored.rooms.find((candidate) => candidate.id === recovery.id)!;

    expect({ x: movedRecovery.x, y: movedRecovery.y }).not.toEqual({ x: recovery.x, y: recovery.y });
    expect(restored.approvedRoomGeometryMigration?.relocatedRecoveryRoomIds).toContain(recovery.id);
    expect(restored.cash).toBe(12_345);
    expect(restored.cashCents).toBe(1_234_500);
    expect(restored.rooms.filter((candidate) => originalHallIds.includes(candidate.id))).toHaveLength(originalHallIds.length);
    expect(restored.doors.find((door) => door.id === "door.phleb.hall")).toEqual(
      state.doors.find((door) => door.id === "door.phleb.hall"),
    );
    expect(restored.employees[0]).toMatchObject({
      id: "employee.recovery",
      homeRoomInstanceId: recovery.id,
      trainingLevel: 3,
      morale: 88,
      lastMovedAtFacilityTick: 9,
      pathIndex: 0,
    });
    expect(restored.encounters[encounter.id]).toMatchObject({
      assignedRoomInstanceId: recovery.id,
      queuedCareRoomInstanceId: recovery.id,
      lifecycle: "active_pending_result",
    });
    expect(restored.encounters[encounter.id]!.steps[0]!.status).toBe("result_pending");
    expect(restored.encounters[encounter.id]!.pendingResult?.dueTick).toBe(
      legacyFrozenTimes.dueTick,
    );
    const { dueTick: _dueTick, ...legacyTravelTimes } = legacyFrozenTimes;
    expect(restored.encounters[encounter.id]!.pendingResult!.patientTravel).toMatchObject(
      legacyTravelTimes,
    );
    expect(restored.encounters[encounter.id]!.pendingResult!.resourceReservations).toEqual(
      frozenTravel.resourceReservations,
    );
    expect(restored.environment.litterItems).toHaveLength(1);
    expect(restored.serviceOperations).toEqual([
      expect.objectContaining({
        id: "service-operation.recovery",
        status: "in_service",
        phaseIndex: 1,
        phaseStartedAtFacilityTick: 20,
        phaseEndsAtFacilityTick: 65,
        reservedRoomInstanceIds: [recovery.id],
        reservedEmployeeIds: ["employee.recovery"],
        lastMovedAtFacilityTick: 11,
      }),
    ]);
    expectValidFacility(restored);
    expectFunctionalRecoveryRoute(restored);

    const reloaded = deserializeGameState(serializeGameState(restored));
    expect(reloaded).toEqual(restored);
  });

  it("rejects a fully packed save atomically without mutating its raw state", () => {
    const state = baseLegacyState();
    const occupied = new Set<string>();
    for (const placed of state.rooms) {
      const definition =
        placed.roomDefinitionId === "room.periop_recovery"
          ? { width: 4, height: 3 }
          : definitionFor(placed.roomDefinitionId)!;
      for (let y = placed.y; y < placed.y + definition.height; y += 1) {
        for (let x = placed.x; x < placed.x + definition.width; x += 1) occupied.add(`${x},${y}`);
      }
    }
    for (let y = 0; y < context.balanceRelease.facility.gridHeight; y += 1) {
      for (let x = 0; x < context.balanceRelease.facility.gridWidth; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          state.rooms.push(room(`room.packed.${x}.${y}`, "room.hallway", x, y));
        }
      }
    }
    const before = serializeGameState(state);

    expect(() => migrateApprovedRoomGeometry(state, context)).toThrow(
      /could not place and reconnect/,
    );
    expect(serializeGameState(state)).toBe(before);
  });
});

describe("approved rectangular room orientation normalization", () => {
  it.each([7, 8] as const)(
    "normalizes a schema-%s legacy 90-degree room to 270 with stable doors and safe active movement",
    (schemaVersion) => {
      const state = createInitialGameState();
      state.cash = 4321;
      state.cashCents = 432_100;
      const exam = room("room.exam.legacy-vertical", "room.examination", 10, 10);
      exam.orientation = 90;
      state.rooms.push(exam);
      state.rooms.push(
        ...Array.from({ length: 22 }, (_, index) =>
          room(`room.hall.exam.row.${index}`, "room.hallway", 12 + index, 11),
        ),
        ...Array.from({ length: 16 }, (_, index) =>
          room(`room.hall.exam.column.${index}`, "room.hallway", 33, 12 + index),
        ),
      );
      const door: DoorState = {
        id: "door.exam.absolute",
        roomId: exam.id,
        side: "east",
        offset: 1,
        exterior: false,
      };
      state.doors.push(door);
      state.doors.push({
        id: "door.front.hall",
        roomId: "room.instance.founder_desk",
        side: "north",
        offset: 0,
        exterior: false,
      });
      state.environment.founderLocation = { x: 10, y: 10 };
      state.environment.founderActivity = {
        kind: "wander_facility",
        targetId: exam.id,
        path: [{ x: 10, y: 10 }, { x: 10, y: 11 }],
        pathIndex: 0,
        lastMovedAtFacilityTick: 17,
        workMinutesRemaining: 3,
      };
      const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
      raw.schemaVersion = schemaVersion;

      const restored = deserializeGameState(JSON.stringify(raw));
      const migrated = restored.rooms.find((candidate) => candidate.id === exam.id)!;
      expect(migrated.orientation).toBe(270);
      expect(restored.doors.find((candidate) => candidate.id === door.id)).toEqual(
        expect.objectContaining({ id: door.id, roomId: exam.id }),
      );
      expect(restored.cash).toBe(4321);
      expect(restored.cashCents).toBe(432_100);
      expect(restored.environment.founderActivity).toMatchObject({
        lastMovedAtFacilityTick: 17,
        workMinutesRemaining: 3,
        pathIndex: 0,
      });
      expect(restored.environment.founderActivity!.path.length).toBeGreaterThan(0);

      const reloaded = deserializeGameState(serializeGameState(restored));
      expect(reloaded).toEqual(restored);
      expect(normalizeApprovedRoomOrientations(restored, context)).toBe(restored);
    },
  );

  it.each([7, 8] as const)(
    "reconciles schema-%s orientation-zero active routes with new proof blockers without resetting service state",
    (schemaVersion) => {
      const state = createInitialGameState();
      const front = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
      state.serviceOperations.push({
        id: "service-operation.navigation-migration",
        incomeLineId: "income.endoscopy",
        catalogVersion: 1,
        actorKind: "visitor",
        actorId: "visitor.navigation-migration",
        displayName: "Navigation Migration Visitor",
        appearance: state.founder.appearance,
        status: "in_service",
        createdAtFacilityTick: 1,
        waitDeadlineFacilityTick: 200,
        startedAtFacilityTick: 10,
        completedAtFacilityTick: null,
        cancelledAtFacilityTick: null,
        quoteFee: 400,
        phaseIndex: 1,
        phaseStartedAtFacilityTick: 20,
        phaseEndsAtFacilityTick: 65,
        reservedRoomInstanceIds: [front.id],
        reservedEmployeeIds: [],
        providerReservation: null,
        location: { x: front.x + 1, y: front.y + 2 },
        path: [
          { x: front.x + 1, y: front.y + 2 },
          { x: front.x + 2, y: front.y + 2 },
          { x: front.x + 2, y: front.y + 3 },
        ],
        pathIndex: 0,
        lastMovedAtFacilityTick: 11,
        cancellationReason: null,
      });
      const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
      raw.schemaVersion = schemaVersion;
      delete raw.approvedRoomNavigationMigration;

      const restored = deserializeGameState(JSON.stringify(raw));
      expect(restored.approvedRoomNavigationMigration).toEqual({
        version: "approved-room-navigation.v1",
      });
      expect(restored.serviceOperations).toEqual([
        expect.objectContaining({
          id: "service-operation.navigation-migration",
          status: "in_service",
          phaseIndex: 1,
          phaseStartedAtFacilityTick: 20,
          phaseEndsAtFacilityTick: 65,
          reservedRoomInstanceIds: [front.id],
          lastMovedAtFacilityTick: 11,
          pathIndex: 0,
        }),
      ]);
      const operation = restored.serviceOperations[0]!;
      const frontDefinition = definitionFor(front.roomDefinitionId)!;
      const navigable = new Set(
        getRoomNavigableTiles(
          restored.rooms.find((candidate) => candidate.id === front.id)!,
          frontDefinition,
          restored.doors,
          restored.rooms,
          definitionFor,
        ).map((point) => `${point.x},${point.y}`),
      );
      expect(operation.path.slice(0, -1).every((point) => navigable.has(`${point.x},${point.y}`))).toBe(true);
      expect(deserializeGameState(serializeGameState(restored))).toEqual(restored);
    },
  );

  it("normalizes fixed square rotations and reconnects proof-invalid legacy Exam E2 and CT W2 doors", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.rooms.push(
      room("room.legacy.ct", "room.ct", 28, 23),
      room("room.legacy.exam", "room.examination", 29, 18),
      room("room.legacy.neighbor", "room.bathroom", 32, 18),
      ...[24, 25, 26, 27, 28].map((y) => room(`room.legacy.spine.${y}`, "room.hallway", 32, y)),
      ...[24, 25, 26, 27].map((y) => room(`room.legacy.ct.west.${y}`, "room.hallway", 27, y)),
      ...[28, 29, 30, 31].map((x) => room(`room.legacy.cross.${x}`, "room.hallway", x, 27)),
    );
    state.rooms.find((candidate) => candidate.id === "room.legacy.ct")!.orientation = 180;
    state.doors.push(
      { id: "door.legacy.ct.w2", roomId: "room.legacy.ct.west.24", side: "east", offset: 0, exterior: false },
      { id: "door.legacy.exam.e2", roomId: "room.legacy.neighbor", side: "west", offset: 1, exterior: false },
      { id: "door.legacy.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    );
    const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    raw.schemaVersion = 7;
    delete raw.approvedRoomNavigationMigration;
    delete raw.approvedRoomGeometryMigration;

    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.rooms.find((candidate) => candidate.id === "room.legacy.ct")?.orientation).toBe(0);
    for (const id of ["door.legacy.ct.w2", "door.legacy.exam.e2"]) {
      const migrated = restored.doors.find((door) => door.id === id);
      expect(migrated).toBeDefined();
      const placement = validateDoorPlacement(
        migrated!, restored.rooms, restored.doors, definitionFor,
        context.balanceRelease.facility.gridWidth,
        context.balanceRelease.facility.gridHeight,
        new Set(context.balanceRelease.facility.protectedRoomDefinitionIds),
      );
      expect(placement.valid, `${id}: ${placement.reason}`).toBe(true);
    }
    expect(restored.doors.find((door) => door.id === "door.legacy.ct.w2")).not.toMatchObject({
      roomId: "room.legacy.ct.west.24", side: "east", offset: 0,
    });
    expect(restored.doors.find((door) => door.id === "door.legacy.exam.e2")).not.toMatchObject({
      roomId: "room.legacy.neighbor", side: "west", offset: 1,
    });
    expect(restored.doors.some((door) => door.id.startsWith("door.migration.reconnect.door.legacy.exam.e2"))).toBe(true);
    expectValidFacility(restored);
    expect(deserializeGameState(serializeGameState(restored))).toEqual(restored);
  });

  it("restores the fixed Front Desk entrance segment while preserving its door identity", () => {
    const state = createInitialGameState();
    const entrance = state.doors.find((door) => door.exterior)!;
    entrance.offset = 4;
    const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    delete raw.approvedRoomNavigationMigration;

    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.doors.find((door) => door.id === entrance.id)).toMatchObject({
      id: entrance.id,
      roomId: entrance.roomId,
      side: "south",
      offset: 2,
      exterior: true,
    });
    expect(deserializeGameState(serializeGameState(restored))).toEqual(restored);
  });

  it("preserves distinct Front Desk chair and standing reservations on an unmarked schema-8 reload", () => {
    const state = createInitialGameState();
    const sample = Object.values(state.encounters)[0]!;
    const front = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
    const chairLocation = { x: front.x + 4, y: front.y + 3 };
    const standingLocation = { x: front.x + 3, y: front.y + 3 };
    const chair = JSON.parse(JSON.stringify(sample)) as typeof sample;
    const standing = JSON.parse(JSON.stringify(sample)) as typeof sample;
    Object.assign(chair, {
      id: "encounter.front-chair",
      patientLocation: chairLocation,
      patientMovement: null,
      waitingDestination: { roomInstanceId: front.id, location: chairLocation, kind: "chair" },
    });
    Object.assign(standing, {
      id: "encounter.front-standing",
      patientLocation: { x: front.x + 2, y: front.y + 3 },
      patientMovement: {
        kind: "walking_to_waiting",
        path: [{ x: front.x + 2, y: front.y + 3 }, standingLocation],
        pathIndex: 0,
        lastMovedAtFacilityTick: 5,
        destinationRoomInstanceId: front.id,
      },
      waitingDestination: { roomInstanceId: front.id, location: standingLocation, kind: "standing" },
    });
    state.encounters = { [chair.id]: chair, [standing.id]: standing };
    const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    delete raw.approvedRoomNavigationMigration;

    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.encounters[chair.id]).toMatchObject({
      patientLocation: chairLocation,
      waitingDestination: { location: chairLocation, kind: "chair" },
    });
    expect(restored.encounters[standing.id]).toMatchObject({
      waitingDestination: { location: standingLocation, kind: "standing" },
    });
    expect(restored.encounters[standing.id]!.patientMovement?.path.at(-1)).toEqual(standingLocation);
  });

  it("preserves four Waiting Room chairs plus a unique standing overflow destination", () => {
    const state = createInitialGameState();
    const waiting = room("room.waiting.crowded", "room.waiting", 29, 28);
    state.rooms.push(waiting);
    state.doors.push({
      id: "door.waiting.crowded",
      roomId: waiting.id,
      side: "east",
      offset: 2,
      exterior: false,
    });
    const sample = Object.values(state.encounters)[0]!;
    const destinations = [
      { location: { x: 30, y: 28 }, kind: "chair" as const },
      { location: { x: 31, y: 28 }, kind: "chair" as const },
      { location: { x: 29, y: 29 }, kind: "chair" as const },
      { location: { x: 32, y: 29 }, kind: "chair" as const },
      { location: { x: 30, y: 30 }, kind: "standing" as const },
    ];
    state.encounters = Object.fromEntries(destinations.map((destination, index) => {
      const encounter = JSON.parse(JSON.stringify(sample)) as typeof sample;
      encounter.id = `encounter.waiting.crowded.${index}`;
      encounter.patientLocation = { ...destination.location };
      encounter.patientMovement = null;
      encounter.waitingDestination = {
        roomInstanceId: waiting.id,
        location: { ...destination.location },
        kind: destination.kind,
      };
      return [encounter.id, encounter];
    }));
    const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    delete raw.approvedRoomNavigationMigration;

    const restored = deserializeGameState(JSON.stringify(raw));
    const restoredDestinations = Object.values(restored.encounters).map(
      (encounter) => encounter.waitingDestination!,
    );
    expect(restoredDestinations.map((destination) => destination.kind)).toEqual([
      "chair", "chair", "chair", "chair", "standing",
    ]);
    expect(new Set(restoredDestinations.map((destination) => `${destination.location.x},${destination.location.y}`))).toHaveLength(5);
    expect(restoredDestinations.at(-1)?.location).toEqual({ x: 30, y: 30 });
  });

  it("keeps completed frozen travel history when its destination room was later demolished", () => {
    const state = baseLegacyState();
    const encounter = Object.values(state.encounters)[0]!;
    encounter.lifecycle = "resolved";
    encounter.pendingResult = null;
    const frozenTravel = {
      version: "patient-travel.v1" as const,
      originRoomInstanceId: "room.test.recovery",
      destinationRoomInstanceId: "room.demolished.after-result",
      outboundPath: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
      returnPath: [{ x: 20, y: 20 }, { x: 10, y: 10 }],
      tilesPerTick: 2,
      outboundStartTick: 1,
      outboundArrivalTick: 2,
      serviceCompletionTick: 3,
      returnArrivalTick: 4,
    };
    const decision = encounter.frozenCase.decisionNodes[0]!;
    encounter.steps = [{
      nodeIndex: 0,
      decisionNodeId: decision.id,
      questionVariantId: "historical.travel.fixture",
      primaryConceptId: decision.primaryConceptId,
      status: "completed",
      answer: null,
      result: {
        durationTicks: 1,
        serviceDurationTicks: 1,
        offsiteReturnStartedAtTick: null,
        offsiteTravel: null,
        patientTravel: frozenTravel,
        timingPhases: [],
      },
    }] as unknown as typeof encounter.steps;

    const restored = deserializeGameState(asVersionSeven(state));
    expect(restored.encounters[encounter.id]!.steps[0]!.result?.patientTravel).toEqual(frozenTravel);
  });

  it("moves an invalid shared bathroom threshold to the nearest valid shared segment without adding hallways", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.rooms.push(
      room("room.shared.left", "room.bathroom", 29, 28),
      room("room.shared.right", "room.bathroom", 31, 28),
    );
    state.doors.push(
      { id: "door.shared.invalid", roomId: "room.shared.left", side: "east", offset: 0, exterior: false },
      { id: "door.shared.front", roomId: "room.shared.right", side: "east", offset: 1, exterior: false },
    );
    const hallwayCount = state.rooms.filter((candidate) => candidate.roomDefinitionId === "room.hallway").length;
    const raw = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    delete raw.approvedRoomNavigationMigration;

    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.doors.find((door) => door.id === "door.shared.invalid")).toMatchObject({
      roomId: "room.shared.left", side: "east", offset: 1,
    });
    expect(restored.rooms.filter((candidate) => candidate.roomDefinitionId === "room.hallway")).toHaveLength(hallwayCount);
    expectValidFacility(restored);
  });

  it("leaves the source state untouched when an invalid door has no reconnection path", () => {
    const state = createInitialGameState();
    state.rooms.push(room("room.exam.no-route", "room.examination", 10, 10));
    state.doors.push({
      id: "door.exam.no-route",
      roomId: "room.exam.no-route",
      side: "east",
      offset: 1,
      exterior: false,
    });
    state.approvedRoomNavigationMigration = undefined;
    const before = serializeGameState(state);

    expect(() => normalizeApprovedRoomOrientations(state, context)).toThrow(
      "could not reconnect door door.exam.no-route",
    );
    expect(serializeGameState(state)).toBe(before);
  });

  it("normalizes same-footprint Front Desk 180 but rejects unsupported 90/270 without mutating the source", () => {
    const rotated = createInitialGameState();
    const front = rotated.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
    front.orientation = 180;
    rotated.approvedRoomNavigationMigration = undefined;
    expect(normalizeApprovedRoomOrientations(rotated, context).rooms.find((room) => room.id === front.id)?.orientation).toBe(0);

    for (const orientation of [90, 270] as const) {
      const unsupported = createInitialGameState();
      unsupported.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!.orientation = orientation;
      unsupported.approvedRoomNavigationMigration = undefined;
      const before = serializeGameState(unsupported);
      expect(() => normalizeApprovedRoomOrientations(unsupported, context)).toThrow(
        `cannot preserve legacy Front Desk orientation ${orientation}`,
      );
      expect(serializeGameState(unsupported)).toBe(before);
    }
  });
});
