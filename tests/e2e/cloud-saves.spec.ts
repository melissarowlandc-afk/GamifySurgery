import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudTransport } from "../../apps/player/src/session/cloud/transport";

// These contexts authenticate independently to one disposable in-process fake.
// No Supabase credentials, real Auth, copied localStorage or copied latest saves.
async function rig(browser: Browser, baseURL: string) {
  const server = new FakeCloudServer(), contexts: BrowserContext[] = [], authenticated = new Map<Page, string | null>();
  const transports = new Map<string, CloudTransport>();
  const page = async (layout: "desktop" | "phone", accountId = "qa-account-a", sameContext?: BrowserContext) => {
    const context = sameContext ?? await browser.newContext({ viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: layout === "phone", hasTouch: layout === "phone" });
    if (!sameContext) contexts.push(context);
    const tab = await context.newPage();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => {
      if (account !== null && !["qa-account-a", "qa-account-b"].includes(account)) throw new Error("Unknown synthetic account");
      authenticated.set(page, account);
    });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
      if (authenticated.get(page) !== account) return { error: { code: "auth" } };
      let transport = transports.get(account);
      if (!transport) { transport = server.transport(account); transports.set(account, transport); }
      try {
        const action = transport[method]; if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
        const value = await (action as (...args: unknown[]) => Promise<unknown>)(...args); return { value };
      } catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
    });
    await tab.goto(`${baseURL.replace(/\/$/, "")}/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=${accountId}`);
    await expect(tab.getByRole("heading", { name: "Clinic campaigns", exact: true })).toBeVisible();
    return tab;
  };
  return { server, page, close: async () => { await Promise.all(contexts.map(context => context.close())); } };
}
const snapshot = (page: Page) => page.evaluate(() => window.__cloudQa!.snapshot());
async function createAndCopy(page: Page, name = "Synthetic clinic 1") {
  await page.getByRole("button", { name: "Create synthetic device campaign" }).click();
  const raw = await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
  await page.getByRole("checkbox", { name: `Copy ${name} to my account`, exact: true }).check();
  await page.getByRole("button", { name: "Copy selected local campaigns to my account", exact: true }).click();
  await expect(page.getByText("Copied and verified in your account. The original bytes remain on this device.", { exact: true }).last()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(raw);
}
async function openAndContinue(page: Page, name = "Synthetic clinic 1") {
  await page.getByRole("button", { name: `Open ${name}`, exact: true }).click();
  await expect(page.getByRole("heading", { name: "Continue on this device?", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue on this device", exact: true }).click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe("ready");
}
async function closeSaved(page: Page) {
  await page.getByRole("button", { name: "Save & Close", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Safe to close this tab", exact: true })).toBeVisible();
  expect((await snapshot(page)).pending).toBe(false);
}

test.describe("Beta 2 disposable fake transport across desktop and phone", () => {
  test("opt-in import retains raw bytes, then desktop → phone → desktop preserves the complete saved game", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      f.server.setAccess("qa-account-a", { noticeAccepted: false });
      const desktop = await f.page("desktop");
      await desktop.getByRole("button", { name: "Create synthetic device campaign" }).click();
      expect(f.server.operationCount("qa-account-a")).toBe(0);
      await desktop.getByRole("button", { name: "Accept cloud save notice", exact: true }).click();
      await desktop.getByRole("checkbox", { name: "Copy Synthetic clinic 1 to my account", exact: true }).check();
      const original = await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      await desktop.getByRole("button", { name: "Copy selected local campaigns to my account", exact: true }).click();
      await expect(desktop.getByText("Copied and verified in your account. The original bytes remain on this device.", { exact: true })).toBeVisible();
      expect(await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      await openAndContinue(desktop);
      await desktop.getByRole("button", { name: "Set facility speed to 2x", exact: true }).click();
      await closeSaved(desktop); const desktopSaved = (await snapshot(desktop)).state!;
      const phone = await f.page("phone");
      expect(await phone.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBeNull();
      await openAndContinue(phone); expect((await snapshot(phone)).state).toEqual(desktopSaved);
      await phone.getByRole("button", { name: "Facility speed 2x. Cycle speed", exact: true }).click();
      await closeSaved(phone); const phoneSaved = (await snapshot(phone)).state!;
      await desktop.evaluate(async () => { await window.__cloudQa!.focus(); });
      await expect(desktop.getByText("A newer account save is available.", { exact: false })).toBeVisible();
      await desktop.getByRole("button", { name: "Use account save", exact: true }).click();
      await desktop.getByRole("button", { name: "Continue on this device", exact: true }).click();
      await expect.poll(async () => (await snapshot(desktop)).state?.simulationSpeed).toBe(4);
      expect((await snapshot(desktop)).state).toEqual(phoneSaved);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
  test("opening is read-only, takeover fences a visible old writer and cannot release the phone session", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop"); await createAndCopy(desktop); await openAndContinue(desktop);
      const campaignId = (await snapshot(desktop)).state!.campaignId;
      await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); await window.__cloudQa!.checkpoint(); });
      await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }); });
      const phone = await f.page("phone");
      const before = f.server.account("qa-account-a").campaigns.get(campaignId)!.generation;
      await phone.getByRole("button", { name: "Open Synthetic clinic 1", exact: true }).click();
      await expect(phone.getByRole("heading", { name: "Continue on this device?" })).toBeVisible();
      expect(f.server.account("qa-account-a").campaigns.get(campaignId)!.generation).toBe(before);
      await phone.getByRole("button", { name: "Continue on this device", exact: true }).click();
      const generation = f.server.account("qa-account-a").campaigns.get(campaignId)!.generation;
      expect(generation).toBeGreaterThan(before);
      await desktop.evaluate(async () => { await window.__cloudQa!.focus(); });
      await expect(desktop.getByText("You continued on another device. Recent changes here have not replaced your account save.", { exact: true })).toBeVisible();
      const tick = (await snapshot(desktop)).state!.facilityTick;
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      await desktop.getByRole("button", { name: "Not now", exact: true }).click();
      await desktop.getByRole("button", { name: "Save & Close", exact: true }).click();
      await expect(desktop.getByText("Account save and session close are not confirmed.", { exact: false })).toBeVisible();
      expect(f.server.account("qa-account-a").campaigns.get(campaignId)!.generation).toBe(generation);
      expect((await snapshot(desktop)).state!.facilityTick).toBe(tick);
      expect((await snapshot(phone)).state!.simulationSpeed).toBe(2);
      await closeSaved(phone);
    } finally { await f.close(); }
  });
  test("lost acknowledgement uses one immutable operation; offline progress pauses and recovers without replay", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop"); await createAndCopy(desktop); await openAndContinue(desktop);
      f.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
      expect(await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      const accepted = f.server.operationCount("qa-account-a");
      await desktop.getByRole("button", { name: /Account save status:/ }).click();
      await desktop.getByRole("button", { name: "Retry account save", exact: true }).click();
      expect(f.server.operationCount("qa-account-a")).toBe(accepted);
      expect(f.server.calls.filter(call => call.method === "commit")).toHaveLength(1);
      await desktop.getByRole("button", { name: /Account save status:/ }).click();
      await desktop.getByRole("button", { name: "Resume checked campaign", exact: true }).click();
      await desktop.context().setOffline(true);
      expect(await desktop.evaluate(async () => { await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }); return window.__cloudQa!.checkpoint(); })).toBe(false);
      await desktop.evaluate(async () => { await window.__cloudQa!.focus(); });
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      await desktop.context().setOffline(false);
      await desktop.getByRole("button", { name: /Account save status:/ }).click();
      await desktop.getByRole("button", { name: "Retry account save", exact: true }).click();
      await expect.poll(async () => (await snapshot(desktop)).pending).toBe(false);
      expect((await snapshot(desktop)).state!.simulationSpeed).toBe(4);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
  test("same-profile second tab is fenced; full deletion blocks the other context while account B survives", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop"); await createAndCopy(desktop); await openAndContinue(desktop);
      const tab = await f.page("phone", "qa-account-a", desktop.context()); await openAndContinue(tab);
      await desktop.evaluate(async () => { await window.__cloudQa!.focus(); });
      expect((await snapshot(desktop)).phase).toBe("conflict");
      const other = await f.page("desktop", "qa-account-b");
      await expect(other.getByRole("heading", { name: "Account campaigns (0/2)" })).toBeVisible();
      await createAndCopy(other);
      await tab.getByRole("button", { name: "More clinic options", exact: true }).click();
      await tab.getByText("Account & privacy", { exact: true }).click();
      await tab.getByRole("button", { name: "Delete my data/account", exact: true }).click();
      await tab.getByRole("button", { name: "Confirm delete all my account data", exact: true }).click();
      await expect(tab.getByText("Account data deletion is confirmed. Play and uploads have stopped.", { exact: true })).toBeVisible();
      await desktop.evaluate(async () => { await window.__cloudQa!.focus(); });
      expect(await desktop.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(0);
      expect(f.server.account("qa-account-b").access.admitted).toBe(true);
      expect(f.server.account("qa-account-b").campaigns.size).toBe(1);
    } finally { await f.close(); }
  });
  test("two cloud slots include archives; disabled service preserves all device originals", async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!);
    try {
      const desktop = await f.page("desktop"); await createAndCopy(desktop); await openAndContinue(desktop);
      await desktop.getByRole("button", { name: "Restart Campaign", exact: true }).click();
      await desktop.getByRole("button", { name: "Archive and restart", exact: true }).click();
      await expect(desktop.getByRole("heading", { name: "Clinic campaigns", exact: true })).toBeVisible();
      await expect(desktop.getByText("Account · Archived — still uses a slot", { exact: true })).toBeVisible();
      await createAndCopy(desktop, "Synthetic clinic 2");
      await expect(desktop.getByRole("button", { name: "Create account campaign", exact: true })).toBeDisabled();
      await expect(desktop.getByText("Both cloud slots are in use.", { exact: false })).toBeVisible();
      const original = await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      f.server.setAccess("qa-account-a", { enabled: false });
      await desktop.getByRole("button", { name: "Refresh account campaigns", exact: true }).click();
      await expect(desktop.getByText("Cloud saving is currently disabled.", { exact: false })).toBeVisible();
      expect(await desktop.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
    } finally { await f.close(); }
  });
});
