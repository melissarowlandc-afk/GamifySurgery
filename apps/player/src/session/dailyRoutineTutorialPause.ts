export type DailyRoutineTipId =
  | "sendout-management"
  | "sendout-trash"
  | "sendout-water";

export function isDailyRoutineTipId(value: string | null | undefined): value is DailyRoutineTipId {
  return value === "sendout-management" || value === "sendout-trash" || value === "sendout-water";
}

export function getDailyRoutinePauseTransition(input: {
  activeTipId: string | null | undefined;
  previousPaused: boolean | undefined;
  currentlyPaused: boolean;
  modeLocksPause: boolean;
}): "capture-and-pause" | "reassert-pause" | "keep-paused" | "release-resume" | "release-keep-paused" | "defer-release" | "none" {
  if (isDailyRoutineTipId(input.activeTipId)) {
    if (input.previousPaused === undefined) return "capture-and-pause";
    return input.currentlyPaused ? "keep-paused" : "reassert-pause";
  }
  if (input.previousPaused === undefined) return "none";
  if (input.modeLocksPause) return "defer-release";
  return input.previousPaused ? "release-keep-paused" : "release-resume";
}
