import { createHash } from "node:crypto";
import { expect, it, vi } from "vitest";
import { gameReducer, getRoomDefinition } from "@gamify-surgery/game-domain";
import { waitingRoom } from "./doorGeometryAcceptanceFixtures";
import { resolveApprovedRoomActorSupports } from "./approvedRoomPresentation";
import { getApprovedSupportFacing, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { Camera, TransformMatrix, canvasClinic, ownerScaleClinic, pixelRoom, placedRoom, projectClinic, recordedGraphics, savedDoor,
  type CanvasCall } from "./desktopLagAcceptanceFixtures";
import { retainGraphicsViewportBounds } from "./graphicsViewportCulling";
import { getFacilitySceneDepth } from "./renderDepth";
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "../art/characterBitmapArt";
import { PIXEL_PALETTE_NUMBER } from "../art/pixelPalette";
import { alignCharacterStillSeatToWorld, getCharacterStillPresentationMetrics } from "./characterPresentation";
import type { FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Scenes: { Events: { RESUME: "resume", WAKE: "wake", SHUTDOWN: "shutdown" } },
  Textures: { FilterMode: { LINEAR: 1 }, Events: { ADD: "addtexture" } }, Renderer: { Events: { PRE_RENDER: "prerender" } } } }));

function renderCamera(x: number, y: number, width: number, height: number, zoom = 1) {
  const camera = new Camera(0, 0, width, height).setOrigin(0, 0).setScroll(x, y).setZoom(zoom);
  camera.id = 1;
  camera.preRender();
  return camera;
}

type Rect = ReturnType<typeof pixelRoom>;
const contained = (r: Rect, x: number, y: number, w: number, h: number) =>
  r.x < x && r.y < y && x + w < r.x + r.width && y + h < r.y + r.height;

// Preserve the flattened painted paths, styles, and coordinates across native
// Graphics buffer boundaries. Each path carries its own vertices and style.
function paintIn(calls: readonly CanvasCall[], viewport: Rect) {
  let path: CanvasCall[] = [];
  const inside = (x: number, y: number, width = 0, height = 0) => x < viewport.x + viewport.width &&
    x + width > viewport.x && y < viewport.y + viewport.height && y + height > viewport.y;
  const result: unknown[] = [];
  for (const call of calls) {
    const [op, a, b, c, d] = call;
    if (op === "beginPath") path = [];
    else if (["moveTo", "lineTo", "closePath", "arc", "rect"].includes(op)) path.push(call);
    else if (op === "fillRect" && inside(Number(a), Number(b), Number(c), Number(d))) result.push(call);
    else if (op === "stroke" || op === "fill") {
      const points = path.flatMap(([kind, x, y, radius]) => kind === "closePath" ? [] : kind === "arc"
        ? [[Number(x) - Number(radius), Number(y) - Number(radius)], [Number(x) + Number(radius), Number(y) + Number(radius)]]
        : [[Number(x), Number(y)]]);
      if (points.length === 0) continue;
      const xs = points.map(p => p[0]!), ys = points.map(p => p[1]!);
      const left = Math.min(...xs), top = Math.min(...ys);
      const margin = op === "stroke" ? Number(b) / 2 : 0;
      if (inside(left - margin, top - margin, Math.max(...xs) - left + 2 * margin, Math.max(...ys) - top + 2 * margin)) {
        result.push([call, path]);
      }
    }
  }
  return { calls: result.length, sha: createHash("sha256").update(JSON.stringify(result)).digest("hex") };
}

it.each([true, false])("B-021 submits no far-offscreen room work in 60 settled frames, paused=%s", paused => {
  const state = ownerScaleClinic();
  state.paused = paused;
  const projection = projectClinic(state);
  const model = { ...projection, camera: { ...projection.camera!, panY: 0 } };
  expect([model.rooms.length, model.rooms.filter(r => r.kind === "hallway").length, model.doors!.length]).toEqual([256, 190, 124]);
  const f = canvasClinic(model);
  f.frame();
  const room = (id: string) => pixelRoom(f.scene, model.rooms.find(r => r.instanceId === id)!);
  const near = room("public.perf.exam.0.7");
  const far = [room("public.perf.exam.3.0"), room("public.perf.exam.3.14")];
  const viewport = { x: near.x - 120, y: near.y - 65, width: 550, height: 390 };
  // Working zoom uses the retained scene basis. The clip cuts across the
  // abutting examination caps and hall stripe at the right edge.
  const camera = renderCamera(viewport.x, viewport.y, 1100, 780, 2);
  const submitted = (view: any) => f.render(true, view).flatMap(row => row.calls);
  const wholeMap = { x: -5000, y: -5000, width: 10000, height: 10000 };
  const uncropped = submitted(renderCamera(wholeMap.x, wholeMap.y, wholeMap.width, wholeMap.height));
  const witness = paintIn(uncropped, viewport);
  expect(witness.calls).toBeGreaterThan(100);
  expect(paintIn(submitted(camera), viewport), "visible primitive order, style and coordinates").toEqual(witness);
  expect(paintIn(uncropped, wholeMap), "frozen r48 all-in-view painter stream").toEqual({
    calls: 101538, sha: "9e9232d06e3423fe9de38ac6a650f921b1e1d3d765a07dc1b35168c384109471",
  });
  expect(submitted(renderCamera(10000, 10000, 1100, 780)), "all architecture and rooms outside the view").toEqual([]);

  let offscreenFills = 0;
  const inspectFill = (x: number, y: number, width: number, height: number) => {
    if (far.some(rect => contained(rect, x, y, width, height))) offscreenFills++;
  };
  for (const call of uncropped) if (call[0] === "fillRect") inspectFill(Number(call[1]), Number(call[2]), Number(call[3]), Number(call[4]));
  expect(offscreenFills, "the far rooms actually submit substantial content in the full view").toBeGreaterThan(100);
  offscreenFills = 0;
  let submittedOps = 0, canvasCalls = 0;
  f.reset();
  for (let frame = 0; frame < 60; frame++) {
    f.frame();
    for (const row of f.render(false, camera, inspectFill)) {
      submittedOps += row.submittedOps;
      canvasCalls += row.canvasCalls;
    }
  }
  expect(f.work().issuedOpcodes, "control: no fresh static architecture opcodes").toBe(0);
  expect(canvasCalls).toBeGreaterThan(witness.calls * 60);
  expect(submittedOps).toBeGreaterThan(0);
  expect(offscreenFills, `far-room fills submitted in 60 frames (${submittedOps} submitted opcodes)`).toBe(0);
});

it.each([
  { name: "upper left at retained 2x", x: 0, y: 0, zoom: 2 },
  { name: "positive pan", x: 160, y: 90, zoom: 2 },
  { name: "negative pan", x: -160, y: -90, zoom: 2 },
  { name: "zoom below 1", x: -40, y: 45, zoom: 0.5 },
])("B-021 native Canvas uses inverse render viewport for $name", ({ x, y, zoom }) => {
  const camera = renderCamera(x, y, 100, 100, 1);
  const left = x + (zoom < 1 ? 190 : 2);
  const valid = recordedGraphics(camera, g => g.fillStyle(0xf0a080, 1).fillRect(left, y + 2, 4, 4));
  const far = recordedGraphics(camera, g => g.fillStyle(0xf0a080, 1).fillRect(x + 300, y + 300, 4, 4));
  for (const { graphics } of [valid, far]) retainGraphicsViewportBounds(graphics);
  camera.setZoom(zoom);
  camera.preRender();
  const screen = camera.matrixCombined.transformPoint(left, y + 2);
  expect([screen.x, screen.y]).toEqual([(left - x) * zoom, 2 * zoom]);
  expect(far.canvas.render(far.graphics).submittedOps, "offscreen control").toBe(0);
  expect(valid.canvas.render(valid.graphics).calls.filter(call => call[0] === "fillRect")).toEqual([
    ["fillRect", left, y + 2, 4, 4, "rgba(240,160,128,1)", 1],
  ]);
});

it("control: clipped strokes, touching edges and unsupported transforms retain their Canvas paint", () => {
  const camera = renderCamera(0, 0, 100, 100);
  const stroke = recordedGraphics(camera, g => g.lineStyle(6, 0x000000).lineBetween(101, 2, 101, 22));
  retainGraphicsViewportBounds(stroke.graphics);
  expect(stroke.canvas.render(stroke.graphics).calls).toContainEqual(["stroke", "rgba(0,0,0,1)", 6, 1]);
  const touch = recordedGraphics(camera, g => g.fillStyle(0xabcd12).fillRect(99, 99, 4, 4));
  retainGraphicsViewportBounds(touch.graphics);
  expect(touch.canvas.render(touch.graphics).calls).toContainEqual(["fillRect", 99, 99, 4, 4, "rgba(171,205,18,1)", 1]);
  const fixtures = [
    { ...recordedGraphics(camera, g => g.fillRect(300, 2, 4, 4)), parent: new TransformMatrix().translate(-298, 0) },
    recordedGraphics(camera, g => g.fillRect(300, 2, 4, 4).setRotation(0.1)),
    recordedGraphics(camera, g => g.translateCanvas(-298, 0).fillRect(300, 2, 4, 4)),
    recordedGraphics(camera, g => g.fillRect(300, 2, 4, 4).setScrollFactor(0.5)),
  ];
  for (const { graphics, canvas, ...rest } of fixtures) {
    retainGraphicsViewportBounds(graphics);
    expect(canvas.render(graphics, true, "parent" in rest ? rest.parent : undefined).calls)
      .toContainEqual(expect.arrayContaining(["fillRect", 300, 2, 4, 4]));
  }
});

it.each([false, true])("control: Build paints shadows, map border, rooms and the cut grid in order with authored environment=%s", authored => {
  const f = canvasClinic(projectClinic(ownerScaleClinic(), true), { authored, authoredEnvironment: authored });
  f.frame();
  expect(f.scene.canRenderAuthoredEnvironment()).toBe(authored);
  const color = (value: number, alpha: number) => `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
  const view = renderCamera(-5000, -5000, 10000, 10000);
  const calls = f.render(true, view).flatMap(row => row.calls);
  const { originX, originY, tileSize } = f.scene.worldLayout;
  const shadow = calls.findIndex(call => call[0] === "fillRect" && call[5] === color(PIXEL_PALETTE_NUMBER.shadow, 0.2));
  const border = calls.findIndex(call => call[0] === "stroke" && call[1] === color(PIXEL_PALETTE_NUMBER.ink, 1) && call[2] === 2);
  const rect = pixelRoom(f.scene, f.bridge.viewModel.rooms.find(room => room.instanceId === "public.perf.exam.0.0")!);
  const room = calls.findIndex(call => call[0] === "fillRect" && contained(rect, Number(call[1]), Number(call[2]), Number(call[3]), Number(call[4])));
  const grid = calls.findIndex(call => call[0] === "fillRect" && call[5] === color(PIXEL_PALETTE_NUMBER.highlight, 0.055));
  expect(shadow).toBeGreaterThanOrEqual(0);
  expect(border).toBeGreaterThan(shadow);
  expect(room).toBeGreaterThan(border);
  expect(grid).toBeGreaterThan(room);
  const y26 = originY + 26 * tileSize;
  const segments = calls.flatMap((call, index) => {
    const from = calls[index - 2], to = calls[index - 1];
    return call[0] === "stroke" && call[1] === color(PIXEL_PALETTE_NUMBER.ink, 0.48) &&
      from?.[0] === "moveTo" && to?.[0] === "lineTo" && from[2] === y26 && to[2] === y26
      ? [[(Number(from[1]) - originX) / tileSize, (Number(to[1]) - originX) / tileSize]] : [];
  });
  expect(segments).toEqual([[0, 10], [11, 12], [13, 35], [36, 38], [39, 42], [43, 72]]);
});

it("B-021 reuses wall-segment work across active frames, actor-only publication and a real door edit", () => {
  const state = ownerScaleClinic();
  const pediatricId = "public.perf.pediatric";
  const pediatric = placedRoom(pediatricId, "room.pediatric_waiting", 55, 21);
  state.rooms.push(pediatric, placedRoom("public.perf.pediatric.hall", "room.hallway", 54, 22),
    placedRoom("public.perf.waiting-backing", "room.hallway", 38, 22));
  const editedDoor = savedDoor(pediatricId, "west", 1);
  const edit = gameReducer(state, { type: "PLACE_DOOR", doorId: editedDoor.id, roomId: pediatricId, side: "west", offset: 1,
    operationId: "public.perf.seat-door" });
  expect(edit.operationReceipts["public.perf.seat-door"]?.status).toBe("applied");
  state.paused = edit.paused = false;
  const supported = (source: typeof state, walkerFront = false): FacilityViewModel => {
    const model = projectClinic(source);
    const patient = model.patients![0]!;
    const crossing = walkerFront ? { x: 38, y: 26 } : { x: 38, y: 21 };
    return { ...model, patients: [
      { ...patient, instanceId: "bench", supportRole: "waiting-seat", supportId: "bench:seat-1", supportRoomInstanceId: waitingRoom },
      { ...patient, instanceId: "side", supportRole: "waiting-seat", supportId: "leftChair:seat-1", supportRoomInstanceId: waitingRoom },
      { ...patient, instanceId: "child", location: { x: 55, y: 22 }, supportRole: "pediatric-waiting-seat",
        supportId: "olderChildChair", supportRoomInstanceId: pediatricId },
      { ...patient, instanceId: "walker", location: crossing, moving: true,
        path: [crossing, { x: 39, y: crossing.y }], pathIndex: 0, supportRole: undefined },
    ] };
  };
  function meters(actors: boolean) {
    let visits = 0;
    const wrap = (model: FacilityViewModel) => ({ ...model,
      patients: actors ? model.patients : model.patients!.map(patient => ({ ...patient, supportRole: undefined })),
      // This arbitrary nonlocal room cannot back any tested segment. Observe
      // footprint fields so array copying and replacement loops still count.
      rooms: model.rooms.map(room => room.instanceId !== "public.perf.exam.0.0" ? room : {
        ...room, get tileY() { visits++; return room.tileY; }, get tileX() { visits++; return room.tileX; },
      }),
    });
    return { wrap, count: () => visits };
  }
  const model = supported(state);
  const seat = meters(true), comparison = meters(false);
  const f = canvasClinic(seat.wrap(model), { authored: true });
  const twin = canvasClinic(comparison.wrap(model), { authored: true });
  const actor = (id: string) => f.scene.characterBitmapContainers.get(`character:patient:${id}`);
  const checkSeat = (id: string, roomId: string, supportId: string, order: number, visible: boolean) => {
    const room = f.bridge.viewModel.rooms.find(r => r.instanceId === roomId)!;
    const support = resolveApprovedRoomActorSupports(room.definitionId, 0).find(r => r.id === supportId)!;
    const rect = pixelRoom(f.scene, room), tile = f.scene.worldLayout.tileSize;
    const pose = f.scene.debugCharacterGaitSnapshot()[`character:patient:${id}`];
    const { direction, rightFacing } = getApprovedSupportFacing(support.facing);
    const person = f.bridge.viewModel.patients!.find(p => p.instanceId === id)!;
    const registration = characterBitmapRegistration(characterBitmapLayers(person.appearance!, direction, "seated", rightFacing));
    const contact = rect.y + tile * support.seat.y;
    const floor = alignCharacterStillSeatToWorld(contact, registration.floorY, registration.seatContactY!,
      getCharacterStillPresentationMetrics(tile, characterStillScaleForAppearance(person.appearance!)).height, registration.cell.height);
    expect(pose, id).toMatchObject({ pose: "seated", visible, direction,
      supportId, supportRoomInstanceId: roomId, groundX: Math.round(rect.x + tile * support.seat.x),
      groundY: Math.round(floor) });
    expect(actor(id).depth).toBe(getFacilitySceneDepth(rect.y + tile * getApprovedSupportPainterGround(support).y, "character", order));
    expect(actor(id).getByName("shadow")).toMatchObject({ x: 0, y: 1, visible: true, texture: { key: "character-contact-shadow" } });
  };
  f.frame(); twin.frame();
  checkSeat("bench", waitingRoom, "bench:seat-1", 16, true);
  checkSeat("side", waitingRoom, "leftChair:seat-1", 17, true);
  checkSeat("child", pediatricId, "olderChildChair", 18, true);
  expect(f.scene.debugApprovedSideChairLayerSnapshot()).toContainEqual(expect.objectContaining({
    drawId: "draws.leftChair", foregroundVisible: true, foregroundDepth: actor("side").depth + 0.5,
  }));
  expect(actor("walker").depth).toBeLessThan(actor("side").depth);
  const prior = seat.count() - comparison.count();
  for (let i = 0; i < 60; i++) { f.frame(); twin.frame(); }
  const steadyVisits = seat.count() - comparison.count() - prior;
  const tickId = "public.perf.actor-tick";
  const tick = gameReducer(state, { type: "ADVANCE_TICK", operationId: tickId, advancedAtRealMs: 9_000 });
  expect(tick.operationReceipts[tickId]?.status).toBe("applied");
  expect(tick.facilityTick).toBe(state.facilityTick + 1);
  const next = supported(tick, true);
  expect(next.rooms).toEqual(model.rooms);
  expect(next.doors).toEqual(model.doors);
  f.bridge.viewModel = seat.wrap(next); twin.bridge.viewModel = comparison.wrap(next);
  const tickStart = seat.count() - comparison.count();
  f.frame(1000); twin.frame(1000);
  const actorTickVisits = seat.count() - comparison.count() - tickStart;
  expect(actor("walker").depth).toBeGreaterThan(actor("side").depth);
  const postEdit = supported(edit, true);
  expect(getRoomDefinition(pediatric.roomDefinitionId)).not.toBeNull();
  f.bridge.viewModel = seat.wrap(postEdit); twin.bridge.viewModel = comparison.wrap(postEdit);
  f.frame(); twin.frame();
  checkSeat("child", pediatricId, "olderChildChair", 18, false);
  checkSeat("side", waitingRoom, "leftChair:seat-1", 17, true);
  const afterEdit = seat.count() - comparison.count();
  f.frame(); twin.frame();
  expect({ steadyVisits, actorTickVisits, nextFrameAfterEdit: seat.count() - comparison.count() - afterEdit },
    "extra visits to a global wall candidate, relative to unseated actors").toEqual({ steadyVisits: 0, actorTickVisits: 0, nextFrameAfterEdit: 0 });
});
