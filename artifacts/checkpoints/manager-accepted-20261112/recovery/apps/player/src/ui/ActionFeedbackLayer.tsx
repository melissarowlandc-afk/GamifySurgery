import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { getCommandFeedback, showCommandProblem, subscribeCommandProblem, type CommandFeedback } from "../diagnostics/problemDiagnostics";
import { ProblemReportButton } from "../feedback/TesterFeedback";
import "./ActionFeedbackLayer.css";

type Anchor = Pick<DOMRect, "left" | "right" | "top" | "bottom">;
export function actionFeedbackPosition(anchor: Anchor | null, width: number, height: number, messageHeight = 180) {
  const gap = 12, boxWidth = Math.min(420, Math.max(1, width - gap * 2));
  const left = Math.max(gap, Math.min(anchor?.left ?? (width - boxWidth) / 2, width - boxWidth - gap));
  const below = anchor ? anchor.bottom + 8 : gap;
  const preferred = below + messageHeight <= height - gap ? below : anchor ? anchor.top - messageHeight - 8 : gap;
  return { left, top: Math.max(gap, Math.min(preferred, height - messageHeight - gap)), width: boxWidth };
}

/** Presentation only. Capture the action before its synchronous command runs,
 * including canvas taps and keyboard activation. No game/cloud dependency or
 * timer expires a rejection before it can be read; the next action dismisses it.
 */
export function ActionFeedbackLayer({ shell }: { shell: "phone" | "desktop" }) {
  const feedback = useSyncExternalStore(subscribeCommandProblem, getCommandFeedback, () => null);
  const anchor = useRef<{ element: HTMLElement; rect: Anchor; at: number; priorId: number; point: boolean } | null>(null);
  const pendingClick = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLElement>(null);
  const [notice, setNotice] = useState<{ feedback: CommandFeedback; rect: Anchor | null } | null>(null);
  const [position, setPosition] = useState(() => actionFeedbackPosition(null, typeof window === "undefined" ? 390 : window.innerWidth, typeof window === "undefined" ? 844 : window.innerHeight));
  useEffect(() => {
    const capture = (event: Event) => {
      if (event.type === "keydown" && !["Enter", " "].includes((event as KeyboardEvent).key)) return;
      const target = event.target as HTMLElement | null;
      if (!target || target.closest?.("[data-action-feedback], .problem-report-dialog")) return;
      const element = (target.closest?.("button, [role='button'], canvas, input, select, a") ?? target) as HTMLElement;
      if (typeof element.getBoundingClientRect !== "function") return;
      // Phaser applies canvas actions on pointerdown. Its following native click
      // is the same gesture, not a new action that should erase the new warning.
      if (event.type === "click" && pendingClick.current === element) { pendingClick.current = null; return; }
      pendingClick.current = event.type === "click" ? null : element;
      const pointer = event as PointerEvent;
      const point = element.tagName === "CANVAS" && typeof pointer.clientX === "number" && typeof pointer.clientY === "number";
      const rect = point ? { left: pointer.clientX, right: pointer.clientX, top: pointer.clientY, bottom: pointer.clientY } : element.getBoundingClientRect();
      anchor.current = { element, rect, at: Date.now(), priorId: getCommandFeedback()?.id ?? 0, point };
      setNotice(null);
    };
    document.addEventListener("pointerdown", capture, true);
    document.addEventListener("click", capture, true);
    document.addEventListener("keydown", capture, true);
    return () => {
      document.removeEventListener("pointerdown", capture, true);
      document.removeEventListener("click", capture, true);
      document.removeEventListener("keydown", capture, true);
    };
  }, []);
  useLayoutEffect(() => {
    if (!feedback) { setNotice(null); return; }
    const action = anchor.current;
    const rect = action && feedback.id > action.priorId && Date.now() - action.at < 5_000 ? action.rect : null;
    setNotice({ feedback, rect });
  }, [feedback]);
  useLayoutEffect(() => {
    if (!notice) return;
    const place = () => {
      const current = anchor.current;
      const rect = notice.rect && current?.element.isConnected && !current.point ? current.element.getBoundingClientRect() : notice.rect;
      const measured = box.current?.getBoundingClientRect().height;
      setPosition(actionFeedbackPosition(rect, window.innerWidth, window.innerHeight, measured && measured > 0 ? measured : 180));
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") showCommandProblem(null); };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    if (box.current) observer?.observe(box.current);
    place(); window.addEventListener("resize", place); document.addEventListener("scroll", place, true); document.addEventListener("keydown", escape);
    return () => { observer?.disconnect(); window.removeEventListener("resize", place); document.removeEventListener("scroll", place, true); document.removeEventListener("keydown", escape); };
  }, [notice]);
  if (!notice || typeof document === "undefined") return null;
  const { message, kind, id } = notice.feedback;
  return createPortal(<section key={id} ref={box} className={`action-feedback action-feedback--${kind}`} data-action-feedback={kind}
    role="alert" aria-live="assertive" aria-atomic="true" aria-label="Action feedback" style={{ ...position, top: `max(env(safe-area-inset-top, 0px), ${position.top}px)` }}>
    <strong>{kind === "warning" ? "Check room access" : kind === "rejection" ? "Can't do that yet" : "Something went wrong"}</strong>
    <p>{message}</p>
    <div className="action-feedback-actions">
      {kind === "error" ? <ProblemReportButton shell={shell} /> : null}
      <button type="button" className="text-button" aria-label="Dismiss action message" onClick={() => showCommandProblem(null)}>Dismiss</button>
    </div>
  </section>, document.body);
}
