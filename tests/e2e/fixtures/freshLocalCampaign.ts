import { expect, type Page } from "@playwright/test";
import { installRememberedLocalAccess, PROFILE_KEY, resumeLocalCampaign } from "../helpers";

/** A new identity has no pre-existing IndexedDB journal to win recovery over
 * the fixture. Install once, so reload tests exercise ordinary durability. */
export async function openFreshLocalCampaign(page: Page, state: { campaignId: string }, name: string) {
  await installRememberedLocalAccess(page);
  await page.addInitScript(({ key, state, name }) => {
    const marker = `fixture-installed:${state.campaignId}`;
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    const now = Date.now();
    localStorage.setItem(key, JSON.stringify({ schemaVersion: 2, nextCampaignNumber: 2,
      activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2, mode: "off", exposedTopicIds: [] } },
      tutorialIntroDismissedCampaignIds: [state.campaignId], tutorialDailyRoutineTipAcknowledgments: {},
      tutorialDailyRoutinePauseByCampaign: {}, campaigns: [{ campaignId: state.campaignId, name, status: "resumable",
        createdAtRealMs: now, updatedAtRealMs: now, serializedState: JSON.stringify(state) }] }));
  }, { key: PROFILE_KEY, state, name });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await resumeLocalCampaign(page, name);
  // Canvas creation precedes the end of asynchronous opening/import. Testing
  // its visibility alone can send input to the loading screen above it.
  await expect(page.getByRole("region", { name: "Loading clinic", exact: true })).toBeHidden({ timeout: 30_000 });
}
