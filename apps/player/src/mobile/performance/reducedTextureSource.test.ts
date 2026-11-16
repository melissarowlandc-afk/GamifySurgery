import { afterEach, expect, it, vi } from "vitest";
import { compactReducedStaticTexture, reducedTextureSource, REDUCED_CHARACTER_SOURCE_SIDE } from "./reducedTextureSource";
import { phoneActorInWindow, phoneActorWindowKey } from "./phoneRenderWindow";

afterEach(() => vi.unstubAllGlobals());
it("caps reduced decoded character pixels without changing the original image or logical display metadata", () => {
  const drawImage = vi.fn(), context = { imageSmoothingEnabled: true, drawImage }, canvas = { width: 0, height: 0, getContext: () => context };
  vi.stubGlobal("document", { createElement: () => canvas });
  const original = { naturalWidth: 600, naturalHeight: 800, width: 600, height: 800 };
  expect(reducedTextureSource(original as any, REDUCED_CHARACTER_SOURCE_SIDE)).toBe(canvas);
  expect(canvas).toMatchObject({ width: 144, height: 192 }); expect(context.imageSmoothingEnabled).toBe(false);
  expect(drawImage).toHaveBeenCalledExactlyOnceWith(original, 0, 0, 144, 192);
  expect(original).toEqual({ naturalWidth: 600, naturalHeight: 800, width: 600, height: 800 });
});
it("keeps small sources and gracefully retains the original when a phone cannot allocate a canvas", () => {
  vi.stubGlobal("document", { createElement: () => ({ getContext: () => null }) });
  const small = { width: 30, height: 40 }, large = { width: 600, height: 800 };
  expect(reducedTextureSource(small as any, 192)).toBe(small);
  expect(reducedTextureSource(large as any, 192)).toBe(large);
});
it("releases a finalized native mask's backing pixels after copying and before publishing its reduced texture", () => {
  const context = { imageSmoothingEnabled: true, drawImage: vi.fn() }, canvas = { width: 0, height: 0, getContext: () => context };
  vi.stubGlobal("document", { createElement: () => canvas });
  const original = { width: 1200, height: 800, getContext() {} }, texture = { getSourceImage: () => original };
  const remove = vi.fn(), addImage = vi.fn(() => {
    expect(original).toMatchObject({ width: 1, height: 1 }); expect(remove).toHaveBeenCalledExactlyOnceWith("owned.mask");
  });
  compactReducedStaticTexture({ exists: () => true, get: () => texture, remove, addImage } as any, "owned.mask");
  expect(context.drawImage).toHaveBeenCalledExactlyOnceWith(original, 0, 0, 384, 256);
  expect(addImage).toHaveBeenCalledExactlyOnceWith("owned.mask", canvas);
});
it("keeps a conservative actor guard band and updates the paused actor window at tile crossings", () => {
  expect(phoneActorInWindow({ x: -40, y: 400 }, { width: 390, height: 700 }, 20)).toBe(true);
  expect(phoneActorInWindow({ x: -100, y: 400 }, { width: 390, height: 700 }, 20)).toBe(false);
  expect(phoneActorWindowKey({ originX: 0, originY: 0, tileSize: 20 }, { width: 390, height: 700 }))
    .not.toBe(phoneActorWindowKey({ originX: 40, originY: 0, tileSize: 20 }, { width: 390, height: 700 }));
});
