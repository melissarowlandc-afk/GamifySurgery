import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { PrototypeShellProps } from "../shellContract";
import { ClinicalContentNotice } from "../ui/ClinicalContentNotice";
import "../ui/betaAccount.css";

export function MobileTopBar({ resourceBar: view, paused, simulationSpeed, buildMode, managementMode,
  onTogglePause, onSimulationSpeedChange, referenceLocked = false, referenceLockReason, onCash, onMore, cloudStatus,
}: Pick<PrototypeShellProps, "resourceBar" | "paused" | "simulationSpeed" | "buildMode" |
  "managementMode" | "onTogglePause" | "onSimulationSpeedChange"> & {
  referenceLocked?: boolean; referenceLockReason?: string; onCash: () => void; onMore: () => void; cloudStatus?: ReactNode;
}) {
  const locked = buildMode || managementMode || referenceLocked;
  const requested = useRef(false);
  useEffect(() => { requested.current = false; }, [paused, locked]);
  const choosePaused = (target: boolean) => {
    if (locked || paused === target || requested.current) return;
    requested.current = true; onTogglePause();
  };
  const lockReason = buildMode ? "Exit Build Mode to resume." : managementMode
    ? "Exit Management Mode to resume." : referenceLockReason ?? "Close this dialog to resume.";
  const progress = Number.isFinite(view.xpProgressPercent) ? Math.max(0, Math.min(100, view.xpProgressPercent ?? 0)) : 0;
  return <header className="mobile-top-bar" aria-label="Clinic resources">
    <div className="mobile-resource-row">
      <div className="mobile-level" aria-label={`${view.levelLabel ?? view.facilityLevelLabel}, ${view.xpLabel} learning XP`}>
        <span className="mobile-xp-ring" role="progressbar" aria-label="Learning XP progress toward next level"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
          style={{ "--mobile-progress": `${progress}%` } as CSSProperties}>
          <span>{view.levelLabel ?? view.facilityLevelLabel}</span>
        </span>
        <small>{view.xpLabel} XP</small>
      </div>
      <button type="button" className="mobile-cash" onClick={onCash}
        aria-label={`Cash ${view.moneyLabel}. Net ${view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel}. Show income and costs per game hour.`}>
        <strong>{view.moneyLabel}</strong>
        <small className={`finance-net is-${view.moneyHourlyNetSign ?? "neutral"}`}>{view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel}</small>
      </button>
      <div className="mobile-satisfaction" aria-label={`Patient satisfaction ${view.satisfactionLabel}`}>
        <span aria-hidden="true">♡</span><strong>{view.satisfactionLabel}</strong>
      </div>
    </div>
    <div className="mobile-clock-row">
      <div className="mobile-clock"><small>Facility time</small><strong>{view.dayTimeLabel ?? view.facilityTimeLabel}</strong></div>
      <div className="mobile-playback-controls" role="group" aria-label="Facility playback" data-phone-anchor="pause">
        <button type="button" className="mobile-pause" aria-label="Pause facility time" aria-pressed={paused}
          disabled={locked} title={locked ? lockReason : undefined} onClick={() => choosePaused(true)}>⏸ Pause</button>
        <button type="button" className="mobile-play" aria-label="Resume facility time" aria-pressed={!paused}
          disabled={locked} title={locked ? lockReason : undefined} onClick={() => choosePaused(false)}>▶ Play</button>
      </div>
      <button type="button" className="mobile-speed" aria-label={`Facility speed ${simulationSpeed}x. Cycle speed`}
        disabled={locked} title={locked ? lockReason : undefined}
        onClick={() => onSimulationSpeedChange(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 4 : 1)}>{simulationSpeed}×</button>
      <button type="button" onClick={onMore} aria-label="More clinic options">More</button>
    </div>
    {locked ? <small className="mobile-clock-lock" role="status">{lockReason}</small> : null}
    <ClinicalContentNotice />
    {cloudStatus ?? <small className="cloud-local-status">Local only</small>}
  </header>;
}

/** The same projected cash explanation shown in the desktop HUD. */
export function MobileCashExplanation({ view }: { view: PrototypeShellProps["resourceBar"] }) {
  const breakdown = view.moneyHourlyBreakdown;
  return <div className="mobile-cash-explanation">
    <h3>{view.moneyLabel}</h3>
    {breakdown ? <>
      <p><span>Average income</span><b>{breakdown.incomeLabel}</b></p>
      <p><span>Costs</span><b>{breakdown.costLabel}</b></p>
      <p><span>Net per game hour</span><b className={`finance-net is-${view.moneyHourlyNetSign ?? "neutral"}`}>{view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel}</b></p>
      <small>{breakdown.windowLabel}</small><p>{breakdown.explanation}</p>
    </> : <p>{view.moneyHourlyDeltaLabel ?? view.moneyDeltaLabel}</p>}
  </div>;
}
