import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { APPROVED_LEVEL5_BITMAP_ASSETS } from "../art/bitmapAssetManifest";
import { APPROVED_LEVEL5_ROOM_DATA, getApprovedLevel5RoomTier } from "./approvedLevel5RoomData";
import { getApprovedRoomPresentation, getApprovedRoomProofCapture, isApprovedDrawVisible, isApprovedActorSupportVisible,
  resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedPlacementOrientations, isRoomVisualDoorSlotClear } from "./roomVisualLayout";
import { DESKTOP_FACILITY_ASSETS, mobileAssetById, mobileRoomArtReady, mobileRoomAssets, selectFacilityAssets } from "../mobile/performance/roomAssets";

const repo = resolve(import.meta.dirname, "../../../..");
const hash = (file: string) => createHash("sha256").update(readFileSync(resolve(repo, file))).digest("hex");
const levels = [1, 2, 3, 4, 5];
const sides = ["north", "south", "west", "east"] as const;

describe("M2 native Level 5 approvals and asset registration", () => {
  it("pins every receipt byte and promotes only the active native sprites", () => {
    const assetIds = new Set<string>(); let approvalHashes = 0, totalBytes = 0;
    expect(APPROVED_LEVEL5_BITMAP_ASSETS).toHaveLength(101);
    for (const room of APPROVED_LEVEL5_ROOM_DATA.values()) {
      expect(hash(room.provenance.receiptPath)).toBe(room.provenance.receiptSha256);
      for (const source of room.provenance.approved) { expect(hash(source.source), source.source).toBe(source.sha256); approvalHashes++; }
      for (const asset of room.assets) {
        const descriptor = mobileAssetById(asset.id)!;
        expect(descriptor).toBeDefined(); expect(assetIds.has(asset.id)).toBe(false); assetIds.add(asset.id);
        const source = room.provenance.approved.find(source => source.source.endsWith("/" + asset.relativePath.split("/").at(-1)) && hash(source.source) === hash(`apps/player/public/${asset.relativePath}`));
        expect(source, asset.id).toBeDefined();
        const bytes = readFileSync(resolve(repo, `apps/player/public/${asset.relativePath}`)); totalBytes += bytes.length;
        expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([descriptor.nativeWidth, descriptor.nativeHeight]);
        expect(mobileRoomAssets(room.roomDefinitionId)).toContain(descriptor);
      }
    }
    expect(approvalHashes).toBe(174); expect(assetIds.size).toBe(101); expect(totalBytes).toBe(31206882);
  });
  it("keeps the exact ordinary eager list and includes complete Level 5 map/thumb dependencies", () => {
    for (const facilityLevel of [0, 1, 2, 3, 4]) {
      expect(selectFacilityAssets({ mobile: false, facilityLevel, builtRoomIds: [] })).toBe(DESKTOP_FACILITY_ASSETS);
      expect(selectFacilityAssets({ mobile: true, facilityLevel, builtRoomIds: [] }).some(a => a.id.startsWith("level5:"))).toBe(false);
    }
    for (const mobile of [false, true]) {
      const selected = selectFacilityAssets({ mobile, facilityLevel: 5, builtRoomIds: [] });
      expect(selected).toEqual(expect.arrayContaining([...APPROVED_LEVEL5_BITMAP_ASSETS]));
    }
    for (const room of APPROVED_LEVEL5_ROOM_DATA.values()) {
      expect(mobileRoomArtReady(room.roomDefinitionId, () => true)).toBe(true);
      expect(mobileRoomArtReady(room.roomDefinitionId, a => !a.id.startsWith("level5:"))).toBe(false);
    }
  });
});

for (const room of APPROVED_LEVEL5_ROOM_DATA.values()) describe(`${room.roomDefinitionId} approved runtime appearance`, () => {
  it("matches the proof's measured painter anchors and all five appearance selections", () => {
    const root = room.proofPath.replace("/proof/index.html", "");
    const design = readFileSync(resolve(repo, `${root}/proof/design-rooms.js`), "utf8");
    const exports = Object.fromEntries([...design.matchAll(/export const (\w+) = ([^\n]+);/g)].map(([, id, value]) => [id, JSON.parse(value!)]));
    for (const tier of levels) {
      const source = exports.DESIGN_TIERS[tier - 1].room;
      const actual = resolveApprovedRoomDrawRecords(room.roomDefinitionId, 0, undefined, tier);
      expect(actual.map(r => r.id)).toEqual(source.records.map((r: { id: string }) => r.id));
      expect(getApprovedRoomProofCapture(room.roomDefinitionId, 0, tier)!.drawImages).toHaveLength(actual.length);
      for (const draw of actual) {
        const authored = source.records.find((r: { id: string }) => r.id === draw.id);
        const spec = exports.DESIGN_ASSETS[authored.assetId], native = exports.PREPARED_METADATA.assets[spec.preparedId];
        expect(draw.renderSizeTiles).toEqual(authored.renderSizeTiles); expect(draw.sourceRect).toEqual(authored.sourceRect);
        expect(draw.footprint).toEqual(authored.footprint); expect(draw.doorOwners).toEqual(authored.doorOwners);
        expect(draw.backedOwners).toEqual(authored.backedOwners); expect(draw.depthKey).toBe(authored.depthKey);
        const contact = authored.worldLocalGround ?? [authored.destinationTopLeftTiles[0] + authored.renderSizeTiles[0] / 2, authored.destinationTopLeftTiles[1]];
        expect(draw.destinationTopLeftTiles[0]! + native.canvasAnchor[0] * draw.renderSizeTiles[0]! / native.canvas[0]).toBeCloseTo(contact[0], 12);
        expect(draw.destinationTopLeftTiles[1]! + native.canvasAnchor[1] * draw.renderSizeTiles[1]! / native.canvas[1]).toBeCloseTo(contact[1], 12);
      }
      expect(resolveApprovedRoomActorSupports(room.roomDefinitionId, 0, tier).map(s => [s.id, s.seat, s.ground, s.facing]))
        .toEqual(source.supports.map((s: { id: string; seat?: unknown; ground: unknown; facing: string }) => [s.id, s.seat ?? s.ground, s.ground, s.facing]));
    }
    const records = levels.map(tier => resolveApprovedRoomDrawRecords(room.roomDefinitionId, 0, undefined, tier));
    if (room.appearanceChanges) expect(new Set(records.map(draws => draws[0]!.assetId)).size).toBe(5);
    else for (const recordsAtTier of records) expect(recordsAtTier).toEqual(records[0]);
    expect(getApprovedRoomPresentation(room.roomDefinitionId)?.orientations[0]?.footprint).toEqual(sourceSize(room.roomDefinitionId));
    expect(getApprovedPlacementOrientations(room.roomDefinitionId)).toEqual([0]);
  });
  it("preserves necessary stations/front masks and continuous rows through every door/backing selection", () => {
    const [width, height] = sourceSize(room.roomDefinitionId);
    const segments = sides.flatMap(side => Array.from({ length: side === "north" || side === "south" ? width : height }, (_, offset) => {
      expect(isRoomVisualDoorSlotClear({ definitionId: room.roomDefinitionId, orientation: 0, width, height, side, offset })).toBe(true);
      return side === "north" ? `N${offset + 1}` : side === "south" ? `S${offset + 1}` : `${side === "west" ? "W" : "E"}${String.fromCharCode(65 + offset)}`;
    }));
    const doorSets = [[], ...segments.map(s => [s]), ...segments.flatMap((s, i) => segments.slice(i + 1).map(other => [s, other])), segments];
    for (const tier of levels) for (let backing = 0; backing < 2 ** width; backing++) {
      const backed = new Set(segments.filter((s, i) => i < width && backing & 2 ** i));
      for (const selected of doorSets) {
        const doors = new Set(selected), records = getApprovedLevel5RoomTier(room.roomDefinitionId, tier)!.records;
        for (const record of records) {
          if (record.classification === "necessary") expect(isApprovedDrawVisible(record, doors, backed), record.id).toBe(true);
          if (record.id.startsWith("south") || record.id.startsWith("front")) expect(isApprovedDrawVisible(record, doors, backed), record.id).toBe(!record.doorOwners.some(s => doors.has(s)));
        }
        for (const support of resolveApprovedRoomActorSupports(room.roomDefinitionId, 0, tier)) expect(isApprovedActorSupportVisible(support, doors, backed), support.id).toBe(true);
      }
    }
  });
});
function sourceSize(id: string): [number, number] {
  return [...APPROVED_LEVEL5_ROOM_DATA.get(id)!.orientations[0]!.footprint] as [number, number];
}
