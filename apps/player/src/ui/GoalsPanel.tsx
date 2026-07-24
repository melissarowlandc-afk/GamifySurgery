import type { ProgressionView } from "./types";

interface GoalsPanelProps {
  view: ProgressionView;
  paused: boolean;
  workloadStatus: string;
  onLevelUp: () => void;
}

export function GoalsPanel({
  view,
  paused,
  workloadStatus,
  onLevelUp,
}: GoalsPanelProps) {
  return (
    <aside className="panel goals-panel">
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
          Level 1 complete. Later facility levels remain locked for this
          prototype.
        </p>
      ) : null}
      <div className="status-note">
        <strong>{paused ? "Facility paused" : "Facility running"}</strong>
        <span>{workloadStatus}</span>
      </div>
    </aside>
  );
}
