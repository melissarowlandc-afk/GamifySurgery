import { describe, expect, it } from "vitest";
import { getDailyRoutinePauseTransition, normalizeRetiredTutorialPauses } from "./dailyRoutineTutorialPause";

describe("retired operations pause compatibility", () => {
  it("retains an explicit ambiguous owner conservatively and never fabricates an absent owner", () => {
    expect(normalizeRetiredTutorialPauses({running: false, paused: true, unknown: null, old: "unknown"})).toEqual({running: false, paused: true, unknown: true, old: true});
    expect(normalizeRetiredTutorialPauses(undefined)).toEqual({});
    expect(normalizeRetiredTutorialPauses([])).toEqual({});
  });
  it.each(["sendout-management", "sendout-trash", "sendout-water", "second-sendout-wait", null])("never acquires a new pause for %s", (activeTipId) => {
    expect(getDailyRoutinePauseTransition({activeTipId, previousPaused: undefined, currentlyPaused: false, modeLocksPause: false})).toBe("none");
  });
  it("releases old running ownership idempotently, including an interrupted state write", () => {
    for (const currentlyPaused of [true, false]) expect(getDailyRoutinePauseTransition({activeTipId: "sendout-management", previousPaused: false, currentlyPaused, modeLocksPause: false})).toBe("release-resume");
    expect(getDailyRoutinePauseTransition({activeTipId: null, previousPaused: undefined, currentlyPaused: false, modeLocksPause: false})).toBe("none");
  });
  it("preserves manual pause and defers all releases under Build, Management or Help", () => {
    expect(getDailyRoutinePauseTransition({activeTipId: null, previousPaused: true, currentlyPaused: true, modeLocksPause: false})).toBe("release-keep-paused");
    expect(getDailyRoutinePauseTransition({activeTipId: null, previousPaused: true, currentlyPaused: false, modeLocksPause: false})).toBe("release-keep-paused");
    for (const previousPaused of [false,true]) expect(getDailyRoutinePauseTransition({activeTipId: null, previousPaused, currentlyPaused: true, modeLocksPause: true})).toBe("defer-release");
  });
});
