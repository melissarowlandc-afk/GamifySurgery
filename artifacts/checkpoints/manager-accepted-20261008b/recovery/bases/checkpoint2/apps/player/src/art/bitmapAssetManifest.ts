import type { PixelSpriteAsset } from "./pixelArt";
import type { FixtureId } from "./fixtureArt";

/**
 * A transparent, independently rendered bitmap layer that can replace one
 * procedural fixture or character frame. The semantic game object remains the
 * fixture/appearance ID; an absent bitmap always falls back to that object's
 * current procedural renderer.
 */
export interface BitmapAssetDescriptor {
  readonly id: string;
  readonly relativePath?: string;
  readonly nativeWidth: number;
  readonly nativeHeight: number;
  /** Pixel-space floor contact point in the authored bitmap. */
  readonly anchor: Readonly<{ x: number; y: number }>;
  /** Authored perspective variants are selected explicitly; never rotated. */
  readonly orientation: 0 | 90 | 180 | 270 | "all";
  readonly kind: "fixture" | "character" | "portrait" | "environment";
}

/** A non-uniform source rectangle inside one authored bitmap atlas. */
export interface BitmapAtlasSourceRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Atlas frames deliberately retain their authored bounds.  They are not a
 * grid of assumed equal cells: source artwork can have different native
 * proportions for walls, floor materials, and landscaping.
 */
export interface BitmapAtlasFrameDescriptor {
  readonly id: string;
  readonly atlasId: string;
  readonly sourceRect: BitmapAtlasSourceRect;
  readonly nativeWidth: number;
  readonly nativeHeight: number;
  readonly anchor: Readonly<{ x: number; y: number }>;
  readonly orientation: 0 | 90 | 180 | 270 | "all";
  readonly kind: "environment" | "fixture" | "character" | "portrait";
}

export interface ResolvedBitmapAsset<TFallback> {
  readonly descriptor: BitmapAssetDescriptor;
  readonly source: "bitmap" | "procedural";
  readonly fallback: TFallback;
}

/**
 * Public-art convention: all future authored files are transparent PNG/WebP
 * layers below public/art. Vite's BASE_URL is applied at render/preload time,
 * so this works both locally and from the GitHub Pages subpath.
 */
export const BITMAP_ASSET_DIRECTORY = "art";

/**
 * Original project artwork generated for Stitchin' Time from the approved
 * in-repository art-direction references.  The source image is intentionally
 * kept as one reusable atlas rather than baking it into a facility screenshot.
 */
export const ENVIRONMENT_ATLAS_V1: BitmapAssetDescriptor = {
  id: "environment:atlas-v1",
  relativePath: "art/environment/clinic-environment-atlas-v1.png",
  nativeWidth: 1254,
  nativeHeight: 1254,
  anchor: { x: 0, y: 0 },
  orientation: "all",
  kind: "environment",
};

/**
 * Independent exterior props are kept in a transparent atlas rather than
 * baked into terrain.  This lets the facility retain its real room footprint,
 * sidewalk and click targets while using the denser illustrated landscaping
 * language from the approved reference set.
 */
export const LANDSCAPING_ATLAS_V1: BitmapAssetDescriptor = {
  id: "environment:landscaping-atlas-v1",
  relativePath: "art/environment/clinic-landscaping-atlas-v1.png",
  nativeWidth: 1448,
  nativeHeight: 1086,
  anchor: { x: 0, y: 0 },
  orientation: "all",
  kind: "environment",
};

export type EnvironmentAtlasFrameId =
  | "environment:north-wall"
  | "environment:side-wall"
  | "environment:outer-corner"
  | "environment:inner-corner"
  | "environment:doorway"
  | "environment:clinical-floor"
  | "environment:waiting-floor"
  | "environment:imaging-floor"
  | "environment:sidewalk"
  | "environment:grass";

const environmentFrame = (
  id: EnvironmentAtlasFrameId,
  sourceRect: BitmapAtlasSourceRect,
  anchor: Readonly<{ x: number; y: number }> = {
    x: sourceRect.width / 2,
    y: sourceRect.height,
  },
): BitmapAtlasFrameDescriptor => ({
  id,
  atlasId: ENVIRONMENT_ATLAS_V1.id,
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor,
  orientation: "all",
  kind: "environment",
});

/**
 * Measured content bounds in the v1 atlas.  These differ by frame on purpose;
 * renderers tile/crop them instead of squeezing a partial wall run into a new
 * aspect ratio.
 */
export const ENVIRONMENT_ATLAS_V1_FRAMES: Readonly<
  Record<EnvironmentAtlasFrameId, BitmapAtlasFrameDescriptor>
> = {
  "environment:north-wall": environmentFrame("environment:north-wall", {
    x: 91,
    y: 108,
    width: 246,
    height: 165,
  }),
  "environment:side-wall": environmentFrame("environment:side-wall", {
    x: 482,
    y: 69,
    width: 56,
    height: 205,
  }),
  "environment:outer-corner": environmentFrame("environment:outer-corner", {
    x: 691,
    y: 61,
    width: 123,
    height: 236,
  }),
  "environment:inner-corner": environmentFrame("environment:inner-corner", {
    x: 965,
    y: 62,
    width: 160,
    height: 221,
  }),
  "environment:doorway": environmentFrame("environment:doorway", {
    x: 88,
    y: 376,
    width: 233,
    height: 201,
  }),
  "environment:clinical-floor": environmentFrame("environment:clinical-floor", {
    x: 383,
    y: 371,
    width: 210,
    height: 210,
  }, { x: 0, y: 0 }),
  "environment:waiting-floor": environmentFrame("environment:waiting-floor", {
    x: 658,
    y: 371,
    width: 214,
    height: 210,
  }, { x: 0, y: 0 }),
  "environment:imaging-floor": environmentFrame("environment:imaging-floor", {
    x: 936,
    y: 371,
    width: 214,
    height: 210,
  }, { x: 0, y: 0 }),
  "environment:sidewalk": environmentFrame("environment:sidewalk", {
    x: 84,
    y: 678,
    width: 224,
    height: 218,
  }, { x: 0, y: 0 }),
  "environment:grass": environmentFrame("environment:grass", {
    x: 373,
    y: 678,
    width: 212,
    height: 218,
  }, { x: 0, y: 0 }),
};

export type LandscapingAtlasFrameId =
  | "landscape:tree-round"
  | "landscape:tree-open"
  | "landscape:tree-column"
  | "landscape:tree-crown"
  | "landscape:shrub-cluster"
  | "landscape:shrub-round"
  | "landscape:shrub-small"
  | "landscape:flowers-white"
  | "landscape:flowers-yellow"
  | "landscape:flowers-pink"
  | "landscape:bench"
  | "landscape:entrance-planter";

const landscapingFrame = (
  id: LandscapingAtlasFrameId,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id,
  atlasId: LANDSCAPING_ATLAS_V1.id,
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "environment",
});

/**
 * Frames are measured from content bounds in the transparent 1448x1086
 * source—not assumed from its intentionally uneven reference-art spacing.
 */
export const LANDSCAPING_ATLAS_V1_FRAMES: Readonly<
  Record<LandscapingAtlasFrameId, BitmapAtlasFrameDescriptor>
> = {
  "landscape:tree-round": landscapingFrame("landscape:tree-round", { x: 63, y: 91, width: 321, height: 345 }),
  "landscape:tree-open": landscapingFrame("landscape:tree-open", { x: 430, y: 92, width: 286, height: 342 }),
  "landscape:tree-column": landscapingFrame("landscape:tree-column", { x: 779, y: 96, width: 266, height: 337 }),
  "landscape:tree-crown": landscapingFrame("landscape:tree-crown", { x: 1111, y: 127, width: 271, height: 307 }),
  "landscape:shrub-cluster": landscapingFrame("landscape:shrub-cluster", { x: 121, y: 544, width: 326, height: 197 }),
  "landscape:shrub-round": landscapingFrame("landscape:shrub-round", { x: 567, y: 540, width: 205, height: 198 }),
  "landscape:shrub-small": landscapingFrame("landscape:shrub-small", { x: 1032, y: 586, width: 153, height: 144 }),
  "landscape:flowers-white": landscapingFrame("landscape:flowers-white", { x: 70, y: 810, width: 201, height: 172 }),
  "landscape:flowers-yellow": landscapingFrame("landscape:flowers-yellow", { x: 339, y: 822, width: 196, height: 160 }),
  "landscape:flowers-pink": landscapingFrame("landscape:flowers-pink", { x: 601, y: 809, width: 199, height: 173 }),
  "landscape:bench": landscapingFrame("landscape:bench", { x: 898, y: 776, width: 209, height: 208 }),
  "landscape:entrance-planter": landscapingFrame("landscape:entrance-planter", { x: 1161, y: 803, width: 220, height: 181 }),
};

export function getEnvironmentAtlasFrameKey(
  frame: BitmapAtlasFrameDescriptor,
): string {
  return `frame:${frame.id}`;
}

/**
 * High-detail Level 1 furniture is deliberately stored as transparent source
 * atlases rather than one baked room image.  The precise, non-uniform source
 * rectangles preserve the authored silhouettes while room metadata continues
 * to own placement, doors, interaction and routing.
 */
const levelOneRoomAtlas = (
  id: string,
  relativePath: string,
  nativeWidth: number,
  nativeHeight: number,
): BitmapAssetDescriptor => ({
  id,
  relativePath,
  nativeWidth,
  nativeHeight,
  anchor: { x: 0, y: 0 },
  orientation: "all",
  kind: "fixture",
});

export const LEVEL_ONE_ROOM_FIXTURE_ATLASES = [
  levelOneRoomAtlas("room-fixtures:front-desk-v1", "art/rooms/level-1-v1/front-desk-fixtures-v1.png", 1254, 1254),
  // Front Desk v2 is a distinct transparent component sheet.  It deliberately
  // replaces only the starter room's low-detail furniture/shell treatment,
  // never the room's independent routes, doors, or semantic fixture IDs.
  levelOneRoomAtlas("room-fixtures:front-desk-v2", "art/rooms/front-desk-v2/front-desk-components-v2.png", 1232, 1277),
  // Architecture is deliberately separated from Front Desk v2 furniture so
  // the five semantic fixture mappings stay stable and individually placed.
  levelOneRoomAtlas("room-fixtures:front-desk-v3", "art/rooms/front-desk-v3/front-desk-architecture-v3.png", 1536, 1024),
  // v4 is one coherent, transparent architectural shell.  Its floor, rear
  // wall, side returns, entrance jambs, and contact shadow were authored in
  // one perspective rather than assembled from stretched wall fragments.
  levelOneRoomAtlas("room-fixtures:front-desk-v4", "art/rooms/front-desk-v4/front-desk-shell-v4.png", 1254, 1254),
  // Native one-tile slices extracted deterministically from Front Desk v4.
  // Boundary-aware shells tile/crop these instead of repainting flat walls.
  levelOneRoomAtlas("room-fixtures:surgery-center-architecture-v1", "art/rooms/surgery-center-v1/architecture-components-v1.png", 512, 512),
  // Examination Room v2 has individually composed north-up shells for the
  // semantic 3-by-2 and 2-by-3 footprints. Furniture remains independent.
  levelOneRoomAtlas("room-fixtures:examination-v2-horizontal", "art/rooms/examination-v2/examination-shell-horizontal-v2.png", 960, 960),
  levelOneRoomAtlas("room-fixtures:examination-v2-vertical", "art/rooms/examination-v2/examination-shell-vertical-v2.png", 960, 960),
  levelOneRoomAtlas("room-fixtures:waiting-v1", "art/rooms/level-1-v1/waiting-fixtures-v1.png", 1254, 1254),
  levelOneRoomAtlas("room-fixtures:examination-v1", "art/rooms/level-1-v1/examination-fixtures-v1.png", 1254, 1254),
  levelOneRoomAtlas("room-fixtures:bathroom-v1", "art/rooms/level-1-v1/bathroom-fixtures-v1.png", 1254, 1254),
  levelOneRoomAtlas("room-fixtures:xray-imaging-v1", "art/rooms/level-1-v1/xray-imaging-fixtures-v1.png", 1536, 1024),
  levelOneRoomAtlas("room-fixtures:minor-procedure-v1", "art/rooms/level-1-v1/minor-procedure-fixtures-v1.png", 1298, 1212),
] as const satisfies readonly BitmapAssetDescriptor[];

/**
 * Level 2 keeps its specialty equipment in separate transparent source
 * sheets. These are not room screenshots: each frame is placed by the
 * existing semantic fixture layout and therefore remains independent from
 * routing, doors, interaction targets, and room upgrades.
 */
export const LEVEL_TWO_ROOM_FIXTURE_ATLASES = [
  levelOneRoomAtlas("room-fixtures:level-two-imaging-collection-v1", "art/rooms/level-2-v1/imaging-collection-fixtures-v1.png", 1254, 1254),
  levelOneRoomAtlas("room-fixtures:level-two-endoscopy-recovery-training-v1", "art/rooms/level-2-v1/endoscopy-recovery-training-fixtures-v1.png", 1254, 1254),
  levelOneRoomAtlas("room-fixtures:level-two-operations-telehealth-v1", "art/rooms/level-2-v1/operations-telehealth-fixtures-v1.png", 1254, 1254),
] as const satisfies readonly BitmapAssetDescriptor[];

/** All independently preloaded room-art sources, including Level 1 fallback. */
export const ROOM_FIXTURE_ATLASES = [
  ...LEVEL_ONE_ROOM_FIXTURE_ATLASES,
  ...LEVEL_TWO_ROOM_FIXTURE_ATLASES,
] as const satisfies readonly BitmapAssetDescriptor[];

/**
 * Canonical layered character sheets. Each sheet contains the stable 5x6
 * head/body order used by the founder presets: human masculine 0-9, human
 * feminine 10-19, then non-human 20-29. Runtime code must compose these by
 * saved variant, never by a random portrait or role-specific replacement.
 */
const characterAtlas = (id: string, relativePath: string, width: number, height: number) => ({
  id,
  relativePath,
  nativeWidth: width,
  nativeHeight: height,
  anchor: { x: 0, y: 0 },
  orientation: "all" as const,
  kind: "character" as const,
});

export const CHARACTER_ATLASES_V1 = [
  characterAtlas("character:actors-front-idle-v3", "art/characters/v3/actors-front-idle-v3.png", 800, 1440),
  characterAtlas("character:actors-left-idle-v3", "art/characters/v3/actors-left-idle-v3.png", 800, 1440),
  characterAtlas("character:actors-back-idle-v3", "art/characters/v3/actors-back-idle-v3.png", 800, 1440),
  characterAtlas("character:actors-left-walk-a-v3", "art/characters/v3/actors-left-walk-a-v3.png", 800, 1440),
  characterAtlas("character:actors-left-walk-b-v3", "art/characters/v3/actors-left-walk-b-v3.png", 800, 1440),
  characterAtlas("character:actors-front-seated-v3", "art/characters/v3/actors-front-seated-v3.png", 800, 1440),
  characterAtlas("character:actors-front-working-v3", "art/characters/v3/actors-front-working-v3.png", 800, 1440),
  characterAtlas("character:actors-front-star-jump-v3", "art/characters/v3/actors-front-star-jump-v3.png", 800, 1440),
  characterAtlas("character:actors-left-interaction-v3", "art/characters/v3/actors-left-interaction-v3.png", 800, 1440),
] as const satisfies readonly BitmapAssetDescriptor[];

/** Founder-only authored v4 sheets.  They intentionally live beside v3 so
 * patients and staff retain their existing renderer and saved appearance. */
export const FOUNDER_CHARACTER_ATLASES_V4 = [
  "front-idle", "left-idle", "right-idle", "back-idle",
  "front-walk-a", "front-walk-b", "left-walk-a", "left-walk-b",
  "right-walk-a", "right-walk-b", "back-walk-a", "back-walk-b",
  "front-seated", "left-seated", "right-seated", "front-working", "clipboard",
  "jump-recovery", "star-jump", "portrait",
].map((pose) => characterAtlas(
  // Founder sources are revisioned deliberately.  Phaser retains a texture
  // under its key for the life of a scene; using the old v4 key after the
  // generated walk sheets changed could combine a newly selected frame name
  // with a stale decoded sheet.  A content revision makes every live founder
  // frame resolve as one matching asset family after a reload/HMR update.
  `character:founders-${pose}-v4-r9-hires`,
  `art/characters/founders-v4/founders-${pose}-v4.png?rev=founders-v4-r9-hires`,
  640,
  1152,
)) as readonly BitmapAssetDescriptor[];

/**
 * Fifty authored adult patient identities use one transparent 5 x 10 atlas
 * per pose.  This intentionally stays separate from v3 staff/civilian art:
 * a persisted patientIdentityId selects one immutable atlas cell, while v3
 * remains the explicit fallback for malformed or historic descriptors.
 */
export const PATIENT_CHARACTER_ATLAS_REVISION_V1 = "patients-v1-r7-hires";
export const PATIENT_CHARACTER_ATLAS_POSES_V1 = [
  "front-idle", "left-idle", "right-idle", "back-idle",
  "front-walk-a", "front-walk-b", "back-walk-a", "back-walk-b",
  "left-walk-a", "left-walk-neutral", "left-walk-b",
  "right-walk-a", "right-walk-neutral", "right-walk-b",
  "seated-front", "seated-left", "seated-right", "exam-table",
  "thumbnail", "portrait",
] as const;

export type PatientCharacterAtlasPoseV1 =
  (typeof PATIENT_CHARACTER_ATLAS_POSES_V1)[number];

const patientCharacterAtlas = (
  pose: PatientCharacterAtlasPoseV1,
): BitmapAssetDescriptor => {
  const portrait = pose === "portrait";
  const thumbnail = pose === "thumbnail";
  const nativeWidth = portrait ? 960 : thumbnail ? 480 : 640;
  const nativeHeight = portrait ? 2240 : thumbnail ? 1120 : 1920;
  return characterAtlas(
    `character:patients-${pose}-v1-r7-hires`,
    `art/characters/patients-v1/patients-${pose}-v1.png?rev=${PATIENT_CHARACTER_ATLAS_REVISION_V1}`,
    nativeWidth,
    nativeHeight,
  );
};

export const PATIENT_CHARACTER_ATLASES_V1 = PATIENT_CHARACTER_ATLAS_POSES_V1.map(
  patientCharacterAtlas,
) as readonly BitmapAssetDescriptor[];

/**
 * The live Phaser scene never needs chart-only thumbnail/portrait sheets.
 * Keeping those browser-decoded on demand avoids the full 52.4 MiB pack in
 * its WebGL texture cache.
 */
export const PATIENT_CHARACTER_MAP_ATLASES_V1 = PATIENT_CHARACTER_ATLASES_V1.filter(
  (asset) =>
    !asset.id.includes("-thumbnail-") &&
    !asset.id.includes("-portrait-"),
) as readonly BitmapAssetDescriptor[];

/** Idle and four-direction gait frames cover ordinary movement immediately. */
export const PATIENT_CHARACTER_CORE_MAP_ATLASES_V1 = PATIENT_CHARACTER_MAP_ATLASES_V1.filter(
  (asset) =>
    !asset.id.includes("-seated-") && !asset.id.includes("-exam-table-"),
) as readonly BitmapAssetDescriptor[];

export type LevelOneBitmapFixtureId =
  | "frontDesk" | "filingCabinet" | "secretaryChair" | "visitorChair" | "waterCooler" | "wasteBin"
  | "waitingCouch" | "coffeeTable" | "magazineRack" | "plant" | "sideTable"
  | "examTable" | "sinkCabinet" | "rollingStool" | "diagnosticPanel" | "gloveDispenser" | "wallChart"
  | "handSink" | "toilet" | "wallMirror"
  | "xrayTube" | "xrayTable" | "xrayBucky" | "leadApron" | "supplyCabinet" | "imagingConsole" | "officeChair" | "serverRack"
  | "procedureTable" | "procedureLight" | "instrumentTray" | "biohazardBin";

const fixtureAtlasFrame = (
  id: LevelOneBitmapFixtureId,
  atlasId: string,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `fixture:${id}`,
  atlasId,
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

/** Measured by alpha/content bounds, not assumed equal atlas cells. */
export const LEVEL_ONE_BITMAP_FIXTURE_FRAMES: Readonly<Partial<Record<LevelOneBitmapFixtureId, BitmapAtlasFrameDescriptor>>> = {
  frontDesk: fixtureAtlasFrame("frontDesk", "room-fixtures:front-desk-v1", { x: 276, y: 500, width: 516, height: 292 }),
  filingCabinet: fixtureAtlasFrame("filingCabinet", "room-fixtures:front-desk-v1", { x: 116, y: 207, width: 158, height: 341 }),
  secretaryChair: fixtureAtlasFrame("secretaryChair", "room-fixtures:front-desk-v1", { x: 424, y: 415, width: 145, height: 151 }),
  visitorChair: fixtureAtlasFrame("visitorChair", "room-fixtures:waiting-v1", { x: 157, y: 681, width: 232, height: 254 }),
  waterCooler: fixtureAtlasFrame("waterCooler", "room-fixtures:front-desk-v1", { x: 917, y: 211, width: 142, height: 291 }),
  wasteBin: fixtureAtlasFrame("wasteBin", "room-fixtures:front-desk-v1", { x: 1045, y: 390, width: 129, height: 151 }),
  waitingCouch: fixtureAtlasFrame("waitingCouch", "room-fixtures:waiting-v1", { x: 424, y: 369, width: 401, height: 281 }),
  coffeeTable: fixtureAtlasFrame("coffeeTable", "room-fixtures:waiting-v1", { x: 480, y: 718, width: 313, height: 202 }),
  magazineRack: fixtureAtlasFrame("magazineRack", "room-fixtures:waiting-v1", { x: 255, y: 207, width: 178, height: 190 }),
  plant: fixtureAtlasFrame("plant", "room-fixtures:waiting-v1", { x: 226, y: 410, width: 143, height: 196 }),
  sideTable: fixtureAtlasFrame("sideTable", "room-fixtures:waiting-v1", { x: 856, y: 409, width: 135, height: 201 }),
  examTable: fixtureAtlasFrame("examTable", "room-fixtures:examination-v1", { x: 562, y: 396, width: 281, height: 692 }),
  sinkCabinet: fixtureAtlasFrame("sinkCabinet", "room-fixtures:examination-v1", { x: 120, y: 296, width: 316, height: 393 }),
  rollingStool: fixtureAtlasFrame("rollingStool", "room-fixtures:examination-v1", { x: 200, y: 785, width: 220, height: 264 }),
  diagnosticPanel: fixtureAtlasFrame("diagnosticPanel", "room-fixtures:examination-v1", { x: 529, y: 111, width: 191, height: 226 }),
  // Measured to alpha/content edges in the approved Examination v1 atlas.
  gloveDispenser: fixtureAtlasFrame("gloveDispenser", "room-fixtures:examination-v1", { x: 755, y: 143, width: 113, height: 184 }),
  wallChart: fixtureAtlasFrame("wallChart", "room-fixtures:examination-v1", { x: 930, y: 116, width: 191, height: 221 }),
  handSink: fixtureAtlasFrame("handSink", "room-fixtures:bathroom-v1", { x: 111, y: 456, width: 192, height: 252 }),
  toilet: fixtureAtlasFrame("toilet", "room-fixtures:bathroom-v1", { x: 817, y: 411, width: 217, height: 434 }),
  wallMirror: fixtureAtlasFrame("wallMirror", "room-fixtures:bathroom-v1", { x: 128, y: 273, width: 147, height: 176 }),
  xrayTube: fixtureAtlasFrame("xrayTube", "room-fixtures:xray-imaging-v1", { x: 101, y: 62, width: 251, height: 414 }),
  xrayTable: fixtureAtlasFrame("xrayTable", "room-fixtures:xray-imaging-v1", { x: 664, y: 125, width: 238, height: 445 }),
  xrayBucky: fixtureAtlasFrame("xrayBucky", "room-fixtures:xray-imaging-v1", { x: 405, y: 96, width: 153, height: 454 }),
  leadApron: fixtureAtlasFrame("leadApron", "room-fixtures:xray-imaging-v1", { x: 980, y: 172, width: 128, height: 280 }),
  supplyCabinet: fixtureAtlasFrame("supplyCabinet", "room-fixtures:xray-imaging-v1", { x: 1181, y: 213, width: 178, height: 274 }),
  imagingConsole: fixtureAtlasFrame("imagingConsole", "room-fixtures:xray-imaging-v1", { x: 92, y: 617, width: 349, height: 306 }),
  officeChair: fixtureAtlasFrame("officeChair", "room-fixtures:xray-imaging-v1", { x: 571, y: 650, width: 151, height: 260 }),
  serverRack: fixtureAtlasFrame("serverRack", "room-fixtures:xray-imaging-v1", { x: 1200, y: 594, width: 180, height: 355 }),
  procedureTable: fixtureAtlasFrame("procedureTable", "room-fixtures:minor-procedure-v1", { x: 119, y: 82, width: 253, height: 580 }),
  procedureLight: fixtureAtlasFrame("procedureLight", "room-fixtures:minor-procedure-v1", { x: 520, y: 111, width: 329, height: 504 }),
  instrumentTray: fixtureAtlasFrame("instrumentTray", "room-fixtures:minor-procedure-v1", { x: 966, y: 278, width: 252, height: 359 }),
  biohazardBin: fixtureAtlasFrame("biohazardBin", "room-fixtures:minor-procedure-v1", { x: 1083, y: 886, width: 153, height: 265 }),
};

/**
 * Non-semantic Front Desk architectural components. They stay as separately
 * placed transparent frames: the room rectangle, door model, and collision
 * map remain the authoritative gameplay representation.
 */
export type FrontDeskV2ArtId =
  | "northWall"
  | "sideWall"
  | "floorTile"
  | "entranceThreshold"
  | "noticeBoard"
  | "wallClock"
  | "westPlanter"
  | "eastPlanter";

const frontDeskV2ArtFrame = (
  id: FrontDeskV2ArtId,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `front-desk-v2:${id}`,
  atlasId: "room-fixtures:front-desk-v2",
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

/** Measured from the transparent v2 component sheet's isolated source art. */
export const FRONT_DESK_V2_ART_FRAMES: Readonly<Record<FrontDeskV2ArtId, BitmapAtlasFrameDescriptor>> = {
  northWall: frontDeskV2ArtFrame("northWall", { x: 48, y: 592, width: 726, height: 178 }),
  sideWall: frontDeskV2ArtFrame("sideWall", { x: 856, y: 592, width: 329, height: 178 }),
  floorTile: frontDeskV2ArtFrame("floorTile", { x: 120, y: 806, width: 245, height: 241 }),
  entranceThreshold: frontDeskV2ArtFrame("entranceThreshold", { x: 542, y: 832, width: 493, height: 177 }),
  noticeBoard: frontDeskV2ArtFrame("noticeBoard", { x: 299, y: 401, width: 205, height: 167 }),
  wallClock: frontDeskV2ArtFrame("wallClock", { x: 651, y: 439, width: 113, height: 103 }),
  westPlanter: frontDeskV2ArtFrame("westPlanter", { x: 126, y: 1080, width: 238, height: 151 }),
  eastPlanter: frontDeskV2ArtFrame("eastPlanter", { x: 885, y: 1080, width: 239, height: 151 }),
};

export type FrontDeskV3ArchitectureId =
  | "floorPlate"
  | "northWall"
  | "westReturn"
  | "eastReturn"
  | "westCap"
  | "eastCap"
  | "frontWest"
  | "frontEast"
  | "threshold"
  | "counterShadow"
  | "cabinetShadow"
  | "coolerShadow";

const frontDeskV3ArchitectureFrame = (
  id: FrontDeskV3ArchitectureId,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `front-desk-v3:${id}`,
  atlasId: "room-fixtures:front-desk-v3",
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

/** Nonuniform transparent source bounds for the Front Desk v3 architecture. */
export const FRONT_DESK_V3_ARCHITECTURE_FRAMES: Readonly<
  Record<FrontDeskV3ArchitectureId, BitmapAtlasFrameDescriptor>
> = {
  floorPlate: frontDeskV3ArchitectureFrame("floorPlate", { x: 79, y: 14, width: 950, height: 545 }),
  northWall: frontDeskV3ArchitectureFrame("northWall", { x: 1080, y: 15, width: 386, height: 181 }),
  westReturn: frontDeskV3ArchitectureFrame("westReturn", { x: 1092, y: 225, width: 99, height: 383 }),
  eastReturn: frontDeskV3ArchitectureFrame("eastReturn", { x: 1341, y: 225, width: 99, height: 383 }),
  // Straight, top-down border material sampled from the floor plate itself.
  // These deliberately exclude the separate upright/angled return sprites.
  westCap: frontDeskV3ArchitectureFrame("westCap", { x: 80, y: 48, width: 31, height: 478 }),
  eastCap: frontDeskV3ArchitectureFrame("eastCap", { x: 997, y: 48, width: 28, height: 478 }),
  frontWest: frontDeskV3ArchitectureFrame("frontWest", { x: 47, y: 644, width: 535, height: 145 }),
  frontEast: frontDeskV3ArchitectureFrame("frontEast", { x: 929, y: 644, width: 552, height: 145 }),
  threshold: frontDeskV3ArchitectureFrame("threshold", { x: 601, y: 752, width: 282, height: 44 }),
  counterShadow: frontDeskV3ArchitectureFrame("counterShadow", { x: 99, y: 858, width: 578, height: 112 }),
  cabinetShadow: frontDeskV3ArchitectureFrame("cabinetShadow", { x: 752, y: 838, width: 210, height: 142 }),
  coolerShadow: frontDeskV3ArchitectureFrame("coolerShadow", { x: 1007, y: 826, width: 431, height: 154 }),
};

/**
 * The v4 source is an empty Front Desk shell, not a furnished screenshot.
 * Its authored floor interior is measured at x=212..1043 and y=339..960:
 * exactly five columns by four rows.  Renderers align that interior with the
 * semantic 5-by-4 room rectangle and allow the outer wall frame to extend
 * beyond it just as the cutaway mockup does.
 */
export type FrontDeskV4ArchitectureId = "shell" | "frontOccluder";

/**
 * Measured source-space layout for independent art mounted on the v4 shell.
 * Keeping this alongside the atlas metadata makes the rear-wall composition
 * testable and prevents callers from falling back to generic wall-height
 * arithmetic when the authored shell changes perspective.
 */
export const FRONT_DESK_V4_SHELL_LAYOUT = {
  sourceSize: 1254,
  floor: { x: 212, y: 339, width: 832, height: 622 },
  rearWallDecor: {
    noticeBoard: { centerX: 480, centerY: 215, width: 205, height: 167 },
    wallClock: { centerX: 680, centerY: 215, width: 113, height: 103 },
  },
  frontOccluder: { x: 157, y: 941, width: 940, height: 153 },
} as const;

const frontDeskV4ArchitectureFrame = (
  id: FrontDeskV4ArchitectureId,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `front-desk-v4:${id}`,
  atlasId: "room-fixtures:front-desk-v4",
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

export const FRONT_DESK_V4_ARCHITECTURE_FRAMES: Readonly<
  Record<FrontDeskV4ArchitectureId, BitmapAtlasFrameDescriptor>
> = {
  shell: frontDeskV4ArchitectureFrame("shell", { x: 0, y: 0, width: 1254, height: 1254 }),
  // A duplicated source crop is the intentionally low front wall and its
  // jambs only; it gives the otherwise independent live characters correct
  // foreground occlusion when they cross the entrance boundary.
  frontOccluder: frontDeskV4ArchitectureFrame("frontOccluder", { x: 157, y: 941, width: 940, height: 153 }),
};

export type SurgeryCenterArchitectureComponentId = "north" | "side" | "front" | "floor";
const surgeryCenterComponentFrame = (
  id: SurgeryCenterArchitectureComponentId,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `surgery-center-v1:${id}`,
  atlasId: "room-fixtures:surgery-center-architecture-v1",
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: 0, y: 0 },
  orientation: "all",
  kind: "fixture",
});

/** Source-derived Front Desk v4 components for boundary-aware reconstruction. */
export const SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES: Readonly<
  Record<SurgeryCenterArchitectureComponentId, BitmapAtlasFrameDescriptor>
> = {
  north: surgeryCenterComponentFrame("north", { x: 0, y: 0, width: 166, height: 242 }),
  side: surgeryCenterComponentFrame("side", { x: 192, y: 0, width: 55, height: 155 }),
  front: surgeryCenterComponentFrame("front", { x: 256, y: 0, width: 166, height: 153 }),
  floor: surgeryCenterComponentFrame("floor", { x: 0, y: 272, width: 166, height: 155 }),
};

export type ExaminationV2ArchitectureId = "shell" | "frontOccluder";

const examinationV2ArchitectureFrame = (
  id: ExaminationV2ArchitectureId,
  atlasId: "room-fixtures:examination-v2-horizontal" | "room-fixtures:examination-v2-vertical",
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `examination-v2:${atlasId.endsWith("horizontal") ? "horizontal" : "vertical"}:${id}`,
  atlasId,
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

/**
 * The transparent shells contain only floor, wall, shadow, and low foreground
 * lip.  Doors, actors, furniture, trash, and room click targets stay live.
 */
export const EXAMINATION_V2_ARCHITECTURE_FRAMES = {
  horizontal: {
    shell: examinationV2ArchitectureFrame("shell", "room-fixtures:examination-v2-horizontal", { x: 0, y: 0, width: 960, height: 960 }),
    frontOccluder: examinationV2ArchitectureFrame("frontOccluder", "room-fixtures:examination-v2-horizontal", { x: 83, y: 732, width: 794, height: 80 }),
  },
  vertical: {
    shell: examinationV2ArchitectureFrame("shell", "room-fixtures:examination-v2-vertical", { x: 0, y: 0, width: 960, height: 960 }),
    frontOccluder: examinationV2ArchitectureFrame("frontOccluder", "room-fixtures:examination-v2-vertical", { x: 202, y: 854, width: 552, height: 80 }),
  },
} as const;

/** Front Desk v2 furniture is deliberately room-scoped, never a global swap. */
export const FRONT_DESK_V2_FIXTURE_OVERRIDES: Readonly<
  Partial<Record<LevelOneBitmapFixtureId, BitmapAtlasFrameDescriptor>>
> = {
  frontDesk: fixtureAtlasFrame("frontDesk", "room-fixtures:front-desk-v2", { x: 476, y: 108, width: 492, height: 281 }),
  filingCabinet: fixtureAtlasFrame("filingCabinet", "room-fixtures:front-desk-v2", { x: 48, y: 19, width: 209, height: 374 }),
  secretaryChair: fixtureAtlasFrame("secretaryChair", "room-fixtures:front-desk-v2", { x: 293, y: 56, width: 152, height: 272 }),
  // The Front Desk's southeast visitor chair uses the mirrored, left-facing
  // waiting-room crop so it faces into the room from D5.
  visitorChair: fixtureAtlasFrame("visitorChair", "room-fixtures:waiting-v1", { x: 865, y: 681, width: 232, height: 254 }),
  waterCooler: fixtureAtlasFrame("waterCooler", "room-fixtures:front-desk-v2", { x: 1064, y: 184, width: 151, height: 324 }),
  wasteBin: fixtureAtlasFrame("wasteBin", "room-fixtures:front-desk-v2", { x: 72, y: 420, width: 112, height: 144 }),
};

/** Keep high-detail Examination source crops local to this presentation. */
export const EXAMINATION_V3_FIXTURE_OVERRIDES: Readonly<
  Partial<Record<LevelOneBitmapFixtureId, BitmapAtlasFrameDescriptor>>
> = {
  sinkCabinet: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.sinkCabinet!,
  examTable: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.examTable!,
  rollingStool: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.rollingStool!,
  diagnosticPanel: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.diagnosticPanel!,
  gloveDispenser: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.gloveDispenser!,
  wallChart: LEVEL_ONE_BITMAP_FIXTURE_FRAMES.wallChart!,
};

export function getLevelOneBitmapFixtureFrame(id: FixtureId): BitmapAtlasFrameDescriptor | undefined {
  return LEVEL_ONE_BITMAP_FIXTURE_FRAMES[id as LevelOneBitmapFixtureId];
}

type LevelTwoBitmapFixtureId =
  | "ultrasoundConsole"
  | "ctGantry"
  | "phlebotomyChair"
  | "tubeRack"
  | "sinkCabinet"
  | "rollingCart"
  | "radiationMarker"
  | "diagnosticPanel"
  | "supplyCabinet"
  | "endoscopyTower"
  | "procedureTable"
  | "instrumentTray"
  | "vitalsMonitor"
  | "ivStand"
  | "trainingTable"
  | "visitorChair"
  | "noticeBoard"
  | "mopCart"
  | "scrubSink"
  | "frontDesk"
  | "coffeeMachine"
  | "chartStack"
  | "imagingConsole"
  | "ringLight"
  | "officeChair";

const levelTwoFixtureAtlasFrame = (
  id: LevelTwoBitmapFixtureId,
  atlasId: string,
  sourceRect: BitmapAtlasSourceRect,
): BitmapAtlasFrameDescriptor => ({
  id: `fixture:${id}`,
  atlasId,
  sourceRect,
  nativeWidth: sourceRect.width,
  nativeHeight: sourceRect.height,
  anchor: { x: sourceRect.width / 2, y: sourceRect.height },
  orientation: "all",
  kind: "fixture",
});

const LEVEL_TWO_IMAGING_COLLECTION = "room-fixtures:level-two-imaging-collection-v1";
const LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING = "room-fixtures:level-two-endoscopy-recovery-training-v1";
const LEVEL_TWO_OPERATIONS_TELEHEALTH = "room-fixtures:level-two-operations-telehealth-v1";

/**
 * Per-room overrides intentionally permit semantic fixture IDs to retain
 * their Level 1 drawing elsewhere. A recovery recliner may render as the
 * `procedureTable` fixture in Recovery without replacing Minor Procedure's
 * table, for example.
 */
export const LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES: Readonly<
  Record<string, Readonly<Partial<Record<LevelTwoBitmapFixtureId, BitmapAtlasFrameDescriptor>>>>
> = {
  "room.ultrasound": {
    ultrasoundConsole: levelTwoFixtureAtlasFrame("ultrasoundConsole", LEVEL_TWO_IMAGING_COLLECTION, { x: 78, y: 43, width: 258, height: 410 }),
    sinkCabinet: levelTwoFixtureAtlasFrame("sinkCabinet", LEVEL_TWO_IMAGING_COLLECTION, { x: 477, y: 498, width: 303, height: 335 }),
    rollingCart: levelTwoFixtureAtlasFrame("rollingCart", LEVEL_TWO_IMAGING_COLLECTION, { x: 868, y: 518, width: 290, height: 325 }),
    supplyCabinet: levelTwoFixtureAtlasFrame("supplyCabinet", LEVEL_TWO_IMAGING_COLLECTION, { x: 900, y: 865, width: 270, height: 335 }),
    diagnosticPanel: levelTwoFixtureAtlasFrame("diagnosticPanel", LEVEL_TWO_IMAGING_COLLECTION, { x: 482, y: 914, width: 305, height: 278 }),
  },
  "room.ct": {
    ctGantry: levelTwoFixtureAtlasFrame("ctGantry", LEVEL_TWO_IMAGING_COLLECTION, { x: 445, y: 37, width: 340, height: 435 }),
    supplyCabinet: levelTwoFixtureAtlasFrame("supplyCabinet", LEVEL_TWO_IMAGING_COLLECTION, { x: 900, y: 865, width: 270, height: 335 }),
    rollingCart: levelTwoFixtureAtlasFrame("rollingCart", LEVEL_TWO_IMAGING_COLLECTION, { x: 868, y: 518, width: 290, height: 325 }),
    radiationMarker: levelTwoFixtureAtlasFrame("radiationMarker", LEVEL_TWO_IMAGING_COLLECTION, { x: 112, y: 917, width: 196, height: 255 }),
  },
  "room.phlebotomy": {
    phlebotomyChair: levelTwoFixtureAtlasFrame("phlebotomyChair", LEVEL_TWO_IMAGING_COLLECTION, { x: 897, y: 45, width: 270, height: 430 }),
    tubeRack: levelTwoFixtureAtlasFrame("tubeRack", LEVEL_TWO_IMAGING_COLLECTION, { x: 73, y: 563, width: 294, height: 207 }),
    sinkCabinet: levelTwoFixtureAtlasFrame("sinkCabinet", LEVEL_TWO_IMAGING_COLLECTION, { x: 477, y: 498, width: 303, height: 335 }),
    rollingCart: levelTwoFixtureAtlasFrame("rollingCart", LEVEL_TWO_IMAGING_COLLECTION, { x: 868, y: 518, width: 290, height: 325 }),
  },
  "room.evs_closet": {
    mopCart: levelTwoFixtureAtlasFrame("mopCart", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 100, y: 48, width: 270, height: 385 }),
    scrubSink: levelTwoFixtureAtlasFrame("scrubSink", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 521, y: 79, width: 283, height: 347 }),
    supplyCabinet: levelTwoFixtureAtlasFrame("supplyCabinet", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 909, y: 48, width: 242, height: 385 }),
  },
  "room.endoscopy": {
    endoscopyTower: levelTwoFixtureAtlasFrame("endoscopyTower", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 105, y: 48, width: 281, height: 380 }),
    procedureTable: levelTwoFixtureAtlasFrame("procedureTable", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 445, y: 58, width: 370, height: 340 }),
    instrumentTray: levelTwoFixtureAtlasFrame("instrumentTray", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 875, y: 143, width: 321, height: 260 }),
    vitalsMonitor: levelTwoFixtureAtlasFrame("vitalsMonitor", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 526, y: 493, width: 224, height: 321 }),
  },
  "room.periop_recovery": {
    procedureTable: levelTwoFixtureAtlasFrame("procedureTable", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 95, y: 475, width: 274, height: 349 }),
    vitalsMonitor: levelTwoFixtureAtlasFrame("vitalsMonitor", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 526, y: 493, width: 224, height: 321 }),
    ivStand: levelTwoFixtureAtlasFrame("ivStand", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 950, y: 474, width: 176, height: 360 }),
  },
  "room.training": {
    trainingTable: levelTwoFixtureAtlasFrame("trainingTable", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 47, y: 899, width: 401, height: 270 }),
    visitorChair: levelTwoFixtureAtlasFrame("visitorChair", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 515, y: 885, width: 244, height: 304 }),
    noticeBoard: levelTwoFixtureAtlasFrame("noticeBoard", LEVEL_TWO_ENDOSCOPY_RECOVERY_TRAINING, { x: 865, y: 921, width: 330, height: 244 }),
  },
  "room.coffee_kiosk": {
    frontDesk: levelTwoFixtureAtlasFrame("frontDesk", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 95, y: 513, width: 310, height: 270 }),
    coffeeMachine: levelTwoFixtureAtlasFrame("coffeeMachine", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 526, y: 504, width: 232, height: 292 }),
    chartStack: levelTwoFixtureAtlasFrame("chartStack", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 880, y: 570, width: 272, height: 225 }),
  },
  "room.glp1_telehealth_suite": {
    imagingConsole: levelTwoFixtureAtlasFrame("imagingConsole", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 95, y: 870, width: 310, height: 330 }),
    ringLight: levelTwoFixtureAtlasFrame("ringLight", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 550, y: 850, width: 171, height: 362 }),
    officeChair: levelTwoFixtureAtlasFrame("officeChair", LEVEL_TWO_OPERATIONS_TELEHEALTH, { x: 920, y: 875, width: 230, height: 330 }),
  },
};

/**
 * Resolves a room-specific image first, preserving Level 1's generic fixture
 * mapping as a backward-compatible fallback for all other rooms and props.
 */
export function getRoomBitmapFixtureFrame(
  roomDefinitionId: string,
  id: FixtureId,
): BitmapAtlasFrameDescriptor | undefined {
  return (roomDefinitionId === "room.front_desk"
    ? FRONT_DESK_V2_FIXTURE_OVERRIDES[id as LevelOneBitmapFixtureId]
    : roomDefinitionId === "room.examination"
      ? EXAMINATION_V3_FIXTURE_OVERRIDES[id as LevelOneBitmapFixtureId]
    : undefined) ?? LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES[roomDefinitionId]?.[
    id as LevelTwoBitmapFixtureId
  ] ?? getLevelOneBitmapFixtureFrame(id);
}

/**
 * The first migration lands deliberately empty: no network requests or visual
 * changes occur until an approved original art pack registers a source path.
 * The stable descriptor factories below still expose IDs, anchors, dimensions,
 * and orientation metadata to that pack.
 */
export const AUTHORED_BITMAP_ASSET_MANIFEST: Readonly<
  Record<string, BitmapAssetDescriptor>
> = {};

function normaliseBasePath(basePath: string | undefined): string {
  const base = basePath?.trim() || "/";
  const withLeadingSlash = base.startsWith("/") ? base : `/${base}`;
  const withoutTrailingSlashes = withLeadingSlash
    .replace(/\\/g, "/")
    .replace(/\/+$/, "");
  return `${withoutTrailingSlashes || ""}/`;
}

export function resolvePublicArtAssetUrl(
  relativePath: string,
  basePath = import.meta.env.BASE_URL,
): string {
  const cleanRelativePath = relativePath.replace(/^\/+/, "");
  return `${normaliseBasePath(basePath)}${cleanRelativePath}`;
}

export function getFixtureBitmapAssetId(id: FixtureId): string {
  return `fixture:${id}`;
}

export function createFixtureBitmapDescriptor(
  id: FixtureId,
  fallback: PixelSpriteAsset,
  options: Partial<Pick<BitmapAssetDescriptor, "relativePath" | "orientation">> = {},
): BitmapAssetDescriptor {
  return {
    id: getFixtureBitmapAssetId(id),
    relativePath: options.relativePath,
    nativeWidth: fallback.width,
    nativeHeight: fallback.height,
    anchor: { x: fallback.width / 2, y: fallback.height },
    orientation: options.orientation ?? "all",
    kind: "fixture",
  };
}

export function createCharacterBitmapDescriptor(
  signature: string,
  nativeWidth: number,
  nativeHeight: number,
  options: Partial<Pick<BitmapAssetDescriptor, "relativePath" | "orientation">> = {},
): BitmapAssetDescriptor {
  return {
    id: `character:${signature}`,
    relativePath: options.relativePath,
    nativeWidth,
    nativeHeight,
    anchor: { x: nativeWidth / 2, y: nativeHeight },
    orientation: options.orientation ?? "all",
    kind: "character",
  };
}

export function createPortraitBitmapDescriptor(
  signature: string,
  nativeWidth: number,
  nativeHeight: number,
  relativePath?: string,
): BitmapAssetDescriptor {
  return {
    id: `portrait:${signature}`,
    relativePath,
    nativeWidth,
    nativeHeight,
    anchor: { x: nativeWidth / 2, y: nativeHeight },
    orientation: "all",
    kind: "portrait",
  };
}

export function resolveBitmapAsset<TFallback>(
  descriptor: BitmapAssetDescriptor,
  fallback: TFallback,
  manifest: Readonly<Record<string, BitmapAssetDescriptor>> = AUTHORED_BITMAP_ASSET_MANIFEST,
): ResolvedBitmapAsset<TFallback> {
  const authored = manifest[descriptor.id];
  if (authored?.relativePath) {
    return { descriptor: authored, source: "bitmap", fallback };
  }
  return { descriptor, source: "procedural", fallback };
}
