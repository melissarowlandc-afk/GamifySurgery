import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { describe, expect, it, vi } from "vitest";
import { staffStillEligibleEntries, type PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import accepted from "../../../../tests/fixtures/app-registration-acceptance.json";
import { allCanonicalCharacterAtlases, characterBitmapLayers, characterBitmapRegistration, characterStandingBitmapDescriptors } from "./characterBitmapArt";
import { getAllCharacterStillEntries, getCharacterStillEntry, resolveCharacterStillAssetUrl, type CharacterStillAsset } from "./characterStillRegistry";
import { AUTHORED_BITMAP_ASSET_MANIFEST } from "./bitmapAssetManifest";
import { getReactBitmapRenderPlan, preloadBitmapAssets } from "./bitmapAssetAdapters";

// Exercise real scene preload selection without a graphics/browser process.
vi.mock("phaser", () => ({ default: { Scene: class {}, Loader: { Events: { COMPLETE: "complete" } } } }));
import { FacilityScene } from "../facility/FacilityScene";

const publicRoot = fileURLToPath(new URL("../../public/", import.meta.url));
const pool = () => staffStillEligibleEntries("staff.app");
const appEntries = () => getAllCharacterStillEntries().filter(entry => entry.eligibleStaffRoleDefinitionIds?.includes("staff.app"));
const appearance = (stillId: string): PixelAppearanceDescriptor => ({
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", hairShade: 0,
  faceStyle: "round", outfitStyle: "coat", outfitShade: 0, accessory: "none", roleStyle: "app",
  stillId: stillId as NonNullable<PixelAppearanceDescriptor["stillId"]>,
});
const cardinals = [
  ["south", "front", false], ["east", "side", true],
  ["west", "side", false], ["north", "back", false],
] as const;

function stableJson(value: unknown): string {
  const sort = (item: unknown): unknown => Array.isArray(item) ? item.map(sort)
    : item !== null && typeof item === "object"
      ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, sort(child)]))
      : item;
  return JSON.stringify(sort(value));
}

function expectLoadablePng(asset: CharacterStillAsset) {
  const target = resolve(publicRoot, asset.url);
  expect(target.startsWith(publicRoot.endsWith(sep) ? publicRoot : `${publicRoot}${sep}`)).toBe(true);
  const bytes = readFileSync(target);
  expect(createHash("sha256").update(bytes).digest("hex"), asset.url).toBe(asset.sha256);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(bytes.toString("ascii", 12, 16)).toBe("IHDR");
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([160, 320]);
  expect([...bytes.subarray(24, 29)]).toEqual([8, 6, 0, 0, 0]); // RGBA8, standard compression/filtering, no interlace.
  const compressed: Buffer[] = [];
  let foundEnd = false;
  for (let offset = 8; offset < bytes.length;) {
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    expect(end).toBeLessThanOrEqual(bytes.length);
    const kind = bytes.toString("ascii", offset + 4, offset + 8);
    if (kind === "IDAT") compressed.push(bytes.subarray(offset + 8, offset + 8 + length));
    if (kind === "IEND") { foundEnd = true; break; }
    offset = end;
  }
  expect(foundEnd).toBe(true);
  expect(compressed.length).toBeGreaterThan(0);
  // Decode native PNG data too: a path or IHDR-only stub is not loadable art.
  const pixels = inflateSync(Buffer.concat(compressed));
  const stride = 160 * 4 + 1;
  expect(pixels.length).toBe(320 * stride);
  for (let row = 0; row < 320; row++) expect(pixels[row * stride]).toBeLessThanOrEqual(4);
}

describe("B-016 approved APP registration, compatibility and lazy bitmap loading", () => {
  it("makes at least 32 APP looks selectable and registers exactly the same IDs in the player", () => {
    // Runtime IDs for the two new art packages were not final in the handoffs.
    // Bind exact approved bytes below; use the brief's count/band fallback here.
    expect(pool().length).toBeGreaterThanOrEqual(32);
    expect(new Set(pool().map(row => row.stillId)).size).toBe(pool().length);
    expect(new Set(appEntries().map(row => row.id))).toEqual(new Set(pool().map(row => row.stillId)));
    for (const old of accepted.existing) expect(pool().map(row => row.stillId)).toContain(old.id);
  });

  it.each([
    { sex: "Female", low: 18, high: 29 }, { sex: "Male", low: 18, high: 29 },
    { sex: "Female", low: 30, high: 44 }, { sex: "Male", low: 30, high: 44 },
    { sex: "Female", low: 45, high: 64 }, { sex: "Male", low: 45, high: 64 },
    { sex: "Female", low: 65, high: Number.POSITIVE_INFINITY },
    { sex: "Male", low: 65, high: Number.POSITIVE_INFINITY },
  ])("offers at least four approved APP looks in the $sex $low–$high art band", ({ sex, low, high }) => {
    // Editorial visual variety, never a staff-selection or clinical quota.
    const members = appEntries().filter(row => row.intendedSex === sex && Number.isInteger(row.intendedAge)
      && row.intendedAge! >= low && row.intendedAge! <= high);
    expect(members.length).toBeGreaterThanOrEqual(4);
  });

  it.each(accepted.approvedAdditions)("registers all eight approved poses and labels for $label (including revised pilot 001)", design => {
    // The south hash identifies the approved person regardless of registration
    // naming; pilot 001 uses ONLY the approved sturdy revision, not its original.
    const matches = getAllCharacterStillEntries().filter(entry => entry.poses.stand.south.sha256 === design.poses["stand-south"]);
    expect(matches, `Approved APP art is missing or duplicated: ${design.label}`).toHaveLength(1);
    const entry = matches[0]!;
    expect(pool().map(row => row.stillId)).toContain(entry.id);
    expect(entry).toMatchObject({ intendedAge: design.age, intendedSex: design.sex });
    for (const posture of ["stand", "sit"] as const) for (const [cardinal] of cardinals) {
      const asset = entry.poses[posture][cardinal];
      expect(asset.sha256).toBe(design.poses[`${posture}-${cardinal}`]);
      expectLoadablePng(asset);
    }
  });

  it.each(accepted.existing)("keeps existing APP $id and every original pose/contact byte-identical", old => {
    expect(pool().map(row => row.stillId)).toContain(old.id);
    const entry = getCharacterStillEntry(old.id)!;
    expect(entry).toBeDefined();
    expect(entry).toMatchObject({ intendedAge: old.age, intendedSex: old.sex });
    expect(createHash("sha256").update(stableJson(entry.poses)).digest("hex")).toBe(old.posesSha256);
  });

  it("loads every selectable APP's C8 poses through real bitmap descriptors with valid seat contacts", () => {
    expect(pool().length).toBeGreaterThanOrEqual(10);
    for (const design of pool()) {
      const entry = getCharacterStillEntry(design.stillId)!;
      expect(entry, design.stillId).toBeDefined();
      const urls: string[] = [];
      for (const posture of ["stand", "sit"] as const) for (const [cardinal, direction, right] of cardinals) {
        const layer = characterBitmapLayers(appearance(design.stillId), direction, posture === "sit" ? "seated" : "idle", right)!;
        expect(layer, `${design.stillId} ${posture}-${cardinal}`).toBeDefined();
        const asset = entry.poses[posture][cardinal];
        expect(layer.actor.asset).toBe(asset);
        expect(layer.actor.flipX).toBe(false);
        expect(layer.actor.atlas).toMatchObject({ nativeWidth: 160, nativeHeight: 320, relativePath: asset.url, kind: "character" });
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        const registration = characterBitmapRegistration(layer);
        expect(registration.cell).toEqual({ width: 160, height: 320 });
        if (posture === "sit") {
          expect(Number.isFinite(registration.seatContactY)).toBe(true);
          expect(registration.seatContactY).toBeGreaterThan(asset.visibleBounds.y);
          expect(registration.seatContactY).toBeLessThan(registration.floorY);
          expect(registration.seatContactY).toBeLessThanOrEqual(asset.visibleBounds.y + asset.visibleBounds.height);
        }
        const plan = getReactBitmapRenderPlan({ descriptor: layer.actor.atlas, source: "bitmap", fallback: null }, "/GamifySurgery/");
        expect(plan.src).toBe(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/"));
        const loaded: string[] = [];
        expect(preloadBitmapAssets({ image: (_key, url) => loaded.push(url) }, [layer.actor.atlas], "/GamifySurgery/")).toHaveLength(1);
        expect(loaded).toEqual([plan.src]);
        expectLoadablePng(asset);
        urls.push(asset.url);
      }
      expect(new Set(urls).size).toBe(8);
    }
  });

  it("adds zero startup character preloads through the existing scene and legacy preload hooks", () => {
    expect(allCanonicalCharacterAtlases()).toEqual([]);
    expect(Object.values(AUTHORED_BITMAP_ASSET_MANIFEST).filter(asset => asset.kind === "character")).toEqual([]);
    const image = vi.fn(), start = vi.fn();
    const scene = Object.assign(Object.create(FacilityScene.prototype), {
      bridge: { mobileInput: false },
      textures: { exists: () => false }, load: { image, once: vi.fn(), start },
    }) as { ensureEnvironmentAtlas: () => void };
    scene.ensureEnvironmentAtlas();
    expect(start).toHaveBeenCalledTimes(1);
    expect(image.mock.calls.length).toBeGreaterThan(0);
    expect(image.mock.calls.filter(([, url]) => String(url).includes("/art/characters/"))).toEqual([]);
    const firstCount = image.mock.calls.length;
    scene.ensureEnvironmentAtlas();
    expect(image).toHaveBeenCalledTimes(firstCount);
  });

  it("prefetches only four standing poses for one live APP and deduplicates repeat requests", () => {
    for (const design of pool()) {
      const entry = getCharacterStillEntry(design.stillId)!;
      const descriptors = characterStandingBitmapDescriptors(appearance(design.stillId));
      expect(descriptors).toHaveLength(4);
      expect(new Set(descriptors.map(row => row.relativePath))).toEqual(new Set(cardinals.map(([cardinal]) => entry.poses.stand[cardinal].url)));
      const image = vi.fn();
      expect(preloadBitmapAssets({ image }, [...descriptors, ...descriptors], "/GamifySurgery/")).toHaveLength(4);
      expect(image).toHaveBeenCalledTimes(4);
    }
  });
});
