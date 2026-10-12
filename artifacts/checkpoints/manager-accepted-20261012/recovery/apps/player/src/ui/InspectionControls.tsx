import { useEffect, useRef, useState } from "react";
import type { FacilityInspectionView } from "./types";
import { InspectionReportCard } from "./InspectionReportCard";
import "./inspectionControls.css";

/** One booking/cancellation contract with full report cards in both shells. */
export function InspectionControls({ view, onBook, onCancel, onViewFinish, compact = false, onDetailBackChange }: {
  view: FacilityInspectionView; onBook?: () => void; onCancel?: () => void; onViewFinish?: () => void; compact?: boolean;
  onDetailBackChange?: (handler: (() => void) | null) => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const submitted = useRef(false);
  useEffect(() => { submitted.current = false; setConfirmCancel(false); }, [view.status, view.lastReport?.runId]);
  const dispatch = (action?: () => void) => {
    if (submitted.current || !action) return;
    submitted.current = true;
    action();
  };
  return <section className="inspection-controls" aria-label="Inspection">
    <strong role="status">{view.statusLabel}</strong>
    <small>{view.sampleLabel}</small>
    {view.latestLabel ? <p>Latest {view.latestLabel}/100 · Best prestige {view.bestLabel}/100</p> : null}
    {view.firstCompletionRecorded ? <small>Game finished. Repeat inspections to improve your best score.</small> : null}
    {view.finish && onViewFinish ? <button type="button" onClick={onViewFinish}>View finish report</button> : null}
    {view.canCancel ? <>
      {view.status === "preparing" ? <small>{view.preparationLabel}</small> : null}
      {confirmCancel ? <div className="inspection-actions" role="group" aria-label="Cancel inspection confirmation">
        <p>Discard this running inspection? It earns no prestige.</p>
        <button type="button" onClick={() => dispatch(onCancel)}>Confirm cancel</button>
        <button type="button" onClick={() => setConfirmCancel(false)}>Keep inspection</button>
      </div> : <button type="button" disabled={!onCancel} onClick={() => view.status === "running" ? setConfirmCancel(true) : dispatch(onCancel)}>Cancel inspection</button>}
    </> : <>
      <small>{view.preparationLabel}</small>
      <button type="button" className="button" disabled={Boolean(view.bookingDisabledReason) || !onBook}
        title={view.bookingDisabledReason ?? undefined} onClick={() => dispatch(onBook)}>{view.bookingLabel}</button>
      {view.bookingDisabledReason ? <small>{view.bookingDisabledReason}</small> : null}
    </>}
    {view.provisionalReport ? <details className="inspection-report-disclosure"><summary>Provisional categories</summary>
      <InspectionReportCard report={view.provisionalReport} compact={compact} provisional bestLabel={view.bestLabel} latestLabel={view.latestLabel} onDetailBackChange={onDetailBackChange} />
    </details> : null}
    {view.lastReport ? <details className="inspection-report-disclosure"><summary>{view.lastReport.outcome} report · {view.lastReport.totalLabel}</summary>
      <InspectionReportCard report={view.lastReport} compact={compact} bestLabel={view.bestLabel} latestLabel={view.latestLabel} onDetailBackChange={onDetailBackChange} />
    </details> : null}
  </section>;
}
