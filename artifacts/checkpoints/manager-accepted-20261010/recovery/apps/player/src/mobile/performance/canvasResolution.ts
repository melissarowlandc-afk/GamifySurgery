import { mobileCanvasSize } from "./presentationPolicy";

interface MobileCanvasScale {
  updateBounds: () => unknown;
  baseSize: { width: number; height: number };
  canvasBounds: { width: number; height: number };
  displayScale: { set: (x: number, y: number) => unknown };
}

/**
 * Phaser 4 Canvas has no game-resolution option. Leave ScaleManager/baseSize,
 * cameras, culling and pointers logical; scale only main-context transforms.
 * Offscreen art/text/derivative canvases retain their existing resolution.
 */
export function installMobileCanvasResolution(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, scale?: MobileCanvasScale) {
  const originalSet = context.setTransform;
  const originalReset = context.resetTransform;
  let scaleX = 1, scaleY = 1;
  let width = canvas.width, height = canvas.height;
  context.setTransform = (...args: [DOMMatrix2DInit?] | number[]) => {
    const first = args[0];
    const [a, b, c, d, e, f] = typeof first === "object" ? [
      first.a ?? first.m11 ?? 1, first.b ?? first.m12 ?? 0, first.c ?? first.m21 ?? 0,
      first.d ?? first.m22 ?? 1, first.e ?? first.m41 ?? 0, first.f ?? first.m42 ?? 0,
    ] : args as number[];
    Reflect.apply(originalSet, context, [(a ?? 1) * scaleX, (b ?? 0) * scaleY, (c ?? 0) * scaleX,
      (d ?? 1) * scaleY, (e ?? 0) * scaleX, (f ?? 0) * scaleY]);
  };
  context.resetTransform = () => Reflect.apply(originalSet, context, [scaleX, 0, 0, scaleY, 0, 0]);
  return {
    resize(logicalWidth: number, logicalHeight: number, dpr: number) {
      const size = mobileCanvasSize(logicalWidth, logicalHeight, dpr);
      width = size.width; height = size.height;
      scaleX = size.backingWidth / width; scaleY = size.backingHeight / height;
      // A ScaleManager resize resets these to baseSize before this listener.
      if (canvas.width !== size.backingWidth) canvas.width = size.backingWidth;
      if (canvas.height !== size.backingHeight) canvas.height = size.backingHeight;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      // Scale.NONE refreshes bounds before emitting RESIZE. Our CSS box changes
      // in that event, so the old height otherwise keeps scaling every touch.
      // Refresh only input bounds here; refresh() would emit RESIZE recursively.
      if (scale) {
        scale.updateBounds();
        if (scale.canvasBounds.width > 0 && scale.canvasBounds.height > 0) {
          scale.displayScale.set(scale.baseSize.width / scale.canvasBounds.width, scale.baseSize.height / scale.canvasBounds.height);
        }
      }
      context.resetTransform();
      return size;
    },
    destroy() {
      context.setTransform = originalSet; context.resetTransform = originalReset;
      canvas.width = width; canvas.height = height;
    },
  };
}
