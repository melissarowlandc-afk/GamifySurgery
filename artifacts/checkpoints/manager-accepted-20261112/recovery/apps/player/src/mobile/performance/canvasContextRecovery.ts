/** Canvas 2D lifecycle only. Never creates a GL context, reloads or touches saves. */
export function bindCanvasContextRecovery(canvas: Pick<HTMLCanvasElement, "addEventListener" | "removeEventListener">,
  callbacks: { lost(): void; restored(): void; diagnose(code: string): void }) {
  let lost = false;
  const onLost = () => {
    if (lost) return;
    lost = true; callbacks.diagnose("facility-canvas-context-lost"); callbacks.lost();
    // Leave the Canvas 2D default restoration behavior enabled.
  };
  const onRestored = () => {
    if (!lost) return;
    lost = false;
    try { callbacks.restored(); callbacks.diagnose("facility-canvas-context-restored"); }
    catch { callbacks.diagnose("facility-canvas-restore-failed"); }
  };
  canvas.addEventListener("contextlost", onLost); canvas.addEventListener("contextrestored", onRestored);
  return { get lost() { return lost; }, dispose() {
    canvas.removeEventListener("contextlost", onLost); canvas.removeEventListener("contextrestored", onRestored);
  } };
}
