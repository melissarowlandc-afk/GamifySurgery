import { useState } from "react";
import type { DevelopmentView } from "./types";
import { RestartDialog } from "./RestartDialog";

interface DevelopmentPanelProps {
  view: DevelopmentView;
  paused: boolean;
  tutorialsEnabled: boolean;
  onFastForward: () => void;
  onAddMoney: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onTutorialsEnabledChange: (enabled: boolean) => void;
}

export function DevelopmentPanel({
  view,
  paused,
  tutorialsEnabled,
  onFastForward,
  onAddMoney,
  onTogglePause,
  onRestart,
  onTutorialsEnabledChange,
}: DevelopmentPanelProps) {
  // Development utilities remain available without occupying the normal game UI.
  const [open, setOpen] = useState(false);

  return (
    <details
      className="panel development-panel"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Prototype tools</summary>
      <div className="development-copy">
        <div className="development-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onAddMoney}
          >
            {view.addMoneyLabel}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onFastForward}
          >
            {view.fastForwardLabel}
          </button>
          <RestartDialog
            paused={paused}
            onTogglePause={onTogglePause}
            onRestart={onRestart}
            triggerLabel="Restart Campaign"
            triggerClassName="button button-danger"
          />
        </div>
        <dl>
          <div>
            <dt>Campaign</dt>
            <dd>{view.campaignIdLabel}</dd>
          </div>
          <div>
            <dt>FSRS histories</dt>
            <dd>{view.learningHistoryLabel}</dd>
          </div>
          <div>
            <dt>Scored reviews</dt>
            <dd>{view.reviewCountLabel}</dd>
          </div>
        </dl>
        <label className="prototype-toggle">
          <input
            type="checkbox"
            checked={tutorialsEnabled}
            onChange={(event) =>
              onTutorialsEnabledChange(event.currentTarget.checked)
            }
          />
          <span>
            <strong>Tutorial guidance</strong>
            <small>
              Show first-run coaching for untouched campaigns.
            </small>
          </span>
        </label>
        <details className="learning-card-inspector">
          <summary>Inspect FSRS cards</summary>
          <ul>
            {view.learningCards.map((card) => (
              <li key={card.conceptId}>
                <strong>{card.conceptLabel}</strong>
                <span>{card.statusLabel}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </details>
  );
}
