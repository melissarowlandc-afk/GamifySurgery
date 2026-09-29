import { describe, expect, it } from "vitest";
import { getDailyRoutinePauseTransition } from "./dailyRoutineTutorialPause";

describe("daily routine tutorial pause ownership", () => {
  it("captures a running clinic and restores it only after the final tip", () => {
    expect(getDailyRoutinePauseTransition({ activeTipId: "sendout-management", previousPaused: undefined, currentlyPaused: false, modeLocksPause: false })).toBe("capture-and-pause");
    expect(getDailyRoutinePauseTransition({ activeTipId: "sendout-trash", previousPaused: false, currentlyPaused: true, modeLocksPause: false })).toBe("keep-paused");
    expect(getDailyRoutinePauseTransition({ activeTipId: null, previousPaused: false, currentlyPaused: true, modeLocksPause: false })).toBe("release-resume");
  });

  it("preserves a manual pause and defers release while Management or Build owns it", () => {
    expect(getDailyRoutinePauseTransition({ activeTipId: "sendout-water", previousPaused: true, currentlyPaused: true, modeLocksPause: false })).toBe("keep-paused");
    expect(getDailyRoutinePauseTransition({ activeTipId: null, previousPaused: true, currentlyPaused: true, modeLocksPause: false })).toBe("release-keep-paused");
    expect(getDailyRoutinePauseTransition({ activeTipId: null, previousPaused: false, currentlyPaused: true, modeLocksPause: true })).toBe("defer-release");
  });

  it("reasserts its pause after a reload whose game-state write lagged the owner", () => {
    expect(
      getDailyRoutinePauseTransition({
        activeTipId: "sendout-management",
        previousPaused: false,
        currentlyPaused: false,
        modeLocksPause: false,
      }),
    ).toBe("reassert-pause");
  });
});
