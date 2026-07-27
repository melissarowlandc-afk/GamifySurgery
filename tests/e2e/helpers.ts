import { expect, type Locator, type Page } from "@playwright/test";

export const PROFILE_KEY = "gamify-surgery.prototype.profile.v1";
export const ACCESS_KEY = "gamify-surgery.prototype.access.v1";

export interface PersistedCampaign {
  campaignId: string;
  name: string;
  status: "resumable" | "archived";
  serializedState: string;
}

export interface PersistedProfile {
  activeCampaignId: string | null;
  campaigns: PersistedCampaign[];
}

export interface PersistedGameState {
  campaignId: string;
  campaignSeed: string;
  cash: number;
  clinicalXp: number;
  facilityLevel: number;
  founder: {
    displayName: string;
    headId: string;
    bodyId: string;
    appearance: unknown;
  };
  rooms: unknown[];
  doors: unknown[];
  reviewIntents: unknown[];
  learningHistories: Record<string, { reviews: unknown[] }>;
}

export async function installRememberedLocalAccess(
  page: Page,
): Promise<void> {
  await page.addInitScript((storageKey) => {
    const now = Date.now();
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        mode: "local_prototype",
        issuedAtRealMs: now,
        expiresAtRealMs: now + 60 * 60 * 1_000,
      }),
    );
  }, ACCESS_KEY);
}

export async function openCampaignScreen(page: Page): Promise<void> {
  await installRememberedLocalAccess(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toBeVisible();
}

export async function completeClinicOpening(
  page: Page,
  founderName = "Test Founder",
  clinicName = "Test Surgical Clinic",
): Promise<void> {
  await expect(
    page.getByRole("heading", { name: "Create Your Founder" }),
  ).toBeVisible();
  await page.getByLabel("Founder name").fill(founderName);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Your rich grandpa died.")).toBeVisible();
  await expect(page.getByText("He left you $1,000,000.")).toBeVisible();
  await page
    .getByRole("button", { name: "Build a Surgery Clinic" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Name Your Clinic" }),
  ).toBeVisible();
  await page.getByLabel("Clinic name").fill(clinicName);
  await page.getByRole("button", { name: "Open the Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

export async function startClinic(
  page: Page,
  founderName = "Test Founder",
  clinicName = "Test Surgical Clinic",
): Promise<void> {
  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await completeClinicOpening(page, founderName, clinicName);
}

export async function setFastFacilitySpeed(page: Page): Promise<void> {
  const speedButton = page.getByRole("button", {
    name: "Set facility speed to 4x",
  });
  await expect(speedButton).toBeVisible();
  await speedButton.click();
  await expect(speedButton).toHaveAttribute("aria-pressed", "true");
}

export async function waitForFirstPatientReady(
  page: Page,
): Promise<Locator> {
  const patient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .filter({ hasText: "Pixel Patient" });
  await expect(patient).toBeVisible({ timeout: 15_000 });
  await expect(
    patient.getByText("Waiting", { exact: true }),
  ).toBeVisible({ timeout: 15_000 });
  return patient;
}

export async function waitForDecisionChoices(
  page: Page,
): Promise<Locator> {
  const choices = page.locator(
    ".chart-step-column.is-current .answer-choice",
  );
  await expect(choices.first()).toBeVisible({ timeout: 15_000 });
  return choices;
}

export async function getProfile(page: Page): Promise<PersistedProfile> {
  return page.evaluate((profileKey) => {
    const raw = window.localStorage.getItem(profileKey);
    if (!raw) {
      throw new Error("Local campaign profile is missing.");
    }
    return JSON.parse(raw) as PersistedProfile;
  }, PROFILE_KEY);
}

export async function getActiveState(
  page: Page,
): Promise<PersistedGameState> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!active) {
    throw new Error("Active campaign record is missing.");
  }
  return JSON.parse(active.serializedState) as PersistedGameState;
}

export async function installDeterministicCampaignIds(
  page: Page,
): Promise<void> {
  await page.addInitScript(() => {
    const counterKey = "__gamify_surgery_e2e_uuid_counter";
    Object.defineProperty(window.crypto, "randomUUID", {
      configurable: true,
      value: () => {
        const next = Number(window.localStorage.getItem(counterKey) ?? "2");
        window.localStorage.setItem(counterKey, String(next + 1));
        return `00000000-0000-4000-8000-${String(next).padStart(12, "0")}`;
      },
    });
  });
}

export function moneyValue(page: Page): Locator {
  return page.locator(".resource-money-value");
}

export async function readMoney(page: Page): Promise<number> {
  const label = await moneyValue(page).innerText();
  const match = /^\$([\d,]+)/.exec(label.trim());
  if (!match) {
    throw new Error(`Could not read money from "${label}".`);
  }
  return Number(match[1].replaceAll(",", ""));
}

export function xpValue(page: Page): Locator {
  return page.locator(".resource-xp-row > strong");
}

export function messageTitle(page: Page, title: string): Locator {
  return page
    .locator(".event-message-board .message-board-item")
    .filter({ hasText: title });
}
