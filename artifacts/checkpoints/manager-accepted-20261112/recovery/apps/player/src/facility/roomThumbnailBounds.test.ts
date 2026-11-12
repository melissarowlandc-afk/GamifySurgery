import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { ROOM_THUMBNAIL_MANIFEST } from "../art/roomThumbnailManifest";
import { FacilityScene } from "./FacilityScene";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords, resolveApprovedRoomProceduralDrawRecords,
  isApprovedProceduralDrawVisible } from "./approvedRoomPresentation";
import { getApprovedFloorPrimitives, getApprovedProceduralScreenRect } from "./approvedRoomRenderer";
import { getCanonicalRoomShellLayout } from "./canonicalRoomShell";
import { applyRoomTouchupsToRecords, getTouchupFloorPrimitives, getTouchupLighting, getVisibleTouchupDecor,
  isTouchupFileSprite, isTouchupRecordVisible, TOUCHUP_SPRITES } from "./roomTouchups";
import { roomThumbnailModel, roomThumbnailStage } from "./roomThumbnailCapture";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

interface DrawableBounds { id: string; kind: string; x: number; y: number; width: number; height: number }

/** Static inspection of the same normalized room sources consumed by FacilityScene. */
function inspectDrawables(id: string, tier: number) {
  const room = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(room => room.id === id)!;
  const presentation = getApprovedRoomPresentation(id)!;
  const shell = presentation.shell;
  const output: DrawableBounds[] = [];
  const add = (entry: DrawableBounds) => { if (entry.width >= 0 && entry.height >= 0) output.push(entry); };
  getApprovedFloorPrimitives(shell, room.width, room.height).forEach((primitive, index) => {
    const factor = 120 / shell.tilePixels;
    add({ id: `floor:${index}`, kind: primitive.shape, x: (primitive.x - (primitive.shape === "ellipse" ? primitive.width / 2 : 0)) * factor,
      y: (primitive.y - (primitive.shape === "ellipse" ? primitive.height / 2 : 0)) * factor,
      width: primitive.width * factor, height: primitive.height * factor });
  });
  const records = applyRoomTouchupsToRecords(id, 0, room.width, resolveApprovedRoomDrawRecords(id, 0, undefined, tier));
  for (const record of records.filter(record => isTouchupRecordVisible(record, new Set(), new Set()))) {
    add({ id: record.id, kind: "furniture", x: record.destinationTopLeftTiles[0] * 120, y: record.destinationTopLeftTiles[1] * 120,
      width: record.renderSizeTiles[0] * 120, height: record.renderSizeTiles[1] * 120 });
  }
  for (const primitive of getTouchupFloorPrimitives(id, 0, [room.width, room.height], room.width, new Set(), records)) {
    add({ ...primitive, id: `floor-touchup:${output.length}`, kind: primitive.shape });
  }
  for (const item of getVisibleTouchupDecor(id, 0, room.width, new Set(), new Set())) {
    const sprite = TOUCHUP_SPRITES[item.sprite];
    const source = isTouchupFileSprite(sprite) ? { width: sprite.nativeWidth, height: sprite.nativeHeight } : (() => {
      const record = resolveApprovedRoomDrawRecords(sprite.definitionId, 0).find(record => record.id === sprite.recordId)!;
      return { width: record.sourceRect[2], height: record.sourceRect[3] };
    })();
    const width = item.widthTiles * 120, height = width * source.height / source.width;
    add({ id: item.id, kind: "decor", x: item.x * 120 - width / 2,
      y: item.kind === "wall" ? (item.top ?? 0) * 120 : (item.y ?? 0) * 120 - height, width, height });
  }
  const lighting = getTouchupLighting(id, [room.width, room.height], shell, new Set(), new Set(), false);
  for (const primitive of [...(lighting?.regions ?? []), ...(lighting?.glows ?? [])]) {
    add({ ...primitive, id: `lighting:${output.length}`, kind: primitive.shape });
  }
  for (const draw of resolveApprovedRoomProceduralDrawRecords(id, 0)) {
    if (!isApprovedProceduralDrawVisible(draw, new Set(), new Set())) continue;
    const rect = getApprovedProceduralScreenRect(draw, 120);
    add({ id: draw.id, kind: "partition", x: rect.left, y: rect.top, width: rect.width, height: rect.height });
  }
  for (const component of getCanonicalRoomShellLayout({ x: 0, y: 0, width: room.width * 120, height: room.height * 120 }, room).components) {
    add({ id: component.key, kind: "shell", ...component.bounds });
  }
  const width = room.width * 120, height = room.height * 120;
  const overflow = output.filter(draw => draw.x <= -360 || draw.y <= -360 || draw.x + draw.width >= width + 360 || draw.y + draw.height >= height + 360);
  return { room: id, tier, floor: { x: 0, y: 0, width, height }, stage: roomThumbnailStage(room.width, room.height), drawables: output, overflow };
}

describe("room thumbnail bounds after capture 87", () => {
  it("inspects every tier of Workshop and all later rooms, including floor, furniture, decor, lighting, partitions and shell", () => {
    const ids = Object.keys(ROOM_THUMBNAIL_MANIFEST.rooms);
    const laterIds = ids.slice(ids.indexOf("room.maintenance_workshop"));
    const audits = laterIds.flatMap(id => Object.keys(ROOM_THUMBNAIL_MANIFEST.rooms[id]!.tiers).map(tier => inspectDrawables(id, Number(tier))));
    if (process.env.ROOM_THUMBNAIL_BOUNDS_REPORT) writeFileSync(resolve(process.env.ROOM_THUMBNAIL_BOUNDS_REPORT), JSON.stringify(audits, null, 2) + "\n");
    expect(audits).toHaveLength(70); // captures 88-157; includes Workshop tiers 1-5.
    for (const audit of audits) expect(audit.overflow, `${audit.room} tier ${audit.tier}`).toEqual([]);
  });
  it("paints the clipped Workshop floor through the actual renderer at arbitrary world origins/scales", () => {
    const room = getApprovedRoomPresentation("room.maintenance_workshop")!;
    const primitives = getApprovedFloorPrimitives(room.shell, 3, 3);
    const scene = new FacilityScene({ viewModel: roomThumbnailModel("room.maintenance_workshop"), onPlaceRoom: () => false }) as any;
    for (const [originX, originY, scale] of [[360, 360, 1], [125, 760, .25]]) {
      const polygons: Array<Array<{ x: number; y: number }>> = [];
      let path: Array<{ x: number; y: number }> = [];
      const graphics = { fillStyle: vi.fn(), fillRect: vi.fn(), lineStyle: vi.fn(), lineBetween: vi.fn(), fillEllipse: vi.fn(),
        beginPath: () => { path = []; }, moveTo: (x: number, y: number) => path.push({ x, y }),
        lineTo: (x: number, y: number) => path.push({ x, y }), closePath: vi.fn(), fillPath: () => polygons.push(path) };
      scene.drawApprovedPaintPrimitives(graphics, primitives, originX!, originY!, scale!);
      expect(polygons.length).toBeGreaterThan(0);
      for (const point of polygons.flat()) {
        expect(point.x).toBeGreaterThanOrEqual(originX!); expect(point.y).toBeGreaterThanOrEqual(originY!);
        expect(point.x).toBeLessThanOrEqual(originX! + 360 * scale!); expect(point.y).toBeLessThanOrEqual(originY! + 360 * scale!);
      }
    }
  });
});
