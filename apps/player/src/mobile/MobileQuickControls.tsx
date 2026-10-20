import { useEffect, useRef, type CSSProperties } from "react";
import type { AdvertisingView, EmergencyGlp1View } from "../ui/types";

export function MobileAdvertisingChip({ view, onOpen }: { view: AdvertisingView; onOpen: () => void }) {
  return <button type="button" className="mobile-advertising-chip mobile-map-top-middle" data-phone-anchor="advertising-chip"
    aria-label={`Advertising · Level ${view.currentLevel} · ${view.hourlyCostLabel}`} onClick={onOpen}>
    <strong>Advertising</strong><small>Level {view.currentLevel} · {view.hourlyCostLabel}</small>
  </button>;
}

export function MobileAdvertising({ view, onLevelChange }: { view: AdvertisingView; onLevelChange: (level: number) => void }) {
  return <section className="mobile-quick-control" aria-label="Advertising controls" data-advertising-control data-phone-anchor="advertising">
    <div className="mobile-advertising-controls">
      <button type="button" disabled={!view.canDecrease} onClick={() => onLevelChange(view.currentLevel - 1)} aria-label="Decrease advertising" data-advertising-adjust="decrease">−</button>
      <div aria-live="polite"><strong>Level {view.currentLevel}</strong><span>{view.currentDisplayName}</span></div>
      <button type="button" disabled={!view.canIncrease} onClick={() => onLevelChange(view.currentLevel + 1)} aria-label="Increase advertising" data-advertising-adjust="increase">+</button>
    </div>
    <p>{view.hourlyCostLabel}</p><p>{view.arrivalFrequencyLabel}</p>
  </section>;
}

/** The shared projection owns elapsed facility time and the actual cooldown. No wall-clock timer. */
export const mobileConsultProgress = (view: EmergencyGlp1View) =>
  Number.isFinite(view.cooldownProgressPercent) ? Math.max(0, Math.min(100, view.cooldownProgressPercent)) : 0;

export function MobileGlp1ConsultChip({ view, onConsult, blockedReason }: {
  view: EmergencyGlp1View; onConsult: () => void; blockedReason?: string;
}) {
  const submitted = useRef(false);
  const progress = mobileConsultProgress(view);
  const automationCovered = view.automationCapacity > 0;
  const ready = view.enabled && !automationCovered && !blockedReason;
  useEffect(() => { if (!ready || progress < 100) submitted.current = false; }, [ready, progress]);
  if (!view.visible || automationCovered) return null;
  const reason = blockedReason ?? view.statusLabel;
  return <button type="button" className={`mobile-consult-chip mobile-map-top-left${ready ? " is-ready" : ""}`}
    data-phone-anchor="emergency" aria-disabled={!ready} aria-label={`GLP-1 consult · ${ready ? view.paymentLabel : reason}`}
    style={{ "--mobile-consult-progress": `${progress}%` } as CSSProperties} onClick={() => {
      if (!ready || submitted.current) return;
      submitted.current = true;
      onConsult();
    }}>
    <span className="mobile-consult-fill" role="progressbar" aria-label="GLP-1 consultation cooldown"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} />
    <strong>GLP-1 consult{ready ? ` · ${view.paymentLabel}` : ""}</strong>
    {/* Owner feedback: the fill bar already shows the cooldown, so only non-cooldown blocks get a text line. */}
    {!ready && blockedReason ? <small>{reason}</small> : null}
  </button>;
}

/** Details remain reachable in More and Alerts; completing a consult lives on the map chip. */
export function MobileGlp1ConsultInfo({ view }: { view: EmergencyGlp1View }) {
  return <section className="mobile-quick-control" aria-label="GLP-1 consult information">
    <h3>Cash-Only GLP-1 Consult</h3>
    <p>{view.paymentLabel} per consult · one consult per facility hour.</p>
    <progress value={mobileConsultProgress(view)} max={100} aria-label="GLP-1 consultation cooldown" />
    <p role="status">{view.statusLabel}</p>
    {view.nextPayoutLabel ? <p>{view.nextPayoutLabel}</p> : null}
    {view.flavorMessage ? <p>{view.flavorMessage}</p> : null}
  </section>;
}
