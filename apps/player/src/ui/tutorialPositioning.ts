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
}

export interface TutorialPosition {
  placement: TutorialPlacement;
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  arrowOffset: number;
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

/**
 * Places a tutorial card in one of the four free strips around its target.
 *
 * The returned rectangle is always separated from the target by TARGET_GAP.
 * A candidate that cannot provide enough room for a usable, scrollable card
 * is discarded instead of allowing the card to cover the control it explains.
 */
export function positionTutorialCoach(
  target: TutorialRect,
  coach: TutorialSize,
  viewport: TutorialViewport,
  avoidance: TutorialRect = target,
): TutorialPosition | null {
  const viewportWidth = Math.max(0, viewport.width);
  const viewportHeight = Math.max(0, viewport.height);
  const targetCenterX = target.left + target.width / 2;
  const targetCenterY = target.top + target.height / 2;
  const preferredWidth = Math.min(
    PREFERRED_WIDTH,
    viewportWidth - VIEWPORT_PADDING * 2,
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
      VIEWPORT_PADDING,
      viewportWidth - VIEWPORT_PADDING - preferredWidth,
    );
    const arrowOffset = clamp(
      targetCenterX - left,
      ARROW_EDGE_PADDING,
      preferredWidth - ARROW_EDGE_PADDING,
    );
    const fitsWithoutScroll = coach.height <= availableHeight;
    const preferredForTarget =
      placement === "bottom"
        ? targetCenterY < viewportHeight * 0.45
        : targetCenterY > viewportHeight * 0.55;
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
        (fitsWithoutScroll ? 10_000 : 0) +
        (preferredForTarget ? 1_000 : 0) +
        availableHeight,
    });
  };

  const addVerticalCandidate = (
    placement: "left" | "right",
    availableWidth: number,
    left: number,
  ) => {
    const width = Math.min(preferredWidth, availableWidth);
    const availableHeight = viewportHeight - VIEWPORT_PADDING * 2;
    if (
      width < MINIMUM_WIDTH ||
      availableHeight < MINIMUM_HEIGHT
    ) {
      return;
    }
    const height = Math.min(coach.height, availableHeight);
    const top = clamp(
      targetCenterY - height / 2,
      VIEWPORT_PADDING,
      viewportHeight - VIEWPORT_PADDING - height,
    );
    const arrowOffset = clamp(
      targetCenterY - top,
      ARROW_EDGE_PADDING,
      height - ARROW_EDGE_PADDING,
    );
    const fitsWithoutScroll =
      coach.width <= availableWidth && coach.height <= availableHeight;
    const preferredForTarget =
      placement === "right"
        ? targetCenterX < viewportWidth * 0.45
        : targetCenterX > viewportWidth * 0.55;
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
        (fitsWithoutScroll ? 10_000 : 0) +
        (preferredForTarget ? 1_000 : 0) +
        availableWidth,
    });
  };

  const topHeight =
    avoidance.top - TARGET_GAP - VIEWPORT_PADDING;
  const bottomTop = avoidance.bottom + TARGET_GAP;
  const bottomHeight =
    viewportHeight - VIEWPORT_PADDING - bottomTop;
  const leftWidth =
    avoidance.left - TARGET_GAP - VIEWPORT_PADDING;
  const rightLeft = avoidance.right + TARGET_GAP;
  const rightWidth =
    viewportWidth - VIEWPORT_PADDING - rightLeft;

  addHorizontalCandidate("top", topHeight, VIEWPORT_PADDING);
  addHorizontalCandidate("bottom", bottomHeight, bottomTop);
  addVerticalCandidate("left", leftWidth, VIEWPORT_PADDING);
  addVerticalCandidate("right", rightWidth, rightLeft);

  candidates.sort((first, second) => second.score - first.score);
  const winner = candidates[0];
  if (!winner) {
    return null;
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
