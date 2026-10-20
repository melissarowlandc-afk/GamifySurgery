import { useEffect, useId, useState } from "react";
import type { TutorialActionId, TutorialStepView, TutorialTarget } from "../session/tutorialViewModels";
import type { MobileSheetId, MobileTab } from "./navigation";

const TARGET_TAB: Partial<Record<TutorialTarget, MobileTab>> = {
  "waiting-patient": "patients", "existing-patient": "patients", "waiting-actions": "patients",
  chart: "patients", "answer-choices": "patients", "chart-feedback": "patients", "encounter-summary": "patients",
  "flip-chart": "patients", "resolve-chart": "patients", alerts: "alerts", management: "manage",
  goals: "clinic", "level-up": "clinic", "build-mode": "build", "exam-room-option": "build",
  "room-selection": "build", "door-tool": "build", "exit-build-mode": "build",
};
const CHART_TARGETS: readonly TutorialTarget[] = ["chart", "answer-choices", "chart-feedback", "encounter-summary", "flip-chart", "resolve-chart"];
const LABELS: Record<MobileTab, string> = { clinic: "Clinic", patients: "Patients", alerts: "Alerts", manage: "Manage", build: "Build" };

/** Legacy tab-hint helper. MobileShell now uses the complete phone marker resolver. */
export function mobileTutorialTab(step: TutorialStepView | null, sheet?: MobileSheetId): MobileTab | null {
  if (!step) return null;
  const tab = TARGET_TAB[step.target];
  if (!tab) return null; // Clock and map targets remain visible without changing tabs.
  if (CHART_TARGETS.includes(step.target)) return sheet === "chart" || sheet === "discussion" ? null : "patients";
  if (step.target === "goals" || step.target === "level-up") return sheet === "goals" || sheet === undefined ? null : "clinic";
  return sheet === tab ? null : tab;
}

const stopMapGesture = (event: { stopPropagation: () => void }) => event.stopPropagation();

/** Phone-only copy: a tap on the patient in the map also opens the chart. Step IDs and progression are shared. */
const PHONE_BODY: Partial<Record<string, string>> = {
  "open-first-chart": "Go to Patients, or tap the patient on the map, to open their chart. The exclamation point means they need you.",
  "open-second-chart": "Go to Patients, or tap the patient on the map, to open their chart.",
  "speed-controls-tour": "Use Pause and Play in the top bar. Tap the speed button to cycle 1×, 2×, 4×, then back to 1×. Time only runs while unpaused; changing speed does not press Play. Speed up while waiting, or pause to think.",
  "advertising-tour": "Tap Advertising at the top middle of the Clinic map, then use + / −. It makes regular patients arrive more often once Level 1 opens; the two introductory visits keep their own schedule. Raise it when quiet and you have capacity; lower it when busy or money is tight.",
};
export const mobileTutorialBody = (step: TutorialStepView) => PHONE_BODY[step.id] ?? step.body;

export function MobileTutorialCoach({ step, targetTab, chartScreen = false, targetLabel, navigationLabel, onNavigate, onAction, onDisableTutorials, onTopicExposure }: {
  step: TutorialStepView | null;
  targetTab: MobileTab | null;
  chartScreen?: boolean;
  targetLabel?: string;
  navigationLabel?: string;
  onNavigate: (tab: MobileTab) => void;
  onAction: (id: TutorialActionId) => void;
  onDisableTutorials: () => void;
  onTopicExposure?: (topicIds: readonly string[]) => void;
}) {
  const [disclosure, setDisclosure] = useState({ chartScreen, expanded: !chartScreen });
  // Collapse on chart entry, including the first render, without changing the step.
  const expanded = disclosure.chartScreen === chartScreen ? disclosure.expanded : !chartScreen;
  useEffect(() => { setDisclosure({ chartScreen, expanded: !chartScreen }); }, [chartScreen]);
  const titleId = useId();
  const bodyId = useId();
  const exposureKey = step?.topicIds?.join("|") ?? "";
  useEffect(() => {
    if (!step || !expanded || !exposureKey || !onTopicExposure) return;
    // Match the existing coach's six-second readable-pointer exposure. No new progression gate.
    const timer = window.setTimeout(() => onTopicExposure(exposureKey.split("|")), 6_000);
    return () => window.clearTimeout(timer);
  }, [step?.id, expanded, exposureKey, onTopicExposure]);
  if (!step) return null;
  return <aside className={`mobile-tutorial-coach${expanded ? " is-expanded" : " is-collapsed"}`}
    role="region" aria-labelledby={titleId} data-tutorial-step={step.id} data-anchor-mode="docked"
    onPointerDown={stopMapGesture} onPointerUp={stopMapGesture} onClick={stopMapGesture}>
    <div className="mobile-coach-heading"><div><small>{step.eyebrow}{targetTab ? ` · ${LABELS[targetTab]} ↓` : ""}</small><h2 id={titleId}>{step.title}</h2></div>
      {!expanded && targetTab ? <button type="button" className="mobile-coach-target" onClick={() => onNavigate(targetTab)}>Go to {navigationLabel ?? LABELS[targetTab]} <span aria-hidden="true">↓</span></button> : null}
      <button type="button" aria-expanded={expanded} aria-controls={bodyId} onClick={() => setDisclosure({ chartScreen, expanded: !expanded })}
        aria-label={expanded ? "Collapse guidance" : "Expand guidance"}>{expanded ? "−" : "+"}</button>
    </div>
    <div className="mobile-coach-copy" id={bodyId} hidden={!expanded}>
      <p>{mobileTutorialBody(step)}</p>
      {targetLabel && !targetTab ? <p className="mobile-coach-location">On this screen: {targetLabel}.</p> : null}
      {expanded && targetTab ? <button type="button" className="mobile-coach-target" onClick={() => onNavigate(targetTab)}>Go to {navigationLabel ?? LABELS[targetTab]} <span aria-hidden="true">↓</span></button> : null}
      {step.note ? <p>{step.note}</p> : null}{step.flavor ? <p>{step.flavor}</p> : null}
      <div className="mobile-coach-actions">
        {step.primaryAction ? <button type="button" onClick={() => onAction(step.primaryAction!.id)}>{step.primaryAction.label}</button> : null}
        {step.secondaryAction ? <button type="button" onClick={() => onAction(step.secondaryAction!.id)}>{step.secondaryAction.label}</button> : null}
        <button type="button" onClick={onDisableTutorials}>Skip guidance</button>
      </div>
    </div>
  </aside>;
}
