import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { INTRO_TAGLINES, readLastIntroTagline, selectIntroTagline, type IntroTagline } from "../content/introTaglines";
import { subscribeEntryWork } from "../session/cloud/entryTimings";
import { ENTRY_LOADING_PHASE, LoadingFlow } from "./loadingFlow";
import { LoadingFlowContext, useLoadingFlow } from "./LoadingFlowContext";
import { WelcomeArtwork, welcomeSurfaceStyle } from "./WelcomeArtwork";
import { OpeningBrand } from "./OpeningBrand";
import "./LoadingScreen.css";

export const LOADING_SURFACE_ID = "clinic-loading-screen";

/** The provider itself never depends on auth/session/campaign keys. */
export function ContinuousLoading({ children }: { children: ReactNode }) {
  const parent = useLoadingFlow();
  return parent ? <>{children}</> : <LoadingOwner>{children}</LoadingOwner>;
}
function LoadingOwner({ children }: { children: ReactNode }) {
  const [flow] = useState(() => new LoadingFlow(true));
  useEffect(() => {
    const unsubscribe = subscribeEntryWork((stage, complete) => {
      const phase = ENTRY_LOADING_PHASE[stage]; if (phase) flow.advance(phase, complete);
    });
    return () => { unsubscribe(); flow.dispose(); };
  }, [flow]);
  return <LoadingFlowContext.Provider value={flow}>{children}<PersistentSurface flow={flow} /></LoadingFlowContext.Provider>;
}

function openingSurface(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById?.(LOADING_SURFACE_ID);
  if (existing) return existing;
  const surface = document.createElement("section"); surface.setAttribute("id", LOADING_SURFACE_ID);
  document.body.appendChild(surface); return surface;
}

function PersistentSurface({ flow }: { flow: LoadingFlow }) {
  const state = useSyncExternalStore(flow.subscribe, flow.getSnapshot, flow.getSnapshot);
  const [surface] = useState(openingSurface);
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => { setMounted(true); }, []);
  // Reparent the already decoded bootstrap picture in the same commit. Reusing
  // its actual image avoids an async-decode flash at the HTML -> React handoff.
  const [bootArtwork] = useState(() => surface?.querySelector<HTMLElement>("[data-loading-bootstrap] picture") ?? null);
  const adoptArtwork = useCallback((scene: HTMLDivElement | null) => { if (scene && bootArtwork) scene.appendChild(bootArtwork); }, [bootArtwork]);
  const [tagline] = useState<IntroTagline>(() => {
    const boot = surface?.getAttribute("data-loading-tagline");
    return INTRO_TAGLINES.find(line => line === boot) ?? selectIntroTagline(readLastIntroTagline());
  });
  const reportRef = useCallback((slot: HTMLDivElement | null) => flow.attachReportSlot(slot), [flow]);
  const restoredFocus = useRef<Element | null>(null);
  useLayoutEffect(() => {
    if (!surface || !mounted) return;
    // Keep the external section itself: preboot -> React -> every auth/route
    // transition uses the same node. Retire static children only after commit.
    surface.querySelector?.("[data-loading-bootstrap]")?.remove();
    surface.setAttribute("data-loading-managed", "true");
    surface.setAttribute("role", "region"); surface.setAttribute("aria-label", "Loading clinic");
    surface.setAttribute("tabindex", "-1");
    for (const [key, value] of Object.entries(welcomeSurfaceStyle)) surface.style.setProperty?.(key, String(value));
  }, [surface, mounted]);
  useLayoutEffect(() => {
    if (!surface || !mounted) return;
    surface.hidden = !state.visible;
    if (state.visible) surface.removeAttribute("hidden"); else surface.setAttribute("hidden", "");
    surface.setAttribute("class", `welcome-surface loading-screen${state.failure ? " has-error" : ""}`);
    surface.setAttribute("data-loading-state", state.visible ? state.failure ? "failed" : "waiting" : "resting");
    surface.setAttribute("data-loading-progress", String(state.progress));
    surface.setAttribute("data-loading-epoch", String(state.epoch));
  }, [surface, mounted, state.visible, state.failure, state.progress, state.epoch]);
  useLayoutEffect(() => {
    if (!surface || !mounted || !state.visible) return;
    restoredFocus.current = document.activeElement;
    let restoreInert = () => {};
    let currentHost: Element | null = null;
    const place = () => {
      const dialogs = Array.from(document.querySelectorAll?.<HTMLDialogElement>("dialog[open]") ?? [])
        .filter(dialog => !dialog.classList?.contains("problem-report-dialog"));
      const host = dialogs.at(-1) ?? document.body;
      if (surface.parentElement === host && currentHost === host) return;
      currentHost = host;
      const modalFocus = document.activeElement;
      if (host !== document.body && modalFocus && host.contains(modalFocus) && !surface.contains(modalFocus)) restoredFocus.current = modalFocus;
      if (surface.parentElement !== host) { restoreInert(); host.appendChild(surface); }
      const siblings = Array.from(host.children ?? host.childNodes)
        .filter(node => node !== surface && !node.contains(surface)) as HTMLElement[];
      // This host can receive a restored native chart after our first commit.
      // Rehome above its top-layer backdrop without remounting the surface.
      restoreInert();
      const inert = siblings.map(node => [node, node.inert] as const);
      for (const [node] of inert) node.inert = true;
      restoreInert = () => { for (const [node, value] of inert) node.inert = value; };
      surface.focus({ preventScroll: true });
    };
    place();
    const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(place);
    observer?.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    return () => {
      observer?.disconnect(); restoreInert();
      if (surface.parentElement !== document.body) document.body.appendChild(surface);
      const previous = restoredFocus.current;
      if (previous instanceof HTMLElement && previous !== document.body && document.body.contains(previous)) previous.focus({ preventScroll: true });
      else {
        const main = document.querySelector<HTMLElement>("main");
        if (main) { const index = main.getAttribute("tabindex"); main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true });
          if (index === null) main.removeAttribute("tabindex"); else main.setAttribute("tabindex", index); }
      }
    };
  }, [surface, mounted, state.visible]);
  useEffect(() => {
    if (!surface || !mounted) return;
    const key = (event: KeyboardEvent) => {
      if (!state.visible || !surface.contains(event.target as Node)) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); }
      if (event.key !== "Tab") return;
      const targets = Array.from(surface.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"));
      if (!targets.length) { event.preventDefault(); return; }
      const first = targets[0]!, last = targets.at(-1)!;
      if (event.shiftKey && (document.activeElement === surface || document.activeElement === first)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    surface.addEventListener("keydown", key); return () => surface.removeEventListener("keydown", key);
  }, [surface, mounted, state.visible]);
  if (!surface || !mounted) return null;
  const message = state.failure || state.status;
  return createPortal(<div className="loading-screen-inner" data-react-loading-content="true">
    <div className="loading-screen-scene" ref={adoptArtwork}>{bootArtwork ? null : <WelcomeArtwork className="loading-screen-art" />}</div>
    <div className="loading-screen-content">
      <OpeningBrand heading fixedTagline={tagline} remember={state.visible} />
      <p id="clinic-loading-status" role={state.failure ? "alert" : "status"} aria-live="polite" aria-atomic="true">{message}</p>
      <div className="loading-screen-bar" role="progressbar" aria-label="Opening progress" aria-describedby="clinic-loading-status"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.progress} aria-valuetext={`${state.progress}%`}>
        <span style={{ width: `${state.progress}%` }} />
      </div>
      <div className="loading-screen-actions" hidden={!state.failure}>
        {state.failure && state.canRetry ? <button type="button" className="button button-primary" onClick={flow.retry}>{state.actionLabel}</button> : null}
        <div ref={reportRef} />
      </div>
    </div>
  </div>, surface);
}
