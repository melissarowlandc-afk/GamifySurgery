/** Phaser 4.2 Graphics command stream. Checked against the installed Commands
 * table in tests. Unsupported transforms/commands conservatively disable culling. */
export interface GraphicsBounds { left: number; top: number; right: number; bottom: number }
export function measureGraphicsBounds(buffer: readonly number[]): GraphicsBounds | null {
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity, stroke = 1;
  const point = (x: number, y: number) => { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); };
  for (let i = 0; i < buffer.length;) {
    const command = buffer[i++]!;
    switch (command) {
      case 0: { // ARC (including the full circle is conservative).
        const [x, y, radius] = buffer.slice(i, i + 3) as [number, number, number];
        if (radius < 0) return null;
        point(x - radius, y - radius); point(x + radius, y + radius); i += 7; break;
      }
      case 3: { const x = buffer[i++]!, y = buffer[i++]!, w = buffer[i++]!, h = buffer[i++]!; point(x, y); point(x + w, y + h); break; }
      case 4: case 5: point(buffer[i++]!, buffer[i++]!); break;
      case 6: stroke = Math.max(stroke, Math.abs(buffer[i]!)); i += 3; break;
      case 7: i += 2; break;
      case 21: i += 8; break; // Gradient fill changes style, not geometry.
      case 22: stroke = Math.max(stroke, Math.abs(buffer[i]!)); i += 6; break;
      case 10: case 11: for (let vertex = 0; vertex < 3; vertex++) point(buffer[i++]!, buffer[i++]!); break;
      case 1: case 2: case 8: case 9: case 14: case 15: break;
      default: return null;
    }
    if (i > buffer.length) return null;
  }
  if (![left, top, right, bottom, stroke].every(Number.isFinite)) return null;
  // Canvas' default miter limit is 10. Include stroke joins and pixel rounding,
  // not just path vertices, so wall caps/shadows never vanish at viewport edges.
  const margin = stroke * 10 + 2;
  return { left: left - margin, top: top - margin, right: right + margin, bottom: bottom + margin };
}

type Viewport = { x: number; y: number; width: number; height: number };
type Camera = {
  rotation?: number;
  worldView?: Viewport;
  x?: number; y?: number; width?: number; height?: number;
  matrixCombined?: { a: number; b: number; c: number; d: number; e: number; f: number };
  isObjectInversion?: boolean;
  renderToTexture?: boolean;
};
type Graphics = {
  commandBuffer: number[]; x: number; y: number; rotation: number; scaleX: number; scaleY: number;
  scrollFactorX: number; scrollFactorY: number;
  clear: (...args: any[]) => any; renderCanvas?: (...args: any[]) => any;
};
export function graphicsOutsideCamera(bounds: GraphicsBounds | null, graphics: Omit<Graphics, "commandBuffer" | "clear" | "renderCanvas">, camera: Camera): boolean {
  if (!bounds || camera.rotation || camera.isObjectInversion || camera.renderToTexture ||
    graphics.rotation || graphics.scaleX !== 1 || graphics.scaleY !== 1 ||
    graphics.scrollFactorX !== 1 || graphics.scrollFactorY !== 1) return false;

  // GetCalcMatrix uses matrixCombined at scroll factor 1. worldView is
  // centered on the camera's midpoint even when its render origin isn't.
  // Translate the viewport edges into the graphics' local coordinates.
  const matrix = camera.matrixCombined;
  if (matrix) {
    const { a, b, c, d, e, f } = matrix;
    const { x, y, width, height } = camera;
    if (b !== 0 || c !== 0 || !(a > 0 && d > 0) ||
      x === undefined || y === undefined || width === undefined || height === undefined ||
      !(width > 0 && height > 0) || !Number.isFinite(a + d + e + f + x + y + width + height)) return false;
    const left = (x - e) / a - graphics.x;
    const top = (y - f) / d - graphics.y;
    return bounds.right < left || bounds.left > left + width / a ||
      bounds.bottom < top || bounds.top > top + height / d;
  }

  // Callers without a Phaser camera can provide an already resolved world clip.
  const view = camera.worldView;
  return Boolean(view && camera.width === undefined && (
    bounds.right + graphics.x < view.x || bounds.left + graphics.x > view.x + view.width ||
    bounds.bottom + graphics.y < view.y || bounds.top + graphics.y > view.y + view.height));
}
const entries = new WeakMap<Graphics, { bounds: GraphicsBounds | null }>();

/** Bounds computed after a static redraw, never per gesture/frame. Does not
 * change commands/depth/visibility or allocate render textures. clear() fences
 * edits and isolated QA drawings until the next bound calculation. */
export function retainGraphicsViewportBounds(graphics: Graphics): void {
  // Phaser's public declaration omits this internal Canvas method.
  if (typeof graphics.renderCanvas !== "function" || !Array.isArray(graphics.commandBuffer)) return;
  let entry = entries.get(graphics);
  if (!entry) {
    entry = { bounds: null }; entries.set(graphics, entry);
    const state = entry, clear = graphics.clear, render = graphics.renderCanvas;
    graphics.clear = function (...args) { state.bounds = null; return clear.apply(this, args); };
    graphics.renderCanvas = function (renderer, source, camera, parentMatrix, target, allowClip) {
      if (source === this && !parentMatrix && !target && !allowClip && graphicsOutsideCamera(state.bounds, this, camera)) return;
      return render.call(this, renderer, source, camera, parentMatrix, target, allowClip);
    };
  }
  entry.bounds = measureGraphicsBounds(graphics.commandBuffer);
}
