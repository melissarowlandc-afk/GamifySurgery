import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  characterStillCatalogEntryById,
  createInitialGameState,
  createPatientPixelAppearance,
  createPixelAppearance,
  gameReducer,
  getPatientAppearanceSelectionContext,
  getRoomStaffCapacity,
  patientRosterEntryById,
  patientStillEligibleEntries,
  patientVisualAgeBand,
  roleStyleForStaffDefinition,
  selectNewPatientStillId,
  selectStaffStillId,
  staffStillEligibleEntries,
  type EmployeeState,
  type GameState,
} from "../src";

const SEXES = ["Female", "Male"] as const;
const AGES = [24, 38, 54, 70] as const;

function stateFor(seed: string) {
  return createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
}

function employeeFor(state: GameState, id: string, role: string, stillId: string): EmployeeState {
  return {
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: {
      ...createPixelAppearance(state.campaignSeed, "staff", id, roleStyleForStaffDefinition(role)),
      stillId,
    },
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 20,
    morale: 70,
    trainingLevel: 1,
    homeRoomInstanceId: null,
    location: { x: 11, y: 12 },
    path: [{ x: 11, y: 12 }],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 100,
    facilityTask: null,
  };
}

describe("exact-band patient character variety", () => {
  it.each(SEXES.flatMap((sexLabel) => AGES.map((ageYears) => ({ sexLabel, ageYears }))))(
    "simulates a $sexLabel age $ageYears map without duplicates until its exact band is full",
    (profile) => {
      const state = stateFor(`variety-map-${profile.sexLabel}-${profile.ageYears}`);
      const template = Object.values(state.encounters)[0]!;
      state.encounters = {};
      state.serviceOperations = [];
      state.retailExternalActors = [];
      state.environment.ambientPedestrians = [];
      const exactPool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      const mapStillIds: string[] = [];

      for (let index = 0; index < exactPool.length + 2; index += 1) {
        const id = `encounter.variety.${index}`;
        const context = getPatientAppearanceSelectionContext(state);
        const appearance = createPatientPixelAppearance(
          state.campaignSeed, id, profile, "patient", context,
        );
        expect(characterStillCatalogEntryById(appearance.stillId)).toMatchObject({
          category: "patient",
          compatibleSexLabel: profile.sexLabel,
          ageBand: patientVisualAgeBand(profile.ageYears),
        });
        expect(patientRosterEntryById(appearance.patientIdentityId)).toMatchObject({
          compatibleSexLabel: profile.sexLabel,
          ageBand: patientVisualAgeBand(profile.ageYears),
        });
        expect(exactPool.some((entry) => entry.stillId === appearance.stillId)).toBe(true);
        if (index < exactPool.length) {
          expect(context.occupiedStillIds.has(appearance.stillId!)).toBe(false);
        } else {
          // Other age bands remain free; exhaustion repeats this band's oldest use.
          expect(appearance.stillId).toBe(mapStillIds[index - exactPool.length]);
        }
        mapStillIds.push(appearance.stillId!);
        state.encounters[id] = {
          ...template,
          id,
          patientAppearance: appearance,
          patientLocation: { x: index % 8, y: Math.floor(index / 8) },
          waiting: { ...template.waiting, arrivedAtTick: index },
        };
      }

      expect(new Set(mapStillIds).size).toBe(exactPool.length);
      const freed = state.encounters[`encounter.variety.${exactPool.length - 1}`]!;
      freed.patientLocation = null;
      expect(selectNewPatientStillId(
        state.campaignSeed, "one-free", profile, getPatientAppearanceSelectionContext(state),
      )).toBe(freed.patientAppearance.stillId);
    },
  );

  it("prefers unoccupied looks, then never-used looks, then the oldest latest patient use", () => {
    const profile = { sexLabel: "Male" as const, ageYears: 38 };
    const eligible = patientStillEligibleEntries(profile.sexLabel, profile.ageYears)
      .map((entry) => entry.stillId);
    const neverUsed = eligible.at(-1)!;
    expect(selectNewPatientStillId("variety-lru", "never-used", profile, {
      occupiedStillIds: new Set(),
      recentlyUsedStillIds: eligible.slice(0, -1),
    })).toBe(neverUsed);

    const recentlyUsedStillIds = [...eligible, eligible[0]!];
    expect(selectNewPatientStillId("variety-lru", "full", profile, {
      occupiedStillIds: new Set(eligible),
      recentlyUsedStillIds,
    })).toBe(eligible[1]);
    expect(selectNewPatientStillId("variety-lru", "free-recent", profile, {
      occupiedStillIds: new Set(eligible.slice(1)),
      recentlyUsedStillIds,
    })).toBe(eligible[0]);
  });
});

describe("staff character variety", () => {
  const roles = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions;

  it.each(roles)("reserves current and departing $displayName looks and refuses exhaustion", (role) => {
    const eligible = staffStillEligibleEntries(role.id);
    const current = new Set<string>();
    const departing = new Set<string>();
    for (let index = 0; index < eligible.length; index += 1) {
      const occupied = new Set([...current, ...departing]);
      const selected = selectStaffStillId("staff-variety", `${role.id}.${index}`, role.id, undefined, occupied);
      expect(selected).toBeDefined();
      expect(occupied.has(selected!)).toBe(false);
      expect(eligible.some((entry) => entry.stillId === selected)).toBe(true);
      (index % 2 === 0 ? current : departing).add(selected!);
    }
    const occupied = new Set([...current, ...departing]);
    expect(selectStaffStillId("staff-variety", "exhausted", role.id, undefined, occupied)).toBeUndefined();
    expect(selectStaffStillId("staff-variety", "occupied-saved", role.id, eligible[0]!.stillId, occupied)).toBeUndefined();
    const freed = [...departing][0]!;
    occupied.delete(freed);
    expect(selectStaffStillId("staff-variety", "freed", role.id, undefined, occupied)).toBe(freed);
  });

  it("fills maximum configured room capacity with globally unique staff in both role orders", () => {
    const state = stateFor("staff-maximum-variety");
    state.rooms = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.flatMap((room) =>
      Array.from({ length: room.maximumInstances ?? 0 }, (_, index) => ({
        id: `${room.id}.${index}`,
        roomDefinitionId: room.id,
        x: index,
        y: 0,
        orientation: 0 as const,
        doorSide: null,
        upgradeLevel: 1 as const,
      })),
    );
    for (const orderedRoles of [roles, [...roles].reverse()]) {
      const occupied = new Set<string>();
      for (const role of orderedRoles) {
        const capacity = getRoomStaffCapacity(state, role.id).capacity;
        for (let index = 0; index < capacity; index += 1) {
          const selected = selectStaffStillId("maximum-staff", `${role.id}.${index}`, role.id, undefined, occupied);
          expect(selected, `${role.id} slot ${index + 1}/${capacity}`).toBeDefined();
          expect(occupied.has(selected!)).toBe(false);
          occupied.add(selected!);
        }
      }
      expect(occupied.size).toBe(roles.reduce((sum, role) => sum + getRoomStaffCapacity(state, role.id).capacity, 0));
    }
  });

  it("rejects a hire before charging when departing employees reserve the entire role pool", () => {
    const state = stateFor("staff-variety-hire-exhaustion");
    const role = "staff.receptionist";
    state.facilityLevel = 1;
    state.cash = 5_000;
    state.cashCents = 500_000;
    const eligible = staffStillEligibleEntries(role);
    state.departingEmployees = eligible.map((entry, index) => ({
      ...employeeFor(state, `employee.departing.${index}`, role, entry.stillId),
      dismissedAtFacilityTick: 0,
    }));
    const before = JSON.stringify(state);
    const rejected = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.variety.exhausted",
      employeeId: "employee.variety.exhausted",
      staffRoleDefinitionId: role,
    });
    expect(rejected.operationReceipts["hire.variety.exhausted"]).toMatchObject({
      status: "rejected",
      message: "No unused Receptionist character design is available yet.",
    });
    expect(rejected.cash).toBe(state.cash);
    expect(rejected.cashCents).toBe(state.cashCents);
    expect(rejected.employees).toEqual(state.employees);
    expect(rejected.departingEmployees).toEqual(state.departingEmployees);
    expect(JSON.stringify(state)).toBe(before);
  });
});
