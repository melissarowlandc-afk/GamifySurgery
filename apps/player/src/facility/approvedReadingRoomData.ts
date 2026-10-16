import type { ApprovedRoomDrawRecord } from "./approvedRoomPresentation";

/**
 * Owner-approved Radiology Reading Room (approved 2026-10-07; proof
 * tools/room-design/level-4/radiology-reading/proof/radiology-reading-proof.html,
 * SHA256 D574AA0F...1BB). Placement numbers come from the proof's processed
 * asset metadata and approved layout; runtime art carries the proof's
 * `saturate(.80)` and the room's dimness is one multiply over the floor area
 * that also covers seated readers (tools/room-design/level-4/radiology-reading/
 * runtime-promotion, roomTouchups "ambient").
 *
 * The proof draws one island sprite plus three re-drawn clips so seated
 * readers tuck behind the correct desk edges. Its layer order is:
 * chairs, island, NW reader, NW desk front, NE reader, SE divider front,
 * SW reader, SW desk front, SE reader, SE chair front. The depth keys below
 * reproduce that order; matching reader painter grounds are exported for the
 * seat supports (NW 1.65, NE 1.75, SW 2.40, SE 2.90).
 */
export const APPROVED_READING_ROOM_PROOF_SHA256 = "D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB";
/** Proof canvas floor origin (room.x, room.y) at 120 px per tile. */
export const APPROVED_READING_ROOM_FLOOR_ORIGIN: readonly [number, number] = [120, 120];
export const APPROVED_READING_ROOM_FILES = [
  "island.webp", "chair-northwest.webp", "chair-northeast.webp", "chair-southeast.webp", "chair-southwest.webp",
] as const;

const TILE = 120;

interface SpriteSpec {
  readonly file: (typeof APPROVED_READING_ROOM_FILES)[number];
  readonly size: readonly [number, number];
  readonly anchor: readonly [number, number];
  readonly renderScale: number;
  /** World ground (tiles) of the anchor. */
  readonly ground: readonly [number, number];
}

const ISLAND: SpriteSpec = { file: "island.webp", size: [1054, 996], anchor: [507, 994], renderScale: 0.3076923076923077, ground: [2, 3.32] };
const CHAIRS = {
  northwest: { file: "chair-northwest.webp", size: [412, 465], anchor: [200, 463], renderScale: 0.2694610778443114, ground: [1.30, 1.95] },
  northeast: { file: "chair-northeast.webp", size: [355, 453], anchor: [221, 451], renderScale: 0.23684210526315788, ground: [3.18, 1.89] },
  southeast: { file: "chair-southeast.webp", size: [402, 442], anchor: [193, 440], renderScale: 0.24193548387096775, ground: [2.64, 2.91] },
  southwest: { file: "chair-southwest.webp", size: [355, 453], anchor: [117, 451], renderScale: 0.23684210526315788, ground: [0.90, 3.06] },
} as const satisfies Readonly<Record<string, SpriteSpec>>;

/** A whole sprite, or a native-pixel clip of it, at an explicit layer. */
function piece(id: string, spec: SpriteSpec, depthKey: number, clip?: readonly [x: number, y: number, width: number, height: number]): ApprovedRoomDrawRecord {
  const scale = spec.renderScale / TILE;
  const left = spec.ground[0] - spec.anchor[0] * scale;
  const top = spec.ground[1] - spec.anchor[1] * scale;
  const [cx, cy, cw, ch] = clip ?? [0, 0, spec.size[0], spec.size[1]];
  return {
    id,
    assetId: `level3:radiology-reading:${spec.file}`,
    sourceRect: [cx, cy, cw, ch],
    renderSizeTiles: [cw * scale, ch * scale],
    destinationTopLeftTiles: [left + cx * scale, top + cy * scale],
    canvasTransform: [1, 0, 0, 1, 0, 0],
    sourceFloorContact: [spec.anchor[0], spec.anchor[1]],
    attachments: {},
    doorOwners: [],
    backedOwners: [],
    depthKey,
    depthPolicy: "authored-layer",
  };
}

export const APPROVED_READING_ROOM_DRAW_RECORDS: readonly ApprovedRoomDrawRecord[] = [
  // The proof never shows the north-west chair below row 340 (hidden by its desk).
  piece("chairNorthwest", CHAIRS.northwest, 1.55, [0, 0, 412, 340]),
  piece("chairNortheast", CHAIRS.northeast, 1.55),
  piece("chairSoutheast", CHAIRS.southeast, 1.55),
  piece("chairSouthwest", CHAIRS.southwest, 1.55),
  piece("island", ISLAND, 1.60),
  piece("islandNorthwestDeskFront", ISLAND, 1.70, [0, 235, 500, 996 - 235]),
  piece("islandSoutheastDividerFront", ISLAND, 1.80, [574, 355, 438, 79]),
  piece("islandSouthwestDeskFront", ISLAND, 2.45, [200, 370, 320, 996 - 370]),
  piece("chairSoutheastFront", CHAIRS.southeast, 2.95, [0, 0, 402, 278]),
];

/** Painter grounds that slot each seated reader into the proof's layer order. */
export const APPROVED_READING_ROOM_READER_PAINTER_GROUNDS = {
  northwest: 1.65, northeast: 1.75, southwest: 2.40, southeast: 2.90,
} as const;
