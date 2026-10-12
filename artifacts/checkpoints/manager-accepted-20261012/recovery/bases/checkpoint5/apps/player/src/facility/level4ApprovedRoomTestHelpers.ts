import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { APPROVED_GS015_ROOM_ATLASES } from "../art/bitmapAssetManifest";
import { APPROVED_LEVEL4_ROOM_DATA } from "./approvedLevel4RoomData";
import { getApprovedRoomOrientation, getApprovedRoomPresentation, isApprovedActorSupportVisible,
  isApprovedDrawVisible, resolveApprovedRoomDrawRecords, resolveApprovedRoomActorSupports } from "./approvedRoomPresentation";
import { applyRoomTouchupsToRecords, isTouchupRecordVisible, ROOM_TOUCHUP_DECOR_ASSETS } from "./roomTouchups";
import { isRoomVisualDoorSlotClear } from "./roomVisualLayout";

const repo = resolve(import.meta.dirname, "../../../..");
const read = (file: string) => readFileSync(resolve(repo, file));
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

export function approvedLevel4RoomTests(definitionId: string, slug: string, nativeCount: number) {
  describe(`${slug} approved art promotion`, () => {
    const data = APPROVED_LEVEL4_ROOM_DATA.get(definitionId)!;
    it("pins the approval receipt and exact native bytes/dimensions/preload sources", () => {
      expect(sha(read(data.provenance.receiptPath))).toBe(data.provenance.receiptSha256);
      expect(sha(read(`tools/room-design/level-4/${slug}/proof/design-rooms.js`))).toBe(data.provenance.designSha256);
      for (const item of data.provenance.approved) expect(sha(read(item.source)), item.source).toBe(item.sha256);
      const assets = APPROVED_GS015_ROOM_ATLASES.filter((asset) => asset.relativePath?.startsWith(`art/rooms/level4-v1/${slug}/`));
      const preloads = [...APPROVED_GS015_ROOM_ATLASES, ...ROOM_TOUCHUP_DECOR_ASSETS];
      for (const record of data.records) {
        const asset = preloads.find((asset) => asset.id === record.assetId)!;
        expect(asset, record.assetId).toBeDefined();
        expect(record.sourceRect[0] + record.sourceRect[2]).toBeLessThanOrEqual(asset.nativeWidth);
        expect(record.sourceRect[1] + record.sourceRect[3]).toBeLessThanOrEqual(asset.nativeHeight);
      }
      expect(assets).toHaveLength(nativeCount);
      for (const asset of assets) {
        const bytes = read(`apps/player/public/${asset.relativePath}`);
        expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([asset.nativeWidth, asset.nativeHeight]);
        expect(bytes).toEqual(read(data.provenance.approved.find((item) => item.source.endsWith(`/${asset.relativePath!.split("/").at(-1)}`))!.source));
      }
    });
    it("retains active source placement, contacts, scales and floor while stripping example identities", () => {
      const source = read(`tools/room-design/level-4/${slug}/proof/design-rooms.js`).toString("utf8");
      const room = JSON.parse(source.match(/export const DESIGN_ROOMS = (.*);/)![1]!)[0];
      const metadataPath = `tools/room-design/level-4/${slug}/assets/${existsSync(resolve(repo, `tools/room-design/level-4/${slug}/assets/prepared/metadata.json`)) ? "prepared" : "processed"}/metadata.json`;
      const metadata = JSON.parse(read(metadataPath).toString("utf8")).assets;
      expect(data.shell.exactProofFloor).toEqual(room.floor);
      for (const record of resolveApprovedRoomDrawRecords(definitionId, 0)) {
        const original = room.records.find((item: { id: string }) => item.id === record.id);
        expect(record).toMatchObject({ sourceRect: original.sourceRect, renderSizeTiles: original.renderSizeTiles,
          canvasTransform: original.canvasTransform,
          depthKey: original.depthKey, depthPolicy: original.depthPolicy, doorOwners: original.doorOwners, backedOwners: original.backedOwners });
        const sprite = metadata[record.assetId.split(":").at(-1)!];
        if (sprite) {
          const [w, h] = original.renderSizeTiles, [, , sw, sh] = original.sourceRect;
          const [x, y] = original.worldLocalGround ?? [original.destinationTopLeftTiles[0] + w / 2, original.destinationTopLeftTiles[1]];
          expect(record.destinationTopLeftTiles).toEqual([x - sprite.canvasAnchor[0] * w / sw, y - sprite.canvasAnchor[1] * h / sh]);
          const asset = APPROVED_GS015_ROOM_ATLASES.find((asset) => asset.id === record.assetId)!;
          expect(asset.anchor).toEqual({ x: sprite.canvasAnchor[0], y: sprite.canvasAnchor[1] });
          if (original.worldLocalGround) expect(record.destinationTopLeftTiles[1] + sprite.canvasAnchor[1] * h / sh).toBeCloseTo(original.worldLocalGround[1], 12);
        } else expect(record.destinationTopLeftTiles).toEqual(original.destinationTopLeftTiles);
      }
      for (const support of resolveApprovedRoomActorSupports(definitionId, 0)) {
        expect(support).not.toHaveProperty("character");
        const original = room.supports.find((item: { id: string }) => item.id === support.id);
        expect(support).toMatchObject({ seat: original.seat, ground: original.ground, fixtureGround: original.fixtureGround, facing: original.facing });
      }
    });
    it("keeps one-tile doors selectable, fixed orientation, and the registered room available at the playable cap", () => {
      const size = data.orientations[0]!.footprint;
      expect(getApprovedRoomOrientation(definitionId, 0)?.footprint).toEqual(size);
      for (const orientation of [90, 180, 270] as const) {
        expect(getApprovedRoomOrientation(definitionId, orientation)).toBeUndefined();
        expect(resolveApprovedRoomDrawRecords(definitionId, orientation)).toEqual([]);
        expect(resolveApprovedRoomActorSupports(definitionId, orientation)).toEqual([]);
      }
      const definition = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === definitionId)!;
      expect([definition.width, definition.height]).toEqual(size);
      expect(definition.buildable).toBe(true);
      expect(definition.unlockFacilityLevel).toBe(4);
      expect(definition.unlockFacilityLevel).toBe(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel);
      for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < size[0]; offset++) {
        expect(isRoomVisualDoorSlotClear({ definitionId, orientation: 0, width: size[0], height: size[1], side, offset })).toBe(true);
      }
    });
    it("hides owned furniture, masks and supports per section; retains backed full-height floor furniture", () => {
      const records = resolveApprovedRoomDrawRecords(definitionId, 0);
      const draws = applyRoomTouchupsToRecords(definitionId, 0, data.orientations[0]!.footprint[0], records);
      const segments = ["N1", "N2", "N3", "N4", "S1", "S2", "S3", "S4", "WA", "WB", "WC", "WD", "EA", "EB", "EC", "ED"];
      for (const segment of segments) {
        for (const draw of draws) {
          expect(isTouchupRecordVisible(draw, new Set([segment]), new Set())).toBe(!draw.doorOwners.includes(segment as never));
          const expected = draw.touchupKeepWhenBacked || !draw.backedOwners.includes(segment as never);
          expect(isTouchupRecordVisible(draw, new Set(), new Set([segment]))).toBe(expected);
          expect(isApprovedDrawVisible(draw, new Set(), new Set([segment]))).toBe(expected);
        }
        for (const support of data.supports) expect(isApprovedActorSupportVisible(support, new Set([segment]), new Set())).toBe(!support.doorOwners?.includes(segment as never));
      }
      expect(draws.every((draw) => isTouchupRecordVisible(draw, new Set(), new Set()))).toBe(true);
      expect(getApprovedRoomPresentation(definitionId)).toBeDefined();
    });
  });
}
