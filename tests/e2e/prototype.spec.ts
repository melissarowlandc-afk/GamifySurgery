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
  founder: {
    displayName: string;
    appearance: unknown;
  };
  rooms: unknown[];
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

async function completeClinicOpening(
  page: Page,
  founderName = "Test Founder",
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
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function startClinic(
  page: Page,
  founderName = "Test Founder",
): Promise<void> {
  await page.goto("/");
  await completeClinicOpening(page, founderName);
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
 * Phaser keeps the founder's front desk centered while zooming expands the
 * usable 24x10 grid around it. This mirrors the zoom-one camera contract so a
 * click targets a meaningful world tile rather than an obsolete fit-all grid.
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
    Math.floor(Math.min(usableWidth / 16, usableHeight / 6)),
  );
  const founderFocusX = 11.5;
  const founderFocusY = 8;
  const originX = Math.floor(box.width / 2 - founderFocusX * tileSize);
  const originY = Math.floor(
    headerHeight + usableHeight * 0.48 - founderFocusY * tileSize,
  );

  await facility.click({
    position: {
      x: originX + (tileX + 0.5) * tileSize,
      y: originY + (tileY + 0.5) * tileSize,
    },
  });
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("the rich-and-happy branch creates no clinic campaign", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Create Your Founder" }),
  ).toBeVisible();
  await page.getByLabel("Founder name").fill("Happy Founder");
  await page.getByRole("button", { name: "Next head" }).click();
  await page.getByRole("button", { name: "Next body" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Be Rich and Happy" }).click();

  await expect(page.getByText("You are rich and happy.")).toBeVisible();
  const persisted = await page.evaluate((profileKey) => {
    const raw = window.localStorage.getItem(profileKey);
    return raw
      ? (JSON.parse(raw) as {
          activeCampaignId: string | null;
          campaigns: unknown[];
        })
      : null;
  }, PROFILE_KEY);
  expect(persisted?.activeCampaignId).toBeNull();
  expect(persisted?.campaigns).toHaveLength(0);

  await page
    .getByRole("button", { name: "Return to Main Screen" })
    .click();
  await expect(
    page.getByRole("button", { name: "New Campaign" }),
  ).toBeVisible();
  await expect(page.getByTestId("facility-canvas")).toHaveCount(0);
});

test("the clinic branch initializes Level 0 once and survives reload", async ({
  page,
}) => {
  await installDeterministicCampaignIds(page);
  await page.goto("/");
  await page.getByLabel("Founder name").fill("Clinic Founder");
  await page.getByRole("button", { name: "Next head" }).click();
  await page.getByRole("button", { name: "Next body" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  const clinicChoice = page.getByRole("button", {
    name: "Build a Surgery Clinic",
  });
  await clinicChoice.evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const first = await page.evaluate((profileKey) => {
    const profile = JSON.parse(
      window.localStorage.getItem(profileKey) ?? "null",
    ) as PersistedProfile;
    const active = profile.campaigns.find(
      (campaign) => campaign.campaignId === profile.activeCampaignId,
    );
    return {
      campaignCount: profile.campaigns.length,
      state: JSON.parse(active?.serializedState ?? "null") as PersistedGameState,
    };
  }, PROFILE_KEY);
  expect(first.campaignCount).toBe(1);
  expect(first.state.founder.displayName).toBe("Clinic Founder");
  expect(first.state.rooms).toHaveLength(1);
  expect(first.state.cash).not.toBe(1_000_000);
  expect(first.state.facilityLevel).toBe(0);
  expect(
    Object.values(first.state.learningHistories).every(
      (history) => history.reviews.length === 0,
    ),
  ).toBe(true);

  await page.reload();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Create Your Founder" }),
  ).toHaveCount(0);
  const restored = await getActiveState(page);
  expect(restored.rooms).toHaveLength(1);
  expect(restored.founder.displayName).toBe("Clinic Founder");
});

test("an explicit pause freezes the accelerated tutorial result timer", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The real-time pause regression runs once at the primary desktop size.",
  );

  await startClinic(page, "Pause Founder");
  await page.locator(".patient-tab.is-tutorial-target").click();
  await page
    .getByRole("button", { name: /SIGNAL ALPHA.*1 hour/ })
    .click();
  const pendingPatient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: "Pixel Patient" });
  await expect(pendingPatient).toContainText("Analysis pending");

  await page
    .getByRole("button", { name: "Pause facility time" })
    .click();
  await expect(page.locator(".facility-pause-indicator")).toContainText(
    "PAUSED",
  );
  await page.waitForTimeout(4_500);
  await expect(pendingPatient).toContainText("Analysis pending");

  await page
    .getByRole("button", { name: "Resume facility time" })
    .click();
  await expect(pendingPatient).toContainText("Action required", {
    timeout: 7_000,
  });
});

test(
  "plays Level 0 through Level 1, saves, and isolates campaign FSRS",
  async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chrome",
      "The full progression walkthrough runs once at 1440px.",
    );

    await installDeterministicCampaignIds(page);
    await startClinic(page);

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

    const tutorialTarget = page.locator(".patient-tab.is-tutorial-target");
    await expect(tutorialTarget).toHaveClass(/tutorial-target-highlight/);
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-callout-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
    await tutorialTarget.click();
    await expect(
      page.getByRole("heading", {
        name: "Read across the chart, then choose",
      }),
    ).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-chart-tour-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "Close patient chart" }).click();
    await expect(
      page.getByRole("heading", {
        name: "Reopen Pixel Patient's chart",
      }),
    ).toBeVisible();
    await page
      .locator(".patient-folder.is-active .patient-tab.is-tutorial-target")
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Read across the chart, then choose",
      }),
    ).toBeVisible();

    const firstDecision = page.locator(
      ".chart-step-column.is-current .answer-choice",
    );
    await expect(firstDecision).toHaveCount(3);
    const firstDecisionLabels = await firstDecision
      .locator("strong")
      .allTextContents();
    expect(firstDecisionLabels.indexOf("SIGNAL ALPHA")).toBe(2);
    const correctSignal = page.getByRole("button", {
      name: /SIGNAL ALPHA.*1 hour/,
    });
    await expect(correctSignal).toBeVisible();
    await correctSignal.click();

    await expect(page.locator(".chart-panel")).toHaveCount(0);
    await expect(xpValue(page)).toHaveText("5");
    await expect(messageTitle(page, "Decision recorded")).toBeVisible();
    await expect(messageTitle(page, "Corrective review")).toHaveCount(0);
    const pendingPatient = page
      .locator(".patient-folder.is-active .patient-tab")
      .filter({ hasText: "Pixel Patient" });
    await expect(pendingPatient).toContainText("Analysis pending");
    await expect(
      page.getByRole("button", { name: /Pixel Patient.*Analysis pending/ }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "The patient left for an off-site result",
      }),
    ).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-result-wait-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
    await expect(pendingPatient).toContainText("Action required", {
      timeout: 10_000,
    });
    await expect(pendingPatient.getByLabel("Action required")).toBeVisible();
    await expect(messageTitle(page, "Results ready")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "The result is ready" }),
    ).toBeVisible();
    await pendingPatient.click();
    await expect(
      page
        .locator(".chart-result-card")
        .getByText("The returned marker reads ACTION CIRCLE."),
    ).toBeVisible();
    await page.getByRole("button", { name: "ACTION CIRCLE" }).click();
    const decisionRewards = page.locator(".chart-decision-reward");
    await expect(decisionRewards).toHaveCount(2);
    expect(await decisionRewards.allTextContents()).toEqual([
      "+5 Learning XP",
      "+5 Learning XP",
    ]);
    await expect(xpValue(page)).toHaveText("10");
    await expect(
      page.getByRole("button", {
        name: "Flip for more disease information",
      }),
    ).toBeVisible();
    await expect(page.locator(".tutorial-coach")).toContainText(
      "Your clinical decision making is truly godlike.",
    );
    await page.getByRole("button", { name: "Resolve chart" }).click();

    const secondTutorial = page
      .locator(".patient-folder.is-waiting .patient-tab")
      .filter({ hasText: "Morgan Thread" });
    await expect(
      page.getByRole("heading", {
        name: "The clinic is quiet for a moment",
      }),
    ).toBeVisible();
    await expect(secondTutorial).toHaveCount(0);
    await expect(secondTutorial).toBeVisible({ timeout: 8_000 });
    await expect(
      page.getByRole("heading", {
        name: "A second patient has arrived",
      }),
    ).toBeVisible();
    await secondTutorial.click();
    await page.getByRole("button", { name: "Close patient chart" }).click();
    await expect(
      page.getByRole("heading", {
        name: "Reopen Morgan Thread's chart",
      }),
    ).toBeVisible();
    await page
      .locator(".patient-folder.is-active .patient-tab.is-tutorial-target")
      .click();
    await page
      .getByRole("button", {
        name: /Assess wound type and vaccine history/,
      })
      .click();
    await expect(page.locator(".chart-decision-reward")).toContainText(
      "+5 Learning XP",
    );
    await expect(xpValue(page)).toHaveText("15");
    await page.getByRole("button", { name: "Resolve chart" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Your remaining goal needs an examination room",
      }),
    ).toBeVisible();
    const goalsPanel = page.locator(".goals-panel");
    await expect(goalsPanel).toBeVisible();
    await expect(goalsPanel.locator(".goal-list li")).toHaveCount(3);
    await expect(page.locator(".resource-goals-popover")).toHaveCount(0);
    expect(
      await goalsPanel.evaluate((panel) => {
        const lastGoal = panel.querySelector(".goal-list li:last-child");
        if (!lastGoal) {
          return false;
        }
        return (
          lastGoal.getBoundingClientRect().bottom <=
          panel.getBoundingClientRect().bottom + 1
        );
      }),
    ).toBe(true);
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/tutorial-goals-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
    await page.getByRole("button", { name: /Enter Build Mode/ }).click();
    await expect(
      page.getByRole("button", { name: "Pause facility time" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Resume facility time" }),
    ).toBeDisabled();
    await expect(page.locator(".build-mode-panel")).toContainText(
      "Time paused",
    );
    await expect(page.locator(".facility-pause-indicator")).toContainText(
      "BUILD MODE",
    );
    await page
      .locator("[data-room-definition-id='room.examination']")
      .click();
    await expect(page.locator(".placement-orientation")).toContainText(
      "door faces south",
    );
    await page
      .getByRole("button", { name: /Rotate room 90/ })
      .click();
    await expect(page.locator(".placement-orientation")).toContainText(
      "door faces west",
    );
    await placeRoomAt(page.getByTestId("facility-canvas"), 14, 6);
    await expect(page.locator(".build-mode-panel")).toContainText(
      "1 built",
    );
    await page.getByRole("button", { name: "Exit Build Mode" }).click();
    await expect(
      page.getByRole("button", { name: "Pause facility time" }),
    ).toBeVisible();
    const recentEvents = page.locator("details.message-board-history");
    await recentEvents.locator("summary").click();
    await expect(recentEvents).toContainText("Construction complete");

    await expect(
      page
        .locator(".goals-panel")
        .getByRole("button", { name: "Advance to Level 1" }),
    ).toBeVisible();
    await page
      .locator(".goals-panel")
      .getByRole("button", { name: "Advance to Level 1" })
      .click();
    await expect(
      page.getByRole("heading", {
        name: /first Level 1 patient is on the way|Resume facility time to begin Level 1/,
      }),
    ).toBeVisible();
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
    await expect(
      page.getByRole("button", { name: "Resume facility time" }),
    ).toBeVisible();
    const originalState = await getActiveState(page);
    expect(originalState.facilityLevel).toBe(1);
    expect(originalState.reviewIntents).toHaveLength(3);

    await page.reload();
    await expect(
      page.getByText("Level 1", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resume facility time" }),
    ).toBeVisible();

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
    await completeClinicOpening(page, "Fresh Founder");
    await expect(
      page.getByText("Level 0", { exact: true }).first(),
    ).toBeVisible();

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
    await startClinic(page);

    const startingXp = Number(await xpValue(page).innerText());
    expect(startingXp).toBe(0);
    expect(await readMoney(page)).toBe(90);

    await page
      .getByRole("button", { name: "Complete consult (+$20)" })
      .click();
    await expect(moneyValue(page)).toContainText("$110");
    await expect(xpValue(page)).toHaveText("0");
    await expect(messageTitle(page, "Emergency side business")).toBeVisible();
    const emergencyPanel = page.locator(".emergency-glp1-panel");
    await expect(emergencyPanel).toContainText("Available in 1 hour.");
    await expect(
      emergencyPanel.getByRole("button", { name: /Complete consult/ }),
    ).toBeDisabled();

    await page
      .getByRole("button", { name: /Enter Build Mode/ })
      .click();
    await page
      .locator(".build-mode-panel")
      .getByRole("button", { name: /^Hallway/ })
      .click();
    await placeRoomAt(page.getByTestId("facility-canvas"), 9, 5);
    await page.getByRole("button", { name: "Exit Build Mode" }).click();

    await expect(emergencyPanel).toContainText(
      "Available in 1 hour.",
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
      page.getByRole("heading", { name: "Create Your Founder" }),
    ).toBeVisible();
    await completeClinicOpening(page, "Restarted Founder");
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

    await startClinic(page);
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

test("keeps the upper clinic stable and the chart usable on its desktop desk", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "phone-chrome",
    "Phone chart usability has a focused interaction test without desktop geometry assertions.",
  );

  await installDeterministicCampaignIds(page);
  await startClinic(page);

  const facility = page.locator(".facility-frame");
  await expect(facility).toBeVisible();
  const facilityBeforeChart = await facility.boundingBox();
  expect(facilityBeforeChart).not.toBeNull();
  await expect(
    page.getByRole("heading", { name: "Open your first patient chart" }),
  ).toBeVisible();
  await page
    .locator(".patient-folder.is-waiting .patient-tab.is-tutorial-target")
    .click();

  const chart = page.locator(".chart-panel");
  await expect(chart).toBeVisible();
  await page.waitForTimeout(250);
  await expect(page.getByText(/not clinically approved/)).toHaveCount(1);
  const chartSections = await chart.innerText();
  expect(chartSections).not.toMatch(
    /\bunapproved\b|\bdraft\b|not medical advice|requires Melissa(?:'s)? review|\bvignette\b|\btentative\b|\bsimplified scenario\b|does not establish a (?:final )?diagnosis/i,
  );

  const workspace = page.locator(".clinic-workspace");
  const desk = page.getByRole("region", { name: "Clinical desk" });
  const [workspaceBox, facilityBox, deskBox, chartBox] = await Promise.all([
    workspace.boundingBox(),
    facility.boundingBox(),
    desk.boundingBox(),
    chart.boundingBox(),
  ]);
  expect(workspaceBox).not.toBeNull();
  expect(facilityBox).not.toBeNull();
  expect(deskBox).not.toBeNull();
  expect(chartBox).not.toBeNull();
  expect(facilityBox!.height).toBeGreaterThan(150);
  expect(facilityBox!.x).toBeCloseTo(facilityBeforeChart!.x, 0);
  expect(facilityBox!.y).toBeCloseTo(facilityBeforeChart!.y, 0);
  expect(facilityBox!.width).toBeCloseTo(
    facilityBeforeChart!.width,
    0,
  );
  expect(facilityBox!.height).toBeCloseTo(
    facilityBeforeChart!.height,
    0,
  );
  expect(deskBox!.y).toBeGreaterThanOrEqual(
    facilityBox!.y + facilityBox!.height,
  );
  expect(chartBox!.x).toBeGreaterThanOrEqual(deskBox!.x);
  expect(chartBox!.x + chartBox!.width).toBeLessThanOrEqual(
    deskBox!.x + deskBox!.width + 1,
  );
  expect(chartBox!.y).toBeGreaterThanOrEqual(deskBox!.y);
  expect(chartBox!.y + chartBox!.height).toBeLessThanOrEqual(
    deskBox!.y + deskBox!.height + 1,
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

test(
  "keeps both opening branches and the clinic chart usable at phone width",
  async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "phone-chrome",
      "This is the focused phone-width opening and chart walkthrough.",
    );

    await page.goto("/");
    await page.getByLabel("Founder name").fill("Pocket Founder");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Be Rich and Happy" }).click();
    await expect(page.getByText("You are rich and happy.")).toBeVisible();
    await page
      .getByRole("button", { name: "Return to Main Screen" })
      .click();

    await page.getByRole("button", { name: "New Campaign" }).click();
    await completeClinicOpening(page, "Pocket Surgeon");
    await expect(
      page.getByRole("heading", { name: "Open your first patient chart" }),
    ).toBeVisible();

    await page.locator(".patient-tab.is-tutorial-target").click();
    const chart = page.locator(".chart-panel");
    await expect(chart).toBeVisible();
    const coach = page.locator(".tutorial-coach");
    const answerList = page.locator(
      ".chart-step-column.is-current .answer-list",
    );
    await expect(coach).toBeVisible();
    await expect(coach).toHaveAttribute(
      "data-target-positioned",
      "true",
    );
    expect(
      await page.evaluate(() => {
        const coachElement =
          document.querySelector<HTMLElement>(".tutorial-coach");
        const answerElement = document.querySelector<HTMLElement>(
          ".chart-step-column.is-current .answer-list",
        );
        if (!coachElement || !answerElement) {
          return true;
        }
        const coachRect = coachElement.getBoundingClientRect();
        const answerRect = answerElement.getBoundingClientRect();
        return !(
          coachRect.right <= answerRect.left ||
          coachRect.left >= answerRect.right ||
          coachRect.bottom <= answerRect.top ||
          coachRect.top >= answerRect.bottom
        );
      }),
    ).toBe(false);
    await expect(answerList).toBeVisible();
    await expect(
      page.getByRole("button", { name: /SIGNAL ALPHA.*1 hour/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close patient chart" }),
    ).toBeVisible();
    await expect(page.getByTestId("facility-canvas")).toBeAttached();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  },
);
