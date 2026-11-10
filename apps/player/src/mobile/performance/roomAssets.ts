import {
  APPROVED_GS015_ROOM_ATLASES, APPROVED_LEVEL5_BITMAP_ASSETS, ENVIRONMENT_ATLAS_V1, FRONTAGE_V2_ASSETS,
  LANDSCAPING_ATLAS_V1, ROOM_FIXTURE_ATLASES, type BitmapAssetDescriptor,
} from "../../art/bitmapAssetManifest";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords } from "../../facility/approvedRoomPresentation";
import { getRoomTouchup, isTouchupFileSprite, ROOM_TOUCHUP_DECOR_ASSETS, TOUCHUP_SPRITES,
  type TouchupSpriteName } from "../../facility/roomTouchups";
import { phoneMemoryProfile } from "./phoneMemoryPolicy";

/** Exact original eager set/order. Only the phone selector uses a subset. */
export const DESKTOP_FACILITY_ASSETS: readonly BitmapAssetDescriptor[] = [
  ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, ...Object.values(FRONTAGE_V2_ASSETS),
  ...ROOM_FIXTURE_ATLASES, ...APPROVED_GS015_ROOM_ATLASES, ...ROOM_TOUCHUP_DECOR_ASSETS,
];
const allFacilityAssets = [...DESKTOP_FACILITY_ASSETS, ...APPROVED_LEVEL5_BITMAP_ASSETS];
const byId = new Map(allFacilityAssets.map(asset => [asset.id, asset]));
const roomCache = new Map<string, readonly BitmapAssetDescriptor[]>();

// These corridor decorations borrow individual approved crops, not entire
// higher-level room packs. Keep this list covered by the corridor dependency test.
const corridorSprites: readonly TouchupSpriteName[] = [
  "art-blossom", "art-lake", "art-dunes", "art-autumn", "corridor-bench",
  "plant-fiddle", "plant-snake", "plant-leafy", "sanitizer-stand",
];

export function mobileRoomAssets(definitionId: string): readonly BitmapAssetDescriptor[] {
  const cached = roomCache.get(definitionId);
  if (cached) return cached;
  const ids = new Set<string>();
  const room = getApprovedRoomPresentation(definitionId);
  for (const asset of room?.assets ?? []) ids.add(asset.id);
  // Common component shell remains identical after loading. The old isolated
  // v1/v4 shells and unused furniture generations are unnecessary on the phone.
  if (room) {
    ids.add("room-fixtures:front-desk-v3");
    ids.add("room-fixtures:surgery-center-architecture-v1");
  }
  if (definitionId === "room.front_desk") ids.add("room-fixtures:front-desk-v2"); // live water cooler
  const sprites = definitionId === "room.hallway" ? corridorSprites :
    (getRoomTouchup(definitionId)?.decor ?? []).map(item => item.sprite);
  for (const name of sprites) {
    const sprite = TOUCHUP_SPRITES[name];
    if (isTouchupFileSprite(sprite)) ids.add(`room-touchup:${sprite.file}`);
    else {
      const record = resolveApprovedRoomDrawRecords(sprite.definitionId, 0).find(candidate => candidate.id === sprite.recordId);
      if (record) ids.add(record.assetId);
    }
  }
  const assets = allFacilityAssets.filter(asset => ids.has(asset.id));
  roomCache.set(definitionId, assets);
  return assets;
}

export function selectFacilityAssets(input: {
  mobile: boolean; facilityLevel: number; builtRoomIds: readonly string[]; previewRoomIds?: readonly string[];
}): readonly BitmapAssetDescriptor[] {
  if (!input.mobile) return input.facilityLevel >= 5 ? allFacilityAssets : DESKTOP_FACILITY_ASSETS;
  // Opening a clinic needs its built art, not every room unlocked at its level.
  // Explicit preview requests and first placement load their own dependencies.
  const rooms = new Set([
    "room.hallway", // Corridor decor is also used outside placed room footprints.
    ...input.builtRoomIds, ...(input.previewRoomIds ?? []),
  ]);
  const ids = new Set([
    ENVIRONMENT_ATLAS_V1.id, LANDSCAPING_ATLAS_V1.id, ...Object.values(FRONTAGE_V2_ASSETS).map(asset => asset.id),
    ...[...rooms].flatMap(id => mobileRoomAssets(id).map(asset => asset.id)),
  ]);
  return allFacilityAssets.filter(asset => ids.has(asset.id));
}

export function mobileRoomArtReady(definitionId: string, hasTexture: (asset: BitmapAssetDescriptor) => boolean): boolean {
  return mobileRoomAssets(definitionId).every(hasTexture);
}

/** Shared phone image/decoded-source cache for the map and catalog thumbnails. */
export class MobileBitmapCache {
  private requests = new Map<string, Promise<HTMLImageElement | null>>();
  private owners = new Set<(id: string) => HTMLImageElement | null>();
  private completed = new Map<string, { weak?: { deref(): HTMLImageElement | undefined }; image?: HTMLImageElement; failed?: boolean; bytes: number }>();
  private strongBytes = 0;
  constructor(private createImage: () => HTMLImageElement = () => new Image(),
    private limits = () => ({ bytes: (phoneMemoryProfile().mode === "reduced" ? 2 : 8) * 1024 * 1024, count: 256 }),
    // Old Safari has no WeakRef: keep only a small strong LRU in that case.
    private weakImage: ((image: HTMLImageElement) => { deref(): HTMLImageElement | undefined }) | null =
      typeof WeakRef === "function" ? image => new WeakRef(image) : null) {}

  get health() {
    this.trim();
    return { pending: this.requests.size, completed: this.completed.size, strongBytes: this.strongBytes,
      maxStrongBytes: this.limits().bytes, weak: this.weakImage !== null, owners: this.owners.size };
  }

  /** A mounted map already owns its images. Consult it before a new decode,
   * including when old Safari's small fallback LRU evicts a large live atlas. */
  connectSource(read: (id: string) => HTMLImageElement | null): () => void {
    this.owners.add(read); return () => { this.owners.delete(read); };
  }

  private trim() {
    const limit = this.limits();
    while (this.completed.size > limit.count || this.strongBytes > limit.bytes) {
      const key = this.completed.keys().next().value; if (key === undefined) break;
      this.strongBytes -= this.completed.get(key)!.bytes; this.completed.delete(key);
    }
  }

  load(asset: BitmapAssetDescriptor, url: string): Promise<HTMLImageElement | null> {
    const existing = this.requests.get(asset.id);
    if (existing) return existing;
    for (const read of this.owners) {
      try { const image = read(asset.id); if (image) return Promise.resolve(image); }
      catch { /* A disposing owner must not prevent another source/fallback. */ }
    }
    const cached = this.completed.get(asset.id);
    if (cached) {
      const image = cached.image ?? cached.weak?.deref();
      if (image || cached.failed) {
        this.completed.delete(asset.id); this.completed.set(asset.id, cached); this.trim();
        return Promise.resolve(image ?? null);
      }
      this.completed.delete(asset.id);
    }
    const promise = new Promise<HTMLImageElement | null>(resolve => {
      try {
        const image = this.createImage();
        const finish = (value: HTMLImageElement | null) => { image.onload = null; image.onerror = null; resolve(value); };
        image.decoding = "async";
        image.onload = () => finish(image);
        image.onerror = () => finish(null);
        image.src = url;
      } catch { resolve(null); }
    });
    this.requests.set(asset.id, promise);
    void promise.then(image => {
      this.requests.delete(asset.id);
      const row = !image ? { failed: true, bytes: 0 } : this.weakImage ? { weak: this.weakImage(image), bytes: 0 }
        : { image, bytes: (image.naturalWidth || image.width || asset.nativeWidth) * (image.naturalHeight || image.height || asset.nativeHeight) * 4 };
      this.completed.set(asset.id, row); this.strongBytes += row.bytes; this.trim();
    });
    return promise;
  }
}

export const mobileBitmapCache = new MobileBitmapCache();
export const mobileAssetById = (id: string): BitmapAssetDescriptor | undefined => byId.get(id);
