import { expect, test } from "@playwright/test";

const profileKey = "gamify-surgery.prototype.profile.v1";
const isFaviconUrl = (url: string) => new URL(url).pathname.endsWith("/favicon.ico");

// Run against `vite preview --base /GamifySurgery/` or the deployed Pages origin:
// GAMIFY_E2E_PAGES_SMOKE=1 GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:<port> npx playwright test tests/e2e/pages-release-smoke.spec.ts --project=laptop-chrome
test.skip(process.env.GAMIFY_E2E_PAGES_SMOKE !== "1", "Pages release smoke is opt-in.");

test("Pages-base production build starts, persists a disposable clinic, and reloads", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "laptop-chrome", "Pages release smoke is laptop-only.");
  test.setTimeout(120_000);
  const requestFailures: string[] = [];
  const consoleErrors: Array<{ text: string; url: string }> = [];
  const pageErrors: string[] = [];
  const loadedImageUrls: string[] = [];
  page.on("requestfailed", (request) => requestFailures.push(request.url()));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push({ text: message.text(), url: message.location().url });
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.ok() && response.headers()["content-type"]?.startsWith("image/")) {
      loadedImageUrls.push(response.url());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) requestFailures.push(`${response.status()} ${response.url()}`);
  });

  await page.goto("/GamifySurgery/?prototype-tools=0");
  await expect(page.getByRole("heading", { name: "Local Prototype" })).toBeVisible();
  await page.getByRole("button", { name: "Enter Local Prototype" }).click();
  await expect(page.getByRole("heading", { name: "Clinic Campaigns" })).toBeVisible();
  await page.getByRole("button", { name: "New Campaign" }).click();
  await page.getByLabel("Founder name").fill("Pages Smoke Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Build a Surgery Clinic" }).click();
  await page.getByLabel("Clinic name").fill("Pages Smoke Clinic");
  await page.getByRole("button", { name: "Open the Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1_000);
  const canvasBounds = await page.getByTestId("facility-canvas").boundingBox();
  expect(canvasBounds?.width).toBeGreaterThan(0);
  expect(canvasBounds?.height).toBeGreaterThan(0);
  const documentImages = await page.locator("img").evaluateAll((images) => images.map((image) => ({ complete: image.complete, naturalWidth: image.naturalWidth })));
  expect(documentImages.every((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("pages-production-laptop.png"), fullPage: true });

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await page.getByRole("button", { name: "Done / Save" }).click();

  await page.getByRole("button", { name: "Save & Close" }).click();
  await expect(page.getByRole("heading", { name: "Safe to close" })).toBeVisible();
  const beforeReload = await page.evaluate((key) => {
    const profile = JSON.parse(window.localStorage.getItem(key) ?? "null");
    const campaign = profile?.campaigns?.find((item: { campaignId: string }) => item.campaignId === profile.activeCampaignId);
    return campaign ? { id: campaign.campaignId, founder: JSON.parse(campaign.serializedState).founder.displayName, paused: JSON.parse(campaign.serializedState).paused } : null;
  }, profileKey);
  expect(beforeReload).not.toBeNull();
  expect(beforeReload).toMatchObject({ founder: "Pages Smoke Founder", paused: true });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Clinic Campaigns" })).toBeVisible();
  await page.getByRole("button", { name: "Resume Pages Smoke Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const afterReload = await page.evaluate((key) => {
    const profile = JSON.parse(window.localStorage.getItem(key) ?? "null");
    const campaign = profile?.campaigns?.find((item: { campaignId: string }) => item.campaignId === profile.activeCampaignId);
    return campaign ? { id: campaign.campaignId, founder: JSON.parse(campaign.serializedState).founder.displayName, paused: JSON.parse(campaign.serializedState).paused } : null;
  }, profileKey);
  expect(afterReload).toEqual(beforeReload);
  expect(loadedImageUrls.length).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
  const unexpectedRequestFailures = requestFailures.filter((entry) => !entry.includes("favicon.ico"));
  expect(unexpectedRequestFailures).toEqual([]);
  const unexpectedConsoleErrors = consoleErrors.filter(({ text, url }) => {
    const isGenericNotFound = /^Failed to load resource: the server responded with a status of 404(?: \([^)]*\))?$/.test(text);
    return !isGenericNotFound || !url || !isFaviconUrl(url);
  });
  expect(unexpectedConsoleErrors).toEqual([]);
});
