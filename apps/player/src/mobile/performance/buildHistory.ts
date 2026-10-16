export const MOBILE_BUILD_UNDO_LIMIT = 30;

/** Trim the oldest paired entries. The retained newest undo chain is exact. */
export function trimMobileBuildHistory<T>(states: T[], labels: string[]): void {
  const excess = states.length - MOBILE_BUILD_UNDO_LIMIT;
  if (excess > 0) { states.splice(0, excess); labels.splice(0, excess); }
}
