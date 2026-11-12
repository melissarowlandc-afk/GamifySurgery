import proportionData from "./characterProportions.generated.json";

export type CharacterProportionGroup = "adult" | "young-child" | "school-child" | "teen" | "nonhuman";
export interface CharacterProportionProfile {
  readonly group: CharacterProportionGroup;
  readonly scale: number;
  readonly nativeStandingHeight: number;
  readonly floorByPose: Readonly<Record<string, number>>;
  readonly boundsByPose: Readonly<Record<string, Readonly<{ x: number; y: number; width: number; height: number }>>>;
}

/** Editorial art sizing only. This never selects patient demographics or cases.
 * Rebuild with node tools/art/character-proportions.mjs --write-data after review.
 * Alpha>=32 removes near-transparent fringe from framing; approved PNGs and
 * authored seat contacts remain unchanged. This is the shared identity factor;
 * characterRoomProportions adds a bounded correction for seated/exam-table poses.
 */
export const CHARACTER_PROPORTION_REFERENCE = proportionData.reference;
const profiles = proportionData.identities as Readonly<Record<string, CharacterProportionProfile>>;

export function getCharacterProportionProfile(stillId: string): CharacterProportionProfile | undefined {
  return profiles[stillId];
}

export function getCharacterProportionRegistration(stillId: string, url: string) {
  const profile = profiles[stillId];
  const filename = url.split("/").at(-1)?.split(".")[0];
  const key = filename === "clipboard" ? "clipboard-south" : filename;
  if (!profile || !key) return undefined;
  const floorY = profile.floorByPose[key];
  const visibleBounds = profile.boundsByPose[key];
  return floorY !== undefined && visibleBounds ? { floorY, visibleBounds } : undefined;
}
