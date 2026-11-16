import type Phaser from 'phaser';
import type { BitmapAssetDescriptor } from '../../art/bitmapAssetManifest';
import variants from './phoneArt.generated.json';
import reducedVariants from './phoneReducedArt.generated.json';
import { phoneMemoryProfile } from './phoneMemoryPolicy';

export interface PhoneArtSource { path: string; width: number; height: number; sourceWidth: number; sourceHeight: number }
const sources: Readonly<Record<string, PhoneArtSource>> = variants;
const reducedSources: Readonly<Record<string, PhoneArtSource>> = reducedVariants;
const scales = new WeakMap<Phaser.Textures.Texture, { scaleX: number; scaleY: number; sourceWidth: number; sourceHeight: number }>();
export function phoneArtSource(asset: BitmapAssetDescriptor, reduced = phoneMemoryProfile().mode === 'reduced'): PhoneArtSource | undefined {
  const source = reduced ? reducedSources[asset.id] ?? sources[asset.id] : sources[asset.id];
  // New/replaced artwork must have a matching generated derivative. Fall back
  // to its original rather than applying stale crop coordinates.
  return source?.sourceWidth === asset.nativeWidth && source.sourceHeight === asset.nativeHeight ? source : undefined;
}

/** Keep authored anchors/draw sizes in logical pixels. Only atlas source cuts
 * use the smaller phone bitmap. No full-resolution decode or resize at open. */
export function installPhoneArtSource(texture: Phaser.Textures.Texture, source: PhoneArtSource): void {
  const scaleX = source.width / source.sourceWidth, scaleY = source.height / source.sourceHeight;
  if (scales.has(texture)) return;
  scales.set(texture, { scaleX, scaleY, sourceWidth: source.sourceWidth, sourceHeight: source.sourceHeight });
  const add = texture.add.bind(texture);
  texture.add = (name, sourceIndex, x, y, width, height) => {
    const left = Math.round(x * scaleX), top = Math.round(y * scaleY);
    return add(name, sourceIndex, left, top, Math.max(1, Math.round((x + width) * scaleX) - left), Math.max(1, Math.round((y + height) * scaleY) - top));
  };
}

/** Source-coordinate dimensions survive another backing-store reduction. */
export function facilityTextureSourceSize(texture: Phaser.Textures.Texture): { width: number; height: number } {
  const known = scales.get(texture);
  if (known) return { width: known.sourceWidth, height: known.sourceHeight };
  const source = texture.getSourceImage() as { width: number; height: number; naturalWidth?: number; naturalHeight?: number };
  return { width: source.naturalWidth || source.width, height: source.naturalHeight || source.height };
}

/** A tile's world period/phase uses authored pixels, including rounded atlas
 * cuts. Only its source sampling coordinates change with the backing bitmap. */
export function facilityTileSourceTransform(texture: Phaser.Textures.Texture, frameName: string | undefined,
  nativeWidth: number, nativeHeight: number, scaleX: number, scaleY: number, positionX = 0, positionY = 0) {
  if (!scales.has(texture)) return { scaleX, scaleY, positionX, positionY };
  const frame = texture.get(frameName), sx = frame.realWidth / nativeWidth, sy = frame.realHeight / nativeHeight;
  return { scaleX: scaleX / sx, scaleY: scaleY / sy, positionX: positionX * sx, positionY: positionY * sy };
}

/** Native-coordinate derivative masks stay unchanged. Read just their crop
 * from the smaller source; never reconstruct a full native atlas. */
export function drawFacilityAtlasCrop(context: CanvasRenderingContext2D, texture: Phaser.Textures.Texture,
  x: number, y: number, width: number, height: number): void {
  const scale = scales.get(texture);
  context.drawImage(texture.getSourceImage() as CanvasImageSource, x * (scale?.scaleX ?? 1), y * (scale?.scaleY ?? 1),
    width * (scale?.scaleX ?? 1), height * (scale?.scaleY ?? 1), 0, 0, width, height);
}

export function facilityAtlasClip(texture: Phaser.Textures.Texture, rect: readonly [number, number, number, number], width: number): [number, number] {
  const scale = scales.get(texture), sx = scale?.scaleX ?? 1, sy = scale?.scaleY ?? 1;
  const frameWidth = Math.round((rect[0] + rect[2]) * sx) - Math.round(rect[0] * sx);
  return [frameWidth * width / rect[2], Math.round((rect[1] + rect[3]) * sy) - Math.round(rect[1] * sy)];
}
