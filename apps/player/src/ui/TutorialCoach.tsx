import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type {
  TutorialActionId,
  TutorialActionView,
  TutorialStepView,
} from "../session/tutorialViewModels";
import {
  positionTutorialCoach,
  type TutorialPlacement,
  type TutorialPosition,
} from "./tutorialPositioning";

interface TutorialTargetBeacon {
  top: number;
  left: number;
  direction: TutorialPlacement;
}

function createTargetBeacon(
  target: DOMRect,
  placement: TutorialPlacement,
): TutorialTargetBeacon {
  const size = 36;
  const viewportPadding = 4;
  const centerX = target.left + target.width / 2 - size / 2;
  const centerY = target.top + target.height / 2 - size / 2;

  if (placement === "top") {
    return {
      top: Math.max(viewportPadding, target.top - size - 4),
      left: Math.min(
        Math.max(viewportPadding, centerX),
        window.innerWidth - size - viewportPadding,
      ),
      direction: placement,
    };
  }
  if (placement === "bottom") {
    return {
      top: Math.min(
        target.bottom + 4,
        window.innerHeight - size - viewportPadding,
      ),
      left: Math.min(
        Math.max(viewportPadding, centerX),
        window.innerWidth - size - viewportPadding,
      ),
      direction: placement,
    };
  }
  if (placement === "left") {
    return {
      top: Math.min(
        Math.max(viewportPadding, centerY),
        window.innerHeight - size - viewportPadding,
      ),
      left: Math.max(viewportPadding, target.left - size - 4),
      direction: placement,
    };
  }
  return {
    top: Math.min(
      Math.max(viewportPadding, centerY),
      window.innerHeight - size - viewportPadding,
    ),
    left: Math.min(
      target.right + 4,
      window.innerWidth - size - viewportPadding,
    ),
    direction: placement,
  };
}

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
}: TutorialCoachProps) {
  const shown = step !== null || visible;
  const coachRef = useRef<HTMLElement>(null);
  const coachDescriptionId = useId();
  const coachTitleId = useId();
  const [position, setPosition] =
    useState<TutorialPosition | null>(null);
  const [targetBeacon, setTargetBeacon] =
    useState<TutorialTargetBeacon | null>(null);

  useLayoutEffect(() => {
    if (!shown || !step?.targetSelector) {
      setPosition(null);
      setTargetBeacon(null);
      return;
    }
    const target = document.querySelector<HTMLElement>(
      step.targetSelector,
    );
    const coach = coachRef.current;
    if (!target || !coach) {
      setPosition(null);
      setTargetBeacon(null);
      return;
    }
    const avoidance =
      (step.avoidSelector
        ? document.querySelector<HTMLElement>(step.avoidSelector)
        : null) ?? target;
    const animationRoot =
      target.closest<HTMLElement>(".chart-panel") ?? target;

    const previousDescription =
      target.getAttribute("aria-describedby");
    target.classList.add("tutorial-target-highlight");
    target.dataset.tutorialTarget = step.target;
    target.setAttribute(
      "aria-describedby",
      [previousDescription, coachDescriptionId]
      .filter(Boolean)
      .join(" "),
    );

    let animationFrame = 0;
    let animationWaitPending = false;
    let cancelled = false;
    setPosition(null);
    setTargetBeacon(null);
    const updatePosition = () => {
      if (cancelled) {
        return;
      }
      const runningAnimations = animationRoot
        .getAnimations({ subtree: true })
        .filter((animation) => {
          const iterations = animation.effect?.getTiming().iterations;
          return (
            animation.playState === "running" &&
            iterations !== Infinity
          );
        });
      if (runningAnimations.length > 0) {
        setPosition(null);
        setTargetBeacon(null);
        if (!animationWaitPending) {
          animationWaitPending = true;
          void Promise.allSettled(
            runningAnimations.map((animation) => animation.finished),
          ).then(() => {
            animationWaitPending = false;
            updatePosition();
          });
        }
        return;
      }
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        let targetRect = target.getBoundingClientRect();
        const targetOutsideViewport =
          targetRect.top < 12 ||
          targetRect.left < 12 ||
          targetRect.bottom > window.innerHeight - 12 ||
          targetRect.right > window.innerWidth - 12;
        if (targetOutsideViewport) {
          target.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "nearest",
          });
          targetRect = target.getBoundingClientRect();
        }
        // A phone chart is intentionally a full-screen sheet, so treating the
        // entire chart as forbidden space would hide the tutorial. At that
        // width, protect the real target itself and allow the compact coach to
        // use another part of the sheet without blocking the required action.
        const effectiveAvoidance =
          window.innerWidth <= 760 &&
          target.closest(".paper-chart") !== null
            ? target
            : avoidance;
        const avoidanceRect =
          effectiveAvoidance.getBoundingClientRect();
        const coachRect = coach.getBoundingClientRect();
        const coachContent =
          coach.querySelector<HTMLElement>(
            ".tutorial-coach-content",
          );
        const nextPosition = positionTutorialCoach(
            {
              top: targetRect.top,
              right: targetRect.right,
              bottom: targetRect.bottom,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            },
            {
              width: coachRect.width,
              height:
                (coachContent?.scrollHeight ??
                  coach.scrollHeight) + 10,
            },
            {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            {
              top: avoidanceRect.top,
              right: avoidanceRect.right,
              bottom: avoidanceRect.bottom,
              left: avoidanceRect.left,
              width: avoidanceRect.width,
              height: avoidanceRect.height,
            },
          );
        setPosition(nextPosition);
        setTargetBeacon(
          nextPosition
            ? createTargetBeacon(targetRect, nextPosition.placement)
            : null,
        );
      });
    };

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(target);
    if (avoidance !== target) {
      resizeObserver.observe(avoidance);
    }
    resizeObserver.observe(coach);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      target.classList.remove("tutorial-target-highlight");
      delete target.dataset.tutorialTarget;
      if (previousDescription) {
        target.setAttribute(
          "aria-describedby",
          previousDescription,
        );
      } else {
        target.removeAttribute("aria-describedby");
      }
    };
  }, [coachDescriptionId, shown, step]);

  if (!shown) {
    return null;
  }

  if (!step) {
    return (
      <aside
        ref={coachRef}
        className="tutorial-coach"
        role="region"
        aria-labelledby={coachTitleId}
      >
        <div className="tutorial-coach-content">
          <span className="eyebrow">Level 0 tutorial · Step 1</span>
          <h2 id={coachTitleId}>Open your first patient chart</h2>
          <p>
            Patients arrive in the <strong>Waiting</strong> folder. Open{" "}
            <strong>{patientName}</strong> to read the presentation and make
            the first clinical decision.
          </p>
          <p className="tutorial-coach-note">
            Facility time continues while this guide is visible. Pause
            whenever you want more time.
          </p>
          <p className="tutorial-coach-instruction">
            Click the patient tab itself to continue.
          </p>
        </div>
      </aside>
    );
  }

  // Tutorial cards can advance an explanation, but never perform the
  // highlighted gameplay action on the player's behalf.
  const tutorialOnlyActions = [
    step.primaryAction,
    step.secondaryAction,
  ].filter(
    (
      action,
    ): action is TutorialActionView =>
      action?.id === "acknowledge-step",
  );
  const positionStyle = position
    ? ({
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxHeight: `${position.maxHeight}px`,
        "--tutorial-arrow-offset": `${position.arrowOffset}px`,
        "--tutorial-content-max-height": `${Math.max(
          96,
          position.maxHeight - 10,
        )}px`,
      } as CSSProperties)
    : ({ visibility: "hidden" } as CSSProperties);

  return (
    <>
      {targetBeacon ? (
        <span
          className="tutorial-target-beacon"
          data-direction={targetBeacon.direction}
          aria-hidden="true"
          style={{
            top: `${targetBeacon.top}px`,
            left: `${targetBeacon.left}px`,
          }}
        >
          ➜
        </span>
      ) : null}
      <aside
        ref={coachRef}
        className={`tutorial-coach tutorial-coach--${step.target}`}
        data-tutorial-step={step.id}
        data-placement={position?.placement}
        data-target-positioned={position ? "true" : "false"}
        role="region"
        aria-labelledby={coachTitleId}
        aria-live="polite"
        style={positionStyle}
      >
        <span className="tutorial-coach-arrow" aria-hidden="true">
          ➜
        </span>
        <div className="tutorial-coach-content">
        <span className="eyebrow">{step.eyebrow}</span>
        <h2 id={coachTitleId}>{step.title}</h2>
        {step.body ? (
          <p id={coachDescriptionId}>{step.body}</p>
        ) : (
          <span id={coachDescriptionId} className="screen-reader-only">
            Follow the highlighted control.
          </span>
        )}
        {step.note ? (
          <p className="tutorial-coach-note">{step.note}</p>
        ) : null}
        {step.flavor ? (
          <p className="tutorial-coach-flavor">{step.flavor}</p>
        ) : null}
        <div className="tutorial-coach-actions">
          {tutorialOnlyActions.map((action) => (
            <button
              key={action.id}
              className="button button-secondary"
              type="button"
              onClick={() => onAction?.(action.id)}
            >
              {action.label}
            </button>
          ))}
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
        </div>
      </aside>
    </>
  );
}
