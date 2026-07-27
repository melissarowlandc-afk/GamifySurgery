import type { EmergencyGlp1View } from "./types";

interface EmergencyGlp1PanelProps {
  view: EmergencyGlp1View;
  onConsult: () => void;
}

export function EmergencyGlp1Panel({
  view,
  onConsult,
}: EmergencyGlp1PanelProps) {
  if (!view.visible) {
    return null;
  }

  return (
    <section className="panel emergency-glp1-panel" aria-labelledby="glp1-title">
      <span className="eyebrow">Emergency cash</span>
      <h2 id="glp1-title">Cash-Only GLP-1 Consult</h2>
      <button
        className="button emergency-glp1-button"
        type="button"
        onClick={onConsult}
        disabled={!view.enabled}
      >
        Complete consult ({view.paymentLabel})
      </button>
      <div
        className="glp1-cooldown-meter"
        role="progressbar"
        aria-label="GLP-1 consultation cooldown"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(view.cooldownProgressPercent)}
      >
        <span
          style={{ width: `${view.cooldownProgressPercent}%` }}
        />
      </div>
      <div className="emergency-glp1-status">
        <span>{view.statusLabel}</span>
        <span>{view.useCountLabel}</span>
      </div>
      {view.flavorMessage ? (
        <p className="emergency-glp1-flavor">{view.flavorMessage}</p>
      ) : null}
    </section>
  );
}
