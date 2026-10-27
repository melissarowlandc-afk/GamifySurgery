import { useEffect, useRef, useState } from "react";
import type { ProcedureSetupRequirementView, ProgressionView } from "./types";
import "./goalsPanel.css";
import { InspectionControls } from "./InspectionControls";
import { GoalList, OptionalGoalChip } from "./GoalList";

interface GoalsPanelProps {
  view: ProgressionView;
  onLevelUp: () => void;
  onBookInspection?: () => void;
  onCancelInspection?: () => void;
  onViewFinishReport?: () => void;
  onProcedureSetupAction: (action: NonNullable<ProcedureSetupRequirementView["action"]>) => void;
}

export function GoalsPanel({
  view,
  onLevelUp,
  onBookInspection,
  onCancelInspection,
  onViewFinishReport,
  onProcedureSetupAction,
}: GoalsPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
    setSetupOpen(false);
  }, [view.facilityLevelLabel]);

  return (
    <aside className={`panel goals-panel${setupOpen ? " has-procedure-setup" : ""}`} ref={panelRef}>
      <div className="panel-heading">
        <span>{view.facilityLevelLabel} goals</span>
        <small>
          {view.prototypeComplete
             ? "Level complete"
            : view.inspectionUnlock ? `Final level · ${view.inspectionUnlock.statusLabel}` : view.nextLevelLabel ?? "Current level"}
        </small>
      </div>
      <GoalList goals={view.goals} renderSetup={(goal) => {
        const ambulatoryOperation = goal.id === "progression.ambulatory_operation_completion";
        const setupRequirements = goal.id === "progression.endoscopy_completion"
          ? view.endoscopySetupRequirements
          : ambulatoryOperation
            ? view.ambulatoryOperationSetupRequirements
            : undefined;
        return setupRequirements ? (
          <div className="procedure-goal-setup">
            <button className="text-button" type="button" aria-expanded={setupOpen} onClick={() => setSetupOpen((open) => !open)}>
              {setupOpen ? "Hide setup requirements" : "View setup requirements"}
            </button>
            {setupOpen ? (
              <>
                {ambulatoryOperation ? (
                  <p>With Scheduled appointments enabled, ambulatory patients arrive when your setup is ready. Finish preparation, the operation, and recovery to complete this goal.</p>
                ) : null}
                <ul aria-label={ambulatoryOperation ? "Ambulatory operation setup requirements" : "Endoscopy setup requirements"}>
                  {setupRequirements.map((requirement) => (
                    <li key={requirement.id}>
                      <span aria-hidden="true">{requirement.met ? "■" : "□"}</span>{" "}
                      <span>{requirement.label} <small>{requirement.met ? "Ready" : "Missing"} · {requirement.detail}</small></span>
                      {requirement.action ? <button className="text-button" type="button" onClick={() => onProcedureSetupAction(requirement.action!)}>{requirement.action.label}</button> : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        ) : null;
      }} />
      {view.inspectionUnlock ? (
        <section className="goals-inspection-unlock" aria-label="Inspection unlock">
          <strong role="status">{view.inspectionUnlock.statusLabel}</strong>
          {view.inspectionUnlock.earnedLabel ? <small>{view.inspectionUnlock.earnedLabel}</small> : null}
          <p>{view.inspectionUnlock.description}</p>
          {view.inspection ? <InspectionControls view={view.inspection} onBook={onBookInspection} onCancel={onCancelInspection} onViewFinish={onViewFinishReport} /> :
            <button className="button" type="button" disabled title={view.inspectionUnlock.bookingDisabledReason ?? undefined}>{view.inspectionUnlock.bookingLabel}</button>}
          {view.inspectionUnlock.tip ? <p>{view.inspectionUnlock.tip}</p> : null}
        </section>
      ) : null}
      {view.canLevelUp || view.prototypeComplete || Boolean(view.secondaryGoals?.length) ? (
        <div className="goals-advance-area">
          {view.secondaryGoals?.map((goal) => <OptionalGoalChip key={goal.id} goal={goal} />)}
          {view.canLevelUp ? (
            <button
              className="button button-primary level-up-button"
              type="button"
              onClick={onLevelUp}
            >
              Advance to {view.nextLevelLabel}
            </button>
          ) : null}
          {view.prototypeComplete ? (
            <p className="prototype-complete">
               Level 4 goals complete. Keep playing; the clinic is still open.
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
