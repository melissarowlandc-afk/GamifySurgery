import type { ReactNode } from "react";
import type { ResourceBarView } from "./types";

interface ResourceBarProps {
  view: ResourceBarView;
  paused: boolean;
  pauseLocked?: boolean;
  onTogglePause: () => void;
  onSaveAndClose?: () => void;
  endControls?: ReactNode;
}

function clampPercent(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value ?? 0));
}

export function ResourceBar({
  view,
  paused,
  pauseLocked = false,
  onTogglePause,
  onSaveAndClose,
  endControls,
}: ResourceBarProps) {
  const levelLabel = view.levelLabel ?? view.facilityLevelLabel;
  const xpProgressPercent = clampPercent(view.xpProgressPercent);
  const moneyDelta =
    view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel;
  const dayTime = view.dayTimeLabel ?? view.facilityTimeLabel;
  const goals = view.goals ?? [];
  const completeGoalCount = goals.filter((goal) => goal.complete).length;

  return (
    <header
      className="resource-bar resource-bar-redesign"
      aria-label="Clinic resources"
    >
      {view.contentNoticeLabel ? (
        <div className="global-content-notice" role="note">
          {view.contentNoticeLabel}
        </div>
      ) : null}

      <div className="resource-bar-main">
        <div className="resource-grid resource-grid-primary">
          <section
            className="resource-chip resource-level-chip"
            aria-label={`${levelLabel}, ${view.xpLabel} learning XP`}
          >
            <div className="resource-chip-heading">
              <span>Learning XP</span>
              <strong>{levelLabel}</strong>
            </div>
            <div className="resource-xp-row">
              <strong>{view.xpLabel}</strong>
              <small>
                {view.xpProgressLabel ?? "Progress toward next level"}
              </small>
            </div>
            <progress
              className="xp-progress"
              max={100}
              value={xpProgressPercent}
              aria-label="Learning XP progress toward next level"
            />
            <span className="resource-goals-summary">
              Goals {completeGoalCount}/{goals.length} · see Goals panel
            </span>
          </section>

          <section className="resource-chip">
            <span>Money</span>
            <strong className="resource-money-value">
              {view.moneyLabel} <small>({moneyDelta})</small>
            </strong>
            <small>Recurring operating change per hour</small>
          </section>

          <section className="resource-chip">
            <span>Patient satisfaction</span>
            <strong>{view.satisfactionLabel}</strong>
            <small>Current clinic experience</small>
          </section>

          <section className="resource-chip">
            <span>Facility time</span>
            <strong>{dayTime}</strong>
            <small>{paused ? "Paused" : "Clinic open"}</small>
          </section>
        </div>

        <div className="resource-controls">
          <button
            className="button button-primary pause-button"
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            disabled={pauseLocked}
            title={
              pauseLocked
                ? "Build Mode controls the pause. Exit Build Mode to resume."
                : undefined
            }
          >
            {pauseLocked ? "Paused for Build" : paused ? "Resume" : "Pause"}
          </button>
          {onSaveAndClose ? (
            <button
              className="button button-secondary save-close-button"
              type="button"
              onClick={onSaveAndClose}
            >
              Save &amp; Close
            </button>
          ) : null}
          {endControls}
        </div>
      </div>
    </header>
  );
}
