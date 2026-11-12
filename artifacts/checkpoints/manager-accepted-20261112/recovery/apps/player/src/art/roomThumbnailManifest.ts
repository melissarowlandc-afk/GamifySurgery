import manifest from "../../public/art/rooms/thumbnails/manifest.json";
import { resolvePublicArtAssetUrl } from "./bitmapAssetManifest";

export interface RoomThumbnailEntry {
  readonly defaultTier: number;
  readonly tiers: Readonly<Record<string, string>>;
}

/** Static local assets only; the browser never renders rooms or fetches an AI service for the catalog. */
export const ROOM_THUMBNAIL_MANIFEST = manifest as typeof manifest & {
  rooms: Readonly<Record<string, RoomThumbnailEntry>>;
};

export function roomThumbnailAsset(definitionId: string, tier?: number, basePath = import.meta.env.BASE_URL) {
  if (!Object.hasOwn(ROOM_THUMBNAIL_MANIFEST.rooms, definitionId)) return undefined;
  const entry: RoomThumbnailEntry | undefined = ROOM_THUMBNAIL_MANIFEST.rooms[definitionId];
  if (!entry) return undefined;
  const maximumTier = Math.max(...Object.keys(entry.tiers).map(Number));
  const selectedTier = tier === undefined || !Number.isFinite(tier) ? entry.defaultTier : Math.max(1, Math.min(maximumTier, Math.floor(tier)));
  const relativePath = entry.tiers[String(selectedTier)] ?? entry.tiers[String(entry.defaultTier)];
  if (!relativePath) return undefined;
  return { src: resolvePublicArtAssetUrl(relativePath, basePath), relativePath, tier: entry.tiers[String(selectedTier)] ? selectedTier : entry.defaultTier,
    width: manifest.width, height: manifest.height };
}
