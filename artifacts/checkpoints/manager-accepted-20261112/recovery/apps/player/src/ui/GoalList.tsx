import { useId, useState, type ReactNode } from "react";
import type { ProgressionGoalView } from "./types";
import "./goalList.css";

const EXPANDED_SESSION_KEY = "gamify-surgery.goals.completed-expanded";
// Also remember the preference in memory when browser session storage is unavailable.
const expandedByWindow = new WeakMap<Window, boolean>();

function readExpanded(): boolean {
  if (typeof window === "undefined") return false;
  if (expandedByWindow.has(window)) return expandedByWindow.get(window)!;
  try { return window.sessionStorage?.getItem(EXPANDED_SESSION_KEY) === "true"; }
  catch { return false; }
}

function rememberExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  expandedByWindow.set(window, expanded);
  try { window.sessionStorage?.setItem(EXPANDED_SESSION_KEY, String(expanded)); }
  catch { /* The in-memory preference still lasts for this page session. */ }
}

function GoalRow({ goal, mobile, children }: { goal: ProgressionGoalView; mobile: boolean; children: ReactNode }) {
  const descriptionId = useId();
  return <li className={`goal-row${mobile ? " mobile-goal-card" : ""}${goal.complete ? " is-complete" : ""}`} data-goal-id={goal.id}>
    <div className="goal-line">
      <span className="goal-state" aria-label={goal.complete ? "Complete" : "Incomplete"}>{goal.complete ? "✓" : "○"}</span>
      <span className="goal-label" tabIndex={0} title={goal.label} aria-describedby={descriptionId}>{goal.displayLabel ?? goal.label}</span>
      <span className="goal-progress" title={goal.progressLabel}>{goal.displayProgressLabel ?? goal.progressLabel}</span>
    </div>
    <span hidden id={descriptionId}>{goal.label}{goal.displayProgressLabel ? `. ${goal.progressLabel}` : ""}</span>
    {children}
  </li>;
}

/** Both shells share the same disclosure, accessible labels and row structure. */
export function GoalList({ goals, mobile = false, renderSetup }: {
  goals: ProgressionGoalView[];
  mobile?: boolean;
  renderSetup: (goal: ProgressionGoalView) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(readExpanded);
  const completedId = useId();
  const completed = goals.filter(goal => goal.complete);
  const incomplete = goals.filter(goal => !goal.complete);
  const rows = (items: ProgressionGoalView[]) => items.map(goal =>
    <GoalRow key={goal.id} goal={goal} mobile={mobile}>{renderSetup(goal)}</GoalRow>);
  const listClass = `goal-list${mobile ? " mobile-goal-list" : ""}`;
  return <div className="compact-goals">
    {incomplete.length ? <ul className={`${listClass} incomplete-goal-list`} aria-label="Incomplete goals">{rows(incomplete)}</ul> : null}
    {completed.length ? <div className="goal-completion-group">
      <button type="button" className="goal-completion-toggle" aria-expanded={expanded} aria-controls={completedId}
        onClick={() => { const next = !expanded; rememberExpanded(next); setExpanded(next); }}>
        <span>✓ {completed.length} of {goals.length} done</span><span aria-hidden="true">{expanded ? "▴" : "▾"}</span>
      </button>
      <ul id={completedId} className={`${listClass} completed-goal-list`} aria-label="Completed goals" hidden={!expanded}>{rows(completed)}</ul>
    </div> : null}
  </div>;
}

export function OptionalGoalChip({ goal }: { goal: ProgressionGoalView }) {
  const descriptionId = useId();
  return <span className={`goal-secondary-chip${goal.complete ? " is-complete" : ""}`} tabIndex={0}
    title={goal.label} aria-describedby={descriptionId}>
    <span className="goal-secondary-label">Optional: {goal.displayLabel ?? goal.label}</span>
    <span className="goal-secondary-progress">{goal.displayProgressLabel ?? goal.progressLabel}{goal.complete ? " ✓" : ""}</span>
    <span className="goal-secondary-tooltip" role="tooltip" id={descriptionId}>
      Optional objective: {goal.label}. {goal.progressLabel}{goal.complete ? " — complete." : "."}
    </span>
  </span>;
}
