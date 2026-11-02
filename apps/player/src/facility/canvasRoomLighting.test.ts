import { writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { initializeCanvasRoomLighting, assertCanvasRoomLighting } from "./canvasRoomLighting";
import { FacilityScene } from "./FacilityScene";
import { roomThumbnailModel, roomThumbnailStage } from "./roomThumbnailCapture";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 }, Textures: { FilterMode: { NEAREST: 0 } } } }));

function canvasRenderer(supported = true) {
  let operation = "xor", saved = operation;
  const context = {
    save: vi.fn(() => { saved = operation; }), restore: vi.fn(() => { operation = saved; }),
    get globalCompositeOperation() { return operation; },
    set globalCompositeOperation(value: string) { if (supported) operation = value; },
  };
  return { gameContext: context, blendModes: ["source-over", "lighter", "source-over", "source-over"] } as any;
}

/** Real drawRoom + capture lifecycle, recording only native graphics/image I/O. */
function roomCommands(id: string, tier: number, capture: boolean) {
  const model = roomThumbnailModel(id, tier);
  model.rooms[0] = { ...model.rooms[0]!, instanceId: "lighting-room-probe" };
  const room = model.rooms[0]!;
  const scene = new FacilityScene({ viewModel: model, onPlaceRoom: () => false }) as any;
  const children: any[] = [], tinted: unknown[][] = [];
  function drawable(kind: string, initial: unknown[] = []) {
    const commands: unknown[][] = initial.length ? [["create", ...initial]] : [];
    const data = new Map();
    const target: any = { kind, visible: true, depth: 0, commands,
      clear() { commands.length = 0; return proxy; },
      setVisible(value: boolean) { target.visible = value; return proxy; },
      setDepth(value: number) { target.depth = value; return proxy; },
      setData(key: string, value: unknown) { data.set(key, value); return proxy; },
      getData(key: string) { return data.get(key); },
    };
    const proxy: any = new Proxy(target, { get(object, key) {
      if (key in object) return object[key];
      return (...args: unknown[]) => { commands.push([String(key), ...args]); return proxy; };
    } });
    children.push(proxy); return proxy;
  }
  scene.add = { graphics: () => drawable("graphics"), image: (...args: unknown[]) => drawable("image", args) };
  scene.worldGraphics = drawable("floor"); scene.architectureGraphics = drawable("architecture"); scene.terrainGraphics = drawable("terrain");
  scene.children = { each: (callback: (child: unknown) => void) => children.forEach(callback), depthSort: () => {} };
  const camera: any = {};
  for (const name of ["setViewport", "setScroll", "setZoom", "setBackgroundColor"]) camera[name] = () => camera;
  scene.cameras = { main: camera }; scene.scale = { resize() {} }; scene.sys = { isPaused: () => false, pause() {} };
  scene.textures = { exists: () => true, getTextureKeys: () => [] };
  scene.registerApprovedRoomFrame = (record: { id: string }) => record.id;
  scene.ensureApprovedSideChairTextures = () => undefined;
  scene.ensureBacklessRollingStoolTexture = () => "native-stool-texture-probe";
  scene.drawTouchupTintedTop = (...args: unknown[]) => tinted.push(args);
  scene.game = { renderer: canvasRenderer() };
  initializeCanvasRoomLighting(scene.game.renderer);
  assertCanvasRoomLighting(scene.game.renderer);
  const stage = roomThumbnailStage(room.width, room.height);
  scene.layout = { originX: stage.originX, originY: stage.originY, tileSize: stage.tileSize,
    width: room.width * stage.tileSize, height: room.height * stage.tileSize };
  if (capture) scene.renderRoomThumbnail();
  else scene.drawRoom(scene.worldGraphics, room, 0);
  return { drawables: children.filter(child => child.visible && child.commands.length).map(child =>
    ({ kind: child.kind, depth: child.depth, commands: child.commands })), tinted };
}

describe("room lighting in Canvas and isolated captures", () => {
  it("refreshes a startup-cached source-over table only for native supported modes, preserving context state", () => {
    const renderer = canvasRenderer();
    expect(() => assertCanvasRoomLighting(renderer)).toThrow(/MULTIPLY/);
    initializeCanvasRoomLighting(renderer);
    expect(renderer.blendModes).toEqual(["source-over", "lighter", "multiply", "screen"]);
    expect(renderer.gameContext.globalCompositeOperation).toBe("xor");
    expect(renderer.gameContext.restore).toHaveBeenCalledOnce();
    expect(() => assertCanvasRoomLighting(renderer)).not.toThrow();
    initializeCanvasRoomLighting(renderer);
    expect(renderer.blendModes[2]).toBe("multiply");
  });

  it("does not force unsupported operations or change WebGL; QA rejects unsupported lighting", () => {
    const unsupported = canvasRenderer(false);
    initializeCanvasRoomLighting(unsupported);
    expect(unsupported.blendModes[2]).toBe("source-over");
    expect(() => assertCanvasRoomLighting(unsupported)).toThrow(/native Canvas/);
    expect(() => initializeCanvasRoomLighting({} as any)).not.toThrow();
    expect(() => assertCanvasRoomLighting({} as any)).toThrow(/native Canvas/);
  });

  it.each(["room.ambulatory_or", "room.staff_break", "room.reading"])("keeps the complete live room draw path visible in capture for %s", id => {
    const live = roomCommands(id, 1, false), captured = roomCommands(id, 1, true);
    expect(captured).toEqual(live);
    expect(captured.drawables.filter(item => item.kind === "image").length).toBeGreaterThan(5);
    expect(captured.drawables.find(item => item.kind === "floor")?.commands.length).toBeGreaterThan(30);
    expect(captured.drawables.some(item => item.commands.some((command: unknown[]) => command[0] === "setBlendMode" && command[1] === 2))).toBe(true);
    if (process.env.ROOM_THUMBNAIL_LIGHTING_REPORT) {
      writeFileSync(`${process.env.ROOM_THUMBNAIL_LIGHTING_REPORT}/${id.slice(5)}.json`, JSON.stringify({ id, live, captured }, null, 2));
    }
  });

  it("confirms the live Waiting Room shell, floor, furniture and touchups are identical at tiers 1/5", () => {
    const base = roomCommands("room.waiting", 1, false), upgraded = roomCommands("room.waiting", 5, false);
    expect(upgraded).toEqual(base);
    expect(base.drawables.filter(item => item.kind === "image").length).toBeGreaterThan(5);
    if (process.env.ROOM_THUMBNAIL_LIGHTING_REPORT) {
      writeFileSync(`${process.env.ROOM_THUMBNAIL_LIGHTING_REPORT}/waiting-tiers.json`, JSON.stringify({ base, upgraded }, null, 2));
    }
  });
});
