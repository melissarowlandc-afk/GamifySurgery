import { expect, it, vi } from "vitest";
import { createInitialGameState, getRoomDefinition, getRoomNavigationAnchor,
  PROTOTYPE_DOMAIN_CONTEXT as context, type GameCommand } from "@gamify-surgery/game-domain";
import { createAppAppointmentsQaState } from "../../../../tests/fixtures/app-appointments";
import { framePhoneFacility } from "../mobile/map/camera";
import { operationalSessionFixture } from "../session/cloud/operationalSessionTestSupport";
import { loadCloudSnapshot } from "../session/cloud/snapshotCodec";
import { canvasClinic } from "./desktopLagAcceptanceFixtures";
import { FacilityScene } from "./FacilityScene";
import { CAMERA_ZOOM_SETTLE_MS } from "./retainedCamera";
import type { FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Scenes: { Events: { RESUME: "resume", WAKE: "wake", SHUTDOWN: "shutdown" } },
  Scale: { Events: { RESIZE: "resize" } },
  Textures: { FilterMode: { LINEAR: 1 }, Events: { ADD: "addtexture" } }, Renderer: { Events: { PRE_RENDER: "prerender" } } } }));

const roomA = "room.app.0", roomB = "room.app.1";
const move = { type: "MOVE_ROOM", operationId: "b021.move", roomId: roomA, x: 25, y: 24 } as const;
const swap = { type: "APPLY_REMODEL_PLAN", operationId: "b021.swap", rooms: [
  { roomId: roomA, x: 38, y: 24, orientation: 0 }, { roomId: roomB, x: 28, y: 24, orientation: 0 },
] } satisfies GameCommand;

function idleClinic() {
  const state = createAppAppointmentsQaState();
  state.serviceAppointmentsEnabled = false;
  state.nextServiceAppointmentTicks = {};
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  for (const [index, employee] of state.employees.entries()) {
    const room = state.rooms.find(candidate => candidate.id === `room.app.${index}`)!;
    employee.homeRoomInstanceId = room.id;
    employee.location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
    employee.path = [];
    employee.pathIndex = 0;
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  const patient = Object.values(createInitialGameState().encounters)[0]!;
  state.encounters = { [patient.id]: { ...patient, lifecycle: "waiting_unopened", checkInStatus: "checked_in",
    assignedRoomInstanceId: roomA, patientLocation: { x: 29, y: 25 }, patientMovement: null } };
  return state;
}

function phoneCanvas(viewModel: FacilityViewModel, height: number) {
  vi.stubGlobal("window", { devicePixelRatio: 1 });
  const bounds = { width: 412, height };
  const camera = { ...framePhoneFacility(viewModel, bounds), panY: -100 };
  const scene = new FacilityScene({ viewModel, camera, mobileInput: true, onPlaceRoom: () => false });
  const create = scene.create.bind(scene);
  scene.create = () => {
    // The native Canvas fixture supplies display objects and a camera. Its
    // input and canvas need only acknowledge listener registration in Node.
    Object.assign(scene.input, { addPointer() {} });
    Object.assign(scene.game.canvas, { addEventListener() {} });
    Object.assign(scene.scale, { on() {}, off() {}, updateBounds() {}, canvasBounds: { width: 0, height: 0 } });
    create();
  };
  return canvasClinic(viewModel, { scene, ...bounds, authored: true });
}

function fixturePositions(f: ReturnType<typeof phoneCanvas>, roomId: string) {
  const room = f.bridge.viewModel.rooms.find(candidate => candidate.instanceId === roomId)!;
  const { originX, originY } = f.scene.layout;
  const tile = f.scene.layout.tileSize;
  const images = f.scene.fixtureBitmapImages as ReadonlyMap<string, Phaser.GameObjects.Image & { displayFrame: string }>;
  return [...images].filter(([key, image]) => image.visible && key.startsWith(`approved:${roomId}:`))
    .map(([key, image]) => ({ key, texture: image.texture.key, frame: image.displayFrame,
      x: (image.x - originX - room.tileX * tile) / tile, y: (image.y - originY - room.tileY * tile) / tile,
      width: image.displayWidth, height: image.displayHeight }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

it.each([move, swap])("B-021 room-move furniture follows the settled phone fit after $type", async command => {
  const { session, server, scope } = await operationalSessionFixture({}, idleClinic());
  try {
    const opening = session.state;
    const view = (build = true) => session.playerView(session.state, null, false, null, build).facility;
    const moving = command.type === "MOVE_ROOM";
    const f = phoneCanvas(view(!moving), moving ? 658 : 270);
    if (moving) {
      // Idle Build reserves 54px at the bottom of the previously open map.
      f.scale.height = 604;
      f.bridge.viewModel = view();
      f.frame();
    }
    const furniture = () => [fixturePositions(f, roomA), fixturePositions(f, roomB)];
    const before = furniture();
    expect(before.map(images => images.map(({ key }) => key.split(":").at(-2)))).toEqual([
      ["diagnostic", "sink", "stool", "table"], ["diagnostic", "sink", "stool", "table"],
    ]);
    expect(f.scene.layout.tileSize).toBe(22);

    if (moving) {
      f.scale.height = 469;
      f.frame();
      f.scale.height = 555;
    }
    expect((await session.executeControllerCommand(command, context))?.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(await session.checkpointNow("purchase")).toBe(true);
    const copy = await server.transport(scope.accountId).load(scope.campaignId);
    const { state: durable } = await loadCloudSnapshot({ snapshot: copy.snapshot, revision: copy.revision,
      expectedRevision: copy.revision, expectedCampaignId: scope.campaignId, lineage: copy.lineage });
    expect(durable.rooms.filter(room => room.id === roomA || room.id === roomB).map(({ x, y }) => [x, y]))
      .toEqual(moving ? [[25, 24], [38, 24]] : [[38, 24], [28, 24]]);
    f.bridge.viewModel = view();
    f.frame();
    const commitOriginY = f.scene.layout.originY;

    // Blueprint Apply can publish and paint before the closing controls give
    // back 285px. Both paths keep their original snapped 22px tile size.
    f.scale.height = 555;
    f.frame();
    f.frame(5_000);
    expect(f.scene.layout.tileSize).toBe(22);
    expect(f.scene.layout.originY - commitOriginY).toBe(moving ? 0 : 285);
    expect(furniture(), "settled fixture positions relative to the saved rooms").toEqual(before);

    expect(await session.undoBuildAsync(opening)).toBeTruthy();
    f.bridge.viewModel = view();
    f.frame(CAMERA_ZOOM_SETTLE_MS + 1);
    expect(f.bridge.viewModel.rooms.find(room => room.instanceId === roomA)?.tileX).toBe(28);
    expect(furniture()).toEqual(before);
  } finally {
    session.dispose();
    vi.unstubAllGlobals();
  }
});
