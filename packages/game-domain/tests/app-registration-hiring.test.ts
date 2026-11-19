import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  getRoomDefinition,
  getRoomNavigationAnchor,
  getRoomSalePreview,
  getRoomStaffCapacity,
  serializeGameState,
  staffStillEligibleEntries,
  type EmployeeState,
  type GameState,
} from "../src";
import { APP_HOME_COUNTS, APP_POSTS, addExpandedAppHomes, appHiringClinic, applyAppFixtureCommand, hireApp } from "./app-registration.fixture";
import accepted from "../../../tests/fixtures/app-registration-acceptance.json";

function expectHire(state: GameState, number: number): GameState {
  const before = state.employees.map(employee => ({ id: employee.id, appearance: { ...employee.appearance } }));
  const next = hireApp(state, number);
  const receipt = next.operationReceipts[`app.hire.${number}`];
  expect(receipt, `B-016 hire ${number}: ${receipt?.message}`).toMatchObject({ status: "applied" });
  expect(next.employees).toHaveLength(state.employees.length + 1);
  expect(next.employees.slice(0, -1).map(employee => ({ id: employee.id, appearance: employee.appearance }))).toEqual(before);
  return next;
}

function expectDistinctAppHomes(state: GameState, expected: number) {
  const apps = state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.app");
  expect(apps).toHaveLength(expected);
  expect(apps.every(employee => employee.appearance.roleStyle === "app" && typeof employee.appearance.stillId === "string")).toBe(true);
  expect(new Set(apps.map(employee => employee.homeRoomInstanceId)).size).toBe(expected);
  expect(new Set(apps.map(employee => employee.appearance.stillId)).size).toBe(expected);
}

describe("B-016 owner-approved APP art must support the actual built posts", () => {
  it("hires 19 distinct APPs into 19 constructed homes without an eleventh-hire art ceiling", () => {
    let state = appHiringClinic();
    expect(APP_POSTS).toBe(19);
    for (const [id, count] of APP_HOME_COUNTS) {
      expect(state.rooms.filter(room => room.roomDefinitionId === id)).toHaveLength(count);
    }
    expect(getRoomStaffCapacity(state, "staff.app")).toMatchObject({ capacity: 19, builtRoomCount: 19 });
    for (let number = 1; number <= APP_POSTS; number++) state = expectHire(state, number);
    expectDistinctAppHomes(state, 19);
    expect(deserializeGameState(serializeGameState(state)).employees).toEqual(state.employees);
  });

  it("hires a replacement and fills 19 homes while a departing APP keeps their occupied look", () => {
    // Ten occupied homes force the real room-sale path to retain a dismissed
    // employee. Extra posts are then constructed, never borrowed from cap data.
    let state = appHiringClinic(false);
    for (let number = 1; number <= 10; number++) state = expectHire(state, number);
    const employee = state.employees[0]!;
    const home = state.rooms.find(room => room.id === employee.homeRoomInstanceId)!;
    // A synthetic paused save with this legitimately hired person settled at
    // their real desk; their visible departure cannot already be off-map.
    const point = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    Object.assign(employee, { location: point, path: [point], pathIndex: 0, facilityTask: null });
    const heldAppearance = { ...employee.appearance };
    const preview = getRoomSalePreview(state, home.id, PROTOTYPE_DOMAIN_CONTEXT)!;
    expect(preview.dismissedEmployees).toHaveLength(1);
    state = applyAppFixtureCommand(state, { type: "SELL_ROOM", operationId: "app.departure.sale",
      roomId: home.id, saleConfirmationToken: preview.confirmationToken });
    expect(state.departingEmployees).toHaveLength(1);
    expect(state.departingEmployees![0]).toMatchObject({ id: employee.id, appearance: heldAppearance, location: point });
    state = applyAppFixtureCommand(state, { type: "PLACE_ROOM", operationId: "app.departure.rebuild",
      roomId: home.id, roomDefinitionId: home.roomDefinitionId, x: home.x, y: home.y, orientation: home.orientation });
    state = applyAppFixtureCommand(state, { type: "PLACE_DOOR", operationId: "app.departure.door",
      doorId: `door.rebuilt.${home.id}`, roomId: home.id, side: "south", offset: 1 });
    state = addExpandedAppHomes(state);
    expect(getRoomStaffCapacity(state, "staff.app").capacity).toBe(19);
    for (let number = 11; number <= 20; number++) state = expectHire(state, number);
    expectDistinctAppHomes(state, 19);
    expect(state.departingEmployees![0]!.appearance).toEqual(heldAppearance);
    const visibleLooks = [...state.employees, ...state.departingEmployees!].map(row => row.appearance.stillId);
    expect(new Set(visibleLooks).size).toBe(20);
    const loaded = deserializeGameState(serializeGameState(state));
    expect(loaded.employees).toEqual(state.employees);
    expect(loaded.departingEmployees).toEqual(state.departingEmployees);
  });

  it("loads all ten frozen existing APP looks and employee records identically, adding zero saved bytes per employee", () => {
    const state = appHiringClinic();
    // A frozen synthetic pre-registration roster, not regenerated from the
    // expanded selector. Adding candidates must never re-roll a saved person.
    state.employees = structuredClone(accepted.legacyEmployees) as EmployeeState[];
    expect(new Set(state.employees.map(row => row.appearance.stillId))).toEqual(new Set(accepted.existing.map(row => row.id)));
    let loaded = deserializeGameState(serializeGameState(state));
    for (let reload = 0; reload < 2; reload++) {
      expect(loaded.employees).toEqual(accepted.legacyEmployees);
      const saved = JSON.parse(serializeGameState(loaded)) as { employees: unknown[] };
      expect(saved.employees).toEqual(accepted.legacyEmployees);
      for (let index = 0; index < saved.employees.length; index++) {
        expect(Buffer.byteLength(JSON.stringify(saved.employees[index])))
          .toBe(Buffer.byteLength(JSON.stringify(accepted.legacyEmployees[index])));
      }
      expect(loaded.learningHistories).toEqual(state.learningHistories);
      loaded = deserializeGameState(serializeGameState(loaded));
    }
  });

  it("persists any registered APP with zero art-metadata bytes and no growth beyond the existing per-employee byte budget", () => {
    const clinic = appHiringClinic();
    const pool = staffStillEligibleEntries("staff.app");
    expect(pool.length).toBeGreaterThanOrEqual(10);
    const longestExistingId = accepted.existing.reduce((longest, row) =>
      Buffer.byteLength(row.id) > Buffer.byteLength(longest) ? row.id : longest, "");
    for (const design of pool) {
      const expected = structuredClone(accepted.legacyEmployees[0]!) as EmployeeState;
      const prior = { ...expected, appearance: { ...expected.appearance, stillId: longestExistingId } };
      expected.appearance.stillId = design.stillId;
      clinic.employees = [expected];
      const loaded = deserializeGameState(serializeGameState(clinic));
      const saved = JSON.parse(serializeGameState(loaded)) as { employees: EmployeeState[] };
      expect(saved.employees).toEqual([expected]);
      // No persisted pose/age/sex/URL/contact/cache/catalog payload. Runtime IDs
      // were not final in the handoffs: compact IDs must also fit the existing
      // largest identity reference, rather than silently increasing save bytes.
      expect(Buffer.byteLength(JSON.stringify(saved.employees[0])))
        .toBe(Buffer.byteLength(JSON.stringify(expected)));
      expect(Buffer.byteLength(JSON.stringify(saved.employees[0])), `Saved-byte growth for APP ${design.stillId}`)
        .toBeLessThanOrEqual(Buffer.byteLength(JSON.stringify(prior)));
    }
  });
});
