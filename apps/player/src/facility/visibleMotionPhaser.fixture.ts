import { nativePhaserMemoryClass as native } from "./nativePhaserMemoryTestSupport";
import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";

const Emitter = native("events/EventEmitter.js");
const TimeStep = native("core/TimeStep.js");
// Game's module graph also imports individual browser-device probes. They are
// irrelevant to its native focus handlers and cannot run in this Node host.
function gameClass() {
  const require = createRequire(import.meta.url), directory = join(dirname(require.resolve("phaser/package.json")), "src/device");
  const previous = readdirSync(directory).filter(name => name.endsWith(".js")).map(name => {
    const path = join(directory, name), value = require.cache[path];
    require.cache[path] = { id: path, filename: path, loaded: true, exports: {} } as NodeJS.Module;
    return [path, value] as const;
  });
  try { return native("core/Game.js"); }
  finally { for (const [path, value] of previous) { if (value) require.cache[path] = value; else delete require.cache[path]; } }
}
const NativeGame = gameClass();
const VisibilityHandler = native("core/VisibilityHandler.js");
const CoreEvents = native("core/events/index.js");
const SceneEvents = native("scene/events/index.js");
const SceneState = native("scene/const.js");

/** DOM/GPU transport only. Installed TimeStep, RAF, visibility handler, Scene,
 * Systems, and the application's create/update/route/hop/seat code are real.
 * Raster/asset/input payloads cannot determine elapsed time or walking. */
export const motionGames: MotionGame[] = [];

function display(kind: string, x = 0, y = 0) {
  const data = new Map<string, unknown>();
  const object: any = { kind, x, y, visible: true, scaleX: 1, scaleY: 1, width: 32, height: 32,
    displayWidth: 32, displayHeight: 32, list: [], style: {},
    setData(key: string | Record<string, unknown>, value?: unknown) {
      if (typeof key === "string") data.set(key, value);
      else for (const [name, item] of Object.entries(key)) data.set(name, item);
      return proxy;
    }, getData: (key: string) => data.get(key),
    setPosition(a: number, b: number) { object.x = a; object.y = b; return proxy; },
    setVisible(value: boolean) { object.visible = value; return proxy; },
    setDepth(value: number) { object.depth = value; return proxy; },
    setScale(a: number, b = a) { object.scaleX = a; object.scaleY = b; return proxy; },
    setOrigin(a: number, b = a) { object.originX = a; object.originY = b; return proxy; },
    setDisplaySize(a: number, b: number) { object.displayWidth = a; object.displayHeight = b; return proxy; },
    setText(text: string) { object.text = text; return proxy; },
    add(items: any) { object.list.push(...(Array.isArray(items) ? items : [items])); return proxy; },
    getByName: (name: string) => object.list.find((child: any) => child.name === name),
    destroy() { object.visible = false; },
    getBounds() { return { x: object.x, y: object.y, left: object.x, top: object.y,
      width: object.displayWidth, height: object.displayHeight,
      right: object.x + object.displayWidth, bottom: object.y + object.displayHeight }; },
  };
  const proxy: any = new Proxy(object, { get(target, key) {
    if (key in target || typeof key !== "string") return target[key];
    return target[key] = () => proxy;
  } });
  return proxy;
}

export class MotionGame {
  readonly events = new Emitter();
  readonly textures = Object.assign(new Emitter(), { list: {}, exists: () => false, getTextureKeys: () => [] });
  readonly renderer = new Emitter();
  readonly canvas = document.createElement("canvas");
  readonly loop: any;
  readonly scale: any;
  readonly scene: any;
  readonly draws = new Map<string, any>();
  isBooted = true; isPaused = false; hasFocus = true; updates = 0;
  constructor(readonly config: any) {
    const scene = config.scene;
    this.scene = { getScene: () => scene };
    this.scale = Object.assign(new Emitter(), { width: config.width, height: config.height,
      resize: (width: number, height: number) => { this.scale.width = width; this.scale.height = height; } });
    config.parent.appendChild(this.canvas);
    Object.assign(this.canvas, { width: config.width, height: config.height });
    scene.game = this; scene.scale = this.scale;
    const camera = { originX: .5, originY: .5, zoom: 1, scrollX: 0, scrollY: 0,
      setOrigin(a: number, b = a) { this.originX = a; this.originY = b; return this; },
      setScroll(x: number, y: number) { this.scrollX = x; this.scrollY = y; return this; },
      setZoom(value: number) { this.zoom = value; return this; },
      setRoundPixels() { return this; }, setVisible() { return this; }, setBackgroundColor() { return this; } };
    scene.cameras = { main: camera };
    scene.textures = this.textures;
    scene.time = { now: 0 };
    scene.add = { graphics: () => display("graphics"), text: (x: number, y: number) => display("text", x, y),
      image: (x: number, y: number) => display("image", x, y), container: (x: number, y: number) => display("container", x, y),
      tileSprite: (x: number, y: number) => display("tiles", x, y), sprite: (x: number, y: number) => display("sprite", x, y) };
    // The native Scene constructor owns this actual Systems instance.
    scene.sys.game = this; scene.sys.events = new Emitter(); scene.events = scene.sys.events;
    scene.sys.settings.status = SceneState.RUNNING; scene.sys.sceneUpdate = scene.update;
    scene.sys.queueDepthSort = () => {};
    scene.bindInput = () => {}; // Pointer picking is outside the motion-clock contract.
    scene.ensureEnvironmentAtlas = () => {}; scene.ensureCharacterStills = () => {};
    scene.drawPixelPerson = (graphics: any, centerX: number, baseY: number, offsetIndex: number,
      _appearance: unknown, _color: number, direction: string, pose: string, rightFacing: boolean,
      _scale: number, representation: string | undefined, frozen: boolean, seated: boolean, motion: unknown) => {
      const key = graphics.getData("character-key");
      this.draws.set(key, { centerX, baseY, offsetIndex, direction, pose, rightFacing, frozen, seated, motion });
      graphics.setPosition(centerX, baseY);
      return { baseY, representation: representation ?? "neutral" };
    };
    this.loop = new TimeStep(this, config.fps ?? {});
    for (const [event, method] of [[CoreEvents.BLUR, "onBlur"], [CoreEvents.FOCUS, "onFocus"],
      [CoreEvents.HIDDEN, "onHidden"], [CoreEvents.VISIBLE, "onVisible"]]) {
      this.events.on(event, NativeGame.prototype[method], this);
    }
    VisibilityHandler(this);
    scene.create();
    this.loop.start((time: number, delta: number) => {
      if (!this.isPaused && document.visibilityState !== "hidden") {
        scene.time.now = time; scene.sys.step(time, delta); this.updates++;
      }
      this.events.emit(CoreEvents.POST_STEP, time, delta);
    });
    motionGames.push(this);
  }
  resume() { NativeGame.prototype.resume.call(this); }
  destroy() { this.loop.stop(); this.config.scene.sys.events.emit(SceneEvents.SHUTDOWN); this.events.removeAllListeners(); this.canvas.remove(); }
}

export function motionPhaserNamespace() {
  return { Scene: native("scene/Scene.js"), Game: MotionGame, CANVAS: 1,
    Core: { Events: CoreEvents }, Scenes: { Events: SceneEvents },
    Scale: { NONE: 0, Events: { RESIZE: "resize" } },
    Renderer: { Events: { PRE_RENDER: "prerender" } },
    Textures: { Events: { ADD: "addtexture" }, FilterMode: { LINEAR: 1 } },
    BlendModes: { MULTIPLY: 2, SCREEN: 3 },
    Display: { Color: { HexStringToColor: (value: string) => ({ color: Number.parseInt(value.replace("#", ""), 16) }) } } };
}
