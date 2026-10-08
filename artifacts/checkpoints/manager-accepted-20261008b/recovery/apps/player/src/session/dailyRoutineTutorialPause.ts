export type DailyRoutineTipId =
  | "sendout-management"
  | "sendout-trash"
  | "sendout-water";

export function isDailyRoutineTipId(value: string | null | undefined): value is DailyRoutineTipId {
  return value === "sendout-management" || value === "sendout-trash" || value === "sendout-water";
}

/** An explicit ambiguous owner never authorizes resuming a saved clinic. */
export function normalizeRetiredTutorialPauses(value: unknown): Record<string, boolean> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([id, prior]) => [id, prior === false ? false : true]));
}

export function getDailyRoutinePauseTransition(input: {
  activeTipId: string | null | undefined;
  previousPaused: boolean | undefined;
  currentlyPaused: boolean;
  modeLocksPause: boolean;
}): "release-resume" | "release-keep-paused" | "defer-release" | "none" {
  // Retired cards never acquire a new pause. Keep this adapter until all old
  // owners have been reconciled, including an interrupted two-write release.
  if (input.previousPaused === undefined) return "none";
  if (input.modeLocksPause) return "defer-release";
  return input.previousPaused ? "release-keep-paused" : "release-resume";
}
