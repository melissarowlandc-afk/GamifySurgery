import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { characterBitmapLayers } from "../art/characterBitmapArt";
import type { CharacterPose } from "../art/characterArt";
import {
  advanceRouteMotion,
  sampleRouteMotion,
  syncRouteMotion,
} from "./routeMotion";

export interface LateralGaitProofFrame {
  travel: "west" | "east";
  pose: Extract<CharacterPose, "walk-a" | "walk-neutral" | "walk-b">;
  movingRight: boolean;
  atlasId: string;
  flipX: boolean;
  walkFrame: number;
}

/**
 * Development/QA trace that exercises the same cardinal route sampler and
 * bitmap resolver as FacilityScene. It deliberately samples consecutive
 * moving phases, rather than presenting manually-picked atlas frames.
 */
export function traceLateralGaitRoute(
  appearance: PixelAppearanceDescriptor,
): readonly LateralGaitProofFrame[] {
  const frames: LateralGaitProofFrame[] = [];
  for (const travel of ["west", "east"] as const) {
    const startX = travel === "west" ? 4 : 0;
    const delta = travel === "west" ? -1 : 1;
    const track = syncRouteMotion(undefined, {
      path: Array.from({ length: 6 }, (_, index) => ({
        x: startX + delta * index,
        y: 2,
      })),
      pathIndex: 0,
      lookaheadPathNodes: 2,
    });
    if (!track) throw new Error("QA lateral route must create a motion track.");
    let movingTrack = track;
    for (let phase = 0; phase < 3; phase += 1) {
      movingTrack = advanceRouteMotion(movingTrack, 80, 1);
      const sample = sampleRouteMotion(movingTrack);
      const pose = sample.moving ? "walk-neutral" : "idle";
      if (
        sample.direction !== "side" ||
        pose !== "walk-neutral"
      ) {
        throw new Error("QA lateral route unexpectedly stopped before all gait phases.");
      }
      const actor = characterBitmapLayers(
        appearance,
        sample.direction,
        pose,
        sample.rightFacing,
        undefined,
        phase,
      )?.actor;
      if (!actor) throw new Error("QA lateral route requires a registered still identity.");
      frames.push({
        travel,
        pose,
        movingRight: sample.rightFacing,
        atlasId: actor.atlas.id,
        flipX: actor.flipX,
        walkFrame: phase,
      });
    }
  }
  return frames;
}
