import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

async function installRoutineFixture(
  page: Page,
  kind: "desk" | "refill",
): Promise<void> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!active) throw new Error("Active campaign is missing.");
  const state = JSON.parse(active.serializedState) as any;
  const frontDesk = state.rooms.find(
    (room: any) => room.roomDefinitionId === "room.front_desk",
  );
  if (!frontDesk) throw new Error("Front Desk is missing.");
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.environment.founderLocation = {
    x: frontDesk.x + 2,
    y: frontDesk.y + 3,
  };
  state.paused = true;
  if (kind === "desk") {
    state.employees = [];
  } else {
    state.facilityLevel = 1;
    state.environment.waterCoolerFillPercent = 0;
    state.environment.waterCoolerEmptySinceTick = state.facilityTick;
    state.employees = [
      {
        id: "employee.e2e.receptionist",
        staffRoleDefinitionId: "staff.receptionist",
        displayName: "Routine Receptionist",
        appearance: state.founder.appearance,
        hiredAtFacilityTick: 0,
        salaryPerExpenseInterval: 18,
        morale: 80,
        trainingLevel: 1,
        homeRoomInstanceId: frontDesk.id,
        location: { x: frontDesk.x + 2, y: frontDesk.y + 1 },
        path: [{ x: frontDesk.x + 2, y: frontDesk.y + 1 }],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        lastPraisedAtFacilityTick: null,
        nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
        facilityTask: null,
      },
    ];
  }
  active.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_KEY, value: profile },
  );
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: new RegExp(`^Resume ${active.name}$`) });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(
    () => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame === "object",
  );
}

test("the rendered Front Desk counter seats the founder", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop geometry proof.");
  await startClinic(page, "Routine Founder", "Daily Routine Desk Clinic");
  await installRoutineFixture(page, "desk");
  const point = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const room = scene.bridge.viewModel.rooms.find(
      (candidate: any) => candidate.definitionId === "room.front_desk",
    );
    const x = scene.layout.originX + (room.tileX + room.width * 0.4) * scene.layout.tileSize;
    const y = scene.layout.originY + (room.tileY + room.height * 0.62) * scene.layout.tileSize;
    const bounds = host.getBoundingClientRect();
    return { x: bounds.left + x, y: bounds.top + y };
  });
  await page.mouse.click(point.x, point.y);
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    return scene.bridge.viewModel.founder.activityLabel === "Returning to Front Desk";
  });
  const endpoint = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    return scene.bridge.viewModel.founder.path.at(-1);
  });
  expect(endpoint).toEqual({ x: 35, y: 29 });
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const founder = scene.bridge.viewModel.founder;
    const gait = scene.debugCharacterGaitSnapshot()["character:founder"];
    return founder.location?.x === 35 && founder.location?.y === 29 &&
      founder.moving === false && founder.seated === true &&
      gait?.visible === true && gait.pose === "seated" && gait.direction === "front";
  });
  const renderedPose = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const actor = scene.characterBitmapContainers
      .get("character:founder")
      .getByName("actor");
    return {
      seated: scene.bridge.viewModel.founder.seated,
      gait: scene.debugCharacterGaitSnapshot()["character:founder"],
      source: {
        cutWidth: actor.frame.cutWidth,
        cutHeight: actor.frame.cutHeight,
      },
    };
  });
  expect(renderedPose.seated).toBe(true);
  expect(renderedPose.gait).toMatchObject({
    visible: true,
    pose: "seated",
    direction: "front",
  });
  expect(renderedPose.source).toEqual({ cutWidth: 128, cutHeight: 192 });
  await page.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOTS}/gs-023-founder-seated-at-front-desk.png`,
    animations: "disabled",
  });
});

test("an empty cooler sends an idle receptionist to the refill point", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop refill proof.");
  await startClinic(page, "Routine Founder", "Daily Routine Refill Clinic");
  await installRoutineFixture(page, "refill");
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const endpoint = scene.bridge.viewModel.staff[0]?.path.at(-1);
    return endpoint?.x === 37 && endpoint?.y === 29 &&
      scene.bridge.viewModel.waterCooler.fillPercent === 0;
  });
  const proof = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const employee = scene.bridge.viewModel.staff[0];
    return {
      fillPercent: scene.bridge.viewModel.waterCooler.fillPercent,
      endpoint: employee.path.at(-1),
    };
  });
  expect(proof).toEqual({ fillPercent: 0, endpoint: { x: 37, y: 29 } });
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const employee = scene.bridge.viewModel.staff[0];
    const endpoint = employee?.path.at(-1);
    return scene.bridge.viewModel.waterCooler.fillPercent === 100 &&
      endpoint?.x === 35 && endpoint?.y === 29 && employee.moving === false;
  });
  await page.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOTS}/gs-023-receptionist-refilled-and-returned.png`,
    animations: "disabled",
  });
});
