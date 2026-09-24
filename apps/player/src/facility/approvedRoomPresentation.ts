import type { RoomOrientation } from "@gamify-surgery/game-domain";
import proofDataJson from "./approvedRoomProofData.json";

export type ApprovedRoomCollision = "solid" | "nonblocking" | "none";
export type ApprovedRoomDepth = "wall" | "rear-floor" | "actor-seat" | "floor" | "front";
export type ApprovedWallSegment = `N${number}` | `S${number}` | `W${string}` | `E${string}`;

export interface ApprovedRoomAsset {
  id: string;
  relativePath: string;
}

export interface ApprovedFixturePresentation {
  id: string;
  assetId?: string;
  frameIds?: readonly string[];
  quantity?: number;
  collision: ApprovedRoomCollision;
  depth: ApprovedRoomDepth;
  contacts: readonly (readonly [number, number])[];
  footprint?: readonly [left: number, top: number, width: number, height: number];
  navigationFootprint?: readonly [left: number, top: number, width: number, height: number];
  approach?: readonly [number, number];
  seat?: readonly [number, number];
  doorOwners?: readonly ApprovedWallSegment[];
  backedOwners?: readonly ApprovedWallSegment[];
  variants?: readonly string[];
}

export interface ApprovedRoomShellPresentation {
  tilePixels: number;
  rearWallHeightPixels: number;
  lowNorthHeightPixels: number;
  sideCapWidthPixels: number;
  southHeightPixels: number;
  floorPattern: string;
  floorPatternKind: "square-tile" | "terrazzo" | "vinyl" | "carpet" | "hallway-phase";
  floorPatternSizePixels: number;
  floorPatternSeed: number;
  floorAlgorithm: "front-desk-square" | "examination-tile" | "hallway-phase" | "waiting-carpet" | "bathroom-tile" | "minor-vinyl" | "ultrasound-vinyl" | "xray-vinyl" | "ct-vinyl" | "phlebotomy-terrazzo" | "evs-utility-tile" | "endoscopy-slate" | "recovery-terrazzo" | "training-terrazzo" | "coffee-terrazzo" | "telehealth-terrazzo";
  floorPalette: readonly string[];
  floorGrout: string;
  floorAccent: string;
  floorBase: string;
  background: string;
  rearWall: string;
  baseTrim: string;
  edgeTrim: string;
  doorJamb: string;
  doorInsetPixels: number;
}

export type ApprovedProceduralStyle =
  | Readonly<{
      kind: "ct-observation-partition";
      body: "#38524a";
      topHighlight: "#7c9680";
      topDark: "#294632";
      highlightHeightPixels: 4;
      darkHeightPixels: 3;
      windowTopFraction: .39;
      windowHeightFraction: .25;
      windowOuter: "#8ca8ae";
      windowInner: "#45616a";
      windowOuterHorizontalBleedPixels: 2;
      windowInnerHorizontalBleedPixels: 1;
      windowInnerVerticalInsetPixels: 3;
    }>
  | Readonly<{
      kind: "recovery-top-cap" | "recovery-short-face";
      dark: "#294632";
      light: "#789173";
      face: "#58735a";
      faceHeightPixels: 29;
      darkHeightPixels: 7;
      lightHeightPixels: 3;
    }>;

export interface ApprovedProceduralDrawRecord {
  readonly id: string;
  readonly rect: Readonly<{ left: number; top: number; width: number; height: number }>;
  readonly side?: "N" | "S" | "W" | "E";
  readonly doorOwners: readonly ApprovedWallSegment[];
  readonly backedOwners: readonly ApprovedWallSegment[];
  readonly style: ApprovedProceduralStyle;
  readonly drawPhase: "before-bitmaps" | "after-scanner-before-console" | "depth-sorted";
  readonly depthKey: number;
}

export interface ApprovedRoomOrientationPresentation {
  runtimeOrientation: RoomOrientation;
  proofView: string;
  footprint: readonly [number, number];
  /** Proofs rotate counter-clockwise in screen coordinates. Runtime 270 is the matching domain orientation. */
  proofTransform?: "(x,y)->(y,W-x)";
}

export interface ApprovedRoomPresentation {
  proofId: string;
  roomDefinitionId: string;
  proofPath: string;
  assets: readonly ApprovedRoomAsset[];
  orientations: readonly ApprovedRoomOrientationPresentation[];
  shell: ApprovedRoomShellPresentation;
  fixtures: readonly ApprovedFixturePresentation[];
  migration?: "legacy-90-to-270" | "recovery-4x3-to-6x6-relocate-and-reconnect";
  variantPolicy?: Readonly<{
    occupiedCoveredWhen: "active-in-service-or-legacy-frozen-care-interval";
    hideIndividualPatient: true;
    preserveGlobalActorScale: true;
  }>;
}

export interface ApprovedRoomDrawRecord {
  readonly id: string;
  readonly assetId: string;
  readonly sourceRect: readonly [x: number, y: number, width: number, height: number];
  readonly renderSizeTiles: readonly [width: number, height: number];
  readonly destinationTopLeftTiles: readonly [x: number, y: number];
  readonly canvasTransform: readonly [number, number, number, number, number, number];
  readonly sourceFloorContact?: readonly [number, number];
  readonly worldLocalGround?: readonly [number, number];
  readonly footprint?: Readonly<{ left: number; top: number; width: number; height: number }>;
  readonly approach?: Readonly<{ x: number; y: number }>;
  readonly seat?: unknown;
  /** Exact proof attachment pixels; renderer converts these without changing global actor scale. */
  readonly attachments: Readonly<Record<string, unknown>>;
  readonly doorOwners: readonly ApprovedWallSegment[];
  readonly backedOwners: readonly ApprovedWallSegment[];
  /** Stable painter ordering from the exact proof destination envelope. */
  readonly depthKey: number;
  readonly depthPolicy: "ground-contact" | "wall" | "authored-layer";
}

export interface ApprovedActorSupport {
  readonly id: string;
  readonly seat: Readonly<{ x: number; y: number }>;
  readonly ground: Readonly<{ x: number; y: number }>;
}

export type ApprovedRoomStateVariant = "emptyWater" | "visitorEdHidden" | "occupiedCovered";

export interface ApprovedRoomProofCapture {
  readonly state: string;
  readonly canvasId: string;
  readonly dataset: Readonly<Record<string, unknown>>;
  readonly drawImages: readonly Readonly<{
    canvas: string;
    src: Readonly<{ width: number; height: number; sha256?: string; assetId?: string }>;
    transform: readonly [number, number, number, number, number, number];
    args: readonly number[];
  }>[];
  readonly coordinateSpace: Readonly<{ floorOriginPixels: readonly [number, number]; tilePixels: number }>;
  readonly variants?: Readonly<Record<string, Readonly<{
    dataset?: Readonly<Record<string, unknown>>;
    drawImages: readonly Readonly<{
      canvas: string;
      src: Readonly<{ width: number; height: number; sha256?: string; assetId?: string }>;
      transform: readonly [number, number, number, number, number, number];
      args: readonly number[];
    }>[];
  }>>>;
}

const asset = (id: string, file: string): ApprovedRoomAsset => ({
  id: `gs015:${id}`,
  relativePath: `art/rooms/gs015-v1/${file}`,
});

const clinicalShell = (
  floorPattern: string,
  floorBase = "#efe7d1",
  rearWall = "#efe1bd",
  floorPatternSizePixels = 24,
): ApprovedRoomShellPresentation => ({
  tilePixels: 120,
  rearWallHeightPixels: 90,
  lowNorthHeightPixels: 29,
  sideCapWidthPixels: 14,
  southHeightPixels: 29,
  floorPattern,
  floorPatternKind: floorPattern.includes("carpet") ? "carpet" : floorPattern.includes("vinyl") ? "vinyl" : floorPattern.includes("square") ? "square-tile" : floorPattern.includes("hallway") ? "hallway-phase" : "terrazzo",
  floorPatternSizePixels,
  floorPatternSeed: 17,
  floorAlgorithm: "phlebotomy-terrazzo",
  floorPalette: [floorBase],
  floorGrout: "rgba(122,108,94,.14)",
  floorAccent: "rgba(181,111,126,.13)",
  floorBase,
  background: "#f3ead3",
  rearWall,
  baseTrim: "#58735a",
  edgeTrim: "#294632",
  doorJamb: "#744a29",
  doorInsetPixels: 12,
});

const fixed = (proofView: string, width: number, height: number): readonly ApprovedRoomOrientationPresentation[] => [
  { runtimeOrientation: 0, proofView, footprint: [width, height] },
];
const rotated = (base: string, rotatedView: string, width: number, height: number): readonly ApprovedRoomOrientationPresentation[] => [
  { runtimeOrientation: 0, proofView: base, footprint: [width, height] },
  { runtimeOrientation: 270, proofView: rotatedView, footprint: [height, width], proofTransform: "(x,y)->(y,W-x)" },
];

export const APPROVED_ROOM_PRESENTATIONS = [
  {
    proofId: "front-desk", roomDefinitionId: "room.front_desk", proofPath: "tools/room-design/front-desk-layout/front-desk-layout.html",
    assets: [asset("front-desk:furniture", "front-desk/furniture.webp"), asset("front-desk:counter", "front-desk/counter.webp"), asset("front-desk:props", "front-desk/props.webp"), asset("front-desk:upkeep", "front-desk/upkeep.webp")],
    orientations: fixed("north-up", 5, 4),
    shell: { ...clinicalShell("large square cream commercial tile", "#ead9b5", "#efe1bd", 44), tilePixels: 88, rearWallHeightPixels: 80, floorAlgorithm: "front-desk-square", floorPalette: ["#ead9b5", "#e8d7b3", "#ecdbb8", "#e7d5b1"], floorGrout: "rgba(105,78,48,.18)", floorAccent: "rgba(255,249,226,.035)", doorInsetPixels: 10 },
    fixtures: [
      { id: "counter", assetId: "gs015:front-desk:counter", collision: "solid", depth: "front", contacts: [[2, 2.75]], footprint: [1, 2, 2, .75] },
      { id: "receptionist-chair", assetId: "gs015:front-desk:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.5, 2]], seat: [1.5, 1.82] },
      { id: "visitor-chair", assetId: "gs015:front-desk:furniture", collision: "solid", depth: "actor-seat", contacts: [[4.5, 4]], seat: [4.5, 3.72] },
      { id: "cabinet", assetId: "gs015:front-desk:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[.5, .9]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "water-cooler", assetId: "gs015:front-desk:props", collision: "nonblocking", depth: "rear-floor", contacts: [[4.2, .8]] },
      { id: "optional-decor", assetId: "gs015:front-desk:props", collision: "none", depth: "wall", contacts: [[2, 0]], doorOwners: ["N2", "N3", "N4", "WC"], backedOwners: ["N2", "N3", "N4"] },
    ],
  },
  {
    proofId: "examination", roomDefinitionId: "room.examination", proofPath: "tools/room-design/examination-layout/examination-layout.html",
    assets: [asset("examination:furniture", "examination/furniture.webp"), asset("examination:bed-south", "examination/bed-south.webp"), asset("examination:bed-west", "examination/bed-west.webp"), asset("examination:props", "examination/props.webp"), asset("examination:sink-west", "examination/sink-west.webp")],
    orientations: rotated("south", "west", 3, 2), migration: "legacy-90-to-270",
    shell: { ...clinicalShell("small warm clinical terrazzo", "#cbd5ce", "#d5e2e6", 30), floorAlgorithm: "examination-tile", floorPalette: ["#cbd5ce", "#c7d2cc", "#d0d9d3", "#c5d0ca"], floorGrout: "rgba(61,78,72,.13)", floorAccent: "rgba(61,86,79,.05)" },
    fixtures: [
      { id: "exam-table", assetId: "gs015:examination:bed-south", frameIds: ["south", "west"], collision: "solid", depth: "actor-seat", contacts: [[2.25, 1.75]], footprint: [1.3, .65, 1.55, .7], navigationFootprint: [1.09, .44, 1.97, 1.12], approach: [1.2, 1.55], seat: [2.25, 1.43] },
      { id: "stool", assetId: "gs015:examination:furniture", collision: "nonblocking", depth: "actor-seat", contacts: [[.75, 1.75]], seat: [.75, 1.43] },
      { id: "sink", assetId: "gs015:examination:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[.5, .5]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "wall-props", assetId: "gs015:examination:props", collision: "nonblocking", depth: "wall", contacts: [[2.5, 0]], doorOwners: ["N3"], backedOwners: ["N3"] },
    ],
  },
  {
    proofId: "hallway", roomDefinitionId: "room.hallway", proofPath: "tools/room-design/hallway-layout/hallway-layout.html", assets: [],
    orientations: fixed("cardinal topology", 1, 1), shell: { ...clinicalShell("continuous hallway plank/tile phase", "#d8d1bf", "#ddd5c8", 30), floorAlgorithm: "hallway-phase", floorPalette: ["#d8d1bf", "#ddd7c7", "#d2cbbb"], floorGrout: "rgba(82,78,68,.13)", floorAccent: "rgba(117,111,99,.13)", background: "#f2ead7" }, fixtures: [],
  },
  {
    proofId: "waiting", roomDefinitionId: "room.waiting", proofPath: "tools/room-design/waiting-layout/waiting-layout.html",
    assets: [asset("waiting:south", "waiting/south.webp"), asset("waiting:west", "waiting/west.webp")],
    orientations: rotated("south", "west", 4, 3), migration: "legacy-90-to-270", shell: { ...clinicalShell("warm waiting-room carpet", "#baa88e", "#e9c7b4", 3), floorAlgorithm: "waiting-carpet", floorPalette: ["#baa88e"], floorGrout: "rgba(0,0,0,0)", floorAccent: "rgba(91,70,49,.07)" },
    fixtures: [
      { id: "bench", assetId: "gs015:waiting:south", collision: "solid", depth: "actor-seat", contacts: [[2, .95]], footprint: [1.05, .55, 1.9, .4], approach: [2, 1.2], seat: [1.55, .88] },
      { id: "chairs", assetId: "gs015:waiting:south", quantity: 2, collision: "solid", depth: "actor-seat", contacts: [[.7, 1.95], [3.3, 1.95]] },
      { id: "magazine-table", assetId: "gs015:waiting:south", collision: "solid", depth: "floor", contacts: [[2, 2.08]], footprint: [1.35, 1.48, 1.3, .6] },
      { id: "magazine-rack", assetId: "gs015:waiting:south", collision: "none", depth: "wall", contacts: [[.36, 0]], doorOwners: ["N1"], backedOwners: ["N1"] },
      { id: "plant", assetId: "gs015:waiting:south", collision: "none", depth: "rear-floor", contacts: [[3.63, .72]], doorOwners: ["N4", "EA"] },
    ],
  },
  {
    proofId: "bathroom", roomDefinitionId: "room.bathroom", proofPath: "tools/room-design/bathroom-layout/bathroom-layout.html",
    assets: [asset("bathroom:furniture", "bathroom/furniture.webp")], orientations: fixed("north-up", 2, 2), shell: { ...clinicalShell("small ivory bathroom tile", "#ddd9c7", "#c6dfd7", 30), floorAlgorithm: "bathroom-tile", floorPalette: ["#ddd9c7", "#d6dcc9", "#e4dfcb"], floorGrout: "rgba(92,91,73,.16)", floorAccent: "rgba(93,111,82,.08)" },
    fixtures: [
      { id: "sink", assetId: "gs015:bathroom:furniture", collision: "solid", depth: "front", contacts: [[.55, .84]], footprint: [.36, .46, .38, .38], approach: [.55, 1.12] },
      { id: "toilet", assetId: "gs015:bathroom:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.43, 1.08]], footprint: [1.22, .46, .42, .62], approach: [1.43, 1.4], seat: [1.43, .64] },
      { id: "mirror", assetId: "gs015:bathroom:furniture", collision: "nonblocking", depth: "wall", contacts: [[.55, 0]], doorOwners: ["N1"], backedOwners: ["N1"] },
    ],
  },
  {
    proofId: "minor-procedure", roomDefinitionId: "room.minor_procedure", proofPath: "tools/room-design/minor-procedure-layout/minor-procedure-layout.html",
    assets: [asset("minor-procedure:furniture", "minor-procedure/furniture.webp")], orientations: fixed("north-up", 3, 3), shell: { ...clinicalShell("warm clinical vinyl", "#ccd4d2", "#d6c9df", 8), floorAlgorithm: "minor-vinyl", floorPalette: ["#ccd4d2"], floorGrout: "rgba(0,0,0,0)", floorAccent: "rgba(74,96,102,.08)" },
    fixtures: [
      { id: "table", assetId: "gs015:minor-procedure:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.5, 1.95]], footprint: [1.15, .55, .7, 1.4], approach: [1.5, 2.2], seat: [1.5, 1.55] },
      { id: "stool", assetId: "gs015:minor-procedure:furniture", collision: "nonblocking", depth: "actor-seat", contacts: [[1.5, 2.75]], seat: [1.5, 2.35] },
      { id: "sink", assetId: "gs015:minor-procedure:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[.39, .34]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "cabinet", assetId: "gs015:minor-procedure:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[2.6, .38]], doorOwners: ["N3", "EA"], backedOwners: ["N3"] },
      { id: "trolley", assetId: "gs015:minor-procedure:furniture", collision: "nonblocking", depth: "floor", contacts: [[.43, 2.72]], doorOwners: ["S1", "WC"] },
      { id: "wall-light", assetId: "gs015:minor-procedure:furniture", collision: "nonblocking", depth: "wall", contacts: [[1.5, 0]], doorOwners: ["N2"], backedOwners: ["N2"] },
    ],
  },
  {
    proofId: "ultrasound", roomDefinitionId: "room.ultrasound", proofPath: "tools/room-design/ultrasound-layout/ultrasound-layout.html",
    assets: [asset("ultrasound:furniture", "ultrasound/furniture.webp")], orientations: fixed("north-up", 3, 3), shell: { ...clinicalShell("warm ultrasound vinyl", "#d8d5ca", "#bfd5e8", 30), floorAlgorithm: "ultrasound-vinyl", floorPalette: ["#d8d5ca"], floorGrout: "rgba(105,125,103,.24)", floorAccent: "rgba(92,106,96,.06)" },
    fixtures: [
      { id: "table", assetId: "gs015:ultrasound:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.5, 1.75]], footprint: [.6, 1.1, 1.8, .65], approach: [2.2, 2.2], seat: [2.2, 1.75] },
      { id: "stool", assetId: "gs015:ultrasound:furniture", collision: "nonblocking", depth: "actor-seat", contacts: [[2.2, 2.75]], seat: [2.2, 2.55] },
      { id: "console", assetId: "gs015:ultrasound:furniture", collision: "nonblocking", depth: "floor", contacts: [[.8, 2.33]], approach: [.8, 2.84] },
      { id: "cabinet", assetId: "gs015:ultrasound:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[.39, .38]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "wall-print", assetId: "gs015:ultrasound:furniture", collision: "nonblocking", depth: "wall", contacts: [[1.5, 0]], doorOwners: ["N2"], backedOwners: ["N2"] },
    ],
  },
  {
    proofId: "xray", roomDefinitionId: "room.xray", proofPath: "tools/room-design/xray-layout/xray-layout.html",
    assets: [asset("xray:furniture", "xray/furniture.webp")], orientations: fixed("north-up", 3, 3), shell: { ...clinicalShell("cool imaging vinyl", "#d5d1c9", "#bec8d6", 7), floorAlgorithm: "xray-vinyl", floorPalette: ["#d5d1c9"], floorGrout: "rgba(0,0,0,0)", floorAccent: "rgba(83,94,91,.055)" },
    fixtures: [
      { id: "detector", assetId: "gs015:xray:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.5, 1.85]], footprint: [1.225, 1.5, .55, .35], approach: [1.5, 2.25] },
      { id: "tube", assetId: "gs015:xray:furniture", collision: "nonblocking", depth: "floor", contacts: [[.65, 2.6]] },
      { id: "console", assetId: "gs015:xray:furniture", collision: "nonblocking", depth: "floor", contacts: [[2.45, 1.75]], footprint: [2.15, 1.45, .6, .3], approach: [2.45, 2.35] },
      { id: "apron", assetId: "gs015:xray:furniture", collision: "nonblocking", depth: "wall", contacts: [[.5, 0]], doorOwners: ["N1"], backedOwners: ["N1"] },
    ],
  },
  {
    proofId: "ct", roomDefinitionId: "room.ct", proofPath: "tools/room-design/ct-layout/ct-layout.html",
    assets: [asset("ct:furniture", "ct/furniture.webp"), asset("ct:wall-art", "ct/wall-art.webp")], orientations: fixed("north-up", 4, 4), shell: { ...clinicalShell("cool CT vinyl", "#d7d1cc", "#dacbd5", 24), floorAlgorithm: "ct-vinyl", floorPalette: ["#d7d1cc"], floorGrout: "rgba(82,91,88,.10)", floorAccent: "rgba(73,82,82,.045)" },
    fixtures: [
      { id: "scanner", assetId: "gs015:ct:furniture", collision: "solid", depth: "actor-seat", contacts: [[1.4, 2.65]], footprint: [.5, 1, 1.8, 1.65], approach: [1.4, 3.1], seat: [1.4, 2.18] },
      { id: "partition", collision: "solid", depth: "front", contacts: [[2.75, 3.15]], footprint: [2.69, .75, .12, 2.4] },
      { id: "console", assetId: "gs015:ct:furniture", collision: "nonblocking", depth: "floor", contacts: [[3.35, 2.1]], footprint: [2.9, 1.72, .9, .38], approach: [3.35, 2.7] },
      { id: "cat-scans", assetId: "gs015:ct:wall-art", quantity: 4, collision: "nonblocking", depth: "wall", contacts: [[.5, 0], [1.5, 0], [2.5, 0], [3.5, 0]], doorOwners: ["N1", "N2", "N3", "N4"], backedOwners: ["N1", "N2", "N3", "N4"] },
    ],
  },
  {
    proofId: "phlebotomy", roomDefinitionId: "room.phlebotomy", proofPath: "tools/room-design/phlebotomy-layout/phlebotomy-layout.html",
    assets: [asset("phlebotomy:south", "phlebotomy/south.webp"), asset("phlebotomy:east", "phlebotomy/east.webp"), asset("phlebotomy:window", "phlebotomy/window.webp")],
    orientations: rotated("south", "east", 3, 2), migration: "legacy-90-to-270", shell: { ...clinicalShell("24px ivory/rose terrazzo tiles", "#eee7da", "#e2c3ca"), floorAlgorithm: "phlebotomy-terrazzo", floorPalette: ["#eee7da"], floorGrout: "rgba(122,108,94,.14)", floorAccent: "rgba(181,111,126,.13)" },
    fixtures: [
      { id: "chair", assetId: "gs015:phlebotomy:south", collision: "solid", depth: "actor-seat", contacts: [[1.5, .98]], footprint: [1.05, .5, .9, .48], approach: [1.5, 1.32], seat: [1.5, .65] },
      { id: "stool", assetId: "gs015:phlebotomy:south", collision: "nonblocking", depth: "actor-seat", contacts: [[1.5, 1.7]], seat: [1.5, 1.44] },
      { id: "sink", assetId: "gs015:phlebotomy:south", collision: "nonblocking", depth: "rear-floor", contacts: [[.43, .3]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "windows", assetId: "gs015:phlebotomy:window", quantity: 2, collision: "none", depth: "wall", contacts: [[1.5, 0], [2.5, 0]], doorOwners: ["N2", "N3"], backedOwners: ["N2", "N3"] },
    ],
  },
  {
    proofId: "evs", roomDefinitionId: "room.evs_closet", proofPath: "tools/room-design/evs-layout/evs-layout.html",
    assets: [asset("evs:furniture", "evs/furniture.webp")], orientations: fixed("north-up", 2, 2), shell: { ...clinicalShell("24px dark sage/stone utility tiles", "#85877a", "#5f6854"), floorAlgorithm: "evs-utility-tile", floorPalette: ["#85877a"], floorGrout: "rgba(39,48,41,.25)", floorAccent: "rgba(182,169,135,.14)", background: "#eee9d8" },
    fixtures: [
      { id: "shelves", assetId: "gs015:evs:furniture", quantity: 2, collision: "nonblocking", depth: "rear-floor", contacts: [[.5, .35], [1.5, .35]], doorOwners: ["N1", "N2"], backedOwners: ["N1", "N2"] },
      { id: "clutter", assetId: "gs015:evs:furniture", quantity: 2, collision: "nonblocking", depth: "front", contacts: [[.4, 1.87], [1.6, 1.87]], doorOwners: ["WB", "S1", "EB", "S2"] },
      { id: "bucket", assetId: "gs015:evs:furniture", collision: "nonblocking", depth: "floor", contacts: [[1.25, 1.15]] },
    ],
  },
  {
    proofId: "endoscopy", roomDefinitionId: "room.endoscopy", proofPath: "tools/room-design/endoscopy-layout/endoscopy-layout.html",
    assets: [asset("endoscopy:south", "endoscopy/south.webp"), asset("endoscopy:east", "endoscopy/east.webp")],
    orientations: rotated("south", "east", 4, 3), migration: "legacy-90-to-270", shell: { ...clinicalShell("24px dark utility slate with warm speckles", "#778087", "#536168"), floorAlgorithm: "endoscopy-slate", floorPalette: ["#778087"], floorGrout: "rgba(45,55,59,.20)", floorAccent: "rgba(216,175,158,.18)", background: "#e7dfc7" },
    variantPolicy: { occupiedCoveredWhen: "active-in-service-or-legacy-frozen-care-interval", hideIndividualPatient: true, preserveGlobalActorScale: true },
    fixtures: [
      { id: "procedure-table", assetId: "gs015:endoscopy:south", collision: "solid", depth: "actor-seat", contacts: [[1.5, 1.95]], footprint: [.95, .35, 1, 1.6], approach: [1.5, 2.3], variants: ["empty", "occupiedCovered"] },
      { id: "tower", assetId: "gs015:endoscopy:south", collision: "nonblocking", depth: "floor", contacts: [[2.9, .85]] },
      { id: "prep-cabinet", assetId: "gs015:endoscopy:south", collision: "nonblocking", depth: "rear-floor", contacts: [[.5, .3]], footprint: [.05, .05, .9, .25], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "sink", assetId: "gs015:endoscopy:south", collision: "nonblocking", depth: "rear-floor", contacts: [[3.55, .3]], doorOwners: ["N4", "EA"], backedOwners: ["N4"] },
    ],
  },
  {
    proofId: "recovery", roomDefinitionId: "room.periop_recovery", proofPath: "tools/room-design/recovery-layout/recovery-layout.html",
    assets: [asset("recovery:furniture", "recovery/furniture.webp")], orientations: fixed("north-up", 6, 6), migration: "recovery-4x3-to-6x6-relocate-and-reconnect", shell: { ...clinicalShell("24px warm recovery terrazzo", "#d5d3c9", "#899b91"), floorAlgorithm: "recovery-terrazzo", floorPalette: ["#d5d3c9"], floorGrout: "rgba(111,113,105,.16)", floorAccent: "rgba(180,132,127,.18)", background: "#e7dfc7" },
    fixtures: [
      { id: "beds", assetId: "gs015:recovery:furniture", frameIds: ["bedN", "bedS", "bedW", "bedE"], quantity: 8, collision: "solid", depth: "actor-seat", contacts: [[2.25, 1.55], [3.75, 1.55], [2.25, 4.45], [3.75, 4.45], [1.55, 2.6], [1.55, 4.1], [4.45, 2.6], [4.45, 4.1]], doorOwners: ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"] },
      { id: "monitors", assetId: "gs015:recovery:furniture", frameIds: ["monitorN", "monitorS", "monitorW", "monitorE"], quantity: 8, collision: "nonblocking", depth: "floor", contacts: [[2.25, 1.55], [3.75, 1.55], [2.25, 4.45], [3.75, 4.45], [1.55, 2.6], [1.55, 4.1], [4.45, 2.6], [4.45, 4.1]], doorOwners: ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"] },
      { id: "partitions", quantity: 4, collision: "solid", depth: "front", contacts: [[3, 1.55], [3, 4.45], [1.55, 3], [4.45, 3]], doorOwners: ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"] },
      { id: "station", assetId: "gs015:recovery:furniture", collision: "solid", depth: "front", contacts: [[3, 3.65]], footprint: [2, 3, 2, .65] },
      { id: "stools", assetId: "gs015:recovery:furniture", quantity: 2, collision: "nonblocking", depth: "actor-seat", contacts: [[2.5, 2.2], [3.5, 2.2]] },
      { id: "wall-art", assetId: "gs015:recovery:furniture", quantity: 8, collision: "none", depth: "wall", contacts: [[.5, 0], [2.25, 0], [3.75, 0], [5.5, 0]], doorOwners: ["N1", "N3", "N4", "N6"], backedOwners: ["N1", "N3", "N4", "N6"] },
    ],
  },
  {
    proofId: "training", roomDefinitionId: "room.training", proofPath: "tools/room-design/training-layout/training-layout.html",
    assets: [asset("training:furniture", "training/furniture.webp")], orientations: fixed("north-up", 3, 3), shell: { ...clinicalShell("warm training terrazzo", "#d8c8aa", "#c88f76"), floorAlgorithm: "training-terrazzo", floorPalette: ["#d8c8aa"], floorGrout: "rgba(119,91,66,.14)", floorAccent: "rgba(170,98,79,.18)", background: "#e7dfc7" },
    fixtures: [
      { id: "bench", assetId: "gs015:training:furniture", collision: "solid", depth: "front", contacts: [[1.5, 1.45]], footprint: [.65, .85, 1.7, .6], approach: [1.5, 1.63] },
      { id: "stools", assetId: "gs015:training:furniture", quantity: 2, collision: "nonblocking", depth: "actor-seat", contacts: [[1.05, 1.7], [1.95, 1.7]], seat: [1.05, 1.45] },
      { id: "cabinet-anatomy", assetId: "gs015:training:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[.25, .5]], doorOwners: ["N1", "WA"], backedOwners: ["N1"] },
      { id: "whiteboard", assetId: "gs015:training:furniture", collision: "none", depth: "wall", contacts: [[1.5, 0]], doorOwners: ["N2"], backedOwners: ["N2"] },
      { id: "skeleton", assetId: "gs015:training:furniture", collision: "nonblocking", depth: "rear-floor", contacts: [[2.73, .55]], doorOwners: ["N3", "EA"], backedOwners: ["N3"] },
    ],
  },
  {
    proofId: "coffee", roomDefinitionId: "room.coffee_kiosk", proofPath: "tools/room-design/coffee-kiosk-layout/coffee-kiosk-layout.html",
    assets: [asset("coffee:furniture", "coffee/furniture.webp")], orientations: fixed("north-up", 2, 2), shell: { ...clinicalShell("warm kiosk terrazzo", "#d8bfa4", "#b77f72", 18), floorAlgorithm: "coffee-terrazzo", floorPalette: ["#d8bfa4"], floorGrout: "rgba(121,81,60,.12)", floorAccent: "rgba(118,77,57,.16)", background: "#e7dfc7" },
    fixtures: [
      { id: "island", assetId: "gs015:coffee:furniture", collision: "solid", depth: "front", contacts: [[1, 1.4]], footprint: [.5, .6, 1, .8], approach: [1, 1.62] },
      { id: "prints", assetId: "gs015:coffee:furniture", quantity: 2, collision: "none", depth: "wall", contacts: [[.5, 0], [1.5, 0]], doorOwners: ["N1", "N2"], backedOwners: ["N1", "N2"] },
    ],
  },
  {
    proofId: "telehealth", roomDefinitionId: "room.glp1_telehealth_suite", proofPath: "tools/room-design/telehealth-layout/telehealth-layout.html",
    assets: [asset("telehealth:furniture", "telehealth/furniture.webp"), asset("telehealth:props", "telehealth/props.webp"), asset("telehealth:window", "telehealth/window.webp")],
    orientations: rotated("south", "west", 3, 2), migration: "legacy-90-to-270", shell: { ...clinicalShell("20px lavender-warm terrazzo", "#d7d0c5", "#9d9bc5", 20), floorAlgorithm: "telehealth-terrazzo", floorPalette: ["#d7d0c5"], floorGrout: "rgba(112,96,88,.12)", floorAccent: "rgba(143,122,165,.10)", background: "#ebe5dc" },
    fixtures: [
      { id: "station", assetId: "gs015:telehealth:furniture", collision: "solid", depth: "front", contacts: [[1.5, 1.5]], footprint: [1, .5, 1, 1] },
      { id: "chairs", assetId: "gs015:telehealth:props", quantity: 2, collision: "nonblocking", depth: "actor-seat", contacts: [[.65, 1], [2.35, 1]], approach: [.5, 1.45] },
      { id: "plants", assetId: "gs015:telehealth:props", quantity: 2, collision: "none", depth: "rear-floor", contacts: [[.25, .33], [2.75, .33]], doorOwners: ["N1", "WA", "N3", "EA"], backedOwners: ["N1", "N3"] },
      { id: "windows", assetId: "gs015:telehealth:window", quantity: 3, collision: "none", depth: "wall", contacts: [[.5, 0], [1.5, 0], [2.5, 0]], doorOwners: ["N1", "N2", "N3"], backedOwners: ["N1", "N2", "N3"] },
    ],
  },
] as const satisfies readonly ApprovedRoomPresentation[];

const BY_DEFINITION = new Map<string, ApprovedRoomPresentation>(APPROVED_ROOM_PRESENTATIONS.map((room) => [room.roomDefinitionId, room]));

const CT_PARTITION_STYLE = {
  kind: "ct-observation-partition",
  body: "#38524a",
  topHighlight: "#7c9680",
  topDark: "#294632",
  highlightHeightPixels: 4,
  darkHeightPixels: 3,
  windowTopFraction: .39,
  windowHeightFraction: .25,
  windowOuter: "#8ca8ae",
  windowInner: "#45616a",
  windowOuterHorizontalBleedPixels: 2,
  windowInnerHorizontalBleedPixels: 1,
  windowInnerVerticalInsetPixels: 3,
} as const satisfies ApprovedProceduralStyle;

const recoveryPartitionStyle = (kind: "recovery-top-cap" | "recovery-short-face"): ApprovedProceduralStyle => ({
  kind,
  dark: "#294632",
  light: "#789173",
  face: "#58735a",
  faceHeightPixels: 29,
  darkHeightPixels: 7,
  lightHeightPixels: 3,
});

const APPROVED_PROCEDURAL_DRAWS: Readonly<Record<string, readonly ApprovedProceduralDrawRecord[]>> = {
  "room.ct": [{
    id: "partition",
    rect: { left: 2.69, top: .75, width: .12, height: 2.4 },
    doorOwners: [],
    backedOwners: [],
    style: CT_PARTITION_STYLE,
    drawPhase: "after-scanner-before-console",
    depthKey: 3.15,
  }],
  "room.periop_recovery": [
    { id: "partitionN", side: "N", rect: { left: 2.95, top: 0, width: .10, height: 1.55 }, doorOwners: ["N3", "N4"], backedOwners: [], style: recoveryPartitionStyle("recovery-top-cap"), drawPhase: "before-bitmaps", depthKey: 1.55 },
    { id: "partitionS", side: "S", rect: { left: 2.95, top: 4.45, width: .10, height: 1.55 }, doorOwners: ["S3", "S4"], backedOwners: [], style: recoveryPartitionStyle("recovery-top-cap"), drawPhase: "before-bitmaps", depthKey: 6 },
    { id: "partitionW", side: "W", rect: { left: 0, top: 2.95, width: 1.55, height: .10 }, doorOwners: ["WC", "WD"], backedOwners: [], style: recoveryPartitionStyle("recovery-short-face"), drawPhase: "depth-sorted", depthKey: 3 },
    { id: "partitionE", side: "E", rect: { left: 4.45, top: 2.95, width: 1.55, height: .10 }, doorOwners: ["EC", "ED"], backedOwners: [], style: recoveryPartitionStyle("recovery-short-face"), drawPhase: "depth-sorted", depthKey: 3 },
  ],
};

export function getApprovedRoomPresentation(definitionId: string): ApprovedRoomPresentation | undefined {
  return BY_DEFINITION.get(definitionId);
}

export function getApprovedRoomOrientation(
  definitionId: string,
  orientation: RoomOrientation,
): ApprovedRoomOrientationPresentation | undefined {
  return getApprovedRoomPresentation(definitionId)?.orientations.find((candidate) => candidate.runtimeOrientation === orientation);
}

/** Exact proof-authored non-bitmap fixtures. Rects and depth are room-local tile units. */
export function resolveApprovedRoomProceduralDrawRecords(
  definitionId: string,
  orientation: RoomOrientation,
): readonly ApprovedProceduralDrawRecord[] {
  if (orientation !== 0) return [];
  return APPROVED_PROCEDURAL_DRAWS[definitionId] ?? [];
}

export function isApprovedProceduralDrawVisible(
  draw: ApprovedProceduralDrawRecord,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
): boolean {
  return !draw.doorOwners.some((owner) => openDoorSegments.has(owner)) &&
    !draw.backedOwners.some((owner) => backedNorthSegments.has(owner));
}

export function isApprovedFixtureVisible(
  fixture: ApprovedFixturePresentation,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
): boolean {
  return !(fixture.doorOwners?.some((owner) => openDoorSegments.has(owner)) ?? false) &&
    !(fixture.backedOwners?.some((owner) => backedNorthSegments.has(owner)) ?? false);
}

export function isApprovedDrawVisible(
  draw: ApprovedRoomDrawRecord,
  openDoorSegments: ReadonlySet<string>,
  backedNorthSegments: ReadonlySet<string>,
): boolean {
  return !draw.doorOwners.some((owner) => openDoorSegments.has(owner)) &&
    !draw.backedOwners.some((owner) => backedNorthSegments.has(owner));
}

type JsonObject = Record<string, unknown>;

const PROOF_DATA_KEYS: Readonly<Record<string, string>> = {
  "front-desk": "frontDesk", examination: "examination", hallway: "hallway", waiting: "waiting",
  bathroom: "bathroom", "minor-procedure": "minorProcedure", ultrasound: "ultrasound", xray: "xray",
  ct: "ct", phlebotomy: "phlebotomy", evs: "evs", endoscopy: "endoscopy", recovery: "recovery",
  training: "training", coffee: "coffee", telehealth: "telehealth",
};

const isObject = (value: unknown): value is JsonObject => typeof value === "object" && value !== null && !Array.isArray(value);
const point = (value: unknown): Readonly<{ x: number; y: number }> | undefined => {
  if (!isObject(value) || typeof value.x !== "number" || typeof value.y !== "number") return undefined;
  return { x: value.x, y: value.y };
};
const rect = (value: unknown): Readonly<{ left: number; top: number; width: number; height: number }> | undefined => {
  if (!isObject(value) || typeof value.left !== "number" || typeof value.top !== "number" || typeof value.width !== "number" || typeof value.height !== "number") return undefined;
  return { left: value.left, top: value.top, width: value.width, height: value.height };
};
const segments = (value: unknown): ApprovedWallSegment[] => Array.isArray(value)
  ? value.filter((item): item is ApprovedWallSegment => typeof item === "string" && /^[NSWE]/.test(item))
  : typeof value === "string" && /^[NSWE]/.test(value) ? [value as ApprovedWallSegment] : [];

/** Exact, generated proof capture. The HTML proof hash is stored beside every capture. */
export function getApprovedRoomProofCapture(
  definitionId: string,
  orientation: RoomOrientation,
): ApprovedRoomProofCapture | undefined {
  const room = getApprovedRoomPresentation(definitionId);
  if (!room) return undefined;
  const key = PROOF_DATA_KEYS[room.proofId];
  const rawRoom = key ? (proofDataJson.rooms as JsonObject)[key] : undefined;
  if (!isObject(rawRoom) || !Array.isArray(rawRoom.orientations)) return undefined;
  const orientationIndex = room.orientations.findIndex((candidate) => candidate.runtimeOrientation === orientation);
  return rawRoom.orientations[orientationIndex] as ApprovedRoomProofCapture | undefined;
}

function fixtureDefinitions(dataset: JsonObject): Map<string, JsonObject> {
  const model = isObject(dataset.model) ? dataset.model : undefined;
  const result = new Map<string, JsonObject>();
  const add = (id: string, value: unknown) => { if (isObject(value)) result.set(id, value); };
  const fixtureValue = model?.fixtures ?? dataset.fixtures;
  if (Array.isArray(fixtureValue)) {
    for (const value of fixtureValue) if (isObject(value) && typeof value.id === "string") add(value.id, value);
  } else if (isObject(fixtureValue)) {
    for (const [id, value] of Object.entries(fixtureValue)) add(id, value);
  }
  if (isObject(dataset.fixtures) && isObject(dataset.fixtures.contracts)) {
    for (const [id, value] of Object.entries(dataset.fixtures.contracts)) add(id, value);
  }
  if (isObject(model?.contracts)) for (const [id, value] of Object.entries(model.contracts)) add(id, value);
  if (isObject(model?.wallDecor)) for (const [id, value] of Object.entries(model.wallDecor)) add(id, value);
  if (isObject(model?.bays)) for (const [id, value] of Object.entries(model.bays)) add(id, value);
  if (isObject(model?.bench)) add("bench", model.bench);
  if (Array.isArray(model?.stools)) for (const value of model.stools) if (isObject(value) && typeof value.id === "string") add(value.id, value);
  if (Array.isArray(model?.plants)) model.plants.forEach((value, index) => {
    if (!isObject(value)) return;
    // flattenedDraws assigns these exact per-view array IDs. Keep the proof's
    // local owner/ground record attached to the corresponding bitmap instance.
    add(`plant${index + 1}`, value);
  });
  if (isObject(model?.island)) add("island", model.island);
  return result;
}

const seatPoints = (value: unknown): Readonly<{ x: number; y: number }>[] => {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((candidate) => {
    const direct = point(candidate);
    if (direct) return [direct];
    if (isObject(candidate)) {
      const floorProjection = point(candidate.floorProjection);
      if (floorProjection) return [floorProjection];
    }
    return [];
  });
};

/** Furniture support contacts for presentation-only actor attachment. */
export function resolveApprovedRoomActorSupports(
  definitionId: string,
  orientation: RoomOrientation,
): readonly ApprovedActorSupport[] {
  const records = resolveApprovedRoomDrawRecords(definitionId, orientation);
  const supports = records.flatMap((record) => seatPoints(record.seat).map((seat, index) => ({
    id: `${record.id}:seat-${index + 1}`,
    seat,
    ground: record.worldLocalGround ? { x: record.worldLocalGround[0], y: record.worldLocalGround[1] } : seat,
  })));
  if (supports.length > 0) return supports;
  const room = getApprovedRoomPresentation(definitionId);
  if (!room) return [];
  const baseWidth = room.orientations[0]?.footprint[0] ?? 0;
  const orientPoint = (value: readonly [number, number]) => orientation === 270
    ? { x: value[1], y: baseWidth - value[0] }
    : { x: value[0], y: value[1] };
  return room.fixtures.flatMap((fixture) => fixture.seat ? [{
    id: `${fixture.id}:seat-1`,
    seat: orientPoint(fixture.seat),
    ground: orientPoint(fixture.contacts[0]!),
  }] : []);
}

function flattenedDraws(dataset: JsonObject): Array<{ id: string; draw: JsonObject }> {
  const model = isObject(dataset.model) ? dataset.model : undefined;
  const output: Array<{ id: string; draw: JsonObject }> = [];
  const visit = (id: string, value: unknown) => {
    if (!isObject(value)) return;
    const width = typeof value.w === "number" ? value.w : value.width;
    const height = typeof value.h === "number" ? value.h : value.height;
    if (typeof value.x === "number" && typeof value.y === "number" && typeof width === "number" && typeof height === "number") {
      output.push({ id, draw: value });
      return;
    }
    for (const [childId, child] of Object.entries(value)) visit(id ? `${id}.${childId}` : childId, child);
  };
  visit("", model?.draws);
  visit("station", model?.stationDraw);
  if (Array.isArray(model?.chairs)) model.chairs.forEach((value, index) => visit(`chair${index + 1}`, value));
  if (Array.isArray(model?.plants)) model.plants.forEach((value, index) => visit(`plant${index + 1}`, isObject(value) ? value.draw : undefined));
  if (output.length === 0 && Array.isArray(dataset.fixtures)) for (const value of dataset.fixtures) if (isObject(value) && typeof value.id === "string") visit(value.id, value.draw);
  if (output.length === 0 && isObject(dataset.fixtures)) for (const [id, value] of Object.entries(dataset.fixtures)) visit(id, value);
  for (const [key, value] of Object.entries(dataset)) if (key.endsWith("-draw")) visit(key.slice(0, -5), value);
  return output;
}

/**
 * Resolves renderable, per-instance records from byte-exact proof captures.
 * Repeated items remain separate, so opening one bay/door cannot hide siblings.
 */
export function resolveApprovedRoomDrawRecords(
  definitionId: string,
  orientation: RoomOrientation,
  variant?: ApprovedRoomStateVariant,
): readonly ApprovedRoomDrawRecord[] {
  const room = getApprovedRoomPresentation(definitionId);
  const baseCapture = getApprovedRoomProofCapture(definitionId, orientation);
  if (!room || !baseCapture) return [];
  const variantCapture = variant ? baseCapture.variants?.[variant] : undefined;
  if (variant && !variantCapture) throw new Error(`Approved proof ${room.proofId}:${orientation} has no ${variant} variant`);
  const capture: ApprovedRoomProofCapture = variantCapture ? {
    ...baseCapture,
    dataset: variantCapture.dataset ?? baseCapture.dataset,
    drawImages: variantCapture.drawImages,
  } : baseCapture;
  const definitions = fixtureDefinitions(capture.dataset as JsonObject);
  const model = isObject((capture.dataset as JsonObject).model) ? (capture.dataset as JsonObject).model as JsonObject : undefined;
  const worldToLocal = isObject(model?.worldToLocal) ? model.worldToLocal : undefined;
  const tilePixels = capture.coordinateSpace.tilePixels;
  const [originX, originY] = capture.coordinateSpace.floorOriginPixels;
  const drawEntries = flattenedDraws(capture.dataset as JsonObject).filter(({ id, draw }) => {
    if (/(^|\.)(actor|partition|partitionE|partitionW)(\.|$)/.test(id)) return false;
    if (!variant) return true;
    const width = typeof draw.w === "number" ? draw.w : draw.width;
    const height = typeof draw.h === "number" ? draw.h : draw.height;
    return capture.drawImages.some(({ args }) => {
      const destination = args.slice(-4);
      return destination.length === 4 &&
        Math.abs(destination[0]! - (draw.x as number)) < .01 &&
        Math.abs(destination[1]! - (draw.y as number)) < .01 &&
        Math.abs(destination[2]! - (width as number)) < .01 &&
        Math.abs(destination[3]! - (height as number)) < .01;
    });
  });
  if (room.proofId === "front-desk") {
    const extras = [
      ["gallery", [75, 824, 660, 288]], ["botanical", [854, 799, 271, 353]],
      ["receptionist-chair", [167, 692, 331, 478]], ["visitor-chair", [782, 193, 326, 359]],
      ["ficus", [749, 742, 355, 396]],
    ] as const;
    for (const [id, crop] of extras) {
      const call = capture.drawImages.find((candidate) => candidate.args.length === 8 && crop.every((value, index) => candidate.args[index] === value));
      if (call) {
        const [x, y, w, h] = call.args.slice(-4) as [number, number, number, number];
        drawEntries.push({ id, draw: { x, y, w, h } });
      }
    }
  }
  const representedDestinations = new Set(drawEntries.map(({ draw }) => JSON.stringify([
    draw.x, draw.y, typeof draw.w === "number" ? draw.w : draw.width, typeof draw.h === "number" ? draw.h : draw.height,
  ])));
  const supplementalCounts = new Map<string, number>();
  for (const call of capture.drawImages) {
    const [x, y, w, h] = call.args.slice(-4);
    if ([x, y, w, h].some((value) => typeof value !== "number")) continue;
    const destinationKey = JSON.stringify([x, y, w, h]);
    if (representedDestinations.has(destinationKey)) continue;
    const assetId = call.src.assetId!;
    const count = (supplementalCounts.get(assetId) ?? 0) + 1;
    supplementalCounts.set(assetId, count);
    const id = room.proofId === "examination" ? "exam-table" :
      assetId.endsWith(":window") ? `window-${count}` : `${assetId.replace(/[^a-z0-9]+/gi, "-")}-${count}`;
    drawEntries.push({ id, draw: { x: x!, y: y!, w: w!, h: h!, supplementalAssetId: assetId } });
  }
  return drawEntries.flatMap(({ id, draw }) => {
    const width = (typeof draw.w === "number" ? draw.w : draw.width) as number;
    const height = (typeof draw.h === "number" ? draw.h : draw.height) as number;
    const x = draw.x as number;
    const y = draw.y as number;
    const call = capture.drawImages.find(({ args }) => {
      const destination = args.slice(-4);
      return destination.length === 4 && Math.abs(destination[0]! - x) < .01 && Math.abs(destination[1]! - y) < .01 && Math.abs(destination[2]! - width) < .01 && Math.abs(destination[3]! - height) < .01;
    });
    if (!call) throw new Error(`Approved proof draw ${room.proofId}:${orientation}:${id} has no exact drawImage call`);
    const assetId = call.src.assetId;
    if (!assetId) throw new Error(`Approved proof draw ${room.proofId}:${orientation}:${id} has no hashed production asset`);
    const sourceRect = call.args.length === 8
      ? call.args.slice(0, 4) as [number, number, number, number]
      : [0, 0, call.src.width, call.src.height] as [number, number, number, number];
    const leafId = id.split(".").at(-1) ?? id;
    const ownerPrefix = id.match(/^(N\d+|S\d+|W[A-Z]|E[A-Z])\./)?.[1];
    const definition = definitions.get(leafId) ?? (ownerPrefix ? definitions.get(ownerPrefix) : undefined);
    const mapBaseOwners = (owners: readonly ApprovedWallSegment[]) => orientation === 270 ? owners.map((owner) => {
      const mapped = worldToLocal?.[owner];
      return typeof mapped === "string" ? mapped as ApprovedWallSegment : owner;
    }) : [...owners];
    const frontDoorOwners: Readonly<Record<string, readonly ApprovedWallSegment[]>> = { gallery: ["N2", "N3"], botanical: ["N4"], ficus: ["WC"], cabinet: ["N1", "WA"] };
    // Window draws are supplemental canvas calls, so they have no fixture
    // definition to carry ownership. Their proof segments are already in the
    // active view's physical wall frame, which is also the frame emitted by
    // FacilityScene's door/backing sets. Do not apply the proof's base-room
    // worldToLocal map again.
    const supplementalDoorOwners: Readonly<Record<string, readonly ApprovedWallSegment[]>> =
      room.proofId === "phlebotomy"
        ? orientation === 270
          ? { "window-1": ["N1"], "window-2": ["N2"] }
          : { "window-1": ["N2"], "window-2": ["N3"] }
        : room.proofId === "telehealth"
          ? orientation === 270
            ? { "window-1": ["N1"], "window-2": ["N2"] }
            : { "window-1": ["N1"], "window-2": ["N2"], "window-3": ["N3"] }
          : {};
    const frontBackedOwners: Readonly<Record<string, readonly ApprovedWallSegment[]>> = { gallery: ["N2", "N3"], botanical: ["N4"], cabinet: ["N1"] };
    const localDefinitionOwners = segments(definition?.localOwners);
    const baseDefinitionOwners = segments(definition?.owners ?? definition?.conflicts ?? definition?.segments ?? definition?.segment);
    const definitionOwners = localDefinitionOwners.length > 0 ? localDefinitionOwners : mapBaseOwners(baseDefinitionOwners);
    const supplementalOwners = supplementalDoorOwners[id];
    const doorOwners = supplementalOwners ?? (frontDoorOwners[id]
      ? mapBaseOwners(frontDoorOwners[id]!)
      : ownerPrefix ? [ownerPrefix as ApprovedWallSegment] : definitionOwners);
    const wallSegmentOwners = definition?.mount === "north wall" ? segments(definition.segment) : [];
    const explicitBackedOwners = segments(definition?.backedConflicts ?? definition?.backing).concat(wallSegmentOwners);
    const backedOwners = supplementalOwners ?? (frontBackedOwners[id]
      ? mapBaseOwners(frontBackedOwners[id]!)
      : localDefinitionOwners.length > 0
        ? localDefinitionOwners.filter((owner) => owner.startsWith("N"))
        : mapBaseOwners(explicitBackedOwners));
    const frontGround: Readonly<Record<string, Readonly<{ x: number; y: number }>>> = {
      desk: { x: 2, y: 3 }, "receptionist-chair": { x: 1.5, y: 2 }, "visitor-chair": { x: 4.5, y: 4 }, ficus: { x: .4034, y: 3 },
    };
    const ground = frontGround[id] ?? point(definition?.worldGroundAnchor ?? definition?.localGround ?? definition?.ground ?? definition?.anchor);
    const sourceGround = point(draw.sourceGround ?? draw.sourceContact);
    const groundContact = point(draw.groundContact) ?? (typeof draw.contactX === "number" && typeof draw.contactY === "number" ? { x: draw.contactX, y: draw.contactY } : undefined);
    const derivedSourceGround = ground ? {
      x: ((originX + ground.x * tilePixels) - x) / (width / sourceRect[2]),
      y: ((originY + ground.y * tilePixels) - y) / (height / sourceRect[3]),
    } : undefined;
    const isWall = doorOwners.some((owner) => owner.startsWith("N")) && !ground;
    return [{
      id,
      assetId,
      sourceRect,
      renderSizeTiles: [width / tilePixels, height / tilePixels] as const,
      destinationTopLeftTiles: [(x - originX) / tilePixels, (y - originY) / tilePixels] as const,
      canvasTransform: call.transform,
      sourceFloorContact: (sourceGround ?? derivedSourceGround) ? [(sourceGround ?? derivedSourceGround)!.x, (sourceGround ?? derivedSourceGround)!.y] as const : undefined,
      worldLocalGround: ground ? [ground.x, ground.y] as const : undefined,
      footprint: rect(definition?.worldFootprint ?? definition?.footprint ?? definition?.navigationBlocker),
      approach: point(definition?.worldApproach ?? definition?.approach ?? definition?.patientApproach),
      seat: definition?.worldSeats ?? definition?.seat,
      attachments: Object.fromEntries(Object.entries(draw).filter(([key]) =>
        key === "seatContact" || key === "seatScreen" || key === "seatRise" || key === "seatRisePx" ||
        key === "worktopContact" || key === "procedureAttach" || key === "sourceProcedureAttach" || key === "groundContact"
      )),
      doorOwners,
      backedOwners,
      depthKey: ground?.y ?? (isWall ? -1 : ((groundContact?.y ?? y + height) - originY) / tilePixels),
      depthPolicy: (ground ? "ground-contact" : isWall ? "wall" : "authored-layer") as ApprovedRoomDrawRecord["depthPolicy"],
    }];
  }).sort((left, right) => left.depthKey - right.depthKey || left.id.localeCompare(right.id));
}
