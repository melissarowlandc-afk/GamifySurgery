import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  ACCESS_KEY,
  PROFILE_KEY,
  completeClinicOpening,
  getActiveState,
  getProfile,
  installDeterministicCampaignIds,
  messageTitle,
  moneyValue,
  openCampaignScreen,
  readMoney,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
  xpValue,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("absent or expired access shows login while remembered access skips it", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Local Prototype" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toHaveCount(0);

  await page.evaluate((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        mode: "local_prototype",
        issuedAtRealMs: 1,
        expiresAtRealMs: 2,
      }),
    );
  }, ACCESS_KEY);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Local Prototype" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Enter Local Prototype" }).click();
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Local Prototype" }),
  ).toHaveCount(0);
});

test("campaign screen hides Resume until a named clinic exists", async ({
  page,
}) => {
  await openCampaignScreen(page);
  await expect(
    page.getByRole("button", { name: /Resume/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New Campaign" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "New Campaign" }).click();
  await completeClinicOpening(
    page,
    "Named Founder",
    "Kent Surgical Clinic",
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Resume Kent Surgical Clinic" })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const profile = await getProfile(page);
  expect(profile.campaigns).toHaveLength(1);
  expect(profile.campaigns[0]?.name).toBe("Kent Surgical Clinic");
});

test("the rich-and-happy branch creates no clinic campaign", async ({
  page,
}) => {
  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await page.getByLabel("Founder name").fill("Happy Founder");
  await page.getByRole("button", { name: "Next head" }).click();
  await page.getByRole("button", { name: "Next body" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Be Rich and Happy" }).click();

  await expect(page.getByText("You are rich and happy.")).toBeVisible();
  await expect(
    page.getByLabel("Happy Founder, rich and happy"),
  ).toBeVisible();
  const persisted = await page.evaluate((profileKey) => {
    const raw = window.localStorage.getItem(profileKey);
    return raw
      ? (JSON.parse(raw) as {
          activeCampaignId: string | null;
          campaigns: unknown[];
        })
      : null;
  }, PROFILE_KEY);
  expect(persisted?.activeCampaignId ?? null).toBeNull();
  expect(persisted?.campaigns ?? []).toHaveLength(0);

  await page
    .getByRole("button", { name: "Return to Campaigns" })
    .click();
  await expect(
    page.getByRole("button", { name: "New Campaign" }),
  ).toBeVisible();
  await expect(page.getByTestId("facility-canvas")).toHaveCount(0);
});

test("clinic initialization is one-time, named, and reload safe", async ({
  page,
}) => {
  await installDeterministicCampaignIds(page);
  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
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
  await expect(
    page.getByRole("heading", { name: "Name Your Clinic" }),
  ).toBeVisible();
  await page.getByLabel("Clinic name").fill("One-Time Surgery");
  const openClinic = page.getByRole("button", {
    name: "Open the Clinic",
  });
  await openClinic.evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const firstProfile = await getProfile(page);
  expect(firstProfile.campaigns).toHaveLength(1);
  expect(firstProfile.campaigns[0]?.name).toBe("One-Time Surgery");
  const firstState = await getActiveState(page);
  expect(firstState.founder.displayName).toBe("Clinic Founder");
  expect(firstState.founder.headId).toBe("head.02");
  expect(firstState.founder.bodyId).toBe("body.02");
  expect(firstState.rooms).toHaveLength(1);
  expect(firstState.doors).toHaveLength(1);
  expect(firstState.cash).not.toBe(1_000_000);
  expect(firstState.facilityLevel).toBe(0);
  expect(
    Object.values(firstState.learningHistories).every(
      (history) => history.reviews.length === 0,
    ),
  ).toBe(true);

  await page.reload();
  await page
    .getByRole("button", { name: "Resume One-Time Surgery" })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const restored = await getActiveState(page);
  expect(restored.rooms).toHaveLength(1);
  expect(restored.doors).toHaveLength(1);
  expect(restored.founder.displayName).toBe("Clinic Founder");
});

test("multiple named clinics stay independent and normalized duplicates are rejected", async ({
  page,
}) => {
  await startClinic(page, "First Founder", "Alpha Surgery");
  const first = await getActiveState(page);

  await page.getByRole("button", { name: /Campaigns \(1\)/ }).click();
  await page
    .getByRole("button", { name: "Create fresh campaign" })
    .click();
  await completeClinicOpening(
    page,
    "Second Founder",
    "Beta Surgery",
  );
  const second = await getActiveState(page);
  expect(second.campaignId).not.toBe(first.campaignId);
  expect(second.campaignSeed).not.toBe(first.campaignSeed);
  expect(
    Object.values(second.learningHistories).every(
      (history) => history.reviews.length === 0,
    ),
  ).toBe(true);

  await page.getByRole("button", { name: /Campaigns \(2\)/ }).click();
  await page
    .getByRole("button", { name: "Create fresh campaign" })
    .click();
  await page.getByLabel("Founder name").fill("Duplicate Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("button", { name: "Build a Surgery Clinic" })
    .click();
  await page.getByLabel("Clinic name").fill("  alpha   surgery  ");
  await expect(
    page.getByText("That clinic name already exists in town."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open the Clinic" }),
  ).toBeDisabled();
  expect((await getProfile(page)).campaigns).toHaveLength(2);
});

test("restart archives the selected campaign and returns to a fresh founder flow", async ({
  page,
}) => {
  await startClinic(page, "Restart Founder", "Restartable Surgery");
  const original = await getActiveState(page);
  await page.getByRole("button", { name: "Restart Campaign" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Restart this campaign?",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Archive and restart" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Create Your Founder" }),
  ).toBeVisible();
  const archivedProfile = await getProfile(page);
  expect(
    archivedProfile.campaigns.find(
      (campaign) => campaign.campaignId === original.campaignId,
    )?.status,
  ).toBe("archived");
  expect(archivedProfile.activeCampaignId).toBeNull();

  await completeClinicOpening(
    page,
    "Fresh Restart Founder",
    "Fresh Restart Surgery",
  );
  const restarted = await getActiveState(page);
  expect(restarted.campaignId).not.toBe(original.campaignId);
  expect(restarted.cash).toBe(120);
  expect(restarted.clinicalXp).toBe(0);
  expect(
    Object.values(restarted.learningHistories).every(
      (history) => history.reviews.length === 0,
    ),
  ).toBe(true);
});

test("movement, sequential feedback, off-site return, and settlement are visible", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(90_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The complete clinical walkthrough runs once at the primary desktop size.",
  );
  await startClinic(
    page,
    "Movement Founder",
    "Movement Surgical Clinic",
  );
  await setFastFacilitySpeed(page);

  await expect(
    page.getByRole("heading", {
      name: "Your first patient is entering the clinic",
    }),
  ).toBeVisible();
  const firstPatient = await waitForFirstPatientReady(page);
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.getByRole("heading", { name: "Open your first patient chart" }),
  ).toBeVisible();
  await firstPatient.click();
  await expect(page.locator(".chart-panel")).toBeVisible();
  await expect(
    page.locator(".chart-title-status"),
  ).toBeVisible();
  // At 4x, a busy parallel browser run may complete the short exam-room
  // route between the tab click and this assertion. Both labels represent
  // the same valid forward-only transition; the earlier check-in tutorial
  // heading already proves that visible movement began.
  await expect(page.locator(".chart-title-status")).toHaveText(
    /Walking to Examination|Action required/,
  );
  await expect(
    page.getByRole("heading", {
      name: "Read across the chart, then choose",
    }),
  ).toBeVisible();
  const choices = await waitForDecisionChoices(page);
  await expect(choices).toHaveCount(4);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/july28-tutorial-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Got It" }).click();

  const firstDecisionState = await getActiveState(page);
  const firstDecisionEncounter =
    firstDecisionState.encounters[
      firstDecisionState.openChartEncounterId!
    ]!;
  const firstDecisionNode =
    firstDecisionEncounter.frozenCase.decisionNodes[
      firstDecisionEncounter.currentNodeIndex
    ]!;
  const firstCorrectChoice = firstDecisionNode.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  await page
    .getByRole("button", {
      name: firstCorrectChoice.label,
      exact: true,
    })
    .click();
  await expect(page.locator(".chart-step-feedback")).toContainText(
    "Correct",
  );
  await expect(page.locator(".chart-step-feedback")).toContainText(
    "Decision XP: +20",
  );
  await expect(xpValue(page)).toHaveText("20");
  await expect(
    page.getByRole("heading", { name: "Review the decision result" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Decisions Correct: 1/1",
  );
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Encounter Payment: +$75",
  );
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Encounter XP: +20",
  );
  await expect(
    page.getByRole("heading", { name: "Review the encounter summary" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Flip for More Disease Information",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await page
    .getByRole("button", { name: "Flip for More Disease Information" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Resolve Completed Chart" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await page
    .getByRole("button", { name: "Resolve Completed Chart" })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Use quiet moments around the clinic",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  const secondArrivalCoach = page
    .locator(".tutorial-coach")
    .filter({ hasText: "Second patient" });
  const secondArrivalHeading = secondArrivalCoach.getByRole("heading");
  await expect(secondArrivalHeading).toBeVisible({ timeout: 15_000 });
  const secondPatientName = (
    (await secondArrivalHeading.textContent()) ?? ""
  ).replace(/ is entering the clinic$/, "");
  expect(secondPatientName).not.toBe("");
  await page.getByRole("button", { name: "Got It" }).click();
  const secondPatient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .filter({ hasText: secondPatientName });
  await expect(secondPatient).toBeVisible({ timeout: 15_000 });
  await expect(
    page.getByRole("heading", { name: "Open the second patient chart" }),
  ).toBeVisible();
  await secondPatient.click();
  await expect(
    page.getByRole("heading", { name: "Choose the first plan" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  const secondDecisionState = await getActiveState(page);
  const secondDecisionEncounter =
    secondDecisionState.encounters[
      secondDecisionState.openChartEncounterId!
    ]!;
  const secondDecisionNode =
    secondDecisionEncounter.frozenCase.decisionNodes[
      secondDecisionEncounter.currentNodeIndex
    ]!;
  const secondCorrectChoice = secondDecisionNode.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  await page
    .getByRole("button", {
      name: new RegExp(
        `^${secondCorrectChoice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
    })
    .click();
  await expect(page.locator(".chart-step-feedback")).toContainText(
    "Decision XP: +10",
  );
  await expect(
    page.getByRole("heading", {
      name: "Review the answer before care begins",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await page.getByRole("button", { name: "Enact Plan" }).click();
  const returnToClinic = page.getByRole("button", {
    name: "Return to clinic",
  });
  if (await returnToClinic.isVisible({ timeout: 2_000 })) {
    await returnToClinic.click();
  }
  const existingPatient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: secondPatientName });
  const sendoutCoach = page.getByRole("heading", {
    name: "The patient is away for the timed service",
  });
  if (await sendoutCoach.isVisible({ timeout: 5_000 })) {
    await page.getByRole("button", { name: "Got It" }).click();
  }
  await expect(existingPatient).toHaveAccessibleName(/Action required/, {
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", {
      name: "The returning patient is ready",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await existingPatient.click();
  await expect(
    page.getByRole("heading", {
      name: "The result unlocked the next decision",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.locator(".chart-completed-decision"),
  ).toHaveCount(1);
  await expect(
    page.getByText("Decision 2 of 2", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/july28-multistep-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
  const finalDecisionState = await getActiveState(page);
  const finalDecisionEncounter =
    finalDecisionState.encounters[
      finalDecisionState.openChartEncounterId!
    ]!;
  const finalDecisionNode =
    finalDecisionEncounter.frozenCase.decisionNodes[
      finalDecisionEncounter.currentNodeIndex
    ]!;
  const finalCorrectChoice = finalDecisionNode.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  await page
    .getByRole("button", {
      name: new RegExp(
        `^${finalCorrectChoice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
    })
    .click();
  const finalFeedback = page.locator(
    ".chart-step-column.is-current .chart-step-feedback",
  );
  await expect(finalFeedback).toBeVisible();
  await expect(finalFeedback).toContainText("Correct");
  await expect(finalFeedback).toContainText("Decision XP: +10");
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Decisions Correct: 2/2",
  );
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Encounter Payment: +$135",
  );
  await expect(page.locator(".chart-reward-banner")).toContainText(
    "Encounter XP: +20",
  );
  await expect(
    page.getByRole("button", {
      name: "Flip for more disease information",
    }),
  ).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/clinical-feedback-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("pause freezes the GLP-1 cooldown and facility time advances it", async ({
  page,
}) => {
  await startClinic(page, "GLP Founder", "GLP Surgical Clinic");
  const panel = page.locator(".emergency-glp1-panel");
  await expect(panel).toBeVisible();
  const before = await readMoney(page);
  await panel
    .getByRole("button", { name: /Complete consult/ })
    .click();
  await expect(moneyValue(page)).toContainText(`$${before + 25}`);
  await expect(xpValue(page)).toHaveText("0");
  await expect(
    page
      .locator(".event-message-board .message-board-feed")
      .getByText(/Emergency GLP-1 consultation completed/),
  ).toHaveCount(0);
  const consult = panel.getByRole("button", {
    name: /Complete consult/,
  });
  await expect(consult).toBeDisabled();

  await page
    .getByRole("button", { name: "Pause facility time" })
    .click();
  const progressBefore = await panel
    .getByRole("progressbar")
    .getAttribute("aria-valuenow");
  await page.waitForTimeout(1_500);
  expect(
    await panel.getByRole("progressbar").getAttribute("aria-valuenow"),
  ).toBe(progressBefore);
  await page
    .getByRole("button", { name: "Resume facility time" })
    .click();

  await page
    .getByRole("button", { name: "Set facility speed to 4x" })
    .click();
  await expect(consult).toBeEnabled({ timeout: 20_000 });
  await page.reload();
  await page
    .getByRole("button", { name: "Resume GLP Surgical Clinic" })
    .click();
  await expect(
    page
      .locator(".emergency-glp1-panel")
      .getByRole("button", { name: /Complete consult/ }),
  ).toBeEnabled();
});

test("a failed local save never claims the tab is safe to close", async ({
  page,
}) => {
  await startClinic(page, "Save Founder", "Save Failure Surgery");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException(
        "Synthetic storage failure",
        "QuotaExceededError",
      );
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
});
