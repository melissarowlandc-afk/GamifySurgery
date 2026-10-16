import { describe, expect, it } from "vitest";
import {
  PREFERRED_STAFF_STILL_IDS_BY_ROLE,
  PROTOTYPE_DOMAIN_CONTEXT,
  RANDOM_STREAMS,
  createInitialGameState,
  deserializeGameState,
  deterministicInteger,
  gameReducer,
  selectStaffStillId,
  serializeGameState,
  staffStillEligibleEntries,
  type GameState,
} from "../src";

const ROLE = "staff.radiologist";
const ORDER = [
  "level3-roster-v2.001", "level3-roster-v2.002",
  "level3-roster-v2.003", "level3-roster-v2.004",
];

function clinic(seed = "radiologist-hiring-order"): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`, campaignSeed: seed, createdAtRealMs: 0,
  });
  state.facilityLevel = 3;
  state.cash = 20_000; state.cashCents = 2_000_000;
  state.encounters = {}; state.serviceOperations = [];
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 9 }, (_, index) => ({
      id: `hall.readers.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const,
    })),
  );
  state.doors.push(
    { id: "door.readers", roomId: "room.readers", side: "west", offset: 1, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  return state;
}

function occupied(state: GameState): Set<string | undefined> {
  return new Set([...state.employees, ...(state.departingEmployees ?? [])]
    .map((employee) => employee.appearance.stillId));
}

function hire(state: GameState, employeeId: string): GameState {
  const next = gameReducer(state, {
    type: "HIRE_STAFF", operationId: `hire.${employeeId}`, employeeId, staffRoleDefinitionId: ROLE,
  });
  expect(next.operationReceipts[`hire.${employeeId}`]?.status).toBe("applied");
  return next;
}

function hireFour(state: GameState): GameState {
  for (let index = 0; index < ORDER.length; index += 1) state = hire(state, `reader.${index}`);
  return state;
}

// The pre-change seeded rule is the compatibility contract for all other roles
// and for radiologists once every ordered look is reserved.
function seededChoice(seed: string, employeeId: string, role: string, used: ReadonlySet<string | undefined>) {
  const pool = staffStillEligibleEntries(role);
  const key = `${employeeId}:${role}:staff-still.v1`;
  const preferred = pool[deterministicInteger(seed, RANDOM_STREAMS.staffAppearance, key, pool.length)];
  if (preferred && !used.has(preferred.stillId)) return preferred.stillId;
  const free = pool.filter((entry) => !used.has(entry.stillId));
  return free.length > 0
    ? free[deterministicInteger(seed, RANDOM_STREAMS.staffAppearance, key, free.length)]?.stillId
    : undefined;
}

describe("Severance radiologists first", () => {
  it("defines the preference as ordered eligible catalog data for radiologists only", () => {
    expect(Object.keys(PREFERRED_STAFF_STILL_IDS_BY_ROLE)).toEqual([ROLE]);
    expect(PREFERRED_STAFF_STILL_IDS_BY_ROLE[ROLE]).toEqual(ORDER);
    const eligible = staffStillEligibleEntries(ROLE).map((entry) => entry.stillId);
    for (const stillId of ORDER) expect(eligible).toContain(stillId);
  });

  it.each(["owner-campaign-a", "owner-campaign-b"])(
    "selects and hires the first four in order in %s, independent of employee keys",
    (seed) => {
      let state = clinic(seed);
      for (const [index, stillId] of ORDER.entries()) {
        const employeeId = `different.employee.${seed}.${index * 7 + 13}`;
        const preview = selectStaffStillId(seed, employeeId, ROLE, undefined, occupied(state));
        expect(preview).toBe(stillId);
        state = hire(state, employeeId);
        expect(state.employees.at(-1)?.appearance.stillId).toBe(preview);
      }
      expect(state.employees.map((employee) => employee.appearance.stillId)).toEqual(ORDER);
    },
  );

  it.each(ORDER)("frees dismissed %s for the next hire and retains the surviving looks", (stillId) => {
    let state = hireFour(clinic());
    const employeeId = state.employees.find((employee) => employee.appearance.stillId === stillId)!.id;
    const survivors = state.employees.filter((employee) => employee.id !== employeeId)
      .map((employee) => [employee.id, employee.appearance.stillId]);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: `fire.${employeeId}`, employeeId });
    expect(state.operationReceipts[`fire.${employeeId}`]?.status).toBe("applied");
    expect(selectStaffStillId(state.campaignSeed, "replacement", ROLE, undefined, occupied(state))).toBe(stillId);
    state = hire(state, "replacement");
    expect(state.employees.at(-1)?.appearance.stillId).toBe(stillId);
    expect(state.employees.filter((employee) => employee.id !== "replacement")
      .map((employee) => [employee.id, employee.appearance.stillId])).toEqual(survivors);
  });

  it("uses the existing seeded fallback for a fifth hire while all four looks are occupied", () => {
    let state = hireFour(clinic("radiologist-fifth-hire"));
    // Model a room-sale departure: its actor reserves art after leaving the roster.
    const departing = state.employees.shift()!;
    state.departingEmployees = [{ ...departing, dismissedAtFacilityTick: state.facilityTick }];
    const used = occupied(state);
    expect(ORDER.every((stillId) => used.has(stillId))).toBe(true);
    const employeeId = "reader.fifth";
    const expected = seededChoice(state.campaignSeed, employeeId, ROLE, used);
    expect(expected).toMatch(/^future-roster20-v5\./);
    expect(selectStaffStillId(state.campaignSeed, employeeId, ROLE, undefined, used)).toBe(expected);
    state = hire(state, employeeId);
    expect(state.employees.at(-1)?.appearance.stillId).toBe(expected);
    expect(state.departingEmployees?.[0]?.appearance.stillId).toBe(ORDER[0]);
    // Completion of that departure makes the earliest preferred look available again.
    state.departingEmployees = [];
    expect(selectStaffStillId(state.campaignSeed, "after-departure", ROLE, undefined, occupied(state))).toBe(ORDER[0]);
    const allLooks = new Set(staffStillEligibleEntries(ROLE).map((entry) => entry.stillId));
    expect(selectStaffStillId(state.campaignSeed, "exhausted", ROLE, undefined, allLooks)).toBeUndefined();
  });

  it("preserves every existing saved radiologist look and a departing look across reloads", () => {
    let state = hireFour(clinic("saved-radiologist-looks"));
    const departing = state.employees.shift()!;
    state.departingEmployees = [{ ...departing, dismissedAtFacilityTick: state.facilityTick }];
    const template = state.employees[0]!;
    state.employees = staffStillEligibleEntries(ROLE)
      .filter((entry) => entry.stillId !== ORDER[0])
      .map((entry, index) => ({
        ...structuredClone(template), id: `saved.reader.${index}`, displayName: `Saved Reader ${index}`,
        appearance: { ...template.appearance, stillId: entry.stillId }, hiredAtFacilityTick: index,
      }));
    const appearances = state.employees.map((employee) => employee.appearance);
    const departingAppearance = state.departingEmployees?.[0]?.appearance;
    for (let load = 0; load < 2; load += 1) {
      state = deserializeGameState(serializeGameState(state));
      expect(state.employees.map((employee) => employee.appearance)).toEqual(appearances);
      expect(state.departingEmployees?.[0]?.appearance).toEqual(departingAppearance);
    }
    for (const entry of staffStillEligibleEntries(ROLE)) {
      expect(selectStaffStillId("old-campaign", "saved.reader", ROLE, entry.stillId)).toBe(entry.stillId);
    }
  });

  it("leaves seeded selection and occupied-look fallback unchanged for every other role", () => {
    for (const role of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions) {
      if (role.id === ROLE) continue;
      const pool = staffStillEligibleEntries(role.id);
      for (let index = 0; index < 12; index += 1) {
        const seed = `other-roles.${index}`, employeeId = `employee.${index}`;
        for (const used of [new Set<string>(), new Set(pool.slice(0, index).map((entry) => entry.stillId))]) {
          expect(selectStaffStillId(seed, employeeId, role.id, undefined, used))
            .toBe(seededChoice(seed, employeeId, role.id, used));
        }
      }
    }
  });
});
