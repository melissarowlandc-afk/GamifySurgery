import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceEmployeeMovement,
  createInitialGameState,
  findCareAwareFacilityPath,
  findDeterministicFacilityPath,
  getDoorCells,
  getRoomDefinition,
  getRoomNavigableTiles,
  getRoomNavigationAnchor,
  protectedCareRoomAtPoint,
  type EmployeeState,
  type EncounterState,
  type GameState,
  type PendingResult,
  type ServiceOperationState,
} from "../src";

function employee(
  state: GameState,
  id: string,
  role: string,
  homeRoomInstanceId: string | null,
  location: { x: number; y: number },
): EmployeeState {
  return {
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 20,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId,
    location: { ...location },
    path: [{ ...location }],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  };
}

function connectedFixture() {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.staff-care-access",
    campaignSeed: "staff-care-access",
    createdAtRealMs: 0,
  });
  state.rooms.push(
    {
      id: "room.staff-access.unrelated",
      roomDefinitionId: "room.examination",
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.staff-access.home",
      roomDefinitionId: "room.examination",
      x: 24,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    ...[
      { x: 19, y: 21 },
      { x: 19, y: 22 },
      { x: 20, y: 22 },
      { x: 21, y: 22 },
      { x: 22, y: 22 },
      { x: 23, y: 22 },
      { x: 23, y: 21 },
    ].map((point, index) => ({
      id: `room.staff-access.hall.${index}`,
      roomDefinitionId: "room.hallway",
      ...point,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  );
  state.doors.push(
    {
      id: "door.staff-access.unrelated.west",
      roomId: "room.staff-access.unrelated",
      side: "west",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.staff-access.unrelated.east",
      roomId: "room.staff-access.unrelated",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.staff-access.home.west",
      roomId: "room.staff-access.home",
      side: "west",
      offset: 1,
      exterior: false,
    },
  );
  state.facilityTick = 1;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  const unrelated = state.rooms.find((room) => room.id === "room.staff-access.unrelated")!;
  const home = state.rooms.find((room) => room.id === "room.staff-access.home")!;
  const unrelatedDefinition = getRoomDefinition(unrelated.roomDefinitionId)!;
  const homeDefinition = getRoomDefinition(home.roomDefinitionId)!;
  return {
    state,
    unrelated,
    home,
    publicStart: { x: 19, y: 21 },
    unrelatedTarget: getRoomNavigationAnchor(unrelated, unrelatedDefinition, "staff"),
    homeTarget: getRoomNavigationAnchor(home, homeDefinition, "staff"),
  };
}

function protectedRoomIdsAlong(state: GameState, path: readonly { x: number; y: number }[]) {
  return path.flatMap((point) => {
    const room = protectedCareRoomAtPoint(state, PROTOTYPE_DOMAIN_CONTEXT, point);
    return room ? [room.id] : [];
  });
}

describe("staff protected-care room access", () => {
  it("replans a legacy home route before movement and avoids an unrelated clinical shortcut", () => {
    const { state, unrelated, home, publicStart, homeTarget } = connectedFixture();
    const definition = getRoomDefinition(unrelated.roomDefinitionId)!;
    const west = getDoorCells(
      state.doors.find((door) => door.id === "door.staff-access.unrelated.west")!,
      unrelated,
      definition,
    )!;
    const east = getDoorCells(
      state.doors.find((door) => door.id === "door.staff-access.unrelated.east")!,
      unrelated,
      definition,
    )!;
    const throughRoom = findDeterministicFacilityPath(
      west.inside,
      east.inside,
      state.rooms,
      state.doors,
      (definitionId) => getRoomDefinition(definitionId),
    );
    const intoHome = findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      east.outside,
      homeTarget,
      new Set([home.id]),
    );
    const oldPath = [publicStart, west.inside, ...throughRoom.slice(1), east.outside, ...intoHome.slice(1)];
    expect(protectedRoomIdsAlong(state, oldPath)).toContain(unrelated.id);
    const worker = employee(state, "employee.staff-access.home", "staff.endoscopy_nurse", home.id, publicStart);
    worker.path = oldPath;
    state.employees = [worker];

    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);

    expect(worker.location).toEqual(publicStart);
    expect(worker.path.at(-1)).toEqual(homeTarget);
    expect(protectedRoomIdsAlong(state, worker.path)).not.toContain(unrelated.id);
    expect(protectedRoomIdsAlong(state, worker.path)).toContain(home.id);
  });

  it("allows assigned department staff to remain and move inside their clinical home", () => {
    const { state, home } = connectedFixture();
    const definition = getRoomDefinition(home.roomDefinitionId)!;
    const tiles = getRoomNavigableTiles(home, definition, state.doors);
    const start = getRoomNavigationAnchor(home, definition, "staff");
    const destination = tiles.find((point) => point.x !== start.x || point.y !== start.y)!;
    const worker = employee(state, "employee.staff-access.assigned", "staff.endoscopy_nurse", home.id, start);
    worker.path = findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      start,
      destination,
      new Set([home.id]),
    );
    state.employees = [worker];

    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);

    expect(protectedRoomAtWorker(state, worker)).toBe(home.id);
    expect(worker.path.at(-1)).toEqual(destination);
  });

  it("routes stationary and same-room legacy loiterers out to connected public space", () => {
    const { state, unrelated } = connectedFixture();
    const definition = getRoomDefinition(unrelated.roomDefinitionId)!;
    const tiles = getRoomNavigableTiles(unrelated, definition, state.doors);
    const start = getRoomNavigationAnchor(unrelated, definition, "staff");
    const otherInterior = tiles.find((point) => point.x !== start.x || point.y !== start.y)!;
    const stationary = employee(state, "employee.staff-access.stationary", "staff.receptionist", null, start);
    const loiterer = employee(state, "employee.staff-access.loiter", "staff.receptionist", null, start);
    loiterer.path = [start, otherInterior];
    state.employees = [stationary, loiterer];

    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);

    for (const worker of state.employees) {
      expect(worker.location).toEqual(start);
      expect(worker.path.length).toBeGreaterThan(1);
      expect(protectedRoomAtWorker(state, { ...worker, location: worker.path.at(-1)! })).toBeNull();
    }
    for (let tick = 2; tick <= 10; tick += 1) {
      state.facilityTick = tick;
      advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    }
    expect(state.employees.map((worker) => protectedRoomAtWorker(state, worker))).toEqual([null, null]);
  });

  it("keeps direct pending-result and service-operation staff authorized for assigned care", () => {
    const { state, unrelated, publicStart, unrelatedTarget } = connectedFixture();
    const direct = employee(state, "employee.staff-access.direct", "staff.phlebotomist", null, publicStart);
    direct.facilityTask = {
      kind: "perform_service",
      targetId: "pending.staff-access.direct",
      startedAtFacilityTick: 0,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    direct.path = findCareAwareFacilityPath(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      direct.location,
      unrelatedTarget,
      new Set([unrelated.id]),
    );
    const service = employee(state, "employee.staff-access.operation", "staff.endoscopy_nurse", null, publicStart);
    service.facilityTask = {
      kind: "perform_service",
      targetId: "service-operation.staff-access",
      startedAtFacilityTick: 0,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    service.path = direct.path.map((point) => ({ ...point }));
    state.employees = [direct, service];
    state.encounters = {
      direct: {
        id: "direct",
        assignedRoomInstanceId: null,
        pendingResult: {
          operationId: "pending.staff-access.direct",
          phlebotomistId: direct.id,
          patientTravel: { destinationRoomInstanceId: unrelated.id },
        } as PendingResult,
      } as EncounterState,
    };
    state.serviceOperations = [{
      id: "service-operation.staff-access",
      reservedRoomInstanceIds: [unrelated.id],
      reservedEmployeeIds: [service.id],
      providerReservation: null,
    } as ServiceOperationState];

    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);

    expect(direct.path.at(-1)).toEqual(unrelatedTarget);
    expect(service.path.at(-1)).toEqual(unrelatedTarget);
    expect(direct.pathIndex).toBeGreaterThan(0);
    expect(service.pathIndex).toBeGreaterThan(0);
    expect(direct.facilityTask?.targetId).toBe("pending.staff-access.direct");
    expect(service.facilityTask?.targetId).toBe("service-operation.staff-access");
  });

  it("egresses an unrelated room and retries a direct pending task when public access is restored", () => {
    const { state, unrelated, home, homeTarget } = connectedFixture();
    const temporarilyRemovedHall = state.rooms.filter((room) =>
      room.id === "room.staff-access.hall.5" ||
      room.id === "room.staff-access.hall.6"
    );
    state.rooms = state.rooms.filter((room) => !temporarilyRemovedHall.includes(room));
    const definition = getRoomDefinition(unrelated.roomDefinitionId)!;
    const start = getRoomNavigationAnchor(unrelated, definition, "staff");
    const worker = employee(state, "employee.staff-access.retry", "staff.phlebotomist", null, start);
    worker.facilityTask = {
      kind: "perform_service",
      targetId: "pending.staff-access.retry",
      startedAtFacilityTick: 0,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state.employees = [worker];
    state.encounters = {
      retry: {
        id: "retry",
        assignedRoomInstanceId: null,
        pendingResult: {
          operationId: "pending.staff-access.retry",
          phlebotomistId: worker.id,
          patientTravel: { destinationRoomInstanceId: home.id },
        } as PendingResult,
      } as EncounterState,
    };

    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(worker.path.at(-1)).toEqual({ x: 19, y: 21 });
    for (let tick = 2; tick <= 10 && protectedRoomAtWorker(state, worker); tick += 1) {
      state.facilityTick = tick;
      advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    }
    expect(protectedRoomAtWorker(state, worker)).toBeNull();
    expect(worker.facilityTask?.targetId).toBe("pending.staff-access.retry");

    state.rooms.push(...temporarilyRemovedHall);
    state.facilityTick += 1;
    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(worker.path.at(-1)).toEqual(homeTarget);
    expect(protectedRoomIdsAlong(state, worker.path)).not.toContain(unrelated.id);
    expect(worker.facilityTask?.targetId).toBe("pending.staff-access.retry");
    for (let step = 0; step < 20 &&
        (worker.location.x !== homeTarget.x || worker.location.y !== homeTarget.y); step += 1) {
      state.facilityTick += 1;
      advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    }
    expect(worker.location).toEqual(homeTarget);
    expect(protectedRoomAtWorker(state, worker)).toBe(home.id);
    expect(worker.facilityTask?.targetId).toBe("pending.staff-access.retry");
  });
});

function protectedRoomAtWorker(state: GameState, worker: Pick<EmployeeState, "location">): string | null {
  return protectedCareRoomAtPoint(
    state,
    PROTOTYPE_DOMAIN_CONTEXT,
    worker.location,
  )?.id ?? null;
}
