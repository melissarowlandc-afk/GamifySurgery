import type { ReactNode } from "react";

/** Sheets occupy the map region, leaving clock controls and tabs reachable. */
export function MobileSheet({ title, kind = "full", onClose, children }: {
  title: string;
  kind?: "full" | "bottom";
  onClose: () => void;
  children: ReactNode;
}) {
  return <section className={`mobile-sheet is-${kind}`} role="dialog" aria-label={title}>
    <header className="mobile-sheet-heading">
      <h2>{title}</h2>
      <button type="button" onClick={onClose} aria-label={`Close ${title}`}>Close</button>
    </header>
    <div className="mobile-sheet-body">{children}</div>
  </section>;
}
