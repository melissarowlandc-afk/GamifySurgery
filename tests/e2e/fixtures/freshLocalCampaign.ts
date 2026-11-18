import { expect, type Page } from "@playwright/test";
import { installRememberedLocalAccess, resumeLocalCampaign, seedLocalProfileOnce } from "../helpers";

/** A new identity has no pre-existing IndexedDB journal to win recovery over
 * the fixture. Install once, so reload tests exercise ordinary durability. */
export async function openFreshLocalCampaign<T extends { campaignId: string }>(
  page: Page, state: T, name: string, options: { transform?: (state: T) => void; url?: string } = {},
) {
  await installRememberedLocalAccess(page);
  const complete = structuredClone(state);
  options.transform?.(complete);
  const now = Date.now();
  const profile = { schemaVersion: 2, nextCampaignNumber: 2,
    activeCampaignId: complete.campaignId, tutorialsEnabled: false,
    tutorialGuidanceByCampaign: { [complete.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
    tutorialIntroDismissedCampaignIds: [complete.campaignId], tutorialDailyRoutineTipAcknowledgments: {},
    tutorialDailyRoutinePauseByCampaign: {}, campaigns: [{ campaignId: complete.campaignId, name, status: "resumable" as const,
      createdAtRealMs: now, updatedAtRealMs: now, serializedState: JSON.stringify(complete) }] };
  const expected = await seedLocalProfileOnce(page, profile);
  await page.goto(options.url ?? "/?prototype-tools=0&facility-gait-proof=1");
  await resumeLocalCampaign(page, name);
  // Canvas creation precedes the end of asynchronous opening/import. Testing
  // its visibility alone can send input to the loading screen above it.
  await expect(page.getByRole("region", { name: "Loading clinic", exact: true })).toBeHidden({ timeout: 30_000 });
  return expected;
}
