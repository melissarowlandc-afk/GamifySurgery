import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudFailureCode, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { loadCloudEvidenceCheckpoint } from "../../apps/player/src/session/cloud/codecEvidence";

// Manager runs this against the dev-only cloud-saves-qa.html at the disposable
// 127.0.0.1:5184 origin. No Supabase, Auth keys, copied saves or live endpoints.
async function rig(browser: Browser, baseURL: string, layout: "desktop" | "phone") {
  const server = new FakeCloudServer(), contexts: BrowserContext[] = [];
  const authenticated = new Map<Page, string | null>(), transport = server.transport("qa-account-a");
  let unavailable: CloudFailureCode | null = null;
  const page = async (deviceCampaigns = 0) => {
    const context = await browser.newContext({ viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: layout === "phone", hasTouch: layout === "phone", acceptDownloads: true });
    contexts.push(context); const tab = await context.newPage();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => { authenticated.set(page, account); });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
      if (account !== "qa-account-a" || authenticated.get(page) !== account) return { error: { code: "auth" } };
      if (unavailable) return { error: { code: unavailable } };
      try {
        const action = transport[method];
        if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
        return { value: await (action as (...args: unknown[]) => Promise<unknown>)(...args) };
      } catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
    });
    await tab.goto(`${baseURL.replace(/\/$/, "")}/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=qa-account-a&device-campaigns=${deviceCampaigns}`);
    await expect(tab.getByRole("heading", { name: "Your campaigns", exact: true })).toBeVisible(); return tab;
  };
  return { server, page, fail: (code: CloudFailureCode | null) => { unavailable = code; }, close: async () => { await Promise.all(contexts.map(c => c.close())); } };
}
const snapshot = (page: Page) => page.evaluate(() => window.__cloudQa!.snapshot());
async function importAndOpen(page: Page) {
  await expect(page.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true }).click();
  await page.getByRole("button", { name: "Continue on this device", exact: true }).click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe("ready");
  await expect(page.getByRole("button", { name: /Account save status:/ })).toHaveCount(0);
}
async function details(page: Page) {
  const dialog = page.getByRole("dialog");
  // A failure can open this modal between the visibility check and the click.
  // Recheck the visible dialog instead of waiting behind its modal backdrop.
  await expect(async () => {
    if (!await dialog.isVisible()) await page.getByRole("button", { name: /Account save status:/ }).click({ timeout: 1_000 });
    await expect(dialog).toBeVisible();
  }).toPass({ timeout: 5_000 });
  return dialog;
}

for (const layout of ["desktop", "phone"] as const) {
  test(`${layout}: unavailable service while navigator is online preserves pending work and blocks real commands`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const page = await f.page(1); await importAndOpen(page);
      const before = (await snapshot(page)).state!, original = await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      f.fail("network");
      expect(await page.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      expect(await page.evaluate(() => navigator.onLine)).toBe(true);
      await page.evaluate(() => window.__cloudQa!.focus());
      const waiting = await snapshot(page); expect(waiting.pending).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect((await snapshot(page)).state!.facilityTick).toBe(before.facilityTick);
      const dialog = await details(page);
      await expect(dialog.getByRole("button", { name: "Retry account save", exact: true })).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Keep a recovery copy", exact: true })).toBeVisible();
      await dialog.getByRole("button", { name: "Not now", exact: true }).click();
      await page.getByRole("button", { name: "Save & Close", exact: true }).click();
      await expect(page.getByText("Account save and session close are not confirmed.", { exact: false })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Safe to close this tab", exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      expect(f.server.operationCount("qa-account-a")).toBe(1); // import only
    } finally { await f.close(); }
  });
  test(`${layout}: service read-only gate safely pauses an open writer and retains the confirmed account save`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const page = await f.page(1); await importAndOpen(page);
      const id = (await snapshot(page)).state!.campaignId, confirmed = structuredClone(f.server.account("qa-account-a").campaigns.get(id)!.confirmed);
      await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }));
      f.server.setAccess("qa-account-a", { enabled: false });
      expect(await page.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      const dialog = await details(page);
      await expect(dialog.getByText("Account saving is disabled by the service.", { exact: false })).toBeVisible();
      expect((await snapshot(page)).phase).toBe("blocked"); expect((await snapshot(page)).pending).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_PAUSED", paused: false }))).toBe(false);
      expect(f.server.account("qa-account-a").campaigns.get(id)!.confirmed).toEqual(confirmed);
    } finally { await f.close(); }
  });
  test(`${layout}: capacity warning precedes the hard limit; a rejected checkpoint keeps history and offers recovery`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      f.server.setAccess("qa-account-a", { quotaWarning: true }); const page = await f.page(1);
      await expect(page.getByText("Account storage is nearly full.", { exact: false })).toBeVisible();
      await importAndOpen(page);
      const id = (await snapshot(page)).state!.campaignId, before = structuredClone(f.server.account("qa-account-a").campaigns.get(id)!.confirmed);
      f.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("capacity") });
      expect(await page.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      const dialog = await details(page);
      await expect(dialog.getByText("History has not been removed to make space.", { exact: false })).toBeVisible();
      expect((await snapshot(page)).phase).toBe("capacity"); expect((await snapshot(page)).pending).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      const downloaded = page.waitForEvent("download");
      await dialog.getByRole("button", { name: "Keep a recovery copy", exact: true }).click();
      expect(await (await downloaded).failure()).toBeNull();
      expect(f.server.account("qa-account-a").campaigns.get(id)!.confirmed).toEqual(before);
    } finally { await f.close(); }
  });
  test(`${layout}: a corrupt current revision reports verified-prior recovery, exports it and never rewinds the server`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const first = await f.page(1); await importAndOpen(first);
      const id = (await snapshot(first)).state!.campaignId;
      expect(await first.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); return window.__cloudQa!.checkpoint(); })).toBe(true);
      await first.getByRole("button", { name: "Save & Close", exact: true }).click();
      await expect(first.getByRole("heading", { name: "Safe to close this tab", exact: true })).toBeVisible();
      const row = f.server.account("qa-account-a").campaigns.get(id)!;
      const prior = structuredClone(row.prior!);
      const priorState = (await loadCloudEvidenceCheckpoint({ snapshot: prior.snapshot, evidence: prior.evidence,
        revision: prior.revision, expectedRevision: prior.revision, expectedCampaignId: id, expectedBaselineId: prior.baselineId })).state;
      row.confirmed = { ...row.confirmed, snapshot: { ...row.confirmed.snapshot, uncompressedSha256: "0".repeat(64) } };
      const head = structuredClone(row.confirmed), operationCount = f.server.operationCount("qa-account-a"), generation = row.generation;
      const second = await f.page(); await second.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true }).click();
      const dialog = await details(second);
      await expect(dialog.getByText("The latest save failed verification.", { exact: false })).toBeVisible();
      expect((await snapshot(second)).revision).toBe(prior.revision);
      expect((await snapshot(second)).state).toEqual(priorState);
      await expect(dialog.getByRole("button", { name: "Continue on this device", exact: true })).toHaveCount(0);
      await expect(dialog.getByRole("button", { name: "Use account save", exact: true })).toHaveCount(0);
      expect(await second.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(await second.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      const downloaded = second.waitForEvent("download"); await dialog.getByRole("button", { name: "Keep a recovery copy", exact: true }).click();
      expect(await (await downloaded).failure()).toBeNull();
      expect(row.confirmed).toEqual(head); expect(row.prior).toEqual(prior); expect(row.generation).toBe(generation);
      expect(f.server.operationCount("qa-account-a")).toBe(operationCount);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
}
