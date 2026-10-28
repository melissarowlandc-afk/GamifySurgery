import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudFailureCode, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { loadCloudEvidenceCheckpoint } from "../../apps/player/src/session/cloud/codecEvidence";
import { cloudProgress } from "../../apps/player/src/session/cloud/progress";
import { syncFixture } from "../../apps/player/src/session/cloud/syncFixtureSupport";
import { expectAccountSaved, expectPlaying, expectResumeReady, openAndContinue, saveDetails as details, snapshot, CLOUD_QA_WAIT_MS } from "./cloud-qa-helpers";

// Manager runs this against the dev-only cloud-saves-qa.html at the disposable
// 127.0.0.1:5184 origin. No Supabase, Auth keys, copied saves or live endpoints.
test.setTimeout(180_000); // Independent cold Vite contexts; checks still use bounded state polling.
async function rig(browser: Browser, baseURL: string, layout: "desktop" | "phone") {
  const server = new FakeCloudServer(), contexts: BrowserContext[] = [];
  const authenticated = new Map<Page, string | null>(), transport = server.transport("qa-account-a");
  let unavailable: CloudFailureCode | null = null;
  const unavailablePages = new Map<Page, CloudFailureCode>();
  const page = async (deviceCampaigns = 0) => {
    const context = await browser.newContext({ viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: layout === "phone", hasTouch: layout === "phone", acceptDownloads: true });
    contexts.push(context); const tab = await context.newPage();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => { authenticated.set(page, account); });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
      if (account !== "qa-account-a" || authenticated.get(page) !== account) return { error: { code: "auth" } };
      if (unavailable) return { error: { code: unavailable } };
      if (unavailablePages.has(page)) return { error: { code: unavailablePages.get(page)! } };
      try {
        const action = transport[method];
        if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
        return { value: await (action as (...args: unknown[]) => Promise<unknown>)(...args) };
      } catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
    });
    await tab.goto(`${baseURL.replace(/\/$/, "")}/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=qa-account-a&device-campaigns=${deviceCampaigns}`);
    await expect(tab.getByRole("heading", { name: "Your campaigns", exact: true })).toBeVisible({ timeout: CLOUD_QA_WAIT_MS }); return tab;
  };
  return { server, page, fail: (code: CloudFailureCode | null) => { unavailable = code; },
    failPage: (page: Page, code: CloudFailureCode | null) => { if (code) unavailablePages.set(page, code); else unavailablePages.delete(page); },
    close: async () => { await Promise.all(contexts.map(c => c.close())); } };
}
async function importAndOpen(page: Page) {
  await expectResumeReady(page, "Synthetic clinic 1");
  await openAndContinue(page);
}

for (const layout of ["desktop", "phone"] as const) {
  test(`${layout}: same-device reopen after hidden/pagehide resumes pending progress automatically and uploads it`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const page = await f.page(1); await importAndOpen(page);
      const original = await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      const id = (await snapshot(page)).state!.campaignId;
      f.failPage(page, "network");
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }))).toBe(true);
      const pending = (await snapshot(page)).state!;
      await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        document.dispatchEvent(new Event("visibilitychange"));
        window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
      });
      await expect.poll(async () => (await snapshot(page)).failure).toBe("network");
      expect((await snapshot(page)).pending).toBe(true);
      expect(f.server.account("qa-account-a").campaigns.get(id)!.confirmed.revision).toBe("1");
      // This reload keeps this context's own IndexedDB and writer proof. There
      // is no release, copied save, elapsed lease, or explicit continuation.
      f.failPage(page, null); await page.reload(); await expectPlaying(page); await expectAccountSaved(page);
      expect((await snapshot(page)).state).toEqual(pending);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect.poll(() => f.server.account("qa-account-a").campaigns.get(id)!.confirmed.revision).toBe("2");
      expect(f.server.operationCount("qa-account-a")).toBe(2); // import and one immutable checkpoint
      expect(f.server.usageCount("qa-account-a")).toBe(0);
      expect(await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
    } finally { await f.close(); }
  });

  for (const freeSlot of [true, false]) {
    test(`${layout}: true two-device divergence compares both copies and ${freeSlot ? "keeps both account campaigns" : "respects the full account slot limit"}`, async ({ browser, baseURL }) => {
      const f = await rig(browser, baseURL!, layout);
      try {
        const device = await f.page(1); await importAndOpen(device);
        const id = (await snapshot(device)).state!.campaignId;
        // Keep an unuploaded branch on the first device while the other device
        // explicitly takes over and writes a different immutable transition.
        f.failPage(device, "network");
        expect(await device.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }))).toBe(true);
        const local = (await snapshot(device)).state!;
        const remote = await f.page();
        await remote.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true }).click();
        const takeover = remote.getByRole("dialog", { name: "Continue on this device?", exact: true });
        await expect(takeover).toBeVisible(); await expect(takeover).toContainText("This campaign is open somewhere else.");
        expect((await snapshot(remote)).canExecute).toBe(false);
        await takeover.getByRole("button", { name: "Continue on this device", exact: true }).click();
        await expectPlaying(remote);
        expect(await remote.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }); return window.__cloudQa!.checkpoint(); })).toBe(true);
        const accountRow = f.server.account("qa-account-a").campaigns.get(id)!;
        const account = structuredClone(accountRow), remoteState = (await snapshot(remote)).state!;
        const verifiedAccount = await loadCloudEvidenceCheckpoint({ ...account.confirmed, expectedRevision: account.confirmed.revision,
          expectedCampaignId: id, expectedBaselineId: account.confirmed.baselineId });
        if (!freeSlot) {
          const extra = await syncFixture("qa.archived-slot"); f.server.seed("qa-account-a", extra.confirmed);
          f.server.account("qa-account-a").campaigns.get(extra.confirmed.campaignId)!.summary = { name: "Archived slot", status: "archived" };
        }
        f.failPage(device, null); await device.evaluate(() => window.__cloudQa!.focus());
        const dialog = await details(device), comparison = dialog.getByRole("region", { name: "Compare saved progress" });
        await expect(comparison).toBeVisible();
        // These values come from each verified projection, not server list
        // metadata. Tied clinic times explicitly identify different changes.
        for (const [label, progress] of [["On this device:", cloudProgress(local)], ["Account save:", cloudProgress(verifiedAccount.state)]] as const) {
          await expect(comparison.getByText(new RegExp(`^${label}`))).toContainText(progress.dayTime);
          await expect(comparison.getByText(new RegExp(`^${label}`))).toContainText(`$${progress.cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
        await expect(comparison).toContainText("Both copies are at the same clinic time. Their changes differ.");
        expect((await snapshot(device)).canExecute).toBe(false);
        expect(await device.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
        const keepBoth = dialog.getByRole("button", { name: "Keep both — save this device's progress as a separate campaign", exact: true });
        await expect(dialog.getByRole("button", { name: "Use the account save", exact: true })).toBeEnabled();
        if (freeSlot) {
          await expect(keepBoth).toBeEnabled(); await keepBoth.click(); await expectPlaying(device);
          const branch = (await snapshot(device)).state!; expect(branch.campaignId).not.toBe(id);
          expect(branch).toEqual({ ...local, campaignId: branch.campaignId });
          const copy = f.server.account("qa-account-a").campaigns.get(branch.campaignId)!.confirmed;
          const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision, expectedCampaignId: branch.campaignId, expectedBaselineId: copy.baselineId });
          expect(loaded.campaign.name).toBe("Synthetic clinic 1 (this device)");
          expect(loaded.checkpoint.snapshot.head.sequence).toBeGreaterThan(0);
          expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
          // Cold reopen must choose the verified new campaign, not reopen the
          // old protected divergent branch or mint a second import.
          const count = f.server.operationCount("qa-account-a"); await device.reload(); await expectPlaying(device);
          expect((await snapshot(device)).state).toEqual(branch); expect(f.server.operationCount("qa-account-a")).toBe(count);
        } else {
          await expect(keepBoth).toBeDisabled(); await expect(dialog).toContainText("No slot is free");
          await expect(dialog).toContainText("protected copy is retained");
          const downloaded = device.waitForEvent("download");
          await dialog.getByRole("button", { name: "Keep a recovery copy", exact: true }).click();
          expect(await (await downloaded).failure()).toBeNull();
          expect((await snapshot(device)).pending).toBe(true);
          expect((await snapshot(device)).state!.simulationSpeed).toBe(2);
          expect(f.server.calls.filter(call => call.method === "importCampaign")).toHaveLength(1); // original only
          expect(f.server.calls.some(call => call.method === "deleteCampaign")).toBe(false);
        }
        const unchanged = f.server.account("qa-account-a").campaigns.get(id)!;
        expect(unchanged.confirmed).toEqual(account.confirmed); expect(unchanged.prior).toEqual(account.prior);
        expect(unchanged.generation).toBe(account.generation); expect(unchanged.token).toBe(account.token);
        expect((await snapshot(remote)).state).toEqual(remoteState);
        expect(f.server.usageCount("qa-account-a")).toBe(0);
        if (!freeSlot) {
          const recovery = device.waitForEvent("download");
          await (await details(device)).getByRole("button", { name: "Use the account save", exact: true }).click();
          expect(await (await recovery).failure()).toBeNull();
          // Choosing the account copy does not silently revoke its still-live
          // writer. Continuing here needs a second, explicit takeover choice.
          const takeover = device.getByRole("dialog", { name: "Continue on this device?", exact: true });
          await expect(takeover).toBeVisible(); expect((await snapshot(device)).canExecute).toBe(false);
          expect(f.server.account("qa-account-a").campaigns.get(id)!.confirmed).toEqual(account.confirmed);
          await takeover.getByRole("button", { name: "Continue on this device", exact: true }).click();
          await expectPlaying(device); expect((await snapshot(device)).state).toEqual(remoteState);
        }
      } finally { await f.close(); }
    });
  }

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
      await expect(dialog.getByRole("button", { name: "Use the account save", exact: true })).toHaveCount(0);
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
