import type { ApprovedActorSupport, ApprovedRoomDrawRecord, ApprovedWallSegment } from "./approvedRoomPresentation";

type DrawInput = Readonly<{
  id: string;
  file: string;
  native: readonly [number, number];
  destination: readonly [number, number, number, number];
  ground?: readonly [number, number];
  doorOwners?: readonly ApprovedWallSegment[];
  backedOwners?: readonly ApprovedWallSegment[];
  depthKey?: number;
  depthPolicy?: ApprovedRoomDrawRecord["depthPolicy"];
  footprint?: ApprovedRoomDrawRecord["footprint"];
  approach?: ApprovedRoomDrawRecord["approach"];
}>;

const TILE = 120;
const DEFAULT_ORIGIN: readonly [number, number] = [60, 130];

export const APPROVED_LEVEL3_FLOOR_ORIGINS: Readonly<Record<string, readonly [number, number]>> = {
  "room.ambulatory_or": DEFAULT_ORIGIN,
  "room.laboratory": DEFAULT_ORIGIN,
  "room.pharmacy": DEFAULT_ORIGIN,
  "room.maintenance_workshop": DEFAULT_ORIGIN,
  "room.staff_break": DEFAULT_ORIGIN,
  "room.surgeon_office": [60, 120],
  "room.vending": [150, 150],
};

const records = (
  room: string,
  inputs: readonly DrawInput[],
  origin: readonly [number, number] = DEFAULT_ORIGIN,
): readonly ApprovedRoomDrawRecord[] =>
  inputs.map((input) => {
    const [x, y, width, height] = input.destination;
    const ground = input.ground ?? [x + width / 2, y + height] as const;
    return {
      id: input.id,
      assetId: `level3:${room}:${input.file}`,
      sourceRect: [0, 0, input.native[0], input.native[1]],
      renderSizeTiles: [width / TILE, height / TILE],
      destinationTopLeftTiles: [(x - origin[0]) / TILE, (y - origin[1]) / TILE],
      canvasTransform: [2, 0, 0, 2, 0, 0],
      sourceFloorContact: input.ground,
      worldLocalGround: [(ground[0] - origin[0]) / TILE, (ground[1] - origin[1]) / TILE],
      ...(input.footprint ? { footprint: input.footprint } : {}),
      ...(input.approach ? { approach: input.approach } : {}),
      attachments: {},
      doorOwners: input.doorOwners ?? [],
      backedOwners: input.backedOwners ?? [],
      depthKey: input.depthKey ?? (ground[1] - origin[1]) / TILE,
      depthPolicy: input.depthPolicy ?? "ground-contact",
    };
  });

const wall = (id: string, file: string, native: readonly [number, number], destination: readonly [number, number, number, number], owners: readonly ApprovedWallSegment[], backed: readonly ApprovedWallSegment[]): DrawInput => ({
  id, file, native, destination, ground: [destination[0] + destination[2] / 2, destination[1] + destination[3]],
  doorOwners: owners, backedOwners: backed, depthPolicy: "wall",
});

const OR_COMMON: readonly DrawInput[] = [
  wall("workstation", "workstation.webp", [338, 405], [54.336, 31.616, 118.976, 142.56], ["N1", "WA"], ["N1"]),
  wall("storageLeft", "storageLeft.webp", [393, 378], [182.18184349763297, 61.67277452891487, 116.52582310477048, 112.07827260458839], ["N2"], ["N2"]),
  wall("storageRight", "storageRight.webp", [395, 378], [301.65835478335475, 61.52692692692692, 117.27709852709853, 112.22972972972974], ["N3"], ["N3"]),
  wall("sink", "sink.webp", [368, 408], [426.8810572687225, 41.993538913362684, 118.88399412628488, 131.80616740088107], ["N4", "EA"], ["N4"]),
  { id: "anesthesia", file: "anesthesia.webp", native: [234, 300], destination: [146.7196261682243, 163.7429906542056, 103.8785046728972, 133.17757009345794], ground: [192, 286], footprint: { left: .75, top: .58, width: .7, height: .72 } },
  { id: "lights", file: "lights.webp", native: [293, 310], destination: [210.88974854932303, 92.84719535783366, 192.68858800773694, 203.86847195357834], ground: [300, 106], depthKey: 2.59, depthPolicy: "authored-layer" },
  { id: "tray", file: "tray.webp", native: [246, 252], destination: [414.1075697211155, 419.7450199203187, 114.34262948207171, 117.13147410358566], ground: [471, 526], footprint: { left: 3.15, top: 2.55, width: .55, height: .75 } },
];

const orTable = (occupied: boolean): DrawInput => occupied
  ? { id: "table", file: "tableOccupied.webp", native: [215, 465], destination: [228.55900621118013, 212.13664596273287, 144.22360248447205, 311.92546583850935], ground: [300, 514], footprint: { left: 1.55, top: 1.4, width: .9, height: 1.8 }, approach: { x: 2, y: 3.55 }, depthKey: 2.58, depthPolicy: "authored-layer" }
  : { id: "table", file: "tableEmpty.webp", native: [195, 435], destination: [234.65420560747663, 222.3177570093458, 130.69158878504672, 291.6822429906542], ground: [300, 514], footprint: { left: 1.55, top: 1.4, width: .9, height: 1.8 }, approach: { x: 2, y: 3.55 }, depthKey: 2.58, depthPolicy: "authored-layer" };

export const APPROVED_LEVEL3_ROOM_DRAW_RECORDS: Readonly<Record<string, readonly ApprovedRoomDrawRecord[]>> = {
  "room.ambulatory_or": records("ambulatory-or", [...OR_COMMON, orTable(false)]),
  "room.laboratory": records("laboratory", [
    wall("sink", "sink.webp", [184, 254], [75.96850393700788, 66.8736220472441, 76.06299212598425, 105], ["N1", "WA"], ["N1"]),
    wall("workstation", "workstation.webp", [425, 630], [187.29427564210172, 13.855833473224749, 106.16081920429747, 157.36780258519389], ["N2"], ["N2"]),
    wall("fridge", "fridge.webp", [228, 405], [321.65045992115637, 16.249145860709604, 89.88173455978975, 159.65834428383704], ["N3", "EA"], ["N3"]),
    { id: "bench", file: "bench.webp", native: [480, 425], destination: [150.9099099099099, 183.60360360360357, 178.73873873873876, 158.25825825825828], ground: [240, 340], footprint: { left: .8, top: 1.1, width: 1.4, height: .65 }, approach: { x: 1.5, y: 2.65 } },
  ]),
  "room.pharmacy": records("pharmacy", [
    wall("stock", "stock.webp", [270, 433], [62.489208633093526, 6.146762589928045, 103.59712230215827, 166.13908872901678], ["N1", "WA"], ["N1"]),
    wall("shelves", "shelves.webp", [295, 363], [183.46153846153845, 31.715384615384608, 113.46153846153847, 139.6153846153846], ["N2"], ["N2"]),
    wall("computer", "computer.webp", [425, 630], [313.29427564210175, 13.855833473224749, 106.16081920429747, 157.36780258519389], ["N3", "EA"], ["N3"]),
    { id: "counter", file: "counter.webp", native: [720, 510], destination: [117.69870926335305, 214.55451757826427, 191.00049917991873, 135.29202025244243], ground: [213, 346], footprint: { left: .4, top: 1.15, width: 1.75, height: .65 }, approach: { x: 2.55, y: 2.55 } },
  ]),
  "room.maintenance_workshop": records("maintenance-workshop", [
    wall("parts", "parts.webp", [240, 285], [67.21294559099437, 60.857035647279545, 94.55909943714822, 112.28893058161351], ["N1", "WA"], ["N1"]),
    wall("pegboard", "pegboard.webp", [305, 240], [184.07407407407408, 40.570370370370384, 112.96296296296296, 88.88888888888889], ["N2"], ["N2"]),
    wall("cupboard", "cupboard.webp", [240, 410], [317.8485237483954, 10.819512195121945, 95.50706033376123, 163.1578947368421], ["N3", "EA"], ["N3"]),
    { id: "bench", file: "bench.webp", native: [730, 490], destination: [126.32508091295026, 200.48556176705475, 228.28800807027872, 153.2344163759405], ground: [240, 352], footprint: { left: .575, top: 1.2, width: 1.85, height: .65 }, approach: { x: 1.5, y: 2.65 } },
  ]),
  "room.staff_break": records("staff-break-room", [
    wall("kitchen", "kitchen.webp", [285, 570], [98.5858953864456, 15.539254247369769, 78.82820922710881, 157.65641845421763], ["N1", "WA"], ["N1"]),
    wall("art", "art.webp", [440, 260], [299.86206896551727, 57.751724137931035, 121.37931034482759, 71.72413793103448], ["N3"], ["N3"]),
    wall("fridge", "fridge.webp", [215, 415], [418.66238767650833, 4.875994865211794, 88.31835686777922, 170.4749679075738], ["N4", "EA"], ["N4"]),
    { id: "largeNorthChair", file: "chairSouth.webp", native: [170, 255], destination: [273.4308510638298, 167.57021276595742, 54.255319148936174, 81.38297872340426], ground: [300, 246.4] },
    { id: "largeWestChair", file: "chairEast.webp", native: [260, 335], destination: [143.64802431610943, 230.48267477203655, 71.12462006079026, 91.64133738601824], ground: [178.8, 317.2] },
    { id: "largeEastChair", file: "chairWest.webp", native: [260, 335], destination: [383.9963525835866, 230.48267477203655, 71.12462006079026, 91.64133738601824], ground: [421.2, 317.2] },
    { id: "largeTable", file: "largeTable.webp", native: [285, 265], destination: [187, 131.2, 228, 212], ground: [300, 334] },
    { id: "largeTableFront", file: "largeTableFront.webp", native: [285, 265], destination: [187, 131.2, 228, 212], ground: [300, 334], depthKey: 2.14, depthPolicy: "authored-layer" },
    { id: "largeSouthChair", file: "chairNorth.webp", native: [165, 250], destination: [272.5833333333333, 303.9, 55, 83.33333333333333], ground: [300, 384.4] },
    { id: "largeSouthChairFront", file: "chairNorthFront.webp", native: [165, 250], destination: [272.5833333333333, 303.9, 55, 83.33333333333333], ground: [300, 384.4], depthKey: 2.14, depthPolicy: "authored-layer" },
    { id: "massageChair", file: "massage.webp", native: [250, 310], destination: [123.07191780821917, 335.3767123287671, 128.4246575342466, 159.24657534246577], ground: [186, 490] },
    { id: "massageFront", file: "massageFront.webp", native: [250, 310], destination: [123.07191780821917, 335.3767123287671, 128.4246575342466, 159.24657534246577], ground: [186, 490], depthKey: 3.02, depthPolicy: "authored-layer" },
    { id: "bookshelf", file: "bookshelf.webp", native: [225, 380], destination: [444.13291139240505, 212.63291139240505, 85.44303797468355, 144.30379746835445], ground: [486, 352], doorOwners: ["EB"] },
    { id: "eastPlant", file: "plant.webp", native: [240, 355], destination: [451.5007645259939, 354.64220183486236, 69.72477064220183, 103.13455657492355], ground: [486, 454], doorOwners: ["EC"] },
    { id: "smallNorthChair", file: "chairSouth.webp", native: [170, 255], destination: [357.4308510638298, 347.5702127659575, 54.255319148936174, 81.38297872340426], ground: [384, 426.4] },
    { id: "smallTable", file: "smallTable.webp", native: [400, 520], destination: [329.3424657534247, 368.41095890410963, 109.58904109589041, 142.46575342465752], ground: [384, 508] },
    { id: "smallTableFront", file: "smallTableFront.webp", native: [400, 520], destination: [329.3424657534247, 368.41095890410963, 109.58904109589041, 142.46575342465752], ground: [384, 508], depthKey: 3.59, depthPolicy: "authored-layer" },
    { id: "smallSouthChair", file: "chairNorth.webp", native: [165, 250], destination: [356.5833333333333, 477.9, 55, 83.33333333333333], ground: [384, 558.4] },
    { id: "smallSouthChairFront", file: "chairNorthFront.webp", native: [165, 250], destination: [356.5833333333333, 477.9, 55, 83.33333333333333], ground: [384, 558.4], depthKey: 3.59, depthPolicy: "authored-layer" },
    { id: "southwestPlant", file: "plant.webp", native: [240, 355], destination: [79.50076452599389, 468.64220183486236, 69.72477064220183, 103.13455657492355], ground: [114, 568], doorOwners: ["WD", "S1"] },
  ]),
  "room.surgeon_office": records("surgeons-office", [
    wall("bookcase", "bookcase.webp", [520, 710], [52.3160275, 18.695765, 106.3634, 145.22695], ["N1", "WA"], ["N1"]),
    wall("diplomas", "diplomas.webp", [580, 330], [177.99233716475095, 36.59770114942528, 124.44444444444444, 70.80459770114943], ["N2"], ["N2"]),
    { id: "surgeonChair", file: "chairSouth.webp", native: [630, 780], destination: [150.17394136807815, 113.73224755700326, 92.34527687296418, 114.33224755700327], ground: [196.2, 224.4] },
    { id: "writingDesk", file: "desk.webp", native: [1075, 890], destination: [106.55639412997903, 146.19119496855348, 180.29350104821805, 149.26624737945494], ground: [196.2, 291.6], footprint: { left: .46, top: .78, width: 1.35, height: .65 }, approach: { x: .68, y: .45 } },
    { id: "plant", file: "plant.webp", native: [430, 725], destination: [56.185405, 225.6269, 60.42919, 101.886425], ground: [86.4, 324], doorOwners: ["WB", "S1"] },
  ], APPROVED_LEVEL3_FLOOR_ORIGINS["room.surgeon_office"]),
  "room.vending": records("vending", [
    wall("print1", "print1.webp", [430, 400], [153.06835443037974, 91.86835443037975, 65.31645569620254, 60.75949367088608], ["N1"], ["N1"]),
    wall("print2", "print2.webp", [430, 400], [322.3543973941368, 86.26970684039088, 72.83387622149837, 67.75244299674267], ["N2"], ["N2"]),
    { id: "machine", file: "machine.webp", native: [660, 980], destination: [205.8957654723127, 112.9368078175896, 128.9902280130293, 191.53094462540716], ground: [270, 298.8], footprint: { left: .51, top: .6, width: .98, height: .64 }, approach: { x: 1, y: 1.56 } },
  ], APPROVED_LEVEL3_FLOOR_ORIGINS["room.vending"]),
};

export const APPROVED_LEVEL3_ROOM_VARIANT_DRAW_RECORDS: Readonly<Record<string, Readonly<Record<string, readonly ApprovedRoomDrawRecord[]>>>> = {
  "room.ambulatory_or": {
    occupiedCovered: records("ambulatory-or", [...OR_COMMON, orTable(true)]),
  },
};

const actorSupport = (id: string, facing: ApprovedActorSupport["facing"], seat: readonly [number, number], ground: readonly [number, number], fixtureGround: readonly [number, number]): ApprovedActorSupport => ({
  id, role: "staff-break-seat", pose: "seated", facing,
  seat: { x: seat[0], y: seat[1] }, ground: { x: ground[0], y: ground[1] }, fixtureGround: { x: fixtureGround[0], y: fixtureGround[1] },
});

const standingSupport = (id: string, role: ApprovedActorSupport["role"], facing: ApprovedActorSupport["facing"], ground: readonly [number, number]): ApprovedActorSupport => ({
  id, role, pose: "standing", facing,
  seat: { x: ground[0], y: ground[1] }, ground: { x: ground[0], y: ground[1] }, fixtureGround: { x: ground[0], y: ground[1] },
});

export const APPROVED_LEVEL3_ACTOR_SUPPORTS: Readonly<Record<string, readonly ApprovedActorSupport[]>> = {
  "room.staff_break": [
    actorSupport("massage", "south", [1.05, 2.51], [1.05, 2.7886343035288567], [1.05, 3]),
    actorSupport("largeNorth", "south", [2, .595], [2, 1.01812518374892], [2, .97]),
    actorSupport("largeSouth", "north", [2, 1.745], [2, 2.0962067362603567], [2, 2.12]),
    actorSupport("largeWest", "east", [1.05, 1.16], [1.05, 1.4608176075018616], [.99, 1.56]),
    actorSupport("largeEast", "west", [2.95, 1.16], [2.95, 1.447051931169154], [3.01, 1.56]),
    actorSupport("smallNorth", "south", [2.7, 2.095], [2.7, 2.4370981230847804], [2.7, 2.47]),
    actorSupport("smallSouth", "north", [2.7, 3.195], [2.7, 3.458387131469576], [2.7, 3.57]),
  ],
  "room.surgeon_office": [{ ...actorSupport("surgeon", "south", [1.135, .495], [1.135, .753764789751447], [1.135, .87]), role: "surgeon-office" }],
  "room.ambulatory_or": [
    standingSupport("surgeon", "ambulatory-or-surgeon", "east", [1.15, 2.6]),
    standingSupport("nurse", "ambulatory-or-nurse", "west", [2.85, 2.6]),
  ],
  "room.laboratory": [standingSupport("technician", "laboratory-technician", "north", [1.5, 2.35])],
  "room.pharmacy": [standingSupport("pharmacist", "pharmacist", "west", [2.35, 1.65])],
  "room.maintenance_workshop": [standingSupport("repairPerson", "repair-person", "north", [1.5, 2.35])],
};

export const APPROVED_LEVEL3_PROOF_SHA256: Readonly<Record<string, string>> = {
  "room.ambulatory_or": "98759E8F0C2ACF681B469D47F84B6F447B52D1D0FD24DBF5E37AEF9F59C90C56",
  "room.laboratory": "1A2D3AE0A8A0623114B52F3D23D56956AC5E21C8E38E496535060766488A4C95",
  "room.pharmacy": "F2775A9104E494E7F9F51E3424054DAC4CE4A91969266799CA0CD6A03CD00C1C",
  "room.maintenance_workshop": "A7C8D8BFAC5F5087B795B96EA67D2E3E0DAB7C1BF536701F586945213CFBE439",
  "room.staff_break": "FD4DE2CA6EAF353AA52D5BAFB2D8C1E9C42C5E3F15498F35DA1433905A71ACFC",
  "room.surgeon_office": "AE268AD14EC7F6A9365031C4C7FA45AFFC9F4E1C5AA69CDF077EA9C5E0E375C5",
  "room.vending": "939A3CFA901891DBFED1578B7CA68819844BB821A7E3E01174347DB6B959573B",
};
