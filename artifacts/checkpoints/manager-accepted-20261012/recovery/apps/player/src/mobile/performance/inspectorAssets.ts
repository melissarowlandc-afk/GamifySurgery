import type { BitmapAssetDescriptor } from "../../art/bitmapAssetManifest";
import { resolvePublicArtAssetUrl } from "../../art/bitmapAssetManifest";
import { mobileBitmapCache } from "./roomAssets";

export function isInspectorBitmapAsset(asset: BitmapAssetDescriptor): boolean {
  return asset.kind === "character" && Boolean(asset.relativePath?.startsWith("art/characters/inspector-v6f/"));
}

/** The phone's shared decoded-source cache loads only the live inspector cardinals. */
export function loadMobileInspectorBitmap(asset: BitmapAssetDescriptor): Promise<HTMLImageElement | null> {
  return mobileBitmapCache.load(asset, resolvePublicArtAssetUrl(asset.relativePath!));
}
