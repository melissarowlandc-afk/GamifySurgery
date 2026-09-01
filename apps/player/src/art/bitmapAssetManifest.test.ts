import { describe, expect, it } from "vitest";
import { FIXTURE_SPRITES } from "./fixtureArt";
import {
  AUTHORED_BITMAP_ASSET_MANIFEST,
  ENVIRONMENT_ATLAS_V1,
  ENVIRONMENT_ATLAS_V1_FRAMES,
  FRONT_DESK_V2_FIXTURE_OVERRIDES,
  FRONT_DESK_V4_ARCHITECTURE_FRAMES,
  FRONT_DESK_V4_SHELL_LAYOUT,
  EXAMINATION_V2_ARCHITECTURE_FRAMES,
  LANDSCAPING_ATLAS_V1,
  LANDSCAPING_ATLAS_V1_FRAMES,
  LEVEL_ONE_BITMAP_FIXTURE_FRAMES,
  LEVEL_ONE_ROOM_FIXTURE_ATLASES,
  LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES,
  LEVEL_TWO_ROOM_FIXTURE_ATLASES,
  PATIENT_CHARACTER_ATLASES_V1,
  PATIENT_CHARACTER_CORE_MAP_ATLASES_V1,
  PATIENT_CHARACTER_MAP_ATLASES_V1,
  ROOM_FIXTURE_ATLASES,
  createCharacterBitmapDescriptor,
  createFixtureBitmapDescriptor,
  createPortraitBitmapDescriptor,
  getEnvironmentAtlasFrameKey,
  getFixtureBitmapAssetId,
  getLevelOneBitmapFixtureFrame,
  getRoomBitmapFixtureFrame,
  resolveBitmapAsset,
  resolvePublicArtAssetUrl,
} from "./bitmapAssetManifest";
import {
  BitmapAssetPreloadCache,
  getPhaserBitmapRenderPlan,
  registerPhaserAtlasFrames,
  getReactBitmapRenderPlan,
  getPhaserTextureKey,
  preloadBitmapAssets,
} from "./bitmapAssetAdapters";

describe("bitmap art asset seam", () => {
  it("keeps the revisioned 50-person patient pack separate from scene core textures", () => {
    expect(PATIENT_CHARACTER_ATLASES_V1).toHaveLength(20);
    expect(PATIENT_CHARACTER_MAP_ATLASES_V1).toHaveLength(18);
    expect(PATIENT_CHARACTER_CORE_MAP_ATLASES_V1).toHaveLength(14);
    const portrait = PATIENT_CHARACTER_ATLASES_V1.find((asset) => asset.id.includes("-portrait-"));
    const thumbnail = PATIENT_CHARACTER_ATLASES_V1.find((asset) => asset.id.includes("-thumbnail-"));
    expect(portrait?.nativeWidth).toBe(960);
    expect(portrait?.nativeHeight).toBe(2240);
    expect(thumbnail?.nativeWidth).toBe(480);
    expect(thumbnail?.nativeHeight).toBe(1120);
    for (const asset of PATIENT_CHARACTER_ATLASES_V1) {
      expect(asset.relativePath).toContain("?rev=patients-v1-r6");
    }
  });

  it("maps Level 1 furniture to measured, non-uniform transparent source frames", () => {
    expect(LEVEL_ONE_ROOM_FIXTURE_ATLASES).toHaveLength(12);
    expect(
      LEVEL_ONE_ROOM_FIXTURE_ATLASES.some(
        (asset) => asset.id === "room-fixtures:surgery-center-architecture-v1",
      ),
    ).toBe(true);
    expect(
      LEVEL_ONE_ROOM_FIXTURE_ATLASES.find(
        (atlas) => atlas.id === "room-fixtures:front-desk-v2",
      )?.relativePath,
    ).toBe("art/rooms/front-desk-v2/front-desk-components-v2.png");
    expect(
      LEVEL_ONE_ROOM_FIXTURE_ATLASES.find(
        (atlas) => atlas.id === "room-fixtures:front-desk-v4",
      )?.relativePath,
    ).toBe("art/rooms/front-desk-v4/front-desk-shell-v4.png");
    expect(FRONT_DESK_V4_ARCHITECTURE_FRAMES.shell.sourceRect).toEqual({
      x: 0, y: 0, width: 1254, height: 1254,
    });
    expect(FRONT_DESK_V4_ARCHITECTURE_FRAMES.frontOccluder.sourceRect).toEqual({
      x: 157, y: 941, width: 940, height: 153,
    });
    expect(FRONT_DESK_V4_SHELL_LAYOUT.floor).toEqual({
      x: 212, y: 339, width: 832, height: 622,
    });
    expect(FRONT_DESK_V4_SHELL_LAYOUT.rearWallDecor.noticeBoard).toEqual({
      centerX: 480, centerY: 215, width: 205, height: 167,
    });
    expect(FRONT_DESK_V4_SHELL_LAYOUT.rearWallDecor.wallClock).toEqual({
      centerX: 680, centerY: 215, width: 113, height: 103,
    });
    expect(
      LEVEL_ONE_ROOM_FIXTURE_ATLASES.find(
        (atlas) => atlas.id === "room-fixtures:examination-v2-horizontal",
      )?.relativePath,
    ).toBe("art/rooms/examination-v2/examination-shell-horizontal-v2.png");
    expect(EXAMINATION_V2_ARCHITECTURE_FRAMES.horizontal.shell.sourceRect).toEqual({
      x: 0, y: 0, width: 960, height: 960,
    });
    expect(EXAMINATION_V2_ARCHITECTURE_FRAMES.vertical.frontOccluder.sourceRect).toEqual({
      x: 202, y: 854, width: 552, height: 80,
    });
    for (const [id, frame] of Object.entries(LEVEL_ONE_BITMAP_FIXTURE_FRAMES)) {
      expect(frame?.id).toBe(`fixture:${id}`);
      expect(frame?.sourceRect.width).toBeGreaterThan(32);
      expect(frame?.sourceRect.height).toBeGreaterThan(32);
      expect(frame?.anchor.y).toBe(frame?.nativeHeight);
      expect(LEVEL_ONE_ROOM_FIXTURE_ATLASES.some((atlas) => atlas.id === frame?.atlasId)).toBe(true);
    }
    expect(getLevelOneBitmapFixtureFrame("frontDesk")?.nativeWidth).toBeGreaterThan(400);
    expect(getLevelOneBitmapFixtureFrame("frontDesk")?.atlasId)
      .toBe("room-fixtures:front-desk-v1");
    expect(FRONT_DESK_V2_FIXTURE_OVERRIDES.frontDesk?.atlasId)
      .toBe("room-fixtures:front-desk-v2");
    expect(getRoomBitmapFixtureFrame("room.front_desk", "frontDesk")?.atlasId)
      .toBe("room-fixtures:front-desk-v2");
    expect(getRoomBitmapFixtureFrame("room.front_desk", "visitorChair")).toMatchObject({
      atlasId: "room-fixtures:waiting-v1",
      sourceRect: { x: 157, y: 681, width: 232, height: 254 },
      nativeWidth: 232,
      nativeHeight: 254,
    });
    expect(getRoomBitmapFixtureFrame("room.waiting", "visitorChair")?.sourceRect).toEqual({
      x: 157, y: 681, width: 232, height: 254,
    });
    expect(getRoomBitmapFixtureFrame("room.coffee_kiosk", "filingCabinet")?.atlasId)
      .toBe("room-fixtures:front-desk-v1");
    expect(getLevelOneBitmapFixtureFrame("procedureLight")?.nativeHeight).toBeGreaterThan(400);
  });

  it("keeps Level 2 specialty fixtures room-scoped instead of replacing Level 1 art", () => {
    expect(LEVEL_TWO_ROOM_FIXTURE_ATLASES).toHaveLength(3);
    expect(ROOM_FIXTURE_ATLASES).toHaveLength(
      LEVEL_ONE_ROOM_FIXTURE_ATLASES.length + LEVEL_TWO_ROOM_FIXTURE_ATLASES.length,
    );
    const expectedRooms = [
      "room.ultrasound", "room.ct", "room.phlebotomy", "room.evs_closet",
      "room.endoscopy", "room.periop_recovery", "room.training",
      "room.coffee_kiosk", "room.glp1_telehealth_suite",
    ];
    expect(Object.keys(LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES)).toEqual(expectedRooms);
    for (const overrides of Object.values(LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES)) {
      expect(Object.keys(overrides).length).toBeGreaterThanOrEqual(3);
      for (const frame of Object.values(overrides)) {
        expect(frame?.sourceRect.width).toBeGreaterThan(100);
        expect(frame?.sourceRect.height).toBeGreaterThan(100);
        expect(LEVEL_TWO_ROOM_FIXTURE_ATLASES.some((atlas) => atlas.id === frame?.atlasId)).toBe(true);
      }
    }
    expect(getRoomBitmapFixtureFrame("room.endoscopy", "procedureTable")?.atlasId)
      .toBe("room-fixtures:level-two-endoscopy-recovery-training-v1");
    expect(getRoomBitmapFixtureFrame("room.minor_procedure", "procedureTable")?.atlasId)
      .toBe(getLevelOneBitmapFixtureFrame("procedureTable")?.atlasId);
  });

  it("keeps stable fixture IDs and native floor anchors", () => {
    const fixture = FIXTURE_SPRITES.frontDesk;
    const descriptor = createFixtureBitmapDescriptor("frontDesk", fixture);
    expect(descriptor.id).toBe(getFixtureBitmapAssetId("frontDesk"));
    expect(descriptor.nativeWidth).toBe(fixture.width);
    expect(descriptor.nativeHeight).toBe(fixture.height);
    expect(descriptor.anchor).toEqual({ x: fixture.width / 2, y: fixture.height });
    expect(descriptor.orientation).toBe("all");
  });

  it("uses the procedural fixture unchanged when no fixture pack is registered", () => {
    const fixture = FIXTURE_SPRITES.examTable;
    const resolved = resolveBitmapAsset(
      createFixtureBitmapDescriptor("examTable", fixture),
      fixture,
    );
    expect(AUTHORED_BITMAP_ASSET_MANIFEST).toEqual({});
    expect(resolved.source).toBe("procedural");
    expect(resolved.fallback).toBe(fixture);
    expect(getPhaserBitmapRenderPlan(resolved).textureKey).toBeUndefined();
    expect(getReactBitmapRenderPlan(resolved).src).toBeUndefined();
  });

  it("keeps the authored environment atlas measured, base-path-safe, and non-uniform", () => {
    expect(ENVIRONMENT_ATLAS_V1.relativePath).toBe(
      "art/environment/clinic-environment-atlas-v1.png",
    );
    expect(ENVIRONMENT_ATLAS_V1.nativeWidth).toBe(1254);
    const wall = ENVIRONMENT_ATLAS_V1_FRAMES["environment:north-wall"];
    const floor = ENVIRONMENT_ATLAS_V1_FRAMES["environment:clinical-floor"];
    expect(wall.sourceRect.width).not.toBe(floor.sourceRect.width);
    expect(wall.sourceRect.height).not.toBe(floor.sourceRect.height);
    expect(getEnvironmentAtlasFrameKey(wall)).toBe("frame:environment:north-wall");
    expect(resolvePublicArtAssetUrl(ENVIRONMENT_ATLAS_V1.relativePath!, "/GamifySurgery/")).toBe(
      "/GamifySurgery/art/environment/clinic-environment-atlas-v1.png",
    );
  });

  it("keeps independent landscaping transparent, measured, and separate from turf", () => {
    expect(LANDSCAPING_ATLAS_V1.relativePath).toBe(
      "art/environment/clinic-landscaping-atlas-v1.png",
    );
    expect(LANDSCAPING_ATLAS_V1.nativeWidth).toBe(1448);
    expect(LANDSCAPING_ATLAS_V1.nativeHeight).toBe(1086);
    const tree = LANDSCAPING_ATLAS_V1_FRAMES["landscape:tree-round"];
    const bench = LANDSCAPING_ATLAS_V1_FRAMES["landscape:bench"];
    expect(tree.sourceRect.width).not.toBe(bench.sourceRect.width);
    expect(tree.anchor.y).toBe(tree.nativeHeight);
    expect(resolvePublicArtAssetUrl(LANDSCAPING_ATLAS_V1.relativePath!, "/GamifySurgery/")).toBe(
      "/GamifySurgery/art/environment/clinic-landscaping-atlas-v1.png",
    );
  });

  it("registers atlas source rectangles once without assuming a grid", () => {
    const added: Array<readonly [string, number, number, number, number, number]> = [];
    const texture = {
      has: (name: string) => name === "frame:environment:north-wall",
      add: (
        name: string,
        source: number,
        x: number,
        y: number,
        width: number,
        height: number,
      ) => added.push([name, source, x, y, width, height]),
    };
    const frames = [
      ENVIRONMENT_ATLAS_V1_FRAMES["environment:north-wall"],
      ENVIRONMENT_ATLAS_V1_FRAMES["environment:clinical-floor"],
    ];
    expect(registerPhaserAtlasFrames(texture, frames)).toEqual([
      "frame:environment:clinical-floor",
    ]);
    expect(added).toEqual([
      ["frame:environment:clinical-floor", 0, 383, 371, 210, 210],
    ]);
  });

  it("selects registered transparent bitmap metadata without changing fallback semantics", () => {
    const fixture = FIXTURE_SPRITES.xrayTube;
    const base = createFixtureBitmapDescriptor("xrayTube", fixture);
    const authored = { ...base, relativePath: "art/fixtures/xray-tube.png", orientation: 90 as const };
    const resolved = resolveBitmapAsset(base, fixture, { [base.id]: authored });
    const phaser = getPhaserBitmapRenderPlan(resolved);
    const react = getReactBitmapRenderPlan(resolved, "/GamifySurgery/");
    expect(resolved.source).toBe("bitmap");
    expect(phaser.textureKey).toBe(getPhaserTextureKey(authored));
    expect(phaser.anchor).toEqual({ x: 0.5, y: 1 });
    expect(react.src).toBe("/GamifySurgery/art/fixtures/xray-tube.png");
    expect(react.fallback).toBe(fixture);
  });

  it("constructs base-path-safe URLs and character/portrait descriptors", () => {
    expect(resolvePublicArtAssetUrl("art/fixtures/desk.png", "/")).toBe("/art/fixtures/desk.png");
    expect(resolvePublicArtAssetUrl("/art/fixtures/desk.png", "/GamifySurgery/")).toBe("/GamifySurgery/art/fixtures/desk.png");
    expect(createCharacterBitmapDescriptor("head.01:idle", 48, 72).anchor).toEqual({ x: 24, y: 72 });
    expect(createPortraitBitmapDescriptor("head.01", 80, 96).kind).toBe("portrait");
  });

  it("preloads only authored sources once and safely skips absent sources", async () => {
    const fixture = FIXTURE_SPRITES.frontDesk;
    const noSource = createFixtureBitmapDescriptor("frontDesk", fixture);
    const withSource = { ...noSource, relativePath: "art/fixtures/front-desk.png" };
    const loaded: Array<{ key: string; url: string }> = [];
    expect(preloadBitmapAssets({ image: (key, url) => loaded.push({ key, url }) }, [noSource, withSource, withSource], "/GamifySurgery/")).toHaveLength(1);
    expect(loaded[0]?.url).toBe("/GamifySurgery/art/fixtures/front-desk.png");
    const cache = new BitmapAssetPreloadCache();
    await expect(cache.preload([noSource])).resolves.toEqual([]);
  });
});
