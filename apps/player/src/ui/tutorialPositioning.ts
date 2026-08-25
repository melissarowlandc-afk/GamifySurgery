export type TutorialPlacement = "top" | "right" | "bottom" | "left";

export interface TutorialRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface TutorialSize {
  width: number;
  height: number;
}

export interface TutorialViewport {
  width: number;
  height: number;
  /**
   * Optional origin for callers whose targets and fixed-position surface
   * intentionally share a translated coordinate space. Browser DOM targets
   * use getBoundingClientRect(), so TutorialCoach normally supplies 0,0.
   */
  left?: number;
  top?: number;
}

export interface TutorialPosition {
  placement: TutorialPlacement;
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  arrowOffset: number;
  /**
   * A docked card is intentionally not pretending to point at the target.
   * This is the deterministic last resort when no non-overlapping strip is
   * large enough for a usable coach.
   */
  docked: boolean;
}

const VIEWPORT_PADDING = 12;
const TARGET_GAP = 16;
const PREFERRED_WIDTH = 390;
const MINIMUM_WIDTH = 250;
const MINIMUM_HEIGHT = 112;
const ARROW_EDGE_PADDING = 24;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

interface Candidate extends TutorialPosition {
  score: number;
}

function viewportBounds(viewport: TutorialViewport): TutorialRect {
  const left = viewport.left ?? 0;
  const top = viewport.top ?? 0;
  const width = Math.max(0, viewport.width);
  const height = Math.max(0, viewport.height);
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

/**
 * Produces a stable, non-pointing fallback. The card is docked at the edge
 * opposite the target so it obscures as little relevant content as possible.
 */
export function dockTutorialCoach(
  target: TutorialRect | null,
  coach: TutorialSize,
  viewport: TutorialViewport,
): TutorialPosition {
  const bounds = viewportBounds(viewport);
  const width = Math.max(
    0,
    Math.min(PREFERRED_WIDTH, bounds.width - VIEWPORT_PADDING * 2),
  );
  const availableHeight = Math.max(
    0,
    bounds.height - VIEWPORT_PADDING * 2,
  );
  const maxDockedHeight = Math.min(
    availableHeight,
    Math.max(MINIMUM_HEIGHT, bounds.height * 0.44),
  );
  const height = Math.min(
    Math.max(MINIMUM_HEIGHT, coach.height),
    maxDockedHeight,
  );
  const targetCenterY = target
    ? target.top + target.height / 2
    : bounds.top + bounds.height / 2;
  const dockAtBottom =
    target !== null &&
    targetCenterY < bounds.top + bounds.height / 2;
  const top = dockAtBottom
    ? bounds.bottom - VIEWPORT_PADDING - height
    : bounds.top + VIEWPORT_PADDING;

  return {
    placement: dockAtBottom ? "bottom" : "top",
    top,
    left: bounds.left + (bounds.width - width) / 2,
    width,
    maxHeight: height,
    arrowOffset: width / 2,
    docked: true,
  };
}

/**
 * Places a tutorial card in one of the four free strips around its target.
 *
 * The returned rectangle is always separated from the target by TARGET_GAP.
 * A candidate that cannot provide enough room for a usable, scrollable card
 * is discarded instead of allowing the card to cover the control it explains.
 * When no strip is usable, the result is a deterministic docked card without
 * a pointer rather than a misleading arrow over the target.
 */
export function positionTutorialCoach(
  target: TutorialRect,
  coach: TutorialSize,
  viewport: TutorialViewport,
  avoidance: TutorialRect = target,
  preferredPlacement?: TutorialPlacement,
): TutorialPosition {
  const bounds = viewportBounds(viewport);
  const viewportWidth = bounds.width;
  const viewportHeight = bounds.height;
  const targetCenterX = target.left + target.width / 2;
  const targetCenterY = target.top + target.height / 2;
  const preferredWidth = Math.max(
    0,
    Math.min(
      PREFERRED_WIDTH,
      viewportWidth - VIEWPORT_PADDING * 2,
    ),
  );
  const candidates: Candidate[] = [];

  const addHorizontalCandidate = (
    placement: "top" | "bottom",
    availableHeight: number,
    top: number,
  ) => {
    if (
      preferredWidth < MINIMUM_WIDTH ||
      availableHeight < MINIMUM_HEIGHT
    ) {
      return;
    }
    const height = Math.min(coach.height, availableHeight);
    const left = clamp(
      targetCenterX - preferredWidth / 2,
      bounds.left + VIEWPORT_PADDING,
      bounds.right - VIEWPORT_PADDING - preferredWidth,
    );
    const arrowOffset = clamp(
      targetCenterX - left,
      ARROW_EDGE_PADDING,
      preferredWidth - ARROW_EDGE_PADDING,
    );
    const fitsWithoutScroll = coach.height <= availableHeight;
    const preferredForTarget =
      placement === "bottom"
        ? targetCenterY <
          bounds.top + viewportHeight * 0.45
        : targetCenterY >
          bounds.top + viewportHeight * 0.55;
    candidates.push({
      placement,
      top:
        placement === "top"
          ? top + availableHeight - height
          : top,
      left,
      width: preferredWidth,
      maxHeight: availableHeight,
      arrowOffset,
      score:
        (placement === preferredPlacement ? 100_000 : 0) +
        (fitsWithoutScroll ? 10_000 : 0) +
        (preferredForTarget ? 1_000 : 0) +
        availableHeight,
      docked: false,
    });
  };

  const addVerticalCandidate = (
    placement: "left" | "right",
    availableWidth: number,
    left: number,
  ) => {
    const width = Math.min(preferredWidth, availableWidth);
    const availableHeight = bounds.height - VIEWPORT_PADDING * 2;
    if (
      width < MINIMUM_WIDTH ||
      availableHeight < MINIMUM_HEIGHT
    ) {
      return;
    }
    const height = Math.min(coach.height, availableHeight);
    const top = clamp(
      targetCenterY - height / 2,
      bounds.top + VIEWPORT_PADDING,
      bounds.bottom - VIEWPORT_PADDING - height,
    );
    const arrowOffset = clamp(
      targetCenterY - top,
      ARROW_EDGE_PADDING,
      height - ARROW_EDGE_PADDING,
    );
    const fitsWithoutScroll =
      preferredWidth <= availableWidth &&
      coach.height <= availableHeight;
    const preferredForTarget =
      placement === "right"
        ? targetCenterX <
          bounds.left + viewportWidth * 0.45
        : targetCenterX >
          bounds.left + viewportWidth * 0.55;
    candidates.push({
      placement,
      top,
      left:
        placement === "left"
          ? left + availableWidth - width
          : left,
      width,
      maxHeight: availableHeight,
      arrowOffset,
      score:
        (placement === preferredPlacement ? 100_000 : 0) +
        (fitsWithoutScroll ? 10_000 : 0) +
        (preferredForTarget ? 1_000 : 0) +
        availableWidth,
      docked: false,
    });
  };

  const topHeight =
    avoidance.top - TARGET_GAP - bounds.top - VIEWPORT_PADDING;
  const bottomTop = avoidance.bottom + TARGET_GAP;
  const bottomHeight =
    bounds.bottom - VIEWPORT_PADDING - bottomTop;
  const leftWidth =
    avoidance.left - TARGET_GAP - bounds.left - VIEWPORT_PADDING;
  const rightLeft = avoidance.right + TARGET_GAP;
  const rightWidth =
    bounds.right - VIEWPORT_PADDING - rightLeft;

  addHorizontalCandidate(
    "top",
    topHeight,
    bounds.top + VIEWPORT_PADDING,
  );
  addHorizontalCandidate("bottom", bottomHeight, bottomTop);
  addVerticalCandidate(
    "left",
    leftWidth,
    bounds.left + VIEWPORT_PADDING,
  );
  addVerticalCandidate("right", rightWidth, rightLeft);

  candidates.sort((first, second) => second.score - first.score);
  const winner = candidates[0];
  if (!winner) {
    return dockTutorialCoach(target, coach, viewport);
  }

  const { score: _score, ...position } = winner;
  return position;
}

export function tutorialRectsOverlap(
  first: Pick<TutorialRect, "top" | "right" | "bottom" | "left">,
  second: Pick<TutorialRect, "top" | "right" | "bottom" | "left">,
): boolean {
  return !(
    first.right <= second.left ||
    first.left >= second.right ||
    first.bottom <= second.top ||
    first.top >= second.bottom
  );
}
