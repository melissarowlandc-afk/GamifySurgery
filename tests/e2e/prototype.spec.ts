import { mkdirSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";
const PROFILE_KEY = "gamify-surgery.prototype.profile.v1";

interface PersistedCampaign {
  campaignId: string;
  serializedState: string;
}

interface PersistedProfile {
  activeCampaignId: string;
  campaigns: PersistedCampaign[];
}

interface PersistedLearningHistory {
  reviews: unknown[];
}

interface PersistedGameState {
  campaignSeed: string;
  cash: number;
  clinicalXp: number;
  facilityLevel: number;
  reviewIntents: unknown[];
  learningHistories: Record<string, PersistedLearningHistory>;
}

/**
 * Campaign identity is normally random. A deterministic UUID sequence makes
 * the shuffle assertion reproducible while still giving every new campaign a
 * distinct identity and seed.
 */
async function installDeterministicCampaignIds(page: Page): Promise<void> {
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

async function getActiveState(page: Page): Promise<PersistedGameState> {
  return page.evaluate((profileKey) => {
    const rawProfile = window.localStorage.getItem(profileKey);
    if (!rawProfile) {
      throw new Error("Local campaign profile is missing.");
    }
    const profile = JSON.parse(rawProfile) as PersistedProfile;
    const active = profile.campaigns.find(
      (campaign) => campaign.campaignId === profile.activeCampaignId,
    );
    if (!active) {
      throw new Error("Active campaign record is missing.");
    }
    return JSON.parse(active.serializedState) as PersistedGameState;
  }, PROFILE_KEY);
}

async function fastForward(page: Page): Promise<void> {
  const tools = page.locator("details.development-panel");
  await expect(tools).toHaveAttribute("open", "");
  await tools.getByRole("button", { name: /Fast-forward/ }).click();
}

function moneyValue(page: Page): Locator {
  return page.locator(".resource-money-value");
}

async function readMoney(page: Page): Promise<number> {
  const label = await moneyValue(page).innerText();
  const match = /^\$([\d,]+)/.exec(label.trim());
  if (!match) {
    throw new Error(`Could not read money from "${label}".`);
  }
  return Number(match[1].replaceAll(",", ""));
}

function xpValue(page: Page): Locator {
  return page.locator(".resource-xp-row > strong");
}

function messageTitle(page: Page, title: string): Locator {
  return page
    .locator(".event-message-board .message-board-item-heading strong")
    .filter({ hasText: title });
}

/**
 * Phaser calculates its grid directly from the canvas host dimensions. This
 * mirrors that public layout contract so a click targets a meaningful tile.
 */
async function placeRoomAt(
  facility: Locator,
  tileX: number,
  tileY: number,
): Promise<void> {
  const box = await facility.boundingBox();
  if (!box) {
    throw new Error("Facility canvas is not visible.");
  }

  const horizontalPadding = 12;
  const headerHeight = 14;
  const footerHeight = Math.max(
    32,
    Math.min(44, Math.floor(box.height * 0.1)),
  );
  const usableWidth = Math.max(1, box.width - horizontalPadding * 2);
  const usableHeight = Math.max(
    1,
    box.height - headerHeight - footerHeight,
  );
  const tileSize = Math.max(
    10,
    Math.floor(Math.min(usableWidth / 16, usableHeight / 10)),
  );
  const originX = Math.floor((box.width - tileSize * 16) / 2);
  const originY = Math.floor(
    headerHeight + (usableHeight - tileSize * 10) / 2,
  );

  await facility.click({
    position: {
      x: originX + (tileX + 0.5) * tileSize,
      y: originY + (tileY + 0.5) * tileSize,
    },
  });
}

async function resolveCorrectEncounter(page: Page): Promise<void> {
  await expect(
    page.getByRole("button", { name: /Continue to summary/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Resolve chart" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resolve chart" }).click();
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test(
  "plays Level 0 through Level 1, saves, and isolates campaign FSRS",
  async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chrome",
      "The full progression walkthrough runs once at 1440px.",
    );

    await installDeterministicCampaignIds(page);
    await page.goto("/");

    await expect(page.getByTestId("facility-canvas")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Open your first patient chart" }),
    ).toBeVisible();
    await expect(messageTitle(page, "New patient")).toBeVisible();
    await expect(messageTitle(page, "Low cash")).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });

    await page.getByRole("button", { name: "Show me where" }).click();
    const tutorialTarget = page.locator(".patient-tab.is-tutorial-target");
    await expect(tutorialTarget).toContainText("Open this chart first");
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-callout-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
    await tutorialTarget.click();

    const firstDecision = page.locator(
      ".chart-step-column.is-current .answer-choice",
    );
    await expect(firstDecision).toHaveCount(3);
    const firstDecisionLabels = await firstDecision
      .locator("strong")
      .allTextContents();
    expect(firstDecisionLabels.indexOf("SIGNAL ALPHA")).toBe(2);
    const correctSignal = page.getByRole("button", {
      name: /SIGNAL ALPHA.*3 in-game hours/,
    });
    await expect(correctSignal).toBeVisible();
    await correctSignal.click();

    await expect(page.locator(".chart-panel")).toHaveCount(0);
    await expect(messageTitle(page, "Decision recorded")).toBeVisible();
    await expect(messageTitle(page, "Corrective review")).toHaveCount(0);
    const pendingPatient = page
      .locator(".patient-folder.is-active .patient-tab")
      .filter({ hasText: "Pixel Patient" });
    await expect(pendingPatient).toContainText("Analysis pending");
    await expect(
      page.getByRole("button", { name: /Pixel Patient.*Analysis pending/ }),
    ).toBeVisible();

    await fastForward(page);
    await expect(pendingPatient).toContainText("Action required");
    await expect(pendingPatient.getByLabel("Action required")).toBeVisible();
    await expect(messageTitle(page, "Results ready")).toBeVisible();

    await pendingPatient.click();
    await expect(
      page
        .locator(".chart-result-card")
        .getByText("The returned marker reads ACTION CIRCLE."),
    ).toBeVisible();
    await page.getByRole("button", { name: "ACTION CIRCLE" }).click();
    await expect(page.locator(".chart-reward-banner")).toContainText(
      "+10 Learning XP",
    );
    await expect(
      page.getByRole("button", { name: "Flip chart over" }),
    ).toBeVisible();
    await resolveCorrectEncounter(page);

    await fastForward(page);
    const secondTutorial = page
      .locator(".patient-folder.is-waiting .patient-tab")
      .filter({ hasText: "Morgan Thread" });
    await expect(secondTutorial).toBeVisible();
    await secondTutorial.click();
    await page
      .getByRole("button", {
        name: /Assess wound type and vaccine history/,
      })
      .click();
    await expect(page.locator(".chart-reward-banner")).toContainText(
      "+5 Learning XP",
    );
    await resolveCorrectEncounter(page);

    await page.getByRole("button", { name: "Build Mode" }).click();
    await expect(
      page.getByRole("button", { name: "Resume" }),
    ).toBeVisible();
    await expect(page.locator(".build-mode-panel")).toContainText(
      "Facility paused",
    );
    await page
      .locator(".build-mode-panel")
      .getByRole("button", { name: /^Examination Room/ })
      .click();
    await placeRoomAt(page.getByTestId("facility-canvas"), 7, 2);
    await expect(page.locator(".build-mode-panel")).toContainText(
      "1 built",
    );
    await page.getByRole("button", { name: "Exit Build Mode" }).click();
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
    const recentEvents = page.locator("details.message-board-history");
    await recentEvents.locator("summary").click();
    await expect(recentEvents).toContainText("Construction complete");

    await expect(
      page.getByRole("button", { name: "Advance to Level 1" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Advance to Level 1" }).click();
    await expect(
      page.getByText("Level 1", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Receptionist" }),
    ).toBeVisible();

    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/level-1-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });

    await page.getByRole("button", { name: "Save & Close" }).click();
    await expect(
      page.getByRole("heading", { name: "Safe to close this tab" }),
    ).toBeFocused();
    await page
      .getByRole("button", { name: "Return to paused clinic" })
      .click();
    await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
    const originalState = await getActiveState(page);
    expect(originalState.facilityLevel).toBe(1);
    expect(originalState.reviewIntents).toHaveLength(3);

    await page.reload();
    await expect(
      page.getByText("Level 1", { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();

    const resolvedCabinet = page.getByRole("button", {
      name: /Resolved 2 filed charts/,
    });
    await resolvedCabinet.click();
    const resolvedNames = await page
      .locator(".is-resolved-stack .patient-tab-name")
      .allTextContents();
    expect(resolvedNames.map((name) => name.replace("!", "").trim())).toEqual([
      "Morgan Thread",
      "Pixel Patient",
    ]);

    await page.getByRole("button", { name: /Campaigns \(1\)/ }).click();
    await page
      .getByRole("button", { name: "Create fresh campaign" })
      .click();
    await expect(
      page.getByText("Level 0", { exact: true }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: "Show me where" }).click();

    const freshState = await getActiveState(page);
    expect(freshState.campaignSeed).not.toBe(originalState.campaignSeed);
    expect(freshState.reviewIntents).toHaveLength(0);
    expect(
      Object.values(freshState.learningHistories).every(
        (history) => history.reviews.length === 0,
      ),
    ).toBe(true);

    const tools = page.locator("details.development-panel");
    await expect(tools).toContainText("0 reviewed / 10 available");
    await expect(tools).toContainText("0 scored");
    await tools.getByText("Inspect FSRS cards").click();
    await expect(
      tools.locator(".learning-card-inspector li"),
    ).toHaveCount(10);
    await expect(
      tools.getByText(/New .* no campaign review/),
    ).toHaveCount(10);

    await page.getByRole("button", { name: /Campaigns \(2\)/ }).click();
    await page.getByRole("button", { name: "Open Clinic 1" }).click();
    await expect(
      page.getByText("Level 1", { exact: true }).first(),
    ).toBeVisible();
    const restoredState = await getActiveState(page);
    expect(restoredState.campaignSeed).toBe(originalState.campaignSeed);
    expect(restoredState.reviewIntents).toHaveLength(3);
  },
);

test(
  "emergency GLP-1 cash, prototype tools, and restart obey their boundaries",
  async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chrome",
      "Stateful prototype-tool checks run once at 1440px.",
    );

    await installDeterministicCampaignIds(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Show me where" }).click();

    const startingXp = Number(await xpValue(page).innerText());
    expect(startingXp).toBe(0);
    expect(await readMoney(page)).toBe(90);

    await page
      .getByRole("button", { name: "Complete consult (+$20)" })
      .click();
    await expect(moneyValue(page)).toContainText("$110");
    await expect(xpValue(page)).toHaveText("0");
    await expect(messageTitle(page, "Emergency side business")).toBeVisible();
    await expect(page.locator(".emergency-glp1-panel")).toHaveCount(0);

    await page.getByRole("button", { name: "Build Mode" }).click();
    await page
      .locator(".build-mode-panel")
      .getByRole("button", { name: /^Hallway/ })
      .click();
    await placeRoomAt(page.getByTestId("facility-canvas"), 9, 5);
    await page.getByRole("button", { name: "Exit Build Mode" }).click();

    const emergencyPanel = page.locator(".emergency-glp1-panel");
    await expect(emergencyPanel).toContainText(
      "Available in 1 facility hour.",
    );
    await expect(
      emergencyPanel.getByRole("button", { name: /Complete consult/ }),
    ).toBeDisabled();
    await expect(xpValue(page)).toHaveText("0");

    await fastForward(page);
    await expect(
      emergencyPanel.getByRole("button", { name: /Complete consult/ }),
    ).toBeEnabled();
    await expect(xpValue(page)).toHaveText("0");

    const tools = page.locator("details.development-panel");
    const beforeAddMoney = await readMoney(page);
    await tools.getByRole("button", { name: "Add $100" }).click();
    await expect
      .poll(() => readMoney(page))
      .toBe(beforeAddMoney + 100);
    await page.reload();
    await expect
      .poll(() => readMoney(page))
      .toBe(beforeAddMoney + 100);
    await expect(xpValue(page)).toHaveText("0");

    const tutorialToggle = tools.getByRole("checkbox", {
      name: /Tutorial guidance/,
    });
    await expect(tutorialToggle).toBeChecked();
    await tutorialToggle.uncheck();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Open your first patient chart" }),
    ).toHaveCount(0);

    await tools.getByRole("button", { name: "Restart game" }).click();
    await expect(
      page.getByRole("heading", { name: "Restart this local prototype?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm fresh start" }).click();
    await expect(
      page.getByText("Level 0", { exact: true }).first(),
    ).toBeVisible();
    await expect(moneyValue(page)).toContainText("$90");
    await expect(xpValue(page)).toHaveText("0");
    await expect(
      page.getByRole("button", { name: /Campaigns \(2\)/ }),
    ).toBeVisible();
  },
);

test(
  "does not claim it is safe to close when local persistence fails",
  async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chrome",
      "The storage-failure behavior is viewport-independent.",
    );

    await page.goto("/");
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("Synthetic storage failure", "QuotaExceededError");
      };
    });

    await page.getByRole("button", { name: "Save & Close" }).click();
    await expect(
      page.getByRole("heading", { name: "Keep this tab open" }),
    ).toBeFocused();
    await expect(
      page.getByRole("dialog").getByText("Save failed", { exact: true }),
    ).toBeVisible();
    await expect(messageTitle(page, "Save failed")).toBeVisible();
    await expect(
      page.getByText("Safe to close this tab", { exact: true }),
    ).toHaveCount(0);
  },
);

test("keeps the clinic and chart usable at desktop widths", async ({
  page,
}, testInfo) => {
  await installDeterministicCampaignIds(page);
  await page.goto("/");

  const facility = page.locator(".facility-frame");
  await expect(facility).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Open your first patient chart" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open first chart" }).click();

  const chart = page.locator(".chart-panel");
  await expect(chart).toBeVisible();
  await page.waitForTimeout(250);
  await expect(page.getByText(/not clinically approved/)).toHaveCount(1);
  const chartSections = await chart.innerText();
  expect(chartSections).not.toMatch(
    /\bunapproved\b|\bdraft\b|not medical advice|requires Melissa(?:'s)? review|\bvignette\b|\btentative\b|\bsimplified scenario\b|does not establish a (?:final )?diagnosis/i,
  );

  const workspace = page.locator(".clinic-workspace");
  const [workspaceBox, facilityBox, chartBox] = await Promise.all([
    workspace.boundingBox(),
    facility.boundingBox(),
    chart.boundingBox(),
  ]);
  expect(workspaceBox).not.toBeNull();
  expect(facilityBox).not.toBeNull();
  expect(chartBox).not.toBeNull();
  expect(facilityBox!.height).toBeGreaterThan(150);
  expect(chartBox!.x).toBeGreaterThanOrEqual(workspaceBox!.x);
  expect(chartBox!.x + chartBox!.width).toBeLessThanOrEqual(
    workspaceBox!.x + workspaceBox!.width + 1,
  );
  expect(chartBox!.y).toBeGreaterThanOrEqual(
    facilityBox!.y + facilityBox!.height - 12,
  );
  expect(chartBox!.y + chartBox!.height).toBeLessThanOrEqual(
    workspaceBox!.y + workspaceBox!.height + 1,
  );

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
  await expect(
    page.locator("details.development-panel"),
  ).toHaveAttribute("open", "");
  await expect(
    page.getByRole("button", { name: /SIGNAL ALPHA/ }),
  ).toBeVisible();

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-0-${testInfo.project.name}.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.getByRole("button", { name: /SIGNAL ALPHA/ }).click();
  await expect(page.locator(".chart-panel")).toHaveCount(0);
  await expect(
    page
      .locator(".patient-folder.is-active .patient-tab")
      .filter({ hasText: "Analysis pending" }),
  ).toBeVisible();
});
