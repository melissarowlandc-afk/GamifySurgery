import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { loadPrototypeProfile, savePrototypeProfileResult, type LocalPrototypeProfile } from "../../apps/player/src/session/prototypeStorage";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState, levelFiveQaCampaignId, levelFiveQaScenario,
  type LevelFiveQaScenario } from "../../tests/fixtures/level-five-state";
import { LEVEL_FIVE_REPORT_QA_SCENARIOS, type LevelFiveReportQaScenario } from "../../tests/fixtures/level-five-report-card";

export function assertLevelFiveQaEntry(origin: string, pathname: string, search: string): LevelFiveQaScenario {
  if (origin !== "http://127.0.0.1:5184" || pathname !== "/level4-rooms-qa.html") {
    throw new Error("Level 5 state QA requires the dedicated 5184 disposable origin and QA entry.");
  }
  const scenario = new URLSearchParams(search).get("level5");
  if (scenario === null) throw new Error("Level 5 state QA requires an explicit ?level5= scenario.");
  return levelFiveQaScenario(scenario);
}

/** Protect Level 5 saves only when the selected release cannot read them. */
export function assertLevelFourQaProfileCompatible(serializedProfile: string | null,
  maximumPlayableLevel = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.maximumPlayableLevel): void {
  if (maximumPlayableLevel >= 5) return;
  if (serializedProfile === null) return;
  let candidate: unknown;
  try { candidate = JSON.parse(serializedProfile); } catch { return; }
  if (typeof candidate !== "object" || candidate === null || !("campaigns" in candidate) || !Array.isArray(candidate.campaigns)) return;
  for (const campaign of candidate.campaigns) {
    if (typeof campaign !== "object" || campaign === null || typeof campaign.serializedState !== "string") continue;
    let state: unknown;
    try { state = JSON.parse(campaign.serializedState); } catch { continue; }
    if (typeof state === "object" && state !== null && "facilityLevel" in state && state.facilityLevel === 5) {
      throw new Error("This disposable QA profile contains Level 5 saves. Keep ?level5= on this profile, or use a fresh disposable profile for Level 4 QA. Nothing was loaded or overwritten.");
    }
  }
}

/** Existing campaigns are resumed, never overwritten. No auth/access-gate bypass. */
export function prepareLevelFiveQaProfile(profile: LocalPrototypeProfile, scenario: LevelFiveQaScenario, founderTier = 1): LocalPrototypeProfile {
  if (!Number.isInteger(founderTier) || founderTier < 1 || founderTier > 5) throw new Error("Founder appearance tier must be 1-5.");
  const campaignId = levelFiveQaCampaignId(scenario, founderTier);
  const next = { ...profile, campaigns: [...profile.campaigns], activeCampaignId: campaignId, tutorialsEnabled: false,
    tutorialIntroDismissedCampaignIds: [...new Set([...profile.tutorialIntroDismissedCampaignIds, campaignId])] };
  if (!next.campaigns.some(campaign => campaign.campaignId === campaignId)) {
    const state = createLevelFiveStateQaState(scenario);
    state.campaignId = campaignId;
    if (scenario === "rooms") {
      // Appearance preview only: no effect or purchase receipt is fabricated.
      state.rooms.find(room => room.roomDefinitionId === "room.founder_office")!.upgradeLevel = founderTier as 1 | 2 | 3 | 4 | 5;
    }
    next.campaigns.push({ campaignId, name: scenario.startsWith("integration-") ? `Level 5 M9 integration (${scenario})` : scenario.startsWith("economy") ? `Level 5 M8 economy (${scenario})` : LEVEL_FIVE_REPORT_QA_SCENARIOS.includes(scenario as LevelFiveReportQaScenario) ? `Level 5 M7c report and finish (${scenario})` : scenario.startsWith("inspectors") ? `Level 5 M7b inspectors (${scenario})` : scenario.startsWith("inspection-") ? `Level 5 M7a inspection (${scenario})` : scenario === "l4-ready" || scenario.startsWith("goals") ? `Level 5 M6 goals (${scenario})` : scenario.startsWith("gift") ? `Level 5 M5 Gift Shop (${scenario})` : scenario.startsWith("executive") ? `Level 5 M4 Executive (${scenario})` : scenario === "rooms" ? `Level 5 M2 rooms (Founder appearance ${founderTier})` : scenario === "support" ? "Level 5 M3 support effects" : `Level 5 M1 synthetic ${scenario}`, createdAtRealMs: 0,
      updatedAtRealMs: 0, status: "resumable", state });
  }
  return next;
}

export async function bootstrapLevelFiveStateQa(): Promise<void> {
  const scenario = assertLevelFiveQaEntry(location.origin, location.pathname, location.search);
  const tier = scenario === "rooms" ? Number(new URLSearchParams(location.search).get("founderTier") ?? 1) : 1;
  if (!Number.isInteger(tier) || tier < 1 || tier > 5) throw new Error("Founder appearance tier must be 1-5.");
  // Install the opt-in before storage validation and the shared desktop/mobile App load.
  PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
  const { profile } = loadPrototypeProfile();
  const result = savePrototypeProfileResult(prepareLevelFiveQaProfile(profile, scenario, tier));
  if (!result.ok) throw new Error(`Level 5 QA fixture could not be saved: ${result.failure.message}`);
  document.title = `${scenario.startsWith("integration-") ? "Level 5 M9 integration" : scenario.startsWith("economy") ? "Level 5 M8 economy" : LEVEL_FIVE_REPORT_QA_SCENARIOS.includes(scenario as LevelFiveReportQaScenario) ? "Level 5 M7c report and finish" : scenario.startsWith("inspectors") ? "Level 5 M7b inspectors" : scenario.startsWith("inspection-") ? "Level 5 M7a inspections" : scenario === "l4-ready" || scenario.startsWith("goals") ? "Level 5 M6 goals" : scenario.startsWith("gift") ? "Level 5 M5 Gift Shop" : scenario.startsWith("executive") ? "Level 5 M4 Executive" : scenario === "rooms" ? "Level 5 M2 rooms" : scenario === "support" ? "Level 5 M3 room effects" : "Level 5 M1 synthetic"} ${scenario} - disposable prototype`;
  if (scenario.startsWith("integration-")) console.info(`M9 ${scenario}: actual saved milestones from one reducer journey with earned Level 4/5 goals, construction, Executive work and repeat inspections. One operating-day study session per calendar day; FSRS dates unchanged and offline time adds no active minutes. No browser answer bot. location.origin=${location.origin}. Use a fresh disposable profile per checkpoint and keep ?level5= on reload.`);
  else if (scenario.startsWith("economy")) console.info(`M8 ${scenario}: all five rooms, default $45 Executive, funded normal arrivals. economy-inspection is a paused reducer-earned audit checkpoint; no browser answer bot. location.origin=${location.origin}. Use a dedicated disposable Level 5 profile and keep ?level5= on reload.`);
  else console.info(`Level 5 QA (${scenario}); location.origin=${location.origin}; inspection booking, the full window, scoring, first-completion records and presentation-only inspector actors are active. QA XP/setup and scripted final-window admissions are synthetic; minute/answer/receipt evidence in inspection-* and inspector travel are reducer-earned. Use a dedicated disposable Level 5 profile and keep ?level5= on reload.`);
  await import("../../apps/player/src/main");
}
