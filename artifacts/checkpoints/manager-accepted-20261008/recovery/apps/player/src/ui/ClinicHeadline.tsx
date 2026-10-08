import { useEffect, useRef, useState } from "react";
import type { MessageBoardItemView, NeedsYouItemView } from "./types";

export function clinicHeadlineCandidates(items: MessageBoardItemView[], needs: NeedsYouItemView[]) {
  return [
    ...items.map((item) => ({ id: item.id, text: item.message, tick: item.sortKey ?? 0 })),
    ...needs.map((item) => ({ id: item.id, text: item.title, tick: item.sortKey })),
  ].sort((left, right) => right.tick - left.tick);
}

/** Finite, readable announcement; same-ID updates and restored history stay quiet. */
export function ClinicHeadline({ items, needs }: { items: MessageBoardItemView[]; needs: NeedsYouItemView[] }) {
  const known = useRef(new Set(clinicHeadlineCandidates(items, needs).map((item) => item.id)));
  const [headline, setHeadline] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    const candidates = clinicHeadlineCandidates(items, needs);
    const newest = candidates.find((item) => !known.current.has(item.id));
    for (const candidate of candidates) known.current.add(candidate.id);
    if (!newest) return;
    setHeadline(newest.text);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHeadline(null), 6_000);
  }, [items, needs]);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  return <div className={`clinic-headline${headline ? " is-showing" : ""}`} role="status" aria-live="polite">{headline ?? ""}</div>;
}
