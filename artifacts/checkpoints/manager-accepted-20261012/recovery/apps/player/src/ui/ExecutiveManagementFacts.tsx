import type { ExecutiveManagementView } from "./types";
import "./executiveManagement.css";

/** Same four facts on desktop and phone, with no shell-specific arithmetic. */
export function ExecutiveManagementFacts({ view }: { view?: ExecutiveManagementView }) {
  if (!view) return null;
  return <section aria-label="Executive management" className="executive-management-facts">
    <p><strong>{view.statusLabel}</strong> · {view.homeLabel}</p>
    <p>{view.activeLabel}</p>
    <dl>{view.effects.map(effect => <div key={effect.label}>
      <dt><strong>{effect.label}</strong></dt><dd>Current tier: {effect.currentLabel}<br />
        Today: {effect.activeLabel}{effect.nextLabel ? <><br />Next tier: {effect.nextLabel}</> : null}</dd>
    </div>)}</dl>
    <details><summary>Round and preparation details</summary><p>{view.durationLabel}</p><p>{view.acceptedLabel}</p>
      <p>{view.lastRoundLabel}</p><p>{view.preparationLabel}</p></details>
    <p>{view.savingsLabel}</p>
  </section>;
}
