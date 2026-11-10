import { expect, type Page } from "@playwright/test";
import type { GameState } from "@gamify-surgery/game-domain";
import { installRememberedLocalAccess } from "./helpers";

/** Disposable public Level 4/5 journey fixture; no private save or codec import. */
export async function openDensityFixture(page: Page, phone: boolean, keepChart = false) {
  await installRememberedLocalAccess(page);
  await page.addInitScript(layout => localStorage.setItem("gamify-surgery.presentation-layout.v1", layout), phone ? "phone" : "desktop");
  await page.goto(`/level4-rooms-qa.html?level5=integration-l4&layout=${phone ? "phone" : "desktop"}`);
  // This ordinary local fixture may present the campaign chooser. Seeding an
  // active ID does not promise automatic entry; use its real Resume action.
  const shell = page.locator(phone ? ".mobile-shell" : ".game-shell");
  const resume = page.getByRole("button", { name: "Resume Level 5 M9 integration (integration-l4)", exact: true });
  await expect.poll(async () => await shell.isVisible() || await resume.isVisible(), { timeout: 30_000 }).toBe(true);
  if (await resume.isVisible()) await resume.click();
  await expect(page.locator(phone ? ".mobile-shell" : ".game-shell")).toBeVisible({ timeout: 30_000 });
  // Shell/canvas mount before asynchronous campaign recovery finishes. Match
  // the fresh-campaign helper's entry barrier before observing or clicking UI.
  await expect(page.getByRole("region", { name: "Loading clinic", exact: true })).toBeHidden({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => document.fonts.status), { timeout: 20_000 }).toBe("loaded");
  if (!keepChart) {
    const chart = page.locator(phone ? '.mobile-sheet[aria-label="Patient chart"]' : ".chart-sheet");
    if (await chart.isVisible()) {
      if (phone) await chart.getByRole("button", { name: "Close Patient chart", exact: true }).click();
      else await page.keyboard.press("Escape");
      await expect(chart).toHaveCount(0);
    }
    await expect(page.getByTestId("facility-canvas")).toBeVisible({ timeout: 30_000 });
  }
}

/** Observe the same durable snapshot+journal recovery as an ordinary reopen.
 * Run these imports in the browser, never in Playwright's Node loader (the
 * journal uses the codec worker). Reading the legacy localStorage base alone
 * misses up to five minutes of committed actions under the current save policy. */
export async function readDurableLocalState(page: Page): Promise<GameState> {
  return page.evaluate(async () => {
    const storagePath = "/src/session/prototypeStorage.ts", journalPath = "/src/session/localProfileJournal.ts";
    const storage = await import(/* @vite-ignore */ storagePath);
    const journal = await import(/* @vite-ignore */ journalPath);
    const profile = await journal.recoverLocalProfile(storage.loadPrototypeProfile().profile, null);
    const active = profile.campaigns.find((campaign: { campaignId: string }) => campaign.campaignId === profile.activeCampaignId);
    if (!active) throw new Error("The durable active fixture campaign is missing.");
    return active.state;
  });
}

export async function showClinicPanels(page: Page) {
  const reveal = page.getByRole("button", { name: "Show clinic panels", exact: true });
  if (await reveal.isVisible()) await reveal.click();
  await expect(page.locator(".patient-rail-column")).toBeVisible();
  await expect(page.locator(".operations-column")).toBeVisible();
}

/** Count fully visible rows against every clipping ancestor, not only the page. */
export async function measureRows(page: Page, scrollSelector: string, rowSelector: string) {
  return page.locator(scrollSelector).evaluate((root, selector) => {
    const clip = (node: Element) => {
      let left = 0, top = 0, right = innerWidth, bottom = innerHeight;
      for (let current: Element | null = node.parentElement; current; current = current.parentElement) {
        const style = getComputedStyle(current), rect = current.getBoundingClientRect();
        if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) { left = Math.max(left, rect.left); right = Math.min(right, rect.right); }
        if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) { top = Math.max(top, rect.top); bottom = Math.min(bottom, rect.bottom); }
      }
      return { left, top, right, bottom };
    };
    const rows = [...root.querySelectorAll<HTMLElement>(selector)].map(row => {
      const box = row.getBoundingClientRect(), bounds = clip(row), style = getComputedStyle(row);
      const visible = box.width > 0 && box.height > 0 && style.visibility !== "hidden";
      return { label: row.getAttribute("aria-label") ?? row.textContent?.trim(), height: box.height,
        font: Number.parseFloat(style.fontSize),
        complete: visible && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1 && box.left >= bounds.left - 1 && box.right <= bounds.right + 1,
        partial: visible && box.bottom > bounds.top && box.top < bounds.bottom && box.right > bounds.left && box.left < bounds.right };
    });
    return { viewport: { width: innerWidth, height: innerHeight }, clientHeight: root.clientHeight, scrollHeight: root.scrollHeight,
      completeRows: rows.filter(row => row.complete).length, partialRows: rows.filter(row => row.partial).length,
      rows: rows.filter(row => row.partial), totalRows: rows.length };
  }, rowSelector);
}

export async function expectPhoneTargets(page: Page) {
  const buttons = await page.locator(".mobile-top-bar button, .mobile-tab-bar button, .mobile-sheet button, .mobile-sheet summary, .mobile-build-controls button").evaluateAll(nodes =>
    nodes.map(node => ({ box: node.getBoundingClientRect(), visible: getComputedStyle(node).visibility !== "hidden" }))
      .filter(({ box, visible }) => visible && box.width > 0 && box.height > 0)
      .map(({ box }) => ({ width: box.width, height: box.height })));
  expect(buttons.length).toBeGreaterThan(0);
  expect(buttons.every(box => box.height >= 40 && box.width >= 40)).toBe(true);
  const primary = await page.locator(".mobile-top-bar button, .mobile-tab-bar button, .mobile-build-choice, .mobile-primary, .mobile-build-confirm button").evaluateAll(nodes =>
    nodes.map(node => node.getBoundingClientRect()).filter(box => box.width > 0 && box.height > 0).map(box => box.height));
  expect(primary.every(height => height >= 44)).toBe(true);
}
