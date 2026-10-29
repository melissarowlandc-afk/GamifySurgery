import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudFailureCode, type CloudFrozenOperation, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "../../apps/player/src/session/cloud/codecEvidence";
import { syncFixture } from "../../apps/player/src/session/cloud/syncFixtureSupport";
import { accountMenu, expectAccountSaved, expectPlaying, expectResumeReady, openAndContinue, saveDetails as details, snapshot, exportDeviceCopy, CLOUD_QA_WAIT_MS, CLOUD_QA_STARTUP_WAIT_MS } from "./cloud-qa-helpers";

// Manager runs this against the dev-only cloud-saves-qa.html at the disposable
// 127.0.0.1:5184 origin. No Supabase, Auth keys, copied saves or live endpoints.
test.setTimeout(180_000); // Independent cold Vite contexts; checks still use bounded state polling.
async function rig(browser: Browser, baseURL: string, layout: "desktop" | "phone") {
  const server = new FakeCloudServer(), contexts: BrowserContext[] = [];
  const authenticated = new Map<Page, string | null>(), transport = server.transport("qa-account-a");
  const commitAttempts: CloudFrozenOperation[] = [];
  let unavailable: CloudFailureCode | null = null;
  const unavailablePages = new Map<Page, CloudFailureCode>();
  const page = async (deviceCampaigns = 0) => {
    const context = await browser.newContext({ viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: layout === "phone", hasTouch: layout === "phone", acceptDownloads: true });
    contexts.push(context); const tab = await context.newPage();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => { authenticated.set(page, account); });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
      if (account !== "qa-account-a" || authenticated.get(page) !== account) return { error: { code: "auth" } };
      if (method === "commit") commitAttempts.push(structuredClone(args[0] as CloudFrozenOperation));
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
  return { server, page, commitAttempts, fail: (code: CloudFailureCode | null) => { unavailable = code; },
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
      // Standalone focus/pageshow/visible/resume bursts must not turn local
      // progress into an early account checkpoint or reopen the current owner.
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }))).toBe(true);
      const beforeFocus = (await snapshot(page)).state!, operations = f.server.operationCount("qa-account-a");
      expect(await page.evaluate(async () => {
        const qa = window.__cloudQa!;
        for (let i = 0; i < 20; i++) {
          window.dispatchEvent(new Event("focus")); window.dispatchEvent(new Event("pageshow"));
          document.dispatchEvent(new Event("visibilitychange")); document.dispatchEvent(new Event("resume"));
        }
        return qa.foreground(); // await the event work, never a fixed sleep
      })).toBe(true);
      await expectPlaying(page);
      expect((await snapshot(page)).state).toEqual(beforeFocus);
      expect((await snapshot(page)).pending).toBe(true);
      expect(f.server.operationCount("qa-account-a")).toBe(operations);
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
      // Also exercise an ordinary reload while this document still owns a live
      // lease. No synthetic visibility event, network fault or Save & Close.
      const generation = f.server.account("qa-account-a").campaigns.get(id)!.generation;
      const ordinary = await page.evaluate(async () => {
        const qa = window.__cloudQa!;
        await qa.command({ type: "SET_PAUSED", paused: false });
        for (let index = 0; index < 3; index++) await qa.command({ type: "ADVANCE_TICK", advancedAtRealMs: Date.now() });
        await qa.command({ type: "SET_PAUSED", paused: true });
        return qa.snapshot().state!;
      });
      expect(ordinary.facilityTick).toBeGreaterThan(pending.facilityTick);
      await page.reload(); await expectPlaying(page); await expectAccountSaved(page);
      expect((await snapshot(page)).state).toEqual(ordinary);
      expect(f.server.account("qa-account-a").campaigns.get(id)!.generation).toBeGreaterThan(generation);
      expect(f.server.account("qa-account-a").campaigns.size).toBe(1);
      expect(f.server.operationCount("qa-account-a")).toBe(3);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
      expect(await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
    } finally { await f.close(); }
  });

  for (const localNewer of [true, false]) for (const freeSlot of [true, false]) {
    test(`${layout}: automatic divergence resolution (${localNewer ? "local" : "account"} newer, ${freeSlot ? "free" : "full"} slots) preserves both copies`, async ({ browser, baseURL }) => {
      const f = await rig(browser, baseURL!, layout);
      const advance = async (page: Page, speed: 2 | 4, ticks: number) => page.evaluate(async ({ speed, ticks }) => {
        const before = window.__cloudQa!.snapshot().state!.facilityTick;
        const state = await window.__cloudQa!.commands([
          { type: "SET_SIMULATION_SPEED", speed }, { type: "SET_PAUSED", paused: false },
          ...Array.from({ length: ticks }, (_, index) => ({ type: "ADVANCE_TICK" as const, advancedAtRealMs: index })),
          { type: "SET_PAUSED", paused: true },
        ]);
        if (!state || !state.paused || state.facilityTick !== before + ticks) throw new Error("Divergence fixture must finish with every command accepted and the saved clock paused.");
        return state;
      }, { speed, ticks });
      try {
        const device = await f.page(1); await importAndOpen(device);
        const id = (await snapshot(device)).state!.campaignId;
        f.failPage(device, "network");
        const local = await advance(device, 2, localNewer ? 3 : 1);
        const remote = await f.page(); await openAndContinue(remote);
        const remoteState = await advance(remote, 4, localNewer ? 1 : 3);
        expect(await remote.evaluate(() => window.__cloudQa!.checkpoint())).toBe(true);
        const account = structuredClone(f.server.account("qa-account-a").campaigns.get(id)!);
        let unrelated: Awaited<ReturnType<typeof syncFixture>> | null = null;
        if (!freeSlot) {
          unrelated = await syncFixture("qa.archived-slot");
          const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: unrelated.prepared.checkpoint,
            campaign: { ...unrelated.prepared.envelope.campaign, name: "Archived slot", status: "archived" },
            source: unrelated.prepared.sourceRecovery, expectedRevision: "1", operationId: "archive.fixture" });
          unrelated.confirmed = { ...unrelated.confirmed, snapshot: encoded.snapshot };
          f.server.seed("qa-account-a", unrelated.confirmed);
        }
        f.failPage(device, null); await device.evaluate(() => window.__cloudQa!.focus());
        await expectPlaying(device); await expectAccountSaved(device);
        await expect(device.getByRole("dialog")).toHaveCount(0);
        const winner = localNewer ? local : remoteState, loser = localNewer ? remoteState : local;
        const active = (await snapshot(device)).state!;
        expect(winner.paused).toBe(true); expect(active.paused).toBe(true);
        expect(active).toEqual({ ...winner, campaignId: active.campaignId });
        expect(active.facilityTick).toBeGreaterThan(loser.facilityTick);
        if (localNewer) expect(active.campaignId).not.toBe(id); else expect(active.campaignId).toBe(id);
        const activeCopy = f.server.account("qa-account-a").campaigns.get(active.campaignId)!.confirmed;
        const verified = await loadCloudEvidenceCheckpoint({ ...activeCopy, expectedRevision: activeCopy.revision,
          expectedCampaignId: active.campaignId, expectedBaselineId: activeCopy.baselineId });
        expect(verified.campaign.name).toBe("Synthetic clinic 1"); expect(verified.campaign.status).toBe("resumable");
        const protectedCopies = await device.evaluate(() => window.__cloudQa!.retainedCopies());
        const loadedCopies = await Promise.all(protectedCopies.map(async row => {
          const copy = row.value.copy;
          return loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision, expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
        }));
        expect(loadedCopies.some(row => row.state.facilityTick === loser.facilityTick && row.state.simulationSpeed === loser.simulationSpeed)).toBe(true);
        if (freeSlot) {
          const archived = (await f.server.transport("qa-account-a").list()).find(row => row.status === "archived")!;
          expect(archived.name).toBe("Synthetic clinic 1 (older copy)");
          const copy = await f.server.transport("qa-account-a").load(archived.campaignId);
          const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision, expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
          expect(loaded.state).toEqual({ ...loser, campaignId: copy.campaignId });
          if (localNewer) expect(copy.evidence).toEqual(account.confirmed.evidence);
        } else {
          expect(await f.server.transport("qa-account-a").load(unrelated!.confirmed.campaignId)).toEqual(unrelated!.confirmed);
          expect(f.server.account("qa-account-a").campaigns.size).toBe(2);
          expect(f.server.calls.some(row => row.method === "deleteCampaign")).toBe(localNewer);
          await exportDeviceCopy(device);
        }
        if (!localNewer) expect(f.server.account("qa-account-a").campaigns.get(id)!.confirmed).toEqual(account.confirmed);
        // The old projection cannot append/release after automatic takeover.
        await remote.evaluate(() => window.__cloudQa!.checkAuthority());
        expect(await remote.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
        expect(await remote.evaluate(() => window.__cloudQa!.closeLease())).toBe(false);
        const count = f.server.operationCount("qa-account-a");
        await device.reload(); await expectPlaying(device); await expectAccountSaved(device);
        expect((await snapshot(device)).state).toEqual(active);
        expect(f.server.operationCount("qa-account-a")).toBe(count);
        expect(f.server.usageCount("qa-account-a")).toBe(0);
      } finally { await f.close(); }
    });
  }
  test(`${layout}: a newer retained device copy wins over the older current cache`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const page = await f.page(1); await importAndOpen(page);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }))).toBe(true);
      const newer = (await snapshot(page)).state!;
      await page.evaluate(() => window.__cloudQa!.retainAndReopenOlderCache());
      await expectPlaying(page); await expectAccountSaved(page);
      expect((await snapshot(page)).state).toEqual(newer);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const account = await accountMenu(page), older = account.locator("details.cloud-older-copies");
      await older.locator("summary").click();
      await expect(older.getByRole("button", { name: "Export older copy", exact: true }).first()).toBeVisible({ timeout: CLOUD_QA_WAIT_MS });
      const count = f.server.operationCount("qa-account-a");
      const [download] = await Promise.all([page.waitForEvent("download", { timeout: CLOUD_QA_WAIT_MS }),
        older.getByRole("button", { name: "Export older copy", exact: true }).first().click()]);
      expect(await download.failure()).toBeNull();
      expect(f.server.operationCount("qa-account-a")).toBe(count);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });

  test(`${layout}: unavailable service preserves pending work, fences unchecked commands and recovers in the background`, async ({ browser, baseURL }) => {
    const f = await rig(browser, baseURL!, layout);
    try {
      const page = await f.page(1); await importAndOpen(page);
      const before = (await snapshot(page)).state!, original = await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"));
      const initial = structuredClone(f.server.account("qa-account-a").campaigns.get(before.campaignId)!.confirmed);
      f.fail("network");
      expect(await page.evaluate(async () => ({ accepted: await window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }),
        saved: await window.__cloudQa!.checkpoint() }))).toEqual({ accepted: true, saved: false });
      const frozen = structuredClone(f.commitAttempts.at(-1)!);
      expect(await page.evaluate(() => navigator.onLine)).toBe(true);
      await page.evaluate(() => window.__cloudQa!.checkAuthority());
      const waiting = await snapshot(page); expect(waiting.pending).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect((await snapshot(page)).state!.facilityTick).toBe(before.facilityTick);
      const dialog = await details(page);
      await expect(dialog.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
      await exportDeviceCopy(page);
      expect(await page.evaluate(() => window.__cloudQa!.closeLease())).toBe(false);
      await expect(page.getByRole("heading", { name: "Safe to close this tab", exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem("gamify-surgery.prototype.profile.v1.account.qa-account-a"))).toBe(original);
      expect(f.server.operationCount("qa-account-a")).toBe(1); // import only
      // The single retry verifies a playable local copy. Restoring the fake
      // backend sends no browser online/focus event: background checks must
      // still select/fence and confirm the account checkpoint without a prompt.
      await dialog.getByRole("button", { name: "Retry", exact: true }).click();
      await expect.poll(() => snapshot(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ canExecute: true, pending: true, failure: "network" });
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }))).toBe(true);
      const newest = (await snapshot(page)).state!; expect(newest.paused).toBe(true);
      f.fail(null);
      await expect.poll(() => snapshot(page), { timeout: 40_000 }).toMatchObject({ canExecute: true, pending: false, failure: null });
      await expectPlaying(page); await expectAccountSaved(page);
      expect((await snapshot(page)).state!.simulationSpeed).toBe(4);
      expect((await snapshot(page)).state).toEqual(newest);
      expect(f.server.operationCount("qa-account-a")).toBe(2); // import + one combined descendant, no redundant ancestor archive
      const account = f.server.account("qa-account-a"), copy = account.campaigns.get(before.campaignId)!.confirmed;
      expect(account.campaigns.size).toBe(1);
      expect([...account.operations.values()].map(row => row.receipt.revision)).toEqual(["1", "2"]);
      const immutable = new Map<string, CloudFrozenOperation>();
      for (const attempt of f.commitAttempts) {
        if (immutable.has(attempt.operationId)) expect(attempt).toEqual(immutable.get(attempt.operationId));
        else immutable.set(attempt.operationId, attempt);
      }
      expect(immutable.get(frozen.operationId)).toEqual(frozen);
      expect(account.operations.has(frozen.operationId)).toBe(false);
      const accepted = [...immutable.values()].filter(operation => account.operations.has(operation.operationId));
      expect(accepted).toHaveLength(1);
      expect(account.operations.get(accepted[0]!.operationId)!.digest).toBe(accepted[0]!.requestSha256);
      expect(copy.evidence.header).toEqual(initial.evidence.header);
      expect(copy.evidence.records.slice(0, initial.evidence.records.length)).toEqual(initial.evidence.records);
      expect(new Set(copy.evidence.records.map(row => row.id)).size).toBe(copy.evidence.records.length);
      const loaded = await loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: "2", expectedCampaignId: before.campaignId, expectedBaselineId: initial.baselineId });
      expect(loaded.state).toEqual(newest);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
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
      await expect(dialog).toContainText("This clinic could not be opened. Your saved copies are safe.");
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
      await expect(dialog).toContainText("Account storage is full. Your progress is safe on this device.");
      expect((await snapshot(page)).phase).toBe("capacity"); expect((await snapshot(page)).pending).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      await exportDeviceCopy(page);
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
      await expect(dialog).toContainText("The latest save could not be verified. Your older copies are safe.");
      expect((await snapshot(second)).revision).toBe(prior.revision);
      expect((await snapshot(second)).state).toEqual(priorState);
      await expect(dialog.getByRole("button", { name: "Continue on this device", exact: true })).toHaveCount(0);
      await expect(dialog.getByRole("button", { name: "Use the account save", exact: true })).toHaveCount(0);
      expect(await second.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(await second.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      await exportDeviceCopy(second);
      // The original device also has a valid cache at the corrupt head's
      // revision. That cache must be protected, rather than masking corruption
      // and returning to entry with a null failure or losing the export path.
      await first.reload();
      await expect.poll(() => snapshot(first), { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toMatchObject({ phase: "readonly", failure: "prior-recovery" });
      const cachedRecovery = await details(first);
      await expect(cachedRecovery).toContainText("The latest save could not be verified. Your older copies are safe.");
      expect(await first.evaluate(() => window.__cloudQa!.status())).toMatchObject({ canExecute: false, phase: "readonly", failure: "prior-recovery" });
      expect((await snapshot(first)).revision).toBe(prior.revision);
      expect((await snapshot(first)).state).toEqual(priorState);
      expect(await first.evaluate(() => window.__cloudQa!.command({ type: "ADVANCE_TICK" }))).toBe(false);
      expect(await first.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      await exportDeviceCopy(first);
      expect(row.confirmed).toEqual(head); expect(row.prior).toEqual(prior); expect(row.generation).toBe(generation);
      expect(f.server.operationCount("qa-account-a")).toBe(operationCount);
      expect(f.server.usageCount("qa-account-a")).toBe(0);
    } finally { await f.close(); }
  });
}
