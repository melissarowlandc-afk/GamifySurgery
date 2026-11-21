import { mountDesktopClinic } from "./desktopLagAppFixture";
import { act } from "react";
import { expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import * as projection from "../session/viewModels";
import * as training from "../session/managementViewModels";
import { examRoom } from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { canvasClinic, filedVisitId, interiorFills, ownerScaleClinic, pixelRoom, projectClinic, roomCenter,
  placedRoom, withFiledVisit } from "./desktopLagAcceptanceFixtures";
import { facilityCameraPreferenceKey } from "../session/facilityCameraPreference";
import { PROTOTYPE_PROFILE_KEY } from "../session/prototypeStorage";
import { desktopMapShade } from "./desktopMapShade";
import { getCleanlinessWearSeverity } from "./environmentPresentation";
import { PIXEL_PALETTE_NUMBER } from "../art/pixelPalette";
import type { FacilityViewModel } from "./types";

function labelGeometry(f: ReturnType<typeof canvasClinic>) {
  return f.labels().map(({ x, y, text, style }: any) => {
    const screen = f.camera.matrixCombined.transformPoint(x, y);
    return [Math.round(screen.x), Math.round(screen.y), text, style.fontSize, style.wordWrap, style.resolution];
  });
}

function wheel(f: ReturnType<typeof canvasClinic>, direction: number) {
  f.scene.input.emit("wheel", { x: 550, y: 390 }, [], 0, direction * -100);
}

it.each([
  { route: "operational", gap: 120, sequence: [1, 1, 1, 1], finalZoom: 2.4, quietDraws: 1 },
  { route: "operational", gap: 120, sequence: [1, 1, -1, -1], finalZoom: 2, quietDraws: 0 },
  { route: "operational", gap: 190, sequence: [-1, -1, -1, -1], finalZoom: 1.6, quietDraws: 1 },
  { route: "local", gap: 120, sequence: [1, 1, 1, 1], finalZoom: 2.4, quietDraws: 1 },
])("B-021 publishes $gap ms $route wheel gestures without projecting the clinic (final zoom $finalZoom)", async ({ route, gap, sequence, finalZoom, quietDraws }) => {
  const app = await mountDesktopClinic(ownerScaleClinic(), { localProjection: route === "local" });
  const { f } = app;
  await app.click("Enter Build Mode");
  await app.frame();
  await app.revealRoom(examRoom);
  app.writes.mockClear();
  const oldCamera = f.scene.getCameraPreference();
  const expected = desktopMapShade({ ...oldCamera, zoom: finalZoom }, f.bridge.viewModel, f.scale);
  const save = domain.serializeGameState(app.session.state);
  const writes = vi.spyOn(app.cache.journal, "append");
  const projectionCalls = vi.spyOn(projection, "createPrototypePlayerView");
  const operationalCalls = vi.spyOn(domain, "isRoomOperationalForFacilityWork");
  const trainingCalls = vi.spyOn(training, "createStaffTrainingOverview");
  const samples: { draws: number; issued: number; tile: number }[] = [];
  for (const direction of sequence) {
    f.reset();
    wheel(f, direction);
    await app.frame(gap);
    samples.push({ draws: f.work().worldDraws, issued: f.work().issuedOpcodes, tile: f.scene.worldLayout.tileSize });
  }
  f.reset();
  await app.frame(190);
  const quiet = f.work();
  if (gap === 120) {
    expect(samples.map(row => [row.draws, row.issued])).toEqual(sequence.map(() => [0, 0]));
    expect(quiet.worldDraws).toBe(quietDraws);
    expect(quiet.issuedOpcodes > 0).toBe(quietDraws === 1);
  } else {
    const settled = [...samples, { draws: quiet.worldDraws, issued: quiet.issuedOpcodes, tile: f.scene.worldLayout.tileSize }];
    const rebases = settled.filter(row => row.issued > 0);
    expect.soft(settled.every(row => row.draws <= 1)).toBe(true);
    expect.soft(new Set(rebases.map(row => row.tile)).size, JSON.stringify(settled)).toBe(rebases.length);
  }
  const reads = { projections: projectionCalls.mock.calls.length, operational: operationalCalls.mock.calls.length,
    training: trainingCalls.mock.calls.length };
  expect(f.scene.getCameraPreference()).toEqual(expected.camera);
  expect(f.scene.layout).toMatchObject(expected.layout);
  expect(domain.serializeGameState(app.session.state)).toBe(save);
  expect(writes.mock.calls).toHaveLength(0);
  expect(app.writes.mock.calls.filter(([key]) => key === PROTOTYPE_PROFILE_KEY)).toHaveLength(0);
  const fresh = canvasClinic({ ...f.bridge.viewModel, camera: expected.camera }, { authored: true });
  fresh.frame();
  const labels = labelGeometry(f);
  expect(labels.length).toBeGreaterThan(0);
  expect(labels).toEqual(labelGeometry(fresh));
  expect(labels.some((row: unknown[]) => typeof row[3] === "string" && typeof row[4] === "object" && row[5] === 2)).toBe(true);
  const target = f.bridge.viewModel.rooms.filter(room => room.kind !== "hallway" && !room.isFounderRoom).find(room => {
    const { x, y } = roomCenter(f, room.instanceId);
    return x > 25 && x < f.scale.width - 25 && y > 25 && y < f.scale.height - 25;
  })!;
  expect(target, "at least one interior Build pick after the burst").toBeDefined();
  const point = roomCenter(f, target.instanceId);
  expect(point).toEqual(roomCenter(fresh, target.instanceId));
  await app.action(() => f.click(point));
  await app.frame();
  expect(f.bridge.viewModel.selectedRoomInstanceId).toBe(target.instanceId);
  expect(reads, "work caused solely by wheel camera publication").toEqual({ projections: 0, operational: 0, training: 0 });
});

it("B-021 ordinary Play opens without constructing room Text", async () => {
  const h = await mountDesktopClinic(ownerScaleClinic());
  expect(h.f.bridge.viewModel.buildMode).toBe(false);
  expect(h.f.labels()).toHaveLength(0);
  expect(h.f.work().roomTextCreates).toBe(0);
});

it("B-021 keeps unrelated architecture and unchanged labels through width, chart and workspace changes", async () => {
  const state = withFiledVisit(ownerScaleClinic());
  const h = await mountDesktopClinic(state);
  const { f } = h;
  await h.revealRoom(examRoom);
  const original = f.scene.getCameraPreference();
  const tile = f.scene.worldLayout.tileSize;
  const watchedRoom = () => pixelRoom(f.scene, f.bridge.viewModel.rooms.find(row => row.instanceId === examRoom)!);
  const work: Array<{ reason: string; roomFills: number; worldDraws: number }> = [];
  async function observe(reason: string, run: () => Promise<unknown>) {
    f.reset();
    await run();
    await h.frame();
    const { worldDraws, issuedRects } = f.work();
    work.push({ reason, roomFills: interiorFills(watchedRoom(), issuedRects).length, worldDraws });
  }
  await observe("chart open", () => h.openChart(filedVisitId));
  expect(h.session.state.openChartEncounterId).toBe(filedVisitId);
  await observe("chart close", () => h.click("Close patient chart"));
  expect(h.session.state.openChartEncounterId).toBeNull();
  await observe("width-only resize", () => h.resize(970, 780));
  expect(f.scale.width).toBe(970);
  expect(f.camera.width).toBe(970);
  expect(f.scene.worldLayout.tileSize).toBe(tile);
  expect(f.scene.getCameraPreference()).toEqual(original);
  expect(f.scene.layout).toMatchObject(desktopMapShade(original, f.bridge.viewModel, f.scale).layout);
  const pins = vi.fn();
  f.bridge.onAlertPinPositionsChange = pins;
  f.bridge.viewModel = { ...f.bridge.viewModel, alertPins: [{ id: "public.perf.pin", title: "Room", actionLabel: "Locate",
    target: { kind: "room", id: examRoom } }] };
  await h.frame();
  const room = watchedRoom();
  const expectedPin = f.camera.matrixCombined.transformPoint(room.x + room.width / 2, room.y + Math.min(room.height / 2, tile));
  expect(pins).toHaveBeenLastCalledWith([{ id: "public.perf.pin", x: Math.round(expectedPin.x), y: Math.round(expectedPin.y) }]);
  await observe("enter Build", () => h.click("Enter Build Mode"));
  const initialLabels = f.labels();
  const initialLabelGeometry = labelGeometry(f);
  expect(initialLabels.length).toBeGreaterThan(0);
  await observe("select room", () => h.action(() => f.click(roomCenter(f, examRoom))));
  expect(f.bridge.viewModel.selectedRoomInstanceId).toBe(examRoom);
  await observe("select Doors", () => h.click("Doors"));
  expect(f.bridge.viewModel.buildDoorTool).toBe("place");
  const reused = f.labels().filter((label: any, index: number) => label === initialLabels[index]).length;
  expect(labelGeometry(f)).toEqual(initialLabelGeometry);
  expect.soft(reused, "the same visible label objects at identical basis/content").toBe(initialLabels.length);
  expect.soft(f.work().roomTextCreates, "no label allocation for door overlay").toBe(0);
  expect.soft(f.work().roomTextWrites.length, "no equal label buffer update for door overlay").toBe(0);
  await observe("leave Build", () => h.click("Done / Save"));
  expect(f.bridge.viewModel.buildMode).toBe(false);
  await observe("enter Management", () => h.click("Enter Management Mode"));
  expect(h.env.find(node => node.attributes.class?.includes("management-mode-topbar") === true).textContent).toContain("Management Mode");
  await observe("leave Management", () => h.click("Done"));
  expect(h.env.button("Enter Management Mode")).toBeDefined();
  expect(f.scene.getCameraPreference()).toEqual(original);
  expect(f.bridge.viewModel.paused).toBe(true);
  expect(work.map(({ reason, roomFills }) => ({ reason, roomFills })), `unrelated room paint, with diagnostic world calls ${JSON.stringify(work)}`)
    .toEqual(work.map(({ reason }) => ({ reason, roomFills: 0 })));
});

it("control: hide flushes only the latest wheel preference and a replacement campaign fences a pending echo", async () => {
  const h = await mountDesktopClinic(ownerScaleClinic());
  const { f } = h;
  const key = facilityCameraPreferenceKey(h.session.state.campaignId);
  h.writes.mockClear();
  const before = domain.serializeGameState(h.session.state);
  wheel(f, 1); wheel(f, 1);
  expect(f.scene.hasPendingCameraChange()).toBe(true);
  await h.visibility("hidden");
  await h.visibility("visible");
  await h.frame(190);
  await act(async () => vi.advanceTimersByTimeAsync(300));
  const cameraWrites = h.writes.mock.calls.filter(([id]) => id === key);
  expect(cameraWrites).toHaveLength(1);
  expect(JSON.parse(cameraWrites[0]![1])).toMatchObject({ camera: { zoom: 2.2 } });
  expect(domain.serializeGameState(h.session.state)).toBe(before);

  const replacement = canvasClinic(f.bridge.viewModel);
  const published = vi.fn();
  replacement.bridge.onCameraChange = published;
  wheel(replacement, 1);
  const next = { ...replacement.bridge.viewModel, campaignId: "public.perf.second", camera: { ...f.scene.getCameraPreference(), zoom: 1.1 } };
  replacement.bridge.viewModel = next;
  replacement.frame(190);
  expect(replacement.scene.hasPendingCameraChange()).toBe(false);
  expect(replacement.scene.getCameraPreference().zoom).toBe(1.1);
  expect(published.mock.calls.every(([camera]) => camera.zoom === 1.1)).toBe(true);
});

it("B-021 keeps room shells through unchanged publications and local fixture, wear, litter and cooler changes", () => {
  const state = ownerScaleClinic();
  const endoscopyId = "public.perf.endoscopy";
  state.rooms.push(placedRoom(endoscopyId, "room.endoscopy", 47, 23));
  const model = projectClinic(state);
  const f = canvasClinic(model, { authored: true });
  f.frame();
  const untouched = pixelRoom(f.scene, model.rooms.find(room => room.instanceId === "public.perf.exam.3.14")!);
  const wearRoom = model.rooms.find(room => room.instanceId === examRoom)!;
  const localChanges: [string, Partial<FacilityViewModel>][] = [
    ["equivalent worker tick", { facilityTick: model.facilityTick + 1, rooms: structuredClone(model.rooms), doors: structuredClone(model.doors) }],
    ["fixture", { endoscopyOccupancy: { roomInstanceIds: [endoscopyId], patientInstanceIds: [], serviceVisitorInstanceIds: [] } }],
    ["wear", { rooms: model.rooms.map(room => room === wearRoom ? { ...wearRoom, cleanliness: 5 } : room) }],
    ["litter", { litterItems: [{ instanceId: "public.perf.litter", roomInstanceId: examRoom, location: { x: 34, y: 25 } }] }],
    ["cooler", { waterCooler: { location: { x: 35, y: 30 }, fillPercent: 0, needsRefill: true } }],
  ];
  const spriteFrames = () => f.objects.filter(object => object.kind === "image" && object.visible && object.getData("approved-front-room-id") === endoscopyId)
    .map(object => [object.texture?.key, object.displayFrame]);
  const empty = spriteFrames();
  expect(empty.length).toBeGreaterThan(0);
  const work = [];
  for (const [reason, edit] of localChanges) {
    f.reset();
    f.bridge.viewModel = { ...f.bridge.viewModel, ...edit };
    f.frame();
    const { roomTextCreates, issuedRects } = f.work();
    work.push({ reason, roomTextCreates, protectedFills: interiorFills(untouched, issuedRects).length });
    if (reason === "fixture") expect(spriteFrames()).not.toEqual(empty);
    if (reason === "wear") {
      const [red, green, blue] = [16, 8, 0].map(shift => (PIXEL_PALETTE_NUMBER.charcoal >> shift) & 255);
      const color = `rgba(${red},${green},${blue},${0.08 + getCleanlinessWearSeverity(5) * 0.12})`;
      expect(f.render().flatMap(row => row.calls).some(([name, x, y, width, height, style]) => name === "fillRect" && style === color &&
        interiorFills(pixelRoom(f.scene, wearRoom), [[Number(x), Number(y), Number(width), Number(height)]]).length > 0)).toBe(true);
    }
  }
  expect(f.scene.fixtureGraphics.get("environment:litter:public.perf.litter")?.commandBuffer.length).toBeGreaterThan(0);
  expect(f.scene.waterCoolerLabelText).toMatchObject({ text: "REFILL", visible: true });
  expect(work).toEqual(localChanges.map(([reason]) => ({ reason, roomTextCreates: 0, protectedFills: 0 })));
});
