import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { loadPrototypeProfile, savePrototypeProfileResult } from "../../apps/player/src/session/prototypeStorage";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState, LEVEL_FOUR_ROOMS_QA_CAMPAIGN_ID,
  placeLevelFourRoomsQaRooms } from "../../tests/fixtures/level-four-rooms";
import { APP_APPOINTMENTS_QA_CAMPAIGN_ID, createAppAppointmentsQaState } from "../../tests/fixtures/app-appointments";
import { PEDIATRIC_APPOINTMENTS_QA_CAMPAIGN_ID, createPediatricAppointmentsQaState } from "../../tests/fixtures/pediatric-appointments";
import { PEDIATRIC_CHARTS_QA_CAMPAIGN_ID, createPediatricChartsQaState } from "../../tests/fixtures/pediatric-charts";
import { MRI_APPOINTMENTS_QA_CAMPAIGN_ID, createMriAppointmentsQaState } from "../../tests/fixtures/mri-appointments";
import { WOUND_OSTOMY_APPOINTMENTS_QA_CAMPAIGN_ID, createWoundOstomyAppointmentsQaState } from "../../tests/fixtures/wound-ostomy-appointments";
import { createLevelThreeReadyQaState, createLevelFourAlmostQaState, LEVEL_THREE_READY_QA_CAMPAIGN_ID,
  LEVEL_FOUR_ALMOST_QA_CAMPAIGN_ID } from "../../tests/fixtures/level-four-progression";

if (location.origin !== "http://127.0.0.1:5184" || location.pathname !== "/level4-rooms-qa.html") {
  throw new Error("Level 4 room QA requires its dedicated disposable origin and entry.");
}
// Consumers share this context. Enable it before dynamically loading the App,
// including storage validation on every reload; no production balance mutation.
PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFourRoomsQaContext().balanceRelease;
const { profile } = loadPrototypeProfile();
const progressionState = new URLSearchParams(location.search).get("state");
const l3ready = progressionState === "l3ready";
const l4almost = progressionState === "l4almost";
const placed = new URLSearchParams(location.search).get("rooms") === "placed";
const apps = new URLSearchParams(location.search).get("apps") === "appointments";
const pediatrics = new URLSearchParams(location.search).get("apps") === "pediatrics";
const pedcharts = new URLSearchParams(location.search).get("apps") === "pedcharts";
const mri = new URLSearchParams(location.search).get("apps") === "mri";
const wound = new URLSearchParams(location.search).get("apps") === "wound";
const campaignId = l3ready ? LEVEL_THREE_READY_QA_CAMPAIGN_ID : l4almost ? LEVEL_FOUR_ALMOST_QA_CAMPAIGN_ID : pedcharts ? PEDIATRIC_CHARTS_QA_CAMPAIGN_ID : wound ? WOUND_OSTOMY_APPOINTMENTS_QA_CAMPAIGN_ID : mri ? MRI_APPOINTMENTS_QA_CAMPAIGN_ID : pediatrics ? PEDIATRIC_APPOINTMENTS_QA_CAMPAIGN_ID : apps ? APP_APPOINTMENTS_QA_CAMPAIGN_ID : LEVEL_FOUR_ROOMS_QA_CAMPAIGN_ID + (placed ? ".placed" : "");
if (!profile.campaigns.some((campaign) => campaign.campaignId === campaignId)) {
  let state = l3ready ? createLevelThreeReadyQaState() : l4almost ? createLevelFourAlmostQaState(PROTOTYPE_DOMAIN_CONTEXT) : pedcharts ? createPediatricChartsQaState(PROTOTYPE_DOMAIN_CONTEXT) : wound ? createWoundOstomyAppointmentsQaState(PROTOTYPE_DOMAIN_CONTEXT) : mri ? createMriAppointmentsQaState(PROTOTYPE_DOMAIN_CONTEXT) : pediatrics ? createPediatricAppointmentsQaState(PROTOTYPE_DOMAIN_CONTEXT) : apps ? createAppAppointmentsQaState(PROTOTYPE_DOMAIN_CONTEXT) : createLevelFourRoomsQaState(PROTOTYPE_DOMAIN_CONTEXT);
  if (placed && !l3ready && !l4almost && !apps && !pediatrics && !pedcharts && !mri && !wound) state = placeLevelFourRoomsQaRooms(state, PROTOTYPE_DOMAIN_CONTEXT);
  state.campaignId = campaignId;
  profile.campaigns.push({ campaignId, name: l3ready ? "Level 4 M8 ready to advance" : l4almost ? "Level 4 M8 one visit to finish" : pedcharts ? "Level 4 M7 scored pediatric charts" : wound ? "Level 4 M6 wound/ostomy visits" : mri ? "Level 4 M6 MRI services" : pediatrics ? "Level 4 M5 pediatric families" : apps ? "Level 4 M4 APP appointments" : placed ? "Level 4 M3 placed preview" : "Level 4 M3 room QA",
    createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state });
}
profile.activeCampaignId = campaignId;
profile.tutorialsEnabled = false;
profile.tutorialIntroDismissedCampaignIds = [...new Set([...profile.tutorialIntroDismissedCampaignIds, campaignId])];
const result = savePrototypeProfileResult(profile);
if (!result.ok) throw new Error(`Level 4 QA fixture could not be saved: ${result.failure.message}`);
document.title = l3ready ? "Level 4 M8 advance - disposable prototype" : l4almost ? "Level 4 M8 completion - disposable prototype" : pedcharts ? "Level 4 M7 scored pediatric charts - disposable prototype" : wound ? "Level 4 M6 wound/ostomy visits - disposable prototype" : mri ? "Level 4 M6 MRI services - disposable prototype" : pediatrics ? "Level 4 M5 pediatric families - disposable prototype" : apps ? "Level 4 M4 APP appointments - disposable prototype" : "Level 4 M3 room QA - disposable prototype";
console.info(`Level 4 QA; location.origin=${location.origin}; production progression reaches Level 4; this campaign is disposable.`);
await import("../../apps/player/src/main");
