import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  completeClinicOpening,
  getProfile,
  installLevelOneVisualState,
  openCampaignScreen,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("a new campaign reopens tutorial guidance after it was previously disabled", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "Campaign onboarding behavior only needs one browser project.",
  );

  await openCampaignScreen(page);
  await page.evaluate((profileKey) => {
    const raw = window.localStorage.getItem(profileKey);
    if (!raw) {
      throw new Error("Expected a local prototype profile.");
    }
    const profile = JSON.parse(raw) as { tutorialsEnabled: boolean };
    profile.tutorialsEnabled = false;
    window.localStorage.setItem(profileKey, JSON.stringify(profile));
  }, PROFILE_KEY);
  await page.reload();

  await page.getByRole("button", { name: "New Campaign" }).click();
  await completeClinicOpening(
    page,
    "Tutorial Again Founder",
    "Tutorial Again Surgical",
  );

  await expect(page.locator(".tutorial-coach")).toBeVisible();
  await expect(
    page.locator(".tutorial-coach").getByRole("heading"),
  ).toHaveText(
    /Your first patient is entering the clinic|Open your first patient chart/,
  );
  await expect(
    page.getByRole("button", { name: /Turn off tutorials/i }),
  ).toBeVisible();
});

test("the smooth HUD and compact bottom-left advertising leave room for six charts", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The six-chart rail is a desktop composition check.",
  );

  await startClinic(
    page,
    "Sidebar Founder",
    "Sidebar Surgical",
  );
  await installLevelOneVisualState(page);

  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!active) {
    throw new Error("Active campaign record is missing.");
  }
  const state = JSON.parse(active.serializedState) as {
    encounters: Record<string, Record<string, unknown>>;
    openChartEncounterId: string | null;
  };
  const source =
    state.encounters["encounter.visual.patient.2"] ??
    Object.values(state.encounters)[0];
  if (!source) {
    throw new Error("A source encounter is required.");
  }
  state.openChartEncounterId = null;
  state.encounters = Object.fromEntries(
    Array.from({ length: 6 }, (_, index) => {
      const id = `encounter.sidebar.patient.${index + 1}`;
      return [
        id,
        {
          ...structuredClone(source),
          id,
          patientDisplayName: `Patient ${index + 1}`,
          lifecycle: "waiting_unopened",
          assignedRoomInstanceId: "room.visual.waiting",
          patientMovement: null,
          protectedGuaranteeId: null,
          firstOpenedAtTick: null,
        },
      ];
    }),
  );
  active.serializedState = JSON.stringify(state);

  await page.addInitScript(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(
        profileKey,
        JSON.stringify(nextProfile),
      );
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );
  await page.goto("/?prototype-tools=0");
  await page
    .getByRole("button", { name: `Resume ${active.name}` })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const resourceBar = page.getByRole("banner", {
    name: "Clinic resources",
  });
  await expect(
    resourceBar.locator(".smooth-hud-icon"),
  ).toHaveCount(4);
  await expect(
    resourceBar.locator(".pixel-hud-icon"),
  ).toHaveCount(0);

  const patientList = page.getByRole("navigation", {
    name: "Patient charts",
  });
  const advertising = page.locator("[data-advertising-control]");
  await expect(patientList.locator(".patient-tab")).toHaveCount(6);
  await expect(advertising).toContainText("Advertising");
  await expect(advertising).toContainText(
    "$0/hr +0% arrival frequency",
  );
  await expect(advertising).not.toContainText("Patient demand");
  await expect(advertising).not.toContainText("Levels");

  const chartBox = await patientList.boundingBox();
  const advertisingBox = await advertising.boundingBox();
  expect(chartBox).not.toBeNull();
  expect(advertisingBox).not.toBeNull();
  expect(advertisingBox!.y).toBeGreaterThan(
    chartBox!.y + chartBox!.height - 2,
  );

  const liveFolders = patientList.locator(".patient-live-folders");
  const scrollMetrics = await liveFolders.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(scrollMetrics.scrollHeight).toBeLessThanOrEqual(
    scrollMetrics.clientHeight + 1,
  );

  const glp1 = page.locator(".emergency-glp1-panel");
  await expect(glp1).toBeVisible();
  await expect(
    glp1.getByRole("button", { name: /Complete consult/ }),
  ).toBeEnabled();
  await expect(glp1).not.toContainText("Available below");

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/hud-sidebar-six-patients.png`,
    animations: "disabled",
    fullPage: false,
  });
});
