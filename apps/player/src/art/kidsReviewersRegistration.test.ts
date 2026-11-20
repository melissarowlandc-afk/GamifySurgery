import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { describe, expect, it, vi } from "vitest";
import { PEDIATRIC_CHARACTER_STILLS, pediatricStillEligibleEntries, type PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import approved from "../../../../tests/fixtures/kids-reviewers-acceptance.json";
import { FacilityScene } from "../facility/FacilityScene";
import { allCanonicalCharacterAtlases, characterBitmapLayers, characterBitmapRegistration, characterStandingBitmapDescriptors } from "./characterBitmapArt";
import { preloadBitmapAssets } from "./bitmapAssetAdapters";
import { AUTHORED_BITMAP_ASSET_MANIFEST } from "./bitmapAssetManifest";
import { CHARACTER_STILL_POSTURES, characterStillRegistry, getAllCharacterStillEntries, getCharacterStillEntry,
  resolveCharacterStillAssetUrl, type CharacterStillAsset, type CharacterStillEntry } from "./characterStillRegistry";

vi.mock("phaser", () => ({ default: { Scene: class {}, Loader: { Events: { COMPLETE: "complete" } } } }));

const repo = fileURLToPath(new URL("../../../../", import.meta.url));
const publicRoot = resolve(repo, "apps/player/public");
const poseDirections = [["south", "front", false], ["east", "side", true], ["west", "side", false], ["north", "back", false]] as const;
const rgbaPngMagic = [137, 80, 78, 71, 13, 10, 26, 10];
const appearance = (stillId: string): PixelAppearanceDescriptor => ({
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", hairShade: 0, faceStyle: "round",
  outfitStyle: "plain", outfitShade: 0, accessory: "none", stillId,
});

function readRegisteredPose(asset: CharacterStillAsset) {
  const file = resolve(publicRoot, asset.url);
  expect(file.startsWith(`${publicRoot}${sep}`), asset.url).toBe(true);
  const bytes = readFileSync(file);
  expect(createHash("sha256").update(bytes).digest("hex"), asset.url).toBe(asset.sha256);
  expect([...bytes.subarray(0, 8)]).toEqual(rgbaPngMagic);
  expect(bytes.toString("ascii", 12, 16)).toBe("IHDR");
  const { width, height } = characterStillRegistry.canvas;
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([width, height]);
  expect([...bytes.subarray(24, 29)]).toEqual([8, 6, 0, 0, 0]); // Eight-bit RGBA, no interlace.
  const idat: Buffer[] = [];
  let ended = false;
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = bytes.readUInt32BE(offset), next = offset + length + 12;
    expect(next, asset.url).toBeLessThanOrEqual(bytes.length);
    const chunk = bytes.toString("ascii", offset + 4, offset + 8);
    if (chunk === "IDAT") idat.push(bytes.subarray(offset + 8, next - 4));
    if (chunk === "IEND") { ended = next === bytes.length; break; }
    offset = next;
  }
  expect(ended, asset.url).toBe(true);
  const scanlines = inflateSync(Buffer.concat(idat)), stride = width * 4 + 1;
  expect(scanlines.length).toBe(height * stride);
  expect(scanlines.every((filter, index) => index % stride !== 0 || filter <= 4)).toBe(true);
}

type ApprovedPoses = typeof approved.children[number]["poses"];
function checkC8(entry: CharacterStillEntry, accepted: ApprovedPoses, seats: boolean) {
  const files = new Set<string>();
  const { width, height, axisX, floorY } = characterStillRegistry.canvas;
  expect([width, height, axisX, floorY]).toEqual([160, 320, 80, 287]);
  for (const posture of CHARACTER_STILL_POSTURES) for (const [cardinal, direction, right] of poseDirections) {
    const pose = `${posture}-${cardinal}` as const;
    const asset = entry.poses[posture][cardinal];
    expect(asset?.sha256, `${entry.id} ${pose} must match the approved version`).toBe(accepted[pose]);
    readRegisteredPose(asset);
    const layer = characterBitmapLayers(appearance(entry.id), direction, posture === "sit" ? "seated" : "idle", right);
    expect(layer?.actor.asset).toBe(asset);
    expect(layer?.actor.flipX).toBe(false);
    const registration = characterBitmapRegistration(layer!);
    expect(registration.cell).toEqual({ width, height });
    expect(asset.anchors).toMatchObject({ bodyAxisX: axisX, floorY });
    const bounds = asset.visibleBounds;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
    if (seats && posture === "sit") {
      expect(registration.seatContactY).toBe(asset.anchors.seatContactY);
      expect(registration.seatContactY).toBeGreaterThan(bounds.y);
      expect(registration.seatContactY).toBeLessThan(floorY);
      expect(registration.seatContactY).toBeLessThanOrEqual(bounds.y + bounds.height);
    }
    const requests: string[] = [];
    preloadBitmapAssets({ image: (_key, url) => requests.push(url) }, [layer!.actor.atlas], "/GamifySurgery/");
    expect(requests).toEqual([resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")]);
    files.add(asset.url);
  }
  expect(files.size).toBe(8);
}

describe("approved pediatric and attending reviewer C8 registration", () => {
  it("offers exactly the selected 59 child looks across all six age and sex bands", () => {
    expect(PEDIATRIC_CHARACTER_STILLS).toHaveLength(59);
    expect(PEDIATRIC_CHARACTER_STILLS.map(row => row.stillId).sort()).toEqual(approved.children.map(row => row.id).sort());
    const registered = getAllCharacterStillEntries().filter(row => row.category === "pediatric-presentation");
    expect(registered.map(row => row.id).sort()).toEqual(approved.children.map(row => row.id).sort());
    for (const look of approved.children) expect(PEDIATRIC_CHARACTER_STILLS.find(row => row.stillId === look.id)?.intendedVisualAge).toBe(look.age);
    for (let age = 5; age <= 17; age++) for (const sex of ["Female", "Male"] as const) {
      const selected = approved.children.filter(row => row.sex === sex && row.minimumAge <= age && age <= row.maximumAge);
      expect(pediatricStillEligibleEntries(sex, age).map(row => row.stillId).sort()).toEqual(selected.map(row => row.id).sort());
    }
    expect(getCharacterStillEntry("pediatric-variety-production-v1.039")).toBeUndefined();
  });

  it("retains all 96 original child poses and validates their recorded seat contacts", () => {
    for (const look of approved.children.filter(row => row.id.startsWith("level3-roster-v2."))) {
      const entry = getCharacterStillEntry(look.id);
      expect(entry, look.id).toBeDefined();
      checkC8(entry!, look.poses, true);
    }
  });

  it("loads all eight selected redraw poses for every child with valid seat contacts", () => {
    const missing = approved.children.filter(row => !getCharacterStillEntry(row.id)).map(row => row.id);
    expect(missing, "Approved child designs missing from the runtime registry").toEqual([]);
    for (const look of approved.children) {
      const entry = getCharacterStillEntry(look.id)!;
      expect(entry).toMatchObject({ intendedSex: look.sex, minimumAge: look.minimumAge, maximumAge: look.maximumAge });
      checkC8(entry, look.poses, true);
    }
  });

  it("registers 46 separate approved reviewer identities and their exact stylized C8 frames", () => {
    const registered = getAllCharacterStillEntries();
    const missing = approved.reviewers.filter(row => !registered.some(entry => entry.poses.stand.south.sha256 === row.poses["stand-south"]));
    expect(missing.map(row => row.name), "Approved reviewer illustrations missing from the runtime registry").toEqual([]);
    for (const reviewer of approved.reviewers) {
      const matching = registered.filter(entry => entry.poses.stand.south.sha256 === reviewer.poses["stand-south"]);
      expect(matching, reviewer.name).toHaveLength(1);
      const entry = matching[0]!;
      expect(entry.category).toBe("inspection-presentation");
      expect(entry.eligibleStaffRoleDefinitionIds ?? []).toEqual([]);
      checkC8(entry, reviewer.poses, false);
    }
  });

  it("keeps startup character preload at zero and only loads a live child's standing directions on demand", () => {
    expect(allCanonicalCharacterAtlases()).toEqual([]);
    expect(Object.values(AUTHORED_BITMAP_ASSET_MANIFEST).filter(asset => asset.kind === "character")).toEqual([]);
    const image = vi.fn();
    const scene = Object.assign(Object.create(FacilityScene.prototype), { bridge: { mobileInput: false },
      textures: { exists: () => false }, load: { image, once: vi.fn(), start: vi.fn() } });
    scene.ensureEnvironmentAtlas();
    scene.ensureCharacterAtlases();
    expect(image.mock.calls.length).toBeGreaterThan(0);
    expect(image.mock.calls.filter(([, url]) => String(url).includes("/art/characters/"))).toEqual([]);
    for (const row of PEDIATRIC_CHARACTER_STILLS) {
      const descriptors = characterStandingBitmapDescriptors(appearance(row.stillId));
      const requests = vi.fn();
      preloadBitmapAssets({ image: requests }, [...descriptors, ...descriptors], "/GamifySurgery/");
      expect(requests).toHaveBeenCalledTimes(poseDirections.length);
      expect(requests.mock.calls.every(([, src]) => String(src).includes("/stand-"))).toBe(true);
    }
  });
});

function* publicFiles(folder: string): Generator<string> {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    if (["node_modules", ".vite", "dist", "test-results"].includes(entry.name)) continue;
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) yield* publicFiles(path);
    else yield path;
  }
}

it("keeps private-photo formats and unregistered reviewer crops outside all public source roots", () => {
  const approvedPoseHashes = new Set(approved.reviewers.flatMap(person => Object.values(person.poses)));
  const registeredPaths = new Map<string, string>();
  for (const entry of getAllCharacterStillEntries()) for (const posture of CHARACTER_STILL_POSTURES) {
    for (const asset of Object.values(entry.poses[posture])) if (approvedPoseHashes.has(asset.sha256) || asset.url.includes("/inspector-v6f/")) {
      registeredPaths.set(resolve(publicRoot, asset.url), asset.sha256);
    }
  }
  const reviewerFileHints = /(?:attending|reviewer|inspector-v6f|private[-_ ]?(?:photo|portrait)|(?:facial|face|headshot|photo)[-_ ]?crop)/i;
  const slugs = new Set(approved.reviewers.map(row => row.id));
  const failures: string[] = [];
  for (const scope of ["apps", "packages", "tests", "tools", "scripts"]) for (const file of publicFiles(resolve(repo, scope))) {
    const path = relative(repo, file).replaceAll(sep, "/");
    const photoFormat = /\.(?:jpe?g|heic|heif|tiff?|dng|raw)$/i.test(path);
    const raster = /\.(?:png|webp|avif|gif|bmp|svg|jpe?g|heic|heif|tiff?|dng|raw)$/i.test(path);
    const reviewerAsset = reviewerFileHints.test(path) || path.split("/").some(part => slugs.has(part.toLowerCase()))
      || slugs.has(basename(path).toLowerCase().replace(/(?:[-_][0-9]+)?\.[^.]+$/, ""));
    if (!raster || (!photoFormat && !reviewerAsset)) continue;
    const hash = registeredPaths.get(file);
    if (!hash || photoFormat || createHash("sha256").update(readFileSync(file)).digest("hex") !== hash) failures.push(path);
  }
  expect(failures, "Public reviewer images must be exact approved stylized stills, never source photographs, crops or native sheets").toEqual([]);
});
