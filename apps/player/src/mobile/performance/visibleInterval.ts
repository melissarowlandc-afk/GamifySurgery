type TimerHost = Pick<Window, "setInterval" | "clearInterval" | "addEventListener" | "removeEventListener">;
type VisibilityHost = Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">;
const foregroundBindings = new WeakMap<VisibilityHost, Set<() => void>>();

/** Reuse the existing iOS clock watchdog: Safari can return with an updated
 * document visibility but omit lifecycle events. No extra hidden poll is added. */
export function wakeVisibleIntervals(doc: VisibilityHost): void {
  if (doc.visibilityState !== "hidden") for (const wake of foregroundBindings.get(doc) ?? []) wake();
}

/** Polling cannot run usefully while hidden or in the back/forward cache.
 * Lifecycle handlers still own their one final flush; no catch-up work is run. */
export function bindVisibleInterval(browser: TimerHost, doc: VisibilityHost, work: () => void, ms: number): () => void {
  let timer: number | undefined, disposed = false, pageHidden = false;
  const set = browser.setInterval?.bind(browser) ?? ((fn: () => void, delay: number) => globalThis.setInterval(fn, delay) as unknown as number);
  const clear = browser.clearInterval?.bind(browser) ?? ((id: number) => globalThis.clearInterval(id));
  const stop = () => { if (timer !== undefined) clear(timer); timer = undefined; };
  const reconcile = () => {
    if (disposed || pageHidden || doc.visibilityState === "hidden") { stop(); return; }
    if (timer === undefined) timer = set(() => {
      if (!disposed && !pageHidden && doc.visibilityState !== "hidden") work();
    }, ms);
  };
  const hide = () => { pageHidden = true; stop(); };
  const show = () => { pageHidden = false; reconcile(); };
  let bindings = foregroundBindings.get(doc);
  if (!bindings) { bindings = new Set(); foregroundBindings.set(doc, bindings); }
  bindings.add(show);
  doc.addEventListener("visibilitychange", reconcile);
  browser.addEventListener("pagehide", hide); browser.addEventListener("pageshow", show);
  reconcile();
  return () => { disposed = true; stop(); doc.removeEventListener("visibilitychange", reconcile);
    browser.removeEventListener("pagehide", hide); browser.removeEventListener("pageshow", show); bindings.delete(show); };
}
