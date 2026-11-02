import Phaser from "phaser";

/**
 * Phaser 4.2.1 snapshots its async CanvasFeatures probe at Game construction.
 * An immediate boot can retain source-over for MULTIPLY/SCREEN forever.
 * Recheck native support synchronously once the scene is created. Restoring
 * the context leaves subsequent live/thumbnail draws exactly as authored.
 */
export function initializeCanvasRoomLighting(renderer: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer): void {
  if (!("gameContext" in renderer)) return;
  const context = renderer.gameContext;
  context.save();
  try {
    for (const [mode, operation] of [[Phaser.BlendModes.MULTIPLY, "multiply"], [Phaser.BlendModes.SCREEN, "screen"]] as const) {
      context.globalCompositeOperation = operation;
      if (context.globalCompositeOperation === operation) renderer.blendModes[mode] = operation;
    }
  } finally { context.restore(); }
}

/** A capture must fail rather than silently replace room art with a tint. */
export function assertCanvasRoomLighting(renderer: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer): void {
  if (!("gameContext" in renderer) || renderer.blendModes[Phaser.BlendModes.MULTIPLY] !== "multiply" ||
      renderer.blendModes[Phaser.BlendModes.SCREEN] !== "screen") {
    throw new Error("Room capture requires native Canvas MULTIPLY and SCREEN lighting");
  }
}
