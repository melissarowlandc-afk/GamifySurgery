import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  type GameState,
} from "@gamify-surgery/game-domain";

/** Presentation pacing only: the frozen plan and every ordinary tick stay intact. */
export const GUIDED_SECOND_VISIT_CLOCK_MULTIPLIER = 4;
export const GUIDED_SECOND_VISIT_MAX_CLOCK_RATE = 8;

export function getGuidedSecondVisitClockRate(speed: GameState["simulationSpeed"]): number {
  return Math.min(speed * GUIDED_SECOND_VISIT_CLOCK_MULTIPLIER, GUIDED_SECOND_VISIT_MAX_CLOCK_RATE);
}

export function getTutorialClockMultiplier(state: GameState, guidanceEnabled: boolean): number {
  const encounter = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  const pending = encounter?.pendingResult;
  return guidanceEnabled && state.facilityLevel === 0 &&
    state.encounters[TUTORIAL_ENCOUNTER_ID]?.lifecycle === "resolved" &&
    encounter?.lifecycle === "active_pending_result" && pending &&
    pending.deliveredAtTick === null &&
    encounter.steps[pending.originatingNodeIndex]?.status === "result_pending"
    ? getGuidedSecondVisitClockRate(state.simulationSpeed) / state.simulationSpeed : 1;
}

export function getTutorialTickIntervalMs(state: GameState, guidanceEnabled: boolean): number {
  return PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x /
    (state.simulationSpeed * getTutorialClockMultiplier(state, guidanceEnabled));
}
