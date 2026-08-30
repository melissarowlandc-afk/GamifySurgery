import type { CharacterDirection, CharacterPose } from "./characterArt";

/**
 * Presentation-only walking cadence. Side travel includes a legs-together
 * beat between the two stride extremes; front/back retain their approved
 * two-frame cadence.
 */
export function selectCharacterWalkingPose(
  moving: boolean,
  direction: CharacterDirection,
  cycleStep: number,
): CharacterPose {
  if (!moving) return "idle";
  const step = Math.max(0, Math.floor(cycleStep));
  if (direction !== "side") return step % 2 === 0 ? "walk-a" : "walk-b";
  return (["walk-a", "walk-neutral", "walk-b", "walk-neutral"] as const)[
    step % 4
  ]!;
}
