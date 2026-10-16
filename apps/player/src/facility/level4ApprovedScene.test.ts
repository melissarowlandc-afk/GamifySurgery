import { describe, expect, it, vi } from "vitest";
import { APPROVED_LEVEL4_SUPPORT_NAVIGATION } from "@gamify-surgery/balance-config";
import { APPROVED_LEVEL4_ROOM_DATA } from "./approvedLevel4RoomData";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedDrawClipWidth, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import type { FacilityRoomView } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

class DisplayObject {
  visible = true; depth = 0; x = 0; y = 0; displayWidth = 0; displayHeight = 0;
  texture = ""; frame: string | undefined; isCropped = false; crop: number[] = [];
  data = new Map<string, unknown>();
  setData(key: string, value: unknown) { this.data.set(key, value); return this; }
  getData(key: string) { return this.data.get(key); }
  setTexture(key: string, frame?: string) { this.texture = key; this.frame = frame; return this; }
  setOrigin() { return this; }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDisplaySize(w: number, h: number) { this.displayWidth = w; this.displayHeight = h; return this; }
  setDepth(depth: number) { this.depth = depth; return this; }
  setVisible(visible: boolean) { this.visible = visible; return this; }
  setCrop(...rect: number[]) { this.crop = rect; this.isCropped = rect.length > 0; return this; }
  getByName() { return { visible: true }; }
  clear() { return this; }
}

function harness(definitionId: string, tileSize: number, doors = new Set<string>(), backed = new Set<string>()) {
  const data = APPROVED_LEVEL4_ROOM_DATA.get(definitionId)!;
  const [width, height] = data.orientations[0]!.footprint;
  const room: FacilityRoomView = { instanceId: "level4.qa", definitionId, displayName: "QA",
    tileX: 0, tileY: 0, width, height, orientation: 0, isFounderRoom: false };
  const scene = new FacilityScene({ viewModel: { rooms: [room] } } as FacilitySceneBridge) as any;
  scene.layout = { originX: 31, originY: 83, tileSize };
  scene.add = { image: () => new DisplayObject() };
  scene.registerApprovedRoomFrame = (draw: { id: string }) => "native:" + draw.id;
  scene.getApprovedSegmentState = () => ({ openDoorSegments: doors, backedNorthSegments: backed });
  scene.getTouchupRoomLighting = () => undefined;
  scene.drawTouchupSprite = () => undefined;
  scene.drawTouchupPrimitives = vi.fn();
  scene.getSortableGraphics = () => new DisplayObject();
  const draw = () => {
    scene.activeFixtureBitmapImages.clear();
    scene.drawApprovedRoomFixtures(room, { x: 31, y: 83, width: width * tileSize, height: height * tileSize });
  };
  const imageFor = (id: string): DisplayObject => [...scene.fixtureBitmapImages.values()]
    .find((image: any) => image.getData("approved-draw-id") === id) as DisplayObject;
  return { scene, room, draw, imageFor, doors };
}

for (const data of APPROVED_LEVEL4_ROOM_DATA.values()) describe(`${data.roomDefinitionId} real scene integration`, () => {
  it("draws every native/reused record and seats actual bitmap/fallback actors with exact native foreground order", () => {
    for (const tileSize of [24, 64, 120]) {
      const { scene, draw, imageFor } = harness(data.roomDefinitionId, tileSize);
      draw();
      for (const record of data.records) {
        const image = imageFor(record.id);
        expect(image, record.id).toBeDefined();
        expect(image.displayWidth).toBe(Math.round(record.renderSizeTiles[0] * tileSize));
        expect(image.displayHeight).toBe(Math.round(record.renderSizeTiles[1] * tileSize));
      }
      for (const bitmap of [false, true]) {
        for (const support of data.supports) {
          const nav = APPROVED_LEVEL4_SUPPORT_NAVIGATION[data.roomDefinitionId]!.find((nav) => nav.id === support.id)!;
          const position = scene.getApprovedActorSupportDisplayPosition(nav.anchor, false, support.role, support.id, "level4.qa");
          expect(position.centerX).toBeCloseTo(31 + support.seat.x * tileSize, 10);
          expect(position.baseY).toBeCloseTo(83 + support.seat.y * tileSize, 10);
          expect(position.depthBaseY).toBeCloseTo(83 + getApprovedSupportPainterGround(support).y * tileSize, 10);
          const actor = new DisplayObject();
          (bitmap ? scene.characterBitmapContainers : scene.characterGraphics).set(support.id, actor);
          scene.setCharacterSupportPresentation(support.id, actor, position, 0);
          scene.reconcileApprovedSideChairLayers();
          for (const record of data.records.filter((record) => record.foregroundSupportIds?.includes(support.id))) expect(imageFor(record.id).depth).toBeGreaterThan(actor.depth);
          if (support.id === "stool:clinician") expect(actor.depth).toBeGreaterThan(imageFor("stool").depth);
          if (support.id === "patient-seated") for (const id of ["gantry", "tableEmpty"]) expect(actor.depth).toBeGreaterThan(imageFor(id).depth);
          actor.setVisible(false);
        }
      }
    }
  });
  it("hides each owning door's furniture and sitter and restores the same source placement", () => {
    const { scene, draw, doors, imageFor } = harness(data.roomDefinitionId, 64);
    draw();
    const records = resolveApprovedRoomDrawRecords(data.roomDefinitionId, 0);
    for (const support of resolveApprovedRoomActorSupports(data.roomDefinitionId, 0).filter((support) => support.doorOwners?.length)) {
      const nav = APPROVED_LEVEL4_SUPPORT_NAVIGATION[data.roomDefinitionId]!.find((nav) => nav.id === support.id)!;
      doors.add(support.doorOwners![0]!); draw();
      const position = scene.getApprovedActorSupportDisplayPosition(nav.anchor, false, support.role, support.id, "level4.qa");
      expect(position.hidden).toBe(true);
      const actor = new DisplayObject(); scene.characterGraphics.set(support.id, actor);
      scene.setCharacterSupportPresentation(support.id, actor, position, 0);
      expect(actor.visible).toBe(false);
      for (const record of records.filter((record) => record.doorOwners.includes(support.doorOwners![0]!))) {
        expect([...scene.activeFixtureBitmapImages].some((key: any) => scene.fixtureBitmapImages.get(key) === imageFor(record.id))).toBe(false);
      }
      doors.clear(); draw();
      expect(scene.getApprovedActorSupportDisplayPosition(nav.anchor, false, support.role, support.id, "level4.qa").hidden).toBe(false);
    }
    if (data.roomDefinitionId === "room.mri") {
      const table = records.find((record) => record.id === "tableEmpty")!;
      expect(imageFor(table.id).crop).toEqual([0, 0, getApprovedDrawClipWidth(table), table.sourceRect[3]]);
    }
  });
});
