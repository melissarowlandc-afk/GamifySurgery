import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { ROOM_THUMBNAIL_MANIFEST, roomThumbnailAsset } from "./roomThumbnailManifest";

describe("offline room thumbnail manifest", () => {
  it("covers every buildable definition and every displayed upgrade tier, without retired rooms", () => {
    const definitions = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.buildable);
    expect(Object.keys(ROOM_THUMBNAIL_MANIFEST.rooms).sort()).toEqual(definitions.map(room => room.id).sort());
    const paths = new Set<string>();
    for (const room of definitions) {
      const entry = ROOM_THUMBNAIL_MANIFEST.rooms[room.id]!;
      expect(entry.defaultTier).toBe(1);
      expect(Object.keys(entry.tiers)).toHaveLength(room.maximumUpgradeLevel);
      for (let tier = 1; tier <= room.maximumUpgradeLevel; tier++) {
        const asset = roomThumbnailAsset(room.id, tier)!;
        expect(asset.tier).toBe(tier);
        expect(asset.relativePath).toMatch(/^art\/rooms\/thumbnails\/[a-z0-9-]+\.png$/);
        expect(paths.has(asset.relativePath)).toBe(false); paths.add(asset.relativePath);
        expect([asset.width, asset.height]).toEqual([480, 336]);
      }
    }
    expect(roomThumbnailAsset("room.imaging_control")).toBeUndefined();
  });
  it("keeps unlock level separate from base tier, supports Pages paths and handles legacy/invalid requests", () => {
    expect(roomThumbnailAsset("room.founder_office")?.tier).toBe(1);
    expect(roomThumbnailAsset("room.xray", 1, "/GamifySurgery/")?.src).toBe("/GamifySurgery/art/rooms/thumbnails/xray-tier-1.png");
    expect(roomThumbnailAsset("room.waiting", 0)?.tier).toBe(1);
    expect(roomThumbnailAsset("room.waiting", 99)?.tier).toBe(5);
    expect(roomThumbnailAsset("room.waiting", NaN)?.tier).toBe(1);
    expect(roomThumbnailAsset("room.hallway", 5)?.tier).toBe(1);
    expect(roomThumbnailAsset("unknown")).toBeUndefined();
    expect(roomThumbnailAsset("constructor")).toBeUndefined();
    expect(ROOM_THUMBNAIL_MANIFEST.width / ROOM_THUMBNAIL_MANIFEST.pixelRatio).toBe(160);
    expect(ROOM_THUMBNAIL_MANIFEST.height / ROOM_THUMBNAIL_MANIFEST.pixelRatio).toBe(112);
  });
});
