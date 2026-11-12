import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";
import { buildMapClickScenario } from "./fixtures/mapClickInfoScenario";

// Owner request (2026-10-07): click a character → info box above the head;
// a second click on an employee opens Praise; the founder can sit in free
// Waiting Room / Front Desk / Break Room seats; an occupied seat shows
// "Seat occupied"; waiting patients take free chairs instead of standing.
// Run against a separate server, never the owner's 4173 origin, e.g.
// GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5183

const OUT = process.env.MAP_CLICK_OUT ?? "artifacts/screenshots/map-click-info";

const scene = (page: Page) => page.evaluate(() =>
  Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));

/** Canvas-relative point → page point. */
async function pagePoint(page: Page, point: { x: number; y: number }) {
  return page.evaluate((point) => {
    const canvas = document.querySelector("[data-testid='facility-canvas'] canvas")!;
    const host = canvas.parentElement as any, rect = canvas.getBoundingClientRect();
    const scale = host.__facilityGame.scale;
    return { x: rect.x + point.x * rect.width / scale.width, y: rect.y + point.y * rect.height / scale.height };
  }, point);
}

async function characterPoint(page: Page, key: string) {
  const tile = await page.evaluate((characterKey) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const view = facility.bridge.viewModel;
    const [, kind, id] = /^character:([^:]+):?(.*)$/.exec(characterKey)!;
    const actor = kind === "founder" ? view.founder
      : kind === "staff" ? view.staff.find((candidate: any) => candidate.instanceId === id)
        : view.patients.find((candidate: any) => candidate.instanceId === id);
    return actor?.location ?? null;
  }, key);
  if (tile) await centerOn(page, tile.x + 0.5, tile.y + 0.5, 1.6);
  const point = await page.evaluate((characterKey) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const actor = facility.characterBitmapContainers.get(characterKey)?.getByName("actor");
    if (!actor?.visible) return null;
    const bounds = actor.getBounds();
    return facility.worldToScreen({ x: bounds.centerX, y: bounds.top + bounds.height * 0.55 });
  }, key);
  expect(point, `character ${key} is rendered`).not.toBeNull();
  return pagePoint(page, point!);
}

async function inspectState(page: Page) {
  return page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return { visible: Boolean(facility.inspectText?.visible), text: String(facility.inspectText?.text ?? "") };
  });
}

async function centerOn(page: Page, tileX: number, tileY: number, zoom: number) {
  await page.evaluate(({ tileX, tileY, zoom }) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    facility.applyCamera({ ...facility.cameraView, zoom, panX: 0, panY: 0 });
    facility.refreshLayout(true);
    const layout = facility.layout;
    facility.applyCamera({
      ...facility.cameraView,
      panX: facility.scale.width / 2 - (layout.originX + tileX * layout.tileSize),
      panY: facility.scale.height / 2 - (layout.originY + tileY * layout.tileSize),
    });
    facility.refreshLayout(true);
  }, { tileX, tileY, zoom });
  await expect.poll(() => page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return !facility.crispZoomPending && facility.cameras.main.zoom === 1;
  })).toBe(true);
}

async function snap(page: Page, name: string) {
  const box = (await page.getByTestId("facility-canvas").boundingBox())!;
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: box });
}

test("map click info boxes, founder seats and re-seating", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop capture set.");
  test.setTimeout(240_000);
  mkdirSync(OUT, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const base = createInitialGameState();
  base.campaignId = "campaign.map-click-round2";
  const scenario = buildMapClickScenario(base);
  expect(scenario.breakRoomId).not.toBeNull();
  await openFreshLocalCampaign(page, scenario.state, "Map Click QA");
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility:hidden !important; }" });
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect.poll(() => scene(page), { timeout: 20_000 }).toBe(true);
  await expect.poll(() => page.evaluate((ids) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return ids.every(id => facility.bridge.viewModel.patients.some((patient: any) => patient.instanceId === id));
  }, [scenario.standingId, scenario.hallwayId]), { timeout: 20_000 }).toBe(true);
  await centerOn(page, 37, 26, 1.6);

  // 1. Re-seating: run time; the standing and hallway patients both reach chairs
  //    (new staff also walk in from the street meanwhile).
  await page.getByRole("button", { name: "Resume facility time" }).click();
  // Each patient only has to be seen seated once: later they may wander off
  // to the bathroom or the coffee kiosk in live time.
  await expect.poll(() => page.evaluate((ids) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const seen = ((window as any).__qaSeenSeated ??= {}) as Record<string, boolean>;
    for (const patient of facility.bridge.viewModel.patients) if (patient.seated) seen[patient.instanceId] = true;
    return ids.every((id: string) => seen[id]);
  }, [scenario.standingId, scenario.hallwayId]), { timeout: 90_000, intervals: [250] }).toBe(true);
  await expect.poll(() => page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const receptionist = facility.bridge.viewModel.staff.find((member: any) => member.instanceId === "employee.qa.staff.receptionist");
    return Boolean(receptionist?.location && receptionist.location.x > 30 && receptionist.location.y < 40);
  }), { timeout: 60_000 }).toBe(true);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await centerOn(page, 38, 25, 1.6);
  await snap(page, "01-everyone-seated");

  // 2. Click a seated patient → name + activity above their head.
  const seatedKey = `character:patient:${scenario.seatedIds[0]}`;
  await page.mouse.click(...Object.values(await characterPoint(page, seatedKey)) as [number, number]);
  await expect.poll(async () => (await inspectState(page)).visible).toBe(true);
  // Time has run, so the patient may be seated or off to the bathroom/kiosk.
  expect((await inspectState(page)).text).toMatch(/· Patient\n(Waiting for clinician|Walking .+|In the bathroom|In line .+|Getting coffee|Buying .+)$/);
  await snap(page, "02-patient-info-box");

  // 3. Employee: first click shows the box, second click opens Praise.
  const staffKey = "character:staff:employee.qa.staff.receptionist";
  const staffPoint = await characterPoint(page, staffKey);
  await page.mouse.click(staffPoint.x, staffPoint.y);
  // Both new hires walk in together; whoever is in front gets the box.
  await expect.poll(async () => (await inspectState(page)).text).toMatch(/· (Receptionist|EVS Worker)\n/);
  await expect(page.getByRole("dialog", { name: /Interact with/ })).toHaveCount(0);
  await snap(page, "03-employee-info-box");
  await page.mouse.click(staffPoint.x, staffPoint.y);
  await expect(page.getByLabel(/Interact with/)).toBeVisible();
  await snap(page, "04-employee-praise-after-second-click");
  await page.keyboard.press("Escape");
  await page.getByLabel(/Interact with/).getByRole("button", { name: /cancel|close|not now/i }).first().click({ timeout: 2_000 }).catch(() => undefined);

  // 4. A seat that is taken → "Seat occupied" (called through the seat flow
  //    because a seated person covers most of their chair).
  const occupied = await page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const chair = facility.bridge.viewModel.founderChairs.find((candidate: any) => candidate.kind === "waiting" && candidate.occupied);
    facility.showSeatBox(chair, "Seat occupied");
    return Boolean(chair);
  });
  expect(occupied).toBe(true);
  await page.waitForTimeout(100);
  expect((await inspectState(page)).text).toBe("Seat occupied");
  await snap(page, "05-seat-occupied");

  // 5. Founder sits in the patient-side Front Desk chair (real click on it).
  const deskChair = await page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const chair = facility.bridge.viewModel.founderChairs.find((candidate: any) => candidate.kind === "front_desk_public");
    const point = facility.worldToScreen(facility.founderSeatScreenPoint(chair));
    return { x: point.x, y: point.y - facility.layout.tileSize * 0.25 };
  });
  await centerOn(page, 37, 30, 1.6);
  const deskChairNow = await page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const chair = facility.bridge.viewModel.founderChairs.find((candidate: any) => candidate.kind === "front_desk_public");
    const point = facility.worldToScreen(facility.founderSeatScreenPoint(chair));
    return { x: point.x, y: point.y - facility.layout.tileSize * 0.25 };
  });
  expect(deskChair).toBeTruthy();
  const deskTarget = await pagePoint(page, deskChairNow);
  await page.mouse.click(deskTarget.x, deskTarget.y);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(() => page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return facility.bridge.viewModel.founder.supportRole;
  }), { timeout: 60_000 }).toBe("front-desk-public");
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await page.waitForTimeout(400);
  await snap(page, "06-founder-front-desk-public-chair");

  // 6. Founder sits in a Break Room seat.
  const breakSeat = await page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    // An employee on break may already sit in one; pick a free seat.
    const free = facility.bridge.viewModel.founderChairs.filter((candidate: any) => candidate.kind === "break" && !candidate.occupied);
    return free.find((candidate: any) => candidate.seatId === "largeNorth") ?? free[0];
  });
  await centerOn(page, breakSeat.location.x, breakSeat.location.y, 1.6);
  const breakPoint = await page.evaluate((seat) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const point = facility.worldToScreen(facility.founderSeatScreenPoint(seat));
    return { x: point.x, y: point.y - facility.layout.tileSize * 0.2 };
  }, breakSeat);
  const breakTarget = await pagePoint(page, breakPoint);
  await page.mouse.move(breakTarget.x, breakTarget.y);
  await page.mouse.click(breakTarget.x, breakTarget.y);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(() => page.evaluate(() => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return [facility.bridge.viewModel.founder.supportRole, facility.bridge.viewModel.founder.moving].join(":");
  }), { timeout: 90_000 }).toBe("staff-break-seat:false");
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await page.waitForTimeout(400);
  const founderPoint = await characterPoint(page, "character:founder");
  await page.mouse.click(founderPoint.x, founderPoint.y);
  await expect.poll(async () => (await inspectState(page)).text).toContain("Taking a break");
  await snap(page, "07-founder-break-seat-info");

  // 7. The box stays readable when zoomed out (the owner's usual view).
  const zoomedKey = `character:patient:${scenario.seatedIds[2]}`;
  await characterPoint(page, zoomedKey);
  await centerOn(page, 37, 26, 0.5);
  const zoomedPoint = await page.evaluate((characterKey) => {
    const facility = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const bounds = facility.characterBitmapContainers.get(characterKey).getByName("actor").getBounds();
    return facility.worldToScreen({ x: bounds.centerX, y: bounds.top + bounds.height * 0.55 });
  }, zoomedKey);
  const zoomedTarget = await pagePoint(page, zoomedPoint);
  await page.mouse.click(zoomedTarget.x, zoomedTarget.y);
  await expect.poll(async () => (await inspectState(page)).visible).toBe(true);
  await snap(page, "08-zoomed-out-50");

  expect(errors).toEqual([]);
});
