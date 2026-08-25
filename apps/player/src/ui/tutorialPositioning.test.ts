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

  it("uses an explicit non-pointing dock when a target fills the viewport", () => {
    const result = positionTutorialCoach(
      rect(0, 0, 320, 480),
      coach,
      { width: 320, height: 480 },
    );

    expect(result.docked).toBe(true);
    expect(result).toMatchObject({
      placement: "top",
      top: 12,
      left: 12,
      width: 296,
    });
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

  it("keeps the previous side while that placement remains valid", () => {
    const viewport = { width: 1440, height: 1000 };
    const target = rect(650, 450, 140, 100);
    const first = positionTutorialCoach(
      target,
      coach,
      viewport,
    );
    const retained = positionTutorialCoach(
      target,
      coach,
      viewport,
      target,
      "right",
    );

    expect(first.docked).toBe(false);
    expect(retained.docked).toBe(false);
    expect(retained.placement).toBe("right");
  });

  it("abandons a preferred side only when it is no longer usable", () => {
    const viewport = { width: 1024, height: 768 };
    const target = rect(850, 260, 150, 100);
    const result = positionTutorialCoach(
      target,
      coach,
      viewport,
      target,
      "right",
    );

    expect(result.docked).toBe(false);
    expect(result.placement).not.toBe("right");
  });

  it("honors an offset VisualViewport and keeps the card inside it", () => {
    const viewport = {
      left: 24,
      top: 80,
      width: 412,
      height: 740,
    };
    const target = rect(160, 610, 160, 54);
    const result = positionTutorialCoach(
      target,
      { width: 388, height: 190 },
      viewport,
    );

    expect(result.left).toBeGreaterThanOrEqual(36);
    expect(result.top).toBeGreaterThanOrEqual(92);
    expect(result.left + result.width).toBeLessThanOrEqual(424);
    expect(
      result.top + Math.min(190, result.maxHeight),
    ).toBeLessThanOrEqual(808);
  });

  it("docks at the edge opposite a target when no strip can fit", () => {
    const viewport = { width: 320, height: 480 };
    const upperTarget = rect(0, 0, 320, 430);
    const result = positionTutorialCoach(
      upperTarget,
      coach,
      viewport,
      upperTarget,
    );

    expect(result.docked).toBe(true);
    expect(result.placement).toBe("bottom");
    expect(result.top + result.maxHeight).toBe(468);
  });
});
