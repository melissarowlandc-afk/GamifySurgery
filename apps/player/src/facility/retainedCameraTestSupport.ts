import { FacilityScene } from "./FacilityScene";
import type { FacilityViewModel } from "./types";

/** Executes the real renderer's geometry/invalidation without DOM, GPU, image
 * decoding or text rasterization. Counts are real API calls; times are CPU-only. */
export function headlessFacilityScene(model: FacilityViewModel, mobile = false, trace = false) {
  const stats = { created: 0, destroyed: 0, commands: 0, worldDraws: 0 };
  const objects: any[] = [];
  const display = (kind = "graphics", x = 0, y = 0, text = "") => {
    stats.created++;
    const data = new Map<string, unknown>();
    const value: any = { kind, x, y, text, width: 32, height: 32, displayWidth: 32, displayHeight: 32,
      visible: true, depth: 0, scaleX: 1, scaleY: 1, list: [], style: {}, commandBuffer: [],
      setData(key: string | Record<string, unknown>, item?: unknown) {
        if (typeof key === "string") data.set(key, item);
        else for (const [name, value] of Object.entries(key)) data.set(name, value);
        return proxy;
      }, getData: (key: string) => data.get(key),
      setPosition(a: number, b: number) { value.x = a; value.y = b; return proxy; },
      setScale(a: number, b = a) { value.scaleX = a; value.scaleY = b; return proxy; },
      setVisible(on: boolean) { value.visible = on; return proxy; },
      setDepth(n: number) { value.depth = n; return proxy; },
      setText(s: string) { value.text = s; return proxy; },
      setOrigin(x: number, y = x) { value.originX = x; value.originY = y; return proxy; },
      setDisplaySize(width: number, height: number) { value.displayWidth = width; value.displayHeight = height; return proxy; },
      setTexture(key: string) { value.texture = { key, source: [{ scaleMode: 1 }] }; return proxy; },
      destroy() { stats.destroyed++; value.visible = false; },
      clear() { stats.commands++; value.commandBuffer = []; return proxy; },
      add(child: unknown) {
        for (const entry of Array.isArray(child) ? child : [child]) { entry.parentContainer = proxy; value.list.push(entry); }
        return proxy;
      },
      getByName(name: string) { return value.list.find((child: any) => child.name === name) ?? null; },
      setName(name: string) { value.name = name; return proxy; },
      getBounds() {
        const x = value.x + (value.parentContainer?.x ?? 0) - (value.originX ?? 0) * value.displayWidth;
        const y = value.y + (value.parentContainer?.y ?? 0) - (value.originY ?? 0) * value.displayHeight;
        return { x, y, left: x, top: y, width: value.displayWidth, height: value.displayHeight,
          right: x + value.displayWidth, bottom: y + value.displayHeight,
          centerX: x + value.displayWidth / 2, centerY: y + value.displayHeight / 2 };
      },
    };
    const proxy = new Proxy(value, { get(target, key) {
      if (key in target || typeof key !== "string") return target[key];
      return target[key] = (...args: unknown[]) => { stats.commands++; if (trace) target.commandBuffer.push([key, ...args]); return proxy; };
    } });
    objects.push(proxy); return proxy;
  };
  const bridge = { viewModel: model, mobileInput: mobile, onPlaceRoom: () => true,
    onCameraChange: (_camera: unknown) => {} };
  const scene = new FacilityScene(bridge) as any;
  scene.scale = { width: mobile ? 390 : 1100, height: mobile ? 700 : 560 };
  const camera: any = { originX: 0.5, originY: 0.5, zoom: 1, scrollX: 0, scrollY: 0,
    setOrigin(x: number, y = x) { this.originX = x; this.originY = y; return this; },
    setScroll(x: number, y: number) { this.scrollX = x; this.scrollY = y; return this; },
    setZoom(zoom: number) { this.zoom = zoom; return this; },
    setRoundPixels(value: boolean) { this.roundPixels = value; return this; }, setVisible() { return this; } };
  scene.cameras = { main: camera };
  scene.sys = { isActive: () => true };
  scene.game = { canvas: { style: {} } };
  scene.time = { now: 0 };
  scene.textures = { exists: () => false };
  scene.add = { graphics: () => display(), text: (x: number, y: number, text: string) => display("text", x, y, text),
    image: (x: number, y: number) => display("image", x, y), container: (x: number, y: number) => display("container", x, y),
    sprite: (x: number, y: number) => display("sprite", x, y) };
  for (const name of ["terrainGraphics", "worldGraphics", "architectureGraphics", "landscapeGraphics", "locatorGraphics", "ghostGraphics"])
    scene[name] = display();
  const world = scene.drawWorld.bind(scene);
  scene.drawWorld = () => { stats.worldDraws++; world(); };
  scene.refreshLayout(true);
  return { scene, bridge, camera, stats, objects };
}
