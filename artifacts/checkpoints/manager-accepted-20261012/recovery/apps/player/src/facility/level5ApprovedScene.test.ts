import { describe, expect, it, vi } from "vitest";
import { APPROVED_LEVEL5_SUPPORT_NAVIGATION } from "@gamify-surgery/balance-config";
import { APPROVED_LEVEL5_ROOM_DATA } from "./approvedLevel5RoomData";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import type { FacilityRoomView } from "./types";
import { APPROVED_LEVEL5_BITMAP_ASSETS } from "../art/bitmapAssetManifest";
vi.mock("phaser", () => ({ default: { Scene: class {}, Loader: { Events: { COMPLETE: "complete" } } } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

class Image {
  visible = true; depth = 0; x = 0; y = 0; displayWidth = 0; displayHeight = 0;
  texture = ""; frame?: string; isCropped = false; data = new Map<string, unknown>();
  setData(key: string, value: unknown) { this.data.set(key, value); return this; }
  getData(key: string) { return this.data.get(key); }
  setTexture(key: string, frame?: string) { this.texture = key; this.frame = frame; return this; }
  setOrigin() { return this; }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDisplaySize(w: number, h: number) { this.displayWidth = w; this.displayHeight = h; return this; }
  setDepth(n: number) { this.depth = n; return this; }
  setVisible(value: boolean) { this.visible = value; return this; }
  setCrop() { return this; }
  getByName() { return { visible: true }; }
}
function harness(id: string, tier: NonNullable<FacilityRoomView["upgradeLevel"]>, tileSize: number, mobile = false) {
  const data = APPROVED_LEVEL5_ROOM_DATA.get(id)!;
  const [width, height] = data.orientations[0]!.footprint;
  const room: FacilityRoomView = { instanceId: "native-room", definitionId: id, displayName: id,
    tileX: 0, tileY: 0, width: width!, height: height!, orientation: 0, isFounderRoom: false, upgradeLevel: tier };
  const doors = new Set<string>(), backed = new Set<string>();
  const scene = new FacilityScene({ mobileInput: mobile, viewModel: { levelFiveRoomArt: true, rooms: [room] } } as FacilitySceneBridge) as any;
  scene.layout = { originX: 31, originY: 83, tileSize };
  scene.textures = { exists: () => true };
  scene.add = { image: () => new Image() };
  scene.registerApprovedRoomFrame = (record: { id: string }) => record.id;
  scene.getApprovedSegmentState = () => ({ openDoorSegments: doors, backedNorthSegments: backed });
  scene.getTouchupRoomLighting = () => undefined;
  scene.drawTouchupSprite = () => undefined;
  scene.drawTouchupPrimitives = vi.fn();
  const draw = () => {
    scene.activeFixtureBitmapImages.clear();
    return scene.drawApprovedRoomFixtures(room, { x: 31, y: 83, width: width! * tileSize, height: height! * tileSize });
  };
  const imageFor = (id: string): Image => [...scene.fixtureBitmapImages.values()].find((image: any) => image.getData("approved-draw-id") === id) as Image;
  return { scene, room, draw, imageFor, doors, backed };
}

for (const data of APPROVED_LEVEL5_ROOM_DATA.values()) describe(`${data.roomDefinitionId} actual scene`, () => {
  it("draws native records and binds occupied contacts/front masks in desktop and phone at all tiers/zooms", () => {
    for (const mobile of [false, true]) for (const tier of [1, 2, 3, 4, 5] as const) for (const tileSize of [24, 64, 120]) {
      const { scene, draw, imageFor, doors, backed } = harness(data.roomDefinitionId, tier, tileSize, mobile);
      const records = resolveApprovedRoomDrawRecords(data.roomDefinitionId, 0, undefined, tier);
      // N2/S2 retain both office chairs and sitters. Other all-door checks retain
      // only necessary furniture, exactly as the individual approvals require.
      if (data.roomDefinitionId === "room.executive_office") { doors.add("N2"); doors.add("S2"); }
      backed.add("N2"); expect(draw()).toBe(true);
      for (const record of records.filter(r => r.classification === "necessary")) {
        const image = imageFor(record.id); expect(image, record.id).toBeDefined();
        expect(image.texture).toBe(`stitchin-time-art:${record.assetId}`);
        expect([image.displayWidth, image.displayHeight]).toEqual(record.renderSizeTiles.map(n => Math.round(n * tileSize)));
        expect([image.x, image.y]).toEqual(record.destinationTopLeftTiles.map((n, i) => Math.round((i ? 83 : 31) + n * tileSize)));
      }
      for (const support of resolveApprovedRoomActorSupports(data.roomDefinitionId, 0, tier)) {
        const nav = APPROVED_LEVEL5_SUPPORT_NAVIGATION[data.roomDefinitionId]!.find(s => s.id === support.id)!;
        const position = scene.getApprovedActorSupportDisplayPosition(nav.anchor, false, support.role, support.id, "native-room");
        expect(position.hidden).toBe(false);
        expect(position.centerX).toBeCloseTo(31 + support.seat.x * tileSize, 10);
        expect(position.baseY).toBeCloseTo(83 + support.seat.y * tileSize, 10);
        expect(position.depthBaseY).toBeCloseTo(83 + getApprovedSupportPainterGround(support).y * tileSize, 10);
        for (const bitmap of [false, true]) {
          const actor = new Image(); (bitmap ? scene.characterBitmapContainers : scene.characterGraphics).set(support.id, actor);
          scene.setCharacterSupportPresentation(support.id, actor, position, 0); scene.reconcileApprovedSideChairLayers();
          for (const front of records.filter(r => r.foregroundSupportIds?.includes(support.id))) expect(imageFor(front.id).depth, front.id).toBeGreaterThan(actor.depth);
          actor.setVisible(false);
        }
      }
    }
  });
  it("shows a whole procedural fallback when a required source has not decoded", () => {
    for (const mobile of [false, true]) {
      const { scene, room } = harness(data.roomDefinitionId, 1, 64, mobile);
      const missing = data.assets[0]!.id;
      scene.textures.exists = (key: string) => key !== `stitchin-time-art:${missing}`;
      expect(scene.drawApprovedRoomFixtures(room, { x: 0, y: 0, width: room.width * 64, height: room.height * 64 })).toBe(false);
      expect(scene.fixtureBitmapImages.size).toBe(0);
    }
  });
});

it("never loads new desktop art outside the Level 5 opt-in, and requests the pack once inside it", () => {
  const bridge = { viewModel: {} } as FacilitySceneBridge;
  const scene = new FacilityScene(bridge) as any;
  const requests: string[] = [];
  scene.textures = { exists: () => false };
  scene.load = { image: (key: string) => requests.push(key), once: vi.fn(), start: vi.fn() };
  scene.ensureLevelFiveAtlases(); expect(requests).toEqual([]);
  bridge.viewModel.levelFiveRoomArt = true;
  scene.ensureLevelFiveAtlases(); scene.ensureLevelFiveAtlases();
  expect(requests).toEqual(APPROVED_LEVEL5_BITMAP_ASSETS.map(a => `stitchin-time-art:${a.id}`));
  expect(scene.load.start).toHaveBeenCalledTimes(1);
});
