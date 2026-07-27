import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  getPatientLists,
  type EncounterState,
} from "../src";

function createEncounter(
  template: EncounterState,
  input: {
    id: string;
    lifecycle: EncounterState["lifecycle"];
    arrivedAtTick: number;
    resolutionReason?: EncounterState["resolutionReason"];
    settlementId?: string | null;
  },
): EncounterState {
  return {
    ...template,
    id: input.id,
    patientDisplayName: input.id,
    lifecycle: input.lifecycle,
    resolutionReason: input.resolutionReason ?? null,
    settlementId: input.settlementId ?? null,
    waiting: {
      ...template.waiting,
      arrivedAtTick: input.arrivedAtTick,
    },
  };
}

describe("patient-list ordering", () => {
  it("shows the most recently resolved encounter first", () => {
    const state = createInitialGameState();
    const template = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.encounters = {
      "encounter.completed-later": createEncounter(template, {
        id: "encounter.completed-later",
        lifecycle: "resolved",
        arrivedAtTick: 1,
        resolutionReason: "completed",
        settlementId: "settlement.completed-later",
      }),
      "encounter.departed-middle": createEncounter(template, {
        id: "encounter.departed-middle",
        lifecycle: "resolved",
        arrivedAtTick: 3,
        resolutionReason: "walkout",
      }),
      "encounter.completed-earlier": createEncounter(template, {
        id: "encounter.completed-earlier",
        lifecycle: "resolved",
        arrivedAtTick: 5,
        resolutionReason: "completed",
        settlementId: "settlement.completed-earlier",
      }),
    };
    state.settlements = [
      {
        id: "settlement.completed-later",
        encounterId: "encounter.completed-later",
        completionRevenue: 0,
        qualityRevenueBonus: 0,
        incorrectFinancialConsequence: 0,
        netCashDelta: 0,
        satisfactionDelta: 0,
        clinicalXpAwarded: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        terminalOutcomeSeverity: null,
        settledAtFacilityTick: 30,
      },
      {
        id: "settlement.completed-earlier",
        encounterId: "encounter.completed-earlier",
        completionRevenue: 0,
        qualityRevenueBonus: 0,
        incorrectFinancialConsequence: 0,
        netCashDelta: 0,
        satisfactionDelta: 0,
        clinicalXpAwarded: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        terminalOutcomeSeverity: null,
        settledAtFacilityTick: 10,
      },
    ];
    state.events = [
      {
        id: "event.left-before-seen.encounter.departed-middle",
        type: "left_before_seen",
        facilityTick: 20,
        encounterId: "encounter.departed-middle",
        message: "Patient left before being seen.",
      },
    ];

    expect(
      getPatientLists(state).resolved.map((patient) => patient.encounterId),
    ).toEqual([
      "encounter.completed-later",
      "encounter.departed-middle",
      "encounter.completed-earlier",
    ]);
  });

  it("preserves oldest-arrival-first ordering for waiting and active encounters", () => {
    const state = createInitialGameState();
    const template = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.encounters = {
      "encounter.waiting-newer": createEncounter(template, {
        id: "encounter.waiting-newer",
        lifecycle: "waiting_unopened",
        arrivedAtTick: 4,
      }),
      "encounter.active-newer": createEncounter(template, {
        id: "encounter.active-newer",
        lifecycle: "active_action_required",
        arrivedAtTick: 3,
      }),
      "encounter.active-older": createEncounter(template, {
        id: "encounter.active-older",
        lifecycle: "active_pending_result",
        arrivedAtTick: 2,
      }),
      "encounter.waiting-older": createEncounter(template, {
        id: "encounter.waiting-older",
        lifecycle: "waiting_unopened",
        arrivedAtTick: 1,
      }),
    };

    const lists = getPatientLists(state);
    expect(lists.waiting.map((patient) => patient.encounterId)).toEqual([
      "encounter.waiting-older",
      "encounter.waiting-newer",
    ]);
    expect(lists.active.map((patient) => patient.encounterId)).toEqual([
      "encounter.active-older",
      "encounter.active-newer",
    ]);
  });
});
