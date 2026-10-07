// Design-only rooms (not in the game yet). Same shape as lab-data rooms so the
// lab renders, routes and validates them exactly like game rooms.
//
// MRI Room — owner direction 2026-10-07: 4x4 with a glass control window,
// every element re-oriented versus CT, never dimmed, final art painted by
// Codex from tools/room-design/level-4/mri/ART_BRIEF.md. Stand-in art only.
//   CT:  scanner seen head-on on the WEST, table toward the viewer, operator
//        standing on the EAST behind a vertical glass partition.
//   MRI: magnet seen from the SIDE on the EAST, table sliding in from the
//        west, operator SEATED on the WEST facing east through the glass.

const STANDIN = "../../level-4/mri/stand-in/assets/";
const TOUCHUP = "../../../../apps/player/public/art/rooms/touchup-v1/";

export const DESIGN_ASSETS = {
  "design:mri:gantry-side": { src: STANDIN + "gantry-side.png", size: [288, 389] },
  "design:mri:table-empty": { src: STANDIN + "table-empty.png", size: [252, 149] },
  "design:mri:table-occupied": { src: STANDIN + "table-occupied.png", size: [252, 149] },
  "design:mri:console": { src: STANDIN + "console.png", size: [106, 206] },
  "design:mri:operator-chair": { src: STANDIN + "operator-chair.png", size: [96, 168] },
  "design:mri:coil-cabinet": { src: STANDIN + "coil-cabinet.png", size: [154, 312] },
  "design:mri:zone-sign": { src: STANDIN + "zone-sign.png", size: [110, 96] },
  "design:mri:scan-light": { src: STANDIN + "scan-light.png", size: [96, 53] },
  "design:mri:lockers": { src: STANDIN + "lockers.png", size: [106, 245] },
  "design:mri:comfort-cart": { src: STANDIN + "comfort-cart.png", size: [115, 149] },
  "design:mri:step-stool": { src: TOUCHUP + "step-stool.png", size: [82, 86] },
};

/** Floor item: bottom-centre anchored at (x, groundY), width in tiles. */
function floorItem(id, assetId, x, groundY, widthTiles, extra = {}) {
  const asset = DESIGN_ASSETS[assetId], [w, h] = asset.size, heightTiles = widthTiles * h / w;
  return {
    id, assetId, sourceRect: asset.sourceRect ?? [0, 0, w, h],
    renderSizeTiles: [widthTiles, heightTiles],
    destinationTopLeftTiles: [x - widthTiles / 2, groundY - heightTiles],
    canvasTransform: [1, 0, 0, 1, 0, 0], attachments: {},
    worldLocalGround: [x, groundY], depthKey: groundY, depthPolicy: "ground-contact",
    doorOwners: [], backedOwners: [], touchupKeepWhenBacked: false, ...extra,
  };
}
/** Wall item hung on the north wall: top edge in tiles (negative = up the wall). */
function wallItem(id, assetId, x, top, widthTiles, owners) {
  const [w, h] = DESIGN_ASSETS[assetId].size, heightTiles = widthTiles * h / w;
  return {
    id, assetId, sourceRect: [0, 0, w, h], renderSizeTiles: [widthTiles, heightTiles],
    destinationTopLeftTiles: [x - widthTiles / 2, top], canvasTransform: [1, 0, 0, 1, 0, 0], attachments: {},
    depthKey: -1, depthPolicy: "wall", doorOwners: owners, backedOwners: owners, touchupKeepWhenBacked: false,
  };
}

const MRI_SOLIDS = [
  { id: "gantry", footprint: { left: 2.72, top: 1.30, width: 1.18, height: 1.42 } },
  { id: "table", footprint: { left: 1.80, top: 1.95, width: 0.95, height: 0.45 } },
  { id: "glass", footprint: { left: 1.60, top: 0.72, width: 0.12, height: 2.46 } },
  { id: "console", footprint: { left: 1.16, top: 1.65, width: 0.40, height: 0.35 } },
  { id: "operator-chair", footprint: { left: 0.78, top: 1.75, width: 0.34, height: 0.20 }, endpoint: true },
];

const MRI_RECORDS = [
  floorItem("gantry", "design:mri:gantry-side", 3.30, 2.72, 1.20),
  floorItem("tableEmpty", "design:mri:table-empty", 2.30, 2.42, 1.05, { occupancy: "empty" }),
  floorItem("tableOccupied", "design:mri:table-occupied", 2.30, 2.42, 1.05, { occupancy: "occupied" }),
  floorItem("stepStool", "design:mri:step-stool", 2.05, 2.58, 0.30),
  floorItem("console", "design:mri:console", 1.36, 2.02, 0.44),
  floorItem("operatorChair", "design:mri:operator-chair", 0.95, 1.95, 0.40),
  // Floor-standing on the north wall: hides for N4/EA doorways, stays full
  // height on a low wall (house rule).
  floorItem("coilCabinet", "design:mri:coil-cabinet", 3.55, 0.32, 0.64, { depthPolicy: "wall", depthKey: -1, doorOwners: ["N4", "EA"], backedOwners: ["N4"], touchupKeepWhenBacked: true, footprint: { left: 3.30, top: 0.18, width: 0.50, height: 0.14 } }),
  wallItem("zoneSign", "design:mri:zone-sign", 2.55, -0.70, 0.46, ["N3"]),
  wallItem("scanLight", "design:mri:scan-light", 0.80, -0.62, 0.40, ["N1"]),
  floorItem("lockers", "design:mri:lockers", 0.33, 3.88, 0.44, { doorOwners: ["S1", "WD"], footprint: { left: 0.19, top: 3.74, width: 0.28, height: 0.12 } }),
  floorItem("comfortCart", "design:mri:comfort-cart", 3.66, 3.88, 0.48, { doorOwners: ["S4", "ED"], footprint: { left: 3.52, top: 3.74, width: 0.28, height: 0.12 } }),
];

/** Painted red/yellow safety line around the magnet (Zone IV floor marking). */
function mriFloor() {
  const P = 120, out = [{ shape: "rect", x: 0, y: 0, width: 4 * P, height: 4 * P, color: "#dfe7e8" }];
  for (let y = 0; y < 4 * P; y += 30) for (let x = 0; x < 4 * P; x += 30) {
    const n = Math.abs((x * 13 + y * 7) % 11);
    out.push({ shape: "rect", x: x + 1, y: y + 1, width: 28, height: 28, color: n % 3 ? "#e6eded" : "#d3dddf", alpha: .7 });
  }
  for (let x = 30; x < 4 * P; x += 30) out.push({ shape: "line", x, y: 0, width: 0, height: 4 * P, color: "#7f9396", alpha: .16 });
  for (let y = 30; y < 4 * P; y += 30) out.push({ shape: "line", x: 0, y, width: 4 * P, height: 0, color: "#7f9396", alpha: .16 });
  const left = 1.84 * P, top = 1.06 * P, right = 3.94 * P, bottom = 2.98 * P, dash = 14;
  const edge = (x0, y0, x1, y1) => {
    const len = Math.hypot(x1 - x0, y1 - y0), steps = Math.floor(len / dash);
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps, t1 = (i + .55) / steps;
      const ax = x0 + (x1 - x0) * t0, ay = y0 + (y1 - y0) * t0, bx = x0 + (x1 - x0) * t1, by = y0 + (y1 - y0) * t1;
      out.push({ shape: "rect", x: Math.min(ax, bx) - 2, y: Math.min(ay, by) - 2, width: Math.abs(bx - ax) + 4, height: Math.abs(by - ay) + 4, color: i % 2 ? "#e0b52e" : "#c0392b", alpha: .85 });
    }
  };
  edge(left, top, right, top); edge(right, top, right, bottom); edge(right, bottom, left, bottom); edge(left, bottom, left, top);
  return out;
}

export const DESIGN_ROOMS = [{
  proofId: "mri",
  definitionId: "room.mri",
  design: true,
  footprint: [4, 4],
  shell: {
    tilePixels: 120, rearWallHeightPixels: 90, lowNorthHeightPixels: 29, sideCapWidthPixels: 14, southHeightPixels: 29,
    floorAlgorithm: "design-mri", floorBase: "#dfe7e8", floorPalette: ["#dfe7e8"], background: "#f3ead3",
    rearWall: "#a8c7c9", baseTrim: "#58735a", edgeTrim: "#294632", doorJamb: "#744a29", doorInsetPixels: 12,
  },
  records: MRI_RECORDS,
  solids: MRI_SOLIDS,
  procedural: [{
    id: "glass", rect: { left: 1.60, top: 0.72, width: 0.12, height: 2.46 }, doorOwners: [], backedOwners: [],
    style: { kind: "design-glass" }, drawPhase: "depth-sorted", depthKey: 3.18,
    screenRect: { left: 1.60 * 120, top: 0.72 * 120, width: 0.12 * 120, height: 2.46 * 120 },
  }],
  supports: [
    { id: "operator", role: "mri-operator", pose: "seated", facing: "east", seat: { x: 0.95, y: 1.62 }, ground: { x: 0.95, y: 1.95 }, fixtureGround: { x: 0.95, y: 1.95 } },
    { id: "patient", role: "patient", pose: "standing", facing: "north", seat: { x: 2.45, y: 3.30 }, ground: { x: 2.45, y: 3.30 }, fixtureGround: { x: 2.45, y: 3.30 }, occupancy: "empty" },
  ],
  floor: mriFloor(),
  notes: [
    "Design only (stand-in art). Final pieces will be painted by Codex from ART_BRIEF.md.",
    "Re-oriented versus CT: magnet seen from the side on the east, table slides in from the west, operator seated on the west facing east through a north-south glass window.",
    "Control area keeps a clear walking lane along the west wall; passages around the glass at the north and south ends.",
    "Coil cabinet (north-east), Zone IV sign over the magnet, scan-in-progress light over the control area; screening lockers south-west, comfort cart south-east.",
    "Painted red/yellow safety line around the magnet. Never dimmed (owner choice).",
    "Covered patient on the table while scanning (toggle 'Patient on table').",
  ],
}];

export const DESIGN_NAVIGATION = {
  "room.mri": {
    roomDefinitionId: "room.mri", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "glass", footprint: { left: 1.60, top: 0.72, width: 0.12, height: 2.46 }, blockedTiles: [{ x: 1, y: 1 }, { x: 1, y: 2 }] },
      { id: "table", footprint: { left: 1.80, top: 1.95, width: 0.95, height: 0.45 }, blockedTiles: [{ x: 2, y: 1 }, { x: 2, y: 2 }] },
      { id: "gantry", footprint: { left: 2.72, top: 1.30, width: 1.18, height: 1.42 }, blockedTiles: [{ x: 3, y: 1 }, { x: 3, y: 2 }] },
    ],
    // Owner rule: every wall is a legal door; doors at EB/EC walk through the magnet.
    doorThresholdExceptions: [{ side: "east", offset: 1 }, { side: "east", offset: 2 }],
    primaryAnchor: { x: 2, y: 3 }, waitingAnchors: [], staffAnchor: { x: 0, y: 1 },
    patientCareAnchor: { x: 2, y: 3 }, clinicianCareAnchor: { x: 0, y: 1 },
  },
};

// ---------------------------------------------------------------- Level 4 (rest)
const L4 = "../../level-4/";
const GAME = "../../../../apps/player/public/";
Object.assign(DESIGN_ASSETS, {
  // stand-ins (Codex paints finals from each room's ART_BRIEF.md)
  "design:pw:aquarium": { src: L4 + "pediatric-waiting/stand-in/aquarium.png", size: [230, 283] },
  "design:pw:kids-table": { src: L4 + "pediatric-waiting/stand-in/kids-table.png", size: [168, 110] },
  "design:pw:kid-stool": { src: L4 + "pediatric-waiting/stand-in/kid-stool.png", size: [72, 96] },
  "design:pw:toy-chest": { src: L4 + "pediatric-waiting/stand-in/toy-chest.png", size: [125, 120] },
  "design:pw:book-bin": { src: L4 + "pediatric-waiting/stand-in/book-bin.png", size: [115, 149] },
  "design:pw:animal-prints": { src: L4 + "pediatric-waiting/stand-in/animal-prints.png", size: [168, 91] },
  "design:pw:clock": { src: L4 + "pediatric-waiting/stand-in/wall-clock-kids.png", size: [62, 62] },
  "design:pe:table": { src: L4 + "pediatric-exam/stand-in/peds-table.png", size: [187, 413] },
  "design:pe:scale-counter": { src: L4 + "pediatric-exam/stand-in/scale-counter.png", size: [221, 245] },
  "design:pe:growth-chart": { src: L4 + "pediatric-exam/stand-in/growth-chart.png", size: [86, 187] },
  "design:pe:toy-bin": { src: L4 + "pediatric-exam/stand-in/toy-bin.png", size: [106, 101] },
  "design:pe:animal-print": { src: L4 + "pediatric-exam/stand-in/animal-print.png", size: [82, 86] },
  "design:wo:recliner": { src: L4 + "wound-ostomy/stand-in/wound-recliner.png", size: [312, 235] },
  "design:wo:dressing-cart": { src: L4 + "wound-ostomy/stand-in/dressing-cart.png", size: [134, 206] },
  "design:wo:ostomy-shelf": { src: L4 + "wound-ostomy/stand-in/ostomy-shelf.png", size: [221, 298] },
  "design:wo:exam-lamp": { src: L4 + "wound-ostomy/stand-in/exam-lamp.png", size: [86, 326] },
  "design:wo:hygiene-sign": { src: L4 + "wound-ostomy/stand-in/hygiene-sign.png", size: [72, 86] },
  // reused approved game sprites
  "design:reuse:bench": { src: GAME + "art/rooms/gs015-v1/waiting/south.webp", sourceRect: [8, 8, 545, 356], size: [545, 356] },
  "design:reuse:chair-west": { src: GAME + "art/rooms/gs015-v1/waiting/south.webp", sourceRect: [8, 748, 315, 369], size: [315, 369] },
  "design:reuse:stool": { src: GAME + "art/rooms/gs015-v1/minor-procedure/furniture.webp", sourceRect: [8, 2448, 266, 427], size: [266, 427] },
  "design:reuse:sink": { src: GAME + "art/rooms/gs015-v1/minor-procedure/furniture.webp", sourceRect: [8, 1569, 265, 386], size: [265, 386] },
  "design:reuse:biohazard-bin": { src: GAME + "art/rooms/touchup-v1/biohazard-bin.png", size: [77, 92] },
  "design:reuse:curtain": { src: GAME + "art/rooms/touchup-v1/curtain-bunch.png", size: [62, 211] },
});

/** Cheerful/clean floor: base tiles with a few accent colours and a soft grid. */
function tileFloor(width, height, base, accents, size = 30, gridColor = "#7f8a7c", gridAlpha = .16) {
  const P = 120, out = [{ shape: "rect", x: 0, y: 0, width: width * P, height: height * P, color: base }];
  for (let y = 0; y < height * P; y += size) for (let x = 0; x < width * P; x += size) {
    const n = Math.abs((x * 13 + y * 7) % 17);
    if (n < accents.length) out.push({ shape: "rect", x: x + 1, y: y + 1, width: size - 2, height: size - 2, color: accents[n], alpha: .55 });
  }
  for (let x = size; x < width * P; x += size) out.push({ shape: "line", x, y: 0, width: 0, height: height * P, color: gridColor, alpha: gridAlpha });
  for (let y = size; y < height * P; y += size) out.push({ shape: "line", x: 0, y, width: width * P, height: 0, color: gridColor, alpha: gridAlpha });
  return out;
}
/** Flat rug made of rects (walkable; never blocks a door). */
function rug(left, top, width, height, fill, border, inner) {
  const P = 120, x = left * P, y = top * P, w = width * P, h = height * P;
  return [
    { shape: "rect", x, y, width: w, height: h, color: border },
    { shape: "rect", x: x + 6, y: y + 6, width: w - 12, height: h - 12, color: fill },
    { shape: "rect", x: x + 14, y: y + 14, width: w - 28, height: 3, color: inner },
    { shape: "rect", x: x + 14, y: y + h - 17, width: w - 28, height: 3, color: inner },
  ];
}
const shell = (rearWall, floorBase) => ({
  tilePixels: 120, rearWallHeightPixels: 90, lowNorthHeightPixels: 29, sideCapWidthPixels: 14, southHeightPixels: 29,
  floorAlgorithm: "design", floorBase, floorPalette: [floorBase], background: "#f3ead3",
  rearWall, baseTrim: "#58735a", edgeTrim: "#294632", doorJamb: "#744a29", doorInsetPixels: 12,
});
const seated = (id, role, facing, seat, ground, character) => ({
  id, role, pose: "seated", facing, seat: { x: seat[0], y: seat[1] }, ground: { x: ground[0], y: ground[1] }, fixtureGround: { x: ground[0], y: ground[1] }, ...(character ? { character } : {}),
});
const KID_A = "level3-roster-v2.021", KID_B = "level3-roster-v2.025";

DESIGN_ROOMS.push({
  proofId: "pediatric-waiting",
  definitionId: "room.pediatric_waiting",
  design: true,
  footprint: [4, 4],
  shell: shell("#f0c987", "#efe4cf"),
  records: [
    floorItem("bench", "design:reuse:bench", 2.0, 0.95, 1.9),
    floorItem("aquarium", "design:pw:aquarium", 0.54, 0.32, 0.96, { depthPolicy: "wall", depthKey: -1, doorOwners: ["N1", "WA"], backedOwners: ["N1"], touchupKeepWhenBacked: true, footprint: { left: 0.14, top: 0.18, width: 0.80, height: 0.12 } }),
    floorItem("armchair", "design:reuse:chair-west", 3.3, 1.95, 0.8),
    floorItem("kidsTable", "design:pw:kids-table", 2.0, 2.62, 0.70),
    floorItem("kidStoolWest", "design:pw:kid-stool", 1.42, 2.66, 0.30),
    floorItem("kidStoolEast", "design:pw:kid-stool", 2.58, 2.66, 0.30),
    floorItem("toyChest", "design:pw:toy-chest", 0.36, 3.86, 0.52, { doorOwners: ["S1", "WD"], footprint: { left: 0.20, top: 3.74, width: 0.32, height: 0.10 } }),
    floorItem("bookBin", "design:pw:book-bin", 3.66, 3.86, 0.48, { doorOwners: ["S4", "ED"], footprint: { left: 3.52, top: 3.74, width: 0.28, height: 0.10 } }),
    wallItem("animalPrints", "design:pw:animal-prints", 2.0, -0.68, 0.70, ["N2", "N3"]),
    wallItem("clock", "design:pw:clock", 3.5, -0.66, 0.26, ["N4"]),
  ],
  solids: [
    { id: "bench", footprint: { left: 1.05, top: 0.55, width: 1.9, height: 0.4 }, endpoint: true },
    { id: "armchair", footprint: { left: 3.02, top: 1.45, width: 0.56, height: 0.5 }, endpoint: true },
    { id: "kidsTable", footprint: { left: 1.70, top: 2.42, width: 0.60, height: 0.18 } },
  ],
  procedural: [],
  supports: [
    seated("bench:seat-1", "waiting-seat", "south", [1.55, 0.38], [1.55, 0.95]),
    seated("bench:seat-2", "waiting-seat", "south", [2.45, 0.38], [2.45, 0.95], KID_B),
    seated("armchair", "waiting-seat", "west", [3.3, 1.72], [3.3, 1.95]),
    seated("kidWest", "waiting-seat", "east", [1.42, 2.35], [1.42, 2.66], KID_A),
    seated("kidEast", "waiting-seat", "west", [2.58, 2.35], [2.58, 2.66], KID_B),
  ],
  floor: [...tileFloor(4, 4, "#efe4cf", ["#f6d58a", "#bfe1ee", "#cfe8c4", "#f3c2c8"]), ...rug(1.0, 2.08, 2.0, 0.94, "#8fc7e8", "#f2c14e", "#e05d6f")],
  notes: [
    "Design only (stand-in art for new pieces; bench and armchair reuse the approved waiting furniture).",
    "Different from the adult Waiting Room: aquarium in the north-west corner, a kids' table with two little stools on a bright rug, toy chest and book bin, animal prints and a playful clock.",
    "Parents sit on the north bench or the east armchair; children at the kids' table. Sunny wainscot, cheerful floor.",
  ],
});
DESIGN_NAVIGATION["room.pediatric_waiting"] = {
  roomDefinitionId: "room.pediatric_waiting", width: 4, height: 4, allowedOrientations: [0],
  solidFixtures: [
    { id: "bench", footprint: { left: 1.05, top: 0.55, width: 1.9, height: 0.4 }, blockedTiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }, { x: 2, y: 0 }] },
    { id: "armchair", footprint: { left: 3.02, top: 1.45, width: 0.56, height: 0.5 }, blockedTiles: [{ x: 3, y: 1 }], endpointOnlyContacts: [{ x: 3, y: 1 }] },
    { id: "kidsTable", footprint: { left: 1.70, top: 2.42, width: 0.60, height: 0.18 }, blockedTiles: [{ x: 1, y: 2 }, { x: 2, y: 2 }], endpointOnlyContacts: [{ x: 1, y: 2 }, { x: 2, y: 2 }] },
  ],
  doorThresholdExceptions: [{ side: "north", offset: 1 }, { side: "north", offset: 2 }, { side: "east", offset: 1 }],
  primaryAnchor: { x: 0, y: 2 }, waitingAnchors: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  staffAnchor: null, publicWaitingArea: true,
};

DESIGN_ROOMS.push({
  proofId: "pediatric-exam",
  definitionId: "room.pediatric_examination",
  design: true,
  footprint: [3, 3],
  shell: shell("#9fd3c7", "#e8f0ec"),
  records: [
    floorItem("pedsTable", "design:pe:table", 0.49, 2.05, 0.78),
    floorItem("stool", "design:reuse:stool", 1.45, 1.75, 0.44),
    floorItem("scaleCounter", "design:pe:scale-counter", 2.47, 0.30, 0.92, { depthPolicy: "wall", depthKey: -1, doorOwners: ["N3", "EA"], backedOwners: ["N3"], touchupKeepWhenBacked: true, footprint: { left: 2.06, top: 0.18, width: 0.82, height: 0.12 } }),
    floorItem("parentChair", "design:reuse:chair-west", 2.52, 2.88, 0.8),
    floorItem("toyBin", "design:pe:toy-bin", 0.34, 2.86, 0.44, { doorOwners: ["S1", "WC"], footprint: { left: 0.21, top: 2.74, width: 0.26, height: 0.10 } }),
    wallItem("growthChart", "design:pe:growth-chart", 1.45, -0.80, 0.36, ["N2"]),
    wallItem("animalPrint", "design:pe:animal-print", 0.55, -0.66, 0.34, ["N1"]),
  ],
  solids: [
    { id: "pedsTable", footprint: { left: 0.12, top: 0.50, width: 0.74, height: 1.50 }, endpoint: true },
    { id: "parentChair", footprint: { left: 2.24, top: 2.38, width: 0.56, height: 0.5 }, endpoint: true },
  ],
  procedural: [],
  supports: [
    { id: "table:patient", role: "examination-patient", pose: "exam-table", facing: "east", seat: { x: 0.66, y: 1.25 }, ground: { x: 0.66, y: 1.60 }, fixtureGround: { x: 0.49, y: 2.06 }, character: KID_A },
    seated("stool:clinician", "examination-clinician", "west", [1.45, 1.39], [1.45, 1.75]),
    seated("parentChair", "waiting-seat", "west", [2.52, 2.65], [2.52, 2.88]),
  ],
  floor: [...tileFloor(3, 3, "#e8f0ec", ["#cfe8c4", "#bfe1ee", "#f6d58a"], 30, "#6f8a80")],
  notes: [
    "Design only (stand-in art for new pieces; stool and parent chair reuse approved furniture).",
    "Different from the adult Exam Room: the table runs north-south along the west wall, so the child sits facing east toward the doctor's stool.",
    "Infant-scale counter with sink (north-east), giraffe growth chart and an animal print on the wall, parent chair facing the table, toy bin in the corner.",
  ],
});
DESIGN_NAVIGATION["room.pediatric_examination"] = {
  roomDefinitionId: "room.pediatric_examination", width: 3, height: 3, allowedOrientations: [0],
  solidFixtures: [
    { id: "pedsTable", footprint: { left: 0.12, top: 0.50, width: 0.74, height: 1.50 }, blockedTiles: [{ x: 0, y: 0 }, { x: 0, y: 1 }], endpointOnlyContacts: [{ x: 0, y: 1 }] },
    { id: "parentChair", footprint: { left: 2.24, top: 2.38, width: 0.56, height: 0.5 }, blockedTiles: [{ x: 2, y: 2 }], endpointOnlyContacts: [{ x: 2, y: 2 }] },
  ],
  doorThresholdExceptions: [{ side: "north", offset: 0 }, { side: "west", offset: 0 }, { side: "west", offset: 1 }, { side: "south", offset: 2 }, { side: "east", offset: 2 }],
  primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [{ x: 2, y: 2 }], staffAnchor: { x: 1, y: 1 },
  patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 1, y: 1 },
};

DESIGN_ROOMS.push({
  proofId: "wound-ostomy",
  definitionId: "room.wound_ostomy",
  design: true,
  footprint: [3, 3],
  shell: shell("#b9c7a5", "#e6e8df"),
  records: [
    floorItem("recliner", "design:wo:recliner", 0.90, 1.95, 1.30),
    floorItem("lamp", "design:wo:exam-lamp", 1.62, 1.20, 0.36, { footprint: { left: 1.50, top: 1.08, width: 0.22, height: 0.12 } }),
    floorItem("stool", "design:reuse:stool", 2.15, 1.90, 0.44),
    floorItem("sink", "design:reuse:sink", 0.45, 0.32, 0.62, { depthPolicy: "wall", depthKey: -1, doorOwners: ["N1", "WA"], backedOwners: ["N1"], touchupKeepWhenBacked: true, footprint: { left: 0.25, top: 0.18, width: 0.40, height: 0.12 } }),
    floorItem("ostomyShelf", "design:wo:ostomy-shelf", 2.01, 0.32, 0.92, { depthPolicy: "wall", depthKey: -1, doorOwners: ["N2", "N3"], backedOwners: ["N2", "N3"], touchupKeepWhenBacked: true, footprint: { left: 1.65, top: 0.18, width: 0.72, height: 0.12 } }),
    floorItem("dressingCart", "design:wo:dressing-cart", 2.62, 2.88, 0.56, { doorOwners: ["S3", "EC"], footprint: { left: 2.45, top: 2.76, width: 0.34, height: 0.10 } }),
    floorItem("curtain", "design:reuse:curtain", 0.16, 2.32, 0.20, { doorOwners: ["WC"], footprint: { left: 0.08, top: 2.22, width: 0.16, height: 0.10 } }),
    floorItem("bio", "design:reuse:biohazard-bin", 0.34, 2.88, 0.40, { doorOwners: ["S1", "WC"], footprint: { left: 0.22, top: 2.76, width: 0.24, height: 0.10 } }),
    wallItem("hygieneSign", "design:wo:hygiene-sign", 2.74, -0.64, 0.30, ["N3"]),
  ],
  solids: [
    { id: "recliner", footprint: { left: 0.35, top: 1.55, width: 1.15, height: 0.40 }, endpoint: true },
  ],
  procedural: [],
  supports: [
    seated("recliner:patient", "examination-patient", "east", [0.62, 1.40], [0.62, 1.95]),
    seated("stool:clinician", "examination-clinician", "west", [2.15, 1.54], [2.15, 1.90]),
  ],
  floor: [...tileFloor(3, 3, "#e6e8df", ["#d8dccf", "#cfd8d6"], 24, "#6f7a72", .14)],
  notes: [
    "Design only (stand-in art for new pieces; stool, sink, curtain and bin reuse approved art).",
    "Treatment recliner seen from the side with the leg rest out to the east; the clinician sits on a stool facing the patient's legs, with an exam lamp between them.",
    "Ostomy supply shelving and a hand-hygiene sign on the north wall, sink in the north-west corner, dressing cart (south-east), biohazard bin and a gathered privacy curtain (south-west).",
  ],
});
DESIGN_NAVIGATION["room.wound_ostomy"] = {
  roomDefinitionId: "room.wound_ostomy", width: 3, height: 3, allowedOrientations: [0],
  solidFixtures: [
    { id: "recliner", footprint: { left: 0.35, top: 1.55, width: 1.15, height: 0.40 }, blockedTiles: [{ x: 0, y: 1 }, { x: 1, y: 1 }], endpointOnlyContacts: [{ x: 0, y: 1 }] },
  ],
  doorThresholdExceptions: [{ side: "west", offset: 1 }],
  primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 },
  patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 2, y: 1 },
};
