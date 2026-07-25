import { describe, expect, it } from "vitest";

import {
  createInitialGameState,
  gameReducer,
  getEffectiveRoomUpkeep,
  getNextRoomUpgradeCost,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomResaleValue,
  getStaffRoleCount,
  getWorkloadSnapshot,
  rotateDirection,
  type GameState,
  type RoomOrientation,
} from "../src";

function levelOneSandbox(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.cash = 5_000;
  return state;
}

function place(
  state: GameState,
  roomId: string,
  roomDefinitionId: string,
  x: number,
  y: number,
  orientation: RoomOrientation = 0,
): GameState {
  return gameReducer(state, {
    type: "PLACE_ROOM",
    operationId: `place.${roomId}`,
    roomId,
    roomDefinitionId,
    x,
    y,
    orientation,
  });
}

describe("facility remodeling and upgrades", () => {
  it("supports connected duplicate rooms, rotation, upgrades, and safe resale", () => {
    let state = levelOneSandbox("facility-rules");
    state = place(state, "room.exam.1", "room.examination", 7, 2);
    expect(state.operationReceipts["place.room.exam.1"]?.status).toBe(
      "applied",
    );
    expect(
      state.events.find(
        (event) =>
          event.type === "room_placed" &&
          event.target?.id === "room.exam.1",
      ),
    ).toMatchObject({
      definitionId: "alert.facility.room-placed",
      target: { kind: "room", id: "room.exam.1" },
    });

    for (const x of [9, 10, 11, 12]) {
      state = place(
        state,
        `room.hallway.${x}.4`,
        "room.hallway",
        x,
        4,
      );
    }
    state = place(state, "room.exam.2", "room.examination", 11, 2);

    expect(state.operationReceipts["place.room.exam.2"]?.status).toBe(
      "applied",
    );
    expect(
      state.rooms.filter(
        (room) => room.roomDefinitionId === "room.examination",
      ),
    ).toHaveLength(2);

    const examDefinition = getRoomDefinition("room.examination");
    expect(examDefinition).not.toBeNull();
    expect(
      getRoomInstanceFootprint(state, "room.exam.2"),
    ).toEqual({ width: 3, height: 2 });
    expect(
      examDefinition
        ? rotateDirection(examDefinition.defaultDoorSide!, 90)
        : null,
    ).toBe("west");

    const cashBeforeUpgrade = state.cash;
    state = gameReducer(state, {
      type: "UPGRADE_ROOM",
      operationId: "upgrade.room.exam.2",
      roomId: "room.exam.2",
    });
    expect(state.operationReceipts["upgrade.room.exam.2"]?.status).toBe(
      "applied",
    );
    expect(
      state.rooms.find((room) => room.id === "room.exam.2")?.upgradeLevel,
    ).toBe(2);
    expect(state.cash).toBe(cashBeforeUpgrade - 90);
    expect(getEffectiveRoomUpkeep(state, "room.exam.2")).toBe(3);
    expect(getNextRoomUpgradeCost(state, "room.exam.2")).toBe(140);
    expect(getRoomResaleValue(state, "room.exam.2")).toBe(52);
    expect(getWorkloadSnapshot(state).routineLimit).toBe(7);

    const cashBeforeSale = state.cash;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.room.exam.1",
      roomId: "room.exam.1",
    });
    expect(state.operationReceipts["sell.room.exam.1"]?.status).toBe(
      "applied",
    );
    expect(state.cash).toBe(cashBeforeSale + 30);

    const rejectedHallwaySale = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.disconnecting.hallway",
      roomId: "room.hallway.10.4",
    });
    expect(
      rejectedHallwaySale.operationReceipts["sell.disconnecting.hallway"]
        ?.status,
    ).toBe("rejected");

    const rejectedFrontDeskSale = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.front.desk",
      roomId: "room.instance.founder_desk",
    });
    expect(
      rejectedFrontDeskSale.operationReceipts["sell.front.desk"]?.status,
    ).toBe("rejected");
  });

  it("rejects hallway islands before charging the player", () => {
    const state = levelOneSandbox("hallway-island");
    const beforeCash = state.cash;
    const next = place(state, "room.hallway.island", "room.hallway", 0, 0);

    expect(next.operationReceipts["place.room.hallway.island"]?.status).toBe(
      "rejected",
    );
    expect(next.cash).toBe(beforeCash);
  });
});

describe("prototype staff rules", () => {
  it("generates stable staff identity, enforces role caps, and links salary to morale", () => {
    let state = levelOneSandbox("staff-rules");
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.receptionist.1",
      employeeId: "employee.receptionist.1",
      staffRoleDefinitionId: "staff.receptionist",
    });

    const employee = state.employees[0];
    expect(employee?.displayName.length).toBeGreaterThan(0);
    expect(employee?.appearance.version).toBe("pixel-avatar.v1");
    expect(employee?.homeRoomInstanceId).toBe("room.instance.founder_desk");
    expect(employee?.salaryPerExpenseInterval).toBe(3);
    expect(employee?.morale).toBe(75);
    expect(getStaffRoleCount(state, "staff.receptionist")).toBe(1);
    expect(
      state.events.find(
        (event) =>
          event.type === "staff_hired" &&
          event.target?.id === "employee.receptionist.1",
      ),
    ).toMatchObject({
      definitionId: "alert.staff.hired",
      target: {
        kind: "employee",
        id: "employee.receptionist.1",
      },
    });

    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.receptionist.over-cap",
      employeeId: "employee.receptionist.2",
      staffRoleDefinitionId: "staff.receptionist",
    });
    expect(
      state.operationReceipts["hire.receptionist.over-cap"]?.status,
    ).toBe("rejected");

    state = gameReducer(state, {
      type: "SET_EMPLOYEE_SALARY",
      operationId: "salary.receptionist.raise",
      employeeId: "employee.receptionist.1",
      salaryPerExpenseInterval: 8,
    });
    expect(
      state.operationReceipts["salary.receptionist.raise"]?.status,
    ).toBe("applied");
    expect(state.employees[0]?.salaryPerExpenseInterval).toBe(8);
    expect(state.employees[0]?.morale).toBe(100);

    const initialLocation = { ...state.employees[0]!.location };
    for (let index = 1; index <= 8; index += 1) {
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId: `move.staff.${index}`,
      });
    }
    expect(state.employees[0]?.lastMovedAtFacilityTick).toBe(8);
    expect(state.employees[0]?.location).not.toEqual(initialLocation);
  });
});
