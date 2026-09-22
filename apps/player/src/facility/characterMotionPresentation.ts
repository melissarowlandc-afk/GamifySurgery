import type { CharacterDirection, CharacterPose } from "../art/characterArt";

export type CharacterRenderRepresentation = "bitmap" | "procedural";

export interface CharacterPresentationViewport {
  readonly originX: number;
  readonly originY: number;
  readonly tileSize: number;
}

export interface CharacterMotionPresentation<TAppearance> {
  readonly anchorXInTiles: number;
  readonly anchorYInTiles: number;
  readonly direction: CharacterDirection;
  readonly pose: CharacterPose;
  readonly rightFacing: boolean;
  readonly displayScale: number;
  readonly appearance: TAppearance;
  readonly representation: CharacterRenderRepresentation;
}

export interface CharacterMotionCandidate<TAppearance> {
  readonly centerX: number;
  readonly baseY: number;
  readonly direction: CharacterDirection;
  readonly pose: CharacterPose;
  readonly rightFacing: boolean;
  readonly displayScale: number;
  readonly appearance: TAppearance;
}

export function captureCharacterMotionPresentation<TAppearance>(
  candidate: CharacterMotionCandidate<TAppearance>,
  viewport: CharacterPresentationViewport,
  representation: CharacterRenderRepresentation,
): CharacterMotionPresentation<TAppearance> {
  const tileSize = Math.max(1, viewport.tileSize);
  return {
    anchorXInTiles: (candidate.centerX - viewport.originX) / tileSize,
    anchorYInTiles: (candidate.baseY - viewport.originY) / tileSize,
    direction: candidate.direction,
    pose: candidate.pose,
    rightFacing: candidate.rightFacing,
    displayScale: candidate.displayScale,
    appearance: candidate.appearance,
    representation,
  };
}

export function replayCharacterMotionPresentation<TAppearance>(
  snapshot: CharacterMotionPresentation<TAppearance>,
  viewport: CharacterPresentationViewport,
): CharacterMotionCandidate<TAppearance> & { readonly representation: CharacterRenderRepresentation } {
  return {
    centerX: viewport.originX + snapshot.anchorXInTiles * viewport.tileSize,
    baseY: viewport.originY + snapshot.anchorYInTiles * viewport.tileSize,
    direction: snapshot.direction,
    pose: snapshot.pose,
    rightFacing: snapshot.rightFacing,
    displayScale: snapshot.displayScale,
    appearance: snapshot.appearance,
    representation: snapshot.representation,
  };
}

/** Uses the cached rendered state during a pause, while allowing a camera
 * layout change to reproject its normalized world anchor. */
export function resolveCharacterMotionPresentation<TAppearance>(
  snapshot: CharacterMotionPresentation<TAppearance> | undefined,
  candidate: CharacterMotionCandidate<TAppearance>,
  viewport: CharacterPresentationViewport,
): CharacterMotionCandidate<TAppearance> & {
  readonly representation?: CharacterRenderRepresentation;
} {
  return snapshot
    ? replayCharacterMotionPresentation(snapshot, viewport)
    : candidate;
}

/** Floor stops face the south-facing player camera; occupied furniture poses
 * remain selected by the semantic presentation layer. */
export function stationaryFloorDirection(
  moving: boolean,
  direction: CharacterDirection,
  hasDestinationPose: boolean,
): CharacterDirection {
  return !moving && !hasDestinationPose ? "front" : direction;
}
