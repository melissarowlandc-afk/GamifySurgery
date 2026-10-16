import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import {
  APPROVED_GS015_ROOM_ATLASES, APPROVED_LEVEL5_BITMAP_ASSETS, ENVIRONMENT_ATLAS_V1, FRONTAGE_V2_ASSETS,
  LANDSCAPING_ATLAS_V1, ROOM_FIXTURE_ATLASES, type BitmapAssetDescriptor,
} from "../../art/bitmapAssetManifest";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords } from "../../facility/approvedRoomPresentation";
import { getRoomTouchup, isTouchupFileSprite, ROOM_TOUCHUP_DECOR_ASSETS, TOUCHUP_SPRITES,
  type TouchupSpriteName } from "../../facility/roomTouchups";

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
  const rooms = new Set([
    ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions
      .filter(room => room.unlockFacilityLevel <= input.facilityLevel && (room.buildable || room.id === "room.front_desk"))
      .map(room => room.id),
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
  constructor(private createImage: () => HTMLImageElement = () => new Image()) {}

  load(asset: BitmapAssetDescriptor, url: string): Promise<HTMLImageElement | null> {
    const existing = this.requests.get(asset.id);
    if (existing) return existing;
    const promise = new Promise<HTMLImageElement | null>(resolve => {
      const image = this.createImage();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url;
    });
    this.requests.set(asset.id, promise);
    return promise;
  }
}

export const mobileBitmapCache = new MobileBitmapCache();
export const mobileAssetById = (id: string): BitmapAssetDescriptor | undefined => byId.get(id);
