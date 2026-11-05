/** Keep all current rows and a small recent window, rather than every ID ever
 * shown during this document's lifetime. This cursor never owns game history. */
export function retainPresentationIds(previous: ReadonlySet<string>, current: Iterable<string>, recentLimit = 128): Set<string> {
  const live = new Set(current);
  const recent: string[] = [];
  for (const id of previous) if (!live.has(id)) recent.push(id);
  return new Set([...recent.slice(-recentLimit), ...live]);
}
