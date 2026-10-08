import type { RoomOrientation } from "@gamify-surgery/game-domain";

export type ApprovedSideChairMaskId =
  | "front-desk-staff-south"
  | "front-desk-public-north"
  | "waiting-south-bench"
  | "waiting-south-left-east"
  | "waiting-south-right-west"
  | "waiting-west-bench-east"
  | "waiting-west-left-north"
  | "waiting-west-right-south"
  | "phlebotomy-south-patient"
  | "phlebotomy-east-patient"
  | "telehealth-south-left-east"
  | "telehealth-south-right-west"
  | "telehealth-west-left-north"
  | "telehealth-west-right-south"
  | "surgeon-office-south"
  | "reading-northwest-south"
  | "reading-northeast-west"
  | "reading-southwest-east"
  | `periop-${string}`
  | `recovery-bed-${RecoveryBedId}`;

type RecoveryBedId = "N3" | "N4" | "S3" | "S4" | "WC" | "WD" | "EC" | "ED";

export interface ApprovedSideChairLayerBinding {
  readonly drawId: string;
  readonly maskId: ApprovedSideChairMaskId;
}

export interface ApprovedSideChairMaskDefinition {
  readonly id: ApprovedSideChairMaskId;
  readonly roomDefinitionId: string;
  readonly orientation: RoomOrientation;
  readonly drawId: string;
  readonly supportIds: readonly string[];
  readonly assetId: string;
  readonly sourceRect: readonly [number, number, number, number];
  /** Source-crop-local near arm, chair back, or non-south bed foreground. */
  readonly southArmPolygon: readonly (readonly [x: number, y: number])[];
  /** Separate arms/posts can share a crop without masking the cushion between them. */
  readonly additionalForegroundPolygons?: readonly ApprovedSideChairMaskDefinition["southArmPolygon"][];
  /** Keeps an actor inside a proof's explicit desk/actor layer stack. */
  readonly respectAuthoredDepth?: boolean;
}

export const APPROVED_SIDE_CHAIR_MASKS: readonly ApprovedSideChairMaskDefinition[] = [
  {
    id: "front-desk-staff-south", roomDefinitionId: "room.front_desk", orientation: 0,
    drawId: "receptionist-chair", supportIds: ["receptionist-chair:seat-1"],
    assetId: "gs015:front-desk:furniture", sourceRect: [167, 692, 331, 478],
    southArmPolygon: [[6, 144], [68, 144], [68, 242], [50, 242], [50, 283], [20, 283], [20, 242], [6, 242]],
    additionalForegroundPolygons: [[[259, 144], [331, 144], [331, 242], [310, 242], [310, 283], [280, 283], [280, 242], [259, 242]]],
  },
  {
    id: "front-desk-public-north", roomDefinitionId: "room.front_desk", orientation: 0,
    drawId: "visitor-chair", supportIds: ["visitor-chair:seat-1"],
    assetId: "gs015:front-desk:furniture", sourceRect: [782, 193, 326, 359],
    southArmPolygon: [[0, 0], [326, 0], [326, 247], [0, 247]],
  },
  {
    id: "waiting-south-bench", roomDefinitionId: "room.waiting", orientation: 0,
    drawId: "draws.bench", supportIds: ["bench:seat-1", "bench:seat-2"],
    assetId: "gs015:waiting:south", sourceRect: [8, 8, 545, 356],
    southArmPolygon: [[0, 64], [43, 64], [43, 176], [31, 200], [31, 348], [0, 348]],
    additionalForegroundPolygons: [[[502, 64], [545, 64], [545, 348], [516, 348], [516, 200], [502, 176]]],
  },
  {
    id: "waiting-south-left-east",
    roomDefinitionId: "room.waiting",
    orientation: 0,
    drawId: "draws.leftChair",
    supportIds: ["leftChair:seat-1"],
    assetId: "gs015:waiting:south",
    sourceRect: [8, 372, 311, 368],
    southArmPolygon: [[31, 167], [258, 167], [268, 170], [273, 176], [274, 185], [272, 194], [269, 197], [258, 190], [65, 190], [52, 198], [48, 211], [32, 212], [24, 199], [24, 181]],
    additionalForegroundPolygons: [
      [[258, 186], [274, 186], [287, 356], [260, 365], [242, 190]],
      [[32, 193], [56, 193], [51, 355], [25, 355]],
    ],
  },
  {
    id: "waiting-south-right-west",
    roomDefinitionId: "room.waiting",
    orientation: 0,
    drawId: "draws.rightChair",
    supportIds: ["rightChair:seat-1"],
    assetId: "gs015:waiting:south",
    sourceRect: [8, 748, 315, 369],
    southArmPolygon: [[44, 168], [282, 168], [291, 173], [294, 185], [292, 198], [286, 207], [274, 211], [268, 197], [257, 190], [68, 190], [53, 198], [48, 212], [41, 212], [38, 199], [38, 180]],
    additionalForegroundPolygons: [
      [[274, 193], [294, 193], [302, 361], [275, 361], [261, 190]],
      [[40, 196], [63, 196], [56, 363], [30, 363]],
    ],
  },
  {
    id: "waiting-west-bench-east",
    roomDefinitionId: "room.waiting",
    orientation: 270,
    drawId: "draws.bench",
    supportIds: ["bench:seat-1", "bench:seat-2"],
    assetId: "gs015:waiting:west",
    sourceRect: [8, 8, 417, 1088],
    southArmPolygon: [[61, 763], [357, 763], [380, 770], [397, 789], [402, 812], [398, 829], [374, 829], [363, 816], [101, 816], [92, 829], [58, 829], [56, 807]],
    additionalForegroundPolygons: [
      [[58, 812], [104, 812], [95, 1074], [48, 1074]],
      [[365, 810], [405, 810], [410, 1074], [367, 1074]],
    ],
  },
  {
    id: "waiting-west-left-north", roomDefinitionId: "room.waiting", orientation: 270,
    drawId: "draws.leftChair", supportIds: ["leftChair:seat-1"],
    assetId: "gs015:waiting:west", sourceRect: [8, 1104, 364, 336],
    southArmPolygon: [[0, 0], [364, 0], [364, 240], [0, 240]],
  },
  {
    id: "waiting-west-right-south", roomDefinitionId: "room.waiting", orientation: 270,
    drawId: "draws.rightChair", supportIds: ["rightChair:seat-1"],
    assetId: "gs015:waiting:west", sourceRect: [8, 1448, 385, 451],
    southArmPolygon: [[0, 131], [59, 131], [59, 258], [53, 258], [53, 435], [25, 435], [25, 258], [0, 258]],
    additionalForegroundPolygons: [[[335, 131], [385, 131], [385, 258], [378, 258], [378, 435], [350, 435], [350, 258], [335, 258]]],
  },
  {
    id: "phlebotomy-south-patient", roomDefinitionId: "room.phlebotomy", orientation: 0,
    drawId: "chair", supportIds: ["chair:patient"],
    assetId: "gs015:phlebotomy:south", sourceRect: [0, 0, 648, 748],
    southArmPolygon: [[0, 230], [179, 230], [179, 366], [152, 366], [152, 530], [109, 530], [109, 366], [0, 366]],
    additionalForegroundPolygons: [[[482, 230], [648, 230], [648, 366], [547, 366], [547, 530], [498, 530], [498, 366], [482, 366]]],
  },
  {
    id: "phlebotomy-east-patient",
    roomDefinitionId: "room.phlebotomy",
    orientation: 270,
    drawId: "chair",
    supportIds: ["chair:patient"],
    assetId: "gs015:phlebotomy:east",
    sourceRect: [8, 8, 589, 807],
    southArmPolygon: [[151, 398], [468, 398], [489, 402], [502, 414], [507, 433], [504, 453], [492, 469], [470, 478], [158, 478], [139, 469], [129, 453], [127, 430], [134, 409]],
    additionalForegroundPolygons: [
      [[139, 469], [192, 469], [185, 738], [132, 738]],
      [[274, 470], [310, 470], [310, 616], [274, 616]],
    ],
  },
  {
    id: "telehealth-south-left-east",
    roomDefinitionId: "room.glp1_telehealth_suite",
    orientation: 0,
    drawId: "chair1",
    supportIds: ["telehealth:leftSeat"],
    assetId: "gs015:telehealth:props",
    sourceRect: [7, 7, 275, 454],
    southArmPolygon: [[78, 220], [176, 220], [187, 222], [193, 229], [193, 239], [188, 246], [80, 249], [67, 246], [60, 240], [60, 230], [66, 223]],
    additionalForegroundPolygons: [[[61, 238], [92, 238], [96, 281], [79, 292], [60, 268]]],
  },
  {
    id: "telehealth-south-right-west",
    roomDefinitionId: "room.glp1_telehealth_suite",
    orientation: 0,
    drawId: "chair2",
    supportIds: ["telehealth:rightSeat"],
    assetId: "gs015:telehealth:props",
    sourceRect: [289, 7, 277, 481],
    southArmPolygon: [[101, 220], [201, 220], [210, 214], [217, 214], [222, 222], [222, 232], [217, 240], [207, 247], [100, 248], [89, 244], [85, 237], [85, 227], [91, 221]],
    additionalForegroundPolygons: [[[202, 234], [231, 234], [226, 300], [213, 309], [194, 293]]],
  },
  {
    id: "telehealth-west-left-north", roomDefinitionId: "room.glp1_telehealth_suite", orientation: 270,
    respectAuthoredDepth: true,
    drawId: "chair1", supportIds: ["telehealth:leftSeat"],
    assetId: "gs015:telehealth:props", sourceRect: [573, 7, 297, 381],
    southArmPolygon: [[0, 0], [297, 0], [297, 238], [0, 238]],
  },
  {
    id: "telehealth-west-right-south", roomDefinitionId: "room.glp1_telehealth_suite", orientation: 270,
    drawId: "chair2", supportIds: ["telehealth:rightSeat"],
    assetId: "gs015:telehealth:props", sourceRect: [877, 7, 303, 454],
    southArmPolygon: [[0, 125], [54, 125], [60, 277], [0, 277]],
    additionalForegroundPolygons: [[[251, 125], [303, 125], [303, 277], [245, 277]]],
  },
  {
    id: "surgeon-office-south", roomDefinitionId: "room.surgeon_office", orientation: 0,
    drawId: "surgeonChair", supportIds: ["surgeon"],
    assetId: "level3:surgeons-office:chairSouth.webp", sourceRect: [0, 0, 630, 780],
    southArmPolygon: [[20, 219], [127, 219], [127, 344], [90, 344], [90, 469], [56, 469], [56, 344], [20, 344]],
    additionalForegroundPolygons: [[[502, 219], [604, 219], [604, 344], [578, 344], [578, 469], [543, 469], [543, 344], [502, 344]]],
  },
  {
    id: "reading-northwest-south", roomDefinitionId: "room.reading", orientation: 0,
    respectAuthoredDepth: true,
    drawId: "chairNorthwest", supportIds: ["northwest"],
    assetId: "level3:radiology-reading:chair-northwest.webp", sourceRect: [0, 0, 412, 340],
    southArmPolygon: [[0, 117], [70, 117], [70, 195], [50, 195], [50, 276], [20, 276], [20, 195], [0, 195]],
    additionalForegroundPolygons: [[[341, 117], [412, 117], [412, 195], [391, 195], [391, 276], [363, 276], [363, 195], [341, 195]]],
  },
  {
    id: "reading-northeast-west", roomDefinitionId: "room.reading", orientation: 0,
    respectAuthoredDepth: true,
    drawId: "chairNortheast", supportIds: ["northeast"],
    assetId: "level3:radiology-reading:chair-northeast.webp", sourceRect: [0, 0, 355, 453],
    southArmPolygon: [[102, 103], [265, 103], [282, 110], [287, 123], [284, 140], [275, 150], [112, 151], [96, 145], [84, 132], [86, 118]],
    additionalForegroundPolygons: [
      [[104, 145], [135, 145], [137, 254], [117, 264], [104, 250]],
      [[255, 145], [278, 145], [276, 251], [262, 258], [253, 245]],
    ],
  },
  {
    id: "reading-southwest-east", roomDefinitionId: "room.reading", orientation: 0,
    respectAuthoredDepth: true,
    drawId: "chairSouthwest", supportIds: ["southwest"],
    assetId: "level3:radiology-reading:chair-southwest.webp", sourceRect: [0, 0, 355, 453],
    southArmPolygon: [[90, 103], [250, 103], [263, 113], [266, 128], [260, 142], [247, 151], [81, 151], [71, 142], [66, 128], [74, 113]],
    additionalForegroundPolygons: [
      [[71, 145], [101, 145], [103, 250], [89, 261], [72, 255]],
      [[219, 145], [248, 145], [247, 250], [233, 258], [219, 252]],
    ],
  },
  // South-facing bed sitters (N3/N4) draw entirely above their bed, legs included.
  // Other facings retain their approved hanging-leg bands, clear of monitors.
  ...recoveryBedMasks(["S3", "S4"], [263, 0, 255, 573], [[0, 48], [255, 48], [255, 230], [0, 230]]),
  ...recoveryBedMasks(["WC", "WD"], [528, 0, 656, 337], [[330, 190], [656, 190], [656, 337], [330, 337]]),
  ...recoveryBedMasks(["EC", "ED"], [1194, 0, 657, 336], [[0, 190], [327, 190], [327, 336], [0, 336]]),
] as const;

function recoveryBedMasks(
  bedIds: readonly RecoveryBedId[],
  sourceRect: ApprovedSideChairMaskDefinition["sourceRect"],
  southArmPolygon: ApprovedSideChairMaskDefinition["southArmPolygon"],
): ApprovedSideChairMaskDefinition[] {
  return bedIds.map((bedId) => ({
    id: `recovery-bed-${bedId}`,
    roomDefinitionId: "room.periop_recovery",
    orientation: 0,
    drawId: `${bedId}.bed`,
    supportIds: [`periop-bed:${bedId}`],
    assetId: "gs015:recovery:furniture",
    sourceRect,
    southArmPolygon,
  }));
}

export function getApprovedSideChairMask(
  roomDefinitionId: string,
  orientation: RoomOrientation,
  supportId: string,
): ApprovedSideChairMaskDefinition | undefined {
  return APPROVED_SIDE_CHAIR_MASKS.find((mask) =>
    mask.roomDefinitionId === roomDefinitionId &&
    mask.orientation === orientation &&
    mask.supportIds.includes(supportId),
  );
}

export function getApprovedSideChairMaskForDraw(
  roomDefinitionId: string,
  orientation: RoomOrientation,
  draw: Readonly<{ id: string; assetId: string; sourceRect: readonly number[] }>,
): ApprovedSideChairMaskDefinition | undefined {
  const mask = APPROVED_SIDE_CHAIR_MASKS.find((candidate) =>
    candidate.roomDefinitionId === roomDefinitionId &&
    candidate.orientation === orientation &&
    candidate.drawId === draw.id,
  );
  if (!mask) return undefined;
  return mask.assetId === draw.assetId &&
    mask.sourceRect.every((value, index) => value === draw.sourceRect[index])
    ? mask
    : undefined;
}

export function isApprovedSideChairForegroundPixel(
  x: number,
  y: number,
  polygon: ApprovedSideChairMaskDefinition["southArmPolygon"],
): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const [currentX, currentY] = polygon[index]!;
    const [previousX, previousY] = polygon[previous]!;
    const crosses = (currentY > y) !== (previousY > y) &&
      x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Assigns every source pixel to exactly one layer, so occupied chairs have no alpha seam or doubled edge. */
export function partitionApprovedSideChairPixels(
  rear: Uint8ClampedArray,
  foreground: Uint8ClampedArray,
  width: number,
  height: number,
  polygon: ApprovedSideChairMaskDefinition["southArmPolygon"],
  additionalPolygons: ApprovedSideChairMaskDefinition["additionalForegroundPolygons"] = [],
): void {
  const regions = [polygon, ...additionalPolygons];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (regions.some((region) => isApprovedSideChairForegroundPixel(x + .5, y + .5, region))) rear[offset + 3] = 0;
      else foreground[offset + 3] = 0;
    }
  }
}

export function getApprovedSideChairForegroundDepth(actorDepths: readonly number[]): number | undefined {
  const finiteDepths = actorDepths.filter(Number.isFinite);
  return finiteDepths.length > 0 ? Math.max(...finiteDepths) + .5 : undefined;
}
