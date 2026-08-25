import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type {
  TutorialActionId,
  TutorialStepView,
} from "../session/tutorialViewModels";
import {
  positionTutorialCoach,
  dockTutorialCoach,
  type TutorialPlacement,
  type TutorialPosition,
  type TutorialRect,
  type TutorialViewport,
} from "./tutorialPositioning";

interface TutorialTargetBeacon {
  top: number;
  left: number;
  direction: TutorialPlacement;
}

function createTargetBeacon(
  target: TutorialRect,
  placement: TutorialPlacement,
  viewport: TutorialViewport,
): TutorialTargetBeacon {
  const size = 36;
  const viewportPadding = 4;
  const viewportLeft = viewport.left ?? 0;
  const viewportTop = viewport.top ?? 0;
  const viewportRight = viewportLeft + viewport.width;
  const viewportBottom = viewportTop + viewport.height;
  const centerX = target.left + target.width / 2 - size / 2;
  const centerY = target.top + target.height / 2 - size / 2;

  if (placement === "top") {
    return {
      top: Math.max(
        viewportTop + viewportPadding,
        target.top - size - 4,
      ),
      left: Math.min(
        Math.max(viewportLeft + viewportPadding, centerX),
        viewportRight - size - viewportPadding,
      ),
      direction: placement,
    };
  }
  if (placement === "bottom") {
    return {
      top: Math.min(
        target.bottom + 4,
        viewportBottom - size - viewportPadding,
      ),
      left: Math.min(
        Math.max(viewportLeft + viewportPadding, centerX),
        viewportRight - size - viewportPadding,
      ),
      direction: placement,
    };
  }
  if (placement === "left") {
    return {
      top: Math.min(
        Math.max(viewportTop + viewportPadding, centerY),
        viewportBottom - size - viewportPadding,
      ),
      left: Math.min(
        Math.max(
          viewportLeft + viewportPadding,
          target.left - size - 4,
        ),
        viewportRight - size - viewportPadding,
      ),
      direction: placement,
    };
  }
  return {
    top: Math.min(
      Math.max(viewportTop + viewportPadding, centerY),
      viewportBottom - size - viewportPadding,
    ),
    left: Math.min(
      Math.max(viewportLeft + viewportPadding, target.right + 4),
      viewportRight - size - viewportPadding,
    ),
    direction: placement,
  };
}

interface TutorialCoachLayout {
  signature: string;
  position: TutorialPosition;
  beacon: TutorialTargetBeacon | null;
}

const POSITION_EPSILON = 0.75;
const MISSING_TARGET_DOCK_DELAY_MS = 180;

function currentViewport(): TutorialViewport {
  const visualViewport = window.visualViewport;
  return visualViewport
    ? {
        // getBoundingClientRect() and position: fixed both use
        // viewport-relative coordinates. visualViewport.offsetTop can mirror
        // the document scroll position in mobile emulation; adding it here
        // mixes coordinate spaces and can place the coach far below the
        // visible screen after scrollIntoView().
        left: 0,
        top: 0,
        width: visualViewport.width,
        height: visualViewport.height,
      }
    : {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
}

function toTutorialRect(rect: DOMRect): TutorialRect {
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function isRenderedElement(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.getAttribute("aria-hidden") !== "true"
  );
}

function findVisibleElement(selector: string): HTMLElement | null {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
      isRenderedElement,
    ) ?? null
  );
}

function targetNeedsOneTimeReveal(
  target: TutorialRect,
  viewport: TutorialViewport,
): boolean {
  const viewportLeft = viewport.left ?? 0;
  const viewportTop = viewport.top ?? 0;
  const viewportRight = viewportLeft + viewport.width;
  const viewportBottom = viewportTop + viewport.height;
  // A phone-width patient row or answer list can be almost the full viewport
  // width while still being a compact, useful control. Reject only targets
  // that are effectively a whole-screen region in both dimensions.
  const smallEnoughToReveal =
    target.width <= viewport.width * 0.98 &&
    target.height <= viewport.height * 0.98 &&
    (target.width <= viewport.width * 0.6 ||
      target.height <= viewport.height * 0.6);
  if (!smallEnoughToReveal) {
    return false;
  }
  const intersectionWidth = Math.max(
    0,
    Math.min(target.right, viewportRight) -
      Math.max(target.left, viewportLeft),
  );
  const intersectionHeight = Math.max(
    0,
    Math.min(target.bottom, viewportBottom) -
      Math.max(target.top, viewportTop),
  );
  const targetArea = Math.max(1, target.width * target.height);
  return (
    (intersectionWidth * intersectionHeight) / targetArea < 0.7
  );
}

function positionsEqual(
  first: TutorialPosition,
  second: TutorialPosition,
): boolean {
  return (
    first.placement === second.placement &&
    first.docked === second.docked &&
    Math.abs(first.top - second.top) <= POSITION_EPSILON &&
    Math.abs(first.left - second.left) <= POSITION_EPSILON &&
    Math.abs(first.width - second.width) <= POSITION_EPSILON &&
    Math.abs(first.maxHeight - second.maxHeight) <=
      POSITION_EPSILON &&
    Math.abs(first.arrowOffset - second.arrowOffset) <=
      POSITION_EPSILON
  );
}

function beaconsEqual(
  first: TutorialTargetBeacon | null,
  second: TutorialTargetBeacon | null,
): boolean {
  if (first === null || second === null) {
    return first === second;
  }
  return (
    first.direction === second.direction &&
    Math.abs(first.top - second.top) <= POSITION_EPSILON &&
    Math.abs(first.left - second.left) <= POSITION_EPSILON
  );
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
  const schedulePositionRef = useRef<() => void>(() => undefined);
  const coachDescriptionId = useId();
  const coachTitleId = useId();
  const [layout, setLayout] = useState<TutorialCoachLayout | null>(
    null,
  );
  const targetSelector = step?.targetSelector ?? null;
  const avoidSelector = step?.avoidSelector ?? null;
  const targetKind = step?.target ?? null;
  const patientEncounterId = step?.patientEncounterId ?? null;
  const anchorSignature =
    shown && step && targetSelector
      ? [
          step.id,
          targetKind,
          targetSelector,
          avoidSelector ?? "",
          patientEncounterId ?? "",
        ].join("\u001f")
      : null;
  const activeLayout =
    layout?.signature === anchorSignature ? layout : null;
  const position = activeLayout?.position ?? null;
  const targetBeacon = activeLayout?.beacon ?? null;

  useLayoutEffect(() => {
    if (
      !shown ||
      !anchorSignature ||
      !targetSelector ||
      !targetKind
    ) {
      schedulePositionRef.current = () => undefined;
      return;
    }
    const coach = coachRef.current;
    if (!coach) {
      return;
    }

    let animationFrame = 0;
    let animationWaitPending = false;
    let missingTargetTimer = 0;
    let cancelled = false;
    let revealAttempted = false;
    let currentTarget: HTMLElement | null = null;
    let currentAvoidance: HTMLElement | null = null;
    let previousTutorialTarget: string | undefined;
    let lastPosition: TutorialPosition | null = null;

    const resizeObserver = new ResizeObserver(() => {
      schedulePositionRef.current();
    });
    const coachContent = coach.querySelector<HTMLElement>(
      ".tutorial-coach-content",
    );
    if (coachContent) {
      resizeObserver.observe(coachContent);
    }

    const removeCoachDescription = (element: HTMLElement) => {
      const descriptionIds = (
        element.getAttribute("aria-describedby") ?? ""
      )
        .split(/\s+/)
        .filter(
          (descriptionId) =>
            descriptionId.length > 0 &&
            descriptionId !== coachDescriptionId,
        );
      if (descriptionIds.length > 0) {
        element.setAttribute(
          "aria-describedby",
          descriptionIds.join(" "),
        );
      } else {
        element.removeAttribute("aria-describedby");
      }
    };

    const detachTarget = () => {
      if (!currentTarget) {
        return;
      }
      resizeObserver.unobserve(currentTarget);
      currentTarget.classList.remove("tutorial-target-highlight");
      if (previousTutorialTarget === undefined) {
        delete currentTarget.dataset.tutorialTarget;
      } else {
        currentTarget.dataset.tutorialTarget =
          previousTutorialTarget;
      }
      removeCoachDescription(currentTarget);
      currentTarget = null;
      previousTutorialTarget = undefined;
    };

    const decorateTarget = (target: HTMLElement) => {
      if (!target.classList.contains("tutorial-target-highlight")) {
        target.classList.add("tutorial-target-highlight");
      }
      if (target.dataset.tutorialTarget !== targetKind) {
        target.dataset.tutorialTarget = targetKind;
      }
      const descriptionIds = new Set(
        (target.getAttribute("aria-describedby") ?? "")
          .split(/\s+/)
          .filter(Boolean),
      );
      descriptionIds.add(coachDescriptionId);
      const nextDescription = [...descriptionIds].join(" ");
      if (
        target.getAttribute("aria-describedby") !== nextDescription
      ) {
        target.setAttribute("aria-describedby", nextDescription);
      }
    };

    const attachTarget = (target: HTMLElement) => {
      if (currentTarget === target) {
        // React may legitimately update the target's own className while a
        // tutorial remains on the same step. Restore only our decoration
        // without restarting the anchor lifecycle.
        decorateTarget(target);
        return;
      }
      detachTarget();
      currentTarget = target;
      previousTutorialTarget = target.dataset.tutorialTarget;
      decorateTarget(target);
      resizeObserver.observe(target);
      revealAttempted = false;
    };

    const attachAvoidance = (avoidance: HTMLElement) => {
      if (currentAvoidance === avoidance) {
        return;
      }
      if (
        currentAvoidance &&
        currentAvoidance !== currentTarget
      ) {
        resizeObserver.unobserve(currentAvoidance);
      }
      currentAvoidance = avoidance;
      if (avoidance !== currentTarget) {
        resizeObserver.observe(avoidance);
      }
    };

    const coachSize = () => ({
      width: coach.getBoundingClientRect().width,
      height:
        (coachContent?.scrollHeight ?? coach.scrollHeight) + 10,
    });

    const commitLayout = (
      nextPosition: TutorialPosition,
      beacon: TutorialTargetBeacon | null,
    ) => {
      if (cancelled) {
        return;
      }
      lastPosition = nextPosition;
      setLayout((current) => {
        if (
          current?.signature === anchorSignature &&
          positionsEqual(current.position, nextPosition) &&
          beaconsEqual(current.beacon, beacon)
        ) {
          return current;
        }
        return {
          signature: anchorSignature,
          position: nextPosition,
          beacon,
        };
      });
    };

    const dockWithoutTarget = () => {
      if (cancelled || currentTarget) {
        return;
      }
      const nextPosition = dockTutorialCoach(
        null,
        coachSize(),
        currentViewport(),
      );
      commitLayout(nextPosition, null);
    };

    const scheduleMissingTargetDock = () => {
      if (missingTargetTimer !== 0) {
        return;
      }
      missingTargetTimer = window.setTimeout(() => {
        missingTargetTimer = 0;
        dockWithoutTarget();
      }, MISSING_TARGET_DOCK_DELAY_MS);
    };

    const updatePosition = () => {
      if (cancelled) {
        return;
      }
      const target = findVisibleElement(targetSelector);
      if (!target) {
        if (
          currentAvoidance &&
          currentAvoidance !== currentTarget
        ) {
          resizeObserver.unobserve(currentAvoidance);
        }
        currentAvoidance = null;
        detachTarget();
        scheduleMissingTargetDock();
        return;
      }
      if (missingTargetTimer !== 0) {
        window.clearTimeout(missingTargetTimer);
        missingTargetTimer = 0;
      }
      attachTarget(target);
      const avoidance =
        (avoidSelector
          ? findVisibleElement(avoidSelector)
          : null) ?? target;
      attachAvoidance(avoidance);
      const animationRoot =
        target.closest<HTMLElement>(".chart-panel") ?? target;
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
        if (!animationWaitPending) {
          animationWaitPending = true;
          void Promise.allSettled(
            runningAnimations.map((animation) => animation.finished),
          ).then(() => {
            animationWaitPending = false;
            schedulePositionRef.current();
          });
        }
        // Once a card has a valid location, keep it there through a short
        // chart transition instead of flashing back to a viewport corner.
        return;
      }
      const viewport = currentViewport();
      let targetRect = toTutorialRect(
        target.getBoundingClientRect(),
      );
      if (
        !revealAttempted &&
        targetNeedsOneTimeReveal(targetRect, viewport)
      ) {
        revealAttempted = true;
        target.scrollIntoView({
          behavior: "auto",
          // Some phone layouts keep the patient rail below the facility.
          // Chromium may leave a fully offscreen target untouched with
          // block:"nearest" in that nested flex layout. Centering makes the
          // one-time reveal deterministic and gives the coach honest room on
          // either side of the real control.
          block: "center",
          inline: "nearest",
        });
        schedulePositionRef.current();
        return;
      }
      revealAttempted = true;
      // A phone chart is intentionally a full-screen sheet, so treating the
      // entire chart as forbidden space would hide the tutorial. At that
      // width, protect the real target itself and allow the compact coach to
      // use another part of the sheet without blocking the required action.
      const effectiveAvoidance =
        viewport.width <= 760 &&
        target.closest(".paper-chart") !== null
          ? target
          : avoidance;
      targetRect = toTutorialRect(
        target.getBoundingClientRect(),
      );
      const avoidanceRect = toTutorialRect(
        effectiveAvoidance.getBoundingClientRect(),
      );
      const nextPosition = positionTutorialCoach(
        targetRect,
        coachSize(),
        viewport,
        avoidanceRect,
        lastPosition && !lastPosition.docked
          ? lastPosition.placement
          : undefined,
      );
      commitLayout(
        nextPosition,
        nextPosition.docked
          ? null
          : createTargetBeacon(
              targetRect,
              nextPosition.placement,
              viewport,
            ),
      );
    };

    const scheduleUpdate = () => {
      if (cancelled || animationFrame !== 0) {
        return;
      }
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updatePosition();
      });
    };

    schedulePositionRef.current = scheduleUpdate;
    scheduleUpdate();
    const handleScroll = (event: Event) => {
      const eventTarget = event.target;
      if (
        eventTarget instanceof Node &&
        coach.contains(eventTarget)
      ) {
        return;
      }
      scheduleUpdate();
    };
    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "open", "aria-hidden"],
    });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", handleScroll, true);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("scroll", scheduleUpdate);
    // Flex and grid siblings can move a target without changing the target's
    // own size (for example, when a new alert enters the feed). Recheck the
    // geometry occasionally, but equality checks and placement hysteresis
    // ensure this safety check cannot create visible movement by itself.
    const positionInterval = window.setInterval(scheduleUpdate, 600);

    return () => {
      cancelled = true;
      if (schedulePositionRef.current === scheduleUpdate) {
        schedulePositionRef.current = () => undefined;
      }
      window.cancelAnimationFrame(animationFrame);
      if (missingTargetTimer !== 0) {
        window.clearTimeout(missingTargetTimer);
      }
      window.clearInterval(positionInterval);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", handleScroll, true);
      window.visualViewport?.removeEventListener(
        "resize",
        scheduleUpdate,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        scheduleUpdate,
      );
      detachTarget();
    };
  }, [
    anchorSignature,
    avoidSelector,
    coachDescriptionId,
    shown,
    targetKind,
    targetSelector,
  ]);

  useLayoutEffect(() => {
    schedulePositionRef.current();
  }, [
    step?.body,
    step?.eyebrow,
    step?.flavor,
    step?.note,
    step?.primaryAction?.label,
    step?.secondaryAction?.label,
    step?.title,
  ]);

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

  const primaryActionId =
    step.primaryAction?.id ?? "acknowledge-step";
  const primaryActionLabel = step.primaryAction?.label ?? "Got It";
  const secondaryAction = step.secondaryAction;
  const completingTutorial =
    primaryActionId === "complete-tutorial";
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
    : ({
        top: "12px",
        left: "12px",
        width: "min(390px, calc(100vw - 24px))",
        maxHeight: "calc(100vh - 2rem)",
        visibility: "hidden",
        pointerEvents: "none",
      } as CSSProperties);

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
        data-anchor-mode={
          position
            ? position.docked
              ? "docked"
              : "anchored"
            : "locating"
        }
        data-anchor-state={
          position
            ? position.docked
              ? "docked"
              : "anchored"
            : "locating"
        }
        data-docked={position?.docked ? "true" : "false"}
        data-target-positioned={
          position && !position.docked ? "true" : "false"
        }
        role="region"
        aria-labelledby={coachTitleId}
        aria-live="polite"
        style={positionStyle}
      >
        {position && !position.docked ? (
          <span className="tutorial-coach-arrow" aria-hidden="true">
            ➜
          </span>
        ) : null}
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
          <button
            className="button button-secondary"
            type="button"
            data-tutorial-action={primaryActionId}
            onClick={() => onAction?.(primaryActionId)}
          >
            {primaryActionLabel}
          </button>
          {secondaryAction ? (
            <button
              className="button button-secondary"
              type="button"
              data-tutorial-action={secondaryAction.id}
              onClick={() => onAction?.(secondaryAction.id)}
            >
              {secondaryAction.label}
            </button>
          ) : null}
          {onDisableTutorials && !completingTutorial ? (
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
