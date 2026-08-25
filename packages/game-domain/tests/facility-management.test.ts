import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getNextRoomUpgradeCost,
  getRoomResaleValue,
  getStaffRoleCount,
  validateFacilityAccess,
  type CardinalDirection,
  type GameState,
} from "../src";

function sandbox(seed: string, level: 0 | 1 = 1): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = level;
  state.cashCents = 500_000;
  state.cash = 5_000;
  state.encounters = {};
  return state;
}

function placeRoom(
  state: GameState,
  id: string,
  definitionId: string,
  x: number,
  y: number,
): GameState {
  return gameReducer(state, {
    type: "PLACE_ROOM",
    operationId: `place.${id}`,
    roomId: id,
    roomDefinitionId: definitionId,
    x,
    y,
  });
}

function placeDoor(
  state: GameState,
  id: string,
  roomId: string,
  side: CardinalDirection,
  offset: number,
): GameState {
  return gameReducer(state, {
    type: "PLACE_DOOR",
    operationId: `place.${id}`,
    doorId: id,
    roomId,
    side,
    offset,
  });
}

function access(state: GameState) {
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  return validateFacilityAccess(
    state.rooms,
    state.doors,
    (definitionId) =>
      facility.roomDefinitions.find(
        (definition) => definition.id === definitionId,
      ) ?? null,
    facility.gridWidth,
    facility.gridHeight,
    new Set(facility.protectedRoomDefinitionIds),
  );
}

describe("explicit-door construction and renovation", () => {
  it("places the room footprint first and makes a $0 explicit door operational", () => {
    let state = sandbox("explicit-door", 0);
    const startingCash = state.cash;
    state = placeRoom(
      state,
      "room.exam.level-zero",
      "room.examination",
      34,
      26,
    );

    expect(
      state.operationReceipts["place.room.exam.level-zero"]?.status,
    ).toBe("applied");
    expect(state.cash).toBe(startingCash - 160);
    expect(access(state)).toMatchObject({
      valid: false,
      unreachableRoomIds: ["room.exam.level-zero"],
    });

    const cashBeforeDoor = state.cash;
    state = placeDoor(
      state,
      "door.exam.level-zero",
      "room.exam.level-zero",
      "south",
      1,
    );
    expect(state.operationReceipts["place.door.exam.level-zero"]?.status).toBe(
      "applied",
    );
    expect(state.cash).toBe(cashBeforeDoor);
    expect(access(state).valid).toBe(true);
  });

  it("supports rotation, upgrades, resale, and removes attached doors on demolition", () => {
    let state = sandbox("renovation", 0);
    state = placeRoom(
      state,
      "room.exam.renovate",
      "room.examination",
      34,
      26,
    );
    state = placeDoor(
      state,
      "door.exam.renovate",
      "room.exam.renovate",
      "south",
      1,
    );
    state = gameReducer(state, {
      type: "UPGRADE_ROOM",
      operationId: "upgrade.exam",
      roomId: "room.exam.renovate",
    });
    expect(
      state.rooms.find((room) => room.id === "room.exam.renovate")
        ?.upgradeLevel,
    ).toBe(2);
    expect(
      state.events.find(
        (event) =>
          event.id === "event.room-upgraded.room.exam.renovate.2",
      ),
    ).toMatchObject({
      definitionId: "alert.success.room-upgraded",
      alertCategory: "success",
      alertVariantId: expect.any(String),
    });
    expect(getNextRoomUpgradeCost(state, "room.exam.renovate")).toBe(140);
    expect(getRoomResaleValue(state, "room.exam.renovate")).toBe(62);

    state = gameReducer(state, {
      type: "MOVE_ROOM",
      operationId: "move.exam",
      roomId: "room.exam.renovate",
      x: 34,
      y: 25,
    });
    state = gameReducer(state, {
      type: "ROTATE_ROOM",
      operationId: "rotate.exam",
      roomId: "room.exam.renovate",
    });
    expect(
      state.doors.find((door) => door.id === "door.exam.renovate")?.side,
    ).toBe("west");

    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.exam",
      roomId: "room.exam.renovate",
    });
    expect(state.operationReceipts["sell.exam"]?.status).toBe("applied");
    expect(state.doors.some((door) => door.id === "door.exam.renovate")).toBe(
      false,
    );
  });

  it("does not remove a doorway while a character occupies its room", () => {
    let state = sandbox("occupied-door", 0);
    state = placeRoom(
      state,
      "room.exam.occupied",
      "room.examination",
      34,
      26,
    );
    state = placeDoor(
      state,
      "door.exam.occupied",
      "room.exam.occupied",
      "south",
      1,
    );
    state.employees.push({
      id: "employee.route-guard",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Route Guard",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 100,
      trainingLevel: 1,
      homeRoomInstanceId: null,
      location: { x: 35, y: 27 },
      path: [{ x: 35, y: 27 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 100,
    });

    state = gameReducer(state, {
      type: "REMOVE_DOOR",
      operationId: "remove.occupied-door",
      doorId: "door.exam.occupied",
    });

    expect(
      state.operationReceipts["remove.occupied-door"]?.status,
    ).toBe("rejected");
    expect(
      state.doors.some(
        (door) => door.id === "door.exam.occupied",
      ),
    ).toBe(true);
  });

  it("requires X-ray patient access and a separate direct control-room door", () => {
    let state = sandbox("xray-access");
    state = placeRoom(state, "room.exam", "room.examination", 34, 26);
    state = placeDoor(state, "door.exam", "room.exam", "south", 1);

    for (const [id, x, y] of [
      ["hall.32.26", 32, 26],
      ["hall.32.27", 32, 27],
      ["hall.32.28", 32, 28],
    ] as const) {
      state = placeRoom(state, id, "room.hallway", x, y);
    }
    state = placeDoor(
      state,
      "door.front.internal",
      "room.instance.founder_desk",
      "west",
      0,
    );
    state = placeRoom(
      state,
      "room.control",
      "room.imaging_control",
      31,
      24,
    );
    state = placeDoor(
      state,
      "door.control.public",
      "room.control",
      "south",
      1,
    );
    state = placeRoom(state, "room.xray", "room.xray", 33, 23);
    expect(
      state.events.find(
        (event) => event.id === "event.room-placed.room.xray",
      ),
    ).toMatchObject({
      definitionId: "alert.success.xray-constructed",
      alertCategory: "success",
      alertVariantId: expect.any(String),
    });
    state = placeDoor(
      state,
      "door.xray.patient",
      "room.xray",
      "south",
      2,
    );

    expect(access(state).issues).toContain(
      "X-ray Room must share a wall and internal door with an Imaging Control Room.",
    );

    state = placeDoor(
      state,
      "door.xray.control",
      "room.xray",
      "west",
      1,
    );
    expect(access(state).valid).toBe(true);
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.stageDefinitions[1]
        ?.requiredRoomDefinitionIds,
    ).toEqual(["room.xray", "room.minor_procedure"]);
  });
});

describe("prototype staff", () => {
  it("persists identity, enforces caps, and uses low-frequency room idling", () => {
    let state = sandbox("staff");
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.receptionist",
      employeeId: "employee.receptionist",
      staffRoleDefinitionId: "staff.receptionist",
    });
    const employee = state.employees[0]!;
    expect(employee.appearance.version).toBe("pixel-avatar.v1");
    expect(employee.homeRoomInstanceId).toBe(
      "room.instance.founder_desk",
    );
    expect(
      employee.path[0]!.x < 0 ||
        employee.path[0]!.x >=
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth,
    ).toBe(true);
    expect(
      employee.path.every((point, index, path) => {
        const previous = path[index - 1];
        return (
          !previous ||
          Math.abs(point.x - previous.x) +
            Math.abs(point.y - previous.y) ===
            1
        );
      }),
    ).toBe(true);
    expect(employee.path.at(-1)).toEqual({ x: 35, y: 29 });
    expect(employee.nextIdleActionAtFacilityTick).toBeGreaterThanOrEqual(10);
    expect(getStaffRoleCount(state, "staff.receptionist")).toBe(1);
    expect(
      state.events.find(
        (event) =>
          event.id ===
          "event.staff-hired.employee.receptionist",
      ),
    ).toMatchObject({
      definitionId: "alert.success.receptionist-hired",
      alertCategory: "success",
      alertVariantId: expect.any(String),
    });

    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.receptionist.again",
      employeeId: "employee.receptionist.2",
      staffRoleDefinitionId: "staff.receptionist",
    });
    expect(
      state.operationReceipts["hire.receptionist.again"]?.status,
    ).toBe("rejected");

    state = gameReducer(state, {
      type: "SET_EMPLOYEE_SALARY",
      operationId: "salary.receptionist",
      employeeId: "employee.receptionist",
      salaryPerExpenseInterval: 30,
    });
    expect(state.employees[0]).toMatchObject({
      salaryPerExpenseInterval: 30,
      morale: 100,
    });
  });

  it("fires an existing employee without refunding cash and records the action", () => {
    let state = sandbox("fire-staff");
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.to-fire",
      employeeId: "employee.to-fire",
      staffRoleDefinitionId: "staff.receptionist",
    });
    const cashAfterHire = state.cash;

    state = gameReducer(state, {
      type: "FIRE_EMPLOYEE",
      operationId: "fire.employee",
      employeeId: "employee.to-fire",
    });

    expect(state.employees).toHaveLength(0);
    expect(state.cash).toBe(cashAfterHire);
    expect(state.operationReceipts["fire.employee"]).toMatchObject({
      status: "applied",
      commandType: "FIRE_EMPLOYEE",
    });
    expect(state.events.at(-1)).toMatchObject({
      type: "staff_fired",
      definitionId: "alert.staff.fired",
      message: expect.stringContaining("was fired"),
    });

    const rejected = gameReducer(state, {
      type: "FIRE_EMPLOYEE",
      operationId: "fire.employee.again",
      employeeId: "employee.to-fire",
    });
    expect(
      rejected.operationReceipts["fire.employee.again"],
    ).toMatchObject({ status: "rejected" });
  });
});
