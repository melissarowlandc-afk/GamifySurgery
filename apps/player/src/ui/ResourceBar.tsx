import type { ReactNode } from "react";
import type { SimulationSpeed } from "@gamify-surgery/game-domain";
import type { ResourceBarView } from "./types";
import { SmoothHudIcon } from "./SmoothHudIcon";
import "./financePresentation.css";

interface ResourceBarProps {
  view: ResourceBarView;
  paused: boolean;
  buildMode?: boolean;
  managementMode?: boolean;
  pauseLocked?: boolean;
  pauseLockReason?: string;
  simulationSpeed?: SimulationSpeed;
  onTogglePause: () => void;
  onSimulationSpeedChange?: (speed: SimulationSpeed) => void;
  onSaveAndClose?: () => void;
  endControls?: ReactNode;
  headline?: ReactNode;
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
      className={`hud-outline-icon is-${kind}${mood ? ` is-${mood}` : ""}`}
      aria-hidden="true"
    >
      <SmoothHudIcon kind={kind} mood={mood} />
    </span>
  );
}

export function ResourceBar({
  view,
  paused,
  buildMode = false,
  managementMode = false,
  pauseLocked = false,
  pauseLockReason,
  simulationSpeed = 1,
  onTogglePause,
  onSimulationSpeedChange,
  onSaveAndClose,
  endControls,
  headline,
}: ResourceBarProps) {
  const levelLabel = view.levelLabel ?? view.facilityLevelLabel;
  const controlledMode = buildMode
    ? "build"
    : managementMode
      ? "management"
      : null;
  const timeControlLockMessage = pauseLockReason ?? (
    controlledMode === "build"
      ? "Build Mode controls the pause. Exit Build Mode to resume."
      : "Management Mode controls the pause. Exit Management Mode to resume.");
  const xpProgressPercent = clampPercent(view.xpProgressPercent);
  const moneyDelta =
    view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel;
  const moneyBreakdown = view.moneyHourlyBreakdown;
  const moneyTooltip = moneyBreakdown
    ? `Net ${moneyDelta}: income ${moneyBreakdown.incomeLabel} − costs ${moneyBreakdown.costLabel}. ${moneyBreakdown.windowLabel}. ${moneyBreakdown.explanation}`
    : undefined;
  const dayTime = view.dayTimeLabel ?? view.facilityTimeLabel;
  const satisfactionMood = satisfactionExpression(
    view.satisfactionLabel,
  );

  return (
    <header
      className="resource-bar resource-bar-redesign"
      aria-label="Clinic resources"
    >
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
                <progress
                  className="xp-progress"
                  max={100}
                  value={xpProgressPercent}
                  aria-label="Learning XP progress toward next level"
                />
                <small>
                  {view.xpProgressLabel ?? "Progress toward next level"}
                </small>
              </div>
            </div>
          </section>

          <section className="resource-chip">
            <HudIcon kind="money" />
            <div className="resource-chip-content">
              <span>Money</span>
              {moneyBreakdown ? (
                <details className="resource-money-details">
                  <summary className="resource-money-summary" title={moneyTooltip} aria-label={`Cash ${view.moneyLabel}. Net ${moneyDelta}. Show income and costs per game hour.`}>
                    <strong className="resource-money-value">
                      {view.moneyLabel} <small className={`finance-net is-${view.moneyHourlyNetSign ?? "neutral"}`}>({moneyDelta})</small>
                    </strong>
                  </summary>
                  <div className="resource-money-breakdown">
                    <p><span>Average income</span><b>{moneyBreakdown.incomeLabel}</b></p>
                    <p><span>Costs</span><b>{moneyBreakdown.costLabel}</b></p>
                    <p><span>Net per game hour</span><b className={`finance-net is-${view.moneyHourlyNetSign ?? "neutral"}`}>{moneyDelta}</b></p>
                    <small>{moneyBreakdown.windowLabel}</small>
                    <small>{moneyBreakdown.explanation}</small>
                  </div>
                </details>
              ) : (
                <strong className="resource-money-value">
                  {view.moneyLabel} <small>({moneyDelta})</small>
                </strong>
              )}
            </div>
          </section>

          <section className="resource-chip">
            <HudIcon kind="satisfaction" mood={satisfactionMood} />
            <div className="resource-chip-content">
              <span>Patient satisfaction</span>
              <strong>{view.satisfactionLabel}</strong>
            </div>
          </section>

          <section
            className={`resource-chip facility-time-chip${
              buildMode ? " is-build-mode" : ""
            }${managementMode ? " is-management-mode" : ""}`}
          >
            <HudIcon kind="time" />
            <div className="resource-chip-content">
              <span>
                {buildMode
                  ? "BUILD MODE"
                  : managementMode
                    ? "MANAGEMENT MODE"
                    : "Facility time"}
              </span>
              <strong>
                {buildMode
                  ? "Facility time is stopped while you remodel."
                  : managementMode
                    ? "Facility time is stopped while you manage staff."
                  : dayTime}
              </strong>
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
                  ? timeControlLockMessage
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
                  ? timeControlLockMessage
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
      {headline}
    </header>
  );
}
