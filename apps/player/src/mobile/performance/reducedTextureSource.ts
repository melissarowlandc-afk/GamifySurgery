import type Phaser from "phaser";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { facilityTextureSourceSize, installPhoneArtSource } from "./phoneArt";

export const REDUCED_CHARACTER_SOURCE_SIDE = 192;
export const REDUCED_STATIC_SOURCE_SIDE = 384;

/** Preserve logical frames, origin ratios and display sizes; retain fewer
 * decoded pixels for the small phone canvas. No readback/PNG encode or worker. */
export function reducedTextureSource(image: CanvasImageSource, maxSide: number): CanvasImageSource {
  const source = image as { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };
  const width = source.naturalWidth || source.width || 0, height = source.naturalHeight || source.height || 0;
  if (!width || !height || Math.max(width, height) <= maxSide || typeof document === "undefined") return image;
  try {
    const canvas = document.createElement("canvas"), scale = maxSide / Math.max(width, height);
    canvas.width = Math.max(1, Math.round(width * scale)); canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) return image;
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } catch { problemDiagnostics.event("phone-art", "source-resize-fallback"); return image; }
}

/** Called only after a newly created native-coordinate mask is finalized,
 * before its first sprite/frame registration. Old masks can then be released. */
export function compactReducedStaticTexture(manager: Phaser.Textures.TextureManager, key: string): void {
  if (!manager.exists(key)) return;
  const texture = manager.get(key), image = texture.getSourceImage() as CanvasImageSource;
  const reduced = reducedTextureSource(image, REDUCED_STATIC_SOURCE_SIDE);
  if (reduced === image) return;
  const logical = facilityTextureSourceSize(texture);
  manager.remove(key);
  // These are owned, finalized masks. Free their native scratch backing store
  // immediately instead of waiting for WebKit to collect the old canvas.
  if (typeof (image as HTMLCanvasElement).getContext === "function") {
    (image as HTMLCanvasElement).width = 1; (image as HTMLCanvasElement).height = 1;
  }
  const compacted = manager.addImage(key, reduced as HTMLImageElement);
  if (compacted) {
    const size = reduced as { width: number; height: number };
    installPhoneArtSource(compacted, { path: "", width: size.width, height: size.height,
      sourceWidth: logical.width, sourceHeight: logical.height });
  }
}
