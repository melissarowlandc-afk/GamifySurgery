import type { ReactNode } from "react";

/** Sheets occupy the map region, leaving clock controls and tabs reachable. */
export function MobileSheet({ title, kind = "full", onClose, actions, headingInert = false, children }: {
  title: string;
  kind?: "full" | "bottom";
  onClose: () => void;
  actions?: ReactNode;
  headingInert?: boolean;
  children: ReactNode;
}) {
  return <section className={`mobile-sheet is-${kind}`} role="dialog" aria-label={title}>
    <header className="mobile-sheet-heading" inert={headingInert} aria-hidden={headingInert || undefined}>
      <h2>{title}</h2>
      <div className="mobile-sheet-heading-actions">{actions}
        <button type="button" onClick={onClose} aria-label={`Close ${title}`}>Close</button>
      </div>
    </header>
    <div className="mobile-sheet-body">{children}</div>
  </section>;
}
