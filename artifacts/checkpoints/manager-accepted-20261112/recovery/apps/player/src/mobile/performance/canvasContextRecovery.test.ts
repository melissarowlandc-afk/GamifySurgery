import { expect, it, vi } from "vitest";
import { bindCanvasContextRecovery } from "./canvasContextRecovery";
import { facilityMemorySnapshot } from "./facilityMemory";

it("sleeps/restores presentation once, enables default 2D recovery and removes listeners", () => {
  const canvas = new EventTarget(), callbacks = { lost: vi.fn(), restored: vi.fn(), diagnose: vi.fn() };
  const recovery = bindCanvasContextRecovery(canvas as any, callbacks);
  canvas.dispatchEvent(new Event("contextrestored")); expect(callbacks.restored).not.toHaveBeenCalled();
  const loss = new Event("contextlost", { cancelable: true }); canvas.dispatchEvent(loss);
  canvas.dispatchEvent(new Event("contextlost")); expect(recovery.lost).toBe(true);
  expect(callbacks.lost).toHaveBeenCalledOnce(); expect(loss.defaultPrevented).toBe(false);
  canvas.dispatchEvent(new Event("contextrestored")); expect(recovery.lost).toBe(false);
  expect(callbacks.restored).toHaveBeenCalledOnce(); recovery.dispose();
  canvas.dispatchEvent(new Event("contextlost")); expect(callbacks.lost).toHaveBeenCalledOnce();
});
it("reports failed restoration without throwing or initiating a page reload", () => {
  const canvas = new EventTarget(), diagnose = vi.fn();
  const binding = bindCanvasContextRecovery(canvas as any, { lost() {}, restored() { throw Error("Unavailable"); }, diagnose });
  canvas.dispatchEvent(new Event("contextlost")); canvas.dispatchEvent(new Event("contextrestored"));
  expect(diagnose).toHaveBeenLastCalledWith("facility-canvas-restore-failed"); binding.dispose();
});
it("deduplicates texture sources, readback aliases and nested display objects in on-demand diagnostics", () => {
  const image = { width: 8, height: 4, getContext() {} }, data = new Uint8ClampedArray(128);
  const graphics = { commandBuffer: [1, 2, 3] }, parent = { list: [graphics] };
  const textures = { a: { source: [{ image }], data }, b: { source: [{ image }], buffer: data.buffer } };
  expect(facilityMemorySnapshot([parent, graphics], textures)).toEqual({ displayObjects: 2,
    graphicsCommandNumbers: 3, textures: 2, nominalRgbaBytes: 128, canvasSources: 1,
    readbackBytes: 128, maxTextureSide: 8, renderTextures: 0 });
});
