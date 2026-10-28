import type { PlaytimeTracker } from "./playtimeTracker";

/** Web Locks is origin/account scoped and atomic across tabs. No device identifier. */
export function bindBrowserUsage(tracker: PlaytimeTracker, accountId: string, browser: Window,
  doc: Document, locks: LockManager | undefined = browser.navigator.locks): () => void {
  let disposed = false, requesting = false, release: (() => void) | undefined;
  const takeLease = () => {
    if (disposed || requesting || release || doc.visibilityState !== "visible" || !locks) return;
    requesting = true;
    void locks.request(`gamify-surgery.usage.${accountId}`, { mode: "exclusive", ifAvailable: true }, async (lock) => {
      if (!lock || disposed) return;
      await new Promise<void>((resolve) => { release = resolve; tracker.setLease(true); });
      tracker.setLease(false); release = undefined;
    }).catch(() => { tracker.setLease(false); }).finally(() => { requesting = false; });
  };
  const relinquish = () => { tracker.setLease(false); release?.(); };
  const visibility = () => {
    const visible = doc.visibilityState === "visible";
    tracker.setVisible(visible);
    if (visible) takeLease(); else relinquish();
  };
  const input = (event: Event) => {
    if (!event.isTrusted || doc.visibilityState !== "visible") return;
    if (event.type === "pointermove" && !(event as PointerEvent).buttons) return;
    if (event.type === "keydown" && ((event as KeyboardEvent).repeat ||
      ["Shift", "Control", "Alt", "Meta", "CapsLock"].includes((event as KeyboardEvent).key))) return;
    tracker.activity();
  };
  const pagehide = () => { tracker.pagehide(); relinquish(); };
  const online = () => { void tracker.refreshAccess().then(() => tracker.flush()); };
  const visibilityChange = () => {
    visibility();
    if (doc.visibilityState === "visible") online();
  };
  const activityEvents = ["pointerdown", "click", "pointermove", "touchstart", "keydown", "wheel"];
  for (const type of activityEvents) doc.addEventListener(type, input, { capture: true, passive: true });
  doc.addEventListener("visibilitychange", visibilityChange);
  browser.addEventListener("pagehide", pagehide);
  browser.addEventListener("pageshow", visibilityChange);
  browser.addEventListener("online", online);
  const timer = browser.setInterval(() => { takeLease(); tracker.tick(); }, 1_000);
  visibility();
  return () => {
    disposed = true;
    browser.clearInterval(timer);
    for (const type of activityEvents) doc.removeEventListener(type, input, true);
    doc.removeEventListener("visibilitychange", visibilityChange);
    browser.removeEventListener("pagehide", pagehide);
    browser.removeEventListener("pageshow", visibilityChange);
    browser.removeEventListener("online", online);
    relinquish();
  };
}
