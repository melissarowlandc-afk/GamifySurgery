import { afterEach, expect, it, vi } from "vitest";
import { nativePhaserMemoryClass } from "../../facility/nativePhaserMemoryTestSupport";
import { facilityCanvasSurface } from "./staticCanvasTexture";

afterEach(() => vi.unstubAllGlobals());
class PixelCanvas {
  width = 16; height = 8;
  bytes = Uint8ClampedArray.from({ length: 16 * 8 * 4 }, (_, i) => i % 251);
  reads = 0;
  contextRequests: unknown[][] = [];
  context = { getImageData: (_x: number, _y: number, w: number, h: number) => {
    this.reads++; return { width: w, height: h, data: this.bytes.slice() };
  }, putImageData: (data: ImageData) => { this.bytes.set(data.data); } };
  getContext(...args: unknown[]) { this.contextRequests.push(args); return this.context; }
}
function manager() {
  vi.stubGlobal("window", {}); vi.stubGlobal("HTMLCanvasElement", PixelCanvas);
  const Texture = nativePhaserMemoryClass("textures/Texture.js");
  const CanvasTexture = nativePhaserMemoryClass("textures/CanvasTexture.js");
  const ImageParser = nativePhaserMemoryClass("textures/parsers/Image.js");
  const rows = new Map<string, any>();
  const value: any = { game: { renderer: { gl: null, config: {} }, config: { renderType: 1 } },
    exists: (key: string) => rows.has(key), get: (key: string) => rows.get(key),
    addImage: vi.fn((key: string, canvas: PixelCanvas) => { const t = new Texture(value, key, canvas); ImageParser(t, 0); rows.set(key, t); return t; }),
    createCanvas: vi.fn((key: string, width: number, height: number) => { const canvas = new PixelCanvas();
      canvas.width = width; canvas.height = height;
      const t = new CanvasTexture(value, key, canvas, width, height); rows.set(key, t); return t; }),
  };
  vi.stubGlobal("document", { createElement: () => new PixelCanvas() });
  return { value, rows };
}

it("keeps byte-exact pixels/native frames without CanvasTexture's permanent CPU mirror on phones", () => {
  const m = manager();
  const before = facilityCanvasSurface(m.value, "old", 16, 8, false)!;
  const after = facilityCanvasSurface(m.value, "phone", 16, 8, true)!;
  const old = m.rows.get("old"), current = m.rows.get("phone");
  expect(current.source[0].isCanvas).toBe(true);
  expect(current.getSourceImage().contextRequests[0]).toEqual(old.getSourceImage().contextRequests[0]);
  expect(current.getSourceImage().contextRequests[0]).toEqual(["2d", { willReadFrequently: true }]);
  expect(current.getSourceImage().reads).toBe(0); expect(old.data.byteLength).toBe(512);
  expect(current.data).toBeUndefined(); expect(current.imageData).toBeUndefined();
  expect(after.getData(0, 0, 16, 8)).toEqual(before.getData(0, 0, 16, 8));
  for (const surface of [before, after]) {
    const pixels = surface.getData(0, 0, 16, 8); pixels.data[3] = 17; surface.putData(pixels, 0, 0); surface.refresh();
  }
  expect(current.getSourceImage().bytes).toEqual(old.getSourceImage().bytes);
  for (const t of [old, current]) t.add("crop", 0, 2, 1, 8, 4);
  for (const field of ["cutX", "cutY", "cutWidth", "cutHeight", "realWidth", "realHeight"])
    expect(current.get("crop")[field]).toBe(old.get("crop")[field]);
  expect(facilityCanvasSurface(m.value, "phone", 16, 8, true)!.getContext()).toBe(after.getContext());
  expect(m.value.addImage).toHaveBeenCalledOnce(); expect(m.value.createCanvas).toHaveBeenCalledOnce();
});

it("rejects unsafe derivative sizes before allocation and uses a procedural fallback for refused contexts", () => {
  const createElement = vi.fn(() => ({ width: 0, height: 0, getContext: () => null }));
  vi.stubGlobal("document", { createElement });
  const value = { exists: () => false } as any;
  for (const [w, h] of [[7611, 749], [4096, 4096], [0, 1], [NaN, 8]])
    expect(facilityCanvasSurface(value, "no", w!, h!, true)).toBeNull();
  expect(createElement).not.toHaveBeenCalled();
  expect(facilityCanvasSurface(value, "refused", 16, 8, true)).toBeNull();
  createElement.mockImplementation(() => { throw new Error("Canvas unavailable"); });
  expect(() => facilityCanvasSurface(value, "throw", 16, 8, true)).not.toThrow();
});
