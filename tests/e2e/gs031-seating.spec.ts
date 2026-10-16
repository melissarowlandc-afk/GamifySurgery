import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  getRoomDefinition,
  getFacilityAccessValidation,
  getRoomWaitingAnchors,
  type GameState,
  type RoomOrientation,
} from "@gamify-surgery/game-domain";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/gs031/browser-seating";
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));
test.setTimeout(180_000);

interface FixtureOptions {
  orientation?: 0 | 270;
  occupiedChairIndex?: number;
}

function fixture(state: GameState, options: FixtureOptions = {}): GameState {
  const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
  const publicEntrance = state.doors.find((door) => door.roomId === frontDesk.id && door.exterior);
  const waiting = {
    id: "gs031.waiting",
    roomDefinitionId: "room.waiting",
    x: options.orientation === 270 ? 29 : 28,
    y: 28,
    orientation: (options.orientation ?? 0) as RoomOrientation,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  state.facilityLevel = 1;
  state.paused = options.occupiedChairIndex !== undefined;
  state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.environment.founderActivity = null;
  state.rooms = [frontDesk, waiting, ...[24, 25, 26, 27, 28].map((y) => ({
    id: `gs031.hall.${y}`,
    roomDefinitionId: "room.hallway",
    x: 32,
    y,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  }))];
  state.doors = [
    ...(publicEntrance ? [publicEntrance] : []),
    { id: "gs031.front-hall", roomId: frontDesk.id, side: "west", offset: 0, exterior: false },
    { id: "gs031.waiting-hall", roomId: waiting.id, side: "east", offset: 0, exterior: false },
  ];
  const waitingDefinition = getRoomDefinition(waiting.roomDefinitionId)!;
  const anchors = getRoomWaitingAnchors(waiting, waitingDefinition);
  state.environment.founderLocation = anchors.at(-1)!;
  state.employees = options.occupiedChairIndex === undefined ? [] : [{
    id: "gs031.employee.occupant",
    staffRoleDefinitionId: "staff.medical_assistant",
    displayName: "Visible Seat Occupant",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 1,
    morale: 90,
    trainingLevel: 1,
    homeRoomInstanceId: waiting.id,
    location: { ...anchors[options.occupiedChairIndex]! },
    path: [{ ...anchors[options.occupiedChairIndex]! }],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  }];
  state.encounters = {};
  state.serviceOperations = [];
  state.retailOperations = [];
  state.retailExternalActors = [];
  const access = getFacilityAccessValidation(state);
  if (!access.valid) throw new Error(`Invalid seating fixture: ${JSON.stringify(access)}`);
  return state;
}

async function openFixture(page: Page, options: FixtureOptions = {}): Promise<void> {
  await startClinic(page, "GS031 Browser Founder", "GS031 Browser Seating");
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = fixture(JSON.parse(campaign.serializedState) as GameState, options);
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ profileKey, value }) => localStorage.setItem(profileKey, JSON.stringify(value)), {
    profileKey: PROFILE_KEY,
    value: profile,
  });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume GS031 Browser Seating" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
}

async function frontDeskTarget(page: Page, drawId: "desk" | "receptionist-chair") {
  return page.evaluate((targetDrawId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const item = [...scene.fixtureBitmapImages.entries()].find(([, image]: [string, any]) =>
      image.visible && image.getData("approved-draw-id") === targetDrawId,
    ) as [string, any] | undefined;
    if (!item) throw new Error(`Expected visible approved Front Desk ${targetDrawId}.`);
    const bounds = item[1].getBounds();
    const x = (bounds.left + bounds.right) / 2;
    const y = (bounds.top + bounds.bottom) / 2;
    const canvas = host.querySelector("canvas")!.getBoundingClientRect();
    return {
      drawId: targetDrawId,
      key: item[0],
      bounds,
      scenePoint: { x, y },
      pagePoint: {
        x: canvas.left + x * canvas.width / scene.scale.width,
        y: canvas.top + y * canvas.height / scene.scale.height,
      },
      hit: scene.frontDeskSeatInteractionAtPointer({ x, y }),
    };
  }, drawId);
}

async function waitingSeatTargets(page: Page) {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "gs031.waiting");
    const canvas = host.querySelector("canvas")!.getBoundingClientRect();
    return scene.bridge.viewModel.founderChairs
      .filter((chair: any) => chair.roomInstanceId === room.instanceId)
      .map((chair: any) => {
        const display = scene.getApprovedActorSupportDisplayPosition(chair.location, false, "waiting-seat");
        if (!display) throw new Error(`Missing approved support for ${JSON.stringify(chair.location)}.`);
        const fixtureId = display.supportId.split(":")[0];
        const painted = [...scene.fixtureBitmapImages.entries()].find(([key, image]: [string, any]) =>
          key.startsWith(`approved:${room.instanceId}:`) && image.visible &&
          image.getData("approved-draw-id")?.split(".").at(-1) === fixtureId,
        ) as [string, any] | undefined;
        if (!painted) throw new Error(`Missing painted fixture for ${display.supportId}.`);
        const bounds = painted[1].getBounds();
        const point = { x: display.centerX, y: display.baseY };
        return {
          location: chair.location,
          supportId: display.supportId,
          direction: display.direction,
          rightFacing: display.rightFacing,
          paintedKey: painted[0],
          paintedBounds: bounds,
          point,
          pointInsidePaintedBounds:
            point.x >= bounds.left && point.x <= bounds.right &&
            point.y >= bounds.top && point.y <= bounds.bottom,
          hit: scene.ordinaryChairAtPointer(point),
          pagePoint: {
            x: canvas.left + point.x * canvas.width / scene.scale.width,
            y: canvas.top + point.y * canvas.height / scene.scale.height,
          },
        };
      });
  });
}

async function hint(page: Page): Promise<string> {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return host.__facilityGame.scene.getScene("facility-scene").interactionHintText?.text ?? "";
  });
}

async function persistedState(page: Page): Promise<GameState> {
  return page.evaluate((profileKey) => {
    const profile = JSON.parse(localStorage.getItem(profileKey)!);
    const campaign = profile.campaigns.find((candidate: any) => candidate.campaignId === profile.activeCampaignId);
    return JSON.parse(campaign.serializedState);
  }, PROFILE_KEY);
}

async function renderedFounderLocation(page: Page): Promise<{ x: number; y: number }> {
  return page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.bridge.viewModel.founder.location;
  });
}

function seatReceipts(state: GameState) {
  return Object.values(state.operationReceipts ?? {}).filter((receipt) =>
    receipt.commandType === "SEAT_FOUNDER_IN_CHAIR",
  );
}

function frontDeskReceipts(state: GameState) {
  return Object.values(state.operationReceipts ?? {}).filter((receipt) =>
    receipt.commandType === "SEAT_FOUNDER_AT_FRONT_DESK",
  );
}

for (const drawId of ["desk", "receptionist-chair"] as const) {
  test(`painted Front Desk ${drawId} center shows the hint and applies the existing click`, async ({ page }, testInfo) => {
    const canvas = page.getByTestId("facility-canvas");
    await openFixture(page);
    const target = await frontDeskTarget(page, drawId);
    expect(target.hit).toBe(true);
    await page.mouse.move(target.pagePoint.x, target.pagePoint.y);
    await expect.poll(() => hint(page)).toBe("Sit here to check in patients");
    await canvas.screenshot({
      path: join(EVIDENCE, `${testInfo.project.name}-front-desk-${drawId}-hover.png`),
      animations: "disabled",
    });
    await page.mouse.click(target.pagePoint.x, target.pagePoint.y);
    await expect.poll(async () => {
      const receipts = Object.values((await persistedState(page)).operationReceipts ?? {});
      return receipts.at(-1)?.commandType;
    }).toBe("SEAT_FOUNDER_AT_FRONT_DESK");
    const state = await persistedState(page);
    const receipt = Object.values(state.operationReceipts ?? {}).at(-1);
    expect(receipt).toMatchObject({ commandType: "SEAT_FOUNDER_AT_FRONT_DESK", status: "applied" });
    writeFileSync(
      join(EVIDENCE, `${testInfo.project.name}-front-desk-${drawId}.json`),
      `${JSON.stringify({ target, receipt }, null, 2)}\n`,
    );
  });
}

const EXPECTED_SUPPORTS = {
  0: [
    { supportId: "bench:seat-1", location: { x: 29, y: 28 } },
    { supportId: "bench:seat-2", location: { x: 30, y: 28 } },
    { supportId: "leftChair:seat-1", location: { x: 28, y: 29 } },
    { supportId: "rightChair:seat-1", location: { x: 31, y: 29 } },
  ],
  270: [
    { supportId: "bench:seat-1", location: { x: 29, y: 30 } },
    { supportId: "bench:seat-2", location: { x: 29, y: 29 } },
    { supportId: "leftChair:seat-1", location: { x: 30, y: 31 } },
    { supportId: "rightChair:seat-1", location: { x: 30, y: 28 } },
  ],
} as const;

for (const orientation of [0, 270] as const) {
  test(`all four visible Waiting Room seat centers map and click correctly at ${orientation} degrees`, async ({ page }, testInfo) => {
    const canvas = page.getByTestId("facility-canvas");
    await openFixture(page, { orientation });
    const targets = await waitingSeatTargets(page);
    const exitTarget = await frontDeskTarget(page, "desk");
    expect(targets.map(({ supportId, location }) => ({ supportId, location }))).toEqual(EXPECTED_SUPPORTS[orientation]);
    expect(targets.every((target) => target.pointInsidePaintedBounds)).toBe(true);
    expect(targets.map((target) => target.hit)).toEqual(targets.map((target) => ({
      roomInstanceId: "gs031.waiting",
      location: target.location,
    })));

    const results: unknown[] = [];
    for (const target of targets) {
      await page.mouse.move(target.pagePoint.x, target.pagePoint.y);
      await expect.poll(() => hint(page)).toBe("SIT HERE");
      const before = seatReceipts(await persistedState(page)).length;
      await page.mouse.click(target.pagePoint.x, target.pagePoint.y);
      await expect.poll(async () => seatReceipts(await persistedState(page)).length).toBe(before + 1);
      const state = await persistedState(page);
      const receipt = seatReceipts(state).at(-1)!;
      expect(receipt.status).toBe("applied");
      expect(state.environment.founderActivity).toMatchObject({
        kind: "sit_in_chair",
        targetId: `gs031.waiting.${target.location.x}.${target.location.y}`,
        explicitSeat: true,
      });
      await expect.poll(async () => page.evaluate(() => {
        const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
        const founder = scene.bridge.viewModel.founder;
        const container = scene.characterBitmapContainers.get("character:founder");
        const actor = container?.getByName("actor");
        return {
          moving: founder.moving,
          seated: founder.seated,
          supportId: container?.getData("actor-support-id"),
          direction: actor?.getData("gait-direction"),
        };
      }), { timeout: 20_000 }).toMatchObject({
        moving: false,
        seated: true,
        supportId: target.supportId,
        direction: target.direction,
      });
      const beforeExit = frontDeskReceipts(await persistedState(page)).length;
      const capturesRoute = testInfo.project.name === "desktop-chrome" && ["bench:seat-1", "leftChair:seat-1"].includes(target.supportId);
      await page.getByRole("button", { name: capturesRoute ? "Set facility speed to 1x" : "Set facility speed to 4x" }).click();
      await page.mouse.click(exitTarget.pagePoint.x, exitTarget.pagePoint.y);
      await expect.poll(async () => frontDeskReceipts(await persistedState(page)).length).toBe(beforeExit + 1);
      const leavingState = await persistedState(page);
      const exitReceipt = frontDeskReceipts(leavingState).at(-1)!;
      expect(exitReceipt.status).toBe("applied");
      expect(leavingState.environment.founderActivity).toMatchObject({ kind: "return_to_front_desk" });
      const exitPath = leavingState.environment.founderActivity!.path;
      const exitDestination = exitPath.at(-1)!;
      expect(exitDestination).not.toEqual(target.location);
      if (capturesRoute) {
        await expect.poll(() => page.evaluate(() => {
          const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
          return scene.bridge.viewModel.founder.moving;
        })).toBe(true);
        await canvas.screenshot({
          path: join(EVIDENCE, `${testInfo.project.name}-waiting-${orientation}-${target.supportId.replace(":", "-")}-route-segment.png`),
          animations: "disabled",
        });
        await page.waitForTimeout(250);
        await canvas.screenshot({
          path: join(EVIDENCE, `${testInfo.project.name}-waiting-${orientation}-${target.supportId.replace(":", "-")}-door-boundary.png`),
          animations: "disabled",
        });
      }
      await expect.poll(() => renderedFounderLocation(page), { timeout: 20_000 }).toEqual(exitDestination);
      results.push({ target, receipt, exitReceipt, exitPath, exitDestination });
    }

    const beforeDrag = seatReceipts(await persistedState(page)).length;
    const dragTarget = targets[0]!;
    await page.mouse.move(dragTarget.pagePoint.x, dragTarget.pagePoint.y);
    await page.mouse.down();
    await page.mouse.move(dragTarget.pagePoint.x + 80, dragTarget.pagePoint.y + 40);
    await page.mouse.up();
    await page.waitForTimeout(150);
    expect(seatReceipts(await persistedState(page))).toHaveLength(beforeDrag);
    await canvas.screenshot({
      path: join(EVIDENCE, `${testInfo.project.name}-waiting-${orientation}-all-seats.png`),
      animations: "disabled",
    });
    writeFileSync(
      join(EVIDENCE, `${testInfo.project.name}-waiting-${orientation}-all-seats.json`),
      `${JSON.stringify(results, null, 2)}\n`,
    );
  });
}

test("a visible employee occupying a painted chair produces a rejected seat command and no click dispatch", async ({ page }, testInfo) => {
  await openFixture(page, { orientation: 0, occupiedChairIndex: 2 });
  const target = (await waitingSeatTargets(page))[2]!;
  const visibleOccupant = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const key = "character:staff:gs031.employee.occupant";
    return Boolean(scene.characterBitmapContainers.get(key)?.visible || scene.characterGraphics.get(key)?.visible);
  });
  expect(visibleOccupant).toBe(true);
  const accepted = await page.evaluate(({ location }) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.bridge.onSeatFounderInChair("gs031.waiting", location);
  }, target);
  expect(accepted).toBe(false);
  await expect.poll(async () => seatReceipts(await persistedState(page)).at(-1)?.status).toBe("rejected");
  const beforeClick = seatReceipts(await persistedState(page)).length;
  await page.mouse.click(target.pagePoint.x, target.pagePoint.y);
  await page.waitForTimeout(150);
  expect(seatReceipts(await persistedState(page))).toHaveLength(beforeClick);
  const receipt = seatReceipts(await persistedState(page)).at(-1);
  expect(receipt?.message).toBe("That chair is occupied or reserved.");
  await page.getByTestId("facility-canvas").screenshot({
    path: join(EVIDENCE, `${testInfo.project.name}-waiting-occupied-rejected.png`),
    animations: "disabled",
  });
  writeFileSync(
    join(EVIDENCE, `${testInfo.project.name}-waiting-occupied-rejected.json`),
    `${JSON.stringify({ target, visibleOccupant, accepted, receipt }, null, 2)}\n`,
  );
});
