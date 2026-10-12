import { loadPrototypeProfile, savePrototypeProfileResult, type LocalPrototypeProfile } from "../../apps/player/src/session/prototypeStorage";
import { createLevelFiveLaunchQaState, LEVEL_FIVE_LAUNCH_QA_PREFIX, LEVEL_FIVE_LAUNCH_QA_SCENARIOS,
  type LevelFiveLaunchQaScenario } from "../../tests/fixtures/level-five-launch";

export function assertLevelFiveLaunchQaEntry(origin: string, pathname: string, search: string): LevelFiveLaunchQaScenario {
  const scenario = new URLSearchParams(search).get("level5");
  if (origin !== "http://127.0.0.1:5184" || pathname !== "/level4-rooms-qa.html" ||
      !LEVEL_FIVE_LAUNCH_QA_SCENARIOS.includes(scenario as LevelFiveLaunchQaScenario)) {
    throw new Error("Level 5 launch QA requires the dedicated 5184 disposable entry and an explicit launch scenario.");
  }
  return scenario as LevelFiveLaunchQaScenario;
}

export function prepareLevelFiveLaunchQaProfile(profile: LocalPrototypeProfile, scenario: LevelFiveLaunchQaScenario): LocalPrototypeProfile {
  const campaignId = `${LEVEL_FIVE_LAUNCH_QA_PREFIX}.${scenario}`;
  const next = { ...profile, campaigns: [...profile.campaigns], activeCampaignId: campaignId, tutorialsEnabled: false,
    tutorialIntroDismissedCampaignIds: [...new Set([...profile.tutorialIntroDismissedCampaignIds, campaignId])] };
  if (!next.campaigns.some(campaign => campaign.campaignId === campaignId)) {
    next.campaigns.push({ campaignId, name: `Level 5 M10 ordinary launch (${scenario})`, createdAtRealMs: 0,
      updatedAtRealMs: 0, status: "resumable", state: createLevelFiveLaunchQaState(scenario) });
  }
  return next;
}

export async function bootstrapLevelFiveLaunchQa(): Promise<void> {
  const scenario = assertLevelFiveLaunchQaEntry(location.origin, location.pathname, location.search);
  // Use ordinary storage validation and App loading without replacing the domain context.
  const { profile } = loadPrototypeProfile();
  const result = savePrototypeProfileResult(prepareLevelFiveLaunchQaProfile(profile, scenario));
  if (!result.ok) throw new Error(`Level 5 launch QA fixture could not be saved: ${result.failure.message}`);
  document.title = `Level 5 M10 ordinary launch ${scenario} - disposable prototype`;
  console.info(`M10 ${scenario}: ordinary shipped balance/context, paused M9 journey checkpoint; launch-unmet alone sets 749 XP as synthetic boundary metadata. No browser answer bot. location.origin=${location.origin}. Reload resumes; ordinary / resumes the same campaign without QA setup.`);
  await import("../../apps/player/src/main");
}
