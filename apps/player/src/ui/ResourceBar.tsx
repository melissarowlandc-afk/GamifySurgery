import type { ResourceBarView } from "./types";

interface ResourceBarProps {
  view: ResourceBarView;
  paused: boolean;
  onTogglePause: () => void;
}

export function ResourceBar({
  view,
  paused,
  onTogglePause,
}: ResourceBarProps) {
  const resources = [
    ["Money", view.moneyLabel, view.moneyDeltaLabel],
    ["Learning XP", view.xpLabel, "Campaign progress"],
    ["Satisfaction", view.satisfactionLabel, "Patient experience"],
    ["Facility time", view.facilityTimeLabel, paused ? "Paused" : "Running"],
    ["Workload", view.workloadLabel, view.workloadStatusLabel],
    ["Facility", view.facilityLevelLabel, "Prototype stage"],
  ];

  return (
    <header className="resource-bar" aria-label="Clinic resources">
      <div className="resource-grid">
        {resources.map(([label, value, detail]) => (
          <div className="resource-chip" key={label} title={detail}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </div>
        ))}
      </div>
      <button
        className="button button-primary pause-button"
        type="button"
        onClick={onTogglePause}
        aria-pressed={paused}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </header>
  );
}
