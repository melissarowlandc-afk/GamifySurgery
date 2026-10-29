import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { accountMenu, campaignScreen, expectPlaying, expectResumeReady, openAndContinue, retryAccountSave, snapshot, status, CLOUD_QA_WAIT_MS } from "./cloud-qa-helpers";

// These contexts authenticate independently to one disposable in-process fake.
// No Supabase credentials, real Auth, copied localStorage or copied latest saves.
async function rig(browser: Browser, baseURL: string) {
  const server = new FakeCloudServer(), contexts: BrowserContext[] = [], authenticated = new Map<Page, string | null>();
  const transports = new Map<string, CloudTransport>();
  const unavailablePages = new Set<Page>();
  const page = async (layout: "desktop" | "phone", accountId = "qa-account-a", sameContext?: BrowserContext, deviceCampaigns = 0) => {
    const context = sameContext ?? await browser.newContext({ viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: layout === "phone", hasTouch: layout === "phone" });
    if (!sameContext) contexts.push(context);
    const tab = await context.newPage();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => {
      if (account !== null && !["qa-account-a", "qa-account-b"].includes(account)) throw new Error("Unknown synthetic account");
      authenticated.set(page, account);
    });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
      if (authenticated.get(page) !== account) return { error: { code: "auth" } };
      if (unavailablePages.has(page)) return { error: { code: "network" } };
      let transport = transports.get(account);
      if (!transport) { transport = server.transport(account); transports.set(account, transport); }
      try {
        const action = transport[method]; if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
        const value = await (action as (...args: unknown[]) => Promise<unknown>)(...args); return { value };
      } catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
    });
    await tab.goto(`${baseURL.replace(/\/$/, "")}/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=${accountId}&device-campaigns=${deviceCampaigns}`);
    await expect.poll(async () => (await status(tab)).hasState || await tab.getByRole("heading", { name: "Your campaigns", exact: true }).isVisible(),
      { timeout: CLOUD_QA_WAIT_MS }).toBe(true);
    return tab;
  };
  return { server, page, failPage: (page: Page, fail: boolean) => { if (fail) unavailablePages.add(page); else unavailablePages.delete(page); }, close: async () => { await Promise.all(contexts.map(context => context.close())); } };
}
async function expectAutomaticEnrollment(page: Page, name = "Synthetic clinic 1", accountId = "qa-account-a") {
  const key = `gamify-surgery.prototype.profile.v1.account.${encodeURIComponent(accountId)}`;
  const raw = await page.evaluate(key => localStorage.getItem(key), key);
  expect(raw).not.toBeNull();
  await expectResumeReady(page, name);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(raw);
}
async function acceptAccountNotice(page: Page) {
  await expect(page.getByRole("heading", { name: "Before using account saves", exact: true })).toBeVisible();
  await expect(page.locator("details.cloud-account")).not.toHaveAttribute("open");
  await expect(page.getByRole("button", { name: "Accept and continue", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start a new campaign", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Accept and continue", exact: true }).click();
}
async function createAccountCampaign(page: Page, name: string, fromFounder = false) {
  if (!fromFounder) await page.getByRole("button", { name: "Start a new campaign", exact: true }).click();
  await page.getByRole("textbox", { name: "Founder name", exact: true }).fill("Synthetic Founder");
  await page.getByRole("textbox", { name: "Clinic name", exact: true }).fill(name);
  await page.getByRole("checkbox", { name: "First-shift guidance", exact: true }).uncheck();
  await page.getByRole("button", { name: "Open the Clinic", exact: true }).click();
  await expectPlaying(page);
  await campaignScreen(page);
}
async function closeSaved(page: Page) {
  await page.getByRole("button", { name: "Save & Close", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Safe to close this tab", exact: true })).toBeVisible();
  expect((await snapshot(page)).pending).toBe(false);
}

test.describe("Beta 2 disposable fake transport across desktop and phone", () => {
  // Several independent cold contexts share the disposable dev server. Each
  // preparation is bounded separately; this is not the writer-choice deadline.
  test.setTimeout(180_000);
  test("automatic enrollment retains raw bytes, then desktop → phone → desktop preserves the complete saved game", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      f.server.setAccess("qa-account-a", { noticeAccepted: false });
      const desktop = await f.page("desktop", "qa-account-a", undefined, 1);
      expect(f.server.operationCount("qa-account-a")).toBe(0);
      const original = await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      await acceptAccountNotice(desktop);
      await expect(desktop.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true })).toBeEnabled();
      expect(await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      await openAndContinue(desktop);
      await desktop.getByRole("button", { name: "Set facility speed to 2x", exact: true }).click();
      await closeSaved(desktop); const desktopSaved = (await snapshot(desktop)).state!;
      const phone = await f.page("phone");
      expect(await phone.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBeNull();
      await openAndContinue(phone); expect((await snapshot(phone)).state).toEqual(desktopSaved);
      await phone.getByRole("button", { name: "Facility speed 2x. Cycle speed", exact: true }).click();
      await closeSaved(phone); const phoneSaved = (await snapshot(phone)).state!;
      // Reopening, including after Save & Close, checks the latest account copy
      // and resumes without a routine continuation dialog.
      await desktop.reload(); await expectPlaying(desktop);
      await expect.poll(async () => (await snapshot(desktop)).state?.simulationSpeed).toBe(4);
      expect((await snapshot(desktop)).state).toEqual(phoneSaved);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
  test("phone accepts the visible notice and immediately lists its waiting local campaign", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      f.server.setAccess("qa-account-a", { noticeAccepted: false });
      const phone = await f.page("phone", "qa-account-a", undefined, 1);
      const original = await phone.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      expect(f.server.operationCount("qa-account-a")).toBe(0);
      await acceptAccountNotice(phone); await expectAutomaticEnrollment(phone);
      await expect(phone.getByRole("heading", { name: "Resume a previous campaign (1/2)", exact: true })).toBeVisible();
      await expect(phone.getByRole("button", { name: "Accept and continue", exact: true })).toHaveCount(0);
      await expect(phone.locator("details.cloud-account")).not.toHaveAttribute("open");
      expect(await phone.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      expect(f.server.operationCount("qa-account-a")).toBe(1);
    } finally { await f.close(); }
  });
  test("a visible other writer is taken over automatically; the old writer pauses and cannot release the phone session", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop", "qa-account-a", undefined, 1); await expectAutomaticEnrollment(desktop); await openAndContinue(desktop);
      const campaignId = (await snapshot(desktop)).state!.campaignId;
      await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); await window.__cloudQa!.checkpoint(); });
      const phone = await f.page("phone"); await expectResumeReady(phone, "Synthetic clinic 1");
      expect(await desktop.evaluate(() => window.__cloudQa!.checkAuthority())).toBe(true);
      f.failPage(desktop, true);
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }))).toBe(true);
      expect((await f.server.transport("qa-account-a").head(campaignId)).writerActive).toBe(true);
      const before = f.server.account("qa-account-a").campaigns.get(campaignId)!.generation;
      await openAndContinue(phone);
      await expect(phone.getByRole("dialog")).toHaveCount(0);
      const generation = f.server.account("qa-account-a").campaigns.get(campaignId)!.generation;
      expect(generation).toBeGreaterThan(before);
      f.failPage(desktop, false);
      expect(await desktop.evaluate(() => window.__cloudQa!.checkAuthority())).toBe(false);
      await expect.poll(() => status(desktop), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ failure: "writer", canExecute: false });
      const notice = desktop.getByRole("alert", { name: "Clinic status", exact: true });
      await expect(notice).toContainText("This clinic is now open on another device.");
      await expect(notice.getByRole("button", { name: "Open here", exact: true })).toBeVisible();
      await expect(notice.getByRole("button")).toHaveCount(1);
      const tick = (await snapshot(desktop)).state!.facilityTick;
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(await desktop.evaluate(() => window.__cloudQa!.closeLease())).toBe(false);
      expect(f.server.account("qa-account-a").campaigns.get(campaignId)!.generation).toBe(generation);
      expect((await snapshot(desktop)).state!.facilityTick).toBe(tick);
      expect((await snapshot(phone)).state!.simulationSpeed).toBe(2);
      await closeSaved(phone);
    } finally { await f.close(); }
  });
  test("lost acknowledgement uses one immutable operation; offline progress pauses and recovers without replay", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop", "qa-account-a", undefined, 1); await expectAutomaticEnrollment(desktop); await openAndContinue(desktop);
      f.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
      expect(await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      const accepted = f.server.operationCount("qa-account-a");
      await retryAccountSave(desktop);
      await expectPlaying(desktop);
      expect(f.server.operationCount("qa-account-a")).toBe(accepted);
      expect(f.server.calls.filter(call => call.method === "commit")).toHaveLength(1);
      await desktop.context().setOffline(true);
      expect(await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      await desktop.evaluate(async () => { await window.__cloudQa!.checkAuthority(); });
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      await desktop.context().setOffline(false);
      await expectPlaying(desktop); // the online event performs the fresh check
      await expect.poll(async () => (await snapshot(desktop)).pending).toBe(false);
      expect((await snapshot(desktop)).state!.simulationSpeed).toBe(4);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
  test("same-profile second tab is fenced; full deletion blocks the other context while account B survives", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop", "qa-account-a", undefined, 1); await expectAutomaticEnrollment(desktop); await openAndContinue(desktop);
      const tab = await f.page("phone", "qa-account-a", desktop.context()); await openAndContinue(tab);
      await desktop.evaluate(async () => { await window.__cloudQa!.checkAuthority(); });
      expect((await snapshot(desktop)).phase).toBe("conflict");
      const other = await f.page("desktop", "qa-account-b", undefined, 1);
      await expectAutomaticEnrollment(other, "Synthetic clinic 1", "qa-account-b");
      await expect(other.getByRole("heading", { name: "Resume a previous campaign (1/2)" })).toBeVisible();
      await (await accountMenu(tab)).getByRole("button", { name: "Delete my data/account", exact: true }).click();
      await tab.getByRole("button", { name: "Confirm delete all my account data", exact: true }).click();
      await expect(tab.getByText("Account data deletion is confirmed. Play and uploads have stopped.", { exact: true })).toBeVisible();
      await desktop.evaluate(async () => { await window.__cloudQa!.checkAuthority(); });
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(0);
      expect(f.server.account("qa-account-b").access.admitted).toBe(true);
      expect(f.server.account("qa-account-b").campaigns.size).toBe(1);
    } finally { await f.close(); }
  });
  test("two cloud slots include archives; disabled service preserves all device originals", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop", "qa-account-a", undefined, 1); await expectAutomaticEnrollment(desktop); await openAndContinue(desktop);
      await desktop.getByRole("button", { name: "Restart Campaign", exact: true }).click();
      await desktop.getByRole("button", { name: "Archive and restart", exact: true }).click();
      await expect(desktop.getByRole("heading", { name: "Your campaigns", exact: true })).toBeVisible();
      await expect(desktop.getByText("Archived — still counts toward your 2 campaigns", { exact: false })).toBeVisible();
      await createAccountCampaign(desktop, "Synthetic clinic 2");
      await expect(desktop.getByRole("button", { name: "Start a new campaign", exact: true })).toBeEnabled();
      await expect(desktop.getByText("Your account holds 2 campaigns.", { exact: false })).toBeVisible();
      await desktop.getByRole("button", { name: "Start a new campaign", exact: true }).click();
      await expect(desktop.getByText("You can have two campaigns in your account. Starting a new one replaces one of them, and the replaced campaign is deleted.", { exact: true })).toBeVisible();
      await desktop.getByRole("button", { name: "Cancel starting a new campaign", exact: true }).click();
      const original = await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      f.server.setAccess("qa-account-a", { enabled: false });
      await desktop.evaluate(() => window.dispatchEvent(new Event("focus")));
      await expect(desktop.getByText("Account saving is currently unavailable.", { exact: false })).toBeVisible();
      expect(await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
    } finally { await f.close(); }
  });
  test("one over-slots choice retains originals, then named double confirmation replaces only the chosen campaign", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop", "qa-account-a", undefined, 3);
      await expect(desktop.getByRole("heading", { name: "Your account holds two campaigns. Choose which to keep in your account.", exact: true })).toBeVisible();
      const original = await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      expect(f.server.operationCount("qa-account-a")).toBe(0);
      await desktop.getByRole("checkbox", { name: "Keep Synthetic clinic 1 in my account", exact: true }).check();
      await desktop.getByRole("checkbox", { name: "Keep Synthetic clinic 3 in my account", exact: true }).check();
      await expect(desktop.getByRole("checkbox", { name: "Keep Synthetic clinic 2 in my account", exact: true })).toBeDisabled();
      await desktop.getByRole("button", { name: "Keep selected campaigns", exact: true }).click();
      await expect(desktop.getByRole("button", { name: "Resume Synthetic clinic 3", exact: true })).toBeEnabled();
      const kept = [...f.server.account("qa-account-a").campaigns].find(([, row]) => row.summary?.name === "Synthetic clinic 3")![0];
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
      await desktop.getByRole("button", { name: "Start a new campaign", exact: true }).click();
      await desktop.getByRole("button", { name: "Replace Synthetic clinic 1", exact: true }).click();
      await expect(desktop.getByRole("heading", { name: "Delete Synthetic clinic 1 permanently?", exact: true })).toBeVisible();
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
      await desktop.getByRole("button", { name: "Keep Synthetic clinic 1", exact: true }).click();
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
      await desktop.getByRole("button", { name: "Start a new campaign", exact: true }).click();
      await desktop.getByRole("button", { name: "Replace Synthetic clinic 1", exact: true }).click();
      await desktop.getByRole("button", { name: "Delete Synthetic clinic 1 permanently", exact: true }).click();
      await expect(desktop.getByRole("heading", { name: "Open Your Clinic", exact: true })).toBeVisible();
      expect([...f.server.account("qa-account-a").campaigns.keys()]).toEqual([kept]);
      await createAccountCampaign(desktop, "New account campaign", true);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
      expect(await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      await desktop.reload();
      // createAccountCampaign explicitly chose the campaign screen. Preserve
      // that navigation choice across reload; normal close/reload reopens play.
      await expect(desktop.getByRole("heading", { name: "Your campaigns", exact: true })).toBeVisible();
      await expect(desktop.getByRole("button", { name: "Resume New account campaign", exact: true })).toBeEnabled();
      await expect(desktop.getByRole("checkbox", { name: /Keep Synthetic clinic/ })).toHaveCount(0);
      await expect(desktop.getByRole("button", { name: "Resume Synthetic clinic 1", exact: true })).toHaveCount(0);
      const phone = await f.page("phone");
      await expect(phone.getByRole("button", { name: "Resume Synthetic clinic 3", exact: true })).toBeEnabled();
      await expect(phone.getByRole("button", { name: "Resume New account campaign", exact: true })).toBeEnabled();
      expect(await phone.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBeNull();
    } finally { await f.close(); }
  });
});
