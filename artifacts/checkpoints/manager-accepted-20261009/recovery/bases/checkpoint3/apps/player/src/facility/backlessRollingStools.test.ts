import { describe, expect, it, vi } from "vitest";
import { getFixtureSpriteForOrientation } from "../art/fixtureArt";
import {
  APPROVED_ROOM_PRESENTATIONS, getApprovedRoomPresentation,
  resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords,
} from "./approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getApprovedSideChairMaskForDraw } from "./approvedSideChairLayers";
import {
  APPROVED_ROLLING_STOOL_SOURCES, BACKLESS_ROLLING_STOOL_VERSION,
  deriveBacklessRollingStoolPixels, getApprovedRollingStoolSource,
} from "./backlessRollingStools";
import { getFacilitySceneDepth } from "./renderDepth";
import { getVisibleTouchupDecor, TOUCHUP_SPRITES } from "./roomTouchups";
import { resolveStaffIdleSupports } from "./staffIdleSupports";
import type { FacilityRoomView } from "./types";
import before from "./furnitureSeatLayering.before.fixture.json";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

const bindings = [
  ["room.examination", 0, "stool", "stool:clinician"],
  ["room.examination", 270, "stool", "stool:clinician"],
  ["room.minor_procedure", 0, "stool", "stool:clinician"],
  ["room.ultrasound", 0, "stool", "stool:clinician"],
  ["room.phlebotomy", 0, "stool", "stool:clinician"],
  ["room.phlebotomy", 270, "stool", "stool:clinician"],
  ["room.periop_recovery", 0, "stool1", "recovery:stool-1"],
  ["room.periop_recovery", 0, "stool2", "recovery:stool-2"],
  ["room.training", 0, "stool1", "stool1"],
  ["room.training", 0, "stool2", "stool2"],
] as const;

class DisplayObject {
  visible = true; depth = 0; x = 0; y = 0; displayWidth = 0; displayHeight = 0;
  texture = ""; frame: string | undefined; angle = 0; alpha = 1;
  data = new Map<string, unknown>();
  setData(key: string, value: unknown) { this.data.set(key, value); return this; }
  getData(key: string) { return this.data.get(key); }
  setTexture(key: string, frame?: string) { this.texture = key; this.frame = frame; return this; }
  setOrigin() { return this; }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDisplaySize(w: number, h: number) { this.displayWidth = w; this.displayHeight = h; return this; }
  setDepth(depth: number) { this.depth = depth; return this; }
  setVisible(value: boolean) { this.visible = value; return this; }
  setAngle(value: number) { this.angle = value; return this; }
  setAlpha(value: number) { this.alpha = value; return this; }
  fillStyle() { return this; }
  fillRect() { return this; }
  lineStyle() { return this; }
  lineBetween() { return this; }
  getByName() { return { visible: true }; }
}

function harness(definitionId: string, orientation: 0 | 270 = 0, scale = 64) {
  const [width, height] = getApprovedRoomPresentation(definitionId)!.orientations
    .find((view) => view.runtimeOrientation === orientation)!.footprint;
  const room: FacilityRoomView = { instanceId: "stool.qa", definitionId, displayName: "QA",
    tileX: 0, tileY: 0, width, height, orientation, isFounderRoom: false };
  const scene = new FacilityScene({ viewModel: { rooms: [room] } } as FacilitySceneBridge) as any;
  scene.layout = { originX: 31, originY: 83, tileSize: scale };
  scene.add = { image: () => new DisplayObject() };
  scene.registerApprovedRoomFrame = (draw: { id: string }) => "full:" + draw.id;
  scene.ensureBacklessRollingStoolTexture = vi.fn((source: { id: string }) => `approved-stool:${BACKLESS_ROLLING_STOOL_VERSION}:${source.id}`);
  scene.ensureApprovedSideChairTextures = (mask: { id: string }) => ({ rear: mask.id + ":rear", foreground: mask.id + ":front" });
  scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set() });
  scene.getTouchupRoomLighting = () => undefined;
  scene.drawTouchupSprite = () => undefined;
  scene.getSortableGraphics = () => new DisplayObject();
  const draw = () => scene.drawApprovedRoomFixtures(room, { x: 31, y: 83, width: width * scale, height: height * scale });
  return { scene, room, draw };
}

describe("backless rolling stools", () => {
  it("audits every approved stool crop and preserves every pre-change seat and placement", () => {
    const found: string[] = [];
    for (const room of APPROVED_ROOM_PRESENTATIONS) for (const view of room.orientations) {
      for (const draw of resolveApprovedRoomDrawRecords(room.roomDefinitionId, view.runtimeOrientation)) {
        if (!/^stool\d*$/.test(draw.id)) continue;
        expect(getApprovedRollingStoolSource(draw), room.roomDefinitionId + draw.id).toBeDefined();
        expect(getApprovedSideChairMaskForDraw(room.roomDefinitionId, view.runtimeOrientation, draw)).toBeUndefined();
        found.push(`${room.roomDefinitionId}:${view.runtimeOrientation}:${draw.id}`);
        const baseline = before.find((row) => row.room === room.roomDefinitionId && row.orientation === view.runtimeOrientation)!;
        const oldDraw = baseline.furniture.find((item) => item.id === draw.id)!;
        expect({ id: draw.id, assetId: draw.assetId, sourceRect: draw.sourceRect,
          destinationTopLeftTiles: draw.destinationTopLeftTiles, renderSizeTiles: draw.renderSizeTiles }).toEqual(oldDraw);
        for (const oldSeat of baseline.seats.filter((seat) => seat.id.startsWith("stool"))) {
          const support = resolveApprovedRoomActorSupports(room.roomDefinitionId, view.runtimeOrientation)
            .find((seat) => seat.id === oldSeat.id)!;
          expect({ id: support.id, seat: support.seat, ground: support.ground }).toEqual(oldSeat);
        }
      }
    }
    expect(found.sort()).toEqual(bindings.map(([room, orientation, draw]) => `${room}:${orientation}:${draw}`).sort());
  });

  it.each(bindings)("draws the whole clinician above %s:%s:%s (%s) with no stool foreground", (definitionId, orientation, drawId, supportId) => {
    const support = [...resolveApprovedRoomActorSupports(definitionId, orientation), ...resolveStaffIdleSupports(definitionId, orientation)]
      .find((candidate) => candidate.id === supportId)!;
    expect(support.pose).toBe("seated");
    expect(support.sideChairLayer).toBeUndefined();
    for (const scale of [32, 64, 120]) {
      const { scene, draw } = harness(definitionId, orientation, scale);
      draw();
      const image = [...scene.fixtureBitmapImages.values()].find((image: any) => image.getData("approved-draw-id") === drawId) as DisplayObject;
      expect(image).toBeDefined();
      const source = getApprovedRollingStoolSource(resolveApprovedRoomDrawRecords(definitionId, orientation).find((draw) => draw.id === drawId)!)!;
      expect(image.getData("approved-backless-stool-source")).toBe(source.id);
      if (source.derivation) {
        expect(image.texture).toBe(`approved-stool:${BACKLESS_ROLLING_STOOL_VERSION}:${source.id}`);
        expect(image.frame).toBeUndefined();
      } else expect(scene.ensureBacklessRollingStoolTexture).not.toHaveBeenCalled();
      for (const bitmap of [false, true]) {
        const actor = new DisplayObject();
        if (bitmap) scene.characterBitmapContainers.set("clinician", actor);
        else scene.characterGraphics.set("clinician", actor);
        scene.setCharacterSupportPresentation("clinician", actor, {
          depthBaseY: 83 + getApprovedSupportPainterGround(support).y * scale,
          supportId, supportRoomInstanceId: "stool.qa", supportRole: support.role,
        }, 0);
        scene.reconcileApprovedSideChairLayers();
        expect(actor.depth).toBeGreaterThan(image.depth);
        expect(actor.getData("actor-seat-mask-id")).toBeNull();
        expect(scene.debugApprovedSideChairLayerSnapshot().some((layer: any) => layer.drawId === drawId)).toBe(false);
        actor.setVisible(false);
      }
      const originalState = [image.texture, image.frame, image.x, image.y, image.displayWidth, image.displayHeight];
      draw(); // Empty/redrawn stools retain the same backless art and geometry.
      expect([image.texture, image.frame, image.x, image.y, image.displayWidth, image.displayHeight]).toEqual(originalState);
    }
  });

  it.each([0, 270] as const)("reuses the derived minor-procedure stool below the endoscopist in orientation %s", (orientation) => {
    const { scene, room } = harness("room.endoscopy", orientation);
    const sprite = TOUCHUP_SPRITES["rolling-stool"];
    const decor = getVisibleTouchupDecor(room.definitionId, orientation, 4, new Set(), new Set())
      .find((item) => item.sprite === "rolling-stool")!;
    const support = resolveStaffIdleSupports(room.definitionId, orientation).find((seat) => seat.id === "endoscopy:stool")!;
    const result = (FacilityScene.prototype as any).drawTouchupSprite.call(scene, "endo-stool", sprite,
      31 + decor.x * 64, 83 + decor.y! * 64, decor.widthTiles, "floor");
    expect(result.textureKey).toBe(`approved-stool:${BACKLESS_ROLLING_STOOL_VERSION}:minor-procedure`);
    expect(result.frame).toBeUndefined();
    expect(result.height / result.width).toBeCloseTo(427 / 266);
    expect(getFacilitySceneDepth(83 + getApprovedSupportPainterGround(support).y * 64, "character", 0)).toBeGreaterThan(result.depth);
    expect(support.sideChairLayer).toBeUndefined();
    expect(support.ground).toEqual(orientation === 0 ? { x: 3, y: 2.06 } : { x: 2.06, y: 1 });
  });

  it("keeps reused ultrasound/phlebotomy idle supports above their own stool without a foreground binding", () => {
    for (const [room, orientation, id] of [
      ["room.ultrasound", 0, "ultrasound:stool"], ["room.phlebotomy", 0, "phlebotomy:stool"],
      ["room.phlebotomy", 270, "phlebotomy:stool"],
    ] as const) {
      const idle = resolveStaffIdleSupports(room, orientation).find((support) => support.id === id)!;
      const clinician = resolveApprovedRoomActorSupports(room, orientation).find((support) => support.id === "stool:clinician")!;
      expect({ ...idle, id: clinician.id, role: clinician.role }).toEqual(clinician);
      expect(idle.sideChairLayer).toBeUndefined();
    }
  });

  it.each(APPROVED_ROLLING_STOOL_SOURCES.filter((source) => source.derivation))("removes the $id back/post and restores only covered body pixels without mutating source art", (stool) => {
    const [,, width, height] = stool.sourceRect, mask = stool.derivation!;
    const source = Uint8ClampedArray.from({ length: width * height * 4 }, (_, index) => index % 4 === 3 ? 193 : index % 251);
    const snapshot = source.slice();
    const result = deriveBacklessRollingStoolPixels(source, width, height, mask);
    expect(source).toEqual(snapshot);
    expect(result.length).toBe(source.length);
    for (let y = 0; y < mask.removeAboveY; y += 1) {
      for (let x = 0; x < width; x += 1) if (result[(y * width + x) * 4 + 3] !== 0) throw new Error("Backrest pixel retained");
    }
    const [px, py, pw, ph] = mask.backPost;
    expect(result[((py + ph - 1) * width + px) * 4 + 3]).toBe(0); // Post beside the restored column.
    const [sx, sy, sw, sh] = mask.coveredSeat;
    expect(result[((sy + Math.floor(sh / 2)) * width + sx + Math.floor(sw / 2)) * 4 + 3]).toBe(193); // No hole in the seat.
    const [cx, cy, cw, ch] = mask.coveredColumn, [sampleX, sampleY] = mask.columnSample;
    for (let y = 0; y < ch; y += 1) {
      expect(result.slice(((cy + y) * width + cx) * 4, ((cy + y) * width + cx + cw) * 4))
        .toEqual(source.slice(((sampleY + y) * width + sampleX) * 4, ((sampleY + y) * width + sampleX + cw) * 4));
    }
    expect(result.slice((py + ph) * width * 4)).toEqual(source.slice((py + ph) * width * 4)); // Entire exposed column/base/casters.
    expect(result.slice(sy * width * 4, (sy * width + sx) * 4)).toEqual(source.slice(sy * width * 4, (sy * width + sx) * 4));
    expect(pw).toBeGreaterThan(0);
  });

  it("creates each derived canvas once with the exact approved source crop and untouched dimensions", () => {
    const scene = new FacilityScene({ viewModel: { rooms: [] } } as unknown as FacilitySceneBridge) as any;
    const canvases = new Map<string, any>(), sourceImage = {};
    const createCanvas = vi.fn((key: string, width: number, height: number) => {
      const canvas = { context: { drawImage: vi.fn() }, getData: () => ({ data: new Uint8ClampedArray(width * height * 4).fill(255) }),
        putData: vi.fn(), refresh: vi.fn() };
      canvases.set(key, canvas); return canvas;
    });
    scene.textures = { exists: (key: string) => !key.startsWith("approved-stool:") || canvases.has(key),
      get: () => ({ getSourceImage: () => sourceImage }), createCanvas };
    for (const stool of APPROVED_ROLLING_STOOL_SOURCES.filter((source) => source.derivation)) {
      const key = scene.ensureBacklessRollingStoolTexture(stool);
      expect(scene.ensureBacklessRollingStoolTexture(stool)).toBe(key);
      const [x, y, w, h] = stool.sourceRect;
      expect(createCanvas).toHaveBeenCalledWith(key, w, h);
      expect(canvases.get(key).context.drawImage).toHaveBeenCalledExactlyOnceWith(sourceImage, x, y, w, h, 0, 0, w, h);
      expect(canvases.get(key).refresh).toHaveBeenCalledOnce();
    }
    expect(createCanvas).toHaveBeenCalledTimes(2);
  });

  it.each(["room.minor_procedure", "room.ultrasound"])("uses the backless texture for %s lighting copies too", (definitionId) => {
    const { scene, draw } = harness(definitionId);
    scene.getTouchupRoomLighting = () => ({ color: "#8793a6", segmentTops: [9999, 9999, 9999] });
    scene.drawTouchupTintedTop = vi.fn();
    scene.drawTouchupLighting = vi.fn();
    draw();
    const tint = scene.drawTouchupTintedTop.mock.calls.find((call: any[]) => call[0].includes(":stool:"))!;
    const source = definitionId === "room.ultrasound" ? "ultrasound" : "minor-procedure";
    expect(tint[1]).toBe(`approved-stool:${BACKLESS_ROLLING_STOOL_VERSION}:${source}`);
    expect(tint[2]).toBeUndefined();
  });

  it.each([0, 270] as const)("keeps the already-backless legacy bitmap and procedural fallback stools at orientation %s", (orientation) => {
    const { scene } = harness("room.examination");
    scene.roomFixtureAtlasesReady = true;
    scene.textures = { exists: () => true };
    expect(scene.drawAuthoredFixture("legacy-stool", "rollingStool", "room.examination", 80, 90, 22, 26, 1234, 1)).toBe(true);
    const bitmap = scene.fixtureBitmapImages.get("legacy-stool") as DisplayObject;
    expect(bitmap.texture).not.toContain("approved-stool:");
    expect(scene.ensureBacklessRollingStoolTexture).not.toHaveBeenCalled();
    expect(scene.debugApprovedSideChairLayerSnapshot()).toEqual([]);
    scene.drawPixelFrameSized = vi.fn();
    scene.drawFixture({}, "rollingStool", 80, 90, 22, 26, 1, orientation);
    expect(scene.drawPixelFrameSized.mock.calls[0][1]).toEqual(getFixtureSpriteForOrientation("rollingStool", orientation));
    expect(getFixtureSpriteForOrientation("rollingStool", orientation)).toMatchObject({ width: 10, height: 7 });
    expect(getApprovedRollingStoolSource({ assetId: "room-fixtures:examination-v1", sourceRect: [200, 785, 220, 264] })?.derivation).toBeUndefined();
    expect(getApprovedRollingStoolSource({ assetId: "gs015:minor-procedure:furniture", sourceRect: [8, 8, 555, 1216] })).toBeUndefined();
  });
});
