import { expect, test, type Page } from "@playwright/test";
import { getRoomInstanceFootprint, type GameState, type PlacedRoom } from "@gamify-surgery/game-domain";
import { examDoor, examRoom, hallwaySaleClinic } from "../../packages/game-domain/tests/paused-command-outage-fixtures";
import type { FacilityCameraView, FacilityViewModel } from "../../apps/player/src/facility/types";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";
import { expectFacilityRenderer } from "./helpers";
import { readDurableLocalState } from "./ui-density-helpers";

type Point = { x: number; y: number };
type Room = FacilityViewModel["rooms"][number];
type SceneProof = {
  applyCamera(camera: FacilityCameraView): void;
  cameraView: FacilityCameraView;
  crispZoomPending: boolean;
  layout: { originX: number; originY: number; tileSize: number };
  scale: { width: number; height: number };
  lastWidth: number;
  lastHeight: number;
  bridge: { mobileInput?: boolean; viewModel: FacilityViewModel };
};
type ProofHost = HTMLElement & { __facilityGame?: { scene: { getScene(key: string): SceneProof | null } } };

const CLINIC_NAME = "Build Pan QA Clinic";
const ROOM_TILE = { x: 35.5, y: 18.5 };
const HALL_TILE = { x: 35.5, y: 19.5 };
const EXAM_TILE = { x: 35.5, y: 25.5 };
const DOOR_WALL = { x: 35.5, y: 26 };
const DRAG = { x: 53, y: -37 };
const roomId = (x: number, y: number) => `public.build-pan.exam.${x}.${y}`;
const hallId = (x: number, y: number) => `public.build-pan.hall.${x}.${y}`;
const CENTER_ROOM = roomId(34, 17);
const host = (page: Page) => page.getByTestId("facility-canvas");
const menu = (page: Page) => page.locator(".room-action-menu, .mobile-build-room");
const add = (p: Point, delta: Point): Point => ({ x: p.x + delta.x, y: p.y + delta.y });

function clinic(dense: boolean): GameState {
  const state = hallwaySaleClinic();
  state.campaignId = "public.build-mode-pan";
  if (!dense) return state;
  const placed = (id: string, roomDefinitionId: string, x: number, y: number): PlacedRoom =>
    ({ id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  for (const y of [14, 17, 20]) {
    for (const x of [30, 34, 38]) {
      const id = roomId(x, y);
      state.rooms.push(placed(id, "room.examination", x, y));
      state.doors.push({ id: `door.${id}`, roomId: id, side: "south", offset: 1, exterior: false });
    }
  }
  const occupied = new Set<string>();
  for (const room of state.rooms) {
    const size = getRoomInstanceFootprint(state, room.id);
    if (!size) throw new Error(`Missing fixture footprint for ${room.id}`);
    for (let dy = 0; dy < size.height; dy++) {
      for (let dx = 0; dx < size.width; dx++) occupied.add(`${room.x + dx},${room.y + dy}`);
    }
  }
  // Fill a contiguous wing adjoining the Front Desk's existing hallway.
  // The full-width desktop Build canvas sees columns 29 through 42 at this zoom.
  for (let y = 10; y < 28; y++) {
    for (let x = 29; x < 43; x++) {
      if (!occupied.has(`${x},${y}`)) state.rooms.push(placed(hallId(x, y), "room.hallway", x, y));
    }
  }
  return state;
}

test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page, baseURL }, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name), "Run the desktop and Pixel 7 input lanes.");
  const server = new URL(baseURL!);
  expect(server.hostname, "Use only the local fixture server").toBe("127.0.0.1");
  await page.route("**/*", route => new URL(route.request().url()).origin === server.origin
    ? route.continue() : route.abort());
});

async function readMap(page: Page) {
  return host(page).evaluate(node => {
    const scene = (node as ProofHost).__facilityGame?.scene.getScene("facility-scene");
    const canvas = node.querySelector("canvas");
    if (!scene?.layout.tileSize || !canvas) return null;
    const { left, top, width, height } = canvas.getBoundingClientRect();
    const { buildMode, buildDoorTool, selectedRoomInstanceId, rooms, founder } = scene.bridge.viewModel;
    return { ...scene.layout, zoom: scene.cameraView.zoom, bounds: { left, top, width, height },
      width: scene.scale.width, height: scene.scale.height,
      settled: !scene.crispZoomPending, phone: Boolean(scene.bridge.mobileInput),
      buildMode: Boolean(buildMode), buildDoorTool, selected: selectedRoomInstanceId ?? null, rooms,
      founder: { location: founder.location ?? null, path: founder.path ?? [] } };
  });
}
type MapView = NonNullable<Awaited<ReturnType<typeof readMap>>>;

async function openClinic(page: Page, phone: boolean, dense: boolean) {
  await openFreshLocalCampaign(page, clinic(dense), CLINIC_NAME, {
    url: `/?prototype-tools=0&facility-gait-proof=1&layout=${phone ? "phone" : "desktop"}`,
  });
  await expectFacilityRenderer(page);
  await expect.poll(async () => (await readMap(page))?.phone).toBe(phone);
}

async function enterBuild(page: Page, phone: boolean) {
  await page.getByRole("button", { name: phone ? "Build" : "Enter Build Mode", exact: true }).click();
  if (phone) await page.getByRole("button", { name: "Close Build", exact: true }).click();
  await expect.poll(async () => (await readMap(page))?.buildMode).toBe(true);
}

const nextPaint = (page: Page) => page.evaluate(() => new Promise<void>(resolve =>
  requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
));

/** Set up the visible part of the map using the repository's existing scene proof. */
async function frameTile(page: Page, tile: Point, zoom = 2.5): Promise<MapView> {
  await nextPaint(page);
  await host(page).evaluate((node, { target, zoom }) => {
    const scene = (node as ProofHost).__facilityGame!.scene.getScene("facility-scene")!;
    scene.applyCamera({ zoom, panX: 0, panY: 0 });
    const { originX, originY, tileSize } = scene.layout;
    scene.applyCamera({ zoom,
      panX: Math.round(scene.scale.width * 0.46 - originX - target.x * tileSize),
      panY: Math.round(scene.scale.height * 0.42 - originY - target.y * tileSize),
    });
  }, { target: tile, zoom });
  await expect.poll(async () => {
    const map = await readMap(page);
    return map?.settled ? map.zoom : null;
  }).toBe(zoom);
  return (await readMap(page))!;
}

function atTile(view: MapView, tile: Point): Point {
  const { bounds, width, height, originX, originY, tileSize } = view;
  return { x: Math.round(bounds.left + (originX + tile.x * tileSize) * bounds.width / width),
    y: Math.round(bounds.top + (originY + tile.y * tileSize) * bounds.height / height) };
}

function covers(room: Room, x: number, y: number) {
  return room.tileX <= x && x < room.tileX + room.width && room.tileY <= y && y < room.tileY + room.height;
}

function expectBuiltViewport(view: MapView, tile: Point, expectedId: string) {
  expect(view.rooms.filter(room => covers(room, tile.x, tile.y)).map(room => room.instanceId)).toEqual([expectedId]);
  const left = Math.floor(-view.originX / view.tileSize);
  const right = Math.ceil((view.width - view.originX) / view.tileSize);
  const top = Math.floor(-view.originY / view.tileSize);
  const bottom = Math.ceil((view.height - view.originY) / view.tileSize);
  const lawn: Point[] = [];
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) if (!view.rooms.some(room => covers(room, x, y))) lawn.push({ x, y });
  }
  expect(lawn, "visible tiles in the dense wing must all be rooms or hallways").toEqual([]);
}

async function expectCanvasPath(page: Page, path: Point[]) {
  const covered = await host(page).evaluate((node, points) => {
    const canvas = node.querySelector("canvas");
    return points.filter(({ x, y }) => !canvas || document.elementFromPoint(x, y) !== canvas);
  }, path);
  expect(covered, "map input must land on the exposed Phaser canvas").toEqual([]);
}

async function tap(page: Page, phone: boolean, point: Point) {
  await expectCanvasPath(page, [point]);
  if (phone) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
  await nextPaint(page);
}

async function drag(page: Page, phone: boolean, start: Point, points: Point[], observeFirstMove?: () => Promise<void>) {
  await expectCanvasPath(page, [start, ...points]);
  if (phone) {
    const cdp = await page.context().newCDPSession(page);
    try {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...start, id: 1 }] });
      for (const [index, point] of points.entries()) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...point, id: 1 }] });
        if (index === 0) await observeFirstMove?.();
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } finally {
      await cdp.detach();
    }
  } else {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    try {
      for (const [index, point] of points.entries()) {
        await page.mouse.move(point.x, point.y, { steps: 6 });
        if (index === 0) await observeFirstMove?.();
      }
    } finally {
      await page.mouse.up();
    }
  }
}

function expectPan(before: MapView, after: MapView, delta = DRAG) {
  // Match the whole-pixel tolerance of the existing splitter blank-space pan check.
  expect.soft((after.originX - before.originX) * before.bounds.width / before.width, "horizontal pan").toBeCloseTo(delta.x, 0);
  expect.soft((after.originY - before.originY) * before.bounds.height / before.height, "vertical pan").toBeCloseTo(delta.y, 0);
  expect(after.zoom).toBe(before.zoom);
}

async function waitForPhoneBuildViewport(page: Page) {
  await expect.poll(() => host(page).evaluate(node => {
    const scene = (node as ProofHost).__facilityGame?.scene.getScene("facility-scene");
    const workspace = node.closest(".mobile-workspace");
    const controls = workspace?.querySelector("[data-phone-build-controls]");
    const strip = node.closest(".mobile-shell")?.querySelector(".mobile-session-strip");
    if (!scene || scene.crispZoomPending || !workspace || !controls || !strip) return false;

    const map = node.getBoundingClientRect();
    const tray = controls.getBoundingClientRect();
    const session = strip.getBoundingClientRect();
    const workspaceBottom = workspace.getBoundingClientRect().bottom;
    const availableBottom = session.height > 0 ? Math.min(workspaceBottom, session.top) : workspaceBottom;
    // The tray moves first. React reserves its space, then Phaser reprojects the map.
    return Math.abs(tray.bottom - availableBottom) <= 1 && Math.abs(map.bottom - tray.top) <= 1 &&
      scene.scale.width === Math.floor(map.width) && scene.scale.height === Math.floor(map.height) &&
      scene.lastWidth === scene.scale.width && scene.lastHeight === scene.scale.height;
  }), { message: "phone Build tray, map viewport, and scene projection must settle" }).toBe(true);
}

async function expectSelection(page: Page, id: string | null) {
  await expect.poll(async () => (await readMap(page))?.selected).toBe(id);
  if (id === null) await expect(menu(page)).toBeHidden();
  else await expect(menu(page)).toBeVisible();
}

for (const { label, tile, id } of [
  { label: "a room interior", tile: ROOM_TILE, id: CENTER_ROOM },
  { label: "a hallway tile", tile: HALL_TILE, id: hallId(35, 19) },
]) {
  test(`Build pans from ${label} with the viewport fully built`, async ({ page, hasTouch: phone }) => {
    await openClinic(page, phone, true);
    await enterBuild(page, phone);
    const before = await frameTile(page, tile);
    expectBuiltViewport(before, tile, id);
    await expectSelection(page, null);
    const start = atTile(before, tile);
    await drag(page, phone, start, [add(start, DRAG)]);
    await nextPaint(page);
    expectPan(before, (await readMap(page))!);
    await expect.soft(menu(page)).toBeHidden();
    expect.soft((await readMap(page))!.selected).toBeNull();
  });
}

test("Build keeps a swipe that returns near the room start classified as a drag", async ({ page, hasTouch: phone }) => {
  if (phone) await page.clock.install();
  await openClinic(page, phone, true);
  await enterBuild(page, phone);
  const before = await frameTile(page, ROOM_TILE);
  expectBuiltViewport(before, ROOM_TILE, CENTER_ROOM);
  const start = atTile(before, ROOM_TILE);
  const returnOffset = { x: 2, y: 0 };
  // Keep the browser's simulated touch age fixed during the native CDP inputs.
  // This keeps the outcome independent of how long CI takes to deliver them.
  if (phone) await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 5_000);
  try {
    await drag(page, phone, start, [add(start, DRAG), add(start, returnOffset)], async () => {
      expectPan(before, (await readMap(page))!);
    });
  } finally {
    if (phone) await page.clock.resume();
  }
  await nextPaint(page);
  expectPan(before, (await readMap(page))!, returnOffset);
  await expect.soft(menu(page)).toBeHidden();
  expect.soft((await readMap(page))!.selected).toBeNull();
});

test("Build click selects the exact room and opens its menu", { tag: "@guard" }, async ({ page, hasTouch: phone }) => {
  await openClinic(page, phone, false);
  await enterBuild(page, phone);
  if (phone) await waitForPhoneBuildViewport(page);
  const before = await frameTile(page, EXAM_TILE, 1.5);
  await tap(page, phone, atTile(before, EXAM_TILE));
  await expectSelection(page, examRoom);
  const roomDialog = page.getByRole("dialog", { name: "Examination Room", exact: true });
  await expect(roomDialog).toBeVisible();
  if (!phone) {
    await expect(roomDialog).toHaveAttribute("data-room-instance-id", examRoom);
    expectPan(before, (await readMap(page))!, { x: 0, y: 0 });
  }
});

test("Build pans from the selected room without reopening its menu or changing selection", async ({ page, hasTouch: phone }) => {
  await openClinic(page, phone, true);
  await enterBuild(page, phone);
  if (phone) await waitForPhoneBuildViewport(page);
  const initial = await frameTile(page, ROOM_TILE);
  await tap(page, phone, atTile(initial, ROOM_TILE));
  await expectSelection(page, CENTER_ROOM);
  if (phone) await waitForPhoneBuildViewport(page);
  // The normal Close control leaves the selection while exposing the map.
  await page.getByRole("button", { name: phone ? /^Close Examination Room/ : "Close room menu" }).click();
  await expect(menu(page)).toBeHidden();
  if (phone) await waitForPhoneBuildViewport(page);
  const before = await frameTile(page, ROOM_TILE);
  expect(before.selected).toBe(CENTER_ROOM);
  expectBuiltViewport(before, ROOM_TILE, CENTER_ROOM);
  const start = atTile(before, ROOM_TILE);
  await drag(page, phone, start, [add(start, DRAG)]);
  await nextPaint(page);
  const after = (await readMap(page))!;
  expectPan(before, after);
  expect(after.selected).toBe(CENTER_ROOM);
  await expect(menu(page)).toBeHidden();
});

test("Build blank-space drag pans the same distance", { tag: "@guard" }, async ({ page, hasTouch: phone }) => {
  await openClinic(page, phone, false);
  await enterBuild(page, phone);
  const tile = { x: 29.5, y: 24.5 };
  const before = await frameTile(page, tile, 1.5);
  expect(before.rooms.some(room => covers(room, tile.x, tile.y))).toBe(false);
  const start = atTile(before, tile);
  await drag(page, phone, start, [add(start, DRAG)]);
  await nextPaint(page);
  expectPan(before, (await readMap(page))!);
  await expectSelection(page, null);
});

test("Build Doors still removes and adds an interior door from the map", { tag: "@guard" }, async ({ page, hasTouch: phone }) => {
  await openClinic(page, phone, false);
  await enterBuild(page, phone);
  if (phone) await page.getByRole("button", { name: "Room catalog", exact: true }).click();
  await page.getByRole("button", { name: phone ? /^Doors · \$0$/ : "Doors", exact: true }).click();
  await expect.poll(async () => (await readMap(page))?.buildDoorTool).toBe("place");
  const examDoors = async () => (await readDurableLocalState(page)).doors.filter(door => door.roomId === examRoom);
  expect(await examDoors()).toMatchObject([{ id: examDoor, side: "south", offset: 1, exterior: false }]);
  await tap(page, phone, atTile(await frameTile(page, DOOR_WALL, 1.5), DOOR_WALL));
  await expect.poll(examDoors).toEqual([]);
  await tap(page, phone, atTile(await frameTile(page, DOOR_WALL, 1.5), DOOR_WALL));
  await expect.poll(examDoors).toMatchObject([{ roomId: examRoom, side: "south", offset: 1, exterior: false }]);
  await expect(menu(page)).toBeHidden();
});

test("Play still pans from clinic floor without a Build selection or founder move", { tag: "@guard" }, async ({ page, hasTouch: phone }) => {
  await openClinic(page, phone, false);
  const before = await frameTile(page, EXAM_TILE, 1.5);
  expect(before.buildMode).toBe(false);
  const start = atTile(before, EXAM_TILE);
  await drag(page, phone, start, [add(start, DRAG)]);
  await nextPaint(page);
  const after = (await readMap(page))!;
  expectPan(before, after);
  expect(after.buildMode).toBe(false);
  expect(after.founder).toEqual(before.founder);
  await expectSelection(page, null);
});
