import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getRoomNavigationAnchor,
  getRoomDefinition,
  getRoomSalePreview,
  serializeGameState,
  type GameState,
} from "../src";

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `departure.tick.${index}.${next.facilityTick}` });
  }
  return next;
}

function fixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "room-sale-departure", campaignSeed: "room-sale-departure", createdAtRealMs: 0 });
  state.facilityLevel = 2;
  state.cash = 10_000;
  state.cashCents = 1_000_000;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  const room = { id: "room.departure.phleb", roomDefinitionId: "room.phlebotomy", x: 29, y: 20, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
  state.rooms.push(room, ...Array.from({ length: 9 }, (_, index) => ({ id: `hall.departure.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
  state.doors.push({ id: "door.departure.phleb", roomId: room.id, side: "east", offset: 1, exterior: false }, { id: "door.departure.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  const definition = getRoomDefinition(room.roomDefinitionId, PROTOTYPE_DOMAIN_CONTEXT)!;
  const location = getRoomNavigationAnchor(room, definition, "staff");
  state.employees.push({ id: "employee.departure.phleb", staffRoleDefinitionId: "staff.phlebotomist", displayName: "Departure Phlebotomist", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 28, morale: 75, trainingLevel: 1, homeRoomInstanceId: room.id, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 9999, facilityTask: null });
  return state;
}

describe("room sale departing employee lifecycle", () => {
  it("retains a dismissed employee through reload, then removes them only after an off-map exit", () => {
    let state = fixture();
    const roomId = "room.departure.phleb";
    const original = { ...state.employees[0]!.location };
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "sell.departure.phleb", roomId, saleConfirmationToken: preview.confirmationToken });
    expect(state.employees).toEqual([]);
    expect(state.departingEmployees?.[0]).toMatchObject({ id: "employee.departure.phleb", location: original, appearance: state.founder.appearance, salaryPerExpenseInterval: 0 });

    state = deserializeGameState(serializeGameState(state));
    const reloadedAppearance = state.departingEmployees?.[0]?.appearance;
    expect(state.departingEmployees?.[0]).toMatchObject({ id: "employee.departure.phleb", location: original, path: [original] });
    state = deserializeGameState(serializeGameState(state));
    expect(state.departingEmployees?.[0]?.appearance).toEqual(reloadedAppearance);
    state = advance(state, 1);
    expect(state.departingEmployees?.[0]?.path.length).toBeGreaterThan(1);
    expect(state.departingEmployees?.[0]?.location).not.toEqual(original);

    const speed = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick;
    let removed = false;
    for (let minute = 0; minute < 120; minute += 1) {
      const before = state.departingEmployees?.[0];
      expect(before).toBeDefined();
      state = advance(state, 1);
      const after = state.departingEmployees?.[0];
      if (!after) {
        const endpoint = before!.path.at(-1)!;
        expect(before!.pathIndex).toBeGreaterThanOrEqual(before!.path.length - 1 - speed);
        expect(endpoint.x < 0 || endpoint.x >= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth).toBe(true);
        removed = true;
        break;
      }
      expect(after.location).toEqual(after.path[after.pathIndex]);
      expect(Math.abs(after.location.x - before!.location.x) + Math.abs(after.location.y - before!.location.y)).toBeLessThanOrEqual(speed);
    }
    expect(removed).toBe(true);
    expect(state.departingEmployees).toEqual([]);
  });
});
