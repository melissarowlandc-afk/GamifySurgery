import { PROTOTYPE_BALANCE_RELEASE, prototypeBalanceReleaseSchema } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveIntegrationQaState } from "./level-five-integration-qa";

export const LEVEL_FIVE_LAUNCH_QA_SCENARIOS = [
  "launch-ready", "launch-unmet", "launch-build", "launch-running", "launch-final", "launch-finish",
] as const;
export type LevelFiveLaunchQaScenario = typeof LEVEL_FIVE_LAUNCH_QA_SCENARIOS[number];
export const LEVEL_FIVE_LAUNCH_QA_PREFIX = "campaign.qa.level-five-launch-m10";

/** Frozen M9 journey checkpoints loaded through the ordinary shipped context.
 * Only launch-unmet's 749 XP is synthetic boundary metadata. No QA balance override. */
export function createLevelFiveLaunchQaState(scenario: LevelFiveLaunchQaScenario): GameState {
  const checkpoint = scenario === "launch-ready" || scenario === "launch-unmet" ? "integration-l4"
    : scenario === "launch-build" ? "integration-build" : scenario === "launch-running" ? "integration-running"
      : scenario === "launch-final" ? "integration-final" : "integration-finish";
  const state = createLevelFiveIntegrationQaState(checkpoint, PROTOTYPE_DOMAIN_CONTEXT);
  state.campaignId = `${LEVEL_FIVE_LAUNCH_QA_PREFIX}.${scenario}`;
  if (scenario === "launch-unmet") state.clinicalXp = 749;
  return state;
}

/** Explicit historical cap-4 contract for legacy terminal/save regression tests. */
export function createPreLevelFiveLaunchContext(): DomainContext {
  const balance = structuredClone(PROTOTYPE_BALANCE_RELEASE);
  balance.facility.maximumPlayableLevel = 4;
  balance.facility.stageDefinitions = balance.facility.stageDefinitions.filter(stage => stage.level <= 4);
  balance.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel = null;
  return { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: prototypeBalanceReleaseSchema.parse(balance) };
}
