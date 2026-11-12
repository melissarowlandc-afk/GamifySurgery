import { useEffect, useRef, type ReactNode } from "react";

export type ManageBackRegistration = (handler: (() => void) | null) => void;

/** A presentation-only detail sheet inside Manage; clock and tabs remain reachable. */
export function MobileManageSheet({ title, backLabel, onBack, onEscape = onBack, onDetailBackChange, children }: {
  title: string; backLabel: string; onBack: () => void; onEscape?: () => void;
  onDetailBackChange?: ManageBackRegistration; children: ReactNode;
}) {
  const back = useRef(onEscape);
  back.current = onEscape;
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    button.current?.focus();
    const close = () => back.current();
    onDetailBackChange?.(close);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(); } };
    window.addEventListener("keydown", escape);
    return () => {
      onDetailBackChange?.(null);
      window.removeEventListener("keydown", escape);
      previous?.focus();
    };
  }, [onDetailBackChange]);
  return <section className="mobile-manage-detail" role="dialog" aria-label={title}>
    <header className="mobile-sheet-heading"><h2>{title}</h2>
      <button ref={button} type="button" onClick={onBack} aria-label={backLabel}>Back</button>
    </header>
    <div className="mobile-manage-detail-body">{children}</div>
  </section>;
}
