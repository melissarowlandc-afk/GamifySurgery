import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FinishedGameView } from "./types";
import { InspectionReportCard } from "./InspectionReportCard";
import "./finishedGamePage.css";

/** Native modal focus/keyboard containment; shared actions use the existing session. */
export function FinishedGamePage({ view, bestLabel, latestLabel, compact = false, onKeepPlaying, onStartNewCampaign }: {
  view: FinishedGameView; bestLabel?: string; latestLabel?: string; compact?: boolean;
  onKeepPlaying: () => void; onStartNewCampaign: () => void;
}) {
  const [confirmNew, setConfirmNew] = useState(false);
  const submitted = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const detailBack = useRef<(() => void) | null>(null);
  const registerDetailBack = useCallback((handler: (() => void) | null) => { detailBack.current = handler; }, []);
  const titleId = useId();
  useEffect(() => {
    const node = dialog.current;
    if (node && !node.open) node.showModal();
    return () => { if (node?.open) node.close(); };
  }, []);
  useEffect(() => { heading.current?.focus(); }, [confirmNew]);
  const once = (action: () => void) => {
    if (submitted.current) return;
    submitted.current = true;
    action();
  };
  return <dialog className={`finished-game-dialog${compact ? " is-phone" : ""}`} ref={dialog} aria-labelledby={titleId}
    aria-modal="true" onCancel={event => { event.preventDefault(); if (confirmNew) setConfirmNew(false); else if (detailBack.current) detailBack.current(); else once(onKeepPlaying); }}>
    {confirmNew ? <section className="finished-game-confirmation">
      <span className="inspection-report-eyebrow">Confirmation required</span>
      <h2 id={titleId} ref={heading} tabIndex={-1}>Start a new campaign?</h2>
      <p>The existing campaign-start flow will let you choose your founder and clinic. The new campaign gets a new seed and fresh learning histories.</p>
      <p>Your finished clinic and its report stay saved in Campaigns.</p>
      <div className="finished-game-actions">
        <button type="button" onClick={() => setConfirmNew(false)}>Return to report</button>
        <button type="button" className="finished-game-primary" onClick={() => once(onStartNewCampaign)}>Confirm new campaign</button>
      </div>
    </section> : <div className="finished-game-page">
      <header className="finished-game-heading">
        <span className="inspection-report-eyebrow">You finished the game</span>
        <h1 id={titleId} ref={heading} tabIndex={-1}>{view.headline}</h1>
        <div className="finished-game-lines">{view.lines.map(line => <p key={line}>{line}</p>)}</div>
      </header>
      <div className="finished-game-report">
        <InspectionReportCard report={view.report} compact={compact} bestLabel={bestLabel} latestLabel={latestLabel} onDetailBackChange={registerDetailBack} />
        <p className="finished-game-date">{view.finishedLabel} · First completed inspection</p>
      </div>
      <footer className="finished-game-footer">
        <p>Keep this clinic open. Repeat inspections to beat your best score.</p>
        <div className="finished-game-actions">
          <button type="button" className="finished-game-primary" onClick={() => once(onKeepPlaying)}>Keep playing</button>
          <button type="button" onClick={() => setConfirmNew(true)}>Start new campaign</button>
        </div>
      </footer>
    </div>}
  </dialog>;
}
