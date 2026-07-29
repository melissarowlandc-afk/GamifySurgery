import type { AdvertisingView } from "./types";

interface AdvertisingPanelProps {
  view: AdvertisingView;
  highlighted?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

/**
 * Persistent arrival-pressure control. The panel only dispatches a selected
 * tier; cost accrual and arrival timing remain authoritative in the domain.
 */
export function AdvertisingPanel({
  view,
  highlighted = false,
  onDecrease,
  onIncrease,
}: AdvertisingPanelProps) {
  return (
    <section
      className={`panel advertising-panel${
        highlighted ? " is-alert-highlighted" : ""
      }`}
      aria-labelledby="advertising-title"
      data-advertising-control
      tabIndex={-1}
    >
      <span className="eyebrow">Patient demand</span>
      <h2 id="advertising-title">Advertising</h2>
      <div className="advertising-level-controls">
        <button
          className="button advertising-step-button"
          type="button"
          aria-label="Decrease advertising"
          onClick={onDecrease}
          disabled={!view.canDecrease}
          data-advertising-adjust="decrease"
        >
          -
        </button>
        <div className="advertising-current-level" aria-live="polite">
          <strong>Level {view.currentLevel}</strong>
          <span>{view.currentDisplayName}</span>
        </div>
        <button
          className="button advertising-step-button"
          type="button"
          aria-label="Increase advertising"
          onClick={onIncrease}
          disabled={!view.canIncrease}
          data-advertising-adjust="increase"
        >
          +
        </button>
      </div>
      <div className="advertising-current-effects">
        <span>{view.hourlyCostLabel}</span>
        <span>{view.arrivalFrequencyLabel}</span>
      </div>
      <div className="advertising-tier-details">
        <strong className="advertising-tier-heading">Levels</strong>
        <ul>
          {view.levels.map((level) => (
            <li
              key={level.level}
              className={level.selected ? "is-selected" : undefined}
              aria-current={level.selected ? "true" : undefined}
            >
              <strong>
                {level.level}: {level.displayName}
              </strong>
              <span>
                {level.hourlyCostLabel} · {level.arrivalFrequencyLabel}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
