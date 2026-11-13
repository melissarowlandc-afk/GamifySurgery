import { PROTOTYPE_BALANCE_RELEASE, prototypeBalanceReleaseSchema } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveIntegrationQaState } from "./level-five-integration-qa";

export const LEVEL_FIVE_LAUNCH_QA_SCENARIOS = [
  "launch-ready", "launch-unmet", "launch-build", "launch-running", "launch-final", "launch-finish",
] as const;
export type LevelFiveLaunchQaScenario = typeof LEVEL_FIVE_LAUNCH_QA_SCENARIOS[number];
export const LEVEL_FIVE_LAUNCH_QA_PREFIX = "campaign.qa.level-five-launch-m10";

/** Frozen M9 journey checkpoints loaded through the ordinary shipped context.
 * Only launch-unmet's current-goal-minus-one XP is synthetic boundary metadata. */
export function createLevelFiveLaunchQaState(scenario: LevelFiveLaunchQaScenario): GameState {
  const checkpoint = scenario === "launch-ready" || scenario === "launch-unmet" ? "integration-l4"
    : scenario === "launch-build" ? "integration-build" : scenario === "launch-running" ? "integration-running"
      : scenario === "launch-final" ? "integration-final" : "integration-finish";
  const state = createLevelFiveIntegrationQaState(checkpoint, PROTOTYPE_DOMAIN_CONTEXT);
  state.campaignId = `${LEVEL_FIVE_LAUNCH_QA_PREFIX}.${scenario}`;
  if (scenario === "launch-unmet") {
    state.clinicalXp = PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.find(stage => stage.level === 4)!.minimumClinicalXp - 1;
    // This deliberately unmet preview must not inherit the checkpoint's earned
    // legacy goal. Every patient and chart in that checkpoint remains intact.
    state.lateProgression = { version: "late-progression.v2", preservedClinicalXpGoal: null,
      preservedCompletedEncounterGoal: null };
  }
  return state;
}

/** Explicit historical cap-4 contract for legacy terminal/save regression tests. */
export function createPreLevelFiveLaunchContext(): DomainContext {
  const balance = structuredClone(PROTOTYPE_BALANCE_RELEASE);
  balance.facility.maximumPlayableLevel = 4;
  balance.facility.stageDefinitions = balance.facility.stageDefinitions.filter(stage => stage.level <= 4);
  balance.facility.stageDefinitions.find(stage => stage.level === 3)!.minimumClinicalXp = 500;
  balance.facility.stageDefinitions.find(stage => stage.level === 4)!.minimumClinicalXp = 750;
  balance.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel = null;
  return { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: prototypeBalanceReleaseSchema.parse(balance) };
}
