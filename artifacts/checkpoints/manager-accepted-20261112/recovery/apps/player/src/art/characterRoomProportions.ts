import data from "./characterRoomProportions.generated.json";

export interface SeatedCharacterProportion {
  readonly correction: number;
  readonly requiredCorrection?: number;
  readonly status: "nonhuman-preserved" | "within-band" | "corrected" | "regeneration-required-size-jump" | "regeneration-required-cardinals";
  readonly group?: string;
  readonly beforeHeight52?: number;
}
export const SEATED_CHARACTER_REFERENCE = data.reference;
const profiles = data.identities as Readonly<Record<string, SeatedCharacterProportion>>;
export function getSeatedCharacterProportion(stillId: string): SeatedCharacterProportion | undefined { return profiles[stillId]; }

/** Shared by seat/chair/exam-table poses. Contact alignment still uses the
 * authored seat coordinate, so a bounded size correction cannot move the hip
 * off the furniture. Large pose-size jumps remain explicit regeneration cases. */
export function seatedCharacterScaleCorrection(stillId: string, pose: string): number {
  return pose === "seated" || pose === "exam-table" ? profiles[stillId]?.correction ?? 1 : 1;
}
