import type { DevelopmentView } from "./types";

interface DevelopmentPanelProps {
  view: DevelopmentView;
  onFastForward: () => void;
}

export function DevelopmentPanel({
  view,
  onFastForward,
}: DevelopmentPanelProps) {
  return (
    <details className="panel development-panel">
      <summary>Prototype tools</summary>
      <div className="development-copy">
        <p>
          Development-only controls for repeated balance testing. They are not
          part of normal campaign play.
        </p>
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
        <button
          className="button button-secondary button-wide"
          type="button"
          onClick={onFastForward}
        >
          {view.fastForwardLabel}
        </button>
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
