import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  evaluateFacilityExperienceConditions,
  gameReducer,
  getClinicSatisfaction,
  getDisplayedClinicSatisfaction,
  getFacilityProgressionStatus,
  serializeGameState,
  synchronizeFacilityConditionOccurrences,
  type GameState,
} from "../src";

function tick(state: GameState, sequence: number): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: `facility-experience.tick.${sequence}`,
  });
}

function addOperationalExaminationRoom(state: GameState): void {
  state.rooms.push({ id: "room.facility-experience.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.facility-experience.examination", roomId: "room.facility-experience.examination", side: "south", offset: 1, exterior: false });
}

function advanceUntilCheckedIn(
  state: GameState,
  encounterId: string,
): GameState {
  for (let sequence = 0; sequence < 100; sequence += 1) {
    if (
      state.encounters[encounterId]
        ?.facilityExperienceAtCheckIn !== null
    ) {
      return state;
    }
    state = tick(state, sequence);
  }
  throw new Error("Patient did not reach check-in.");
}

function endedEncounter(
  state: GameState,
  satisfaction: number,
): GameState["encounters"][string] {
  const encounter = JSON.parse(
    JSON.stringify(state.encounters[TUTORIAL_ENCOUNTER_ID]!),
  ) as GameState["encounters"][string];
  encounter.id = `encounter.ended.${satisfaction}`;
  encounter.lifecycle = "resolved";
  encounter.resolutionReason = "completed";
  encounter.patientMovement = null;
  encounter.patientLocation = null;
  encounter.patientSatisfaction = satisfaction;
  encounter.finalPatientSatisfaction = satisfaction;
  encounter.resolvedAtFacilityTick = 1;
  encounter.facilityExperienceAtCheckIn = {
    appliedAtFacilityTick: 0,
    totalPenalty: 0,
    conditions: [],
  };
  return encounter;
}

describe("facility experience conditions", () => {
  it("keeps locked future amenities out of Level 0 and adds applicable Level 1 gaps", () => {
    const state = createInitialGameState();
    expect(
      evaluateFacilityExperienceConditions(state).conditions.map(
        (condition) => condition.conditionKey,
      ),
    ).toEqual(["missing_examination_room"]);

    state.facilityLevel = 1;
    expect(
      evaluateFacilityExperienceConditions(state).conditions.map(
        (condition) => condition.conditionKey,
      ),
    ).toEqual([
      "missing_waiting_room",
      "missing_examination_room",
      "missing_bathroom",
      "unavailable_onsite_xray",
    ]);
  });

  it("centralizes litter, dirty-room, and actually-empty water pressure under the cap", () => {
    const state = createInitialGameState();
    addOperationalExaminationRoom(state);
    state.rooms.forEach((room) => {
      room.cleanliness = 40;
    });
    state.environment.waterCoolerFillPercent = 0;
    state.environment.litterItems = [
      {
        id: "litter.one",
        roomId: state.rooms[0]!.id,
        location: { x: 33, y: 29 },
        spawnedAtFacilityTick: 0,
      },
      {
        id: "litter.two",
        roomId: state.rooms[0]!.id,
        location: { x: 34, y: 29 },
        spawnedAtFacilityTick: 0,
      },
    ];
    const result = evaluateFacilityExperienceConditions(state);
    expect(
      result.conditions.map((condition) => condition.conditionKey),
    ).toEqual([
      "visible_litter",
      "dirty_cleanliness",
      "empty_water_cooler",
    ]);
    expect(result.totalPenalty).toBe(10);

    state.environment.waterCoolerFillPercent = 1;
    expect(
      evaluateFacilityExperienceConditions(state).conditions.some(
        (condition) =>
          condition.conditionKey === "empty_water_cooler",
      ),
    ).toBe(false);
  });

  it("applies conditions exactly once at Front Desk check-in and preserves them through reload", () => {
    let state = createInitialGameState();
    addOperationalExaminationRoom(state);
    state.facilityLevel = 1;
    state.encounters = {};
    const clinicalCase =
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
        (candidate) =>
          candidate.routineEligible &&
          candidate.earliestFacilityStage <= 1,
      )!;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "facility-experience.admit",
      encounterId: "encounter.facility-experience",
      caseId: clinicalCase.id,
      patientDisplayName: "Casey Checkin",
      arrivalClass: "routine",
    });
    expect(
      state.encounters["encounter.facility-experience"]!
        .facilityExperienceAtCheckIn,
    ).toBeNull();
    expect(
      state.encounters["encounter.facility-experience"]!
        .patientSatisfaction,
    ).toBe(100);

    state = advanceUntilCheckedIn(
      state,
      "encounter.facility-experience",
    );
    const checkedIn =
      state.encounters["encounter.facility-experience"]!;
    expect(checkedIn.facilityExperienceAtCheckIn).toMatchObject({
      totalPenalty: 9,
    });
    expect(checkedIn.patientSatisfaction).toBe(91);
    expect(
      checkedIn.dissatisfactionByCause.missing_amenities
        ?.pointsLost,
    ).toBe(5);
    expect(
      checkedIn.dissatisfactionByCause.no_receptionist
        ?.pointsLost,
    ).toBe(2);
    expect(
      checkedIn.dissatisfactionByCause.imaging_unavailable
        ?.pointsLost,
    ).toBe(2);

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters["encounter.facility-experience"]!
        .facilityExperienceAtCheckIn,
    ).toEqual(checkedIn.facilityExperienceAtCheckIn);
    expect(
      restored.encounters["encounter.facility-experience"]!
        .patientSatisfaction,
    ).toBe(91);
  });

  it("protects tutorial patients from the check-in environment penalty", () => {
    let state = createInitialGameState();
    state = advanceUntilCheckedIn(state, TUTORIAL_ENCOUNTER_ID);
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!
        .facilityExperienceAtCheckIn,
    ).toEqual({
      appliedAtFacilityTick:
        state.encounters[TUTORIAL_ENCOUNTER_ID]!
          .facilityExperienceAtCheckIn!.appliedAtFacilityTick,
      totalPenalty: 0,
      conditions: [],
    });
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!
        .patientSatisfaction,
    ).toBe(100);
  });

  it("keeps raw history separate while progression uses measured live-adjusted satisfaction", () => {
    const state = createInitialGameState();
    addOperationalExaminationRoom(state);
    expect(getClinicSatisfaction(state)).toBeNull();
    expect(getDisplayedClinicSatisfaction(state)).toBe(100);
    expect(
      getFacilityProgressionStatus(state).requirements.find(
        (requirement) =>
          requirement.id === "progression.satisfaction",
      )?.met,
    ).toBe(false);

    const completed = endedEncounter(state, 95);
    state.encounters = { [completed.id]: completed };
    expect(getClinicSatisfaction(state)).toBe(95);
    expect(getDisplayedClinicSatisfaction(state)).toBe(95);
    expect(
      getFacilityProgressionStatus(state).requirements.find(
        (requirement) =>
          requirement.id === "progression.satisfaction",
      ),
    ).toMatchObject({ met: true, current: 95 });

    state.environment.litterItems.push({
      id: "litter.progression",
      roomId: state.rooms[0]!.id,
      location: { x: 33, y: 29 },
      spawnedAtFacilityTick: 2,
    });
    expect(getClinicSatisfaction(state)).toBe(95);
    expect(getDisplayedClinicSatisfaction(state)).toBe(93);
    expect(
      getFacilityProgressionStatus(state).requirements.find(
        (requirement) =>
          requirement.id === "progression.satisfaction",
      )?.met,
    ).toBe(true);
  });
});

describe("durable facility-condition occurrences", () => {
  it("requires 60 continuous minutes and keeps recurrence on one global litter day", () => {
    const state = createInitialGameState();
    state.environment.litterItems.push({
      id: "litter.first",
      roomId: state.rooms[0]!.id,
      location: { x: 33, y: 29 },
      spawnedAtFacilityTick: 3,
    });
    state.facilityTick = 3;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences).toHaveLength(0);
    state.facilityTick = 63;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences).toHaveLength(0);
    state.facilityTick = 64;
    synchronizeFacilityConditionOccurrences(state);
    const first = state.environment.facilityConditionOccurrences.find(
      (occurrence) =>
        occurrence.conditionKey === "visible_litter",
    )!;
    expect(first.resolvedAtFacilityTick).toBeNull();

    state.facilityTick = 65;
    state.environment.litterItems = [];
    synchronizeFacilityConditionOccurrences(state);
    expect(first.resolvedAtFacilityTick).toBe(65);

    state.facilityTick = 66;
    state.environment.litterItems.push({
      id: "litter.second",
      roomId: state.rooms[0]!.id,
      location: { x: 34, y: 29 },
      spawnedAtFacilityTick: 66,
    });
    synchronizeFacilityConditionOccurrences(state);
    state.facilityTick = 127;
    synchronizeFacilityConditionOccurrences(state);
    let litterOccurrences =
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "visible_litter",
      );
    expect(litterOccurrences).toHaveLength(1);
    state.facilityTick = 664;
    synchronizeFacilityConditionOccurrences(state);
    litterOccurrences = state.environment.facilityConditionOccurrences.filter(
      (occurrence) => occurrence.conditionKey === "visible_litter",
    );
    expect(litterOccurrences).toHaveLength(2);
    expect(litterOccurrences[1]!.id).not.toBe(first.id);
    expect(litterOccurrences[1]!.resolvedAtFacilityTick).toBeNull();
  });

  it("alerts for one post-teaching litter item and does not spam on accumulation", () => {
    const state = createInitialGameState();
    state.environment.trashTeachingAcknowledgedAtTick = 1;
    state.environment.litterItems = [
      {
        id: "litter.later-one",
        roomId: state.rooms[0]!.id,
        location: { x: 33, y: 29 },
        spawnedAtFacilityTick: 2,
      },
    ];
    synchronizeFacilityConditionOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.some(
        (occurrence) =>
          occurrence.conditionKey === "visible_litter",
      ),
    ).toBe(false);

    state.facilityTick = 60;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences).toHaveLength(0);
    state.facilityTick = 61;
    synchronizeFacilityConditionOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.find(
        (occurrence) => occurrence.conditionKey === "visible_litter",
      ),
    ).toMatchObject({
      definitionId: "alert.patient.cleanliness-complaint",
      occurredAtFacilityTick: 61,
    });

    state.environment.litterItems.push({
      id: "litter.later-two",
      roomId: state.rooms[0]!.id,
      location: { x: 34, y: 29 },
      spawnedAtFacilityTick: 3,
    });
    synchronizeFacilityConditionOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "visible_litter",
      ),
    ).toHaveLength(1);
    state.facilityTick = 62;
    state.environment.litterItems = state.environment.litterItems.filter(
      (item) => item.id === "litter.later-two",
    );
    synchronizeFacilityConditionOccurrences(state);
    const litterHistory = state.environment.facilityConditionOccurrences.filter(
      (occurrence) => occurrence.conditionKey === "visible_litter",
    );
    expect(litterHistory).toHaveLength(1);
    expect(litterHistory[0]!.resolvedAtFacilityTick).toBe(62);

    state.facilityTick = 661;
    synchronizeFacilityConditionOccurrences(state);
    const retargeted = state.environment.facilityConditionOccurrences.filter(
      (occurrence) => occurrence.conditionKey === "visible_litter",
    );
    expect(retargeted).toHaveLength(2);
    expect(retargeted[1]).toMatchObject({
      target: { kind: "litter", id: "litter.later-two" },
    });
  });

  it("emits empty water once, promotes only the latest daily reminder, and resets on refill", () => {
    const state = createInitialGameState();
    state.facilityTick = 10;
    state.environment.waterCoolerFillPercent = 0;
    synchronizeFacilityConditionOccurrences(state);
    let waterOccurrences =
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "empty_water_cooler",
      );
    expect(waterOccurrences).toHaveLength(0);
    state.facilityTick = 70;
    synchronizeFacilityConditionOccurrences(state);
    expect(state.environment.facilityConditionOccurrences).toHaveLength(0);
    state.facilityTick = 71;
    synchronizeFacilityConditionOccurrences(state);
    waterOccurrences = state.environment.facilityConditionOccurrences.filter(
      (occurrence) => occurrence.conditionKey === "empty_water_cooler",
    );
    expect(waterOccurrences[0]).toMatchObject({
      kind: "onset",
      occurredAtFacilityTick: 71,
      resolvedAtFacilityTick: null,
      definitionId: "alert.environment.water-empty",
    });

    state.facilityTick = 670;
    synchronizeFacilityConditionOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "empty_water_cooler",
      ),
    ).toHaveLength(1);

    state.facilityTick = 671;
    synchronizeFacilityConditionOccurrences(state);
    waterOccurrences =
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "empty_water_cooler",
      );
    expect(waterOccurrences).toHaveLength(2);
    expect(waterOccurrences[0]!.resolvedAtFacilityTick).toBe(671);
    expect(waterOccurrences[1]).toMatchObject({
      kind: "reminder",
      occurredAtFacilityTick: 671,
      resolvedAtFacilityTick: null,
    });

    state.facilityTick = 2_000;
    synchronizeFacilityConditionOccurrences(state);
    waterOccurrences =
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) =>
          occurrence.conditionKey === "empty_water_cooler",
      );
    expect(waterOccurrences).toHaveLength(3);
    expect(
      waterOccurrences.filter(
        (occurrence) =>
          occurrence.resolvedAtFacilityTick === null,
      ),
    ).toHaveLength(1);
    expect(waterOccurrences[2]).toMatchObject({
      kind: "reminder",
      occurredAtFacilityTick: 2_000,
    });

    state.facilityTick = 2_001;
    state.environment.waterCoolerFillPercent = 100;
    synchronizeFacilityConditionOccurrences(state);
    expect(
      waterOccurrences[2]!.resolvedAtFacilityTick,
    ).toBe(2_001);
    expect(state.environment.waterCoolerEmptySinceTick).toBeNull();
    expect(state.environment.nextWaterCoolerReminderTick).toBeNull();
  });
});
