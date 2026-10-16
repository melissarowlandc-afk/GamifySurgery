/** Every verified write, including autosave, retires only the stale failure. */
export function clearRecoveredSaveNotices<T extends { definitionId: string }>(notices: T[]): T[] {
  return notices.some((notice) => notice.definitionId === "alert.system.save-failed")
    ? notices.filter((notice) => notice.definitionId !== "alert.system.save-failed") : notices;
}
