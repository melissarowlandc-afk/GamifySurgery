import type Phaser from "phaser";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";

/** Owned static derivatives need the canvas, not CanvasTexture's permanent
 * ImageData/Uint32Array readback mirror. Atlas coordinates/pixels stay native. */
export interface StaticCanvasSurface {
  context: CanvasRenderingContext2D;
  getContext(): CanvasRenderingContext2D;
  getData(x: number, y: number, width: number, height: number): ImageData;
  putData(data: ImageData, x: number, y: number): unknown;
  update(): unknown;
  refresh(): unknown;
}
export const PHONE_DERIVATIVE_MAX_SIDE = 4096;
export const PHONE_DERIVATIVE_MAX_PIXELS = 4 * 1024 * 1024;

export function facilityCanvasSurface(manager: Phaser.Textures.TextureManager,
  key: string, width: number, height: number, phone: boolean): StaticCanvasSurface | null {
  if (!phone || typeof document === "undefined") return manager.exists(key)
    ? manager.get(key) as Phaser.Textures.CanvasTexture : manager.createCanvas(key, width, height);
  if (![width, height].every(n => Number.isInteger(n) && n > 0 && n <= PHONE_DERIVATIVE_MAX_SIDE) ||
    width * height > PHONE_DERIVATIVE_MAX_PIXELS) return null;
  try {
    let texture: Phaser.Textures.Texture | null = manager.exists(key) ? manager.get(key) : null;
    let canvas = texture?.getSourceImage() as HTMLCanvasElement | undefined;
    if (!canvas) {
      canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    }
    // Preserve Phaser CanvasTexture's backing hint while dropping only its
    // permanent readback mirror, rather than changing the raster strategy.
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) { canvas.width = canvas.height = 1; return null; }
    // Installed Phaser's TextureSource handles canvases; addImage's declaration
    // only lists HTMLImageElement. Use its ordinary Texture, not CanvasTexture.
    if (!texture) texture = manager.addImage(key, canvas as unknown as HTMLImageElement);
    if (!texture) { canvas.width = canvas.height = 1; return null; }
    const refresh = () => texture!.source[0]?.update();
    return { context, getContext: () => context,
      getData: (x, y, w, h) => context.getImageData(x, y, w, h),
      putData: (data, x, y) => context.putImageData(data, x, y), update: refresh, refresh };
  } catch {
    // In particular, iOS can refuse a canvas/context while under pressure.
    problemDiagnostics.event("phone-art", "static-canvas-unavailable");
    return null;
  }
}
