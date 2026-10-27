import { useEffect, useRef, type CSSProperties } from "react";
import type { ProcedureSetupRequirementView, ProgressionView } from "../ui/types";
import { InspectionControls } from "../ui/InspectionControls";
import { GoalList, OptionalGoalChip } from "../ui/GoalList";

export function MobileGoalsChip({ view, onLevelUp, onShowGoals }: { view: ProgressionView; onLevelUp: () => void; onShowGoals: () => void }) {
  const submitted = useRef(false);
  useEffect(() => { submitted.current = false; }, [view.canLevelUp, view.facilityLevelLabel, view.nextLevelLabel]);
  const complete = view.goals.filter(goal => goal.complete).length;
  return <button type="button" className="mobile-goals-chip mobile-map-top-right" data-phone-anchor="goals-chip"
    aria-label={view.canLevelUp ? `Advance to ${view.nextLevelLabel}` : undefined}
    style={{ "--mobile-progress": `${view.inspectionUnlock?.unlocked ? 100 : view.goals.length ? complete / view.goals.length * 100 : 0}%` } as CSSProperties}
    onClick={() => {
      if (!view.canLevelUp) { onShowGoals(); return; }
      if (submitted.current) return;
      submitted.current = true;
      onLevelUp();
    }}>
    <span className="mobile-goal-ring" aria-hidden="true" />
    {view.canLevelUp ? `Advance · ${view.nextLevelLabel}` : view.inspectionUnlock?.unlocked ? "Inspections unlocked" : `Goals ${complete}/${view.goals.length}`}
  </button>;
}

export function MobileGoals({ view, onLevelUp, onSetupAction, onBookInspection, onCancelInspection, onViewFinishReport, onShowInspection, onDetailBackChange }: {
  view: ProgressionView;
  onLevelUp: () => void;
  onBookInspection?: () => void;
  onCancelInspection?: () => void;
  onViewFinishReport?: () => void;
  onShowInspection?: () => void;
  onDetailBackChange?: (handler: (() => void) | null) => void;
  onSetupAction: (action: NonNullable<ProcedureSetupRequirementView["action"]>) => void;
}) {
  return <div className={`mobile-goals${view.inspectionUnlock ? " mobile-inspection-goals" : ""}`} data-phone-anchor="goals">
    <p className="mobile-section-intro">{view.facilityLevelLabel} · {view.prototypeComplete ? "Level complete" : view.inspectionUnlock ? `Final level · ${view.inspectionUnlock.statusLabel}` : view.nextLevelLabel ?? "Current level"}</p>
    <section aria-label="Current requirements"><h3>Current requirements</h3>
      <GoalList goals={view.goals} mobile renderSetup={(goal) => {
        const ambulatory = goal.id === "progression.ambulatory_operation_completion";
        const requirements = goal.id === "progression.endoscopy_completion" ? view.endoscopySetupRequirements
          : ambulatory ? view.ambulatoryOperationSetupRequirements : undefined;
        return requirements?.length ? <details className="mobile-goal-setup" aria-label={ambulatory ? "Ambulatory operation setup requirements" : "Endoscopy setup requirements"}>
            <summary>Setup checklist</summary>
            {ambulatory ? <p>With Scheduled appointments enabled, ambulatory patients arrive when your setup is ready. Finish preparation, the operation, and recovery to complete this goal.</p> : null}
            <ul>{requirements.map((requirement) => <li key={requirement.id}>
              <strong>{requirement.label} · {requirement.met ? "Ready ✓" : "Missing"}</strong>
              <p>{requirement.detail}</p>
              {requirement.action ? <button type="button" onClick={() => onSetupAction(requirement.action!)} aria-label={`${requirement.action.label} ${requirement.label}`}>{requirement.action.label}</button> : null}
            </li>)}</ul>
          </details> : null;
      }} />
    </section>
    {view.inspectionUnlock ? <section className="mobile-inspection-unlock" aria-label="Inspection unlock">
      <h3 role="status">{view.inspectionUnlock.statusLabel}</h3>
      {view.inspectionUnlock.earnedLabel ? <small>{view.inspectionUnlock.earnedLabel}</small> : null}
      <p>{view.inspectionUnlock.description}</p>
      {onShowInspection ? <button type="button" onClick={onShowInspection}>View inspection</button> : null}
      {view.inspection ? <InspectionControls view={view.inspection} compact onBook={onBookInspection} onCancel={onCancelInspection} onViewFinish={onViewFinishReport} onDetailBackChange={onDetailBackChange} /> :
        <button type="button" disabled title={view.inspectionUnlock.bookingDisabledReason ?? undefined}>{view.inspectionUnlock.bookingLabel}</button>}
      {view.inspectionUnlock.tip ? <p>{view.inspectionUnlock.tip}</p> : null}
    </section> : null}
    {view.secondaryGoals?.length ? <section className="mobile-optional-goals" aria-label="Optional goals">
      {view.secondaryGoals.map((goal) => <OptionalGoalChip key={goal.id} goal={goal} />)}
    </section> : null}
    {view.canLevelUp ? <div className="mobile-goals-advance"><button type="button" className="mobile-primary" data-phone-anchor="advance" onClick={onLevelUp} data-tutorial-anchor="mobile-level-up">Advance to {view.nextLevelLabel}</button></div> : null}
    {view.prototypeComplete ? <p className="mobile-level-complete" role="status">Level 4 goals complete. Keep playing; the clinic is still open.</p> : null}
  </div>;
}
