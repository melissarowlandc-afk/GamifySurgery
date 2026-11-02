/** Display only: never used to order or resolve saved campaign copies. */
export function campaignSavedTime(acceptedAtMs: number, now = Date.now()): string {
  if (!Number.isFinite(acceptedAtMs)) return "Saved time unavailable";
  const minutes = Math.floor(Math.max(0, now - acceptedAtMs) / 60_000);
  if (minutes < 1) return "Saved just now";
  if (minutes < 60) return `Saved ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Saved ${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Saved yesterday" : `Saved ${days} days ago`;
}
