import { describe, expect, it } from "vitest";
import {
  positionTutorialCoach,
  tutorialRectsOverlap,
  type TutorialRect,
} from "./tutorialPositioning";

function rect(
  left: number,
  top: number,
  width: number,
  height: number,
): TutorialRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

describe("tutorial coach positioning", () => {
  const coach = { width: 390, height: 250 };

  it.each([
    ["wide patient rail", { width: 1440, height: 1000 }, rect(16, 220, 210, 76)],
    ["compact patient rail", { width: 1024, height: 768 }, rect(12, 190, 190, 72)],
    ["wide answer list", { width: 1440, height: 1000 }, rect(760, 610, 410, 250)],
    ["compact answer list", { width: 1024, height: 768 }, rect(410, 470, 360, 220)],
    ["wide goals rail", { width: 1440, height: 1000 }, rect(1160, 390, 260, 340)],
    ["compact goals rail", { width: 1024, height: 768 }, rect(780, 330, 230, 320)],
    ["center facility", { width: 1440, height: 1000 }, rect(270, 240, 850, 470)],
  ])("does not cover %s", (_name, viewport, target) => {
    const result = positionTutorialCoach(target, coach, viewport);
    expect(result).not.toBeNull();
    const card = {
      left: result!.left,
      top: result!.top,
      right: result!.left + result!.width,
      bottom:
        result!.top + Math.min(coach.height, result!.maxHeight),
    };
    expect(tutorialRectsOverlap(card, target)).toBe(false);
    expect(card.left).toBeGreaterThanOrEqual(0);
    expect(card.top).toBeGreaterThanOrEqual(0);
    expect(card.right).toBeLessThanOrEqual(viewport.width);
    expect(card.bottom).toBeLessThanOrEqual(viewport.height);
  });

  it("returns no placement instead of covering a target filling the viewport", () => {
    expect(
      positionTutorialCoach(
        rect(0, 0, 320, 480),
        coach,
        { width: 320, height: 480 },
      ),
    ).toBeNull();
  });

  it("protects a larger chart while aiming at controls inside it", () => {
    const viewport = { width: 1440, height: 1000 };
    const chart = rect(245, 495, 900, 445);
    const answerList = rect(600, 740, 360, 130);
    const result = positionTutorialCoach(
      answerList,
      coach,
      viewport,
      chart,
    );

    expect(result).not.toBeNull();
    const card = {
      left: result!.left,
      top: result!.top,
      right: result!.left + result!.width,
      bottom:
        result!.top + Math.min(coach.height, result!.maxHeight),
    };
    expect(tutorialRectsOverlap(card, chart)).toBe(false);
  });
});
