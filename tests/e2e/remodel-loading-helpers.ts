import { expect, type BrowserContext, type Page } from "@playwright/test";
import {
  createInitialGameState, gameReducer, getCurrentCapabilities, getFacilityAccessValidation, getRoomDefinition,
  getRoomNavigationAnchor, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CloudSyncError, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { createAppAppointmentsQaState } from "../fixtures/app-appointments";
import { createLevelFourRoomsQaState } from "../fixtures/level-four-rooms";
import { createMriAppointmentsQaState } from "../fixtures/mri-appointments";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";
import { readDurableLocalState } from "./ui-density-helpers";
import { expectAccountSaved, openAndContinue, snapshot } from "./cloud-qa-helpers";

// Blind tests: only public synthetic fixtures, existing QA bridges and renderer
// observations. No remodel/loading implementation imports or private saves.
export const ROOM_A = "room.app.0";
export const ROOM_B = "room.app.1";
export const OCCUPANT = "encounter.blind-remodel.waiting";
export const CLINIC_NAME = "Synthetic blind remodel clinic";
export type Layout = "desktop" | "phone";
export type Point = { x: number; y: number };

export function idleRemodelFixture(): GameState {
  const state = createAppAppointmentsQaState();
  state.campaignId = "campaign.synthetic.blind-remodel";
  state.serviceAppointmentsEnabled = false;
  state.nextServiceAppointmentTicks = {};
  state.serviceOperations = [];
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  const rooms = [ROOM_A, ROOM_B].map(id => state.rooms.find(room => room.id === id)!);
  if (state.employees.length !== 2 || rooms.some(room => !room)) throw new Error("APP fixture must supply two staffed examination rooms.");
  for (const [index, employee] of state.employees.entries()) {
    const room = rooms[index]!;
    employee.homeRoomInstanceId = room.id;
    employee.location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
    employee.path = [];
    employee.pathIndex = 0;
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  // Retain the initializer's frozen clinical content unchanged. This is a
  // checked-in waiting occupant, with no visit, pending test or procedure.
  const template = Object.values(createInitialGameState().encounters)[0];
  if (!template) throw new Error("The synthetic initializer must supply a frozen encounter.");
  const room = rooms[0]!;
  const patient = structuredClone(template);
  Object.assign(patient, { id: OCCUPANT, patientDisplayName: "Synthetic Remodel Occupant",
    lifecycle: "waiting_unopened", checkInStatus: "checked_in", checkInWaitingSinceTick: null,
    assignedRoomInstanceId: room.id, patientLocation: { x: room.x + 1, y: room.y + 1 },
    patientMovement: null, pendingResult: null, firstOpenedAtTick: null });
  state.encounters = { [patient.id]: patient };
  const access = getFacilityAccessValidation(state);
  if (!access.valid) throw new Error(`Synthetic remodel fixture access: ${access.issues.join("; ")}`);
  return state;
}

/** Earn active reservations through the ordinary reducer, rather than marking
 * an idle room busy in a view model. No new clinical facts are authored here. */
function procedureRemodelFixture(): GameState {
  // Keep Node-side setup on the same pure room QA fixture already loaded by
  // app-appointments. diagnostic-workload imports Node fs through import.meta
  // and cannot be loaded by Playwright's CommonJS test collector or by Vite's
  // browser module graph. No saved history is needed for an active reservation.
  let state = createLevelFourRoomsQaState();
  const apply = (command: GameCommand) => {
    state = gameReducer(state, command);
    const receipt = state.operationReceipts[command.operationId];
    if (receipt?.status !== "applied") throw new Error(`Procedure remodel fixture ${command.operationId}: ${receipt?.message}`);
  };
  let x = 25;
  let nextHallX = 42;
  // Real placement receipts require Examination before recovery, then recovery
  // before the OR; a surgeon also needs a Surgeon Office before hiring. Extend
  // the QA corridor for the complete chain, using ordinary construction costs.
  for (const definitionId of ["room.examination", "room.periop_recovery", "room.ambulatory_or", "room.surgeon_office"]) {
    const definition = getRoomDefinition(definitionId)!;
    const roomId = `room.blind-remodel.${definitionId}`;
    while (nextHallX < x + definition.width) {
      apply({ type: "PLACE_ROOM", operationId: `blind.procedure.hall.${nextHallX}`,
        roomDefinitionId: "room.hallway", roomId: `room.blind-remodel.hall.${nextHallX}`,
        x: nextHallX, y: 26, orientation: 0 });
      nextHallX++;
    }
    apply({ type: "PLACE_ROOM", operationId: `blind.procedure.place.${definitionId}`,
      roomDefinitionId: definitionId, roomId, x, y: 26 - definition.height, orientation: 0 });
    apply({ type: "PLACE_DOOR", operationId: `blind.procedure.door.${definitionId}`,
      doorId: `door.${roomId}`, roomId, side: "south", offset: 1 });
    x += definition.width + 1;
  }
  for (const role of ["staff.or_nurse", "staff.surgeon", "staff.periop_nurse"]) {
    apply({ type: "HIRE_STAFF", operationId: `blind.procedure.hire.${role}`,
      employeeId: `employee.blind-remodel.${role}`, staffRoleDefinitionId: role });
  }
  // A paid hire is not yet an onsite capability. Earn staff arrival through the
  // real movement/tick path before requesting an operation that needs an OR
  // nurse; do not fabricate employee locations or resource reservations.
  apply({ type: "SET_PAUSED", paused: false, operationId: "blind.procedure.staff-arrival.play" });
  for (let tick = 0; tick < 1_200 && !getCurrentCapabilities(state).has("capability.staff.or_nurse"); tick++) {
    apply({ type: "ADVANCE_TICK", operationId: `blind.procedure.staff-arrival.${tick}`,
      advancedAtRealMs: 1_800_000_000_000 + tick * 1_000 });
  }
  if (!getCurrentCapabilities(state).has("capability.staff.or_nurse")) throw new Error("Procedure remodel fixture: hired OR nurse did not arrive.");
  apply({ type: "SET_PAUSED", paused: true, operationId: "blind.procedure.staff-arrival.pause" });
  return state;
}

export function activeWorkFixture(kind: "visit" | "test" | "procedure") {
  let state = kind === "visit" ? createAppAppointmentsQaState() : kind === "test" ? createMriAppointmentsQaState() : procedureRemodelFixture();
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: `blind.${kind}.play` });
  const income = kind === "visit" ? "income.app_consult" : kind === "test" ? "income.mri" : "income.ambulatory_operation";
  const definition = kind === "visit" ? "room.examination" : kind === "test" ? "room.mri" : "room.ambulatory_or";
  if (kind === "procedure") {
    const operationId = "blind.procedure.start";
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId, incomeLineId: income, actorKind: "visitor" });
    if (state.operationReceipts[operationId]?.status !== "applied") throw new Error(`Procedure remodel start: ${state.operationReceipts[operationId]?.message}`);
  }
  for (let tick = 0; tick < 1_200; tick++) {
    const work = state.serviceOperations.find(operation => operation.incomeLineId === income &&
      operation.phaseEndsAtFacilityTick !== null && operation.phaseEndsAtFacilityTick > state.facilityTick &&
      operation.reservedRoomInstanceIds.some(id => state.rooms.some(room => room.id === id && room.roomDefinitionId === definition)));
    if (work) {
      const roomId = work.reservedRoomInstanceIds.find(id => state.rooms.some(room => room.id === id && room.roomDefinitionId === definition))!;
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `blind.${kind}.pause` });
      return { state, roomId, workId: work.id };
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `blind.${kind}.tick.${tick}`,
      advancedAtRealMs: 1_800_000_000_000 + tick * 1_000 });
  }
  throw new Error(`Synthetic ${kind} fixture did not earn active work: ${JSON.stringify(state.serviceOperations.map(op => ({ id: op.id, status: op.status, phase: op.phaseIndex })))}`);
}

export async function openRemodelClinic(page: Page, layout: Layout, state = idleRemodelFixture()) {
  await page.addInitScript(value => localStorage.setItem("gamify-surgery.presentation-layout.v1", value), layout);
  await openFreshLocalCampaign(page, state, CLINIC_NAME);
  const chart = page.locator(layout === "phone" ? '.mobile-sheet[aria-label="Patient chart"]' : ".chart-sheet");
  if (await chart.isVisible()) {
    if (layout === "phone") await chart.getByRole("button", { name: "Close Patient chart", exact: true }).click();
    else await page.keyboard.press("Escape");
  }
  await page.waitForFunction(() => Boolean((document.querySelector('[data-testid="facility-canvas"]') as any)?.__facilityGame?.scene?.getScene("facility-scene")?.bridge?.viewModel));
  return readDurableLocalState(page);
}

export async function enterBuild(page: Page, layout: Layout) {
  await page.getByRole("button", { name: layout === "phone" ? "Build" : "Enter Build Mode", exact: true }).click();
  await expect(page.locator(layout === "phone" ? ".mobile-build-controls" : ".build-mode-panel")).toBeVisible();
}

export async function leaveBuild(page: Page, layout: Layout) {
  if (layout === "phone") {
    const closeCatalog = page.getByRole("button", { name: "Close Build", exact: true });
    if (await closeCatalog.isVisible()) await closeCatalog.click();
  }
  await page.getByRole("button", { name: layout === "phone" ? "Done" : "Done / Save", exact: true }).click();
  await expect(page.locator(layout === "phone" ? ".mobile-build-controls" : ".build-mode-panel")).toBeHidden();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
}

export async function reenterBuild(page: Page, layout: Layout) {
  await enterBuild(page, layout);
  await leaveBuild(page, layout);
  await enterBuild(page, layout);
}

export async function roomMenu(page: Page, layout: Layout, roomId: string) {
  if (layout === "phone") {
    const catalog = page.getByRole("button", { name: "Room catalog", exact: true });
    if (!await page.getByRole("tab", { name: "My Rooms", exact: true }).isVisible()) await catalog.click();
    await page.getByRole("tab", { name: "My Rooms", exact: true }).click();
    await page.locator(`[data-build-owned-room="${roomId}"]`).click();
  } else {
    await page.getByRole("tab", { name: /^My Rooms/ }).click();
    // Multiple instances have rendered A/B names. Select the room's main
    // button by stable row identity, excluding the separate upgrade action.
    const row = page.locator(`.build-owned-row[data-room-instance-id="${roomId}"]`);
    await row.getByRole("button").filter({ hasNotText: /^Upgrade\b/ }).click();
  }
  const menu = page.locator(layout === "phone" ? ".mobile-build-room" : ".room-action-menu");
  await expect(menu).toBeVisible();
  return menu;
}

export async function clickTile(page: Page, target: Point) {
  const point = await page.evaluate(location => {
    const host = document.querySelector('[data-testid="facility-canvas"]') as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const canvas = host.querySelector("canvas") as HTMLCanvasElement;
    const bounds = canvas.getBoundingClientRect();
    const candidates = [[0.5, 0.4], [0.5, 0.65], [0.3, 0.5], [0.7, 0.5], [0.5, 0.25], [0.3, 0.7]];
    const exposed = candidates.find(([x, y]) => document.elementFromPoint(bounds.left + bounds.width * x!, bounds.top + bounds.height * y!) === canvas);
    if (!exposed) throw new Error("No uncovered canvas target: close the ordinary navigation sheet before placing a room.");
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    let layout = scene.layout;
    // Frame a real uncovered hit target, allowing phone controls and the pause
    // label to keep their ordinary layout. No CSS/overlay is suppressed.
    const worldX = layout.originX + location.x * layout.tileSize;
    const worldY = layout.originY + location.y * layout.tileSize;
    scene.applyCamera({ ...scene.cameraView,
      panX: scene.scale.width * exposed[0]! - worldX, panY: scene.scale.height * exposed[1]! - worldY });
    scene.refreshLayout(true);
    layout = scene.layout;
    return { x: (layout.originX + location.x * layout.tileSize) * bounds.width / scene.scale.width,
      y: (layout.originY + location.y * layout.tileSize) * bounds.height / scene.scale.height };
  }, target);
  const canvas = page.getByTestId("facility-canvas").locator("canvas");
  if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await canvas.tap({ position: point });
  else await canvas.click({ position: point });
}

async function dragPhoneRoom(page: Page, roomId: string, target: Point) {
  const room = roomAt(await readDurableLocalState(page), roomId);
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const from = { x: room.x + definition.width / 2, y: room.y + definition.height / 2 };
  const to = { x: target.x + definition.width / 2, y: target.y + definition.height / 2 };
  // Center the complete drag on the real canvas. This is presentation-only
  // framing; all ghost movement goes through Chromium's native touch input.
  await page.evaluate(({ from, to }) => {
    const host = document.querySelector('[data-testid="facility-canvas"]') as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const layout = scene.layout;
    scene.applyCamera({ ...scene.cameraView,
      panX: scene.scale.width / 2 - (layout.originX + (from.x + to.x) / 2 * layout.tileSize),
      panY: scene.scale.height * 0.4 - (layout.originY + (from.y + to.y) / 2 * layout.tileSize) });
    scene.refreshLayout(true);
  }, { from, to });
  // Move selection and control sizing can still change the camera on the next
  // frame. Read actual layout/viewport coordinates after those frames, not the
  // transient coordinates returned immediately after applyCamera.
  await animationFrames(page, 3);
  const points = await page.evaluate(({ from, to }) => {
    const host = document.querySelector('[data-testid="facility-canvas"]') as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const canvas = host.querySelector("canvas") as HTMLCanvasElement;
    const bounds = canvas.getBoundingClientRect(), layout = scene.layout;
    const project = (tile: Point) => ({
      x: bounds.left + (layout.originX + tile.x * layout.tileSize) * bounds.width / scene.scale.width,
      y: bounds.top + (layout.originY + tile.y * layout.tileSize) * bounds.height / scene.scale.height,
    });
    const start = project(from), end = project(to);
    for (const [name, point] of [["start", start], ["end", end]] as const) {
      if (document.elementFromPoint(point.x, point.y) !== canvas) throw new Error(`Phone room drag ${name} is not on uncovered canvas: ${JSON.stringify({ from, to, start, end })}`);
    }
    return { start, end, from, to, tileSize: layout.tileSize, origin: { x: layout.originX, y: layout.originY } };
  }, { from, to });
  const touch = await page.context().newCDPSession(page);
  try {
    const point = (x: number, y: number) => ({ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 });
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(points.start.x, points.start.y)] });
    for (let step = 1; step <= 12; step++) {
      await animationFrames(page, 1);
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(
        points.start.x + (points.end.x - points.start.x) * step / 12,
        points.start.y + (points.end.y - points.start.y) * step / 12,
      )] });
    }
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await animationFrames(page, 2);
  } finally { await touch.detach(); }
}

export async function placeMove(page: Page, layout: Layout, target: Point, staged = false, roomId?: string) {
  if (layout === "phone") {
    if (!roomId) throw new Error("Phone room movement requires the selected room identity for the drag's starting position.");
    await dragPhoneRoom(page, roomId, target);
    const confirm = page.locator('[data-phone-build-confirm="placement"]');
    await expect(confirm).toBeEnabled();
    await expect(confirm).toContainText(staged ? "Stage move" : "Move");
    await expect(confirm).toContainText("$0");
    await confirm.click();
  } else await clickTile(page, { x: target.x + 0.25, y: target.y + 0.25 });
}

export async function beginBlueprint(page: Page, layout: Layout) {
  // The phone presents another Blueprint button behind the Build catalog.
  // Use the visible catalog action, whose handler also dismisses the sheet.
  const surface = layout === "phone" ? page.getByRole("dialog", { name: "Build", exact: true }) : page.getByRole("region", { name: "Construction desk", exact: true });
  if (layout === "phone" && !await surface.isVisible()) await page.getByRole("button", { name: "Room catalog", exact: true }).click();
  await surface.getByRole("button", { name: "Blueprint remodel", exact: true }).click();
  await expect(page.getByRole("region", { name: "Blueprint remodel", exact: true })).toBeVisible();
}

export async function stageMove(page: Page, layout: Layout, roomId: string, target: Point) {
  await page.getByRole("combobox", { name: "Room to remodel", exact: true }).selectOption(roomId);
  await placeMove(page, layout, target, true, roomId);
}

/** Full simulation projection except receipt bookkeeping. Staging/cancel may
 * not mutate rooms, actors, clock, money, clinical history, events or work. */
export function world(state: GameState) {
  const { operationReceipts: _receipts, ...simulation } = state;
  return simulation;
}

export function roomAt(state: GameState, roomId: string) {
  const room = state.rooms.find(candidate => candidate.id === roomId);
  expect(room, `Stable room identity ${roomId}`).toBeDefined();
  return room!;
}

export async function reloadRemodelClinic(page: Page) {
  await page.reload();
  const canvas = page.getByTestId("facility-canvas");
  const loading = page.getByRole("region", { name: "Loading clinic", exact: true });
  const resume = page.getByRole("button", { name: `Resume ${CLINIC_NAME}`, exact: true });
  const ready = async () => await canvas.isVisible() && !await loading.isVisible();
  // Reload can automatically open the campaign while a disabled Resume is
  // briefly mounted. Never bind an unbounded click to that departing chooser.
  await expect(async () => {
    if (await ready()) return;
    if (await resume.isVisible() && await resume.isEnabled()) await resume.click({ timeout: 1_000 });
    expect(await ready()).toBe(true);
  }).toPass({ timeout: 100_000 });
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loaded");
  return readDurableLocalState(page);
}

export async function furniture(page: Page, roomId: string) {
  return page.evaluate(id => {
    const scene = (document.querySelector('[data-testid="facility-canvas"]') as any).__facilityGame.scene.getScene("facility-scene");
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === id);
    const layout = scene.layout;
    return [...scene.fixtureBitmapImages.entries() as Iterable<[string, any]>]
      .filter(([key, image]) => key.startsWith(`approved:${id}:`) && image.active && image.visible)
      .map(([key, image]) => ({ key, texture: image.texture.key, frame: image.frame.name,
        x: Number(((image.x - layout.originX) / layout.tileSize - room.tileX).toFixed(4)),
        y: Number(((image.y - layout.originY) / layout.tileSize - room.tileY).toFixed(4)) }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, roomId);
}

/** Catch transient refusal/confirmation/wait UI too, not just the final frame.
 * The already-open room navigation sheet is allowed; a new modal is not. */
export async function recordMoveFeedback(page: Page, pattern: RegExp) {
  await page.evaluate(({ source, flags }) => {
    const visible = (node: Element) => {
      const r = node.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth) return false;
      for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
        const css = getComputedStyle(ancestor);
        if (css.display === "none" || css.visibility === "hidden" || Number(css.opacity) === 0) return false;
      }
      return true;
    };
    const modalSelector = '[role="dialog"][aria-modal="true"], [role="alertdialog"]';
    const existing = new Set([...document.querySelectorAll(modalSelector)].filter(visible));
    const existingProgress = new Set([...document.querySelectorAll('[role="progressbar"]')].filter(visible));
    const messages = new Set<string>();
    const refusal = new RegExp(source, flags);
    let stopped = false;
    const sample = () => {
      for (const node of document.querySelectorAll(modalSelector)) if (visible(node) && !existing.has(node)) messages.add(`Unexpected modal: ${node.textContent?.trim()}`);
      for (const node of document.querySelectorAll('[role="alert"][aria-label="Action feedback"], .room-action-menu p, .mobile-build-room p')) {
        if (visible(node) && refusal.test(node.textContent ?? "")) messages.add(node.textContent!.trim());
      }
      for (const node of document.querySelectorAll('[role="progressbar"]')) if (visible(node) && !existingProgress.has(node)) messages.add(`Unexpected wait/progress: ${node.getAttribute("aria-label")}`);
    };
    const observer = new MutationObserver(sample);
    observer.observe(document, { childList: true, attributes: true, characterData: true, subtree: true });
    const frame = () => { if (!stopped) { sample(); requestAnimationFrame(frame); } };
    (window as typeof window & { __blindMoveFeedback?: { stop(): string[] } }).__blindMoveFeedback = {
      stop() { sample(); stopped = true; observer.disconnect(); return [...messages]; },
    };
    sample(); requestAnimationFrame(frame);
  }, { source: pattern.source, flags: pattern.flags });
}

export async function finishMoveFeedback(page: Page) {
  return page.evaluate(() => (window as typeof window & { __blindMoveFeedback: { stop(): string[] } }).__blindMoveFeedback.stop());
}

export async function recordRoomCommits(page: Page) {
  await page.evaluate(({ a, b }) => {
    const target = window as typeof window & { __blindRoomCommits?: { samples: Array<Array<{ id: string; x: number; y: number }>>; stop(): void } };
    const samples: Array<Array<{ id: string; x: number; y: number }>> = [];
    let stopped = false;
    const sample = () => {
      const scene = (document.querySelector('[data-testid="facility-canvas"]') as any)?.__facilityGame?.scene?.getScene("facility-scene");
      if (scene?.bridge?.viewModel) samples.push([a, b].map(id => {
        const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === id);
        return { id, x: room?.tileX ?? -1, y: room?.tileY ?? -1 };
      }));
    };
    const observer = new MutationObserver(sample);
    observer.observe(document, { subtree: true, childList: true, attributes: true });
    const frame = () => { if (!stopped) { sample(); requestAnimationFrame(frame); } };
    target.__blindRoomCommits = { samples, stop() { sample(); stopped = true; observer.disconnect(); } };
    sample(); requestAnimationFrame(frame);
  }, { a: ROOM_A, b: ROOM_B });
}

export async function finishRoomCommits(page: Page) {
  return page.evaluate(() => {
    const recorder = (window as typeof window & { __blindRoomCommits: { samples: Array<Array<{ id: string; x: number; y: number }>>; stop(): void } }).__blindRoomCommits;
    recorder.stop(); return recorder.samples;
  });
}

/** Same disposable transport wiring as cloud-recovery.spec.ts. All RPC calls
 * terminate in-process; the actual app still uses its real codec/cache/journal,
 * coordinator, operational engine worker and desktop/phone renderer. */
export async function returningCloudRig(context: BrowserContext, setup: Page, layout: Layout) {
  const server = new FakeCloudServer();
  const accountId = "qa-account-a";
  server.setAccess(accountId, { snapshotSaves: true });
  const authenticated = new Map<Page, string | null>();
  const transport = server.transport(accountId);
  await context.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => { authenticated.set(page, account); });
  await context.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: keyof CloudTransport, args: unknown[]) => {
    if (account !== accountId || authenticated.get(page) !== account) return { error: { code: "auth" } };
    try {
      const action = transport[method];
      if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
      return { value: await (action as (...args: unknown[]) => Promise<unknown>)(...args) };
    } catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
  });
  const url = `/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=${accountId}&device-campaigns=1`;
  await setup.goto(url);
  await openAndContinue(setup);
  await expectAccountSaved(setup);
  const state = (await snapshot(setup)).state!;
  expect(state.paused).toBe(true);
  expect(server.account(accountId).campaigns.size).toBe(1);
  return { server, url, campaignId: state.campaignId };
}

export interface LoadingSample {
  at: number;
  source: "raf" | "mutation" | "init";
  armed: boolean;
  screen: string;
  loadingCount: number;
  fullScreen: boolean;
  bars: Array<{ value: number | null; percent: number | null }>;
  forbidden: string[];
}
export interface LoadingRecording { origin: string; samples: LoadingSample[]; overflow: boolean }

export async function installLoadingRecorder(page: Page) {
  await page.addInitScript(() => {
    type Sample = LoadingSample;
    const samples: Sample[] = [];
    let armed = false, stopped = false, overflow = false;
    const boxVisible = (node: Element) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom <= 0 || rect.right <= 0 || rect.top >= innerHeight || rect.left >= innerWidth) return false;
      for (let parent: Element | null = node; parent; parent = parent.parentElement) {
        const css = getComputedStyle(parent);
        if (css.display === "none" || css.visibility === "hidden" || css.visibility === "collapse" || Number(css.opacity) === 0) return false;
      }
      return true;
    };
    // A mounted screen behind an opaque loading surface is not a visible flash.
    const exposed = (node: Element) => {
      if (!boxVisible(node)) return false;
      const r = node.getBoundingClientRect();
      const left = Math.max(0, r.left), right = Math.min(innerWidth, r.right);
      const top = Math.max(0, r.top), bottom = Math.min(innerHeight, r.bottom);
      return [[0.5, 0.5], [0.1, 0.1], [0.9, 0.9]].some(([x, y]) => {
        const hit = document.elementFromPoint(left + (right - left) * x!, top + (bottom - top) * y!);
        return hit !== null && (hit === node || node.contains(hit));
      });
    };
    const sample = (source: Sample["source"]) => {
      if (stopped) return;
      const root = document.getElementById("root");
      const loading = [...document.querySelectorAll('[role="region"][aria-label="Loading clinic"]')].filter(boxVisible);
      // Start at the FIRST app DOM commit, never at the first loading screen:
      // an entry/list/error rendered first must be captured and fail the test.
      armed ||= Boolean(root?.childNodes.length || loading.length);
      const forbidden: string[] = [];
      const headings = [...document.querySelectorAll("h1,h2,[role=heading]")].filter(exposed);
      for (const heading of headings) {
        if (heading.closest('[aria-label="Loading clinic"]')) continue;
        const text = heading.textContent?.trim() ?? "";
        if (/your campaigns|clinic campaigns/i.test(text)) forbidden.push("campaign list");
        else if (/sign[ -]?in|signed out|log[ -]?in/i.test(text)) forbidden.push("sign-in");
        else if (/open your clinic|welcome|continue on this device|safe to close|account|save|recover|error|unable|could not/i.test(text)) forbidden.push(`entry/error: ${text}`);
      }
      for (const node of document.querySelectorAll('main form, .opening-sequence, .campaign-manager, [role="alert"]')) {
        if (!node.closest('[aria-label="Loading clinic"], [aria-label="Disposable cloud QA controls"]') && exposed(node)) forbidden.push(`entry/error: ${node.textContent?.trim().slice(0, 120)}`);
      }
      for (const surface of loading) {
        if (surface.getAttribute("data-loading-state") === "failed") forbidden.push("loading error");
        for (const alert of surface.querySelectorAll('[role="alert"]')) if (boxVisible(alert)) forbidden.push(`loading error: ${alert.textContent?.trim().slice(0, 120)}`);
      }
      const host = document.querySelector('[data-testid="facility-canvas"]');
      const canvas = host?.querySelector("canvas");
      const ready = Boolean(canvas && exposed(canvas) && window.__cloudQa?.status().canExecute);
      const bars = loading.flatMap(node => [...node.querySelectorAll('[role="progressbar"][aria-label="Opening progress"]')].filter(boxVisible).map(bar => {
        const read = (name: string) => { const value = bar.getAttribute(name); return value === null || value.trim() === "" ? NaN : Number(value); };
        const value = read("aria-valuenow"), min = read("aria-valuemin"), max = read("aria-valuemax");
        return { value: Number.isFinite(value) ? value : null,
          percent: Number.isFinite(value) && Number.isFinite(min) && Number.isFinite(max) && max > min ? 100 * (value - min) / (max - min) : null };
      }));
      const fullScreen = loading.some(node => { const r = node.getBoundingClientRect(); return r.left <= 1 && r.top <= 1 && r.right >= innerWidth - 1 && r.bottom >= innerHeight - 1; });
      const screen = loading.length ? "loading" : forbidden[0] ?? (ready ? "clinic" : canvas && exposed(canvas) ? "unplayable clinic" : "blank/unknown");
      if (samples.length >= 120_000) { overflow = true; return; }
      samples.push({ at: performance.now(), source, armed, screen, loadingCount: loading.length, fullScreen, bars, forbidden });
    };
    const observer = new MutationObserver(() => sample("mutation"));
    observer.observe(document, { subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden", "role", "data-loading-state", "aria-valuenow", "aria-valuemin", "aria-valuemax"] });
    const frame = () => { if (!stopped) { sample("raf"); requestAnimationFrame(frame); } };
    (window as typeof window & { __blindLoading?: { samples: Sample[]; stop(): LoadingRecording } }).__blindLoading = {
      samples, stop() { sample("raf"); stopped = true; observer.disconnect(); return { origin: location.origin, samples, overflow }; },
    };
    sample("init"); requestAnimationFrame(frame);
  });
}

export async function animationFrames(page: Page, count: number) {
  await page.evaluate(frames => new Promise<void>(resolve => {
    const next = () => { if (--frames <= 0) resolve(); else requestAnimationFrame(next); };
    requestAnimationFrame(next);
  }), count);
}

export async function finishLoadingRecorder(page: Page): Promise<LoadingRecording> {
  return page.evaluate(() => (window as typeof window & { __blindLoading: { stop(): LoadingRecording } }).__blindLoading.stop());
}
