import { useEffect } from "react";
import type {
  TutorialActionId,
  TutorialStepView,
} from "../session/tutorialViewModels";

interface TutorialCoachProps {
  /** New deterministic tutorial bubble. */
  step?: TutorialStepView | null;
  onAction?: (actionId: TutorialActionId) => void;
  onDisableTutorials?: () => void;
  /**
   * Legacy first-step props remain optional while AppShell migrates to the
   * step-driven interface.
   */
  visible?: boolean;
  patientName?: string;
  onOpenPatient?: () => void;
  onDismiss?: () => void;
}

export function TutorialCoach({
  step = null,
  onAction,
  onDisableTutorials,
  visible = false,
  patientName = "the first patient",
  onOpenPatient,
  onDismiss,
}: TutorialCoachProps) {
  const shown = step !== null || visible;

  useEffect(() => {
    if (!shown || !step?.targetSelector) {
      return;
    }
    const target = document.querySelector<HTMLElement>(
      step.targetSelector,
    );
    if (!target) {
      return;
    }
    target.classList.add("tutorial-target-highlight");
    target.dataset.tutorialTarget = step.target;
    return () => {
      target.classList.remove("tutorial-target-highlight");
      delete target.dataset.tutorialTarget;
    };
  }, [shown, step]);

  if (!shown) {
    return null;
  }

  if (!step) {
    return (
      <aside
        className="tutorial-coach"
        role="region"
        aria-labelledby="tutorial-coach-title"
      >
        <span className="eyebrow">Level 0 tutorial · Step 1</span>
        <h2 id="tutorial-coach-title">Open your first patient chart</h2>
        <p>
          Patients arrive in the <strong>Waiting</strong> folder. Open{" "}
          <strong>{patientName}</strong> to read the presentation and make
          the first clinical decision.
        </p>
        <p className="tutorial-coach-note">
          Facility time continues while this guide is visible. Pause whenever
          you want more time.
        </p>
        <div className="tutorial-coach-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={onOpenPatient}
          >
            Open first chart
          </button>
          <button
            className="text-button"
            type="button"
            onClick={onDismiss}
          >
            Show me where
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`tutorial-coach tutorial-coach--${step.target}`}
      data-tutorial-step={step.id}
      role="region"
      aria-labelledby="tutorial-coach-title"
      aria-live="polite"
    >
      <span className="tutorial-coach-arrow" aria-hidden="true">
        ➜
      </span>
      <span className="eyebrow">{step.eyebrow}</span>
      <h2 id="tutorial-coach-title">{step.title}</h2>
      <p>{step.body}</p>
      {step.note ? (
        <p className="tutorial-coach-note">{step.note}</p>
      ) : null}
      {step.flavor ? (
        <p className="tutorial-coach-flavor">{step.flavor}</p>
      ) : null}
      <div className="tutorial-coach-actions">
        {step.primaryAction ? (
          <button
            className="button button-primary"
            type="button"
            onClick={() => onAction?.(step.primaryAction!.id)}
          >
            {step.primaryAction.label}
          </button>
        ) : null}
        {step.secondaryAction ? (
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onAction?.(step.secondaryAction!.id)}
          >
            {step.secondaryAction.label}
          </button>
        ) : null}
        {onDisableTutorials ? (
          <button
            className="text-button tutorial-disable-button"
            type="button"
            onClick={onDisableTutorials}
          >
            Turn off tutorials
          </button>
        ) : null}
      </div>
    </aside>
  );
}
