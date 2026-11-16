import { EventEmitter } from "node:events";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { nativePhaserMemoryClass } from "./nativePhaserMemoryTestSupport";
import { FacilityScene } from "./FacilityScene";
import { APPROVED_SIDE_CHAIR_MASKS } from "./approvedSideChairLayers";
import { APPROVED_ROLLING_STOOL_SOURCES } from "./backlessRollingStools";
import { resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { applyRoomTouchupsToRecords } from "./roomTouchups";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { characterBitmapLayers } from "../art/characterBitmapArt";
import { APPROVED_GS015_ROOM_ATLASES, FRONTAGE_V2_ASSETS, LANDSCAPING_ATLAS_V1,
  LANDSCAPING_ATLAS_V1_FRAMES, ENVIRONMENT_ATLAS_V1, ENVIRONMENT_ATLAS_V1_FRAMES,
  SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES, ROOM_FIXTURE_ATLASES, getEnvironmentAtlasFrameKey } from "../art/bitmapAssetManifest";
import { compactReducedStaticTexture, reducedTextureSource } from "../mobile/performance/reducedTextureSource";
import { facilityAtlasClip, installPhoneArtSource, phoneArtSource } from "../mobile/performance/phoneArt";
import { mobileRoomAssets } from "../mobile/performance/roomAssets";

vi.mock("phaser", () => ({ default: { Scene: class {}, Textures: { FilterMode: { NEAREST: 0 } } } }));

class Canvas {
  constructor(public width = 1, public height = 1) {}
  getContext() { return { drawImage() {}, clearRect() {}, fillRect() {},
    getImageData: (_x: number, _y: number, width: number, height: number) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }),
    putImageData() {}, createRadialGradient: () => ({ addColorStop() {} }) } as any; }
}
beforeEach(() => {
  vi.stubGlobal("window", {}); vi.stubGlobal("HTMLCanvasElement", Canvas);
  vi.stubGlobal("document", { createElement: () => new Canvas() });
});
afterEach(() => vi.unstubAllGlobals());

/** Real Phaser Texture/Frame/Image, especially setTexture's retained scale and
 * frame-derived display size. No display-size-independent Image mock. */
function harness() {
  const Texture = nativePhaserMemoryClass("textures/Texture.js"), parse = nativePhaserMemoryClass("textures/parsers/Image.js");
  const Image = nativePhaserMemoryClass("gameobjects/image/Image.js"), rows = new Map<string, any>();
  const TileSprite = nativePhaserMemoryClass("gameobjects/tilesprite/TileSprite.js");
  const manager: any = { game: { renderer: { gl: null, config: {} }, config: { renderType: 1 } },
    exists: (key: string) => rows.has(key), get: (key: string) => rows.get(key), removeKey: (key: string) => rows.delete(key),
    addImage(key: string, source: any) { const texture = new Texture(manager, key, source); parse(texture, 0); rows.set(key, texture); return texture; },
    remove(key: string) { rows.get(key)?.destroy(); rows.delete(key); } };
  const scene = new FacilityScene({ viewModel: { rooms: [] } } as any) as any;
  scene.sys = { textures: manager, queueDepthSort() {}, events: new EventEmitter(),
    anims: Object.assign(new EventEmitter().setMaxListeners(0), { textureManager: manager }) };
  scene.textures = manager; scene.layout = { originX: 0, originY: 0, tileSize: 64 };
  scene.add = { image: (x: number, y: number, key: string, frame?: string) => new Image(scene, x, y, key, frame),
    tileSprite: (x: number, y: number, width: number, height: number, key: string, frame?: string) => new TileSprite(scene, x, y, width, height, key, frame) };
  const source = (key: string, width: number, height: number, divisor = 1) => {
    const texture = manager.addImage(key, new Canvas(Math.ceil(width / divisor), Math.ceil(height / divisor)));
    if (divisor !== 1) installPhoneArtSource(texture, { path: "", width: Math.ceil(width / divisor), height: Math.ceil(height / divisor), sourceWidth: width, sourceHeight: height });
    return texture;
  };
  return { scene, manager, source, rows };
}
const rect = (image: any) => ({ x: image.x, y: image.y, width: image.displayWidth, height: image.displayHeight,
  originX: image.originX, originY: image.originY, depth: image.depth,
  left: image.x - image.originX * image.displayWidth, top: image.y - image.originY * image.displayHeight });
function sameRect(actual: ReturnType<typeof rect>, expected: ReturnType<typeof rect>) {
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) expect(Math.abs(actual[key] - expected[key]), key).toBeLessThanOrEqual(.5);
}

it("preserves all chair/bench/bed mask world rectangles through occupied/empty swaps with native, half and quarter sources", () => {
  const f = harness();
  for (const mask of APPROVED_SIDE_CHAIR_MASKS) for (const tile of [32, 64, 97]) for (const divisor of [1, 2, 4]) {
    const draw = resolveApprovedRoomDrawRecords(mask.roomDefinitionId, mask.orientation).find(draw => draw.id === mask.drawId)!;
    const atlas = APPROVED_GS015_ROOM_ATLASES.find(asset => asset.id === mask.assetId)!;
    const fullKey = `full.${mask.id}.${tile}.${divisor}`, rear = fullKey + ".rear", foreground = fullKey + ".front";
    f.source(fullKey, atlas.nativeWidth, atlas.nativeHeight, divisor).add("crop", 0, ...mask.sourceRect);
    f.source(rear, mask.sourceRect[2], mask.sourceRect[3]); f.source(foreground, mask.sourceRect[2], mask.sourceRect[3]);
    if (divisor === 4) { compactReducedStaticTexture(f.manager, rear); compactReducedStaticTexture(f.manager, foreground); }
    const width = Math.round(draw.renderSizeTiles[0] * tile), height = Math.round(draw.renderSizeTiles[1] * tile);
    const base = f.scene.add.image(31, 83, fullKey, "crop").setOrigin(0, 0).setDisplaySize(width, height).setDepth(123_000);
    const front = f.scene.add.image(31, 83, foreground).setOrigin(0, 0).setDisplaySize(width, height).setDepth(123_000);
    const expected = rect(base);
    f.scene.approvedSideChairRuntimes.clear(); f.scene.characterGraphics.clear();
    f.scene.approvedSideChairRuntimes.set("fixture", { baseImage: base, foregroundImage: front, mask, roomInstanceId: "public.room",
      supportIds: mask.supportIds, drawId: draw.id, fullTextureKey: fullKey, fullFrame: "crop", rearTextureKey: rear,
      foregroundTextureKey: foreground, fixtureDepth: expected.depth });
    const actor = f.scene.add.image(31, 83, fullKey, "crop").setDepth(123_050)
      .setData("actor-support-room-instance-id", "public.room").setData("actor-support-id", mask.supportIds[0]);
    for (const occupied of [true, true, false, false, true, false]) {
      actor.setVisible(occupied); f.scene.characterGraphics.set("actor", actor); f.scene.reconcileApprovedSideChairLayers();
      sameRect(rect(base), expected);
      sameRect(rect(front), { ...expected, depth: occupied ? 123_050.5 : expected.depth });
      expect(front.visible).toBe(occupied); expect(base.depth).toBe(expected.depth);
    }
  }
});

it("keeps compacted backless-stool native crops and source anchors at the authored display size", () => {
  const f = harness();
  for (const stool of APPROVED_ROLLING_STOOL_SOURCES.filter(stool => stool.derivation)) {
    const [, , width, height] = stool.sourceRect;
    const normalKey = "normal." + stool.id, reducedKey = "reduced." + stool.id;
    f.source(normalKey, width, height); f.source(reducedKey, width, height); compactReducedStaticTexture(f.manager, reducedKey);
    const normal = f.scene.add.image(101, 229, normalKey).setOrigin(.2, .85).setDisplaySize(47, 47 * height / width).setDepth(101_000);
    const reduced = f.scene.add.image(101, 229, reducedKey).setOrigin(.2, .85).setDisplaySize(47, 47 * height / width).setDepth(101_000);
    sameRect(rect(reduced), rect(normal));
    // A derivative is a local crop, not an atlas at the original nonzero Y.
    // Its crop width must be converted with the retained logical dimensions.
    const [cropWidth, cropHeight] = facilityAtlasClip(f.manager.get(reducedKey), [0, 0, width, height], width * .63);
    reduced.setCrop(0, 0, cropWidth, cropHeight);
    expect(reduced._crop.width * reduced.scaleX).toBeCloseTo(normal.displayWidth * .63, 8);
    expect(reduced._crop.height * reduced.scaleY).toBeCloseTo(normal.displayHeight, 8);
    expect(Math.max(...[f.manager.get(reducedKey).source[0].width, f.manager.get(reducedKey).source[0].height])).toBeLessThanOrEqual(384);
  }
});

it("draws regular mobile-atlas fixtures and derived stools through the scene with identical world rectangles", () => {
  for (const definitionId of ["room.minor_procedure", "room.ultrasound"]) {
    const orientation = 0;
    const snapshots: ReturnType<typeof rect>[] = [];
    for (const reduced of [false, true]) {
      const f = harness(), records = resolveApprovedRoomDrawRecords(definitionId, orientation);
      f.scene.bridge.mobileInput = reduced;
      // Include shell/decor dependencies so the real mobile readiness gate runs.
      for (const asset of mobileRoomAssets(definitionId)) {
        const variant = reduced ? phoneArtSource(asset, true) : undefined;
        const texture = f.manager.addImage(`stitchin-time-art:${asset.id}`,
          new Canvas(variant?.width ?? asset.nativeWidth, variant?.height ?? asset.nativeHeight));
        if (variant) installPhoneArtSource(texture, variant);
      }
      for (const draw of records) {
        const asset = APPROVED_GS015_ROOM_ATLASES.find(asset => asset.id === draw.assetId)!;
        const key = `stitchin-time-art:${asset.id}`;
        if (!f.manager.exists(key)) {
          const variant = reduced ? phoneArtSource(asset, true) : undefined;
          const texture = f.manager.addImage(key, new Canvas(variant?.width ?? asset.nativeWidth, variant?.height ?? asset.nativeHeight));
          if (variant) installPhoneArtSource(texture, variant);
        }
      }
      for (const stool of APPROVED_ROLLING_STOOL_SOURCES.filter(stool => stool.derivation)) {
        const key = "stool." + stool.id;
        f.source(key, stool.sourceRect[2], stool.sourceRect[3]);
        if (reduced) compactReducedStaticTexture(f.manager, key);
      }
      f.scene.ensureBacklessRollingStoolTexture = (stool: { id: string }) => "stool." + stool.id;
      f.scene.ensureApprovedSideChairTextures = () => undefined;
      f.scene.getTouchupDrawRecords = () => applyRoomTouchupsToRecords(definitionId, orientation, 4, records);
      f.scene.getPeriopCompanionChairs = () => [];
      f.scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set() });
      f.scene.getTouchupRoomLighting = () => undefined;
      f.scene.drawTouchupSprite = () => undefined;
      const room = { instanceId: "public-room", definitionId, orientation, width: 4, height: 4 };
      expect(f.scene.drawApprovedRoomFixtures(room, { x: 31, y: 83, width: 384, height: 320 })).toBe(true);
      const images = [...f.scene.fixtureBitmapImages.values()];
      expect(images.length).toBeGreaterThan(0);
      if (!reduced) snapshots.push(...images.map(rect));
      else { expect(images).toHaveLength(snapshots.length); images.forEach((image, i) => sameRect(rect(image), snapshots[i]!)); }
    }
  }
});

it("keeps every cleaned-landscaping frame at its normal fitted world size, position, anchor and depth", () => {
  const snapshots: ReturnType<typeof rect>[] = [];
  for (const divisor of [1, 2]) {
    const f = harness(), baseKey = `stitchin-time-art:${LANDSCAPING_ATLAS_V1.id}`, cleanKey = baseKey + ":tree-gaps-cleaned";
    f.source(baseKey, LANDSCAPING_ATLAS_V1.nativeWidth, LANDSCAPING_ATLAS_V1.nativeHeight, divisor);
    f.source(cleanKey, LANDSCAPING_ATLAS_V1.nativeWidth, LANDSCAPING_ATLAS_V1.nativeHeight);
    if (divisor === 2) {
      compactReducedStaticTexture(f.manager, cleanKey);
      // Mirror the cleanup caller's explicit, idempotent source installation.
      const image = f.manager.get(cleanKey).getSourceImage();
      installPhoneArtSource(f.manager.get(cleanKey), { path: "", width: image.width, height: image.height,
        sourceWidth: LANDSCAPING_ATLAS_V1.nativeWidth, sourceHeight: LANDSCAPING_ATLAS_V1.nativeHeight });
    }
    f.scene.landscapingAtlasReady = true; f.scene.landscapingTreeCleanupReady = true;
    f.scene.registerLandscapingAtlasFrames();
    let index = 0;
    for (const id of Object.keys(LANDSCAPING_ATLAS_V1_FRAMES)) {
      expect(f.scene.drawAuthoredLandscaping(id, id, 201, 310, 91, 113, 1, 999)).toBe(true);
      const image = f.scene.landscapingBitmapImages.get(id);
      if (divisor === 1) snapshots.push(rect(image)); else sameRect(rect(image), snapshots[index]!);
      index++;
    }
  }
});

it("keeps independent frontage images at the same world size when their backing source is reduced", () => {
  for (const [id, asset] of Object.entries(FRONTAGE_V2_ASSETS)) {
    const snapshots: ReturnType<typeof rect>[] = [];
    for (const reduced of [false, true]) {
      const f = harness(), image = new Canvas(asset.nativeWidth, asset.nativeHeight);
      const backing = reduced ? reducedTextureSource(image as any, Math.max(image.width, image.height) / 2) : image;
      f.manager.addImage(`stitchin-time-art:${asset.id}`, backing);
      f.scene.drawFrontageImage(id, id, 300, 400, 97, 999);
      snapshots.push(rect(f.scene.landscapingBitmapImages.get(id)));
    }
    sameRect(snapshots[1]!, snapshots[0]!);
  }
});

it("preserves native tile world bounds, material pitch and phase for environment, architecture and frontage", () => {
  const normal = new Map<string, { bounds: ReturnType<typeof rect>; pitchX: number; pitchY: number; phaseX: number; phaseY: number }>();
  for (const reduced of [false, true]) {
    const f = harness(); f.scene.bridge.mobileInput = reduced;
    const install = (asset: { id: string; nativeWidth: number; nativeHeight: number }) => {
      const key = `stitchin-time-art:${asset.id}`;
      if (!f.manager.exists(key)) f.source(key, asset.nativeWidth, asset.nativeHeight, reduced ? 4 : 1);
      return f.manager.get(key);
    };
    const check = (id: string) => {
      const sprite = f.scene.environmentSprites.get(id);
      const measured = { bounds: rect(sprite), pitchX: sprite.frame.realWidth * sprite.tileScaleX * sprite.scaleX,
        pitchY: sprite.frame.realHeight * sprite.tileScaleY * sprite.scaleY,
        phaseX: sprite.tilePositionX * sprite.tileScaleX * sprite.scaleX, phaseY: sprite.tilePositionY * sprite.tileScaleY * sprite.scaleY };
      if (!reduced) normal.set(id, measured);
      else {
        const reference = normal.get(id)!; sameRect(measured.bounds, reference.bounds);
        for (const key of ["pitchX", "pitchY", "phaseX", "phaseY"] as const) expect(measured[key], id + ":" + key).toBeCloseTo(reference[key], 8);
      }
    };
    const environment = install(ENVIRONMENT_ATLAS_V1); f.scene.environmentAtlasReady = true;
    f.scene.registerEnvironmentAtlasFrames();
    for (const id of Object.keys(ENVIRONMENT_ATLAS_V1_FRAMES)) {
      expect(environment.has(getEnvironmentAtlasFrameKey(ENVIRONMENT_ATLAS_V1_FRAMES[id as keyof typeof ENVIRONMENT_ATLAS_V1_FRAMES]))).toBe(true);
      f.scene.drawEnvironmentTile(id, id, 51, 109, 127, 83, 999, .7); check(id);
    }
    for (const [id, frame] of Object.entries(SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES)) {
      const asset = ROOM_FIXTURE_ATLASES.find(asset => asset.id === frame.atlasId)!;
      install(asset).add(getEnvironmentAtlasFrameKey(frame), 0, frame.sourceRect.x, frame.sourceRect.y, frame.sourceRect.width, frame.sourceRect.height);
      const key = "architecture." + id;
      f.scene.drawSurgeryCenterComponentTile(key, id, 51, 109, 127, 83, 999, .7, .35); check(key);
    }
    for (const [id, asset] of Object.entries(FRONTAGE_V2_ASSETS)) {
      install(asset);
      // Includes a subpixel curb band with a compensating one-pixel buffer.
      const height = id.startsWith("frontage:curb-") ? .4 : 83;
      f.scene.drawFrontageTile(id, id, 51, 109, 127, height, 999, .7); check(id);
    }
  }
});

it("keeps character-still world rectangles and floor/seat anchors when sources cap at 192px", () => {
  // Same synthetic descriptor as the accepted geometry fixture, without the
  // unrelated, unreleased character-room QA module.
  const appearance: PixelAppearanceDescriptor = { version: "pixel-avatar.v1", stillId: "gs022-new-employee-015",
    roleStyle: "patient", bodyShape: "average", hairStyle: "short", hairShade: 0,
    faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none" };
  for (const direction of ["front", "back", "side"] as const) for (const pose of ["idle", "seated"] as const) {
    const snapshots: { actor: ReturnType<typeof rect>; container: ReturnType<typeof rect> }[] = [];
    for (const reduced of [false, true]) {
      const f = harness(), layers = characterBitmapLayers(appearance, direction, pose, false)!;
      const asset = layers.actor.atlas, key = `stitchin-time-art:${asset.id}`;
      const backing = new Canvas(asset.nativeWidth, asset.nativeHeight);
      f.manager.addImage(key, reduced ? reducedTextureSource(backing as any, 192) : backing);
      const actor = f.scene.add.image(0, 0, key).setName("actor");
      const Container = nativePhaserMemoryClass("gameobjects/container/Container.js"), container = new Container(f.scene, 0, 0, [actor]);
      f.scene.getCharacterBitmapContainer = () => container;
      f.scene.updateCharacterContactShadow = () => undefined;
      const graphics = { getData: () => "public.actor", clear() {}, setVisible() {} };
      expect(f.scene.drawPixelPerson(graphics, 101, 229, 0, appearance, 0, direction, pose, false, 1, undefined, false, pose === "seated").representation).toBe("bitmap");
      snapshots.push({ actor: rect(actor), container: rect(container) });
    }
    sameRect(snapshots[1]!.actor, snapshots[0]!.actor); sameRect(snapshots[1]!.container, snapshots[0]!.container);
  }
});
