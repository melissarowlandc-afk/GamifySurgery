import { expect, test } from "@playwright/test";
import { getProfile, PROFILE_KEY, startClinic, completeClinicOpening } from "./helpers";
import { expectCampaignGuidance, reloadTutorialCampaign, tutorialState } from "./tutorial-helpers";

test("skip, show-here and first-shift replay are scoped to each saved clinic", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Campaign compatibility is checked once at desktop width.");
  const clinicName = "Guidance Preference Clinic";
  await startClinic(page, "Preference Founder", clinicName);
  const originalId = (await tutorialState(page)).campaignId;
  await page.getByRole("button", {name: "Skip guidance", exact: true}).click();
  await expectCampaignGuidance(page, "off");
  await expect(page.locator(".tutorial-coach")).toHaveCount(0);
  await reloadTutorialCampaign(page, clinicName);
  await expectCampaignGuidance(page, "off");

  await page.getByRole("button", {name: "Help", exact: true}).click();
  await page.getByRole("button", {name: "Show guidance here"}).click();
  await expectCampaignGuidance(page, "guided");
  await expect(page.locator(".tutorial-coach")).toBeVisible();
  await page.getByRole("button", {name: "Skip guidance", exact: true}).click();
  await page.getByRole("button", {name: "Help", exact: true}).click();
  await page.getByRole("button", {name: "Replay first shift in a new clinic"}).click();
  await expect(page.getByRole("heading", {name: "Open Your Clinic"})).toBeVisible();
  const beforeReplay = await getProfile(page);
  const savedOriginal = beforeReplay.campaigns.find((campaign) => campaign.campaignId === originalId)!;
  expect(savedOriginal.status).toBe("resumable");
  expect(JSON.parse(savedOriginal.serializedState).paused).toBe(true);
  await expect(page.getByLabel("First-shift guidance")).toBeChecked();
  await completeClinicOpening(page, "Replay Founder", "Separate Replay Clinic");
  await expectCampaignGuidance(page, "guided");
  const replayProfile = await getProfile(page);
  expect(replayProfile.activeCampaignId).not.toBe(originalId);
  expect(replayProfile.campaigns).toHaveLength(2);
  expect(replayProfile.campaigns.find((campaign) => campaign.campaignId === originalId)).toEqual(savedOriginal);
  expect(replayProfile.tutorialGuidanceByCampaign?.[originalId]?.mode).toBe("off");
  expect((await tutorialState(page)).cash).toBe(120);
});

test("an advanced legacy clinic without a second protected record needs no completion click", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Legacy migration is checked once at desktop width.");
  const clinicName = "Legacy Advanced Guidance Clinic";
  await startClinic(page, "Legacy Founder", clinicName);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(campaign.serializedState);
  state.facilityLevel = 3;
  state.paused = true;
  state.encounters = {}; // Compatibility fixture, never a natural-graduation shortcut.
  state.alertHumor.nextAmbientAlertTick = state.facilityTick + 250;
  campaign.serializedState = JSON.stringify(state);
  delete profile.tutorialGuidanceByCampaign;
  profile.tutorialsEnabled = true;
  await page.addInitScript(({key, fixture}) => window.localStorage.setItem(key, JSON.stringify(fixture)), {key: PROFILE_KEY, fixture: profile});
  await page.goto("/?prototype-tools=0");
  await page.getByRole("button", {name: `Resume ${clinicName}`}).click();
  await expectCampaignGuidance(page, "complete");
  await expect(page.locator(".tutorial-coach")).toHaveCount(0);
  const restored = await tutorialState(page);
  expect(restored.encounters).toEqual({});
  expect(restored.alertHumor.nextAmbientAlertTick).toBe(state.alertHumor.nextAmbientAlertTick);
  expect(restored.alertHumor.alertsTutorialAcknowledgedAtTick).not.toBeNull();
  expect(restored.paused).toBe(true);
});
