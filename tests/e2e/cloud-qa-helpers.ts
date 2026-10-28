import { expect, type Page } from "@playwright/test";

export const snapshot = (page: Page) => page.evaluate(() => window.__cloudQa?.snapshot() ?? {
  state: null, revision: null, phase: "connecting", pending: false, canExecute: false, failure: null,
});
export const status = (page: Page) => page.evaluate(() => window.__cloudQa?.status() ?? {
  hasState: false, revision: null, phase: "connecting", pending: false, canExecute: false, localDurable: false,
  needsReload: false, failure: null, accountPhase: "connecting", entryHeading: null,
});

// Cold module/worker startup and the 15-second ordinary checkpoint can exceed
// Playwright's default five-second expectation. Poll real authority and save
// state separately; a pending background upload does not mean play is blocked.
export const CLOUD_QA_WAIT_MS = 20_000;
// Disposable Vite entries load unbundled workspace modules in each new browser
// context. Allow the bounded 60 s development worker startup + 30 s task budget.
// Once prepared, authority/save/choice assertions retain their shorter budget.
export const CLOUD_QA_STARTUP_WAIT_MS = 100_000;

export async function expectPlaying(page: Page) {
  await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ canExecute: true, failure: null, needsReload: false });
  await expect(page.getByRole("heading", { name: "Continue on this device?", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Account save status:/ })).toHaveCount(0);
}

export async function expectAccountSaved(page: Page) {
  await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ canExecute: true, pending: false, localDurable: true, failure: null, needsReload: false });
}

export async function expectResumeReady(page: Page, name: string) {
  const resume = page.getByRole("button", { name: `Resume ${name}`, exact: true });
  await expect.poll(async () => ({ ...await status(page), resumeEnabled: await resume.isEnabled({ timeout: 1_000 }).catch(() => false) }),
    { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toMatchObject({ resumeEnabled: true });
}

/** Routine opens never click a takeover or recovery choice. A second tab in
 * the same persistent context may already have reopened automatically. */
export async function openAndContinue(page: Page, name = "Synthetic clinic 1") {
  const resume = page.getByRole("button", { name: `Resume ${name}`, exact: true });
  await expect(async () => {
    if ((await status(page)).hasState) return;
    await expect(resume).toBeEnabled({ timeout: 1_000 });
    // Automatic reopen may detach Resume between this check and the click.
    // Recheck the active projection on the next pass instead of waiting on a
    // button which has legitimately disappeared for the rest of the test.
    await resume.click({ timeout: 1_000 });
    expect((await status(page)).hasState).toBe(true);
  }).toPass({ timeout: CLOUD_QA_STARTUP_WAIT_MS });
  await expectPlaying(page);
  // Fixtures inject failures after opening. Establish a confirmed baseline so
  // a remaining ordinary metadata checkpoint cannot consume that injected fault.
  await expectAccountSaved(page);
}

export async function accountMenu(page: Page) {
  const details = page.locator("details.cloud-account");
  const more = page.getByRole("button", { name: "More clinic options", exact: true });
  if (!await details.isVisible() && await more.isVisible()) await more.click();
  await expect(details).toBeVisible();
  if (await details.getAttribute("open") === null) await details.locator("summary").click();
  return details;
}

export async function campaignScreen(page: Page) {
  const dismiss = page.getByRole("dialog").getByRole("button", { name: "Not now", exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
  await (await accountMenu(page)).getByRole("button", { name: "Account campaign screen", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your campaigns", exact: true })).toBeVisible();
}

export async function saveDetails(page: Page) {
  const dialog = page.getByRole("dialog", { name: /Account save|Continue on this device\?/ });
  await expect(async () => {
    if (!await dialog.isVisible()) await page.getByRole("button", { name: /Account save status:/ }).click({ timeout: 1_000 });
    await expect(dialog).toBeVisible();
  }).toPass({ timeout: 5_000 });
  return dialog;
}
