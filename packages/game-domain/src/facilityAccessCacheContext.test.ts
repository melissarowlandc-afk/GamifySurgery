import { expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { createInitialGameState } from "./index";
import { getCachedFacilityAccessValidation } from "./facility-access-cache";
import * as doors from "./doors";
import type { DomainContext } from "./types";

vi.mock("./doors", async importOriginal => {
  const actual = await importOriginal<typeof import("./doors")>();
  return { ...actual, validateFacilityAccess: vi.fn(actual.validateFacilityAccess) };
});

it("reuses exact access validation across ephemeral command-flag contexts and keeps returned arrays private", () => {
  const facility = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility);
  const context: DomainContext = { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease, facility } };
  const state = createInitialGameState(context), validate = vi.mocked(doors.validateFacilityAccess); validate.mockClear();
  const original = getCachedFacilityAccessValidation(state, context);
  expect(validate).toHaveBeenCalledOnce();
  for (let i = 0; i < 20; i++) {
    const wrapped = { ...context, guidanceTipsDeliveryBlocked: i % 2 === 0 };
    const result = getCachedFacilityAccessValidation(state, wrapped);
    expect(JSON.stringify(result)).toBe(JSON.stringify(original)); expect(result.issues).not.toBe(original.issues);
    result.unreachableRoomIds.push("fixture.private-change");
  }
  expect(validate).toHaveBeenCalledOnce();
  expect(getCachedFacilityAccessValidation(state, context)).toEqual(original);
});

it("matches fresh validation after geometry, navigation definitions, bounds and protected-room mutations", () => {
  const facility = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility);
  const context: DomainContext = { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease, facility } };
  const state = createInitialGameState(context), validate = vi.mocked(doors.validateFacilityAccess); validate.mockClear();
  const compare = () => {
    const actual = getCachedFacilityAccessValidation(state, { ...context });
    const expected = doors.validateFacilityAccess(state.rooms, state.doors,
      id => facility.roomDefinitions.find(definition => definition.id === id) ?? null,
      facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  };
  compare(); state.rooms[0]!.x++; compare(); state.rooms[0]!.x--; compare();
  facility.gridWidth--; compare(); facility.gridHeight--; compare();
  facility.protectedRoomDefinitionIds.push("room.public-cache-fixture"); compare();
  const room = state.rooms.find(room => facility.roomDefinitions.find(definition => definition.id === room.roomDefinitionId)?.kind !== "hallway")!;
  const definition = facility.roomDefinitions.find(definition => definition.id === room.roomDefinitionId)!;
  if (!definition.navigation) throw Error("Public fixture must have navigation metadata");
  definition.navigation = { ...definition.navigation, blockedTiles: [{ x: 0, y: 0 }] }; compare();
  definition.navigation.blockedTiles.push({ x: 1, y: 0 }); compare();
});
