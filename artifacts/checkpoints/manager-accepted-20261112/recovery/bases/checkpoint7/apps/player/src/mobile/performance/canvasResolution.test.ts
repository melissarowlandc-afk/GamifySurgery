import { describe, expect, it, vi } from "vitest";
import { installMobileCanvasResolution } from "./canvasResolution";

describe("phone-only physical canvas resolution", () => {
  it("caps DPR3 at 2 while leaving logical dimensions, CSS box and pointer coordinates unchanged", () => {
    const canvas = { width: 390, height: 600, style: {} } as HTMLCanvasElement;
    const setTransform = vi.fn(); const resetTransform = vi.fn();
    const context = { setTransform, resetTransform } as unknown as CanvasRenderingContext2D;
    const resolution = installMobileCanvasResolution(canvas, context);
    const size = resolution.resize(390, 600, 3);
    expect(size).toEqual({ width: 390, height: 600, pixelRatio: 2, backingWidth: 780, backingHeight: 1200 });
    expect(canvas.width).toBe(780); expect(canvas.height).toBe(1200);
    expect(canvas.style).toEqual({ width: "390px", height: "600px" });
    context.setTransform(1, 0, 0, 1, 17, 23);
    expect(setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 34, 46);
    context.setTransform({ a: .5, d: .5, e: -10, f: 40 });
    expect(setTransform).toHaveBeenLastCalledWith(1, 0, 0, 1, -20, 80);
    context.resetTransform(); expect(setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0);
    resolution.destroy(); expect(context.setTransform).toBe(setTransform); expect(context.resetTransform).toBe(resetTransform);
    expect(canvas.width).toBe(390); expect(canvas.height).toBe(600);
  });
  it("resynchronizes after ScaleManager resets the backing bitmap on rotation and supports fractional DPR", () => {
    const canvas = { width: 390, height: 600, style: {} } as HTMLCanvasElement;
    const original = vi.fn(); const context = { setTransform: original, resetTransform: vi.fn() } as unknown as CanvasRenderingContext2D;
    const resolution = installMobileCanvasResolution(canvas, context); resolution.resize(390, 600, 3);
    canvas.width = 844; canvas.height = 260; // actual ScaleManager resize order
    resolution.resize(844, 260, 3);
    expect(canvas.width).toBe(1688); expect(canvas.height).toBe(520); expect(canvas.style.width).toBe("844px");
    resolution.resize(361, 501, 1.5);
    context.setTransform(1, .2, .3, 1, 7, 9);
    const expected = [542 / 361, .2 * 752 / 501, .3 * 542 / 361, 752 / 501, 7 * 542 / 361, 9 * 752 / 501];
    original.mock.calls.at(-1)!.forEach((value, index) => expect(value).toBeCloseTo(expected[index]!, 10));
  });
});
