import { EventEmitter } from "node:events";
import {
  PROTOTYPE_DOMAIN_CONTEXT, getRoomDefinition, type CardinalDirection, type DoorState, type GameState, type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { seatedClinic } from "./doorGeometryAcceptanceFixtures";
import { nativePhaserMemoryClass as native } from "./nativePhaserMemoryTestSupport";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { FACILITY_DEPTH_LOCATOR } from "./renderDepth";
import type { FacilityScene, FacilitySceneBridge } from "./FacilityScene";
import type { FacilityRoomView, FacilityViewModel } from "./types";

export const officeId = "public.perf.office";
export const westBathId = "public.perf.bath.a";
export const eastBathId = "public.perf.bath.b";
export const workingCamera = { zoom: 2, panX: 0, panY: 1320 };
export const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
export const doorSides = ["north", "east", "south", "west"] as const;

export function placedRoom(id: string, roomDefinitionId: string, x: number, y: number): PlacedRoom {
  return { id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 };
}

export function savedDoor(roomId: string, side: CardinalDirection, offset: number, id = `public.perf.door.${roomId}.${side}.${offset}`): DoorState {
  return { id, roomId, side, offset, exterior: false };
}

/** Connected synthetic clinic. The four rows use real examination fixtures
 * and thresholds. Alternate primary openings exercise both facade offsets. */
export function ownerScaleClinic(): GameState {
  const { state } = seatedClinic();
  state.facilityLevel = 5;
  state.environment.ambientPedestrians = [];
  state.rooms.push(placedRoom(officeId, "room.founder_office", 41, 23),
    placedRoom(westBathId, "room.bathroom", 10, 24), placedRoom(eastBathId, "room.bathroom", 12, 24));
  state.doors.push(savedDoor(officeId, "south", 1), savedDoor(westBathId, "south", 0), savedDoor(eastBathId, "south", 0));
  let seed = 0xb021;
  const alternateDoors: DoorState[] = [];
  for (const [row, y] of [4, 7, 14, 17].entries()) {
    const side = row % 2 === 0 ? "south" : "north";
    for (let col = 0; col < 15; col++) {
      const id = `public.perf.exam.${row}.${col}`;
      state.rooms.push(placedRoom(id, "room.examination", 5 + col * 3, y));
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const offset = 1 + (seed >>> 31);
      state.doors.push(savedDoor(id, side, offset));
      alternateDoors.push(savedDoor(id, side, 3 - offset));
    }
  }
  state.doors.push(...alternateDoors.slice(0, 124 - state.doors.length));
  const hallKeys = new Set(state.rooms.filter(r => r.roomDefinitionId === "room.hallway").map(r => `${r.x},${r.y}`));
  function hall(x: number, y: number) {
    const key = `${x},${y}`;
    if (hallKeys.has(key)) return;
    state.rooms.push(placedRoom(`public.perf.hall.${key}`, "room.hallway", x, y));
    hallKeys.add(key);
  }
  for (const y of [6, 16, 26]) for (let x = 4; x <= (y === 26 ? 43 : 50); x++) hall(x, y);
  for (let y = 6; y <= 26; y++) hall(4, y);
  for (let x = 5; hallKeys.size < 190; x++) hall(x, 21);
  return state;
}

export function projectClinic(state: GameState, build = false, selected: string | null = null): FacilityViewModel {
  return createPrototypePlayerView(state, state.openChartEncounterId, false, null, build, selected, 0, workingCamera).facility;
}

export const filedVisitId = "public.perf.filed-visit";
export function withFiledVisit(state: GameState): GameState {
  const visit = Object.values(state.encounters)[0]!;
  state.encounters[filedVisitId] = { ...visit, id: filedVisitId, resolutionReason: "walkout", lifecycle: "resolved",
    checkInStatus: "checked_in", patientLocation: null, patientMovement: null };
  return state;
}

const Graphics = native("gameobjects/graphics/Graphics.js");
export const Camera = native("cameras/2d/Camera.js");
export const TransformMatrix = native("gameobjects/components/TransformMatrix.js");
const commands = native("gameobjects/graphics/Commands.js");
const operands: Record<string, number> = {
  ARC: 7, BEGIN_PATH: 0, CLOSE_PATH: 0, FILL_RECT: 4, LINE_TO: 2, MOVE_TO: 2,
  LINE_STYLE: 3, FILL_STYLE: 2, FILL_PATH: 0, STROKE_PATH: 0, FILL_TRIANGLE: 6,
  STROKE_TRIANGLE: 6, SAVE: 0, RESTORE: 0, TRANSLATE: 2, SCALE: 2, ROTATE: 1,
  GRADIENT_FILL_STYLE: 8, GRADIENT_LINE_STYLE: 6,
};
const lengths = new Map(Object.entries(operands).map(([name, count]) => [commands[name], count + 1]));

function visitOpcodes(buffer: number[], visit: (id: number, start: number) => void) {
  for (let index = 0; index < buffer.length;) {
    const id = buffer[index]!;
    const length = lengths.get(id);
    if (length === undefined || index + length > buffer.length) throw Error(`Unknown or incomplete Graphics opcode ${id}`);
    visit(id, index);
    index += length;
  }
}

export type CanvasCall = readonly [string, ...unknown[]];
const noop = () => {};

/** Runs Phaser's installed GraphicsCanvasRenderer. Counts at its context
 * boundary, with optional per-object streams independent of scene buffer names. */
export function canvasRecorder(camera: any) {
  let calls: CanvasCall[] | null = null;
  let submittedOps = 0;
  let canvasCalls = 0;
  let capture = false;
  let onFill: ((x: number, y: number, width: number, height: number) => void) | undefined;
  const context: Record<string, unknown> = {};
  for (const name of ["beginPath", "closePath", "fillRect", "moveTo", "lineTo", "fill", "stroke", "arc", "rect",
    "save", "restore", "setTransform", "translate", "scale", "rotate"]) {
    context[name] = (...args: unknown[]) => {
      canvasCalls++;
      if (name === "fillRect" && onFill) onFill(args[0] as number, args[1] as number, args[2] as number, args[3] as number);
      if (!capture) return;
      // Ignore per-object Canvas housekeeping. A split may add save/restore and
      // style setters, but each painted primitive still carries its exact style.
      if (name === "fillRect" || name === "fill" || name === "stroke") {
        const style = name === "stroke" ? [context.strokeStyle, context.lineWidth] : [context.fillStyle];
        calls!.push([name, ...args, ...style, context.globalAlpha]);
      } else if (!["save", "restore", "setTransform"].includes(name)) calls!.push([name, ...args]);
    };
  }
  camera.addToRenderList = (object: { commandBuffer: number[] }) => {
    visitOpcodes(object.commandBuffer, () => { submittedOps++; });
  };
  const renderer = Object.assign(new EventEmitter(), { currentContext: context, gameContext: context,
    blendModes: ["source-over"], antialias: false });
  return { renderer, render(object: any, record = true, parentMatrix?: unknown, inspectFill?: typeof onFill) {
    submittedOps = canvasCalls = 0;
    capture = record;
    onFill = inspectFill;
    calls = record ? [] : null;
    if (object.willRender(camera)) object.renderCanvas(renderer, object, camera, parentMatrix);
    return { calls: calls ?? [], submittedOps, canvasCalls };
  } };
}

export function recordedGraphics(camera: any, paint: (graphics: any) => void) {
  const graphics = new Graphics({ sys: { queueDepthSort: noop, events: new EventEmitter() } });
  paint(graphics);
  return { graphics, canvas: canvasRecorder(camera) };
}

type RoomRect = { x: number; y: number; width: number; height: number };
export function pixelRoom(scene: any, room: FacilityRoomView): RoomRect {
  const { originX, originY, tileSize } = scene.worldLayout;
  return { x: originX + room.tileX * tileSize, y: originY + room.tileY * tileSize,
    width: room.width * tileSize, height: room.height * tileSize };
}

/** Establishes display/input transports, then uses the actual FacilityScene
 * create/update, native Camera and Canvas Graphics. No image pixels are read. */
export function canvasClinic(model: FacilityViewModel, options: {
  scene?: FacilityScene; width?: number; height?: number; authored?: boolean; authoredEnvironment?: boolean;
} = {}) {
  let issuedOpcodes = 0;
  let worldDraws = 0;
  let issuedRects: Array<{ object: { depth: number }; rect: number[] }> = [];
  let creates: Array<{ object: any; text: string }> = [];
  let textWrites: Array<{ object: any; method: string }> = [];
  let fixtureWrites: any[] = [];
  let mountedScene: FacilityScene | undefined;
  const tracked = new WeakSet<object>();
  const bare = headlessFacilityScene({ ...model, rooms: [], doors: [] }, false, false, {
    liveObjectsOnly: true,
    graphics: (fallback: object) => {
      const object = new Graphics(mountedScene ?? fallback);
      tracked.add(object);
      Object.defineProperty(object.commandBuffer, "push", { value: function (this: number[], ...numbers: number[]) {
        visitOpcodes(numbers, (opcode, start) => {
          issuedOpcodes++;
          if (opcode === commands.FILL_RECT) issuedRects.push({ object, rect: numbers.slice(start + 1, start + 5) });
        });
        return Array.prototype.push.apply(this, numbers);
      } });
      return object;
    },
  });
  for (const object of [...bare.objects]) object.destroy();
  const scene = (options.scene ?? new (bare.scene.constructor)(bare.bridge)) as any;
  mountedScene = scene;
  const bridge = scene.bridge as FacilitySceneBridge;
  bridge.viewModel = model;
  const scale = { width: options.width ?? 1100, height: options.height ?? 780 };
  const camera = new Camera(0, 0, scale.width, scale.height);
  camera.id = 1;
  const canvas = canvasRecorder(camera);
  scene.cameras = { main: camera };
  scene.scale = scale;
  scene.sys = { isActive: () => true, queueDepthSort: noop, events: new EventEmitter(), game: {} };
  scene.events = scene.sys.events;
  scene.game = { canvas: { style: {} }, loop: { targetFps: 60 }, renderer: canvas.renderer };
  scene.input = new EventEmitter();
  scene.time = { now: 0 };
  scene.add = bare.scene.add;
  const textureFrames = new Set<string>();
  const atlas = {
    has: (name: string) => textureFrames.has(name),
    add: (name: string) => { textureFrames.add(name); return {}; },
    get: () => ({ width: 160, height: 320, cutWidth: 160, cutHeight: 320, source: { width: 8192, height: 8192 } }),
    source: [{ scaleMode: 1, width: 8192, height: 8192 }], setFilter: noop,
  };
  scene.textures = Object.assign(new EventEmitter(), {
    exists: (key: string) => key.startsWith("stitchin-time-art:character") || key === "character-contact-shadow" ||
      (options.authored === true && ["stitchin-time-art:", "approved-chair:", "approved-stool:"].some(prefix => key.startsWith(prefix))),
    get: () => atlas, getTextureKeys: () => [], list: {},
  });
  // The decoded catalogue is represented by metadata. Leave the approved
  // record, frame, placement, mask and tier draw paths installed.
  scene.ensureEnvironmentAtlas = noop;
  scene.environmentAtlasReady = options.authoredEnvironment === true;
  scene.ensureCharacterAtlases = noop;
  scene.ensureCharacterStills = noop;
  scene.levelFiveAtlasLoadRequested = true;
  if (typeof scene.drawWorld === "function") {
    const drawWorld = scene.drawWorld.bind(scene);
    scene.drawWorld = () => { worldDraws++; return drawWorld(); };
  }
  const text = scene.add.text;
  const image = scene.add.image;
  scene.add.text = (x: number, y: number, value: string, style: Record<string, unknown> = {}) => {
    const object = text(x, y, value);
    object.style = structuredClone(style);
    creates.push({ object, text: value });
    for (const method of ["setText", "setFontSize", "setWordWrapWidth", "setResolution", "setPosition", "setStyle"]) {
      const original = object[method];
      object[method] = (...args: unknown[]) => {
        textWrites.push({ object, method });
        if (method === "setFontSize") object.style.fontSize = String(args[0]);
        if (method === "setWordWrapWidth") object.style.wordWrap = { width: args[0], useAdvancedWrap: args[1] };
        if (method === "setResolution") object.style.resolution = args[0];
        if (method === "setStyle") Object.assign(object.style, args[0]);
        return original.apply(object, args);
      };
    }
    return object;
  };
  scene.add.image = (x: number, y: number, key?: string, frame?: string) => {
    const object = image(x, y);
    for (const method of ["setTexture", "setPosition", "setDisplaySize", "setCrop"]) {
      const original = object[method];
      object[method] = (...args: unknown[]) => {
        fixtureWrites.push(object);
        if (method === "setTexture") object.displayFrame = args[1];
        if (method === "setCrop") { object.crop = args; object.isCropped = args.length > 0; }
        return original.apply(object, args);
      };
    }
    if (key) object.setTexture(key, frame);
    return object;
  };
  scene.create();
  const refreshCamera = () => { camera.setSize(scale.width, scale.height); camera.preRender(); };
  function frame(delta = 1000 / 60) {
    const now = scene.time.now + delta;
    scene.time.now = now;
    scene.update(now, delta);
    refreshCamera();
  }
  function click(point: { x: number; y: number }) {
    const pointer = { ...point, button: 0 };
    scene.input.emit("pointerdown", pointer);
    scene.input.emit("pointerup", pointer);
  }
  function render(record = true, renderCamera = camera, inspectFill?: (x: number, y: number, width: number, height: number) => void) {
    const recorder = renderCamera === camera ? canvas : canvasRecorder(renderCamera);
    return bare.objects.filter(object => tracked.has(object)).sort((a, b) => a.depth - b.depth).map(object => ({
      object, ...recorder.render(object, record, undefined, inspectFill),
    }));
  }
  const isRoomText = (object: any, value = object.text) =>
    value === "! NO ACCESS" || bridge.viewModel.rooms.some(room => value === (room.buildLabel ?? room.displayName));
  return { scene, bridge, camera, scale, frame, click, refreshCamera, render, objects: bare.objects,
    reset() { issuedOpcodes = worldDraws = 0; creates = []; textWrites = []; fixtureWrites = []; issuedRects = []; },
    work() { return {
      worldDraws, issuedOpcodes, fixtureWrites,
      // The same cell can contain room paint and a Build star. Paint budgets
      // for unrelated rooms exclude the higher locator/preview/label layers.
      issuedRects: issuedRects.filter(({ object }) => object.depth < FACILITY_DEPTH_LOCATOR).map(({ rect }) => rect),
      roomTextCreates: creates.filter(({ object, text: value }) => isRoomText(object, value)).length,
      roomTextWrites: textWrites.filter(({ object }) => isRoomText(object)),
    }; },
    labels() { return bare.objects.filter(object => object.kind === "text" && object.visible && isRoomText(object)); },
  };
}

export function roomCenter(f: ReturnType<typeof canvasClinic>, roomId: string) {
  const room = f.bridge.viewModel.rooms.find(room => room.instanceId === roomId);
  if (!room) throw Error(`Missing projected room ${roomId}`);
  const rect = pixelRoom(f.scene, room);
  return f.camera.matrixCombined.transformPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}

export function interiorFills(rect: RoomRect, fills: readonly (readonly number[])[]) {
  return fills.filter(([x, y, width, height]) => x! > rect.x && y! > rect.y &&
    x! + width! < rect.x + rect.width && y! + height! < rect.y + rect.height);
}

export function expectedDoorCandidates(state: GameState) {
  return state.rooms.reduce((count, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    return definition.kind === "hallway" ? count : count + 2 * (definition.width + definition.height);
  }, 0);
}
