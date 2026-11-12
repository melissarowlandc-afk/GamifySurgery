import {
  TUTORIAL_ENCOUNTER_ID, createInitialGameState, gameReducer, getDisplayedClinicSatisfaction,
  type DomainContext, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { createLevelFourAlmostQaState } from "./level-four-progression";

export const LEVEL_FIVE_PROGRESSION_QA_PREFIX = "campaign.qa.level-five-progression-m6";
export const LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID = "encounter.qa.level5.goals";
export const LEVEL_FIVE_PROGRESSION_QA_SCENARIOS = [
  "l4-ready", "goals", "goals-ready", "goals-morale", "goals-satisfaction", "goals-empty", "goals-unlocked", "goals-declined",
] as const;
export type LevelFiveProgressionQaScenario = typeof LEVEL_FIVE_PROGRESSION_QA_SCENARIOS[number];

function apply(state: GameState, context: DomainContext, command: GameCommand): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`M6 QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Synthetic prior-save shape; no new witness, reward or unlock is earned by load. */
export function createLevelFourReadyForFiveQaState(context: DomainContext): GameState {
  const state = createLevelFourAlmostQaState(context);
  state.campaignId = `${LEVEL_FIVE_PROGRESSION_QA_PREFIX}.l4-ready`;
  state.levelFourCompletion!.woundOstomyCareVisit = {
    serviceOperationId: "retired.qa.wound", encounterId: null, incomeLineId: "income.wound_care", completedAtFacilityTick: 0,
  };
  state.levelFourCompletion!.acknowledgedAtFacilityTick = 0;
  state.events.push({ id: "event.facility-level-4-complete", type: "success_message", facilityTick: 0,
    encounterId: null, priority: "informational", definitionId: "alert.progress.level-four-complete",
    message: "Level 4 complete - Level 5 coming later. Keep playing; the clinic is still open." });
  state.serviceAppointmentsEnabled = false;
  return state;
}

/** Explicit synthetic scored-history metadata for a displayed boundary, no answer/XP. */
export function setLevelFiveQaDisplayedSatisfaction(state: GameState, context: DomainContext, value: number): void {
  const ended = structuredClone(createInitialGameState(context).encounters[TUTORIAL_ENCOUNTER_ID]!);
  ended.lifecycle = "resolved"; ended.resolutionReason = "completed"; ended.resolvedAtFacilityTick = state.facilityTick;
  ended.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  ended.finalPatientSatisfaction = 100;
  state.encounters = { [ended.id]: ended };
  ended.finalPatientSatisfaction = value + 100 - getDisplayedClinicSatisfaction(state, context);
}

/** Real admission and unlock commands; starting XP/history/idle clocks are labeled QA metadata. */
export function prepareLevelFiveProgressionQaState(state: GameState, context: DomainContext, scenario: LevelFiveProgressionQaScenario): GameState {
  state.campaignId = `${LEVEL_FIVE_PROGRESSION_QA_PREFIX}.${scenario}`;
  state.campaignSeed = `level-five-progression-m6.${scenario}`;
  state.clinicalXp = scenario === "goals" ? 1990 : 2000;
  state.nextEmployeeDiscussionTick = state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextAmbientPedestrianTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  for (const employee of state.employees) employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  if (scenario === "goals-morale") state.employees[0]!.morale = 84;
  if (scenario === "goals-satisfaction") setLevelFiveQaDisplayedSatisfaction(state, context, 90);
  if (scenario === "goals-empty") state.employees = [];
  if (scenario === "goals-unlocked" || scenario === "goals-declined") {
    state = apply(state, context, { type: "SET_PAUSED", paused: true, operationId: "m6.qa.earn-unlock" });
    if (scenario === "goals-declined") {
      const employee = state.employees[0]!;
      const role = context.balanceRelease.facility.staffRoleDefinitions.find(role => role.id === employee.staffRoleDefinitionId)!;
      state = apply(state, context, { type: "SET_EMPLOYEE_SALARY", employeeId: employee.id,
        salaryPerExpenseInterval: role.salaryPerExpenseInterval, operationId: "m6.qa.morale-decline" });
      setLevelFiveQaDisplayedSatisfaction(state, context, 90);
    }
  }
  if (scenario === "goals") {
    const clinicalCase = context.clinicalRelease.cases.find(candidate => !candidate.pediatricProfile && !candidate.participant &&
      candidate.routineEligible && !candidate.tutorialEligible && candidate.earliestFacilityStage <= 1 &&
      candidate.requiredCapabilityIds.every(id => id === "capability.examination") && candidate.decisionNodes.length === 1 &&
      !candidate.decisionNodes[0]!.resultGateAfter && candidate.decisionNodes[0]!.answerChoices.every(choice => !choice.serviceRequest));
    if (!clinicalCase) throw new Error("M6 QA needs an existing simple scored outpatient case.");
    state = apply(state, context, { type: "ADMIT_PATIENT", operationId: "m6.qa.admit", encounterId: LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID,
      caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" });
  }
  return state;
}
