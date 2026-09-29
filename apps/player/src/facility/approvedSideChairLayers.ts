import type { RoomOrientation } from "@gamify-surgery/game-domain";

export type ApprovedSideChairMaskId =
  | "waiting-south-left-east"
  | "waiting-south-right-west"
  | "waiting-west-bench-east"
  | "phlebotomy-east-patient"
  | "telehealth-south-left-east"
  | "telehealth-south-right-west";

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
  /** Pixel centers inside this source-crop-local polygon belong to the south arm. */
  readonly southArmPolygon: readonly (readonly [x: number, y: number])[];
}

export const APPROVED_SIDE_CHAIR_MASKS: readonly ApprovedSideChairMaskDefinition[] = [
  {
    id: "waiting-south-left-east",
    roomDefinitionId: "room.waiting",
    orientation: 0,
    drawId: "draws.leftChair",
    supportIds: ["leftChair:seat-1"],
    assetId: "gs015:waiting:south",
    sourceRect: [8, 372, 311, 368],
    southArmPolygon: [[31, 167], [258, 167], [268, 170], [273, 176], [274, 185], [272, 194], [269, 197], [258, 190], [65, 190], [52, 198], [48, 211], [32, 212], [24, 199], [24, 181]],
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
  },
] as const;

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
): void {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (isApprovedSideChairForegroundPixel(x + .5, y + .5, polygon)) rear[offset + 3] = 0;
      else foreground[offset + 3] = 0;
    }
  }
}

export function getApprovedSideChairForegroundDepth(actorDepths: readonly number[]): number | undefined {
  const finiteDepths = actorDepths.filter(Number.isFinite);
  return finiteDepths.length > 0 ? Math.max(...finiteDepths) + .5 : undefined;
}
