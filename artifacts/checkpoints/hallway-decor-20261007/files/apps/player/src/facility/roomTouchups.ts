/**
 * Owner-approved room touch-ups (October 7, 2026).
 *
 * One data source for the game renderer and the review lab in
 * tools/room-design/touchup-2026-10/. Everything here is presentation only:
 * no routing, save, or clinical state. Coordinates are room-local tile units
 * in the base (orientation 0) frame; 270-degree rooms are mapped here.
 *
 * Owner rules carried by this module:
 * - every wall segment stays a legal door; new decor is walk-past and hides
 *   for a doorway in its wall section, then returns when the door is removed;
 * - north-wall floor furniture stays at full height on a low (backed) north
 *   wall and depth-sorts by its own floor line, so anything north of it draws
 *   behind; only truly wall-hung items hide on a low wall;
 * - imaging rooms are dimmed, but never above the north wall's real height.
 */
import type {
  ApprovedRoomDrawRecord,
  ApprovedWallSegment,
} from "./approvedRoomPresentation";
import type { BitmapAssetDescriptor } from "../art/bitmapAssetManifest";

/** Touch-up primitives use 120 px per tile, like the approved proofs. */
export const TOUCHUP_TILE_PIXELS = 120;

export interface TouchupPrimitive {
  readonly shape: "rect" | "ellipse" | "roundRect";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly alpha: number;
  readonly radius?: number;
  /** Stroke width; when set the shape is outlined, not filled. */
  readonly stroke?: number;
}

export const TOUCHUP_HOUSE = {
  upperWall: "#efe1bd",
  rail: "#294632",
  railLight: "#789173",
  base: "#58735a",
  /** Rail height as a fraction of the tall north wall. */
  railRatio: .5,
  railPixels: 5,
  baseHeightPixels: 14,
  shadowNorthTiles: .34,
  shadowSideTiles: .15,
  shadowAlpha: .24,
  contactAlpha: .26,
} as const;

type LightKind = "dim" | "warm" | "cool" | "ambient";
/** All lighting multiplies the room; glows add light back with SCREEN. */
export const TOUCHUP_LIGHT_COLORS: Readonly<Record<LightKind, string>> = {
  dim: "#8793a6",
  warm: "#ffeed8",
  cool: "#e3edfb",
  // Reading Room: proof brightness .64 x final .85 shade = .544, slightly teal.
  // Always on and over the people in the room too (owner, 2026-10-07).
  ambient: "#8a8c8c",
};

// ------------------------------------------------------------------ sprites

export interface TouchupFileSprite {
  readonly file: string;
  readonly nativeWidth: number;
  readonly nativeHeight: number;
  readonly widthTiles: number;
}
export interface TouchupRecordSprite {
  /** Reuses an already approved room sprite. */
  readonly definitionId: string;
  readonly recordId: string;
  readonly widthTiles: number;
}
export type TouchupSprite = TouchupFileSprite | TouchupRecordSprite;

const file = (name: string, w: number, h: number, widthTiles: number): TouchupFileSprite =>
  ({ file: name, nativeWidth: w, nativeHeight: h, widthTiles });
const reuse = (definitionId: string, recordId: string, widthTiles: number): TouchupRecordSprite =>
  ({ definitionId, recordId, widthTiles });

export const TOUCHUP_SPRITES = {
  "trash-bin": file("trash-bin", 72, 94, .30),
  "recycle-bin": file("recycle-bin", 72, 94, .30),
  "biohazard-bin": file("biohazard-bin", 77, 92, .32),
  "sharps-wall": file("sharps-wall", 53, 69, .20),
  "glove-box-wall": file("glove-box-wall", 82, 51, .32),
  "towel-dispenser": file("towel-dispenser", 53, 66, .22),
  "soap-sanitizer-wall": file("soap-sanitizer-wall", 34, 53, .13),
  "grab-bar": file("grab-bar", 96, 21, .38),
  "wall-clock": file("wall-clock", 58, 58, .24),
  "wall-tv": file("wall-tv", 134, 83, .56),
  "xray-warning-light": file("xray-warning-light", 101, 42, .42),
  "sanitizer-stand": file("sanitizer-stand", 62, 205, .24),
  "floor-scale": file("floor-scale", 86, 249, .32),
  "umbrella-stand": file("umbrella-stand", 58, 128, .22),
  "step-stool": file("step-stool", 82, 86, .30),
  "lead-shield": file("lead-shield", 134, 234, .50),
  "linen-hamper": file("linen-hamper", 86, 125, .32),
  "positioning-pads": file("positioning-pads", 125, 78, .50),
  "sample-cart": file("sample-cart", 115, 144, .44),
  "step-ladder": file("step-ladder", 96, 230, .30),
  "repair-tag": file("repair-tag", 34, 48, .16),
  "corridor-bench": file("corridor-bench", 230, 120, .92),
  "curtain-bunch": file("curtain-bunch", 62, 211, .26),
  "cpr-manikin": file("cpr-manikin", 149, 63, .62),
  "plant-small": file("plant-small", 72, 115, .30),
  "instrument-trolley": reuse("room.minor_procedure", "trolley", .50),
  "office-chair": reuse("room.front_desk", "receptionist-chair", .52),
  "rolling-stool": reuse("room.minor_procedure", "stool", .44),
  "plant-flowering": reuse("room.waiting", "draws.plant", .48),
  "plant-fiddle": reuse("room.surgeon_office", "plant", .40),
  "plant-leafy": reuse("room.staff_break", "eastPlant", .40),
  "plant-snake": reuse("room.glp1_telehealth_suite", "plant1", .40),
  "art-blossom": reuse("room.periop_recovery", "N1.art", .56),
  "art-lake": reuse("room.periop_recovery", "N3.art", .56),
  "art-dunes": reuse("room.periop_recovery", "N4.art", .56),
  "art-autumn": reuse("room.periop_recovery", "N6.art", .56),
} as const satisfies Readonly<Record<string, TouchupSprite>>;
export type TouchupSpriteName = keyof typeof TOUCHUP_SPRITES;

export const isTouchupFileSprite = (sprite: TouchupSprite): sprite is TouchupFileSprite => "file" in sprite;

/** Project-made decor bitmaps (tools/room-design/touchup-2026-10/sprites). */
export const ROOM_TOUCHUP_DECOR_ASSETS: readonly BitmapAssetDescriptor[] = Object.values(TOUCHUP_SPRITES)
  .filter((sprite): sprite is TouchupFileSprite => "file" in sprite)
  .map((sprite) => ({
    id: `room-touchup:${sprite.file}`,
    relativePath: `art/rooms/touchup-v1/${sprite.file}.png`,
    nativeWidth: sprite.nativeWidth,
    nativeHeight: sprite.nativeHeight,
    anchor: { x: sprite.nativeWidth / 2, y: sprite.nativeHeight },
    orientation: "all",
    kind: "fixture",
  }));

// -------------------------------------------------------------------- rooms

export interface TouchupFootprint { readonly left: number; readonly top: number; readonly width: number; readonly height: number }

export interface TouchupDecorItem {
  readonly id: string;
  readonly sprite: TouchupSpriteName;
  /** floor: stands on the floor; wall: hangs on the north wall. */
  readonly kind: "floor" | "wall";
  /** Centre x in tiles. */
  readonly x: number;
  /** Floor contact y (floor items) in tiles. */
  readonly y?: number;
  /** Top edge (wall items) in tiles; negative is up the north wall. */
  readonly top?: number;
  readonly widthTiles: number;
  /** Doorways in these wall sections hide the item (it returns with the wall). */
  readonly owners: readonly ApprovedWallSegment[];
  /** Floor area kept clear of walking routes (0.18-tile actor radius). */
  readonly footprint?: TouchupFootprint;
}

export interface TouchupDecal {
  readonly kind: "rug" | "mat";
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly border?: string;
  readonly inner?: string;
  readonly ribs?: boolean;
}

export interface TouchupGlow {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly color: string;
  readonly alpha: number;
  /** Glow belongs to a wall item and goes out with it. */
  readonly owner?: ApprovedWallSegment;
}

export interface RoomTouchup {
  readonly proofId: string;
  /** Wainscot accent; omitted for rooms that keep their own approved walls. */
  readonly accent?: string;
  readonly light?: LightKind;
  /** "floor" tints only the floor area (the Reading Room's ambient shade). */
  readonly lightRegion?: "floor";
  /** false keeps the approved floor exactly (no added shadows or decals). */
  readonly floorTouchups?: boolean;
  readonly glows?: readonly TouchupGlow[];
  readonly glassPartition?: boolean;
  readonly decals?: readonly TouchupDecal[];
  readonly decor?: readonly TouchupDecorItem[];
  /** North-wall floor furniture that stays (full height) on a low wall. */
  readonly keepWhenBacked?: readonly string[];
  /** Door and low-wall rules for records whose runtime data lacks them. */
  readonly ownerFix?: Readonly<Record<string, Readonly<{ doorOwners?: readonly ApprovedWallSegment[]; backedOwners?: readonly ApprovedWallSegment[] }>>>;
  readonly recordEdits?: Readonly<Record<string, Readonly<{ scale?: number; depthKey?: number }>>>;
  readonly notes: readonly string[];
}

/**
 * Floor item standing at (x, y). Footprint is the real floor base (about 60%
 * of the sprite width), used by route checks. Owner revision 2026-10-07:
 * front-of-room items are ~1.4x larger and stay at least 0.08 tile clear of
 * side walls and 0.12 tile clear of the south wall, so they never overlap or
 * paint over a wall.
 */
const bin = (
  id: string, sprite: TouchupSpriteName, x: number, y: number,
  owners: readonly ApprovedWallSegment[], widthTiles?: number,
): TouchupDecorItem => {
  const w = widthTiles ?? TOUCHUP_SPRITES[sprite].widthTiles, half = w * .30;
  return { id, sprite, kind: "floor", x, y, widthTiles: w, owners, footprint: { left: x - half, top: y - .12, width: half * 2, height: .10 } };
};
const wallItem = (
  id: string, sprite: TouchupSpriteName, x: number, top: number,
  owners: readonly ApprovedWallSegment[], widthTiles?: number,
): TouchupDecorItem => ({ id, sprite, kind: "wall", x, top, widthTiles: widthTiles ?? TOUCHUP_SPRITES[sprite].widthTiles, owners });
const withFootprint = (item: TouchupDecorItem, footprint: TouchupFootprint): TouchupDecorItem => ({ ...item, footprint });

export const ROOM_TOUCHUPS: Readonly<Record<string, RoomTouchup>> = {
  "room.front_desk": {
    proofId: "front-desk",
    accent: "#d6c49c",
    decals: [{ kind: "mat", left: 2.12, top: 3.40, width: .76, height: .46, color: "#5b4a3b", ribs: true }],
    decor: [bin("umbrella", "umbrella-stand", 1.78, 3.86, ["S2"], .32)],
    keepWhenBacked: ["cabinet"],
    notes: [
      "Entry mat inside the sidewalk door; umbrella stand beside it.",
      "Two-tone wall: shared cream above a deep-green rail, warm sand below.",
      "North-wall cabinet stays when a room is built to the north (art still hides).",
    ],
  },
  "room.waiting": {
    proofId: "waiting",
    accent: "#d9a991",
    decals: [{ kind: "rug", left: .32, top: 1.18, width: 3.36, height: 1.56, color: "#c98f6a", border: "#8a4f34", inner: "#e8bf98" }],
    decor: [
      wallItem("clock", "wall-clock", 2.0, -.68, ["N2", "N3"], .30),
      bin("sanitizer", "sanitizer-stand", 3.74, 2.86, ["S4", "EC"], .34),
    ],
    ownerFix: { "draws.magazineRack": { doorOwners: ["N1"], backedOwners: ["N1"] }, "draws.plant": { doorOwners: ["N4", "EA"] } },
    notes: [
      "Rug under the seating group (walkable, never blocks a door).",
      "Wall clock centred over the bench; sanitizer stand in the south-east corner.",
      "Fix: the magazine rack and corner plant clear for doors at N1, N4 and EA.",
    ],
  },
  "room.examination": {
    proofId: "examination",
    accent: "#b7ccd2",
    decor: [
      bin("scale", "floor-scale", .31, 1.86, ["WB", "S1"], .44),
      bin("bin", "trash-bin", 2.71, 1.86, ["S3", "EB"], .42),
      wallItem("sanitizer", "soap-sanitizer-wall", .88, -.66, ["N1"], .17),
      wallItem("sharps", "sharps-wall", 2.27, -.68, ["N3"], .26),
      wallItem("gloves", "glove-box-wall", 2.70, -.58, ["N3"], .40),
    ],
    ownerFix: { sink: { doorOwners: ["N1", "WA"], backedOwners: [] }, diagnostic: { doorOwners: ["N2"], backedOwners: ["N2"] } },
    keepWhenBacked: ["sink"],
    notes: [
      "Floor scale in the south-west corner; trash bin south-east.",
      "Sharps box and glove boxes on the north wall, sanitizer beside the sink.",
      "Fix: sink and otoscope panel clear for doors at N1/WA and N2.",
    ],
  },
  "room.bathroom": {
    proofId: "bathroom",
    accent: "#a9cbc0",
    decals: [{ kind: "mat", left: .18, top: .98, width: .64, height: .30, color: "#8fb7a8" }],
    decor: [
      wallItem("towels", "towel-dispenser", .25, -.66, ["N1"], .28),
      wallItem("grab", "grab-bar", 1.68, -.42, ["N2"], .46),
      bin("bin", "trash-bin", 1.71, 1.86, ["S2", "EB"], .38),
    ],
    recordEdits: { mirror: { scale: 1.28 } },
    notes: ["Larger mirror, paper-towel dispenser, grab bar beside the toilet, bath mat and bin."],
  },
  "room.phlebotomy": {
    proofId: "phlebotomy",
    accent: "#d6a8b1",
    decor: [
      bin("cart", "sample-cart", 2.62, 1.87, ["S3", "EB"], .56),
      bin("bin", "biohazard-bin", .29, 1.86, ["S1", "WB"], .40),
    ],
    keepWhenBacked: ["sink"],
    notes: ["Specimen cart with tube racks in the south-east corner; biohazard bin south-west."],
  },
  "room.glp1_telehealth_suite": {
    proofId: "telehealth",
    accent: "#a7a3cb",
    decals: [{ kind: "rug", left: .16, top: .60, width: 2.68, height: 1.24, color: "#8f88b8", border: "#5f588a", inner: "#b7b0d8" }],
    decor: [bin("bin", "trash-bin", 2.71, 1.86, ["S3", "EB"], .38)],
    keepWhenBacked: ["plant1", "plant2"],
    notes: ["Rug under the shared desk; bin in the corner. Plants stay when a room is built to the north."],
  },
  "room.evs_closet": {
    proofId: "evs",
    accent: "#7d8870",
    keepWhenBacked: ["shelf1", "shelf2"],
    notes: ["Already full. Wall trim and shadows only; shelving stays when a room is built to the north."],
  },
  "room.coffee_kiosk": {
    proofId: "coffee",
    accent: "#b87f68",
    decor: [
      bin("bin", "trash-bin", .28, 1.86, ["S1", "WB"], .38),
      bin("recycle", "recycle-bin", 1.72, 1.86, ["S2", "EB"], .38),
    ],
    notes: ["Trash and recycling either side of the counter."],
  },
  "room.minor_procedure": {
    proofId: "minor-procedure",
    accent: "#c2b4d0",
    decor: [
      bin("bio", "biohazard-bin", 2.70, 2.86, ["S3", "EC"], .42),
      wallItem("sharps", "sharps-wall", .82, -.68, ["N1"], .26),
      wallItem("gloves", "glove-box-wall", 1.82, -.58, ["N2"], .36),
    ],
    keepWhenBacked: ["cabinet"],
    notes: ["Biohazard bin, wall sharps box and glove boxes."],
  },
  "room.ultrasound": {
    proofId: "ultrasound",
    accent: "#9db8cf",
    light: "dim",
    glows: [
      { x: .78, y: .55, r: .55, color: "#a9dcff", alpha: .55 },
      { x: 2.45, y: -.38, r: .42, color: "#cfeaff", alpha: .45, owner: "N3" },
    ],
    decor: [
      wallItem("tv", "wall-tv", 2.45, -.70, ["N3"], .62),
      bin("bin", "trash-bin", .28, 2.86, ["S1", "WC"], .38),
    ],
    keepWhenBacked: ["cabinet"],
    notes: ["Dims only while a scan is in progress, from the top of the north wall down to the south wall; the scanner screen and a patient-view TV glow.", "Bin in the south-west corner."],
  },
  "room.xray": {
    proofId: "xray",
    accent: "#a5b2c3",
    light: "dim",
    glows: [
      { x: 2.45, y: .85, r: .6, color: "#d6ecff", alpha: .5 },
      { x: 1.5, y: -.48, r: .3, color: "#ff8a70", alpha: .55, owner: "N2" },
    ],
    decor: [
      wallItem("warning", "xray-warning-light", 1.5, -.68, ["N2"], .50),
      bin("shield", "lead-shield", 2.58, 2.87, ["S3", "EC"], .62),
    ],
    ownerFix: { apron: { doorOwners: ["N1"], backedOwners: ["N1"] } },
    notes: [
      "Dims only while an X-ray is in progress; the console screens and the in-use light glow.",
      "\"X-RAY\" in-use light on the north wall; rolling lead shield south-east.",
      "Fix: the lead apron hides when a room or corridor is built to the north (it floated over the corridor).",
    ],
  },
  "room.ct": {
    proofId: "ct",
    accent: "#c5b1c0",
    glassPartition: true,
    decor: [
      bin("pads", "positioning-pads", .56, 3.86, ["S1", "WD"], .80),
      bin("bin", "trash-bin", 3.72, 3.86, ["S4", "ED"], .38),
    ],
    notes: [
      "Not dimmed (owner revision). Control partition redrawn as a framed glass window.",
      "Positioning pads by the scanner; bin in the control area.",
    ],
  },
  "room.endoscopy": {
    proofId: "endoscopy",
    accent: "#738690",
    decor: [
      bin("trolley", "instrument-trolley", .38, 2.88, ["S1", "WC"], .58),
      bin("hamper", "linen-hamper", 3.70, 2.86, ["S4", "EC"], .42),
      wallItem("clock", "wall-clock", 1.50, -.70, ["N2"], .30),
      withFootprint(bin("stool", "rolling-stool", 3.0, 2.06, [], .48), { left: 2.86, top: 1.90, width: .28, height: .16 }),
    ],
    keepWhenBacked: ["cabinet", "sink"],
    notes: ["Instrument trolley, linen hamper, an endoscopist's stool (where four tiles meet, clear of every walking line) and a procedure clock."],
  },
  "room.periop_recovery": {
    proofId: "recovery",
    accent: "#9db0a4",
    decor: [
      { id: "curtainN", sprite: "curtain-bunch", kind: "floor", x: 3.0, y: 1.72, widthTiles: .26, owners: ["N3", "N4"], footprint: { left: 2.89, top: 1.60, width: .22, height: .1 } },
      { id: "curtainS", sprite: "curtain-bunch", kind: "floor", x: 3.0, y: 4.52, widthTiles: .26, owners: ["S3", "S4"], footprint: { left: 2.89, top: 4.42, width: .22, height: .1 } },
      wallItem("clock", "wall-clock", 1.40, -.68, ["N2"], .30),
    ],
    ownerFix: {
      "N1.art": { doorOwners: ["N1"], backedOwners: ["N1"] }, "N3.art": { doorOwners: ["N3"], backedOwners: ["N3"] },
      "N4.art": { doorOwners: ["N4"], backedOwners: ["N4"] }, "N6.art": { doorOwners: ["N6"], backedOwners: ["N6"] },
    },
    notes: [
      "Fix: the four wall prints hide on a low north wall (they floated over whatever is north).",
      "Privacy curtains gathered at the free ends of the north and south bay dividers; wall clock.",
    ],
  },
  "room.training": {
    proofId: "training",
    accent: "#c69a80",
    decor: [
      withFootprint(bin("manikin", "cpr-manikin", 1.5, 2.86, ["S2"], 1.0), { left: 1.06, top: 2.70, width: .88, height: .14 }),
      bin("plant", "plant-small", .30, 2.86, ["S1", "WC"], .40),
    ],
    keepWhenBacked: ["cabinetAnatomy", "skeleton"],
    notes: ["CPR practice manikin on a mat fills the empty south half; small plant in the corner."],
  },
  "room.ambulatory_or": {
    proofId: "ambulatory-or",
    accent: "#a5c0bd",
    light: "cool",
    decor: [
      bin("hamper", "linen-hamper", .30, 3.86, ["S1", "WD"], .42),
      bin("bio", "biohazard-bin", 3.71, 3.86, ["S4", "ED"], .40),
    ],
    keepWhenBacked: ["workstation", "storageLeft", "storageRight", "sink"],
    notes: [
      "Cool surgical light tint.",
      "Workstation, supply shelving and scrub sink stay when the corridor runs along the north wall.",
      "Linen hamper and biohazard bin in the south corners.",
    ],
  },
  "room.laboratory": {
    proofId: "laboratory",
    accent: "#b4ccc8",
    decals: [{ kind: "mat", left: 1.10, top: 2.12, width: .80, height: .40, color: "#2f3a36", ribs: true }],
    decor: [
      bin("cart", "sample-cart", .37, 2.87, ["S1", "WC"], .56),
      bin("bio", "biohazard-bin", 2.71, 2.86, ["S3", "EC"], .40),
    ],
    keepWhenBacked: ["sink", "workstation", "fridge"],
    notes: [
      "Sink, computer and specimen fridge stay when the corridor runs along the north wall.",
      "Anti-fatigue mat at the bench, specimen cart and biohazard bin.",
    ],
  },
  "room.pharmacy": {
    proofId: "pharmacy",
    accent: "#cdc4a1",
    decals: [{ kind: "mat", left: 2.12, top: 1.16, width: .60, height: .52, color: "#3a3f36", ribs: true }],
    decor: [
      withFootprint(bin("stool", "step-stool", 1.0, .98, [], .38), { left: .90, top: .86, width: .2, height: .1 }),
      bin("plant", "plant-flowering", .36, 2.86, ["S1", "WC"], .54),
      bin("bin", "trash-bin", 2.71, 2.86, ["S3", "EC"], .38),
    ],
    keepWhenBacked: ["stock", "shelves", "computer"],
    notes: [
      "Stock shelving and computer stay when the corridor runs along the north wall.",
      "Step stool for the high shelves, mat where the pharmacist stands, plant and bin.",
    ],
  },
  "room.maintenance_workshop": {
    proofId: "maintenance-workshop",
    accent: "#979a8c",
    decor: [
      withFootprint(bin("chair", "office-chair", .40, 2.88, ["S1", "WC"], .62), { left: .18, top: 2.72, width: .44, height: .14 }),
      { id: "tag", sprite: "repair-tag", kind: "floor", x: .66, y: 2.76, widthTiles: .20, owners: ["S1", "WC"] },
      withFootprint(bin("ladder", "step-ladder", 2.72, 1.96, ["EB"], .38), { left: 2.70, top: 1.86, width: .14, height: .1 }),
    ],
    keepWhenBacked: ["parts", "cupboard"],
    notes: [
      "Parts bins and tool locker stay when the corridor runs along the north wall (pegboard still hides).",
      "A broken office chair with a repair tag waits in the corner; step ladder against the east wall.",
    ],
  },
  "room.staff_break": {
    proofId: "staff-break-room",
    accent: "#cfb18c",
    light: "warm",
    keepWhenBacked: ["kitchen", "fridge"],
    // The table front layers drew over the south sitter (pedestal through the
    // body). Order is now: table, table front, chair, sitter, chair back.
    // West/east sitters (1.56) stay behind the large table's front.
    recordEdits: { largeTableFront: { depthKey: 2.10 }, smallTableFront: { depthKey: 3.55 } },
    notes: [
      "Fix: the person in each table's south chair sits in front of the table and behind their chair back.",
      "Warm light tint. Kitchenette and fridge stay when a room or corridor is built to the north.",
    ],
  },
  "room.surgeon_office": {
    proofId: "surgeons-office",
    accent: "#a7bbbf",
    keepWhenBacked: ["bookcase"],
    notes: ["Bookcase stays when a room is built to the north (diplomas still hide)."],
  },
  "room.reading": {
    proofId: "radiology-reading",
    light: "ambient",
    lightRegion: "floor",
    floorTouchups: false,
    notes: ["Owner-approved Reading Room: gray walls, dark carpet; always dim, furniture and the people in it alike."],
  },
  "room.vending": {
    proofId: "vending",
    accent: "#c38e7c",
    decor: [
      bin("bin", "trash-bin", .28, 1.86, ["S1", "WB"], .38),
      bin("recycle", "recycle-bin", .66, 1.86, ["S1", "WB"], .38),
      bin("plant", "plant-small", 1.70, 1.86, ["S2", "EB"], .40),
    ],
    notes: ["Trash and recycling bins and a small plant."],
  },
};

export function getRoomTouchup(definitionId: string): RoomTouchup | undefined {
  return ROOM_TOUCHUPS[definitionId];
}

// --------------------------------------------------------- 270-degree frame

/** Proof transform "(x,y)->(y,W-x)" maps base-frame tiles into the 270 view. */
export function rotateTouchupSegment(segment: ApprovedWallSegment, baseWidth: number): ApprovedWallSegment {
  const side = segment[0];
  const offset = side === "N" || side === "S" ? Number(segment.slice(1)) - 1 : segment.charCodeAt(1) - 65;
  const letter = (index: number) => String.fromCharCode(65 + index);
  if (side === "N") return `W${letter(baseWidth - 1 - offset)}` as ApprovedWallSegment;
  if (side === "S") return `E${letter(baseWidth - 1 - offset)}` as ApprovedWallSegment;
  if (side === "W") return `S${offset + 1}` as ApprovedWallSegment;
  return `N${offset + 1}` as ApprovedWallSegment;
}
const rotateRect = (rect: TouchupFootprint, baseWidth: number): TouchupFootprint =>
  ({ left: rect.top, top: baseWidth - (rect.left + rect.width), width: rect.height, height: rect.width });

// ------------------------------------------------------------ draw records

export interface TouchupDrawRecord extends ApprovedRoomDrawRecord {
  /** Stays at full height on a low north wall, depth-sorted by its floor line. */
  readonly touchupKeepWhenBacked: boolean;
}

/** Applies owner fixes, size/depth edits and the low-wall keep list. */
export function applyRoomTouchupsToRecords(
  definitionId: string,
  orientation: 0 | 270,
  baseWidth: number,
  records: readonly ApprovedRoomDrawRecord[],
): readonly TouchupDrawRecord[] {
  const touchup = ROOM_TOUCHUPS[definitionId];
  const map = (owners: readonly ApprovedWallSegment[]) =>
    orientation === 270 ? owners.map((owner) => rotateTouchupSegment(owner, baseWidth)) : [...owners];
  return records.map((record) => {
    const fix = touchup?.ownerFix?.[record.id];
    const edit = touchup?.recordEdits?.[record.id];
    let { destinationTopLeftTiles, renderSizeTiles, depthKey } = record;
    if (edit?.scale) {
      const [w, h] = renderSizeTiles, [x, y] = destinationTopLeftTiles;
      const nw = w * edit.scale, nh = h * edit.scale;
      destinationTopLeftTiles = [x + w / 2 - nw / 2, y + h - nh];
      renderSizeTiles = [nw, nh];
    }
    if (edit?.depthKey !== undefined) depthKey = edit.depthKey;
    return {
      ...record,
      destinationTopLeftTiles,
      renderSizeTiles,
      depthKey,
      doorOwners: fix?.doorOwners ? map(fix.doorOwners) : record.doorOwners,
      backedOwners: fix?.backedOwners ? map(fix.backedOwners) : record.backedOwners,
      touchupKeepWhenBacked: touchup?.keepWhenBacked?.includes(record.id) ?? false,
    };
  });
}

export function isTouchupRecordVisible(
  record: TouchupDrawRecord,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
): boolean {
  if (record.doorOwners.some((owner) => openDoorSegments.has(owner))) return false;
  if (!record.backedOwners.some((owner) => backedNorthSegments.has(owner))) return true;
  return record.touchupKeepWhenBacked;
}

/** True when a kept record must leave the wall layer and sort by its floor line. */
export function isTouchupRecordFloorSortedOnLowWall(
  record: TouchupDrawRecord,
  backedNorthSegments: ReadonlySet<string>,
): boolean {
  return record.touchupKeepWhenBacked && record.backedOwners.some((owner) => backedNorthSegments.has(owner));
}

export function getTouchupRecordFloorLine(record: ApprovedRoomDrawRecord): number {
  return record.destinationTopLeftTiles[1] + record.renderSizeTiles[1];
}

// --------------------------------------------------------------- decor

export interface PlacedTouchupDecor extends TouchupDecorItem {
  /** Base or rotated local frame, matching the runtime room. */
  readonly sortY: number;
}

export function getVisibleTouchupDecor(
  definitionId: string,
  orientation: 0 | 270,
  baseWidth: number,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
): readonly PlacedTouchupDecor[] {
  const touchup = ROOM_TOUCHUPS[definitionId];
  const out: PlacedTouchupDecor[] = [];
  for (const base of touchup?.decor ?? []) {
    let item: TouchupDecorItem = base;
    if (orientation === 270) {
      if (base.kind === "wall") continue; // the base north wall becomes a side wall
      const footprint = base.footprint ? rotateRect(base.footprint, baseWidth) : undefined;
      item = { ...base, x: base.y ?? 0, y: baseWidth - base.x, owners: base.owners.map((owner) => rotateTouchupSegment(owner, baseWidth)), ...(footprint ? { footprint } : {}) };
    }
    if (item.owners.some((owner) => openDoorSegments.has(owner))) continue;
    if (item.kind === "wall" && item.owners.some((owner) => owner.startsWith("N") && backedNorthSegments.has(owner))) continue;
    out.push({ ...item, sortY: item.kind === "wall" ? -1 : item.y ?? 0 });
  }
  return out;
}

// ------------------------------------------------------- floor primitives

const segmentId = (side: "N" | "S" | "W" | "E", offset: number): string =>
  side === "N" || side === "S" ? `${side}${offset + 1}` : `${side}${String.fromCharCode(65 + offset)}`;

/** Soft shadow bands where the floor meets each closed wall section. */
function wallBaseShadow(width: number, height: number, openDoorSegments: ReadonlySet<string>): TouchupPrimitive[] {
  const out: TouchupPrimitive[] = [], P = TOUCHUP_TILE_PIXELS, bands = 6;
  const north = TOUCHUP_HOUSE.shadowNorthTiles * P, side = TOUCHUP_HOUSE.shadowSideTiles * P;
  for (let i = 0; i < bands; i += 1) {
    const alpha = TOUCHUP_HOUSE.shadowAlpha * (1 - i / bands) / 2.2;
    for (let o = 0; o < width; o += 1) {
      if (openDoorSegments.has(segmentId("N", o))) continue;
      out.push({ shape: "rect", x: o * P, y: 0, width: P, height: north * (i + 1) / bands, color: "#1c241e", alpha });
    }
    for (let o = 0; o < height; o += 1) {
      const sw = side * (i + 1) / bands;
      if (!openDoorSegments.has(segmentId("W", o))) out.push({ shape: "rect", x: 0, y: o * P, width: sw, height: P, color: "#1c241e", alpha: alpha * .8 });
      if (!openDoorSegments.has(segmentId("E", o))) out.push({ shape: "rect", x: width * P - sw, y: o * P, width: sw, height: P, color: "#1c241e", alpha: alpha * .8 });
    }
  }
  return out;
}

function decalPrimitives(decal: TouchupDecal): TouchupPrimitive[] {
  const P = TOUCHUP_TILE_PIXELS, x = decal.left * P, y = decal.top * P, w = decal.width * P, h = decal.height * P;
  if (decal.kind === "rug") return [
    { shape: "roundRect", x, y, width: w, height: h, color: decal.color, alpha: 1, radius: 6 },
    { shape: "roundRect", x: x + 7, y: y + 7, width: w - 14, height: h - 14, color: decal.border ?? "#000000", alpha: 1, radius: 4, stroke: 4 },
    ...(decal.inner ? [{ shape: "roundRect", x: x + 15, y: y + 15, width: w - 30, height: h - 30, color: decal.inner, alpha: 1, radius: 3, stroke: 2 } as TouchupPrimitive] : []),
    { shape: "rect", x: x + 3, y: y + h - 3, width: w - 6, height: 3, color: "#191e19", alpha: .10 },
  ];
  const out: TouchupPrimitive[] = [
    { shape: "roundRect", x, y, width: w, height: h, color: decal.color, alpha: 1, radius: 5 },
    { shape: "roundRect", x: x + .75, y: y + .75, width: w - 1.5, height: h - 1.5, color: "#000000", alpha: .25, radius: 5, stroke: 1.5 },
  ];
  if (decal.ribs) for (let k = x + 8; k < x + w - 4; k += 8) out.push({ shape: "rect", x: k - 1, y: y + 5, width: 2, height: h - 10, color: "#ffffff", alpha: .10 });
  return out;
}

/** Soft contact shadow rings under floor furniture. */
function contactShadow(record: ApprovedRoomDrawRecord): TouchupPrimitive[] {
  if (record.depthPolicy === "wall" || /front$/i.test(record.id) || record.id === "lights") return [];
  const [left, top] = record.destinationTopLeftTiles, [w, h] = record.renderSizeTiles;
  if (top + h < .15) return []; // wall-hung
  const P = TOUCHUP_TILE_PIXELS, fp = record.footprint;
  const cx = fp ? (fp.left + fp.width / 2) * P : (left + w / 2) * P;
  const cy = fp ? (fp.top + fp.height) * P - 4 : (top + h) * P - 3;
  const rx = fp ? fp.width * P * .55 : w * P * .42;
  const ry = fp ? Math.max(6, fp.height * P * .22) : Math.max(5, w * P * .07);
  const rings = 6, out: TouchupPrimitive[] = [];
  for (let i = 0; i < rings; i += 1) {
    const f = 1 - i / rings;
    out.push({ shape: "ellipse", x: cx - rx * f, y: cy - ry * f, width: rx * 2 * f, height: ry * 2 * f, color: "#19201a", alpha: TOUCHUP_HOUSE.contactAlpha / rings });
  }
  return out;
}

/**
 * Floor-layer touch-ups in 120 px/tile room-local space: wall-base shadow,
 * rugs and mats, and contact shadows for the visible floor furniture.
 */
export function getTouchupFloorPrimitives(
  definitionId: string,
  orientation: 0 | 270,
  footprint: readonly [width: number, height: number],
  baseWidth: number,
  openDoorSegments: ReadonlySet<string>,
  visibleRecords: readonly ApprovedRoomDrawRecord[],
): readonly TouchupPrimitive[] {
  const touchup = ROOM_TOUCHUPS[definitionId];
  if (!touchup || touchup.floorTouchups === false) return [];
  const out = wallBaseShadow(footprint[0], footprint[1], openDoorSegments);
  for (const decal of touchup.decals ?? []) {
    const rect = orientation === 270 ? rotateRect(decal, baseWidth) : decal;
    out.push(...decalPrimitives({ ...decal, ...rect }));
  }
  for (const record of visibleRecords) out.push(...contactShadow(record));
  return out;
}

// --------------------------------------------------------- north wall paint

/**
 * Two-tone house wall for a tall north-wall run, in shell pixels measured up
 * from the floor line: cream above a deep-green rail, room accent below, and a
 * house-green base. Returns bands as [offsetAboveFloor, height, color].
 */
export function getTouchupNorthWallBands(
  accent: string,
  wallHeightPixels: number,
): readonly (readonly [top: number, height: number, color: string])[] {
  const rail = Math.round(wallHeightPixels * TOUCHUP_HOUSE.railRatio);
  return [
    [wallHeightPixels, wallHeightPixels, TOUCHUP_HOUSE.upperWall],
    [rail, rail, accent],
    [rail + 2, TOUCHUP_HOUSE.railPixels, TOUCHUP_HOUSE.rail],
    [rail + 2, 2, TOUCHUP_HOUSE.railLight],
    [TOUCHUP_HOUSE.baseHeightPixels, TOUCHUP_HOUSE.baseHeightPixels, TOUCHUP_HOUSE.base],
    [TOUCHUP_HOUSE.baseHeightPixels, 3, TOUCHUP_HOUSE.railLight],
  ];
}

// ------------------------------------------------------------- lighting

export interface TouchupLighting {
  readonly color: string;
  /** Room-local 120 px rectangles, per north segment, up to that wall's top. */
  readonly regions: readonly TouchupPrimitive[];
  readonly glows: readonly TouchupPrimitive[];
  /** Region top (120 px, negative = up the north wall) for each north segment. */
  readonly segmentTops: readonly number[];
}

/** True for rooms that dim only while imaging is in progress. */
export function isTouchupImagingDimRoom(definitionId: string): boolean {
  return ROOM_TOUCHUPS[definitionId]?.light === "dim";
}

/**
 * Room lighting. Imaging rooms ("dim") light up only while `imagingActive`;
 * warm/cool tints are always on. The tint runs from the top of the north wall
 * (tall or low, per segment) down to the top of the south wall, never over it.
 */
export function getTouchupLighting(
  definitionId: string,
  footprint: readonly [width: number, height: number],
  shell: Readonly<{ tilePixels: number; rearWallHeightPixels: number; lowNorthHeightPixels: number; sideCapWidthPixels: number; southHeightPixels: number }>,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
  imagingActive = false,
): TouchupLighting | undefined {
  const touchup = ROOM_TOUCHUPS[definitionId];
  if (!touchup?.light) return undefined;
  if (touchup.light === "dim" && !imagingActive) return undefined;
  const P = TOUCHUP_TILE_PIXELS, k = P / shell.tilePixels, [W, H] = footprint;
  // The south wall's dark top band starts 6 shell px above the floor line.
  const cap = shell.sideCapWidthPixels * k, bottom = H * P - 6 * k;
  const color = TOUCHUP_LIGHT_COLORS[touchup.light];
  const regions: TouchupPrimitive[] = [];
  const segmentTops: number[] = [];
  if (touchup.lightRegion === "floor") {
    regions.push({ shape: "rect", x: 0, y: 0, width: W * P, height: H * P, color, alpha: 1 });
    return { color, regions, glows: [], segmentTops: Array.from({ length: W }, () => 0) };
  }
  for (let o = 0; o < W; o += 1) {
    const top = -(backedNorthSegments.has(segmentId("N", o)) ? shell.lowNorthHeightPixels : shell.rearWallHeightPixels + 9) * k;
    segmentTops.push(top);
    const left = o * P - (o === 0 ? cap : 0), right = (o + 1) * P + (o === W - 1 ? cap : 0);
    regions.push({ shape: "rect", x: left, y: top, width: right - left, height: bottom - top, color, alpha: 1 });
  }
  const glows: TouchupPrimitive[] = [];
  for (const glow of touchup.glows ?? []) {
    if (glow.owner && (openDoorSegments.has(glow.owner) || backedNorthSegments.has(glow.owner))) continue;
    const rings = 12;
    for (let i = 0; i < rings; i += 1) {
      const f = 1 - i / rings, r = glow.r * P * f;
      glows.push({ shape: "ellipse", x: glow.x * P - r, y: glow.y * P - r, width: r * 2, height: r * 2, color: glow.color, alpha: glow.alpha / rings });
    }
  }
  return { color, regions, glows, segmentTops };
}

/**
 * Back-wall furniture in a tinted room is tinted in its entirety: returns the
 * 120 px y above which a sprite centred at `centerXTiles` needs a tinted copy
 * (the part that rises past the tinted region), or undefined if none.
 */
export function getTouchupTintTopAt(lighting: TouchupLighting, centerXTiles: number): number {
  const index = Math.max(0, Math.min(lighting.segmentTops.length - 1, Math.floor(centerXTiles)));
  return lighting.segmentTops[index]!;
}

// ----------------------------------------------------- CT glass partition

/** Framed observation window replacing the thin CT control partition. */
export function getTouchupGlassPartitionPrimitives(
  rect: Readonly<{ left: number; top: number; width: number; height: number }>,
): readonly TouchupPrimitive[] {
  const fw = Math.max(rect.width, 12), fx = rect.left - (fw - rect.width) / 2, y = rect.top, h = rect.height;
  const gy = y + h * .16, gh = h * .58;
  const out: TouchupPrimitive[] = [
    { shape: "rect", x: fx, y, width: fw, height: h, color: "#38524a", alpha: 1 },
    { shape: "rect", x: fx, y, width: fw, height: 4, color: "#7c9680", alpha: 1 },
    { shape: "rect", x: fx, y, width: fw, height: 3, color: "#294632", alpha: 1 },
    { shape: "rect", x: fx - 2, y: gy - 3, width: fw + 4, height: gh + 6, color: "#294632", alpha: 1 },
  ];
  const tones = ["#cfe3e6", "#bcd6da", "#a9c9cf", "#97b8bf", "#86aab3", "#7fa4ad"];
  tones.forEach((color, i) => out.push({ shape: "rect", x: fx, y: gy + gh * i / tones.length, width: fw, height: gh / tones.length + .5, color, alpha: 1 }));
  for (let i = 0; i < 4; i += 1) out.push({ shape: "rect", x: fx + 2, y: gy + gh * (.12 + i * .24), width: fw - 4, height: 2, color: "#ffffff", alpha: .5 });
  out.push({ shape: "rect", x: fx - 2, y: gy + gh / 2 - 1, width: fw + 4, height: 3, color: "#294632", alpha: 1 });
  return out;
}

// --------------------------------------------------------------- corridor

export const TOUCHUP_CORRIDOR = {
  accent: "#cbbd9c",
  stripe: "#58735a",
} as const;

export interface TouchupCorridorItem {
  readonly sprite: TouchupSpriteName;
  readonly kind: "floor" | "wall";
  /** Absolute tile coordinates. */
  readonly x: number;
  readonly y?: number;
  readonly top?: number;
  readonly widthTiles: number;
}

const tileHash = (x: number, y: number) => Math.abs((x * 73856093) ^ (y * 19349663)) % 1009;
const mod = (value: number, n: number) => ((value % n) + n) % n;
const CORRIDOR_RHYTHM = ["art-bench", "empty", "plant", "art", "empty", "sanitizer", "art", "empty"] as const;
const CORRIDOR_ART: readonly TouchupSpriteName[] = ["art-blossom", "art-lake", "art-dunes", "art-autumn"];
const CORRIDOR_PLANTS: readonly TouchupSpriteName[] = ["plant-fiddle", "plant-snake", "plant-leafy"];

/**
 * Which hallway edges have a wall to stand decor against. A "tall" north wall
 * faces outdoors and can carry art; a "backed" north edge is shared with a
 * room (no wall face, so floor items only). Side walls are any non-hallway
 * neighbour, exterior or room.
 */
export interface TouchupCorridorWalls {
  readonly north: "tall" | "backed" | null;
  readonly west: boolean;
  readonly east: boolean;
}

/** Hallway sides that have a doorway at this tile; decor keeps them clear. */
export interface TouchupCorridorOpenings {
  readonly north: boolean;
  readonly west: boolean;
  readonly east: boolean;
}

/**
 * Corridor decor for one hallway tile. The rhythm is keyed to absolute tile
 * position so painting more hallway never reshuffles existing items. Items
 * hug a wall that has no doorway, skip corridor ends and corners, and stay
 * within 0.3 tile of the wall so tile-centre walking routes remain clear.
 */
export function getTouchupCorridorDecor(
  tile: Readonly<{ x: number; y: number }>,
  isCorridor: (x: number, y: number) => boolean,
  walls: TouchupCorridorWalls,
  openings: TouchupCorridorOpenings,
): readonly TouchupCorridorItem[] {
  const items: TouchupCorridorItem[] = [];
  const h = tileHash(tile.x, tile.y);
  if (walls.north && !openings.north && isCorridor(tile.x - 1, tile.y) && isCorridor(tile.x + 1, tile.y)) {
    const kind = CORRIDOR_RHYTHM[mod(tile.x, CORRIDOR_RHYTHM.length)];
    const tall = walls.north === "tall";
    // Against a room-backed edge the room floor runs to the line, so floor
    // items sit a little further south to keep their tops near it.
    const base = tall ? .30 : .38;
    if (tall && (kind === "art" || kind === "art-bench")) items.push({ sprite: CORRIDOR_ART[h % CORRIDOR_ART.length]!, kind: "wall", x: tile.x + .5, top: tile.y - .70, widthTiles: .56 });
    if (kind === "art-bench") items.push({ sprite: "corridor-bench", kind: "floor", x: tile.x + .5, y: tile.y + base, widthTiles: .92 });
    if (kind === "plant") items.push({ sprite: CORRIDOR_PLANTS[h % CORRIDOR_PLANTS.length]!, kind: "floor", x: tile.x + .5, y: tile.y + base, widthTiles: .36 });
    if (kind === "sanitizer") items.push({ sprite: "sanitizer-stand", kind: "floor", x: tile.x + .5, y: tile.y + base - .04, widthTiles: .24 });
  }
  if (isCorridor(tile.x, tile.y - 1) && isCorridor(tile.x, tile.y + 1)) {
    const plant = CORRIDOR_PLANTS[Math.floor(h / 4) % CORRIDOR_PLANTS.length]!;
    if (walls.west && !openings.west && h % 4 === 0) items.push({ sprite: plant, kind: "floor", x: tile.x + .2, y: tile.y + .55, widthTiles: .32 });
    if (walls.east && !openings.east && h % 4 === 2) items.push({ sprite: plant, kind: "floor", x: tile.x + .8, y: tile.y + .55, widthTiles: .32 });
  }
  return items;
}

/** Wayfinding stripe and wall-base shadow for one corridor tile (120 px space). */
export function getTouchupCorridorFloorPrimitives(hasNorthWall: boolean): readonly TouchupPrimitive[] {
  const P = TOUCHUP_TILE_PIXELS, out: TouchupPrimitive[] = [];
  if (!hasNorthWall) return out;
  const bands = 6;
  for (let i = 0; i < bands; i += 1) {
    out.push({ shape: "rect", x: 0, y: 0, width: P, height: TOUCHUP_HOUSE.shadowNorthTiles * P * (i + 1) / bands, color: "#1c241e", alpha: TOUCHUP_HOUSE.shadowAlpha * (1 - i / bands) / 2.2 });
  }
  out.push({ shape: "rect", x: 0, y: P * .78, width: P, height: 6, color: TOUCHUP_CORRIDOR.stripe, alpha: .55 });
  return out;
}

// Runner rugs (owner-approved 2026-10-07): 4-tile runners with 3-tile gaps
// along straight one-tile-wide corridor runs, keyed to absolute position.
const RUNNER_PERIOD = 7;
const RUNNER_LENGTH = 4;
const RUNNER_PALETTES = [
  { color: "#a85f45", border: "#6b3424", inner: "#e0b38e" },
  { color: "#6f8a6c", border: "#3f5641", inner: "#c6d6b4" },
  { color: "#677e9e", border: "#3e4f69", inner: "#c2cfe0" },
] as const;

/**
 * Runner rug piece for one hallway tile, in 120 px tile-local space. Pieces
 * from neighbouring tiles join into one rug, so only the end tiles draw end
 * borders and fringe. Junctions, corners and two-wide areas stay bare, and a
 * runner shorter than two tiles is skipped.
 */
export function getTouchupCorridorRunnerPrimitives(
  tile: Readonly<{ x: number; y: number }>,
  isCorridor: (x: number, y: number) => boolean,
): readonly TouchupPrimitive[] {
  const horizontal = (x: number, y: number) => isCorridor(x, y) && !isCorridor(x, y - 1) && !isCorridor(x, y + 1) &&
    (isCorridor(x - 1, y) || isCorridor(x + 1, y));
  const vertical = (x: number, y: number) => isCorridor(x, y) && !isCorridor(x - 1, y) && !isCorridor(x + 1, y) &&
    (isCorridor(x, y - 1) || isCorridor(x, y + 1));
  const along = horizontal(tile.x, tile.y) ? "x" : vertical(tile.x, tile.y) ? "y" : null;
  if (!along) return [];
  const position = along === "x" ? tile.x : tile.y;
  const slot = mod(position, RUNNER_PERIOD);
  if (slot < 1 || slot > RUNNER_LENGTH) return [];
  const windowStart = position - slot + 1, windowEnd = windowStart + RUNNER_LENGTH - 1;
  const fits = (p: number) => along === "x" ? horizontal(p, tile.y) : vertical(tile.x, p);
  let start = position, end = position;
  while (start > windowStart && fits(start - 1)) start -= 1;
  while (end < windowEnd && fits(end + 1)) end += 1;
  if (end - start < 1) return [];
  const palette = RUNNER_PALETTES[(along === "x" ? tileHash(windowStart, tile.y) : tileHash(tile.x, windowStart)) % RUNNER_PALETTES.length]!;
  const P = TOUCHUP_TILE_PIXELS, inset = 10, cross0 = P * .34, crossSize = P * .36;
  const first = position === start, last = position === end;
  // Lay the piece out as if horizontal (a = along, c = across), then swap
  // axes for vertical runs.
  const a0 = first ? inset : 0, a1 = last ? P - inset : P;
  const out: Array<[number, number, number, number, string, number]> = [
    [a0, cross0 + crossSize - 1, a1 - a0, 4, "#191e19", .10],
    [a0, cross0, a1 - a0, crossSize, palette.color, 1],
    [a0, cross0 + 5, a1 - a0, 4, palette.border, 1],
    [a0, cross0 + crossSize - 9, a1 - a0, 4, palette.border, 1],
    [a0, cross0 + 12, a1 - a0, 2, palette.inner, 1],
    [a0, cross0 + crossSize - 14, a1 - a0, 2, palette.inner, 1],
  ];
  const ends: Array<[number, 1 | -1]> = [];
  if (first) ends.push([a0, 1]);
  if (last) ends.push([a1, -1]);
  for (const [at, inward] of ends) {
    out.push([inward > 0 ? at + 5 : at - 9, cross0 + 5, 4, crossSize - 10, palette.border, 1]);
    out.push([inward > 0 ? at + 12 : at - 14, cross0 + 12, 2, crossSize - 24, palette.inner, 1]);
    // Fringe tassels just outside the rug's end.
    for (let c = cross0 + 3; c < cross0 + crossSize - 2; c += 5) out.push([inward > 0 ? at - 5 : at, c, 5, 2, palette.inner, .9]);
  }
  return out.map(([a, c, aw, cw, color, alpha]): TouchupPrimitive => along === "x"
    ? { shape: "rect", x: a, y: c, width: aw, height: cw, color, alpha }
    : { shape: "rect", x: c, y: a, width: cw, height: aw, color, alpha });
}
