import {
  getEnvironmentAtlasFrameKey,
  resolveBitmapAsset,
  resolvePublicArtAssetUrl,
  type BitmapAtlasFrameDescriptor,
  type BitmapAssetDescriptor,
  type ResolvedBitmapAsset,
} from "./bitmapAssetManifest";

export interface PhaserImageLoaderLike {
  image: (key: string, url: string) => void;
}

export interface PhaserTextureLike {
  has: (name: string) => boolean;
  add: (
    name: string,
    sourceIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => unknown;
}

export interface PhaserBitmapRenderPlan<TFallback> {
  readonly textureKey?: string;
  readonly anchor: Readonly<{ x: number; y: number }>;
  readonly fallback: TFallback;
  readonly source: "bitmap" | "procedural";
}

export interface ReactBitmapRenderPlan<TFallback> {
  readonly src?: string;
  readonly nativeWidth: number;
  readonly nativeHeight: number;
  readonly fallback: TFallback;
  readonly source: "bitmap" | "procedural";
}

export function getPhaserTextureKey(descriptor: BitmapAssetDescriptor): string {
  return `stitchin-time-art:${descriptor.id}`;
}

/** Registers named, non-uniform atlas frames without assuming a sprite grid. */
export function registerPhaserAtlasFrames(
  texture: PhaserTextureLike,
  frames: readonly BitmapAtlasFrameDescriptor[],
): readonly string[] {
  const registered: string[] = [];
  for (const frame of frames) {
    const key = getEnvironmentAtlasFrameKey(frame);
    if (texture.has(key)) continue;
    texture.add(
      key,
      0,
      frame.sourceRect.x,
      frame.sourceRect.y,
      frame.sourceRect.width,
      frame.sourceRect.height,
    );
    registered.push(key);
  }
  return registered;
}

export function preloadBitmapAssets(
  loader: PhaserImageLoaderLike,
  assets: readonly BitmapAssetDescriptor[],
  basePath?: string,
): readonly string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const asset of assets) {
    if (!asset.relativePath) continue;
    const key = getPhaserTextureKey(asset);
    if (seen.has(key)) continue;
    seen.add(key);
    loader.image(key, resolvePublicArtAssetUrl(asset.relativePath, basePath));
    keys.push(key);
  }
  return keys;
}

export function getPhaserBitmapRenderPlan<TFallback>(
  resolved: ResolvedBitmapAsset<TFallback>,
): PhaserBitmapRenderPlan<TFallback> {
  return {
    textureKey:
      resolved.source === "bitmap"
        ? getPhaserTextureKey(resolved.descriptor)
        : undefined,
    anchor: {
      x: resolved.descriptor.anchor.x / Math.max(1, resolved.descriptor.nativeWidth),
      y: resolved.descriptor.anchor.y / Math.max(1, resolved.descriptor.nativeHeight),
    },
    fallback: resolved.fallback,
    source: resolved.source,
  };
}

export function getReactBitmapRenderPlan<TFallback>(
  resolved: ResolvedBitmapAsset<TFallback>,
  basePath?: string,
): ReactBitmapRenderPlan<TFallback> {
  return {
    src:
      resolved.source === "bitmap" && resolved.descriptor.relativePath
        ? resolvePublicArtAssetUrl(resolved.descriptor.relativePath, basePath)
        : undefined,
    nativeWidth: resolved.descriptor.nativeWidth,
    nativeHeight: resolved.descriptor.nativeHeight,
    fallback: resolved.fallback,
    source: resolved.source,
  };
}

/**
 * Browser-local, promise-deduplicating preloader. Asset decoding is performed
 * once per URL; renderer loops only consult the cached completion state.
 */
export class BitmapAssetPreloadCache {
  private readonly requests = new Map<string, Promise<boolean>>();

  public preload(
    assets: readonly BitmapAssetDescriptor[],
    basePath?: string,
  ): Promise<readonly boolean[]> {
    return Promise.all(
      assets
        .filter((asset) => Boolean(asset.relativePath))
        .map((asset) => this.preloadOne(resolvePublicArtAssetUrl(asset.relativePath!, basePath))),
    );
  }

  public preloadOne(url: string): Promise<boolean> {
    const existing = this.requests.get(url);
    if (existing) return existing;
    const request = new Promise<boolean>((resolve) => {
      if (typeof Image === "undefined") {
        resolve(false);
        return;
      }
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    });
    this.requests.set(url, request);
    return request;
  }
}

export { resolveBitmapAsset };
