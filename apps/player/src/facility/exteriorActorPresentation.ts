/**
 * Maps the domain's unchanged logical sidewalk row onto the rendered sidewalk.
 * The final route tile still eases to the pavement baseline without changing
 * the logical route or introducing a visual grass setback.
 */
export interface ExteriorActorPresentationLayout {
  readonly originY: number;
  readonly tileSize: number;
  readonly sidewalkTop: number;
  readonly sidewalkHeight: number;
  readonly gridRows: number;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number): number {
  const clamped = clamp(value);
  return clamped * clamped * (3 - 2 * clamped);
}

export function getActorPresentationBaseY(
  logicalY: number,
  baseOffset: number,
  layout: ExteriorActorPresentationLayout,
): number {
  const generic = layout.originY + (logicalY + baseOffset) * layout.tileSize;
  const transitionStart = layout.gridRows - 1;
  if (logicalY <= transitionStart) return generic;

  const rowBaseline = layout.originY + (layout.gridRows + baseOffset) * layout.tileSize;
  // A baseline slightly below the sidewalk's middle reads as grounded while
  // leaving the curb/top seam visible above and below the actor's feet.
  const sidewalkBaseline = layout.sidewalkTop + layout.sidewalkHeight * 0.58;
  const progress = smoothstep(logicalY - transitionStart);
  return generic + progress * (sidewalkBaseline - rowBaseline);
}
