import type { ReactNode } from "react";
import type { SimulationSpeed } from "@gamify-surgery/game-domain";
import type { ResourceBarView } from "./types";

interface ResourceBarProps {
  view: ResourceBarView;
  paused: boolean;
  pauseLocked?: boolean;
  simulationSpeed?: SimulationSpeed;
  onTogglePause: () => void;
  onSimulationSpeedChange?: (speed: SimulationSpeed) => void;
  onSaveAndClose?: () => void;
  endControls?: ReactNode;
}

function clampPercent(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value ?? 0));
}

function satisfactionExpression(label: string): "happy" | "steady" | "sad" {
  const value = Number.parseInt(label, 10);
  if (!Number.isFinite(value)) {
    return "steady";
  }
  if (value >= 90) {
    return "happy";
  }
  return value >= 70 ? "steady" : "sad";
}

function HudIcon({
  kind,
  mood,
}: {
  kind: "learning" | "money" | "satisfaction" | "time";
  mood?: "happy" | "steady" | "sad";
}) {
  return (
    <span
      className={`pixel-hud-icon is-${kind}${mood ? ` is-${mood}` : ""}`}
      aria-hidden="true"
    >
      {kind === "learning" ? "XP" : kind === "money" ? "$" : null}
    </span>
  );
}

export function ResourceBar({
  view,
  paused,
  pauseLocked = false,
  simulationSpeed = 1,
  onTogglePause,
  onSimulationSpeedChange,
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
  const satisfactionMood = satisfactionExpression(
    view.satisfactionLabel,
  );

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
            <HudIcon kind="learning" />
            <div className="resource-chip-content">
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
            </div>
          </section>

          <section className="resource-chip">
            <HudIcon kind="money" />
            <div className="resource-chip-content">
              <span>Money</span>
              <strong className="resource-money-value">
                {view.moneyLabel} <small>({moneyDelta})</small>
              </strong>
              <small>Recurring operating change per hour</small>
            </div>
          </section>

          <section className="resource-chip">
            <HudIcon kind="satisfaction" mood={satisfactionMood} />
            <div className="resource-chip-content">
              <span>Patient satisfaction</span>
              <strong>{view.satisfactionLabel}</strong>
              <small>Last 10 completed encounters</small>
            </div>
          </section>

          <section className="resource-chip facility-time-chip">
            <HudIcon kind="time" />
            <div className="resource-chip-content">
              <span>Facility time</span>
              <strong>{dayTime}</strong>
              <small>{paused ? "Paused" : "Clinic open"}</small>
            </div>
          </section>
        </div>

        <div className="resource-controls">
          <div
            className="time-control-group"
            aria-label="Facility time controls"
          >
            <button
              className={`pixel-control-button pause-button${
                paused ? " is-selected" : ""
              }`}
              type="button"
              onClick={() => {
                if (!paused) {
                  onTogglePause();
                }
              }}
              aria-label="Pause facility time"
              aria-pressed={paused}
              disabled={pauseLocked}
              title={
                pauseLocked
                  ? "Build Mode controls the pause. Exit Build Mode to resume."
                  : "Pause facility time"
              }
            >
              <span className="pause-glyph" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
            <button
              className={`pixel-control-button${
                !paused ? " is-selected" : ""
              }`}
              type="button"
              onClick={() => {
                if (paused && !pauseLocked) {
                  onTogglePause();
                }
              }}
              aria-label="Resume facility time"
              aria-pressed={!paused}
              disabled={pauseLocked}
              title={
                pauseLocked
                  ? "Build Mode controls the pause. Exit Build Mode to resume."
                  : "Resume facility time"
              }
            >
              <span className="play-glyph" aria-hidden="true" />
            </button>
            {([1, 2, 4] as const).map((speed) => (
              <button
                key={speed}
                className={`pixel-control-button speed-button${
                  simulationSpeed === speed ? " is-selected" : ""
                }`}
                type="button"
                onClick={() => onSimulationSpeedChange?.(speed)}
                aria-label={`Set facility speed to ${speed}x`}
                aria-pressed={simulationSpeed === speed}
                disabled={pauseLocked}
                title={`${speed}x facility speed`}
              >
                {speed}×
              </button>
            ))}
          </div>
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
