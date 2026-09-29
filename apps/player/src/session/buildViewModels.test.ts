import { describe, expect, it } from "vitest";
import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  gameReducer,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("Build Mode view models", () => {
  it("shows the shared imaging-technician hiring capacity through the third hire", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.cash = 10_000;
    state.rooms.push({
      id: "room.test.imaging-capacity", roomDefinitionId: "room.ultrasound",
      x: 28, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1,
      cleanliness: 100,
    });
    const technician = (id: string) => ({
      id, staffRoleDefinitionId: "staff.imaging_technician", displayName: id,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 26, morale: 75, trainingLevel: 1 as const,
      homeRoomInstanceId: "room.test.imaging-capacity", location: { x: 29, y: 24 },
      path: [{ x: 29, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 10,
      facilityTask: null,
    });
    state.employees.push(technician("employee.imaging.one"));
    const imaging = () => createPrototypePlayerView(state, null, false, null)
      .staffRoles.find((role) => role.id === "staff.imaging_technician")!;
    expect(imaging()).toMatchObject({ currentCount: 1, maximumCount: 3, canHire: true });
    state.employees.push(technician("employee.imaging.two"));
    expect(imaging()).toMatchObject({ currentCount: 2, maximumCount: 3, canHire: true });
    state.employees.push(technician("employee.imaging.three"));
    expect(imaging()).toMatchObject({
      currentCount: 3, maximumCount: 3, canHire: false,
      blockedReason: "Maximum 3 hired.",
    });
  });

  it("explains GLP-1 two-NP staffing capacity and blocks hiring without a reachable slot", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.cash = 10_000;
    state.rooms.push({
      id: "room.test.glp-capacity", roomDefinitionId: "room.glp1_telehealth_suite",
      x: 28, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1,
      cleanliness: 100,
    });
    const nursePractitioner = (id: string) => ({
      id, staffRoleDefinitionId: "staff.glp1_np", displayName: id,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 40, morale: 75, trainingLevel: 1 as const,
      homeRoomInstanceId: "room.test.glp-capacity", location: { x: 29, y: 24 },
      path: [{ x: 29, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 10,
      facilityTask: null,
    });
    for (let index = 1; index <= 2; index += 1) {
      state.employees.push(nursePractitioner(`employee.glp.${index}`));
    }
    const glp = () => createPrototypePlayerView(state, null, false, null)
      .staffRoles.find((role) => role.id === "staff.glp1_np")!;
    expect(glp()).toMatchObject({
      currentCount: 2,
      maximumCount: 10,
      canHire: false,
      blockedReason: "Requires an available slot in a reachable GLP-1 Telehealth Suite (maximum 2 NPs per suite).",
      staffingGuidance: "Up to two NPs can staff each GLP-1 Telehealth Suite. Each staffed NP earns $50 per facility hour.",
    });
    expect(createPrototypePlayerView(state, null, false, null)
      .staffOptions.find((role) => role.id === "staff.glp1_np")).toMatchObject({
      enabled: false,
      blockedReason: "Requires an available slot in a reachable GLP-1 Telehealth Suite (maximum 2 NPs per suite).",
    });
    for (let index = 3; index <= 10; index += 1) {
      state.employees.push(nursePractitioner(`employee.glp.${index}`));
    }
    expect(glp()).toMatchObject({
      currentCount: 10,
      maximumCount: 10,
      canHire: false,
      blockedReason: "Maximum 10 hired.",
    });
  });

  it("shows tutorial completion instead of blocked XP and satisfaction goals for the Level 0 graduation exception", () => {
    const state = createInitialGameState();
    state.clinicalXp = 6;
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    first.resolutionReason = "completed";
    first.resolvedAtFacilityTick = 1;
    first.finalPatientSatisfaction = 20;
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {
      ...JSON.parse(JSON.stringify(first)),
      id: SECOND_TUTORIAL_ENCOUNTER_ID,
      resolvedAtFacilityTick: 2,
      finalPatientSatisfaction: 20,
    };
    state.rooms.push({
      id: "room.tutorial.exception.exam",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.tutorial.exception.exam",
      roomId: "room.tutorial.exception.exam",
      side: "south",
      offset: 1,
      exterior: false,
    });

    const view = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    );

    expect(view.progression.canLevelUp).toBe(true);
    expect(view.progression.goals.map((goal) => goal.id)).toEqual([
      "progression.tutorial_completion",
      "progression.room.room.examination",
    ]);
    expect(view.resourceBar.xpProgressLabel).toBe("6/10 XP");
    expect(view.resourceBar.xpProgressPercent).toBe(60);
  });

  it("describes upgrade effects and projects valid walls for map interaction", () => {
    const initial = createInitialGameState();
    // This view-model fixture owns the only Examination Room it selects.
    initial.rooms = initial.rooms.filter(
      (room) => room.id !== "room.instance.starter_examination",
    );
    initial.doors = initial.doors.filter(
      (door) => door.roomId !== "room.instance.starter_examination",
    );
    initial.cash = 1_000;
    initial.cashCents = 100_000;
    const state = gameReducer(initial, {
      type: "PLACE_ROOM",
      operationId: "test.place.exam",
      roomId: "room.test.exam",
      roomDefinitionId: "room.examination",
      x: 33,
      y: 26,
    });

    const view = createPrototypePlayerView(
      state,
      null,
      false,
      null,
      true,
      "room.test.exam",
    );

    expect(
      view.facility.rooms.find(
        (room) => room.instanceId === "room.test.exam",
      )?.upgradeAvailable,
    ).toBe(true);
    expect(view.selectedRoomBuild).toMatchObject({
      upgradeLevel: 1,
      nextUpgradeLevel: 2,
      upgradeCostLabel: "$90",
    });
    expect(view.selectedRoomBuild?.upgradeImprovements).toEqual(
      expect.arrayContaining([
        "Room finish and fixed fixtures advance to Level 2.",
        "Routine workload capacity +1.",
        "Room service time 5% faster.",
        "Hourly upkeep +$1.",
      ]),
    );
    expect(view.facility.buildDoorSlots?.length).toBeGreaterThan(0);
    expect(view.facility.buildDoorSlots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          roomInstanceId: "room.test.exam",
          side: expect.stringMatching(/north|east|south|west/),
          offset: expect.any(Number),
        }),
      ]),
    );
    expect(
      view.facility.buildDoorSlots?.every((slot) =>
        state.rooms.some((room) => room.id === slot.roomInstanceId),
      ),
    ).toBe(true);
    expect(
      view.facility.buildDoorSlots?.every(
        (slot) => !("label" in slot),
      ),
    ).toBe(true);
  });
});
