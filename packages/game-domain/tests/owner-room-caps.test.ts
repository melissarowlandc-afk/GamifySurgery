import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getRoomDefinition,
  getRoomResaleValue,
  getRotatedFootprint,
  roomsOverlap,
  serializeGameState,
  type GameState,
  type PlacedRoom,
} from "../src";
import { synchronizeRoomUpkeepOutages } from "../src/room-upkeep-outages";

// D-2026-11-18-09. Test owner numbers, never derive the expected cap from balance.
const changedCaps = [
  { id: "room.ambulatory_or", cap: 4, change: "raised" },
  { id: "room.endoscopy", cap: 6, change: "raised" },
  { id: "room.xray", cap: 2, change: "raised" },
  { id: "room.ultrasound", cap: 2, change: "raised" },
  { id: "room.ct", cap: 2, change: "raised" },
  { id: "room.surgeon_office", cap: 4, change: "raised" },
  { id: "room.gift_shop", cap: 2, change: "raised" },
  { id: "room.indoor_garden", cap: 4, change: "raised" },
  { id: "room.examination", cap: 10, change: "lowered" },
  { id: "room.waiting", cap: 3, change: "lowered" },
  { id: "room.bathroom", cap: 6, change: "lowered" },
  { id: "room.laboratory", cap: 1, change: "lowered" },
  { id: "room.coffee_kiosk", cap: 5, change: "lowered" },
  { id: "room.evs_closet", cap: 6, change: "lowered" },
] as const;

function clinic(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.owner-room-caps",
    campaignSeed: "owner-room-caps-synthetic",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 5;
  state.cash = 1_000_000;
  state.cashCents = 100_000_000;
  state.paused = true;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.employees = [];
  return state;
}

const count = (state: GameState, id: string) => state.rooms.filter(room => room.roomDefinitionId === id).length;

// Find actual vacant space before issuing one intent. Never retry rejected
// placement commands: an unexpected geometry/dependency failure must fail loudly.
function emptySite(state: GameState, id: string): { x: number; y: number } {
  const definition = getRoomDefinition(id)!;
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const size = getRotatedFootprint(definition, 0);
  for (let y = 0; y <= facility.gridHeight - size.height; y++) {
    for (let x = 0; x <= facility.gridWidth - size.width; x++) {
      const candidate: PlacedRoom = {
        id: "candidate", roomDefinitionId: id, x, y, orientation: 0,
        doorSide: null, upgradeLevel: 1, cleanliness: 100,
      };
      if (state.rooms.every(room => !roomsOverlap(candidate, definition, room, getRoomDefinition(room.roomDefinitionId)!))) {
        return { x, y };
      }
    }
  }
  throw new Error(`Synthetic clinic has no vacant site for ${id}`);
}

function place(state: GameState, id: string, key: string): GameState {
  return gameReducer(state, {
    type: "PLACE_ROOM", operationId: key, roomId: `instance.${key}`,
    roomDefinitionId: id, ...emptySite(state, id),
  });
}

function dependencies(state: GameState, id: string): GameState {
  for (const required of getRoomDefinition(id)!.requiredRoomDefinitionIds) {
    if (count(state, required)) continue;
    state = dependencies(state, required);
    const key = `dependency.${required}`;
    state = place(state, required, key);
    expect(state.operationReceipts[key], `Required room ${required}`).toMatchObject({ status: "applied" });
  }
  return state;
}

function expectCapRejection(before: GameState, after: GameState, id: string, cap: number, key: string) {
  expect(after.operationReceipts[key]).toMatchObject({
    status: "rejected",
    message: `${getRoomDefinition(id)!.displayName} has reached its maximum of ${cap}.`,
  });
  expect(after.rooms).toEqual(before.rooms);
  expect(after.doors).toEqual(before.doors);
  expect(after.cashCents).toBe(before.cashCents);
  expect(after.learningHistories).toEqual(before.learningHistories);
}

function grandfatheredSave(): GameState {
  const state = clinic();
  // A pre-decision clinic: 14 exams and two laboratories, all legal, distinct
  // footprints. The amended cap must never delete or silently sell these rooms.
  for (let index = 0; index < 14; index++) {
    state.rooms.push({
      id: `legacy.exam.${index}`, roomDefinitionId: "room.examination",
      x: 2 + 5 * (index % 10), y: 2 + 6 * Math.floor(index / 10),
      orientation: index === 0 ? 270 : 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
    });
  }
  for (let index = 0; index < 2; index++) {
    state.rooms.push({
      id: `legacy.lab.${index}`, roomDefinitionId: "room.laboratory",
      x: 2 + 6 * index, y: 16, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
    });
  }
  // A settled pre-decision save includes ordinary outage metadata for these
  // unstaffed rooms. Hydration must preserve every saved room and all its fields.
  synchronizeRoomUpkeepOutages(state, PROTOTYPE_DOMAIN_CONTEXT);
  return state;
}

describe("owner room caps through real construction and saved-clinic hydration", () => {
  it.each(changedCaps)("builds $id to its $change cap $cap and rejects exactly one more", ({ id, cap }) => {
    let state = dependencies(clinic(), id);
    expect(count(state, id)).toBe(0);
    for (let built = 1; built <= cap; built++) {
      const beforeCash = state.cashCents;
      const key = `owner.build.${built}`;
      state = place(state, id, key);
      expect(state.operationReceipts[key], `${id}: construction ${built}/${cap}: ${state.operationReceipts[key]?.message}`)
        .toMatchObject({ status: "applied" });
      expect(count(state, id)).toBe(built);
      expect(state.cashCents).toBe(beforeCash - getRoomDefinition(id)!.constructionCost * 100);
    }
    const before = state;
    state = place(state, id, "owner.over-cap");
    expectCapRejection(before, state, id, cap, "owner.over-cap");
  });

  it("keeps all 14 saved exams and both laboratories intact through two real codec reloads", () => {
    const before = grandfatheredSave();
    let loaded = deserializeGameState(serializeGameState(before));
    for (let reload = 0; reload < 2; reload++) {
      expect(loaded.rooms).toEqual(before.rooms);
      expect(loaded.doors).toEqual(before.doors);
      expect(count(loaded, "room.examination")).toBe(14);
      expect(count(loaded, "room.laboratory")).toBe(2);
      expect(loaded.cashCents).toBe(before.cashCents);
      expect(loaded.learningHistories).toEqual(before.learningHistories);
      expect(loaded.operationReceipts).toEqual(before.operationReceipts);
      loaded = deserializeGameState(serializeGameState(loaded));
    }
  });

  it.each([
    { id: "room.examination", instance: "legacy.exam.0", initialCount: 14 },
    { id: "room.laboratory", instance: "legacy.lab.0", initialCount: 2 },
  ])("keeps over-cap $id movable, rotatable, remodelable and sellable after hydration", ({ id, instance, initialCount }) => {
    const loaded = deserializeGameState(serializeGameState(grandfatheredSave()));
    let state = gameReducer(loaded, { type: "MOVE_ROOM", operationId: "legacy.move", roomId: instance, x: 58, y: 5 });
    expect(state.operationReceipts["legacy.move"]).toMatchObject({ status: "applied" });
    expect(state.rooms.find(room => room.id === instance)).toMatchObject({ x: 58, y: 5 });
    const beforeRotation = state.rooms.find(room => room.id === instance)!.orientation;
    state = gameReducer(state, { type: "ROTATE_ROOM", operationId: "legacy.rotate", roomId: instance });
    expect(state.operationReceipts["legacy.rotate"]).toMatchObject({ status: "applied" });
    expect(state.rooms.find(room => room.id === instance)!.orientation).toBe((beforeRotation + 90) % 360);
    state = gameReducer(state, {
      type: "APPLY_REMODEL_PLAN", operationId: "legacy.remodel",
      rooms: [{ roomId: instance, x: 58, y: 12, orientation: 0 }],
    });
    expect(state.operationReceipts["legacy.remodel"]).toMatchObject({ status: "applied" });
    expect(state.rooms.find(room => room.id === instance)).toMatchObject({ x: 58, y: 12, orientation: 0 });
    expect(count(state, id)).toBe(initialCount);
    expect(state.cashCents).toBe(loaded.cashCents);
    expect(state.rooms.map(room => room.id)).toEqual(loaded.rooms.map(room => room.id));
    const refund = getRoomResaleValue(state, instance)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "legacy.sale", roomId: instance });
    expect(state.operationReceipts["legacy.sale"]).toMatchObject({ status: "applied" });
    expect(count(state, id)).toBe(initialCount - 1);
    expect(state.rooms.some(room => room.id === instance)).toBe(false);
    expect(state.cashCents).toBe(loaded.cashCents + refund * 100);
    expect(state.learningHistories).toEqual(loaded.learningHistories);
    expect(deserializeGameState(serializeGameState(state)).rooms).toEqual(state.rooms);
  });

  it.each([
    { id: "room.examination", cap: 10, initialCount: 14 },
    { id: "room.laboratory", cap: 1, initialCount: 2 },
  ])("blocks new $id at and above $cap, including after sales, until strictly below the cap", ({ id, cap, initialCount }) => {
    let state = deserializeGameState(serializeGameState(grandfatheredSave()));
    for (let remaining = initialCount; remaining >= cap; remaining--) {
      expect(count(state, id)).toBe(remaining);
      const key = `legacy.block.${remaining}`;
      const rejected = place(state, id, key);
      expectCapRejection(state, rejected, id, cap, key);
      state = rejected;
      const room = state.rooms.find(room => room.roomDefinitionId === id)!;
      const saleKey = `legacy.sale.${remaining}`;
      const beforeCash = state.cashCents;
      const refund = getRoomResaleValue(state, room.id)!;
      state = gameReducer(state, { type: "SELL_ROOM", operationId: saleKey, roomId: room.id });
      expect(state.operationReceipts[saleKey]).toMatchObject({ status: "applied" });
      expect(state.cashCents).toBe(beforeCash + refund * 100);
      state = deserializeGameState(serializeGameState(state));
      expect(count(state, id)).toBe(remaining - 1);
    }
    expect(count(state, id)).toBe(cap - 1);
    state = place(state, id, "legacy.below-cap");
    expect(state.operationReceipts["legacy.below-cap"]).toMatchObject({ status: "applied" });
    expect(count(state, id)).toBe(cap);
    expectCapRejection(state, place(state, id, "legacy.full-again"), id, cap, "legacy.full-again");
  });
});
