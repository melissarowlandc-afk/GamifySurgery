import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { expect, it, vi } from "vitest";
import { graphicsOutsideCamera, measureGraphicsBounds, retainGraphicsViewportBounds } from "./graphicsViewportCulling";

const object = () => ({ x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, scrollFactorX: 1, scrollFactorY: 1 });
const camera = { worldView: { x: 0, y: 0, width: 100, height: 80 } };
it("matches the installed Phaser encoder's command IDs, including arcs and triangles", () => {
  const require = createRequire(import.meta.url), root = dirname(require.resolve("phaser/package.json"));
  const commands = require(join(root, "src/gameobjects/graphics/Commands.js"));
  expect(commands).toMatchObject({ ARC: 0, BEGIN_PATH: 1, CLOSE_PATH: 2, FILL_RECT: 3, LINE_TO: 4, MOVE_TO: 5,
    LINE_STYLE: 6, FILL_STYLE: 7, FILL_PATH: 8, STROKE_PATH: 9, FILL_TRIANGLE: 10, STROKE_TRIANGLE: 11,
    SAVE: 14, RESTORE: 15, TRANSLATE: 16, SCALE: 17, ROTATE: 18 });
});
it("includes stroke joins, negative rectangles, full arcs and line/triangle vertices", () => {
  const bounds = measureGraphicsBounds([6, 2, 0, 1, 7, 0, 1, 3, 100, 100, -20, -30, 0, 10, 20, 7, 0, Math.PI, false as unknown as number, 0,
    1, 5, -4, -8, 4, 40, 10, 9, 10, -1, -2, 5, -3, 8, 9]);
  expect(bounds).toEqual({ left: -26, top: -30, right: 122, bottom: 122 });
  // A stroke immediately outside the viewport still reaches its edge.
  expect(graphicsOutsideCamera(measureGraphicsBounds([6, 4, 0, 1, 3, 102, 0, 2, 20]), object(), camera)).toBe(false);
});
it("preserves exact commands and render order, skipping only whole objects beyond the conservative bounds", () => {
  const calls: number[] = [], make = (x: number) => ({ ...object(), commandBuffer: [7, 0xffffff, 1, 3, x, 10, 20, 20],
    clear() { this.commandBuffer.length = 0; return this; }, renderCanvas(..._args: unknown[]) { calls.push(x); } });
  const objects = [make(-1000), make(10), make(30), make(1000)], bytes = objects.map(o => JSON.stringify(o.commandBuffer));
  objects.forEach(retainGraphicsViewportBounds);
  for (const graphics of objects) graphics.renderCanvas.call(graphics, undefined, graphics, camera);
  expect(calls).toEqual([10, 30]); expect(objects.map(o => JSON.stringify(o.commandBuffer))).toEqual(bytes);
  objects[0]!.clear(); objects[0]!.commandBuffer.push(3, 10, 10, 20, 20);
  objects[0]!.renderCanvas.call(objects[0], undefined, objects[0], camera);
  expect(calls.at(-1)).toBe(-1000); // Editing invalidates stale bounds even before rebinding.
});
it("falls back for unknown transforms/commands, parent matrices and transformed objects", () => {
  for (const buffer of [[], [16, 400, 500, 3, 0, 0, 10, 10], [99], [3, 0, 0], [3, NaN, 0, 20, 20]])
    expect(measureGraphicsBounds(buffer)).toBeNull();
  const bounds = measureGraphicsBounds([3, 1000, 0, 10, 10]);
  expect(graphicsOutsideCamera(bounds, { ...object(), scaleX: 2 }, camera)).toBe(false);
  const render = vi.fn(), graphics = { ...object(), commandBuffer: [3, 1000, 0, 10, 10], clear() {}, renderCanvas: render };
  retainGraphicsViewportBounds(graphics); graphics.renderCanvas(null, graphics, camera, {});
  expect(render).toHaveBeenCalledOnce();
  graphics.renderCanvas(null, graphics, camera, undefined, {});
  expect(render).toHaveBeenCalledTimes(2); // Alternate render targets retain their original behavior.
});
it("never excludes intersecting rectangles over deterministic negative origins and zoomed world views", () => {
  for (let i = 0; i < 1000; i++) {
    const x = i % 71 - 35, y = i % 53 - 26, w = i % 17 + 1, h = i % 13 + 1;
    const view = { x: x + w / 2, y: y + h / 2, width: 500 / (i % 24 + 1), height: 300 / (i % 24 + 1) };
    expect(graphicsOutsideCamera(measureGraphicsBounds([3, x, y, w, h]), object(), { worldView: view })).toBe(false);
  }
});
