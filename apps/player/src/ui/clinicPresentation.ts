export const CLINIC_PRESENTATION_EVENT = "clinic-presentation";
export const CLINIC_PRESENTATION_RETRY = "clinic-presentation-retry";
export type ClinicPresentation = "waiting" | "ready" | "failed";
interface RenderEvents { on(event: string, callback: () => void): unknown; off(event: string, callback: () => void): unknown }

/** A retained host can get a fresh canvas after suspension. Invalidate its old
 * ready frame before paint, without waking a map merely because it was hidden. */
export function markOpeningFramePending(host: HTMLElement) {
  const prior = host.getAttribute("data-clinic-frame");
  host.setAttribute("data-clinic-frame", "waiting");
  if (prior !== "waiting") host.dispatchEvent(new Event(CLINIC_PRESENTATION_EVENT, { bubbles: true }));
}

/** POST_RENDER proves a real frame. Art settling alone or canvas insertion does not. */
export function bindOpeningFrame(host: HTMLElement, events: RenderEvents, status: () => ClinicPresentation, retry: () => void) {
  let last: ClinicPresentation = "waiting";
  markOpeningFramePending(host);
  const rendered = () => {
    const next = status();
    if (last === next) return;
    last = next; host.setAttribute("data-clinic-frame", next);
    host.dispatchEvent(new Event(CLINIC_PRESENTATION_EVENT, { bubbles: true }));
    if (next === "ready") events.off("postrender", rendered);
  };
  const restart = () => retry();
  events.on("postrender", rendered);
  host.addEventListener(CLINIC_PRESENTATION_RETRY, restart);
  return () => { events.off("postrender", rendered); host.removeEventListener(CLINIC_PRESENTATION_RETRY, restart); host.removeAttribute("data-clinic-frame"); };
}
