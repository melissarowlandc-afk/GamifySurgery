import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ProblemReportButton } from "../feedback/TesterFeedback";
import { usePresentationLayout } from "../shellPresentation";
import { WelcomeArtwork, welcomeSurfaceStyle } from "./WelcomeArtwork";
import { OpeningBrand } from "./OpeningBrand";
import "./LoadingScreen.css";

export const LOADING_DELAY_MS = 400;
export const LOADING_DEADLINE_MS = 30_000;
export type LoadingStage = "connecting" | "checking" | "opening";
const stages: Record<LoadingStage, number> = { connecting: 1, checking: 2, opening: 3 };
const Covered = createContext(false);

/** A parent opening screen covers the still-mounted game and its own notices. */
export function LoadingCovered({ children, active = true }: { children: ReactNode; active?: boolean }) {
  const parent = useContext(Covered);
  return <Covered.Provider value={parent || active}>{children}</Covered.Provider>;
}
export const useLoadingCovered = () => useContext(Covered);

export interface LoadingScreenProps {
  active?: boolean;
  status: string;
  stage?: LoadingStage;
  failure?: string | null;
  onRetry?: () => void;
  actionLabel?: string;
  deadlineMs?: number;
}

/** Presentation only: a deadline never releases a save/authority gate. */
export function LoadingScreen({ active = true, status, stage, failure, onRetry,
  actionLabel = "Try again", deadlineMs = LOADING_DEADLINE_MS }: LoadingScreenProps) {
  const covered = useLoadingCovered(), layout = usePresentationLayout(), id = useId();
  const [delayed, setDelayed] = useState(false), [timedOut, setTimedOut] = useState(false), [attempt, setAttempt] = useState(0);
  const surface = useRef<HTMLElement>(null);
  const enabled = active && !covered;
  const failed = Boolean(failure);
  useEffect(() => {
    if (!enabled) { setDelayed(false); return; }
    const timer = setTimeout(() => setDelayed(true), LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [enabled]);
  useEffect(() => {
    setTimedOut(false);
    if (!enabled || failed) return;
    const timer = setTimeout(() => setTimedOut(true), deadlineMs);
    return () => clearTimeout(timer);
  }, [enabled, failed, deadlineMs, attempt]);
  const visible = enabled && (delayed || failed || timedOut);
  // A loader inside the top native dialog stays above its backdrop. The screen
  // itself is an opaque viewport overlay, never a second modal dialog.
  const host = useMemo(() => {
    if (!visible || typeof document === "undefined") return null;
    const focusedDialog = document.activeElement?.closest?.<HTMLDialogElement>("dialog[open]");
    return focusedDialog ?? Array.from(document.querySelectorAll?.<HTMLDialogElement>("dialog[open]") ?? []).at(-1) ?? document.body;
  }, [visible]);
  useEffect(() => {
    if (!visible || !host) return;
    const previous = document.activeElement;
    const siblings = Array.from(host.children ?? host.childNodes).filter(node => node !== surface.current && !node.contains(surface.current)) as HTMLElement[];
    const inert = siblings.map(node => [node, node.inert] as const);
    for (const [node] of inert) node.inert = true;
    surface.current?.focus();
    return () => {
      for (const [node, value] of inert) node.inert = value;
      if (previous instanceof HTMLElement && previous !== document.body && document.body.contains(previous)) previous.focus({ preventScroll: true });
      else {
        const main = document.querySelector<HTMLElement>("main");
        if (main instanceof HTMLElement) {
          const tabIndex = main.getAttribute?.("tabindex") ?? null; main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true });
          if (tabIndex === null) main.removeAttribute("tabindex"); else main.setAttribute("tabindex", tabIndex);
        }
      }
    };
  }, [visible, host]);
  if (!visible || !host) return null;
  const message = failure || (timedOut ? "This is taking longer than expected. Your saved copies are safe." : status);
  const error = failed || timedOut;
  const progress = stage ? stages[stage] : null;
  return createPortal(<section ref={surface} role="region" className={`welcome-surface loading-screen${error ? " has-error" : ""}`} style={welcomeSurfaceStyle}
    aria-label="Loading clinic" data-loading-state={error ? "failed" : "waiting"} tabIndex={-1}
    onKeyDown={event => {
      // The consent/report dialog is a separate top-layer portal. Its keyboard
      // events bubble through React but must keep their own focus and Escape.
      if (!surface.current?.contains(event.target as Node)) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); }
      if (event.key !== "Tab") return;
      const targets = Array.from(surface.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]") ?? []);
      if (!targets.length) { event.preventDefault(); return; }
      const first = targets[0]!, last = targets.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === surface.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
    <div className="loading-screen-scene"><WelcomeArtwork className="loading-screen-art" /></div>
    <div className="loading-screen-content">
      <OpeningBrand heading />
      <p id={`${id}-status`} role={error ? "alert" : "status"} aria-live="polite" aria-atomic="true">{message}</p>
      <div className={`loading-screen-bar${progress === null ? " is-indeterminate" : ""}`} role="progressbar"
        aria-label="Opening progress" aria-describedby={`${id}-status`} aria-valuemin={0} aria-valuemax={3}
        aria-valuenow={progress ?? undefined} aria-valuetext={progress === null ? undefined : `Step ${progress} of 3`}>
        <span style={progress === null ? undefined : { width: `${progress / 3 * 100}%` }} />
      </div>
      {error ? <div className="loading-screen-actions">
        {onRetry ? <button type="button" className="button button-primary" onClick={() => {
          setAttempt(value => value + 1);
          onRetry();
        }}>{actionLabel}</button> : null}
        <ProblemReportButton shell={layout} />
      </div> : null}
    </div>
  </section>, host);
}
