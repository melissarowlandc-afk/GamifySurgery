import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getFacilityProgressionStatus,
  serializeGameState,
  type DomainContext,
} from "../src";

function levelOneReadyContext(): DomainContext {
  return {
    ...PROTOTYPE_DOMAIN_CONTEXT,
    balanceRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease,
      facility: {
        ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility,
        stageDefinitions:
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.stageDefinitions.map(
            (stage) =>
              stage.level === 1
                ? {
                    ...stage,
                    requiredRoomDefinitionIds: [],
                    requiredStaffRoleIds: [],
                    satisfactionMustBeGreaterThan: 0,
                  }
                : stage,
          ),
      },
    },
  };
}

describe("Level 2 facility progression", () => {
  it("advances a qualifying Level 1 campaign exactly once and resets only current-level XP", () => {
    const context = levelOneReadyContext();
    const state = createInitialGameState(context, {
      campaignId: "campaign.level-two-advance",
      campaignSeed: "level-two-advance",
      createdAtRealMs: 0,
    });
    state.facilityLevel = 1;
    state.clinicalXp = 150;
    state.cash = 987;
    state.cashCents = 98_700;
    state.nextRoutineArrivalTick = 432;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason = "completed";
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolvedAtFacilityTick = 0;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientSatisfaction = 95;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.finalPatientSatisfaction = 95;
    const before = JSON.parse(JSON.stringify(state));
    const readyProgression = getFacilityProgressionStatus(state, context);
    expect(readyProgression.requirements.filter((requirement) => !requirement.met)).toEqual([]);
    expect(readyProgression).toMatchObject({
      eligible: true,
      nextFacilityLevel: 2,
    });

    const advanced = gameReducer(
      state,
      { type: "LEVEL_UP", operationId: "level-two.advance" },
      context,
    );

    expect(advanced.facilityLevel).toBe(2);
    expect(advanced.clinicalXp).toBe(0);
    expect(advanced.cash).toBe(before.cash);
    expect(advanced.cashCents).toBe(before.cashCents);
    expect(advanced.rooms).toEqual(before.rooms);
    expect(advanced.employees).toEqual(before.employees);
    expect(advanced.encounters).toEqual(before.encounters);
    expect(advanced.learningHistories).toEqual(before.learningHistories);
    expect(advanced.nextRoutineArrivalTick).toBe(before.nextRoutineArrivalTick);
    expect(
      advanced.events.filter((event) => event.type === "facility_level_advanced"),
    ).toHaveLength(1);

    const repeated = gameReducer(
      advanced,
      { type: "LEVEL_UP", operationId: "level-two.repeat" },
      context,
    );
    expect(repeated.facilityLevel).toBe(2);
    expect(repeated.clinicalXp).toBe(0);
    expect(
      repeated.events.filter((event) => event.type === "facility_level_advanced"),
    ).toHaveLength(1);
  });

  it("shows exact Level 2 requirements and the locked Level 3 preview", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.clinicalXp = 300;

    const progression = getFacilityProgressionStatus(state);
    expect(progression).toMatchObject({
      facilityLevel: 2,
      maximumPlayableLevel: 2,
      nextFacilityLevel: null,
      eligible: false,
    });
    expect(progression.requirements.map((requirement) => requirement.id)).toEqual([
      "progression.clinical_xp",
      "progression.satisfaction",
      "progression.room.room.endoscopy",
      "progression.room.room.periop_recovery",
      "progression.staff.staff.periop_nurse",
      "progression.staff.staff.endoscopy_nurse",
      "progression.staff.staff.endoscopist",
    ]);
  });

  it("loads existing Level 0/1 saves and round-trips a Level 2 state without a schema bump", () => {
    const levelZero = createInitialGameState();
    const levelOne = createInitialGameState();
    levelOne.facilityLevel = 1;
    const levelTwo = createInitialGameState();
    levelTwo.facilityLevel = 2;
    levelTwo.clinicalXp = 123;

    expect(deserializeGameState(serializeGameState(levelZero)).facilityLevel).toBe(0);
    expect(deserializeGameState(serializeGameState(levelOne)).facilityLevel).toBe(1);
    const restored = deserializeGameState(serializeGameState(levelTwo));
    expect(restored.schemaVersion).toBe(6);
    expect(restored.facilityLevel).toBe(2);
    expect(restored.clinicalXp).toBe(123);
  });
});
