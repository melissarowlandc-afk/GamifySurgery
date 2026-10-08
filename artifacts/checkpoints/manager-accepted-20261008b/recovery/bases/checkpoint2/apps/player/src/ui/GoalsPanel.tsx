import { useEffect, useRef } from "react";
import type { ProgressionView } from "./types";

interface GoalsPanelProps {
  view: ProgressionView;
  onLevelUp: () => void;
}

export function GoalsPanel({
  view,
  onLevelUp,
}: GoalsPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [view.facilityLevelLabel]);

  return (
    <aside className="panel goals-panel" ref={panelRef}>
      <div className="panel-heading">
        <span>{view.facilityLevelLabel} goals</span>
        <small>
          {view.prototypeComplete
            ? "Prototype milestone"
            : view.nextLevelLabel ?? "Current level"}
        </small>
      </div>
      <ul className="goal-list">
        {view.goals.map((goal) => (
          <li className={goal.complete ? "is-complete" : ""} key={goal.id}>
            <span aria-hidden="true">{goal.complete ? "■" : "□"}</span>
            <span>
              {goal.label}
              <small>{goal.progressLabel}</small>
            </span>
          </li>
        ))}
      </ul>
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
          {view.facilityLevelLabel} complete. Level 3 is a locked preview and
          is not implemented in this prototype.
        </p>
      ) : view.nextLevelLabel === "Level 3" ? (
        <p className="prototype-complete">
          Level 3 preview progress only. Level 3 is locked and not implemented.
        </p>
      ) : null}
    </aside>
  );
}
